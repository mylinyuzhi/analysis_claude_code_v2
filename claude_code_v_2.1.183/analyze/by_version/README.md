# `by_version/` — Per-Release Breadth Index (v2.1.157 → v2.1.183)

This directory holds one **breadth** analysis file per published release in the **v2.1.156 → v2.1.183** window. Each `2.1.NN.md` is a faithful, source-cross-validated pass over *everything that release shipped* — new features, improved behavior, and notable fixes — across **all** subsystems it touched (permissions, model selection, MCP, hooks, plugins, sandbox, auto-mode, Remote Control, telemetry, UI, Windows/WSL, …), with each item mapped to a `cli_inner_pretty.js:<line>` anchor in the 2.1.183 bundle.

> **How to read this tree.** Three layers, each answering a different question:
> - **`by_version/` (here) = BREADTH.** "What did release X ship, across *all* subsystems?" One file per release.
> - **The five module dirs = DEPTH.** "How does *this one feature* work, fully deobfuscated?" → [`../30_agent_team/`](../30_agent_team/), [`../42_workflow/`](../42_workflow/), [`../36_background_agents/`](../36_background_agents/), [`../07_compact/`](../07_compact/), [`../31_auto_memory/`](../31_auto_memory/).
> - **[`../00_overview/changelog_to_code_map.md`](../00_overview/changelog_to_code_map.md) = PER-BULLET POINTERS.** "Where is the exact patch line for *this one changelog bullet*, and what's out of scope this version?"
>
> When a by_version item touches one of the five focus features, it gives a **short summary + the verified anchor + a link to the depth module** rather than re-deriving the mechanism. Non-focus items get their **primary analysis** in the by_version file itself.

---

## Window facts

- **Version span:** 2.1.157 … 2.1.183 — 27 version numbers, **22 published releases** (one file each, below).
- **Never published** (absent from the upstream [`../../CHANGELOG.md`](../../CHANGELOG.md), no public release notes): **.164, .171, .177, .180, .182** — 5 numbers, no file.
- **Published-but-empty** (boilerplate changelog, no enumerated bullets, no mappable focus delta): **.159** ("Internal infrastructure improvements"), **.165 / .167 / .168** ("Bug fixes and reliability improvements"). Each still has a file documenting the no-surface-area fact + provenance.
- **Source bundle (TARGET):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` — `VERSION:"2.1.183"` at `cli_inner_pretty.js:848`, `GIT_SHA 9d251abd…` (`build_sha 9d251ab`), `BUILD_TIME 2026-06-18T23:04:10Z`, Bun 1.4, 699,346 lines. Because the bundle is the 2.1.183 *result*, earlier in-scope behaviors appear in their cumulative post-2.1.183 form; lines tagged **(v2.1.156 before)** are before-pictures read in `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines). Obfuscated names are **re-mangled between builds** and were re-derived per anchor — no v2.1.156 name was carried over by assumption.

### The four inflection points

1. **2.1.160 — the ultracode rename.** The Dynamic Workflows trigger keyword changes from `workflow(s)` to `ultracode`, gains a dedicated violet shimmer, and is gated behind the new `workflowKeywordTriggerEnabled` /config setting (introduced one release earlier, 2.1.157). The single keyword word changes; the underlying VM / gate / journal does not. → [`./2.1.160.md`](./2.1.160.md)
2. **2.1.170 — Fable 5.** A new Mythos-class flagship model (`claude-fable-5` / `claude-mythos-5`) with a usage-credits consent gate. *Out of this tree's five-feature scope* (a model launch, not one of the five), but it is the **cause** of several later in-scope fixes — the 2.1.176 auto-mode-falls-back-to-Opus and the 2.1.178 compaction fallback chain both exist because a session can now run a model an org may not have enabled. → [`./2.1.170.md`](./2.1.170.md)
3. **2.1.172 — nested subagents + the focus-feature cluster.** The densest in-scope release: nested subagents (with the 5-level depth-limit machinery, foreground + background), the 1M-context-without-credits auto-compact-back, team-memory recall in remote sessions, **and** the AST-walk workflow-determinism fix all land together — on top of a wide `availableModels` model-restriction hardening pass. → [`./2.1.172.md`](./2.1.172.md)
4. **2.1.178 — the agent-team redesign.** The implicit-team rewrite removes `TeamCreate`/`TeamDelete` and re-routes teammate spawning onto the Agent tool's `name` parameter. The same release makes compaction honor `--fallback-model`, re-frames the workflow keyword to a violet explicit-phrase trigger, adds `Tool(param:value)` permission rules, and closes the subagent auto-mode-classifier bypass. → [`./2.1.178.md`](./2.1.178.md)

