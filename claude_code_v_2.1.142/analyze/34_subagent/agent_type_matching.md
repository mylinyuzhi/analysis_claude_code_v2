# Agent-Type Matching — Case/Separator-Insensitive `subagent_type` (v2.1.142)

## TL;DR

v2.1.140 (carried unchanged into 2.1.142) relaxed the Agent tool's `subagent_type` parameter to accept case- AND separator-insensitive values. `"Code Reviewer"`, `"code-reviewer"`, `"CodeReviewer"`, `"code_reviewer"`, even `"Code Reviewer "` (NFKC whitespace), `"code—reviewer"` (em-dash) — all resolve to the same registered agent.

The matcher is implemented as a **two-pass lookup**:

1. **Exact**: scan `allowedAgentTypes`-filtered `activeAgents` for `agent.agentType === requested`. If found, use it.
2. **Normalized fallback**: if the exact lookup misses, normalize the requested name and scan the *unfiltered* `activeAgents` for normalized matches. If exactly one match exists in the allowed set, use it (and emit `tengu_subagent_type_normalized`). If multiple match, emit `tengu_subagent_type_miss` with `ambiguousCount` and throw an "ambiguous" error. If one match is in the **disallowed** set, throw a specific deny-rule error pointing to the rule's source.

The normalization function is short:

```javascript
function normalizeAgentTypeSlug(name) {
  return name.normalize("NFKC")
             .toLowerCase()
             .replace(/[\p{White_Space}\p{Pd}_]+/gu, "");
}
```

Unicode-canonicalize, lowercase, strip out all whitespace characters, all dashes (the entire Unicode "Pd" category — hyphen, en-dash, em-dash, minus, etc.), and underscores.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md) - v2.1.142 subagent subsystem
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md) - v2.1.142 background-agents
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent tool, Subagent)

Key functions in this document:
- `normalizeAgentTypeSlug` (`Zu7`) — NFKC + lowercase + strip whitespace/dashes/underscores (cli_inner_pretty.js:351139-351143)
- `truncateForErrorLabel` (`Y5H`) — bounded substring for error messages (cli_inner_pretty.js, called from 351374)
- `findDenyingPermissionRule` (`WV6`) — locate the permission rule blocking a matched agent
- `filterAgentsByPermission` (`GnH`) — apply `Agent(<type>)` deny rules
- `rememberLastResolutionColor` (`BOH`) — cache requested→canonical color for spinner UI
- Telemetry: `tengu_subagent_type_normalized`, `tengu_subagent_type_miss` (cli_inner_pretty.js:351394, 351379, 351407)

## Where It Lives in the Agent Tool

The flow is in the Agent tool's call handler (cli_inner_pretty.js around 351334-351413), which runs when an `assistant` turn produces a `tool_use` for the Agent tool. After the SendMessage/team-name fast-path (lines 351337-351356), the handler reaches the normal "spawn a fresh agent" branch:

1. `G` = the requested `subagent_type` (defaulted to `at.agentType` (general-purpose) if absent and forking is disabled).
2. `o` = full `activeAgents` array.
3. `$H` = the `allowedAgentTypes` filter (if any).
4. `zH` = the set of agents the caller may *actually* invoke after filtering, after applying permission rules (`GnH`).
5. `_H` = `zH.find(a => a.agentType === G)` — the **fast path**, exact case-sensitive match.
6. **Miss path** kicks in when `!_H`.

