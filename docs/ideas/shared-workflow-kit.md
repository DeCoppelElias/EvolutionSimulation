# Shared workflow kit

Status: built, [workflow](../adr/workflow.md).

## What it does

Moves the parts of the workflow that are not about this project into
groundwork, a Claude Code plugin in its own repository at
`DeCoppelElias/groundwork`, which other projects install. It holds the
document layout, `docs-check.py`, a skill that sets the documents up in a new
project, and only those workflow skills a fresh agent still needs. This project
keeps its own documents, `tools/comment-check.py` and its simulation tools.

## Why it is interesting

A kit changes in one place and every project picks the change up
deliberately. The project holds no copy of the kit, only the install, so there
is nothing left to drift.

Building it also fixes how the documents grew here. `DESIGN.md` turned into a
second copy of the decisions, because nothing said what it must not hold.

## What it would touch

Moving this project onto groundwork is a session of its own, and carries out
three other ideas: [decision topics](decision-topics.md),
[stable references](stable-references.md) and the
[skill review](skill-review.md). `DESIGN.md` shrinks to vision, goals and
non-goals. The decisions are regrouped by topic into `docs/adr/`. A
`CONTEXT.md` glossary is written, and the roadmap files are named by slug. The
five project skills leave `.claude/skills/`, `AGENTS.md` and
[workflow](../adr/workflow.md)
point at the kit, and CI fetches `docs-check.py` from it.

## Open questions

Settled in the grill of 2026-11-13, and kept in groundwork's own decision log
once it exists:

- It is a plugin with a setup skill, not a template, and assumes no stack.
- `DESIGN.md` never links a decision. `CONTEXT.md` follows the mattpocock
  glossary format. Decisions live one per topic in `docs/adr/<topic>.md`,
  rewritten in place, with an index grouped by area.
- Roadmap entries are named by slug, and the build order lives only in the
  roadmap's README.
- Each document states what it holds and never holds, `docs-check.py` enforces
  what a regex can, and an agent unsure where something goes asks Elias.
- Preferences and approval points are lines in `AGENTS.md`. A workflow skill
  exists only where a fresh agent gets the flow wrong without it, tested
  against a sample project inside the kit.
- Grilling uses the mattpocock skills, and a grill writes nothing until it ends.

Left open: which workflow skills survive the baseline runs, and how this
project's 25 decisions regroup, which the migration session settles with
Elias.
