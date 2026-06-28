# Scout Dossier — Tools (bash-mode autocomplete, BashTool respond, tool surface)

Window: **v2.1.183 → v2.1.193** (feature window .185/.186/.187/.190/.191/.193)
Target bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build a1938d2a)
Before bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
88 named-TS ancestor: `/lyz/codespace/3rd/claude-code/src`

> Method: every claim cites `cli_inner_pretty.js:<line>` in the **193** bundle, quotes the obfuscated token, gives a readable gloss, and is grep-classified against 183 (net-new / body-change / carryover). Obf names are re-mangled per build — all symbols re-derived in 193.

---

## TL;DR verdicts

| Theme | Verdict | Confidence |
|---|---|---|
| Live file-path autocomplete in bash mode (`!`) | **Net-new wiring** in 193 (`bash-path` branch in live-suggestion callback). Underlying path-scan/fuzzy functions are CARRYOVER from the `@` at-mention feature. | high |
| `respondToBashCommands` auto-respond (2.1.186) | **Body change** to `processBashCommand`: schema field + telemetry field + `shouldQuery` gate are net-new (0 in 183). Default `true` → upgrade-behavior gotcha. | high |
| `--tools` feature-gated slip-through fix (2.1.186) | **NOT byte-isolable.** Deny-list builder (`Sjo`) + registry (`b4`) are carryover-identical to 183; the cold-launch gate-ordering fix is not visible as a discrete grep-diff. One adjacent body change found in `a$` (extra exclusion). | low |
| Tool surface diff (51 vs 50) | **+1 tool: `ReadMcpResourceDirTool`** (net-new model-facing tool; protocol method `resources/directory/read` is carryover). No removals. | high |
| Bash/PowerShell description change tied to `classifyAllShell` | **FALSE DELTA for tool descriptions.** Bash.md/PowerShell.md descriptions are byte-identical 183↔193. `classifyAllShell` is net-new but is an auto-mode/permissions concern, not a tool-description change. | high |

---

## Anchor table (193 bundle)

| Bullet | 193 anchor | obf symbol | readable gloss | 183-diff | confidence |
|---|---|---|---|---|---|
| Live bash-path autocomplete (wiring) | `629382-629401` | `se` cb / `te.current="bash-path"` | live-suggestion callback now branches in bash mode to path completion | `"bash-path"` 193=5, 183=0 → **net-new** | high |
| Path predicate | `188582` | `dKr` | `isPathLikeToken` (`~/`,`/`,`./`,`../`,`~`,`.`,`..`) | `e.startsWith("~/")` 193=8/183=7 (+1) → **net-new helper** | high |
| Path scan/fuzzy (reused) | `188612` / `188597` | `pKr` / `QOd` | `getPathCompletions` / `scanDirectoryForCompletion` | strings ("Failed to scan directory…", `includeHidden`) 1=1 → **carryover** (used by `@` at-path) | high |
| compgen Tab completion (reused) | `628313` / `628303` | `Uic` / `nYf` | `getShellCompletions` / `buildBashCompgenCommand` | `compgen -f` 1=1, `completionType` 7=7 → **carryover** | high |
| shell detector | `351210` | `Wpt` | `detectUserShell` (env SHELL → bash/zsh/fish) | byte-identical to 183 `bat()` @341521 → **carryover (re-mangled)** | high |
| auto-respond dispatch | `617575` | `y6f` | `processBashCommand` | `Owf` @183 604508 always `shouldQuery:!1` → **body change** | high |
| respond setting (schema) | `56492` | `respondToBashCommands` | settings field, default `?? !0` | `respondToBashCommands` 193=3, 183=0 → **net-new** | high |
| respond telemetry field | `617577` | `V("tengu_input_bash",{powershell,respond})` | `respond: s` added | `respond: s` 193=1, 183=0 → **net-new** | high |
| no-response marker | `599656` | `Sre` | `noResponseCaveatMarker` (prepended when not querying) | `Rte()`@183 (re-mangled) → **carryover** | high |
| `--tools` deny builder | `598509` (`p` block `598531-598539`) | `Sjo` | `initializeToolPermissionContext` | `p`/`z` block byte-identical to 183 `Sjo`-eq @586466 → **carryover** | high |
| built-in tool registry | `444127` | `b4` | `getBuiltinToolRegistry` | structure identical to 183 @436518 → **carryover** | high |
| available-tools filter | `444225` | `a$` | `getAvailableTools` (filters by `isEnabled()`) | exclusion set `[oW,hW,_ne,Ep]` vs 183 `[_G,kG,Em]` → **body change (+`_ne`)** | med |
| new MCP dir tool | `283504` / `283595` | `iX` / `dlp` | `ReadMcpResourceDirTool` name + Zod schema | `ReadMcpResourceDirTool` 193=2, 183=0 → **net-new tool** | high |
| Read/MCP cross-ref | `284345`, `451562` | `iX` interpolation | "use ReadMcpResourceDirTool instead / to list its contents" | `use ${iX} instead` 193=1, 183=0 → **net-new** | high |

