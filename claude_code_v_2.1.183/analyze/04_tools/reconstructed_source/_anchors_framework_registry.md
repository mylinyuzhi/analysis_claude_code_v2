# Anchors: Tool FRAMEWORK + REGISTRY/ASSEMBLY (v2.1.183)

> Mirrors 2.1.88 `src/Tool.ts` + `src/tools.ts`. All line numbers refer to the PRIMARY bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
> Every line cited below was Read directly in this session. Scaffold (2.1.156) readable names are
> used; obf ids are RE-DERIVED from THIS bundle by string-anchoring.

## 0. One-screen symbol map (verified)

| Readable name | 2.1.183 obf | cli_inner_pretty.js | Kind | Anchor |
|---|---|---|---|---|
| buildTool / createTool (factory) | `pi` | 149995-149997 | function | `Object.defineProperties({...jJu, userFacingName...})` |
| TOOL_DEFAULTS | `jJu` | 150010, 150013-150021 | object | `isEnabled: () => !0` defaults block |
| toolMatchesName | `Rc` | 149965-149967 | function | `e.name === t || e.aliases?.includes(t)` |
| registerBaseToolsProvider | `jAi` | 149968-149970 | function | sets provider slot `UAi` |
| getBaseToolsProvider() accessor | `u_n` | 149971-149973 | function | `return UAi?.()` |
| buildToolNameMap | `UJu` | 149974-149983 | function | builds name+alias → tool Map |
| findToolByName (cached) | `vl` | 149984-149994 | function | WeakMap/WeakSet memo + `e.find(Rc)` |
| getEmptyToolPermissionContext | `kO` | 149998-150006 | function (arrow) | `mode:"default", alwaysAllowRules:{}` |
| getToolsForDefaultPreset | `kfo` | 436512-436516 | function | mask-then-filter `.map(isEnabled())` → `.map(name)` |
| getAllBaseTools | `LW` | 436517-436577 | function | the exhaustive built-in tool ARRAY |
| filterToolsByDenyRules | `Fce` | 436578-436580 | function | deny rule + `effectiveMaxPermission!=="blocked"` |
| assembleToolPool | `YY` | 436581-436588 | function | built-ins + skill/MCP, sorted prefix, uniqBy name |
| getTools | `zR` | 436622-436652 | function (arrow var) | deny + REPL filter + isEnabled mask |
| parseToolPreset | `xfo` | 436507-436511 | function | `if(!L$p.includes(t)) return null` |
| TOOL_PRESETS | `L$p` | 436621 (decl), 436713 (assign) | variable | assigned `["default"]` |
| initializeBundledTools (lazy thunk) | (the `zL` body tail) | 436700-436714 | block | slot assignment + `jAi(LW)` |
| getMergedTools (built-in+mcp merge) | `iqe` | 539937-539945 | function | partition by `Lx`, sort, coordinator filter |
| getMergedTools React hook | `m6n` | 539962-539973 | function | `useMemo(() => iqe(e, YY(...)))` |
| uniqBy("name") | `fS` (= `KCd`) | 229801-229803, 229808 | function | dedup keep-first |
| partition | `d$e` (= `Z0c`) | 35785-35793 | function | splits into `[[],[]]` |
| isMcpTool predicate | `Lx` | 272589-272591 | function | `name.startsWith("mcp__") || isMcp===true` |

---

## 1. ValidationResult / ToolResult / ToolUseContext / ToolProgress shapes

### ValidationResult (`{result:true}` | `{result:false, message, errorCode?}`)

This is the return type of every tool's `validateInput`. It is never a named type in the bundle
(TS erased), but the **literal shape is stable and ubiquitous**. Verified instances:

- `chunks` Glob/Grep path validation: `cli_inner_pretty.js:370793` `return { result: !0 };`
- `cli_inner_pretty.js:370801` `return { result: !1, message: c, errorCode: 1 };`
- `cli_inner_pretty.js:371127` ``return { result: !1, message: `Path is not a directory: ${e}`, errorCode: 2 };``
- Write tool (`yE`, name `Kc`): `cli_inner_pretty.js:390676` `if (o) return { result: !1, message: o, errorCode: 7 };`
- Write tool (`yE`): `cli_inner_pretty.js:390688` `if (s) return { result: !1, message: s, errorCode: 0 };`
- Write tool Perforce read-only (`kze` = the P4 read-only message): `cli_inner_pretty.js:390700` `return { result: !1, message: kze, errorCode: 6 };`
- NotebookEdit: `cli_inner_pretty.js:391107` `if (i) return { result: !1, message: i, errorCode: 12 };`
- NotebookEdit verbatim strings:
  - `cli_inner_pretty.js:391117` `return { result: !1, message: "Edit mode must be replace, insert, or delete.", errorCode: 4 };`
  - `cli_inner_pretty.js:391119` `return { result: !1, message: "Cell type is required when using edit_mode=insert.", errorCode: 5 };`
  - `cli_inner_pretty.js:391145` `return { result: !1, message: "Notebook file does not exist.", errorCode: 1 };`

**Shape (reconstructed):**
```ts
type ValidationResult =
  | { result: true }
  | { result: false; message: string; errorCode?: number };
```
The `result: !0` (true, no message) is the success branch; `result: !1` carries `message` (string,
shown to the model) and an optional small integer `errorCode` used for telemetry/branching.
Confidence: **high** (dozens of converging literal sites across distinct tools).

### ToolResult<T> / ToolProgress / ToolUseContext

