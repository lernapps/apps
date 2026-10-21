// Puts the copies into `start/` of a checkout of this repo's `gh-pages` (publish.yml, job `publish`): lernapps.net
// serves each at https://lernapps.net/apps/start/<id>/. Runs no code of an app; the copies are files.
//
//   node scripts/publish-copies.mjs <site dir> <copies dir> <plan json>
//
// <copies dir> holds one directory per built copy (<id>/), <plan json> is the output of scripts/publish-plan.mjs.
// For each built copy it replaces <site dir>/<id>/; for each removed entry it deletes <site dir>/<id>/; it keeps
// <site dir>/copies.txt, one "<id> <commit>" per line, sorted: the list the catalog reads to link only copies that
// are live. A copy in the plan without a directory in <copies dir> (its build failed) stays as it was. Prints what it did; exit code 2 on wrong usage.
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const [site, copies, json] = process.argv.slice(2);
if (!site || !copies || !json) {
  process.stderr.write("Usage: node scripts/publish-copies.mjs <site dir> <copies dir> <plan json>\n");
  process.exit(2);
}
const plan = JSON.parse(json);
const list = join(site, "copies.txt");
/** id → commit, as copies.txt has them. */
const live = new Map(
  (existsSync(list) ? readFileSync(list, "utf8") : "")
    .split("\n")
    .map((line) => line.trim().split(/\s+/))
    .filter(([id, commit]) => ID.test(id ?? "") && /^[0-9a-f]{40}$/.test(commit ?? "")),
);

const done = [];
for (const { id, source, commit } of plan.build) {
  if (!ID.test(id)) continue;
  const copy = join(copies, id);
  if (!existsSync(copy)) {
    done.push(`kept ${id}: no copy of ${source} at ${commit} (its build failed)`);
    continue;
  }
  rmSync(join(site, id), { recursive: true, force: true });
  cpSync(copy, join(site, id), { recursive: true });
  live.set(id, commit);
  done.push(`copy of ${source} at ${commit} → ${id}/`);
}
for (const id of plan.remove) {
  if (!ID.test(id) || !live.has(id)) continue;
  rmSync(join(site, id), { recursive: true, force: true });
  live.delete(id);
  done.push(`removed ${id}/`);
}
writeFileSync(list, [...live].sort(([a], [b]) => a.localeCompare(b)).map(([id, commit]) => `${id} ${commit}\n`).join(""));
process.stdout.write(done.length ? `${done.join("\n")}\n` : "nothing to publish\n");
