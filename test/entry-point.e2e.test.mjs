// The creator's entry point as a creator and their assistant meet it: the page /apps/eintragen/ and /apps/llms.txt,
// built from this repo.
//   - every link on them resolves: links into this site against the build, every other link on the web;
//   - the command the page gives to start an app, taken from the built page, run in an empty folder for every
//     archetype of the tooling it names, gives an app that passes `lernapps check`, the check of its git hooks and CI.
// Needs the network (github.com, codeload.github.com, the npm registry, lernapps.net). Behind a proxy, Node's fetch
// uses it with NODE_USE_ENV_PROXY=1.
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "/apps/";
const ORIGIN = "https://lernapps.net";

/** Runs a command and collects its output. */
function run(command, args, cwd, env = process.env) {
  return new Promise((done, fail) => {
    const child = spawn(command, args, { cwd, env });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("error", fail);
    child.on("close", (code) => done({ code, output }));
  });
}

async function ok(command, args, cwd, env) {
  const result = await run(command, args, cwd, env);
  assert.equal(result.code, 0, `${command} ${args.join(" ")} in ${cwd}:\n${result.output}`);
  return result.output;
}

const decode = (html) =>
  html
    .replace(/<[^>]+>/g, "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");

const temp = mkdtempSync(join(tmpdir(), "lernapps-entry-point-"));
after(() => rmSync(temp, { recursive: true, force: true }));

const out = join(temp, "site");
let page = "";
let llms = "";

before(async () => {
  // The site as `npm run build` writes it for production (no preview prefix), into a folder of its own.
  const { SITE_PATH_PREFIX: _prefix, SITE_PREVIEW: _preview, ...env } = process.env;
  await ok(join(repo, "node_modules/.bin/eleventy"), ["--quiet", "--output", out], repo, env);
  await ok(join(repo, "node_modules/.bin/unocss"), [`${out}/**/*.html`, "--out-file", join(out, "uno.css")], repo);
  page = readFileSync(join(out, "eintragen", "index.html"), "utf8");
  llms = readFileSync(join(out, "llms.txt"), "utf8");
});

/** Whether a link resolves: into this site against the build, anything else on the web, after redirects. */
async function resolves(url) {
  const own = url.startsWith(SITE) ? url : url.startsWith(`${ORIGIN}${SITE}`) ? url.slice(ORIGIN.length) : undefined;
  if (own !== undefined) {
    const path = decodeURIComponent(new URL(own, ORIGIN).pathname).slice(SITE.length);
    try {
      readFileSync(join(out, path.endsWith("/") || path === "" ? join(path, "index.html") : path));
      return "ok";
    } catch {
      return "not in the build";
    }
  }
  const target = new URL(url, ORIGIN);
  try {
    const response = await fetch(target, { redirect: "follow", signal: AbortSignal.timeout(30_000) });
    await response.body?.cancel();
    // A page that needs a GitHub account, such as a new issue from a form, sends a visitor to its sign-in page.
    if (response.url.startsWith("https://github.com/login?")) return "ok";
    return response.ok ? "ok" : `answers ${response.status}`;
  } catch (error) {
    return `cannot be fetched (${error.cause?.code ?? error.message})`;
  }
}

async function brokenLinks(urls) {
  const broken = [];
  for (const url of new Set(urls)) {
    const result = await resolves(url);
    if (result !== "ok") broken.push(`${url} ${result}`);
  }
  return broken;
}

const LINKS = { timeout: 180_000 };

describe("the creator's entry point", () => {
  test("every link on /apps/eintragen/ resolves", LINKS, async () => {
    const hrefs = [...page.matchAll(/\bhref="([^"]*)"/g)]
      .map((m) => m[1].replaceAll("&amp;", "&"))
      .filter((href) => href !== "" && !href.startsWith("#") && !href.startsWith("mailto:"));
    assert.ok(hrefs.length > 0);
    assert.deepEqual(await brokenLinks(hrefs), []);
  });

  test("every link in /apps/llms.txt resolves", LINKS, async () => {
    const links = [...llms.matchAll(/\]\((https:\/\/[^)\s]+)\)/g)].map((m) => m[1]);
    assert.ok(links.length > 0);
    assert.deepEqual(await brokenLinks(links), []);
  });

  test("the page and llms.txt link the skill lernapps-app as the quick path, and lead on to listing", () => {
    for (const text of [page, llms]) {
      assert.match(text, /skills\/lernapps-app\/SKILL\.md/);
      assert.match(text, /lernapps\.net\/tooling\/llms\.txt/);
    }
    assert.match(page, /href="#eintragen"/, "the page leads on from building to listing");
    assert.ok(llms.indexOf("## Eine App bauen") < llms.indexOf("## Eine App eintragen"));
  });
});

/** The command to start an app, as the built page shows it: the one `<code>` that runs `npx … create`. */
function startCommand() {
  const commands = new Set(
    [...page.matchAll(/<code\b[^>]*>([\s\S]*?)<\/code>/g)].map((m) => decode(m[1]).trim()).filter((c) => /^npx .* create /.test(c)),
  );
  assert.equal(commands.size, 1, `one command to start an app on the page, found: ${[...commands].join(" | ")}`);
  return [...commands][0];
}

describe("the command the entry point gives to start an app", () => {
  test("is the same in the prompt the creator copies and in llms.txt", () => {
    const command = startCommand();
    const prompt = decode(page.match(/<textarea\b[^>]*id="bauen-auftrag"[^>]*>([\s\S]*?)<\/textarea>/)?.[1] ?? "");
    assert.ok(prompt.includes(command), `the prompt to copy contains ${command}:\n${prompt}`);
    assert.ok(llms.includes(command), `llms.txt contains ${command}`);
  });

  test("run in an empty folder, gives an app that passes lernapps check, for every archetype", { timeout: 20 * 60_000 }, async () => {
    const command = startCommand();
    const words = command.split(/\s+/);
    assert.equal(words[0], "npx");
    // The archetypes of the tooling the command runs: its package.json at the same ref, on GitHub.
    const spec = words.find((word) => word.startsWith("github:"));
    const [, project, ref] = /^github:([^#]+)#(.+)$/.exec(spec ?? "") ?? [];
    assert.ok(project, `the command installs the tooling from GitHub: ${command}`);
    const manifest = await fetch(`https://raw.githubusercontent.com/${project}/${ref}/package.json`).then((r) => r.json());
    const archetypes = manifest.appTemplates.archetypes;
    assert.ok(archetypes.length > 0);

    for (const archetype of archetypes) {
      const app = join(temp, `app-${archetype}`);
      mkdirSync(app);
      // Optional arguments ([<dir>]) are left out: the app is written into the current folder.
      const args = words
        .slice(1)
        .filter((word) => !/^\[.*\]$/.test(word))
        .map((word) => (word === "<archetype>" ? archetype : word));
      assert.ok(!args.some((word) => word.includes("<")), `no placeholder left but the archetype: ${command}`);
      await ok("npx", args, app);
      // What the plan says next: git init, npm install (installs the hooks), then the check of hooks and CI.
      await ok("git", ["init", "--quiet", "--initial-branch=main"], app);
      await ok("npm", ["install", "--no-audit", "--no-fund"], app);
      const checked = await ok("npx", ["--no", "--", "lernapps", "check"], app);
      assert.match(checked, /lernapps check: ok/);
    }
  });
});
