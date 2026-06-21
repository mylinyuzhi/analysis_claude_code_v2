# `/bg` command surface re-derivation + daemon retire/respawn delta (v2.1.156 → v2.1.183)

> **Delta doc.** Two topics that are *mostly carryover* from v2.1.156 and therefore documented as a re-base + a focused delta rather than a fresh from-scratch analysis:
>
> 1. **The `/bg` (`/background`) command surface** — every symbol re-derived onto its v2.1.183 obfuscated name. The *flow* (def → call → seed → confirm-UI → fork-over-the-dispatcher) is **byte-for-byte the same algorithm** as v2.1.156; it is a **re-mangle, not a redesign**. The authoritative end-to-end analysis stays the baseline [`background_slash_command.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md). This doc supplies the v2.1.183 dual-version snippets for every load-bearing function so the baseline is usable against the new bundle, and flags the *two* genuinely-new micro-conditions inside `sKn` (the `left_arrow` failure-placeholder branch and the `Zyn()` effort-flag gate).
> 2. **The daemon retire/respawn refinements** — `respawnIfIdleStale` / `retireIfSettled` keep the v2.1.156 `worker_retire_respawn_2156.md` design (pinned guard, broadened settled predicate, bridge grace, exec exclusion, low-mem pinned-shed). This doc documents only what *moved*, and — importantly — **corrects two over-claims** that propagated from the scout dossier and the module README (the cliVersion-equality stale check and the `session_cron`/`routine` guards are **carryover**, present identically in v2.1.156).
>
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). Every `cli_inner_pretty.js:<line>` below is a **v2.1.183** line unless explicitly tagged *(v2.1.156 before-picture)*. Obfuscated names are **re-derived** for v2.1.183 — a v2.1.156 name (`zh8`, `Fwz`, `gwz`, `Ah8`, `owz`/`awz`, `Yh8`, `OH9`, `SF`) is never reused here.
>
> **Confidence: high** for the `/bg`/`/stop` re-derivation and the retire/respawn *carryover-vs-delta* distinction (each proved with paired reads of both bundles). **Medium-low** for attributing the changelog micro-fixes ("Working forever" 2.1.178, `--bg -cn` 2.1.176) to specific lines — carried as open questions per the dossier.

---

## TL;DR

The `/bg` machine is the same six-function flow as v2.1.156, with every identifier re-minified by the bundler:

| Role | v2.1.156 obf | v2.1.183 obf | v2.1.183 line |
|---|---|---|---|
| export module | `OH9` | `JMl` | 566833 |
| `spawnBackgroundFork` | `zh8` | `sKn` | 566834 |
| `deriveBackgroundSeed` | `Ah8` | `iKn` | 566927 |
| confirm UI `BackgroundForkPrompt` | `gwz` | `ugf` | 566957 |
| `call` handler | `Fwz` | `lgf` | 567091 |
| command def (`local-jsx`) | `owz`/`awz` | `hgf`/`ygf` | 567140 |
| `/stop` impl | `Yh8` | `aKn` | 567155 |
| `/stop` command defs | (on `Yh8` region) | `Egf`/`Hgf` | 567208 |

*(This is the allowed cross-version comparison table for a re-mangle; it is **not** an obfuscated→readable mapping table. The readable↔obf↔line map lives in the [per-feature additions file](#related-symbols).)*

On the daemon side, the worker-handle methods `respawnIfIdleStale` (566834-region class, `cli_inner_pretty.js:594895`) and `retireIfSettled` (`cli_inner_pretty.js:594936`) carry over the v2.1.156 `BgWorkerHandle` (`SF`) design wholesale. The **three real deltas** are:

1. **`respawnIfIdleStale` gains a `trigger` parameter** — `respawnIfIdleStale(pinnedSet, trigger = "sweep")`. v2.1.156 was single-argument. The trigger (`"sweep"` / `"attach"` / `"prewarm"`) gates two new branches and is stamped onto the `tengu_bg_respawn_stale` telemetry as `trigger`.
2. **A "detritus" inflight allowlist (`gFl`) + `detritusOnly` outcome flag** — a settled worker whose only remaining in-flight tasks are `local_bash` / `in_process_teammate` / `dream` is no longer kept alive by the in-flight guard; both `respawnIfIdleStale` and `retireIfSettled` learn this. `detritusOnly` is grep=0 in the v2.1.156 bundle.
3. **A `prewarm` respawn loop in the supervisor tick**, gated by a new `tengu_bg_attach_upgrade` feature gate (`Wzn`), that proactively re-spawns up to `tengu_bg_prewarm_per_sweep` (default 3) non-pinned, version-mismatched, idle workers onto the current binary. The `"prewarm"` literal is grep=0 in v2.1.156.

**Corrections to the dossier / README D5 claims (verified):** the *cliVersion-equality* stale short-circuit and the `session_cron`/`routine` inflight guards in `retireIfSettled` are **NOT** v2.1.183 deltas — both appear identically in the v2.1.156 bundle (the cliVersion equality at v2.1.156 `cli_inner_pretty.js:560035-560047`; `session_cron`/`routine` at v2.1.156 `cli_inner_pretty.js:560119-560120`). They are carryover. See §6 for the line-by-line proof.

---

## Part A — the `/bg` (`/background`) command surface, re-derived

### A.0 What is carryover, and why this doc does not re-derive the flow

The baseline [`background_slash_command.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md) already proves, with deep What/How/Why/Key-insight analysis:

- the **`local-jsx` command model** (a command whose `call` returns a React/Ink element, not text);
- the **`immediate: (input) => !input.trim()` predicate** (fire-on-keystroke when `/bg` has no argument, wait-for-Enter when it carries a prompt — the source of `isMidTurn`);
- the **three call-guards** (already-bg, persistence-off, empty-seed) and *why they are ordered env→state→content*;
- the **reverse-scan seed deriver** (the dual role of `<command-message>`: not adopted as intent, but counts as user engagement);
- the **auto-confirm-when-idle vs confirm-when-busy** UI and the **once-only `useRef` fork guard**;
- **fork-via-`--resume <id> --fork-session`** (clone context, sever file identity), **`--reply-on-resume`** (finish an in-flight turn across the process boundary), and **worktree handoff** (single-writer ownership transfer gated on `!enteredExisting`);
- **async auto-naming** (fire-and-forget LLM call registered to outlive the command).

**All of that is unchanged in v2.1.183.** I verified the bodies line-for-line; the only differences are (a) minified identifiers and (b) the two micro-conditions called out in §A.3. So this part re-bases the symbols onto v2.1.183 with a verified dual-version snippet per function, and points at the baseline for the reasoning. Re-deriving ~100 KB of proven analysis for an identifier swap would add no insight.

### A.1 The export module + command def (`JMl` / `hgf`/`ygf`)

```javascript
// ============================================
// backgroundModule + backgroundCommandDef - the /background (alias /bg) export triple + local-jsx def
// Location: cli_inner_pretty.js:566833-566834 (export), 567140-567150 (def)
// ============================================

// ORIGINAL (for source lookup):
var JMl = {};
gt(JMl, { spawnBackgroundFork: () => sKn, deriveBackgroundSeed: () => iKn, call: () => lgf });
// ... (in a separate lazy-init thunk ZMl) ...
((hgf = {
  type: "local-jsx",
  name: "background",
  aliases: ["bg"],
  description: "Send this session to the background and free the terminal",
  argumentHint: "[prompt]",
  immediate: (e) => !e.trim(),
  isEnabled: () => !0,
  load: () => Promise.resolve().then(() => (Cxo(), JMl)),
}),
  (ygf = hgf));

// READABLE (for understanding):
const backgroundModule = {};
exportNamespace(backgroundModule, {
  spawnBackgroundFork: () => spawnBackgroundFork,   // sKn
  deriveBackgroundSeed: () => deriveBackgroundSeed, // iKn
  call:                 () => backgroundCall,       // lgf  (export key is literally "call")
});
// command-def thunk (assigned on first registry access):
backgroundCommandDef = {
  type: "local-jsx",                        // call() returns a React element, not text
  name: "background",
  aliases: ["bg"],
  description: "Send this session to the background and free the terminal",
  argumentHint: "[prompt]",
  immediate: (input) => !input.trim(),      // empty arg => fire on keystroke (sets isMidTurn); has-arg => wait for Enter
  isEnabled: () => true,
  load: () => Promise.resolve().then(() => (initBackgroundImplDeps(), backgroundModule)), // lazy: bind deps+React, hand back impl ns
};
backgroundCommandDefExport = backgroundCommandDef;

// Mapping: JMl→backgroundModule, gt→exportNamespace, sKn→spawnBackgroundFork, iKn→deriveBackgroundSeed,
//          lgf→backgroundCall, hgf→backgroundCommandDef, ygf→backgroundCommandDefExport,
//          Cxo→initBackgroundImplDeps, e→input
// v2.1.156 before-picture @542679: X$(OH9,{spawnBackgroundFork:()=>zh8,deriveBackgroundSeed:()=>Ah8,call:()=>Fwz});
//                          @542940: owz def with identical fields; load:()=>...(Sqq(),OH9)
```

