# Upgrade of the listed apps (lernapps/tooling#163)

Goal: the listed apps follow the pins of the tooling without a person. Decision of the issue: option C, a workflow of
this catalog (`.github/workflows/upgrade.yml`) opens the update pull request in each app with the GitHub App
`lernapps-updater`; the app's own check is the gate; auto-merge merges where `main` requires a check, otherwise the workflow waits for the check and merges (no branch protection needed).

## Done

- `scripts/upgrade-plan.mjs`, `upgrade-message.mjs`, `upgrade-report.mjs`, tests in `test/upgrade.test.mjs`.
- Dry run of `lernapps update` on mrsimpson/mental-math and application of its patch to a fresh clone: works.

## Not done on purpose (YAGNI)

- No list of unlisted apps: a source is named by hand when the workflow is started.
- Marking out-of-date apps: lernapps/tooling#166.

## Known limit

`lernapps update` keeps the runtime commit when git cannot tell that it is older (the pin and the app's commit diverged);
its line says so in the pull request. The runtime then stays where it is.
