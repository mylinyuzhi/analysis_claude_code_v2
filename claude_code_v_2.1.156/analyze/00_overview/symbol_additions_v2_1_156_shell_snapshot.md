# Symbol Additions — v2.1.156 Shell Snapshot (module 38_shell_snapshot)

These mappings cover every obfuscated identifier introduced, touched, or load-bearing in the
v2.1.156 **Shell Snapshot** subsystem (the bash/zsh login-shell snapshot capture + replay that the
Bash tool sources before every command). The subsystem builds a `~/.claude/shell-snapshots/snapshot-*.sh`
script that re-creates the user's interactive shell environment (functions, aliases, options, PATH)
inside the non-interactive subprocess, then layers Claude Code's own shell integrations (rg / find /
grep shadow functions, plugin bin paths, `_cc_bin` argv0 resolution) on top.

Each row gives the v2.1.156 obfuscated identifier, the readable name, `file:line`, and type.
Every line was verified by reading
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` at that location.

Cross-validated against:
- v2.1.156 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/utils/bash/ShellSnapshot.ts` — the original
  rule-based snapshot capture has a readable precursor here.
- v2.1.142 reference docs: `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.142/analyze/38_shell_snapshot/`
- Module docs: `claude_code_v_2.1.156/analyze/38_shell_snapshot/` (single source of truth:
  `_evidence_brief.md`).

> **NEW vs v2.1.88 (absent from the clean `ShellSnapshot.ts` source, confirmed by reading both):**
> - `ws7` (`probeSpawnEnv`) — the spawn-env probe side-channel (runs `shell -c env`, parses `KEY=` lines).
> - `i98` (`setSpawnEnvKeys`) — stores the probe's key set into `l26`, feeding the env-key union.
> - `iD$` (`getKnownEnvKeys`) **env-key union** — `Object.keys(subprocessEnv()) ∪ fV5 ∪ K97 ∪ l26`;
>   consumed by the bash permission/policy at 242985 / 440809 / 441400 (connects snapshot → permissions).
> - The **`-S dfs`** literal added to the find/bfs integration (`iD_` at 340969): the bfs invocation is
>   now `xx6("find","bfs",["-S","dfs","-regextype","findutils-default"])`. `-S dfs` forces depth-first
>   strategy to bound open directory handles (macOS vnode-table exhaustion fix). v2.1.88 had only
>   `["-regextype","findutils-default"]`.
> - **`CLAUDE_EFFORT`** added to `fV5` (`CLAUDE_INJECTED_ENV_KEYS`) — the new injected-env allowlist member.

> **Naming notes (single source of truth):**
> - `Gs7` is named **`createBashShellAdapter`** here, matching
>   `symbol_additions_v2_1_156_permission_policy.md` (which owns this row for the TMPDIR-override
>   theme). The v2.1.142 lineage name was `createBashShellProvider` / `$U7` — alias only.
> - The env-key union's obfuscated name is **`iD$`** (with the trailing `$`), at 209864. The
>   `_evidence_brief.md` shorthand "`iD`-union" elides the `$`; the verified bundle identifier is `iD$`.
> - `cD_` (`shellSingleQuote`) is defined but the live snapshot paths quote via `O4` (shell-quote);
>   `cD_` is the local single-quote helper only.
> - `rD_` (`createBigQueryShellIntegration`) is a dead `return null` stub; the BigQuery heredoc path
>   lives inside `aD_` (`getClaudeCodeSnapshotContent`).

---

