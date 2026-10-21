// What publish.yml builds and removes (plan .vibe/development-plan-feat-serve-copies.md, steps 1 to 3): the copies
// lernapps.net serves at https://lernapps.net/<id>/.
//
//   node scripts/publish-plan.mjs --before <commit>   the entries a push to main added or changed in `source` or
//                                                    `commit` (build), and those it deleted (remove)
//   node scripts/publish-plan.mjs --id <id>           one entry, built again (workflow_dispatch)
//
// Prints one JSON object: { "build": [{ "id", "source", "commit" }], "remove": ["<id>"] }. An entry whose text alone
// changed is not built again: its copy is the same. Exit code 2 on wrong usage.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { load } from "js-yaml";

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FILE = /^entries\/([a-z0-9]+(?:-[a-z0-9]+)*)\.yaml$/;

function usage(message) {
  process.stderr.write(`publish-plan: ${message}\nUsage: node scripts/publish-plan.mjs --before <commit> | --id <id>\n`);
  process.exit(2);
}

const git = (...args) => spawnSync("git", args, { encoding: "utf8" });

/** The entry's source and commit, from a file or from `git show <ref>:<file>`; undefined when there is none. */
function pinned(text) {
  let entry;
  try {
    entry = load(text);
  } catch {
    return undefined;
  }
  return typeof entry?.source === "string" && typeof entry?.commit === "string"
    ? { source: entry.source, commit: entry.commit }
    : undefined;
}

const [option, value] = process.argv.slice(2);
const plan = { build: [], remove: [] };
if (option === "--id") {
  if (!ID.test(value ?? "")) usage(`--id ${value}: an id in kebab-case`);
  const file = `entries/${value}.yaml`;
  if (!existsSync(file)) usage(`${file}: no such entry`);
  const now = pinned(readFileSync(file, "utf8"));
  if (!now) usage(`${file}: no source and commit`);
  plan.build.push({ id: value, ...now });
} else if (option === "--before") {
  if (!/^[0-9a-f]{7,40}$/.test(value ?? "")) usage(`--before ${value}: a commit id`);
  // a push that created the branch has no commit before it: compare with the first parent instead
  const before = git("cat-file", "-e", `${value}^{commit}`).status === 0 ? value : "HEAD^1";
  const diff = git("diff", "--name-status", "--no-renames", before, "HEAD", "--", "entries/");
  if (diff.status !== 0) usage(`git diff ${before} HEAD: ${diff.stderr.trim()}`);
  for (const line of diff.stdout.split("\n").filter(Boolean)) {
    const [status, file] = line.split("\t");
    const id = FILE.exec(file)?.[1];
    if (!id) continue;
    if (status === "D") {
      plan.remove.push(id);
      continue;
    }
    const now = pinned(readFileSync(file, "utf8"));
    if (!now) continue; // the catalog's build rejects an entry without them
    const old = status === "A" ? undefined : pinned(git("show", `${before}:${file}`).stdout);
    if (old?.source !== now.source || old?.commit !== now.commit) plan.build.push({ id, ...now });
  }
} else {
  usage("name --before <commit> or --id <id>");
}
process.stdout.write(`${JSON.stringify(plan)}\n`);
