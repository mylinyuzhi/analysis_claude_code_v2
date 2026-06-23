# Anchors: FILE+EXEC tool group (v2.1.183)

> Tools: **Read, Write, Edit, NotebookEdit, Glob, Grep, Bash, PowerShell, REPL, LSP**.
> All line numbers refer to the PRIMARY bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
> Every cited line was Read directly in this session. Scaffold (2.1.156) readable names are used;
> obf ids are RE-DERIVED in THIS bundle by string-anchoring (name const + description string + schema
> converge on each tool object). Tool descriptions verified against
> `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/assets/tools/<Name>.md`.

Each tool is built via the factory `buildTool` (`pi`, `cli_inner_pretty.js:149995`) over
`TOOL_DEFAULTS` (`jJu`). The factory + registry are documented separately in
`_anchors_framework_registry.md`. Two-anchor identity rule: every tool below converges on
(1) its **name constant** (`var <obf> = "<Name>"`), (2) its **description string**, and (3) its
**Zod input-schema factory** (the `<schemaObf> = we(() => H.strictObject({...}))` lazy thunk).

---

## 0. One-screen symbol map (verified)

| Tool | name const (obf @line) | tool object (obf @line) | input schema (obf @line) | description site |
|---|---|---|---|---|
| Read | `Ws="Read"` @152217 | `hg = pi({...})` @463520 | `P3p` @463440 | `Rgi` @152226 (short) / `Bgi` @152188 (prompt) |
| Write | `Kc="Write"` @193030 | `yE = pi({...})` @390615 | `xwp` @390596 | inline `"Write a file to the local filesystem."` @390621 / `ALi` @193017 |
| Edit | `Fa="Edit"` @152083 | `kH = pi({...})` @444496 | `ZUn` @390017 | inline `"A tool for editing files"` @444502 / `gYa` (prompt) |
| NotebookEdit | `xL="NotebookEdit"` @221448 | `wW = pi({...})` @391042 | `Lwp` @391008 | `oUa` @390868 (desc) / `sUa` @390872 (prompt) |
| Glob | `_u="Glob"` @152243 | `hj = pi({...})` @371072 | `Rbp` @371054 | `WNr` @152244 (desc) / `Fgi` @152238 (prompt) |
| Grep | `Uc="Grep"` @221419 | `OR = pi({...})` @370736 | `Lbp` @370676 (excludes `Dbp` @370826) | `m5r` @221399 |
| Bash | `ns="Bash"` @145275 | `Cl = pi({...})` @450669 | `AJa` @450579 (base `mJa` @450554) | inline `"Run shell command"` @450676 / `uJa` (prompt) @450077 |
| PowerShell | `Xs="PowerShell"` @221424 | `Mdo = pi({...})` @443112 | `V1p` @443063 (base `J7a` @443050) | inline `"Run PowerShell command"` @443120 / `N7a` (prompt) |
| REPL | `PA="REPL"` @221566 | `wpo = pi({...})` @427548 | `FPp` @427520 | `a9a` (desc) / `i9a` (prompt) |
| LSP | `Vlt="LSP"` @368922 | `Opo = pi({...})` @429593 | `SMp` @429547 | `qso` @368923 (desc + prompt) |

Shared permission helpers (both Read-only and write):
- `_te` (read-permission check) — `cli_inner_pretty.js:574749`
- `P0e` (edit/write-permission check) — `cli_inner_pretty.js:574793`
- `Vk` (single-path deny/ask rule lookup) — used in every validateInput (`Vk(path, ctx, "read"|"edit", "deny"|"ask")`)
- `Br(t)` — extracts `toolPermissionContext` from the ToolUseContext (ubiquitous)
- `uye(t, path)` — path matcher returned by `preparePermissionMatcher` for file tools
- `t8(t, pattern)` — glob/pattern matcher for Glob/Grep `preparePermissionMatcher`
- `Ds(path)` — absolute-path normalizer (resolves to cwd)
- `Xct(path, ctx)` — shared "denied directory / outside workspace" pre-check (Write/Edit/NotebookEdit)
- `kze` — verbatim symlink/special-file error string (shared), `errorCode` varies

---

## 1. Read (`hg` @463520)

**Name const:** `var Ws = "Read"` — `cli_inner_pretty.js:152217`.
**Description (short):** `Rgi = "Read a file from the local filesystem."` — `cli_inner_pretty.js:152226` (matches `assets/tools/Read.md` "## Description").
**Tool object header** (`cli_inner_pretty.js:463520-463534`):
```
ruleContentField: "file_path",  searchHint: "read files, images, PDFs, notebooks",
maxResultSizeChars: 1 / 0,  strict: !0
```
**isReadOnly / isConcurrencySafe:** both `() => !0` — `cli_inner_pretty.js:463554-463556` and `:463551-463553`.

### 1a. Input schema `P3p` (`cli_inner_pretty.js:463440-463455`)
```js
H.strictObject({
  file_path: H.string().describe("The absolute path to the file to read"),
  offset: GB(H.number().int().nonnegative().optional()).describe("The line number to start reading from. ..."),
  limit:  GB(H.number().int().positive().optional()).describe("The number of lines to read. ..."),
  pages:  H.string().optional().describe(`Page range for PDF files (e.g., "1-5", "3", "10-20"). ... Maximum ${xie} pages per request.`),
})
```
Fields: `file_path`, `offset`, `limit`, `pages`. `xie` = max PDF pages per request.
Output schema `M3p` @463456 is a discriminatedUnion on `type` (`text|image|pdf|parts|notebook|file_unchanged`); the `text` branch carries the **`truncatedByTokenCap`** boolean (`cli_inner_pretty.js:463468-463473`, NEW in 2.1.183 — see §11).

