# Shell Background Sessions - `claude --bg --exec` and bang-command

> **Module:** 36_background_agents · **Build:** v2.1.156 · **Status:** NEW in v2.1.154
> **Source:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`

## Related Symbols

> Symbol mappings live ONLY in the central index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents lives here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions/objects in this document (list format, per project rules):

- `bgFlagExecHandler` (`hwz`) — the `claude --bg --exec` CLI handler (cli_inner_pretty.js:541956-542006)
- `extractFlagValue` (`al`) — generic `--name=value` / `--name value` argv extractor (cli_inner_pretty.js:541547-541556)
- `BG_FLAG_ALIASES` (`ee4`) — `["--bg","--background"]` alias array stripped before re-parse (cli_inner_pretty.js:542622)
- `formatBgHints` (`ny$`) — "backgrounded · …" success banner with attach/logs/stop hints (cli_inner_pretty.js:542079-542089)
- `parseFleetDispatchInput` (`q5q`) — agents-view input parser; detects leading `!` (cli_inner_pretty.js:614290-614317)
- `shellExecGate` (`gy$`) — feature gate for shell-exec; returns `true` in 2.1.156 (cli_inner_pretty.js:541028-541030)
- `claudeAgentTemplate` (`qKH`) — built-in CLAUDE_AGENT template, `Ce4(IV6)` (cli_inner_pretty.js:541290)
- `fleetDispatchExec` (`pe4`) — agents-view shell-exec dispatch (cli_inner_pretty.js:541031-541059)
- `resolveShellLaunch` (`Ewz`) — SHELL / COMSPEC / /bin/sh launch resolver (cli_inner_pretty.js:541727-541736)
- `EXEC_TEMPLATE` (`Xwz`) — `{ name: "exec", description: "" }` template object (cli_inner_pretty.js:541292)
- `dispatchBgSession` (`ol`) — unified background-session dispatcher (cli_inner_pretty.js:541769-541955)
- `seedBgSessionState` (`ywz`) — state-file seeder inside `ol` (cli_inner_pretty.js:541789-541903)
- `buildTemplateFromAgent` (`Ce4`) — agent-def → template adapter (cli_inner_pretty.js:540913-540915)
- `CLAUDE_AGENT_DEF` (`IV6`) — built-in catch-all agent definition (cli_inner_pretty.js:236184-236210)
- `interpolateMentions` (`kd`) — `@mention` placeholder substitution into intent text (cli_inner_pretty.js:177847-177856)
- `emitFeatureOkAsync` (`mn8`) / `emitFeatureBadAsync` (`Bn8`) / `emitFeatureSadAsync` (`pn8`) — async telemetry (cli_inner_pretty.js:41599-41607)
- `emitFeatureOk` (`SH`) / `emitFeatureBad` (`uH`) / `emitFeatureSad` (`t$`) — sync telemetry (cli_inner_pretty.js:41590-41598)

---

## TL;DR

v2.1.154 added the ability to run **a raw shell command** as a first-class background session that you can later attach to, tail, or stop — exactly like an agent job, but with no LLM in the loop. There are two front doors and one shared back door:

1. **CLI:** `claude --bg --exec '<command>'` (or `--exec='<command>'`) — handler `bgFlagExecHandler` (`hwz`, cli_inner_pretty.js:541956).
2. **Interactive agents view:** type `! <command>` (or press `!` to enter bash mode and type the command) — parsed by `parseFleetDispatchInput` (`q5q`, cli_inner_pretty.js:614290), submitted via `fleetDispatchExec` (`pe4`, cli_inner_pretty.js:541031).

Both converge on the unified dispatcher `dispatchBgSession` (`ol`, cli_inner_pretty.js:541769). The convergence trick is a single `exec` field on the seed options: when `exec` is set, `ol` (a) stamps the job template name to `"exec"` and (b) builds the worker `launch` descriptor as `{ mode: "exec", ...resolveShellLaunch(exec) }` instead of the usual `{ mode: "prompt", ... }`. `resolveShellLaunch` (`Ewz`, cli_inner_pretty.js:541727) picks `$SHELL -c`, `%COMSPEC% /d /s /c`, or `/bin/sh -c` to actually exec the command in the bg worker process. Telemetry is `cli_bg_dispatch_exec` (CLI) and `fleet_view_dispatch_exec` (agents view).

**Confidence: high.** Every line below was read in the 2.1.156 bundle. The whole shell-exec capability is **NEW post-2.1.88** — the v2.1.88 source (`src/utils/background/`) only contains *session* backgrounding (handing a Claude session to a daemon), not arbitrary shell-command execution. No `--exec` precursor exists.

---

## 1. Where shell-exec sits in the bg architecture

```
          ┌──────────────────────────────┐         ┌────────────────────────────┐
  CLI ──► │ bgFlagExecHandler  hwz        │         │  Agents view (FleetView)    │
          │  claude --bg --exec '<cmd>'   │         │  type:  ! <cmd>             │
          └──────────────┬───────────────┘         └──────────────┬─────────────┘
                         │ {intent, exec, name?}                   │ parseFleetDispatchInput q5q
                         │                                         │   → {template:qKH, exec}
                         │                                         ▼
                         │                              React submit handler (616705..)
                         │                                nX = interpolateMentions(exec)
                         │                                         │ fleetDispatchExec pe4
                         │                                         │ (seeds Xwz state first)
                         ▼                                         ▼
                 ┌──────────────────────────────────────────────────────────────┐
                 │      dispatchBgSession  ol(argv, sid, source, cwd, opts)       │
                 │   opts.exec set  ⇒  template.name="exec"                       │
                 │                  ⇒  launch = { mode:"exec", ...Ewz(exec) }     │
                 └───────────────────────────────┬──────────────────────────────┘
                                                 │ Tqq(launchDescriptor)  (daemon dispatch)
                                                 ▼
                 ┌──────────────────────────────────────────────────────────────┐
                 │     bg daemon spawns worker; worker exec's the shell:          │
                 │       SHELL -c "<cmd>"  |  COMSPEC /d /s /c  |  /bin/sh -c      │
                 └──────────────────────────────────────────────────────────────┘
