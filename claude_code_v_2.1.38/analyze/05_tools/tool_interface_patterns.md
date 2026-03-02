# Tool Interface Patterns - Deep Analysis (Claude Code 2.1.38)

> Complete analysis of common tool interface patterns: object structure, validation, permissions, concurrency, and rendering.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `toolDispatcher` (bU1) - Entry point that uses tool interface
- `toolExecutionPipeline` (NdY) - Pipeline that validates and executes tools
- `findTool` (Tv) - Tool lookup by name or alias
- `validateInput` - Pre-execution validation pattern
- `isConcurrencySafe` - Parallel execution safety indicator
- `isReadOnly` - Read-only operation indicator
- `checkPermissions` - Permission integration pattern
- `renderToolUseMessage` / `renderToolResultMessage` - UI rendering

---

## 1. Tool Object Structure

### Core Interface

**What it does:** Every tool implements a standard interface that the tool dispatcher expects.

**How it works:**

```javascript
// ============================================
// Tool Object Structure - Standard interface
// Location: Various tool definition files
// ============================================

// READABLE (for understanding):
interface Tool {
    // Identity
    name: string;                        // Tool name (e.g., "Bash", "Read")
    aliases?: string[];                  // Alternative names (e.g., ["ExecuteCommand"])

    // Metadata
    maxResultSizeChars: number;          // Max output size (typically 100000)
    strict: boolean;                     // Use strict Zod validation (typically true)

    // Schema
    inputSchema: z.ZodSchema;            // Zod schema for input validation
    outputSchema?: z.ZodSchema;          // Optional output schema

    // Dynamic methods
    async description(): string;         // Tool description for LLM
    async prompt(): string;              // Detailed prompt/instructions for LLM
    userFacingName(input?): string;      // Display name in UI
    getToolUseSummary(input?): string;   // Brief summary for activity display

    // Behavioral flags
    isEnabled(): boolean;                // Feature flag check
    isConcurrencySafe(input?): boolean;  // Can run in parallel?
    isReadOnly(): boolean;               // Never modifies state?

    // Core methods
    validateInput?(input, context): Promise<ValidationResult>;
    checkPermissions(input, context): Promise<PermissionResult>;
    call(input, context, canUseTool, message, progress): Promise<ToolResult>;

    // Path extraction
    getPath?(input): string | undefined; // Extract file path for attribution

    // Rendering
    renderToolUseMessage?(input, context): ReactElement | null;
    renderToolUseProgressMessage?(input, context): ReactElement | null;
    renderToolResultMessage?(result, input, context): ReactElement | null;
    renderToolUseRejectedMessage?(input, context): ReactElement | null;
    renderToolUseErrorMessage?(error, context): ReactElement | null;

    // Output mapping
    mapToolResultToToolResultBlockParam?(result, toolUseId): ToolResultBlock;
}
```

**Key insight:** The tool interface is deliberately minimal - many properties are optional. Tools only implement what they need. The execution pipeline checks for optional methods before calling them.

---

## 2. isConcurrencySafe Pattern

### What It Does

Indicates whether a tool can safely run in parallel with other tool executions. This affects how the tool execution queue manages multiple simultaneous tool calls.

**How it works:**

```javascript
// ============================================
// isConcurrencySafe - Parallel execution safety
// Location: Tool definitions across multiple files
// ============================================

// ORIGINAL (for source lookup):
// From chunks.134.mjs - EditTool
isConcurrencySafe() { return !1 }  // false - file writes are NOT safe

// From chunks.76.mjs - GrepTool
isConcurrencySafe() { return !0 }  // true - read-only search is safe

// From chunks.132.mjs - AgentTool
isConcurrencySafe(A) {
    return A.run_in_background ? !0 : !1  // Background agents are safe
}

// READABLE (for understanding):
const EditTool = {
    isConcurrencySafe() { return false; }
    // Reason: File writes must be serialized to prevent race conditions
};

const GrepTool = {
    isConcurrencySafe() { return true; }
    // Reason: Read-only searches can run in parallel without conflicts
};

const AgentTool = {
    isConcurrencySafe(input) {
        // Background agents can run in parallel
        // Foreground agents block until completion
        return input.run_in_background ? true : false;
    }
};

const TaskStopTool = {
    isConcurrencySafe() { return true; }
    // Reason: Task termination doesn't conflict with other operations
};
```

### Concurrency Matrix