These are the `call()` async-generator yield items. They survive only as object-literal shapes:
- `{ type: "result", data: ... }` and `{ type: "progress", ... }` are the two yield kinds; the
  progress filter helper is `STe` at `cli_inner_pretty.js:149962-149964`:
  `e.filter((t) => t.data?.type !== "hook_progress")` — confirms progress items carry `.data.type`.
- ToolUseContext is the `permissionContext`-bearing context object threaded into `checkPermissions`,
  `validateInput`, `call`. Its `toolPermissionContext` field shape is exactly `kO()` (see §4); MCP
  override field is `mcpPermissionModeOverrides` (`cli_inner_pretty.js:150005`).

Confidence on exact field names of ToolResult/ToolProgress: **medium** (no named type; inferred from
yield-site shapes). Confidence on ToolUseContext.permissionContext shape: **high** (== `kO()`).

---

## 2. buildTool factory + TOOL_DEFAULTS + helpers

### `buildTool` / `createTool` (`pi`) — def → built tool

```javascript
// ============================================
// buildTool (pi) — wraps a partial tool def with TOOL_DEFAULTS, preserving lazy getters
// Location: cli_inner_pretty.js:149995-149997
// ============================================

// ORIGINAL (for source lookup):
function pi(e) {
  return Object.defineProperties({ ...jJu, userFacingName: () => e.name }, Object.getOwnPropertyDescriptors(e));
}

// READABLE (for understanding):
function buildTool(def) {
  // Start from TOOL_DEFAULTS (jJu), seed userFacingName from def.name, then copy EVERY own
  // descriptor of def on top. Using getOwnPropertyDescriptors (not a {...spread}) keeps
  // `get inputSchema()` a getter — schemas build lazily on first access, not at factory time.
  return Object.defineProperties(
    { ...TOOL_DEFAULTS, userFacingName: () => def.name },
    Object.getOwnPropertyDescriptors(def),
  );
}

// Mapping: pi→buildTool, e→def, jJu→TOOL_DEFAULTS
```

Anchor: it is the `Object.defineProperties({...jJu, userFacingName: () => e.name}, ...)` body. It is
the factory used **49 times** in the bundle (`grep -c '= pi({'` → 49), including `Cl` (Bash, 450669),
`_G`/`kG` (MCP-resource, 236164/275629), the Task tools (430475-430979), worktree tools
(429903/430191), and the Workflow tool slot read in §3.

### `TOOL_DEFAULTS` (`jJu`)

```javascript
// ============================================
// TOOL_DEFAULTS (jJu) — default tool method implementations merged by buildTool
// Location: cli_inner_pretty.js:150013-150021 (decl at 150010, init inside thunk Ci)
// ============================================

// ORIGINAL (for source lookup):
jJu = {
  isEnabled: () => !0,
  isConcurrencySafe: (e) => !1,
  isReadOnly: (e) => !1,
  isDestructive: (e) => !1,
  checkPermissions: (e, t) => Promise.resolve({ behavior: "allow", updatedInput: e }),
  toAutoClassifierInput: (e) => "",
  userFacingName: (e) => "",
};

// READABLE (for understanding):
TOOL_DEFAULTS = {
  isEnabled: () => true,               // default: always enabled (overridden per-tool, e.g. Workflow)
  isConcurrencySafe: (input) => false, // default: not safe to run in parallel
  isReadOnly: (input) => false,        // default: mutating
  isDestructive: (input) => false,
  checkPermissions: (input, ctx) => Promise.resolve({ behavior: "allow", updatedInput: input }),
  toAutoClassifierInput: (input) => "",
  userFacingName: (input) => "",
};

// Mapping: jJu→TOOL_DEFAULTS
```

The defaults are assigned inside the `E(() => {...})` thunk `Ci` at `cli_inner_pretty.js:150011-150022`
(`Ci` also initializes `BAi = new WeakMap()`, `FAi = new WeakSet()` — the findToolByName caches).

### `toolMatchesName` (`Rc`)

```javascript
// ============================================
// toolMatchesName (Rc) — name or alias match
// Location: cli_inner_pretty.js:149965-149967
// ============================================

// ORIGINAL (for source lookup):
function Rc(e, t) {
  return e.name === t || (e.aliases?.includes(t) ?? !1);
}

// READABLE:
function toolMatchesName(tool, name) {
  return tool.name === name || (tool.aliases?.includes(name) ?? false);
}

// Mapping: Rc→toolMatchesName, e→tool, t→name
```

### `findToolByName` (`vl`) — cached, with alias canonicalization

```javascript
// ============================================
// findToolByName (vl) — find a tool by name/alias, with WeakMap memoization
// Location: cli_inner_pretty.js:149984-149994
// ============================================

// ORIGINAL (for source lookup):
function vl(e, t, n) {
  let r = n && Object.hasOwn(n, t) ? n[t] : void 0;
  if (r !== void 0 && r !== t) return vl(e, r);
  let o = BAi.get(e);
  if (o) return o.get(t);
  if (FAi.has(e)) {
    let s = UJu(e);
    return (BAi.set(e, s), s.get(t));
  }
  return (FAi.add(e), e.find((s) => Rc(s, t)));
}

// READABLE:
function findToolByName(tools, name, aliasMap) {
  // 1. canonicalize via optional alias map (e.g. {KillBash:"TaskStop"})
  const canonical = aliasMap && Object.hasOwn(aliasMap, name) ? aliasMap[name] : undefined;
  if (canonical !== undefined && canonical !== name) return findToolByName(tools, canonical);
  // 2. fast path: name→tool Map already cached for THIS array instance
  const cached = nameMapCache.get(tools);
  if (cached) return cached.get(name);
  // 3. second sighting of this array → build the Map and cache it
  if (seenArrays.has(tools)) {
    const map = buildToolNameMap(tools);
    nameMapCache.set(tools, map);
    return map.get(name);
  }
  // 4. first sighting → linear find (avoid map cost for one-shot lookups)
  seenArrays.add(tools);
  return tools.find((t) => toolMatchesName(t, name));
}

// Mapping: vl→findToolByName, UJu→buildToolNameMap, BAi→nameMapCache(WeakMap),
//          FAi→seenArrays(WeakSet), Rc→toolMatchesName, n→aliasMap
```

