# Tool UI Rendering Infrastructure (Claude Code 2.1.38)

> Complete analysis of how tool invocations are rendered in the terminal UI — from tool use headers to result diffs to summary statistics.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `renderToolUseResult` (SfY) - Renders individual tool invocation - chunks.130.mjs:3
- `renderToolUseSummary` (tx4) - Summary stats across tools - chunks.130.mjs:91
- `StatusIndicator` (rK1) - Animated spinner / status dot - chunks.130.mjs
- `FilePathBreadcrumb` (AE) - File path display - chunks.134.mjs
- `DiffViewer` (SP6) - Unified diff renderer - chunks.134.mjs
- `EditPreview` (ZW1) - Pre-rejection edit preview - chunks.134.mjs
- `ToolResultDisplay` (z5) - Generic tool result display - chunks.130.mjs
- `BashOutputComponent` (BYq) - Bash command output - chunks.162.mjs:417249

---

## Architecture Overview

```
Messages in conversation
  │
  ▼
GroupedToolUse block
  ├── In verbose mode: renderToolUseResult (SfY) for each tool
  │     ├── StatusIndicator (rK1) — spinner/dot
  │     ├── Tool user-facing name
  │     ├── renderToolUseMessage — compact header
  │     └── renderToolResultMessage — expanded result
  │
  └── In normal mode: renderToolUseSummary (tx4)
        ├── StatusIndicator (rK1)
        └── Summary text: "Reading 3 files, Searching 2 patterns…"
```

---

## 1. Tool Object Interface for UI

Every tool definition exposes the following rendering functions:

```typescript
interface Tool {
    // === Required rendering methods ===
    renderToolUseMessage(input: ParsedInput, opts: RenderOpts): ReactElement | string | null
    // Shows compact info while tool is running: "Edit (src/app.ts)"
    // Return null to show nothing

    renderToolResultMessage(output: ParsedOutput, prevMessages: Message[], opts: RenderOpts): ReactElement
    // Shows result after tool completes: diff view, file content, search results

    renderToolUseProgressMessage(messages: Message[]): ReactElement | null
    // Shows in-progress UI (for streaming tools like Bash)
    // Return null for synchronous tools

    renderToolUseRejectedMessage(input: ParsedInput, opts: RenderOpts): ReactElement
    // Shows what would have happened when user rejects

    renderToolUseErrorMessage(error: ToolResultBlock, opts: RenderOpts): ReactElement
    // Shows error details when tool fails

    // === Optional rendering methods ===
    renderToolUseTag?(input: ParsedInput): ReactElement | null
    // Shows additional tags in tool header
    // Used for: showing "(read-only)" label, plan indicator, etc.

    // === Supporting UI methods ===
    userFacingName(input?: ParsedInput): string
    // Returns display name: "Edit", "Read", "Bash", "Read Notebook"
    // Can be input-dependent (e.g., shows different name for plan file writes)

    getToolUseSummary?(input: ParsedInput): string | null
    // Returns short summary for activity text: "src/app.ts"
    // Used in: "Editing src/app.ts" activity descriptions

    getActivityDescription?(input: ParsedInput): string
    // Returns full activity text: "Editing src/app.ts"
    // Shown in status bar and compact mode
}
```

### RenderOpts

```typescript
interface RenderOpts {
    theme: Theme          // Current terminal color theme
    verbose: boolean      // Whether to show expanded details
    style?: "normal" | "compact"  // Display density
    tools?: Tool[]        // All available tools (for cross-tool references)
}
```

---

## 2. renderToolUseResult (SfY) - Individual Tool Renderer

### What it does

Renders a single tool invocation in the conversation. This is the core component shown in verbose mode for each tool_use block in the assistant message.

### How it works

