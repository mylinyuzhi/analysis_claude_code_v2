# Rule Matching Engine (Claude Code 2.1.76)

> Core algorithm for matching permission rules against tool calls: pattern parsing, command normalization, glob matching, and multi-rule orchestration.

---

## Related Symbols

> Symbol mappings:
> - CN6 = matchRulesAgainstCommand (chunks.172.mjs:1756)
> - Sb = extractRulesByBehavior (chunks.172.mjs:2607)
> - Bn8 = filterRulesByToolAndBehavior (chunks.172.mjs:2611)
> - Rn8 = matchCommandAgainstRules (chunks.172.mjs:1696)
> - In8/yfq = parseRulePattern (chunks.172.mjs:1530)
> - Cn8/Efq = globPatternMatch (chunks.172.mjs:1503/1645)
> - Ac = stripWrapperCommands (chunks.172.mjs:1660)
> - Ln8 = extractPrefixPattern (chunks.172.mjs:1488)
> - TYz = hasWildcard (chunks.172.mjs:1492)
> - bn8 = stripAllEnvVars (chunks.172.mjs:1682)
> - yv6 = extractAllowRules (chunks.172.mjs:2509)
> - KF = extractDenyRules (chunks.172.mjs:2559)
> - Lv6 = extractAskRules (chunks.172.mjs:2567)
> - CH = parseRuleFormat (chunks.40.mjs:468)
> - L5 = formatRuleDisplay (chunks.40.mjs:495)
> - E31 = formatRuleSourceDisplay (chunks.40.mjs:216)
> - un8 = allRuleSources (chunks.173.mjs:231)
> - LC6 = getToolPermissionName (chunks.40.mjs:562)
> - EG = resolveToolAlias (chunks.40.mjs:449)

---

## Architecture

```
Tool call (tool_name + command)
    |
    v
CN6 (matchRulesAgainstCommand)
    |
    +-- Sb(context, tool, "deny")  --> Bn8 --> deny rules (Map<pattern, entry>)
    |       |                                      |
    |       +-- yv6/KF/Lv6 (extract rules)         +-- Rn8(command, rules, matchMode)
    |       +-- LC6 (get tool perm name)                   |
    |       +-- CH (parse "Bash(git *)" format)            +-- ik() parse redirections
    |                                                      +-- Ac() strip wrappers
    +-- Sb(context, tool, "ask")   --> Bn8 --> ask rules   +-- bn8() strip env vars
    |       +-- Rn8(command, rules, matchMode)             +-- In8() parse pattern
    |              (stripAllEnvVars: true)                  +-- Cn8() glob match
    |              (skipCompoundCheck: true)
    |
    +-- Sb(context, tool, "allow") --> Bn8 --> allow rules
            +-- Rn8(command, rules, matchMode)
                   (skipCompoundCheck: caller-controlled)
    |
    Returns: { matchingDenyRules, matchingAskRules, matchingAllowRules }
```

---

## Symbol 1: CN6 -- matchRulesAgainstCommand

**What it does:** Top-level orchestrator that runs the complete rule-matching pipeline for a given command against deny, ask, and allow rules simultaneously.

**How it works:** Extracts rules for each behavior type via `Sb`, then matches the command against each set via `Rn8`. Deny and ask rules get aggressive normalization (strip all env vars, skip compound checks). Allow rules pass through the `skipCompoundCheck` flag from the caller.

```javascript
// ============================================
// matchRulesAgainstCommand
// Location: chunks.172.mjs:1756-1778
// ============================================

// ORIGINAL (for source lookup):
function CN6(A, q, K, {skipCompoundCheck: Y = !1} = {}) {
    let z = Sb(q, J4, "deny"),
        _ = Rn8(A, z, K, {stripAllEnvVars: !0, skipCompoundCheck: !0}),
        w = Sb(q, J4, "ask"),
        O = Rn8(A, w, K, {stripAllEnvVars: !0, skipCompoundCheck: !0}),
        $ = Sb(q, J4, "allow"),
        H = Rn8(A, $, K, {skipCompoundCheck: Y});
    return {matchingDenyRules: _, matchingAskRules: O, matchingAllowRules: H}
}

// READABLE (for understanding):
function matchRulesAgainstCommand(toolInput, permissionContext, matchMode, { skipCompoundCheck = false } = {}) {
    // 1. Extract deny rules for tool, match against command
    let denyRuleMap = extractRulesByBehavior(permissionContext, BashTool, "deny");
    let matchingDenyRules = matchCommandAgainstRules(toolInput, denyRuleMap, matchMode, {
        stripAllEnvVars: true,    // Aggressively strip for deny matching
        skipCompoundCheck: true   // Don't reject compounds in deny-rule matching
    });

    // 2. Extract ask rules for tool, match against command
    let askRuleMap = extractRulesByBehavior(permissionContext, BashTool, "ask");
    let matchingAskRules = matchCommandAgainstRules(toolInput, askRuleMap, matchMode, {
        stripAllEnvVars: true,
        skipCompoundCheck: true
    });

    // 3. Extract allow rules for tool, match against command
    let allowRuleMap = extractRulesByBehavior(permissionContext, BashTool, "allow");
    let matchingAllowRules = matchCommandAgainstRules(toolInput, allowRuleMap, matchMode, {
        skipCompoundCheck: skipCompoundCheck  // Caller-controlled
    });

    return { matchingDenyRules, matchingAskRules, matchingAllowRules };
}

// Mapping: CN6->matchRulesAgainstCommand, A->toolInput, q->permissionContext,
//   K->matchMode, Y->skipCompoundCheck, z->denyRuleMap, _->matchingDenyRules,
//   w->askRuleMap, O->matchingAskRules, $->allowRuleMap, H->matchingAllowRules,
//   Sb->extractRulesByBehavior, Rn8->matchCommandAgainstRules, J4->BashTool
```

