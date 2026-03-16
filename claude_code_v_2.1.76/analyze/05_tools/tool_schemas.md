# Tool Schemas - Validation Patterns (Claude Code 2.1.76)

> Analysis of Zod schema patterns, validation flow, and error handling for tool inputs/outputs.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `inputSchema` - Zod schema for tool input validation
- `outputSchema` - Optional Zod schema for tool output validation
- `validateInput` - Custom runtime validation method
- `formatValidationError` (V4q) - Converts Zod errors to user-friendly messages
- `safeParse` - Schema validation method used in pipeline

---

## Schema Architecture Overview

```
Tool Definition
    │
    ├── inputSchema: ZodSchema     ← Required: validates LLM-provided input
    │       │
    │       └── safeParse() → { success, data, error }
    │
    ├── outputSchema?: ZodSchema   ← Optional: validates tool output
    │       │
    │       └── Used for documentation, not runtime validation
    │
    └── validateInput?: Function   ← Custom runtime checks
            │
            └── Called after schema validation succeeds
```

---

## Input Schema Patterns

### Pattern 1: strictObject for Tool Input

**What it does:** Zod's `strictObject` rejects unknown properties, preventing LLM hallucinations from adding unexpected fields.

**How it works:**

```javascript
// ============================================
// strictObject Pattern - Reject unknown properties
// Location: Various tool definition files
// ============================================

// ORIGINAL (for source lookup):
// From chunks.134.mjs - EditTool
inputSchema: z.strictObject({
    file_path: z.string().describe("The absolute path to the file"),
    old_string: z.string().describe("The text to replace"),
    new_string: z.string().describe("The replacement text"),
    replace_all: z.boolean().optional().describe("Replace all occurrences")
})

// From chunks.150.mjs - BashTool
inputSchema: z.strictObject({
    command: z.string().describe("The shell command to execute"),
    description: z.string().optional().describe("Clear description of what this command does"),
    timeout: z.number().optional().describe("Timeout in milliseconds"),
    dangerouslyDisableSandbox: z.boolean().optional()
})

// READABLE (for understanding):
const editInputSchema = z.strictObject({
    file_path: z.string().describe("The absolute path to the file"),
    old_string: z.string().describe("The text to replace"),
    new_string: z.string().describe("The replacement text"),
    replace_all: z.boolean().optional().describe("Replace all occurrences")
});

// strictObject vs object:
// - z.object({ a: z.string() }).parse({ a: "x", extra: "y" }) → SUCCESS (extra ignored)
// - z.strictObject({ a: z.string() }).parse({ a: "x", extra: "y" }) → ERROR (extra rejected)

// Mapping: z.strictObject→strictSchema, .describe()→fieldDescription
```

**Why strictObject:**
1. **LLM hallucination protection** - LLMs sometimes invent properties; strictObject catches these
2. **Early error detection** - Unknown fields indicate schema mismatch, likely LLM confusion
3. **Clear contracts** - Forces explicit schema updates when adding new fields

**Key insight:** Without `strictObject`, an LLM might add an imaginary `force: true` property that gets silently ignored, leading to unexpected behavior. With `strictObject`, this becomes a clear validation error.

---

### Pattern 2: Optional Fields with Defaults

**What it does:** Handle optional parameters with sensible defaults.

```javascript
// ============================================
// Optional Fields with Defaults
// ============================================

// READABLE (for understanding):
const grepInputSchema = z.strictObject({
    pattern: z.string().describe("The regular expression pattern to search for"),
    path: z.string().optional().describe("The directory to search in (defaults to current)"),
    glob: z.string().optional().describe("Glob pattern to filter files"),
    output_mode: z.enum(["content", "files_with_matches", "count"])
        .optional()
        .default("content")
        .describe("Output format"),
    "-i": z.boolean().optional().describe("Case insensitive search"),
    "-n": z.boolean().optional().default(true).describe("Show line numbers"),
    "-C": z.number().optional().describe("Context lines around match"),
    "-B": z.number().optional().describe("Lines before match"),
    "-A": z.number().optional().describe("Lines after match")
});

// After parsing, optional fields are either:
// - undefined (not provided)
// - the default value (if .default() was used)
// - the provided value
```

---

### Pattern 3: Describe for LLM Guidance

**What it does:** `.describe()` adds documentation that becomes part of the tool definition sent to the LLM.

```javascript
// ============================================
// Describe Pattern - LLM-facing documentation
// ============================================

// ORIGINAL (for source lookup):
// From chunks.146.mjs - ReadTool
file_path: z.string().describe(`
The absolute path to the file to read.
You can provide either a regular file path or a path to a directory.

