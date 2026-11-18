// Raw material for drafting the explainers of a subject (skill map-explainers): per cell strand × grade band, the
// competencies in the order of the chain, the groups that hang together over requires, and the edges out of the cell.
// Usage: node .agents/skills/map-explainers/scripts/draft.mjs <subject> [--summary]
import { fileURLToPath } from "node:url";
import { loadMap, byStep } from "../../../../lib/map.js";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const BANDS = ["5-6", "7-8", "9-10"];
const de = (t) => (typeof t === "string" ? t : t?.de ?? "");

/** The cells of a subject: [{ strand, band, ids (in the order of the chain), groups (connected over requires) }]. */
export function cells(subject) {
  const out = [];
  for (const strand of subject.strands) {
    for (const band of BANDS) {
      const inCell = strand.competencies.filter((id) => subject.competencies.get(id).gradeBand === band);
      if (!inCell.length) continue;
      const ids = byStep(subject, inCell).flatMap((r) => r.ids);
      const set = new Set(ids);
      // connected groups over requires inside the cell (undirected)
      const parent = new Map(ids.map((id) => [id, id]));
      const find = (x) => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x))), parent.get(x)));
      for (const id of ids) for (const r of subject.competencies.get(id).requires) if (set.has(r)) parent.set(find(id), find(r));
      const groups = new Map();
      for (const id of ids) {
        const k = find(id);
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push(id);
      }
      out.push({ strand, band, ids, groups: [...groups.values()] });
    }
  }
  return out;
}

function report(subject, summary) {
  const list = cells(subject);
  const size = (n) => (n < 4 ? "<4" : n > 10 ? ">10" : "4-10");
  const count = (k) => list.filter((c) => size(c.ids.length) === k).length;
  const lines = [
    `# Rohdaten Explainer: ${de(subject.name)}`,
    "",
    `Fokus: ${subject.explainerFocus ?? "strand"} · ${subject.strands.length} Stränge · ${subject.competencies.size} Kompetenzen · ` +
      `${list.length} Zellen (Strang × Stufe): <4: ${count("<4")}, 4-10: ${count("4-10")}, >10: ${count(">10")}; ` +
      `größte Zelle ${Math.max(...list.map((c) => c.ids.length))}`,
  ];
  if (summary) return lines.join("\n");
  for (const c of list) {
    lines.push("", `## ${de(c.strand.name)} (\`${c.strand.id}\`) · ${c.band} · ${c.ids.length} Kompetenzen · ${c.groups.length} Gruppe(n)`);
    c.groups.forEach((g, i) => {
      lines.push("", `Gruppe ${i + 1} (${g.length}):`);
      for (const id of g) {
        const comp = subject.competencies.get(id);
        const own = new Set(c.ids);
        const outside = comp.requires.filter((r) => !own.has(r)).map((r) => {
          const rc = subject.competencies.get(r);
          return `${r} [${rc.strand === c.strand.id ? "" : rc.strand + " "}${rc.gradeBand}]`;
        });
        const inside = comp.requires.filter((r) => own.has(r));
        const step = subject.places.get(id).step;
        lines.push(
          `- \`${id}\` (Stufe ${step}) ${de(comp.name)}` +
            (inside.length ? ` · baut auf: ${inside.join(", ")}` : "") +
            (outside.length ? ` · von außen: ${outside.join(", ")}` : "") +
            (subject.requiredBy.get(id)?.length ? ` · öffnet ${subject.requiredBy.get(id).length}` : ""),
        );
      }
    });
  }
  return lines.join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [sid, flag] = process.argv.slice(2);
  const subjects = loadMap(root + "map");
  const targets = sid === "--all" ? subjects : subjects.filter((s) => s.id === sid);
  if (!targets.length) {
    console.error(`usage: draft.mjs <subject>|--all [--summary]; subjects: ${subjects.map((s) => s.id).join(", ")}`);
    process.exit(2);
  }
  console.log(targets.map((s) => report(s, flag === "--summary" || sid === "--all")).join("\n\n"));
}