## Module: Shell Snapshot — Core creation cluster (cli_inner_pretty.js ~340921–341370)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cD_` | `shellSingleQuote` (local `'…'` wrapper escaping `'`→`'"'"'`; defined but snapshot paths quote via `O4`) | cli_inner_pretty.js:340921 | function |
| `xx6` | `createArgv0ShellFunction` (emits the cross-shell function `(funcName, argv0, prependArgs=[], denyPatterns=[])` with `_cc_bin` resolution + optional deny-pattern early-return) | cli_inner_pretty.js:340924 | function |
| `lD_` | `createRipgrepShellIntegration` (returns `{type:"function"\|"alias", snippet}` baking the bundled ripgrep into a `rg` shell function/alias) | cli_inner_pretty.js:340957 | function |
| `iD_` | `createFindGrepShellIntegration` (returns combined `unalias find/grep` + bfs/ugrep functions, or `null` if `!RL()`; calls `xx6("find","bfs",["-S","dfs","-regextype","findutils-default"])` at 340969 — the NEW `-S dfs` strategy) | cli_inner_pretty.js:340964 | function |
| `rD_` | `createBigQueryShellIntegration` (dead `return null` stub; live BigQuery heredoc path is inside `aD_`) | cli_inner_pretty.js:340979 | function |
| `ux6` | `getConfigFile` (maps shell path → `~/.zshrc` / `~/.bashrc` / `~/.profile`) | cli_inner_pretty.js:340982 | function |
| `oD_` | `getUserSnapshotContent` (captures user functions + shell options + aliases; zsh-vs-bash branches; functions filtered with `grep -vE '^_[^_]'`) | cli_inner_pretty.js:340986 | function |
| `aD_` | `getClaudeCodeSnapshotContent` (async; assembles rg fallback + find/grep shadow + bq(null) + the random-delimiter PATH heredoc) | cli_inner_pretty.js:341045 | function |
| `sD_` | `getSnapshotScript` (async; assembles the full `bash -c -l <script>` snapshot body: SNAPSHOT_FILE → source config → user content → claude content → existence check) | cli_inner_pretty.js:341109 | function |
| `ws7` | `probeSpawnEnv` (**NEW vs v2.1.88/142** spawn-env probe; runs `shell -c env`, parses keys via `tD_`, stores them via `i98`→`l26`) | cli_inner_pretty.js:341137 | function |
| `js7` | `createAndSaveSnapshot` (top-level orchestrator arrow fn; `execFile(shell, ["-c","-l", script], …)`, writes `snapshot-${type}-${Date.now()}-${rand6}.sh`, emits snapshot telemetry) | cli_inner_pretty.js:341168 | function |
| `Gs7` | `createBashShellAdapter` (factory returning the `type:"bash"` shell adapter; kicks off `js7` + `ws7`; returns the provider object — see permission-policy index for the TMPDIR-override theme) | cli_inner_pretty.js:341341 | function |

## Module: Shell Snapshot — Command-assembly helpers (consumer side, near `Gs7`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `NX8` | `spliceShellPrefix` (splices `CLAUDE_CODE_SHELL_PREFIX` around the assembled command) | cli_inner_pretty.js:341292 | function |
| `px6` | `hasHeredoc` (detects a `<<` heredoc, excluding the `<<` bit-shift operator) | cli_inner_pretty.js:341301 | function |
| `eD_` | `hasMultilineQuote` (detects multiline single/double-quoted strings spanning newlines) | cli_inner_pretty.js:341305 | function |
| `Js7` | `wrapCommandForExec` (heredoc/multiline-aware quoting of the command; appends `< /dev/null` when safe) | cli_inner_pretty.js:341310 | function |
| `HJ_` | `hasInputRedirect` (detects a `<` input redirect) | cli_inner_pretty.js:341319 | function |
| `Xs7` | `shouldAppendDevNull` (gate deciding whether `< /dev/null` may be appended) | cli_inner_pretty.js:341322 | function |
| `Ls7` | `substituteNulRedirect` (rewrites `>NUL`→`>/dev/null` via regex `$J_` at 341332) | cli_inner_pretty.js:341327 | function |
| `qJ_` | `disableExtglobPrefix` (emits `shopt -u extglob` for bash / `setopt NO_EXTENDED_GLOB…` for zsh) | cli_inner_pretty.js:341334 | function |
| `Os7` | `pipeSafeWrap` (pipe-safe command wrap applied when the command contains `\|`; referenced at 341379) | cli_inner_pretty.js:341379 | function |

