# SDK Outbound Queue Architecture

## Overview

Claude Code uses two distinct queue classes for outbound message delivery, each designed for a different transport layer:

1. **`AsyncQueue`** (`Pi6`, `chunks.145.mjs:2959`) — A lightweight, single-use async-iterable FIFO queue that backs the outbound write channel of `StdioStreamIO` (`so6`). It also serves as the centralized output collection queue in headless (`runHeadless` / `BXz`) execution.

2. **`BatchQueue`** (`Y26`, `chunks.184.mjs:2642`) — A durable, retry-capable batch uploader used by `HybridTransport` (`eo6`) to send telemetry or event payloads to an HTTP POST endpoint in configurable batch sizes with exponential backoff.

The two queues solve fundamentally different problems: `AsyncQueue` is a zero-copy push/pull bridge between a producer and an async consumer within a single process; `BatchQueue` is a resilient network delivery buffer with backpressure, retry logic, and graceful drain semantics.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - SDK transport symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution flow

Key symbols in this document:
- `AsyncQueue` (Pi6) — FIFO async-iterable outbound queue
- `BatchQueue` (Y26) — HTTP batch uploader with retry and backpressure
- `StdioStreamIO` (so6) — Owner of `AsyncQueue` outbound channel
- `runHeadless` (BXz) — Second consumer of `AsyncQueue`
- `HybridTransport` (eo6) — Owner of `BatchQueue` uploader
- `RetryAfterError` (MV6) — Error subclass carrying `retryAfterMs` hint
- `computePostUrl` (uDz) — Converts WebSocket URL to HTTP events URL

---

## Part 1: AsyncQueue (`Pi6`) — StdioStreamIO Outbound Buffer

### What it does

`AsyncQueue` is a push-pull buffer that implements the `AsyncIterator` / `AsyncIterable` protocol. The producer side calls `enqueue(item)` to push messages; the consumer side drives a `for await (const msg of queue)` loop that reads them in FIFO order. A single `done()` call terminates the iterator cleanly; `error(e)` terminates it with a rejection.

### Location

`chunks.145.mjs:2959`

---

### How it works

#### State fields

```javascript
// ============================================
// AsyncQueue - constructor state
// Location: chunks.145.mjs:2959
// ============================================

// ORIGINAL (for source lookup):
class Pi6 {
  constructor() {
    this.queue = [];
    this.readResolve = null;
    this.readReject = null;
    this.isDone = false;
    this.hasError = false;
    this.started = false;
    this.returned = null;
  }
}

// READABLE (for understanding):
class AsyncQueue {
  constructor() {
    this.queue = [];          // FIFO buffer of pending items not yet consumed
    this.readResolve = null;  // Resolve fn of the Promise a waiting consumer holds
    this.readReject = null;   // Reject fn for error delivery to waiting consumer
    this.isDone = false;      // True after done() or return() is called
    this.hasError = false;    // True after error() is called
    this.started = false;     // Guard: prevents second iteration
    this.returned = null;     // Optional callback invoked on return()
  }
}

// Mapping: Pi6→AsyncQueue
```

#### `[Symbol.asyncIterator]()` — single-use guard

```javascript
// ============================================
// AsyncQueue.[Symbol.asyncIterator] - Makes queue iterable; enforces single use
// Location: chunks.145.mjs:~2975
// ============================================

// ORIGINAL (for source lookup):
[Symbol.asyncIterator]() {
  if (this.started) throw new Error("AsyncQueue can only be iterated once");
  this.started = true;
  return this;
}

// READABLE (for understanding):
[Symbol.asyncIterator]() {
  if (this.started) throw new Error("AsyncQueue can only be iterated once");
  this.started = true;
  return this; // 'this' implements next()/return(), so the queue IS the iterator
}

// Mapping: (none — method uses readable names internally)
```

**Why single-use?** The queue is a stateful FIFO pipe. Allowing two concurrent `for await` loops would create a race: both consumers would compete for the same `readResolve` slot, causing one to deadlock permanently. The guard converts a subtle concurrency bug into an explicit, immediate error.

#### `enqueue(item)` — zero-wait delivery when possible

