# Slash-Command Registration & Dispatch (Claude Code v2.1.183)

> **Scope.** This is the *hub* doc for the four slash commands analyzed in this
> module — `/loop`, `/batch`, `/simplify` (bundled skills) and `/goal` (a dual
> `Command`). It documents the shared machinery: how a command becomes a
> `Command` object, how the registry populates it, the three command *types*
> (`prompt` / `local-jsx` / `local`), and how a command's output is injected back
> into the agent loop as a synthetic user turn.
>
> The four per-command docs link back here for the registration/dispatch
> mechanics they all share:
> [loop.md](./loop_command.md) · [batch.md](./batch_command.md) · [simplify.md](./simplify_command.md) ·
> [goal.md](./goal_command.md). Per-command prompt bodies and behavior live in those
> docs; this doc is the plumbing.
>
> Every factual claim cites the v2.1.183 bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> (line numbers below). Before-pictures are tagged `(v2.1.156)` and cite
> `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`.

---

## 0. The big picture: two registration paths, three command shapes

A user-typed `/x …` resolves to a `Command` object. There are **two ways** a
`Command` enters the command table, and **three `type` shapes** a `Command` can
take:

| Path | Used by | Mechanism |
|------|---------|-----------|
| **Bundled-skill registrar** | `/loop`, `/batch`, `/simplify` | `registerBundledSkill(def)` (`ap`, `cli_inner_pretty.js:546973`) builds a `type:'prompt'` Command and pushes it to the in-memory registry `bundledSkills` (`exl`). `initBundledSkills` (`FJn`, `:660991`) calls each `registerXSkill()` at startup. |
| **Default-exported `Command`** | `/goal` | The command module itself default-exports a `Command` object (`xmf`, `:562070` = `Cmf`, `:562050`) plus a named non-interactive twin (`Imf`, `:562058`). No registrar; the command loader picks these up directly. |

The three shapes a `Command.type` can be (all three appear across these four
commands):

- **`'prompt'`** — a *skill*. `getPromptForCommand(args, ctx)` returns
  `ContentBlockParam[]`; the dispatcher injects those blocks as the **next user
  turn** so the skill's template runs through the model exactly as if the user
  had typed it. The three bundled skills are all `type:'prompt'`.
- **`'local-jsx'`** — an *interactive* command. `call(onDone, ctx, args)` returns
  an Ink (React) node that draws a dialog; it finishes by calling `onDone(...)`.
  `/goal`'s interactive entry (`Cmf`) is `local-jsx`.
- **`'local'`** — a *thin-client / non-interactive* command. `call(args, ctx)`
  returns a `NonInteractiveResult` value (text or a follow-up query); no UI.
  `/goal`'s non-interactive twin (`Imf`) is `local`.

So `/goal` is the interesting case: **one name, two `Command` objects** — a
`local-jsx` for interactive sessions and a `local` twin for non-interactive /
thin-client sessions, gated so exactly one is live at a time (§4).

---

## 1. The bundled-skill registrar — `registerBundledSkill` (`ap`)

### What it does

`registerBundledSkill` is the single factory that turns a lightweight
`BundledSkillDefinition` into the heavier `Command` object the command table
expects, and appends it to the process-global registry array. It is verbatim the
v2.1.88 `registerBundledSkill` from `src/skills/bundledSkills.ts`, ported forward
with three new emitted fields (§5). Located at `cli_inner_pretty.js:546973`
(`ap`); reconstruction:
[reconstructed_source/skills/bundledSkills.ts](./reconstructed_source/skills/bundledSkills.ts).

### How it works

**Step 1 — optional file-extraction wrapper (`:546977`).** If the definition
ships `files` (reference docs to drop on disk), the registrar *wraps*
`getPromptForCommand` so the files are extracted **once** (memoized promise) and
the returned prompt is prefixed with a `Base directory for this skill: <dir>`
line (`prependBaseDir`, `dcf`, `:547072`). The extraction dir is
`getBundledSkillExtractDir(name)` (`txl`, `:547027`) — `join(bundledSkillsRoot,
name)`, where the root carries a per-process 16-byte hex nonce
(`getBundledSkillsRoot`, `x6n`, `:575179`). None of our four commands ship
`files`, so this branch is dormant for them — but it is why a bundled skill *can*
behave like a disk-based skill.

**Step 2 — emit the `Command` object (`:546989`).** The exact field set emitted
in the 183 bundle:

```javascript
// ============================================
// registerBundledSkill — emit the Command{type:'prompt',source:'bundled'}
// Location: cli_inner_pretty.js:546973-547022
// ============================================

// ORIGINAL (for source lookup):
function ap(e) { let { files: t } = e, n, r = e.getPromptForCommand; if (t && Object.keys(t).length > 0) { n = txl(e.name); let s, i = e.getPromptForCommand; r = async (a, l) => { s ??= scf(e.name, t); let c = await s, u = await i(a, l); if (c === null) return u; return dcf(u, c); }; } let o = { type: "prompt", name: e.name, description: typeof e.description === "function" ? "" : e.description, menuDescription: e.menuDescription, aliases: e.aliases, subcommands: e.subcommands, hasUserSpecifiedDescription: !0, allowedTools: e.allowedTools ?? [], disallowedTools: e.disallowedTools ?? [], argumentHint: typeof e.argumentHint === "function" ? void 0 : e.argumentHint, whenToUse: typeof e.whenToUse === "function" ? void 0 : e.whenToUse, model: e.model, disableModelInvocation: e.disableModelInvocation ?? !1, userInvocable: e.userInvocable ?? !0, contentLength: 0, source: "bundled", loadedFrom: "bundled", hooks: e.hooks, skillRoot: n, context: e.context, agent: e.agent, isEnabled: e.isEnabled, isHidden: !(e.userInvocable ?? !0), progressMessage: e.progressMessage ?? "running", getPromptForCommand: r, getEffort: e.getEffort, getArgumentCompletions: e.getArgumentCompletions }; (Gwe(o, "description", e.description), Gwe(o, "argumentHint", e.argumentHint), Gwe(o, "whenToUse", e.whenToUse), exl.push(o)); }

// READABLE (for understanding):
function registerBundledSkill(definition) {
  let { files } = definition, skillRoot, getPromptForCommand = definition.getPromptForCommand;
  if (files && Object.keys(files).length > 0) {
    skillRoot = getBundledSkillExtractDir(definition.name);
    let extractionPromise, inner = definition.getPromptForCommand;
    getPromptForCommand = async (args, ctx) => {
      extractionPromise ??= extractBundledSkillFiles(definition.name, files);
      let extractedDir = await extractionPromise, blocks = await inner(args, ctx);
      if (extractedDir === null) return blocks;
      return prependBaseDir(blocks, extractedDir);
    };
  }
  let command = {
    type: "prompt", name: definition.name,
    description: typeof definition.description === "function" ? "" : definition.description,
    menuDescription: definition.menuDescription,            // 2.1.183 NEW
    aliases: definition.aliases, subcommands: definition.subcommands,
    hasUserSpecifiedDescription: true,
    allowedTools: definition.allowedTools ?? [], disallowedTools: definition.disallowedTools ?? [],
    argumentHint: typeof definition.argumentHint === "function" ? undefined : definition.argumentHint,
    whenToUse: typeof definition.whenToUse === "function" ? undefined : definition.whenToUse,
    model: definition.model,
    disableModelInvocation: definition.disableModelInvocation ?? false,
    userInvocable: definition.userInvocable ?? true,
    contentLength: 0, source: "bundled", loadedFrom: "bundled",
    hooks: definition.hooks, skillRoot, context: definition.context, agent: definition.agent,
    isEnabled: definition.isEnabled,
    isHidden: !(definition.userInvocable ?? true),
    progressMessage: definition.progressMessage ?? "running", // 2.1.183: now configurable
    getPromptForCommand, getEffort: definition.getEffort,
    getArgumentCompletions: definition.getArgumentCompletions, // 2.1.183 NEW
  };
  defineLazyOverride(command, "description", definition.description);
  defineLazyOverride(command, "argumentHint", definition.argumentHint);
  defineLazyOverride(command, "whenToUse", definition.whenToUse);
  bundledSkills.push(command);
}

// Mapping: ap→registerBundledSkill, e→definition, t→files, n→skillRoot, r/i→getPromptForCommand/inner,
//   s→extractionPromise, txl→getBundledSkillExtractDir, scf→extractBundledSkillFiles, dcf→prependBaseDir,
//   o→command, Gwe→defineLazyOverride, exl→bundledSkills
```

**Step 3 — install lazy getters (`:547018`).** Three definition fields —
`description`, `argumentHint`, `whenToUse` — may be a **string OR a function**.
The eager copy on the Command is set to `""`/`undefined` when the value is a
function; then `defineLazyOverride` (`Gwe`, `:193293`) re-installs the function
as an enumerable, configurable **getter**. This is exactly how `/loop` ships a
`description` and `argumentHint` that change with the `tengu_kairos_loop_dynamic`
flag (see [loop.md](./loop_command.md)).

