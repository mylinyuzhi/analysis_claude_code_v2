# /background (/bg) Slash Command — v2.1.156

## TL;DR

`/background` (alias `/bg`) is a `local-jsx` slash command that sends the **current interactive session** to a detached background worker, freeing the terminal while the conversation keeps going. It is the in-REPL twin of the pre-existing CLI `--bg`/`--background` flag.

The one-seam call graph is:

```
user types "/bg [prompt]"
   → Fwz (call handler)             cli_inner_pretty.js:542895
       ├─ guard v7()  (already-bg → detach)        99358 / 457636
       ├─ guard NWH() (persistence disabled → bail) 546176
       ├─ Ah8() derive seed {intent,name,nameSource,detail}  542733
       │     └─ null → "Nothing to background yet…" bail   542904
       └─ return <gwz BackgroundForkPrompt .../>   542905
              → (idle) auto-confirm | (busy) DialogBox + ConfirmCancelChoice  542776/542855
              → zh8 spawnBackgroundFork(...)        542680
                    └─ ol() unified dispatcher with --resume <id> --fork-session [--reply-on-resume]  542695
              → exit prompt via tK() + formatBgHints banner  542811 / 542079
```

**What is NEW vs 2.1.88.** The session-fork *primitive* (`--resume <id> --fork-session`) and the *CLI flag* `--bg`/`--background` (→ `handleBgFlag`, guarded by `feature('BG_SESSIONS')`) both already existed in 2.1.88. What 2.1.156 adds on top is the entire **in-REPL handoff layer**: the `/background` (`/bg`) slash command (`owz`/`awz`), the seed-deriving + confirm UI (`Ah8` `deriveBackgroundSeed`, `gwz` `BackgroundForkPrompt`), the argv-assembling `zh8` `spawnBackgroundFork`, a **new `--reply-on-resume` flag**, worktree handoff, and a brand-new `tengu_background*` telemetry family. The `/bg` REPL handoff is therefore new but is *not* a from-scratch reimplementation — it is a thin policy layer over the battle-tested fork primitive.

**Confidence: high.** Every structural claim below is pinned to a verbatim line in `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`, independently re-read across six verification facets. Residual gaps (a few upstream input-dispatch routing lines, and that the 2.1.88 tree is a deobfuscated reconstruction) are listed in **Confidence & Gaps**.

> Naming note carried throughout: `zh8`'s **bundler ground-truth export name is `spawnBackgroundFork`** (`X$(OH9,{spawnBackgroundFork:()=>zh8,...})` at cli_inner_pretty.js:542679). The neighboring document `daemon_binary_takeover_and_bg_handoff.md` labels it `backgroundCurrentSession`; that is a descriptive alias, and the existing symbol index also maps it to `backgroundCurrentSession`. This doc uses the ground-truth `spawnBackgroundFork`.

---

## Where it lives

The feature is split across **two ESM namespace modules** in the same source region:

- **Definition module `MH9`** — holds only the lightweight command-def object. `var MH9 = {}` (cli_inner_pretty.js:542936); `X$(MH9, { default: () => awz })` (cli_inner_pretty.js:542937). Its default export is `awz`, which equals `owz`, the actual command def. The thunk `jH9` (cli_inner_pretty.js:542939-542951) assigns `owz`/`awz` on first access.
- **Implementation module `OH9`** — holds the real behavior. `var OH9 = {}` (cli_inner_pretty.js:542678); `X$(OH9, { spawnBackgroundFork: () => zh8, deriveBackgroundSeed: () => Ah8, call: () => Fwz })` (cli_inner_pretty.js:542679). The command's `load()` resolves to this namespace.

> **Names — ground-truth vs coined.** `spawnBackgroundFork`, `deriveBackgroundSeed`, and `call` are **bundler-preserved export keys** (they appear verbatim as strings in the bundle — grep `spawnBackgroundFork` → 1 hit) and are therefore ground truth. The module/thunk names below (`backgroundCommandDefModule`/`MH9`, `backgroundCommandImplModule`/`OH9`, `initBackgroundImplDeps`/`Sqq`, `initBackgroundCommandDef`/`jH9`) and most function names in this doc (e.g. `backgroundCall`/`Fwz`) are **coined** readable names — the bundler minified those identifiers, so the name is this analysis's faithful summary of the code's behavior, not a recovered original. Coined names are the deobfuscation norm; only the explicitly-noted exports are recovered.

The lazy load is two-staged: `owz.load()` returns `Promise.resolve().then(() => (Sqq(), OH9))` (cli_inner_pretty.js:542948). `Sqq` (`initBackgroundImplDeps`, cli_inner_pretty.js:542914-542935) is a `T(...)` init thunk that pulls in dependency modules and **binds React** (`NAH = m(LH(), 1)` at cli_inner_pretty.js:542934) before the impl namespace is handed back. So the registry stays cheap to enumerate (tab-completion, help) until `/bg` is actually run.

```javascript
// ============================================
// backgroundCommandImplModule - the implementation namespace whose load() target carries call/spawn/seed
// Location: cli_inner_pretty.js:542678-542679
// ============================================

// ORIGINAL (for source lookup):
var OH9 = {};
X$(OH9, { spawnBackgroundFork: () => zh8, deriveBackgroundSeed: () => Ah8, call: () => Fwz });

// READABLE (for understanding):
const backgroundCommandImplModule = {};
exportNamespace(backgroundCommandImplModule, {
  spawnBackgroundFork: () => spawnBackgroundFork,   // zh8
  deriveBackgroundSeed: () => deriveBackgroundSeed, // Ah8
  call:                 () => backgroundCall,       // Fwz
});

// Mapping: OH9→backgroundCommandImplModule, X$→exportNamespace, zh8→spawnBackgroundFork, Ah8→deriveBackgroundSeed, Fwz→backgroundCall (export key: "call")
```

---

## End-to-end flow

```
┌─ user types "/bg" or "/bg <prompt>" in the REPL ─────────────────────────────┐
│                                                                              │
│  immediate predicate (H)=>!H.trim()  (542946)                                │
│     ├─ empty arg  → IMMEDIATE path: fire on recognition, isMidTurn:!0        │
│     │                 ctx via jG(...) (629653), call(...,{...ctx,isMidTurn:!0})│
│     │                 (629654) / twin 591149                                  │
│     └─ has prompt → SUBMIT path: wait for Enter, no isMidTurn (396385)        │
│                                                                              │
│  Fwz  backgroundCall(onDone, ctx, argString)   (542895)                      │
│     ├─ v7()  already-bg? → tengu_background_already_bg, onDone(), bzH(), null │ (542896)
│     ├─ NWH() persistence off? → onDone("Cannot background…"), null            │ (542897)
│     ├─ seed = Ah8(ctx.messages, prompt.trim())                               │ (542903)
│     │     └─ null → onDone("Nothing to background yet — send a message first.")│ (542904)
│     └─ return React.createElement(gwz, {onDone,prompt,seed,messages,isMidTurn})│ (542905)
│                                                                              │
│  gwz  BackgroundForkPrompt                       (542763)                     │
│     ├─ inflight = hV8(tasks)                      (457394)                    │
│     ├─ useState(inflight.count === 0)            (542776)                     │
│     │     ├─ idle  → auto-confirm, render "Backgrounding…"                    │
│     │     └─ busy  → DialogBox + ConfirmCancelChoice ("Background anyway…")   │ (542855)
│     └─ once-only effect (useRef guard) →                                      │ (542777/542796)
│            zh8(seed, prompt, effort, mode, addDirs, allow, deny, "command",   │ (542798)
│                messages, {replyOnResume:isMidTurn})                           │
│                                                                              │
│  zh8  spawnBackgroundFork                         (542680)                    │
│     ├─ flush transcript (withTimeout 2000ms)      (542694)                    │
│     ├─ argv: --resume <id> --fork-session [--reply-on-resume] + flags + -- p  │ (542697)
│     ├─ ol(...) unified dispatcher                 (542695)                    │
│     ├─ worktree handoff (if owned)                (542692/542714/542723)      │
│     ├─ async auto-name (if no name)               (542724-542729)            │
│     └─ telemetry tengu_background_spawn_failed | tengu_background{via}        │ (542722/542723)
│                                                                              │
│  back in gwz: telemetry tengu_background_fork{...}                           │ (542800)
│     → onDone(); tK(0,"prompt_input_exit",{finalMessage: ny$(short, suffix)})  │ (542811)
│                                                                              │
└─ terminal freed; banner "backgrounded · <short>" + claude agents/attach/… ──┘
```

---

## 1. Command definition (`owz`/`awz`) — the `local-jsx` model

The command object is assigned by the thunk `jH9`:

```javascript
// ============================================
// backgroundCommandDef - the /background (alias /bg) local-jsx command definition + lazy load
// Location: cli_inner_pretty.js:542936-542951
// ============================================

// ORIGINAL (for source lookup):
var MH9 = {};
X$(MH9, { default: () => awz });
var owz, awz;
var jH9 = T(() => {
  ((owz = {
    type: "local-jsx",
    name: "background",
    aliases: ["bg"],
    description: "Send this session to the background and free the terminal",
    argumentHint: "[prompt]",
    immediate: (H) => !H.trim(),
    isEnabled: () => !0,
    load: () => Promise.resolve().then(() => (Sqq(), OH9)),
  }),
    (awz = owz));
});

// READABLE (for understanding):
const backgroundCommandDefModule = {};
exportNamespace(backgroundCommandDefModule, { default: () => backgroundCommandDefExport });
let backgroundCommandDef, backgroundCommandDefExport;
const initBackgroundCommandDef = lazyInitThunk(() => {
  backgroundCommandDef = {
    type: "local-jsx",                       // renders a React/Ink panel, not text output
    name: "background",
    aliases: ["bg"],
    description: "Send this session to the background and free the terminal",
    argumentHint: "[prompt]",
    immediate: (input) => !input.trim(),     // empty/whitespace → fire on keystroke (no Enter)
    isEnabled: () => true,                    // always available
    // lazy: init impl-module deps + React, then resolve to the IMPLEMENTATION namespace
    load: () => Promise.resolve().then(() => (initBackgroundImplDeps(), backgroundCommandImplModule)),
  };
  backgroundCommandDefExport = backgroundCommandDef;
});

// Mapping: MH9→backgroundCommandDefModule, owz→backgroundCommandDef, awz→backgroundCommandDefExport, jH9→initBackgroundCommandDef, T→lazyInitThunk, H→input, Sqq→initBackgroundImplDeps, OH9→backgroundCommandImplModule
```

Field-by-field (all cli_inner_pretty.js:542940-542948):
- `type: "local-jsx"` — the `call` handler returns a React/Ink element instead of producing text or queuing an LLM turn.
- `name: "background"`, `aliases: ["bg"]`.
- `description: "Send this session to the background and free the terminal"`.
- `argumentHint: "[prompt]"` — the optional inline prompt becomes the fork's initial directive.
- `immediate: (H) => !H.trim()` — a **predicate**, not a boolean (see deep analysis).
- `isEnabled: () => !0` — always shown.
- `load: () => Promise.resolve().then(() => (Sqq(), OH9))` — init deps, then resolve impl namespace.

### Deep analysis — the `local-jsx` command model

**What it does:** Declares `/background` as a command whose `call` handler returns a React/Ink element (an interactive confirmation panel) rather than text. The def object (`owz`/`awz`) is pure metadata + a lazy loader; the real behavior lives in the separately-loaded impl module `OH9` (`call: Fwz`).

**How it works (step-by-step):**
1. The registry holds the lightweight def `owz` (cli_inner_pretty.js:542940). Its `load()` returns `Promise.resolve().then(()=>(Sqq(),OH9))` (cli_inner_pretty.js:542948) — first runs `Sqq()` to bind dependency modules + React (`NAH=m(LH(),1)`, cli_inner_pretty.js:542934), then hands back impl namespace `OH9` whose exports include `call:Fwz` (cli_inner_pretty.js:542679).
2. When invoked, `Fwz` returns `NAH.createElement(gwz,{...})` (cli_inner_pretty.js:542905) — a React element.
3. The REPL mounts that element as a panel: `setPanel({jsx:element, isLocalJSXCommand:true, ...})` (cli_inner_pretty.js:396389 / 591150 / 629655).
4. Non-interactive/headless sessions are rejected up front (cli_inner_pretty.js:396337): a local-jsx command "opens an interactive panel and isn't available in this environment" (verbatim at cli_inner_pretty.js:396339).

**Why this approach:** `/background` needs a yes/no confirmation UI (`BackgroundForkPrompt` `gwz`, cli_inner_pretty.js:542763) showing the derived intent/name before forking a detached process — inherently interactive and stateful, which a plain text-returning `local` command cannot express. Splitting def (`MH9`) from impl (`OH9`) keeps the registry cheap to enumerate while deferring heavy React + fork machinery until the command actually runs (lazy load via `T()`/`Sqq()`). The handler-injected `onDone` callback (`H`) lets the panel both close itself and surface a notification string, unifying success and guard-failure exits.

**Key insight:** A `local-jsx` command is a *UI factory*: `call(onDone, ctx, arg) -> ReactElement | null`. Returning `null` means "handled, nothing to render" (all three guard exits); an element means "mount this panel." The `onDone` callback is the single channel back to the REPL for both dismissal and surfacing text.

### Deep analysis — the `immediate` predicate `(H) => !H.trim()`

**What it does:** Decides, per keystroke, whether typing `/bg` executes the moment the parser recognizes the command (`immediate`) or waits for Enter (normal submit). Returns true only when there is **no** inline prompt (empty/whitespace after the command name).

**How it works:** During input parsing the REPL evaluates the def's `immediate` via `kLH` (cli_inner_pretty.js:395644-395647): `typeof immediate==='function' ? immediate(input) : immediate===true`.

```javascript
// ============================================
// isImmediateCmd (kLH) - evaluate `immediate` as a function-of-input or a plain boolean
// Location: cli_inner_pretty.js:395644-395647
// ============================================

// ORIGINAL (for source lookup):
function kLH(H, $) {
  let q = H?.immediate;
  return typeof q === "function" ? q($) : q === !0;
}

// READABLE (for understanding):
function isImmediateCmd(commandDef, input) {
  const immediate = commandDef?.immediate;
  return typeof immediate === "function" ? immediate(input) : immediate === true;
}

// Mapping: kLH→isImmediateCmd, H→commandDef, $→input, q→immediate
```

