// The commit message and the pull request of one upgrade (upgrade.yml, job `pull-request`), in the sections the apps'
// history uses (skill lernapps-commit): Intent, Key changes, Dependencies and side effects. The key changes are the lines
// `lernapps update` printed. The log comes from the job that ran the app's install scripts, so it is data: it is cut and
// put into the message as text, nothing more.
//
//   node scripts/upgrade-message.mjs <update log> <title file> <body file>
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const TITLE = "chore(deps): update the lernapps tooling and runtime";
const LIMIT = 4000;

/** The lines `lernapps update` printed, without its prefix and its hint for the next step, as list items. */
export function keyChanges(log) {
  const lines = log
    .split("\n")
    .filter((line) => line.startsWith("lernapps update: "))
    .map((line) => line.slice("lernapps update: ".length).trim())
    .filter((line) => line !== "");
  const list = lines.map((line) => `- ${line.replace(/[\u0000-\u001f]/g, " ")}`).join("\n");
  return list.length > LIMIT ? `${list.slice(0, LIMIT)}\n- …` : list;
}

export function body(log) {
  return `## Intent

Keep the app on the pins of the lernapps tooling, so that fixes of the runtime, the skills and the workflows reach it. Opened by the update workflow of lernapps/apps.

## Key changes

${keyChanges(log) || "- the pins moved to those of the tooling"}

## Dependencies and side effects

\`src/\`, the content, is not touched. The app's own check runs on this pull request; it merges only when the check is green.
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [log, title, text] = process.argv.slice(2);
  if (!log || !title || !text) {
    process.stderr.write("Usage: node scripts/upgrade-message.mjs <update log> <title file> <body file>\n");
    process.exit(2);
  }
  writeFileSync(title, `${TITLE}\n`);
  writeFileSync(text, body(readFileSync(log, "utf8")));
}
