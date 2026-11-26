# interactive: Parameter der Adresse an `start` und an Playthroughs geben

**Anlass:** Die Programmierwerkstatt `lernapps/coding` (lernapps/apps#869, Epic #509) bekommt Challenges von anderen Apps als Parameter der Adresse: `app/?c=<base64url(deflate-raw(JSON))>`. Der Spike (lernapps/coding, Branch `increment/spike`) zeigt: Das geht heute nur über eine Übergangsschicht in der Root-Komponente.

**Heute:** `runtime/interactive/interactive.ts` gibt dem Kern nur `start(seed, route)`. `routeOf()` kennt nur die ids aus `app.yaml`. Andere Parameter der Adresse erreichen den Kern nicht.

**Folge heute:** Die Root-Komponente liest `?c=` in `onMounted` und schickt eine Aktion an den Kern. Der Kern startet also zuerst ohne Challenge. Ein `hashchange` startet den Kern neu, und die Challenge ist weg; die Komponente muss sie bei jedem Neustart erneut schicken.

**Gewünscht:**
1. `start(seed, route, params)` mit `params: Record<string, string>`: alle Suchparameter der Adresse außer `seed`. Bei einem Neustart durch `hashchange` bleiben sie erhalten.
2. Playthroughs (`playthrough.v1.schema.json`) bekommen ein optionales Feld `params`. Build und e2e starten den Kern bzw. öffnen die Seite mit diesen Parametern.
3. Der Vertrag in `runtime/interactive/contract.ts` und das README des Archetyps nennen die Parameter, ihre Grenze (Vorschlag: die App prüft sie selbst, die Runtime reicht sie nur durch) und dass sie Daten sind, keine Routen.

**Nicht Teil davon:** ein Rückkanal zwischen Apps, ein Block `werkstatt-link` im Explainer.

**Rückwärts verträglich:** Ein Kern mit `start(seed, route)` ignoriert das dritte Argument.
