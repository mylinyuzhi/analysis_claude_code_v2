# `<system-reminder>` PRIMITIVES + PIPELINE — 2.1.183 Anchor Dossier

> **Bundle (sole source of truth)**: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). Every line number below was Read-verified against THIS bundle.
> **Scaffold (logic map only, NOT obf ids/lines)**: `claude_code_v_2.1.156/analyze/41_system_reminder/README.md`.
> **Before-picture (0-count "is this new" greps)**: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`.
>
> **Re-mangle note**: every obf id changed between 2.1.156 and 2.1.183 and lines shifted ~+50K (e.g. `kc6`→`PWn`, `Aw4`→`ctl`, `S0`→`TI`). The 2.1.156 names in parentheses below are the READABLE names carried over from the scaffold, NOT 2.1.183 obf ids. `grep -c '<system-reminder>'` on the 2.1.183 bundle = **40** (was 36 in 2.1.156).

---

## 0. Symbol crosswalk (2.1.156 readable → 2.1.183 obf id → line)

| Readable name | 2.1.156 obf | **2.1.183 obf** | **2.1.183 line(s)** | kind |
|---|---|---|---|---|
| wrapInSystemReminder | S0 | **`TI`** | 589004-589008 | function |
| wrapMessagesInSystemReminder | C_ | **`Jp`** | 589078-589091 | function |
| ensureSystemReminderWrap | DQ_ | **`bSf`** | 588027-588039 | function |
| wrapMemoryAgeReminder (single-line) | Az7 | **`xOi`** | 220203-220208 | function |
| memoryAgeReminderText (content) | — | **`YWr`** | 220194-220201 | function |
| extractSystemReminderContent (returns-original) | fi6 | **`q0o`** | 589021-589024 | function |
| extractSystemReminderContent (history, returns-null) | JN6 | **`oKr`** | 277246-277248 | function |
| stripLeadingReminders | PG4 | **`Rbl`** | 587389-587397 | function |
| stripLeadingReminders (guarded variant, NEW) | — | **`ePo`** | 606156-606165 | function |
| stripAllReminders (regex→space) | OD9 | **`_Ql`** | 661920-661922 | function |
| SYSTEM_REMINDER_CLOSE const | Nm4 | **`fyl`** | 518148 | constant |
| (index-loop strip using SYSTEM_REMINDER_CLOSE) | — | inside **`Aef`** | 518039 (loop 518094-518101) | function |
| smooshSystemReminderSiblings | hG4 | **`WNl`** | 588040-588059 | function |
| smooshIntoToolResult (declines on tool_reference) | Ai6 | **`G0o`** | 588506-588536 | function |
| isToolReferenceBlock | $s | **`rne`** | 462304-462306 | function |
| mergeUserMessagesAndToolResults (driver) | VQ_ | **`Cx`** | 588170-588373 | function |
| mergeAdjacentUserMessages | — | **`KNl`** | 588434-588449 | function |
| collectAttachments | Aw4 | **`ctl`** | 464606-464692 | function |
| runAttachmentGenerator | E3 | **`BA`** | 464693-464715 | function |
| getQueuedCommandAttachments | gV$ | **`oGt`** | 464716-464751 | function |
| normalizeAttachmentForAPI (dispatcher) | kc6 | **`PWn`** | 589204-589607 | function |
| PER_TYPE_RENDERERS (map) | DG4 | **`ONl`** | 590431-590642 | object |
| createUserMessage (factory, isMeta) | T8 | **`Rn`** | 587504-587543 | function |
| AMBIENT_CONTEXT_TRAILER | yT8 | **`_7n`** | 590353-590354 | constant |
| EMPTY_CONTENT_PLACEHOLDER ("(no content)") | — | **`Dw`** | 148106 | constant |
| TODO_REMINDER_CONFIG | QV$ | **`rGt`** | 466059 | object |
| PLAN_MODE_ATTACHMENT_CONFIG | lg6 | **`Hho`** | 466060 | object |
| ULTRA_EFFORT_CONFIG | Kw4 | **`itl`** | 466061 | object |
| RELEVANT_MEMORIES_CONFIG | _w4 | **`atl`** | 466062 | object |
| VERIFY_PLAN_REMINDER_CONFIG | zw4 | **`ltl`** | 466063 | object |
| queuedModesSet ({"prompt","task-notification"}) | — | **`J3p`** | 466064 | constant |
| agentTeamGate (R7 analog) | R7 | **`Sl`** | 293831-293835 | function |
| statsigGate (ct/feature flag fn) | — | **`ct`** | 146595 | function |
| agent_listing_delta generator | — | **`TLe`** | 464916 | function |

---

## 1. The wrap primitives (4 wrap)

### 1.1 `wrapInSystemReminder` (S0) → `TI` @ 589004-589008

The canonical MULTILINE envelope — newline BEFORE and AFTER content. Byte-identical to 2.1.156 `S0`.

```javascript
// ORIGINAL (cli_inner_pretty.js:589004-589008):
function TI(e) {
  return `<system-reminder>
${e}
</system-reminder>`;
}
```

Verbatim shape: `<system-reminder>\n${e}\n</system-reminder>`. **Anchor**: only multiline `return \`<system-reminder>` at 589005 (the other backtick `<system-reminder>` hits are 220206 = single-line memory variant, 367815 = container-restart literal). Confidence: **HIGH**.