Note the **two-tier caching**: a one-off lookup does a linear `find` (cheap); the *second* lookup of
the same array materializes a Map and caches it on a WeakMap keyed by the array. The alias-map
parameter `n` (e.g. the `{KillBash:"TaskStop", AgentOutput:"TaskOutput", ...}` table at
`cli_inner_pretty.js:55551-55556`) lets deprecated tool names resolve to current ones.

### `buildToolNameMap` (`UJu`)

```javascript
// ORIGINAL: cli_inner_pretty.js:149974-149983
function UJu(e) {
  let t = new Map();
  for (let n of e) {
    if (!t.has(n.name)) t.set(n.name, n);
    if (n.aliases) { for (let r of n.aliases) if (!t.has(r)) t.set(r, n); }
  }
  return t;
}
// Mapping: UJu→buildToolNameMap. Maps both name AND each alias → tool (first wins).
```

### Base-tools provider registration (`jAi` / `u_n`)

```javascript
// ORIGINAL: cli_inner_pretty.js:149968-149973
function jAi(e) { UAi = e; }          // registerBaseToolsProvider — stores the getAllBaseTools fn
function u_n() { return UAi?.(); }     // getBaseTools accessor — calls the registered provider
// Mapping: jAi→registerBaseToolsProvider, u_n→getBaseTools, UAi→baseToolsProvider slot (decl 150007)
```
`jAi(LW)` is called once at the end of the lazy init thunk (`cli_inner_pretty.js:436714`), publishing
`getAllBaseTools` (`LW`) as the global provider so other subsystems read the canonical list without
importing `LW` directly.

---

## 3. getAllBaseTools (`LW`) — the exhaustive built-in tool ARRAY

**Start: `cli_inner_pretty.js:436517` — End: `cli_inner_pretty.js:436577`.**

```javascript
// ============================================
// getAllBaseTools (LW) — exhaustive hand-ordered built-in tool array
// Location: cli_inner_pretty.js:436517-436577
// ============================================

// ORIGINAL (for source lookup):
function LW() {
  return [
    f3n,                                              // Agent tool (name vs="Agent")
    q3n,                                              // TaskOutput tool (name W9="TaskOutput")
    ...(Su() ? [Cl] : []),                            // Bash tool — only if a shell is available
    ...[hj, OR].filter((e) => !jot().has(e.name)),    // Glob, Grep — minus embedded-search-suppressed
    Ij,                                               // ExitPlanMode (name WM)
    hg,                                               // Read (name Ws="Read")
    kH,                                               // Edit (name Fa="Edit")
    yE,                                               // Write (name Kc="Write")
    wW,                                               // NotebookEdit (name xL="NotebookEdit")
    gF,
    Dxe,                                              // TodoWrite (name mR="TodoWrite")
    V3n,
    edt,
    sut,
    lut,
    a2n,
    ...[],
    k$p,                                              // DesignSyncTool  (NEW in 2.1.183)
    ...(iKa ? [iKa] : []),                            // ProjectsTool slot (NEW; CLAUDE_PROJECT_TOOL)
    ...(mKa ? [mKa] : []),
    ...(_H() ? [aVa, dVa, AVa, bVa] : []),            // Task tools: TaskCreate/TaskGet/TaskUpdate/TaskList
    ...(dKa ? [dKa] : []),                            // ArtifactTool slot
    ...(pKa ? [pKa] : []),
    ...(fKa ? [fKa] : []),
    ...(st("true") ? [Opo] : []),
    ...(lKa ? [lKa] : []),
    ...(cKa ? [cKa] : []),
    ...(uKa ? [uKa] : []),
    ...(udt() ? [G8a, Z8a] : []),                     // EnterWorktree / ExitWorktree
    Cfo(),                                            // SendMessageTool (lazy getter)
    ...(yKa ? [yKa] : []),
    ...(_Ka ? [_Ka] : []),                            // ShareOnboardingGuideTool slot
    ...(aKa ? [aKa] : []),
    wpo,                                              // REPL / code-execution tool (name PA="REPL")
    ...(Edt ? [Edt] : []),                            // <- WORKFLOW tool slot, spread iff non-null
    ...w$p,                                           // cron tools [CronCreate, CronDelete, CronList]
    ...C$p,                                           // (empty)
    Y9a,
    ...(Zza ? [Zza] : []),                            // RemoteTriggerTool slot
    ...(eKa ? [eKa] : []),
    ...(tKa ? [tKa] : []),
    Eqa,
    ...(nKa ? [nKa] : []),
    ...I$p,                                           // (empty)
    ...(rKa ? [rKa] : []),                            // MonitorTool slot
    o9a,
    x$p,                                              // SendUserFileTool
    ...(oKa ? [oKa] : []),                            // PushNotificationTool slot
    ...(sKa ? [sKa] : []),
    ...(Ifo() ? [Ifo()] : []),                        // PowerShellTool — only if available
    ...(gKa ? [gKa] : []),
    ...(hKa ? [hKa()] : []),
    ...[],
    _G,                                               // ListMcpResourcesTool
    kG,                                               // ReadMcpResourceTool
    ...(fR() ? [IMt] : []),                           // ToolSearch — only if tool-search mode on
    sla,
  ];
}

// Mapping: LW→getAllBaseTools, f3n→AgentTool, q3n→TaskOutputTool, Cl→BashTool,
//          hj→GlobTool, OR→GrepTool, Ij→ExitPlanModeTool, hg→ReadTool, kH→EditTool,
//          yE→WriteTool, wW→NotebookEditTool, Dxe→TodoWriteTool, k$p→DesignSyncTool,
//          iKa→projectsToolSlot, aVa/dVa/AVa/bVa→Task(Create/Get/Update/List)Tool,
//          G8a→EnterWorktreeTool, Z8a→ExitWorktreeTool, Cfo→getSendMessageTool,
//          wpo→ReplTool, Edt→workflowToolSlot, w$p→cronToolsSlot, Zza→remoteTriggerSlot,
//          rKa→monitorSlot, x$p→SendUserFileTool, oKa→pushNotifSlot, Ifo→getPowerShellTool,
//          _G→ListMcpResourcesTool, kG→ReadMcpResourceTool, IMt→ToolSearchTool, fR→isToolSearchEnabled
```

