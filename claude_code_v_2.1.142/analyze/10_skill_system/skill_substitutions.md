# Skill Body Substitutions (Args + Variables + `!`-fences)

> Companion to [skill_frontmatter.md](./skill_frontmatter.md) (frontmatter schema), [skill_lifecycle.md](./skill_lifecycle.md) (when a skill body is rendered), and [skill_overrides.md](./skill_overrides.md) (operator-tier visibility).
>
> Every time a skill is invoked (`/<name>` or via the Skill tool), the markdown body is rendered through a fixed pipeline of substitutions. This document is the **complete reference** for that pipeline: what each placeholder is, the order they fire, the edge cases (shell-quoting, missing args, output-not-re-scanned, policy gating), and where each step lives in v2.1.142 source.

---

## TL;DR

| # | Pass | Fires for | What it does |
|---|------|-----------|--------------|
| 0 | `Base directory for this skill: <dir>\n\n` prefix | All skills with a `skillRoot` | Emits a header line so the model knows where the skill lives |
| 1 | `uFH` — named args, indexed args, `$ARGUMENTS` | All skills with `argumentNames` or passed args | Replaces `$name`, `$ARGUMENTS[N]`, `$N`, `$ARGUMENTS`. If `$ARGUMENTS` not in body but args were passed, **appends** `\n\nARGUMENTS: <value>` to the end |
| 2 | `${CLAUDE_SKILL_DIR}` → `<skillRoot>` | Skills with a `skillRoot` (so: not MCP, not virtual) | Plain `replaceAll` |
| 3 | `${CLAUDE_SESSION_ID}` → current session UUID | All skills | Plain regex `replace` |
| 4 | `${CLAUDE_EFFORT}` → resolved effort string | All skills | Resolves via `aT(model, effort)` with frontmatter override taking precedence |
| 5a | `_M8` — disable-shell rewriter | Skills from `skills` / `commands_DEPRECATED` / `plugin` source **if** `disableSkillShellExecution` policy active | Replaces every `` !`cmd` `` and ` ```! ... ``` ` with `[shell command execution disabled by policy]` |
| 5b | `gHH` — shell-fence executor | Same sources, when policy NOT active. **MCP skills bypass entirely** | For each match, calls `tD()` permission check, runs `Bash` (or `PowerShell`), substitutes stdout/stderr into the body |

The pipeline is **one pass per substitution type**. Shell command output is **not** re-scanned — a command cannot emit `$ARGUMENTS` or `${CLAUDE_SESSION_ID}` for a later pass to expand.

---

## Two pipeline copies

There are actually **two** copies of this pipeline — one for **user/project skills + commands_DEPRECATED** (via `$I6` at `cli_inner_pretty.js:406257-406298`) and one for **plugin skills** (via `HP$` at `cli_inner_pretty.js:398992-399030`). They share the same passes in the same order, with two differences in the plugin pipeline:

| Plugin-only extra pass | Source | Purpose |
|------------------------|--------|---------|
| `Zn(body, { path, source })` (cli_inner_pretty.js:398998) | Plugin scanner | Resolves plugin-scope tokens (paths, source labels) |
| `v88(body, wV(repo), pluginManifest.userConfig)` (cli_inner_pretty.js:398999) | Plugin user_config | Substitutes `${user_config.KEY}` from the plugin's manifest-declared user config (prompted at enable time) |

The plugin pipeline also uses `KM8()` alone for the disable-shell decision (no `L45` check), and unconditionally calls `gHH` for the shell pass (no `X !== "mcp"` guard, because plugin skills are never MCP).

This document walks through the `$I6` variant, which is the canonical path for user/project skills. The plugin variant inherits all the same passes plus the two above.

## The full pipeline (`getPromptForCommand` body)

