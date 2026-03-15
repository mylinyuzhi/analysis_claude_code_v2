# System Reminder Types: File & Directory Context

> **Module**: System Reminders - File/Directory Types
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.173.mjs:735-784`, `chunks.142.mjs:2199-2613`

---

## Table of Contents

- [Overview](#overview)
- [directory](#directory)
- [file](#file)
- [edited_text_file](#edited_text_file)
- [compact_file_reference](#compact_file_reference)
- [pdf_reference](#pdf_reference)
- [already_read_file](#already_read_file)
- [Trigger Conditions Summary](#trigger-conditions-summary)
- [Configuration](#configuration)

---

## Overview

File and directory context types inject file system information into the conversation. They are primarily triggered by:

1. **@-mentions** in user messages (`KIY` - extractAtMentionedFiles)
2. **File watching** for modified files (`wIY` - getChangedFilesAttachment)
3. **Compaction** recovery for large files

These types use the `_9` wrapper to wrap tool call/result message pairs in `<system-reminder>` tags.

---

## Trigger Source Summary

Each file context type has a specific producer function with distinct trigger conditions:

| Type | Producer Function | Location | Key Trigger Logic |
|------|-------------------|----------|-------------------|
| `directory` | `KIY` (extractAtMentionedFiles) | chunks.142.mjs:2199-2236 | @-mention + `statSync().isDirectory()` |
| `file` | `TyA` (loadFileAttachment) | chunks.142.mjs:2524-2613 | @-mention or internal + validation |
| `edited_text_file` | `wIY` (getChangedFilesAttachment) | chunks.142.mjs:2285-2335 | File watch: `modTime > cachedTimestamp` |
| `pdf_reference` | `GIY` (getPdfReferenceAttachment) | chunks.142.mjs:2503-2522 | `pageCount > PDF_MAX_PAGES` |
| `already_read_file` | `TyA` (loadFileAttachment) | chunks.142.mjs:2544-2563 | File in cache + timestamp match |

### File Validation Pipeline

The `file` type goes through a validation pipeline:

```javascript
// Location: chunks.142.mjs:2594-2605
let validation = await ReadTool.validateInput(input, sessionContext);
if (!validation.result) {
    if (validation.meta?.fileSize) {
        // File too large - return truncated version
        return await createTruncatedFileReference(filePath, sessionContext);
    }
    return null;
}
let result = await ReadTool.call(input, sessionContext);
```

### Diff Computation for edited_text_file

```javascript
// Location: chunks.142.mjs:2312
if (computeDiff(oldContent, newContent) === "") return null;
return {
    type: "edited_text_file",
    filename: absolutePath,
    snippet: computeDiff(oldContent, newContent)
};
```

The `DjA` function computes a unified diff snippet showing the changes between old and new content.

---

## directory

### What It Does

Provides a directory listing when the user @-mentions a directory path. This allows the LLM to see directory contents without explicitly running `ls`.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| @-mention path | User's message contains `@"path"` or `@path` |
| Path is directory | `statSync(path).isDirectory()` returns `true` |
| Permission check | Path is not denied by sandbox rules |

### Source Code

#### Producer Function

```javascript
// ============================================
// extractAtMentionedFiles - Directory handling
// Location: chunks.142.mjs:2199-2236
// ============================================

// ORIGINAL (for source lookup):
async function KIY(A, q) {
    let K = _IY(A);
    if (K.length > 0) u8("at-mentions");
    let Y = await q.getAppState();
    return (await Promise.all(K.map(async (w) => {
        try {
            let {
                filename: H,
                lineStart: $,
                lineEnd: O
            } = DIY(w), _ = g4(H);
            if (sW1(_, Y.toolPermissionContext)) return null;
            try {
                if (b1().statSync(_).isDirectory()) try {
                    let X = await qq.call({
                        command: `ls ${R7([_])}`,
                        description: `Lists files in ${_}`
                    }, q);
                    c("tengu_at_mention_extracting_directory_success", {});
                    let D = X.data.stdout;
                    return {
                        type: "directory",
                        path: _,
                        content: D
                    }
                } catch {
                    return null
                }
            } catch {}
            // ... file handling continues
        } catch {
            c("tengu_at_mention_extracting_filename_error", {})
        }
    }))).filter(Boolean)
}

