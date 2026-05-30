# SessionStart hookSpecificOutput — sessionTitle + reloadSkills (2.1.152)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks, Skills
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Session lifecycle, Agent loop
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Slash commands

Key functions in this document:

- `executeSessionStartHooks` (`$U`) — Drives the SessionStart hook aggregator and collects per-field results (cli_inner_pretty.js:270637-270684)
- `sessionStartHookGenerator` (`OP$`, exported `executeSessionStartHooks`) — Streams SessionStart hook input (with `session_title`) and yields parsed output (cli_inner_pretty.js:551757-551774, 552180)
- `applyHookJSONOutput` (`xVH`-family, the big `switch (hookEventName)`) — Maps `hookSpecificOutput` fields onto the in-memory hook result `M` (cli_inner_pretty.js:552511-552528)
- `hookOutputAggregator` (the `for await` generator with the per-field yields) — Yields `sessionTitle`/`reloadSkills` to `$U` (cli_inner_pretty.js:553933-553936)
- `cacheSessionTitleFromHook` (`KSH`) — Caches a hook title at startup/resume without persisting (cli_inner_pretty.js:547606-547613)
- `applySessionTitleFromHook` (`ih8`) — Persists a hook title via the rename machinery (cli_inner_pretty.js:552023-552034)
- `sanitizeSessionTitle` (`Q6$`) — Strips control chars and caps length at `PJz`=200 (cli_inner_pretty.js:547603-547605, 549113)
- `setSessionTitle` (`US`) — The `/rename` rename primitive, called with source `"hook"` (cli_inner_pretty.js:547477-547482)
- `setSessionAgentName` (`RzH`) — Sets the agent-name side channel (cli_inner_pretty.js:547580-547585)
- `setAgentNameOnDisk` (`xjH`) — Writes the agent name to the agent record (cli_inner_pretty.js:184052-184063)
- `reloadSkillIndex` (`_C`) — Clears skill caches + re-scans skill index (cli_inner_pretty.js:545345-545347)
- `reloadCommandIndex` (`Bo`) — Clears the slash-command/skill-command index (cli_inner_pretty.js:413487-413489)
- `skillReloadEmitter` (`Xc`) — Event emitter notifying UI of the reload (cli_inner_pretty.js:270624-270628)
- `clearSkillCaches` (`wu`) — Inner cache-buster called by `reloadSkillIndex` (cli_inner_pretty.js:545333-545344)
- `takeResumeTitle` (`niH`) — Drains the deferred resume-title slot `YN6` (cli_inner_pretty.js:270633-270636)
- `getCurrentSessionTitle` (`v3`) — Reads the live in-memory title (cli_inner_pretty.js:547524-547527)
- `getSessionId` (`E$`) — Current session id (cli_inner_pretty.js:2359-2361)
- `isManagedSubagentContext` (`FA`) — Guard that suppresses title mutation in subagent/team contexts (cli_inner_pretty.js:99280-99283)

---

## TL;DR

v2.1.152 adds **two new fields** to a SessionStart hook's `hookSpecificOutput`:

1. **`sessionTitle`** — a string. The hook sets the session title, "same effect as `/rename`". It is sanitized (control chars stripped, capped at 200 chars), and depending on the hook trigger (`startup`/`resume` vs everything else) it is either **cached** into the live session state (no persistence) or **applied** through the full rename machinery (persisted to the session file + telemetry).
2. **`reloadSkills`** — a boolean. When `true`, after all SessionStart hooks finish, Claude Code **re-scans the skill and command directories** so that any skills or commands the hook just installed on disk become available *in the same session* (no restart needed). This is the programmatic equivalent of the `/reload-skills` slash command.

Both fields are **NEW post-2.1.88** (high confidence): the 2.1.88 `SessionStartHookSpecificOutputSchema` carried only `additionalContext`, `initialUserMessage`, and `watchPaths` (`src/entrypoints/sdk/coreSchemas.ts:821-829`). `sessionTitle` is additionally surfaced on **UserPromptSubmit** as a related write path (cli_inner_pretty.js:550695, 552513).

---

## 1. Why these two fields exist

A SessionStart hook fires once at the very top of a session (triggers: `startup`, `resume`, `clear`, `compact`, etc.). Before 2.1.152 a hook could *inject context* (`additionalContext`), *seed the first user message* (`initialUserMessage`), or *register file watchers* (`watchPaths`) — but it could not change anything *about the session shell itself*.

