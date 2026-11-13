# The day

A day is one method on the world, and its steps are calls in it, read top to
bottom:

1. Drain the queued commands.
2. Decide. Every entity with a brain gets its perception and options and
   returns an intent. Nothing changes.
3. Resolve. Apply each intent in the day's order. Each creature eats at the end
   of its turn.
4. Tick. Every entity's components update themselves in id order, and anything
   a component ends dies.
5. World processes, in list order, such as spawning food.
6. Advance the counter, take the census row and the snapshot, and return them
   as the day's report.

Intents and the day's order pass between steps as local variables, so an
entity holds only its own state and nothing from the day outlives it. Only the
world processes are a list, since that is where new ones are added. A list
of generic systems was the first shape, and could pass intents only by writing
them onto entities or into a per-day object. Systems that register themselves
make order a side effect of construction, and an event bus cannot state that
nothing applies until every brain has decided.

The counter counts days completed, so a new world is on day 0 and its first day
reports day 1. Taking the census before advancing made the first day report day
0, and a paused snapshot disagree with the last report.

## Deciding before resolving

Every creature decides against the same world, since nothing moves while the
decide loop runs. Deciding each creature on its turn against a frozen copy gives
the same outcomes and needs a second copy of the world. If same-day reactions
come to matter, such as fleeing a wolf that moved close earlier in the day,
deciding on each turn is a change to this one method.

## The order of a day

Resolving walks one order per day: speed descending, with equal speeds drawn at
random. The draw replays because it shuffles the deciding entities in id order
with the world's generator, then sorts stably by speed. Entities with no speed
gene resolve after the rest. Every other step walks id order.

Id order alone gives the lower id the first move every day, forever, an
advantage chosen by nobody. Ordering by the declared move rewards declaring long
moves and gives breeding no place. A full shuffle each day removes the bias and
leaves nothing to select on. A tiebreak on a second gene couples two unrelated
traits. Speed is charged for, as [genes and settings](genes-and-settings.md)
says, because a free advantage pins to its bound within a few dozen generations.

A change to one creature's speed reshuffles the order and the generator's
draws, so two runs whose commands differ in a single speed diverge completely.

## Eating on a creature's turn

Feeding was first a step after every move. A predator kills by eating, so a wolf
then caught only a rabbit that stayed put, about one kill a month at 60 rabbits
on 40 by 40, and its speed changed nothing. Eating on each creature's own turn
is what makes speed the chase: a wolf whose turn comes first lands on the
rabbit's tile and eats it before it leaves. Eating everything walked over would
also feed a rabbit every grass it crossed. This is the one change a capability
has forced on the shape of a day.

The order is itself a coupling. Breeding resolves before eating, so a creature
cannot eat and afford a child on the same day, and changing the order changes
behaviour with no compiler help. A child spawned while resolving is not on the
day's list, so it first acts and feeds the next day. It is born on its parent's
tile after the parent has eaten there, so the missed feed costs nothing. A
creature that starves in Tick is gone before the world processes run.