**Key insight:** Deny and ask rules always use `stripAllEnvVars: true` and `skipCompoundCheck: true`. This means `LANG=C rm -rf /` will match a deny rule for `rm` even with the env var prefix. The allow rules, however, respect the caller's `skipCompoundCheck` flag -- this prevents compound commands like `git pull && make` from matching a simple `git *` allow rule without explicit compound analysis.

---

## Symbol 2: Sb -- extractRulesByBehavior

**What it does:** Thin wrapper that bridges the tool object to the rule-filtering function.

```javascript
// ============================================
// extractRulesByBehavior
// Location: chunks.172.mjs:2607-2608
// ============================================

// ORIGINAL (for source lookup):
function Sb(A, q, K) { return Bn8(A, LC6(q), K) }

// READABLE (for understanding):
function extractRulesByBehavior(permissionContext, tool, behavior) {
    let toolPermName = getToolPermissionName(tool);  // e.g., "Bash" or "mcp__server__tool"
    return filterRulesByToolAndBehavior(permissionContext, toolPermName, behavior);
}

// Mapping: Sb->extractRulesByBehavior, A->permissionContext, q->tool,
//   K->behavior, Bn8->filterRulesByToolAndBehavior, LC6->getToolPermissionName
```

**Key insight:** `LC6` resolves the tool's permission name, which for MCP tools includes the server name prefix (e.g., `mcp__github__create_issue`). For built-in tools like Bash, it just returns the tool's `name` property (`Q7`, which resolves to `"Bash"`).

---

## Symbol 3: Bn8 -- filterRulesByToolAndBehavior

**What it does:** Collects all rules from all rule sources for a specific tool and behavior, returning a Map of pattern-to-rule-entry.

```javascript
// ============================================
// filterRulesByToolAndBehavior
// Location: chunks.172.mjs:2611-2628
// ============================================

// ORIGINAL (for source lookup):
function Bn8(A, q, K) {
    let Y = new Map,
        z = [];
    switch (K) {
        case "allow": z = yv6(A); break;
        case "deny":  z = KF(A);  break;
        case "ask":   z = Lv6(A); break
    }
    for (let _ of z)
        if (_.ruleValue.toolName === q && _.ruleValue.ruleContent !== void 0
            && _.ruleBehavior === K) Y.set(_.ruleValue.ruleContent, _);
    return Y
}

// READABLE (for understanding):
function filterRulesByToolAndBehavior(permissionContext, toolName, behavior) {
    let resultMap = new Map();

    // 1. Select extractor based on behavior
    let allRules;
    switch (behavior) {
        case "allow": allRules = extractAllowRules(permissionContext); break;
        case "deny":  allRules = extractDenyRules(permissionContext);  break;
        case "ask":   allRules = extractAskRules(permissionContext);   break;
    }

    // 2. Filter to rules matching this tool, with content (pattern), and correct behavior
    for (let entry of allRules) {
        if (entry.ruleValue.toolName === toolName
            && entry.ruleValue.ruleContent !== undefined
            && entry.ruleBehavior === behavior) {
            resultMap.set(entry.ruleValue.ruleContent, entry);
        }
    }

    return resultMap;  // Map<patternString, ruleEntry>
}

// Mapping: Bn8->filterRulesByToolAndBehavior, A->permissionContext, q->toolName,
//   K->behavior, Y->resultMap, z->allRules, _->entry,
//   yv6->extractAllowRules, KF->extractDenyRules, Lv6->extractAskRules
```