The two additions close two specific gaps that hook authors kept hitting:

- **`sessionTitle`** — Teams that bootstrap sessions from a hook (e.g. "open Claude in this ticket directory") want the session list / tab to read "TICKET-1234: fix flaky test" instead of the default first-prompt-derived title. Previously the only way to set a title was the interactive `/rename` command or an AI-generated title. The hook needs the same write path.
- **`reloadSkills`** — This is the subtle one. A SessionStart hook commonly *installs* skills: it `git clone`s a skills repo, drops `.claude/skills/*` into place, or symlinks a shared skill library. But the skill index is scanned **before** SessionStart hooks run, so freshly installed skills are invisible until the next restart. `reloadSkills: true` lets the hook say "I just changed what's on disk — re-scan now," so the skills it installed are usable in the very session that installed them.

> **Key insight:** `reloadSkills` exists *because of an ordering problem*. The skill/command index is built early in startup; SessionStart hooks run after that index is already cached. A hook that mutates the on-disk skill set therefore has stale caches behind it. Rather than always re-scanning (expensive, and unnecessary for the common case where no hook touches skills), the design makes the re-scan **opt-in per hook run**: only when a hook explicitly raises the flag does Claude Code pay the cost of busting the skill caches.

---

## 2. The schema (where the fields are declared)

There are two parallel schema definitions in the bundle — the SDK/types copy (around line 337090) and the runtime validation union (around line 550683). Both gained the new fields.

```javascript
// ============================================
// sessionStartHookSpecificOutput - Runtime SessionStart output variant (+sessionTitle, +reloadSkills)
// Location: cli_inner_pretty.js:550702-550714
// ============================================

// ORIGINAL (for source lookup):
y.object({
  hookEventName: y.literal("SessionStart"),
  additionalContext: y.string().optional(),
  initialUserMessage: y.string().optional(),
  sessionTitle: y.string().describe("Set the session title (same effect as /rename)").optional(),
  watchPaths: y.array(y.string()).describe("Absolute paths to watch for FileChanged hooks").optional(),
  reloadSkills: y
    .boolean()
    .describe(
      "Re-scan skill and command directories after SessionStart hooks complete, so skills installed by the hook are available in the same session",
    )
    .optional(),
}),

// READABLE (for understanding):
const sessionStartHookSpecificOutput = z.object({
  hookEventName: z.literal("SessionStart"),
  additionalContext: z.string().optional(),       // legacy: inject context
  initialUserMessage: z.string().optional(),       // legacy: seed first user turn
  // NEW v2.1.152: set the session title, identical effect to /rename
  sessionTitle: z.string().describe("Set the session title (same effect as /rename)").optional(),
  watchPaths: z.array(z.string()).optional(),       // legacy: FileChanged watchers
  // NEW v2.1.152: re-scan skill/command dirs after hooks finish (in-session pickup)
  reloadSkills: z.boolean().optional(),
});

// Mapping: y→zod, hookEventName literal "SessionStart"
```

The UserPromptSubmit variant carries `sessionTitle` too (the related write surface mentioned above):

```javascript
// ============================================
// userPromptSubmitHookSpecificOutput - UserPromptSubmit variant also carries sessionTitle
// Location: cli_inner_pretty.js:550692-550700
// ============================================

// ORIGINAL (for source lookup):
y.object({
  hookEventName: y.literal("UserPromptSubmit"),
  additionalContext: y.string().optional(),
  sessionTitle: y.string().describe("Set the session title").optional(),
  suppressOriginalPrompt: y
    .boolean()
    .describe('When decision is "block", omit the original prompt from the block message')
    .optional(),
}),

// READABLE (for understanding):
const userPromptSubmitHookSpecificOutput = z.object({
  hookEventName: z.literal("UserPromptSubmit"),
  additionalContext: z.string().optional(),
  sessionTitle: z.string().optional(),              // NEW: same title field, mid-session write path
  suppressOriginalPrompt: z.boolean().optional(),
});

// Mapping: y→zod
```

The SDK-types copy (cli_inner_pretty.js:337113-337125 for SessionStart, 337099-337107 for UserPromptSubmit) is byte-identical except the `.describe()` text on `sessionTitle` is dropped — only `reloadSkills` keeps its description there.

### Cross-validation (2.1.88)