### Why this approach

**Why eager-blank + lazy-getter for fn-valued fields?** The slash-menu and the
model's command catalog must scan the *whole* registry to render labels. If
`description`/`argumentHint`/`whenToUse` were called eagerly at registration, the
menu would force-evaluate every dynamic field (which can read feature flags,
entitlements, the loop.md file, etc.) on every scan. By emitting a cheap blank
eager value and installing a getter, the registry stays cheap to iterate, and the
*text* is resolved only when a specific command is actually inspected. The
trade-off is a small bit of metaprogramming (`Object.defineProperty`) in exchange
for not paying flag/IO cost per registry scan.

**Why a flat `Command` object instead of a class?** Every command source (disk
skills, MCP commands, plugin commands, built-ins) emits the *same* `Command`
shape with `source`/`loadedFrom` discriminators (`source:"bundled"`,
`loadedFrom:"bundled"` here, `:547005-547006`). A uniform plain-object contract
lets the dispatcher (§3) treat a bundled skill, an MCP prompt, and a built-in
identically — the only switch is on `type`, not on origin.

**Key insight.** `registerBundledSkill` is a pure *adapter*: it does not run any
skill logic. It normalizes a definition into the universal `Command` contract and
pushes it. Everything skill-specific (parsing args, choosing a prompt branch)
lives in the definition's own `getPromptForCommand`. That separation is why all
three bundled skills share this one factory verbatim.

### The registry accessor — `getBundledSkills` (`Lwo`, `:547023`)

`getBundledSkills` returns a **copy** of the registry (`[...exl]`) so callers
cannot mutate the source of truth — unless bundled skills are disabled, in which
case it returns `[]`. The disable gate is `areBundledSkillsDisabled` (`oV`,
`:392809`): `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS` env var **or**
`settings.disableBundledSkills === true`. Note the gate lives at the *accessor*,
not at registration — the skills are always registered; the kill-switch just hides
them all at read time.

---

## 2. The registry — `initBundledSkills` (`FJn`)

### What it does

`initBundledSkills` (`cli_inner_pretty.js:660991`) is the idempotent startup
function that calls each `registerXSkill()` exactly once, populating the registry
that `getBundledSkills` later reads. Reconstruction:
[reconstructed_source/skills/bundled/index.ts](./reconstructed_source/skills/bundled/index.ts).

### How it works

**Idempotency latch (`:660992`).** A module-level `IJl` flag guards re-entry:
`if (IJl) return; IJl = !0;` Then it invokes a long sequence of
`registerXSkill()` calls. The two skills in this module that register in the
*unconditional eager block* are:

- `registerSimplifySkill` (`OKl`) — called at `:661006`.
- `registerBatchSkill` (`pzl`) — called at `:661007`.

**`/loop` registers via a deferred binding (`:661011-661012`).** Loop's module is
lazily required and then called with **no guard**:

```javascript
let { registerLoopSkill: e } = (u7l(), ro(c7l));  // :661011
e();                                               // :661012
```

So `/loop` is registered **unconditionally** — same as simplify and batch. The
only conditional calls in `FJn` are env-var skips for *unrelated* skills
(`CLAUDE_CODE_DISABLE_CLAUDE_API_SKILL` `:661014`,
`CLAUDE_CODE_DISABLE_CLAUDE_CODE_SKILL` `:661018`) and a `bR()`-gated extra
(`mzl()`, `:661022`). None of our three skills is feature-gated at registration.

### Why this approach

**Why register `/loop` unconditionally then gate visibility lazily?** This is the
key 2.1.88→2.1.183 architectural shift for loop (§5). In v2.1.88 `/loop` was
behind `feature('AGENT_TRIGGERS')` *at registration* — if the flag was off, the
command did not exist at all. In 2.1.183 the command is always in the registry,
and its **own** `isEnabled` callback (`isLoopEnabled`, `IB`, `:221593`) decides
visibility *per invocation*:

```
isLoopEnabled = !env.CLAUDE_CODE_DISABLE_CRON && flag("tengu_kairos_cron", true)
```

The same lazy pattern the cron tools use. The advantage: a feature flag flipped
*after* startup (or per-org) takes effect without re-running registration; the
command's existence and its availability are decoupled. The trade-off is that a
disabled command still occupies a registry slot — negligible cost, big
flexibility win. (Note: the *dynamic-pacing* `/loop` branch is a third, separate
decision — `isDynamicLoopEnabled`, `jAe`, `:221035`,
`tengu_kairos_loop_dynamic`, default `false` — made at **prompt-build time**, not
registration or visibility time. See [loop.md](./loop_command.md).)