**Key insight:** Rules without `ruleContent` (i.e., bare tool-level rules like `"Bash"` without a pattern) are deliberately excluded from pattern matching. These are whole-tool rules handled elsewhere. Only pattern-bearing rules like `"Bash(git *)"` participate in the command-matching algorithm.

---

## Symbol 4: yv6 / KF / Lv6 -- Rule Extractors

**What they do:** Extract all rules of a given behavior (allow/deny/ask) from all rule sources, flattening them into a uniform array of `{source, ruleBehavior, ruleValue}` entries.

```javascript
// ============================================
// extractAllowRules / extractDenyRules / extractAskRules
// Location: chunks.172.mjs:2509-2572
// ============================================

// ORIGINAL (for source lookup):
function yv6(A) {
    return un8.flatMap((q) => (A.alwaysAllowRules[q] || []).map((K) => ({
        source: q, ruleBehavior: "allow", ruleValue: CH(K)
    })))
}
function KF(A) {
    return un8.flatMap((q) => (A.alwaysDenyRules[q] || []).map((K) => ({
        source: q, ruleBehavior: "deny", ruleValue: CH(K)
    })))
}
function Lv6(A) {
    return un8.flatMap((q) => (A.alwaysAskRules[q] || []).map((K) => ({
        source: q, ruleBehavior: "ask", ruleValue: CH(K)
    })))
}

// READABLE (for understanding):
function extractAllowRules(permissionContext) {
    return ALL_RULE_SOURCES.flatMap(source =>
        (permissionContext.alwaysAllowRules[source] || []).map(ruleString => ({
            source: source,            // e.g., "localSettings", "policySettings"
            ruleBehavior: "allow",
            ruleValue: parseRuleFormat(ruleString)  // e.g., {toolName: "Bash", ruleContent: "git *"}
        }))
    );
}

// Mapping: yv6->extractAllowRules, KF->extractDenyRules, Lv6->extractAskRules,
//   A->permissionContext, q->source, K->ruleString, CH->parseRuleFormat,
//   un8->ALL_RULE_SOURCES
```

### Rule Sources (un8)

The `un8` array defines the full ordered list of rule sources:

```javascript
// un8 = [...VG, "cliArg", "command", "session"]
// VG = ["userSettings", "projectSettings", "localSettings", "flagSettings", "policySettings"]

// Complete list (8 sources):
ALL_RULE_SOURCES = [
    "userSettings",       // ~/.claude/settings.json
    "projectSettings",    // .claude/settings.json (shared, committed)
    "localSettings",      // .claude/settings.local.json (per-machine)
    "flagSettings",       // --allowedTools CLI flags
    "policySettings",     // Enterprise managed policy
    "cliArg",             // CLI argument overrides
    "command",            // Per-command configuration
    "session"             // Runtime session state (user approval)
]
```

**Key insight:** The extractors iterate through all 8 sources and parse each rule string through `CH(parseRuleFormat)`, converting `"Bash(git *)"` into `{toolName: "Bash", ruleContent: "git *"}`. The flatMap ensures rules from all sources are merged into a single flat list. There is no priority ordering at this stage -- that is handled by the caller.

---

## Symbol 5: CH -- parseRuleFormat

**What it does:** Parses the `"ToolName(pattern)"` string format used in settings files into a structured `{toolName, ruleContent}` object.

```javascript
// ============================================
// parseRuleFormat
// Location: chunks.40.mjs:468-493
// ============================================

// ORIGINAL (for source lookup):
function CH(A) {
    let q = Q23(A, "(");
    if (q === -1) return { toolName: EG(A) };
    let K = U23(A, ")");
    if (K === -1 || K <= q) return { toolName: EG(A) };
    if (K !== A.length - 1) return { toolName: EG(A) };
    let Y = A.substring(0, q),
        z = A.substring(q + 1, K);
    if (!Y) return { toolName: EG(A) };
    if (z === "" || z === "*") return { toolName: EG(Y) };
    let _ = p23(z);
    return { toolName: EG(Y), ruleContent: _ }
}

// READABLE (for understanding):
function parseRuleFormat(ruleString) {
    // Find first unescaped '(' and last unescaped ')'
    let openParen = findFirstUnescaped(ruleString, "(");
    if (openParen === -1) return { toolName: resolveToolAlias(ruleString) };

    let closeParen = findLastUnescaped(ruleString, ")");
    if (closeParen === -1 || closeParen <= openParen) {
        return { toolName: resolveToolAlias(ruleString) };
    }
    // ')' must be at the end
    if (closeParen !== ruleString.length - 1) {
        return { toolName: resolveToolAlias(ruleString) };
    }

    let toolPart = ruleString.substring(0, openParen);       // "Bash"
    let patternPart = ruleString.substring(openParen + 1, closeParen);  // "git *"

    if (!toolPart) return { toolName: resolveToolAlias(ruleString) };
    if (patternPart === "" || patternPart === "*") {
        return { toolName: resolveToolAlias(toolPart) };  // Whole-tool rule, no content
    }

    let unescaped = unescapeParens(patternPart);  // "git \\(*\\)" -> "git (*)"
    return { toolName: resolveToolAlias(toolPart), ruleContent: unescaped };
}

// Mapping: CH->parseRuleFormat, A->ruleString, q->openParen, K->closeParen,
//   Y->toolPart, z->patternPart, _->unescaped, Q23->findFirstUnescaped,
//   U23->findLastUnescaped, EG->resolveToolAlias, p23->unescapeParens
```

