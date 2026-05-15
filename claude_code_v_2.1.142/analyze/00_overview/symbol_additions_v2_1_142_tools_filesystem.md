# Symbol Additions — v2.1.142 Tools (Filesystem + Shell)

> Filesystem and shell tool symbol mappings used by the v2.1.142 unit per-tool deep dives.
> Place: this file maps the **Tools** subsystem additions for the filesystem/shell tool set in v2.1.142.
> When the symbol_index_*.md files are produced for v2.1.142, these mappings should be merged into
> `symbol_index_core_execution.md` (tools section) and `symbol_index_infra_integration.md` (LSP section).

Path conventions:
- `cli_inner_pretty.js` = `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`
- per-decl files = `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown/<id>.js`

---

## Module: Tools — Tool Builder + Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XK | buildTool | cli_inner_pretty.js (tool factory) | function |
| Sq | BASH_TOOL_NAME | cli_inner_pretty.js:419457 | constant |
| EK | POWERSHELL_TOOL_NAME | cli_inner_pretty.js:405746 | constant |
| G7 | FILE_EDIT_TOOL_NAME | cli_inner_pretty.js:415452 | constant |
| Bq | FILE_READ_TOOL_NAME | cli_inner_pretty.js:407220 | constant |
| o4 | FILE_WRITE_TOOL_NAME | cli_inner_pretty.js:359973 | constant |
| d1 | GLOB_TOOL_NAME | cli_inner_pretty.js:339350 | constant |
| v9 | GREP_TOOL_NAME | cli_inner_pretty.js:339027 | constant |
| VP | NOTEBOOK_EDIT_TOOL_NAME | cli_inner_pretty.js:361759 | constant |
| HV | TODO_WRITE_TOOL_NAME | cli_inner_pretty.js:272171 | constant |
| m3 | REPL_TOOL_NAME | cli_inner_pretty.js:380387 | constant |
| clH | LSP_TOOL_NAME | cli_inner_pretty.js:382950 | constant |
| cE | TOOL_SUMMARY_MAX_LENGTH | cli_inner_pretty.js (constants) | constant |
| QW | SHELL_TOOL_NAMES_ARRAY | cli_inner_pretty.js:141680 | constant |

---

## Module: Tools — BashTool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| L4 | BashTool | cli_inner_pretty.js:419457-419800 | object |
| z64 | bashInputSchema | cli_inner_pretty.js (lazy schema) | function |
| F55 | bashOutputSchema | cli_inner_pretty.js (lazy schema) | function |
| $64 | getBashPrompt | cli_inner_pretty.js (prompt builder) | function |
| Q55 | detectBlockedSleepPattern | cli_inner_pretty.js (sleep guard) | function |
| m55 | isSearchOrReadBashCommand | cli_inner_pretty.js (compound classifier) | function |
| rM$ | commandHasAnyCd | cli_inner_pretty.js (cd detector) | function |
| A78 | checkReadOnlyConstraints | cli_inner_pretty.js (read-only validation) | function |
| FUH | parseForSecurity | cli_inner_pretty.js (bash AST parser) | function |
| O64 | permissionRuleExtractPrefix | cli_inner_pretty.js (rule prefix extractor) | function |
| bNH | matchWildcardPattern | cli_inner_pretty.js (glob matcher) | function |
| XL$ | bashToolHasPermission | cli_inner_pretty.js (permission decision) | function |
| FvH | parseSedEditCommand | cli_inner_pretty.js (sed → edit converter) | function |
| Iw8 | fileEditUserFacingName | cli_inner_pretty.js (edit UI label) | function |
| f64 | isExplicitAutoMode | cli_inner_pretty.js (auto-mode classifier) | function |
| eP$ | isBackgroundTasksDisabled | cli_inner_pretty.js (env flag) | variable |
| qg | isMonitorFeatureEnabled | cli_inner_pretty.js (feature flag) | function |
| c7 | truncate | cli_inner_pretty.js (string truncator) | function |
| bH | isEnvTruthy | cli_inner_pretty.js (env parser) | function |
| bV | shouldUseSandbox | cli_inner_pretty.js:421425-421432 | function |

---

