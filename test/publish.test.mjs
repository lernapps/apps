// The copies lernapps.net serves (publish.yml): which updates merge without a review (scripts/update-kind.mjs, KD-10),
// how the copies go into the root site's gh-pages (scripts/publish-copies.mjs), and that the catalog links a copy only
// when it is live (src/_data/catalog.js). Fast: git and files only, no browser, no network.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { lockChanges, packageChanges, updateKind } from "../scripts/update-kind.mjs";

const COMMIT = "a".repeat(40);
const OTHER = "b".repeat(40);
const temp = (name) => mkdtempSync(join(tmpdir(), `${name}-`));

test("a package.json whose existing dependencies only changed versions needs no review", () => {
  const before = { name: "a", scripts: { build: "vite build" }, dependencies: { vite: "^5.0.0" }, devDependencies: { x: "1" } };
  assert.deepEqual(packageChanges("package.json", before, { ...before, dependencies: { vite: "^5.1.0" } }), []);
});

test("an added dependency, a changed script or any other field needs a review", () => {
  const before = { name: "a", scripts: { build: "vite build" }, dependencies: { vite: "^5.0.0" } };
  assert.deepEqual(packageChanges("package.json", before, { ...before, dependencies: { vite: "^5.0.0", left: "1" } }), [
    "package.json: dependencies: a dependency was added or removed",
  ]);
  assert.deepEqual(packageChanges("package.json", before, { ...before, scripts: { build: "vite build && curl x" } }), [
    'package.json: "scripts" changed',
  ]);
  assert.deepEqual(packageChanges("package.json", before, { ...before, license: "MIT" }), ['package.json: "license" changed']);
});

test("a lock file may change only packages that come from the npm registry", () => {
  const entry = (version, resolved = `https://registry.npmjs.org/vite/-/vite-${version}.tgz`) => ({ version, resolved, integrity: "sha512-x" });
  const lock = (vite, extra = {}) => ({ lockfileVersion: 3, packages: { "": { dependencies: { vite: "^5" } }, "node_modules/vite": vite, ...extra } });
  assert.deepEqual(lockChanges("package-lock.json", lock(entry("5.0.0")), lock(entry("5.1.0"), { "node_modules/new": entry("1.0.0") })), []);
  assert.deepEqual(lockChanges("package-lock.json", lock(entry("5.0.0")), lock(entry("5.1.0", "https://example.org/vite.tgz"))), [
    "package-lock.json: node_modules/vite does not come from https://registry.npmjs.org/",
  ]);
  assert.deepEqual(lockChanges("package-lock.json", lock(entry("5.0.0")), { ...lock(entry("5.0.0")), lockfileVersion: 2 }), [
    'package-lock.json: "lockfileVersion" changed',
  ]);
});

test("between two commits of an app: only dependency versions → dependencies; a licence change → review", () => {
  const dir = temp("app");
  const git = (...args) => spawnSync("git", ["-C", dir, "-c", "user.email=t@example.org", "-c", "user.name=t", ...args], { encoding: "utf8" });
  const head = () => git("rev-parse", "HEAD").stdout.trim();
  git("init", "--quiet");
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "a", dependencies: { vite: "^5.0.0" } }));
  writeFileSync(join(dir, "LICENSE"), "MIT License\nCopyright (c) 2026 Claude\n");
  git("add", "-A");
  git("commit", "--quiet", "-m", "a");
  const first = head();
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "a", dependencies: { vite: "^5.1.0" } }));
  git("commit", "--quiet", "-am", "b");
  const bumped = head();
  writeFileSync(join(dir, "LICENSE"), "MIT License\nCopyright (c) 2026 Jane Doe\n");
  git("commit", "--quiet", "-am", "c");
  assert.deepEqual(updateKind(dir, first, bumped), { kind: "dependencies", reasons: [] });
  assert.deepEqual(updateKind(dir, bumped, head()), { kind: "review", reasons: ["LICENSE: changed"] });
});

test("the copies go into their directories of gh-pages, and copies.txt lists them at their commits", () => {
  const site = temp("site");
  const copies = temp("copies");
  mkdirSync(join(site, "alt"), { recursive: true });
  writeFileSync(join(site, "alt", "old.html"), "old");
  mkdirSync(join(site, "weg"), { recursive: true });
  writeFileSync(join(site, "copies.txt"), `alt ${OTHER}\nweg ${OTHER}\n`);
  mkdirSync(join(copies, "alt"), { recursive: true });
  writeFileSync(join(copies, "alt", "index.html"), "new");
  const plan = {
    build: [
      { id: "alt", source: "https://github.com/x/alt", commit: COMMIT },
      { id: "kaputt", source: "https://github.com/x/kaputt", commit: COMMIT },
    ],
    remove: ["weg"],
  };
  const run = spawnSync("node", ["scripts/publish-copies.mjs", site, copies, JSON.stringify(plan)], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(readFileSync(join(site, "alt", "index.html"), "utf8"), "new");
  assert.equal(existsSync(join(site, "alt", "old.html")), false);
  assert.equal(existsSync(join(site, "weg")), false);
  assert.equal(existsSync(join(site, "kaputt")), false);
  assert.equal(readFileSync(join(site, "copies.txt"), "utf8"), `alt ${COMMIT}\n`);
  assert.match(run.stdout, /kept kaputt: no copy of https:\/\/github\.com\/x\/kaputt/);
});

test("the catalog links an app's copy only when copies.txt lists it at the entry's commit", async () => {
  const list = join(temp("copies"), "copies.txt");
  const entry = (id) => readFileSync(join("entries", `${id}.yaml`), "utf8").match(/^commit: (\S+)$/m)[1];
  writeFileSync(list, `kniffel-trainer ${entry("kniffel-trainer")}\ntyponaut ${OTHER}\n`);
  process.env.LERNAPPS_COPIES = list;
  const { default: catalog } = await import(`../src/_data/catalog.js?copies=${Date.now()}`);
  const { apps } = await catalog();
  const byId = Object.fromEntries(apps.map((app) => [app.id, app]));
  assert.equal(byId["kniffel-trainer"].url, "https://lernapps.net/kniffel-trainer/");
  assert.equal(byId["kniffel-trainer"].home, "https://mrsimpson.github.io/kniffel-trainer/");
  assert.equal(byId.typonaut.url, "https://mrsimpson.github.io/typonaut/");
  delete process.env.LERNAPPS_COPIES;
});

test("an id that is a path of the home page or another repo of the organisation is reserved", async () => {
  const { reserved } = await import("../schemas/reserved.js");
  assert.match(reserved("privacy", "https://github.com/x/privacy"), /path of the home page/);
  assert.match(reserved("tooling", "https://github.com/x/tooling"), /repo lernapps\/tooling/);
  assert.equal(reserved("elektrizitaet", "https://github.com/lernapps/elektrizitaet"), undefined);
  assert.equal(reserved("bruch-trainer", "https://github.com/x/bruch-trainer"), undefined);
});
