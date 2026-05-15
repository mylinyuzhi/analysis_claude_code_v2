# Denied-Command Retry UX — v2.1.89

**Theme:** When the auto-mode classifier denies a command, the system now (1) shows an inline notification, (2) records the denial in a ring buffer, and (3) surfaces the denial in `/permissions` → Recent tab where the user can hit `r` to approve+retry.

Pre-v2.1.89, denials were silent — the model would see a "denied" tool result and try a different approach, but the user never knew the model had attempted something the safety classifier blocked. The UX lacked **observability**, leaving users to wonder why an action didn't happen.

---

## 1. The Three Components

### 1.1 The notification

Inline toast in the message stream:

```
shell denied by auto mode · /permissions
```

The "/permissions" portion is dim — it's a hint, not an action.

```javascript
// ============================================
// auto-mode denial notification - shown on every denial
// Location: src/hooks/useCanUseTool.tsx:84-88
// ============================================

toolUseContext.addNotification?.({
    key: "auto-mode-denied",
    priority: "immediate",
    jsx: (
        <>
            <Text color="error">
                {tool.userFacingName(input).toLowerCase()} denied by auto mode
            </Text>
            <Text dimColor>
                {" "}· /permissions
            </Text>
        </>
    )
});
```

The `key: "auto-mode-denied"` allows the notification system to dedup if many denials fire in quick succession; only the latest renders.

### 1.2 The ring buffer

```javascript
// ============================================
// autoModeDenials - in-memory ring buffer of recent denials
// Location: src/utils/autoModeDenials.ts:8-27
// ============================================

export type AutoModeDenial = {
  toolName: string;
  // Human-readable description of the denied command (e.g. bash command string)
  display: string;
  reason: string;
  timestamp: number;
};

let DENIALS: readonly AutoModeDenial[] = [];
const MAX_DENIALS = 20;

export function recordAutoModeDenial(denial: AutoModeDenial): void {
  if (!feature("TRANSCRIPT_CLASSIFIER")) return;
  DENIALS = [denial, ...DENIALS.slice(0, MAX_DENIALS - 1)];
}

export function getAutoModeDenials(): readonly AutoModeDenial[] {
  return DENIALS;
}
```

This is module-scoped global state — survives across slash commands but not across sessions. Capped at 20 entries (anything older is dropped on next push).

**Why module-scoped?** The Recent tab UI snapshots the state on mount (`useState(getAutoModeDenials)`). If the buffer were React-state, mounting the tab would race with concurrent denials. Module-level state is read-once and stable for the lifetime of the tab.

**Why capped at 20?** The Recent tab uses `Math.min(10, options.length)` for visible items but allows scrolling to all 20. Twenty entries is enough to cover a typical run-of-failures without bloating the buffer.

### 1.3 The `/permissions` Recent tab

```javascript
// ============================================
// RecentDenialsTab - lists denials with r-to-retry
// Location: src/components/permissions/rules/RecentDenialsTab.tsx
// ============================================

export function RecentDenialsTab({ onHeaderFocusChange, onStateChange }) {
    // Snapshot on mount — approved/retry Sets key by index, and the live
    // store prepends. A concurrent denial would shift all indices mid-edit.
    const [denials] = useState(() => getAutoModeDenials());

    const [approved, setApproved] = useState(() => new Set<number>());
    const [retry, setRetry] = useState(() => new Set<number>());
    const [focusedIdx, setFocusedIdx] = useState(0);

    useEffect(() => {
        onStateChange({ approved, retry, denials });
    }, [approved, retry, denials, onStateChange]);

    // Toggle approve via Enter
    const handleSelect = useCallback((value: string) => {
        const idx = Number(value);
        setApproved(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    }, []);

    // 'r' toggles retry (and implies approve)
    useInput(
        (input, _key) => {
            if (input === "r") {
                setRetry(prev => {
                    const next = new Set(prev);
                    if (next.has(focusedIdx)) next.delete(focusedIdx);
                    else next.add(focusedIdx);
                    return next;
                });
                setApproved(prev => {
                    if (prev.has(focusedIdx)) return prev;
                    const next = new Set(prev);
                    next.add(focusedIdx);
                    return next;
                });
            }
        },
        { isActive: denials.length > 0 }
    );

    // ... renders Select with options showing approved/retry status
}
```

### Why three pieces of state (`approved`, `retry`, `denials`)?

- **`approved`** — the user toggled approval for this denial (will become a rule on exit).
- **`retry`** — the user wants Claude to **re-attempt** the denied action.
- **`denials`** — the immutable snapshot of denials at mount time.

`retry` is a strict superset of `approved` — approving without retry just creates a rule; retrying always also approves. This is encoded in the `r` handler: pressing `r` always adds to `approved`.

### Why snapshot at mount, not live?

The Sets key by *index into denials* (`{ key: 0, key: 1, ... }`). If a new denial arrives while the user has the tab open, the live store prepends — every existing index shifts by 1, and a user's "approve denial #3" suddenly refers to a different command.

Snapshotting at mount makes the indices stable for the tab's lifetime. The tab user sees a frozen view; if they want to see new denials, they exit and re-open.

---

## 2. The End-to-End Flow

