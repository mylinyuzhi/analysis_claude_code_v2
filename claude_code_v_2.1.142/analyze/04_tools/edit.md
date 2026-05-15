# Edit Tool — v2.1.142

## Overview

`FileEditTool` (`_D` in cli_inner_pretty.js:415451) performs exact-string-replacement edits on text files. It enforces a Read-before-Edit gate, atomic read-modify-write semantics, line-ending preservation, encoding detection (utf-8 vs utf-16le), curly-quote normalisation, and integration with LSP didChange/didSave plus VS Code diff notification. The tool exposes a single edit at a time (matching the `Edit({file_path, old_string, new_string, replace_all})` shape) and supports `replace_all` for global renames.

## Schema (Zod)

```javascript
// ============================================
// fileEditInputSchema — FileEditTool input parameters
// Location: cli_inner_pretty.js / CY8() at runtime
// ============================================

// ORIGINAL (for source lookup):
// CY8() returns z.strictObject({ file_path, old_string, new_string, replace_all })

// READABLE (for understanding):
const fileEditInputSchema = z.strictObject({
  file_path: z.string().describe('The absolute path to the file to modify'),
  old_string: z.string().describe('The text to replace'),
  new_string: z.string().describe('The text to replace it with (must be different from old_string)'),
  replace_all: z.boolean().default(false).optional().describe('Replace all occurrences of old_string (default false)'),
});

// Mapping: CY8→fileEditInputSchema (lazy via yH/lazySchema)
```

Output schema (`Dv6()`) returns `filePath`, `oldString`, `newString`, `originalFile`, `structuredPatch`, `userModified`, `replaceAll`, optional `gitDiff`. The `originalFile` field is **stripped for storage** (`stripForStorage` overrides it to `""`) so that long transcript replays don't carry pre-edit content multiple times.

`maxResultSizeChars` is **100,000**.

## validateInput

The validator is the meat of this tool. It is a multi-stage pipeline:

```javascript
// ============================================
// validateInput — Read-before-Edit + uniqueness check + UNC path safety
// Location: cli_inner_pretty.js:415499-415700 (mirrors src/tools/FileEditTool/FileEditTool.ts:137-362)
// ============================================

// ORIGINAL (for source lookup):
// async validateInput(H, $) {
//   let { file_path: q, old_string: K, new_string: _, replace_all: A = !1 } = H;
//   let z = eq(q); // expandPath
//   let Y = dnH(z, $.agentId); if (Y) return { result: !1, message: Y, errorCode: 12 };
//   let f = kY8(z, _); if (f) return { result: !1, message: f, errorCode: 0 };
//   if (K === _) return { result: !1, behavior: "ask", message: "No changes...", errorCode: 1 };
//   ...
// }

// READABLE (for understanding):
async function validateInput(input, toolUseContext) {
  const { file_path, old_string, new_string, replace_all = false } = input;
  const fullFilePath = expandPath(file_path);

  // (1) Subagent secret-write guard — block edits adding secrets to TEAM_MEMORY paths
  const teamMemError = checkTeamMemSecrets(fullFilePath, toolUseContext.agentId);
  if (teamMemError) return { result: false, message: teamMemError, errorCode: 12 };

  // (2) Sensitive-pattern guard — block adding hard-coded credentials anywhere
  const secretError = checkSensitivePatterns(fullFilePath, new_string);
  if (secretError) return { result: false, message: secretError, errorCode: 0 };

  // (3) Trivial no-op
  if (old_string === new_string) {
    return { result: false, behavior: 'ask', message: 'No changes to make: old_string and new_string are exactly the same.', errorCode: 1 };
  }

  // (4) Deny-rule check
  const appState = toolUseContext.getAppState();
  if (matchingRuleForInput(fullFilePath, appState.toolPermissionContext, 'edit', 'deny') !== null) {
    return { result: false, behavior: 'ask', message: 'File is in a directory that is denied by your permission settings.', errorCode: 2 };
  }

  // (5) UNC path bypass (NTLM credential leak prevention on Windows)
  if (fullFilePath.startsWith('\\\\') || fullFilePath.startsWith('//')) return { result: true };

  // (6) Stat-based checks: file size cap (1 GiB) + chmod-readonly check
  const fs = getFsImplementation();
  try {
    const { size, mode } = await fs.stat(fullFilePath);
    if (size > MAX_EDIT_FILE_SIZE) {
      return { result: false, behavior: 'ask', message: `File is too large to edit (${formatFileSize(size)}). Maximum editable file size is ${formatFileSize(MAX_EDIT_FILE_SIZE)}.`, errorCode: 10 };
    }
    if (isModeRestricted(mode)) return { result: false, behavior: 'ask', message: FILE_READ_ONLY_ERROR_MESSAGE, errorCode: 11 };
  } catch (e) {
    if (!isENOENT(e)) throw e;
  }

  // (7) Read content + detect encoding (UTF-16 LE BOM → utf16le, else utf8)
  let fileContent = null;
  try {
    const buffer = await fs.readFileBytes(fullFilePath);
    const encoding = (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) ? 'utf16le' : 'utf8';
    fileContent = buffer.toString(encoding).replaceAll('\r\n', '\n');
  } catch (e) {
    if (isENOENT(e)) fileContent = null; else throw e;
  }

  // (8) Non-existent file: allow only if old_string === "" (creates new file)
  if (fileContent === null) {
    if (old_string === '') return { result: true };
    const similar = findSimilarFile(fullFilePath);
    const cwdSuggest = await suggestPathUnderCwd(fullFilePath);
    let message = `File does not exist. ${FILE_NOT_FOUND_CWD_NOTE} ${getCwd()}.`;
    if (cwdSuggest) message += ` Did you mean ${cwdSuggest}?`;
    else if (similar) message += ` Did you mean ${similar}?`;
    return { result: false, behavior: 'ask', message, errorCode: 4 };
  }

  // (9) Empty old_string against existing file: only valid if file is empty too
  if (old_string === '') {
    if (fileContent.trim() !== '') return { result: false, behavior: 'ask', message: 'Cannot create new file - file already exists.', errorCode: 3 };
    return { result: true };
  }

  // (10) Notebook redirect
  if (fullFilePath.endsWith('.ipynb')) {
    return { result: false, behavior: 'ask', message: `File is a Jupyter Notebook. Use the ${NOTEBOOK_EDIT_TOOL_NAME} to edit this file.`, errorCode: 5 };
  }

  // (11) Read-before-Edit gate — and the v2.1.91-onwards "partial view" exclusion
  const readTimestamp = toolUseContext.readFileState.get(fullFilePath);
  if (!readTimestamp || readTimestamp.isPartialView) {
    return { result: false, behavior: 'ask', message: 'File has not been read yet. Read it first before writing to it.', errorCode: 6 };
  }

  // (12) Staleness check — content compare fallback on Windows
  if (getFileModificationTime(fullFilePath) > readTimestamp.timestamp) {
    const isFullRead = readTimestamp.offset === undefined && readTimestamp.limit === undefined;
    if (!(isFullRead && fileContent === readTimestamp.content)) {
      return { result: false, behavior: 'ask', message: 'File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.', errorCode: 7 };
    }
  }

  // (13) Uniqueness check — old_string must exist and be unique unless replace_all
  const actualOldString = findActualString(fileContent, old_string);  // handles curly-quote normalization
  if (!actualOldString) {
    return { result: false, behavior: 'ask', message: `String to replace not found in file.\nString: ${old_string}`, meta: { isFilePathAbsolute: ... }, errorCode: 8 };
  }
  const matches = fileContent.split(actualOldString).length - 1;
  if (matches > 1 && !replace_all) {
    return { result: false, behavior: 'ask', message: `Found ${matches} matches of the string to replace, but replace_all is false. ...`, meta: { actualOldString }, errorCode: 9 };
  }

  // (14) Settings-file specific validation (Claude's own settings.json)
  const settingsErr = validateInputForSettingsFileEdit(fullFilePath, fileContent, () =>
    replace_all ? fileContent.replaceAll(actualOldString, new_string) : fileContent.replace(actualOldString, new_string));
  if (settingsErr) return settingsErr;

  return { result: true, meta: { actualOldString } };
}

// Mapping: eq→expandPath, dnH→checkTeamMemSecrets, kY8→checkSensitivePatterns,
//          yL→matchingRuleForInput, $84→MAX_EDIT_FILE_SIZE (1 GiB),
//          QRH→isModeRestricted, gRH→FILE_READ_ONLY_ERROR_MESSAGE,
//          findActualString→findActualString (utils.ts)
```