```javascript
// ============================================
// AsyncQueue.enqueue - Delivers item immediately or buffers it
// Location: chunks.145.mjs:~2985
// ============================================

// ORIGINAL (for source lookup):
enqueue(A) {
  if (this.readResolve) {
    let B = this.readResolve;
    this.readResolve = null;
    this.readReject = null;
    B({ value: A, done: false });
  } else {
    this.queue.push(A);
  }
}

// READABLE (for understanding):
enqueue(item) {
  if (this.readResolve) {
    // Consumer is already waiting on next() — deliver directly to its Promise
    let resolve = this.readResolve;
    this.readResolve = null;
    this.readReject = null;
    resolve({ value: item, done: false });
  } else {
    // No consumer waiting — buffer the item
    this.queue.push(item);
  }
}

// Mapping: A→item, B→resolve
```

**Key insight:** When a consumer is already waiting, `enqueue` bypasses the buffer entirely and resolves the consumer's Promise synchronously (within the microtask). This is a standard "rendez-vous" optimization: if producer and consumer are in sync, no allocation or array manipulation is needed.

#### `next()` — the iterator pull method

```javascript
// ============================================
// AsyncQueue.next - Returns next item or waits for one
// Location: chunks.145.mjs:~3010
// ============================================

// ORIGINAL (for source lookup):
next() {
  if (this.queue.length > 0) {
    return Promise.resolve({ value: this.queue.shift(), done: false });
  }
  if (this.isDone) {
    return Promise.resolve({ value: undefined, done: true });
  }
  if (this.hasError) {
    return Promise.reject(this.errorValue);
  }
  return new Promise((resolve, reject) => {
    this.readResolve = resolve;
    this.readReject = reject;
  });
}

// READABLE (for understanding):
next() {
  // Priority 1: buffered items drain first
  if (this.queue.length > 0) {
    return Promise.resolve({ value: this.queue.shift(), done: false });
  }
  // Priority 2: if already terminated, report end-of-stream
  if (this.isDone) {
    return Promise.resolve({ value: undefined, done: true });
  }
  // Priority 3: if error was set, reject the iteration
  if (this.hasError) {
    return Promise.reject(this.errorValue);
  }
  // Priority 4: nothing available — park the consumer until enqueue/done/error
  return new Promise((resolve, reject) => {
    this.readResolve = resolve;
    this.readReject = reject;
  });
}

// Mapping: (uses readable names)
```

**Priority ordering analysis:**

The four-check ordering is deliberate:

1. **Buffer first** — ensures all enqueued items are delivered before end-of-stream is reported. If `done()` were checked before draining the buffer, trailing items would be silently dropped.
2. **Done before error** — if both `isDone` and `hasError` are set (edge case: `done()` then `error()` called), clean termination wins. In practice only one should be called.
3. **Error before park** — prevents the consumer from waiting forever on a queue that already has a terminal error.
4. **Park last** — the common steady-state: producer is slower than consumer, so consumer parks with a Promise until the next `enqueue` or `done`.

#### `done()` — clean termination

```javascript
// ============================================
// AsyncQueue.done - Signals end of stream
// Location: chunks.145.mjs:~3000
// ============================================

// ORIGINAL (for source lookup):
done() {
  this.isDone = true;
  if (this.readResolve) {
    let A = this.readResolve;
    this.readResolve = null;
    this.readReject = null;
    A({ value: undefined, done: true });
  }
}

// READABLE (for understanding):
done() {
  this.isDone = true;
  if (this.readResolve) {
    // Consumer is waiting — wake it up with end-of-stream signal
    let resolve = this.readResolve;
    this.readResolve = null;
    this.readReject = null;
    resolve({ value: undefined, done: true });
  }
  // If no consumer is waiting, next() will see isDone=true on next call
}

// Mapping: A→resolve
```

#### `error(e)` — error propagation

```javascript
// ============================================
// AsyncQueue.error - Propagates error to consumer
// Location: chunks.145.mjs:~3005
// ============================================

// ORIGINAL (for source lookup):
error(A) {
  this.hasError = true;
  this.errorValue = A;
  if (this.readReject) {
    let B = this.readReject;
    this.readResolve = null;
    this.readReject = null;
    B(A);
  }
}

// READABLE (for understanding):
error(err) {
  this.hasError = true;
  this.errorValue = err;
  if (this.readReject) {
    // Consumer is parked — wake it with a rejection
    let reject = this.readReject;
    this.readResolve = null;
    this.readReject = null;
    reject(err);
  }
}

// Mapping: A→err, B→reject
```