## Module: Tools — FileEditTool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _D | FileEditTool | cli_inner_pretty.js:415451-415900 | object |
| CY8 | fileEditInputSchema | cli_inner_pretty.js (lazy schema) | function |
| Dv6 | fileEditOutputSchema | cli_inner_pretty.js (lazy schema) | function |
| ZS6 | getEditToolUseSummary | cli_inner_pretty.js (UI summary) | function |
| o$4 | getEditToolDescription | cli_inner_pretty.js (prompt builder) | function |
| eq | expandPath | cli_inner_pretty.js (path normalizer) | function |
| Tk | matchWildcardPattern | cli_inner_pretty.js (permission matcher) | function |
| VkH | checkWritePermissionForTool | cli_inner_pretty.js (write permission) | function |
| dnH | checkTeamMemSecrets | cli_inner_pretty.js (team-memory guard) | function |
| kY8 | checkSensitivePatterns | cli_inner_pretty.js (secret scanner) | function |
| yL | matchingRuleForInput | cli_inner_pretty.js (deny rule lookup) | function |
| QRH | isModeRestricted | cli_inner_pretty.js (file mode check) | function |
| gRH | FILE_READ_ONLY_ERROR_MESSAGE | cli_inner_pretty.js (constant) | constant |
| $84 | MAX_EDIT_FILE_SIZE | cli_inner_pretty.js (1 GiB) | constant |
| f8 | isENOENT | cli_inner_pretty.js (errno check) | function |
| l7 | formatFileSize | cli_inner_pretty.js (size formatter) | function |
| s$4 | renderEditToolUseMessage | cli_inner_pretty.js (UI) | function |
| t$4 | renderEditToolResultMessage | cli_inner_pretty.js (UI) | function |
| e$4 | renderEditToolUseRejectedMessage | cli_inner_pretty.js (UI) | function |
| H84 | renderEditToolUseErrorMessage | cli_inner_pretty.js (UI) | function |

---

## Module: Tools — FileReadTool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $Y | FileReadTool | cli_inner_pretty.js:407219-407600 | object |
| C45 | fileReadInputSchema | cli_inner_pretty.js (lazy schema) | function |
| b45 | fileReadOutputSchema | cli_inner_pretty.js (lazy schema) | function |
| AVK | FILE_READ_DESCRIPTION | cli_inner_pretty.js (constant) | constant |
| OVK | getFileReadPrompt | cli_inner_pretty.js (prompt builder) | function |
| c7H | getDefaultFileReadingLimits | cli_inner_pretty.js (limits) | function |
| fVK | TARGETED_RANGE_NUDGE | cli_inner_pretty.js (constant) | constant |
| YVK | UNTARGETED_RANGE_NUDGE | cli_inner_pretty.js (constant) | constant |
| x45 | LINES_LIMIT_DEFAULT | cli_inner_pretty.js (constant) | constant |
| CwH | checkReadPermissionForTool | cli_inner_pretty.js (read permission) | function |
| Qe7 | getReadUserFacingName | cli_inner_pretty.js (UI) | function |
| MI6 | getReadToolUseSummary | cli_inner_pretty.js (UI) | function |
| pe7 | renderReadToolUseMessage | cli_inner_pretty.js (UI) | function |
| Ue7 | renderReadToolUseTag | cli_inner_pretty.js (UI) | function |
| Fe7 | renderReadToolResultMessage | cli_inner_pretty.js (UI) | function |
| I$ | getCwd | cli_inner_pretty.js (helper) | function |

---

## Module: Tools — FileWriteTool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Yw | FileWriteTool | cli_inner_pretty.js:359972-360400 | object |
| sn_ | fileWriteInputSchema | cli_inner_pretty.js (lazy schema) | function |
| tn_ | fileWriteOutputSchema | cli_inner_pretty.js (lazy schema) | function |
| qcK | getWriteToolDescription | cli_inner_pretty.js (prompt builder) | function |
| mp7 | getWriteUserFacingName | cli_inner_pretty.js (UI) | function |
| kv6 | getWriteToolUseSummary | cli_inner_pretty.js (UI) | function |
| pp7 | renderWriteToolUseMessage | cli_inner_pretty.js (UI) | function |
| Bp7 | isResultTruncatedForWrite | cli_inner_pretty.js (UI) | function |
| Up7 | renderWriteToolUseRejectedMessage | cli_inner_pretty.js (UI) | function |
| Fp7 | renderWriteToolUseErrorMessage | cli_inner_pretty.js (UI) | function |
| gp7 | renderWriteToolResultMessage | cli_inner_pretty.js (UI) | function |
| Mv6 | hunkSchema | cli_inner_pretty.js (lazy schema) | function |
| wv6 | gitDiffSchema | cli_inner_pretty.js (lazy schema) | function |

