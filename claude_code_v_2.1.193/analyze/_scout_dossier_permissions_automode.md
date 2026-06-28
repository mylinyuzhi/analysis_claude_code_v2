# Scout Dossier — Permissions & Auto-Mode (v2.1.183 → v2.1.193)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
(VERSION `2.1.193`, build `a1938d2a`, 2026-06-25, 718,679 lines)
**Before-picture:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)

All line anchors below are in the **193** bundle unless explicitly labelled `(183)`. Obfuscated tokens are re-mangled every build — each was re-derived by line in 193. "183-diff" gives `grep -c` evidence (net-new vs carryover vs body-change).

This is the largest net-new surface in the window. **Verdict: 5 of 8 bullets are genuine 193 deltas (classifyAllShell, denial-reason toast/recent-denied surfacing, sandbox.credentials, org-model entitlement restriction, session-allowed-hosts, recent-denied approve-persists), 1 is a clean refinement (Agent named-spawn type enforcement), and 2 are largely/entirely CARRYOVER (background-subagent permission forwarding).**

---

## Bullet 1 — `autoMode.classifyAllShell`: route ALL Bash/PowerShell through the classifier

**Status: NET-NEW (2.1.193). Confidence: HIGH.**

A new settings flag that, when true, **suspends every Bash/PowerShell `allow` rule** while auto mode is active, so all shell commands are routed through the auto-mode classifier — not just the ones matching the "arbitrary code execution" dangerous-prefix list.

### Anchor table

| Item | 193 anchor | Obf symbol | Readable gloss | 183-diff |
|------|-----------|-----------|----------------|----------|
| Schema field | `cli_inner_pretty.js:55814` | `classifyAllShell: A.boolean()` | `autoMode.classifier.classifyAllShell` zod field | `grep -c classifyAllShell` 183=**0**, 193=2 → net-new |
| Gate (any source on) | `cli_inner_pretty.js:58758-58761` | `$Cr` | `isClassifyAllShellEnabled()` — `for(let e of Uys) if(_n(e)?.autoMode?.classifyAllShell===!0) return !0` | net-new |
| Settings sources | `cli_inner_pretty.js:58827` | `Uys` | `["userSettings","localSettings","flagSettings","policySettings"]` | carryover list |
| Wrapper | `cli_inner_pretty.js:416258` | `sTo` | `shouldSuspendAllShellAllowRules()` → returns `$Cr()` | net-new |
| **Suspend predicate** | `cli_inner_pretty.js:416263-416270` | `r9e` | `isShellAllowRuleSuspended(toolName, ruleContent)` | **body-change** (vs 183 `WGe`) |
| Bash dangerous-prefix detector | `cli_inner_pretty.js:416162-416167` | `mqt` | `isDangerousBashAllowRule` — the "arbitrary code execution" gate | carryover |
| PowerShell dangerous-prefix detector | `cli_inner_pretty.js:416208` | `hqt` | `isDangerousPowerShellAllowRule` | carryover |
| Bash tool name | `cli_inner_pretty.js:146006` | `Io = "Bash"` | — | carryover |
| PowerShell tool name | `cli_inner_pretty.js:229433` | `Ss = "PowerShell"` | — | carryover |

### The core body change

`r9e` (193) = `WGe` (183) **plus one prepended bypass line**:

```javascript
// ============================================
// isShellAllowRuleSuspended - returns true if a Bash/PowerShell allow rule must NOT be honored
// Location: cli_inner_pretty.js:416263-416270
// ============================================

// ORIGINAL (for source lookup):
function r9e(e, t) {
  if ((e === Io || e === Ss) && sTo()) return !0;                 // <-- NET-NEW in 193
  let n = `${e}\x00${t ?? ""}`, r = Orl.get(n);
  if (r !== void 0) return r;
  let o = mqt(e, t) || hqt(e, t) || oTo(e, t);
  return (Orl.set(n, o), o);
}

// READABLE (for understanding):
function isShellAllowRuleSuspended(toolName, ruleContent) {
  // NET-NEW: when classifyAllShell is on, suspend EVERY Bash/PowerShell allow rule
  if ((toolName === BASH || toolName === POWERSHELL) && shouldSuspendAllShellAllowRules()) return true;
  let cacheKey = `${toolName}\x00${ruleContent ?? ""}`, cached = shellRuleSuspendCache.get(cacheKey);
  if (cached !== undefined) return cached;
  // Pre-existing path: suspend only "arbitrary code execution" dangerous-prefix rules
  let suspended = isDangerousBashAllowRule(toolName, ruleContent)
               || isDangerousPowerShellAllowRule(toolName, ruleContent)
               || resolvesToAgentTool(toolName, ruleContent);
  return (shellRuleSuspendCache.set(cacheKey, suspended), suspended);
}

// Mapping: r9e→isShellAllowRuleSuspended, sTo→shouldSuspendAllShellAllowRules, mqt→isDangerousBashAllowRule,
//          hqt→isDangerousPowerShellAllowRule, oTo→resolvesToAgentTool, Orl→shellRuleSuspendCache, Io→BASH, Ss→POWERSHELL
```

