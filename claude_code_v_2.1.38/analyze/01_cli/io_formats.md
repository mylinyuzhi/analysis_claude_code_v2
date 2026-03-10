# CLI-I/O Formats Integration

> How CLI flags control input/output formats for SDK mode and structured output

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - LLM API
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI Module

Key functions in this document:
- `handleStdinInput` (oGz) - Read stdin for non-interactive mode
- `structuredOutputTool` - Structured output validation
- `streamingQuery` (UW1) - Streaming LLM response

---

## Overview

The CLI provides comprehensive I/O format control for SDK integration and structured output:

1. **`--output-format <format>`** - Output format: text/json/stream-json
2. **`--input-format <format>`** - Input format: text/stream-json
3. **`--json-schema <schema>`** - Structured output validation
4. **`--include-partial-messages`** - Real-time streaming chunks
5. **`--replay-user-messages`** - Echo stdin to stdout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLI → I/O FORMATS PIPELINE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Input Flow                                                                  │
│  ──────────                                                                  │
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  stdin           │    │  --input-format   │    │  Parsed          │     │
│  │  (text/json)     │───►│  text/stream-json │───►│  messages        │     │
│  └──────────────────┘    └───────────────────┘    └──────────────────┘     │
│                                                                              │
│  Processing                                                                  │
│  ──────────                                                                  │
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  LLM API         │    │  --json-schema    │    │  Validation      │     │
│  │  (streaming)     │───►│  (optional)       │───►│  (if schema)     │     │
│  └──────────────────┘    └───────────────────┘    └──────────────────┘     │
│                                                                              │
│  Output Flow                                                                 │
│  ───────────                                                                 │
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  LLM Response    │    │  --output-format  │    │  stdout          │     │
│  │  (chunks)        │───►│  text/json/stream │───►│  formatted       │     │
│  └──────────────────┘    └───────────────────┘    └──────────────────┘     │
│                                                                              │
│  Optional: --include-partial-messages for real-time chunks                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. CLI Flag Definitions

### 1.1 I/O Format Flags

**Source location:** `chunks.189.mjs:1017-1019`

```javascript
// ============================================
// I/O format CLI flag definitions
// Location: chunks.189.mjs:1017-1019
// ============================================

// ORIGINAL (for source lookup):
.addOption(new J5("--output-format <format>", 'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)').choices(["text", "json", "stream-json"]))
.addOption(new J5("--json-schema <schema>", 'JSON Schema for structured output validation. Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}').argParser(String))
.option("--include-partial-messages", "Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)", () => !0)
.addOption(new J5("--input-format <format>", 'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)').choices(["text", "stream-json"]))
.option("--replay-user-messages", "Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)", () => !0)

// READABLE (for understanding):
.addOption(new Option("--output-format <format>",
    'Output format (print mode): "text", "json", or "stream-json"')
    .choices(["text", "json", "stream-json"]))
.addOption(new Option("--json-schema <schema>",
    'JSON Schema for structured output: {"type":"object","properties":{"name":{"type":"string"}}}')
    .argParser(String))
.option("--include-partial-messages",
    "Include partial chunks in stream-json mode", () => true)
.addOption(new Option("--input-format <format>",
    'Input format (print mode): "text" or "stream-json"')
    .choices(["text", "stream-json"]))
.option("--replay-user-messages",
    "Echo stdin to stdout (stream-json only)", () => true)

// Mapping: J5→Option
```

### 1.2 Flag Extraction

**Source location:** `chunks.189.mjs:1051-1054`

```javascript
// ============================================
// I/O format flag extraction
// Location: chunks.189.mjs:1051-1054
// ============================================

// ORIGINAL (for source lookup):
let {
    outputFormat: m,
    inputFormat: b
} = H
...
let Z1 = T || J6(process.env.CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES);

// READABLE (for understanding):
let {
    outputFormat,
    inputFormat
} = options;

let includePartialMessages = options.includePartialMessages
    || parseBoolean(process.env.CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES);

// Mapping: m→outputFormat, b→inputFormat, T→includePartialMessages, Z1→shouldIncludePartial
```

