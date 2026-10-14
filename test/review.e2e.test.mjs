// The review on a listing pull request, started by a maintainer's `/review` (.github/workflows/review.yml), in the
// two parts this repo owns:
//   - the review input (scripts/review-input.mjs, the job without secrets): the app's repo at a commit, built, its
//     bundle checked with `lernapps check --entry`, and the files the review agent reads;
//   - the review comment (scripts/review-comment.mjs, the job that comments): the verdict of the agent, checked
//     against the schema, or why there is none.
// The agent itself runs in the workflow only; here a recorded verdict stands in for it.
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { dump, load } from "js-yaml";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixtures = join(repo, "test", "fixtures");
const UPDATE = process.env.UPDATE_GOLDEN === "1";
const MARKER = "<!-- lernapps-review -->";
const COMMIT = "256048440692edfd0337a8e47046c6a7425e0a00";
const RUN_URL = "https://github.com/lernapps/apps/actions/runs/1";

function run(command, args, cwd) {
  return new Promise((done, fail) => {
    const child = spawn(command, args, { cwd, env: process.env });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", fail);
    child.on("close", (code) => done({ code, stdout, stderr }));
  });
}

/** A fixture app on 127.0.0.1, as GitHub Pages serves it. */
async function serve(dir) {
  const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript" };
  const server = createServer((request, response) => {
    const path = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
    let file = join(dir, path);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!file.startsWith(dir) || !existsSync(file)) {
      response.writeHead(404, { "content-type": "text/plain" }).end("not found");
      return;
    }
    response.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    response.end(readFileSync(file));
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  return { server, url: `http://127.0.0.1:${server.address().port}/` };
}

const temp = mkdtempSync(join(tmpdir(), "lernapps-review-"));
after(() => rmSync(temp, { recursive: true, force: true }));

function golden(name, actual) {
  const file = join(fixtures, "comments", name);
  if (UPDATE) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, actual);
  }
  assert.equal(actual, readFileSync(file, "utf8"), `differs from ${file} (UPDATE_GOLDEN=1 npm test writes it)`);
}

