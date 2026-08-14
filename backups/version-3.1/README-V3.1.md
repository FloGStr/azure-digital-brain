# Azure Digital Brain V3.1

V3.1 implementiert Semantic Navigation & Knowledge Linking als additive Runtime-Schicht auf der unveränderten V2.4-Wissensbasis und dem V3.0-Proposal.

## Öffnen

`START.html` doppelklicken. Die Anwendung benötigt keine Installation und keinen Server.

## Neu in V3.1

- Suche nach Node-ID, Titel, Alias, historischem Begriff, Tags und Erklärungstext
- priorisierte Treffer mit Node-ID, aktuellem Elternpfad, V3.0-Klassifikation und vorgeschlagenem Zielbereich
- zentrale, global erreichbare Funktion `navigateToNode(nodeId)`
- Öffnen des Elternpfads, Zentrierung, Hervorhebung und automatische Detailansicht
- modusneutrale Navigation in Mindmap, Brain, Architecture und Lernen
- Rückkehr zum vorherigen Wissenskontext
- klickbare Wissensbegriffe in allen Erklärungsebenen
- getrennte Darstellung für Standard-, historische, veraltete und mehrdeutige Links
- Deep Links wie `#mode=mindmap&node=azure-0005`

## Datenprinzip

`data/canonical/` ist bytegleich mit V2.4. Neue Navigationsinformationen liegen ausschließlich unter `data/navigation/` und werden nach `data/runtime/semantic-navigation-runtime.js` gebaut.

## Runtime neu bauen

```text
node tools/build-runtime.mjs
node tools/build-release-runtime.mjs
node tools/build-scenario-runtime.mjs
node tools/build-learning-runtime.mjs
node tools/build-semantic-navigation-v3.1.mjs
```

## Qualität prüfen

```text
node --check app/semantic-navigation-core.js
node --check app/app.js
node tools/qa-semantic-navigation-v3.1.mjs
```

Die Distribution enthält den historischen rekursiven Backupbaum bewusst nicht erneut. Die Unverändertheit der V2.4-Wissensbasis wird stattdessen für jede kanonische Datei über SHA-256 geprüft.

