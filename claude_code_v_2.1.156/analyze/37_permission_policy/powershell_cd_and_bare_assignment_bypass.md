# Command-Parser Bypass Fixes — PowerShell Built-in `cd` (2.1.149) and Bare Var-Assignment (2.1.145)

## Related Symbols

> Symbol mappings:
> - [`symbol_index_core_execution.md`](../00_overview/symbol_index_core_execution.md) — Core execution
> - [`symbol_index_core_features.md`](../00_overview/symbol_index_core_features.md) — Core features
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Platform infra (permissions, sandbox)
> - [`symbol_index_infra_integration.md`](../00_overview/symbol_index_infra_integration.md) — Integrations

Key functions/symbols in this document:

PowerShell built-in `cd` (2.1.149):
- `isCwdChangingCmdlet` (`_v$`) — predicate: does a PowerShell command name change the working directory / path-resolution namespace (cli_inner_pretty.js:417684-417695)
- `resolveToCanonical` (`EY`) — strips a trailing `.exe/.cmd/.bat/.com` and resolves PowerShell aliases to their canonical Verb-Noun cmdlet name (cli_inner_pretty.js:417677-417683)
- `powershellAliasMap` (`MqH`) — alias→canonical lookup table consulted by `EY` (cli_inner_pretty.js:417169)
- `exeSuffixRegex` (`iI_`) — `/\.(exe|cmd|bat|com)$/` stripped by `EY` (cli_inner_pretty.js:418179)
- `getPlatform` (`n$`) — platform getter returning `"windows"`/`"wsl"`/etc. (cli_inner_pretty.js:42334)
- `validateAcceptEditsMode` (anonymous body, the acceptEdits mode validator) — blocks cwd-change-plus-write compounds with the stale-cwd message (cli_inner_pretty.js:418238-418254)
- `isReadOnlyCompound` (`uG8`) — read-only compound gate that bails on multi-command compounds containing a cwd-changer (cli_inner_pretty.js:417731-417768 ; cwd guard at 417748-417750)
- `validateCompoundPaths` (`MC_`) — per-statement path validator that asks-on-compound-cwd-change (cli_inner_pretty.js:418618-418631)
- `powershellPermissionCheck` (anonymous compound check) — the bare-repo-attack guard for `cd`+`git` compounds (cli_inner_pretty.js:420270-420283)
- `isLinkCreatingCmdlet` (`yd6`) — New-Item symbolic/junction/hard-link detector, paired with `_v$` in the guards (cli_inner_pretty.js:418246, 420271)
- `recomputeShellVarsOnCd` (inside `tT5` `analyzeCommandEffects` walker) — recomputes `PWD`/`OLDPWD`/`DIRSTACK` on `cd`/`chdir`/`pushd`/`popd` (cli_inner_pretty.js:208562-208579)

Bare variable assignment (2.1.145):
- `parseCommand` (`dP6`) — async tree-sitter parse that returns `{ rootNode, envVars, commandNode, originalCommand }` (cli_inner_pretty.js:190366-190377)
- `findCommandNode` (`UcH`) — descends through a `variable_assignment` node to the following real command (cli_inner_pretty.js:190389-190407)
- `collectLeadingAssignments` (`KW5`) — collects leading `variable_assignment` text on a `command` node into `envVars`, stopping at the first `command_name`/`word` (cli_inner_pretty.js:190408-190414)
- `extractCommandArguments` (`wD$`) — extracts the effective `[cmd, ...args]` from a command/declaration node (cli_inner_pretty.js:190416-190437)
- `COMMAND_NODE_TYPES` (`gP6`) — `Set(["command","declaration_command"])` used by `UcH` (cli_inner_pretty.js:190460)
- `parseCommandWrapper` (`zJ`) — convenience wrapper: parse → `findCommandNode` → `extractCommandArguments` (cli_inner_pretty.js:190512-190518)
- `getCommandPrefixStatic` (`kI8`) — builds the auto-approve prefix; returns `{ commandPrefix: null }` for an assignment-only command (cli_inner_pretty.js:595513-595528)
- `assignmentOps` (`sP5`) — set of assignment operators `=` `+=` … (cli_inner_pretty.js:190356)
- `classifySimpleReadOnly` (`nz8`) — read-only classifier that now routes a non-allowlisted bare assignment to `passthrough` (cli_inner_pretty.js:242978-242990)
- `parseSimpleCommandTree` (`nD$`/`nT5`/`C$H`/`eT5`) — produces `{ kind:"simple", commands, bareAssignmentNames }` (cli_inner_pretty.js:207762-207809)
- `analyzeCommandEffects` (`tT5`) — per-command effect walker that POPULATES `bareAssignmentNames`: the `if (O === void 0) for (let M of $) A(M.name)` bare-assignment branch at cli_inner_pretty.js:208439, surfaced via `K.push(...z)` at 208590; also hosts the `PWD`/`OLDPWD`/`DIRSTACK` recompute (cli_inner_pretty.js:208413-208591)
- `hasNonAllowlistedAssignment` (`LF_`) — leading-assignment env-var detector used by the read-only auto-allow gate (cli_inner_pretty.js:440619-440632)
- `isAllowlistedEnvVar` (`V5H`) — membership test against the safe env-var set `_k$` (cli_inner_pretty.js:440527-440529)
- `safeEnvVarSet` (`_k$`) — the allowlist of env vars that may be set bare without prompting (cli_inner_pretty.js:441481-...)
- `dynamicEnvAllowlist` (`iD$`) — session-aware allowlist union (cli_inner_pretty.js:209864-209871)
- `readOnlyAutoAllowGate` (`vF_`-region body) — the `isReadOnly && !LF_ && !bareAssignment` gate that grants "Read-only command is allowed" (cli_inner_pretty.js:441400-441406)

Precursors in the v2.1.142 bundle (cross-validation, separate build):
- `isCwdChangingCmdlet` (`JP$`, 2.1.142) — pre-fix PowerShell cd detector, **no** bareword/drive-switch line (2.1.142 cli_inner_pretty.js:402359-402368)
- `classifySimpleReadOnly` (`A78`, 2.1.142) — pre-fix read-only classifier, returns `{kind:"simple",commands}` with **no** `bareAssignmentNames` and **no** bare-assignment guard (2.1.142 cli_inner_pretty.js:275936-275945)
- `hasNonAllowlistedAssignment` (`jA5`, 2.1.142) — already present and byte-identical to `LF_` (2.1.142 cli_inner_pretty.js:420366-420379)
- `readOnlyAutoAllowGate` (2.1.142) — the pre-fix gate `isReadOnly && !jA5(...)`, **missing** the third bare-assignment clause (2.1.142 cli_inner_pretty.js:421120)