### Conditional-slot (`...(x?[x]:[])`) gate predicates — verified

- `Su()` (`cli_inner_pretty.js:221433-221436`): `if (Kt() !== "windows") return !0; return Cpe() !== null;`
  — Bash slot present unless on Windows with no Git-Bash. Sibling `vUe()` (221437-221439) chooses
  `"bash"` vs `"powershell"` off the same predicate.
- `_H()` (`cli_inner_pretty.js:299032-299035`): `if (yl(process.env.CLAUDE_CODE_ENABLE_TASKS)) return !1; return !0;`
  — Task tools (`aVa,dVa,AVa,bVa`) present unless `CLAUDE_CODE_ENABLE_TASKS` is *false-y* (note the
  inverted polarity via `yl`). Default ON.
- `udt()` (`cli_inner_pretty.js:431046-431048`): `return !0;` — worktree tools (`G8a,Z8a`)
  unconditionally present in this build.
- `fR()` (`cli_inner_pretty.js:221224+`): ToolSearch gate. Reads `PPt()` mode; logs
  `[ToolSearch:optimistic] mode=... ENABLE_TOOL_SEARCH=... result=...`. Slot `IMt` (name `DA="ToolSearch"`).
- `Ifo()` (`cli_inner_pretty.js:436617-436620`): `if (!JO()) return null; return (Gut(), ro(O3t)).PowerShellTool;`
  — PowerShell lazily required only when `JO()` (PowerShell available) is true.
- `st("true") ? [Opo] : []` — `st` is a truthy-string parse; gate for tool `Opo`.

### Lazy conditional slots — declarations (null-init) and population

Slot variables are declared (mostly `= null`) at `cli_inner_pretty.js:436589-436621`:
```javascript
// ORIGINAL (excerpt): cli_inner_pretty.js:436589-436621
var w$p, C$p, Zza, eKa = null, tKa = null, nKa = null, I$p, rKa, x$p, oKa,
  sKa = null, k$p, iKa,
  Cfo = () => (dza(), ro(uza)).SendMessageTool,        // lazy getter, not a slot
  aKa = null, lKa = null, cKa = null, uKa = null, dKa, pKa = null, fKa = null,
  mKa = null, AKa, gKa = null, hKa = null, yKa = null, _Ka, Edt,             // Edt = workflow slot
  Ifo = () => { if (!JO()) return null; return (Gut(), ro(O3t)).PowerShellTool; },  // PowerShell
  L$p,                                                  // TOOL_PRESETS
  zR = (e, t) => { ... };                               // getTools (see §6)
```

They are populated ONCE inside the lazy thunk `zL` (the `E(() => {...})` thunk whose body starts at
`cli_inner_pretty.js:436653`), in the tail block:

```javascript
// ============================================
// initializeBundledTools — slot population + provider publish (tail of zL thunk)
// Location: cli_inner_pretty.js:436700-436714
// ============================================

// ORIGINAL (for source lookup):
((w$p = [(LVa(), ro(kVa)).CronCreateTool, (PVa(), ro(DVa)).CronDeleteTool, (RVa(), ro(MVa)).CronListTool]),
  (C$p = []),
  (Zza = (qVa(), ro(WVa)).RemoteTriggerTool),
  (I$p = []),
  (rKa = (Ldo(), ro(kdo)).MonitorTool),
  (x$p = (XVa(), ro(YVa)).SendUserFileTool),
  (oKa = (r6a(), ro(n6a)).PushNotificationTool),
  (k$p = (M6a(), ro(P6a)).DesignSyncTool),
  (iKa = Ge.CLAUDE_PROJECT_TOOL ? (z6a(), ro(V6a)).ProjectsTool : null),
  (dKa = (Eza(), ro(Sza)).ArtifactTool),
  (AKa = (AR(), ro(sG))),
  (_Ka = (wza(), ro(Tza)).ShareOnboardingGuideTool),
  (Edt = (() => ((Qza(), ro(Jza)).initBundledWorkflows(), (vdo(), ro(Hdo)).WorkflowTool))()),
  (L$p = ["default"]));
jAi(LW);

// READABLE (for understanding):
cronToolsSlot      = [requireLazy(cronCreateMod).CronCreateTool,
                      requireLazy(cronDeleteMod).CronDeleteTool,
                      requireLazy(cronListMod).CronListTool];
remoteTriggerSlot  = requireLazy(remoteTriggerMod).RemoteTriggerTool;
monitorSlot        = requireLazy(monitorMod).MonitorTool;
sendUserFileSlot   = requireLazy(sendUserFileMod).SendUserFileTool;
pushNotifSlot      = requireLazy(pushNotifMod).PushNotificationTool;
designSyncSlot     = requireLazy(designSyncMod).DesignSyncTool;            // NEW in 2.1.183
projectsToolSlot   = process.env.CLAUDE_PROJECT_TOOL                       // NEW in 2.1.183
                       ? requireLazy(projectsMod).ProjectsTool : null;
artifactSlot       = requireLazy(artifactMod).ArtifactTool;
coordinatorModeModule = requireLazy(coordinatorMod);                       // AKa (isCoordinatorMode)
shareOnboardingSlot   = requireLazy(shareOnboardingMod).ShareOnboardingGuideTool;
workflowToolSlot   = (() => {                                              // IIFE: side effect FIRST
  requireLazy(bundledWorkflowsMod).initBundledWorkflows();
  return requireLazy(workflowToolMod).WorkflowTool;
})();
TOOL_PRESETS = ["default"];
registerBaseToolsProvider(getAllBaseTools);                               // jAi(LW)

// Mapping: w$p→cronToolsSlot, Zza→remoteTriggerSlot, rKa→monitorSlot, x$p→SendUserFileTool,
//          oKa→pushNotifSlot, k$p→designSyncSlot, iKa→projectsToolSlot, dKa→artifactSlot,
//          AKa→coordinatorModeModule, _Ka→shareOnboardingSlot, Edt→workflowToolSlot,
//          L$p→TOOL_PRESETS, ro→requireLazy, jAi→registerBaseToolsProvider, LW→getAllBaseTools
```

**Workflow slot wrinkle (carryover from 2.1.156):** the workflow slot `Edt` is the only slot
assigned by an IIFE (`cli_inner_pretty.js:436712`) because it must run `initBundledWorkflows()` as a
side effect *before* reading `.WorkflowTool`, enforced by the comma operator. Same idiom as the
2.1.156 `_H$`/`k0` block.

---

## 4. getEmptyToolPermissionContext (`kO`)

```javascript
// ============================================
// getEmptyToolPermissionContext (kO) — fresh empty permission context
// Location: cli_inner_pretty.js:149998-150006
// ============================================

// ORIGINAL (for source lookup):
var kO = () => ({
    mode: "default",
    additionalWorkingDirectories: new Map(),
    alwaysAllowRules: {},
    alwaysDenyRules: {},
    alwaysAskRules: {},
    isBypassPermissionsModeAvailable: !1,
    mcpPermissionModeOverrides: {},
  });

// READABLE:
const getEmptyToolPermissionContext = () => ({
  mode: "default",
  additionalWorkingDirectories: new Map(),
  alwaysAllowRules: {},
  alwaysDenyRules: {},
  alwaysAskRules: {},
  isBypassPermissionsModeAvailable: false,
  mcpPermissionModeOverrides: {},
});

// Mapping: kO→getEmptyToolPermissionContext
```

Callers verified: `cli_inner_pretty.js:294564` (`{ ...kO(), mode: t }`), 528436, 529365 (React memo
`zR(kO())`), 542417, 584445, 584471, 598914, 598928, 608913. This object IS the
`toolPermissionContext`/`ToolUseContext.permissionContext` shape.

---

## 5. Presets — TOOL_PRESETS (`L$p`) + parseToolPreset (`xfo`) + getToolsForDefaultPreset (`kfo`)

```javascript
// ============================================
// parseToolPreset (xfo) — validates a preset name against TOOL_PRESETS
// Location: cli_inner_pretty.js:436507-436511
// ============================================

// ORIGINAL:
function xfo(e) {
  let t = e.toLowerCase();
  if (!L$p.includes(t)) return null;
  return t;
}

// READABLE:
function parseToolPreset(name) {
  const lower = name.toLowerCase();
  if (!TOOL_PRESETS.includes(lower)) return null;   // TOOL_PRESETS === ["default"]
  return lower;
}

// Mapping: xfo→parseToolPreset, L$p→TOOL_PRESETS
```
`TOOL_PRESETS` (`L$p`) is assigned `["default"]` at `cli_inner_pretty.js:436713`. So the only valid
preset in 2.1.183 is `"default"`.

```javascript
// ============================================
// getToolsForDefaultPreset (kfo) — enabled-only NAME list for `--tools default`
// Location: cli_inner_pretty.js:436512-436516
// ============================================

// ORIGINAL:
function kfo() {
  let e = LW(),
    t = e.map((n) => n.isEnabled());
  return e.filter((n, r) => t[r]).map((n) => n.name);
}

// READABLE:
function getToolsForDefaultPreset() {
  const all = getAllBaseTools();
  const enabledMask = all.map((t) => t.isEnabled());   // mask FIRST (single isEnabled() call each)
  return all.filter((_, i) => enabledMask[i]).map((t) => t.name);
}

// Mapping: kfo→getToolsForDefaultPreset, LW→getAllBaseTools
```
**Mask-then-filter**: `isEnabled()` is evaluated exactly once per tool into an array, then used as a
filter — avoids re-invoking side-effecting gates mid-iteration. Same pattern as `getTools`.

