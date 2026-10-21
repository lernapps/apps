// What publish.yml builds and removes (plan .vibe/development-plan-feat-serve-copies.md, steps 1 to 3): the copies
// lernapps.net serves at https://lernapps.net/apps/start/<id>/.
//
//   node scripts/publish-plan.mjs --live <copies.txt>  the entries whose copy is missing or at another commit than
//                                                     copies.txt lists (build), and the copies without an entry
//                                                     (remove)
//   node scripts/publish-plan.mjs --id <id>           one entry, built again (workflow_dispatch)
//   node scripts/publish-plan.mjs --all               every entry, built again (workflow_dispatch without an id)
//
// Prints one JSON object: { "build": [{ "id", "source", "commit" }], "remove": ["<id>"] }. --live compares the entries
// with what is served, not with the push before: a run that was cancelled (a newer push waits in the same concurrency
// group) or a copy whose build failed is caught up by the next run. An entry whose text alone changed is not built
// again: its copy is the same. Exit code 2 on wrong usage.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { load } from "js-yaml";

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FILE = /^entries\/([a-z0-9]+(?:-[a-z0-9]+)*)\.yaml$/;

function usage(message) {
  process.stderr.write(`publish-plan: ${message}\nUsage: node scripts/publish-plan.mjs --live <copies.txt> | --id <id> | --all\n`);
  process.exit(2);
}

/** The entry's source and commit; undefined when there is none. */
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
} else if (option === "--all") {
  for (const file of readdirSync("entries").filter((name) => FILE.test(`entries/${name}`)).sort()) {
    const now = pinned(readFileSync(`entries/${file}`, "utf8"));
    if (now) plan.build.push({ id: file.replace(/\.yaml$/, ""), ...now });
  }
} else if (option === "--live") {
  if (!value) usage("--live: the path of copies.txt (an empty file when there is none yet)");
  /** id → commit, as copies.txt lists them. */
  const live = new Map(
    (existsSync(value) ? readFileSync(value, "utf8") : "")
      .split("\n")
      .map((line) => line.trim().split(/\s+/))
      .filter(([id, commit]) => ID.test(id ?? "") && /^[0-9a-f]{40}$/.test(commit ?? "")),
  );
  const ids = new Set();
  for (const file of readdirSync("entries").filter((name) => FILE.test(`entries/${name}`)).sort()) {
    const id = file.replace(/\.yaml$/, "");
    ids.add(id);
    const now = pinned(readFileSync(`entries/${file}`, "utf8"));
    if (now && live.get(id) !== now.commit) plan.build.push({ id, ...now }); // the catalog's build rejects an entry without them
  }
  plan.remove.push(...[...live.keys()].filter((id) => !ids.has(id)).sort());
} else {
  usage("name --live <copies.txt>, --id <id> or --all");
}
process.stdout.write(`${JSON.stringify(plan)}\n`);
