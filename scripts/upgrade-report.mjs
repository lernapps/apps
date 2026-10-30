// What the daily upgrade left behind (upgrade.yml, job `report`): one line per app, and the text of the collecting issue
// about the apps the updater cannot move on its own.
//
//   node scripts/upgrade-report.mjs <results dir> <summary file> <issue file>
//
// Reads every result-<id>/result.json of the directory. Writes the table for the job summary, and the body of the issue
// (an empty file when no app needs a person). Exit code 2 on wrong usage.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** The statuses, and whether an app with it needs a person: the updater cannot reach it, or cannot merge on its own. */
export const STATUS = {
  uptodate: { text: "up to date", person: false },
  opened: { text: "pull request opened or updated", person: false },
  unchanged: { text: "pull request already up to date", person: false },
  declined: { text: "pull request closed by a person for this update: left alone", person: false },
  "not-installed": { text: "the GitHub App lernapps-updater is not installed on this repo", person: true },
  merged: { text: "pull request merged after a green check", person: false },
  "check-failed": { text: "the app's check is red on the pull request, or did not finish: a person or an assistant fixes it there", person: true },
  "no-checks": { text: "no check ran on the pull request: the app's workflow must run on pull requests", person: true },
  "merge-failed": { text: "the pull request could not be merged: see the log of the run", person: true },
  "update-failed": { text: "lernapps update failed: see the log of the run", person: true },
  error: { text: "no result: see the log of the run", person: false },
};

const cell = (value) => String(value).replace(/\|/g, "\\|").replace(/\s+/g, " ");

export function summary(results) {
  const rows = results.map((r) => `| ${cell(r.id)} | ${cell(STATUS[r.status]?.text ?? r.status)} | ${r.pull ? cell(r.pull) : ""} |`);
  return `## Upgrade of the apps\n\n| App | Result | Pull request |\n|---|---|---|\n${rows.join("\n")}\n`;
}

/** The body of the collecting issue; empty when no app needs a person. */
export function issueBody(results, run) {
  const open = results.filter((r) => STATUS[r.status]?.person);
  if (open.length === 0) return "";
  const lines = open.map((r) => `- [${r.owner}/${r.repo}](${r.source}): ${STATUS[r.status].text}`);
  return `The daily upgrade (${run}) could not move these listed apps on its own. This issue is rewritten by every run and closed when the list is empty.

${lines.join("\n")}

How to fix: the owner installs the GitHub App \`lernapps-updater\` on the app's repo.
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [dir, summaryFile, issueFile] = process.argv.slice(2);
  if (!dir || !summaryFile || !issueFile) {
    process.stderr.write("Usage: node scripts/upgrade-report.mjs <results dir> <summary file> <issue file>\n");
    process.exit(2);
  }
  const results = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("result-"))
    .map((entry) => JSON.parse(readFileSync(join(dir, entry.name, "result.json"), "utf8")))
    .sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(summaryFile, summary(results));
  writeFileSync(issueFile, issueBody(results, process.env.RUN_URL ?? "a run"));
}
