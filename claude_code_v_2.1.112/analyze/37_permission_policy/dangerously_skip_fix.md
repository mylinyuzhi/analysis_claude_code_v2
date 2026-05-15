# `--dangerously-skip-permissions` Downgrade Fix — v2.1.97-98

**Theme:** Approving a write to a protected path via Bash was silently downgrading the user from `bypassPermissions` to `acceptEdits` mode. The user thought they were in YOLO mode but were actually in a stricter mode, causing subsequent commands to prompt unexpectedly.

This is a pure mode-integrity bug: the per-tool permission decision should *never* mutate the global mode. The fix is to track the "approved-once-for-this-path" state **per-path**, not as a mode transition.

---

## 1. The Bug — Why a Path Approval Becomes a Mode Change

### The interaction

In v2.1.88, when the user ran:
```bash
claude --dangerously-skip-permissions
```

…the session entered `bypassPermissions` mode — all permission checks waived (except for deny rules and core safety checks like protected-path writes).

Protected paths (`~/.ssh/config`, `~/.gitconfig`, `.git/hooks/*`, etc.) are gated by `checkPathSafetyForAutoEdit` in `src/utils/permissions/filesystem.ts:620`. Even in `bypassPermissions`, writing to a protected path triggers an *ask* (the safety check returns `{ behavior: "ask", message: ..., decisionReason: { type: "safetyCheck", classifierApprovable } }`).

When the user approved the ask, the permission system needed to:
1. Allow this specific write (`~/.ssh/config`).
2. Remember the approval so the next write to `~/.ssh/config` doesn't re-prompt.

The v2.1.88 implementation chose option 2 by **changing the mode** to `acceptEdits` — which auto-approves all writes in the working directory. This had the desired side-effect (no more prompts) but also two undesired effects:

- The user lost `bypassPermissions` for *all other* tool types (Bash commands now had to re-check rules).
- A casual approval of one path silently broadened to "auto-approve all edits."

### The user-visible symptom

```
$ claude --dangerously-skip-permissions
> please write my preferred ssh key to ~/.ssh/config
[prompt: write to protected path ~/.ssh/config? approve/deny]
> approve
[file written]
> now also commit and push
[prompt: bash commit, push? approve/deny]  ← UNEXPECTED!
```

The user explicitly opted into bypass mode. The second prompt feels like a regression.

---

## 2. The Fix (v2.1.97-98)

The "approve once for protected path" path no longer mutates the global permission mode. Instead, the approval is tracked **per-path** in session-scoped state.

### Conceptual change

```
v2.1.88:
    approve(path) {
        appState.mode = "acceptEdits"  // global mutation
    }

v2.1.97:
    approve(path) {
        appState.approvedProtectedPaths.add(path)  // per-path state
    }
    checkPathSafetyForAutoEdit(path, ...) {
        if (appState.approvedProtectedPaths.has(path)) {
            return { safe: true, decisionReason: { type: "approved-once" } }
        }
        // ... usual safety check
    }
```

