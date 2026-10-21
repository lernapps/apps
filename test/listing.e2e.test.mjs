// The listing validation as a creator's assistant meets it on a listing pull request: the command the workflow
// runs (`npm run --silent listing -- entries/<id>.yaml`), on fixture entries against a fixture app served on
// 127.0.0.1, and the comment the workflow posts, rendered from the reports that command wrote.
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { dump, load } from "js-yaml";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixtures = join(repo, "test", "fixtures");
const UPDATE = process.env.UPDATE_GOLDEN === "1";

/** Runs a command without blocking this process, which serves the app the command checks. */
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

/** A fixture app on 127.0.0.1, as GitHub Pages serves it: index.html for a directory, 404 for anything else. */
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

const temp = mkdtempSync(join(tmpdir(), "lernapps-listing-"));
after(() => rmSync(temp, { recursive: true, force: true }));

/**
 * A listing pull request in a folder of its own: `entries/bruch-trainer.yaml` from a fixture entry, pointing to the
 * served app. Runs the listing command there, with the reports in `listing/`, as the workflow does.
 */
async function listing(fixture, url) {
  const dir = mkdtempSync(join(temp, `${fixture}-`));
  mkdirSync(join(dir, "entries"));
  const entry = readFileSync(join(fixtures, "entries", `${fixture}.yaml`), "utf8").replace(`url: "{{url}}"`, `url: "${url}"`);
  writeFileSync(join(dir, "entries", "bruch-trainer.yaml"), entry);
  // `npm run --silent listing --` is `node scripts/listing.mjs`, run here from the pull request's folder.
  const result = await run("node", [join(repo, "scripts", "listing.mjs"), "--out", "listing", "entries/bruch-trainer.yaml"], dir);
  return { ...result, dir, reports: join(dir, "listing") };
}

/** The comment the workflow posts, from the reports of a listing run (scripts/listing-comment.mjs). */
const comment = (reports, ...args) => run("node", [join(repo, "scripts", "listing-comment.mjs"), reports, ...args], repo);

/** The address and time of a run, replaced, so that a comment can be compared with its golden file. */
const normal = (text, url) => text.replaceAll(url, "https://example.org/bruch-trainer/").replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g, "2026-10-09T12:00:00.000Z");

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

/**
 * A folder with one validation report, `bruch-trainer.yaml`, as a run writes it: `counts` findings per rule, in rule
 * order, each naming its rule and number; `found` makes them as long as needed.
 */
function report(name, counts, found = "", rules = Object.keys(counts)) {
  const dir = mkdtempSync(join(temp, `${name}-`));
  const findings = Object.entries(counts).flatMap(([rule, n]) =>
    Array.from({ length: n }, (_, index) => ({
      rule,
      severity: "error",
      where: `entries/bruch-trainer.yaml: ${rule} ${index + 1}`,
      found: `finding ${index + 1} of ${rule} ${found}`.trim(),
      fix: `Fix ${rule}`,
      link: `https://lernapps.net/tooling/rules/#${rule}`,
    })),
  );
  const value = {
    checked: { url: "https://example.org/bruch-trainer/", at: "2026-10-09T12:00:00.000Z" },
    rules,
    findings,
    suppressions: [],
    fitness: { storage: "none", thirdParty: "none" },
  };
  writeFileSync(join(dir, "bruch-trainer.yaml"), dump(value, { lineWidth: -1 }));
  return dir;
}

const SLOW = { timeout: 180_000 };

