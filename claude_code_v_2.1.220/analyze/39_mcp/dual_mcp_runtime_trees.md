# The MCP client ships **twice**: `MCP_SDK_GENERATION` v1/v2 and the accessor tripwire

> **Type:** UNDOCUMENTED architectural change (no changelog bullet) · **Version:** somewhere in `.195`–`.220`
> · **Module:** `39_mcp/`
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
> Every line is a **2.1.220** line I read; baseline lines tagged `(193)`.

## TL;DR — and a correction to the tree's ground truth

`_GROUND_TRUTH_verified_anchors.md` §6.7 warns that "the 2.1.220 bundle contains TWO near-identical copies
of the MCP client module" and calls the doubling *"a bundling artefact [that] proves nothing"*. **It is not
an artefact.** The bundle deliberately ships **two complete MCP runtime trees** and picks one at runtime:

```
v2 tree  cli_inner_pretty.js:292800–297500   MCP_TREE_ID = "v2"   (xAy, :294477)   opt-in
v1 tree  cli_inner_pretty.js:298300–302400   MCP_TREE_ID = "v1"   (aTy, :300019)   DEFAULT
```

Selection is `getMcpSdkGeneration()` (`o9`, `:262846-262863`): the env var `MCP_SDK_GENERATION`
(**220=3 / 193=0**) wins, else the GrowthBook gate `tengu_brindle_causeway` (**220=1 / 193=0**, default
`!1`), else `"v1"`. Eight accessor functions (`:302428-302474`) route every consumer to the selected tree,
and two of them carry a **self-check tripwire** that throws if the loaded module's `MCP_TREE_ID` does not
match the resolved generation (`:302431-302441`; `MCP_TREE_ID` is **220=6 / 193=0**).

**Practical consequence for every other doc in this module:** the *default* code path is the **higher**
line range (`298xxx`–`302xxx`), even though the lower range reads like the primary copy. A 2:1 literal
count in the MCP client region is therefore usually **not** a delta — but it is also not "the same code
emitted twice by accident". It is one feature with two implementations, and they can legitimately diverge.

---

## 1. The generation resolver

```javascript
// ============================================
// getMcpSdkGeneration - resolves the MCP runtime arm once per process and memoises it
// Location: cli_inner_pretty.js:262846-262863
// ============================================

// ORIGINAL (for source lookup):
function o9() {
  {
    if (Cgo !== void 0) return Cgo;
    let e = Z.MCP_SDK_GENERATION,
      t = e === "v1" || e === "v2" ? e : void 0;
    if (e !== void 0 && t === void 0)
      w(`MCP_SDK_GENERATION=${e} is invalid; expected 'v1' or 'v2' — ignoring`, { level: "warn" });
    let r = t === void 0 && Ke("tengu_brindle_causeway", !1) === !0,
      n = t ?? (r ? "v2" : "v1"),
      o = t !== void 0 ? "env" : r ? "growthbook" : "default";
    return ((Cgo = n), w(`mcp runtime arm: ${n} (source: ${o})`),
      O("tengu_mcp_sdk_generation", { generation: fe(n), source: fe(o) }), Cgo);
  }
  return "v1";
}

// READABLE (for understanding):
function getMcpSdkGeneration() {
  if (memoisedGeneration !== undefined) return memoisedGeneration;          // once per process
  let raw = env.MCP_SDK_GENERATION,
    fromEnv = raw === "v1" || raw === "v2" ? raw : undefined;
  if (raw !== undefined && fromEnv === undefined)
    log(`MCP_SDK_GENERATION=${raw} is invalid; expected 'v1' or 'v2' — ignoring`, { level: "warn" });
  let gateSaysV2 = fromEnv === undefined && getFeatureValue("tengu_brindle_causeway", false) === true,
    generation = fromEnv ?? (gateSaysV2 ? "v2" : "v1"),
    source = fromEnv !== undefined ? "env" : gateSaysV2 ? "growthbook" : "default";
  memoisedGeneration = generation;
  log(`mcp runtime arm: ${generation} (source: ${source})`);
  logEvent("tengu_mcp_sdk_generation", { generation, source });
  return memoisedGeneration;
}

// Mapping: o9→getMcpSdkGeneration, Cgo→memoisedGeneration, Z→env, Ke→getFeatureValue, O→logEvent,
//          w→log, fe→enumTelemetryValue
```

### Decision: memoise the arm, and report *why*

