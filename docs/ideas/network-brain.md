# Network brain

Status: idea.

## What it does

A brain whose decision is a small neural network, with its weights as genes,
started from weights that reproduce the fixed-rules brain. Selection
then refines it from working behaviour rather than from random wandering.

## Why it is interesting

It is the second brain
[brains](../adr/brains.md) plans,
for when the fixed rules run out, and the first thing a brain library would
hold. A network can find behaviour nobody wrote as a rule, which is what the
vision in `DESIGN.md` is about.

## What it would touch

A second gene shape for weights, per
[genes and settings](../adr/genes-and-settings.md). A way to
flatten a perception into a fixed-size input, which [brains](../adr/brains.md) leaves open. The
fixed-rules brain of
[brains](../adr/brains.md) is already
a weighted sum of features followed by a softmax, so a network whose first
layer computes those features starts from its genes directly. Anything the
network adds beyond that starts at weights that change nothing.

## Open questions

How a variable-length perception becomes a fixed input: per-tile weight sharing
with pooling, a recurrent pass over tiles, or attention. [Predator](../roadmap/predator.md) makes
the scoring brain a sum over the features in a catalog, which is one row of
flags per visible entity.

Whether the network's input is the scoring brain's features or something rawer,
which would need a fitting step to imitate the rules.

What "the fixed rules have run out" means, so it is clear when to start. The
[founder benchmark](founder-benchmark.md)'s learning curve is one answer.