```typescript
// 2.1.88 — src/entrypoints/sdk/coreSchemas.ts:821-829
export const SessionStartHookSpecificOutputSchema = lazySchema(() =>
  z.object({
    hookEventName: z.literal('SessionStart'),
    additionalContext: z.string().optional(),
    initialUserMessage: z.string().optional(),
    watchPaths: z.array(z.string()).optional(),
    // NO sessionTitle, NO reloadSkills
  }),
)

// 2.1.88 — UserPromptSubmitHookSpecificOutputSchema had ONLY additionalContext (no sessionTitle)
```

**Confidence: high.** Both fields are net-new; nothing in 2.1.88 maps to them.

---

## 3. End-to-end flow

```
                         SessionStart hook process (user-defined)
                                    │  emits JSON on stdout
                                    ▼
  OP$ / sessionStartHookGenerator ──┤  builds hook INPUT (incl. session_title = current title)
   (cli:551757-551774)              │  and yields each hook's parsed hookSpecificOutput
                                    ▼
  hookOutputAggregator  ────────────┤  for each parsed field, yield a typed delta:
   (cli:553933-553936)              │    { reloadSkills:true } / { sessionTitle:"..." }
                                    ▼
  $U / executeSessionStartHooks ────┤  reduce yields into locals:
   (cli:270663-270672)              │    O = last sessionTitle ; M = (any reloadSkills)
                                    │
              ┌─────────────────────┴──────────────────────┐
              ▼                                              ▼
   if (M) reloadSkills path                       title path: stash O
   _C()  reloadSkillIndex                         YN6 = (startup||resume) ? O : void 0
   Bo()  reloadCommandIndex                            │
   Xc.emit() notify UI                                 │ (deferred — drained by caller)
   SH("hook_session_start_reload_skills")              ▼
   (cli:270671)                              niH() takeResumeTitle ──► KSH(cacheSessionTitleFromHook)
                                             (startup/resume cache, no persist; cli:631625-631626, 373460-373461)

   For NON-startup/resume triggers, the title is NOT deferred via YN6; it
   reaches ih8/applySessionTitleFromHook through the UserPromptSubmit path
   (v → ih8(v), cli:590860/590882) which persists via the rename machinery.
```

### Step 1 — Hook input carries the *current* title

When `$U` calls the generator, it forwards the current title as the `q` (sessionTitle) argument, and `OP$` puts it into the hook INPUT as `session_title` (cli_inner_pretty.js:551764). So a hook receives the existing title and can decide whether to overwrite it — important for "only set a title if there isn't one yet" logic.

```javascript
// ============================================
// sessionStartHookGenerator - Builds SessionStart hook input with session_title, streams output
// Location: cli_inner_pretty.js:551757-551774
// ============================================

// ORIGINAL (for source lookup):
async function* OP$(H, $, q, K, _, z, A = q_, Y) {
  let f = {
    ...w5(void 0, $),
    hook_event_name: "SessionStart",
    source: H,
    agent_type: K,
    model: _,
    session_title: q ?? v3($ !== void 0 ? EL($) : E$()),
  };
  yield* QL({ hookInput: f, toolUseID: ch8.randomUUID(), matchQuery: H, signal: z, timeoutMs: A, forceSyncExecution: Y });
}

// READABLE (for understanding):
async function* sessionStartHookGenerator(source, sessionId, sessionTitle, agentType, model, signal, timeoutMs = DEFAULT_HOOK_TIMEOUT, forceSync) {
  const hookInput = {
    ...buildBaseHookInput(undefined, sessionId),
    hook_event_name: "SessionStart",
    source,                                          // "startup" | "resume" | "clear" | ...
    agent_type: agentType,
    model,
    // expose the CURRENT title so the hook can decide whether to overwrite
    session_title: sessionTitle ?? getCurrentSessionTitle(sessionId !== undefined ? sessionIdOf(sessionId) : getSessionId()),
  };
  yield* runHookMatchersAndParse({ hookInput, toolUseID: randomUUID(), matchQuery: source, signal, timeoutMs, forceSyncExecution: forceSync });
}

// Mapping: OP$→sessionStartHookGenerator, H→source, $→sessionId, q→sessionTitle, K→agentType, _→model, z→signal, A→timeoutMs, Y→forceSync, v3→getCurrentSessionTitle, E$→getSessionId, q_→DEFAULT_HOOK_TIMEOUT
```

`OP$` is the function exported as `executeSessionStartHooks` (cli_inner_pretty.js:552180) and also registered as the `SessionStart` entry in the hook dispatch map (cli_inner_pretty.js:552131). The `$U` wrapper is the higher-level collector that actually consumes its yields.

