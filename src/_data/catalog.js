// Reads and checks the app entries in entries/*.yaml against schemas/entry.js. A broken entry fails the
// build, so nothing unchecked gets published (platform design D5 ch-listing: "automatic check and
// publication"). The format is explained in src/llms.njk, served to people and agents as /apps/llms.txt.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import QRCode from "qrcode";
import { Entry } from "../../schemas/entry.js";
import languages from "./languages.js";

const DIR = "entries";
function check(id, raw) {
  const errors = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) errors.push("file name must be kebab-case: <id>.yaml");
  if (id === "en") errors.push("the id \"en\" is taken by the English pages");
  const result = Entry.safeParse(raw);
  if (!result.success) {
    for (const issue of result.error.issues) errors.push(`${issue.path.join(".") || "(entry)"}: ${issue.message}`);
  }
  if (errors.length) throw new Error(`entries/${id}.yaml:\n  - ${errors.join("\n  - ")}`);
  return result.data;
}

export default async function () {
  const apps = [];
  for (const file of readdirSync(DIR).filter((f) => f.endsWith(".yaml")).sort()) {
    const id = file.replace(/\.yaml$/, "");
    const entry = check(id, load(readFileSync(join(DIR, file), "utf8")));
    const base = entry.url.endsWith("/") ? entry.url : entry.url + "/";
    apps.push({
      ...entry,
      id,
      keywords: entry.keywords ?? [],
      topics: (entry.topics ?? []).map((t) => ({ ...t, url: new URL(t.path, base).href })),
      qr: await QRCode.toString(entry.url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#0f172a", light: "#ffffff" } }),
    });
  }

  // Order and filter keys are German; the pages show the text of their language (filter "tx" in eleventy.config.js).
  const de = (text) => (typeof text === "string" ? text : text.de);
  apps.sort((a, b) => de(a.subject).localeCompare(de(b.subject), "de") || de(a.title).localeCompare(de(b.title), "de"));
  const subjects = [...new Set(apps.map((a) => a.subject))]
    .filter((s, i, all) => all.findIndex((o) => de(o) === de(s)) === i)
    .sort((a, b) => de(a).localeCompare(de(b), "de"));
  const grades = [...new Set(apps.flatMap((a) => a.grades))].sort((a, b) => a - b);
  // One page per app and language, for the pagination of src/app.njk.
  const pages = apps.flatMap((app) => languages.map((l) => ({ app, l })));
  return { apps, subjects, grades, pages };
}
