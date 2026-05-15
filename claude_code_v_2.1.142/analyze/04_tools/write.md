# Write Tool — v2.1.142

## Overview

`FileWriteTool` (`Yw` in cli_inner_pretty.js:359972) is the full-file replacement tool. It overwrites an existing file with new content (or creates a new file). It enforces a Read-before-Write gate identical to Edit's, atomic read-modify-write semantics, and integrates with LSP `didChange`/`didSave`, VS Code diff notification, and file history. Compared to Edit, it ships *all* the content rather than a diff — preferring Edit for partial changes is built into the prompt.

## Schema (Zod)

```javascript
// ============================================
// fileWriteInputSchema — FileWriteTool input parameters
// Location: cli_inner_pretty.js:359952-359957 / sn_() at runtime
// ============================================

// ORIGINAL (for source lookup):
// sn_() returns z.strictObject({ file_path, content })

// READABLE (for understanding):
const fileWriteInputSchema = z.strictObject({
  file_path: z.string().describe('The absolute path to the file to write (must be absolute, not relative)'),
  content: z.string().describe('The content to write to the file'),
});

// Mapping: sn_→fileWriteInputSchema
```

Output schema (`tn_()`) carries:
- `type: 'create' | 'update'`
- `filePath: string`
- `content: string`
- `structuredPatch: Hunk[]`
- `originalFile: string | null` — null for new file creation
- `gitDiff?: ToolUseDiff` — optional, fetched if `CLAUDE_CODE_REMOTE`
- `userModified?: boolean` — true when the user edited the proposed content in the permission dialog before accepting

`maxResultSizeChars` is **100,000**.

The `stripForStorage` override is more aggressive than Edit's: for `type === 'update'`, it sets `content` to `""` and `originalFile` to `null` (only when both are non-empty). Without this, the entire pre-write + post-write content would be re-serialised into every transcript snapshot.

## validateInput

```javascript
// ============================================
// validateInput — Read-before-Write gate + sensitive pattern check + UNC bypass
// Location: cli_inner_pretty.js (validateInput on Yw, mirrors src/tools/FileWriteTool/FileWriteTool.ts:153-222)
// ============================================

// ORIGINAL (for source lookup):
// async validateInput({ file_path, content }, toolUseContext) {
//   const fullFilePath = expandPath(file_path);
//   const teamMemErr = checkTeamMemSecrets(fullFilePath, content); if (teamMemErr) return { ..., errorCode: 12 };
//   const secretErr = checkSensitivePatterns(fullFilePath, content); if (secretErr) return { ..., errorCode: 0 };
//   /* deny rule + UNC bypass + stat (mtime + size + mode) + Read-before-Write gate + staleness check */
// }

// READABLE (for understanding):
async function validateInput({ file_path, content }, toolUseContext) {
  const fullFilePath = expandPath(file_path);

  // (1) Subagent secret-write guard
  const teamMemError = checkTeamMemSecrets(fullFilePath, toolUseContext.agentId);
  if (teamMemError) return { result: false, message: teamMemError, errorCode: 12 };

  // (2) Sensitive-pattern guard (any path)
  const secretError = checkSensitivePatterns(fullFilePath, content);
  if (secretError) return { result: false, message: secretError, errorCode: 0 };

  // (3) Deny-rule check
  const appState = toolUseContext.getAppState();
  if (matchingRuleForInput(fullFilePath, appState.toolPermissionContext, 'edit', 'deny') !== null) {
    return { result: false, message: 'File is in a directory that is denied by your permission settings.', errorCode: 1 };
  }

  // (4) UNC bypass
  if (fullFilePath.startsWith('\\\\') || fullFilePath.startsWith('//')) return { result: true };

  // (5) Stat — also captures mtime for staleness check below
  const fs = getFsImplementation();
  let fileMtimeMs;
  try {
    const fileStat = await fs.stat(fullFilePath);
    fileMtimeMs = fileStat.mtimeMs;
    // Read-only mode check (chmod) lives in the same `stat`
    if (isModeRestricted(fileStat.mode)) return { result: false, message: FILE_READ_ONLY_ERROR_MESSAGE, errorCode: 11 };
  } catch (e) {
    if (isENOENT(e)) return { result: true }; // file doesn't exist — creation is allowed
    throw e;
  }

  // (6) Read-before-Write gate
  const readTimestamp = toolUseContext.readFileState.get(fullFilePath);
  if (!readTimestamp || readTimestamp.isPartialView) {
    return { result: false, message: 'File has not been read yet. Read it first before writing to it.', errorCode: 2 };
  }

  // (7) Staleness check (reusing the mtime from stat above, no redundant statSync)
  const lastWriteTime = Math.floor(fileMtimeMs);
  if (lastWriteTime > readTimestamp.timestamp) {
    return { result: false, message: 'File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.', errorCode: 3 };
  }

  return { result: true };
}

// Mapping: standard imports — checkTeamMemSecrets (dnH), checkSensitivePatterns (kY8),
//          matchingRuleForInput (yL), expandPath (eq), isENOENT (f8),
//          isModeRestricted (QRH), FILE_READ_ONLY_ERROR_MESSAGE (gRH).
```

