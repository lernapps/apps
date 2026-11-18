---
name: map-explainers
description: Use when the explainers of a subject of the learning map are drafted and proposed as GitHub issues (labels explainer, proposed) - what an explainer draft holds (boundaries, didactics, chapters of Bausteine), how it is cut, checked and turned into issues, and the brief for an agent per subject.
---

# Drafting the explainers of a subject

An **explainer draft** sketches an explainer before anyone builds it. It does two things:

1. It **draws boundaries**: which Bausteine of the map belong to the explainer and to which of its chapters, and
   what deliberately stays outside.
2. It fixes the **didactics**: the concept that holds the explainer together, and per chapter how the chapter takes
   it up, extends it, or deliberately brings in a new one.

It does **not** repeat what the map already holds: the relations of the Bausteine (`requires`), their order, what an
explainer needs from elsewhere. Whoever builds an explainer looks at the map first. What an explainer needs from other
explainers and what builds on it, `check.mjs --relations` computes from the map. Whether a Baustein becomes one page
or several is secondary.

The drafts are a one-off planning aid for creators, not part of the map's model (no field, no schema). The result is
**GitHub issues in lernapps/apps, in German, with the labels `explainer` and `proposed`**: one per explainer and one
overview per subject (KD-19). The draft file is only a working file to check the boundaries and to write the issues
from; it is not committed. The pilots `map/physik/explainer.md`, `map/franzoesisch/explainer.md` and
`map/politik-wirtschaft/explainer.md` show the draft format. The decisions behind this are the KD-xx of
`.vibe/development-plan-claude-lernlandkarten-content-structure-uesnsl.md` (above all KD-11, KD-13, KD-14).

Terms: an explainer of a subject with `explainerFocus: strand` is a **strand app**; with `competency` it may be a
**unit app** (Einheiten-App) across strands. A chapter is a folder of the explainer (`src/<chapter>/<page>.yaml`,
format 2). "Baustein" means only a competency of the map ("Ich kann …"); say "Komponente", "Visualisierung", "Bild",
"Modell" for parts of an explainer. "Einordnung" is taken by the map (a curriculum places a Baustein in grades).

## What makes a good explainer

1. **One idea that carries.** A **Leitidee**: what a child understands at the end, in one sentence. A topic a teacher
   would recognise as a teaching sequence.