### 1b. prompt builder `Bgi` (`cli_inner_pretty.js:152188-152230`)
Read's `prompt({model})` (`cli_inner_pretty.js:463525-463531`) calls
`Bgi(e, R3p(), n, r)` where `n` is the optional max-size nudge and `r` is either `Ngi` (targeted-range nudge) or `Ogi` (offset/limit nudge). The compact-mode branch (`Dg(e)`) starts:
> `Reads a file from the local filesystem.\n\n- \`file_path\` must be an absolute path.\n- Reads up to ${OQe} lines by default${n}.` — `cli_inner_pretty.js:152190-152192`

This **matches `assets/tools/Read.md` "## Prompt --- branch 1 ---"** verbatim. `OQe = 2000` (default line cap) @152221. Trailing nudge `Dgi` (`cli_inner_pretty.js:152221-152222`):
> `- Do NOT re-read a file you just edited to verify — Edit/Write would have errored if the change failed, and the harness tracks file state for you.`

`GNr` @152228 = `"- Results are returned using cat -n format, with line numbers starting at 1"`.

### 1c. validateInput (`cli_inner_pretty.js:463601-463644`)
Error strings VERBATIM (with errorCode):
- `cli_inner_pretty.js:463606` (pages malformed, code 7): `` `Invalid pages parameter: "${t}". Use formats like "1-5", "3", or "10-20". Pages are 1-indexed.` ``
- `cli_inner_pretty.js:463614` (page range too big, code 8): `` `Page range "${t}" exceeds maximum of ${xie} pages per request. Please use a smaller range.` ``
- `cli_inner_pretty.js:463620-463623` (denied dir, code 1): `"File is in a directory that is denied by your permission settings."` — via `Vk(r, Br(n), "read", "deny") !== null`
- UNC/`//` paths short-circuit to `{result:!0}` @463624
- `cli_inner_pretty.js:463629` (binary, code 4): `` `This tool cannot read binary files. The file appears to be a binary ${i} file. Please use appropriate tools for binary file analysis.` `` (guard `BEt(r) && !$Qe(i) && !Pel.has(i.slice(1))`)
- `cli_inner_pretty.js:463637` (device file, code 9): `` `Cannot read '${e}': this device file would block or produce infinite output.` `` (guard `x3p(r)`)

### 1d. checkPermissions (`cli_inner_pretty.js:463570-463572`)
`return _te(hg, e, Br(t));` — read-only permission helper `_te` (§0).
`preparePermissionMatcher` @463567 returns `(t) => uye(t, e)`.

### 1e. call + read engine `Del` (`cli_inner_pretty.js:463642-463716` → engine `Del` @463130)
- call signature `({file_path, offset=1, limit, pages}, ctx, _, msgCtx)` @463642.
- **Dedup fast-path** (`cli_inner_pretty.js:463653-463666`): if a prior non-partial full-file read exists with same offset/limit and unchanged mtime → returns `{type:"file_unchanged"}` + telemetry `tengu_file_read_dedup`. Gated by killswitch `tengu_read_dedup_killswitch`.
- Delegates to `Del(e, f, f, p, t, n, r, u, d, a, o, msgId)` @463681; on ENOENT tries `L3p(f)` (case-insensitive fallback) then throws `Bl` with `` `File does not exist. ${bN} ${Pt()}.` `` plus "Did you mean …?".
- `Del` (`cli_inner_pretty.js:463130`) branches by extension: `ipynb`→notebook (uses `Bash`/`PowerShell` jq nudge when too large @463137-463149), image (`Pel.has(r)`), PDF (`$Qe(r)`), else text via line-reader `ept`.

### 1f. PARTIAL view truncation (`isPartialView`) — `cli_inner_pretty.js:463238-463293`
For a whole-file read (`x = (offset??1)<=1 && limit===undefined && pages===undefined` @463243) that exceeds the token cap (`Oae` thrown by `Lel`):
1. Estimate chars/token ratio `O = m.length / R.tokenCount` @463249.
2. Line-paginate: `U = floor((lines*cap / tokenCount) * 0.85)`, shrink by `*0.7` up to 6 iterations until under cap @463251-463259.
3. If lines still too big or empty → fall back to **char** truncation `V = floor(cap*O*0.85)`, shrink `*0.7` up to 6× @463261-463270; trims a trailing surrogate half (`W=true`).
4. Build banner `C` with prefix `o0t = "[Truncated: PARTIAL view — "` (@152220). Two variants @463282-463284:
   > line-paginated: `` `showing lines 1-${S} of ${g} total (${R.tokenCount} tokens, cap ${l}). Call ${Ws} with offset=${S + 1} limit=${S} for the next page, or ${Uc} to find a specific section. Do NOT answer from this page alone if the answer may be further in the file.]` ``
   > char-truncated: `` `showing the first ${F.length} of ${m.length} characters (${R.tokenCount} tokens, cap ${l}); this file has very long lines and cannot be paginated by line. Use ${Uc} to find a specific section, or ${Ws} with offset/limit to page through it. Do NOT answer from this excerpt alone if the answer may be elsewhere in the file.]` ``
5. Persist read-state with `isPartialView: !0` when `C !== void 0` @463289:
   `c.set(t, { content: b, timestamp, offset, limit: T, ...(C !== void 0 && { isPartialView: !0 }) })`.

The dedup fast-path explicitly skips partial views: `if (g && !g.isPartialView && g.offset !== void 0)` @463656.

