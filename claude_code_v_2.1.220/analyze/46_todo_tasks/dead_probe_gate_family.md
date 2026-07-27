# `tengu_dead_probe_*` — instrumented dead-code confirmation

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

`grep -c 'dead_probe'` → **220 = 32 / 193 = 0**. Not one member of this family existed in 2.1.193.
There is **no changelog bullet for any of it** — the entire mechanism is undocumented, in a window whose
changelog runs to 579 bullets.

What it is: 2.1.220 ships **25 distinct telemetry gates across 32 emission sites** whose only job is to
answer the question *"does anybody still hit this branch?"* for code Anthropic believes is already dead.
Each probe sits inside a legacy compatibility path, fires **once per process**, reports a closed-vocabulary
description of *which* legacy shape was seen — and then **lets the legacy path run exactly as before**.
Nothing is broken, nothing is refused, no user-visible behaviour changes. It is a measurement campaign
staged for a future deletion.

This document owns the family as a mechanism. Individual members whose subject matter belongs to another
module are cross-referenced in §6 — notably `tengu_dead_probe_chrome_legacy_socket`, which belongs to
[`../56_chrome_ide/`](../56_chrome_ide/), and the four `preserved_segment` sites, which belong to
[`../07_compact/`](../07_compact/).

---

## 1. The shape

Every member is one of two forms. Form A is a dedicated reporter function; form B is an inline guard.
Both are structurally identical: **latch check → latch set → emit → fall through**.

```javascript
// ============================================
// reportLegacyGlobalConfigEnv - form A: a dedicated one-shot probe reporter
// Location: cli_inner_pretty.js:267784-267787
// ============================================

// ORIGINAL (for source lookup):
function nWu(e) {
  if (K5u || !e || Object.keys(e).length === 0) return;
  ((K5u = !0), O("tengu_dead_probe_global_config_env", {}));
}

// READABLE (for understanding):
function reportLegacyGlobalConfigEnv(globalConfigEnvBlock) {
  if (alreadyReportedGlobalConfigEnv                       // 1. process-lifetime latch
      || !globalConfigEnvBlock
      || Object.keys(globalConfigEnvBlock).length === 0)   // 2. the "is it actually dead?" predicate
    return;
  alreadyReportedGlobalConfigEnv = true;                   // 3. latch before emit
  logEvent("tengu_dead_probe_global_config_env", {});      // 4. no payload — presence is the signal
}

// Mapping: nWu→reportLegacyGlobalConfigEnv, K5u→alreadyReportedGlobalConfigEnv, O→logEvent
```

The two call sites (`:267835`, `:267872`) show the defining property of the whole family — **the probe is
a statement, not an expression, and the legacy work happens on the very next line**:

```javascript
((olr = {}), nWu(xt().env), Object.assign(process.env, rlr(xt().env, "globalConfig")));
//           ^^^ probe        ^^^ the "dead" behaviour still executes
```

Form B inlines the same three steps into the branch it is measuring
(`tengu_dead_probe_taskstop_shell_id`, `:399998-400001`):

```javascript
      async validateInput({ task_id: e, shell_id: t }, r) {
        if (t !== void 0 && !CAd)
          ((CAd = !0),
            O("tengu_dead_probe_taskstop_shell_id", { with_task_id: e !== void 0 ? Ee("true") : Ee("false") }));
        let { taskRegistry: n, getAppState: o } = r,
          i = e ?? t;                          // <- `shell_id` is still honoured
```

`i = e ?? t` is the point. The probe reports that `shell_id` was used; `shell_id` still works.

### Why fire-and-continue rather than deprecate-and-warn

**What it does:** measures the reachability of a branch without changing what the branch does.

**How it works:**
1. The predicate is written as the *negation of the deletion hypothesis*. `tengu_dead_probe_plugin_toplevel_experimental`
   fires on `e === undefined && t !== undefined` (`:280062-280066`) — i.e. exactly when the code fell back
   to the deprecated top-level `themes`/`monitors` field. If the hypothesis "nobody uses the top-level
   field any more" is true, the event count is zero.
2. The latch bounds the volume: one event per process per gate, regardless of how many times the branch
   is taken. A model looping on `TaskStop(shell_id=…)` produces one event, not a thousand.
