# Plan Mode — Tool Interaction Matrix (v2.1.142)

> Exhaustive catalogue of which tools the model can invoke while in plan mode, what happens when it tries, and which gates each call traverses. Includes the v2.1.136 plan-mode write floor, the internal-path exemption that lets the plan file itself be written, and the special handling for Bash, AskUserQuestion, Agent, and MCP tools.
>
> This document is a *reference* — for the lifecycle / state machine see [implementation.md](./implementation.md); for the system-reminder text that tells the model these constraints, see [runtime_mechanism.md](./runtime_mechanism.md).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) — Symbol discoveries
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Plan Mode section
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Permissions

Key gating functions:
- `checkWritePermissionForTool` (obfuscated: `VkH`) — plan-mode write floor lives here, `cli_inner_pretty.js:518202`
- `checkEditableInternalPath` (obfuscated: `iUH`) — plan-file exemption, `cli_inner_pretty.js:518335`
- `checkPathSafetyForAutoEdit` (obfuscated: `bY$`) — pre-floor safety gate
- `isPlanModeFloorReason` (obfuscated: `d64`) — decision-reason classifier, `cli_inner_pretty.js:421723`
- `getReadOnlyToolsList` (obfuscated: `vz5`) — what's offered to the model in the full reminder, `cli_inner_pretty.js:424861`
- `EnterPlanModeTool.isReadOnly()` → returns `true` (`Q38`, `cli_inner_pretty.js:383825`)
- `ExitPlanModeV2Tool.isReadOnly()` → returns `false` (`V2`, `cli_inner_pretty.js:381676`)
- `requiresUserInteraction()` on `V2` → returns `true` unless `isTeammate()` (`AA`)

---

## 1. The Master Matrix

Each row covers one tool the model might invoke. Columns:

- **In plan mode** — what the gating system does when the model calls this tool
- **Gating path** — which permission function ultimately decides
- **System reminder offered?** — does the full reminder explicitly tell the model this is available?