**183 proof** — the equivalent `WGe` at `(183) cli_inner_pretty.js:409909-409914` has **no** `sTo()` clause:
```javascript
function WGe(e, t) {                                  // 183 — note: no classifyAllShell line
  let n = `${e}\x00${t ?? ""}`, r = EGa.get(n);
  if (r !== void 0) return r;
  let o = Ijt(e, t) || kjt(e, t) || zuo(e, t);
  return (EGa.set(n, o), o);
}
```

### Where the suspension takes effect (the 4 callers of `r9e`)
- `cli_inner_pretty.js:597471` — `NEe` (`buildAutoModeAllowLayers`): in auto mode (`dQl(mode)` = `"auto"` or plan-with-auto-active, defined at `597459`), each `alwaysAllowRule` whose `r9e` is true is **skipped** (`continue`) → never applied as an allow.
- `cli_inner_pretty.js:597964` — filter `O = (F) => !r9e(...)` applied to `alwaysAllowRules` **and** `permissionLayers[].allowedTools`, so suspended rules are stripped before `checkPermissions`.
- `cli_inner_pretty.js:598268` — `yjo` collects suspended allow rules for **display** (rule shown as `Tool(content)` with its source) — this is the "these allow rules are suspended in auto mode" surface.
- `cli_inner_pretty.js:598279` — same display path for `--allowed-tools` CLI args.

**Key insight:** Auto-mode safety is normally "allow rules apply, except dangerous interpreter prefixes (`python -c`, `node -e`, `bash`, `eval`, `sudo`, `curl … |`, `kubectl exec`, etc. — the `$rl` list at `416116-416161`) which still go through the classifier." `classifyAllShell=true` collapses that to "**no** Bash/PowerShell allow rule is trusted; everything is classified." Trade-off is stated verbatim in the schema describe: *"higher safety, more classifier calls."* **Upgrade gotcha:** default is `false`, so behavior is unchanged on upgrade unless an org/user opts in.

---

## Bullet 2 — Auto-mode DENIAL REASONS surfaced in transcript + toast + /permissions recent-denied

**Status: MIXED — denial RECORD with reason is CARRYOVER; the TOAST reason + RECENT-DENIED reason display are NET-NEW; the TRANSCRIPT denial-kind plumbing is NET-NEW but DARK (gated off). Confidence: HIGH on toast/recent-denied, MEDIUM on transcript.**

### Anchor table

| Surface | 193 anchor | Obf symbol | Readable | 183-diff |
|---------|-----------|-----------|----------|----------|
| Denial store (provider) | `cli_inner_pretty.js:546168-546205` | `r4l`/`oSt` | `RecentDenialsProvider` / `useRecentDenials()` (`getDenials`/`recordDenial`/`removeDenial`, ring buffer size `VLf=20`) | carryover |
| recordDenial **with reason** | `cli_inner_pretty.js:640262-640269` | `r({toolName,display,inputKey,reason,timestamp})` | denial record already carries `reason` | **carryover** (183 `627443-627451` identical shape) |
| **Toast shows reason** | `cli_inner_pretty.js:640271-640294` | `i({key:"auto-mode-denied",…})` | `addNotification` with truncated reason | **NET-NEW** (see diff) |
| Toast string | `cli_inner_pretty.js:640279` | `"… denied by auto mode"` | — | string carryover, layout changed |
| **Recent-denied shows reason** | `cli_inner_pretty.js:546589-546594` | `f4l` option builder | `description: M.reason, dimDescription:!0` | **NET-NEW** (183 had `...{}`) |
| Transcript denial-kind | `cli_inner_pretty.js:382614-382626` | `XKa`/`USe` | `classifyToolDenialKind()` / `isToolDenialKindEnabled()` (returns `false`) | **NET-NEW but DARK** |
| `toolDenialKind` field | `cli_inner_pretty.js:445167, 462587, 599612, 599637, 382990` | `toolDenialKind` | user-message metadata threaded into classifier transcript via `qGp` | `grep -c` 183=**0**, 193=7 → net-new |
| Auto-approval reason (transcript) | `cli_inner_pretty.js:395284-395292` | `dQa`/`pQa` | `setAutoModeApprovalReason` / `getAutoModeApprovalReason` (approvals map) | carryover (183 `PNa`) |

