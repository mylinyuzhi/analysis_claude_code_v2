# `defer` Permission Decision Token (v2.1.89)

## Overview

v2.1.89 added a fourth value to the `PreToolUse` hook's `permissionDecision` enum: **`defer`**. The complete token set is now:

- `allow` — proceed with the tool call (skip downstream permission rules)
- `deny` — block with a `blockingError`
- `ask` — force a user prompt regardless of permission mode
- `defer` (**NEW**) — neither allow nor deny outright; pass the decision to the downstream permission system

In v2.1.88, the schema was `z.enum(['allow', 'deny', 'ask'])` (see `src/utils/permissions/PermissionRule.ts:25-27` for the underlying `permissionBehaviorSchema` reused for the hook's `permissionDecision` field via `types/hooks.ts:72-78`). In v2.1.112, the enum reads `["allow", "deny", "ask", "defer"]`.

## v2.1.88 Baseline

```typescript
// ============================================
// permissionBehaviorSchema - Hook permissionDecision enum (v2.1.88)
// Location: src/utils/permissions/PermissionRule.ts:25-27
// ============================================

// ORIGINAL (for source lookup):
export const permissionBehaviorSchema = lazySchema(() =>
  z.enum(['allow', 'deny', 'ask']),
)

// READABLE (identical hand-written TypeScript):
export const permissionBehaviorSchema = lazySchema(() =>
  z.enum(['allow', 'deny', 'ask']),
);

// Mapping: no obfuscation — v2.1.88 is the readable form.
```

The PreToolUse hookSpecificOutput at `types/hooks.ts:72-78` referenced this schema:

```typescript
// ============================================
// PreToolUseHookOutput - v2.1.88 schema (no defer)
// Location: src/types/hooks.ts:72-78
// ============================================

// ORIGINAL (for source lookup):
z.object({
  hookEventName: z.literal('PreToolUse'),
  permissionDecision: permissionBehaviorSchema().optional(),    // allow|deny|ask only
  permissionDecisionReason: z.string().optional(),
  updatedInput: z.record(z.string(), z.unknown()).optional(),
  additionalContext: z.string().optional(),
}),

// READABLE (identical):
// (unchanged)
```

## v2.1.112 Schema

```javascript
// ============================================
// PERMISSION_BEHAVIOR_SCHEMA - Now includes "defer"
// Location: chunks.192.mjs:1571
// ============================================

// ORIGINAL (for source lookup):
ZeY = C6(() => y.enum(["allow", "deny", "ask", "defer"]))

// READABLE (for understanding):
const permissionBehaviorSchema = lazySchema(() =>
  z.enum(["allow", "deny", "ask", "defer"])
);

// Mapping: ZeY→permissionBehaviorSchema, C6→lazySchema, y→z (zod alias)
```

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md). New mappings: [symbol_additions_unit_09.md](../00_overview/symbol_additions_unit_09.md).

Key functions and tokens:

- `PERMISSION_BEHAVIOR_SCHEMA` (`ZeY`) — chunks.192.mjs:1571 (the underlying enum)
- `PERMISSION_BEHAVIOR_SCHEMA_TOP_LEVEL` (`OPz`) — chunks.99.mjs:1183 (a second copy used by SDK external schemas)
- `applyHookPermissionDecision` (`KJ7`) — chunks.193.mjs:3 (parser; handles `case "defer"` in two branches)
- `aggregateHookResults` (the streamed reducer) — chunks.193.mjs:1283-1298 (the deny > defer > ask > allow cascade)
- `canUseToolFromHookResult` — chunks.149.mjs:2962 (the consumer that maps `permissionBehavior:"defer"` to a `type:"defer"` permission result)

## Parser — Two Decision Branches in `KJ7`

The hook output parser handles `permissionDecision` in TWO places: the top-level `permissionDecision` field (legacy) and the per-event-namespaced `hookSpecificOutput.permissionDecision`. Both gained the `defer` case in v2.1.112:

```javascript
// ============================================
// applyHookPermissionDecision.preToolUsePermission - Top-level + namespaced branches
// Location: chunks.193.mjs:34-74
// ============================================

// ORIGINAL (for source lookup):
if (q.hookSpecificOutput?.hookEventName === "PreToolUse" && q.hookSpecificOutput.permissionDecision)
  switch (q.hookSpecificOutput.permissionDecision) {
    case "allow":  H.permissionBehavior = "allow"; break;
    case "deny":   H.permissionBehavior = "deny", H.blockingError = {blockingError: q.reason || "Blocked by hook", command: K}; break;
    case "ask":    H.permissionBehavior = "ask"; break;
    case "defer":  H.permissionBehavior = "defer"; break;     // ← NEW
    default:       throw Error(`Unknown hook permissionDecision type: ${q.hookSpecificOutput.permissionDecision}. Valid types are: allow, deny, ask, defer`)
  }
// ... later, in the per-event switch:
case "PreToolUse":
    if (q.hookSpecificOutput.permissionDecision) switch (q.hookSpecificOutput.permissionDecision) {
        case "allow":  H.permissionBehavior = "allow"; break;
        case "deny":   H.permissionBehavior = "deny", H.blockingError = {...}; break;
        case "ask":    H.permissionBehavior = "ask"; break;
        case "defer":  H.permissionBehavior = "defer"; break;    // ← NEW
    }
    ...

// READABLE (for understanding):
// First branch: top-level normalization (handles both old-style decision: "approve"/"block"
// and new-style hookSpecificOutput.permissionDecision for PreToolUse)
if (
  hookOutput.hookSpecificOutput?.hookEventName === "PreToolUse" &&
  hookOutput.hookSpecificOutput.permissionDecision
) {
  switch (hookOutput.hookSpecificOutput.permissionDecision) {
    case "allow":  result.permissionBehavior = "allow"; break;
    case "deny":
      result.permissionBehavior = "deny";
      result.blockingError = { blockingError: hookOutput.reason || "Blocked by hook", command };
      break;
    case "ask":    result.permissionBehavior = "ask"; break;
    case "defer":  result.permissionBehavior = "defer"; break;    // NEW v2.1.89
    default:
      throw Error(
        `Unknown hook permissionDecision type: ${hookOutput.hookSpecificOutput.permissionDecision}. ` +
        `Valid types are: allow, deny, ask, defer`,
      );
  }
}
// (the per-event PreToolUse switch repeats the cases with similar structure)

// Mapping: H→result, q→hookOutput, K→command, hookSpecificOutput.permissionDecision→permissionDecision token
```

## Cascade — The Multi-Hook Priority Order

When multiple hooks register for `PreToolUse`, the aggregator combines their `permissionBehavior` values into a single decision. The cascade is **deny > defer > ask > allow**:

```javascript
// ============================================
// aggregateHookResults.permissionCascade - deny > defer > ask > allow priority
// Location: chunks.193.mjs:1283-1298
// ============================================

// ORIGINAL (for source lookup):
if (S.permissionBehavior) switch (E(`Hook ${J} (${DL(S.hook)}) returned permissionDecision: ${S.permissionBehavior}${S.hookPermissionDecisionReason?` (reason: ${S.hookPermissionDecisionReason})`:""}`), S.permissionBehavior) {
    case "deny":
        B = "deny";
        break;
    case "defer":
        if (B !== "deny") B = "defer";
        break;
    case "ask":
        if (B !== "deny" && B !== "defer") B = "ask";
        break;
    case "allow":
        if (!B) B = "allow";
        break;
    case "passthrough":
        break
}

// READABLE (for understanding):
if (hookResult.permissionBehavior) {
  logForDebugging(
    `Hook ${hookEvent} (${getHookDisplayText(hookResult.hook)}) returned permissionDecision: ` +
    `${hookResult.permissionBehavior}` +
    (hookResult.hookPermissionDecisionReason ? ` (reason: ${hookResult.hookPermissionDecisionReason})` : ""),
  );
  switch (hookResult.permissionBehavior) {
    case "deny":
      aggregated = "deny";                            // deny is sticky — wins everything
      break;
    case "defer":
      if (aggregated !== "deny") aggregated = "defer";  // defer beats ask + allow
      break;
    case "ask":
      if (aggregated !== "deny" && aggregated !== "defer") aggregated = "ask";  // ask beats allow
      break;
    case "allow":
      if (!aggregated) aggregated = "allow";          // allow only if nothing else set
      break;
    case "passthrough":
      break;                                          // no opinion — yield to next hook
  }
}

// Mapping: S→hookResult, B→aggregated, E→logForDebugging, DL→getHookDisplayText, J→hookEvent
```

The cascade encodes the principle: **stricter decisions win**. A single `deny` hook overrides any number of `allow` hooks. `defer` sits between `deny` and `ask` because it's a "let downstream rules speak" — strictly weaker than `deny` (which is an absolute veto) but strictly stronger than `ask` (which still has a default-allow path if the user OKs it).

## Consumer Side — Mapping `permissionBehavior:"defer"` to a Defer Result

The dispatch site that runs after hook aggregation maps `"defer"` to a `{type: "defer"}` permission result, which the runner then interprets as "skip-hook layer, continue evaluating other permission rules":

```javascript
// ============================================
// canUseToolFromHookResult.defer - Map permissionBehavior to defer
// Location: chunks.149.mjs:2962-3076 (excerpted)
// ============================================

// ORIGINAL (for source lookup):
if (E(`Hook result has permissionBehavior=${X.permissionBehavior}`), X.permissionBehavior === "defer") {
    ...
    return {
        type: "defer",
        ...
    }
}

// READABLE (for understanding):
if (logForDebugging(`Hook result has permissionBehavior=${hookAggregated.permissionBehavior}`),
    hookAggregated.permissionBehavior === "defer") {
  // Build a defer permission result — downstream code skips the hook layer
  // and re-evaluates against rule-based permissions
  return {
    type: "defer",
    ...                                             // populate reason, suggestions, etc.
  };
}

// Mapping: X→hookAggregated
```

