# Anchor Dossier — `/loop` bundled skill (Claude Code v2.1.183)

> Load-bearing symbols, verbatim prompt strings, ancestor mapping, and the
> 2.1.156→2.1.183 delta for the `/loop` (`aliases: ["proactive"]`) bundled skill.
>
> - PRIMARY bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> - SCAFFOLD bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
> - v2.1.88 ancestor: `/lyz/codespace/3rd/claude-code/src/skills/bundled/loop.ts` (`registerLoopSkill`)

## 1. Registration / dispatch

| Readable | Obf | Line (183) | Role |
|----------|-----|-----------|------|
| `registerLoopSkill` | `_1f` | 649251 | Registers the `loop` bundled skill via `ap()` (call opens @649252) |
| `registerBundledSkill` | `ap` | 546973 | Bundled-skill registrar; **now reads `menuDescription`** @546993 |
| (export marker) | `gt(c7l,{registerLoopSkill:()=>_1f})` | 649084 | ESM export wiring |

`_1f` calls `ap({...})` with: `name:"loop"`, `menuDescription` (NEW in 183), `aliases:["proactive"]`, a getter `description` (gated on `jAe()`), `whenToUse`, a getter `argumentHint` (gated on `_9e.isLoopDefaultPromptEnabled()`), `userInvocable:true`, `isEnabled:IB`, and `getPromptForCommand(args, ctx)`.

## 2. Gates / feature flags

| Readable | Obf | Line (183) | Role |
|----------|-----|-----------|------|
| `isLoopEnabled` | `IB` | 221593 | `!parseBoolean(env.CLAUDE_CODE_DISABLE_CRON) && featureFlag("tengu_kairos_cron", true, 300000)` |
| `isDynamicLoopEnabled` | `jAe` | 221035 | `featureFlag("tengu_kairos_loop_dynamic", false)` — toggles self-pacing branch |
| `isLoopDefaultPromptEnabled` | `o5r` (exported as `_9e.isLoopDefaultPromptEnabled`) | 220891 | `featureFlag("tengu_kairos_loop_prompt", false)` — toggles empty-input default (loop.md / autonomous) |
| `isLoopPersistentPreambleEnabled` | `YTn` | 220859 | `parseBool(env.CLAUDE_CODE_LOOP_PERSISTENT) \|\| featureFlag("tengu_kairos_loop_persistent", false)` — picks persistent vs non-persistent autonomous preamble |
| `isAgentPushNotifEnabled` | `TCe` | 220758 | `isPushNotifFeature() && entitlement("agentPushNotifEnabled").value` — gates `i7l()` PushNotification suffix |

## 3. Loop module `_9e` (`HUe`/`EUe`, exports @220842-220858)

`_9e = (HUe(), ro(EUe))` bound @649382. Exports consumed by `_1f`:

| Readable | Obf | Line (183) | Role |
|----------|-----|-----------|------|
| `isLoopDefaultPromptEnabled` | `o5r` | 220891 | (above) |
| `readLoopFile` | `r1i` | 220942 | Reads `loop.md` from `<projectRoot>/.claude/loop.md` then `<cwd>/loop.md`; returns `{path, content}` or `null`; truncates >25000 bytes via `WHd` (`KTn=25000`) |
| `getAutonomousLoopPreamble` | `t5r` | 220863 | Returns `qOi` (persistent) or `JWr` (non-persistent) based on `YTn()` |
| `logAutonomousLoopActivation` | `n5r` | 220866 | `logEvent("tengu_kairos_loop_persistent_activated",{variant:YTn()})` |
| `LOOP_FILE_SENTINEL` | `n1i` | 221013 | `"<<loop.md>>"` (cron-mode loop.md fire-time sentinel) |
| `LOOP_FILE_DYNAMIC_SENTINEL` | `LPt` | 221014 | `"<<loop.md-dynamic>>"` (ScheduleWakeup-mode loop.md sentinel) |
| `AUTONOMOUS_LOOP_PREAMBLE` | `BHd` (=`JWr`) | 221027 | Non-persistent preamble const |

Autonomous sentinels (defined in the ScheduleWakeup/`UAe` module, not `_9e`):

| Readable | Obf | Line (183) | Role |
|----------|-----|-----------|------|
| `AUTONOMOUS_LOOP_SENTINEL` | `Rtt` | 220801 | `"<<autonomous-loop>>"` (cron-mode autonomous sentinel) |
| `AUTONOMOUS_LOOP_DYNAMIC_SENTINEL` | `wCe` | 220802 | `"<<autonomous-loop-dynamic>>"` (ScheduleWakeup-mode autonomous sentinel) |

## 4. Prompt builders (function decls @649085-649247; closure/constants below)