### 1g. line-format / line-reader helper `ept` (`cli_inner_pretty.js:454540-454556`)
`ept(path, startLine=0, limit, byteCap, signal, opts)` — small files (`< KUp`) read whole then sliced by `YUp` (@454557); large files stream via `ZUp`. `YUp` handles BOM strip, `\r\n`→`\n` normalization, line counting, and byte-cap truncation (`truncatedByBytes`). Returns `{content, lineCount, totalLines, totalBytes, readBytes, mtimeMs, truncatedByBytes}`. The cat-`n` line numbering (`GNr`) is applied at render time by `Del`'s formatter, not here.

---

## 2. Write (`yE` @390615)

**Name const:** `var Kc = "Write"` — `cli_inner_pretty.js:193030`.
**Description (inline):** `async description() { return "Write a file to the local filesystem."; }` — `cli_inner_pretty.js:390620-390622` (matches `assets/tools/Write.md`).
**Header** @390615-390619: `ruleContentField:"file_path", searchHint:"create or overwrite files", maxResultSizeChars:1e5, strict:!0`. **prompt** `ALi(e)` @390631 (`ALi` @193017). NO `isReadOnly`/`isConcurrencySafe` here (write tool — not read-only by default).

### 2a. Input schema `xwp` (`cli_inner_pretty.js:390596-390599`)
```js
H.strictObject({
  file_path: H.string().describe("The absolute path to the file to write (must be absolute, not relative)"),
  content:   H.string().describe("The content to write to the file"),
})
```
Fields: `file_path`, `content`. Output schema `kwp` @390636.

### 2b. validateInput (`cli_inner_pretty.js:390672-390745`)
Error strings VERBATIM:
- `cli_inner_pretty.js:390674-390675` (code 7): shared dir pre-check `Xct(r, n)` → returns its message.
- `cli_inner_pretty.js:390676-390688` (code 5, **SUBAGENT report-file block — NEW**): when `n.agentId` and basename matches `/^(REPORT|SUMMARY|FINDINGS|ANALYSIS).*\.md$/i`, emits `tengu_subagent_md_report_blocked` and returns:
  > `"Subagents should return findings as text, not write report files. Include this content in your final response instead."`
- `cli_inner_pretty.js:390689` (code 0): `k0n(r, t)` content-guard message (e.g. forbidden-content).
- `cli_inner_pretty.js:390691-390694` (code 1): `Vk(r, Br(n), "edit", "deny")` → `"File is in a directory that is denied by your permission settings."`
- UNC/`//` short-circuit @390695.
- `cli_inner_pretty.js:390702` (code 6): symlink/special → `kze` (`Lze(d.mode)` check).
- **"not read yet" guard** (`cli_inner_pretty.js:390707-390730`): if no readFileState entry or `isPartialView`, emits `tengu_write_tool_not_read_hypothetical` with `modelBucket`, then unless the **velvet-mallet** killswitch (`tengu_velvet_mallet`, NEW @390709) skips it, returns (code 2):
  > `"File has not been read yet. Read it first before writing to it."`
- **stale-read guard** (`cli_inner_pretty.js:390731-390744`, code 3): if file mtime > stored timestamp and not byte-equal → 
  > `"File has been modified since read, either by the user or by a linter. Read it again before attempting to write it."`

### 2c. checkPermissions (`cli_inner_pretty.js:390665-390667`)
`return P0e(yE, e, Br(t));` — write helper `P0e` (§0). `preparePermissionMatcher` @390661 → `(t) => uye(t, e)`. `inputsEquivalent` @390654 treats trailing-newline-only diffs as equal.

### 2d. call (`cli_inner_pretty.js:390746-…`)
Resolves dir, runs skill-dir trigger scan `tut`/`nut`/`rut`, fires `$ge.beforeFileEdited`, `mkdir(dirname)`, optional file-history snapshot (`Bke` when `Tb()`), then atomic write under `uEe(d, …)`.

---

## 3. Edit (`kH` @444496)

**Name const:** `var Fa = "Edit"` — `cli_inner_pretty.js:152083`.
**Description (inline):** `"A tool for editing files"` — `cli_inner_pretty.js:444502-444504` (matches `assets/tools/Edit.md`). prompt `gYa(e)` @444506. Header @444496-444501: `ruleContentField:"file_path", searchHint:"modify file contents in place", maxResultSizeChars:1e5, strict:!0`.

### 3a. Input schema `ZUn` (`cli_inner_pretty.js:390017-390025`)
```js
H.strictObject({
  file_path:   H.string().describe("The absolute path to the file to modify"),
  old_string:  H.string().describe("The text to replace"),
  new_string:  H.string().describe("The text to replace it with (must be different from old_string)"),
  replace_all: n0(H.boolean().default(!1).optional()).describe("Replace all occurrences of old_string (default false)"),
})
```
Fields: `file_path`, `old_string`, `new_string`, `replace_all`. Output schema `Blo`.

