// The basic vocabulary of a language (docs/learning-map-contract.md, section 6): scripts/vocabulary.mjs reads a graded
// lexicon and applies the corrections of source.yaml; lib/map.js loads words.yaml and fails when it does not match
// source.yaml or a file is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadMap } from "../lib/map.js";
import { readLexicon, vocabulary, wordsFile } from "../scripts/vocabulary.mjs";

const LEXICON = [
  "word\ttag\tfreq_A1\tfreq_A2\tfreq_B1\tlevel",
  "pain\tNOM\t9\t9\t9\tA1",
  "cahier\tNOM\t0\t4\t5\tA2",
  "trousse\tNOM\t0\t0\t1\tB1",
  "manger\tVER\t9\t9\t9\tA1",
  "manger\tNOM\t0\t0\t3\tB1",
].join("\n");

const SOURCE = {
  language: "fr",
  source: { title: "Lexikon", url: "https://example.org/lexicon/", licence: "CC BY-NC-SA 4.0", cite: ["A. B. (2014). Lexikon."] },
  levels: ["A1", "A2"],
};

test("a lexicon: word, tag and level of each line; without a column level, the first level a word is seen at", () => {
  assert.deepEqual(readLexicon(LEXICON)[1], { word: "cahier", pos: "NOM", level: "A2" });
  const withoutLevel = LEXICON.split("\n").map((line) => line.split("\t").slice(0, 5).join("\t")).join("\r\n");
  assert.deepEqual(readLexicon(withoutLevel).map((w) => w.level), ["A1", "A2", "B1", "A1", "B1"]);
  assert.throws(() => readLexicon("lemma\ttag\n"), /the lexicon has no column word/);
});

test("the list: the levels taken, the corrections applied with their notes, by level then alphabet", () => {
  const source = {
    ...SOURCE,
    level: [{ word: "trousse", pos: "NOM", level: "A1", reason: "Schulalltag" }],
    add: [{ word: "goûter", pos: "NOM", level: "A1", reason: "Kinderalltag" }],
    remove: [{ word: "cahier", pos: "NOM", reason: "Beispiel" }],
  };
  const words = vocabulary(readLexicon(LEXICON), source);
  assert.deepEqual(
    words.map((w) => `${w.word}/${w.pos}/${w.level}`),
    ["goûter/NOM/A1", "manger/VER/A1", "pain/NOM/A1", "trousse/NOM/A1"],
  );
  assert.equal(words.find((w) => w.word === "trousse").note, "B1 → A1: Schulalltag");
  assert.equal(words.find((w) => w.word === "goûter").note, "nicht im Lexikon: Kinderalltag");
  assert.throws(
    () => vocabulary(readLexicon(LEXICON), { ...SOURCE, add: [{ word: "pain", pos: "NOM", level: "A1", reason: "x" }] }),
    /add: pain \(NOM\) is in the lexicon; change its level/,
  );
  assert.throws(
    () => vocabulary(readLexicon(LEXICON), { ...SOURCE, level: [{ word: "chat", pos: "NOM", level: "A1", reason: "x" }] }),
    /level: chat \(NOM\) is not in the lexicon; add it/,
  );
});

/** A copy of the valid map fixture with a vocabulary of `files` (by name), and its loader's result or error. */
function mapWith(files) {
  const dir = mkdtempSync(join(tmpdir(), "map-vocabulary-"));
  cpSync(fileURLToPath(new URL("fixtures/map/ok", import.meta.url)), dir, { recursive: true });
  const folder = join(dir, "fach", "vocabulary");
  mkdirSync(folder, { recursive: true });
  for (const [name, text] of Object.entries(files)) writeFileSync(join(folder, name), text);
  try {
    return loadMap(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const yaml = (value) => JSON.stringify(value, null, 2);
const correction = { level: [{ word: "trousse", pos: "NOM", level: "A1", reason: "Schulalltag" }] };

test("a subject loads with its vocabulary when words.yaml matches source.yaml", () => {
  const source = { ...SOURCE, ...correction };
  const [subject] = mapWith({
    "source.yaml": yaml(source),
    "words.yaml": wordsFile(source, vocabulary(readLexicon(LEXICON), source)),
    "LICENSE.md": "CC BY-NC-SA 4.0",
  });
  assert.equal(subject.vocabulary.words.length, 4);
  assert.deepEqual(subject.vocabulary.levels, ["A1", "A2"]);
});

test("a correction not applied to words.yaml, or a missing licence, fails the load", () => {
  const before = wordsFile(SOURCE, vocabulary(readLexicon(LEXICON), SOURCE));
  assert.throws(
    () => mapWith({ "source.yaml": yaml({ ...SOURCE, ...correction }), "words.yaml": before, "LICENSE.md": "x" }),
    /trousse \(NOM\) is not on A1 as source\.yaml says; run node scripts\/vocabulary\.mjs/,
  );
  assert.throws(
    () => mapWith({ "source.yaml": yaml(SOURCE), "words.yaml": before }),
    /LICENSE\.md is missing: a basic vocabulary has source\.yaml, words\.yaml and LICENSE\.md/,
  );
});