```javascript
// ============================================
// renderToolUseResult (SfY) - Renders individual tool use with React memo caching
// Location: chunks.130.mjs:3-89
// ============================================

// ORIGINAL (for source lookup):
function SfY(A) {
    let q = e(23), { content: K, tools: Y, lookups: z, inProgressToolUseIDs: w, shouldAnimate: H, theme: $ } = A;
    // Cache invalidation check
    if (q[0] !== K || q[1] !== w || q[2] !== z || q[3] !== H || q[4] !== $ || q[5] !== Y) {
        _ = Symbol.for("react.early_return_sentinel");
        A: {
            let X = Y.find((U) => U.name === K.name);
            if (!X) { _ = null; break A }
            let D = z.resolvedToolUseIDs.has(K.id);
            let M = z.erroredToolUseIDs.has(K.id);
            let W = w.has(K.id);
            let f = z.toolResultByToolUseID.get(K.id);
            let Z = f?.type === "user" ? f.toolUseResult : void 0;
            let T = X.outputSchema?.safeParse(Z), k = T?.success ? T.data : void 0;
            let y = X.inputSchema.safeParse(K.input), B = y.success ? y.data : void 0;
            let S = X.userFacingName(B);
            let m = B ? X.renderToolUseMessage(B, { theme: $, verbose: !1 }) : null;
            let g = React.createElement(StatusIndicator, { shouldAnimate: H && W, isUnresolved: !D, isError: M });
            O = React.createElement(Box, { key: K.id, flexDirection: "column", marginTop: 1 },
                React.createElement(Box, { flexDirection: "row" },
                    g,
                    React.createElement(Text, { bold: !0 }, S),
                    m && React.createElement(Text, null, "(", m, ")"),
                    B && X.renderToolUseTag?.(B)
                ),
                D && !M && k !== void 0 && React.createElement(Box, null,
                    X.renderToolResultMessage(k, [], { verbose: !1, tools: Y, theme: $ })
                )
            )
        }
        q[0] = K; /* update cache */ ;
    } else O = q[6];
    return O
}

// READABLE (for understanding):
function renderToolUseResult({ content, tools, lookups, inProgressToolUseIDs, shouldAnimate, theme }) {
    let memoCache = useMemoCache(23);  // 23 cache slots for fine-grained invalidation

    // Find matching tool definition
    let matchingTool = tools.find(tool => tool.name === content.name);
    if (!matchingTool) return null;  // Unknown tool → nothing to render

    // Determine current state from lookup maps
    let isResolved = lookups.resolvedToolUseIDs.has(content.id);  // Has result
    let isErrored = lookups.erroredToolUseIDs.has(content.id);   // Errored result
    let isInProgress = inProgressToolUseIDs.has(content.id);      // Still running

    // Get tool result if available
    let resultEntry = lookups.toolResultByToolUseID.get(content.id);
    let rawResult = resultEntry?.type === "user" ? resultEntry.toolUseResult : undefined;

    // Parse result against output schema
    let parsedResult = matchingTool.outputSchema?.safeParse(rawResult);
    let typedResult = parsedResult?.success ? parsedResult.data : undefined;

    // Parse input against input schema
    let parsedInput = matchingTool.inputSchema.safeParse(content.input);
    let typedInput = parsedInput.success ? parsedInput.data : undefined;

    // Get display name (may be input-dependent)
    let displayName = matchingTool.userFacingName(typedInput);

    // Render compact header text (e.g., "src/app.ts" for Edit tool)
    let headerText = typedInput ?
        matchingTool.renderToolUseMessage(typedInput, { theme, verbose: false }) :
        null;

    // === Status Indicator ===
    // Spinner: running + shouldAnimate
    // Dot: resolved (green for success, red for error)
    // Clock: pending/queued
    let statusIndicator = React.createElement(StatusIndicator, {
        shouldAnimate: shouldAnimate && isInProgress,  // Animate spinner when running
        isUnresolved: !isResolved,                      // Pending state
        isError: isErrored                              // Error state
    });

    // === Assemble UI ===
    return React.createElement(Box, { key: content.id, flexDirection: "column", marginTop: 1 },

        // Header row: [●] ToolName (header text) [tag]
        React.createElement(Box, { flexDirection: "row" },
            statusIndicator,
            React.createElement(Text, { bold: true }, displayName),
            headerText && React.createElement(Text, null, "(", headerText, ")"),
            typedInput && matchingTool.renderToolUseTag?.(typedInput)
        ),

        // Result: only shown when resolved + no error + result parsed successfully
        isResolved && !isErrored && typedResult !== undefined &&
        React.createElement(Box, null,
            matchingTool.renderToolResultMessage(typedResult, [], {
                verbose: false, tools, theme
            })
        )
    )
}

// Mapping: SfY→renderToolUseResult, A→props, q→memoCache, K→content, Y→tools,
//          z→lookups, w→inProgressToolUseIDs, H→shouldAnimate, $→theme, O→result,
//          X→matchingTool, D→isResolved, M→isErrored, W→isInProgress,
//          f→resultEntry, Z→rawResult, T→parsedResult, k→typedResult,
//          y→parsedInput, B→typedInput, S→displayName, m→headerText, g→statusIndicator
```

