# `_meta["anthropic/maxResultSizeChars"]` — Per-tool 500 K Override

**Versions:** introduced 2.1.91 · fixed 2.1.98 (persist layer bypass)

## Summary

An MCP server can now advertise per tool an `_meta` annotation that lifts the default result-size ceiling (typically 25 000–100 000 chars) up to a hard maximum of **500 000 chars** (~125 K tokens). The classic motivating use case: a database-tools MCP server whose `describe_schema` returns 200 KB of DDL, or a Kubernetes MCP whose `get_logs` returns 300 KB. Without the override, both would be persisted to disk and surfaced to the model only as a truncated preview, which forces the model into a wasteful "now read the persisted file" turn.

## Files Involved

- v2.1.88 baseline: `claude-code-kim/src/Tool.ts` defined `maxResultSizeChars` as a per-tool *static* property (e.g. 100 000 for most tools, 20 000 for Grep, 30 000 for Bash). No MCP override path existed.
- v2.1.112: `chunks.162.mjs:578-617` (the MCP tool wrapper) reads `_meta["anthropic/maxResultSizeChars"]` and substitutes it (clamped to 500 000).

## The Decision: Read-and-Clamp at Tool-List Time

```javascript
// ============================================
// adaptMcpToolWithMetaOverride - apply _meta["anthropic/maxResultSizeChars"] to MCP tool wrapper
// Location: chunks.162.mjs:578-617
// ============================================

// ORIGINAL (for source lookup):
return _.map((Y) => {
    let A = tC(q.name, Y.name),
        O = Y._meta?.["anthropic/maxResultSizeChars"],
        w = typeof O === "number" && Number.isFinite(O) && O > 0;
    return {
        ...Zz7,
        name: z ? Y.name : A,
        mcpInfo: { serverName: q.name, toolName: Y.name },
        isMcp: !0,
        searchHint: typeof Y._meta?.["anthropic/searchHint"] === "string"
            ? Y._meta["anthropic/searchHint"].replace(/\s+/g, " ").trim() || void 0
            : void 0,
        alwaysLoad: Y._meta?.["anthropic/alwaysLoad"] === !0,
        async description() { return Y.description ?? "" },
        async prompt() {
            let $ = Y.description ?? "";
            return $.length > M98 ? $.slice(0, M98) + "… [truncated]" : $
        },
        // ...
        maxResultSizeChars: w ? Math.min(O, Vg1) : Zz7.maxResultSizeChars,
        persistenceThresholdCeiling: w ? Vg1 : void 0,
        inputJSONSchema: Y.inputSchema,
        // ...
    }
});

// READABLE (for understanding):
return mcpListedTools.map((toolDef) => {
    const fqn = formatToolName(server.name, toolDef.name);             // "mcp__myserver__describe_schema"
    const requestedMax = toolDef._meta?.["anthropic/maxResultSizeChars"];
    const hasValidOverride =
        typeof requestedMax === "number" &&
        Number.isFinite(requestedMax) &&
        requestedMax > 0;
    return {
        ...defaultMcpToolBase,
        name: stripPrefixForSdk ? toolDef.name : fqn,
        mcpInfo: { serverName: server.name, toolName: toolDef.name },
        isMcp: true,
        searchHint: parseSearchHintMeta(toolDef._meta?.["anthropic/searchHint"]),
        alwaysLoad: toolDef._meta?.["anthropic/alwaysLoad"] === true,
        async description() { return toolDef.description ?? "" },
        async prompt() {
            const desc = toolDef.description ?? "";
            return desc.length > MCP_DESCRIPTION_MAX_CHARS
                ? desc.slice(0, MCP_DESCRIPTION_MAX_CHARS) + "… [truncated]"
                : desc;
        },
        maxResultSizeChars: hasValidOverride
            ? Math.min(requestedMax, MCP_MAX_RESULT_HARD_CEILING)   // Vg1 = 500_000
            : defaultMcpToolBase.maxResultSizeChars,
        persistenceThresholdCeiling: hasValidOverride
            ? MCP_MAX_RESULT_HARD_CEILING
            : undefined,
        inputJSONSchema: toolDef.inputSchema,
        // ...
    };
});

// Mapping: Y→toolDef, A→fqn, O→requestedMax, w→hasValidOverride,
//          Zz7→defaultMcpToolBase, Vg1→MCP_MAX_RESULT_HARD_CEILING (500000),
//          tC→formatToolName, M98→MCP_DESCRIPTION_MAX_CHARS, z→stripPrefixForSdk
```

### How the override flows through

**What it does:** During `tools/list` discovery, for each MCP tool the wrapper:
1. Reads `_meta["anthropic/maxResultSizeChars"]` from the tool definition.
2. If finite-positive-number, computes `min(value, 500 000)` and sets it as the tool's `maxResultSizeChars`.
3. **Also** sets `persistenceThresholdCeiling = 500_000`, which signals the downstream token-based persist layer to skip its own (often lower) truncation gate.