**What it does:** decides once, for the whole process, which MCP client implementation is live.

**How it works:**
1. **Memoised in a module-level `let` (`Cgo`).** Not a cache with invalidation — a one-shot. This matters:
   the arm must not change mid-session, or half the connected clients would live in one tree and half in
   the other, and the `MCP_TREE_ID` tripwire would start firing on whichever accessor was called after
   the flip.
2. **Invalid env values warn and fall through** rather than throwing. A typo (`MCP_SDK_GENERATION=2`)
   degrades to the gate/default path with a log line, so an operator cannot brick MCP with a bad value.
3. **`source` is emitted with the generation** (`:262859`). This is the tell that the flag is an
   *experiment* rather than a config: Anthropic needs to distinguish "user forced v2" from "we rolled
   v2 to this user" in the telemetry, otherwise an incident in the v2 arm cannot be attributed.
4. **Dead code after the `return`.** The trailing `return "v1"` (`:262863`) is unreachable — the block
   above always returns. It is the residue of a compile-time flag that used to hard-pin v1, which tells
   you the dual-tree machinery was built *before* the gate existed.

**Why a whole second tree instead of branching inside one client:** the two arms are different
generations of the upstream MCP TypeScript SDK. Branching would mean one module importing two
incompatible SDK surfaces; duplicating the *client wrapper* per SDK keeps each wrapper type-correct
against its own SDK and makes the rollback a one-flag change. The cost is ~4,500 duplicated lines
(~1.5 % of the bundle) and the risk that a fix lands in only one arm.

**Key insight:** `tengu_brindle_causeway` defaults to `false`, so everything in this module's other docs
executes in the **v1** tree unless a remote gate says otherwise. Any anchor you cite from the `292xxx`
range is real code that is *not* running for a default user.

---

## 2. The accessor table and the tripwire

```javascript
// ============================================
// getMcpClientModule - routes to the selected tree and asserts the tree identity
// Location: cli_inner_pretty.js:302428-302443
// ============================================

// ORIGINAL (for source lookup):
function P0y() {
  if (o9() === "v2") {
    let r = (mYu(), en(fYu));
    if (r.MCP_TREE_ID !== "v2")
      throw Error("MCP runtime accessor tripwire: resolved generation is v2 but the loaded client module does not carry MCP_TREE_ID v2");
    return r;
  }
  let e = (U7u(), en(B7u));
  if (e.MCP_TREE_ID !== "v1")
    throw Error("MCP runtime accessor tripwire: resolved generation is v1 but the loaded client module does not carry MCP_TREE_ID v1");
  return e;
}

// READABLE (for understanding):
function getMcpClientModule() {
  if (getMcpSdkGeneration() === "v2") {
    let mod = requireV2ClientTree();
    if (mod.MCP_TREE_ID !== "v2") throw Error("MCP runtime accessor tripwire: … v2 …");
    return mod;
  }
  let mod = requireV1ClientTree();
  if (mod.MCP_TREE_ID !== "v1") throw Error("MCP runtime accessor tripwire: … v1 …");
  return mod;
}

// Mapping: P0y→getMcpClientModule, o9→getMcpSdkGeneration, en→interopRequire, MCP_TREE_ID→tree identity const
```

The full accessor set (export table `:302416-302427`), each `if (o9() === "v2") …` at the listed line:

| Accessor | Line | Tripwire? |
|---|---|---|
| `mcpClientModule` (`P0y`) | `:302428` | **yes** (both arms) |
| `mcpAuthModule` (`M0y`) | `:302444` | no |
| `mcpElicitationHandlerModule` (`O0y`) | `:302448` | no |
| `mcpTaskWatcherModule` (`$0y`) | `:302452` | no |
| `mcpSdkErrorClassificationModule` (`N0y`) | `:302456` | no |
| `mcpDirectoryReadModule` (`F0y`) | `:302460` | no |
| `mcpIsListAuthErrorModule` (`B0y`) | `:302464` | no |
| `mcpXaaIdpLoginModule` (`U0y`) | `:302468` | no |
| `mcpSkillsListModule` (`j0y`) | `:302472` | **generation-independent** — single implementation |

**Why only the client module gets a tripwire:** it is the one with a huge surface (its export table at
`:292800-292852` lists ~55 functions) and the one whose module id is most likely to be mis-wired by the
bundler after a tree-shake. The tripwire converts a silent "v2 session running v1 transport" into a loud
startup crash. `mcpSkillsListModule` returning one implementation for both arms is the proof that the
split is at the *SDK* boundary, not the feature boundary: MCP-server-provided skills do not touch SDK
types.