### Step 2 — Aggregator yields each field

The per-hook aggregator parses each hook's `hookSpecificOutput` and emits a typed delta for every field present. The two new deltas (with their debug log lines) sit right beside the existing `watchPaths` yield:

```javascript
// ============================================
// hookOutputAggregator - Yields reloadSkills / sessionTitle deltas (with debug logging)
// Location: cli_inner_pretty.js:553931-553936
// ============================================

// ORIGINAL (for source lookup):
if (g.watchPaths && g.watchPaths.length > 0)
  (N(`Hook ${j} (${nS(g.hook)}) provided ${g.watchPaths.length} watchPaths`), yield { watchPaths: g.watchPaths });
if (g.reloadSkills) (N(`Hook ${j} (${nS(g.hook)}) requested reloadSkills`), yield { reloadSkills: !0 });
if (g.sessionTitle)
  (N(`Hook ${j} (${nS(g.hook)}) provided sessionTitle (${[...g.sessionTitle].length} chars)`),
    yield { sessionTitle: g.sessionTitle });

// READABLE (for understanding):
if (hookResult.watchPaths?.length > 0) {
  log(`Hook ${eventName} (${hookName(hookResult.hook)}) provided ${hookResult.watchPaths.length} watchPaths`);
  yield { watchPaths: hookResult.watchPaths };
}
if (hookResult.reloadSkills) {                       // NEW v2.1.152
  log(`Hook ${eventName} (${hookName(hookResult.hook)}) requested reloadSkills`);
  yield { reloadSkills: true };
}
if (hookResult.sessionTitle) {                       // NEW v2.1.152
  // [...str] counts code points, not UTF-16 units — emoji-safe char count
  log(`Hook ${eventName} (${hookName(hookResult.hook)}) provided sessionTitle (${[...hookResult.sessionTitle].length} chars)`);
  yield { sessionTitle: hookResult.sessionTitle };
}

// Mapping: g→hookResult, N→log, nS→hookName, j→eventName
```

Note the `[...str].length` idiom — it spreads to code points so an emoji title is counted as one "char", not two UTF-16 surrogates. The same idiom recurs in the sanitizer and cache functions.

### Step 3 — `$U` reduces the yields

`executeSessionStartHooks` (`$U`) drives the generator and folds the deltas into local accumulators: `O` holds the *last* `sessionTitle` seen (last-writer-wins across multiple hooks), and `M` becomes `true` if *any* hook requested a reload.

```javascript
// ============================================
// executeSessionStartHooks - Collects sessionTitle (O) and reloadSkills (M), then dispatches both
// Location: cli_inner_pretty.js:270639-270672
// ============================================

// ORIGINAL (for source lookup):
let A = [], Y = [], f = [], O, M = !1;
// ... plugin-hook load ...
let j = K ?? WR();
for await (let w of OP$(H, $, q, j, _, void 0, void 0, z)) {
  if (w.message) A.push(w.message);
  if (w.additionalContexts && w.additionalContexts.length > 0) Y.push(...w.additionalContexts);
  if (w.initialUserMessage) AN6 = w.initialUserMessage;
  if (w.sessionTitle) O = w.sessionTitle;
  if (w.watchPaths && w.watchPaths.length > 0) f.push(...w.watchPaths);
  if (w.reloadSkills) M = !0;
}
if (M) (_C(), Bo(), Xc.emit(), SH("hook_session_start_reload_skills"));
if (((YN6 = H === "startup" || H === "resume" ? O : void 0), f.length > 0)) vv7(f);

// READABLE (for understanding):
let messages = [], additionalContexts = [], watchPaths = [], lastTitle, wantsReload = false;
// ... plugin-hook load (try/catch around X8H) ...
const agentType = explicitAgentType ?? currentAgentType();
for await (const delta of sessionStartHookGenerator(source, sessionId, sessionTitle, agentType, model, undefined, undefined, forceSync)) {
  if (delta.message) messages.push(delta.message);
  if (delta.additionalContexts?.length) additionalContexts.push(...delta.additionalContexts);
  if (delta.initialUserMessage) pendingInitialUserMessage = delta.initialUserMessage;  // AN6 deferred slot
  if (delta.sessionTitle) lastTitle = delta.sessionTitle;                              // last-writer-wins
  if (delta.watchPaths?.length) watchPaths.push(...delta.watchPaths);
  if (delta.reloadSkills) wantsReload = true;                                          // any hook → reload
}
if (wantsReload) {                                    // NEW v2.1.152: skill/command re-scan
  reloadSkillIndex();      // _C — clear skill caches + re-scan
  reloadCommandIndex();    // Bo — clear command/skill-command index
  skillReloadEmitter();    // Xc.emit() — notify UI to refresh skill list
  countTelemetry("hook_session_start_reload_skills");
}
// stash title in deferred resume slot ONLY for startup/resume; clear it otherwise
pendingResumeTitle = (source === "startup" || source === "resume") ? lastTitle : undefined;  // YN6
if (watchPaths.length > 0) registerWatchPaths(watchPaths);

// Mapping: $U→executeSessionStartHooks, O→lastTitle, M→wantsReload, AN6→pendingInitialUserMessage,
//          YN6→pendingResumeTitle, H→source, _C→reloadSkillIndex, Bo→reloadCommandIndex, Xc→skillReloadEmitter,
//          SH→countTelemetry, vv7→registerWatchPaths, WR→currentAgentType
```

