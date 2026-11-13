# AGENTS.md

Simulation of creatures evolving on a 2D grid, being rebuilt from a 2022 Swing
application. README.md says what it does today and how to run it.

## Documents

The documents follow groundwork, the Claude Code plugin this project enables
in `.claude/settings.json`.

- `DESIGN.md` what EvolutionSimulation is for. Read it before proposing a
  feature.
- `CONTEXT.md` the glossary. Use its words.
- `docs/adr/` the decisions, one file per topic. Its README maps them by area.
  Read the ones that bear on a change before making it.
- `docs/ideas/` what is wanted and not decided. A new idea goes here without
  asking, in the format its README gives.
- `docs/roadmap/` the committed build order, listed in its README.

Each document says at its top what it holds and never holds. When you are not
sure where something belongs, ask Elias rather than picking. Link a decision or
an entry rather than restating it.

`groundwork-docs-check` checks links, indexes and status lines. Run it after
changing any document. CI runs it at a pinned version, and the pre-commit hook
runs it where the plugin is installed.

The work plan under `docs/superpowers/plans/` tracks finer-grained work in
progress. It is gitignored and may be missing from a fresh clone.

Keep this file mechanical. Anything about why the system is shaped the way it
is belongs in the decisions.

## Asking

Ask Elias before promoting an idea onto the roadmap, changing an accepted
decision, adding or reordering roadmap entries, and before any push, merge or
tag. Asking means giving the options with a recommendation and waiting, not
deciding and asking for confirmation afterwards. Before changing a decision,
say what the change touches and ask his reason if he has not given it.

Promoting an idea settles its scope and placement. Its open questions wait for
the grill of the entry that builds it, unless scope or placement depends on
them. What a changed decision drops and is still wanted goes to `docs/ideas/`.

When a document has drifted or holds something outside its lane, report it
with the fix you propose, and change it only after Elias says go.

Grill with `grill-with-docs`, one question at a time, with the context and
your recommendation inside the question. Answer from the code and the
documents whatever they can answer. A grill writes nothing to the documents
until it ends, except a deferred idea. Then it sends a summary of every choice
and the changes it makes, and applies them on a branch after Elias says go.

The 2022 code was deleted by the minimal loop. `git log --diff-filter=D
--format=%h -1 -- src/main/java/Main.java` names that commit, and
`git show <commit>^:<path>` reads a file from before it.

## Roadmap entries

Starting an entry:

1. Read the entry, the decisions it links and any plan in
   `docs/superpowers/plans/`.
2. Grill the details it leaves open, then branch off `master` as
   `entry-<slug>`.
3. Write the plan with superpowers:writing-plans, each acceptance line next to
   the task that meets it. Elias reviews the plan before any code.

Build each task with superpowers:test-driven-development and verify with
`./mvnw verify` and the `run` command. A change to what the page shows needs
Elias to watch it, so say what to look at.

An entry is finished when:

- superpowers:verification-before-completion passes on fresh output;
- every acceptance line names a test that failed before its code existed;
- superpowers:requesting-code-review has run and its findings are handled;
- its status reads `done`, `README.md` describes what it built, any idea it
  built is marked `built`, and any choice made on the way is in its decision;
- `groundwork-docs-check` is clean;
- anything an agent got wrong twice during the entry has become an
  `AGENTS.md` line or a check in `tools/`, and Elias has been told which.

Then it merges on his go, as in Branches. If the session ends first, write a
handoff with the handoff skill, since the plan does not travel.

## Tools

    python tools/compare.py tools/experiments/watchable.json    compare variants over seeds
    python tools/compare.py tools/experiments/predator.json     the predator entry's wolves
    python tools/compare.py tools/experiments/fleeing.json      the fleeing entry's wolves and rabbits
    python tools/test_compare.py                                 its tests

`compare.py` needs a jar from `./mvnw package`. When checking a report against
an acceptance line, read the raw `p` for the measure the line names, and `pHolm`
only when scanning the whole report. CI runs `test_compare.py`.

    python tools/ancestor_competition.py tools/experiments/rabbit-learns-gate.json    the rabbit-learns gate
    python tools/ancestor_competition.py tools/experiments/rabbit-flees-gate.json     the fleeing gate
    python tools/test_ancestor_competition.py                                          its tests

The rabbit-learns gate takes about five minutes and the fleeing gate about
seven. Both need the same jar, and CI runs the tool's tests.

## Branches

- A roadmap entry is built on its own branch off `master`, named
  `entry-<slug>`, such as `entry-hosting`.
- Other work, such as a docs change, gets a short branch named for what it
  does, such as `docs/standards-grill`.
- When the work is finished and reviewed and Elias says go, merge it into
  `master` locally, push `master`, and delete the branch. There are no pull
  requests. CI runs on the push.
- `master` always holds finished work, never half an entry.

`docs/adr/workflow.md` says why.

## Layout

