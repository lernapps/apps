// Series of apps (entries/<id>.yaml: series { title, part, of? }): the check across entries and the order of the
// catalog. Pure functions, so the build (src/_data/catalog.js) and the tests share them.

const de = (text) => (typeof text === "string" ? text : text.de);

/**
 * Findings across the entries of one series (same German title): `of` must be the same where given. A part number may
 * be shared: apps that can be learnt in parallel have the same part. apps: [{ id, series? }]; returns messages.
 */
export function checkSeries(apps) {
  const errors = [];
  const bySeries = new Map();
  for (const app of apps.filter((a) => a.series)) {
    const key = de(app.series.title);
    if (!bySeries.has(key)) bySeries.set(key, []);
    bySeries.get(key).push(app);
  }
  for (const [title, members] of bySeries) {
    const totals = [...new Set(members.map((a) => a.series.of).filter((n) => n !== undefined))];
    if (totals.length > 1) {
      const said = members.map((a) => `${a.id}: ${a.series.of ?? "none"}`).join(", ");
      errors.push(`series ${title}: of must be the same in every entry (${said})`);
    }
  }
  return errors;
}

/**
 * The order of the catalog within a subject: by the title of the series (or of the app, without a series), then by part,
 * then by the app's title. The apps of a series stand together where the series' title belongs alphabetically.
 */
export function compareApps(a, b) {
  const group = (app) => de(app.series ? app.series.title : app.title);
  return (
    group(a).localeCompare(group(b), "de") ||
    (a.series?.part ?? 0) - (b.series?.part ?? 0) ||
    de(a.title).localeCompare(de(b.title), "de")
  );
}