2. **A didactic concept that holds it together.** The **Didaktik** says how the explainer teaches, and it is the
   reason why its chapters belong together. Make it concrete enough that a creator could start from it:
   - a model or analogy that runs through it ("Wir erklären den Stromkreis mit der Wasser-Analogie"),
   - a way of working ("möglichst viel interaktiv bauen oder virtuell messen", "jedes Kapitel beginnt mit einem Fall
     aus dem Alltag und endet mit einem eigenen Urteil", "ein Planspiel"),
   - a visualisation or picture that recurs and grows from chapter to chapter (a diagram, a map, a timeline, a table),
   - recurring characters or a place that carry situations.
   Topics that need a different model are a different explainer: cut by didactics, not by grade band.
3. **No circles (KD-20).** The explainers of a subject can be put in a line: no two build on each other, directly or
   over others. The check reports a circle as an error. Resolve it while drafting: move the Bausteine that close the
   circle, or split an explainer so that one part comes before and one after the other explainer. The check names the
   edges between the explainers of the circle; test each first (KD-21): is it a real prerequisite ("without B, A
   cannot be understood"), and does A need all of B or only one aspect? A circle closed by a context link or by an
   edge to a too broad Baustein is a fault of the map, not of the cut: keep the cut, write the edge under
   "Hinweise zur Karte" as `a` → `b` with a proposal (drop it, point it at a smaller Baustein, add one), and the check
   counts the circle as answered until the map is fixed (skill `map-research`). Do not distort explainers to dodge a
   wrong edge.
4. **Clear boundaries.** The **Abgrenzung** says what belongs in, what deliberately does not, and why: the line to
   neighbouring explainers of the file (name their ids) that touch the same topic with another concept. It does not
   list prerequisites; those follow from the map.
5. **Within the rules of the platform.** With `explainerFocus: strand` an explainer stays in one strand; with
   `competency` it may mix strands. It may run over several grade bands when one concept carries (the chapters are
   then used in different years), or be one band only. A strand may have several explainers.
6. **A sensible size.** As a guide 2 to 8 chapters. The test is the didactics: one that needs two concepts is two.

## What makes a good chapter

A chapter is the level between explainer and Baustein: a step of the explainer's concept.

1. **A Didaktik of its own**, in relation to the explainer's concept. Say which of these it does, and how:
   - **takes it up**: applies the model to new Bausteine ("der Baukasten bekommt Messgeräte"),
   - **extends or refines it**: the model gets more precise where the old one is not enough ("aus dem Wasser werden
     Elektronen"),
   - **brings in a new concept deliberately**: say why the explainer's concept does not carry here and why the chapter
     still belongs to this explainer (otherwise it is a different explainer).
2. **One grade band** (5-6, 7-8 or 9-10), chapters in the order of the bands. A Baustein of another band needs a
   reason.
3. **2 to 10 Bausteine** that belong together in this step, with a **Kernidee** (one sentence, "Ich kann …" or
   "Ich weiß …"). The Bausteine are a set: their order is in the map.
4. A Baustein stands once per explainer. It may stand in two explainers when both need it to work (say why).
5. Every Baustein of the subject is in an explainer, or under "Ohne Explainer" with a reason.

## Patterns that worked

- Several explainers per strand when its topics need different models; one explainer over several grade bands when
  one model carries.
- Something that grows from chapter to chapter makes the chapters one explainer.
- Recurring characters and places carry situation explainers.
- Languages (KD-16): grammar lives in **system explainers**, one per system (noun group, verbs, tenses, sentences,
  pronouns, sounds), each with one visual model; the system explainers share no Bausteine. **Situation explainers**
  (across strands: characters, places, texts, opinions) contain no grammar Bausteine of their own: they use grammar,
  and the chapter that needs it starts with a collective recap (below).
- A boundary through the middle of a chain (the explainer teaches A and C, C needs B, B is elsewhere) is usually a
  wrong boundary.

## What the draft leaves to the build: the collective recap

A chapter that needs Bausteine from other explainers starts, when it is built, with **one** compact recap page
("Das brauchst du hier") that names all of them: a recap page may repeat several Bausteine (`recap: [<fach>/<id>, …]`,
lernapps/app-templates `feat/recap-several`). Which Bausteine these are follows from the map (`check.mjs --relations`
shows them per explainer); the draft does not list them. The page is very compact: each Baustein with its
"Ich kann …", a short self-check, no new content, no exercise; `lernapps check` warns when a Baustein is not named.

## Method

0. Before agents draft a subject, whoever coordinates runs `node .agents/skills/map-research/scripts/probe.mjs <subject>`
   and fixes the map where an edge or a strand is wrong (KD-22, KD-23): agents drafting explainers never change the map.
1. Orient yourself on the map: `node .agents/skills/map-explainers/scripts/draft.mjs <subject>` prints per cell
   strand × band the Bausteine in the order of the chain, the groups connected over `requires` and what comes from
   outside. Read it together with `map/<subject>.yaml`: the comments name the sources and topic areas of the Länder,
   a good hint for themes. A basic vocabulary (`map/<subject>/vocabulary/`) has levels, no topic fields: background.
2. Write the **principles of the subject**: which didactic concepts suit it (experiment and model, case and judgement,
   situation of communication, source and narrative …), how its explainers are cut, typical exceptions.
3. Sketch the explainers first (title, Leitidee, Didaktik, Abgrenzung), then the chapters (title, band, Kernidee,
   Didaktik, Bausteine).
4. `node .agents/skills/map-explainers/scripts/check.mjs <subject> --relations --file <draft.md>` until there are no errors and no open
   warnings. A warning is fixed, or answered by a `Begründung` of its chapter (or explainer), which names each
   exception; answered warnings print as `note`. Read the computed relations: an explainer that builds on many others,
   or two that build on each other, hint at a wrong boundary.
5. Turn the draft into issues (below).
6. Never change `map/<subject>.yaml` here. If the map seems wrong (a missing or weak `requires`, a Baustein in an odd
   strand or band), note it under "Hinweise zur Karte"; the map is changed with skill `map-research`.

## Format of the draft file

German, plain language. Only the lines below count for the check; any other prose is welcome.

```markdown
# Explainer: <Fach>

Stand <YYYY-MM-DD>, Methode: Skill `map-explainers`. <n> Explainer, <m> Kapitel, <k> von <K> Bausteinen.

## Prinzipien des Fachs

<Didactic concepts of the subject, how its explainers are cut, typical exceptions.>

## Explainer

### <explainer-id> · <Titel>
- Explainer: strand <fach>/<strang>          (or: subject <fach>, only with explainerFocus: competency)
- Leitidee: <one sentence: what a child understands at the end>
- Didaktik: <the concept that holds the explainer together>
- Abgrenzung: <what is in, what deliberately not, the line to neighbouring explainers>
- Begründung: <exceptions of the explainer>                (optional)

#### <kapitel-id> · <Titel> (<Stufe>)
- Kernidee: <one sentence>
- Didaktik: <takes up / extends / deliberately new: how>
- Bausteine: <id>, <id>, …
- Begründung: <exceptions of the chapter>                  (optional)

## Ohne Explainer

- <id>: <reason>

## Hinweise zur Karte

- <optional>
```

The headings use the middle dot U+00B7. Ids may stand in backticks. Ids of explainers and chapters are slugs
(lowercase, digits, hyphens), unique in the file. Lines of the explainer stand above its first chapter. The lines
`Davor`, `Danach`, `Daneben` and `Wiederholung` are not part of a draft: the check rejects them.

## The check

`check.mjs` checks boundaries, with the checks of the platform where they concern boundaries (`checkApp`, the `gap`
of `checkPages` in `lib/map.js`):

| Finding | Level |
|---|---|
| unreadable heading or line, a line in the wrong place or not part of a draft, missing `Explainer`/`Leitidee`/`Didaktik`/`Abgrenzung`, a chapter without `Kernidee`/`Didaktik`/`Bausteine`, an id twice | error |
| unknown Baustein, a Baustein of another strand, `subject` without competency focus | error |
| explainers that build on each other in a circle | error |
| a Baustein in no explainer and not under "Ohne Explainer"; one there that is in an explainer | error |
| a boundary through the middle of a chain (`gap`); a chapter of another grade band than its Bausteine, or out of band order; a chapter outside 2-10 Bausteine; an explainer outside 2-8 chapters; a Baustein twice in one explainer | warning |
| sizes, coverage, Bausteine in two explainers; with `--relations`: per explainer what it builds on and what it leads to | info |

The parser has a small test, run by hand and not by `npm test`:
`node --test .agents/skills/map-explainers/scripts/parse.test.mjs`.

## Issues

1. `node .agents/skills/map-explainers/scripts/issues.mjs <subject> --file <draft.md>` prints the texts as JSON: one
   issue per explainer (`Explainer <Fach>: <Titel>`) and an overview (`Explainer <Fach>: Überblick`), all with the
   labels `explainer` and `proposed`. Explainer ids in the text become their titles; Bausteine become links to the map.
2. Before creating anything, list the open issues of lernapps/apps with the label `explainer` and the subject's name in
   the title: do not create a subject twice.
3. Create the explainer issues in lernapps/apps (GitHub tools, `issue_write`), in the order of the draft; note their
   numbers. The labels exist (created with the first issue, lernapps/apps#345).
4. Run `issues.mjs` again with `--numbers <explainer-id>=<n>,…`: explainer names in the overview (and in each issue's
   text) become links `#n`. Create the overview issue, add the explainer issues as its sub-issues if the tools allow it,
   and update the explainer issues whose text now has `#n` links.
5. Do not edit the issue texts by hand: change the draft and render again. Do not commit the draft file.

An explainer issue holds: Leitidee, kind of app, bands, numbers of chapters and Bausteine; Didaktik; Abgrenzung; the
chapters (title, band, Kernidee, Didaktik, Bausteine as links to the map, exceptions); the task to examine how the
explainer fits into the subject's learning map (no computed relations, KD-18); when it is done. The overview holds the
principles of the subject, the list of its explainers, the Bausteine without explainer and the notes on the map.

## Brief for an agent per subject

```markdown
Entwirf die Explainer für <Fach> nach dem Skill `.agents/skills/map-explainers/SKILL.md` in /home/user/apps und lege
sie als Issues in lernapps/apps an (Deutsch, Labels `explainer` und `proposed`).

Ausgangslage: <the summary line of draft.mjs, with the names of the strands>
Besonderheiten des Fachs: <hints: didactic concepts that suit the subject, where to expect difficulty>

- Arbeitsdatei: <scratchpad>/<subject>-explainer.md (nicht committen); Check mit `--file` ohne Fehler und ohne offene
  Warnungen.
- Nur Issues erzeugen: keine Änderung an Dateien des Repositorys, kein Commit, kein Push.
- Rückmeldung: Liste der Issues (Nummer, Titel), Zeile des Checks, schwierigste Grenzen, Hinweise zur Karte.
```
