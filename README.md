# Testing (Shiptorio testbed)

A tiny shop cart used to test [Shiptorio](https://github.com/r3dbars/shiptorio) end to end.
Real issues get filed here, Meta Muse Spark plans them, the local runner builds a fix,
and the gauntlet (CI, verify bay, AI review, merge gate) proves it before launch.

The seeded bugs are real. Each one has an issue, and a fix should come with a test that
fails before the fix and passes after.

## Setup

```sh
npm install
npm start
```

## Checks

```sh
bun run typecheck
bun run test
bun run build
```