For `/background`, `immediate(remainingInput) = !remainingInput.trim()`: true for just `/bg` (or `/bg   `), false once a prompt like `/bg fix the tests` is typed. When `immediate` resolves true **and** `type==='local-jsx'` **and** the input is active (`n5 && Ez && n5.type==='local-jsx'` at cli_inner_pretty.js:629619; `Ez = k9.isActive && (kLH(n5,X_)||fromKeybinding)` at cli_inner_pretty.js:629618), the REPL builds the context with `jG` (cli_inner_pretty.js:629653) and calls the handler with `{...ctx, isMidTurn:!0}` (cli_inner_pretty.js:629654) — twin at cli_inner_pretty.js:591149 with the `f(...)` ctx — then mounts the panel (`isImmediate:true`). When `immediate` is false (a prompt is present) the command goes through the normal submit path (cli_inner_pretty.js:396385) where `call` is invoked **without** `isMidTurn`, so `Fwz`'s `$.isMidTurn ?? !1` (cli_inner_pretty.js:542910) evaluates to false.

```javascript
// ============================================
// immediateCommandInvocation - REPL immediate-execution path injecting isMidTurn:!0 (source of $.isMidTurn)
// Location: cli_inner_pretty.js:629653-629655
// ============================================

// ORIGINAL (for source lookup):
oF = jG(N9.current, [], C4(), OH),
                  Gn = await (await n5.load()).call(rX, { ...oF, isMidTurn: !0 }, X_, J_);
                if (Gn && !QJ) D8({ jsx: Gn, shouldHidePromptInput: !1, isLocalJSXCommand: !0, isImmediate: !0 });

// READABLE (for understanding):
// IMMEDIATE path: gated by n5.type === "local-jsx" (629619) and kLH-driven immediate selection
const ctx = buildReplCommandContext(messagesRef.current, /*queue*/[], makeAbortController(), mainLoopModel);
const element = await (await commandDef.load()).call(
  onDoneCallback,
  { ...ctx, isMidTurn: true },   // <-- isMidTurn injected ONLY here (and the 591149 twin)
  parsedArgs,
  commandName,
);
if (element && !alreadyClosed)
  setPanel({ jsx: element, shouldHidePromptInput: false, isLocalJSXCommand: true, isImmediate: true });

// Mapping: jG→buildReplCommandContext, N9.current→messagesRef.current, oF→ctx, n5→commandDef, rX→onDoneCallback, X_→parsedArgs, J_→commandName, Gn→element, QJ→alreadyClosed, D8→setPanel. Twin at 591149: o.load().call(e,{...$H,isMidTurn:!0},a,r) where $H=f(O,[],C4(),M) at 591136
```

```javascript
// ============================================
// submitPathInvocation - NON-immediate submit path; call() invoked WITHOUT isMidTurn (defaults false)
// Location: cli_inner_pretty.js:396384-396389
// ============================================

// ORIGINAL (for source lookup):
O.load()
            .then((J) => J.call(D, { ...K, canUseTool: Y }, $, H))
            .then((J) => {
              if (J == null) return;
              if (w) return;
              q({ jsx: J, shouldHidePromptInput: !0, showSpinner: !1, isLocalJSXCommand: !0, isImmediate: kLH(O, $) });
            })

// READABLE (for understanding):
commandDef.load()
  .then((mod) => mod.call(onDone, { ...baseCtx, canUseTool: permissionFn }, argString, commandName))
  //                                ^ no isMidTurn key here -> Fwz reads $.isMidTurn ?? false === false
  .then((element) => {
    if (element == null) return;
    if (alreadyClosed) return;
    setPanel({ jsx: element, shouldHidePromptInput: true, showSpinner: false, isLocalJSXCommand: true, isImmediate: isImmediateCmd(commandDef, argString) });
  });

// Mapping: O→commandDef, D→onDone, K→baseCtx, Y→permissionFn, $→argString, H→commandName, J→element, w→alreadyClosed, q→setPanel, kLH→isImmediateCmd
```

**Why this approach:** UX. `/bg` with no argument is an unambiguous, parameter-less action — popping the panel instantly (no Enter) is snappier, and at that moment the user is mid-turn-deciding rather than composing, hence `isMidTurn:true`. But `/bg <prompt>` carries a payload still being typed; firing immediately on the first space would tear the half-typed prompt away. Requiring Enter there lets the user finish composing the directive that becomes the fork's initial message. The predicate form of `immediate` (vs `/stop`'s plain boolean `immediate:!0` at cli_inner_pretty.js:543012) is precisely what lets one command be immediate-or-not depending on whether it has an argument.

**Key insight:** `immediate` is a *function*, not a flag, specifically so `/background` can branch on argument presence: empty → fire-on-recognition (and mark `isMidTurn` so the panel knows it interrupted the user mid-decision); non-empty → wait-for-submit so the inline prompt can be fully composed. `isMidTurn` is a direct consequence of which code path fired, not an independent input.

---

## 2. The call handler (`Fwz` / `backgroundCall`)

```javascript
// ============================================
// backgroundCall - the /background "call" handler: two guards, seed gate, BackgroundForkPrompt element
// Location: cli_inner_pretty.js:542895-542912
// ============================================

// ORIGINAL (for source lookup):
Fwz = async (H, $, q) => {
    if (v7()) return (d("tengu_background_already_bg", {}), H(), bzH(), null);
    if (NWH())
      return (
        H("Cannot background — session persistence is disabled, so the forked job would have nothing to resume."),
        null
      );
    let K = (q ?? "").trim(),
      _ = Ah8($.messages, K);
    if (_ === null) return (H("Nothing to background yet — send a message first."), null);
    return NAH.createElement(gwz, {
      onDone: H,
      prompt: K,
      seed: _,
      messages: $.messages,
      isMidTurn: $.isMidTurn ?? !1,
    });
  },

// READABLE (for understanding):
const backgroundCall = async (onDone, ctx, argString) => {
  // GUARD 1: already a background session -> nothing to fork; just dismiss + detach from daemon
  if (isBackgroundSession()) {
    telemetry("tengu_background_already_bg", {});
    onDone();              // close the command UI (no message text)
    requestDaemonDetach(); // if on daemon backend, send detach-request + print detach text
    return null;
  }
  // GUARD 2: persistence off -> the forked job could not --resume anything
  if (isSessionPersistenceDisabled()) {
    onDone("Cannot background — session persistence is disabled, so the forked job would have nothing to resume.");
    return null;
  }
  const prompt = (argString ?? "").trim();
  const seed = deriveBackgroundSeed(ctx.messages, prompt);
  // GUARD 3: no real conversation yet AND no explicit prompt -> nothing to background
  if (seed === null) {
    onDone("Nothing to background yet — send a message first.");
    return null;
  }
  return React.createElement(BackgroundForkPrompt, {
    onDone,                              // close-callback / addNotification sink
    prompt,                              // trimmed inline arg
    seed,                                // {intent,name,nameSource,detail}
    messages: ctx.messages,              // live conversation for the fork
    isMidTurn: ctx.isMidTurn ?? false,   // true only on the immediate path
  });
};

// Mapping: Fwz→backgroundCall, H→onDone, $→ctx, q→argString, K→prompt, _→seed, d→telemetry, v7→isBackgroundSession, bzH→requestDaemonDetach, NWH→isSessionPersistenceDisabled, Ah8→deriveBackgroundSeed, NAH→React, gwz→BackgroundForkPrompt
```

### Guard 1: already a background session (`v7` / `bzH`)

`v7` (`isBackgroundSession`, cli_inner_pretty.js:99358-99360) returns true when `CLAUDE_CODE_SESSION_KIND === 'bg'` (read via `VOH` `getSessionKind`, cli_inner_pretty.js:99353-99356, which only returns the kind for `'bg'|'daemon'|'daemon-worker'`). When you are *already* in a backgrounded session, `/bg` is **not** an error — it degrades to a daemon detach:

```javascript
// ============================================
// isBackgroundSession + requestDaemonDetach - Guard 1 detection and the daemon detach path it triggers
// Location: cli_inner_pretty.js:99353-99363,457636-457640
// ============================================

// ORIGINAL (for source lookup):
function VOH() {
  let H = process.env.CLAUDE_CODE_SESSION_KIND;
  if (H === "bg" || H === "daemon" || H === "daemon-worker") return H;
  return;
}
function v7() {
  return VOH() === "bg";
}
function Ao$() {
  return process.env.CLAUDE_BG_BACKEND === "daemon";
}
// ...
function bzH() {
  if (!Ao$()) return;
  let H = nv4();
  (fs({ type: "detach-request", msg: H }), process.stdout.write(yqH(H)));
}

// READABLE (for understanding):
function getSessionKind() {
  const kind = process.env.CLAUDE_CODE_SESSION_KIND;
  if (kind === "bg" || kind === "daemon" || kind === "daemon-worker") return kind;
  return undefined;
}
function isBackgroundSession() {        // Guard 1
  return getSessionKind() === "bg";
}
function isDaemonBackend() {
  return process.env.CLAUDE_BG_BACKEND === "daemon";
}
function requestDaemonDetach() {
  if (!isDaemonBackend()) return;       // only meaningful on daemon backend
  const detachMsg = buildDetachMessage();
  sendToDaemon({ type: "detach-request", msg: detachMsg });
  process.stdout.write(formatDetachText(detachMsg));
}

// Mapping: VOH→getSessionKind, v7→isBackgroundSession, Ao$→isDaemonBackend, bzH→requestDaemonDetach, nv4→buildDetachMessage, fs→sendToDaemon, yqH→formatDetachText
```

So inside an already-backgrounded session `/bg` emits `tengu_background_already_bg {}` (cli_inner_pretty.js:542896), calls `onDone()` (close, no text), and runs `bzH()`. `bzH` (`requestDaemonDetach`, cli_inner_pretty.js:457636-457640) is a no-op unless on the daemon backend (`Ao$`, cli_inner_pretty.js:99361-99363); when on it, it builds a detach message (`nv4`, cli_inner_pretty.js:457403), sends `{type:'detach-request',msg}` to the daemon (`fs`, cli_inner_pretty.js:449651), and prints the detach banner (`yqH`, cli_inner_pretty.js:457481). On a non-daemon backend the effect is just closing the UI + telemetry.

### Guard 2: session persistence disabled (`NWH`)

```javascript
// ============================================
// isSessionPersistenceDisabled - Guard 2: three disjuncts each meaning "fork has nothing to resume"
// Location: cli_inner_pretty.js:546173-546179
// ============================================

// ORIGINAL (for source lookup):
function J$9() {
  return "production";
}
function NWH() {
  let H = xH(process.env.TEST_ENABLE_SESSION_PERSISTENCE);
  return (J$9() === "test" && !H) || Kb() || xH(process.env.CLAUDE_CODE_SKIP_PROMPT_HISTORY);
}

// READABLE (for understanding):
function getNodeEnv() { return "production"; }
function isSessionPersistenceDisabled() {
  const testPersistenceOptIn = parseBooleanEnv(process.env.TEST_ENABLE_SESSION_PERSISTENCE);
  return (
    // (a) running under test env and not explicitly opted-in (DEAD in prod: getNodeEnv()==="production")
    (getNodeEnv() === "test" && !testPersistenceOptIn) ||
    // (b) runtime app-state flag d$.sessionPersistenceDisabled is set
    isSessionPersistenceDisabledFlag() ||
    // (c) user disabled prompt-history persistence via env
    parseBooleanEnv(process.env.CLAUDE_CODE_SKIP_PROMPT_HISTORY)
  );
}

// Mapping: NWH→isSessionPersistenceDisabled, xH→parseBooleanEnv, J$9→getNodeEnv, Kb→isSessionPersistenceDisabledFlag (returns d$.sessionPersistenceDisabled)
```

`J$9` (`getNodeEnv`, cli_inner_pretty.js:546173-546175) is hardcoded to `"production"`, so the `J$9()==='test'` branch is effectively **dead in production builds** — in practice `NWH` reduces to `Kb() || CLAUDE_CODE_SKIP_PROMPT_HISTORY`. `Kb` (`isSessionPersistenceDisabledFlag`, cli_inner_pretty.js:3032-3034) reads the mutable app-state flag `d$.sessionPersistenceDisabled` (setter at cli_inner_pretty.js:3030). `xH` (`parseBooleanEnv`, cli_inner_pretty.js:1795-1800) is the truthy-string parser (`['1','true','yes','on']`). This guard rejects **silently with no telemetry** (cli_inner_pretty.js:542897).

### Guard 3: nothing to seed (`Ah8` returns null)

`K = (arg ?? "").trim()`; `_ = Ah8(ctx.messages, K)` (cli_inner_pretty.js:542903). If `_ === null` the handler surfaces `"Nothing to background yet — send a message first."` (cli_inner_pretty.js:542904) and bails — again **no telemetry**. Only past all three guards does it `createElement(gwz, {...})` (cli_inner_pretty.js:542905).

### Deep analysis — guard ordering in `backgroundCall`

**What it does:** Runs three sequential early-returns before doing work: (1) already-a-background-session (`v7`), (2) session-persistence-disabled (`NWH`), (3) no-seed-available (`Ah8` returns null). Each returns `null` after notifying the user, so the panel never mounts when backgrounding is impossible.

**How it works:** Guard 1 (cli_inner_pretty.js:542896) is a pure env check that *redirects* (detach) rather than erroring. Guard 2 (cli_inner_pretty.js:542897) is an env/state precondition. Guard 3 (cli_inner_pretty.js:542904) is the only guard that inspects conversation content.

