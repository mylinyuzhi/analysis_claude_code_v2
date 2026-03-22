# Permission Context Lifecycle (Claude Code 2.1.76)

> Permission context data structure: creation via `xM`, mutation via `Ez` reducer, batch application via `_v`, settings merge via `U84`, and the six permission modes that control tool authorization.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - xM, Ez, _v, U84
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Permission context building
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - fxY, LF8

Key functions in this document (verified locations):
- `createDefaultPermissionContext` (xM) -- chunks.56.mjs:1596
- `permissionContextReducer` (Ez) -- chunks.53.mjs:1224
- `applyPermissionUpdates` (_v) -- chunks.53.mjs:1296
- `updateToolPermissionContext` (U84) -- chunks.172.mjs:2829
- `buildPermissionActions` (ifq) -- chunks.172.mjs:2804
- `applyPermissionActionsToContext` (nfq) -- chunks.172.mjs:2824
- `isManagedPermissionsOnly` (Eb6) -- chunks.53.mjs:1082
- `isUserPermissionsAllowed` (Ea) -- chunks.53.mjs:1086
- `getRulesFromAllSources` (tz1) -- chunks.53.mjs:1122
- `getRulesFromSource` (kb6) -- chunks.53.mjs:1129
- `parseRulesFromSettings` (iL3) -- chunks.53.mjs:1105
- `formatRuleKey` (L5) -- chunks.40.mjs:495
- `parseRuleKey` (CH) -- chunks.40.mjs:468
- `persistPermissionUpdate` (Ym) -- chunks.53.mjs:1306
- `persistPermissionUpdates` (NC) -- chunks.53.mjs:1378
- `isEditableSource` (i_8) -- chunks.53.mjs:1302

---

## Architecture Overview

```
CLI flags + Config files + Env vars
    |
    v
xM() creates default context              [chunks.56.mjs:1596]
    |
    v
Ez() reducer applies updates              [chunks.53.mjs:1224]
  (addRules / setMode / replaceRules /
   removeRules / addDirectories / removeDirectories)
    |
    v
_v() applies batch updates                [chunks.53.mjs:1296]
    |
    v
U84() merges settings                     [chunks.172.mjs:2829]
  (clears local rules -> applies new from config)
    |
    v
toolPermissionContext stored in appState
    |
    v
Consumed by:
  BYz (checkToolPermission)        [chunks.172.mjs:2715]
  Tn8 (checkBashPermissions)       [chunks.172.mjs:1930]
  CN6 (matchRulesForCommand)       [chunks.172.mjs:1756]
  fxY (toolExecutionPipeline)      [chunks.146.mjs:442]
  LF8 (executePreToolHooks)        [chunks.175.mjs:2462]
  Xk8 (filterToolsByMode)          [chunks.93.mjs:1568]
  cr6 (bashExactRuleMatch)         [chunks.172.mjs:2273]
```

---

## toolPermissionContext Structure

The permission context is the central data structure for all permission decisions. Every tool invocation reads from this structure.

```
toolPermissionContext = {
    mode: "default" | "auto" | "bypassPermissions" | "acceptEdits" | "plan" | "dontAsk",

    additionalWorkingDirectories: Map<string, { path: string, source: string }>,

    alwaysAllowRules: {
        [destination: string]: string[]    // e.g. { "userSettings": ["Bash(npm test)", "Read"] }
    },

    alwaysDenyRules: {
        [destination: string]: string[]    // same structure
    },

    alwaysAskRules: {
        [destination: string]: string[]    // same structure
    },

    isBypassPermissionsModeAvailable: boolean
}
```

**Key details:**
- The `destination` keys in rule maps correspond to rule sources: `"userSettings"`, `"projectSettings"`, `"localSettings"`, `"cliArg"`, `"command"`, `"session"`, `"policySettings"`, `"flagSettings"`
- Each rule is stored as a formatted string via `L5()` (formatRuleKey): either just `"ToolName"` or `"ToolName(ruleContent)"` (e.g. `"Bash(npm test)"`)
- `additionalWorkingDirectories` tracks extra directories that tools are allowed to access beyond the main working directory
- `isBypassPermissionsModeAvailable` enables `"plan"` mode to auto-approve when the user has bypass permissions available

---

## 1. Context Creation

### createDefaultPermissionContext (xM)

**What it does:** Creates the initial permission context with all fields set to empty defaults and mode set to `"default"`.

**How it works:** Pure factory function that returns a fresh object with empty rule maps, an empty directory map, and bypass mode disabled.

```javascript
// ============================================
// createDefaultPermissionContext - Initial permission context factory
// Location: chunks.56.mjs:1596
// ============================================

// ORIGINAL (for source lookup):
xM = () => ({
    mode: "default",
    additionalWorkingDirectories: new Map,
    alwaysAllowRules: {},
    alwaysDenyRules: {},
    alwaysAskRules: {},
    isBypassPermissionsModeAvailable: !1
})

// READABLE (for understanding):
createDefaultPermissionContext = () => ({
    mode: "default",
    additionalWorkingDirectories: new Map(),
    alwaysAllowRules: {},
    alwaysDenyRules: {},
    alwaysAskRules: {},
    isBypassPermissionsModeAvailable: false
})

// Mapping: xM->createDefaultPermissionContext
```