**Consumption:** `mcpClientModule()` is called **27 times** (220=27 / 193=0) and `mcpAuthModule()` **9
times**. In 2.1.193 there was no accessor at all — consumers imported the single client module directly.

---

## 3. How to tell a real delta from a tree twin

Method, in order:

1. `grep -c 'literal' $T $B`. If `220 == 2 × 193`, suspect a twin.
2. `grep -n 'literal' $T` and check the two line numbers straddle **~297500**. One hit in `292xxx-297xxx`
   plus one in `298xxx-302xxx` is a twin.
3. Read **both** 220 sites. Confirmed twins observed while writing this module:
   - `MCP: staging root unavailable, omitted from roots/list` — `:293424` / `:298966`
   - `No URL configured for this server` (connect short-circuit) — `:294657` / `:300199`
   - `tengu_mcp_proxy_needs_approval_retry` — `:293996`/`:294016`/`:294026` and `:299538`/`:299558`/`:299568`
   - `tengu_mcp_oauth_refresh_failure` — `:288008` / `:298055`
   - the idle-timeout resolver — `MKu` `:292957` / its twin `:298498`
   - the roots handler registration — `:294866` / `:300408`
   - the auto-background call site — `:295650` / `:301192`
4. Anything with an **odd** 220 count, or a count that is not `2×`, has a genuine asymmetry. Examples:
   - `CLI_OWNED_BEARER_REJECTED` 220=6 / 193=0 → new, in both trees plus the `bSp` display set.
   - `roots: { listChanged: !0 }` 220=**1** (`:281499`) → the capability builder `Clr()` is **shared**
     (called from `:294862` *and* `:300404`), so a fix there lands in both arms.
   - the auto-background module `REs` (`:288849`) is **shared**, imported as `Avs` (`:294625`) by v2 and
     `eAs` (`:300167`) by v1.

**Key insight:** the shared/duplicated boundary is not arbitrary. Anything that talks to the *SDK*
(transports, request handlers, OAuth provider class) is duplicated; anything that is pure Claude-Code
policy (capability declaration, config validation, auto-backgrounding, policy allow/deny, error
formatting) lives **once** in the `26xxxx`–`28xxxx` range and is called by both trees. That is why the
config-validation and managed-policy work described in the sibling docs has single-hit counts.

---

## Cross-links

- [`README.md`](./README.md) — the window's ledger; every citation there is labelled `shared` / `v1` / `v2`.
- [`auto_background_tool_calls.md`](./auto_background_tool_calls.md) — a shared module with two call sites.
- [`oauth_timeouts_and_reconnect.md`](./oauth_timeouts_and_reconnect.md) — the most twin-heavy area.
- Correction target: [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §6.7.

## Related Symbols

> Symbol mappings:
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (**MCP** home)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [../00_overview/symbol_additions_v2_1_220_mcp.md](../00_overview/symbol_additions_v2_1_220_mcp.md) - this window's MCP additions

Key functions/constants in this document:

- `getMcpSdkGeneration` (`o9`, `cli_inner_pretty.js:262846`) - resolves and memoises `v1`/`v2`.
- `MCP_SDK_GENERATION_MEMO` (`Cgo`, `cli_inner_pretty.js:262865`) - the one-shot memo cell.
- `getMcpClientModule` (`P0y`, `cli_inner_pretty.js:302428`) - tripwire-guarded client accessor.
- `getMcpAuthModule` (`M0y`, `cli_inner_pretty.js:302444`) - OAuth-provider accessor.
- `getMcpTaskWatcherModule` (`$0y`, `cli_inner_pretty.js:302452`) - task-watcher accessor.
- `MCP_TREE_ID` v2 (`xAy`, `cli_inner_pretty.js:294477`) - `"v2"`.
- `MCP_TREE_ID` v1 (`aTy`, `cli_inner_pretty.js:300019`) - `"v1"`.
- `MCP_CLIENT_EXPORTS` v2 (`cli_inner_pretty.js:292800-292852`) - ~55-entry export table incl. `MCP_TREE_ID`.
- `MCP_CLIENT_EXPORTS` v1 (`cli_inner_pretty.js:298345-298394`) - the twin table.
