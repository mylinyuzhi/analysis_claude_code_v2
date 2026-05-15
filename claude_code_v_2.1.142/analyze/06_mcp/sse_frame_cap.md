# 16 MB SSE Frame Cap and Bounded Memory at Transport Edges

**Versions:** 2.1.132 (stdio non-protocol stdout cap), 2.1.139 (HTTP/SSE 16 MB frame cap)

## Summary

The v2.1.112 baseline (`sse_buffer_leak.md`) fixed a leak: the SSE parser was accumulating bytes indefinitely while waiting for a frame delimiter. The fix made the accumulator forward complete frames as soon as they arrived. That works **as long as the server is well-behaved** — i.e., sends discrete frames.

A misbehaving server can still pathologically grow Claude Code's memory by:
1. **(stdio)** Writing **non-protocol data to stdout** (logs, progress dumps) without any newline boundary — the JSON-RPC framer waits for `\n` and keeps buffering bytes forever.
2. **(HTTP/SSE)** Streaming **non-protocol data inside a single SSE frame** — same problem at the SSE-event layer.

v2.1.132 fixes (1) with a 16 MB cap on stdio stdout *between* newlines. v2.1.139 fixes (2) with the same cap on HTTP/SSE bodies *between* SSE event boundaries (the `\n\n` separator). When either cap is exceeded, the transport closes with a descriptive error: "wrote >XMB to stdout without a JSON-RPC message boundary" (stdio) or "streamed >XMB without an SSE event boundary" (HTTP/SSE).

## Files Involved

| Version | Path | Lines | What |
|---------|------|------:|------|
| v2.1.112 | (no equivalent) | — | No upper-bound on stdio read buffer or SSE body bytes |
| v2.1.142 | `cli_inner_pretty.js` | **412112** | `MCP_FRAME_OVERFLOW_BYTES` (`rI6`, = 16777216 = 16 MB) |
| v2.1.142 | `cli_inner_pretty.js` | **412074-412110** | `BoundedReadBuffer` (`_$4`) — stdio buffer with overflow callback |
| v2.1.142 | `cli_inner_pretty.js` | **412118-412124** | `StdoutOverflowError` (`CP$`) class |
| v2.1.142 | `cli_inner_pretty.js` | **412126-412134** | `BoundedStdioClientTransport` (`bP$`) — wires up the bounded buffer |
| v2.1.142 | `cli_inner_pretty.js` | **412136-412161** | `wrapSseBodyOverflowGuard` (`xrH`) factory — transform stream for HTTP/SSE |
| v2.1.142 | `cli_inner_pretty.js` | **412181** | `L15 = rI6` — re-export of the cap for the HTTP wrapper |
| v2.1.142 | `cli_inner_pretty.js` | **412182-412189** | `HttpBodyOverflowError` (`A$4`) class |
| v2.1.142 | `cli_inner_pretty.js` | 414316 | `if (f.length < 67108864)` — 64 MB stderr accumulation cap |
| v2.1.142 | `cli_inner_pretty.js` | 414202, 414206, 414230, 414259, 414280 | `xrH(...)` applied to HTTP/SSE fetch wrappers |

## Constants

```javascript
// ============================================
// MCP transport byte caps
// Location: cli_inner_pretty.js:412112, 412181
// ============================================

// ORIGINAL (for source lookup):
var rI6 = 16777216, /* 16 MB */
  CP$,
  bP$;
// ...
L15 = rI6;

// READABLE (for understanding):
const MCP_FRAME_OVERFLOW_BYTES = 16 * 1024 * 1024;   // 16 MB stdio + SSE cap
const MCP_SSE_FRAME_CAP_BYTES  = MCP_FRAME_OVERFLOW_BYTES;  // alias for SSE-specific use

// Mapping: rI6→MCP_FRAME_OVERFLOW_BYTES, L15→MCP_SSE_FRAME_CAP_BYTES
```

There's also the 64 MB inline-literal cap on stderr accumulation:

```javascript
// In the stdio spawn handler (cli_inner_pretty.js:414316):
if (f.length < 67108864)
    try { f += S.toString(); } catch {}

// READABLE: cap stderr collection at 64 MB (= 67108864 bytes)
const MCP_STDERR_BUFFER_BYTES = 64 * 1024 * 1024;
```

## Bounded read buffer (stdio)

