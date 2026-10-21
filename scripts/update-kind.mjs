// Whether an update of an app may be merged without a review (plan .vibe/development-plan-feat-serve-copies.md, KD-10):
// only when everything that changed between the entry's commit and the new one is the version of an npm dependency
// that already exists in a package.json, and the lock file moved with it. Anything else needs a review: any other file,
// an added or removed dependency, scripts, the licence. Reads files with git only; runs no code of the app.
//
//   node scripts/update-kind.mjs <app repo dir> <old commit> <new commit>
//
// Prints one JSON object { "kind": "dependencies" | "review", "reasons": [...] }: the reasons name what needs the
// review. Exit code 0 either way, 2 on wrong usage.
import { spawnSync } from "node:child_process";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";

const SECTIONS = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
const REGISTRY = "https://registry.npmjs.org/";

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const keys = (object) => Object.keys(object ?? {}).sort();

/** What differs between two package.json files beyond versions of existing dependencies. */
export function packageChanges(file, before, after) {
  const reasons = [];
  for (const key of new Set([...keys(before), ...keys(after)])) {
    if (SECTIONS.includes(key)) {
      if (!same(keys(before[key]), keys(after[key]))) reasons.push(`${file}: ${key}: a dependency was added or removed`);
    } else if (!same(before[key], after[key])) {
      reasons.push(`${file}: "${key}" changed`);
    }
  }
  return reasons;
}

/** What differs between two package-lock.json files beyond packages from the npm registry. */
export function lockChanges(file, before, after) {
  const reasons = [];
  for (const key of new Set([...keys(before), ...keys(after)])) {
    if (key !== "packages" && !same(before[key], after[key])) reasons.push(`${file}: "${key}" changed`);
  }
  const old = before.packages ?? {};
  const now = after.packages ?? {};
  for (const path of new Set([...keys(old), ...keys(now)])) {
    if (same(old[path], now[path])) continue;
    if (path === "") {
      reasons.push(...packageChanges(`${file} (root package)`, old[path] ?? {}, now[path] ?? {}));
      continue;
    }
    const entry = now[path];
    if (entry === undefined) continue; // a package no longer needed
    if (entry.link || typeof entry.resolved !== "string" || !entry.resolved.startsWith(REGISTRY) || !entry.integrity) {
      reasons.push(`${file}: ${path} does not come from ${REGISTRY}`);
    }
  }
  return reasons;
}

/** The kind of the update from `older` to `newer` in the git repo at `dir`. */
export function updateKind(dir, older, newer) {
  const git = (...args) => spawnSync("git", ["-C", dir, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const json = (commit, file) => {
    const shown = git("show", `${commit}:${file}`);
    if (shown.status !== 0) return undefined;
    try {
      return JSON.parse(shown.stdout);
    } catch {
      return null;
    }
  };
  const diff = git("diff", "--name-status", "--no-renames", older, newer);
  if (diff.status !== 0) return { kind: "review", reasons: [`git diff ${older} ${newer}: ${diff.stderr.trim()}`] };
  const reasons = [];
  let packages = 0;
  for (const line of diff.stdout.split("\n").filter(Boolean)) {
    const [status, file] = line.split("\t");
    const name = basename(file);
    if (status !== "M" || (name !== "package.json" && name !== "package-lock.json")) {
      reasons.push(`${file}: ${{ A: "added", D: "deleted" }[status] ?? "changed"}`);
      continue;
    }
    const before = json(older, file);
    const after = json(newer, file);
    if (!before || !after) {
      reasons.push(`${file}: not valid JSON`);
      continue;
    }
    if (name === "package.json") {
      packages++;
      reasons.push(...packageChanges(file, before, after));
    } else {
      reasons.push(...lockChanges(file, before, after));
    }
  }
  if (reasons.length === 0 && packages === 0) reasons.push("no package.json changed");
  return { kind: reasons.length === 0 ? "dependencies" : "review", reasons };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [dir, older, newer] = process.argv.slice(2);
  if (!dir || !older || !newer) {
    process.stderr.write("Usage: node scripts/update-kind.mjs <app repo dir> <old commit> <new commit>\n");
    process.exit(2);
  }
  process.stdout.write(`${JSON.stringify(updateKind(dir, older, newer))}\n`);
}
