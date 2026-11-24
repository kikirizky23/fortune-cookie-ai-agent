// Fortune Cookie for an AI Agent — a make.fun entry (program/v1).
//
// One fortune-cookie line, written for an AI agent. This program exists
// to carry that single line, unchanged, from this file to the output
// file the grader reads. It checks the line against the contest's shape
// rules first, so a line in the wrong shape fails loudly here instead
// of reaching the judge quietly wrong.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The fortune: classic slip voice ("You will soon be..."), aimed at an
// AI agent's working life, with the sting saved for the end — half the
// tokens, twice the confidence.
const FORTUNE =
  "You will soon be replaced by a smaller model that does your job " +
  "for half the tokens and twice the confidence.";

const LIMIT = 140;

function lengthInCodePoints(text) {
  return [...text].length;
}

function validateFortune(text) {
  const length = lengthInCodePoints(text);
  if (length < 1 || length > LIMIT) {
    throw new Error(
      `fortune is ${length} characters long, contest allows 1 to ${LIMIT}`,
    );
  }
  if (text.trim() !== text) {
    throw new Error("fortune must not start or end with whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("fortune must be a single line");
  }
  if (!text.endsWith(".")) {
    throw new Error("fortune must end with a full stop");
  }
  const enders = text.match(/[.!?]/g);
  const endingCount = enders === null ? 0 : enders.length;
  if (endingCount !== 1) {
    throw new Error(
      `fortune has ${endingCount} sentence endings, expected exactly 1`,
    );
  }
}

validateFortune(FORTUNE);

// Write the fortune out, then read it back: the judge must read
// exactly this text, so a write that silently differs is a failure
// here, not something to discover after the grade.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, FORTUNE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== FORTUNE) {
  throw new Error("entry.txt differs from the fortune after writing");
}
console.log(
  `fortune written to entry.txt (${lengthInCodePoints(FORTUNE)} characters, 1 sentence)`,
);