| Readable | Obf | Line (183) | Role |
|----------|-----|-----------|------|
| `pushNotifOutcomeSuffix` | `i7l` | 649085 | Appends a "send a one-line outcome via PushNotification before you stop" clause when `isAgentPushNotifEnabled()` |
| `intervalFromEveryMatch` | `p1f` | 649090 | Normalizes the `EVERY_RE` regex match (`[N, unitWord]`) into `Ns/Nm/Nh/Nd` |
| `cloudOfferSection` | `a7l` | 649098 | Conditional "Offer cloud first" section (when not remote/bg and `tengu_surreal_dali` + `allow_remote_sessions` and no remote channels) |
| `sessionOnlyFooterLine` | `l7l` | 649126 | Conditional italic "_Runs until you close this session…_" footer line |
| `fixedIntervalActionBlock` | `A1f` | 649134 | The numbered "Action" block (CronCreate + confirm + execute now) for fixed-interval mode |
| `buildFixedIntervalLoopPrompt` | `g1f` | 649139 | The legacy/non-dynamic full prompt (fixed-interval only, used when `isDynamicLoopEnabled()` is false); inlines the cron table literally @649164 |
| `buildDynamicUsageMessage` | `h1f` | 649187 | Usage message for the dynamic-enabled empty-input case |
| `buildDynamicLoopPrompt` | `y1f` | 649202 | Full prompt for the dynamic-enabled case (fixed-interval mode + dynamic-mode section); inner `t` (@649203) = dynamic-mode self-pace instructions; `${m1f}` interpolated @649238 |
| `buildEmptyInputDefaultPrompt` | inner `a` in `_1f` | 649278 | Closure building the empty-input default prompt (loop.md vs autonomous × cron vs dynamic) |
| `CRON_TABLE` | `m1f` | 649367 | The `Interval pattern → Cron expression` markdown table (string literal @649368) |
| `LEGACY_USAGE_MESSAGE` | `f1f` | 649386 | Legacy usage message (non-dynamic case; declared @649365, assigned @649386) |
| `INTERVAL_RE` | `u1f` | 649383 | `/^\d+[smhd]$/` (declared @649364, assigned @649383) |
| `EVERY_RE` | `d1f` | 649384 | `/^every\s+(\d+)\s*(s\|sec\|...\|d\|day\|days)\s*$/i` (declared @649365, assigned @649384) |
| `DEFAULT_INTERVAL` | `agt` | 649363 | `"10m"` |

## 5. Tool-name constants used by the prompts

| Readable | Obf | Line (183) | Value |
|----------|-----|-----------|-------|
| `CRON_CREATE_TOOL_NAME` | `rI` | 221670 | `"CronCreate"` |
| `CRON_DELETE_TOOL_NAME` | `U2` | 221671 | `"CronDelete"` |
| `DEFAULT_MAX_AGE_DAYS` | `ree` | 221680 | `recurringMaxAgeMs / 86400000` (auto-expiry days) |
| `SKILL_TOOL_NAME` | `mH` | 221449 | `"Skill"` |
| `ASK_USER_QUESTION_TOOL_NAME` | `Ff` | 221315 | `"AskUserQuestion"` |
| `MONITOR_TOOL_NAME` | `yv` | 220793 | `"Monitor"` |
| `SCHEDULE_WAKEUP_TOOL_NAME` | `$g` | 220800 | `"ScheduleWakeup"` |
| `TASK_LIST_TOOL_NAME` | `IL` | 220833 | `"TaskList"` |
| `TASK_STOP_TOOL_NAME` | `uP` | 220834 | `"TaskStop"` |
| `PUSH_NOTIFICATION_TOOL_NAME` | `G9` | 220751 | `"PushNotification"` |

## 6. Helper predicates used inside builders

| Readable | Obf | Line (183) | Role |
|----------|-----|-----------|------|
| `parseBoolean` | `st` | 163 | env-truthy parse (`1/true/yes/on`) |
| `isBackgroundSession` | `yi` | 103598 | `getSessionKind()==="bg"` |
| `isFeatureFlagEnabled` | `ct` | 146595 | feature-flag read (no min-interval) |
| `isFeatureAllowed` | `di` | 147998 | entitlement gate (`allow_remote_sessions`) |
| `getAllowedChannels` | `qb` | 3665 | returns `state.allowedChannels` (`.length===0` ⇒ no remote channels connected) |
| `isAgentPushNotifEnabled` | `TCe` | 220758 | (above) |

## 7. Verbatim prompt strings captured (183 line ranges)

