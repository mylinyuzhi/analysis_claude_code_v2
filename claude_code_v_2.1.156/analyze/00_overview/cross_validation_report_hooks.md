# Cross-Validation Report — Module 11_hooks

- **Module:** 11_hooks (Hooks delta, v2.1.143 → v2.1.156)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/11_hooks`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/00_overview/symbol_additions_v2_1_156_hooks.md`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649979 lines)
- **v2.1.88 xval source:** `/lyz/codespace/3rd/claude-code/src/` (readable TypeScript)
- **Markdown files scanned:** 5 (README.md, message_display_event.md, message_display_streaming_engine.md, session_start_title_and_reload_skills.md, stop_hook_background_tasks_and_block_cap.md) + 1 additions file
- **Samples verified:** 60+ distinct `cli_inner_pretty.js:<line>` citations read directly from the bundle

---

## C1 — Symbol existence

Every obfuscated identifier in the additions table was located at its cited declaration line by reading the bundle.

- PASS: all rows checked exist at (or, where noted, near) the cited line.
- The four engine-constant rows (`Xxz`/`AW9`/`YW9`/`fW9`) share one `var` block at 627128-627132 and are
  cited per-name — confirmed (627129/627130/627131/627132). `HR$`/`AW9` lazy-assignment at 627139 — confirmed.

No symbol was found missing from the bundle.

## C2 — Line/symbol pairing

Spot-checked obfuscated→line pairings; the symbol present at the cited line matched the claimed identifier in
all but one case (a definition-vs-call-site citation, fixed):

- FAIL (fixed): `th8` (`runShellHook`) — the additions table and `message_display_event.md` cited
  `cli_inner_pretty.js:553613`, which is the **call site** `await th8(...)` inside `QL`, not the declaration.
  The `async function th8(...)` declaration is at **552607**. Fixed both the table row (now cites 552607, with
  the 553613 call site noted) and the prose.
- FAIL (fixed): `beginTurn` snippet header in `message_display_streaming_engine.md` cited `626040-626066`
  (and prose `626046-626065`). The `begin(j)` method actually lives at **627040-627066** (off-by-1000 typo).
  Confirmed via `grep "begin(j)"` → only 627040. Fixed header to 627040-627066 and prose to 627046-627065.
- FAIL (fixed): `message_display_event.md` §7 claimed the engine "is constructed once in the REPL
  (cli_inner_pretty.js:626563-626576)". Line 626563 is the end of an unrelated function; the only
  `OW9({...})` construction (`ky = useMemo(() => OW9({...}))`) is at **628561-628577**. Fixed to 628561-628577.
  (The adjacent `onMessageDisplay` callback citation 628569-628574 in the same sentence was already correct.)

All other pairings (≈55) matched on first read.

## C3 — Line range sanity

All multi-line ranges checked are well-formed (start ≤ end) and the declaration begins at the start line:

- `lj_` 337023 (input schema head), `Mw_` 337161 (output schema head), `do7` 337054 (input union, `lj_()`
  member confirmed at 337085) — PASS.
- `Nj_` 336840 / `hj_` 336879 (Stop/SubagentStop input), `Qo7` 336795 / `go7` 336823 (element schemas) — PASS.
- `OW9` 626930-627084 (ends at 627084; `t5q` immediately follows at 627085; `MW9` at 627097) — PASS.
- Engine internal closures `z` 626933 / `A` 626938 / `Y` 626977 / `f` 626993 / `O` 627007 / `M` 627031 — each
  confirmed at its exact head line — PASS.
- Block-cap branch 451884-451933 (telemetry sites 451886/451893/451906, warning `Z_` at 451912,
  max-turns checked at 451891 before the cap at 451904) — PASS.

## C4 — Per-decl file existence

No per-decl `decls/...` citations are used by this module's docs (all citations are `cli_inner_pretty.js:<line>`).
- PASS: 0 / FAIL: 0.

## C5 — Mapping conflicts (one readable name per symbol)

Found and reconciled cross-doc readable-name divergence (single-source-of-truth violation):

