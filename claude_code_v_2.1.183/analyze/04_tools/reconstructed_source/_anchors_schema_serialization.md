# Anchors — Tool Wire-Schema Serialization (v2.1.183)

> **Scope:** `buildToolSchema(tool, opts)` → the `{ name, description, input_schema, (strict?), (eager_input_streaming?), (defer_loading?), (cache_control?) }` wire object sent to the Messages API. Mirrors the 2.1.156 scaffold `w08` path (`04_tools/read_partial_view_and_streaming_exec.md` Part 2). All line numbers below are **re-derived against `2.1.183/extract/cli_inner_pretty.js`** by string-anchoring; the bundle re-mangled (e.g. 2.1.156 `w08`@555969 → 2.1.183 `CWn`@581300).
>
> **Bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> Stable anchors used: `"eager_input_streaming"`, `"input_schema"`, `"tengu_fgts"`, `"eagerInputStreaming"`.

---

## Symbol Map (2.1.183 obf → readable)

| Readable | 2.1.183 obf | Line(s) | Kind | Scaffold (2.1.156) |
|----------|-------------|---------|------|--------------------|
| `buildToolSchema` | `CWn` | 581300-581356 | function (async) | `w08` |
| `resolveToolDescription` | `z_f` | 581287-581299 | function (async) | (prompt/desc resolver) |
| `getModelCaps` (id→caps record by firstParty match) | `G_f` | 581273-581275 | function | `jLz` |
| `MODEL_CAPS` table | `Ed` | 95158-95173 | object | `j3` |
| `opus48Caps` | `aTr` | 95128-95137 | object | `Xi$` |
| `opus47Caps` | `iTr` | 95118-95127 | object | `Ji$` |
| `getAPIProvider` | `Ir` | 95194-95206 | function | `Zq` |
| `isFirstPartyAnthropicBaseUrl` | `Pu` | 95241-95244 | function | `Rz` |
| `firstPartyBaseUrlIsAnthropic` (host check) | `Qln`/`V7e` | 95245-95254 | function | — |
| `isLeanSystemPrompt` | `Dg` | 134268-134273 | function (memoized via `wn`) | `X3` |
| `getToolSchemaCache` | `Dti` | 134775-134777 (Map=`Lti`) | function | `qyK` |
| `clearToolSchemaCache` | `dme` | 134778-134780 | function | — |
| `hashInputJSONSchema` (JSON.stringify, WeakMap-memoized) | `Y_f` | 581361-581365 | function | — |
| `JSON.stringify` (instrumented) | `Re` | 9461-9464 | function | — |
| `parseBoolTrue` | `st` | 163-168 | function | `xH` |
| `parseBoolFalse` | `yl` | 169-174 | function | `k4` |
| `zodToJsonSchema` (memoized) | `DLe` | 462188-462193 | function | — |
| `modelSupportsStructuredOutputs` (strict gate) | `GNe` | 134521-134527 | function | `OVH` |
| `experimentalBetasDisabled` | `jNe` | 134594-134596 | function | — |
| `warnBetasStrippedOnce` | `K_f` (flag `YOl`) | 581357-581360 | function | — |
| `stripAgentTeamProps` | `V_f`/`q_f` | 581276-581286 | function | — |
| `AGENT_TEAM_STRIP_TABLE` | `W_f` | 581683 | object | — |
| `agentTeamsEnabled` | `Sl` | 293831-293835 | function | — |
| `normalizeModelId` | `Bo` | 102895-102902 | function | — |
| `askUserQuestionTool` | `sut` | 391450-… | object | `YtH` |
| `ASK_USER_QUESTION_RESERVATION_PROMPT` | `f1i` | 221321-221323 | const | `FUK` |
| `ASK_USER_QUESTION_BASE_PROMPT` | `f5r` | 221346-221354 | const | `xM6` |
| `ASK_USER_QUESTION_DESCRIPTION` | `d1i` | 221317-221318 | const | `pUK` |
| `ASK_USER_QUESTION_PREVIEW_NOTES` | `p1i` | 221325-221345 | object | — |
| `simpleSystemPromptMode` (`CLAUDE_CODE_SIMPLE`) | `n0o` | 580858-580860 | function | — |

