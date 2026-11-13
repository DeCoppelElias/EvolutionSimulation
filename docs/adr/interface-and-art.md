# Interface and art

## A web page

The interface is a web page, which anyone can open from a link once it is
hosted. Swing looks dated and needs Java installed. FlatLaf fixes the look and
stays a desktop window, and JavaFX left the JDK, which makes the jar
platform-specific.

The page is React with TypeScript, built by Vite. The grid is a PixiJS canvas
inside one component, drawn imperatively, and React renders the controls, the
chart and the generated settings panel around it. `frontend-maven-plugin`
downloads Node and builds the page into the jar, so `./mvnw verify` builds and
tests both halves, at the price of two languages and two toolchains.

## The workbench

The page is a workbench: a bar along the top, a rail of tools on the left, and
one panel at a time in a drawer that pushes the world aside, so nothing covers
the world. A click on a creature opens the inspector. Three layouts were tried
on a live page: Meadow, with panels floating over a world that fills the
window; Console, with a sheet from the bottom; and Workbench, which Elias picked
because it reads like an application. Its sage, navy and pink stayed, over warm
paper and over plain neutral. On a narrow window the controls used less fold
into a menu, the tools move to the bottom, and a panel opens as a sheet, which
on a phone covers part of the world.

The page follows the system's light or dark until the theme button picks one,
and only the page goes dark, while the world keeps its daylight. A button that
cycled through three states made the common switch take two clicks. Fonts ship
inside the jar, since loading them from Google fails offline and sends every
visitor's address to a third party.

## Scale

The canvas is drawn at the screen's device pixels, and the art is scaled by
whole numbers of them, so every art pixel stays square on a screen scaled to
125% or 150% and on a phone. Scaling by whole CSS pixels made art pixels
alternately one and two device pixels wide. Fit shows the whole world, or on a
narrow window fills its shorter side. Rounding up hid a quarter of a world on a
laptop. A world that overflows its view pans to one tile past its edge, so a hop
on an edge row is never cut.

## Motion

The browser diffs consecutive snapshots by id and animates the difference: a
moved entity travels between its tiles, a new id fades in and a gone one fades
out. A rabbit covers a move in one bound whose arc rises with distance, and a
wolf walks one tile and leaps a longer move or a kill. Motion plays only when
the day went up by exactly one. Across a bigger jump entities snap, since a
glide across a gap draws a path nobody walked. When a day is too short for a
hop, the entity glides in its standing pose, which Elias preferred side by side
to a hop squeezed into five frames. A hop per tile lost to one bound by eye, and
a wolf that leapt only on a kill lost to leaping any long move, which matches
the rabbit.

A kill is read from two snapshots. Effects that need more than a diff arrive as
events on the day's report, an additive field rather than a new channel.

## Art

Claude draws the art as pixel art from reference images Elias supplies for each
species, and Elias approves each pass in a published artifact before it is
built. Free packs came in mismatched styles, and a paid pack cannot be committed
to a public repository. Art Elias draws, or paid art kept out of the
repository, is the fallback. Tiles of 16 pixels won against 8, 24 and 32. A
creature may overhang its tile, and a click still goes by the tile.

The style is flat colour with a navy outline one pixel wide. Animals are drawn
side-on, after a wolf facing the viewer walked in a way that did not read. The
ground is a top-down meadow drifting through fixed patches in shades close to
its own green, blended by an ordered dither. Amber and orange read as too
strong. The meadow continues, dimmed, past the world's edge.

Markings follow the whole genome, so relatives and similar brains look alike.
Each gene, scaled by its range and measured from the baseline, feeds fixed
blends that pick a colour, a spread and an accent. The page computes them and
the model knows nothing of them, so markings change when a species' genes
change. A coat by id, an inherited coat gene and a coat showing one gene were
the alternatives, and small spots could not be read at 16 pixels. A wolf varies
in shades of one of six coats, since patches in an unrelated colour looked
unreal.

Up to three creatures on a tile are drawn as a group, a predator in front of its
prey, with a count chip on every shared tile so a group never hides a fourth.
The chip waits for the day's moves to land, so it never announces a crowd
before it arrives.

## Checking the page

What renders is checked by Elias watching after each change. Rules the page
follows live in pure modules tested with Vitest. A Playwright skill that clicks
and compares screenshots would catch a blank canvas and cannot judge how the
page looks, so its upkeep outweighed one look. `docs/ideas/browser-smoke-test.md`
keeps it.
