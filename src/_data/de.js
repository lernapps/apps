// All texts of lernapps.net/apps/ (German). Templates contain no copy of their own.
// The pages follow the experiences of the platform design (https://lernapps.net/docs/platform-design/, D7):
//   x-app-in-minutes      a teacher, minutes before a lesson: find, see it may be used, bring it to class, thank
//   x-practice-tonight    a parent, the evening before a test: find, start right away, thank
//   x-list-and-hear-back  a creator: list the app in minutes, hear that it helped
// Language: plain German (ISO 24495-1): short sentences, active voice, no jargon, "du".
export default {
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

    // Shown only when someone came through a referral link (?welle=…) and the counter is set.
    wave: {
      text: "Jemand hat dir diese App empfohlen. Schau sie dir in Ruhe an.",
      button: "Ich gucke mir das an",
      done: "Schön! Viel Erfolg damit.",
    },

    // The thank-you is a step of its own in every journey (D7). Explained right where the click happens.
    thanks: {
      headline: "Hat die App geholfen?",
      body: (creator) =>
        `lernapps.net ist kostenlos. Dein Danke geht an ${creator}. Es zeigt, dass die App hilft. Und es hält lernapps.net am Leben.`,
      thank: "Danke sagen",
      thanked: "Dein Danke ist angekommen.",
      usedHeadline: "Wo hast du sie genutzt?",
      used: [
        { event: "genutzt-unterricht", label: "Im Unterricht" },
        { event: "genutzt-zuhause", label: "Zu Hause" },
      ],
      feedbackHeadline: "Wie lief es?",
      feedback: [
        { event: "feedback-gut", label: "Hat gut gepasst" },
        { event: "feedback-zu-schwer", label: "War zu schwer" },
        { event: "feedback-zu-leicht", label: "War zu leicht" },
        { event: "feedback-technik", label: "Hat technisch gehakt" },
      ],
      recorded: "Danke für deine Rückmeldung.",
      privacy:
        "Wir zählen nur deinen Klick, als Summe. Wir speichern nichts über dich, auch nicht in deinem Browser.",
      privacyLink: "Mehr dazu",
      reminder: "Zurück aus der App? Sag Danke, wenn sie geholfen hat.",
      reminderLink: "Zum Danke",
    },

    // Open totals (data/totals.json), shown when present.
    totals: {
      headline: "Bisher gezählt",
      thanks: (n) => `${n} × Danke`,
      class: (n) => `${n} × im Unterricht genutzt`,
      home: (n) => `${n} × zu Hause genutzt`,
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
        "Jedes Danke und jede Rückmeldung zu deiner App zählen wir offen, als Summe. Du siehst sie auf der Seite deiner App. Wer geklickt hat, wissen wir nicht. Und wir wollen es auch nicht wissen.",
    },
  },
};
