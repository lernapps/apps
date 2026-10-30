// The apps that upgrade.yml moves to the pins of the tooling (job `plan`): the source of every catalog entry, or the one
// source named by hand. Reads files only; runs no code of an app.
//
//   node scripts/upgrade-plan.mjs [<source>]
//
// Prints one JSON array: [{ "id", "source", "owner", "repo" }]. The id is the entry's, and for a source named by hand the
// name of its repo. A source that is no https://github.com/<owner>/<repo> address is left out, with a notice on
// stderr, because owner and repo end up in a token request. Exit code 2 on wrong usage.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

const SOURCE = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/;

/** The app of a source address, or undefined when it is none. */
export function appOf(id, source) {
  const found = typeof source === "string" ? SOURCE.exec(source) : null;
  if (found === null) return undefined;
  return { id, source: `https://github.com/${found[1]}/${found[2]}`, owner: found[1], repo: found[2] };
}

/** The apps of the entries in `dir`, or the one source `only`; an app once, in the order of the entries. */
export function appsOf(dir, only, notice = () => {}) {
  if (only !== undefined) {
    const app = appOf(/^https:\/\/github\.com\/[\w.-]+\/([\w.-]+?)(?:\.git)?\/?$/.exec(only)?.[1], only);
    if (app === undefined) throw new Error(`${only} is no https://github.com/<owner>/<repo> address`);
    return [app];
  }
  const apps = new Map();
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".yaml")).sort()) {
    const id = file.replace(/\.yaml$/, "");
    const source = load(readFileSync(join(dir, file), "utf8"))?.source;
    const app = appOf(id, source);
    if (app === undefined) notice(`upgrade-plan: ${id}: source ${String(source)} is no GitHub repository address`);
    else if (!apps.has(app.source)) apps.set(app.source, app);
  }
  return [...apps.values()];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length > 1) {
    process.stderr.write("Usage: node scripts/upgrade-plan.mjs [<source>]\n");
    process.exit(2);
  }
  try {
    process.stdout.write(`${JSON.stringify(appsOf("entries", args[0] || undefined, (line) => process.stderr.write(`${line}\n`)))}\n`);
  } catch (error) {
    process.stderr.write(`upgrade-plan: ${error.message}\n`);
    process.exit(2);
  }
}
