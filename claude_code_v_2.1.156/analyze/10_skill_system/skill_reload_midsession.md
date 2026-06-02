# Mid-Session Skill Reloading: `/reload-skills` Command plus SessionStart `reloadSkills` Hook

> Companion to the sibling hooks-side analysis [../11_hooks/session_start_title_and_reload_skills.md](../11_hooks/session_start_title_and_reload_skills.md), which covers the `reloadSkills` **hook field** from the *hook plumbing* angle (schema/aggregator/`$U` collection alongside `sessionTitle`). **This document covers the same delta from the *skill-system* angle**: the user-typed `/reload-skills` command, and — for both entrypoints — the **cache-invalidation chain** that actually performs the re-scan (`_C` → `wu`/`vG8`/`Cw4`/`DRH`, `Bo` → `LG8`/`PG8`/`_RH`, `Xc.emit`, and `L2` re-reading from disk). It also explains **why two entrypoints share one reload primitive** and the **cold-start gotcha** that the 2.1.142 chokidar watcher alone could not cover.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Skills, Hooks, Compact, Plan, CLI
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent loop, Tools, State, Subagent
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry, Prompt, MCP, Permissions
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Slash commands, UI, Plugin

Key functions in this document:

- `reloadSkillsCommandHandler` (`Zzz`) — The `/reload-skills` `call()` body: snapshots skill names before/after, runs the cache-clear chain, returns an `N added, M removed` diff (cli_inner_pretty.js:521237-521252)
- `RELOAD_SKILLS_COMMAND` (`Gzz`) — The local-command descriptor (`type:"local"`, `name:"reload-skills"`, `supportsNonInteractive:true`, `thinClientDispatch:"post-text"`) (cli_inner_pretty.js:521260-521271)
- `runSessionStartHooks` (`$U`) — The SessionStart hook collector; sets `M = !0` on any hook's `reloadSkills`, then fires the identical chain (cli_inner_pretty.js:270637-270684)
- `clearSkillListingCaches` (`_C`) — The reload primitive shared by both entrypoints: `wu()`, `vG8()`, `Cw4()`, `DRH()` (cli_inner_pretty.js:545345-545347)
- `clearMemoizedSkillCommandCaches` (`wu`) — Clears the master aggregator (`sH9`), the user-list filter (`L2`), the bundled-skill loader (`RDH`), the workflow-command cache (`dDz`), and the async skill-index cache (cli_inner_pretty.js:545333-545344)
- `clearPluginSkillCache` (`vG8`) — Clears the plugin-skills memoized loader `zRH` (cli_inner_pretty.js:414228-414230)
- `clearBundledSkillCache` (`Cw4`) — Clears the bundled-skills memoized loader `Kd6` (cli_inner_pretty.js:414290-414292)
- `clearDynamicSkillCachesAndState` (`DRH`) — Clears the skill-dir loader `nd6` and `tx`, and resets the conditional/activated maps (cli_inner_pretty.js:421850-421852)
- `resetConditionalSkillState` (`Bo`) — Resets the dynamic-skill/command map `LG8`, the `PG8` "scanned" flag, and the cached `_RH` set (cli_inner_pretty.js:413487-413489)
- `skillReloadEmitter` (`Xc`) — Signal emitter re-announcing skill changes to UI subscribers; built via `Xc = y7()` (cli_inner_pretty.js:270624-270628)
- `createSignal` (`y7`) — The exception-isolating subscribe/emit/clear signal factory (cli_inner_pretty.js:1813-1838)
- `loadSkillsForList` (`L2`) — Memoized user-facing skill list; on cache-miss re-reads disk via `BL`→`sH9`→`gDz`→`nd6` (cli_inner_pretty.js:545823-545826)
- `aggregateAllSkillCommands` (`BL`) — The async disk-walk aggregator `L2` delegates to; itself delegates to the memoized `sH9` (cli_inner_pretty.js:545320-545331)
- `skillCommandAggregatorMemo` (`sH9`) — The memoized master skill+command aggregator `BL` wraps; calls `gDz`→`nd6` (cli_inner_pretty.js:545805-545821)
- `loadSkillDirCommands` (`gDz`) — Loads skill-dir + plugin + bundled + builtin-plugin skills; calls the disk-reading `nd6` (cli_inner_pretty.js:545264-545302)
- `memoize` (`v8`/`cx8`) — Lodash-style first-arg-keyed memoize exposing `.cache.clear()` (cli_inner_pretty.js:1475-1486, 1492)
- `getCwd` (`C$`) — Current working directory (the memoization key passed to `L2`) (cli_inner_pretty.js:42238-42244)
- `pluralize` (`N8`) — `count===1 ? singular : plural` used for `"skill"`/`"skills"` (cli_inner_pretty.js:9655-9657)
- `sessionStartHookGenerator` (`OP$`) — Streams SessionStart hook output (yields `reloadSkills`) (declaration cli_inner_pretty.js:551757; `reloadSkills` yield at 553933)
- `featureOkTelemetry` (`SH`) — Emits `tengu_feature_ok { feature_name }`; called with `"hook_session_start_reload_skills"` (cli_inner_pretty.js:41590-41592)
- `SKILL_TOOL_NAME` (`ZX`) — `"Skill"` tool-name constant (cli_inner_pretty.js:216282)
- `defineModuleExports` (`X$`) — Lazy module-export binder used to register the command's `call` (cli_inner_pretty.js:521236, 521273)

---

## TL;DR

Skills and slash commands are scanned and memoized **once, early in startup**. From 2.1.152 there are **two ways to re-scan them mid-session without restarting**, and both funnel into one shared reload primitive:

