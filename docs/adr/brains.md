# Brains

## Which brain

The first brain is a fixed set of rules whose parameters are genes, so behaviour
works from the first generation. A network brain comes when those rules run out,
with its weights as genes. A decision tree in the genome was ruled out: adding a
branch is a jump rather than a nudge, mutation makes invalid trees, and small
changes have wildly uneven effects. A brain from anywhere else, searched or trained,
enters the same way, as [experiments and training](experiments-and-training.md)
describes.

Every species carries a baseline genome beside its layout, and its first
generation starts from it with mutation applied, so a new species does not spend
hundreds of days rediscovering movement. This holds for any brain.

## The scoring brain

Each day a creature scores every option it is offered and picks one. A move is
scored at the tile it lands on, so how far to walk is a choice. Idling scores
the creature's own tile, and breeding scores as idling plus a breeding pull, so
breeding competes with walking toward food.

The score sums over the features others in view show and names no component.
Each feature has three pull genes: one on the distance to the nearest thing
showing it, one added to that in proportion to hunger, and one on summed
closeness to everything showing it. Hunger is `1 / (1 + daysLeft)`, from the
creature's own reserve. The pick is a softmax, each option's chance
proportional to `exp(score / whim)`, drawn once from the world's generator over
the options in their fixed order. With nothing in view every score ties, which
is how a creature wanders. Every species uses this brain and differs in its
genes, so a wolf is a rabbit's food pulls aimed at meat.

Why this shape:

- The 2022 brain was a lottery between named strategies, with genes as the
  chances. A gene that shifts weight between strategies flips a creature
  between discrete behaviours, so selection is hard to see working. A new
  threat needs a new strategy, and a rolled walking distance overshoots food one
  tile away.
- Both measures for every feature. Summed closeness alone barely pulls toward
  food at range: with grass 6 tiles away, moving 3 toward it is about 1.2 times
  likelier than staying, where nearest distance makes it about 400 times
  likelier. Nearest alone weighs five neighbours like one, and pushes a creature
  that avoids them to the edge of its view. Choosing a measure per feature would
  tell the brain what the feature means.
- Hunger adds to the nearest pulls rather than multiplying them, so eating only
  when hungry is a strategy that can exist. A hunger version of every pull
  doubles the genes for uses nothing has yet.
- A softmax keeps the second-best tile likelier than the worst, so a careless
  rabbit fumbles near food instead of wandering off, and hunger focuses it.
- Breeding inside the softmax keeps it a gradual decision. A margin gene flips
  all at once, and breeding whenever offered stops it being a decision.
- Pull genes are signed, with bounds around zero. A gene near a floor climbs by
  mutation alone, since steps down are cut and steps up are not, so a rise could
  not be told from learning, and walking away from food would be out of
  selection's reach.

The rabbit's baselines reproduce the brain it had before features, plus a
little distance from whatever eats meat. An animal keeps somewhat away from
what is not its kind, and selection settled there anyway when it started at 0.
The wolf gets no aversion to `takes.Plant`, because every rabbit shows it beside
meat and it would weaken the chase.

## What follows

Behaviour comes from weights, not cases. Whether rabbits herd is where a crowd
pull drifts, and a fed rabbit wanders more than a starving one with no rule
saying so.

`whim` is likely to drift to its floor, since greed is best when food is in
view. If rabbits need to explore, the answer is memory or patchy food rather
than a cost on `whim`. `docs/ideas/brain-memory.md` and
`docs/ideas/patchy-food.md` keep those.

Two features always shown together, such as another rabbit's meat and its plant
diet, act only as their sum, so a gene report shows two genes moving where one
thing was learned.

The score is a weighted sum followed by a softmax, a network with one layer, so
a network brain can start from these exact weights. How a variable-length
perception becomes a fixed input stays open in `docs/ideas/network-brain.md`.
