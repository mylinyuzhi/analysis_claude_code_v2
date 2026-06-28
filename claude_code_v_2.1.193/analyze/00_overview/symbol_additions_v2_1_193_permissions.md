# Symbol Additions — v2.1.193 — Permissions & Auto-mode (NEW MODULE)

> Consolidated obfuscated→readable symbol manifest for the **Permissions & Auto-mode** module
> (`38_permissions/`) as it exists in **v2.1.193** (build `a1938d2a`, bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`). Every row was
> **re-derived by reading the declaration in the v2.1.193 bundle** during the writing pass —
> obfuscated names are re-mangled every build, so a 183 token (e.g. `$Cr`=isSubagent in 183, but
> `$Cr`=isClassifyAllShellEnabled in **193**) does NOT carry across versions. Lines are 193 unless the
> Description column tags **(183)**.
>
> **Routing — these rows fold into two central index files:**
> - **`symbol_index_infra_platform.md`** — **Permissions / Sandbox / Model**: the home for the
>   shell-suspend predicate + gate (`r9e`/`sTo`/`$Cr`/`mqt`/`hqt`/`oTo`/`Orl`), `sandbox.credentials`
>   (`kwr`/`Rwr`/`IEu`/`Lwr`/`Rqi`/`Yjd`/`FRn`), the `ko` sandbox controller + session-host cache
>   (`_Wd`/`BLn`/`hJr`/`kWd`), the denial store (`r4l`/`oSt`/`f4l`/`H4l`), and the org model-entitlement
>   gate (`d7u`/`NFe`/`Uge`/`u7u`/`tzt`/`u_n`/`aw`/`Ia`/`rre`).
> - **`symbol_index_core_features.md`** — **Auto-mode**: `classifyAllShell` schema, `dQl`/`NEe`,
>   `XKa`/`USe`/`toolDenialKind`, `dQa`/`pQa`; and **Background Agents** for the carryover worker
>   forwarding (`rdc`/`M8n`). The Agent named-spawn enforcement (`p9e`/`wPe`/`Wil`/`is`) routes to
>   **`symbol_index_core_execution.md`** (Subagent/Agent spawn).

## Module: Permissions — classifyAllShell (Auto-mode shell trust)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `classifyAllShell` | autoMode.classifier.classifyAllShell (zod field) | cli_inner_pretty.js:55814 | object |
| `$Cr` | isClassifyAllShellEnabled (OR across sources; `$Cr`=isSubagent in 183) | cli_inner_pretty.js:58758 | function |
| `Uys` | SETTINGS_SOURCES `["userSettings","localSettings","flagSettings","policySettings"]` | cli_inner_pretty.js:58827 | constant |
| `_n` | readSettings | cli_inner_pretty.js:58758 (use site) | function |
| `sTo` | shouldSuspendAllShellAllowRules (wrapper → `$Cr`) | cli_inner_pretty.js:416260 | function |
| `r9e` | isShellAllowRuleSuspended (bypass line `:416264`; 183 `WGe` `:409907`) | cli_inner_pretty.js:416263 | function |
| `mqt` | isDangerousBashAllowRule (dangerous-prefix; carryover) | cli_inner_pretty.js:416162 | function |
| `hqt` | isDangerousPowerShellAllowRule (carryover) | cli_inner_pretty.js:416208 | function |
| `oTo` | resolvesToAgentTool (carryover) | cli_inner_pretty.js:416257 | function |
| `$rl` | dangerousInterpreterPrefixList (carryover) | cli_inner_pretty.js:416116-416161 | constant |
| `Orl` | shellRuleSuspendCache (per-rule memo; carryover) | cli_inner_pretty.js:416271 | variable |
| `Io` | BASH tool name `"Bash"` (carryover) | cli_inner_pretty.js:146006 | constant |
| `Ss` | POWERSHELL tool name `"PowerShell"` (carryover) | cli_inner_pretty.js:229433 | constant |
| `dQl` | isAutoMode (`"auto"` or active plan-auto) | cli_inner_pretty.js:597459 | function |
| `NEe` | buildAutoModeAllowLayers (skips suspended allow rules) | cli_inner_pretty.js:597462 | function |
| `yjo` | suspended-allow-rule display collector | cli_inner_pretty.js:598268 | function |

## Module: Permissions — denial-reason surfacing (Auto-mode)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `r4l` | RecentDenialsProvider (ring buffer `VLf=20`; carryover) | cli_inner_pretty.js:546166 | function |
| `oSt` | useRecentDenials (getDenials/recordDenial/removeDenial; carryover) | cli_inner_pretty.js:546192 | function |
| `VLf` | RECENT_DENIALS_RING_SIZE (=20; carryover) | cli_inner_pretty.js:546199 | constant |
| `recordDenial` call | denial record w/ `reason` (carryover shape; 183 `:627443`) | cli_inner_pretty.js:640262 | object |
| auto-mode-denied toast | toast w/ truncated reason line (NET-NEW; 183 `null` child `:627452`) | cli_inner_pretty.js:640271 | object |
| `f4l` reason spread | Recently-denied per-row reason `description`/`dimDescription` (NET-NEW; 183 `...{}` `:535601`) | cli_inner_pretty.js:546589 | object |
| `XKa` | classifyToolDenialKind (5-way denial taxonomy; NET-NEW) | cli_inner_pretty.js:382614 | function |
| `USe` | isToolDenialKindEnabled (`return !1`; dark-launch gate) | cli_inner_pretty.js:382624 | function |
| `toolDenialKind` | per-message denial-kind field (NET-NEW, inert; 7 sites) | cli_inner_pretty.js:445167,462587,599612,599637,382990 | object |
| `aSo` | AUTOMODE_PARSE_FAIL_PREFIX | cli_inner_pretty.js:382627 | constant |
| `qGp` | classifier-input renderer (consumes `toolDenialKind`) | cli_inner_pretty.js:383163 | function |
| `dQa` | setAutoModeApprovalReason (approvals map; carryover, 183 `PNa`) | cli_inner_pretty.js:395284 | function |
| `pQa` | getAutoModeApprovalReason (carryover) | cli_inner_pretty.js:395293 | function |

## Module: Sandbox — sandbox.credentials

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `kwr` | credentialFileEntry schema `{path, mode:"deny"}` | cli_inner_pretty.js:54048 | function |
| `Rwr` | secretEnvEntry schema `{name:/^[A-Za-z_]\w*$/, mode:"deny"}` | cli_inner_pretty.js:54059 | function |
| `IEu` | sandboxCredentials schema `{files?, envVars?}` | cli_inner_pretty.js:54069 | function |
| `Lwr` | sandboxRootSchema (wires `credentials: IEu()` `:54096`) | cli_inner_pretty.js:54079 | function |
| credentials assembly | per-source path-resolved merge over `jT` | cli_inner_pretty.js:219470 | object |
| `jT` | SETTINGS_SOURCES (merge iteration) | cli_inner_pretty.js:219471 (use) | constant |
| `p3e` | resolvePath (per-source settings path resolution) | cli_inner_pretty.js:219474 (use) | function |
| `Rqi` | resolveCredentialProtection `{denyReadPaths, unsetEnvVars, setEnvVars}` | cli_inner_pretty.js:211660 | function |
| `Yjd` | buildSandboxFsDenyRead (folds `denyReadPaths` into `filesystem.denyRead`) | cli_inner_pretty.js:211677 | function |
| `FRn` | secretInjectionRegistry (staged `mode:"mask"` sentinel registry) | cli_inner_pretty.js:212031 (inst), 209633 (register) | variable |
| `Ya` | sandboxConfig (resolved sandbox config object) | cli_inner_pretty.js:211677 (use) | variable |
| `allowPlaintextInject` | credentials.allowPlaintextInject gate (staged mask) | cli_inner_pretty.js:211560 | object |

## Module: Sandbox — ko controller + session-allowed-hosts

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ko` | sandboxController (singleton API surface) | cli_inner_pretty.js:219848 | object |
| `_Wd` | addSessionAllowedHost (`BLn.add` + `hJr()`) | cli_inner_pretty.js:219238 | function |
| `BLn` | sessionAllowedHosts (per-session Set; merged `:219287`, cleared `:219748`) | cli_inner_pretty.js:219833 | variable |
| `hJr` | refreshSandboxConfig (controller `refreshConfig`) | cli_inner_pretty.js:219862 (exposed) | function |
| `kWd` | sandboxControllerReset (controller `reset` `:219864`; clears `BLn` `:219748`) | cli_inner_pretty.js:219864 | function |
| `Wb` | WEBFETCH tool name `"WebFetch"` (domain-rule check in merge) | cli_inner_pretty.js:218789 | constant |

## Module: Permissions — Recently-denied overlay (approve-persists)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `H4l` | PermissionsOverlay (`{getDenials, removeDenial}=oSt()`) | cli_inner_pretty.js:547100 | function |
| `f4l` | RecentDeniedTab (toggles approved/retry sets) | cli_inner_pretty.js:546479 | function |
| `wt` | onPermissionsOverlayClose (close handler; approved branch NET-NEW) | cli_inner_pretty.js:547334 | function |

## Module: Model — org entitlement restrictions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `d7u` | buildRestrictedModelSet (`if(!entitled) add`) | cli_inner_pretty.js:102809 | function |
| `u7u` | normalizeModelName | cli_inner_pretty.js:102806 | function |
| `NFe` | isModelRestrictedByEntitlements (alias-resolving; size-0 fast-path) | cli_inner_pretty.js:102814 | function |
| `Uge` | getOrgRestrictedModelSet (empty unless firstParty/gateway) | cli_inner_pretty.js:102820 | function |
| `Ia` | isModelAvailable (picker filter; NET-NEW `NFe` clause `:102880`) | cli_inner_pretty.js:102873 | function |
| `tzt` | switchModel (`/model` denial + `denied_by_entitlement`) | cli_inner_pretty.js:487243 | function |
| `u_n` | resolveRestrictedModelFallback (opus→sonnet→haiku downgrade) | cli_inner_pretty.js:103211 | function |
| `aw` | getEffectiveModel (`u_n(r) ?? r`; covers `ANTHROPIC_MODEL`/env) | cli_inner_pretty.js:103207 | function |
| `rre` | formatModelRestrictedWarning ("Using X instead"; **CARRYOVER**, 183 `:362631`) | cli_inner_pretty.js:374023 | function |
| `Qft` | sanitizeModelNameForDisplay (used by `rre`) | cli_inner_pretty.js:374018 | function |

## Module: Subagent/Agent spawn — named-spawn enforcement + worker forwarding

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `is` | AGENT_TOOL name `"Agent"` (carryover) | cli_inner_pretty.js:150806 | constant |
| `p9e` | findDenyRuleForTool (carryover matcher) | cli_inner_pretty.js:597589 | function |
| `wPe` | filterAgentsByDenyRules (carryover; "Available agents" list) | cli_inner_pretty.js:597592 | function |
| `Wil` | resolveForkAgentAvailability (carryover; 183 `gqa`) | cli_inner_pretty.js:430268 | function |
| `allowedAgentTypes` | Agent(x,y) allow-list (carryover; 19 hits both) | cli_inner_pretty.js:430268 (use) | object |
| named-spawn block | upfront `Agent(type)` deny + allowlist check (**REFINEMENT**; 183 `:423565` absent) | cli_inner_pretty.js:430515 | object |
| `E9e` | SubagentSpawnError | cli_inner_pretty.js:430518 (use) | class |
| `rdc` | forwardWorkerPermissionRequest (**CARRYOVER**; sets `pendingWorkerRequest`) | cli_inner_pretty.js:640151 | function |
| `M8n` | buildWorkerPermissionRequest (**CARRYOVER**; `workerName`/`workerColor`) | cli_inner_pretty.js:426557 | function |
| `pendingWorkerRequest` | worker-permission state field (**CARRYOVER**; 7 hits both) | cli_inner_pretty.js:303749,390172,687702 | object |
| `permission_swarm_forward` | worker-forward telemetry (**CARRYOVER**; 2 hits both) | cli_inner_pretty.js:640198,640200 | constant |

---

## Net-new vs carryover summary (grep evidence)

| Symbol family | Verdict | grep 183 → 193 |
|---------------|---------|----------------|
| `classifyAllShell` (schema + `$Cr`) | NET-NEW | `classifyAllShell` 0 → 2 |
| `r9e` bypass line | NET-NEW (1 prepended line; body carryover) | `WGe` had no `sTo()` clause |
| `toolDenialKind` taxonomy | NET-NEW but DARK (`USe`=`!1`) | `toolDenialKind` 0 → 7 |
| toast/recent-denied reason | NET-NEW render | `k.length > 80` 1 → 2 (toast new) |
| `sandbox.credentials` (`kwr`/`Rwr`/`IEu`/`Rqi`/`Yjd`) | NET-NEW | `denyReadPaths` 0 → 4; `unsetEnvVars` 0 → 6 |
| org model gate (`NFe`/`Uge`/`tzt`/`u_n`) | NET-NEW | `denied_by_entitlement` 0 → 1; "Run /model to choose…" 0 → 1 |
| `rre` "Using X instead" | **CARRYOVER** | "restricted by your organization's settings" 1 → 2 (the +1 is `tzt`) |
| `_Wd`/`BLn` session hosts | NET-NEW | `addSessionAllowedHost` 0 → 5 |
| approve-persists close handler | NET-NEW (approved branch) | "Permission granted for" 1 → 2 |
| Agent named-spawn upfront deny | REFINEMENT | "has been denied by permission rule" 2 → 3; `subagent_type_denied` 2 → 3 |
| `rdc`/`M8n`/`pendingWorkerRequest` | **CARRYOVER** | `pendingWorkerRequest` 7 = 7; `permission_swarm_forward` 2 = 2; `workerColor` 7 = 7 |
