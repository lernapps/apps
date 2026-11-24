# Research Report: Deutsch als Fremdsprache (DaF) Learning Map

*Branch: `feat/map-daf` · Date: 2026-11-24 · Status: `draft`*

## 1. Sources

German as a Foreign Language (DaF) has no domestic KMK-Bildungsstandards for Sekundarstufe I (KMK Deutsch covers L1 German). Following `map-research`, the map uses the official KMK-endorsed school DaF framework and three authoritative CEFR A1–B1 curricula/inventories:

1. **ZfA / KMK (2009):** *Rahmenplan „Deutsch als Fremdsprache“ für das Auslandsschulwesen*, erstellt im Auftrag der Zentralstelle für das Auslandsschulwesen (ZfA) im Einvernehmen mit dem Zentralen Ausschuss für das Deutsche Sprachdiplom der KMK (249. Sitzung des Bund-Länder-Ausschusses, 22./23.09.2009).
   - URL: https://www.auslandsschulwesen.de/resource/blob/2789274/febe196fc6737e2f3dc86448e997cceb/daf-rahmenplan-data.pdf
   - Carries the three MSA-equivalent Bildungsabschnitte (**A1**, **A2**, **B1** / DSD I, Kap. 3, S. 15–37) and all five strands (3.1 Kommunikative Teilkompetenzen, 3.2.1 Aussprache/Intonation, 3.2.2 Orthographie, 3.2.3 Wortschatz, 3.2.4 Grammatik, 3.3 Texte und Medien, 3.4 Interkulturelle Kompetenzen).
2. **Goethe-Institut / telc / ÖSD / Universität Freiburg:** *Prüfungsziele, Testbeschreibung* for:
   - **Goethe-Zertifikat A1** (*Start Deutsch 1* / *Fit in Deutsch 1*): https://www.goethe.de/pro/relaunch/prf/de/Pruefungsziele_Testbeschreibung_A1_SD1.pdf and https://www.goethe.de/pro/relaunch/prf/de/Pruefungsziele_Testbeschreibung_A1_Fit1.pdf
   - **Goethe-Zertifikat A2** (*Fit in Deutsch 2* / *Goethe-Zertifikat A2*): https://www.goethe.de/pro/relaunch/prf/pt/Pruefungsziele_Testbeschreibung_A2_Fit2.pdf
   - **Zertifikat B1** (Goethe-Institut / ÖSD / Univ. Freiburg, ISBN 978-3-19-031868-1, 2013/2016)
3. **BAMF (2016):** *Rahmencurriculum für Integrationskurse – Deutsch als Zweitsprache* (A1–B1): https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/Integrationskurse/Kurstraeger/KonzepteLeitfaeden/rahmencurriculum-integrationskurs.html
4. **Council of Europe (2001 / 2020):** *Common European Framework of Reference for Languages (CEFR)* & *Companion Volume*: https://rm.coe.int/common-european-framework-of-reference-for-languages-learning-teaching/16809ea0d4 (used for phonological control, sociolinguistic appropriateness, and mediation descriptors).

## 2. Key Decisions

- **Subject ID and naming:** `daf` (`name: { de: "Deutsch als Fremdsprache", en: "German as a Foreign Language" }`). Kept separate from `map/deutsch.yaml` (L1 German).
- **Strands:** Uses all five shared modern-language strands from the `map-research` ontology: `grammatik`, `wortschatz`, `aussprache` (Aussprache und Rechtschreibung), `landeskunde` (Länder und Kulturen — pluricentric D-A-CH), and `texte` (Texte und Medien).
- **`explainerFocus: competency`:** As with English, French, and Spanish, DaF unit apps weave vocabulary, grammar, pronunciation, culture, and texts together.
- **Band mapping and `bandLabels`:** Maps the three CEFR stages onto the existing `gradeBand` enum (`"5-6"` → **A1**, `"7-8"` → **A2**, `"9-10"` → **B1**), matching ZfA's three Bildungsabschnitte up to MSA/DSD I. Added optional `bandLabels` to `subject.v1` (`schemas/map.js`, `lib/map.js`, `src/_data/map.js`, `eleventy.config.js`, and map templates) so DaF displays **A1 / A2 / B1** in the UI without changing any existing subject.
- **English-only competency text:** Per user request, competency `name` and `iCan` in `map/daf.yaml` are English-only (`{ en: "I can …" }`). Extended `schemas/map.js` (`MapText`) and `eleventy.config.js` (`tx`, `fallbackLang`) so English-only competencies validate cleanly and render with `lang="en"` on German pages.
- **Status:** `draft`, pending review by DaF teachers.

## 3. Structure and Verification (`probe.mjs`)

Total: **151 competencies** across 5 strands (`5-6` / A1: 54, `7-8` / A2: 51, `9-10` / B1: 46).

| Strand | Total | A1 (`5-6`) | A2 (`7-8`) | B1 (`9-10`) |
|---|---:|---:|---:|---:|
| `grammatik` | 64 | 23 | 22 | 19 |
| `wortschatz` | 30 | 11 | 10 | 9 |
| `aussprache` | 15 | 6 | 5 | 4 |
| `landeskunde` | 18 | 6 | 6 | 6 |
| `texte` | 24 | 8 | 8 | 8 |

`node .agents/skills/map-research/scripts/probe.mjs daf`:
- **0 circles between cells** (strand × gradeBand)
- **0 Bausteine to check for their strand**
- **0 isolated competencies** (`alone = []`)
- **0 later-band prerequisites**

## 4. Open Points

1. **Basic vocabulary (`map/daf/vocabulary/`):**
   - **CEFRLex DAFlex** (CENTAL, UCLouvain, https://cental.uclouvain.be/cefrlex/daflex/) is the German sibling to `FLELex` and `EFLLex`, but **is not yet listed on https://cental.uclouvain.be/cefrlex/download/** (online search/analyse only; no downloadable TSV URL).
   - **GerVLPro** (Michael, Hülsing & Horbach, Kiel University / IPN, LREC 2026; https://github.com/noahmanu/gervlpro) publishes a 4,015-entry CEFR-graded TSV, but the repository currently has no `LICENSE` file.
   - Following `map-vocabulary` (never fabricate a list or guess a licence), `map/daf/vocabulary/` is omitted from this PR. Once a licensed TSV (e.g. DAFlex from UCLouvain) is available, generate `map/daf/vocabulary/words.yaml` via `node scripts/vocabulary.mjs daf <lexicon.tsv>`.
2. **Teacher review:** At least one DaF teacher review is needed to raise `status` from `draft` to `checked` (and two for `reviewed`).
3. **Curricula placements (`curricula/`):** None added, as DaF courses are organized by CEFR level rather than fixed German school grades.
