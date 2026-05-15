# Cross-Validation Report

- **Unit:** 06
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-a2da6aae219a040a4/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 11

## C1 — Symbol existence (161 candidates)
- PASS: 159
- WARN: 2 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `C5O` — first cited in `00_overview/symbol_additions_v2_1_142_mcp.md` line 32
  - `oGY` — first cited in `06_mcp/headers_helper_reconnect.md` line 288

## C2 — Line/symbol pairing (133 pairs)
- PASS: 125
- FAIL: 8

Mismatched line citations (top 30):
  - `gvY` not found near `cli_inner_pretty.js:414063-414063` (cited in `00_overview/symbol_additions_v2_1_142_mcp.md`)
  - `_$4` not found near `cli_inner_pretty.js:32778-32793` (cited in `00_overview/symbol_additions_v2_1_142_mcp.md`)
  - `_g` not found near `cli_inner_pretty.js:413440-413471` (cited in `00_overview/symbol_additions_v2_1_142_mcp.md`)
  - `wEH` not found near `cli_inner_pretty.js:452267-452267` (cited in `00_overview/symbol_additions_v2_1_142_mcp.md`)
  - `QI6` not found near `cli_inner_pretty.js:412912-412925` (cited in `00_overview/symbol_additions_v2_1_142_mcp.md`)
  - `oGY` not found near `cli_inner_pretty.js:412394-412449` (cited in `06_mcp/headers_helper_reconnect.md`)
  - `QI6` not found near `cli_inner_pretty.js:412912-412925` (cited in `06_mcp/oauth_refresh_fixes.md`)
  - `QI6` not found near `cli_inner_pretty.js:412912-412925` (cited in `06_mcp/v2_1_142_README.md`)

## C3 — Line range sanity (215 ranges)
- PASS: 215
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_mcp.md`
- Mappings: 16
- Conflicts: 1

  - `Field` mapped to both `Where` and `Purpose`

## S1 — Semantic spot-check (5 random samples)

### Sample — `f$4` at `cli_inner_pretty.js:412345-412348` (cited in `00_overview/symbol_additions_v2_1_142_mcp.md`)

```js
}
function f$4() {
  let H = parseInt(process.env.MCP_CONNECT_TIMEOUT_MS || "", 10);
  return H > 0 ? H : 5000;
}
function O$4(H) {
  return T15.has(H);

```

**Verdict:** PASS — symbol present in cited window

### Sample — `Nj8` at `cli_inner_pretty.js:451806-451826` (cited in `06_mcp/tools_list_retry.md`)

```js
}
function Nj8(H, $, q) {
  switch (H.client.type) {
    case "connected":
      if (H.client.toolsListError)
        return { message: `Reconnected to ${$}, but fetching tools failed: ${H.client.toolsListError}`, success: !1 };
      return { message: `Reconnected to ${$}.`, success: !0 };
    case "needs-auth":
      return {
        message: q?.hasHeadersHelper
          ? `${$} requires authen...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `UI6` at `cli_inner_pretty.js:411603-411603` (cited in `00_overview/symbol_additions_v2_1_142_mcp.md`)

```js
  q15 = 30000,
  UI6 = 5,
  _15,
  A15,

```

**Verdict:** PASS — symbol present in cited window

### Sample — `Qu8` at `cli_inner_pretty.js:48953-48953` (cited in `00_overview/symbol_additions_v2_1_142_mcp.md`)

```js
    (gu8 = yH(() => y.object({ type: y.literal("sdk"), name: y.string(), alwaysLoad: y.boolean().optional() }))),
    (Qu8 = yH(() => y.enum(["allow", "ask", "blocked"]))),
    (du8 = yH(() =>
      y.object({

```

**Verdict:** PASS — symbol present in cited window

### Sample — `nq$` at `cli_inner_pretty.js:48881-48889` (cited in `00_overview/symbol_additions_v2_1_142_mcp.md`)

```js
    (CRA = yH(() => y.enum(["stdio", "sse", "sse-ide", "http", "ws", "sdk"]))),
    (nq$ = yH(() =>
      y.object({
        type: y.literal("stdio").optional(),
        command: y.string().min(1, "Command cannot be empty"),
        args: y.array(y.string()).default([]),
        env: y.record(y.string(), y.string()).optional(),
        alwaysLoad: y.boolean().optional(),
      }),
    )),
    (Vh9...
```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 159 PASS / 2 WARN
- C2 Line/symbol pairing: 125 PASS / 8 FAIL
- C3 Range sanity: 215 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 1
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: FAIL**
