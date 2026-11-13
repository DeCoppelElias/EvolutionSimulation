# 0020. The interface is a web page over a Java core

## Status

Accepted, 2026-10-01. Revised 2026-11-04.

## Context

`DESIGN.md` sets two goals: the world is pretty and satisfying enough that
people open it to watch, and an AI agent can experiment with it easily. The
2022 interface is Swing, which looks dated, runs only where Java is installed,
and gives an agent nothing to drive.

The rebuild takes no code from 2022, per
[0002](0002-replace-the-model-layer-in-place.md), and no domain code existed
when this was decided, so the language and the toolkit were both open at the
lowest cost they will ever have.

Swing was the first alternative. It ships with the JDK, JFreeChart and the
robot-driven smoke test already use it, and it looks old. Swing with FlatLaf
fixes the look for one dependency and keeps every tool working, but it stays a
desktop window someone has to install Java to open.

JavaFX has styling, a scene graph and animation. It is no longer part of the
JDK, so the jar becomes platform-specific, CI on Linux and Windows needs care,
and the chart and the smoke test need rework.

TypeScript for everything was the strongest alternative. The core would run in
the browser, so the app is a static link with no server and no install, and the
same core would run in Node for agents. It loses the Java foundation that
already exists, and Elias works in Java. A Java core compiled to the browser
with TeaVM keeps Java and the static link, at the price of a niche toolchain,
partial `java.base` coverage and painful debugging. A Rust core is the fastest
option and a steep first language for a project that needs no speed at a few
hundred tiles.

Java was estimated against the agent goal and passes. A day at the target size
is well under a millisecond, a 500-day run a fraction of a second, and seeds
run in parallel one world per thread. JVM startup is the only cost an agent
notices, about half a second against the seconds a long run takes.

Hosting decides whether a Java core can still be a link. A Java server on a
host gives every visitor their own world over the network, which costs a small
running fee and a cold start, where a static site costs nothing. That trade is
acceptable at hobby traffic.

Spring Boot was considered for the server and is familiar. It brings a
container, which [0007](0007-state-leaves-as-a-snapshot-commands-go-in.md)
rejects, a slower start and more memory, for a server that needs a few routes
and one stream. Javalin, at version 7 on Jetty 12 when this was decided, is a
thin layer that `Main` constructs by hand.

A queue of census rows per viewer was the first shape of the stream. The
world's thread would add each day's row to every viewer's queue, a writer per
viewer would drain it, and a viewer too far behind would be disconnected. It
guarantees delivery from the server, at the cost of a queue size to choose, a
rule for closing slow viewers, and joining that has to copy the history and
subscribe in one step. The history the adapter keeps already lets a reader
repair a gap, which makes the guarantee unnecessary.

A server that listens on every interface, Javalin's default, lets anyone on the
same network drive its worlds, and the API has no notion of who is calling
until hosting adds one.

A page has to show whether its world plays and at what rate, and the state
changes behind its back: another tab presses play, the idle pause stops a
world, a day that fails stops its timer. Reading the rate from the world list
once on load leaves every other tab wrong until it reloads. Polling the list
fixes that with a lag and steady traffic.

Gliding on every snapshot looks smoothest, and across a gap it draws a path
that never happened. A slow viewer skips days, a fast-forward jumps thousands,
and a tab shown again jumps however long it was hidden.

A glide that lasts the whole day was the first motion. Roadmap entry 14
replaced it with a hop, the way a rabbit moves. A hop per tile was weighed
against one bound over the whole move, and Elias picked the bound by eye as the
nicer of the two. A wolf that walked every move
and leapt only the last tile of a kill made the kill stand out, and lost to a
leap over any move longer than a tile, which matches the rabbit. Squeezing the
hop into a short day was tried as well: at 10 days a second a day lasts 100 ms,
and a hop gets about five frames. Side by side, Elias preferred the glide.