// READABLE (for understanding):
async function extractAtMentionedFiles(userMessage, sessionContext) {
    let mentionedPaths = parseAtMentions(userMessage);
    if (mentionedPaths.length > 0) markAtMentionsUsed();

    let appState = await sessionContext.getAppState();

    return (await Promise.all(mentionedPaths.map(async (mentionedPath) => {
        try {
            let { filename, lineStart, lineEnd } = parseFilePathWithLineRange(mentionedPath);
            let absolutePath = resolvePath(filename);

            // Permission check
            if (isPathDisallowed(absolutePath, appState.toolPermissionContext)) {
                return null;
            }

            // Check if it's a directory
            try {
                if (fs.statSync(absolutePath).isDirectory()) {
                    try {
                        let result = await BashTool.call({
                            command: `ls ${shellEscape([absolutePath])}`,
                            description: `Lists files in ${absolutePath}`
                        }, sessionContext);

                        logTelemetry("tengu_at_mention_extracting_directory_success", {});

                        return {
                            type: "directory",
                            path: absolutePath,
                            content: result.data.stdout
                        };
                    } catch {
                        return null;
                    }
                }
            } catch {}

            // If not a directory, handle as file...
        } catch {
            logTelemetry("tengu_at_mention_extracting_filename_error", {});
        }
    }))).filter(Boolean);
}

// Mapping: KIY→extractAtMentionedFiles, A→userMessage, q→sessionContext, K→mentionedPaths, _IY→parseAtMentions, DIY→parseFilePathWithLineRange, g4→resolvePath, sW1→isPathDisallowed, b1→fs, R7→shellEscape, qq→BashTool
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - directory case
// Location: chunks.173.mjs:735-743
// ============================================

// ORIGINAL (for source lookup):
case "directory":
    return _9([pd1(qq.name, {
        command: `ls ${R7([A.path])}`,
        description: `Lists files in ${A.path}`
    }), Ud1(qq, {
        stdout: A.content,
        stderr: "",
        interrupted: !1
    })]);

// READABLE (for understanding):
case "directory":
    return wrapWithSystemReminderTags([
        createToolCallMessage(BashTool.name, {
            command: `ls ${shellEscape([attachment.path])}`,
            description: `Lists files in ${attachment.path}`
        }),
        createToolResultMessage(BashTool, {
            stdout: attachment.content,
            stderr: "",
            interrupted: false
        })
    ]);

// Mapping: _9→wrapWithSystemReminderTags, pd1→createToolCallMessage, Ud1→createToolResultMessage, qq→BashTool, R7→shellEscape, A→attachment
```

### Output Format

```markdown
<system-reminder>
Tool name: Bash
Parameters: {"command": "ls '/path/to/directory'", "description": "Lists files in /path/to/directory"}

Result of calling the Bash tool: file1.txt
file2.js
subdir/
</system-reminder>
```

---

## file

### What It Does

Injects file contents when the user @-mentions a file. Supports multiple content types:
- `text` - Regular text files
- `image` - Image files (PNG, JPG, etc.)
- `notebook` - Jupyter notebooks (.ipynb)
- `pdf` - PDF documents (small ones only)

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| @-mention path | User's message contains `@"path"` or `@path` |
| Path is file | Not a directory |
| Permission check | Path is not denied by sandbox rules |
| Size check | Under MAX_FILE_LINES for text files |

### Source Code

#### Producer Function (partial)

```javascript
// ============================================
// loadFileAttachment - Load file content as attachment
// Location: chunks.142.mjs:2524-2613
// ============================================