`spawnBackgroundFork`, `deriveBackgroundSeed`, and `call` are **bundler-preserved export keys** (the strings survive minification — `grep -F 'spawnBackgroundFork: () => sKn'` → 1 hit @566833), so those three readable names are ground-truth, exactly as in v2.1.156. The `Cxo` init thunk (`cli_inner_pretty.js:567110-567139`, a `E(()=>{...})` lazy-init) pulls the dependency modules and binds React (`R_e = $(be(), 1)`, `Kmt = $(be(), 1)` @567139) before the impl namespace is handed back — the same two-staged lazy load the baseline describes for `Sqq`/`OH9`. The registry therefore stays cheap to enumerate (tab-completion, help) until `/bg` is actually run.

The `local-jsx` def field semantics — `type`, `immediate` predicate, `isEnabled`, two-stage `load` — are analysed in baseline `background_slash_command.md` §1; nothing in those fields changed.

### A.2 The call handler `lgf` (was `Fwz`) — three guards, unchanged

```javascript
// ============================================
// backgroundCall - /bg call handler: already-bg / persistence-off / empty-seed guards, then render confirm UI
// Location: cli_inner_pretty.js:567091-567107
// ============================================

// ORIGINAL (for source lookup):
lgf = async (e, t, n) => {
  if (yi()) return (G("tengu_background_already_bg", {}), e(), Gye(), null);
  if (dV())
    return (
      e("Cannot background — session persistence is disabled, so the forked job would have nothing to resume."),
      null
    );
  let r = (n ?? "").trim(),
    o = iKn(t.messages, r);
  if (o === null) return (e("Nothing to background yet — send a message first."), null);
  return R_e.createElement(ugf, {
    onDone: e,
    prompt: r,
    seed: o,
    messages: t.messages,
    isMidTurn: t.isMidTurn ?? !1,
  });
};

// READABLE (for understanding):
const backgroundCall = async (onDone, ctx, argString) => {
  // GUARD 1 (env): already a bg session => not an error; degrade to a daemon detach
  if (isBackgroundSession()) {                                  // yi
    telemetry("tengu_background_already_bg", {});
    onDone();                                                   // close UI, no text
    requestDaemonDetach();                                      // Gye — no-op unless on daemon backend
    return null;
  }
  // GUARD 2 (state): persistence off => the fork could not --resume anything
  if (isSessionPersistenceDisabled())                          // dV
    return (onDone("Cannot background — session persistence is disabled, so the forked job would have nothing to resume."), null);
  // GUARD 3 (content): nothing worth backgrounding yet
  const prompt = (argString ?? "").trim();
  const seed = deriveBackgroundSeed(ctx.messages, prompt);     // iKn
  if (seed === null) return (onDone("Nothing to background yet — send a message first."), null);
  return React.createElement(BackgroundForkPrompt, {
    onDone, prompt, seed, messages: ctx.messages,
    isMidTurn: ctx.isMidTurn ?? false,                         // true only on the immediate (no-arg) path
  });
};

// Mapping: lgf→backgroundCall, e→onDone, t→ctx, n→argString, r→prompt, o→seed,
//          yi→isBackgroundSession, Gye→requestDaemonDetach, dV→isSessionPersistenceDisabled,
//          iKn→deriveBackgroundSeed, R_e→React, ugf→BackgroundForkPrompt, G→telemetry
// v2.1.156 before-picture @542895: Fwz with identical guards (v7→yi, bzH→Gye, NWH→dV, Ah8→iKn, gwz→ugf)
```

Byte-for-byte the same three-guard structure as v2.1.156's `Fwz`. The guard helpers re-minified: `isBackgroundSession` `v7`→`yi`, `requestDaemonDetach` `bzH`→`Gye` (@477381), `isSessionPersistenceDisabled` `NWH`→`dV`. The *ordering rationale* (env→state→content; the already-bg guard is a redirect not an error; persistence-off fails fast before scanning messages) is unchanged — see baseline §2. Note the three failure shapes are still all `return null` (the local-jsx "handled, render nothing" signal) with feedback delivered through `onDone(text)`, never an exception.

### A.3 The fork `sKn` (was `zh8`) — argv builder + the two micro-conditions

```javascript
// ============================================
// spawnBackgroundFork - argv builder over the unified dispatcher PX, worktree handoff, async auto-naming
// Location: cli_inner_pretty.js:566834-566926
// ============================================

// ORIGINAL (for source lookup, head + the NEW left_arrow failure-placeholder branch):
async function sKn(e, t, n, r, o, s, i, a, l, c) {
  let u = E_(),
    d = typeof n === "string" ? n : void 0,
    p = Array.from(o.values()).filter((C) => C.source === "session").map((C) => C.path),
    f = s.session ?? [], m = i.session ?? [],
    A = f.length > 0 || m.length > 0 ? { allow: [...f], deny: [...m] } : void 0,
    g = s.cliArg ?? [], h = i.cliArg ?? [],
    y = aA(), _ = Boolean(y && !y.enteredExisting), b = Ixo();
  await uu(eD(), 2000, "flush timeout").catch(() => {});
  let S = [
      ...(b !== null ? ["--resume", b, "--fork-session"] : []),
      ...(c?.replyOnResume ? ["--reply-on-resume"] : []),
      ...XMe(),
      ...p.flatMap((C) => ["--add-dir", C]),
      ...g.flatMap((C) => ["--allowed-tools", C]),
      ...h.flatMap((C) => ["--disallowed-tools", C]),
      ...(u ? ["--model", u] : []),
      ...(d && Zyn() ? ["--effort", d] : []),       // NEW micro-condition: && Zyn()
      "--permission-mode", r,
      ...(t ? ["--", t] : []),
    ],
    T = await PX(S, c?.providedSessionId, "repl", y?.worktreePath ?? Ar(),
      { ...e, worktree: _ ? { path: y.worktreePath, branch: y.worktreeBranch, hookBased: y.hookBased ?? !1, originCwd: y.originalCwd } : void 0,
        sessionPermissionRules: A, memoryToggledOff: uU() || void 0 }, c?.extraEnv,
    ).catch((C) => ({ ok: !1, error: `Couldn't background — ${Se(C)}`, reason: void 0 }));
  if (!T.ok) {
    G("tengu_background_spawn_failed", {});
    let C = !1;
    if (a === "left_arrow" && c?.providedSessionId !== void 0 && b !== null && !T.alive) {   // NEW failure-placeholder branch
      let x = Tc(c.providedSessionId.slice(0, 8)), I = await fa(x);
      if (I) {
        let k = oKn.join(oKn.dirname(b), `${c.providedSessionId}.jsonl`);
        C = await rKn.copyFile(b, k).then(() => Rp(x, {
            ...I, state: "failed", tempo: "idle", needs: void 0, block: void 0, inFlight: void 0,
            detail: "couldn't start in the background — press Enter to retry",
            linkScanPath: k, respawnFlags: Rwe(nKn(S)), updatedAt: new Date().toISOString(),
          }).catch(async (L) => { throw (await rKn.rm(k, { force: !0 }).catch(() => {}), L); }),
        ).then(() => !0, (L) => (De(L), !1));
      }
      if (C && y) (_st(null), $xe());
    }
    if (a === "left_arrow") if (C) Rt("repl_background_fork", "queued_for_later"); else Me("repl_background_fork", "spawn_failed");
    return { ok: !1, error: T.error, queued: C, reason: T.reason };
  }
  if ((G("tengu_background", { via_flag: !1, via: Ne(a) }), a === "left_arrow")) Le("repl_background_fork");
  if (y) (_st(null), $xe());
  if (e.name === void 0 && T.sessionId) {
    let C = T.short,
      x = Nft(Cy([...l]), AbortSignal.timeout(cgf)).then((I) => (I ? Nwe(C, I, "auto") : void 0)).catch(() => {});
    if (a === "command") qi(() => x);
  }
  return { ok: !0, short: T.short, handedOff: _, hadWorktree: y !== null };
}