---

## 2. Output Format Modes

### 2.1 Text Output (Default)

**What it does:** Plain text output of the assistant's response.

```
Input:  claude -p "What is 2+2?"
Output: 4
```

**Use cases:**
- Quick queries
- Piping to other tools
- Human-readable output

### 2.2 JSON Output

**What it does:** Single JSON object with the complete response.

```json
{
  "type": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The answer is 4."
    }
  ],
  "usage": {
    "input_tokens": 15,
    "output_tokens": 10
  }
}
```

**Use cases:**
- Programmatic consumption
- Response logging
- Testing automation

### 2.3 Stream-JSON Output

**What it does:** Newline-delimited JSON objects for real-time streaming.

```
{"type":"message_start","message":{"id":"msg_123","role":"assistant"}}
{"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}
{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"The"}}
{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" answer"}}
{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" is 4."}}
{"type":"content_block_stop","index":0}
{"type":"message_stop"}
```

**Use cases:**
- SDK integration
- Real-time UI updates
- Progressive rendering

---

## 3. Input Format Modes

### 3.1 Text Input (Default)

**What it does:** Plain text prompt from stdin or argument.

```bash
# From argument
claude -p "What is 2+2?"

# From stdin
echo "What is 2+2?" | claude -p
```

### 3.2 Stream-JSON Input

**What it does:** Newline-delimited JSON objects for programmatic input.

```json
{"type":"user_message","content":"What is 2+2?"}
{"type":"user_message","content":"Also calculate 3+3"}
```

**Validation:**

**Source location:** `chunks.189.mjs:1294-1298`

```javascript
// ============================================
// Input format validation
// Location: chunks.189.mjs:1294-1298
// ============================================

// ORIGINAL (for source lookup):
if (b && b !== "text" && b !== "stream-json") console.error(`Error: Invalid input format "${b}".`), process.exit(1);
if (b === "stream-json" && m !== "stream-json") console.error("Error: --input-format=stream-json requires output-format=stream-json."), process.exit(1);

// READABLE (for understanding):
if (inputFormat && inputFormat !== "text" && inputFormat !== "stream-json") {
    console.error(`Error: Invalid input format "${inputFormat}".`);
    process.exit(1);
}

if (inputFormat === "stream-json" && outputFormat !== "stream-json") {
    console.error("Error: --input-format=stream-json requires output-format=stream-json.");
    process.exit(1);
}

// Mapping: b→inputFormat, m→outputFormat
```

---

## 4. JSON Schema Validation

### 4.1 Schema Definition

**What it does:** Validates LLM output against a JSON Schema, enabling structured output.

**Example schema:**

```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "age": {"type": "integer", "minimum": 0},
    "email": {"type": "string", "format": "email"}
  },
  "required": ["name", "age"]
}
```

### 4.2 Schema Integration

**Source location:** `chunks.189.mjs:1311-1323`

```javascript
// ============================================
// JSON Schema integration
// Location: chunks.189.mjs:1311-1323
// ============================================

// ORIGINAL (for source lookup):
let M6;
if (ip7({
        isNonInteractiveSession: z1
    }) && H.jsonSchema) M6 = _A(H.jsonSchema);
if (M6) {
    let TA = k_6(M6);
    if (TA) j6 = [...j6, TA], c("tengu_structured_output_enabled", {
        schema_property_count: Object.keys(M6.properties || {}).length,
        has_required_fields: Boolean(M6.required)
    });
    else c("tengu_structured_output_failure", {
        error: "Invalid JSON schema"
    })
}

// READABLE (for understanding):
let parsedSchema;

if (isNonInteractiveSession && options.jsonSchema) {
    parsedSchema = parseJsonSchema(options.jsonSchema);
}

if (parsedSchema) {
    let structuredOutputTool = createStructuredOutputTool(parsedSchema);

    if (structuredOutputTool) {
        availableTools = [...availableTools, structuredOutputTool];

        trackEvent("tengu_structured_output_enabled", {
            schema_property_count: Object.keys(parsedSchema.properties || {}).length,
            has_required_fields: Boolean(parsedSchema.required)
        });
    } else {
        trackEvent("tengu_structured_output_failure", {
            error: "Invalid JSON schema"
        });
    }
}

// Mapping: M6→parsedSchema, _A→parseJsonSchema, k_6→createStructuredOutputTool,
//          j6→availableTools, z1→isNonInteractiveSession, ip7→checkFeature
```

