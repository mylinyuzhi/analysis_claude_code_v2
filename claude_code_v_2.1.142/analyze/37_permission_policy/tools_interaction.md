# Per-Tool `checkPermissions` Catalog (v2.1.142)

**Theme:** Every tool implements `async checkPermissions(input, ctx) → PermissionDecision`. This callback is **step 4** of `UA5`'s deterministic chain (see [`architecture.md`](./architecture.md) §4). The callback can return `allow` / `ask` / `deny` / `passthrough`, and the chain layers it with the static rule checks.

This document is the **per-tool catalog** — what each tool's `checkPermissions` does. Some return `passthrough` for everything (just defer to global rules); some have rich semantic checks (Bash classifier, Edit path safety); some are always-allow trivial cases.

The discussion of when `checkPermissions` is called and how its result composes with rules lives in [`architecture.md`](./architecture.md). Here we focus on **per-tool behavior**.

---

## 1. Catalog Overview

| Tool | Symbol | Line | Args | Default behavior | Key semantic |
|---|---|---|---|---|---|
| **Bash** | `Sq` | 419531 | `(H, $)` | (varies) | Full classifier — see §2 |
| **PowerShell** | `EK` | 405825 | `(H, $)` | (varies) | Mirrors Bash structure |
| **Edit** | `G7` | 415491 | `(H, $)` | `VkH(...)` | Path safety + allow rules |
| **Write** | `o4` | 360020 | `(H, $)` | `VkH(...)` | Same as Edit |
| **MultiEdit** | (within Edit) | — | — | `VkH(...)` | Composite |
| **NotebookEdit** | `VP` | 361796 | `(H, $)` | `VkH(...)` | Same shape, .ipynb |
| **Read** | `Bq` | 407268 | `(H, $)` | `CwH(...)` | Read-side path check |
| **Glob** | (file glob) | — | — | `CwH(...)` | Routed through Read check |
| **Grep** | `v9` | 339085 | `(H, $)` | `CwH(...)` | Same as Read |
| **Skill** | `fX` | 353604 | `({skill, args}, ctx)` | (varies) | Skill name matcher with wildcard |
| **Agent** | `D7` | 351977 | `(H, $)` | `{allow}` | Always allow (sub-policy applies inside subagent) |
| **WebFetch** | `FD` | 377370 | `(H, $)` | (varies) | Host preapproval + domain rules |
| **WebSearch** | `VI` | 381296 | `(H)` | (varies) | Domain rules |
| **ExitPlanMode** | `NZ` | 381702 | `(H, $)` | (varies) | Mode-transition gate |
| **EnterPlanMode** | (similar) | — | — | (varies) | Mode-transition gate |
| **AskUserQuestion** | `Gz` | 382131 | `(H)` | `{allow}` | Always allow (user input) |
| **TodoWrite** | `HV` | 272197 | `(H)` | `{allow}` | Always allow |
| **StructuredOutput** | `J0` | 207613 | `(H)` | `{allow}` | Always allow |
| **WaitForMcpServers** | `l3H` | 271591 | `(H)` | `{allow}` | Always allow |
| **ScheduleWakeup** | `nf` | 380652 | `(H)` | `{allow}` | Always allow |
| **SendMessage** | `mZ` | 382997 | `(H, $)` | `{ask, msg}` | Always ask (team protocol) |
| **REPL** | `m3` | 380416 | `(H)` | `{ask, msg}` | Always ask |
| **LSP** | `clH` | 387082 | `(H, $)` | `{ask, msg}` | Always ask |
| **Monitor** | `hL` | 385746 | `(H, $)` | (varies) | Command filtering |
| **Registered tool** | (dynamic) | 378663 | `()` | `{ask, msg}` | Always ask for plugin tools |

The lines refer to `cli_inner_pretty.js` in v2.1.142. The variable name (e.g., `Sq` for Bash) is the obfuscated module-level binding for the tool's definition object.

---

## 2. Bash (`Sq`, line 419531)

The largest and most complex `checkPermissions` callback. It runs the **full classifier pipeline** (`XL$`/`bashClassifier`).

### Behavior outline

```javascript
// cli_inner_pretty.js:419531 onwards (the Bash checkPermissions)
async checkPermissions(H, $) {
  let A = await XL$(H, $);                 // run classifier
  // If sandbox-overrideable, dangerouslyDisableSandbox check kicks in:
  if (/* conditions */) {
    /* dangerouslyDisableSandbox handling */
  }
  return A;  // verdict
}
```