Precursors in the v2.1.88 readable source (cross-validation):
- `isCwdChangingCmdlet` — readable PowerShell detector, alias-resolution only (`src/tools/PowerShellTool/readOnlyValidation.ts:1017-1033`)
- `findCommandNode` / `parseCommand` / `extractCommandArguments` (`src/utils/bash/parser.ts:56-205`); `getCommandPrefixStatic` (`src/utils/bash/prefix.ts:28-70`)

---

## TL;DR

This document covers two **parser-level** auto-approve bypass closures in module 37. Neither adds a new policy primitive; both fix a place where the *static command analyzer* lost track of an effect the *real shell* would have, so a command that should have been prompted was silently allowed.

1. **PowerShell built-in `cd` (2.1.149).** The directory-change detector `isCwdChangingCmdlet` (`_v$`, cli_inner_pretty.js:417684) now recognizes the **bareword** forms `cd..`, `cd\`, `cd/`, `cd~` and **drive-switch** `X:` (regex `/^[a-z]:$/`) as directory-changing — in addition to the canonical cmdlets `Set-Location` / `Push-Location` / `Pop-Location` / `New-PSDrive` (plus `ndr` / `mount` on Windows). These bareword forms are parsed by PowerShell as commands whose *name itself* is the cd action (`cd..` is a single token, not `cd` + `..`), so the pre-fix detector — which only alias-resolved the name and matched canonical cmdlets — never saw them as cwd-changers. A compound like `cd.. ; Set-Content ./settings.json '...'` therefore changed the working directory **undetected**, and the validators that re-resolve relative paths against the *original* cwd auto-allowed a write to the wrong directory. Confidence: **high** — the bareword/drive-switch form list is explicit at cli_inner_pretty.js:417686 and the 2.1.142 precursor (`JP$`) provably lacks it.

2. **Bare variable assignment (2.1.145).** A Bash command that is **assignment-only** — `FOO=bar` with no command name — resolves to a `null` effective command node, because `findCommandNode` (`UcH`, cli_inner_pretty.js:190389) descends *through* a `variable_assignment` looking for the following real command and finds none. `getCommandPrefixStatic` (`kI8`, cli_inner_pretty.js:595517) then returns `{ commandPrefix: null }` — there is no command to build a prefix from. Pre-fix, the read-only classifier treated such a command as a trivially-safe "simple" command (an empty command list) and auto-allowed it, even though `FOO=bar` *sets a non-allowlisted environment variable that alters the behavior of every subsequent command in the session*. The fix threads a new `bareAssignmentNames` list out of the parser (cli_inner_pretty.js:207809), populated by the per-command effect walker `analyzeCommandEffects` (`tT5`) at its bare-assignment branch (cli_inner_pretty.js:208439, surfaced at 208590), and routes a non-allowlisted bare assignment to `passthrough` → prompt in both `nz8` (cli_inner_pretty.js:242986) and the read-only auto-allow gate (cli_inner_pretty.js:441401). Confidence: **medium** — the resolver (`UcH`/`kI8`), the producer (`tT5`'s 208439/208590), and both enforcement points are all verified; the residual **medium** applies only to the reconstruction of the pre-fix bypass *route* (since `LF_`/`jA5`'s regex was already present pre-fix), detailed honestly below.

Upstream changelog:
- 2.1.149: "Fixed a PowerShell permission bypass where built-in `cd` functions changed the working directory undetected." (+ the `PWD`/`OLDPWD`/`DIRSTACK` stale-tracking fix.)
- 2.1.145: "Fixed a permission-prompt bypass where bare variable assignments to non-allowlisted environment variables in Bash were auto-approved."

---

# Part 1 — PowerShell Built-in `cd` Bypass (2.1.149)

## 1.1 The threat model: stale-cwd path validation

The PowerShell permission engine statically validates a *compound* command (`A ; B ; C`, pipelines, etc.) **before** executing it, by resolving every relative/drive-prefixed path argument against the analyzer's current working directory. This is only sound if **no earlier statement in the compound changed the cwd**. The instant one statement does a `cd`, every relative path in a later statement resolves against a directory the analyzer cannot see — the classic stale-cwd TOCTOU bypass:

```
Set-Location ~ ; Get-Content ./.ssh/id_rsa
        │                       │
        │                       └─ analyzer resolves "./.ssh/id_rsa" against the ORIGINAL cwd
        │                          (looks benign — no such file in project dir)
        └─ but the shell already chdir'd to $HOME, so the read hits ~/.ssh/id_rsa
```

The engine's defense is **conservative**: if a compound contains *any* directory-changing command alongside a write (or a link-creation, or a `git`), it refuses to auto-allow and forces a prompt. The correctness of that defense rests entirely on `isCwdChangingCmdlet` (`_v$`) being a **complete** enumeration of every way a PowerShell statement can change the cwd. The 2.1.149 fix closes a gap in that enumeration.

## 1.2 The detector and the fix

### isCwdChangingCmdlet — bareword and drive-switch forms

**What it does:** Given a raw command name, answer "does this statement change the working directory or the path-resolution namespace?"

**How it works:**
1. Lowercase the raw name.
2. **NEW (the fix):** If the lowercased name is exactly `cd..`, `cd\`, `cd/`, `cd~`, or matches `/^[a-z]:$/` (a bare drive letter + colon, e.g. `c:`), return `true` **before** alias resolution.
3. Otherwise, alias-resolve the name via `resolveToCanonical` (`EY`) and match against the canonical cmdlets `set-location`, `push-location`, `pop-location`, `new-psdrive`, and (Windows only) `ndr` / `mount`.

```javascript
// ============================================
// isCwdChangingCmdlet - Detect PowerShell cwd-changing commands (incl. bareword cd + drive switch)
// Location: cli_inner_pretty.js:417684-417695
// ============================================

// ORIGINAL (for source lookup):
function _v$(H) {
  let $ = H.toLowerCase();
  if ($ === "cd.." || $ === "cd\\" || $ === "cd/" || $ === "cd~" || /^[a-z]:$/.test($)) return !0;
  let q = EY(H);
  return (
    q === "set-location" ||
    q === "push-location" ||
    q === "pop-location" ||
    q === "new-psdrive" ||
    (n$() === "windows" && (q === "ndr" || q === "mount"))
  );
}

