// The learning map (docs/learning-map-contract.md): reads map/<subject>.yaml and map/<subject>/curricula/*.yaml,
// checks each file against schemas/map.js and everything that spans files, and computes what the pages show: which
// apps practise a competency, the rows of a subject for a curriculum, the state of a curriculum, and the step of each
// competency in the chain of its prerequisites. A broken file throws,
// so the build fails and nothing unchecked is published (concept-checked-not-declared).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import { Subject, Curriculum, Vocabulary, VocabularySource, GRADE_BANDS } from "../schemas/map.js";

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const de = (text) => (typeof text === "string" ? text : text.de);

function parse(schema, raw, file, errors) {
  const result = schema.safeParse(raw);
  if (!result.success) {
    for (const issue of result.error.issues) errors.push(`${file}: ${issue.path.join(".") || "(file)"}: ${issue.message}`);
    return undefined;
  }
  return result.data;
}

/** The cycles of "requires" in a subject, each as a list of ids. */
function cycles(competencies) {
  const found = [];
  const state = new Map(); // id → "open" | "done"
  const visit = (id, path) => {
    if (state.get(id) === "done") return;
    if (state.get(id) === "open") {
      found.push([...path.slice(path.indexOf(id)), id]);
      return;
    }
    state.set(id, "open");
    for (const next of competencies.get(id)?.requires ?? []) if (competencies.has(next)) visit(next, [...path, id]);
    state.set(id, "done");
  };
  for (const id of competencies.keys()) visit(id, []);
  return found;
}

/**
 * The basic vocabulary of a language subject (map/<subject>/vocabulary/), or undefined when it has none: words.yaml as
 * scripts/vocabulary.mjs wrote it from source.yaml, checked against source.yaml, so that no correction is lost.
 */
function loadVocabulary(dir, errors) {
  if (!existsSync(dir)) return undefined;
  const wordsPath = join(dir, "words.yaml");
  const sourcePath = join(dir, "source.yaml");
  for (const path of [wordsPath, sourcePath, join(dir, "LICENSE.md")]) {
    if (!existsSync(path)) errors.push(`${path} is missing: a basic vocabulary has source.yaml, words.yaml and LICENSE.md`);
  }
  if (!existsSync(wordsPath) || !existsSync(sourcePath)) return undefined;
  const data = parse(Vocabulary, load(readFileSync(wordsPath, "utf8")), wordsPath, errors);
  const source = parse(VocabularySource, load(readFileSync(sourcePath, "utf8")), sourcePath, errors);
  if (!data || !source) return undefined;
  const stale = `run node scripts/vocabulary.mjs <subject> <lexicon.tsv> again`;
  const words = new Map();
  for (const w of data.words) {
    const k = `${w.word} (${w.pos})`;
    if (words.has(k)) errors.push(`${wordsPath}: ${k} twice`);
    words.set(k, w);
  }
  for (const c of [...(source.add ?? []), ...(source.level ?? [])]) {
    const w = words.get(`${c.word} (${c.pos})`);
    if (c.level === undefined) errors.push(`${sourcePath}: ${c.word} (${c.pos}) has no level; add and level give one`);
    else if (w?.level !== c.level) errors.push(`${wordsPath}: ${c.word} (${c.pos}) is not on ${c.level} as source.yaml says; ${stale}`);
  }
  for (const c of source.remove ?? []) {
    if (words.has(`${c.word} (${c.pos})`)) errors.push(`${wordsPath}: ${c.word} (${c.pos}) is still in; ${stale}`);
  }
  for (const field of ["language", "levels"]) {
    if (JSON.stringify(data[field]) !== JSON.stringify(source[field])) errors.push(`${wordsPath}: ${field} differs from source.yaml; ${stale}`);
  }
  return data;
}

