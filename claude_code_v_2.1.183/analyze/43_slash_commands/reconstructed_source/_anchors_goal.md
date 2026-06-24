# `/goal` — Anchor Dossier (v2.1.183)

> Unit: `/goal` — a **dual `Command`** (no bundled-skill registrar). One `local-jsx`
> immediate command (interactive Ink dialog) + one `local` non-interactive twin.
> No v2.1.88 named-TS ancestor; mirrors the `src/commands/effort/{index.ts,effort.tsx}`
> convention (a `local-jsx` immediate command with a `load: () => import(...)` lazy module).
>
> **Behavior in one line:** "Set a goal Claude checks before stopping" — installs a
> session-scoped **Stop hook** whose `prompt` is the goal directive; the agent keeps
> working until the condition holds, then the hook auto-clears.

## Evidence tiers used

- **PRIMARY (truth):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
- **SCAFFOLD (delta only):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- **CONVENTION:** `/lyz/codespace/3rd/claude-code/src/commands/effort/{index.ts,effort.tsx}` (v2.1.88)

---

## Load-bearing symbols

### Machinery module (`goalNonInteractive.ts` / shared helpers) — region ~454437-454520, FWe module

| Readable | Obf | Line | Type | Role |
|----------|-----|------|------|------|
| `isClearKeyword` | `FGn` | 454437 | function | `qUp.has(arg.toLowerCase())` — is arg a clear keyword |
| `CLEAR_KEYWORDS` | `qUp` | 454517 | constant | `new Set(["clear","stop","off","reset","none","cancel"])` |
| `findLastAchievedGoal` | `AQa` | 454444 | function | scans messages backwards for last met (non-sentinel) `goal_status` attachment → `{condition,iterations,durationMs,tokens}` |
| `formatLastReason` | `gQa` | 454450 | function | `` `Last check: ${collapseNewlines(reason.trim())}` `` |
| `findStopPromptHooks` | `Jdt` | 454453 | function | collects empty-matcher, no-skillRoot, `type:"prompt"` Stop hooks from app state |
| `goalGateCheck` | `ego` | 454461 | function | returns `{message,code}` if hooks-restricted (`hooks_gate`) or untrusted (`trust_gate`), else `null` |
| `validateGoalCondition` (set-goal) | `Qdt` | 454466 | function | gate-check → remove old Stop hooks → add new prompt Stop hook → set `activeGoal` app state → append sentinel attachment → analytics. Returns error string or `null` on success |
| `clearGoal` | `Zdt` | 454481 | function | removes the goal Stop hook(s), clears `activeGoal`, appends "met" sentinel attachment; returns the cleared prompt or `null` |
| `makeGoalStatusAttachment` | `hQa` | 454495 | function | builds a `goal_status` sentinel attachment `{met, sentinel:true, condition}` |
| `MAX_GOAL_CONDITION_CHARS` | `Xdt` | 454503 | constant | `4000` |
| `buildGoalPrompt` | `UGn` | 454505 | function | the **verbatim Stop-hook directive** (see below) |
| `TRUST_GATE_MESSAGE` | `VUp` | 454506 | constant | "/goal is only available in trusted workspaces…" |
| `HOOKS_GATE_MESSAGE` | `zUp` | 454507 | constant | "/goal can't run while hooks are restricted…" |
| `crypto` | `mQa` | 454517 | variable | `require("crypto")` (for `randomUUID`) |

### Shared helpers (referenced, not redefined here)

