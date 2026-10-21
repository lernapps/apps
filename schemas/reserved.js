// The ids an entry may not have (lernapps/apps plan KD-11): lernapps.net serves the copy of every listed app at
// https://lernapps.net/<id>/, in the root site (lernapps/lernapps.github.io), so an id may not be a top-level path of
// that site, nor the name of a repo of the organisation, which GitHub Pages may serve at the same path; except the
// repo that is the entry's own source (lernapps/elektrizitaet for the id elektrizitaet). Add a path or a repo here when
// the root site or the organisation gets a new one.
export const ROOT_SITE_PATHS = [
  "404.html", "CNAME", "about", "apple-touch-icon.png", "brand", "copies.txt", "en", "favicon.ico", "favicon.svg",
  "features", "imprint", "index.html", "join", "join.js", "lernapps-count.js", "lernapps-frame.css",
  "lernapps-tokens.css", "llms.txt", "pr-preview", "privacy", "uno.css",
];
export const ORGANISATION_REPOS = [
  ".github", "anorganische-chemie", "app-templates", "apps", "docs", "elektrizitaet", "lernapps.github.io", "map",
  "mathe-karte", "naturwunder-quiz", "pflanzen", "tooling",
];

/** Why `id` cannot be used by an entry with this `source`, or undefined when it can. */
export function reserved(id, source) {
  if (ROOT_SITE_PATHS.includes(id)) return `the id "${id}" is a path of the home page lernapps.net/${id}`;
  const own = typeof source === "string" && source.replace(/\.git$/, "").replace(/\/$/, "") === `https://github.com/lernapps/${id}`;
  if (ORGANISATION_REPOS.includes(id) && !own) return `the id "${id}" is the name of the repo lernapps/${id}`;
  return undefined;
}
