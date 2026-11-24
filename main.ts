// Make the Judge Smile — entry writer (node22, stdlib only, no network).
// Writes one line about a small good thing that happened today to
// <MAKEFUN_OUTPUT_DIR>/entry.txt (default /output).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ENTRY =
  "My neighbour left a bowl of soup at my door with a note that just said 'too much, eat' — no name, like kindness had a typo.";

// Mirror the bounty gate locally: 1–200 characters, a single line, not
// only whitespace. A bad entry fails here with a clear message instead
// of silently at grading time.
function validate(text) {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`entry is ${chars} characters, gate needs 1–200`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}
validate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Verify the write landed intact before reporting success.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  throw new Error("verify failed: entry.txt differs after write");
}
console.log(
  `wrote ${outPath} (${[...ENTRY].length} chars, sha256 ${createHash("sha256").update(ENTRY, "utf8").digest("hex").slice(0, 12)}…)`,
);