### 1.2 `wrapMessagesInSystemReminder` (C_) → `Jp` @ 589078-589091

List helper; wraps each string-content / text-block via `TI`, passes image/document/tool_use untouched. THE helper nearly every dispatcher case calls (as `Jp([Rn({content, isMeta:!0})])`).

```javascript
// ORIGINAL (cli_inner_pretty.js:589078-589091):
function Jp(e) {
  return e.map((t) => {
    if (typeof t.message.content === "string")
      return { ...t, message: { ...t.message, content: TI(t.message.content) } };
    else if (Array.isArray(t.message.content)) {
      let n = t.message.content.map((r) => {
        if (r.type === "text") return { ...r, text: TI(r.text) };
        return r;
      });
      return { ...t, message: { ...t.message, content: n } };
    }
    return t;
  });
}
```

Byte-identical structure to 2.1.156 `C_`. Confidence: **HIGH**.

### 1.3 `ensureSystemReminderWrap` (DQ_) → `bSf` @ 588027-588039

Idempotent, identity-preserving final-pass re-wrap. Skips text already starting with `<system-reminder>`; returns the SAME object when nothing changed (the `n` changed-flag). Byte-identical to 2.1.156 `DQ_`.

```javascript
// ORIGINAL (cli_inner_pretty.js:588027-588039):
function bSf(e) {
  let t = e.message.content;
  if (typeof t === "string") {
    if (t.startsWith("<system-reminder>")) return e;
    return { ...e, message: { ...e.message, content: TI(t) } };
  }
  let n = !1,
    r = t.map((o) => {
      if (o.type === "text" && !o.text.startsWith("<system-reminder>")) return ((n = !0), { ...o, text: TI(o.text) });
      return o;
    });
  return n ? { ...e, message: { ...e.message, content: r } } : e;
}
```

**Anchor**: `if (t.startsWith("<system-reminder>")) return e;` at 588030 (the only string-content early-return-identity check). Called from the merge driver `Cx` at 588352: `let R = ct("tengu_chair_sermon", !1) ? L.map(bSf) : L`. Confidence: **HIGH**.

### 1.4 `wrapMemoryAgeReminder` (Az7) → `xOi` @ 220203-220208 (SINGLE-LINE variant)

The single-line `<system-reminder>${text}</system-reminder>\n` form (NO internal newlines), wrap-only (does NOT extract). Returns `""` when the age content is empty.

```javascript
// ORIGINAL (cli_inner_pretty.js:220203-220208):
function xOi(e) {
  let t = YWr(e);
  if (!t) return "";
  return `<system-reminder>${t}</system-reminder>
`;
}
```

Its content source `YWr` (220194-220201) — the staleness marker, fired only when age > 1 day:

```javascript
// ORIGINAL (cli_inner_pretty.js:220194-220201):
function YWr(e) {
  let t = EHd(e);             // EHd @220191 = age in whole days
  if (t <= 1) return "";
  return (
    `This memory is ${t} days old. ` +
    "Memories are point-in-time observations, not live state — " +
    "claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."
  );
}
```

VERBATIM staleness string @ 220198-220200:
> `"This memory is ${t} days old. Memories are point-in-time observations, not live state — claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."`

`EHd` (220191-220193): `Math.max(0, Math.floor((Date.now() - e) / 86400000))`. Only caller of `xOi` is at 463115 (`return xOi(t);`). **Anchor**: single-line `return \`<system-reminder>${t}</system-reminder>` at 220206. Confidence: **HIGH**.

---

## 2. The extract primitives (2 extract — identical regex, different no-match convention)

Both use the EXACT same anchored regex (verbatim, verified at two sites):

```
/^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/
```

The `^…$` anchors enforce "whole string"; the optional `\n?` on both sides tolerates both the multiline `TI` form and the single-line `xOi` memory form.

### 2.1 `extractSystemReminderContent` returns-ORIGINAL (fi6) → `q0o` @ 589021-589024

```javascript
// ORIGINAL (cli_inner_pretty.js:589021-589024):
function q0o(e) {
  let t = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(e);
  return t ? t[1] : e;
}
```

Returns the inner content, or the ORIGINAL string when not wholly wrapped. Used by `FSf` (589025, MCP-result reminder dedup) and the per-block smoosh extractor at 589071. **Anchor**: regex literal at 589022. Confidence: **HIGH**.

