# Replay

A run replays exactly from its seed and its command log, so a strange run can be
watched again and taken apart. Emergence and breakage look the same from
outside, which makes this a property of the vision rather than a convenience.

## Rules

The world owns one random generator, built by naming `L64X128MixRandom`, whose
output for a seed the Java specification fixes. It is passed to everything that
draws, and nothing builds its own. The platform default generator could change
in a later release and alter every recorded run.

Entities are held in id order, every step walks them in it except resolving,
which [the day](the-day.md) orders by speed, and a tile returns its occupants
in it. Any index added later preserves it. Nothing loops over a collection with
no defined order: a hash map or set is only looked up in, and a map that is
iterated is sorted or filled in id order. `Map.copyOf` and maps keyed by class
change their iteration order from one JVM start to the next, so the same seed
would print different lines in two processes while every test inside one
process passed. A test therefore runs `run` twice in separate JVMs and compares
the output byte for byte.

Deciding finishes before anything is applied.

Commands queue and drain at the start of a day, or when a paused adapter asks
the world to apply them, never between two steps. Each is logged with the day
counter's value when it drained, which is the same either way. Applying a
command the moment it arrives feels instant, and makes the run someone actually
watched the one that cannot be reproduced.

A reset keeps the settings someone edited, and writes each one that differs
from its default into the new log right after the reset. Reverting to defaults
would lose the tuning that is usually why someone resets, and keeping edits
without logging them would break replay.

## Limits

Replay is promised within one build. A logged restore of defaults replays to
the defaults of the build replaying it.

The log lives in memory and is never written to a file. It is most of a save
format, which is not a goal, and `docs/ideas/world-persistence.md` keeps that.

World ids for the server come from `SecureRandom`, apart from the world's
generator, so they never shift a run.

The guarantee rules out running any step in parallel. If a large world ever
needed that, this is what would have to give.
