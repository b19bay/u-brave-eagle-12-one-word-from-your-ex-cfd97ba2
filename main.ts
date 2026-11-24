import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "practice";

// Runtime gate: the sealed scorer accepts 1-24 UTF-8 characters, not only
// white space, and the judge reads exactly one word. Ties break on bytes,
// so the word is pure ASCII and bytes equal characters.
const chars = [...WORD];
if (chars.length < 1 || chars.length > 24) {
  throw new Error(`word must be 1-24 characters, got ${chars.length}`);
}
if (WORD.trim().length === 0) {
  throw new Error("word must not be only white space");
}
if (/\s/.test(WORD)) {
  throw new Error("word must be exactly one word, no white space");
}
if (WORD.includes("\n") || WORD.includes("\r")) {
  throw new Error("word must be a single line");
}
if (Buffer.byteLength(WORD, "utf8") !== chars.length) {
  throw new Error("word must be ASCII so bytes equal characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, WORD, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== WORD) {
  throw new Error("read-back mismatch: output differs from the word");
}
