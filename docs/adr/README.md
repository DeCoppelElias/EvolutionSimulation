# Decisions

One file per topic, named by the topic, such as `the-day.md`. When a choice on
a topic changes or grows, rewrite that topic's file so it states the current
decision. Write a new file only for a new topic. Never number a file, whatever
another skill's format says. Git keeps the history.

A decision belongs here when it is hard to reverse, would surprise someone
reading the code, and came from a real trade-off. Anything else lives in the
code and its tests.

A file holds a title, then in a few sentences the context, the decision and
why. Add the rejected options only when the reason they lost is worth
remembering, and the consequences only when they are not obvious.

The list below groups the topics by area, one line each. It is the map: read
it to find which decisions bear on a piece of work.

## World

- [World model](world-model.md) entities carry components, species are the
  recipe, terrain splits on whether a thing can be destroyed, the grid owns
  geometry, components tick, traversal goes through queries.
- [Actions](actions.md) a brain returns one intent from legal options, one rule
  per action, feeding takes the tile, a predator kills by eating, and who
  decides.
- [The day](the-day.md) one method in fixed steps, decide before resolving,
  speed orders the resolve, a creature eats at the end of its turn.
- [Replay](replay.md) one named generator, id order, commands at the day
  boundary, and a run replays from its seed and log.

## Creatures

- [Perception](perception.md) one type filled by a sense, each component
  declares what is seen of it, a catalog of features.
- [Brains](brains.md) rules first and a network later, a baseline genome, and
  the scoring brain's pulls and softmax.
- [Genes and settings](genes-and-settings.md) every number is a gene or a
  setting, genes need tradeoffs, and each world keeps its own values.

## Running

- [Architecture](architecture.md) a Java core on `java.base`, hexagonal,
  checked by `jdeps`, DDD for vocabulary, wired by hand.
- [Commands and snapshots](commands-and-snapshots.md) what crosses the
  boundary: snapshots and census rows out, checked commands in.
- [Serving](serving.md) Javalin and SSE, a thread per world, latest-only
  viewers, and different idle rules for people and agents.
- [Experiments and training](experiments-and-training.md) `run`, comparing
  variants, the ancestor competition, and how a model makes new brains.

## Page

- [Interface and art](interface-and-art.md) a React and PixiJS workbench,
  whole-pixel scale, motion between days, and pixel art drawn for the project.

## Engineering

- [Code standards](code-standards.md) Java 25, warnings fail the build, nothing
  is null, exact versions.
- [Testing](testing.md) test first through the domain's own surface, seeded
  loops, no coverage tooling, experiments for selection.
- [Workflow](workflow.md) groundwork's documents, local merges, vertical
  slices.