// ORIGINAL (for source lookup):
async function TyA(A, q, K, Y, z, w) {
    let {
        offset: H,
        limit: $
    } = w ?? {}, O = await q.getAppState();
    if (sW1(A, O.toolPermissionContext)) return null;
    // ... validation and special handling ...
    try {
        let J = {
            file_path: A,
            offset: H,
            limit: $
        };
        // ... compact file reference handling ...
        let D = await i5.validateInput(J, q);
        if (!D.result) {
            if (D.meta?.fileSize) return await X();  // Too large
            return null;
        }
        try {
            let j = await i5.call(J, q);
            return c(K, {}), {
                type: "file",
                filename: A,
                content: j.data
            }
        } catch (j) {
            if (j instanceof qG6) return await X();  // File too large
            throw j
        }
    } catch {
        return c(Y, {}), null
    }
}

// READABLE (for understanding):
async function loadFileAttachment(filePath, sessionContext, successEvent, errorEvent, mode, options) {
    let { offset, limit } = options ?? {};
    let appState = await sessionContext.getAppState();

    // Permission check
    if (isPathDisallowed(filePath, appState.toolPermissionContext)) {
        return null;
    }

    // ... special handling for at-mention mode, PDF references, etc. ...

    try {
        let input = {
            file_path: filePath,
            offset: offset,
            limit: limit
        };

        // Validate input
        let validation = await ReadTool.validateInput(input, sessionContext);
        if (!validation.result) {
            if (validation.meta?.fileSize) {
                // File too large - return compact reference
                return await createCompactFileReference(filePath, sessionContext);
            }
            return null;
        }

        try {
            let result = await ReadTool.call(input, sessionContext);
            logTelemetry(successEvent, {});

            return {
                type: "file",
                filename: filePath,
                content: result.data
            };
        } catch (error) {
            if (error instanceof FileTooLargeError) {
                return await createCompactFileReference(filePath, sessionContext);
            }
            throw error;
        }
    } catch {
        logTelemetry(errorEvent, {});
        return null;
    }
}

// Mapping: TyA→loadFileAttachment, A→filePath, q→sessionContext, K→successEvent, Y→errorEvent, z→mode, w→options, H→offset, $→limit, i5→ReadTool, qG6→FileTooLargeError
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - file case
// Location: chunks.173.mjs:750-773
// ============================================

// ORIGINAL (for source lookup):
case "file": {
    let K = A.content;
    switch (K.type) {
        case "image":
            return _9([pd1(i5.name, {
                file_path: A.filename
            }), Ud1(i5, K)]);
        case "text":
            return _9([pd1(i5.name, {
                file_path: A.filename
            }), Ud1(i5, K), ...A.truncated ? [c6({
                content: `Note: The file ${A.filename} was too large and has been truncated to the first ${AC1} lines. Don't tell the user about this truncation. Use ${i5.name} to read more of the file if you need.`,
                isMeta: !0
            })] : []]);
        case "notebook":
            return _9([pd1(i5.name, {
                file_path: A.filename
            }), Ud1(i5, K)]);
        case "pdf":
            return _9([pd1(i5.name, {
                file_path: A.filename
            }), Ud1(i5, K)])
    }
    break
}

// READABLE (for understanding):
case "file": {
    let content = attachment.content;

    switch (content.type) {
        case "image":
            return wrapWithSystemReminderTags([
                createToolCallMessage(ReadTool.name, {
                    file_path: attachment.filename
                }),
                createToolResultMessage(ReadTool, content)
            ]);

        case "text":
            let messages = [
                createToolCallMessage(ReadTool.name, {
                    file_path: attachment.filename
                }),
                createToolResultMessage(ReadTool, content)
            ];

            // Add truncation notice if file was truncated
            if (attachment.truncated) {
                messages.push(createUserMessage({
                    content: `Note: The file ${attachment.filename} was too large and has been truncated to the first ${MAX_FILE_LINES} lines. Don't tell the user about this truncation. Use ${ReadTool.name} to read more of the file if you need.`,
                    isMeta: true
                }));
            }

            return wrapWithSystemReminderTags(messages);

        case "notebook":
            return wrapWithSystemReminderTags([
                createToolCallMessage(ReadTool.name, {
                    file_path: attachment.filename
                }),
                createToolResultMessage(ReadTool, content)
            ]);

        case "pdf":
            return wrapWithSystemReminderTags([
                createToolCallMessage(ReadTool.name, {
                    file_path: attachment.filename
                }),
                createToolResultMessage(ReadTool, content)
            ]);
    }
    break;
}

