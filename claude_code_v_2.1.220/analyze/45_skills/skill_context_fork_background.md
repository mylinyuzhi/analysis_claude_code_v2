# `context: fork` skills become background agents (`.218`), and the frontmatter boolean coercer

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). **Baseline:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
(718,679 lines), always tagged `(193)` when quoted.

Two `.218` bullets share one region of the bundle — the skill/command frontmatter zod block at
`:157739-157890` and the value coercers immediately below it at `:158184-158221`:

> `.218` — *"Skills with `context: fork` now run in the background by default; set `background: false`
> in the skill's frontmatter to keep the caller waiting for the result inline."*
>
> `.218` — *"`yes`/`no`/`on`/`off`/`1`/`0` are now accepted for skill and plugin frontmatter booleans,
> alongside `true`/`false`."*

Both are **NET_NEW**, but the first bullet sits on top of a well-known trap that
[`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §3 flags explicitly, and
the second turns out to be narrower *and* more interesting than the changelog says.

---

## 0. The carryover trap, settled

`context: fork` is **220=3 / 193=2**. The enum member is *not* new:

| | 2.1.220 | 2.1.193 |
|---|---|---|
| enum declaration | `context: v.enum(["inline", "fork"])` `:157788-157792` | `context: A.enum(["inline", "fork"])` `:149313-149316 (193)` |
| `agent:` companion field | `"Agent type to spawn when \`context: fork\`."` `:157793` | byte-identical, `:149317 (193)` |
| plugin-dev doc line | `` - `context`: Only set `context: fork` … `` `:788627` | `:661025 (193)` |
| skill→command projection | `executionContext: e.context === "fork" ? "fork" : void 0` `:438472` | byte-identical at `:451551 (193)` — but with **no `background:` line after it** |
| resolver | `RAo(e,t,r) => e.getContext?.(t,r) ?? e.context ?? "inline"` `:326547-326549` | same shape |

The third 220 hit is the new `background` field's own description string (`:157797`). **So the delta is
exactly two things: a new frontmatter field, and a new branch in the fork dispatcher.** Everything about
*forking* is carryover; everything about *backgrounding a fork* is new.

---

## 1. The new `background` field, and its polarity inversion

**Verdict: NET_NEW.** `Forks run as background agents` **220=1 / 193=0**;
`forkedSkillName` **220=22 / 193=0**; `Running in the background as @` **220=2 / 193=0**.

```javascript
// ============================================
// skillFrontmatterShadowSchema (excerpt) - the new `background` field and its neighbours
// Location: cli_inner_pretty.js:157788-157798
// ============================================

// ORIGINAL (for source lookup):
        context: v
          .enum(["inline", "fork"])
          .nullable()
          .optional()
          .describe("Where the skill runs: `inline` expands into the current conversation; `fork` spawns a subagent."),
        agent: FP().optional().describe("Agent type to spawn when `context: fork`."),
        background: Ist()
          .optional()
          .describe(
            "Only for `context: fork`. Forks run as background agents that report back as a task notification instead of blocking the turn; set `false` to keep the caller waiting for the result in-line.",
          ),

// READABLE (for understanding):
        context: looseScalar()
          .enum(["inline", "fork"]).nullable().optional()
          .describe("Where the skill runs: `inline` expands into the current conversation; `fork` spawns a subagent."),
        agent: looseScalar().optional().describe("Agent type to spawn when `context: fork`."),
        background: looseScalar()          // NEW in 2.1.220 — note: NOT v.boolean()
          .optional()
          .describe("Only for `context: fork`. Forks run as background agents … set `false` to keep the caller waiting …"),

// Mapping: bJi→skillFrontmatterShadowSchema, Ist/FP→looseScalar (both alias _Ji), v→zod
```

### 1.1 The schema does not validate this field — and that is deliberate

`Ist` and `FP` are **the same function**. `:157724` declares
`_Ji = () => v.union([v.string(), v.number(), v.boolean(), v.null()])` and `:157737-157738` assigns
`FP = _Ji, Ist = _Ji`. So `background: Ist()` accepts a string, a number, a boolean or null — it enforces
nothing.

That is because this whole object is a **shadow schema**, not a validator. Its only consumer is `uRt`
(`:157712-157723`), which `safeParse`s the frontmatter and, on failure, emits *telemetry only*:

```javascript
// ============================================
// reportFrontmatterShadowMismatch - shadow-schema drift telemetry (no enforcement)
// Location: cli_inner_pretty.js:157712-157723
// ============================================

// ORIGINAL (for source lookup):
function uRt(e, t) {
  try {
    let r = LIg[e]().safeParse(t);
    if (r.success) return;
    for (let n of r.error.issues)
      if (n.code === "unrecognized_keys") for (let o of n.keys) hru("tengu_frontmatter_shadow_unknown_key", e, o);
      else {
        let o = String(n.path[0] ?? "");
        hru("tengu_frontmatter_shadow_mismatch", e, `${o}:${n.code}`);
      }
  } catch {}
}

// READABLE (for understanding):
function reportFrontmatterShadowMismatch(kind /* "skill" | "agent" | "output-style" */, frontmatter) {
  try {
    let result = STRICT_SHADOW_SCHEMAS[kind]().safeParse(frontmatter);
    if (result.success) return;
    for (let issue of result.error.issues)
      if (issue.code === "unrecognized_keys")
        for (let key of issue.keys) emitOnce("tengu_frontmatter_shadow_unknown_key", kind, key);
      else emitOnce("tengu_frontmatter_shadow_mismatch", kind, `${String(issue.path[0] ?? "")}:${issue.code}`);
  } catch {}                                   // never throws: a bad schema must not break skill loading
}

// Mapping: uRt→reportFrontmatterShadowMismatch, LIg→STRICT_SHADOW_SCHEMAS, hru→emitOnce
```

`LIg` (`:157886-157890`) wraps each schema in `.strict()` so unknown keys become `unrecognized_keys`
issues. `hru` (`:157707-157711`) dedupes on `${kind}:${surface}:${detail}` via the module-level
`mru = new Set()` (`:157891`) so a repeated bad key is reported once per process. This is a **fleet
telemetry probe for frontmatter drift**, and it explains why the schema is deliberately permissive: it
must never reject a skill that the real loader would have accepted. Real coercion happens in `qde` (§2).

### 1.2 The same field name, opposite polarity, in the agent schema

The agent frontmatter schema has had a `background` field since before this window:

| Schema | Line | Description | Default |
|---|---|---|---|
| **agent** (`IIg`) | `:157855` — 193 twin `:149373 (193)`, byte-identical text | *"If true, the agent runs in the background by default."* | **false** (opt-in) |
| **skill** (`bJi`) | `:157794-157798` — **220 only** | *"Forks run as background agents … set `false` to keep the caller waiting"* | **true** (opt-out) |

Two fields, same name, in two schemas 60 lines apart, with **inverted defaults**. Anyone grepping
`background:` in the frontmatter block gets **220=2 / 193=1** and could easily mis-attribute the hit. The
agent field is also parsed by a *different, stricter* reader — see §2.4.

---

## 2. The background decision: `resolveForkBackgroundMode`

### 2.1 The predicate

```javascript
// ============================================
// resolveForkBackgroundMode - should this forked skill run as a background agent?
// Location: cli_inner_pretty.js:342396-342399
// ============================================

// ORIGINAL (for source lookup):
function qTo(e, t) {
  if (t || LE() || yn()) return !1;
  return e.background ?? !0;
}

// READABLE (for understanding):
function resolveForkBackgroundMode(command, callerForcesForeground) {
  if (callerForcesForeground                       // 1. explicit caller override
      || isBackgroundTasksDisabled()               // 2. CLAUDE_CODE_DISABLE_BACKGROUND_TASKS
      || isNonInteractiveSession())                // 3. headless / -p / SDK
    return false;
  return command.background ?? true;               // 4. frontmatter opt-out, else DEFAULT TRUE
}

// Mapping: qTo→resolveForkBackgroundMode, LE→isBackgroundTasksDisabled (:230330-230332,
//          `return Z.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS`), yn→isNonInteractiveSession
//          (:3286-3288, `return !Ot.isInteractive`), e.background→command.background
```

**What it does:** turns four independent signals into a single boolean, with the default flipped from
false (2.1.193 had no such default because it had no such branch) to true.

**How it works:**

1. `callerForcesForeground` — the `c` parameter threaded down from `cNy` (`:343504`), the slash-command
   dispatcher. The same flag also switches off attachment extraction, deny-rule replacement and turn
   marking (`:343101`, `:343103`, `:343122`), i.e. it marks a *non-user-driven* invocation where a
   detached agent would have nobody to report to.
2. `isBackgroundTasksDisabled()` reads the env var through the managed proxy `Z.` — a global kill switch
   shared with every other background surface.
3. `isNonInteractiveSession()` reads the process-global `Ot.isInteractive`. In `--print`/SDK mode there is
   no `claude agents` view and no task-notification channel, so a background fork would be a black hole.
4. Only then does the per-skill field speak, and `?? true` makes *absence* mean background.

**Why this approach:** the ordering is a **fail-closed cascade in front of a fail-open default**. Each of
the first three tests answers "is there anywhere for a background result to land?" and any one of them
being true makes the question of what the skill *wants* irrelevant. Putting the frontmatter last means a
skill author can never turn backgrounding *on* in an environment that cannot support it — `background:
true` in a headless run is silently ignored rather than producing a detached agent nobody can read. The
inverse arrangement (frontmatter first) would have required every environment check to be repeated at
each consumer.

**Key insight:** the changelog says the *default* changed. In the code, the default is the trivial part
(`?? !0`); the real engineering is the three-way environment gate in front of it, and the fail-open
fallback described in §2.3 behind it.

### 2.2 The branch that did not exist in 2.1.193

The fork dispatcher is `aNy` (`:343059`, telemetry `tengu_slash_command_forked` `:343069`). Its 2.1.193
ancestor is `A9p` (`:397679 (193)`, same telemetry event at `:397689 (193)`, same
`Executing forked slash command /${name} with agent …` log at `:397709 (193)` / `:343119`).

Diffing them: **193 has no background path at all.** `A9p` goes straight from the fork-context prep
(`MVt`, `:397704 (193)`) to the in-line progress loop at `:397710-397732 (193)`. In 220 an entire
`if (isBackground) { … }` block is spliced in between:

```javascript
// ============================================
// dispatchForkedSlashCommand (excerpt) - the new background branch
// Location: cli_inner_pretty.js:343078, 343117-343169
// ============================================

// ORIGINAL (for source lookup):
  let g = qTo(e, c),
    y = g ? { agentId: p, parentAgentId: r.agentId, depth: DI(r.agentContext) + 1, agentType: "subagent",
              isAsync: !1, isBackgroundAgent: …, ...nZ(r.agentContext) } : void 0,
  …
  if ((await r.makeFileHistorySnapshot?.($.uuid),
    w(`Executing forked slash command /${e.name} with agent ${M.agentType}`), g)) {
    d?.markTurnActive(c ? void 0 : `/${Sd(e)} ${t}`.trim());
    let K;
    try { K = await VTo({ agentId: p, agentDefinition: M, command: e, description: `/${Sd(e)} ${t}`.trim(),
                          prompt: _, promptMessages: C, context: r, canUseTool: s, getAppState: E,
                          permissionLayers: H, readFileState: I, spawnedBySkill: w6(e),
                          recordInvocationOnSuccess: b, frozenCommandDenies: R }); }
    catch (Y) { … }
    if (K) return (await d?.settleTurnEnd(null), { messages: [$, UH(
        `<local-command-stdout>Running in the background as @${K.name}</local-command-stdout>\n`
        + Cdd({ agentId: K.agentId, skillName: e.name, description: `/${Sd(e)} ${t}`.trim() }))],
        shouldQuery: !1, command: e, forkDispatched: !0 });
    b();
  }
  // …falls through to the ORIGINAL in-line progress loop when VTo returned null

// READABLE (for understanding):
  let runInBackground = resolveForkBackgroundMode(command, callerForcesForeground),
    backgroundAgentContext = runInBackground ? { agentId, parentAgentId, depth: parentDepth + 1, … } : undefined;
  …
  if (runInBackground) {
    turnTracker?.markTurnActive(callerForcesForeground ? undefined : invocationLabel);
    let spawned;
    try { spawned = await spawnForkedSkillAsBackgroundAgent({ … }); }
    catch (err) { /* abort → interrupted result; otherwise → local-command-stderr */ }
    if (spawned)
      return { messages: [userEcho, meta(`<local-command-stdout>Running in the background as @${spawned.name}</local-command-stdout>\n`
                                        + buildTaskNotificationBlock({ agentId: spawned.agentId, skillName, description }))],
               shouldQuery: false, command, forkDispatched: true };
    recordInvocation();                       // spawn refused → fall through to in-line execution
  }

// Mapping: aNy→dispatchForkedSlashCommand, qTo→resolveForkBackgroundMode,
//          VTo→spawnForkedSkillAsBackgroundAgent, Cdd→buildTaskNotificationBlock,
//          Sd→userFacingCommandName, b→recordInvocation, d→turnTracker
```

`Cdd` (`:342123-342126`) is a one-liner that JSON-encodes `{agentId, skillName, description}` (description
truncated to `Tdd = 4096`, `:342147`) inside the task-notification delimiter — this is literally how the
"reports back as a task notification" promise in the field description is fulfilled.

### 2.3 `spawnForkedSkillAsBackgroundAgent` fails *open*, and it fails open six ways

`VTo` (`:342400-342540`) returns `null` — not an exception — on six distinct refusals, and every `null`
makes `aNy` fall through to the ordinary in-line fork:

| Refusal reason (all **220=1..2 / 193=0**) | Line | Condition |
|---|---|---|
| `forked_skill_live_duplicate` | `:342426`, re-checked `:342460` | a non-terminal `local_agent` already has this `forkedSkillName` |
| `forked_skill_depth_cap` | `:342439` | `spawnDepth > getMaxSubagentSpawnDepth()` (`hee`) |
| `forked_skill_depth_chain_cap` | `:342433` | over depth **and** over the per-session spawn cap → this one **throws** |
| `forked_skill_spawn_cap` | `:342442`, re-checked `:342461` | `totalAgentSpawns >= maxSubagentsPerSession()` (`Q7r`) |
| `forked_skill_scoping_unpersistable` | `:342449` | the scoping record fails its own zod schema `FTo` (`:342113-342120`) |
| `forked_skill_scoping_write_failed` | `:342453` | the scoping record could not be written to disk |

**Why this approach:** a forked skill is *user-visible work the user asked for*. Refusing to run it because
the background-agent budget is exhausted would be a regression relative to `.217`. Returning `null` instead
of throwing turns every budget/uniqueness constraint into a **downgrade to the previous behaviour** rather
than a failure. The only case that throws is `forked_skill_depth_chain_cap` (`:342434-342437`), where the
session is *both* too deep and out of spawns; there the message —
`Subagent spawn limit reached (${n} of ${max}) past the nesting depth cap. Do the skill's work directly in
this context instead of invoking further skills.` — is aimed at the model, not the user, because at that
point in-line execution would itself consume another agent.

Note the **double-check pattern**: the live-duplicate scan and the spawn-cap test both run once at
`:342424-342442` and again at `:342458-342461`, straddling the `await Pdd(...)` scoping-record write at
`:342451`. That `await` is the only yield point in the function, so the second pass closes a
check-then-act race between two concurrent `/skill` invocations. Cheap, and precisely placed.

The depth and session caps come from `hee()` and `Q7r()` — the resolvers documented in
[`../53_subagent_limits/README.md`](../53_subagent_limits/README.md) and
`_GROUND_TRUTH_verified_anchors.md` §2/§6.1. So a background fork is charged against exactly the same
budget as an `Agent`-tool subagent: `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` (default 3, gate
`tengu_hazel_trellis`) and `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION` (default 200).

Once past the gauntlet, `VTo` builds the agent context with `isAsync: !0, isBackgroundAgent: !0,
invocationKind: "spawn"` (`:342487-342489`), allocates a display name via
`s.agentLifecycle.allocateName(r.name)` (`:342477`) — that is the `@name` in
`Running in the background as @${K.name}` — and hands off to the shared background-task runner `hIe`
(`:342505`), tagging the query `spawnedByForkedSkill: !0` (`:342517`).

### 2.4 Where the same decision is *not* made

`RAo` (`:326547`) resolves the *context* (fork vs inline), and it is consulted in three places:
the slash dispatcher (`:343690`), the `Skill` tool (`:347015`), and the stacked-command peeler
(`:343859`, as an exclusion — see [`skill_loading_and_stacking.md`](skill_loading_and_stacking.md) §2).
`qTo` is consulted in only two (`:343078`, `:346629`). The Skill-tool path at `:346629` is the model-driven
one; the slash path at `:343078` is the user-driven one. There is no third caller, so a `context: fork`
skill reached through any other route still runs in-line.

---

## 3. Frontmatter boolean coercion: `yes`/`no`/`on`/`off`/`1`/`0`

**Verdict: NET_NEW mechanism, carryover word-lists.** `qde` is 220=9 hits — but be careful: `qde(` is
**220=9 / 193=6** and the 193 hits are an *unrelated re-mangled symbol*. Trap #1 in
[`../_CONVENTIONS.md`](../_CONVENTIONS.md) §4. Derive from the code, not the name.

### 3.1 Before and after

```javascript
// ============================================
// coerceFrontmatterBoolean - tri-state frontmatter boolean coercion (the .218 change)
// Location: cli_inner_pretty.js:158201-158211
// ============================================

// ORIGINAL (for source lookup):
function otr(e) {
  return qde(e) ?? !1;
}
function qde(e) {
  if (typeof e === "boolean") return e;
  if (typeof e !== "string" && typeof e !== "number") return;
  let t = String(e);
  if (Yt(t)) return !0;
  if (su(t)) return !1;
  return;
}

// READABLE (for understanding):
function coerceFrontmatterBooleanDefaultFalse(value) {
  return coerceFrontmatterBoolean(value) ?? false;
}
function coerceFrontmatterBoolean(value) {
  if (typeof value === "boolean") return value;                 // YAML already parsed it
  if (typeof value !== "string" && typeof value !== "number") return undefined;  // object/array/null → unset
  let text = String(value);                                     // numbers stringify: 1 → "1", 0 → "0"
  if (parseTruthyToken(text)) return true;                      // 1 | true | yes | on   (case-insensitive)
  if (parseFalsyToken(text)) return false;                      // 0 | false | no | off  (case-insensitive)
  return undefined;                                             // anything else → unset, NOT false
}

// Mapping: otr→coerceFrontmatterBooleanDefaultFalse, qde→coerceFrontmatterBoolean,
//          Yt→parseTruthyToken (:1950-1955), su→parseFalsyToken (:1956-1961)
```

The 2.1.193 originals sit at the same position in the same module, three lines apart:

```javascript
// ORIGINAL (2.1.193, cli_inner_pretty.js:149589-149596):
function drt(e) {
  return e === !0 || e === "true";
}
function aje(e) {
  if (e === !0 || e === "true") return !0;
  if (e === !1 || e === "false") return !1;
  return;
}
```

So the pairing is `drt → otr` and `aje → qde`, and the change is that both now route through the shared
token parsers.

### 3.2 The word lists are *not* new — the wiring is

```javascript
// ============================================
// parseTruthyToken / parseFalsyToken - the shared env-var boolean vocabulary (CARRYOVER)
// Location: cli_inner_pretty.js:1950-1961   (2.1.193 twins at :1938 and :1944)
// ============================================

// ORIGINAL (for source lookup):
function Yt(e) {
  if (!e) return !1;
  if (typeof e === "boolean") return e;
  let t = String(e).toLowerCase().trim();
  return ["1", "true", "yes", "on"].includes(t);
}
function su(e) {
  if (e === void 0) return !1;
  if (typeof e === "boolean") return !e;
  let t = String(e).toLowerCase().trim();
  return ["0", "false", "no", "off"].includes(t);
}

// READABLE (for understanding):  identical; renamed to parseTruthyToken / parseFalsyToken
// Mapping: Yt→parseTruthyToken, su→parseFalsyToken
```

`["1", "true", "yes", "on"]` is **220=1 / 193=1** at `:1954` and `:1938 (193)`;
`["0", "false", "no", "off"]` likewise at `:1960` and `:1944 (193)`. These are the **environment-variable**
boolean parsers, present unchanged in both builds. `.218` did not invent a vocabulary; it **unified two
vocabularies that had drifted** — env vars had always accepted `yes`/`on`, frontmatter never had.

### 3.3 Why the `number` branch is the load-bearing addition

The changelog lists six accepted tokens. Five of them (`yes`, `no`, `on`, `off`, and case variants of
`true`/`false`) are reached through `String(e)` + `.toLowerCase()`. **`1` and `0` are reached through a
different branch, and would still fail without it.**

Frontmatter is parsed by `gV = (e) => Bun.YAML.parse(e)` (`:157974-157976`). Under YAML 1.2 core schema:

- `background: 1` parses to the **number** `1`, not the string `"1"`.
- `background: yes` parses to the **string** `"yes"` (YAML 1.2 dropped YAML 1.1's `y|yes|on` booleans).
- `background: True` parses to the **boolean** `true` (core schema accepts three capitalisations).

193's `aje` tested `e === !0 || e === "true"` — a strict identity check. Given `1` it matched neither, and
given `"yes"` it matched neither, so both returned `undefined` (and `drt` turned that into `false`). The
220 rewrite therefore needs **both** halves:

1. `if (typeof e !== "string" && typeof e !== "number") return;` — admits numbers, which 193 rejected
   before any comparison could run.
2. `String(e)` then `Yt`/`su` — lower-cases and trims, which handles `yes`/`ON`/`Off`/` true `.

The residual `typeof e === "boolean"` fast path at the top is what makes `background: true` (already a
YAML boolean) skip stringification entirely.

**Trade-off taken:** `qde` returns `undefined` for anything it does not recognise — `background: maybe`,
`background: 2`, `background: [a]`. That is not the same as `false`. For `background` this matters
enormously: `command.background ?? true` treats `undefined` as *true*, so **a typo in the `background`
value silently leaves the skill backgrounded**. There is no warning on this path, unlike `shell:`
(`roo`, `:158212-158221`) and `effort:` (`:438456-438457`), both of which log a `warn` naming the valid
values. The only visibility is the shadow-schema telemetry of §1.1, and even that will not fire for
`background: maybe` because `Ist()` accepts any string.

### 3.4 Where the coercer is used — and the one place it is not

`qde` call sites in 2.1.220:

| Site | Field | Loader |
|---|---|---|
| `:270624` | `background` | plugin skill/command loader (`:270530`-ish) |
| `:438474` | `background` | filesystem skill loader `jFs` (`:438444`) |
| `:438479` | `fallback` | same |
| `:271230` | `force-for-plugin` | plugin output-style loader |
| `:271231` | `keep-coding-instructions` | plugin output-style loader |
| `:530125` | `keep-coding-instructions` | user output-style loader |
| `:235445` | memory-file `pinned` state, via `efo` (`:235443-235447`) | auto-memory |

`efo` is worth a note — it converts the tri-state into a **four-valued** label
`"absent" | "malformed" | "true" | "false"`, which is only possible because `qde` distinguishes
"not recognised" from "false". That distinction is the reason `qde` exists separately from `otr`.

`otr` (default-false) is used for the two fields where absence must mean "no":
`disable-model-invocation` (`:270599`, `:438469`) and `user-invocable` (`:270601`, `:438447` — both wrapped
in `x === void 0 ? !0 : otr(x)` so *absence* means true but a *present* junk value means false).

**The gap:** the agent-markdown loader `JWu` (`:269945`) does **not** use `qde`. It parses its own
`background` field inline:

```javascript
// ORIGINAL (cli_inner_pretty.js:269975-269978):
    let u = r.background;
    if (u !== void 0 && u !== "true" && u !== "false" && u !== !0 && u !== !1)
      w(`Agent file ${e} has invalid background value '${u}'. Must be 'true', 'false', or omitted.`);
    let d = u === "true" || u === !0 ? !0 : void 0,
```

So in 2.1.220, `background: yes` works in a `SKILL.md` and warns-then-ignores in an agent `.md`. The
changelog bullet says *"skill and plugin frontmatter booleans"* and — read strictly — that is accurate;
but the asymmetry is not obvious to a user who sees the same key name in both file types. This loader
*does* call the shadow-schema probe (`uRt("agent", r)`, `:269962`), so the divergence is at least
instrumented.

---

## 4. What a reader should take away

1. **`context: fork` is old; backgrounding it is new.** The 2.1.193 dispatcher `A9p` (`:397679 (193)`) has
   no background branch; 2.1.220's `aNy` (`:343059`) has one spliced in at `:343117-343169`. Everything
   under `forkedSkillName` (**220=22 / 193=0**) is the new machinery.
2. **The default flip is one `??`, but it is wrapped in a three-signal fail-closed gate and backed by a
   six-way fail-open spawn.** Neither of those is in the changelog, and the fail-open behaviour is the
   part users will actually notice: on a busy session a `context: fork` skill quietly reverts to blocking.
3. **The boolean bullet is really a *type* bullet.** `yes`/`no`/`on`/`off` were already understood by the
   env-var parsers (`:1950-1961`, unchanged since 193); what `.218` added is the `typeof e === "number"`
   admission that lets YAML-parsed `1`/`0` reach them at all.
4. **Unrecognised booleans are `undefined`, not `false`,** and for `background` that resolves to *true*.
   That is the one place where the new leniency changes behaviour in a direction a skill author might not
   expect.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_skills_plugins.md](../00_overview/symbol_additions_v2_1_220_skills_plugins.md).

Key functions in this document:
- `resolveForkBackgroundMode` (`qTo`, `:342396`) - fail-closed gate + `background ?? true` default
- `spawnForkedSkillAsBackgroundAgent` (`VTo`, `:342400`) - six-way fail-open background spawn
- `dispatchForkedSlashCommand` (`aNy`, `:343059`) - fork dispatcher; new background branch `:343117-343169`
- `buildTaskNotificationBlock` (`Cdd`, `:342123`) - encodes the background hand-off notification
- `coerceFrontmatterBoolean` (`qde`, `:158204`) - tri-state coercer, `.218`'s real delta
- `coerceFrontmatterBooleanDefaultFalse` (`otr`, `:158201`) - default-false wrapper
- `parseTruthyToken` (`Yt`, `:1950`) / `parseFalsyToken` (`su`, `:1956`) - carryover env-var vocabulary
- `reportFrontmatterShadowMismatch` (`uRt`, `:157712`) - shadow-schema drift telemetry
- `skillFrontmatterShadowSchema` (`bJi`, `:157776`) / `agentFrontmatterShadowSchema` (`IIg`, `:157828`)
- `classifyMemoryPinnedState` (`efo`, `:235443`) - four-valued consumer of the tri-state
- `resolveSkillExecutionContext` (`RAo`, `:326547`) - fork/inline resolution (carryover)
