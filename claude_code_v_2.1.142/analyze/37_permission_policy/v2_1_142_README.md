# Module 37 — Permission Policy: v2.1.142 Changes (v2.1.113 → v2.1.142)

**Scope:** Permission policy deltas accumulated across the v2.1.113 → v2.1.142 window. This module documents the *delta* on top of the [v2.1.112 baseline](../../../claude_code_v_2.1.112/analyze/37_permission_policy/README.md), focused on three coherent themes:

1. **Auto-mode rule customization** — settings-controlled `autoMode.{allow,soft_deny,hard_deny,environment}` with a `$defaults` sentinel for inheriting the built-ins.
2. **Path/wildcard correctness** — Edit/Write rules matching `C:\` and `/`, Skill `(name *)` prefix match, dangerously-skip permissions widened to `.claude/skills/`, `agents/`, `commands/`.
3. **Wrapper/expansion hardening** — `find -exec/-delete` blocked under `Bash(find:*)`, wrappers like `env`/`sudo`/`watch`/`ionice`/`setsid` treated as command prefixes for deny matching, sandbox auto-allow honors dangerous-path safety, `autoAllowBashIfSandboxed` permits AST-validated `$VAR`/`$(cmd)`.

This is a single coherent *defense-in-depth pass*: every bypass closed has a corresponding correctness fix elsewhere so well-formed allow rules still work.

---

## 1. The Window in One Diagram

```
                ┌────────────────────────────────────────────┐
                │  v2.1.112 baseline (37_permission_policy)  │
                │  Auto-mode GA, classifier hardening, bash  │
                │  bypass closures (compound, env-prefix, …) │
                └─────────────────────┬──────────────────────┘
                                      │
                  ┌───────────────────┴───────────────────┐
                  ▼                                       ▼
        Stronger blocks                     Better mode hygiene
        ─────────────────                   ─────────────────────
        • find -exec/-delete (113)          • bypassPermissions persists
        • Wrapper deny (env/sudo/...) (113) │   on writes (.97 baseline)
        • Sandbox safety (rm /, $HOME) 116  • background agent preserves
        • cmd:* prefix dedupe               │   mode (141)
        • macOS /private/{etc,var,…} (113)  • plan mode blocks Edit even
                                            │   with allow rule (136)
                                            • --permission-mode honored
                                            │   on -p --resume (132)
                                            • switching mode dismisses
                                            │   open prompt (141)
                                            │
                                            ▼
                              Better rule expressivity
                              ──────────────────────────
                              • $defaults token (118)
                              • hard_deny section (136)
                              • Skill(name *) wildcard (121, 139 fix)
                              • Edit(C:\), Edit(/) root match (133)
                              • parentSettingsBehavior key (133)
                              • skillOverrides setting (129)
                              • SDK localSettings suggestion (128)
                              • autoAllowBashIfSandboxed/$VAR/$(cmd) (139)
                              • Dangerous-skip widens .claude/skills (121,126)
