// The scripts of the upgrade workflow (.github/workflows/upgrade.yml): which apps, what the commit says, what the report says.
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "js-yaml";
import { appsOf } from "../scripts/upgrade-plan.mjs";
import { body, keyChanges, TITLE } from "../scripts/upgrade-message.mjs";
import { issueBody, summary } from "../scripts/upgrade-report.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("the apps are the sources of the entries, each once, and a source named by hand", () => {
  const dir = mkdtempSync(join(tmpdir(), "lernapps-upgrade-"));
  try {
    writeFileSync(join(dir, "a.yaml"), "source: https://github.com/lernapps/a\n");
    writeFileSync(join(dir, "b.yaml"), "source: https://github.com/mrsimpson/b.git\n");
    writeFileSync(join(dir, "c.yaml"), "source: https://github.com/lernapps/a/\n");
    writeFileSync(join(dir, "d.yaml"), "source: https://example.org/x/d\n");
    const notices = [];
    assert.deepEqual(
      appsOf(dir, undefined, (line) => notices.push(line)),
      [
        { id: "a", source: "https://github.com/lernapps/a", owner: "lernapps", repo: "a" },
        { id: "b", source: "https://github.com/mrsimpson/b", owner: "mrsimpson", repo: "b" },
      ],
    );
    assert.equal(notices.length, 1);
    assert.deepEqual(appsOf(dir, "https://github.com/mrsimpson/mental-math"), [
      { id: "mental-math", source: "https://github.com/mrsimpson/mental-math", owner: "mrsimpson", repo: "mental-math" },
    ]);
    assert.throws(() => appsOf(dir, "https://example.org/x/y"));
    assert.throws(() => appsOf(dir, "https://github.com/x/y; rm -rf ."));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("the commit message has the sections of the apps' history and takes the key changes from the update's output", () => {
  const log = "lernapps update: @lernapps/tooling: 9dd7b27 → e6814d4\nNext: npx lernapps check\nlernapps update: skills: replaced a, b\n";
  assert.equal(keyChanges(log), "- @lernapps/tooling: 9dd7b27 → e6814d4\n- skills: replaced a, b");
  const text = body(log);
  for (const section of ["## Intent", "## Key changes", "## Dependencies and side effects"]) assert.ok(text.includes(section), section);
  assert.ok(text.includes("- skills: replaced a, b"));
  assert.ok(TITLE.length < 72 && /^chore\(deps\): /.test(TITLE));
  assert.ok(body("").includes("the pins moved"));
  assert.ok(keyChanges(`lernapps update: ${"x".repeat(9000)}`).length < 4100);
});

test("the report lists the apps that need a person, and nothing when none does", () => {
  const app = (id, status, owner = "lernapps") => ({ id, owner, repo: id, source: `https://github.com/${owner}/${id}`, status });
  const results = [app("a", "opened"), app("b", "not-installed", "mrsimpson"), app("c", "check-failed"), app("d", "uptodate")];
  const issue = issueBody(results, "https://example.org/run");
  assert.ok(issue.includes("mrsimpson/b") && issue.includes("lernapps/c"));
  assert.ok(!issue.includes("lernapps/a") && !issue.includes("lernapps/d"));
  assert.equal(issueBody([app("a", "opened"), app("d", "uptodate")], "run"), "");
  assert.ok(summary(results).split("\n").filter((line) => line.startsWith("| ")).length === 5);
});

test("the workflow keeps its split: no secret near an app's code, the token only for the one repo", () => {
  const workflow = load(readFileSync(join(repo, ".github", "workflows", "upgrade.yml"), "utf8"));
  assert.deepEqual(workflow.permissions, {});
  const jobs = workflow.jobs;
  assert.deepEqual(Object.keys(jobs), ["plan", "update", "pull-request", "report"]);
  for (const name of ["plan", "update", "report"]) {
    assert.equal(jobs[name].environment, undefined, name);
    assert.ok(!JSON.stringify(jobs[name]).includes("secrets."), `${name} uses no secret`);
  }
  assert.equal(jobs["pull-request"].environment, "updater");
  const step = jobs["pull-request"].steps.find((s) => s.id === "app");
  assert.equal(step.with.repositories, "${{ matrix.app.repo }}");
  assert.equal(step.with.owner, "${{ matrix.app.owner }}");
  // the job that runs an app's install scripts clones with no credentials and has only a read token
  assert.deepEqual(jobs.update.permissions, { contents: "read" });
  // nothing from the matrix is put into a script as text: it goes through env
  for (const job of Object.values(jobs)) {
    for (const s of job.steps) assert.ok(!/\$\{\{\s*(matrix|inputs)\./.test(s.run ?? ""), `${s.name ?? s.id}: matrix or input in a script`);
  }
});