| Entrypoint | Trigger | Who fires the chain | Reports a diff? |
|---|---|---|---|
| `/reload-skills` slash command | A human types it (or `--print` non-interactive) | `reloadSkillsCommandHandler` (`Zzz`, cli_inner_pretty.js:521237) | Yes — `N added, M removed` |
| SessionStart hook `reloadSkills:true` | An operator-installed hook raises the flag | `runSessionStartHooks` (`$U`, cli_inner_pretty.js:270671) | No (silent + telemetry) |

Both call the **same three-function reload primitive**: `clearSkillListingCaches` (`_C`) → `resetConditionalSkillState` (`Bo`) → `skillReloadEmitter.emit()` (`Xc.emit`). `_C` busts every memoized skill/command loader cache; `Bo` resets the dynamic/conditional-skill state; `Xc.emit` re-announces to UI subscribers. The next time anything pulls the skill list (`loadSkillsForList`, `L2`), the memoize cache is empty, so it **re-walks the skill directories from disk** and picks up whatever the hook/user just added or removed.

**Confidence: high. Both entrypoints are NEW post-2.1.88.** The 2.1.88 readable source (`src/skills/loadSkillsDir.ts`) has the precursor cache-clear function `clearSkillCaches()` (lines 806-811) and the `skillsLoaded` signal (line 832) — but there is **no `/reload-skills` command and no `reloadSkills` hook field**. The mid-session reload existed in 2.1.88 only as a *watcher-driven* side effect; the two explicit on-demand entrypoints are net-new.

---

## 1. Why two entrypoints for one primitive?

The two entrypoints answer two different "who noticed the change" questions, but the *work* — re-reading the skill directories — is identical, so they share one primitive.

- **`/reload-skills` (user-typed)** answers *"I just edited/added a skill in another terminal and I want it now, without losing my session."* The human is the change agent and wants immediate confirmation, so the handler returns a human-readable diff (`3 added, 1 removed`).
- **`reloadSkills:true` (operator-installed hook)** answers *"my SessionStart hook just `git clone`d a skills repo / `mkdir`ed `.claude/skills/` and dropped files in — make them live."* The hook is the change agent; there is no human watching the exact moment, so the reload is silent (a telemetry counter, not a chat message).

> **Key insight — one primitive, two skins.** The expensive, error-prone part (knowing *which* memoized caches to clear, in *which* order, plus re-announcing to the UI) is centralized in `clearSkillListingCaches`/`resetConditionalSkillState`/`skillReloadEmitter`. If the skill-cache topology changes (a new memoized loader is added), both entrypoints stay correct because neither knows the topology — they only know the three primitive calls. The command handler adds *only* the before/after diff on top; the hook collector adds *only* a telemetry counter. Everything load-bearing is shared.

This is the same de-duplication discipline as the 2.1.88 source, where `clearSkillCaches()` (`src/skills/loadSkillsDir.ts:806`) is the single function every cache-buster calls, and `onDynamicSkillsLoaded` (line 839) lets other modules subscribe to the `skillsLoaded` signal without import cycles. The 2.1.156 bundle is that exact shape, hardened and split across loaders.

---

## 2. Path 1 — the `/reload-skills` local command

### 2.1 The command descriptor (`RELOAD_SKILLS_COMMAND` / `Gzz`)

```javascript
// ============================================
// RELOAD_SKILLS_COMMAND - The /reload-skills local-command descriptor
// Location: cli_inner_pretty.js:521260-521271
// ============================================

// ORIGINAL (for source lookup):
var Gzz, CE8;
var Ul4 = T(() => {
  ((Gzz = {
    type: "local",
    name: "reload-skills",
    description: "Pick up skills added or changed on disk during this session",
    supportsNonInteractive: !0,
    thinClientDispatch: "post-text",
    load: () => Promise.resolve().then(() => (pl4(), Bl4)),
  }),
    (CE8 = Gzz));
});

// READABLE (for understanding):
let RELOAD_SKILLS_COMMAND, RELOAD_SKILLS_COMMAND_EXPORT;
const initReloadSkillsCommand = lazyInit(() => {
  RELOAD_SKILLS_COMMAND = {
    type: "local",                 // runs in-process; not a model-prompt command
    name: "reload-skills",
    description: "Pick up skills added or changed on disk during this session",
    supportsNonInteractive: true,  // usable under --print / non-interactive
    thinClientDispatch: "post-text", // thin client appends the result text after the turn
    load: () => Promise.resolve().then(() => (initReloadSkillsModule(), reloadSkillsCallModule)),
  };
  RELOAD_SKILLS_COMMAND_EXPORT = RELOAD_SKILLS_COMMAND;
});

// Mapping: Gzz→RELOAD_SKILLS_COMMAND, CE8→RELOAD_SKILLS_COMMAND_EXPORT, T→lazyInit,
//          pl4→initReloadSkillsModule, Bl4→reloadSkillsCallModule
```

Three descriptor fields matter:

- **`type: "local"`** — `/reload-skills` is a *local* command (runs synchronously in-process and returns a value), not a `"prompt"` command (whose body is sent to the model). It performs filesystem/cache work, so there is nothing for the model to do.
- **`supportsNonInteractive: true`** — it is allowed under `claude --print` / non-interactive mode. This is deliberate: a non-interactive scripted session that writes a skill and then wants to use it can call `/reload-skills` programmatically. (Most interactive-only commands omit this flag.)
- **`thinClientDispatch: "post-text"`** — tells the thin-client / IDE transport how to surface the result. `"post-text"` means the string the handler returns is appended to the transcript *after* the command runs (cf. `"control-request"` used by commands that need a round-trip). The diff string from the handler is what the user sees.

