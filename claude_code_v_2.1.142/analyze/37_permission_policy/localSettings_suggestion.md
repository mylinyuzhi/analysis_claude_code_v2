# SDK Bash Prompt `localSettings` Persistent Suggestion — v2.1.128

**Theme:** When the user approves a `Bash(npm test)` prompt, Claude Code offers to *remember* the approval — adding the rule to a settings file so the prompt doesn't fire again. Pre-v2.1.128, the SDK (`-p`/`--print` mode) didn't offer this UX; SDK consumers had no way to persist allow rules across sessions. v2.1.128 wires the destination `localSettings` into the suggestion-builder paths used by the SDK Bash prompt.

The fix is small in code but enables a real workflow: **agentic SDK runners** (e.g., CI jobs, IDE integrations, headless agents) that need durable allow rules between sessions, written to a per-project file that's not checked in.

---

## 1. The Three Settings Destinations

Settings can be written to three durable destinations + one session-scoped:

| Destination | File | Visibility | Lifetime |
|---|---|---|---|
| `userSettings` | `~/.claude/settings.json` | All projects | Across sessions |
| `localSettings` | `.claude/settings.local.json` (gitignored) | Current project | Across sessions |
| `projectSettings` | `.claude/settings.json` (checked in) | Current project | Across sessions, shared with team |
| `session` | In-memory only | Current session | This session only |

The SDK's typical use is **per-project, not checked in** — `localSettings` matches that need exactly. The user runs `claude -p ...` in their project, approves a rule, and the rule lives in `.claude/settings.local.json` — their next CI run picks it up, but the team's checked-in settings don't.

---

## 2. The Suggestion Builders — `pe$` and `uY$`

The two functions that build allow-rule suggestions are `pe$` (exact) and `uY$` (prefix-wildcard). Both already pre-existed; v2.1.128 wires them into the SDK path:

```javascript
// ============================================
// suggestExactRule - Build an exact allow-rule update to localSettings
// suggestPrefixRule - Build a prefix wildcard allow-rule update
// Location: cli_inner_pretty.js:207234-207248
// ============================================

// ORIGINAL (for source lookup):
function pe$(H, $) {
  return [
    { type: "addRules", rules: [{ toolName: H, ruleContent: $ }], behavior: "allow", destination: "localSettings" },
  ];
}
function uY$(H, $) {
  return [
    {
      type: "addRules",
      rules: [{ toolName: H, ruleContent: `${$} *` }],
      behavior: "allow",
      destination: "localSettings",
    },
  ];
}

// READABLE (for understanding):
function suggestExactRule(toolName, ruleContent) {
  return [
    {
      type: "addRules",
      rules: [{ toolName, ruleContent }],
      behavior: "allow",
      destination: "localSettings",       // ← v2.1.128 — durable per-project
    },
  ];
}

function suggestPrefixRule(toolName, ruleContentPrefix) {
  return [
    {
      type: "addRules",
      rules: [{ toolName, ruleContent: `${ruleContentPrefix} *` }],  // append " *"
      behavior: "allow",
      destination: "localSettings",
    },
  ];
}

// Mapping: pe$→suggestExactRule, uY$→suggestPrefixRule, H→toolName, $→ruleContent/ruleContentPrefix
```

### The two shapes — exact vs prefix wildcard

For `npm test`, the suggestions are:
- **Exact**: `Bash(npm test)` — matches only `npm test`, not `npm test --verbose`
- **Prefix wildcard**: `Bash(npm test *)` — matches `npm test`, `npm test --verbose`, `npm test foo`

The user picks at the prompt. For one-off commands, exact is the safer choice. For commands that have many variants (test runners, scripts), the prefix wildcard reduces future prompts.

### Why " *" (space-asterisk)?

The trailing ` *` (note the leading space) is the **prefix-match sentinel** for the bash classifier. See [`skill_wildcard_match.md`](./skill_wildcard_match.md) — same convention applies. The matcher recognizes ` *` and strips it to form a prefix, then does `startsWith(prefix)`.

---

## 3. Wiring Into the SDK Path

The SDK's permission flow (when `permissionPromptTool` is set, or when the SDK is using its built-in stdio-based prompt) routes the suggestion through the same callback chain that the interactive CLI uses. The suggestion's `destination: "localSettings"` tells the permission-update applier where to write.

Pre-v2.1.128, the SDK either:
1. Used `destination: "session"` — durable for the session, lost on `claude` exit (default SDK behavior)
2. Didn't offer the suggestion at all (some code paths)

