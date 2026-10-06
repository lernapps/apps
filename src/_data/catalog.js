// Reads and checks the app entries in entries/*.yaml. A broken entry fails the build, so nothing
// unchecked gets published (platform design D5 ch-listing: "automatic check and publication").
// The format is described in src/llms.njk, served to people and agents as /apps/llms.txt.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import QRCode from "qrcode";

const DIR = "entries";
const ENUMS = {
  storage: ["none", "device", "server"],
  thirdParty: ["none", "on-click", "yes"],
};

function check(id, e) {
  const errors = [];
  const need = (cond, msg) => cond || errors.push(msg);
  need(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id), "file name must be kebab-case: <id>.yaml");
  for (const key of ["title", "subject", "summary", "url"]) need(typeof e[key] === "string" && e[key].trim(), `${key} is required`);
  need(Array.isArray(e.grades) && e.grades.length && e.grades.every((g) => Number.isInteger(g) && g >= 1 && g <= 13), "grades: list of numbers 1–13");
  need(/^https:\/\//.test(e.url ?? ""), "url must start with https://");
  need(e.creator?.name, "creator.name is required");
  for (const t of e.topics ?? []) need(t.title && t.path, "every topic needs title and path");
  const f = e.fitness ?? {};
  need(f.account === false, "fitness.account must be false: apps on lernapps.net need no account");
  need(f.install === false, "fitness.install must be false: apps on lernapps.net run in the browser");
  for (const [key, values] of Object.entries(ENUMS)) need(values.includes(f[key]), `fitness.${key}: one of ${values.join(", ")}`);
  need(f.thirdParty === "none" || f.thirdPartyNote, "fitness.thirdPartyNote: say which servers, and when");
  need(f.storage !== "server", "fitness.storage: apps that store data on a server are not listed (yet)");
  need(f.thirdParty !== "yes", "fitness.thirdParty: requests to third parties without a click are not listed");
  if (errors.length) throw new Error(`entries/${id}.yaml:\n  - ${errors.join("\n  - ")}`);
}

export default async function () {
  const apps = [];
  for (const file of readdirSync(DIR).filter((f) => f.endsWith(".yaml")).sort()) {
    const id = file.replace(/\.yaml$/, "");
    const entry = load(readFileSync(join(DIR, file), "utf8"));
    check(id, entry);
    const base = entry.url.endsWith("/") ? entry.url : entry.url + "/";
    apps.push({
      ...entry,
      id,
      keywords: entry.keywords ?? [],
      topics: (entry.topics ?? []).map((t) => ({ ...t, url: new URL(t.path, base).href })),
      qr: await QRCode.toString(entry.url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#0f172a", light: "#ffffff" } }),
    });
  }
  // Open totals per app, fetched by a workflow once the counter exists; absent until then.
  const totals = existsSync("data/totals.json") ? JSON.parse(readFileSync("data/totals.json", "utf8")) : {};
  for (const app of apps) app.totals = totals[app.id] ?? null;

  apps.sort((a, b) => a.subject.localeCompare(b.subject, "de") || a.title.localeCompare(b.title, "de"));
  const subjects = [...new Set(apps.map((a) => a.subject))].sort((a, b) => a.localeCompare(b, "de"));
  const grades = [...new Set(apps.flatMap((a) => a.grades))].sort((a, b) => a - b);
  return { apps, subjects, grades };
}