/** One subject from its YAML, with its curricula; pushes every problem to errors. */
function loadSubject(dir, file, errors) {
  const id = file.replace(/\.yaml$/, "");
  const path = join(dir, file);
  if (!ID.test(id)) errors.push(`${path}: the file name is the subject's id: lower-case letters, digits and hyphens`);
  const data = parse(Subject, load(readFileSync(path, "utf8")), path, errors);
  if (!data) return undefined;

  const competencies = new Map();
  const strandIds = new Set();
  for (const strand of data.strands) {
    if (strandIds.has(strand.id)) errors.push(`${path}: strand ${strand.id} twice`);
    strandIds.add(strand.id);
    for (const c of strand.competencies) {
      if (competencies.has(c.id)) errors.push(`${path}: competency ${c.id} twice (ids are unique in the subject)`);
      competencies.set(c.id, { ...c, requires: c.requires ?? [], strand: strand.id });
    }
  }
  for (const c of competencies.values()) {
    for (const r of c.requires) {
      if (r === c.id) errors.push(`${path}: ${c.id} requires itself`);
      else if (!competencies.has(r)) errors.push(`${path}: ${c.id} requires ${r}, which is no competency of ${id}`);
    }
  }
  for (const cycle of cycles(competencies)) errors.push(`${path}: requires goes round in a circle: ${cycle.join(" → ")}`);

  // Who needs a competency: the reverse of requires.
  const requiredBy = new Map([...competencies.keys()].map((k) => [k, []]));
  for (const c of competencies.values()) for (const r of c.requires) requiredBy.get(r)?.push(c.id);

  const curricula = [];
  const curriculaDir = join(dir, id, "curricula");
  if (existsSync(curriculaDir)) {
    for (const cfile of readdirSync(curriculaDir).filter((f) => f.endsWith(".yaml")).sort()) {
      const cid = cfile.replace(/\.yaml$/, "");
      const cpath = join(curriculaDir, cfile);
      if (!ID.test(cid)) errors.push(`${cpath}: the file name is the curriculum's id: <land>-<school type>, lower-case`);
      const cdata = parse(Curriculum, load(readFileSync(cpath, "utf8")), cpath, errors);
      if (!cdata) continue;
      if (!cid.startsWith(`${cdata.land.toLowerCase()}-`)) errors.push(`${cpath}: the file name starts with the land: ${cdata.land.toLowerCase()}-…`);
      const placements = new Map();
      for (const p of cdata.placements) {
        if (!competencies.has(p.competency)) errors.push(`${cpath}: ${p.competency} is no competency of ${id}`);
        if (placements.has(p.competency)) errors.push(`${cpath}: ${p.competency} placed twice`);
        placements.set(p.competency, p);
      }
      curricula.push({ ...cdata, id: cid, placements });
    }
  }

  return {
    id,
    name: data.name,
    source: data.source,
    vocabulary: loadVocabulary(join(dir, id, "vocabulary"), errors),
    explainerFocus: data.explainerFocus ?? "strand",
    strands: data.strands.map((s) => ({ id: s.id, name: s.name, competencies: s.competencies.map((c) => c.id) })),
    competencies,
    requiredBy,
    // Only for a subject without cycles; with one the load fails anyway.
    steps: errors.length ? new Map() : stepsOf(competencies),
    curricula,
  };
}

/**
 * The step of each competency in the chain of its prerequisites: 1 for one that requires nothing, else one more than
 * its deepest prerequisite (1 + the longest path over requires to a competency without one). It is derived from
 * requires and written nowhere (feat/map-steps, KD-04). Needs a subject without cycles.
 */
function stepsOf(competencies) {
  const steps = new Map();
  const step = (id) => {
    if (!steps.has(id)) steps.set(id, 1 + Math.max(0, ...competencies.get(id).requires.filter((r) => competencies.has(r)).map(step)));
    return steps.get(id);
  };
  for (const id of competencies.keys()) step(id);
  return steps;
}

/** Every competency reached from id by next (not id itself); ancestors (below) walks requires the same way. */
function closure(id, next) {
  const seen = new Set();
  const stack = [...next(id)];
  while (stack.length) {
    const x = stack.pop();
    if (seen.has(x)) continue;
    seen.add(x);
    stack.push(...next(x));
  }
  return seen;
}

/** Every competency that builds on id, directly or over others (its descendants). */
export function descendants(subject, id) {
  return closure(id, (x) => subject.requiredBy.get(x) ?? []);
}

/** Ids grouped by their step, in the order of the steps: [{ step, ids }]; ids keep the order given. */
export function byStep(subject, ids) {
  const groups = new Map();
  for (const id of ids) {
    const s = subject.steps.get(id);
    if (!groups.has(s)) groups.set(s, []);
    groups.get(s).push(id);
  }
  return [...groups].sort((a, b) => a[0] - b[0]).map(([step, list]) => ({ step, ids: list }));
}

/**
 * The rows of a subject's grid by step (feat/map-steps, KD-08): one row per step, from 1 to the longest chain, with
 * the competencies of each strand in that step, in the order of the strand.
 * Each row: { step, count, cells: per strand, { strand, competencies: ids } }.
 */
export function stepRows(subject) {
  const last = Math.max(0, ...subject.steps.values());
  return Array.from({ length: last }, (_, i) => {
    const step = i + 1;
    const cells = subject.strands.map((strand) => ({
      strand: strand.id,
      competencies: strand.competencies.filter((id) => subject.steps.get(id) === step),
    }));
    return { step, count: cells.reduce((n, c) => n + c.competencies.length, 0), cells };
  });
}

