// Checks map/<subject>/explainer.md (skill map-explainers). A draft only draws boundaries (KD-13): the check runs the
// checks of the platform that concern boundaries (checkApp; gaps from checkPages), plus grade bands, sizes and
// coverage. What an explainer needs from outside, and what builds on it, it computes from the map (--relations).
// Usage: node .agents/skills/map-explainers/scripts/check.mjs <subject>|--all [--relations] [--file <draft.md>]
// Exit code 1 on errors.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadMap, checkApp, checkPages } from "../../../../lib/map.js";
import { parseExplainers } from "./parse.mjs";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const BANDS = ["5-6", "7-8", "9-10"];

/**
 * The relations of the explainers, computed from requires: per explainer id, { needs: Map(explainer id or "—" →
 * Bausteine it needs from there), feeds: Map(explainer id → Bausteine of this one that it needs) }. "—" stands for
 * Bausteine of other strands or in no explainer.
 */
export function relations(subject, parsed) {
  const owner = new Map();
  for (const e of parsed.explainers) for (const c of e.chapters) for (const id of c.competencies) if (!owner.has(id)) owner.set(id, e.id);
  const out = new Map(parsed.explainers.map((e) => [e.id, { needs: new Map(), feeds: new Map() }]));
  for (const e of parsed.explainers) {
    const own = new Set(e.chapters.flatMap((c) => c.competencies));
    for (const id of own) {
      for (const r of subject.competencies.get(id)?.requires ?? []) {
        if (own.has(r)) continue;
        const from = owner.get(r) ?? "—";
        const needs = out.get(e.id).needs;
        needs.set(from, [...new Set([...(needs.get(from) ?? []), r])]);
        if (from !== "—") {
          const feeds = out.get(from).feeds;
          feeds.set(e.id, [...new Set([...(feeds.get(e.id) ?? []), r])]);
        }
      }
    }
  }
  return out;
}

/** The circles among explainers (strongly connected groups of more than one), each as a list of ids. */
export function circles(rel) {
  const ids = [...rel.keys()];
  const next = (id) => [...rel.get(id).needs.keys()].filter((k) => rel.has(k));
  let index = 0;
  const idx = new Map(), low = new Map(), stack = [], on = new Set(), out = [];
  const visit = (v) => {
    idx.set(v, index); low.set(v, index); index++; stack.push(v); on.add(v);
    for (const w of next(v)) {
      if (!idx.has(w)) { visit(w); low.set(v, Math.min(low.get(v), low.get(w))); }
      else if (on.has(w)) low.set(v, Math.min(low.get(v), idx.get(w)));
    }
    if (low.get(v) === idx.get(v)) {
      const group = [];
      let w;
      do { w = stack.pop(); on.delete(w); group.push(w); } while (w !== v);
      if (group.length > 1) out.push(group.reverse());
    }
  };
  for (const id of ids) if (!idx.has(id)) visit(id);
  return out;
}

/**
 * Returns { errors, warnings, answered, info } (lists of strings). A warning of a chapter with a `Begründung` (or of an
 * explainer with one) counts as answered: it is listed apart from the open warnings.
 */
