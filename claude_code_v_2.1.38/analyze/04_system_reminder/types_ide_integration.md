# System Reminder Types: IDE Integration

> **Module**: System Reminders - IDE Integration Types
> **Version**: Claude Code 2.1.38
> **Source**: `chunks.173.mjs:785-800`, `chunks.142.mjs:2114-2197`, `chunks.142.mjs:2463-2492`

---

## Table of Contents

- [Overview](#overview)
- [selected_lines_in_ide](#selected_lines_in_ide)
- [opened_file_in_ide](#opened_file_in_ide)
- [diagnostics](#diagnostics)
- [Trigger Conditions Summary](#trigger-conditions-summary)
- [Configuration](#configuration)

---

## Overview

IDE integration types provide context about the user's IDE state:

1. **Code selection** - What code the user has selected
2. **Open files** - What file the user is viewing
3. **Diagnostics** - LSP errors and warnings

These types are **main-agent-only**, meaning they're only produced when `sessionContext.agentId` is undefined (the primary agent, not subagents).

---

## Trigger Source Summary

Each IDE integration type has a specific producer function with distinct trigger conditions:

| Type | Producer Function | Location | Key Trigger Logic |
|------|-------------------|----------|-------------------|
| `selected_lines_in_ide` | `ehY` (getIdeSelectionAttachment) | chunks.142.mjs:2114-2127 | `T$6(mcpClients)` + `lineStart !== undefined` |
| `opened_file_in_ide` | `qIY` (getIdeOpenedFileAttachment) | chunks.142.mjs:2189-2197 | `filePath` exists + `text` is null (no selection) |
| `diagnostics` | `PIY` (getDiagnosticsAttachment) | chunks.142.mjs:2463-2471 | `Fd.getNewDiagnostics()` returns non-empty |
| `lsp_diagnostics` | `WIY` (getLspDiagnosticsAttachment) | chunks.142.mjs:2473-2492 | LSP server has new diagnostics |

### IDE Connection Detection

The `T$6` function checks for connected IDE:

```javascript
// Location: chunks.142.mjs:2115
let ideName = getConnectedIdeName(sessionContext.options.mcpClients);
// Returns: "VSCode" | "Cursor" | "Neovim" | etc., or undefined if no IDE connected
```

### Permission Check

All IDE integration types perform a permission check:

```javascript
// Location: chunks.142.mjs:2118
if (isPathDisallowed(filePath, appState.toolPermissionContext)) {
    return [];
}
```

---

## selected_lines_in_ide

### What It Does

Provides the LLM with the user's currently selected text in their IDE. This enables context-aware assistance without explicit copy-paste.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| IDE connected | MCP client with IDE integration available |
| Selection exists | `lineStart`, `text`, and `filePath` are defined |
| Main agent only | No `agentId` in session context |
| Permission check | File path not denied by sandbox rules |

### Source Code

#### Producer Function

```javascript
// ============================================
// getIdeSelectionAttachment - Produce IDE selection attachment
// Location: chunks.142.mjs:2114-2127
// ============================================

// ORIGINAL (for source lookup):
async function ehY(A, q) {
    let K = T$6(q.options.mcpClients);
    if (!K || A?.lineStart === void 0 || !A.text || !A.filePath) return [];
    let Y = await q.getAppState();
    if (sW1(A.filePath, Y.toolPermissionContext)) return [];
    return [{
        type: "selected_lines_in_ide",
        ideName: K,
        lineStart: A.lineStart,
        lineEnd: A.lineStart + A.lineCount - 1,
        filename: A.filePath,
        content: A.text
    }]
}

// READABLE (for understanding):
async function getIdeSelectionAttachment(ideSelection, sessionContext) {
    // Check if IDE integration is available
    let ideName = getConnectedIdeName(sessionContext.options.mcpClients);
    if (!ideName) return [];

    // Validate selection data
    if (!ideSelection?.lineStart === undefined ||
        !ideSelection.text ||
        !ideSelection.filePath) {
        return [];
    }

    // Permission check
    let appState = await sessionContext.getAppState();
    if (isPathDisallowed(ideSelection.filePath, appState.toolPermissionContext)) {
        return [];
    }

    return [{
        type: "selected_lines_in_ide",
        ideName: ideName,
        lineStart: ideSelection.lineStart,
        lineEnd: ideSelection.lineStart + ideSelection.lineCount - 1,
        filename: ideSelection.filePath,
        content: ideSelection.text
    }];
}

// Mapping: ehY→getIdeSelectionAttachment, A→ideSelection, q→sessionContext, K→ideName, T$6→getConnectedIdeName, Y→appState, sW1→isPathDisallowed
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - selected_lines_in_ide case
// Location: chunks.173.mjs:785-795
// ============================================

// ORIGINAL (for source lookup):
case "selected_lines_in_ide": {
    let Y = A.content.length > 2000 ? A.content.substring(0, 2000) + `
... (truncated)` : A.content;
    return _9([c6({
        content: `The user selected the lines ${A.lineStart} to ${A.lineEnd} from ${A.filename}:
${Y}

This may or may not be related to the current task.`,
        isMeta: !0
    })])
}

// READABLE (for understanding):
case "selected_lines_in_ide": {
    // Truncate content if too long
    let displayContent = attachment.content.length > 2000
        ? attachment.content.substring(0, 2000) + '\n... (truncated)'
        : attachment.content;

    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `The user selected the lines ${attachment.lineStart} to ${attachment.lineEnd} from ${attachment.filename}:
${displayContent}

This may or may not be related to the current task.`,
            isMeta: true
        })
    ]);
}

// Mapping: A→attachment, Y→displayContent, _9→wrapWithSystemReminderTags, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
The user selected the lines 42 to 58 from /path/to/file.js:
function processData(input) {
    const result = input.map(item => {
        return transform(item);
    });
    return result;
}

This may or may not be related to the current task.
</system-reminder>
```

### Key Insights

1. **Content truncation**: Selection content is truncated at 2000 characters to prevent token overflow.

2. **Hedging language**: "may or may not be related" prevents the LLM from over-interpreting selection context.

3. **Permission gating**: The selection is silently dropped if the file path is denied by sandbox rules.

---

## opened_file_in_ide

### What It Does

Notifies the LLM when the user opens a file in their IDE, providing implicit context about their current focus.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| File opened | `ideContext.filePath` is defined |
| No text content | Selection is empty (otherwise handled by selection type) |
| Main agent only | No `agentId` in session context |
| Permission check | File path not denied |

### Source Code

#### Producer Function

```javascript
// ============================================
// getIdeOpenedFileAttachment - Produce opened file attachment
// Location: chunks.142.mjs:2189-2197
// ============================================

// ORIGINAL (for source lookup):
async function qIY(A, q) {
    if (!A?.filePath || A.text) return [];
    let K = await q.getAppState();
    if (sW1(A.filePath, K.toolPermissionContext)) return [];
    return [...ri4(A.filePath, q, K), {
        type: "opened_file_in_ide",
        filename: A.filePath
    }]
}

// READABLE (for understanding):
async function getIdeOpenedFileAttachment(ideContext, sessionContext) {
    // Validate - must have filePath but no text (selection)
    if (!ideContext?.filePath || ideContext.text) {
        return [];
    }

    // Permission check
    let appState = await sessionContext.getAppState();
    if (isPathDisallowed(ideContext.filePath, appState.toolPermissionContext)) {
        return [];
    }

    // Include any nested memory files (CLAUDE.md files in parent directories)
    let nestedMemoryAttachments = loadNestedMemory(
        ideContext.filePath,
        sessionContext,
        appState
    );

    return [
        ...nestedMemoryAttachments,
        {
            type: "opened_file_in_ide",
            filename: ideContext.filePath
        }
    ];
}

// Mapping: qIY→getIdeOpenedFileAttachment, A→ideContext, q→sessionContext, K→appState, sW1→isPathDisallowed, ri4→loadNestedMemory
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - opened_file_in_ide case
// Location: chunks.173.mjs:796-800
// ============================================

// ORIGINAL (for source lookup):
case "opened_file_in_ide":
    return _9([c6({
        content: `The user opened the file ${A.filename} in the IDE. This may or may not be related to the current task.`,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "opened_file_in_ide":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `The user opened the file ${attachment.filename} in the IDE. This may or may not be related to the current task.`,
            isMeta: true
        })
    ]);

// Mapping: _9→wrapWithSystemReminderTags, c6→createUserMessage, A→attachment
```

### Output Format

```markdown
<system-reminder>
The user opened the file /path/to/file.js in the IDE. This may or may not be related to the current task.
</system-reminder>
```

### Key Insights

1. **Nested memory loading**: When a file is opened, the system also loads any `CLAUDE.md` files from parent directories (nested memory).

2. **Selection exclusion**: If the user has text selected (`ideContext.text` exists), this type is skipped in favor of `selected_lines_in_ide`.

3. **Hedging language**: Same "may or may not be related" phrasing to prevent over-interpretation.

---

## diagnostics

### What It Does

Provides LSP diagnostic information (errors, warnings) to the LLM, enabling it to be aware of code issues without explicit user mention.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| New diagnostics | `Fd.getNewDiagnostics()` returns non-empty array |
| Main agent only | No `agentId` in session context |

### Source Code

#### Producer Functions

```javascript
// ============================================
// getDiagnosticsAttachment - Get IDE diagnostics
// Location: chunks.142.mjs:2463-2471
// ============================================

// ORIGINAL (for source lookup):
async function PIY(A) {
    let q = await Fd.getNewDiagnostics();
    if (q.length === 0) return [];
    return [{
        type: "diagnostics",
        files: q,
        isNew: !0
    }]
}

// READABLE (for understanding):
async function getDiagnosticsAttachment(sessionContext) {
    let diagnostics = await DiagnosticRegistry.getNewDiagnostics();
    if (diagnostics.length === 0) return [];

    return [{
        type: "diagnostics",
        files: diagnostics,
        isNew: true
    }];
}

// Mapping: PIY→getDiagnosticsAttachment, A→sessionContext, q→diagnostics, Fd→DiagnosticRegistry
```

```javascript
// ============================================
// getLspDiagnosticsAttachment - Get LSP diagnostics
// Location: chunks.142.mjs:2473-2492
// ============================================

// ORIGINAL (for source lookup):
async function WIY(A) {
    h("LSP Diagnostics: getLSPDiagnosticAttachments called");
    try {
        let q = sm4();
        if (q.length === 0) return [];
        h(`LSP Diagnostics: Found ${q.length} pending diagnostic set(s)`);
        let K = q.map(({
            files: Y
        }) => ({
            type: "diagnostics",
            files: Y,
            isNew: !0
        }));
        if (q.length > 0) tm4(), h(`LSP Diagnostics: Cleared ${q.length} delivered diagnostic(s) from registry`);
        return h(`LSP Diagnostics: Returning ${K.length} diagnostic attachment(s)`), K
    } catch (q) {
        let K = q instanceof Error ? q : Error(String(q));
        return K1(Error(`Failed to get LSP diagnostic attachments: ${K.message}`)), []
    }
}

// READABLE (for understanding):
async function getLspDiagnosticsAttachment(sessionContext) {
    debugLog("LSP Diagnostics: getLSPDiagnosticAttachments called");

    try {
        let pendingDiagnostics = getPendingLspDiagnostics();
        if (pendingDiagnostics.length === 0) return [];

        debugLog(`LSP Diagnostics: Found ${pendingDiagnostics.length} pending diagnostic set(s)`);

        let attachments = pendingDiagnostics.map(({ files }) => ({
            type: "diagnostics",
            files: files,
            isNew: true
        }));

        if (pendingDiagnostics.length > 0) {
            clearDeliveredLspDiagnostics();
            debugLog(`LSP Diagnostics: Cleared ${pendingDiagnostics.length} delivered diagnostic(s) from registry`);
        }

        debugLog(`LSP Diagnostics: Returning ${attachments.length} diagnostic attachment(s)`);
        return attachments;

    } catch (error) {
        let err = error instanceof Error ? error : new Error(String(error));
        logError(new Error(`Failed to get LSP diagnostic attachments: ${err.message}`));
        return [];
    }
}

// Mapping: WIY→getLspDiagnosticsAttachment, A→sessionContext, q→pendingDiagnostics, K→attachments, Y→files, sm4→getPendingLspDiagnostics, tm4→clearDeliveredLspDiagnostics, h→debugLog, K1→logError
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - diagnostics case
// Location: chunks.173.mjs:927-935
// ============================================

// ORIGINAL (for source lookup):
case "diagnostics": {
    if (A.files.length === 0) return [];
    let K = KI.formatDiagnosticsSummary(A.files);
    return _9([c6({
        content: `<new-diagnostics>The following new diagnostic issues were detected:

${K}</new-diagnostics>`,
        isMeta: !0
    })])
}

// READABLE (for understanding):
case "diagnostics": {
    if (attachment.files.length === 0) return [];

    let summary = formatDiagnosticsSummary(attachment.files);

    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `<new-diagnostics>The following new diagnostic issues were detected:

${summary}</new-diagnostics>`,
            isMeta: true
        })
    ]);
}

// Mapping: A→attachment, K→summary, KI→DiagnosticFormatter, _9→wrapWithSystemReminderTags, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
<new-diagnostics>The following new diagnostic issues were detected:

**file1.js** (3 issues):
  - Line 42: Error - 'undefinedVar' is not defined
  - Line 58: Warning - Unused variable 'temp'
  - Line 72: Error - Missing semicolon

**file2.ts** (1 issue):
  - Line 15: Error - Type 'string' is not assignable to type 'number'
</new-diagnostics>
</system-reminder>
```

### Key Insights

1. **Two sources**: Diagnostics come from both IDE diagnostics (`Fd.getNewDiagnostics`) and LSP diagnostics (`sm4()`).

2. **Clear after delivery**: LSP diagnostics are cleared from the registry after being delivered to prevent duplicates.

3. **XML wrapper**: Uses `<new-diagnostics>` tag within the system-reminder for structured parsing.

4. **Silent when empty**: If no files have diagnostics, returns empty array.

---

## Trigger Conditions Summary

| Type | Primary Trigger | Main Agent Only | Permission Check |
|------|-----------------|-----------------|------------------|
| `selected_lines_in_ide` | User selects code in IDE | Yes | Yes |
| `opened_file_in_ide` | User opens file in IDE | Yes | Yes |
| `diagnostics` | New LSP/IDE diagnostics available | Yes | No |

### Main-Agent-Only Gating

All IDE integration types are gated by the `O` variable in `assembleAttachments`:

```javascript
// ============================================
// assembleAttachments - Main-agent-only producers
// Location: chunks.142.mjs:1958, 1962
// ============================================

let O = !q.agentId;  // true = main agent, false = subagent

// ... later ...
let D = O ? [
    gw("ide_selection", async () => ehY(K, q)),
    gw("ide_opened_file", async () => qIY(K, q)),
    // ... other main-agent-only producers
] : [];
```

---

## Configuration

### Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| Selection truncation | 2000 chars | Maximum content length for selection display |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | Disables all attachment production |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:

- `getIdeSelectionAttachment` (ehY) - IDE selection producer, `chunks.142.mjs:2114-2127`
- `getIdeOpenedFileAttachment` (qIY) - IDE opened file producer, `chunks.142.mjs:2189-2197`
- `getDiagnosticsAttachment` (PIY) - IDE diagnostics producer, `chunks.142.mjs:2463-2471`
- `getLspDiagnosticsAttachment` (WIY) - LSP diagnostics producer, `chunks.142.mjs:2473-2492`
- `getConnectedIdeName` (T$6) - Get connected IDE name
- `loadNestedMemory` (ri4) - Load CLAUDE.md files
- `formatDiagnosticsSummary` (KI.formatDiagnosticsSummary) - Format diagnostics for display

---

## Related Documents

- [README.md](./README.md) - Documentation index
- [implementation_details.md](./implementation_details.md) - Core implementation
- [types_file_context.md](./types_file_context.md) - File context types