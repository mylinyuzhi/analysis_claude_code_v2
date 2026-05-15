# `args: string[]` Exec Form (v2.1.139)

## Overview

v2.1.139 adds an optional `args: string[]` field to **command-type** hook definitions. When present, the hook is spawned **without a shell**: `command` is the executable name and `args` becomes the literal `argv` array. Without `args`, the existing "shell form" continues to work (bash on POSIX, PowerShell on Windows without Git Bash).

This is the v2.1.139 changelog entry:

> Added hook `args: string[]` field (exec form) that spawns the command directly without a shell, so path placeholders never need quoting

The user-facing motivation is **placeholder quoting**: paths like `${CLAUDE_PLUGIN_ROOT}` can contain spaces, quotes, dollars, or backticks. In shell form, these reach a shell parser and require defensive quoting (`"${CLAUDE_PLUGIN_ROOT}"`) — and even then, complex paths can break. In exec form, each `args[]` element is substituted in isolation and passed directly to `execve`, so a placeholder's value never participates in word-splitting or expansion.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks live here
> - [symbol_additions_v2_1_142_hooks.md](../00_overview/symbol_additions_v2_1_142_hooks.md) - New symbols

Key functions in this document:

- `bashCommandHook` (`vW8`) — Command hook executor; new `args !== void 0` branch
- `BashCommandHookSchema` (returned by `Th9`) — Zod schema; new `args` field
- `bashCommandHookEntries` (`w`) — De-duplication key in `PQ6`; now incorporates `SH(args ?? null)`

## v2.1.142 Schema Definition

```javascript
// ============================================
// BashCommandHookSchema - Command hook config Zod schema with v2.1.139 args field
// Location: cli_inner_pretty.js:48729-48771
// ============================================

// ORIGINAL (for source lookup):
let H = y.object({
    type: y.literal("command").describe("Shell command hook type"),
    command: y.string().describe("Shell command to execute"),
    args: y
      .array(y.string())
      .optional()
      .describe(
        "Argument list for exec form. When present, `command` is resolved as " +
          "an executable and spawned directly with these arguments — no shell. " +
          "Path placeholders like ${CLAUDE_PLUGIN_ROOT} are substituted per-element as plain strings, so paths with quotes, $, or backticks never reach a shell parser. When absent, `command` runs through a shell (bash on POSIX, PowerShell on Windows without Git Bash).",
      ),
    if: lq$(),
    shell: y.enum(sMq).optional().describe("Shell interpreter. 'bash' uses your $SHELL (bash/zsh/sh); 'powershell' uses pwsh. Defaults to bash (powershell on Windows without Git Bash)."),
    timeout: y.number().positive().optional().describe("Timeout in seconds for this specific command"),
    statusMessage: y.string().optional().describe("Custom status message to display in spinner while hook runs"),
    once: y.boolean().optional().describe("If true, hook runs once and is removed after execution"),
    async: y.boolean().optional().describe("If true, hook runs in background without blocking"),
    asyncRewake: y.boolean().optional().describe("If true, hook runs in background and wakes the model on exit code 2 (blocking error). Implies async."),
    rewakeMessage: y.string().min(1).optional(),
    rewakeSummary: y.string().min(1).optional(),
});

// READABLE (for understanding):
const BashCommandHookSchema = z.object({
  type: z.literal("command"),
  command: z.string(),
  // NEW v2.1.139: when present → exec form (no shell)
  args: z.array(z.string()).optional(),
  if: hookIfSchema(),
  shell: z.enum(SHELL_OPTIONS).optional(),
  timeout: z.number().positive().optional(),
  statusMessage: z.string().optional(),
  once: z.boolean().optional(),
  async: z.boolean().optional(),
  asyncRewake: z.boolean().optional(),
  rewakeMessage: z.string().min(1).optional(),
  rewakeSummary: z.string().min(1).optional(),
});

// Mapping: H→BashCommandHookSchema, y→zod, sMq→SHELL_OPTIONS, lq$→hookIfSchema
```

## v2.1.142 Runtime Branching

