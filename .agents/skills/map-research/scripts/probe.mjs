// Probes the learning map for edges and strand assignments to check (skill map-research, KD-21, KD-23). A report, not a
// test: every finding is a place to look at, not an error.
// 1. Circles between cells strand × grade band: two strands that need each other in the same band. Such a circle makes
//    explainers build on each other. For each edge inside the circle ask: a real prerequisite? the smallest Baustein
//    needed (or only one aspect of it)? and, for an edge into another strand: is the Baustein in the right strand?
// 2. Only with explainerFocus strand: Bausteine whose neighbours (requires and required by) lie mostly in another strand: is their strand right?
// Usage: node .agents/skills/map-research/scripts/probe.mjs [<subject>|--all]
import { fileURLToPath } from "node:url";
import { loadMap } from "../../../../lib/map.js";

const root = fileURLToPath(new URL("../../../../", import.meta.url));

/** Strongly connected groups of more than one node; next(v) lists the nodes v points to. */
function circles(nodes, next) {
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
  for (const v of nodes) if (!idx.has(v)) visit(v);
  return out;
}

/** The findings for one subject: { cells: [{ circle, edges }], strands: [{ id, strand, others }] }. */
export function probe(subject) {
  const comp = (id) => subject.competencies.get(id);
  const cell = (c) => `${c.strand}@${c.gradeBand}`;
  const edges = new Map(); // cell → Map(cell → ["a → b"])
  for (const [id, c] of subject.competencies) {
    for (const r of c.requires) {
      const a = cell(c), b = cell(comp(r));
      if (a === b) continue;
      if (!edges.has(a)) edges.set(a, new Map());
      edges.get(a).set(b, [...(edges.get(a).get(b) ?? []), `${id} → ${r}`]);
    }
  }
  const nodes = [...new Set([...subject.competencies.values()].map(cell))];
  const cells = circles(nodes, (v) => [...(edges.get(v)?.keys() ?? [])]).map((circle) => {
    const inside = new Set(circle);
    const list = [];
    for (const a of circle) for (const [b, es] of edges.get(a) ?? []) if (inside.has(b)) list.push(...es.map((e) => ({ edge: e, crossStrand: a.split("@")[0] !== b.split("@")[0] })));
    return { circle, edges: list };
  });
  // neighbours of a Baustein: what it requires and what requires it
  // with competency focus, Bausteine of several strands belong together on purpose: no strand finding there
  const strands = [];
  if (subject.explainerFocus !== "competency") for (const [id, c] of subject.competencies) {
    const near = [...c.requires, ...(subject.requiredBy.get(id) ?? [])].map((n) => comp(n).strand);
    if (near.length < 2) continue;
    const own = near.filter((s) => s === c.strand).length;
    const others = near.filter((s) => s !== c.strand);
    if (own === 0 || others.length / near.length >= 2 / 3) {
      const count = new Map();
      for (const s of others) count.set(s, (count.get(s) ?? 0) + 1);
      strands.push({ id, strand: c.strand, others: [...count].sort((x, y) => y[1] - x[1]), own, total: near.length });
    }
  }
  return { cells, strands };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const sid = process.argv[2] ?? "--all";
  const subjects = loadMap(root + "map").filter((s) => sid === "--all" || s.id === sid);
  if (!subjects.length) {
    console.error("usage: probe.mjs [<subject>|--all]");
    process.exit(2);
  }
  for (const s of subjects) {
    const { cells, strands } = probe(s);
    console.log(`# ${s.id} (${s.explainerFocus ?? "strand"}): ${cells.length} circles between cells, ${strands.length} Bausteine to check for their strand`);
    for (const { circle, edges } of cells) {
      console.log(`  circle ${circle.join(" ↔ ")}`);
      for (const { edge, crossStrand } of edges) console.log(`    ${edge}${crossStrand ? "   (other strand: right strand? real and specific prerequisite?)" : "   (real and specific prerequisite?)"}`);
    }
    for (const { id, strand, others, own, total } of strands) {
      console.log(`  strand? ${id} in ${strand}: ${own} of ${total} neighbours in its own strand; ${others.map(([o, n]) => `${n} in ${o}`).join(", ")}`);
    }
  }
}
