# Claude in Chrome and IDE integration deltas (v2.1.193 → v2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

This module owns the changelog bullets about **Claude in Chrome** (the browser extension and its
transport), the **`tengu_bridge_*` family** (which turns out *not* to be the Chrome transport — see
below), and the **IDE / Claude Desktop / Cowork host surfaces**.

---

## 0. The headline finding: "bridge" names three different transports

The single most useful thing this module establishes is that **`chrome_bridge_*` and `tengu_bridge_*`
are unrelated subsystems**, and a reader who greps `bridge` will conflate them. There are three:

| # | Subsystem | Telemetry prefix | Transport | 220 / 193 literal count |
|---|---|---|---|---|
| 1 | **Chrome extension bridge** — relays `browser:*` tool calls to the paired Chrome extension | `chrome_bridge_*` | WebSocket to `wss://bridge.claudeusercontent.com` (`:537614`) | 26 / 26 — **pure carryover** |
| 2 | **Environment/work bridge** — the `claude bridge` worker that long-polls the server for *work* and spawns local sessions (Cowork "local agent" / VM mode) | `tengu_bridge_*` (poll/session/spawn arms) | HTTPS REST `/v1/environments/...` (`:541657`, `:541691`) | `[bridge:api]` 29 / 29 — **carryover** |
| 3 | **REPL bridge** — mirrors the *current interactive terminal session* to claude.ai (Remote Control) | `tengu_bridge_repl_*` | WebSocket, session id `cse_*`, created via `POST /v1/code/sessions` (`:333754`) | `tengu_bridge_repl` 11 / 10 |

`tengu_bridge` as a whole is **220=48 / 193=41**. The bridge machinery is *mature*, not new. The five
genuinely net-new gates in the family are small, surgical additions; they are the delta and they are
documented in [`bridge_transport.md`](bridge_transport.md), which also reconstructs the architecture
because none of it was documented in the 2.1.193 tree.

---

## 1. Per-bullet ledger

Every changelog bullet scoped to `chrome_ide` (primary or secondary). Anchors are 2.1.220 lines the
author read.