### Toast diff (precise)

**183** (`627452-627470`): the third child of the toast Fragment is hard-coded `null` — **no reason shown**:
```javascript
let k = "";   // assigned but never used
i({ key:"auto-mode-denied", … jsx: rde.createElement(rde.Fragment, null,
     rde.createElement(w,{color:"error"}, tool.toLowerCase(), " denied by auto mode"),
     null,                                            // <-- 183: NO reason
     rde.createElement(w,{dimColor:!0}," \xB7 /permissions")) });
```

**193** (`640271-640294`): reason is truncated to 79 chars + ellipsis and rendered:
```javascript
let k = "";
if (((k = v.decisionReason.reason ?? ""), k.length > 80)) k = `${k.slice(0,79)}…`;   // NET-NEW truncation
i({ key:"auto-mode-denied", … jsx: OOe.jsxs(OOe.Fragment,{children:[
     OOe.jsxs(w,{color:"error",children:[tool.toLowerCase()," denied by auto mode"]}),
     k ? OOe.jsxs(w,{dimColor:!0,children:[" \xB7 ",k]}) : null,    // <-- NET-NEW: reason in toast
     OOe.jsx(w,{dimColor:!0,children:" \xB7 /permissions"})]}) });
```
`grep -c "k.length > 80"` near the toast: 183 has no such truncation; 193 has it → net-new.

### Recent-denied diff (precise)
**183** (`535601-535621`): option built with trailing `...{}` (nothing) — reason stored but never displayed.
**193** (`546589-546594`): `...(M.reason ? { description: M.reason, dimDescription: !0 } : {})` → the stored reason now renders as a dimmed sub-line under each denied command in the "Recently denied" tab. Also `(retry)` suffix logic at `546589`.

### Transcript denial-kind (`toolDenialKind`)
`XKa` (`classifyToolDenialKind`, `382614`) maps a deny decision to one of `"user-rejected" | "automode-unavailable" | "automode-parsing-error" | "automode-blocked" | "permission-rule"`. It is written onto the user (tool-result) message (`445167`, `462587`, struct field at `599612/599637`) and consumed in the classifier-input renderer `qGp` (`383163`). **However `USe()` (`382624`) currently `return !1`**, so `toolDenialKind: USe() ? XKa($) : void 0` always evaluates to `void 0` today — the plumbing is net-new but **dark-launched / inactive** in 2.1.193. Note: the *approval*-reason transcript path (`dQa`/`pQa`, an `approvals` map keyed by tool-use) is carryover (183 `PNa`).

**Key insight:** The denial *record* already stored `reason` in 183 — the 193 work is the **surfacing**: the toast now appends the (truncated) reason, the Recently-denied list now renders it as a description, and a richer per-message `toolDenialKind` taxonomy was wired through the transcript pipeline (staged behind `USe()===false`).

---

## Bullet 3 — `sandbox.credentials`: block sandboxed commands from reading credential files / secret env

**Status: NET-NEW in window (changelog 2.1.187; no 187 bundle exists, so attribution rests on 183=0 / 193>0). Confidence: HIGH.**

> NB: the seed anchors @4790/@8438 are the **Anthropic-SDK** auth `credentials_path` / client option — unrelated. The real feature is the sandbox settings sub-object below.

### Anchor table