```

The two entry points differ in *how the session state file is created* (the CLI path lets `ol` seed it; the agents-view path pre-seeds it in `pe4` so the new job card renders instantly), but they share the launch-descriptor construction in `ol`.

---

## 2. Entry point A — `claude --bg --exec` (handler `hwz`)

### 2.1 The handler, end-to-end

```javascript
// ============================================
// bgFlagExecHandler - --exec parsing, command capture, name extraction, dispatch
// Location: cli_inner_pretty.js:541956-542006
// ============================================

// ORIGINAL (for source lookup):
async function hwz(H) {
  let $ = H.indexOf("--"),
    q = ($ >= 0 ? H.slice(0, $) : H).findIndex((A) => A === "--exec" || A.startsWith("--exec="));
  if (q !== -1) {
    let A = H[q].includes("=") ? H[q].slice(H[q].indexOf("=") + 1) : void 0,
      Y = A ?? H.slice(q + 1).join(" ");
    if (!Y.trim()) {
      (process.stderr.write(`--exec requires a command.\n`), (process.exitCode = 1));
      return;
    }
    let f = [...H.slice(0, q), ...(A !== void 0 ? H.slice(q + 1) : [])].filter((w) => !ee4.includes(w)),
      O = al("--name", f) ?? al("-n", f),
      M = f.filter((w) => w.startsWith("-") && !/^(-n|--name)(=|$)/.test(w));
    if (M.length > 0)
      process.stderr.write(`warning: --exec ignores ${M.join(" ")} (only --name composes)\n`);
    let j = await ol([], void 0, "shell", void 0, { intent: Y, exec: Y, ...(O && { name: O, nameSource: "user" }) });
    if (!j.ok) {
      (await Bn8("cli_bg_dispatch_exec", j.reason ?? "spawn_failed"), process.stderr.write(`${j.error}\n`), (process.exitCode = 1));
      return;
    }
    (await mn8("cli_bg_dispatch_exec"), process.stdout.write(ny$(j.short, void 0, O || Y) + `\n`));
    return;
  }
  let K = H.filter((A) => !ee4.includes(A)), _ = await $H9(), z = await ol(_ ? qH9(K, _) : K);
  /* …non-exec --bg path… */
}

// READABLE (for understanding):
async function bgFlagExecHandler(argv) {
  let dashDash = argv.indexOf("--"),
    execIdx = (dashDash >= 0 ? argv.slice(0, dashDash) : argv)
                .findIndex((a) => a === "--exec" || a.startsWith("--exec="));

  if (execIdx !== -1) {
    // 1) capture the command: value-after-equals, else the joined remaining argv
    let inlineValue = argv[execIdx].includes("=")
          ? argv[execIdx].slice(argv[execIdx].indexOf("=") + 1)
          : undefined,
        command = inlineValue ?? argv.slice(execIdx + 1).join(" ");

    // 2) requires-a-command guard
    if (!command.trim()) {
      process.stderr.write("--exec requires a command.\n");
      process.exitCode = 1;
      return;
    }

    // 3) re-parse the surviving flags (strip --bg/--background, and the consumed --exec tail)
    let survivingFlags = [...argv.slice(0, execIdx),
                          ...(inlineValue !== undefined ? argv.slice(execIdx + 1) : [])]
                         .filter((a) => !BG_FLAG_ALIASES.includes(a)),
        name = extractFlagValue("--name", survivingFlags) ?? extractFlagValue("-n", survivingFlags),
        // 4) every OTHER flag is ignored; warn about it
        ignoredFlags = survivingFlags.filter((a) => a.startsWith("-") && !/^(-n|--name)(=|$)/.test(a));

    if (ignoredFlags.length > 0)
      process.stderr.write(`warning: --exec ignores ${ignoredFlags.join(" ")} (only --name composes)\n`);

    // 5) dispatch via the unified dispatcher with source "shell" and an exec intent
    let res = await dispatchBgSession([], undefined, "shell", undefined,
                  { intent: command, exec: command, ...(name && { name, nameSource: "user" }) });

    if (!res.ok) {
      await emitFeatureBadAsync("cli_bg_dispatch_exec", res.reason ?? "spawn_failed");
      process.stderr.write(`${res.error}\n`);
      process.exitCode = 1;
      return;
    }
    await emitFeatureOkAsync("cli_bg_dispatch_exec");
    process.stdout.write(formatBgHints(res.short, undefined, name || command) + "\n");
    return;
  }
  // …non-exec --bg path uses dispatchBgSession with the full argv…
}

