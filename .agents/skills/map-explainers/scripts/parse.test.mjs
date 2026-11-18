// Run by hand: node --test .agents/skills/map-explainers/scripts/parse.test.mjs (not part of npm test, KD-10)
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseExplainers } from "./parse.mjs";

const sample = `# Explainer: Physik

## Prinzipien des Fachs
### not-an-explainer · prose
- Bausteine: ignored

## Explainer

### stromkreise · Stromkreise
- Explainer: strand physik/elektrizitaetslehre
- Leitidee: Strom fließt nur im geschlossenen Kreis.
- Didaktik: Wasser-Analogie; Kreise interaktiv bauen und virtuell messen.
- Abgrenzung: ohne Elektromagnetismus.

#### lampe · Wann leuchtet die Lampe? (5-6)
- Kernidee: Ich kann einen Stromkreis bauen.
- Didaktik: Führt den Baukasten ein.
- Bausteine: \`einfacher-stromkreis\`, leiter-nichtleiter

#### messen · Messen (7-8)
- Kernidee: Ich kann messen.
- Didaktik: Neu: Messgeräte im Baukasten.
- Bausteine: stromstaerke
- Begründung: kurz.
- Leitidee: wrong place
- Wiederholung: physik/masse

### kaputt
#### lose · Lose (5-6)

### leer · Leer
- Explainer: physik
- Davor: stromkreise

## Ohne Explainer
- \`isoliert\`: kein Partner
`;

test("reads an explainer with its fields and chapters", () => {
  const [e] = parseExplainers(sample).explainers;
  assert.equal(e.id, "stromkreise");
  assert.deepEqual(e.target, { strand: "physik/elektrizitaetslehre" });
  assert.equal(e.fields.Didaktik, "Wasser-Analogie; Kreise interaktiv bauen und virtuell messen.");
  assert.deepEqual(
    e.chapters.map(({ id, band, didactics, competencies }) => ({ id, band, didactics, competencies })),
    [
      { id: "lampe", band: "5-6", didactics: "Führt den Baukasten ein.", competencies: ["einfacher-stromkreis", "leiter-nichtleiter"] },
      { id: "messen", band: "7-8", didactics: "Neu: Messgeräte im Baukasten.", competencies: ["stromstaerke"] },
    ],
  );
  assert.equal(e.chapters[1].reason, "kurz.");
});

test("ignores headings and lines outside the section Explainer", () => {
  assert.ok(!parseExplainers(sample).explainers.some((e) => e.id === "not-an-explainer"));
});

test("reads the section Ohne Explainer", () => {
  assert.deepEqual(parseExplainers(sample).without.map(({ id, reason }) => ({ id, reason })), [{ id: "isoliert", reason: "kein Partner" }]);
});

test("reports misplaced lines, unreadable headings, missing fields", () => {
  const t = parseExplainers(sample).errors.map((e) => e.text);
  assert.ok(t.includes('messen: "Leitidee" belongs to the explainer, above its first chapter'));
  assert.ok(t.some((x) => x.startsWith('heading not readable, expected "### <id> · <Titel>"')));
  assert.ok(t.includes("chapter outside an explainer: #### lose · Lose (5-6)"));
  assert.ok(t.some((x) => x.startsWith("Explainer not readable")));
  assert.ok(t.includes('leer: no line "- Didaktik: …"'));
  assert.ok(t.includes("leer: no chapter"));
});

test("rejects the relations the map already holds (KD-13)", () => {
  const t = parseExplainers(sample).errors.map((e) => e.text);
  assert.ok(t.includes('"Wiederholung" is not part of a draft: the map holds the relations of the Bausteine (KD-13)'));
  assert.ok(t.includes('"Davor" is not part of a draft: the map holds the relations of the Bausteine (KD-13)'));
});

test("requires a Didaktik per chapter, and reports an id used twice", () => {
  const t = parseExplainers("## Explainer\n### a · A\n- Leitidee: x\n#### a · A (5-6)\n- Kernidee: k\n- Bausteine: b\n").errors.map((e) => e.text);
  assert.ok(t.includes('a: no line "- Didaktik: …"'));
  assert.ok(t.includes("a: id used twice"));
});
