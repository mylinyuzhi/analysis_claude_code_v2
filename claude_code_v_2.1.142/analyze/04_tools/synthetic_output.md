# SyntheticOutput — Legacy Name for StructuredOutput (Renamed)

> **Tool name:** `SyntheticOutput` (TS source name); `StructuredOutput` (v2.1.142 bundle name)
> **Source:** `/lyz/codespace/3rd/claude-code/src/tools/SyntheticOutputTool/SyntheticOutputTool.ts` (2.1.88)
> **Status in v2.1.142:** Renamed to `StructuredOutput`; same implementation, same behavior, different exported name.

---

## Overview

`SyntheticOutput` is the original TypeScript-source name for the schema-bound final-output tool. In the v2.1.142 obfuscated bundle the tool is exposed as `StructuredOutput` (constant `J0 = "StructuredOutput"`). The behavior is unchanged; only the name was rebranded.

See [structured_output.md](./structured_output.md) for the full deep-dive — this document only covers the name/identity story.

---

## Why the Rename?

```typescript
// From src/tools/SyntheticOutputTool/SyntheticOutputTool.ts:20
export const SYNTHETIC_OUTPUT_TOOL_NAME = 'StructuredOutput'
```

In the 2.1.88 TypeScript source, the **exported tool name** is `'StructuredOutput'` — but the **module file** is named `SyntheticOutputTool.ts`. This split is intentional:

- **Internally**, the original implementation was the "synthetic" output channel — synthetic because the schema is "synthesized" at call time from user input (Ajv-compiled dynamically).
- **Externally**, "StructuredOutput" is the user-facing name and the descriptor that appears in `--print` docs, error messages, and SDK documentation.

The bundle uses the user-facing name as the registered tool name (`J0 = "StructuredOutput"` at cli_inner_pretty.js:207570), aligning with what the public API documents.

---

## Implementation Anchor

The full implementation is described in [structured_output.md](./structured_output.md). The relevant identifiers:

| Layer | Name | What |
|-------|------|------|
| 2.1.88 export | `SyntheticOutputTool` | Tool definition |
| 2.1.88 const | `SYNTHETIC_OUTPUT_TOOL_NAME = "StructuredOutput"` | Tool name string |
| 2.1.142 const | `J0 = "StructuredOutput"` | Same string in bundle |
| 2.1.142 decl | `$Y6` | Tool definition in bundle |
| 2.1.142 factory | `_H_` (`buildStructuredOutputTool`) | Dynamic per-schema builder |
| 2.1.142 cache | `sdK` WeakMap | Schema-identity cache (v2.1.89) |

The cache was introduced in v2.1.89 with the rationale: "Workflow scripts call agent({schema: BUGS_SCHEMA}) 30-80 times per run with the same schema object reference. Without caching, each call does new Ajv() + validateSchema() + compile() (~1.4 ms of JIT codegen). Identity cache brings 80-call workflows from ~110 ms to ~4 ms Ajv overhead."

---

## Why Two Names Lingered

**The source filename stayed `SyntheticOutputTool.ts`** because:
- Internal references and imports throughout the codebase already used `SyntheticOutputTool`.
- A rename of the file would touch every test file and adjacent module that imported it.
- The cost-of-change wasn't worth the cosmetic improvement.

Meanwhile the *registered tool name* — which is the only string the model sees — was set to `StructuredOutput` from day one. This way the public surface was always "StructuredOutput" while the internal code organization didn't have to churn.

---

## v2.1.112 → v2.1.142 Deltas

- **No rename event in this window.** The TS source `SyntheticOutputTool.ts` and the bundle's `J0 = "StructuredOutput"` both predate v2.1.112.
- **v2.1.89:** Schema-identity cache (`sdK` WeakMap) — see [structured_output.md](./structured_output.md) for the cache explanation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Inactive Legacy / Structured Output*

Key cross-references:
- See [structured_output.md](./structured_output.md) for the full implementation deep-dive.
- 2.1.88 TS file: `src/tools/SyntheticOutputTool/SyntheticOutputTool.ts`
- 2.1.142 bundle: `cli_inner_pretty.js:207570 (J0)`, `:207581-207637 ($Y6)`, `:207542-207566 (_H_)`