### 4.3 Structured Output Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                STRUCTURED OUTPUT EXECUTION FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  claude -p --json-schema '{"type":"object","properties":{"name":{...}}}'    │
│  │                                                                          │
│  ├─► Parse JSON Schema                                                      │
│  │                                                                          │
│  ├─► Create StructuredOutput tool                                           │
│  │   - Inject schema into tool definition                                   │
│  │   - Add to available tools list                                          │
│  │                                                                          │
│  ├─► Execute LLM request                                                    │
│  │   - LLM uses StructuredOutput tool                                       │
│  │   - Response conforms to schema                                          │
│  │                                                                          │
│  ├─► Validate response against schema                                       │
│  │   - Type checking                                                        │
│  │   - Required fields                                                      │
│  │   - Format validation                                                    │
│  │                                                                          │
│  └─► Return validated output                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Partial Messages

### 5.1 Include Partial Messages Flag

**What it does:** Emits partial message chunks as they arrive, enabling real-time UI updates.

**Source location:** `chunks.189.mjs:1090`

```javascript
// ============================================
// Include partial messages resolution
// Location: chunks.189.mjs:1090
// ============================================

// ORIGINAL (for source lookup):
let Z1 = T || J6(process.env.CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES);

// READABLE (for understanding):
let includePartialMessages =
    options.includePartialMessages ||
    parseBoolean(process.env.CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES);

// Mapping: T→includePartialMessagesCli, Z1→includePartialMessages, J6→parseBoolean
```

### 5.2 Validation

**Source location:** `chunks.189.mjs:1302-1304`

```javascript
// ============================================
// Partial messages validation
// Location: chunks.189.mjs:1302-1304
// ============================================

// ORIGINAL (for source lookup):
if (Z1) {
    if (!z1 || m !== "stream-json") yl("Error: --include-partial-messages requires --print and --output-format=stream-json."), process.exit(1)
}

// READABLE (for understanding):
if (includePartialMessages) {
    if (!isPrintMode || outputFormat !== "stream-json") {
        console.error("Error: --include-partial-messages requires --print and --output-format=stream-json.");
        process.exit(1);
    }
}

// Mapping: Z1→includePartialMessages, z1→isPrintMode, m→outputFormat, yl→console.error
```

---

## 6. SDK Mode Integration

### 6.1 SDK URL Detection

**Source location:** `chunks.189.mjs:1089-1096`

```javascript
// ============================================
// SDK URL mode detection
// Location: chunks.189.mjs:1089-1096
// ============================================

// ORIGINAL (for source lookup):
let D1 = H.sdkUrl ?? void 0,
    Z1 = T || J6(process.env.CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES);
if (D1) {
    if (!b) b = "stream-json";
    if (!m) m = "stream-json";
    if (H.verbose === void 0) g = !0;
    if (!H.print) U = !0
}

// READABLE (for understanding):
let sdkUrl = options.sdkUrl ?? undefined;

if (sdkUrl) {
    // SDK mode auto-enables stream-json formats
    if (!inputFormat) inputFormat = "stream-json";
    if (!outputFormat) outputFormat = "stream-json";

    // Enable verbose by default in SDK mode
    if (options.verbose === undefined) verbose = true;

    // Auto-enable print mode
    if (!options.print) printMode = true;
}

// Mapping: D1→sdkUrl, b→inputFormat, m→outputFormat, g→verbose, U→printMode
```