// Mapping: hwz→bgFlagExecHandler, H→argv, $→dashDash, q→execIdx, A→inlineValue,
//          Y→command, f→survivingFlags, O→name, M→ignoredFlags, j→res,
//          ee4→BG_FLAG_ALIASES, al→extractFlagValue, ol→dispatchBgSession,
//          ny$→formatBgHints, Bn8→emitFeatureBadAsync, mn8→emitFeatureOkAsync
```

### 2.2 Command capture — the two shapes (`--exec=X` vs `--exec X Y Z`)

**What it does:** Turns the user's flag into a single shell command string.

**How it works (cli_inner_pretty.js:541957-541961):**
1. Find the `--` separator index (`dashDash`). The `--exec` scan is restricted to argv *before* `--`, so `claude --bg --exec -- --weird` would still treat `--weird` as part of the trailing region rather than as the exec flag. (Here the scan finds `--exec` at some `execIdx`.)
2. Locate `--exec` or `--exec=…`.
3. **Equals form** (`--exec='git pull'`): `inlineValue` = everything after the first `=` (cli_inner_pretty.js:541960). The command is exactly that one token.
4. **Space form** (`--exec git pull --rebase`): `inlineValue` is `undefined`, so the command is **all remaining argv tokens joined with a space** (`argv.slice(execIdx+1).join(" ")`, cli_inner_pretty.js:541961). This is why everything after `--exec` is swallowed as the command — there is no further flag parsing past it.

**Why this approach:** A shell command is fundamentally one string. By making the space form greedy-join-to-EOL, the user can write `claude --bg --exec npm test && npm run lint` without quoting (the joined string is later handed to `$SHELL -c`, which re-parses the operators). The equals form exists for the case where the command itself begins with a dash (`--exec='--version'`) and would otherwise be misread.

**Key insight:** This is a deliberate *non-orthogonal* CLI design. `--exec` is a terminal flag — it consumes the rest of the line. That is the source of the "ignores all non-name flags" rule below.

### 2.3 The requires-a-command guard (cli_inner_pretty.js:541962-541967)

If the captured command is empty/whitespace, write `--exec requires a command.` to stderr and set `process.exitCode = 1`. This catches `claude --bg --exec` (nothing after) and `claude --bg --exec=` (empty equals). Note it sets `exitCode` rather than throwing, so the process exits cleanly with status 1 — consistent with the other non-fatal CLI guards in this file.

### 2.4 Name extraction and the "ignores all non-name flags" warning

This is the most interesting design decision in the handler.

**What it does:** Of all the flags a user might pass alongside `--exec`, exactly one composes: `--name`/`-n`. Everything else is ignored *with a warning*.

**How it works:**
1. Rebuild a `survivingFlags` list = the argv tokens *before* `--exec` plus (only in the equals form) the tokens after it, then strip the `--bg`/`--background` aliases via `BG_FLAG_ALIASES` (`ee4`) (cli_inner_pretty.js:541968).
2. Pull `--name` or `-n` out of `survivingFlags` with `extractFlagValue` (`al`) (cli_inner_pretty.js:541969).
3. Compute `ignoredFlags` = any surviving token that starts with `-` and is **not** `-n`/`--name` (regex `^(-n|--name)(=|$)`) (cli_inner_pretty.js:541970).
4. If `ignoredFlags` is non-empty, warn: `warning: --exec ignores <flags> (only --name composes)` (cli_inner_pretty.js:541971-541973).

```javascript
// ============================================
// extractFlagValue - generic --flag=value / --flag value argv reader
// Location: cli_inner_pretty.js:541547-541556
// ============================================

// ORIGINAL (for source lookup):
function al(H, $ = process.argv) {
  for (let q = 0; q < $.length; q++) {
    let K = $[q];
    if (K === "--") break;
    if (K?.startsWith(`${H}=`)) return K.slice(H.length + 1);
    if (K === H && q + 1 < $.length) return $[q + 1];
    if (K !== void 0 && Nwz.has(K)) q++;
  }
  return;
}

// READABLE (for understanding):
function extractFlagValue(flag, argv = process.argv) {
  for (let i = 0; i < argv.length; i++) {
    let tok = argv[i];
    if (tok === "--") break;                                 // stop at the -- separator
    if (tok?.startsWith(`${flag}=`)) return tok.slice(flag.length + 1); // --name=foo
    if (tok === flag && i + 1 < argv.length) return argv[i + 1];        // --name foo
    if (tok !== undefined && VALUED_FLAGS.has(tok)) i++;     // skip the value of an unrelated valued flag
  }
  return undefined;
}

// Mapping: al→extractFlagValue, H→flag, $→argv, K→tok, q→i, Nwz→VALUED_FLAGS
```

**Why this approach (the warning, not a hard error):**
- `--model`, `--permission-mode`, `--agent`, etc. are *agent-session* concepts. A shell command has no model, no permission mode, no agent — running them would silently lie about behavior. Rejecting hard would be hostile to muscle memory (`claude --bg --model opus --exec …`); silently dropping would be surprising. The warning splits the difference: it runs, but tells you what it dropped.
- `--name` is allowed because it's a pure presentation concern (the label in `claude agents`), orthogonal to *what* runs. The `nameSource: "user"` tag is set so the job-list renderer knows the name was explicit (vs. auto-derived) — see `seedBgSessionState` (`ywz`) which reads `nameSource` at cli_inner_pretty.js:541847.

**Key insight:** `BG_FLAG_ALIASES` (`ee4`, defined `["--bg","--background"]` at cli_inner_pretty.js:542622) is stripped *first* so the bg-mode flags themselves never count as "ignored". Without this strip, `claude --bg --exec foo` would warn `--exec ignores --bg` — nonsense, since `--bg` is what triggered this handler in the first place.

### 2.5 The dispatch call and success banner

The dispatch (cli_inner_pretty.js:541974) is:

```javascript
ol([], void 0, "shell", void 0, { intent: command, exec: command, ...(name && { name, nameSource: "user" }) })
```

- `argv` = `[]` — no agent argv at all; the launch comes purely from `exec`.
- `sessionId` = `undefined` — `ol` mints a fresh UUID.
- `source` = `"shell"` — distinguishes a CLI-launched shell session from a `repl`/`fleet`/`spare` session.
- both `intent` and `exec` are set to the command. `intent` is the human-facing job description (shown in the list); `exec` is the actual launch payload. They're equal here because a shell command is its own best description.

On success it emits `cli_bg_dispatch_exec` OK telemetry and prints the banner via `formatBgHints` (`ny$`):

```javascript
// ============================================
// formatBgHints - "backgrounded · <id>" banner with attach/logs/stop hints
// Location: cli_inner_pretty.js:542079-542089
// ============================================

// ORIGINAL (for source lookup):
function ny$(H, $, q) {
  let K = (_, z) => J$.dim("  " + _.padEnd(26) + z);
  return [
    `backgrounded \xB7 ${J$.cyan(H)}${q ? ` \xB7 ${q}` : ""}${$ ? J$.dim(` ${$}`) : ""}`,
    K("claude agents", "list sessions"),
    K(`claude attach ${H}`, "open in this terminal"),
    K(`claude logs ${H}`, "show recent output"),
    K(`claude stop ${H}`, "stop this session"),
  ].join(`\n`);
}