`XL$` is the **classifier umbrella**. It coordinates:

1. **AST parse** — tree-sitter Bash parser
2. **Wrapper stripping** (`WdK`) — strips `sudo`, `env A=B`, `watch`, `time`, etc. (see [`bash_wrapper_deny.md`](./bash_wrapper_deny.md))
3. **Compound walk** — splits `cmd1 && cmd2` into segments, each evaluated separately
4. **Per-segment classifier**:
   - Check against **deny rules** (Bash deny matcher with wildcard support)
   - Check against **dangerous patterns** (`rm -rf /`, fork bombs, `/dev/tcp` redirects, etc.)
   - Check against **auto-allow safe list** (read-only commands)
   - Check against **allow rules** (Bash allow matcher)
   - If auto mode: defer to classifier LLM

### Return values

| Verdict | When |
|---|---|
| `{behavior: "deny", message, decisionReason}` | Dangerous pattern match (`rm -rf /`), classifier-style deny rule match, `/dev/tcp` redirect, etc. |
| `{behavior: "ask", message, decisionReason, pendingClassifierCheck}` | Default for non-allowlisted commands; `pendingClassifierCheck` triggers speculative classifier path (see [`canUseTool_flow.md`](./canUseTool_flow.md) §6) |
| `{behavior: "allow", updatedInput}` | Safe-list match (`ls`, `cat`, etc.) or matching allow rule |
| `{behavior: "passthrough"}` | Rare — Bash always has a verdict |

### Why so complex?

Bash commands are the largest attack surface in Claude Code. Every Unix command is potentially destructive. The complexity is:
- **Pre-execution analysis** — static AST + classifier catches dangerous patterns before they run
- **Wrapper transparency** — `sudo rm` should fire the same rule as `rm`
- **Compound awareness** — `safe && rm -rf /` fires deny on the rm segment

See [`bash_wrapper_deny.md`](./bash_wrapper_deny.md), [`find_exec_delete_block.md`](./find_exec_delete_block.md), [`auto_allow_shell_expansion.md`](./auto_allow_shell_expansion.md), [`sandbox_auto_allow_safety.md`](./sandbox_auto_allow_safety.md) for the deep-dives.

---

## 3. PowerShell (`EK`, line 405825)

Mirrors Bash's structure but for Windows PowerShell commands. The classifier:
- Parses PowerShell-style syntax (`-Command`, pipelines, `Get-/Set-` cmdlets)
- Strips equivalent wrappers (`powershell -Command`, `pwsh`)
- Applies similar dangerous-pattern checks (`Remove-Item -Recurse`, `Invoke-WebRequest` with code download, etc.)
- Same deny/ask/allow rule semantics

The Windows-specific consideration:
- UNC paths (`\\server\share\...`) get special handling
- Registry access via `reg add`, `Set-ItemProperty -Path HKLM:\...` triggers safety checks
- Scheduled task creation flagged

---

## 4. Edit / Write / NotebookEdit (`G7`/`o4`/`VP`)

All three route through `VkH` (cli_inner_pretty.js:518202 — `fileEditPermissionCheck`).

```javascript
// Edit (line 415491):
async checkPermissions(H, $) {
  return VkH(_D, H, q.toolPermissionContext);  // _D = Edit tool ref
}

// Write (line 360020):
async checkPermissions(H, $) {
  return VkH(Yw, H, q.toolPermissionContext);  // Yw = Write tool ref
}

// NotebookEdit (line 361796):
async checkPermissions(H, $) {
  return VkH(fB, H, q.toolPermissionContext);  // fB = NotebookEdit tool ref
}
```

### What `VkH` checks (cli_inner_pretty.js:518202-518286)

1. **Path normalization** — tilde expansion, backslash → forward slash on Windows, relative-to-absolute
2. **Working directory check** — path must be inside cwd or `additionalDirectories`. If not → `{behavior: "ask", decisionReason: {type: "workingDir"}}` (force prompt)
3. **Plan-mode floor** — if mode is `plan`, return `{behavior: "ask", decisionReason: {type: "mode", mode: "plan"}}`. The user must `ExitPlanMode` first. This is the v2.1.136 fix.
4. **Dangerous path safety** — `bY$` check: paths under `.git/`, `~/.ssh/`, `~/.aws/`, settings files, etc. return `{behavior: "ask", decisionReason: {type: "safetyCheck"}}` even with allow rules
5. **Allow rule lookup** — `Edit(./src/**)` against the path via `yL` (path matcher)
6. **Settings file gate** — Editing `~/.claude/settings.json` requires confirmation per call (no allow rule shortcut)
7. **Return** — usually `passthrough` (defer to global rule check in UA5) unless one of the above fired