**Why this approach:** The order is cheapest/most-decisive-first, reflecting a dependency chain. `v7` is a pure env check and is semantically a redirect (different behavior, not a hard error), so it comes first — you never fork a fork. `NWH` is the next env/state check and a precondition for the whole feature: the fork relies on `--resume <id> --fork-session` (`zh8`, cli_inner_pretty.js:542697), so if persistence is off forking is structurally pointless; fail fast before touching messages. `Ah8` inspects conversation content (and only returns null when there is genuinely nothing to seed), so it runs last. Each guard returns `null` (not throw) because in the local-jsx model `null` is the "handled, render nothing" signal; feedback is delivered via `onDone(text)` rather than exceptions.

**Key insight:** The three guards encode three *different* failure semantics through identical `return null` shapes: (1) wrong-context redirect (detach instead), (2) feature-impossible precondition, (3) nothing-to-do-yet. Ordering env→state→content means no message-array scanning happens unless backgrounding is actually viable.

---

## 3. Seed derivation (`Ah8` / `deriveBackgroundSeed`)

`Ah8` reverse-scans the transcript to produce the `{intent, name, nameSource, detail}` record that describes the forked job, or `null` when there is nothing worth backgrounding.

```javascript
// ============================================
// deriveBackgroundSeed - reverse-scan transcript -> {intent,name,nameSource,detail} seed (or null)
// Location: cli_inner_pretty.js:542733-542762
// ============================================

// ORIGINAL (for source lookup):
function Ah8(H, $) {
  let q = $,
    K = !1,
    _;
  for (let Y = H.length - 1; Y >= 0; Y--) {
    let f = H[Y];
    if (f.type === "assistant" && _ === void 0) {
      let O = qU(f);
      if (O) _ = O.replace(/\s+/g, " ").trim().slice(0, 120);
    }
    if (f.type === "user" && !f.isMeta && !ST8(f)) {
      let O = KS(f)?.trim();
      if (O && TqH(O)) {
        if (O.startsWith(`<${KZ}>`)) K = !0;
        continue;
      }
      if (((K = !0), !q && O)) q = O;
    }
    if (K && q && _ !== void 0) break;
  }
  if (!K && !$) return null;
  let z = v3(E$()),
    A = HF(E$());
  return {
    intent: (q || "(backgrounded)").slice(0, 200),
    name: z ?? A,
    nameSource: z ? "user" : A ? "auto" : void 0,
    detail: _,
  };
}

// READABLE (for understanding):
function deriveBackgroundSeed(messages, explicitPrompt) {
  let intent = explicitPrompt,        // q
    sawQualifyingUserTurn = false,     // K
    latestAssistantDetail;             // _ (stays undefined until found)

  for (let i = messages.length - 1; i >= 0; i--) {
    let msg = messages[i];

    // First (= latest, scanning backwards) assistant text becomes the "detail":
    // whitespace collapsed, trimmed, capped at 120 chars. `_ === void 0` guards
    // it so only the most-recent assistant line is captured.
    if (msg.type === "assistant" && latestAssistantDetail === undefined) {
      let text = extractAssistantText(msg);
      if (text) latestAssistantDetail = text.replace(/\s+/g, " ").trim().slice(0, 120);
    }

    // Only consider real human user turns: not meta, not a tool_result turn.
    if (msg.type === "user" && !msg.isMeta && !isToolResultUserMessage(msg)) {
      let text = extractUserText(msg)?.trim();
      if (text && isStructuredTaggedText(text)) {
        // Synthetic/command-wrapped turn. ONLY a <command-message> (slash command
        // body) counts as genuine user engagement (set K=true); ALL tagged turns
        // then `continue` so their tagged body is never adopted as intent.
        if (text.startsWith(`<${COMMAND_MESSAGE_TAG}>`)) sawQualifyingUserTurn = true;
        continue;
      }
      // Free-form human prompt: qualifies; adopt as intent unless explicit prompt given.
      sawQualifyingUserTurn = true;
      if (!intent && text) intent = text;
    }

    // Early exit once intent, a qualifying turn, and a detail are all present.
    if (sawQualifyingUserTurn && intent && latestAssistantDetail !== undefined) break;
  }

  // Nothing to background: no qualifying user turn AND no explicit prompt.
  if (!sawQualifyingUserTurn && !explicitPrompt) return null;

  let userTitle = getUserSessionTitle(getCurrentSessionId()),   // z
    autoTitle = getAutoSessionTitle(getCurrentSessionId());     // A
  return {
    intent: (intent || "(backgrounded)").slice(0, 200),
    name: userTitle ?? autoTitle,
    nameSource: userTitle ? "user" : autoTitle ? "auto" : undefined,
    detail: latestAssistantDetail,
  };
}

// Mapping: Ah8→deriveBackgroundSeed, H→messages, $→explicitPrompt, q→intent, K→sawQualifyingUserTurn, _→latestAssistantDetail, Y→i, f→msg, z→userTitle, A→autoTitle; qU→extractAssistantText, KS→extractUserText, ST8→isToolResultUserMessage, TqH→isStructuredTaggedText, KZ→COMMAND_MESSAGE_TAG, v3→getUserSessionTitle, HF→getAutoSessionTitle, E$→getCurrentSessionId
```

### Helpers

- `qU` (`extractAssistantText`, cli_inner_pretty.js:444999-445016) — concatenates an assistant message's text blocks (non-text → `''`), filters out empties, joins with newline, trims; returns null if not assistant / content not an array / empty.
- `KS` (`extractUserText`, cli_inner_pretty.js:445017-445021) — `jl(message.content)` for user messages; null otherwise.
- `jl` (`flattenContentText`, cli_inner_pretty.js:445039-445050) — string-as-is, or joins text blocks via `w9` (newline sep) and trims, null if empty.
- `w9` (`joinTextBlocks`, cli_inner_pretty.js:445034-445038) — filters to `type:'text'` blocks, joins with a separator.
- `ST8` (`isToolResultUserMessage`, cli_inner_pretty.js:444673-444678) — true if a user message whose array content contains a `tool_result` block; filters synthetic tool-result turns.
- `TqH` (`isStructuredTaggedText`, cli_inner_pretty.js:443714-443722) — see below.
- `v3` (`getUserSessionTitle`, cli_inner_pretty.js:547524-547527) / `HF` (`getAutoSessionTitle`, cli_inner_pretty.js:547528-547531).
- `E$` (`getCurrentSessionId`, cli_inner_pretty.js:2359-2361) — `nk()?.sessionId ?? d$.sessionId`.

```javascript
// ============================================
// isStructuredTaggedText - detect a synthetic/command-wrapped user turn vs a free-form human prompt
// Location: cli_inner_pretty.js:443714-443722
// ============================================

// ORIGINAL (for source lookup):
function TqH(H) {
  return (
    H.startsWith(`<${dW}>`) ||
    H.startsWith(`<${KZ}>`) ||
    H.startsWith(`<${CR}>`) ||
    H.startsWith(`<${a5$}>`) ||
    H.startsWith(`<${zz}>`)
  );
}

// READABLE (for understanding):
function isStructuredTaggedText(text) {
  return (
    text.startsWith(`<${LOCAL_COMMAND_STDOUT_TAG}>`) ||  // <local-command-stdout>
    text.startsWith(`<${COMMAND_MESSAGE_TAG}>`)       ||  // <command-message>  (slash cmd body)
    text.startsWith(`<${COMMAND_NAME_TAG}>`)          ||  // <command-name>
    text.startsWith(`<${BASH_INPUT_TAG}>`)            ||  // <bash-input>       (! bash mode)
    text.startsWith(`<${TASK_NOTIFICATION_TAG}>`)         // <task-notification>
  );
}

// Mapping: TqH→isStructuredTaggedText, H→text; dW→LOCAL_COMMAND_STDOUT_TAG (41627), KZ→COMMAND_MESSAGE_TAG (41621), CR→COMMAND_NAME_TAG (41620), a5$→BASH_INPUT_TAG (41623), zz→TASK_NOTIFICATION_TAG (41632)
```

The five tags: `dW` `local-command-stdout` (cli_inner_pretty.js:41627), `KZ` `command-message` (cli_inner_pretty.js:41621), `CR` `command-name` (cli_inner_pretty.js:41620), `a5$` `bash-input` (cli_inner_pretty.js:41623), `zz` `task-notification` (cli_inner_pretty.js:41632).

```javascript
// ============================================
// getUserSessionTitle / getAutoSessionTitle - the two title sources deciding name + nameSource
// Location: cli_inner_pretty.js:547524-547531
// ============================================

// ORIGINAL (for source lookup):
function v3(H) {
  if (H === E$()) return p1().currentSessionTitle;
  return;
}
function HF(H) {
  if (H === E$()) return p1().currentSessionAiTitle;
  return;
}

// READABLE (for understanding):
function getUserSessionTitle(sessionId) {
  // currentSessionTitle <- customTitle ("User-set session title via /rename.", schema 338176)
  if (sessionId === getCurrentSessionId()) return getSessionMetadataStore().currentSessionTitle;
  return undefined;
}
function getAutoSessionTitle(sessionId) {
  // currentSessionAiTitle <- aiTitle (AI/auto-generated title)
  if (sessionId === getCurrentSessionId()) return getSessionMetadataStore().currentSessionAiTitle;
  return undefined;
}

// Mapping: v3→getUserSessionTitle, HF→getAutoSessionTitle, H→sessionId, E$→getCurrentSessionId, p1→getSessionMetadataStore, currentSessionTitle→user-set title, currentSessionAiTitle→AI/auto title; both fields set via zKH (547538-547544) using ??= from customTitle/aiTitle
```

`p1` (`getSessionMetadataStore`, cli_inner_pretty.js:546252) returns the lazily-created `W$9` metadata singleton (stored in module-global `EWH`). Its `currentSessionTitle` / `currentSessionAiTitle` fields are populated via `zKH` (cli_inner_pretty.js:547538-547544) using `??=` from `customTitle` (user) / `aiTitle` (auto). `customTitle`'s schema description is `"User-set session title via /rename."` (cli_inner_pretty.js:338176).

### Deep analysis — the reverse-scan algorithm

**What it does:** Produces the seed object the `/background` handoff uses to describe the forked job: an `intent` (short human-readable description), a `name` + `nameSource` (the session title and its provenance), and a `detail` (the latest assistant line). Returns `null` when there is nothing worth backgrounding.

**How it works (step-by-step):** Walks `messages` last→first (cli_inner_pretty.js:542737). Three accumulators: `intent` (seeded from the explicit prompt arg), `sawQualifyingUserTurn` (default false), `latestAssistantDetail` (undefined until found).
1. **detail** — the FIRST assistant message encountered scanning backwards (= most recent) with non-empty text becomes the detail: `qU` extracts text, then `.replace(/\s+/g,' ').trim().slice(0,120)` collapses whitespace and caps at 120 chars (cli_inner_pretty.js:542739-542742). `_ === void 0` ensures only the latest assistant line is captured.
2. **user turns** — a message qualifies for inspection only if `type==='user' && !isMeta && !isToolResultUserMessage` (cli_inner_pretty.js:542743), excluding meta and tool_result turns. Text via `KS`, trimmed.
   - If non-empty AND `isStructuredTaggedText` true → command/synthetic-wrapped turn. If it starts with `<command-message>`, set `K=true` (counts as real user action), then `continue` WITHOUT adopting the tagged body as intent (cli_inner_pretty.js:542745-542748). Other tagged kinds (`bash-input`, `command-name`, `local-command-stdout`, `task-notification`) hit the same `continue` but DO NOT set `K` — they are ignored entirely.
   - Otherwise free-form human prompt: set `K=true`, and if no explicit prompt yet, adopt this text as intent (cli_inner_pretty.js:542749).
3. **Early exit** — loop breaks once `K && intent && detail` all present (cli_inner_pretty.js:542751).
4. **Null gate** — `if (!K && !explicitPrompt) return null` (cli_inner_pretty.js:542753; surfaced by `Fwz` at cli_inner_pretty.js:542904 as "Nothing to background yet — send a message first.").
5. **Final object** (cli_inner_pretty.js:542756-542761): `intent = (intent || '(backgrounded)').slice(0,200)`; `name = userTitle ?? autoTitle`; `nameSource = userTitle ? 'user' : autoTitle ? 'auto' : undefined`; `detail = latestAssistantDetail`.