#### `return()` — iterator protocol cleanup

```javascript
// ============================================
// AsyncQueue.return - Called when for-await loop is exited early (break/throw)
// Location: chunks.145.mjs:~3020
// ============================================

// ORIGINAL (for source lookup):
return() {
  this.isDone = true;
  if (this.returned) this.returned();
  return Promise.resolve({ value: undefined, done: true });
}

// READABLE (for understanding):
return() {
  this.isDone = true;
  // Fire optional cleanup callback (e.g. close underlying stream)
  if (this.returned) this.returned();
  return Promise.resolve({ value: undefined, done: true });
}

// Mapping: (uses readable names)
```

**Why the `returned` callback?** When `StdioStreamIO` wraps a network or stdio stream, it may need to close that stream when the consumer abandons the iterator (e.g., via `break` in a `for await` loop). The `returned` hook provides an escape hatch without coupling the queue to the transport layer.

---

### Usage in StdioStreamIO (`so6`)

`StdioStreamIO` constructs `outbound = new Pi6()` during initialization. The `write(message)` method calls `outbound.enqueue(message)`, and the transport's outbound runner iterates `for await (const msg of outbound)` to serialize each message to stdout as NDJSON.

**Why a dedicated queue instead of direct writes?** The queue decouples message production (agent loop, tool results, hook events) from serialization and I/O flushing. Multiple producers can safely call `write()` concurrently without coordinating; the FIFO queue preserves ordering automatically.

### Usage in `runHeadless` (`BXz`)

`runHeadless` creates its own `AsyncQueue` instance as a centralized collection point for all output messages emitted during a non-interactive execution. Instead of writing to stdout, each message type (assistant response, tool use, tool result, result summary) is enqueued. The caller then iterates the queue to collect the full message stream for programmatic consumption.

This pattern allows `runHeadless` to be used both as a library (collect all messages into an array) and as a streaming source (yield messages one at a time as they arrive).

---

## Part 2: BatchQueue (`Y26`) — HybridTransport HTTP Batch Uploader

### What it does

`BatchQueue` is a durable, backpressure-aware batch delivery buffer. It accepts individual items (or arrays of items), groups them into batches up to `maxBatchSize`, and forwards each batch to a `send(batch)` function (an HTTP POST). If `send` fails, it retries with exponential backoff. If the queue fills beyond `maxQueueSize`, new `enqueue` calls block (backpressure) until space is available.

### Location

`chunks.184.mjs:2642`

---

### Configuration Schema

```typescript
interface BatchQueueConfig {
  maxBatchSize: number;           // Max items per HTTP POST batch (default: 500)
  maxQueueSize: number;           // Max total pending items before backpressure (default: 100000)
  baseDelayMs: number;            // Base retry delay in ms (default: 500)
  maxDelayMs: number;             // Maximum retry delay cap in ms (default: 8000)
  jitterMs: number;               // Random jitter added to retry delays (default: 1000)
  maxConsecutiveFailures: number; // Max failures before dropping batch
  onBatchDropped: (batch) => void;// Callback when a batch is dropped after max failures
  send: (batch) => Promise<void>; // The actual HTTP POST function
}
```

### State fields

```javascript
// ============================================
// BatchQueue - constructor state
// Location: chunks.184.mjs:2642
// ============================================

// ORIGINAL (for source lookup):
class Y26 {
  constructor(A) {
    this.config = A;
    this.pending = [];
    this.draining = false;
    this.closed = false;
    this.backpressureResolvers = [];
    this.flushResolvers = [];
    this.droppedBatches = 0;
  }
}

// READABLE (for understanding):
class BatchQueue {
  constructor(config) {
    this.config = config;
    this.pending = [];                  // All buffered items not yet sent
    this.draining = false;              // Guard: only one drain() loop runs at a time
    this.closed = false;                // True after close(); no new items accepted
    this.backpressureResolvers = [];    // Promises waiting for queue space
    this.flushResolvers = [];           // Promises waiting for queue to empty
    this.droppedBatches = 0;           // Counter of dropped batches (for telemetry)
  }
}

// Mapping: Y26→BatchQueue, A→config
```