The `load` thunk lazily pulls in the call module `Bl4` (registered at cli_inner_pretty.js:521235-521236 via `X$(Bl4, { call: () => Zzz })`), so the handler code is only resolved when the command actually runs — standard lazy-load shape for the slash-command registry.

### 2.2 The handler (`reloadSkillsCommandHandler` / `Zzz`)

```javascript
// ============================================
// reloadSkillsCommandHandler - /reload-skills: snapshot names, clear caches, report a diff
// Location: cli_inner_pretty.js:521237-521252
// ============================================

// ORIGINAL (for source lookup):
var Zzz = async (H, $) => {
  let q = C$(),
    K = await L2(q),
    _ = new Set(K.map((j) => j.name));
  (_C(), Bo());
  let z = await L2(q),
    A = new Set(z.map((j) => j.name));
  Xc.emit();
  let Y = z.filter((j) => !_.has(j.name)).length,
    f = K.filter((j) => !A.has(j.name)).length,
    O = [];
  if (Y > 0) O.push(`${Y} added`);
  if (f > 0) O.push(`${f} removed`);
  let M = O.length > 0 ? O.join(", ") : "no changes";
  return { type: "text", value: `Reloaded skills: ${z.length} ${N8(z.length, "skill")} available (${M})` };
};

// READABLE (for understanding):
const reloadSkillsCommandHandler = async (args, ctx) => {
  const cwd = getCwd();                                 // C$ — memoization key for L2
  const before = await loadSkillsForList(cwd);          // L2 — current (cached) skill list
  const beforeNames = new Set(before.map((s) => s.name));

  clearSkillListingCaches();   // _C — bust every memoized skill/command loader cache
  resetConditionalSkillState(); // Bo — reset dynamic/conditional-skill maps + flags

  const after = await loadSkillsForList(cwd);           // L2 again → cache MISS → re-walks disk
  const afterNames = new Set(after.map((s) => s.name));

  skillReloadEmitter();         // Xc.emit() — re-announce to UI subscribers (picker/autocomplete)

  const addedCount   = after.filter((s) => !beforeNames.has(s.name)).length;
  const removedCount  = before.filter((s) => !afterNames.has(s.name)).length;
  const parts = [];
  if (addedCount > 0)   parts.push(`${addedCount} added`);
  if (removedCount > 0) parts.push(`${removedCount} removed`);
  const diff = parts.length > 0 ? parts.join(", ") : "no changes";

  return {
    type: "text",
    value: `Reloaded skills: ${after.length} ${pluralize(after.length, "skill")} available (${diff})`,
  };
};

// Mapping: Zzz→reloadSkillsCommandHandler, H→args, $→ctx, C$→getCwd, L2→loadSkillsForList,
//          K→before, _→beforeNames, z→after, A→afterNames, _C→clearSkillListingCaches,
//          Bo→resetConditionalSkillState, Xc→skillReloadEmitter, Y→addedCount, f→removedCount,
//          O→parts, M→diff, N8→pluralize
```

**The before/after diff algorithm, step by step:**

1. **Snapshot BEFORE** — `before = await L2(C$())`. `L2` is memoized on the cwd, so this returns the *currently cached* skill list (whatever the running session already knows about). `beforeNames` is the `Set` of names.
2. **Bust caches** — `_C()` then `Bo()`. This is the reload primitive (Section 4). After these two calls, every memoized skill/command loader's `.cache` is empty and the conditional/dynamic-skill state is reset.
3. **Snapshot AFTER** — `after = await L2(C$())`. Because the cache was just cleared, this `L2` call is a **cache miss**, so it re-runs the full disk walk (`BL` → `sH9` → `gDz` → `nd6` reads `SKILL.md` files off disk) and re-memoizes. `afterNames` is the new `Set`.
4. **Re-announce** — `Xc.emit()`. This fires the `skillsLoaded`-style signal so any UI subscriber (the in-session skill picker, slash-command autocomplete) refreshes. Note it is fired **after** the AFTER snapshot, so subscribers see the fresh list.
5. **Compute the diff** — `added = | after \ before |` (names in the new set not in the old), `removed = | before \ after |` (names in the old set not in the new). Each is a count, not a list.
6. **Format** — assemble `"N added, M removed"`, or `"no changes"` if both are zero, then build the user-facing message with `pluralize` (`N8`) choosing `"skill"` vs `"skills"` for the *total available* count.

> **Why snapshot before clearing, then re-pull after?** The handler cannot ask the loader "what changed" because the loader is stateless about diffs — it just returns the current disk state. So the handler manufactures a diff by comparing two list pulls bracketing the cache clear: the cached list (old world) vs the freshly-walked list (new world). This is robust to *any* kind of change — additions, removals, renames (a rename shows as one added + one removed) — without the loader needing to track history. The cost is two list builds, but the second is the unavoidable re-scan anyway, so the only overhead is the cheap cached first pull.

> **Why `Xc.emit()` comes after the second `L2`, but the hook path emits without re-pulling.** In the command path the handler itself needs the post-reload list to compute the diff, so it pulls `L2` *before* emitting — subscribers then re-pull and hit the warm cache. In the hook path (Section 3) `$U` does not need the list, so it emits immediately and lets subscribers trigger the (cold) re-walk lazily. Same primitive, different ordering driven by who needs the result.

### 2.3 Edge cases

