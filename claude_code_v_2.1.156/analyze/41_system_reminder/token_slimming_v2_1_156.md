# Reminder Token Slimming — v2.1.88 -> v2.1.156 (the post-2.1.140 trim)

> **PRIMARY object of analysis**: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines, single bundle). Every 2.1.156 line number below was Read/grep-verified against this file — **not** copied from the 2.1.142 reference (obfuscated names AND line numbers differ between versions).
> **BASELINE (cross-validation by readable name only)**: `/lyz/codespace/3rd/claude-code/src` (2.1.88 deobfuscated TypeScript).
> **Output language**: English only.
> **Scope**: ONLY the `<system-reminder>` subsystem. This is the headline deliverable — the master inventory of what got slimmer, what grew, and what stayed.

---

## 1. Executive Summary — the slimming program in spirit

The 2.1.88 -> 2.1.156 reminder evolution is **NOT a blanket "everything got shorter."** It is a focused two-part *removal* program plus a parallel, correctness-driven *expansion* of feature reminders. Anyone reading only the headline ("reminders were slimmed") would be wrong about the net byte count. The honest picture has three movements:

**(a) The high-frequency repetition was surgically removed.** The single largest token win is the deletion of the per-Read malware `<system-reminder>` (the 2.1.88 `CYBER_RISK_MITIGATION_REMINDER`), which in 2.1.88 was appended to the END of **every** non-empty file Read result. Because each Read tool_result rides in the re-billed prompt on every subsequent turn, this was — by a wide margin — the most expensive *repeated* reminder in the system. It is gone with **zero traces** in the 2.1.156 bundle: `grep -c -i "malware|refuse to improve|augment the code|considered malware" cli_inner_pretty.js` = **0** (verified). The Read-result builder that used to append it now has no mitigation arm (`cli_inner_pretty.js:422933-422940`). A parallel removal eliminated the thinking-frequency reminder surface (a system-prompt clause + an attachment render): `grep -c -i "respond without a thinking block|tune your thinking frequency|on simpler user messages"` = **0** (verified), and the `thinking_reminder` attachment type is now an inert `return []` (`cli_inner_pretty.js:445800`).

**(b) Per-reminder restatements of *global* policy were trimmed.** The dominant *style* of slimming is dropping sentences that merely re-assert a rule already taught once in the system prompt. The two clearest examples: `todo_reminder` and `task_reminder` both dropped their trailing `Make sure that you NEVER mention this reminder to the user` (`grep -c -i "NEVER mention this reminder"` = **0**, verified; both now end at `…ignore if not applicable.` — `cli_inner_pretty.js:445514` and `:445528`). The `auto_mode` reminder was rewritten from a 6-point numbered policy list (whose items 5 & 6 — destructive-action confirmation, data-exfiltration — duplicated global safety rules) down to one short behavioral paragraph (`cli_inner_pretty.js:445594-445596`). The centralized replacement for "don't mention this to the user" is a single hoisted constant `ambientContextTrailer` (obfuscated: `yT8`, `cli_inner_pretty.js:446489-446490`), appended once to delta/memory reminders instead of being baked into every string.

**(c) Counter-current: several reminders GREW, and new cloud/remote surfaces were added.** `invoked_skills`, `relevant_memories`, and `deferred_tools_delta` all expanded — driven by *correctness* (post-compaction replay safety, recall-uncertainty signalling, MCP topology guidance), not economy. Entirely new reminder surfaces appeared for cloud/remote execution: the `gh` rate-limit reminder (`cli_inner_pretty.js:269428`), the container-restart reminder (`cli_inner_pretty.js:623998`), three ultraplan remote-planning prompt modules (`cli_inner_pretty.js:503304 / 503325 / 503349`), and the `memory_update` reminder (`cli_inner_pretty.js:445769-445776`). These are NOT slimming targets — they are net additions a fair accounting must net against the savings.

**When did this happen?** The slimming inflection is the ~v2.1.140 era (the 2.1.142 reference already documents the `yT8` hoist, the 4-section `deferred_tools_delta`, and the expanded `invoked_skills`/`relevant_memories`). 2.1.156 *finalizes* the malware removal across **all** models: 2.1.88 had already conceded the cost was model-dependent (it exempted `claude-opus-4-6` via `MITIGATION_EXEMPT_MODELS`); 2.1.156 generalizes that exemption to "always off," dropping both the constant and its gate entirely.

**The single most important distinction in this whole report:** the removed per-Read malware `<system-reminder>` and the *surviving* system-prompt clause `CYBER_RISK_INSTRUCTION` are **DIFFERENT THINGS**. The former (a per-Read tool_result suffix about "do not improve malware") is fully removed. The latter (a system-prompt sentence about "authorized security testing vs malicious requests") is byte-identical and still wired into the prompt at `cli_inner_pretty.js:555398` (verified verbatim). Removing (a) did **not** remove (b).

---

## 2. Master Change Table

> This is **change data** (a diff inventory), not an obfuscated->readable symbol mapping — a table is appropriate here per the doc spec. Token deltas are estimates (≈4 chars/token). "Fires" classifies emission frequency. Evidence cites 2.1.88 `path:line` -> 2.1.156 `cli_inner_pretty.js:line`. Negative delta = bytes removed (saving); positive = bytes added (anti-slim). Every 2.1.156 line was Read/grep-verified against the bundle.

### 2a. Removals & shortenings (token savings)