---

## Module: Tools — GlobTool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oI | GlobTool | cli_inner_pretty.js:339349-339447 | object |
| sF_ | globInputSchema | cli_inner_pretty.js (lazy schema) | function |
| tF_ | globOutputSchema | cli_inner_pretty.js (lazy schema) | function |
| MK6 | GLOB_DESCRIPTION | cli_inner_pretty.js (constant) | constant |
| MVK | getGlobPrompt | cli_inner_pretty.js (prompt builder) | function |
| gS7 | getGlobUserFacingName | cli_inner_pretty.js (UI) | function |
| jT6 | getGlobToolUseSummary | cli_inner_pretty.js (UI) | function |
| QS7 | renderGlobToolUseMessage | cli_inner_pretty.js (UI) | function |
| dS7 | renderGlobToolUseErrorMessage | cli_inner_pretty.js (UI) | function |
| cS7 | renderGlobToolResultMessage | cli_inner_pretty.js (UI) | function |
| xS7 | glob | cli_inner_pretty.js (native bfs wrapper) | function |
| FRH | toRelativePath | cli_inner_pretty.js (path relativizer) | function |
| s5H | suggestPathUnderCwd | cli_inner_pretty.js (path suggester) | function |
| aN | FILE_NOT_FOUND_CWD_NOTE | cli_inner_pretty.js (constant) | constant |

---

## Module: Tools — GrepTool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hV | GrepTool | cli_inner_pretty.js:339026-339330 | object |
| iF_ | grepInputSchema | cli_inner_pretty.js (lazy schema) | function |
| aF_ | grepOutputSchema | cli_inner_pretty.js (lazy schema) | function |
| rF_ | VCS_DIRECTORIES_TO_EXCLUDE | cli_inner_pretty.js:339013 | constant |
| YK6 | getGrepDescription | cli_inner_pretty.js (prompt builder) | function |
| MT6 | getGrepToolUseSummary | cli_inner_pretty.js (UI) | function |
| BS7 | renderGrepToolUseMessage | cli_inner_pretty.js (UI) | function |
| pS7 | renderGrepToolUseErrorMessage | cli_inner_pretty.js (UI) | function |
| US7 | renderGrepToolResultMessage | cli_inner_pretty.js (UI) | function |
| DT6 | formatLimitInfo | cli_inner_pretty.js (UI) | function |
| wT6 | applyHeadLimit | cli_inner_pretty.js (limit applicator) | function |
| wt | ripGrep | cli_inner_pretty.js (rg invoker) | function |
| ilH | normalizePatternsToPath | cli_inner_pretty.js (path normalizer) | function |
| rlH | getFileReadIgnorePatterns | cli_inner_pretty.js (ignore reader) | function |
| nlH | getGlobExclusionsForPluginCache | cli_inner_pretty.js (orphan filter) | function |
| Pb | semanticNumber | cli_inner_pretty.js (Zod coercer) | function |
| P2 | semanticBoolean | cli_inner_pretty.js (Zod coercer) | function |
| S8 | plural | cli_inner_pretty.js (UI helper) | function |

---

