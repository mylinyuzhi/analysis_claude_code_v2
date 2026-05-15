# Classifier Hardening — v2.1.110

**Theme:** Two distinct safety-classifier fixes in v2.1.110. (1) The Agent tool no longer prompts the user when the safety classifier's transcript exceeds the model context window. (2) `PermissionRequest` hooks returning `updatedInput` are now re-checked against `permissions.deny` rules so a hook can't mutate input to bypass deny.

Both fixes close the same conceptual bug: **the classifier's authority over an action shouldn't degrade silently.** When the classifier fails or is dodged, the system needs a sane fallback — not a permission prompt for the user and not a quiet bypass.

---

## 1. Agent Tool Fallback on Classifier-Transcript-Too-Long

### The bug

In auto mode, every tool call dispatches the safety classifier — an LLM side-query that reads the *entire* conversation transcript plus the proposed action. The classifier's prompt is:

```
[system: classifier instructions]
[transcript: all messages so far]
[action: tool name + input being evaluated]
```

The transcript portion can be huge — in long Agent-tool runs (which themselves drive multi-turn loops), the transcript can exceed Opus 4.7's context window (200k tokens, 1m for opus-4-7[1m]).

In v2.1.88 → v2.1.108, this caused an API 400 from the classifier (prompt too long). The classifier returned `{ shouldBlock: true, transcriptTooLong: true }`. The decision pipeline interpreted this as "classifier denied" → fell back to interactive permission prompt. The user got an interrupt mid-Agent-run asking them to manually approve.

For Agent tool specifically, this was disastrous: an Agent tool call is itself spawned by Claude, the user wasn't watching, and the prompt would just hang the agent loop.

### The fix (v2.1.110)

When the classifier returns `transcriptTooLong: true`, branch on tool name:

```javascript
// ============================================
// applyClassifierResult - Agent tool gets allow-on-overflow
// Location: chunks.164.mjs:2400-2420 (within main classifier-result handler)
// ============================================

// ORIGINAL (for source lookup):
if (H.shouldBlock) {
    if (H.transcriptTooLong) {
        if (q.name === T4) return {
            behavior: "allow",
            updatedInput: K,
            decisionReason: {
                type: "mode",
                mode: "auto"
            }
        };
        if (O.toolPermissionContext.shouldAvoidPermissionPrompts)
            throw new sz("Agent aborted: auto mode classifier transcript exceeded context window in headless mode");
        return E("Auto mode classifier transcript too long, falling back to normal permission handling", { level: "warn" }), {
            ...A,
            decisionReason: {
                type: "other",
                reason: "Auto mode classifier transcript exceeded context window — falling back to manual approval"
            }
        }
    }
    // ... other shouldBlock cases (unavailable, allowed, deny)
}

// READABLE (for understanding):
if (classifierResult.shouldBlock) {
    if (classifierResult.transcriptTooLong) {
        // Agent tool: allow. Classifier can't read enough context to decide
        // safely; deferring to the user via prompt would hang an unattended
        // Agent run. The Agent itself runs in a fresh subagent context with
        // its own auto-mode classifier on its own (much shorter) transcript,
        // so the *spawned* Agent's actions are still checked.
        if (tool.name === AGENT_TOOL_NAME) {
            return {
                behavior: "allow",
                updatedInput: input,
                decisionReason: { type: "mode", mode: "auto" }
            };
        }

        // Headless mode: classifier-too-long is fatal (no human to ask).
        if (ctx.toolPermissionContext.shouldAvoidPermissionPrompts) {
            throw new AbortError(
                "Agent aborted: auto mode classifier transcript exceeded context window in headless mode"
            );
        }

        // Interactive non-Agent: fall back to normal permission handling
        // (the original behavior, but with a clearer decisionReason).
        return {
            ...originalAskResult,
            decisionReason: {
                type: "other",
                reason: "Auto mode classifier transcript exceeded context window — falling back to manual approval"
            }
        };
    }
    // ... other shouldBlock cases (unavailable=true, classifier blocks, etc.)
}

// Mapping: T4→AGENT_TOOL_NAME (literal "Agent"), sz→AbortError, E→logForDebugging,
//          H→classifierResult, q→tool, K→input, A→originalAskResult, O→toolUseContext
```

### Why this approach

**Why allow for Agent only?** The Agent tool spawns a new subagent that runs its own auto-mode loop with its own (initially-empty) classifier transcript. The *inner* Agent's tool calls are checked normally. Allowing the *outer* dispatch lets the agent loop continue; the inner classifier still enforces safety.

