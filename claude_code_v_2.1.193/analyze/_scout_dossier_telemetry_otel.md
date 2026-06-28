# Scout Dossier — Telemetry / OTEL `assistant_response` event (v2.1.183 → v2.1.193)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, VERSION "2.1.193", build a1938d2a, 2026-06-25)
**Before-picture:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
**88 named ancestor:** `/lyz/codespace/3rd/claude-code/src/utils/telemetry/events.ts`

**Headline verdict:** CONFIRMED NET-NEW in this window. The `claude_code.assistant_response` OpenTelemetry **LOG** event, the `OTEL_LOG_ASSISTANT_RESPONSES` tri-state env var, and the response-redaction gate `dGi()` with its `?? OTEL_LOG_USER_PROMPTS` inheritance are all **0 occurrences in 2.1.183** and present in 2.1.193. This is a genuine upgrade-behavior gotcha: deployments that already set `OTEL_LOG_USER_PROMPTS=1` will, on upgrade, START emitting full assistant response text with no new configuration.

---

## 1. Hard evidence — grep diff (net-new proof)

| Token / string | 2.1.183 count | 2.1.193 count | Classification |
|----------------|---------------|---------------|----------------|
| `assistant_response` | 0 | 1 (@468662) | **NET-NEW** |
| `OTEL_LOG_ASSISTANT_RESPONSES` | 0 | 3 (@36266, @193053, getter) | **NET-NEW** |
| `?? Be.OTEL_LOG_USER_PROMPTS` (inheritance) | 0 | 1 (@195212) | **NET-NEW** |
| `Content exceeds 60KB` (truncation msg) | 2 | 2 | carryover (reused) |
| `61440` (60KB byte cap `xcp`) | 4 | 4 | carryover (reused) |
| `response_length` | 19 | 20 (+1) | +1 = the new assistant_response field |
| `triBool` parser usage | 13 | (still present) | carryover machinery; FIRST applied to this env var |
| 88 tree `assistant_response` | n/a | absent in 88 src | new vs 88 too |

`assistant_response` does not exist anywhere in the 2.1.88 named tree either, so this is new-vs-88 as well as net-new-this-window.

---

## 2. The emit site — `assistant_response` LOG event

**Anchor:** `cli_inner_pretty.js:468662-468668`, inside function `cSl` (@468542).

```javascript
// ============================================
// recordApiRequestTelemetry - emits api_request then (NEW) assistant_response OTEL log
// Location: cli_inner_pretty.js:468542 (fn), 468642-468668 (emit sites)
// ============================================

// ORIGINAL (for source lookup):
function cSl({ model: e, preNormalizedModel: t, start: n, startIncludingRetries: r, ttftMs: o, usage: s, attempt: i, ... }) {
  ...
  if ((Jc("api_request", { model: e, input_tokens: s.input_tokens, output_tokens: s.output_tokens, ... query_source: Hh(m), ... }), S)) {
    let ne = S.flatMap((re) => re.message.content.filter((ce) => ce.type === "text").map((ce) => ce.text)).join(`\n`);
    if (ne)
      Jc("assistant_response", {
        response_length: ne.length,
        response: dGi() ? CD(ne).content : "<REDACTED>",
        request_id: c ?? void 0,
        model: e,
        query_source: Hh(m),
      });
    rSl(S, { model: e, querySource: m, requestId: c });
  }
  ...
}

// READABLE (for understanding):
function recordApiRequestTelemetry({ model, preNormalizedModel, start, startIncludingRetries, ttftMs, usage, attempt, ... }) {
  ...
  logOTelEvent("api_request", { model, input_tokens, output_tokens, ... , query_source: getQuerySource(querySource), ... });
  if (assistantMessages) {
    // Assemble the response text: only `text` content blocks, joined by newline.
    // thinking / tool_use blocks are EXCLUDED.
    const responseText = assistantMessages
      .flatMap(m => m.message.content.filter(b => b.type === "text").map(b => b.text))
      .join("\n");
    if (responseText)
      logOTelEvent("assistant_response", {
        response_length: responseText.length,                                 // raw number, always emitted
        response: isAssistantResponseLoggingEnabled()                         // tri-state gate (NEW)
                    ? truncateForTelemetry(responseText).content              // capped at 60KB
                    : "<REDACTED>",
        request_id: requestId ?? undefined,
        model,
        query_source: getQuerySource(querySource),
      });
    recordSomethingElse(assistantMessages, { model, querySource, requestId });
  }
}

// Mapping: cSl→recordApiRequestTelemetry, Jc→logOTelEvent, dGi→isAssistantResponseLoggingEnabled,
//          CD→truncateForTelemetry, Hh→getQuerySource, ne→responseText, S→assistantMessages,
//          c→requestId, e→model, m→querySource
```