The critical line for the title is **270672**: the title is only stashed into the deferred `pendingResumeTitle` slot (`YN6`) when the trigger is `startup` or `resume`. For any other trigger the slot is explicitly nulled. That gate is what routes a startup/resume title down the *cache* path (Step 5) rather than the *persist* path.

---

## 4. The `reloadSkills` dispatch (Step 3 detail)

When `wantsReload` is set, `$U` fires three side effects plus telemetry, all at cli_inner_pretty.js:270671:

- `reloadSkillIndex` (`_C`, cli_inner_pretty.js:545345-545347) → calls `clearSkillCaches` (`wu`), then `vG8()`, `Cw4()`, `DRH()`. `wu` (cli_inner_pretty.js:545333-545344) clears three memoized caches and asynchronously calls `clearSkillIndexCache()` on the skill-index module (cli_inner_pretty.js:545339-545342), forcing the next skill lookup to re-walk the skill directories.
- `reloadCommandIndex` (`Bo`, cli_inner_pretty.js:413487-413489) → clears the dynamic-skill/command map `LG8`, resets the `PG8` "scanned" flag and the cached `_RH`, so slash commands and skill-commands are re-discovered on next access.
- `skillReloadEmitter.emit()` (`Xc`, defined at cli_inner_pretty.js:270624-270628 via `Xc = y7()`) → fires an event the UI subscribes to, so the in-session skills picker / autocomplete refreshes immediately.
- `countTelemetry("hook_session_start_reload_skills")` (`SH`, cli_inner_pretty.js:270671) → a counter event recording how often hooks trigger an in-session skill reload.

### Relation to `/reload-skills`

This is the exact same machinery the user-facing slash command uses. The `reload-skills` local command (cli_inner_pretty.js:521261-521270) is described as "Pick up skills added or changed on disk during this session" — the same problem statement as the schema's `reloadSkills` description. Both ultimately bust the same skill/command caches and re-emit on `Xc`. So `reloadSkills: true` is literally "the hook ran `/reload-skills` for you" after it modified the on-disk skill set.

> **Why fire all three (skills, commands, UI) together?** Skills in Claude Code can register slash commands and appear in the autocomplete, so the three indices are coupled. Re-scanning only the skill index would leave a freshly installed skill's command invisible until the next command-index rebuild. Doing all three atomically guarantees the hook-installed skill is fully wired up — invocable, listed, and tab-completable — the moment the hook returns.

---

## 5. The `sessionTitle` two-path design: cache vs apply

This is the most interesting part. A hook-provided title can travel down **two different write paths**, chosen by *when* in the session it arrives. Both paths share the same sanitizer and the same no-op-if-unchanged guard, but differ in whether they persist.

### Path A — Cache (startup/resume): `cacheSessionTitleFromHook` (`KSH`)

For `startup` and `resume`, `$U` stashes the title in `YN6` and the **caller** drains it via `takeResumeTitle` (`niH`) and feeds it to `KSH`. There are three such caller sites:

- Resume entry (cli_inner_pretty.js:373460-373461): `O = niH(); if (O) KSH(O);`
- Standalone-agent resume (cli_inner_pretty.js:628771-628772): `let X_ = niH(); if (X_) KSH(X_);`
- Generic session-start dispatcher `cAH` (cli_inner_pretty.js:631625-631626): after `$U(...)`, `q = niH(); if (q) KSH(q);`