## Module: Tools — NotebookEditTool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fB | NotebookEditTool | cli_inner_pretty.js:361758-362200 | object |
| bi_ | notebookEditInputSchema | cli_inner_pretty.js (lazy schema) | function |
| xi_ | notebookEditOutputSchema | cli_inner_pretty.js (lazy schema) | function |
| PU7 | NOTEBOOK_EDIT_DESCRIPTION | cli_inner_pretty.js (constant) | constant |
| WU7 | NOTEBOOK_EDIT_PROMPT | cli_inner_pretty.js (constant) | constant |
| IU7 | notebookEditPathModule | cli_inner_pretty.js (path module) | variable |
| Fv6 | getNotebookEditToolUseSummary | cli_inner_pretty.js (UI) | function |
| vU7 | renderNotebookEditToolUseMessage | cli_inner_pretty.js (UI) | function |
| kU7 | renderNotebookEditToolUseRejectedMessage | cli_inner_pretty.js (UI) | function |
| NU7 | renderNotebookEditToolUseErrorMessage | cli_inner_pretty.js (UI) | function |
| EU7 | renderNotebookEditToolResultMessage | cli_inner_pretty.js (UI) | function |
| Mc | readFileSyncWithMetadata | cli_inner_pretty.js (FS helper) | function |
| Y7 | safeParseJSON | cli_inner_pretty.js (JSON parser) | function |
| hX$ | parseCellId | cli_inner_pretty.js (cell-N parser) | function |
| oN | getFileModificationTime | cli_inner_pretty.js (FS helper) | function |
| Yx8 | fileHistoryEnabled | cli_inner_pretty.js (history flag) | function |

---

## Module: Tools — TodoWriteTool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DMH | TodoWriteTool | cli_inner_pretty.js:272170-272220 | object |
| wP_ | todoWriteInputSchema | cli_inner_pretty.js (lazy schema) | function |
| DP_ | todoWriteOutputSchema | cli_inner_pretty.js (lazy schema) | function |
| $dH | TodoListSchema | cli_inner_pretty.js (lazy schema) | function |
| iO7 | TODO_WRITE_DESCRIPTION | cli_inner_pretty.js (constant) | constant |
| nO7 | getTodoWritePrompt | cli_inner_pretty.js (prompt builder) | function |
| nw | isTodoV2Enabled | cli_inner_pretty.js (feature flag) | function |
| v$ | getSessionId | cli_inner_pretty.js (session helper) | function |

---

## Module: Tools — REPLTool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| rN6 | REPLTool | cli_inner_pretty.js:380386-380700 | object |
| jt_ | replInputSchema | cli_inner_pretty.js (lazy schema) | function |
| Jt_ | replOutputSchema | cli_inner_pretty.js (lazy schema) | function |
| Lt_ | REPL_RESERVED_KEYS | cli_inner_pretty.js:380385 | constant |
| Sc7 | getReplMaxResultSize | cli_inner_pretty.js (limits) | function |
| ad7 | getReplPrompt | cli_inner_pretty.js (prompt) | function |
| sd7 | getReplDescription | cli_inner_pretty.js (description) | function |
| WL | isReplEnabled | cli_inner_pretty.js (feature flag) | function |
| LZH | DEFAULT_REPL_AGENT_ID | cli_inner_pretty.js (constant) | constant |
| Xt_ | REPL_DEFAULT_TIMEOUT_MS | cli_inner_pretty.js (constant) | constant |
| iN6 | REPL_HARD_TIMEOUT_MS | cli_inner_pretty.js (constant) | constant |
| vt_ | newReplPromise | cli_inner_pretty.js (deferred promise factory) | function |
| kt_ | newReplWatchdog | cli_inner_pretty.js (timeout watcher) | function |
| Nt_ | validateReplScript | cli_inner_pretty.js (pre-flight check) | function |
| Wt_ | recordReplToolCall | cli_inner_pretty.js (call recorder) | function |
| Xc7 | createReplContext | cli_inner_pretty.js (VM context factory) | function |
| Lc7 | refreshReplContext | cli_inner_pretty.js (re-hydrate context) | function |
| yc7 | filterToolsForRepl | cli_inner_pretty.js (tool filter) | function |
| Cc7 | nodeVmModule | cli_inner_pretty.js (vm module) | variable |
| Tc7 | summarizeReplCalls | cli_inner_pretty.js (call summarizer) | function |
| Gc7 | replayReplCalls | cli_inner_pretty.js (call replayer) | function |
| P38 | wrapReplCode | cli_inner_pretty.js (code wrapper) | function |
| W38 | postProcessReplResult | cli_inner_pretty.js (result coercer) | function |
| h38 | resolveReplObject | cli_inner_pretty.js (final o resolver) | function |
| I38 | extractReplHistoryFromMessages | cli_inner_pretty.js (transcript helper) | function |
| Tt_ | extractReplDocuments | cli_inner_pretty.js (PDF collector) | function |
| Zt_ | extractReplImages | cli_inner_pretty.js (image collector) | function |
| Ic7 | collectReplNewMessages | cli_inner_pretty.js (msg collector) | function |
| ed7 | exportReplNewTools | cli_inner_pretty.js (tool exporter) | function |
| lN6 | exportReplCallLog | cli_inner_pretty.js (call-log exporter) | function |
| nE | makeChildAbortController | cli_inner_pretty.js (child abort) | function |
| fPH | getCurrentGithubRepo | cli_inner_pretty.js (gh helper) | function |
| y38 | preloadReplPrimitives | cli_inner_pretty.js (primitive preload) | function |
| xL | isUserMessage | cli_inner_pretty.js (message check) | function |