**Why this approach:** Backwards iteration cheaply finds the MOST RECENT relevant turns: the latest assistant line (best context for the job card) and the latest free-form user prompt (the user's current intent). The `K && q && detail` break usually touches only the transcript tail. The `K` flag is decoupled from `intent` so that slash-command-only sessions (where every user turn is `<command-message>...` and is filtered out of intent) still count as "has real user activity", preventing a false "Nothing to background yet". The `'(backgrounded)'` intent default guarantees a non-empty, bounded label. Title precedence (user over auto) reflects intent: a `/rename` title should win over an AI-guessed one.

**Key insight:** The subtle part is the dual role of the `<command-message>` branch: a slash command is NOT good intent text (never adopted as `intent`), but IS evidence of genuine user engagement (sets `K=true`). This lets one scan answer both "is there anything to background?" (`K`) and "what should the job be labelled?" (`intent`) while keeping noisy command/bash/tool-result wrappers out of the human-facing label. Note the asymmetry: **only** `<command-message>` sets `K`; the other four tagged kinds neither set `K` nor become intent.

### Deep analysis — name/nameSource resolution and its persistence semantics

**What it does:** Determines the forked job's display name and tags whether it was chosen by the user or auto-generated; this also feeds the later auto-naming of the background fork when no name could be seeded.

**How it works:** `name = v3(E$()) ?? HF(E$())` — `v3` returns `currentSessionTitle` (user-set title via `/rename`), `HF` returns `currentSessionAiTitle` (AI title). `nameSource` is `'user'` when the user title exists, else `'auto'` when only the AI title exists, else `undefined` (cli_inner_pretty.js:542758-542759). On the spawn side, `spawnBackgroundFork` (`zh8`) detects `H.name === void 0 && V.sessionId` (cli_inner_pretty.js:542724) and kicks off an async summarizer that calls `xjH(V.short, summary, 'auto')` (cli_inner_pretty.js:542727) to persist an auto title for the new fork — closing the loop ONLY when no name was seeded.

**Why this approach (corrected persistence semantics):** Distinguishing user vs auto title lets downstream UI/persistence respect a deliberate `/rename`. The persistence guard `xjH` (`persistSessionName`, cli_inner_pretty.js:184052-184067) is **deferential about `'auto'` writes** — its guard at cli_inner_pretty.js:184059 is `if (z.name === $ || (q === "auto" && z.name)) return !0;`, which skips writing whenever the **incoming** write is `'auto'` AND any stored name already exists. So an `'auto'` write **never overwrites** an existing name (user OR auto); it only fills in a name when none exists. This is consistent with `spawnBackgroundFork` gating the auto-summarizer on `H.name === void 0` (cli_inner_pretty.js:542724): the auto summary is persisted precisely when the seed produced no name. A non-`'auto'` (user) write is the only kind that can replace an existing differing name.

**Key insight:** `xjH`'s overwrite guard tests the **INCOMING** `nameSource` argument `q`, NOT the stored record's `nameSource` (`z.nameSource` is never read anywhere in `xjH`). Therefore an auto-generated title can only be set when no name is present yet; it cannot overwrite a prior name. The practical effect: `'auto'` writes are *write-once-if-empty*, while a user-sourced write is allowed to replace an existing differing name.

> The second consumer of `Ah8` is the bg-left-arrow path `WD9` (cli_inner_pretty.js:617885) which calls `Ah8(messages, "")` with an empty explicit prompt, then at cli_inner_pretty.js:617888 does `if (Y && !Y.name && A) ((Y.name = A), (Y.nameSource = 'auto'))`.

---

## 4. Confirmation UI (`gwz` / `BackgroundForkPrompt`)

```javascript
// ============================================
// BackgroundForkPrompt - confirm UI: inflight count, auto-confirm state, once-only fork effect, two render branches
// Location: cli_inner_pretty.js:542763-542873
// ============================================

// ORIGINAL (for source lookup, react-compiler memo-cache slots abbreviated):
function gwz(H) {
  let $ = fH9.c(27),
    { onDone: q, prompt: K, seed: _, messages: z, isMidTurn: A } = H,
    Y = D$(rwz), f = D$(iwz), O = D$(nwz), M = D$(lwz), j = D$(cwz), w = D$(dwz), D;
  if ($[0] !== w) ((D = hV8(w)), ($[0] = w), ($[1] = D)); else D = $[1];
  let J = D, [X, L] = u6$.useState(J.count === 0), P = u6$.useRef(!1), Z, W;
  if (/* deps changed */) {
    ((Z = () => {
      if (!X || P.current) return;
      ((P.current = !0), (async () => {
        let I = await zh8(_, K, Y, f, O, M, j, "command", z, { replyOnResume: A });
        if (I.ok)
          (d("tengu_background_fork", { confirmed: J.count > 0, inflight_count: J.count, mid_turn: A, had_prompt: K.length > 0, had_worktree: I.hadWorktree, worktree_handed_off: I.handedOff }),
            q(),
            await tK(0, "prompt_input_exit", { suppressResumeHint: !0, finalMessage: ny$(I.short, I.handedOff ? "(worktree handed off)" : void 0) }));
        else q(I.error);
      })());
    }), (W = [X, Y, f, O, M, j, J.count, A, _, q, K, z]));
  } else ((Z = $[14]), (W = $[15]));
  if ((u6$.useEffect(Z, W), X)) {
    let I;
    if ($[16] === Symbol.for("react.memo_cache_sentinel"))
      ((I = NAH.createElement(k, { dimColor: !0 }, "Backgrounding…")), ($[16] = I)); else I = $[16];
    return I;
  }
  let G;
  if ($[17] !== J.count || $[18] !== q)
    ((G = () => { (d("tengu_background_declined", { inflight_count: J.count }), q()); })); else G = $[19];
  let V = G, v = `${J.summary} running — the forked session won't carry live processes.`, E;
  if ($[20] === Symbol.for("react.memo_cache_sentinel")) ((E = () => L(!0)), ($[20] = E)); else E = $[20];
  let S;
  if ($[21] !== V)
    ((S = NAH.createElement(t9, { confirmLabel: "Background anyway (tasks will be abandoned)", cancelLabel: "Stay", onConfirm: E, onCancel: V }))); else S = $[22];
  let h;
  if ($[23] !== V || $[24] !== v || $[25] !== S)
    ((h = NAH.createElement(C8, { title: "Background this session?", subtitle: v, onCancel: V }, S))); else h = $[26];
  return h;
}

// READABLE (for understanding):
function BackgroundForkPrompt({ onDone, prompt, seed, messages, isMidTurn }) {
  // Read all spawn parameters from the app store
  const effort      = useStoreSelector(selectEffortValue);
  const permMode    = useStoreSelector(selectPermissionMode);
  const addDirs     = useStoreSelector(selectAdditionalWorkingDirectories);
  const allowRules  = useStoreSelector(selectAlwaysAllowRules);
  const denyRules   = useStoreSelector(selectAlwaysDenyRules);
  const tasks       = useStoreSelector(selectTasks);

  const inflight = countInflightTasks(tasks);                       // { count, kinds, summary }
  const [confirmed, setConfirmed] = useState(inflight.count === 0); // auto-confirm if idle
  const hasFired = useRef(false);                                   // once-only guard

  useEffect(() => {
    if (!confirmed || hasFired.current) return;
    hasFired.current = true;                                        // set synchronously BEFORE await
    (async () => {
      const r = await spawnBackgroundFork(
        seed, prompt, effort, permMode, addDirs, allowRules, denyRules,
        "command", messages, { replyOnResume: isMidTurn });
      if (r.ok) {
        emitTelemetry("tengu_background_fork", {
          confirmed: inflight.count > 0, inflight_count: inflight.count,
          mid_turn: isMidTurn, had_prompt: prompt.length > 0,
          had_worktree: r.hadWorktree, worktree_handed_off: r.handedOff });
        onDone();
        await exitPromptInput(0, "prompt_input_exit", {
          suppressResumeHint: true,
          finalMessage: formatBgHints(r.short, r.handedOff ? "(worktree handed off)" : undefined) });
      } else onDone(r.error);
    })();
  }, [confirmed, effort, permMode, addDirs, allowRules, denyRules, inflight.count, isMidTurn, seed, onDone, prompt, messages]);

  if (confirmed)
    return <InkText dimColor>Backgrounding…</InkText>;

  const decline = () => { emitTelemetry("tengu_background_declined", { inflight_count: inflight.count }); onDone(); };
  const subtitle = `${inflight.summary} running — the forked session won't carry live processes.`;
  return (
    <DialogBox title="Background this session?" subtitle={subtitle} onCancel={decline}>
      <ConfirmCancelChoice
        confirmLabel="Background anyway (tasks will be abandoned)"
        cancelLabel="Stay"
        onConfirm={() => setConfirmed(true)}
        onCancel={decline} />
    </DialogBox>
  );
}

// Mapping: gwz→BackgroundForkPrompt; H→props; q→onDone; K→prompt; _→seed; z→messages; A→isMidTurn; Y→effort(rwz); f→permMode(iwz); O→addDirs(nwz); M→allowRules(lwz); j→denyRules(cwz); w→tasks(dwz); D/J→inflight; X→confirmed; L→setConfirmed; P→hasFired; d→emitTelemetry; tK→exitPromptInput; ny$→formatBgHints; zh8→spawnBackgroundFork; D$→useStoreSelector; k→InkText; t9→ConfirmCancelChoice; C8→DialogBox; fH9.c(27)/$[i]→react-compiler memo cache (auto-memoization, ignore)
```

### The app-store selectors

All six are `D$` (`useStoreSelector`, cli_inner_pretty.js:170023-170030) — an app-store selector hook built on React `useSyncExternalStore` that reads `getState()`/`subscribe` from the context-backed app store (`nJ6`, cli_inner_pretty.js:170018, which does `useContext(rdH)`) and returns `selector(state)`:
- `rwz` (`selectEffortValue`, cli_inner_pretty.js:542889-542891) — `state.effortValue`.
- `iwz` (`selectPermissionMode`, cli_inner_pretty.js:542886-542888) — `state.toolPermissionContext.mode`.
- `nwz` (`selectAdditionalWorkingDirectories`, cli_inner_pretty.js:542883-542885) — `state.toolPermissionContext.additionalWorkingDirectories`.
- `lwz` (`selectAlwaysAllowRules`, cli_inner_pretty.js:542880-542882) — `state.toolPermissionContext.alwaysAllowRules`.
- `cwz` (`selectAlwaysDenyRules`, cli_inner_pretty.js:542877-542879) — `state.toolPermissionContext.alwaysDenyRules`.
- `dwz` (`selectTasks`, cli_inner_pretty.js:542874-542876) — `state.tasks`.

### The inflight counter (`hV8`)

```javascript
// ============================================
// countInflightTasks - count + summarize all in-flight work the fork will NOT inherit
// Location: cli_inner_pretty.js:457394-457402
// ============================================

// ORIGINAL (for source lookup):
function hV8(H) {
  let $ = cv4(H),
    q = yV8(),
    K = $.length + q.length,
    _ = aq($.map((A) => A.type));
  if (q.length > 0) _.push("session_cron");
  let z = [ReH($), q.length ? `${q.length} ${N8(q.length, "loop")}` : ""];
  return { count: K, kinds: _, summary: z.filter(Boolean).join(", ") };
}

// READABLE (for understanding):
function countInflightTasks(tasksMap) {
  const sessionTasks = getInflightSessionTasks(tasksMap);   // active local/session tasks (excl. remote_agent)
  const cronTasks    = getScheduledCronTasks();             // scheduled/cron descriptors
  const count = sessionTasks.length + cronTasks.length;
  const kinds = unique(sessionTasks.map(t => t.type));      // aq = dedupe
  if (cronTasks.length > 0) kinds.push("session_cron");
  const parts = [
    summarizeInflightTasks(sessionTasks),                   // e.g. "2 shells, 1 cloud session"
    cronTasks.length ? `${cronTasks.length} ${pluralize(cronTasks.length, "loop")}` : "",
  ];
  return { count, kinds, summary: parts.filter(Boolean).join(", ") };
}

// Mapping: hV8→countInflightTasks; H→tasksMap; cv4→getInflightSessionTasks; yV8→getScheduledCronTasks; aq→unique/dedupe; ReH→summarizeInflightTasks; N8→pluralize; $→sessionTasks; q→cronTasks; K→count; _→kinds; z→parts
```

- `cv4` (`getInflightSessionTasks`, cli_inner_pretty.js:457384-457386) — `Object.values(H).filter(($)=>uL($)&&$.type!=="remote_agent")`. Crucially **excludes `remote_agent`** (those run server-side and survive the fork).
- `yV8` (`getScheduledCronTasks`, cli_inner_pretty.js:457362-457366) — scheduled task descriptors from `WG()`, counted as `session_cron`.
- `ReH` (`summarizeInflightTasks`, cli_inner_pretty.js:393095-393139) — human summary ("2 shells", "1 cloud session", "1 monitor", "1 team", "1 local agent", or N "background tasks" for mixed).
- `aq` (`unique`, cli_inner_pretty.js:40716-40718) — Set-based dedupe; `N8` (`pluralize`, cli_inner_pretty.js:9655-9657).

### The banner (`ny$`)

```javascript
// ============================================
// formatBgHints - the final exit banner: "backgrounded · <short>" + 4 left-padded CLI hint lines
// Location: cli_inner_pretty.js:542079-542089
// ============================================

// ORIGINAL (for source lookup):
function ny$(H, $, q) {
  let K = (_, z) => J$.dim("  " + _.padEnd(26) + z);
  return [
    `backgrounded \xB7 ${J$.cyan(H)}${q ? ` \xB7 ${q}` : ""}${$ ? J$.dim(` ${$}`) : ""}`,
    K("claude agents", "list sessions"),
    K(`claude attach ${H}`, "open in this terminal"),
    K(`claude logs ${H}`, "show recent output"),
    K(`claude stop ${H}`, "stop this session"),
  ].join(`\n`);
}

// READABLE (for understanding):
function formatBgHints(shortId, suffix, prefixNote) {
  const hintLine = (cmd, desc) => style.dim("  " + cmd.padEnd(26) + desc);
  return [
    `backgrounded · ${style.cyan(shortId)}` +
      (prefixNote ? ` · ${prefixNote}` : "") +
      (suffix ? style.dim(` ${suffix}`) : ""),
    hintLine("claude agents",            "list sessions"),
    hintLine(`claude attach ${shortId}`, "open in this terminal"),
    hintLine(`claude logs ${shortId}`,   "show recent output"),
    hintLine(`claude stop ${shortId}`,   "stop this session"),
  ].join("\n");
}

