# Changelog Analysis — Claude Code v2.1.143 → v2.1.156

This document is the **long-form narrative** for the v2.1.143 → v2.1.156 window. It complements:

- The nine per-module deep-dive trees under `../` (workflow, model, lean prompt, code-review, background agents, hooks, permissions, tools, skills)
- The four `symbol_index_*.md` files — [core execution](symbol_index_core_execution.md), [core features](symbol_index_core_features.md), [platform infra](symbol_index_infra_platform.md), [integration infra](symbol_index_infra_integration.md)
- The nine per-module additions tables — `symbol_additions_v2_1_156_*.md`
- The prior window's narrative — [`../../../claude_code_v_2.1.142/analyze/00_overview/changelog_analysis.md`](../../../claude_code_v_2.1.142/analyze/00_overview/changelog_analysis.md) (v2.1.113 → v2.1.142)

Every factual claim is cited as `cli_inner_pretty.js:<line>`, verified by reading that line in the v2.1.156 bundle at `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`.

The window spans 14 version numbers but **11 published releases** (v2.1.143, .144, .145, .147, .148, .149, .150, .152, .153, .154, .156). Three numbers were never published (.146, .151, .155); v2.1.148 was a one-line Bash-exit-code hotfix; v2.1.150 shipped as "internal infrastructure improvements" with no public items. The window's center of gravity is **v2.1.154** — the single largest release in the entire two-window history, shipping Opus 4.8, Dynamic Workflows, the lean system prompt, the `/simplify` re-split, fast-mode pricing, and shell-exec background sessions all at once. v2.1.156 is then a tightly-scoped **thinking-block hotfix** for Opus 4.8 plus a cluster of background-agent and permission corrections.

---

## 1. Release Cadence

| Version | Items | Theme |
|---------|------:|-------|
| v2.1.143 | ~30 | Stop-hook block cap, plugin agent-type fixes, PowerShell `if`-condition matching, pasted-text delivery |
| v2.1.144 | small | (rolled up into 145 in many trackers) daemon stale-exec fallback groundwork |
| v2.1.145 | ~30 | Read PARTIAL-view truncation, Stop-hook `background_tasks`/`session_crons`, bare-var-assignment bypass, `context: fork` self-reinvoke fix |
| v2.1.147 | ~30 | **`/simplify` → `/code-review` rename + effort levels + `--comment`**, pinned bg sessions, plugin-agent tools-list fix |
| v2.1.148 | 1 | Bash exit-127 regression hotfix |
| v2.1.149 | ~25 | `/usage` per-category breakdown, **PowerShell built-in `cd` bypass + `PWD`/`OLDPWD`/`DIRSTACK` stale-tracking**, GFM task checkboxes |
| v2.1.150 | 0 | Internal infrastructure only |
| v2.1.152 | ~40 | **`/code-review --fix`, `disallowed-tools` frontmatter, `/reload-skills`, SessionStart `sessionTitle`/`reloadSkills`, `MessageDisplay` hook, auto-mode consent removed**, model-default save |
| v2.1.153 | ~40 | Binary-takeover of stale daemon, `skipLfs`, subagent frontmatter MCP `--strict-mcp-config`, many bg-attach UX fixes |
| v2.1.154 | ~50 | **THE FLAGSHIP: Opus 4.8, Dynamic Workflows, lean system prompt, AskUserQuestion reservation, `/simplify` cleanup-only, `! <command>`/`--exec` bg sessions, Faster/Smarter relabel, exfiltration classifier** |
| v2.1.156 | ~45 | **Opus 4.8 thinking-block hotfix**, bg-agent reliability cluster, `rm -rf $HOME` trailing-slash, `$TMPDIR` unification, MCP-policy partial validation, could-not-evaluate budget bump |

Average cadence is roughly bi-weekly, identical to the prior window. The structural difference is the **bimodal shape**: a long tail of small reliability releases (143–153) feeding into one enormous feature drop (154), then a fast hotfix (156). This is the classic "stabilize the runway, then land the plane" pattern — every reliability fix in 143–153 (binary-takeover, daemon stale-exec, pinned-session handling, partial-view reads) is a precondition for the 154 features (Workflows lean on the background-agent daemon; Opus 4.8 leans on the effort/thinking plumbing).

---

## 2. The "Big Three" of This Window

If you only remember three things about v2.1.143 → v2.1.156:

### A. Opus 4.8 (v2.1.154) + thinking-block hotfix (v2.1.156)
A new flagship model registered across all seven provider surfaces, defaulting to `high` effort with a new `xhigh` level above it. Default-on thinking on 4.8 is what made the v2.1.156 hotfix necessary. Deep-dive: [`../43_model_opus48/`](../43_model_opus48/).

### B. Dynamic Workflows (v2.1.154)
A single `Workflow` tool that takes a self-contained JavaScript orchestration script and fans work out across **tens to hundreds of subagents** in the background, with a determinism-based resume journal. The flagship product surface, built on top of the background-agent daemon. Deep-dive: [`../42_workflow/`](../42_workflow/).

### C. The Lean System Prompt (v2.1.154)
A second, parallel system prompt that collapses six multi-paragraph behavioral sections into one ~6-bullet `# Harness` section, made the default for capable models (Opus 4.8 + frontier first-party). A bet that capable models behave well from terse guidance, saving context budget every turn. Deep-dive: [`../44_lean_prompt/`](../44_lean_prompt/).

These three are not independent. **Opus 4.8 is the model that triggers the lean prompt by default** (the `claude-opus-4-8` case in `isFullPromptModel` `c45` returns false ⇒ lean, `cli_inner_pretty.js:143861`), and **`ultracode` — the session mode that bundles `xhigh` effort with standing workflow orchestration — is the seam where the effort UI and Dynamic Workflows meet** (`ultracode` requires both an xhigh-capable model and workflows enabled, `cli_inner_pretty.js:51700-51706`). The 154 release is best read as a single co-designed launch, not three features that happened to ship together.

---

## 3. Dynamic Workflows — The Flagship

**What it does:** Dynamic Workflows is a single `Workflow` tool (`mx = "Workflow"`, `cli_inner_pretty.js:216291`) that takes a self-contained JavaScript orchestration script, runs it in a sandboxed VM in the background, and fans work out across tens to hundreds of subagents *deterministically*. The model authors the program inline (`script`), names a saved one (`name`), or points at a file (`scriptPath`); the runtime exposes `agent()`, `pipeline()`, `parallel()`, `phase()`, `log()`, `args`, and `budget` primitives, returns a task ID **immediately**, and notifies on completion. `/workflows` shows live and completed runs.

### 3.1 The two-plane architecture

The subsystem splits cleanly into a **control plane** (does the tool exist? may the model call it? what bounds a run? how does it resume?) and a **data plane** (the tool object, schemas, the untrusted-script parser, and the VM that spawns subagents).

**The four-layer enablement gate (`isWorkflowsEnabled` / `NZ`, `cli_inner_pretty.js:184757-184763`):**