**Why memo caching with 23 slots:**
- React compiler inserts fine-grained memo caching to avoid re-rendering when only some props change
- Separate cache slots for each input dependency (content, lookups, tools, theme, etc.)
- Early return sentinel prevents creating new elements when nothing changed
- This is critical in the terminal UI where re-renders trigger redrawing in the terminal

**Key insight — Schema validation at render time:** The render function validates both input and output against schemas. This handles cases where:
1. The LLM sends malformed tool input (render shows graceful fallback)
2. The tool returns unexpected output format (parsedResult is undefined → result section hidden)

---

## 3. renderToolUseSummary (tx4) - Aggregated Summary

### What it does

Renders a single-line summary of all tool operations in a grouped message. Used in non-verbose mode for efficiency.

### How it works

```javascript
// ============================================
// renderToolUseSummary (tx4) - Summary statistics renderer
// Location: chunks.130.mjs:91-300
// ============================================

// READABLE (for understanding):
function renderToolUseSummary({
    message,          // The grouped tool use message with counters
    inProgressToolUseIDs,
    shouldAnimate,
    verbose,
    tools,
    lookups,
    isActiveGroup    // Whether tools are still running
}) {
    let memoCache = useMemoCache(70);  // 70 cache slots!

    let {
        searchCount,        // Number of search (Grep/Glob) operations
        readCount,          // Number of file reads
        replCount,          // Number of REPL/Bash executions
        memorySearchCount,  // Number of memory search operations
        memoryReadCount,    // Number of memory read operations
        memoryWriteCount,   // Number of memory write operations
        messages
    } = message;

    let [theme] = useTheme();

    // Check if any tool errored
    let hasErrors = extractAllToolUseIds(message).some(id => lookups.erroredToolUseIDs.has(id));

    let hasMemoryOps = memorySearchCount > 0 || memoryReadCount > 0 || memoryWriteCount > 0;
    let hasFileOps = searchCount > 0 || readCount > 0 || replCount > 0;

    // In verbose mode: render full tool use list (not just summary)
    if (verbose) {
        return React.createElement(Box, { flexDirection: "column" },
            messages
                .filter(msg => msg.type === "assistant" || msg.type === "grouped_tool_use")
                .flatMap(msg => msg.type === "grouped_tool_use" ? msg.messages : [msg])
                .map(msg => {
                    let toolUseBlock = msg.message.content.find(b => b.type === "tool_use");
                    if (!toolUseBlock) return null;
                    return React.createElement(renderToolUseResult, {
                        key: toolUseBlock.id,
                        content: toolUseBlock,
                        tools, lookups, inProgressToolUseIDs, shouldAnimate, theme
                    });
                })
        )
    }

    if (!hasMemoryOps && !hasFileOps) return null;

    // Build summary text items with smart pluralization
    let summaryItems = [];

    // Memory read: "Recalled N memories" or "Recalling N memories"
    if (memoryReadCount > 0) {
        let verb = isActiveGroup ? "Recalling" : "Recalled";
        let unit = memoryReadCount === 1 ? "memory" : "memories";
        summaryItems.push(React.createElement(Text, null, verb, " ", React.createElement(Text, { bold: true }, memoryReadCount), " ", unit));
    }

    // Memory search: "Searching memories" or "Searched memories"
    if (memorySearchCount > 0) {
        if (summaryItems.length > 0) summaryItems.push(React.createElement(Text, null, ", "));
        let verb = isActiveGroup ? "searching" : "searched";
        summaryItems.push(React.createElement(Text, null, verb, " memories"));
    }

    // Memory write: "Writing N memories" or "Wrote N memories"
    if (memoryWriteCount > 0) {
        if (summaryItems.length > 0) summaryItems.push(React.createElement(Text, null, ", "));
        let verb = isActiveGroup ? "Writing" : "Wrote";
        let unit = memoryWriteCount === 1 ? "memory" : "memories";
        summaryItems.push(React.createElement(Text, null, verb, " ", React.createElement(Text, { bold: true }, memoryWriteCount), " ", unit));
    }

    // Search (Grep/Glob): "Searching N patterns" or "Searched N patterns"
    if (searchCount > 0) {
        if (summaryItems.length > 0) summaryItems.push(React.createElement(Text, null, ", "));
        let verb = isActiveGroup ? "Searching" : "Searched";
        let unit = searchCount === 1 ? "pattern" : "patterns";
        summaryItems.push(React.createElement(Text, null, verb, " ", React.createElement(Text, { bold: true }, searchCount), " ", unit));
    }

    // Read: "Reading N files" or "Read N files"
    if (readCount > 0) {
        if (summaryItems.length > 0) summaryItems.push(React.createElement(Text, null, ", "));
        let verb = isActiveGroup ? "reading" : "read";
        let unit = readCount === 1 ? "file" : "files";
        summaryItems.push(React.createElement(Text, null, verb, " ", React.createElement(Text, { bold: true }, readCount), " ", unit));
    }

    // REPL: "Running N commands" or "Ran N commands"
    if (replCount > 0) {
        if (summaryItems.length > 0) summaryItems.push(React.createElement(Text, null, ", "));
        let verb = isActiveGroup ? "running" : "ran";
        let unit = replCount === 1 ? "command" : "commands";
        summaryItems.push(React.createElement(Text, null, verb, " ", React.createElement(Text, { bold: true }, replCount), " ", unit));
    }

    // Active: append "…" to indicate still running
    if (isActiveGroup) summaryItems.push(React.createElement(Text, null, "…"));

    // Build status + summary row
    let statusIndicator = React.createElement(StatusIndicator, {
        shouldAnimate: isActiveGroup,
        isUnresolved: isActiveGroup,
        isError: hasErrors
    });

    return React.createElement(Box, { flexDirection: "row" },
        statusIndicator,
        React.createElement(Spacer),
        ...summaryItems
    )
}

// Mapping: tx4→renderToolUseSummary, A→props, q→memoCache (70 slots), K→message,
//          Y→inProgressToolUseIDs, z→shouldAnimate, w→verbose, H→tools,
//          $→lookups, O→isActiveGroup, _→searchCount, J→readCount, X→replCount,
//          D→memorySearchCount, j→memoryReadCount, M→memoryWriteCount, P→messages
```