## Deep Analysis

### Algorithm: The deny > defer > ask > allow Cascade

**What it does:** Combines an arbitrary number of `PreToolUse` hook decisions into a single permission verdict that respects the principle of "the strictest wins".

**How it works:**

1. **Initial state.** `aggregated` (named `B` in source) starts undefined.
2. **For each hook's yielded `permissionBehavior`:**
   - `deny` → `aggregated = "deny"` unconditionally. Once set to deny, no later hook can soften it.
   - `defer` → set to `"defer"` only if not already `"deny"`. Defer is overridden by deny but overrides ask/allow.
   - `ask` → set to `"ask"` only if neither `"deny"` nor `"defer"` is set. Ask overrides allow.
   - `allow` → set to `"allow"` only if `aggregated` is still falsy (no hook has weighed in yet).
   - `passthrough` → no-op. Hooks that have nothing to say may yield `passthrough` (or simply not return a `permissionBehavior`).
3. **Yield aggregated state.** When `aggregated` matches the just-processed `permissionBehavior` value, the aggregator also yields the `permissionBehavior` along with `updatedInput` (if any) and the hook source identifier (so the UI can show "denied by plugin X").

**Why this approach:**

- **Why fail-safe (strictest wins)?** Permission decisions are security-relevant. The OR-of-allows pattern would let a single buggy hook accidentally allow dangerous operations, but an AND-of-allows is also wrong because it would let one overly-cautious hook block everything. The middle ground — **deny is sticky, allow needs no challenger** — gives strict hooks veto power without requiring unanimous approval.
- **Why insert `defer` between `deny` and `ask`?** The cascade order encodes a semantic: "stricter is better". A hook that defers is saying "I'm not sure, let downstream policy decide". That's a stronger statement than "ask the user" (which still has a default-allow path) but weaker than "deny outright". The placement reflects this commitment ordering.
- **Why have a separate `passthrough` value?** A hook that returns `passthrough` is explicitly opting out of the decision (vs. silently not yielding). This distinguishes "I ran but have no opinion" from "I didn't fire". Useful for hooks that conditionally apply based on context.

**Key insight:** The cascade is intentionally **not** a vote count. A single deny wins over a thousand allows. This makes the security posture conservative: if even one user-installed hook says no, the tool call is blocked. Hook authors can rely on this: a security-checking hook only needs to detect *its own* trigger condition, without coordinating with other hooks.

### Decision: Why `defer` Specifically?

**Alternative considered (1):** Add a `none` or `unknown` token meaning "no opinion, continue".

**Why rejected (inferable):** `passthrough` already exists for this purpose. A separate `defer` token communicates a *positive* intent: "I evaluated and chose to delegate", as opposed to "I had nothing to say". The distinction matters for telemetry (debug logs differentiate `defer` from `passthrough`) and for the cascade ordering (defer is stronger than allow, passthrough is no-op).

**Alternative considered (2):** Just use `ask` for the delegate-decision case.

**Why rejected:** `ask` forces a user prompt. The use case for `defer` is "the hook can't decide; let the rest of the permission system (deny rules, allow rules, plan-mode policy) speak without escalating to the user". `ask` would be too intrusive for cases where the policy already has an answer.

**Key insight:** `defer` is `passthrough`'s assertive sibling. Both result in "let the next layer speak", but `defer` participates in the cascade (overrides `ask` and `allow`) while `passthrough` doesn't. This means a `defer` hook can *prevent* a more permissive sibling hook from approving — defer is a sticky-soft-block.

## Edge Cases & Gotchas

1. **`defer` is PreToolUse-only.** The PERMISSION_BEHAVIOR_SCHEMA is reused for other places (e.g., `permissionMode` settings), but only `PreToolUse.hookSpecificOutput.permissionDecision` accepts it as a hook output. Other places (e.g., `PermissionRequest` hook's `behavior` field) use the narrower `["allow", "deny"]` enum.
2. **Mixed hooks: defer + allow → defer wins.** If one hook says `defer` and another says `allow`, the aggregated result is `defer`. The downstream permission system then re-evaluates against deny/allow rules. If those rules say allow, the tool proceeds; if they say deny, it doesn't. Either way, the hook layer didn't dictate the outcome — which is what defer means.
3. **`defer` does NOT skip subsequent `PreToolUse` hooks.** All matched hooks run; the cascade is built from the *complete* yielded set. The cascade order applies only at aggregation time, not as an early-return.
4. **Bug fix relationship to v2.1.110 PermissionRequest.updatedInput re-check.** The v2.1.110 fix re-runs deny rules against `updatedInput` after a `PermissionRequest` hook modifies the input. Defer doesn't directly interact with this, but they share the spirit of "the permission system gets a second chance".
5. **Error message.** Setting `permissionDecision` to an unknown value throws `Unknown hook permissionDecision type: <value>. Valid types are: allow, deny, ask, defer` — note v2.1.88 would say `allow, deny, ask`.