If you provide a directory path, the tool will list the contents of that directory.
This tool can read images (PNG, JPG, etc.), PDF files, and Jupyter notebooks (.ipynb).
For large PDF files (more than 10 pages), you MUST provide the pages parameter.
`)

// READABLE (for understanding):
const readInputSchema = z.strictObject({
    file_path: z.string().describe(`
The absolute path to the file to read.
You can provide either a regular file path or a path to a directory.

If you provide a directory path, the tool will list the contents of that directory.
This tool can read images (PNG, JPG, etc.), PDF files, and Jupyter notebooks (.ipynb).
For large PDF files (more than 10 pages), you MUST provide the pages parameter.
    `),
    offset: z.number().optional().describe("Line number to start reading from"),
    limit: z.number().optional().describe("Number of lines to read"),
    pages: z.string().optional().describe("PDF page range (e.g., '1-5', '1,3,5')")
});
```

**Why describe matters:**
- Descriptions appear in the `tools` array sent to Claude
- Clear descriptions reduce validation errors by guiding the LLM
- Multi-line descriptions allow detailed usage instructions

---

## Validation Flow

### Pipeline: Schema → Custom Validation → Permission

```javascript
// ============================================
// Validation Pipeline - Two-stage validation
// Location: chunks.149.mjs:490-567
// ============================================

// ORIGINAL (for source lookup):
let X = A.inputSchema.safeParse(K);
if (!X.success) {
    let y = V4q(A.name, X.error);
    return [{ message: c6({ content: [{ type: "tool_result", content: `<tool_use_error>InputValidationError: ${y}</tool_use_error>`, is_error: !0, tool_use_id: q }] }) }]
}
let D = await A.validateInput?.(X.data, Y);
if (D?.result === !1) return [{ message: c6({ content: [{ type: "tool_result", content: `<tool_use_error>${D.message}</tool_use_error>`, is_error: !0, tool_use_id: q }] }) }];

// READABLE (for understanding):
// Stage 1: Zod Schema Validation
let parseResult = tool.inputSchema.safeParse(input);
if (!parseResult.success) {
    let errorMessage = formatValidationError(tool.name, parseResult.error);
    return [createErrorMessage(`InputValidationError: ${errorMessage}`)];
}

// Stage 2: Custom Runtime Validation
let customValidation = await tool.validateInput?.(parseResult.data, toolUseContext);
if (customValidation?.result === false) {
    return [createErrorMessage(customValidation.message)];
}

// Stage 3: Permission Check (after validation passes)
// ...

// Mapping: A→tool, K→input, X→parseResult, D→customValidation,
//          V4q→formatValidationError, c6→createUserMessage
```

---

### formatValidationError - Human-readable Zod errors

**What it does:** Converts Zod's structured error tree into a concise message the LLM can understand and correct.

**How it works:**

```javascript
// ============================================
// formatValidationError - Zod error formatting
// Location: chunks.145.mjs:3054-3089
// ============================================

// ORIGINAL (for source lookup):
function V4q(A, q) {
    let K = q.issues.filter((O) => O.code === "invalid_type" && O.message.includes("received undefined")).map((O) => N4q(O.path)),
        Y = q.issues.filter((O) => O.code === "unrecognized_keys").flatMap((O) => O.keys),
        z = q.issues.filter((O) => O.code === "invalid_type" && !O.message.includes("received undefined")).map((O) => {
            let $ = O,
                H = O.message.match(/received (\w+)/),
                j = H ? H[1] : "unknown";
            return {
                param: N4q(O.path),
                expected: $.expected,
                received: j
            }
        }),
        _ = q.message,
        w = [];
    if (K.length > 0) {
        let O = K.map(($) => `The required parameter \`${$}\` is missing`);
        w.push(...O)
    }
    if (Y.length > 0) {
        let O = Y.map(($) => `An unexpected parameter \`${$}\` was provided`);
        w.push(...O)
    }
    if (z.length > 0) {
        let O = z.map(({
            param: $,
            expected: H,
            received: j
        }) => `The parameter \`${$}\` type is expected as \`${H}\` but provided as \`${j}\``);
        w.push(...O)
    }
    if (w.length > 0) _ = `${A} failed due to the following ${w.length>1?"issues":"issue"}:
${w.join(`
`)}`;
    return _
}

