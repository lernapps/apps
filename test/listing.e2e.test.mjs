// The listing validation as a creator's assistant meets it on a listing pull request: the command the workflow
// runs (`npm run --silent listing -- entries/<id>.yaml`), on fixture entries against a fixture app served on
// 127.0.0.1, and the comment the workflow posts, rendered from the reports that command wrote.
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";

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
    assert.match(result.stdout, /#checks-pass/);
    assert.match(result.stdout, /lernapps check stopped: .*ERR_CONNECTION_REFUSED/);
    assert.match(result.stdout, /Make sure the app opens at the entry's url in a browser/);
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

  test("without reports says that the check did not finish and links the run", async () => {
    const dir = mkdtempSync(join(temp, "none-"));
    const result = await comment(dir, "--run-url", "https://github.com/lernapps/apps/actions/runs/1");
    assert.equal(result.code, 1);
    assert.match(result.stdout, /^<!-- lernapps-listing -->\n/);
    assert.match(result.stdout, /https:\/\/github\.com\/lernapps\/apps\/actions\/runs\/1/);
  });
});
