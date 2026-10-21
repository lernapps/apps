// The copy of an app that lernapps.net serves (publish.yml, job `build`): takes the bundle out of a review input
// (scripts/review-input.mjs) when the build succeeded and the checks report no error.
//
//   node scripts/copy-bundle.mjs <review input dir> <target dir>
//
// Copies the bundle (app/<dist or _site>, or app/ for a repo that is its own bundle) to <target dir>, without
// symbolic links, `.git`, `node_modules` and top-level dotfiles (`.github`, `.vibe`, …). Exit code 0 when copied,
// 1 when the build failed or the checks report an error (it prints which), 2 on wrong usage.
import { cpSync, existsSync, lstatSync, readFileSync, readdirSync, mkdirSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { load } from "js-yaml";

const [input, target] = process.argv.slice(2);
if (!input || !target) {
  process.stderr.write("Usage: node scripts/copy-bundle.mjs <review input dir> <target dir>\n");
  process.exit(2);
}
const fail = (message) => {
  process.stderr.write(`copy-bundle: ${message}\n`);
  process.exit(1);
};

const meta = JSON.parse(readFileSync(join(input, "review.json"), "utf8"));
if (meta.state !== "ready") {
  const log = existsSync(join(input, "build.log")) ? `\n${readFileSync(join(input, "build.log"), "utf8").trim()}` : "";
  fail(`no copy of ${meta.repo} at ${meta.commit}: ${meta.state}${log}`);
}
const findings = load(readFileSync(join(input, "report.yaml"), "utf8"))?.findings ?? [];
const errors = findings.filter((finding) => finding?.severity === "error");
if (errors.length > 0) {
  const lines = errors.map((f) => `  - ${f.rule}: ${f.where}: ${f.found} (${f.link})`).join("\n");
  fail(`no copy of ${meta.repo} at ${meta.commit}: the checks report ${errors.length} error${errors.length === 1 ? "" : "s"}\n${lines}`);
}

const bundle = meta.bundle === "." ? join(input, "app") : join(input, "app", meta.bundle);
const keep = (source) => {
  const name = basename(source);
  if (lstatSync(source).isSymbolicLink() || name === ".git" || name === "node_modules") return false;
  return !(relative(bundle, source) === name && name.startsWith("."));
};
mkdirSync(target, { recursive: true });
for (const name of readdirSync(bundle)) {
  const source = join(bundle, name);
  if (keep(source)) cpSync(source, join(target, name), { recursive: true, filter: keep });
}
process.stdout.write(`copy-bundle: ${meta.repo} at ${meta.commit.slice(0, 7)} → ${target}\n`);