// READABLE (for understanding):
function isCwdChangingCmdlet(rawName) {
  let lower = rawName.toLowerCase();
  // NEW in 2.1.149: PowerShell parses these as a SINGLE command token whose
  // name is itself the cd action. Alias resolution never maps them to
  // set-location, so they must be matched literally, before resolveToCanonical.
  if (lower === "cd.." || lower === "cd\\" || lower === "cd/" || lower === "cd~" || /^[a-z]:$/.test(lower)) {
    return true;
  }
  let canonical = resolveToCanonical(rawName);
  return (
    canonical === "set-location" ||
    canonical === "push-location" ||
    canonical === "pop-location" ||
    canonical === "new-psdrive" ||                 // creates a drive mapping → redirects X:/... paths
    (getPlatform() === "windows" && (canonical === "ndr" || canonical === "mount"))
  );
}

// Mapping: _v$→isCwdChangingCmdlet, EY→resolveToCanonical, n$→getPlatform, H→rawName, $→lower, q→canonical
```

### Why the bareword forms slip past alias resolution

`resolveToCanonical` (`EY`, cli_inner_pretty.js:417677) does two things: strip a trailing executable suffix (`.exe/.cmd/.bat/.com` via `iI_`) when the name has no path separator, then look the result up in the PowerShell alias map `powershellAliasMap` (`MqH`, cli_inner_pretty.js:417169):

```javascript
// ============================================
// resolveToCanonical - Normalize a PowerShell command name to its canonical cmdlet
// Location: cli_inner_pretty.js:417677-417683
// ============================================

// ORIGINAL (for source lookup):
function EY(H) {
  let $ = H.toLowerCase();
  if (!$.includes("\\") && !$.includes("/")) $ = $.replace(iI_, "");
  let q = MqH[$];
  if (q) return q.toLowerCase();
  return $;
}

// READABLE (for understanding):
function resolveToCanonical(rawName) {
  let lower = rawName.toLowerCase();
  if (!lower.includes("\\") && !lower.includes("/")) lower = lower.replace(exeSuffixRegex, "");
  let canonical = powershellAliasMap[lower];     // e.g. "cd" → "Set-Location"
  if (canonical) return canonical.toLowerCase();
  return lower;                                   // unknown → returned verbatim
}

// Mapping: EY→resolveToCanonical, iI_→exeSuffixRegex, MqH→powershellAliasMap, H→rawName, $→lower, q→canonical
```

The alias map maps the *bare* alias `cd` → `Set-Location`. But `cd..` (no space), `cd\`, `cd/`, `cd~`, and a drive switch like `c:` are **not** the alias `cd` — to the PowerShell parser they are *distinct single command tokens*. PowerShell ships them as built-in functions/forms precisely so users can chdir without a space. None of them is a key in `MqH`, so `EY("cd..")` returns the literal `"cd.."`, which matches none of the canonical cmdlets. Pre-fix, the detector therefore returned `false` and the cwd-change went unflagged. The fix matches these literal tokens **before** calling `EY`, since alias resolution will never help.

### Cross-validation — 2.1.142 precursor lacked the line

The 2.1.142 detector `JP$` (the `_v$` precursor) is identical *except* it has no bareword/drive-switch guard at all:

```javascript
// ============================================
// isCwdChangingCmdlet (2.1.142 precursor) - alias-resolution only, NO bareword guard
// Location: 2.1.142 cli_inner_pretty.js:402359-402368
// ============================================

// ORIGINAL (for source lookup):
function JP$(H) {
  let $ = Vz(H);
  return (
    $ === "set-location" ||
    $ === "push-location" ||
    $ === "pop-location" ||
    $ === "new-psdrive" ||
    (c$() === "windows" && ($ === "ndr" || $ === "mount"))
  );
}

// READABLE (for understanding):
function isCwdChangingCmdlet_2_1_142(rawName) {
  let canonical = resolveToCanonical(rawName);   // Vz === the 2.1.142 EY
  return (
    canonical === "set-location" || canonical === "push-location" ||
    canonical === "pop-location" || canonical === "new-psdrive" ||
    (getPlatform() === "windows" && (canonical === "ndr" || canonical === "mount"))
  );
}

// Mapping: JP$→isCwdChangingCmdlet, Vz→resolveToCanonical(=EY in 2.1.156), c$→getPlatform(=n$)
```

The 2.1.88 readable source `isCwdChangingCmdlet` (`src/tools/PowerShellTool/readOnlyValidation.ts:1017-1033`) is the same shape — `resolveToCanonical(name)` then canonical-cmdlet match, with explicit `ndr`/`mount` Windows handling — and likewise has no bareword line. So the bareword/drive-switch closure is a **new 2.1.149 delta** with a clear precursor that the fix amends. Confidence: **high**.

## 1.3 The callers that depend on the detector

`isCwdChangingCmdlet` (`_v$`) is the shared leaf; five distinct guard sites consult it. All of them only become *correct* once `_v$` recognizes the bareword forms — the fix is at the leaf, but the value is realized at these sites:

### Site A — read-only compound gate (`uG8`)

In the read-only compound check, a compound with **more than one** command is rejected outright if *any* command in it is a cwd-changer (cli_inner_pretty.js:417748-417750):

```javascript
// ============================================
// isReadOnlyCompound - reject multi-command compounds containing a cwd-changer
// Location: cli_inner_pretty.js:417747-417750
// ============================================

// ORIGINAL (for source lookup):
if (_.reduce((A, Y) => A + Y.commands.length, 0) > 1) {
  if (_.some((Y) => Y.commands.some((f) => _v$(f.name)))) return !1;
}

// READABLE (for understanding):
let totalCommandCount = statements.reduce((sum, s) => sum + s.commands.length, 0);
if (totalCommandCount > 1) {
  // A multi-command compound that contains a cwd-changer is NOT provably read-only,
  // because later statements' relative paths can't be validated against the stale cwd.
  if (statements.some((s) => s.commands.some((c) => isCwdChangingCmdlet(c.name)))) return false;
}

// Mapping: _v$→isCwdChangingCmdlet, _→statements, Y→s, f→c
```

### Site B — acceptEdits mode validator (stale-cwd cannot auto-allow)

In `acceptEdits` mode the validator scans the compound and sets three flags: `A` = contains a cwd-changer (`_v$`), `Y` = contains a link-creator (`yd6`), `f` = contains a write (`Ed6`). A cwd-change **plus** a write returns `passthrough` with the explicit stale-cwd message (cli_inner_pretty.js:418238-418254):

```javascript
// ============================================
// validateAcceptEditsMode - block cwd-change + write compounds (stale-cwd cannot auto-allow)
// Location: cli_inner_pretty.js:418238-418254
// ============================================

// ORIGINAL (for source lookup):
if (_.reduce((A, Y) => A + Y.commands.length, 0) > 1) {
  let A = !1, Y = !1, f = !1;
  for (let O of _)
    for (let M of O.commands) {
      if (M.elementType !== "CommandAst") continue;
      if (_v$(M.name)) A = !0;
      if (yd6(M)) Y = !0;
      if (Ed6(M.name)) f = !0;
    }
  if (A && f)
    return {
      behavior: "passthrough",
      message: "Compound command contains a directory-changing command (Set-Location/Push-Location/Pop-Location) with a write operation — cannot auto-allow because path validation uses stale cwd",
    };
  ...
}