```javascript
function NZ() {
  if (H48()) return !1;            // policy hard-disable
  if (!r$7()) return !1;           // k7("allow_workflows") policy allow
  let { available: H, defaultOn: $ } = KP6();  // env + tengu_workflows_enabled gate
  if (!H) return !1;
  return hL5() ?? $;               // settings.enableWorkflows override, else defaultOn
}
```

The interesting decision is in `resolveWorkflowAvailability` (`SL5`, `cli_inner_pretty.js:184780-184789`): when `CLAUDE_CODE_WORKFLOWS` is neither explicitly-true nor explicitly-false and the `tengu_workflows_enabled` gate is on, the default-on flag is `_4() !== "pro"` — **workflows default ON for everyone except the Pro tier**. This is a deliberate cost-and-load decision: a workflow can spawn up to 1000 agents, so the team gates the default against the cheapest tier (the agent-call cap and token budget protect Pro users who explicitly enable it, but defaulting it off avoids surprising them with a fleet of background agents).

**Why a four-layer gate?** Each layer answers a different stakeholder's "no": `H48()` is the org/policy hard-disable; `r$7()` is the per-org allow flag; `KP6()` is the Anthropic-side feature gate (so the team can dark-launch and kill-switch server-side); `hL5()` is the user's own `settings.enableWorkflows`. Defense in depth: `NZ()` is re-checked at the tool's `isEnabled` (the model never sees a tool it cannot use), again inside `validateInput` (errorCode 6 if state changed mid-turn), and the gate result is memoized in `$48` so the 16+ calls per turn are cheap.

### 3.2 `meta` is the trust boundary

The single most important design decision in the data plane is that the script must begin with `export const meta = {...}` as a **pure literal**, and the runtime statically evaluates it with `parseWorkflowMeta` (`FZ`, `cli_inner_pretty.js:371746`) — **no `eval`, no prototype-pollution keys, no string interpolation**. This lets the runtime learn a workflow's name, description, and phases *without executing the untrusted program*. Everything the user sees in the approval dialog comes from this AST-evaluated `meta`, so a malicious script cannot make its approval prompt say one thing and its body do another.

**Why static evaluation over a sandboxed `eval`?** A sandboxed `eval` of `meta` would still run attacker-controlled code (a getter on the literal, a `toString` side effect). Parsing the literal as an AST and evaluating only the allowed node types (string, number, boolean, array, object with literal keys) means there is no code path for the script to run before the human approves it. This is the same principle as the `terminalSequence` parse-and-reformat sanitizer from the prior window — **narrow the input to a provably-safe subset rather than trying to block the dangerous cases.**

### 3.3 Determinism enables resume

Scripts must be **deterministic** — `Date.now()`, `Math.random()`, and `new Date()` are rejected in `validateInput` (errorCode 4). This is not a stylistic preference; it is load-bearing for **resume**. The journal (`bp6`, JSONL append-only) caches each `agent()` result keyed on a SHA-256 of `(phase, prompt, canonical opts)`. On `resumeFromRunId`, the runtime replays the **longest unchanged prefix** of `agent()` calls as instant cache hits, then continues from the first divergence. Replay only works if re-running the script produces the same `agent()` call sequence — hence the hard ban on non-determinism.

**Key insight:** The resume design treats a 100-agent workflow that failed at agent 87 not as "re-run 100 agents" but as "replay 86 cache hits, re-run from 87." The SHA-256-keyed journal is what makes a hundred-agent background task economically resumable — without it, a transient failure deep in a fan-out would be catastrophically expensive to recover.

### 3.4 Resource caps

A running script is bounded by four independent guards (`../42_workflow/gate_caps_lifecycle_relations.md`):

| Cap | Symbol | Value | Purpose | Location |
|-----|--------|-------|---------|----------|
| Agent-call ceiling | `F74` → `Q74` | **1000** | Catch unbounded `agent()` loops | cli_inner_pretty.js:375678, 375740 |
| Token budget | `fW8` | turn-spend derived | Stop new `agent()` once budget spent; in-flight finish | cli_inner_pretty.js:375746 |
| Concurrency | `dG_` | `min(16, max(2, cores-2))` | Fan-out width; reserve 2 cores, cap 16 | cli_inner_pretty.js:374930 |
| Per-agent stall | `tG_` | **180000** (3 min) | Abort a single stalled agent, free its slot | cli_inner_pretty.js:375699 |

The concurrency formula `min(16, cores-2)` is the most considered: reserve two cores for the daemon's own supervisor + the host's interactive session, but never exceed 16 even on a 64-core machine (beyond 16, the bottleneck shifts from local CPU to the API rate limit, so more concurrency just queues). This is a CPU-aware default that degrades gracefully on laptops and doesn't over-promise on servers.

**Trade-off — fire-and-forget vs. completion status:** the output schema only allows `async_launched` / `remote_launched`; there is no `completed` status. Even a compile failure returns a normal result with `error` set rather than throwing. The cost is that the model never blocks on a workflow — it gets a task ID and must check `/workflows` or wait for the task notification. The benefit is that a 100-agent, multi-hour workflow never holds the interactive session hostage.

**UNC rejection** (`cli_inner_pretty.js:145295`): `scriptPath` pointing at a `\\server\share` UNC path is rejected outright — a Windows-specific path-injection guard, consistent with the permission-system discipline of refusing path forms the static analyzer cannot reason about.

Cross-link: [`../42_workflow/`](../42_workflow/) (README + `workflow_tool_definition.md` for the data plane, `gate_caps_lifecycle_relations.md` for the control plane, `workflow_runtime_and_subagents.md` for the VM execution runtime + DSL semantics + subagent prompts).

---

## 4. Opus 4.8, Effort/xhigh, and Fast Mode

**What changed:** v2.1.154 launches `claude-opus-4-8` as the new default Opus; v2.1.156 ships the hotfix that keeps it stable. The launch touches a fixed set of sites — model id map, label, cost, effort default, output cap, membership — and 4.8 hits every one.

### 4.1 The canonicalization chokepoint

The structural reason a model launch is near-mechanical: every downstream decision first funnels the raw provider id through `resolveModelCanonicalId` (`O7`) → `normalizeModelIdToCanonical` (`HD`). So each per-site `switch`/`if` ladder needs exactly one new `claude-opus-4-8` case. The seven-provider id map (`OPUS_48_MODEL_CONFIG` / `Xi$`, `cli_inner_pretty.js:91825-91833`) registers 4.8 across firstParty, bedrock, vertex, foundry, anthropicAws, mantle, and gateway, and grows the config shape with a new `eagerInputStreaming: { bedrock: !0, vertex: !0 }` field (which is also what enables always-on streaming tool execution on those providers — see §10).

### 4.2 The staged default

`getDefaultOpusModel` (`TT`, `cli_inner_pretty.js:98720-98725`) is deliberately conservative:

```javascript
function TT() {
  if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  if (!UA()) return Yz()[Re];          // true third-party marketplace → 4.6
  if (Zq() !== "firstParty") return Yz().opus47;  // anthropicAws/gateway launch tier → 4.7
  return Yz().opus48;                   // raw first-party → 4.8
}
```