/** The text outside fenced code blocks (CommonMark: a fence closes with the same character, at least as long). */
function outsideCodeBlocks(markdown) {
  const kept = [];
  let fence;
  for (const line of markdown.split("\n")) {
    const marker = line.trim().match(/^(`{3,}|~{3,})/)?.[1];
    if (fence === undefined && marker) fence = marker;
    else if (fence !== undefined && marker && marker[0] === fence[0] && marker.length >= fence.length && line.trim() === marker) fence = undefined;
    else if (fence === undefined) kept.push(line);
  }
  return kept.join("\n");
}

/** A git repo of an app in a folder of its own, from `files` (path → content), with one commit. */
function appRepo(name, files) {
  const dir = mkdtempSync(join(temp, `${name}-`));
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), content);
  }
  const git = (...args) => {
    const result = spawnSync("git", args, { cwd: dir, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  git("init", "-q", "-b", "main");
  git("add", "-A");
  git("-c", "user.name=Test", "-c", "user.email=test@example.org", "commit", "-q", "-m", "feat: the Bruch-Trainer, ready to list");
  return { dir, commit: git("rev-parse", "HEAD") };
}

const PLAN = "---\narchetype: explainer\nprePushFailures: 0\n---\n# Plan\n\n## Retrospective\n\nNothing to guess.\n";
const APP = join(fixtures, "apps", "bruch-trainer");
const appFiles = (prefix = "") => ({
  [`${prefix}index.html`]: readFileSync(join(APP, "index.html"), "utf8"),
  [`${prefix}kuerzen/index.html`]: readFileSync(join(APP, "kuerzen", "index.html"), "utf8"),
});
const LOCK = JSON.stringify({ name: "bruch-trainer", lockfileVersion: 3, requires: true, packages: { "": { name: "bruch-trainer" } } });

/** The entry of the listing pull request, pointing to the served app. */
function entry(url) {
  const dir = mkdtempSync(join(temp, "entry-"));
  mkdirSync(join(dir, "entries"));
  const text = readFileSync(join(fixtures, "entries", "fixed-topic.yaml"), "utf8").replace(`url: "{{url}}"`, `url: "${url}"`);
  writeFileSync(join(dir, "entries", "bruch-trainer.yaml"), text);
  return join(dir, "entries", "bruch-trainer.yaml");
}

const reviewInput = (args) => run("node", [join(repo, "scripts", "review-input.mjs"), ...args], repo);
const SLOW = { timeout: 300_000 };

describe("the review input", () => {
  let app;
  before(async () => {
    app = await serve(APP);
  });
  after(() => app.server.close());

  test("of an app without a build: the repo is its own bundle, checked, with the files the agent reads", SLOW, async () => {
    const source = appRepo("plain", { ...appFiles(), ".vibe/plan.md": PLAN, "README.md": "# Bruch-Trainer\n" });
    const out = join(temp, "plain-input");
    const result = await reviewInput(["--repo", source.dir, "--commit", source.commit, "--out", out, entry(app.url)]);
    assert.equal(result.code, 0, result.stdout + result.stderr);
    const meta = JSON.parse(readFileSync(join(out, "review.json"), "utf8"));
    assert.deepEqual(
      { state: meta.state, commit: meta.commit, bundle: meta.bundle, build: meta.build, entry: meta.entry },
      { state: "ready", commit: source.commit, bundle: ".", build: "none", entry: "entries/bruch-trainer.yaml" },
    );
    assert.ok(existsSync(join(out, "app", "index.html")), "the bundle");
    assert.ok(existsSync(join(out, "app", "kuerzen", "index.html")));
    assert.equal(readFileSync(join(out, "app", ".vibe", "plan.md"), "utf8"), PLAN, "the plan file");
    assert.ok(!existsSync(join(out, "app", ".git")), "no git directory");
    assert.match(readFileSync(join(out, "entries", "bruch-trainer.yaml"), "utf8"), /title: Bruch-Trainer/);
    assert.match(readFileSync(join(out, "history.txt"), "utf8"), new RegExp(`${source.commit}[\\s\\S]*feat: the Bruch-Trainer, ready to list`));
    const report = load(readFileSync(join(out, "report.yaml"), "utf8"));
    assert.deepEqual(report.checked, { bundle: "app" });
    assert.ok(report.rules.includes("entry-links-resolve"), "checked with the entry");
    assert.deepEqual(report.findings.filter((f) => f.severity === "error"), []);
  });

  test("of an app with a build: the directory the build writes is the bundle", SLOW, async () => {
    const build = "import { cpSync } from 'node:fs'; cpSync('src', 'dist', { recursive: true });\n";
    const source = appRepo("built", {
      ...appFiles("src/"),
      "build.mjs": build,
      "package.json": JSON.stringify({ name: "bruch-trainer", private: true, scripts: { build: "node build.mjs" } }),
      "package-lock.json": LOCK,
      ".vibe/plan.md": PLAN,
      ".agents/skills/app-content/SKILL.md": "# Content guide of this app\n",
    });
    const out = join(temp, "built-input");
    const result = await reviewInput(["--repo", source.dir, "--commit", source.commit, "--out", out, entry(app.url)]);
    assert.equal(result.code, 0, result.stdout + result.stderr);
    const meta = JSON.parse(readFileSync(join(out, "review.json"), "utf8"));
    assert.equal(meta.state, "ready");
    assert.equal(meta.build, "ok");
    assert.equal(meta.bundle, "dist");
    assert.ok(existsSync(join(out, "app", "dist", "kuerzen", "index.html")), "the bundle, below the app's repo");
    assert.ok(existsSync(join(out, "app", "package.json")));
    assert.ok(existsSync(join(out, "app", "package-lock.json")));
    assert.ok(existsSync(join(out, "app", ".agents", "skills", "app-content", "SKILL.md")), "the content guide");
    assert.ok(!existsSync(join(out, "app", "src")), "only the bundle, not the sources");
    assert.deepEqual(load(readFileSync(join(out, "report.yaml"), "utf8")).checked, { bundle: "app/dist" });
  });

  test("built in the container the workflow names: the same bundle", SLOW, async () => {
    // The image of the workflow's job `input`, pinned there by its digest.
    const image = readFileSync(join(repo, ".github", "workflows", "review.yml"), "utf8").match(/BUILD_IMAGE: (node:[\w.-]+@sha256:[0-9a-f]{64})/)?.[1];
    assert.ok(image, "review.yml pins the build image by digest");
    const build = "import { cpSync } from 'node:fs'; cpSync('src', 'dist', { recursive: true });\n";
    const source = appRepo("contained", {
      ...appFiles("src/"),
      "build.mjs": build,
      "package.json": JSON.stringify({ name: "bruch-trainer", private: true, scripts: { build: "node build.mjs" } }),
      "package-lock.json": LOCK,
    });
    const out = join(temp, "contained-input");
    const result = await reviewInput(["--repo", source.dir, "--commit", source.commit, "--out", out, "--container", image, entry(app.url)]);
    assert.equal(result.code, 0, result.stdout + result.stderr);
    const meta = JSON.parse(readFileSync(join(out, "review.json"), "utf8"));
    assert.deepEqual([meta.state, meta.build, meta.bundle], ["ready", "ok", "dist"]);
    assert.ok(existsSync(join(out, "app", "dist", "kuerzen", "index.html")));
  });

  test("of an app whose build fails says so, with the end of the build's output", SLOW, async () => {
    const source = appRepo("broken", {
      "package.json": JSON.stringify({ name: "bruch-trainer", private: true, scripts: { build: "node -e \"console.error('kaputt'); process.exit(3)\"" } }),
      "package-lock.json": LOCK,
    });
    const out = join(temp, "broken-input");
    const result = await reviewInput(["--repo", source.dir, "--commit", source.commit, "--out", out, entry(app.url)]);
    assert.equal(result.code, 0, result.stdout + result.stderr);
    const meta = JSON.parse(readFileSync(join(out, "review.json"), "utf8"));
    assert.equal(meta.state, "build-failed");
    assert.match(readFileSync(join(out, "build.log"), "utf8"), /kaputt/);
    assert.ok(!existsSync(join(out, "report.yaml")), "no check of a bundle that is not there");
  });

  test("of a commit the repo does not have says so", SLOW, async () => {
    const source = appRepo("nocommit", appFiles());
    const out = join(temp, "nocommit-input");
    const result = await reviewInput(["--repo", source.dir, "--commit", "0".repeat(40), "--out", out, entry(app.url)]);
    assert.equal(result.code, 1, result.stdout + result.stderr);
    assert.equal(JSON.parse(readFileSync(join(out, "review.json"), "utf8")).state, "clone-failed");
  });
});

/** A folder as the comment job sees it: the review input and what the review job wrote. */
function prepared(name, { meta, report, verdict, check, extra = {} } = {}) {
  const dir = mkdtempSync(join(temp, `${name}-`));
  const value = meta ?? { state: "ready", repo: "https://github.com/lernapps/bruch-trainer", commit: COMMIT, entry: "entries/bruch-trainer.yaml", bundle: "dist", build: "ok" };
  if (value !== null) writeFileSync(join(dir, "review.json"), JSON.stringify(value));
  const passing = { checked: { bundle: "app/dist" }, rules: ["accessible", "entry-links-resolve"], findings: [], suppressions: [] };
  if (report !== null) writeFileSync(join(dir, "report.yaml"), dump(report ?? passing));
  if (verdict !== undefined) writeFileSync(join(dir, "verdict.yaml"), typeof verdict === "string" ? verdict : dump(verdict, { lineWidth: -1 }));
  if (check !== undefined) {
    writeFileSync(join(dir, "verdict-check.txt"), check.text);
    writeFileSync(join(dir, "verdict-check.status"), `${check.status}\n`);
  }
  for (const [file, content] of Object.entries(extra)) writeFileSync(join(dir, file), content);
  return dir;
}

const recorded = () => load(readFileSync(join(fixtures, "verdicts", "explainer-ad.yaml"), "utf8"));
const OK = { status: 0, text: `verdict: ok, commit 2560484, fail, 3 findings (1 error)\n` };
const comment = (dir, ...args) => run("node", [join(repo, "scripts", "review-comment.mjs"), dir, "--run-url", RUN_URL, "--commit", COMMIT, ...args], repo);

describe("the review comment", () => {
  test("shows a valid verdict: its outcome, every finding as a task, and the whole verdict in YAML", async () => {
    const result = await comment(prepared("valid", { verdict: recorded(), check: OK }));
    assert.equal(result.code, 0, result.stderr);
    const text = result.stdout;
    assert.ok(text.startsWith(`${MARKER}\n`));
    assert.match(text, /^## Review: fail, 3 Befunde \(1 Fehler, 2 Hinweise\)$/m);
    assert.match(text, /entscheidet nichts und ändert nichts/);
    assert.match(text, new RegExp(`\`${COMMIT}\``));
    assert.equal(text.match(/^- \[ \] /gm)?.length, 3, "one task per finding");
    assert.match(text, /^- \[ \] \[`no-ads`\]\(https:\/\/lernapps\.net\/tooling\/rules\/#no-ads\) \(error\)$/m);
    assert.match(text, /<details>\n<summary>Das Urteil als YAML: gültig nach verdict\.v1\.schema\.json<\/summary>/);
    assert.match(text, /```yaml\nreviewed:\n {2}commit: 256048440692edfd0337a8e47046c6a7425e0a00/);
    assert.match(text, /`\/review`/, "says how to review again");
    assert.ok(text.includes(RUN_URL));
    golden("review-verdict.md", text);
  });

  test("of a verdict that fails the schema says so, with the problems, and claims no outcome", async () => {
    const value = recorded();
    value.outcome = "pass";
    const check = { status: 1, text: "verdict: verdict.yaml: /outcome: pass, but a finding has severity error; the outcome is fail\n" };
    const result = await comment(prepared("invalid", { verdict: value, check }));
    assert.equal(result.code, 1);
    const text = result.stdout;
    assert.ok(text.startsWith(`${MARKER}\n`));
    assert.match(text, /^## Review: Urteil ungültig$/m);
    assert.match(text, /the outcome is fail/);
    assert.doesNotMatch(text, /^## Review: (pass|fail)/m);
    assert.doesNotMatch(text, /^- \[ \] /m, "no findings shown as if valid");
    assert.match(text, /<summary>Das Urteil als YAML: ungültig<\/summary>/);
  });

  test("when the checks report an error, says that they fail and shows no verdict", async () => {
    const report = {
      checked: { bundle: "app/dist" },
      rules: ["accessible"],
      findings: [{ rule: "accessible", severity: "error", where: "dist/index.html", found: "a button without a name", fix: "Name it", link: "https://lernapps.net/tooling/rules/#accessible" }],
      suppressions: [],
    };
    const result = await comment(prepared("failing", { report, verdict: recorded(), check: OK }));
    assert.equal(result.code, 1);
    const text = result.stdout;
    assert.match(text, /^## Review: die Prüfungen schlagen fehl$/m);
    assert.match(text, /kein Urteil/);
    assert.match(text, /\[`accessible`\]\(https:\/\/lernapps\.net\/tooling\/rules\/#accessible\)/);
    assert.match(text, /a button without a name/);
    assert.doesNotMatch(text, /no-ads/, "the verdict is not shown");
  });

  test("without a verdict says that the agent wrote none and links the run", async () => {
    const result = await comment(prepared("none"));
    assert.equal(result.code, 1);
    assert.match(result.stdout, /^## Review: kein Urteil$/m);
    assert.ok(result.stdout.includes(RUN_URL));
  });

  test("of a verdict for another commit says so", async () => {
    const value = recorded();
    value.reviewed.commit = "1".repeat(40);
    const result = await comment(prepared("other-commit", { verdict: value, check: OK }));
    assert.equal(result.code, 1);
    assert.match(result.stdout, /^## Review: Urteil ungültig$/m);
    assert.match(result.stdout, /1111111111111111111111111111111111111111/);
  });

  test("when the app cannot be built, says so with the end of the build's output", async () => {
    const meta = { state: "build-failed", repo: "https://github.com/lernapps/bruch-trainer", commit: COMMIT, entry: "entries/bruch-trainer.yaml", build: "failed" };
    const result = await comment(prepared("build", { meta, report: null, extra: { "build.log": "npm error kaputt\n" } }));
    assert.equal(result.code, 1);
    assert.match(result.stdout, /^## Review: die App lässt sich nicht bauen$/m);
    assert.match(result.stdout, /npm error kaputt/);
  });

  test("without the review input says that the preparation did not finish", async () => {
    const result = await comment(prepared("nothing", { meta: null, report: null }));
    assert.equal(result.code, 1);
    assert.match(result.stdout, /^## Review: Vorbereitung nicht fertig$/m);
    assert.ok(result.stdout.includes(RUN_URL));
  });

  test("for a pull request it cannot review names the reason", async () => {
    const dir = prepared("problem", { meta: null, report: null });
    for (const [problem, text] of [
      ["no-entry", /ändert keinen Eintrag/],
      ["many-entries", /genau einen Eintrag/],
      ["no-source", /`source`/],
      ["no-commit", /Commit/],
      ["usage", /`\/review` oder `\/review <commit>`/],
    ]) {
      const result = await comment(dir, "--problem", problem);
      assert.equal(result.code, 1);
      assert.match(result.stdout, /^## Review: nicht möglich$/m, problem);
      assert.match(result.stdout, text, problem);
    }
    const unknown = await comment(dir, "--problem", "<b>x</b>");
    assert.equal(unknown.code, 2);
  });

  test("shows what the verdict says as text, never as markup, a mention, a second marker or a secret", async () => {
    const value = recorded();
    value.findings[0].found = "```\n<!-- lernapps-review -->\n[click](https://evil.example/) @owner <img src=x onerror=alert(1)>\n```";
    value.findings[0].where = "~~~~ ```` @owner";
    value.findings[1].fix = "token ghs_abcdefghijklmnopqrstuvwxyz0123456789 and sk-ant-oat01-abcdefghijklmnopqrstuvwxyz";
    value.archetype = "<img src=x>";
    const result = await comment(prepared("hostile", { verdict: value, check: OK }));
    const text = result.stdout;
    const markup = outsideCodeBlocks(text);
    assert.equal(markup.match(/<!--/g)?.length, 1, "one marker, at the start");
    assert.doesNotMatch(markup, /@owner|<img|evil/);
    assert.doesNotMatch(text, /ghs_abcdefghij|sk-ant-oat01-abcdefghij/, "secrets are removed, also in code blocks");
    assert.match(text, /\[entfernt\]/);
  });

  test("too long for one GitHub comment leaves the YAML to the artifact and still fits", async () => {
    const value = recorded();
    const finding = value.findings[2];
    value.findings = Array.from({ length: 120 }, (_, index) => ({ ...finding, found: `${index} ${"x".repeat(1500)}` }));
    const result = await comment(prepared("long", { verdict: value, check: OK }));
    const text = result.stdout;
    assert.ok(Buffer.byteLength(text) <= 60_000, `${Buffer.byteLength(text)} bytes`);
    assert.match(text, /das Artefakt `review`/);
    assert.match(text, /^> \*\*Gekürzt:\*\*/m);
  });
});
