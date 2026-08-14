# Migration Report – V1.0 zu V1.1

Stand: 2026-08-11

## Ergebnis

- 1.058 von 1.058 Knoten migriert
- 1.058 stabile IDs erhalten
- 10 Hierarchieebenen erhalten
- 27 von 27 Beziehungen migriert
- 11 von 11 Quellen migriert
- 26 registrierte Beziehungstypen einschließlich Gegenrichtungen
- kein Originalknoten gelöscht
- vollständige Version 1.0 unter `backups/version-1.0/` gesichert

## Knotenmapping

| V1.0 | V1.1 |
|---|---|
| `id` | unverändert `id` |
| `parent`, `children` | unverändert erhalten |
| `short_description` | `description.simple` |
| `full_content`/Originaltext | `description.technical` und `legacy.original` |
| – | `description.architecture` vorbereitet, nicht erfunden |
| `sub_category` | `subcategory` |
| `difficulty`, `importance` | `metadata` |
| `learning_status`, `notes` | aus Fachwissen entfernt; Benutzerprofil |
| Originalfelder | `legacy` für Auditierbarkeit |

## Relationsmapping

Die früheren deutschsprachigen freien Typstrings wurden auf stabile Registry-IDs abgebildet. Der ursprüngliche Typ bleibt als `legacy_type` nachvollziehbar.

Beispiele:

- `verwendet` → `uses` / `used_by`
- `abhängig-von` → `depends_on` / `depended_on_by`
- `gesichert-durch` → `secured_by` / `secures`
- `Teil-von` → `part_of` / `contains`
- `überwacht-durch` → `monitored_by` / `monitors`

`rel-003` wurde fachlich gerichtet: Private Endpoint `requires` Private DNS. Erklärung, Quellen und Relation-ID blieben erhalten.

## Überschreibschutz

Die Migration ist absichtlich nicht wiederholbar, sobald `data/canonical/nodes.json` existiert. Alle folgenden Builds lesen ausschließlich die kanonische Wissensbasis und verändern sie nicht.

## Persönliche Altdaten

Beim ersten Start liest V1.1 vorhandene lokale `adb:<node-id>`-Einträge und übernimmt Notizen und Lernstände in das versionierte Profil. Die alten Einträge werden nicht gelöscht. Danach kann das Gesamtprofil als JSON exportiert werden.