```

**Two-axis theme:**
- **Vertical** (defense-in-depth): every layer in the pipeline gets a tightening — bash classifier, sandbox auto-allow, mode transitions, plan-mode write block.
- **Horizontal** (correctness): authors of well-formed allow/deny rules see them honored — drive-root paths, wildcard skills, env-prefix wrappers, `$defaults` for stacking on built-ins.

---

## 2. The Thirteen Documents

| Doc | Topic | Changelog version |
|-----|-------|-------------------|
| [`skill_wildcard_match.md`](./skill_wildcard_match.md) | `Skill(name *)` prefix-match wildcard | 2.1.121 (intro), 2.1.139 (fix) |
| [`auto_mode_hard_deny.md`](./auto_mode_hard_deny.md) | `autoMode.hard_deny` for unconditional blocks | 2.1.136 |
| [`permission_mode_persistence.md`](./permission_mode_persistence.md) | `--permission-mode` honored on resume; bg agents preserve mode | 2.1.132, 2.1.141 |
| [`drive_root_match.md`](./drive_root_match.md) | `Edit(C:\)`/`Edit(/)` allow rule matching fix | 2.1.133 |
| [`auto_mode_defaults_token.md`](./auto_mode_defaults_token.md) | `$defaults` sentinel in `autoMode.allow`/`soft_deny`/`hard_deny`/`environment` | 2.1.118 |
| [`dangerous_skip_path_expansion.md`](./dangerous_skip_path_expansion.md) | `--dangerously-skip-permissions` no-prompt list expanded to `.claude/skills/`, `agents/`, `commands/` | 2.1.121, 2.1.126 |
| [`sandbox_auto_allow_safety.md`](./sandbox_auto_allow_safety.md) | Sandbox auto-allow honors dangerous-path safety check for `rm`/`rmdir` | 2.1.116 |
| [`find_exec_delete_block.md`](./find_exec_delete_block.md) | `Bash(find:*)` no longer auto-approves `-exec`/`-delete` | 2.1.113 |
| [`bash_wrapper_deny.md`](./bash_wrapper_deny.md) | Bash deny rules match `env`/`sudo`/`watch`/`ionice`/`setsid` wrappers | 2.1.113 |
| [`localSettings_suggestion.md`](./localSettings_suggestion.md) | SDK Bash prompt suggests `localSettings` as durable destination | 2.1.128 |
| [`parent_settings_behavior.md`](./parent_settings_behavior.md) | `parentSettingsBehavior` (`first-wins` / `merge`) admin/parent tier merge | 2.1.133 |
| [`auto_allow_shell_expansion.md`](./auto_allow_shell_expansion.md) | `autoAllowBashIfSandboxed` accepts AST-validated `$VAR`/`$(cmd)` | 2.1.139 |

> A small set of compound items are folded into the closest doc:
> - macOS `/private/{etc,var,tmp,home}` dangerous (v2.1.113) — folded into [`sandbox_auto_allow_safety.md`](./sandbox_auto_allow_safety.md)
> - Plan-mode blocks Edit when allow rule matches (v2.1.136) — folded into [`permission_mode_persistence.md`](./permission_mode_persistence.md)
> - Switching permission mode auto-dismisses tool-permission prompt (v2.1.141) — folded into [`permission_mode_persistence.md`](./permission_mode_persistence.md)
> - Auto-mode prompt explains `permissions.ask` trigger (v2.1.141) — folded into [`auto_mode_hard_deny.md`](./auto_mode_hard_deny.md)
> - `skillOverrides` settings key off/user-invocable-only/name-only (v2.1.129) — folded into [`skill_wildcard_match.md`](./skill_wildcard_match.md)
> - `allowManagedDomainsOnly`/`allowManagedReadPathsOnly` ignored fix (v2.1.126) — folded into [`parent_settings_behavior.md`](./parent_settings_behavior.md)

---

## 3. Cross-Cutting Themes

### 3.1 The "$defaults" Sentinel Pattern

A small naming pattern with outsized reach: `$defaults` (literal string `"$defaults"`, a JS-safe-yet-shell-unsafe token) lets authors of `settings.json` *stack on top of* the built-in classifier rules rather than replace them:

```json
{
  "autoMode": {
    "allow": ["$defaults", "Bash(my-internal-tool *)"],
    "hard_deny": ["$defaults", "Path matching /etc/secrets/**"]
  }
}
```

The expansion happens at prompt-build time via `wJ$` (chunks `_top_*`):

```javascript
function wJ$(userRules, defaultRules, transform) {
  if (!userRules?.length) return [...defaultRules];
  let inserted = false, out = [];
  for (let rule of userRules) {
    if (rule === "$defaults") {
      if (!inserted) (out.push(...defaultRules), inserted = true);
      continue;
    }
    out.push(transform(rule));
  }
  return out;
}
```

**Why a sentinel?** Three alternatives were rejected (inferable from the design):
1. **Object form** (`{ extend: true, allow: [...] }`) — needed to discriminate at every key, adds schema noise
2. **Implicit append** — silently appending user rules to defaults would be surprising in `hard_deny` (where order/precedence matters and the user may explicitly want a tighter list)
3. **Multiple files** — would re-introduce the "where do my rules live?" problem the unified `settings.json` solved

A literal string is **explicit**: the user opts into "include the built-ins" by name, gets exact ordering, and can place their additions before/after.

### 3.2 Path-Match Symmetry: Drive Root + Wildcard Prefix

Two seemingly unrelated v2.1.121/133 fixes solve the same class of bug — *trailing wildcards stripping too aggressively*:

| Rule pattern | Pre-fix bug | Fix |
|---|---|---|
| `Edit(C:\**)` | `slice(0,-3)` → `"C:"` (drive letter, no path) → never matches actual `C:\foo` | If post-strip prefix is empty/root-like, restore `/**` |
| `Edit(/**)` | `slice(0,-3)` → `""` → never matches actual `/foo` | Same — restore `/**` for root |
| `Skill(name *)` | `(name *)` was treated as exact match for skill literally named `name *` (whitespace included) | Detect trailing ` *` (with leading space), strip, prefix-match |

In `yL` (chunks `_top_*`), the new logic at line 518104-518108:
```javascript
let f = Array.from(Y.keys()).map((D) => {
  let j = D;
  if (j.endsWith("/**")) {
    let J = j.slice(0, -3);
    j = /[^/]/.test(J) ? J : "/**";  // ← if all slashes, restore /**
  }
  return j;
}),
```

The `/[^/]/.test(J)` check is the cleverness: it asks "after stripping `/**`, is there any character that isn't a slash?" If yes (`/home/user`), use the prefix. If no (`""`, `/`, `//`), the user *intended* drive-root or filesystem-root match — keep `/**`.

### 3.3 Wrapper Awareness — The N64 Set

Bash deny rules previously failed to fire when the user wrapped a denied command in a transparent prefix like `sudo`, `env VAR=val`, `watch`, `ionice -c3`, `setsid`. The v2.1.113 fix introduces a wrapper-aware deny matcher driven by the `N64` set (chunks `_top_*`, line 421159):

```
"sh", "bash", "zsh", "fish", "csh", "tcsh", "ksh", "dash",
"cmd", "powershell", "pwsh",
"env", "xargs", "command", "builtin", "noglob",
"nice", "stdbuf", "nohup", "timeout", "time",
"watch", "ionice", "chrt", "setsid", "taskset",
"strace", "ltrace", "script", "flock", "unshare", "nsenter",
"sudo", "doas", "pkexec"
```

When the bash classifier walks the AST, it transparently strips these wrappers (`WdK` — see [`bash_wrapper_deny.md`](./bash_wrapper_deny.md)) before matching against deny rules. This is the same set that `LdK(M) || GA5.has(M) || ZA5.has(M)` checks in the sandbox-auto-allow path, so the policy is consistent across the bash classifier and the sandbox fast-path.

### 3.4 Mode Hygiene — Per-Decision State, Not Mode Mutation

v2.1.97-98 established the rule that *no permission decision mutates the mode*. v2.1.132 → v2.1.141 extend this in three places:

1. **Resume integrity** (132): `--permission-mode plan` on `claude -p --continue` now feeds through to the rebuilt context. The session log warns `permissionMode mismatch (deferred under 'plan', resuming under 'default') --resume does not restore permissionMode — pass --permission-mode plan to match.`

2. **Background agent preservation** (141): `eJH` (the permission-update callback) honors a `preserveMode: true` flag when applying updates:
   ```javascript
   toolPermissionContext: { ...j$, mode: a$?.preserveMode ? j8.toolPermissionContext.mode : j$.mode }
   ```
   When a background agent's hook returns `permissionUpdates`, the agent's mode is held even if the rules change.

3. **Open-prompt auto-dismiss** (141): switching mode while a permission prompt is open re-evaluates immediately. If the new mode would allow the call, the prompt closes; otherwise it stays.

The unifying theme is **mode is user-controlled, rules are policy-controlled**. Per-decision approvals and rule changes never mutate mode; mode changes can re-evaluate open prompts but never silently allow what the rules would deny.

---

## 4. Why This Matters

The v2.1.113 → v2.1.142 window does **not** introduce a new policy primitive — `permissions.{allow,deny,ask}`, `autoMode.{allow,soft_deny,hard_deny}`, and the safety classifier are all from before. What it introduces is **expressivity and correctness**:

| Class of fix | Versions | Why it matters |
|---|---|---|
| **Expressivity** (`$defaults`, `hard_deny`, `Skill(name *)`) | 118, 121, 136, 139 | Users can write rules that *augment* defaults rather than choose between defaults-or-custom |
| **Correctness** (drive root, wildcard prefix, parent merge) | 121, 133 | Well-formed rules actually match the paths/skills they should |
| **Defense-in-depth** (find -exec, wrapper deny, rm safety) | 113, 116 | Bypass classes closed *at the classifier* without weakening allow rules |
| **Mode integrity** (resume, bg agents, plan write block) | 132, 136, 141 | Mode is no longer mutated by side paths; rules can't override mode-level intent |

The team's response is consistent with the prior window: when a bypass is found, the corresponding code path **fails closed** (default to ask/deny rather than allow), and the policy logic adds a new check rather than weakening existing checks.

---

## 5. Reading Order

1. Start with [`auto_mode_hard_deny.md`](./auto_mode_hard_deny.md) and [`auto_mode_defaults_token.md`](./auto_mode_defaults_token.md) — these set up the auto-mode rule grammar that the rest builds on.
2. Then [`drive_root_match.md`](./drive_root_match.md) and [`skill_wildcard_match.md`](./skill_wildcard_match.md) — the two pattern-correctness fixes.
3. [`find_exec_delete_block.md`](./find_exec_delete_block.md) and [`bash_wrapper_deny.md`](./bash_wrapper_deny.md) — the concentrated bash classifier hardening.
4. [`sandbox_auto_allow_safety.md`](./sandbox_auto_allow_safety.md) and [`auto_allow_shell_expansion.md`](./auto_allow_shell_expansion.md) — the sandbox fast-path tightening + relaxation.
5. [`permission_mode_persistence.md`](./permission_mode_persistence.md), [`dangerous_skip_path_expansion.md`](./dangerous_skip_path_expansion.md) — mode-integrity and dangerous-skip behavior.
6. [`localSettings_suggestion.md`](./localSettings_suggestion.md), [`parent_settings_behavior.md`](./parent_settings_behavior.md) — SDK UX and managed-settings merging.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_infra_platform.md`](../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols
> - [`symbol_index_core_features.md`](../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_core_features.md) — Plan-mode/skills symbols

Key functions, constants, and settings keys discussed across these documents:
- `expandDefaultsList` (`wJ$`) — Inserts `$defaults` placeholder with built-in rules at sentinel position
- `extractDefaultRules` (`eA8`) — Parses the built-in `<user_*_rules_to_replace>` sentinels from the classifier system prompt template
- `getBuiltInClassifierRules` (`Kz8`) — Returns `{ allow, soft_deny, hard_deny, environment }` built-in defaults
- `mergeAutoModeWithDefaults` (`WS7`) — Wires user settings + defaults through `wJ$`
- `loadAutoModeRulesFromSettings` (`WAH`) — Walks all four settings tiers, concatenates `autoMode.{allow,soft_deny,hard_deny,environment}`
- `applyParentSlice` (`Tm8`) — Restricts parent-tier (SDK managed) settings to allow-or-add only; `Gm8` (`parentSettingsBehavior === "merge"`) gates whether parent layers in
- `isPathRuleMatch` (`yL`) — File-path rule matcher, fixed in v2.1.133 to restore `/**` when prefix is empty/root-only
- `checkSkillPermissions` (within `SnH.checkPermissions`) — Skill rule matcher with `(name *)` and `(name:*)` prefix-match
- `bashWrapperStripper` (`WdK`) — Walks AST, strips `time`/`nohup`/`timeout`/`nice`/`env`/`stdbuf`/`command`/`builtin`/`noglob` wrappers
- `safeAutoAllowWrappers` (`N64`) — Set of 33 wrappers considered "transparent" — incl. `env`, `sudo`, `watch`, `ionice`, `setsid`, all login shells
- `findDangerousFlags` (`gz6`) — Set of find-flags that block auto-allow: `-exec`, `-execdir`, `-ok`, `-okdir`, `-delete`, `-fprint`, `-fprint0`, `-fprintf`, `-fls`
- `findSafeFlags` (`Qz6`) — Set of find-flags that don't block auto-allow (`-name`, `-type`, `-mtime`, etc.)
- `isCriticalPath` (`nUH`) — Returns true for root `/`, root-children, home dir, and macOS `/private/{etc,var,tmp,home}`
- `parseSandboxAutoAllowWithAst` (`v64`) — AST-aware auto-allow path; new in v2.1.139 to handle `$VAR`/`$(cmd)`
- `Va1` / dangerously-skip protected directories — `[".git", ".vscode", ".idea"]` plus `.claude/commands`, `.claude/agents`
- `mc_` — `[".claude/skills", ".claude/commands"]` (used by team-skill auto-discovery; symmetric with the dangerously-skip list)
- `settings.autoMode.hard_deny` — v2.1.136 settings key (schema `dI9`)
- `settings.skillOverrides` — v2.1.129 settings key (record of `name → "on" | "name-only" | "user-invocable-only" | "off"`)
- `settings.parentSettingsBehavior` — v2.1.133 settings key (`"first-wins" | "merge"`)
- `settings.sandbox.autoAllowBashIfSandboxed` — v2.1.139 boolean