| Reminder | 2.1.88 form (condensed) | 2.1.156 form | Change class | Fires | Est. token delta | Evidence (88 -> 156) |
|----------|-------------------------|--------------|--------------|-------|------------------|----------------------|
| **Per-Read malware** (`CYBER_RISK_MITIGATION_REMINDER`) | multiline SR appended to every Read: "Whenever you read a file… consider whether it would be considered malware… MUST refuse to improve or augment…" | **gone — no trace** | **REMOVED** | **per-Read (every non-empty file Read)** | **≈ −90 to −100 tok / Read** (re-billed every turn) | FileReadTool.ts:729-730 (+gate :735-738, call :699-701) -> bundle: 0 matches (`grep -ci malware`=0); builder at `422933-422940` has NO mitigation arm |
| **Thinking-frequency clause + `thinking_reminder` attachment** | system-prompt clause "…respond without a thinking block… tune your thinking frequency… on simpler user messages…" + attachment render | clause **gone**; attachment is `return []` (no-op) | **REMOVED** | per-turn (simple turns) / occasional | ≈ −30 to −50 tok on affected turns + a one-time system-prompt clause | 2.1.142 system prompt + attachment -> bundle: 0 phrase matches; `thinking_reminder` in noop list at `445800` |
| **`todo_reminder`** | "…ignore if not applicable. **Make sure that you NEVER mention this reminder to the user**" | "…ignore if not applicable." (tail dropped) | **SHORTENED** | occasional (dual-gate: ≥10 turns since TodoWrite AND ≥10 since last reminder) | ≈ −12 tok / emission | messages.ts:3668 -> `445514` |
| **`task_reminder`** | "…ignore if not applicable. **Make sure that you NEVER mention this reminder to the user**" | "…ignore if not applicable." (tail dropped) | **SHORTENED** | occasional (same dual-gate; + TaskList feature gate `OD()`) | ≈ −12 tok / emission | messages.ts:3688 -> `445528` (gate `OD()` at `445525`) |
| **`auto_mode`** | `## Auto Mode Active` + 6-point numbered policy list (~150 words) + separate sparse variant + full/sparse/once selector | `## Auto Mode Active` + one short prose paragraph (~80 words); selector **removed** | **REWORDED + SHORTENED** | once per auto-mode session (generator dedupes via history scan) | ≈ −70 tok vs old full | messages.ts:3429-3443 (full) + :3445-3451 (sparse) -> `445594-445596`; header `dUK` = "Auto Mode Active" |
| **`context_efficiency`** | feature-gated `HISTORY_SNIP` branch could emit a nudge; else `[]` | bare `return []` (branch deleted) | **HARD NO-OP** | never (was rare, behind flag) | removes a latent emission path | messages.ts:4148-4161 -> `445671-445672` |
| **`verify_plan_reminder`** | env-gated; generator could emit the nudge; tool name `VerifyPlanExecution` when `CLAUDE_CODE_VERIFY_PLAN==='true'` | generator `bR_` hard-returns `[]`; render case kept but unreachable in default build | **NEUTERED** (build artifact) | never (default build) | removes a latent occasional nudge | messages.ts:4240-4248 -> generator `bR_`@`413895` `return []`, registered `E3("verify_plan_reminder")`@`412732`; dead render `445787` |
| **`output_token_usage`** | generator computed turn/session/budget and could emit | generator `IR_` returns `[]` unconditionally (default build) | **NEUTERED** | never (default build) | removes a per-turn token-accounting reminder | messages.ts:4076-4089 -> generator `IR_`@`413877` `return []`, registered `E3("output_token_usage")`@`412731` |
| **`teammate_mailbox`** | agent-team inbox formatted + emitted when team feature on | generator `hR_` returns `[]` in **both** branches even when `R7()` gate passes | **NEUTERED** (feature-staged) | never (default build) | removes the team-inbox reminder path | -> generator `hR_`@`413856` (`if(!R7())return[];return[]`), registered `E3("teammate_mailbox")`@`412703` |
| **`memoryHeader` fallback** (`WG8`) | fallback `Memory (saved ${memoryAge}): ${path}:` | fallback bare `Memory: ${path}:` ("(saved X ago)" dropped) | **SHORTENED (minor)** | per recalled memory lacking a header | ≈ −4 to −6 tok / memory | attachments.ts:2327-2332 -> `WG8` (used at `445541`) |

### 2b. Expansions & new surfaces (anti-slim — must net against savings)

| Reminder | 2.1.88 form | 2.1.156 form | Change class | Fires | Est. token delta | Evidence (88 -> 156) |
|----------|-------------|--------------|--------------|-------|------------------|----------------------|
| **`invoked_skills`** | one-line lead-in: "The following skills were invoked in this session. Continue to follow these guidelines:" | two-paragraph lead-in: "…invoked EARLIER in this session (before…compacted)…IMPORTANT: Do NOT re-execute these skills or perform their one-time setup actions…" | **EXPANDED** | post-compaction replay (rare) | **≈ +70 tok** | messages.ts:3644-3661 -> `445502-445506` |
| **`relevant_memories`** | bare `${header}\n\n${content}` per memory | first non-synthesis memory prepends "Retrieved for possible relevance — use only if it actually applies to what the user asked." | **EXPANDED** | per matched memory (first only) | **≈ +12 tok** (first memory) | messages.ts:3708-3722 -> `445546` |
| **`deferred_tools_delta`** | "The following deferred tools are now available via ToolSearch:" (2 states) | added-line expanded to "…via ToolSearch. Their schemas are NOT loaded — calling them directly will fail with InputValidationError. Use ToolSearch with query \"select:<name>…\"…" + new `readded`/`pending` states (4 total) + `yT8` on removal | **EXPANDED** | on MCP topology change (occasional) | **≈ +40 tok** added-line; more from readded/pending | messages.ts:4178-4193 -> `445675-445712` |
| **`agent_listing_delta`** (concurrency note) | "Launch multiple agents concurrently whenever possible…use a single message with multiple tool uses." | "When you launch multiple agents for independent work, send them in a single message with multiple tool uses so they run concurrently." + `yT8` on removal | **REWORDED (≈neutral) + yT8** | initial agent listing / topology change | ≈ 0 on note; + `yT8` (~22 tok) on removals | messages.ts:4194-4215 -> renderer near `445715+` |
| **`mcp_instructions_delta`** | two blocks, no trailer | same blocks + `yT8` after removed section | **EXPANDED (minor)** | MCP instruction change (occasional) | + `yT8` (~22 tok) on removals | messages.ts:4216-4231 -> renderer near `445743+` |
| **`queued_command`** (`task-notification` kind) | one-liner: "A background agent completed a task:\n${raw}" | `[SYSTEM NOTIFICATION - NOT USER INPUT]` envelope via `XG4` + NEW `peer` origin kind | **REWORDED + NEW kind** | per drained background-task event | **≈ +30 tok** on task-notification | messages.ts:5496-5512 -> `445557-445567` (envelope `XG4`) |
| **`memory_update`** | *absent* | "${source} updated your memory directory… now stale relative to disk — Read it again…" + `yT8` | **NEW** | on async memory write (e.g. `/dream`) | new surface | (none) -> `445769-445776` |
| **`gh` rate-limit** | *absent* | "GitHub API rate limit exceeded (5,000/hr…). Run `gh api rate_limit`… use ScheduleWakeup instead of retrying." | **NEW** | on `gh` rate-limit stderr (debounced) | new surface | (none) -> `269428` |
| **Container-restart** | *absent* | "The container was restarted. The following background tasks were running and are now stopped:…" | **NEW** | on container restart (cloud) | new surface | (none) -> `623998` |
| **Ultraplan remote prompts** (3) | *absent* (local-only in 2.1.88) | three SR-wrapped remote-planning scaffolds (single / single+mermaid / multi-agent) with `__ULTRAPLAN_TELEPORT_LOCAL__` handoff | **NEW** | on remote planning session | new surface | (none) -> `503304` / `503325` / `503349` |