**Key insight:** The default mode is `"default"`, not `"auto"`. This means every tool invocation goes through the full permission pipeline unless the mode is explicitly changed. The `isBypassPermissionsModeAvailable` flag is `false` by default, preventing plan mode from auto-approving.

---

## 2. Context Mutation via Reducer

### permissionContextReducer (Ez)

**What it does:** Pure reducer function that applies a single permission update action to the current context, returning a new context. Handles six action types: `setMode`, `addRules`, `replaceRules`, `addDirectories`, `removeRules`, `removeDirectories`.

**How it works:** A `switch` statement dispatches on `action.type`. Each case produces a new context object via spread operator (immutable updates). The `addRules` and `replaceRules` cases map the `behavior` field (`"allow"`, `"deny"`, `"ask"`) to the corresponding rules map key (`alwaysAllowRules`, `alwaysDenyRules`, `alwaysAskRules`). Each rule is formatted via `L5()` before storage.

```javascript
// ============================================
// permissionContextReducer - Core permission state reducer
// Location: chunks.53.mjs:1224
// ============================================

// ORIGINAL (for source lookup):
function Ez(A, q) {
    switch (q.type) {
        case "setMode":
            return k(`Applying permission update: Setting mode to '${q.mode}'`), {
                ...A,
                mode: q.mode
            };
        case "addRules": {
            let K = q.rules.map((z) => L5(z));
            k(`Applying permission update: Adding ${q.rules.length} ${q.behavior} rule(s) to destination '${q.destination}': ${B6(K)}`);
            let Y = q.behavior === "allow" ? "alwaysAllowRules" : q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
            return {
                ...A,
                [Y]: {
                    ...A[Y],
                    [q.destination]: [...A[Y][q.destination] || [], ...K]
                }
            }
        }
        case "replaceRules": {
            let K = q.rules.map((z) => L5(z));
            k(`Replacing all ${q.behavior} rules for destination '${q.destination}' with ${q.rules.length} rule(s): ${B6(K)}`);
            let Y = q.behavior === "allow" ? "alwaysAllowRules" : q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
            return {
                ...A,
                [Y]: {
                    ...A[Y],
                    [q.destination]: K
                }
            }
        }
        case "addDirectories": {
            k(`Applying permission update: Adding ${q.directories.length} director${q.directories.length===1?"y":"ies"} with destination '${q.destination}': ${B6(q.directories)}`);
            let K = new Map(A.additionalWorkingDirectories);
            for (let Y of q.directories) K.set(Y, {
                path: Y,
                source: q.destination
            });
            return {
                ...A,
                additionalWorkingDirectories: K
            }
        }
        case "removeRules": {
            let K = q.rules.map((O) => L5(O));
            k(`Applying permission update: Removing ${q.rules.length} ${q.behavior} rule(s) from source '${q.destination}': ${B6(K)}`);
            let Y = q.behavior === "allow" ? "alwaysAllowRules" : q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules",
                z = A[Y][q.destination] || [],
                _ = new Set(K),
                w = z.filter((O) => !_.has(O));
            return {
                ...A,
                [Y]: {
                    ...A[Y],
                    [q.destination]: w
                }
            }
        }
        case "removeDirectories": {
            k(`Applying permission update: Removing ${q.directories.length} director${q.directories.length===1?"y":"ies"}: ${B6(q.directories)}`);
            let K = new Map(A.additionalWorkingDirectories);
            for (let Y of q.directories) K.delete(Y);
            return {
                ...A,
                additionalWorkingDirectories: K
            }
        }
        default:
            return A
    }
}

// READABLE (for understanding):
function permissionContextReducer(state, action) {
    switch (action.type) {
        case "setMode":
            log(`Applying permission update: Setting mode to '${action.mode}'`);
            return { ...state, mode: action.mode };

        case "addRules": {
            let formattedRules = action.rules.map(formatRuleKey);
            let rulesMapKey = action.behavior === "allow" ? "alwaysAllowRules"
                            : action.behavior === "deny"  ? "alwaysDenyRules"
                            : "alwaysAskRules";
            return {
                ...state,
                [rulesMapKey]: {
                    ...state[rulesMapKey],
                    [action.destination]: [...(state[rulesMapKey][action.destination] || []), ...formattedRules]
                }
            };
        }

        case "replaceRules": {
            let formattedRules = action.rules.map(formatRuleKey);
            let rulesMapKey = behaviorToMapKey(action.behavior);
            return {
                ...state,
                [rulesMapKey]: {
                    ...state[rulesMapKey],
                    [action.destination]: formattedRules   // full replacement, not append
                }
            };
        }

        case "addDirectories": {
            let newDirs = new Map(state.additionalWorkingDirectories);
            for (let dir of action.directories) {
                newDirs.set(dir, { path: dir, source: action.destination });
            }
            return { ...state, additionalWorkingDirectories: newDirs };
        }

        case "removeRules": {
            let toRemove = new Set(action.rules.map(formatRuleKey));
            let rulesMapKey = behaviorToMapKey(action.behavior);
            let existing = state[rulesMapKey][action.destination] || [];
            let filtered = existing.filter(rule => !toRemove.has(rule));
            return {
                ...state,
                [rulesMapKey]: { ...state[rulesMapKey], [action.destination]: filtered }
            };
        }

        case "removeDirectories": {
            let newDirs = new Map(state.additionalWorkingDirectories);
            for (let dir of action.directories) newDirs.delete(dir);
            return { ...state, additionalWorkingDirectories: newDirs };
        }

        default:
            return state;
    }
}

// Mapping: Ez->permissionContextReducer, A->state, q->action, K->formattedRules (or newDirs),
//          Y->rulesMapKey, z->existing, _->toRemoveSet, w->filtered,
//          L5->formatRuleKey, B6->debugStringify, k->log
```

