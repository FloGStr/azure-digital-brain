# Azure Digital Brain V2.4 – Duplicate Analysis

> V2.4 ist ausschließlich ein nicht-destruktiver Audit. Kein Finding ist eine Änderungsfreigabe. Knoten, IDs, Hierarchie, Relationen, Quellen, Szenarien und Lernpfade bleiben unverändert.

## Ergebnis

Es wurden **16 sichere** und **6 wahrscheinliche** Duplikat-/Überlappungskandidaten dokumentiert. Generische Strukturwörter wie „Merksatz“ oder „Beispiel“ wurden nicht als Produktduplikate gewertet.

## Findings


### QF-2026-0001 – Availability Set doppelt modelliert

- Knoten: `azure-0005`, `azure-0265`
- Möglicher kanonischer Zielknoten: `azure-0005`
- Gemeinsamkeiten: Beide Knoten benennen dasselbe Azure-Verfügbarkeitskonzept.
- Unterschiede: azure-0005 ist vollständig angereichert; azure-0265 ist ein historischer Kurzast mit eigenem Analogie-Kind.
- Einzigartige Inhalte: Die Analogie unter azure-0265 muss bei einer späteren Entscheidung erhalten oder bewusst archiviert werden.
- Merge-Risiko: medium
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0005 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0002 – RA-GRS doppelt modelliert

- Knoten: `azure-0591`, `azure-0709`
- Möglicher kanonischer Zielknoten: `azure-0591`
- Gemeinsamkeiten: Titel und Redundanzkonzept sind identisch.
- Unterschiede: azure-0591 besitzt fachlichen Kontext; azure-0709 ist ein sehr kurzer Knoten in einer parallelen Storage-Struktur.
- Einzigartige Inhalte: Kein erkennbarer einzigartiger Fachinhalt im zweiten Knoten; Pfadkontext bleibt historisch relevant.
- Merge-Risiko: low
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0591 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0003 – RA-GZRS doppelt modelliert

- Knoten: `azure-0594`, `azure-0711`
- Möglicher kanonischer Zielknoten: `azure-0594`
- Gemeinsamkeiten: Titel und Redundanzkonzept sind identisch.
- Unterschiede: azure-0594 besitzt fachlichen Kontext; azure-0711 ist ein sehr kurzer Knoten in einer parallelen Storage-Struktur.
- Einzigartige Inhalte: Kein erkennbarer einzigartiger Fachinhalt im zweiten Knoten; Pfadkontext bleibt historisch relevant.
- Merge-Risiko: low
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0594 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0004 – Azure File Sync doppelt modelliert

- Knoten: `azure-0601`, `azure-0714`
- Möglicher kanonischer Zielknoten: `azure-0601`
- Gemeinsamkeiten: Beide Knoten bezeichnen Azure File Sync.
- Unterschiede: azure-0601 ist angereichert und verknüpft; azure-0714 ist ein Kurzfragment im parallelen Storage-Ast.
- Einzigartige Inhalte: Der historische Pfad des Kurzfragments bleibt als Herkunftskontext relevant.
- Merge-Risiko: low
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0601 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0005 – AzCopy doppelt modelliert

- Knoten: `azure-0605`, `azure-0715`
- Möglicher kanonischer Zielknoten: `azure-0605`
- Gemeinsamkeiten: Beide Knoten bezeichnen dasselbe Kommandozeilenwerkzeug.
- Unterschiede: azure-0605 besitzt Unterpunkte; azure-0715 ist ein leerer Kurzast.
- Einzigartige Inhalte: Unterknoten und ursprüngliche Position von azure-0605 dürfen später nicht verloren gehen.
- Merge-Risiko: low
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0605 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0006 – Azure Storage Explorer doppelt modelliert

- Knoten: `azure-0609`, `azure-0716`
- Möglicher kanonischer Zielknoten: `azure-0609`
- Gemeinsamkeiten: Beide Knoten bezeichnen dasselbe Verwaltungswerkzeug.
- Unterschiede: azure-0609 besitzt Unterpunkte; azure-0716 ist ein paralleler Kurzast.
- Einzigartige Inhalte: Unterknoten und ursprünglicher Kontext müssen erhalten bleiben.
- Merge-Risiko: low
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0609 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0007 – Azure Data Box doppelt modelliert

- Knoten: `azure-0638`, `azure-0721`
- Möglicher kanonischer Zielknoten: `azure-0638`
- Gemeinsamkeiten: Beide Knoten bezeichnen Azure Data Box.
- Unterschiede: azure-0638 ist angereichert; azure-0721 ist ein knapper paralleler Knoten.
- Einzigartige Inhalte: Migrationskontext beider Pfade muss erhalten bleiben.
- Merge-Risiko: low
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0638 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0008 – Azure Migrate doppelt modelliert