- **No changes** — if nothing on disk changed, `before` and `after` are identical, both counts are 0, and the message reads `Reloaded skills: K skills available (no changes)`. The caches are still cleared and re-walked (the command always pays the re-scan cost); only the *diff* is empty.
- **Cwd dependence** — both `L2` calls use `C$()` (current working directory) as the memoize key, so the diff is computed for the project the session is rooted in. The disk walk inside `BL`/`sH9` walks up from cwd to the repo root (matching the 2.1.88 `getProjectDirsUpToHome('skills', cwd)` behavior in `loadSkillsDir.ts:642`).
- **`Bo` ordering** — `Bo()` is called *between* the BEFORE snapshot and the AFTER snapshot together with `_C()`, so any conditional skills that had been activated this session are reset to their pending state and re-evaluated on the next disk walk. (See Section 4.3 for what `Bo` resets.)

---

## 3. Path 2 — the SessionStart `reloadSkills:true` hook field

The full hook-plumbing walkthrough (schema, aggregator yields, `$U` field collection alongside `sessionTitle`) lives in [../11_hooks/session_start_title_and_reload_skills.md](../11_hooks/session_start_title_and_reload_skills.md). Here we cover only the **skill-system-relevant** slice: the flag travels from a hook's JSON output to the *same reload primitive* the slash command uses.

### 3.1 The flag's journey

The `reloadSkills` boolean is declared in two parallel zod schema sites (both NEW post-2.1.88):

```javascript
// ============================================
// reloadSkills schema field - SessionStart hookSpecificOutput (runtime validation copy)
// Location: cli_inner_pretty.js:550708-550713 (also SDK-types copy at 337119-337124)
// ============================================

// ORIGINAL (for source lookup):
reloadSkills: y
  .boolean()
  .optional()
  .describe(
    "Re-scan skill and command directories after SessionStart hooks complete, so skills installed by the hook are available in the same session",
  ),

// READABLE (for understanding):
reloadSkills: z
  .boolean()
  .optional()
  .describe("Re-scan skill and command directories after SessionStart hooks complete, so skills installed by the hook are available in the same session"),

// Mapping: y→zod; field appears in BOTH the SDK-types schema (337115-337124) and the runtime union (550702-550713)
```

The hook-output aggregator yields a `{ reloadSkills: true }` delta (with a debug log) when a hook's parsed output sets it:

```javascript
// ============================================
// reloadSkills aggregator yield - one delta per requesting hook, with debug log
// Location: cli_inner_pretty.js:553933
// ============================================

// ORIGINAL (for source lookup):
if (g.reloadSkills) (N(`Hook ${j} (${nS(g.hook)}) requested reloadSkills`), yield { reloadSkills: !0 });

// READABLE (for understanding):
if (hookResult.reloadSkills) {
  log(`Hook ${eventName} (${hookName(hookResult.hook)}) requested reloadSkills`);
  yield { reloadSkills: true };
}

// Mapping: g→hookResult, N→log, j→eventName, nS→hookName
```

### 3.2 `runSessionStartHooks` (`$U`) fires the same chain

```javascript
// ============================================
// runSessionStartHooks - collects reloadSkills (M) and fires _C + Bo + Xc.emit + telemetry
// Location: cli_inner_pretty.js:270663-270671
// ============================================

// ORIGINAL (for source lookup):
for await (let w of OP$(H, $, q, j, _, void 0, void 0, z)) {
  if (w.message) A.push(w.message);
  if (w.additionalContexts && w.additionalContexts.length > 0) Y.push(...w.additionalContexts);
  if (w.initialUserMessage) AN6 = w.initialUserMessage;
  if (w.sessionTitle) O = w.sessionTitle;
  if (w.watchPaths && w.watchPaths.length > 0) f.push(...w.watchPaths);
  if (w.reloadSkills) M = !0;
}
if (M) (_C(), Bo(), Xc.emit(), SH("hook_session_start_reload_skills"));

// READABLE (for understanding):
for await (const delta of sessionStartHookGenerator(source, sessionId, sessionTitle, agentType, model, undefined, undefined, forceSync)) {
  if (delta.message) messages.push(delta.message);
  if (delta.additionalContexts?.length) additionalContexts.push(...delta.additionalContexts);
  if (delta.initialUserMessage) pendingInitialUserMessage = delta.initialUserMessage;
  if (delta.sessionTitle) lastTitle = delta.sessionTitle;          // last-writer-wins
  if (delta.watchPaths?.length) watchPaths.push(...delta.watchPaths);
  if (delta.reloadSkills) wantsReload = true;                      // ANY hook → reload
}
if (wantsReload) {
  clearSkillListingCaches();   // _C   — same primitive as /reload-skills
  resetConditionalSkillState(); // Bo  — same primitive as /reload-skills
  skillReloadEmitter();         // Xc.emit() — same re-announce
  featureOkTelemetry("hook_session_start_reload_skills"); // SH — tengu_feature_ok counter
}

// Mapping: $U→runSessionStartHooks, OP$→sessionStartHookGenerator, w→delta, M→wantsReload,
//          _C→clearSkillListingCaches, Bo→resetConditionalSkillState, Xc→skillReloadEmitter, SH→featureOkTelemetry
```

The differences from the command path are exactly two:

1. **No diff.** `$U` does not compute or surface `N added, M removed`. A SessionStart hook runs before the model engages, and there is no chat surface to print a diff to; the skills simply become available.
2. **Telemetry instead.** `SH("hook_session_start_reload_skills")` emits `tengu_feature_ok { feature_name: "hook_session_start_reload_skills" }` (cli_inner_pretty.js:41590-41592), a usage counter for how often hooks trigger in-session reloads. The command path has no equivalent counter (the diff message is its feedback).