- `wk` was `hasHookForEvent` (event doc, README, additions) vs `hasHooksForEvent` (streaming-engine doc list).
- `OW9` was `createMessageDisplayEngine` (canonical) vs `messageDisplayStreamEngine` (streaming-engine).
- `MW9` was `applyMessageDisplayToCompletedMessage` (canonical) vs `rewriteCompletedMessage` (streaming-engine).
- The four constants `Xxz`/`AW9`/`YW9`/`fW9` were `MESSAGE_DISPLAY_*` (canonical) vs
  `flushesPerSecond`/`flushIntervalMs`/`maxInFlight`/`messageDisplayTimeoutMs` (streaming-engine).

**Fix:** standardized the streaming-engine doc's top-of-doc "Key functions / values" symbol-reference list to
the canonical readable names used by the additions table (the single source of truth), and added an explicit
naming note recording the in-pseudocode variable-style aliases. The inner READABLE pseudocode keeps the
variable-style names (where they read as local variables), so prose is intact; the authoritative symbol→name
mapping is now unambiguous and consistent across docs + additions file.

## S1 — Semantic spot-checks (5 samples)

### Sample 1 — `l6$` (`executeMessageDisplayHooks`) at 551726

```js
async function* l6$(H, $, q, K = q_) {
  let _ = { ...w5(void 0), hook_event_name: "MessageDisplay", turn_id: H.turnId, message_id: H.messageId,
            index: H.index, final: H.final, delta: H.delta };
  yield* QL({ hookInput: _, toolUseID: `${H.messageId}-${H.index}`, signal: q, timeoutMs: K,
              getAppState: $, forceSyncExecution: !0, suppressPerInvocationTelemetry: !0 });
}
```
**Verdict:** PASS — `forceSyncExecution`/`suppressPerInvocationTelemetry` flags, the `${messageId}-${index}`
toolUseID, default `K = q_`, and base-input spread all exactly as documented.

### Sample 2 — `wk` (`hasHookForEvent`) at 552979

```js
function wk(H, $, q) {
  let K = fp()?.[H]; if (K && K.length > 0) return !0;
  if (!Yw()) { let z = im()?.[H]; if (z && z.length > 0) return !0; }
  let _ = _b()?.[H]; if (_ && _.length > 0) return !0;
  if ($?.sessionHooks.get(q)?.hooks[H]) return !0;
  return !1;
}
```
**Verdict:** PASS — four-source priority gate (policy `fp` / user-settings `im` skipped in policy-only `Yw` /
plugin `_b` / session-scoped) matches the documented mapping exactly.

### Sample 3 — Stop-hook block-cap branch at 451902-451917

```js
let v$ = parseInt(process.env.CLAUDE_CODE_STOP_HOOK_BLOCK_CAP ?? "", 10),
  F$ = Number.isNaN(v$) ? 8 : v$;
if (F$ > 0 && $$ > F$)
  return (d("tengu_stop_hook_block_count", { count: $$, is_subagent: Boolean(G.agentId), hit_max_turns: !1, hit_cap: !0 }),
    yield Z_(`A hook blocked the turn from ending ${$$} consecutive times — overriding and ending turn. ...`, "warning"),
    { reason: "completed" });
```
**Verdict:** PASS — default 8 on NaN, `0` disables (`F$ > 0`), env override, warning via `Z_`, `hit_cap:true`
telemetry — all match `stop_hook_background_tasks_and_block_cap.md`.

### Sample 4 — `KSH` (`cacheSessionTitleFromHook`) + `Q6$` (`sanitizeSessionTitle`) at 547603-547613

```js
function Q6$(H) { return [...H.replace(/[\x00-\x1f\x7f-\x9f]/g, "")].slice(0, PJz).join(""); }
function KSH(H) {
  if (FA()) return;
  let $ = Q6$(H); if (!$) return;
  let q = v3(E$()); if ($ === (q && Q6$(q))) return;
  (N(`Hook sessionTitle cached (${[...$].length} chars)`), WCH($), Eh8($));
}
```
**Verdict:** PASS — control-char strip + `PJz`(=200, confirmed at 549113) code-point cap, subagent guard `FA`,
empty/unchanged guards, live-only write (`WCH`, no persist). Matches §5 Path A exactly.