- Knoten: `azure-0645`, `azure-0722`
- Möglicher kanonischer Zielknoten: `azure-0645`
- Gemeinsamkeiten: Beide Knoten bezeichnen Azure Migrate.
- Unterschiede: azure-0645 ist vollständig angereichert; azure-0722 ist ein knapper paralleler Knoten.
- Einzigartige Inhalte: azure-0645 besitzt Quellen, Beziehungen und Kinder; alle Referenzen wären später zu prüfen.
- Merge-Risiko: high
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0645 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0009 – Azure Database Migration Service doppelt modelliert

- Knoten: `azure-0648`, `azure-0738`
- Möglicher kanonischer Zielknoten: `azure-0738`
- Gemeinsamkeiten: Beide Knoten bezeichnen denselben Migrationsdienst.
- Unterschiede: azure-0738 ist angereichert und referenziert; azure-0648 liegt als Kurzpunkt im Azure-Migrate-Ast.
- Einzigartige Inhalte: Der Kontext als Teil eines Migrationsablaufs ist in azure-0648 einzigartig.
- Merge-Risiko: medium
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0738 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0010 – Management Groups doppelt modelliert

- Knoten: `azure-0039`, `azure-1022`
- Möglicher kanonischer Zielknoten: `azure-1022`
- Gemeinsamkeiten: Beide Knoten erklären die Management-Group-Hierarchie.
- Unterschiede: azure-1022 ist vollständig angereichert, liegt aber unter dem Pricing-/Subscription-Ast; azure-0039 ist kürzer und steht im Governance-Ast.
- Einzigartige Inhalte: Der Governance-Pfad von azure-0039 und die reichen Inhalte/Relationen von azure-1022 sind jeweils einzigartig.
- Merge-Risiko: high
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-1022 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0011 – Azure Policy doppelt modelliert

- Knoten: `azure-0292`, `azure-0962`
- Möglicher kanonischer Zielknoten: `azure-0962`
- Gemeinsamkeiten: Beide Knoten stehen für Azure Policy als Governance-Kontrolle.
- Unterschiede: azure-0962 ist umfassend angereichert; azure-0292 ist ein knapper Funktionspunkt unter ARM.
- Einzigartige Inhalte: Der ARM-Funktionskontext von azure-0292 ist einzigartig.
- Merge-Risiko: medium
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0962 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0012 – Blob Storage doppelt modelliert

- Knoten: `azure-0571`, `azure-0677`
- Möglicher kanonischer Zielknoten: `azure-0571`
- Gemeinsamkeiten: Beide Knoten repräsentieren Blob Storage.
- Unterschiede: azure-0571 ist angereichert und verknüpft; azure-0677 führt einen eigenständigen ausführlichen Lernast.
- Einzigartige Inhalte: Die komplette Unterstruktur von azure-0677 enthält einzigartige Erklärschritte und darf nicht stillschweigend verloren gehen.
- Merge-Risiko: high
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0571 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0013 – Data Lake Storage doppelt modelliert

- Knoten: `azure-0616`, `azure-0717`
- Möglicher kanonischer Zielknoten: `azure-0616`
- Gemeinsamkeiten: Beide Knoten repräsentieren Azure Data Lake Storage.
- Unterschiede: azure-0616 ist angereichert; azure-0717 ist ein Kurzpunkt in einer parallelen Übersicht.
- Einzigartige Inhalte: Der parallele Übersichtskontext bleibt Herkunftsinformation.
- Merge-Risiko: low
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0616 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0014 – Queue Storage doppelt modelliert

- Knoten: `azure-0624`, `azure-0718`
- Möglicher kanonischer Zielknoten: `azure-0624`
- Gemeinsamkeiten: Beide Knoten repräsentieren Azure Queue Storage.
- Unterschiede: azure-0624 ist angereichert; azure-0718 ist ein Kurzpunkt.
- Einzigartige Inhalte: Der parallele Übersichtskontext bleibt Herkunftsinformation.
- Merge-Risiko: low
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0624 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0015 – Table Storage doppelt modelliert

- Knoten: `azure-0632`, `azure-0719`
- Möglicher kanonischer Zielknoten: `azure-0632`
- Gemeinsamkeiten: Beide Knoten repräsentieren Azure Table Storage.
- Unterschiede: azure-0632 ist angereichert; azure-0719 ist ein Kurzpunkt.
- Einzigartige Inhalte: Der parallele Übersichtskontext bleibt Herkunftsinformation.
- Merge-Risiko: low
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0632 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0016 – Cosmos DB doppelt modelliert