// Mapping: ny$→formatBgHints; H→shortId; $→suffix; q→prefixNote; K→hintLine; J$→style(dim/cyan); padEnd(26)→column alignment
```

`ny$` takes THREE params (`H`=short, `$`=suffix, `q`=prefixNote). `BackgroundForkPrompt` calls `ny$(I.short, I.handedOff ? "(worktree handed off)" : void 0)` (cli_inner_pretty.js:542811) — so the handed-off note is the SECOND param (`suffix`, rendered dim AFTER the short id) and the 3rd param (`prefixNote`, rendered between short and suffix) is **unused** by this caller.

### Deep analysis — auto-confirm-when-idle vs confirm-when-busy

**What it does:** Decides whether to background the session silently or interrupt with a confirmation dialog, based on whether any local work is currently in flight.

**How it works:** On mount the component computes `inflight = countInflightTasks(tasks)` and seeds React state with `useState(inflight.count === 0)` (cli_inner_pretty.js:542776). If count is 0 (nothing running), `confirmed` starts true, so the first render skips the dialog, renders only the dim "Backgrounding…" text (cli_inner_pretty.js:542835), and the effect immediately fires the fork. If count > 0, `confirmed` starts false, so it renders `DialogBox` + `ConfirmCancelChoice` (cli_inner_pretty.js:542855-542866) and waits. Clicking "Background anyway" runs `setConfirmed(true)` (`E = ()=>L(!0)`, cli_inner_pretty.js:542851), re-rendering with `confirmed=true` so the same effect fires the fork.

**Why this approach:** Backgrounding an idle session is reversible (`claude attach`), so prompting would be friction — optimize for the common case. Prompting only when there is live work converts an irreversible side effect (abandoning running processes) into an explicit choice. The same effect/fork path serves both branches because both gate on `confirmed`, avoiding duplicated spawn logic.

**Key insight:** The single boolean `confirmed` is both the auto-confirm signal AND the post-dialog confirm signal. `useState`'s initializer (`count===0`) folds the "idle ⇒ skip dialog" policy into ordinary React state, so there is one fork code path with two entry conditions.

### Deep analysis — why in-flight tasks are "abandoned"

**What it does:** Warns that backgrounding a busy session will not carry its live processes into the forked session, and labels the confirm button "Background anyway (tasks will be abandoned)".

**How it works:** `spawnBackgroundFork` re-launches via `ol()` with `--resume <id> --fork-session` (cli_inner_pretty.js:542697). A fork-session resumes the conversation *transcript* as a new sibling session; it does not inherit the parent process's live OS state — running shells (`local_bash`), monitors, MCP tasks, local agents, cron loops live in the current process and cannot be serialized. `countInflightTasks` enumerates exactly those non-transferable kinds (`cv4` = active session tasks excluding `remote_agent`, cli_inner_pretty.js:457385; `yV8` = scheduled/cron descriptors, cli_inner_pretty.js:457364), and `ReH` renders the human summary used in the subtitle `"<X> running — the forked session won't carry live processes."` (cli_inner_pretty.js:542849).

**Why this approach:** Remote tasks (`remote_agent`) are explicitly excluded from `cv4` (cli_inner_pretty.js:457385) because they run server-side and survive the fork — only local live work is at risk, so only that is counted and warned about. Surfacing the concrete summary lets the user judge whether the running work matters.

**Key insight:** The abandonment is an inherent consequence of fork-via-resume: a transcript can be resumed but a running process tree cannot. Worktrees ARE handed off (`W = Boolean(Z && !Z.enteredExisting)`, cli_inner_pretty.js:542692; `handedOff` in the result, cli_inner_pretty.js:542731), which is why that case gets its own "(worktree handed off)" banner note instead of an abandonment warning.

### Deep analysis — the once-only `P.current` fork guard

**What it does:** Ensures `spawnBackgroundFork` is invoked at most once per component lifetime, even though the firing effect can re-run.

**How it works:** `hasFired = useRef(false)` (`P`, cli_inner_pretty.js:542777). The effect body (cli_inner_pretty.js:542794-542814) begins with `if (!confirmed || hasFired.current) return;` then immediately sets `hasFired.current = true` before the async IIFE. A ref is mutable and persists across renders without triggering a render, so the second guard short-circuits later effect invocations. The dependency array (cli_inner_pretty.js:542816) includes `confirmed`, all selector values, `inflight.count`, `isMidTurn`, `seed`, `onDone`, `prompt`, `messages` — any of which could re-run the effect.

**Why this approach:** `spawnBackgroundFork` has irreversible side effects: it spawns a detached child, emits telemetry, and tears down the session via `exitPromptInput`. Firing twice would double-spawn and double-exit. A `useRef` boolean is the standard React idiom for "run an effect exactly once regardless of re-runs" — preferable to an empty dependency array because the effect needs fresh prop/state values when it fires.

**Key insight:** The guard is set synchronously (`hasFired.current = true`) BEFORE awaiting the async spawn (cli_inner_pretty.js:542796), closing the race where a dependency change re-enters the effect while the first spawn is still pending.

> Component primitives: `t9` (`ConfirmCancelChoice`, cli_inner_pretty.js:281923-281955) renders a two-option selector (default labels "Yes"/"No"); `C8` (`DialogBox`, cli_inner_pretty.js:183009) a titled bordered box; `k` (`InkText`, cli_inner_pretty.js:168283) the Ink Text primitive used for "Backgrounding…". The `decline` callback (`G`/`V`) emits `tengu_background_declined {inflight_count}` (cli_inner_pretty.js:542842); `onConfirm` sets `L(true)` (cli_inner_pretty.js:542851); `onCancel = decline` (cli_inner_pretty.js:542859).

---

## 5. The fork/handoff (`zh8` / `spawnBackgroundFork`)

```javascript
// ============================================
// spawnBackgroundFork - full argv builder + worktree handoff + async auto-naming over the ol dispatcher
// Location: cli_inner_pretty.js:542680-542732
// ============================================

// ORIGINAL (for source lookup):
async function zh8(H, $, q, K, _, z, A, Y, f, O) {
  let M = ik(),
    j = typeof q === "string" ? q : void 0,
    w = Array.from(_.values()).filter((v) => v.source === "session").map((v) => v.path),
    D = z.session ?? [],
    J = A.session ?? [],
    X = D.length > 0 || J.length > 0 ? { allow: [...D], deny: [...J] } : void 0,
    L = z.cliArg ?? [],
    P = A.cliArg ?? [],
    Z = sY(),
    W = Boolean(Z && !Z.enteredExisting),
    G = Rqq();
  await n_(R0(), 2000, "flush timeout").catch(() => {});
  let V = await ol(
    [
      ...(G !== null ? ["--resume", G, "--fork-session"] : []),
      ...(O?.replyOnResume ? ["--reply-on-resume"] : []),
      ...G7$(),
      ...w.flatMap((v) => ["--add-dir", v]),
      ...L.flatMap((v) => ["--allowed-tools", v]),
      ...P.flatMap((v) => ["--disallowed-tools", v]),
      ...(M ? ["--model", M] : []),
      ...(j ? ["--effort", j] : []),
      "--permission-mode",
      K,
      ...($ ? ["--", $] : []),
    ],
    O?.providedSessionId,
    "repl",
    Z?.worktreePath ?? f6(),
    {
      ...H,
      worktree: W ? { path: Z.worktreePath, branch: Z.worktreeBranch, hookBased: Z.hookBased ?? !1, originCwd: Z.originalCwd } : void 0,
      sessionPermissionRules: X,
      memoryToggledOff: XR() || void 0,
    },
    O?.extraEnv,
  ).catch((v) => ({ ok: !1, error: `Couldn't background — ${TH(v)}` }));
  if (!V.ok) return (d("tengu_background_spawn_failed", {}), { ok: !1, error: V.error });
  if ((d("tengu_background", { via_flag: !1, via: Y }), Z)) (BL$(null), iNH());
  if (H.name === void 0 && V.sessionId) {
    let v = V.short,
      E = V8$(nf([...f]), AbortSignal.timeout(Qwz)).then((S) => (S ? xjH(v, S, "auto") : void 0)).catch(() => {});
    if (Y === "command") $7(() => E);
  }
  return { ok: !0, short: V.short, handedOff: W, hadWorktree: Z !== null };
}

// READABLE (for understanding):
async function spawnBackgroundFork(extraOpts, prompt, effort, permissionMode, addDirsMap, allowRules, denyRules, viaSource, messages, opts) {
  let modelOverride = getMainLoopModelOverride(),                         // ik() — model is INTERNAL, not a param
    effortStr = typeof effort === "string" ? effort : undefined,
    sessionAddDirs = Array.from(addDirsMap.values()).filter((d) => d.source === "session").map((d) => d.path),
    sessionAllow = allowRules.session ?? [],
    sessionDeny = denyRules.session ?? [],
    sessionPermissionRules = (sessionAllow.length || sessionDeny.length) ? { allow: [...sessionAllow], deny: [...sessionDeny] } : undefined,
    cliArgAllow = allowRules.cliArg ?? [],
    cliArgDeny = denyRules.cliArg ?? [],
    worktree = getCurrentWorktreeSession(),
    handOffWorktree = Boolean(worktree && !worktree.enteredExisting),     // only hand off worktrees WE created
    resumeSessionId = getCurrentSessionFile();
  await withTimeout(flushSessionStorage(), 2000, "flush timeout").catch(() => {}); // best-effort flush, capped 2s
  let result = await spawnBgSession(
    [
      ...(resumeSessionId !== null ? ["--resume", resumeSessionId, "--fork-session"] : []), // fork => new id, foreground transcript untouched
      ...(opts?.replyOnResume ? ["--reply-on-resume"] : []),                                 // mid-turn => continue in-flight turn
      ...getReplConfigArgv(),                                                                 // propagate original REPL launch flags
      ...sessionAddDirs.flatMap((d) => ["--add-dir", d]),
      ...cliArgAllow.flatMap((r) => ["--allowed-tools", r]),
      ...cliArgDeny.flatMap((r) => ["--disallowed-tools", r]),
      ...(modelOverride ? ["--model", modelOverride] : []),
      ...(effortStr ? ["--effort", effortStr] : []),
      "--permission-mode", permissionMode,
      ...(prompt ? ["--", prompt] : []),                                                      // trailing positional prompt
    ],
    opts?.providedSessionId,                     // ol param #2 ($) providedSessionId
    "repl",                                      // ol param #3 (q) source tag
    worktree?.worktreePath ?? getOriginalCwd(),  // ol param #4 (K) cwd
    {                                            // ol param #5 (_) opts
      ...extraOpts,
      worktree: handOffWorktree ? { path: worktree.worktreePath, branch: worktree.worktreeBranch, hookBased: worktree.hookBased ?? false, originCwd: worktree.originalCwd } : undefined,
      sessionPermissionRules,
      memoryToggledOff: getMemoryToggledOff() || undefined,
    },
    opts?.extraEnv,                              // ol param #6 (z) extraEnv
  ).catch((e) => ({ ok: false, error: `Couldn't background — ${formatError(e)}` }));
  if (!result.ok) { telemetry("tengu_background_spawn_failed", {}); return { ok: false, error: result.error }; }
  telemetry("tengu_background", { via_flag: false, via: viaSource });
  if (worktree) { setCurrentWorktreeSession(null); clearWorktreeOwnershipName(); } // release ownership; worker owns it now
  if (extraOpts.name === undefined && result.sessionId) {                          // no explicit name => auto-name async
    let short = result.short,
      namingTask = generateSessionName(trimToFirstRelevantMessage([...messages]), AbortSignal.timeout(AUTO_NAME_TIMEOUT_MS))
        .then((name) => name ? setSessionName(short, name, "auto") : undefined)
        .catch(() => {});
    if (viaSource === "command") registerBackgroundPromise(() => namingTask); // keep alive past command exit
  }
  return { ok: true, short: result.short, handedOff: handOffWorktree, hadWorktree: worktree !== null };
}

// Mapping: zh8→spawnBackgroundFork; params H→extraOpts, $→prompt, q→effort, K→permissionMode, _→addDirsMap, z→allowRules, A→denyRules, Y→viaSource, f→messages, O→opts; M→modelOverride, j→effortStr, w→sessionAddDirs, X→sessionPermissionRules, Z→worktree, W→handOffWorktree, G→resumeSessionId, V→result; ik→getMainLoopModelOverride, sY→getCurrentWorktreeSession, Rqq→getCurrentSessionFile, R0→flushSessionStorage, n_→withTimeout, ol→spawnBgSession, G7$→getReplConfigArgv, f6→getOriginalCwd, XR→getMemoryToggledOff, BL$→setCurrentWorktreeSession, iNH→clearWorktreeOwnershipName, V8$→generateSessionName, nf→trimToFirstRelevantMessage, xjH→setSessionName/persistSessionName, $7→registerBackgroundPromise, TH→formatError, Qwz→AUTO_NAME_TIMEOUT_MS, d→telemetry. Model is INTERNAL via ik() (542681), NOT a parameter.
```

### Call-site param-order proof

`BackgroundForkPrompt` invokes `zh8(_, K, Y, f, O, M, j, "command", z, { replyOnResume: A })` at cli_inner_pretty.js:542798. Mapped against the def signature `zh8(H,$,q,K,_,z,A,Y,f,O)` (cli_inner_pretty.js:542680) and the `gwz` selector bindings (cli_inner_pretty.js:542874-542890):

| call arg | gwz local | selector | zh8 param | becomes |
|----------|-----------|----------|-----------|---------|
| 1 `_` | seed | (prop) | `H` extraOpts | `{...H}` opts + `H.name` gate |
| 2 `K` | prompt | (prop) | `$` prompt | `-- <prompt>` |
| 3 `Y` | effortValue | `rwz` | `q` effort | `--effort` |
| 4 `f` | mode | `iwz` | `K` permissionMode | `--permission-mode` |
| 5 `O` | additionalWorkingDirectories | `nwz` | `_` addDirsMap | `--add-dir` |
| 6 `M` | alwaysAllowRules | `lwz` | `z` allowRules | allow rules |
| 7 `j` | alwaysDenyRules | `cwz` | `A` denyRules | deny rules |
| 8 `"command"` | — | — | `Y` viaSource | telemetry `via` |
| 9 `z` | messages | (prop) | `f` messages | auto-name source |
| 10 `{replyOnResume:A}` | isMidTurn | (prop) | `O` opts | `--reply-on-resume` |

*(The above is a call-mapping aid in this prose, not a symbol-mapping table.)* Note `gwz`'s outer `Y` is **effortValue**, not permissionMode — and the **model is fetched internally** via `ik()` (cli_inner_pretty.js:542681), it is NOT a parameter. Beware the name clash: `zh8`'s *body* param `Y` is the `viaSource` (`"command"`), a different binding from `gwz`'s outer `Y`.

### Allowed-flag sets

Two `Set`s gate which CLI flags may propagate into the worker:

```javascript
// ============================================
// BG flag allowlists - value-taking (hqq) and boolean (pwz) flags allowed into the bg worker
// Location: cli_inner_pretty.js:542624-542676
// ============================================

