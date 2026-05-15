# StructuredOutput — Final JSON Result for Schema-Bound Calls

> **Tool name:** `StructuredOutput` (formerly `SyntheticOutput` in TS source)
> **Source:** `cli_inner_pretty.js:207581-207637` (`$Y6` declaration)
> **Search hint:** *return the final response as structured JSON*
> **Concurrency-safe:** true · **Read-only:** true · **isMcp:** false

---

## Overview

`StructuredOutput` is the schema-bound final-output channel for the Agent SDK and `--print` mode. When a caller passes a JSON schema (`agent({schema: BUGS_SCHEMA})`), Claude is required to **call StructuredOutput exactly once at the end**, with input matching that schema.

The schema is dynamic per call — `inputJSONSchema` is set when the tool is built from a user-provided schema, validated with Ajv at call time, and rejected if it doesn't match.

---

## Schema (the tool's own envelope)

```javascript
// ============================================
// structuredOutputInputSchema - qH_ passthrough envelope
// Location: cli_inner_pretty.js:207579
// ============================================

// ORIGINAL (for source lookup):
qH_ = yH(() => y.object({}).passthrough());
KH_ = yH(() => y.string().describe("Structured output tool result"));

// READABLE (for understanding):
const structuredOutputInputSchema = lazySchema(() => z.object({}).passthrough());
const structuredOutputOutputSchema = lazySchema(() => z.string().describe("Structured output tool result"));

// Mapping: qH_→structuredOutputInputSchema, KH_→structuredOutputOutputSchema
```

The base schema is `object().passthrough()` — accept any shape. The **caller's** JSON schema is layered on top via `_H_` (`buildStructuredOutputTool`).

---

## Key Behavior

### Per-call schema attachment

```javascript
// ============================================
// buildStructuredOutputTool - Ajv-validated dynamic tool wrapper
// Location: cli_inner_pretty.js:207542-207566
// ============================================

// ORIGINAL (for source lookup):
function _H_(H) {
  try {
    let $ = new tdK.Ajv({ allErrors: !0 });
    if (!$.validateSchema(H)) return { error: $.errorsText($.errors) };
    let K = $.compile(H);
    return {
      tool: {
        ...$Y6,
        inputJSONSchema: H,
        async call(_) {
          if (!K(_)) {
            let z = K.errors?.map((Y) => `${Y.instancePath || "root"}: ${Y.message}`).join(", ");
            throw new fh(
              `Output does not match required schema: ${z}`,
              `StructuredOutput schema mismatch: ${(z ?? "").slice(0, 150)}`,
            );
          }
          return { data: "Structured output provided successfully", structured_output: _ };
        },
      },
    };
  } catch ($) {
    return { error: $ instanceof Error ? $.message : String($) };
  }
}

// READABLE (for understanding):
function buildStructuredOutputTool(jsonSchema) {
  try {
    const ajv = new Ajv({ allErrors: true });
    if (!ajv.validateSchema(jsonSchema)) return { error: ajv.errorsText(ajv.errors) };
    const validate = ajv.compile(jsonSchema);
    return {
      tool: {
        ...StructuredOutputTool,                      // spread the base tool
        inputJSONSchema: jsonSchema,                  // attach the caller's schema
        async call(input) {
          if (!validate(input)) {
            const errors = validate.errors
              ?.map(e => `${e.instancePath || "root"}: ${e.message}`)
              .join(", ");
            throw new TelemetrySafeError(
              `Output does not match required schema: ${errors}`,            // model-visible
              `StructuredOutput schema mismatch: ${(errors ?? "").slice(0, 150)}`,  // redacted telemetry
            );
          }
          return { data: "Structured output provided successfully", structured_output: input };
        },
      },
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

// Mapping: _H_→buildStructuredOutputTool, $Y6→StructuredOutputTool, fh→TelemetrySafeError
```

### v2.1.89 schema cache (`sdK` WeakMap)