**Key insight.** Registration, visibility, and behavior-branch are three
independent gates: `FJn` (always registers) → `isEnabled`/`IB` (visibility per
invocation) → `isDynamicLoopEnabled`/`jAe` (which prompt body to emit). Conflating
them is the most common misreading of the loop pipeline.

---

## 3. Dispatch — how `getPromptForCommand` output becomes a user turn

### What it does

When the user types `/loop …`, `/batch …`, or `/simplify …`, the prompt-command
runner `RBa` (`cli_inner_pretty.js:386844`) resolves the `Command` (only
`type:'prompt'` commands reach `RBa` — the `case "prompt":` dispatcher calls it at
`:386730`, and `ATp` throws on any non-prompt command at `:386838`), calls its
`getPromptForCommand(args, ctx)`, and **merges the returned content blocks into a
synthetic user message** so the skill's template is fed through the model.

### How it works

`RBa(command, args, ctx, r = [], o = [], uuid, hookMessages = [])` has two
branches keyed on whether this is a coordinator process delegating to workers, or
the normal in-conversation expansion:

**Worker-availability branch (`:386845`).** Gated by `if (oI() && !n.agentId)` —
i.e. coordinator mode (`oI`, `:221871`, `CLAUDE_CODE_COORDINATOR_MODE`) on the
*parent* thread (no `agentId`). Here the runner does **not** expand the skill into
the conversation; instead it returns a meta message advertising the skill to
workers (`Skill "/<name>" is available for workers.` + description/whenToUse/
allowed-tools, `:386846-386860`) and returns
`{ messages, shouldQuery: true, disallowedTools, model, effort, command }`
(`:386861-386868`). This is a subagent-delegation path, **not** a `/goal` path —
`/goal` is a `local`/`local-jsx` command and never reaches `RBa`.

**Normal expansion branch (`:386870`).** For the common case (not a coordinator
parent), the skill prompt is expanded into the turn:

```javascript
let a = await e.getPromptForCommand(t, n);                       // :386870 — a: ContentBlockParam[]
let l = !iS("hooks") || Ome(e.source);                           // :386871 — hooks suppressed for this source?
if (e.hooks && l) { let h = xt(); yBa(n.setAppState, h, e.hooks, e.name, e.type === "prompt" ? e.skillRoot : void 0); }  // :386872-386875
let c = e.source ? `${e.source}:${e.name}` : e.name;             // :386876 — analytics key
let u = a.filter(h => h.type === "text").map(h => h.text).join("\n\n");           // :386877-386879 — flatten text for analytics
(syt(e.name, c, u, n.agentId ?? null), n.options.activeSkill = _0e(e));           // :386880 — active-skill tracking
let d = DBa(e, t);                                               // :386881 — d: the user-facing "/<cmd> <args>" echo message content (DBa @386784)
let p = w1(e.allowedTools ?? []), f = w1(e.disallowedTools ?? []);                // :386882-386883 — tool perms
if (f.length > 0) uUn(n.setToolPermissionContext, f, "union");                    // :386884
let m = o.length > 0 || r.length > 0 ? [...o, ...r, ...a] : a;                    // :386885 — THE EXPANDED SKILL BLOCKS
// :386901-386915 — return: messages = [ Rn({content:d, uuid:s}), Rn({content:m, isMeta:true}), ...A, ...i,
//   hi({type:"command_permissions", allowedTools:p, model:e.model}) ], shouldQuery:true, allowedTools:p,
//   disallowedTools:f, model:e.model, effort:e.getEffort?.(t) ?? e.effort, command:e
```

Step-by-step:

1. `a = await e.getPromptForCommand(t, n)` (`:386870`) — `t` is the raw argument
   string the user typed after the command, `n` is the `ToolUseContext`. `a` is a
   `ContentBlockParam[]`. For a skill that ships `files`, `a` is already wrapped
   (by `ap`) to extract files and prepend the base-dir block (§1 step 1).
2. If the command declares `hooks` and hooks aren't suppressed for the source
   (`:386872-386875`), they are registered for the session.
3. Text blocks are flattened (`:386877-386879`) for analytics (`syt`, `:386880`)
   and `options.activeSkill = _0e(e)` is set (`:386880`) — this is what shows the
   skill as "active".
4. `allowedTools`/`disallowedTools` from the Command are folded into the
   turn's tool-permission context (`:386882-386884`).
