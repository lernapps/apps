// Reads map/<subject>/explainer.md (skill map-explainers): the drafts of the explainers of a subject, their chapters
// and the Bausteine (competencies) each chapter names. Only the machine-readable lines count; the rest is prose.

const EXPLAINER = /^###\s+`?([a-z0-9-]+)`?\s+·\s+(.+?)\s*$/;
const CHAPTER = /^####\s+`?([a-z0-9-]+)`?\s+·\s+(.+?)\s+\((\d+-\d+)\)\s*$/;
const ITEM = /^-\s+(Explainer|Leitidee|Didaktik|Abgrenzung|Kernidee|Bausteine|Begründung|Davor|Danach|Daneben|Wiederholung):\s*(.*)$/;
// The map holds the relations of the Bausteine; a draft does not repeat them (KD-13).
const DROPPED = ["Davor", "Danach", "Daneben", "Wiederholung"];
const ids = (text) => text.split(",").map((s) => s.replace(/`/g, "").trim()).filter(Boolean);
const EXPLAINER_KEYS = ["Explainer", "Leitidee", "Didaktik", "Abgrenzung", "Begründung"];
const CHAPTER_KEYS = ["Kernidee", "Didaktik", "Bausteine", "Begründung"];
const REQUIRED_EXPLAINER = ["Leitidee", "Didaktik", "Abgrenzung"];

/**
 * Parses the text of an explainer.md. Returns { explainers, without, errors }:
 * - explainers: [{ id, title, line, target: { strand } | { subject }, fields: { Leitidee, Didaktik, Abgrenzung }, reason,
 *   chapters: [{ id, title, band, line, core, didactics, competencies, reason }] }]
 * - without: [{ id, reason, line }] from the section "## Ohne Explainer"
 * - errors: [{ line, text }]
 */
export function parseExplainers(text) {
  const explainers = [];
  const without = [];
  const errors = [];
  let notes = "";
  let section = "";
  let explainer;
  let chapter;
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = i + 1;
    const s = raw.trim();
    if (/^##\s/.test(s)) {
      section = s.replace(/^##\s+/, "");
      explainer = chapter = undefined;
      return;
    }
    if (section === "Hinweise zur Karte") {
      notes += raw + "\n";
      return;
    }
    if (section === "Ohne Explainer") {
      const m = s.match(/^-\s+`?([a-z0-9-]+)`?\s*:\s*(.*)$/);
      if (m) without.push({ id: m[1], reason: m[2], line });
      return;
    }
    if (section !== "Explainer") return;
    if (/^###\s/.test(s)) {
      const m = s.match(EXPLAINER);
      chapter = undefined;
      if (!m) {
        errors.push({ line, text: `heading not readable, expected "### <id> · <Titel>": ${s}` });
        explainer = undefined;
        return;
      }
      explainer = { id: m[1], title: m[2], line, target: undefined, fields: {}, reason: "", chapters: [] };
      explainers.push(explainer);
      return;
    }
    if (/^####\s/.test(s)) {
      const m = s.match(CHAPTER);
      if (!explainer) {
        errors.push({ line, text: `chapter outside an explainer: ${s}` });
        return;
      }
      if (!m) {
        errors.push({ line, text: `heading not readable, expected "#### <id> · <Titel> (<Stufe>)": ${s}` });
        chapter = undefined;
        return;
      }
      chapter = { id: m[1], title: m[2], band: m[3], line, core: "", didactics: "", competencies: [], reason: "" };
      explainer.chapters.push(chapter);
      return;
    }
    const m = s.match(ITEM);
    if (!m || !explainer) return;
    const [, key, value] = m;
    if (DROPPED.includes(key)) return errors.push({ line, text: `"${key}" is not part of a draft: the map holds the relations of the Bausteine (KD-13)` });
    if (chapter) {
      if (!CHAPTER_KEYS.includes(key)) return errors.push({ line, text: `${chapter.id}: "${key}" belongs to the explainer, above its first chapter` });
      if (key === "Kernidee") chapter.core = value;
      else if (key === "Didaktik") chapter.didactics = value;
      else if (key === "Bausteine") chapter.competencies = ids(value);
      else chapter.reason = value;
      return;
    }
    if (!EXPLAINER_KEYS.includes(key)) return errors.push({ line, text: `${explainer.id}: "${key}" belongs to a chapter` });
    if (key === "Begründung") explainer.reason = value;
    else if (key === "Explainer") {
      const e = value.replace(/`/g, "").trim().match(/^(strand|subject)\s+(\S+)$/);
      if (!e) errors.push({ line, text: `Explainer not readable, expected "strand <fach>/<strang>" or "subject <fach>": ${value}` });
      else explainer.target = { [e[1]]: e[2] };
    } else explainer.fields[key] = value;
  });
  const seen = new Set();
  for (const e of explainers) {
    if (!e.target) errors.push({ line: e.line, text: `${e.id}: no line "- Explainer: …"` });
    for (const k of REQUIRED_EXPLAINER) if (!e.fields[k]?.trim()) errors.push({ line: e.line, text: `${e.id}: no line "- ${k}: …"` });
    if (!e.chapters.length) errors.push({ line: e.line, text: `${e.id}: no chapter` });
    for (const c of e.chapters) {
      if (!c.competencies.length) errors.push({ line: c.line, text: `${c.id}: no line "- Bausteine: …"` });
      if (!c.core) errors.push({ line: c.line, text: `${c.id}: no line "- Kernidee: …"` });
      if (!c.didactics) errors.push({ line: c.line, text: `${c.id}: no line "- Didaktik: …"` });
    }
    for (const x of [e, ...e.chapters]) {
      if (seen.has(x.id)) errors.push({ line: x.line, text: `${x.id}: id used twice` });
      seen.add(x.id);
    }
  }
  return { explainers, without, notes, errors };
}