### Parse Examples

| Input | Output |
|-------|--------|
| `"Bash"` | `{toolName: "Bash"}` |
| `"Bash(*)"` | `{toolName: "Bash"}` |
| `"Bash(git *)"` | `{toolName: "Bash", ruleContent: "git *"}` |
| `"Bash(npm run build)"` | `{toolName: "Bash", ruleContent: "npm run build"}` |
| `"Task"` | `{toolName: "AgentOutputTool"}` (alias resolved via EG) |

**Key insight:** The parser handles escaped parentheses in patterns (e.g., `"Bash(echo \\(test\\))"` correctly parses with `ruleContent: "echo (test)"`). The `Q23/U23` functions scan for unescaped delimiters by counting preceding backslashes.

---

## Symbol 6: L5 -- formatRuleDisplay

**What it does:** The inverse of `CH` -- formats a `{toolName, ruleContent}` back into display format.

```javascript
// ============================================
// formatRuleDisplay
// Location: chunks.40.mjs:495-498
// ============================================

// ORIGINAL (for source lookup):
function L5(A) {
    if (!A.ruleContent) return A.toolName;
    let q = F23(A.ruleContent);
    return `${A.toolName}(${q})`
}

// READABLE (for understanding):
function formatRuleDisplay(ruleValue) {
    if (!ruleValue.ruleContent) return ruleValue.toolName;  // "Bash"
    let escapedContent = escapeParens(ruleValue.ruleContent);
    return `${ruleValue.toolName}(${escapedContent})`;      // "Bash(git *)"
}

// Mapping: L5->formatRuleDisplay, A->ruleValue, q->escapedContent, F23->escapeParens
```

---

## Symbol 7: In8/yfq -- parseRulePattern

**What it does:** Parses a rule content string (the pattern inside the parentheses) into a typed pattern descriptor used for matching.

```javascript
// ============================================
// parseRulePattern
// Location: chunks.172.mjs:1530-1543
// ============================================

// ORIGINAL (for source lookup):
function yfq(A) {
    let q = Ln8(A);
    if (q !== null) return { type: "prefix", prefix: q };
    if (TYz(A)) return { type: "wildcard", pattern: A };
    return { type: "exact", command: A }
}

// READABLE (for understanding):
function parseRulePattern(patternString) {
    // 1. Check for prefix pattern: "git:*" -> prefix "git"
    let prefix = extractPrefixPattern(patternString);   // matches "xxx:*"
    if (prefix !== null) return { type: "prefix", prefix: prefix };

    // 2. Check for wildcard pattern: "git *" or "npm run *"
    if (hasWildcard(patternString)) return { type: "wildcard", pattern: patternString };

    // 3. Otherwise exact match: "git status"
    return { type: "exact", command: patternString };
}

// Mapping: yfq->parseRulePattern, A->patternString, q->prefix,
//   Ln8->extractPrefixPattern, TYz->hasWildcard
```

### Pattern Types

| Pattern String | Parsed Type | Match Behavior |
|----------------|-------------|----------------|
| `"git"` | `{type: "exact", command: "git"}` | Exact string equality |
| `"git:*"` | `{type: "prefix", prefix: "git"}` | Command starts with "git" |
| `"npm run:*"` | `{type: "prefix", prefix: "npm run"}` | Command starts with "npm run" |
| `"git *"` | `{type: "wildcard", pattern: "git *"}` | Glob pattern matching via Cn8 |
| `"*.py"` | `{type: "wildcard", pattern: "*.py"}` | Glob pattern matching |

### Supporting Functions

```javascript
// Ln8 -- extractPrefixPattern: "git:*" -> "git", "git *" -> null
function Ln8(A) { return A.match(/^(.+):\*$/)?.[1] ?? null }

// TYz -- hasWildcard: checks for unescaped '*' (not ending with ":*")
function TYz(A) {
    if (A.endsWith(":*")) return false;  // Prefix patterns handled separately
    for (let i = 0; i < A.length; i++) {
        if (A[i] === "*") {
            let backslashCount = 0, j = i - 1;
            while (j >= 0 && A[j] === "\\") backslashCount++, j--;
            if (backslashCount % 2 === 0) return true;  // Unescaped wildcard
        }
    }
    return false;
}
```