```
1. Auto mode classifier denies a Bash command:
   classifierResult = { shouldBlock: true, reason: "Modifying git config" }

2. useCanUseTool processes:
   - logPermissionDecision(reject, source=config)
   - recordAutoModeDenial({ toolName, display, reason, timestamp })  ← v2.1.89
   - toolUseContext.addNotification(...)                              ← v2.1.89
   - resolve(deny)

3. The agent loop sees the deny tool result and continues
   (the model will try a different approach or ask the user).

4. User notices the notification, types /permissions.

5. /permissions UI mounts, Recent tab snapshots denials.

6. User navigates to a denial, presses 'r':
   - approved adds the index
   - retry adds the index

7. User exits /permissions:
   - onStateChange has been firing throughout
   - Parent (PermissionRuleList) reads { approved, retry, denials }
   - For each approved: install a session-scoped allow rule
   - For each retry: enqueue a tool-call retry with the new permission
```

The retry mechanic loops back to the agent: the user's `r` press doesn't immediately re-execute the command — it adds the rule + signals retry. The next agent turn (when the parent UI hands control back) will see the new rule and the queued retry.

---

## 3. Why This Approach

### Why ring buffer instead of structured history?

Denials are ephemeral session data, not durable records. A user who wants to **always** allow `git push --force` should add a rule via `/permissions` directly, not via Recent tab. The Recent tab is for "the model tried, I want to make it work *now*."

**Cost:** 20-entry buffer × ~200 bytes/entry = 4 KB peak. Trivial.

### Why a separate tab, not inline in the chat?

Inline retry buttons in the message stream would clutter the agent loop. The user might also want to **batch** approvals (allow 3 similar denied commands in one go). The tab provides batching + visual separation.

### Why `r` and not Enter for retry?

Enter is bound to "toggle approval" — pressing Enter on an item adds an allow rule but doesn't re-run the command. The user might want to allow the rule for future sessions without retrying *this* one. Distinct keys for distinct verbs.

### Why prepend, not append?

Most recent denial is most relevant. Prepending matches Twitter-style "newest first" ordering. The `MAX_DENIALS - 1` slice drops the oldest.

### Why only show on `feature("TRANSCRIPT_CLASSIFIER")`?

In non-auto-mode permissions, denials come from explicit rules, not from a classifier judgment. The user already knows why those denials happened (they wrote the rule). The Recent tab is meaningful only when the *classifier* (not the user) made the decision.

---

## 4. State Flow Across Components

```
┌──────────────────────┐
│  autoModeDenials     │  module-scoped DENIALS (max 20)
│  recordAutoModeDenial│◄──── called from useCanUseTool on deny
│  getAutoModeDenials  │──────────► snapshotted at mount
└──────────────────────┘                │
                                        ▼
                              ┌───────────────────┐
                              │  RecentDenialsTab │  approved + retry Sets
                              │  (component)      │  keyed by index
                              └────────┬──────────┘
                                       │ onStateChange
                                       ▼
                              ┌───────────────────┐
                              │ PermissionRuleList│  parent
                              │  - reads state    │
                              │  - on exit:       │
                              │    install rules  │
                              │    enqueue retry  │
                              └───────────────────┘
```

The decoupling is intentional:
- `autoModeDenials.ts` knows about denials, not UI.
- `RecentDenialsTab` knows about UI state (approve/retry sets), not rule installation.
- `PermissionRuleList` knows about rule installation and queue dispatch.

Each layer's responsibility is one concept. Refactoring the rule format or the retry mechanism doesn't ripple through the others.

---

## 5. Edge Cases

### A denial fires while the tab is open

The live `DENIALS` prepends, but the tab snapshotted. The tab user doesn't see the new denial. They can exit and re-open.

**Why not show a "new denials" badge?** Would require subscribing to the module-scoped state, adding complexity for marginal value. The denial also fires a notification, so the user *does* see it — just not in the tab.

### User approves but doesn't retry

The new allow rule installs. The next time the model tries the same command, it succeeds without prompt. The originally-denied command stays denied (it was for a past turn).

### User retries 5 things

Each retry enqueues a separate tool call. The agent loop processes them serially in the order the user marked them.

### `feature('TRANSCRIPT_CLASSIFIER')` flag off

`recordAutoModeDenial` is a no-op. The Recent tab still mounts but shows "No recent denials" — gracefully degrades to a no-op UI.

---

## File-level "where to look"

| Concern | 2.1.112 chunk | v2.1.88 baseline |
|---------|---------------|------------------|
| `recordAutoModeDenial` (ring buffer) | within `chunks.164.mjs` | `src/utils/autoModeDenials.ts:19-22` |
| Notification fire (denial UX) | `chunks.150.mjs` useCanUseTool block | `src/hooks/useCanUseTool.tsx:77-89` |
| `RecentDenialsTab` component | within `chunks.180.mjs` / `chunks.185.mjs` | `src/components/permissions/rules/RecentDenialsTab.tsx` |
| `PermissionRuleList` (parent) | within `chunks.180.mjs` | `src/components/permissions/rules/PermissionRuleList.tsx:1070` |
| 'r' keybinding handler | inside `RecentDenialsTab.tsx:102-122` | same |
| `MAX_DENIALS = 20` constant | bundled in `chunks.*` | `src/utils/autoModeDenials.ts:17` |

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_unit_12.md`](../00_overview/symbol_additions_unit_12.md) — Unit 12 additions
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols
> - [`symbol_index_infra_integration.md`](../00_overview/symbol_index_infra_integration.md) — UI components

Key functions and constants in this document:
- `recordAutoModeDenial` — Push a denial to the ring buffer
- `getAutoModeDenials` — Read the current buffer snapshot
- `MAX_DENIALS = 20` — Buffer cap
- `RecentDenialsTab` — React component for the `/permissions` Recent tab
- `addNotification` — `toolUseContext` method for inline notifications
- `feature("TRANSCRIPT_CLASSIFIER")` — Build flag gating the entire denial-recording path
- `AutoModeDenial` — `{ toolName, display, reason, timestamp }` shape of each entry
