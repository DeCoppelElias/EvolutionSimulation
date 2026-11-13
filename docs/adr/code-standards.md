# Code standards

Java 25, the current long-term release, for unnamed variables in pattern
switches over sealed types and for validation before `this(...)`.

The compiler runs `-Xlint:all -Werror` with only `serial` off, so every warning
fails the build and the count stays at zero while that is cheap. Error Prone
catches more, needs `--add-exports` flags and trails a new JDK, and NullAway on
top of it needs every interface annotated. Both give a small codebase that is
test-first and reviewed less than a large one, and `docs/ideas/error-prone.md`
keeps them.

Nothing is null. Absence is an `Optional` or an empty collection, and
parameters are not checked for null: when nothing passes null, a null is
already a bug that fails fast, and the checks are noise. Jackson writes an empty
`Optional` as `null`, so the page's types for the API allow it.

Values validate themselves in their constructors and throw
`IllegalArgumentException` naming the rule, so an invalid value cannot exist
and no rule checks its inputs again. A record copies a list with `List.copyOf`,
and a map into an unmodifiable map sorted by key, never with `Map.copyOf`, whose
order changes between JVM starts, as [replay](replay.md) says.

The command line is parsed with picocli in the `cli` adapter. A hand-written
parser grows into a worse picocli once `run` takes overrides, and agents, its
main users, gain most from precise error messages.

Spotless with palantir-java-format checks every Java file, with no ratchet.

TypeScript meets the same bar inside `./mvnw verify`: `strict`, with unused
locals and parameters as errors, ESLint's TypeScript and React hooks rules
failing on any warning, and Prettier. A lighter bar leaves the likeliest React
bug uncaught, a value captured stale inside an effect, which the hooks rules
find.

Every version is exact. Maven dependencies are pinned and the enforcer fails on
a range or a snapshot. `package.json` names exact versions, the lock is
committed, and the build runs `npm ci` on a Node it downloads. A committed lock
pins `^` ranges only until someone regenerates it. Dependabot proposes upgrades.
