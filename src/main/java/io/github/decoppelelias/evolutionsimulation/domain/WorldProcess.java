package io.github.decoppelelias.evolutionsimulation.domain;

/** A rule the world applies once a day after the Tick, in list order. */
public sealed interface WorldProcess permits FoodDrop {}