| Tool | In plan mode | Gating path | System reminder offered? |
|------|--------------|-------------|--------------------------|
| `Read` | ✅ Allowed | Read-class default: `iUH`/`rUH` for reads — most paths fall through to "allow" because plan mode is read-only-safe | Yes — `vz5` always lists `Read` (variable `Bq`) |
| `Grep` | ✅ Allowed | Tool is `isReadOnly: true`; the agent loop short-circuits with `allow` for read-only tools in plan mode | Yes — `vz5` lists `Grep` (variable `v9`); aliased as `` `grep`/Grep `` in shell-env mode |
| `Glob` | ✅ Allowed | Same as Grep | Yes — `vz5` lists `Glob` (variable `d1`); aliased as `` `find`/Glob `` in shell-env mode |
| `Bash` (read-only commands) | ✅ Allowed | `Bash.isReadOnly(input)` checks `checkReadOnlyConstraints(command)`. If true (e.g. `ls`, `grep`, `cat`), `allow` | **No** — `vz5` does NOT list Bash. The model relies on the general "read-only operations only" preamble (`Zq4`) plus its own knowledge that read-only Bash commands are admissible |
| `Bash` (writing/mutating commands) | ❌ Blocked → "ask" | `Bash.isReadOnly(input)` returns `false`; the permission path runs `VkH` for path-bearing tools or asks for prompt-rule approval. In plan mode, the plan-mode floor fires for path-bearing operations | No — model is told "you MUST NOT … run any non-readonly tools" |
| `AskUserQuestion` (`Gz`) | ✅ Allowed | Tool is explicitly user-interactive and `isReadOnly`; allow path always | Yes — every reminder explicitly mentions `${Gz}` |
| `Write` to plan file | ✅ Allowed (internal-path bypass) | `VkH` calls `iUH` which detects the plan-files directory via `_y4` and returns `allow` with `{type:"other", reason:"Plan files for current session are allowed for writing"}` | Yes — full reminder says "create your plan at `${planFilePath}` using `${Yw.name}` (Write)" |
| `Edit` / `MultiEdit` to plan file | ✅ Allowed | Same as Write — `iUH` allows internal paths | Yes — full reminder says "make incremental edits using `${_D.name}` (Edit)" |
| `Write` / `Edit` to other files (no allow rule) | ❌ Blocked → "ask" → user dialog | `VkH` runs through deny rules → memory toggle → `.claude/` allow check (skipped in plan mode) → ask rules → `iUH` (passes through for non-plan paths) → safety check → **plan-mode floor (v2.1.136)** | No — explicitly forbidden in preamble (`Zq4`) |
| `Write` / `Edit` to other files (matching `Edit(/path)` allow rule) | ❌ **BLOCKED in v2.1.136** → "ask" | The v2.1.136 fix inserts the plan-mode floor BEFORE the allow-rule consultation. Even an explicit allow rule cannot bypass plan-mode read-only-ness | No |
| `NotebookEdit` to plan-file | ✅ Allowed | Same as Edit — `iUH` allows internal paths | (rarely used) |
| `NotebookEdit` to other | ❌ Blocked → "ask" | Same as Edit | No |
| `AgentTool` / `Task` (Plan Mode sub-agent type) | ✅ Allowed in Phase 1 (5-phase) | Phase 1 of the workflow explicitly recommends launching `Explore` agents in parallel. Sub-agents inherit plan mode but get the simpler `Ez5` reminder | Yes — Phase 1 says "Launch up to N Explore agents IN PARALLEL" |
| `AgentTool` / `Task` (other agent types) | Depends | Agent isReadOnly varies. Most agent types are allowed (research/Plan agents); `general-purpose` agent works because it's still gated through plan-mode within | Sometimes — Phase 2 mentions `Plan` agent |
| `TeamCreate` | ⚠️ Discouraged | Tool runs but the model is told to defer to `ExitPlanMode` first. The reminder explicitly says "Use `${V2.name}` (ExitPlanMode)" as the only end-of-turn for implementation | No — saved for post-approval |
| `ExitPlanMode` (`V2`) | ✅ Allowed (the canonical exit) | `V2.validateInput` requires `mode === 'plan'`; `V2.checkPermissions` always returns `ask` → dialog | Yes — `V2.name` appears multiple times per reminder |
| `EnterPlanMode` (`Q38`) | ❌ Throws in subagent context; otherwise harmless no-op | `Q38.call` throws if `context.agentId` is set; otherwise it just re-applies `setMode plan` (idempotent) | No — already in plan mode |
| MCP tools (`mcp__server__tool`) | ⚠️ Depends on per-tool `isReadOnly` | MCP tools declare `isReadOnly` in their definition. Read-only MCP tools (e.g. database queries) → allow. Write MCP tools → routed through the standard permission path with the plan-mode floor applying | No — explicit MCP guidance lives in the per-server MCP instructions reminder, not the plan reminder |
| `WebFetch` | ✅ Allowed | `WebFetch.isReadOnly` = true | Sometimes |
| `WebSearch` | ✅ Allowed | `WebSearch.isReadOnly` = true | Sometimes |
| `TodoWrite` | ✅ Allowed | `TodoWrite` writes to in-memory state, not files. `isReadOnly: false` but path-less → not routed through `VkH` | No — the reminder doesn't mention todo |
| Hooks-via-PreToolUse `decision: "allow"` | ⚠️ **Bypasses plan-mode floor** | If a `PreToolUse` hook returns `allow`, `checkPermissions` is skipped entirely. This is a documented behavior — hooks are a higher authority than mode gating | No — hooks are user-configured |

### Algorithm: Why hooks are higher authority than the plan-mode floor

**Decision:** A `PreToolUse` hook returning `decision: "allow"` (or `"approve"`) for `Edit`/`Write`/`MultiEdit` re-creates the pre-v2.1.136 escape hatch.