---

## 1. `buildToolSchema` (`CWn`) — the wire-object serializer

**Location:** `cli_inner_pretty.js:581300-581356`
**Anchored on:** `"eager_input_streaming"` (lines 581329, 581337), `"input_schema"` (581317, 581335, 581350), `"tengu_fgts"` (581324).

Verbatim source (581300-581356):

```javascript
async function CWn(e, t) {
  let n = Ir(),                                   // n = provider: firstParty|vertex|bedrock|...
    r = t.model ? G_f(t.model) : void 0,          // r = caps record for the model (or undefined)
    o = Dg(t.model) ? "L:" : "",                  // o = lean cache-key tag
    s =
      (n === "vertex" && r?.eagerInputStreaming?.vertex) || (n === "bedrock" && r?.eagerInputStreaming?.bedrock)
        ? "F:"                                     // s = stream cache-key tag
        : "",
    i = "",
    a = o + s + "" + ("inputJSONSchema" in e && e.inputJSONSchema ? `${e.name}:${Y_f(e.inputJSONSchema)}` : e.name),
                                                   // a = CACHE KEY = "L:"?+"F:"?+ name (or name:hash(rawSchema))
    l = Dti(),                                     // l = tool-schema cache Map
    c = l.get(a);
  if (!c) {
    let d = ct("tengu_tool_pear", !1),            // d = structured-outputs / strict gate flag
      f = "inputJSONSchema" in e && e.inputJSONSchema ? e.inputJSONSchema : DLe(e.inputSchema);
                                                   // f = JSON schema: raw inputJSONSchema, else zodToJsonSchema(inputSchema)
    if (!Sl()) f = V_f(e.name, f);                // strip agent-team props when agent-teams OFF
    if (
      ((c = { name: e.name, description: await z_f(e, t), input_schema: f }),
      d && e.strict === !0 && t.model && GNe(t.model))
    )
      c.strict = !0;                              // strict only if pear gate + tool opt-in + model supports
    let m = process.env.CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING;
    if (
      !yl(m) &&                                   // EXPLICIT-OFF KILL: env not falsy ("0/false/no/off")
      ((n === "firstParty" && Pu() && ct("tengu_fgts", !1)) ||                                    // (1) firstParty + anthropic base-url + gate
        (n === "vertex" && !process.env.ANTHROPIC_VERTEX_BASE_URL && r?.eagerInputStreaming?.vertex) ||   // (2) vertex + no custom base-url + per-model cap
        (n === "bedrock" && !process.env.ANTHROPIC_BEDROCK_BASE_URL && r?.eagerInputStreaming?.bedrock) || // (3) bedrock + no custom base-url + per-model cap
        st(m))                                    // (4) env FORCE (truthy "1/true/yes/on")
    )
      c.eager_input_streaming = !0;
    l.set(a, c);                                  // cache the {name, description, input_schema, strict?, eager?} record
  }
  let u = {
    name: c.name,
    description: c.description,
    input_schema: c.input_schema,
    ...(c.strict && { strict: !0 }),
    ...(c.eager_input_streaming && { eager_input_streaming: !0 }),
  };
  if (t.deferLoading) u.defer_loading = !0;       // tool-search deferral
  if (t.cacheControl) u.cache_control = t.cacheControl;
  if (jNe()) {                                    // experimental betas disabled → strip non-baseline keys
    let d = new Set(["name", "description", "input_schema", "cache_control"]),
      p = Object.keys(u).filter((f) => !d.has(f));
    if (p.length > 0)
      return (
        K_f(p),                                   // warn-once: "[betas] Stripped from tool schemas: [...]"
        {
          name: u.name,
          description: u.description,
          input_schema: u.input_schema,
          ...(u.cache_control && { cache_control: u.cache_control }),
        }
      );
  }
  return u;
}
```