| # | Bullet (abridged) | Ver | Verdict | Anchor (220) | Doc section |
|---|---|---|---|---|---|
| 1 | Claude in Chrome is now generally available | .198 | **SERVER_SIDE**, but a net-new *client* surface exists | `chrome_install_upsell` 220=19/193=0, gate `tengu_chrome_install_upsell` `:773913`, `tengu_chrome_install_upsell_shown` `:768702` | [chrome_ga](chrome_ga_and_hardening.md#1-ga-is-server-side-the-client-delta-is-an-install-upsell) |
| 2 | `/desktop` failing "Cannot determine working directory" after worktree exit | .198 | **UNANCHORED** — literal 220=0/193=0 | `/desktop` command object `:449729` (`availability: ["claude-ai"]`, policy `allow_desktop_handoff` 3/3) | [ide_and_desktop](ide_and_desktop.md#3-desktop-and-the-worktree-working-directory-bullet) |
| 3 | Claude in Chrome repeatedly opening the reconnect page across builds/config dirs | .199 | **DELTA — precisely located** | `skipReconnectAutoOpen` 220=2/193=0, rewritten `installChromeNativeHostManifest` `:664042-664091` | [chrome_ga](chrome_ga_and_hardening.md#5-the-199-reconnect-page-loop-a-one-boolean--two-boolean-rewrite) |
| 4 | [VSCode] Settings toggle "Enable Remote Control for all sessions" | .203 | **CARRYOVER** — string 1/1 (`:452049`); toggle lives in the extension | — | [ide_and_desktop](ide_and_desktop.md#1-the-vs-code-bullets-are-not-in-this-bundle) |
| 5 | Reserved the "Claude Browser" MCP server name (alongside "Claude Preview") | .205 | **NET_NEW** | `fkg = "Claude Browser"` `:151629`, reserved set `:289042` | [ide_and_desktop](ide_and_desktop.md#5-reserved-mcp-server-names-ahead-of-the-desktop-pane-rename) |
| 6 | Cowork VM-mode local-agent sessions failing "Not logged in · Please run /login" | .205 | **UNANCHORED** — `Not logged in` 4/4 | entrypoint map `remote_cowork`/`local-agent` → `"Cowork"` `:46388` | [ide_and_desktop](ide_and_desktop.md#4-cowork-vm-mode-and-the-not-logged-in-bullet) |
| 7 | Desktop sessions stuck "running" after a mid-turn slash command | .208 | **UNANCHORED** (SDK-control-plane; owned by `51_headless_sdk`) | — | [ide_and_desktop](ide_and_desktop.md#2-the-two-sdk-host-bullets-desktop-stuck-running-and-change-directory) |
| 8 | "Change directory" in SDK hosts failing "A turn is in progress" | .210 | **NET_NEW** | `A turn is in progress` 220=1/193=0 `:663612`; `set_cwd` 220=13/193=2 | [ide_and_desktop](ide_and_desktop.md#2-the-two-sdk-host-bullets-desktop-stuck-running-and-change-directory) |
| 9 | File-upload validation: `.prn`/trailing dot accepted, multiple hard links refused | .211 | **NET_NEW** | `multiple hard links…` `:514282`; `Bxu` un-suffixer `:217627`; reserved-name regex `:162387` | [chrome_ga](chrome_ga_and_hardening.md#3-211-9--the-hard-link-refusal-and-the-prn-round-trip) |
| 10 | File uploads to Claude in Chrome from remote and CLI sessions | .211 | **NET_NEW (whole module)** | `prepareChromeFileUploadInput` `:514094`, export table `:514071-514078`; MCP interception `:295687` **and** `:301229` | [chrome_ga](chrome_ga_and_hardening.md#2-the-file-upload-rebuild-path--content) |
| 11 | Startup hang when the Chrome extension is enabled but Chrome is not running | .211 | **DELTA — thin.** Only a dead-probe gate | `tengu_dead_probe_chrome_legacy_socket` `:267285` (220=1/193=0) | [chrome_ga](chrome_ga_and_hardening.md#6-211-12--the-startup-hang-and-the-dead-probe-on-the-legacy-socket) |
| 12 | Claude in Chrome setup pages failing to open in the browser on Windows | .211 | **NET_NEW** (the `openInBrowser` anchor is a decoy, 3/3) | `App Paths` 220=9/193=0, `:267035-267106`, Windows arm `:267233-267256` | [chrome_ga](chrome_ga_and_hardening.md#4-211-20--windows-setup-pages-the-app-paths-resolver) |
| 13 | [VSCode] Remote Control banner now describes what it does | .211 | **UNANCHORED** — extension-side | — | [ide_and_desktop](ide_and_desktop.md#1-the-vs-code-bullets-are-not-in-this-bundle) |
| 14 | Claude in Chrome: hardened file-upload path validation | .211 | **NET_NEW** (the `663633` anchor in the scoping pass is **wrong** — see §2) | validator `l$_` `:514159-514233` | [chrome_ga](chrome_ga_and_hardening.md#22-the-validator-eight-refusals-in-a-deliberate-order) |
| 15 | `save_to_disk` on screenshots now writes the file and returns the path | .211 | **NET_NEW writer; carryover schema** | writer `:43697-43762`, `Screenshot saved to: ` 220=1/193=0 `:43767`, tmpdir `claude-chrome-screenshots-` 220=1/193=0 `:43677` | [chrome_ga](chrome_ga_and_hardening.md#7-211-36--save_to_disk-finally-has-a-writer) |
| 16 | `/ultrareview` "not a git repository" on Desktop names the repo folder | .212 | secondary — owned by `52_code_review` | `:496646` | — |
| 17 | Corporate mTLS/TLS-verify/OAuth-scope/proxy settings ignored in Claude Desktop | .216 | secondary — owned by `55_auth_providers` | `:827785` | — |
| 18 | Claude-in-Chrome 403-looping on reconnect when the OAuth token lacks a scope | .216 | **NET_NEW — one `catch` block** | `tengu_oauth_refresh_invalid_scope_fallback` `:155363` (220=1/193=0); scope-widening itself is carryover (`:136439 (193)`) | [ide_and_desktop](ide_and_desktop.md#6-the-403-reconnect-loop-a-scope-downgrade-retry) |
| 19 | [VSCode] RTL text rendering in wrong order | .216 | **SERVER_SIDE / extension-side** | — | [ide_and_desktop](ide_and_desktop.md#1-the-vs-code-bullets-are-not-in-this-bundle) |
| 20 | Mojibake when a long IDE selection was truncated mid-emoji | .218 | **UNANCHORED** — the `424599` anchor is **wrong** (see §2) | `ide_selection` reminder tag `:24886`, provider `:516680` | [ide_and_desktop](ide_and_desktop.md#7-the-217-ide-selection-mojibake-bullet-is-mis-anchored) |
| 21 | Improved sandbox command restrictions for IDE interactions | .218 | **UNANCHORED** — `ideSandbox` 0/0, `IDE interactions` 0/0. Link only → [`../49_sandbox/`](../49_sandbox/README.md) | — | [ide_and_desktop](ide_and_desktop.md#8-218--sandbox-restrictions-for-ide-interactions-not-anchorable-here) |
| 22 | LSP-only plugins incorrectly flagged for disuse | .203 | secondary — owned by `45_skills` | `serves code navigation` `:785743` (220=1/193=0) | — |

**Score for the bullets this module owns primarily (14):** 7 NET_NEW / DELTA with a read anchor,
2 CARRYOVER-or-server-side proven, 5 UNANCHORED.

Plus one **undocumented** delta with no changelog bullet at all: the five new `tengu_bridge_*` gates,
`CLAUDE_CODE_BRIDGE_SESSION_ID` (220=6/193=0), `CLAUDE_BRIDGE_REATTACH_GROUPING` (220=5/193=0), and
the **removal** of `CLAUDE_BRIDGE_USE_CCR_V2` (220=0/**193=2**). See
[`bridge_transport.md`](bridge_transport.md).

---

## 2. Two anchors the scoping pass got wrong

Both were carried in `00_overview/_scope_v*.md` and both are wrong. Recording them is the point of the
honesty requirement.

### 2.1 `cli_inner_pretty.js:663633` is *not* the file-upload hardening

`_scope_v211_214.md` row 35 anchors *".211 Claude in Chrome: hardened file-upload path validation"* on
`cross the trust boundary` / `invisible or non-printing characters` at `:663633`. Reading the site
shows it is the **`set_cwd` SDK control-request handler** — the same function that at `:663612` holds
`A turn is in progress …`, i.e. the `.210` "Change directory in SDK hosts" bullet (ledger row 8). The
two literals are `220=1 / 193=0` and genuinely new, but they belong to a *different bullet*.

The real file-upload hardening is `l$_` at `:514159-514233`, whose refusals carry the marker prefix
`claudeInChrome/fileUpload:` (`:514167`, `:514172`, `:514181`, `:514186`, `:514189`, `:514191`,
`:514226`, `:514231`).

### 2.2 `cli_inner_pretty.js:424599` is *not* the IDE selection truncation

`_scope_v215_220.md` row 10 anchors *".217 mojibake when a long IDE selection was truncated
mid-emoji"* (the scope file also **misfiles the release** — the bullet is `.218`) on "surrogate-safe truncation (`Array.from`)" at `:424599`. That line is inside an
**embedded skill's JavaScript payload** (a deep-research web-searcher script): `const quotedLabel =
s => { const cps = Array.from(stripLabelChars(s)) … }` with `LABEL_CAP = 40`. It has nothing to do
with the IDE. `selectedText` is 0/0 in both bundles; the bullet is not anchorable in this bundle.

---

## 3. What this module deliberately does not cover

- **`.199` plan mode + browser tool calls** (`cOt` `:288994`, `BEy` `:289288`) → owned by
  [`../05_plan_mode/readonly_auto_allow_198_199.md`](../05_plan_mode/readonly_auto_allow_198_199.md). One cross-reference is worth stating here because it lives in
  *this* module's code: the plan-mode read-only predicate `Vqs` (`:512876`) declares a browser action
  read-only only when `!save_to_disk` — i.e. the `.211` `save_to_disk` writer (ledger row 15) is what
  makes that flag permission-relevant at all.
- **`.210` late `.claude/*` symlink sandbox reconciliation** → [`../49_sandbox/`](../49_sandbox/README.md).
- **The `tengu_dead_probe_*` pattern itself** → [`../46_todo_tasks/dead_probe_gate_family.md`](../46_todo_tasks/dead_probe_gate_family.md).
  This module owns only the Chrome member, `tengu_dead_probe_chrome_legacy_socket`.
- **`.216` mTLS in Claude Desktop** → [`../55_auth_providers/`](../55_auth_providers/README.md).
- **Dual MCP runtime trees** (why the upload interception appears twice, at `:295687` and `:301229`)
  → [`../39_mcp/dual_mcp_runtime_trees.md`](../39_mcp/dual_mcp_runtime_trees.md).

---

## 4. Documents

| File | Contents |
|---|---|
| [`bridge_transport.md`](bridge_transport.md) | The three-bridge architecture; the environment/work bridge REST surface; the REPL bridge; the five new `tengu_bridge_*` gates; the two new and one removed bridge env vars |
| [`chrome_ga_and_hardening.md`](chrome_ga_and_hardening.md) | `.198` GA + install upsell; the `.211` file-upload rebuild and its eight-refusal validator; hard links and `.prn`; Windows App Paths; the reconnect-page loop; the legacy-socket dead probe; `save_to_disk` |
| [`ide_and_desktop.md`](ide_and_desktop.md) | VS Code bullets (all extension-side); `set_cwd` / "A turn is in progress"; `/desktop`; Cowork VM mode; reserved MCP server names; the OAuth-scope 403 loop; the mis-anchored mojibake bullet; the sandbox-IDE pointer |

Symbol tables for this module:
[`../00_overview/symbol_additions_v2_1_220_chrome_ide.md`](../00_overview/symbol_additions_v2_1_220_chrome_ide.md).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `prepareChromeFileUploadInput` (`a$_`) - intercepts `file_upload` / `browser_batch` MCP calls and swaps paths for base64 content
- `validateUploadPath` (`l$_`) - the eight-refusal upload path validator
- `openInChrome` (`D9e`) - cross-platform URL opener with the new Windows App Paths arm
- `installChromeNativeHostManifest` (`Wva`) - native-host manifest writer and reconnect-page trigger
- `getBridgeWebSocketUrl` (`I3_`) - resolves `wss://bridge.claudeusercontent.com` / staging / `ws://localhost:8765`
- `createChromeContext` (`Tcp`) - assembles the Chrome MCP server context including `bridgeConfig`