**Key insight:** The reducer distinguishes `addRules` (append) from `replaceRules` (full replacement). This distinction is critical during config reload: `U84` uses `replaceRules` to clear and re-apply settings, while runtime user approvals use `addRules` to accumulate permissions within a session.

### Action Object Shape

Each action passed to `Ez` has this general shape:

```
// setMode
{ type: "setMode", mode: "auto" | "default" | ... }

// addRules / replaceRules
{ type: "addRules" | "replaceRules",
  rules: RuleValue[],           // array of { toolName, ruleContent? }
  behavior: "allow" | "deny" | "ask",
  destination: string }         // source key like "userSettings", "session"

// addDirectories / removeDirectories
{ type: "addDirectories" | "removeDirectories",
  directories: string[],
  destination: string }

// removeRules
{ type: "removeRules",
  rules: RuleValue[],
  behavior: "allow" | "deny" | "ask",
  destination: string }
```

---

## 3. Batch Update Application

### applyPermissionUpdates (_v)

**What it does:** Applies an array of permission update actions to a context, folding them left through the reducer.

**How it works:** Simple loop that feeds each action through `Ez` sequentially.

```javascript
// ============================================
// applyPermissionUpdates - Sequential batch update application
// Location: chunks.53.mjs:1296
// ============================================

// ORIGINAL (for source lookup):
function _v(A, q) {
    let K = A;
    for (let Y of q) K = Ez(K, Y);
    return K
}

// READABLE (for understanding):
function applyPermissionUpdates(state, updates) {
    let result = state;
    for (let update of updates) {
        result = permissionContextReducer(result, update);
    }
    return result;
}

// Mapping: _v->applyPermissionUpdates, A->state, q->updates, K->result, Y->update, Ez->permissionContextReducer
```

**Key insight:** This is a standard `Array.reduce` pattern expressed as a loop. The ordering of updates matters: later updates can override earlier ones for the same destination+behavior combination when using `replaceRules`.

---

## 4. Settings Merge

### buildPermissionActions (ifq)

**What it does:** Groups an array of flat rule records (with `source`, `ruleBehavior`, `ruleValue` fields) into permission update action objects suitable for passing to `Ez` or `_v`.

**How it works:** Creates a `Map` keyed by `"source:behavior"` strings, collecting rule values into arrays per group. Then converts each group into an action object with the specified `type` (either `"addRules"` or `"replaceRules"`).

```javascript
// ============================================
// buildPermissionActions - Groups rules into reducer-compatible actions
// Location: chunks.172.mjs:2804
// ============================================

// ORIGINAL (for source lookup):
function ifq(A, q) {
    let K = new Map;
    for (let z of A) {
        let _ = `${z.source}:${z.ruleBehavior}`;
        if (!K.has(_)) K.set(_, []);
        K.get(_).push(z.ruleValue)
    }
    let Y = [];
    for (let [z, _] of K) {
        let [w, O] = z.split(":");
        Y.push({
            type: q,
            rules: _,
            behavior: O,
            destination: w
        })
    }
    return Y
}

// READABLE (for understanding):
function buildPermissionActions(rules, actionType) {
    // Phase 1: Group rules by "source:behavior" key
    let groups = new Map();
    for (let rule of rules) {
        let key = `${rule.source}:${rule.ruleBehavior}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(rule.ruleValue);
    }

    // Phase 2: Convert groups to action objects
    let actions = [];
    for (let [key, ruleValues] of groups) {
        let [destination, behavior] = key.split(":");
        actions.push({
            type: actionType,       // "addRules" or "replaceRules"
            rules: ruleValues,
            behavior: behavior,     // "allow", "deny", or "ask"
            destination: destination // "userSettings", "session", etc.
        });
    }
    return actions;
}

// Mapping: ifq->buildPermissionActions, A->rules, q->actionType, K->groups, Y->actions, z->key/_->ruleValues, w->destination, O->behavior
```

**Key insight:** The `actionType` parameter determines whether the resulting actions will replace or append rules. `U84` calls `ifq` with `"replaceRules"` for full config reload, while `nfq` calls it with `"addRules"` for incremental additions.

### applyPermissionActionsToContext (nfq)

**What it does:** Convenience function that builds `addRules` actions from flat rule records and applies them to a context.

```javascript
// ============================================
// applyPermissionActionsToContext - Build and apply addRules actions
// Location: chunks.172.mjs:2824
// ============================================

// ORIGINAL (for source lookup):
function nfq(A, q) {
    let K = ifq(q, "addRules");
    return _v(A, K)
}

// READABLE (for understanding):
function applyPermissionActionsToContext(context, rules) {
    let actions = buildPermissionActions(rules, "addRules");
    return applyPermissionUpdates(context, actions);
}