3. Control flow is untouched. There is no `throw`, no `return`, no `behavior: "ask"`, no user-visible
   string anywhere in the family (`grep` finds no message literal attached to any probe).

**Why this approach:**
- **A deprecation warning changes the data.** Warn a user that `--remote` is deprecated and they stop using
  it; the resulting zero count then proves nothing about whether it was safe to delete *before* the warning.
  A silent probe measures the population you actually have.
- **A "remove it and see who screams" release is unrecoverable in a CLI** that ships to a fleet of pinned
  installs and CI jobs. There is no server-side rollback for a deleted code path in a shipped binary.
- **Static analysis cannot answer this question.** Every one of these branches is *statically* reachable —
  the input comes from a config file on someone's disk, an argv the user typed, a model-generated tool
  call, or a wire message from an older peer. Only a census over real installs can decide.
- The trade-off is one release of latency (ship the probe, wait, read the dashboard, delete in a later
  release) plus 25 dead-weight latch variables. Both are cheap.

**Key insight:** the family converts a *judgement* ("this looks dead") into a *measurement* with a
falsifiable prediction (count == 0). The engineering practice is deletion-by-evidence, and it is visible in
the source only because the gate names say `dead_probe` out loud. Note what it implies about the release
after this one: **anything that reports zero is a candidate for removal**, so this list is a preview of
2.1.22x's removal notes.

---

## 2. The latch, and why three different latch shapes exist

Three distinct latch idioms appear, and the choice is driven by the payload's cardinality.

| Latch shape | Used when | Example |
|---|---|---|
| `let flag = false` module-scoped boolean | the probe has **no payload**, or a payload that cannot vary within one process | (cited at their set-site) `B5u` `:267285`, `K5u` `:267786`, `K6u` `:277435`, `z6u` `:277544`, `qnd` `:320075`, `wad` `:330622`, `CAd` `:400000`, `BRd` `:425387`, `ocp` `:536210`, `TEp` `:566031`, `rRp` `:587170`, `QLp` `:592810`, `Qef` `:665445`, `gcf` `:679402`, `vjf` `:741126`, `azf` `:756601`, `dhm` `:814212`, `yEm` `:828205`, plus `nsp`/`Ufp`/`oDp`/`UCm` for the four `preserved_segment` sites |
| `new Set()` keyed by the payload discriminant | the payload has a small enum and **each member is independently interesting** | `zBo` (`:508586`) keyed by `agentId`/`bash_id`/`wait_up_to`; `vqu` keyed by `themes`/`monitors`; `php` keyed by `cloud`/`remote`; `Vcf` keyed by `missing`/`divergent`; `Cvs`/`nAs` keyed by `hard`/`idle`/`request`; `rAl` (`:872115`) keyed by `parse`/`format`/`status_gate` |
| none at all | the containing function runs at most once per process anyway | `tengu_dead_probe_enable_auto_mode_flag` (`:829239`) — inside CLI entry argv handling |

The `Set` variant is the one that carries information. `zBo` (`TaskOutput`) has **three** keys and fires
up to three times in one process:

```javascript
// ============================================
// normalizeTaskOutputInput - probes each legacy TaskOutput parameter independently
// Location: cli_inner_pretty.js:508451-508467
// ============================================

// ORIGINAL (for source lookup):
    case gee: {
      let n = t,
        o =
          n.task_id == null && n.agentId != null
            ? "agentId"
            : n.task_id == null && n.agentId == null && n.bash_id != null
              ? "bash_id"
              : null;
      if (o !== null && !zBo.has(o))
        (zBo.add(o),
          O("tengu_dead_probe_taskoutput_legacy_params", { param: o === "agentId" ? Ee("agentId") : Ee("bash_id") }));
      if (n.timeout == null && typeof n.wait_up_to === "number" && !zBo.has("wait_up_to"))
        (zBo.add("wait_up_to"), O("tengu_dead_probe_taskoutput_legacy_params", { param: Ee("wait_up_to") }));
      let i = n.task_id ?? n.agentId ?? n.bash_id,
        s = n.timeout ?? (typeof n.wait_up_to === "number" ? n.wait_up_to * 1000 : void 0);
      return { task_id: i ?? "", block: n.block ?? !0, timeout: s ?? 30000 };
    }

// READABLE (for understanding):
    case TASK_OUTPUT_TOOL_NAME: {
      let raw = rawInput,
        legacyIdParam =
          raw.task_id == null && raw.agentId != null ? "agentId"
          : raw.task_id == null && raw.agentId == null && raw.bash_id != null ? "bash_id"
          : null;                                            // note: only when task_id is ABSENT
      if (legacyIdParam !== null && !reportedTaskOutputLegacyParams.has(legacyIdParam)) {
        reportedTaskOutputLegacyParams.add(legacyIdParam);
        logEvent("tengu_dead_probe_taskoutput_legacy_params",
                 { param: legacyIdParam === "agentId" ? safeLiteral("agentId") : safeLiteral("bash_id") });
      }
      if (raw.timeout == null && typeof raw.wait_up_to === "number"
          && !reportedTaskOutputLegacyParams.has("wait_up_to")) {
        reportedTaskOutputLegacyParams.add("wait_up_to");
        logEvent("tengu_dead_probe_taskoutput_legacy_params", { param: safeLiteral("wait_up_to") });
      }
      let taskId = raw.task_id ?? raw.agentId ?? raw.bash_id,                       // still honoured
        timeoutMs = raw.timeout ?? (typeof raw.wait_up_to === "number" ? raw.wait_up_to * 1000 : undefined);
      return { task_id: taskId ?? "", block: raw.block ?? true, timeout: timeoutMs ?? 30000 };
    }

// Mapping: atp→normalizeToolInput, gee→TASK_OUTPUT_TOOL_NAME (:230912), zBo→reportedTaskOutputLegacyParams
//          (:508586), Ee→safeLiteral (:138), O→logEvent (:4083)
```

**Why the `task_id == null` conjunct matters.** The probe deliberately does *not* fire when the caller sent
`task_id` **and** `agentId`. A caller that sends both is already on the new parameter and would be
unaffected by deleting the old one; counting them would inflate the "still needed" number. The predicate is
tuned to measure *dependence*, not *presence* — a subtle and correct distinction that the sibling
`taskstop_shell_id` probe makes explicit instead, by reporting `with_task_id: "true" | "false"` as a payload
field (`:400001`) rather than filtering.

The last three lines are unchanged from 2.1.193: `:593467 (193)` reads
`s = r.timeout ?? (typeof r.wait_up_to === "number" ? r.wait_up_to * 1000 : void 0);`, byte-for-byte the
same normalisation. **The compatibility shim is carryover; only the census around it is new.**

---

## 3. The payload vocabulary is closed by construction

Every probe payload passes through one of a small set of runtime **identity** functions declared once each
at the top of the bundle (there is exactly one top-level declaration of each name, and no shadowing import):

```javascript
// cli_inner_pretty.js:135-159
function ott(e) { return e; }                                  // the erased brand constructor
function Ee(e)  { return ott(e); }                    // :138   safeLiteral   — string literals
function fe(e)  { return ott(e); }                    // :141   safeEnum      — narrowed enum values
function Xo(e)  { return e == null ? void 0 : ott(e); }// :144  safeOptional
function Tf(e)  { return ott(String(e)); }            // :147   safeNumber
function H5(e)  { return ott([...e].sort().join(",")); }// :156  safeSortedSet
```

At runtime they do nothing. Their entire purpose is in the *type* system — they are brand constructors that
were erased by the compiler, and the only surviving evidence of the original type discipline is **which
wrapper the author had to call**.

The strongest proof is a line that is pure nonsense at runtime:

```javascript
{ param: o === "agentId" ? Ee("agentId") : Ee("bash_id") }        // :508461
{ field: r === "themes" ? Ee("themes") : Ee("monitors") }         // :280065
{ kind: r === "missing" ? Ee("missing") : Ee("divergent") }       // :681622
{ flag: e === "cloud" ? Ee("cloud") : Ee("remote") }              // :552413
```

In every case the variable **already holds** the exact string being re-typed. `Ee(o)` would be identical at
runtime. The author wrote the branch because `Ee` only accepts a string *literal* type, and a `string`-typed
variable does not satisfy it. The ternary is a compile-time re-derivation of a literal union.