describe("a listing pull request", () => {
  let app;
  let storing;
  before(async () => {
    app = await serve(join(fixtures, "apps", "bruch-trainer"));
    storing = await serve(join(fixtures, "apps", "bruch-trainer-speichert"));
  });
  after(() => {
    app.server.close();
    storing.server.close();
  });

  test("whose topic link does not resolve fails with a comment naming the topic and the fix", SLOW, async () => {
    const result = await listing("broken-topic", app.url);
    assert.equal(result.code, 1, result.stdout + result.stderr);
    const text = result.stdout;
    assert.match(text, /^<!-- lernapps-listing -->\n/);
    assert.match(text, /entries\/bruch-trainer\.yaml: topics\[1\]\.path erweitern\//);
    assert.match(text, /erweitern\/ answers 404/);
    assert.match(text, /Point the topic's path \(relative to url\) to a page of the app/);
    assert.match(text, /https:\/\/lernapps\.net\/tooling\/rules\/#entry-links-resolve/);
    assert.match(text, /npm run --silent listing -- entries\/bruch-trainer\.yaml/);
    assert.doesNotMatch(text, /topics\[0\]/, "the topic that resolves is not a finding");
    golden("broken-topic.md", normal(text, app.url));

    // The workflow comments what the command printed: rendered again from the reports it wrote.
    const posted = await comment(result.reports);
    assert.equal(posted.code, 1);
    assert.equal(posted.stdout, text);
  });

  test("with the topic fixed passes, and the comment says so", SLOW, async () => {
    const result = await listing("fixed-topic", app.url);
    assert.equal(result.code, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /^<!-- lernapps-listing -->\n/);
    assert.match(result.stdout, /bestanden/);
    assert.doesNotMatch(result.stdout, /nicht bestanden/);
    assert.match(result.stdout, /kann lernapps\.net die App in einem Review genauer ansehen/, "a review may follow; none is promised");
    golden("fixed-topic.md", normal(result.stdout, app.url));
    const posted = await comment(result.reports);
    assert.equal(posted.code, 0);
    assert.equal(posted.stdout, result.stdout);
  });

  test("that declares storage: none for an app that stores on the device fails on the fitness value", SLOW, async () => {
    const result = await listing("fixed-topic", storing.url);
    assert.equal(result.code, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /#entry-fitness-matches/);
    assert.match(result.stdout, /entries\/bruch-trainer\.yaml: fitness\.storage/);
    assert.match(result.stdout, /the entry says storage: none, but the app stores on the device \(localStorage fortschritt\)/);
    assert.match(result.stdout, /Set fitness\.storage to device in the entry/);
  });

  test("that says checked: true fails while the check fails", SLOW, async () => {
    const result = await listing("checked-but-failing", app.url);
    assert.equal(result.code, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /entries\/bruch-trainer\.yaml: fitness\.checked/);
    assert.match(result.stdout, /the entry says checked: true, but the check fails/);
    assert.match(result.stdout, /Set fitness\.checked to false/);
  });

  test("whose app cannot be reached fails with a finding that says so", SLOW, async () => {
    const gone = await serve(join(fixtures, "apps", "bruch-trainer"));
    await new Promise((done) => gone.server.close(done));
    const result = await listing("fixed-topic", gone.url);
    assert.equal(result.code, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /#app-checkable/);
    assert.doesNotMatch(result.stdout, /#checks-pass/);
    assert.match(result.stdout, /lernapps check stopped: .*ERR_CONNECTION_REFUSED/);
    assert.match(result.stdout, /Make the app open at the entry's url in a browser/);
  });

  test("whose entry has no url fails on the entry, not on the app", SLOW, async () => {
    const dir = mkdtempSync(join(temp, "no-url-"));
    mkdirSync(join(dir, "entries"));
    writeFileSync(join(dir, "entries", "bruch-trainer.yaml"), "title: Bruch-Trainer\n");
    const result = await run("node", [join(repo, "scripts", "listing.mjs"), "--out", "listing", "entries/bruch-trainer.yaml"], dir);
    assert.equal(result.code, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /#entry-from-schema/);
    assert.doesNotMatch(result.stdout, /#app-checkable|#checks-pass/);
    assert.match(result.stdout, /lernapps check cannot read the entry: .*has no url/);
  });

  test("that says checked: true passes when the check passes", SLOW, async () => {
    const result = await listing("checked-and-passing", app.url);
    assert.equal(result.code, 0, result.stdout + result.stderr);
  });
});

describe("the comment from the reports of a run", () => {
  test("shows what a report says as text, never as markup, mention or a second marker", async () => {
    const dir = mkdtempSync(join(temp, "hostile-"));
    cpSync(join(fixtures, "reports", "hostile.yaml"), join(dir, "bruch-trainer.yaml"));
    writeFileSync(join(dir, "Not An Entry.yaml"), "findings: []\n");
    const result = await comment(dir);
    assert.equal(result.code, 1, result.stderr);
    const text = result.stdout;
    assert.ok(text.startsWith("<!-- lernapps-listing -->\n"));
    // Every value of the report stands in a fenced code block, where GitHub renders no HTML, mention or link.
    const markup = outsideCodeBlocks(text);
    assert.equal(markup.match(/<!--/g)?.length, 1, "one marker, at the start");
    assert.doesNotMatch(markup, /@owner|<img|evil/);
    assert.match(text, /<img src=x onerror=alert\(1\)> @owner/, "the values are shown as they are");
    assert.match(markup, /https:\/\/lernapps\.net\/tooling\/rules\/#no-tracking/, "the link is built from the rule id");
    assert.doesNotMatch(text, /Not An Entry/, "a report file that names no entry is left out");
  });

  test("that passes is short: says bestanden, with the checked address, time and measured values", async () => {
    const dir = report("passed", {}, "", ["entry-links-resolve", "entry-fitness-matches", "no-tracking"]);
    const result = await comment(dir, "--run-url", "https://github.com/lernapps/apps/actions/runs/1");
    assert.equal(result.code, 0, result.stderr);
    const text = result.stdout;
    assert.match(text, /^<!-- lernapps-listing -->\n## Prüfung des Eintrags: bestanden\n/);
    assert.match(text, /^### entries\/bruch-trainer\.yaml: bestanden$/m);
    assert.match(text, /Geprüft: +https:\/\/example\.org\/bruch-trainer\/ \(2026-10-09T12:00:00\.000Z\)/);
    assert.match(text, /Gemessen: +fitness\.storage none, fitness\.thirdParty none \(ohne Klick\)/);
    assert.match(text, /Regeln: +3 geprüft/);
    assert.doesNotMatch(text, /nicht bestanden|- \[ \]|Selbst prüfen/, "nothing to fix, nothing to run");
    golden("passed.md", text);
  });

  test("lists every finding as a task, grouped by rule, so that no rule goes unseen", async () => {
    // 64 findings in rule order: past the old cap of 50, every finding of usable-at-360px was missing.
    const dir = report("many", { "entry-links-resolve": 30, "no-tracking": 15, "safe-links": 5, "usable-at-360px": 14 });
    const result = await comment(dir);
    assert.equal(result.code, 1, result.stderr);
    const text = result.stdout;
    assert.equal(text.match(/^- \[ \] /gm)?.length, 64, "one checkbox per finding");
    for (const [rule, n] of [["entry-links-resolve", 30], ["no-tracking", 15], ["safe-links", 5], ["usable-at-360px", 14]]) {
      assert.match(text, new RegExp(`^#### Regel \\[\`${rule}\`\\]\\(https://lernapps\\.net/tooling/rules/#${rule}\\): ${n} Fehler$`, "m"));
      assert.equal(text.match(new RegExp(`^- \\[ \\] \\[\`${rule}\`\\]\\(https://lernapps\\.net/tooling/rules/#${rule}\\) \\(error\\)$`, "gm"))?.length, n);
    }
    assert.match(text, /Wo: +entries\/bruch-trainer\.yaml: usable-at-360px 14\n/, "the last finding of the last rule");
    assert.doesNotMatch(text, /weitere Befunde|Gekürzt/);
    golden("many-findings.md", text);
  });

  test("too long for one GitHub comment cuts off explicitly, counts every rule and links the full report", async () => {
    const counts = { "entry-links-resolve": 150, "no-tracking": 3, "usable-at-360px": 120 };
    const dir = report("huge", counts, "x".repeat(400));
    const artifact = "https://github.com/lernapps/apps/actions/runs/1/artifacts/2";
    const result = await comment(dir, "--run-url", "https://github.com/lernapps/apps/actions/runs/1", "--report-url", artifact);
    assert.equal(result.code, 1, result.stderr);
    const text = result.stdout;
    assert.ok(Buffer.byteLength(text) <= 60_000, `${Buffer.byteLength(text)} bytes: fits a GitHub comment with margin`);
    assert.match(text, /^> \*\*Gekürzt:\*\* Dieser Kommentar zeigt (\d+) von 273 Befunden/m);
    assert.ok(text.includes(`Der vollständige Prüfbericht: das Artefakt \`listing\` dieses Laufs, ${artifact}`));
    const shown = text.match(/^- \[ \] /gm)?.length ?? 0;
    assert.ok(shown > 0 && shown < 273, `${shown} findings shown`);
    assert.equal(Number(text.match(/zeigt (\d+) von 273/)[1]), shown, "the cutoff says how many are shown");
    let total = 0;
    for (const [rule, n] of Object.entries(counts)) {
      const row = text.match(new RegExp(`^\\| \\[\`${rule}\`\\]\\(https://lernapps\\.net/tooling/rules/#${rule}\\) \\| ${n} Fehler \\| (\\d+) \\|$`, "m"));
      assert.ok(row, `the overview lists ${rule} with its count`);
      const listed = text.match(new RegExp(`^- \\[ \\] \\[\`${rule}\`\\]`, "gm"))?.length ?? 0;
      assert.equal(Number(row[1]), listed, `the overview says how many of ${rule} are shown`);
      assert.ok(listed > 0, `${rule} shows at least one finding`);
      assert.match(text, new RegExp(`^#### Regel \\[\`${rule}\`\\]\\(https://lernapps\\.net/tooling/rules/#${rule}\\): ${n} Fehler, ${listed} davon gezeigt$`, "m"));
      if (listed < n) assert.ok(text.includes(`… und ${n - listed} weitere Befunde dieser Regel: im vollständigen Prüfbericht (oben verlinkt).`));
      total += listed;
    }
    assert.equal(total, shown);
    assert.equal(text.match(/^- \[ \] \[`no-tracking`\]/gm)?.length, 3, "a small rule is shown whole");

    // Without the artifact's address it links the run; without either, the reports of a run of one's own.
    const run = await comment(dir, "--run-url", "https://github.com/lernapps/apps/actions/runs/1", "--report-url", "https://evil.example/");
    assert.match(run.stdout, /Der vollständige Prüfbericht: das Artefakt `listing` des Laufs https:\/\/github\.com\/lernapps\/apps\/actions\/runs\/1/);
    assert.doesNotMatch(run.stdout, /evil/);
    const local = await comment(dir);
    assert.match(local.stdout, /Die vollständigen Prüfberichte \(YAML\) schreibt die Prüfung, wenn du sie selbst ausführst \(unten\)/);
  });

  test("without reports says that the check did not finish and links the run", async () => {
    const dir = mkdtempSync(join(temp, "none-"));
    const result = await comment(dir, "--run-url", "https://github.com/lernapps/apps/actions/runs/1");
    assert.equal(result.code, 1);
    assert.match(result.stdout, /^<!-- lernapps-listing -->\n/);
    assert.match(result.stdout, /https:\/\/github\.com\/lernapps\/apps\/actions\/runs\/1/);
  });
});

/**
 * The step of listing-comment.yml that comments, run as GitHub runs it (bash -e -o pipefail) in a checkout of its own,
 * with `gh` replaced by a stub: it answers with the open pull request #13 and, when `existing` is set,
 * an earlier comment of the workflow, and records every call. The reports of the run are in `listing/`, if any.
 */
async function commentStep({ reports, conclusion, existing }) {
  const workflow = load(readFileSync(join(repo, ".github", "workflows", "listing-comment.yml"), "utf8"));
  const step = workflow.jobs.comment.steps.find((s) => s.name === "Comment on the pull request");
  const dir = mkdtempSync(join(temp, "step-"));
  // main's scripts, as checked out; its dependencies, as installed (a linked script would not run as the main module).
  cpSync(join(repo, "scripts"), join(dir, "scripts"), { recursive: true });
  symlinkSync(join(repo, "node_modules"), join(dir, "node_modules"));
  if (reports) cpSync(reports, join(dir, "listing"), { recursive: true });
  const bin = join(dir, "bin");
  mkdirSync(bin);
  writeFileSync(
    join(bin, "gh"),
    [
      "#!/usr/bin/env bash",
      'printf "%s\\n" "$*" >> "$GH_LOG"',
      'case "$*" in',
      '  *"--method PATCH"*|*"--method POST"*) for arg; do case "$arg" in body=@*) cat "${arg#body=@}" > "$GH_BODY";; esac; done ;;',
      '  *"/pulls?"*) echo 13 ;;',
      '  *"/comments?"*) if [ -n "$GH_EXISTING" ]; then echo "$GH_EXISTING"; fi ;;',
      "esac",
      "",
    ].join("\n"),
  );
  chmodSync(join(bin, "gh"), 0o755);
  const log = join(dir, "gh.log");
  const body = join(dir, "posted.md");
  writeFileSync(log, "");
  const env = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH}`,
    GH_LOG: log,
    GH_BODY: body,
    GH_EXISTING: existing ?? "",
    GH_TOKEN: "test",
    REPO: "lernapps/apps",
    HEAD_SHA: "0123456789abcdef0123456789abcdef01234567",
    CONCLUSION: conclusion,
    RUN_URL: "https://github.com/lernapps/apps/actions/runs/1",
    RUN_ID: "1",
    ARTIFACT_ID: "7", // the newest artifact of the run, from the step before
  };
  const result = await new Promise((done, fail) => {
    const child = spawn("bash", ["--noprofile", "--norc", "-e", "-o", "pipefail", "-c", step.run], { cwd: dir, env });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("error", fail);
    child.on("close", (code) => done({ code, output }));
  });
  const calls = readFileSync(log, "utf8").split("\n").filter(Boolean);
  return { ...result, calls, body: existsSync(body) ? readFileSync(body, "utf8") : undefined };
}

describe("the workflow step that comments on the pull request", () => {
  const writes = (calls) => calls.filter((call) => /--method (POST|PATCH)/.test(call));

  test("creates the comment for a passing check when there is none", async () => {
    const reports = report("step-passed", {}, "", ["entry-links-resolve"]);
    const result = await commentStep({ reports, conclusion: "success" });
    assert.equal(result.code, 0, result.output);
    assert.deepEqual(writes(result.calls), ["api --method POST repos/lernapps/apps/issues/13/comments -F body=@body.md"]);
    assert.match(result.body, /^<!-- lernapps-listing -->\n## Prüfung des Eintrags: bestanden\n/);
    assert.equal(result.body, (await comment(reports, "--run-url", "https://github.com/lernapps/apps/actions/runs/1")).stdout);
  });

  test("updates its one comment in place for a passing check", async () => {
    const reports = report("step-passed-again", {}, "", ["entry-links-resolve"]);
    const result = await commentStep({ reports, conclusion: "success", existing: "42" });
    assert.equal(result.code, 0, result.output);
    assert.deepEqual(writes(result.calls), ["api --method PATCH repos/lernapps/apps/issues/comments/42 -F body=@body.md"]);
    assert.match(result.body, /bestanden/);
    assert.doesNotMatch(result.body, /nicht bestanden/);
  });

  test("creates the comment for a failing check when there is none, and updates it when there is", async () => {
    const reports = report("step-failed", { "entry-links-resolve": 1 });
    const created = await commentStep({ reports, conclusion: "failure" });
    assert.equal(created.code, 0, created.output);
    assert.deepEqual(writes(created.calls), ["api --method POST repos/lernapps/apps/issues/13/comments -F body=@body.md"]);
    assert.match(created.body, /^## Prüfung des Eintrags: nicht bestanden$/m);
    const updated = await commentStep({ reports, conclusion: "failure", existing: "42" });
    assert.deepEqual(writes(updated.calls), ["api --method PATCH repos/lernapps/apps/issues/comments/42 -F body=@body.md"]);
  });

  test("comments nothing when the run checked no entry", async () => {
    const result = await commentStep({ conclusion: "success" });
    assert.equal(result.code, 0, result.output);
    assert.deepEqual(writes(result.calls), []);
  });
});
