# Recently-denied: approve-persists-on-close + session-allowed-hosts

> **Type/version:** Two NET-NEW behaviors (changelog **2.1.191**) — (1) approving a Recently-denied command now **persists on close**; (2) the sandbox network-permission dialog **remembers "Yes" hosts** for the session via the `ko` controller. Both are refinements of existing overlays. Confidence HIGH.
> TARGET: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (build `a1938d2a`). `<line>` is **193** unless tagged **(183)**.

---

## TL;DR

Two `/permissions`-adjacent UX refinements, both about *making a one-time approval stick*:

1. **Approve-persists-on-close.** In 183, approving a recently-denied command in the overlay was effectively a no-op once you closed — the denial stayed in the Recently-denied list and the model was never told. 193's close handler **removes** each approved denial from the ring buffer (`removeDenial`) and emits a meta-message granting the model permission to retry.
2. **Session-allowed-hosts.** When the sandbox network-permission dialog is answered "Yes" for a host, `addSessionAllowedHost(host)` (`_Wd`) adds it to a per-session `Set` (`BLn`) that is unioned into the sandbox network `allowedDomains`, so subsequent connections to that host within the session are auto-allowed (no re-prompt). Cleared on reset.

---

## 1. Approve-persists-on-close — the overlay close handler

**What it does.** The `/permissions` overlay (`H4l`, `:547100`) binds a close handler (`wt`) that runs when the dialog is dismissed. On close it processes two sets of denials the user toggled: a `retry` set and an `approved` set. The 193 delta is the **approved-set branch**: each approved denial is removed from the store and the model is granted retry permission.

**How it works (the two branches).**

```javascript
// ============================================
// onPermissionsOverlayClose - retry branch (carryover) + approved branch (NET-NEW persist)
// Location: cli_inner_pretty.js:547334-547370
// ============================================

// ORIGINAL (for source lookup):
wt = () => {
  let Ke = b.current,
    Dt = (dt) => Array.from(dt).map((nn) => Ke.denials[nn]).filter(cDf),
    Qt = Dt(Ke.retry);
  if (Qt.length > 0) {                                   // retry branch (carryover)
    let dt = Qt.map(lDf);
    (o(dt), n(void 0, { shouldQuery: !0, metaMessages: [`Permission granted for: ${dt.join(", ")}. You may now retry ${dt.length === 1 ? "this command" : "these commands"} if you would like.`] }));
    return;
  }
  let Xn = Dt(Ke.approved);
  if (Xn.length > 0 || d.length > 0) {                   // approved branch (NET-NEW persistence)
    for (let Sn of Xn) i(Sn);                            // i = removeDenial → approval persists
    let dt = Xn.map(aDf), nn = dt.length > 0 ? [`Approved ${dt.map(iDf).join(", ")}`] : [];
    n([...nn, ...d].join("\n"),
      dt.length > 0
        ? { metaMessages: [`Permission granted for: ${dt.join(", ")}. You may now retry ${dt.length === 1 ? "this command" : "these commands"} if you would like.`] }
        : void 0);
  } else n("Permissions dialog dismissed", { display: "system" });
};

// READABLE (for understanding):
onPermissionsOverlayClose = () => {
  let state = stateRef.current,
    resolveDenials = (idSet) => Array.from(idSet).map((id) => state.denials[id]).filter(isValidDenial), // cDf
    retried = resolveDenials(state.retry);
  if (retried.length > 0) {                              // CARRYOVER: user chose "retry" on some denials
    let labels = retried.map(formatDenialLabel);
    onRetryDenials(labels);                              // o
    sendMessage(undefined, { shouldQuery: true, metaMessages: [`Permission granted for: ${labels.join(", ")}. You may now retry …`] });
    return;
  }
  let approved = resolveDenials(state.approved);
  if (approved.length > 0 || extra.length > 0) {         // NET-NEW: user "approved" some denials
    for (let denial of approved) removeDenial(denial);   // ← persist: drop from the Recently-denied ring buffer
    let labels = approved.map(formatDenialLabel2),
      header = labels.length > 0 ? [`Approved ${labels.map(formatApproved).join(", ")}`] : [];
    sendMessage([...header, ...extra].join("\n"),
      labels.length > 0
        ? { metaMessages: [`Permission granted for: ${labels.join(", ")}. You may now retry …`] } // ← NET-NEW: tell the model
        : undefined);
  } else sendMessage("Permissions dialog dismissed", { display: "system" });
};

// Mapping: wt→onPermissionsOverlayClose, b→stateRef, Dt→resolveDenials, cDf→isValidDenial,
//          o→onRetryDenials, i→removeDenial, n→sendMessage, Ke.retry/Ke.approved→toggled denial-id sets
```