---

## Module: Tools — PowerShellTool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| dy6 | PowerShellTool | cli_inner_pretty.js:405745-406100 | object |
| O45 | powerShellInputSchema | cli_inner_pretty.js (lazy schema) | function |
| M45 | powerShellOutputSchema | cli_inner_pretty.js (lazy schema) | function |
| Oe7 | getPowerShellPrompt | cli_inner_pretty.js (prompt) | function |
| Te7 | isWindowsRequired | cli_inner_pretty.js (windows gate) | function |
| Ge7 | POWERSHELL_PLATFORM_ERROR | cli_inner_pretty.js (constant) | constant |
| ve7 | detectBlockedPowerShellSleep | cli_inner_pretty.js (sleep guard for PS) | function |
| _45 | isPowerShellSearchOrRead | cli_inner_pretty.js (PS read/search classifier) | function |
| gt7 | hasDangerousPowerShellCmdlet | cli_inner_pretty.js (destructive check) | function |
| PM8 | isPowerShellReadOnly | cli_inner_pretty.js (PS read-only check) | function |
| bDH | parsePowerShellForSecurity | cli_inner_pretty.js (PS AST parser) | function |
| qW | extractPowerShellSubcommands | cli_inner_pretty.js (PS subcommand extractor) | function |
| Vz | toPowerShellAlias | cli_inner_pretty.js (alias resolver) | function |
| xY$ | extractPowerShellPrefix | cli_inner_pretty.js (PS rule prefix) | function |
| We7 | EOL_CONSTANT | cli_inner_pretty.js (constant) | constant |
| z45 | POWERSHELL_BLOCKING_BUDGET_MS | cli_inner_pretty.js (constant) | constant |
| D45 | runPowerShellCommand | cli_inner_pretty.js (PS runner) | function |
| Su | isPowerShellToolEnabled | cli_inner_pretty.js:141659-141666 | function |
| Y9 | isBashAvailableOnHost | cli_inner_pretty.js:141667-141670 | function |
| PZH | getDefaultShellName | cli_inner_pretty.js:141671-141673 | function |
| P6H | findGitBashOnWindows | cli_inner_pretty.js (Git Bash lookup) | function |
| iY8 | resolveExistingExecutable | cli_inner_pretty.js (executable resolver) | function |
| Ji_ | testFileExists | cli_inner_pretty.js (fs.exists helper) | function |
| RK8 | trackGitOperations | cli_inner_pretty.js (git telemetry) | function |
| Af8 | resetCwdIfOutsideProject | cli_inner_pretty.js (cwd reset) | function |
| _f8 | stdErrAppendShellResetMessage | cli_inner_pretty.js (UI shim) | function |
| mf$ | extractPowerShellHints | cli_inner_pretty.js (hint extractor) | function |
| OP$ | maybeRecordPluginHint | cli_inner_pretty.js (hint recorder) | function |
| Y$$ | EndTruncatingAccumulator | cli_inner_pretty.js (output accumulator) | class |
| vt7 | interpretPowerShellResult | cli_inner_pretty.js (PS semantic) | function |
| VrH | isMonitorBetaForPS | cli_inner_pretty.js (PS monitor flag) | variable |

---

