# `hookSpecificOutput.updatedToolOutput` Generalization (v2.1.121)

## Overview

v2.1.121 generalizes the PostToolUse hook's ability to **rewrite a tool's output** from MCP-only to all tools. The changelog:

> PostToolUse hooks can replace tool output for all tools via `hookSpecificOutput.updatedToolOutput` (previously MCP-only)

Pre-v2.1.121, hooks could set `hookSpecificOutput.updatedMCPToolOutput` and the runtime would substitute it for the tool's response — but only for MCP tools (`isMcpTool(tool)` gate). Native tools (Read, Edit, Bash, etc.) ignored the field.

In v2.1.121, the new `updatedToolOutput` works for **all tools**. The legacy `updatedMCPToolOutput` is retained for backwards compatibility and continues to work for MCP tools — but the schema-side description now points users at the new field.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools
> - [symbol_additions_v2_1_142_hooks.md](../00_overview/symbol_additions_v2_1_142_hooks.md) - New symbols

Key functions in this document:

- `applyHookJSONOutput` (`TW8`) — Reads both `updatedToolOutput` and `updatedMCPToolOutput`
- `postToolUseAggregator` (`G38`) — Yields `updatedToolOutput` to the tool executor
- `executeToolWithHooks` (in `runToolWithHooks` flow) — Applies the substitution + schema validation
- `dispatchHookOutputStream` (`aP`) — Streams the field through the aggregator
- `postToolUseHookSchema` (inside `hookResponseSchema`) — Schema variant for PostToolUse

## Schema (v2.1.142)

```javascript
// ============================================
// postToolUseHookSpecificOutput - Schema with both fields
// Location: cli_inner_pretty.js:519063-519073
// ============================================

// ORIGINAL (for source lookup):
y.object({
  hookEventName: y.literal("PostToolUse"),
  additionalContext: y.string().optional(),
  updatedToolOutput: y
    .unknown()
    .describe("Replaces the tool output before it is sent to the model")
    .optional(),
  updatedMCPToolOutput: y
    .unknown()
    .describe("Replaces the output for MCP tools only. Prefer updatedToolOutput, which works for all tools")
    .optional(),
}),

// READABLE (for understanding):
const postToolUseHookSpecificOutput = z.object({
  hookEventName: z.literal("PostToolUse"),
  additionalContext: z.string().optional(),
  // NEW v2.1.121: works for all tools (native and MCP)
  updatedToolOutput: z.unknown().optional(),
  // LEGACY: retained for backwards compat; only honored for MCP tools
  updatedMCPToolOutput: z.unknown().optional(),
});

// Mapping: y→zod
```

The "Prefer updatedToolOutput" hint in the description steers new code to the generalized field.

## Parser

```javascript
// ============================================
// applyHookJSONOutput - PostToolUse output rewrite — both fields handled
// Location: cli_inner_pretty.js:520725-520735
// ============================================

// ORIGINAL (for source lookup):
case "PostToolUse":
  if (
    ((M.additionalContext = H.hookSpecificOutput.additionalContext),
    H.hookSpecificOutput.updatedToolOutput !== void 0)
  )
    M.updatedToolOutput = H.hookSpecificOutput.updatedToolOutput;
  if (H.hookSpecificOutput.updatedMCPToolOutput)
    M.updatedMCPToolOutput = H.hookSpecificOutput.updatedMCPToolOutput;
  break;

// READABLE (for understanding):
case "PostToolUse":
  result.additionalContext = parsedJSON.hookSpecificOutput.additionalContext;
  // NEW v2.1.121: explicit !== undefined check (so `null` and `false` are valid replacement values)
  if (parsedJSON.hookSpecificOutput.updatedToolOutput !== undefined) {
    result.updatedToolOutput = parsedJSON.hookSpecificOutput.updatedToolOutput;
  }
  // LEGACY: truthy check is fine — MCP tool output is always an object
  if (parsedJSON.hookSpecificOutput.updatedMCPToolOutput) {
    result.updatedMCPToolOutput = parsedJSON.hookSpecificOutput.updatedMCPToolOutput;
  }
  break;

// Mapping: H→parsedJSON, M→result
```

