# 40 — System Prompt (v2.1.183 → v2.1.193, EXTEND)

> Delta module: `40_system_prompt/` documents what changed in the **system-prompt surface**
> between v2.1.183 and v2.1.193. It is an **EXTEND** of the full v2.1.183 module
> [`../../../claude_code_v_2.1.183/analyze/40_system_prompt/`](../../../claude_code_v_2.1.183/analyze/40_system_prompt/README.md),
> which remains the authoritative front-door for the *whole* prompt-assembly machine (assembler `KL`,
> lean gate `Dg`, identity strings, the three builder prompts, the env block, the cacheable-section
> registry, and the five sub-agent prompts). **Read the 183 module for everything that did not change.**
>
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
> (718,679 lines; `VERSION:"2.1.193"`, build `a1938d2a`, `BUILD_TIME 2026-06-25T18:18:11Z` —
> verified `cli_inner_pretty.js:162,214`). Every `cli_inner_pretty.js:<line>` citation below is a
> **v2.1.193** line unless explicitly tagged `(183)` or `(v2.1.88)`.
> Obfuscated names were **re-mangled** by the bundler for this build — a 183 obf token is **never**
> reused. Where a symbol is carryover, the 183 obf token is given for traceability only.

---

## TL;DR — the bulk of the prompt is byte-identical; three small, mostly-Remote deltas

The load-bearing claim of this module is a **negative** one, and it is proven by an asset byte-diff
(below): the **identity strings, the three main-loop builder prompts, the env-block scaffold, the
model-info line, and all five sub-agent prompts are byte-identical to v2.1.183** — only the
obfuscated symbol names were re-mangled. The system prompt a normal *local interactive* user sees on
upgrading 183 → 193 is **unchanged**.

There are exactly **three** real system-prompt deltas in this window, plus **one** reminder-adjacent
body change owned by `36_background_agents`:

| # | Delta | Class | 193 anchor | 183 before | Owner doc |
|---|-------|-------|-----------|-----------|-----------|
| 1 | Env block gains an **optional agent-proxy diagnostic line** (`${l}` slot) | **NET-NEW** (Remote/proxy-only) | env builder `W3f` :592845, slot :592873-592878; line builder `C3o` :616578 | slot absent (env builder `L_f`@580976 ends at `OS Version:` @ 580996-581004; `D_f`@581006 is the unrelated 3-param sibling) | [`env_block_agent_proxy_line.md`](./env_block_agent_proxy_line.md) |
| 2 | Reminder catalogue gains a Remote **"You are now running as ${Sr}" model-change reminder** | **NET-NEW** (Remote-only) | `le` Remote branch :705781-705789 | string count 0 | [`reminder_catalogue_delta_193.md`](./reminder_catalogue_delta_193.md) |
| 3 | Memory prompt drops the **"## Recalled memories in tool results"** drift/trust subsection | **REFINEMENT** (dedup) | removed (`p0i`→`A$t` flow :152255-152263) | present (`_gi` @ 183:151568-151571) | [`reminder_catalogue_delta_193.md`](./reminder_catalogue_delta_193.md) |
| 4 | Background launch-result text **no longer says "end your response"** | BODY-CHANGE (reminder-adjacent) | `async_launched` branch :431253-431264 | said it (183:424282-424293) | [`../36_background_agents/backgrounding_and_panel_fixes.md`](../36_background_agents/backgrounding_and_panel_fixes.md) |

