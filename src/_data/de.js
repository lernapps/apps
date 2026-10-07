// All texts of lernapps.net/apps/ (German). Templates contain no copy of their own.
// The pages follow the experiences of the platform design (https://lernapps.net/docs/platform-design/, D7):
//   x-app-in-minutes      a teacher, minutes before a lesson: find, see it may be used, bring it to class, thank
//   x-practice-tonight    a parent, the evening before a test: find, start right away, thank
//   x-list-and-hear-back  a creator: list the app in minutes, hear that it helped
// Language: plain German (ISO 24495-1): short sentences, active voice, no jargon, "du".
const de = {
  meta: {
    siteName: "lernapps.net",
    skipLink: "Zum Inhalt springen",
    preview: "Vorschau einer Änderung. Die echte Seite:",
  },

  nav: {
    ariaLabel: "Hauptnavigation",
    homeLabel: "lernapps.net – Startseite",
    links: [
      // path: a page of this site (gets the path prefix); href: elsewhere on lernapps.net
      { label: "Apps finden", path: "/" },
      { label: "App eintragen", path: "/eintragen/" },
      { label: "Über lernapps.net", href: "/" },
    ],
  },

  footer: {
    free: "lernapps.net ist kostenlos und ohne Werbung. Es lebt von deinem Danke.",
    links: [
      { label: "Datenschutz", href: "/privacy/" },
      { label: "Impressum", href: "/imprint/" },
      { label: "Wie lernapps.net gedacht ist", href: "/docs/platform-design/" },
      { label: "Quellcode", href: "https://github.com/lernapps/apps" },
    ],
  },

  // Words for the data of an entry.
  grades: {
    one: (g) => `Klasse ${g}`,
    two: (a, b) => `Klasse ${a} und ${b}`,
    range: (a, b) => `Klasse ${a} bis ${b}`,
  },

  // ── Finden (x-app-in-minutes, x-practice-tonight: s-finding, t-find-app) ─────────────
  find: {
    title: "Lern-Apps finden · lernapps.net",
    description:
      "Finde eine Lern-App für deine nächste Stunde oder für heute Abend: kostenlos, ohne Anmeldung, sofort startklar.",
    headline: "Eine Lern-App für deine nächste Stunde",
    lead: "Kostenlos, ohne Anmeldung, sofort startklar. Such nach Thema und Klasse.",
    parents: "Morgen ist eine Arbeit? Dein Kind kann heute Abend am Küchentisch sofort loslegen.",
    form: {
      label: "Suche",
      query: "Thema",
      queryPlaceholder: "z. B. Prozent oder Baumdiagramm",
      subject: "Fach",
      allSubjects: "Alle Fächer",
      grade: "Klasse",
      allGrades: "Alle Klassen",
    },
    count: { none: "Keine App gefunden", one: "1 App", many: (n) => `${n} Apps` },
    matched: "Passt zu deiner Suche:",
    empty: {
      headline: "Dazu gibt es hier noch keine App.",
      body: "lernapps.net fängt gerade erst an. Kennst du eine passende App, oder hast du selbst eine gebaut?",
      link: "App eintragen",
    },
    trust: {
      headline: "Welche Apps hier stehen",
      body:
        "Hier stehen nur Apps, die im Browser laufen, ohne Anmeldung und ohne Installation. Sie sind kostenlos, ohne Werbung und sammeln nichts heimlich. Darum kannst du sie einsetzen, ohne lange zu prüfen.",
      link: "Was wir genau verlangen",
    },
    cardLink: (title) => `Mehr zu ${title}`,
  },

  // ── App-Seite (x-app-in-minutes: s-fitness-clarity … t-thank-creator-adult, t-give-feedback) ──
  app: {
    title: (name) => `${name} · lernapps.net`,
    by: "Gebaut von",
    open: "App öffnen",
    openHint: "Öffnet sich in einem neuen Tab. Diese Seite bleibt offen.",

    topics: {
      headline: "Direkt zu einem Thema",
      body: "Jeder Link führt genau zu diesem Thema in der App.",
    },

    fitness: {
      headline: "Darfst du sie einsetzen?",
      lead: "Das Wichtigste auf einen Blick:",
      account: "Ohne Anmeldung: Niemand braucht ein Konto.",
      install: "Ohne Installation: Die App läuft im Browser, auf jedem Gerät.",
      free: "Kostenlos und ohne Werbung.",
      storage: {
        none: "Die App speichert nichts.",
        device: "Was man eingibt, bleibt auf dem Gerät. Die App merkt sich höchstens den Lernstand im Browser.",
      },
      thirdParty: {
        none: "Keine Verbindung zu fremden Servern.",
        "on-click": (note) => `Fremde Server nur nach einem Klick. ${note}`,
      },
      unchecked:
        "Das sind die Angaben der App. Eine automatische Prüfung bauen wir gerade.",
      checked: "lernapps.net hat diese Angaben automatisch geprüft.",
    },

    bring: {
      headline: "So kommt die App in deine Klasse",
      linkLabel: "Link für deine Klasse",
      copy: "Link kopieren",
      copied: "Kopiert",
      qrLabel: "Zum Scannen mit Tablets oder Handys",
      qrAlt: (name) => `QR-Code für ${name}`,
      tips: [
        "Am Beamer: App öffnen und auf Vollbild schalten.",
        "Auf den Geräten der Klasse: Link teilen oder QR-Code zeigen.",
        "Zu Hause: Schick deinem Kind den Link. Es braucht kein Konto.",
      ],
    },

    // The thank-you is a step of its own in every journey (D7). For the MVP it goes as a prepared e-mail
    // (mailto, no server); counting with one click comes later. Explained right where the click happens.
    thanks: {
      headline: "Hat die App geholfen?",
      body: (creator) =>
        `lernapps.net ist kostenlos. Dein Danke geht an ${creator}. Es zeigt, dass die App hilft. Und es hält lernapps.net am Leben.`,
      how: "Ein Klick öffnet dein E-Mail-Programm mit einer fertigen Nachricht. Du musst sie nur noch abschicken.",
      thank: "Danke sagen",
      usedHeadline: "Wo hast du sie genutzt?",
      used: [
        { key: "unterricht", label: "Im Unterricht" },
        { key: "zuhause", label: "Zu Hause" },
      ],
      feedbackHeadline: "Wie lief es?",
      feedback: [
        { key: "gut", label: "Hat gut gepasst" },
        { key: "zu-schwer", label: "War zu schwer" },
        { key: "zu-leicht", label: "War zu leicht" },
        { key: "technik", label: "Hat technisch gehakt" },
      ],
      opened: "Danke! Schick die E-Mail ab, dann kommt sie an.",
      noMail: { before: "Kein E-Mail-Programm? Schreib einfach an", thanks: "(Danke)", or: "oder", feedback: "(Rückmeldung)." },
      privacy:
        "Bis wir Klicks zählen, kommt dein Danke als E-Mail bei uns an. Dabei sehen wir deine E-Mail-Adresse. Wir nutzen sie nur dafür.",
      privacyLink: "Mehr dazu",
      reminder: "Zurück aus der App? Sag Danke, wenn sie geholfen hat.",
      reminderLink: "Zum Danke",
    },

    // The prepared e-mails. The note says why it is an e-mail for now (D8 a-thanks-arrive-unexplained:
    // the platform explains the thanks itself, nobody else does).
    mail: {
      thanksSubject: (app) => `Danke für „${app}“`,
      thanksBody: (app, creator, page) =>
        `Danke für „${app}“!\n\n(Hier kannst du noch etwas dazuschreiben. Du musst aber nicht.)\n\n` +
        `App: ${page}\n\n` +
        `– Hinweis von lernapps.net –\nSpäter sagst du Danke mit einem Klick, ganz ohne E-Mail. Wir zählen es dann nur als Summe. ` +
        `Diese E-Mail hilft uns jetzt nur zu testen, ob das Danke ankommt. Wir geben dein Danke an ${creator} weiter.`,
      usedSubject: (app, where) => `Genutzt: ${where} – „${app}“`,
      feedbackSubject: (app, label) => `Rückmeldung zu „${app}“: ${label}`,
      feedbackBody: (line, page) =>
        `${line}\n\n(Wenn du magst: Was genau? Du musst aber nichts dazuschreiben.)\n\n` +
        `App: ${page}\n\n` +
        `– Hinweis von lernapps.net –\nSpäter gibst du Rückmeldung mit einem Klick, ganz ohne E-Mail. ` +
        `Diese E-Mail hilft uns jetzt nur zu testen, ob Rückmeldungen ankommen.`,
      wave: "Empfehlung:", // + the referral code, added by assets/app.js
    },

    creator: {
      headline: "Wer die App gebaut hat",
      source: "Quellcode ansehen",
      own: "Du hast selbst eine Lern-App gebaut?",
      ownLink: "Trag sie ein",
    },
    back: "Alle Apps",
  },

  // ── Eintragen (x-list-and-hear-back: s-listing-help, t-list-app, s-use-insight) ──────
  list: {
    title: "App eintragen · lernapps.net",
    description:
      "Du hast eine Lern-App gebaut? Trag sie in wenigen Minuten auf lernapps.net ein. Dann finden andere sie, und du erfährst, wenn sie geholfen hat.",
    headline: "Du hast eine Lern-App gebaut?\nTrag sie ein.",
    lead:
      "Das dauert ein paar Minuten. Danach finden Lehrkräfte und Eltern deine App. Und du erfährst, wenn sie geholfen hat.",
    criteria: {
      headline: "Was wir aufnehmen",
      items: [
        "Die App läuft im Browser, ohne Installation.",
        "Niemand braucht ein Konto.",
        "Sie ist kostenlos und ohne Werbung.",
        "Sie sammelt nichts heimlich: keine Analyse-Dienste, keine Werbe-Netzwerke. Fremde Server lädt sie höchstens nach einem Klick, zum Beispiel für ein Video.",
        "Lernende tun darin selbst etwas: ausprobieren, üben, entscheiden.",
      ],
    },
    fields: {
      headline: "Drei Angaben genügen",
      items: [
        { label: "Was lernt man damit?", hint: "Zwei, drei Sätze. Was tun die Lernenden?" },
        { label: "Für wen ist sie?", hint: "Fach und Klasse." },
        { label: "Wo ist sie zu finden?", hint: "Der Link zur App." },
      ],
      optional: "Wenn du magst: einzelne Themen mit eigenem Link. Dann landen Suchende direkt an der richtigen Stelle.",
    },
    ways: {
      headline: "So trägst du sie ein",
      form: {
        title: "Mit dem Formular",
        body: "Füll das Formular auf GitHub aus. Dafür brauchst du ein GitHub-Konto.",
        button: "Zum Formular",
      },
      agent: {
        title: "Mit deinem KI-Assistenten",
        body: "Gib deinem Assistenten diesen Auftrag. Er prüft die Bedingungen und schreibt den Eintrag für dich.",
        prompt: (url) =>
          `Lies ${url} und trag meine Lern-App dort ein. Prüf zuerst, ob sie die Bedingungen erfüllt. Hier ist der Link zu meiner App: `,
        label: "Auftrag für deinen Assistenten",
        copy: "Auftrag kopieren",
        copied: "Kopiert",
      },
      mail: {
        title: "Per E-Mail",
        body: "Schick uns einfach den Link. Oliver hilft dir beim ersten Eintrag.",
        button: "E-Mail schreiben",
        subject: "Meine App für lernapps.net",
      },
    },
    back: {
      headline: "Was du zurückbekommst",
      body:
        "Jedes Danke und jede Rückmeldung zu deiner App geben wir an dich weiter. Später zählen wir sie offen, als Summe, auf der Seite deiner App. Wer geklickt hat, wissen wir dann nicht. Und wir wollen es auch nicht wissen.",
    },
  },
};

// The prepared e-mails of the app page, one per button: { label, subject, body }.
const T = de.app.thanks;
const M = de.app.mail;
de.app.mails = {
  thanks: (app, creator, page) => [
    { label: `♥ ${T.thank}`, subject: M.thanksSubject(app), body: M.thanksBody(app, creator, page) },
  ],
  used: (app, page) =>
    T.used.map((u) => ({ label: u.label, subject: M.usedSubject(app, u.label), body: M.feedbackBody(M.usedSubject(app, u.label), page) })),
  feedback: (app, page) =>
    T.feedback.map((f) => ({ label: f.label, subject: M.feedbackSubject(app, f.label), body: M.feedbackBody(M.feedbackSubject(app, f.label), page) })),
};

export default de;