// READABLE (for understanding):
async function spawnBackgroundFork(extraOpts, prompt, effort, permissionMode, addDirsMap, allowRules, denyRules, viaSource, messages, opts) {
  const modelOverride = getMainLoopModelOverride();                  // E_() — model is INTERNAL, not a param
  const effortStr     = typeof effort === "string" ? effort : undefined;
  const sessionAddDirs = [...addDirsMap.values()].filter(d => d.source === "session").map(d => d.path);
  const sessionPermissionRules = (allowRules.session?.length || denyRules.session?.length)
        ? { allow: [...(allowRules.session ?? [])], deny: [...(denyRules.session ?? [])] } : undefined;
  const worktree        = getCurrentWorktreeSession();               // aA
  const handOffWorktree = Boolean(worktree && !worktree.enteredExisting);
  const resumeSessionId = getCurrentSessionFile();                   // Ixo
  await withTimeout(flushSessionStorage(), 2000, "flush timeout").catch(() => {}); // 2s-capped flush

  const argv = [
    ...(resumeSessionId !== null ? ["--resume", resumeSessionId, "--fork-session"] : []), // fork => new id, fg transcript read-only
    ...(opts?.replyOnResume ? ["--reply-on-resume"] : []),                                 // mid-turn => finish in-flight turn
    ...getReplConfigArgv(),                                                                 // XMe — propagate original launch flags
    ...sessionAddDirs.flatMap(d => ["--add-dir", d]),
    ...(allowRules.cliArg ?? []).flatMap(r => ["--allowed-tools", r]),
    ...(denyRules.cliArg ?? []).flatMap(r => ["--disallowed-tools", r]),
    ...(modelOverride ? ["--model", modelOverride] : []),
    ...(effortStr && launchEffortFlagsUnpinned() ? ["--effort", effortStr] : []),          // NEW: && Zyn() (see deep analysis)
    "--permission-mode", permissionMode,
    ...(prompt ? ["--", prompt] : []),
  ];
  const result = await spawnBgSession(argv, opts?.providedSessionId, "repl",
    worktree?.worktreePath ?? getOriginalCwd(),
    { ...extraOpts,
      worktree: handOffWorktree ? { path: worktree.worktreePath, branch: worktree.worktreeBranch, hookBased: worktree.hookBased ?? false, originCwd: worktree.originalCwd } : undefined,
      sessionPermissionRules, memoryToggledOff: getMemoryToggledOff() || undefined },
    opts?.extraEnv,
  ).catch(e => ({ ok: false, error: `Couldn't background — ${formatError(e)}`, reason: undefined }));

  if (!result.ok) {
    telemetry("tengu_background_spawn_failed", {});
    let queued = false;
    // NEW: bg-left-arrow dispatch that died (provided id known, resume file present, worker not alive) =>
    //      persist a "failed/press-Enter-to-retry" placeholder job so the REPL list shows it & can retry.
    if (viaSource === "left_arrow" && opts?.providedSessionId !== undefined && resumeSessionId !== null && !result.alive) {
      const jobDir = jobDirForShort(opts.providedSessionId.slice(0, 8));
      const existing = await readJobState(jobDir);
      if (existing) {
        const forkedTranscript = path.join(path.dirname(resumeSessionId), `${opts.providedSessionId}.jsonl`);
        queued = await fs.copyFile(resumeSessionId, forkedTranscript)
          .then(() => writeJobState(jobDir, { ...existing, state: "failed", tempo: "idle",
              needs: undefined, block: undefined, inFlight: undefined,
              detail: "couldn't start in the background — press Enter to retry",
              linkScanPath: forkedTranscript, respawnFlags: stripResumeArgv(argv), updatedAt: new Date().toISOString() })
              .catch(async err => { await fs.rm(forkedTranscript, { force: true }).catch(() => {}); throw err; }))
          .then(() => true, err => (logError(err), false));
      }
      if (queued && worktree) { setCurrentWorktreeSession(null); clearWorktreeOwnershipName(); }
    }
    if (viaSource === "left_arrow")
      queued ? markFlowDone("repl_background_fork", "queued_for_later") : markFlowFailed("repl_background_fork", "spawn_failed");
    return { ok: false, error: result.error, queued, reason: result.reason };
  }

  telemetry("tengu_background", { via_flag: false, via: viaSource });   // via: Ne(viaSource) — typed-wrapper, value unchanged
  if (viaSource === "left_arrow") markFlowComplete("repl_background_fork");
  if (worktree) { setCurrentWorktreeSession(null); clearWorktreeOwnershipName(); } // release ownership; worker owns it now
  if (extraOpts.name === undefined && result.sessionId) {               // no seeded name => auto-name async
    const namingTask = generateSessionName(trimToFirstRelevantMessage([...messages]), AbortSignal.timeout(AUTO_NAME_TIMEOUT_MS))
      .then(name => name ? setSessionName(result.short, name, "auto") : undefined).catch(() => {});
    if (viaSource === "command") registerBackgroundPromise(() => namingTask);
  }
  return { ok: true, short: result.short, handedOff: handOffWorktree, hadWorktree: worktree !== null };
}

// Mapping: sKn→spawnBackgroundFork; params e→extraOpts, t→prompt, n→effort, r→permissionMode, o→addDirsMap,
//          s→allowRules, i→denyRules, a→viaSource, l→messages, c→opts; u→modelOverride, b→resumeSessionId,
//          y→worktree, _→handOffWorktree, T→result;
//          E_→getMainLoopModelOverride, aA→getCurrentWorktreeSession, Ixo→getCurrentSessionFile,
//          eD→flushSessionStorage, uu→withTimeout, PX→spawnBgSession (re-mangled ol), XMe→getReplConfigArgv,
//          Ar→getOriginalCwd, uU→getMemoryToggledOff, Zyn→launchEffortFlagsUnpinned, _st→setCurrentWorktreeSession,
//          $xe→clearWorktreeOwnershipName, Nft→generateSessionName, Cy→trimToFirstRelevantMessage,
//          Nwe→setSessionName(persist "auto"), qi→registerBackgroundPromise, cgf→AUTO_NAME_TIMEOUT_MS (3000),
//          Tc→jobDirForShort, fa→readJobState, Rp→writeJobState, Rwe(nKn(...))→stripResumeArgv, Se→formatError,
//          Ne→typed telemetry-value passthrough, G→telemetry
// v2.1.156 before-picture @542680: zh8(H,$,q,K,_,z,A,Y,f,O) — identical argv head; NO left_arrow placeholder branch;
//                                  effort was unconditional `j ? ["--effort", j]` (no Zyn gate)
```

The argv head — `--resume <id> --fork-session [--reply-on-resume] …` then dispatch through the unified dispatcher (now `PX`, the re-mangled v2.1.156 `ol`) — is verbatim-equivalent, as is the worktree-handoff block, the `tengu_background_spawn_failed`/`tengu_background` telemetry, and the async auto-naming through `Nwe(…, "auto")` with the same 3000 ms timeout (`cgf`, was `Qwz`). The `via_flag:!1, via: Ne(a)` telemetry value `Ne` is a typed passthrough (see §A.6) — the recorded value is the raw `viaSource`, unchanged.

#### Deep analysis — the NEW `left_arrow` failure-placeholder branch

**What it does.** When a `/bg`-via-left-arrow dispatch *fails to start the worker* (the dispatcher returned `ok:false` with `alive:false`), `sKn` writes a synthetic `state:"failed"` job record to disk — `detail: "couldn't start in the background — press Enter to retry"` — so the failed attempt still shows up in the bg session list and can be retried, instead of silently vanishing.

**How it works (step-by-step).**
1. The branch fires only when four conditions all hold (`cli_inner_pretty.js:566881`): `viaSource === "left_arrow"` (the dispatch came from the REPL left-arrow background gesture, not the `/bg` command or a CLI flag), an explicit `providedSessionId` was supplied, a resumable session file exists (`resumeSessionId !== null`), and **the worker is not alive** (`!result.alive` — the new `alive` field the dispatcher returns on failure).
2. It derives a job dir from the first 8 chars of the provided session id (`Tc(...slice(0,8))`, `cli_inner_pretty.js:566882`) and reads any existing job record (`fa`).
3. It **copies the foreground transcript** to `<dir>/<providedSessionId>.jsonl` (jsonl path `cli_inner_pretty.js:566885`, `copyFile` `cli_inner_pretty.js:566887`) so the retry has the same context the fork would have resumed, then writes a job record cleared of live fields (`needs`/`block`/`inFlight` → undefined), set to `state:"failed"`, `tempo:"idle"`, with `respawnFlags: stripResumeArgv(argv)` recording the argv (minus the resume token) for a one-tap retry, and a `linkScanPath` pointing at the copied transcript.
4. On a copy/write error it deletes the partial transcript copy and rethrows (so a half-written placeholder is not left behind), and `queued` stays `false`.
5. If the placeholder write succeeded and a worktree was owned, ownership is released (`_st(null)`, `$xe()`) — the same release the success path does, because the user can retry from the placeholder.
6. Telemetry: `queued` → `repl_background_fork` flow marked `"queued_for_later"`, else `"spawn_failed"` (`cli_inner_pretty.js:566912`). The return now carries `queued` and `reason`.

**Why this approach.** A left-arrow background gesture is a *fire-and-forget* UX — the user flicks the session away and keeps working. If the dispatch silently dies, the session is lost with no trace and no error surface, which is exactly the kind of "I backgrounded it and it never came back" failure that erodes trust in the feature. Persisting a `failed` placeholder converts a silent loss into a visible, retryable entry in `claude agents` / the REPL bg list. Copying the transcript up front means the retry resumes the same context rather than starting empty. Stashing `respawnFlags` (the argv sans the volatile `--resume <id>` token) lets the retry reconstruct the launch without re-deriving it.

**Key insight.** The `!result.alive` gate is the crux: the placeholder is written *only* when the worker genuinely failed to come up. A worker that started and then exited has its own real job record and must not be overwritten by a synthetic `failed` placeholder — the new `alive` field on the dispatcher result is what disambiguates "never started" from "started then died." This is plausibly part of the changelog's bg-reliability hardening, though it could not be pinned to one specific changelog line (see §7).

#### Deep analysis — the `Zyn()` effort-flag gate on `--effort`

**What it does.** v2.1.183 only propagates `--effort` into the worker when `Zyn()` is true: `...(effortStr && Zyn() ? ["--effort", effortStr] : [])` (`cli_inner_pretty.js:566858`). v2.1.156 propagated it unconditionally (`j ? ["--effort", j]`, *before-picture* @542704).

**How it works.** `Zyn` (`cli_inner_pretty.js:148956-148959`) returns `Boolean(state.unpinOpus47LaunchEffort && state.unpinOpus48LaunchEffort && state.unpinFable5LaunchEffort)` — true only when the launch-effort feature is *unpinned* for all the current model families. So when launch-effort is still pinned (the default/locked configuration for some models), `/bg` does **not** forward the foreground's effort selection to the fork.

**Why this approach.** Effort (thinking-budget) selection is model-dependent; for model families whose launch effort is still pinned, forwarding an effort flag could conflict with the model's own pinned default in the new worker. Gating propagation on the unpin flags keeps the fork consistent with the host's effort policy rather than blindly inheriting a flag the worker's model may not honor. This is a model-config nuance, orthogonal to the `/bg` flow itself.

**Key insight.** This is the only change to the argv *contents* in `sKn` (everything else is identifier-only). It is small and conditional, and the `--effort` allowlist membership (`hqq`/value-flags set in v2.1.156) is unchanged — the gate is purely about whether `sKn` *emits* the flag, not whether the worker would accept it.

### A.4 The confirm UI `ugf` (was `gwz`) — auto-confirm-when-idle, once-only fork

```javascript
// ============================================
// BackgroundForkPrompt - confirm UI: inflight count, auto-confirm-when-idle state, once-only fork effect
// Location: cli_inner_pretty.js:566957-567067 (react-compiler memo-cache slots abbreviated)
// ============================================