**Why this matters:** it means the telemetry payload alphabet for this family is enforced at build time, not
by review. No probe can ever emit a path, a hostname, a task id, a model-authored argument, or any other
open-ended string. Where an open-ended value is unavoidable the code launders it first —
`tengu_dead_probe_tool_alias_exec` (`:425387`) sends `{ alias: ua(i), tool: ua(s.name) }`, and `ua`
(`:151979-151984`) maps known tool names through a table and **collapses every `mcp__*` name to the single
literal `"mcp_tool"`**, so an MCP server name can never reach the wire. And where a value is genuinely
unbounded but genuinely needed, the code enumerates the acceptable set inline and falls back to a literal:

```javascript
// tengu_dead_probe_autoupdater_status, :536211-536217
status: ["migrated", "installed", "disabled", "enabled", "no_permissions", "not_configured"]
          .includes(t.autoUpdaterStatus) ? fe(t.autoUpdaterStatus) : Ee("unknown"),
```

Note the wrapper switches from `Ee` to `fe` inside the narrowing branch — `fe` (`safeEnum`) accepts a value
whose type has been narrowed to a union by the `.includes()` guard, which `Ee` (literal-only) would reject.
The two helpers are runtime twins and type-level opposites, and this line is the clearest place in the
bundle where the difference is visible.

**Key insight:** a probe designed to run for one release across an entire install base is a
privacy-sensitive surface. Constraining it with a *type* rather than a code-review convention means a
future edit cannot widen it by accident.

---

## 4. Where the pattern gets hard: probes that fire before telemetry exists

`O` (`:4083-4090`) is not a direct emitter. When no sink is installed it buffers into a bounded queue:

```javascript
function O(e, t) {
  let r = vFn;
  if (r.sink === null) { P0l(r, { eventName: e, metadata: t, async: !1 }); return; }
  r.sink.logEvent(e, t);
}
```

`P0l` (`:4063-4066`) drops the **oldest** entry once the queue reaches `L0l = 1000` (`:4099`), incrementing
`droppedEventCount`. That is fine for a long-lived interactive session, whose sink is installed early and
which then drains the queue via `_vi` — but the daemon-argv path runs and can `exec`/exit before any sink
exists, so a fire-and-forget probe there would be silently lost.

`tengu_dead_probe_daemon_origin_auto` is the one member that solves this, and it does so with a hybrid:

```javascript
// ============================================
// reportDaemonOriginAutoDefault - the only probe that survives an early process exit
// Location: cli_inner_pretty.js:871374-871383
// ============================================

// ORIGINAL (for source lookup):
function nAl(e) {
  if (rAl.has(e)) return;
  rAl.add(e);
  let t = e === "parse" ? Ee("parse") : e === "format" ? Ee("format") : Ee("status_gate");
  if (e === "parse") {
    O("tengu_dead_probe_daemon_origin_auto", { site: t });
    return;
  }
  k_i.push(rk("tengu_dead_probe_daemon_origin_auto", { site: t }));
}

// READABLE (for understanding):
function reportDaemonOriginAutoDefault(site) {
  if (reportedDaemonOriginSites.has(site)) return;
  reportedDaemonOriginSites.add(site);
  let safeSite = site === "parse" ? safeLiteral("parse")
               : site === "format" ? safeLiteral("format")
               : safeLiteral("status_gate");
  if (site === "parse") {                                 // argv parse: no event loop yet — buffer it
    logEvent("tengu_dead_probe_daemon_origin_auto", { site: safeSite });
    return;
  }
  pendingDaemonProbeEmissions.push(                       // later sites: keep the promise so it can be awaited
    logEventTo1PAwaitable("tengu_dead_probe_daemon_origin_auto", { site: safeSite }));
}

// Mapping: nAl→reportDaemonOriginAutoDefault, rAl→reportedDaemonOriginSites (:872115),
//          k_i→pendingDaemonProbeEmissions (:872115), rk→logEventTo1PAwaitable (:153134),
//          O→logEvent (:4083), Ee→safeLiteral (:138)
```

The companion flush is three lines below (`:871384-871387`):

```javascript
async function KSE() {                       // flushPendingDaemonProbes
  if (k_i.length === 0) return;
  await Promise.all(k_i).catch(() => {});    // never rejects — a lost probe must not fail the daemon
}
function YSE() { (rAl.clear(), (k_i.length = 0)); }   // resetDaemonProbeStateForTest
```

