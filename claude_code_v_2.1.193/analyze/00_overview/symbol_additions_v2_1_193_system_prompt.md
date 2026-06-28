# Symbol Additions — v2.1.193 — System Prompt (EXTEND)

> These symbols route to **[symbol_index_infra_platform.md](./symbol_index_infra_platform.md)** (the
> **Prompt** module is their home — the env-block builder, the agent-proxy env line/README, and the
> model-switch reminders are all prompt-construction surface). The two model-switch-replay symbols
> (`le`/`XQl`) also touch the agent-execution path and may be cross-listed in
> [symbol_index_core_execution.md](./symbol_index_core_execution.md) if preferred; their canonical home
> for this round is the Prompt module.
>
> Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION
> `2.1.193`, build `a1938d2a`, `BUILD_TIME 2026-06-25T18:18:11Z`). Every line was re-derived in the
> live 193 bundle for this round; obfuscated names are re-mangled per build and are **never** assumed
> to carry across versions. Where a symbol is *carryover* (present in v2.1.183 under a different obf
> token), the 183 obf name is noted in the Readable column for traceability.

## Module: Prompt — env-block agent-proxy diagnostic line (NET-NEW, Remote/proxy-only)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `W3f` | `computeEnvInfo` (env-block builder, 2-param `(e,t)`; gained `l = Nwn()` @592865 + `${l}` slot @592873-592878; carryover of 183 `L_f`@580976 — env body/`OS Version:`→`</env>` @580996-581004; **not** 183 `D_f`@581006, which is the 3-param sibling = 193 `V3f`@592881; v2.1.88 `computeEnvInfo`@`constants/prompts.ts:606`) | cli_inner_pretty.js:592845 | function |
| `C3o` | `buildAgentProxyEnvLine` (the `Outbound HTTPS goes through a pre-configured agent proxy…` line) | cli_inner_pretty.js:616578 | function |
| `Nwn` | `getAgentProxyEnvLine` (returns `Bki`; read by `computeEnvInfo`) | cli_inner_pretty.js:151176 | function |
| `h$t` | `setAgentProxyEnvLine` (push setter; called @616459/616464/616468, cleared @616690) | cli_inner_pretty.js:151173 | function |
| `Bki` | `agentProxyEnvLine` (module var; `undefined` for non-proxy sessions) | cli_inner_pretty.js:151179 | variable |
| `Z8f` | `buildAgentProxyReadme` (the on-disk `# Claude Code agent proxy` troubleshooting README) | cli_inner_pretty.js:616595 | function |
| `Mt` | `getCwd` (env-block `Working directory:` value; carryover) | cli_inner_pretty.js:46539 | function |
| `B2o` | `getShellInfoLine` (env-block shell line; carryover) | cli_inner_pretty.js:592965 | function |

## Module: Prompt — model-switch reminders (NET-NEW Remote branch + CARRYOVER generic replay)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `le` | `handleModelSwitchReplay` (model-switch handler; `CLAUDE_CODE_REMOTE` branch @705781-705789 pushes the NET-NEW "now running as" reminder) | cli_inner_pretty.js:705779 | function |
| `XQl` | `buildModelSwitchReminders` (generic `/model`-replay; CARRYOVER, present in 183) | cli_inner_pretty.js:599667 | function |
| `dPe` | `renderSlashCommandReplay` (renders a replayed slash command, e.g. `dPe("model", id)`; carryover) | cli_inner_pretty.js:599662 | function |
| `Pn` | `makeMetaMessage` (builds an `isMeta` context message) | cli_inner_pretty.js:599604 | function |
| `C2` | `resolveModelDisplayName` (model id → display name) | cli_inner_pretty.js:103713 | function |
| `xNo` | `LOCAL_CMD_STDOUT_OPEN_SET_MODEL` (= `<local-command-stdout>Set model to `) | cli_inner_pretty.js:602556 | constant |
| `fC` | `LOCAL_CMD_STDOUT_TAG` (= `"local-command-stdout"`) | cli_inner_pretty.js:45929 | constant |

## Module: Prompt — memory-prompt dedup (REFINEMENT: `_gi` subsection removed)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `p0i` | `whenToAccessMemories` (memory fragment array; now flows straight into `A$t`) | cli_inner_pretty.js:152255 | variable |
| `A$t` | `beforeRecommendingFromMemory` (`## Before recommending from memory` array; string @152263; carryover, was 183 @151068) | cli_inner_pretty.js:152262 | variable |
| `Kwn` | `memoryStalenessGuidance` (the "Memory records can become stale over time… verify that the memory is still correct" drift/trust bullet — final element of the `## When to access memories` array, reused @152260/152448/152554; carryover of 183 `UQu`@151550. This is one form of the "drift and trust rules" the removed `_gi` subsection pointed at, so it survives. NOTE: it is **not** the @152055 save-time guidance literal, which is a separate string.) | cli_inner_pretty.js:152092 | variable |
| `_gi` | `removedRecalledMemoriesSubsection` (the deleted `## Recalled memories in tool results` array — **183-only**, gone in 193) | cli_inner_pretty.js:151568 *(183)* | variable |

## Identity / builder / sub-agent prompts (CARRYOVER — byte-identical, obf re-mangled)

> Listed for traceability of the re-mangle; **no behaviour change** (asset `diff` empty for all).

| Obfuscated (193) | Readable | 183 obf | Notes |
|------------------|----------|---------|-------|
| `AVr` | `IDENTITY_CLAUDE_CODE` (`You are Claude Code, Anthropic's official CLI for Claude.`) | `gNr` | identity value byte-identical |
| `Dki` | `IDENTITY_AGENT_SDK_CLI` (`…running within the Claude Agent SDK.`) | `OAi` | identity value byte-identical |
| `Pki` | `IDENTITY_CLAUDE_AGENT` (`You are a Claude agent, built on Anthropic's Claude Agent SDK.`) | `NAi` | identity value byte-identical |
| `zqp` / `B3f` / `R3f` | builder prompts (1292 / 1082 / 935 B) | `$vp` / `w_f` / `y_f` | `diff` IDENTICAL all three |
