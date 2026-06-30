# `mcp get`/`remove` closest-name suggestion + the retired-tool "MCP server disconnected" fix

> **Type:** NET-NEW (name suggestions) + FIX/net-new guard (retired-tool notice) · **Version:** 2.1.186 · **Module:** `39_mcp/`
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged `(183)`.

## TL;DR

Two unrelated 2.1.186 polish items grouped here because both touch "MCP server X is gone" messaging:

1. **`mcp get`/`mcp remove` on an unknown server name** now suggests the closest configured name (Damerau/OSA edit-distance ≤ 2, including adjacent transpositions), or lists the configured servers (truncated to 8 with "(and N more…)"), instead of a bare "not found". Net-new (`grep -c "No MCP server named"` = `0` in 183).
2. **The misleading "MCP server disconnected" notice on resume** — when resuming an older session whose `deferred_tools_delta` attachments referenced now-**retired** built-in tools (`Frame`/`FrameRead`/`TeamCreate`/`TeamDelete`/`SuggestBackgroundPR`), those tools were reported as "no longer available (their MCP server disconnected)". A new `RETIRED_TOOL_NAMES` skip in the deferred-tools delta producer keeps retired tools out of the "removed" set. Fix via a net-new guard (`grep -c "SuggestBackgroundPR"` = `0` in 183).

> **Drift fixed vs the scout dossier:** the dossier put `mcpGetHandler` at `:613315` and `mcpRemoveHandler` at `:613469` — those are the *login/logout* handler neighbours. The live 193 bundle has `mcpGetHandler` (`f9f`) at **`:611549`** and `mcpRemoveHandler` (`a9f`) at **`:611388`** (a separate module); the `get`/`remove` *command registrations* are at `:613570`/`:613544`. Re-verified by reading the bodies.

---

## 1. `suggestClosestServerName` (`t3o`) + `formatNotFoundWithPending` (`psr`)

**What it does.** Given a typed-but-unknown server name and the set of configured names, returns a single "No MCP server named …" message that is as helpful as possible: a "did you mean" if a near-match exists, an "add one" hint if nothing is configured, or a truncated list of configured servers otherwise.

```javascript
// ============================================
// suggestClosestServerName - fuzzy "did you mean" / truncated list for unknown server
// Location: cli_inner_pretty.js:610416-610429
// ============================================

// ORIGINAL (for source lookup):
function t3o(e, t) {
  let n = [...t].sort(),
    r = fde(e, n.map((a) => ({ name: a })), { maxEditDistance: 2 });
  if (r) return `No MCP server named "${e}". Did you mean "${r}"? Run \`claude mcp list\` to see all.`;
  if (n.length === 0) return `No MCP server named "${e}". Run \`claude mcp add\` to add one.`;
  let o = 8,
    s = n.slice(0, o).join(", "),
    i = n.length > o ? ` (and ${n.length - o} more — run \`claude mcp list\` to see all)` : "";
  return `No MCP server named "${e}". Configured servers: ${s}${i}`;
}

// READABLE (for understanding):
function suggestClosestServerName(typedName, configuredNames) {
  let names = [...configuredNames].sort();
  let closest = fuzzyClosestMatch(typedName, names.map((n) => ({ name: n })), { maxEditDistance: 2 });
  if (closest) return `No MCP server named "${typedName}". Did you mean "${closest}"? Run \`claude mcp list\` to see all.`;
  if (names.length === 0) return `No MCP server named "${typedName}". Run \`claude mcp add\` to add one.`;
  const LIMIT = 8;                                            // show at most 8 configured names inline
  let shown = names.slice(0, LIMIT).join(", ");
  let more = names.length > LIMIT ? ` (and ${names.length - LIMIT} more — run \`claude mcp list\` to see all)` : "";
  return `No MCP server named "${typedName}". Configured servers: ${shown}${more}`;
}