**The id is universal; the defaulting is phased.** Every provider *recognizes* `claude-opus-4-8`, but the model you get by default depends on your tier: 4.8 on raw first-party, 4.7 on the launch tier, 4.6 on true third-party. This is the same policy-lever pattern observed in the prior window (Fast Mode 4.6 → 4.7) — the team treats the default model as a staged rollout, advancing it provider-by-provider as confidence builds, while keeping the id recognizable everywhere so an explicit `/model claude-opus-4-8` works regardless of tier.

### 4.3 The effort system matured to five levels

The persisted enum gained `xhigh` (`["low","medium","high","xhigh"]`, `cli_inner_pretty.js:51690`) and the cloud review path adds a sixth `max` ceiling. Per-model defaults converged via `getDefaultEffortForModel` (`q48`, `cli_inner_pretty.js:184987-184991`): Opus 4.8 defaults to `high`, Opus 4.7 to `xhigh`, everything else to `high`. The asymmetry (4.7 defaults *higher* than 4.8) reflects that 4.8 is more capable per effort level — it reaches at `high` what 4.7 needed `xhigh` for.

**The 400-error fix** is the cleanest illustration of the canonicalization payoff. The `effort` request param is now injected only when `modelSupportsEffort` (`A2`) is true (`cli_inner_pretty.js:568321`):

```javascript
...(A2(L) && { effort: { level: Ev(L, w) } }),
```

Before this guard, sending `effort` to a model that does not support it produced an API 400 — particularly when `CLAUDE_CODE_ALWAYS_ENABLE_EFFORT` was set (the 2.1.156 changelog line). The fix is a single capability-gate spread: effort-incapable models simply never receive the field. The `resolveAppliedEffort` resolver (`or`) separately clamps `max`/`xhigh` down to `high` on incapable models, so the UI can offer the level even when the underlying model would reject it.

### 4.4 Fast mode is 2x, not 6x