**Key behavioral facts about the payload:**
1. `response_length` is the **full** length of the joined text and is emitted **always**, even when the body is `<REDACTED>`. (Length leaks even when content is redacted.)
2. `response_length` is a **raw number** here, whereas the parallel `user_prompt` event stringifies it (`String(e.length)`). Minor schema asymmetry.
3. `response` body is **truncated to 60KB** via `CD`/`truncateForTelemetry` when logging is enabled; the user_prompt body is **not** truncated.
4. The response text is assembled from **`text` blocks only** (thinking and tool_use excluded), joined with `\n`.
5. Emission is double-guarded: outer `if (... , S)` (assistant message array present) and inner `if (ne)` (non-empty text).

---

## 3. The gate — `dGi()` and the inheritance semantics (THE GOTCHA)

**Anchor:** `cli_inner_pretty.js:195205-195212`.

```javascript
// ORIGINAL:
function GNd() { return at(process.env.OTEL_LOG_USER_PROMPTS); }   // 195205
function V1t(e) { return GNd() ? e : "<REDACTED>"; }               // 195208  (user-prompt redactor)
function dGi() {                                                   // 195211  (NEW)
  return Be.OTEL_LOG_ASSISTANT_RESPONSES ?? Be.OTEL_LOG_USER_PROMPTS;
}

// READABLE:
function isUserPromptLoggingEnabled() { return isEnvTruthy(process.env.OTEL_LOG_USER_PROMPTS); }
function redactIfDisabled(content)    { return isUserPromptLoggingEnabled() ? content : "<REDACTED>"; }
function isAssistantResponseLoggingEnabled() {                     // NEW in 2.1.193
  return managedEnv.OTEL_LOG_ASSISTANT_RESPONSES ?? managedEnv.OTEL_LOG_USER_PROMPTS;
}
// Mapping: GNd→isUserPromptLoggingEnabled, V1t→redactIfDisabled, dGi→isAssistantResponseLoggingEnabled,
//          at→isEnvTruthy, Be→managedEnv namespace (NHr getters)
```

`Be.OTEL_LOG_ASSISTANT_RESPONSES` resolves to the lazy getter `FZc`, parsed via **`triBool()`** (tri-state), while `Be.OTEL_LOG_USER_PROMPTS` is `BZc` parsed via `bool()`.

### `triBool` parser (carryover machinery, first applied to this var)
**Anchor:** `cli_inner_pretty.js:36076-36088` (`QJc`).
```javascript
QJc = Ce(() => yn.preprocess(lIt, yn.string().optional().transform((e) => {
  if (at(e)) return !0;   // isEnvTruthy  → true
  if (ul(e)) return !1;   // isEnvFalsy   → false
  return;                 // unset / unrecognized → undefined
})));
// Mapping: QJc→triBoolParser, at→isEnvTruthy (@1934), ul→isEnvFalsy (@1940)
```

### Inheritance truth table (`response` field outcome)

| `OTEL_LOG_ASSISTANT_RESPONSES` | `OTEL_LOG_USER_PROMPTS` | `dGi()` | `response` field |
|---|---|---|---|
| unset | unset | `undefined` (falsy) | `<REDACTED>` |
| **unset** | **truthy (1/true)** | **`true` (INHERITED)** | **FULL TEXT (≤60KB)** ← upgrade gotcha |
| unset | falsy (0/false) | `false` | `<REDACTED>` |
| truthy (1/true) | any | `true` | FULL TEXT (≤60KB) |
| **falsy (0/false)** | truthy | **`false` (explicit opt-out)** | `<REDACTED>` |