// Mapping: t3o→suggestClosestServerName, e→typedName, t→configuredNames, fde→fuzzyClosestMatch
```

### Fuzzy matcher internals (`fde` + `z5t`)

**What it does:** Finds the closest configured server name/alias to the typed name, bounded by an edit-distance ceiling.

```javascript
// ============================================
// fuzzyClosestMatch - bounded closest match using adjacent-transposition edit distance
// Location: cli_inner_pretty.js:382122-382150
// ============================================

// ORIGINAL (for source lookup):
function fde(e, t, { maxEditDistance: n = 1 } = {}) {
  let r = t.flatMap((i) => [i.name, ...(i.aliases ?? [])]), o, s = n + 1;
  for (let i of r) {
    if (Math.abs(i.length - e.length) > n) continue;
    let a = z5t(e, i);
    if (a < s) ((s = a), (o = i));
  }
  return o;
}
function z5t(e, t) {
  if (e === t) return 0;
  let n = e.length, r = t.length,
    o = Array.from({ length: n + 1 }, (s, i) =>
      Array.from({ length: r + 1 }, (a, l) => (i === 0 ? l : l === 0 ? i : 0)));
  for (let s = 1; s <= n; s++)
    for (let i = 1; i <= r; i++) {
      let a = e[s - 1] === t[i - 1] ? 0 : 1;
      if (((o[s][i] = Math.min(o[s - 1][i] + 1, o[s][i - 1] + 1, o[s - 1][i - 1] + a)),
        s > 1 && i > 1 && e[s - 1] === t[i - 2] && e[s - 2] === t[i - 1]))
        o[s][i] = Math.min(o[s][i], o[s - 2][i - 2] + 1);
    }
  return o[n][r];
}

// READABLE (for understanding):
function fuzzyClosestMatch(typedName, candidates, { maxEditDistance = 1 } = {}) {
  let candidateStrings = candidates.flatMap((candidate) => [candidate.name, ...(candidate.aliases ?? [])]);
  let bestMatch, bestDistance = maxEditDistance + 1;
  for (let candidate of candidateStrings) {
    if (Math.abs(candidate.length - typedName.length) > maxEditDistance) continue;
    let distance = editDistanceWithAdjacentTransposition(typedName, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = candidate;
    }
  }
  return bestMatch;
}
function editDistanceWithAdjacentTransposition(left, right) {
  if (left === right) return 0;
  let rows = left.length, cols = right.length;
  let dp = Array.from({ length: rows + 1 }, (_, row) =>
    Array.from({ length: cols + 1 }, (_, col) => (row === 0 ? col : col === 0 ? row : 0)));
  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= cols; col++) {
      let substitutionCost = left[row - 1] === right[col - 1] ? 0 : 1;
      dp[row][col] = Math.min(
        dp[row - 1][col] + 1,
        dp[row][col - 1] + 1,
        dp[row - 1][col - 1] + substitutionCost,
      );
      if (row > 1 && col > 1 && left[row - 1] === right[col - 2] && left[row - 2] === right[col - 1]) {
        dp[row][col] = Math.min(dp[row][col], dp[row - 2][col - 2] + 1);
      }
    }
  }
  return dp[rows][cols];
}

