// Checks the build output in _site/ (run `npm run build` first) before deploy:
// - no external resources (scripts, styles, images, frames, fonts) in HTML or CSS
// - every link to this site (/apps/… or relative) points to an existing file
// - every page links the privacy notice and the imprint (required on every page)
// Adapted from lernapps.github.io; replaced by @lernapps/checks once tooling has it.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const ROOT = resolve(process.argv[2] ?? "_site");
const PREFIX = "/apps/"; // this repo is served at https://lernapps.net/apps/
const OWN_ORIGIN = "https://lernapps.net/";
const errors = [];

if (!existsSync(join(ROOT, "index.html"))) {
  console.error(`${ROOT}/index.html missing – run \`npm run build\` first`);
  process.exit(1);
}

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]));
const isExternal = (url) => /^(https?:)?\/\//i.test(url) && !url.startsWith(OWN_ORIGIN);
const exists = (p) => existsSync(p) && (statSync(p).isFile() || existsSync(join(p, "index.html")));

for (const file of files(ROOT)) {
  const text = readFileSync(file, "utf8");
  const rel = file.slice(ROOT.length + 1);

  if (file.endsWith(".html")) {
    for (const m of text.matchAll(/<(script|img|iframe|source|audio|video|embed)\b[^>]*\bsrc="([^"]*)"/gi)) {
      if (isExternal(m[2])) errors.push(`${rel}: external resource <${m[1]} src="${m[2]}">`);
    }
    for (const m of text.matchAll(/<link\b[^>]*\bhref="([^"]*)"/gi)) {
      if (isExternal(m[1]) && !/rel="canonical"/i.test(m[0])) errors.push(`${rel}: external <link href="${m[1]}">`);
    }
    for (const m of text.matchAll(/\b(?:href|src)="([^"#?]*)[^"]*"/gi)) {
      const url = m[1];
      if (!url || /^[a-z]+:/i.test(url) || url.startsWith("//")) continue;
      if (url.startsWith("/") && !url.startsWith(PREFIX)) continue; // other repo on the same origin
      const target = url.startsWith(PREFIX) ? join(ROOT, url.slice(PREFIX.length)) : join(dirname(file), url);
      if (!exists(target)) errors.push(`${rel}: broken link "${url}"`);
    }
    for (const legal of ['href="/privacy/"', 'href="/imprint/"']) {
      if (!text.includes(legal)) errors.push(`${rel}: missing link ${legal}`);
    }
  }

  if (file.endsWith(".css")) {
    for (const m of text.matchAll(/url\(\s*["']?([^"')]+)/gi)) {
      if (isExternal(m[1])) errors.push(`${rel}: external url(${m[1]})`);
    }
    if (/@import/i.test(text)) errors.push(`${rel}: @import is not allowed`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`check: ${ROOT} ok`);
