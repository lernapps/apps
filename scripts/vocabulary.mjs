// Writes the basic vocabulary of a language, map/<subject>/vocabulary/words.yaml, from a graded lexicon of the CEFRLex
// family (FLELex for French, and its kin for other languages: a TSV with the columns word, tag, and level or
// freq_A1 … freq_C2) and
// map/<subject>/vocabulary/source.yaml (which lexicon, which levels, the corrections). The lexicon itself stays out of
// the repository; whoever updates the list downloads it (its URL is in source.yaml). The build checks the result
// against source.yaml (lib/map.js), so a correction cannot be forgotten.
//
//   node scripts/vocabulary.mjs <subject> <lexicon.tsv>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import { VocabularySource, LEVELS } from "../schemas/map.js";

/** The words of a lexicon TSV: word, tag and level of each line, without the header. */
export function readLexicon(text) {
  const [head = "", ...lines] = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  const columns = head.split("\t").map((name) => name.trim());
  const at = (name) => {
    const index = columns.indexOf(name);
    if (index === -1) throw new Error(`the lexicon has no column ${name}; its columns are ${columns.join(", ")}`);
    return index;
  };
  const [word, tag] = [at("word"), at("tag")];
  // a lexicon without a column level (EFLLex, ELELex …): the first level a word is seen at, as FLELex counts it
  const level = columns.indexOf("level");
  const frequencies = LEVELS.map((name) => [name, columns.indexOf(`freq_${name}`)]).filter(([, index]) => index !== -1);
  if (level === -1 && frequencies.length === 0)
    throw new Error(`the lexicon has neither a column level nor columns freq_A1 …; its columns are ${columns.join(", ")}`);
  return lines.map((line) => {
    const cells = line.split("\t").map((cell) => cell.trim());
    const first = frequencies.find(([, index]) => Number(cells[index]) > 0)?.[0] ?? "";
    return { word: cells[word] ?? "", pos: cells[tag] ?? "", level: level === -1 ? first : (cells[level] ?? "") };
  });
}

const key = (entry) => `${entry.word}\t${entry.pos}`;

/** The words of the list: the lexicon's of the levels, with the corrections of `source` applied, sorted. */
export function vocabulary(lexicon, source) {
  const words = new Map();
  for (const entry of lexicon) if (source.levels.includes(entry.level)) words.set(key(entry), { ...entry });
  const all = new Map(lexicon.map((entry) => [key(entry), entry]));
  for (const correction of source.remove ?? []) words.delete(key(correction));
  for (const correction of source.level ?? []) {
    const from = all.get(key(correction));
    if (from === undefined) throw new Error(`level: ${correction.word} (${correction.pos}) is not in the lexicon; add it`);
    words.set(key(correction), { ...from, level: correction.level, note: `${from.level} → ${correction.level}: ${correction.reason}` });
  }
  for (const correction of source.add ?? []) {
    if (all.has(key(correction))) throw new Error(`add: ${correction.word} (${correction.pos}) is in the lexicon; change its level`);
    words.set(key(correction), {
      word: correction.word,
      pos: correction.pos,
      level: correction.level,
      note: `nicht im Lexikon: ${correction.reason}`,
    });
  }
  return [...words.values()].sort(
    (a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) || a.word.localeCompare(b.word, source.language) || a.pos.localeCompare(b.pos),
  );
}

/** A word as one line of YAML. */
const line = (entry) =>
  `  - { word: ${JSON.stringify(entry.word)}, pos: ${entry.pos}, level: ${entry.level}${entry.note === undefined ? "" : `, note: ${JSON.stringify(entry.note)}`} }`;

/** The file words.yaml for `source` and its words. */
export function wordsFile(source, words) {
  return [
    "# yaml-language-server: $schema=https://lernapps.net/apps/schemas/vocabulary.v1.schema.json",
    "# Written by scripts/vocabulary.mjs from the lexicon and source.yaml; do not edit: change source.yaml and run it again.",
    `# Licence: ${source.source.licence} (LICENSE.md in this folder), not the MIT licence of the repository.`,
    `language: ${source.language}`,
    "source:",
    `  title: ${JSON.stringify(source.source.title)}`,
    `  url: ${source.source.url}`,
    `  licence: ${JSON.stringify(source.source.licence)}`,
    "  cite:",
    ...source.source.cite.map((cite) => `    - ${JSON.stringify(cite)}`),
    `levels: [${source.levels.join(", ")}]`,
    "words:",
    ...words.map(line),
    "",
  ].join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [subject, lexiconFile] = process.argv.slice(2);
  if (!subject || !lexiconFile) {
    console.error("usage: node scripts/vocabulary.mjs <subject> <lexicon.tsv>");
    process.exit(1);
  }
  const dir = join("map", subject, "vocabulary");
  const source = VocabularySource.parse(load(readFileSync(join(dir, "source.yaml"), "utf8")));
  const words = vocabulary(readLexicon(readFileSync(lexiconFile, "utf8")), source);
  writeFileSync(join(dir, "words.yaml"), wordsFile(source, words));
  const counts = source.levels.map((level) => `${level}: ${words.filter((w) => w.level === level).length}`).join(", ");
  console.log(`wrote ${join(dir, "words.yaml")}: ${words.length} words (${counts})`);
}
