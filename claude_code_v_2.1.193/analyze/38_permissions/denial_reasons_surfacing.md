# Auto-mode denial reasons surfaced in transcript, toast, and Recently-denied

> **Type/version:** MIXED — the denial *record* with `reason` is **CARRYOVER (183)**; the **toast reason** + **Recently-denied per-row reason** display are **NET-NEW (v2.1.193)**; the per-message `toolDenialKind` transcript taxonomy is **NET-NEW but DARK** (gated off). Confidence HIGH on toast/recent-denied, MEDIUM on transcript.
> TARGET: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (build `a1938d2a`). `<line>` is **193** unless tagged **(183)**.

---

## TL;DR

When auto mode denies a tool, the deny decision already carried a human-readable `reason` string **in 183** — the denial *record* stored it. The 193 work is **surfacing** that reason in three places that previously dropped it on the floor:

1. **Toast** — the transient "X denied by auto mode" notification now appends the (truncated) reason as a dimmed middle line (`:640271`).
2. **/permissions → Recently denied** — each denied row now renders the stored reason as a dimmed description sub-line (`:546589`).
3. **Transcript (DARK)** — a richer per-message `toolDenialKind` taxonomy (`"user-rejected" | "automode-unavailable" | "automode-parsing-error" | "automode-blocked" | "permission-rule"`) was wired through the user-message pipeline, but its enabling predicate `USe()` currently `return !1`, so it evaluates to `undefined` today — staged, not live.

The precision point: **the reason was always recorded; 193 makes it visible.**

---

## 1. The denial record (CARRYOVER) — `reason` was always stored

The recent-denials store is a 20-entry ring buffer (`RecentDenialsProvider`/`useRecentDenials`, `:546168-546205`, size `VLf=20`) with `recordDenial`/`getDenials`/`removeDenial`. Crucially the record shape **already** included `reason` in 183.

```javascript
// ============================================
// recordDenial call - the auto-mode deny path records the reason (carryover shape)
// Location: cli_inner_pretty.js:640262-640269
// ============================================

// ORIGINAL (for source lookup):
r({
  toolName: d.name,
  display: I,
  inputKey: sdc(d.name, p),
  reason: v.decisionReason.reason ?? "",
  timestamp: Date.now(),
});

// READABLE (for understanding):
recordDenial({
  toolName: tool.name,
  display: displayLabel,
  inputKey: deriveInputKey(tool.name, input),     // sdc
  reason: decision.decisionReason.reason ?? "",   // ← reason captured (already in 183)
  timestamp: Date.now(),
});

// Mapping: r→recordDenial, d→tool, I→displayLabel, sdc→deriveInputKey, p→input, v→decision
```

The **(183)** equivalent (`:627443-627451`) has the **identical** record shape with `reason`. So the *storage* of the reason is carryover; what changes in 193 is two *renderers* (§2, §3) and a staged transcript taxonomy (§4).

---

## 2. NET-NEW: the toast shows the (truncated) reason

**What it does.** The "X denied by auto mode" toast notification gains a middle line that renders the denial reason, truncated to 79 characters + ellipsis.

**How it works.** Immediately after `recordDenial`, the reason is copied into a local, truncated if over 80 chars, and conditionally rendered as the toast's second child:

```javascript
// ============================================
// auto-mode-denied toast - append the truncated reason as a dimmed middle line
// Location: cli_inner_pretty.js:640270-640294
// ============================================

// ORIGINAL (for source lookup):
let k = "";
if (((k = v.decisionReason.reason ?? ""), k.length > 80)) k = `${k.slice(0, 79)}…`;
i({
  key: "auto-mode-denied",
  kind: "warning",
  priority: "immediate",
  jsx: OOe.jsxs(OOe.Fragment, {
    children: [
      OOe.jsxs(w, { color: "error", children: [d.userFacingName(p).toLowerCase(), " denied by auto mode"] }),
      k ? OOe.jsxs(w, { dimColor: !0, children: [" \xB7 ", k] }) : null,        // ← NET-NEW: reason line
      OOe.jsx(w, { dimColor: !0, children: " \xB7 /permissions" }),
    ],
  }),
});

// READABLE (for understanding):
let reasonText = "";
reasonText = decision.decisionReason.reason ?? "";
if (reasonText.length > 80) reasonText = `${reasonText.slice(0, 79)}…`;   // truncate long reasons
addNotification({
  key: "auto-mode-denied",
  kind: "warning",
  priority: "immediate",
  jsx: Fragment(
    Text({ color: "error" }, `${tool.userFacingName(input).toLowerCase()} denied by auto mode`),
    reasonText ? Text({ dimColor: true }, ` \xB7 ${reasonText}`) : null,        // middle line, only if non-empty
    Text({ dimColor: true }, " \xB7 /permissions"),
  ),
});

// Mapping: i→addNotification, k→reasonText, v→decision, w→Text, OOe→reactRuntime, d→tool, p→input
```

