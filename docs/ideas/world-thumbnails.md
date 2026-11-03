# World thumbnails

Status: idea.

## What it does

Each world on the picker shows a small drawing of its grid beside its size,
seed, day and counts, so worlds can be told apart at a glance.

## Why it is interesting

With several worlds open the cards read alike, and a picture of where the
creatures are says more than a count.

## What it would touch

The picker, which would fetch one snapshot per card, about 5 KB at 20 by 20,
and a second drawing path beside `frontend/src/scene.ts`, either another Pixi
canvas or a plain 2D renderer. Every later change to the art would have to
reach both.

## Open questions

Whether a thumbnail refreshes while its world plays, which needs polling or a
stream per card, and whether it is worth it once hosting lands a stranger
straight in a fresh world and the picker is seen mostly locally. Entry 15's
grill left it out for that upkeep.
