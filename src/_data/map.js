// The learning map for the pages: the subjects of map/ (checked by lib/map.js; a broken file fails the build), which
// apps of the catalog practise which competency, and one entry per page the map has (src/map-*.njk paginate over them).
import { loadMap, checkApp, coverage, rows, placedCount, ancestors, descendants, byStep, stepRows } from "../../lib/map.js";
import { LANDS, GRADE_BANDS } from "../../schemas/map.js";
import catalog from "./catalog.js";
import languages from "./languages.js";

export default async function () {
  const { apps } = await catalog();
  const subjects = loadMap();

  // An app that names an unknown subject, strand or competency fails the build like a broken entry.
  const errors = [];
  for (const app of apps) {
    const competencies = [...(app.competencies ?? []), ...(app.pages ?? []).flatMap((p) => p.competencies ?? [])];
    if (!app.strand && !competencies.length) continue;
    const recaps = (app.pages ?? []).map((p) => p.recap).filter(Boolean);
    for (const e of checkApp(subjects, { subject: app.subjectId, strand: app.strand, competencies, recaps }).errors) errors.push(`${app.id}: ${e}`);
  }
  if (errors.length) throw new Error(`apps and the learning map:\n  - ${errors.join("\n  - ")}`);

  const views = subjects.map((subject) => {
    const covered = coverage(subject, apps);
    const appsOf = apps.filter((a) => a.subjectId === subject.id);
    const competencies = [...subject.competencies.values()].map((c) => ({
      ...c,
      requiredBy: subject.requiredBy.get(c.id),
      practisedBy: covered.get(c.id),
      placements: subject.curricula
        .filter((cu) => cu.placements.has(c.id))
        .map((cu) => ({ curriculum: cu.id, ...cu.placements.get(c.id) })),
      // The chain (feat/map-steps, KD-06, KD-09): every ancestor by step; the direct descendants by step, and how many
      // more build on it over them, in how many further steps.
      ...chain(subject, c),
    }));
    const byId = new Map(competencies.map((c) => [c.id, c]));
    const strands = subject.strands.map((s) => {
      const list = s.competencies.map((id) => byId.get(id));
      // The strand's apps: its strand apps, and the unit apps of the subject that practise one of its competencies.
      const strandApps = appsOf.filter(
        (a) => a.strand === `${subject.id}/${s.id}` || (!a.strand && list.some((c) => c.practisedBy.some((p) => p.app.id === a.id))),
      );
      // The strand page: its competencies by grade band, and each app as a bar from the first to the last band it
      // practises (indices into GRADE_BANDS); a band no app practises is a gap.
      const bands = GRADE_BANDS.map((band) => ({ band, competencies: list.filter((c) => c.gradeBand === band).map((c) => c.id) }));
      const bars = strandApps
        .map((app) => {
          const mine = list.filter((c) => c.practisedBy.some((p) => p.app.id === app.id));
          const at = mine.map((c) => GRADE_BANDS.indexOf(c.gradeBand));
          return { app, count: mine.length, from: Math.min(...at), to: Math.max(...at) };
        })
        .filter((bar) => bar.count > 0);
      const gaps = GRADE_BANDS.map((_, i) => i).filter((i) => !bars.some((b) => b.from <= i && i <= b.to));
      return {
        ...s,
        total: list.length,
        covered: list.filter((c) => c.practisedBy.length).length,
        apps: strandApps,
        bands,
        bars,
        gaps,
      };
    });
    // A strand and a curriculum share the address /map/<subject>/<id>/, and c/ holds the competencies.
    for (const s of strands) {
      if (s.id === "c" || s.id === "grundwortschatz" || subject.curricula.some((cu) => cu.id === s.id)) {
        throw new Error(`learning map: ${subject.id}: the strand ${s.id} has the address of a curriculum, of c/ or of grundwortschatz/; rename one`);
      }
    }
    const curricula = subject.curricula.map((cu) => ({
      id: cu.id,
      land: cu.land,
      schoolType: cu.schoolType,
      version: cu.version,
      source: cu.source,
      placed: placedCount(subject, cu),
      rows: rows(subject, cu),
      placements: Object.fromEntries(cu.placements),
    }));
    return {
      id: subject.id,
      name: subject.name,
      source: subject.source,
      explainerFocus: subject.explainerFocus,
      strands,
      competencies,
      curricula,
      rows: rows(subject),
      // The grid by steps of the chain (/map/<subject>/c/, feat/map-steps).
      stepRows: stepRows(subject),
      // How many competencies an app practises (the cards of /map/, the filter of the subject page).
      covered: competencies.filter((c) => c.practisedBy.length).length,
      // The basic vocabulary of a language subject, by level (map/<subject>/vocabulary/), or none.
      vocabulary: subject.vocabulary && {
        ...subject.vocabulary,
        byLevel: subject.vocabulary.levels.map((level) => ({
          level,
          words: subject.vocabulary.words.filter((w) => w.level === level),
        })),
      },
      // Every Land in the drop-down; one without a captured curriculum is shown, but cannot be chosen.
      lands: LANDS.map((land) => ({ land, curricula: curricula.filter((c) => c.land === land).map((c) => c.id) })),
    };
  });

  // The pages, once per language (src/map-*.njk): a subject with or without a curriculum, a strand, a competency.
  const each = (list) => list.flatMap((item) => languages.map((l) => ({ ...item, l })));
  const subjectPages = each(
    views.flatMap((s) => [{ subject: s, curriculum: undefined }, ...s.curricula.map((c) => ({ subject: s, curriculum: c }))]),
  );
  const strandPages = each(views.flatMap((s) => s.strands.map((strand) => ({ subject: s, strand }))));
  const competencyPages = each(views.flatMap((s) => s.competencies.map((competency) => ({ subject: s, competency }))));
  const stepsPages = each(views.map((subject) => ({ subject })));
  const vocabularyPages = each(views.filter((s) => s.vocabulary).map((subject) => ({ subject })));

  // The data an assistant reads at /apps/map/<subject>.json (contract, section 5).
  const json = views.map((s) => ({
    subject: s.id,
    data: {
      id: s.id,
      name: s.name,
      source: s.source,
      explainerFocus: s.explainerFocus,
      strands: s.strands.map((st) => ({
        id: st.id,
        name: st.name,
        competencies: st.competencies.map((id) => {
          const c = s.competencies.find((x) => x.id === id);
          return {
            id: c.id,
            name: c.name,
            iCan: c.iCan,
            gradeBand: c.gradeBand,
            requires: c.requires,
            practisedBy: c.practisedBy.map((p) => ({ app: p.app.id, url: p.app.url, pages: p.pages.map((pg) => pg.url) })),
          };
        }),
      })),
      curricula: s.curricula.map((c) => ({
        id: c.id,
        land: c.land,
        schoolType: c.schoolType,
        version: c.version,
        source: c.source,
        placements: Object.values(c.placements),
      })),
      ...(s.vocabulary
        ? {
            vocabulary: {
              language: s.vocabulary.language,
              source: s.vocabulary.source,
              levels: s.vocabulary.levels,
              words: s.vocabulary.words,
            },
          }
        : {}),
    },
  }));

  // What the page of an app shows of the map: its strand (none for a unit app), the strands it practises and the
  // competencies.
  const byApp = {};
  for (const s of views) {
    for (const app of apps.filter((a) => a.subjectId === s.id && (a.strand || a.pages?.some((p) => p.competencies?.length) || a.competencies))) {
      const mine = s.competencies.filter((c) => c.practisedBy.some((p) => p.app.id === app.id));
      byApp[app.id] = {
        subject: s.id,
        strand: app.strand?.split("/")[1],
        strands: s.strands.filter((st) => mine.some((c) => c.strand === st.id)).map((st) => st.id),
        competencies: mine.map((c) => c.id),
      };
    }
  }

  return { subjects: views, subjectPages, strandPages, competencyPages, stepsPages, vocabularyPages, json, termsPages: languages, byApp };
}

/** The chain of a competency for its page and the grid by steps. */
function chain(subject, c) {
  const step = subject.steps.get(c.id);
  const before = ancestors(subject, c.id);
  const after = descendants(subject, c.id);
  const direct = subject.requiredBy.get(c.id);
  const further = [...after].filter((id) => !direct.includes(id));
  const order = [...subject.competencies.keys()];
  const inOrder = (set) => order.filter((id) => set.has(id));
  return {
    step,
    ancestorsByStep: byStep(subject, inOrder(before)),
    ancestorCount: before.size,
    childrenByStep: byStep(subject, inOrder(new Set(direct))),
    furtherCount: further.length,
    furtherSteps: new Set(further.map((id) => subject.steps.get(id))).size,
  };
}