### 3b. validateInput (`cli_inner_pretty.js:444546-444689`)
Error strings VERBATIM (note Edit uses `behavior:"ask"` on most failures):
- code 12 @444549: dir pre-check `Xct`.
- code 0 @444551: content guard `k0n`.
- code 1 @444552-444557 (ask): `"No changes to make: old_string and new_string are exactly the same."` (when `old===new`).
- code 2 @444558-444565 (ask): `"File is in a directory that is denied by your permission settings."` (`Vk … "edit" "deny"`).
- UNC/`//` short-circuit @444566.
- code 10 @444570-444575 (ask): `` `File is too large to edit (${$a(h)}). Maximum editable file size is ${$a(EYa)}.` `` (size > `EYa`).
- code 11 @444576 (ask): symlink/special → `kze`.
- code 4 @444596-444602 (ask): `` `File does not exist. ${bN} ${Pt()}.` `` (+ "Did you mean …?") when target missing and `old_string!==""`.
- code 3 @444604-444611 (ask): `"Cannot create new file - file already exists."` (when `old_string===""` but file non-empty).
- code 5 @444613-444619 (ask): `` `File is a Jupyter Notebook. Use the ${xL} to edit this file.` `` (`.ipynb` files → NotebookEdit).
- code 6 @444627-444642 (ask): "not read yet" guard — emits `tengu_edit_tool_not_read_hypothetical`, gated by **velvet-hammer** killswitch (`tengu_velvet_hammer` @444631): `"File has not been read yet. Read it first before writing to it."`
- code 7 @444649-444658 (ask): stale-read guard (`tengu_edit_tool_stale_read`, with `recovered` flag): `"File has been modified since read, either by the user or by a linter. Read it again before attempting to write it."`
- code 8 @444662-444675 (ask): `` `String to replace not found in file.\nString: ${r}${h}` `` — `h` adds a `\uXXXX`-escape-swap hint when `nFa(r)`.
- code 9 @444677-444684 (ask): `` `Found ${A} matches of the string to replace, but replace_all is false. To replace all occurrences, set replace_all to true. To replace only one occurrence, please provide more context to uniquely identify the instance.\nString: ${r}` `` (`A>1 && !replace_all`).
- Then `fYa(...)` applies and may return its own error; success: `{result:!0, meta:{actualOldString:m}}` @444688.

### 3c. checkPermissions (`cli_inner_pretty.js:444538-444540`)
`return P0e(kH, e, Br(t));` (write helper). `preparePermissionMatcher` @444534 → `(t) => uye(t, e)`. `coerceInput: AYa`.

### 3d. call (`cli_inner_pretty.js:444703-…`)
Same edit pipeline (skill-dir triggers, `beforeFileEdited`, `mkdir`, history snapshot), then string replace `s ? f.replaceAll(m,o) : f.replace(m,o)` under atomic `uEe`.

---

## 4. NotebookEdit (`wW` @391042)

**Name const:** `var xL = "NotebookEdit"` — `cli_inner_pretty.js:221448`.
**Description:** `oUa = "Edit a cell in a Jupyter notebook — replace, insert, or delete."` — `cli_inner_pretty.js:390868` (matches asset). **prompt** `sUa` @390872 (`"Replaces, inserts, or deletes a single cell in a Jupyter notebook (.ipynb file). …"`). Header @391042-391047: `ruleContentField:"notebook_path", searchHint:"edit Jupyter notebook cells (.ipynb)", maxResultSizeChars:1e5, shouldDefer:!0`. `userFacingName()` returns `"Edit Notebook"` @391059-391061.

### 4a. Input schema `Lwp` (`cli_inner_pretty.js:391008-391030`)
Fields: `notebook_path` (`"The absolute path to the Jupyter notebook file to edit (must be absolute, not relative)"`), `cell_id` (optional), `new_source`, `cell_type` (`enum["code","markdown"]` optional), `edit_mode` (`enum["replace","insert","delete"]`, default replace). Output schema `Dwp`.

### 4b. validateInput (`cli_inner_pretty.js:391111-391160`)
Error strings VERBATIM:
- code 12 @391112: `Xct` dir pre-check.
- UNC/`//` short-circuit @391113.
- code 2 @391114-391118: `"File must be a Jupyter notebook (.ipynb file). For editing other file types, use the FileEdit tool."`
- code 4 @391117 (was @391116 region): `"Edit mode must be replace, insert, or delete."` (edit_mode not in set).
- code 5 @391118-391119: `"Cell type is required when using edit_mode=insert."`
- code 9 @391120-391125: `"File has not been read yet. Read it first before writing to it."` (no readFileState).
- code 11 @391126-391132: symlink/special → `kze` (guarded by `smr()`).
- code 10 @391133-391138: `"File has been modified since read, either by the user or by a linter. Read it again before attempting to write it."` (stale).
- code 1 @391145: `"Notebook file does not exist."`
- code 6 @391146: `"Notebook is not valid JSON."`
- code 7 @391148-391149: `"Cell ID must be specified when not inserting a new cell."`
- code 7 (index) @391152: `` `Cell with index ${d} does not exist in notebook.` ``
- code 8 @391153: `` `Cell with ID "${n}" not found in notebook.` ``

### 4c. checkPermissions (`cli_inner_pretty.js:391086-391088`)
`return P0e(wW, e, Br(t));` (write helper). `preparePermissionMatcher` @391082 → `(t) => uye(t, e)`.

---

## 5. Glob (`hj` @371072)

**Name const:** `var _u = "Glob"` — `cli_inner_pretty.js:152243`.
**Description:** `WNr` @152244 (`"- Fast file pattern matching tool that works with any codebase size …"`, matches asset). **prompt** `Fgi(e)` @371137 (`Fgi` @152238). Header @371072-371074: `searchHint:"find files by name pattern or wildcard", maxResultSizeChars:1e5`. `isReadOnly`/`isConcurrencySafe` both `!0` @371094-371099.

### 5a. Input schema `Rbp` (`cli_inner_pretty.js:371054-371061`)
```js
H.strictObject({
  pattern: H.string().describe("The glob pattern to match files against"),
  path:    H.string().optional().describe("The directory to search in. ... DO NOT enter \"undefined\" or \"null\" - simply omit it ..."),
})
```
Fields: `pattern`, `path`. Output schema `$bp` (`durationMs, numFiles, filenames, truncated`).