// Mapping: A→attachment, K→content, i5→ReadTool, AC1→MAX_FILE_LINES, _9→wrapWithSystemReminderTags, pd1→createToolCallMessage, Ud1→createToolResultMessage, c6→createUserMessage
```

### Output Format (Text File)

```markdown
<system-reminder>
Tool name: Read
Parameters: {"file_path": "/path/to/file.js"}

Result of calling the Read tool: {"type": "text", "file": {"filePath": "/path/to/file.js", "content": "// file content here...", ...}}
</system-reminder>
```

### Output Format (Truncated Text File)

```markdown
<system-reminder>
Tool name: Read
Parameters: {"file_path": "/path/to/large-file.js"}

Result of calling the Read tool: {"type": "text", "file": {...}}
</system-reminder>

<system-reminder>
Note: The file /path/to/large-file.js was too large and has been truncated to the first 2000 lines. Don't tell the user about this truncation. Use Read to read more of the file if you need.
</system-reminder>
```

---

## edited_text_file

### What It Does

Notifies the LLM when a watched file has been modified externally (by user or linter). Shows a diff snippet of the changes.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| File in watch list | `readFileState.has(path)` |
| File modified | `getMtime(path) > storedTimestamp` |
| Content changed | Diff is non-empty |
| Permission check | Path not denied |

### Source Code

#### Producer Function

```javascript
// ============================================
// getChangedFilesAttachment - Detect and produce file change attachments
// Location: chunks.142.mjs:2285-2335
// ============================================

// ORIGINAL (for source lookup):
async function wIY(A) {
    let q = await A.getAppState();
    return (await Promise.all(Th(A.readFileState).map(async (Y) => {
        let z = A.readFileState.get(Y);
        if (!z) return null;
        if (z.offset !== void 0 || z.limit !== void 0) return null;
        let w = g4(Y);
        if (sW1(w, q.toolPermissionContext)) return null;
        try {
            if (aW(w) <= z.timestamp) return null;
            let H = {
                file_path: w
            };
            if (!(await i5.validateInput(H, A)).result) return null;
            let O = await i5.call(H, A),
                _ = A.agentId ?? U6();
            if (w === Lp(_)) {
                if (!A.options.tools.some((X) => X.name === cg)) return null;
                let J = UB(_);
                return {
                    type: "todo",
                    content: J,
                    itemCount: J.length,
                    context: "file-watch"
                }
            }
            if (O.data.type === "text") {
                if (DjA(z.content, O.data.file.content) === "") return null;
                return {
                    type: "edited_text_file",
                    filename: w,
                    snippet: DjA(z.content, O.data.file.content)
                }
            }
            // ... image handling ...
        } catch {
            return c("tengu_watched_file_stat_error", {}), null
        }
    }))).filter((Y) => Y !== null)
}