// ORIGINAL (for source lookup):
hqq = new Set([
  "--exec","--model","-m","--permission-mode","--agent","--agents","--routine","--effort","--add-dir","--mcp-config","--settings","--setting-sources","--system-prompt","--system-prompt-file","--append-system-prompt","--append-system-prompt-file","--fallback-model","--advisor","--channels","--permission-prompt-tool","--allowed-tools","--allowedTools","--disallowed-tools","--disallowedTools","--tools","--session-id","--debug-file","-n","--name","--autocompact","--betas","--file","--max-budget-usd","--max-thinking-tokens","--max-turns","--task-budget","--plan-mode-instructions","--plugin-dir","--plugin-url","--resume-session-at","--rewind-files","--thinking","--thinking-display"
]);
pwz = new Set([
  "--dangerously-skip-permissions","--allow-dangerously-skip-permissions","--strict-mcp-config","--dangerously-allow-browser-network-access","--disable-slash-commands","--reply-on-resume"
]);

// READABLE (for understanding):
// value-taking flags allowed to propagate (each consumes the next argv token)
const BG_VALUE_FLAGS_ALLOWLIST = new Set([ /* --model, --effort, --add-dir, --allowed-tools, ... 41 entries */ ]);
// boolean (no-value) flags allowed to propagate
const BG_BOOLEAN_FLAGS_ALLOWLIST = new Set([
  "--dangerously-skip-permissions","--allow-dangerously-skip-permissions","--strict-mcp-config",
  "--dangerously-allow-browser-network-access","--disable-slash-commands","--reply-on-resume",
]);

// Mapping: hqq→BG_VALUE_FLAGS_ALLOWLIST, pwz→BG_BOOLEAN_FLAGS_ALLOWLIST
```

The NEW `--reply-on-resume` lives in the **boolean** set `pwz` (cli_inner_pretty.js:542675), consistent with `{ replyOnResume: isMidTurn }` propagating as a value-less flag. Forward-declared at cli_inner_pretty.js:542587 (`hqq`) / 542588 (`pwz`).

### Deep analysis — resume + fork-session vs a fresh session

**What it does:** Instead of spawning a brand-new empty worker, `zh8` hands the worker the CURRENT session id via `--resume <G>` AND adds `--fork-session` (cli_inner_pretty.js:542697), but only when `G = getCurrentSessionFile()` is non-null.

**How it works:** `G = Rqq()` reads `p1().sessionFile` (the live foreground session id, cli_inner_pretty.js:546274-546276). Before forking, `R0() = flushSessionStorage()` (`await p1().flush()`, cli_inner_pretty.js:546886-546888) is awaited inside `withTimeout n_(...,2000,...)` with a `.catch` swallow (cli_inner_pretty.js:542694) so the on-disk transcript is current but the UI never hangs >2s. The worker resumes that transcript but, because `--fork-session` is set, the inner spawner (`ywz`) assigns a NEW session id, so the worker reads the full prior context but writes to a different session file.

**Why this approach:** A fresh session would lose all prior conversation context — the whole point of `/background` is to continue the SAME work without the terminal. Forking (new id) rather than truly resuming (same id) prevents the detached worker and the (possibly still-open) foreground from racing to mutate one transcript file. The 2s-capped flush is a deliberate trade-off: correctness of handed-off context vs. not hanging the UI if flush stalls.

**Key insight:** fork-session = "clone the context, sever the file identity." Resume gives continuity; fork gives isolation. The foreground transcript is read-only from the worker's perspective, so the user's visible history is never corrupted by the backgrounded copy.

### Deep analysis — mid-turn `--reply-on-resume`

**What it does:** When `opts.replyOnResume` is set (session backgrounded MID assistant turn), `zh8` injects `--reply-on-resume` into worker argv (cli_inner_pretty.js:542698).

**How it works:** The call site passes `{ replyOnResume: A }` where `A = isMidTurn` (destructured at cli_inner_pretty.js:542765, passed at cli_inner_pretty.js:542798). `--reply-on-resume` is a member of the BOOLEAN allowlist `pwz` (cli_inner_pretty.js:542675), so it propagates as a flag with no value. On the worker side, after resuming the forked transcript, this flag tells the new process to immediately CONTINUE the in-flight assistant turn rather than waiting for new user input.

**Why this approach:** If you background mid-generation, the last transcript message is an incomplete assistant turn; a plain resume would sit idle at a prompt. `reply-on-resume` makes the worker pick up where generation left off. It is gated on `isMidTurn` so backgrounding at an idle prompt does NOT spuriously fire a reply.

**Key insight:** The flag encodes a state-machine hint across the process boundary: "the transcript ends on a turn you must finish, not on a prompt you should wait at."

### Deep analysis — worktree handoff semantics

**What it does:** If the current session owns a git worktree it created, `zh8` transfers ownership to the worker and steps out of it locally.

**How it works:** `Z = sY() = getCurrentWorktreeSession()` returns module-global `mL$` (cli_inner_pretty.js:542691; `sY` at cli_inner_pretty.js:239369-239371). `W = Boolean(Z && !Z.enteredExisting)` (cli_inner_pretty.js:542692) — handoff happens ONLY for worktrees this process created, NOT pre-existing worktrees merely "entered" (the entered shape sets `enteredExisting:!0` at cli_inner_pretty.js:555000, object literal cli_inner_pretty.js:554994-555001; persisted shape cli_inner_pretty.js:547630-547642 with `enteredExisting` at cli_inner_pretty.js:547641). The worker cwd becomes `Z.worktreePath ?? getOriginalCwd()` (cli_inner_pretty.js:542711). The `opts.worktree` object `{path,branch,hookBased,originCwd}` is passed (cli_inner_pretty.js:542715) so the inner spawner can record ownership. After a successful spawn, if `Z` existed `zh8` calls `BL$(null) = setCurrentWorktreeSession(null)` + `iNH() = clearWorktreeOwnershipName()` (cli_inner_pretty.js:542723) so THIS process no longer claims the worktree (`BL$` clears `mL$`, cli_inner_pretty.js:239372-239374; `iNH` clears `Wv6`, cli_inner_pretty.js:239379-239381). The result reports `handedOff:W` and `hadWorktree:(Z!==null)`.

**Why this approach:** Two processes cannot both own/cleanup the same git worktree without conflicts. Ownership must be exactly transferred, not shared. The `enteredExisting` guard avoids hijacking a worktree the user pre-owned. Releasing locally prevents the foreground's shutdown handlers from deleting a worktree the worker now depends on.

**Key insight:** Worktree ownership is a single-writer resource with explicit transfer. The created-by-us vs entered-existing distinction is the crux: you can only give away what you own. The transfer is also transactional — the worker is spawned with the worktree descriptor first, and only after spawn success does the foreground release it, so there is never a window where neither process owns it.

### Deep analysis — async auto-naming (fire-and-forget with drain registration)

**What it does:** If no explicit name was given, `zh8` launches an LLM call AFTER the worker is spawned to generate a descriptive session name, then writes it to the new session record.

**How it works:** Guard: `H.name === undefined && V.sessionId` (cli_inner_pretty.js:542724). It builds `namingTask = V8$(nf([...f]), AbortSignal.timeout(Qwz))` where `Qwz = 3000` (cli_inner_pretty.js:542913) and `nf = trimToFirstRelevantMessage` (cli_inner_pretty.js:446021-446024, signature `nf(H,$)` with the second param unused). `V8$ = generateSessionName` (cli_inner_pretty.js:494196-494235) runs a `json_schema {name:string}` LLM summarization, querySource `'rename_generate_name'`, instructing kebab-case 2–4-word names (system prompt `pu4` at cli_inner_pretty.js:494236). On a non-null name it calls `xjH(v, name, 'auto') = persistSessionName` (cli_inner_pretty.js:542727; 184052), which no-ops if the record already has a name (the auto-mode guard at cli_inner_pretty.js:184059). The spawn does NOT await this — but when `viaSource === 'command'` it calls `$7(()=>E) = registerBackgroundPromise` (cli_inner_pretty.js:542729; 3455-3457) so the drainable registry `qfq` (drained by `SxH` at cli_inner_pretty.js:3458) keeps it alive past command exit.

**Why this approach:** Naming requires an LLM round-trip that would add latency to the user-facing action; doing it after spawn keeps the handoff snappy. The 3s timeout bounds cost; the `.catch(()=>{})` makes it best-effort. `registerBackgroundPromise` is the subtle correctness fix: in the `/command` flow the CLI may exit right after backgrounding, so the naming promise must be registered in a drainable registry or it would be killed before completing.

**Key insight:** Latency hiding via deferred work, made safe by (a) a hard 3s timeout, (b) an idempotent `'auto'` write that won't clobber a user name, and (c) registry-based keep-alive so the fire-and-forget task survives process exit in the command path.

### Deep analysis — the `ol`/`spawnBgSession` parameter contract

**What it does:** The unified background-session dispatcher both `zh8` (REPL/command) and the `--bg` flag path call.

**How it works:** Confirmed signature `ol(H, $, q='shell', K, _, z, A)` at cli_inner_pretty.js:541769: `H`=argv, `$`=providedSessionId, `q`=source (`'shell'`/`'repl'`/`'fleet'`/`'spare'`), `K`=**cwd** (#4), `_`=**opts** (#5), `z`=extraEnv (#6). `zh8` passes positionally: [1] the built argv, [2] `opts?.providedSessionId`, [3] `"repl"`, [4] `worktreePath ?? cwd`, [5] the opts object `{...extraOpts, worktree, sessionPermissionRules, memoryToggledOff}`, [6] `opts?.extraEnv`. `ol` generates `sessionId f = $ ?? randomUUID` (cli_inner_pretty.js:541772), `short O = A ?? f.slice(0,8)` (cli_inner_pretty.js:541773), `jobDir M = m9(O)` (cli_inner_pretty.js:541774), then delegates to `ywz(H, q, K, _, z, {sessionId,short,jobDir,freshDir})` (cli_inner_pretty.js:541778). **Slot shift:** `ol`'s opts (param #5, `_`) becomes `ywz`'s 4th param `K`, which is why `ywz` reads opts as `K?.worktree` / `K?.sessionPermissionRules` / `K?.memoryToggledOff` (cli_inner_pretty.js:541810-541813, 541853-541856, 541895). `ywz` (`launchBgSessionInner`, cli_inner_pretty.js:541789+) splits argv at `--` (cli_inner_pretty.js:541791), detects `--resume`/`-r`/`--continue` (cli_inner_pretty.js:541799-541807) and `--fork-session` (cli_inner_pretty.js:541808), records the worktree `ownershipToken` (cli_inner_pretty.js:541895), and launches the detached process.

**Why this approach:** Centralizing spawn logic in `ol` means the REPL `/background` path and the CLI `--bg` flag path share identical session-creation, jobDir, and worktree-ownership semantics. Only the source tag (`'repl'` vs `'shell'`) and argv assembly differ.

**Key insight:** `zh8` is purely an argv+opts ASSEMBLER on top of the generic dispatcher; all OS-level spawning, id generation, and ownership-token bookkeeping live in `ol`/`ywz`, so `/background` stays a thin policy layer. (`ol` is documented in depth in `unified_dispatcher_ol.md`.)

> Supporting symbols (all behavioral inferences unless marked ground-truth): `ik` (`getMainLoopModelOverride`, ground-truth export, cli_inner_pretty.js:2580-2582), `f6` (`getOriginalCwd`, cli_inner_pretty.js:2386-2388), `XR` (`getMemoryToggledOff`, ground-truth export, cli_inner_pretty.js:2799-2801), `G7$` (`getReplConfigArgv`, ground-truth export, cli_inner_pretty.js:2589-2591), `Rqq` (`getCurrentSessionFile`, ground-truth export, cli_inner_pretty.js:546274-546276), `R0` (`flushSessionStorage`, ground-truth export, cli_inner_pretty.js:546886-546888), `sY` (`getCurrentWorktreeSession`, ground-truth export, cli_inner_pretty.js:239369-239371), `n_` (`withTimeout`, cli_inner_pretty.js:101168-101176; reject helper `Fu1` at 101165-101167), `TH` (`formatError`, cli_inner_pretty.js:8466-8468), `Qwz` (`AUTO_NAME_TIMEOUT_MS = 3000`, cli_inner_pretty.js:542913), `Vqq` (`MAX_PIPED_STDIN_BYTES = 1048576`, cli_inner_pretty.js:542586 — sibling const, NOT used in `zh8`), `ee4` (`BG_FLAG_ALIASES = ['--bg','--background']`, cli_inner_pretty.js:542622).

---

## 6. Related commands (`/stop`, `/fork`) — the bg-session lifecycle family

`/background`, `/fork`, and `/stop` form the lifecycle of background agent sessions, living in one source region (cli_inner_pretty.js:542936-543052). Their subjects differ: `/background` and `/stop` act on THIS session (detach-self, then later stop-self), while `/fork` creates a DIFFERENT session that branches off the current conversation.

### `/stop` — terminate this background session

`/stop` has two variants sharing a common core `Yh8` (`stopSelfSession`, cli_inner_pretty.js:542955-542976), both gated `isEnabled: v7` so the command **only appears inside a backgrounded session**.

```javascript
// ============================================
// stopSelfSession - core /stop logic: telemetry, terminal-state-guarded "stopped" write, banner, graceful exit
// Location: cli_inner_pretty.js:542955-542976
// ============================================

// ORIGINAL (for source lookup):
async function Yh8(H) {
  d("tengu_bg_agent_action", { action: "stop", source: H, jobSessionId: E$() });
  let $ = swz();
  if (v7() && $) {
    let q = new Date().toISOString(),
      K = await a7($);
    if (K && !_J(K))
      await qA($, {
        ...K, state: "stopped", detail: "stopped from session", tempo: "idle",
        needs: void 0, block: void 0, inFlight: void 0,
        updatedAt: q, firstTerminalAt: K.firstTerminalAt ?? q,
      }).catch(hH);
    if (Ao$()) process.stdout.write(yqH("Session stopped."));
  }
  return (SH("job_stop_self"), tK(0, "prompt_input_exit", { suppressResumeHint: !0 }));
}