### 5b. validateInput (`cli_inner_pretty.js:371111-371131`)
- code 1 @371118-371123: `` `Directory does not exist: ${e}. ${bN} ${Pt()}.` `` (+ "Did you mean …?") when `path` ENOENT.
- code 2 @371131: `` `Path is not a directory: ${e}` `` when path is a file.
No path → `{result:!0}`.

### 5c. checkPermissions (`cli_inner_pretty.js:371133-371135`)
`return _te(hj, e, Br(t));` (read helper). `preparePermissionMatcher` @371108 → `(t) => t8(t, e)` (pattern matcher). `ruleContentField:"path"`, `getPath({path}) => path ? Ds(path) : Pt()`.

### 5d. call (`cli_inner_pretty.js:371145-371152`)
`maxResults = globLimits?.maxResults ?? 100`; delegates to glob engine `QMa(pattern, getPath(e), {limit, offset:0}, signal, Br(t))` → `{files, truncated}`, maps paths through `Cze`. Truncation banner: `"(Results are truncated. Consider using a more specific path or pattern.)"` @371160.

---

## 6. Grep (`OR` @370735; second copy `pi({name:Uc…})` @370736)

**Name const:** `var Uc = "Grep"` — `cli_inner_pretty.js:221419`.
**Description builder `m5r`** (`cli_inner_pretty.js:221399-221418`): compact branch (`Dg(e)`) starts
> `Content search built on ripgrep. Prefer this over \`grep\`/\`rg\` via ${ns} — results integrate with the permission UI and file links.`
(matches `assets/tools/Grep.md` "--- branch 1 ---"). Header @370736-370740: `searchHint:"search file contents with regex (ripgrep)", maxResultSizeChars:20000, strict:!0`. `userFacingName()` → `"Search"` @370743. `isReadOnly`/`isConcurrencySafe` both `!0`.

### 6a. Input schema `Lbp` (`cli_inner_pretty.js:370676-370724`)
Fields (full): `pattern`, `path`, `glob`, `output_mode` (`enum["content","files_with_matches","count"]`), `-B`, `-A`, `-C`, `context`, `-n` (default true), `-i`, `-o`, `type`, `head_limit` (default 250 when unspecified, 0=unlimited), `offset` (default 0, NEW pagination — see §11), `multiline`. Verbatim describe strings present at those lines (e.g. `head_limit` describe @370713, `offset` describe @370716). Glob-exclude default list `Dbp = [".git",".svn",".hg",".bzr",".jj",".sl"]` @370826. `Pbp = 250` (default head limit) @370656. Output schema `Mbp` @370727.

### 6b. validateInput (`cli_inner_pretty.js:370776-370809`)
- code 2 @370784-370789: null-byte check across pattern/path/glob/type → `` `${Uc} ${field} cannot contain null bytes (\\0). Remove the null byte and try again.` ``
- code 1 @370797-370803: `` `Path does not exist: ${t}. ${bN} ${Pt()}.` `` (+ "Did you mean …?") when `path` ENOENT.

### 6c. checkPermissions (`cli_inner_pretty.js:370810-370812`)
`return _te(OR, e, Br(t));` (read helper). `preparePermissionMatcher` @370775 → `(t) => t8(t, e)`. `ruleContentField:"path"`.

### 6d. ripgrep arg build + exec (call @370864-…, exec `Zie` @211151)
Arg array `y` assembled (`cli_inner_pretty.js:370873-370911`):
1. `y = ["--hidden"]`; for each `P` in `Dbp` push `--glob !${P}` @370874-370875.
2. `--max-columns 500` @370876.
3. `multiline` → `-U --multiline-dotall`; `-i` → `-i`.
4. output_mode: `files_with_matches`→`-l`; `count`→`-c -H`; `content`+`-n`→`-n`; `content`+`-o`→`-o`.
5. content context: `context`/`-C` → `-C <n>`; else `-B`/`-A` separately.
6. pattern: leading `-` → `-e <pattern>` else bare push @370899-370901.
7. `type` → `--type <r>`; `glob` split on whitespace, brace-groups kept whole else comma-split, each `--glob <P>` @370902-370908.
8. workspace deny globs from `F4e(U4e(Br(A)), Pt())` → `--glob !**/<P>` (or `!<abs>`) @370909-370913.
9. project ignore globs from `Jlt(h)` → `--glob <P>` @370914.
10. Exec `b = await Zie(y, h, signal)` @370916; results paginated by `sio(b, head_limit, offset)`; paths de-prefixed via `Cze`.
Three output shapes returned: `content` (joined lines), `count` (per-file `:N`, summed), `files_with_matches` (mtime-sorted filenames). Pagination banner via `iio(appliedLimit, appliedOffset)` (e.g. `[Showing results with pagination = …]`).

---

## 7. Bash (`Cl` @450669)

**Name const:** `var ns = "Bash"` — `cli_inner_pretty.js:145275`.
**Description (inline):** `async description({description:e}) { return e || "Run shell command"; }` — `cli_inner_pretty.js:450675-450677` (matches asset). **prompt** `uJa(e, Ymo(r))` @450677-450681 (`uJa` @450077; injects sandbox examples when the `mH` MCP/sandbox tool is present). Header @450669-450674: `ruleContentField:"command", searchHint:"execute shell commands", maxResultSizeChars:30000, strict:!0`. `coerceInput: nXa`.

