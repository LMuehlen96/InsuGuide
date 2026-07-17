# InsuGuide

Eine einfache, offline lauffähige Web-App zur Unterstützung der Insulin-Dosierung. Der Therapeut hinterlegt einen Plan pro Tageszeit, der Patient gibt Blutzucker und Kohlenhydrate (BE) ein und erhält eine gerundete Insulin-Empfehlung mit transparenter Aufschlüsselung.

> **Wichtiger Hinweis:** InsuGuide ist ein Prototyp und **kein zugelassenes Medizinprodukt**. Die ausgegebene Menge ersetzt keine ärztliche Entscheidung. Dosierungen immer mit der behandelnden Ärztin / dem behandelnden Arzt abstimmen und vor jeder Gabe prüfen. Für einen echten Einsatz am Patienten gelten regulatorische Anforderungen (u. a. MDR).

## Rechenmodell

Pro Tageszeit (morgens / mittags / abends / nachts) stellt der Therapeut ein: Zielkorridor (Min/Max), Grundmenge, BE-Faktor und Korrektur-Wert.

```
Insulin = Grundmenge + (BE × BE-Faktor) + Korrektur
Korrektur = (aktueller Blutzucker − Ziel-Max) ÷ Korrektur-Wert
```

Regeln:

- Der **BE-Faktor** ist der einzige tageszeitabhängige Faktor auf die Kohlenhydrate (IE pro BE).
- Die **Korrektur** rechnet immer gegen den oberen Zielwert (Max); innerhalb des Korridors ist sie daher leicht negativ.
- Das Ergebnis wird auf **0,5 IE** gerundet und ist **nie kleiner als 0**.
- Optionale **Maximaldosis** als Sicherheitsgrenze: wird sie überschritten, deckelt die App und warnt.
- Liegt der Blutzucker unter Ziel-Min, erscheint eine Hypo-Warnung; unter 70 mg/dl eine deutliche Warnung.
- Einheit umschaltbar zwischen **mg/dl** und **mmol/l** (intern wird in mg/dl gerechnet).

Beispiel (morgens, BE-Faktor 2, Korrektur-Wert 30, Ziel-Max 140): Blutzucker 200 mg/dl, 4 BE → 8 IE Essen + (200−140)/30 = 2 IE Korrektur = **10 IE**.

## Funktionen

- Getrennter **Patienten-** und **Therapeuten-Bereich**.
- Der Therapeuten-Bereich ist **passwortgeschützt** und sperrt sich beim Verlassen und bei jedem Neuladen automatisch wieder, damit er dem Patienten nie offen vorliegt.
- Einstellungen werden **lokal im Browser** gespeichert (localStorage) – es werden keine Daten übertragen.
- **Automatisches Hell-/Dunkel-Design** nach Systemeinstellung.
- **Installierbar als App (PWA)**, wenn über HTTPS ausgeliefert (z. B. GitHub Pages).

### Passwort

Der Therapeuten-Bereich ist mit einem Passwort geschützt (als SHA-256-Hash im Code hinterlegt, nicht im Klartext). Dies ist ein **Client-seitiger Sichtschutz**, kein serverseitiger Zugang – für echten Mehrbenutzerbetrieb wäre später ein Login mit Backend nötig. Zum Ändern des Passworts den SHA-256-Hash der neuen Zeichenkette berechnen und in `index.html` die Konstante `PW_HASH` ersetzen.

## Lokal ausführen

`index.html` per Doppelklick im Browser öffnen. Der Rechner funktioniert vollständig offline. Hinweis: Die PWA-Installation und der Offline-Service-Worker funktionieren nur über HTTPS, nicht per `file://`.

## Als Web-App veröffentlichen (GitHub Pages)

Diese Dateien gehören ins Repository (alle im selben Ordner, Namen exakt so):

```
index.html
manifest.webmanifest
sw.js
icon-192.png
icon-512.png
icon-maskable-512.png
```

Schritte:

1. Auf github.com einloggen → **+** → **New repository**. Name z. B. `insuguide`, Sichtbarkeit Public oder Private, ohne README → **Create repository**.
2. Im Repo **„uploading an existing file"** wählen → die Dateien oben hineinziehen → **Commit changes**.
3. **Settings → Pages** → *Source*: **Deploy from a branch**, Branch **main**, Ordner **/ (root)** → **Save**.
4. Nach ca. 1 Minute Seite neu laden; die Adresse hat die Form `https://<dein-name>.github.io/insuguide/`.
5. URL am Handy öffnen → **„Zum Startbildschirm hinzufügen"** (iOS Safari) bzw. **„App installieren"** (Android Chrome). Danach läuft InsuGuide als eigene App, auch offline.

Aktualisieren: dieselben Dateien im Repo erneut hochladen (überschreiben); Pages veröffentlicht automatisch neu. Der Service-Worker-Cache heißt `insuguide-v1` – bei größeren Änderungen die Versionsnummer in `sw.js` erhöhen, damit Clients die neue Version laden.

## Dateien

| Datei | Zweck |
|-------|-------|
| `index.html` | Die komplette App (Logik, UI, Styles in einer Datei) |
| `manifest.webmanifest` | PWA-Metadaten (Name, Farben, Icons) |
| `sw.js` | Service Worker für Offline-Betrieb |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | App-Icons |
| `insuguide-logo.svg` | Logo mit Schriftzug (optional, für Doku/Website) |

## Haftung

Nutzung auf eigene Verantwortung. Keine Gewähr für die Richtigkeit der Berechnungen. Kein Ersatz für ärztliche Beratung oder ein zertifiziertes Medizinprodukt.