// READABLE (for understanding):
async function stopSelfSession(source) {
  emitTelemetry("tengu_bg_agent_action", {            // "stop_command" | "bridge" (also "cli"/"fleet" from other callers)
    action: "stop", source, jobSessionId: getCurrentSessionId(),
  });
  const jobDir = currentJobDir();                     // process.env.CLAUDE_JOB_DIR
  if (isBackgroundSession() && jobDir) {
    const now = new Date().toISOString();
    const state = await readJobState(jobDir);
    if (state && !isStateSettled(state)) {            // don't clobber an already-finished job
      await writeJobState(jobDir, {
        ...state, state: "stopped", detail: "stopped from session", tempo: "idle",
        needs: undefined, block: undefined, inFlight: undefined,   // scrub transient flags
        updatedAt: now, firstTerminalAt: state.firstTerminalAt ?? now,
      }).catch(swallowError);
    }
    if (isDaemonBackend()) process.stdout.write(formatBgBanner("Session stopped."));
  }
  emitFeatureOk("job_stop_self");
  return shutdownAndExit(0, "prompt_input_exit", { suppressResumeHint: true });
}

// Mapping: Yh8→stopSelfSession, H→source, $→jobDir, q→now, K→state; d→emitTelemetry, E$→getCurrentSessionId, swz→currentJobDir, v7→isBackgroundSession, a7→readJobState, _J→isStateSettled, qA→writeJobState, hH→swallowError, Ao$→isDaemonBackend, yqH→formatBgBanner, SH→emitFeatureOk, tK→shutdownAndExit
```

The two variants: the interactive `local-jsx` form `HDz` (`stopCommandDef_interactive`, cli_inner_pretty.js:543008-543015, `immediate:true`) routes to `twz` (`stopCommandCall_interactive`, cli_inner_pretty.js:542989-542991) which calls `H()` then `Yh8("stop_command")` and returns `null`; the non-interactive `local` form `$Dz` (`stopCommandDef_nonInteractive`, cli_inner_pretty.js:543016-543023, `supportsNonInteractive:true`) routes to `ewz` (`stopCommandCall_bridge`, cli_inner_pretty.js:542997-542999) which calls `Yh8("bridge")` and returns `{type:'skip'}`. The default export `qDz` (`stopCommandDefault`, cli_inner_pretty.js:543024) aliases the interactive variant (`qDz = HDz`). Both converge on the same `stopSelfSession` core; only the wrapper (UI flush + return shape + telemetry `source`) differs.

**Terminal-state guard:** `_J` (`isStateSettled`, cli_inner_pretty.js:184283-184285) = `Nv(state.state) && state.tempo !== 'active'`; `Nv` (`isTerminalState`, cli_inner_pretty.js:184280-184282) wraps `evH` (`terminalStateToOutcome`, cli_inner_pretty.js:184274-184279) which maps `done→success`, `failed→failure`, `stopped→stopped`, else null. A job already done/failed/stopped (and not active) is left untouched. The write goes through `qA` (`writeJobState`, cli_inner_pretty.js:183931-183939) which is atomic (tmp-file + rename via `QO`); `a7` (`readJobState`, cli_inner_pretty.js:183950-184008) reads `state.json` (`QL6`, cli_inner_pretty.js:184311) with an mtime-keyed cache. The `.catch(hH)` on the write (`hH` = `swallowError`, cli_inner_pretty.js:41853) ensures a failed state-write never blocks the subsequent `tK` exit.

### `/fork` — spawn a conversation-inheriting subagent

`/fork` is gated `isEnabled: oT` (`isForkExperimentEnabled`, cli_inner_pretty.js:216788-216790) = `Q57() !== 'disabled'`. `Q57` (`getForkExperimentSource`, cli_inner_pretty.js:216779-216784) memoizes `Lk5` (`resolveForkExperiment`, cli_inner_pretty.js:216771-216778), emitting a one-time `tengu_fork_subagent_enabled {source}` (`Xk5`, cli_inner_pretty.js:216833). `Lk5` resolves precedence: disabled if `Bp()`; `'env'` if `CLAUDE_CODE_FORK_SUBAGENT` truthy; disabled if `R6()`; `'ant'` if `xH(void 0)` (placeholder); `'gb_rollout'` via gradual-rollout flag `tengu_copper_fox` (`Jk5`, cli_inner_pretty.js:216832); else `'disabled'`.

```javascript
// ============================================
// forkCommandCall + forkCommandDef - validate directive, spawn conversation-inheriting bg agent, print success
// Location: cli_inner_pretty.js:543026-543052
// ============================================

// ORIGINAL (for source lookup):
var WH9 = {};
X$(WH9, { call: () => KDz });
var KDz = async (H, $, q) => {
  let K = q.trim();
  if (!K) return (H("Usage: /fork \\<directive\\>", { display: "system" }), null);
  let _ = await Wr6(K, $, $.canUseTool ?? R2);
  if (!_) return (H("Cannot fork before the first conversation turn", { display: "system" }), null);
  return (H(`${WBH} forked ${_.name} (${_.agentId.slice(-4)})`, { display: "system" }), null);
};
// ...
_Dz = {
  type: "local-jsx",
  name: "fork",
  description: "Spawn a background agent that inherits the full conversation",
  argumentHint: "<directive>",
  isEnabled: oT,
  load: () => Promise.resolve().then(() => (ZH9(), WH9)),
};

// READABLE (for understanding):
const forkCommandCall = async (print, ctx, rawDirective) => {
  const directive = rawDirective.trim();
  if (!directive) { print("Usage: /fork \\<directive\\>", { display: "system" }); return null; }
  const result = await forkConversationAgent(directive, ctx, ctx.canUseTool ?? defaultCanUseTool);
  if (!result) { print("Cannot fork before the first conversation turn", { display: "system" }); return null; }
  print(`${FORK_GLYPH} forked ${result.name} (${result.agentId.slice(-4)})`, { display: "system" });
  return null;
};
const forkCommandDef = {
  type: "local-jsx", name: "fork",
  description: "Spawn a background agent that inherits the full conversation",
  argumentHint: "<directive>",
  isEnabled: isForkExperimentEnabled,        // gated behind the fork-subagent experiment
  load: () => import(forkModule),            // WH9 = { call: forkCommandCall }
};

