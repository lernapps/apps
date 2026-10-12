// Settings of the site. Thanks and feedback go as prepared e-mails for the MVP (no server, no counter);
// counting with one click comes later (README.md, "Thanks and feedback").
export default {
  origin: "https://lernapps.net",
  repo: "https://github.com/lernapps/apps",
  email: "lernapps@beimir.net",
  thanksEmail: "Danke-lernapps@beimir.net",
  feedbackEmail: "Feedback-lernapps@beimir.net",
  // Building an app with the tooling (lernapps/tooling): its guide for assistants, the skill that is the quick path,
  // and the command that starts an app. The page /build/ and llms.txt show them; test/entry-point.e2e.test.mjs
  // runs the command from the built page.
  tooling: {
    llms: "https://lernapps.net/tooling/llms.txt",
    skill: "https://github.com/lernapps/tooling/blob/main/skills/lernapps-app/SKILL.md",
    skillRaw: "https://raw.githubusercontent.com/lernapps/tooling/main/skills/lernapps-app/SKILL.md",
    create: "npx --yes github:lernapps/tooling#main create --archetype <archetype>",
  },
  // Pull request previews (pr-preview.yml) set SITE_PATH_PREFIX and SITE_PREVIEW: banner, noindex.
  preview: Boolean(process.env.SITE_PREVIEW),
};