```javascript
// ============================================
// resolveSubagentTypeWithFallback - The Agent tool's subagent_type resolution
// Location: cli_inner_pretty.js:351367-351413 (excerpt)
// ============================================

// ORIGINAL (for source lookup):
{
  let o = M.options.agentDefinitions.activeAgents,
    { allowedAgentTypes: $H } = M.options.agentDefinitions,
    zH = GnH($H ? o.filter((YH) => $H.includes(YH.agentType)) : o, L.toolPermissionContext, D7),
    _H = zH.find((YH) => YH.agentType === G);
  if (!_H) {
    let YH = Zu7(G), DH = Y5H(YH, 60),
      OH = zH.map((vH) => vH.agentType),
      GH = new Set(OH),
      TH = YH ? o.filter((vH) => Zu7(vH.agentType) === YH) : [];
    if (TH.length > 1) {
      (d("tengu_subagent_type_miss", { requestedNormalized: DH, availableCount: zH.length, ambiguousCount: TH.length }),
        uH("subagent_launch", "subagent_type_ambiguous"));
      let vH = TH.map((JH) => JH.agentType).filter((JH) => GH.has(JH));
      throw Error(
        `Agent type '${G}' is ambiguous — matches ${TH.map((JH) => (GH.has(JH.agentType) ? JH.agentType : `${JH.agentType} (unavailable)`)).join(", ")}. ${vH.length > 0 ? `Use the exact name: ${vH.join(" or ")}` : `None of these are available. Available agents: ${OH.join(", ")}`}`,
      );
    }
    if (TH.length === 1) {
      let vH = TH[0];
      if (GH.has(vH.agentType)) {
        if (((_H = vH), _H.color)) BOH(G, _H.color);
        d("tengu_subagent_type_normalized", { requestedNormalized: DH, matched: _H.agentType });
      } else {
        let JH = vH.agentType, PH = WV6(L.toolPermissionContext, D7, JH);
        if (PH)
          throw (uH("subagent_launch", "subagent_type_denied"),
            Error(`Agent type '${JH}' has been denied by permission rule '${D7}(${JH})' from ${PH.source}.`));
      }
    }
    if (!_H)
      throw (d("tengu_subagent_type_miss", { requestedNormalized: DH, availableCount: zH.length }),
        uH("subagent_launch", "subagent_type_not_found"),
        Error(`Agent type '${G}' not found. Available agents: ${OH.join(", ")}`));
  }
  v = _H;
}

// READABLE (for understanding):
{
  const allAgents = ctx.options.agentDefinitions.activeAgents;
  const { allowedAgentTypes } = ctx.options.agentDefinitions;
  const allowedFilter = allowedAgentTypes
    ? allAgents.filter((a) => allowedAgentTypes.includes(a.agentType))
    : allAgents;
  const callable = applyToolPermissionFilter(allowedFilter, appState.toolPermissionContext, AGENT_TOOL_NAME);
  let resolved = callable.find((a) => a.agentType === requestedType); // exact match (fast path)

  if (!resolved) {
    const normalizedRequested = normalizeAgentTypeSlug(requestedType);
    const labelForErr        = truncateForErrorLabel(normalizedRequested, 60);
    const callableTypes      = callable.map((a) => a.agentType);
    const callableTypesSet   = new Set(callableTypes);
    const allMatchesNormalized = normalizedRequested
      ? allAgents.filter((a) => normalizeAgentTypeSlug(a.agentType) === normalizedRequested)
      : [];

    if (allMatchesNormalized.length > 1) {
      tlm("tengu_subagent_type_miss", {
        requestedNormalized: labelForErr,
        availableCount: callable.length,
        ambiguousCount: allMatchesNormalized.length,
      });
      bumpErr("subagent_launch", "subagent_type_ambiguous");
      const callableMatches = allMatchesNormalized
        .map((a) => a.agentType)
        .filter((t) => callableTypesSet.has(t));
      throw Error(
        `Agent type '${requestedType}' is ambiguous — matches ` +
        allMatchesNormalized
          .map((a) => callableTypesSet.has(a.agentType) ? a.agentType : `${a.agentType} (unavailable)`)
          .join(", ") + ". " +
        (callableMatches.length > 0
          ? `Use the exact name: ${callableMatches.join(" or ")}`
          : `None of these are available. Available agents: ${callableTypes.join(", ")}`),
      );
    }

    if (allMatchesNormalized.length === 1) {
      const onlyMatch = allMatchesNormalized[0];
      if (callableTypesSet.has(onlyMatch.agentType)) {
        resolved = onlyMatch;
        if (resolved.color) rememberLastResolutionColor(requestedType, resolved.color);
        tlm("tengu_subagent_type_normalized", { requestedNormalized: labelForErr, matched: resolved.agentType });
      } else {
        const blockedType = onlyMatch.agentType;
        const denyRule = findDenyingPermissionRule(appState.toolPermissionContext, AGENT_TOOL_NAME, blockedType);
        if (denyRule) {
          bumpErr("subagent_launch", "subagent_type_denied");
          throw Error(
            `Agent type '${blockedType}' has been denied by permission rule '${AGENT_TOOL_NAME}(${blockedType})' from ${denyRule.source}.`,
          );
        }
      }
    }

    if (!resolved) {
      tlm("tengu_subagent_type_miss", { requestedNormalized: labelForErr, availableCount: callable.length });
      bumpErr("subagent_launch", "subagent_type_not_found");
      throw Error(`Agent type '${requestedType}' not found. Available agents: ${callableTypes.join(", ")}`);
    }
  }
  selectedAgent = resolved;
}

// Mapping: o→allAgents, $H→allowedAgentTypes, zH→callable, _H→resolved, G→requestedType,
//          YH→a/blockedType, DH→labelForErr, OH→callableTypes, GH→callableTypesSet,
//          TH→allMatchesNormalized, vH→onlyMatch/a, JH→a (different scope),
//          PH→denyRule, D7→AGENT_TOOL_NAME, Zu7→normalizeAgentTypeSlug,
//          Y5H→truncateForErrorLabel, WV6→findDenyingPermissionRule,
//          BOH→rememberLastResolutionColor, d→tlm, uH→bumpErr,
//          GnH→applyToolPermissionFilter
```

