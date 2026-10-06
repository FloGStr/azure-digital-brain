# Azure Digital Brain V3.4

Azure Digital Brain is an interactive, static web application for exploring structured Azure knowledge, guided learning paths, and architecture decisions. The current portfolio release combines five coordinated views in one browser-based interface:

- **Mindmap** for hierarchical knowledge exploration
- **2D Brain** for relationship-focused navigation
- **3D Brain** for an alternative spatial view of the knowledge graph
- **Learning** for six guided, context-linked chapters
- **Architecture** for discovery, readiness, option comparison, trade-offs, and decision documentation

[Open the live demo](https://flogstr.github.io/azure-digital-brain/START.html) · [Open the 3D view](https://flogstr.github.io/azure-digital-brain/app/index.html#mode=brain&renderer=3d)

## Current reference scope

| Area | Current scope |
| --- | ---: |
| Brain | 239 entities, 211 relations, 0 orphan references |
| Learning | 6 chapters, 39 steps, 98 primary anchors, 76 focus targets |
| Legacy learning paths | 5 paths, 33 steps |
| Architecture | V1, Case 01, 6-step decision workflow |

Learning and Architecture V1 are frozen reference areas with completed human review. The application is a portfolio demonstrator and learning system, not a production deployment template or automated Azure assessment service.

## How the application is structured

The application uses a canonical knowledge model and browser-ready runtime projections:

```text
START.html
└── app/index.html                 single application shell
    ├── app/                       UI, navigation, learning and architecture logic
    ├── data/canonical/            canonical nodes, relations and sources
    ├── data/runtime/              browser-ready runtime data
    ├── data/learning/             guided learning content and focus mappings
    ├── data/architecture/         Architecture V1 / Case 01 model
    └── experiments/3d-brain/      integrated Three.js renderer and local vendor files
```

The canonical layer separates knowledge records, relationships, sources, navigation metadata, and generated runtimes. Cross-mode context allows a selected topic or learning focus to be carried between Mindmap, Brain, 3D Brain, Learning, and Architecture where a matching target exists.

## Key implementation ideas

- stable canonical IDs and explicit typed relations
- structured taxonomy with separate runtime projections
- deep links and context-preserving cross-mode navigation
- guided learning with primary anchors and focused knowledge targets
- progressive disclosure through detail panels and accordions
- Architecture Decision Model with facts, assumptions, questions, specialist reviews, blockers, readiness, options, and trade-offs
- WAF- and CAF-oriented review prompts inside the architecture workflow
- responsive interaction patterns for desktop, tablet, and mobile
- local Three.js r185 distribution with the corresponding license

## Run locally

For the simplest local use, open `START.html` in a modern browser. A static local server is recommended when reviewing the project exactly as it is delivered by GitHub Pages:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/START.html`.

No build step, package installation, API key, backend, or cloud connection is required for the published application.

## GitHub Pages and direct links

The repository is designed for project-site hosting from the repository root. Assets use relative paths so the application works below `/azure-digital-brain/`.

- Main entry: `START.html`
- Application shell: `app/index.html`
- Architecture entry: `ARCHITECTURE.html`
- Architecture Case 01: `ARCHITECTURE-CASE-01.html`
- 3D entry: `experiments/3d-brain/index.html`

Navigation state is encoded in the URL hash, so GitHub Pages can serve direct view and context links without server-side routing.

## Review and quality approach

The project was developed through controlled, iterative analysis and implementation. Validation includes canonical-data integrity checks, relationship/orphan checks, cross-mode navigation checks, focused Learning and Architecture regression suites, responsive browser review, and freeze/review records for protected areas.

AI-assisted analysis and implementation were used as engineering tools. Scope, domain changes, acceptance criteria, browser review, and release decisions remained human-controlled.

## Known limits

- The application is a static, client-side demonstrator; state is session- or browser-local.
- Architecture V1 does not perform AI assessment, external verification, or automatic evidence validation.
- Architecture diagrams are not automatically recomputed when a preference changes.
- The architecture case demonstrates a decision workflow and is not a final deployment blueprint.
- There is no backend, account system, cloud synchronization, support module, or telemetry service.

## Repository notes

The active application is contained in `app/`, `assets/`, `data/`, and `experiments/3d-brain/`. Older version READMEs, reports, build/QA utilities, and the already published version archive are retained as project history; they do not replace the V3.4 runtime described above. No new personal working notes, local review outputs, snapshots, or development backups are included in this release.
