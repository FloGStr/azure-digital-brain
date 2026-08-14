# Kanonische Wissensbasis

Dieser Ordner ist ab Version 1.1 die einzige fachliche „Source of Truth“ des Azure Digital Brain.

- `nodes.json` – Wissensknoten und Hierarchie
- `relations.json` – semantische Beziehungen
- `relation-types.json` – zentrales Register der Beziehungstypen
- `sources.json` – Quellenverzeichnis
- `schema.json` – maschinenlesbarer Datenvertrag

Manuelle fachliche Ergänzungen erfolgen ausschließlich hier. `tools/build-runtime.mjs` liest diese Dateien, prüft Referenzen und erzeugt daraus `data/runtime/knowledge-runtime.js`. Der Build schreibt niemals in diesen Ordner.

Die einmalige Migration `tools/migrate-v1-to-v1.1.mjs` verweigert die Ausführung, sobald `nodes.json` existiert. So kann sie eine gepflegte Wissensbasis nicht versehentlich überschreiben.
