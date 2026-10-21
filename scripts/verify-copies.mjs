// Checks the copies where lernapps.net serves them (publish.yml, job `verify`): waits until
// https://lernapps.net/apps/start/copies.txt lists each built copy at its commit (GitHub Pages has deployed it), then
// runs `lernapps check --entry` on the entry with its `url` set to https://lernapps.net/apps/start/<id>/.
//
//   node scripts/verify-copies.mjs <plan json> [--origin <url>] [--wait <seconds>]
//
// <plan json> is the output of scripts/publish-plan.mjs. A copy that is not listed in time is a failure, as is a check
// with an error. Exit code 0 when every copy passes, 1 otherwise, 2 on wrong usage.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dump, load } from "js-yaml";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LERNAPPS = join(root, "node_modules", ".bin", "lernapps");
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(name);
  return at < 0 ? fallback : args.splice(at, 2)[1];
};
const origin = option("--origin", "https://lernapps.net/apps/start");
const wait = Number(option("--wait", "600"));
if (args.length !== 1 || !Number.isFinite(wait)) {
  process.stderr.write("Usage: node scripts/verify-copies.mjs <plan json> [--origin <url>] [--wait <seconds>]\n");
  process.exit(2);
}
const plan = JSON.parse(args[0]);

/** id → commit, as the served copies.txt lists them. */
async function served() {
  try {
    const response = await fetch(`${origin}/copies.txt`, { cache: "no-store" });
    if (!response.ok) return new Map();
    return new Map((await response.text()).split("\n").map((line) => line.trim().split(/\s+/)));
  } catch {
    return new Map();
  }
}

const deadline = Date.now() + wait * 1000;
let pending = plan.build;
while (pending.length > 0 && Date.now() < deadline) {
  const live = await served();
  pending = pending.filter(({ id, commit }) => live.get(id) !== commit);
  if (pending.length > 0) await new Promise((done) => setTimeout(done, 15_000));
}
let failed = pending.length > 0;
for (const { id, commit } of pending) process.stderr.write(`verify-copies: ${id} at ${commit} is not served within ${wait} s\n`);

const dir = mkdtempSync(join(tmpdir(), "verify-"));
for (const { id } of plan.build.filter((app) => !pending.includes(app))) {
  const entry = load(readFileSync(join(root, "entries", `${id}.yaml`), "utf8"));
  // the name of the file is the id, as the checks read it (rule own-data-only)
  const file = join(dir, id, `${id}.yaml`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, dump({ ...entry, url: `${origin}/${id}/` }, { lineWidth: -1, noRefs: true }));
  const check = spawnSync(LERNAPPS, ["check", "--entry", file], { encoding: "utf8", timeout: 20 * 60_000 });
  process.stdout.write(`== ${id}: ${origin}/${id}/\n${check.stdout}`);
  if (check.status !== 0) {
    failed = true;
    process.stderr.write(check.stderr);
  }
}
process.exitCode = failed ? 1 : 0;