| Item | 193 anchor | Obf symbol | Readable | 183-diff |
|------|-----------|-----------|----------|----------|
| Credential file entry schema | `cli_inner_pretty.js:54048-54058` | `kwr` | `{ path: string.min(1), mode: literal("deny") }` | net-new |
| Secret env entry schema | `cli_inner_pretty.js:54059-54067` | `Rwr` | `{ name: /^[A-Za-z_]\w*$/, mode: literal("deny") }` | net-new |
| `sandbox.credentials` object | `cli_inner_pretty.js:54069-54077` | `IEu` | `{ files?: kwr()[], envVars?: Rwr()[] }` | net-new |
| Wired into sandbox schema | `cli_inner_pretty.js:54096` | `credentials: IEu()` (in `Lwr`) | sandbox root schema | net-new |
| Describe strings | `cli_inner_pretty.js:54072, 54075` | "Credential files or directories to protect…" / "…unsets the variable for sandboxed commands." | — | `grep -c` 183=**0**, 193=2 → net-new |
| **Config assembly** | `cli_inner_pretty.js:219467-219476` | `let W=_n($)?.sandbox?.credentials` | merge `files` (path-resolved via `p3e`) + `envVars` across all settings sources `jT` into `credentials: k` | net-new |
| **Enforcement** | `cli_inner_pretty.js:211660-211671` | `Rqi` | `resolveCredentialProtection(creds, allowedDomains)` → `{denyReadPaths, unsetEnvVars, setEnvVars}` | net-new |
| Deny-read merge | `cli_inner_pretty.js:211677` | `Yjd` | `Yjd()` merges `Rqi(...).denyReadPaths` into `filesystem.denyRead` | net-new |
| Validation path strings | `cli_inner_pretty.js:57039, 57051, 57055` | `sandbox.credentials.${i}[]` | settings-validation error labels | net-new |
| denyReadPaths/unsetEnvVars symbols | (8 hits) | `denyReadPaths`/`unsetEnvVars` | — | `grep -c` 183=**0**, 193=8 → net-new |

### Enforcement core
```javascript
// ============================================
// resolveCredentialProtection - credential files -> sandbox deny-read; secret env -> unset
// Location: cli_inner_pretty.js:211660-211671
// ============================================

// ORIGINAL (for source lookup):
function Rqi(e, t) {
  if (!e) return { denyReadPaths: [], unsetEnvVars: [], setEnvVars: {} };
  let r = (e.files ?? []).filter((i) => i.mode === "deny").map((i) => i.path), o = [], s = {};
  for (let i of e.envVars ?? [])
    if (i.mode === "deny") o.push(i.name);
    else if (i.mode === "mask") { let a = process.env[i.name]; if (a === void 0) continue;
      let l = i.injectHosts ?? t ?? []; s[i.name] = FRn.register(i.name, a, l); }
  return { denyReadPaths: [...new Set(r)], unsetEnvVars: [...new Set(o)], setEnvVars: s };
}

// READABLE (for understanding):
function resolveCredentialProtection(credentials, defaultInjectHosts) {
  if (!credentials) return { denyReadPaths: [], unsetEnvVars: [], setEnvVars: {} };
  let denyFiles = (credentials.files ?? []).filter(f => f.mode === "deny").map(f => f.path), unset = [], masked = {};
  for (let ev of credentials.envVars ?? [])
    if (ev.mode === "deny") unset.push(ev.name);              // secret env -> unset for sandboxed cmd
    else if (ev.mode === "mask") { ... FRn.register(...) }    // staged "mask" mode (per-host injection)
  return { denyReadPaths: [...new Set(denyFiles)], unsetEnvVars: [...new Set(unset)], setEnvVars: masked };
}
// Mapping: Rqi→resolveCredentialProtection, FRn→secretInjectionRegistry
```
`denyReadPaths` are folded into the sandbox filesystem deny-read set in `Yjd` (`211677`), so a sandboxed Bash command physically cannot read e.g. `~/.aws/credentials`. `unsetEnvVars` are stripped from the sandboxed command's environment.

**Note:** the schema only allows `mode:"deny"`, but the enforcer also handles a `mode:"mask"` branch (with `injectHosts`, `FRn.register`, and `Ya?.credentials?.allowPlaintextInject` at `211560`). This is a **staged credential-injection** capability not yet exposed in the public schema — flagged for follow-up; not part of the changelog bullet.

---

## Bullet 4 — Org-configured model restrictions (picker / `--model` / `/model` / `ANTHROPIC_MODEL`)

**Status: MIXED — the entitlement gate + `/model`-switch denial + fallback resolver are NET-NEW; the "Using X instead" warning string is CARRYOVER. Confidence: HIGH.**