### Wire object shape (final return)
- Baseline (always): `name`, `description`, `input_schema`.
- Conditional: `strict: true`, `eager_input_streaming: true`, `defer_loading: true`, `cache_control: <ctl>`.
- When `experimentalBetasDisabled()` (`jNe`) is true, **everything except** `name | description | input_schema | cache_control` is stripped and a one-time warning is logged: `[betas] Stripped from tool schemas: [<keys>] (experimental betas disabled)` (581359). `eager_input_streaming` and `strict` are experimental betas and get dropped here.

**Confidence: HIGH** — the four-way OR + kill switch, the cache, and the three baseline keys all converge on this single decl; anchored on three independent stable strings.

---

## 2. The four-way `eager_input_streaming` gate (581321-581329)

**Structure:** `!parseBoolFalse(ENV) && ( (1)||(2)||(3)||(4) )` → `c.eager_input_streaming = true`.

**ENV kill (explicit-off), 581323:** `let m = process.env.CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING; if (!yl(m) && (...))`.
`yl` (`parseBoolFalse`, 169-174) returns true for `"0" | "false" | "no" | "off"` (and `false`). So if the env var is **explicitly falsy**, the whole gate short-circuits to OFF regardless of provider/caps. This is the "explicit-off env kill" bracket.

The four branches (581324-581327):
1. **firstParty + base-url + gate:** `n === "firstParty" && Pu() && ct("tengu_fgts", !1)`
   - `Pu` (`isFirstPartyAnthropicBaseUrl`, 95241-95244) = `_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL` OR (`ANTHROPIC_BASE_URL` unset OR host ∈ `["api.anthropic.com"]`, via `Qln`/`V7e` 95245-95254).
   - `ct("tengu_fgts", !1)` = feature gate, default **false**.
2. **vertex + no custom base-url + per-model cap:** `n === "vertex" && !process.env.ANTHROPIC_VERTEX_BASE_URL && r?.eagerInputStreaming?.vertex`.
3. **bedrock + no custom base-url + per-model cap:** `n === "bedrock" && !process.env.ANTHROPIC_BEDROCK_BASE_URL && r?.eagerInputStreaming?.bedrock`.
4. **env force:** `st(m)` — `parseBoolTrue` (163-168) true for `"1" | "true" | "yes" | "on"`. Forces eager streaming on **any** provider, bypassing caps/gate (but still subject to the `!yl(m)` outer guard, which is trivially satisfied when `m` is truthy).

**Note on vertex/bedrock base-url guards:** the *gate* uses the **negated** custom-base-url check (`!process.env.ANTHROPIC_VERTEX_BASE_URL` / `!...BEDROCK_BASE_URL`) — i.e. eager streaming is only auto-enabled against the *standard* Vertex/Bedrock endpoints, not custom proxies. The *cache-key* `"F:"` tag computation (581304-581307) does **not** include these base-url guards — it only checks provider + per-model cap. This is a deliberate asymmetry: the cache key conservatively tags any caps-eligible vertex/bedrock model with `"F:"`, but the actual flag may still be withheld if a custom base-url is set. (Minor cache-key over-segmentation, not a correctness bug.)

**`ENV` var name string:** `CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING` (581321) — scaffold `FGTS_ENV`.
**Gate key string:** `"tengu_fgts"` (581324, default `!1`).

**Confidence: HIGH.**

---

## 3. Per-model `eagerInputStreaming` capability records

**Anchored on:** `"eagerInputStreaming"` (10 hits, lines 95039-95156).
**Table:** `Ed` = `MODEL_CAPS`, defined 95158-95173; `G_f` (`getModelCaps`) looks up by normalized firstParty id via `KOl` Map (581273-581275, keyed by `Bo(record.firstParty)`).

Records carrying `eagerInputStreaming` (verbatim from bundle):