// READABLE (for understanding):
if (totalCommandCount > 1) {
  let hasCwdChange = false, hasLinkCreate = false, hasWrite = false;
  for (let statement of statements)
    for (let cmd of statement.commands) {
      if (cmd.elementType !== "CommandAst") continue;
      if (isCwdChangingCmdlet(cmd.name)) hasCwdChange = true;   // now true for `cd..`, `c:`, ...
      if (isLinkCreatingCmdlet(cmd)) hasLinkCreate = true;
      if (isWriteCmdlet(cmd.name)) hasWrite = true;
    }
  if (hasCwdChange && hasWrite)
    return { behavior: "passthrough", message: "...cannot auto-allow because path validation uses stale cwd" };
  ...
}

// Mapping: _v$→isCwdChangingCmdlet, yd6→isLinkCreatingCmdlet, Ed6→isWriteCmdlet, A→hasCwdChange, Y→hasLinkCreate, f→hasWrite
```

`passthrough` here means "this mode-validator has no opinion → fall through to the normal permission flow → prompt." Before the fix, `cd.. ; Set-Content x` set `hasCwdChange = false`, so this clause never fired and acceptEdits silently allowed the write against the stale cwd.

### Site C — compound path validator asks on cwd change (`MC_`)

`validateCompoundPaths` (`MC_`, cli_inner_pretty.js:418618) is invoked with a boolean `q` ("compound contains a cwd-changer"); when set it pre-seeds an `ask` verdict so any path operation in the compound is manually approved (cli_inner_pretty.js:418621-418631). The `q` argument is computed upstream from `_v$`, so it too now reflects the bareword forms:

```javascript
// ============================================
// validateCompoundPaths - ask when a compound changes cwd (relative paths unvalidatable)
// Location: cli_inner_pretty.js:418621-418631
// ============================================

// ORIGINAL (for source lookup):
if (q)
  _ = {
    behavior: "ask",
    message: "Compound command changes working directory (Set-Location/Push-Location/Pop-Location/New-PSDrive) — relative paths cannot be validated against the original cwd and require manual approval",
    decisionReason: { type: "other", reason: "Compound command contains cd with path operation — manual approval required to prevent path resolution bypass" },
  };

// READABLE (for understanding):
if (compoundChangesCwd) {
  pendingAskVerdict = {
    behavior: "ask",
    message: "Compound command changes working directory ... require manual approval",
    decisionReason: { type: "other", reason: "...prevent path resolution bypass" },
  };
}

// Mapping: q→compoundChangesCwd, _→pendingAskVerdict
```

### Site D — bare-repository-attack guard (`cd` + `git`)

The PowerShell prefix-permission check flags a compound that contains both a cwd-changer **and** a `git` invocation, because a `cd` into an attacker-controlled directory followed by `git` can make git execute hooks / read config from a *bare* repository the user did not intend (cli_inner_pretty.js:420270-420283):

```javascript
// ============================================
// powershellPermissionCheck - ask on cd+git compounds (bare-repository attack guard)
// Location: cli_inner_pretty.js:420270-420283
// ============================================

// ORIGINAL (for source lookup):
let X = O.length > 1 && O.some(({ element: U }) => _v$(U.name)),
  L = O.length > 1 && O.some(({ element: U }) => yd6(U)),
  P = O.some(({ element: U }) => EY(U.name) === "git");
if (X && P)
  M.push({
    behavior: "ask",
    message: "Compound commands with cd/Set-Location and git require approval to prevent bare repository attacks",
  });
if (P && v_$())
  M.push({
    behavior: "ask",
    message: "Git command in a directory with bare-repository indicators (HEAD, objects/, refs/ in cwd without .git/HEAD). Git may execute hooks from cwd.",
  });

// READABLE (for understanding):
let compoundHasCwdChange = elements.length > 1 && elements.some(({ element }) => isCwdChangingCmdlet(element.name));
let compoundHasLinkCreate = elements.length > 1 && elements.some(({ element }) => isLinkCreatingCmdlet(element));
let hasGit = elements.some(({ element }) => resolveToCanonical(element.name) === "git");
if (compoundHasCwdChange && hasGit)
  verdicts.push({ behavior: "ask", message: "Compound commands with cd/Set-Location and git require approval to prevent bare repository attacks" });
if (hasGit && cwdHasBareRepoIndicators())
  verdicts.push({ behavior: "ask", message: "Git command in a directory with bare-repository indicators ... Git may execute hooks from cwd." });

// Mapping: _v$→isCwdChangingCmdlet, yd6→isLinkCreatingCmdlet, EY→resolveToCanonical, v_$→cwdHasBareRepoIndicators, O→elements, U→element, X→compoundHasCwdChange, P→hasGit
```

Each site is a different reuse of the same leaf predicate. Centralizing the cwd-change knowledge in one function (`_v$`) is exactly why the fix is a *one-line* addition that simultaneously hardens five callers — the alternative (patching each guard's own name check) would have left the same gap in four other places.

## 1.4 The companion fix — `PWD`/`OLDPWD`/`DIRSTACK` stale tracking (Bash side)

The PowerShell `_v$` fix has a Bash analogue shipped in the same 2.1.149 window: the **shell-variable effect tracker** now recomputes the directory variables when it sees a `cd`/`chdir`/`pushd`/`popd` builtin. This matters for Bash compounds where a later statement references `$PWD`/`$OLDPWD`/`${DIRSTACK[...]}` — the analyzer models the variable environment statically, and if it kept the *old* `PWD` after a `cd`, it would mis-resolve those expansions.

```javascript
// ============================================
// recomputeShellVarsOnCd - invalidate PWD/OLDPWD/DIRSTACK after a directory-changing builtin
// Location: cli_inner_pretty.js:208562-208579
// ============================================

// ORIGINAL (for source lookup):
} else if (!f && (O === "cd" || O === "chdir" || O === "pushd" || O === "popd")) {
  let M = !1;
  if (O === "pushd" || O === "popd")
    for (let j = 1; j < Y.length; j++) {
      let w = Y[j];
      if (w === "--") break;
      if (/^-[a-zA-Z]*n[a-zA-Z]*$/.test(w)) { M = !0; break; }
      if (O === "popd" && (/^\+0*[1-9]/.test(w) || /^-0+$/.test(w))) { M = !0; break; }
    }
  if (!M) (q.set("PWD", iO), q.set("OLDPWD", iO));
  if (O === "pushd" || O === "popd") (q.set("DIRSTACK", iO), q.set("dirstack", iO));
}

