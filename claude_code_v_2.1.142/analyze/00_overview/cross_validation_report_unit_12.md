# Cross-Validation Report

- **Unit:** 12
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-a733f019445b00dc9/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 23

## C1 — Symbol existence (151 candidates)
- PASS: 151
- WARN: 0 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

## C2 — Line/symbol pairing (176 pairs)
- PASS: 173
- FAIL: 3

Mismatched line citations (top 30):
  - `LD8` not found near `cli_inner_pretty.js:476491-476511` (cited in `00_overview/symbol_additions_v2_1_142_think_ui.md`)
  - `rf5` not found near `cli_inner_pretty.js:476488-476490` (cited in `00_overview/symbol_additions_v2_1_142_think_ui.md`)
  - `of5` not found near `cli_inner_pretty.js:476513-476521` (cited in `00_overview/symbol_additions_v2_1_142_think_ui.md`)

## C3 — Line range sanity (306 ranges)
- PASS: 306
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_think_ui.md`
- Mappings: 0
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `gB_` at `cli_inner_pretty.js:328759-328759` (cited in `02_ui/spinner_amber_warm.md`)

```js
    (FB_ = [1e4, 45000, 300000]),
    (gB_ = { r: 153, g: 153, b: 153 }),
    (QB_ = { r: 185, g: 185, b: 185 }));
});

```

**Verdict:** PASS — symbol present in cited window

### Sample — `$HA` at `cli_inner_pretty.js:579608-579675` (cited in `00_overview/symbol_additions_v2_1_142_think_ui.md`)

```js
}
function $HA({ jumpRef: H, count: $, current: q, onClose: K, onCancel: _, setHighlight: A, initialQuery: z }) {
  let {
      query: Y,
      cursorOffset: f,
      handleKeyDown: O,
      handlePaste: M,
    } = AG({ isActive: !0, initialQuery: z, onExit: () => K(Y), onCancel: _ }),
    w = iK(),
    [D, j] = e$.useState("building");
  e$.useEffect(() => {
    let P = !0,
      Z = H.current?.w...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `pU5` at `cli_inner_pretty.js:535677-535677` (cited in `19_think_level/status_line_effort_thinking.md`)

```js
}
function pU5({ messagesRef: H, lastAssistantMessageId: $, tokenUsage: q, vimMode: K }) {
  let _ = _j.useRef(void 0),
    A = f$((c) => c.toolPermissionContext.mode),

```

**Verdict:** PASS — symbol present in cited window

### Sample — `HHA` at `cli_inner_pretty.js:579476-579500` (cited in `02_ui/transcript_navigation.md`)

```js
}
function HHA(H) {
  let $ = TT$.c(6),
    { status: q, searchBadge: K } = H;
  if (q) {
    let A;
    if ($[0] !== q) ((A = o$.createElement(k, null, q, " ")), ($[0] = q), ($[1] = A));
    else A = $[1];
    return A;
  }
  if (K) {
    let A;
    if ($[2] !== K.count || $[3] !== K.current)
      ((A = o$.createElement(k, { dimColor: !0 }, K.current, "/", K.count, "  ")),
        ($[2] = K.coun...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `$l$` at `cli_inner_pretty.js:128470-128485` (cited in `19_think_level/stream_idle_watchdog_fix.md`)

```js
    (PV1 = { __auth: { provider: null, tokenCache: null, resolution: null, error: null, extraHeaders: {} } }));
  $l$ = class $l$ extends Error {
    idleMs;
    bytesReceived;
    ttfbMs;
    bodyReadPending;
    cfRay;
    constructor(H, $ = 0, q, K = !0, _) {
      super(`stream idle: no bytes for ${H}ms`);
      ((this.name = "StreamIdleTimeoutError"),
        (this.idleMs = H),
        (this....
```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 151 PASS / 0 WARN
- C2 Line/symbol pairing: 173 PASS / 3 FAIL
- C3 Range sanity: 306 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: FAIL**