// ORIGINAL (for source lookup, the load-bearing core):
function ugf(e) {
  let t = XMl.c(27),
    { onDone: n, prompt: r, seed: o, messages: s, isMidTurn: i } = e,
    a = ft(ggf), l = ft(Agf), c = ft(mgf), u = ft(fgf), d = ft(pgf), p = ft(dgf), f;
  if (t[0] !== p) ((f = Z5n(p)), (t[0] = p), (t[1] = f)); else f = t[1];
  let m = f, [A, g] = Kmt.useState(m.count === 0), h = Kmt.useRef(!1), y, _;
  // ... deps-changed guard ...
    ((y = () => {
      if (!A || h.current) return;
      ((h.current = !0),
        (async () => {
          let k = await sKn(o, r, a, l, c, u, d, "command", s, { replyOnResume: i });
          if (k.ok)
            (G("tengu_background_fork", { confirmed: m.count > 0, inflight_count: m.count, mid_turn: i,
                had_prompt: r.length > 0, had_worktree: k.hadWorktree, worktree_handed_off: k.handedOff }),
              n(),
              await $i(0, "prompt_input_exit", { suppressResumeHint: !0,
                finalMessage: H9t(k.short, k.handedOff ? "(worktree handed off)" : void 0) }));
          else n(k.error);
        })());
    }),
      (_ = [A, a, l, c, u, d, m.count, i, o, n, r, s]));
  if ((Kmt.useEffect(y, _), A))
    return /* memoized */ R_e.createElement(w, { dimColor: !0 }, "Backgrounding…");
  // busy branch:
  let b = () => { (G("tengu_background_declined", { inflight_count: m.count }), n()); };
  let T = `${m.summary} running — the forked session won't carry live processes.`;
  let x = R_e.createElement(ac, { confirmLabel: "Background anyway (tasks will be abandoned)", cancelLabel: "Stay",
    onConfirm: () => g(!0), onCancel: b });
  return R_e.createElement(zn, { title: "Background this session?", subtitle: T, onCancel: b }, x);
}

// READABLE (for understanding):
function BackgroundForkPrompt({ onDone, prompt, seed, messages, isMidTurn }) {
  const effort     = useStoreSelector(selectEffortValue);                    // ggf
  const permMode   = useStoreSelector(selectPermissionMode);                 // Agf
  const addDirs    = useStoreSelector(selectAdditionalWorkingDirectories);   // mgf
  const allowRules = useStoreSelector(selectAlwaysAllowRules);               // fgf
  const denyRules  = useStoreSelector(selectAlwaysDenyRules);                // pgf
  const tasks      = useStoreSelector(selectTasks);                          // dgf

  const inflight = countInflightTasks(tasks);                                // { count, kinds, summary }
  const [confirmed, setConfirmed] = useState(inflight.count === 0);          // auto-confirm if idle
  const hasFired = useRef(false);                                            // once-only guard

  useEffect(() => {
    if (!confirmed || hasFired.current) return;
    hasFired.current = true;                                                 // set BEFORE await — closes the re-entry race
    (async () => {
      const r = await spawnBackgroundFork(seed, prompt, effort, permMode, addDirs, allowRules, denyRules, "command", messages, { replyOnResume: isMidTurn });
      if (r.ok) {
        telemetry("tengu_background_fork", { confirmed: inflight.count > 0, inflight_count: inflight.count,
          mid_turn: isMidTurn, had_prompt: prompt.length > 0, had_worktree: r.hadWorktree, worktree_handed_off: r.handedOff });
        onDone();
        await exitPromptInput(0, "prompt_input_exit", { suppressResumeHint: true,
          finalMessage: formatBgHints(r.short, r.handedOff ? "(worktree handed off)" : undefined) });
      } else onDone(r.error);
    })();
  }, [confirmed, effort, permMode, addDirs, allowRules, denyRules, inflight.count, isMidTurn, seed, onDone, prompt, messages]);

  if (confirmed) return <InkText dimColor>Backgrounding…</InkText>;

  const decline = () => { telemetry("tengu_background_declined", { inflight_count: inflight.count }); onDone(); };
  const subtitle = `${inflight.summary} running — the forked session won't carry live processes.`;
  return (
    <DialogBox title="Background this session?" subtitle={subtitle} onCancel={decline}>
      <ConfirmCancelChoice confirmLabel="Background anyway (tasks will be abandoned)" cancelLabel="Stay"
        onConfirm={() => setConfirmed(true)} onCancel={decline} />
    </DialogBox>
  );
}

// Mapping: ugf→BackgroundForkPrompt; props e→{onDone n, prompt r, seed o, messages s, isMidTurn i};
//          ft→useStoreSelector; ggf→selectEffortValue, Agf→selectPermissionMode, mgf→selectAdditionalWorkingDirectories,
//          fgf→selectAlwaysAllowRules, pgf→selectAlwaysDenyRules, dgf→selectTasks;
//          Z5n→countInflightTasks, A→confirmed, g→setConfirmed, h→hasFired, sKn→spawnBackgroundFork,
//          $i→exitPromptInput, H9t→formatBgHints, ac→ConfirmCancelChoice, zn→DialogBox, w→InkText,
//          XMl.c(27)/t[i]→react-compiler memo cache (auto-memoization, ignore), G→telemetry
// v2.1.156 before-picture @542763: gwz with identical structure (D$ selectors, hV8 counter, ny$ banner)
```

Identical to v2.1.156's `gwz`: six app-store selectors (`ft`, was `D$`) feed the spawn call, `countInflightTasks` (`Z5n`, was `hV8`) computes `{count, summary}`, `useState(count === 0)` folds the *idle ⇒ skip-dialog* policy into ordinary state, and the once-only `useRef` guard (`hasFired.current = true` set *synchronously before* the await) closes the re-entry race. The two render branches — dim "Backgrounding…" when confirmed, else a `DialogBox` + `ConfirmCancelChoice` warning that in-flight tasks will be abandoned — are unchanged, as is the call argument order `sKn(seed, prompt, effort, permMode, addDirs, allow, deny, "command", messages, {replyOnResume:isMidTurn})`. The deep What/How/Why for auto-confirm, the "tasks abandoned" semantics (a transcript resumes, a running process tree cannot), and the once-only guard are in baseline §4 — none of that reasoning changed.

### A.5 `/stop` — `Egf`/`Hgf` defs, `aKn` impl (was `Yh8`)

The `/stop` self-stop command is the `/bg` sibling that writes a terminal `stopped` state to the *current* bg job and exits. In v2.1.183 it splits into two command-def variants (interactive `local-jsx` + non-interactive `local`) and the shared impl `aKn`, fanned out by three thin entry points:

```javascript
// ============================================
// stopSelfSession + /stop command defs - write state:"stopped" to the bg job on disk, then exit
// Location: cli_inner_pretty.js:567155-567176 (impl), 567178-567228 (entry points + defs)
// ============================================

