# `MCP_CONNECTION_NONBLOCKING` + Bounded `--mcp-config` Waits

**Versions:** 2.1.89 (introduced) · 2.1.105 (companion fix for first-turn tools missing in headless)

## Summary

Two related concerns about MCP connection latency in **headless / `-p` mode**:

1. A `claude -p "summarize this PR"` invocation that connects to N MCP servers must wait for every connection before issuing the first prompt. If one server is unresponsive, the whole session stalls.
2. Even healthy MCP servers add 100-500 ms per connection. For a quick `claude -p` invocation, that overhead is a meaningful fraction of total wall time.

v2.1.89 added two knobs:

- **`MCP_CONNECTION_NONBLOCKING=true`** (env var, only honored in `-p` mode) — fire-and-forget the entire MCP-connect dance; the first turn proceeds without waiting at all. Tools may not be registered yet; the session continues to register them in the background as connections complete.
- **5-second bounded wait** (`ze8 = 5000`) on `--mcp-config` servers — even without the env var, a connection that hasn't settled in 5 seconds doesn't block the first turn; the session proceeds, and the background connection continues.

The dual fix shipped in v2.1.105: "Fixed MCP tools missing on the first turn of headless/remote-trigger sessions when MCP servers connect asynchronously." That patch ensures the first turn *waits* on a bounded basis if it explicitly needs a tool from a connecting MCP, rather than dispatching with an incomplete tool list.

## Files Involved

| Version | Path | Lines | What |
|---------|------|------:|------|
| v2.1.88 | (no analogue) | — | Connect-all-then-proceed; no env knob |
| v2.1.112 | `chunks.217.mjs` | 1427-1445 | `createMcpConnector` (`EH5`) — top-level connect, gates on env var |
| v2.1.112 | `chunks.217.mjs` | 1447-1475 | `connectMcpBatch` (`yH5`) — kicks off connects, registers `pending` clients |
| v2.1.112 | `chunks.217.mjs` | 1513-1534 | `awaitOrSkipMcpConnections` (`NH5`) — 5 s deadline OR fully async |
| v2.1.112 | `chunks.217.mjs` | 1586 | `ze8 = 5000` (MCP_CONNECTION_DEADLINE_MS) |
| v2.1.112 | `chunks.220.mjs` | 1604 | `mcpNonBlocking: S6(process.env.MCP_CONNECTION_NONBLOCKING)` — telemetry flag |
| v2.1.112 | `chunks.161.mjs` | 2220-2231 | `awaitWithDeadline` (`VRK`) — the deadline-vs-promise race primitive |
| v2.1.112 | `chunks.159.mjs` | 1432, 1515 | secondary `MCP_CONNECTION_NONBLOCKING` consumer + log message |

## The Connect-Or-Skip Decision

```javascript
// ============================================
// createMcpConnector - top-level entry, returns connect() callback
// Location: chunks.217.mjs:1427-1445
// ============================================

// ORIGINAL (for source lookup):
function EH5(q) {
    let { regularMcpConfigs: K, claudeaiConfigPromise: _, state: z } = q,
        Y = S6(process.env.MCP_CONNECTION_NONBLOCKING);
    async function A() {
        await NH5(Y, yH5(K, "regular", z), "--mcp-config servers");
        let O = _.then((w) => OJA({ claudeaiConfigs: w, regularMcpConfigs: K, state: z }));
        await NH5(Y, O, "claude.ai connectors")
    }
    return { connect: A }
}

// READABLE (for understanding):
function createMcpConnector({ regularMcpConfigs, claudeaiConfigPromise, state }) {
    const nonBlocking = parseBoolean(process.env.MCP_CONNECTION_NONBLOCKING);

    async function connect() {
        // First batch: --mcp-config servers (stdio/sse/http/sdk)
        await awaitOrSkipMcpConnections(
            nonBlocking,
            connectMcpBatch(regularMcpConfigs, "regular", state),   // returns Promise<void>[]
            "--mcp-config servers"
        );

        // Second batch: claude.ai connectors (after their config promise resolves)
        const claudeaiConnect = claudeaiConfigPromise.then((claudeaiConfigs) =>
            connectClaudeaiPlusPlugins({ claudeaiConfigs, regularMcpConfigs, state })
        );
        await awaitOrSkipMcpConnections(
            nonBlocking,
            claudeaiConnect,
            "claude.ai connectors"
        );
    }

    return { connect };
}

// Mapping: EH5→createMcpConnector, NH5→awaitOrSkipMcpConnections, yH5→connectMcpBatch,
//          OJA→connectClaudeaiPlusPlugins, S6→parseBoolean, Y→nonBlocking
```