### 2.2 `extractSystemReminderContent` history-format, returns-NULL (JN6) → `oKr` @ 277246-277248

```javascript
// ORIGINAL (cli_inner_pretty.js:277246-277248):
function oKr(e) {
  return /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(e.trim())?.[1]?.trim() || null;
}
```

Trims input AND output; returns `null` on no-match (the telemetry/history-format convention). **Anchor**: regex on `e.trim()` returning `|| null` at 277247. Confidence: **HIGH**.

---

## 3. The strip primitives

### 3.1 `stripLeadingReminders` (PG4) → `Rbl` @ 587389-587397

Repeatedly peel leading `<system-reminder>…</system-reminder>` blocks; `18` = `"</system-reminder>".length`. Unterminated tag → break. Byte-identical to 2.1.156 `PG4`. Always returns the stripped result.

```javascript
// ORIGINAL (cli_inner_pretty.js:587389-587397):
function Rbl(e) {
  let n = e.trimStart();
  while (n.startsWith("<system-reminder>")) {
    let r = n.indexOf("</system-reminder>");
    if (r < 0) break;
    n = n.slice(r + 18).trimStart();
  }
  return n;
}
```

Confidence: **HIGH**.

### 3.2 `stripLeadingReminders` GUARDED variant → `ePo` @ 606156-606165  ⚠️ **NEW in 2.1.183**

A second leading-strip that (a) early-returns the ORIGINAL `e` when the input does NOT start with a reminder, and (b) returns the ORIGINAL `e` (not `""`) when stripping leaves an empty string. Behaviour differs from `Rbl` precisely at those two edges.

```javascript
// ORIGINAL (cli_inner_pretty.js:606156-606165):
function ePo(e) {
  let r = e.trimStart();
  if (!r.startsWith("<system-reminder>")) return e;
  while (r.startsWith("<system-reminder>")) {
    let o = r.indexOf("</system-reminder>");
    if (o < 0) break;
    r = r.slice(o + 18).trimStart();
  }
  return r === "" ? e : r;
}
```

**Newness proof**: `grep -n 'if (!.*\.startsWith("<system-reminder>")) return' 2.1.156/cli_inner_pretty.js` → **0 matches**. This guard-then-fallback shape did not exist in 2.1.156. Confidence: **HIGH** (verified new).

### 3.3 `stripAllReminders` (OD9) → `_Ql` @ 661920-661922 — regex strip ANYWHERE → SPACE

```javascript
// ORIGINAL (cli_inner_pretty.js:661920-661922):
function _Ql(e) {
  return e.replace(/<(system-reminder|task-notification)>[\s\S]*?(<\/\1>|$)/g, " ");
}
```

VERBATIM regex @ 661921: `/<(system-reminder|task-notification)>[\s\S]*?(<\/\1>|$)/g` → `" "`. The `(<\/\1>|$)` lets an unterminated trailing tag be nuked too. Backreference `\1` matches either `system-reminder` or `task-notification`. Wrapped by `XF` @ 661923 (transcript-search/preview normaliser: `_Ql(...)` then `.replace(/<\/?[\w-]+>/g," ").replace(/\s+/g," ")`). Byte-identical to 2.1.156 `OD9`. Confidence: **HIGH**.

### 3.4 `SYSTEM_REMINDER_CLOSE` index-loop strip (Nm4) → const `fyl` @ 518148; loop inside `Aef` @ 518094-518101 — strip ANYWHERE → NOTHING (no space)

```javascript
// ORIGINAL const (cli_inner_pretty.js:518148):
var fyl = "</system-reminder>",
  myl,
  Ayl;

// ORIGINAL loop (cli_inner_pretty.js:518094-518101, inside function Aef @518039):
  let n = t,
    r = n.indexOf("<system-reminder>");
  while (r >= 0) {
    let o = n.indexOf(fyl, r);
    if (o < 0) break;
    ((n = n.slice(0, r) + n.slice(o + fyl.length)), (r = n.indexOf("<system-reminder>")));
  }
  return n;
```

Splices each `<system-reminder>…</system-reminder>` slice out WITHOUT inserting a space (`slice(0,r) + slice(o + fyl.length)`), repeated until no opener remains. This is the second strip-ANYWHERE form whose output differs from `_Ql` (nothing vs. space). The enclosing `Aef` (518039) builds a search/digest string per message type. Confidence: **HIGH**.

> Note: there is also a `lastIndexOf("</system-reminder>")` at 456268 (a separate single-tag locator, not the strip loop).

---

## 4. The smoosh / merge region (588040-588536)

### 4.1 `smooshSystemReminderSiblings` (hG4) → `WNl` @ 588040-588059

