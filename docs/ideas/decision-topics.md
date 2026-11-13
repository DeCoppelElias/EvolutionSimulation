# Decision topics

Status: built, [workflow](../adr/workflow.md). The limit on topics was left
out.

## What it does

Regroups `docs/decisions/` into a handful of topic files, each named by a slug
such as `the-day.md`, and holds every section in them to a bar for being there
at all: the choice is hard to reverse, surprising to someone reading the code,
and the result of a real trade-off. What fails the bar moves into `DESIGN.md`,
or goes where the tests already show the choice. What passes is cut to the
decision, the alternatives worth remembering and the costs that are not
obvious.

The grouping that was built is the index in `docs/adr/README.md`.

## Why it is interesting

The log is read before work on its topic, so its length is paid on every
roadmap entry, and every entry is something `DESIGN.md` has to agree with.
Fewer and shorter topics mean less to read and less to keep in step. Related
choices, such as the steps of a day and the order they resolve in, are read
together instead of followed across several entries.

An entry that outlives its reason is worse than none. An agent reads an
accepted entry as binding and holds the code to it.

To keep it that way, `tools/docs-check.py` fails when the log holds more topic
files than a limit written in its README, so a new topic is an edit to that
limit that shows up in review. The bar becomes the first step of the
changing-decisions skill.

## What it would touch

The move onto the [shared workflow kit](shared-workflow-kit.md) carries this
out, with topics named by slug in `docs/adr/`.

Every file in `docs/decisions/` and its README, `DESIGN.md` where content moves
into it, every document that links a decision, `tools/docs-check.py` and its
tests, and the changing-decisions and auditing-docs skills with their `evals/`
scenarios. It is best done together with
[stable references](stable-references.md), since both rename the decision
files.

## Open questions

Which sections fail the bar. Titles mislead: some read as code structure and
turn out to weigh alternatives that were really rejected, so each one is read
rather than sorted by title.

Where the groups are drawn, and what the limit on topics starts at.

Whether a merged topic gets too long to read for one question, and whether
headings inside it are enough to fix that.