// READABLE (for understanding):
function formatBgHints(shortId, idleNote, label) {
  let hint = (cmd, desc) => style.dim("  " + cmd.padEnd(26) + desc);
  return [
    `backgrounded · ${style.cyan(shortId)}${label ? ` · ${label}` : ""}${idleNote ? style.dim(` ${idleNote}`) : ""}`,
    hint("claude agents",              "list sessions"),
    hint(`claude attach ${shortId}`,   "open in this terminal"),
    hint(`claude logs ${shortId}`,     "show recent output"),
    hint(`claude stop ${shortId}`,     "stop this session"),
  ].join("\n");
}

// Mapping: ny$→formatBgHints, H→shortId, $→idleNote, q→label, K→hint, J$→style
```

The third argument `label` is `name || command` (cli_inner_pretty.js:541984): the user-given `--name` if present, otherwise the command text itself, so the banner echoes what was started. (`·` is the `\xB7` middle dot.)

> Naming note: the scout dossier refers to this banner formatter as `nyB`; in the 2.1.156 build the symbol is `ny$` (cli_inner_pretty.js:542079) and is exported under the alias `formatBgHints` at cli_inner_pretty.js:541721. Likewise the shell-exec gate is `gy$` (the dossier writes `gyB`). These are the same symbols — the `$`/`B` glyph differs only in the obfuscator's alphabet.

---

## 3. Entry point B — the `! <command>` agents-view path

### 3.1 The dispatch-input parser `q5q`

**What it does:** Parses whatever the user typed in the agents-view prompt box into a structured dispatch intent (`{ template, intent, matched, exec?, cwd?, routine? }`).

**How it works (cli_inner_pretty.js:614290-614317):** The very first check, *before* any `@mention` or agent-name resolution, is the bang test:

```javascript
// ============================================
// parseFleetDispatchInput - agents-view input parser; bang(!) → shell-exec intent
// Location: cli_inner_pretty.js:614290-614317
// ============================================

// ORIGINAL (for source lookup):
function q5q(H, $, q = {}, K = []) {
  let _ = H.trim();
  if (gy$() && _.startsWith("!")) {
    let J = _.slice(1).trim();
    return { template: qKH, intent: "", matched: !!J, exec: J };
  }
  let z = _.toLowerCase();
  if (z.startsWith("a:") || z.startsWith("s:") || z.startsWith("o:")) return null;
  /* …@mention + agent-name resolution… */
  return { template: qKH, intent: M, matched: !1, cwd: Y, routine: f };
}

// READABLE (for understanding):
function parseFleetDispatchInput(rawText, agents, mentionMap = {}, routines = []) {
  let text = rawText.trim();
  // bang prefix → shell-exec dispatch, gated by shellExecGate()
  if (shellExecGate() && text.startsWith("!")) {
    let command = text.slice(1).trim();
    return { template: claudeAgentTemplate, intent: "", matched: !!command, exec: command };
  }
  let lower = text.toLowerCase();
  if (lower.startsWith("a:") || lower.startsWith("s:") || lower.startsWith("o:")) return null; // filter prefixes
  /* …resolve @mentions, agent names, routines… */
  return { template: claudeAgentTemplate, intent: resolved, matched: false, cwd, routine };
}

// Mapping: q5q→parseFleetDispatchInput, H→rawText, $→agents, q→mentionMap, K→routines,
//          _→text, J→command, gy$→shellExecGate, qKH→claudeAgentTemplate
```

Key points:
- The exec branch returns `intent: ""` and `exec: command`. The empty intent is intentional — the *command* is the exec payload; the human-readable intent is derived later (the job card shows the command).
- `matched: !!command` — `matched` is `true` only if there is a non-empty command after the `!`. A lone `!` produces `matched: false`, which the submit handler uses to reject (it requires `intent || routine || matched`, cli_inner_pretty.js:616742).
- The template is `claudeAgentTemplate` (`qKH`) — the same template object the catch-all dispatch uses. The submit handler later *overrides* this to the `exec` template (see §3.3); the template here is just a placeholder so the parse-result shape is uniform.

### 3.2 The gate `gy$` (shellExecGate)

```javascript
// ============================================
// shellExecGate - feature gate for shell-exec bang command (always-on in 2.1.156)
// Location: cli_inner_pretty.js:541028-541030
// ============================================

// ORIGINAL (for source lookup):
function gy$() {
  return !0;
}

// READABLE (for understanding):
function shellExecGate() {
  return true;
}

// Mapping: gy$→shellExecGate
```

**Why a gate that just returns `true`?** This is the classic kill-switch pattern. The shell-exec feature shipped in 2.1.154; by 2.1.156 it's fully launched, so the gate is hardcoded `true`. The function is kept (rather than inlined) so that:
1. Both call sites (`parseFleetDispatchInput` at cli_inner_pretty.js:614292 and the keypress handler at cli_inner_pretty.js:616881) gate on **the same** predicate — there's no risk of one path enabling bash-mode entry while the other rejects the command.
2. If a regression forces a rollback, flipping one function to `return false` (or wiring it to a feature flag) disables both the `!`-to-enter-bash-mode keypress and the `!`-prefixed parse in one edit.

**Key insight:** Having the gate guard *both* the input-mode toggle and the parse means the bash-mode UI can never get into an inconsistent state where you can type a `!` command that then silently fails to dispatch.

### 3.3 The React submit handler (cli_inner_pretty.js:616705-616803)

This is the FleetView keyboard handler's Enter branch. Two things matter for shell-exec: entering bash mode, and dispatching.

**Entering bash mode:** Pressing `!` on an empty prompt (gated, cli_inner_pretty.js:616881-616883) switches the input mode to `"bash"`; backspace on an empty bash-mode prompt exits back to `"prompt"` (cli_inner_pretty.js:616885-616887). When the user hits Enter:

```javascript
// near cli_inner_pretty.js:616711, 616740-616741
let firstWord = m8.current === "bash" ? "!" : h6.current.trim().toLowerCase();   // bash mode forces the "!" path
...
let raw = h6.current,
    isBash = m8.current === "bash",
    parsed = raw === J8 && !isBash ? T1 : q5q(isBash ? `!${raw}` : raw, C7, c, Hf);
