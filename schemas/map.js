// The formats of the learning map (docs/learning-map-contract.md): a subject, map/<subject>.yaml, with its strands and
// their competencies nested, and a curriculum, map/<subject>/curricula/<id>.yaml, with its placements. The single
// source for the build's check (lib/map.js) and for the published JSON Schemas (npm run schema). What spans files (ids
// that refer to another file, cycles of "requires") is checked by lib/map.js.
import { z } from "zod";
import { Text, Id } from "./entry.js";

const https = z.url({ protocol: /^https$/ });

const Source = z
  .strictObject({
    title: z.string().min(1).describe("Title of the document, with its edition"),
    url: https.optional().describe("Where to read it, when it is online"),
  })
  .describe("Where the strands and competencies come from");

export const GRADE_BANDS = ["5-6", "7-8", "9-10"];

const Competency = z
  .strictObject({
    id: Id.describe("Stable id, unique in the subject; never renamed once published"),
    name: Text.describe("Short name of the competency, 2–5 words, e.g. Laplace-Formel; shown where it is listed"),
    iCan: Text.refine((t) => (typeof t === "string" ? t : t.de).startsWith("Ich kann"), {
      message: 'starts with "Ich kann"',
    }).describe('What a learner can do, in plain German: "Ich kann …"'),
    gradeBand: z
      .enum(GRADE_BANDS)
      .describe("Roughly in which two school years it is taught; shown where no curriculum places it"),
    requires: z.array(Id).optional().describe("Competencies of the same subject a learner needs first, any strand"),
  })
  .describe("A competency (Baustein): one thing a learner can learn");

const Strand = z
  .strictObject({
    id: Id.describe("Stable id, unique in the subject"),
    name: Text,
    competencies: z.array(Competency).min(1),
  })
  .describe("A strand (Strang): a part of the subject that runs over several school years and builds on itself");

export const Subject = z
  .strictObject({
    name: Text.describe("Name of the subject, e.g. Mathematik; the file name is its id"),
    source: Source,
    explainerFocus: z
      .enum(["strand", "competency"])
      .optional()
      .describe(
        "What an app of the subject focuses on (KD-01 of lernapps/apps#226). strand (the default): an app stays in one " +
          "strand, because the strands separate (Physik, Geschichte). competency: an app may practise competencies of " +
          "several strands, because the strands are woven together (foreign languages, Deutsch); such an app names the " +
          "subject instead of a strand, each page stays in one strand, and its prerequisites come first in the app",
      ),
    strands: z.array(Strand).min(1),
  })
  .describe("A subject of the learning map: map/<subject>.yaml");

export const LANDS = ["BW", "BY", "BE", "BB", "HB", "HH", "HE", "MV", "NI", "NW", "RP", "SL", "SN", "ST", "SH", "TH"];

const Placement = z
  .strictObject({
    competency: Id.describe("A competency of the subject"),
    grades: z
      .array(z.int().min(1).max(13))
      .min(1)
      .refine((g) => g.every((v, i) => i === 0 || g[i - 1] < v), { message: "ascending, each grade once" })
      .describe("The grades in which the curriculum places it"),
    unit: z.string().min(1).optional().describe("The curriculum's own name of the unit, e.g. 7.4"),
  })
  .describe("A placement (Einordnung)");

export const Curriculum = z
  .strictObject({
    land: z.enum(LANDS).describe("The Land, ISO 3166-2:DE without DE-"),
    schoolType: Text.describe("The school type, e.g. Gymnasium (G9)"),
    version: z.string().min(1).describe("Which document, which edition"),
    source: Source,
    placements: z.array(Placement).describe("May place only some competencies; at most one placement per competency"),
  })
  .describe("A curriculum (Lehrplan) of one Land and school type for a subject: map/<subject>/curricula/<id>.yaml");

export const SUBJECT_SCHEMA_ID = "https://lernapps.net/apps/schemas/subject.v1.schema.json";
export const CURRICULUM_SCHEMA_ID = "https://lernapps.net/apps/schemas/curriculum.v1.schema.json";

// The basic vocabulary of a language beside the map (contract, section 6): map/<subject>/vocabulary/words.yaml, written
// by scripts/vocabulary.mjs from a graded lexicon and map/<subject>/vocabulary/source.yaml (the lexicon, its corrections). It
// says how far a word is (its CEFR level), not where it belongs: the words of a page follow from its exercises.
export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const Lexicon = z
  .strictObject({
    title: z.string().min(1).describe("The lexicon, e.g. FLELex / Beacco (TreeTagger)"),
    url: https.describe("Where to download it"),
    licence: z.string().min(1).describe("Its licence, e.g. CC BY-NC-SA 4.0; the word list has the same"),
    cite: z.array(z.string().min(1)).min(1).describe("How its authors ask to cite it"),
  })
  .describe("The graded lexicon the word list comes from");

const Word = z
  .strictObject({
    word: z.string().min(1).describe("The lemma as the lexicon writes it, without article"),
    pos: z.string().min(1).describe("Its part of speech as the lexicon tags it, e.g. NOM, VER, ADJ"),
    level: z.enum(LEVELS).describe("Its CEFR level: from the lexicon, or from a correction"),
    note: z.string().min(1).optional().describe("Why a correction added it or changed its level"),
  })
  .describe("A word of the basic vocabulary");

export const Vocabulary = z
  .strictObject({
    language: z.string().regex(/^[a-z]{2,3}$/, "a language code, e.g. fr").describe("The language of the words"),
    source: Lexicon,
    levels: z.array(z.enum(LEVELS)).min(1).describe("The levels the list holds, e.g. [A1, A2]"),
    words: z.array(Word).min(1).describe("The words, by level, then in the alphabet"),
  })
  .describe("The basic vocabulary of a language: map/<subject>/vocabulary/words.yaml");

const Correction = z
  .strictObject({
    word: z.string().min(1),
    pos: z.string().min(1),
    level: z.enum(LEVELS).optional().describe("The level it gets; for add and level"),
    reason: z.string().min(1).describe("Why: what children of the class need, what the lexicon misses"),
  })
  .describe("One correction of the lexicon");

export const VocabularySource = z
  .strictObject({
    language: z.string().regex(/^[a-z]{2,3}$/, "a language code, e.g. fr").describe("The language of the words"),
    source: Lexicon,
    levels: z.array(z.enum(LEVELS)).min(1).describe("The levels the list takes from the lexicon, e.g. [A1, A2]"),
    add: z.array(Correction).optional().describe("Words the lexicon lacks, with their level"),
    level: z.array(Correction).optional().describe("Words of the lexicon with another level"),
    remove: z.array(Correction).optional().describe("Words of the lexicon left out"),
  })
  .describe(
    "Where a basic vocabulary comes from, with its corrections: map/<subject>/vocabulary/source.yaml, which scripts/vocabulary.mjs reads",
  );

export const VOCABULARY_SCHEMA_ID = "https://lernapps.net/apps/schemas/vocabulary.v1.schema.json";