// ORIGINAL (for source lookup):
async function aKn(e) {
  G("tengu_bg_agent_action", { action: Qe("stop"), source: Ne(e), jobSessionId: Nr(xt()) });
  let t = _gf();
  if (yi() && t) {
    let n = new Date().toISOString(), r = await fa(t);
    if (r && !ph(r))
      await Rp(t, { ...r, state: "stopped", detail: "stopped from session", tempo: "idle",
        needs: void 0, block: void 0, inFlight: void 0, updatedAt: n, firstTerminalAt: r.firstTerminalAt ?? n }).catch(xA);
    if (edn()) process.stdout.write(oue("Session stopped."));
  }
  return (Le("job_stop_self"), $i(0, "prompt_input_exit", { suppressResumeHint: !0 }));
}
// three entry points, all funnel into aKn(source):
async function bgf(e) { return (e(), await aKn("stop_command"), null); }      // /stop local-jsx call
async function Sgf()  { return (await aKn("bridge"), { type: "skip" }); }     // bridge-triggered stop
// command defs:
((Egf = { type: "local-jsx", name: "stop", description: "Stop this background session; transcript and worktree are kept",
    immediate: !0, isEnabled: yi, load: () => Promise.resolve().then(() => (tRl(), eRl)) }),
  (Hgf = { type: "local", name: "stop", supportsNonInteractive: !0,
    description: "Stop this background session; transcript and worktree are kept",
    isEnabled: yi, load: () => Promise.resolve().then(() => (rRl(), nRl)) }),
  (vgf = Egf));

// READABLE (for understanding):
async function stopSelfSession(source) {
  telemetry("tengu_bg_agent_action", { action: "stop", source, jobSessionId: redact(getSessionId()) }); // Qe/Ne/Nr — typed passthroughs
  const jobDir = getJobDir();                                                  // _gf = process.env.CLAUDE_JOB_DIR
  if (isBackgroundSession() && jobDir) {                                       // yi
    const now = new Date().toISOString();
    const state = await readJobState(jobDir);                                  // fa
    if (state && !isTerminal(state))                                           // ph — don't clobber an already-terminal job
      await writeJobState(jobDir, { ...state, state: "stopped", detail: "stopped from session", tempo: "idle",
        needs: undefined, block: undefined, inFlight: undefined, updatedAt: now,
        firstTerminalAt: state.firstTerminalAt ?? now }).catch(logErr);        // Rp
    if (shouldPrintStopNotice()) process.stdout.write(formatStopped("Session stopped."));
  }
  return (markFlowComplete("job_stop_self"), exitProcess(0, "prompt_input_exit", { suppressResumeHint: true })); // $i
}
const stopCommandDef = {                  // Egf — interactive
  type: "local-jsx", name: "stop", description: "Stop this background session; transcript and worktree are kept",
  immediate: true, isEnabled: isBackgroundSession, load: lazyLoadStopImpl };
const stopCommandDefNonInteractive = {    // Hgf — headless (claude stop / SDK)
  type: "local", name: "stop", supportsNonInteractive: true,
  description: "Stop this background session; transcript and worktree are kept",
  isEnabled: isBackgroundSession, load: lazyLoadStopImplNonInteractive };

// Mapping: aKn→stopSelfSession, e→source, _gf→getJobDir, yi→isBackgroundSession, fa→readJobState,
//          ph→isTerminal, Rp→writeJobState, $i→exitProcess, Le→markFlowComplete, xt→getSessionId(metadata),
//          Nr→redact, oue→formatStopped, edn→shouldPrintStopNotice, Qe/Ne→typed telemetry passthroughs,
//          bgf→/stop call, Sgf→bridge-stop, Egf→stopCommandDef, Hgf→stopCommandDefNonInteractive
// v2.1.156 before-picture @542955: async Yh8(H) — same body; telemetry was raw {action:"stop",source:H,jobSessionId:E$()}
//                                  (no Qe/Ne/Nr typed wrappers; jobSessionId was unredacted)
```

The impl is the same as v2.1.156's `Yh8`: it emits `tengu_bg_agent_action{action:"stop"}`, guards on `isBackgroundSession() && CLAUDE_JOB_DIR`, reads the job state and — *only if not already terminal* (`!ph(r)`) — rewrites it to `state:"stopped"` (clearing the live `needs`/`block`/`inFlight` fields, stamping `firstTerminalAt`), prints "Session stopped.", and exits. Two cosmetic refinements: (1) the telemetry fields now pass through the typed `Qe`/`Ne` value-wrappers and `jobSessionId` is `Nr(xt())` (a redact wrapper) rather than the raw session id (§A.6); (2) the command is now exposed as **two** defs — an interactive `Egf` (`local-jsx`) and a non-interactive `Hgf` (`local`, `supportsNonInteractive:true`) so `claude stop` / SDK callers get a headless variant — both gated by `isEnabled: yi` (only shown inside a bg session). The shared `aKn` is also reached from a `bridge`-source entry (`Sgf`), matching the v2.1.156 `Yh8("bridge")` caller.

### A.6 Telemetry typed-wrappers `Qe` / `Ne` (cosmetic, value-preserving)

The `tengu_bg_agent_action` / `tengu_background` telemetry in v2.1.183 wraps field values in `Qe(...)` / `Ne(...)`. These are **value-preserving typed passthroughs** from a telemetry-schema module, not behavior changes:

```javascript
// ============================================
// Qe / Ne - telemetry value typed-passthroughs (fromEnum / fromString); identity at runtime
// Location: cli_inner_pretty.js:128-148
// ============================================

// ORIGINAL (for source lookup):
gt(/* schema ns */, { /* ... */ fromEnumOpt: () => os, fromEnum: () => Ne });
function rht(e) { return e; }
function Qe(e) { return rht(e); }   // fromString-ish
function Ne(e) { return rht(e); }   // fromEnum
function os(e) { return e == null ? void 0 : rht(e); }

// READABLE (for understanding):
const passthrough = (v) => v;       // rht — identity (schema-typed at compile time only)
const fromString = (v) => passthrough(v);  // Qe
const fromEnum   = (v) => passthrough(v);  // Ne

// Mapping: rht→passthrough, Qe→fromString, Ne→fromEnum, os→fromEnumOpt
```

So `{action: Qe("stop")}` records exactly `"stop"`, and `{via: Ne(viaSource)}` records exactly the raw `viaSource`. The recorded payloads are identical to v2.1.156's raw literals; only the *static typing* of the telemetry call sites changed. (This is why the dossier's anchor table can list `via: Ne(a)` while the baseline's banner/telemetry analysis still applies unchanged.)

---

## Part B — daemon retire/respawn refinements (delta over `worker_retire_respawn_2156.md`)

> Read the baseline [`worker_retire_respawn_2156.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/worker_retire_respawn_2156.md) first. It documents the whole design — the `BgWorkerHandle` (`SF`) handle, the `retireIfSettled(grace, pinnedSet, bridgedGrace)` signature, the **pinned guard**, the **broadened settled predicate** (non-exec idle / doubly-blocked), the **bridge grace** (`Math.max`), the **exec exclusion**, the **empty-idle-grace** reap, the **low-mem pinned-shed** (`tengu_bg_retire_pinned_low_mem` with an empty-Set bypass), the **sleep/wake `shiftGraceClocksForward`** guard, and the **`pins.json`** reload-per-tick. **All of that is carryover in v2.1.183** — verified body-for-body. This part documents only what moved.

### B.0 Carryover verification (and two dossier corrections)

I read both bundles side by side. The v2.1.183 `retireIfSettled` (`cli_inner_pretty.js:594936-595013`) and `respawnIfIdleStale` (`cli_inner_pretty.js:594895-594934`) preserve the v2.1.156 structure exactly, **including two things the scout dossier and the module README list as v2.1.183 additions but which are actually carryover:**

- **cliVersion-equality stale check — CARRYOVER.** The v2.1.156 `respawnIfIdleStale` already short-circuits `not-stale` when the worker's `cliVersion` is missing OR equals the inlined build `VERSION` literal. v2.1.156 *before-picture* (`cli_inner_pretty.js:560035-560047`):
  ```js
  if (!this.record.cliVersion ||
      this.record.cliVersion === { /* build-info */ VERSION: "2.1.156", BUILD_TIME:"2026-05-28T18:30:33Z",
        GIT_SHA:"de3d672b5e8c35ae78d81c9dd83844d334ec63af", /* … */ }.VERSION)
    return { respawned: !1, reason: "not-stale" };
  ```
  v2.1.183 is the same construct with `VERSION:"2.1.183"`. The *only* change is the version literal the bundler constant-folded in. This is **not** a delta — it is the build stamp moving with the build.

- **`session_cron` / `routine` inflight guards in `retireIfSettled` — CARRYOVER.** v2.1.156 *before-picture* (`cli_inner_pretty.js:560119-560120`):
  ```js
  if (K.inFlight?.kinds.includes("session_cron")) return { retired: !1, reason: "session-cron" };
  if (K.routine) return { retired: !1, reason: "routine" };
  ```
  These exist identically in v2.1.183 (`cli_inner_pretty.js:594996-594997`). So the cron/routine *retire* guards are carryover — the cron/routine subsystem was already integrated with eviction in v2.1.156. (What *is* new is that `respawnIfIdleStale` *also* now checks `session_cron` inflight — see B.1.3.)