**Upgrade-behavior gotcha (HEADLINE):** Because `OTEL_LOG_ASSISTANT_RESPONSES` is unset by default and `??` falls through to `OTEL_LOG_USER_PROMPTS`, any existing deployment that set `OTEL_LOG_USER_PROMPTS=1` to capture prompts will, immediately on upgrading to 2.1.193, **begin emitting the model's full response text** in the brand-new `claude_code.assistant_response` log event — with no config change on their side. To keep prompt logging but suppress response bodies, operators must **explicitly set `OTEL_LOG_ASSISTANT_RESPONSES=0`** (the tri-state `false` short-circuits the `??`). This is exactly why the var is parsed with `triBool` rather than `bool`: a plain boolean default of `false` could not express "unset → inherit" vs "explicit 0 → opt out".

---

## 4. Parallelism with the existing `user_prompt` event

**`user_prompt` emit sites:** `cli_inner_pretty.js:397799`, `:397912`, `:617462` (all carryover; the event itself predates this window — `user_prompt` exists in the 88 tree at `processTextPrompt.ts:52`).

```javascript
// CLI text prompt (397799):
Jc("user_prompt", { prompt_length: String(e.length), prompt: V1t(e), "prompt.id": X });
// Slash command (397912): adds command_name, command_source
// Stream/other (617462): Jc("user_prompt", { prompt_length: String(p.length), prompt: V1t(p), "prompt.id": o });
```

| Aspect | `user_prompt` (existing) | `assistant_response` (NEW) |
|---|---|---|
| Length field | `prompt_length: String(len)` (string) | `response_length: len` (number) |
| Content field | `prompt: V1t(content)` | `response: dGi() ? CD(text).content : "<REDACTED>"` |
| Redaction gate | `GNd()` = `isEnvTruthy(OTEL_LOG_USER_PROMPTS)` (plain bool, reads raw env) | `dGi()` = `OTEL_LOG_ASSISTANT_RESPONSES ?? OTEL_LOG_USER_PROMPTS` (tri-state + inheritance, reads managed-env getters) |
| Truncation | none (full prompt) | **60KB cap via `CD`/`xcp=61440`** |
| Correlation fields | `prompt.id` (+ `command_name`/`command_source` for slash) | `request_id`, `model`, `query_source` |
| OTEL body name | `claude_code.user_prompt` | `claude_code.assistant_response` |

Both flow through the same emitter `Jc`/`logOTelEvent` (@195214), which wraps the payload as an OTEL LOG record `{ body: "claude_code.<event>", attributes }` and dispatches to the event logger (`qpr()`/`a.emit(i)`), falling back to a "no event logger initialized" warning.

---

## 5. The emitter and truncation helper (supporting machinery)

**`Jc` / `logOTelEvent`** — `cli_inner_pretty.js:195214-195230`. Builds attributes from `R4e()` resource attrs + `event.name`/`event.timestamp`/`event.sequence` (monotonic `jNd++`), injects `prompt.id` and `workspace.host_paths` when present, drops `undefined` fields, wraps as `{ body: \`claude_code.${e}\`, attributes }`, and emits via `qpr()` event logger. 88 ancestor: `logOTelEvent` (`events.ts:21`). Carryover.

**`CD` / `truncateForTelemetry`** — `cli_inner_pretty.js:285861-285871`, with cap `xcp = 61440` (60×1024 = 60KB) at `:286044`. Returns `{ content, truncated }`; appends `\n\n[TRUNCATED - Content exceeds 60KB limit]` when over cap. **Carryover** (4×`61440`, 2×truncation-msg in BOTH 183 and 193) — pre-existing helper reused elsewhere; only its *application inside the assistant_response payload* is new this window.

---

## 6. Env-var registration sites (both net-new entries)