### 2c. Load-bearing reminders kept verbatim (NOT changed) — full list in §6

| Reminder | 2.1.156 anchor | Status |
|----------|----------------|--------|
| `CYBER_RISK_INSTRUCTION` (system prompt) | `555398` | UNCHANGED (distinct from the removed malware reminder) |
| Read empty-file / short-file warnings | `422944` / `422945` | UNCHANGED |
| File-too-large truncation ("Don't tell the user about this truncation") | within `file`/`text` renderer | UNCHANGED |
| `edited_text_file` ("Don't tell the user this") | renderer near `446563-446573` | UNCHANGED |
| `mcp_resource` ("Do NOT read this resource again…") | `445600-445634` | UNCHANGED |
| `task_status` (killed/running/completed) | `445635-445656` | UNCHANGED |
| Side-question prompt | `454123-454138` | UNCHANGED |
| CLAUDE.md session-start context block | `556130-556139` | UNCHANGED |
| SR-convention system-prompt clause | `555453` | UNCHANGED (already the trimmed form in 2.1.88) |
| Memory-age stale marker | `221255-221268` | UNCHANGED |
| Brief-mode toggle | `527818-527820` | UNCHANGED |
| `plan_mode_reentry` / `plan_mode_exit` / `auto_mode_exit` / `date_change` | renderers in `445573+` region | UNCHANGED (byte-identical) |

---

## 3. Per-category deep dives (the biggest savings)

### 3.1 The malware / `CYBER_RISK_MITIGATION_REMINDER` removal — the headline win

**What it does (in 2.1.88):** appends a fixed multiline `<system-reminder>` to the end of every non-empty file Read result, telling the model it may analyze but must not improve malware.

**How it worked in 2.1.88 (three coupled parts):**
1. Constant `CYBER_RISK_MITIGATION_REMINDER` — `FileReadTool.ts:729-730`.
2. Gate `shouldIncludeFileReadMitigation()` — `FileReadTool.ts:735-738` (`return !MITIGATION_EXEMPT_MODELS.has(shortName)`).
3. Exempt set `MITIGATION_EXEMPT_MODELS = new Set(['claude-opus-4-6'])` — `FileReadTool.ts:733`.
4. Call site — `FileReadTool.ts:699-701`: `… + (shouldIncludeFileReadMitigation() ? CYBER_RISK_MITIGATION_REMINDER : '')`.

**Verbatim 2.1.88 string (the text that is GONE):**
```
\n\n<system-reminder>\nWhenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.\n</system-reminder>\n
```

**The 2.1.156 replacement builder (NO mitigation arm) — dual-version:**

```javascript
// ============================================
// readFileResultBuilder - Read tool_result content builder; emits ONLY the memory-freshness prefix (if any) + formatted lines. No malware tail.
// Location: cli_inner_pretty.js:422933-422945
// ============================================

// ORIGINAL (for source lookup):
q = (K ? `<system-reminder>${K}</system-reminder>\n\n` : "") + Bb_(H) + ub_(H.file);
// (else-branch, empty/short file:)
q = H.file.totalLines === 0
  ? "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>"
  : `<system-reminder>Warning: the file exists but is shorter than the provided offset (${H.file.startLine}). The file has ${H.file.totalLines} lines.</system-reminder>`;

// READABLE (for understanding):
content = (memoryFreshnessPrefix
            ? `<system-reminder>${memoryFreshnessPrefix}</system-reminder>\n\n`
            : "")
        + formatFileLines(toolResult)
        + lineFormatInstruction(toolResult.file);
// (else-branch, empty/short file:)
content = toolResult.file.totalLines === 0
  ? "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>"
  : `<system-reminder>Warning: the file exists but is shorter than the provided offset (${toolResult.file.startLine}). The file has ${toolResult.file.totalLines} lines.</system-reminder>`;

// Mapping: q->content, K->memoryFreshnessPrefix, Bb_->formatFileLines, ub_->lineFormatInstruction, H->toolResult
```

There is **no** `shouldIncludeFileReadMitigation() ? … : ''` term anywhere in this builder. Verified: `grep -c -i "malware|refuse to improve|augment the code|considered malware" cli_inner_pretty.js` = **0** across the entire 649,979-line bundle.

**Why Anthropic likely cut it (deep analysis):**