### Sample 5 — `v89` (`mapBackgroundTasksForHook`) at 551812 + `er6` labels at 457418

```js
function v89(H) { let $ = [];
  for (let q of Object.values(H)) { if (!uL(q)) continue;
    let K = { id: q.id, type: er6[q.type] ?? q.type, status: q.status, description: ub$(q.description, hKq) };
    switch (q.type) { case "local_bash": K.command = ub$(q.command, hKq); break; ... } $.push(K); }
  return $; }
// er6 = { local_agent:"subagent", local_workflow:"workflow", local_bash:"shell", monitor_mcp:"monitor", ... }
```
**Verdict:** PASS — in-flight filter `uL`, `TASK_TYPE_LABELS` (`er6`) discriminant→label with raw fallback,
one conditional field per type, 1000-char `ub$`/`hKq` cap. Matches Part A exactly.

---

## v2.1.88 cross-validation (precursor claims)

- `MessageDisplay` / `displayContent` / `displayTransform` / `displayedMessageContent`: **zero** matches in
  `src/` — confirmed NEW post-2.1.88 (HIGH).
- `SessionStartHookSpecificOutputSchema` (coreSchemas.ts:823-830; doc cites 821-829, ~2-line drift, body
  matches): only `additionalContext`/`initialUserMessage`/`watchPaths` — no `sessionTitle`/`reloadSkills`.
  Confirmed NEW (HIGH).
- `StopHookInputSchema` (coreSchemas.ts:513) / `SubagentStopHookInputSchema` (:550): `stop_hook_active`,
  `last_assistant_message`, + `agent_id`/`agent_transcript_path` for SubagentStop — no `background_tasks` /
  `session_crons`. Confirmed NEW (HIGH).
- `reloadSkills` / `background_tasks` / `session_crons` / `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`: absent from
  coreSchemas.ts. Confirmed NEW (HIGH).

The surrounding hook *platform* (`QL`/`executeHooks`, `ah8`/`applyHookJSONOutput`, `p89`/`parseHookJSONOutput`,
`wk`/`hasHookForEvent`, the per-event input union, the `stop_hook_active` convention) is the unchanged 2.1.88
precursor — matching the docs' "new mechanism on an old extension point" framing.

---

## Summary

- C1 Symbol existence: PASS (all checked rows present)
- C2 Line/symbol pairing: 3 FAIL (all fixed) / ~55 PASS
- C3 Range sanity: PASS (all ranges well-formed, declarations at start line)
- C4 Per-decl files: 0 / 0 (none used)
- C5 Mapping conflicts: 1 cross-doc divergence cluster (`wk`/`OW9`/`MW9` + 4 constants) — reconciled
- S1 Semantic spot-checks: 5 PASS / 0 FAIL

**Fixes applied (4 docs touched):**
1. `message_display_streaming_engine.md` — `beginTurn` snippet location 626040-626066 → 627040-627066;
   prose 626046-626065 → 627046-627065.
2. `message_display_event.md` — engine construction site 626563-626576 → 628561-628577.
3. `symbol_additions_v2_1_156_hooks.md` + `message_display_event.md` — `th8` declaration cited at 552607
   (was the 553613 call site).
4. `message_display_streaming_engine.md` — standardized the symbol-reference list to canonical readable names
   (`MESSAGE_DISPLAY_*`, `createMessageDisplayEngine`, `applyMessageDisplayToCompletedMessage`,
   `hasHookForEvent`) + added an alias naming note.

**Overall verdict: PASS** (after fixes). The module's substantive claims — schemas, executor flags, the
streaming engine's flush/debounce/in-flight-cap/fail-open behavior, the SessionStart cache-vs-apply split, the
Stop-hook situational-awareness arrays, and the block cap — are all faithful to the bundle and to the 2.1.88
precursor analysis. The only defects were citation typos (an off-by-1000, a wrong construction-site line, a
definition-vs-call-site mismatch) and a cross-doc readable-name divergence, all corrected.
