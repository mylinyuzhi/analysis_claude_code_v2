# `/goal` in Remote Control Sessions (v2.1.139)

## What it does

Remote Control is the protocol that lets a remote claude.ai client send slash commands and free-form text to a CLI session running on the user's local machine. A subset of CLI slash commands have to opt into Remote Control - the ones that have a meaningful non-interactive shape and can synthesize their result as a text reply.

`/goal` opts in via `thinClientDispatch: "post-text"` on the **non-interactive** command variant (`goalNonInteractive` / `pR5`). When a remote client posts `/goal all tests pass`, the CLI processes the command via the same `mR5` (`goalNonInteractive`) function that handles `-p` mode, returns a `{ type: "query", value, prompt }` result, and continues the model loop with the priming prompt as if the user had typed it locally.

The interactive `goalCommand` (`BR5` / `local-jsx`) is not directly invokable from Remote Control - JSX dialogs cannot render in a thin client. The remote client gets the non-interactive variant transparently because both variants share the same `name: "goal"` registry entry, and the dispatcher picks the variant compatible with the calling context.

---

## How it works

### 1. The two command variants in the export

```javascript
// ============================================
// /goal command exports - both variants
// Location: cli_inner_pretty.js:507845-507871
// ============================================

// ORIGINAL (for source lookup):
var Vk4 = {};
J$(Vk4, { goalNonInteractive: () => pR5, default: () => UR5 });
var BR5, pR5, UR5;
var vk4 = T(() => {
  z$();
  ((BR5 = {
    type: "local-jsx",
    name: "goal",
    description: "Set a goal — keep working until the condition is met",
    argumentHint: "[<condition> | clear]",
    immediate: !0,
    load: () => Promise.resolve().then(() => (Zk4(), Wk4)),
  }),
    (pR5 = {
      type: "local",
      name: "goal",
      supportsNonInteractive: !0,
      thinClientDispatch: "post-text",
      description: "Set a goal — keep working until the condition is met",
      get isHidden() {
        return !T6();
      },
      isEnabled: () => T6() || I6(),
      load: () => Promise.resolve().then(() => (Tk4(), Gk4)),
    }),
    (UR5 = BR5));
});

// READABLE (for understanding):
const exports = {};
exportNamed(exports, {
  goalNonInteractive: () => goalNonInteractive,
  default: () => goalCommand,
});
let goalCommand, goalNonInteractive, goalDefaultExport;
const init = lazyModule(() => {
  initSharedModule();
  // The interactive variant: renders a React dialog
  goalCommand = {
    type: "local-jsx",
    name: "goal",
    description: "Set a goal — keep working until the condition is met",
    argumentHint: "[<condition> | clear]",
    immediate: true,
    load: () => Promise.resolve().then(() => (initInteractive(), interactiveExports)),
  };
  // The non-interactive variant: returns text/query result, dispatchable over thin client
  goalNonInteractive = {
    type: "local",
    name: "goal",
    supportsNonInteractive: true,
    thinClientDispatch: "post-text",
    description: "Set a goal — keep working until the condition is met",
    get isHidden() { return !isTrustedWorkspace(); },
    isEnabled: () => isTrustedWorkspace() || isHeadlessMode(),
    load: () => Promise.resolve().then(() => (initNonInteractive(), nonInteractiveExports)),
  };
  goalDefaultExport = goalCommand;
});

// Mapping:
//   BR5 -> goalCommand,                  pR5 -> goalNonInteractive,
//   UR5 -> goalDefaultExport,            Vk4 -> exports,
//   T6  -> isTrustedWorkspace,           I6  -> isHeadlessMode,
//   J$  -> exportNamed
```

Both variants share `name: "goal"`. The interactive variant is the **default export**, while the non-interactive variant is a named export `goalNonInteractive`.

### 2. The thin-client dispatch helper

```javascript
// ============================================
// isThinClientDispatchable - the gate for Remote Control slash commands
// Location: cli_inner_pretty.js:513895-513897
// ============================================

// ORIGINAL (for source lookup):
function fx5(H) {
  return !Yx5(H).workspace || H.thinClientDispatch !== void 0;
}

// READABLE (for understanding):
function isThinClientDispatchable(command) {
  // Either the command doesn't need workspace (pure pure prompt commands), OR
  // it has explicitly opted into a thinClientDispatch mode.
  return !getCommandRequirements(command).workspace || command.thinClientDispatch !== undefined;
}

// Mapping: fx5 -> isThinClientDispatchable, Yx5 -> getCommandRequirements
```

`getCommandRequirements` (`Yx5` at `cli_inner_pretty.js:513884`) returns `{ workspace, ink }`:

```javascript
// Location: cli_inner_pretty.js:513884-513894
function Yx5(H) {
  if (H.requires) return { workspace: H.requires.workspace ?? !1, ink: H.requires.ink ?? !1 };
  switch (H.type) {
    case "prompt":
      return { workspace: !1, ink: !1 };
    case "local":
      return { workspace: !0, ink: !1 };
    case "local-jsx":
      return { workspace: !0, ink: !0 };
  }
}
```

So the `goalNonInteractive` (`type: "local"`) has `workspace: true, ink: false` - it would fail the `!workspace` clause but passes via `thinClientDispatch !== undefined`. The interactive variant (`type: "local-jsx"`) has `workspace: true, ink: true` and **no `thinClientDispatch`** field, so it's not dispatchable - exactly what we want, since it returns a React JSX tree that the thin client cannot render.