### 7a. Input schema `AJa` / base `mJa` (`cli_inner_pretty.js:450554-450577`, wrapper `AJa` @450579)
Base `mJa` fields: `command`, `timeout` (`max ${qdt()}`), `description` (long describe string @450557-450569), `run_in_background`, `dangerouslyDisableSandbox` (`"Set this to true to dangerously override sandbox mode and run commands without sandboxing."`), `_simulatedSedEdit` (internal). `AJa` @450579 = `mJa` with `_simulatedSedEdit` always omitted, and `run_in_background` also omitted when `p4t` (background unavailable). Output schema `UFp` @450606 (stdout, stderr, interrupted, isImage, backgroundTaskId, `dangerouslyDisableSandbox`, `staleReadFileStateHint`, `ghRateLimitHint`, etc.). Allowlisted command names `FFp` @450582 (`npm,yarn,pnpm,node,python,…`).

### 7b. isReadOnly / isConcurrencySafe (`cli_inner_pretty.js:450682-450688`)
`isReadOnly(e)`: `let t = V3t(e.command); return wLn(e, t).behavior === "allow";` — i.e. a command is read-only iff its permission decision (given a stripped/no-side-effect classification) resolves to `allow`. `isConcurrencySafe` = `isReadOnly`. `V3t` (@452530) = "does any sub-command change cwd?" (`xxe`: cd/pushd/popd/chdir @452526).

### 7c. validateInput — **sleep guard** (`cli_inner_pretty.js:450746-450759`)
When sandboxing active (`nG()`), not background-mode (`!p4t`), not `run_in_background`, calls `GFp(e.command)` (sleep detector @450238). On hit (code 10):
> `` `Blocked: ${t}. To wait for a condition, use Monitor with an until-loop (e.g. \`until <check>; do sleep 2; done\`). To wait for a command you started, use run_in_background: true. Do not chain shorter sleeps to work around this block.` ``
`GFp` (`cli_inner_pretty.js:450238-450247`): tokenizes via `Zh`, matches `/^sleep\s+(\d+(?:\.\d*)?)\s*$/` on the first command, blocks if `>= FUn`; returns `"sleep N followed by: <rest>"` or `"standalone sleep N"`.

### 7d. checkPermissions + sandbox decision (`cli_inner_pretty.js:450760-450783`)
`async checkPermissions(e, t)`: `let n = await Yjt(e, t);` then a **`dangerouslyDisableSandbox` override** branch: if the flag is set, the base decision isn't deny/ask, and `WR({...e, dangerouslyDisableSandbox:!1})` would have sandboxed it, force an ask:
> `{ behavior:"ask", decisionReason:{type:"sandboxOverride", reason:"dangerouslyDisableSandbox"}, message:"Run outside of the sandbox" }` @450776-450780.

**`WR` (sandbox predicate)** `cli_inner_pretty.js:585257-585264`:
```js
function WR(e) {
  if (hx() && Xse()) return !0;                                 // forced sandbox
  if (!zo.isSandboxingEnabled()) return !1;
  if (e.dangerouslyDisableSandbox && zo.areUnsandboxedCommandsAllowed()) return !1;
  if (!e.command) return !1;
  if (Rbf(e.command)) return !1;                                // command-class exclusion
  return !0;
}
```
**`Yjt` (full permission decision)** `cli_inner_pretty.js:452209-…`: parses the command AST (`iPt`/`dPt`); `too-complex`/`semantics` misses → `ask` with `tengu_bash_ast_too_complex`. Then rule lookup `gGn` (exact deny/ask/allow @452545), and the **classifier safety check** (`cIe() && mode!=="auto"`) running `PCn` against deny-rules (high-confidence → `behavior:"deny"`, message `` `${Zze}: "${X.matchedDescription}"` ``) and ask-rules.

### 7e. destructive-command guards
- `KOt(command)` (`cli_inner_pretty.js:297643`) → `Vaa(command)?.category ?? null`; the destructive pattern table `E9d` (`cli_inner_pretty.js:297648-…`) maps regexes to categories+warnings VERBATIM:
  - `/\bgit\s+reset\s+--hard\b/` → `git_reset_hard`, `"Note: may discard uncommitted changes"`
  - `/\bgit\s+push\b[^;&|\n]*[ \t](--force|--force-with-lease|-f)\b/` → `git_force_push`, `"Note: may overwrite remote history"`
  - `/\bgit\s+clean\b…-[a-zA-Z]*f/` → `git_clean_force`, `"Note: may permanently delete untracked files"`
  - `/\bgit\s+checkout\s+(--\s+)?\.…/` → `git_checkout_dot`, `"Note: may discard all working tree changes"`
  - `/\bgit\s+restore\s+(--\s+)?\.…/` → `git_restore_dot`, `"Note: may discard all working tree changes"`
  - `/\bgit\s+stash[ \t]+(drop|clear)\b/` → `git_stash_drop`, `"Note: may permanently remove stashed changes"`
  - `/\bgit\s+branch\s+(-D|--delete --force|--force --delete)/` → branch-force-delete (continues past @297680)
  Used as telemetry tag `destructive_category: Ne(KOt(e.command) ?? "none")` in `tengu_bash_tool_command_executed`/`_failed` (call @450912, @450932).

### 7f. sed-edit interception `kGe` (`cli_inner_pretty.js:389533-389600+`)
`kGe(command)` recognizes a single in-place `sed -i 's/pat/rep/flags' file` and returns `{filePath, newContent}` so it can be routed through the file-edit/permission path instead of the shell. Tokenizes via `lE`, requires `t[0]==="sed"`, parses `-i/--in-place` (with optional backup suffix), `-E/-r`, `-e/--expression`; rejects multiple expressions, non-`s/` scripts, remote paths. The Bash `call` checks `e._simulatedSedEdit` first (@450830 → `WFp` @450252 applies the precomputed edit). `kGe` is also referenced in `userFacingName` (@450731) to relabel a sed-edit Bash call as an Edit.