**The 183 before-picture.** In 183 (`:536350-536375`) the **retry branch was identical** (it already removed via `o` and sent a "Permission granted for:" meta-message — *carryover*), but the **approved branch was cosmetic**:

```javascript
// (183) cli_inner_pretty.js:536369-536375 — approved branch: emit a label, nothing else
let Bt = ut(pt.approved);
if (Bt.length > 0 || u.length > 0) {
  let An = Bt.length > 0 ? [`Approved ${Bt.map(nif).join(", ")}`] : [];
  n([...An, ...u].join("\n"));            // 183: just an "Approved X" string — NO removeDenial, NO metaMessages
} else n("Permissions dialog dismissed", { display: "system" });
```

So in 183 approving a denial in the overlay (a) left it in the Recently-denied ring buffer and (b) never told the model. 193's approved branch adds `for (let Sn of Xn) i(Sn)` (removeDenial) and the `metaMessages` grant. `grep -c "Permission granted for"` is **183=1, 193=2** — the 183 occurrence is the retry-branch carryover; the second 193 occurrence is the new approved-branch grant.

**Why persist on *close* rather than on toggle.** The overlay lets the user toggle multiple denials' `approved`/`retry` state interactively; committing each toggle immediately would fight the user as they change their mind mid-session. Deferring all mutation (removeDenial + the model grant) to the single close handler makes the overlay a transactional edit: nothing is persisted until the user dismisses, and then the whole approved set is applied at once. The `metaMessages` grant is what closes the loop with the model — after this, the model "may now retry" the command, which is the entire point of approving a previously-denied action.

**Retry vs approve — the two paths.** Both branches now emit the same "Permission granted for:" grant, but they differ in intent: **retry** (carryover) means "approve *and* immediately re-issue" (`shouldQuery: true` re-prompts the model), while **approve** (net-new persistence) means "approve and remove from the denied list" without forcing an immediate re-run. The net-new work is making *approve* persist; retry already did.

---

## 2. Session-allowed-hosts — `_Wd` / `BLn` on the `ko` sandbox controller

**What it does.** Caches per-session the hosts the user said "Yes" to in the sandbox network-permission dialog, so each host is asked at most once per session.

```javascript
// ============================================
// addSessionAllowedHost - remember a "Yes" host for the session, then rebuild sandbox config
// Location: cli_inner_pretty.js:219238-219241
// ============================================

// ORIGINAL (for source lookup):
function _Wd(e) {
  if (BLn.has(e)) return;
  (BLn.add(e), hJr());
}

// READABLE (for understanding):
function addSessionAllowedHost(host) {
  if (sessionAllowedHosts.has(host)) return;     // already remembered → no-op
  sessionAllowedHosts.add(host);                 // BLn — the per-session Set
  refreshSandboxConfig();                        // hJr — rebuild network allowedDomains to include it
}

// Mapping: _Wd→addSessionAllowedHost, BLn→sessionAllowedHosts, hJr→refreshSandboxConfig
```

**The lifecycle.**

- **Storage:** `BLn = new Set()` (`:219833`) — a module-scoped session set.
- **Add:** `_Wd` (`:219238`) adds the host and calls `hJr()` to rebuild the sandbox config.
- **Merge:** during config build, `for (let $ of BLn) s.push($)` (`:219287`) unions the session hosts into the network `allowedDomains`, so the sandbox network layer now permits them.
- **Reset:** `BLn.clear()` (`:219748`) inside `ko.reset` drops all session hosts.
- **Exposed on the controller:** `ko` (the sandbox controller, `:219848`) publishes the method as `addSessionAllowedHost: _Wd` (`:219863`).

**The callers — three "allow" surfaces all funnel to the controller.**