// READABLE (for understanding):
function formatValidationError(toolName, zodError) {
    // Categorize issues by type
    let missingParams = zodError.issues
        .filter((issue) => issue.code === "invalid_type" && issue.message.includes("received undefined"))
        .map((issue) => formatPath(issue.path));

    let unexpectedParams = zodError.issues
        .filter((issue) => issue.code === "unrecognized_keys")
        .flatMap((issue) => issue.keys);

    let typeMismatches = zodError.issues
        .filter((issue) => issue.code === "invalid_type" && !issue.message.includes("received undefined"))
        .map((issue) => {
            let match = issue.message.match(/received (\w+)/);
            let received = match ? match[1] : "unknown";
            return {
                param: formatPath(issue.path),
                expected: issue.expected,
                received: received
            };
        });

    let message = zodError.message;
    let errorLines = [];

    // Format missing parameters
    if (missingParams.length > 0) {
        let lines = missingParams.map((p) => `The required parameter \`${p}\` is missing`);
        errorLines.push(...lines);
    }

    // Format unexpected parameters
    if (unexpectedParams.length > 0) {
        let lines = unexpectedParams.map((p) => `An unexpected parameter \`${p}\` was provided`);
        errorLines.push(...lines);
    }

    // Format type mismatches
    if (typeMismatches.length > 0) {
        let lines = typeMismatches.map(({ param, expected, received }) =>
            `The parameter \`${param}\` type is expected as \`${expected}\` but provided as \`${received}\``
        );
        errorLines.push(...lines);
    }

    // Build final message
    if (errorLines.length > 0) {
        message = `${toolName} failed due to the following ${errorLines.length > 1 ? "issues" : "issue"}:\n${errorLines.join("\n")}`;
    }

    return message;
}

// Mapping: V4q→formatValidationError, A→toolName, q→zodError, K→missingParams,
//          Y→unexpectedParams, z→typeMismatches, _→message, w→errorLines, N4q→formatPath
```

**Error Categories:**

| Category | Zod Code | Formatted Message |
|----------|----------|-------------------|
| Missing required | `invalid_type` + "received undefined" | `The required parameter \`param\` is missing` |
| Extra field | `unrecognized_keys` | `An unexpected parameter \`extra\` was provided` |
| Wrong type | `invalid_type` | `The parameter \`param\` type is expected as \`string\` but provided as \`number\`` |

**Key insight:** The error message is shown to the LLM as a tool result. The function groups issues by type and formats them in a way that helps the LLM understand exactly what to fix in its next turn.

---

## Custom Validation Patterns

### Pattern 1: Runtime Condition Checks

**What it does:** Checks that cannot be expressed in static Zod schemas.

```javascript
// ============================================
// validateInput - EditTool runtime checks
// Location: chunks.134.mjs:2100-2200
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ file_path: A, old_string: q, new_string: K, replace_all: Y = !1 }, z) {
    // Check 1: No-op edit
    if (q === K) return { result: !1, behavior: "ask", message: "No changes to make...", errorCode: 1 };

    // Check 2: Path permission
    let w = g4(A), H = await z.getAppState();
    if (Gj(w, H.toolPermissionContext, "edit", "deny") !== null)
        return { result: !1, behavior: "ask", message: "File is in a denied directory...", errorCode: 2 };

    // Check 3: File exists
    if (!await fileExists(w))
        return { result: !1, behavior: "ask", message: "File does not exist...", errorCode: 4 };

    // Check 4: Notebook check
    if (A.endsWith(".ipynb"))
        return { result: !1, behavior: "ask", message: "Use NotebookEdit for .ipynb files...", errorCode: 5 };

    // Check 5: File has been read
    if (!readFileState.has(w))
        return { result: !1, behavior: "ask", message: "File has not been read yet...", errorCode: 6 };

    // Check 6: Concurrent modification
    let $ = await readFile(w);
    if (readFileState.get(w) !== hash($))
        return { result: !1, behavior: "ask", message: "File modified since read...", errorCode: 7 };

    // Check 7: String exists in file
    if (!$.includes(q))
        return { result: !1, behavior: "ask", message: "old_string not found...", errorCode: 8 };

    // Check 8: Multiple matches
    let O = countOccurrences($, q);
    if (O > 1 && !Y)
        return { result: !1, behavior: "ask", message: "Multiple matches found. Use replace_all=true...", errorCode: 9 };

    return { result: !0, meta: { actualOldString: q } }
}

// READABLE (for understanding):
async function validateEditInput(input, context) {
    let resolvedPath = resolvePath(input.file_path);
    let appState = await context.getAppState();

    // Validation checks that require runtime state:
    // 1. No-op detection (old === new)
    // 2. Permission rules (path-based deny)
    // 3. File existence (filesystem check)
    // 4. File type validation (.ipynb → use NotebookEdit)
    // 5. Read-before-edit enforcement (readFileState)
    // 6. Concurrent modification detection (hash comparison)
    // 7. String existence in file (content search)
    // 8. Multiple match handling (requires replace_all)

    return { result: true, meta: { actualOldString: input.old_string } };
}
```

