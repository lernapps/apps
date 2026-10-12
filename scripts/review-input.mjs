// The review input of a listing pull request (.github/workflows/review.yml, the job `input`): steps 1 to 4 of the
// review procedure (lernapps/tooling review/prompt.md, "Prepare"), done where no secret is, so that the review agent
// builds and runs nothing:
//
//   node scripts/review-input.mjs --repo <git url or dir> --commit <full id> --out <dir> [--container <image>]
//                                 [--container-network <name>] entries/<id>.yaml
//
// It clones the app's repo, checks out the commit, builds the app (`npm ci && npm run build` when package.json has a
// build script; else the repo is its own bundle; with --container in a Docker container of that image) and runs `lernapps check <bundle> --entry <entry> --report` of
// @lernapps/tooling on the bundle. <dir> (new or empty) then holds what the agent reads, as the prompt's section
// "Prepared inputs" names it:
//
//   review.json         state (ready, build-failed, clone-failed, no-bundle), repo, commit, entry, bundle, build
//   entries/<id>.yaml   the entry
//   report.yaml         the validation report of the bundle (state ready)
//   history.txt         `git log` of the commit: ids, dates and messages
//   app/                the bundle where the build wrote it (app/dist/...), .vibe/plan.md, package.json, lock file
//   build.log           the end of the build's output (state build-failed)
//
// The app's code is untrusted: this runs it, so the workflow runs this in a job with a read-only token and no secrets,
// and builds in a container (--container): the app's code then cannot reach the runner, its files or processes, and so
// not the token the job's actions use for artifacts and caches either. Only the build's files come out, never a
// symbolic link. (Proxy variables and NODE_EXTRA_CA_CERTS are passed into the container when set; behind a proxy on
// 127.0.0.1, give --container-network host.) Exit code 0 when <dir> holds a review input (also one that says the build failed),
// 1 when the repo or the commit cannot be read or there is no bundle, 2 on wrong usage.
import { spawnSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dump, load } from "js-yaml";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LERNAPPS = join(root, "node_modules", ".bin", "lernapps");
const USAGE =
  "Usage: node scripts/review-input.mjs --repo <git url or dir> --commit <full id> --out <dir> [--container <image>] [--container-network <name>] entries/<id>.yaml\n";
const BUNDLES = ["dist", "_site"];
const LOCKS = ["package-lock.json", "npm-shrinkwrap.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb"];
const MINUTES = 60_000;
const LOG_TAIL = 20_000;

function usage(message) {
  process.stderr.write(`review-input: ${message}\n\n${USAGE}`);
  process.exit(2);
}

const args = process.argv.slice(2);
const option = (name) => {
  const at = args.indexOf(name);
  if (at < 0) return undefined;
  const [, value] = args.splice(at, 2);
  if (value === undefined) usage(`${name} needs a value`);
  return value;
};
const repo = option("--repo") ?? usage("name the app's repo with --repo");
const commit = option("--commit") ?? usage("name the commit with --commit");
const out = resolve(option("--out") ?? usage("name the output directory with --out"));
const container = option("--container");
const network = option("--container-network") ?? "bridge";
if (!/^[0-9a-f]{40}$/.test(commit)) usage(`--commit ${commit}: the full id of a commit, 40 hex digits`);
if (args.length !== 1 || args[0].startsWith("-")) usage("name exactly one entry");
const entryFile = args[0];
const id = basename(entryFile, ".yaml");
if (!/^[a-z0-9]+(-[a-z0-9]+)*\.yaml$/.test(basename(entryFile))) usage(`${entryFile}: an entry is entries/<id>.yaml`);
if (!existsSync(entryFile)) usage(`${entryFile}: no such file`);
if (existsSync(out) && readdirSync(out).length > 0) usage(`--out ${out}: the directory must be new or empty`);

mkdirSync(join(out, "entries"), { recursive: true });
copyFileSync(entryFile, join(out, "entries", `${id}.yaml`));
const meta = { state: "clone-failed", repo, commit, entry: `entries/${id}.yaml` };
const save = () => writeFileSync(join(out, "review.json"), `${JSON.stringify(meta, null, 2)}\n`);
save();

const work = mkdtempSync(join(tmpdir(), "lernapps-review-input-"));
process.on("exit", () => rmSync(work, { recursive: true, force: true }));
const app = join(work, "app");
const quiet = { encoding: "utf8", env: { ...process.env, GIT_TERMINAL_PROMPT: "0" }, maxBuffer: 64 * 1024 * 1024 };

/** Runs git; its output, or undefined (with the error on stderr) when it fails. */
function git(gitArgs, cwd = app) {
  const result = spawnSync("git", gitArgs, { ...quiet, cwd });
  if (result.status === 0) return result.stdout;
  process.stderr.write(`review-input: git ${gitArgs.join(" ")}: ${result.stderr || result.error?.message || `exit code ${result.status}`}\n`);
  return undefined;
}

// 1, 2: the repo at the commit, and its history.
if (
  git(["clone", "--quiet", "--no-checkout", "--filter=blob:none", "--", repo, app], work) === undefined ||
  git(["-c", "advice.detachedHead=false", "checkout", "--quiet", commit]) === undefined ||
  git(["rev-parse", "HEAD"])?.trim() !== commit
) {
  process.exit(1);
}
// Before any code of the app runs: after the build, no git command runs in the clone (the build can change .git/config).
writeFileSync(join(out, "history.txt"), git(["log", "-n", "50", "--format=commit %H%nDate:   %cs%n%n%w(0,4,4)%B"]) ?? "");