**Key insight:** The `":*"` suffix is a prefix-match shorthand, distinct from glob wildcards. `"git:*"` means "any command starting with `git`" while `"git *"` is a glob that matches `git` followed by a space and anything. The difference matters: `git:*` matches `git status` as a prefix, while `git *` requires regex evaluation via `Cn8`.

---

## Symbol 8: Cn8/Efq -- globPatternMatch

**What it does:** Converts a glob pattern (with `*` wildcards) into a regex and tests a command string against it.

```javascript
// ============================================
// globPatternMatch
// Location: chunks.172.mjs:1503-1528, 1645-1646
// ============================================

// ORIGINAL (for source lookup):
function Efq(A, q, K = !1) {
    let Y = A.trim(),
        z = "\x00ESCAPED_STAR\x00", _ = "\x00ESCAPED_BACKSLASH\x00",
        w = "", O = 0;
    while (O < Y.length) {
        let X = Y[O];
        if (X === "\\" && O + 1 < Y.length) {
            let P = Y[O + 1];
            if (P === "*") { w += z, O += 2; continue }
            else if (P === "\\") { w += _, O += 2; continue }
        }
        w += X, O++
    }
    let j = w.replace(/[.+?^${}()|[\]\\'"]/g, "\\$&")
             .replace(/\*/g, ".*")
             .replace(new RegExp(z, "g"), "\\*")
             .replace(new RegExp(_, "g"), "\\\\"),
        J = (w.match(/\*/g) || []).length;
    if (j.endsWith(" .*") && J === 1) j = j.slice(0, -3) + "( .*)?";
    let M = "s" + (K ? "i" : "");
    return new RegExp(`^${j}$`, M).test(q)
}

// Cn8 is a thin wrapper:
function Cn8(A, q) { return Efq(A, q) }

// READABLE (for understanding):
function globPatternMatch(pattern, command) {
    let trimmed = pattern.trim();

    // Phase 1: Replace escaped sequences with sentinels
    let processed = "";
    let i = 0;
    while (i < trimmed.length) {
        if (trimmed[i] === "\\" && i + 1 < trimmed.length) {
            if (trimmed[i + 1] === "*")  { processed += SENTINEL_STAR;      i += 2; continue; }
            if (trimmed[i + 1] === "\\") { processed += SENTINEL_BACKSLASH; i += 2; continue; }
        }
        processed += trimmed[i];
        i++;
    }

    // Phase 2: Build regex
    let regexStr = processed
        .replace(/[.+?^${}()|[\]\\'"]/g, "\\$&")  // Escape regex metacharacters
        .replace(/\*/g, ".*")                        // Convert * to .*
        .replace(SENTINEL_STAR, "\\*")               // Restore escaped stars
        .replace(SENTINEL_BACKSLASH, "\\\\");        // Restore escaped backslashes

    // Phase 3: Special case -- trailing " *" with single wildcard makes the space+args optional
    let wildcardCount = (processed.match(/\*/g) || []).length;
    if (regexStr.endsWith(" .*") && wildcardCount === 1) {
        regexStr = regexStr.slice(0, -3) + "( .*)?";
    }

    // Phase 4: Test against command (dotAll mode for multiline)
    return new RegExp(`^${regexStr}$`, "s").test(command);
}

// Mapping: Efq->globPatternMatch, A->pattern, q->command, K->caseInsensitive,
//   Y->trimmed, w->processed, j->regexStr, J->wildcardCount, M->regexFlags
```

### Matching Examples

| Pattern | Command | Result | Reason |
|---------|---------|--------|--------|
| `"git *"` | `"git status"` | true | `*` matches `status` |
| `"git *"` | `"git"` | true | Trailing `" *"` becomes optional `( .*)?` |
| `"npm run *"` | `"npm run build"` | true | `*` matches `build` |
| `"npm run *"` | `"npm run"` | true | Optional trailing match |
| `"\\*special"` | `"*special"` | true | Escaped `*` matches literal `*` |

**Key insight:** The special case where a trailing `" *"` (single wildcard at end) becomes optional `( .*)?` means `"git *"` matches both `"git"` and `"git status"`. This is the reason a rule like `Bash(git *)` allows `git` by itself as well as any git subcommand.

---

## Symbol 9: Ac -- stripWrapperCommands

**What it does:** Recursively strips leading wrapper commands (timeout, time, nice, nohup) and known-safe environment variables from a command string, exposing the "core" command for rule matching.

