# Experiments and training

An agent experiments with worlds headless and reads the results as data. The
HTTP API in [serving](serving.md) drives a world step by step, and `run` does
whole runs.

## `run`

`run` advances one seeded world for a number of days and prints its census as
JSON Lines, one object per day with the seed added, so many seeds' lines can be
gathered and each stands alone. It shares world construction with the server,
so a scripted run and a watched one are comparable. It overrides any setting on
day 0 or a later day, so a run can get harsher as it goes, and any gene of the
starting population, riding on the spawn so the log describes the run. It
exports the genomes alive on chosen days, one creature per line, and starts a
world from such a file. An export is a population, not a saved world.

Seven interfaces were weighed. A command line that rebuilds the world from its
log on each call pays startup every step and turns the log into a file format.
A process reading stdin needs a background process and a pipe. An MCP server
gives typed tools, and a study by Scale Labs found models did about as well
through a command line, so it waits in `docs/ideas/mcp-server.md` until driving
step by step proves common. A batch mode inside `run` saves about half a second
per seed, and a script starting one `run` per seed gets most of that while
living where comparisons change fastest. Which genomes to spawn from a file is
the script's choice rather than `run`'s, for the same reason.

## Comparing variants

A comparison script in `tools/` runs variants of a world over a range of seeds,
one `run` per seed and variant, in parallel. A variant is a name and flags
passed through untouched, and a named experiment is a preset in
`tools/experiments/`. The script reads species, genes and settings from the
census and knows none by name.

Each variant is compared with the first on the day a species died out, its mean
and peak population, and each gene's mean. Each comparison gives both medians;
the Vargha-Delaney Â12, the chance that a run of the variant beats a run of the
first; and a two-sided Mann-Whitney U p-value, raw as `p` and Holm-adjusted
across the report as `pHolm`. The raw p is the one to read for a measure named
before the run, and the Holm p the one for scanning what stands out.

Counts alone cannot tell an effect from luck: a variant that truly wins 70% of
the time reaches 8 of 10 seeds only about 38% of the time. Cohen's d and
bootstrap intervals break on a world still alive at the end, and comparing
every pair grows the tests with the square of the variants.

Scripts never judge. What a result should show is an acceptance line on the
roadmap entry that runs it, and the agent checks the report against it. A
script that named a winner would bake one experiment's idea of success into
every experiment, and hide a result that passes for the wrong reason.

## Ancestor competition

`tools/ancestor_competition.py` evolves a world per seed and exports its
survivors, samples them with a recorded seed, then turns mutation off and sets
the sample against the genome evolution started from, or against a control
evolved beside it, in one world and each alone. With mutation off every creature
is an exact copy of a founder, so the survivors' genomes say which group won.
This is the gate that catches a build which compiles, passes every test and
quietly stops selecting for anything. A mode of the comparison script, or a
general stage runner, would have made one experiment a workflow engine.

## Training new brains

Inside a run the only learning is selection. A brain from anywhere enters a run
as a species' baseline or as spawned genomes, and selection takes over from
there. A model has four ways to make one:

- Breed across runs: evolve headless, export the survivors, pick, and start the
  next world from them. The ancestor competition checks the result beats where
  it started.
- Write a new brain: implement it, test it by handing it perceptions with no
  world, as [testing](testing.md) describes, and give its species a baseline. A
  network brain starts from the scoring brain's exact weights, per
  [brains](brains.md).
- Search genomes offline against a score, such as the one in
  `docs/ideas/founder-benchmark.md`, with an evolution strategy over many
  headless runs.
- Train a brain by gradient descent or reinforcement learning. No step
  interface is fast enough for that yet, and `docs/ideas/training-interface.md`
  keeps it.

An offline score bakes one idea of success into a starting brain, the same risk
that keeps the comparison from judging, so a trained brain is checked the way an
evolved one is. When behaviour looks dull, the cause is usually narrow
perception or a small action space rather than a weak learner, so widen the
world before reaching for a bigger brain. A brain worth keeping is the start of
`docs/ideas/brain-library.md`.