**Why the split by site:** `"parse"` happens inside synchronous argv handling where awaiting anything would
serialise startup, and the buffered queue is good enough because that path continues into the normal
process. The `"format"` and `"status_gate"` sites sit near a possible early exit, so their emission promise
is *retained* and awaited at a shutdown checkpoint. `.catch(() => {})` on the flush is the correct
priority ordering: a lost measurement is acceptable, a daemon that fails to start because telemetry hung is
not.

`YSE` (and the `EAy`/`tTy` `Cvs.clear()` resets in the MCP members, `:292948`/`:298490`) also reveal that
these latches are **test-visible state**, not incidental globals — the family was built with unit tests that
assert "fires exactly once".

---

## 5. Complete member list

25 gates, 32 emission sites. Every line below was read in the 2.1.220 bundle. `grep -c '<gate>' $B` is
**0** for all 25.

| # | Gate (`tengu_dead_probe_…`) | Site(s) | Reporter | Latch | Payload | Legacy shape being counted | Branch still runs? |
|---|---|---|---|---|---|---|---|
| 1 | `_attachment_rename` | `:320075` | `Vnd` `:320073-320076` | bool `qnd` | `legacy_type` (`fe`) | transcript attachments still typed `new_file` / `new_directory` before the rename to `file` | yes — `:320116`, `:320119` return the rewritten attachment |
| 2 | `_autoupdater_status` | `:536211` | inline in `Azs` `:536206-536239` | bool `ocp` | `status` (6-value allowlist + `unknown`) | global config still carries `autoUpdaterStatus` instead of `installMethod` | yes — the migration `switch` at `:536220+` follows |
| 3 | `_bg_attach_noauth` | `:679402` | inline | bool `gcf` | none | daemon `attach` frame with **no control key** | yes — falls through to peer-uid authorisation with a `warn` log |
| 4 | `_changelog_config` | `:566031` | inline in `xEp` `:566028-566037` | bool `TEp` | none | `cachedChangelog` still stored in global config rather than `cache/changelog.md` | yes — the migration write + config strip follow |
| 5 | `_chrome_legacy_socket` | `:267285` | `zmy` `:267278-267292` | bool `B5u` + reentrancy `w_s` | none | a legacy MCP browser-bridge `*.sock` still exists on disk | yes — `H_s` `:267306` returns the full socket list regardless |
| 6 | `_daemon_origin_auto` | `:871379`, `:871382` | `nAl` `:871374-871383` | `Set` `rAl` | `site` ∈ `parse`/`format`/`status_gate` | daemon argv relying on the implicit `origin` default | yes — see §4 |
| 7 | `_daemon_short_compat` | `:681622` | `mJo` `:681618-681623` | `Set` `Vcf` | `kind` ∈ `missing`/`divergent` | saved job state whose `daemonShort` is absent or disagrees | yes — `fxr` `:681625+` respawns anyway |
| 8 | `_disable_bug_command` | `:592810`, `:814212` | inline ×2 | bools `QLp`, `dhm` | `site` ∈ `feedback_mode`/`survey` | `DISABLE_BUG_COMMAND` still used instead of `DISABLE_FEEDBACK_COMMAND` | yes — both branches still disable the surface |
| 9 | `_enable_auto_mode_flag` | `:829239` | inline | **none** | none | the `enableAutoMode` CLI flag | yes — next line still calls `mxs(!0)` |
| 10 | `_env_log_flat_message` | `:756601` | inline | bool `azf` | none | SDK `env_manager_log` frame with a flat `message` instead of `data.content` | yes — the flat field is still read at `:756600` |
| 11 | `_global_config_env` | `:267786` | `nWu` `:267784-267787` | bool `K5u` | none | an `env` block inside the global config file | yes — `:267835`, `:267872` still `Object.assign` it into `process.env` |
| 12 | `_install_counts_cleanup` | `:587170` | inline (unlink callback) | bool `rRp` | none | a leftover `install-counts-cache.json` | yes — it is the *success* callback of the unlink |
| 13 | `_mcp_subsec_timeout` | `:292943` (v1 tree), `:298485` (v2 tree) | `Dvs` `:292940-292947` / `uAs` `:298482-298489` | `Set` `Cvs` / `nAs` (+ test reset) | `site` ∈ `hard`/`idle`/`request`, `timeout_value` (`Tf`) | an MCP server config with `timeout < 1000` ms | yes — `Pvs` `:292952` still clamps with `Math.min(Math.max(n,1000), …)` |
| 14 | `_pinned_sidecar` | `:330622` | inline | bool `wad` | none | legacy per-session `pinned` sidecar files on disk | yes — `Iad(n)` migrates them on the next line |
| 15 | `_plugin_toplevel_experimental` | `:280065` | `i_o` `:280062-280066` | `Set` `vqu` | `field` ∈ `themes`/`monitors` | plugin manifest using top-level `themes`/`monitors` rather than `experimental.*` | yes — `:280067` still reads `t.experimental?.monitors ?? t.monitors` |
| 16 | `_plugins_v1_file` | `:277546` | `Pbs` `:277542-277564` | bool `z6u` | none | an `installed_plugins.json` still in the v1 shape | yes — the whole v1→v2 conversion is the rest of `Pbs` |
| 17 | `_plugins_v2_dualfile` | `:277437` | `Y6u` `:277433-277439` | bool `K6u` | `outcome` (`fe`) ∈ `renamed`/`eexist` | both `installed_plugins.json` and `installed_plugins_v2.json` present | yes — fires *after* `renameSync` at `:277465` |
| 18 | `_preserved_segment` | `:524945`, `:549105`, `:593385`, `:841938` | inline ×4 | bools `nsp`, `Ufp`, `oDp`, `UCm` | `site` ∈ `walk_resolve`/`chain_relink`/`sdk_ingest`/`tail_pick` | compact metadata carrying only the old single-range `preservedSegment` instead of `preservedMessages` | yes — every site then walks/relinks using the legacy range |
| 19 | `_remote_flag_alias` | `:828205` | inline in `_Em` `:828203-828250` | bool `yEm` | none | `--remote` used where `--cloud` is now canonical | yes — `:828206` `n = e.cloud ?? e.remote` |
| 20 | `_speculation_overlay` | `:665445` | inline | bool `Qef` | `stale` `"true"`/`"false"` | a leftover `speculation/` overlay directory | yes — stale ⇒ removed, fresh ⇒ archived; both proceed |
| 21 | `_strip_remote_flag_heal` | `:552413` | `fhp` `:552411-552414` | `Set` `php` | `flag` ∈ `cloud`/`remote` | argv carrying `--cloud=` / `--remote=` that the peeler has to strip | yes — `tUt` `:552415+` strips and continues |
| 22 | `_taskoutput_legacy_params` | `:508461`, `:508463` | inline ×2 | `Set` `zBo` (3 keys) | `param` ∈ `agentId`/`bash_id`/`wait_up_to` | `TaskOutput` called with pre-rename parameter names | yes — `:508464-508465` still coalesce them |
| 23 | `_taskstop_shell_id` | `:400001` | inline | bool `CAd` | `with_task_id` `"true"`/`"false"` | `TaskStop` called with the deprecated `shell_id` | yes — `:400003` `i = e ?? t` |
| 24 | `_tool_alias_exec` | `:425387` | inline in `oon` `:425379` | bool `BRd` | `alias`, `tool` (both via `ua`) | the model invoking a tool by a deprecated alias name | yes — the resolved tool executes normally |
| 25 | `_voice_enabled_flat` | `:741129` | inside a `useEffect` | bool `vjf` | `value` `"true"`/`"false"` | flat `voiceEnabled` config instead of nested `voice.enabled` | yes — the effect body has no other statement |

