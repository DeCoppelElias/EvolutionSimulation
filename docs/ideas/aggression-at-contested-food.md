# Aggression at contested food

Status: idea.

## What it does

Several creatures stand on one pile of food and settle it between them. The 2022
rules were: one aggressive contender takes the food, several means the seeded
generator picks a winner and the rest die, and none means the peaceful ones
split it evenly. Aggression was a per-individual number that passed to children.

## Why it is interesting

It is the most visible emergent thing the 2022 simulation does. Aggressive and
peaceful strains coexist, and which one is winning changes as the food supply
changes. It is also the only source of death by another creature, so without it
early runs select on finding food and nothing else.

## What it would touch

Feeding, which currently has no contest at all. A gene in the rabbit
species layout. Nothing else, since it needs no new component and no new intent.

## Open questions

Whether it belongs anywhere, since
[actions](../adr/actions.md) settles feeding without it.

Whether it is still wanted once violence exists. A predator kills by eating on
its turn, per [actions](../adr/actions.md), and an
attack intent, a home where a creature chooses violence, comes only when one
side has a choice to make. Keeping both means two combat systems, one decided
and one automatic.

Whether the automatic version can be made conditional, which
[actions](../adr/actions.md) says it cannot, since
the contest does not exist until every intent has been collected.