### Why a Read-before-Edit gate?

**Decision rationale:** Without it, the model could send a `replace_all` against a file it has never seen, producing data loss. The gate forces the model to first call `Read(file_path)` which populates `readFileState[fullFilePath] = { content, timestamp, offset, limit }`. The validator then checks `readFileState`'s presence + staleness.

**Edge case (`isPartialView`):** Added in 2.1.91. If the model called `Read` with `offset`+`limit`, the resulting `readFileState` entry has `isPartialView: true`. Edits against partial views are rejected because the model is not seeing all instances of `old_string` — a `replace_all` could trash invisible matches. The model must do a full read first.

**Windows-specific fallback:** Cloud sync software (OneDrive, iCloud) updates file mtime without changing content. If the timestamp says "modified" but content is unchanged, allow the edit. This is the `isFullRead && fileContent === readTimestamp.content` branch.

### old_string anchor shortening (v2.1.91)

The validator calls `findActualString` (utils.ts) which handles **curly-quote normalisation**: if `old_string` contains straight quotes (`"`) but the file contains curly quotes (`"`/`"`), `findActualString` returns the curly-quote variant that's actually in the file. This lets the model write `old_string: 'said "hello"'` even when the file has fancy quotes. The matched variant is then used everywhere (uniqueness count, replace operation, validator error messages).

Pre-2.1.91, the model had to copy curly quotes verbatim. Documentation drift around what got pasted from rich-text editors caused frequent edit failures.

### CRLF doubling fix (v2.1.89)

Pre-2.1.89, reading a CRLF file with `\r\n` line endings, normalising to `\n` in memory, doing a replace with `new_string` containing `\n`, then writing back via `writeTextContent` would produce `\r\r\n` in some encodings because writeTextContent re-applied the line endings unconditionally. Fixed by:
1. Read file as bytes (`fs.readFileBytes`).
2. Detect encoding from BOM.
3. Decode + normalise `\r\n` → `\n` in memory.
4. Track original line endings via `readFileSyncWithMetadata` for the write side.
5. `writeTextContent(path, updated, encoding, endings)` re-applies the original endings — but it does so **after** the in-memory replacement, so no doubling.

### sed-viewed files (v2.1.89+)

When a sed-edit is approved via `_simulatedSedEdit` on BashTool (see [bash.md](bash.md)), the resulting `applySedEdit` updates `readFileState` exactly as if the file had been Read. This means a subsequent FileEditTool call on the same file sees a fresh `readFileState` entry and passes the Read-before-Edit gate. The 2.1.89+ behaviour ensures sed-edits and direct Edits can interleave naturally.

## checkPermissions

```javascript
// ============================================
// FileEditTool.checkPermissions — write permission check
// Location: cli_inner_pretty.js:415491-415494
// ============================================

// ORIGINAL (for source lookup):
async function checkPermissions(H, $) {
  let q = $.getAppState();
  return VkH(_D, H, q.toolPermissionContext);
}

// READABLE (for understanding):
async function checkPermissions(input, context) {
  const appState = context.getAppState();
  return checkWritePermissionForTool(FileEditTool, input, appState.toolPermissionContext);
}

// Mapping: VkH→checkWritePermissionForTool
```

`checkWritePermissionForTool` walks `Edit(path)` and `Write(path)` allow/deny rules. The `preparePermissionMatcher` callback returns `(pattern) => matchWildcardPattern(pattern, file_path)` so allow rules like `Edit(src/**)` work as glob patterns.