```javascript
// ============================================
// BoundedReadBuffer - stdio read accumulator with byte cap
// Location: cli_inner_pretty.js:412074-412110
// ============================================

// ORIGINAL (for source lookup):
class _$4 {
  capBytes;
  onOverflow;
  chunks = [];
  byteLength = 0;
  overflowed = !1;
  overflowThrown = !1;
  constructor(H, $) {
    this.capBytes = H;
    this.onOverflow = $;
  }
  append(H) {
    if (this.overflowed) return;
    if (this.byteLength + H.length > this.capBytes) {
      ((this.chunks = []), (this.byteLength = 0), (this.overflowed = !0), this.onOverflow(new CP$(this.capBytes)));
      return;
    }
    (this.chunks.push(H), (this.byteLength += H.length));
  }
  readMessage() {
    if (this.overflowed) {
      if (this.overflowThrown) return null;
      throw ((this.overflowThrown = !0), new CP$(this.capBytes));
    }
    if (this.chunks.length === 0) return null;
    let H = this.chunks.at(-1),
      $ = H.indexOf(10);   // 10 = '\n'
    if ($ === -1) return null;
    let q = this.chunks.length === 1 ? H : Buffer.concat(this.chunks),
      K = q.length - H.length + $,
      _ = q.toString("utf8", 0, K).replace(/\r$/, ""),
      A = q.subarray(K + 1);
    return ((this.chunks = A.length > 0 ? [A] : []), (this.byteLength = A.length), lR8(_));
  }
  clear() {
    ((this.chunks = []), (this.byteLength = 0));
  }
}

// READABLE (for understanding):
class BoundedReadBuffer {
    capBytes;            // configured max
    onOverflow;          // callback invoked once when cap is exceeded
    chunks = [];         // array of Buffer chunks awaiting framing
    byteLength = 0;      // running total of chunk byte lengths
    overflowed = false;  // sticky: once true, the buffer is in fail state
    overflowThrown = false;

    constructor(capBytes, onOverflowCallback) {
        this.capBytes = capBytes;
        this.onOverflow = onOverflowCallback;
    }

    /**
     * Append a chunk read from stdio.
     * On overflow: discard accumulated chunks, mark overflowed, invoke callback once.
     * Subsequent append() calls are silent no-ops (caller will see the transport close).
     */
    append(chunk) {
        if (this.overflowed) return;
        if (this.byteLength + chunk.length > this.capBytes) {
            this.chunks = [];
            this.byteLength = 0;
            this.overflowed = true;
            this.onOverflow(new StdoutOverflowError(this.capBytes));
            return;
        }
        this.chunks.push(chunk);
        this.byteLength += chunk.length;
    }

    /**
     * Read the next newline-delimited JSON-RPC message from the buffered chunks.
     * Returns null if no complete message is available yet.
     * Throws StdoutOverflowError exactly once after overflow.
     */
    readMessage() {
        // Sticky overflow: throw the error exactly once, then return null on subsequent calls.
        if (this.overflowed) {
            if (this.overflowThrown) return null;
            this.overflowThrown = true;
            throw new StdoutOverflowError(this.capBytes);
        }

        if (this.chunks.length === 0) return null;

        // Look for newline in the LAST chunk (most recent bytes; older chunks didn't have one).
        const lastChunk = this.chunks.at(-1);
        const newlineInLast = lastChunk.indexOf(10);  // 10 = '\n'
        if (newlineInLast === -1) return null;

        // Found a newline — assemble all chunks and slice up to the newline position.
        const joined = this.chunks.length === 1 ? lastChunk : Buffer.concat(this.chunks);
        const newlineGlobalIndex = joined.length - lastChunk.length + newlineInLast;
        const messageText = joined.toString("utf8", 0, newlineGlobalIndex).replace(/\r$/, "");
        const leftoverAfterNewline = joined.subarray(newlineGlobalIndex + 1);

        // Reset chunks to only the bytes after this message.
        this.chunks = leftoverAfterNewline.length > 0 ? [leftoverAfterNewline] : [];
        this.byteLength = leftoverAfterNewline.length;

        return parseJsonRpcMessage(messageText);  // throws if not valid JSON-RPC
    }

    clear() {
        this.chunks = [];
        this.byteLength = 0;
    }
}

// Mapping: _$4→BoundedReadBuffer, H→capBytes (constructor), $→onOverflowCallback,
//          H→chunk (append), CP$→StdoutOverflowError, lR8→parseJsonRpcMessage
```

## StdoutOverflowError

