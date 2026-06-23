/**
 * StructuredOutputTool — the schema-forcing "final answer" tool (a.k.a. the SyntheticOutputTool
 * family). Unlike every other built-in, this one is NEVER part of the normal agent tool set: the
 * base object `A5r` is never placed into `getAllBaseTools()` (`LW`) at all, and the tool-list filter
 * `zR` additionally name-excludes `Em` ("StructuredOutput") defensively (see below). Instead it is
 * injected *per call* by the agent-run path whenever the launching Agent / Workflow supplies a JSON
 * schema (`{schema}`). The injected clone carries the caller's schema as `inputJSONSchema` and
 * validates the model's output against it, so the model is forced to "return its answer by calling
 * this tool" in the requested shape.
 *
 * 2.1.88 convention mirror: src/tools/SyntheticOutputTool/SyntheticOutputTool.ts — the base object
 * is byte-equivalent (isMcp/isEnabled/isReadOnly/isOpenWorld, the description & prompt strings, the
 * Ajv-compiled per-call clone). Reconstructed for v2.1.183 with the bundle's exact wiring.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   :221489            Em   = name const "StructuredOutput"
 *   :221498-221544     lvd/cvd/A5r = base input/output schema + the base tool object (`oG` module)
 *   :221457-221462     Ftt  = forceSchemaTool (memoizes per JSON schema via A1i WeakMap)
 *   :221463-221485     uvd  = compileForcedSchemaTool (Ajv compile + custom validating call)
 *   :575776-575793     U$l  = condition-checker clone ({ ok, reason, impossible }, alwaysLoad, prompt override)
 *   :436622-436652     zR   = the tool-list filter that name-excludes Em ([_G,kG,Em] = MCP-list/MCP-read/StructuredOutput) (:436634)
 *   :694019-694041     agent-run wiring (Ftt(An) → append tool, bg-stash, telemetry)
 * 2.1.156 scaffold: 04_tools/README.md (carryover; the {schema} forcing path predates 2.1.156)
 * Cross-validation: description/prompt/error strings quoted verbatim from the bundle; the Ajv
 *   compile + `Output does not match required schema` throw read line-for-line at :221463-221485.
 */

import { z } from "zod/v4";
import { Ajv } from "ajv";
import type { ToolDef, ToolInputJSONSchema } from "../Tool";
import { buildTool } from "../Tool";
import { lazySchema } from "../utils/lazySchema";
// helper: Bl @cli_inner_pretty.js:8957-8963 — TelemetrySafeError(userMessage, telemetryMessage).
//   The first arg is shown to the model; the second is a redacted message safe for telemetry.
import { TelemetrySafeError } from "../utils/errors";
// helper: Re @bundle — jsonStringify (used by renderToolUseMessage to preview field values).
import { jsonStringify as Re } from "../utils/slowOperations";
// helper: G @bundle — logEvent; Qe @bundle — telemetry redactor; yi @bundle — isBackgroundSession;
//   stashBgStructuredResult @bundle — persists the structured result for a background run to read.
import { logEvent as G } from "../services/analytics";

// 2.1.183: STRUCTURED_OUTPUT_TOOL_NAME = Em @cli_inner_pretty.js:221489
export const STRUCTURED_OUTPUT_TOOL_NAME = "StructuredOutput";

// 2.1.183: inputSchema = lvd @cli_inner_pretty.js:221498
// Permissive base — the *real* schema is injected per call as `inputJSONSchema` (see below).
const inputSchema = lazySchema(() => z.object({}).passthrough());
type InputSchema = ReturnType<typeof inputSchema>;

// 2.1.183: outputSchema = cvd @cli_inner_pretty.js:221499
const outputSchema = lazySchema(() => z.string().describe("Structured output tool result"));
type OutputSchema = ReturnType<typeof outputSchema>;
export type Output = z.infer<OutputSchema>;

/**
 * The base StructuredOutput tool object. Used directly only as the spread base for the per-call
 * forced clones (`compileForcedSchemaTool`, `buildConditionCheckerTool`); on its own it is filtered
 * out of every assembled tool pool by `zR`.
 *
 * 2.1.183: SyntheticOutputTool = A5r @cli_inner_pretty.js:221500-221544
 */
