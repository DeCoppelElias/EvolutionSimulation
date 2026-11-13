# Brain library

Status: idea. Exporting and spawning genomes through `run` is built,
[experiments and training](../adr/experiments-and-training.md).

## What it does

Saves the genome of a creature whose behaviour you like, and loads it later as
a species' baseline or as the genome of a spawned creature. A saved brain is a
genome plus the name of its species and a version of its gene layout.

## Why it is interesting

Under [genes and settings](../adr/genes-and-settings.md)
and [brains](../adr/brains.md) a
brain's parameters are genes, so a good brain found in one run is otherwise
lost when the run ends. Keeping it lets a later run start from evolved
behaviour, and lets one population be dropped into another world.

Experiments need the same two halves. An [ancestor competition](ancestor-competition.md)
or a [founder benchmark](founder-benchmark.md) exports the genomes alive in a
run on given days and spawns a later world from them, so `run` needs a flag for
each.

It pairs with the warm start in [brains](../adr/brains.md). A network brain fitted once to imitate
the fixed-rules brain is the first entry such a library would hold.

## What it would touch

A spawn already takes gene overrides, per
[commands and snapshots](../adr/commands-and-snapshots.md), so
loading a saved genome into spawned creatures is a spawn with every gene given.
Genomes, species and their layouts need a stable serialised form, which is
cheap while they are plain records. Loading needs a command, per
[commands and snapshots](../adr/commands-and-snapshots.md). A
saved genome whose layout version no longer matches its species needs a rule.

The export format [rabbit learns](../roadmap/rabbit-learns.md) builds, per
[experiments and training](../adr/experiments-and-training.md), is one
creature per line with its species and genes by name. A line needs only its
species, so a hand-written genome loads, and unknown fields are ignored, so a
layout version can be added later as a field.

## Open questions

Whether a layout change invalidates saved genomes or migrates them.

Where the library lives: files beside the jar, the browser, or the server once
the app is hosted.