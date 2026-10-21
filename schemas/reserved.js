// The ids an entry may not have (lernapps/apps plan KD-13): the catalog shows each app at
// https://lernapps.net/apps/<id>/ and lernapps.net serves its copy at https://lernapps.net/apps/start/<id>/, both in
// the site of this repo, so an id may not be another top-level path of that site. Add a path here when the site gets a
// new one.
export const SITE_PATHS = ["assets", "build", "en", "enter", "pr-preview", "schemas", "start"];

/** Why `id` cannot be used by an entry, or undefined when it can. */
export function reserved(id) {
  return SITE_PATHS.includes(id) ? `the id "${id}" is the path lernapps.net/apps/${id}/ of the catalog` : undefined;
}