### Anchor table

| Item | 193 anchor | Obf symbol | Readable | 183-diff |
|------|-----------|-----------|----------|----------|
| Restricted-set builder | `cli_inner_pretty.js:102808-102812` | `d7u` | `buildRestrictedModelSet(entitlements)` — `if(!n.entitled) add(apiName)` | `grep -c "if (!n.entitled)"` 183=**0** → net-new |
| **Restriction gate** | `cli_inner_pretty.js:102814-102819` | `NFe` | `isModelRestrictedByEntitlements(model, restrictedSet)` | net-new |
| Org restricted set | `cli_inner_pretty.js:102820-102824` | `Uge` | `getOrgRestrictedModelSet()` — only for `firstParty`/`gateway` auth | net-new |
| `/model` switch denial | `cli_inner_pretty.js:487243-487256` | `tzt` | `switchModel()` returns `{ok:false, message:"… Run /model …"}` | net-new |
| "Run /model …" string | `cli_inner_pretty.js:487250` | — | "Model 'X' is restricted by your organization's settings. Run /model to choose a different model." | `grep -c` 183=**0** → net-new |
| Telemetry | `cli_inner_pretty.js:487247` | `Re("model_switch","denied_by_entitlement")` | — | `grep -c denied_by_entitlement` 183=**0**, 193=1 → net-new |
| Picker/availability filter | `cli_inner_pretty.js:102880` | `Ia` | `isModelAvailable` → `if (NFe(e, Uge())) return !1` | NFe clause net-new |
| Default-model selection filter | `cli_inner_pretty.js:103166, 103185` | — | `(dB(a) ?? Ia(a)) && !NFe(a, Uge())` | net-new |
| **Fallback resolver** | `cli_inner_pretty.js:103211-103224` | `u_n` | `resolveRestrictedModelFallback(model)` — if restricted, pick next entitled family (opus→sonnet→haiku) | net-new |
| Effective-model resolver (covers `ANTHROPIC_MODEL`/env) | `cli_inner_pretty.js:103207-103210` | `aw` | `getEffectiveModel()` → `u_n(r) ?? r` | uses net-new `u_n` |
| "Using X instead" warning | `cli_inner_pretty.js:374023` | `rre` | `formatModelRestrictedWarning(requested, effective)` | **carryover** (183 `362631`) |

**Coverage proof for all 4 entry points:** `--model`/`ANTHROPIC_MODEL`/env resolve through `aw()`→`u_n()`→`NFe` (`103207`); the interactive **picker** & default selection filter via `Ia()`→`NFe` (`102880`, `103166`, `103185`); the **/model** command path is `tzt()` (`487243`, callers `559212/560675/560710`) returning the "Run /model" denial. The restricted-set is only non-empty for first-party / gateway auth (`Uge` at `102822`), i.e. org entitlements — third-party/Bedrock/Vertex are exempt.

**Key insight:** 183 already *warned* and fell back when a configured model wasn't allowed (the `rre` "Using X instead" message — used broadly for agent/startup model clamping). What's new in 193 is the **entitlement-driven hard gate**: a model the org hasn't entitled is now excluded from the picker, rejected by `/model` with a distinct actionable message + `denied_by_entitlement` telemetry, and auto-downgraded by `u_n` to the nearest entitled family.

---

## Bullet 5 — `Agent(type)` deny rules + `Agent(x,y)` allowed-types for named subagent spawns

**Status: MOSTLY CARRYOVER + one NET-NEW enforcement site (refinement). Confidence: HIGH.**

The Agent-type permission matcher (`p9e`/`wPe`), the `allowedAgentTypes` allow-list, and the deny message already existed in 183. **The 193 delta is an explicit, upfront deny+allowlist check inserted into the named-subagent (Task) spawn path.**

### Anchor table

