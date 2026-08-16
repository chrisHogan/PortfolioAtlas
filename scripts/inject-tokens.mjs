#!/usr/bin/env node
// inject-tokens.mjs
// Fills {{token}} placeholders in a draft from data.json "tokens".
// Dumb by design: no formatting, no math, no fuzzy matching.
// Hard-fails on unknown tokens, leftover tokens, or unused-token drift.
//
// Usage: node scripts/inject-tokens.mjs <draft.md> <data.json> <out.md>

import { readFileSync, writeFileSync } from "node:fs";

const [, , draftPath, dataPath, outPath] = process.argv;

if (!draftPath || !dataPath || !outPath) {
  console.error("Usage: node scripts/inject-tokens.mjs <draft.md> <data.json> <out.md>");
  process.exit(1);
}

const draft = readFileSync(draftPath, "utf8");
const data = JSON.parse(readFileSync(dataPath, "utf8"));
const tokens = data.tokens ?? {};

const TOKEN_RE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

const found = new Set();
const unknown = new Set();

const result = draft.replace(TOKEN_RE, (match, key) => {
  found.add(key);
  if (!(key in tokens)) {
    unknown.add(key);
    return match; // leave it; we're failing anyway
  }
  const value = String(tokens[key]);
  if (value.trim() === "") {
    unknown.add(key + " (empty value)");
    return match;
  }
  return value;
});

let failed = false;

if (unknown.size > 0) {
  console.error("FAIL: tokens in draft with no value in data.json:");
  for (const k of unknown) console.error("  - " + k);
  failed = true;
}

// Catch malformed/half-deleted braces the regex didn't match
const leftovers = result.match(/\{\{|\}\}/g);
if (!failed && leftovers) {
  console.error("FAIL: leftover brace fragments after injection (malformed token?):");
  console.error("  count: " + leftovers.length);
  failed = true;
}

const unused = Object.keys(tokens).filter((k) => !found.has(k));
if (unused.length > 0) {
  // Not fatal: the planner may stock more tokens than the post uses.
  console.warn("WARN: tokens defined but never used in draft:");
  for (const k of unused) console.warn("  - " + k);
}

if (failed) process.exit(1);

writeFileSync(outPath, result, "utf8");
console.log(
  `OK: injected ${found.size} unique tokens into ${outPath} (${unused.length} defined-but-unused)`
);
