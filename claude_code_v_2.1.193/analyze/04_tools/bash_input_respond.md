# `!` bash commands now auto-trigger a Claude response

> **Type/version:** NET-NEW behavior in **v2.1.186** (body change to `processBashCommand` + a net-new `respondToBashCommands` setting). Window: v2.1.183 → v2.1.193.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (build `a1938d2a`). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged `(183)`.

---

## TL;DR

Before v2.1.186, running a `!` bash command in the prompt input added its stdout/stderr to the conversation **silently** — Claude never responded to it. In 183, the handler `processBashCommand` returned `shouldQuery: false` on **every** path (confirmed: every return in 183 `Owf` is `shouldQuery:!1`). v2.1.186 inverts the default: the handler now reads a **net-new setting `respondToBashCommands` (default `true`)** and, unless the command was interrupted/backgrounded/aborted, returns `shouldQuery: true` — so the model gets a turn and **responds to the command output**. The pre-186 silent behavior is still available by setting `"respondToBashCommands": false`.

**Upgrade gotcha:** because the default is `?? !0` (true), upgrading to ≥2.1.186 silently changes behavior — every `!` command now starts a model turn. Users who relied on `!` as a quiet "stuff this output into context" affordance must opt out explicitly.

Grep proof of the delta: `respondToBashCommands` 193=3 / 183=0; `respond: s` telemetry field 193=1 / 183=0.

---

## 0. Before-picture (183): `!` was always silent

In v2.1.183 the bash-mode handler `Owf` (183 `processBashCommand`, `cli_inner_pretty.js:604506`) had no setting and no gate. Its telemetry omitted any `respond` field, it **unconditionally prepended** the no-response caveat marker (`Rte()`), and **every** return path was `shouldQuery: !1`:

```javascript
// ============================================
// (183) processBashCommand — always silent (shouldQuery:!1 on every path)
// Location (183): cli_inner_pretty.js:604506-604572
// ============================================

// ORIGINAL (183, for source lookup):
async function Owf(e, t, n, r) {
  let o = JO() && bYn() === "powershell";
  G("tengu_input_bash", { powershell: o });           // ← no `respond` field
  let s = Rn({ content: eV({ inputString: `<bash-input>${e}</bash-input>`, precedingInputBlocks: t }) }), ...
  ...
  return {
    messages: [Rte(), s, Rn({ content: `<bash-stdout>${y}</bash-stdout><bash-stderr>${Kp(A)}</bash-stderr>` })],
    shouldQuery: !1,                                   // ← ALWAYS false
  };
  // catch paths: also Rte()+…, shouldQuery: !1  (×3)
}

// Mapping (183): Owf→processBashCommand, Rte→noResponseCaveatMarker, G→telemetry, JO→isWindows, bYn→getDefaultShell
```

So in 183 a `!` command produced an `isMeta` "Caveat: …DO NOT respond to these messages…" marker plus the bash output, and Claude stayed silent. (The `shouldQuery: y` lines a few hundred lines down belong to the *next* function `w8t`, not to `Owf` — do not confuse them.)

---

## 1. The setting: `respondToBashCommands` (NET-NEW)

**What it does.** A persisted boolean preference that decides whether Claude responds after a `!` command runs. Declared in the settings schema (next to the carryover `defaultShell`/`disableSkillShellExecution` fields):

```javascript
// ============================================
// respondToBashCommands — settings schema field (default true)
// Location: cli_inner_pretty.js:56492-56497
// ============================================

// ORIGINAL (for source lookup):
respondToBashCommands: A.boolean()
  .optional()
  .describe(
    "Whether Claude responds after an input-box ! bash command runs. Set to false to add the command output to context without a response. Default: true.",
  ),

// READABLE (for understanding):
respondToBashCommands: zod.boolean()
  .optional()                                 // unset ⇒ treated as true at read time (?? !0)
  .describe("Whether Claude responds after an input-box ! bash command runs. …Default: true."),

// Mapping: A→zod (the schema builder)
```

It is also threaded into the persisted-preferences key list at `:691999` (`"respondToBashCommands"`), so it round-trips through settings load/save like any other preference. `grep -c respondToBashCommands` → 193=3 (schema :56492, read :617564, persisted-key :691999), 183=**0**.

---

## 2. The dispatch: `processBashCommand` gates on the setting (body change)

**What it does.** `processBashCommand` (obfuscated: `y6f`, `:617562`; exported via `gt(Mrc, { processBashCommand: () => y6f })` at `:617561`) runs the `!` command through the Bash/PowerShell tool and assembles the result messages. v2.1.186's change is the `shouldRespond`/`willQuery` gate.