Everything else — `_C`, `Bo`, `Xc.emit()` — is byte-identical to the command path.

---

## 4. The reload primitive: the cache-invalidation chain

This is the load-bearing part shared by both entrypoints. Three calls, in order: `_C()`, `Bo()`, `Xc.emit()`.

```
                        RELOAD PRIMITIVE (shared)
  ┌──────────────────────────────────────────────────────────────────────┐
  │                                                                        │
  │  _C()  clearSkillListingCaches  (cli:545345)                           │
  │   ├─ wu()   clearMemoizedSkillCommandCaches  (cli:545333)              │
  │   │    ├─ sH9.cache.clear()   master aggregator (skill+plugin+bundled) │
  │   │    ├─ L2.cache.clear()    user-facing skill list filter           │
  │   │    ├─ RDH.cache.clear()   bundled-skill async loader              │
  │   │    ├─ dDz()               invalidateWorkflowCache (workflow cmds)  │
  │   │    └─ (async) clearSkillIndexCache()  skill-index module          │
  │   ├─ vG8()  clearPluginSkillCache  → zRH.cache.clear()  (cli:414228)   │
  │   ├─ Cw4()  clearBundledSkillCache → Kd6.cache.clear()  (cli:414290)   │
  │   └─ DRH()  clearDynamicSkillCachesAndState  (cli:421850)             │
  │        ├─ nd6.cache.clear()   skill-DIR loader (reads SKILL.md)        │
  │        ├─ tx.cache.clear()    (paired loader)                         │
  │        ├─ lL.conditionalSkills.clear()                                │
  │        └─ lL.activatedConditionalSkillNames.clear()                   │
  │                                                                        │
  │  Bo()  resetConditionalSkillState  (cli:413487)                        │
  │   ├─ LG8.clear()   dynamic-skill / skill-command map                   │
  │   ├─ PG8 = false   "directories already scanned" flag                  │
  │   └─ _RH  = null   cached announced-skill Set                          │
  │                                                                        │
  │  Xc.emit()  skillReloadEmitter  (cli:270627, factory y7 at cli:1813)   │
  │   └─ runs every subscribed listener (UI picker, autocomplete) inside   │
  │      a try/catch so one throwing listener cannot abort the others      │
  └──────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼  next pull is a cache MISS
  L2(C$())  loadSkillsForList  (cli:545823) ──► BL ──► sH9 ──► gDz ──► nd6
                                                       (re-reads SKILL.md from disk)
```

### 4.1 `clearSkillListingCaches` (`_C`) — the outer clear

```javascript
// ============================================
// clearSkillListingCaches - Outer cache-clear: fans out to four sub-clears
// Location: cli_inner_pretty.js:545345-545347
// ============================================

// ORIGINAL (for source lookup):
function _C() {
  (wu(), vG8(), Cw4(), DRH());
}

// READABLE (for understanding):
function clearSkillListingCaches() {
  clearMemoizedSkillCommandCaches(); // wu  — master aggregator + list + bundled-async + workflow + index
  clearPluginSkillCache();           // vG8 — plugin skills (zRH)
  clearBundledSkillCache();          // Cw4 — bundled skills (Kd6)
  clearDynamicSkillCachesAndState(); // DRH — skill-dir loader (nd6/tx) + conditional state
}

// Mapping: _C→clearSkillListingCaches, wu→clearMemoizedSkillCommandCaches,
//          vG8→clearPluginSkillCache, Cw4→clearBundledSkillCache, DRH→clearDynamicSkillCachesAndState
```

`wu` is where the user-facing list cache actually dies:

```javascript
// ============================================
// clearMemoizedSkillCommandCaches - Inner buster for the memoized loaders + skill index
// Location: cli_inner_pretty.js:545333-545344
// ============================================

// ORIGINAL (for source lookup):
function wu() {
  (sH9.cache?.clear?.(),
    L2.cache?.clear?.(),
    RDH.cache?.clear?.(),
    dDz?.(),
    Promise.resolve()
      .then(() => (Hs6(), ea6))
      .then(
        (H) => H.clearSkillIndexCache(),
        () => {},
      ));
}

// READABLE (for understanding):
function clearMemoizedSkillCommandCaches() {
  skillCommandAggregatorMemo.cache?.clear?.(); // sH9 — memoized master skill+command aggregator (BL delegates to it)
  loadSkillsForList.cache?.clear?.();          // L2  — user-facing skill list filter
  bundledSkillsAsync.cache?.clear?.();         // RDH — async bundled-skill loader
  invalidateWorkflowCache?.();                 // dDz — workflow-command cache (set at cli:545804)
  // Async, fire-and-forget: clear the separate skill-index module's cache too
  Promise.resolve()
    .then(() => loadSkillIndexModule())
    .then((mod) => mod.clearSkillIndexCache(), () => {});
}

// Mapping: wu→clearMemoizedSkillCommandCaches, sH9→skillCommandAggregatorMemo, L2→loadSkillsForList,
//          RDH→bundledSkillsAsync, dDz→invalidateWorkflowCache, Hs6/ea6→loadSkillIndexModule
```

Note the `?.cache?.clear?.()` idiom — every memoized function is built with `v8`/`cx8` (cli_inner_pretty.js:1475-1486), which attaches a `.cache` Map exposing `.clear()`. The optional chaining means a not-yet-initialized loader is silently skipped. This is the exact mechanism from 2.1.88's `clearSkillCaches()` (`getSkillDirCommands.cache?.clear?.()`, `loadSkillsDir.ts:806-811`), just spread across more loaders.