5. **The expanded blocks (`:386885`):** `m = [...o, ...r, ...a]` — the skill's
   blocks `a` are concatenated after the caller-supplied preamble/context arrays
   `o`/`r` (params 5/4 of `RBa`; both default `[]`). The return at `:386901-386915`
   then builds the actual turn: a first message `Rn({content:d})` (the user-facing
   `/cmd args` echo, `d = DBa(e,t)`) and a second **meta** message
   `Rn({content:m, isMeta:true})` carrying the expanded skill blocks, plus any
   prior `...A`/`...i` messages and a `command_permissions` block. `shouldQuery:true`
   then drives the next model round-trip. Net effect: the skill's prompt template
   runs through the model *as if the user had typed it*.

### Why this approach

**Why inject as a user turn instead of, say, swapping the system prompt or making
a side-channel call?** Because a bundled skill *is* a prompt — its entire job is
to produce a high-quality instruction the model then executes with full tool
access. Routing it through the normal user-turn pipeline means the skill
automatically inherits the same tools, hooks, permission context, compaction, and
streaming as any user message. The skill author writes a Markdown template; the
runtime requires zero special-casing. The trade-off is that a skill cannot
"silently" do work — its output always enters the visible conversation as a turn
— but for these commands (loop/batch/simplify all *want* the model to act), that
is exactly the desired semantics.

**Key insight.** `getPromptForCommand` returning `ContentBlockParam[]` (not a
string) is deliberate: a skill can emit multiple blocks (text + the base-dir
prefix block, or future image/document blocks) and they all flow into the turn as
first-class content. The flattening to text at `:386877-386879` is *only* for analytics;
the model receives the full block array.

---

## 4. The dual-`Command` model — `/goal`'s `local-jsx` + `local` twin

### What it does

`/goal` is not a bundled skill. Its command module default-exports a `local-jsx`
`Command` (interactive dialog) and separately exports a `local` twin
(non-interactive). The two are gated so exactly one is the live `/goal` for a
given session kind. Definitions at `cli_inner_pretty.js:562050-562070`;
reconstruction:
[reconstructed_source/commands/goal/index.ts](./reconstructed_source/commands/goal/index.ts).

### How it works

```javascript
// ============================================
// /goal — dual Command (local-jsx interactive + local non-interactive twin)
// Location: cli_inner_pretty.js:562047-562071
// ============================================

// ORIGINAL (for source lookup):
var Cmf, Imf, xmf;
var HPl = E(() => { lt(); ((Cmf = { type: "local-jsx", name: "goal", description: "Set a goal Claude checks before stopping", argumentHint: "[<condition> | clear]", immediate: !0, load: () => Promise.resolve().then(() => (_Pl(), yPl)) }), (Imf = { type: "local", name: "goal", supportsNonInteractive: !0, thinClientDispatch: "post-text", description: "Set a goal — keep working until the condition is met", get isHidden() { return !xr(); }, isEnabled: () => xr() || _a(), load: () => Promise.resolve().then(() => (SPl(), bPl)) }), (xmf = Cmf)); });

// READABLE (for understanding):
const goalLocalJsxCommand = {            // Cmf @562050 — interactive entry
  type: "local-jsx", name: "goal",
  description: "Set a goal Claude checks before stopping",      // :562053 — 2.1.183 distinct text
  argumentHint: "[<condition> | clear]",
  immediate: true,                                             // :562055 — run on dispatch, no model round-trip first
  load: () => import("./goal.js"),                             // lazy module yPl = { call: Tmf }
};
const goalCommand = {                    // Imf @562058 — non-interactive twin
  type: "local", name: "goal",
  supportsNonInteractive: true,                                // :562061
  thinClientDispatch: "post-text",                             // :562062 — route result back as text in thin client
  description: "Set a goal — keep working until the condition is met",  // :562063 — em-dash variant
  get isHidden() { return !isNonInteractive(); },              // :562065 — hidden when interactive
  isEnabled: () => isNonInteractive() || isRemoteWorkspace(),  // :562067
  load: () => import("./goalNonInteractive.js"),               // lazy module bPl = { call: wmf }
};
const defaultExport = goalLocalJsxCommand; // xmf @562070 = Cmf

// Mapping: Cmf→goalLocalJsxCommand, Imf→goalCommand(twin), xmf→default, xr→isNonInteractive, _a→isRemoteWorkspace,
//   yPl/bPl→lazy command modules, Tmf/wmf→the respective call() implementations
```