| Tool | `isConcurrencySafe` | Reason |
|------|---------------------|--------|
| Read | ✅ true | Read-only, no side effects |
| Write | ❌ false | File system mutation |
| Edit | ❌ false | File system mutation |
| Grep | ✅ true | Read-only search |
| Glob | ✅ true | Read-only search |
| Bash | ❌ false | Arbitrary commands, mutation risk |
| WebFetch | ✅ true | Read-only network request |
| WebSearch | ✅ true | Read-only network request |
| Task (foreground) | ❌ false | Blocks conversation |
| Task (background) | ✅ true | Runs independently |
| TaskStop | ✅ true | Safe to kill in parallel |
| TaskOutput | ✅ true | Read-only status check |
| TaskList | ✅ true | Read-only list |
| TaskCreate | ✅ true | List append is safe |
| TaskUpdate | ✅ true | Update is safe |
| TodoWrite | ✅ true | List replace is safe |
| TeamCreate | ❌ false | Global team state mutation |
| TeamDelete | ❌ false | Global team state mutation |
| SendMessage | ✅ true | Message queue append |
| EnterPlanMode | ✅ true | Mode switch is safe |
| ExitPlanMode | ✅ true | Mode switch is safe |
| AskUserQuestion | ✅ true | UI interaction only |
| Skill | ❌ false | Unknown side effects |
| ToolSearch | ✅ true | Read-only discovery |

**Key insight:** The `isConcurrencySafe` flag is checked by the execution queue. When multiple tools are pending, safe tools can run in parallel while unsafe tools wait.

---

## 3. isReadOnly Pattern

### What It Does

Indicates whether a tool never modifies state (files, processes, external systems). Read-only tools are often auto-allowed by permission rules.

**How it works:**

```javascript
// ============================================
// isReadOnly - State modification indicator
// Location: Tool definitions
// ============================================

// ORIGINAL (for source lookup):
// From chunks.134.mjs - EditTool
isReadOnly() { return !1 }  // false - modifies files

// From chunks.76.mjs - GrepTool
isReadOnly() { return !0 }  // true - only reads

// READABLE (for understanding):
const EditTool = {
    isReadOnly() { return false; }
    // Reason: Modifies file system - requires permission check
};

const GrepTool = {
    isReadOnly() { return true; }
    // Reason: Only searches files - can be auto-allowed
};

const BashTool = {
    isReadOnly() { return false; }
    // Reason: Can run arbitrary commands including mutations
    // Note: Has special "readonly command" detection for auto-allow
};
```

### Permission Integration

```javascript
// ============================================
// isReadOnly Permission Integration
// Location: chunks.174.mjs (permission rules)
// ============================================

// READABLE (for understanding):
// Permission rules check isReadOnly() to determine auto-allow behavior

function shouldAutoAllowTool(tool, input, permissionContext) {
    // Rule 1: Read-only tools in certain modes are auto-allowed
    if (tool.isReadOnly() && permissionContext.mode === "plan") {
        return true;  // Plan mode allows read-only tools
    }

    // Rule 2: Specific tool whitelists
    if (READ_ONLY_TOOLS.has(tool.name)) {
        return true;
    }

    // Rule 3: Bash tool has special readonly command detection
    if (tool.name === "Bash" && isReadonlyCommand(input.command)) {
        return true;
    }

    return false;  // Requires user approval
}
```

**Key insight:** `isReadOnly()` affects the default permission behavior but doesn't guarantee auto-allow. The permission system considers multiple factors including mode, user settings, and bash command analysis.

---

## 4. validateInput Pattern

### What It Does

Performs pre-execution validation beyond Zod schema validation. Called after schema parsing succeeds but before permission checks.

**How it works:**

