# Perception

A perception is what one creature senses from where it stands: the tiles in its
view with their fields and occupants, its own components, and the grid's
distance. There is one perception type, and a sense fills it, a component that
builds the perception. A species that senses differently carries a different
sense, and every brain takes the same input, so giving a wolf smell is a new
sense in its recipe and changes no brain.

A perception type per species or per sense makes every brain generic in its
input and the tests a matrix of brains against perceptions. A summarised
perception, such as the direction of the nearest food, is pleasant to write a
brain against and decides in advance what may matter. That is the opposite of
the vision, where a wolf avoids a burning tile without anyone introducing fire
to wolves. String tags make a typo a silent miss.

## What can be seen

Every component declares what its carrier sees of it and what others in range
see, which may be nothing, and neither has a default. A creature reads its own
reserve while its neighbours cannot, so a predator cannot see how close prey is
to starving. What one creature can know about another is a choice each
component makes, readable from a species' components without running anything.
A sense that sees more, such as an eye that tells who is weak, would be a new
sense with access to what others keep to themselves.

A perception carries no genes, since a brain closed over its own at birth, and
no absolute position. Positions are relative, and a tile off the grid is absent,
which is how an edge is perceived. Distance comes from the grid through the
perception, so a brain never measures. Tiles come sorted by distance, then by
row and column, and the entities on a tile by id, so a brain that takes the
first match replays.

## Features

A brain reads the features others show rather than naming component classes. A
feature is a named fact, such as carrying plant food or taking meat. Every
feature is a constant in one catalog, so a misspelt feature does not compile,
and a test fails on a component showing one the catalog lacks. A new visible
component costs its features in the catalog, and every species with the
scoring brain gains pull genes for them at 0, so nothing reacts until selection
moves them.

A brain that named classes needed an `if` and a gene written for each fact, so
a new component reached no creature until someone edited every brain. Creating
a gene the first time a creature sees a feature gives one species two gene
lists. Taking features from the species a world holds makes a rabbit's genome
depend on whether wolves exist. A catalog is neither.

Same species is not a component, so it is not a feature, and a creature cannot
tell its own kind from another showing the same features.
`docs/ideas/kin-recognition.md` keeps that.

A perception and the snapshot a person sees are the same idea at two ranges and
stay two types, since the snapshot has no perceiver and carries drawing data
that has no place in a decision.
