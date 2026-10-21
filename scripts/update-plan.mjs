// The updates of the listed apps (update.yml; plan .vibe/development-plan-feat-serve-copies.md, step 3): for each
// entry, the head of `main` of its source; where it differs from the entry's commit, the kind of the update
// (scripts/update-kind.mjs). Reads the app repos with git only; runs no code of an app.
//
//   node scripts/update-plan.mjs [<id>]
//
// Prints one JSON array: [{ "id", "source", "from", "to", "kind", "reasons" }], one per entry with a new commit. An
// entry whose source cannot be read is left out, with a notice on stderr. Exit code 2 on wrong usage.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { load } from "js-yaml";
import { updateKind } from "./update-kind.mjs";

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const only = process.argv[2];
if (only !== undefined && !ID.test(only)) {
  process.stderr.write("Usage: node scripts/update-plan.mjs [<id>]\n");
  process.exit(2);
}
const git = (...args) => spawnSync("git", args, { encoding: "utf8", env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });

const updates = [];
for (const file of readdirSync("entries").filter((name) => name.endsWith(".yaml")).sort()) {
  const id = file.replace(/\.yaml$/, "");
  if (only !== undefined && id !== only) continue;
  const entry = load(readFileSync(join("entries", file), "utf8"));
  const { source, commit } = entry ?? {};
  if (typeof source !== "string" || typeof commit !== "string") continue;
  const head = /^([0-9a-f]{40})\trefs\/heads\/main$/m.exec(git("ls-remote", source, "refs/heads/main").stdout)?.[1];
  if (head === undefined) {
    process.stderr.write(`update-plan: ${id}: no main in ${source}\n`);
    continue;
  }
  if (head === commit) continue;
  const dir = mkdtempSync(join(tmpdir(), `update-${id}-`));
  try {
    const clone = git("clone", "--quiet", "--filter=blob:none", "--no-checkout", source, dir);
    if (clone.status !== 0) {
      process.stderr.write(`update-plan: ${id}: ${clone.stderr.trim()}\n`);
      continue;
    }
    const ancestor = git("-C", dir, "merge-base", "--is-ancestor", commit, head).status === 0;
    const { kind, reasons } = ancestor
      ? updateKind(dir, commit, head)
      : { kind: "review", reasons: [`${commit.slice(0, 7)} is not an ancestor of ${head.slice(0, 7)}: the history was rewritten`] };
    updates.push({ id, source, from: commit, to: head, kind, reasons });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
process.stdout.write(`${JSON.stringify(updates)}\n`);