| Model key | obf | firstParty id | `eagerInputStreaming` value | Line |
|-----------|-----|---------------|------------------------------|------|
| haiku35 | `Jvr` | `claude-3-5-haiku-20241022` | `{ vertex: !0 }` | 95039 |
| sonnet40 | `Zvr` | `claude-sonnet-4-20250514` | `{ vertex: !0 }` | 95058 |
| sonnet45 | `eTr` | `claude-sonnet-4-5-20250929` | `{ vertex: !0 }` | 95068 |
| sonnet46 | `tTr` | `claude-sonnet-4-6` | `{ bedrock: !0, vertex: !0 }` | 95078 |
| opus45 | `oTr` | `claude-opus-4-5-20251101` | `{ vertex: !0 }` | 95106 |
| opus46 | `sTr` | `claude-opus-4-6` | `{ vertex: !0 }` | 95116 |
| **opus47** | `iTr` | `claude-opus-4-7` | `{ bedrock: !0, vertex: !0 }` | 95126 |
| **opus48** | `aTr` | `claude-opus-4-8` | `{ bedrock: !0, vertex: !0 }` | 95136 |
| fable5 | `MHe` | `claude-fable-5` | `{ bedrock: !0, vertex: !0 }` | 95146 |
| mythos5 | `aMs` | `claude-mythos-5` | `{ bedrock: !0, vertex: !0 }` | 95156 |

Models **without** the field (no eager streaming on vertex/bedrock): haiku45 (`Qvr`), sonnet35 (`Xvr`), sonnet37 (`Yvr`), opus40 (`nTr`), opus41 (`rTr`).

**MODEL_CAPS index (95158-95173):** `Ed = { haiku35: Jvr, haiku45: Qvr, sonnet35: Xvr, sonnet37: Yvr, sonnet40: Zvr, sonnet45: eTr, sonnet46: tTr, opus40: nTr, opus41: rTr, opus45: oTr, opus46: sTr, opus47: iTr, opus48: aTr, fable5: MHe }`. (Note: `mythos5`/`aMs` defined at 95148 but is **not** in the `Ed` index object — present as a standalone record but unreferenced by `Ed`.)

**Caps-record shape:** `{ firstParty, bedrock, vertex, foundry, anthropicAws, mantle, gateway, eagerInputStreaming? }`.

**`getModelCaps` (`G_f`, 581273-581275):**
```javascript
function G_f(e) {
  return ((KOl ??= new Map(Object.values(Ed).map((t) => [Bo(t.firstParty), t]))), KOl.get(Bo(e)));
}
```
Lazily builds a `Map<normalizedFirstPartyId, capsRecord>` (`KOl`) and looks up the (normalized via `Bo`) input model id. Returns `undefined` for unknown models → `r?.eagerInputStreaming?.…` is then `undefined` → eager streaming auto-branches are skipped.

**Confidence: HIGH.** opus47=`iTr` and opus48=`aTr` both `{ bedrock:true, vertex:true }`, matching scaffold `Ji$`/`Xi$`.

---

## 4. Tool-schema cache + cache-key tags

**Cache:** `Dti` (`getToolSchemaCache`, 134775-134777) returns module-singleton `Lti` (a `Map`, initialized `new Map()` at 134783). `dme` (134778-134780) clears it. Session-stable, never auto-evicted.

**Cache key construction (`a`, 581308-581309):**
```javascript
a = o + s + "" + ("inputJSONSchema" in e && e.inputJSONSchema ? `${e.name}:${Y_f(e.inputJSONSchema)}` : e.name)
```
- `o` (581303) = `Dg(t.model) ? "L:" : ""` — **`"L:"` lean tag** when the model is on the lean/simple system-prompt set (`isLeanSystemPrompt` = `Dg`).
- `s` (581304-581307) = `"F:"` **stream tag** when `(provider==="vertex" && caps.eagerInputStreaming.vertex) || (provider==="bedrock" && caps.eagerInputStreaming.bedrock)`; else `""`.
- name part: tools with a raw `inputJSONSchema` key key off `` `${name}:${hash}` `` where `hash = Y_f(inputJSONSchema)` (JSON.stringify, WeakMap-memoized in `XOl`); all other tools key off bare `name`.

So a key looks like e.g. `"L:F:Read"`, `"F:Bash"`, `"Read"`, or `"L:McpTool:{...json...}"`. The lean/stream tags ensure the **same tool** produces distinct cached wire-objects per (lean-prompt, eager-streaming) combination, because both `description` (lean affects `z_f`) and `eager_input_streaming` differ.