// Mapping: KDz→forkCommandCall, H→print, $→ctx, q→rawDirective, K→directive, _→result; Wr6→forkConversationAgent, R2→defaultCanUseTool, WBH→FORK_GLYPH (⑂ U+2442), _Dz→forkCommandDef, oT→isForkExperimentEnabled, WH9→forkModule
```

`Wr6` (`forkConversationAgent`, cli_inner_pretty.js:454216-454295) spawns a NEW async built-in `'fork'` subagent that inherits the full conversation: it reuses/rebuilds the system prompt (`dc_`; on miss emits `uH('subagent_launch','subagent_fork_prompt_missing')`), builds `replHydration {kind:'fork', log: parent replayLog or RZ8(messages) or []}`, derives a slug name via `vV4` (`makeForkName`, cli_inner_pretty.js:454309-454321, first 3 words, ≤24 chars, else `"fork"`), registers via `UeH` with `selectedAgent: lI`, and launches via `hrH`/`WS` with `forkContextMessages = ctx.messages`, `useExactTools:true`, `override {systemPrompt, replHydration}`, and a `promptMessages` list appending the fork-worker directive `uJ$(directive)`; emits `SH('subagent_launch')`; returns `{agentId, name}`. The built-in fork agent `lI` (`forkAgentDefinition`, cli_inner_pretty.js:216848-216859, agentType `g57='fork'`) has `tools:['*']`, `maxTurns:200`, `model:'inherit'`, `permissionMode:'bubble'`, `source:'built-in'`, `baseDir:'built-in'`, **`getSystemPrompt: () => ""` (empty)**, and `whenToUse:'Implicit fork — inherits full conversation context. Not selectable via subagent_type; triggered by omitting subagent_type when the fork experiment is active.'`. The success line is prefixed by the fork glyph `WBH` (`FORK_GLYPH`, codepoint **⑂ U+2442**, cli_inner_pretty.js:49139).

### Deep analysis — the three-command lifecycle family

**What it does:** `/background` sends THIS interactive session to the background; `/fork` spawns a NEW background agent that inherits the full conversation; `/stop` terminates a background session (preserving transcript and worktree).

**How it works:** They operate at three distinct lifecycle stages with distinct enablement gates: `/background` is always available (`isEnabled:()=>!0`); `/fork` is gated behind the fork-subagent experiment (`oT`); `/stop` is gated to bg sessions only (`v7`). `/background`'s `spawnBackgroundFork` is a **process-level** `--fork-session` resume (clone the transcript into a new detached process). `/fork`'s `forkConversationAgent` is a **conversation-level** fork (a new async subagent replaying the parent transcript via `replHydration {kind:'fork'}` + `forkContextMessages`, while the parent keeps running). `/stop` rewrites the job's `state.json` to `state:'stopped'` and exits.

**Why this approach:** Modeling "stop" as self-termination (rather than a remote kill) keeps the state-write authoritative — the process that owns `CLAUDE_JOB_DIR` writes the terminal record, avoiding races. The `_J` settled-guard further prevents clobbering an already-finished record. Gating `/fork` behind a typed experiment source lets the team roll it out gradually and attribute usage.

**Key insight:** The asymmetry of *subjects* is the crux: `/background` and `/stop` act on THIS session, while `/fork` creates a DIFFERENT session that branches off the conversation. `/fork`'s distinguishing mechanic is the triple `{forkContextMessages: ctx.messages, replHydration kind:'fork', injected uJ$ worker directive}` — cloning the live conversation into an independent, asynchronously-running, single-shot branch — which is exactly the difference between "inherit the full conversation" (`/fork`) and process-level session resume (`/background`'s `spawnBackgroundFork`).

---

## 7. Telemetry

All `/background`-path events use the synchronous dispatcher `d` (cli_inner_pretty.js:3374, routes to `sink.logEvent` or queues `async:false`); the CLI flag path destructures the sink's `logEvent` as `Z` (`{logEvent:Z}` at cli_inner_pretty.js:649871); the CLI/fleet stop path uses the await-able `fQ` (cli_inner_pretty.js:3382, queues `async:true`). All three converge on the same sink — field semantics are identical; the split is purely a flush-timing concern.

**The five `/background` events:**

- `tengu_background_fork` (cli_inner_pretty.js:542800-542807) — fired once per successful slash-command fork inside `gwz`. Fields: `confirmed` (= `inflight.count > 0`, i.e. a dialog was shown — false in the idle auto-confirm case even though the `confirmed` state boolean is true), `inflight_count` (detached tasks + session-cron loops), `mid_turn` (`isMidTurn`; also gates `--reply-on-resume`), `had_prompt` (`prompt.length > 0`; becomes `-- <prompt>`), `had_worktree` (`Z !== null`), `worktree_handed_off` (`W = Boolean(Z && !Z.enteredExisting)` — the risk metric distinct from `had_worktree`).
- `tengu_background_declined` (cli_inner_pretty.js:542842) — user hit "Stay" on the abandon-tasks dialog. Fields: `{inflight_count}`.
- `tengu_background_already_bg` (cli_inner_pretty.js:542896) — `/bg` run from a session already backgrounded (`v7()` true). Empty fields `{}`.
- `tengu_background_spawn_failed` (cli_inner_pretty.js:542722) — `ol()` dispatcher returned not-ok. Empty fields `{}`.
- `tengu_background` (cli_inner_pretty.js:542723 and 649882) — the generic success counter fired from BOTH the slash command (`{via_flag:false, via:'command'}`, cli_inner_pretty.js:542723) and the CLI `--bg` flag (`{via_flag:true, via:'flag'}`, cli_inner_pretty.js:649882). The `via`/`via_flag` dimension is precisely how the team measures adoption of the NEW slash command relative to the legacy flag.

**Two guards reject with NO telemetry:** `NWH()` persistence-disabled (cli_inner_pretty.js:542897) and empty-transcript (`Ah8===null`, cli_inner_pretty.js:542904).

**Stop side — `tengu_bg_agent_action`** (cli_inner_pretty.js:542956): `{action:'stop', source, jobSessionId}`. Actual `source` values across all callers are `'stop_command'` (`twz`→`Yh8`, cli_inner_pretty.js:542990), `'bridge'` (`ewz`→`Yh8`, cli_inner_pretty.js:542998), `'cli'` (cli_inner_pretty.js:542398, via async `fQ`), and `'fleet'` (cli_inner_pretty.js:614322/614365/614404). There is **no `source:'self'`** — `Yh8` separately emits `SH("job_stop_self")` (a distinct `tengu_feature_ok` primitive, cli_inner_pretty.js:542975), which is NOT a `source` field value. The same event also covers `action:'delete'` (cli_inner_pretty.js:542442), `action:'respawn'` (cli_inner_pretty.js:541244), and dashboard-only actions.

### Deep analysis — the six measured dimensions of `tengu_background_fork`

**What it does:** Fired once per successful `/background` slash-command fork (cli_inner_pretty.js:542800-542807). It is the richest event on the path and the one the team uses to understand HOW users background sessions, not just THAT they do.

**How it works:** All six fields are computed when the forked job is confirmed spawned. `confirmed:J.count>0` means in-flight tasks existed so the user had to click through the "Background anyway (tasks will be abandoned)" dialog. `inflight_count:J.count` is the integer count from `hV8` (`count = $.length + q.length`, cli_inner_pretty.js:457397). `mid_turn:A` is whether the user backgrounded while a turn was still streaming. `had_prompt:K.length>0`. `had_worktree:I.hadWorktree`. `worktree_handed_off:I.handedOff`.

**Why this approach:** Splitting `confirmed` vs `inflight_count` lets analysts separate "how often does the abandon-tasks warning appear" (UX-friction signal) from "how many tasks are typically abandoned." Separating `had_worktree` from `worktree_handed_off` distinguishes "session had a worktree" from "we actually performed the riskier ownership transfer" (the path that can strand processes). `mid_turn` + `had_prompt` together reveal defer-the-answer (reply-on-resume) vs kick-off-new-work usage.

**Key insight:** The event is deliberately a superset of behavioral booleans rather than a single counter, enabling independent A/B of the confirmation dialog and worktree-handoff UX. `confirmed===true` correlates with the most data-loss-prone usage; `worktree_handed_off` is the key correctness/risk metric. There are effectively TWO success events per fork: the rich `tengu_background_fork` (UI/behavior) and the lean `tengu_background {via:'command'}` (cross-entry-point volume).

---

## 8. Cross-validation: 2.1.156 vs 2.1.88

The 2.1.88 comparison uses the reconstructed/deobfuscated source tree at `/lyz/codespace/3rd/claude-code/src` (re-greps run independently). *(There is no obfuscated 2.1.88 extract under `/lyz/codespace/claude-code-bomb/versions/` — only 2.1.132, 2.1.142, 2.1.156 are present — so all 2.1.156 evidence is intra-2.1.156, and the 2.1.88 evidence is from the reconstructed tree.)*

**No `/background` or `/bg` slash command in 2.1.88:**
- `ls src/commands/` returns `add-dir` … `voice` (full alphabetical listing inspected) — **no** `background`/`bg`/`fork` command directory; nearest are `branch`, `bridge`, `tasks`, `agents`.
- `grep -rn 'Send this session to the background' src/` → (no output)
- `grep -rn 'free the terminal' src/` → (no output)
- `grep -rn 'spawnBackgroundFork' src/` → (no output)
- `grep -rn 'deriveBackgroundSeed' src/` → (no output)
- `grep -rn 'BackgroundForkPrompt' src/` → (no output)
- `grep -rn 'tengu_background' src/` → (no output) — the `tengu_background`/`_fork`/`_declined`/`_already_bg`/`_spawn_failed` events do NOT exist in 2.1.88.
- `grep -rEn 'reply-on-resume|replyOnResume' src/` → (no output) — `--reply-on-resume` is NEW in 2.1.156.

**The `--fork-session` primitive DOES exist in 2.1.88:**
- `main.tsx:988` verbatim: `.option('--fork-session', 'When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)', () => true)`. The same region defines `-r, --resume [value]`.
- `forkSession` threaded through `main.tsx:1279/1282`, `utils/sessionRestore.ts:412/435/436/471/474`, `screens/ResumeConversation.tsx:61/81/220/225/254/258`, `cli/print.ts:484/691/4900/4946/4961/5148/5161`, `entrypoints/agentSdkTypes.ts:268`, `utils/sessionStorage.ts:1049/2138`.

**The CLI `--bg` flag primitive ALSO pre-existed:**
- `entrypoints/cli.tsx:185` guards `feature('BG_SESSIONS')` on `ps`/`logs`/`attach`/`kill` or `--bg`/`--background`.
- `cli.tsx:191` `const bg = await import('../cli/bg.js')`; `cli.tsx:206` `await bg.handleBgFlag(args)`. This is the SAME `handleBgFlag` the 2.1.156 CLI flag path calls at cli_inner_pretty.js:649883 (after emitting `tengu_background {via_flag:true, via:'flag'}` at cli_inner_pretty.js:649882).

**Conclusion (high confidence):** The `/background` (`/bg`) REPL handoff is NEW post-2.1.88, built on the pre-existing `--resume`/`--fork-session` session-forking primitive plus the pre-existing CLI `--bg` flag/`handleBgFlag`, wrapped in a new in-REPL slash command (`owz`/`awz`), new `spawnBackgroundFork`/`deriveBackgroundSeed`/`BackgroundForkPrompt`, a new `--reply-on-resume` flag, and a brand-new `tengu_background*` telemetry family. The `via_flag` telemetry dimension exists specifically to measure migration from the old flag entry point to this new in-REPL one.

---

## Confidence & Gaps

| Facet | Confidence | Notes |
|-------|------------|-------|
| Command def + call handler + guards | **high** | All lines re-read verbatim. Location correction applied: `NAH` declared at 542893 (not 542894 — that line is `u6$`); `Fwz` begins at 542895. |
| Seed derivation (`Ah8`) | **high** | Corrected the persistence semantics: `xjH` keys overwrite on the INCOMING `nameSource` `q`, not the stored record; an `'auto'` write is write-once-if-empty. |
| Confirm UI (`gwz`) | **high** | `D$` is a context-backed external store (`nJ6`→`useContext(rdH)`), not literally zustand. `ny$` 3rd param (prefixNote) unused by this caller. |
| Fork/handoff (`zh8`) | **high** | Corrected: `ol`'s opts is param #5 (`_`); model is internal via `ik()`, not a param; `gwz`'s outer `Y` is effortValue. `n_` body 101168-101176; `enteredExisting:!0` at 555000. |
| Siblings `/stop`, `/fork` | **high** | `WBH` codepoint ⑂ U+2442 (rendered glyph approximate). `lI`'s fork text is in `whenToUse`; system prompt is empty. |
| Telemetry + 2.1.88 | **high** | No `source:'self'`. `via='command'` (slash) vs `'flag'` (CLI). 2.1.88 absence greps re-run empty; `--fork-session`/`--bg` pre-existence re-confirmed verbatim. |

**Open questions / not fully traced (out of facet scope):**
- The precise upstream input-handler dispatch that *routes* between the immediate path (cli_inner_pretty.js:591134/629619) and the submit path (cli_inner_pretty.js:396384) spans those handlers; `kLH` (cli_inner_pretty.js:395644) is confirmed as the `immediate` evaluator used in the gate `Ez` (cli_inner_pretty.js:629618) and the `find()` predicate (cli_inner_pretty.js:591133), but the full routing harness was not exhaustively walked.
- `ywz`'s argv re-parse and the exact `--session-id`/`--fork-session` interplay are covered in depth in `unified_dispatcher_ol.md`; here only the `zh8`→`ol` boundary was traced.
- The 2.1.88 tree is a *reconstructed* (deobfuscated 3rd-party) source. The comprehensive empty greps strongly imply the slash command did not exist in 2.1.88, but absence is proven against THAT reconstruction rather than the original obfuscated 2.1.88 bundle (which is not present in this environment).

---

## Related Symbols

> Symbol mappings (tables live only in these index files — never in module docs):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (telemetry/session)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> See also: [daemon_binary_takeover_and_bg_handoff.md](daemon_binary_takeover_and_bg_handoff.md), [unified_dispatcher_ol.md](unified_dispatcher_ol.md), [worktree_isolation_and_pty_orphan.md](worktree_isolation_and_pty_orphan.md)

**NOTE:** `zh8`'s bundler **ground-truth export name is `spawnBackgroundFork`** (`X$(OH9,{spawnBackgroundFork:()=>zh8,...})`, cli_inner_pretty.js:542679). The existing symbol index maps `zh8` to `backgroundCurrentSession`; that is a descriptive alias. Both refer to the same function — reconcile to `spawnBackgroundFork` when updating the index.

Key functions/objects in this document:
- `backgroundCommandDef` (`owz`) / `backgroundCommandDefExport` (`awz`) — the `/background` (`/bg`) `local-jsx` command def + default export. cli_inner_pretty.js:542940-542950
- `backgroundCommandDefModule` (`MH9`) — definition ESM namespace (`default → awz`). cli_inner_pretty.js:542936-542937
- `backgroundCommandImplModule` (`OH9`) — implementation ESM namespace (`spawnBackgroundFork`/`deriveBackgroundSeed`/`call`). cli_inner_pretty.js:542678-542679
- `initBackgroundCommandDef` (`jH9`) / `initBackgroundImplDeps` (`Sqq`) — lazy-init thunks; `Sqq` binds React `NAH`. cli_inner_pretty.js:542939 / 542914-542935
- `backgroundCall` (`Fwz`, export key `call`) — the `/background` call handler with three guards. cli_inner_pretty.js:542895-542912
- `isBackgroundSession` (`v7`) / `getSessionKind` (`VOH`) / `isDaemonBackend` (`Ao$`) — Guard 1 helpers. cli_inner_pretty.js:99358-99363 / 99353-99356
- `requestDaemonDetach` (`bzH`) — Guard-1 daemon detach path. cli_inner_pretty.js:457636-457640
- `isSessionPersistenceDisabled` (`NWH`) / `isSessionPersistenceDisabledFlag` (`Kb`) / `getNodeEnv` (`J$9`) / `parseBooleanEnv` (`xH`) — Guard 2. cli_inner_pretty.js:546176-546179 / 3032-3034 / 546173-546175 / 1795-1800
- `deriveBackgroundSeed` (`Ah8`) — reverse-scan seed builder. cli_inner_pretty.js:542733-542762
- `extractAssistantText` (`qU`) / `extractUserText` (`KS`) / `flattenContentText` (`jl`) / `joinTextBlocks` (`w9`) / `isToolResultUserMessage` (`ST8`) — seed-scan helpers. cli_inner_pretty.js:444999-445016 / 445017-445021 / 445039-445050 / 445034-445038 / 444673-444678
- `isStructuredTaggedText` (`TqH`) — five-tag synthetic-turn detector. cli_inner_pretty.js:443714-443722
- `getUserSessionTitle` (`v3`) / `getAutoSessionTitle` (`HF`) / `getSessionMetadataStore` (`p1`) / `getCurrentSessionId` (`E$`) — title sources. cli_inner_pretty.js:547524-547531 / 546252 / 2359-2361
- `persistSessionName` (`xjH`) — name-write with incoming-source-keyed overwrite guard. cli_inner_pretty.js:184052-184067
- `BackgroundForkPrompt` (`gwz`) — confirm UI component. cli_inner_pretty.js:542763-542873
- `useStoreSelector` (`D$`) — app-store selector hook. cli_inner_pretty.js:170023-170030
- selectors: `selectEffortValue` (`rwz`) / `selectPermissionMode` (`iwz`) / `selectAdditionalWorkingDirectories` (`nwz`) / `selectAlwaysAllowRules` (`lwz`) / `selectAlwaysDenyRules` (`cwz`) / `selectTasks` (`dwz`). cli_inner_pretty.js:542874-542891
- `countInflightTasks` (`hV8`) / `getInflightSessionTasks` (`cv4`) / `getScheduledCronTasks` (`yV8`) / `summarizeInflightTasks` (`ReH`) — inflight counter. cli_inner_pretty.js:457394-457402 / 457384-457386 / 457362-457366 / 393095-393139
- `formatBgHints` (`ny$`) — the exit banner. cli_inner_pretty.js:542079-542089
- `spawnBackgroundFork` (`zh8`, export key `spawnBackgroundFork`; index alias `backgroundCurrentSession`) — argv builder + worktree handoff + async auto-naming. cli_inner_pretty.js:542680-542732
- `spawnBgSession` (`ol`) / `launchBgSessionInner` (`ywz`) — unified dispatcher + inner spawner. cli_inner_pretty.js:541769-541788 / 541789+
- `getMainLoopModelOverride` (`ik`) / `getOriginalCwd` (`f6`) / `getMemoryToggledOff` (`XR`) / `getReplConfigArgv` (`G7$`) / `getCurrentSessionFile` (`Rqq`) / `flushSessionStorage` (`R0`) / `getCurrentWorktreeSession` (`sY`) — foreground-state snapshots for the fork. cli_inner_pretty.js:2580-2582 / 2386-2388 / 2799-2801 / 2589-2591 / 546274-546276 / 546886-546888 / 239369-239371
- `setCurrentWorktreeSession` (`BL$`) / `clearWorktreeOwnershipName` (`iNH`) — worktree ownership release. cli_inner_pretty.js:239372-239374 / 239379-239381
- `generateSessionName` (`V8$`) / `trimToFirstRelevantMessage` (`nf`) / `registerBackgroundPromise` (`$7`) / `withTimeout` (`n_`) / `formatError` (`TH`) — async auto-naming machinery. cli_inner_pretty.js:494196-494235 / 446021-446024 / 3455-3457 / 101168-101176 / 8466-8468
- `BG_VALUE_FLAGS_ALLOWLIST` (`hqq`) / `BG_BOOLEAN_FLAGS_ALLOWLIST` (`pwz`) / `AUTO_NAME_TIMEOUT_MS` (`Qwz`) / `BG_FLAG_ALIASES` (`ee4`) — bg flag/const tables. cli_inner_pretty.js:542624-542668 / 542669-542676 / 542913 / 542622
- `stopSelfSession` (`Yh8`) / `stopCommandCall_interactive` (`twz`) / `stopCommandCall_bridge` (`ewz`) / `stopCommandDef_interactive` (`HDz`) / `stopCommandDef_nonInteractive` (`$Dz`) / `stopCommandDefault` (`qDz`) — `/stop` family. cli_inner_pretty.js:542955-542976 / 542989-542991 / 542997-542999 / 543008-543015 / 543016-543023 / 543024
- `readJobState` (`a7`) / `writeJobState` (`qA`) / `isStateSettled` (`_J`) / `isTerminalState` (`Nv`) / `terminalStateToOutcome` (`evH`) — job-state machinery. cli_inner_pretty.js:183950-184008 / 183931-183939 / 184283-184285 / 184280-184282 / 184274-184279
- `forkCommandCall` (`KDz`) / `forkCommandDef` (`_Dz`) / `forkConversationAgent` (`Wr6`) / `forkAgentDefinition` (`lI`) / `makeForkName` (`vV4`) / `isForkExperimentEnabled` (`oT`) / `getForkExperimentSource` (`Q57`) / `resolveForkExperiment` (`Lk5`) — `/fork` family. cli_inner_pretty.js:543028-543034 / 543045-543052 / 454216-454295 / 216848-216859 / 454309-454321 / 216788-216790 / 216779-216784 / 216771-216778
- `emitFeatureOk` (`SH`) / `emitFeatureBad` (`uH`) / `shutdownAndExit` (`tK`) / `currentJobDir` (`swz`) / `FORK_GLYPH` (`WBH`, ⑂ U+2442) — shared helpers/constants. cli_inner_pretty.js:41590-41592 / 41593-41595 / 239510 / 542952-542954 / 49139
- `isImmediateCmd` (`kLH`) — evaluates `immediate` predicate/boolean. cli_inner_pretty.js:395644-395647
- Telemetry events: `tengu_background_fork` (542800), `tengu_background_declined` (542842), `tengu_background_already_bg` (542896), `tengu_background_spawn_failed` (542722), `tengu_background` (542723 / 649882), `tengu_bg_agent_action` (542956), `tengu_fork_subagent_enabled` (216833)