**The gates (`xr`/`_a`).** The twin's `isHidden` is `!isNonInteractive()`
(`!xr()`, `:562065`) — it disappears in interactive sessions. Its `isEnabled` is
`isNonInteractive() || isRemoteWorkspace()` (`xr() || _a()`, `:562067`). The
`local-jsx` `Cmf` has no such gates, so it is the default-visible `/goal` in
interactive sessions, while the `local` `Imf` becomes the live `/goal` in
non-interactive / remote-workspace sessions. The two never collide because their
visibility windows are complementary.

**`immediate: true` (`:562055`).** The `local-jsx` entry runs its `call` *on
dispatch* rather than queuing a model turn first — it pops the dialog (or
sets/clears the goal) immediately. Its `call(onDone, ctx, args)` returns an Ink
node and finishes via `onDone(...)` (see [goal.md](./goal_command.md)).

**`thinClientDispatch: 'post-text'` (`:562062`).** Only on the `local` twin. In a
thin-client (server-driven) session there is no Ink UI, so the twin's
`NonInteractiveResult` is routed back to the client as posted *text* — e.g.
`Goal active: <condition> (<status>)`, or on a successful set a `{type:'query',
value, prompt}` carrying the goal directive. This is what lets `/goal` work over a
non-TUI transport at all.

### Why this approach

**Why two Command objects instead of one with a branch inside `call`?** Because
the *protocols* differ. A `local-jsx` command's `call` signature is
`(onDone, ctx, args) → ReactNode` and it talks to the harness via the `onDone`
callback (with `{display, shouldQuery, metaMessages}` options). A `local`
command's `call` is `(args, ctx) → NonInteractiveResult` and talks via the return
value. You cannot satisfy both protocols from one function cleanly. Splitting into
two `Command` objects — each with its own `type`, its own gated visibility, and
its own lazily-loaded module — lets each use the idiomatic protocol while sharing
the underlying goal machinery (`setGoal`/`clearGoal`/`buildGoalPrompt` in
[goalNonInteractive.ts](./reconstructed_source/commands/goal/goalNonInteractive.ts),
the Stop-hook mechanism documented in [goal.md](./goal_command.md)).

**Why default-export the interactive one?** Most sessions are interactive TUI
sessions; `xmf = Cmf` (`:562070`) makes the dialog the default face of `/goal`.
The twin only steps in where there is no TUI.

**Key insight.** The "dual command" pattern is the goal equivalent of the bundled
skill's `isEnabled` gating — both decouple *one logical command* from *the
concrete object that serves it in this session*. Bundled skills do it with a
single object + a runtime `isEnabled`; goal does it with two objects whose
`isHidden`/`isEnabled` windows are mutually exclusive.

---

## 5. `menuDescription` vs `description` — the unifying 2.1.156 → 2.1.183 delta

### What it does

v2.1.183 splits a command's human-facing label into **two** strings with
different audiences:

- **`menuDescription`** — the short one-line label shown in the **slash-command
  menu** (the picker the user scrolls). Always eager; never a getter.
- **`description`** — the longer text the **model** reads when deciding to invoke
  the command itself (model-invocation context). May be a string *or* a lazy
  getter.

### How it works

The registrar emits `menuDescription: e.menuDescription` (`:546993`, in the field
block at `:546989-547016`) and now also `getArgumentCompletions`
(`:547016`), and makes `progressMessage` configurable
(`e.progressMessage ?? "running"`, `:547013`). All three bundled skills set a
`menuDescription` in 2.1.183:

- `/batch` (`pzl`): `menuDescription: "Plan a large change; background agents
  each open a PR"` (`:637831`), distinct from its longer model `description`
  ("Research and plan a large-scale change…", `:637832-637833`).
- `/simplify` (`OKl`): `menuDescription: "Clean up the changed code without
  changing behavior"` (`:647981`), vs `description: "Review the changed code for
  reuse, simplification, efficiency, and altitude cleanups…"` (`:647982-647983`).
- `/loop` (`_1f`): `menuDescription: "Repeat a prompt or command on an interval
  (e.g. /loop 5m /foo)"` (`:649254`), vs a *dynamic-aware* `description` getter
  (`:649256`) that changes wording when `isDynamicLoopEnabled()` is true.

For `/goal` the same split shows up as the **two Command objects carrying
different `description` text** (there is no bundled-skill `menuDescription` for a
non-skill command): the `local-jsx` entry says "Set a goal Claude checks before
stopping" (`:562053`) — written for the menu/user — while the `local` twin keeps
"Set a goal — keep working until the condition is met" (`:562063`) — the
behavioral framing.