```javascript
// ============================================
// stripWrapperCommands
// Location: chunks.172.mjs:1660-1679
// ============================================

// ORIGINAL (for source lookup):
function Ac(A) {
    let q = [
        /^timeout[ \t]+(?:(?:--(?:foreground|preserve-status|verbose)|...)[ \t]+)*(?:--[ \t]+)?\d+(?:\.\d+)?[smhd]?[ \t]+/,
        /^time[ \t]+(?:--[ \t]+)?/,
        /^nice[ \t]+-n[ \t]+-?\d+[ \t]+(?:--[ \t]+)?/,
        /^nohup[ \t]+(?:--[ \t]+)?/
    ];
    let K = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)[ \t]+/;
    let Y = A, z = "";
    // Phase 1: Strip known-safe env vars (from AS1 allowlist)
    while (Y !== z) {
        z = Y;
        Y = stripComments(Y);
        let match = Y.match(K);
        if (match && SAFE_ENV_VARS.has(match[1])) Y = Y.replace(K, "");
    }
    // Phase 2: Strip wrapper commands
    z = "";
    while (Y !== z) {
        z = Y;
        Y = stripComments(Y);
        for (let pattern of q) Y = Y.replace(pattern, "");
    }
    return Y.trim();
}

// Mapping: Ac->stripWrapperCommands, A->command, q->wrapperPatterns,
//   K->envVarPattern, Y->current, z->previous, AS1->SAFE_ENV_VARS,
//   hn8->stripComments
```

### Stripping Examples

| Input | Output |
|-------|--------|
| `"timeout 30s git push"` | `"git push"` |
| `"LANG=C nice -n 10 make build"` | `"make build"` |
| `"nohup npm start"` | `"npm start"` |
| `"RUST_LOG=debug cargo test"` | `"cargo test"` |
| `"LD_PRELOAD=evil.so git push"` | `"LD_PRELOAD=evil.so git push"` (NOT stripped -- not in safe list) |

### Safe Environment Variables (AS1)

The `AS1` set contains environment variables that are safe to strip:

```
GOEXPERIMENT, GOOS, GOARCH, CGO_ENABLED, GO111MODULE, RUST_BACKTRACE, RUST_LOG,
NODE_ENV, PYTHONUNBUFFERED, PYTHONDONTWRITEBYTECODE, PYTEST_DISABLE_PLUGIN_AUTOLOAD,
PYTEST_DEBUG, ANTHROPIC_API_KEY, LANG, LANGUAGE, LC_ALL, LC_CTYPE, LC_TIME,
CHARSET, TERM, COLORTERM, NO_COLOR, FORCE_COLOR, TZ, LS_COLORS, LSCOLORS,
GREP_COLOR, GREP_COLORS, GCC_COLORS, TIME_STYLE, BLOCK_SIZE, BLOCKSIZE
```

Additionally, `xfq = /^(LD_|DYLD_|PATH$)/` is used to identify dangerous env vars that should NOT be stripped.

**Key insight:** The two-phase approach (env vars first, then wrappers) handles deeply nested wrappers correctly: `LANG=C timeout 30s nice -n 10 git push` reduces to `git push` through iterative stripping.

---

## Symbol 10: Rn8 -- matchCommandAgainstRules (Core Algorithm)

**What it does:** The central matching function. Given a command and a set of rules (as a Map), it generates all normalized command variants, then filters rules to find matches.

