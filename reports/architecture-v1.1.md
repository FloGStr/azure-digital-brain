# Architektur V1.1

Stand: 2026-08-11

## Ziel

V1.1 stabilisiert die Wissensarchitektur, ohne Mindmap, Brain-Modus oder Offline-Betrieb neu zu entwickeln. Die Visualisierung bleibt eine Projektion der Wissensbasis; die Wissensbasis ist der dauerhafte Wertträger.

## Architektur

```text
Kanonisches Fachwissen
  ├── Knoten
  ├── Beziehungen
  ├── Beziehungstypen
  └── Quellen
          │
          ▼
   Validierung + Runtime-Build
          │
          ▼
 Mindmap / Brain / Suche / Details

Persönliches Benutzerprofil ──────────┘
```

## Source of Truth

`data/canonical/` ist die einzige fachliche Source of Truth. Die ursprüngliche Mindmap und Version 1.0 sind nur noch unveränderter Migrations- und Auditnachweis unter `backups/version-1.0/`.

`data/runtime/knowledge-runtime.js` ist kein zweiter Wissensstand, sondern eine deterministisch erzeugte Browserprojektion. Sie existiert, weil lokale `file://`-Anwendungen JSON nicht in allen Browsern zuverlässig per `fetch` lesen dürfen.

## Überschreibschutz

- Die einmalige Migration verweigert die Ausführung, sobald kanonische Knoten existieren.
- Der normale Build liest nur kanonische Dateien.
- Der normale Build schreibt nur in `data/runtime/`.
- Persönliche Daten werden niemals in kanonische Knoten geschrieben.

## Validierung

Der Runtime-Build prüft:

- eindeutige Knoten-, Relations- und Quellen-IDs
- genau einen Wurzelknoten
- wechselseitige Eltern-/Kindreferenzen
- gültige Relationsendpunkte
- vollständige Relationsreferenzen an beiden Endknoten
- registrierte Beziehungstypen und reziproke Gegenrichtungen
- vorhandene Quellenreferenzen
- Erklärungsebenen und Kernmetadaten

## Fachwissen und persönliche Daten

Fachwissen umfasst Erklärungen, Beziehungen, Quellen, Beispiele, Merksätze, Analogien und fachliche Metadaten.

Persönliche Daten umfassen Lernstatus, eigene Notizen, Favoriten, persönliche Links und Ansichtspräferenzen. Sie werden als versioniertes Profil im Browser gespeichert und können als JSON exportiert und importiert werden.

## KI-Erweiterung

Eine spätere KI arbeitet gegen eine lesbare Kopie der kanonischen JSON-Daten. Änderungen werden ausschließlich als Vorschlagsobjekte erzeugt. Ein Vorschlag besitzt Typ, Payload, Begründung, Quellen, Konfidenz und Status. Erst eine explizite Annahme darf eine kontrollierte Änderung der kanonischen Daten auslösen.

## Erweiterung auf weitere Domänen

Knoten besitzen ein eigenständiges `domain`-Feld. Damit können später Kubernetes, Python, Cloud Architecture oder Unternehmenswissen ergänzt werden, ohne die Azure-Kategorien zu missbrauchen. Der bestehende Azure-Wurzelknoten bleibt in V1.1 aus Kompatibilitätsgründen erhalten; ein globaler Digital-Brain-Wurzelknoten kann in einer späteren, bewusst migrierten Version eingeführt werden.