```

So bash mode prepends `!` before calling `parseFleetDispatchInput` — i.e. typing a command in bash mode is *identical* to typing `! <command>` in prompt mode. Both produce a parse result with an `exec` field.

**Computing the exec payload and dispatching:**

```javascript
// ============================================
// FleetView submit → fleetDispatchExec routing (exec branch only)
// Location: cli_inner_pretty.js:616760-616802
// ============================================

// ORIGINAL (for source lookup):
let Iw = m7.matched && !m7.exec ? m7.template.name : null,
    BO = Fq.current,
    nX = m7.exec ? kd(m7.exec, BO) : void 0,
    Ny = { id: c5, state: O$H({ template: nX ? { name: "exec", description: "" } : m7.routine ? { name: m7.routine, description: "" } : m7.template, intent: nX ?? x4, sessionId: L1, cwd: Nz, originCwd: Nz }), activity: "flowing" };
n((Kj) => [...Kj, Ny]);
/* …reset input… */
(nX ? pe4(nX, L1, Nz) : $9 ? Fe4(x4) : ue4(x4, BO, c5).then((Kj) => ty8(m7.template, Kj, L1, Nz, m7.routine, f))).then(/* …on settle… */);

// READABLE (for understanding):
let agentNameForMru = parsed.matched && !parsed.exec ? parsed.template.name : null,
    placeholders = mentionAttachments.current,
    execCommand = parsed.exec ? interpolateMentions(parsed.exec, placeholders) : undefined,
    optimisticJob = {
      id: shortId,
      state: serializeJobState({
        template: execCommand ? { name: "exec", description: "" }          // ← exec template inline
                 : parsed.routine ? { name: parsed.routine, description: "" }
                 : parsed.template,
        intent: execCommand ?? interpolatedIntent,                          // command text as the intent
        sessionId: fullSessionId, cwd, originCwd: cwd,
      }),
      activity: "flowing",
    };
appendJobOptimistically(optimisticJob);   // render the card immediately
/* …clear the prompt box, reset attachments… */
(execCommand
   ? fleetDispatchExec(execCommand, fullSessionId, cwd)   // ← shell-exec path
   : spareReady
     ? claimSpareWorker(interpolatedIntent)
     : seedColdJob(interpolatedIntent, placeholders, shortId).then((dir) => dispatchFromTemplate(parsed.template, dir, ...)))
.then(/* …reconcile optimistic card with real jobId/sessionId… */);

// Mapping: m7→parsed, nX→execCommand, BO→placeholders, Ny→optimisticJob, c5→shortId,
//          L1→fullSessionId, Nz→cwd, x4→interpolatedIntent, kd→interpolateMentions,
//          pe4→fleetDispatchExec, O$H→serializeJobState
```

The chain is:
1. `execCommand = interpolateMentions(parsed.exec, placeholders)` (cli_inner_pretty.js:616762) — substitutes any `@file` / `@image` mention placeholders embedded in the command back to their text. `interpolateMentions` (`kd`, cli_inner_pretty.js:177847) walks the placeholder spans right-to-left and splices in the resolved content, so index math stays valid.
2. An *optimistic* job card is appended immediately (cli_inner_pretty.js:616763-616778) using the inline `{ name: "exec", description: "" }` template, so the UI shows the new session before the daemon round-trip completes.
3. If `execCommand` is truthy, dispatch via `fleetDispatchExec` (`pe4`); the `.then` reconciles the optimistic card's id/sessionId with the daemon-assigned values (cli_inner_pretty.js:616807-616810).

### 3.4 `fleetDispatchExec` (`pe4`)

```javascript
// ============================================
// fleetDispatchExec - agents-view shell-exec dispatch (pre-seeds state, then ol)
// Location: cli_inner_pretty.js:541031-541059
// ============================================

// ORIGINAL (for source lookup):
async function pe4(H, $, q) {
  let K = $ ?? ey8.randomUUID(), _ = K.slice(0, 8), z = q ?? C$(), A = m9(_);
  try {
    (await tS.mkdir(jCH.join(A, "tmp"), { recursive: !0 }),
      await qA(A, O$H({ template: Xwz, intent: H, sessionId: K, cwd: z, originCwd: z })));
  } catch (f) {
    return (await tS.rm(A, { recursive: !0, force: !0 }).catch(() => {}), qJ(A),
      uH("fleet_view_dispatch_exec", "state_write_failed", { errno: CY(f) ?? "unknown" }),
      { ok: !1, error: `Couldn't create the job — ${TH(f)}` });
  }
  let Y = await ol([], K, "fleet", z, { intent: H, exec: H });
  if (!Y.ok) {
    if (Y.alive) return (t$("fleet_view_dispatch_exec", "alive_collision"), { ok: !1, error: Y.error });
    return (await vAH(_).catch(() => {}), await tS.rm(A, { recursive: !0, force: !0 }).catch(() => {}), qJ(A),
      uH("fleet_view_dispatch_exec", Y.reason ?? "spawn_failed"),
      { ok: !1, error: Y.error, reason: Y.reason });
  }
  return (SH("fleet_view_dispatch_exec"), { ok: !0, jobId: Y.short, sessionId: K });
}