Opus 4.8 fast pricing (`OPUS_48_FAST_COST` / `bx1`, `cli_inner_pretty.js:98540-98546`) is `{inputTokens: 10, outputTokens: 50}` — *exactly* 2x the standard 5/25 rate. The legacy fast tariff (`OPUS_LEGACY_FAST_COST` / `Cx1`, `cli_inner_pretty.js:98533-98539`) was `{inputTokens: 30, outputTokens: 150}` — 6x standard. That is a **3x reduction** in the fast-mode premium (the changelog's "2x the standard rate for 2.5x the speed"). The deprecated `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` (removal 06/01) is replaced by the explicit `/model claude-opus-4-6[1m]` + `/fast on` flow — a deliberate move from a magic env var to a discoverable two-command sequence.

**Why drop the premium?** A 6x premium meant fast mode only paid for itself on the most latency-sensitive tasks. At 2x for 2.5x speed, fast mode is *cheaper per unit of work* (you pay 2x but finish 2.5x faster on wall-clock-bound interactive turns), which inverts the economics from "premium feature" to "often the rational default for interactive use."

### 4.5 The /effort slider relabel

The `/effort` end-labels changed from *Speed / Intelligence* to **Faster / Smarter** (`cli_inner_pretty.js:527381, 527383`). This is pure UX, but a considered one: "Speed/Intelligence" framed the choice as a quality trade-off (more speed = less intelligence), which is misleading — `high` is not "dumb." "Faster/Smarter" frames it as a tuning dial on the same capable model. Capability tags (`xhigh` = "Opus 4.8/4.7 only", `max` = "Opus 4.6+, Sonnet 4.6") and an optional violet `ultracode` rail were added to the picker.

### 4.6 The 2.1.156 thinking-signature hotfix — the reason 156 exists

Opus 4.8 ships with **default-on thinking**, and thinking blocks carry a cryptographic **signature** that the API verifies byte-for-byte. When a session replays a signed thinking block that was produced under different conditions (a model switch, a login switch, a stale-history replay), the signature fails verification and the API returns a 400 that wedges the session.

The fix adds a reactive 400-matcher, `isThinkingSignatureError` (`B87`, `cli_inner_pretty.js:186575-186583`):

```javascript
function B87(H) {
  if (!(H instanceof rq) || H.status !== 400) return !1;
  let $ = H.message.toLowerCase();
  if ($.includes("signature in thinking block")) return !0;
  return (
    ($.includes("thinking block") || $.includes("`thinking`") || $.includes("redacted_thinking")) &&
    ($.includes("cannot be modified") || $.includes("invalid signature"))
  );
}
```

When `B87` matches, the runtime drives a strip-and-retry via `stripSignedThinkingBlocks` (`cG4`) — it removes the offending signed blocks from history and re-sends. The retry is gated on reference identity (it only strips once, then retries) so it cannot loop forever.

**Why strip-and-retry rather than never-replay?** Thinking blocks are valuable context — discarding them proactively on every request would lose reasoning continuity and waste cache. The design keeps thinking blocks in history (proactive cross-model strip `dG4` handles the *known* mismatch cases at request-build time) and only reactively strips when the API actually rejects a signature it cannot verify. This is the same "primary path optimistic, reactive path as safety net" structure as proactive-vs-reactive compaction from the prior window.

Cross-link: [`../43_model_opus48/`](../43_model_opus48/) (model mapping, effort defaults, fast pricing, slider UI, thinking hotfix) and [`../44_lean_prompt/`](../44_lean_prompt/) for the prompt that 4.8 triggers.

---

## 5. The Lean System Prompt

**What changed:** v2.1.154 introduced a second, parallel system prompt — the *lean* prompt — and made it the default for capable models. Changelog: "The lean system prompt is now the default for all models except Haiku, Sonnet, and Opus 4.7 and earlier."

### 5.1 What "lean" is — three prompt modes

Inside the one shared assembler `buildSystemPromptSections` (`N0`, `cli_inner_pretty.js:555614`), three modes are checked in sequence:

| Mode | Trigger | Body |
|------|---------|------|
| **Simple** | `CLAUDE_CODE_SIMPLE` env | Near-empty: just CWD + Date |
| **Lean** | model gate + overrides | One `# Harness` section (6 bullets) + dynamic sections |
| **Full** | default for haiku/sonnet/opus≤4.7 + unknown 3p | Six behavioral sections + dynamic sections |

The full body's six multi-paragraph sections (intro+cyber-risk, `# System`, `# Doing tasks`, `# Executing actions with care`, `# Using your tools`, `# Tone and style`) collapse to a single ~6-bullet `# Harness` section (`oXz`, `cli_inner_pretty.js:555591-555607`). The same gate also flips ~16 sub-sections and tool descriptions to terser variants.

### 5.2 The gate is a capability bet, not a weakness check

The gate `isLeanSystemPrompt` (`X3`, `cli_inner_pretty.js:143872-143877`) is:

```javascript
X3 = v8((H) => {                                       // memoized by model id
  if (!H) return !1;                                   // no model → full
  if (xH(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return !0;  // env force-lean
  if (k4(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return !1;  // env force-full
  return !c45(H) || d45(H);                            // !isFullPromptModel || isForcedLean
});
```

The crucial design point is that this is **not** "is this a weak model" — it is "should we trust this model to behave well from terse guidance." `isFullPromptModel` (`c45`) returns true (⇒ keep FULL) for Claude 3.x, Haiku, Sonnet, and Opus 4.0–4.7; returns false (⇒ lean) for `opus-4-8` (`cli_inner_pretty.js:143861`); and for unknown ids falls through to `!UA()` — lean for first-party/AWS/gateway, **full for unknown third-party** (bedrock/vertex/foundry/mantle). So the bet is: *frontier first-party models and the new flagship get terse guidance to save context; everything older or third-party-hosted keeps the full scaffolding.* The conservative third-party default is the safety valve — an unknown model on an unknown provider gets the belt-and-suspenders prompt.

### 5.3 Why this exists — token economy

The deep-dive [`../44_lean_prompt/lean_prompt_rationale_and_rollout.md`](../44_lean_prompt/lean_prompt_rationale_and_rollout.md) makes a subtle point: the section cache makes the prompt *compute*-once, but **not token-cheaper**. Caching avoids re-running string assembly, but the assembled prompt is still sent (or cache-read) every turn at full token cost. Shrinking the *text* is therefore the only lasting per-turn win — six sections of behavioral instruction that a capable model already internalized from training are pure overhead on every single turn of a long session. On a 1M-context Opus 4.8 session spanning hundreds of turns, trimming ~2-3K tokens of system prompt compounds into real cost and latency savings.

### 5.4 The monotone rollout stack

Because `X3 = !c45 || d45`, the override channels can only *add* models to the lean set, never remove them:

```
1. CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT env  (operator override, beats everything)
2. clientDataCache.simple_system_prompt  (server push, force-lean only)
3. tengu_velvet_cascade growthbook        (staged rollout, force-lean only)
4. c45 capability gate                    (the static baseline)
```

This makes the server-side rollout **monotone and safely reversible without a client deploy**: the team can dark-launch lean to a model cohort via growthbook, and if it regresses, simply removing it from the cohort falls back to the `c45` baseline. The env var sits above both so an operator always has the final say. This is the same dark-launch discipline as the workflows `tengu_workflows_enabled` gate — feature flags that can only widen, never break, the safe default.

Cross-link: [`../44_lean_prompt/`](../44_lean_prompt/).

---

## 6. /code-review and /simplify

**What changed:** The review surface is now **two distinct bundled prompt commands plus one cloud escalation path**, all registered through the same generic registrar `registerBundledPromptCommand` (`bA`, `cli_inner_pretty.js:524187`). The journey across the window:

- **2.1.147** — renamed `/simplify` → `/code-review` (`Y18 = "code-review"`, `cli_inner_pretty.js:211646`); added effort levels, the `parseCodeReviewArgs` state machine, and `--comment` inline-PR-comment posting; removed the old cleanup-and-fix behavior.
- **2.1.152** — `/code-review --fix` applies findings to the working tree; `/simplify` became a thin wrapper for `/code-review --fix`.
- **2.1.154** — re-split: `/simplify` regained its own **cleanup-only** 4-agent prompt (`vO9`/`Ehz`), separate from `/code-review`'s bug-hunting. This is the shape captured in the 2.1.156 bundle.

### 6.1 The prompt compiler

The defining design idea is a **prompt compiler**: a shared fragment palette (one `var` per review angle and per phase) is concatenated in different combinations to produce five distinct review playbooks (low → medium → high → xhigh → max). The five effort bodies share ~80% of their text, so factoring every angle/phase into a single `var` means a wording fix to "Angle B" or the Reuse angle propagates to all levels *and* to `/simplify` automatically.

The effort level controls four coupled knobs at once:
1. Number of finder angles (1 → 7 → 9)
2. Candidates per angle (none → 6 → 8)
3. The verifier's precision-vs-recall prior
4. Whether a final gap-sweep runs (findings cap 4 → 8 → 10 → 15)

**Precision/recall on the verifier, not the finder** is the cleverest detail. Going medium → high does *not* add finder angles; it swaps the verifier's prior (neutral → recall-biased) and raises the cap. The same broad finder net is used everywhere; only the gate tightens or loosens. This means raising effort never *misses* a bug a lower effort would catch (the finder is constant) — it only changes how aggressively the verifier promotes candidates to findings. This is a principled separation: recall lives in the finder (always wide), precision lives in the verifier (effort-tuned).

### 6.2 The command runs zero tools

`/code-review`'s entire behavior is string assembly: parse the arg line (`parseCodeReviewArgs`, `_O9`, `cli_inner_pretty.js:600530`), pick an effort level, splice the matching effort-specific prompt body, append optional `--comment`/`--fix` blocks, and hand the assembled prompt to the model. The model then does the reviewing by spawning `Agent` finder/verifier sub-agents (`sq = "Agent"`, `cli_inner_pretty.js:185637`) — **the command itself runs no tools.** This is the same "compose existing primitives" philosophy as `/goal` from the prior window: a complex behavior built entirely from prompt-engineering on top of an existing tool (the Agent tool), no new runtime machinery.

### 6.3 The /simplify re-split rationale

Why split `/simplify` back out of `/code-review --fix` in 154 after merging them in 152? Because they answer different questions. `/code-review` hunts for **correctness bugs**; `/simplify` does **cleanup only** (Reuse / Simplification / Efficiency / Altitude) and explicitly does *not* hunt for bugs (4 parallel cleanup agents, dedup, apply). Merging them in 152 meant "make this cleaner" implicitly ran a bug hunt — slower and noisier than the user wanted. The 154 re-split honors the user's intent: cleanup is a quality pass, review is a correctness pass, and conflating them served neither well.

### 6.4 The cloud ultra bridge

`/code-review ultra` (deprecated alias `/ultrareview`) is a deep multi-agent review **in the cloud** — the local CLI only orchestrates: gate (`WF`, `cli_inner_pretty.js:502747` — config enabled ∧ CCR bridge ∧ not-remote) → scope → preflight → teleport launch. The "bughunter" fleet executes server-side and streams results back as a task notification. This is the one path that leaves the local session, and it reuses the cloud launch/poll machinery documented in the 2.1.142 tree's `40_ant_promoted/` ultrareview analysis.

Cross-link: [`../45_code_review/`](../45_code_review/).

---

## 7. Background-Agent Maturation — `! <command>` / `--exec` + Reliability

The v2.1.142 module documented the *foundation* (dashboard, daemon, rv-socket protocol, worker phase machine). This window is a **delta**: a new shell-exec capability and a focused reliability pass.

### 7.1 Shell-exec background sessions (NEW in 2.1.154)

You can now run a raw shell command as a first-class background session — `claude --bg --exec '<cmd>'` from the CLI, or `! <command>` typed in the `claude agents` view. **There is no LLM in the loop**: the bg worker `exec`s `$SHELL -c "<cmd>"` directly.

The whole feature is expressed as a single `exec` option on the dispatch seed, with two front doors converging on one seam:

```
claude --bg "fix the test"      → ol(fullArgv)        → launch.mode = "prompt"  (Claude agent)
claude --bg --exec 'pytest -x'  → ol([], …, {exec})   → launch.mode = "exec"    (raw shell)
! pytest -x  (in agents view)   → pe4 → ol([],{exec})  → launch.mode = "exec"    (raw shell)
```

The CLI `--exec` handler (`hwz`, `cli_inner_pretty.js:541956`) parses `--exec`/`--exec=`, captures the command, and warns "`--exec ignores ... (only --name composes)`" for any other agent flag (`cli_inner_pretty.js:541972`). This compose rule is the tell that exec sessions are *not* Claude sessions — there is no model, no system prompt, no effort level, so `--model`/`--effort`/etc. are meaningless and explicitly ignored.

### 7.2 The unified dispatcher `ol`

In 2.1.156, *every* bg dispatch — `--bg`, `--bg --exec`, the `!` bang, the `/bg` REPL handoff, daemon-side fleet respawn, and pre-warmed spare claim — funnels through one async seam, `unifiedBgDispatch` (`ol`, `cli_inner_pretty.js:541769`). `ol` runs the permission gate (`bgDispatchGate` / `Bwz`) and allocates identity; its worker `dispatchWorker` (`ywz`) chooses the launch mode via a cascade — `opts.exec` → `{mode:"exec"}`, resume flags → `{mode:"resume"}`, else → `{mode:"prompt"}` — seeds on-disk job state, sends the dispatch, and runs an ack-timeout rescue.

**Why unify?** Before, each front door had its own dispatch path, so a fix to the permission gate or the ack-timeout rescue had to be applied N times. Funneling everything through `ol`/`ywz` means the gate, identity allocation, state seeding, and rescue logic exist exactly once. The launch-mode cascade is the *only* per-front-door variation, and it is a small discriminated switch rather than three parallel code paths.

**The two exec-respawn special cases** capture a real safety concern: exec sessions are re-run on **explicit** respawn but **excluded** from version-upgrade respawn (`isExecSession` / `ujH`, `cli_inner_pretty.js:184286`). You must never silently re-run `npm publish` just because the daemon upgraded itself in the background. This is the kind of edge case that only surfaces once you let users run arbitrary shell commands as long-lived background sessions.

### 7.3 The reliability cluster (v2.1.156)

The 156 changelog has a dense block of background-agent fixes, each closing a specific class of bug:

- **Premature "out of context" on 1M models from bg completion notifications** — bg completion notifications were being counted against the context budget on large-context models, falsely tripping the overflow path.
- **Classifier losing the user's goal when a scheduled `/command` fires** — the four-state session classifier (`classifyState` / `JT4`) drives phone push notifications; a cron-injected command turn was clearing the goal snapshot (`SessionStateTracker` / `nS$`, `cli_inner_pretty.js:623957`) that the classifier needs to stay on-task.
- **Pinned bg sessions respawning every minute after an update** — the upgrade-respawn path was firing repeatedly on pinned sessions, causing notification spam and process churn at idle.
- **Sessions stuck at blocked/running/working not retiring after idle grace** — the "settled" predicate that decides whether a worker can retire was too narrow; broadened in `BgWorkerHandle.retireIfSettled` (`cli_inner_pretty.js:560062`).
- **Subagents in bg sessions bypassing the worktree-isolation guard** — the guard `worktreeIsolationGuard` (`esH`, `cli_inner_pretty.js:346660`) gained an `agentId` subagent branch so subagents pick the right cwd and stop writing to the shared checkout.
- **Orphaned `claude --bg-pty-host` at 100% CPU after daemon exit (macOS)** — the PTY host (`runPtyHost` / `jPz`, `cli_inner_pretty.js:559067`) gained an orphan watchdog that SIGTERM/SIGKILLs a re-parented, clientless REPL child after ~60s.

The unifying theme: shell-exec and Workflows both *lean harder* on the background-agent daemon than the prior interactive-only bg sessions did, so the window's reliability pass is largely about making the daemon trustworthy enough to host hundred-agent workflows and long-running shell commands. Every fix here is a precondition for the flagship features in §3.

Cross-link: [`../36_background_agents/`](../36_background_agents/) (shell-exec, unified dispatcher, classifier, worker retire/respawn, worktree/pty, daemon takeover). The unchanged foundation is in [`../../../claude_code_v_2.1.142/analyze/36_background_agents/`](../../../claude_code_v_2.1.142/analyze/36_background_agents/).

---

## 8. Hooks Platform — MessageDisplay, sessionTitle, reloadSkills, Stop-hook arrays

The hook *platform* is unchanged (same input union, `hookSpecificOutput` discriminated-union output, typed-executor dispatch). What lands is three new capabilities slotted into that mature plumbing.

### 8.1 MessageDisplay — the first display-only hook

`MessageDisplay` (`cli_inner_pretty.js:49289`, the newest/last entry in the canonical event-name array) is the first hook in the catalog that is **purely cosmetic**: it can rewrite or hide assistant text *on screen* while it streams, **without ever touching the transcript on disk or the text the model reads on its next turn.**

This is backed by a dedicated per-message streaming engine (`createMessageDisplayEngine` / `OW9`, `cli_inner_pretty.js:626930`) that converts a token stream into whole-line, debounced (100ms), in-flight-capped (3) hook invocations, fails open to the original text on any error, and survives re-renders via a separate completed-message rewrite path (`MW9`). The typed executor (`executeMessageDisplayHooks` / `l6$`) runs with two unusual flags:
- `forceSyncExecution: true` — a display hook *must* be awaited; a backgrounded result would arrive after the line is already on screen.
- `suppressPerInvocationTelemetry: true` — dozens of per-flush events are rolled up into one `tengu_message_display_hooks` summary.

**Why a display-only channel?** The prior hook surface had a *model-visible* output channel (`updatedToolOutput`) but no way to change what the *user* sees without also changing what the *model* sees. MessageDisplay fills exactly that gap — redact a secret on screen, localize text, add annotations — while keeping the transcript and model context byte-identical. The fail-open design is essential: a buggy display hook degrades to showing the original text, never blanks the screen.

### 8.2 sessionTitle and reloadSkills — session-shell write surfaces

SessionStart hooks gained two output fields (v2.1.152):
- **`sessionTitle`** sets the session title (same effect as `/rename`) via a cache-vs-apply split: at startup/resume it caches into live state (no persist); mid-session it applies through the `/rename` machinery tagged `source:"hook"`. The split exists because at startup there is no session to persist *into* yet.
- **`reloadSkills: true`** asks Claude Code to re-scan skill/command directories after SessionStart hooks finish, so skills the hook *just installed* are usable in the same session — a programmatic `/reload-skills`.

The `reloadSkills` field exists because of an **ordering constraint**: the skill index is built *before* SessionStart hooks run. A hook that `mkdir`s a brand-new `.claude/skills/` directory would otherwise have its skills invisible until the next session. `reloadSkills` is the escape hatch — it busts the memoized loader caches (`clearSkillListingCaches` `_C` → `resetConditionalSkillState` `Bo` → `skillReloadEmitter.emit`) so the next pull re-walks disk. This is the same primitive the `/reload-skills` command uses (see §9).

### 8.3 Stop-hook situational awareness + block cap

Two Stop/SubagentStop changes:
- **`background_tasks` + `session_crons` arrays (v2.1.145)** — the Stop-hook input gains two arrays so a hook can tell "the session is genuinely done" apart from "the session is parked, waiting for a background task or a scheduled wakeup to revive it." Without these, a Stop hook implementing "block until all work is done" could not see in-flight background work and would either block forever or release too early.
- **The block cap (v2.1.143)** — `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` (default 8) is a liveness backstop: a repeatedly-blocking Stop hook is overridden + warned after N blocks, so the turn always terminates. This is **decoupled** from the cooperative `stop_hook_active` convention — that convention asks the hook to behave; the cap *forces* termination regardless. The max-turns check runs *first*, so the cap is the second line of defense.

Cross-link: [`../11_hooks/`](../11_hooks/).

---

## 9. Skills and Tools Deltas

### 9.1 Skill system

Five orthogonal deltas on the unchanged loader (full detail in [`../10_skill_system/`](../10_skill_system/)):

1. **`/reload-skills` + SessionStart `reloadSkills` (2.1.152)** — two mid-session reload entrypoints funneling into one shared cache-invalidation primitive. Closes a cold-start gap the 2.1.142 chokidar watcher could not cover (a hook that creates a brand-new skills dir).
2. **`disallowed-tools` frontmatter (2.1.152)** — the subtractive twin of `allowed-tools`, removing tools for the active turn only. Inline commands union into `alwaysDenyRules.command` (cleared on the next user message); forked commands emit a `{kind:"disallowed_tools"}` permission layer that auto-expires with the subagent.
3. **`context: fork` self-reinvoke loop fix (2.1.145)** — a validator gate (errorCode 9) using a `spawnedBySkill` breadcrumb refuses a forked skill whose body re-invokes itself, telling the model to execute the body directly.
4. **`effort:` frontmatter gains `xhigh` + status-bar fix (2.1.154/156)** — a skill/agent's effort becomes a `kind:"effort"` permission layer; the 2.1.156 fix makes the status bar walk `permissionLayers` so the displayed effort matches the runtime resolver (including the silent `xhigh`/`max`→`high` downgrade).
5. **Three bundled skill bodies updated (2.1.154)** — `/simplify` cleanup-only, `/code-review` bundled, `/claude-api` gained Opus 4.8 + 4.7→4.8 migration guidance.

The unifying mechanism is the **`permissionLayers` array** — a per-turn list of `{kind}` records (`allowed_tools`, `disallowed_tools`, `effort`, `model`, `avoid_prompts`), each reduced by its own resolver and rebuilt every turn so overrides self-expire. Both `disallowed-tools` and `effort:` are siblings on this one array. The 2.1.156 status-bar fix exists precisely because the *display* had to start replicating the same layer fold the runtime already did — a consistency bug that only appears once two different consumers (runtime resolver and status display) must agree on the same per-turn layer state.

### 9.2 Tools subsystem

Four deltas, none of which rewrote the core contract (full detail in [`../04_tools/`](../04_tools/)):

1. **Workflow tool registration (2.1.154)** — the `Workflow` tool slots into the canonical built-in array through a lazy slot, spread in as `...(_H$ ? [_H$] : [])`. The genuinely new part is that the old static `feature('WORKFLOW_SCRIPTS')` flag is **gone** — enablement is now the recomputed runtime gate `NZ` from §3.
2. **AskUserQuestion reservation (2.1.154)** — for lean-cohort models (Opus 4.8 et al., decided by `X3(model)`), the tool's prompt appends a "reservation" paragraph telling the model to *withhold* the multiple-choice tool unless the user's answer genuinely changes the plan. This is the runtime-overridable inversion of the old invitational framing, gated by `tengu_cinder_plover`. The changelog phrasing: "Claude now reserves the multiple-choice question prompt for decisions it genuinely cannot make itself."
3. **`disallowed-tools` skill/command frontmatter** — shared with §9.1, the deny-side mirror of `allowed-tools`.
4. **Read PARTIAL-view truncation (2.1.145) + always-on streaming (2.1.156)** — oversized whole-file Reads are salvaged into paginated excerpts marked `isPartialView` (so Edit/Write/dedup/@-mention refuse to treat them as full reads); and `eager_input_streaming` is extended from firstParty-only to per-model Bedrock/Vertex via the new `eagerInputStreaming` capability record (`cli_inner_pretty.js:91833`, 555993-556006). The changelog: "Streaming tool execution is now always enabled, including ... on Bedrock/Vertex/Foundry (previously behind a feature flag)."

**The cheapness theme:** every tools delta reused an existing seam. Workflow reused the conditional-slot-spread idiom; the AskUserQuestion reservation reused the single memoized `X3` lean predicate (inheriting its env override and A/B gate for free); `disallowed-tools` reused the existing `alwaysDenyRules.command` deny channel; Read truncation reused the `isPartialView` consumer mesh Edit/Write already honored. This is the same "compose, don't build" discipline visible across the whole window.

---

## 10. Permissions / Auto-Mode — Exfiltration Hardening + Surgical Bypass Closures

Unlike the 2.1.142 window (a broad grammar/settings/classifier expansion), the 2.1.156 permission window is **narrow and surgical** — no new policy primitive, two coherent kinds of change.

### 10.1 Data-exfiltration classifier hardening

The model-graded auto-mode classifier's **Data Exfiltration** HARD BLOCK rule (`cli_inner_pretty.js:276986`) was rewritten from a one-sentence, destination-centric rule into a three-check provenance-and-scale decision procedure whose centerpiece is *"bulk relocation of a repo/tree is exfiltration regardless of destination trust."* The 2.1.156 changelog: "Improved the auto-mode classifier's detection of data exfiltration, particularly bulk transfers of repository contents."

**Why provenance-and-scale over destination-trust?** The old rule keyed on whether the destination was a *trusted* repo/domain/bucket. But an attacker can *self-provision* a trusted destination (push your repo to a bucket they control and then mark it trusted, or relocate the tree somewhere "internal"). The rewrite's insight is that **bulk relocation of a whole repo is exfiltration regardless of where it goes** — scale is its own red flag. A trusted destination does not launder a bulk transfer. This closes the self-provisioned-destination + bulk-relocation gap the one-sentence rule could not see.

### 10.2 The could-not-evaluate budget bump

Co-designed with the rule rewrite: the two-stage classifier's stage-2 (thinking) output budget doubled from `max_tokens: 4096` to `8192 + V` (`cli_inner_pretty.js:277501`). The 2.1.156 changelog: "Fixed auto mode incorrectly blocking actions with 'could not evaluate this action' when the safety classifier ran out of output tokens while reasoning."

**The interaction is the whole point.** Making the Data Exfiltration rule a multi-check decision procedure means the model needs *more* tokens to reason through it. If it runs out mid-`<thinking>`, the verdict parser sees a truncated output and fails closed (`shouldBlock: true`), producing a false "could not evaluate" block on a *safe* action. Doubling the budget was deliberately chosen over "fall back to allow on truncation" — auto-allow on cutoff would open a hole at the highest-risk cases. So the same release that *strengthened* the rule also *widened the budget* to reason through it; the two changes are inseparable.

### 10.3 Auto-mode consent is no longer a blocking gate

Auto mode's opt-in consent stopped being a blocking precondition (2.1.152) and became a non-blocking, debounced (800ms), in-flow confirmation; in VSCode (2.1.156) it surfaces in the mode-picker without requiring the bypass-permissions setting. The consent resolver `kV5` (`cli_inner_pretty.js:211657`) is a tri-state (`enabled`/`disabled`/`opt-in`, default `opt-in`); the VSCode bridge `y97` promotes `opt-in` → `enabled` for the experiment-gate surface.

**Why is relaxing consent safe?** Because **consent was never the safety boundary** — the per-tool-call safety classifier (with its HARD-deny rules, evaluated with no user-intent override) is. The opt-in dialog was friction; friction that blocks *discovery* (a startup gate, or "you must consent before the picker even shows it") is counterproductive. So consent went from a blocking precondition to an in-flow confirmation, while the classifier keeps hard-denying dangerous actions on every call. This is exactly why the *same window* relaxed consent (§10.3) and hardened the exfiltration classifier (§10.1): **the protection that matters got stronger as the friction that didn't got removed.**

### 10.4 Four "static analyzer lost an effect" bypass closures

Four fixes share one root-cause shape — the permission engine's *static model* diverged from what the *real shell or filesystem* would do, and the gap was the bypass:

| Fix | What the analyzer missed |
|-----|--------------------------|
| `rm -rf $HOME` trailing slash (2.1.156) | The trusted reference (`os.homedir()`) could be non-canonical too — only the candidate was normalized (asymmetric normalization). `isDangerousRemovalTarget` (`PlH`) now trailing-slash-normalizes BOTH operands and compares case-insensitively. |
| `$TMPDIR` divergence (2.1.156) | Two values that should have *been* the same directory weren't (one realpath'd, one ambient/symlinked) — sandboxed vs unsandboxed Bash resolved `$TMPDIR` differently. Now both get the canonical per-uid dir. |
| PowerShell `cd..` / `X:` (2.1.149) | `cd..` is a single command token, not `cd` + `..`; alias resolution never mapped it to `Set-Location`, so the cwd change went undetected. `isCwdChangingCmdlet` (`_v$`) now recognizes the bareword and drive-switch forms. |
| Bash bare `FOO=bar` (2.1.145) | An assignment-only command resolved to an empty command list, treated as trivially read-only — even though it mutates the env for every later command. A new `bareAssignmentNames` field routes non-allowlisted assignments to prompt. |