```javascript
// ============================================
// cacheSessionTitleFromHook - Cache a startup/resume hook title into live state (no persistence)
// Location: cli_inner_pretty.js:547603-547613
// ============================================

// ORIGINAL (for source lookup):
function Q6$(H) {
  return [...H.replace(/[\x00-\x1f\x7f-\x9f]/g, "")].slice(0, PJz).join("");
}
function KSH(H) {
  if (FA()) return;
  let $ = Q6$(H);
  if (!$) return;
  let q = v3(E$());
  if ($ === (q && Q6$(q))) return;
  (N(`Hook sessionTitle cached (${[...$].length} chars)`), WCH($), Eh8($));
}

// READABLE (for understanding):
function sanitizeSessionTitle(raw) {
  // strip C0 (0x00-0x1F) and C1/DEL (0x7F-0x9F) control chars, then cap at 200 code points
  return [...raw.replace(/[\x00-\x1f\x7f-\x9f]/g, "")].slice(0, MAX_TITLE_CHARS /* 200 */).join("");
}
function cacheSessionTitleFromHook(rawTitle) {
  if (isManagedSubagentContext()) return;            // never retitle inside a subagent/team session
  const title = sanitizeSessionTitle(rawTitle);
  if (!title) return;                                // empty after sanitize → no-op
  const current = getCurrentSessionTitle(getSessionId());
  if (title === (current && sanitizeSessionTitle(current))) return;  // unchanged → no-op
  log(`Hook sessionTitle cached (${[...title].length} chars)`);
  setCurrentSessionTitle(title);   // WCH — live state only, fires Kh$ UI emitter
  setSessionAgentNameLive(title);  // Eh8 — keeps the agent-name display in sync
}

// Mapping: Q6$→sanitizeSessionTitle, KSH→cacheSessionTitleFromHook, FA→isManagedSubagentContext,
//          v3→getCurrentSessionTitle, E$→getSessionId, WCH→setCurrentSessionTitle, Eh8→setSessionAgentNameLive,
//          PJz→MAX_TITLE_CHARS(200)
```

`WCH` (cli_inner_pretty.js:547594-547596) sets `currentSessionTitle` and fires the `Kh$` UI emitter — it does **not** write to the session file. That is deliberate: at startup/resume the session file is still being loaded/reconstructed, so writing a "custom title" record at that instant would race the loader. Caching into live state lets the title show up in the UI immediately while leaving persistence to the normal save path.

### Path B — Apply (mid-session / UserPromptSubmit): `applySessionTitleFromHook` (`ih8`)

When a title arrives outside startup/resume — the UserPromptSubmit path — it goes through `ih8`, which persists it. In the UserPromptSubmit handler the title is accumulated into `v` (cli_inner_pretty.js:590860) and applied at the end (cli_inner_pretty.js:590882: `if (v) await ih8(v)`).

```javascript
// ============================================
// applySessionTitleFromHook - Persist a hook title via the rename machinery (source "hook")
// Location: cli_inner_pretty.js:552023-552034
// ============================================

// ORIGINAL (for source lookup):
async function ih8(H) {
  if (FA()) return;
  let $ = Q6$(H);
  if (!$) return;
  let q = E$(), K = v3(q);
  if ($ === (K && Q6$(K))) return;
  (N(`Hook sessionTitle applied (${[...$].length} chars)`),
    await US(q, $, void 0, "hook"),
    await RzH(q, $, void 0, "hook"),
    await xjH(KJ(), $, "user"));
}

// READABLE (for understanding):
async function applySessionTitleFromHook(rawTitle) {
  if (isManagedSubagentContext()) return;            // same subagent/team guard as the cache path
  const title = sanitizeSessionTitle(rawTitle);
  if (!title) return;
  const sessionId = getSessionId();
  const current = getCurrentSessionTitle(sessionId);
  if (title === (current && sanitizeSessionTitle(current))) return;  // unchanged → no-op
  log(`Hook sessionTitle applied (${[...title].length} chars)`);
  await setSessionTitle(sessionId, title, undefined, "hook");        // US — persist custom-title + telemetry
  await setSessionAgentName(sessionId, title, undefined, "hook");    // RzH — persist agent-name side channel
  await setAgentNameOnDisk(jobId(), title, "user");                  // xjH — write agent record on disk
}

// Mapping: ih8→applySessionTitleFromHook, FA→isManagedSubagentContext, Q6$→sanitizeSessionTitle,
//          E$→getSessionId, v3→getCurrentSessionTitle, US→setSessionTitle, RzH→setSessionAgentName,
//          xjH→setAgentNameOnDisk, KJ→jobId
```