**`Y_f` (hashInputJSONSchema, 581361-581365):**
```javascript
function Y_f(e) {
  let t = XOl.get(e);
  if (t === void 0) ((t = Re(e)), XOl.set(e, t));   // Re = JSON.stringify (9461)
  return t;
}
```

**Confidence: HIGH.** Anchored on the literal `"L:"`/`"F:"` tag strings at 581303/581306.

---

## 5. Per-tool `description` resolution + AskUserQuestion reservation hook

### 5a. `resolveToolDescription` (`z_f`, 581287-581299)
Called as `await z_f(e, t)` at 581317 to fill `description`.
```javascript
async function z_f(e, t) {
  if (!n0o()) return e.prompt(t);            // not CLAUDE_CODE_SIMPLE → full prompt(model)
  if (e.searchHint) return e.searchHint;     // SIMPLE mode + tool has a searchHint → use the one-liner
  let n = await e.prompt(t);                  // SIMPLE mode, no searchHint → prompt then collapse to first paragraph
  return Di(n, "\n\n").trim() || n;
}
```
- `n0o` (`simpleSystemPromptMode`, 580858-580860) = `Ge.CLAUDE_CODE_SIMPLE`. When set, descriptions collapse to the tool's `searchHint` (e.g. `"prompt the user with a multiple-choice question"`, `"create or overwrite files"`, `"search file contents with regex (ripgrep)"`) or, if no hint, to the first paragraph of the full prompt. This is a token-saving path orthogonal to the lean-prompt (`Dg`) path used inside each tool's own `prompt()`.
- The default path (`!n0o()`) calls `e.prompt(t)` where `t = { model, deferLoading, cacheControl, ... }` — so each tool's `prompt({ model })` hook is where lean-prompt branching happens.

### 5b. AskUserQuestion tool (`sut`) and the reservation hook
**Tool object `sut`** starts at 391450 (`name: Ff`, `Ff = "AskUserQuestion"` @221315). Its `prompt({model})` (391457-391470):
```javascript
async prompt({ model: e }) {
  let t = "";
  if (Dg(e)) {                                       // lean/simple-system-prompt model (scaffold X3)
    let r = ct("tengu_cinder_plover", "").trim();     // optional GB override of the reservation text
    t = r ? `\n${r}\n` : f1i;                          // else default reservation paragraph f1i (scaffold FUK)
  }
  let n = FKt();
  if (n === void 0) return f5r + t;                    // base prompt + (reservation if lean)
  return f5r + t + p1i[n];                             // + markdown/html preview notes
}
```
- **Gate:** `Dg(e)` = `isLeanSystemPrompt` (134268-134273). When the model is **lean** (e.g. opus48), the reservation paragraph is appended; non-lean models get the bare base prompt.
- **Override:** feature gate `"tengu_cinder_plover"` (391460, default `""`) can replace the reservation text; empty → falls back to the hard-coded `f1i`.
- **Description:** `async description() { return d1i; }` (391454-391456) → `d1i` (221317-221318): *"Asks the user multiple choice questions to gather information, clarify ambiguity, understand preferences, make decisions or offer them choices."*

**Reservation text `f1i` (221321-221323, scaffold `FUK`), verbatim:**
```
Reserve this for decisions where the user's answer changes what you do next — not for choices with a conventional default or facts you can verify in the codebase yourself. In those cases pick the obvious option, mention it in your response, and proceed.
```
(Full reservation/usage text is also in `assets/tools/AskUserQuestion.md`.)

**Base prompt `f5r` (221346-221354), verbatim head:**
```
Use this tool only when you are blocked on a decision that is genuinely the user's to make: one you cannot resolve from the request, the code, or sensible defaults.

Usage notes:
- Users will always be able to select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers to be selected for a question
- If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label

Plan mode note: To switch into plan mode, use ${A7} (not this tool). ...
```

**Confidence: HIGH** for the call site + gate (`Dg`) + override (`tengu_cinder_plover`); the reservation TEXT matches scaffold `FUK` semantics.