- Knoten: `azure-0654`, `azure-0724`
- Möglicher kanonischer Zielknoten: `azure-0724`
- Gemeinsamkeiten: Beide Knoten bezeichnen Azure Cosmos DB/NoSQL.
- Unterschiede: azure-0724 ist angereichert; azure-0654 dient als Zielsystem-Beispiel in einem tiefen Migrationspfad.
- Einzigartige Inhalte: Der Migrationsziel-Kontext von azure-0654 ist einzigartig.
- Merge-Risiko: medium
- Confidence/Priorität: high / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0724 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0017 – Availability Zones in drei Lernkontexten

- Knoten: `azure-0007`, `azure-0244`, `azure-0267`
- Möglicher kanonischer Zielknoten: `azure-0007`
- Gemeinsamkeiten: Alle drei Knoten behandeln Availability Zones.
- Unterschiede: Die Knoten tragen unterschiedliche Detail-, Architektur- und Analogie-Kontexte.
- Einzigartige Inhalte: Unterknoten von azure-0244 sowie die Analogie unter azure-0267 sind eigenständig.
- Merge-Risiko: high
- Confidence/Priorität: medium / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0007 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0018 – Azure App Services / Azure App Service

- Knoten: `azure-0215`, `azure-0351`
- Möglicher kanonischer Zielknoten: `azure-0351`
- Gemeinsamkeiten: Beide Titel und Inhalte verweisen auf App Service.
- Unterschiede: azure-0215 ist eine kurze PaaS-Einordnung; azure-0351 ist der angereicherte Produktknoten.
- Einzigartige Inhalte: Die PaaS-Modell-Einordnung ist als Kontext eigenständig.
- Merge-Risiko: medium
- Confidence/Priorität: medium / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0351 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0019 – Region Pairs / Region Pair

- Knoten: `azure-0254`, `azure-0269`
- Möglicher kanonischer Zielknoten: `azure-0254`
- Gemeinsamkeiten: Beide Knoten erklären Azure-Regionspaare.
- Unterschiede: Ein Knoten ist ein strukturierter Ast, der andere ein knapper Vergleichspunkt.
- Einzigartige Inhalte: Vergleichs- und Analogieinhalte im zweiten Pfad können lernrelevant sein.
- Merge-Risiko: medium
- Confidence/Priorität: medium / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0254 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0020 – SMB-Protokoll / SMB Protocol

- Knoten: `azure-0597`, `azure-0713`
- Möglicher kanonischer Zielknoten: `azure-0597`
- Gemeinsamkeiten: Beide Knoten benennen SMB im Azure-Files-Kontext.
- Unterschiede: Sprache und Granularität unterscheiden sich; beide sind knapp.
- Einzigartige Inhalte: Der englische Titel kann als Suchalias statt als eigener Knoten sinnvoll sein, ist aber nicht automatisch redundant.
- Merge-Risiko: medium
- Confidence/Priorität: medium / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0597 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0021 – Zwei Azure-Storage-Einstiege

- Knoten: `azure-0566`, `azure-0657`
- Möglicher kanonischer Zielknoten: `azure-0566`
- Gemeinsamkeiten: Beide Äste strukturieren Storage-Wissen und teilen zahlreiche Konzepte.
- Unterschiede: Der erste Ast ist fachlich angereichert; der zweite bewahrt eine ausführliche ursprüngliche Lernstruktur.
- Einzigartige Inhalte: Die gesamte zweite Hierarchie enthält viele einzigartige Lern- und Analogieelemente.
- Merge-Risiko: high
- Confidence/Priorität: medium / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0566 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


### QF-2026-0022 – VNet-Konzept in Core- und Security-Kontext

- Knoten: `azure-0442`, `azure-0864`
- Möglicher kanonischer Zielknoten: `azure-0442`
- Gemeinsamkeiten: Beide Bereiche modellieren Netzwerkgrenzen und Segmentierung rund um Virtual Network.
- Unterschiede: azure-0442 ist der eigentliche VNet-Produktknoten; azure-0864 ist ein Security-orientierter Segmentierungskontext.
- Einzigartige Inhalte: Security-Sicht darf nicht in einer Produktkonsolidierung verloren gehen.
- Merge-Risiko: high
- Confidence/Priorität: low / P1
- Vorschlag: Möglichen kanonischen Zielknoten azure-0442 prüfen; einzigartige Inhalte und alle Referenzen vor einer späteren Merge-Entscheidung sichern.


## Review-Regeln

- Vor einem späteren Merge sind Kinder, Relationen, Szenario-/Lernreferenzen, Quellen, Aliase, Legacy-Kontext und persönliche Daten zu prüfen.
- Eine Original-ID darf nicht stillschweigend verschwinden; ein dauerhaftes old-ID-zu-canonical-ID-Mapping wäre Pflicht.
- Bei parallelen Lernpfaden ist Konsolidierung häufig riskanter als bei leeren, identischen Produktknoten.
