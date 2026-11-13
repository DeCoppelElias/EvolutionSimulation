# Workflow

The documents and the workflows around them follow groundwork, a Claude Code
plugin this project enables. Its own decisions say why each document holds what
it does and why a workflow is an `AGENTS.md` line before it is a skill. What is
particular to this project is below.

Each roadmap entry is built on its own short branch and merged into `master`
locally once it is finished, reviewed and Elias says go, so `master` always
holds finished work. A pull request per entry would build the branch on both
platforms before it lands. Elias works alone and prefers speed, so a failure on
the platform not tested locally is fixed on `master` after the push. A
long-lived rebuild branch went unbuilt by CI and drifted from `master` before
any code landed.

Entries are vertical slices, so the result of each shows quickly. Most end with
something to watch on the page. A small one may end without, and names the
entry that makes it visible, since forcing a page change into every entry would
pad small plumbing into larger entries.

The rebuild kept no 2022 code. Its features were a reference, each one rebuilt
is an acceptance line on its entry, and one dropped on purpose is in
`docs/ideas/`, so nobody restores it thinking it went missing. The 2022
application stays on the `v1.0-original-2022` tag.
