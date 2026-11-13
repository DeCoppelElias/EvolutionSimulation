# Component interactions

Status: idea.

## What it does

The world holds a list of interactions, each naming an active component, a
passive one, a scope such as the same tile, and an effect. A step runs every
interaction that matches a pair of entities, so eating is one row, an eater
part meeting a food part, and the world never names food.

## Why it is interesting

A capability becomes a component plus a row, which is a stronger form of the
goal in `DESIGN.md` that a capability costs one component, plus a new rule or
a branch in one. Diet falls out of it: a species eats what its eater parts pair with,
and an omnivore carries two.

## What it would touch

Feeding, which becomes the first runner of the list, and
[the day](../adr/the-day.md), since what happens when two
things meet would live in a table rather than in the day method. Order becomes
data: which entity acts first, which row runs first when two match, and whether
a removed entity is skipped by later rows, all of which
[replay](../adr/replay.md) depends on.

An event system, where the world fires events that any part may handle, was
the broader alternative. It spreads behaviour over handlers with no one place
that shows the order, which is hard to keep deterministic and readable.

## Open questions

When to build it. [Diet](../roadmap/diet.md) left it out because the roadmap holds one
interaction, eating, and a list built for one case fits the second badly. Fire,
burning meeting flammable across neighbouring tiles, is the first interaction
of another shape and the point to reconsider.

Whether scope, order and effect are the right columns, which fire would show.
