# Genes and settings

Every number a rule reads is a gene or a setting. It is a gene when it varies
between individuals and passes to a child, and a setting otherwise. A gene's
bounds and mutation size are declared in its species' layout, so they are part
of the recipe too. A literal in a rule is a bug.

## Genes

A species declares a layout of gene specifications, and a genome holds values
for it. Every gene today is a bounded scalar, which mutates by an offset drawn
uniformly within its mutation size and is clamped to its bounds. The shape type
is sealed, so a new shape, such as a network's weights, is a case every switch
must handle. Adding an evolvable trait is one entry in a layout.

A record of typed fields per species was the alternative. A typo would not
compile, but every species would need its own mutation, and a gene's bounds
would have nowhere to live. Keys are strings, so a typo is a loud failure at
run time instead.

Traits that are whole numbers, such as view range, are stored continuous and
rounded where read, so selection still sees small differences.

Reproduction is asexual: a child is its parent's genome, mutated. Its reserve
is paid by the parent as part of breeding, so every day a child lives was paid
for by food someone gathered. A child with no reserve starves before it can
eat, and a grace period gives days of life that no food paid for.

A world setting turns mutation off, so children and spawns are exact copies and
a world can be a control whose creatures never change. A scale on every
mutation size was the alternative, and nobody wanted values other than 0 or 1.

The mutation size is not a gene, so it cannot come under selection, and the
child reserve is a setting. Either could become a gene with no new shape.

## Every gene needs a tradeoff

A gene that only helps pins to its bound and stops varying. Speed and view
range are charged against the reserve, in proportion to speed and per tile of
rounded range, folded into the eating charge so a creature's days left stays one
formula. A charge is a placeholder. The wanted kind is specific to the trait,
such as far sight blurring what is close, and `docs/ideas/gene-tradeoffs.md`
holds that. Coupling speed to how far a creature may move is another cost and
stays available, but taking two at once would make a failed experiment
unreadable. Whether a charge is right is measured rather than designed: a speed
mean that pins to its bound means the charge is too small.

## Settings

A setting is declared with its default and what an editor needs to show it,
such as a slider, a choice or a toggle, so the page generates its panel and a
new setting appears there with no page code. Every setting has a default, so
nothing needs configuring before a run is watchable. A plain map of numbers
cannot render an editor or keep a value in range, and typed records per species
would need a panel each.

A species or a world process owns its declarations, which stay an immutable
recipe. Each world keeps its own table of current values, grouped by owner, and
components and processes read them live, so an edit reaches every creature
alive in that world and no other. Reading live from the species let one world's
edit reach every world on the server, and building fresh species per world
made a species mutable.

Two commands change the table: one sets a value, checked against its
declaration and stored exactly on its step, and one restores defaults for a
setting, an owner or everything. Restoring by having the page send defaults back
would restore what an old tab believes the defaults are.

A world's dimensions and starting population are inputs, not settings. The
dimensions are read only when the world is built, and the starting population
is spawn commands.

Bounds keep a value in range and say nothing about whether it is sensible,
which is the point of being able to edit it. Changing a default is a code
change.
