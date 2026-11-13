# Actions

## Intents and options

A brain is handed a perception and the day's options and returns one intent:
move in a direction for a distance, breed, or idle. The world applies it. In
the 2022 model a creature changed the world itself, which put legality inside
every creature type, so movement rerolled up to ten times to stay on the grid,
and let one creature's move change what a later one saw the same day.

Options are what the world offers a creature at the start of the day, built
from the grid and the creature's own components and kept apart from what it
senses, so a new sense never supplies them. They hold the grid's directions and
one list in a fixed order: idling, each direction one tile at a time up to the
species' stride, stopping at the edge, then breeding. Each option mirrors the
intent of the same name, and a move option carries the offset it lands on,
since only the grid turns a direction into a tile. The fixed order makes a pick
replay and gives a network brain a fixed encoding of its outputs. A new action
adds a case to both sealed types and leaves the shape of the options alone.

Three other homes for what a brain may choose were rejected: the perception,
since every new sense would have to copy in the directions; the spawn, which
knows no grid; and inferring directions from visible tiles, which would move
the edge rule into every brain. One field per kind of action changed the shape
of the options with every new action.

Only legal options are offered, which machine learning calls action masking.
Offering everything and turning an illegal pick into an idle day is simpler,
and it works as a penalty, which stops working as illegal picks grow common
(Huang and Ontañón, 2020). Selection is the learner here, and a wasted day is
that penalty. An option is still not a promise, since a faster creature may
block the move first.

## Rules and the resolver

The resolve step owns legality. Each action has one rule in the world with two
halves: what it offers a creature today, and what happens when it is chosen.
Offer and outcome live in one class so they cannot drift, and stay two checks
because the resolver runs after faster creatures have moved. A component
answers only about its own state, and a rule that combines components or reads
the world belongs to the world. Legality inside each component would have it
reach into others and into the grid. A registry of rules looked up by intent
class loses the compile error that makes every new action get a rule.

A tile holds any number of entities, and only an entity that blocks stops a
move, so crowding is felt through food rather than space. A blocked mover walks
as far as it legally can.

An entity that dies leaves the world at once, whatever killed it, and its turn
is skipped. Keeping the dead until clean-up leaves a dead but present state that
every later rule must skip and nobody can perceive. A rule that reacts to a
death is run by whatever kills, since no body is left to find.

Breeding is an intent rather than a schedule, so it costs the creature its move
that day and can wait for a better moment. It is legal once the breeding
interval has passed since the creature's birth or last breed, while its reserve
covers the child's reserve, the loss to the birth and the margin the parent
keeps. What the world rules out a creature cannot learn to avoid, such as
breeding itself thin. The margin could become a gene if caution should evolve.

## Feeding

A creature eats at the end of its own turn, whatever it chose. It takes every
occupant of its tile that carries a food its eater names, credits its
metabolism, and removes what it ate, so a creature later in the order finds
nothing. Each kind of food is a component of its own, such as plant or meat,
and an eater lists the food classes it takes, fixed in the recipe. The eater
shows others what it takes, so a rabbit can see that a wolf eats meat, and what
it does about that is a pull gene rather than a rule saying wolves are
dangerous.

There is no contest. The 2022 food fight rolled aggression and killed the
losers. It was a behaviour that belongs to the individual, run as a world rule
because the contest only exists once every intent is in, so aggression could
never be conditional. `docs/ideas/aggression-at-contested-food.md` keeps it. A
diet naming species would make every herbivore list each new plant and the
wolf name the rabbit. A kind field inside one edible component would make a
brain look inside a view to tell grass from meat.

A predator kills by eating. A wolf always wants to eat, so there is nothing yet
for a brain to decide, and an attack intent arrives when one side has a choice,
such as sparing prey or fighting back. Until then predation is decided by where
each creature stands and who moves first.

## Who decides

Whether a behaviour is a brain's intent or a world rule depends on whose rule
it is. A world rule belongs to the world and applies identically to everything
of its kind, even when it reads per-individual numbers or rolls dice. A brain's
rule belongs to the individual: it picks one of several exclusive options, it
differs from its neighbour's, and its children inherit it. Randomness settles
nothing, since fire's ignition roll is the world's and a brain that picks at
random is still a brain. To make a world rule richer, give it better input
rather than a brain.

Under this test breeding is an intent, and eating prey is a world rule while
every predator would choose to eat. The test is a diagnostic, not a fence: fire
with a mutating spread chance, where spreading counts as breeding, correctly
becomes a brain. Nothing enforces it.

Every choice has to be visible when the day starts, since intents are collected
before anything happens. A choice that only arises partway through a day cannot
be a decision.