---

## Bullet 1 — Live file-path autocomplete in bash mode (`!`)  [2.1.193]

**Verdict: NET-NEW WIRING. The path machinery is carryover from `@` mentions; the bash-mode application is new.**

### What is genuinely new
The marker token `"bash-path"` is **net-new** (193=5, 183=0; `grep -n '"bash-path"'` → 629396, 629401, 629650, 629696, 629874). All five sites are in the prompt-input suggestion engine. The decisive site is the live (debounced) suggestion callback `se` at **629382-629401**:

```javascript
// ============================================
// liveSuggestionCallback (se) — bash-mode path-autocomplete branch
// Location: chunks cli_inner_pretty.js:629382-629401
// ============================================

// ORIGINAL (for source lookup):
if (i === "bash" && ze.trim()) {
  let Pt = ze.slice(0, tt).lastIndexOf(" ") + 1, Ft = ze.slice(Pt, tt);
  if (Ft && (dKr(Ft) || Ft.includes("/"))) {
    Z.current = Ft;
    let wn = await pKr(Ft, { maxResults: 10 });
    if (Z.current !== Ft) return;
    if (wn.length > 0) {
      (W(void 0), l((rn) => ({ suggestions: wn, selectedSuggestion: Poe(rn.suggestions, rn.selectedSuggestion, wn), commandArgumentHint: void 0 })),
        (te.current = "bash-path"), H("directory"));
      return;
    }
  }
  if (S === "directory" && te.current === "bash-path") le();
  ... // falls through to old history ghost-text (Zic)
}

// READABLE (for understanding):
if (mode === "bash" && input.trim()) {
  let tokenStart = input.slice(0, cursor).lastIndexOf(" ") + 1;
  let currentToken = input.slice(tokenStart, cursor);
  if (currentToken && (isPathLikeToken(currentToken) || currentToken.includes("/"))) {
    lastPathQuery.current = currentToken;
    let results = await getPathCompletions(currentToken, { maxResults: 10 });
    if (lastPathQuery.current !== currentToken) return;           // stale guard
    if (results.length > 0) {
      clearGhostText();
      setState(s => ({ suggestions: results, selectedSuggestion: keepSelection(...), commandArgumentHint: undefined }));
      suggestionKind.current = "bash-path";
      setSuggestionType("directory");                              // show directory-style dropdown
      return;
    }
  }
  if (suggestionType === "directory" && suggestionKind.current === "bash-path") dismiss();
  ... // history ghost-text fallback
}

// Mapping: i→mode, ze→input, tt→cursor, dKr→isPathLikeToken, pKr→getPathCompletions, te.current→suggestionKind, H→setSuggestionType, "bash-path"→bashPathKind
```

