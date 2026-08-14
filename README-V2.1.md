# Azure Digital Brain V2.1

V2.1 ergänzt V2.0 um ein Architecture Learning Framework. Die bestehende Anwendung, alle 1.058 Wissensknoten, Relationen, Quellen und die fünf V2.0-Architekturszenarien bleiben unverändert.

## Neue Lernschicht

- fünf Architecture Learning Paths
- 33 Lernschritte mit Voraussetzungen und Folgepfaden
- 72 referenzierte bestehende Wissensknoten
- Verknüpfung aller fünf V2.0-Szenarien
- vier Reifegrade: Verstehen, Verbinden, Anwenden, Entscheiden
- bestehendes Benutzerprofil für Fortschritt und persönliche Notizen vorbereitet

## Zentrale Dateien

- `data/canonical/learning-framework.json` – kanonische Lernstruktur
- `data/canonical/learning-schema.json` – Datenvertrag
- `data/runtime/learning-runtime.js` – browserlesbare Runtime
- `data/user/user-profile-learning-v2.1.example.json` – Beispiel im bestehenden Profilschema
- `tools/build-learning-runtime.mjs` – Runtime-Builder und Referenzvalidierung
- `tools/qa-learning-framework-v2.1.mjs` – Unverändertheits- und Qualitätsprüfung
- `reports/` – Fach-, Navigations- und QA-Berichte
- `backups/version-2.0/` – vollständiges bytegleiches V2.0-Backup

## Runtime neu erzeugen und prüfen

```text
node tools/build-learning-runtime.mjs
node tools/qa-learning-framework-v2.1.mjs
```

## Persönlicher Lernstatus

Lernfortschritt wird nicht in der Wissensbasis gespeichert. Verwende im vorhandenen Profil:

- `learning_status[learning_step_id]`
- `notes[learning_step_id]`

Das Beispiel zeigt Fortschritt, zuletzt bearbeitet, Verständnislevel und persönliche Notizen, ohne ein neues Profilschema einzuführen.

## Status

Die Daten- und Runtime-Schicht ist implementiert. Eine neue Lernoberfläche, GitHub-Integration und Hands-on-Labs sind nicht Bestandteil von V2.1.