// Mapping: nfq->applyPermissionActionsToContext, A->context, q->rules, K->actions, ifq->buildPermissionActions, _v->applyPermissionUpdates
```

---

### updateToolPermissionContext (U84)

**What it does:** The main settings merge function. Called when configuration is reloaded. Clears existing rules from specific sources and replaces them with fresh rules from config.

**How it works:**

1. **Managed mode check**: If `Eb6()` returns true (policySettings has `allowManagedPermissionRulesOnly`), clears rules from ALL sources including `cliArg` and `session`. This is the enterprise lockdown path.

2. **Standard path**: Always clears rules from the three file-based sources (`userSettings`, `projectSettings`, `localSettings`) across all three behaviors (`allow`, `deny`, `ask`). This prevents stale rules from accumulating.

3. **Re-apply**: Builds `replaceRules` actions from the new rules array and applies them via `_v`.

```javascript
// ============================================
// updateToolPermissionContext - Full settings merge into permission context
// Location: chunks.172.mjs:2829
// ============================================

// ORIGINAL (for source lookup):
function U84(A, q) {
    let K = A;
    if (Eb6()) {
        let _ = ["userSettings", "projectSettings", "localSettings", "cliArg", "session"],
            w = ["allow", "deny", "ask"];
        for (let O of _)
            for (let $ of w) K = Ez(K, {
                type: "replaceRules",
                rules: [],
                behavior: $,
                destination: O
            })
    }
    let Y = ["userSettings", "projectSettings", "localSettings"];
    for (let _ of Y)
        for (let w of ["allow", "deny", "ask"]) K = Ez(K, {
            type: "replaceRules",
            rules: [],
            behavior: w,
            destination: _
        });
    let z = ifq(q, "replaceRules");
    return _v(K, z)
}

// READABLE (for understanding):
function updateToolPermissionContext(currentContext, newRules) {
    let context = currentContext;

    // In managed-only mode, clear ALL sources (locks out user/CLI overrides)
    if (isManagedPermissionsOnly()) {
        let allSources = ["userSettings", "projectSettings", "localSettings", "cliArg", "session"];
        let allBehaviors = ["allow", "deny", "ask"];
        for (let source of allSources)
            for (let behavior of allBehaviors)
                context = permissionContextReducer(context, {
                    type: "replaceRules", rules: [], behavior, destination: source
                });
    }

    // Always clear file-based sources (they will be re-populated below)
    let fileSources = ["userSettings", "projectSettings", "localSettings"];
    for (let source of fileSources)
        for (let behavior of ["allow", "deny", "ask"])
            context = permissionContextReducer(context, {
                type: "replaceRules", rules: [], behavior, destination: source
            });

    // Apply the new rules as replaceRules actions
    let actions = buildPermissionActions(newRules, "replaceRules");
    return applyPermissionUpdates(context, actions);
}

// Mapping: U84->updateToolPermissionContext, A->currentContext, q->newRules, K->context,
//          Y->fileSources, z->actions, Eb6->isManagedPermissionsOnly,
//          Ez->permissionContextReducer, ifq->buildPermissionActions, _v->applyPermissionUpdates
```

**Key insight:** The double-clear pattern (managed mode clears all sources, then standard path clears file sources again) is intentional. In managed mode, `cliArg` and `session` sources are also wiped, preventing users from overriding policy-managed rules. In standard mode, only file-based sources are cleared and refreshed, preserving CLI args and session-granted permissions.

---

## 5. Rule Loading from Config Files

### isManagedPermissionsOnly (Eb6)

**What it does:** Checks if the system is in managed/enterprise mode where only policy-managed permission rules are allowed.

```javascript
// ============================================
// isManagedPermissionsOnly - Enterprise lockdown check
// Location: chunks.53.mjs:1082
// ============================================

// ORIGINAL (for source lookup):
function Eb6() {
    return L8("policySettings")?.allowManagedPermissionRulesOnly === !0
}

// READABLE (for understanding):
function isManagedPermissionsOnly() {
    return getSettings("policySettings")?.allowManagedPermissionRulesOnly === true;
}

// Mapping: Eb6->isManagedPermissionsOnly, L8->getSettings
```

### getRulesFromAllSources (tz1)

**What it does:** Loads permission rules from all configured sources. In managed mode, only loads from `"policySettings"`.

```javascript
// ============================================
// getRulesFromAllSources - Aggregate rules from all config sources
// Location: chunks.53.mjs:1122
// ============================================

// ORIGINAL (for source lookup):
function tz1() {
    if (Eb6()) return kb6("policySettings");
    let A = [];
    for (let q of pQ()) A.push(...kb6(q));
    return A
}

// READABLE (for understanding):
function getRulesFromAllSources() {
    if (isManagedPermissionsOnly()) return getRulesFromSource("policySettings");
    let allRules = [];
    for (let source of getConfigSourceOrder()) {
        allRules.push(...getRulesFromSource(source));
    }
    return allRules;
}

// Mapping: tz1->getRulesFromAllSources, Eb6->isManagedPermissionsOnly, kb6->getRulesFromSource, pQ->getConfigSourceOrder
```

### getRulesFromSource (kb6)

**What it does:** Loads permission rules from a single config source by reading the settings file and extracting the `permissions` block.

```javascript
// ============================================
// getRulesFromSource - Load rules from a single settings source
// Location: chunks.53.mjs:1129
// ============================================

// ORIGINAL (for source lookup):
function kb6(A) {
    let q = L8(A);
    return iL3(q, A)
}