---

### Algorithm: `enqueue(items)` — backpressure-aware ingestion

```javascript
// ============================================
// BatchQueue.enqueue - Accepts items; blocks if queue is full
// Location: chunks.184.mjs:~2665
// ============================================

// ORIGINAL (for source lookup):
async enqueue(A) {
  if (this.closed) return;
  let B = Array.isArray(A) ? A : [A];
  while (this.pending.length + B.length > this.config.maxQueueSize) {
    await new Promise(resolve => this.backpressureResolvers.push(resolve));
    if (this.closed) return;
  }
  this.pending.push(...B);
  this.drain();
}

// READABLE (for understanding):
async enqueue(itemOrItems) {
  if (this.closed) return; // Drop silently if queue is shut down

  let items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];

  // Backpressure: wait until there is room in the buffer
  while (this.pending.length + items.length > this.config.maxQueueSize) {
    await new Promise(resolve => this.backpressureResolvers.push(resolve));
    if (this.closed) return; // Re-check after waking up
  }

  this.pending.push(...items);
  this.drain(); // Kick off drain loop if not already running
}

// Mapping: A→itemOrItems, B→items
```

**Backpressure design analysis:**

The `while` loop (not `if`) is critical. After a backpressure Promise resolves, the total queue size must be rechecked because:
- Multiple blocked `enqueue` calls may all wake simultaneously when `releaseBackpressure` is called
- Only some of them will actually fit; the rest must re-block
- The `closed` re-check prevents a zombie enqueue from adding items after shutdown

This pattern implements a semaphore without a dedicated semaphore class, using Promise arrays as a wait queue.

---

### Algorithm: `drain()` — batch dispatch loop

```javascript
// ============================================
// BatchQueue.drain - Main dispatch loop; sends batches until pending is empty
// Location: chunks.184.mjs:~2685
// ============================================

// ORIGINAL (for source lookup):
async drain() {
  if (this.draining) return;
  this.draining = true;
  let A = 0;
  while (this.pending.length > 0 && !this.closed) {
    let B = this.pending.splice(0, this.config.maxBatchSize);
    let C = false;
    let D = 0;
    while (!C && !this.closed) {
      try {
        await this.config.send(B);
        C = true;
        A = 0;
      } catch (E) {
        D++;
        A++;
        if (D >= this.config.maxConsecutiveFailures) {
          this.droppedBatches++;
          this.config.onBatchDropped(B);
          break;
        }
        let F = await this.retryDelay(A, E instanceof MV6 ? E.retryAfterMs : undefined);
        if (this.closed) break;
      }
    }
    this.releaseBackpressure();
  }
  this.draining = false;
  this.resolveFlushers();
}

// READABLE (for understanding):
async drain() {
  if (this.draining) return; // Only one drain loop may run at a time
  this.draining = true;
  let consecutiveFailures = 0;

  while (this.pending.length > 0 && !this.closed) {
    // Slice up to maxBatchSize items from the front of the buffer
    let batch = this.pending.splice(0, this.config.maxBatchSize);
    let sent = false;
    let batchAttempts = 0;

    // Retry loop for this batch
    while (!sent && !this.closed) {
      try {
        await this.config.send(batch);
        sent = true;
        consecutiveFailures = 0; // Reset on success
      } catch (err) {
        batchAttempts++;
        consecutiveFailures++;

        if (batchAttempts >= this.config.maxConsecutiveFailures) {
          // Give up on this batch
          this.droppedBatches++;
          this.config.onBatchDropped(batch);
          break;
        }

        // Compute delay: use server's Retry-After hint if available
        let retryAfterMs = err instanceof RetryAfterError ? err.retryAfterMs : undefined;
        await this.retryDelay(consecutiveFailures, retryAfterMs);

        if (this.closed) break; // Don't retry if closed during sleep
      }
    }

    // After each batch (sent or dropped), release backpressure waiters
    this.releaseBackpressure();
  }

  this.draining = false;
  this.resolveFlushers(); // Wake any flush() waiters
}

// Mapping: Y26→BatchQueue, A→consecutiveFailures, B→batch, C→sent, D→batchAttempts,
//          E→err, F→(unused, delay result), MV6→RetryAfterError
```

