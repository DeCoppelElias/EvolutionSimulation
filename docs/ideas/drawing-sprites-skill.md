# Drawing sprites skill

Status: idea.

## What it does

A project skill in `.claude/skills/` that says how to draw or change a sprite:
edit its text grid in `art/sprites.py`, run the script to rewrite `art/png/`,
show the result in an artifact, and never edit a PNG by hand.

## Why it is interesting

[Art and motion](../roadmap/art-and-motion.md) drew the rabbit, the wolf and the grass across several
sessions, and the steps lived in a handoff file. Humans and any later species go
through the same steps. The decision log records what the art looks like and
why. How to produce it is a procedure, and a procedure belongs in a skill.

## What it would touch

A line in `AGENTS.md` first, and a project skill only if a fresh agent still
draws sprites wrong with it.

## Open questions

Whether it waits until a third species needs art, so it is written from two
real passes rather than one.

How it relates to the user-level `pixel-art-studio` skill, which draws the
pixels but knows nothing of this project's grids and palettes.