// READABLE (for understanding):
} else if (!isFunctionDef && (cmdName === "cd" || cmdName === "chdir" || cmdName === "pushd" || cmdName === "popd")) {
  let isNoChdirVariant = false;
  if (cmdName === "pushd" || cmdName === "popd")
    for (let i = 1; i < argv.length; i++) {
      let arg = argv[i];
      if (arg === "--") break;
      // `pushd -n` / `popd -n` push/pop the stack WITHOUT changing the cwd
      if (/^-[a-zA-Z]*n[a-zA-Z]*$/.test(arg)) { isNoChdirVariant = true; break; }
      // `popd +0` / `popd -0` rotate the stack to the current dir → no cwd change
      if (cmdName === "popd" && (/^\+0*[1-9]/.test(arg) || /^-0+$/.test(arg))) { isNoChdirVariant = true; break; }
    }
  // Mark PWD/OLDPWD as "value unknown" (UNKNOWN_VALUE sentinel) so later expansions can't be statically trusted.
  if (!isNoChdirVariant) { varEnv.set("PWD", UNKNOWN_VALUE); varEnv.set("OLDPWD", UNKNOWN_VALUE); }
  // pushd/popd also mutate the directory stack regardless of the -n cwd-change semantics.
  if (cmdName === "pushd" || cmdName === "popd") { varEnv.set("DIRSTACK", UNKNOWN_VALUE); varEnv.set("dirstack", UNKNOWN_VALUE); }
}

// Mapping: O→cmdName, f→isFunctionDef, Y→argv, M→isNoChdirVariant, q→varEnv, iO→UNKNOWN_VALUE (the "value cannot be statically verified" sentinel)
```

**Key insight (Part 1):** Both the PowerShell `_v$` fix and the `PWD`/`OLDPWD`/`DIRSTACK` fix are the *same bug class* — the static analyzer's model of "where am I / what is `$PWD`" must invalidate the moment the real shell would chdir. The PowerShell side fixes *detecting* the chdir (so the conservative guards fire); the Bash side fixes *propagating* the chdir into the variable model (so `$PWD`-dependent later statements can't be trusted). The `-n` / `popd +0` carve-outs are notable: they are the exact `pushd`/`popd` flag combinations that manipulate the directory stack **without** actually changing the cwd, so PWD/OLDPWD are *not* invalidated for them — but DIRSTACK always is.

---

# Part 2 — Bare Variable-Assignment Auto-Approve Bypass (2.1.145)

## 2.1 The effective-command resolution chain

Bash permission decisions key off the command's **effective command** — the real program being run after stripping leading `VAR=value` assignments, wrappers (`env`, `timeout`, …), and pipelines. That resolution is done by tree-sitter and three cooperating helpers.

```
"FOO=bar make build"
        │ parseCommand (dP6)
        ▼
   rootNode (tree-sitter)
        │ findCommandNode (UcH)  — descends THROUGH variable_assignment
        ▼
   commandNode = <command "make build">      envVars = ["FOO=bar"]   (via KW5)
        │ extractCommandArguments (wD$)
        ▼
   [ "make", "build" ]   → effective command is `make`

"FOO=bar"  (assignment ONLY, no command)
        │ findCommandNode (UcH)  — descends, finds NO following command
        ▼
   commandNode = null          ← the crux of the bug
```

### parseCommand (dP6)

```javascript
// ============================================
// parseCommand - tree-sitter parse → {rootNode, envVars, commandNode}
// Location: cli_inner_pretty.js:190366-190377
// ============================================

// ORIGINAL (for source lookup):
async function dP6(H) {
  if (!H || H.length > _67) return null;
  try {
    let $ = W$H().parse(H);
    if (!$) return null;
    let q = UcH($, null),
      K = KW5(q);
    return { rootNode: $, envVars: K, commandNode: q, originalCommand: H };
  } catch { return null; }
}

// READABLE (for understanding):
async function parseCommand(command) {
  if (!command || command.length > MAX_PARSE_LEN) return null;
  try {
    let rootNode = getParser().parse(command);
    if (!rootNode) return null;
    let commandNode = findCommandNode(rootNode, null);
    let envVars = collectLeadingAssignments(commandNode);
    return { rootNode, envVars, commandNode, originalCommand: command };
  } catch { return null; }
}

// Mapping: dP6→parseCommand, UcH→findCommandNode, KW5→collectLeadingAssignments, _67→MAX_PARSE_LEN, W$H→getParser, $→rootNode, q→commandNode, K→envVars
```

### findCommandNode (UcH) — descends through `variable_assignment`

This is the heart of the resolver. When it encounters a `variable_assignment` node it looks at the **parent**'s children for the first real command node that starts *after* the assignment. If there is none (a pure `FOO=bar`), it returns `null`.

```javascript
// ============================================
// findCommandNode - locate the effective command, descending through leading assignments
// Location: cli_inner_pretty.js:190389-190407
// ============================================

// ORIGINAL (for source lookup):
function UcH(H, $) {
  let { type: q, children: K } = H;
  if (gP6.has(q)) return H;
  if (q === "variable_assignment" && $)
    return $.children.find((_) => gP6.has(_.type) && _.startIndex > H.startIndex) ?? null;
  if (q === "pipeline") {
    for (let _ of K) { let z = UcH(_, H); if (z) return z; }
    return null;
  }
  if (q === "redirected_statement") return K.find((_) => gP6.has(_.type)) ?? null;
  for (let _ of K) { let z = UcH(_, H); if (z) return z; }
  return null;
}

// READABLE (for understanding):
function findCommandNode(node, parent) {
  let { type, children } = node;
  if (COMMAND_NODE_TYPES.has(type)) return node;                       // command / declaration_command
  if (type === "variable_assignment" && parent)
    // descend THROUGH the assignment to the next real command in the same parent
    return parent.children.find((c) => COMMAND_NODE_TYPES.has(c.type) && c.startIndex > node.startIndex) ?? null;
  if (type === "pipeline") {                                           // first command in a pipeline wins
    for (let c of children) { let r = findCommandNode(c, node); if (r) return r; }
    return null;
  }
  if (type === "redirected_statement") return children.find((c) => COMMAND_NODE_TYPES.has(c.type)) ?? null;
  for (let c of children) { let r = findCommandNode(c, node); if (r) return r; }  // recurse
  return null;
}