// Mapping: fde→fuzzyClosestMatch, z5t→editDistanceWithAdjacentTransposition,
//   e→typedName/left, t→candidates/right, n→maxEditDistance, r→candidateStrings, o→bestMatch, s→bestDistance
```

**How it works:**
1. Expand each candidate object to every searchable string: its canonical `name` plus any `aliases`.
2. Keep `bestDistance = maxEditDistance + 1`, so only candidates strictly inside the allowed edit budget can win.
3. Skip candidates whose length difference alone exceeds the allowed edit distance; no insert/delete/substitute/transposition sequence can recover from that cheaply enough.
4. Compute a dynamic-programming distance matrix. Base row/column costs represent inserting or deleting all preceding characters.
5. For each cell, take the cheapest of delete, insert, substitute/match, or one adjacent transposition when the two neighboring characters are swapped.
6. Return the first candidate with the smallest distance. Ties keep the earlier sorted candidate because the update is `distance < bestDistance`, not `<=`.

**Why this approach:**
- It catches the two common CLI typo classes: one missing/extra/wrong character and adjacent-letter swaps (`gihub`→`github`), while the `maxEditDistance: 2` call in `suggestClosestServerName` prevents distant names from producing noisy suggestions.
- The length-difference prefilter is a cheap guard before allocating the dynamic-programming matrix.
- The matcher itself is carryover (`Dct`/`S2t` in 183, `OtH`/`O0$` in 156); the 193-window delta is MCP's new `t3o`/`psr` wrapper that applies it to `mcp get`/`remove` not-found messages.

**Key insight:** This is not plain Levenshtein: the `row-2`/`col-2` branch gives a one-edit cost to adjacent transpositions. That is exactly the typo pattern users make in short server names, and it explains why a small threshold of 2 can still feel useful without suggesting unrelated servers.

**How it works (decision order).**
1. **Fuzzy match first** — `fuzzyClosestMatch` (`fde`) with `maxEditDistance: 2` finds the closest configured name within 2 edits using the adjacent-transposition-aware distance above. A 2-edit ceiling means `githubb`→`github` or `lineaer`→`linear` suggests, but an unrelated typo doesn't produce a noisy false "did you mean". When it hits, that single best name is the whole message — the most actionable possible output.
2. **Empty config** — if nothing is configured, the "did you mean" is meaningless; point the user at `claude mcp add` instead.
3. **Truncated list** — otherwise list up to **8** configured names, then "(and N more — run `claude mcp list` to see all)". Sorting (`[...names].sort()`) makes the truncated list deterministic; the 8-cap keeps the error one line even for a user with dozens of servers, while still pointing at the full list.

**The pending-approval wrapper — `formatNotFoundWithPending` (`psr`, `cli_inner_pretty.js:610430`):** wraps `suggestClosestServerName` and, when there are `.mcp.json` servers *awaiting approval*, appends/substitutes the ".mcp.json servers are awaiting approval — run `claude` in this directory to review them." note — so a user who typed the name of a not-yet-approved project server gets told *why* it isn't visible rather than "no such server".

**Why fuzzy + truncate (not just "not found").** Server names are user-typed in a CLI; typos and half-remembered names are the common failure. Bare "not found" forces a second `claude mcp list` round-trip. Inlining the closest match (or the short list) collapses the recover loop to zero extra commands for the common cases, and the 8-cap + "list to see all" keeps it from becoming a wall of text for power users.

**Callers.**
- `mcpGetHandler` (`f9f`, `cli_inner_pretty.js:611549`) — on not-found returns `printError(formatNotFoundWithPending(typedName, names, pendingCount > 0))` (`:611561`).
- `mcpRemoveHandler` (`a9f`, `cli_inner_pretty.js:611388`) — on not-found returns `printError(suggestClosestServerName(typedName, configuredNames))` (`:611414`).

**183 diff (NET-NEW).** `No MCP server named` = 0 in 183 (193:7). The generic `Did you mean "` exists elsewhere (193:3 / 183:2), but the MCP-specific `suggestClosestServerName`/`formatNotFoundWithPending` helpers and the truncate-at-8 logic are new for get/remove.

---

## 2. The retired-tool "MCP server disconnected" fix — `RETIRED_TOOL_NAMES` (`HBt`) skip in `computeDeferredToolsDelta` (`oko`)

**What it does.** Prevents now-retired built-in tools from being reported as "no longer available (their MCP server disconnected)" when resuming an older session.