The genuine deltas are three: the **`trigger` parameter** on `respawnIfIdleStale` (B.1), the **`gFl` "detritus" inflight allowlist + `detritusOnly`** (B.2), and the **`prewarm` respawn loop + `tengu_bg_attach_upgrade` gate** (B.3).

### B.1 `respawnIfIdleStale(pinnedSet, trigger = "sweep")` — the new trigger parameter

```javascript
// ============================================
// BgWorkerHandle.respawnIfIdleStale - upgrade respawn, now parameterised by a trigger source
// Location: cli_inner_pretty.js:594895-594934
// ============================================

// ORIGINAL (for source lookup):
async respawnIfIdleStale(e, t = "sweep") {
  if (this.dispatch.launch.mode === "exec") return { respawned: !1, reason: "not-stale" };
  if (this.isTransitioning) return { respawned: !1, reason: "in-progress" };
  if (this.record.outcome) return { respawned: !1, reason: "no-state" };
  if (this.attachers.size > 0) return { respawned: !1, reason: "attached" };
  if (!this.record.cliVersion || this.record.cliVersion === { /* build-info */ VERSION: "2.1.183", /* … */ }.VERSION)
    return { respawned: !1, reason: "not-stale" };                                          // CARRYOVER version-equality
  if (t !== "attach" && this.lastInputAt && Date.now() - this.lastInputAt < ZHf)            // NEW: trigger-gated recent-input busy
    return { respawned: !1, reason: "busy" };
  let n = Date.now(), r = await fa(Tc(this.dispatch.short));
  if (this.isTransitioning) return { respawned: !1, reason: "in-progress" };
  if (this.record.outcome) return { respawned: !1, reason: "no-state" };
  if (this.attachers.size > 0) return { respawned: !1, reason: "attached" };
  if (this.lastInputAt && this.lastInputAt >= n) return { respawned: !1, reason: "busy" };  // input arrived during the await
  if (!r) return { respawned: !1, reason: "no-state" };
  if (ph(r) && t === "sweep" && !e?.has(this.dispatch.short)) return { respawned: !1, reason: "settled" }; // NEW: t==="sweep" gate
  if (!ph(r) && r.tempo !== "idle") return { respawned: !1, reason: "busy" };
  let o = r.inFlight?.kinds ?? [],
    s = ph(r) && o.length > 0 && o.every((i) => gFl.includes(i));                           // NEW: detritus-only check
  if ((r.inFlight?.queued ?? 0) > 0 || ((r.inFlight?.tasks ?? 0) > 0 && !s) || o.includes("session_cron"))
    return { respawned: !1, reason: "inflight" };                                            // NEW: inflight guard on respawn
  if (!this.transitionTo({ kind: "upgrading" })) return { respawned: !1, reason: "in-progress" };
  return (this.onState.emit({ pid: this.record.pid }),
    G("tengu_bg_respawn_stale", { short: this.dispatch.short, rvSent: this.shutdownWorker(), trigger: Ne(t) }), // NEW: trigger field
    { respawned: !0 });
}

// READABLE (for understanding):
async respawnIfIdleStale(pinnedSet, trigger = "sweep") {            // trigger ∈ "sweep" | "attach" | "prewarm"
  if (this.dispatch.launch.mode === "exec") return notStale();      // never restart a shell run mid-flight
  if (this.isTransitioning) return inProgress();
  if (this.record.outcome)  return noState();
  if (this.attachers.size > 0) return attached();
  // CARRYOVER: only an UPGRADE makes a worker stale (recorded version != this build's version)
  if (!this.record.cliVersion || this.record.cliVersion === CURRENT_VERSION) return notStale();
  // NEW: when triggered by a sweep/prewarm (not an attach), refuse if input arrived in the last hour
  if (trigger !== "attach" && this.lastInputAt && Date.now() - this.lastInputAt < RECENT_INPUT_GRACE_MS) return busy();

  const startedAt = Date.now();
  const job = await readJobState(jobDir(this.dispatch.short));
  if (this.isTransitioning) return inProgress();
  if (this.record.outcome)  return noState();
  if (this.attachers.size > 0) return attached();
  if (this.lastInputAt && this.lastInputAt >= startedAt) return busy(); // input landed during the disk read
  if (!job) return noState();

  // NEW: only a SWEEP leaves a non-pinned settled worker alone; an attach/prewarm trigger may respawn it
  if (isSettled(job) && trigger === "sweep" && !pinnedSet?.has(this.dispatch.short)) return settled();
  if (!isSettled(job) && job.tempo !== "idle") return busy();

  // NEW: a settled worker whose only in-flight tasks are "detritus" (local_bash / in_process_teammate / dream)
  //      is treated as having nothing real in flight.
  const kinds = job.inFlight?.kinds ?? [];
  const detritusOnly = isSettled(job) && kinds.length > 0 && kinds.every(k => DETRITUS_KINDS.includes(k));
  if ((job.inFlight?.queued ?? 0) > 0 || ((job.inFlight?.tasks ?? 0) > 0 && !detritusOnly) || kinds.includes("session_cron"))
    return inflight();

  if (!this.transitionTo({ kind: "upgrading" })) return inProgress();
  this.onState.emit({ pid: this.record.pid });
  emit("tengu_bg_respawn_stale", { short: this.dispatch.short, rvSent: this.shutdownWorker(), trigger });
  return { respawned: true };
}

// Mapping: e→pinnedSet, t→trigger, r→job, fa→readJobState, Tc→jobDir, ph→isSettled (terminal predicate),
//          gFl→DETRITUS_KINDS, ZHf→RECENT_INPUT_GRACE_MS (3600000), {…}.VERSION→CURRENT_VERSION, G→emit, Ne→passthrough
// v2.1.156 before-picture @560029: async respawnIfIdleStale(H) — SINGLE param; NO recent-input busy check; NO t==="sweep"
//   gate (settled refusal was unconditional `_J($) && !H?.has(...)`); NO inflight/detritus guard (went straight from the
//   busy check to transitionTo); telemetry had NO `trigger` field.
```

#### Deep analysis — why a `trigger` parameter

**What it does.** `respawnIfIdleStale` now knows *who asked* — the regular minute sweep (`"sweep"`), an attach event (`"attach"`), or the prewarm loop (`"prewarm"`) — and adjusts two decisions accordingly.

**How it works (the two trigger-gated branches).**
1. **Recent-input busy refusal (`trigger !== "attach"`, `cli_inner_pretty.js:594914`).** A sweep or prewarm respawn refuses a worker that received input in the last hour (`ZHf` = 3,600,000 ms). An **attach**-triggered respawn skips this — attaching is an explicit user action ("open this session in my terminal"), and at attach time it is acceptable to upgrade-respawn a recently-active worker because the user is right there and expects a fresh, current-binary session.
2. **Settled-leave-alone only on sweep (`trigger === "sweep"`, `cli_inner_pretty.js:594922`).** A non-pinned *settled* worker is left alone *only* during a passive sweep. Under an attach or prewarm trigger, even a settled non-pinned worker may be respawned onto the new binary — because the point of attach/prewarm is to put a *current-binary* session in front of the user / in the warm pool, and a settled worker on the old binary is exactly what those triggers want to refresh.

**Why this approach.** Previously (v2.1.156) `respawnIfIdleStale` had one caller — the sweep — so it needed no notion of context. v2.1.183 adds two new callers (attach-upgrade and the prewarm loop) whose policy differs from the passive sweep: they are *user-proximate* or *pool-maintenance* events where it is correct to be more aggressive about refreshing onto the current binary. Threading a `trigger` string is the minimal way to let one method serve three policies without duplicating the whole refusal ladder. Stamping `trigger` onto `tengu_bg_respawn_stale` makes the three respawn populations distinguishable in telemetry.