// Mapping: UcH→findCommandNode, gP6→COMMAND_NODE_TYPES, H→node, $→parent, q→type, K→children
```

`COMMAND_NODE_TYPES` (`gP6`) is `new Set(["command","declaration_command"])` (cli_inner_pretty.js:190460). A bare assignment `FOO=bar` parses as a `command` whose only children are `variable_assignment` nodes — but tree-sitter wraps it such that `UcH` recurses into the `variable_assignment` with the wrapping node as parent, finds no sibling command after it, and returns `null`. (Verified against the readable 2.1.88 `findCommandNode`, `src/utils/bash/parser.ts:138-170`, which is byte-for-byte the same logic.)

### collectLeadingAssignments (KW5) and the assignment-op set

```javascript
// ============================================
// collectLeadingAssignments - gather leading VAR=value text into envVars
// Location: cli_inner_pretty.js:190408-190414
// ============================================

// ORIGINAL (for source lookup):
function KW5(H) {
  if (!H || H.type !== "command") return [];
  let $ = [];
  for (let q of H.children)
    if (q.type === "variable_assignment") $.push(q.text);
    else if (q.type === "command_name" || q.type === "word") break;
  return $;
}

// READABLE (for understanding):
function collectLeadingAssignments(commandNode) {
  if (!commandNode || commandNode.type !== "command") return [];
  let envVars = [];
  for (let child of commandNode.children)
    if (child.type === "variable_assignment") envVars.push(child.text);
    else if (child.type === "command_name" || child.type === "word") break;  // stop at the real command
  return envVars;
}

// Mapping: KW5→collectLeadingAssignments, H→commandNode, $→envVars, q→child
```

Note `collectLeadingAssignments` requires `commandNode.type === "command"`. For `FOO=bar make build`, the `commandNode` is the `command` node containing both the assignment and `make build`, so `envVars = ["FOO=bar"]`. For a pure `FOO=bar`, `findCommandNode` returned `null` (no following command), so `collectLeadingAssignments(null)` returns `[]` — the assignment text is *not even captured here*; it must be picked up separately by `bareAssignmentNames`. The assignment operators that constitute an assignment are enumerated in `assignmentOps` (`sP5`, cli_inner_pretty.js:190356): `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `<<=`, `>>=`, `&=`, `^=`, `|=`, `**`.

### getCommandPrefixStatic (kI8) — the empty-prefix outcome

```javascript
// ============================================
// getCommandPrefixStatic - build the auto-approve prefix; null prefix for assignment-only
// Location: cli_inner_pretty.js:595513-595528
// ============================================

// ORIGINAL (for source lookup):
async function kI8(H, $ = 0, q = 0) {
  if (q > 2 || $ > 10) return null;
  let K = await dP6(H);
  if (!K) return null;
  if (!K.commandNode) return { commandPrefix: null };
  let { envVars: _, commandNode: z } = K,
    A = wD$(z),
    [Y, ...f] = A;
  if (!Y) return { commandPrefix: null };
  ...
  let w = _.length ? `${_.join(" ")} ` : "";
  return { commandPrefix: j ? w + j : null };
}

// READABLE (for understanding):
async function getCommandPrefixStatic(command, recursionDepth = 0, wrapperCount = 0) {
  if (wrapperCount > 2 || recursionDepth > 10) return null;
  let parsed = await parseCommand(command);
  if (!parsed) return null;
  if (!parsed.commandNode) return { commandPrefix: null };     // ← assignment-only lands here
  let { envVars, commandNode } = parsed,
    cmdArgs = extractCommandArguments(commandNode),
    [cmd, ...args] = cmdArgs;
  if (!cmd) return { commandPrefix: null };
  ...
  let envPrefix = envVars.length ? `${envVars.join(" ")} ` : "";
  return { commandPrefix: prefix ? envPrefix + prefix : null };
}

// Mapping: kI8→getCommandPrefixStatic, dP6→parseCommand, wD$→extractCommandArguments, K→parsed, z→commandNode, _→envVars, A→cmdArgs, Y→cmd, f→args
```

A `null` `commandPrefix` is *correct* — there is no command to form a prefix from. The bug was never here. It was that a `null`/empty effective command was then treated as a benign no-op by the **read-only classifier**, instead of being recognized as "this still mutates the shell environment."

`extractCommandArguments` (`wD$`, cli_inner_pretty.js:190416) handles the `declaration_command` case (`export`/`declare`/`typeset`/`readonly`/`local`/`unset`/`unsetenv` via `$W5` at 190457) and skips `variable_assignment` children when extracting argv (190424). The convenience wrapper `parseCommandWrapper` (`zJ`, cli_inner_pretty.js:190512-190518) chains parse → `findCommandNode` → `extractCommandArguments` and is used where only the argv vector is needed.

## 2.2 The fix: thread `bareAssignmentNames` out of the parser, gate on it

The simple-command classifier was extended to emit a third field, `bareAssignmentNames` — the list of variable names that are set with **no following command**. The `{ kind:"simple", commands, bareAssignmentNames }` result is built by `parseSimpleCommandTree` (`nT5`, cli_inner_pretty.js:207803-207809) and walked by `C$H`/`eT5`, which delegate the actual per-command effect analysis (and the population of `bareAssignmentNames`) to `analyzeCommandEffects` (`tT5`, called at cli_inner_pretty.js:208661) — analyzed in "The producer mechanism" below:

```javascript
// ============================================
// parseSimpleCommandTree - classify a command, now emitting bareAssignmentNames
// Location: cli_inner_pretty.js:207803-207809
// ============================================

// ORIGINAL (for source lookup):
function nT5(H) {
  let $ = [], q = new Map(), K = [], _ = C$H(H, $, q, K);
  if (_) return _;
  return { kind: "simple", commands: $, bareAssignmentNames: K };
}

// READABLE (for understanding):
function parseSimpleCommandTree(rootNode) {
  let commands = [], varEnv = new Map(), bareAssignmentNames = [];
  let tooComplex = walkCommandEffects(rootNode, commands, varEnv, bareAssignmentNames);  // C$H/eT5
  if (tooComplex) return tooComplex;
  return { kind: "simple", commands, bareAssignmentNames };
}

// Mapping: nT5→parseSimpleCommandTree, C$H→walkCommandEffects, H→rootNode, $→commands, q→varEnv, K→bareAssignmentNames
```

### The producer mechanism — where `bareAssignmentNames` is actually populated (`tT5`)

`parseSimpleCommandTree` only *threads* `bareAssignmentNames` (the `K` accumulator) through the walker; the list is **filled** one level down, inside the per-command effect analyzer `analyzeCommandEffects` (`tT5`, cli_inner_pretty.js:208413-208591). This is the literal AST mechanism behind the fix — and it's what makes the new field precisely co-extensive with the bug class (it fires for *exactly* the assignment-only commands that `findCommandNode` would resolve to `null`).