```javascript
// ============================================
// awaitOrSkipMcpConnections - the core decision: skip entirely vs bounded wait
// Location: chunks.217.mjs:1513-1534
// ============================================

// ORIGINAL (for source lookup):
async function NH5(q, K, _) {
    if (q) {
        Promise.resolve(K).catch(() => {}),
        E(`[MCP] ${_} running fully async (MCP_CONNECTION_NONBLOCKING)`);
        return
    }
    let z = Date.now(), Y;
    if (Array.isArray(K)) Y = K;
    else {
        let w, $ = await Promise.race([K, new Promise((j) => {
            w = setTimeout((H) => H("deadline"), ze8, j)
        })]);
        if (clearTimeout(w), $ === "deadline") {
            K.catch(() => {}),
            E(`[MCP] ${_} not ready after ${ze8}ms — proceeding; background connection continues`);
            return
        }
        Y = $
    }
    let A = Math.max(0, ze8 - (Date.now() - z)),
        O = await VRK(Y, A);
    if (O > 0) E(`[MCP] ${_}: ${O}/${Y.length} not ready after ${ze8}ms — proceeding; background connection continues`)
}

// READABLE (for understanding):
async function awaitOrSkipMcpConnections(nonBlocking, connectPromiseOrArray, label) {
    // BRANCH 1: nonblocking → detach & return immediately
    if (nonBlocking) {
        Promise.resolve(connectPromiseOrArray).catch(() => {});   // ← Swallow unhandled rejection
        log(`[MCP] ${label} running fully async (MCP_CONNECTION_NONBLOCKING)`);
        return;
    }

    // BRANCH 2: bounded wait (default behavior)
    const startTime = Date.now();
    let perServerPromises;

    if (Array.isArray(connectPromiseOrArray)) {
        // The connect already returned per-server promises (the "regular" batch flow)
        perServerPromises = connectPromiseOrArray;
    } else {
        // The connect is a single Promise (the "claudeai" batch flow)
        // — race it against a 5s deadline timer
        let timer;
        const deadlineSentinel = "deadline";
        const result = await Promise.race([
            connectPromiseOrArray,
            new Promise((resolve) => {
                timer = setTimeout((cb) => cb(deadlineSentinel), MCP_CONNECTION_DEADLINE_MS, resolve);
            }),
        ]);
        clearTimeout(timer);

        if (result === deadlineSentinel) {
            // Outer promise didn't settle in 5s → swallow its rejection and proceed
            connectPromiseOrArray.catch(() => {});
            log(`[MCP] ${label} not ready after ${MCP_CONNECTION_DEADLINE_MS}ms — proceeding; background connection continues`);
            return;
        }
        // Outer promise produced the per-server promise array
        perServerPromises = result;
    }

    // PER-SERVER DEADLINE: count how many didn't settle in (5s - elapsed)
    const remainingMs = Math.max(0, MCP_CONNECTION_DEADLINE_MS - (Date.now() - startTime));
    const unsettledCount = await awaitWithDeadline(perServerPromises, remainingMs);
    if (unsettledCount > 0) {
        log(`[MCP] ${label}: ${unsettledCount}/${perServerPromises.length} not ready after ${MCP_CONNECTION_DEADLINE_MS}ms — proceeding; background connection continues`);
    }
}

// Mapping: NH5→awaitOrSkipMcpConnections, q→nonBlocking, K→connectPromiseOrArray,
//          _→label, ze8→MCP_CONNECTION_DEADLINE_MS (5000), VRK→awaitWithDeadline,
//          E→log
```