export const SyntheticOutputTool = buildTool({
  isMcp: false, // @221501
  isEnabled() {
    return true; // @221502-221504 — always enabled once it is actually injected.
  },
  isConcurrencySafe() {
    return true; // @221505
  },
  isReadOnly() {
    return true; // @221508
  },
  isOpenWorld() {
    return false; // @221511
  },
  name: STRUCTURED_OUTPUT_TOOL_NAME,
  searchHint: "return the final response as structured JSON", // @221515
  maxResultSizeChars: 100_000, // @221516

  // @221517-221519  (verbatim)
  async description() {
    return "Return structured output in the requested format";
  },
  // @221520-221522  (verbatim; matches assets/tools/StructuredOutput.md)
  async prompt() {
    return "Use this tool to return your final response in the requested structured format. You MUST call this tool exactly once at the end of your response to provide the structured output.";
  },

  get inputSchema(): InputSchema {
    return inputSchema();
  },
  get outputSchema(): OutputSchema {
    return outputSchema();
  },

  // @221529-221531 — the base call simply echoes the input back as the structured output.
  async call(input: Record<string, unknown>) {
    return { data: "Structured output provided successfully", structured_output: input };
  },

  // @221532-221534 — never prompts; structured output is part of the answer, not an action.
  async checkPermissions(input: Record<string, unknown>) {
    return { behavior: "allow" as const, updatedInput: input };
  },

  // @221535-221540 — preview up to 3 field names, then "<N> fields: …".
  renderToolUseMessage(input: Record<string, unknown>) {
    const keys = Object.keys(input);
    if (keys.length === 0) return null;
    if (keys.length <= 3) return keys.map((k) => `${k}: ${Re(input[k])}`).join(", ");
    return `${keys.length} fields: ${keys.slice(0, 3).join(", ")}…`;
  },

  mapToolResultToToolResultBlockParam(output: string, toolUseID: string) {
    return { tool_use_id: toolUseID, type: "tool_result", content: output };
  },
} satisfies ToolDef<InputSchema, Output>);

/** Result of {@link forceSchemaTool}: either a ready-to-inject tool, or an Ajv schema error. */
type ForcedSchemaResult =
  | { tool: ReturnType<typeof buildTool> & { inputJSONSchema: ToolInputJSONSchema } }
  | { error: string };

// Per-JSON-schema memoization cache. 2.1.183: A1i (WeakMap) @cli_inner_pretty.js:221545
const forcedSchemaCache = new WeakMap<object, ForcedSchemaResult>();

/**
 * forceSchemaTool — public entry. Memoizes per JSON-schema object so the same Agent `{schema}` is
 * compiled only once, then delegates to {@link compileForcedSchemaTool}.
 * 2.1.183: Ftt @cli_inner_pretty.js:221457-221462
 */
export function forceSchemaTool(jsonSchema: ToolInputJSONSchema): ForcedSchemaResult {
  const cached = forcedSchemaCache.get(jsonSchema);
  if (cached) return cached;
  const result = compileForcedSchemaTool(jsonSchema);
  forcedSchemaCache.set(jsonSchema, result);
  return result;
}

/**
 * compileForcedSchemaTool — compile the caller's JSON schema with Ajv and return a clone of the
 * base tool whose `call` validates the model's output against that schema.
 * 2.1.183: uvd @cli_inner_pretty.js:221463-221485
 *
 * How it works:
 *  1. `new Ajv({ allErrors: true })`; `validateSchema(jsonSchema)` rejects a malformed schema up
 *     front → `{ error: <ajv errorsText> }` (the agent-run path turns this into telemetry, below).
 *  2. `compile(jsonSchema)` yields a fast validator; the clone is `{ ...SyntheticOutputTool,
 *     inputJSONSchema: jsonSchema, call(...) }` so the wire schema the model sees is the caller's.
 *  3. The custom `call` validates the model's output; on mismatch it throws a TelemetrySafeError
 *     whose user message lists each `<instancePath>: <message>` and whose telemetry message lists
 *     just the failing keywords (no instance data). On success it returns the structured output.
 *  4. Any thrown error during compile is caught and surfaced as `{ error }`.
 */
