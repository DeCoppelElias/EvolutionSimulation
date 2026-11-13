# Training interface

Status: idea.

## What it does

Gives a model a fast way to train a brain against the simulation, by gradient
descent or reinforcement learning, and to load the result as a species'
baseline or a spawned genome. The likely shape is a step interface that runs
many days per call without HTTP or JVM startup in between, such as a
Gymnasium-style bridge from Python.

## Why it is interesting

A brain can come from anywhere: written by hand, evolved, searched offline, or
trained. What a watched run does with it is unchanged, since inside a run the
only learning is selection. Training opens brains that selection alone would
take too long to find, and a trained brain is a natural entry for the
[brain library](brain-library.md).

`run` and the HTTP API are built for whole runs and for stepping a world a
person or an agent is driving. A training loop takes millions of steps, so the
cost per step is what decides whether training is practical.

## What it would touch

The domain stays as it is: a trainer drives worlds through commands and
snapshots like any adapter. A new adapter, or a mode of `run`, for stepping
many worlds fast. The [network brain](network-brain.md), whose weights are what
a trainer would fit.

## Open questions

Whether the trainer lives in Java beside the domain or in Python over a bridge.

What a trainer's reward is, and whether a reward fixed in advance works
against brains doing what nobody planned.

What step interface is fast enough, and whether a trainer sees the same
perception and options a brain does.