## The Normalizer Itself

```javascript
// ============================================
// normalizeAgentTypeSlug - Canonicalize subagent_type for tolerant matching
// Location: cli_inner_pretty.js:351139-351143
// ============================================

// ORIGINAL (for source lookup):
function Zu7(H) {
  return H.normalize("NFKC")
          .toLowerCase()
          .replace(/[\p{White_Space}\p{Pd}_]+/gu, "");
}

// READABLE (for understanding):
function normalizeAgentTypeSlug(name) {
  return name
    .normalize("NFKC")        // Unicode canonicalization — folds full-width Latin, combining marks
    .toLowerCase()            // Case fold
    .replace(/[\p{White_Space}\p{Pd}_]+/gu, "");
    //         ^^^^^^^^^^^^^^   strip ALL Unicode whitespace
    //                      ^^^^^^  strip ALL Unicode dash-punctuation (hyphen, en/em dash, minus, ...)
    //                            ^   strip underscore
    //                              + collapse runs greedily
    //                               g global, u Unicode mode
}

// Mapping: Zu7→normalizeAgentTypeSlug, H→name
```

### What This Means in Practice

| Input | After normalize | Matches |
|-------|-----------------|---------|
| `code-reviewer` | `codereviewer` | exact: `code-reviewer` |
| `Code Reviewer` | `codereviewer` | normalized → `code-reviewer` |
| `code_reviewer` | `codereviewer` | normalized → `code-reviewer` |
| `code--reviewer` | `codereviewer` | normalized → `code-reviewer` |
| `code—reviewer` (em-dash) | `codereviewer` | normalized → `code-reviewer` |
| `code　reviewer` (ideographic space) | `codereviewer` | normalized → `code-reviewer` |
| `c o d e R e v i e w e r` | `codereviewer` | normalized → `code-reviewer` |
| `CodeReviewer` | `codereviewer` | normalized → `code-reviewer` |
| `code--reviewer-pro` | `codereviewerpro` | distinct from `code-reviewer` |

The normalization is **lossy in one important direction**: a name like `codereviewer` would *also* normalize to `codereviewer` and collide with `code-reviewer`. That's why the resolver branches on `allMatchesNormalized.length`:

- **1 match** ⇒ accept.
- **>1 match** ⇒ ambiguous, error out with a list.

## Why `\p{Pd}` and not `[-]`?

`\p{Pd}` is the Unicode property "Punctuation, Dash". It covers everything dash-shaped that a user might paste:

| Char | Codepoint | Name |
|------|-----------|------|
| `-` | U+002D | HYPHEN-MINUS |
| `‐` | U+2010 | HYPHEN |
| `‑` | U+2011 | NON-BREAKING HYPHEN |
| `–` | U+2013 | EN DASH |
| `—` | U+2014 | EM DASH |
| `−` | U+2212 | MINUS SIGN |
| `⸺` | U+2E3A | TWO-EM DASH |
| `〜` | U+301C | WAVE DASH |
| `ー` | U+30FC | KATAKANA-HIRAGANA PROLONGED SOUND MARK |
| `﹣` | U+FE63 | SMALL HYPHEN-MINUS |
| `－` | U+FF0D | FULLWIDTH HYPHEN-MINUS |

This is overkill for ASCII identifiers, but it makes pasted names (from chat, from a markdown table, from a document) match without manual ASCII-cleanup. The cost is one extra Unicode property test per character — negligible.

`\p{White_Space}` is similar: matches every Unicode "WS" property char (space, tab, newline, NBSP, em-space, en-space, ideographic space, etc.).

## Why the Two-Pass Filter?

The exact match is over `callable` (permission-filtered). The normalized fallback is over `allAgents` (unfiltered). This asymmetry is **deliberate**:

1. **Performance** — the exact match is the common case. The normalized fallback runs only when a miss occurs, so the cost is paid only by typos.
2. **Better error messages** — by scanning all agents (including disallowed ones), the matcher can distinguish:
   - "no agent of this name" ⇒ `Agent type 'X' not found. Available agents: …`
   - "exists but permission-blocked" ⇒ `Agent type 'X' has been denied by permission rule '<rule>'`

   The first message would suggest checking spelling; the second suggests checking permission settings. Distinguishing these is much more actionable than a generic "not found".
3. **Robust against partial permission filters** — if `allowedAgentTypes` only contains exact names, but the user types a normalized variant, the resolver can still find the canonical name in `allAgents` and **then** check if it's allowed. Without the unfiltered scan, the user would get a misleading "not found" error.

## Ambiguity Resolution

```javascript
if (allMatchesNormalized.length > 1) {
  // ambiguity — emit telemetry and throw
  const callableMatches = allMatchesNormalized
    .map((a) => a.agentType)
    .filter((t) => callableTypesSet.has(t));
  throw Error(
    `Agent type '${requestedType}' is ambiguous — matches ` + ...
  );
}
```

The error message annotates each ambiguous match as either available or `(unavailable)`. **Crucial** when the ambiguity is between an allowed and a disallowed agent — without this, the user might think both options are blocked when only one is.

Example collision: a plugin registers `pr-reviewer` and a project file registers `prreviewer`. A user types `subagent_type: "PR Reviewer"`. Both normalize to `prreviewer`. The error message tells the user *exactly which agentTypes collide*, so they can disambiguate with the un-normalized name.

## Why `--allowedAgentTypes` Filter Doesn't Affect Normalization

The `allowedAgentTypes` array is a *whitelist over canonical agentTypes*. Normalization is a *resolution layer on top*. They serve different needs:

- `allowedAgentTypes` is an enterprise/policy mechanism — administrators want to lock down what subagents are callable.
- Normalization is a usability mechanism — the model often emits non-canonical names.

The order is: **normalize first, then check whitelist**. That way, an admin can write `allowedAgentTypes: ["code-reviewer"]` and the user (or model) typing `"Code Reviewer"` still works without the admin having to enumerate every casing.

## Why The Fast-Path Doesn't Normalize

The fast path is:
```javascript
let _H = zH.find((YH) => YH.agentType === G);
```
Not `Zu7(YH.agentType) === Zu7(G)`. Two reasons:

1. **Performance** — exact equality is one string compare; the normalized compare is two regex applications plus an NFKC pass per agent per query. For the common case (model emits the canonical name), we avoid all that.
2. **Correctness of telemetry** — `tengu_subagent_type_normalized` is *only* emitted in the fallback branch. By making normalization opt-in via the fallback, we get a clean signal of "how often does the model emit a non-canonical name?" without polluting it with exact-match cases.

## Deny-Rule Precedence

A user can configure deny rules in settings like:

```json
{
  "permissions": {
    "deny": ["Agent(experimental-agent)", "Agent(*-internal)"]
  }
}
```