The branching is inside `bashCommandHook` (`vW8`). The full function spans ~250 lines; below is the placeholder-substitution and spawn-mode dispatch.

```javascript
// ============================================
// bashCommandHook - Exec-form branching for placeholder substitution and spawn
// Location: cli_inner_pretty.js:520794-520902
// ============================================

// ORIGINAL (for source lookup):
async function vW8(H, $, q, K, _, A, z, Y, f, O, M) {
  let w = $ === "SessionStart" || $ === "Setup" || $ === "SessionEnd",
    D = Date.now(),
    j, J = !1,
    X = c$() === "windows",
    L = H.shell ?? PZH(),
    P = L === "powershell",
    Z = H.args !== void 0;
  if (Z && /\s/.test(H.command) && !/[\\/]/.test(H.command))
    N(`Hook command "${H.command}" has both "args" and whitespace in "command". Exec form treats "command" as a single executable name; move the rest into "args"...`, { level: "warn" });
  let W = X && !P && !Z ? (YH) => MP(YH) : (YH) => YH,
    G = R9(),
    V = H.command, v;
  // ... plugin placeholder validation ...
  if (Y) {
    if (!(await H_(Y))) throw Error(`Plugin directory does not exist: ${Y}`);
    if (f) v = wV(f);
    if (!Z) {                                          // ← shell form ONLY: pre-bake placeholders into command string
      if (P) {
        let YH = W(Y);
        V = V.replaceAll("${CLAUDE_PLUGIN_ROOT}", () => YH);
        let DH = W(G);
        if (((V = V.replaceAll("${CLAUDE_PROJECT_DIR}", () => DH)), f)) {
          let OH = W(Bt(f));
          V = V.replaceAll("${CLAUDE_PLUGIN_DATA}", () => OH);
        }
      }
      if (v) V = u7H(V, v);
    }
  }
  let E;
  if (H.args !== void 0) {                             // ← exec form: each arg element substituted independently
    let YH = Y ?? O, DH = Y && f ? f : void 0,
      OH = (GH) => {
        if (!GH.includes("${")) return GH;
        if (((GH = GH.replaceAll("${CLAUDE_PROJECT_DIR}", () => G)), YH))
          GH = GH.replaceAll("${CLAUDE_PLUGIN_ROOT}", () => YH);
        if (DH) GH = GH.replaceAll("${CLAUDE_PLUGIN_DATA}", () => Bt(DH));
        if (v) GH = u7H(GH, v);
        return GH;
      };
    E = [OH(H.command), H.args.map(OH)];               // ← E = [resolvedCommand, [resolvedArgs...]]
  }
  // ... env setup ...
  let x = !X, F;
  if (E) F = GW8.spawn(E[0], E[1], { env: R, cwd: S, detached: x, windowsHide: !0 });    // ← exec form: spawn(file, argv) — no shell
  else if (L === "powershell") {
    let YH = await zB();
    F = GW8.spawn(YH, EX$(h), { env: R, cwd: S, detached: x, windowsHide: !0 });
  } else {
    let YH = X ? P6H() : null;
    F = GW8.spawn(h, [], { env: R, cwd: S, shell: X ? YH : !0, detached: x, windowsHide: !0 });
  }
  // ...
}

// READABLE (for understanding):
async function bashCommandHook(hook, hookEvent, hookName, jsonInput, signal, hookId, hookIndex, pluginRoot, pluginId, skillRoot, forceSyncExecution) {
  const isInitOrEnd = hookEvent === "SessionStart" || hookEvent === "Setup" || hookEvent === "SessionEnd";
  const startTime = Date.now();
  let exitCode, aborted = false;
  const isWindows = getOS() === "windows";
  const shellChoice = hook.shell ?? getDefaultShell();
  const isPowerShell = shellChoice === "powershell";
  const isExecForm = hook.args !== undefined;          // ← key gate

  // Lint warning: exec form treats command as a single token
  if (isExecForm && /\s/.test(hook.command) && !/[\\/]/.test(hook.command)) {
    logForDebugging(
      `Hook command "${hook.command}" has both "args" and whitespace in "command". ` +
      `Exec form treats "command" as a single executable name; move the rest into "args". ` +
      `Example: { "command": "node", "args": ["script.js"] }.`,
      { level: "warn" },
    );
  }

  // Windows path quoter: only applies in cmd-shell mode (not pwsh, not exec form)
  const winPathFix = (isWindows && !isPowerShell && !isExecForm) ? (s) => winPathQuote(s) : (s) => s;
  const projectDir = getCwdResolvedSync();
  let command = hook.command;
  let pluginOptions;

  // PLUGIN placeholder validation & SHELL-FORM substitution
  if (pluginRoot) {
    if (!(await pathExists(pluginRoot))) throw Error(`Plugin directory does not exist: ${pluginRoot}` + (pluginId ? ` (${pluginId} — run /plugin to reinstall)` : ""));
    if (pluginId) pluginOptions = loadPluginOptions(pluginId);
    if (!isExecForm) {                                  // ← shell form: substitute INSIDE the command string
      if (isPowerShell) {
        const root = winPathFix(pluginRoot);
        command = command.replaceAll("${CLAUDE_PLUGIN_ROOT}", () => root);
        const proj = winPathFix(projectDir);
        command = command.replaceAll("${CLAUDE_PROJECT_DIR}", () => proj);
        if (pluginId) {
          const data = winPathFix(pluginDataPath(pluginId));
          command = command.replaceAll("${CLAUDE_PLUGIN_DATA}", () => data);
        }
      }
      if (pluginOptions) command = substituteUserConfig(command, pluginOptions);
    }
  }

  // EXEC FORM: build `argv` per element — each gets its own substitution pass
  let execSpec;
  if (hook.args !== undefined) {
    const root = pluginRoot ?? skillRoot;
    const dataPluginId = pluginRoot && pluginId ? pluginId : undefined;
    const substitute = (s) => {
      if (!s.includes("${")) return s;
      s = s.replaceAll("${CLAUDE_PROJECT_DIR}", () => projectDir);
      if (root) s = s.replaceAll("${CLAUDE_PLUGIN_ROOT}", () => root);
      if (dataPluginId) s = s.replaceAll("${CLAUDE_PLUGIN_DATA}", () => pluginDataPath(dataPluginId));
      if (pluginOptions) s = substituteUserConfig(s, pluginOptions);
      return s;
    };
    execSpec = [substitute(hook.command), hook.args.map(substitute)];   // ← [exe, [arg, arg, ...]]
  }

  // ... env setup (incl. CLAUDE_PROJECT_DIR, CLAUDE_EFFORT) ...

  const detachFromTty = !isWindows;
  let child;
  if (execSpec) {
    // EXEC FORM: spawn(file, argv) — no shell at all
    child = child_process.spawn(execSpec[0], execSpec[1], { env, cwd: safeCwd, detached: detachFromTty, windowsHide: true });
  } else if (shellChoice === "powershell") {
    const pwshPath = await getCachedPowerShellPath();
    if (!pwshPath) throw Error(`Hook "${hook.command}" has shell: 'powershell' but no PowerShell ...`);
    child = child_process.spawn(pwshPath, buildPowerShellArgs(commandWithEffort), { env, cwd: safeCwd, detached: detachFromTty, windowsHide: true });
  } else {
    // SHELL FORM: spawn(string, [], { shell: true | gitBashPath })
    const gitBash = isWindows ? findGitBashPath() : null;
    child = child_process.spawn(commandWithEffort, [], { env, cwd: safeCwd, shell: isWindows ? gitBash : true, detached: detachFromTty, windowsHide: true });
  }
  // ...
}

// Mapping:
//   vW8→bashCommandHook, H→hook, $→hookEvent, q→hookName, K→jsonInput, _→signal,
//   A→hookId, z→hookIndex, Y→pluginRoot, f→pluginId, O→skillRoot, M→forceSyncExecution
//   X→isWindows, L→shellChoice, P→isPowerShell, Z→isExecForm, W→winPathFix,
//   G→projectDir, V→command (mutating), v→pluginOptions, E→execSpec,
//   GW8→child_process, R→envVars, S→safeCwd, x→detachFromTty, F→child
```