### Why the `isPartialView` exclusion?

A partial read (offset+limit) is *not* a substitute for a full read for write purposes. If the model only saw lines 100-150 of a 500-line file, sending a `Write` with new content would destroy lines 1-99 and 151-500. The gate forces the model to do a full read first.

### Why reuse `fileMtimeMs` from `stat`?

Pre-2.1.110 the code did `await fs.stat(...)` and then a separate `getFileModificationTime(fullFilePath)` (which does its own `statSync`). The reuse pattern eliminates the redundant sync stat call inside the validate path. Real win on Windows where stat can be relatively slow.

## checkPermissions

Identical to FileEditTool's: `checkWritePermissionForTool` with the same wildcard matcher.

```javascript
async function checkPermissions(input, context) {
  return checkWritePermissionForTool(FileWriteTool, input, context.getAppState().toolPermissionContext);
}
```

## call

```javascript
// ============================================
// FileWriteTool.call — atomic write + LSP didChange/didSave + VSCode notify + git diff
// Location: cli_inner_pretty.js (call on Yw, mirrors src/tools/FileWriteTool/FileWriteTool.ts:223-417)
// ============================================

// ORIGINAL (for source lookup):
// async call({ file_path, content }, { readFileState, updateFileHistoryState, dynamicSkillDirTriggers }, _, parentMessage) {
//   /* (1) skill-dir discovery, (2) diagnostic before-edit, (3) ensure parent dir + history backup,
//      (4) atomic read-and-write: readFileSyncWithMetadata → staleness check → writeTextContent,
//      (5) LSP didChange/didSave + clear diagnostics, (6) VS Code notify, (7) update readFileState,
//      (8) telemetry, (9) optional git diff fetch */
// }

// READABLE (for understanding):
async function call({ file_path, content }, context, _, parentMessage) {
  const { readFileState, updateFileHistoryState, dynamicSkillDirTriggers } = context;
  const fullFilePath = expandPath(file_path);
  const dir = dirname(fullFilePath);

  // (1) Skill discovery (fire-and-forget, even in CLAUDE_CODE_SIMPLE mode? — see Edit, this tool runs it unconditionally)
  const newSkillDirs = await discoverSkillDirsForPaths([fullFilePath], getCwd());
  for (const d of newSkillDirs) dynamicSkillDirTriggers?.add(d);
  addSkillDirectories(newSkillDirs).catch(() => {});
  activateConditionalSkillsForPaths([fullFilePath], getCwd());

  // (2) LSP diagnostic tracker
  await diagnosticTracker.beforeFileEdited(fullFilePath);

  // (3) Parent dir + history backup OUTSIDE critical section
  await getFsImplementation().mkdir(dir);
  if (fileHistoryEnabled()) {
    await fileHistoryTrackEdit(updateFileHistoryState, fullFilePath, parentMessage.uuid);
  }

  // (4) Atomic read-and-write (no awaits between staleness check and writeTextContent)
  let meta = null;
  try {
    meta = readFileSyncWithMetadata(fullFilePath);
  } catch (e) {
    if (!isENOENT(e)) throw e;
  }
  if (meta !== null) {
    const lastWriteTime = getFileModificationTime(fullFilePath);
    const lastRead = readFileState.get(fullFilePath);
    if (!lastRead || lastWriteTime > lastRead.timestamp) {
      const isFullRead = lastRead && lastRead.offset === undefined && lastRead.limit === undefined;
      // meta.content is CRLF-normalized — matches readFileState's normalized form
      if (!isFullRead || meta.content !== lastRead.content) {
        throw new Error(FILE_UNEXPECTEDLY_MODIFIED_ERROR);
      }
    }
  }
  const enc = meta?.encoding ?? 'utf8';
  const oldContent = meta?.content ?? null;

  // (5) Write — line endings explicitly 'LF', NOT preserved
  writeTextContent(fullFilePath, content, enc, 'LF');

  // (6) LSP didChange/didSave
  const lspManager = getLspServerManager();
  if (lspManager) {
    clearDeliveredDiagnosticsForFile(`file://${fullFilePath}`);
    lspManager.changeFile(fullFilePath, content).catch(/* swallow + log */);
    lspManager.saveFile(fullFilePath).catch(/* swallow + log */);
  }

  // (7) VS Code notify
  notifyVscodeFileUpdated(fullFilePath, oldContent, content);

  // (8) Update readFileState — invalidate stale future writes
  readFileState.set(fullFilePath, { content, timestamp: getFileModificationTime(fullFilePath), offset: undefined, limit: undefined });

  // (9) Telemetry
  if (fullFilePath.endsWith(`${sep}CLAUDE.md`)) logEvent('tengu_write_claudemd', {});

  // (10) Optional git diff fetch
  let gitDiff;
  if (isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) && getFeatureValue_CACHED_MAY_BE_STALE('tengu_quartz_lantern', false)) {
    const diff = await fetchSingleFileGitDiff(fullFilePath);
    if (diff) gitDiff = diff;
  }

  // (11) Return create vs update
  if (oldContent) {
    const patch = getPatchForDisplay({ filePath: file_path, fileContents: oldContent, edits: [{ old_string: oldContent, new_string: content, replace_all: false }] });
    countLinesChanged(patch);
    logFileOperation({ operation: 'write', tool: 'FileWriteTool', filePath: fullFilePath, type: 'update' });
    return { data: { type: 'update', filePath: file_path, content, structuredPatch: patch, originalFile: oldContent, ...(gitDiff && { gitDiff }) } };
  }
  countLinesChanged([], content);
  logFileOperation({ operation: 'write', tool: 'FileWriteTool', filePath: fullFilePath, type: 'create' });
  return { data: { type: 'create', filePath: file_path, content, structuredPatch: [], originalFile: null, ...(gitDiff && { gitDiff }) } };
}