**Upgrade-behaviour note.** Deltas #1 and #2 are both gated behind Claude-Code agent-proxy /
`CLAUDE_CODE_REMOTE` enablement, so **a local interactive session sees no change** — neither the new
env line nor the new reminder is emitted unless the session is running under the managed-egress agent
proxy (delta #1) or under Claude Code Remote (delta #2). Delta #3 (the dedup) is the only change that
touches the *default* prompt path, and its substance is preserved (the drift/trust guidance survives
consolidated elsewhere — see the deep doc).

**Depth: moderate.** Not byte-identical (rules out "thin"), but each delta is small and surgical. The
meatiest is the agent-proxy env line (delta #1), which drags in a whole new `# Claude Code agent
proxy` README builder (`Z8f`) and a `__agentproxy/status` diagnostic endpoint.

---

## Carryover — what is byte-identical to 183 (with diff evidence)

The system-prompt assets are extracted under `…/extract/assets/system_prompts/` for both builds (obf
names re-mangled between builds, so matched by content/size, not filename). A byte-diff of every
asset:

| Asset | 183 (bytes) | 193 (bytes) | Verdict |
|-------|-------------|-------------|---------|
| `01_identity.json` (4 identity strings) | 352 | 352 | **byte-identical values** (`diff` of JSON *values* empty; only keys `gNr/OAi/NAi/@0x1233411` → `AVr/Dki/Pki/@0x125348c`) |
| `02_builder` ×3 (main-loop intros) | 1292 / 1082 / 935 | 1292 / 1082 / 935 | **`diff` IDENTICAL** all three (`$vp/w_f/y_f` → `zqp/B3f/R3f`) |
| `03_env_template` | 198 | **203** | **CHANGED** — the `+${l}` slot (delta #1) |
| `04_subagent` 0–4 | 2656/2497/2059/1288/549 | identical sizes | **`diff` IDENTICAL** all five |
| `05_reminders.json` (25-entry catalogue) | 15925 | **15703** | **CHANGED** — +1 / −1 entry (deltas #2, #3; net −222 B) |

> Diff method (this round): `01_identity.json` values compared after JSON-normalising away the
> obfuscated keys (`diff` empty → values identical); the three builders and five sub-agent prompts
> compared with plain `diff` (each reported IDENTICAL); `05_reminders.json` compared by
> order-independent string-set membership (Python set diff → exactly one add, one remove; both files
> hold 25 entries).

So the only two asset files that moved are `03_env_template` (delta #1) and `05_reminders.json`
(deltas #2 + #3). Everything else in the system prompt is a re-mangle of 183 — **carryover, not a 193
delta**. The model-info line `You are powered by the model named …` (built inside the same env
builder `W3f`, :592851) is unchanged; the generic `/model`-replay model-switch mechanism (`XQl`,
:599667 — emits a replayed `/model` command, `Set model to …` count 4 in 193 / 5 in 183) is also
carryover, with only the Remote reminder layered on top (delta #2).

---

## The three deltas, in one paragraph each

### Delta #1 — env block agent-proxy line (NET-NEW, Remote/proxy-only)
The env builder `W3f` (:592845) gained a trailing local `l = Nwn()` (:592865) and a conditional slot
`${ l ? `${l}\n` : "" }` (:592873-592878) inserted between `OS Version:` and `</env>`. `Nwn()` reads
a module var (`Bki`) that is **only** populated by the agent-proxy enable path (`h$t(C3o(c, …))` at
:616459/616464/616468) and cleared on proxy stop (`h$t(void 0)` :616690). The line text (`C3o`,
:616578) tells the model that outbound HTTPS goes through a managed proxy and to
`curl -sS "$HTTPS_PROXY/__agentproxy/status"` on TLS/403/405/407 failures. All of this — the slot, the
`C3o` line, the `Z8f` README, the `__agentproxy/status` endpoint — is count **0** in 183. Full
analysis: [`env_block_agent_proxy_line.md`](./env_block_agent_proxy_line.md).

### Delta #2 — Remote "now running as" model-change reminder (NET-NEW, Remote-only)
`le` (the model-switch handler, :705779) now wraps its generic `/model`-replay (`XQl`) with a
`Be.CLAUDE_CODE_REMOTE`-gated push of a `<system-reminder>The model for this session has been changed
to ${Sr}. You are now running as ${Sr}.</system-reminder>` meta message (:705781-705789). The string
`You are now running as` is count **1** in 193 / **0** in 183. Full analysis:
[`reminder_catalogue_delta_193.md`](./reminder_catalogue_delta_193.md).

### Delta #3 — "## Recalled memories in tool results" subsection removed (REFINEMENT / dedup)
The standalone memory-prompt subsection that carried its own drift/trust `<system-reminder>`
paragraph (183 array `_gi` @ 151568-151571) was deleted; in 193 the `## When to access memories`
array (`p0i`, :152255) flows straight into `## Before recommending from memory` (`A$t`, :152262/
string :152263). The guidance is **not lost** — it survives consolidated in the save-time paragraph
present in both builds (`Recalled memories appearing inside <system-reminder> blocks …`, 193:152055 /
183:151514) and in the surviving `## Before recommending from memory` section. Full analysis:
[`reminder_catalogue_delta_193.md`](./reminder_catalogue_delta_193.md).

---

## Cross-links

- **Background launch-result relaxation (delta #4)** — primary owner:
  [`../36_background_agents/backgrounding_and_panel_fixes.md`](../36_background_agents/backgrounding_and_panel_fixes.md)
  and [`../36_background_agents/README.md`](../36_background_agents/README.md). The `summary:
  '<5-10 word recap>'` SendMessage hint that the same async-launch template gained overlaps the
  agent-team SendMessage work ([`../30_agent_team/`](../30_agent_team/)).
- **Delta #2 model-change reminder** pairs with the org-model-restriction / model-picker work:
  [`../38_permissions/org_model_restrictions.md`](../38_permissions/org_model_restrictions.md).
- **Delta #3 memory dedup** overlaps the auto-memory theme: the 193 auto-memory module is
  [`../31_auto_memory/`](../31_auto_memory/) (and the 183 baseline auto-memory tree).
- **183 baseline (everything unchanged):**
  [`../../../claude_code_v_2.1.183/analyze/40_system_prompt/README.md`](../../../claude_code_v_2.1.183/analyze/40_system_prompt/README.md)
  and its [`reconstructed_source/`](../../../claude_code_v_2.1.183/analyze/40_system_prompt/reconstructed_source/README.md).

---

## Related Symbols

> Symbol mappings live in the symbol index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (system-prompt builders, model-switch reminders)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (**Prompt**; agent-proxy env line)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
>
> Per-feature additions for this round: [symbol_additions_v2_1_193_system_prompt.md](../00_overview/symbol_additions_v2_1_193_system_prompt.md)
>
> Key symbols in this module:
> - `computeEnvInfo` (`W3f`, :592845) — env-block builder; gained `l = Nwn()` (:592865) and the `${l}` slot (:592873-592878); v2.1.88 `computeEnvInfo` @ `constants/prompts.ts:606`.
> - `buildAgentProxyEnvLine` (`C3o`, :616578) — builds the agent-proxy diagnostic env line; NET-NEW.
> - `getAgentProxyEnvLine` (`Nwn`, :151176) / `setAgentProxyEnvLine` (`h$t`, :151173) / `agentProxyEnvLine` (`Bki`, :151179) — the getter/setter/var the env line reads from.
> - `buildAgentProxyReadme` (`Z8f`, :616595) — builds the `# Claude Code agent proxy` README; NET-NEW.
> - `handleModelSwitchReplay` (`le`, :705779) — model-switch handler; Remote branch (:705781-705789) is NET-NEW.
> - `buildModelSwitchReminders` (`XQl`, :599667) — generic `/model`-replay builder; CARRYOVER.
> - `makeMetaMessage` (`Pn`) / `resolveModelDisplayName` (`C2`) — used by `le`'s Remote branch.