### Why this is the unifying delta

This same `menuDescription` addition is **the entire 2.1.156 → 2.1.183 delta** for
`/batch` and `/loop`, and one of two small deltas for `/simplify` (the other being
the Efficiency-angle closure/memory-leak paragraph — see [simplify.md](./simplify_command.md)).
The before-picture confirms it: the 2.1.156 registrar `bA`
(`versions/2.1.156/.../cli_inner_pretty.js:524187`) emits **no** `menuDescription`,
**no** `getArgumentCompletions`, and a **hardcoded** `progressMessage: "running"`
(v2.1.156 `:524226`). Everything else in the emitted Command — the
`type/source/loadedFrom/skillRoot/getEffort` set and the three `Gwe`-installed
lazy getters — is byte-identical between the two versions.

For `/goal`, the parallel delta is the *local-jsx description text* only: in
v2.1.156 both the interactive command and the twin shared
"Set a goal — keep working until the condition is met"; in v2.1.183 the
interactive entry's description was rewritten to the menu-oriented
"Set a goal Claude checks before stopping" while the twin kept the old string
(v2.1.156 reference: `goal` block @538353). All goal *logic* — the Stop-hook
mechanism, validation, the `MAX_GOAL_CONDITION_CHARS = 4000` cap, the clear
keywords — is byte-identical across the two versions.

### Why this approach

**Why split the label at all?** The menu picker and the model have different
needs. A human scrolling a menu wants a terse, scannable label
("Clean up the changed code without changing behavior"). The model deciding
whether to *auto-invoke* a command needs precise capability framing and
disambiguation from sibling commands ("…Quality only — it does not hunt for bugs;
use /code-review for that."). Before the split, one string had to serve both and
inevitably compromised. Giving each audience its own field — eager
`menuDescription` for the UI, lazily-resolvable `description` for the model — lets
each be optimized independently, and (for `/loop`) lets the model-facing
`description` even vary with a feature flag while the menu label stays stable.

**Key insight.** The split is a textbook *audience separation* refactor that costs
one extra emitted field and buys independent evolution of UI copy vs
model-invocation copy. That it is the *only* behavioral change across three
otherwise-stable commands is itself the signal: the 2.1.156→2.1.183 slash-command
work was a labeling/UX pass, not a logic rewrite. (The dynamic-loop machinery and
the goal Stop-hook mechanism that *look* new in 2.1.183 had already shipped in
2.1.156.)

---

## 6. Quick reference — the four commands at a glance

| Command | Reg. path | `type` | Visibility gate | 2.1.156→183 delta | Per-command doc |
|---------|-----------|--------|-----------------|-------------------|-----------------|
| `/loop` | `registerLoopSkill` (`_1f`, `:649251`) via `FJn` | `prompt` (skill) | `isEnabled = isLoopEnabled` (`IB`, `:221593`) | **only** new `menuDescription` (`:649254`) | [loop.md](./loop_command.md) |
| `/batch` | `registerBatchSkill` (`pzl`, `:637828`) via `FJn` | `prompt` (skill), `disableModelInvocation:true` | none (always visible when bundled skills on) | **only** new `menuDescription` (`:637831`) | [batch.md](./batch_command.md) |
| `/simplify` | `registerSimplifySkill` (`OKl`, `:647978`) via `FJn` | `prompt` (skill) | none | new `menuDescription` (`:647981`) + Efficiency-angle paragraph | [simplify.md](./simplify_command.md) |
| `/goal` | default-exported `Command` (`xmf`, `:562070`) | dual: `local-jsx` (`Cmf`) + `local` twin (`Imf`) | twin: `isHidden=!isNonInteractive()`, `isEnabled=isNonInteractive()‖isRemoteWorkspace()` | **only** local-jsx description text (`:562053`) | [goal.md](./goal_command.md) |

---

## Related Symbols

> Symbol mappings live in the central index, never in this doc (per CLAUDE.md,
> Slash Commands route to the integration index):
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands, Plugin, IDE, UI) — primary index for this doc
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, State — the dispatch/turn-injection runner)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks — goal's Stop-hook mechanism; Skills)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, Model)

Key functions/constants in this document (list format, per CLAUDE.md):