### Returns

| Verdict | When |
|---|---|
| `{behavior: "deny"}` | Path is in a forbidden location (e.g., kernel paths, system directories) |
| `{behavior: "ask", decisionReason: {type: "mode", mode: "plan"}}` | Plan mode active |
| `{behavior: "ask", decisionReason: {type: "workingDir"}}` | Path outside allowed dirs |
| `{behavior: "ask", decisionReason: {type: "safetyCheck"}}` | Dangerous path (settings, .git, .ssh, etc.) |
| `{behavior: "ask", decisionReason: {type: "rule", rule: askRule}}` | Matching ask rule |
| `{behavior: "passthrough"}` | Defer to UA5's allow rule check |

### MultiEdit

The MultiEdit tool composes multiple Edit operations atomically. Its `checkPermissions` runs `VkH` for **each** path in the batch — if any path triggers a non-passthrough verdict, the worst (most-restrictive) verdict applies to the whole batch.

---

## 5. Read / Glob / Grep (`Bq`/`v9`)

```javascript
// Read (line 407268):
async checkPermissions(H, $) {
  return CwH($Y, H, q.toolPermissionContext);  // $Y = Read tool ref
}

// Grep (line 339085):
async checkPermissions(H, $) {
  return CwH(hV, H, q.toolPermissionContext);  // hV = Grep tool ref
}
```

### What `CwH` checks (read-side path check)

Less strict than `VkH` since Read/Grep/Glob don't modify files:
1. **Path normalization** — same as VkH
2. **Working directory check** — same as VkH (read still constrained to allowed dirs)
3. **UNC path detection** — Windows network share access flagged
4. **Suspicious Windows pattern** (`Yy4`) — patterns like `\\?\GLOBALROOT`, `..\..\..\.windows\system32`
5. **Sensitive path carve-out** — Even Read-allowed `additionalDirectories` excludes `~/.ssh/`, `~/.aws/credentials`, etc. unless explicitly added
6. **Return passthrough** unless one of above fires

Reading is generally permitted by default — the Read tool's `checkPermissions` only blocks **dangerous** reads (system files, credentials). Routine project file reads pass through.

---

## 6. Skill (`fX`, line 353604)

```javascript
// Skill checkPermissions (line 353604-353658):
async checkPermissions({ skill: H, args: $ }, q) {
  let _ = H;  // skill name (stripped of leading /)
  if (_.startsWith("/")) _ = _.substring(1);
  
  let O = (j) => {  // matchesSkillRule
    let J = j.startsWith("/") ? j.substring(1) : j;
    if (J === _) return !0;
    if (J.endsWith(":*") || J.endsWith(" *")) {
      let X = J.slice(0, -2);
      return _.startsWith(X);
    }
    return !1;
  };
  
  // Walk deny rules first
  for (let denyRule of denyRulesForSkill) {
    if (O(denyRule.ruleValue.ruleContent)) {
      return {behavior: "deny", message: ..., decisionReason: {type: "rule", rule: denyRule}};
    }
  }
  
  // Walk allow rules
  for (let allowRule of allowRulesForSkill) {
    if (O(allowRule.ruleValue.ruleContent)) {
      return {behavior: "allow", decisionReason: {type: "rule", rule: allowRule}};
    }
  }
  
  // Walk ask rules
  for (let askRule of askRulesForSkill) {
    if (O(askRule.ruleValue.ruleContent)) {
      return {behavior: "ask", decisionReason: {type: "rule", rule: askRule}};
    }
  }
  
  // No rule matched
  return {behavior: "passthrough"};
}
```

### The wildcard matching

The inner function `O` (matchesSkillRule):
- Strips leading `/` from rule (allow rules may be written as `/commit` or `commit`)
- Exact match: `Skill(commit)` matches skill `commit`
- Prefix wildcard: `Skill(commit *)` or `Skill(commit:*)` matches `commit anything`

This was a v2.1.121 introduction (wildcard syntax) and v2.1.139 fix (matcher was previously broken — see [`skill_wildcard_match.md`](./skill_wildcard_match.md)).