/** All subjects of the map in dir, sorted by German name; throws with every problem when a file is broken. */
export function loadMap(dir = "map") {
  if (!existsSync(dir)) return [];
  const errors = [];
  const subjects = readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .sort()
    .map((f) => loadSubject(dir, f, errors))
    .filter(Boolean);
  if (errors.length) throw new Error(`learning map:\n  - ${errors.join("\n  - ")}`);
  return subjects.sort((a, b) => de(a.name).localeCompare(de(b.name), "de"));
}

/**
 * Checks where an app is on the map: its subject, its strand, the competencies and the recaps it names. Returns errors
 * (an unknown subject, strand, competency or recap; a strand of another subject; competencies of several strands where
 * the subject's map does not allow it; a recap of a competency the app practises) and hints (a competency of another
 * strand than the app's: one app, one strand; the listing treats them as errors).
 *
 * An app names its subject (the entry's `subject`, or an explainer's `subject`) and, as a strand app, one strand
 * `<subject>/<strand>`. Without a strand, its competencies may come from several strands of the subject, but only when
 * the subject's map says `explainerFocus: competency` (a unit app, KD-01 and KD-06 of lernapps/apps#226).
 */
export function checkApp(subjects, { subject: sid, strand, competencies = [], recaps = [] }) {
  const errors = [];
  const hints = [];
  const hasStrand = strand && strand !== "none";
  const [fromStrand, stid] = hasStrand ? strand.split("/") : [];
  if (hasStrand && sid && fromStrand !== sid) errors.push(`strand ${strand}: not a strand of the app's subject ${sid}`);
  sid ??= fromStrand;
  if (!sid) {
    if (competencies.length) errors.push("competencies need a subject: say which subject of the learning map the app belongs to");
    return { errors, hints };
  }
  const subject = subjects.find((s) => s.id === sid);
  if (!subject) {
    if (hasStrand || competencies.length || recaps.length) errors.push(`subject ${sid}: the learning map has no subject ${sid}`);
    return { errors, hints };
  }
  if (hasStrand && !subject.strands.some((s) => s.id === stid)) errors.push(`strand ${strand}: ${sid} has no strand ${stid}`);
  if (!hasStrand && competencies.length && subject.explainerFocus !== "competency") {
    errors.push(
      `competencies without a strand: the map of ${sid} keeps an app in one strand (explainerFocus: strand); name the strand of <subject>/<strand>`,
    );
  }
  for (const c of competencies) {
    const found = subject.competencies.get(c);
    if (!found) errors.push(`competency ${c}: no competency of ${sid}`);
    else if (hasStrand && found.strand !== stid) hints.push(`competency ${c} belongs to the strand ${sid}/${found.strand}, not ${strand}: an app stays in one strand`);
  }
  // A recap page repeats a competency the app does not practise itself, of any strand, "<subject>/<id>" (KD-26,
  // variant C); recapping one the app also practises is an error.
  for (const r of recaps) {
    const [rs, rid] = r.split("/");
    const rsubject = subjects.find((s) => s.id === rs);
    const found = rsubject?.competencies.get(rid);
    if (!found) errors.push(`recap ${r}: no competency of the learning map`);
    else if (rs === sid && competencies.includes(rid)) errors.push(`recap ${r}: the app practises it on a page of its own; a recap is only for what it does not practise`);
  }
  return { errors, hints };
}

/** Every competency a competency builds on, directly or not. */
export function ancestors(subject, id) {
  const seen = new Set();
  const stack = [...(subject.competencies.get(id)?.requires ?? [])];
  while (stack.length) {
    const next = stack.pop();
    if (seen.has(next)) continue;
    seen.add(next);
    stack.push(...(subject.competencies.get(next)?.requires ?? []));
  }
  return seen;
}

/**
 * Checks an app's pages against its subject's map (KD-03a, KD-04, KD-07 of lernapps/apps#226). pages: in the app's
 * order, each { competencies, recap, linked }; `recap` is "<subject>/<id>", `linked` the ids whose page on the map the
 * page's text links (a Set; left out when unknown). An app without pages (a list in its entry) is one page without
 * order: pass `{ ordered: false }`.
 *
 * Returns findings { kind, page, competency, prerequisite, text }:
 * - `strands`: a page practises competencies of more than one strand (only reported with explainerFocus: competency);
 * - `order`: a prerequisite the app practises or recaps only after the page that needs it;
 * - `gap`: a prerequisite the app neither practises nor recaps, while it practises something it builds on;
 * - `entry`: a prerequisite at the start of the app's chain, without a recap page before it.
 * A recapped competency's own prerequisites are not followed; each prerequisite is reported once, at the first page
 * that needs it.
 */