## call

```javascript
// ============================================
// FileEditTool.call — atomic edit + LSP didChange/didSave + VSCode notify
// Location: cli_inner_pretty.js:415700-415900 (mirrors src/tools/FileEditTool/FileEditTool.ts:387-574)
// ============================================

// ORIGINAL (for source lookup):
// async call(H, { readFileState, userModified, updateFileHistoryState, dynamicSkillDirTriggers }, _, parentMessage) {
//   const { file_path, old_string, new_string, replace_all = false } = H;
//   const fs = getFsImplementation();
//   const absoluteFilePath = expandPath(file_path);
//   // (1) skill-dir discovery, (2) diagnostic tracker before-edit, (3) ensure parent dir,
//   // (4) atomic staleness check + read, (5) findActualString + preserveQuoteStyle,
//   // (6) getPatchForEdit, (7) writeTextContent, (8) LSP changeFile/saveFile,
//   // (9) VSCode notify, (10) update readFileState, (11) log events, (12) optional git diff fetch
//   return { data: { filePath, oldString, newString, originalFile, structuredPatch, userModified, replaceAll, gitDiff? } };
// }

// READABLE (for understanding):
async function call(input, context, _, parentMessage) {
  const { file_path, old_string, new_string, replace_all = false } = input;
  const { readFileState, userModified, updateFileHistoryState, dynamicSkillDirTriggers } = context;
  const fs = getFsImplementation();
  const absoluteFilePath = expandPath(file_path);

  // (1) Skill-dir discovery (fire-and-forget)
  if (!isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) {
    const newSkillDirs = await discoverSkillDirsForPaths([absoluteFilePath], getCwd());
    for (const dir of newSkillDirs) dynamicSkillDirTriggers?.add(dir);
    addSkillDirectories(newSkillDirs).catch(() => {});
    activateConditionalSkillsForPaths([absoluteFilePath], getCwd());
  }

  // (2) Diagnostic tracker (LSP-driven)
  await diagnosticTracker.beforeFileEdited(absoluteFilePath);

  // (3) Ensure parent dir + capture history backup BEFORE the critical section
  await fs.mkdir(dirname(absoluteFilePath));
  if (fileHistoryEnabled()) await fileHistoryTrackEdit(updateFileHistoryState, absoluteFilePath, parentMessage.uuid);

  // (4) Atomic read + staleness check (no async between here and write)
  const { content: originalFileContents, fileExists, encoding, lineEndings } = readFileForEdit(absoluteFilePath);
  if (fileExists) {
    const lastWriteTime = getFileModificationTime(absoluteFilePath);
    const lastRead = readFileState.get(absoluteFilePath);
    if (!lastRead || lastWriteTime > lastRead.timestamp) {
      const isFullRead = lastRead && lastRead.offset === undefined && lastRead.limit === undefined;
      if (!(isFullRead && originalFileContents === lastRead.content)) {
        throw new Error(FILE_UNEXPECTEDLY_MODIFIED_ERROR);
      }
    }
  }

  // (5) Curly-quote-aware match
  const actualOldString = findActualString(originalFileContents, old_string) || old_string;
  const actualNewString = preserveQuoteStyle(old_string, actualOldString, new_string);

  // (6) Patch generation
  const { patch, updatedFile } = getPatchForEdit({ filePath: absoluteFilePath, fileContents: originalFileContents, oldString: actualOldString, newString: actualNewString, replaceAll: replace_all });

  // (7) Write (preserves original encoding + line endings)
  writeTextContent(absoluteFilePath, updatedFile, encoding, lineEndings);

  // (8) LSP didChange/didSave + clear stale diagnostics
  const lspManager = getLspServerManager();
  if (lspManager) {
    clearDeliveredDiagnosticsForFile(`file://${absoluteFilePath}`);
    lspManager.changeFile(absoluteFilePath, updatedFile).catch(/* swallow + log */);
    lspManager.saveFile(absoluteFilePath).catch(/* swallow + log */);
  }

  // (9) VS Code notification (drives the diff overlay)
  notifyVscodeFileUpdated(absoluteFilePath, originalFileContents, updatedFile);

  // (10) Update readFileState — invalidates stale future writes
  readFileState.set(absoluteFilePath, {
    content: updatedFile,
    timestamp: getFileModificationTime(absoluteFilePath),
    offset: undefined,
    limit: undefined,
  });

  // (11) Telemetry, line counting, lsp-based diagnostics nudge
  countLinesChanged(patch);
  logFileOperation({ operation: 'edit', tool: 'FileEditTool', filePath: absoluteFilePath });
  logEvent('tengu_edit_string_lengths', { oldStringBytes: ..., newStringBytes: ..., replaceAll: replace_all });

  // (12) Optional git diff fetch (for remote/code review surfaces)
  let gitDiff;
  if (isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) && getFeatureValue_CACHED_MAY_BE_STALE('tengu_quartz_lantern', false)) {
    const diff = await fetchSingleFileGitDiff(absoluteFilePath);
    if (diff) gitDiff = diff;
  }

  return { data: { filePath: file_path, oldString: actualOldString, newString: new_string, originalFile: originalFileContents, structuredPatch: patch, userModified: userModified ?? false, replaceAll: replace_all, ...(gitDiff && { gitDiff }) } };
}