```javascript
// ============================================
// validateInput - Pre-execution validation pipeline
// Location: chunks.134.mjs (EditTool), chunks.149.mjs (pipeline)
// ============================================

// ORIGINAL (for source lookup):
// From chunks.134.mjs - EditTool validateInput
async validateInput({ file_path: A, old_string: q, new_string: K, replace_all: Y = !1 }, z) {
    if (q === K) return { result: !1, behavior: "ask", message: "No changes to make...", errorCode: 1 };
    let w = g4(A), H = await z.getAppState();
    if (Gj(w, H.toolPermissionContext, "edit", "deny") !== null) return { result: !1, behavior: "ask", message: "File is in a directory...", errorCode: 2 };
    // ... 7 more checks
    return { result: !0, meta: { actualOldString: X } }
}

// READABLE (for understanding):
async function validateInput(input, sessionContext) {
    // Validation return types:
    // 1. Success with optional metadata
    return { result: true, meta: { actualOldString: foundString } };

    // 2. Failure with error code and message
    return {
        result: false,
        behavior: "ask",      // "ask" prompts user, "deny" blocks immediately
        message: "File has not been read yet. Read it first.",
        errorCode: 6,
        meta: { isFilePathAbsolute: "true" }  // Optional additional info
    };
}

// In toolExecutionPipeline (chunks.149.mjs:531-567)
let validationResult = await tool.validateInput?.(parsedInput, toolUseContext);
if (validationResult?.result === false) {
    // Return error immediately - don't execute tool
    return [createErrorMessage(validationResult.message)];
}
```

### Validation Error Codes

| Code | Tool | Meaning |
|------|------|---------|
| 1 | Edit | old_string === new_string (no-op) |
| 2 | Edit | Path denied by permission rules |
| 4 | Edit | File doesn't exist |
| 5 | Edit | File is .ipynb - use NotebookEdit |
| 6 | Edit | File not read yet (readFileState) |
| 7 | Edit | File modified since read |
| 8 | Edit | old_string not found in file |
| 9 | Edit | Multiple matches, need replace_all |

**Key insight:** `validateInput` is called **after** Zod schema validation but **before** permission checks. It can check runtime conditions (file existence, permission rules) that schemas cannot express.

---

## 5. checkPermissions Pattern

### What It Does

Integrates with the permission system to determine access rights. Can pre-approve tools or force user prompts.

**How it works:**

```javascript
// ============================================
// checkPermissions - Permission integration
// Location: Tool definitions
// ============================================

// ORIGINAL (for source lookup):
// From chunks.134.mjs - EditTool
async checkPermissions(A, q) {
    let K = await q.getAppState();
    return N51(sW, A, K.toolPermissionContext)
}

// From chunks.140.mjs - EnterPlanModeTool
async checkPermissions(A) {
    return { behavior: "allow", updatedInput: A }  // Always allow
}

// From chunks.139.mjs - AskUserQuestionTool
async checkPermissions(A) {
    return { behavior: "ask", message: "Answer questions?", updatedInput: A }
}

// READABLE (for understanding):
const EditTool = {
    async checkPermissions(input, toolUseContext) {
        let appState = await toolUseContext.getAppState();
        return checkEditPermissions(EditTool, input, appState.toolPermissionContext);
        // Returns: { behavior: "allow" | "deny" | "ask", updatedInput?, message? }
    }
};

const EnterPlanModeTool = {
    async checkPermissions(input) {
        // Always allowed - plan mode is a safe operation
        return { behavior: "allow", updatedInput: input };
    }
};

const AskUserQuestionTool = {
    async checkPermissions(input) {
        // Always prompt - the tool's purpose is user interaction
        return {
            behavior: "ask",
            message: "Answer questions?",
            updatedInput: input
        };
    }
};
```

### Permission Result Types

```javascript
// ============================================
// Permission Result Structure
// ============================================

interface PermissionResult {
    behavior: "allow" | "deny" | "ask";

    // For "allow": optional updated input
    updatedInput?: object;

    // For "deny" or "ask": message to display
    message?: string;

    // For telemetry/tracking
    decisionReason?: {
        type: "rule" | "hook" | "user" | "auto";
        source?: string;
    };
}
```

**Key insight:** `checkPermissions` provides a **recommendation** to the permission system. The actual decision considers:
1. Hook pre-approval (hooks can override)
2. Permission rules (path-based, tool-based)
3. User interaction (prompt for approval)
4. Mode-specific behavior (plan mode, delegate mode)

---

## 6. Rendering Methods

### What They Do

Provide custom UI rendering for different tool states: invocation, progress, result, rejection, error.

**How it works:**