### 4.2 The three sub-clears (`vG8`, `Cw4`, `DRH`)

```javascript
// ============================================
// clearPluginSkillCache / clearBundledSkillCache / clearDynamicSkillCachesAndState
// Location: cli_inner_pretty.js:414228-414230, 414290-414292, 421850-421852
// ============================================

// ORIGINAL (for source lookup):
function vG8() { zRH.cache?.clear?.(); }
function Cw4() { Kd6.cache?.clear?.(); }
function DRH() {
  (nd6.cache?.clear?.(), tx.cache?.clear?.(), lL.conditionalSkills.clear(), lL.activatedConditionalSkillNames.clear());
}

// READABLE (for understanding):
function clearPluginSkillCache()  { pluginSkillsLoader.cache?.clear?.(); }   // zRH
function clearBundledSkillCache() { bundledSkillsLoader.cache?.clear?.(); }  // Kd6
function clearDynamicSkillCachesAndState() {
  skillDirLoader.cache?.clear?.();             // nd6 — reads <dir>/<name>/SKILL.md off disk
  pairedSkillLoader.cache?.clear?.();          // tx
  dynamicState.conditionalSkills.clear();          // lL.conditionalSkills
  dynamicState.activatedConditionalSkillNames.clear(); // lL.activatedConditionalSkillNames
}

// Mapping: vG8→clearPluginSkillCache (zRH→pluginSkillsLoader),
//          Cw4→clearBundledSkillCache (Kd6→bundledSkillsLoader),
//          DRH→clearDynamicSkillCachesAndState (nd6→skillDirLoader, tx→pairedSkillLoader, lL→dynamicState)
```

The `DRH` reset of `lL.conditionalSkills` / `lL.activatedConditionalSkillNames` is the direct analog of 2.1.88's `conditionalSkills.clear()` + `activatedConditionalSkillNames.clear()` in `clearSkillCaches()` (`loadSkillsDir.ts:809-810`). Conditional (path-gated) skills are re-partitioned from scratch on the next walk.

### 4.3 `resetConditionalSkillState` (`Bo`) — the dynamic-skill/command map reset

```javascript
// ============================================
// resetConditionalSkillState - Reset the dynamic-skill/command map + scan flag + cached set
// Location: cli_inner_pretty.js:413487-413489
// ============================================

// ORIGINAL (for source lookup):
function Bo() {
  (LG8.clear(), (PG8 = !1), (_RH = null));
}

// READABLE (for understanding):
function resetConditionalSkillState() {
  dynamicSkillCommandMap.clear(); // LG8 — discovered dynamic/conditional skills + their commands
  hasScannedDirs = false;         // PG8 — "directories already scanned this pass" guard (re-arm)
  cachedAnnouncedSet = null;      // _RH — cached Set used by the announce path (force rebuild)
}

// Mapping: Bo→resetConditionalSkillState, LG8→dynamicSkillCommandMap, PG8→hasScannedDirs, _RH→cachedAnnouncedSet
```

`LG8` is a `Map` (declared at cli_inner_pretty.js:414021). `PG8` is the "have we scanned the dynamic skill dirs yet" boolean — set `true` by `Gp6` (cli_inner_pretty.js:413494) and reset to `false` here so the next access re-scans. `_RH` is a lazily-built `Set` (`if (_RH === null) _RH = new Set()` at cli_inner_pretty.js:413497) used by the announce/dedup path; nulling it forces a rebuild from the now-fresh map. Together, `Bo` guarantees the *dynamic* skill discovery state (the on-demand directory walk that `_C` does not own) is also wiped.

> **Why is `Bo` separate from `_C` instead of folded in?** `_C` owns the **memoized loader caches** (the pure `dir → skills` functions). `Bo` owns the **mutable discovery state** (which dirs have been scanned this session, which conditional skills got activated, the announce set). These are different lifetimes: the loader caches are pure and can be rebuilt at will; the discovery state accumulates across the session. Keeping them as two primitives lets other call sites reset *just* the loader cache (e.g. the file watcher) without disturbing the discovery bookkeeping, and lets the reload entrypoints reset *both*. Both entrypoints call them as a pair precisely because a full reload must reset both layers.

### 4.4 `skillReloadEmitter` (`Xc`) — re-announce to UI

```javascript
// ============================================
// skillReloadEmitter (Xc) + createSignal (y7) - exception-isolating re-announce
// Location: cli_inner_pretty.js:270624-270628 (Xc), 1813-1838 (y7)
// ============================================

// ORIGINAL (for source lookup):
var Xc;
var liH = T(() => { MO(); Xc = y7(); });
// ...
function y7() {
  let H = new Set();
  return {
    subscribe($) { return (H.add($), () => { H.delete($); }); },
    emit(...$) {
      let q;
      for (let K of H) try { K(...$); } catch (_) { (q ??= []).push(_); }
      if (q) throw q.length === 1 ? q[0] : AggregateError(q, "Signal listener(s) threw");
    },
    clear() { H.clear(); },
  };
}

// READABLE (for understanding):
let skillReloadEmitter;
const initSkillReloadEmitter = lazyInit(() => { initDeps(); skillReloadEmitter = createSignal(); });

function createSignal() {
  const listeners = new Set();
  return {
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    emit(...args) {
      let errors;
      for (const fn of listeners) {
        try { fn(...args); }
        catch (e) { (errors ??= []).push(e); }       // collect, don't abort the loop
      }
      if (errors) throw errors.length === 1 ? errors[0] : AggregateError(errors, "Signal listener(s) threw");
    },
    clear() { listeners.clear(); },
  };
}

// Mapping: Xc→skillReloadEmitter, y7→createSignal, H/listeners→subscriber set
```