**Design decisions in `drain()`:**

1. **Single-drain guard (`draining` flag):** Prevents concurrent drain loops from fighting over `pending`. Any `enqueue` that arrives during an active drain simply pushes to `pending` and calls `drain()`, which returns immediately because `draining === true`. The running loop will naturally pick up those items on its next iteration.

2. **`splice(0, maxBatchSize)` removes items immediately:** Items are removed from `pending` before the `send` call, not after. This means a failed batch is held locally in `batch` (not in `pending`) during retries. The queue is therefore never in a state where the same items could be sent twice from `pending`.

3. **`releaseBackpressure()` per batch:** Backpressure is released after each batch is processed (sent or dropped), not only when the full queue drains. This minimizes the stall duration for producers blocked on `maxQueueSize`.

4. **`resolveFlushers()` at drain completion:** `flush()` waiters are resolved only when `pending` is fully empty and `draining` returns to `false`. This guarantees that a `flush()` call observes a consistent empty state.

---

### Algorithm: `retryDelay(attempts, retryAfterMs)` — adaptive backoff

```javascript
// ============================================
// BatchQueue.retryDelay - Computes and sleeps for retry backoff
// Location: chunks.184.mjs:~2730
// ============================================

// ORIGINAL (for source lookup):
async retryDelay(A, B) {
  let C;
  if (B !== undefined) {
    C = Math.min(Math.max(B, this.config.baseDelayMs), this.config.maxDelayMs);
  } else {
    C = Math.min(
      this.config.baseDelayMs * Math.pow(2, A - 1) + Math.random() * this.config.jitterMs,
      this.config.maxDelayMs
    );
  }
  await this.sleep(C);
}

// READABLE (for understanding):
async retryDelay(attempts, retryAfterMs) {
  let delayMs;
  if (retryAfterMs !== undefined) {
    // Server explicitly told us how long to wait — respect it, but clamp to our bounds
    delayMs = Math.min(
      Math.max(retryAfterMs, this.config.baseDelayMs),
      this.config.maxDelayMs
    );
  } else {
    // Exponential backoff: baseDelay * 2^(attempts-1) + random jitter
    // attempt=1 → baseDelay * 1 + jitter
    // attempt=2 → baseDelay * 2 + jitter
    // attempt=3 → baseDelay * 4 + jitter  (etc.)
    delayMs = Math.min(
      this.config.baseDelayMs * Math.pow(2, attempts - 1) + Math.random() * this.config.jitterMs,
      this.config.maxDelayMs
    );
  }
  await this.sleep(delayMs);
}

// Mapping: A→attempts, B→retryAfterMs, C→delayMs
```

**Backoff formula breakdown (default config: base=500ms, max=8000ms, jitter=1000ms):**

| Attempt | Formula | Range (ms) |
|---------|---------|-----------|
| 1 | 500 × 1 + [0,1000) | 500–1499 |
| 2 | 500 × 2 + [0,1000) | 1000–1999 |
| 3 | 500 × 4 + [0,1000) | 2000–2999 |
| 4 | 500 × 8 + [0,1000) | 4000–4999 |
| 5+ | capped at maxDelayMs | 8000 (max) |

**Why jitter?** Without jitter, all clients experiencing the same transient failure would retry simultaneously, creating a "thundering herd" that re-overwhelms the server at the same instant. Random jitter spreads retries across a time window, reducing the probability of correlated retry storms.

**Why honor `retryAfterMs`?** The server has authoritative knowledge of when it will be ready. Ignoring `Retry-After` headers and using client-side backoff wastes server capacity (retrying too early) or wastes time (retrying too late). Clamping to `[baseDelayMs, maxDelayMs]` prevents a malicious or misconfigured server from forcing either an immediate flood (`retryAfterMs=0`) or a permanent wait (`retryAfterMs=∞`).

---

### `flush()` — drain completion barrier