// READABLE (for understanding):
async function getChangedFilesAttachment(sessionContext) {
    let appState = await sessionContext.getAppState();

    return (await Promise.all(
        getWatchedFilePaths(sessionContext.readFileState).map(async (filePath) => {
            let cachedFile = sessionContext.readFileState.get(filePath);
            if (!cachedFile) return null;

            // Skip partial reads (with offset/limit)
            if (cachedFile.offset !== undefined || cachedFile.limit !== undefined) {
                return null;
            }

            let absolutePath = resolvePath(filePath);

            // Permission check
            if (isPathDisallowed(absolutePath, appState.toolPermissionContext)) {
                return null;
            }

            try {
                // Check if file was modified
                if (getMtime(absolutePath) <= cachedFile.timestamp) {
                    return null;  // No change
                }

                let input = { file_path: absolutePath };

                // Validate
                let validation = await ReadTool.validateInput(input, sessionContext);
                if (!validation.result) return null;

                let result = await ReadTool.call(input, sessionContext);
                let agentId = sessionContext.agentId ?? getSessionId();

                // Special case: todo file changed
                if (absolutePath === getTodoFilePath(agentId)) {
                    if (!sessionContext.options.tools.some(t => t.name === TodoWriteTool.name)) {
                        return null;
                    }
                    let todoContent = loadTodoFile(agentId);
                    return {
                        type: "todo",
                        content: todoContent,
                        itemCount: todoContent.length,
                        context: "file-watch"
                    };
                }

                // Text file changed - compute diff
                if (result.data.type === "text") {
                    let diff = computeDiff(cachedFile.content, result.data.file.content);
                    if (diff === "") return null;  // No actual changes

                    return {
                        type: "edited_text_file",
                        filename: absolutePath,
                        snippet: diff
                    };
                }

                // ... image handling ...
            } catch {
                logTelemetry("tengu_watched_file_stat_error", {});
                return null;
            }
        })
    )).filter(result => result !== null);
}

// Mapping: wIY→getChangedFilesAttachment, A→sessionContext, q→appState, Y→filePath, z→cachedFile, w→absolutePath, g4→resolvePath, sW1→isPathDisallowed, aW→getMtime, i5→ReadTool, DjA→computeDiff, Th→getWatchedFilePaths, Lp→getTodoFilePath, UB→loadTodoFile, cg→TodoWriteTool
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - edited_text_file case
// Location: chunks.173.mjs:744-749
// ============================================

// ORIGINAL (for source lookup):
case "edited_text_file":
    return _9([c6({
        content: `Note: ${A.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
${A.snippet}`,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "edited_text_file":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `Note: ${attachment.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
${attachment.snippet}`,
            isMeta: true
        })
    ]);

// Mapping: _9→wrapWithSystemReminderTags, c6→createUserMessage, A→attachment
```

### Output Format

```markdown
<system-reminder>
Note: /path/to/file.js was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):

  10 | function newFunction() {
  11 |   return true;
  12 | }
</system-reminder>
```

---

## compact_file_reference

### What It Does

Provides a reference to a file that was read before compaction but is too large to include in the compacted context. Tells the LLM to re-read if needed.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Compaction mode | Called from compact context |
| File too large | Exceeds size limits for inclusion |

### Source Code

#### Production (from loadFileAttachment)

```javascript
// ============================================
// loadFileAttachment - Compact file reference creation
// Location: chunks.142.mjs:2570-2592
// ============================================

// Inside the compact handling path:
async function X() {
    if (z === "compact") return {
        type: "compact_file_reference",
        filename: A
    };
    // ... fallback for other modes ...
}

// READABLE:
async function createCompactFileReference() {
    if (mode === "compact") {
        return {
            type: "compact_file_reference",
            filename: filePath
        };
    }
    // ... fallback for other modes ...
}
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - compact_file_reference case
// Location: chunks.173.mjs:775-779
// ============================================

// ORIGINAL (for source lookup):
case "compact_file_reference":
    return _9([c6({
        content: `Note: ${A.filename} was read before the last conversation was summarized, but the contents are too large to include. Use ${i5.name} tool if you need to access it.`,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "compact_file_reference":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `Note: ${attachment.filename} was read before the last conversation was summarized, but the contents are too large to include. Use ${ReadTool.name} tool if you need to access it.`,
            isMeta: true
        })
    ]);

// Mapping: _9→wrapWithSystemReminderTags, c6→createUserMessage, A→attachment, i5→ReadTool
```

### Output Format

```markdown
<system-reminder>
Note: /path/to/large-file.js was read before the last conversation was summarized, but the contents are too large to include. Use Read tool if you need to access it.
</system-reminder>
```

---

## pdf_reference

### What It Does

Notifies the LLM about a large PDF file that cannot be read entirely. Instructs to use the Read tool with `pages` parameter for batch reading.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| @-mention | User mentions a PDF file |
| Large PDF | Page count > threshold or file size > threshold |
| PDF extension | `.pdf` extension detected |

### Source Code

#### Producer Function

```javascript
// ============================================
// createPdfReferenceAttachment - Create PDF reference for large PDFs
// Location: chunks.142.mjs:2503-2522
// ============================================