1. **Per-turn re-billing cost.** Unlike an occasional reminder, this rode the most frequent tool result in a coding session (file Reads), and every Read tool_result is re-sent in the prompt on every subsequent turn. A static ~90-100-token suffix on, say, 50 Reads is ~4,500-5,000 tokens that re-bill turn after turn — by far the largest *repeated* reminder cost in the system. This is the textbook target for removal: high frequency × in-prompt persistence.
2. **Cache neutrality made removal cheap.** It was a static suffix, so its removal does not destabilize any cache prefix; the only effect is a smaller, cheaper Read tool_result.
3. **Redundancy with the surviving system-prompt clause.** The behavioral policy is now carried once by `CYBER_RISK_INSTRUCTION` (system prompt, `555398`) and by model training, rather than restated in-band on every Read. This is the same philosophy as the todo/task "NEVER mention" drops: do not restate a global rule inside a per-event reminder.
4. **2.1.88 already conceded it was model-dependent.** The `MITIGATION_EXEMPT_MODELS` set exempted `claude-opus-4-6` — an admission the newer model no longer needed the scaffold. 2.1.156 generalizes the exemption to all models and deletes the machinery.

**Trade-off:** the cost is purely *defense-in-depth* — the per-Read in-band nudge is gone, so the safety behavior now leans entirely on training + the single system-prompt clause. Anthropic judged that sufficient; the win is large and the risk small because the policy was duplicative.

**Key insight:** This is the *only* unambiguous, large, frequently-billed token win in the entire reminder set. Everything else is either marginal (todo/task), session-scoped (auto_mode), or offset by expansions elsewhere.

---

### 3.2 The "NEVER mention this reminder" drops (todo_reminder / task_reminder)

**What it does:** both reminders nudge the model to (re)engage its task-tracking tools after a quiet stretch. In 2.1.88 each ended with an extra sentence telling the model never to surface the reminder to the user.

**Before (2.1.88, both end with):**
```
… This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
```
- `todo_reminder` — `messages.ts:3668`
- `task_reminder` — `messages.ts:3688`

**After (2.1.156, both end at "…ignore if not applicable.") — dual-version:**

```javascript
// ============================================
// todoReminder / taskReminder renderers - both drop the trailing "NEVER mention this reminder" sentence
// Location: cli_inner_pretty.js:445511-445522 (todo) and 445524-445537 (task)
// ============================================

// ORIGINAL (for source lookup):
case "todo_reminder": {
  let q = H.content.map((_, z) => `${z + 1}. [${_.status}] ${_.content}`).join("\n"),
    K = `The TodoWrite tool hasn't been used recently. … This is just a gentle reminder - ignore if not applicable.\n`;
  if (q.length > 0) K += `\n\nHere are the existing contents of your todo list:\n\n[${q}]`;
  return C_([T8({ content: K, isMeta: !0 })]);
}
case "task_reminder": {
  if (!OD()) return [];
  let q = H.content.map((_) => `#${_.id}. [${_.status}] ${_.subject}`).join("\n"),
    K = `The task tools haven't been used recently. … This is just a gentle reminder - ignore if not applicable.\n`;
  if (q.length > 0) K += `\n\nHere are the existing tasks:\n\n${q}`;
  return C_([T8({ content: K, isMeta: !0 })]);
}

// READABLE (for understanding):
case "todo_reminder": {
  const list = attachment.content.map((t, i) => `${i + 1}. [${t.status}] ${t.content}`).join("\n");
  let text = TODO_REMINDER_TEXT; // ends "…ignore if not applicable." — NO "NEVER mention" tail
  if (list.length > 0) text += `\n\nHere are the existing contents of your todo list:\n\n[${list}]`;
  return wrapMessagesAsReminders([makeUserMessage({ content: text, isMeta: true })]);
}
case "task_reminder": {
  if (!isTaskListFeatureEnabled()) return [];
  const list = attachment.content.map((t) => `#${t.id}. [${t.status}] ${t.subject}`).join("\n");
  let text = TASK_REMINDER_TEXT; // ends "…ignore if not applicable." — NO "NEVER mention" tail
  if (list.length > 0) text += `\n\nHere are the existing tasks:\n\n${list}`;
  return wrapMessagesAsReminders([makeUserMessage({ content: text, isMeta: true })]);
}

// Mapping: C_->wrapMessagesAsReminders, T8->makeUserMessage, OD->isTaskListFeatureEnabled, H->attachment, K->text, q->list
```

Verified: `grep -c -i "NEVER mention this reminder" cli_inner_pretty.js` = **0** (it appears 2× in 2.1.88's `messages.ts`).

**Why cut it (deep analysis):** The dropped sentence is a per-reminder restatement of a *global* convention. The system prompt already teaches, once, that `<system-reminder>` tags are out-of-band harness context not bound to the surrounding content (`555453`: "Tool results and user messages may include `<system-reminder>` or other tags… They bear no direct relation to the specific tool results or user messages in which they appear."). Re-asserting "never mention this reminder" inside each reminder is pure redundancy. The 2.1.156 design centralizes the "don't narrate" instruction into the single hoisted constant `ambientContextTrailer` (`yT8`, `446489-446490`), appended once to delta/memory reminders instead of being baked into every string.

**Trade-off:** −12 tok/emission is marginal, and these reminders fire at most once per ~10-turn dual-gate window (`QV$ = {TURNS_SINCE_WRITE:10, TURNS_BETWEEN_REMINDERS:10}`, `414014`) — so the *byte* savings are negligible. The real value is **cache/consistency hygiene** and **prompt discipline**: every reminder that stops restating global rules is one fewer place to keep in sync.

**Key insight:** This drop is about *philosophy* (stop restating global policy per-event), not tokens. It is the template for the auto_mode rewrite and the malware removal.

---

### 3.3 The `auto_mode` rewrite (6-point list → one paragraph)

**What it does:** when the user enables auto (continuous, autonomous) mode, this reminder tells the model how to behave for the rest of the session.

**Before (2.1.88, `getAutoModeFullInstructions` messages.ts:3429-3443):** `## Auto Mode Active` followed by a 6-item numbered list (~150 words): 1. Execute immediately, 2. Minimize interruptions, 3. Prefer action over planning, 4. Expect course corrections, **5. Do not take overly destructive actions** (deletes/production need confirmation), **6. Avoid data exfiltration** (don't share secrets). Plus a separate sparse variant (`messages.ts:3445-3451`) selected on a cadence by a full/sparse/once dispatcher.

