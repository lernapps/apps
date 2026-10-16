// Data of every page: its language (from its address: English below /en/) and the texts in that language.
import languages from "./_data/languages.js";

const langOf = (data) => (data.page.url.startsWith("/en/") ? "en" : "de");

export default {
  eleventyComputed: {
    lang: langOf,
    t: (data) => languages.find((l) => l.code === langOf(data)).t,
  },
};