### Multi-rule walk order

Unlike VkH which only checks workingDir/mode/safety, the Skill checkPermissions does **its own full rule walk** (deny → allow → ask). The reason: skill rules have wildcard semantics that the generic rule matcher doesn't know about. By checking inside the tool's callback, the wildcard is honored.

This means Skill rules **don't** go through the generic `TL$`/`g64`/`eS6` matchers in `UA5`. The Skill tool's callback is authoritative for Skill rules.

---

## 7. Agent (`D7`, line 351977)

```javascript
// Agent checkPermissions (line 351977):
async checkPermissions(H, $) {
  let q = $.getAppState();
  return { behavior: "allow", updatedInput: H };
}
```

**Always allow** in the external v2.1.142 build. The v2.1.88 TS source has additional auto-mode routing for Anthropic internal ("ant") builds:

```typescript
// v2.1.88 src/tools/AgentTool/AgentTool.tsx:checkPermissions
async checkPermissions(input, context): Promise<PermissionResult> {
  const appState = context.getAppState();
  // Note: "external" === 'ant' guard enables dead code elimination for external builds
  if ("external" === 'ant' && appState.toolPermissionContext.mode === 'auto') {
    return {
      behavior: 'passthrough',
      message: 'Agent tool requires permission to spawn sub-agents.'
    };
  }
  return { behavior: 'allow', updatedInput: input };
}
```

The Bun bundler dead-code-eliminates the `"external" === 'ant'` branch for non-ant builds, so v2.1.142 external bundles just have the bare `{behavior: "allow"}`. Ant-internal builds would route the Agent tool through the auto-mode classifier when mode is `auto`.

The Agent tool's permission check is trivially `allow` (in external builds) because:
- The subagent it spawns runs its own permission chain (every tool call inside the subagent goes through its own `tD`)
- A subagent can't escape its parent's permission scope (rules inherit)
- The Agent tool itself is just a dispatcher

If you want to **deny** spawning specific agents, use `Agent(agent-type)` deny rules at the *rule* level. The Agent tool's callback won't help — it doesn't inspect the agent type.

### Per-agent denials

The actual filtering is in `filterAgentsByPermission` (`GnH`, cli_inner_pretty.js:421599) which runs at *agent resolution* time:

- An `Agent(experimental-agent)` deny rule removes that agent type from the resolvable list
- The Agent tool's call handler raises "Agent type 'experimental-agent' has been denied by permission rule" *before* it calls `checkPermissions`
- So `checkPermissions` only ever runs for *resolvable* agents — which are by definition allowed

This is a different layering: per-agent permissions are filter-out semantics; per-tool permissions are check-and-block semantics.

---

## 8. WebFetch (`FD`, line 377370)

```javascript
// WebFetch checkPermissions (line 377370-377389):
async checkPermissions(H, $) {
  let O = new URL(H.url);
  
  // Preapproved hosts (claude.ai docs, anthropic.com, etc.)
  if (ff8(O.hostname, O.pathname)) {
    return {behavior: "allow"};
  }
  
  // Walk deny rules by hostname
  for (let denyRule of webFetchDenyRules) {
    if (denyRule.ruleValue.ruleContent === `domain:${O.hostname}` || /* wildcard match */) {
      return {behavior: "deny", message: `WebFetch to ${O.hostname} blocked by rule`, decisionReason: ...};
    }
  }
  
  // Walk ask rules by hostname
  for (let askRule of webFetchAskRules) {
    if (matchesDomain(askRule, O.hostname)) {
      return {behavior: "ask", message: ..., decisionReason: ...};
    }
  }
  
  // Default: passthrough (allow rule check in UA5)
  return {behavior: "passthrough"};
}
```

### Preapproved hosts (`ff8`)

A built-in allowlist of hosts that are always allowed:
- Anthropic's own documentation (`code.claude.com`, `platform.claude.com`, `docs.anthropic.com`)
- Other Anthropic-controlled URLs

This bypasses any rule walk — the user can't deny WebFetch to claude.ai's docs because the docs are how the `claude-code-guide` agent learns to help them.

### Wildcard subdomain matching

The rule grammar supports `WebFetch(domain:*.example.com)`:
- Matches any subdomain (`api.example.com`, `cdn.example.com`)
- Doesn't match `example.com` itself (no subdomain part)
- Doesn't match `other-example.com` (different domain)

### `deniedMcpServers` parallel

