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
  const token = data?.golfer_user?.golfer_user_token ?? data?.token;
  if (!token) throw new Error("no session token in login response");
  return token;
}

async function fetchHandicap(sessionToken) {
  const res = await fetch(`${API}/golfers/${ghin}.json`, {
    headers: {
      ...BROWSER_HEADERS,
      "Authorization": `Bearer ${sessionToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`golfer HTTP ${res.status}`);
  const data = await res.json();
  const golfer = data?.golfer ?? data?.golfers?.[0] ?? data;
  const index =
    golfer?.handicap_index ??
    golfer?.HandicapIndex ??
    golfer?.handicap_index_text;
  if (index === undefined || index === null) throw new Error("no handicap_index in response");
  return String(index);
}

const today = () => {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
};

if (!email || !password) {
  softExit("GHIN_EMAIL or GHIN_PASSWORD not set");
}

try {
  const sessionToken = await login();
  const index = await fetchHandicap(sessionToken);
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
