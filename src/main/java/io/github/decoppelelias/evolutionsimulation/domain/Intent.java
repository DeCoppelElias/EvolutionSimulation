package io.github.decoppelelias.evolutionsimulation.domain;

sealed interface Intent {
    record Move(Direction direction, int distance) implements Intent {
        public Move {
            if (distance < 1) {
                throw new IllegalArgumentException("a move covers at least one tile, got " + distance);
            }
        }
    }

    record Breed() implements Intent {}

    record Idle() implements Intent {}
}
