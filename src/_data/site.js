// Settings of the site. The counter for thanks and clicks is deferred (README.md, "Counting thanks"):
// while LERNAPPS_COUNTER_URL is empty, the thanks block stays hidden ("steps aside quietly", D5 ch-feedback).
export default {
  origin: "https://lernapps.net",
  repo: "https://github.com/lernapps/apps",
  email: "lernapps@beimir.net",
  counter: process.env.LERNAPPS_COUNTER_URL ?? "",
  // Pull request previews (pr-preview.yml) set SITE_PATH_PREFIX and SITE_PREVIEW: banner, noindex.
  preview: Boolean(process.env.SITE_PREVIEW),
};
