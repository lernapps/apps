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

/** A lexicon artefact, not a word: a lemma with an underscore or a digit, or one that does not begin with a letter. */
const isArtefact = (word) => /[_\d]/.test(word) || !/^\p{L}/u.test(word);

/**
 * The words of a lexicon TSV: word, tag and level of each line, without the header and without artefacts. A level is
 * read from a column `level`, else from the columns of the frequencies (`freq_A1` …, or `level_freq@a1` … as EFLLex
 * writes them): the first level a word is seen at. With the columns `nb_doc@a1` … and `minDocuments`, a word is only
 * seen at a level when at least that many documents of the lexicon's corpus use it there.
 */
export function readLexicon(text, minDocuments = 1) {
  const [head = "", ...lines] = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  const columns = head.split("\t").map((name) => name.trim());
  const at = (name) => {
    const index = columns.indexOf(name);
    if (index === -1) throw new Error(`the lexicon has no column ${name}; its columns are ${columns.join(", ")}`);
    return index;
  };
  const [word, tag] = [at("word"), at("tag")];
  const level = columns.indexOf("level");
  const documents = LEVELS.map((name) => [name, columns.indexOf(`nb_doc@${name.toLowerCase()}`)]).filter(([, index]) => index !== -1);
  const frequencies = LEVELS.map((name) => {
    const index = [`freq_${name}`, `level_freq@${name.toLowerCase()}`].map((n) => columns.indexOf(n)).find((i) => i !== -1);
    return [name, index ?? -1];
  }).filter(([, index]) => index !== -1);
  if (level === -1 && frequencies.length === 0)
    throw new Error(`the lexicon has neither a column level nor columns freq_A1 …; its columns are ${columns.join(", ")}`);
  return lines
    .map((line) => {
      const cells = line.split("\t").map((cell) => cell.trim());
      const seen = (index) => Number(cells[index]) > 0;
      const first =
        (documents.length > 0 && minDocuments > 1
          ? documents.find(([, index]) => Number(cells[index]) >= minDocuments)?.[0]
          : frequencies.find(([, index]) => seen(index))?.[0]) ?? "";
      return { word: cells[word] ?? "", pos: cells[tag] ?? "", level: level === -1 ? first : (cells[level] ?? "") };
    })
    .filter((entry) => !isArtefact(entry.word));
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
    words.set(key(correction), { ...from, level: correction.level, note: `${from.level || "ohne Stufe"} → ${correction.level}: ${correction.reason}` });
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
  const words = vocabulary(readLexicon(readFileSync(lexiconFile, "utf8"), source.minDocuments), source);
  writeFileSync(join(dir, "words.yaml"), wordsFile(source, words));
  const counts = source.levels.map((level) => `${level}: ${words.filter((w) => w.level === level).length}`).join(", ");
  console.log(`wrote ${join(dir, "words.yaml")}: ${words.length} words (${counts})`);
}