The session-scoped path set is bounded (it doesn't persist across sessions), so the user re-approves each protected path on a fresh `claude` invocation.

### Why per-path approval, not per-directory or per-tool

**Why not per-directory?** A user who approves `~/.ssh/config` did NOT consent to `~/.ssh/authorized_keys` or `~/.ssh/known_hosts`. Per-path is the narrowest correct grant.

**Why not per-tool?** The Bash tool can write to *any* path. Granting "Bash can write to protected paths in general" defeats the safety check.

**Why session-scoped, not persisted?** Persisting the approvals would let an attacker who got one-time consent re-use it indefinitely. Session-scoping ensures the user re-confirms on each `claude` start.

---

## 3. The v2.1.97 Version + v2.1.98 Extension

### v2.1.97 (`Type: security · Modules: Permissions`)

Per the v2.1.97 changelog: *"Fixed `--dangerously-skip-permissions` being silently downgraded to accept-edits mode after approving a write to a protected path via Bash."*

The fix landed in the `Bash → checkPathSafetyForAutoEdit → approve` codepath specifically.

### v2.1.98 (extension)

Per v2.1.98 §19: *"Same as v2.1.97 §7; v2.1.98 expands."*

The extension closes the same bug for:
- **Edit/Write tools** approving protected paths (parallel codepath to Bash).
- **Agent team members** that inherit a leader's `bypassPermissions` mode (v2.1.98 §26 — independent fix, same theme).

By v2.1.98, the rule is uniform: **no permission decision mutates the mode**. Modes are only mutated by:
- User shift-tab in the carousel
- `setMode` in a hook output
- Plan mode entry/exit

A safety-check approval is *not* in that list.

---

## 4. The Mode-Integrity Pattern

The fix exemplifies a deeper pattern: **per-decision state should be local, not global**. Specifically:

| State | Scope | Mutator |
|-------|-------|---------|
| Mode (`default` / `auto` / `acceptEdits` / `bypassPermissions` / `plan`) | Global, app-level | User action only |
| Per-path approvals | Session-scoped | Permission dialog approval |
| Per-tool allow rules | Settings (durable) | Slash command, settings.json edit |
| Denial tracking | Session-scoped | Each denial |
| `strippedDangerousRules` | Session-scoped (during auto mode) | Auto mode entry/exit |

The bug existed because the "approve once" affordance was misclassified as a *mode change* (global, app-level) rather than a *per-path approval* (session-scoped, local). The fix is a re-classification — the underlying mechanic remained, just stored in the right place.

### `strippedDangerousRules` is the same pattern, done right

When the user enters auto mode, the system temporarily lifts certain deny rules (e.g., the model can write to slightly-broader-than-default paths) — but tracks the lifted rules in `strippedDangerousRules` on the context (chunks.164.mjs:2700, `restoreDangerousPermissions`):

```javascript
// ============================================
// restoreDangerousPermissions - re-installs deny rules on auto exit
// Location: chunks.164.mjs:2704-2721
// ============================================

// ORIGINAL (for source lookup):
function pe(q) {
    let K = q.strippedDangerousRules;
    if (!K) return q;
    let _ = q;
    for (let [z, Y] of Object.entries(K)) {
        if (!Y || Y.length === 0) continue;
        _ = EY(_, {
            type: "addRules",
            rules: Y.map(h2),
            behavior: "allow",
            destination: z
        })
    }
    return { ..._, strippedDangerousRules: void 0 }
}

// READABLE (for understanding):
function restoreDangerousPermissions(context) {
    const stripped = context.strippedDangerousRules;
    if (!stripped) return context;

    let restored = context;
    for (const [destination, rules] of Object.entries(stripped)) {
        if (!rules || rules.length === 0) continue;
        // Re-add each rule back to its origin scope (session/local/user)
        restored = applyPermissionUpdate(restored, {
            type: "addRules",
            rules: rules.map(parsePermissionRule),
            behavior: "allow",
            destination
        });
    }

    return { ...restored, strippedDangerousRules: undefined };
}

// Mapping: pe→restoreDangerousPermissions, EY→applyPermissionUpdate, h2→parsePermissionRule
```

When the user exits auto mode (via mode cycle or kick-out), `restoreDangerousPermissions` runs, re-installing every rule that was lifted. The state is **precisely reversible** — there's no "loss" from entering auto mode and then leaving.

This is the design the dangerously-skip fix mirrors: **track per-decision state separately, restore on exit**.

---

## 5. Why This Bug Was Subtle

### It only fired on a specific tool

The bug needed:
1. `--dangerously-skip-permissions` (uncommon default)
2. A Bash command writing to a protected path (uncommon shape — most users don't write to `~/.ssh` from Claude)
3. The user explicitly approving (the prompt fires; the user has to click)

Most users never hit all three. The bug existed for months.

### The downgrade was silent

The mode change happened in app-state mutation, no banner, no notification. The user discovered it only by noticing later prompts where none were expected. Without a sentinel ("mode changed because of X"), users blamed the model for being inconsistent.

### The "fix" widened the affordance

The team could have *removed* the approve-once behavior entirely (re-prompt every time). They kept the affordance — it's a real UX win — but moved the state to the right place.

This is a common pattern in security work: when a bug is in *how* a feature stores state rather than *whether* the feature should exist, fix the storage, don't kill the feature.

---

## File-level "where to look"

| Concern | 2.1.112 chunk | v2.1.88 baseline |
|---------|---------------|------------------|
| `checkPathSafetyForAutoEdit` (the safety check) | within `chunks.164.mjs` filesystem path-validation block | `src/utils/permissions/filesystem.ts:620` |
| Bash path validation | `chunks.83.mjs`, `chunks.149.mjs` (BashTool perm flow) | `src/tools/BashTool/bashPermissions.ts` |
| Edit/Write path validation | `chunks.193.mjs` related | `src/utils/permissions/pathValidation.ts` |
| Mode setter (`applyPermissionUpdate`) | `chunks.165.mjs:EY` | `src/utils/permissions/PermissionUpdate.ts` |
| Restore-on-auto-exit | `chunks.164.mjs:2704-2721` (`pe`) | `src/utils/permissions/permissionSetup.ts:restoreDangerousPermissions` |
| `DANGEROUS_FILES` / `DANGEROUS_DIRECTORIES` | within `chunks.164.mjs` | `src/utils/permissions/filesystem.ts:57-79` |

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_unit_12.md`](../00_overview/symbol_additions_unit_12.md) — Unit 12 additions
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions in this document:
- `checkPathSafetyForAutoEdit` — Decides whether a path write is safe-to-auto-allow
- `restoreDangerousPermissions` (`pe`) — Re-installs `strippedDangerousRules` on auto exit
- `applyPermissionUpdate` (`EY`) — Applies a `PermissionUpdate` (addRules / setMode / addDirectories) to a context
- `parsePermissionRule` (`h2`) — Parses a rule string into `PermissionRule`
- `DANGEROUS_FILES` — `.gitconfig`, `.bashrc`, `.zshrc`, `.mcp.json`, `.claude.json`, etc.
- `DANGEROUS_DIRECTORIES` — `.git`, `.vscode`, `.idea`, `.claude`
- `ToolPermissionContext.mode` — Global mode (`default | auto | acceptEdits | bypassPermissions | plan | dontAsk`)
- `ToolPermissionContext.strippedDangerousRules` — Map of `destination → rule list` lifted on auto entry