`Xc = y7()` is the exact `skillsLoaded = createSignal()` pattern from 2.1.88 (`loadSkillsDir.ts:832`), and `y7`'s per-listener try/catch is the same hardening the 2.1.88 `onDynamicSkillsLoaded` comment describes ("a throwing listener is logged and skipped rather than aborting `skillsLoaded.emit()`"). UI subscribers (skill picker, slash-command autocomplete) listen on `Xc`; emitting after a reload tells them "the skill set changed, re-render."

### 4.5 `loadSkillsForList` (`L2`) — the lazy re-read

The clear is only half the job. The other half is that the *next* pull re-reads disk. `L2` is memoized, so the cleared cache forces a fresh walk:

```javascript
// ============================================
// loadSkillsForList (L2) - memoized user-facing skill list; re-walks disk on cache miss
// Location: cli_inner_pretty.js:545823-545826 (L2), 545320-545331 (BL), 1475-1486 (memoize)
// ============================================

// ORIGINAL (for source lookup):
L2 = v8(async (H) => {
  if (qb()) return [];
  return (await BL(H)).filter(JCH);
});
// ... BL delegates to sH9 (master aggregator) which calls gDz → nd6 (reads SKILL.md off disk)
function cx8(H, $) {          // v8 = memoize
  // ...
  var q = function () {
    var K = arguments, _ = $ ? $.apply(this, K) : K[0], z = q.cache;
    if (z.has(_)) return z.get(_);        // cache HIT
    var A = H.apply(this, K);
    return ((q.cache = z.set(_, A) || z), A);  // cache MISS → compute + store
  };
  return ((q.cache = new (cx8.Cache || C2H)()), q);
}

// READABLE (for understanding):
loadSkillsForList = memoize(async (cwd) => {
  if (skillsDisabled()) return [];                  // qb
  return (await aggregateAllSkillCommands(cwd)).filter(isUserFacingSkill); // BL, JCH
});
// memoize keys on the first arg (cwd). After clearSkillListingCaches() emptied
// loadSkillsForList.cache, the next call is a MISS → re-runs the disk walk.

// Mapping: L2→loadSkillsForList, v8→memoize, H→cwd, BL→aggregateAllSkillCommands, JCH→isUserFacingSkill, qb→skillsDisabled
```

Because `v8`/`cx8` keys the cache on the first argument (cwd, here always `C$()`), and `_C`/`wu` just emptied `L2.cache` (and `sH9.cache`, `nd6.cache`, …), the very next `L2(C$())` is a guaranteed cache miss. It re-enters `BL` → `sH9` → `gDz` → `nd6`, and `nd6` (cli_inner_pretty.js:421999, `nd6 = v8(...)`) does the actual `readFile(<dir>/<name>/SKILL.md)` walk. The freshly installed skill is read off disk on this pull.

> **Key insight — clear vs read are decoupled.** The reload primitive never *itself* reads disk; it only **invalidates**. The disk read happens lazily, on the next consumer pull. This is why the command handler must call `L2` a second time to see the new skills (it forces the read), while the hook path can skip that — the next time the model or UI pulls the list, the read happens for free. Decoupling invalidation from reading keeps the primitive cheap and side-effect-light, and means a reload that nobody subsequently observes costs almost nothing.

---

## 5. The cold-start gotcha: why the 2.1.142 watcher alone was not enough

2.1.142 already had a live skill watcher — `setupSkillFileWatcher` (`xn5`, cli_inner_pretty.js:557919+ in 2.1.142), a chokidar wrapper that on any add/change/unlink in a watched dir clears the listing caches and re-emits. So why add `reloadSkills`/`/reload-skills` at all?

The watcher has a structural blind spot: **chokidar can only watch directories that existed when `watcher.watch(dirs)` was called.** Look at the 2.1.142 watcher's `initialize()`:

```
const dirs = await getWatchedDirs();   // snapshot of EXISTING .claude/skills dirs
if (dirs.length === 0) return;          // ← nothing to watch → no watcher at all
watcher = chokidar.watch(dirs, { ignoreInitial: true, depth: 2, ... });
```

(2.1.142 reference: [../../../claude_code_v_2.1.142/analyze/10_skill_system/skill_lifecycle.md](../../../claude_code_v_2.1.142/analyze/10_skill_system/skill_lifecycle.md), Phase 3.) Two consequences:

1. **`dirs.length === 0` → no watcher.** If the session started in a project that had **no** `.claude/skills/` directory at all, the watcher returns early and never arms. A SessionStart hook that then runs `mkdir -p .claude/skills && git clone ... .claude/skills/foo` creates a **brand-new** skills directory — but there is no watcher watching for it, so the new skill is invisible until restart.
2. **`ignoreInitial: true` + parent not watched.** Even where a watcher is armed, `mkdir`ing a brand-new top-level skills dir that wasn't in the original `dirs` list is outside the watched set. chokidar's `depth: 2` watches *inside* known dirs; it does not retroactively start watching a sibling directory that springs into existence.

> **Key insight — the watcher reacts to *edits within known dirs*; the reload entrypoints handle *the dir itself appearing*.** The watcher is a steady-state tool ("you edited `SKILL.md` while I was running"). It cannot cover the bootstrap case where the very *existence* of the skills directory is what changed — which is exactly what a SessionStart hook that `mkdir`s a fresh skills tree does. `reloadSkills:true` exists precisely to bridge this gap: the hook explicitly says "I just created the directory the watcher would have needed to be watching," and `$U` re-runs the full disk walk (`gDz`→`nd6` re-enumerates `.claude/skills/` from scratch, picking up the new directory). `/reload-skills` is the human-driven version of the same bridge.