---

## Release index (newest-first)

The **Focus** column marks which of the five focus features each release touched: **AT** = Agent Team · **WF** = Dynamic Workflows (ultracode) · **BG** = Background Agents · **CMP** = Compaction · **MEM** = Auto Memory. A dash (—) means the release touched none of the five (its analysis is wholly primary / breadth).

| Release | Theme (one line) | Focus |
|---------|------------------|-------|
| [2.1.183](./2.1.183.md) | **Auto-mode safety hardening** (destructive-git + `terraform/pulumi/cdk destroy` blocks), deprecated-model stderr warning, `attribution.sessionUrl`, `/config --help`, plus the tmux teammate-spawn `respawn-pane` rework and teammate-background-task survival. | AT, BG |
| [2.1.181](./2.1.181.md) | **Flagship maintenance** — `/config key=value`, `sandbox.allowAppleEvents`, `CLAUDE_CLIENT_PRESENCE_FILE`, Bun 1.4, deep streaming/retry/startup-latency hardening; plus the foreground-subagent 5-level depth limit and the `Improved N memories` quiet status line. | BG, MEM |
| [2.1.179](./2.1.179.md) | **"Stop surfacing raw failure states"** — mid-stream connection-drop partial-finalize, sandbox `denyRead`/`allowRead` glob no longer bloating the Bash description, WSL2 wheel-scroll / Ctrl+O fixes; plus remote background tasks no longer stuck "still running." | BG |
| [2.1.178](./2.1.178.md) | **THE AGENT-TEAM REDESIGN** — `TeamCreate`/`TeamDelete` removed, one implicit team per session via the Agent tool `name` param; plus `Tool(param:value)` permission rules, nested `.claude/skills`, auto-mode subagent gate, violet workflow keyword, compaction honoring `--fallback-model`. | AT, WF, CMP, BG |
| [2.1.176](./2.1.176.md) | **Localized session titles + `footerLinksRegexes` + two auth/credential tightenings** (Bedrock expiry-aware caching, `availableModels` closing alias/`/fast` escape hatches), an auto-mode-without-Opus-4.8 fallback, and a dense background-session reliability batch. | BG |
| [2.1.175](./2.1.175.md) | **`enforceAvailableModels`** — turns the `availableModels` allowlist into a true policy boundary that also pins the *Default* model and that user/project settings cannot widen. (Model-allowlist subsystem.) | — |
| [2.1.174](./2.1.174.md) | **Model-picker / model-naming correctness sweep** + Bedrock GovCloud inference-profile fix + `wheelScrollAccelerationEnabled`; plus background `ANTHROPIC_*` provider-env isolation and the Workflow `agent()` attribution-header fix. | BG, WF |
| [2.1.173](./2.1.173.md) | **Two pointed fixes** — Fable 5 `[1m]` suffix normalization on first-party, and the spurious Windows "sandbox dependencies missing" warning corrected to "platform unsupported." | — |
| [2.1.172](./2.1.172.md) | **NESTED SUBAGENTS + THE FOCUS CLUSTER** — sub-agents spawn sub-agents 5 deep (universal depth gate), 1M-without-credits auto-compact-back, remote team-memory recall, AST-walk workflow determinism; on a wide `availableModels` model-restriction pass. | BG, CMP, MEM, WF |
| [2.1.170](./2.1.170.md) | **CLAUDE FABLE 5 (Mythos-class) launch** — model registration across providers + a usage-credits consent gate; plus a VS-Code-integrated-terminal transcript-save fix. (Causal for later in-scope fallbacks; the model launch itself is out of scope.) | — |
| [2.1.169](./2.1.169.md) | **Troubleshooting & enterprise-hardening** — `--safe-mode`, `/cd`, `disableBundledSkills`, a `post-session` hook, managed-MCP enforcement on reconnect, context-window-scaled CLAUDE.md warning; plus the `claude agents --json` three-source rework and `/workflows` opening immediately mid-turn. | BG, WF |
| [2.1.168](./2.1.168.md) | **Bug fixes and reliability improvements** — boilerplate-only release; no isolable user-facing surface (documented + provenance-verified). | — |
| [2.1.167](./2.1.167.md) | **Bug fixes and reliability improvements** — boilerplate-only release; no isolable user-facing surface. | — |
| [2.1.166](./2.1.166.md) | **Model-fallback grows up** — `fallbackModel` chain (up to 3, `--fallback-model` on interactive) + retry-once-on-fallback; cross-session `SendMessage` "permission laundering" de-fanging; deny-rule glob in tool-name position; `MAX_THINKING_TOKENS=0`. The fallback chain is the precursor the 2.1.178 compaction work consumes. | CMP, AT |
| [2.1.165](./2.1.165.md) | **Bug fixes and reliability improvements** — boilerplate-only release; no isolable user-facing surface. | — |
| [2.1.163](./2.1.163.md) | **Managed-fleet + extensibility ergonomics** — `requiredMinimum/MaximumVersion` version floor/ceiling, `/plugin list`, `/btw` c-to-copy, Stop/SubagentStop `additionalContext`, skill `\$` escape, stdio MCP `CLAUDE_CODE_SESSION_ID` on resume; plus the standout `$TMPDIR`-leak regression fix. | — |
| [2.1.162](./2.1.162.md) | **"Make the surfaces honest"** — `--tools Grep/Glob` native-search opt-in (`searchToolsOptIn`), `/effort` persist-confirm, LSP `workspaceSymbol` query, WebFetch-rule-beats-preapproved, Windows path-rule matching, sub-1000ms MCP timeout floor removed; plus `agents --json waitingFor` and the SendMessage deep-tmpdir fix. | BG, AT |
| [2.1.161](./2.1.161.md) | **Telemetry-correctness + secret-hygiene** — `OTEL_RESOURCE_ATTRIBUTES` per-datapoint labels + buffered-and-replayed log events, `claude mcp` secret redaction, parallel-tool-call independence, Linux fullscreen clipboard, Reduce-motion; plus two workflow/bg focus fixes. | WF, BG |
| [2.1.160](./2.1.160.md) | **Permission-surface hardening + auto-mode/effort clarity**, wrapped around the **`workflow`→`ultracode` keyword rename** (inflection point) — expanded sensitive-write gate (shell-startup + build-tool config), read-before-edit via grep, auto-mode opt-in copy fixes. | WF |
| [2.1.159](./2.1.159.md) | **Internal infrastructure only** — behavior-neutral checkpoint; no user-facing change (documented + provenance-verified). | — |
| [2.1.158](./2.1.158.md) | **Auto mode escapes first-party** — single bullet: auto mode on Bedrock/Vertex/Foundry for Opus 4.7/4.8 only, via `CLAUDE_CODE_ENABLE_AUTO_MODE=1`. (Permission-mode availability.) | — |
| [2.1.157](./2.1.157.md) | **Plugin ergonomics graduate** — `.claude/skills` plugins first-class, `claude plugin init`, `/plugin` autocomplete, `claude agents` honoring the `agent` settings field + `--agent`, `EnterWorktree` mid-session switch, `tool_decision` OTEL `tool_parameters`; plus the `workflowKeywordTriggerEnabled` /config setting (precursor to the .160 rename) and background worktree-retire fixes. | WF, BG |