```javascript
// ============================================
// getPromptForCommand - The body of a Skill record's render callback
// Location: cli_inner_pretty.js:406257-406298
// ============================================

// ORIGINAL (for source lookup):
async getPromptForCommand(h, C) {
  let R = J
    ? `Base directory for this skill: ${J}\n\n${_}`
    : _;
  if (((R = uFH(R, h, !0, Y, rH8)), J)) {
    let B = J;
    R = R.replaceAll("${CLAUDE_SKILL_DIR}", B);
  }
  if (
    ((R = R.replace(/\$\{CLAUDE_SESSION_ID\}/g, v$())),
    (R = R.replaceAll("${CLAUDE_EFFORT}", aT(M ?? C.options.mainLoopModel, G ?? C.getEffortValue()))),
    L45(X, j) && KM8())
  )
    R = _M8(R);
  else if (X !== "mcp")
    R = await gHH(R, { ...C, getToolPermissionContext() { ... } }, `/${H}`, V);
  return [{ type: "text", text: R }];
}

// READABLE (for understanding):
async function getPromptForCommand(passedArgs, ctx) {
  // Pass 0: skill-root preface
  let body = skillRoot
    ? `Base directory for this skill: ${skillRoot}\n\n${markdownContent}`
    : markdownContent;

  // Pass 1: arg substitution. `rH8` escapes `!` so substituted args don't
  // accidentally introduce shell fences.
  body = substituteArgsInPrompt(body, passedArgs, /* appendIfMissing */ true,
                                argumentNames, /* valueTransform */ escapeBangs);

  // Pass 2: ${CLAUDE_SKILL_DIR}
  if (skillRoot) {
    body = body.replaceAll("${CLAUDE_SKILL_DIR}", skillRoot);
  }

  // Pass 3: ${CLAUDE_SESSION_ID}
  body = body.replace(/\$\{CLAUDE_SESSION_ID\}/g, getCurrentSessionId());

  // Pass 4: ${CLAUDE_EFFORT} — frontmatter effort/model override session value
  body = body.replaceAll(
    "${CLAUDE_EFFORT}",
    resolveEffortLabel(model ?? ctx.options.mainLoopModel, effort ?? ctx.getEffortValue()),
  );

  // Pass 5: shell fences — either gate them by policy, or run them
  if (loadedFromIsShellable(loadedFrom, source) && shellExecutionIsDisabled()) {
    body = replaceShellFencesWithPlaceholder(body);    // _M8
  } else if (loadedFrom !== "mcp") {
    body = await expandShellFences(body, ctxWithAllowedTools, `/${name}`, shell);  // gHH
  }
  return [{ type: "text", text: body }];
}

// Mapping: uFH -> substituteArgsInPrompt, rH8 -> escapeBangs,
//          v$ -> getCurrentSessionId, aT -> resolveEffortLabel,
//          L45 -> loadedFromIsShellable, KM8 -> shellExecutionIsDisabled,
//          _M8 -> replaceShellFencesWithPlaceholder, gHH -> expandShellFences,
//          J -> skillRoot, _ -> markdownContent, Y -> argumentNames,
//          M -> model, G -> effort, X -> loadedFrom, j -> source, V -> shell
```

---

## Pass 1 — `uFH` (argument substitution)