### 3. The dispatch values

The valid `thinClientDispatch` values are seen across the codebase:

- `"post-text"` - the command result is text/query; the thin client posts the result back to the model
- `"control-request"` - the command result is a control signal (e.g. `/exit`, `/clear`); the thin client interprets it as a control action

`/goal` uses `post-text` because its successful result is a `{ type: "query", value, prompt }` shape - the `prompt` becomes a new user message that the model needs to process. `/exit`, on the other hand, uses `control-request` because the action is "tear down the session", not "send a message."

### 4. The fold-back of the result

When the non-interactive `mR5` returns:

```typescript
return {
  type: "query",
  value: `Goal set: ${arg}`,
  prompt: STOP_HOOK_GOAL_PROMPT(arg),
};
```

The remote thin client receives this as a generic command-result payload. The harness then:

1. Treats `value` as the text shown in the remote chat panel ("Goal set: ...").
2. Synthesizes the `prompt` as a new user message in the model loop - which fires the Stop-hook priming and starts the goal-driven work loop.

The remote client sees a normal conversation flow: "user typed /goal X" -> "Goal set: X" -> model starts working on X. The fact that a Stop hook was registered behind the scenes is invisible from the remote side.

### 5. The hidden-from-listing logic

```javascript
get isHidden() {
  return !T6();
},
isEnabled: () => T6() || I6(),
```

- `isHidden: true` (when not trusted workspace) -> hide from `/`-autocomplete
- `isEnabled: false` (when neither trusted nor headless) -> reject invocation entirely

The remote client therefore won't see `/goal` in its slash-command list for untrusted workspaces, and even if a remote user manually types the command, the dispatch will fail with the same trust-gate message ([goal_hooks_interaction.md](./goal_hooks_interaction.md)).

### 6. Status sync to remote

The `activeGoal` state lives on `appState` in the CLI host. While the CLI is the source-of-truth, Remote Control synchronizes the **transcript** to the connected client (messages, attachments, system metas). The `goal_status` attachments (both sentinels and achievement payloads) flow over the sync channel and the remote client renders them via the same `case "goal_status"` branch at `cli_inner_pretty.js:347071`.

The live overlay panel itself does **not** sync to remote - it's a CLI-only rendering. Remote clients see:

- The transcript meta messages (`Goal set: X`, `Goal cleared: X`)
- The achievement attachment renders ("Goal achieved (1m 23s · 5 turns · 2.4k tokens)")
- The activity-status badge can show "/goal active" in some thin clients that consume the activity status stream, but this is a UI choice on the client side, not a protocol guarantee.

---

## Why this approach

**Why two variants instead of one?** The two execution shapes are fundamentally different:

- Interactive variant has to render a React dialog that lets the user see live stats.
- Non-interactive variant has to return text/query result that any front-end can consume.

Trying to unify them would force either (a) the interactive flow to return text and lose the live dialog, or (b) the non-interactive flow to render a dialog that can't be displayed. Two variants keep both ergonomic. The shared core (`CaH`/`baH`) makes them behaviorally identical.

**Why `thinClientDispatch: "post-text"` instead of routing through interactive UI?** Because the dialog cannot render remotely - the JSX tree assumes a local terminal. The post-text route bypasses the dialog and goes straight to the non-interactive result. Users on remote clients still see "Goal set: X" in their chat panel and the model starts working.

**Why is `isHidden` a getter (`get isHidden() { return ... }`) rather than a plain boolean?** Because the trusted-workspace state can change mid-session (e.g. user accepted the trust dialog after launch). A getter re-evaluates on every check, ensuring the slash-command listing reflects the current trust state. A plain boolean would be frozen at command-registration time.

**Why is the `default` export the interactive variant?** Most callers of the module want the user-facing entry point, which is the interactive dialog. The non-interactive variant is consumed by:

- The command registry's "all commands" iteration (which iterates both).
- The headless harness's `-p` invocation (`Ng6 = WE4.goalNonInteractive` at `cli_inner_pretty.js:514107`).
- The thin-client dispatch path (which selects by `thinClientDispatch` field).

Making the named export `goalNonInteractive` and the default `goalCommand` matches typical importer expectations.

**Key insight:** Remote Control compatibility for `/goal` is opt-in via **one field** (`thinClientDispatch: "post-text"`) on the non-interactive variant. The interactive variant is intentionally not dispatchable - and the dispatcher uses `fx5` to enforce that. The result is a clean three-way split where:

- Local terminal users get the rich live overlay.
- `-p`/SDK users get the non-interactive text-return shape.
- Remote Control users get the same non-interactive shape, transparently routed.

The same Stop-hook plumbing serves all three.

---

## Cross-references

- The `mR5` non-interactive function in detail - [goal_command.md](./goal_command.md)
- The full Remote Control protocol and dispatch routing - `33_remote_control` (if it exists) or the broader CLI command system in `28_cli_commands`
- The `thinClientDispatch` value enumeration (`"control-request"` vs `"post-text"`) and other commands that opt in - `28_cli_commands` and `cli_inner_pretty.js:428542, 430469, 431907, ...`
- Workspace trust (`T6`, `_5`, `I6`) - `12_permission_policy` or `13_sandbox_hardening`
- The goal-status attachment renderer at `cli_inner_pretty.js:347071-347110` - drives the remote-side rendering of goal events