| Readable | Obf | Line | Role |
|----------|-----|------|------|
| `pluralize` | `vn` | 10069 | `(n,word,plural=word+"s") => n===1?word:plural` |
| `collapseNewlines` | `Kd` | 10156 | `Di(s, "\n")` — joins/collapses newlines to single |
| `getSessionId` | `xt` | 2661 | `Ak()?.sessionId ?? state.sessionId` |
| `getStopHooks` | `g0e` | 385695 | resolves merged hooks map (`.get("Stop")`) |
| `logFeatureSad` | `Rt` | 44575 | `G("tengu_feature_sad",{...,feature_name,error_code})` |
| `logFeatureOk` | `Le` | 44569 | `G("tengu_feature_ok",{feature_name})` |
| `logEvent` | `G` | 3810 | telemetry sink |
| `sanitizeFeatureName` | `Qe` | 137 | `rht(e)` (used as `Qe("goal")` in analytics `via`) |
| `getOutputTokens` | `rb` | 2816 | sum of `outputTokens` across model usage (for `tokensAtStart`) |
| `isHooksDisabledByPolicy` | `f2` | 150375 | `policySettings.disableAllHooks === true` |
| `isHooksRestricted` | `Qse` | 150369 | `allowManagedHooksOnly` OR settings-disabled-but-not-policy |
| `isNonInteractive` | `xr` | 3151 | `!state.isInteractive` |
| `isRemoteWorkspace` | `_a` | 3638 | `state.caps.workspace === "remote"` |
| `isTrusted` | `Lp` | 591980 | trust check (`TBl ||= eHf()`) |
| `formatDuration` | `ea` | 10983 | most-significant-only duration formatter |
| `formatTokens` | `_l` | 11032 | compact token formatter |
| `GOAL_GLYPH` | `nnn` | 53753 | `"◎"` (U+25CE), prefix of "Goal active" title |

### Interactive module (`goal.tsx`) — region ~561790-561950, gPl/_Pl modules

| Readable | Obf | Line | Type | Role |
|----------|-----|------|------|------|
| `ActiveGoalDialog` | `APl` | 561810 | function (component) | renders active goal / achieved goal / no-goal states |
| `incrementIterations` | `Hmf` | 561940 | function | `n => n + 1` (forces 1s re-render tick) |
| `selectActiveGoal` | `vmf` | 561943 | function | `state => state.activeGoal` |
| `LabelRow` | `NIo` | 561946 | function (component) | dimmed `label: ` + wrapped children row |
| `goalLocalJsxModule` | `yPl` | 562037 | object | `{ call: Tmf }` (the `local-jsx` lazy module) |
| `GoalCommand.call` | `Tmf` | 562040 | function | interactive dispatch: empty→show dialog, clear→`clearGoal`, too-long, set |

### Non-interactive module (`goalNonInteractive.ts`) — region ~562006-562042, SPl module

| Readable | Obf | Line | Type | Role |
|----------|-----|------|------|------|
| `goalLocalModule` | `bPl` | 562006 | object | `{ call: wmf }` (the `local` lazy module) |
| `goalNonInteractive` (call) | `wmf` | 562008 | function | non-interactive dispatch: empty→status, clear, too-long, set→`{type:'query',...}` |

### Registration (`index.ts`) — region ~562056-562082, HPl module

| Readable | Obf | Line | Type | Role |
|----------|-----|------|------|------|
| `goalLocalJsxCommand` | `Cmf` | 562058 | object | `local-jsx`, name `"goal"`, immediate, description "Set a goal Claude checks before stopping" |
| `goalCommand` (local twin) | `Imf` | 562065 | object | `local`, name `"goal"`, `supportsNonInteractive:true`, `thinClientDispatch:"post-text"`, description "Set a goal — keep working until the condition is met", `isHidden:()=>!isNonInteractive()`, `isEnabled:()=>isNonInteractive()||isRemoteWorkspace()` |
| default export | `xmf` | 562081 | — | `= Cmf` (the local-jsx command is the default) |

---

## Verbatim prompt strings captured (copy EXACTLY)

### `buildGoalPrompt` (UGn) — chunks @454505

```
A session-scoped Stop hook is now active with condition: "${condition}". Briefly acknowledge the goal, then immediately start (or continue) working toward it — treat the condition itself as your directive and do not pause to ask the user what to do. The hook will block stopping until the condition holds. It auto-clears once the condition is met — do not tell the user to run `/goal clear` after success; that's only for clearing a goal early.
```
(In bundle, `—` is written `—`; `${condition}` is `${e}`.)

### Gate messages — @454506-454507

- `TRUST_GATE_MESSAGE` (VUp): `/goal is only available in trusted workspaces. Restart, accept the trust dialog, and try again.`
- `HOOKS_GATE_MESSAGE` (zUp): `/goal can't run while hooks are restricted (disableAllHooks or allowManagedHooksOnly is set in settings or by policy).`

### User-facing result strings (in dispatch) — @561940-562040 (Tmf) / @562008-562040 (wmf)