The persisting call is `setSessionTitle` (`US`, cli_inner_pretty.js:547477-547482) with source `"hook"`. `US` is exactly the rename primitive `/rename` uses: it writes a `{ type: "custom-title", ... }` record to the session file via `yAH`, updates live `currentSessionTitle`, fires the UI emitter, and logs `tengu_session_renamed { source }`. Passing `source: "hook"` is what makes the telemetry distinguishable from a user-initiated `/rename` (`source: "user"`). The two follow-ups (`RzH`, `xjH`) keep the agent-name surfaces in sync so the title shows up consistently wherever the session/agent name is displayed.

### Why two paths instead of one?

| Aspect | Cache (`KSH`, startup/resume) | Apply (`ih8`, mid-session) |
|---|---|---|
| Persists to session file | No (live state only) | Yes (`US` writes `custom-title`) |
| When it runs | During session load/reconstruction | After a user turn (UserPromptSubmit) |
| Telemetry | none (just a debug log) | `tengu_session_renamed { source:"hook" }` |
| Risk if it persisted | Race with the session-file loader | none |

> **Key insight:** the split is about *avoiding a write race at load time*. At startup/resume the session file is mid-load, so the title is only reflected in live UI state (`WCH`) and the actual persistence is deferred to the normal save flow. Mid-session there is no such race, so the hook title is committed immediately and fully via the same `/rename` machinery — and tagged `source:"hook"` so analytics can tell hook-set titles apart from human-set ones.

### The shared guards (both paths)

1. **Subagent guard** — `if (FA()) return;` (cli_inner_pretty.js:547607, 552024). `isManagedSubagentContext` (`FA`, cli_inner_pretty.js:99280-99283) is true inside a subagent or a managed-team agent. A subagent must never retitle the parent session, so both title paths bail out early there.
2. **Empty-after-sanitize guard** — `if (!$) return;`. If sanitization leaves an empty string (e.g. the hook emitted only control characters), nothing happens.
3. **No-op-if-unchanged guard** — `if ($ === (current && Q6$(current))) return;`. Both the incoming title and the current title are sanitized before comparison, so a hook that re-emits the existing title (very common with "session_title in, sessionTitle out" hooks that pass it through) causes **no** state mutation, no UI flicker, and no telemetry. This pairs naturally with Step 1, where the hook is *handed* the current title in its input.

### Sanitization details (`sanitizeSessionTitle` / `Q6$`)

`Q6$` (cli_inner_pretty.js:547603-547605) does two things:

- `replace(/[\x00-\x1f\x7f-\x9f]/g, "")` — strips **C0 control chars** (`0x00`–`0x1F`, includes NUL, tab, CR, LF, ESC) and **C1 / DEL** (`0x7F`–`0x9F`). This prevents a hook from injecting ANSI escape sequences or newlines into the title bar / session list (a terminal-injection hardening, consistent with the OSC-allowlist hardening elsewhere in the hooks subsystem).
- `[...cleaned].slice(0, PJz).join("")` — spreads to **code points** and caps at `PJz = 200` (cli_inner_pretty.js:549113). Spreading (rather than `.slice` on the raw string) means the 200-char cap counts user-perceived characters, so a multi-byte emoji or CJK title isn't truncated mid-surrogate.

---

## 6. The deferred-slot mechanism (`YN6` / `niH`)

The startup/resume title uses a one-shot deferred slot rather than being returned from `$U` directly. `$U` writes the title into module-global `YN6` (cli_inner_pretty.js:270672, declared at 270715), and the caller drains it:

```javascript
// ============================================
// takeResumeTitle - One-shot drain of the deferred resume-title slot
// Location: cli_inner_pretty.js:270633-270636
// ============================================

// ORIGINAL (for source lookup):
function niH() {
  let H = YN6;
  return ((YN6 = void 0), H);
}

// READABLE (for understanding):
function takeResumeTitle() {
  const title = pendingResumeTitle;   // YN6
  pendingResumeTitle = undefined;      // consume — read once, then clear
  return title;
}

// Mapping: niH→takeResumeTitle, YN6→pendingResumeTitle
```

