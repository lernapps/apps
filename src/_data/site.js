// Settings of the site. Thanks and feedback go as prepared e-mails for the MVP (no server, no counter);
// counting with one click comes later (README.md, "Thanks and feedback").
export default {
  origin: "https://lernapps.net",
  repo: "https://github.com/lernapps/apps",
  email: "lernapps@beimir.net",
  thanksEmail: "Danke-lernapps@beimir.net",
  feedbackEmail: "Feedback-lernapps@beimir.net",
  // Pull request previews (pr-preview.yml) set SITE_PATH_PREFIX and SITE_PREVIEW: banner, noindex.
  preview: Boolean(process.env.SITE_PREVIEW),
};