## Module: Shell Snapshot — Env-key union cluster (cli_inner_pretty.js 209855–209896)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `n98` | `setSnapshotPresent` (sets `q97`, the boolean recording that a snapshot file now exists) | cli_inner_pretty.js:209855 | function |
| `_97` | `setSessionEnvKeys` (sets `K97` from `sessionEnvVars.keys()`; caller at 441112) | cli_inner_pretty.js:209858 | function |
| `i98` | `setSpawnEnvKeys` (**NEW** — sets `l26` from the spawn-env probe; callers in `ws7` at 341155 / 341146 / 341157) | cli_inner_pretty.js:209861 | function |
| `iD$` | `getKnownEnvKeys` (**NEW** env-key union `Object.keys(subprocessEnv()) ∪ fV5 ∪ K97 ∪ l26`; returns null if no snapshot or probe pending; consumed by bash permission/policy at 242985 / 440809 / 441400) | cli_inner_pretty.js:209864 | function |
| `fV5` | `CLAUDE_INJECTED_ENV_KEYS` (injected-env allowlist `["SHELL","GIT_EDITOR","CLAUDECODE","AI_AGENT","CLAUDE_CODE_SESSION_ID","TRACEPARENT","CLAUDE_CODE_EXECPATH","TMUX","TMPDIR","CLAUDE_CODE_TMPDIR","TMPPREFIX","BUN_OPTIONS","TEMP","TMP","CLAUDE_EFFORT"]` — **`CLAUDE_EFFORT` is NEW**) | cli_inner_pretty.js:209879 | constant |
| `tD_` | `envLineKeyRegex` (`/^([A-Za-z_][A-Za-z0-9_]*)=/` — extracts the KEY from each `KEY=value` line of the spawn-env probe output) | cli_inner_pretty.js:341290 | variable |

## Module: Shell Snapshot — Constants (init in `Ds7`, 341164–341167)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bx6` | `LITERAL_BACKSLASH` (`"\\"` — single literal backslash) | cli_inner_pretty.js:341164 | constant |
| `VX8` | `SNAPSHOT_CREATION_TIMEOUT` (`1e4` = 10000ms `execFile` timeout for snapshot creation) | cli_inner_pretty.js:341165 | constant |
| `mx6` | `CLAUDE_CODE_EXECPATH` (the env-var name string `"CLAUDE_CODE_EXECPATH"`, baked into the argv0 fn) | cli_inner_pretty.js:341166 | constant |
| `nD_` | `VCS_DIRECTORIES_TO_EXCLUDE` (`[".git",".svn",".hg",".bzr",".jj",".sl"]`; initialized at 341289) | cli_inner_pretty.js:341167 | constant |

## Module: Shell Snapshot — External helpers referenced (already mapped elsewhere; reuse names)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `L6H` | `getInstallBinDir` (returns `<home>/.local/bin`; used to bake the claude path into the argv0 fn) | cli_inner_pretty.js:323465 | function |
| `NV6` | `getPluginBinPaths` (async; returns plugin `bin/` dirs to prepend to PATH; concatenated at 341051–341055) | cli_inner_pretty.js:235220 | function |
| `Tv7` | `getSessionEnvScript` (async; reads `CLAUDE_ENV_FILE` + hook env files and joins them into the exec command) | cli_inner_pretty.js:270265 | function |

---

## Module: Shell Snapshot — CWD Read-Back & Concurrency Interaction (cross-cutting)