```javascript
// ============================================
// analyzeCommandEffects - records bare-assignment var names when no command follows the leading VAR=value tokens
// Location: cli_inner_pretty.js:208413 (decl), 208439 (bare-assignment branch), 208590 (surface into bareAssignmentNames)
// ============================================

// ORIGINAL (for source lookup):
function tT5(H, $, q, K) {
  let _ = [],
    z = [],
    A = (M, j = !0) => {                       // 208416-208421: record a leading-assignment var name
      let w = M.match(/^[A-Za-z_][A-Za-z0-9_]*/);
      if (w) { if ((_.push(w[0]), j)) z.push(w[0]); }
    },
    Y = H, f = !1;
  // ... consume leading `VAR=value` tokens off the front of Y (each calls A(M)) ...
  let O = Y[0];
  if (O === void 0) for (let M of $) A(M.name);   // 208439: NO command name follows → record every bare-assignment name
  // ... else dispatch on the real command name (export/read/unset/cd/...) ...
  return (K.push(...z), null);                    // 208590: surface z into the caller's bareAssignmentNames
}

// READABLE (for understanding):
function analyzeCommandEffects(argv, leadingAssignments, varEnv, bareAssignmentNames) {
  const writtenVars = [];        // _: every var this command writes (drives the "too-complex" check)
  const bareNames = [];          // z: the subset that are BARE assignments (no command ran)
  const record = (token, isBare = true) => {
    const m = token.match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (m) { writtenVars.push(m[0]); if (isBare) bareNames.push(m[0]); }
  };
  let rest = argv, sawVerboseFlag = false;
  // ... strip leading `VAR=value` tokens off the front, calling record() for each ...
  const cmdName = rest[0];
  // THE CRUX: if there is NO command name after the leading assignments, every
  // leading assignment is a BARE assignment — mirror of findCommandNode → null.
  if (cmdName === undefined) for (const a of leadingAssignments) record(a.name);
  // ... else: a real command followed, so the assignments are env-prefixes, NOT bare ...
  bareAssignmentNames.push(...bareNames);   // surface into the caller's accumulator
  return null;
}

// Mapping: tT5→analyzeCommandEffects, H→argv, $→leadingAssignments, q→varEnv, K→bareAssignmentNames,
//   _→writtenVars, z→bareNames, A→record, O→cmdName, j→isBare
```

The decisive line is `if (O === void 0) for (let M of $) A(M.name);` at cli_inner_pretty.js:208439: `O = Y[0]` is the first non-assignment token, so `O === void 0` is the "the only statement was a leading assignment with nothing after it" case — the exact dual of `findCommandNode` returning `null`. Only in that branch does `A(M.name)` push to `z` with the default `isBare = true`, and `z` is then merged into the caller's `bareAssignmentNames` via `K.push(...z)` at cli_inner_pretty.js:208590. (When a real command *does* follow, the leading assignments are consumed earlier as env-prefixes and are not bare.) `analyzeCommandEffects` is also where the `PWD`/`OLDPWD`/`DIRSTACK` recompute of Part 1.4 lives (cli_inner_pretty.js:208562-208579) — both the cd-effect tracking and the bare-assignment population are facets of the same per-command effect walker.

### Consumer A — read-only classifier `classifySimpleReadOnly` (nz8)

