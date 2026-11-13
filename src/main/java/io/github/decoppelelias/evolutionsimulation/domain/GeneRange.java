package io.github.decoppelelias.evolutionsimulation.domain;

/** A gene's range and its species' baseline value, which a page measures a genome against. */
public record GeneRange(String key, double min, double max, double baseline) {}
