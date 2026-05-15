# WaitForMcpServers — Block Until Pending MCP Servers Are Ready

> **Tool name:** `WaitForMcpServers`
> **Source:** `cli_inner_pretty.js:271567-271678` (`BO7` declaration)
> **Read-only:** true · **Concurrency-safe:** false

---

## Overview

`WaitForMcpServers` blocks for up to **5 seconds** (`iL_ = 5000` ms) waiting for one or more pending MCP servers to finish connecting. When a user's request needs tools from a still-connecting server, the model calls this tool to wait for it; once the server connects, its tools are added to the tool list and become callable directly.

The tool exists because MCP servers can be slow to start (especially HTTP/SSE remotes with OAuth handshakes), and the model needs a way to **say "wait for this" instead of failing or asking the user to retry**.

---

## Schema

```javascript
// ============================================
// waitForMcpServersInputSchema - rL_ optional names array
// Location: cli_inner_pretty.js:271553-271555
// ============================================

// ORIGINAL (for source lookup):
rL_ = yH(() =>
  y.object({ servers: y.array(y.string()).optional().describe("Server names to wait for (default: all pending)") }),
);

// READABLE (for understanding):
const waitForMcpServersInputSchema = lazySchema(() =>
  z.object({ servers: z.array(z.string()).optional().describe("Server names; omit for all pending") }),
);

// Mapping: rL_→waitForMcpServersInputSchema
```

**Output:** `{ ready, connected[], failed[], stillPending[], needsAuth[], disabled[], unknown[] }` — a per-server status breakdown that exhaustively enumerates the possible end states.

---

## Key Behavior

### Polling loop with 50 ms tick

```javascript
// ============================================
// WaitForMcpServers.call - bounded polling with status classification
// Location: cli_inner_pretty.js:271594-271654
// ============================================

// READABLE (key logic):
async function call(input, context) {
  const refresh = () => context.options.refreshMcpClients?.()
                       ?? context.getMcp?.().clients
                       ?? context.options.mcpClients;
  const requestedNames = input.servers?.length ? input.servers : pendingMcpServerNames();
  const normalizedRequested = new Set(requestedNames.map(normalizeMcpServerName));
  const matching = () => refresh().filter((c) =>
    requestedNames.includes(c.name) || normalizedRequested.has(normalizeMcpServerName(c.name))
  );

  const startedAt = Date.now();
  const deadline = startedAt + WAIT_FOR_MCP_TIMEOUT_MS;  // 5000 ms
  while (matching().some((c) => c.type === "pending") && Date.now() < deadline && !context.abortController.signal.aborted) {
    await sleep(50, context.abortController.signal);
  }

  // Classify each server's final state.
  const buckets = { connected: [], failed: [], stillPending: [], needsAuth: [], disabled: [] };
  for (const client of matching()) buckets[mapTypeToBucket(client.type)].push(client.name);

  // Detect "unknown" — requested names that didn't match ANY client at all.
  const seenSet = new Set(matching().map((c) => normalizeMcpServerName(c.name)));
  const unknown = requestedNames.filter((n) => !seenSet.has(normalizeMcpServerName(n)));

  const ready = buckets.stillPending.length === 0 && buckets.failed.length === 0 &&
                buckets.needsAuth.length === 0 && buckets.disabled.length === 0 &&
                unknown.length === 0;
  return { data: { ready, ...buckets, unknown } };
}
```

### Six status buckets

| Bucket | Meaning | Model action |
|--------|---------|--------------|
| `connected` | Server up, tools available | Call its tools directly |
| `failed` | Connection failed | No retry-from-tool; user must run `/mcp` |
| `stillPending` | Didn't finish in 5 s | Try again later or proceed without |
| `needsAuth` | OAuth required | Ask user to run `/mcp` to authenticate |
| `disabled` | Explicitly disabled in config | Ask user to enable via `/mcp` |
| `unknown` | Name doesn't match any configured server | Probably a typo or removed server |

### Result rendering enumerates each bucket

```javascript
mapToolResultToToolResultBlockParam(H, $) {
  let q = [
    `ready: ${H.ready}`,
    H.connected.length ? `Connected (their tools are now available — call them directly): ${H.connected.join(", ")}` : "",
    H.failed.length ? `Failed to connect: ${H.failed.join(", ")}` : "",
    H.stillPending.length ? `Still connecting (try again or proceed without): ${H.stillPending.join(", ")}` : "",
    H.needsAuth.length ? `Needs authentication (ask the user to run /mcp): ${H.needsAuth.join(", ")}` : "",
    H.disabled.length ? `Disabled (ask the user to enable via /mcp): ${H.disabled.join(", ")}` : "",
    H.unknown.length ? `Unknown (no MCP server with this name is configured): ${H.unknown.join(", ")}` : "",
  ].filter(Boolean);
  return { type: "tool_result", tool_use_id: $, content: q.join("\n"), is_error: !H.ready };
}
```

`is_error: !ready` is the key — the result is *flagged as an error* when ready is false. This routes through normal error-handling paths so the model treats "couldn't wait long enough" as a recoverable failure rather than success.

---

## Key Insights

**Why 5 seconds and not longer?** Tool calls block the conversation. A 30-second wait blocks the user's spinner for 30 seconds with no useful output. 5 seconds is long enough to absorb normal MCP startup latency (stdio: <100ms, HTTP/SSE with OAuth: 1-3s), but short enough that the conversation doesn't stall forever. If 5s isn't enough, the model retries and gets fresh status.

**Why is `isConcurrencySafe: false`?** Multiple concurrent calls would all race on `refreshMcpClients`, potentially triggering redundant reconnects on every poll. Serializing this tool through the registry prevents the herd.

**Why are six end-states distinct?**
- `connected` and `failed` are obvious terminals.
- `stillPending` vs `failed` distinguishes "give it more time" from "give up".
- `needsAuth` and `disabled` both result in "no tools available" but have very different user-side fixes (auth vs config edit). Surfacing them separately gives the model the right message to relay.
- `unknown` catches typos: "I asked for `mywidgets` but the configured name is `my-widgets`" — the prompt-side hint is "did you mean...".

**The 50 ms tick is small enough that the wait feels instant** when the server is just finishing up. A 1 s tick would add up to 1 s of artificial latency to every wait — adding visible spin time even when the answer is "yes, just finished".

**`pendingMcpServerNames()` provides a default.** Omitting `servers` waits for *all* pending servers at once — a useful pattern after `/clear` or session start when many servers are mid-launch. The model doesn't need to enumerate them.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.116:** Faster MCP startup with parallelized stdio server launches reduces typical wait times under the 5s window.
- **v2.1.132:** Fixed MCP servers that connect but fail `tools/list` silently showing 0 tools — they now retry once before being reported as "failed" by WaitForMcpServers.
- **v2.1.142:** `MCP_TOOL_TIMEOUT` fix — but this only affects per-call timeouts on connected servers, not the WaitForMcpServers wait itself (which is bounded by `iL_ = 5000`).

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — MCP*

Key functions in this document:
- `WaitForMcpServersTool` (`BO7`) — declaration with 5 s deadline
- `waitForMcpServersInputSchema` (`rL_`) — optional `servers` array
- `WAIT_FOR_MCP_TIMEOUT_MS` (`iL_`) — `5000`
- `pendingMcpServerNames` (`mO7`) — default-target list
- `normalizeMcpServerName` (`$_`) — case-insensitive name matcher
- `isWaitForMcpServersEnabled` (`UJ6`) — model-tier feature gate
- `buildWaitForMcpServersPrompt` (`Kf6`) — model prompt with "pass servers to wait for specific ones" guidance