This mirrors the sibling `takeInitialUserMessage` (`Nv7`, cli_inner_pretty.js:270629-270632) that drains `AN6` for `initialUserMessage`. The pattern keeps `$U`'s return value a clean array of `messages` while still threading two scalar side-products (initial user message, resume title) out to the caller without changing the function signature.

Note the resume call sites also pass the *current* title back into `$U` so the hook sees it (cli_inner_pretty.js:373459 `sessionTitle: v3(E$()) ?? q?.customTitle`; cli_inner_pretty.js:628746 `sessionTitle: $8.customTitle`). That closes the loop: the resume flow tells the hook "here is the title this session had," the hook may change it, and `KSH` writes the (possibly changed) result back into live state.

---

## 7. The apply switch (`applyHookJSONOutput`)

The raw `hookSpecificOutput` JSON is mapped onto the in-memory hook result object `M` by a big `switch (hookEventName)`. The SessionStart and UserPromptSubmit cases each copy the new field across:

```javascript
// ============================================
// applyHookJSONOutput - SessionStart/UserPromptSubmit cases copy sessionTitle + reloadSkills
// Location: cli_inner_pretty.js:552511-552528
// ============================================

// ORIGINAL (for source lookup):
case "UserPromptSubmit":
  ((M.additionalContext = H.hookSpecificOutput.additionalContext),
    (M.sessionTitle = H.hookSpecificOutput.sessionTitle),
    (M.suppressOriginalPrompt = H.hookSpecificOutput.suppressOriginalPrompt));
  break;
// ...
case "SessionStart":
  if (
    ((M.additionalContext = H.hookSpecificOutput.additionalContext),
    (M.initialUserMessage = H.hookSpecificOutput.initialUserMessage),
    (M.sessionTitle = H.hookSpecificOutput.sessionTitle),
    "watchPaths" in H.hookSpecificOutput && H.hookSpecificOutput.watchPaths)
  )
    M.watchPaths = H.hookSpecificOutput.watchPaths;
  M.reloadSkills = H.hookSpecificOutput.reloadSkills;
  break;

// READABLE (for understanding):
case "UserPromptSubmit":
  result.additionalContext = out.additionalContext;
  result.sessionTitle = out.sessionTitle;            // NEW: title write surface on UserPromptSubmit
  result.suppressOriginalPrompt = out.suppressOriginalPrompt;
  break;
// ...
case "SessionStart":
  result.additionalContext = out.additionalContext;
  result.initialUserMessage = out.initialUserMessage;
  result.sessionTitle = out.sessionTitle;            // NEW v2.1.152
  if ("watchPaths" in out && out.watchPaths) result.watchPaths = out.watchPaths;
  result.reloadSkills = out.reloadSkills;            // NEW v2.1.152
  break;

// Mapping: H.hookSpecificOutput→out, M→result
```

Note `reloadSkills` is assigned unconditionally (it's a plain boolean copy at cli_inner_pretty.js:552527); the aggregator's truthiness check in Step 2 is what actually gates the reload.

---

## 8. Plugin-hook loading note

`$U` also loads plugin-provided hooks before running them (`X8H()` via `ABH("load_plugin_hooks", ...)`, cli_inner_pretty.js:270646-270661) and the plugin registration path emits the `plugin_load_hooks` counter (cli_inner_pretty.js:270621). This matters for `sessionTitle`/`reloadSkills` because a plugin's SessionStart hook is a primary use case: a plugin that ships skills installs them via its SessionStart hook and then sets `reloadSkills: true` so its own skills light up in-session. If plugin loading fails, `$U` logs a contextual warning and continues (the SessionStart hooks from plugins simply won't run).

---

## Summary table (field → behavior)

| Field | Type | Schema line | Collected in `$U` | Dispatch |
|---|---|---|---|---|
| `sessionTitle` | string | 550706 (SessionStart), 550695 (UserPromptSubmit) | `O = w.sessionTitle` (270667) | startup/resume → `KSH` cache (547606); else → `ih8` apply (552023) via `US`/`RzH`/`xjH` source `"hook"` |
| `reloadSkills` | boolean | 550708-550713 | `M = !0` (270669) | `_C()` + `Bo()` + `Xc.emit()` + telemetry `hook_session_start_reload_skills` (270671) |

Both confirmed **NEW post-2.1.88** (2.1.88 `SessionStartHookSpecificOutputSchema` = `additionalContext`/`initialUserMessage`/`watchPaths` only; `UserPromptSubmitHookSpecificOutputSchema` = `additionalContext` only). **Confidence: high.**