**Summary examples:**
- `● Reading 3 files, Searching 2 patterns…` (in progress)
- `● Read 3 files, searched 2 patterns` (completed)
- `✓ Recalled 2 memories, wrote 1 memory` (completed with memory ops)
- `✗ Read 2 files, running 1 command…` (has errors, still running)

**Why 70 memo cache slots:**
The summary has many independent state variables (searchCount, readCount, replCount, memoryXxx), each requiring separate cache tracking. Fine-grained caching prevents re-rendering the entire summary when only one counter changes.

---

## 4. StatusIndicator (rK1) - Visual State Indicator

### What it does

The status indicator is the visual dot/spinner shown before each tool use. It communicates the current state of the tool invocation.

### States

```
⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏   → Animated spinner (running, shouldAnimate=true)
●                           → Solid dot (pending/in queue, isUnresolved=true)
✓                           → Checkmark (completed successfully)
✗                           → X mark (completed with error, isError=true)
```

### Rendering logic

```typescript
function StatusIndicator({ shouldAnimate, isUnresolved, isError }) {
    if (shouldAnimate) {
        // Braille spinner characters cycling every ~80ms
        return <Spinner />
    }
    if (isUnresolved) {
        // Tool invoked but waiting for result (queued)
        return <Text color="yellow">●</Text>
    }
    if (isError) {
        return <Text color="red">✗</Text>
    }
    return <Text color="green">✓</Text>
}
```