```javascript
// ============================================
// awaitWithDeadline - count non-settled promises in a deadline window
// Location: chunks.161.mjs:2220-2231
// ============================================

// ORIGINAL (for source lookup):
async function VRK(q, K) {
    if (q.length === 0) return 0;
    let _, z = new Promise((Y) => { _ = setTimeout((A) => A("deadline"), K, Y) });
    try {
        let Y = await Promise.all(q.map((A) => Promise.race([A.then(() => "settled", () => "settled"), z])));
        return w7(Y, (A) => A === "deadline")
    } finally {
        clearTimeout(_)
    }
}

// READABLE (for understanding):
async function awaitWithDeadline(promises, deadlineMs) {
    if (promises.length === 0) return 0;
    let timer;
    const deadlineSentinel = new Promise((resolve) => {
        timer = setTimeout((cb) => cb("deadline"), deadlineMs, resolve);
    });
    try {
        const results = await Promise.all(
            promises.map((p) =>
                Promise.race([
                    p.then(() => "settled", () => "settled"),    // ← coerce both fulfilled and rejected to "settled"
                    deadlineSentinel
                ])
            )
        );
        return countMatching(results, (r) => r === "deadline");
    } finally {
        clearTimeout(timer);
    }
}

// Mapping: VRK→awaitWithDeadline, q→promises, K→deadlineMs, _→timer, z→deadlineSentinel,
//          w7→countMatching
```

## How the Flow Composes

**`MCP_CONNECTION_NONBLOCKING=true` mode:**
1. `createMcpConnector` returns a `connect` callback.
2. The session calls `await connect()`. It returns *immediately* — both batches are detached.
3. The first prompt is dispatched without waiting. The tool list at dispatch time includes only servers that have already settled (likely zero).
4. As background connects settle, their `pending` client entries transition to `connected`, and the next turn sees more tools.

**Default 5-second-deadline mode:**
1. `createMcpConnector` returns the same `connect` callback.
2. The session calls `await connect()`. The function tries to settle within 5 seconds:
   - The "regular" batch (`connectMcpBatch`) registers each MCP server as `pending` in app state, kicks off per-server connect promises, and returns the array of those promises *immediately* without awaiting them. `awaitOrSkipMcpConnections` then per-server waits up to (5s − elapsed) for each one.
   - The "claudeai" batch returns a single outer promise (waits for the config promise to resolve, *then* connects). The race-with-deadline branch handles this.
3. If any server hasn't settled in 5 seconds, a log line announces it: `not ready after 5000ms — proceeding; background connection continues`. The session continues; the connection finishes later.

**Per-server vs outer promise race:** Note the two branches in `awaitOrSkipMcpConnections`: the "array" branch (regular batch) and the "single promise" branch (claudeai batch). The reason is the claudeai outer promise *first* resolves a config (which itself takes time over the network) before the per-server connects can even start. We don't want to spend 5 seconds inside the config fetch alone — so we race the outer promise. Once it settles into the per-server array, the remaining budget (`5s - elapsed`) applies per-server.

## Why This Approach

**Why an env var instead of a CLI flag:** `MCP_CONNECTION_NONBLOCKING=true` is set by the CI harness or the wrapper script, not invoked per-command. Putting it in env means a long-lived MCP-skipping shell or a one-line addition to `~/.bashrc` for development. A flag like `--mcp-nonblocking` would have to be wired through `claude -p`, `claude --no-tui`, etc. — every entry point.

**Why only `-p` mode honors it:** Interactive sessions expect tools to be ready when the user starts typing. The user typing a prompt that needs an MCP tool, only to have the prompt execute before the tool is registered, is a confusing error. Headless `-p` mode is more often run by scripts that either don't need MCP tools at all, or that can re-run on failure.