## Key Decisions/Algorithms

### Per-element placeholder substitution

**What it does:** Resolves `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}`, `${CLAUDE_PROJECT_DIR}`, and `${user_config.*}` references separately for `command` and each `args[i]`.

**How it works:**
1. Inside the exec-form branch (`hook.args !== undefined`), define an inner `substitute(s)` closure.
2. Apply it once to `hook.command`, then map it over `hook.args[]`.
3. Each element is treated as a **literal string**; the resulting value is what gets passed to `execve` as `argv[i]`.

**Why this approach:**
- Per-element substitution means a path containing `"$weird/path with spaces"` becomes a single `argv` slot with that exact text, not multiple words.
- It avoids the alternative of building a shell-quoted concatenation (e.g. `cmd "${root}" file.js`), which requires the substitution layer to know shell-quoting rules — a perennial source of injection bugs.

**Key insight:** The two forms have **opposite substitution timing**. Shell form substitutes **before** handing to shell (`command` is mutated in-place; the shell then word-splits the result). Exec form substitutes **inside `argv` construction**, so each placeholder's value is the contents of one argv slot — quoting/word-splitting never enters the picture.

### "Whitespace in command" warning

**What it does:** Emits a debug-log warning when exec form is used AND `command` contains whitespace AND has no slashes.