The v2.1.128 change makes `destination: "localSettings"` the **default suggestion** for Bash rules in the SDK. The user (or the SDK host's UX) accepts the suggestion, and the rule is **written to disk** in `.claude/settings.local.json`.

### The `Dk` applier

The function that actually applies the suggestion is `Dk` (chunks `_top_*` — the permission-update applier), which:

1. Reads the current `.claude/settings.local.json` (or creates it)
2. Adds the rule to `permissions.allow`
3. Writes back atomically
4. Updates the in-memory `toolPermissionContext` to reflect the new rule

This is the same applier used everywhere — the v2.1.128 fix is just making sure the SDK code path constructs an update with `destination: "localSettings"` instead of falling through to defaults.

---

## 4. The User-Visible Flow

```
$ claude -p "test the codebase"

Claude wants to run: npm test
  [a] Allow once
  [s] Allow this for the session
  [p] Allow and add Bash(npm test) to .claude/settings.local.json    ← v2.1.128
  [w] Allow and add Bash(npm test *) to .claude/settings.local.json  ← v2.1.128
  [d] Deny

> p

[command runs]
[$ cat .claude/settings.local.json]
{
  "permissions": {
    "allow": ["Bash(npm test)"]
  }
}

$ claude -p "test again"
[no prompt — rule from .claude/settings.local.json fires]
```

The `[p]` option (persistent to localSettings) is the new flow. Pre-fix, options `[a]` (once) and `[s]` (session) were available; option `[p]` was either absent or wrote to `userSettings` (`~/.claude/settings.json`, global) which most users didn't want.

---

## 5. Why `localSettings` (Not `projectSettings`)

The team chose `localSettings` (`settings.local.json`) over `projectSettings` (`settings.json`) for several reasons:

### `.local.json` is `.gitignore`-friendly

Claude Code's `init` adds `.claude/settings.local.json` to `.gitignore` by default. So allow rules added via the SDK don't accidentally end up checked into the user's repo. The user can later promote them to `settings.json` if they want them shared with the team.

### Settings can't escalate without conscious action

`projectSettings` is checked in. If the SDK silently wrote to it, a team member running the SDK could accidentally add an allow rule that other team members get pulled into. `localSettings` is per-machine — explicit promotion is required for sharing.

### The SDK is per-developer, per-project

The SDK's typical caller is an individual developer's CI runner, IDE plugin, or local agent. The scope is per-project (CI runs in *this* repo) and per-developer (each dev has their own SDK setup). `localSettings` matches this naturally.

---

## 6. The Symmetric Read Path

The same `localSettings` destination is the default for **other** suggestion paths — Skill approvals ([`skill_wildcard_match.md`](./skill_wildcard_match.md) line 353637-353650), Read tool path approvals, etc. The pattern is consistent: **persistent suggestions go to `localSettings`**.

When the SDK starts up, `localSettings` is loaded as part of the settings-tier walker. So persistent rules show up in `permissions.allow` for the **next** session automatically. No re-approval needed.

---

## 7. Why Not Just Use Hooks?

A more general alternative: have the SDK provide a `PreToolUse` hook that auto-approves the same commands. Hooks are *general* (they can run arbitrary code), so they could even do the rule-write themselves.

The team chose the **settings-file approach** because:

1. **Settings are declarative** — easier to inspect, easier to revoke. A user can `cat .claude/settings.local.json` and see what was approved.
2. **Settings are version-trackable** — diff between sessions is visible.
3. **Hooks have lifecycle overhead** — every tool call invokes the hook, even for already-approved commands. Settings rules are matched in-memory, no spawn cost.
4. **Settings work in non-hook contexts** — managed settings, policy tiers, etc.

The settings-file approach is the *primitive*; hooks are higher-level. The SDK suggestion uses the primitive directly.

---

## 8. The Other Bash Suggestion Path — Heredoc and Compounds

The `rDH` function (chunks `_top_*`, line 420235-420247) is the suggestion-builder for Bash commands. It picks the right shape based on the command's complexity:

```javascript
function rDH(H) {
  let $ = MA5(H);                          // heredoc-prefix detection
  if ($) return uY$(L4.name, $);           // prefix rule for heredoc command
  if (H.includes(`\n`)) {
    let K = e_(H).trim();
    if (K) return uY$(L4.name, K);          // multiline → prefix on first line
  }
  let q = Fw8(H);                          // generic command prefix (head + first arg)
  if (q) return uY$(L4.name, q);           // prefix rule for "npm test"
  return pe$(L4.name, H);                  // exact rule (fallback)
}
```

For `npm test --verbose`, this picks `Bash(npm test *)` (the prefix shape). For `echo "hello world"`, the full string is the suggestion (exact). The choice is driven by:

1. Is this a heredoc (`<<EOF`)? → prefix on the line before `<<`
2. Multiline? → prefix on first line
3. Has a recognizable command prefix? → `uY$` (prefix rule)
4. Else → `pe$` (exact)

All four paths point to `localSettings` post-v2.1.128.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_infra_platform.md`](../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions in this document:
- `suggestExactRule` (`pe$`) — Builds exact allow-rule update targeting `localSettings`
- `suggestPrefixRule` (`uY$`) — Builds prefix-wildcard allow-rule update targeting `localSettings`
- `buildBashSuggestion` (`rDH`) — Chooses between exact/prefix/multiline based on command shape
- `parseHeredocPrefix` (`MA5`) — Heredoc-command-prefix detector
- `findGenericPrefix` (`Fw8`) — Generic command prefix extraction (head + first arg)
- `firstLine` (`e_`) — Returns the trimmed first line of a multi-line string
- `applyPermissionUpdate` (`Dk`) — Settings-file applier; writes to the destination key
- `localSettingsPath` — `.claude/settings.local.json` (resolved from `Vh("localSettings")`)
- Destination string `"localSettings"` — Used in `addRules`/`addDirectories` update objects
