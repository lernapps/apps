// Builds src/ into _site/, served as https://lernapps.net/apps/ (GitHub Pages project site).
// Templates are Nunjucks; reusable parts are macros in src/_includes/components.njk.
// App entries come from entries/*.yaml via src/_data/catalog.js, which also checks them.
// Header, footer and the deploy check are shared by every lernapps.net site (@lernapps/site, from
// lernapps.github.io; Renovate keeps it current).
import chrome from "@lernapps/site/eleventy";
import de from "./src/_data/de.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(chrome, { site: "/apps/", source: "https://github.com/lernapps/apps" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "schemas/entry.v1.schema.json": "schemas/entry.v1.schema.json" });
  eleventyConfig.addWatchTarget("schemas/");
  eleventyConfig.addWatchTarget("entries/");
  eleventyConfig.setServerOptions({ watch: ["_site/uno.css"] });

  // "Klasse 8", "Klasse 7 und 8", "Klasse 5 bis 7"
  eleventyConfig.addFilter("gradeLabel", (grades) => {
    const g = [...grades].sort((a, b) => a - b);
    if (g.length === 1) return de.grades.one(g[0]);
    if (g.length === 2 && g[1] === g[0] + 1) return de.grades.two(g[0], g[1]);
    return de.grades.range(g[0], g[g.length - 1]);
  });

  // A mailto link with subject and body (thanks and feedback for the MVP).
  eleventyConfig.addFilter("mailto", (address, subject, body) =>
    `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  );

  return {
    dir: { input: "src", output: "_site" },
    // /apps/ in production; /apps/pr-preview/pr-<number>/ for a pull request preview (pr-preview.yml).
    pathPrefix: process.env.SITE_PATH_PREFIX ?? "/apps/",
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