**After (2.1.156) — dual-version:**

```javascript
// ============================================
// autoModeReminder - 6-point policy list collapsed to one behavioral paragraph; full/sparse/once selector removed
// Location: cli_inner_pretty.js:445591-445599
// ============================================

// ORIGINAL (for source lookup):
case "auto_mode":
  return C_([
    T8({
      content: `## ${dUK}\n\nBias toward working without stopping for clarifying questions — when you'd normally pause to check, make the reasonable call and keep going; they'll redirect you if needed. If the user, a skill, or the shape of the task suggests they want you to ask (with ${ez} or otherwise), do so. And even absent that signal, it's still fine to stop when you're genuinely blocked — unclear direction, missing input, a decision only they can make.`,
      isMeta: !0,
    }),
  ]);

// READABLE (for understanding):
case "auto_mode":
  return wrapMessagesAsReminders([
    makeUserMessage({
      content: `## ${AUTO_MODE_HEADER}\n\nBias toward working without stopping for clarifying questions — when you'd normally pause to check, make the reasonable call and keep going; they'll redirect you if needed. If the user, a skill, or the shape of the task suggests they want you to ask (with ${ASK_USER_QUESTION_TOOL} or otherwise), do so. And even absent that signal, it's still fine to stop when you're genuinely blocked — unclear direction, missing input, a decision only they can make.`,
      isMeta: true,
    }),
  ]);

// Mapping: C_->wrapMessagesAsReminders, T8->makeUserMessage, dUK->AUTO_MODE_HEADER ("Auto Mode Active"), ez->ASK_USER_QUESTION_TOOL
```

The full/sparse/once cadence selector is **removed**: the `auto_mode` case emits the single reworded paragraph directly with NO full/sparse branching, and the generator emits `auto_mode` once per session (returns `[]` once a prior `auto_mode` attachment exists in history). The header constant `dUK = "Auto Mode Active"` is unchanged.

**Why cut it (deep analysis):** Items 5 (destructive-action confirmation) and 6 (data-exfiltration / secrets) are *global safety rules* that already exist in the system prompt and model training; restating them inside the per-mode reminder is the same redundancy pattern as §3.1/§3.2. The rewrite keeps only the **behavioral core unique to auto mode** ("bias toward not stopping, but it's fine to stop when genuinely blocked") and delegates safety to the system prompt. Collapsing the full/sparse cadence into one once-per-session emission also removes the re-firing entirely.

**Trade-off:** ~−70 tok vs the old full text, but only in auto-mode sessions, and the old sparse variant (~18 words) is gone too. The softer "it's fine to stop when blocked" framing is also a *behavioral* change, not just a trim: it explicitly re-licenses stopping, where the old list (items 1-3) leaned hard toward never pausing.

**Key insight:** Same philosophy as the malware / NEVER-mention cuts — strip global policy out of per-mode reminders and let the system prompt carry it. The auto_mode case additionally simplifies the *emission machinery* (no cadence selector), which is the bigger structural win.

---

### 3.4 The thinking-frequency surface removal

**What it does (in 2.1.142 era):** a system-prompt clause taught the model that a `<system-reminder>` might ask it to "respond without a thinking block… intended to tune your thinking frequency… on simpler user messages," plus an attachment render path that emitted that reminder.

**After (2.1.156):** the clause is **gone** (`grep -c -i "respond without a thinking block|tune your thinking frequency|on simpler user messages"` = **0**, verified), and the `thinking_reminder` attachment type is in the no-op allow-list:

```javascript
// ============================================
// attachmentNoopAllowList - attachment types that render to nothing (return []); thinking_reminder is now inert
// Location: cli_inner_pretty.js:445791-445807
// ============================================

// ORIGINAL (for source lookup):
if ([
  "autocheckpointing","background_task_status","todo","task_progress","ultramemory",
  "compaction_reminder","current_session_memory","thinking_reminder","companion_intro",
  "pen_mode_enter","pen_mode_exit","ultrawork_request",
].includes(H.type)) return [];

// READABLE (for understanding):
const NOOP_ATTACHMENT_TYPES = [
  "autocheckpointing","background_task_status","todo","task_progress","ultramemory",
  "compaction_reminder","current_session_memory","thinking_reminder","companion_intro",
  "pen_mode_enter","pen_mode_exit","ultrawork_request",
];
if (NOOP_ATTACHMENT_TYPES.includes(attachment.type)) return [];

// Mapping: H->attachment; "thinking_reminder" at cli_inner_pretty.js:445800
```

**Why cut it (deep analysis):** This surface cost *two* things — a `<system-reminder>` on simple turns AND a system-prompt clause to explain it. 2.1.156 appears to fold thinking-frequency control into request-level `thinkingConfig` / model behavior rather than an in-band reminder, dropping both surfaces.

**Trade-off:** thinking frequency is now invisible in the transcript (no in-band cue), controlled out-of-band — cleaner, but less self-documenting.

**Key insight:** Parallel in spirit to the malware removal — a reminder surface whose job is now done by model behavior / request config is deleted outright, not shortened.

---

### 3.5 The `ambientContextTrailer` hoist — the structural enabler of the "don't tell the user" trims

**What it does:** rather than baking "don't mention this to the user" into each reminder string (which §3.2 removed from todo/task), 2.1.156 defines ONE shared constant and appends it only where it matters.

```javascript
// ============================================
// ambientContextTrailer - single hoisted "do not narrate" sentence, appended to delta/memory reminders
// Location: cli_inner_pretty.js:446489-446490
// ============================================