**The 183 before-picture.** In 183 (`:627452-627470`) the second child of the toast Fragment was hard-coded `null` — the reason was computed into a local `k` that was **never used**:

```javascript
// (183) cli_inner_pretty.js:627452-627470 — the middle child is literally null
let k = "";   // assigned but never rendered
i({ key: "auto-mode-denied", … jsx: rde.createElement(rde.Fragment, null,
     rde.createElement(w, { color: "error" }, tool.toLowerCase(), " denied by auto mode"),
     null,                                              // <-- 183: NO reason shown
     rde.createElement(w, { dimColor: !0 }, " \xB7 /permissions")) });
```

**Evidence.** `grep -c "k.length > 80"` is **183=1, 193=2** — 183 had exactly one such truncation elsewhere in the bundle (unrelated), and 193 adds a *second* one: this toast-specific truncation. So the toast reason rendering (and its truncation) is net-new even though the `k.length > 80` idiom is not unique.

**Why truncate at 79+ellipsis.** A toast is a single transient line; an unbounded classifier reason (which can be a full sentence) would overflow the terminal width and clobber the layout. 79 chars + `…` keeps the toast to one readable line while signalling there is more — the full reason is available in the persistent Recently-denied list (§3). This is the standard "toast = teaser, overlay = full text" split.

---

## 3. NET-NEW: Recently-denied renders the reason as a description

**What it does.** In the `/permissions → Recently denied` tab, each denied command's stored `reason` now renders as a dimmed description sub-line under the command.

```javascript
// ============================================
// Recently-denied option builder - render the stored reason as a dimmed description
// Location: cli_inner_pretty.js:546589-546590
// ============================================

// ORIGINAL (for source lookup):
...(M.reason ? { description: M.reason, dimDescription: !0 } : {}),

// READABLE (for understanding):
...(denial.reason ? { description: denial.reason, dimDescription: true } : {}),  // reason → dim sub-line

// Mapping: M→denial (a recent-denial record); spread merges into the option object only when reason is non-empty
```

**The 183 before-picture.** In 183 (`:535601-535621`) the option was built with a trailing `...{}` — an empty spread — so the reason was stored but **never displayed**. 193 swaps the empty spread for the conditional `{ description, dimDescription }` spread.

**Why a conditional spread.** `...(reason ? {…} : {})` adds the `description` key *only* when a reason exists, so a denial with no reason (e.g. a bare permission-rule rejection) does not get an empty grey line — it just renders the command. This is cleaner than always setting `description` to `reason ?? ""`, which would reserve vertical space for nothing.

---

## 4. NET-NEW but DARK: the `toolDenialKind` transcript taxonomy

**What it does.** Classifies a deny decision into one of five kinds and threads that kind onto the user (tool-result) message so the classifier-input transcript can show *why* a prior tool was denied. **It is plumbed but inert** — its enabling predicate returns `false`.

```javascript
// ============================================
// classifyToolDenialKind + isToolDenialKindEnabled - the staged denial-kind taxonomy
// Location: cli_inner_pretty.js:382614-382626
// ============================================

// ORIGINAL (for source lookup):
function XKa(e) {
  if (e.behavior === "ask") return "user-rejected";
  let t = e.decisionReason;
  if (t.type === "classifier" && t.classifier === "auto-mode") {
    if (t.reason === FBe) return "automode-unavailable";
    if (t.reason.startsWith(aSo)) return "automode-parsing-error";
    return "automode-blocked";
  }
  return "permission-rule";
}
function USe() {
  return !1;
}

// READABLE (for understanding):
function classifyToolDenialKind(decision) {
  if (decision.behavior === "ask") return "user-rejected";       // a human said no
  let reasonObj = decision.decisionReason;
  if (reasonObj.type === "classifier" && reasonObj.classifier === "auto-mode") {
    if (reasonObj.reason === AUTOMODE_UNAVAILABLE_MSG) return "automode-unavailable"; // FBe
    if (reasonObj.reason.startsWith(AUTOMODE_PARSE_FAIL_PREFIX)) return "automode-parsing-error"; // aSo
    return "automode-blocked";                                   // auto mode actively blocked it
  }
  return "permission-rule";                                      // a deny rule matched
}
function isToolDenialKindEnabled() {
  return false;                                                  // ← DARK: feature staged off
}

// Mapping: XKa→classifyToolDenialKind, USe→isToolDenialKindEnabled, FBe→AUTOMODE_UNAVAILABLE_MSG,
//          aSo→AUTOMODE_PARSE_FAIL_PREFIX ("Auto mode could not evaluate this action and is blocking it for safety")
```

**How it is wired (and why it is dark).** The field `toolDenialKind` is written onto the user/tool-result message metadata at several construction sites (`:445167`, `:462587`, struct field at `:599612`/`:599637`, also `:382990`) via the guarded form:

```javascript
// ORIGINAL: toolDenialKind: USe() ? XKa($) : void 0
// READABLE: toolDenialKind: isToolDenialKindEnabled() ? classifyToolDenialKind(decision) : undefined
```

Because `USe()` is `return !1`, every such expression evaluates to `undefined` today — the kind is never actually attached. The consumer is the classifier-input renderer `qGp` (`:383163`), which would surface the kind into the classifier transcript when enabled. `grep -c toolDenialKind` is **183=0, 193=7** — the plumbing is genuinely net-new across seven sites, but **inactive** behind the `false` predicate.

**Why dark-launch the taxonomy.** Threading a new metadata field through every tool-result construction site and the classifier-input renderer is a wide, risky change. Landing the plumbing behind a `false` predicate lets it ship inert (no behavioral change, no risk) and be flipped on later by changing one function. This is a textbook staged rollout: the surface area is committed and reviewable now; activation is a one-line flip. Until then it must be reported as **present but not in effect**.

> **Carryover guard:** the *approval*-reason transcript path (`setAutoModeApprovalReason`/`getAutoModeApprovalReason`, obf `dQa`/`pQa`, the `approvals` map keyed by tool-use, `:395284-395292`) is **carryover** from 183 (where it was `PNa`). Do not conflate the (carryover) approval-reason map with the (net-new, dark) `toolDenialKind` taxonomy — they are different mechanisms.

---

## 5. Key insight

The denial *record* already stored `reason` in 183 — the data was there, the renderers were not. 193 is a **surfacing** release for denials: the toast appends a truncated reason, the Recently-denied list renders the full reason as a description, and a richer five-way `toolDenialKind` taxonomy was threaded through the transcript pipeline but staged behind `USe()===false`. The toast↔overlay split (teaser vs full text) is the deliberate UX shape; the dark `toolDenialKind` is a committed-but-inert future surface.

---

## Evidence note (NET-NEW vs CARRYOVER)

| Surface | 193 anchor | 183 status | grep diff |
|---------|-----------|------------|-----------|
| Denials store (provider, ring `VLf=20`) | `:546168` | present | carryover |
| `recordDenial` record **with `reason`** | `:640262` | identical **(183)** `:627443` | carryover |
| **Toast reason line + truncation** | `:640271` | middle child `null` **(183)** `:627452` | `k.length>80` 183=1→193=2 (toast one new) |
| **Recently-denied reason description** | `:546589` | empty `...{}` **(183)** `:535601` | net-new render |
| `toolDenialKind` taxonomy (DARK) | `:382614`, +6 write sites | absent | `grep -c toolDenialKind` 183=**0**, 193=**7** |
| `USe()` enabling predicate | `:382624` (`return !1`) | absent | net-new, inert |
| Approval-reason map (`dQa`/`pQa`) | `:395284` | present (as `PNa`) | carryover |

---

## Cross-links

- Sibling 193 docs: [classify_all_shell.md](./classify_all_shell.md) (a now-classified shell command that the classifier denies feeds this reason surface), [recent_denied_overlay.md](./recent_denied_overlay.md) (approving one of these denied rows + close-persist), [README.md](./README.md).
- The auto-mode classifier decision pipeline (the `decisionReason` producer) is the upstream of every `reason` rendered here.

---

## Related Symbols

> Symbol mappings live in the symbol index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Auto-mode (home for the denial-reason surfaces)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Permissions
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI (toast/overlay)
> - per-feature additions: [symbol_additions_v2_1_193_permissions.md](../00_overview/symbol_additions_v2_1_193_permissions.md)

Key functions in this document:

- `RecentDenialsProvider` / `useRecentDenials` (obf: `r4l`/`oSt`, `:546168`) — ring-buffer denial store (`VLf=20`); carryover.
- `recordDenial` (obf: `r`, call at `:640262`) — captures `toolName/display/inputKey/reason/timestamp`; carryover shape.
- auto-mode-denied toast (obf: `i({key:"auto-mode-denied",…})`, `:640271`) — net-new reason line; truncation at `:640271`.
- Recently-denied option builder (obf: `f4l`, reason spread at `:546589`) — net-new `description: reason, dimDescription`.
- `classifyToolDenialKind` (obf: `XKa`, `:382614`) — five-way denial-kind taxonomy; net-new.
- `isToolDenialKindEnabled` (obf: `USe`, `:382624`) — `return !1`; the dark-launch gate.
- `toolDenialKind` field — threaded at `:445167`/`:462587`/`:599612`/`:599637`/`:382990`; consumed by classifier-input renderer `qGp` (`:383163`); inert.
- `setAutoModeApprovalReason` / `getAutoModeApprovalReason` (obf: `dQa`/`pQa`, `:395284`) — carryover approvals map (183 `PNa`).
