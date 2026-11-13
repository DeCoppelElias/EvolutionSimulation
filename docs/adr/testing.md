# Testing

Development is test-driven. A rule's test is written first, run, and seen to
fail for the reason it names before the code that makes it pass exists. Tests
written after are faster to write and confirm whatever the code already does.
Writing them first caught a test that would have passed vacuously.

Tests drive the domain through its own surface: commands in and snapshots out,
or a brain handed a perception and its options with no world at all. They never
go through an adapter. Tests mirror the production packages, so they reach
package-private types.

Assertions use AssertJ, for how they read and for its messages on collections
and exceptions. A rule that holds for every input is a seeded loop: a generator
from a fixed seed draws a few thousand cases, so a failure replays exactly.
jqwik shrinks a failure to its smallest case and was unconfirmed on the JUnit 6
platform. `docs/ideas/property-based-tests.md` keeps it.

There is no coverage or mutation tooling and no golden run. Each adds overhead
for one developer, a coverage threshold invites tests that assert nothing, and a
golden run breaks on every intended change. `docs/ideas/measuring-test-quality.md`
and `docs/ideas/golden-run-test.md` keep them.

Replay is tested within one process and across two JVMs, as [replay](replay.md)
says, and the domain boundary by `jdeps`, as [architecture](architecture.md)
says. The web adapter is tested with JUnit against a running server, and the
page's rules with Vitest in pure modules. What the page shows needs Elias to
watch it.

No unit test sees selection. A build can compile, pass everything and quietly
stop selecting for anything, so the experiments in
[experiments and training](experiments-and-training.md) are the other half of
testing. A roadmap entry that changes behaviour carries acceptance lines that
the comparison or the ancestor competition must meet.
