package io.github.decoppelelias.evolutionsimulation.domain;

/** A fact a component shows others, per docs/adr/perception.md. Built from a class, so a misspelt feature does not compile. */
record Feature(String name) {
    Feature {
        if (name.isBlank()) {
            throw new IllegalArgumentException("a feature needs a name");
        }
    }

    static Feature of(Class<? extends Component> kind) {
        return new Feature(kind.getSimpleName());
    }

    static Feature takes(Class<? extends Edible> food) {
        return new Feature("takes." + food.getSimpleName());
    }
}
