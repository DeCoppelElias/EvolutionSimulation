# Domain subpackages

Status: idea.

## What it does

Splits the flat `domain` package into subpackages by topic, such as
`domain.grid`, `domain.genome` and `domain.day`, once the flat package has
grown hard to find your way around.

## Why it is interesting

A package of forty types reads as a heap, and grouping them by the words in
`DESIGN.md` would make the ubiquitous language visible in the tree. An agent
looking for where geometry lives would find a folder rather than search.

## What it would touch

Visibility, more than file locations. The flat package keeps the world's
internals package-private, which is how the compiler holds the aggregate
boundary from [world model](../adr/world-model.md). Every
type that crosses into another subpackage has to become public, and then the
adapters can reach it too. A split that keeps the world, the entity store and
the day's steps together in one package and moves only standalone values out,
such as the genome and the grid's geometry, keeps most of that guarantee.

## Open questions

When the flat package becomes the problem. [Breeding and settings](../roadmap/breeding-and-settings.md), when mutation,
breeding and settings land, is the likely point.

Whether `World` itself should shed work first, which needs no subpackage.
After [breeding and settings](../roadmap/breeding-and-settings.md) it runs the day, checks and applies commands, places entities,
counts the census and builds the snapshot, in about 360 lines. The census and
the command switch are the first candidates to move into their own classes,
since most roadmap entries add to both.

Whether a module descriptor, or an architecture test along the lines of the
`jdeps` one, could hold the boundary instead of package-private visibility, so
the split costs nothing in encapsulation.
