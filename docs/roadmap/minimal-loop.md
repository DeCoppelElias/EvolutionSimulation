# Minimal loop

Status: done.

The first commit deletes the 2022 code, its tests, and the Swing smoke-test
skill with its tool under `tools/gui-smoke-test/`, and the pom loses JFreeChart,
the headless test property and its Swing description. The build moves to Java
25, in the pom and in both workflows' `java-version`, compiles with every
warning as an error, formats every file with no Spotless ratchet, and adds
AssertJ and picocli, per
[code standards](../adr/code-standards.md). The
README is replaced with a short one saying what the project is becoming, how to
build it and how to use `run`. `AGENTS.md` follows the tree from then on.
Everything new lives under `io.github.decoppelelias.evolutionsimulation`, with the
domain as one flat package, `run` in `.cli` and `Main` at the root, per
[architecture](../adr/architecture.md).

A world with a four-direction grid that owns distance, and `Entity`, `Species`,
`Component` and a `Genome` whose values are checked against `GeneSpec.Scalar`
and `GeneSpec.Simplex` declarations when it is built. Mutation waits for
[breeding and settings](breeding-and-settings.md). A day decides, orders, resolves and takes its census, in that order, and
`advance()` returns the day's snapshot and census row together. Feed, metabolise
and the world processes join the day in [eating and starving](eating-and-starving.md), where they first do something.
Rabbit is the one species. Its brain picks uniformly among the directions its
`Options` carry plus `Idle`, and rolls a `Move`'s distance from its step
distribution. The resolver walks a move a tile at a time and stops at the edge.
The day's order is a shuffle over id order, which is already the rule for
entities without a speed gene. The decide step hands each brain a `Perception`,
built through the default circular sense even though the random brain ignores
it, and an `Options` holding the grid's directions, per
[actions](../adr/actions.md).

A world is built from a width, a height, a seed and its species, and starts
empty. Rabbit's species carries a baseline genome: view range 3, bounded 1 to 10
with a mutation size of 1, and a step distribution of 0.6, 0.3 and 0.1 over
distances one to three, bounded to lengths one to three with a mutation size of
0.2. The mutation sizes are the 2022 ones, and nothing reads them until [breeding and settings](breeding-and-settings.md).
Every rabbit gets the baseline unchanged, since there is no mutation yet.
`Setting` waits for [eating and starving](eating-and-starving.md), the first time a rule reads one, so a species
carries no settings until then.

Commands cover spawning by count at random tiles or at a position, naming the
species, and resetting the world with a new seed. A count places each rabbit on
a tile drawn independently from the whole grid. A reset leaves the world exactly
as constructing it with that seed would: empty, on day 0. The day counter counts
days completed, so a new world is on day 0, and a snapshot from `applyPending`
keeps the current day. The world has `submit` and `applyPending`, and no paused
state. Its command log is kept in memory, and `DeterminismTest` replays a seed
plus a log into a second world and compares the snapshots. A census row per day
replaces the population counting that parses display strings. A `jdeps` test
fails when the domain depends on anything outside itself and `java.base`.

`run --days` advances one world and prints its census as JSON Lines, one line
per day from day 1, such as `{"seed":42,"day":1,"population":{"rabbit":10}}`.
`--seed` defaults to the clock, `--width` and `--height` to 20, and `--spawn
rabbit=10` gives the starting population, which a given `--spawn` replaces, per
[experiments and training](../adr/experiments-and-training.md).

2022 features that come back here: random wandering with an idle chance of one
in five. The 2022 edge handling, which rerolled a move up to ten times and then
stood still, is replaced by walking until blocked.

A second determinism test runs `run` twice with one seed in two separate JVMs
and compares the output byte for byte, since an iteration order that changes per
process passes every test inside one. The census in this entry is a rabbit count
that never changes, so the test also compares every day's full snapshot printed
by a test-only probe, per
[replay](../adr/replay.md).

Regression rules that land here: the census covers every recorded day, movement
never walks off the step distribution, and every command validates before it
mutates anything.

On the screen: nothing in a browser yet. `run --seed 42 --days 100` prints one
line per day with the rabbit count, and the same seed prints the same lines,
in two separate processes as well as within one.
This entry and [serving worlds over HTTP](serving-worlds-over-http.md) are
watched as data rather than on the page, per [workflow](../adr/workflow.md).

See [workflow](../adr/workflow.md),
[world model](../adr/world-model.md),
[actions](../adr/actions.md),
[the day](../adr/the-day.md),
[genes and settings](../adr/genes-and-settings.md),
[architecture](../adr/architecture.md),
[commands and snapshots](../adr/commands-and-snapshots.md),
[replay](../adr/replay.md),
[testing](../adr/testing.md),
[perception](../adr/perception.md),
[experiments and training](../adr/experiments-and-training.md),
[code standards](../adr/code-standards.md).