// ORIGINAL (for source lookup):
yT8 = "This is ambient context — do not narrate it to the user unless they ask or it is directly relevant to their request.",

// READABLE (for understanding):
const ambientContextTrailer = "This is ambient context — do not narrate it to the user unless they ask or it is directly relevant to their request.";

// Mapping: yT8->ambientContextTrailer
```

It is appended programmatically to the removed-branches of `deferred_tools_delta` (`445692`), `agent_listing_delta`, `mcp_instructions_delta`, and to `memory_update` (`445776`). **Why this is the right design:** it (a) decouples the "don't narrate" rule from every individual reminder body so it can be tuned in one place, (b) applies it only where it actually matters (delta/memory reminders the user shouldn't see narrated), and (c) lets the high-frequency reminders (todo/task) drop the rule entirely since the global system-prompt convention already covers them. This is the structural counterpart to the per-string trims — centralization, not duplication.

---

## 4. Anti-slim deep dives (the expansions that offset the savings)

A fair accounting must net the §3 savings against these correctness-driven *growths*. None is a slimming target; all are documented so writers don't claim a blanket reduction.

### 4.1 `invoked_skills` — short lead-in → long compaction-safety warning (≈ +70 tok)

```javascript
// ============================================
// invokedSkillsReminder - post-compaction replay; lead-in grew from one line to two paragraphs
// Location: cli_inner_pretty.js:445500-445509
// ============================================

// ORIGINAL (for source lookup):
return C_([
  T8({
    content: `The following skills were invoked EARLIER in this session (before the conversation was compacted), not on the current turn. They are shown here for context only so you remain aware of their guidelines.\n\nIMPORTANT: Do NOT re-execute these skills or perform their one-time setup actions (e.g., scheduling, creating files) again. The "## Input" sections below reflect the original arguments from when each skill was first invoked — they are NOT the user's current message. Only continue to apply ongoing behavioral guidelines from these skills where still relevant.\n\n${q}`,
    isMeta: !0,
  }),
]);

// READABLE (for understanding):
return wrapMessagesAsReminders([
  makeUserMessage({
    content: `The following skills were invoked EARLIER in this session (before the conversation was compacted)…\n\nIMPORTANT: Do NOT re-execute these skills or perform their one-time setup actions…\n\n${renderedSkills}`,
    isMeta: true,
  }),
]);

// Mapping: C_->wrapMessagesAsReminders, T8->makeUserMessage, q->renderedSkills
```

**Why it grew:** the 2.1.88 one-liner was unsafe after compaction. When a compaction summary re-injects previously-invoked skills, the model could mistake their `## Input` blocks for the *current* user message and re-run one-time setup (scheduling, file creation). The expansion is a *correctness* fix — the +70 tokens buy idempotency on replay. It fires only on post-compaction replay, so the cost is rare.

### 4.2 `relevant_memories` — recall-uncertainty lead-in added (≈ +12 tok, first memory only)

The first non-synthesis recalled memory now prepends `Retrieved for possible relevance — use only if it actually applies to what the user asked.` (`445546`). **Why:** recalled memories are surfaced heuristically and can be irrelevant; the lead-in signals epistemic uncertainty so the model treats them as candidate context, not as facts. Only the first memory carries it (`_ === 0 && !isSynthesis`), bounding the cost.

### 4.3 `deferred_tools_delta` — 2-state → 4-state, expanded added-line (≈ +40 tok and more)

The added-tools line gained the InputValidationError/`select:<name>` guidance, and two new states appeared — `readded` (MCP reconnect) and `pending` (servers still connecting, with the "Do not report a capability as unavailable without first searching" paragraph). The removed branch also appends `ambientContextTrailer` (`445692`). **Why:** the original 2-state form left the model guessing about MCP topology churn; the 4-state form encodes the full lifecycle (added / readded / removed / pending) and tells the model how to recover (search via ToolSearch, wait for connecting servers). Correctness over economy.

### 4.4 New cloud/remote surfaces (net additions, not slims)

- **`gh` rate-limit** (`269428`) — debounced per cooldown; teaches `gh api rate_limit` + `ScheduleWakeup` back-off so naïve retry loops don't burn the shared 5,000/hr budget.
- **Container-restart** (`623998`) — after a cloud container restart, the daemon's zombie task records would otherwise leave the model waiting forever; the reminder lists lost tasks and invites re-creation.
- **Ultraplan remote prompts** (`503304` single, `503325` single+mermaid, `503349` multi-agent) — SR-wrapped remote-planning scaffolds carrying the `__ULTRAPLAN_TELEPORT_LOCAL__` handoff sentinel; entirely new remote-planning surface absent from 2.1.88's local-only flow.
- **`memory_update`** (`445769-445776`) — on an async memory write, tells the model its in-context copy is stale; appends `ambientContextTrailer`.

---

## 5. Aggregate token-saving estimate

**Per typical turn (no Reads, no auto mode):** essentially **0 to slightly negative** (i.e. occasional net *growth*). On a turn where an occasional reminder happens to fire, the todo/task trims save ~12 tok, but `relevant_memories` (+12/memory), `deferred_tools_delta` (+40), or `invoked_skills` (+70) expansions can exceed that. The slimming program is **not** a per-turn win in the general case.

**Per Read-heavy session (the case that dominates real coding):** the malware removal is the whole story. With ~50 Reads at ~90-100 tok each, the *one-time* content saving is **~4,500-5,000 tokens**, but because each Read tool_result re-bills in the prompt on every subsequent turn, the *cumulative* token saving over a long session is **substantially larger** (Reads × remaining-turns). This is the dominant, real-world saving — and it is concentrated almost entirely in this single removal.

**Per-turn frequency ranking (which removals actually matter):**