```javascript
// ============================================
// matchCommandAgainstRules
// Location: chunks.172.mjs:1696-1754
// ============================================

// ORIGINAL (for source lookup):
function Rn8(A, q, K, {stripAllEnvVars: Y = !1, skipCompoundCheck: z = !1} = {}) {
    let _ = A.command.trim(),
        w = ik(_).commandWithoutRedirections,
        $ = (K === "exact" ? [_, w] : [w]).flatMap((j) => {
            let J = Ac(j);
            return J !== j ? [j, J] : [j]
        });
    if (Y) {
        let j = new Set($), J = 0;
        while (J < $.length) {
            let M = $.length;
            for (let D = J; D < M; D++) {
                let X = $[D];
                if (!X) continue;
                let P = bn8(X), W = Ac(X);
                if (!j.has(P)) $.push(P), j.add(P);
                if (!j.has(W)) $.push(W), j.add(W)
            }
            J = M
        }
    }
    let H = new Map;
    if (K === "prefix" && !z)
        for (let j of $)
            if (!H.has(j)) H.set(j, th1(j).length > 1);
    return Array.from(q.entries()).filter(([j]) => {
        let J = In8(j);
        return $.some((M) => { /* matching logic */ })
    }).map(([, j]) => j)
}

// READABLE (for understanding):
function matchCommandAgainstRules(toolInput, ruleMap, matchMode, {
    stripAllEnvVars = false,
    skipCompoundCheck = false
} = {}) {
    let rawCommand = toolInput.command.trim();
    let withoutRedirects = parseShell(rawCommand).commandWithoutRedirections;

    // === Phase 1: Generate command variants ===
    // For "exact" mode: include both raw command and without-redirections
    // For "prefix" mode: only without-redirections
    let baseCommands = (matchMode === "exact" ? [rawCommand, withoutRedirects] : [withoutRedirects]);

    // Strip wrapper commands (timeout, nice, nohup, safe env vars)
    let variants = baseCommands.flatMap(cmd => {
        let stripped = stripWrapperCommands(cmd);
        return stripped !== cmd ? [cmd, stripped] : [cmd];
    });

    // === Phase 2: Expand with env var stripping (for deny/ask rules) ===
    if (stripAllEnvVars) {
        let seen = new Set(variants);
        let cursor = 0;
        // BFS expansion: strip env vars and wrappers iteratively
        while (cursor < variants.length) {
            let batchEnd = variants.length;
            for (let i = cursor; i < batchEnd; i++) {
                let cmd = variants[i];
                if (!cmd) continue;
                let envStripped = stripAllEnvironmentVars(cmd);     // bn8
                let wrapperStripped = stripWrapperCommands(cmd);    // Ac
                if (!seen.has(envStripped))    { variants.push(envStripped);    seen.add(envStripped); }
                if (!seen.has(wrapperStripped)) { variants.push(wrapperStripped); seen.add(wrapperStripped); }
            }
            cursor = batchEnd;
        }
    }

    // === Phase 3: Pre-compute compound check for prefix mode ===
    let isCompound = new Map();
    if (matchMode === "prefix" && !skipCompoundCheck) {
        for (let cmd of variants) {
            if (!isCompound.has(cmd)) {
                isCompound.set(cmd, splitSubcommands(cmd).length > 1);
            }
        }
    }

    // === Phase 4: Match each rule against all variants ===
    return Array.from(ruleMap.entries())
        .filter(([patternString]) => {
            let parsedPattern = parseRulePattern(patternString);

            return variants.some(variant => {
                switch (parsedPattern.type) {
                    case "exact":
                        return parsedPattern.command === variant;

                    case "prefix":
                        switch (matchMode) {
                            case "exact":
                                // In exact mode, prefix pattern must match variant exactly
                                return parsedPattern.prefix === variant;
                            case "prefix":
                                // Reject compound commands (prevents "git *" matching "git pull && rm -rf")
                                if (isCompound.get(variant)) return false;
                                // Standard prefix matching
                                if (variant === parsedPattern.prefix) return true;
                                if (variant.startsWith(parsedPattern.prefix + " ")) return true;
                                // Also match xargs variant
                                let xargsPrefix = "xargs " + parsedPattern.prefix;
                                if (variant === xargsPrefix) return true;
                                return variant.startsWith(xargsPrefix + " ");
                        }
                        break;

                    case "wildcard":
                        if (matchMode === "exact") return false;  // Wildcards only in prefix mode
                        if (isCompound.get(variant)) return false;
                        return globPatternMatch(parsedPattern.pattern, variant);
                }
            });
        })
        .map(([, ruleEntry]) => ruleEntry);  // Return rule entries, not patterns
}

// Mapping: Rn8->matchCommandAgainstRules, A->toolInput, q->ruleMap, K->matchMode,
//   Y->stripAllEnvVars, z->skipCompoundCheck, _->rawCommand, w->withoutRedirects,
//   $->variants, H->isCompound, In8->parseRulePattern, Cn8->globPatternMatch,
//   ik->parseShell, Ac->stripWrapperCommands, bn8->stripAllEnvironmentVars,
//   th1->splitSubcommands
```

**Key insight:** The compound-check guard is crucial for security. When matching in "prefix" mode for allow rules, a command like `git status && curl evil.com` would match a `"git:*"` allow rule if the compound check were not in place. The `th1` (splitSubcommands) function splits on `&&`, `||`, and `;`, and if it finds more than one segment, the rule match is rejected.

---

## Key Algorithm: Complete Matching Flow

Given a Bash tool call with `command: "LANG=C timeout 30s git push origin main"`:

```
Step 1: CN6 called with matchMode = "exact"
    |
    v
Step 2: For each behavior (deny, ask, allow):
    |
    +-- Sb extracts rules for "Bash" from all 8 sources
    |   via Bn8 -> yv6/KF/Lv6 -> CH parses each rule string
    |
    v
Step 3: Rn8 generates command variants:
    |
    +-- Raw command: "LANG=C timeout 30s git push origin main"
    +-- Without redirects: "LANG=C timeout 30s git push origin main" (no redirects)
    +-- After Ac(): "git push origin main"
    |
    +-- If stripAllEnvVars (deny/ask):
    |   +-- bn8() strip env: "timeout 30s git push origin main"
    |   +-- Ac() strip wrapper: "git push origin main"
    |   (iterates until no new variants)
    |
    v
Step 4: For each rule in the Map:
    |
    +-- In8 parses rule pattern, e.g. "git:*" -> {type: "prefix", prefix: "git"}
    +-- Tests each variant against pattern:
    |   "git push origin main" starts with "git " -> MATCH
    |
    v
Step 5: Return matched rule entries
```