// READABLE (for understanding):
async function fleetDispatchExec(command, sessionIdIn, cwdIn) {
  let sessionId = sessionIdIn ?? crypto.randomUUID(),
      short = sessionId.slice(0, 8),
      cwd = cwdIn ?? getCwd(),
      jobDir = jobDirFor(short);
  try {
    // 1) pre-seed the session state file so the card renders with real on-disk state
    await fs.mkdir(path.join(jobDir, "tmp"), { recursive: true });
    await writeJobState(jobDir, serializeJobState({ template: EXEC_TEMPLATE, intent: command, sessionId, cwd, originCwd: cwd }));
  } catch (e) {
    // rollback on write failure
    await fs.rm(jobDir, { recursive: true, force: true }).catch(() => {});
    releaseSlot(jobDir);
    emitFeatureBad("fleet_view_dispatch_exec", "state_write_failed", { errno: errnoOf(e) ?? "unknown" });
    return { ok: false, error: `Couldn't create the job — ${describeError(e)}` };
  }
  // 2) hand to the unified dispatcher with the SAME sessionId, source "fleet", exec set
  let res = await dispatchBgSession([], sessionId, "fleet", cwd, { intent: command, exec: command });
  if (!res.ok) {
    if (res.alive) { emitFeatureSad("fleet_view_dispatch_exec", "alive_collision"); return { ok: false, error: res.error }; }
    await releaseSession(short).catch(() => {});
    await fs.rm(jobDir, { recursive: true, force: true }).catch(() => {});
    releaseSlot(jobDir);
    emitFeatureBad("fleet_view_dispatch_exec", res.reason ?? "spawn_failed");
    return { ok: false, error: res.error, reason: res.reason };
  }
  emitFeatureOk("fleet_view_dispatch_exec");
  return { ok: true, jobId: res.short, sessionId };
}

// Mapping: pe4→fleetDispatchExec, H→command, $→sessionIdIn, q→cwdIn, K→sessionId, _→short,
//          z→cwd, A→jobDir, Y→res, Xwz→EXEC_TEMPLATE, ol→dispatchBgSession,
//          uH→emitFeatureBad, t$→emitFeatureSad, SH→emitFeatureOk, O$H→serializeJobState
```

**Why does `pe4` seed the state file itself, while the CLI path lets `ol` do it?**
- The agents view is a live React UI. It needs the on-disk job state to exist **immediately** so the just-rendered optimistic card has a real backing file to reconcile against. So `pe4` writes the state with `EXEC_TEMPLATE` (`Xwz`) first (cli_inner_pretty.js:541037-541038), *then* dispatches with the **same** `sessionId` (`K`) so `ol` finds the already-seeded directory (`ol`'s seeder skips writing if `freshDir` is false — see §4.2).
- It uses source `"fleet"` (not `"shell"`) so the daemon books it under the FleetView dispatch accounting, and so `ol` skips its own state cleanup for fleet/spare sources on error (cli_inner_pretty.js:541781).
- On *any* failure (state write or dispatch) it rolls back the directory and emits the matching `fleet_view_dispatch_exec` telemetry. `alive_collision` (a short-id clash with a live job) is a `sad` event, not a `bad` one — it's a benign race, not a real error.

`EXEC_TEMPLATE` (`Xwz`) and the inline `{ name:"exec", description:"" }` in the submit handler are the same shape:

```javascript
// ============================================
// EXEC_TEMPLATE - the "exec" job template marker
// Location: cli_inner_pretty.js:541292
// ============================================

// ORIGINAL (for source lookup):
Xwz = { name: "exec", description: "" };

// READABLE (for understanding):
const EXEC_TEMPLATE = { name: "exec", description: "" };

// Mapping: Xwz→EXEC_TEMPLATE
```

The empty `description` is deliberate: an exec session has no "when to use" guidance (it's not an agent), and the job-list renderer keys off `template.name === "exec"` to render it as a shell session rather than an agent job.

---

## 4. The convergence — unified dispatcher `ol` and the launch descriptor

Both paths call `dispatchBgSession` (`ol`). The two shell-exec callers pass the same critical option: `{ exec: command, intent: command }`. Everything special about a shell session flows from that single `exec` field.

### 4.1 Template-name stamping

Inside the state seeder `seedBgSessionState` (`ywz`), the template name is chosen by whether `exec` is present (cli_inner_pretty.js:541838):

```javascript
// at cli_inner_pretty.js:541837-541842
template: {
  name: K?.exec ? "exec" : (w ?? void 0 ?? "bg"),   // exec → "exec", else agent name, else "bg"
  description: B?.whenToUse ?? R?.description ?? "",
  ...
}
// K = seed opts, w = --agent name, B = resolved agent def
```

So when `exec` is set, the job's template name becomes `"exec"` even though `ol` was called with an empty argv and no `--agent`. (`K` is the options bag; `w` is the `--agent` value extracted from argv, which is empty for the CLI exec path.)

### 4.2 The launch descriptor — `mode: "exec"`

This is the heart of the whole feature: the `launch` field that the daemon uses to actually start the worker process.

```javascript
// ============================================
// dispatchBgSession launch descriptor - exec vs resume vs prompt selection
// Location: cli_inner_pretty.js:541877-541886
// ============================================

// ORIGINAL (for source lookup):
launch: K?.exec
  ? { mode: "exec", ...Ewz(K.exec) }
  : Z && L !== void 0
    ? { mode: "resume", sessionId: L, fork: !I && (W || C.length > 0), flagArgs: [...G, ...(M >= 0 ? H.slice(M) : [])] }
    : { mode: "prompt", args: [...b, ...mwz(H)] },

// READABLE (for understanding):
launch: opts?.exec
  ? { mode: "exec", ...resolveShellLaunch(opts.exec) }        // ← shell command
  : isResume && resumeSessionId !== undefined
    ? { mode: "resume", sessionId: resumeSessionId, fork: !isSelfResume && (forkSession || forkFlags.length > 0),
        flagArgs: [...respawnFlags, ...(dashDash >= 0 ? argv.slice(dashDash) : [])] }
    : { mode: "prompt", args: [...sessionArgs, ...promptArgs(argv)] },   // ← normal agent session