**Background.** During a session, the agent receives `deferred_tools_delta` attachments announcing which tools became available/unavailable. The delta producer reconstructs the "previously announced" set from prior attachments, then diffs it against the *current* tool pool: any previously-announced tool that is no longer in the pool is reported as removed — rendered (`:601626`) as *"The following deferred tools are no longer available (their MCP server disconnected). Do not search for them — …"*. When resuming an **old** session, prior attachments may list built-ins that have since been **retired** (`Frame`/`FrameRead`/`TeamCreate`/`TeamDelete`/`SuggestBackgroundPR`), which then incorrectly show up as "disconnected".

```javascript
// ============================================
// RETIRED_TOOL_NAMES + the skip in computeDeferredToolsDelta
// Location: cli_inner_pretty.js:228300 (set), 471037-471053 (producer)
// ============================================

// ORIGINAL (for source lookup):
HBt = new Set(["Frame", "FrameRead", "TeamCreate", "TeamDelete", "SuggestBackgroundPR"]);
// ...
function oko(e, t, n, r) {
  let o = new Set(), s = new Set(), i = [], a = 0, l = 0, c = new Set();
  for (let S of t) {
    if (S.type !== "attachment") continue;
    if ((a++, c.add(S.attachment.type), S.attachment.type !== "deferred_tools_delta")) continue;
    l++;
    let H = new Set(S.attachment.readdedNames ?? []);
    for (let v of S.attachment.addedNames) {
      if (HBt.has(v)) continue;                              // ← NEW: never count retired tools as "announced"
      if ((o.add(v), !H.has(v))) s.add(v);
    }
    for (let v of S.attachment.removedNames) o.delete(v);
    if (S.attachment.pendingMcpServers !== void 0) i = S.attachment.pendingMcpServers;
  }
  // ... o = "previously announced" set; later diffed vs the current pool to produce removedNames ...
}

// READABLE (for understanding):
RETIRED_TOOL_NAMES = new Set(["Frame", "FrameRead", "TeamCreate", "TeamDelete", "SuggestBackgroundPR"]);
function computeDeferredToolsDelta(currentTools, history, ...) {
  let announced = new Set(), newlyAnnounced = new Set(), pendingMcpServers = [];
  for (let entry of history) {
    if (entry.type !== "attachment") continue;
    if (entry.attachment.type !== "deferred_tools_delta") continue;
    let readded = new Set(entry.attachment.readdedNames ?? []);
    for (let name of entry.attachment.addedNames) {
      if (RETIRED_TOOL_NAMES.has(name)) continue;            // ← retired built-ins never enter `announced`
      announced.add(name);
      if (!readded.has(name)) newlyAnnounced.add(name);
    }
    for (let name of entry.attachment.removedNames) announced.delete(name);
    if (entry.attachment.pendingMcpServers !== undefined) pendingMcpServers = entry.attachment.pendingMcpServers;
  }
  // currentTools ∖ announced → still-available; announced ∖ currentPool → "no longer available (MCP server disconnected)"
  // Because retired names never entered `announced`, they can never appear in the "removed" set.
}

// Mapping: HBt→RETIRED_TOOL_NAMES, oko→computeDeferredToolsDelta, t→history, o→announced, s→newlyAnnounced
```

**How the skip fixes it.** The misleading notice arises because a retired name enters the "previously announced" set `announced`, then — being absent from the current tool pool — is pushed into `removedNames` and rendered as a disconnect. `if (RETIRED_TOOL_NAMES.has(name)) continue;` (`:471050`) keeps retired tools **out of `announced`**, so they can never reach `removedNames`, so the "MCP server disconnected" notice never fires for them.

**Second use — the not-found classifier (`:389642`).** `RETIRED_TOOL_NAMES.has(name)` also classifies a tool lookup miss as `"expected-absent"` rather than `"unknown"`, so an internal lookup of a retired name is treated as intentional retirement, not an anomaly.

**Why a name set rather than versioning the attachments.** The retired tools are a small, closed, build-known list. A `Set` membership check at the one chokepoint (the announced-set rebuild) is O(1) and requires no migration of historical session data — old transcripts keep their original `addedNames`, and the producer simply ignores the retired entries. The alternative (rewriting or versioning every saved attachment) would be a far larger change for a cosmetic notice.

