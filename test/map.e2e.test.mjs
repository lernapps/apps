// The pages of the learning map (src/map*.njk, assets/map.js), built from this repo into a temporary folder with an
// explainer's page list from test/fixtures/map/pages/ (elektrizitaet practises three competencies of Physik):
//   - the pages exist in both languages, the JSON per subject, and the links from the start page, the app page and
//     llms.txt; the start of the maps shows the maps first, the model last, and asks for feedback as a GitHub issue;
//   - without JavaScript everything is a link: the curricula, the competencies, the terms; the legend is text and the
//     list of terms is open;
//   - with JavaScript, by keyboard: the drop-down goes to the chosen curriculum, a competency opens as a dialog that
//     closes with Escape, its button or the backdrop and gives the focus back, the legend's buttons show only what is
//     practised or only the gaps, the help beside the headline opens as a dialog (without JS: at the end of the
//     page), a box of the terms' picture opens its definition as a dialog, and the list of terms is closed unless the
//     address points into it.
// Offline; needs Chromium (test/browser.mjs).
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { launch, serve } from "./browser.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temp = mkdtempSync(join(tmpdir(), "lernapps-map-"));
const out = join(temp, "site");
const read = (path) => readFileSync(join(out, path), "utf8");

before(() => {
  const result = spawnSync("npx", ["eleventy", "--quiet", `--output=${out}`], {
    cwd: repo,
    encoding: "utf8",
    env: { ...process.env, LERNAPPS_PAGES: join(repo, "test/fixtures/map/pages"), LERNAPPS_COPIES: "/dev/null" },
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
after(() => rmSync(temp, { recursive: true, force: true }));

describe("the built pages", () => {
  test("every view exists in German and English, and the map of each subject as JSON", () => {
    for (const root of ["", "en/"]) {
      for (const path of [
        "map/index.html",
        "map/mathematik/index.html",
        "map/mathematik/he-gymnasium/index.html",
        "map/mathematik/stochastik/index.html",
        "map/mathematik/c/zufall-laplace/index.html",
        "map/mathematik/c/index.html",
        "map/physik/elektrizitaetslehre/index.html",
      ]) {
        assert.ok(existsSync(join(out, root, path)), `${root}${path}`);
      }
    }
    const physik = JSON.parse(read("map/physik.json"));
    const stromkreis = physik.strands.find((s) => s.id === "elektrizitaetslehre").competencies.find((c) => c.id === "einfacher-stromkreis");
    assert.equal(stromkreis.practisedBy[0].app, "elektrizitaet");
    assert.deepEqual(JSON.parse(read("map/mathematik.json")).curricula.map((c) => c.id), ["he-gymnasium"]);
  });

  test("a practised competency is filled and says so; a gap is dashed and says so", () => {
    const html = read("map/physik/index.html");
    assert.match(html, /href="\/apps\/map\/physik\/c\/einfacher-stromkreis\/" class="map-chip map-chip-covered"/);
    assert.match(html, /href="\/apps\/map\/physik\/c\/elektrische-ladung\/" class="map-chip map-chip-gap"/);
    assert.match(html, /\(eine App übt ihn\)/);
    assert.match(html, /\(Lücke, noch keine App\)/);
  });

  test("a draft map says so loudly on every page of its subject, on its card and in its JSON", () => {
    for (const path of ["map/physik/index.html", "map/physik/c/index.html", "map/physik/elektrizitaetslehre/index.html", "map/physik/c/einfacher-stromkreis/index.html", "map/mathematik/he-gymnasium/index.html"]) {
      assert.match(read(path), /class="map-status map-status-draft"[^]*?Diese Karte ist nur eine Idee, um das Prinzip zu zeigen/, path);
    }
    assert.match(read("en/map/physik/index.html"), /This map is only an idea to show the principle/);
    assert.match(read("map/index.html"), /map-status-tag-draft[^>]*>Entwurf</);
    assert.equal(JSON.parse(read("map/physik.json")).status, "draft");
  });

  test("the map by steps: one row per step, the competencies as links, the order linked from the subject", () => {
    const html = read("map/mathematik/c/index.html");
    const rows = [...html.matchAll(/<th scope="row">Stufe (\d+)/g)].map((m) => Number(m[1]));
    assert.deepEqual(rows, Array.from({ length: rows.length }, (_, i) => i + 1));
    assert.ok(rows.length > 1);
    assert.match(html, /href="\/apps\/map\/mathematik\/c\/zufall-laplace\/" class="map-chip/);
    assert.match(html, /<script type="application\/json" id="map-steps-data">/);
    assert.match(read("map/mathematik/index.html"), /href="\/apps\/map\/mathematik\/c\/"[^>]*>Nach Stufen der Kette/);
    assert.match(read("en/map/mathematik/c/index.html"), /<th scope="row">Step 1/);
  });

  test("the page of a competency shows its chain: every ancestor by step, the direct descendants and how many follow", () => {
    const page = read("map/mathematik/c/zufall-laplace/index.html");
    assert.match(page, /Dieser Baustein · Stufe 7/);
    assert.match(page, /href="\/apps\/map\/mathematik\/c\/wahrscheinlichkeitsbegriff\/"[^]*?<span class="map-direct">direkt<\/span>/);
    assert.match(page, /href="\/apps\/map\/mathematik\/c\/vierfeldertafel\/"/);
    assert.match(page, /Danach bauen noch \d+ Bausteine in \d+ weiteren Stufen? darauf auf\./);
    assert.match(page, /href="\/apps\/map\/mathematik\/c\/#zufall-laplace"/);
  });

  test("the strand shows its app as a bar; the competency names the app and its page", () => {
    assert.match(read("map/physik/elektrizitaetslehre/index.html"), /class="map-appbar"[^>]*>\s*<strong>Elektrizität/);
    const page = read("map/physik/c/einfacher-stromkreis/index.html");
    assert.match(page, /href="\/apps\/elektrizitaet\/"/);
    assert.match(page, /Der einfache Stromkreis/);
    assert.match(read("map/mathematik/c/zufall-laplace/index.html"), /Noch übt keine App diesen Baustein/);
  });

  test("the start of the maps shows the maps first and the model last, and asks for feedback as an issue", () => {
    const html = read("map/index.html");
    const at = (text) => {
      const i = html.indexOf(text);
      assert.ok(i >= 0, text);
      return i;
    };
    const order = ['id="karten"', 'id="apps"', 'id="methode"', 'id="bild"', 'id="begriffe"'].map(at);
    assert.deepEqual(order, [...order].sort((a, b) => a - b));
    assert.match(html, /<h1[^>]*>Lernlandkarten<\/h1>/);
    assert.match(html, /href="\/apps\/map\/physik\/" class="map-card"/);
    assert.match(html, /3 davon übt schon eine App/);
    assert.match(html, /href="https:\/\/github\.com\/lernapps\/apps\/issues\/new\?title=Lernlandkarte/);
    assert.match(read("en/map/index.html"), /<h1[^>]*>Learning maps<\/h1>/);
  });

  test("the start page, the app page and llms.txt link the map", () => {
    assert.match(read("index.html"), /href="\/apps\/map\/"/);
    assert.match(read("en/index.html"), /href="\/apps\/en\/map\/"/);
    const app = read("elektrizitaet/index.html");
    assert.match(app, /href="\/apps\/map\/physik\/elektrizitaetslehre\/"/);
    assert.match(app, /href="\/apps\/map\/physik\/c\/stromstaerke-messen\/"/);
    assert.match(read("llms.txt"), /\/apps\/map\/mathematik\.json/);
  });
});

describe("in the browser", () => {
  let site;
  let browser;
  before(async () => {
    site = await serve(out);
    browser = await launch();
  });
  after(async () => {
    await browser?.close();
    await site?.close();
  });
  const open = async (path, options = {}) => {
    const context = await browser.newContext({ locale: "de-DE", ...options });
    const page = await context.newPage();
    await page.goto(site.url + path);
    return page;
  };

  test("without JavaScript the curricula and the competencies are links", async () => {
    const page = await open("map/mathematik/", { javaScriptEnabled: false });
    assert.equal(await page.locator("#lehrplan").isVisible(), false);
    await page.getByRole("link", { name: "Lehrplan Hessen, Gymnasium (G9)" }).click();
    assert.match(page.url(), /\/apps\/map\/mathematik\/he-gymnasium\/$/);
    await page.locator('a[href$="/c/zufall-laplace/"]').first().click();
    assert.match(page.url(), /\/apps\/map\/mathematik\/c\/zufall-laplace\/$/);
    await page.context().close();
  });

  test("the drop-down goes to the chosen curriculum, by keyboard", async () => {
    const page = await open("map/mathematik/");
    const select = page.locator("#lehrplan");
    assert.equal(await select.isVisible(), true);
    assert.equal(await page.locator("[data-map-when-links]").isVisible(), false);
    await select.focus();
    await Promise.all([page.waitForURL(/\/map\/mathematik\/he-gymnasium\/$/), page.keyboard.press("ArrowDown")]);
    assert.match(await page.locator("#modus").textContent(), /Du siehst den Lehrplan Hessen, Gymnasium \(G9\)/);
    assert.equal(await page.locator("#lehrplan").inputValue(), "/apps/map/mathematik/he-gymnasium/");
    await page.context().close();
  });

  test("a competency opens as a dialog; Escape, its button and the backdrop close it, and the focus goes back", async () => {
    const page = await open("map/mathematik/he-gymnasium/");
    const chip = page.locator('a[data-opens="detail-zufall-laplace"]');
    const dialog = page.locator("dialog[data-map-dialog]");

    await chip.focus();
    await page.keyboard.press("Enter");
    assert.equal(await dialog.isVisible(), true);
    assert.match(page.url(), /he-gymnasium\/$/);
    assert.match(await dialog.getByRole("heading").textContent(), /Laplace-Formel/);
    assert.match(await dialog.textContent(), /Lehrplan Hessen, Gymnasium \(G9\)/);
    assert.match(await dialog.textContent(), /noch keine App – Lücke/);
    await page.keyboard.press("Escape");
    assert.equal(await dialog.isVisible(), false);
    assert.equal(await chip.evaluate((el) => el === document.activeElement), true);

    await page.keyboard.press("Enter");
    await dialog.getByRole("button", { name: "Schließen" }).click();
    assert.equal(await dialog.isVisible(), false);

    await page.keyboard.press("Enter");
    await page.mouse.click(4, 4);
    assert.equal(await dialog.isVisible(), false);
    assert.equal(await chip.evaluate((el) => el === document.activeElement), true);

    await page.keyboard.press("Enter");
    await dialog.getByRole("link", { name: "Alle Angaben zum Baustein" }).click();
    assert.match(page.url(), /\/map\/mathematik\/c\/zufall-laplace\/$/);
    await page.context().close();
  });

  test("the map by steps: a click shows the chain with arrows and lists it; Escape ends it", async () => {
    const page = await open("map/mathematik/c/");
    const chain = page.locator("[data-map-chain]");
    assert.equal(await chain.isVisible(), true);
    await page.locator('li[data-competency="zufall-laplace"] > a').click();
    assert.match(page.url(), /\/map\/mathematik\/c\/#zufall-laplace$/);
    assert.ok((await page.locator("svg.map-arrows > path").count()) > 0);
    assert.equal(await page.locator('li[data-competency="wahrscheinlichkeitsbegriff"]').getAttribute("data-before"), "");
    assert.equal(await page.locator('li[data-competency="vierfeldertafel"]').getAttribute("data-after"), "");
    assert.match(await chain.textContent(), /Stochastik · Stufe 7/);
    assert.match(await chain.textContent(), /Baut auf · \d+/);
    await chain.getByRole("button", { name: "wahrscheinlichkeitsbegriff" }).click();
    assert.match(page.url(), /#wahrscheinlichkeitsbegriff$/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("svg.map-arrows > path").count(), 0);
    assert.match(await chain.textContent(), /Wähle einen Baustein/);
    await page.context().close();
  });

  test("the map by steps without JavaScript: no chain beside it, a competency leads to its page", async () => {
    const page = await open("map/mathematik/c/", { javaScriptEnabled: false });
    assert.equal(await page.locator("[data-map-chain]").isVisible(), false);
    await page.locator('li[data-competency="zufall-laplace"] > a').click();
    assert.match(page.url(), /\/apps\/map\/mathematik\/c\/zufall-laplace\/$/);
    await page.context().close();
  });

  test("the legend's buttons show only what is practised or only the gaps; pressed again, all", async () => {
    const page = await open("map/physik/");
    const covered = page.locator('a[href$="/c/einfacher-stromkreis/"]');
    const gap = page.locator('a[href$="/c/elektrische-ladung/"]');
    const onlyGaps = page.getByRole("button", { name: /^Lücke \d+$/ });
    const onlyCovered = page.getByRole("button", { name: /^Abgedeckt \d+$/ });
    assert.equal(await page.getByRole("group", { name: "Bausteine zeigen" }).isVisible(), true);
    assert.match(await onlyCovered.textContent(), /3$/);
    await onlyGaps.click();
    assert.equal(await onlyGaps.getAttribute("aria-pressed"), "true");
    assert.equal(await covered.isVisible(), false);
    assert.equal(await gap.isVisible(), true);
    await onlyCovered.focus();
    await page.keyboard.press("Enter");
    assert.equal(await onlyGaps.getAttribute("aria-pressed"), "false");
    assert.equal(await covered.isVisible(), true);
    assert.equal(await gap.isVisible(), false);
    await page.keyboard.press("Enter");
    assert.equal(await onlyCovered.getAttribute("aria-pressed"), "false");
    assert.equal(await gap.isVisible(), true);
    await page.context().close();
  });

  test("without JavaScript the legend is text and the help is at the end; with it, the help is a dialog", async () => {
    let page = await open("map/physik/", { javaScriptEnabled: false });
    assert.equal(await page.locator("[data-map-legend]").isVisible(), true);
    assert.equal(await page.locator("[data-map-filter]").isVisible(), false);
    assert.equal(await page.locator("section#hilfe").isVisible(), true);
    await page.context().close();
    page = await open("map/physik/");
    assert.equal(await page.locator("section#hilfe").isVisible(), false);
    const link = page.getByRole("link", { name: "So liest du die Karte" });
    await link.focus();
    await page.keyboard.press("Enter");
    const dialog = page.locator("dialog[data-map-dialog]");
    assert.equal(await dialog.isVisible(), true);
    assert.equal((await dialog.getByRole("heading").textContent()).trim(), "So liest du die Karte");
    assert.match(await dialog.textContent(), /Du siehst die Richtstufe/);
    await page.keyboard.press("Escape");
    assert.equal(await link.evaluate((el) => el === document.activeElement), true);
    await page.context().close();
  });

  test("the list of terms is open without JavaScript, closed with it, and open when the address points into it", async () => {
    let page = await open("map/", { javaScriptEnabled: false });
    assert.equal(await page.locator("article#strang").isVisible(), true);
    await page.context().close();
    page = await open("map/");
    assert.equal(await page.locator("article#strang").isVisible(), false);
    await page.goto(site.url + "map/#strang");
    assert.equal(await page.locator("article#strang").isVisible(), true);
    await page.context().close();
    page = await open("map/#richtstufe");
    assert.equal(await page.locator("article#richtstufe").isVisible(), true);
    await page.context().close();
  });

  test("a box of the terms' picture opens its definition", async () => {
    const page = await open("map/");
    const node = page.locator('.map-model a[data-opens="strang"]');
    await node.focus();
    await page.keyboard.press("Enter");
    const dialog = page.locator("dialog[data-map-dialog]");
    assert.equal(await dialog.isVisible(), true);
    assert.equal((await dialog.getByRole("heading").textContent()).trim(), "Strang");
    assert.match(await dialog.textContent(), /Ein Teilgebiet des Fachs/);
    await page.keyboard.press("Escape");
    assert.equal(await node.evaluate((el) => el === document.activeElement), true);
    await page.context().close();
  });
});