// Mapping: K→opts, Ewz→resolveShellLaunch, Z→isResume, L→resumeSessionId, I→isSelfResume,
//          W→forkSession, C→forkFlags, G→respawnFlags, M→dashDash, H→argv, b→sessionArgs
```

When `exec` is set, the launch descriptor is `{ mode: "exec", cmd, args }` — there is **no** `claude` re-invocation, no model, no system prompt. The daemon will spawn `cmd` directly with `args`. This is precisely why `--exec` ignores all the agent flags: the launch path never reads them.

### 4.3 `resolveShellLaunch` (`Ewz`) — the actual shell selection

```javascript
// ============================================
// resolveShellLaunch - pick the shell + -c args to exec a raw command
// Location: cli_inner_pretty.js:541727-541736
// ============================================

// ORIGINAL (for source lookup):
function Ewz(H) {
  return (
    PU$(),
    process.env.SHELL
      ? { cmd: process.env.SHELL, args: ["-c", H] }
      : n$() === "windows"
        ? { cmd: process.env.COMSPEC || "cmd.exe", args: ["/d", "/s", "/c", H] }
        : { cmd: "/bin/sh", args: ["-c", H] }
  );
}

// READABLE (for understanding):
function resolveShellLaunch(command) {
  ensureEnvLoaded();                                  // PU$()
  if (process.env.SHELL)
    return { cmd: process.env.SHELL, args: ["-c", command] };   // user's login shell, any OS
  if (currentPlatform() === "windows")
    return { cmd: process.env.COMSPEC || "cmd.exe", args: ["/d", "/s", "/c", command] };
  return { cmd: "/bin/sh", args: ["-c", command] };   // POSIX fallback
}

// Mapping: Ewz→resolveShellLaunch, H→command, n$→currentPlatform, PU$→ensureEnvLoaded
```

**The resolution order and why:**
1. **`$SHELL` first, on every platform.** If the user has a `SHELL` env var (true on essentially all POSIX shells, and on Git-Bash/WSL/MSYS on Windows), honor it — `<shell> -c "<command>"`. This means aliases and shell features the user expects (`zsh`, `fish`, `bash`) are available.
2. **Windows without `$SHELL`:** `%COMSPEC% /d /s /c "<command>"`. `/d` disables AutoRun registry commands (a security/consistency choice — no surprise startup scripts), `/s` controls quote stripping so the whole command is treated as one string, `/c` runs and exits. `COMSPEC` defaults to `cmd.exe`.
3. **POSIX fallback:** `/bin/sh -c "<command>"` — the lowest-common-denominator shell guaranteed to exist.

**Key insight:** Because the command was captured as one already-joined string (§2.2) and is handed to `-c`/`/c`, all shell operators (`&&`, `|`, `>`, globs, `$VAR`) are re-parsed by the real shell — the CLI never tries to understand them. `ensureEnvLoaded()` (`PU$`) is called first so `$SHELL`/`$COMSPEC` reflect the user's loaded profile env, not a bare process env.

---

## 5. The built-in CLAUDE_AGENT template (`qKH` / `IV6`)

The bang parser returns `template: qKH` as a placeholder. `qKH` (`claudeAgentTemplate`) is built once at module init from the built-in catch-all agent definition `IV6` via the adapter `buildTemplateFromAgent` (`Ce4`):

```javascript
// ============================================
// claudeAgentTemplate / buildTemplateFromAgent - built-in catch-all template
// Location: cli_inner_pretty.js:541290 (qKH), 540913-540915 (Ce4)
// ============================================

// ORIGINAL (for source lookup):
qKH = Ce4(IV6);
function Ce4(H) {
  return { name: H.agentType, description: H.whenToUse, initialPrompt: H.initialPrompt, color: H.color };
}

// READABLE (for understanding):
const claudeAgentTemplate = buildTemplateFromAgent(CLAUDE_AGENT_DEF);
function buildTemplateFromAgent(agentDef) {
  return { name: agentDef.agentType, description: agentDef.whenToUse, initialPrompt: agentDef.initialPrompt, color: agentDef.color };
}