**Key insight.** The two gates are *escape hatches keyed on user/pool intent*: the recent-input and settled refusals exist to keep the passive sweep gentle (don't disturb active or finished work), but an explicit attach or a deliberate prewarm legitimately wants the opposite — so those triggers bypass exactly those two gentleness gates while keeping every safety gate (exec exclusion, transitioning, attachers, version-equality, true-busy `tempo`) intact.

### B.2 The `gFl` "detritus" inflight allowlist + `detritusOnly`

```javascript
// ============================================
// gFl - the "detritus" in-flight kinds that do not block retire/respawn of a settled worker
// Location: cli_inner_pretty.js:595796
// ============================================

// ORIGINAL (for source lookup):
(gFl = ["local_bash", "in_process_teammate", "dream"]);

// READABLE (for understanding):
const DETRITUS_KINDS = ["local_bash", "in_process_teammate", "dream"]; // background residue, not real pending work

// Mapping: gFl→DETRITUS_KINDS
// v2.1.156 before-picture: no such list near retire/respawn; the in-flight guard refused on ANY tasks>0/queued>0.
//   (grep 'detritusOnly' over the v2.1.156 bundle = 0.)
```

**What it does.** Both `respawnIfIdleStale` and `retireIfSettled` now compute `detritusOnly = isSettled(job) && kinds.length > 0 && kinds.every(k => gFl.includes(k))`. When a *settled* worker's only remaining in-flight tasks are detritus kinds (a leftover `local_bash` shell, an `in_process_teammate`, or a `dream` auto-memory pass), the in-flight guard no longer keeps it alive: the guard fires only on `queued > 0`, on `tasks > 0 && !detritusOnly`, or on `session_cron`.

In `retireIfSettled` the outcome is recorded — the retire telemetry now carries `detritusOnly: i` (`cli_inner_pretty.js:595009`), grep=0 in v2.1.156:

```javascript
// ============================================
// retireIfSettled (delta excerpts) - detritus-only inflight handling + detritusOnly telemetry field
// Location: cli_inner_pretty.js:594990-595012
// ============================================

// ORIGINAL (for source lookup):
let s = r.inFlight?.kinds ?? [],
  i = ph(r) && s.length > 0 && s.every((c) => gFl.includes(c));
if ((r.inFlight?.queued ?? 1) > 0 || ((r.inFlight?.tasks ?? 1) > 0 && !i))
  return { retired: !1, reason: "inflight" };
if (s.includes("session_cron")) return { retired: !1, reason: "session-cron" };   // CARRYOVER
if (r.routine) return { retired: !1, reason: "routine" };                          // CARRYOVER
// ... grace math (carryover) ...
return (G("tengu_bg_retired", { short: this.dispatch.short, rvSent: this.shutdownWorker(),
  settledForMs: l, bridged: !!r.bridgeSessionId, detritusOnly: i, state: r.state }), { retired: !0 });

// READABLE (for understanding):
const kinds = job.inFlight?.kinds ?? [];
const detritusOnly = isSettled(job) && kinds.length > 0 && kinds.every(k => DETRITUS_KINDS.includes(k));
// retire-blocking inflight = a queued item, OR real (non-detritus) running tasks, OR a cron commitment
if ((job.inFlight?.queued ?? 1) > 0 || ((job.inFlight?.tasks ?? 1) > 0 && !detritusOnly))
  return { retired: false, reason: "inflight" };
if (kinds.includes("session_cron")) return { retired: false, reason: "session-cron" };   // carryover
if (job.routine) return { retired: false, reason: "routine" };                           // carryover
// ... bridge grace + updatedAt age check (carryover) ...
emit("tengu_bg_retired", { short: this.dispatch.short, rvSent: this.shutdownWorker(),
  settledForMs: idleMs, bridged: !!job.bridgeSessionId, detritusOnly, state: job.state });

// Mapping: r→job, s→kinds, i→detritusOnly, ph→isSettled, gFl→DETRITUS_KINDS, l→idleMs, G→emit
// v2.1.156 before-picture @560118: in-flight guard was `(K.inFlight?.tasks ?? 1) > 0 || (K.inFlight?.queued ?? 1) > 0`
//   — ANY task/queued blocked retire; no detritus carve-out; tengu_bg_retired had no `detritusOnly` field.
```

#### Deep analysis — why a detritus carve-out

**What it does.** Lets a *finished* (settled) bg worker retire/respawn even though its in-flight bookkeeping still lists certain residual tasks, provided those residual tasks are all "detritus" — background residue that does not represent real pending user work.

**How it works.** The v2.1.156 in-flight guard was binary: any `tasks > 0` or `queued > 0` blocked retirement, full stop. v2.1.183 partitions in-flight kinds into *real* work and *detritus* (`gFl`):
- `local_bash` — a background shell the session spawned (e.g. a `! cmd &` or a long-running tool shell) that has outlived the conversation;
- `in_process_teammate` — an in-process teammate agent record;
- `dream` — an auto-memory ("dream") pass running in the background.

For a worker that is *already settled* (terminal state, not active), the only blockers that still count are a *queued* item, a *non-detritus* running task, or a `session_cron` commitment. A settled worker whose sole in-flight residue is detritus is judged retire/respawn-eligible.

**Why this approach.** The bug this fixes is a settled session that *can never retire* because some residual background task — a shell that was never reaped, a finished teammate record, or a stale dream pass — keeps `inFlight.tasks > 0` forever. Under the old binary guard such a worker would pin a PTY and memory indefinitely, which is precisely the kind of "background session that never goes away" symptom. Rather than aggressively reaping on `tempo === idle` alone (which would risk killing genuinely-active work), the fix narrows the carve-out to a *named allowlist of known-residual kinds* AND requires the worker to be *already settled*. That double condition (`isSettled(job) && every(detritus)`) keeps the guard safe: a busy worker, or a settled worker with a *real* pending task, is still protected.

**Key insight.** `detritusOnly` is computed but the guard expresses it as `!detritusOnly` in the `tasks > 0` branch: real tasks block, detritus does not. Recording `detritusOnly` on `tengu_bg_retired` makes these "retired despite residual tasks" retirements auditable — you can tell, after the fact, whether a retire fired against a clean settled worker or one that still had detritus, which is exactly the signal needed to validate the carve-out is not reaping real work. This is the strongest candidate for the changelog's bg-reliability cleanups, though, as with the `left_arrow` placeholder, it could not be tied to one specific changelog bullet (see §7).

### B.3 The `prewarm` respawn loop + `tengu_bg_attach_upgrade` gate

The supervisor tick (`cli_inner_pretty.js:697220-697290`) keeps the v2.1.156 shape — sleep/wake `shiftGraceClocksForward` guard, low-mem grace selection, `pins.json` reload, pinned-only respawn loop, retire-all pass, and the low-mem pinned-shed escalation (`tengu_bg_retire_pinned_low_mem` @697251 with the empty-Set bypass `hWf`). It **adds** a prewarm respawn loop:

```javascript
// ============================================
// supervisor tick - the NEW prewarm respawn loop (after the retire pass + low-mem escalation)
// Location: cli_inner_pretty.js:697255-697283
// ============================================

// ORIGINAL (for source lookup):
if (!R && Wzn()) {                                            // R = lowMem; gate Wzn = tengu_bg_attach_upgrade
  let W = ct("tengu_bg_prewarm_per_sweep", 3), q = 12;       // budget: up to 3 respawns, scan ≤12 workers
  for (let V of I.values()) {
    if (W <= 0 || q <= 0) break;
    if (M.has(V.dispatch.short)) continue;                    // skip pinned (they have their own respawn loop)
    if (V.isBooting) { W--; continue; }                       // a booting worker already counts against the budget
    if (!V.record.cliVersion || V.record.cliVersion === { /* build-info */ VERSION: "2.1.183", /* … */ }.VERSION)
      continue;                                               // only version-mismatched (stale) workers
    if ((await V.respawnIfIdleStale(void 0, "prewarm").catch((z) => (De(z), { respawned: !1 }))).respawned) W--;
    else q--;
  }
}

// READABLE (for understanding):
// PREWARM: when NOT under memory pressure and the attach-upgrade gate is on, proactively respawn a few
// non-pinned, version-mismatched, idle workers onto the current binary so the warm-spare pool is current.
if (!lowMem && isAttachUpgradeEnabled()) {                    // Wzn = ct("tengu_bg_attach_upgrade", true)
  let respawnBudget = featureGateInt("tengu_bg_prewarm_per_sweep", 3); // at most 3 respawns this tick
  let scanBudget = 12;                                        // bound the scan so the tick stays cheap
  for (const handle of handles.values()) {
    if (respawnBudget <= 0 || scanBudget <= 0) break;
    if (pinned.has(handle.dispatch.short)) continue;          // pinned workers handled by the pinned respawn loop above
    if (handle.isBooting) { respawnBudget--; continue; }      // a worker still booting counts toward the budget
    if (!handle.record.cliVersion || handle.record.cliVersion === CURRENT_VERSION) continue; // already current => skip
    const { respawned } = await handle.respawnIfIdleStale(undefined, "prewarm").catch(e => (logError(e), { respawned: false }));
    if (respawned) respawnBudget--; else scanBudget--;
  }
}

// Mapping: R→lowMem, Wzn→isAttachUpgradeEnabled (gate tengu_bg_attach_upgrade), W→respawnBudget, q→scanBudget,
//          M→pinned, I→handles, ct→featureGateInt, "prewarm"→trigger, {…}.VERSION→CURRENT_VERSION, De→logError
// v2.1.156 before-picture: NO prewarm loop in the supervisor tick (grep '"prewarm"' over the v2.1.156 bundle = 0;
//   grep 'tengu_bg_attach_upgrade' = 0). The tick ended after the low-mem escalation.
```

The gate `Wzn` (`cli_inner_pretty.js:564348-564350`) is `ct("tengu_bg_attach_upgrade", !0)` — a feature gate defaulting **on**.

#### Deep analysis — proactive prewarm respawn

**What it does.** Once per sweep, when memory is healthy and the `tengu_bg_attach_upgrade` gate is on, the supervisor respawns up to `tengu_bg_prewarm_per_sweep` (default 3) **non-pinned, version-mismatched, idle** workers onto the current binary — keeping the warm-spare pool from rotting on an old build.

**How it works (the dual budget).** The loop carries two budgets: a respawn budget `W` (default 3 — how many workers it will actually upgrade this tick) and a scan budget `q` (12 — how many candidates it will *examine*). Each iteration: skip pinned workers (the pinned respawn loop above already handles them); a *booting* worker consumes one respawn-budget slot and is skipped (it is already on its way to current); a worker already on the current version is skipped *without* consuming either budget (`continue` before the budget decrement); otherwise it calls `respawnIfIdleStale(undefined, "prewarm")` — which, under the `"prewarm"` trigger, will respawn even a settled non-pinned worker (B.1) but still honors every safety gate. A successful respawn decrements the respawn budget; a refusal decrements the scan budget. The loop stops when either budget hits zero.

**Why this approach.** The warm-spare pool exists so a new `/bg` dispatch can attach to an already-running worker instead of paying a cold start. But after a binary upgrade, those spares are running the *old* binary; attaching to one would give the user a stale version. The passive sweep only *retires* stale workers (and re-dispatches lazily); a *proactive* prewarm respawn refreshes the pool ahead of demand, so the next attach lands on a current-binary worker with no cold start. The **dual budget** is the cost-control: prewarm is best-effort housekeeping, not a correctness path, so it bounds both how much work it does (≤3 respawns) and how long it spends looking (≤12 scans) to keep the once-a-minute tick cheap. Gating on `!lowMem` ensures the pool-warming never competes with the low-mem shed — under pressure the tick is busy retiring, not prewarming. The whole thing sits behind a feature gate (`tengu_bg_attach_upgrade`) so it can be killed remotely.

**Key insight.** Prewarm reuses `respawnIfIdleStale` rather than adding a parallel respawn path — the `trigger` parameter (B.1) is precisely what makes that reuse correct: the `"prewarm"` trigger relaxes the *gentleness* gates (it will refresh a settled non-pinned worker) while preserving the *safety* gates, so the same battle-tested refusal ladder governs both the reactive sweep and the proactive prewarm. The scan/respawn dual-budget is the bundle's idiom for "do a little maintenance per tick without ever stalling the tick."

### B.4 What stayed identical in the tick (carryover — see baseline)

Everything else in the supervisor tick is the v2.1.156 design:
- **sleep/wake guard** (`shiftGraceClocksForward(overshoot)` + early return) — `cli_inner_pretty.js:697228-697232`;
- **low-mem grace selection** (`lowMem ? LOW_MEM_GRACE : NORMAL`, bridged grace via `uMl()`/`tengu_bg_retire_grace_bridged_min` default 480 min) — `cli_inner_pretty.js:697233-697235`;
- **`pins.json` reload per tick** (`UFe()`, the re-mangled `Qw$`) — `cli_inner_pretty.js:697235`;
- **pinned-only respawn loop** then **retire-all pass** — `cli_inner_pretty.js:697236-697243`;
- **low-mem pinned-shed escalation** (`tengu_bg_retire_pinned_low_mem`, empty-Set `hWf` bypass) — `cli_inner_pretty.js:697245-697254`.

All of that is documented with full What/How/Why in [`worker_retire_respawn_2156.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/worker_retire_respawn_2156.md) and is not re-derived here.

---

## Open questions / low-medium-confidence (carried from the dossier, honestly)

1. **"Working forever" fix (2.1.178) — low confidence on exact site.** No distinct string isolates it. The most likely v2.1.183 contributor is the **`detritusOnly` carve-out (B.2)**: a settled worker stuck with only residual `local_bash`/`in_process_teammate`/`dream` in-flight tasks could previously never retire and would report as live indefinitely; B.2 lets it retire. A second candidate is the `agents --json` state mapper (`lGf`, `cli_inner_pretty.js:691342`, documented in `agents_json_surface_2169.md`) deriving a terminal `done`/`failed`/`stopped` so a finished session no longer surfaces as `working`. Could not pin to a single patch line.
2. **`--bg -cn <name>` name-not-seeding fix (2.1.176) — not isolated.** No `-cn`/`--session-name` literal was found near the bg dispatch path; the session name is seeded inside the env-builder `_Fl` (`CLAUDE_CODE_SESSION_NAME: seed?.name || seed?.intent || short`, see `worker_env_isolation_2181.md`). The micro-fix likely lives in the CLI `--bg` arg-parsing region (the `XAf = ["--bg","--background"]` zone @566831), not in `sKn` or the dispatcher.
3. **The `left_arrow` failure-placeholder branch (§A.3) and the `detritusOnly` carve-out (§B.2) are clearly bg-reliability hardening**, but neither maps cleanly onto a single named changelog bullet; both are documented from the source as standalone deltas with high confidence in *what they do*, medium confidence in *which changelog line they satisfy*.
4. **Prewarm ↔ project-settings/auth-leak interaction (2.1.172 / 2.1.174) — medium-low confidence.** The prewarm respawn (B.3) re-runs the spawn path, so it re-runs the env-builder `_Fl` scrub (`worker_env_isolation_2181.md`); plausibly this subsumes the "pre-warmed worker project-settings leak" and "could not resolve authentication after idle" fixes, but no dedicated prewarm-scrub line was isolated.

---

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file. This doc uses **list format**, never an obfuscated→readable mapping table (the cross-version comparison table in the TL;DR is the allowed re-mangle exception):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (the worker-handle / dispatcher execution path)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Background Agents** is the home module: `/bg`, `/stop`, the daemon fleet)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (telemetry typed-wrappers, feature gates)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_183_background_agents.md](../00_overview/symbol_additions_v2_1_183_background_agents.md) — the granular v2.1.183 additions for this module (add new rows there)
>
> Cross-tree baseline (unchanged carryover — do NOT re-derive):
> - `/bg` full flow & reasoning: [`../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md)
> - Daemon retire/respawn design: [`../../../claude_code_v_2.1.156/analyze/36_background_agents/worker_retire_respawn_2156.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/worker_retire_respawn_2156.md)
> - Sibling v2.1.183 deltas: [`README.md`](./README.md), [`nested_subagent_depth_limit.md`](./nested_subagent_depth_limit.md), [`worker_env_isolation_2181.md`](./worker_env_isolation_2181.md)

Key functions in this document:

**`/bg` (`/background`) surface:**
- `backgroundModule` (obf `JMl`, cli_inner_pretty.js:566833) — ESM export namespace; triple `{spawnBackgroundFork, deriveBackgroundSeed, call}` (was `OH9`)
- `spawnBackgroundFork` (obf `sKn`, cli_inner_pretty.js:566834) — argv builder over the dispatcher `PX`; NEW `left_arrow` failure-placeholder branch + `Zyn()` effort gate (was `zh8`)
- `deriveBackgroundSeed` (obf `iKn`, cli_inner_pretty.js:566927) — reverse-scan transcript → `{intent,name,nameSource,detail}` (was `Ah8`)
- `BackgroundForkPrompt` (obf `ugf`, cli_inner_pretty.js:566957) — confirm UI; auto-confirm-when-idle; once-only fork effect (was `gwz`)
- `backgroundCall` (obf `lgf`, cli_inner_pretty.js:567091) — `call` handler; three guards then render UI (was `Fwz`)
- `backgroundCommandDef` (obf `hgf`/`ygf`, cli_inner_pretty.js:567140) — `local-jsx` def `{name:"background", aliases:["bg"], immediate:(e)=>!e.trim()}` (was `owz`/`awz`)
- `requestDaemonDetach` (obf `Gye`, cli_inner_pretty.js:477381) — already-bg detach (was `bzH`)
- `launchEffortFlagsUnpinned` (obf `Zyn`, cli_inner_pretty.js:148956) — gate on `--effort` propagation (NEW condition)

**`/stop` surface:**
- `stopSelfSession` (obf `aKn`, cli_inner_pretty.js:567155) — writes `state:"stopped"` to the bg job, emits `tengu_bg_agent_action{action:"stop"}`, exits (was `Yh8`)
- `stopCommandDef` (obf `Egf`, cli_inner_pretty.js:567208) — interactive `local-jsx` `/stop`
- `stopCommandDefNonInteractive` (obf `Hgf`, cli_inner_pretty.js:567208) — headless `local` `/stop` (`supportsNonInteractive:true`)

**telemetry typed-wrappers (cosmetic):**
- `fromString`/`fromEnum` passthroughs (obf `Qe`/`Ne`, cli_inner_pretty.js:137/140) — value-preserving telemetry typing

**daemon retire/respawn:**
- `BgWorkerHandle.respawnIfIdleStale` (cli_inner_pretty.js:594895) — NEW `trigger` param (`sweep`/`attach`/`prewarm`), inflight/detritus guard, `trigger` telemetry
- `BgWorkerHandle.retireIfSettled` (cli_inner_pretty.js:594936) — NEW `detritusOnly` carve-out + telemetry field (cron/routine guards are carryover)
- `DETRITUS_KINDS` (obf `gFl`, cli_inner_pretty.js:595796) — `["local_bash","in_process_teammate","dream"]` inflight allowlist (NEW)
- `isAttachUpgradeEnabled` (obf `Wzn`, cli_inner_pretty.js:564348) — `tengu_bg_attach_upgrade` gate (NEW)
- supervisor tick prewarm loop (cli_inner_pretty.js:697255) — `respawnIfIdleStale(void 0, "prewarm")`, dual budget (NEW)
