// The learning map for the pages: the subjects of map/ (checked by lib/map.js; a broken file fails the build), which
// apps of the catalog practise which competency, and one entry per page the map has (src/map-*.njk paginate over them).
import { loadMap, checkApp, coverage, rows, placedCount } from "../../lib/map.js";
import { LANDS } from "../../schemas/map.js";
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
    for (const e of checkApp(subjects, { strand: app.strand, competencies }).errors) errors.push(`${app.id}: ${e}`);
  }
  if (errors.length) throw new Error(`apps and the learning map:\n  - ${errors.join("\n  - ")}`);

  const views = subjects.map((subject) => {
    const covered = coverage(subject, apps);
    const appsOf = apps.filter((a) => a.strand?.startsWith(`${subject.id}/`));
    const competencies = [...subject.competencies.values()].map((c) => ({
      ...c,
      requiredBy: subject.requiredBy.get(c.id),
      practisedBy: covered.get(c.id),
      placements: subject.curricula
        .filter((cu) => cu.placements.has(c.id))
        .map((cu) => ({ curriculum: cu.id, ...cu.placements.get(c.id) })),
    }));
    const byId = new Map(competencies.map((c) => [c.id, c]));
    const strands = subject.strands.map((s) => {
      const list = s.competencies.map((id) => byId.get(id));
      return {
        ...s,
        total: list.length,
        covered: list.filter((c) => c.practisedBy.length).length,
        apps: appsOf.filter((a) => a.strand === `${subject.id}/${s.id}`),
      };
    });
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
      strands,
      competencies,
      curricula,
      rows: rows(subject),
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

  // The data an assistant reads at /apps/map/<subject>.json (contract, section 5).
  const json = views.map((s) => ({
    subject: s.id,
    data: {
      id: s.id,
      name: s.name,
      source: s.source,
      strands: s.strands.map((st) => ({
        id: st.id,
        name: st.name,
        competencies: st.competencies.map((id) => {
          const c = s.competencies.find((x) => x.id === id);
          return {
            id: c.id,
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
    },
  }));

  return { subjects: views, subjectPages, strandPages, competencyPages, json, termsPages: languages };
}