| Reminder | Fires | 2.1.88 cost | Change | Net token impact |
|----------|-------|-------------|--------|-------------------|
| Per-Read malware (§3.1) | **EVERY Read** | ~90-100 tok | REMOVED | **Dominant** — × Read count, re-billed every turn |
| `auto_mode` (§3.3) | once/auto session | ~190 tok (full) | REWORDED to ~90 | Moderate, auto sessions only |
| Thinking-frequency (§3.4) | simple turns | ~30-50 tok | REMOVED | Secondary |
| `todo_reminder` (§3.2) | ≤ every 10 turns | small | −12 tok | Marginal |
| `task_reminder` (§3.2) | ≤ every 10 turns | small | −12 tok | Marginal |
| `relevant_memories` (§4.2) | per matched memory | — | +12 tok | Anti-slim |
| `invoked_skills` (§4.1) | post-compact replay | — | +70 tok | Anti-slim (rare) |
| `deferred_tools_delta` (§4.3) | on MCP topology change | — | +40-150 tok | Anti-slim (occasional) |

**Net program characterization:**
- **Biggest saving:** per-Read malware removal (§3.1) — dominant, multiplied by Read count × turn count.
- **Secondary savings:** thinking-frequency surface (§3.4), auto_mode rewrite (§3.3, auto sessions only), todo/task trims (§3.2, marginal), neutered generators (verify_plan, output_token_usage, context_efficiency) removing latent emission paths.
- **Offsetting growth:** `invoked_skills` (+70, rare), `deferred_tools_delta` (+40, occasional), `relevant_memories` (+12/memory), `queued_command` task-notification (+30), plus `ambientContextTrailer` (~22) on delta/memory removals — all correctness-driven.
- **New surfaces (not a slim):** `gh` rate-limit, container-restart, 3 ultraplan prompts, `memory_update`.

**Honest bottom line for writers:** Frame 2.1.156 as *"one decisive, high-frequency removal (the per-Read malware reminder) plus a disciplined trim of per-event restatements of global policy (NEVER-mention drops, auto_mode rewrite, thinking-frequency removal), partially offset by correctness-driven expansions of occasional reminders and new cloud/remote surfaces."* Do NOT claim a blanket slim-down — outside Read-heavy sessions the net byte movement can be flat or slightly positive.

### 5b. Reconciliation with reported eval (~40% reduction)

External eval data (user-reported) puts the reminder slimming at **~40%**. That figure is consistent with this analysis **on one specific, defensible basis: the fixed harness reminder-*instruction* footprint carried on a Read-bearing coding turn** (i.e. the boilerplate instructional reminder text, excluding dynamic payload like file contents, todo lists, and memory bodies, which are unchanged).

| Fixed reminder-instruction component (Read-active turn) | 2.1.88 (est. tok) | 2.1.156 (est. tok) |
|---------------------------------------------------------|-------------------|--------------------|
| Per-Read malware reminder × ~6 Reads in rolling context | ~570 | **0** |
| `auto_mode` policy (when active) | ~190 | ~90 |
| thinking-frequency clause + attachment | ~40 | 0 |
| `todo_reminder` / `task_reminder` tails | ~24 | 0 |
| SR-convention clause + CLAUDE.md block + empty/short warnings (KEPT) | ~600 | ~600 |
| **Total fixed reminder-instruction tokens** | **~1,420** | **~790** |

≈ **−44%** on this basis — matching the reported ~40%, driven overwhelmingly by the per-Read malware removal (§3.1), with the policy-tail / `auto_mode` / thinking trims secondary.

**Scope caveat (do not overstate):** the ~40% applies to the *fixed reminder-instruction surface on Read/coding turns*. It is **not** 40% of total prompt tokens (dynamic payload dominates and is unchanged) and **not** 40% on a no-Read chat turn, where the offsetting expansions (`invoked_skills` +70, `deferred_tools_delta` +40, `relevant_memories` +12) leave net movement ≈ flat. The headcount of Reads in the rolling context is the swing variable: more Reads → the malware removal pushes the reduction well above 40%; zero Reads → near 0%.

---

## 6. What was NOT changed (load-bearing reminders kept verbatim)

These were checked specifically because they were slimming candidates, and are byte-identical (modulo `—` em-dash escaping and tool-name interpolation) between 2.1.88 and 2.1.156:

- **`CYBER_RISK_INSTRUCTION`** (system prompt, `555398`) — the safety policy survives; only the *per-Read* malware reminder was removed. **This distinction is the most important fact in the report.** Verbatim text begins "IMPORTANT: Assist with authorized security testing, defensive security, CTF challenges…".
- **Read empty-file / short-file warnings** (`422944` / `422945`) — sit in the exact builder where the malware tail used to be appended (§3.1); kept verbatim.
- **File-too-large truncation reminder** (inside the `file`/`text` renderer) — keeps "Don't tell the user about this truncation." (a *load-bearing* "don't tell," NOT trimmed — distinguishes it from the redundant todo/task drops).
- **`edited_text_file`** (renderer near `446563-446573`) — keeps "Don't tell the user this, since they are already aware."
- **`mcp_resource`** (`445600-445634`) — keeps "Do NOT read this resource again…" across all branches.
- **`task_status`** (`445635-445656`) — killed/running/completed branches verbatim, including "Do NOT spawn a duplicate."
- **Side-question prompt** (`454123-454138`) — full IMPORTANT CONTEXT / CRITICAL CONSTRAINTS block verbatim; notably KEEPS its "Do NOT reference being interrupted" / "NEVER say things like…" lines (those weren't trimmed, unlike todo/task).
- **CLAUDE.md session-start context block** (`556130-556139`) — verbatim, including the literal 6-space-indented IMPORTANT line.
- **SR-convention system-prompt clause** (`555453`) — already the compact form in 2.1.88's active builder; unchanged. This is the *teaching* clause every inline reminder relies on.
- **Memory-age stale marker** (`oG6`/`Az7`, `221255-221268`) — verbatim, threshold `> 1 day` (`ME5`, `221252-221254`).
- **Brief-mode toggle** (`527818-527820`), **plan_mode_reentry / plan_mode_exit / auto_mode_exit / date_change** (renderers in the `445573+` region) — all byte-identical.

**Distinction worth stressing:** the surviving "Don't tell the user about this truncation" (file-too-large) and "Don't tell the user this" (edited_text_file) prove the trims were *selective*, not a blanket purge of "don't tell" phrasing. Those two are kept because they are **load-bearing** — they prevent the model from confusing the user about a real out-of-band action (truncation / external edit). The dropped todo/task tails were redundant restatements of a global convention. Same surface words, opposite fate, by design.

---

## 7. Verification log (commands that produced / confirmed the line numbers)

All run against `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`:

- Malware absence: `grep -c -i "malware|refuse to improve|augment the code|considered malware"` -> **0**.
- "NEVER mention this reminder" absence: `grep -c -i "NEVER mention this reminder"` -> **0**.
- Thinking-frequency absence: `grep -c -i "respond without a thinking block|tune your thinking frequency|on simpler user messages"` -> **0**.
- `CYBER_RISK_INSTRUCTION` present: `grep -n "authorized security testing|Dual-use security tools"` -> `555398`.
- Read builder (no mitigation arm) + empty/short warnings: Read `422930-422950` (builder `422933-422940`, warnings `422944-422945`).
- todo/task drops: Read `445511-445537` (todo text `445514`, task text `445528`, gate `OD()` `445525`).
- auto_mode rewrite: Read `445591-445599` (paragraph `445594-445596`).
- `ambientContextTrailer` (`yT8`): Read `446488-446491` (`446489-446490`).
- thinking_reminder noop: Read `445791-445807` (`445800`).
- Thresholds: Read `414012-414019` (`QV$` `414014`, `lg6` `414015`, `zw4` `414018`).
- invoked_skills expansion: Read `445488-445510` (lead-in `445502-445506`).
- relevant_memories expansion: Read `445538-445556` (lead-in `445546`).
- deferred_tools_delta 4-state: Read `445673-445712` (added line `445676`, readded `445682`, removed+`yT8` `445692`, pending `445700-445703`).
- memory_update + `yT8`: Read `445768-445785` (`445769-445776`).
- context_efficiency noop: Read `445671-445673`.
- verify_plan_reminder render: Read `445786-445789`.
- queued_command (`task-notification`/`peer` origin): Read `445557-445567`.
- gh rate-limit (`tV7`): Read `269424-269430` (`269428`).
- SR-convention clause: Read `555451-555455` (`555453`).
- CLAUDE.md session-start block (`KV8`): Read `556126-556141` (`556130-556139`).
- memory-age (`ME5`/`oG6`/`Az7`): Read `221252-221269`.
- ultraplan prompts: `grep -n "You're running in a remote planning session|Produce an exceptionally thorough implementation plan using multi-agent|__ULTRAPLAN_TELEPORT_LOCAL__"` -> sentinel `503276`, single `503304`, single+mermaid `503325`, multi-agent `503349`.
- container-restart: `grep -n "The container was restarted"` -> `623998`.
- side-question: `grep -n "This is a side question from the user"` -> `454123`.

---

## 8. Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Compact, Todo, Skills, Thinking)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools, Agents, State)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Prompt, MCP, Permissions)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions / constants in this document:
- `readFileResultBuilder` (in the Read tool result mapper) — builds Read tool_result content; no malware tail in 2.1.156 (`cli_inner_pretty.js:422933-422945`)
- `ambientContextTrailer` (obfuscated: `yT8`) — single hoisted "do not narrate" sentence (`cli_inner_pretty.js:446489-446490`)
- `wrapMessagesAsReminders` (obfuscated: `C_`) — list-of-messages SR wrapper used by nearly every renderer case
- `makeUserMessage` (obfuscated: `T8`) — message factory carrying `isMeta`
- `wrapStringAsReminder` (obfuscated: `S0`) — multiline `<system-reminder>…</system-reminder>` string wrap (`cli_inner_pretty.js:445237-445242`)
- `extractReminderContent` (obfuscated: `fi6`) — unwrap regex (`cli_inner_pretty.js:445243-445246`)
- `wrapStringSingleLine` (obfuscated: `Az7`) — single-line memory-age wrap (`cli_inner_pretty.js:221264-221268`)
- `memoryAgeText` (obfuscated: `oG6`) — memory-age plain text (`cli_inner_pretty.js:221255-221262`)
- `memoryAgeDays` (obfuscated: `ME5`) — days-since-mtime (`cli_inner_pretty.js:221252-221254`)
- `isTaskListFeatureEnabled` (obfuscated: `OD`) — TaskList feature gate for `task_reminder` (`cli_inner_pretty.js:445525`)
- `queuedCommandEnvelope` (obfuscated: `XG4`) — `[SYSTEM NOTIFICATION - NOT USER INPUT]` wrapper for `queued_command`
- `REMINDER_THRESHOLDS` (obfuscated: `QV$`) — `{TURNS_SINCE_WRITE:10, TURNS_BETWEEN_REMINDERS:10}` (`cli_inner_pretty.js:414014`)
- `PLAN_ATTACHMENT_CADENCE` (obfuscated: `lg6`) — `{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}` (`cli_inner_pretty.js:414015`)
- `MEMORY_REMINDER_THRESHOLD` (obfuscated: `zw4`) — `{TURNS_BETWEEN_REMINDERS:10}` (`cli_inner_pretty.js:414018`)
- `ghRateLimitReminder` (obfuscated: `tV7`) — debounced gh rate-limit reminder (`cli_inner_pretty.js:269424-269430`)
- `prependCachedContextReminder` (obfuscated: `KV8`) — CLAUDE.md session-start context block (`cli_inner_pretty.js:556126-556143`)

> NOTE: If any of the above symbols are not yet recorded in `symbol_index_core_features.md`, add them there (System Reminder module section) as the final step — not as a table in this module doc.