// READABLE (for understanding):
function getRulesFromSource(source) {
    let settings = getSettings(source);
    return parseRulesFromSettings(settings, source);
}

// Mapping: kb6->getRulesFromSource, L8->getSettings, iL3->parseRulesFromSettings
```

### parseRulesFromSettings (iL3)

**What it does:** Extracts permission rules from a settings object, converting each rule into a flat record with `source`, `ruleBehavior`, and `ruleValue` fields.

```javascript
// ============================================
// parseRulesFromSettings - Extract flat rule records from settings object
// Location: chunks.53.mjs:1105
// ============================================

// ORIGINAL (for source lookup):
function iL3(A, q) {
    if (!A || !A.permissions) return [];
    let {
        permissions: K
    } = A, Y = [];
    for (let z of cL3) {
        let _ = K[z];
        if (_)
            for (let w of _) Y.push({
                source: q,
                ruleBehavior: z,
                ruleValue: CH(w)
            })
    }
    return Y
}

// READABLE (for understanding):
function parseRulesFromSettings(settings, source) {
    if (!settings || !settings.permissions) return [];
    let { permissions } = settings;
    let rules = [];
    for (let behavior of RULE_BEHAVIORS) {       // ["allow", "deny", "ask"]
        let behaviorRules = permissions[behavior];
        if (behaviorRules) {
            for (let rule of behaviorRules) {
                rules.push({
                    source: source,               // "userSettings", etc.
                    ruleBehavior: behavior,        // "allow", "deny", "ask"
                    ruleValue: parseRuleKey(rule)  // { toolName, ruleContent? }
                });
            }
        }
    }
    return rules;
}

// Mapping: iL3->parseRulesFromSettings, A->settings, q->source, K->permissions,
//          Y->rules, z->behavior, _->behaviorRules, w->rule,
//          cL3->RULE_BEHAVIORS (["allow","deny","ask"]), CH->parseRuleKey
```

**Key insight:** The `cL3` constant (initialized at chunks.53.mjs:1208) defines the three rule behaviors: `["allow", "deny", "ask"]`. Settings files store rules in the `permissions.allow`, `permissions.deny`, and `permissions.ask` arrays. Each rule string is parsed by `CH` (parseRuleKey) from `"ToolName(content)"` format into a `{ toolName, ruleContent }` object.

---

## 6. Rule Key Formatting

### formatRuleKey (L5)

**What it does:** Converts a rule value object `{ toolName, ruleContent? }` into a canonical string representation for storage and comparison.

```javascript
// ============================================
// formatRuleKey - Rule value to string conversion
// Location: chunks.40.mjs:495
// ============================================

// ORIGINAL (for source lookup):
function L5(A) {
    if (!A.ruleContent) return A.toolName;
    let q = F23(A.ruleContent);
    return `${A.toolName}(${q})`
}

// READABLE (for understanding):
function formatRuleKey(ruleValue) {
    if (!ruleValue.ruleContent) return ruleValue.toolName;
    let escapedContent = escapeParens(ruleValue.ruleContent);
    return `${ruleValue.toolName}(${escapedContent})`;
}

// Mapping: L5->formatRuleKey, A->ruleValue, q->escapedContent, F23->escapeParens
```

**Examples:**
- `{ toolName: "Read" }` becomes `"Read"`
- `{ toolName: "Bash", ruleContent: "npm test" }` becomes `"Bash(npm test)"`
- `{ toolName: "Bash", ruleContent: "cat (" }` becomes `"Bash(cat \\()"` (parentheses escaped)

### parseRuleKey (CH)

**What it does:** Parses a rule key string back into a `{ toolName, ruleContent? }` object. Inverse of `L5`.

```javascript
// ============================================
// parseRuleKey - String to rule value conversion
// Location: chunks.40.mjs:468
// ============================================

// ORIGINAL (for source lookup):
function CH(A) {
    let q = Q23(A, "(");
    if (q === -1) return {
        toolName: EG(A)
    };
    let K = U23(A, ")");
    // ... extracts toolName before '(' and ruleContent between '(' and ')'
}

// READABLE (for understanding):
function parseRuleKey(ruleString) {
    let openParen = findUnescapedChar(ruleString, "(");
    if (openParen === -1) return { toolName: normalizeToolName(ruleString) };
    let closeParen = findUnescapedCharFromEnd(ruleString, ")");
    let toolName = normalizeToolName(ruleString.substring(0, openParen));
    let ruleContent = unescapeParens(ruleString.substring(openParen + 1, closeParen));
    return { toolName, ruleContent };
}

// Mapping: CH->parseRuleKey, A->ruleString, q->openParen, K->closeParen,
//          Q23->findUnescapedChar, U23->findUnescapedCharFromEnd, EG->normalizeToolName, p23->unescapeParens
```

---

## 7. Permission Persistence

### persistPermissionUpdate (Ym)

**What it does:** Writes a single permission update action to the corresponding settings JSON file on disk. Only acts on editable sources (`userSettings`, `projectSettings`, `localSettings`).

**How it works:** Checks if the destination is editable via `i_8()`. Then dispatches on the action type to read the current settings file, merge the changes, and write back via `TA()` (writeSettings).

```javascript
// ============================================
// persistPermissionUpdate - Write permission change to settings file
// Location: chunks.53.mjs:1306
// ============================================

