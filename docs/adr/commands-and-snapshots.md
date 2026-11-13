# Commands and snapshots

## State leaves as a snapshot

Each day the world returns a report holding an immutable snapshot of everything
and that day's census row, and the caller hands each on. There are no listeners.
A snapshot lets a client draw from one message, where events make it replay
history and dirty regions make it ask. At tens of thousands of tiles dirty
regions become the answer, and a method returning changes since a version would
be additive.

The snapshot holds the seed, the day, the dimensions, the species, every
setting's current value, and each tile's fields and occupants, with each
entity's species, sprite, whether it is a creature, its genes and the values
worth showing a person. The viewer is a person, so what creatures may perceive
does not limit it. Genes are kept apart from shown values, because an export
reads them back as a spawn's genes. A separate query for genes would be a
second way to read what the snapshot carries anyway.

Each component declares the values it shows a person, by name, with no default.
Reflecting over every field shows a new component for free, and leaks values
that mean nothing to a person under names from code that collide. Writing them
by hand in the world means editing the world for each one. Two components of
one carrier showing the same name is a species bug, and the snapshot refuses it.

A census row holds the day, each known species' population, the mean of each
gene per species over the members alive at the end of the day, and the day's
deaths per species by cause. A species that died out stays at zero, so a chart
line does not break. A species with no members or no genes has no means, since
a zero would read as real. The history of rows belongs to whoever reads them,
so resetting the statistics is an adapter clearing its own history, not a
command.

## Commands go in

Commands are the only way in: spawning, resetting, editing or restoring a
setting, and anything else the interface starts later. The interface never
calls a model method that is not one. Each command is a type to write where
reaching in was free.

A command is checked before it changes anything. A bad one, such as an unknown
species, a position off the grid or a gene override out of bounds, throws and
leaves the world as it was, and the adapter turns that into an error for the
sender.

A world is built from its width, height, seed, species and processes, and
starts empty on day 0. Its starting population is spawn commands, sent on day 0
and again after a reset, so the seed and the log describe a run from its first
creature. A starting population given at construction kept the first creatures
out of the log, and resetting to it matched nothing construction produced. Each
adapter carries its own default population.

A spawn names its species by name, which keeps the command a plain value that
reads the same in the log as on the wire. A spawn of a count places each member
on an independently drawn tile, and may override genes, so an experiment can
start from a worse genome and the log says so. Building a species with another
baseline would leave the log silent about it.

A reset carries its seed, keeps the dimensions, species and edited settings,
and starts ids and days again, so a viewer treats a changed seed or a day going
backwards as a new run.

The world has no paused state. A paused adapter asks the world to apply what is
pending, which returns a snapshot without advancing the day, so food clicked
onto a paused grid shows at once. A paused flag would fill the log with commands
that change nothing, and applying whenever no day is running races once the
world has its own thread. That snapshot keeps the current day number, so the
counter does not jump on a click.

While a world runs, a command shows on the next day. That reads as immediate at
a few days a second, and not at one day every ten seconds.