```javascript
// ============================================
// substituteArgsInPrompt - $name / $ARGUMENTS[N] / $N / $ARGUMENTS
// Location: cli_inner_pretty.js:217479-217509
// ============================================

// ORIGINAL (for source lookup):
function uFH(H, $, q = !0, K = [], _) {
  if ($ === void 0 || $ === null) return H;
  let A = (O) => {
      let M = O ?? "";
      return _ ? _(M) : M;
    },
    z = z36($),                                              // shell-quote-aware split
    Y = H,
    f = K.map((O, M) => ({ name: O, i: M }))
      .filter((O) => Boolean(O.name))
      .sort((O, M) => M.name.length - O.name.length);        // longest name first
  for (let { name: O, i: M } of f)
    H = H.replace(new RegExp(`\\$${Vx(O)}(?![\\[\\w])`, "g"), () => A(z[M]));
  H = H.replace(/\$ARGUMENTS\[(\d+)\]/g, (O, M) => A(z[parseInt(M, 10)]));
  H = H.replace(/\$(\d+)(?!\w)/g, (O, M) => A(z[parseInt(M, 10)]));
  H = H.replaceAll("$ARGUMENTS", () => A($));
  if (H === Y && q && $) H = H + `\n\nARGUMENTS: ${A($)}`;   // append-if-missing
  return H;
}

// Mapping: uFH -> substituteArgsInPrompt, $ -> argString, K -> argumentNames,
//          _ -> valueTransform, z36 -> shellQuoteAwareSplit, z -> argv,
//          Vx -> escapeRegex (v2.1.139 fix)
```

### Order, precedence, and quoting

1. **Named args first** (longest name first, to avoid `$foo` shadowing `$fooBar`). Each name has a regex `\\$name(?![\\[\\w])` — negative lookahead prevents `$user[1]` from being parsed as `$user` plus literal `[1]`, and prevents `$user_id` from matching `$user`.
2. **Indexed args**: `$ARGUMENTS[N]` then `$N`. Both use the same shell-quote-aware `argv` array from `z36`.
3. **`$ARGUMENTS`** last — replaces with the raw `argString` (no quoting).
4. **Append-if-missing**: if **none** of the above matched (`H === Y`) and args were passed and `q` is true (default), the function appends:
   ```
   <body>

   ARGUMENTS: <argString>
   ```
   This is how a skill written without any placeholder still sees what the user typed.

### Shell-quoting via `z36`

`z36` is shell-quote-aware: invoking `/migrate-component "SearchBar with spaces" React Vue` produces `argv = ["SearchBar with spaces", "React", "Vue"]`, so `$0` expands to the full quoted phrase. The unquoted form would split on whitespace.

`$ARGUMENTS` always expands to the **raw** string as the user typed it (no quoting transformation).

### Value transform (`_` / `escapeBangs`)

`uFH` accepts an optional `valueTransform` (`_`). In the skill render path, this is `rH8` (cli_inner_pretty.js:217510-217514):

```javascript
function rH8(H) {
  return H.replace(/`!/g, "` !")        // break "`!" sequences
    .replace(/!`/g, "! `")              // break "!`" sequences
    .replace(/(^|\s)!/gm, "$1\\!");     // escape line/word-start "!"
}
```

This prevents a user-supplied argument like `foo!\`whoami\`` from injecting a shell fence into the body. The escape happens **before** Pass 5 runs, so user arg values cannot cause shell execution.

### Regex-safe arg names (v2.1.139)

`Vx(O)` is `escapeRegex`. Before v2.1.139, an arg name like `foo.bar` produced a regex `\$foo.bar` where `.` matched any char — silently broken substitution. v2.1.139 wraps every arg name in `Vx`, fixing the bug. (See [regex_safe_args.md](./regex_safe_args.md) for the full story.)

---

## Pass 2 — `${CLAUDE_SKILL_DIR}`

```javascript
if (skillRoot) {
  body = body.replaceAll("${CLAUDE_SKILL_DIR}", skillRoot);
}
```

Plain `String.prototype.replaceAll`, no regex. Substitution only runs when the skill has a `skillRoot` (filesystem directory). Skills that lack one — MCP skills, virtual/synthesized skills — leave the placeholder literal.

For **plugin skills**, `skillRoot` points to the skill's subdirectory inside the plugin (`<plugin>/skills/<name>/`), **not** the plugin root. Use this to reference scripts bundled with the skill regardless of the current working directory:

```yaml
allowed-tools: Bash(python3 *)
---

Run: python3 ${CLAUDE_SKILL_DIR}/scripts/process.py
```

There is also an early-bind pre-pass for `allowed-tools`. Inside `$I6` (cli_inner_pretty.js:406223-406226):

```javascript
if (J && A.length > 0) {
  let h = J;
  A = A.map((C) => C.replace(/\$\{CLAUDE_SKILL_DIR\}/g, () => h));
}
```

So `allowed-tools: Bash(python3 ${CLAUDE_SKILL_DIR}/scripts/*)` is resolved at **skill load time**, not invoke time, so the permission rules already carry the absolute path before Pass 5 dispatches the `Bash` tool.

---

## Pass 3 — `${CLAUDE_SESSION_ID}`

```javascript
body = body.replace(/\$\{CLAUDE_SESSION_ID\}/g, getCurrentSessionId());
```

`v$()` returns the current session UUID (the same one used to name `~/.claude/projects/<cwd>/<session-id>.jsonl`). Useful for log files, scratch directories, correlation IDs.

---

## Pass 4 — `${CLAUDE_EFFORT}`

```javascript
body = body.replaceAll(
  "${CLAUDE_EFFORT}",
  aT(model ?? ctx.options.mainLoopModel, effort ?? ctx.getEffortValue()),
);
```

`aT` resolves the effort label (`low` / `medium` / `high` / `xhigh` / `max`) given a `(model, effort)` pair. Two override layers:

| Layer | Source | Wins over |
|-------|--------|-----------|
| Frontmatter `model` | `model: <name>` | session model |
| Frontmatter `effort` | `effort: <level>` | session effort |

When frontmatter omits both, the session model + session effort are used. The substituted string is the **string label** (not the numeric value), so a skill body like:

```markdown
Adjust verbosity to ${CLAUDE_EFFORT}.
```

becomes `Adjust verbosity to high.` if the session is on high. See [claude_effort_var.md](./claude_effort_var.md) for the full effort-resolution semantics.

---

## Pass 5 — shell fences (`!`)

Two regex variants, both for embedding shell command output into the skill body:

```javascript
j45 = /```!\s*\n?([\s\S]*?)\n?```/g       // fenced block
J45 = /(?<=^|\s)!`([^`]+)`/gm             // inline backtick form
```

Notice the inline form uses a **lookbehind** `(?<=^|\s)` — `!` is only recognised at the start of a line or immediately after whitespace. `KEY=!`whoami`` does **not** fire the fence because `!` follows `=` (non-whitespace). This is by design: it lets skills emit literal `!` next to other characters.

### 5a — `_M8` (disable-shell rewriter)

```javascript
// ============================================
// replaceShellFencesWithPlaceholder - The disabled-shell-execution gate
// Location: cli_inner_pretty.js:398844-398851
// ============================================

let gs7 = "[shell command execution disabled by policy]";
let uq5 = /```!\s*\n?[\s\S]*?\n?```/g;
let mq5 = /(?<=^|\s)!`[^`]+`/gm;

function _M8(H) {
  let $ = H.replace(uq5, gs7);                              // fenced first
  if ($.includes("!`")) {
    let q = oH8($);                                          // mask non-shell backticks
    for (let K of [...q.matchAll(mq5)].reverse())            // walk back-to-front
      $ = $.slice(0, K.index) + gs7 + $.slice(K.index + K[0].length);
  }
  return $;
}
```

Triggered when `KM8()` returns true (any of):

| Check | Source |
|-------|--------|
| `process.env.CLAUDE_CODE_IS_COWORK` truthy | Cowork (cloud sandbox) environment |
| `policySettings.disableSkillShellExecution === true` | Enterprise-managed setting |
| Merged settings (`Oq().disableSkillShellExecution === true`) | User/project/local override |

And `L45(loadedFrom, source)` returns true (skill came from a user-editable source, not from `policySettings`):

```javascript
function L45(H, $) {
  if ($ === "policySettings") return !1;                     // never gate policy-defined
  return H === "skills" || H === "commands_DEPRECATED" || H === "plugin";
}
```

So the gate fires for **user / project / local / plugin** skills, and is **bypassed** for:
- `bundled` skills (the binary's own `/init`, `/code-review`, etc.) — these are trusted
- `mcp` skills — these have no body to render through `gHH` anyway (Pass 5 short-circuits with `else if (X !== "mcp")`)
- Anything from `policySettings` (which is the source authorising the disable in the first place)

### 5b — `gHH` (shell-fence executor)

```javascript
// ============================================
// expandShellFences - Runs shell commands and inlines stdout
// Location: cli_inner_pretty.js:406026-406061
// ============================================