```javascript
// ============================================
// processBashCommand — auto-respond gate (read setting → willQuery)
// Location: cli_inner_pretty.js:617562 (read @617564, telemetry @617565, gate @617604, return @617611)
// ============================================

// ORIGINAL (for source lookup):
async function y6f(e, t, n, r) {
  let o = d1() && Psr() === "powershell",
    s = Lr().respondToBashCommands ?? !0;                       // ← read setting, default true
  V("tengu_input_bash", { powershell: o, respond: s });        // ← NET-NEW `respond` field
  ...
  let ...,
    S = s && !g.interrupted && !g.backgroundTaskId && !n.abortController.signal.aborted;  // ← gate
  return {
    messages: [
      ...(S ? [] : [Sre()]),                                   // caveat only when NOT querying
      i,
      Pn({ content: `<bash-stdout>${_}</bash-stdout><bash-stderr>${ec(h)}</bash-stderr>` }),
    ],
    shouldQuery: S,                                            // ← true ⇒ Claude responds
  };
}

// READABLE (for understanding):
async function processBashCommand(command, precedingInputBlocks, ctx, render) {
  let usePowershell = isWindows() && getDefaultShell() === "powershell";
  let shouldRespond = getSettings().respondToBashCommands ?? true;        // DEFAULT TRUE
  telemetry("tengu_input_bash", { powershell: usePowershell, respond: shouldRespond });
  ...
  let willQuery =
    shouldRespond &&
    !result.interrupted &&            // a Ctrl-C'd command never auto-responds
    !result.backgroundTaskId &&       // a command sent to background never auto-responds
    !ctx.abortController.signal.aborted;
  return {
    messages: [
      ...(willQuery ? [] : [noResponseCaveatMarker()]),  // prepend the "DO NOT respond" caveat only when silent
      inputBlock,
      makeBlock(`<bash-stdout>${stdout}</bash-stdout><bash-stderr>${esc(stderr)}</bash-stderr>`),
    ],
    shouldQuery: willQuery,            // the agent loop queries the model iff true
  };
}

// Mapping: y6f→processBashCommand, Lr→getSettings, Psr→getDefaultShell, d1→isWindows, V→telemetry,
//   s→shouldRespond, S→willQuery, Sre→noResponseCaveatMarker, Pn→makeBlock, ec→esc
```

**How the gate works — the three suppressors.** Even with the setting `true`, `willQuery` is forced `false` when:
1. `result.interrupted` — the user Ctrl-C'd the command; responding to a half-run command is noise.
2. `result.backgroundTaskId` — the command was sent to the background (it has no terminal output yet to respond to).
3. `ctx.abortController.signal.aborted` — the surrounding turn was cancelled.

In all three the handler reverts to the 183 behavior: prepend `noResponseCaveatMarker()` and `shouldQuery: false`.

**The caveat marker is the inverse of querying.** `noResponseCaveatMarker` (obfuscated: `Sre`, `:599656`; CARRYOVER, 183 `Rte`) emits an `isMeta` block telling the model *not* to respond to user-run local commands:

```javascript
// ============================================
// noResponseCaveatMarker — the "DO NOT respond" meta caveat (prepended only when silent)
// Location: cli_inner_pretty.js:599656-599661
// ============================================

// ORIGINAL (for source lookup):
function Sre() {
  return Pn({
    content: `<${dBe}>Caveat: The messages below were generated by the user while running local commands. DO NOT respond to these messages or otherwise consider them in your response unless the user explicitly asks you to.</${dBe}>`,
    isMeta: !0,
  });
}

// READABLE (for understanding):
function noResponseCaveatMarker() {
  return makeBlock({
    content: `<${LOCAL_COMMAND_CAVEAT_TAG}>Caveat: The messages below were generated by the user while running local commands. DO NOT respond to these messages … unless the user explicitly asks you to.</${LOCAL_COMMAND_CAVEAT_TAG}>`,
    isMeta: true,            // not shown to the user; only steers the model
  });
}

// Mapping: Sre→noResponseCaveatMarker, dBe→LOCAL_COMMAND_CAVEAT_TAG ("local-command-caveat", :45931), Pn→makeBlock
```

**Why prepend the caveat only in the silent path.** When `willQuery` is true the output *is* meant for the model to read and react to, so the "do not respond" caveat would be self-contradictory — it is omitted. When `willQuery` is false the output is context-only, and the caveat is the long-standing mechanism that stops a later turn from spuriously commenting on a `!ls`. So the marker presence is a perfect inverse of `shouldQuery`: `messages = [...(willQuery ? [] : [caveat]), …]`.

