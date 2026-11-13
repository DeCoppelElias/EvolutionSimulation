# EvolutionSimulation design

This file holds what EvolutionSimulation is for: its vision, its goals and what
it will not do. It never holds how the code is built, which belongs in
`docs/adr/`, and it never links a decision or names a file in the code. It
changes when the direction changes, not when a decision does, and it stays
under 150 lines.

## Vision

EvolutionSimulation is a world you watch evolve. Creatures look for food,
breed, and pass varied behaviour to their children, so over a few hundred days
the population drifts toward whatever happens to work.

The fun comes from effects nobody wrote. Fire burns grass, rabbits and wolves
through one rule, because all three are flammable and the rule names none of
them. A wolf avoids a burning tile because burning is a thing it can see,
rather than because wolves know about fire. Capabilities that meet without
having been introduced are where the world does something you did not plan.

The shape of the code matters as much as the features, because a system that
is pleasant to extend gets extended.

Surprise and breakage look identical from outside, so a run has to be
repeatable. Given the same seed and the same commands the world replays
exactly, so a strange run can be watched again and taken apart.

## Goals

Two goals decide what gets built.

It is pretty and satisfying to watch, so that people open it for the sake of
watching. It is drawn in one pixel-art style made for it, creatures hop and
leap between tiles rather than snapping from one to the next, and the interface
is a web page anyone can reach from a link once it is hosted. A feature that
makes the world more interesting and harder to read on screen is not finished.

An AI agent can experiment with it easily. An agent starts worlds, drives them,
runs many seeded runs and reads the results as data, with nobody at the
screen. That is how new features and new brains get tested, and an agent can
also make new brains, by breeding, searching or training them, for a run to
start from.

Adding a capability costs one component, plus a new rule or a branch in one,
and changes nothing else. The wolf is the test: it is a species whose diet is
meat, which rabbits carry, and the world never needed to know what a rabbit is.
When a capability forces a change to the world, the entity, the genome or the
shape of a day, the design has a flaw, and the decision for that topic records
it.

Further out, a brain worth keeping can be saved and loaded into another run.
`docs/ideas/brain-library.md` holds that.

## Non-goals

Not an ecology model. Plausible beats accurate.

Not a framework. This is one simulation, and generality no second simulation
needs is cost.

No learning inside a run other than selection. A run's creatures change only
across generations, and a brain made outside a run enters it as a starting
genome.

Single player. Each viewer watches their own world in a browser tab, served
from their own machine or from a host. There are no shared worlds and no
accounts.

Large worlds are not a current target. Grids run to hundreds of tiles and
populations to tens or low hundreds. The architecture keeps the option open
without promising to scale.