The discipline these encode: **canonicalize both operands of any security comparison to one identical form, and make the static model invalidate the moment the real shell would change state.** The PowerShell side fixes *detecting* the chdir; the companion `PWD`/`OLDPWD`/`DIRSTACK` fix fixes *propagating* it into the variable model.

### 10.5 MCP-policy partial validation

A new `validateMcpServerPolicyEntries` (`V71`, `cli_inner_pretty.js:52367`) runs before the whole-settings Zod parse, `safeParse`s each `allowedMcpServers`/`deniedMcpServers` entry, keeps the valid ones, writes the filtered array back, and emits a per-entry `claude doctor` warning for each bad one. This closes the worst-case enterprise failure: previously, *one typo* in `allowedMcpServers` reverted the whole array to `undefined` = "all allowed" — flipping an enterprise MCP lockdown from "deny all" to "allow all." This is the soft-fail-closed flavor: scrub the offender, keep the rest, warn — matters more for managed settings because the old failure direction was *open*.

Cross-link: [`../37_permission_policy/`](../37_permission_policy/).

---

## 11. Cross-Cutting Design Patterns

Reading the nine modules together, several patterns recur across the window:

### 11.1 Co-design: relax friction, strengthen the boundary
The window repeatedly pairs a *relaxation* with a *hardening* in the same release. Consent goes non-blocking while the exfiltration classifier gets stronger (§10). Fast mode's premium drops 3x while the model gets more capable (§4). The lean prompt drops behavioral scaffolding while reserving it for models that need it (§5). The team's mental model is consistent: identify the protection that actually matters, make it stronger, then aggressively remove the friction that doesn't.