```javascript
// ============================================
// StdoutOverflowError - error class for stdio overflow
// Location: cli_inner_pretty.js:412118-412124
// ============================================

// ORIGINAL (for source lookup):
CP$ = class CP$ extends Error {
    constructor(H) {
      super(
        `wrote >${Math.round(H / 1024 / 1024)}MB to stdout without a JSON-RPC message boundary. The server is likely writing logs or other non-protocol data to stdout instead of stderr. Disconnecting to prevent unbounded memory growth.`,
      );
      this.name = "StdoutOverflowError";
    }
};

// READABLE (for understanding):
class StdoutOverflowError extends Error {
    constructor(capBytes) {
        super(
            `wrote >${Math.round(capBytes / 1024 / 1024)}MB to stdout without a JSON-RPC message boundary. ` +
            `The server is likely writing logs or other non-protocol data to stdout instead of stderr. ` +
            `Disconnecting to prevent unbounded memory growth.`
        );
        this.name = "StdoutOverflowError";
    }
}

// Mapping: CP$→StdoutOverflowError, H→capBytes
```

The error message is **actionable**: it tells the user *what to fix* (move logs to stderr) and *why we're disconnecting* (prevent OOM).

## How the stdio transport uses the bounded buffer

```javascript
// ============================================
// BoundedStdioClientTransport - wires the bounded buffer into the standard transport
// Location: cli_inner_pretty.js:412126-412134
// ============================================

// ORIGINAL (for source lookup):
bP$ = class bP$ extends RY6 {
    overflowError;
    constructor(H) {
      super(H);
      this._readBuffer = new _$4(rI6, ($) => {
        ((this.overflowError = $), queueMicrotask(() => void this.close()));
      });
    }
};

// READABLE (for understanding):
class BoundedStdioClientTransport extends BaseStdioClientTransport {
    overflowError;

    constructor(options) {
        super(options);
        // Replace the parent class's unbounded buffer with a bounded one.
        // On overflow: capture the error and asynchronously close the transport.
        this._readBuffer = new BoundedReadBuffer(MCP_FRAME_OVERFLOW_BYTES, (overflowError) => {
            this.overflowError = overflowError;
            queueMicrotask(() => void this.close());
        });
    }
}

// Mapping: bP$→BoundedStdioClientTransport, RY6→BaseStdioClientTransport,
//          _$4→BoundedReadBuffer, rI6→MCP_FRAME_OVERFLOW_BYTES, H→options
```

The `queueMicrotask` defers `close()` to the next tick so the `append()` call that triggered the overflow can finish unwinding before transport teardown begins. Without it, `close()` would synchronously try to terminate the spawn while the caller is still inside the data event handler — fine in practice but a stylistic anti-pattern.

## HTTP/SSE body cap

```javascript
// ============================================
// sseBodyOverflowTransformStream - TransformStream that aborts on non-SSE-bounded body
// Location: cli_inner_pretty.js:412136-412161
// ============================================

// ORIGINAL (for source lookup):
function P15(H) {
  let $ = 0,
    q = 0,
    K = !1;
  return new TransformStream({
    transform(_, A) {
      let z = -1;
      for (let Y = 0; Y < _.length; Y++) {
        let f = _[Y];
        if (K && f === 10) {
          K = !1;
          continue;
        }
        if (((K = !1), f === 10 || f === 13)) {
          if (q === 0) z = Y;
          ((q = 0), (K = f === 13));
        } else q++;
      }
      if ((($ = z >= 0 ? _.length - 1 - z : $ + _.length), $ > H)) {
        A.error(new A$4(H));
        return;
      }
      A.enqueue(_);
    },
  });
}

// READABLE (for understanding):
function sseBodyOverflowTransformStream(capBytes) {
    let bytesSinceLastEventBoundary = 0;
    let bytesSinceLastNewline = 0;
    let lastWasCR = false;

    return new TransformStream({
        transform(chunk, controller) {
            // Scan for the most recent "blank line" boundary (LF after a newline, i.e. \n\n
            // or \r\n\r\n in the chunk).
            // An SSE event ends with a blank line — that's our "frame boundary."
            let lastBoundaryIndex = -1;

            for (let i = 0; i < chunk.length; i++) {
                const byte = chunk[i];

                // Handle CRLF: skip the LF after a CR, treat the pair as one newline.
                if (lastWasCR && byte === 10 /* \n */) {
                    lastWasCR = false;
                    continue;
                }

                lastWasCR = false;
                if (byte === 10 /* \n */ || byte === 13 /* \r */) {
                    // If the line just before was empty, this is the SSE event boundary.
                    if (bytesSinceLastNewline === 0) {
                        lastBoundaryIndex = i;
                    }
                    bytesSinceLastNewline = 0;
                    lastWasCR = (byte === 13);  // remember CR so we can skip LF
                } else {
                    bytesSinceLastNewline++;
                }
            }

            // Update the bytes-since-last-boundary counter.
            // - If we found an SSE boundary in this chunk: count bytes after the boundary.
            // - Otherwise: add the entire chunk length (no boundary yet).
            bytesSinceLastEventBoundary = lastBoundaryIndex >= 0
                ? chunk.length - 1 - lastBoundaryIndex
                : bytesSinceLastEventBoundary + chunk.length;

            // If we've buffered more than the cap without an SSE event boundary, abort.
            if (bytesSinceLastEventBoundary > capBytes) {
                controller.error(new HttpBodyOverflowError(capBytes));
                return;
            }

            // Otherwise, forward the chunk untouched. (We do NOT buffer the body ourselves;
            // we just count to detect runaway streams.)
            controller.enqueue(chunk);
        },
    });
}

// Mapping: P15→sseBodyOverflowTransformStream, H→capBytes, $→bytesSinceLastEventBoundary,
//          q→bytesSinceLastNewline, K→lastWasCR, _→chunk, A→controller, z→lastBoundaryIndex,
//          Y→i, f→byte, A$4→HttpBodyOverflowError
```