// Mapping: qKH→claudeAgentTemplate, Ce4→buildTemplateFromAgent, IV6→CLAUDE_AGENT_DEF, H→agentDef
```

`CLAUDE_AGENT_DEF` (`IV6`, cli_inner_pretty.js:236184-236210) is the built-in agent: `agentType: "claude"`, `tools: ["*"]`, `source: "built-in"`, and a `getSystemPrompt` that begins *"This session is a background job. The user may be live or away…"* with the `result:` / `needs input:` / `failed:` completion-signal conventions that the bg-session classifier reads. For a **shell-exec** session this template is irrelevant — the submit handler overrides it to `EXEC_TEMPLATE` whenever `exec` is set (§3.3). `qKH` matters for *non-exec* fleet dispatches (the catch-all agent). It appears in the exec parse result only so every `parseFleetDispatchInput` return has the same `template` key.

---

## 6. Telemetry

| Event (feature_name) | Path | Where | Emitted as |
|---|---|---|---|
| `cli_bg_dispatch_exec` | CLI `--exec` | cli_inner_pretty.js:541976 (bad), 541982 (ok) | `emitFeatureBadAsync`/`emitFeatureOkAsync` (`Bn8`/`mn8`) |
| `fleet_view_dispatch_exec` | agents-view `!` | cli_inner_pretty.js:541043/541054 (bad), 541049 (sad), 541058 (ok) | `emitFeatureBad`/`emitFeatureSad`/`emitFeatureOk` (`uH`/`t$`/`SH`) |

All six helpers wrap `tengu_feature_ok` / `tengu_feature_bad` / `tengu_feature_sad` with a `feature_name` field (cli_inner_pretty.js:41590-41607). The CLI path uses the **async** flush variants (`mn8`/`Bn8`) so the event is delivered before the process exits; the agents-view path (a long-lived UI) uses the **sync fire-and-forget** variants (`SH`/`uH`/`t$`). This is the one substantive behavioral difference in telemetry between the two entry points, and it's driven by process lifetime: a one-shot CLI must await the flush or lose the event.

> Note: the table above is a *telemetry event* table (event name → emit site), not a symbol-mapping table. Symbol mappings remain in `symbol_index_core_features.md`.

---

## 7. Comparison with the non-exec `--bg` path (and why exec is cleaner)

`bgFlagExecHandler` (`hwz`) has a second branch for plain `claude --bg "<prompt>"` (cli_inner_pretty.js:541990-542006): it reads piped stdin via `$H9` (cli_inner_pretty.js:542008), merges stdin into the prompt via `qH9` (cli_inner_pretty.js:542029), and dispatches with the **full argv** (not `[]`). That path produces a `{ mode: "prompt", args: [...] }` launch — a real Claude session. Contrast:

```
claude --bg "fix the flaky test"        →  ol(fullArgv)            →  launch.mode = "prompt"  (Claude agent)
claude --bg --exec 'pytest -x'          →  ol([], …,{exec})        →  launch.mode = "exec"     (raw shell)
! pytest -x        (in agents view)     →  pe4 → ol([], …,{exec})  →  launch.mode = "exec"     (raw shell)
```

The exec path is strictly simpler: empty argv, no stdin merge, no prompt assembly, no `--session-id`/`--fork-session`/`--resume` reasoning (all the `isResume`/`forkSession` logic at cli_inner_pretty.js:541799-541817 is bypassed because the launch never reaches the `resume`/`prompt` branches). It's a thin shell wrapper riding the existing daemon/worker/attach/logs/stop machinery.

---

## 8. Cross-validation against v2.1.88 and version history

**Confidence: high; the feature is NEW post-2.1.88.**

- The v2.1.88 source tree's `src/utils/background/` contains only a `remote/` subdir — i.e. *session* backgrounding (handing a live Claude session off to run remotely/in a daemon). There is no `--exec` flag, no `resolveShellLaunch`, no shell-command launch descriptor, and the only `--exec` hit anywhere in `src/` is in `commands/exit/exit.tsx` (unrelated). So this is a genuinely new capability, not a refactor of an older one.
- The CLI flag `--exec` first appeared in 2.1.154 (per the scout dossier / changelog window); the `!` agents-view bang command shipped in 2.1.153/154. By 2.1.156 the gate `shellExecGate` (`gy$`) is hardcoded `true`, indicating the feature is fully launched.
- The unified dispatcher `ol` and the daemon/worker plumbing it rides on *do* trace back to the 2.1.88 background-session machinery; only the `exec` field, `launch.mode === "exec"`, and `resolveShellLaunch` are new. So the architecture is "new front door, existing hallway".

---

## 9. End-to-end walkthrough (worked example)

```
$ claude --bg --exec='npm test && npm run lint' --name ci --model opus
        │
        ▼  bgFlagExecHandler (hwz)
   execIdx finds --exec=…  →  inlineValue = "npm test && npm run lint"
   command = "npm test && npm run lint"   (non-empty → guard passes)
   survivingFlags = ["--name","ci","--model","opus"]   (--bg stripped via BG_FLAG_ALIASES)
   name = extractFlagValue("--name") = "ci"
   ignoredFlags = ["--model"]  →  stderr: "warning: --exec ignores --model (only --name composes)"
        │
        ▼  dispatchBgSession([], undefined, "shell", undefined,
        │        { intent: "npm test && npm run lint", exec: "npm test && npm run lint", name: "ci", nameSource: "user" })
        │
        │  • mints sessionId, short = first 8 chars
        │  • seedBgSessionState: template.name = "exec" (because exec set)
        │  • launch = { mode: "exec", ...resolveShellLaunch("npm test && npm run lint") }
        │             = { mode:"exec", cmd:"/bin/zsh", args:["-c","npm test && npm run lint"] }
        │  • Tqq(launchDescriptor) → daemon dispatch
        ▼
   daemon spawns bg worker → worker exec's:  /bin/zsh -c "npm test && npm run lint"
        │
        ▼  back in hwz: emitFeatureOkAsync("cli_bg_dispatch_exec")
   stdout:
        backgrounded · 3f9a2b1c · ci
          claude agents               list sessions
          claude attach 3f9a2b1c      open in this terminal
          claude logs 3f9a2b1c        show recent output
          claude stop 3f9a2b1c        stop this session
```

The user can now `claude attach 3f9a2b1c` to watch the test+lint run, `claude logs 3f9a2b1c` to tail it, or `claude stop 3f9a2b1c` to kill it — the exact same lifecycle commands as any agent bg session.

---

## 10. Key design takeaways

1. **One field, two front doors.** The entire shell-exec feature is expressed as a single `exec` option threaded through the existing `dispatchBgSession` (`ol`). The CLI handler and the React submit handler both reduce to "set `exec`, call `ol`". This is why the feature was cheap to add: it reuses the daemon, worker, attach, logs, and stop machinery wholesale.
2. **`--exec` is a terminal, command-swallowing flag** — everything after it (space form) is the command, which is why it can only *compose* with `--name`. The warning (not error) for other flags is a usability/forgiveness trade-off.
3. **The gate `shellExecGate` guards both the UI mode toggle and the parse**, so the bash-mode UI can never desync from dispatch behavior.
4. **`resolveShellLaunch` prefers `$SHELL` on every platform**, falling back to `COMSPEC /d /s /c` on Windows and `/bin/sh -c` elsewhere — honoring the user's shell while degrading safely.
5. **The agents-view path pre-seeds the state file** (in `fleetDispatchExec`) so the optimistic UI card has a real backing file; the CLI path lets `ol` seed it because there's no UI to keep in sync.

---

## Cross-references

- Unified dispatcher / worker plumbing: `dispatch_flags.md`, `daemon_lifecycle.md`, `worker_state_machine.md` in this module.
- Built-in CLAUDE_AGENT prompt and classifier: see the bg-session classifier prompt (`r04`, cli_inner_pretty.js:449350 area) and `CLAUDE_AGENT_DEF` (`IV6`, cli_inner_pretty.js:236184) — documented with the four-state job classification.
- Attach / logs / stop verbs referenced in the banner: `KH9` (cli_inner_pretty.js:542090) parses the `logs|attach|stop|kill|respawn|rm` verb argv.