### Match Modes

| Mode | Used By | Behavior |
|------|---------|----------|
| `"exact"` | `cr6` (checkPermissionRules) | Strict: includes raw command in variants, prefix patterns match only on equality, wildcards disabled |
| `"prefix"` | `VYz` (sandbox check), `ufq` (extended check) | Relaxed: prefix patterns do startsWith matching, wildcards enabled, compound guard active |

### Security Design

```
                    Deny/Ask Rules                Allow Rules
                    ─────────────                ───────────
stripAllEnvVars:    YES                          NO
skipCompoundCheck:  YES (always)                 Caller-controlled
Env var expansion:  Full BFS (find all variants) None

Why? Deny rules must match aggressively:
    "LANG=C curl evil.com" should match deny rule "curl *"
Why? Allow rules must match conservatively:
    "git pull && curl evil.com" should NOT match allow rule "git:*"
```

---

## Symbol 11: SN6 -- generateSuggestions

**What it does:** Generates suggested permission rules that the user can approve to avoid future prompts for similar commands.

```javascript
// ============================================
// generateSuggestions
// Location: chunks.172.mjs:1607-1619
// ============================================

// ORIGINAL (for source lookup):
function SN6(A) {
    let q = NYz(A);
    if (q) return Ur6(J4.name, q);
    if (A.includes("\n")) {
        let Y = A.split("\n")[0].trim();
        if (Y) return Ur6(J4.name, Y)
    }
    let K = eh1(A);
    if (K) return Ur6(J4.name, K);
    return Lfq(J4.name, A)
}

// READABLE (for understanding):
function generateSuggestions(command) {
    // 1. Check for heredoc pattern (command << EOF)
    let heredocPrefix = extractHeredocPrefix(command);
    if (heredocPrefix) return makePrefixRule("Bash", heredocPrefix);

    // 2. For multi-line commands, suggest based on first line
    if (command.includes("\n")) {
        let firstLine = command.split("\n")[0].trim();
        if (firstLine) return makePrefixRule("Bash", firstLine);
    }

    // 3. Try to extract "base subcommand" pattern (e.g., "npm run")
    let twoWordPrefix = extractTwoWordPrefix(command);
    if (twoWordPrefix) return makePrefixRule("Bash", twoWordPrefix);

    // 4. Fall back to exact rule for the full command
    return makeExactRule("Bash", command);
}

// Mapping: SN6->generateSuggestions, A->command, q->heredocPrefix,
//   K->twoWordPrefix, NYz->extractHeredocPrefix, eh1->extractTwoWordPrefix,
//   Ur6->makePrefixRule, Lfq->makeExactRule, J4->BashTool
```

### Suggestion Strategy

| Command | Suggestion Type | Rule |
|---------|----------------|------|
| `"cat << EOF\nhello\nEOF"` | Prefix | `Bash(cat:*)` |
| `"npm run build\necho done"` | Prefix | `Bash(npm run:*)` |
| `"npm run build"` | Prefix | `Bash(npm run:*)` |
| `"ls -la"` | Exact | `Bash(ls -la)` |

**Key insight:** The suggestion system prefers prefix rules (`Bash(git:*)`) over exact rules (`Bash(git status)`) whenever it can identify a stable command prefix. This reduces the number of future prompts by covering the entire command family.

---

## Symbol 12: E31 -- formatRuleSourceDisplay

**What it does:** Converts internal rule source identifiers into human-readable display strings shown in permission prompts.

```javascript
// ============================================
// formatRuleSourceDisplay
// Location: chunks.40.mjs:216-235
// ============================================

// ORIGINAL (for source lookup):
function E31(A) {
    switch (A) {
        case "userSettings":    return "user settings";
        case "projectSettings": return "shared project settings";
        case "localSettings":   return "project local settings";
        case "flagSettings":    return "command line arguments";
        case "policySettings":  return "enterprise managed settings";
        case "cliArg":          return "CLI argument";
        case "command":         return "command configuration";
        case "session":         return "current session"
    }
}

// Mapping: E31->formatRuleSourceDisplay, A->source
```

This is used by `ow` (formatDecisionMessage) when constructing messages like: `"Permission rule 'Bash(git *)' from project local settings requires approval for this Bash command"`.