**Rationale:**
- Hooks are explicitly user-configured: the user wrote a script that says "approve this". Overriding that would silently fail their intent.
- Most plan-mode escapes via hooks are intentional — e.g. a hook that runs `eslint --fix` on every save and re-allows it even in plan mode.
- The plan-mode floor exists to plug **silent** bypass via allow rules. Hooks are loud (the user wrote them).

**Trade-off:** Organizations that depend on plan mode as a hard safety barrier should NOT register auto-approving Edit hooks. The hook system has no way to "respect plan mode automatically" — it's the hook author's responsibility.

See [hooks_integration.md §Hook Touchpoint 2](./hooks_integration.md#hook-touchpoint-2-pretooluse-on-writeedit-during-plan-mode-v21136) for the full hook + plan-mode interaction.

---

## 2. The Gating Pipeline for Write/Edit Tools

When the model emits `Write({file_path: "/foo/bar.ts", content: "..."})` while `mode === 'plan'`, the request flows through this pipeline:

```
       ┌──────────────────────────────────────┐
       │ Model emits Write tool_use            │
       └────────────────┬─────────────────────┘
                        │
                        ▼
       ┌──────────────────────────────────────┐
       │ Agent loop dispatches tool             │
       │ - validateInput → ok (path validation) │
       └────────────────┬─────────────────────┘
                        │
                        ▼
       ┌──────────────────────────────────────┐
       │ PreToolUse hooks fire (matcher: Write)│
       │ - hook returns allow → SKIP rest       │
       │ - hook returns deny → STOP             │
       │ - hook returns updatedInput → pass on  │
       │ - no decision → passthrough            │
       └────────────────┬─────────────────────┘
                        │
                        ▼
       ┌──────────────────────────────────────┐
       │ Tool.checkPermissions(input, ctx)     │
       │ - For Write/Edit, calls VkH internally│
       │   (or returns ask directly)            │
       └────────────────┬─────────────────────┘
                        │
                        ▼
       ┌──────────────────────────────────────┐
       │       VkH (checkWritePermissionForTool)
       │       — the master write gate         │
       └────────────────┬─────────────────────┘
                        │
              ┌─────────┴─────────┐
              │ Layered checks    │
              │ (in this order)   │
              ▼                   │
       ┌──────────────────┐       │
       │ 1. Deny rules    │ ─yes→ DENY
       └────┬─────────────┘
            │ no
            ▼
       ┌──────────────────┐
       │ 2. Memory toggle │ ─writing memdir & toggle off→ DENY
       └────┬─────────────┘
            │ no
            ▼
       ┌──────────────────────────────────────┐
       │ 3. .claude/** session-allow rule     │
       │    (SKIPPED in plan mode — note      │
       │    `q.mode !== "plan"` guard)        │
       └────┬─────────────────────────────────┘
            │ no
            ▼
       ┌──────────────────┐
       │ 4. Ask rules     │ ─yes→ ASK
       └────┬─────────────┘
            │ no
            ▼
       ┌──────────────────────────────────────┐
       │ 5. iUH (checkEditableInternalPath)   │
       │   - plan files → ALLOW                │
       │   - workflow scripts → ALLOW          │
       │   - scratchpad → ALLOW                │
       │   - agent memory → ALLOW              │
       │   - auto-memory files → ALLOW         │
       │   - preview launch.json → ALLOW       │
       │   - else → PASSTHROUGH                │
       └────┬─────────────────────────────────┘
            │ passthrough
            ▼
       ┌──────────────────────────────────────┐
       │ 6. Safety check (bY$):               │
       │   .git/, .claude/, .vscode/, .idea/, │
       │   shell configs, Windows perms       │
       └────┬─────────────────────────────────┘
            │ safe
            ▼
       ┌──────────────────────────────────────┐
       │ 7. **PLAN-MODE FLOOR (v2.1.136)**    │
       │    if (ctx.mode === 'plan')          │
       │      return ASK with                 │
       │        decisionReason:{type:'mode',  │
       │                       mode:'plan'}   │
       └────┬─────────────────────────────────┘
            │ NOT in plan mode
            ▼
       ┌──────────────────┐
       │ 8. acceptEdits   │ ─in mode + in workdir→ ALLOW
       └────┬─────────────┘
            │ not in acceptEdits
            ▼
       ┌──────────────────┐
       │ 9. Allow rules   │ ─yes→ ALLOW
       └────┬─────────────┘
            │ no
            ▼
       ┌──────────────────┐
       │ 10. Default ASK  │
       └──────────────────┘
```

### Algorithm: Layer Order Matters

**Key sequencing decisions:**

1. **Deny rules first** — user explicitly forbade this path; honor immediately.
2. **`.claude/**` allow rule check has a `q.mode !== "plan"` guard** — this is a v2.1.136 micro-fix. Even if the user has a session-level `.claude/**` allow rule (typically auto-granted by the "allow Claude to edit its own settings" dialog), it is silently revoked in plan mode. **Why:** `.claude/settings.json` writes shouldn't bypass plan mode either — the user opted into read-only.
3. **Ask rules come before iUH** — user-defined ask rules win over internal-path bypass. If the user has `Edit(/foo/plans/**) ask`, they get the ask dialog even for the model's own plan file (rare config but supported).
4. **`iUH` (internal paths) comes before safety + floor** — the plan file MUST always be writable, even if it happens to be inside `.claude/` or another safety-checked path.
5. **Safety check comes before the plan-mode floor** — safety checks are bypass-immune (even `bypassPermissions` mode honors them). If both fire on the same path, safety wins, returning `decisionReason: {type:"safetyCheck", ...}` not the plan-mode reason.
6. **Plan-mode floor comes before acceptEdits and allow rules** — this is the v2.1.136 fix. Without this position, an `acceptEdits` mode wouldn't apply (acceptEdits + plan are mutually exclusive), but more critically an `Edit(/foo/**)` allow rule WOULD apply. The floor blocks both.

### Algorithm: Why is the floor at layer 7, not layer 1?

**Trade-off considered:** Why not put the plan-mode floor FIRST and skip all subsequent checks?

**Reason:**
- **Deny rules must still apply in plan mode.** A user with `Edit(/etc/**) deny` should never have `/etc/passwd` get an "ask plan-mode" dialog — they want a hard deny.
- **The internal-path bypass MUST work.** The plan file itself lives inside `iUH`-controlled paths; the model needs to write to it.
- **Safety checks must still apply.** `.git/`, `.claude/settings.json`, shell configs need to ask regardless of plan mode.
- **The plan-mode floor is more user-friendly when phrased as "blocked by plan mode"** vs "blocked by safety check" — placing the floor after safety means the safety messages stay accurate ("this path is sensitive") rather than always saying "plan mode".

The floor is a **late-stage final-say gate** — everything important (deny, internal, safety) runs first; the floor then catches "everything else that would otherwise be allowed via allow rules or acceptEdits".

---

## 3. The Internal-Path Exemption (`iUH`)

The plan file itself MUST be writable while in plan mode (otherwise the model couldn't actually plan anything). The exemption is in `iUH` (`checkEditableInternalPath`, `cli_inner_pretty.js:518335-518381`):

```javascript
function iUH(H, $, q) {
  if (q && q.length > 0) return Dy4(q, iUH, $);   // path-list pre-check
  let K = X_.normalize(H);
  if (_y4(K))                                      // <- plan file detector
    return { behavior: "allow", updatedInput: $,
             decisionReason: { type: "other", reason: "Plan files for current session are allowed for writing" } };
  if (qu5(K))                                      // workflow scripts
    return { behavior: "allow", updatedInput: $,
             decisionReason: { type: "other", reason: "Workflow script files for current session are allowed for writing" } };
  if (zy4(K))                                      // scratchpad
    return { behavior: "allow", updatedInput: $,
             decisionReason: { type: "other", reason: "Scratchpad files for current session are allowed for writing" } };
  if (l5$(K))                                      // agent memory
    return { behavior: "allow", updatedInput: $,
             decisionReason: { type: "other", reason: "Agent memory files are allowed for writing" } };
  if (YF(K) && Rd())                               // memory dir + toggle off
    return { behavior: "deny", ... };
  if (!Zi$() && N5$(K))                            // auto-memory files
    return { behavior: "allow", updatedInput: $,
             decisionReason: { type: "other", reason: "auto memory files are allowed for writing" } };
  if (y2(K) === y2(X_.join($6(), ".claude", "launch.json")))  // preview launch.json
    return { behavior: "allow", updatedInput: $, ... };
  return { behavior: "passthrough", message: "" };
}
```

### Plan File Detection (`_y4`)

`_y4` checks whether the path matches the current session's plan file location:

- Path equals `${getPlansDirectory()}/${planSlug}.md` (main session), OR
- Path equals `${getPlansDirectory()}/${planSlug}-agent-${agentId}.md` (sub-agent variant)

The check uses the **current session's resolved slug** (`PDH(getSessionId())`) — so plan files from OTHER sessions are NOT exempt. If the model tries to write to a sibling plan file (`other-session-slug.md`), the request falls through to the plan-mode floor and gets blocked.

### Other Internal Paths

`iUH` also allows:

- **Workflow scripts** (`qu5`) — `.claude/workflows/*.sh` files for the workflow feature.
- **Scratchpad files** (`zy4`) — `.claude/scratchpad/*` files for `/scratchpad` and related commands.
- **Agent memory files** (`l5$`) — `.claude/agents/*/memory.md` for the auto-memory subsystem.
- **Auto-memory files** (`N5$`) — `.claude/memdir/**` when auto-memory is enabled.
- **Preview launch.json** (`.claude/launch.json`) — for IDE-preview integration.

None of these are gated by plan mode — they're considered "internal" Claude Code state that the agent should always be able to mutate.

---

## 4. Read-Only Tools — Pre-Floor Fast Path

Read tools (Read, Grep, Glob, AskUserQuestion, WebFetch, WebSearch, Bash with read-only commands) never hit `VkH`. Their gating short-circuits much earlier:

1. **`tool.isReadOnly()` returns `true`** — the agent loop knows this tool can't mutate state.
2. **Read-class permission check** runs (`rUH` for paths, or a path-less direct-allow for non-path tools).
3. **`rUH` and read-class default to allow** for most paths, with sandbox/safety exemptions.

Critically, **plan mode does NOT add extra constraints on reads.** The reasoning:

- Reads can't change system state; the worst case is the model "wastes" tokens.
- Reading sensitive files (`/etc/passwd`) is still gated by the standard read permission rules, not plan-mode.
- Aggressive reading is actively encouraged in plan mode — that's the entire research phase.

---

## 5. AskUserQuestion (`Gz`) — Special Status

`AskUserQuestion` (`Gz` in v2.1.142, `cli_inner_pretty.js` has the tool exported elsewhere) is treated as **the canonical user-interaction tool in plan mode**:

- Every full reminder mentions it: "use `${Gz}` to clarify requirements".
- The reminder explicitly forbids using AskUserQuestion to *ask about plan approval* — that's `ExitPlanMode`'s job.
- The end-of-turn instruction (`Gq4`) names AskUserQuestion as ONE OF TWO valid turn-end tools (the other is `ExitPlanMode`).

### Algorithm: Why is AskUserQuestion the gatekeeper for clarifications?

**Decision:** The model is instructed to use AskUserQuestion (not plain text questions) when it needs user input mid-planning.

**Rationale:**
- AskUserQuestion presents the user with a structured option list, which is much easier to answer than free-form text.
- The model can batch multiple questions in a single AskUserQuestion call, reducing back-and-forth.
- The user's selection is parseable structured data, so the model's next turn can react deterministically.
- Without this constraint, the model might end turns with "Should I use OAuth or JWT?" as plain text — but the agent loop has no way to "wait" for a text answer; it just looks for tool calls.

**Trade-off:** Forces the model to formulate questions as multiple-choice when sometimes free-form would suffice. The `placeholder` field of the AskUserQuestion option lets the model offer "Other:" with a free-form input as a fallback.

---

## 6. Bash — The Read-Only Subset

Bash is the most complex tool to gate. The `BashTool` (in v2.1.88 source) declares:

```typescript
isReadOnly(input) {
  const compoundCommandHasCd = commandHasAnyCd(input.command);
  const result = checkReadOnlyConstraints(input, compoundCommandHasCd);
  return result.behavior === 'allow';
}
```

`checkReadOnlyConstraints` (in `BashTool/readOnlyValidation.ts`) parses the command shell-syntax-aware. It returns "allow" only if EVERY piped/conjoined subcommand is on the read-only allowlist. The allowlist is large — includes:

- File listing/inspection: `ls`, `find`, `cat`, `head`, `tail`, `less`, `more`, `stat`, `file`
- Search: `grep`, `egrep`, `fgrep`, `rg`, `ag`, `ack`
- Git read-only: `git status`, `git log`, `git diff`, `git show`, `git branch -a`, `git config --list`
- Process inspection: `ps`, `top` (single-shot), `df`, `du`, `which`, `whereis`
- Network read-only: `curl --silent` (with specific flag patterns), `wget --spider`
- And many more

### Algorithm: Why is Bash gated *after* `isReadOnly`?

**Standard path:**
1. `BashTool.isReadOnly(input)` is called by the agent loop.
2. If true → tool is treated as read-only → bypass write-class gating → allow.
3. If false → fall through to standard permission check.

**Plan mode doesn't add extra Bash gates** because `isReadOnly` is the right granularity:
- A `ls -la` is harmless regardless of mode.
- A `rm -rf /` should be blocked in EVERY mode, not just plan.
- The plan-mode "you must not run non-readonly tools" reminder text is the model's primary guard. The permission system catches the model if it tries anyway.

**Trade-off:** A clever model could craft a shell command that LOOKS read-only but mutates state (e.g. `>` redirection inside a `cat`). The shell-syntax-aware parser tries to catch these (`cat foo > bar` is detected as a write). Edge cases that slip through fall back to the standard ask-the-user dialog.

### Plan-Mode Reminder Does NOT Mention Bash

`vz5` (`getReadOnlyToolsList`, `cli_inner_pretty.js:424861-424866`) returns the **Read / Glob / Grep** toolset — not Bash. The variables map as:

| Symbol | Tool name |
|--------|-----------|
| `Bq` (`cli_inner_pretty.js:141539`) | `"Read"` |
| `d1` (`cli_inner_pretty.js:141564`) | `"Glob"` |
| `v9` (`cli_inner_pretty.js:141468`) | `"Grep"` |

```javascript
function vz5() {
  let H = dM() && Y9(),                                   // shell-tool env detection
      $ = H ? [Bq, `\`find\`/${d1}`, `\`grep\`/${v9}`]    // shell env: alias Glob as `find`/Glob etc.
            : [Bq, d1, v9],                                // default: plain Read, Glob, Grep
      { allowedTools: q } = Jf();                         // user's --allowedTools restriction
  return (q && q.length > 0 && !H ? $.filter((_) => q.includes(_)) : $).join(", ");
}
```

So the iterative-workflow reminder (`kz5`) renders, e.g., "Use Read, Glob, Grep to read code" — or in shell-environment mode, "Use Read, \`find\`/Glob, \`grep\`/Grep to read code". **Bash is NEVER explicitly listed.**

### Why is Bash deliberately omitted from the reminder?

**Design decision:** Bash is too powerful and too easily-misused for the reminder to whitelist it explicitly. The 5-phase and iterative reminders both want the model to default to Read/Glob/Grep — pure read-only file-discovery tools — rather than Bash, which can shell out to arbitrary commands.

**The model is still allowed to use read-only Bash** (the permission check at `Bash.isReadOnly` handles that). But the reminder doesn't actively *advertise* Bash as a research tool. The model's training-time understanding of "read-only operations" plus the preamble's hard constraint (`Zq4`: "you MUST NOT run any non-readonly tools") is the guard.

**Trade-off:** A model with weaker plan-mode training might over-rely on Read/Glob/Grep when Bash piping (`grep -r foo | head`) would be more efficient. The cost is some efficiency loss; the benefit is that the model's reminder-anchored research style is dominated by tools that *cannot* mutate state, period.

### Bash Still Works When the Model Reaches For It

If the model bypasses the reminder's guidance and calls `Bash({command: "ls -la"})`:

1. `Bash.isReadOnly({command: "ls -la"})` → `checkReadOnlyConstraints` parses → returns `behavior: 'allow'` → `isReadOnly` returns `true`.
2. Tool is treated as read-only → bypass write-class gating → allow.

So Bash is available; the reminder just doesn't surface it.

---

## 7. The `d64` (`isPlanModeFloorReason`) Predicate

When the plan-mode floor fires, it tags the result with `decisionReason: { type: "mode", mode: "plan" }`. Downstream consumers use `d64` to detect this:

```javascript
// cli_inner_pretty.js:421723-421725
function d64(H) {
  return H?.type === "mode" && H.mode === "plan";
}
```

### Consumer 1: Auto-Mode Classifier Path

`tD` (`applyHookPermissionDecision`, `cli_inner_pretty.js:421879-421970`) uses `d64` to detect plan-mode floor decisions and bypass the auto-mode classifier:

```
when checkPermissions returns ask with decisionReason d64===true:
   - Emit tengu_auto_mode_fallback_to_ask analytics with reason: 'plan_mode_floor'
   - Do NOT route to the classifier (classifier might auto-approve)
   - Surface the ask to the user (or just deny in headless mode)