Partitions a user message's content into SR-prefixed text (`o`) vs. the rest (`s`), then folds the SR text INTO the last tool_result via `G0o`. Skips messages with no tool_result. If `G0o` returns `null` (declined), leaves the message untouched.

```javascript
// ORIGINAL (cli_inner_pretty.js:588040-588059):
function WNl(e) {
  return e.map((t) => {
    if (t.type !== "user") return t;
    let n = t.message.content;
    if (!Array.isArray(n)) return t;
    if (!n.some((u) => u.type === "tool_result")) return t;
    let o = [], s = [];
    for (let u of n)
      if (u.type === "text" && u.text.startsWith("<system-reminder>")) o.push(u);
      else s.push(u);
    if (o.length === 0) return t;
    let i = s.findLastIndex((u) => u.type === "tool_result"),
      a = s[i],
      l = G0o(a, o);
    if (l === null) return t;
    let c = [...s.slice(0, i), l, ...s.slice(i + 1)];
    return { ...t, message: { ...t.message, content: c } };
  });
}
```

Confidence: **HIGH**.

### 4.2 `smooshIntoToolResult` (Ai6) → `G0o` @ 588506-588536 — DECLINES on `tool_reference`

The actual fold. Returns `null` (declines) when the tool_result content array contains a `tool_reference` block (`n.some(rne)`). Otherwise merges text blocks, collapsing adjacent text with `\n\n`.

```javascript
// ORIGINAL (cli_inner_pretty.js:588506-588536):
function G0o(e, t) {
  if (t.length === 0) return e;
  let n = e.content;
  if (Array.isArray(n) && n.some(rne)) return null;     // ← tool_reference → decline
  if (e.is_error) {
    if (((t = t.filter((i) => i.type === "text")), t.length === 0)) return e;
  }
  if (t.every((i) => i.type === "text") && (n === void 0 || typeof n === "string")) {
    let i = [(n ?? "").trim(), ...t.map((a) => a.text.trim())].filter(Boolean).join("\n\n");
    return { ...e, content: i };
  }
  let o = n === void 0 ? [] : typeof n === "string" ? (n.trim() ? [{ type: "text", text: n.trim() }] : []) : [...n],
    s = [];
  for (let i of [...o, ...t])
    if (i.type === "text") {
      let a = i.text.trim();
      if (!a) continue;
      let l = s.at(-1);
      if (l?.type === "text") s[s.length - 1] = { ...l, text: `${l.text}\n\n${a}` };
      else s.push({ type: "text", text: a });
    } else s.push(i);
  return { ...e, content: s };
}
```

The decline predicate `rne` (462304-462306) = `isToolReferenceBlock` (`$s` analog):

```javascript
// ORIGINAL (cli_inner_pretty.js:462304-462306):
function rne(e) {
  return typeof e === "object" && e !== null && "type" in e && e.type === "tool_reference";
}
```

**Anchor**: `if (Array.isArray(n) && n.some(rne)) return null;` at 588509. Confidence: **HIGH**.

### 4.3 `mergeUserMessagesAndToolResults` (VQ_) → `Cx` @ 588170-588373 — gated by `tengu_chair_sermon`

The merge driver. The `tengu_chair_sermon` Statsig gate (default `!1` = OFF) appears at TWO sites in `Cx`:

- @ 588352: `let R = ct("tengu_chair_sermon", !1) ? L.map(bSf) : L,` — when ON, ensure-wrap every block before merging into the trailing user message.
- @ 588370: `else if (ct("tengu_chair_sermon", !1)) x = WNl(KNl(C));` — when ON (and not the `r` short-circuit branch), run smoosh-siblings over merged-adjacent-user output.

```javascript
// ORIGINAL (cli_inner_pretty.js:588352-588372, tail of Cx):
        let R = ct("tengu_chair_sermon", !1) ? L.map(bSf) : L,
          D = H4(A);                                    // H4 = last element
        if (D?.type === "user") {
          A[A.length - 1] = R.reduce((O, M) => CSf(O, M), D);   // CSf @588374 = merge two user msgs
          continue;
        }
        A.push(...R);
        continue;
      }
    }
  }
  y();
  let b = h4e(A), S = JSf(b), T = g4e(S), C = QSf(T), x;
  if (r) x = h ? xSf(C) : C;
  else if (ct("tengu_chair_sermon", !1)) x = WNl(KNl(C));
  else x = C;
  return SSf(x);
}
```

`KNl` (588434-588449) = `mergeAdjacentUserMessages` (folds back-to-back user messages via `b7n`). `SSf` (588060-588093) = a final pass normalising error-tool_result content arrays. Gate name `tengu_chair_sermon` is UNCHANGED from 2.1.156. Confidence: **HIGH**.

> Two additional `tengu_chair_sermon` references outside `Cx`: 588540 (`LSf` legacy string-only fold path) and 590146 (`WNl([S])[0]` per-message smoosh in another normaliser).

---

## 5. The attachment generator pool