```javascript
// ============================================
// Rendering Methods - UI customization
// Location: chunks.134.mjs (EditTool rendering)
// ============================================

// ORIGINAL (for source lookup):
// From chunks.134.mjs - EditTool renderers
renderToolUseMessage: IF4,           // Show file path header
renderToolUseProgressMessage: xF4,   // Returns null (sync operation)
renderToolResultMessage: bF4,        // Show diff viewer
renderToolUseRejectedMessage: uF4,   // Show preview diff before rejection
renderToolUseErrorMessage: BF4       // Show error message

// READABLE (for understanding):
const EditTool = {
    // Header: Shows file path as breadcrumb
    renderToolUseMessage(input, { verbose }) {
        if (!input.file_path) return null;
        if (input.file_path.startsWith(getPlanFilePrefix())) return "";
        return React.createElement(FilePathBreadcrumb, {
            filePath: input.file_path
        }, verbose ? input.file_path : getFilename(input.file_path));
    },

    // Progress: No progress indicator (sync operation)
    renderToolUseProgressMessage() {
        return null;  // File edits complete instantly
    },

    // Result: Show unified diff viewer
    renderToolResultMessage(result, input, { style, verbose }) {
        return React.createElement(DiffViewer, {
            filePath: result.filePath,
            structuredPatch: result.structuredPatch,
            firstLine: result.originalFile.split("\n")[0],
            fileContent: result.originalFile,
            style,
            verbose
        });
    },

    // Rejection: Preview what the edit would have done
    renderToolUseRejectedMessage(input, context) {
        // Read current file and compute diff to show what was proposed
        // ... (see edit_tool.md for full implementation)
    },

    // Error: Context-aware error display
    renderToolUseErrorMessage(errorResult, context) {
        if (errorResult.includes("File has not been read yet")) {
            return React.createElement(Text, { dimColor: true }, "File must be read first");
        }
        return React.createElement(Text, { color: "error" }, "Error editing file");
    }
};
```

### Rendering State Machine

```
Tool Invocation
      │
      ├─▶ renderToolUseMessage()     ─── Header shown in tool use block
      │
      ├─▶ renderToolUseProgressMessage() ─── Progress indicator (if not null)
      │
      ▼
  Execution
      │
      ├──▶ Success ─▶ renderToolResultMessage() ─── Result display
      │
      ├──▶ Rejected ─▶ renderToolUseRejectedMessage() ─── Preview before user rejected
      │
      └──▶ Error ─▶ renderToolUseErrorMessage() ─── Error display
```

**Key insight:** Each rendering method receives different data:
- `renderToolUseMessage`: Input only
- `renderToolResultMessage`: Result + input
- `renderToolUseRejectedMessage`: Input (reads file at render time)
- `renderToolUseErrorMessage`: Error string

---

## 7. Complete Tool Example

### Bash Tool - Full Interface Implementation

```javascript
// ============================================
// BashTool - Complete interface example
// Location: chunks.150.mjs
// ============================================

const BashTool = {
    // Identity
    name: "Bash",
    aliases: ["ExecuteCommand", "Shell"],

    // Metadata
    maxResultSizeChars: 100000,
    strict: true,

    // Schema
    inputSchema: z.strictObject({
        command: z.string().describe("The shell command to execute"),
        description: z.string().optional().describe("Human-readable description"),
        timeout: z.number().optional().describe("Timeout in ms (default 120000)"),
        dangerouslyDisableSandbox: z.boolean().optional()
    }),

    // Behavior
    isConcurrencySafe() { return false; },  // Commands may conflict
    isReadOnly() { return false; },         // Commands can mutate state

    // Validation
    async validateInput(input, context) {
        // Bash has special pre-flight checks
        let appState = await context.getAppState();
        let validation = bashSecurityValidation(input.command, appState.toolPermissionContext);
        if (validation.blocked) {
            return {
                result: false,
                message: validation.message,
                meta: { securityError: validation.errorType }
            };
        }
        return { result: true };
    },

    // Permissions
    async checkPermissions(input, context) {
        // Check if command is in readonly whitelist
        if (isCommandInReadonlyWhitelist(input.command)) {
            return { behavior: "allow", updatedInput: input };
        }
        // Otherwise require user approval
        return { behavior: "ask", message: `Run command: ${input.command}?` };
    },

    // Execution
    async call(input, context, canUseTool, message, progressCallback) {
        let startTime = Date.now();

        // Spawn process
        let process = spawnShell(input.command, {
            timeout: input.timeout ?? 120000,
            sandbox: !input.dangerouslyDisableSandbox
        });

        // Stream output with progress updates
        for await (let chunk of process.stdout) {
            progressCallback({
                toolUseID: message.toolUseId,
                data: { type: "stdout", content: chunk }
            });
        }

        let result = await process.exit;

        return {
            data: {
                output: process.output,
                exitCode: result.exitCode,
                duration: Date.now() - startTime
            }
        };
    },

    // Rendering
    renderToolUseMessage(input, { verbose }) {
        return React.createElement(Box, null,
            React.createElement(Text, { bold: true }, "Bash: "),
            React.createElement(Text, null, input.description || truncate(input.command, 50))
        );
    },

    renderToolResultMessage(result, input, { style }) {
        return React.createElement(BashOutputComponent, {
            output: result.output,
            exitCode: result.exitCode,
            command: input.command,
            style
        });
    }
};
```

