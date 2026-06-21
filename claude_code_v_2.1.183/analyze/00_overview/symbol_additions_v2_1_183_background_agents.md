# Symbol Additions — v2.1.183 Background Agents (nested-subagent depth limit, `/bg`, daemon fleet) — the v2.1.156 → v2.1.183 DELTA

> Consolidated obfuscated→readable symbol manifest for the **Background Agents** subsystem **as it
> exists in v2.1.183** — the headline cross-cutting **nested-subagent 5-level depth limit** (2.1.172 /
> 2.1.181), the daemon worker **env-isolation** rework (2.1.181 ANTHROPIC_* provider-env leak fix),
> the reworked **`claude agents --json`** surface (2.1.169 / 2.1.162), the re-derived **`/bg`
> (`/background`)** / **`/stop`** command surface, and the daemon **retire/respawn** refinements.
>
> This is a delta-tree manifest: it records the **v2.1.183** obfuscated names and, in the Description
> column, the **v2.1.156** obfuscated alias (e.g. "v2.1.156 `zh8`") so every rename is traceable.
> **The v2.1.156 names DO NOT apply in v2.1.183 — the bundler re-mangles every build** (confirmed:
> `zh8`→`sKn`, `Ah8`→`iKn`, `Fwz`→`lgf`, `gwz`→`ugf`, `owz`/`awz`→`hgf`/`ygf`, `Yh8`→`aKn`,
> `OH9`→`JMl`, `Eq9`→`_Fl`, `Y7q`→`jLo`, `bBz`→`aGf`, `qSH`→`m4e`, `SF`→the `BgWorkerHandle` class).
> Every line below was re-derived by reading the declaration in the v2.1.183 bundle during this pass.
>
> **Three families are net-new in v2.1.183 with NO v2.1.156 ancestor** (`grep` = 0 in the v2.1.156
> bundle): the **depth mechanism** (`v1i`, `agentDepth`, `spawnDepth`, the `Gz`/`cio`/`bte` threading);
> the **provider-auth scrub** (`GLo`/`XLt`/`JLt`/`WLo` host-auth surface); and the **`agents --json`
> lifecycle surface** (`id`/`state`/`waitingFor`/`--all`, the `lGf` state mapper, the `rDt` stale
> reconciler, the `aGf` three-source merge). The `gFl` "detritus" inflight allowlist + `detritusOnly`
> flag and the `prewarm` respawn loop (`Wzn` gate) are also new on the daemon side.

## Home index

These rows fold into:
- **`symbol_index_core_features.md`, "## Module: Background Agents"** — the primary home for the
  `/bg`/`/stop` command surface (`JMl`, `sKn`, `iKn`, `ugf`, `lgf`, `hgf`/`ygf`, `aKn`, `Egf`/`Hgf`),
  the worker env-isolation builders + scrub lists (`_Fl`, `YGf`, `WLo`, `jLo`, `GLo`, `XLt`, `JLt`,
  and the constituent provider lists `k3r`/`YLt`/`C3r`/`I3r`/`x3r`/`Y0i`), the `agents --json` surface
  (`aGf`, `lGf`, `cGf`, `rDt`, `QK`, `m4e`, `zzn`, `Bie`, `ph`, `jFe`, `Uwe`, `vcc`, `Tcc`), and the
  daemon retire/respawn deltas (`gFl`/`detritusOnly`, the `respawnIfIdleStale`/`retireIfSettled`
  methods, the `Wzn` prewarm gate).
- **`symbol_index_core_execution.md`** — for the subagent / tool-execution symbols the depth limit
  threads through the broader runtime: the depth constant `v1i`, the depth reader `Gz`, the universal
  tool filter `cio`, the resolved-tools builder `bte`, the Agent-tool name const `vs` + matcher `Rc`,
  the Agent tool def `f3n`, the local-agent task registrar `Xut`, the `isLocalAgentTask` predicate
  `od`, and the `isMainAgent`/`isSubagent` discriminators `jz`/`$Cr`. These are generic execution
  plumbing the depth mechanism rides on; their canonical home is the execution index.
- **`symbol_index_infra_platform.md`** — the provider auth/config env lists and the host-auth predicate
  (`GLo`/`XLt`/`JLt`/`WLo` and constituents) belong to the platform Auth/Model surface; the telemetry
  typed-passthroughs (`Qe`/`Ne`) and the feature-gate readers (`Wzn`, `Zyn`, `L1i`/`vvd`) are platform
  telemetry/config helpers.