### 7g. call (`cli_inner_pretty.js:450828-…`)
`y = WR(e)` (sandbox flag), spawns via `zFp({input, abortController, taskRegistry, preventCwdChanges, isMainThread, toolUseId, agentId, sessionEnvVars, effortLevel})` @450839; streams `bash_progress` events; on error throws `R$` with telemetry `tengu_bash_tool_command_failed` (carries `sandboxed`, `destructive_category`, `permission_mode`); writes large output to a persisted file (`> 67108864` bytes truncated).

---

## 8. PowerShell (`Mdo` @443112)

**Name const:** `var Xs = "PowerShell"` — `cli_inner_pretty.js:221424`.
**Description (inline):** `e || "Run PowerShell command"` — `cli_inner_pretty.js:443118-443120` (matches asset). **prompt** `N7a()` @443121-443123. Header @443112-443117: `ruleContentField:"command", searchHint:"execute Windows PowerShell commands", maxResultSizeChars:30000, strict:!0`. `userFacingName()` → `"PowerShell"`. **`isEnabled() { return !0; }`** @443181-443183 (explicit on this tool).

### 8a. Input schema `V1p` / base `J7a` (`cli_inner_pretty.js:443050-443062`, wrapper `V1p` @443063)
Base `J7a` fields: `command` (`"The PowerShell command to execute"`), `timeout` (`max ${J3t()}`), `description`, `run_in_background`, `dangerouslyDisableSandbox`. `V1p` = `J7a` with `run_in_background` omitted when `Ddt`. Output schema `z1p` @443064.

### 8b. validateInput (`cli_inner_pretty.js:443184-443199`)
- code 11 @443185: when `X7a()` (PowerShell unavailable by policy) returns `Y7a`:
  > `"Enterprise policy requires sandboxing, but sandboxing is not available on native Windows. Shell command execution is blocked on this platform by policy."` (`Y7a` @442982-442983)
- code 10 @443186-443195: sleep guard `Q7a(e.command)` (msg @443187) (PowerShell analogue), same Blocked-message family:
  > `` `Blocked: ${t}. To wait for a condition, use Monitor with an until-loop (e.g. \`until <check>; do sleep 2; done\` — Monitor runs bash). To wait for a command you started, use run_in_background: true. Do not chain shorter sleeps to work around this block.` ``
`X7a` (unavailable check) @442808.

### 8c. checkPermissions (`cli_inner_pretty.js:443200-443202`)
`return await $7a(e, t);` (PowerShell-specific permission resolver). `preparePermissionMatcher` @443137-443159 builds command-prefix matchers via `hxe`/`BL`/`NA`/`VMt`, falling back to glob `t8`. `isReadOnly` @443133-443136: `g7a(e.command)` (mutating?) ? false : `k4n(e.command)`.

---

## 9. REPL (`wpo` @427548)

**Name const:** `var PA = "REPL"` — `cli_inner_pretty.js:221566`.
**Description:** `a9a()` @427562-427564; **prompt** `i9a()` @427558-427560. Asset `REPL.md` shows two description variants (`"Execute JavaScript to read, write, edit files and run shell commands"` / `"Execute JavaScript code with access to Claude Code tools"`). Header @427548-427551: `searchHint:"execute JavaScript with programmatic tool access"`, **`maxResultSizeChars` is a getter** → `q9a()`.
**`isEnabled() { return nI(); }`** @427565-427567 (`nI` @221558 — gate). `isConcurrencySafe()`→`!1`, `isReadOnly()`→`!1` @427568-427573.

### 9a. Input schema `FPp` (`cli_inner_pretty.js:427520-427531`)
```js
H.strictObject({
  code:        H.string().describe("JavaScript code to execute. Supports top-level await. State persists across calls."),
  description: H.string().optional().describe('Clear, concise description of what this script does in active voice (5-10 words). E.g. "Trace upgrade message to its GrowthBook flag"'),
  timeout:     H.number().optional().describe("Optional timeout in milliseconds (default 30000, max 600000)"),
})
```
Fields: `code`, `description`, `timeout`. Output schema `UPp` @427532 (`code, result, stdout, stderr, error, registeredTools, images, documents`). `GPp = new Set(["stdout","stderr","error","result"])` @427547.

### 9b. checkPermissions (`cli_inner_pretty.js:427580-427582`)
`async checkPermissions() { return { behavior: "allow" }; }` — REPL itself is always allowed; inner tool calls are individually permission-checked at runtime.

### 9c. call (`cli_inner_pretty.js:427583-…`)
Per-agent REPL context (`getReplContexts()[agentId]`), timeout clamp `Math.min(timeout ?? jPp, G3n)`; two watchdogs:
- **script-time watchdog** `JPp(c, …)` @427597 → `` `REPL execution timed out after ${c}ms of script time (inner tool calls excluded). Script may still be running — avoid unbounded awaits.` ``
- **inner-tool watchdog** `eMp(…)` @427603 → emits `tengu_repl_inner_watchdog_fired`, aborts, message `` `REPL inner tool call ${x.toolName} exceeded ${I}ms watchdog …` ``.
Progress events of `bash_progress`/inner tools are forwarded; context is reused when `boundaryUuid` matches the first message uuid (`k9a`/`L9a` hydration).

---

## 10. LSP (`Opo` @429593)

**Name const:** `var Vlt = "LSP"` — `cli_inner_pretty.js:368922`.
**Description (and prompt):** `qso` @368923 (`"Interact with Language Server Protocol (LSP) servers to get code intelligence features. …"`, matches asset). Header @429593-429598: `searchHint:"code intelligence (definitions, references, symbols, hover)", maxResultSizeChars:1e5, isLsp:!0`. `shouldDefer:!0` @429605. **`isEnabled() { return lsa(); }`** @429603-429605 (`lsa = aje.isConnected` @289753). `isReadOnly`/`isConcurrencySafe` both `!0`. `ruleContentField:"filePath"`, `getPath({filePath}) => Ds(filePath)`.