### 11.2 Compose, don't build
Almost every feature reuses an existing seam. `/code-review` and `/simplify` are pure prompt assembly on top of the Agent tool (§6). The AskUserQuestion reservation reuses the `X3` lean predicate (§9.2). `disallowed-tools` reuses the `alwaysDenyRules.command` channel (§9). The unified bg dispatcher collapses N front doors into one seam (§7). `ultracode` is just `xhigh` effort bundled with the existing workflow orchestration (§4). New infrastructure is the exception, not the rule.

### 11.3 Static-subset safety
When untrusted input must be processed, the answer is consistently "narrow it to a provably-safe subset" rather than "block the dangerous cases." Workflow `meta` is AST-evaluated, never `eval`'d (§3.2). The terminalSequence sanitizer (prior window) re-emits from an allowlist. The permission bypass closures canonicalize both operands to one form (§10.4). The discipline is: don't try to enumerate what's dangerous; enumerate what's safe and reject everything else.

### 11.4 Monotone, reversible rollout
Server-side gates can only *widen* the safe set, never break it. The lean-prompt growthbook can force-lean but not force-full (§5.4). The workflows gate defaults off for Pro and can be killed server-side (§3.1). This makes every feature dark-launchable and instantly reversible without a client deploy — the team can ship to a cohort, measure, and roll back from the server alone.