```javascript
// ============================================
// getOrCreateStructuredOutputTool - WeakMap-keyed Ajv cache
// Location: cli_inner_pretty.js:207536-207541
// ============================================

// ORIGINAL (for source lookup):
function ce$(H) {
  let $ = sdK.get(H);
  if ($) return $;
  let q = _H_(H);
  return (sdK.set(H, q), q);
}
// ...
sdK = new WeakMap();

// READABLE (for understanding):
const toolCache = new WeakMap();   // schemaObject → CreateResult

function getOrCreateStructuredOutputTool(jsonSchema) {
  const cached = toolCache.get(jsonSchema);
  if (cached) return cached;
  const result = buildStructuredOutputTool(jsonSchema);
  toolCache.set(jsonSchema, result);
  return result;
}

// Mapping: ce$→getOrCreateStructuredOutputTool, sdK→toolCache
```

**Performance:** workflow scripts call `agent({schema: BUGS_SCHEMA})` 30–80 times per run with the same schema *object reference*. Without caching, each call does `new Ajv() + validateSchema() + compile()` (~1.4 ms of JIT codegen). The identity cache (WeakMap, no GC keeping schema objects alive longer than they would be) brings 80-call workflow overhead from ~110 ms to ~4 ms.

---

## Key Insights

**Why `passthrough()` at the base + JSON-schema overlay at call time?**
- The tool registry doesn't know the per-call schema at tool-list time — schemas are caller-supplied at agent invocation.
- `passthrough()` makes the base schema accept any shape so registration succeeds.
- The Ajv layer runs at `call()` time, after the model has emitted input matching its prompt-side schema description.

**TelemetrySafeError split.** The thrown error has two strings: a long, model-visible one with full instance-path errors (`/properties/bugs/0/severity: must be one of [low, medium, high]`), and a 150-char redacted version for telemetry. Telemetry can't ship raw error messages because they may contain user data slices; the 150-char prefix is human-debuggable but unlikely to leak PII.

**`isMcp: false` and `isOpenWorld: false` matter.** This is a *built-in* tool with a closed input domain (its current schema). It's not an MCP tool that could change at runtime — once attached, the schema is static for that call. The flags tell the tool-search and permission systems to skip dynamic-discovery handling.

**WeakMap is the right cache key.** Schemas are usually module-level objects (literal `const BUGS_SCHEMA = { ... }`); they live for the program's lifetime. A `Map` would keep them alive even when their source module unloaded. The WeakMap lets them be GC'd if all real references vanish.

**Why the "structured output provided successfully" string?** The call return shape `{ data, structured_output }` is consumed by the SDK runner. `data` is the human-readable acknowledgment shown in the transcript; `structured_output` is the actual payload returned to the SDK caller. The tool's `outputSchema` describes just the `data` string — the `structured_output` field is the side-channel to the SDK.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.89:** Schema-cache (`sdK` WeakMap) was added to fix the 110 ms-per-call Ajv compile overhead in workflow scripts.
- **v2.1.122:** Fixed Vertex/Bedrock `output_config: Extra inputs are not permitted` 400 errors on structured-output queries.
- The tool name `StructuredOutput` is the rebrand of TypeScript's `SyntheticOutputTool` — the obfuscated bundle still uses the new name `J0 = "StructuredOutput"`.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Structured Output*

Key functions in this document:
- `StructuredOutputTool` (`$Y6`) — base tool spread by per-call builders
- `STRUCTURED_OUTPUT_TOOL_NAME` (`J0`) — `"StructuredOutput"`
- `structuredOutputInputSchema` (`qH_`) — passthrough envelope
- `getOrCreateStructuredOutputTool` (`ce$`) — WeakMap-cached entry
- `buildStructuredOutputTool` (`_H_`) — Ajv-validated dynamic tool builder
- `structuredOutputSchemaCache` (`sdK`) — WeakMap-based identity cache (v2.1.89)
- `TelemetrySafeError` (`fh`) — error class with split model-visible/telemetry messages
- `Ajv` (`tdK`) — JSON schema validator