```javascript
// ============================================
// wrapSseBodyOverflowGuard - applies the transform to a fetch's response body
// Location: cli_inner_pretty.js:412162-412175
// ============================================

// ORIGINAL (for source lookup):
function xrH(H) {
  return async ($, q) => {
    let K = await H($, q);
    if (!K.body || K.body.locked || K.status < 200 || K.status > 599) return K;
    let _ = K.body.pipeThrough(P15(L15)),
      A = new Response(_, { status: K.status, statusText: K.statusText, headers: K.headers });
    return (
      Object.defineProperty(A, "url", { value: K.url }),
      Object.defineProperty(A, "redirected", { value: K.redirected }),
      Object.defineProperty(A, "type", { value: K.type }),
      A
    );
  };
}

// READABLE (for understanding):
function wrapSseBodyOverflowGuard(innerFetch) {
    return async (url, init) => {
        const response = await innerFetch(url, init);

        // Skip wrapping when:
        //   - no body (HEAD response, 204)
        //   - body already consumed elsewhere (we can't pipe through a locked stream)
        //   - status outside HTTP normal range
        if (!response.body || response.body.locked || response.status < 200 || response.status > 599) {
            return response;
        }

        // Pipe the body through the cap-checking transform.
        const cappedBody = response.body.pipeThrough(sseBodyOverflowTransformStream(MCP_SSE_FRAME_CAP_BYTES));

        // Wrap the result back into a Response that preserves all original properties.
        // (new Response() drops url/redirected/type by default — restore them.)
        const wrappedResponse = new Response(cappedBody, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
        Object.defineProperty(wrappedResponse, "url", { value: response.url });
        Object.defineProperty(wrappedResponse, "redirected", { value: response.redirected });
        Object.defineProperty(wrappedResponse, "type", { value: response.type });

        return wrappedResponse;
    };
}

// Mapping: xrH→wrapSseBodyOverflowGuard, H→innerFetch, $→url, q→init,
//          K→response, P15→sseBodyOverflowTransformStream, L15→MCP_SSE_FRAME_CAP_BYTES,
//          _→cappedBody, A→wrappedResponse
```

## Where the guards are applied

The HTTP/SSE fetch is wrapped at every transport-creation site (cli_inner_pretty.js:414202-414280):

```javascript
// SSE transport with OAuth:
fetch: OS6(QI6(xrH(X0H()), u))

// HTTP transport with custom headers:
fetch: xrH(async (F, g) => { /* ... */ })

// Plain HTTP transport:
fetch: xrH(globalThis.fetch)

// claude.ai proxy transport:
let F = q_5(xrH(globalThis.fetch))
```

The layering — `xrH` *inside* the OAuth-wrapping `q_5` or step-up detector `QI6` — means the cap is enforced **before** any further protocol-level interpretation. A 100 MB SSE frame is aborted at the byte-counter, never reaching the SSE parser.

## Why This Approach

### Why 16 MB and not 100 MB or 1 GB

Practical MCP messages are bounded:
- `tools/list` for a server with 100 tools, average tool ~2 KB description: ~200 KB
- A `tools/call` result that's a 5000-line file: ~250 KB
- A `tools/call` returning a base64-encoded 4K screenshot: ~5 MB (worst legitimate case)

16 MB allows ample headroom (3-4× the worst legitimate case) without enabling a server to consume an arbitrary fraction of host RAM. Setting it higher (e.g. 64 MB) would extend the legitimacy envelope but also extend the memory-DoS potential. 16 MB is a defensible compromise.