A browser opens at most six connections to one origin over HTTP/1.1, shared by
every tab, so six pages each holding a stream make a seventh hang without an
error. HTTP/2 lifts the limit, and browsers speak it only over TLS, which on
localhost means a self-signed certificate and a warning. One stream shared by
all tabs through a SharedWorker lifts it too, for much more code. Accepting the
limit leaves the hang.

A skill that has an agent open the page with Playwright, click the controls and
check screenshots against the snapshot was planned as its own roadmap entry. It
catches a blank canvas or a sprite on the wrong tile, which neither Vitest nor
JUnit sees, and which Elias sees in the first seconds of watching. Its script
would follow every change to the page's controls through each later entry, and
it cannot judge how the page looks, so Elias would watch anyway. The upkeep
outweighed saving one round trip, and it went back to
`docs/ideas/browser-smoke-test.md`.

The first page put every control in one row under the grid, with the
inspector, the creature table and the chart in a column beside it. Three layouts
were tried on a live page with the entry 14 art: Meadow, where the world fills
the window under a floating bar and panels float over it; Console, with every
control in one bar and panels in a sheet from the bottom; and Workbench, with a
bar along the top, a tool rail and a drawer beside the world. Elias picked
Workbench. It reads more like an application than a website, so two looks that
leaned towards a site were drawn on it, one in warm paper and gold and one
plain and neutral. Elias kept the prototype's sage, navy and pink.

With one panel open at a time, letting only the bar's buttons switch panels put
inspecting a creature two clicks away.

A Fit that rounds the scale up fills the window's shorter side and hides a
quarter of a 20 by 20 world on a laptop. A largest scale of 6 left a 5 by 5
world small on a large screen. A pan that stops at the world's edge cuts a hop
on an edge row.

A phone could keep every control in a bar that wraps, with the rail beside the
world and a panel over the whole screen. The bar wraps to three rows there,
about 110 pixels, and an open panel hides the creature being inspected.

Fonts loaded from Google's servers fail offline and send every visitor's
address to Google, which a hosted page in the EU may not do without consent.
System fonts lose the pixel face of the day counter.

A theme button that cycles through system, light and dark makes the common
switch take two clicks some of the time.

Whole scales counted in CSS pixels were the first zoom. A laptop scaled to 125%
or 150% and a phone map each CSS pixel to 1.25, 1.5 or about 2.75 device
pixels, and the browser stretched the canvas to fit, so at 150% a 1x art pixel
came out alternately 1 and 2 device pixels wide. Elias saw the art look uneven
at some zoom sizes.

## Decision

The core stays Java and depends only on `java.base`. Everything lives under
`io.github.decoppelelias.evolutionsimulation`, with the domain in `.domain`.

The interface is a web page. A Javalin adapter serves it, takes commands as
JSON over HTTP, and streams each world's snapshots and census rows over
Server-Sent Events. Jackson turns records into JSON and back, outside the
domain.

The frontend is React with TypeScript, built by Vite. The grid is a PixiJS
canvas inside one React component, drawn imperatively, and React renders the
controls, the chart and the generated settings panel around it.
`frontend-maven-plugin` downloads Node and builds the frontend into the jar's
resources, so `./mvnw verify` builds and tests both halves.

The page is a workbench. A bar along the top holds the way back to the worlds,
the day, the play controls, fast-forward, zoom, the theme button and a button
per panel. A rail on the left holds the tools: Inspect by default, a hand that
pans, and Place, which places one creature of a chosen species per click. One
panel at a time opens in a drawer 440 pixels wide that pushes the world aside,
so nothing covers the world. The bar's buttons switch panels, and a click on a
creature opens the Inspector. A notice shows in a strip under the bar. The
picker and its create form, which takes a seed and a size from 5 to 25 tiles a
side, share the theme.

Fit is the largest whole scale that shows the whole world, or on a narrow
window the smallest that fills its shorter side. The canvas is drawn at the
screen's device pixels and a scale counts device pixels per art pixel, from 1
up to 12 CSS pixels' worth, and the bar reads it as a tile's size. The
scale follows the window and the drawer until the viewer zooms or pans, and
Fit hands it back. A drag pans with any tool, a press that moves under 4 pixels
is a click, and a world that overflows its view pans to one tile past its edge.