1. **Lazy getter map + parser** — `cli_inner_pretty.js:36266` registers `OTEL_LOG_ASSISTANT_RESPONSES: () => FZc` on the env namespace `NHr`; `:36363` declares the var; `:36424` binds `FZc = Fe.triBool()`. The **only** OTEL_* env in this block using `triBool()` — all sibling OTEL_LOG_* vars use `bool()` (e.g. `BZc = Fe.bool()` for `OTEL_LOG_USER_PROMPTS` @36423). 88 ancestor for the namespace: `Fe` env-schema builder (`str/bool/triBool/int/enum`) @36090.

2. **Managed-env allowlist** — `cli_inner_pretty.js:193053`: `"OTEL_LOG_ASSISTANT_RESPONSES"` added (alphabetically, between `OTEL_EXPORTER_OTLP_TRACES_HEADERS` and `OTEL_LOG_TOOL_CONTENT`) to the recognized/pass-through env-var list. 88 ancestor: `src/utils/managedEnvConstants.ts` (which lists `OTEL_LOG_USER_PROMPTS` @172 but not the new var). Net-new entry.

Asset cross-check: `OTEL_LOG_ASSISTANT_RESPONSES` is **absent** from `extract/assets/env_vars.json` for 2.1.193 (asset extract appears not to have captured this addition); the bundle is authoritative here.

---

## 7. Symbol table (for symbol_index_infra_platform.md — Telemetry module)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `cSl` | recordApiRequestTelemetry | cli_inner_pretty.js:468542 | function |
| `Jc` | logOTelEvent | cli_inner_pretty.js:195214 | function |
| `dGi` | isAssistantResponseLoggingEnabled | cli_inner_pretty.js:195211 | function |
| `GNd` | isUserPromptLoggingEnabled | cli_inner_pretty.js:195205 | function |
| `V1t` | redactIfDisabled | cli_inner_pretty.js:195208 | function |
| `CD` | truncateForTelemetry | cli_inner_pretty.js:285861 | function |
| `xcp` | TELEMETRY_CONTENT_LIMIT_BYTES (61440) | cli_inner_pretty.js:286044 | constant |
| `QJc` | triBoolParser | cli_inner_pretty.js:36076 | function |
| `at` | isEnvTruthy | cli_inner_pretty.js:1934 | function |
| `ul` | isEnvFalsy | cli_inner_pretty.js:1940 | function |
| `Hh` | getQuerySource | cli_inner_pretty.js:145303 | function |
| `FZc` | OTEL_LOG_ASSISTANT_RESPONSES (triBool getter) | cli_inner_pretty.js:36266/36424 | variable |
| `BZc` | OTEL_LOG_USER_PROMPTS (bool getter) | cli_inner_pretty.js:36262/36423 | variable |
| `Fe` | envSchemaBuilder | cli_inner_pretty.js:36090 | object |
| `Be` | managedEnv (NHr getter namespace) | cli_inner_pretty.js:195212 (usage) | object |

---

## 8. Proposed module docs

- **NEW** `44_telemetry/assistant_response_event.md` — full writeup of the new event: payload schema, the `dGi()` inheritance truth table, the upgrade gotcha, parallelism with `user_prompt`, the 60KB truncation, and the tri-state-vs-bool design rationale. (Rich enough to stand alone.)
- **UPDATE** `00_overview/changelog_analysis.md` — add the headline 2.1.193 telemetry bullet flagged as upgrade-behavior gotcha.
- **UPDATE** `00_overview/symbol_index_infra_platform.md` — add the Telemetry-module rows above.
- **UPDATE** env-vars reference (if one exists) — add `OTEL_LOG_ASSISTANT_RESPONSES` with tri-state semantics and the `??` inheritance note.

## 9. Depth assessment

**Moderate-to-rich.** This is a small, surgical change (one new event, one new env var, one new gate function, two registration sites) but it is fully isolable, has clean source anchors, a non-trivial inheritance algorithm worth explaining (tri-state `??` fallback), a meaningful security/privacy upgrade gotcha, and clean parallelism with the existing `user_prompt` event. Easily worth a focused module doc; not a sprawling subsystem.