WebFetch rules and `deniedMcpServers` use similar URL-pattern semantics but operate at different layers:
- WebFetch rules: per-call permission
- deniedMcpServers: server-connection-time block

A server denied at connection time never has its tools available — no WebFetch (or any other) call against it can succeed.

---

## 9. WebSearch (`VI`, line 381296)

```javascript
async checkPermissions(H, $) {
  // Walk rules of form WebSearch(some query text)
  // Match against H.query
}
```

WebSearch rules are unusual: they target **search query content** (not URLs). `WebSearch(claude ai)` matches any search containing "claude ai" as a substring.

In practice this rule type is rare — most users either allow all WebSearch or deny it entirely. The per-query allow is for very specific scripted use cases.

---

## 10. ExitPlanMode / EnterPlanMode (`NZ`, line 381702)

```javascript
async checkPermissions(H, $) {
  // Check current mode, suggested mode, etc.
}
```

Mode-transition tools have their own logic:
- **EnterPlanMode** typically always allows (the user wants to plan; nothing destructive happens)
- **ExitPlanMode** requires the user to *confirm the plan* — the prompt UI shows the plan summary and the user accepts/rejects

The `ExitPlanMode` prompt is itself a permission prompt of a different shape (see [`permission_dialog_ui.md`](./permission_dialog_ui.md) §9). The acceptance toggles the mode out of plan; rejection keeps the mode and asks Claude to revise.

---

## 11. AskUserQuestion (`Gz`, line 382131)

```javascript
async checkPermissions(H) {
  return { behavior: "allow", updatedInput: H };
}
```

Always allow. AskUserQuestion is the model asking the user a question — the user obviously wants to see the question. No permission check needed.

The prompt that follows the tool call shows the question and lets the user answer; that's a *different* UI (`AskUserQuestionPermissionRequest`), but it's not a permission prompt in the conventional sense.

---

## 12. TodoWrite (`HV`, line 272197)

```javascript
async checkPermissions(H) {
  return { behavior: "allow", updatedInput: H };
}
```

Always allow. Writing to the todo list is purely in-memory state, no filesystem or network impact. There's no reason to gate it.

---

## 13. StructuredOutput / WaitForMcpServers / ScheduleWakeup (all `{allow}`)

These are **non-side-effect** tools:
- StructuredOutput: emit JSON in a specific shape
- WaitForMcpServers: pause until MCP server connections settle
- ScheduleWakeup: schedule a future wake-up

None of them mutate state externally; none can be misused. Always allow.

---

## 14. SendMessage (`mZ`, line 382997)

```javascript
async checkPermissions(H, $) {
  return { behavior: "ask", message: "Send message to teammate?" };
}
```

**Always ask.** SendMessage routes messages to other agents in a multi-agent team. The user should see and approve each message — same security thinking as for any cross-process communication.

In coordinator mode, the SendMessage prompt is routed via the coordinator handler (see [`canUseTool_flow.md`](./canUseTool_flow.md) §5), which may auto-approve based on the team's policy.

---

## 15. REPL / LSP / Registered Tool — `{ask}` for the same reason

```javascript
// REPL (line 380416): { behavior: "ask", message: "..." }
// LSP (line 387082): { behavior: "ask", message: "..." }
// Registered (378663): { behavior: "ask", message: 'Execute registered tool "${name}"' }
```

These tools have effects beyond Claude Code's local scope:
- **REPL**: executes code in a notebook kernel
- **LSP**: queries a language server (which may spawn processes)
- **Registered**: plugin-supplied tools whose behavior is opaque to Claude Code

Default to ask. The user can write allow rules if they trust specific tools.

---

## 16. Monitor (`hL`, line 385746)

```javascript
async checkPermissions(H, $) {
  // Apply command-filtering to the monitor's setup
  // Similar to Bash but for monitor commands
}
```

The Monitor tool starts long-running watchers. The check is similar to Bash: parse the command, classify safety, walk rules.

---

## 17. The Common Pattern — Layered Decisions

Across all tools, the **layering** is consistent:

```
                    UA5 calls tool.checkPermissions(input, ctx)
                                  │
                                  ▼
            ┌──────────── tool's verdict ─────────────┐
            │                                          │
            ▼                                          ▼
        deny / ask                                  passthrough / allow
        (tool stops here)                           (UA5 continues to step 11)
            │                                          │
            │                                          ▼
            │                                  allow rule check
            │                                          │
            │                                          ▼
            │                                  if match → allow
            │                                          │
            │                                          ▼
            │                                  else → ask (default)
            │
            ▼
        UI prompt fires or
        tool result deny envelope
```