## Stream Aggregator Yielding

```javascript
// ============================================
// postToolUseAggregator - Stream-side fan-out for both fields
// Location: cli_inner_pretty.js:378982-378985
// ============================================

// ORIGINAL (for source lookup):
if (j.updatedToolOutput !== void 0) yield { updatedToolOutput: j.updatedToolOutput };
if (j.updatedMCPToolOutput !== void 0 && k0($)) yield { updatedToolOutput: j.updatedMCPToolOutput };

// READABLE (for understanding):
if (yielded.updatedToolOutput !== undefined) {
  // NEW v2.1.121: pass through directly — all tools accept it
  yield { updatedToolOutput: yielded.updatedToolOutput };
}
if (yielded.updatedMCPToolOutput !== undefined && isMcpTool(tool)) {
  // LEGACY: only honored for MCP tools, BUT translates to the unified field on the way out
  // so the consumer sees one shape regardless of which field the hook used.
  yield { updatedToolOutput: yielded.updatedMCPToolOutput };
}

// Mapping: j→yielded, $→tool, k0→isMcpTool
```

This is the **key compatibility shim**: the stream consumer sees one field (`updatedToolOutput`), regardless of which name the hook used. Old hooks emitting `updatedMCPToolOutput` against MCP tools continue to work; the translation happens at the stream-yield boundary.

The streaming aggregator `aP` also forwards both fields independently for non-MCP consumers (`cli_inner_pretty.js:522055-522058`):

```javascript
if (g.updatedToolOutput !== void 0)
  (N(`Hook ${M} (${JS(g.hook)}) replaced tool output`), yield { updatedToolOutput: g.updatedToolOutput });
if (g.updatedMCPToolOutput !== void 0 && g.updatedToolOutput === void 0)
  (N(`Hook ${M} (${JS(g.hook)}) replaced tool output (updatedMCPToolOutput)`),
    yield { updatedMCPToolOutput: g.updatedMCPToolOutput });
```

Note the second branch: `updatedMCPToolOutput` is only yielded if `updatedToolOutput` is **not also set**. If a hook sets both (a contradiction), `updatedToolOutput` wins.

## Validation in Tool Executor

```javascript
// ============================================
// executeToolWithHooks - Schema-validate the hook's replacement output
// Location: cli_inner_pretty.js:388422-388459
// ============================================

// ORIGINAL (for source lookup):
for await (let hH of G38(K, H, $, A.message.id, L, _H, Y, f, O, HH))
  if (((JH = !0), "updatedToolOutput" in hH)) ((_H = hH.updatedToolOutput), (PH = !0));
  else if ((YH.push(hH), hH.message.type === "attachment")) { ... }
let NH = Date.now() - vH;
if (JH) {
  let hH = Z38(H.name, $, L, K.readFileState);
  if (hH) YH.push({ message: hH });
}
if (NH >= mE6) N(`Slow PostToolUse hooks: ${NH}ms for ${H.name} (${TH.length} hooks)`, { level: "info" });
if (k0(H)) await GH(_H);
else {
  let hH = t;
  if (PH) {
    let FH = H.outputSchema?.safeParse(_H),
      lH = (H$) => {
        N(`PostToolUse hook returned updatedToolOutput that does not match ${H.name}'s output shape: ${H$}`,
          { level: "error" });
        (_H = KH.data);                    // ← revert to original output
        YH.push({
          message: fK({
            type: "hook_error_during_execution",
            content: `PostToolUse hook returned updatedToolOutput that does not match ${H.name}'s output shape; using original output. ${H$}`,
            hookName: `PostToolUse:${H.name}`,
            toolUseID: $,
            hookEvent: "PostToolUse",
          }),
        });
      };
    if (FH && !FH.success) lH(FH.error.message);
    else
      try {
        let H$ = H.mapToolResultToToolResultBlockParam(_H, $);
        if (H$ === void 0) lH("mapper returned undefined");
        else hH = H$;
      } catch (H$) { lH(V9H(H$)); }
  }
  await GH(_H, hH);
}

