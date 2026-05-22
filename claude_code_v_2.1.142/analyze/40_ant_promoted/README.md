# 40_ant_promoted — Ant-Gated Features: v2.1.88 → v2.1.142

## Purpose

This module tracks features that were **ant-internal** (Anthropic-only) in the v2.1.88 TypeScript source and traces what happened to them by v2.1.142:

- **PROMOTED** — feature became public; gate removed or replaced by a public-facing gate (statsig / env var / setting).
- **STILL-INTERNAL** — feature still exists in the binary but is dead-coded out (`isEnabled: () => !1`) or its gate has been folded into a no-op (`isAnt: !1`, `getUserType() === "external"`).
- **REMOVED** — feature was eliminated from the public binary entirely; only its 2.1.88 source remnant survives.
- **CHANGED** — feature exists in 2.1.142 but with a meaningfully different shape (renamed, scope changed, default flipped).

The classification matters because the public 2.1.142 binary applies aggressive dead-code elimination (DCE) at build time: `process.env.USER_TYPE === 'ant'` is statically replaced with `false`, so any branch behind that gate is dropped from the bundle. Three distinct outcomes follow from how the 2.1.88 source author structured the gate:

1. **Top-level `require()` under the gate** → the module never enters the bundle (REMOVED at module level).
2. **Inline conditional inside an exported function** → the function still exists but the branch is gone (STILL-INTERNAL or dead branch).
3. **Gate replaced with a public predicate (statsig / setting / env)** → the feature ships to all users (PROMOTED).

## Methodology

1. **Inventory** the ant gates in v2.1.88 by grepping for `process.env.USER_TYPE === 'ant'`, `config.gates.isAnt`, `isAnt`, `feature('KAIROS' | 'BRIDGE_MODE' | 'PROACTIVE' | ...)`, and Statsig gates like `tengu_ant_*`, `tengu_kairos_*`, `tengu_ultraplan_*`.
2. **Check 2.1.142 catalogs** (`tools_index.json`, `slash_commands.json`, `feature_gates.json`, `cli_flags.json`, `env_vars.json`) for the externally-observable surface (slash command appears in the list, tool appears in `tools_index`, etc.).
3. **Grep `cli_inner_pretty.js`** for the feature's distinctive string literals (e.g. `"ultraplan"`, `"REPL"`, `claude agents`, `KUBECONFIG`).
4. **Cross-reference the changelog** (`claude_code_v_2.1.142/CHANGELOG.md`) to confirm the promotion / removal release window.

### Key Finding: `getUserType()` is hardcoded in the public binary

```js
// cli_inner_pretty.js:514630
function rP8() { return "external"; }
```

Every `process.env.USER_TYPE === 'ant'` from 2.1.88 was either:
- removed by Bun's DCE pass before output (the surrounding branch is gone), or
- replaced with `rP8() === "ant"` style call sites that now evaluate to `false`, or
- folded into a constant: e.g. `isAnt: !1` in `buildQueryConfig` (see `cli_inner_pretty.js:391946`).

Likewise, build-time `feature('KAIROS')` etc. resolve to `false` (or `true`) at compile time based on the build profile. The public 2.1.142 binary is the "external" profile, so KAIROS/BRIDGE_MODE/PROACTIVE/etc. modules are absent unless promoted.

## Files

- [`00_inventory.md`](00_inventory.md) — exhaustive list of v2.1.88 ant-gated features, grouped by category (Tools, Slash Commands, Runtime, Bash, Query, Constants/Prompts).
- [`01_status_table.md`](01_status_table.md) — per-feature status table mapping each inventory entry to its 2.1.142 outcome (PROMOTED / STILL-INTERNAL / REMOVED / CHANGED) with the binary entry point.
- `10_promoted_*.md` *(future unit C2)* — deep-dives on PROMOTED features (`/ultraplan`, `/ultrareview`, `/fast`, `claude agents`, etc.) covering what the gate looked like in 2.1.88, what replaced it in 2.1.142, and what new gates (if any) now control the feature.
- `20_still_internal.md` *(future unit C3)* — survey of STILL-INTERNAL features whose code remains in the binary (often as `isEnabled: () => !1` shells) but whose `isAnt` predicates are now dead — useful for reasoning about what an `ant` build would re-enable.
- `30_removed.md` *(future unit C3)* — list of features whose top-level `require()` was guarded so that DCE removed the module entirely (e.g. `REPLTool`, `TungstenTool`, `bughunter`, `ctx_viz`, `ANT_ONLY_SAFE_ENV_VARS`).

## Related Symbols

> Symbol mappings:
> - [`symbol_index_core_execution.md`](../00_overview/symbol_index_core_execution.md) — Core execution
> - [`symbol_index_core_features.md`](../00_overview/symbol_index_core_features.md) — Core features
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [`symbol_index_infra_integration.md`](../00_overview/symbol_index_infra_integration.md) — Integrations

Key functions in this module:

- `getUserType` (`rP8`) — hardcoded to return `"external"` in the public binary; `cli_inner_pretty.js:514630`.
- `buildQueryConfig` (`uo7`) — builds the `QueryConfig.gates` snapshot; `isAnt: !1` literal at `cli_inner_pretty.js:391946`.
- `createDumpPromptsFetch` (`T17`) — preserved structurally but the dump body function is a no-op stub (`$M_` returns immediately); `cli_inner_pretty.js:247073`.