---

## 6. getTools (`zR`) — the production built-in pool

```javascript
// ============================================
// getTools (zR) — built-in pool after CLAUDE_CODE_SIMPLE fast-path / deny / REPL / isEnabled mask
// Location: cli_inner_pretty.js:436622-436652 (decl as arrow var)
// ============================================

// ORIGINAL (for source lookup):
zR = (e, t) => {
  if (Ge.CLAUDE_CODE_SIMPLE) {
    if (nI() && !t?.skipReplFilter) {
      let d = [wpo, kH, yE];
      if (AKa?.isCoordinatorMode()) d.push(f3n, edt, Cfo(), ...(Edt && Pw() ? [Edt] : []));
      return Fce(d, e);
    }
    let c = Ifo(),
      u = [...(Su() ? [Cl] : []), ...(c ? [c] : []), hg, kH];
    if (AKa?.isCoordinatorMode()) u.push(f3n, edt, Cfo(), ...(Edt && Pw() ? [Edt] : []));
    return Fce(u, e);
  }
  let n = new Set([_G.name, kG.name, Em]),
    r = LW().filter((c) => !n.has(c.name)),
    o = Fce(r, e),
    s = o.some((c) => Rc(c, ns)) && Cl.isEnabled(),
    i = !1;
  if (nI() && !t?.skipReplFilter) {
    if (o.some((u) => Rc(u, PA))) ((o = o.filter((u) => !jtt.has(u.name))), (i = !0));
  }
  let a = o.map((c) => c.isEnabled()),
    l = o.filter((c, u) => a[u]);
  if (Qw() && !s && !i) {
    let c = Fce([hj, OR].filter((u) => !l.includes(u)), e);
    l = [...l, ...c];
  }
  return l;
};

// READABLE (for understanding):
const getTools = (permissionContext, options) => {
  // ---- CLAUDE_CODE_SIMPLE minimal-tools fast path ----
  if (env.CLAUDE_CODE_SIMPLE) {
    if (isReplActive() && !options?.skipReplFilter) {
      let minimal = [replTool, editTool, writeTool];                       // [wpo, kH, yE]
      if (coordinatorModeModule?.isCoordinatorMode())
        minimal.push(agentTool, edtTool, getSendMessageTool(),
                     ...(workflowToolSlot && Pw() ? [workflowToolSlot] : []));
      return filterToolsByDenyRules(minimal, permissionContext);
    }
    const ps = getPowerShellTool();
    let minimal = [...(bashAvailable() ? [bashTool] : []), ...(ps ? [ps] : []), readTool, editTool];
    if (coordinatorModeModule?.isCoordinatorMode())
      minimal.push(agentTool, edtTool, getSendMessageTool(),
                   ...(workflowToolSlot && Pw() ? [workflowToolSlot] : []));
    return filterToolsByDenyRules(minimal, permissionContext);
  }

  // ---- normal path ----
  // 1. drop the 3 "special" tools handled elsewhere: ListMcpResources, ReadMcpResource, StructuredOutput
  const special = new Set([ListMcpResourcesTool.name, ReadMcpResourceTool.name, "StructuredOutput"]); // Em
  let pool = getAllBaseTools().filter((t) => !special.has(t.name));
  // 2. deny-rule filter
  pool = filterToolsByDenyRules(pool, permissionContext);
  // remember whether Bash survived (used by the search-fallback re-add below)
  const bashPresent = pool.some((t) => toolMatchesName(t, "Bash")) && bashTool.isEnabled();
  let replFiltered = false;
  // 3. REPL-mode filter: when REPL tool present and not skipped, hide REPL-only primitives (jtt set)
  if (isReplActive() && !options?.skipReplFilter) {
    if (pool.some((t) => toolMatchesName(t, "REPL"))) {                    // PA === "REPL"
      pool = pool.filter((t) => !replOnlyNames.has(t.name));               // jtt
      replFiltered = true;
    }
  }
  // 4. isEnabled() mask-then-filter
  const mask = pool.map((t) => t.isEnabled());
  let enabled = pool.filter((_, i) => mask[i]);
  // 5. search-mode fallback: if tool-search active but Bash gone & no REPL filtering, re-add Glob/Grep
  if (isToolSearchActive() && !bashPresent && !replFiltered) {             // Qw()
    const reAdd = filterToolsByDenyRules([globTool, grepTool].filter((t) => !enabled.includes(t)),
                                         permissionContext);
    enabled = [...enabled, ...reAdd];
  }
  return enabled;
};

// Mapping: zR→getTools, e→permissionContext, t→options, Fce→filterToolsByDenyRules,
//          LW→getAllBaseTools, Em→"StructuredOutput", _G→ListMcpResourcesTool, kG→ReadMcpResourceTool,
//          ns→"Bash"(BashTool name), Cl→bashTool, PA→"REPL", jtt→replOnlyNames,
//          wpo→replTool, kH→editTool, yE→writeTool, hg→readTool, f3n→agentTool, Cfo→getSendMessageTool,
//          Edt→workflowToolSlot, Pw→isWorkflowsEnabled-ish gate, AKa→coordinatorModeModule,
//          nI→isReplActive, Qw→isToolSearchActive, hj→globTool, OR→grepTool, Rc→toolMatchesName
```