```javascript
// ORIGINAL anchors:
//   :688936  if (wp) ko.addSessionAllowedHost(ft.host);                 // repl-bridge allow handler
//   :691049  } else if (zt) ko.addSessionAllowedHost(Ur);              // network-permission overlay allow
//   :691091  } else if (zt) ko.addSessionAllowedHost(Ur);              // (second overlay branch)
//   :702278  return (ko.addSessionAllowedHost(r), !0);                 // slash/programmatic allow
```

`grep -c addSessionAllowedHost` is **183=0, 193=5** (the def + the four call sites) — fully net-new.

**Why a per-session Set merged into `allowedDomains` (not a persisted allow rule).** Two design choices:

- **Per-session, not persisted.** A host approved once is trusted for the *whole session* but forgotten on reset/restart. This is the right scope for a sandbox network exception: it reduces nagging within a working session without silently widening the network policy permanently (which a persisted allow rule would). The user re-confirms next session.
- **Merged into `allowedDomains` via a config rebuild (`hJr`).** Rather than special-casing session hosts at every connection check, `_Wd` rebuilds the canonical sandbox config so the session hosts become ordinary `allowedDomains` members. The network layer then needs no awareness of "session" hosts — it just sees a larger allow list. The `if (BLn.has(e)) return` guard makes repeated approvals of the same host idempotent (no redundant rebuild).

**Key insight (both features).** Both are "**ask once, remember within the session**" refinements: the Recently-denied overlay makes an *approval* persist (removeDenial + model grant on close) instead of evaporating; the network dialog makes a *Yes-host* persist (session Set → allowedDomains) instead of re-prompting. Each is purely additive — fewer prompts — with the deliberate caveat that a thing approved once is trusted for the rest of the session.

---

## Evidence note (NET-NEW vs CARRYOVER)

| Item | 193 anchor | 183 status | grep diff |
|------|-----------|------------|-----------|
| Permissions overlay `H4l` | `:547100` | present | carryover shell |
| Recent-denied tab `f4l` | `:546479` | present | carryover |
| Close handler retry branch | `:547339` | identical **(183)** `:536356` | **carryover** |
| **Close handler approved branch (removeDenial + grant)** | `:547353` | cosmetic **(183)** `:536369` | `Permission granted for` 183=**1**→193=**2** |
| Session host Set `BLn` | `:219833` | absent | net-new |
| `addSessionAllowedHost` `_Wd` | `:219238` | absent | `grep -c` 183=**0**, 193=**5** |
| `ko` controller method | `:219863` | absent | net-new |
| Merge into `allowedDomains` | `:219287` | absent | net-new |
| `BLn.clear()` in reset | `:219748` | absent | net-new |
| Allow-handler callers | `:688936`,`:691049`,`:691091`,`:702278` | absent | net-new |

---

## Cross-links

- Sibling 193 docs: [denial_reasons_surfacing.md](./denial_reasons_surfacing.md) (the per-row reason rendered in the same Recently-denied tab this doc's close handler operates on), [sandbox_credentials.md](./sandbox_credentials.md) (the `ko` controller + `hJr` config rebuild that `_Wd` triggers), [README.md](./README.md) (the `ko` controller surface).

---

## Related Symbols

> Symbol mappings live in the symbol index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Permissions/Sandbox
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI (overlay)
> - per-feature additions: [symbol_additions_v2_1_193_permissions.md](../00_overview/symbol_additions_v2_1_193_permissions.md)

Key functions in this document:

- `PermissionsOverlay` (obf: `H4l`, `:547100`) — binds `{getDenials, removeDenial} = oSt()`; close handler `wt` at `:547334`.
- `RecentDeniedTab` (obf: `f4l`, `:546479`) — toggles `approved`/`retry` sets.
- close handler approved branch (`:547353`) — net-new `removeDenial` + "Permission granted for:" meta-message.
- `addSessionAllowedHost` (obf: `_Wd`, `:219238`) — `if (BLn.has) return; BLn.add; hJr()`.
- `sessionAllowedHosts` (obf: `BLn`, `:219833`) — per-session host Set; merged at `:219287`, cleared at `:219748`.
- `ko` sandbox controller (`:219848`) — exposes `addSessionAllowedHost: _Wd` at `:219863`, `refreshConfig: hJr`, `reset: kWd`.
- `refreshSandboxConfig` (obf: `hJr`) — rebuilds the sandbox config (folds session hosts into `allowedDomains`).