### 10a. Input schema `SMp` (`cli_inner_pretty.js:429547-429568`)
```js
H.strictObject({
  operation: H.enum(["goToDefinition","findReferences","hover","documentSymbol","workspaceSymbol",
                     "goToImplementation","prepareCallHierarchy","incomingCalls","outgoingCalls"]).describe("The LSP operation to perform"),
  filePath:  H.string().describe("The absolute or relative path to the file"),
  line:      H.number().int().positive().describe("The line number (1-based, as shown in editors)"),
  character: H.number().int().positive().describe("The character offset (1-based, as shown in editors)"),
  query:     H.string().optional().describe("The symbol name or partial name to search for (workspaceSymbol only). ..."),
})
```
Fields: `operation`, `filePath`, `line`, `character`, `query`. Output schema `EMp` @429569 (`operation, result, filePath, resultCount, fileCount`).

### 10b. validateInput (`cli_inner_pretty.js:429622-429642`)
- code 3 @429624: `` `Invalid input: ${t.error.message}` `` (re-validates via `S8a().safeParse`).
- UNC/`//` short-circuit @429627.
- code 1 @429632: `` `File does not exist: ${e.filePath}` `` (ENOENT).
- code 4 @429636: `` `Cannot access file: ${e.filePath}. ${i.message}` `` (other stat error).
- code 2 @429641: `` `Path is not a file: ${e.filePath}` ``.

### 10c. checkPermissions (`cli_inner_pretty.js:429643-429645`)
`return _te(Opo, e, Br(t));` (read helper). No `preparePermissionMatcher` (path-based via `getPath`).

### 10d. call (`cli_inner_pretty.js:429650-…`)
Waits for pending LSP startup (`csa()`), gets server manager `pxe()` (returns "not initialized" result if absent), maps `{operation, filePath}` → `{method, params}` via `HMp`, opens the file in the server if needed (rejects when `size > bMp` ≈ 10MB → `` `File too large for LSP analysis (${MB}MB exceeds 10MB limit)` ``), sends request, formats result; "No LSP server available for file type: …" when no server matches the extension.

---

## 11. NEW-in-2.1.183 (verified via 0-count grep in 2.1.156 BEFORE-bundle `…/2.1.156/extract/cli_inner_pretty.js`)

| Feature | 2.1.183 anchor | 2.1.156 grep count |
|---|---|---|
| **velvet-mallet killswitch** (Write not-read guard skip) | `tengu_velvet_mallet` @390709 | `grep -c 'tengu_velvet_mallet'` = **0** → NEW |
| **velvet-hammer killswitch** (Edit not-read guard skip) | `tengu_velvet_hammer` @444631 | `grep -c 'tengu_velvet_hammer'` = **0** → NEW |
| Subagent .md report-file block | `tengu_subagent_md_report_blocked` + message @390676-390688 | `grep -c 'Subagents should return findings as text'` = **1** → carryover from 2.1.156 |
| Bash/PowerShell sleep guard ("Blocked: …Monitor with an until-loop") | `GFp` @450238, msg @450748; `Q7a` PowerShell @443187 | `grep -c 'use Monitor with an until-loop'` = **4** → carryover |
| Read `truncatedByTokenCap` output field | schema @463468 | `grep -c 'truncatedByTokenCap'` = **4** → carryover |
| Grep `offset` pagination | schema @370716, `sio` paginator | `grep -c 'Skip first N lines/entries before applying head_limit'` = **1** → carryover |
| PowerShell tool object | `Mdo` @443112 | `grep -c 'Run PowerShell command'` = **1** → carryover |
| REPL tool object | `wpo` @427548 | `grep -c 'execute JavaScript with programmatic tool access'` = **1** → carryover |

> Net: the **string-confirmed new** items in this group vs 2.1.156 are the **`tengu_velvet_mallet`** (Write) and **`tengu_velvet_hammer`** (Edit) not-read-guard SKIP killswitches — both are 0-count in the 2.1.156 before-bundle. These let the "File has not been read yet" / stale-read guards be bypassed for a velvet-bucketed cohort. The Write subagent-report-block, sleep guards, partial-view token-cap pagination, and Grep offset pagination all already existed in 2.1.156. (Behavioral wiring of these into the redesigned subagent/team paths may still differ — flag for reconstructor.)

---

## 12. Shared error/constant strings (verbatim, reused across tools)

- `kze` (`cli_inner_pretty.js:48727-48728`) — **Perforce read-only** error, used in Write (code 6 @390702), Edit (code 11 @444576), NotebookEdit (code 11 @391131). Verbatim: `"File is read-only — it has not been opened for edit in Perforce. Run \`p4 edit <file>\` to check it out, then retry. Do not chmod the file writable; that bypasses Perforce tracking."` (triggered when `Lze(mode)` detects a read-only mode bit).
- `bN` (path-suggestion preamble) + `Pt()` (cwd) appear in "File does not exist. … Did you mean …?" across Read/Edit/Glob/Grep.
- `"File is in a directory that is denied by your permission settings."` — Read code 1, Write code 1, Edit code 2 (verbatim identical).
- `"File has not been read yet. Read it first before writing to it."` — Write code 2, Edit code 6, NotebookEdit code 9 (verbatim identical).
- `"File has been modified since read, either by the user or by a linter. Read it again before attempting to write it."` — Write code 3, Edit code 7, NotebookEdit code 10 (verbatim identical).