// ORIGINAL (for source lookup):
function Ym(A) {
    if (!i_8(A.destination)) return;
    switch (k(`Persisting permission update: ${A.type} to source '${A.destination}'`), A.type) {
        case "addRules": {
            k(`Persisting ${A.rules.length} ${A.behavior} rule(s) to ${A.destination}`), JX7({
                ruleValues: A.rules,
                ruleBehavior: A.behavior
            }, A.destination);
            break
        }
        case "addDirectories": {
            // ... reads existing directories, merges new ones, writes back
            break
        }
        case "removeRules": {
            // ... reads existing rules, filters out removed ones, writes back
            break
        }
        case "removeDirectories": {
            // ... reads existing directories, filters out removed ones, writes back
            break
        }
        case "setMode": {
            k(`Persisting mode '${A.mode}' to ${A.destination}`), TA(A.destination, {
                permissions: {
                    defaultMode: A.mode
                }
            });
            break
        }
        case "replaceRules": {
            // ... formats rules via L5, writes entire behavior array
            break
        }
    }
}

// READABLE (for understanding):
function persistPermissionUpdate(action) {
    if (!isEditableSource(action.destination)) return;  // skip policySettings, flagSettings, etc.
    switch (action.type) {
        case "addRules":
            saveRulesToSettings({ ruleValues: action.rules, ruleBehavior: action.behavior }, action.destination);
            break;
        case "setMode":
            writeSettings(action.destination, { permissions: { defaultMode: action.mode } });
            break;
        case "replaceRules":
            let formatted = action.rules.map(formatRuleKey);
            writeSettings(action.destination, { permissions: { [action.behavior]: formatted } });
            break;
        // ... addDirectories, removeRules, removeDirectories cases
    }
}

// Mapping: Ym->persistPermissionUpdate, A->action, i_8->isEditableSource, JX7->saveRulesToSettings,
//          TA->writeSettings, L5->formatRuleKey, k->log
```

### isEditableSource (i_8)

```javascript
// ORIGINAL (for source lookup):
function i_8(A) {
    return A === "localSettings" || A === "userSettings" || A === "projectSettings"
}

// READABLE:
function isEditableSource(source) {
    return source === "localSettings" || source === "userSettings" || source === "projectSettings";
}

// Mapping: i_8->isEditableSource
```

**Key insight:** Only three sources are editable on disk. Sources like `"policySettings"`, `"flagSettings"`, `"cliArg"`, `"command"`, and `"session"` are either read-only or transient. The `deletePermissionRule` function (`SMq` at chunks.172.mjs:2778) explicitly throws an error if you try to delete rules from `"policySettings"`, `"flagSettings"`, or `"command"`.

---

## 8. Permission Mode Values

### Mode Definitions and Effects

| Mode | Value | Effect on Tool Authorization | Typical Trigger |
|------|-------|------------------------------|-----------------|
| `"default"` | Standard | Full rule-based permission checking: deny rules block, ask rules prompt, allow rules auto-approve, unmatched rules prompt | Initial state; explicit mode reset |
| `"auto"` | Auto-allow | Skips all permission prompts; all tools are auto-approved. Security checks (injection detection) still run | `--dangerously-skip-permissions` flag; background/headless agents |
| `"bypassPermissions"` | Bypass | Bypasses all permission checks including tool-level `checkPermissions()`. Applied after tool-level check returns `"ask"` | API/SDK usage with explicit opt-in |
| `"acceptEdits"` | Accept edits | Auto-accepts file-editing tools (Write, Edit, MultiEdit, NotebookEdit) while prompting for other tools | Accept-edits mode toggle in UI |
| `"plan"` | Read-only | Restricts available tools to read-only set. Can auto-approve if `isBypassPermissionsModeAvailable` is true | Plan mode toggle |
| `"dontAsk"` | Silent deny | Never prompts the user; tools that would require approval are silently handled. Used in non-interactive contexts | Non-interactive API sessions |

### Mode Checking in the Decision Pipeline (BYz)

The main permission checker `BYz` (chunks.172.mjs:2715) checks modes at specific points in its 9-layer pipeline:

```
Layer 1: Abort check (abortController.signal)
Layer 2: Global deny rules (bYz - checks alwaysDenyRules)
Layer 3: Global ask rules (xYz - checks alwaysAskRules)
    Exception: sandbox auto-allow overrides ask for Bash
Layer 4: Tool-level checkPermissions() call
Layer 5: Early return if deny from tool check
Layer 6: Early return if requiresUserInteraction + ask
Layer 7: Early return if ask from explicit ask rule
Layer 8: Mode check: bypassPermissions -> allow
         Mode check: plan + isBypassPermissionsModeAvailable -> allow
Layer 9: Global allow rules (IYz - checks alwaysAllowRules)
Layer 10: Fallback: passthrough -> ask (default to prompting user)
```

```javascript
// ============================================
// checkToolPermission (BYz) - Main permission decision pipeline (simplified)
// Location: chunks.172.mjs:2715
// ============================================