> **Focus-touch totals across the 22 releases:** BG in 11, WF in 6, AT in 4, CMP in 2, MEM in 2. Nine releases (.175, .173, .170, .168, .167, .165, .163, .159, .158) touch none of the five and are wholly breadth/primary analysis (note .170 — Fable 5 — is out-of-scope but causally upstream of in-scope fallbacks). Many *non-focus* subsystems changed in nearly every release; those are the primary content of the by_version files and are out of scope only relative to the five depth modules.

---

## See also

- **Depth modules (the five focus features):** [`../30_agent_team/`](../30_agent_team/) · [`../42_workflow/`](../42_workflow/) · [`../36_background_agents/`](../36_background_agents/) · [`../07_compact/`](../07_compact/) · [`../31_auto_memory/`](../31_auto_memory/)
- **Per-bullet pointers (every in-scope bullet → `cli_inner_pretty.js:<line>` + per-version "Out of scope" enumeration):** [`../00_overview/changelog_to_code_map.md`](../00_overview/changelog_to_code_map.md)
- **Long-form architectural narrative (the *why* behind each delta):** [`../00_overview/changelog_analysis.md`](../00_overview/changelog_analysis.md)
- **Obfuscated → readable symbol lookups:** the four [`../00_overview/symbol_index_*.md`](../00_overview/) + the five per-feature [`../00_overview/symbol_additions_v2_1_183_*.md`](../00_overview/) tables
- **Upstream changelog (the bullet source of truth):** [`../../CHANGELOG.md`](../../CHANGELOG.md)
- **Tree front door:** [`../README.md`](../README.md)
- **Prior window (v2.1.143 → v2.1.156) by_version reference:** [`../../../claude_code_v_2.1.156/analyze/by_version/`](../../../claude_code_v_2.1.156/analyze/by_version/)