// ORIGINAL (for source lookup):
async function GIY(A) {
    let q = tW6(A).ext.toLowerCase();
    if (!s81(q)) return null;
    try {
        let K = b1().statSync(A),
            Y = await sW6(A),
            z = Y ?? Math.ceil(K.size / 102400);
        if (z > gz6) return c("tengu_pdf_reference_attachment", {
            pageCount: z,
            fileSize: K.size,
            hadPdfinfo: Y !== null
        }), {
            type: "pdf_reference",
            filename: A,
            pageCount: z,
            fileSize: K.size
        }
    } catch {}
    return null
}

// READABLE (for understanding):
async function createPdfReferenceAttachment(filePath) {
    let ext = parsePath(filePath).ext.toLowerCase();

    // Check if it's a PDF extension
    if (!isPdfExtension(ext)) return null;

    try {
        let stats = fs.statSync(filePath);
        let pageCount = await getPdfPageCount(filePath);

        // Fallback: estimate from file size (1 page per 100KB)
        if (pageCount === null) {
            pageCount = Math.ceil(stats.size / 102400);
        }

        // If PDF is too large, create reference instead of reading
        if (pageCount > MAX_PDF_PAGES) {
            logTelemetry("tengu_pdf_reference_attachment", {
                pageCount: pageCount,
                fileSize: stats.size,
                hadPdfinfo: pageCount !== null
            });

            return {
                type: "pdf_reference",
                filename: filePath,
                pageCount: pageCount,
                fileSize: stats.size
            };
        }
    } catch {}

    return null;
}

// Mapping: GIY→createPdfReferenceAttachment, A→filePath, q→ext, K→stats, Y→pageCount, z→actualPageCount, s81→isPdfExtension, sW6→getPdfPageCount, gz6→MAX_PDF_PAGES, b1→fs, tW6→parsePath
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - pdf_reference case
// Location: chunks.173.mjs:780-784
// ============================================

// ORIGINAL (for source lookup):
case "pdf_reference":
    return _9([c6({
        content: `PDF file: ${A.filename} (${A.pageCount} pages, ${L2(A.fileSize)}). This PDF is too large to read all at once. You MUST use the ${Jq} tool with the pages parameter to read specific page ranges (e.g., pages: "1-5"). Do NOT call ${Jq} without the pages parameter or it will fail. Start by reading the first few pages to understand the structure, then read more as needed. Maximum 20 pages per request.`,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "pdf_reference":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `PDF file: ${attachment.filename} (${attachment.pageCount} pages, ${formatBytes(attachment.fileSize)}). This PDF is too large to read all at once. You MUST use the ${ReadTool.name} tool with the pages parameter to read specific page ranges (e.g., pages: "1-5"). Do NOT call ${ReadTool.name} without the pages parameter or it will fail. Start by reading the first few pages to understand the structure, then read more as needed. Maximum 20 pages per request.`,
            isMeta: true
        })
    ]);

// Mapping: _9→wrapWithSystemReminderTags, c6→createUserMessage, A→attachment, L2→formatBytes, Jq→ReadTool
```

### Output Format

```markdown
<system-reminder>
PDF file: /path/to/document.pdf (50 pages, 5.2MB). This PDF is too large to read all at once. You MUST use the Read tool with the pages parameter to read specific page ranges (e.g., pages: "1-5"). Do NOT call Read without the pages parameter or it will fail. Start by reading the first few pages to understand the structure, then read more as needed. Maximum 20 pages per request.
</system-reminder>
```

---

## already_read_file

### What It Does

**Silent type** - Returns empty array from normalization. Used only for UI visibility state to indicate a file was already read and hasn't changed.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| @-mention | User @-mentions a file |
| File in cache | File exists in `readFileState` |
| Not modified | `timestamp <= mtime && mtime === timestamp` |

### Source Code

#### Producer Function

```javascript
// ============================================
// loadFileAttachment - already_read_file case
// Location: chunks.142.mjs:2545-2563
// ============================================

