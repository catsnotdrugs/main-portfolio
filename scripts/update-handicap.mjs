#!/usr/bin/env node
// Logs in to GHIN, fetches the current handicap index, and writes
// src/data/handicap.json so the homepage shows a live number.
//
// GHIN's API at api2.ghin.com gates every call behind a static-key
// AES-128-ECB token containing a {source, datetime} payload. The web
// app does the same dance client side; the key is shipped in their JS
// bundle. If they ever rotate it the request will 401 and the script
// keeps the existing handicap.json (the build never breaks).
//
// Env vars:
//   GHIN_EMAIL    your GHIN account email
//   GHIN_PASSWORD your GHIN password
//   GHIN_NUMBER   your 7-digit GHIN id (used as the lookup id)

import { writeFile, readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "../src/data/handicap.json");

const email = process.env.GHIN_EMAIL;
const password = process.env.GHIN_PASSWORD;
const ghin = process.env.GHIN_NUMBER ?? "12459973";

const API = "https://api2.ghin.com/api/v1";
const STATIC_KEY = "dfcb55cf100e8249af7a25b67250341c";

function softExit(reason) {
  console.warn(`[handicap] ${reason}. Leaving handicap.json untouched.`);
  process.exit(0);
}

function makeToken() {
  const key = Buffer.from(STATIC_KEY, "hex");
  const payload = JSON.stringify({ source: "GHINcom", datetime: new Date().toISOString() });
  const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
  return Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]).toString("base64");
}

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Origin": "https://www.ghin.com",
  "Referer": "https://www.ghin.com/",
};

async function login() {
  const res = await fetch(`${API}/golfer_login.json`, {
    method: "POST",
    headers: { ...BROWSER_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({
      user: { email_or_ghin: email, password, remember_me: false },
      token: makeToken(),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`login HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  // For diagnostics in CI, show the top-level shape.
  console.log("[handicap] login keys:", Object.keys(data ?? {}).join(","));
  if (data?.golfer_user) {
    console.log("[handicap] golfer_user keys:", Object.keys(data.golfer_user).join(","));
  }
  return data;
}

function extractHandicap(login) {
  // The login response carries the golfer's profile in golfer_user.golfers[].
  // GHIN puts the formatted handicap display ("22.8" or "+1.2") in `display`.
  const golfers = login?.golfer_user?.golfers ?? [];
  if (golfers.length > 0) {
    const match =
      golfers.find((g) => String(g.ghin_number ?? g.golfer_id ?? g.GolferID) === String(ghin)) ??
      golfers[0];
    if (match) {
      console.log("[handicap] golfer record keys:", Object.keys(match).join(","));
      console.log("[handicap] display:", match.display, "low_hi_display:", match.low_hi_display);
      const index =
        match.display ??
        match.handicap_index ??
        match.HandicapIndex ??
        match.handicap_index_text;
      if (index !== undefined && index !== null && index !== "") return String(index);
    }
  }
  return null;
}

async function fetchHandicap(login, sessionToken) {
  const fromLogin = extractHandicap(login);
  if (fromLogin) return fromLogin;

  // Login carries the profile but not the handicap. Hit handicap_history.
  const res = await fetch(`${API}/golfers/${ghin}/handicap_history.json`, {
    headers: {
      ...BROWSER_HEADERS,
      "Authorization": `Bearer ${sessionToken}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`handicap_history HTTP ${res.status}: ${text.slice(0, 120)}`);
  }
  const data = await res.json();
  console.log("[handicap] history keys:", Object.keys(data ?? {}).join(","));
  // GHIN returns revisions in reverse chronological order with the current
  // index on top. Try a handful of plausible field names.
  const history = data?.handicap_revisions ?? data?.revisions ?? data?.history ?? data?.handicap_history ?? [];
  if (Array.isArray(history) && history.length > 0) {
    console.log("[handicap] latest revision keys:", Object.keys(history[0]).join(","));
    const latest = history[0];
    const index =
      latest?.display ??
      latest?.handicap_index ??
      latest?.handicap_index_display ??
      latest?.Value;
    if (index !== undefined && index !== null) return String(index);
  }
  throw new Error("no handicap_index in handicap_history response");
}

const today = () => {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
};

if (!email || !password) {
  softExit("GHIN_EMAIL or GHIN_PASSWORD not set");
}

try {
  const loginResponse = await login();
  const sessionToken =
    loginResponse?.golfer_user?.golfer_user_token ??
    loginResponse?.token ??
    "";
  const index = await fetchHandicap(loginResponse, sessionToken);
  const payload = { index, updated: today(), source: "ghin" };
  await writeFile(OUTPUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`[handicap] Wrote ${index} (${payload.updated})`);
} catch (err) {
  try {
    const current = JSON.parse(await readFile(OUTPUT, "utf8"));
    console.warn(`[handicap] Fetch failed (${err.message}). Keeping ${current.index} from ${current.updated}.`);
  } catch {
    console.warn(`[handicap] Fetch failed (${err.message}). No existing handicap.json to keep.`);
  }
  process.exit(0);
}