---

## 5. Tool-Specific Rendering — Complete Matrix

| Tool | renderToolUseMessage | renderToolResultMessage | renderToolUseProgressMessage | renderToolUseRejectedMessage |
|------|---------------------|------------------------|-----------------------------|-----------------------------|
| **Edit** | File path breadcrumb | DiffViewer (SP6) | null | EditPreview with diff (ZW1) |
| **Write** | File path breadcrumb | DiffViewer or content | null | EditPreview with content |
| **Read** | File path breadcrumb | File content (line-numbered) | null | File path |
| **Bash** | Command text (truncated) | BashOutputComponent (BYq) | Elapsed timer | Command text |
| **Grep** | Pattern + path | Match results | null | Pattern + path |
| **Glob** | Pattern + path | File list | null | Pattern + path |
| **NotebookEdit** | Notebook path | Cell content | null | Notebook path |
| **Task/Agent** | Subagent type + prompt | Agent result | Live output stream | Prompt |
| **LSP** | Operation + symbol | LSP result | null | Operation |
| **Browser** | URL or action | Screenshot/DOM | Elapsed timer | URL |
| **MCP tools** | Tool name + args | JSON result | null | Tool name |

---

## 6. Tool Use Rendering Pipeline

### Full rendering flow for a completed tool use

```
1. Agent loop produces tool_use block in assistant message
           │
           ▼
2. renderToolUseResult (SfY) called with:
   - content: { type: "tool_use", name: "Edit", id: "xyz", input: {...} }
   - lookups: { resolvedToolUseIDs, erroredToolUseIDs, toolResultByToolUseID }
           │
           ▼
3. Tool lookup: tools.find(t => t.name === "Edit") → EditTool (sW)
           │
           ▼
4. State determination:
   - isResolved = resolvedToolUseIDs.has("xyz")      → true
   - isErrored = erroredToolUseIDs.has("xyz")         → false
   - isInProgress = inProgressToolUseIDs.has("xyz")   → false
           │
           ▼
5. Input parsing: EditTool.inputSchema.safeParse(input)
   → { file_path: "src/app.ts", old_string: "...", new_string: "..." }
           │
           ▼
6. Output parsing: EditTool.outputSchema.safeParse(toolUseResult)
   → { filePath, structuredPatch, originalFile, ... }
           │
           ▼
7. Header render: EditTool.renderToolUseMessage({ file_path: "src/app.ts" }, { verbose: false })
   → "src/app.ts"  (just filename in non-verbose)
           │
           ▼
8. Status indicator: ✓ (resolved, no error)
           │
           ▼
9. Result render: EditTool.renderToolResultMessage({ structuredPatch, ... }, [], { verbose: false })
   → DiffViewer component showing unified diff
           │
           ▼
10. Final UI:
    ✓ Edit (src/app.ts)
    - old line content
    + new line content
```

---

## 7. Verbose vs Normal Mode Differences