---

## 6. `strict` (structured-outputs) gate — secondary

`strict: true` is added (581318-581320) only when **all** hold: `ct("tengu_tool_pear", !1)` is on (the structured-outputs gate, default false), the tool itself opts in (`e.strict === true`), and the model supports it (`GNe(t.model)`).

**`GNe` (modelSupportsStructuredOutputs, 134521-134527):**
```javascript
function GNe(e) {
  let t = Bo(e), n = _y(e);
  if (!lO(n)) return !1;                          // provider must have first-party capabilities
  if (t.includes("claude-3-") || t === "claude-opus-4-0" || t === "claude-sonnet-4-0") return !1;
  return !0;
}
```

`strict` is also an experimental beta, so `jNe()` strips it when betas are disabled.

---

## 7. Agent-team property stripping (`V_f`/`q_f`/`W_f`) — context

When agent-teams are **off** (`!Sl()`, 581315) the JSON schema has team-only properties deleted before caching:
```javascript
function q_f(e, t) {                              // delete keys `t` from schema `e.properties`
  if (t.length === 0) return e;
  let n = e.properties;
  if (!n || typeof n !== "object") return e;
  let r = { ...n };
  for (let o of t) delete r[o];
  return { ...e, properties: r };
}
function V_f(e, t) { return q_f(t, W_f[e] ?? []); }  // e=tool name, t=schema
```
**`W_f` (581683):** `{ [WM]: ["launchSwarm", "teammateCount"], [vs]: ["name", "team_name", "mode"] }`
- `WM = "ExitPlanMode"` (152253) → strips `launchSwarm`, `teammateCount`.
- `vs = "Agent"` (149939) → strips `name`, `team_name`, `mode`.

**`Sl` (agentTeamsEnabled, 293831-293835):** `(CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS truthy OR --agent-teams argv) AND ct("tengu_amber_flint", !0)`.

---

## "New vs 2.1.156" notes (before-picture 0-count greps)

Before-picture bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`.
- `eager_input_streaming`: 2.1.156 = **2** hits, 2.1.183 = **3** hits — the *mechanism* is a carryover from 2.1.156; not new.
- `tengu_tool_pear`: present in both (2.1.156 = 2, 2.1.183 = 2) — strict/structured-outputs gate is a carryover.
- `tengu_cinder_plover`: present in both (2.1.156 = 1, 2.1.183 = 1) — AskUserQuestion reservation override is a 2.1.156-era carryover.
- `defer_loading`: present in both — tool-search deferral is a carryover.
- **2.1.183-specific in this path:** the agent-team property-stripping table `W_f` (`{ launchSwarm, teammateCount, name, team_name, mode }`) — tied to the 2.1.183 agent-teams redesign (`Sl`/`tengu_amber_flint`); the `claude-opus-4-8` / `claude-fable-5` / `claude-mythos-5` caps records carrying `eagerInputStreaming` are new model entries. (The serialization *algorithm* itself — cache key tags, four-way gate, betas-strip — is structurally identical to 2.1.156; only the obf ids and the model table grew.)

---

## Open questions / caveats
1. The cache-key `"F:"` tag (581304-581307) omits the `!ANTHROPIC_VERTEX_BASE_URL` / `!ANTHROPIC_BEDROCK_BASE_URL` guards that the actual eager-streaming gate (581325-581326) enforces. With a custom Vertex/Bedrock base-url + caps-eligible model, the key would carry `"F:"` but the cached object would *not* set `eager_input_streaming`. Harmless (over-segmentation) but worth flagging for a reconstructor that wants byte-identical keys.
2. `mythos5` (`aMs`, 95148-95157) carries `eagerInputStreaming` but is **not** in the `Ed` (`MODEL_CAPS`) index object (95158-95173), so `getModelCaps` cannot return it via the firstParty-id map — confirm whether mythos5 is reachable through another caps path or is currently dead.
3. `FKt()` (the preview-note selector in `sut.prompt`, 391467) was not chased to its definition — it returns `undefined | "markdown" | "html"` keying into `p1i`. Not load-bearing for schema serialization.