// READABLE (for understanding):
let hookProducedReplacement = false;
for await (const yielded of postToolUseAggregator(...)) {
  if ("updatedToolOutput" in yielded) {
    currentOutput = yielded.updatedToolOutput;
    hookProducedReplacement = true;
  } else if (yielded.message?.type === "attachment") {
    collected.push(yielded);
    /* ... */
  }
}

if (isMcpTool(tool)) {
  // MCP tools: no native output schema to validate against; pass through
  await sendMcpResponse(currentOutput);
} else {
  // Native tools: validate the replacement against the tool's outputSchema
  let resultBlockParam = originalToolResultBlockParam;
  if (hookProducedReplacement) {
    const parsed = tool.outputSchema?.safeParse(currentOutput);
    const reportRejection = (errMessage) => {
      logForDebugging(
        `PostToolUse hook returned updatedToolOutput that does not match ${tool.name}'s output shape: ${errMessage}`,
        { level: "error" },
      );
      currentOutput = originalOutput;        // ← revert — hook output is invalid
      collected.push({
        message: createAttachmentMessage({
          type: "hook_error_during_execution",
          content: `PostToolUse hook returned updatedToolOutput that does not match ${tool.name}'s output shape; using original output. ${errMessage}`,
          hookName: `PostToolUse:${tool.name}`,
          toolUseID,
          hookEvent: "PostToolUse",
        }),
      });
    };

    if (parsed && !parsed.success) {
      reportRejection(parsed.error.message);
    } else {
      try {
        const mapped = tool.mapToolResultToToolResultBlockParam(currentOutput, toolUseID);
        if (mapped === undefined) {
          reportRejection("mapper returned undefined");
        } else {
          resultBlockParam = mapped;
        }
      } catch (e) {
        reportRejection(errorMessage(e));
      }
    }
  }
  await sendToolResponse(currentOutput, resultBlockParam);
}