**Why a boolean setting rather than (say) a heuristic.** The alternative — auto-respond only for "interesting" commands — would be unpredictable and hard to explain. A single boolean with a documented default keeps the mental model trivial ("`!` talks back; turn it off if you don't want that") and is one `?? !0` read at the one dispatch site. The trade-off is the upgrade-behavior surprise (below), accepted because the new default is the more useful one for most users (running `!git diff` and getting a review is the motivating case).

---

## 3. End-to-end: what a `!` command does in 193

1. User types `!npm test` and hits Enter in the prompt input.
2. `processBashCommand` runs it via the Bash tool (or PowerShell on Windows when `defaultShell === "powershell"`).
3. It reads `respondToBashCommands` (default **true**), emits `tengu_input_bash { powershell, respond: true }`.
4. The command finished normally (not interrupted/backgrounded/aborted) → `willQuery = true`.
5. Returned messages = `[ <bash-input>…</bash-input>, <bash-stdout>…</bash-stdout><bash-stderr>…</bash-stderr> ]` with **no** caveat, and `shouldQuery: true`.
6. The agent loop sees `shouldQuery: true` → queries the model → **Claude responds** to the test output.

With `"respondToBashCommands": false`: step 4 yields `willQuery = false`, the caveat is prepended, `shouldQuery: false`, and the loop does **not** query — identical to pre-2.1.186.

---

## Evidence note (NET-NEW vs CARRYOVER)

| Item | 193 anchor | 183 grep-diff | Verdict |
|------|-----------|---------------|---------|
| `respondToBashCommands` schema | :56492 | grep 193=3 / 183=0 | **NET-NEW** |
| `respond: s` telemetry field | :617565 | `respond: s` 193=1 / 183=0 | **NET-NEW** |
| `willQuery` gate + `shouldQuery: S` | :617604 / :617611 | 183 `Owf` returns `shouldQuery:!1` only | **NET-NEW (body change)** |
| caveat-only-when-silent | :617607 | 183 always prepends `Rte()` | **NET-NEW (body change)** |
| `noResponseCaveatMarker` (`Sre`) | :599656 | "DO NOT respond to these messages" 1=1 | **CARRYOVER (re-mangled, 183 `Rte`)** |
| `getDefaultShell` (`Psr`) / `defaultShell` setting | :617550 / :56489 | `defaultShell` 2=2 | **CARRYOVER** |

> Adversarial note: `defaultShell` and `disableSkillShellExecution` sit beside `respondToBashCommands` in the same schema object but are **not** 193 deltas (carryover counts unchanged). Only `respondToBashCommands` and the `respond` telemetry field are new.

---

## Cross-links

- Sibling 193 docs: [`bash_mode_autocomplete.md`](./bash_mode_autocomplete.md) (the other bash-input delta — live path dropdown), [`tool_surface_delta_193.md`](./tool_surface_delta_193.md), [`README.md`](./README.md).
- The `classifyAllShell` auto-mode routing (different bash-related 193 delta) is a permissions/auto-mode concern, not a tool-surface change — see [`tool_surface_delta_193.md`](./tool_surface_delta_193.md) §5 and `38_permissions/`.

---

## Related Symbols

> Symbol mappings live in the central index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Tools — this doc's home)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (CLI/input)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (settings/telemetry)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - per-feature additions: [symbol_additions_v2_1_193_tools.md](../00_overview/symbol_additions_v2_1_193_tools.md)

Key functions in this document:
- `processBashCommand` (`y6f`, :617562) — runs the `!` command; new `respondToBashCommands` gate at `:617604`, `shouldQuery: S` return `:617611`; 183 predecessor `Owf`@604506 (always silent).
- `respondToBashCommands` — settings field (:56492), read site (:617564), persisted-prefs key (:691999); NET-NEW (183=0).
- `noResponseCaveatMarker` (`Sre`, :599656) — CARRYOVER "DO NOT respond" meta caveat; 183 `Rte`.
- `LOCAL_COMMAND_CAVEAT_TAG` (`dBe`, :45931) — `"local-command-caveat"` wrapper tag for the caveat.
- `getSettings` (`Lr`, :58428) / `getDefaultShell` (`Psr`, :617550) — CARRYOVER readers.
- `bashModeModule` (`Mrc`, :617560) — exports `{ processBashCommand: () => y6f }`.