### 6.2 SDK Mode Validation

**Source location:** `chunks.189.mjs:1296-1298`

```javascript
// ============================================
// SDK mode validation
// Location: chunks.189.mjs:1296-1298
// ============================================

// ORIGINAL (for source lookup):
if (D1) {
    if (b !== "stream-json" || m !== "stream-json") console.error("Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1)
}

// READABLE (for understanding):
if (sdkUrl) {
    if (inputFormat !== "stream-json" || outputFormat !== "stream-json") {
        console.error("Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json.");
        process.exit(1);
    }
}

// Mapping: D1→sdkUrl, b→inputFormat, m→outputFormat
```

---

## 7. Replay User Messages

### 7.1 Replay Flag Behavior

**What it does:** Echoes user messages from stdin back to stdout, enabling acknowledgment in SDK mode.

**Source location:** `chunks.189.mjs:1019`

```javascript
// ============================================
// --replay-user-messages flag
// Location: chunks.189.mjs:1019
// ============================================

// ORIGINAL (for source lookup):
.option("--replay-user-messages", "Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)", () => !0)

// READABLE (for understanding):
.option("--replay-user-messages",
    "Echo user messages for acknowledgment (stream-json only)",
    () => true)
```

### 7.2 Validation

**Source location:** `chunks.189.mjs:1299-1301`

```javascript
// ============================================
// Replay user messages validation
// Location: chunks.189.mjs:1299-1301
// ============================================

// ORIGINAL (for source lookup):
if (H.replayUserMessages) {
    if (b !== "stream-json" || m !== "stream-json") console.error("Error: --replay-user-messages requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1)
}

// READABLE (for understanding):
if (options.replayUserMessages) {
    if (inputFormat !== "stream-json" || outputFormat !== "stream-json") {
        console.error("Error: --replay-user-messages requires both --input-format=stream-json and --output-format=stream-json.");
        process.exit(1);
    }
}

// Mapping: H→options, b→inputFormat, m→outputFormat
```

---

## 8. Use Cases

### 8.1 Basic Text Query

```bash
# Simple text output
claude -p "Summarize this code"

# Equivalent with explicit format
claude -p --output-format text "Summarize this code"
```

### 8.2 JSON Output

```bash
# Get JSON response
claude -p --output-format json "What is 2+2?"
```

### 8.3 Streaming for SDK

```bash
# Stream-JSON for SDK integration
claude -p --output-format stream-json --input-format stream-json < input.jsonl > output.jsonl
```

### 8.4 Structured Output

```bash
# Enforce JSON schema
claude -p --json-schema '{"type":"object","properties":{"name":{"type":"string"},"count":{"type":"integer"}}}' "Extract names from this text"
```

### 8.5 Partial Messages

```bash
# Real-time chunks with partial messages
claude -p --output-format stream-json --include-partial-messages "Long analysis"
```

### 8.6 SDK Mode

```bash
# Full SDK integration
claude --sdk-url "ws://localhost:3000" --input-format stream-json --output-format stream-json --replay-user-messages
```

---

## 9. Format Compatibility Matrix

| Input Format | Output Format | Compatible | Notes |
|--------------|---------------|------------|-------|
| text | text | Yes | Default mode |
| text | json | Yes | Single JSON output |
| text | stream-json | Yes | Streaming output |
| stream-json | text | No | Requires stream-json output |
| stream-json | json | No | Requires stream-json output |
| stream-json | stream-json | Yes | Full SDK mode |

---

## 10. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Flag definitions | `chunks.189.mjs:1017` | Commander options |
| Input validation | `chunks.189.mjs:1294` | Format compatibility |
| Schema parsing | `chunks.189.mjs:1311` | JSON Schema integration |
| SDK detection | `chunks.189.mjs:1089` | Auto-format enabling |
| Partial messages | `chunks.189.mjs:1302` | Streaming chunks |
| Replay messages | `chunks.189.mjs:1299` | Echo validation |