```javascript
// ============================================
// BatchQueue.flush - Returns Promise that resolves when all pending items are sent
// Location: chunks.184.mjs:~2715
// ============================================

// ORIGINAL (for source lookup):
flush() {
  if (this.pending.length === 0 && !this.draining) {
    return Promise.resolve();
  }
  return new Promise(resolve => this.flushResolvers.push(resolve));
}

// READABLE (for understanding):
flush() {
  // Fast path: nothing to wait for
  if (this.pending.length === 0 && !this.draining) {
    return Promise.resolve();
  }
  // Park caller until drain() calls resolveFlushers()
  return new Promise(resolve => this.flushResolvers.push(resolve));
}

// Mapping: (uses readable names)
```

**Why check both `pending.length === 0` AND `!this.draining`?** It is possible for `pending` to be empty while `draining` is still `true` — this happens when `drain()` has spliced the last batch out of `pending` but has not yet called `resolveFlushers()`. Without the `draining` check, `flush()` would return immediately while a batch is still in flight over the network.

---

### `close()` — graceful shutdown

```javascript
// ============================================
// BatchQueue.close - Shuts down queue; discards pending items; unblocks all waiters
// Location: chunks.184.mjs:~2720
// ============================================

// ORIGINAL (for source lookup):
close() {
  this.closed = true;
  this.pending = [];
  this.releaseBackpressure();
  this.resolveFlushers();
}

// READABLE (for understanding):
close() {
  this.closed = true;
  this.pending = [];          // Discard all buffered items
  this.releaseBackpressure(); // Unblock any enqueue() callers
  this.resolveFlushers();     // Unblock any flush() callers
}

// Mapping: (uses readable names)
```

**Design trade-off:** `close()` discards pending items rather than draining them first. This is intentional for shutdown scenarios where waiting for a clean drain is unacceptable (process exit, timeout, user interrupt). If callers need guaranteed delivery, they must call `await flush()` before `close()`.

---

### `sleep(ms)` — cancelable timer

```javascript
// ============================================
// BatchQueue.sleep - Promise-based sleep with store-and-cancel pattern
// Location: chunks.184.mjs:~2745
// ============================================

// ORIGINAL (for source lookup):
sleep(A) {
  return new Promise(resolve => {
    this.sleepResolve = resolve;
    setTimeout(() => {
      this.sleepResolve = null;
      resolve();
    }, A);
  });
}

// READABLE (for understanding):
sleep(ms) {
  return new Promise(resolve => {
    this.sleepResolve = resolve; // Store so close() can cancel early
    setTimeout(() => {
      this.sleepResolve = null;
      resolve();
    }, ms);
  });
}

// Mapping: A→ms
```

Storing `sleepResolve` allows `close()` (or similar shutdown code) to call `this.sleepResolve?.()` to interrupt an in-progress sleep without leaving a dangling `setTimeout`. This prevents a situation where the drain loop is sleeping through an exponential backoff delay while the process is trying to shut down.

---

## Part 3: Supporting Types

### `RetryAfterError` (`MV6`) — Structured Retry Hint

```javascript
// ============================================
// RetryAfterError - Error subclass carrying server's retry delay hint
// Location: chunks.184.mjs:2731
// ============================================

// ORIGINAL (for source lookup):
class MV6 extends Error {
  constructor(A, B) {
    super(A);
    this.retryAfterMs = B;
  }
}

// READABLE (for understanding):
class RetryAfterError extends Error {
  constructor(message, retryAfterMs) {
    super(message);
    this.retryAfterMs = retryAfterMs; // How long the server wants us to wait (ms)
  }
}

// Mapping: MV6→RetryAfterError, A→message, B→retryAfterMs
```

**What it does:** `RetryAfterError` is thrown by the `send` function when the HTTP POST endpoint responds with a `429 Too Many Requests` or `503 Service Unavailable` status that includes a `Retry-After` header. By carrying the delay as a typed property on the error object (rather than as a generic string message), `drain()` can use `instanceof MV6` to reliably distinguish "server-directed retry" from other failure modes and apply the server's preferred delay.

**Why a subclass instead of a plain object?** Using `instanceof` for control flow on Error subclasses is a well-established JavaScript pattern. It preserves the full Error stack trace (useful for debugging) while allowing typed dispatch. An alternative would be a `type` discriminant field, but that requires checking `e.type === "retry_after"` after first ensuring `e` is an object with a `type` property — more code for the same semantics.