| Item | 193 anchor | Obf symbol | Readable | 183-diff |
|------|-----------|-----------|----------|----------|
| Agent tool name | `cli_inner_pretty.js:150806` | `is = "Agent"` | — | carryover |
| Deny-rule finder | `cli_inner_pretty.js:597589-597591` | `p9e` | `findDenyRuleForTool(permCtx, "Agent", agentType)` | carryover (183 `585554` shape) |
| Type filter by deny rules | `cli_inner_pretty.js:597592-597597` | `wPe` | `filterAgentsByDenyRules(agents, permCtx, "Agent")` — drops `Agent(type)`-denied types | carryover (183 `585557`) |
| Fork availability helper | `cli_inner_pretty.js:430268-430273` | `Wil` | `resolveForkAgentAvailability(agents, allowedTypes, {permCtx})` → `{available, denyRule}` | carryover (183 `gqa` `423337`) |
| `allowedAgentTypes` | (19 hits) | `allowedAgentTypes` | `Agent(x,y)` allow-list narrowing | `grep -c` 19 in **both** → carryover |
| Workflow-agent deny msg | `cli_inner_pretty.js:423656-423659` | — | `agent({agentType}): 'X' is denied by permission rule 'Agent(X)'…` | carryover (183 `417102`) |
| **NEW upfront named-type check** | `cli_inner_pretty.js:430515-430532` | (inline in spawn `await` body) | explicit `p9e` deny + `allowedAgentTypes` check for requested type `t` | **NET-NEW** |
| Deny msg occurrences | `cli_inner_pretty.js:430513, 430521, 430601` | `"has been denied by permission rule"` | — | `grep -c` 183=**2**, 193=**3** → +1 net-new |
| `subagent_type_denied` telemetry | (3 hits) | `Re("subagent_launch","subagent_type_denied")` | — | `grep -c` 183=**2**, 193=**3** → +1 net-new |

### The inserted block (193 only)
```javascript
// cli_inner_pretty.js:430515-430532 — between the fork-deny check and the teammate-spawn path
let O = k && R;                                  // O = fork available
if (t !== void 0 && !k) {                        // explicit named type requested (not fork)
  let Se = p9e(y, is, t);                         // Agent(type) DENY rule?
  if (Se) { Re("subagent_launch","subagent_type_denied");
    throw new E9e(`Agent type '${t}' has been denied by permission rule '${is}(${t})' from ${Se.source}.`); }
  if (I && !I.includes(t)) {                      // allowedAgentTypes (Agent(x,y)) restriction
    Re("subagent_launch","subagent_type_not_found");
    let ye = wPe(x.filter(fe => I.includes(fe.agentType)), y, is).map(fe => fe.agentType);
    throw new E9e(`Agent type '${t}' not found. Available agents: ${ye.join(", ")}`); }
}
```
The 183 spawn body (`(183) 423567-423650`) jumps straight from the fork-deny to `let L = x && I;` with **no** such upfront block — a denied named type was only caught later (via the ambiguous-resolution branch) or fell through to a generic "not found". 193 makes the deny explicit and immediate for any named type.

**Key insight:** Matcher machinery is carryover; the behavioral delta is *where* it runs — `Agent(type)` deny rules and `Agent(x,y)` allow-lists are now enforced **before** name resolution for explicitly-typed spawns, yielding a precise "denied by permission rule … from <source>" error.

---

## Bullet 6 — Background subagents surface permission prompts in the main session

**Status: CARRYOVER — could not isolate a net-new 2.1.193 change. Confidence: MEDIUM (that it is carryover).**

The whole machinery is byte-for-byte present in 183:

| Item | 193 anchor | Obf symbol | Readable | 183-diff |
|------|-----------|-----------|----------|----------|
| Worker→leader request forward | `cli_inner_pretty.js:640155-640200` | `rdc` | `forwardWorkerPermissionRequest` (sets `pendingWorkerRequest`) | carryover |
| State field | `cli_inner_pretty.js:303749, 390172, 687702` | `pendingWorkerRequest` | `{toolName, toolUseId, description}` | `grep -c` 7 in **both** → carryover |
| Telemetry | `cli_inner_pretty.js:640198/640200` | `permission_swarm_forward` | — | `grep -c` 2 in **both** → carryover |
| Request builder w/ agent identity | `cli_inner_pretty.js:426557-426575` | `M8n` | `buildWorkerPermissionRequest` — includes `workerName`, `workerColor` (the "which agent asks") | carryover |
| Esc/abort → deny just this tool | `cli_inner_pretty.js:640189-640196` | abort listener → `t.cancelAndAbort` | — | carryover |

`pendingWorkerRequest` (7), `permission_swarm_forward` (2), and the `workerName`/`workerColor` identity on the request all match 183 exactly. The dialog already showed which agent asked and Esc already denied only that tool in 183. **If the changelog lists this under 2.1.186, the implementation predates the 183 snapshot** — I cannot point to a 193-bundle line that changed. Reporting honestly as carryover, not a 193 delta.