export function checkPages(subject, pages, { ordered = true } = {}) {
  const findings = [];
  const practised = new Map();
  const recapped = new Map();
  pages.forEach((page, i) => {
    for (const c of page.competencies ?? []) if (!practised.has(c)) practised.set(c, i);
    const [rs, rid] = (page.recap ?? "").split("/");
    if (rs === subject.id && rid && !recapped.has(rid)) recapped.set(rid, i);
  });
  const reported = new Set();
  pages.forEach((page, i) => {
    const own = (page.competencies ?? []).filter((c) => subject.competencies.has(c));
    const strands = [...new Set(own.map((c) => subject.competencies.get(c).strand))];
    if (subject.explainerFocus === "competency" && strands.length > 1) {
      findings.push({ kind: "strands", page: i, text: `the page practises competencies of ${strands.length} strands (${strands.join(", ")}); a page stays in one strand` });
    }
    for (const c of own) {
      for (const r of subject.competencies.get(c).requires) {
        if (reported.has(r)) continue;
        const at = practised.get(r);
        const recap = recapped.get(r);
        if (!ordered && (at !== undefined || recap !== undefined)) continue;
        if ((at !== undefined && at <= i) || (recap !== undefined && recap < i) || page.linked?.has(r)) continue;
        reported.add(r);
        if (at !== undefined || recap !== undefined) {
          findings.push({ kind: "order", page: i, competency: c, prerequisite: r, text: `${c} requires ${r}, which comes only on page ${(at ?? recap) + 1}` });
        } else if ([...ancestors(subject, r)].some((a) => practised.has(a))) {
          findings.push({ kind: "gap", page: i, competency: c, prerequisite: r, text: `${c} requires ${r}, which is missing in the middle of the app's chain (the app practises what it builds on)` });
        } else {
          findings.push({ kind: "entry", page: i, competency: c, prerequisite: r, text: `${c} requires ${r}, which the app does not practise; a recap page before it (recap: ${subject.id}/${r}) or a link to its page on the map helps` });
        }
      }
    }
  });
  return findings;
}

/**
 * Which apps practise which competency of a subject. apps: the catalog's apps, each with subjectId, competencies (its own
 * or its pages') and pages ({ title, url, competencies }). Returns competency id → [{ app, pages }].
 */
export function coverage(subject, apps) {
  const by = new Map([...subject.competencies.keys()].map((k) => [k, []]));
  for (const app of apps) {
    if (app.subjectId !== subject.id) continue;
    const ids = new Set([...(app.competencies ?? []), ...(app.pages ?? []).flatMap((p) => p.competencies ?? [])]);
    for (const id of ids) {
      if (!by.has(id)) continue;
      by.get(id).push({ app, pages: (app.pages ?? []).filter((p) => (p.competencies ?? []).includes(id)) });
    }
  }
  return by;
}

/**
 * The rows of a subject's grid (KD-06). Without a curriculum, one row per grade band. With one: per band, the first
 * grade, the band (competencies the curriculum does not place, "noch ohne Klasse") and the second grade; a placed
 * competency stands in its first grade, with the others as "again".
 * Each row: { key, label, band (true for an unplaced band row), cells: per strand, the competencies { id, again } }.
 */
export function rows(subject, curriculum) {
  const keys = curriculum
    ? GRADE_BANDS.flatMap((b) => {
        const [lo, hi] = b.split("-").map(Number);
        return [lo, b, hi];
      })
    : GRADE_BANDS;
  return keys.map((key) => ({
    key,
    label: typeof key === "number" ? String(key) : key.replace("-", "/"),
    band: Boolean(curriculum) && typeof key === "string",
    cells: subject.strands.map((strand) => ({
      strand: strand.id,
      competencies: strand.competencies
        .map((id) => subject.competencies.get(id))
        .filter((c) => {
          // A grade outside 5–10 has no row of its own: the competency stays in its band.
          const first = curriculum?.placements.get(c.id)?.grades[0];
          return first >= 5 && first <= 10 ? first === key : c.gradeBand === key;
        })
        .map((c) => ({ id: c.id, again: curriculum?.placements.get(c.id)?.grades.slice(1) ?? [] })),
    })),
  }));
}

/** How many of a subject's competencies a curriculum places. */
export function placedCount(subject, curriculum) {
  return [...subject.competencies.keys()].filter((id) => curriculum.placements.has(id)).length;
}
