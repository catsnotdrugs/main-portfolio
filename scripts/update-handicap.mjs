#!/usr/bin/env node
// Logs in to GHIN, fetches the current handicap index, and writes
// src/data/handicap.json so the homepage shows a live number.
//
// Requires three env vars:
//   GHIN_EMAIL    your GHIN account email
//   GHIN_PASSWORD your GHIN password
//   GHIN_NUMBER   your 7-digit GHIN id (only used as a fallback identifier)
//
// Exits 0 even if the fetch fails, leaving the existing handicap.json in
// place. That way a transient GHIN outage never breaks the build.

import { writeFile, readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "../src/data/handicap.json");

const email = process.env.GHIN_EMAIL;
const password = process.env.GHIN_PASSWORD;
const ghin = process.env.GHIN_NUMBER ?? "12459973";

function softExit(reason) {
  console.warn(`[handicap] ${reason}. Leaving handicap.json untouched.`);
  process.exit(0);
}

if (!email || !password) {
  softExit("GHIN_EMAIL or GHIN_PASSWORD not set");
}

const API = "https://api.ghin.com/api/v1";

async function login() {
  const res = await fetch(`${API}/golfers/login.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: { email_or_ghin: email, password, remember_me: false },
    }),
  });
  if (!res.ok) throw new Error(`login HTTP ${res.status}`);
  const data = await res.json();
  const token = data?.golfer_user?.golfer_user_token ?? data?.token;
  if (!token) throw new Error("no token in login response");
  return token;
}

async function fetchHandicap(token) {
  const url = `${API}/golfers/${ghin}.json`;
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`golfer HTTP ${res.status}`);
  const data = await res.json();
  const golfer = data?.golfer ?? data;
  const index = golfer?.handicap_index ?? golfer?.HandicapIndex;
  if (index === undefined || index === null) throw new Error("no handicap_index in response");
  return String(index);
}

const today = () => {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
};

try {
  const token = await login();
  const index = await fetchHandicap(token);
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