// ORIGINAL (for source lookup):
async function BYz(A, q, K, Y, z) {
    if (K.abortController.signal.aborted) throw new oY;
    let _ = K.getAppState(),
        w = bYz(_.toolPermissionContext, A);
    if (w) return { behavior: "deny", decisionReason: { type: "rule", rule: w }, message: `Permission to use ${A.name} has been denied.` };
    let O = xYz(_.toolPermissionContext, A);
    if (O) {
        if (!(A.name === Q7 && vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled() && Ti(q)))
            return { behavior: "ask", decisionReason: { type: "rule", rule: O }, message: ow(A.name) }
    }
    let $ = { behavior: "passthrough", message: ow(A.name) };
    try { let M = A.inputSchema.parse(q); $ = await A.checkPermissions(M, K) } catch (M) { /* ... */ }
    if ($?.behavior === "deny") return $;
    if (A.requiresUserInteraction?.() && $?.behavior === "ask") return $;
    if ($?.behavior === "ask" && $.decisionReason?.type === "rule" && $.decisionReason.rule.ruleBehavior === "ask") return $;
    if (_ = K.getAppState(), _.toolPermissionContext.mode === "bypassPermissions" ||
        _.toolPermissionContext.mode === "plan" && _.toolPermissionContext.isBypassPermissionsModeAvailable) {
        return { behavior: "allow", updatedInput: lfq($, q), decisionReason: { type: "mode", mode: _.toolPermissionContext.mode } };
    }
    let j = IYz(_.toolPermissionContext, A);
    if (j) return { behavior: "allow", updatedInput: lfq($, q), decisionReason: { type: "rule", rule: j } };
    let J = $.behavior === "passthrough" ? { ...$, behavior: "ask", message: ow(A.name, $.decisionReason) } : $;
    return J
}

// READABLE (for understanding):
async function checkToolPermission(tool, input, toolUseContext, hookResult, extraArg) {
    if (toolUseContext.abortController.signal.aborted) throw new AbortError();

    let appState = toolUseContext.getAppState();

    // Layer 2: Global deny rules
    let denyMatch = findMatchingDenyRule(appState.toolPermissionContext, tool);
    if (denyMatch) return { behavior: "deny", decisionReason: { type: "rule", rule: denyMatch } };

    // Layer 3: Global ask rules (with sandbox exception)
    let askMatch = findMatchingAskRule(appState.toolPermissionContext, tool);
    if (askMatch) {
        let isSandboxedBash = tool.name === BASH_TOOL && isSandboxingEnabled() && isAutoAllowBashIfSandboxedEnabled() && isSafeForSandbox(input);
        if (!isSandboxedBash) return { behavior: "ask", decisionReason: { type: "rule", rule: askMatch } };
    }

    // Layer 4: Tool-level permission check
    let toolResult = { behavior: "passthrough" };
    try { toolResult = await tool.checkPermissions(input, toolUseContext); } catch { /* swallow */ }

    // Layers 5-7: Early returns for deny, requiresUserInteraction, explicit ask rules
    if (toolResult?.behavior === "deny") return toolResult;
    if (tool.requiresUserInteraction?.() && toolResult?.behavior === "ask") return toolResult;
    if (toolResult?.behavior === "ask" && toolResult.decisionReason?.type === "rule") return toolResult;

    // Layer 8: Mode-based bypass
    appState = toolUseContext.getAppState();  // re-read (may have changed)
    if (appState.toolPermissionContext.mode === "bypassPermissions" ||
        (appState.toolPermissionContext.mode === "plan" && appState.toolPermissionContext.isBypassPermissionsModeAvailable)) {
        return { behavior: "allow", updatedInput: extractUpdatedInput(toolResult, input), decisionReason: { type: "mode" } };
    }

    // Layer 9: Global allow rules
    let allowMatch = findMatchingAllowRule(appState.toolPermissionContext, tool);
    if (allowMatch) return { behavior: "allow", updatedInput: extractUpdatedInput(toolResult, input), decisionReason: { type: "rule", rule: allowMatch } };

    // Layer 10: Fallback - convert passthrough to ask
    if (toolResult.behavior === "passthrough") return { ...toolResult, behavior: "ask" };
    return toolResult;
}

// Mapping: BYz->checkToolPermission, A->tool, q->input, K->toolUseContext, Y->hookResult, z->extraArg,
//          bYz->findMatchingDenyRule, xYz->findMatchingAskRule, IYz->findMatchingAllowRule,
//          oY->AbortError, lfq->extractUpdatedInput, ow->buildPermissionMessage,
//          Q7->BASH_TOOL (constant), vA->sandbox module, Ti->isSafeForSandbox
```

**Key insight:** The mode check (Layer 8) happens **after** tool-level `checkPermissions()` but **before** allow-rule matching (Layer 9). This means `bypassPermissions` mode can override a tool's `"ask"` result, but it cannot override an explicit `"deny"` from either global deny rules (Layer 2) or the tool itself (Layer 5). Deny rules are always respected, even in bypass mode.

---

## 9. Rule Extraction Helpers

The permission context stores rules in maps keyed by destination source. Three helper functions flatten these maps into arrays for rule matching:

```javascript
// ============================================
// Rule extraction from context - Three parallel helpers
// Location: chunks.172.mjs:2509-2573
// ============================================

// ORIGINAL (for source lookup):
function yv6(A) {
    return un8.flatMap((q) => (A.alwaysAllowRules[q] || []).map((K) => ({
        source: q,
        ruleBehavior: "allow",
        ruleValue: CH(K)
    })))
}

