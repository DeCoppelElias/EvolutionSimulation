# EvolutionSimulation

A world of creatures on a 2D grid that you watch evolve.

This file is the glossary and nothing else: each word the project uses for its
own concepts, defined in a sentence or two, with the words to avoid. No
implementation, no decisions, no code. A general programming term does not
belong here.

## Language

**World**:
One simulation: a grid, the entities on it, one random generator and a day
counter.
_Avoid_: game, level, map

**Grid**:
The shape of a world. It owns the tiles, the directions and the distance
between two tiles.
_Avoid_: board

**Tile**:
One square of the grid, holding its fields and any number of entities.
_Avoid_: cell, square

**Field**:
A number that belongs to a tile itself and cannot be removed from it, such as
elevation.

**Entity**:
Anything that occupies a tile and can be created or destroyed on its own: a
rabbit, a wolf, a patch of grass.
_Avoid_: object, thing, content

**Creature**:
An entity with a brain.
_Avoid_: agent, animal, actor

**Species**:
The recipe for a kind of entity: its genes, baseline, settings, brain and
starting components. It never changes while a world runs.
_Avoid_: type, class, kind

**Component**:
One capability an entity carries, with the state it needs, such as a
metabolism or being on fire. An entity's components are also called its
parts.
_Avoid_: trait, flag

**Brain**:
The component that picks a creature's intent each day.
_Avoid_: AI, policy, controller

**Sense**:
The component that builds a creature's perception.

**Perception**:
What one creature can see from where it stands, relative to itself.
_Avoid_: observation, view

**Feature**:
A named fact a component shows to creatures in range, such as carrying meat or
eating plants.
_Avoid_: tag

**Action**:
Something a creature can do: move, breed or idle.

**Option**:
An action the world offers a creature today. Only legal ones are offered.

**Intent**:
The one action a creature chose for today.
_Avoid_: move, command, decision

**Rule**:
The world's procedure for one action, saying what it offers and what happens
when it is chosen.

**World process**:
A rule the world runs over everything once a day, such as spawning food.

**Day**:
One advance of a world: commands, decide, resolve, tick, world processes,
census.
_Avoid_: turn, tick, step

**Turn**:
One creature's part of the resolve step, ending with it eating.

**Tick**:
The step of a day in which each component updates itself.

**Cause**:
The reason an entity ended, such as starved, aged or eaten.

**Reserve**:
The food a creature holds, counted in days. It starves when the reserve runs
out.
_Avoid_: energy, health, hunger

**Eater**:
The component naming the foods a creature takes.

**Gene**:
A number that varies between individuals and passes to a child, mutated on the
way.
_Avoid_: trait, parameter

**Genome**:
One entity's gene values.
_Avoid_: DNA, chromosome

**Gene layout**:
The species' declaration of which genes exist, with their bounds and mutation
sizes.

**Baseline**:
The genome a species' first generation starts from.
_Avoid_: default genome, template

**Pull**:
A gene in the scoring brain that weighs one feature, toward it or away.

**Whim**:
The gene for how loosely a creature follows its scores.
_Avoid_: temperature, randomness

**Speed**:
The gene that decides who resolves first in a day.
_Avoid_: using it for how fast a world plays

**Playback rate**:
How many days a second a world plays.
_Avoid_: speed

**Setting**:
A number a rule reads that is the same for every member of a species or for the
world, declared with a default and editable on the page.
_Avoid_: parameter, config, option

**Command**:
A request into a world from outside, such as a spawn or a setting edit, applied
at the start of a day.
_Avoid_: action, event

**Command log**:
Every command a world applied, with the day it applied on. With the seed it
replays a run.

**Seed**:
The number a world's random generator starts from.

**Snapshot**:
The whole world as a person sees it, after a day.
_Avoid_: state, frame

**Census row**:
One day's counts: population, gene means and deaths by cause, per species.
_Avoid_: stats, metrics

**Run**:
One world advanced from its seed for some days, watched or headless.

**Variant**:
One version of a world in a comparison, named and given its own flags.

**Preset**:
A named experiment's settings, kept in a file.

**Gate**:
An acceptance line a roadmap entry must pass by experiment rather than by unit
test.

**Export**:
The genomes alive in a run on a given day, written out to start another run.
_Avoid_: save