---

### Pattern 2: ValidationResult Return Types

```javascript
// ============================================
// ValidationResult - Return type for validateInput
// ============================================

interface ValidationResult {
    // Success case
    result: true;
    meta?: {
        actualOldString?: string;  // Normalized string found in file
        isFilePathAbsolute?: string;
        [key: string]: any;
    };

    // Failure case
    result: false;
    behavior?: "ask" | "deny";  // "ask" shows dialog, "deny" blocks immediately
    message: string;            // Error message to display
    errorCode?: number;         // Machine-readable error code
    meta?: object;              // Additional context
}
```

---

## Output Schema Patterns

### Pattern: Documentation-Only Output Schemas

**What it does:** Output schemas are used for documentation and type hints, not runtime validation.

```javascript
// ============================================
// Output Schema Pattern
// Location: Various tool definition files
// ============================================

// ORIGINAL (for source lookup):
// From chunks.134.mjs - EditTool
outputSchema: z.object({
    type: z.literal("update"),
    filePath: z.string(),
    structuredPatch: z.array(z.object({
        oldStart: z.number(),
        oldLines: z.number(),
        newStart: z.number(),
        newLines: z.number(),
        lines: z.array(z.string())
    })),
    originalFile: z.string()
})

// READABLE (for understanding):
const editOutputSchema = z.object({
    type: z.literal("update"),
    filePath: z.string(),
    structuredPatch: z.array(z.object({
        oldStart: z.number(),
        oldLines: z.number(),
        newStart: z.number(),
        newLines: z.number(),
        lines: z.array(z.string())
    })),
    originalFile: z.string()
});

// Note: This schema is NOT used to validate output at runtime
// It exists for:
// 1. Documentation generation
// 2. Type inference for TypeScript users
// 3. Future use in output validation
```

**Why no runtime validation:**
- Tool outputs are trusted (internal code)
- Validation would add overhead
- LLM sees output as-is; no need to enforce shape

---

## Error Code Taxonomy

### Validation Error Codes

| Code | Tool | Meaning | Recovery |
|------|------|---------|----------|
| 1 | Edit | `old_string === new_string` | LLM should provide different strings |
| 2 | Edit | Path denied by permission rules | Check allowed directories |
| 4 | Edit | File doesn't exist | Check file path, or create file first |
| 5 | Edit | File is `.ipynb` | Use NotebookEdit instead |
| 6 | Edit | File not read yet | Call Read tool first |
| 7 | Edit | File modified since read | Re-read file to get latest content |
| 8 | Edit | `old_string` not found | Check exact string match (whitespace, etc.) |
| 9 | Edit | Multiple matches | Add `replace_all: true` or use more specific string |

### Bash Validation Error Types

| Type | Meaning | Blocked |
|------|---------|---------|
| `shell_metacharacters` | Dangerous shell chars in wrong context | Yes |
| `command_substitution` | `$(...)` or backticks in arguments | Yes |
| `newline_injection` | Newlines in unexpected places | Yes |
| `ifs_injection` | IFS variable manipulation | Yes |
| `proc_environ` | `/proc/environ` access attempt | Yes |
| `malformed_token` | Malformed shell token | Yes |
| `obfuscated_flags` | Hidden flags like `--no-verify` | Warning |
| `dangerous_variables` | `$Variable` expansion risks | Warning |

---

## Schema-to-LLM Tool Definition

### Conversion Process

```javascript
// ============================================
// Schema to LLM Tool Definition
// ============================================

// Zod schema:
const editInputSchema = z.strictObject({
    file_path: z.string().describe("The absolute path..."),
    old_string: z.string().describe("Text to replace"),
    new_string: z.string().describe("Replacement text"),
    replace_all: z.boolean().optional().describe("Replace all")
});

// Converted to LLM tool definition:
{
    name: "Edit",
    description: "Performs exact string replacement in files...",
    input_schema: {
        type: "object",
        properties: {
            file_path: {
                type: "string",
                description: "The absolute path..."
            },
            old_string: {
                type: "string",
                description: "Text to replace"
            },
            new_string: {
                type: "string",
                description: "Replacement text"
            },
            replace_all: {
                type: "boolean",
                description: "Replace all"
            }
        },
        required: ["file_path", "old_string", "new_string"]
    }
}
```

---

## Related Documents

- [tool_execution_pipeline.md](./tool_execution_pipeline.md) - Complete execution flow
- [tool_interface_patterns.md](./tool_interface_patterns.md) - Tool interface patterns
- [bash_tool.md](./bash_tool.md) - Bash security validation details
- [edit_tool.md](./edit_tool.md) - Edit validation details