### 11.5 Determinism as a feature enabler
Workflow resume (§3.3) is only possible because scripts are forced deterministic. The thinking-signature hotfix (§4.6) exists because signed thinking blocks must be byte-exact. The window shows determinism treated not as a constraint to tolerate but as the enabling property for resumability and verification.

---

## 12. Settings, Env Vars, and Telemetry Added

### New / changed settings keys

| Setting | Version | Purpose |
|---------|---------|---------|
| `ultracode` | v2.1.154 | Session-scoped: xhigh effort + standing workflow orchestration (cli_inner_pretty.js:51698) |
| `effortLevel` enum gains `xhigh` | v2.1.154 | Persisted effort, fourth level (cli_inner_pretty.js:51690) |
| `enableWorkflows` | v2.1.154 | User override of the workflows availability default (`hL5`) |
| `disallowed-tools` (skill/command frontmatter) | v2.1.143+ | Subtractive tool removal for the active turn |
| SessionStart `hookSpecificOutput.sessionTitle` | v2.1.152 | Hook sets the session title |
| SessionStart `hookSpecificOutput.reloadSkills` | v2.1.152 | Hook re-scans skill dirs in-session |
| `MessageDisplay` hook event | v2.1.152 | Display-only assistant-text transform/hide |
| `pluginSuggestionMarketplaces` | v2.1.152 | Admin allowlist for context-aware plugin tips |
| `allowAllClaudeAiMcps` | v2.1.149 | Load claude.ai cloud MCP connectors |
| `skipLfs` (marketplace source) | v2.1.153 | Skip Git LFS on plugin clone/update |
| `defaultEnabled: false` (plugin.json) | v2.1.154 | Plugins ship disabled-by-default |

### New / changed environment variables