The choice also aligns with `MAX_RESPONSE_BODY_BYTES` conventions in similar systems (Anthropic's other internal SDKs use ~10-32 MB caps).

### Why two errors (stdio + http) and not one

The two errors have different *user-facing remedies*:

- `StdoutOverflowError`: the fix is "redirect the server's logs from stdout to stderr."
- `HttpBodyOverflowError`: the fix is "ensure the server emits SSE event boundaries (`\n\n`) regularly."

Distinct messages let the user understand the failure shape without inspecting the call stack. The class names are also useful for telemetry filters and integration tests.

### Why TransformStream for HTTP and not a buffered accumulator

The HTTP-side guard is **non-buffering**: it counts bytes-since-last-boundary but forwards each chunk untouched to downstream consumers. The SSE parser can keep parsing in real time. Only on overflow does the transform `error()` the downstream stream — at which point the SDK already has whatever bytes preceded the overflow.

A buffered accumulator approach would defeat the purpose (we'd be buffering the bytes we want to *prevent buffering*). Streaming with sidecar counting is the right pattern.

### Why the stdio guard discards chunks on overflow

When the stdio overflow callback fires:

```javascript
(this.chunks = []), (this.byteLength = 0), (this.overflowed = !0),
this.onOverflow(new StdoutOverflowError(this.capBytes));
```

The chunks array is cleared *before* the callback runs. Why? Because the callback schedules `close()` (via microtask), and close() will eventually try to `clear()` the buffer. If we left the bytes there, the (now-known-bad) data would be discarded twice. Pre-clearing is the cleaner approach.

The HTTP guard doesn't need this dance because the TransformStream-based architecture means the bytes are already streaming through — they're held by the OS pipe and dropped when the transport is torn down. No application-level cleanup needed.

### Trade-off: legitimate large messages now fail hard

A theoretical MCP server emitting a single 32 MB JSON-RPC response (e.g. "return entire database dump as one tool call") is now rejected. The error message ("server writing non-protocol data") is misleading in that edge case. The remedy is to **chunk** the response into multiple smaller messages (which is the right protocol-level practice anyway: large tool outputs should be summarized or paged, not dumped wholesale).

In practice, the user impact is minimal — large dumps are also incompatible with the model's context budget and other internal caps (`maxResultSizeChars`).

### Why 64 MB for stderr (not 16 MB)

The stderr accumulator's purpose is *diagnostic* — when a server fails to start, the stderr buffer is dumped as part of the error message so the user can see what went wrong. 64 MB lets even a verbosely-logging server's startup output be captured intact. Stderr accumulation only matters during *failed startup* (not during steady-state operation), so the larger cap doesn't enable a memory-DoS path.

### Key insight

The pattern across stdio and HTTP/SSE is the same: **detect "no protocol-boundary seen in X bytes," abort with a descriptive error, surface the remedy.** The boundaries are different (`\n` for stdio JSON-RPC vs. `\n\n` for SSE events) but the policy is uniform. The implementation puts each transport's guard at the *byte stream* layer, *before* any protocol-aware code runs — so a malformed stream is rejected before it can corrupt state machines downstream.

## Related Symbols

See [`symbol_additions_v2_1_142_mcp.md`](../00_overview/symbol_additions_v2_1_142_mcp.md) section "Module: MCP — Transport Byte Caps".

Key entities:
- `MCP_FRAME_OVERFLOW_BYTES` (`rI6`, = 16777216, cli_inner_pretty.js:412112)
- `MCP_SSE_FRAME_CAP_BYTES` (`L15`, = 16777216, cli_inner_pretty.js:412181)
- `MCP_STDERR_BUFFER_BYTES` (= 67108864, inlined at cli_inner_pretty.js:414316)
- `BoundedReadBuffer` (`_$4`, cli_inner_pretty.js:412074-412110)
- `BoundedStdioClientTransport` (`bP$`, cli_inner_pretty.js:412126-412134)
- `BaseStdioClientTransport` (`RY6`) — unchanged parent class
- `StdoutOverflowError` (`CP$`, cli_inner_pretty.js:412118-412124)
- `HttpBodyOverflowError` (`A$4`, cli_inner_pretty.js:412182-412189)
- `sseBodyOverflowTransformStream` (`P15`, cli_inner_pretty.js:412136-412161)
- `wrapSseBodyOverflowGuard` (`xrH`, cli_inner_pretty.js:412162-412175)
- `parseJsonRpcMessage` (`lR8`, cli_inner_pretty.js:32794-32796) — unchanged
