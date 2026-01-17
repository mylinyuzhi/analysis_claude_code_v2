# Code Indexing System Integration

## Overview

This document describes how the code indexing subsystems (FileIndex and Tree-sitter) integrate with other Claude Code modules, including plan mode, tools, system reminders, and session state management.

---

## Table of Contents

- [1. Tool Integration](#1-tool-integration)
- [2. Plan Mode Integration](#2-plan-mode-integration)
- [3. System Reminder Integration](#3-system-reminder-integration)
- [4. Session State Integration](#4-session-state-integration)
- [5. MCP Auto-Search Integration](#5-mcp-auto-search-integration)
- [6. Compaction Integration](#6-compaction-integration)
- [7. Related Symbols](#7-related-symbols)

---

## 1. Tool Integration

### File Suggestion in Tool Parameters

FileIndex provides autocomplete for file path parameters across multiple tools:

```
+---------------------------------------------------------------------+
|                    Tool Parameter Autocomplete                        |
+---------------------------------------------------------------------+
|                                                                       |
|  Tools Using File Suggestions:                                       |
|  +---------------------------------------------------------------+   |
|  | - Read tool: file_path parameter                              |   |
|  | - Edit tool: file_path parameter                              |   |
|  | - Write tool: file_path parameter                             |   |
|  | - Glob tool: path parameter                                   |   |
|  | - Grep tool: path parameter                                   |   |
|  | - Bash tool: command line paths                               |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
|  Trigger Flow:                                                       |
|  +---------------------------------------------------------------+   |
|  | 1. User types in tool parameter field                         |   |
|  | 2. UI calls getFileSuggestions(query)                         |   |
|  | 3. FileIndex returns matching paths                           |   |
|  | 4. UI displays dropdown with suggestions                      |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
+---------------------------------------------------------------------+
```

### @ Mention File Attachment

When users type `@` followed by a path, the system:

1. Calls FileIndex for path suggestions
2. On selection, reads the file content
3. Creates an attachment for the conversation

```javascript
// ============================================
// processFileAttachment (TL0) - Process @file mention
// Location: chunks.132.mjs:3-85
// ============================================

// ORIGINAL (for source lookup):
async function TL0(A, Q, B, G, Z, Y) {
  let {
    offset: J,
    limit: X
  } = Y ?? {}, I = await Q.getAppState();
  if (nEA(A, I.toolPermissionContext)) return null;
  if (Z === "at-mention" && !U71(A)) try {
    let W = vA().statSync(A);
    return l("tengu_attachment_file_too_large", {
      size_bytes: W.size,
      mode: Z
    }), null
  } catch {}
  let D = Q.readFileState.get(A);
  if (D && Z === "at-mention") try {
    let W = mz(A);
    if (D.timestamp <= W && W === D.timestamp) return l(B, {}), {
      type: "already_read_file",
      filename: A,
      content: {
        type: "text",
        file: {
          filePath: A,
          content: D.content,
          numLines: D.content.split(`\n`).length,
          startLine: J ?? 1,
          totalLines: D.content.split(`\n`).length
        }
      }
    }
  } catch {}
  // ... full read via v5.call() ...
}

// READABLE (for understanding):
async function processFileAttachment(
  filePath,
  sessionContext,
  successTelemetryEvent,
  failureTelemetryEvent,
  mode,      // "at-mention", "compact", etc.
  options    // { offset, limit }
) {
  let { offset, limit } = options ?? {};
  let appState = await sessionContext.getAppState();

  // Check file permissions
  if (isFileBlocked(filePath, appState.toolPermissionContext)) {
    return null;
  }

  // Size check for @ mentions
  if (mode === "at-mention" && !isFileSizeAllowed(filePath)) {
    try {
      let stats = getFileSystem().statSync(filePath);
      recordTelemetry("tengu_attachment_file_too_large", {
        size_bytes: stats.size,
        mode: mode
      });
      return null;
    } catch {}
  }

  // Check cache for already-read files
  let cachedFile = sessionContext.readFileState.get(filePath);
  if (cachedFile && mode === "at-mention") {
    try {
      let modTime = getFileModificationTime(filePath);
      // If file hasn't changed since we cached it
      if (cachedFile.timestamp <= modTime && modTime === cachedFile.timestamp) {
        recordTelemetry(successTelemetryEvent, {});
        return {
          type: "already_read_file",
          filename: filePath,
          content: {
            type: "text",
            file: {
              filePath: filePath,
              content: cachedFile.content,
              numLines: cachedFile.content.split("\n").length,
              startLine: offset ?? 1,
              totalLines: cachedFile.content.split("\n").length
            }
          }
        };
      }
    } catch {}
  }

  // Full read via Read tool
  try {
    let result = await ReadTool.call({ file_path: filePath, offset, limit }, sessionContext);
    recordTelemetry(successTelemetryEvent, {});
    return {
      type: "file",
      filename: filePath,
      content: result.data
    };
  } catch (error) {
    recordTelemetry(failureTelemetryEvent, {});
    return null;
  }
}

// Mapping: TL0→processFileAttachment, nEA→isFileBlocked, U71→isFileSizeAllowed,
//          vA→getFileSystem, mz→getFileModificationTime, v5→ReadTool
```

**Key Insight: Cache-First Strategy**

The system caches file contents in `readFileState` to avoid re-reading unchanged files. This is especially important for:
- Large files that are referenced multiple times
- Files in compaction context (avoiding re-read during summarization)

### Custom File Suggestion Command

Users can configure a custom command for file suggestions:

```javascript
// Configuration in settings
{
  "fileSuggestion": {
    "type": "command",
    "command": "/path/to/custom-script"
  }
}

// The script receives query via stdin and returns newline-separated suggestions
```

---

## 2. Plan Mode Integration

### Plan File Reference Attachment

When in plan mode, the system injects the plan file content into the conversation context:

```javascript
// ============================================
// getPlanFileReference (xL0) - Create plan file attachment
// Location: chunks.132.mjs:688-697
// ============================================

// ORIGINAL (for source lookup):
function xL0(A) {
  let Q = AK(A);
  if (!Q) return null;
  let B = dC(A);
  return X4({
    type: "plan_file_reference",
    planFilePath: B,
    planContent: Q
  })
}

// READABLE (for understanding):
function getPlanFileReference(sessionContext) {
  // Get plan content from state
  let planContent = getPlanContent(sessionContext);
  if (!planContent) return null;

  // Get plan file path
  let planFilePath = getPlanFilePath(sessionContext);

  // Create attachment wrapper
  return createAttachment({
    type: "plan_file_reference",
    planFilePath: planFilePath,
    planContent: planContent
  });
}

// Mapping: xL0→getPlanFileReference, AK→getPlanContent, dC→getPlanFilePath,
//          X4→createAttachment
```

### Plan File in System Context

The plan file reference is converted to a system message during request building:

```javascript
// Location: chunks.148.mjs:77-87 (attachment → system message mapping)

// When processing "plan_file_reference" attachment:
{
  isMeta: true,  // Marks as internal system message
  content: `A plan file exists from plan mode at: ${planFilePath}

Plan contents:

${planContent}

If this plan is relevant...`
}
```

### File History Tracking in Plan Mode

Plan mode passes file history snapshots to track changes:

```javascript
// chunks.155.mjs:337
{
  initialFileHistorySnapshots: sessionState.fileHistorySnapshots
}
```

This enables:
- Tracking which files were modified during planning
- Potential rollback of file changes
- Accurate diff generation for plan review

---

## 3. System Reminder Integration

### Attachment Creation Wrapper

All attachments go through a standard wrapper:

```javascript
// ============================================
// createAttachment (X4) - Standard attachment wrapper
// Location: chunks.132.mjs:87-94
// ============================================

// ORIGINAL (for source lookup):
function X4(A) {
  return {
    attachment: A,
    type: "attachment",
    uuid: q27(),
    timestamp: new Date().toISOString()
  }
}

// READABLE (for understanding):
function createAttachment(attachmentData) {
  return {
    attachment: attachmentData,  // The actual attachment content
    type: "attachment",          // Message type marker
    uuid: generateUUID(),        // Unique identifier
    timestamp: new Date().toISOString()  // Creation time
  };
}

// Mapping: X4→createAttachment, q27→generateUUID
```

### Attachment Types

| Type | Source | Purpose |
|------|--------|---------|
| `file` | @ mention, Read tool | File content in context |
| `already_read_file` | Cached file | Previously read file (no re-read) |
| `compact_file_reference` | Compaction | Reference without full content |
| `plan_file_reference` | Plan mode | Plan content for context |
| `invoked_skills` | Skill system | Active skills list |
| `todo_reminder` | Todo system | Task list state |
| `task_status` | Background agents | Agent completion status |

### Invoked Skills Attachment

Skills that have been invoked are included in context:

```javascript
// ============================================
// getInvokedSkillsAttachment ($97) - Get active skills
// Location: chunks.132.mjs:699-711
// ============================================

// ORIGINAL (for source lookup):
function $97() {
  let A = zf0();
  if (A.size === 0) return null;
  let Q = Array.from(A.values()).sort((B, G) => G.invokedAt - B.invokedAt).map((B) => ({
    name: B.skillName,
    path: B.skillPath,
    content: B.content
  }));
  return X4({
    type: "invoked_skills",
    skills: Q
  })
}

// READABLE (for understanding):
function getInvokedSkillsAttachment() {
  let skillRegistry = getInvokedSkillsRegistry();

  if (skillRegistry.size === 0) return null;

  // Sort by invocation time (most recent first)
  let skills = Array.from(skillRegistry.values())
    .sort((a, b) => b.invokedAt - a.invokedAt)
    .map((skill) => ({
      name: skill.skillName,
      path: skill.skillPath,
      content: skill.content
    }));

  return createAttachment({
    type: "invoked_skills",
    skills: skills
  });
}

// Mapping: $97→getInvokedSkillsAttachment, zf0→getInvokedSkillsRegistry
```

---

## 4. Session State Integration

### ReadFileState Map

The session maintains a cache of read files:

```javascript
// Session context structure
{
  readFileState: Map<string, {
    content: string,      // File content
    timestamp: number     // Last modification time when read
  }>
}
```

### File History State

```javascript
// App state structure
{
  fileHistory: {
    snapshots: FileHistorySnapshot[],  // Checkpoints for rewind
    trackedFiles: Set<string>          // Files being tracked
  }
}
```

### State Synchronization

```javascript
// Location: chunks.154.mjs:912-915 - File history state binding
// Syncs fileHistory snapshots to app state
// Updated on session resume

// Location: chunks.154.mjs:920-932 - Session resume
// Restores file history snapshots from previous session
```

### Clear Command State Reset

```javascript
// ============================================
// clearCommand (IE1) - Reset file state on /clear
// Location: chunks.136.mjs:1907-1933
// ============================================

// Key operations:
// 1. Clear readFileState Map
// 2. Reset fileHistory snapshots
// 3. Clear FileIndex caches
// 4. Reset MCP state
```

---

## 5. MCP Auto-Search Integration

### Code Index MCP Pattern Detection

Claude Code automatically searches for code indexing MCP servers:

```javascript
// ============================================
// MCP Auto-Search Patterns
// Location: chunks.89.mjs:2666-2683
// ============================================

// ORIGINAL (for source lookup):
{
  pattern: /^code[-_]?index[-_]?mcp$/i,
  tool: "code-index-mcp"
}, {
  pattern: /^code[-_]?index$/i,
  tool: "code-index-mcp"
}, {
  pattern: /^local[-_]?code[-_]?search$/i,
  tool: "local-code-search"
}, {
  pattern: /^codebase$/i,
  tool: "autodev-codebase"
}, {
  pattern: /^autodev[-_]?codebase$/i,
  tool: "autodev-codebase"
}, {
  pattern: /^code[-_]?context$/i,
  tool: "claude-context"
}
```

**Supported MCP Server Patterns:**

| Pattern | Tool Name | Purpose |
|---------|-----------|---------|
| `code-index-mcp` | code-index-mcp | General code indexing |
| `code-index` | code-index-mcp | Short alias |
| `local-code-search` | local-code-search | Local search server |
| `codebase` | autodev-codebase | AutoDev integration |
| `autodev-codebase` | autodev-codebase | AutoDev integration |
| `code-context` | claude-context | Context server |

### Auto-Search Flow

```
1. User adds MCP server with matching name pattern
2. Claude Code detects pattern during server registration
3. Server tools are tagged for code indexing use
4. During file search, MCP tools may be preferred over built-in
```

---

## 6. Compaction Integration

### File Cache During Compaction

During compaction, file caches are handled specially:

```javascript
// Location: chunks.132.mjs:530-579

// 1. Copy file read state before compaction
let fileStateBackup = copyMap(sessionContext.readFileState);

// 2. Clear state to avoid stale references
sessionContext.readFileState.clear();

// 3. During compaction, files are referenced but not fully included
// Type: "compact_file_reference" instead of "file"

// 4. Micro-compaction cleans up unreferenced file cache entries
```

### Micro-Compaction File Cleanup

```javascript
// Location: chunks.132.mjs:1200-1210

// Identifies files referenced in tool calls
// Removes cached entries for files not in current messages
// Prevents memory buildup from accumulated file contents
```

### Compaction File Reference

Instead of including full file content during compaction:

```javascript
// When mode === "compact":
{
  type: "compact_file_reference",
  filename: filePath
  // No content - just a reference
}
```

This reduces token usage while maintaining context about which files were discussed.

---

## 7. Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Code Indexing module

### File Attachment Functions

- `processFileAttachment` (TL0) - Process @file mention
- `createAttachment` (X4) - Standard attachment wrapper
- `getPlanFileReference` (xL0) - Create plan file attachment
- `getInvokedSkillsAttachment` ($97) - Get active skills
- `getBackgroundTaskAttachments` (C97) - Get task status

### State Management Functions

- `clearAllCaches` (XE1) - Clear FileIndex caches
- `clearCommand` (IE1) - Handle /clear command

### MCP Integration

- MCP auto-search patterns in chunks.89.mjs:2660-2683
- Pattern-based tool detection for code indexing servers

### Telemetry Events

| Event | When Triggered |
|-------|----------------|
| `tengu_attachment_file_too_large` | File exceeds size limit |
| `tengu_code_indexing_tool_used` | Code indexing MCP tool invoked |
| `tengu_file_suggestions_git_ls_files` | Git-based file discovery |
| `tengu_file_suggestions_ripgrep` | Ripgrep-based file discovery |
| `tengu_tree_sitter_load` | Tree-sitter WASM loaded |

---

## Integration Diagram

```
+---------------------------------------------------------------------+
|                    Code Indexing Integration Map                      |
+---------------------------------------------------------------------+
|                                                                       |
|  +-----------------+     +------------------+     +----------------+  |
|  |   FileIndex     |     |   Tree-sitter    |     |   MCP Servers  |  |
|  | (File Suggest)  |     | (Bash Parsing)   |     | (Code Search)  |  |
|  +--------+--------+     +--------+---------+     +-------+--------+  |
|           |                       |                       |           |
|           v                       v                       v           |
|  +--------+--------+     +--------+---------+     +-------+--------+  |
|  | @ Mentions      |     | Bash Tool        |     | Auto-Search    |  |
|  | Tool Params     |     | Permission Check |     | Pattern Match  |  |
|  +--------+--------+     +--------+---------+     +-------+--------+  |
|           |                       |                       |           |
|           +-----------+-----------+-----------+-----------+           |
|                       |                                               |
|                       v                                               |
|           +-----------+------------+                                  |
|           |    Session State       |                                  |
|           |  - readFileState (Map) |                                  |
|           |  - fileHistory         |                                  |
|           +-----------+------------+                                  |
|                       |                                               |
|           +-----------+-----------+                                   |
|           |                       |                                   |
|           v                       v                                   |
|  +--------+--------+     +--------+--------+                         |
|  | System Reminder |     |   Plan Mode     |                         |
|  | - Attachments   |     | - Plan File Ref |                         |
|  | - Skills        |     | - File History  |                         |
|  +--------+--------+     +--------+--------+                         |
|           |                       |                                   |
|           +-----------+-----------+                                   |
|                       |                                               |
|                       v                                               |
|           +-----------+------------+                                  |
|           |      Compaction        |                                  |
|           | - Cache Backup/Clear   |                                  |
|           | - File References      |                                  |
|           +------------------------+                                  |
|                                                                       |
+---------------------------------------------------------------------+
```

---

## Summary

### Integration Points

| Module | Integration Type | Purpose |
|--------|-----------------|---------|
| Tools | Parameter autocomplete | File path suggestions |
| Plan Mode | Attachment injection | Plan file context |
| System Reminder | Attachment wrapping | Structured context |
| Session State | Cache management | File read optimization |
| MCP | Auto-search patterns | External indexing |
| Compaction | State cleanup | Memory management |

### Key Design Patterns

1. **Cache-First Reading** - Check readFileState before disk read
2. **Attachment Wrapping** - Standard format for all context items
3. **State Isolation** - Clear caches during compaction
4. **Pattern-Based Discovery** - MCP server auto-detection
5. **Telemetry Integration** - Track usage across all touchpoints

---

## Related Documentation

- [FileIndex File Path Autocomplete](./file_path_index.md) - File suggestion system
- [Tree-sitter Bash Parsing](./tree_sitter.md) - AST parsing system