// Mapping:
//   G38→postToolUseAggregator, K→runContext, H→tool, $→toolUseID, A→assistantMessage,
//   L→permissionMode, _H→currentOutput, PH→hookProducedReplacement, JH→hookProducedAny,
//   k0→isMcpTool, GH→sendToolResponse, t→originalToolResultBlockParam,
//   KH→originalToolResult, FH→parsed, lH→reportRejection, H$→mapped, fK→createAttachmentMessage
```

## Key Decisions/Algorithms

### Schema-validate the replacement output

**What it does:** Native tools have an `outputSchema` (Zod). If the hook's replacement output doesn't conform, the runtime **rejects the replacement** (logs an error, falls back to the original output) instead of forwarding malformed data to the model.

**How it works:**
1. `tool.outputSchema?.safeParse(currentOutput)` — soft parse, returns `{ success: false, error }` on mismatch.
2. If parse fails → log + revert + emit a `hook_error_during_execution` attachment.
3. If parse succeeds → run `mapToolResultToToolResultBlockParam` to project to the model-visible block format.
4. If mapper returns undefined or throws → same rejection path.

**Why this approach:**
- Hook authors could otherwise return totally-wrong shapes (e.g., a string where the tool expects a `{file, content, lineCount}` object). Without validation, the model would see structurally-invalid output and either misbehave or crash downstream.
- Reverting silently is wrong (the hook author needs to know their substitution failed). Reverting **with a system message** in the transcript is the chosen middle ground: the model sees both the original output AND a notification that the hook's replacement was rejected.

**Key insight:** The hook can replace output, but it can't break the tool's contract. The output schema is a structural guard. MCP tools are exempt because their schemas are dynamic and the validation responsibility moves to the MCP server.

### `!== undefined` vs truthy check

**What it does:** `updatedToolOutput !== undefined` accepts falsy values (`null`, `false`, `""`, `0`, `[]`, `{}`).

**Why this approach:**
- Hooks should be allowed to rewrite output to falsy values. A hook that censors a verbose output to `""` (empty string), or replaces a list result with `[]`, is a legitimate substitution pattern. A truthy check would silently drop these.
- `updatedMCPToolOutput` uses a truthy check (`if (H.hookSpecificOutput.updatedMCPToolOutput)`) — MCP outputs are always objects so this works in practice, but the new field uses the stricter check to enable falsy replacement.

**Key insight:** The field shape is `unknown` (Zod) — anything is valid. Strict undefined check is the only way to distinguish "absent" from "set to falsy value."

### MCP fallback is one-way

**What it does:** A hook setting `updatedMCPToolOutput` against an MCP tool sees it applied. A hook setting `updatedToolOutput` against an MCP tool also sees it applied. A hook setting `updatedMCPToolOutput` against a **native** tool sees... nothing. The field is silently ignored.

**Why this approach:**
- Backwards compatibility: old hooks targeting MCP only should keep working.
- New hooks should use `updatedToolOutput` which works everywhere.
- The "ignored for native" silent-drop behavior matches v2.1.112 semantics: pre-v2.1.121, `updatedMCPToolOutput` against a native tool was also silently ignored. v2.1.121 doesn't break this contract.

**Key insight:** The schema comment ("Prefer updatedToolOutput, which works for all tools") nudges authors. There's no aggressive deprecation warning — both fields remain valid. Migration is opt-in.

### `mapToolResultToToolResultBlockParam` re-runs on replacement

**What it does:** After validation, the runtime re-projects the hook's replacement output through the tool's content-block mapper, not the original mapper output.

**Why this approach:**
- The mapper converts tool output to model-visible content blocks (text, image, tool_result). A hook's replacement output needs the same projection — otherwise the model sees a structurally-wrong block.
- Running the mapper on the replacement also tests it: if the mapper throws or returns undefined, the replacement is rejected.

**Key insight:** This is a **double validation**: schema validates the shape, mapper validates the projectability. A hook that produces shape-valid but mapper-incompatible output (e.g., schema says `string | { url: string }` but mapper only handles strings) gets caught.

## Diff vs v2.1.112

In v2.1.112's `/lyz/codespace/3rd/claude-code/src/utils/hooks.ts:645-648` and `services/tools/toolHooks.ts:145-149`, only `updatedMCPToolOutput` existed:

```typescript
// v2.1.88 / v2.1.112:
if (json.hookSpecificOutput.updatedMCPToolOutput) {
  result.updatedMCPToolOutput = json.hookSpecificOutput.updatedMCPToolOutput;
}
// ... later:
if (result.updatedMCPToolOutput && isMcpTool(tool)) {
  toolOutput = result.updatedMCPToolOutput as Output;
}
```

The v2.1.121 patch adds:
1. Schema: `updatedToolOutput: z.unknown().optional()` added before `updatedMCPToolOutput`.
2. Schema: `updatedMCPToolOutput` description updated to "Replaces the output for MCP tools only. Prefer updatedToolOutput, which works for all tools."
3. Parser: `if (H.hookSpecificOutput.updatedToolOutput !== void 0)` branch added to `applyHookJSONOutput`.
4. Stream aggregator `postToolUseAggregator`: forwards `updatedToolOutput` directly; translates `updatedMCPToolOutput` → `updatedToolOutput` for MCP tools.
5. Stream aggregator `dispatchHookOutputStream`: forwards both fields with precedence (updatedToolOutput wins).
6. Tool executor: branches on `isMcpTool` — native tools schema-validate the replacement before passing through.

## Related Reading

- Tool output schemas: see `00_overview/symbol_index_core_execution.md` "Tools" for `outputSchema` and `mapToolResultToToolResultBlockParam`.
- Pre-v2.1.121 MCP-only behavior: TS source at `src/utils/hooks.ts:645-648` and `services/tools/toolHooks.ts:145-149`.
