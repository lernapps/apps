<!-- lernapps-review -->
## Review: fail, 3 Befunde (1 Fehler, 2 Hinweise)

Commit `256048440692edfd0337a8e47046c6a7425e0a00` von https://github.com/lernapps/bruch-trainer, Eintrag `entries/bruch-trainer.yaml`.

Der Review-Agent hat die App nach dem Review-Verfahren von lernapps/tooling beurteilt (`review/prompt.md`, die Rubrik `review/rubric.md` und die des Archetyps), ausgehend vom Prüfbericht, der keinen Fehler hat. Das Review entscheidet nichts und ändert nichts: Über den Eintrag entscheidet lernapps.net.

```text
Urteil:    fail
Archetyp:  explainer
Beurteilt: 12 Punkte der Rubrik
```

### Befunde

- [ ] [`no-ads`](https://lernapps.net/tooling/rules/#no-ads) (error)
  ```text
  Wo:        dist/kuerzen/index.html, aside "Anzeige"
  Gefunden:  An ad for paid tutoring, marked "Anzeige": "Nachhilfe-Profi: Mathe-Nachhilfe bei dir zu Hause. Die erste Stunde kostet 20 % weniger." with the link "Jetzt Nachhilfe buchen" to https://nachhilfe-profi.example/angebot. The retrospective says the assistant kept it because "no rule said so".
  Behebung:  Remove the aside with the ad and its link from the exercise page.
  Künftig:   check, skill
  ```
- [ ] [`few-turns-after-plan`](https://lernapps.net/tooling/rules/#few-turns-after-plan) (hint)
  ```text
  Wo:        .vibe/plan.md, "Key decisions"
  Gefunden:  The retrospective lists a guess ("Whether the creator's box on the exercise page may link to a paid offer: no rule said so, I kept it."), but "Key decisions" has no entry marked "(guess)" for it.
  Behebung:  Mark each guess "(guess)" under "Key decisions" when you make it, as well as listing it in the retrospective.
  ```
- [ ] [`correct-content-support`](https://lernapps.net/tooling/rules/#correct-content-support) (hint)
  ```text
  Wo:        dist/kuerzen/index.html, "Aufgabe 1" and "Aufgabe 2"
  Gefunden:  The exercises have computable answers ("Kürze 4/8 so weit wie möglich." → "1/2", "Kürze 6/9 so weit wie möglich." → "2/3"), but the repo has no test that checks them.
  Behebung:  Generate the exercises from data and add a unit test that checks each solution is the fully reduced fraction of the same value.
  ```

<details>
<summary>Das Urteil als YAML: gültig nach verdict.v1.schema.json</summary>

```yaml
reviewed:
  commit: 256048440692edfd0337a8e47046c6a7425e0a00
  repo: https://github.com/lernapps/bruch-trainer
  listing: https://github.com/lernapps/apps/pull/12
report: report.yaml
archetype: explainer
outcome: fail
rules:
  - runs-in-browser
  - no-account
  - free-of-charge
  - no-ads
  - learners-act
  - learner-text-german
  - no-learner-data-in-texts
  - no-tracking
  - third-party-licence
  - retrospective-filled
  - correct-content-support
  - topic-has-exercises
findings:
  - rule: no-ads
    link: https://lernapps.net/tooling/rules/#no-ads
    severity: error
    where: dist/kuerzen/index.html, aside "Anzeige"
    found: 'An ad for paid tutoring, marked "Anzeige": "Nachhilfe-Profi: Mathe-Nachhilfe bei dir zu Hause. Die erste Stunde kostet 20 % weniger." with the link "Jetzt Nachhilfe buchen" to https://nachhilfe-profi.example/angebot. The retrospective says the assistant kept it because "no rule said so".'
    fix: Remove the aside with the ad and its link from the exercise page.
    moveTo:
      - check
      - skill
  - rule: few-turns-after-plan
    link: https://lernapps.net/tooling/rules/#few-turns-after-plan
    severity: hint
    where: .vibe/plan.md, "Key decisions"
    found: 'The retrospective lists a guess ("Whether the creator''s box on the exercise page may link to a paid offer: no rule said so, I kept it."), but "Key decisions" has no entry marked "(guess)" for it.'
    fix: Mark each guess "(guess)" under "Key decisions" when you make it, as well as listing it in the retrospective.
  - rule: correct-content-support
    link: https://lernapps.net/tooling/rules/#correct-content-support
    severity: hint
    where: dist/kuerzen/index.html, "Aufgabe 1" and "Aufgabe 2"
    found: The exercises have computable answers ("Kürze 4/8 so weit wie möglich." → "1/2", "Kürze 6/9 so weit wie möglich." → "2/3"), but the repo has no test that checks them.
    fix: Generate the exercises from data and add a unit test that checks each solution is the fully reduced fraction of the same value.
at: '2026-10-09'
```

</details>

---
Ein Maintainer startet das Review mit dem Kommentar `/review` (der Kopf von `main` im Repo der App, ohne `main` der des Standard-Branchs) oder `/review <commit>`; es ersetzt diesen Kommentar.
Der Lauf: https://github.com/lernapps/apps/actions/runs/1
