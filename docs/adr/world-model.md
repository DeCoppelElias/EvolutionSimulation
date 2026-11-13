# World model

A world holds a grid, its entities in id order, one random generator and a day
counter, and advances one day at a time.

## Entities and species

An entity is an id, a position, a species, a genome and its components, each
filed under the type it declares. Anything on a tile is an entity: a rabbit, a
wolf, a patch of grass, later a rock or a pile of ash. A creature is an entity
with a brain. A species is the recipe for a kind of entity: its name, sprite,
gene layout and baseline genome, its settings, the brain its members are born
with, and the components they start with. The brain has its own optional slot,
because it is the seam that gets swapped and terrain is a species with no
brain.

Hunger, flammability, edibility and blocking cut across any tree of creature
classes, which is why state lives in components. A capability as an interface
on a class tree fails on state: fuel and burn progress need fields, interfaces
hold none, and every class redeclares them or forwards to a delegate, which is
a component system built by accident. Species flags were the closest
alternative and lost on fire. Being flammable comes from the recipe and is
permanent, being alight is attached on ignition and removed when it burns out,
and flags would need a second flag to hold that. A full entity component
system, with components in global tables, buys cache locality that means
nothing at a few hundred entities, and costs debuggability and type safety.

The cost is two concepts where one class would do, and losing the compiler's
guarantee that a creature has a brain or a way to eat. A new kind of capability
costs one component, plus a new rule or world process, or a branch in an
existing one.

## Terrain

One question separates an entity from a tile field: can the thing be created
and destroyed apart from its tile? Grass, water, rock and ash can, so they are
entities. Elevation, moisture and temperature cannot, so they are fields on the
grid. Fire is neither. It is a component on whatever burns, so it burns grass,
rabbits and wolves through one rule. Also asking whether there can be more than
one on a tile misfiles water, which is one per tile and still an entity that
blocks.

Burnt grass returns with a new id, so anything holding an id across days, such
as the page's selection, lets it go when the id stops resolving.

## Geometry

The grid owns the directions and the distance, and nothing outside it
enumerates directions or measures. There are four directions. Sight is
straight-line and movement is Manhattan, so a corner tile is visible and two
steps away. Eight directions would let a diagonal step cover 1.41 tiles for the
price of one, and anything chasing a target would evolve to prefer diagonals. A
hexagonal grid removes the mismatch and costs the page axial coordinates and
hexagon hit-testing. It waits in `docs/ideas/hexagonal-grid.md`, and because
only the grid knows the shape, switching stays a contained change.

## Components that update themselves

Every component may tick once a day. A tick sees only the component's own
state and the values its spawn handed it, and returns the cause its carrier
ends with, or nothing. The Tick step walks entities in id order and their
components in the order the species lists them. The first cause ends the
carrier, so one that starves and ages on the same day counts under whichever
component is listed first. A metabolism ends its carrier as starved, a lifespan
as aged, and the feeding rule ends what it eats as eaten. The brain is not
ticked and holds no state that changes by the day.

A tick cannot see the world, so anything that needs a neighbour or a tile, such
as fire spreading, is a world process. Letting each entity run its whole day
was the 2022 model and loses three ways: two rabbits on one grass would be
settled by update order rather than speed, legality would spread into every
creature type, and an early creature would change what a later one sees that
day. A lifespan as a daily chance of ending carries no age, draws from the
generator for every carrier every day, and needs dice to test.

A cause is a string, so a typo shows as a new cause in the census.

## Traversal and scale

No rule or process walks the entity collection or the grid directly. Every
traversal is a query on the world or the grid that returns a fresh list, so a
caller can
spawn and remove while walking it, and an id that no longer resolves is
skipped. An index or a spatial structure can then arrive behind the same query
without a caller changing.

The entity model stays one type. Splitting it into actors with brains and props
without was the other way to make deciding cheap. It loses on two rules: a
tile's occupants come back in one id order, which two collections would merge
on every query, and a brain can be added to anything, which a split turns into
moving an entity between Java types.

A query hides its cost. Asking for everything with a component is a full scan
behind a lookup's name, and nothing but reading enforces the rule.

Two scale costs are known and unfixed. Ground cover as entities means one
entity per tile on a covered world, which is nothing at hundreds of tiles and
real work at tens of thousands. A day is a full pass over every step, with no
notion of a quiet region to skip.