### Normal Mode (default)
- Shows compact summary line per tool group: "Read 3 files, Searched 2 patterns"
- Individual tool results collapsed/hidden
- Status indicator shows overall group state
- File paths show just filename, not full path

### Verbose Mode (--verbose flag)
- Shows every tool invocation individually via renderToolUseResult (SfY)
- Full result output visible (diff views, file content, search results)
- Full absolute file paths shown
- Timestamps and duration info shown

---

## 8. Memory Optimization — React Compiler Cache

The UI renderer uses React Compiler's memo cache (`e(N)`) to avoid redundant re-renders:

**Why critical in terminal UI:**
- Terminal UIs re-render the entire screen on any state change
- With many tool uses in a long session, unoptimized rendering would be O(N) per update
- The memo cache makes each component O(1) unless its specific dependencies change

**Cache invalidation strategy:**
- Each dependency (content, lookups, tools, theme) has its own cache slot
- Identity comparison (`===`) on each slot
- When cache hit: return previous result directly (O(1))
- When cache miss: re-render and update all slots

**Slot count guidelines:**
- `e(23)` — 23 slots in renderToolUseResult: ~4 slots per dependency (current, deps, result, early-return)
- `e(70)` — 70 slots in renderToolUseSummary: more counters = more individual cache slots

---

## 9. Bash Output Rendering

### BashOutputComponent (BYq)

**What it does:** Renders Bash command output with exit code, duration, and truncated display.

```javascript
// ============================================
// BashOutputComponent - Bash result renderer
// Location: chunks.162.mjs:417249
// ============================================

// READABLE (for understanding):
function BashOutputComponent({ output, exitCode, command, style }) {
    let { columns } = useTerminalInfo();

    // Truncate output if too long
    let maxLines = Math.floor(columns * 0.5);  // Max half screen
    let lines = output.split("\n");

    let displayOutput = lines.length > maxLines
        ? lines.slice(0, maxLines).join("\n") + `\n... (${lines.length - maxLines} more lines)`
        : output;

    return React.createElement(Box, { flexDirection: "column" },
        // Exit code indicator
        exitCode !== 0 && React.createElement(Text, { color: "red" },
            "Exit code: ", exitCode
        ),

        // Output content
        React.createElement(Box, { marginTop: 1 },
            React.createElement(CodeBlock, {
                code: displayOutput,
                language: "bash"
            })
        )
    );
}

// Mapping: BYq→BashOutputComponent
```

---

### Bash Progress Rendering

**What it does:** Shows elapsed time for long-running Bash commands.

```javascript
// ============================================
// Bash Progress Rendering
// Location: chunks.162.mjs
// ============================================

// READABLE (for understanding):
function BashProgressIndicator({ startTime, command }) {
    let [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        let interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    let elapsedStr = elapsed >= 60
        ? `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`
        : `${elapsed}s`;

    return React.createElement(Box, { flexDirection: "row" },
        React.createElement(StatusIndicator, { shouldAnimate: true }),
        React.createElement(Text, null, "Bash: "),
        React.createElement(Text, { dimColor: true }, command.slice(0, 50)),
        React.createElement(Text, { dimColor: true }, ` (${elapsedStr})`)
    );
}
```

---

## 10. Diff Viewer Implementation

### DiffViewer (SP6)

**What it does:** Renders unified diff with syntax highlighting and line numbers.

