// Direct start ("Loslegen") from catalog cards and app pages (schemas/entry.js `start`, src/_data/catalog.js `startUrl`,
// src/_includes/components.njk `appCard`).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { load } from "js-yaml";
import nunjucks from "nunjucks";
import { Entry } from "../schemas/entry.js";
import de from "../src/_data/de.js";
import en from "../src/_data/en.js";

const entry = load(readFileSync(new URL("../entries/typonaut.yaml", import.meta.url), "utf8"));

function renderCard(app, lang = "de") {
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(new URL("../src/_includes", import.meta.url).pathname));
  env.addFilter("tx", (text, l = "de") => (typeof text === "string" ? text : (text[l] ?? text.de ?? text.en)));
  env.addFilter("txAll", (list, l = "de") => list.map((text) => (typeof text === "string" ? text : (text[l] ?? text.de))));
  env.addFilter("fallbackLang", () => "");
  env.addFilter("gradeLabel", (grades) => `Klasse ${grades.join("-")}`);
  env.addFilter("inLang", (path, l = "de") => (l === "de" ? path : `/${l}${path}`));
  env.addFilter("url", (path) => `/apps${path}`);
  return env.renderString('{% import "components.njk" as c with context %}{{ c.appCard(app) }}', {
    t: lang === "en" ? en : de,
    lang,
    app,
    map: { byApp: {} },
  });
}

test("start field accepts a relative path string or a { de, en } map, and rejects empty string", () => {
  assert.equal(Entry.safeParse({ ...entry, start: "app/" }).success, true);
  assert.equal(Entry.safeParse({ ...entry, start: { de: "app/", en: "en/app/" } }).success, true);
  assert.equal(Entry.safeParse({ ...entry, start: "" }).success, false);
});

test("appCard renders one primary Loslegen/Start button pointing to startUrl and a secondary details link", () => {
  const app = {
    ...entry,
    id: "typonaut",
    subject: "Informatik",
    keywords: [],
    topics: [],
    startUrl: { de: "https://mrsimpson.github.io/typonaut/app/", en: "https://mrsimpson.github.io/typonaut/en/app/" },
  };
  const htmlDe = renderCard(app, "de");
  assert.match(htmlDe, /href="https:\/\/mrsimpson\.github\.io\/typonaut\/app\/"[^>]*data-start[^>]*>Loslegen/);
  assert.match(htmlDe, /href="\/apps\/typonaut\/"[^>]*>Details, Eignung &amp; QR-Code<\/a>/);

  const htmlEn = renderCard(app, "en");
  assert.match(htmlEn, /href="https:\/\/mrsimpson\.github\.io\/typonaut\/en\/app\/"[^>]*data-start[^>]*>Start/);
  assert.match(htmlEn, /href="\/apps\/en\/typonaut\/"[^>]*>Details, fitness &amp; QR code<\/a>/);
});

test("catalog resolves startUrl to the first non-recap page for format-2 explainers and to start for interactive apps", async () => {
  const dir = mkdtempSync(join(tmpdir(), "lernapps-start-pages-"));
  const prevPages = process.env.LERNAPPS_PAGES;
  const prevCopies = process.env.LERNAPPS_COPIES;
  try {
    writeFileSync(
      join(dir, "mathe-brueche-dezimal.json"),
      JSON.stringify({
        format: 1,
        strand: "mathematik/arithmetik",
        pages: [
          { path: "anteile/recap/", title: "Vorwissen", recap: "mathematik/grundrechenarten" },
          { path: "anteile/darstellen/", title: "Was bedeutet ein Bruch?", competencies: ["brueche-begriff"] },
        ],
      }),
    );
    process.env.LERNAPPS_PAGES = dir;
    process.env.LERNAPPS_COPIES = join(dir, "none.txt");
    const mod = await import(`../src/_data/catalog.js?startTest=${Date.now()}`);
    const catalog = await mod.default();

    const brueche = catalog.apps.find((a) => a.id === "mathe-brueche-dezimal");
    assert.ok(brueche, "mathe-brueche-dezimal exists in catalog");
    assert.equal(brueche.startUrl, "https://lernapps.net/mathe-brueche-dezimal/anteile/darstellen/");

    const typonaut = catalog.apps.find((a) => a.id === "typonaut");
    assert.ok(typonaut, "typonaut exists in catalog");
    assert.deepEqual(typonaut.startUrl, {
      de: "https://mrsimpson.github.io/typonaut/app/",
      en: "https://mrsimpson.github.io/typonaut/en/app/",
    });
  } finally {
    if (prevPages === undefined) delete process.env.LERNAPPS_PAGES;
    else process.env.LERNAPPS_PAGES = prevPages;
    if (prevCopies === undefined) delete process.env.LERNAPPS_COPIES;
    else process.env.LERNAPPS_COPIES = prevCopies;
    rmSync(dir, { recursive: true, force: true });
  }
});
