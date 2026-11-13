# World size on the page

Status: built, [0020](../decisions/0020-the-interface-is-a-web-page.md).

## What it does

The page's create screen asks for a width and a height beside the seed, and
sends them with the new world. `POST /worlds` already accepts both, and `run`
has `--width` and `--height`, so only the page is missing them. Today a world
made on the page is always 20 by 20.

## Why it is interesting

Size changes how a run plays. A small world crowds rabbits onto the same food,
and a large one lets them spread out, so trying a run at a few sizes is one of
the first experiments a person watching would want.

## What it would touch

The create screen and the request it sends. Size stays a constructor input
rather than a setting, per
[0017](../decisions/0017-every-number-is-a-setting-or-a-gene.md), so the
settings panel is not involved, and a reset keeps the size.

## Open questions

None left. Entry 15's grill set the range at 5 to 25, since 5 by 5 is the
smallest the starting 10 rabbits and 7 grass fit with room and zoom and pan make
25 readable. A reset keeps the size, since resizing would change the domain and
the replay log for a world that shares nothing with the old one.
