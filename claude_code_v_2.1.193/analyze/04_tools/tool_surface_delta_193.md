# Tool-surface delta: 50 → 51 tools (the `ReadMcpResourceDirTool` add) + the `--tools` leak fix

> **Type/version:** one NET-NEW tool (`ReadMcpResourceDirTool`, in the .185–.193 window) + a 2.1.186 `--tools` feature-gate fix (un-isolable) + a false-delta disambiguation (`classifyAllShell`). Window: v2.1.183 → v2.1.193.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (build `a1938d2a`). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged `(183)`.

---

## TL;DR — exactly one add, zero removals, zero description changes to existing tools

Directory + content diff of `assets/tools/*.md` (183 vs 193): **50 → 51** tool assets. Exactly **one** new file, `ReadMcpResourceDirTool.md`; **zero** removed; every other `*.md` that "differs" differs only in its `Offset:` header line and a re-mangled Zod schema token (e.g. `Bash.md` schema `AJa()`→`fyl()`, `PowerShell.md` `V1p()`→`Qnf()`) — the description/schema *text* is byte-identical. So the model-facing tool surface gained one tool and changed nothing else.

Two adjacent items round out the picture:
- The new tool is a **deferred** tool (`shouldDefer: !0`), and it is exactly the `+1` entry that v2.1.193 added to the `getAvailableTools` hidden-tool exclusion set — so the registry/permission change is *directly* the new tool, not an unrelated refinement.
- The 2.1.186 changelog's `--tools` "feature-gated tools slip through on cold launch" fix is **not byte-isolable**: the deny-list builder and the built-in registry are carryover-identical, so the actual fix is a startup-ordering change that a grep-diff cannot pin. Documented honestly with low confidence.

---

## 1. NET-NEW tool: `ReadMcpResourceDirTool`

**What it does.** A model-facing tool that lists the **direct children** of a directory resource on an MCP server (non-recursive). It is the tool wrapper around the MCP `resources/directory/read` protocol call — which the *client* already understood in 183; 2.1.193 adds the *tool* so the model can invoke it.

```javascript
// ============================================
// ReadMcpResourceDirTool — name const, description, and tool object
// Location: cli_inner_pretty.js:283504 (name), 283505 (desc), 283585 (object), 283549 (schemas)
// ============================================

// ORIGINAL (for source lookup):
var iX = "ReadMcpResourceDirTool",
  D_a = `\nList the direct children of a directory resource on an MCP server.\n- server: …\n- uri: …\n\nOnly usable against a server that has declared support for directory listing. The listing is not recursive.\n`;
// ...
var dlp, plp, _ne;                       // input schema, output schema, tool object
// ...
((dlp = Ce(() => A.object({ server: A.string()…, uri: A.string()… }))),
 (plp = Ce(() => A.object({ resources: A.array(A.object({ uri, name, mimeType? }))…, error: A.string().optional()… }))),
 (_ne = Xs({
    isConcurrencySafe() { return !0; },
    isReadOnly() { return !0; },
    toAutoClassifierInput(e) { return `${e.server} ${e.uri}`; },
    shouldDefer: !0,                       // ← deferred tool (hidden from the default available list)
    name: iX,
    aliases: ["ReadMcpResourceDir"],
    searchHint: "list the children of an MCP directory resource",
    maxResultSizeChars: 1e5,
    async description() { return D_a; },
    ...
 })));

// READABLE (for understanding):
const READ_MCP_RESOURCE_DIR_TOOL_NAME = "ReadMcpResourceDirTool";
const readMcpResourceDirInputSchema  = lazyZod(() => z.object({ server: z.string(), uri: z.string() }));
const readMcpResourceDirOutputSchema = lazyZod(() => z.object({
  resources: z.array(z.object({ uri: z.string(), name: z.string(), mimeType: z.string().optional() })),
  error: z.string().optional(),
}));
const ReadMcpResourceDirTool = defineTool({
  isReadOnly: () => true, isConcurrencySafe: () => true,
  shouldDefer: true,                       // exposed only when relevant, not in the always-on toolset
  name: READ_MCP_RESOURCE_DIR_TOOL_NAME, aliases: ["ReadMcpResourceDir"],
  description: async () => READ_MCP_RESOURCE_DIR_DESCRIPTION,
  inputSchema: readMcpResourceDirInputSchema, outputSchema: readMcpResourceDirOutputSchema,
});

// Mapping: iX→READ_MCP_RESOURCE_DIR_TOOL_NAME, D_a→description, dlp→inputSchema, plp→outputSchema,
//   _ne→ReadMcpResourceDirTool (tool object), Xs→defineTool, Ce→lazyZod, A→z
```

