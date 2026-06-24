/**
 * In-memory Mailbox — a single-process async message queue with blocking receive.
 *
 * This is the in-PROCESS sibling of the file-based teammate mailbox
 * (`teammateMailbox.ts`). It is NOT the cross-process IPC transport; it is the
 * per-agent in-memory queue an in-process teammate (and the REPL) drains. A
 * sender `send`s a message; a receiver either `poll`s synchronously (returns
 * `undefined` if nothing matches) or `receive`s a Promise that resolves as soon
 * as a matching message arrives (the "waiter" mechanism). `subscribe` exposes a
 * revision signal so UI/state can react to queue churn without consuming.
 *
 * 2.1.183 regions covered:
 *   - Mailbox class   kJr @cli_inner_pretty.js:301895-301937
 *     (queue/waiters/changed/_revision fields, length/revision getters,
 *      send @301906, poll @301918, receive @301923, subscribe @301933, notify @301934)
 *   - createSignal    ca  @cli_inner_pretty.js:181  (the `changed` signal: subscribe/emit)
 *
 * 2.1.88 ancestor mirrored: utils/mailbox.ts (the `Mailbox` class) + utils/signal.ts.
 *   The v2.1.183 class `kJr` is structurally byte-for-byte the v2.1.88 `Mailbox`:
 *   same fields, same send/poll/receive/subscribe/notify bodies, same waiter splice
 *   logic. UNCHANGED carryover.
 *
 * scaffold: 30_agent_team/mailbox_lifecycle_and_sendmessage_delta.md (mailbox identity);
 *           ancestor utils/mailbox.ts for the readable shape.
 * cross-val: re-read the `kJr` class body @301895-301937 in the 183 bundle — every method
 *   matches the 88 ancestor; `changed = ca()` where `ca` (@181) is createSignal (subscribe/emit
 *   over a Set of listeners). `_revision` is bumped only on `send` (bump @301907), used by `revision`.
 *
 * Mapping: kJr->Mailbox, ca->createSignal.
 */

import { createSignal } from './signal.js'

/** Where a message originated. */
export type MessageSource = 'user' | 'teammate' | 'system' | 'tick' | 'task'

export type Message = {
  id: string
  source: MessageSource
  content: string
  from?: string
  color?: string
  timestamp: string
}

/** A blocked `receive` caller, waiting for the first message matching `fn`. */
type Waiter = {
  fn: (msg: Message) => boolean
  resolve: (msg: Message) => void
}

// 2.1.183: Mailbox = kJr @cli_inner_pretty.js:301895
export class Mailbox {
  private queue: Message[] = []
  private waiters: Waiter[] = []
  private changed = createSignal() // ca() — subscribe/emit over a listener Set
  private _revision = 0

  /** Number of buffered (un-received) messages. */
  get length(): number {
    return this.queue.length
  }

  /** Monotonic counter bumped on every `send` — lets subscribers detect churn. */
  get revision(): number {
    return this._revision
  }

  // 2.1.183: send @cli_inner_pretty.js:301906
  /**
   * Enqueue a message. If a blocked `receive` waiter matches it, hand the
   * message straight to that waiter (fast-path, never touching the queue);
   * otherwise buffer it in `queue`. Always bumps `_revision` and notifies.
   */
  send(msg: Message): void {
    this._revision++ // @301907
    const idx = this.waiters.findIndex(w => w.fn(msg)) // @301908
    if (idx !== -1) {
      const waiter = this.waiters.splice(idx, 1)[0]
      if (waiter) {
        waiter.resolve(msg)
        this.notify()
        return
      }
    }
    this.queue.push(msg)
    this.notify()
  }

  // 2.1.183: poll @cli_inner_pretty.js:301918
  /**
   * Non-blocking dequeue of the first message matching `fn` (default: any).
   * Returns `undefined` if nothing matches. Note: `poll` does NOT notify —
   * only `send`/`receive` do (matches the 88 ancestor exactly).
   */
  poll(fn: (msg: Message) => boolean = () => true): Message | undefined {
    const idx = this.queue.findIndex(fn)
    if (idx === -1) return undefined
    return this.queue.splice(idx, 1)[0]
  }

  // 2.1.183: receive @cli_inner_pretty.js:301923
  /**
   * Blocking dequeue: if a buffered message matches `fn`, resolve immediately
   * (and notify); otherwise register a waiter and resolve when a matching
   * message is later `send`-ed.
   */
  receive(fn: (msg: Message) => boolean = () => true): Promise<Message> {
    const idx = this.queue.findIndex(fn)
    if (idx !== -1) {
      const msg = this.queue.splice(idx, 1)[0]
      if (msg) {
        this.notify()
        return Promise.resolve(msg)
      }
    }
    return new Promise<Message>(resolve => {
      this.waiters.push({ fn, resolve })
    })
  }

  // 2.1.183: subscribe = this.changed.subscribe @cli_inner_pretty.js:301933
  /** Subscribe to queue-change events; returns an unsubscribe function. */
  subscribe = this.changed.subscribe

  // 2.1.183: notify @cli_inner_pretty.js:301934
  private notify(): void {
    this.changed.emit()
  }
}
