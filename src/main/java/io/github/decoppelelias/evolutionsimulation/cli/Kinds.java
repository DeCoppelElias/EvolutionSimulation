package io.github.decoppelelias.evolutionsimulation.cli;

import io.github.decoppelelias.evolutionsimulation.domain.Grass;
import io.github.decoppelelias.evolutionsimulation.domain.Rabbit;
import io.github.decoppelelias.evolutionsimulation.domain.Species;
import io.github.decoppelelias.evolutionsimulation.domain.Wolf;
import java.util.List;

/** The species every world built by run or serve knows. */
final class Kinds {
    private Kinds() {}

    static List<Species> all() {
        return List.of(Grass.species(), Rabbit.species(), Wolf.species());
    }
}