Three special tools dropped here (`cli_inner_pretty.js:436634`): `ListMcpResources` (`_G.name`),
`ReadMcpResource` (`kG.name`), and `StructuredOutput` (`Em = "StructuredOutput"`, decl
`cli_inner_pretty.js:221489`). The CLAUDE_CODE_SIMPLE coordinator branch is the only place the
workflow slot truthiness is AND-ed with a runtime gate inline: `...(Edt && Pw() ? [Edt] : [])`
(`cli_inner_pretty.js:436626, 436631`).

---

## 7. filterToolsByDenyRules (`Fce`) + assembleToolPool (`YY`) + getMergedTools (`iqe`)

### filterToolsByDenyRules (`Fce`)

```javascript
// ============================================
// filterToolsByDenyRules (Fce) — strip deny-matched / mcp-blocked tools
// Location: cli_inner_pretty.js:436578-436580
// ============================================

// ORIGINAL:
function Fce(e, t) {
  return e.filter((n) => !N3t(t, n) && n.mcpInfo?.effectiveMaxPermission !== "blocked");
}

// READABLE:
function filterToolsByDenyRules(tools, permissionContext) {
  return tools.filter(
    (tool) => !isToolDenied(permissionContext, tool)                       // N3t: deny-rule match
           && tool.mcpInfo?.effectiveMaxPermission !== "blocked",          // MCP server blocked
  );
}

// Mapping: Fce→filterToolsByDenyRules, e→tools, t→permissionContext, N3t→isToolDenied
```

### assembleToolPool (`YY`)

```javascript
// ============================================
// assembleToolPool (YY) — built-ins + skill/MCP tools, contiguous sorted built-in prefix, deduped
// Location: cli_inner_pretty.js:436581-436588
// ============================================

// ORIGINAL:
function YY(e, t, n) {
  let r = zR(e, n),
    o = Fce(t, e),
    s = (l, c) => l.name.localeCompare(c.name),
    i = n?.skillTools ?? [],
    a = i.length > 0 ? o.concat(Fce(i, e)).sort(s) : o.sort(s);
  return fS([...r].sort(s).concat(a), "name");
}

// READABLE:
function assembleToolPool(permissionContext, mcpTools, options) {
  const builtIns = getTools(permissionContext, options);                  // includes Workflow iff enabled
  const allowedMcp = filterToolsByDenyRules(mcpTools, permissionContext);
  const byName = (a, b) => a.name.localeCompare(b.name);
  const skillTools = options?.skillTools ?? [];
  const tail = skillTools.length > 0
    ? allowedMcp.concat(filterToolsByDenyRules(skillTools, permissionContext)).sort(byName)
    : allowedMcp.sort(byName);
  // built-ins sorted as a CONTIGUOUS PREFIX, then MCP/skill tail; uniqBy keeps first (built-in wins)
  return uniqByName([...builtIns].sort(byName).concat(tail), "name");
}

// Mapping: YY→assembleToolPool, zR→getTools, Fce→filterToolsByDenyRules, fS→uniqByName,
//          e→permissionContext, t→mcpTools, n→options
```
The built-in-prefix-then-MCP-tail strategy keeps the system-prompt cache breakpoint stable: toggling
a built-in only invalidates the suffix. `fS` (`= KCd`, `cli_inner_pretty.js:229801-229803, 229808`)
is uniqBy("name") keeping first occurrence.

### getMergedTools (`iqe`) — final dedup + coordinator subtraction

```javascript
// ============================================
// getMergedTools (iqe) — merge two tool lists, dedup, partition (mcp last), coordinator filter
// Location: cli_inner_pretty.js:539937-539945
// ============================================

// ORIGINAL:
function iqe(e, t, n) {
  let [r, o] = d$e(fS([...e, ...t], "name"), Lx),
    s = (a, l) => a.name.localeCompare(l.name),
    i = [...o.sort(s), ...r.sort(s)];
  if (ZTo) {
    if (ZTo.isCoordinatorMode()) return lwl(i);
  }
  return i;
}

// READABLE:
function getMergedTools(toolsA, toolsB, mode) {
  // dedup by name, then partition into [mcpTools, nonMcpTools]
  const [mcp, nonMcp] = partition(uniqByName([...toolsA, ...toolsB], "name"), isMcpTool);
  const byName = (a, b) => a.name.localeCompare(b.name);
  let merged = [...nonMcp.sort(byName), ...mcp.sort(byName)];              // non-mcp first, mcp last
  if (coordinatorModule && coordinatorModule.isCoordinatorMode())
    return filterCoordinatorTools(merged);                                // lwl: coordinator allow-set
  return merged;
}

// Mapping: iqe→getMergedTools, d$e→partition, fS→uniqByName, Lx→isMcpTool,
//          lwl→filterCoordinatorTools, ZTo→coordinatorModule
```

`Lx` (`cli_inner_pretty.js:272589-272591`) — `isMcpTool`: `name.startsWith("mcp__") || isMcp===true`.
`d$e` (`= Z0c`, `cli_inner_pretty.js:35785-35793`) — partition into `[[],[]]`, predicate-true → index 0.
`lwl` (`cli_inner_pretty.js:539915-539936`) — coordinator-mode allow-set filter (keeps comms/role
tools, env `CLAUDE_CODE_COORDINATOR_EXTRA_TOOLS`, etc.).

### getMergedTools React hook (`m6n`)