**Why not skip the classifier entirely for Agent?** Most Agent dispatches *do* fit in the classifier context — only the deep-nested or long-transcript cases overflow. Running the classifier when possible catches injection attempts on Agent's `prompt` parameter (the most dangerous-shaped input).

**Why throw on `shouldAvoidPermissionPrompts`?** Headless mode (e.g., SDK, `-p`) can't ask the user. A fall-back-to-prompt path would block forever. Throwing produces an explicit error that propagates as `Agent aborted: ...` so callers know what happened.

**Why `decisionReason: { type: "mode", mode: "auto" }` and not a new "classifier_overflow" type?** Downstream telemetry and UI assumed the existing types (`"mode" | "rule" | "classifier" | "safetyCheck" | "other"`). Adding a new type required schema changes. Re-using `"mode"` with `"auto"` is the minimal change — the action *is* being allowed because auto mode applied, even if not via classifier judgment.

**Trade-off:** The allow-on-overflow path could theoretically let a malicious Agent dispatch through that the classifier *would* have blocked if it could read the context. The team accepted this — Agent dispatches are themselves checked by the inner classifier, so the worst-case is "agent loop runs one extra subagent that gets stopped at its first dangerous action."

### Key insight

The classifier is **best-effort safety, not load-bearing safety**. The deny rules in `permissions.deny` are load-bearing. The classifier is a soft layer that catches things the rules miss. When the soft layer fails (overflow, API error, unavailable), the system **degrades gracefully** rather than blocking the user. For headless mode where the user can't intervene, the system **fails closed** (throws).

The v2.1.88 baseline had this same logic but with no Agent special case — every classifier overflow became a prompt. The v2.1.110 fix recognizes that **prompts inside Agent runs are user-hostile** and bypasses them for Agent specifically.

---

## 2. Hook `updatedInput` Re-Check Against Deny Rules

### The bug

`PermissionRequest` hooks can return:
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow",
      "updatedInput": { "command": "git push" }
    }
  }
}
```

This **mutates the tool input** before it executes. A user-written hook can rewrite a command, change a file path, or modify any parameter.

In v2.1.88, the flow was:
1. Built-in rules check the *original* input → might allow.
2. Hook fires, returns `updatedInput`.
3. Tool executes with `updatedInput`.

The bug: if `permissions.deny: ["Bash(rm:*)"]` was set, and a user hook rewrote `ls` to `rm -rf /`, the deny rule never re-checked because the original input passed.

This was a **privilege escalation** path — any hook (even one approved for a safe purpose) could mutate to a denied action.

### The fix (v2.1.110)

The hook flow was rewired so that `updatedInput` triggers a re-check against deny rules. Conceptually:

```javascript
async function applyHookPermissionResult(tool, originalInput, hookResult, context) {
    if (hookResult.behavior !== "allow") return hookResult;

    const finalInput = hookResult.updatedInput ?? originalInput;

    // RE-CHECK: deny rules MUST run against the final input, not the original.
    if (hookResult.updatedInput !== undefined) {
        const denyResult = await checkDenyRules(tool, finalInput, context);
        if (denyResult.behavior === "deny") {
            return {
                behavior: "deny",
                message: denyResult.message,
                decisionReason: {
                    type: "rule",
                    rule: denyResult.matchedRule,
                    note: "Hook updatedInput matched deny rule"
                }
            };
        }
    }

    return { ...hookResult, updatedInput: finalInput };
}
```

The hook can still mutate input — but it can't mutate *into* a denied state. The deny rules are the load-bearing check; the hook is an advisory mutation.

This is hinted at in `chunks.149.mjs:2999-3002`:
```javascript
if (X.updatedInput && X.permissionBehavior === void 0) yield {
    type: "hookUpdatedInput",
    updatedInput: X.updatedInput
};
```

The `hookUpdatedInput` yield is consumed by the dispatch loop (`chunks.153.mjs:1220-1222`), which sets `W = l.updatedInput`. The subsequent built-in permission check at `chunks.153.mjs:1314` (`if (m.behavior !== "allow")`) runs **against `W`**, the updated input — so a deny rule that matches `W` blocks the call.

### Why this approach

**Why re-check on `updatedInput` and not always?** Re-checking the original input is redundant — the built-in rules already saw it. Re-checking only when the hook mutated keeps the fast path fast (no extra rule evaluation when hooks don't mutate).

**Why deny-only, not allow-only?** A hook that *narrows* the input (e.g., adds `--dry-run`) should benefit from being more conservative; we don't want to re-prompt on a safer mutation. Deny rules are absolute — they should fire regardless of where the input came from.

**Why does this matter for `setMode: 'bypassPermissions'`?** Separate v2.1.110 fix: hooks that set `setMode: 'bypassPermissions'` now respect `disableBypassPermissionsMode` (a managed-settings flag). Same pattern — hooks can request a mode change, but managed-settings restrictions are load-bearing.

### Key insight

Hooks are **untrusted helpers**. The user installed them, but the user installed them for *some* purpose. A malicious hook (or a buggy hook with an LLM-generated body) shouldn't be able to escalate beyond what the user explicitly allowed via `permissions.deny`.

The same insight drives the prototype-property fix (see `bash_bypass_fixes.md` §6): trust no input from the user-provided rule set. Run all dynamic input through the same checks.

---

## 3. The Combined Decision Pipeline (v2.1.112)

A trace of a single tool call through the post-v2.1.110 permission pipeline:

```
1. tool.checkPermissions(input)
   → built-in allow/deny/ask via rules, paths, safety checks
   → returns { behavior, decisionReason, updatedInput?, suggestions? }