### 5.1 A measurement defect worth recording

`assets/feature_gates.json` lists **23** `tengu_dead_probe_*` names; the bundle contains **25**.
`tengu_dead_probe_plugins_v1_file` and `tengu_dead_probe_plugins_v2_dualfile` are missing from the asset.
Both are unambiguously present in the source (`:277546`, `:277437`) and 193=0 for both.

This is a new instance of the defect class already recorded in
[`../00_overview/file_index.md`](../00_overview/file_index.md) §4.6 (the gate list contains 21 non-gates).
The gate extractor is described there as "the *most* trustworthy of the four" asset lists — that remains
true, but it under-reports as well as over-reports. **Do not use `feature_gates.json` as a completeness
oracle; `grep -o 'tengu_[a-z0-9_]*' $T | sort -u` is.** (Note also that a naive
`grep -o 'tengu_dead_probe_[a-z_]*'` truncates the two `plugins_v1`/`plugins_v2` names at the digit — the
character class must include `0-9`.)

### 5.2 What the family is *not*

- It is **not** a kill switch. `Ke(gate, default)` — the feature-gate evaluator at `:156667` — is never
  called on any `dead_probe` name. These are pure telemetry event names, emitted through `O` (`:4083`),
  and nothing reads them back.
- It is **not** the same as an unreachable gate. `_raw_asset_diff_193_to_220.md` documents
  `tengu_remote_subagent_frame_nested` (`:757401`) sitting inside `if (ut !== null)` where `ut = null` —
  a genuinely dead emission. The `dead_probe` family is the opposite: the emissions are all live, and it is
  the *surrounding legacy handling* that is hypothesised dead.