**Key insight.** The fix is purely the **guard** — the "disconnected" render strings are byte-identical to 183 (carryover). The bug was never in the message; it was that retired tools were being *counted* as previously-announced-then-removed. One `Set` + one `continue` removes them from that accounting.

**183 diff (FIX / net-new guard).** The 183 producer (`Qgo`, 183 `:462359`) had `for (let T of b.attachment.addedNames) if ((o.add(T), !S.has(T))) s.add(T);` — **no skip**. `HBt`'s values (`SuggestBackgroundPR`, `TeamCreate`/`TeamDelete`) = `0` in 183. The "disconnected" render string is byte-identical (carryover) — the delta is purely the new guard, not a wording change.

> **Scope note.** `RETIRED_TOOL_NAMES`/`computeDeferredToolsDelta` is a cross-cutting *tool-pool* concern (deferred/dynamic tool loading), not strictly MCP. It is documented here because its user-visible symptom is the MCP "server disconnected" notice; the broader dynamic-tool-loading machinery lives in the tools module.

---

## Evidence — NET-NEW / FIX (183 grep-diff)

| String / symbol | 193 | 183 | verdict |
|---|---|---|---|
| `No MCP server named` | 7 | 0 | NET-NEW |
| `suggestClosestServerName` body (truncate-at-8) | `:610416` | absent | NET-NEW |
| `SuggestBackgroundPR` (in `RETIRED_TOOL_NAMES`) | 1 (`:228300`) | 0 | NET-NEW guard |
| `RETIRED_TOOL_NAMES` skip in delta producer | `:471050` | absent (`Qgo` `:462359` had no skip) | FIX |
| `their MCP server disconnected` render | 1 (`:601626`) | 1 | CARRYOVER (message unchanged) |

---

## Cross-links

- Sibling 193 docs: [`mcp_login_logout_cli.md`](./mcp_login_logout_cli.md) (the `get`/`remove` subcommands sit beside the new `login`/`logout` on the `mcp` command), [`headers_helper_reauth.md`](./headers_helper_reauth.md) (needs-auth notice, the *other* MCP "server is gone" surface), [`README.md`](./README.md).

## Related Symbols

> Symbol mappings live in the central index files (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (the deferred-tools delta producer sits on the tool-pool path)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (**MCP** home module)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_193_mcp.md](../00_overview/symbol_additions_v2_1_193_mcp.md) — the granular v2.1.193 MCP additions

Key functions/constants in this document:

- `suggestClosestServerName` (`t3o`, `cli_inner_pretty.js:610416`) — fuzzy "did you mean" + truncate-at-8 list.
- `formatNotFoundWithPending` (`psr`, `cli_inner_pretty.js:610430`) — wraps `t3o` with a pending-`.mcp.json`-approval note.
- `fuzzyClosestMatch` (`fde`) — bounded closest match over name+aliases; `t3o` calls it with `maxEditDistance: 2`.
- `editDistanceWithAdjacentTransposition` (`z5t`) — dynamic-programming edit distance with delete/insert/substitute plus adjacent transposition.
- `mcpGetHandler` (`f9f`, `cli_inner_pretty.js:611549`) — calls `psr` on not-found; `get` command reg `:613570`.
- `mcpRemoveHandler` (`a9f`, `cli_inner_pretty.js:611388`) — calls `t3o` on not-found (`:611414`); `remove` command reg `:613544`.
- `RETIRED_TOOL_NAMES` (`HBt`, `cli_inner_pretty.js:228300`) — `Set(["Frame","FrameRead","TeamCreate","TeamDelete","SuggestBackgroundPR"])`.
- `computeDeferredToolsDelta` (`oko`, `cli_inner_pretty.js:471037`) — announced-set rebuild; retired skip `:471050`; 183 predecessor `Qgo` `:462359` (no skip).