Tools that return **passthrough** participate in the global rule chain. Tools that return concrete verdicts (allow / ask / deny) **override** the global rule chain (for the verdict-specific path).

This pattern lets simple tools (TodoWrite) just say `allow` without engaging the rule chain, while complex tools (Bash, Edit) participate fully in the chain via their semantic checks.

---

## 18. Why Tool-Specific `checkPermissions`?

A purely-static-rule system would have to express every tool's nuance:
- Bash needs AST parsing, wrapper stripping, classifier integration
- Edit needs path normalization, glob matching, safety checks
- Skill needs wildcard matching on names
- WebFetch needs URL parsing, hostname matching

Encoding all of this in pure rule strings would make the rules grammar enormous and brittle. Instead:
- **The rules grammar stays simple** (just `Tool(content)`)
- **The matching nuance lives in code** (each tool's `checkPermissions`)
- **The composition is at the UA5 level** (rules + tool callback combined deterministically)

A tool author adding a new tool writes:
1. Tool's `inputSchema`
2. Tool's `handleToolUse`
3. Tool's `checkPermissions` — return `passthrough` for default behavior, override only if nuance is needed

No global grammar changes; no central matcher rewrites.

---

## 19. Cross-Validation with v2.1.88

Each tool's `checkPermissions` in v2.1.142 mirrors its v2.1.88 TypeScript source:
- `BashTool.tsx` / `bashPermissions.ts` — full classifier + AST + wrappers (same)
- `FileEditTool.tsx` — calls `fileEditPermissionCheck` (= VkH) (same)
- `SkillTool.tsx` — wildcard-aware checker (same, post-v2.1.139 fix)
- `WebFetchTool.tsx` — preapproved hosts + domain rules (same)
- etc.

The fundamental contract (callback returns `PermissionDecision`) is unchanged. v2.1.142 additions are mostly in the *callbacks themselves* — better Bash classifier, plan-mode floor in VkH (v2.1.136), wildcard fix in Skill (v2.1.139), AST-aware sandbox auto-allow (v2.1.139).

The set of tools and their per-tool `checkPermissions` semantics is the most stable layer of the permission system. New tools added in v2.1.142 (e.g., the bg-agent FleetView `claude` agent's tools) use the same pattern.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md)
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md)

Key functions and tool definitions in this document:
- `checkPermissions` callback shape — async (input, ctx) → PermissionDecision
- Per-tool entries: `Sq` (Bash, 419531), `EK` (PowerShell, 405825), `G7` (Edit, 415491), `o4` (Write, 360020), `VP` (NotebookEdit, 361796), `Bq` (Read, 407268), `v9` (Grep, 339085), `fX` (Skill, 353604), `D7` (Agent, 351977), `FD` (WebFetch, 377370), `VI` (WebSearch, 381296), `NZ` (ExitPlanMode, 381702), `Gz` (AskUserQuestion, 382131), `HV` (TodoWrite, 272197), `J0` (StructuredOutput, 207613), `l3H` (WaitForMcpServers, 271591), `nf` (ScheduleWakeup, 380652), `mZ` (SendMessage, 382997), `m3` (REPL, 380416), `clH` (LSP, 387082), `hL` (Monitor, 385746)
- `VkH` — Edit/Write/NotebookEdit shared check function (cli_inner_pretty.js:518202-518286)
- `CwH` — Read/Grep/Glob shared check function (cli_inner_pretty.js:518141)
- `XL$` — Bash classifier umbrella function
- `WdK` — Bash wrapper stripper (cli_inner_pretty.js:205239)
- `bY$` — Dangerous-path safety check (cli_inner_pretty.js:517958)
- `yL` — Path rule matcher (cli_inner_pretty.js:518097)
- `ff8` — WebFetch preapproved-host check
- `GnH` — `filterAgentsByPermission` for agent-type filtering (cli_inner_pretty.js:421599)
- `decisionReason` types: `"rule"`, `"mode"`, `"safetyCheck"`, `"workingDir"`, `"classifier"`, `"hook"`, `"other"`
- `permissionDecision` shape: `{behavior, message?, updatedInput?, decisionReason?, contentBlocks?, suggestions?, pendingClassifierCheck?}`