**How it works:**
```javascript
if (isExecForm && /\s/.test(hook.command) && !/[\\/]/.test(hook.command)) {
  logForDebugging(`Hook command "${hook.command}" has both "args" and whitespace in "command"...`);
}
```

**Why this approach:**
- A common user mistake when migrating from shell form: writing `{ "command": "node script.js", "args": ["--flag"] }` instead of `{ "command": "node", "args": ["script.js", "--flag"] }`. The first form would try to exec a literal file named `"node script.js"` and fail with ENOENT.
- The `!/[\\/]/` clause skips the warning if there's a slash — paths like `/usr/bin/env node` are legitimate (the kernel handles the shebang).

**Key insight:** This is **forward-compatible** lint, not an error. Some shells/exec implementations actually search PATH for the entire string; rather than reject, the runtime warns and lets the spawn fail with ENOENT naturally if that's what happens.

### De-duplication key updated

**What it does:** Inside `PQ6` (hook matcher resolver, around `cli_inner_pretty.js:521251-521260`), the de-duplication key for command hooks is now:

```javascript
`${E.hook.shell ?? PZH()}\x00${E.hook.command}\x00${SH(E.hook.args ?? null)}\x00${M(E.hook)}`
```

**Why this approach:**
- Pre-v2.1.139, the key was `${shell}\x00${command}\x00${if}`. Without including `args`, two hooks with identical `command` but different `args[]` would collide and only the first would run.
- `SH(args ?? null)` (the JSON-stringify helper) handles undefined gracefully — old shell-form hooks key as `"null"`, new exec-form hooks key on the JSON of their args list.

**Key insight:** The `\x00` separator is a NUL byte — never appears in legal JSON/shell strings, so the key is reversible and collision-proof.

## Diff vs v2.1.112

In v2.1.112 (chunks.192.mjs / chunks.193.mjs), the equivalent of `BashCommandHookSchema` did **not** include `args`. The `bashCommandHook` runtime had only the shell-form path: spawn was always `spawn(cmd, [], { shell: true | gitBashPath })`. Substitutions were string `replaceAll`s on `command`.

The v2.1.139 patch adds:
1. Schema: `args: z.array(z.string()).optional()` after `command`.
2. Runtime gate: `const isExecForm = hook.args !== undefined;`
3. Per-element substitution closure when `isExecForm` is true.
4. Conditional `spawn(execSpec[0], execSpec[1], ...)` instead of `spawn(commandStr, [], { shell })`.
5. Whitespace lint warning at the top of `bashCommandHook`.
6. Updated `PQ6` de-dup key to include `args` JSON.

The shell-form path is **byte-identical** to v2.1.112; this is a pure additive change. Old hook configs continue to work unmodified.