```javascript
// ============================================
// DiffViewer - Unified diff renderer
// Location: chunks.134.mjs
// ============================================

// READABLE (for understanding):
function DiffViewer({ filePath, structuredPatch, firstLine, fileContent, style, verbose }) {
    let { columns } = useTerminalInfo();
    let theme = useTheme();

    // Parse the structured patch
    let hunks = parseUnifiedDiff(structuredPatch);

    return React.createElement(Box, { flexDirection: "column" },
        // File header (only in verbose mode)
        verbose && React.createElement(Text, { bold: true }, filePath),

        // Each hunk
        hunks.map((hunk, idx) =>
            React.createElement(Box, { key: idx, flexDirection: "column" },
                // Hunk header: @@ -l,s +l,s @@ optional heading
                React.createElement(Text, { dimColor: true }, hunk.header),

                // Diff lines
                hunk.lines.map((line, lineIdx) => {
                    let prefix = line[0];
                    let content = line.slice(1);

                    // Color based on change type
                    let color = prefix === '+' ? theme.added :
                               prefix === '-' ? theme.removed :
                               undefined;

                    return React.createElement(Box, { key: lineIdx },
                        React.createElement(Text, {
                            dimColor: prefix === ' ',
                            color: color
                        }, prefix, content)
                    );
                })
            )
        )
    );
}

// Mapping: SP6→DiffViewer
```

---

### EditPreview (ZW1)

**What it does:** Shows what an edit would do before user approves/rejects.

```javascript
// ============================================
// EditPreview - Pre-rejection edit preview
// Location: chunks.134.mjs
// ============================================

// ORIGINAL (for source lookup):
function ZW1({ file_path: A, operation: q, patch: K, firstLine: Y, fileContent: z, style: w, verbose: H }) {
    let $ = b1(), O = H ? A : L3(A), _ = z?.split(`
`).slice(0, qF4).join(`
`);
    return React.createElement(HA, null,
        React.createElement(I, { flexDirection: "column" },
            // ... header and diff preview
        )
    )
}

// READABLE (for understanding):
function EditPreview({ file_path, operation, patch, firstLine, fileContent, style, verbose }) {
    let fs = getFileSystem();
    let displayPath = verbose ? file_path : getFilename(file_path);

    // Truncate preview to first 5 lines of file
    let previewContent = fileContent?.split("\n").slice(0, 5).join("\n");

    return React.createElement(Box, { flexDirection: "column" },
        // Operation header: "Would edit src/app.ts"
        React.createElement(Text, null,
            operation === "update" ? "Would edit " : "Would create ",
            React.createElement(Text, { bold: true }, displayPath)
        ),

        // Diff preview
        patch && React.createElement(DiffViewer, {
            filePath: file_path,
            structuredPatch: patch,
            fileContent: fileContent,
            style,
            verbose
        }),

        // First line hint
        !patch && firstLine && React.createElement(Text, { dimColor: true },
            "Current first line: ", firstLine
        )
    );
}

// Mapping: ZW1→EditPreview, L3→getFilename, b1→getFileSystem, qF4→MAX_PREVIEW_LINES
```

---

## 11. File Path Rendering

### FilePathBreadcrumb (AE)

**What it does:** Renders file paths as clickable breadcrumbs for navigation.

```javascript
// ============================================
// FilePathBreadcrumb - File path display
// Location: chunks.134.mjs
// ============================================

// ORIGINAL (for source lookup):
function AE({ filePath: A, children: q }) {
    return React.createElement(Text, { dimColor: !0 },
        React.createElement(Text, { bold: !0 }, q)
    )
}

// READABLE (for understanding):
function FilePathBreadcrumb({ filePath, children }) {
    // In terminal UI, just show the filename/children bolded
    // In IDE integrations, this would be a clickable breadcrumb

    return React.createElement(Text, { dimColor: true },
        React.createElement(Text, { bold: true }, children)
    );
}

// Usage in Edit tool:
renderToolUseMessage(input, { verbose }) {
    if (!input.file_path) return null;
    return React.createElement(FilePathBreadcrumb, {
        filePath: input.file_path
    }, verbose ? input.file_path : getFilename(input.file_path));
}

// Mapping: AE→FilePathBreadcrumb
```

---

## 12. Tool Use Tag Rendering

### renderToolUseTag - Additional Labels

**What it does:** Some tools show extra tags in the tool header.