// ORIGINAL (for source lookup):
let _ = q.readFileState.get(A);
if (_ && z === "at-mention") try {
    let J = aW(A);
    if (_.timestamp <= J && J === _.timestamp) return c(K, {}), {
        type: "already_read_file",
        filename: A,
        content: {
            type: "text",
            file: {
                filePath: A,
                content: _.content,
                numLines: _.content.split(`
`).length,
                startLine: H ?? 1,
                totalLines: _.content.split(`
`).length
            }
        }
    }
} catch {}

// READABLE (for understanding):
let cachedFile = sessionContext.readFileState.get(filePath);
if (cachedFile && mode === "at-mention") {
    try {
        let mtime = getMtime(filePath);

        // Check if file is unchanged
        if (cachedFile.timestamp <= mtime && mtime === cachedFile.timestamp) {
            logTelemetry(successEvent, {});

            return {
                type: "already_read_file",
                filename: filePath,
                content: {
                    type: "text",
                    file: {
                        filePath: filePath,
                        content: cachedFile.content,
                        numLines: cachedFile.content.split('\n').length,
                        startLine: offset ?? 1,
                        totalLines: cachedFile.content.split('\n').length
                    }
                }
            };
        }
    } catch {}
}
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - already_read_file case (silent)
// Location: chunks.173.mjs:1118
// ============================================

// ORIGINAL (for source lookup):
case "already_read_file":
// ... falls through to return []

// READABLE (for understanding):
case "already_read_file":
    return [];  // Silent - no message produced
```

### Key Insight

The `already_read_file` type is produced but produces no API message. It exists to:
1. Track that the file was mentioned (for UI state)
2. Prevent redundant file reads
3. Indicate the file content is still valid

---

## Trigger Conditions Summary

| Type | Primary Trigger | Permission Check | Size Limits |
|------|-----------------|------------------|-------------|
| `directory` | @-mention directory | Yes | None |
| `file` | @-mention file | Yes | MAX_FILE_LINES |
| `edited_text_file` | File watch change | Yes | None |
| `compact_file_reference` | Compaction | N/A | Large files only |
| `pdf_reference` | @-mention large PDF | Yes | > MAX_PDF_PAGES |
| `already_read_file` | @-mention unchanged | Yes | N/A |

---

## Configuration

### Constants

```javascript
// ============================================
// File attachment constants
// Location: chunks.142.mjs:2857-2863
// ============================================

// MAX_FILE_LINES - Maximum lines for text file attachment
AC1 = 2000

// MAX_PDF_PAGES - Maximum pages to read directly (reference larger PDFs)
gz6 = 20  // (estimated from context)
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | Disables all attachment production |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:

- `extractAtMentionedFiles` (KIY) - @-mention file extractor, `chunks.142.mjs:2199-2236`
- `loadFileAttachment` (TyA) - File content loader, `chunks.142.mjs:2524-2613`
- `getChangedFilesAttachment` (wIY) - File change detector, `chunks.142.mjs:2285-2335`
- `createPdfReferenceAttachment` (GIY) - PDF reference creator, `chunks.142.mjs:2503-2522`
- `parseAtMentions` (_IY) - @-mention parser, `chunks.142.mjs:2397-2408`
- `parseFilePathWithLineRange` (DIY) - Path with line range parser, `chunks.142.mjs:2429-2440`
- `computeDiff` (DjA) - Diff computation
- `getMtime` (aW) - Get file modification time
- `MAX_FILE_LINES` (AC1) - Line limit constant
- `ReadTool` (i5) - Read tool reference

---

## Related Documents

- [README.md](./README.md) - Documentation index
- [implementation_details.md](./implementation_details.md) - Core implementation
- [types_silent.md](./types_silent.md) - Silent types including already_read_file