// Mapping: standard imports — readFileSyncWithMetadata, getLspServerManager,
//          fileHistoryTrackEdit, notifyVscodeFileUpdated, diagnosticTracker.
```

### Key algorithm: atomic read-modify-write

**What it does:** Avoid a race where two concurrent edits to the same file interleave.

**How it works:** All async operations are pulled **outside** the critical section. `fs.mkdir(dirname(...))`, `fileHistoryTrackEdit`, and skill-dir discovery happen first. The actual `readFileSyncWithMetadata` → `writeTextContent` pair is **synchronous**. There is no yield point between the staleness check and the write.

**Why this approach:** Async yields between staleness check and write would let a concurrent FileEditTool call (or external editor) modify the file in the window; the staleness check would pass on stale data and the write would clobber the other change.

**Trade-off:** The sync-read-and-write blocks the event loop for the duration of the write. For multi-MB files this is non-trivial, but the 1 GiB cap (`MAX_EDIT_FILE_SIZE`) keeps it bounded. Async fs is **not** an option here because of the atomicity requirement.

### Key algorithm: line-ending preservation

**What it does:** A file that uses `\r\n` (Windows) should keep `\r\n` after the edit, even though `old_string`/`new_string` use `\n` internally.

**How it works:**
1. `readFileSyncWithMetadata` records `lineEndings: 'LF' | 'CRLF' | 'CR'` based on the first newline in the file.
2. Content is normalised to `\n` internally for matching/replacement (so the model never has to handle `\r\n` in `old_string`).
3. On write, `writeTextContent(path, updated, encoding, endings)` re-applies the original endings.

**Edge case:** A file with mixed line endings (a few CRLF lines mixed with LF lines) gets coerced to the **first detected** line-ending type. This is intentional — mixed endings are usually a bug already, and unifying them is fine.

## Render methods

- `renderToolUseMessage` (`s$4`) — shows `Edit(path)` chrome with truncated `old_string` preview.
- `renderToolResultMessage` (`t$4`) — `FileEditToolResultMessage` renders a unified diff using `getPatchForDisplay`, line-numbered.
- `renderToolUseRejectedMessage` (`e$4`) — for permission rejections.
- `renderToolUseErrorMessage` (`H84`) — for validateInput failures and exceptions from `call`.

`inputsEquivalent` is defined so that two consecutive Edit calls with identical input collapse into a single visual entry in the transcript. The check uses `areFileEditsInputsEquivalent` which compares normalised `file_path` + each edit's `(old_string, new_string, replace_all)` tuple.

## Key insights

1. **`stripForStorage` is a critical token-cost optimisation.** Without it, every transcript replay would carry the pre-edit `originalFile` content for every Edit — 100s of KB per edit. The `originalFile` is rebuilt from the file system on demand for renderers; it doesn't need to be in the transcript JSON.

2. **`preserveQuoteStyle`** is paired with `findActualString`. If the file uses curly quotes and the model wrote straight quotes in `old_string`, the **matched** form is curly (so the replacement target is the curly-quoted text). `preserveQuoteStyle` then mirrors curly→straight or straight→curly conversion onto `new_string` so the replaced text keeps the file's quote convention.

3. **`backfillObservableInput`** runs `expandPath` on `file_path` so that hooks defined with allow-lists like `PreToolUse hook for Edit("/abs/path/**")` aren't bypassed by `Edit("~/abs/path")` or `Edit("./relative")`. Documented in hooks.mdx.

4. **`UNC` paths bypass filesystem checks.** Validating against UNC paths (`\\server\share`) on Windows would trigger SMB authentication via `fs.existsSync` which can leak NTLM credentials to a hostile server. The validator defers all FS calls and lets the permission layer make the final decision.

5. **`FILE_UNEXPECTEDLY_MODIFIED_ERROR`** thrown during `call()` is distinct from the validate-time staleness check. The validator catches "model edits a stale file", but the call-time check catches "an external linter modified the file between validate and call" — the user gets a clear "Read it again" message either way.

## v2.1.112 → v2.1.142 deltas

| Version | Change | Where |
|---------|--------|-------|
| 2.1.119 | Pasting CRLF content (Windows clipboards, Xcode console) inserts an extra blank line fix | upstream; affects content passed to Edit |
| 2.1.121 | `--dangerously-skip-permissions` no longer prompts for writes to `.claude/skills/`, `.claude/agents/`, `.claude/commands/` | permission flag |
| 2.1.126 | `--dangerously-skip-permissions` bypasses prompts for writes to `.claude/`, `.git/`, `.vscode/`, shell config files (catastrophic rm still prompts) | permission flag |
| 2.1.128 | TEAM_MEMORY/`Edit`/`Write` allow rules now distinguish drive-root (`C:\`) and POSIX `/` so they don't always-prompt | `matchingRuleForInput` |
| 2.1.133 | `Edit`/`Write` allow rules scoped to a drive root (`C:\`) or POSIX `/` matching incorrectly fixed | `matchingRuleForInput` |
| 2.1.133 | Read/Write/Edit being denied on mapped network drives via `--add-dir` fixed | path resolution |
| 2.1.136 | Plan mode now blocks file writes when a matching `Edit(...)` allow rule exists | plan-mode override |
| 2.1.142 | (no functional changes specific to FileEditTool; all touches are upstream — `dnH` checkTeamMemSecrets, `kY8` checkSensitivePatterns) | — |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_filesystem.md](../00_overview/symbol_additions_v2_1_142_tools_filesystem.md) — full mapping table

Key functions in this document:
- `FileEditTool` (_D) — top-level tool object built by `XK` (buildTool factory)
- `checkWritePermissionForTool` (VkH) — common write-permission walker
- `matchingRuleForInput` (yL) — find first matching deny/allow rule
- `expandPath` (eq) — path normalizer (~, relative, Windows seps)
- `findActualString` (utils.ts) — curly-quote-aware string match
- `preserveQuoteStyle` (utils.ts) — quote-style mirror for new_string
- `getPatchForEdit` (utils.ts) — produce unified diff hunks
- `readFileSyncWithMetadata` (Mc) — read with encoding/line-ending metadata
- `writeTextContent` (utils.ts) — atomic write with encoding + endings
- `checkTeamMemSecrets` (dnH) — block edits adding secrets to TEAM_MEMORY paths
- `checkSensitivePatterns` (kY8) — block adding credentials to any file
- `validateInputForSettingsFileEdit` — extra rules for Claude's settings.json
- `getFileModificationTime` (oN) — stat-based mtime
- `MAX_EDIT_FILE_SIZE` ($84) — 1 GiB cap
- `FILE_UNEXPECTEDLY_MODIFIED_ERROR` — thrown when call-time staleness check fails
