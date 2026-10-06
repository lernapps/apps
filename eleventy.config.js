// Builds src/ into _site/, served as https://lernapps.net/apps/ (GitHub Pages project site).
// Templates are Nunjucks; reusable parts are macros in src/_includes/components.njk.
// App entries come from entries/*.yaml via src/_data/catalog.js, which also checks them.
import de from "./src/_data/de.js";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("entries/");
  eleventyConfig.setServerOptions({ watch: ["_site/uno.css"] });

  // "Klasse 8", "Klasse 7 und 8", "Klasse 5 bis 7"
  eleventyConfig.addFilter("gradeLabel", (grades) => {
    const g = [...grades].sort((a, b) => a - b);
    if (g.length === 1) return de.grades.one(g[0]);
    if (g.length === 2 && g[1] === g[0] + 1) return de.grades.two(g[0], g[1]);
    return de.grades.range(g[0], g[g.length - 1]);
  });

  return {
    dir: { input: "src", output: "_site" },
    pathPrefix: "/apps/",
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