---

## Bullet 7 — Sandbox network permission dialog remembers "Yes" hosts for the session

**Status: NET-NEW (2.1.191). Confidence: HIGH.**

### Anchor table

| Item | 193 anchor | Obf symbol | Readable | 183-diff |
|------|-----------|-----------|----------|----------|
| Session host set | `cli_inner_pretty.js:219833` | `BLn = new Set()` | `sessionAllowedHosts` | net-new |
| **Add host** | `cli_inner_pretty.js:219238-219241` | `_Wd` | `addSessionAllowedHost(host)` — `BLn.add(e); hJr()` (refresh config) | `grep -c addSessionAllowedHost` 183=**0**, 193=5 → net-new |
| Exposed on controller | `cli_inner_pretty.js:219863` | `ko.addSessionAllowedHost: _Wd` | sandbox controller `ko` method | net-new |
| **Merge into allowedDomains** | `cli_inner_pretty.js:219287` | `for (let $ of BLn) s.push($)` | session hosts folded into network `allowedDomains` | net-new |
| Cleared on reset | `cli_inner_pretty.js:219748` | `BLn.clear()` | `ko.reset` | net-new |
| Dialog "allow" → remember | `cli_inner_pretty.js:688936` | `if (wp) ko.addSessionAllowedHost(ft.host)` | repl-bridge allow handler | net-new |
| Overlay "allow" → remember | `cli_inner_pretty.js:691049, 691091` | `else if (zt) ko.addSessionAllowedHost(Ur)` | network-permission overlay | net-new |
| Slash/programmatic allow | `cli_inner_pretty.js:702278` | `return (ko.addSessionAllowedHost(r), !0)` | — | net-new |

**Flow:** when the sandbox network permission dialog is answered "Yes" for a host, `addSessionAllowedHost(host)` adds it to the session `Set` `BLn` and calls `hJr()` to rebuild the sandbox config; `BLn` members are unioned into the network `allowedDomains` (`219287`), so subsequent connections to that host within the session are auto-allowed (no re-prompt). Reset clears it (`219748`).

**Key insight:** Previously every sandboxed connection to a not-yet-allowed host re-prompted; 193 adds a per-session "remember Yes" cache so the user is asked once per host per session. **Upgrade gotcha:** purely additive (fewer prompts) — but it means a host approved once is trusted for the whole session.

---

## Bullet 8 — /permissions "Recently denied": approving a denial persists on close

**Status: NET-NEW behavior (2.1.191) — refinement of the existing overlay. Confidence: HIGH.**

### Anchor table

| Item | 193 anchor | Obf symbol | Readable | 183-diff |
|------|-----------|-----------|----------|----------|
| Permissions overlay | `cli_inner_pretty.js:547098` | `H4l` | `PermissionsOverlay` (`{getDenials, removeDenial}=oSt()`) | carryover shell |
| Recent-denied tab body | `cli_inner_pretty.js:546479` | `f4l` | `RecentDeniedTab` (toggles `approved`/`retry` sets) | carryover |
| **Close handler** | `cli_inner_pretty.js:547334-547370` | `wt` (bound via `Or("confirm:no", tt, …)`) | `onPermissionsOverlayClose` | **body-change** |
| "Permission granted for:" | `cli_inner_pretty.js:547345, 547362` | — | retry-branch (carryover) + approved-branch (NEW) | `grep -c` 183=**1**, 193=**2** → +1 net-new |
| onRetryDenials | (2 hits) | `onRetryDenials`/`o(...)` | retry path | carryover |

### Close-handler diff (precise)
**183** (`(183) 536353-536366`, approved branch): just emits an "Approved X" message — **no `removeDenial`, no permission-granted meta-message**:
```javascript
let Bt = ut(pt.approved);
if (Bt.length > 0 || u.length > 0) {
  let An = Bt.length > 0 ? [`Approved ${Bt.map(nif).join(", ")}`] : [];
  n([...An, ...u].join("\n"));                       // 183: approval is cosmetic, not persisted
} else n("Permissions dialog dismissed", { display: "system" });
```
**193** (`547353-547367`): on close, each approved denial is **removed from the store** and the model is told permission was granted:
```javascript
let Xn = Dt(Ke.approved);
if (Xn.length > 0 || d.length > 0) {
  for (let Sn of Xn) i(Sn);                          // NET-NEW: i = removeDenial → approval persists
  let dt = Xn.map(aDf), nn = dt.length > 0 ? [`Approved ${dt.map(iDf).join(", ")}`] : [];
  n([...nn, ...d].join("\n"),
    dt.length > 0
      ? { metaMessages: [`Permission granted for: ${dt.join(", ")}. You may now retry ${dt.length===1?"this command":"these commands"} if you would like.`] }   // NET-NEW
      : void 0);
} else n("Permissions dialog dismissed", { display: "system" });
```