- `registerBundledSkill` (obfuscated: `ap`, `cli_inner_pretty.js:546973`) — the bundled-skill registrar/adapter; emits the `Command{type:'prompt',source:'bundled'}` and pushes to the registry. v2.1.88 ancestor `registerBundledSkill` in `src/skills/bundledSkills.ts`; v2.1.156 predecessor `bA` (v2.1.156 `:524187`).
- `getBundledSkills` (obfuscated: `Lwo`, `cli_inner_pretty.js:547023`) — returns a copy of the registry (`[...exl]`); `[]` when `areBundledSkillsDisabled()`.
- `areBundledSkillsDisabled` (obfuscated: `oV`, `cli_inner_pretty.js:392809`) — `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS || settings.disableBundledSkills === true`.
- `defineLazyOverride` (obfuscated: `Gwe`, `cli_inner_pretty.js:193293`) — installs a lazy enumerable getter for fn-valued `description`/`argumentHint`/`whenToUse`.
- `bundledSkills` registry array (obfuscated: `exl`, `cli_inner_pretty.js:547079`) — the process-global `Command[]`; set to `[]` in module-init `OH` (`:547085`).
- `getBundledSkillExtractDir` (obfuscated: `txl`, `cli_inner_pretty.js:547027`) / `extractBundledSkillFiles` (obfuscated: `scf`, `cli_inner_pretty.js:547030`) / `prependBaseDir` (obfuscated: `dcf`, `cli_inner_pretty.js:547072`) — the lazy file-extraction + base-dir-prefix machinery (dormant for the four commands here; none ship `files`).
- `getBundledSkillsRoot` (obfuscated: `x6n`, `cli_inner_pretty.js:575179`) — `join(vB(), "bundled-skills", VERSION, randomBytes(16).hex)` per-process nonce root.
- `initBundledSkills` (obfuscated: `FJn`, `cli_inner_pretty.js:660991`) — idempotent registry init (latch `IJl`, `:661027`); calls `OKl()` (`:661006`), `pzl()` (`:661007`), and lazily-bound `registerLoopSkill` (`:661011-661012`).
- `registerSimplifySkill` (obfuscated: `OKl`, `cli_inner_pretty.js:647978`) / `registerBatchSkill` (obfuscated: `pzl`, `cli_inner_pretty.js:637828`) / `registerLoopSkill` (obfuscated: `_1f`, `cli_inner_pretty.js:649251`) — the three bundled-skill registrars; `menuDescription` at `:647981`/`:637831`/`:649254`.
- `isLoopEnabled` (obfuscated: `IB`, `cli_inner_pretty.js:221593`) — `/loop`'s `isEnabled`; `!CLAUDE_CODE_DISABLE_CRON && flag("tengu_kairos_cron", true)`.
- `isDynamicLoopEnabled` (obfuscated: `jAe`, `cli_inner_pretty.js:221035`) — prompt-time branch gate; `flag("tengu_kairos_loop_dynamic", false)` (NOT a registration/visibility gate).
- prompt-command dispatch runner (obfuscated: `RBa`, `cli_inner_pretty.js:386844`) — prompt-only (reached from `case "prompt":` `:386730` / `ATp` `:386838`); `a = await e.getPromptForCommand(t, n)` (`:386870`); expands the blocks into a meta user message at `m = [...o, ...r, ...a]` (`:386885`), returned as `Rn({content:m, isMeta:true})` (`:386904`). The first branch (`oI() && !n.agentId`, `:386845`) is the coordinator/worker skill-availability path that returns `{messages, shouldQuery:true, …}` (`:386861`) — not a `/goal` path.
- `goalLocalJsxCommand` (obfuscated: `Cmf`, `cli_inner_pretty.js:562050`) — `/goal`'s `local-jsx` interactive entry; `immediate:true` (`:562055`); description `:562053`.
- `goalCommand` non-interactive twin (obfuscated: `Imf`, `cli_inner_pretty.js:562058`) — `type:'local'`, `supportsNonInteractive:true`, `thinClientDispatch:'post-text'` (`:562062`); `isHidden=!xr()` (`:562065`), `isEnabled=xr()||_a()` (`:562067`).
- `goal` default export (obfuscated: `xmf`, `cli_inner_pretty.js:562070`) — `= Cmf` (the interactive command).
- `isNonInteractive` (obfuscated: `xr`, `cli_inner_pretty.js:3151`) / `isRemoteWorkspace` (obfuscated: `_a`, `cli_inner_pretty.js:3638`) — the gates discriminating the goal twin.
- v2.1.156 before-picture: registrar `bA` (v2.1.156 `:524187`, no `menuDescription`/`getArgumentCompletions`, hardcoded `progressMessage:"running"` `:524226`); `/goal` block (v2.1.156 `@538353`, shared description across both objects).