export function checkExplainers(subjects, subject, parsed) {
  const errors = parsed.errors.map((e) => `line ${e.line}: ${e.text}`);
  const open = [];
  const answered = [];
  const where = new Map(); // Baustein → explainer ids
  const comp = (id) => subject.competencies.get(id);
  for (const e of parsed.explainers) {
    if (!e.target) continue;
    const at = `${e.id} (line ${e.line})`;
    const warnE = (w) => (e.reason.trim() ? answered : open).push(w);
    const all = e.chapters.flatMap((c) => c.competencies);
    const app = checkApp(subjects, { subject: subject.id, strand: e.target.strand, competencies: all });
    if (e.target.subject && e.target.subject !== subject.id) app.errors.push(`subject ${e.target.subject}: not this subject (${subject.id})`);
    for (const x of [...app.errors, ...app.hints]) errors.push(`${at}: ${x}`); // the listing treats hints as errors
    // a boundary through the middle of a chain: the explainer teaches A and C, C requires B, B is elsewhere
    const known = [...new Set(all.filter((id) => comp(id)))];
    for (const f of checkPages(subject, known.map((id) => ({ competencies: [id] })), { ordered: false })) {
      if (f.kind === "gap") warnE(`${at}: ${f.competency} requires ${f.prerequisite}, which is not in the explainer, though it teaches what ${f.prerequisite} builds on: is the boundary right? Else give the reason ("Begründung")`);
    }
    const seen = new Map();
    let lastBand = -1;
    for (const c of e.chapters) {
      const cat = `${at}, chapter ${c.id}`;
      const warnC = (w) => (c.reason.trim() || e.reason.trim() ? answered : open).push(w);
      const ok = c.competencies.filter((id) => comp(id));
      for (const id of ok) {
        if (seen.has(id)) warnC(`${cat}: ${id} is already in chapter ${seen.get(id)} of this explainer: give the reason ("Begründung")`);
        else seen.set(id, c.id);
      }
      const band = BANDS.indexOf(c.band);
      if (band < 0) errors.push(`${cat}: grade band ${c.band} is none of ${BANDS.join(", ")}`);
      else if (band < lastBand) warnC(`${cat}: grade band ${c.band} after a later one: order the chapters by grade band`);
      lastBand = Math.max(lastBand, band);
      const off = ok.filter((id) => comp(id).gradeBand !== c.band);
      if (off.length) warnC(`${cat}: grade band ${c.band}, but ${off.map((id) => `${id} (${comp(id).gradeBand})`).join(", ")}: give the reason ("Begründung")`);
      if (ok.length < 2 || ok.length > 10) warnC(`${cat}: ${ok.length} Bausteine, outside 2-10: give the reason ("Begründung")`);
    }
    if (e.chapters.length < 2 || e.chapters.length > 8) warnE(`${at}: ${e.chapters.length} chapters, outside 2-8: give the reason ("Begründung")`);
    for (const id of known) where.set(id, [...(where.get(id) ?? []), e.id]);
  }
  const without = new Map(parsed.without.map((w) => [w.id, w]));
  for (const [id, w] of without) {
    if (!comp(id)) errors.push(`Ohne Explainer, line ${w.line}: no Baustein ${id} in ${subject.id}`);
    else if (where.has(id)) errors.push(`Ohne Explainer, line ${w.line}: ${id} is in ${where.get(id).join(", ")}`);
    else if (!w.reason.trim()) errors.push(`Ohne Explainer, line ${w.line}: ${id} needs a reason`);
  }
  const missing = [...subject.competencies.keys()].filter((id) => !where.has(id) && !without.has(id));
  if (missing.length) errors.push(`${missing.length} Bausteine in no explainer and not under "Ohne Explainer": ${missing.join(", ")}`);
  // explainers that build on each other, directly or in a circle (KD-20): the order of the explainers must be a line
  // A circle closed by an edge the draft questions under "Hinweise zur Karte" (a line with `a` → `b`) waits for the map
  // to be fixed (skill map-research, KD-21): answered; any other circle is an error.
  const questioned = new Set([...(parsed.notes ?? "").matchAll(/`([a-z0-9-]+)`\s*(?:→|->)\s*`([a-z0-9-]+)`/g)].map((m) => `${m[1]}>${m[2]}`));
  const owner = new Map();
  for (const e of parsed.explainers) for (const c of e.chapters) for (const id of c.competencies) if (!owner.has(id)) owner.set(id, e.id);
  for (const circle of circles(relations(subject, parsed))) {
    const inCircle = new Set(circle);
    const edges = [];
    for (const [id, from] of owner) {
      if (!inCircle.has(from)) continue;
      for (const r of comp(id)?.requires ?? []) if (owner.has(r) && owner.get(r) !== from && inCircle.has(owner.get(r))) edges.push(`${id} → ${r}`);
    }
    const asked = edges.filter((x) => questioned.has(x.replace(" → ", ">")));
    const text = `explainers build on each other in a circle: ${circle.join(" → ")} → ${circle[0]}; edges between them: ${edges.join(", ")}`;
    if (asked.length) answered.push(`${text} (questioned under "Hinweise zur Karte": ${asked.join(", ")}; resolved when the map is fixed)`);
    else errors.push(`${text}. Check each edge: a real prerequisite? Then cut the explainers so that one comes before the other. A context link or an edge to a too broad Baustein? Then write it under "Hinweise zur Karte" as \`a\` → \`b\` with a proposal for the map, and keep the cut.`);
  }
  const chapters = parsed.explainers.flatMap((e) => e.chapters);
  const n = (xs) => (xs.length ? `${Math.min(...xs)}-${Math.max(...xs)}` : "-");
  const info = [
    `${parsed.explainers.length} explainers (${n(parsed.explainers.map((e) => e.chapters.length))} chapters), ` +
      `${chapters.length} chapters (${n(chapters.map((c) => c.competencies.length))} Bausteine), ` +
      `${where.size} of ${subject.competencies.size} Bausteine in an explainer, ${without.size} without`,
    ...[...where].filter(([, es]) => es.length > 1).map(([id, es]) => `overlap: ${id} in ${es.join(", ")}`),
  ];
  return { errors, warnings: open, answered, info };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const fileArg = argv.indexOf("--file");
  const given = fileArg >= 0 ? argv.splice(fileArg, 2)[1] : undefined;
  const [sid, flag] = argv;
  const subjects = loadMap(root + "map");
  // the draft: --file <path> (a working file, e.g. before the issues are created), else map/<subject>/explainer.md
  const file = (s) => given ?? `${root}map/${s.id}/explainer.md`;
  const targets = sid === "--all" ? subjects.filter((s) => existsSync(file(s))) : subjects.filter((s) => s.id === sid);
  if (!targets.length) {
    console.error(`usage: check.mjs <subject>|--all [--relations]; subjects: ${subjects.map((s) => s.id).join(", ")}`);
    process.exit(2);
  }
  let failed = false;
  for (const subject of targets) {
    if (!existsSync(file(subject))) {
      console.log(`${subject.id}: map/${subject.id}/explainer.md is missing`);
      failed = true;
      continue;
    }
    const parsed = parseExplainers(readFileSync(file(subject), "utf8"));
    const r = checkExplainers(subjects, subject, parsed);
    console.log(`# ${subject.id}`);
    for (const i of r.info) console.log(`  info  ${i}`);
    if (flag === "--relations") {
      for (const [id, { needs, feeds }] of relations(subject, parsed)) {
        const list = (m) => [...m].map(([k, v]) => `${k} (${v.join(", ")})`).join("; ") || "-";
        console.log(`  rel   ${id}: builds on ${list(needs)} · leads to ${[...feeds.keys()].join(", ") || "-"}`);
      }
    }
    for (const w of r.answered) console.log(`  note  ${w} (answered by a Begründung)`);
    for (const w of r.warnings) console.log(`  warn  ${w}`);
    for (const e of r.errors) console.log(`  ERROR ${e}`);
    console.log(`  ${r.errors.length} errors, ${r.warnings.length} open warnings, ${r.answered.length} answered`);
    failed ||= r.errors.length > 0;
  }
  process.exit(failed ? 1 : 0);
}
