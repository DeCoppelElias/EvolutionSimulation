# Events and effects

Status: not started.

Births, deaths and kills get small effects on the page. An effect that a diff of
two snapshots cannot see, such as which wolf killed which rabbit, needs events
on the day's report, per [interface and art](../adr/interface-and-art.md).
Until then [art and motion](art-and-motion.md) infers a kill from the snapshots, a wolf landing where a
rabbit stood that is gone, and the kill event replaces that guess here.

Details to settle in this entry's grill: what each event carries, such as the
parents of a birth, the cause of a death and the killer of a kill, and what that
costs the stream; what each effect looks like, with the newborn sprite a
candidate for a birth and a death drawn as an effect rather than a pose, since a
lying rabbit at 16 pixels reads as a loaf; and whether starving and old age
look different.

This entry finishes the look that [art and motion](art-and-motion.md) and
[page layout and theme](page-layout-and-theme.md) began, so it carries their
shared test: it is done when someone who has never seen the project wants to
keep watching, which is judged by watching.

On the page: a birth, a death and a kill each show their effect, and the
wolf's leap follows the kill event.

Depends on [page layout and theme](page-layout-and-theme.md). See
[interface and art](../adr/interface-and-art.md),
[world model](../adr/world-model.md).