**Key insight:** In 183, approving a recently-denied command in the overlay was effectively a no-op once you closed (the denial stayed in the list, the model wasn't notified). 193 makes the approval **stick**: `removeDenial` clears it from the Recently-denied ring buffer and a meta-message grants the model permission to retry — exactly "approving a denial persists on close."

---

## False-delta / carryover ledger (be adversarial)

- **"Recently denied" tab** itself — carryover (183 `536573`). Only the per-row reason (bullet 2) and approve-persist (bullet 8) are new.
- **Denial record stores `reason`** — carryover (183 `627443`). Surfacing it is new.
- **`rre` "Using X instead" model warning** — carryover (183 `362631`). The entitlement gate is new.
- **`p9e`/`wPe`/`Wil` Agent-type matcher + `allowedAgentTypes`** — carryover. Only the upfront named-spawn enforcement site is new.
- **`pendingWorkerRequest`/`permission_swarm_forward`/`M8n` worker-permission forwarding** — fully carryover (bullet 6).
- **`onRetryDenials` retry path** — carryover; the approved path is new (bullet 8).

---

## Depth assessment

**RICH.** Six of the eight bullets are genuine source-level deltas with isolable obf symbols and clean 183 diffs (often a single inserted clause or branch). Two carryover items are useful negative findings. This easily warrants a new module dir **`38_permissions/`**.

## Proposed module docs (`38_permissions/`)

1. `00_permissions_overview.md` — permission decision flow, auto-mode, the `ko` sandbox controller surface, and the four settings sources (`Uys`/`jT`).
2. `classify_all_shell.md` — `classifyAllShell` flag, `r9e`/`sTo`/`$Cr`, the `mqt`/`hqt` dangerous-prefix list `$rl`, the 4 suspension callers, and the auto-mode allow-layer pipeline.
3. `denial_reasons_surfacing.md` — denial store (`oSt`), `recordDenial` record shape, toast (`auto-mode-denied`), Recently-denied reason rendering, and the dark `toolDenialKind`/`XKa`/`USe` transcript plumbing.
4. `sandbox_credentials.md` — `sandbox.credentials` schema (`IEu`/`kwr`/`Rwr`), assembly (`219467`), enforcement (`Rqi`→`Yjd`), and the staged `mode:"mask"` injection path.
5. `org_model_restrictions.md` — `NFe`/`Uge`/`d7u` entitlement gate, `tzt` `/model` denial, `u_n`/`aw` fallback resolver, picker/`Ia` filtering, `denied_by_entitlement`.
6. `recent_denied_overlay.md` — `H4l`/`f4l`, the close handler `wt`, retry vs approve persistence, session-allowed-hosts (`BLn`/`_Wd`) for the network dialog.
7. (carryover reference) `background_subagent_permission_forwarding.md` — document `rdc`/`pendingWorkerRequest`/`M8n` as carryover (cross-link `36_background_agents/`).

## Symbol-index additions (route to `symbol_index_infra_platform.md` → Permissions/Sandbox; `symbol_index_core_features.md` → Auto-mode/CLI; `symbol_index_infra_platform.md` → Model)

- Permissions/Sandbox: `r9e`, `sTo`, `$Cr`, `mqt`, `hqt`, `oTo`, `Rqi`, `Yjd`, `_Wd`, `BLn`, `kwr`, `Rwr`, `IEu`, `Lwr`, `ko`, `p9e`, `wPe`, `Wil`, `XKa`, `USe`, `oSt`, `r4l`, `f4l`, `H4l`, `rdc`, `M8n`.
- Model: `NFe`, `Uge`, `d7u`, `tzt`, `u_n`, `aw`, `Ia`, `rre`.
