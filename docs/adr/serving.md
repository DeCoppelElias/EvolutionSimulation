# Serving

A Javalin adapter serves the page and an HTTP API, takes commands as JSON, and
streams each world's days over Server-Sent Events. Jackson converts records,
outside the domain. Spring Boot was familiar, and brings a container, a slower
start and more memory to a server with a few routes and one stream.

## One thread per world

Each world has one executor thread that owns it. A timer on it advances the
world at the playback rate, and request handlers only hand it work, so it never
waits on the network. The world itself is not thread-safe and does not need to
be.

Each viewer holds only the latest day, overwritten when a newer one arrives, so
a slow viewer skips days instead of slowing the world. The adapter keeps every
census row, and a viewer that sees a gap fetches the missing rows, so the chart
never loses a day. A queue per viewer guarantees delivery at the cost of a size
to choose, a rule for dropping slow viewers and an atomic join, and the history
already repairs a gap.

The stream also carries the world's play state whenever it changes, since
another tab, the idle pause or a failing day can change it behind a page's back,
and polling lags. A comment every 15 seconds keeps a quiet stream open.

A page closes its stream while its tab is hidden. A browser allows six
connections to one origin over HTTP/1.1 across all tabs, and a seventh stream
hangs without an error. HTTP/2 needs TLS, which on localhost means a
self-signed warning, and one stream shared through a SharedWorker is much more
code, so only visible tabs hold a stream.

## Worlds

Worlds are addressed by 128 random bits from `SecureRandom`, apart from the
seeded generator, and their number is capped. One server holds several, such as
a control and a variant. The server keeps a world until it is deleted, and no
endpoint stops the process. It listens on `127.0.0.1` unless told otherwise,
since the API has no notion of who is calling until hosting adds sessions.

## People and agents

`serve` opens the browser and may be a person's. It never quits or deletes a
world, and after 24 hours without a request or an open stream it pauses any
playing world. `serve --no-browser` is an agent's. It quits after 10 minutes
without a request or a stream, and a playing world does not keep it alive. One
idle rule for both either kills the world a person left playing overnight or
leaves a forgotten agent server running for good. With `--port 0` the server
picks a free port and prints one ready line with its address on stdout, with
logging on stderr, which removes port clashes and polling for readiness.

An agent skips ahead by stepping a paused world up to 10,000 days in one
request, and gets the last day's report back with every census row kept.
Playing fast and pausing on time overshoots the day an agent meant to stop at,
and raising the playback ceiling would offer a person speeds no page can draw.
Playback stays between 0.5 and 10 days a second.

A hosted Java server costs a small fee and a cold start after idle periods,
which is acceptable at hobby traffic. [Hosting](../roadmap/hosting.md) adds
sessions, ownership, clean-up of abandoned worlds and a deploy.