2. If 'allow' AND not under classifier-required mode → DONE

3. PreToolUse hooks fire (chunks.149.mjs:Wa8 → chunks.153.mjs:dispatch)
   → each hook yields permissionBehavior, hookUpdatedInput, etc.
   → final hook input is W (after all hookUpdatedInput merges)

4. If hook said 'allow':
   → IF hook provided updatedInput: re-run checkPermissions on W
   → IF deny rule matches W: return deny (v2.1.110 fix)
   → ELSE: allow

5. If mode === 'auto' AND behavior === 'ask':
   → fast paths (allowlisted tool, would-be-allowed-in-acceptEdits)
   → IF tool === Agent: skip classifier acceptEdits fast path (v2.1.110)
   → run yoloClassifier on (messages, action, tools, context)
   → IF transcriptTooLong AND tool === Agent: ALLOW (v2.1.110 fix)
   → IF transcriptTooLong AND headless: THROW
   → IF transcriptTooLong AND interactive: fall back to ask
   → IF shouldBlock: deny + recordAutoModeDenial
   → ELSE: allow

6. If still 'ask': PermissionRequest hooks fire, then UI prompt
```

The v2.1.110 changes are at steps 4 (hook re-check) and 5 (Agent overflow fallback). Both close cases where the classifier or hook layer was the *only* gate and could be bypassed via input mutation or context overflow.

---

## File-level "where to look"

| Concern | 2.1.112 chunk | v2.1.88 baseline |
|---------|---------------|------------------|
| Classifier-overflow → Agent allow | `chunks.164.mjs:2400-2420` | `src/tools/AgentTool/agentToolUtils.ts` (classifier result handler) |
| Classifier-overflow detection | `chunks.138.mjs:610-625, 805-825` | `src/utils/permissions/yoloClassifier.ts:973-1000, 1295-1305` |
| `transcriptTooLong` from prompt-too-long | `chunks.138.mjs:610` (detectPromptTooLong) | `src/utils/permissions/yoloClassifier.ts` (search `detectPromptTooLong`) |
| Hook permission flow | `chunks.149.mjs:2961-3001` | `src/utils/hooks/preToolHooks.ts` |
| Hook updatedInput merge | `chunks.153.mjs:1220-1222` | dispatch loop in hooks/lifecycle |
| Re-check on hook updatedInput | `chunks.153.mjs:1314+` (deny check on W) | `src/utils/permissions/permissions.ts:hasPermissionsToUseTool` |
| Agent tool name constant `T4` | `chunks.19.mjs:93` (`T4 = "Agent"`) | `src/tools/AgentTool/constants.ts` |

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_unit_12.md`](../00_overview/symbol_additions_unit_12.md) — Unit 12 additions
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols
> - [`symbol_index_core_execution.md`](../00_overview/symbol_index_core_execution.md) — Tool dispatch symbols

Key functions in this document:
- `applyClassifierResult` (`chunks.164.mjs:2200-2470` inline) — Branches on `shouldBlock` / `transcriptTooLong` / `unavailable`
- `classifyYoloAction` (`PK8`) — The classifier side-query entry point
- `detectPromptTooLong` — Parses prompt-too-long errors into `{actualTokens, limitTokens}`
- `T4` — String literal `"Agent"` (Agent tool name)
- `recordAutoModeDenial` — Records a denial for the `/permissions` Recent tab
- `hookUpdatedInput` yield type — Hook-protocol message for input mutation
- `shouldAvoidPermissionPrompts` — Context flag set in headless / SDK modes
- `restoreDangerousPermissions` (`pe`) — Restores deny rules stripped for auto mode entry