| String | Obf owner | Lines (183) |
|--------|-----------|-------------|
| `pushNotifOutcomeSuffix` body | `i7l` | 649086-649088 |
| `cloudOfferSection` body | `a7l` | 649106-649123 |
| `sessionOnlyFooterLine` (both branches) | `l7l` | 649128-649130 |
| `fixedIntervalActionBlock` body | `A1f` | 649135-649137 |
| `buildFixedIntervalLoopPrompt` template (cron table inlined @649164) | `g1f` | 649140-649185 |
| `buildDynamicUsageMessage` body | `h1f` | 649188-649200 |
| `buildDynamicLoopPrompt` inner-`t` (@649203) dynamic instructions + outer template | `y1f` | 649203-649249 |
| empty-input default closure (dynamic + cron, loop.md + autonomous) | inner `a` in `_1f` | 649278-649345 |
| `CRON_TABLE` | `m1f` | 649367-649368 (one packed string literal) |
| `LEGACY_USAGE_MESSAGE` | `f1f` | 649386-649398 |
| Non-persistent autonomous preamble | `JWr` | 220701-220725 |
| Persistent autonomous preamble | `qOi` | 220726-220757 |

Cross-validated against extracted prompt assets:
`assets/prompts/093_autonomous-loop-check-youre-being-invok.txt` (= `JWr`, non-persistent),
`097_autonomous-loop-check-youre-being-invok.txt` (= `qOi`, persistent),
`125_loop-schedule-a-recurring-prompt-parse.txt` (= `g1f`/`y1f` body),
`130_schedule-when-to-resume-work-in-loop-dyn.txt` (ScheduleWakeup tool description),
`306/318/321` (fire-time tick reminders — runtime side, not in skill registration).

## 8. v2.1.88 ancestor mapping

`src/skills/bundled/loop.ts` `registerLoopSkill`:

| v2.1.88 ancestor | v2.1.183 equivalent | Note |
|------------------|---------------------|------|
| `DEFAULT_INTERVAL = '10m'` | `agt = "10m"` (`DEFAULT_INTERVAL`) | unchanged |
| `USAGE_MESSAGE` | `f1f` (`LEGACY_USAGE_MESSAGE`) | unchanged wording (legacy/non-dynamic) |
| `buildPrompt(args)` | `g1f` (`buildFixedIntervalLoopPrompt`) | same body + `${cloudOfferSection()}` and `${sessionOnlyFooterLine()}` injected |
| `getPromptForCommand` empty→USAGE; else→buildPrompt | now multi-branch on `jAe()` / `o5r()` | greatly expanded |
| `isEnabled: isKairosCronEnabled` | `isEnabled: IB` (`isLoopEnabled`) | same gate, re-mangled |
| (no `aliases`) | `aliases: ["proactive"]` | added pre-156 |
| (no `menuDescription`) | `menuDescription: "Repeat a prompt or command on an interval (e.g. /loop 5m /foo)"` | **NEW in 183** |
| `registerBundledSkill` (= `ap` @546973) | identical emitted `Command` | now also forwards `menuDescription` |

## 9. 2.1.156 → 2.1.183 delta

**Almost everything is identical.** The full dynamic-mode / loop.md / autonomous-default / persistent-preamble machinery is already present in 2.1.156 (verified: `tengu_kairos_loop_dynamic`, `tengu_kairos_loop_prompt`, `tengu_kairos_loop_persistent`, the cloud-offer `tengu_surreal_dali` section, the "spirit of the task" persistent preamble, "broaden once" — all present in 156).

**The single behavioral delta is the new `menuDescription` field:**
- 2.1.156 registrar `bA` (=`registerBundledSkill`) has **no** `menuDescription` field anywhere in the bundle (`grep menuDescription` → 0 hits).
- 2.1.183 registrar `ap` reads `menuDescription: e.menuDescription` @546993, and `_1f` sets `menuDescription: "Repeat a prompt or command on an interval (e.g. /loop 5m /foo)"`.
- `menuDescription` is the short slash-menu label; `description` remains the model-invocation description.

(Re-mangling noise between versions: `_1f`←`nhz`, `ap`←`bA`, `IB`←`ch`, `jAe`←`hwH`, `_9e`←`_bH`, `p1f`←`Uhz`, `u1f`←`phz`? regexes, etc. — these are not behavioral changes.)

## 10. Open questions

- `menuDescription` rollout: the 183 registrar forwards it but I did not confirm where the slash-menu UI *renders* `menuDescription` vs `description` (out of scope for the skill file; the field is plumbed through `ap`@546993).
- The 2.1.88→2.1.183 `buildFixedIntervalLoopPrompt` body is byte-identical except the two injected `${cloudOfferSection()}` / `${sessionOnlyFooterLine()}` interpolations; those sections themselves predate 156 (could not be in 2.1.88 — no ancestor for them, so they are reconstructed purely from the 183 bundle, marked accordingly).
