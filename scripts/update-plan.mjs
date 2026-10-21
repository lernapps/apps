// The updates of the listed apps (update.yml, job `plan`; plan .vibe/development-plan-feat-serve-copies.md, step 3):
// for each entry, the head of `main` of its source, where it differs from the entry's commit and the app's address
// already serves it. The listing check opens the app there, so an update whose deploy is still running waits for the
// next run: the address's lernapps-publish.txt (written by tooling's app-publish action) names the commit it serves.
// An address without that file is not waited for. An entry whose branch update/<id> in this repo already sets the new
// commit is left out too: its pull request is open, or was closed by a person who did not want that update. Run in a
// checkout of this repo. Reads the app repos with git ls-remote only; runs no code of an app.
//
//   node scripts/update-plan.mjs [<id>]
//
// Prints one JSON array: [{ "id", "source", "from", "to" }], one per entry with a new commit that is served. An entry
// whose source cannot be read, or whose new commit is not served yet, is left out, with a notice on stderr. Exit
// code 2 on wrong usage.
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const only = process.argv[2];
if (only !== undefined && !ID.test(only)) {
  process.stderr.write("Usage: node scripts/update-plan.mjs [<id>]\n");
  process.exit(2);
}
const git = (...args) => spawnSync("git", args, { encoding: "utf8", env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });

/** The commit the app's address serves, or undefined when it does not say. */
async function served(url) {
  try {
    const response = await fetch(new URL("lernapps-publish.txt", url), { cache: "no-store", redirect: "follow" });
    if (!response.ok) return undefined;
    return /^[0-9a-f]{40}$/.exec((await response.text()).trim())?.[0];
  } catch {
    return undefined;
  }
}

const updates = [];
for (const file of readdirSync("entries").filter((name) => name.endsWith(".yaml")).sort()) {
  const id = file.replace(/\.yaml$/, "");
  if (only !== undefined && id !== only) continue;
  const entry = load(readFileSync(join("entries", file), "utf8"));
  const { source, commit, url } = entry ?? {};
  if (typeof source !== "string" || typeof commit !== "string") continue;
  const head = /^([0-9a-f]{40})\trefs\/heads\/main$/m.exec(git("ls-remote", source, "refs/heads/main").stdout)?.[1];
  if (head === undefined) {
    process.stderr.write(`update-plan: ${id}: no main in ${source}\n`);
    continue;
  }
  if (head === commit) continue;
  const serving = typeof url === "string" ? await served(url) : undefined;
  if (serving !== undefined && serving !== head) {
    process.stderr.write(`update-plan: ${id}: ${url} serves ${serving.slice(0, 7)}, not yet ${head.slice(0, 7)}: next run\n`);
    continue;
  }
  // the pull request of this update exists already: open, or closed without a merge
  const branch = git("fetch", "--quiet", "--depth=1", "origin", `refs/heads/update/${id}`);
  if (branch.status === 0 && git("show", `FETCH_HEAD:entries/${file}`).stdout.includes(`commit: ${head}`)) continue;
  updates.push({ id, source, from: commit, to: head });
}
process.stdout.write(`${JSON.stringify(updates)}\n`);