```javascript
// ============================================
// renderToolUseTag - Extra header labels
// ============================================

// Examples:

// Bash tool shows "(read-only)" for safe commands
BashTool.renderToolUseTag(input) {
    if (isReadOnlyCommand(input.command)) {
        return React.createElement(Text, { dimColor: true }, " (read-only)");
    }
    return null;
}

// Task tool shows "(background)" for background agents
TaskTool.renderToolUseTag(input) {
    if (input.run_in_background) {
        return React.createElement(Text, { dimColor: true }, " (background)");
    }
    return null;
}

// Plan file writes show "(plan)"
WriteTool.renderToolUseTag(input) {
    if (input.file_path?.startsWith(getPlanFilePrefix())) {
        return React.createElement(Text, { dimColor: true }, " (plan)");
    }
    return null;
}
```

---

## 13. Error Message Rendering

### Tool Error Display

**What it does:** Shows user-friendly error messages for failed tool calls.

```javascript
// ============================================
// renderToolUseErrorMessage - Error display
// ============================================

// READABLE (for understanding):
function renderToolUseErrorMessage(errorResult, context) {
    let errorMessage = typeof errorResult === "string"
        ? errorResult
        : errorResult.content || "Unknown error";

    // Parse common error types for better display
    if (errorMessage.includes("File has not been read yet")) {
        return React.createElement(Box, { flexDirection: "column" },
            React.createElement(Text, { color: "red" }, "Error: File must be read first"),
            React.createElement(Text, { dimColor: true },
                "Use the Read tool on this file before editing it."
            )
        );
    }

    if (errorMessage.includes("InputValidationError")) {
        return React.createElement(Box, null,
            React.createElement(Text, { color: "red" }, "Invalid input: "),
            React.createElement(Text, null, errorMessage.replace("InputValidationError: ", ""))
        );
    }

    // Generic error display
    return React.createElement(Text, { color: "red" }, "Error: ", errorMessage);
}
```

---

## 14. MCP Tool Result Rendering

### Generic MCP Tool Result Display

**What it does:** MCP tools use a generic JSON renderer since their output format varies.

```javascript
// ============================================
// MCP Tool Result Rendering
// ============================================

// READABLE (for understanding):
function renderMcpToolResult(result, input, { verbose }) {
    // MCP tools don't have custom renderers, use generic JSON display

    if (typeof result === "string") {
        // Plain text result
        return React.createElement(CodeBlock, {
            code: result,
            width: getTerminalWidth() - 4
        });
    }

    if (result.images && result.images.length > 0) {
        // Image results (e.g., screenshot tools)
        return React.createElement(Box, { flexDirection: "column" },
            result.images.map((img, idx) =>
                React.createElement(ImageDisplay, { key: idx, data: img })
            )
        );
    }

    // JSON result
    let jsonStr = JSON.stringify(result, null, 2);
    if (jsonStr.length > MAX_MCP_RESULT_LENGTH) {
        jsonStr = jsonStr.slice(0, MAX_MCP_RESULT_LENGTH) + "\n... (truncated)";
    }

    return React.createElement(CodeBlock, {
        code: jsonStr,
        language: "json",
        width: getTerminalWidth() - 4
    });
}
```

---

## 15. Complete Tool Use Message Example

### Edit Tool Full Rendering Flow

```javascript
// Complete example: Edit tool renders as:

// 1. Header (renderToolUseMessage):
//    "src/app.ts"
//
// 2. Status indicator:
//    "✓" (success) or "✗" (error) or "⠋" (spinner)
//
// 3. User-facing name:
//    "Edit"
//
// 4. Combined header row:
//    "✓ Edit (src/app.ts)"
//
// 5. Result (renderToolResultMessage):
//    DiffViewer showing:
//    ```diff
//    - const old = 'value';
//    + const new = 'value';
//    ```
//
// 6. Full output:
//    ✓ Edit (src/app.ts)
//    @@ -1,3 +1,3 @@
//    - const old = 'value';
//    + const new = 'value';
```