/** Runs npm in the app's repo: on this machine, or in a container of the image --container names. */
function npm(step) {
  if (container === undefined) return spawnSync("npm", step, { ...quiet, cwd: app, timeout: 20 * MINUTES });
  const name = `lernapps-review-build-${process.pid}`;
  const proxy = ["HTTPS_PROXY", "HTTP_PROXY", "NO_PROXY", "https_proxy", "http_proxy", "no_proxy"].filter((key) => process.env[key]);
  const ca = process.env.NODE_EXTRA_CA_CERTS;
  const caArgs = ca && existsSync(ca) ? ["-v", `${ca}:/etc/lernapps-ca.crt:ro`, "-e", "NODE_EXTRA_CA_CERTS=/etc/lernapps-ca.crt", "-e", "npm_config_cafile=/etc/lernapps-ca.crt"] : [];
  const dockerArgs = [
    ["run", "--rm", "--name", name, "--network", network, "--cap-drop", "ALL", "--security-opt", "no-new-privileges"],
    ["--user", `${process.getuid()}:${process.getgid()}`, "-e", "HOME=/tmp", "-e", "CI=true", ...proxy.flatMap((key) => ["-e", key]), ...caArgs],
    ["-v", `${app}:/app`, "-w", "/app", container, "npm", ...step],
  ].flat();
  const result = spawnSync("docker", dockerArgs, { ...quiet, timeout: 20 * MINUTES });
  if (result.status !== 0) spawnSync("docker", ["rm", "--force", name], { stdio: "ignore" });
  return result;
}

// 3: the bundle.
let manifest;
try {
  manifest = JSON.parse(readFileSync(join(app, "package.json"), "utf8"));
} catch {
  manifest = undefined;
}
const tail = (text) => (text.length > LOG_TAIL ? `…\n${text.slice(-LOG_TAIL)}` : text);
if (typeof manifest?.scripts?.build === "string") {
  let log = "";
  for (const step of [["ci"], ["run", "build"]]) {
    log += `$ npm ${step.join(" ")}\n`;
    const result = npm(step);
    log += `${result.stdout ?? ""}${result.stderr ?? ""}`;
    if (result.status !== 0) {
      log += `\nnpm ${step.join(" ")} failed: ${result.error?.message ?? `exit code ${result.status}`}\n`;
      meta.state = "build-failed";
      meta.build = "failed";
      writeFileSync(join(out, "build.log"), tail(log));
      save();
      process.exit(0);
    }
  }
  meta.build = "ok";
  meta.bundle = BUNDLES.find((dir) => existsSync(join(app, dir, "index.html")));
} else {
  meta.build = "none";
  meta.bundle = existsSync(join(app, "index.html")) ? "." : undefined;
}
if (meta.bundle === undefined) {
  meta.state = "no-bundle";
  save();
  process.stderr.write(`review-input: no bundle: no index.html in ${meta.build === "ok" ? BUNDLES.join(" or ") : "the repo"}\n`);
  process.exit(1);
}

// What the agent reads, below app/ as below the app's repo; never a symbolic link, the git directory or node_modules.
const files = (source) => {
  const name = basename(source);
  return !lstatSync(source).isSymbolicLink() && name !== ".git" && name !== "node_modules";
};
const target = join(out, "app");
mkdirSync(target, { recursive: true });
if (meta.bundle === ".") {
  cpSync(app, target, { recursive: true, filter: files });
} else {
  cpSync(join(app, meta.bundle), join(target, meta.bundle), { recursive: true, filter: files });
  for (const file of [".vibe/plan.md", "package.json", ...LOCKS]) {
    const source = join(app, file);
    if (existsSync(source) && files(source)) {
      mkdirSync(dirname(join(target, file)), { recursive: true });
      copyFileSync(source, join(target, file));
    }
  }
}

// 4: the checks of the bundle, with the entry.
const bundle = meta.bundle === "." ? "app" : `app/${meta.bundle}`;
const check = spawnSync(LERNAPPS, ["check", bundle, "--entry", meta.entry, "--report", "report.yaml"], { ...quiet, cwd: out, timeout: 20 * MINUTES });
if (check.stderr) process.stderr.write(check.stderr);
if (!((check.status === 0 || check.status === 1) && existsSync(join(out, "report.yaml")))) {
  // The check stopped on an error: a report with one finding that says so, as the listing validation writes it.
  const why = (check.error?.message ?? check.stderr.trim().split("\n").at(-1) ?? `exit code ${check.status}`).trim() || `exit code ${check.status}`;
  const report = {
    checked: { bundle },
    rules: ["checks-pass"],
    findings: [
      {
        rule: "checks-pass",
        severity: "error",
        where: `lernapps check ${bundle} --entry ${meta.entry}`,
        found: `lernapps check stopped: ${why}`,
        fix: "Run lernapps check on the built app; if it stops again, open an issue in lernapps/tooling with this message",
        link: "https://lernapps.net/tooling/rules/#checks-pass",
      },
    ],
    suppressions: [],
  };
  writeFileSync(join(out, "report.yaml"), dump(report, { lineWidth: -1, noRefs: true }));
}
meta.state = "ready";
save();
const errors = (load(readFileSync(join(out, "report.yaml"), "utf8"))?.findings ?? []).filter((f) => f?.severity === "error").length;
process.stdout.write(`review-input: ${repo} at ${commit.slice(0, 7)}, bundle ${bundle}, ${errors} error${errors === 1 ? "" : "s"} in the checks\n`);
