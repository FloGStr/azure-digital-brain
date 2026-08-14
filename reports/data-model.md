# Datenmodell V1.1

Stand: 2026-08-11

## Wissensknoten

Ein Knoten enthält stabile Identität, fachliche Einordnung, drei Erklärungsebenen, Hierarchie, semantische Referenzen, Quellen und Metadaten.

```json
{
  "schema_version": "1.1",
  "id": "azure-0881",
  "title": "Private Endpoint",
  "domain": "Azure",
  "category": "Networking",
  "subcategory": "Endpoints",
  "description": {
    "simple": "",
    "technical": "Private Endpoint",
    "architecture": ""
  },
  "why_important": "",
  "parent": "azure-0877",
  "children": ["azure-0882"],
  "relations": ["rel-002", "rel-003", "rel-004", "rel-005"],
  "examples": [],
  "sources": [],
  "metadata": {
    "difficulty": "Mittel",
    "importance": 7,
    "status": "published",
    "certifications": ["AZ-900"],
    "audit_flags": []
  },
  "origin": "original_mindmap"
}
```

Leere Erklärungsebenen sind bewusst zulässig. Die Migration erfindet keine neuen fachlichen Inhalte. Vorhandene Kurzbeschreibungen wurden `simple`, der vollständige Originaltext `technical` zugeordnet. `architecture` ist für kontrollierte spätere Ergänzungen vorbereitet.

## Semantische Beziehung

```json
{
  "id": "rel-003",
  "source": "azure-0881",
  "target": "azure-0558",
  "type": "requires",
  "inverse_type": "required_by",
  "explanation": "Private DNS sorgt dafür, dass der Dienstname zur privaten Endpoint-IP aufgelöst wird.",
  "sources": ["ms-private-dns"],
  "confidence": 0.95,
  "status": "accepted",
  "created_by": "microsoft_documentation",
  "reviewed_at": null
}
```

Die Detailansicht zeigt aus Sicht des Quellknotens `benötigt` und aus Sicht des Zielknotens `wird benötigt von`. Diese Gegenrichtung stammt aus dem zentralen Register.

## Relation Registry

Jeder Beziehungstyp definiert:

- stabile technische ID
- lesbares Label
- Gegenrichtung und Gegenlabel
- Beschreibung
- Graphfarbe
- Priorität
- Kennzeichnung symmetrischer Beziehungen

Beliebige freie Typstrings werden vom Build nicht akzeptiert.

## Quellen

Quellen sind eigenständige Objekte und werden von Knoten und Beziehungen nur über IDs referenziert. Dadurch bleibt eine Quelle zentral aktualisierbar und mehrfach verwendbar.

## Benutzerprofil

Das Benutzerprofil ist nicht Teil der Wissensbasis:

```json
{
  "schema_version": "1.1",
  "notes": {"azure-0881": "Eigene Notiz"},
  "learning_status": {"azure-0881": "verstanden"},
  "favorites": [],
  "custom_links": [],
  "preferences": {"default_mode": "mindmap"}
}
```

## KI-Vorschläge

KI-Vorschläge sind separate, nicht angewendete Objekte mit `pending`, `accepted` oder `rejected`. Die kanonischen Daten kennen keinen automatischen KI-Schreibweg.