### 5.1 `collectAttachments` (Aw4) → `ctl` @ 464606-464692

Per-turn parallel generator pool with master gate, 1s abort budget, main-agent-only flag, two waves.

```javascript
// ORIGINAL head (cli_inner_pretty.js:464606-464614):
async function ctl(e, t, n, r, o, s, i) {
  let a = ch(t.options.mainLoopModel);                                    // resolveModel
  if (st(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || Ge.CLAUDE_CODE_SIMPLE)
    return [...(await oGt(r, a)), ...TLe(t, o)];                          // ← MASTER GATE
  let l = Xl(),                                                          // makeAbortController
    c = setTimeout((_) => _.abort(), 1000, l),                           // ← 1s budget
    u = { ...t, abortController: l },
    d = !t.agentId,                                                      // ← isMainAgent
    p = e ? [ at_mentioned_files, mcp_resources, agent_mentions ] : [],  // mention wave
    ...
```

**MASTER GATE @ 464608**: `st(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || Ge.CLAUDE_CODE_SIMPLE`.
**1s ABORT BUDGET @ 464611**: `setTimeout((_) => _.abort(), 1000, l)`.
**MAIN-AGENT-ONLY FLAG @ 464613**: `d = !t.agentId`.

Wave `A` (ALWAYS-RUN, 464626-464661) — `BA("queued_commands"…)`, `date_change`, `ultrathink_effort`, `deferred_tools_delta`, `agent_listing_delta`, `mcp_instructions_delta`, `changed_files`, `nested_memory`, `dynamic_skill`, `skill_listing`, `plan_mode`, `plan_mode_exit`, `auto_mode`, `auto_mode_exit`, `todo_reminders`, conditional `tool_search_usage_reminder`, team gen pair `teammate_mailbox`+`team_context` (when `Sl()`), `agent_pending_messages`, `critical_system_reminder`, `total_tokens_reminder`.

Wave `g` (MAIN-AGENT-ONLY = `d`, 464662-464689) — when `Pw()` (workflow on): `workflow_keyword_request`, `ultra_effort_enter`; then `ide_selection`, `ide_opened_file`, `output_style`, `diagnostics`, `lsp_diagnostics`, `unified_tasks`, `async_hook_responses`, `memory_update`, `token_usage`, `budget_usd`, `output_token_usage`, `verify_plan_reminder`.

Final assembly @ 464690-464691:
```javascript
    [h, y] = await Promise.all([Promise.all(A), Promise.all(g)]);
  return (clearTimeout(c), [...f.flat(), ...h.flat(), ...y.flat()].filter((_) => _ !== void 0 && _ !== null));
```

> **⚠️ MASTER-GATE RETURN DELTA (2.1.156→2.1.183)**: 2.1.156 `Aw4` returned `gV$(K, Y)` (queued-command attachments ONLY) when the gate tripped. 2.1.183 `ctl` returns `[...(await oGt(r, a)), ...TLe(t, o)]` — queued commands PLUS `agent_listing_delta` (`TLe` @ 464916). So in headless/SDK/SIMPLE mode the agent-listing delta now still flows alongside queued commands. Verified: 2.1.156 line 412662 = `return gV$(K, Y);`.

Confidence: **HIGH**.

### 5.2 `runAttachmentGenerator` (E3) → `BA` @ 464693-464715

Per-generator try/catch + 5% timing telemetry (`tengu_attachment_compute_duration`). One generator failing ≠ whole set lost (catch returns `[]`).

```javascript
// ORIGINAL (cli_inner_pretty.js:464693-464715):
async function BA(e, t) {
  let n = Date.now();
  try {
    let r = await t(), o = Date.now() - n;
    if (Math.random() < 0.05) {
      let s = r.filter((i) => i !== void 0 && i !== null).reduce((i, a) => i + Re(a).length, 0);
      G("tengu_attachment_compute_duration", {
        label: e, duration_ms: o, attachment_size_bytes: s, attachment_count: r.length,
      });
    }
    return r;
  } catch (r) {
    let o = Date.now() - n;
    if (Math.random() < 0.05) G("tengu_attachment_compute_duration", { label: e, duration_ms: o, error: !0 });
    if (r instanceof gB) v(`Attachment image resize failed in ${e}: ${r.message}`, { level: "error" });
    else De(r);
    return (H3(`Attachment error in ${e}`, r), []);
  }
}
```

**Telemetry event** (verbatim): `tengu_attachment_compute_duration` @ 464700 (success path, fields `label`/`duration_ms`/`attachment_size_bytes`/`attachment_count`) and @ 464710 (error path, fields `label`/`duration_ms`/`error:!0`). Both gated by `Math.random() < 0.05` (5% sampling). Confidence: **HIGH**.

### 5.3 `getQueuedCommandAttachments` (gV$) → `oGt` @ 464716-464751