These are evaluated by `filterAgentsByPermission` (`GnH`) which uses `getDenyRuleForAgent` (`WV6`) for each agent in `activeAgents`. If a rule matches, the agent is excluded from the callable list.

When `findDenyingPermissionRule` is called for an error message, it does *not* return just the rule pattern but a structured object `{ source, ... }` where `source` is one of:
- `"userSettings"` — `~/.claude/settings.json`
- `"projectSettings"` — `<repo>/.claude/settings.json`
- `"localSettings"` — `<repo>/.claude/settings.local.json`
- `"policySettings"` — managed settings (enterprise)
- `"plugin"` — a plugin's declared rules
- `"managed"` — pushed via remote-settings

The error message includes `source`, so a user trying `subagent_type: "experimental-agent"` and getting:

> Agent type 'experimental-agent' has been denied by permission rule 'Agent(experimental-agent)' from policySettings.

…knows the rule came from an admin (not their own settings) and can ask appropriate support.

## Telemetry Events

The matcher emits two distinct events:

- `tengu_subagent_type_normalized` — with `requestedNormalized` and `matched`. Counts how many resolutions fell into the normalized path. High volume indicates either the model emitting non-canonical names or users with quirky casing.
- `tengu_subagent_type_miss` — with `requestedNormalized`, `availableCount`, and optionally `ambiguousCount`. Counts failures. A failure mode is either "not found" or "ambiguous".

Both also bump error counters via `bumpErr("subagent_launch", "subagent_type_<reason>")` so failure rates are visible in the success/error dashboards.

## v2.1.140 → v2.1.142 Diff: None

The matcher landed in v2.1.140 and is carried unchanged into v2.1.141 and v2.1.142. The release notes mention nothing about Agent matching after v2.1.140's:

> Improved Agent tool `subagent_type` matching to accept case- and separator-insensitive values (e.g. `"Code Reviewer"` resolves to `code-reviewer`)

So the v2.1.142 behavior is exactly v2.1.140's. No regressions, no extensions.

## Key Decision: Two-Pass Lookup vs Single-Pass Normalize

**What it does:** First-pass exact match, second-pass normalized match.

**Why this approach:**

The natural alternative is a single-pass implementation:

```javascript
const normalized = normalizeAgentTypeSlug(requestedType);
const candidates = callable.filter((a) => normalizeAgentTypeSlug(a.agentType) === normalized);
if (candidates.length === 1) resolved = candidates[0];
else if (candidates.length === 0) /* not found */
else /* ambiguous */
```

The two-pass version:

1. Avoids the per-agent normalize cost in the common case (exact match).
2. Distinguishes "would have matched but for permission" from "would not have matched at all" — only by checking the *unfiltered* list in the second pass.
3. Produces cleaner telemetry (the normalized signal fires only when normalization mattered).

**Trade-off:** Slightly more code than a single-pass implementation. Two scans of the agent list in the miss case (once over filtered, once over unfiltered). For typical agent counts (5-30), this is negligible.

**Key insight:** The matcher is a **3-state decision**, not 2:
- "found and callable" (success)
- "found but not callable" (denied — needs a *specific* error)
- "not found at all" (typo — needs a *different* error)

A single-pass implementation collapses the second two into one. The two-pass implementation preserves the distinction, which is what makes the error messages actionable.

## Cross-References

- **Agent definition loading** — `loadAgentsDir.ts` (TS source) walks `<repo>/.claude/agents/`, `~/.claude/agents/`, and plugin agent paths, building `activeAgents`. The TypeScript `agentType` is set from the frontmatter `name` field if present, else from the basename.
- **`requiredMcpServers` filter** — `filterAgentsByMcpRequirements` runs at session start; an agent missing a required MCP server is dropped from `activeAgents` and is invisible to the matcher.
- **`permissions.deny: ["Agent(<type>)"]`** — settings-level deny rules are checked in `filterAgentsByPermission`. They distinguish from `permissions.deny: ["Agent"]` (which denies the *whole* Agent tool, not specific subagent types).
- **Built-in agents** — `general-purpose`, `Plan`, `Explore`, `claude-guide-agent` are always in `activeAgents` (unless a permission rule blocks them).
