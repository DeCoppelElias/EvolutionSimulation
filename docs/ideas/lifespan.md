# Lifespan

Status: idea. The grass half is built,
[world model](../adr/world-model.md). Rabbits and wolves
count their age from [inspecting creatures](../roadmap/inspecting-creatures.md), and nothing ends them by it.

## What it does

A component that counts its carrier's days and ends the carrier when they run
out, the way `Metabolism` ends a carrier whose reserve falls below zero. A
species that declares it sets how long its members last with a setting of its
own. Grass declares it, so grass left uneaten withers. Rabbits could declare a
length too, with a default long enough that it rarely ends one.

[Entity lifespan](../roadmap/entity-lifespan.md) built the grass half, per
[world model](../adr/world-model.md): a fixed number of days,
grass only. [Inspecting creatures](../roadmap/inspecting-creatures.md) gave rabbits and wolves the part with no length, so it
counts their age. Ending them by it stays open here.

## Why it is interesting

Grass that waits forever closes the energy budget. A population eventually
eats every drop however well it forages, so its size is the energy coming in
divided by what each member burns, and foraging skill cannot change it. The
[comparing runs](../roadmap/comparing-runs.md) tuning log found this at run 10: survival in separate worlds could not see
foraging skill. Grass that withers makes food a population fails to find a
loss, so a better forager feeds more rabbits.

Nothing in the documents decides whether a fed creature can live forever. It
was never asked: starvation arrived in [eating and starving](../roadmap/eating-and-starving.md) as the first thing that removes
a creature, and nothing since has added a second. A rabbit with a large reserve
keeps its genome in the population and keeps eating. Whether that happens often
is unknown. The page shows a rabbit's age from [inspecting creatures](../roadmap/inspecting-creatures.md), so watching runs can
show whether a length is needed and how long it should be.

The same part ends a corpse after some days, a fire that burns out, or water
that dries up, so the world never needs a system that knows which entity
expires.

## What it would touch

A setting per
declaring species, per
[genes and settings](../adr/genes-and-settings.md). [Comparing runs](../roadmap/comparing-runs.md)'s
tuned food defaults and [rabbit learns](../roadmap/rabbit-learns.md)'s selection gate, since withering changes how much
grass the world holds. The census or a snapshot gains age if runs are to
measure it.

## Open questions

Whether rabbits set a lifespan, with what default, and what runs would justify
lowering it. They already carry the part, so this is a setting on the species.
The page shows a creature's age from [inspecting creatures](../roadmap/inspecting-creatures.md), and measuring it across runs
still needs an age field in the census and a measure in `compare.py`.

Whether a rabbit's lifespan later becomes a gene, which needs a tradeoff to
stop it pinning to its upper bound, per
[gene tradeoffs](gene-tradeoffs.md).

Whether a creature that dies of age leaves a corpse, per
[corpses and scavenging](corpses-and-scavenging.md).
