// The listing validation of lernapps/apps (tooling docs/arc42 ch. 5, building block "Listing validation"): checks
// each entry against its deployed app and prints the listing results comment. The workflow listing.yml runs exactly
// this; a creator's assistant runs it in its clone, with the same result:
//
//   npm run --silent listing -- [--out <dir>] entries/<id>.yaml ...
//
// Per entry it runs `lernapps check --entry <file>` of @lernapps/tooling: the checks of the built app on the entry's
// url, the url and every topic link resolve, the fitness values match the measured ones. One rule is the catalog's
// own: fitness.checked may be true only when the check passes. The reports go to <dir>, one <id>.yaml each
// (default node_modules/.cache/lernapps/listing/). Exit code 0 when every entry passes, 1 when one fails, 2 on wrong
// usage.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dump, load } from "js-yaml";
import { render } from "./listing-comment.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LERNAPPS = join(root, "node_modules", ".bin", "lernapps");
const CACHE = join(root, "node_modules", ".cache", "lernapps", "listing");
const RULE_PAGE = "https://lernapps.net/tooling/rules/#";
const USAGE = "Usage: npm run --silent listing -- [--out <dir>] entries/<id>.yaml ...\n";

const finding = (rule, where, found, fix) => ({ rule, severity: "error", where, found, fix, link: `${RULE_PAGE}${rule}` });
const byPlace = (a, b) => a.rule.localeCompare(b.rule) || a.where.localeCompare(b.where) || a.found.localeCompare(b.found);

function usage(message) {
  process.stderr.write(`listing: ${message}\n\n${USAGE}`);
  process.exit(2);
}

/** The message of an uncaught error in Node's output: its first line after Node's own header. */
const crash = (stderr) =>
  stderr
    .replace(/\u001b\[[0-9;]*m/g, "")
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line !== "" && line !== "^" && !line.startsWith("node:internal") && !line.startsWith("triggerUncaughtException"));

/** The report of one entry: from `lernapps check`, or one finding when the check could not run. */
function check(file, out) {
  const report = join(out, `${basename(file, ".yaml")}.yaml`);
  const result = spawnSync(LERNAPPS, ["check", "--entry", file, "--report", report], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.stderr) process.stderr.write(result.stderr);
  if ((result.status === 0 || result.status === 1) && existsSync(report)) return load(readFileSync(report, "utf8"));
  // Exit code 2: the entry cannot be read (lernapps names why). Anything else: the check stopped on an error.
  const usage = result.status === 2;
  const why = usage
    ? (result.stderr.split("\n\n")[0] ?? "").replace(/^lernapps: /, "").trim()
    : (result.error?.message ?? crash(result.stderr) ?? `exit code ${result.status}`).trim();
  return {
    checked: { directory: process.cwd() },
    rules: ["checks-pass"],
    findings: [
      finding(
        "checks-pass",
        file,
        usage ? `lernapps check cannot read the entry: ${why}` : `lernapps check stopped: ${why}`,
        usage
          ? "Make the entry valid YAML with a url (format: https://lernapps.net/apps/schemas/entry.v1.schema.json), then check again"
          : "Make sure the app opens at the entry's url in a browser, then check again. If it stops again, open an issue in lernapps/tooling with this message",
      ),
    ],
    suppressions: [],
  };
}

/** The catalog's own rule: fitness.checked: true only from a passing report. */
function checkedFromPassing(file, report) {
  let entry;
  try {
    entry = load(readFileSync(file, "utf8"));
  } catch {
    return;
  }
  const errors = report.findings.filter((f) => f.severity === "error").length;
  if (entry?.fitness?.checked !== true || errors === 0) return;
  report.findings.push(
    finding(
      "entry-fitness-matches",
      `${file}: fitness.checked`,
      `the entry says checked: true, but the check fails (${errors} error${errors === 1 ? "" : "s"})`,
      "Set fitness.checked to false. lernapps.net sets it to true once the check passes",
    ),
  );
  report.findings.sort(byPlace);
  if (!report.rules.includes("entry-fitness-matches")) report.rules = [...report.rules, "entry-fitness-matches"].sort();
}

const args = process.argv.slice(2);
let out = CACHE;
const at = args.indexOf("--out");
if (at >= 0) {
  out = resolve(args[at + 1] ?? usage("--out needs a directory"));
  args.splice(at, 2);
  if (existsSync(out) && readdirSync(out).length > 0) usage(`--out ${out}: the directory must be new or empty`);
}
if (args.length === 0) usage("name at least one entry");
for (const file of args) {
  if (file.startsWith("-")) usage(`unknown option ${file}`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.yaml$/.test(basename(file))) usage(`${file}: an entry is entries/<id>.yaml, <id> in kebab-case`);
  if (!existsSync(file)) usage(`${file}: no such file`);
}

if (out === CACHE) rmSync(CACHE, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const file of args) {
  const report = check(file, out);
  checkedFromPassing(file, report);
  writeFileSync(join(out, `${basename(file, ".yaml")}.yaml`), dump(report, { lineWidth: -1, noRefs: true }));
}

const { text, passed } = render(out);
process.stdout.write(text);
process.exitCode = passed ? 0 : 1;