On a window too narrow for the bar, the controls used less fold into a menu,
the tools move to a row along the bottom, and a panel opens as a sheet over the
lower part of the world. Touch pans, pinches to zoom and taps.

The page is light or dark, following the system until the theme button picks
one, which the browser remembers, and the World panel can hand it back to the
system. Only the page goes dark, and the world keeps its daylight colours. The
fonts ship inside the jar.

The browser animates between snapshots. It diffs consecutive snapshots by
entity id, moves a moved entity between its two tiles, fades in an id that
appears and fades out one that is gone. A rabbit covers its move in one bound
whose arc rises with distance. A wolf walks a move of one tile and leaps a
longer one or a kill. A move takes 260 ms plus 160 ms a tile, cut to 90% of the
day at the playback rate, and when that leaves under 150 ms the entity glides
in its standing pose instead. A paused single step plays the move at full
length. Motion happens only when the day went up by exactly one. Across a bigger
jump entities snap to their tiles, and the fades still run. Effects that need
more than a diff can see arrive as events on the day's report.

Each world has one executor thread that owns it. A timer on that thread
advances the world at the playback rate, and request handlers only hand work to
it, so the thread never waits on the network. Each viewer holds only the
latest day's event, its snapshot with that day's census row, overwritten when a
newer one arrives, so a slow viewer skips days instead of slowing the world.
The adapter keeps every census row, and a viewer that sees a gap in day numbers
fetches the missing rows from that history, so the chart never loses a day and
a reloaded page restores it. A comment line every 15 seconds keeps a quiet
stream open.

The stream also carries the world's play state, whether it plays and at what
rate, when a viewer attaches and whenever it changes. A viewer holds it apart
from the latest day, so a burst of days never overwrites it.

A page closes its stream while its tab is hidden and opens a new one when the
tab is shown, catching up from the snapshot a new stream starts with and the
census history.

Worlds are addressed by an id of 128 random bits from `SecureRandom`, drawn
apart from the world's seeded generator so replay is unaffected, and the number
of worlds is capped. The server lists the worlds it holds and keeps each one
until it is deleted, so a person can always go back to a world while the server
runs. There is no endpoint that stops the process. The server listens on
`127.0.0.1` unless told otherwise.

`java -jar` runs the server locally and opens the browser. Hosting it is roadmap
entry 17, which adds sessions, ownership, clean-up of abandoned worlds and a
deploy to Fly.io.

## Consequences

The app can become a link without leaving Java, at a small hosting cost and a
cold start after idle periods.

The project has two languages and two toolchains. The Maven build hides the
second from anyone who only runs `./mvnw`.

The smoke test that drove Swing with `java.awt.Robot` has nothing to drive.
Frontend logic is tested with Vitest and the API with JUnit against a running
Javalin. What renders is checked by Elias watching the page after each change
to it.

JFreeChart, the Swing panels and the icons at the classpath root go with the
2022 code.

If traffic ever makes server costs matter, the `java.base`-only core keeps
compiling it to the browser with TeaVM available.

Movement needs no change to the domain, because snapshots already carry ids. Hops,
walks and leaps play for every day a viewer sees, and a stretch the viewer
skipped shows as its end state. A kill is read off two snapshots, as a wolf
landing where a creature of another species stood and is gone. A death effect,
or knowing which wolf killed which rabbit, wants events, which are an additive
field on the report rather than a new channel.

The page works with no internet, and a hosted page loads nothing from a third
party. A phone is the one place where an open panel covers part of the world.

Only visible tabs hold a connection, so the six-connection limit binds only
with six pages on screen. A world left playing in a tab hidden for the idle
period from [0021](0021-agents-drive-worlds-over-http-and-run.md) gets paused,
since a hidden tab no longer counts as watching.
