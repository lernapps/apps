// Reads and checks the app entries in entries/*.yaml against schemas/entry.js. A broken entry fails the
// build, so nothing unchecked gets published (platform design D5 ch-listing: "automatic check and
// publication"). The format is explained in src/llms.njk, served to people and agents as /apps/llms.txt.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import QRCode from "qrcode";
import { Entry } from "../../schemas/entry.js";

const DIR = "entries";
function check(id, raw) {
  const errors = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) errors.push("file name must be kebab-case: <id>.yaml");
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

  apps.sort((a, b) => a.subject.localeCompare(b.subject, "de") || a.title.localeCompare(b.title, "de"));
  const subjects = [...new Set(apps.map((a) => a.subject))].sort((a, b) => a.localeCompare(b, "de"));
  const grades = [...new Set(apps.flatMap((a) => a.grades))].sort((a, b) => a - b);
  return { apps, subjects, grades };
}