- It has **no user-visible surface**: no message string, no `/doctor` row, no warning banner.

---

## 6. Ownership map

Members whose subject matter belongs to another module in this tree:

| Member(s) | Belongs to |
|---|---|
| `_chrome_legacy_socket` | [`../56_chrome_ide/`](../56_chrome_ide/) — the MCP browser-bridge socket layout |
| `_preserved_segment` (×4) | [`../07_compact/`](../07_compact/) — `preservedSegment` → `preservedMessages` |
| `_plugins_v1_file`, `_plugins_v2_dualfile`, `_plugin_toplevel_experimental`, `_install_counts_cleanup` | [`../45_skills/`](../45_skills/) |
| `_mcp_subsec_timeout` (×2 — the v1/v2 runtime clone, see [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §6.7) | [`../39_mcp/`](../39_mcp/) |
| `_bg_attach_noauth`, `_daemon_short_compat`, `_daemon_origin_auto` | [`../36_background_agents/`](../36_background_agents/) |
| `_remote_flag_alias`, `_strip_remote_flag_heal` | [`../54_remote_control/`](../54_remote_control/) |
| `_autoupdater_status`, `_changelog_config`, `_disable_bug_command` | [`../43_slash_commands/`](../43_slash_commands/) |
| `_voice_enabled_flat` | [`../48_accessibility_ui/`](../48_accessibility_ui/) |
| `_enable_auto_mode_flag` | [`../38_permissions/`](../38_permissions/) |
| `_env_log_flat_message` | [`../51_headless_sdk/`](../51_headless_sdk/) |
| `_pinned_sidecar` | [`../31_auto_memory/`](../31_auto_memory/) |
| `_attachment_rename` | [`../41_hooks/`](../41_hooks/) / transcript attachments |
| `_speculation_overlay` | [`../50_performance/`](../50_performance/) |
| `_global_config_env` | settings / [`../55_auth_providers/`](../55_auth_providers/) |
| **`_taskoutput_legacy_params`, `_taskstop_shell_id`** | **this module** + [`../04_tools/web_and_misc_tools_deltas.md`](../04_tools/web_and_misc_tools_deltas.md) §4, which covers the `TaskStop` resolver they sit inside |
| `_tool_alias_exec` | [`../04_tools/`](../04_tools/) |

`04_tools/web_and_misc_tools_deltas.md` §4 already documents members 22 and 23 in their tool context and
correctly notes they "belong to a family of `tengu_dead_probe_*` events added in this window". This document
is that family.

---

## 7. Reading the census: what a zero would license

The value of the family is entirely in what Anthropic can delete afterwards. Grouping the 25 by the kind of
compatibility they buy makes the intent legible:

| Category | Count | Members | What a zero count licenses |
|---|---|---|---|
| On-disk file/format legacy | 7 | `pinned_sidecar`, `plugins_v1_file`, `plugins_v2_dualfile`, `install_counts_cleanup`, `speculation_overlay`, `changelog_config`, `chrome_legacy_socket` | deleting a migration/cleanup path — the highest-value class, because migration code is permanent dead weight otherwise |
| Config-field legacy | 5 | `autoupdater_status`, `global_config_env`, `voice_enabled_flat`, `plugin_toplevel_experimental`, `attachment_rename` | dropping a field from a settings/manifest reader |
| Wire / tool-parameter legacy | 6 | `taskoutput_legacy_params`, `taskstop_shell_id`, `tool_alias_exec`, `env_log_flat_message`, `preserved_segment`, `mcp_subsec_timeout` | tightening a schema — also shrinks the model-facing tool surface |
| CLI flag / env legacy | 4 | `enable_auto_mode_flag`, `remote_flag_alias`, `strip_remote_flag_heal`, `disable_bug_command` | removing a flag alias |
| Peer/daemon protocol compat | 3 | `bg_attach_noauth`, `daemon_short_compat`, `daemon_origin_auto` | dropping support for an older local peer — the **riskiest** class, because the "old client" is another copy of Claude Code that the user has not restarted |

Two things stand out.

**The protocol group is where the probes have teeth.** `_bg_attach_noauth` (`:679402`) is not merely
housekeeping: the branch it measures accepts a daemon `attach` frame **with no control key**, falling back
to peer-uid authorisation with a `[bg-attach] legacy client (no control key) — allowed via peerUid` warning.
That is an authentication downgrade kept alive purely for old workers. A zero count here licenses removing
an auth bypass, which is a security improvement, not just a cleanup — and it is the one member whose
deletion is worth doing even at some compatibility cost.

**The tool-parameter group is the model-facing one, and it is self-limiting.** `taskoutput_legacy_params`,
`taskstop_shell_id`, and `tool_alias_exec` all measure what *the model* emits, not what the user configured.
Their population is therefore a function of the model's training data and the tool schema it is shown —
which means a zero count is achievable simply by not documenting the aliases (they are absent from the 2.1.220
`TaskOutput` schema at `:403339-403345`, which declares only `task_id`/`block`/`timeout`). These three are
the likeliest of the 25 to report zero and be deleted first.

**Key insight for a reader of the next version:** treat this list as a changelog for 2.1.22x that has not
been written yet. Any of these 25 legacy paths that survives into the next bundle either reported a non-zero
count or has not yet been revisited; any that disappears was measured dead.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_todo_tasks.md](../00_overview/symbol_additions_v2_1_220_todo_tasks.md).