| Env Var | Version | Purpose |
|---------|---------|---------|
| `CLAUDE_CODE_WORKFLOWS` | v2.1.154 | Explicit enable/disable of Dynamic Workflows (cli_inner_pretty.js:184781) |
| `CLAUDE_CODE_DISABLE_WORKFLOWS` | v2.1.154 | Hard-disable workflows |
| `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` | v2.1.154 | Force lean (true) / full (false) system prompt (cli_inner_pretty.js:143874) |
| `CLAUDE_CODE_ALWAYS_ENABLE_EFFORT` | v2.1.154/156 | Force effort param (now 400-safe via `A2` gate, cli_inner_pretty.js:568321) |
| `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` | deprecated (removal 06/01) | Replaced by `/model claude-opus-4-6[1m]` + `/fast on` |
| `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` | v2.1.143 | Stop-hook block-count liveness cap (default 8) |
| `CLAUDE_CODE_SESSION_ID` / `CLAUDECODE=1` (in stdio MCP env) | v2.1.156 | Now passed to stdio MCP subprocesses |
| `COLUMNS` / `LINES` (status-line env) | v2.1.153 | Status-line scripts can size to terminal |
| `OTEL_METRICS_INCLUDE_ENTRYPOINT` | v2.1.152 | Opt-in `app.entrypoint` metric attribute |

### Workflow telemetry events (assets/feature_gates.json)

`tengu_workflows_enabled`, `tengu_workflow_launched`, `tengu_workflow_completed`, `tengu_workflow_phase_completed`, `tengu_workflow_saved`, `tengu_workflow_agent_cap_exceeded`, `tengu_workflow_budget_cap_exceeded`, `tengu_workflow_journal_started_hit_respawn`, `tengu_workflow_keyword`, `tengu_workflow_keyword_dismissed`, `tengu_workflow_keyword_restored`, `tengu_workflow_usage_warning_accepted`. Plus `tengu_message_display_hooks` (hooks), `tengu_stop_hook_block_count` (hooks), `tengu_cinder_plover` (AskUserQuestion gate), `tengu_velvet_cascade` (lean-prompt rollout), `tengu_bg_retire_pinned_low_mem` / `tengu_bg_dispatch_rescued` / `tengu_bg_daemon_binary_takeover` (background agents).

---

## 13. Cross-Validation Notes

Key claims verified against the v2.1.156 bundle (and where relevant, the v2.1.88 readable source at `/lyz/codespace/3rd/claude-code/src/`):

| Claim | Verification | Finding |
|-------|--------------|---------|
| `Workflow` tool-name constant | `cli_inner_pretty.js:216291` (`mx = "Workflow"`) | Confirmed; `WORKFLOW_TOOL_NAME` export at 216290 |
| Workflows default off for Pro | `cli_inner_pretty.js:184789` (`defaultOn = _4() !== "pro"`) | Confirmed in `SL5` |
| Opus 4.8 seven-provider config | `cli_inner_pretty.js:91825-91833` (`Xi$`) | Confirmed; `eagerInputStreaming` field present |
| Opus 4.8 default effort `high`, 4.7 `xhigh` | `cli_inner_pretty.js:184987-184991` (`q48`) | Confirmed |
| Effort 400-fix is a capability-gated spread | `cli_inner_pretty.js:568321` (`...(A2(L) && {effort})`) | Confirmed |
| Fast mode 4.8 = 2x (10/50), legacy = 6x (30/150) | `cli_inner_pretty.js:98540-98546` / `98533-98539` | Confirmed |
| `/effort` relabel Faster/Smarter | `cli_inner_pretty.js:527381, 527383` | Confirmed |
| Lean gate `X3` checks env then `!c45 \|\| d45` | `cli_inner_pretty.js:143872-143877` | Confirmed |
| `code-review` command name | `cli_inner_pretty.js:211646` (`Y18`) | Confirmed |
| `--exec` handler + "ignores" warning | `cli_inner_pretty.js:541956`, 541972 | Confirmed |
| `MessageDisplay` is newest hook event | `cli_inner_pretty.js:49289` (last in array) | Confirmed |
| Thinking-signature matcher | `cli_inner_pretty.js:186575-186583` (`B87`) | Confirmed |
| Exfiltration rule + stage-2 budget 8192 | `cli_inner_pretty.js:276986`, 277501 | Confirmed (`max_tokens: 8192 + V`) |
| Auto-mode consent tri-state resolver | `cli_inner_pretty.js:211657` (`kV5`, default `opt-in`) | Confirmed |
| `ultracode` requires workflows + xhigh model | `cli_inner_pretty.js:51700-51706` | Confirmed in schema describe text |
| `82209` is NOT workflow code | `cli_inner_pretty.js:82200-82211` (Bedrock Smithy schema) | Confirmed — keyword false-positive, do not cite as workflow |

**Newness summary:** Dynamic Workflows (runtime, gate, journal, ultracode), Opus 4.8 + `xhigh` + the 2x fast pricing + the `B87` matcher, the lean-prompt per-model branch, the local `/code-review` finder/verifier machine, shell-exec bg sessions + the unified dispatcher, `MessageDisplay`, `sessionTitle`/`reloadSkills`, and the exfiltration-rule rewrite are all **NEW post-2.1.88**. The effort capability gates, the prompt-section assembler structure, the cloud ultrareview bridge, the `isPartialView` consumer mesh, and the firstParty streaming branch are **direct descendants** of 2.1.88 code (high confidence). The Workflow tool specifically is the **GA of an internal-only prototype** that existed in 2.1.88 behind the ant-only `WORKFLOW_SCRIPTS` build feature gate (the source files were stripped from the public tree).

---

## 14. Where to Look for Specifics

- [`../42_workflow/`](../42_workflow/) — Dynamic Workflows (tool definition, gate, caps, journal, lifecycle, coordinator)
- [`../43_model_opus48/`](../43_model_opus48/) — Opus 4.8 model map, effort levels, fast pricing, slider UI, thinking hotfix
- [`../44_lean_prompt/`](../44_lean_prompt/) — lean prompt gate, lean-vs-full body diff, rationale/rollout
- [`../45_code_review/`](../45_code_review/) — `/code-review` + `/simplify` commands, the prompt compiler, cloud ultra bridge
- [`../36_background_agents/`](../36_background_agents/) — shell-exec, unified dispatcher, classifier, worker reliability, daemon
- [`../11_hooks/`](../11_hooks/) — MessageDisplay event + streaming engine, sessionTitle/reloadSkills, Stop-hook arrays + block cap
- [`../37_permission_policy/`](../37_permission_policy/) — exfiltration classifier, budget bump, dangerous-path/TMPDIR, parser bypasses, MCP partial validation, consent
- [`../04_tools/`](../04_tools/) — Workflow registration, AskUserQuestion reservation, disallowed-tools, Read partial-view + streaming
- [`../10_skill_system/`](../10_skill_system/) — reload, disallowed-tools, fork-recursion guard, effort frontmatter, bundled bodies
- The four `symbol_index_*.md` files and the nine `symbol_additions_v2_1_156_*.md` per-module tables — symbol → location mappings
- The `by_version/` directory — per-release bullet-by-bullet breakdown
- [`../../../claude_code_v_2.1.142/analyze/`](../../../claude_code_v_2.1.142/analyze/) — the prior window (v2.1.113 → v2.1.142); the unchanged foundations for background agents, hooks, permissions, tools, and skills live there.
