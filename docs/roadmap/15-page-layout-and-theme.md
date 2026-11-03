# 15. Page layout and theme

Status: not started.

The page gets a designed layout and theme around the world, light and dark, in
the workbench shape picked from three layouts in entry 14's grill. The world
comes first, and nothing covers it except on a phone. The `frontend-design`
skill guides the build, and Elias approves one mock of every choice below
before the plan is written.

The bar along the top stays visible and holds the way back to the worlds, the
day, Step, Play, the five rates as buttons, fast-forward, zoom, the theme
button and a button for each panel: Inspector, Creatures, Population, Settings
and World. The World panel holds the seed, spawning a number of creatures at
random, reset with an optional seed, reset statistics, handing the theme back
to the system, and delete behind a confirm step. A notice shows in a strip
under the bar, one at a time until closed, and pushes the world down.

One panel at a time opens in a drawer 440 pixels wide that pushes the world
aside. It shows its panel's name and a close button and has no tabs. The bar's
buttons switch panels, and a click on a creature or on a row in the creature
table opens the Inspector. A click on empty ground clears the selection and
leaves the Inspector open.

The rail on the left holds Inspect, selected by default, a hand that pans, and
Place, which opens a list of species defaulting to the first. An armed Place
tool shows a ghost sprite under a mouse and each click places one creature,
and Esc, a right click or the tool's button again goes back to Inspect. This
replaces entry 13's inspect and spawn toggle.

Fit is the largest whole scale that shows the whole world, and on a narrow
window the smallest that fills its shorter side. Scales run from 1 to 12, for
Fit and for zooming by hand. The world opens at Fit, centred, and follows
changes to its area, such as the drawer opening, until the viewer zooms or
pans. Then the scale stays and the point at the middle of the view stays put,
and Fit hands control back. Buttons, the mouse wheel at the cursor and the
keys zoom in whole steps. A drag pans with any tool, and a press that moves
under 4 pixels stays a click. An axis where the world overflows pans until its
edge sits one tile inside the view, an axis where it fits stays centred, and
on a phone with a panel open the limit uses the part of the view above the
panel. The meadow continues past the world's edge on every side, dimmed,
behind a thin border, and replaces entry 14's strip above the top row.

The keys are Space for play and pause, I, H and P for the tools, plus and minus
to zoom, 0 for Fit, a full stop for one step while paused, and Esc, which
closes the species list, then disarms Place, then closes the panel, then
clears the selection. They do nothing with Ctrl, Alt or Meta held or while
typing in a field, and each button's tooltip names its key.

On a window too narrow for the bar in one row, which is measured rather than
fixed and is about 1100 pixels today, the bar keeps Play, Step, the rates and
the day and folds the rest into a menu. Below the width where a drawer would
leave the world under 320 pixels, about 820, the tools move to a row along the
bottom and a panel opens as a sheet over the lower 55% of the world. Two
fingers pinch to zoom, and on a touch screen Place shows no ghost and a tap
places.

The theme is the prototype's: a sage page, white panels, navy ink shared with
the sprites' outline and the rabbit ear's pink as the accent, and a near-black
blue in the dark. Text is Atkinson Hyperlegible, and the day counter Pixelify
Sans, both bundled from pinned `@fontsource` packages so the page loads nothing
from another site. The page follows the system until the theme button flips
it, the browser remembers the choice, and the World panel hands it back to the
system. Only the page goes dark, and the world keeps its daylight colours.

The picker and the create screen share the theme. Each world is a card with
its size, seed, day, a count for each species beside its sprite, and whether it
plays. The create form above the list takes a seed, a width and a height, per
[world size on the page](../ideas/world-size-on-the-page.md): 5 to 25 a side,
20 by default, anything else refused with a message naming the range. The
server keeps accepting 1 to 25, the starting population stays 10 rabbits and 7
grass at every size, and a reset keeps the size.

The rules sit in pure modules under `frontend/src/` with Vitest tests: the
viewport's fit, zoom steps, zoom at a point, pan limit and following flag; the
click or drag threshold; the tool state and the order Esc undoes things in; the
key map; the theme choice; the size check; and the layout thresholds. The
components stay thin glue over them.

On the page, watched by Elias on a desktop and on a phone over the local
network with `serve --host 0.0.0.0`:

- The picker shows themed cards, and create refuses a width of 4 or 26 with a
  message naming 5 to 25.
- The bar, the rail and the drawer hold what this entry lists, and a panel never
  covers the world on a desktop.
- Clicking a rabbit opens the Inspector over whatever panel was open, and
  clicking empty ground leaves it open with nothing selected.
- Place shows a ghost, places one rabbit a click, and Esc, a right click and
  its button each return to Inspect.
- A 20 by 20 world opens whole and centred, a 5 by 5 one fills the window, and
  opening the drawer refits both until the viewer zooms.
- Zooming in on a creature and opening the Inspector keeps that creature in
  view.
- Panning a zoomed world stops one tile past each edge, so a hop on the top row
  stays in view.
- Each key does what this entry lists, and Space typed in the seed field does
  not play the world.
- The theme follows the system, the button flips it across a reload, and the
  World panel hands it back.
- A notice pushes the world down and leaves when closed.
- On a phone the bar fits in one row, the menu holds the rest, a tap places,
  two fingers zoom, and a panel opens as a sheet.
- With the network cable out, the page still shows both fonts.

Depends on entry 14. See
[0020](../decisions/0020-the-interface-is-a-web-page.md),
[0025](../decisions/0025-the-art-is-pixel-art-drawn-for-the-project.md).