These symbols are surfaced by [`../38_shell_snapshot/bash_tool_integration.md`](../38_shell_snapshot/bash_tool_integration.md) §6 (CWD read-back gating, Bash concurrency, and how the model learns the working directory). They are **owned by other subsystems** (exec/tools, permission policy, prompt) — listed here only because they are the consumers of the adapter's `pwd -P` / cwd-file output and gate whether a Bash command persists cwd or runs in parallel. Verify against the owning module's index before reusing.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `R6H` | executeShellCommand (exec layer consuming the adapter; mints per-call random id `J` at 341623; runs the cwd read-back tail 341760-341776, gated by `preventCwdChanges`/`backgroundTaskId`) | cli_inner_pretty.js:341610 | function |
| `oU_` | bashCallGenerator (Bash tool `call` generator; derives `preventCwdChanges = !isMainThread` from `ctx.agentId` at 439846-439856) | cli_inner_pretty.js:439303 | function |
| `PD` | setCwd (resolves + persists post-command cwd; chains `tn8`→`sKH`; telemetry `tengu_shell_set_cwd`) | cli_inner_pretty.js:341792 | function |
| `tn8` | recover/applyCwd (intermediate setter called by `PD`, calls `sKH`) | cli_inner_pretty.js:42230 | function |
| `sKH` | setCwdState (in-memory tracked-cwd state setter; exposed via `setCwdState`) | cli_inner_pretty.js:2401 | function |
| `nz8` | checkReadOnlyConstraints (read-only classifier; `behavior:"allow"` ⇒ concurrency-safe; cd+git→passthrough at 242999) | cli_inner_pretty.js:242978 | function |
| `xV$` | commandHasAnyCd (compound-cd detector feeding `nz8`) | cli_inner_pretty.js:(callsite 439700) | function |
| (cd regex) | READONLY cd regex `/^cd(?:\s+…)?$/` — why `cd` is concurrency-safe | cli_inner_pretty.js:244115 | regex |
| `tXz` | buildEnvironmentBlock (renders `Working directory: ${getCwd()}` into the per-request system prompt) | cli_inner_pretty.js:555682 | function |
| `oT$` | appendAgentPromptNotesAndEnv (appends notes incl. "agent threads reset cwd between bash calls" + env block) | cli_inner_pretty.js:555809 | function |
| `CN_` | buildSystemPromptWithEnv (per-request assembler; called at 396878) | cli_inner_pretty.js:397181 | function |
| `cy` | cwdHintPrefix `"Note: your current working directory is"` (appended to path-not-found errors) | cli_inner_pretty.js:44410 | constant |
| `mX8` | appendCwdResetWarning `"Shell cwd was reset to <cwd>"` | cli_inner_pretty.js:341963 | function |
| `f_4` | cwdResetRegex `/(?:^|\n)(Shell cwd was reset to .+)$/` | cli_inner_pretty.js:390527 | variable |
| (scheduler) | `canExecuteTool` (447608) / `processQueue` (447612) / `executeTool` (447686, non-blocking start) — the read-only-gated parallel/serial tool scheduler | cli_inner_pretty.js:447608-447755 | method |

> NEW vs v2.1.88: the **mechanism** is byte-identical (`Shell.ts:395` read-back gate, `bashProvider.ts:118` per-call cwd file, `BashTool.tsx:434` `isConcurrencySafe→isReadOnly`, `readOnlyValidation.ts:1704` cd-is-read-only). These rows are 2.1.156 obfuscated **locations**, not behavioral deltas.

## Notes & gaps

- **`iD$` trailing-`$`.** The env-key union's obfuscated identifier verified in the bundle at
  cli_inner_pretty.js:209864 is `iD$` (`function iD$() {`). The `_evidence_brief.md` shorthand
  "`iD`-union 209864" drops the `$`; the table above uses the verified `iD$`.
- **`cD_` vs `O4`.** `shellSingleQuote` (`cD_`, 340921) is the local single-quote helper, but the
  active snapshot/command-assembly paths quote via the shared shell-quote helper `O4`. `cD_` is
  retained for completeness because it is defined in the same cluster.
- **`rD_` dead stub.** `createBigQueryShellIntegration` (`rD_`, 340979) is `return null`; the real
  BigQuery heredoc emission lives inside `getClaudeCodeSnapshotContent` (`aD_`).
- **Helpers intentionally not tabled.** The evidence brief lists additional already-mapped shared
  helpers used by this subsystem (`RL` hasEmbeddedSearchTools gate, `hkH` ripgrepCommand, `O4` quote,
  `cW` toCygwinPath, `n$` getPlatform, `aJ` execa, `yv` subprocessEnv, `Z5` pathExists, `l8`
  getClaudeConfigHomeDir, `$7` registerCleanup, `U$` getFsImplementation, `C$` getCwd, `vd`
  getTmpDir (= `CLAUDE_CODE_TMPDIR ?? os.tmpdir()`, 176735 — NOT "getCwdReal"; the brief's label was
  wrong), telemetry `d`/`N`/`SH`/`t$`). These are pre-existing platform/integration utilities
  consumed by the snapshot paths and are documented in the shared symbol indexes / module doc rather
  than re-listed here as 2.1.156 shell-snapshot deltas.
- **`Bx6` (`noopInit`, 341300)** is a `()=>{}` module-init stub between the assembly helpers; it is
  noted in the module doc for completeness but carries no behavior and is omitted from the table.
- **Home-index placement.** Shell Snapshot rows belong in `symbol_index_infra_integration.md`
  (Shell Parser / Shell integration), except `Gs7` (`createBashShellAdapter`) which is owned by the
  Permissions/Sandbox theme in `symbol_index_infra_platform.md` and already listed in
  `symbol_additions_v2_1_156_permission_policy.md` (TMPDIR-override theme) — listed here for module
  completeness only.