function KF(A) {
    return un8.flatMap((q) => (A.alwaysDenyRules[q] || []).map((K) => ({
        source: q,
        ruleBehavior: "deny",
        ruleValue: CH(K)
    })))
}

function Lv6(A) {
    return un8.flatMap((q) => (A.alwaysAskRules[q] || []).map((K) => ({
        source: q,
        ruleBehavior: "ask",
        ruleValue: CH(K)
    })))
}

// READABLE:
// yv6 = flattenAllowRules(context) -> array of { source, ruleBehavior: "allow", ruleValue }
// KF  = flattenDenyRules(context)  -> array of { source, ruleBehavior: "deny",  ruleValue }
// Lv6 = flattenAskRules(context)   -> array of { source, ruleBehavior: "ask",   ruleValue }

// All iterate over un8 (SOURCE_PRIORITY_ORDER) and parse each rule string via CH (parseRuleKey)

// Mapping: yv6->flattenAllowRules, KF->flattenDenyRules, Lv6->flattenAskRules,
//          un8->SOURCE_PRIORITY_ORDER, CH->parseRuleKey
```

These are consumed by the three match functions in `BYz`:
- `IYz(context, tool)` = find first matching allow rule via `yv6`
- `bYz(context, tool)` = find first matching deny rule via `KF`
- `xYz(context, tool)` = find first matching ask rule via `Lv6`

---

## 10. Rule Destination Sources

### Source Hierarchy

Rules come from multiple sources with implicit priority. The `un8` constant defines the source iteration order used by `yv6`/`KF`/`Lv6`:

| Source | Type | Persistence | Config File Location | Editable at Runtime |
|--------|------|-------------|---------------------|---------------------|
| `userSettings` | File-based | Persisted to disk | `~/.claude/settings.json` | Yes |
| `projectSettings` | File-based | Persisted to disk | `.claude/settings.json` (project root) | Yes |
| `localSettings` | File-based | Persisted to disk | `.claude/settings.local.json` (project root) | Yes |
| `policySettings` | Managed | Read-only | Enterprise policy configuration | No |
| `flagSettings` | CLI | Read-only | CLI flags like `--allowedTools` | No |
| `cliArg` | CLI | Session-only | `--allowed-tools "Tool"`, `--disallowed-tools "Tool"` | No (cleared on reload) |
| `command` | Programmatic | Session-only | API/SDK commands | No |
| `session` | Runtime | Session-only | User approval dialogs during session | Yes (append only) |

### Settings File Format

Each settings file uses this JSON structure for permissions:

```json
{
    "permissions": {
        "allow": ["Read", "Bash(npm test)", "Bash(git *)"],
        "deny": ["Bash(rm -rf *)"],
        "ask": ["Write"],
        "additionalDirectories": ["/tmp/workspace"]
    }
}
```

### Managed Mode (Enterprise)

When `policySettings.allowManagedPermissionRulesOnly` is `true`:
- `Eb6()` returns `true`
- `tz1()` only loads rules from `"policySettings"`, ignoring all other sources
- `U84()` clears rules from ALL sources including `cliArg` and `session`
- `Ea()` (isUserPermissionsAllowed) returns `false`, preventing users from adding their own rules
- `JX7()` (saveRulesToSettings) returns `false` for managed sources

This enables enterprise deployments to enforce a fixed set of permission rules that users cannot override.

---

## 11. Integration Points

### Where toolPermissionContext is Read

| Consumer | Symbol | Location | What it reads |
|----------|--------|----------|---------------|
| Main permission check | BYz | chunks.172.mjs:2715 | `.mode`, all rule maps |
| Bash permission check | Tn8 | chunks.172.mjs:1930 | `.toolPermissionContext` from appState |
| Bash exact rule match | cr6 | chunks.172.mjs:2273 | Rules via CN6 |
| Bash mode-specific check | Vfq | chunks.172.mjs:1461 | `.mode` for bypassPermissions/dontAsk/acceptEdits |
| Tool filtering by mode | Xk8 | chunks.93.mjs:1568 | `.mode` to determine tool availability |
| Sandbox auto-allow | BYz layer 3 | chunks.172.mjs:2729 | `.mode` for sandbox exception |
| Plan mode check | BYz layer 8 | chunks.172.mjs:2752 | `.mode`, `.isBypassPermissionsModeAvailable` |
| Subagent context | chunks.136.mjs | Various | Inherited `toolPermissionContext` for child agents |
| Hook context | LF8 | chunks.175.mjs:2462 | Passed to pre-tool hooks |
| System reminder | chunks.136.mjs:1558 | `.mode` read for permission mode state |

### Where toolPermissionContext is Written

| Writer | Symbol | Location | What it modifies |
|--------|--------|----------|-----------------|
| Settings reload | U84 | chunks.172.mjs:2829 | Full replacement of file-based sources |
| User approval | Ez via `addRules` | chunks.53.mjs:1224 | Adds `"session"` rules on user approval |
| Mode toggle | Ez via `setMode` | chunks.53.mjs:1226 | Changes `.mode` |
| CLI initialization | _v | chunks.53.mjs:1296 | Batch-applies CLI arg rules |
| Rule deletion (UI) | SMq | chunks.172.mjs:2778 | Removes individual rules |
| Hook permission override | chunks.149.mjs:1753 | Applies hook-provided permission actions |
