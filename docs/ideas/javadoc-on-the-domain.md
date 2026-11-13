# Javadoc on the domain

Status: idea.

## What it does

Gives every public type in `domain` one or two sentences of Javadoc in the
vocabulary of `DESIGN.md`, documents a method only where its contract is not in
its signature, cites the decision topic where a rule's reason lives,
and adds a `package-info.java` stating the hexagonal rule.

## Why it is interesting

The public surface of the flat domain package is about a dozen types, and they
are what an adapter author or an agent reads first. A decision named in a
comment, such as `per docs/adr/the-day.md`, says why odd-looking code is shaped that way and
gives an agent a link to follow.

## What it would touch

The public domain types, and possibly a check in `tools/` that every decision
cited in the code exists.

## Open questions

Whether the comment rules in `AGENTS.md` and good names are enough, which is
the bet made for [minimal loop](../roadmap/minimal-loop.md). The retrospective at the end of an entry is
where an agent struggling to find its way would show.