The full deep-analysis prose lives in `36_background_agents/` —
[`README.md`](../36_background_agents/README.md),
[`nested_subagent_depth_limit.md`](../36_background_agents/nested_subagent_depth_limit.md),
[`worker_env_isolation_2181.md`](../36_background_agents/worker_env_isolation_2181.md),
[`agents_json_surface_2169.md`](../36_background_agents/agents_json_surface_2169.md),
[`bg_command_surface_and_retire_delta.md`](../36_background_agents/bg_command_surface_and_retire_delta.md).
This file is the flat symbol manifest; the five module docs use list-format references back to it.

## Cross-validated against

- **v2.1.183 bundle self-cross-check.** Every row's `File:Line` was read directly from
  `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
  during this pass — not inferred from the module docs. Spot-confirmed declarations: `v1i = 5`@221800,
  `function Gz(e)`@103152, `if (Rc(i, vs)) return s < v1i;`@371194, `function bte(e,t,n=!1,r=!1,o=!1,s=0)`@371230,
  `var vs = "Agent"`@149939, `function Rc(e,t)`@149965, `(f3n = pi({`@423505, `function Xut({`@446073,
  `function od(e)`@445761, `gt(JMl,{spawnBackgroundFork:()=>sKn,…})`@566833, `function iKn(e,t)`@566927,
  `function ugf(e)`@566957, `lgf = async (e,t,n) =>`@567091, `async function aKn(e)`@567155,
  `function _Fl(e,t,n,r,o)`@594705, `function WLo(e)`@594777, `(GLo = [`@595849, `((jLo = [`@595797,
  `(XLt = [`@191672, `(JLt = ["VERTEX_REGION_CLAUDE_"]))`@191730, `(gFl = ["local_bash",…])`@595796,
  `function YGf(e)`@695919, `async function aGf(e,t)`@691275, `function lGf(e,t)`@691342,
  `async function cGf(e)`@691363, `function rDt(e,t)`@192384, `async function QK(e)`@192363,
  `async function m4e()`@360113, `async function zzn()`@564518, `function Wzn(){return ct("tengu_bg_attach_upgrade",!0)}`@564348,
  `function Zyn()`@148956, `.option("--all", "With --json: include completed sessions…")`@695321,
  `async respawnIfIdleStale(e,t="sweep")`@594895, `async retireIfSettled(e,t,n=e)`@594936. All matched.
- **v2.1.156 before-picture.** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
  (649,979 lines) — the v2.1.156 obfuscated aliases recorded in the Description column come from the
  v2.1.156 baseline `symbol_additions_v2_1_156_background_agents.md` and the baseline
  `36_background_agents/` docs. Confirmed net-new (`grep` = 0 in v2.1.156): `agentDepth`, `spawnDepth`,
  `detritusOnly`, the `"prewarm"` literal, `tengu_bg_attach_upgrade`. Confirmed re-mangling of the `/bg`
  triple and the env-builder/printer/worker-handle as listed above.
- **v2.1.88 named TypeScript** (`/lyz/codespace/3rd/claude-code/src/`) — the background-agents daemon
  fleet, the depth mechanism, and the `agents --json` lifecycle surface are all NEW-post-2.1.88 (the bg
  daemon subsystem GA'd well after 2.1.88); no precursor exists in the named TS. Carried from the
  v2.1.156 baseline, not re-derived.

---

## Module: Background Agents — Nested-subagent depth limit (core execution)

The headline 2.1.172 / 2.1.181 delta. The whole 5-level cap is a one-line filter predicate over the
Agent tool (`if (Rc(i, vs)) return s < v1i;`) plus depth threading at every spawn surface. **No
v2.1.156 ancestor** — `agentDepth`/`spawnDepth` grep = 0 in the v2.1.156 bundle; the v2.1.156 gate was
a team-only boolean inside `uE6`'s async branch (`R7() && mG()` → keep the Agent tool). Canonical home:
`symbol_index_core_execution.md` (Subagent / Tools). Full analysis:
[`nested_subagent_depth_limit.md`](../36_background_agents/nested_subagent_depth_limit.md).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `v1i` | `SUBAGENT_DEPTH_LIMIT` | cli_inner_pretty.js:221800 | constant | Hard-coded `5` — the nested-subagent depth cap. Declared in the tool-filter comma-list (`LCe,T5r,UPt,v1i=5,T1i,w5r`). **NEW** (concept absent in v2.1.156). |
| `Gz` | `getAgentDepth` | cli_inner_pretty.js:103152 | function | `if (e.agentType==="main") return 0; return e.depth ?? 0;` — per-branch depth read. `Gz(parent)+1` is the universal child-depth expression. **NEW.** |
| `cio` | `filterSubagentTools` | cli_inner_pretty.js:371188 | function | Universal subagent tool filter; depth gate at :371194 `if (Rc(i,vs)) return s < v1i;` placed **above** the async branch (the 2.1.181 fg/bg-shared-limit mechanism). v2.1.156 predecessor `uE6` (v2.1.156 :278956, team-only, no `agentDepth`). |
| `bte` | `buildResolvedTools` | cli_inner_pretty.js:371230 | function | Resolved-tools builder; **new 6th param** `agentDepth (s=0)` forwarded into `cio`; also a new 5th `isTeammate (o)`. Single chokepoint for both fg and bg toolset builds → shared limit. v2.1.156 predecessor `no` (4-arg, v2.1.156 :278972). |
| `vs` | `AGENT_TOOL` (name const) | cli_inner_pretty.js:149939 | constant | `"Agent"` (sibling `c9 = "Task"`). v2.1.156 `sq` (v2.1.156 :185637). |
| `Rc` | `matchesName` | cli_inner_pretty.js:149965 | function | `e.name === t || (e.aliases?.includes(t) ?? !1)` — tool-name/alias matcher. v2.1.156 `h1`. |
| `f3n` | `agentToolDef` | cli_inner_pretty.js:423505 | object | The Agent tool object (`pi({name:vs, …})`); its `call` computes child depth `z = Gz(parent)+1`@423722, stamps `agentDepth:z`@423825, `depth:z`@423933 (async) / @423990 (sync), telemetry `agent_depth:z`@423733. |
| `Xut` | `registerLocalAgentTask` | cli_inner_pretty.js:446073 | function | Local-agent task registrar; **persists `spawnDepth`** into the durable task record (:446095) so a resume reads back the authoritative depth instead of re-deriving. |
| `od` | `isLocalAgentTask` | cli_inner_pretty.js:445761 | function | `type === "local_agent"` predicate; gates the persisted-depth read on the resume path (`(od(g)?g.spawnDepth:void 0) ?? Gz(parent)+1`@434085). |
| `jz` | `isMainAgent` | cli_inner_pretty.js:103149 | function | `e.agentType === "main"` — root-context guard beside `Gz`. |
| `$Cr` | `isSubagent` | cli_inner_pretty.js:103156 | function | The complementary subagent discriminator beside `Gz`/`jz`. |
| `L1i` | `getForkSubagentSource` | cli_inner_pretty.js:222216 | function | `CLAUDE_CODE_FORK_SUBAGENT` source resolver — enables the fork-subagent feature surface; **pre-existing in v2.1.156** (v2.1.156 :216773/:389421). Separate from the always-on `v1i` ceiling. |
| `vvd` | `isForkSubagentEnabled` | cli_inner_pretty.js:222208 | function | The `CLAUDE_CODE_FORK_SUBAGENT` env/GrowthBook gate (`y7`); toggles the fork-message/worktree-notice machinery (:222200-222227), not the depth cap. Pre-existing. |

> Spawn-site depth stampings are anonymous locals, not top-level symbols, so they are referenced by
> line in the module doc rather than tabled here: Agent-tool spawn `z = Gz(c.agentContext)+1`@423722;
> resume `y = (od(g)?g.spawnDepth:void 0) ?? Gz(o.agentContext)+1`@434085 (stamp `depth:y`@434205);
> built-in fork `d = Gz(t.agentContext)` (**no `+1`** — same-depth continuation, medium confidence)@473586,
> `spawnDepth:d`@473590 / `depth:d`@473612; workflow agent `depth: Gz(ue)+1`@417155. Telemetry
> `agent_depth` rides `tengu_agent_tool_selected`@423733 and `tengu_agent_tool_terminated`@371803.
> v2.1.156 before-picture sets cited in `nested_subagent_depth_limit.md`: `sq`/`h1`/`R7`/`mG`/`U57`/`xJ$`.

---

## Module: Background Agents — Worker env-isolation (the ANTHROPIC_* provider-env leak fix, 2.1.181)

The daemon worker-env builder rework: v2.1.156's `Eq9` ran ONE scrub pass over a pure
terminal/SSH/session list (`Y7q`, 44 entries, zero provider auth) and forwarded the rest of
`process.env` verbatim. v2.1.183's `_Fl` runs **four passes** (terminal/session + provider-auth +
vertex-prefix + host-auth branch) deleting the full provider auth/config surface unless `dispatch.env`
re-passes it. Canonical home: env builders/scrub lists in `symbol_index_core_features.md` (Background
Agents); the provider-auth lists + host-auth predicate also belong to `symbol_index_infra_platform.md`
(Auth/Model). Full analysis:
[`worker_env_isolation_2181.md`](../36_background_agents/worker_env_isolation_2181.md).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `_Fl` | `buildWorkerEnv` | cli_inner_pretty.js:594705 | function | The bg worker env builder; four scrub passes (`jLo`/`GLo`/`JLt`) + the `WLo`/`XLt` host-auth branch; exec-mode `CLAUDE_*`/`OTEL_*` purge carried over. v2.1.156 `Eq9` (v2.1.156 :559877, single-pass). |
| `YGf` | `buildSpareHostEnv` | cli_inner_pretty.js:695919 | function | **NEW (previously-undocumented).** Env for the prewarmed `--bg-pty-host`/`--bg-spare` process; same four scrub lists, **no re-pass escape**, macOS-only OAuth scrub. Evidence the prewarm path is now credential-clean (2.1.172/2.1.174 attribution, medium-low). |
| `WLo` | `isHostManagedAuth` | cli_inner_pretty.js:594777 | function | `!!ANTHROPIC_UNIX_SOCKET \|\| st(CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST) \|\| !!CLAUDE_CODE_HOST_AUTH_ENV_VAR` — pass-4 host-auth predicate, evaluated against the host snapshot. **NEW.** |
| `jLo` | `TERMINAL_SESSION_SCRUB` | cli_inner_pretty.js:595797 | variable | Pass-1 carryover terminal/SSH/session scrub list, **broadened by 7 entries** over v2.1.156 `Y7q` (adds `CLAUDE_BG_RV_AUTH`,`CLAUDE_BG_PTY_AUTH`,`CLAUDE_BG_SOCKET_TOKENS_PATH`,`CLAUDE_CODE_CHILD_SESSION`,`CLAUDE_AX_SCREEN_READER`,`ANTHROPIC_MODEL`,`SSH_CLIENT`). v2.1.156 `Y7q` (v2.1.156 :560861). |
| `GLo` | `PROVIDER_AUTH_SCRUB` | cli_inner_pretty.js:595849 | variable | **NEW (the leak fix).** Pass-2 provider auth/config union `[...k3r, ...YLt, ...C3r, ...I3r, "ANTHROPIC_CUSTOM_HEADERS","ANTHROPIC_UNIX_SOCKET","CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST","CLAUDE_CODE_HOST_AUTH_ENV_VAR"]`. No v2.1.156 ancestor. |
| `XLt` | `HOST_AUTH_TOKEN_SET` | cli_inner_pretty.js:191672 | variable | **NEW.** Resolved-token class deleted unconditionally (no re-pass) under host-managed auth: `ANTHROPIC_API_KEY`,`ANTHROPIC_AUTH_TOKEN`,`CLAUDE_CODE_OAUTH_TOKEN`,`AWS_BEARER_TOKEN_BEDROCK`,`ANTHROPIC_FOUNDRY_API_KEY`,`ANTHROPIC_AWS_API_KEY`,`ANTHROPIC_BEDROCK_MANTLE_API_KEY`. |
| `JLt` | `VERTEX_REGION_PREFIXES` | cli_inner_pretty.js:191730 | variable | **NEW.** `["VERTEX_REGION_CLAUDE_"]` — pass-3 prefix scrub for the open-ended `VERTEX_REGION_CLAUDE_<MODEL>` family (also used by the general host-auth classifier `X0i`). |
| `k3r` | `MODEL_OVERRIDE_VARS` | cli_inner_pretty.js:192032 | variable | `[...x3r, ...Y0i]` — model-name override family, composes into `GLo`. |
| `YLt` | `PROVIDER_SELECT_VARS` | cli_inner_pretty.js:191650 | variable | Provider-selection flags + resource ids (USE_BEDROCK/VERTEX/FOUNDRY, project/workspace ids, CLOUD_ML_REGION), composes into `GLo`. |
| `C3r` | `PROVIDER_BASE_URLS` | cli_inner_pretty.js:191662 | variable | The eight provider base-URL vars, composes into `GLo`. |
| `I3r` | `PROVIDER_SKIP_AUTH_FLAGS` | cli_inner_pretty.js:191681 | variable | Five `CLAUDE_CODE_SKIP_*_AUTH` flags, composes into `GLo`. |
| `x3r` | `MODEL_DEFAULT_VARS` | cli_inner_pretty.js:191688 | variable | `ANTHROPIC_DEFAULT_*_MODEL[...]` / `ANTHROPIC_SMALL_FAST_MODEL` / `CLAUDE_CODE_SUBAGENT_MODEL` family; constituent of `k3r`. |
| `Y0i` | `CUSTOM_MODEL_OPTION_VARS` | cli_inner_pretty.js:191710 | variable | `ANTHROPIC_CUSTOM_MODEL_OPTION[...]` family; constituent of `k3r`. |
| `X0i` | `isHostAuthVar` | cli_inner_pretty.js:191641 | function | General host-auth-var classifier reusing the `JLt` vertex prefix; confirms `JLt` is the canonical provider-region prefix list, not a bg-only invention. |
| `st` | `parseBoolean` | cli_inner_pretty.js:163 | function | `"1"/"true"/"yes"/"on"` truthiness helper used by `isHostManagedAuth`. |

> v2.1.156 before-picture (cited in the module doc, not re-tabled): builder `Eq9` (v2.1.156 :559877),
> single scrub list `Y7q` (v2.1.156 :560861), platform helper `n$` (currentPlatform). Neither `Eq9`
> nor `Y7q` appeared in the v2.1.156 symbol-index files (this builder was net-new analysis).

---

## Module: Background Agents — `claude agents --json` surface (2.1.169 / 2.1.162)

v2.1.156's `bBz` printed **live processes only** (`qSH` scan → `{pid,cwd,kind,startedAt,sessionId,name,
status}`), so just-dispatched and blocked-but-retired jobs were invisible (the 2.1.169 bug). v2.1.183's
`aGf` merges **three sources** (live procs + on-disk job states + daemon shorts) keyed on job id, adds
`id`/`state`/`waitingFor`, and a new `--all` flag. Canonical home: `symbol_index_core_features.md`
(Background Agents). Full analysis:
[`agents_json_surface_2169.md`](../36_background_agents/agents_json_surface_2169.md).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `aGf` | `printAgentsJson` | cli_inner_pretty.js:691275 | function | Three-source merge (`m4e()`+`QK()`+`zzn()`) two-pass JSON builder keyed on `jobId`; prefers live-proc fields, falls back to disk-state; adds `id`/`state`/`waitingFor`; honors `--all`; async write + chronological sort. v2.1.156 `bBz` (v2.1.156 :642728, live-only). |
| `lGf` | `mapJobState` | cli_inner_pretty.js:691342 | function | **NEW.** Derives the JSON `state` ∈ `working`/`blocked`/`done`/`failed`/`stopped` from reconciled disk state + live status (busy→working; terminal-and-settled→done/failed/stopped with a recurring-job success exception; tempo blocked / waiting→blocked; else working). No v2.1.156 ancestor. |
| `cGf` | `agentsCommandHandler` | cli_inner_pretty.js:691363 | function | Wires `--json` + `--all` through: `await t(e.cwd, e.all === !0)` (**two args** now). Env guard `mQe`/`FM`/`mTe` is carryover (was `XgH`/`Ap`/`RMH`). |
| `rDt` | `reconcileStaleStates` | cli_inner_pretty.js:192384 | function | **NEW.** Auto-fails/auto-blocks process-less on-disk states past the `RAd` grace window unless terminal or daemon-tracked (`$Ad` does the transition). Contributing mechanism for the "Working forever" class (low confidence on exact site). |
| `QK` | `readAllJobStates` | cli_inner_pretty.js:192363 | function | Reads every on-disk `state.json` under `wL()`, marks `pinned` from `UFe()`; the persistent source surviving worker retirement (covers the gap `bBz` had). |
| `m4e` | `scanLiveProcesses` | cli_inner_pretty.js:360113 | function | Live-PID scanner — **byte-identical** to v2.1.156 `qSH` (v2.1.156 :373239): registry read + liveness/`procStart` probe + dead-lock-file GC. The only source `bBz` had. |
| `zzn` | `listDaemonShorts` | cli_inner_pretty.js:564518 | function | **NEW source.** Daemon RPC roster `{shorts, records}`; only `i.shorts` is consumed (feeds the "known/live" set `rDt` uses to decide auto-fail). |
| `Bie` | `classifyTerminal` | cli_inner_pretty.js:192481 | function | `done`→`"success"`, `failed`→`"failure"`, `stopped`→`"stopped"`, else `null`; the terminal classifier behind `lGf`/`ph`. |
| `ph` | `isTerminal` (settled) | cli_inner_pretty.js:192490 | function | `Gk(e.state) && e.tempo !== "active"` — terminal label AND settled; reused as the `isSettled` predicate by the worker handle. |
| `jFe` | `isRecurring` | cli_inner_pretty.js:192504 | function | `routine !== void 0 \|\| inFlight?.kinds.includes("session_cron") \|\| oDt(e)` (`/loop`) — the recurring-job exception in `lGf` (a successful loop/cron cycle is not reported `done`). |
| `Uwe` | `originCwdOf` | cli_inner_pretty.js:192496 | function | Resolves a job's origin cwd (de-worktree) for the `--cwd` containment test. |
| `vcc` | `sanitize` (name) | cli_inner_pretty.js:691333 | function | **NEW.** Strips control chars + collapses whitespace from emitted names; v2.1.156 emitted raw `K.name`. |
| `Tcc` | `normalizeStatus` | cli_inner_pretty.js:691339 | function | Normalizes the live-proc transport status to `idle`/`waiting`/`busy` (the same status logic v2.1.156 inlined). |

> v2.1.156 before-picture (cited in the module doc, not re-tabled): printer `bBz` (v2.1.156 :642728),
> sole source `qSH` (v2.1.156 :373239), JSON stringify `IH`, sync write `process.stdout.write`,
> telemetry `SH`, command def @v2.1.156 :646279 (`--json` only, "Print live sessions", no `--all`),
> env guard `XgH`/`Ap`/`RMH`. The `--all` flag def is at cli_inner_pretty.js:695321 (v2.1.183).

---

## Module: Background Agents — `/bg` (`/background`) + `/stop` command surface (re-mangled carryover)

The `/bg` machine is the same six-function flow as v2.1.156, every identifier re-minified, with **two**
genuinely-new micro-conditions inside `sKn` (the `left_arrow` failure-placeholder branch and the
`Zyn()` effort-flag gate). The end-to-end reasoning stays the baseline
`background_slash_command.md`; canonical home: `symbol_index_core_features.md` (Background Agents →
`/background` Command Surface + Lifecycle Commands). Full re-derivation:
[`bg_command_surface_and_retire_delta.md`](../36_background_agents/bg_command_surface_and_retire_delta.md).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `JMl` | `backgroundModule` | cli_inner_pretty.js:566833 | object | ESM export namespace; bundler-preserved triple `{spawnBackgroundFork:()=>sKn, deriveBackgroundSeed:()=>iKn, call:()=>lgf}`. v2.1.156 `OH9` (v2.1.156 :542679). |
| `sKn` | `spawnBackgroundFork` | cli_inner_pretty.js:566834 | function | Argv builder (`--resume <id> --fork-session [--reply-on-resume] …`) over the unified dispatcher `PX`; worktree handoff; async auto-naming. **NEW** `left_arrow` failure-placeholder branch (@566884) + `Zyn()` gate on `--effort` (@566860). v2.1.156 `zh8` (v2.1.156 :542680). |
| `iKn` | `deriveBackgroundSeed` | cli_inner_pretty.js:566927 | function | Reverse-scan transcript → `{intent, name, nameSource, detail}`. v2.1.156 `Ah8` (v2.1.156 :542733). |
| `ugf` | `BackgroundForkPrompt` | cli_inner_pretty.js:566957 | function (React) | Confirm UI: six store selectors feed the spawn, auto-confirm-when-idle (`useState(count===0)`), once-only `useRef` fork effect, `tengu_background_fork`/`_declined` telemetry. v2.1.156 `gwz` (v2.1.156 :542763). |
| `lgf` | `backgroundCall` | cli_inner_pretty.js:567091 | function | `call` handler: three guards (already-bg `yi()`→`tengu_background_already_bg`; persistence-off `dV()`; empty-seed) then render `ugf`. v2.1.156 `Fwz` (v2.1.156 :542895). |
| `hgf` / `ygf` | `backgroundCommandDef` | cli_inner_pretty.js:567140 | object | `local-jsx` def `{name:"background", aliases:["bg"], argumentHint:"[prompt]", immediate:(e)=>!e.trim(), isEnabled:()=>!0, load:…}` (`ygf = hgf` export alias). v2.1.156 `owz`/`awz` (v2.1.156 :542938). |
| `aKn` | `stopSelfSession` | cli_inner_pretty.js:567155 | function | `/stop` impl: emits `tengu_bg_agent_action{action:"stop"}`, writes terminal `state:"stopped"` to the current bg job (only if `!ph(r)`), prints "Session stopped.", exits. v2.1.156 `Yh8` (v2.1.156 :542955). |
| `Egf` | `stopCommandDef` | cli_inner_pretty.js:567208 | object | Interactive `/stop` `local-jsx` def (`immediate:!0`, `isEnabled:yi`). v2.1.156 `/stop` def on the `Yh8` region. |
| `Hgf` | `stopCommandDefNonInteractive` | cli_inner_pretty.js:567208 | object | **NEW headless variant** `/stop` `type:"local"`, `supportsNonInteractive:!0` (`claude stop` / SDK), `isEnabled:yi`. |
| `Gye` | `requestDaemonDetach` | cli_inner_pretty.js:477381 | function | Guard-1 already-bg path: ask the daemon to detach this client (no-op unless on daemon backend). v2.1.156 `bzH` (v2.1.156 :457636). |
| `Zyn` | `launchEffortFlagsUnpinned` | cli_inner_pretty.js:148956 | function | **NEW gate** on `--effort` propagation: `Boolean(unpinOpus47/48/Fable5 launch-effort flags)`; v2.1.156 propagated `--effort` unconditionally. |
| `cgf` | `AUTO_NAME_TIMEOUT_MS` | cli_inner_pretty.js:567109 | constant | `3000` ms timeout on the async auto-naming LLM call (`Nft(...,AbortSignal.timeout(cgf))`). v2.1.156 `Qwz`. |
| `Qe` | `fromString` (telemetry passthrough) | cli_inner_pretty.js:137 | function | Value-preserving typed passthrough (`(v)=>v`); `{action:Qe("stop")}` records exactly `"stop"`. Cosmetic — schema-typing only. |
| `Ne` | `fromEnum` (telemetry passthrough) | cli_inner_pretty.js:140 | function | Value-preserving typed passthrough; `{via:Ne(viaSource)}` records the raw `viaSource`. Cosmetic. |

> Generic primitives the `/bg` UI consumes are pre-existing and homed elsewhere (not re-tabled):
> `yi` (`isBackgroundSession`, @103598), `dV` (`isSessionPersistenceDisabled`, @570534), `PX`
> (`spawnBgSession`, the re-mangled v2.1.156 `ol`, @565815), `Z5n` (`countInflightTasks`, @477127),
> `Nft` (`generateSessionName`, @516693), `Nwe` (`setSessionName`, @192249), the store-selector hook
> `ft` and its selectors `ggf`/`Agf`/`mgf`/`fgf`/`pgf`/`dgf`. v2.1.156 before-picture aliases:
> `v7`/`NWH`/`ol`/`hV8`/`D$`.

---

## Module: Background Agents — Daemon retire/respawn refinements (delta over `worker_retire_respawn_2156.md`)

Mostly carryover from the v2.1.156 `BgWorkerHandle` (`SF`) design. The genuine v2.1.183 deltas are the
`trigger` parameter, the `gFl` "detritus" inflight allowlist + `detritusOnly` flag, and the `prewarm`
respawn loop. **Correction carried from the module doc:** the cliVersion-equality stale check and the
`session_cron`/`routine` retire guards that the dossier listed as additions are actually **carryover**
(present identically in v2.1.156). Canonical home: `symbol_index_core_features.md` (Background Agents →
worker lifecycle). Full analysis:
[`bg_command_surface_and_retire_delta.md`](../36_background_agents/bg_command_surface_and_retire_delta.md) Part B.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `respawnIfIdleStale` | `BgWorkerHandle.respawnIfIdleStale` | cli_inner_pretty.js:594895 | method | **NEW `trigger` param** `(pinnedSet, trigger="sweep")` (`sweep`/`attach`/`prewarm`) gating two branches (recent-input busy on non-attach; settled-leave-alone only on sweep) + the new inflight/detritus guard + `trigger` on `tengu_bg_respawn_stale`. v2.1.156 was single-arg (v2.1.156 :560029). |
| `retireIfSettled` | `BgWorkerHandle.retireIfSettled` | cli_inner_pretty.js:594936 | method | **NEW `detritusOnly` carve-out** in the inflight guard + `detritusOnly` field on `tengu_bg_retired` (:595008). cliVersion-equality + `session_cron`/`routine` guards are **carryover** (v2.1.156 :560062/:560113-560114). |
| `gFl` | `DETRITUS_KINDS` | cli_inner_pretty.js:595796 | variable | **NEW.** `["local_bash","in_process_teammate","dream"]` — in-flight kinds that do not block retire/respawn of an already-settled worker. `detritusOnly` grep = 0 in v2.1.156. |
| `Wzn` | `isAttachUpgradeEnabled` | cli_inner_pretty.js:564348 | function | **NEW.** `ct("tengu_bg_attach_upgrade", !0)` feature gate (default on) for the prewarm respawn loop. `tengu_bg_attach_upgrade` grep = 0 in v2.1.156. |

> The supervisor-tick **prewarm respawn loop** (cli_inner_pretty.js:697259-697283) is a code block, not a
> named symbol: gated by `Wzn()`, budgeted by `ct("tengu_bg_prewarm_per_sweep", 3)` (respawn budget) +
> a `q=12` scan budget, it respawns non-pinned, version-mismatched, idle workers via
> `respawnIfIdleStale(void 0, "prewarm")`. The rest of the tick (sleep/wake `shiftGraceClocksForward`
> guard, low-mem grace selection, `pins.json` reload via `UFe()`/v2.1.156 `Qw$`, pinned respawn loop,
> retire-all pass, low-mem pinned-shed `tengu_bg_retire_pinned_low_mem`@697251 with the empty-Set
> bypass `hWf`) is **carryover** — see `worker_retire_respawn_2156.md`. v2.1.156 before-picture:
> `respawnIfIdleStale`@v2.1.156 :560029, retire guards @v2.1.156 :560113-560114, no `"prewarm"` literal.

---

## Telemetry events (event-name reference, not symbol mappings)

These `tengu_*` / `cli_*` events are emitted by this module in v2.1.183. Emit sites are cited in the
module docs; this list is for cross-referencing event names, not symbol lookup.

- `agent_depth` (field on `tengu_agent_tool_selected`@423733 / `tengu_agent_tool_terminated`@371803) — the depth of a spawned/terminated subagent. **NEW** (no "depth-limit-hit" event — enforcement is by tool removal).
- `tengu_background` / `tengu_background_fork` / `tengu_background_spawn_failed` / `tengu_background_declined` — `/bg` handoff (`via_flag`/`via`; `confirmed`/`inflight_count`/`mid_turn`/`had_prompt`/`had_worktree`/`worktree_handed_off`) — `sKn`/`ugf`.
- `tengu_background_already_bg` — `/bg` invoked while already a bg session (Guard 1, `lgf`@567092).
- `tengu_bg_agent_action` — `/stop` self-stop (`action:"stop"`, `source`, redacted `jobSessionId`) — `aKn`@567156.
- `tengu_bg_respawn_stale` — upgrade respawn; **NEW `trigger` field** (`sweep`/`attach`/`prewarm`) — `respawnIfIdleStale`@594895.
- `tengu_bg_retired` — per-retire (`settledForMs`/`bridged`/`state`); **NEW `detritusOnly` field**@595008 — `retireIfSettled`.
- `tengu_bg_retire_pinned_low_mem` — low-mem pinned-shed last resort (carryover) — supervisor tick @697251.
- `tengu_bg_attach_upgrade` — **NEW** feature gate (default true) for the prewarm respawn loop — `Wzn`@564348.
- `tengu_bg_prewarm_per_sweep` — **NEW** feature-gate int (default 3), the prewarm respawn budget — supervisor tick @697260.
- `cli_agents_json` — `claude agents --json` ran (carryover) — `aGf`@691331.