The new guard sits immediately after the `too-complex` check and **before** any further analysis. A bare assignment to a non-allowlisted env var (that the dynamic allowlist `iD$()` doesn't cover) is routed to `passthrough` — which means the read-only fast-path declines to auto-allow, so the command falls through to the normal flow and prompts:

```javascript
// ============================================
// classifySimpleReadOnly - route non-allowlisted bare assignments to passthrough (prompt)
// Location: cli_inner_pretty.js:242978-242990
// ============================================

// ORIGINAL (for source lookup):
function nz8(H, $) {
  let { command: q } = H,
    K = W$H().parse(q),
    _ = K ? nD$(q, K) : { kind: "simple", commands: [], bareAssignmentNames: [] };
  if (_.kind === "too-complex")
    return { behavior: "passthrough", message: `Not a simple read-only command: ${_.reason}` };
  if (K && jL7(K)) return { behavior: "passthrough", message: "Not a simple read-only command: contains a subshell" };
  let z = iD$();
  if (_.bareAssignmentNames.some((O) => !V5H(O) && (z === null || z.has(O))))
    return {
      behavior: "passthrough",
      message: "Bare assignment to a non-allowlisted environment variable can alter behavior of subsequent commands",
    };
  ...
}

// READABLE (for understanding):
function classifySimpleReadOnly(input, isCompound) {
  let { command } = input;
  let rootNode = getParser().parse(command);
  let parsed = rootNode ? parseSimpleCommandTree2(command, rootNode) : { kind: "simple", commands: [], bareAssignmentNames: [] };
  if (parsed.kind === "too-complex")
    return { behavior: "passthrough", message: `Not a simple read-only command: ${parsed.reason}` };
  if (rootNode && hasSubshell(rootNode))
    return { behavior: "passthrough", message: "Not a simple read-only command: contains a subshell" };
  let allowlist = dynamicEnvAllowlist();
  // NEW in 2.1.145: a bare VAR=value with no following command is NOT read-only —
  // it mutates the env for every later command. Refuse the fast-path → prompt.
  if (parsed.bareAssignmentNames.some((name) => !isAllowlistedEnvVar(name) && (allowlist === null || allowlist.has(name))))
    return { behavior: "passthrough", message: "Bare assignment to a non-allowlisted environment variable can alter behavior of subsequent commands" };
  ...
}

// Mapping: nz8→classifySimpleReadOnly, nD$→parseSimpleCommandTree2, jL7→hasSubshell, iD$→dynamicEnvAllowlist, V5H→isAllowlistedEnvVar, H→input, $→isCompound, q→command, K→rootNode, _→parsed, z→allowlist, O→name
```

### Consumer B — read-only auto-allow gate

The final auto-allow gate that grants "Read-only command is allowed" gained a **third** conjunct over its 2.1.142 form. It now refuses to auto-allow if any `bareAssignmentNames` entry (`z` here is the `bareAssignmentNames` array) is non-allowlisted:

```javascript
// ============================================
// readOnlyAutoAllowGate - the 2.1.145 third clause blocking bare assignments
// Location: cli_inner_pretty.js:441400-441406
// ============================================

// ORIGINAL (for source lookup):
let J = iD$();
if (l4.isReadOnly(H) && !LF_(H, K) && !z.some((L) => !V5H(L) && (J === null || J.has(L))))
  return {
    behavior: "allow",
    updatedInput: H,
    decisionReason: { type: "other", reason: "Read-only command is allowed" },
  };

// READABLE (for understanding):
let allowlist = dynamicEnvAllowlist();
if (
  tool.isReadOnly(input) &&
  !hasNonAllowlistedAssignment(input, astCommand) &&                              // existing (LF_/jA5)
  !bareAssignmentNames.some((name) => !isAllowlistedEnvVar(name) && (allowlist === null || allowlist.has(name)))  // NEW 2.1.145
)
  return { behavior: "allow", updatedInput: input, decisionReason: { type: "other", reason: "Read-only command is allowed" } };

// Mapping: iD$→dynamicEnvAllowlist, l4→tool, LF_→hasNonAllowlistedAssignment, V5H→isAllowlistedEnvVar, H→input, K→astCommand, z→bareAssignmentNames, J→allowlist, L→name
```

`bareAssignmentNames` (the `z` array) is supplied to this gate from `parseSimpleCommandTree`'s output threaded through the caller (`z.bareAssignmentNames` is passed at cli_inner_pretty.js:441132/441140/441243/441288).

### The allowlist (`V5H` / `_k$` / `iD$`)

`isAllowlistedEnvVar` (`V5H`, cli_inner_pretty.js:440527) is a membership test against the static safe set `safeEnvVarSet` (`_k$`, cli_inner_pretty.js:441481) — locale/color/CI-style vars whose value cannot influence command resolution: `GOOS`, `GOARCH`, `RUST_LOG`, `NODE_ENV`, `LANG`, `LC_ALL`, `TERM`, `NO_COLOR`, `CI`, `GIT_TERMINAL_PROMPT`, etc. The session-aware `dynamicEnvAllowlist` (`iD$`, cli_inner_pretty.js:209864) unions the current `process.env` keys with extra safe names (`SHELL`, `GIT_EDITOR`, `CLAUDECODE`, …); the gate's `(allowlist === null || allowlist.has(name))` clause is a deliberate carve-out: the block only fires for a name the session actually knows about, so when the dynamic allowlist is unavailable (`null`) it falls back to blocking unconditionally for any non-static-allowlisted var.

## 2.3 Why the resolver was the right place — and what the bug actually was

A naive fix would scan the raw command string for `^[A-Za-z_]\w*=`. The codebase already *has* that — `hasNonAllowlistedAssignment` (`LF_`, cli_inner_pretty.js:440619), which matches leading assignments by regex and was present (byte-identical, as `jA5`) **in 2.1.142** (cli_inner_pretty.js:420366). So the regex detector was *not* the gap. The gap was in the **AST simple-command path**: `parseSimpleCommandTree` classified a bare `FOO=bar` as `{ kind:"simple", commands: [] }` — an *empty command list* — which downstream logic treated as trivially read-only. The fix is therefore correctly placed at the parser: it makes the AST walker surface the assignment names it was already visiting (`bareAssignmentNames`), so the read-only fast-path can distinguish "no commands because nothing was run" from "no commands because the only statement was an env mutation."

### Cross-validation — the pinned pre-fix branch (medium confidence)

The 2.1.142 classifier `A78` (the `nz8` precursor) confirms the gap exactly: its result type was `{ kind: "simple", commands }` with **no** `bareAssignmentNames` field, and the body proceeded straight from the `too-complex` check to the variable-expansion / cd-git checks — there is **no** bare-assignment guard (2.1.142 cli_inner_pretty.js:275936-275945). The 2.1.142 read-only auto-allow gate was `if (L4.isReadOnly(H) && !jA5(H, K))` — only two conjuncts, **missing** the third bare-assignment clause (2.1.142 cli_inner_pretty.js:421120). The 2.1.88 readable source has neither a `bareAssignmentNames` concept nor a bare-assignment guard in `BashTool`, so this is a **NEW post-2.1.88 hardening layer** built on top of the unchanged effective-command resolver.

Confidence calibration, stated honestly:
- The resolver chain (`dP6`/`UcH`/`KW5`/`wD$`/`kI8`) is **verified** — read directly and matched to the readable 2.1.88 source.
- The fix's two enforcement points (`nz8` at 242986, the gate's third clause at 441401) are **verified** present in 2.1.156 and **verified absent** in 2.1.142.
- The **AST artifact and its population point are now pinned**: `bareAssignmentNames` is filled by `analyzeCommandEffects` (`tT5`, cli_inner_pretty.js:208413) at the `if (O === void 0) for (let M of $) A(M.name)` bare-assignment branch (cli_inner_pretty.js:208439) and surfaced via `K.push(...z)` (cli_inner_pretty.js:208590). So the new field is **verified** co-extensive with the `findCommandNode`-returns-`null` case, not reconstructed.
- The remaining reconstruction is only the *exact runtime call path* by which a pre-2.1.145 build reached `behavior:"allow"` for a bare assignment, inferred from the 2.1.142 `A78`/gate bodies; I keep this **medium** — `jA5`/`LF_` (the regex detector) was already present in 2.1.142 and would catch a pure `FOO=bar` via its first regex iteration, so the precise bypass surfaced through the AST `commands:[]`-is-read-only path rather than the regex path. The fix unambiguously targets that AST path (the `bareAssignmentNames` field is the new artifact, now pinned to 208439/208590), which is why I rate the overall closure medium rather than high — the residual uncertainty is the *historical* bypass route, not the *current* mechanism.

---

## Key Insights

1. **Both fixes are "the model lost an effect the real shell keeps."** PowerShell `_v$` lost the cwd change for bareword `cd` forms; the Bash variable tracker lost `$PWD` after `cd`; the Bash classifier lost the env mutation of a bare assignment. In every case the *real* shell carries the effect into subsequent commands, and the static analyzer's failure to model it is the bypass.

2. **The PowerShell fix is one line at a shared leaf, hardening five callers at once.** Because `isCwdChangingCmdlet` (`_v$`) is the single source of truth consulted by the read-only gate, the acceptEdits validator, the compound path validator, and two `git` bare-repo guards, adding the bareword/drive-switch forms in one place closes the gap everywhere. This is the payoff of centralizing the predicate instead of inlining a name check at each guard.

3. **The bare-assignment fix is a parser-output change, not a new check.** The regex detector already existed (`LF_`/`jA5`). The real fix made the AST walker *report* the assignment names it was already traversing (`bareAssignmentNames`), letting the read-only fast-path tell "no command ran" apart from "the command *was* an env mutation."

4. **Allowlist-gated, not absolute.** Setting `LANG=C` or `NODE_ENV=test` bare still auto-approves (they are in `_k$`); only a non-allowlisted name like `LD_PRELOAD=...` or `PATH=...` triggers the prompt. The policy targets vars whose value can change *which program runs* or *how it behaves*, not benign locale/color knobs.