The ONLY queued-attachment generator surviving the master gate. Filters queued items by `J3p` modes, resolves pasted contents, emits `queued_command` attachment objects.

```javascript
// ORIGINAL head (cli_inner_pretty.js:464716-464718):
async function oGt(e, t) {
  if (!e) return [];
  let n = e.filter((r) => J3p.has(r.mode));            // J3p = {"prompt","task-notification"}
  ...
  // emits { type: "queued_command", prompt, source_uuid, imagePasteIds, fileAttachments, commandMode, origin, isMeta, ... }
}
```

`J3p` const @ 466064: `J3p = new Set(["prompt", "task-notification"]);` — the queued-modes allow-list. Confidence: **HIGH**.

---

## 6. The dispatcher + renderer map

### 6.1 `normalizeAttachmentForAPI` (kc6) → `PWn` @ 589204-589607 — 3-tier dispatcher

```javascript
// ORIGINAL skeleton (cli_inner_pretty.js:589204-589247, 589606):
function PWn(e) {
  if (Sl()) {                                          // TIER 1: agent-team early exit
    if (e.type === "teammate_mailbox") return [ Rn({ content: dSf().formatTeammateMessages(...), isMeta: !0 }) ];
    if (e.type === "team_context")   return [ Rn({ content: `<system-reminder>\n# Team Coordination\n…`, isMeta: !0 }) ];
  }
  if (e.type in ONl) return ONl[e.type](e);            // TIER 2: PER_TYPE_RENDERERS map
  switch (e.type) {                                    // TIER 3: inline switch
    case "file": …
    case "invoked_skills": …
    …
  }
  return (H3("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${e.type}`)), []);   // @589606
}
```

- **Tier 1** (589205-589245): `Sl()`-gated early exit for `teammate_mailbox` (589206) and `team_context` (589213). The `team_context` body is a verbatim multiline `<system-reminder>` literal at 589216-589241 (`# Team Coordination`, identity, team resources, `**Team Leader:** … "team-lead"`, the JSON message example, `**IMPORTANT:** Always refer to active teammates by their NAME`). This body is a CARRYOVER (present in 2.1.156).
- **Tier 2** (589246): `if (e.type in ONl) return ONl[e.type](e);` — `ONl` is the PER_TYPE_RENDERERS map.
- **Tier 3** (589247+): inline `switch(e.type)` for `file` (image/text/notebook/pdf subcases @ 589250), `invoked_skills` (589273), etc.
- **Unknown-type fallback** @ 589606: `H3("normalizeAttachmentForAPI", Error(\`Unknown attachment type: ${e.type}\`))`.

**The dispatcher function NAME anchor**: the verbatim error string `Unknown attachment type:` at 589606 (the dispatcher's catch-all) names itself `"normalizeAttachmentForAPI"` in the same call. The dispatcher is the function enclosing 589606 → `PWn` (starts 589204; next fn `g$l` starts 589608). Confidence: **HIGH**.

### 6.2 `PER_TYPE_RENDERERS` (DG4) → `ONl` @ 590431-590642 — per-type renderer map

A flat object literal keyed by attachment `type`, each value `(e) => UserMessage[]`. Spans 590431-590642. Cases present (Read-verified): `directory` (590432), `edited_text_file` (590437), `compact_file_reference` (590448), `pdf_reference` (590455), `selected_lines_in_ide` (590462), `opened_file_in_ide` (590479), `plan_file_reference` (590486), `nested_memory` (590499), `agent_mention` (590508), `skill_listing` (590515), `output_style` (590526), `critical_system_reminder` (590536), `plan_mode_exit` (590537), `auto_mode_exit` (590548), `token_usage` (590557), `total_tokens_reminder` (590560), `budget_usd` (590561), `output_token_usage` (590564), `hook_blocking_error` (590568), `hook_additional_context` (590576), `hook_stopped_continuation` (590588), `date_change` (590591), `ultrathink_effort` (590598), `workflow_keyword_request` (590606), `ultra_effort_enter` (590614), `ultra_effort_exit` (590624), then a NOOP allow-list (`() => []`) @ 590628-590641: `dynamic_skill`, `already_read_file`, `command_permissions`, `edited_image_file`, `hook_cancelled`, `hook_error_during_execution`, `hook_non_blocking_error`, `hook_system_message`, `hook_permission_decision`, `hook_deferred_tool`, `goal_status`, `structured_output`, `max_turns_reached`, `teammate_shutdown_batch`.

`ONl` is declared as a module-scope var @ 590351 and assigned in the module init block @ 590431. Selected verbatim strings:

- `token_usage` @ 590558: `TI(\`Token usage: ${e.used}/${e.total}; ${e.remaining} remaining\`)`
- `total_tokens_reminder` @ 590560: `[Rn({ content: TI(e.text), isMeta: !0 })]`  ⚠️ **NEW in 2.1.183** (0 in 2.1.156)
- `budget_usd` @ 590562: `TI(\`USD budget: $${e.used}/$${e.total}; $${e.remaining} remaining\`)`
- `output_token_usage` @ 590566: `TI(\`Output tokens — turn: ${t} · session: ${au(e.session)}\`)`
- `date_change` @ 590594: `"The date has changed. Today's date is now ${e.newDate}. DO NOT mention this to the user explicitly because they are already aware."`
- `ultrathink_effort` @ 590601-590602: `'The user included the keyword "ultrathink", requesting deeper reasoning on this turn. Reason as thoroughly as the task warrants.'`
- `workflow_keyword_request` @ 590609-590610: `'The user included the keyword "ultracode", opting this turn into multi-agent orchestration — use the Workflow tool to fulfill the request.'`
- `ultra_effort_enter` full @ 590619: `"Ultracode is on: optimize for the most exhaustive, correct answer — not the fastest or cheapest. Use the Workflow tool on every substantive task; token cost is not a constraint. See the Workflow tool's **Ultracode** section and quality patterns. Solo only on conversational/trivial turns."` / sparse @ 590620: `"Ultracode is still on — use the Workflow tool; see its Ultracode section."`
- `ultra_effort_exit` @ 590626: `"Ultracode is off — the Workflow tool's standard opt-in rule applies again."`

(`workflow_keyword_request`/`ultra_effort_*`/`team_context`/`teammate_mailbox` are CARRYOVERS from 2.1.156 — verified non-zero in the before-picture bundle.) Confidence: **HIGH**.

---

## 7. Message factory + ambient trailer + cadence configs

### 7.1 `createUserMessage` (T8) → `Rn` @ 587504-587543

The message factory carrying `isMeta` (and `isVisibleInTranscriptOnly`, `isVirtual`, etc.). Empty content falls back to `Dw`.

```javascript
// ORIGINAL head (cli_inner_pretty.js:587504-587527):
function Rn({ content: e, isMeta: t, isVisibleInTranscriptOnly: n, isVirtual: r, isCompactSummary: o,
  summarizeMetadata: s, toolUseResult: i, mcpMeta: a, uuid: l, timestamp: c, imagePasteIds: u,
  sourceToolAssistantUUID: d, permissionMode: p, origin: f, promptSource: m, interruptedMessageId: A,
  now: g, uuidFn: h }) {
  return {
    type: "user",
    message: { role: "user", content: e || Dw },        // ← Dw = "(no content)"
    isMeta: t,
    isVisibleInTranscriptOnly: n,
    …
  };
}
```

`Dw` @ 148106: `var Dw = "(no content)"` — the empty-content placeholder. **Anchor**: object factory returning `type:"user"` with `isMeta: t` and `content: e || Dw`. Confidence: **HIGH**.

### 7.2 `AMBIENT_CONTEXT_TRAILER` (yT8) → `_7n` @ 590353-590354

```javascript
// ORIGINAL (cli_inner_pretty.js:590353-590354):
  _7n =
    "This is ambient context — do not narrate it to the user unless they ask or it is directly relevant to their request.",
```

VERBATIM (unicode em-dash resolved):
> `"This is ambient context — do not narrate it to the user unless they ask or it is directly relevant to their request."`

A module-scope const (declared in same var-group as `RNl`/`ONl`/`KSf`). The hoisted "do not narrate" trailer appended to removed-branch reminders. **Anchor**: `grep 'This is ambient context'` = single hit @ 590354. Byte-identical to 2.1.156 `yT8`. Confidence: **HIGH**.

### 7.3 Cadence configs — all defined in one init block @ 466059-466063

```javascript
// ORIGINAL (cli_inner_pretty.js:466059-466063):
    (rGt = { TURNS_SINCE_WRITE: 10, TURNS_BETWEEN_REMINDERS: 10 }));
  ((Hho = { TURNS_BETWEEN_ATTACHMENTS: 5, FULL_REMINDER_EVERY_N_ATTACHMENTS: 5 }),
    (itl = { TURNS_BETWEEN_MAINTENANCE: 10 }),
    (atl = { MAX_SESSION_BYTES: 61440 }),
    (ltl = { TURNS_BETWEEN_REMINDERS: 10 }));
```

| Readable (2.1.156) | 2.1.183 obf | value | line | exported as (@464595-464599) |
|---|---|---|---|---|
| TODO_REMINDER_CONFIG (QV$) | `rGt` | `{TURNS_SINCE_WRITE:10, TURNS_BETWEEN_REMINDERS:10}` | 466059 | `TODO_REMINDER_CONFIG` |
| PLAN_MODE_ATTACHMENT_CONFIG (lg6) | `Hho` | `{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}` | 466060 | `PLAN_MODE_ATTACHMENT_CONFIG` |
| ULTRA_EFFORT_CONFIG (Kw4) | `itl` | `{TURNS_BETWEEN_MAINTENANCE:10}` | 466061 | `ULTRA_EFFORT_CONFIG` |
| RELEVANT_MEMORIES_CONFIG (_w4) | `atl` | `{MAX_SESSION_BYTES:61440}` | 466062 | `RELEVANT_MEMORIES_CONFIG` |
| VERIFY_PLAN_REMINDER_CONFIG (zw4) | `ltl` | `{TURNS_BETWEEN_REMINDERS:10}` | 466063 | `VERIFY_PLAN_REMINDER_CONFIG` |

Usage sites: `Hho.TURNS_BETWEEN_ATTACHMENTS` @ 464805, `Hho.FULL_REMINDER_EVERY_N_ATTACHMENTS` @ 464812, `itl.TURNS_BETWEEN_MAINTENANCE` @ 464898, `atl.MAX_SESSION_BYTES` @ 465370, `rGt.TURNS_SINCE_WRITE && rGt.TURNS_BETWEEN_REMINDERS` @ 465712 and 465749 (the dual-gate `&&` cadence on todo/task reminders). Values UNCHANGED from 2.1.156. Confidence: **HIGH**.

---

## 8. Supporting symbols (referenced by the primitives above)

- `Sl` @ 293831-293835 — agent-team gate (R7 analog): `st(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) || yqd()` AND Statsig `tengu_amber_flint` (default `!0`). Gates dispatcher Tier 1 and the team generator pair in wave A.
- `ct` @ 146595 — Statsig/feature-gate evaluation `ct(name, default)`. Used for `tengu_chair_sermon` (smoosh), `tengu_amber_flint` (teams), `tengu_soft_slate_nudge` (todo mode), `tengu_disable_keepalive_on_econnreset`.
- `TLe` @ 464916 — `agent_listing_delta` generator (now also emitted by the master-gate short-circuit).
- `KNl` @ 588434-588449 — mergeAdjacentUserMessages (folds back-to-back user msgs via `b7n`).
- `CSf` @ 588374 — merge two user messages (reduce target in `Cx`).
- `SSf` @ 588060-588093 — final error-tool_result content-array normaliser.
- `q0o`-using extractor `FSf` @ 589025 — MCP-result reminder dedup; the per-block smoosh extractor @ 589053+ (`USf`) joins extracted reminders with `\n`.

---

## 9. 2.1.156 → 2.1.183 DELTA SUMMARY

| # | Delta | Evidence |
|---|---|---|
| 1 | **NEW guarded leading-strip `ePo`** (606156): early-returns original if no leading reminder; returns original (not `""`) if strip empties the string. | 2.1.156 grep for the `if(!…startsWith) return` guard = **0**. |
| 2 | **NEW `total_tokens_reminder` renderer** in PER_TYPE_RENDERERS (590560). | 2.1.156 `grep -c total_tokens_reminder` = **0**. |
| 3 | **Master-gate return shape changed**: 2.1.156 `return gV$(K, Y)` (queued only) → 2.1.183 `return [...(await oGt(r, a)), ...TLe(t, o)]` (queued + agent_listing_delta). | 2.1.156 line 412662; 2.1.183 line 464608-464609. |
| 4 | `grep -c '<system-reminder>'` rose **36 → 40** (4 more literal occurrences). | Both bundles grepped. |
| 5 | Carryovers (NOT new, verified non-zero in 2.1.156): ambient trailer, container-restart reminder, team_context/teammate_mailbox, ultracode (`workflow_keyword_request`/`ultra_effort_*`), `output_token_usage`, `agent_pending_messages`. | 2.1.156 greps all > 0. |
| 6 | Core primitives (`TI`/`Jp`/`bSf`/`q0o`/`oKr`/`Rbl`/`_Ql`/`fyl` loop/`WNl`/`G0o`/`Cx`/`Rn`) are byte/structure-identical to 2.1.156 modulo re-mangling. Regexes and the `tengu_chair_sermon` gate name are unchanged. | Read-verified per section. |

---

## 10. Confidence

**Overall: HIGH.** Every obf id was re-derived by string-anchoring in the 2.1.183 bundle (regex literals, the `Unknown attachment type:` dispatcher error, the `tengu_chair_sermon`/`tengu_attachment_compute_duration` events, the `CLAUDE_CODE_DISABLE_ATTACHMENTS` gate, the verbatim reminder strings) and each cited line was Read. Cross-anchoring converges (e.g. `TI` is anchored by both its multiline-literal body AND its ~20 call-sites including the renderer map; `q0o`/`oKr` by the identical anchored regex; the cadence configs by both their value-literals AND their export aliases at 464595-464599). The three deltas in §9 were each verified with a 0-count / shape-diff grep against the 2.1.156 before-picture bundle.
