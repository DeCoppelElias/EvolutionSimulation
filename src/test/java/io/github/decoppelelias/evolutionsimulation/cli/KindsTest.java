package io.github.decoppelelias.evolutionsimulation.cli;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.decoppelelias.evolutionsimulation.domain.Species;
import org.junit.jupiter.api.Test;

class KindsTest {
    @Test
    void runAndServeKnowGrassRabbitsAndWolves() {
        assertThat(Kinds.all()).extracting(Species::name).containsExactly("grass", "rabbit", "wolf");
    }
}