```

**Why?** Auto-mode tries to handle most asks automatically via the classifier. Plan-mode floor is special: it's a *user-affirmed read-only contract*. Auto-classifier auto-approving an Edit during plan mode would re-create the v2.1.136 bug under auto-mode.

### Consumer 2: Suggestion Generator

`hG$` (`generateSuggestions`, `cli_inner_pretty.js:518287`) uses `d64` indirectly. When generating suggestion buttons for the permission dialog (e.g. "Always allow Edit in this directory"), the function checks `q.mode === "plan"` and the `prePlanMode` to decide whether to suggest `setMode: acceptEdits`. The suggestion is only offered when:

```javascript
A = q.mode === "plan" && (q.prePlanMode === "auto"
                          || q.prePlanMode === "bypassPermissions"
                          || q.prePlanMode === "acceptEdits"
                          || q.prePlanMode === "dontAsk")  // these don't need acceptEdits
z = (q.mode === "default" || q.mode === "plan") && !A     // only suggest acceptEdits if no superset
```

**Algorithm:** Don't suggest `setMode: acceptEdits` when the user's pre-plan mode was already more permissive (auto, bypass, etc.). In those cases, the user just wants to "exit plan mode and resume what they were doing" — surfacing acceptEdits would be confusing.

---

## 8. v2.1.88 ↔ v2.1.142 Cross-Validation

| Behavior | v2.1.88 source (`filesystem.ts`, etc.) | v2.1.142 obfuscated | Status |
|----------|----------------------------------------|---------------------|--------|
| `checkWritePermissionForTool` layer order | Steps 1-5 (deny, internal, .claude allow, safety, ask, allow rules, default ask) — **NO plan-mode floor** | Steps 1-10 in `VkH` with plan-mode floor at step 7 | **DIFF:** v2.1.136 adds the floor at layer 7 |
| `.claude/**` allow rule mode-guard | Allow rule applied unconditionally | `q.mode !== "plan"` guard added | **DIFF:** v2.1.136 also restricts the `.claude/**` allow rule from bypassing plan mode |
| `checkEditableInternalPath` plan-file detection | Same `_y4`-equivalent | `iUH` calls `_y4` | Identical |
| `Bash.isReadOnly` shell-aware parser | `checkReadOnlyConstraints` in `BashTool/readOnlyValidation.ts` | Same allowlist (location in cli_inner_pretty.js) | Identical |
| AskUserQuestion's special role in plan reminder | Mentioned in reminder text | Same (`${Gz}` substitution in `Vz5`/`kz5`/`Ez5`) | Identical |
| `d64` floor-reason classifier | Not present | `cli_inner_pretty.js:421723` | **NEW in v2.1.136** |
| `tengu_auto_mode_fallback_to_ask` with `plan_mode_floor` reason | Not present | Emitted by `tD` | **NEW in v2.1.136** |
| Read-tool gating in plan mode | None (read-class default to allow) | None | Identical |
| MCP tool gating in plan mode | Per-tool `isReadOnly` declared by MCP server; rest standard | Identical | Identical |
| `iUH` internal paths (plan, scratchpad, memdir, etc.) | Same set in `checkEditableInternalPath` | Same set in `iUH` | Identical |
| `vz5` (`getReadOnlyToolsList`) returns Read/Glob/Grep with optional `find`/`grep` shell aliasing | `getReadOnlyToolNames` at `messages.ts:3299`. v2.1.88 emits `Read, ` `` `find` ``, `` `grep` `` (pure shell names) in embedded-tools mode | `vz5` emits `Read, ` `` `find`/Glob ``, `` `grep`/Grep `` (shows both alias AND tool name) in shell-env mode | **Minor text drift:** v2.1.142 surfaces both the shell alias and the tool name, helping the model match either mental model |
| Plan-mode suggestions in `hG$` | Yes (don't suggest acceptEdits if prePlanMode is supermode) | Yes | Identical |

### Summary of v2.1.136 Changes to Tool Interaction

1. **NEW**: Plan-mode floor in `VkH` at layer 7 (between safety and acceptEdits).
2. **NEW**: `.claude/**` allow rule has explicit `q.mode !== "plan"` guard.
3. **NEW**: `d64` predicate to distinguish plan-mode-floor decisions for analytics + classifier-bypass.
4. **NEW**: `tengu_auto_mode_fallback_to_ask` with `plan_mode_floor` reason emission.

**Everything else is identical to v2.1.88 — the matrix of which tools work in plan mode is unchanged. Only the *enforcement* of write-blocking has been strengthened.**

---

## 9. Failure Modes Summary

| Symptom | Cause | Where |
|---------|-------|-------|
| `Cannot write to <path> while in plan mode.` | Model tried Write/Edit/MultiEdit/NotebookEdit on a non-internal path | v2.1.136 floor in `VkH` |
| `You are not in plan mode.` | Model called `ExitPlanMode` outside plan mode | `V2.validateInput` |
| `EnterPlanMode tool cannot be used in agent contexts` | Sub-agent tried to call `EnterPlanMode` directly | `Q38.call` |
| `Claude requested permissions to write to <path>, but you haven't granted it yet.` (no allow rule) | Standard write-ask outside plan mode | `VkH` layer 10 |
| `Permission to edit <path> has been denied.` | Deny rule matched | `VkH` layer 1 |
| `Cannot write to memory while it is toggled off. Run /toggle-memory to re-enable automemory.` | Memory dir + toggle off | `VkH` layer 2 or `iUH` memory check |
| Plan file write silently allowed despite explicit deny? | Internal-path bypass takes precedence over allow/safety but NOT over deny (which is layer 1) | `iUH` runs after deny check |
| Hook `decision: "allow"` allowed an Edit in plan mode | Hooks bypass `checkPermissions` entirely | Documented hook authority |

---

## Related

- [runtime_mechanism.md](./runtime_mechanism.md) — what the model is *told* about these constraints
- [implementation.md](./implementation.md) — full lifecycle (entry → research → exit)
- [hooks_integration.md](./hooks_integration.md) — hook + plan-mode interaction details
- [permission_mode_persistence.md](./permission_mode_persistence.md) — v2.1.136 fix history
- [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) — `ExitPlanMode` tool body
- [enter_plan_mode_tool.md](./enter_plan_mode_tool.md) — `EnterPlanMode` tool body
