# TestingPermission — End-to-End Permission-Prompt Test Tool

> **Tool name:** `TestingPermission`
> **Source:** `cli_inner_pretty.js` (`it_` schema; declaration with `checkPermissions` that always returns `ask`)
> **Search hint:** *(none — internal)*
> **Concurrency-safe:** true · **Read-only:** true

---

## Overview

`TestingPermission` is an internal end-to-end test tool that **always asks for permission** before executing. It's used by Claude Code's own integration tests and dev-loop validation to exercise the permission-prompt UX without invoking a tool that has real side effects.

The tool description literally states: "Test tool that always asks for permission before executing. Used for end-to-end testing."

---

## Schema

```javascript
// ============================================
// testingPermissionInputSchema - it_
// Location: cli_inner_pretty.js (it_ decl)
// ============================================

// READABLE (typical):
const testingPermissionInputSchema = lazySchema(() => z.object({}));
```

The tool typically takes minimal input — its purpose is to trigger the permission flow, not to do useful work.

---

## Key Behavior

### `checkPermissions` always asks

The tool's `checkPermissions` returns `{ behavior: "ask", message: "..." }` unconditionally. This guarantees the permission dialog surfaces:
- For testing the dialog renders correctly under various themes.
- For testing the `permissions.ask` / `permissions.allow` rule paths.
- For exercising the "Always allow" persistence flow.

### Renderer-rich

The tool defines a full set of render callbacks: `renderToolUseMessage`, `renderToolUseProgressMessage`, `renderToolUseQueuedMessage`, `renderToolUseRejectedMessage`, `renderToolResultMessage`, `renderToolUseErrorMessage`. This is intentional: testing covers all rendering states (in-flight, queued, rejected, errored, success). A tool that didn't define one of these would just-not-render that state.

---

## Key Insights

**Why ship a test tool in the production bundle?**
- Integration tests run against the same build as production.
- The tool's `isEnabled` (via `userFacingName: "TestingPermission"` and search-hint absence) ensures it doesn't surface to real users — tool-search won't return it for normal queries, and it's not in the default tool list.
- Sandboxes and CI can invoke it explicitly via the SDK with the full name.

**Why "always ask" rather than "configurable"?** Testing wants determinism. A tool that sometimes asks, sometimes allows, would force the test to read the permission state to predict behavior. "Always ask" gives a single trigger condition the test can reliably exercise.

**This is also a permission-system smoke test.** If the permission infrastructure breaks, TestingPermission stops working — making it a useful canary for upgrades or refactors. Internal tests probably run "spawn TestingPermission, answer the prompt, verify result" on every PR.

---

## v2.1.112 → v2.1.142 Deltas

- The tool exists as an internal testing surface in both versions.
- No notable behavior change across this window — its role is to be stable.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Testing*

Key functions in this document:
- `TestingPermissionTool` — declaration with always-asking `checkPermissions`
- `testingPermissionInputSchema` (`it_`)