There is a secondary timing reason too (the ordering problem detailed in the hooks doc): the skill index is built **before** SessionStart hooks run, so even with a perfect watcher, a hook that installs skills races the already-cached index. `reloadSkills` forces a re-scan *after* the hook completes, deterministically. The watcher and the explicit reload are complementary: the watcher covers ongoing edits to dirs that existed; the explicit reload covers the cold-start case (new dir, pre-cached index) the watcher cannot.

---

## 6. End-to-end sequence diagram

```
USER types /reload-skills                         OPERATOR hook returns {reloadSkills:true}
        │                                                       │
        ▼                                                       ▼
  Gzz descriptor (type:"local",                        OP$ generator yields {reloadSkills:true}
  post-text, supportsNonInteractive)                            │
        │  load() → Bl4.call = Zzz                               ▼
        ▼                                              $U for-await loop: M = !0
  Zzz handler:                                                  │
   before = await L2(C$())  ───── cached list ───┐               │
   beforeNames = Set(...)                         │               │
        │                                         │               │
        ├──────────────  SHARED RELOAD PRIMITIVE  ◄──────────────┤
        │     _C()  → wu/vG8/Cw4/DRH  clear all memoized caches   │
        │     Bo()  → LG8.clear / PG8=false / _RH=null            │
        │     Xc.emit()  → notify UI subscribers                  │
        │                                                         │
   after = await L2(C$()) ── CACHE MISS → re-walk disk            │ (no second pull;
   afterNames = Set(...)      (BL→sH9→gDz→nd6 readFile SKILL.md)   │  lazy read on next
        │                                                         │  consumer pull)
   Xc.emit()  (after diff snapshot)                               │
        │                                              SH("hook_session_start_reload_skills")
   added = |after\before|, removed = |before\after|               │   → tengu_feature_ok
        ▼                                                         ▼
  "Reloaded skills: K skills available (N added, M removed)"   (silent, telemetry only)
```

---

## 7. Cross-validation against 2.1.88 (`src/skills/loadSkillsDir.ts`)

| 2.1.156 symbol | 2.1.88 precursor (`loadSkillsDir.ts`) | Verdict |
|---|---|---|
| `clearMemoizedSkillCommandCaches` (`wu`, cli:545333) | `clearSkillCaches()` (line 806): `getSkillDirCommands.cache?.clear?.()`, `loadMarkdownFilesForSubdir.cache?.clear?.()`, `conditionalSkills.clear()`, `activatedConditionalSkillNames.clear()` | **Direct precursor**, now split: cache-clears in `wu`/`vG8`/`Cw4`, conditional-state clears in `DRH`. |
| `loadSkillsForList` (`L2`, cli:545823) memoized via `v8`/`cx8` | `getSkillDirCommands = memoize(async (cwd) => ...)` (line 638) | **Direct precursor** — same lodash `memoize`, same cwd key, same `.cache.clear()` busting. |
| `skillReloadEmitter` (`Xc = y7()`, cli:270627) | `skillsLoaded = createSignal()` (line 832); `onDynamicSkillsLoaded` (line 839) | **Direct precursor** — same signal + same per-listener exception isolation. |
| `DRH` conditional reset (cli:421851) | `conditionalSkills.clear()` + `activatedConditionalSkillNames.clear()` (lines 809-810) | **Direct precursor** — identical conditional-skill state reset. |
| `reloadSkillsCommandHandler` (`Zzz`) + `RELOAD_SKILLS_COMMAND` (`Gzz`) | **none** | **NEW post-2.1.88.** No `/reload-skills` command exists in 2.1.88. |
| `reloadSkills` hook field (schema 337119/550708, yield 553933, `$U` 270671) | **none** — 2.1.88 `SessionStartHookSpecificOutputSchema` is `additionalContext`/`initialUserMessage`/`watchPaths` only | **NEW post-2.1.88.** No hook-driven reload trigger. |

**Summary:** the *reload machinery* (memoized loaders, `clearSkillCaches`-style busting, the `skillsLoaded` signal, conditional-skill state reset) all predate 2.1.88 and are faithfully preserved. The **two explicit on-demand entrypoints** — the `/reload-skills` slash command and the SessionStart `reloadSkills:true` hook field — are **NEW post-2.1.88 (confidence: high)**. In 2.1.88 the only way to trigger a mid-session reload was indirectly via the file watcher's `skillsLoaded.emit()`; 2.1.152 added the two deliberate, caller-driven entrypoints documented here, both layered on top of the same preserved primitive.

---

## 8. Quick reference

- **One primitive, two callers.** `_C()` + `Bo()` + `Xc.emit()` is the whole reload; `/reload-skills` wraps it with a diff, the SessionStart hook wraps it with telemetry.
- **`_C` clears loader caches** (`wu`: `sH9`/`L2`/`RDH`/`dDz`/skill-index; `vG8`: `zRH`; `Cw4`: `Kd6`; `DRH`: `nd6`/`tx` + conditional maps).
- **`Bo` resets discovery state** (`LG8` map, `PG8` scan flag, `_RH` announce set).
- **`L2` re-reads disk lazily** on the next pull because its `v8` memoize cache was just emptied.
- **The watcher (2.1.142) cannot cover a hook that `mkdir`s a brand-new skills dir** — chokidar only watches dirs that existed at arm time, and the index is already cached before SessionStart hooks run; the explicit reload entrypoints close both gaps.