---

### `computePostUrl` (`uDz`) — WebSocket-to-HTTP URL Conversion

```javascript
// ============================================
// computePostUrl - Converts WebSocket session URL to HTTP events POST URL
// Location: chunks.184.mjs:2740
// ============================================

// ORIGINAL (for source lookup):
function uDz(A) {
  let B = new URL(A);
  B.protocol = B.protocol === "wss:" ? "https:" : "http:";
  B.pathname = B.pathname.replace(/^\/ws\//, "/session/") + "/events";
  return B.toString();
}

// READABLE (for understanding):
function computePostUrl(wsUrl) {
  let url = new URL(wsUrl);
  // Convert WebSocket scheme to HTTP scheme
  url.protocol = url.protocol === "wss:" ? "https:" : "http:";
  // Convert path: /ws/<session-id>  →  /session/<session-id>/events
  url.pathname = url.pathname.replace(/^\/ws\//, "/session/") + "/events";
  return url.toString();
}

// Mapping: uDz→computePostUrl, A→wsUrl, B→url
```

**What it does:** `HybridTransport` receives a WebSocket URL (e.g., `wss://api.example.com/ws/abc123`) for its real-time bidirectional channel. The batch HTTP uploader needs a separate REST endpoint. `computePostUrl` derives that endpoint by:

1. Changing the scheme: `wss:` → `https:`, `ws:` → `http:`
2. Rewriting the path: `/ws/<id>` → `/session/<id>/events`

**Why derive the HTTP URL from the WebSocket URL?** This design ensures a single source of truth (the WebSocket URL in config) for both transport modes. No separate `eventsUrl` configuration field is needed, reducing the surface for misconfiguration (e.g., WebSocket pointing to one host and HTTP events pointing to another).

---

## Part 4: Architecture Comparison

### AsyncQueue vs BatchQueue

| Concern | AsyncQueue (Pi6) | BatchQueue (Y26) |
|---------|-----------------|-----------------|
| Consumer model | Pull: `for await` iterator | Push: internal drain loop |
| Delivery guarantee | Best-effort (in-process) | Retry with backoff |
| Backpressure | None (unbounded buffer) | `maxQueueSize` with async wait |
| Error handling | Propagates to consumer | Retry → drop after max failures |
| Shutdown | `done()` / `return()` | `close()` discards pending |
| Batching | Single item | Up to `maxBatchSize` per send |
| Transport | In-process (stdio write) | Network (HTTP POST) |

### Why Two Different Queue Designs?

**AsyncQueue** is appropriate for stdio because:
- The consumer (stdout write loop) is local and fast — no network latency
- Backpressure would cause the agent loop to stall on stdout writes, which should never happen
- Single-consumer enforced by the iterator protocol matches the single stdout channel

**BatchQueue** is appropriate for HTTP telemetry/events because:
- Network sends have variable latency and can fail transiently
- Batching amortizes HTTP connection overhead across many small events
- Backpressure prevents unbounded memory growth when the server is slow
- Retry logic handles transient 5xx/429 errors without losing data

---

## Data Flow Diagram

```
Agent Loop / Tools
       │
       │ write(message)
       ▼
  AsyncQueue (Pi6)
  ┌─────────────┐
  │ queue[]     │ ←── enqueue(msg)
  │ readResolve │
  └─────────────┘
       │
       │ for await (msg of outbound)
       ▼
  StdioStreamIO (so6)
  serializes → stdout (NDJSON)


HybridTransport (eo6)
       │
       │ uploader.enqueue(event)
       ▼
  BatchQueue (Y26)
  ┌──────────────────────────────────────┐
  │ pending[]                            │
  │  ┌── backpressureResolvers[]         │
  │  └── flushResolvers[]                │
  │                                      │
  │  drain() loop:                       │
  │    splice(0, maxBatchSize)           │
  │    → send(batch) [HTTP POST]         │
  │        on fail → retryDelay()        │
  │        on MV6  → use retryAfterMs    │
  │        max failures → onBatchDropped │
  └──────────────────────────────────────┘
         │
         │ computePostUrl(wsUrl)
         ▼
  https://host/session/<id>/events
```