---

## 8. Tool Category Patterns

### Read-Only Tools Pattern

```javascript
// Read-only tools share these characteristics:
const ReadOnlyToolPattern = {
    isConcurrencySafe() { return true; },
    isReadOnly() { return true; },
    async checkPermissions(input, context) {
        // Often auto-allowed in certain modes
        return { behavior: "allow", updatedInput: input };
    },
    renderToolUseProgressMessage() { return null; }  // Instant execution
};

// Examples: Read, Grep, Glob, WebFetch, WebSearch, TaskList
```

### Mutation Tools Pattern

```javascript
// Mutation tools share these characteristics:
const MutationToolPattern = {
    isConcurrencySafe() { return false; },
    isReadOnly() { return false; },
    async validateInput(input, context) {
        // Often check file state, permissions, conflicts
        // Returns error codes for specific failures
    },
    async checkPermissions(input, context) {
        // Usually requires user approval
        return { behavior: "ask", message: "Confirm operation?" };
    }
};

// Examples: Write, Edit, Bash, TeamCreate, TeamDelete
```

### Interaction Tools Pattern

```javascript
// Interaction tools force user engagement:
const InteractionToolPattern = {
    isConcurrencySafe() { return true; },
    isReadOnly() { return true; },
    requiresUserInteraction() { return true; },
    async checkPermissions(input, context) {
        // Always prompt - the tool's purpose is user interaction
        return { behavior: "ask", message: "Interact with user?" };
    }
};

// Examples: AskUserQuestion, ExitPlanMode
```

---

## 9. Execution Pipeline Integration

### How Tool Interface Fits Into the Pipeline

```javascript
// ============================================
// toolExecutionPipeline - Interface usage
// Location: chunks.149.mjs:490-870
// ============================================

async function toolExecutionPipeline(tool, toolUseId, input, toolUseContext, canUseTool, message, ...) {
    // STEP 1: Schema validation (not part of tool interface)
    let parseResult = tool.inputSchema.safeParse(input);
    if (!parseResult.success) {
        return [createSchemaError(parseResult.error)];
    }

    // STEP 2: Custom validation (validateInput)
    let validationResult = await tool.validateInput?.(parseResult.data, toolUseContext);
    if (validationResult?.result === false) {
        return [createValidationError(validationResult)];
    }

    // STEP 3: Pre-tool hooks (can override permissions)

    // STEP 4: Permission check (checkPermissions)
    let permissionResult;
    if (hookApproved && !tool.requiresUserInteraction?.()) {
        permissionResult = { behavior: "allow" };
    } else {
        permissionResult = await tool.checkPermissions?.(input, toolUseContext);
    }

    if (permissionResult.behavior !== "allow") {
        return [createPermissionDenied(permissionResult)];
    }

    // STEP 5: Tool execution (call)
    let result = await tool.call(
        permissionResult.updatedInput ?? input,
        { ...toolUseContext, userModified: permissionResult.userModified ?? false },
        canUseTool,
        message,
        (progress) => progressQueue.enqueue(progress)
    );

    // STEP 6: Post-tool hooks (can modify MCP output)

    // STEP 7: Result formatting
    return [createToolResult(result, toolUseId)];
}
```

---

## 10. Key Interface Summary

| Method | When Called | Return Type | Purpose |
|--------|-------------|-------------|---------|
| `name` | Always | string | Tool identity |
| `inputSchema` | Parse time | ZodSchema | Input validation |
| `isEnabled()` | Tool registration | boolean | Feature flag check |
| `isConcurrencySafe()` | Queue scheduling | boolean | Parallel execution |
| `isReadOnly()` | Permission check | boolean | Auto-allow consideration |
| `validateInput()` | After schema parse | ValidationResult | Runtime checks |
| `checkPermissions()` | After validation | PermissionResult | Access control |
| `call()` | After permission grant | ToolResult | Execute operation |
| `renderToolUseMessage()` | UI render | ReactElement | Header display |
| `renderToolResultMessage()` | UI render | ReactElement | Result display |