**Protocol vs tool — the carryover boundary.** The protocol method string `resources/directory/read` is **carryover** (`grep -c` → 193=5 / 183=4; the +1 is the new tool's own use). The MCP *client* could already do directory reads in 183; what 2.1.193 adds is (a) the model-facing tool object `_ne`, (b) the name const `iX`, and (c) a server-capability gate so the tool/description only surfaces when the server declared directory-listing support (`e.directoryRead ? …` at `:451562`).

**Cross-references injected into sibling tool descriptions (NET-NEW).** Two existing descriptions now point at the new tool (both use the `${iX}` interpolation, `grep` → 193=1 each / 183=0):

```javascript
// :284345  (resource-not-found path in the MCP resource reader)
let c = FGe(s.capabilities) ? ` If the URI is a directory resource, use ${iX} instead.` : "";

// :451562  (resource description builder)
let t = e.directoryRead ? ` Call ${iX} on "${e.uri}" or a subdirectory URI to list its contents.` : "";
```

**Why a deferred tool.** `shouldDefer: !0` keeps `ReadMcpResourceDirTool` out of the default always-loaded toolset; it is surfaced contextually (when an MCP server with directory support is present / when a directory URI is encountered). This avoids bloating every request's tool list with a niche MCP-only tool — the same pattern used for other deferred/conditional tools. The cross-reference strings (§above) are how the model is *told* the tool exists at the moment it is relevant (e.g. when a `resources/read` returns "not found" on what is actually a directory).

> Overlap: the MCP protocol/transport side of this tool is owned by `39_mcp/` and `00_overview/symbol_additions_v2_1_193_mcp.md`. This doc owns the *tool-surface* fact (the 50→51 count and the model-facing object).

---

## 2. Registry/permission machinery — mostly carryover; one body change that IS the new tool

### `getBuiltinToolRegistry` (`b4`, :444127) — CARRYOVER

The built-in tool registry is structurally identical to 183 (@436518): same gate-conditional entries (`...(ZH()?[…]:[])`, `...(Bht()?[…]:[])`, etc.). No tool was added or removed *here* — `ReadMcpResourceDirTool` is a deferred MCP tool, registered through the MCP/deferred path, not the static built-in registry.

### `getAvailableTools` (`a$`, :444225) — body change: exclusion set 3 → 4, and the `+1` is the new tool

`getAvailableTools` filters `getBuiltinToolRegistry()` by per-tool `isEnabled()` and removes a hidden-tool set. That set grew by one entry:

```javascript
// ============================================
// getAvailableTools — hidden-tool exclusion set grew from 3 to 4 (the +1 = ReadMcpResourceDirTool)
// Location: cli_inner_pretty.js:444237    (183: zR set @436634)
// ============================================

// ORIGINAL (for source lookup):
let n = new Set([oW.name, hW.name, _ne.name, Ep]),   // 193 — 4 names; _ne = ReadMcpResourceDirTool object
  r = b4().filter((c) => !n.has(c.name)), ...

// (183) ORIGINAL:
let n = new Set([_G.name, kG.name, Em]),              // 183 — 3 names; no MCP-dir tool

// READABLE (for understanding):
let hiddenFromDefaultList = new Set([
  toolA.name, toolB.name,
  ReadMcpResourceDirTool.name,                        // ← NEW: hide the deferred MCP-dir tool
  "StructuredOutput",                                 // Ep
]);
let available = getBuiltinToolRegistry().filter((t) => !hiddenFromDefaultList.has(t.name));

// Mapping: a$→getAvailableTools, _ne→ReadMcpResourceDirTool object, Ep→"StructuredOutput" (:229498),
//   b4→getBuiltinToolRegistry; 183 zR exclusion was [_G.name, kG.name, Em]
```

> **Drift fix (vs scout dossier).** The dossier saw the 3→4 change and called it "most likely an unrelated refinement … flagged for deeper analysis." It is **not** unrelated: the new entry is `_ne.name`, and `_ne` (`:283585`) is the `ReadMcpResourceDirTool` object itself. So the `a$` change *is* the new tool being excluded from the default available list — exactly what `shouldDefer: !0` implies. This connects bullet "registry change" to bullet "new tool" cleanly. Verified by reading `_ne`'s definition (`name: iX`, `shouldDefer:!0`) at `:283585`.

### `initializeToolPermissionContext` (`Sjo`, :598509) — the `--tools` deny builder — CARRYOVER

The `--tools` flag (`:712389`, *"Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names…"*) resolves to deny-rules under the `toolsNarrowing` permission source (`grep -c toolsNarrowing` → 8=8). The deny-universe is built inside `Sjo`:

```javascript
// ============================================
// initializeToolPermissionContext — --tools deny-universe (ALL builtins − requested)
// Location: cli_inner_pretty.js:598530-598539
// ============================================

// ORIGINAL (for source lookup):
let p = [];
if (n && n.length > 0) {                               // n = --tools value
  let $ = AQl(n), W = new Set($.map(KL)),
    z = (u ? qwo() : b4().map((J) => J.name)).filter((J) => !W.has(J));  // all builtin names − requested
  if (!u) { for (let J of [Ss, Cu, Wc]) if (!W.has(J) && !z.includes(J)) z.push(J); }
  p = z;                                               // deny everything not requested
}

// READABLE (for understanding):
let denied = [];
if (toolsCli && toolsCli.length > 0) {
  let requested = new Set(parseToolList(toolsCli).map(toToolName));
  let deny = (isDefaultAll ? allToolNamesExpanded() : getBuiltinToolRegistry().map(t => t.name))
    .filter(name => !requested.has(name));            // deny = builtins − requested
  if (!isDefaultAll) for (let n of [ALWAYS_A, ALWAYS_B, ALWAYS_C]) if (!requested.has(n) && !deny.includes(n)) deny.push(n);
  denied = deny;
}

// Mapping: Sjo→initializeToolPermissionContext, n→toolsCli, b4→getBuiltinToolRegistry, AQl→parseToolList, KL→toToolName
```

This block is structurally identical to 183 (@586466 region). So the visible `--tools` plumbing is carryover.

---

## 3. The 2.1.186 `--tools` feature-gate fix (LOW confidence — not byte-isolable)

**Changelog item:** `--tools` could let feature-gated tools slip through before flags loaded on a cold first launch.

**Mechanism (inferred).** `getBuiltinToolRegistry` (`b4`) includes feature-gated tools *conditionally* via gate functions. On a cold first launch the gate config has not been fetched, so a gate returns `false` → the gated tool is **absent from `b4()`** → absent from the `--tools` deny universe `z` (= `builtins − requested`) → it remains *allowed* once the flags later load. Hence "slips through."

**Why it is not isolable.** Both `Sjo` (the deny builder) and `b4` (the registry) are carryover-identical between 183 and 193, so the actual fix is a **startup-ordering change** (await the gate config before computing the tool-permission context), which does **not** surface as a discrete grep-diff. No `flagsLoaded`/`ensureFlags`/`waitForFlags`-style symbol exists in either bundle (all 0). 

**Honest verdict:** the fix is real per the changelog but cannot be pinned to a byte-precise site from a tool-surface diff. **Recommend a focused follow-up** in `38_permissions/` tracing the gate-config bootstrap vs the `Sjo`/`initializeToolPermissionContext` call order on the cold `-p` path. Cross-link: `38_permissions/`.

---

## 4. False delta: Bash/PowerShell tool descriptions are unchanged (the `classifyAllShell` disambiguation)

`classifyAllShell` is **net-new** (`grep -c classifyAllShell` → 193=2 / 183=0): the 2.1.193 changelog item *"Added `autoMode.classifyAllShell` setting to route all Bash/PowerShell commands through the auto-mode classifier."* But it lives in the **auto-mode/permissions** layer — a settings field (`:55814`) read by `autoMode?.classifyAllShell === !0` (`:58759`). It does **not** touch the Bash/PowerShell tool's description or schema:

- `diff` of the `## Description` block of `Bash.md` (183 vs 193) → **identical**. Same for `PowerShell.md` → **identical**.
- The only `*.md` diffs for these tools are the `Offset:` header and the re-mangled Zod schema token — re-mangle artifacts, not behavior.

So for the *tool surface*, the Bash/PowerShell description angle is a **false delta**. `classifyAllShell` belongs to `38_permissions/` (auto-mode); it is mentioned here only to disambiguate.

---

## Evidence note (NET-NEW vs CARRYOVER)

| Item | 193 anchor | 183 grep-diff | Verdict |
|------|-----------|---------------|---------|
| `assets/tools/*.md` count | — | 50 → 51 (+ReadMcpResourceDirTool.md, 0 removed) | **+1 tool** |
| `ReadMcpResourceDirTool` name (`iX`) | :283504 | grep 193=2 / 183=0 | **NET-NEW** |
| tool object `_ne` (deferred) | :283585 | absent in 183 | **NET-NEW** |
| `a$` exclusion set (3→4, +`_ne.name`) | :444237 | 183 `zR` set = 3 names @436634 | **NET-NEW (body change = the new tool)** |
| sibling-desc cross-refs `${iX}` | :284345, :451562 | 193=1 each / 183=0 | **NET-NEW** |
| `resources/directory/read` (protocol) | — | 193=5 / 183=4 (+1 = the tool) | **CARRYOVER (client)** |
| `getBuiltinToolRegistry` (`b4`) | :444127 | gate-conditional entries unchanged | **CARRYOVER** |
| `initializeToolPermissionContext` (`Sjo`) | :598509 | deny block identical; `toolsNarrowing` 8=8 | **CARRYOVER** |
| Bash/PowerShell descriptions | `assets/tools/Bash.md` etc. | `## Description` byte-identical | **CARRYOVER (false delta)** |
| `classifyAllShell` | :55814 / :58759 | 193=2 / 183=0 | **NET-NEW but → permissions, not tool surface** |
| `--tools` cold-launch gate fix | — | machinery carryover; no isolable site | **REFINEMENT (un-isolable, low confidence)** |

---

## Cross-links

- Sibling 193 docs: [`bash_mode_autocomplete.md`](./bash_mode_autocomplete.md), [`bash_input_respond.md`](./bash_input_respond.md), [`README.md`](./README.md).
- MCP-protocol side of `ReadMcpResourceDirTool`: `39_mcp/` + [`../00_overview/symbol_additions_v2_1_193_mcp.md`](../00_overview/symbol_additions_v2_1_193_mcp.md).
- `--tools` cold-launch gate fix + `classifyAllShell` auto-mode routing: `38_permissions/`.

---

## Related Symbols

> Symbol mappings live in the central index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Tools — registry/permission home)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (MCP — the tool's protocol home)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - per-feature additions: [symbol_additions_v2_1_193_tools.md](../00_overview/symbol_additions_v2_1_193_tools.md)

Key functions/constants in this document:
- `ReadMcpResourceDirToolName` (`iX`, :283504) / `ReadMcpResourceDirTool` object (`_ne`, :283585) / input+output schemas (`dlp`/`plp`, :283549) / description (`D_a`, :283505) — NET-NEW.
- `defineTool` (`Xs`, :151125) — the tool-object wrapper.
- `getBuiltinToolRegistry` (`b4`, :444127) — CARRYOVER.
- `getAvailableTools` (`a$`, :444225) — exclusion set 3→4, `+_ne.name`; 183 `zR`@436622.
- `"StructuredOutput"` (`Ep`, :229498) — exclusion-set tool-name string.
- `initializeToolPermissionContext` (`Sjo`, :598509) — `--tools` deny builder; CARRYOVER.
- `classifyAllShell` setting (:55814) / reader (:58759) — NET-NEW, routes to permissions/auto-mode (not tool surface).
