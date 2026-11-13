# Architecture

## A Java core

The core is Java and depends only on `java.base`. TypeScript throughout was the
strongest alternative: the app would be a static link, and the same core would
run in Node for agents, but it gives up Java, which Elias works in. TeaVM keeps
Java in the browser at the price of a niche toolchain, and a Rust core is fast
and a steep first language for a project that needs no speed at a few hundred
tiles. A day at the target size takes well under a millisecond, and JVM startup
is the only cost an agent notices. A core on `java.base` alone keeps compiling
it to the browser with TeaVM possible, if hosting costs ever matter.

## Hexagonal

The domain lives in `io.github.decoppelelias.evolutionsimulation.domain` and
depends on nothing but itself and `java.base`. Commands are its one way in, and
the snapshot and census its way out, as
[commands and snapshots](commands-and-snapshots.md) says. The web adapter and
the command line sit outside. No simulation rule lives outside the domain: in
2022 food regrowth lived in the interface's automatic advance, so a headless run
spawned no food.

A test runs `jdeps` over the compiled classes and fails when a domain class
depends on anything else, naming the class. A separate Maven module would be a
compile-time guarantee and restructures the build. A second compiler run over
the core package was tried and let through classes the rest of the build had on
its classpath. A violation fails the tests rather than the compile.

The domain is one flat package. The world and the values crossing its boundary
are public and everything else is package-private, so nothing reaches past the
world. Subpackages would make every type crossing between them public, which
lets adapters reach the internals too. `docs/ideas/domain-subpackages.md` keeps
that.

## Domain-driven, for vocabulary

The model takes domain-driven design's vocabulary and tactical patterns. The
world is the aggregate root and nothing inside it changes except through it,
entities are known by id, and positions, genomes, intents and perceptions are
immutable values. `CONTEXT.md` is the ubiquitous language, and a new concept
gets its word there before it gets a class.

It does not take rich objects per kind, a `Rabbit` that knows how to eat, which
is the class tree [world model](world-model.md) rejects. Behaviour lives in the
rules of a day, so a reader expecting DDD finds creatures without behaviour.
Bounded contexts, repositories and domain events organise nothing in one
simulation with nothing persisted.

## Wiring

Collaborators are injected by constructor, by hand, and `Main` builds the world
and the adapters. A dependency injection container buys configuration for about
a dozen collaborators, at the cost of startup magic.