**How it works (step-by-step):**
1. MCP server returns a `tools/list` result with `_meta` per tool:
   ```json
   {
     "tools": [
       {
         "name": "describe_schema",
         "description": "Return full SQL schema dump",
         "inputSchema": { ... },
         "_meta": { "anthropic/maxResultSizeChars": 250000 }
       }
     ]
   }
   ```
2. Each entry is mapped into a Claude Code Tool object.
3. The override is **clamped** to 500 000 — even if a server requests 10 million, only 500 000 is honored.
4. `persistenceThresholdCeiling: Vg1` is set, which the downstream persist gate (`truncateToolResultIfOversized` / `IZ4` at `chunks.86.mjs:2834-2861`) consults via `resolvePersistThreshold` (`JS8`) to choose the actual threshold per tool.
5. When the tool is invoked and returns a large result, `truncateToolResultIfOversized` checks the size against the resolved threshold; if under, it returns inline; if over, it persists to disk and emits a `<persisted-output>` block (see [large_output_truncation.md](./large_output_truncation.md)).

### The 2.1.98 follow-up fix

The 2.1.91 implementation set `maxResultSizeChars` but the result still passed through a **token-based** persist layer (`mP4 = 400 000` chars / ~100 K tokens default). MCP tools with `_meta["anthropic/maxResultSizeChars"]: 500000` were still being persisted at the 400 K boundary because the token gate ran first. 2.1.98 fixed this by introducing `persistenceThresholdCeiling: Vg1` — when present, `resolvePersistThreshold` (`JS8` at `chunks.86.mjs:2819`) returns the per-tool ceiling, effectively bypassing the global token gate up to the `_meta` value.

## Why This Approach

**Per-tool annotation vs. global env-var:** A single `MAX_RESULT_SIZE_CHARS=500000` env-var would loosen *every* tool, including ones that should stay tight (a search tool returning 500 KB of matches is mostly noise). Per-tool annotation lets the server author — who knows the shape of each tool's output — make individual choices.

**Annotation on the tool, not the call:** The cap is fixed at tool-list time, not per-call. This is intentional: a model that can't trust the cap could choose to call low-cap tools strategically to game its result budget. By fixing it server-side, the cap is part of the tool contract.

**Hard 500 K ceiling chosen because:**
1. 500 000 chars ≈ 125 K tokens, which fits comfortably in a 200 K context model with room left for the rest of the conversation.
2. A larger ceiling would tempt MCP servers to "dump everything per call" — already a common anti-pattern with low-cap tools that resort to pagination tokens.
3. Below 500 K, the truncation/persistence overhead is negligible. Above it, the model loses context-window margin quickly.

**Clamping with `Math.min(value, ceiling)` rather than throwing on > ceiling:** A server author setting 1 000 000 expecting it to work, then having their server fail to connect, is a worse experience than getting "best-effort 500 000". The min-clamp also future-proofs: if 2.2 raises the ceiling to 1 000 000, no MCP servers have to change.

**Edge cases:**
- `_meta` absent or `_meta["anthropic/maxResultSizeChars"]` undefined → falls back to `defaultMcpToolBase.maxResultSizeChars`.
- Negative, zero, NaN, Infinity, or non-number → ignored by the `Number.isFinite(O) && O > 0` gate. Defensive: a server emitting `"500000"` (string) silently uses the default.
- The override applies to *both* `mapToolResultToToolResultBlockParam` (inline-vs-persist branching) *and* the token-based persist layer (`persistenceThresholdCeiling`). These two layers used to disagree pre-2.1.98.

**Key insight:** The pattern of "advertise capability via `_meta`" is the same pattern MCP uses for `anthropic/searchHint` (search-time keyword bias) and `anthropic/alwaysLoad` (tool list pinning). It keeps server-side knowledge inside the MCP namespace rather than spilling into Claude Code config. The clamp-and-fall-back behavior makes it forward-compatible: a v2.1.91 client and a v2.1.112 client see the same advertised tool list, but the older client just ignores the annotation.

## Related Symbols

See [`symbol_additions_unit_14.md`](../00_overview/symbol_additions_unit_14.md) section "Module: MCP — `_meta["anthropic/maxResultSizeChars"]` adapter".

Key entities:
- `adaptMcpToolWithMetaOverride` (anonymous map fn) - per-tool wrapper builder
- `MCP_MAX_RESULT_HARD_CEILING` (`Vg1`, = 500000) - the upper bound
- `defaultMcpToolBase` (`Zz7`) - base tool template
- `formatToolName` (`tC`) - `mcp__server__tool` name joiner
- `truncateToolResultIfOversized` (`IZ4`) - downstream persist gate
- `resolvePersistThreshold` (`JS8`) - threshold resolution honoring `persistenceThresholdCeiling`