// Mapping: standard imports.
```

### Key algorithm: line-ending policy ("LF, period")

**What it does:** Always write `\n` line endings, even on Windows or when overwriting a CRLF file.

**How it works:** The fifth parameter to `writeTextContent` is hard-coded `'LF'`.

**Why this approach:** Pre-2.1.x, the tool preserved the old file's line endings or sampled the repo (via `rg`) for new files. This silently corrupted bash scripts with `\r` on Linux when overwriting a CRLF file. It also poisoned-on-binaries-in-cwd: a stray `*.exe` in the project would shift the repo "sample" to CRLF and break newly-written shell scripts.

**Decision rationale:** Write is a *full content replacement*. The model explicitly chose what line endings to send. The tool should honour them. If the model wants CRLF, it includes `\r\n` in `content`. The tool just writes what it's given (after coercing the surface to LF — actually wait, this isn't quite right. Let me re-read.)

Looking again: the comment in source says "Write is a full content replacement — the model sent explicit line endings in `content` and meant them. Do not rewrite them." Yet the call to `writeTextContent` passes `'LF'` as the endings parameter. Resolution: `writeTextContent`'s `'LF'` parameter is a default for the *normalisation pass* it does on content before writing. With `'LF'` it's a no-op (content is written as-is). If `'CRLF'` were passed, `writeTextContent` would re-normalise content's `\n` to `\r\n`. Effectively: "don't touch what the model sent."

### Diff-edit gate

For partial changes, the prompt directs the model to use Edit (which only sends the diff). Write should be used for new files or complete rewrites. This is enforced socially (prompt language) rather than mechanically — the model can still write a small diff via Write, but doing so wastes tokens.

### Line-write display (v2.1.105)

The result UI shows line counts for both create (`Created X with N lines`) and update (`Updated X with N additions, M removals`) modes. `countLinesChanged` tracks adds/removes from the structured patch. Pre-2.1.105 the display was inconsistent between create and update branches.

### IDE-edit content notice (v2.1.110)

If the user edits the proposed content in the IDE's permission dialog before accepting, the tool receives `userModified: true` as a context flag. The result message appends "The user modified your proposed changes before accepting them." so the model knows what's actually on disk may not match what it sent. Added in v2.1.110 to fix the case where an IDE-edited write silently differed from the model's content.

## Render methods

- `renderToolUseMessage` (`pp7`) — `Write(path)` chrome with content preview.
- `renderToolResultMessage` (`gp7`) — create branch shows syntax-highlighted content (`HighlightedCode`); update branch shows a unified diff.
- `renderToolUseRejectedMessage` (`Up7`) — for permission rejections.
- `renderToolUseErrorMessage` (`Fp7`) — for validateInput failures.
- `isResultTruncated` (`Bp7`) — UI predicate: true when content exceeds the inline preview cap; user can click "+N lines" to expand.

`extractSearchText` returns `""` for the same under-count reason as Read: the create mode shows highlighted content, the update mode shows a structured diff, neither benefits from full-string indexing (the file_path is already in tool_use).

`mapToolResultToToolResultBlockParam` is minimal:
- `create` → "File created successfully at: {filePath}"
- `update` → "The file {filePath} has been updated successfully."

The diff/content viewing is for the UI; the model just gets a confirmation. The new content is already in context (the model sent it).

`inputsEquivalent`: two consecutive Write calls with same `file_path` and same `content` (trailing-newline-tolerant) collapse to one transcript entry.

## Key insights

1. **`writeTextContent` parameter is `'LF'`, but reads honour the original.** When the user runs `Read(file.txt)` then `Write(file.txt, new_content)`, if the file originally used CRLF, the read normalises to LF in `readFileState`, the staleness check works, and the write produces a CRLF file *only if `new_content` itself contains CRLF*. The model has total control over output line endings.

2. **The Read-before-Write gate uses content fallback on Windows.** `readTimestamp.timestamp` is the file's mtime when Read was called. If a cloud-sync tool bumps mtime without changing content, the validator falls through to `isFullRead && fileContent === readTimestamp.content` — a content compare. Without this, OneDrive-touched files would always fail the staleness check.

3. **History backup is keyed by content hash.** `fileHistoryTrackEdit` uses an idempotent v1 backup keyed on content hash, so calling it before the staleness check is safe — if staleness fails later, we just have an unused backup row, not corrupt state.

4. **`type: 'create'` vs `type: 'update'` is distinguished by `oldContent` presence.** A file that exists but is empty still produces `type: 'update'` with `originalFile: ""`. New file creation strictly requires the file to not exist (`meta === null`).

5. **`mkdir` of the parent dir is implicit.** `await getFsImplementation().mkdir(dir)` creates the parent directory recursively. This is intentional — the model often writes to a fresh subdir without thinking about `mkdir -p`. The mkdir is outside the critical section because it can yield.

6. **`tengu_quartz_lantern` GB flag** controls whether the optional git-diff fetch happens. When on (and `CLAUDE_CODE_REMOTE` is set), each Edit/Write produces a `gitDiff` blob that's surfaced in remote-control / claude.ai PR contexts.

## v2.1.112 → v2.1.142 deltas

| Version | Change | Where |
|---------|--------|-------|
| 2.1.119 | Write tool output collapsing instead of expanding when clicking "+N lines" in fullscreen — fixed | `isResultTruncated` |
| 2.1.121 | `--dangerously-skip-permissions` no longer prompts for writes to `.claude/skills/`, `.claude/agents/`, `.claude/commands/` | permission flag |
| 2.1.126 | `--dangerously-skip-permissions` bypasses prompts for writes to `.claude/`, `.git/`, `.vscode/`, shell config files | permission flag |
| 2.1.128 | SDK hosts now receive a persistent `localSettings` suggestion for Bash permission prompts, so "Always allow" writes to `.claude/settings.local.json` | upstream; Write-rule plumbing |
| 2.1.133 | `Edit`/`Write` allow rules scoped to drive root (`C:\`) or POSIX `/` matching incorrectly — fixed | `matchingRuleForInput` |
| 2.1.133 | Read/Write/Edit denied on mapped network drives passed via `--add-dir` / SDK `additionalDirectories` — fixed | path resolution |
| 2.1.136 | Plan mode now blocks file writes when a matching `Edit(...)` allow rule exists | plan-mode override |
| 2.1.142 | (no Write-specific functional changes; CHANGELOG entries touch upstream — skill discovery, permission policies) | — |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_filesystem.md](../00_overview/symbol_additions_v2_1_142_tools_filesystem.md) — full mapping table

Key functions in this document:
- `FileWriteTool` (Yw) — top-level tool object built by `XK`
- `checkWritePermissionForTool` (VkH) — shared with FileEditTool
- `readFileSyncWithMetadata` (Mc) — sync read with encoding + line-ending detection
- `writeTextContent` — write with encoding + line-ending policy
- `getPatchForDisplay` — diff hunk renderer for `type: 'update'`
- `countLinesChanged` — track add/remove counts for telemetry
- `getLspServerManager` (qDH) — for LSP didChange/didSave notification
- `notifyVscodeFileUpdated` — VS Code diff overlay trigger
- `fetchSingleFileGitDiff` — optional git-diff blob for remote-control surfaces
- `discoverSkillDirsForPaths` / `addSkillDirectories` / `activateConditionalSkillsForPaths` — skill subsystem fire-and-forget hook
- `checkTeamMemSecrets` (dnH) — team-memory secret guard
- `checkSensitivePatterns` (kY8) — credential pattern detector
- `FILE_UNEXPECTEDLY_MODIFIED_ERROR` — thrown when call-time staleness check fails