- Non-interactive empty + no goal: `No goal set. Usage: \`/goal <condition>\``
- Non-interactive empty + active: `Goal active: ${condition} (${status})${lastReasonLine}` where `status` = `not yet evaluated` (iterations 0) or `${n} ${pluralize(n,"turn")}`
- Clear (interactive system display): `No goal set` / `Goal cleared: ${prompt}`
- Too long: `Goal condition is limited to ${MAX} characters (got ${len})`
- Set (interactive): `Goal set: ${condition}` with `metaMessages:[buildGoalPrompt(condition)]`
- Set (non-interactive): `{ type:'query', value:'Goal set: ${condition}', prompt: buildGoalPrompt(condition) }`
- Interactive dialog texts: title `◎ Goal active`, `/goal clear to stop early`, `Goal achieved`, `/goal <condition> to set another`, `No goal set` / `/goal <condition> to set one`, label rows `Goal: …`, `Last check: …`.

### Analytics events

- `tengu_feature_sad` via `logFeatureSad("goal_set", code)` for gate (`hooks_gate`/`trust_gate`) and `too_long`.
- `tengu_feature_ok` via `logFeatureOk("goal_set")` on successful set.
- `tengu_stop_hook_added` `{ promptLength, via: sanitizeFeatureName("goal") }` on set.
- `tengu_stop_hook_removed` `{ via: sanitizeFeatureName("goal") }` on clear.

---

## v2.1.88 ancestor mapping (convention, not behavior)

| 2.1.183 goal symbol | effort/ analogue | Note |
|---------------------|------------------|------|
| `Cmf` (local-jsx def) | `effort/index.ts` default export | both `type:'local-jsx'`, `immediate` (effort via `shouldInferenceConfigCommandBeImmediate()`; goal `immediate:true` literal), `load: () => import('./goal.js')` |
| `APl` (ActiveGoalDialog) | `effort.tsx` `ShowCurrentEffort`/`ApplyEffortAndClose` | Ink component reading app state via a selector, calling `onDone` |
| `vmf` (selectActiveGoal) | effort.tsx `_temp` (`s => s.effortValue`) | app-state selector |
| `Tmf` (call) | effort.tsx `call(onDone, _context, args)` | same `(onDone, context, args)` signature; returns ReactNode/null |
| `wmf` (non-interactive call) | (no effort analogue) | the `local` twin; effort has no non-interactive twin |

There is **no** named-TS goal ancestor — goal is a 2.1.156-era feature. The reconstruction
mirrors the effort idiom for `index.ts`/`goal.tsx` and writes the non-interactive twin from
the 183 bundle directly.

---

## 2.1.156 → 2.1.183 delta

Goal existed in 2.1.156 (`goal`@538353). **Almost everything is byte-identical**:

- `buildGoalPrompt` text identical (156 @447983 == 183 @454505).
- Non-interactive `wmf`/`$jz` logic identical (156 @538316-538340).
- Validation/clear/keywords/`MAX=4000` identical.

**The single behavioral delta:** the `local-jsx` command's `description`.
- 2.1.156 (`qjz`@538353): `description: "Set a goal — keep working until the condition is met"` (same string as the local twin).
- 2.1.183 (`Cmf`@562058): `description: "Set a goal Claude checks before stopping"` (the local twin `Imf` still says "Set a goal — keep working until the condition is met").

So in 2.1.183 the interactive entry and the non-interactive entry now carry **distinct**
menu descriptions. No logic, prompt, gate, or analytics change.

(`isHidden`/`isEnabled` gates also unchanged: 156 used `R6`/`d6`; 183 uses `xr`/`_a` — same
`!isNonInteractive()` / `isNonInteractive()||isRemoteWorkspace()` semantics, re-mangled names.)

---

## Open questions

- `Tmf` interactive set path returns `{ shouldQuery: true, metaMessages: [buildGoalPrompt(c)] }`
  whereas `wmf` non-interactive returns `{ type:'query', value, prompt }`. Both feed the same
  goal directive into the conversation; the shape difference is the `local-jsx` (onDone-callback)
  vs `local` (return-value) command protocols. Reproduced faithfully.
- Deep React-compiler memo-cache plumbing in `APl`/`NIo` (the `t[...]` cache slots) is summarized
  in `goal.tsx` (behavior preserved, cache bookkeeping omitted) per the task's allowance.