async function gHH(H, $, q, K) {                            // K = shell ("bash" | "powershell")
  let _ = H;
  if (K === "bash" && !Y9())                                // Y9 = isGitBashAvailable
    throw Error(`Skill ${q} requires bash ... but Git Bash was not found ...`);
  let A = K === "powershell" && Su() ? ke7() : Y9() ? L4 : ke7();   // pick tool
  let z = H.matchAll(j45);                                   // fenced
  let Y = H.includes("!`") ? oH8(H).matchAll(J45) : [];     // inline (masked)
  await Promise.all(
    [...z, ...Y].map(async (f) => {
      let O = f[1]?.trim();
      if (!O) return;
      try {
        let M = await tD(A, { command: O }, $, ZX({ content: [] }), "");
        if (M.behavior !== "allow") throw new wo(`...permission denied...`);
        let { data: w } = await A.call({ command: O }, $);
        let D = await BFH(A, w, Ne7.randomUUID());
        let j = typeof D.content === "string" ? D.content : Ee7(w.stdout, w.stderr);
        _ = _.replace(f[0], () => j);                       // single-pass replace
      } catch (M) {
        if (M instanceof wo) throw M;
        X45(M, f[0]);                                        // wrap and re-throw
      }
    }),
  );
  return _;
}
```

Per-fence behavior:

1. **Permission check** — `tD(A, { command: O }, $, ...)` runs the same permission gate that `Bash` tool calls would (so `Bash(git diff *)` in `allowed-tools` covers `` !`git diff` ``).
2. **Execute** via `Bash` (or `PowerShell` if `shell: powershell` and on Windows).
3. **Inline stdout** — formatted via `Ee7` (`stdout`, optionally followed by `[stderr]\n<stderr>`).
4. **Replace** the original fence with the output.

Notice the output replacement uses a **single-pass `String.prototype.replace`** with the literal match — the substitution is not re-scanned. A command that emits `!`whoami`` will leave that text literal; it won't recursively fire.

### Shell selection

`shell: powershell` in frontmatter sets `K = "powershell"`. The executor picks:

| Frontmatter | Platform | Selected tool |
|-------------|----------|----------------|
| `bash` (default) | macOS/Linux | `L4` (Bash) |
| `bash` | Windows w/ Git Bash | `L4` (Bash via Git Bash) |
| `bash` | Windows w/o Git Bash | **Errors** with install instructions |
| `powershell` | Windows | `ke7()` (PowerShell) — requires `CLAUDE_CODE_USE_POWERSHELL_TOOL=1` |
| `powershell` | macOS/Linux | falls through to bash (`Y9() ? L4 : ke7()`) |

---

## Substitution interactions and gotchas

### Order matters

Args → SKILL_DIR → SESSION_ID → EFFORT → shell. Why this order?

- **Args first** so arg values are escaped (`rH8`) **before** any subsequent pass sees them. A user typing `/x "$(date)"` cannot inject a shell command because `$(date)` is literal — `uFH` does not expand `$()` — and the `!`-escape transform breaks any `!` the user might have included.
- **`${CLAUDE_SKILL_DIR}` second** because shell commands may reference it (e.g. ``!`cat ${CLAUDE_SKILL_DIR}/data.json` ``). It must be expanded before Pass 5 reads the fence body.
- **Session ID and effort third/fourth** for the same reason.
- **Shell last** so that all variable substitutions are complete before the shell sees a command.

### One-pass-per-substitution

None of the substitutions re-scan their output. If a `!`echo '$ARGUMENTS'`` runs in Pass 5, the literal `$ARGUMENTS` in stdout stays — Pass 1 already ran.

### MCP skills bypass shell

MCP skill content arrives from a remote `prompts/list` response. It is treated as opaque user content — `else if (X !== "mcp")` in the pipeline skips Pass 5 entirely. MCP skills also have no `skillRoot`, so `${CLAUDE_SKILL_DIR}` stays literal in MCP skill bodies.

### Bundled skill content extraction

When a bundled skill has files attached (the `files` map on the bundled definition), those files are extracted to `<userDataDir>/bundled-skills/<name>/` on first invocation by `vE5` (cli_inner_pretty.js:494270-494280). `skillRoot` then points at the extracted directory, so `${CLAUDE_SKILL_DIR}/scripts/...` works the same way it would for a user-authored skill.

---

## Cross-references

- [skill_frontmatter.md](./skill_frontmatter.md) — the schema each substitution reads from (`arguments`, `shell`, `model`, `effort`)
- [skill_lifecycle.md](./skill_lifecycle.md) — when `getPromptForCommand` is called and what happens to the substituted body next
- [claude_effort_var.md](./claude_effort_var.md) — the `aT` effort resolver (v2.1.120 addition)
- [regex_safe_args.md](./regex_safe_args.md) — the v2.1.139 fix that added `Vx` (escapeRegex) around arg names
- `tD` / `BFH` — Bash tool's permission gate and execution path (used by Pass 5)
- `disableSkillShellExecution` setting at `cli_inner_pretty.js:50539` — admin-managed kill switch for `!`-fences