### Why this is wiring, not a new engine
- `dKr` (188582) = `isPathLikeToken`: `e.startsWith("~/")||"/"||"./"||"../"|| e==="~"||"."|".."`. The string `e.startsWith("~/")` is 193=8 / 183=7 (the +1 is `dKr`'s body) → the **predicate is net-new**.
- `pKr` (188612) = `getPathCompletions`, and `QOd` (188597) = `scanDirectoryForCompletion` (cached `readdir`, dirs-first sort, cap `m4i=5000`). The distinctive strings "Failed to scan directory for path completion", `includeHidden`, `includeFiles`, `metadata: { type: f.type }` are all **1=1** in 183/193 → **CARRYOVER**. These are the same functions that power `@`-mention directory navigation (`at-path`, 2=2 in both).
- So the live path dropdown reuses the existing `@`-mention fuzzy path scanner; 2.1.193 simply added the `mode === "bash"` branch that feeds `pKr` into the dropdown and tags it `bash-path`.

The other 4 `bash-path` sites are accept/clear handling: dismiss when not bash (629650), and accept logic that appends `/` for directories vs a trailing space for files (629696-629700, 629874).

### NOT new (adversarial note)
The **compgen-based Tab completion** for bash mode is a **FALSE DELTA** — it exists byte-identical in 183:
- `Uic` (628313, `getShellCompletions`), `oYf` (628303, `runShellCompletion`), `nYf` (`buildBashCompgenCommand`: `compgen -f … | head -15 | … echo "$f/"`), `rYf` (`buildZshCompletionCommand`), `tYf`/`eYf` (context parse/classify), wrapper `DYf` (629143, `requestShellCompletion`), consts `MGo=15`, `ZKf=1000`.
- All present in 183 as `rGl`/`Sxf`/`_xf`/`bxf`/`yxf`/`hxf`/`Xxf`/`xPo`/`gxf`. The `if (i==="bash"){…await DYf/Xxf…}` accept-time dispatch (629781) is **identical** in 183 @615713. So Tab/accept shell completion in bash mode is carryover; only the **live inline path dropdown** is the 193 delta.
- `Wpt()` (193) is byte-identical to 183 `bat()` — re-mangled, NOT a new function (its 193=4/183=0 grep count is purely a rename artifact).

---

## Bullet 2 — `!` bash commands auto-trigger a Claude response  [2.1.186]

**Verdict: BODY CHANGE to `processBashCommand` + net-new setting. Default `true` is an upgrade-behavior gotcha.**

### Setting (net-new)
`respondToBashCommands` is **net-new** (193=3, 183=0). Schema @**56492**:
```
respondToBashCommands: A.boolean().optional().describe(
  "Whether Claude responds after an input-box ! bash command runs. Set to false to add the command output to context without a response. Default: true.")
```
Also appears in the persisted-preferences key list @691999 (`"respondToBashCommands"`) and the read site @617575.

### Dispatch (body change in `processBashCommand`)
`y6f` (193, **617575**) = `processBashCommand`; exported `gt(Mrc,{ processBashCommand: () => y6f })`. 183 equivalent is `Owf` (604508).

```javascript
// ============================================
// processBashCommand — auto-respond gate
// Location: cli_inner_pretty.js:617575 (read at 617577 / return at 617606)
// ============================================

// ORIGINAL (193):
async function y6f(e, t, n, r) {
  let o = d1() && Psr() === "powershell",
      s = Lr().respondToBashCommands ?? !0;
  V("tengu_input_bash", { powershell: o, respond: s });
  ...
  let S = s && !g.interrupted && !g.backgroundTaskId && !n.abortController.signal.aborted;
  return { messages: [ ...(S ? [] : [Sre()]), i, Pn({ content: `<bash-stdout>${_}</bash-stdout><bash-stderr>${ec(h)}</bash-stderr>` }) ], shouldQuery: S };
}

// READABLE:
async function processBashCommand(input, precedingBlocks, ctx, render) {
  let usePowershell = isWindows() && getDefaultShell() === "powershell";
  let shouldRespond = getSettings().respondToBashCommands ?? true;     // DEFAULT TRUE
  telemetry("tengu_input_bash", { powershell: usePowershell, respond: shouldRespond });
  ...
  let willQuery = shouldRespond && !result.interrupted && !result.backgroundTaskId && !ctx.abortController.signal.aborted;
  return {
    messages: [ ...(willQuery ? [] : [noResponseCaveatMarker()]), inputBlock, makeBlock(`<bash-stdout>…</bash-stdout><bash-stderr>…</bash-stderr>`) ],
    shouldQuery: willQuery,          // true ⇒ Claude responds to output
  };
}
// Mapping: y6f→processBashCommand, Lr→getSettings, Psr→getDefaultShell, s→shouldRespond, S→willQuery, Sre→noResponseCaveatMarker, V→telemetry
```

### 183 proof (body change)
183 `Owf` (604508): telemetry is `G("tengu_input_bash", { powershell: o })` — **no `respond` field**; and **every** return path is `shouldQuery: !1` (always context-only). So 183 never auto-responds; 193 gates on the setting. Confirmed: `respond: s` 193=1/183=0; `shouldQuery: !1` is the only mode in 183's `Owf`.

### Behavior of the gate
- `shouldQuery: true` (default) → the input block goes to the model and Claude responds to the output. `Sre()` (the `noResponseCaveatMarker`, body @599656: *"DO NOT respond to these messages … unless the user explicitly asks"*) is **omitted**.
- `respondToBashCommands:false` → `Sre()` is **prepended** and `shouldQuery:false` → output is added to context only, Claude stays silent (the pre-2.1.186 behavior).
- Interrupted / backgrounded / aborted commands always fall back to context-only even when the setting is true.

**UPGRADE GOTCHA:** default `?? !0` (true) means on upgrade to ≥2.1.186, every `!` command now triggers a model turn. Users who relied on silent `!` must set `"respondToBashCommands": false`.

### Related (carryover) settings near the schema
`defaultShell` (56489, `Psr`@617550 reader, both 2=2 → carryover) and `disableSkillShellExecution` (3=3 → carryover) sit beside `respondToBashCommands` in the schema but are not 193 deltas.

---

## Bullet 3 — `--tools` lets feature-gated tools slip through before flags loaded (cold first launch)  [2.1.186]

**Verdict: NOT byte-isolable from the visible tool-permission machinery, which is carryover-identical. Documented mechanism + the one adjacent body change found. LOW confidence on exact patch site.**

### The machinery (all carryover)
- `--tools` flag def @712387: *"Specify the list of available tools from the built-in set. Use '' to disable all tools, 'default' to use all tools, or specify tool names."* (`--tools <tools...>`).
- `--tools` → deny-rules under permission source `toolsNarrowing` (8=8 in 183/193 → carryover concept).
- Resolution lives in `Sjo` = `initializeToolPermissionContext` (**598509**), called by `Wvc` (692101) at startup (712995, `baseTools: f`). The deny-universe block:
  ```javascript
  // Sjo, cli_inner_pretty.js:598531-598539
  let p = [];
  if (n && n.length > 0) {                              // n = --tools value (baseToolsCli)
    let $ = AQl(n), W = new Set($.map(KL)),
        z = (u ? qwo() : b4().map((J) => J.name)).filter((J) => !W.has(J));   // ALL builtins − requested
    if (!u) { for (let J of [Ss, Cu, Wc]) if (!W.has(J) && !z.includes(J)) z.push(J); }
    p = z;                                              // deny everything not requested
  }
  ```
  This block is **byte-identical** to 183's `Sjo`-equivalent (586466). `b4()` = `getBuiltinToolRegistry` (**444127**) is structurally identical to 183 @436518 (same gate-conditional entries: `...(ZH()?[…]:[])`, `...(Bht()?[…]:[])`, `Gwo()`, `Wwo()`, `at("true")?…`, `...(TM()?[HFt]:[])`).

### Mechanism of the bug (inferred)
`b4()` includes feature-gated tools **conditionally** via gate functions (`ZH()`, `Bht()`, `Wwo()`, `TM()`, `at(...)`). On a **cold first launch** the gate config hasn't been fetched, so a gate returns `false` → the gated tool is **absent from `b4()`** → absent from the `--tools` deny list `z` → it remains allowed once flags later load. Hence "slips through". Because `Sjo`/`b4` are unchanged, the actual 2.1.186 fix is most plausibly a **startup-ordering change** (loading/awaiting the gate config before the tool-permission context is computed) — which does not surface as a discrete grep-diff (no `flagsLoaded`/`ensureFlags`/`waitForFlags`-style symbol exists in either bundle: all 0).

### One adjacent body change actually found
`a$` = `getAvailableTools` (**444225**) — filters `b4()` by per-tool `isEnabled()` — changed its hidden-tool exclusion set:
- 183 (`zR`@436642): `n = new Set([_G.name, kG.name, Em])` (3 names)
- 193 (`a$`): `n = new Set([oW.name, hW.name, _ne.name, Ep])` (**4 names, `_ne.name` added**)

This is a real body change but most likely an unrelated refinement (hiding one more tool from the default available list), not the `--tools` cold-launch gate fix per se. Flagged for deeper analysis.

> Honest limitation: I could not pin the cold-first-launch fix to a single byte-precise site. The deny path is carryover; the fix is an ordering/bootstrap change that a scout grep-diff cannot isolate. **Recommend a focused follow-up** tracing the gate-config bootstrap vs the `Wvc`/`Sjo` call order on the `-p`/cold path.

---

## Bullet 4 — Tool surface diff: 51 (193) vs 50 (183)

**Verdict: exactly one ADD, zero removals, zero description/schema changes to existing tools.**

Method: directory + content diff of `assets/tools/*.md` for 183 vs 193 (51 vs 50 `.md`).

### Added
- **`ReadMcpResourceDirTool`** — net-new (`ReadMcpResourceDirTool` 193=2, 183=0).
  - Name const `iX` @**283504**; description `D_a`/`P_a` @283505+ ("List the direct children of a directory resource on an MCP server … Only usable against a server that has declared support for directory listing. The listing is not recursive."); registered name @283595; Zod schema `dlp()` (per `assets/tools/ReadMcpResourceDirTool.md`).
  - Protocol method string `resources/directory/read` is **carryover** (193=5, 183=4) — the MCP **client** already understood directory reads in 183; 2.1.193 adds the **model-facing tool wrapper** plus the server-capability gate (`directoryRead`, `e.directoryRead ? …` @451562) and connector classification (`433368: e === iX → "connectors"`).
  - Cross-references added to sibling tool descriptions (net-new, `use ${iX} instead` 193=1/183=0): the Read/ReadMcpResource descriptions now say *"If the URI is a directory resource, use ReadMcpResourceDirTool instead."* (284345) and *"Call ReadMcpResourceDirTool on '…' or a subdirectory URI to list its contents."* (451562).

### Removed
- None. All 50 of 183's tools persist in 193.

### Existing tools — no real content change
Every other `*.md` "CHANGED" by diff differs **only** in the `Offset: 0x…` header line and the re-mangled Zod schema function token (e.g. Bash.md `AJa()`→`fyl()`, PowerShell.md `V1p()`→`Qnf()`). Description/schema text is unchanged. This is a re-mangle artifact, **not** a behavioral delta.

> Note: `ReadMcpResourceDirTool` is **not** named in the 2.1.193 changelog — it appears to be an undocumented tool-surface addition somewhere in the .185-.193 window. Overlaps the MCP dossier (`_scout_dossier_mcp.md`).

---

## Bullet 5 — Bash/PowerShell descriptions tied to `classifyAllShell`

**Verdict: FALSE DELTA for tool descriptions. The Bash/PowerShell tool descriptions are byte-identical 183↔193.**

- `diff` of the `## Description` block of `Bash.md` (183 vs 193) → **IDENTICAL**. Same for `PowerShell.md` → **IDENTICAL**.
- `classifyAllShell` is **net-new** (193=2, 183=0) and is the 2.1.193 changelog item *"Added `autoMode.classifyAllShell` setting to route all Bash/PowerShell commands through the auto-mode classifier."* But it is an **auto-mode / permissions** mechanism (the routing happens in the auto-mode classifier, not in the tool's description or schema). **It does not alter the Bash/PowerShell tool surface.**
- **Overlap:** `classifyAllShell` belongs to the permissions/auto-mode theme — see `_scout_dossier_permissions_automode.md`. Out of scope for the tool-surface dossier beyond this disambiguation.

---

## Proposed module docs

1. **`04_tools/bash_mode_autocomplete.md`** — the bash-mode input completion stack: (a) live inline path dropdown (NET-NEW `bash-path`: `dKr`/`pKr`/`QOd`, `se` callback 629382) reusing the `@`-mention fuzzy scanner; (b) the carryover compgen/zsh Tab completion (`Uic`/`oYf`/`nYf`/`rYf`/`DYf`). Clearly mark new-vs-carryover.
2. **`04_tools/bash_input_respond.md`** (or extend an existing bash-mode doc) — `processBashCommand` (`y6f`) auto-respond gate, `respondToBashCommands` default-true upgrade gotcha, the `Sre()` no-response caveat marker, and the `shouldQuery` semantics.
3. **`04_tools/tool_surface_delta_193.md`** — the 50→51 surface change: `ReadMcpResourceDirTool` add, the protocol-vs-tool distinction, sibling description cross-refs; assertion that no existing tool description/schema changed.
4. (Cross-link only) `--tools` cold-launch gate fix → note in permissions module; recommend a dedicated deep trace before writing a standalone doc (not yet isolable).

## Symbol index additions (route to files)

- Core execution (`symbol_index_core_execution.md`): `b4`/getBuiltinToolRegistry (444127), `a$`/getAvailableTools (444225), `Sjo`/initializeToolPermissionContext (598509), `Wvc`/buildToolPermissionContext (692101).
- Core features (`symbol_index_core_features.md`): `y6f`/processBashCommand (617575), `Sre`/noResponseCaveatMarker (599656), `Psr`/getDefaultShell (617550); bash autocomplete: `dKr`/isPathLikeToken (188582), `pKr`/getPathCompletions (188612), `QOd`/scanDirectoryForCompletion (188597), `Uic`/getShellCompletions (628313), `oYf`/runShellCompletion (628303), `nYf`/buildBashCompgenCommand, `rYf`/buildZshCompletionCommand, `DYf`/requestShellCompletion (629143), `Wpt`/detectUserShell (351210).
- Integrations/platform (`symbol_index_infra_*`): `iX`=`ReadMcpResourceDirTool` name const (283504), `dlp` Zod schema → MCP (`symbol_index_infra_platform.md`).

## Depth assessment

**Moderate-to-rich.** Two bullets (bash-path autocomplete, respondToBashCommands) are source-level rich with clean net-new proof and a concrete upgrade gotcha. The tool-surface diff is crisp (one add, no description changes). The `--tools` cold-launch fix is the weak point: the visible machinery is carryover-identical, so the actual fix is an un-isolable startup-ordering change (LOW confidence) and should be a follow-up. The `classifyAllShell`/Bash-description angle resolves cleanly as a false delta routed to the permissions dossier.
