# Hosting

Status: not started.

The app as a link anyone can open. Each visitor's worlds belong to their
session, abandoned worlds are cleaned up, and a cap on worlds across sessions
keeps a spike in traffic from exhausting the machine. A container image and a
deploy workflow put it on Fly.io. The agent building the entry sets up and
checks the Fly app through Fly's MCP server rather than by hand, which is also a
first try of that server.

API tests cover that a second session can neither see nor delete the first's
worlds, that the cap refuses a new world once reached, and that an abandoned
world is removed after its timeout.

Details to settle in this entry's grill: how many worlds a session may hold, the
cap across sessions and the idle timeout, sized against what a world costs in
memory and threads; what the page shows a visitor when a cap is reached;
limiting the rate of requests per session, since a stranger can step and play
worlds as fast as the server allows; and how cleaning up abandoned worlds fits
the rule in [serving](../adr/serving.md) that a local server never deletes a
person's world.

On the screen: the link opens the page with a fresh world, and two browsers
opening it each get their own.

Depends on [breeding and settings](breeding-and-settings.md), and comes after [events and effects](events-and-effects.md) so the first link strangers open
shows the finished look. See
[interface and art](../adr/interface-and-art.md),
[experiments and training](../adr/experiments-and-training.md),
[serving](../adr/serving.md).