```javascript
// ORIGINAL: cli_inner_pretty.js:539962-539973
function m6n(e, t, n) {
  let r = ft((i) => i.replBridgeEnabled), o = ft((i) => i.replBridgeOutboundOnly), s = ft((i) => i.skillTools);
  return (sSe(r && !o), uwl.useMemo(() => {
    let i = YY(n, t, { skillTools: s });
    return iqe(e, i, n.mode);
  }, [e, t, s, n, r, o]));
}
// Mapping: m6n→useMergedTools(hook), YY→assembleToolPool, iqe→getMergedTools, ft→useAppStateSelector
```
This is the live wiring: `assembleToolPool` → `getMergedTools`, memoized on context/mcp/skill inputs.

### Other `assembleToolPool` callers (context anchors)
- `cli_inner_pretty.js:417129` — agent-spawn tool list: `YY(ie, glt(de.mcp.tools.concat(me)), {skipReplFilter:!0, skillTools:de.skillTools})`
- `cli_inner_pretty.js:434153`, `423831`, `675260`, `687178` — main-loop / subagent tool assembly.
`glt` (`cli_inner_pretty.js:362520`) filters MCP tools before assembly.

---

## 8. Tool name constants (verified, for array identity)

| Const | Value | Line | Array slot |
|---|---|---|---|
| `vs` | "Agent" | 149939 | `f3n` (head) |
| `W9` | "TaskOutput" | 221313 | `q3n` |
| `ns` | "Bash" | 145275 | `Cl` |
| `Ws` | "Read" | 152217 | `hg` |
| `Fa` | "Edit" | 152083 | `kH` |
| `Kc` | "Write" | 193030 | `yE` |
| `xL` | "NotebookEdit" | 221448 | `wW` |
| `WM` | "ExitPlanMode" | 152253 | `Ij` |
| `mR` | "TodoWrite" | 221398 | `Dxe` |
| `PA` | "REPL" | 221566 | `wpo` |
| `DA` | "ToolSearch" | 221267 | `IMt` |
| `Ff` | "AskUserQuestion" | 221315 | (in array region) |
| `Em` | "StructuredOutput" | 221489 | special (dropped in getTools) |
| `zk` | "Workflow" | 221550 | `Edt` slot |
| `Vw` | "TaskCreate" | 221451 | `aVa` |
| `g7` | "TaskGet" | 221452 | `dVa` |
| `dP` | "TaskUpdate" | 221453 | `AVa` |
| `IL` | "TaskList" | 220833 | `bVa` |
| `WAe` | "EnterWorktree" | 221266 | `G8a` |
| `ZTn` | "ExitWorktree" | 221547 | `Z8a` |
| `$g` | "ScheduleWakeup" | 220800 | — |
| `uP` | "TaskStop" | 220834 | — |

---

## 9. NEW-in-2.1.183 vs 2.1.156 (0-count greps in BEFORE bundle)

BEFORE bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`.

- **`DesignSyncTool` / `"DesignSync"`** — `grep -c '"DesignSync"'` 2.1.156 → **0**, 2.1.183 → **1**.
  NEW tool slot `k$p` (built `DesignSyncTool`, line 436707). Confidence: **high**.
- **`ProjectsTool`** — `grep -c 'ProjectsTool'` 2.1.156 → **0**, 2.1.183 → **2**. NEW conditional slot
  `iKa`, gated by `process.env.CLAUDE_PROJECT_TOOL` (line 436708). Confidence: **high**.
- **`"TeamCreate"` / `"TeamDelete"`** — present in 2.1.156 (`grep -c '"TeamCreate"'` → 1) but the
  literal is **GONE** in 2.1.183 (no `"TeamCreate"`/`"TeamDelete"` match). The 2.1.156 scaffold's
  "agent-team `[TeamCreate,TeamDelete]`" conditional spread has been **redesigned away**; the analogous
  `_H() ? [...]` spread in 2.1.183 instead carries the **Task tools**
  (`TaskCreate/TaskGet/TaskUpdate/TaskList`, `aVa,dVa,AVa,bVa`), and the `udt() ? [G8a,Z8a]` spread
  carries **EnterWorktree/ExitWorktree**. So the scaffold task hint "agent-team spread" maps to NO
  surviving Team* tools in 2.1.183 — confirm with the writer. Confidence: **high** that Team* literals
  are gone; **medium** on the exact intended mapping of the scaffold's "agent-team" label.

---

## 10. Open questions / cautions for the reconstructor

1. The 2.1.156 scaffold listed an "agent-team `...(R7()?[TeamCreate,TeamDelete]:[])`" spread. In
   2.1.183 there are **no `Team*` tools**. The two surviving conditional pairs are
   `_H()?[Task*]` (line 436539, env `CLAUDE_CODE_ENABLE_TASKS`) and `udt()?[EnterWorktree,ExitWorktree]`
   (line 436547). Treat "agent-team" as superseded by the Task/Worktree toolsets.
2. `ToolResult<T>` / `ToolProgress` exact field names are inferred from yield-site shapes
   (`{type:"result"|"progress", data}`) — no named type in the bundle. Medium confidence.
3. `fR()` (ToolSearch gate) body extends past line 221230 (the optimistic-mode logging). Only the
   first lines were read; full mode resolution (`PPt()`, `ENABLE_TOOL_SEARCH`) lives there if the
   reconstructor needs the exact branch table.
4. `st("true")?[Opo]` (line 436543) — `Opo` tool identity not resolved here (low priority; appears to
   be an env-gated experimental tool). Resolve via `Opo = pi({...})` decl if needed.