function compileForcedSchemaTool(jsonSchema: ToolInputJSONSchema): ForcedSchemaResult {
  try {
    const ajv = new Ajv({ allErrors: true });
    if (!ajv.validateSchema(jsonSchema)) {
      return { error: ajv.errorsText(ajv.errors) }; // @221466
    }
    const validate = ajv.compile(jsonSchema);
    return {
      tool: {
        ...SyntheticOutputTool,
        inputJSONSchema: jsonSchema,
        // @221472-221479
        async call(output: Record<string, unknown>) {
          if (!validate(output)) {
            const userDetail = validate.errors
              ?.map((e) => `${e.instancePath || "root"}: ${e.message}`)
              .join(", ");
            const telemetryKeywords = validate.errors?.map((e) => e.keyword).join(",");
            // @221476  (verbatim user message + telemetry message)
            throw new TelemetrySafeError(
              `Output does not match required schema: ${userDetail}`,
              `StructuredOutput schema mismatch: ${telemetryKeywords ?? ""}`,
            );
          }
          return { data: "Structured output provided successfully", structured_output: output };
        },
      },
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * buildConditionCheckerTool — a fixed-schema specialization of the base tool used as a yes/no
 * condition checker (e.g. by Workflow / loop gates). The wire JSON schema is the literal
 * `{ ok, reason }` object (the Zod `inputSchema` also carries a third `impossible` field);
 * `alwaysLoad: true` keeps it in the pool (it is exempt from the `zR` name-exclusion path).
 * Unlike the per-call forced clone, this one ALSO overrides the base `prompt()` with a
 * verification-specific instruction.
 * 2.1.183: U$l @cli_inner_pretty.js:575776-575793
 */
export function buildConditionCheckerTool() {
  return {
    ...SyntheticOutputTool,
    alwaysLoad: true, // @575779
    // 2.1.183: B9t @cli_inner_pretty.js:575813 — the Zod mirror of the JSON schema below.
    inputSchema: conditionCheckerInputSchema(), // @575780
    inputJSONSchema: {
      type: "object",
      properties: {
        ok: { type: "boolean", description: "Whether the condition was met" }, // @575784
        reason: { type: "string", description: "Reason, if the condition was not met" }, // @575785
      },
      required: ["ok"],
      additionalProperties: false,
    } satisfies ToolInputJSONSchema,
    // @575790-575792 — overrides the base StructuredOutput prompt for the verification use-case.
    async prompt() {
      return "Use this tool to return your verification result. You MUST call this tool exactly once at the end of your response.";
    },
  };
}

// 2.1.183: conditionCheckerInputSchema = B9t @cli_inner_pretty.js:575813-575821 — Zod `inputSchema`
// member of buildConditionCheckerTool. NOTE: the Zod schema carries an extra `impossible` field that
// the parallel `inputJSONSchema` (575781-575789) does NOT expose — an intentional asymmetry in the bundle.
const conditionCheckerInputSchema = lazySchema(() =>
  z.object({
    ok: z.boolean().describe("Whether the condition was met"),
    reason: z.string().describe("Reason, if the condition was not met").optional(),
    impossible: z
      .boolean()
      .describe("Whether the condition can never be satisfied (only meaningful when ok is false)")
      .optional(),
  }),
);

/**
 * Tool-list exclusion. The standard tool-list filter `zR` (@cli_inner_pretty.js:436622-436652)
 * builds `new Set([_G.name, kG.name, Em])` (@436634) — i.e.
 * `new Set([ListMcpResourcesTool.name, ReadMcpResourceTool.name, StructuredOutput])` — and drops
 * those from `getAllBaseTools()`:  `LW().filter(c => !excluded.has(c.name))`. So StructuredOutput is
 * NEVER a normal model tool — it only ever reaches the model via {@link injectStructuredOutputTool}.
 */

/**
 * injectStructuredOutputTool — the agent-run wiring (reconstructed core).
 * 2.1.183: inline at @cli_inner_pretty.js:694019-694041 (not a named decl).
 *
 * When the launching Agent/Workflow carries a JSON schema (`An`), the runner forces a schema tool
 * and appends it to the per-run tool set, emitting telemetry about the schema shape. In background
 * sessions the injected `call` is wrapped to also stash the structured result so the bg consumer can
 * read it. A malformed schema yields a `tengu_structured_output_failure` event and no tool.
 */
export function injectStructuredOutputTool(
  tools: ReturnType<typeof buildTool>[],
  agentJsonSchema: ToolInputJSONSchema,
  isBackgroundSession: boolean,
  stashBgStructuredResult: (input: Record<string, unknown>) => void,
): { tools: ReturnType<typeof buildTool>[]; injected?: ReturnType<typeof buildTool> } {
  const forced = forceSchemaTool(agentJsonSchema);
  if ("tool" in forced) {
    let tool = forced.tool;
    if (isBackgroundSession) {
      // @694027-694033 — also persist the structured result for the bg run to pick up.
      const innerCall = tool.call.bind(tool);
      tool = {
        ...tool,
        async call(input: Record<string, unknown>, ...rest: unknown[]) {
          const result = await (innerCall as (...a: unknown[]) => Promise<unknown>)(input, ...rest);
          stashBgStructuredResult(input);
          return result;
        },
      };
    }
    // @694036-694039
    G("tengu_structured_output_enabled", {
      schema_property_count: Object.keys((agentJsonSchema as { properties?: object }).properties || {}).length,
      has_required_fields: Boolean((agentJsonSchema as { required?: unknown }).required),
    });
    return { tools: [...tools, tool], injected: tool };
  }
  // @694040 — `"error" in forced`
  G("tengu_structured_output_failure", { error: "Invalid JSON schema" });
  return { tools };
}

// Mapping: Em→STRUCTURED_OUTPUT_TOOL_NAME, lvd→inputSchema, cvd→outputSchema, A5r→SyntheticOutputTool,
//   Ftt→forceSchemaTool, uvd→compileForcedSchemaTool, A1i→forcedSchemaCache, U$l→buildConditionCheckerTool,
//   Bl→TelemetrySafeError, Re→jsonStringify, G→logEvent, zR→tool-list filter (exclusion), An→agentJsonSchema