**Why 5 seconds:** Healthy MCP connections finish in well under a second (stdio: tens of ms; SSE/HTTP: 100-500 ms; sdk: tens of ms). 5 seconds is generous for any working server but bounded for any sick one. The MCP_TIMEOUT env var (default 30 000 ms) governs individual *requests* once connected; that's a different (longer) budget for slow tool calls.

**Why "fire-and-forget but swallow rejection":** `Promise.resolve(K).catch(() => {})` deliberately attaches an empty catch. If the connect promise eventually rejects (e.g. server returns 500), an unhandled rejection would crash the Node process. The empty catch is required hygiene for any detached promise.

**Why count `"settled"` for both fulfilled and rejected:** A connection that *failed* in less than 5 seconds counts as having an answer — the answer is "this server is failed." The session should not wait further on a known-failed server. Only servers that *haven't responded yet* count as the bound budget being relevant.

**Why does `awaitWithDeadline` return a count, not boolean:** The log message reports `${O}/${Y.length} not ready` — i.e. "8/15 servers didn't make the 5-second cut." This gives users visibility into how stalled their MCP fleet is, which is valuable diagnostic info for tuning the env var or trimming dead servers.

**Trade-off with the v2.1.105 first-turn fix:** Once tools can be missing on the first turn (because of nonblocking + async connect), a headless session that *needs* a specific MCP tool would silently fail with "tool not found." The 2.1.105 fix added a different mechanism: when the first turn explicitly requires a tool from a still-connecting MCP, it waits (bounded). This is the dual of nonblocking — both are about timing, but one says "skip the wait globally" and the other says "wait inline if you actually need it."

**Edge case: a server in `pending` state when a tool call dispatches:** The tool call resolves to a `pending` client, sees no `connected` status, throws `"MCP server is not connected"` (via `requireConnectedMcpClient` / `Fy6`). The model receives an error, can re-try. With nonblocking enabled, the second try often succeeds because the connection has settled in the interim.

**Edge case: nonblocking + bounded retries (`AJA`/`retryFailedRemoteMcp`):** Servers that fail in nonblocking mode still get the standard backoff retry (`zJA = [500, 1500, 4000]` ms). The retries run on the background, so they don't slow the user-facing turn loop.

**Key insight:** The pattern is "guaranteed bounded latency at the cost of possibly-incomplete tool registration on the first turn." This is the same trade-off the [v2.1.97 NO_FLICKER renderer](../by_version/v2.1.96-97.md) makes for screen updates: bounded UI latency at the cost of occasionally-stale rendering. The pattern recurs throughout Claude Code: prefer responsiveness to completeness in headless / startup paths, and recover via retries / background completion.

## Related Symbols

See [`symbol_additions_unit_14.md`](../00_overview/symbol_additions_unit_14.md) section "Module: MCP — Connection Manager & Nonblocking".

Key entities:
- `createMcpConnector` (`EH5`, chunks.217.mjs:1427-1445) - top-level entry
- `connectMcpBatch` (`yH5`, chunks.217.mjs:1447-1475) - per-server kick-off
- `awaitOrSkipMcpConnections` (`NH5`, chunks.217.mjs:1513-1534) - the gate function
- `awaitWithDeadline` (`VRK`, chunks.161.mjs:2220-2231) - generic deadline-race primitive
- `MCP_CONNECTION_DEADLINE_MS` (`ze8`, = 5000) - the bounded wait constant
- `MCP_REMOTE_RETRY_BACKOFFS` (`zJA`, = `[500, 1500, 4000]`) - retry backoffs for failed remote MCPs
- `MCP_REMOTE_RETRY_TYPES` (`YJA`, = `Set(["http","sse","claudeai-proxy"])`) - retry-eligible types
- `parseBoolean` (`S6`) - the env-var-to-bool parser
- `retryFailedRemoteMcp` (`AJA`, chunks.217.mjs:1477-1511) - background retry orchestrator