- `src/main/java/io/github/decoppelelias/evolutionsimulation/` `Main` at the root,
  `domain/` the model, one flat package with the public `World` and the values
  that cross its boundary, `web/` the Javalin API that `serve` starts, and
  `cli/` the picocli `run` and `serve` commands.
- `src/test/java/` mirrors those packages, so tests reach package-private types.
- `frontend/` the React and TypeScript page, with pure modules in `src/` and a
  Vitest file beside each. Vite builds it into `target/classes/public`, which
  Javalin serves at `/`.
- `art/` the pixel art. `sprites.py` holds every sprite as a text grid with its
  palette and marking regions, and running it rewrites `art/png/` and
  `frontend/src/sprites.json`, which the page draws from. Edit the grids, never
  the outputs.

## Build and run

    ./mvnw verify     compile, check formatting, run tests
    ./mvnw package    also build target/EvolutionSimulation.jar
    java -jar target/EvolutionSimulation.jar run --seed 42 --days 100
    ./mvnw verify -Pskip-frontend    Java only, no page in the jar
    ./mvnw frontend:npm "-Dfrontend.npm.arguments=run format"    format the frontend
    ./mvnw frontend:npm "-Dfrontend.npm.arguments=run dev"       Vite with hot reload, beside a running serve
    python art/sprites.py    rewrite the sprite PNGs and sprites.json, needs Pillow

The build downloads its own Node into `target/node`, so none is needed on PATH,
and `frontend:npm` needs a build to have run once since a `clean`. Vitest strips
types without checking them, and only `run build` runs `tsc`, so run it after a
frontend change as well as `test`.

Java 25, and every compiler warning fails the build. After deleting, moving or
renaming a class, run `./mvnw clean verify`, since stale classes left in
`target/` keep compiling and running otherwise. Write Java source with a file
tool rather than a shell heredoc, which on this Windows setup has collapsed a
doubled backslash into one and silently changed string literals.

No `mvn` on PATH is needed, the wrapper fetches it. Dependencies are pinned in
`pom.xml`, and the enforcer plugin fails the build on a version range or a
snapshot. npm packages are pinned to exact versions with a committed
`package-lock.json`, and `npm ci` installs them. Let Dependabot propose upgrades
for both.

CI runs `./mvnw -B verify` on Linux and Windows, on pushes to `master` and on
pull requests. A `v*` tag builds the jar and attaches it to a GitHub Release,
taking the version from the tag, so the pom stays on `-SNAPSHOT` between
releases and never needs a manual bump. The jar is byte-reproducible.

A change to a species' genes or to what draws from the generator changes every
seeded run, so rerun the sample output in `README.md` from the new jar.

## Comments

Three rules. A comment describes the current state, never how the code got
there. It exists only if it says something the code does not already say. It
stays short.

So no changelog in comments, no "used to", no restating the line below, no
commented-out code, and no long block where a clause would do.

    python tools/comment-check.py --staged

Enable it as a pre-commit hook with `git config core.hooksPath .githooks`, once
per clone. It checks staged files only.

## Formatting

Spotless with palantir-java-format checks every Java file in `./mvnw verify`.
Run `./mvnw spotless:apply` before committing. Prettier checks the frontend, and
ESLint fails it on any warning. Run the `format` command above before
committing.

## Before writing tests

Write the test first, run it, and see it fail for the reason it names before
writing the code that makes it pass. `docs/adr/testing.md` says why. When the
code already exists, break it on purpose, watch the test fail, and restore it.
A compile error counts as that failure only while the behaviour does not exist
yet, and a break counts only if the test can see it.

Name the plausible wrong implementation a test must reject, and check the
fixture can tell it apart: a creature already alive before an edit, values
spread wide enough that a fresh draw lands outside a parent's reach, an error
message that names the rule rather than a missing key.

Assertions use AssertJ. A world for a test is `new World(width, height, seed,
species)`, which owns the one generator everything draws from, so a seeded test
replays exactly. `TestSpecies.walker(intent)` gives a species whose brain always
returns one intent, for testing the resolver. Test a brain by handing it a
`Perception` and an `Options`, with no world.

`ApiTest` drives a running server through `HttpTestClient`. A request for the
event stream needs `Accept: text/event-stream`, or Javalin answers with an
empty body.

A test of concurrent code waits for the state it needs, with a latch or a
condition polled against a deadline, and never assumes which thread gets there
first. Run blocking test work on its own virtual threads, not the common pool:
a test that leaves pool threads blocked hangs whichever test runs after it.

`DeterminismTest` replays a seed and a command log in one process, and
`ReplayAcrossProcessesTest` runs two JVMs. `DomainBoundaryTest` fails when the
domain depends on anything outside itself and `java.base`.

A rule the page follows goes in a pure module under `frontend/src/`, tested
with Vitest and no DOM. Components, `useWorld.ts` and `scene.ts` stay thin glue
over those modules. A change to what the page shows needs Elias to watch it.

`v1.0-original-2022` and the `original-2022` branch hold the 2022 version, with
the old IntelliJ files, the flat `src/` layout and a committed jar. Both are
immutable. Land changes on top of `master`.
