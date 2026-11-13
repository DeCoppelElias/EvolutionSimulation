# EvolutionSimulation
[![CI](https://github.com/DeCoppelElias/EvolutionSimulation/actions/workflows/ci.yml/badge.svg)](https://github.com/DeCoppelElias/EvolutionSimulation/actions/workflows/ci.yml)

A small world where creatures evolve by natural selection, and you watch it
happen in your browser.

![Rabbits and wolves moving across a pixel-art meadow](docs/media/world.gif)

Every creature carries genes that decide how it behaves: how strongly it is
drawn to food, how far it sees, how fast it moves, how much it shies away from
others. A creature that eats well lives long enough to breed, and its children
inherit its genes with small random changes. Nothing scores the creatures and
nothing picks the winners. The ones that survive simply leave more children, so
over a few hundred days the population drifts toward whatever works.

Nobody tells a rabbit that wolves are dangerous. A rabbit only sees that
something nearby eats meat. Put wolves in its world and, generation by
generation, rabbits evolve to keep further away from them.

## What you can do

Create worlds from a seed and watch them play at up to ten days a second, or
fast-forward thousands of days. Click any creature to see its genes, its
reserve and how far it sees. Chart the population of each species over time.
Drop new creatures in, change any rule of the world with a slider while it
runs, or turn mutation off and watch evolution stop. The same seed always
replays the same world, so a strange run can be watched again.

![The Inspector showing a rabbit's genes and its view range](docs/media/inspector.png)

![The population chart in dark mode](docs/media/population-dark.png)

It works on a phone too, and the page follows your system's light or dark
setting. The pixel art is drawn for the project, and a creature's markings
follow its genes, so relatives look alike.

## Try it

You need Java 25. The build fetches Maven and Node itself.

    git clone https://github.com/DeCoppelElias/EvolutionSimulation.git
    cd EvolutionSimulation
    ./mvnw package
    java -jar target/EvolutionSimulation.jar serve

`serve` opens the page in your browser. Create a world, press play, and open
the World panel to spawn a few wolves. On the page, Space plays and pauses,
plus and minus zoom, and a click on a creature inspects it.

## How a creature decides

Each day a creature scores every tile it could reach by what it sees there,
and moves to the best one. What it sees are features: `Plant` or `Meat` for
food, and `takes.Plant` or `takes.Meat` for something that eats it. Each
feature has three genes. `near.X` pulls toward the nearest one, `hungry.near.X`
adds to that pull as the creature gets hungry, and `sum.X` pulls by closeness
to all of them. Any pull can go negative, so a rabbit can evolve to walk away
from food and starve for it. Fleeing wolves comes from `near.takes.Meat`
drifting below zero.

## For tinkerers

Everything below needs the jar from `./mvnw package`.

**Headless runs.** `run` advances a world without a page and prints one JSON
line per day: each species' population, the mean of every gene and the day's
deaths by cause.

    java -jar target/EvolutionSimulation.jar run --seed 42 --days 300
    java -jar target/EvolutionSimulation.jar run --seed 1 --days 500 --spawn rabbit=40 --spawn wolf=6 --set-at 200:world.grassPerDrop=3

`--set` and `--set-at` change settings, `--gene` changes a starting gene,
`--export` saves the creatures alive on a given day and `--spawn-from` starts a
new world from them. `run --help` lists everything.

**Experiments.** `tools/compare.py` runs variants of a world over many seeds in
parallel and reports how each fared, with medians, effect sizes and
Mann-Whitney tests. `tools/ancestor_competition.py` checks that evolution did
something, by setting evolved rabbits against copies of their ancestors. Both
need only Python 3, and the presets live in `tools/experiments/`.

    python tools/compare.py tools/experiments/fleeing.json
    python tools/ancestor_competition.py tools/experiments/rabbit-flees-gate.json

**HTTP API.** `serve --no-browser --port 0` holds worlds behind a JSON API,
which the page and scripts both use. It prints its address on one line when it
is ready.

    curl -X POST localhost:PORT/worlds -d '{"seed":42}'
    curl -X POST localhost:PORT/worlds/ID/commands -d '{"type":"spawn","species":"rabbit","count":10}'
    curl -X POST localhost:PORT/worlds/ID/step -d '{"days":500}'
    curl localhost:PORT/worlds/ID/census?from=498

Worlds can also play on a timer, stream each day as server-sent events, list
and change their settings, and return their full command log.
`serve --host 0.0.0.0` lets a phone on the same network open the page.

## Building

    ./mvnw verify                    compile, check formatting, run the tests
    ./mvnw verify -Pskip-frontend    the Java alone, serving the API without a page
    ./mvnw frontend:npm "-Dfrontend.npm.arguments=run dev"    the page with hot reload

The simulation is Java with Javalin, and the page is React and TypeScript drawn
on a canvas. The art lives as text grids in `art/sprites.py`.

## Where it is going

`DESIGN.md` describes what the world is meant to become, `docs/roadmap/` how
far it has got, and `docs/decisions/` why it is shaped the way it is. Next
come small effects for births, deaths and kills, and a hosted version anyone
can open.

The project started in 2022 as HumanSimulation, a Swing app of humans looking
for food. That version is kept on the `v1.0-original-2022` tag.