Key functions in this document:
- `logEvent` (`O`, `:4083`) - the telemetry entry point every probe uses; buffers when no sink is installed
- `bufferTelemetryEvent` (`P0l`, `:4063`) - bounded queue, drops oldest at `L0l = 1000` (`:4099`)
- `logEventTo1PAwaitable` (`rk`, `:153134`) - awaitable emitter used by the daemon-path probe
- `safeLiteral` (`Ee`, `:138`) - runtime identity; type-level string-literal brand
- `safeEnum` (`fe`, `:141`) - runtime identity; type-level narrowed-union brand
- `safeNumber` (`Tf`, `:147`) - `String(value)` + brand
- `sanitizeToolNameForTelemetry` (`ua`, `:151979`) - collapses every `mcp__*` name to `"mcp_tool"`
- `reportLegacyGlobalConfigEnv` (`nWu`, `:267784`) - form-A exemplar
- `probeLegacyChromeSocket` (`zmy`, `:267278`) - reentrancy-guarded disk probe
- `reportPluginsV2DualFile` (`Y6u`, `:277433`) - fires after the rename, not instead of it
- `convertV1InstalledPluginsFile` (`Pbs`, `:277542`) - probe at the head of the conversion
- `reportLegacyTopLevelPluginField` (`i_o`, `:280062`) - `experimental` fallback detector
- `reportSubSecondMcpTimeout` (`Dvs`, `:292940`; v2 clone `uAs`, `:298482`) - dual-tree twin
- `reportLegacyAttachmentType` (`Vnd`, `:320073`)
- `normalizeToolInput` (`atp`, `:508391`) - hosts the `TaskOutput` probe in its `gee` case
- `reportDaemonOriginAutoDefault` (`nAl`, `:871374`) - buffered vs awaited emission split
- `flushPendingDaemonProbes` (`KSE`, `:871384`) - `.catch(() => {})` shutdown flush
- `resetDaemonProbeStateForTest` (`YSE`, `:871388`) - proof the latches are test-visible
