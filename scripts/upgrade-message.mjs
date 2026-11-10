// The commit message and the pull request of one upgrade (upgrade.yml, job `pull-request`), in the sections the apps'
// history uses (skill lernapps-commit): Intent, Key changes, Dependencies and side effects. The key changes are the lines
// `lernapps update` printed. The log comes from the job that ran the app's install scripts, so it is data: it is cut and
// put into the message as text, nothing more. The lines `breaking: …` (what the app must change itself after the
// update) come first, in their own section, and mark the title with `!`.
//
//   node scripts/upgrade-message.mjs <update log> <title file> <body file>
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const TITLE = "chore(deps): update the lernapps tooling and runtime";
const LIMIT = 4000;

const BREAKING = "breaking: ";

/** The lines `lernapps update` printed, without its prefix and its hint for the next step. */
function updateLines(log) {
  return log
    .split("\n")
    .filter((line) => line.startsWith("lernapps update: "))
    .map((line) => line.slice("lernapps update: ".length).trim().replace(/[\u0000-\u001f]/g, " "))
    .filter((line) => line !== "");
}

/** The lines as list items, cut at the limit. */
function list(lines) {
  const text = lines.map((line) => `- ${line}`).join("\n");
  return text.length > LIMIT ? `${text.slice(0, LIMIT)}\n- …` : text;
}

/** What the app must change itself after the update: the lines `breaking: …`, as list items. */
export function breaking(log) {
  return list(updateLines(log).filter((line) => line.startsWith(BREAKING)).map((line) => line.slice(BREAKING.length)));
}

/** Everything else `lernapps update` printed, as list items. */
export function keyChanges(log) {
  return list(updateLines(log).filter((line) => !line.startsWith(BREAKING)));
}

/** The title: with `!` when the app must change something itself. */
export function title(log) {
  return breaking(log) ? TITLE.replace("chore(deps):", "chore(deps)!:") : TITLE;
}

export function body(log) {
  const changes = breaking(log);
  const first = changes
    ? `## Breaking changes

The app must change this itself; until it does, its check may be red:

${changes}

`
    : "";
  return `${first}## Intent

Keep the app on the pins of the lernapps tooling, so that fixes of the runtime, the skills and the workflows reach it. Opened by the update workflow of lernapps/apps.

## Key changes

${keyChanges(log) || "- the pins moved to those of the tooling"}

## Dependencies and side effects

\`src/\`, the content, is not touched. The app's own check runs on this pull request; it merges only when the check is green.
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [log, titleFile, text] = process.argv.slice(2);
  if (!log || !titleFile || !text) {
    process.stderr.write("Usage: node scripts/upgrade-message.mjs <update log> <title file> <body file>\n");
    process.exit(2);
  }
  writeFileSync(titleFile, `${title(readFileSync(log, "utf8"))}\n`);
  writeFileSync(text, body(readFileSync(log, "utf8")));
}