## Module: Tools — LSPTool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fE6 | LSPTool | cli_inner_pretty.js:382949-383200 | object |
| ze_ | lspInputSchema | cli_inner_pretty.js (lazy schema) | function |
| Ye_ | lspOutputSchema | cli_inner_pretty.js (lazy schema) | function |
| Pl7 | lspDiscriminatedSchema | cli_inner_pretty.js (lazy schema) | function |
| t06 | LSP_DESCRIPTION | cli_inner_pretty.js:337457 | constant |
| Ae_ | MAX_LSP_FILE_SIZE_BYTES | cli_inner_pretty.js (10 MB) | constant |
| FB7 | isLspConnected | cli_inner_pretty.js (gate) | function |
| QnH | getInitializationStatus | cli_inner_pretty.js (status getter) | function |
| gB7 | waitForInitialization | cli_inner_pretty.js (await init) | function |
| qDH | getLspServerManager | cli_inner_pretty.js (manager getter) | function |
| fe_ | getMethodAndParams | cli_inner_pretty.js (operation mapper) | function |
| we_ | formatLspResult | cli_inner_pretty.js (UI formatter) | function |
| vl7 | getLspUserFacingName | cli_inner_pretty.js (UI) | function |
| kl7 | renderLspToolUseMessage | cli_inner_pretty.js (UI) | function |
| Nl7 | renderLspToolUseErrorMessage | cli_inner_pretty.js (UI) | function |
| El7 | renderLspToolResultMessage | cli_inner_pretty.js (UI) | function |
| hl7 | filterLocationsToCwd | cli_inner_pretty.js (cwd filter) | function |
| Sl7 | lspUrlModule | cli_inner_pretty.js (url module) | variable |
| YE6 | lspPathModule | cli_inner_pretty.js (path module) | variable |
| Il7 | lspFsModule | cli_inner_pretty.js (fs.promises) | variable |
| p38 | lspLocationLinkToLocation | cli_inner_pretty.js (location coercer) | function |
| y6 | toError | cli_inner_pretty.js (error coercer) | function |
| EH | logError | cli_inner_pretty.js (error logger) | function |
| N | logForDebugging | cli_inner_pretty.js (debug logger) | function |

---

## Notes on Naming

- **Tool factory `XK`**: All tool objects are constructed via `XK({...})` which is the `buildTool` factory. The returned object is conventionally assigned to a 2-3 character variable (e.g., `L4` for BashTool).
- **Lazy schemas**: Input/output schemas are wrapped in `yH(() => ...)` (yH = `lazySchema`) to defer Zod object construction until first access. This shaves ~80ms off cold-start when many tools are registered.
- **UI render fns**: For each tool, four render functions are pulled in: `renderToolUseMessage`, `renderToolResultMessage`, `renderToolUseRejectedMessage`, `renderToolUseErrorMessage`. The names share a tool-specific suffix (e.g., `s$4`/`t$4`/`e$4`/`H84` for FileEdit).
- **Helper aliasing**: Common helpers (`eq` = `expandPath`, `f8` = `isENOENT`, `I$` = `getCwd`, `Tk` = `matchWildcardPattern`) appear in every tool — they are shared across the file-system toolset.

---

## v2.1.142-specific symbol additions vs v2.1.112

| Area | Added in 2.1.x | Why it matters |
|------|----------------|----------------|
| `Su` (`isPowerShellToolEnabled`) | 2.1.112 → made conditional on Git Bash absence in 2.1.120 | Drives whether PowerShellTool ships in the tool registry |
| `Y9` (`isBashAvailableOnHost`) | 2.1.120 | Used by `PZH` to pick the default shell |
| `PZH` (`getDefaultShellName`) | 2.1.120 | Returns `"powershell"` when Git Bash is missing |
| `xS7` (native `glob`) | 2.1.117 | Replaces `fast-glob` with embedded `bfs` on macOS/Linux native builds |
| `wt` (native `ripGrep`) | 2.1.117 | Replaces external `rg` with embedded `ugrep`-ish binary |
| `bV` (`shouldUseSandbox`) | always present; rebuilt 2.1.142 | Sandbox gating |
| `f64` (`isExplicitAutoMode`) | added v2.1.130-ish | Allows dangerouslyDisableSandbox to bypass auto-mode |
| `Iw8` (`fileEditUserFacingName`) | 2.1.130s | Used to re-label `sed -i` Bash calls as Edit |
| `ed7` (`exportReplNewTools`) | 2.1.139 | Surfaces `registerTool` results from REPL up to the tool registry |
| Plugin-provided LSP server discovery in `/plugin` details (2.1.142) | new in 2.1.142 | Adds `lspServers` to `claude plugin details` output |
