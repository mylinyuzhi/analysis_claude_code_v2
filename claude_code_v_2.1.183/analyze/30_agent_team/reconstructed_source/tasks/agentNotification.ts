/**
 * agentNotification.ts — the task-notification builder + keepalive substrate that together
 * implement the v2.1.183 background-task survival fix.
 *
 * THE FIX (changelog: "Fixed background tasks started by a teammate being killed when the
 * teammate finishes a turn"). A teammate (in-process or pane agent) can itself launch
 * background tasks (run_in_background Bash, background sub-agents). Each such child registers
 * an `agent:<childId>` keepalive reason on its owner task. Before v2.1.183 the task-notification
 * emitted when an agent "came to rest" was enqueued with NO target agent (defaulting to the main
 * session) and never consulted the owner — so a teammate finishing its turn could be reaped while
 * its children were still alive, killing those children.
 *
 * The fix has TWO cooperating halves, both verified in the 2.1.183 bundle:
 *   (1) THIS file — `enqueueAgentNotification` (G4e). It now reads the resting task's owner,
 *       computes whether the OWNER is still alive (parked-completed in interactive mode, or
 *       running), releases the child's `agent:<id>` keepalive pin ONLY when this is the first
 *       notification to a live owner, and ROUTES the notification to the live owner (rather than
 *       the main session). It also injects a new explanatory <note> documenting the
 *       parked/resumable/child-gated lifecycle.
 *   (2) The in-process runner turn-end (inProcessRunner.ts, sDp @421263) — when a teammate goes
 *       idle it now ARMS eviction (`evictAfter = Date.now() + EVICT_DELAY_MS`) and clears only the
 *       per-turn `onIdleCallbacks`, NOT the task's children. So finishing a turn merely schedules
 *       a +30s eviction; the live `agent:*` keepalive reasons from children then BLOCK that
 *       eviction (see `computeEvictAfter`/`removeKeepaliveReason`). A completed teammate with live
 *       children is therefore "parked" — eviction armed but indefinitely deferred — until its last
 *       child clears its pin, at which point it finally winds down.
 *
 * 2.1.183 regions covered:
 *   - keepalive substrate: cli_inner_pretty.js:445750-445812 (Lye, YR, jmo, od, tWe, Fut, ect, QBn)
 *   - notification builder: cli_inner_pretty.js:445827-445890 (G4e), incl. <note> @445887
 *   - owner-reap reroute:   cli_inner_pretty.js:445891-445900 (Gmo, `s.ownerAgentId === e` @445897)
 *   - kill/finalize path:   cli_inner_pretty.js:445901-445944 (e0e, VYa)
 *   - tag-name consts:      cli_inner_pretty.js:45659-45668
 *   - EVICT_DELAY_MS:       cli_inner_pretty.js:439188 (zGe = 30000)
 *   - turn-end arming ref:  cli_inner_pretty.js:421263 (sDp idle update sets evictAfter)
 *
 * 2.1.88 ancestor mirrored: tasks/LocalAgentTask/LocalAgentTask.tsx
 *   (`enqueueAgentNotification` @197-262, `killAsyncAgent` @281-303, `killAllRunningAgentTasks`
 *   @309-315, `markAgentsNotified` @322-332). 88 used `setAppState`+`updateTaskState`; 183 routes
 *   through a `taskRegistry` abstraction. 88 had NO owner read, NO keepalive release on emit, NO
 *   agentId routing, NO <note>, and the old summary wording ("completed"/"failed: X"/"was
 *   stopped"). Those four additions ARE the survival fix. The XML <output-file> field (bM) and
 *   getTaskOutputPath are carryover (88 OUTPUT_FILE_TAG / getTaskOutputPath @247,254).
 *
 * scaffold: 30_agent_team/coordinator_and_background_survival.md (§3 background-task survival fix).
 *
 * cross-val (re-read in the 183 bundle this pass):
 *   - G4e body @445827-445890 incl. the owner-alive gate `g = (od(m) && YR(m) && !xr()) ||
 *     (od(m) && m.status === "running")` @445849 and routing `agentId: g && f ? If(f) : Ls()` @445889.
 *   - the verbatim <note> @445887 (byte-exact, grep in 2.1.156 = 0 matches).
 *   - the owner reap predicate `return od(s) && s.ownerAgentId === e;` @445897 inside Gmo.
 *   - CORRECTION to scaffold open-question #4: the XML field at `<${bM}>${y}</${bM}>` is
 *     `<output-file>` (bM = "output-file" @45663), and `y = fg(e)` is the task OUTPUT FILE PATH
 *     (fg @575229 → `path.join(outputDir(), `${id}.output`)`), NOT an <age>/formatAge. This matches
 *     the 88 ancestor's OUTPUT_FILE_TAG/getTaskOutputPath exactly.
 */

// ── External helpers (cited to obf + 2.1.88 ancestor; do NOT import the obfuscated bundle) ──
//
// enqueuePendingNotification — '../utils/messageQueueManager.js'
//   2.1.183: _f @234006 (= ug.enqueuePendingNotification). 88: messageQueueManager.enqueuePendingNotification.
// getCommandQueue            — '../utils/messageQueueManager.js'  (2.1.183: lge @234000 = ug.getCommandQueue)
// dequeueAllMatching         — '../utils/messageQueueManager.js'  (2.1.183: dIe @234010 = ug.dequeueAllMatching)
// escapeXml                  — '../utils/xml.js'  (2.1.183: Kp @234069, & < > escaping)
// getTaskOutputPath          — '../utils/task/diskOutput.js'  (2.1.183: fg @575229; `${id}.output`)
// toAgentId                  — '../utils/agentId.js'  (2.1.183: If @2037, identity brand-cast)
// mainAgentId                — '../utils/agentId.js'  (2.1.183: Ls @2664, the main session agent id)
// isHeadless                 — '../utils/terminal.js'  (2.1.183: xr @3151, `return !Ot.isInteractive`)
// log                        — '../utils/log.js'  (2.1.183: v)
declare function enqueuePendingNotification(args: {
  value: string
  mode: 'task-notification'
  priority?: 'next' | 'last'
  agentId?: AgentId
  taskId?: string
}): void
declare function getCommandQueue(): Array<QueueEntry>
declare function dequeueAllMatching(predicate: (entry: QueueEntry) => boolean): Array<QueueEntry>
declare function escapeXml(text: string): string
declare function getTaskOutputPath(taskId: string): string
declare function toAgentId(id: string): AgentId
declare function mainAgentId(): AgentId
declare function isHeadless(): boolean
declare function log(message: string, opts: { level: 'debug' | 'warn' }): void

// Branded agent-id (the runtime brand-cast `If` is the identity function @2037-2039).
type AgentId = string & { readonly __agentId?: unique symbol }

interface QueueEntry {
  mode?: string
  agentId?: AgentId
  taskId?: string
  value?: string
  priority?: 'next' | 'last'
}

// ── Task-registry abstraction (matches inProcessRunner.ts's TaskRegistry shape) ──
// 2.1.183 routes notification/keepalive state through a registry (`o`/`t`) — `.get`/`.update`/
// `.abortSpeculation` — rather than the 88 raw `setAppState` reducers.
interface TaskRegistry {
  get: (taskId: string) => TaskState | undefined
  update: (taskId: string, updater: (task: TaskState) => TaskState) => void
  abortSpeculation: () => void
}

// A local-agent / teammate task (the subset this module reads). `keepaliveReasons` is the pin set;
// `ownerAgentId` points at the agent that spawned this task (the owner kept alive by its children).
interface TaskState {
  type?: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'killed' | string
  notified?: boolean
  retain?: boolean
  evictAfter?: number
  endTime?: number
  description?: string
  ownerAgentId?: string
  keepaliveReasons?: Set<string>
  toolUseId?: string
  result?: AgentResult
  abortController?: AbortController
  selectedAgent?: unknown
}

interface AgentResult {
  content: Array<{ text: string }>
  totalTokens: number
  totalToolUseCount: number
  totalDurationMs: number
}

// ── Constants ──

// 2.1.183: EVICT_DELAY_MS = zGe @439188 ("var _Da = 3000, zGe = 30000")
// Grace window applied when scheduling a terminal task's eviction. Also added to the in-process
// turn-end idle update in v2.1.183 (sDp @421263) — turn-end ARMS eviction, keepalive GATES it.
const EVICT_DELAY_MS = 30000

// 2.1.183: keepalive-reason prefix. A background child registers `agent:<childTaskId>` on its
// owner (tWe @445772), so "live background children" == the set of `agent:`-prefixed reasons.
const AGENT_KEEPALIVE_PREFIX = 'agent:'

// 2.1.183: task-notification XML tag-name constants @45659-45668.
// NOTE bM = "output-file" (NOT an age field — corrects scaffold open-question #4).
const TASK_NOTIFICATION_TAG = 'task-notification' // mp @45659
const TASK_ID_TAG = 'task-id' // Xy @45660
const TOOL_USE_ID_TAG = 'tool-use-id' // _M @45661
const OUTPUT_FILE_TAG = 'output-file' // bM @45663
const STATUS_TAG = 'status' // yy @45664
const SUMMARY_TAG = 'summary' // Om @45665
const WORKTREE_TAG = 'worktree' // Ofr @45666
const WORKTREE_PATH_TAG = 'worktreePath' // Nfr @45667
const WORKTREE_BRANCH_TAG = 'worktreeBranch' // Bfr @45668

// ============================================================================
// Keepalive substrate (the "is this agent still needed" primitives)
// These PRE-EXIST v2.1.156 modulo renaming; they are the substrate the fix builds on.
// ============================================================================

// 2.1.183: isLocalAgent = od @445761
// `typeof e === "object" && e !== null && "type" in e && e.type === "local_agent"`.
function isLocalAgent(task: TaskState | undefined): task is TaskState {
  return typeof task === 'object' && task !== null && 'type' in task && task.type === 'local_agent'
}

// 2.1.183: isTerminalStatus = tC @575418
// `e === "completed" || e === "failed" || e === "killed"`.
function isTerminalStatus(status: string): boolean {
  return status === 'completed' || status === 'failed' || status === 'killed'
}

// 2.1.183: keepaliveReasons = Lye @445750 — `return e.keepaliveReasons ?? new Set();`
export function keepaliveReasons(task: TaskState): Set<string> {
  return task.keepaliveReasons ?? new Set()
}

// 2.1.183: isCompletedButKeptAlive = YR @445753
//   `return e.status === "completed" && Lye(e).size > 0;`
// A *completed* task that still has keepalive reasons is "parked": done with its own turn, but
// kept alive because something still depends on it (e.g. a live background child). This predicate
// is the crux of the survival fix — a teammate that finished its turn is parked, not gone, while
// it has `agent:`-keepalive pins.
export function isCompletedButKeptAlive(task: TaskState): boolean {
  return task.status === 'completed' && keepaliveReasons(task).size > 0
}

// 2.1.183: computeEvictAfter = jmo @445756
//   `if (e.retain) return; if (t.park && Lye(e).size > 0) return; return Date.now() + zGe;`
// Decides the eviction timestamp for a terminal task. Two ways to return undefined (= "do NOT
// schedule eviction, keep this task"):
//   - the task is pinned (`retain`), or                                      // @445757
//   - `park` was requested AND the task still has keepalive reasons.         // @445758
// Otherwise schedule eviction at now + EVICT_DELAY_MS.                       // @445759
// Used by the kill/finalize paths: a *park* finalize won't evict a task that still has live
// children, which is the structural guarantee behind "parked, not killed".
export function computeEvictAfter(task: TaskState, opts: { park: boolean }): number | undefined {
  if (task.retain) return undefined // @445757
  if (opts.park && keepaliveReasons(task).size > 0) return undefined // @445758
  return Date.now() + EVICT_DELAY_MS // @445759
}

// 2.1.183: addKeepaliveReason = tWe @445772 — idempotent register of reason `t` on agent `e`.
// A background child registers `agent:<childTaskId>` on its owner so the owner is parked while the
// child runs. No-op if the target isn't a local agent or the reason is already present. // @445775
export function addKeepaliveReason(agentId: string | undefined, reason: string, reg: TaskRegistry): void {
  if (!agentId) return
  reg.update(agentId, task => {
    if (!isLocalAgent(task) || keepaliveReasons(task).has(reason)) return task // @445775
    return { ...task, keepaliveReasons: new Set(keepaliveReasons(task)).add(reason) } // @445776
  })
}

// 2.1.183: removeKeepaliveReason = Fut @445779 — drop reason `t` from agent `e`.
// If that was the LAST reason AND the task is in a terminal status AND not pinned, schedule
// eviction (evictAfter = now + EVICT_DELAY_MS) — but only if eviction wasn't already armed. // @445785
// This is how a live owner finally winds down: each child's notification releases its pin, and the
// last release schedules the (deferred) eviction.
export function removeKeepaliveReason(agentId: string | undefined, reason: string, reg: TaskRegistry): void {
  if (!agentId) return
  reg.update(agentId, task => {
    if (!isLocalAgent(task) || !keepaliveReasons(task).has(reason)) return task // @445782
    const remaining = new Set(keepaliveReasons(task))
    remaining.delete(reason) // @445784
    const nowEvictable = remaining.size === 0 && isTerminalStatus(task.status) && !task.retain // @445785
    return {
      ...task,
      keepaliveReasons: remaining,
      ...(nowEvictable && task.evictAfter === undefined && { evictAfter: Date.now() + EVICT_DELAY_MS }), // @445786
    }
  })
}

// 2.1.183: hasLiveChildAgents = ect @445794 — does this agent have any `agent:`-prefixed reasons?
// This is literally the "live background children" concept the new <note> references. // @445798
export function hasLiveChildAgents(agentId: string | undefined, reg: TaskRegistry): boolean {
  if (!agentId) return false
  const task = reg.get(agentId)
  if (!isLocalAgent(task)) return false
  for (const reason of keepaliveReasons(task)) {
    if (reason.startsWith(AGENT_KEEPALIVE_PREFIX)) return true // @445798
  }
  return false
}

// 2.1.183: gcStaleChildKeepalives = QBn @445801
// Garbage-collects `agent:<childId>` keepalive reasons whose child has ALREADY notified (or no
// longer exists), EXCEPT those still represented by a pending task-notification in the queue.
function gcStaleChildKeepalives(ownerId: string, reg: TaskRegistry): void {
  const owner = reg.get(ownerId)
  if (!isLocalAgent(owner)) return
  // Children that still have a queued task-notification addressed to this owner are NOT stale. // @445805
  const pendingChildIds = new Set<string>()
  for (const entry of getCommandQueue()) {
    if (entry.mode === 'task-notification' && entry.agentId === toAgentId(ownerId) && entry.taskId) {
      pendingChildIds.add(entry.taskId)
    }
  }
  for (const reason of keepaliveReasons(owner)) {
    if (!reason.startsWith(AGENT_KEEPALIVE_PREFIX)) continue
    const childId = reason.slice(AGENT_KEEPALIVE_PREFIX.length) // `.slice(6)` @445808
    if (pendingChildIds.has(childId)) continue
    const child = reg.get(childId)
    // Reason is stale if the child is gone OR already notified ⇒ release the pin. // @445811
    if (!child || (isLocalAgent(child) && child.notified)) removeKeepaliveReason(ownerId, reason, reg)
  }
}

// ============================================================================
// The fixed task-notification builder — the heart of the survival fix
// ============================================================================

interface AgentNotificationArgs {
  taskId: string
  description: string
  status: 'completed' | 'failed' | 'killed'
  error?: string
  taskRegistry: TaskRegistry
  finalMessage?: string
  usage?: { totalTokens: number; toolUses: number; durationMs: number }
  toolUseId?: string
  worktreePath?: string
  worktreeBranch?: string
  // NEW vs 2.1.88: the fallback owner when the task no longer carries one in the registry.
  ownerAgentId?: string
}

/**
 * 2.1.183: buildTaskNotification / enqueueAgentNotification = G4e @445827
 *
 * Emit a <task-notification> when an agent "comes to rest", and — the v2.1.183 fix — route it to
 * the still-alive OWNER (the teammate that spawned this task) instead of dumping it on the main
 * session, and condition the release of this child's keepalive pin on the owner being alive.
 *
 * Walkthrough (against the 88 ancestor `enqueueAgentNotification` @197-262):
 *  - atomically read the owner off the task + set `notified` (the 88 dedupe) — PLUS now capture
 *    `ownerAgentId` (NEW); fall back to the passed-in owner. // @445843-445847
 *  - compute `ownerAlive` (NEW). // @445848-445849
 *  - release this child's `agent:<id>` pin from the owner unless it's a first-time notify to a
 *    live owner (NEW). // @445850
 *  - build XML — now with the new <note> (NEW) and "came to rest" wording (CHANGED). // @445859-445888
 *  - route the enqueue to the live owner, else the main session (NEW agentId). // @445889
 *
 * 88 ancestor: tasks/LocalAgentTask/LocalAgentTask.tsx:197-262.
 */
export function buildTaskNotification({
  taskId,
  description,
  status,
  error,
  taskRegistry,
  finalMessage,
  usage,
  toolUseId,
  worktreePath,
  worktreeBranch,
  ownerAgentId,
}: AgentNotificationArgs): void {
  // Atomic check-and-set of `notified` (88 dedupe), now ALSO reading the owner off the task. // @445843
  let firstTimeNotified = false
  let taskPresent = false
  let ownerId: string | undefined
  taskRegistry.update(taskId, task => {
    taskPresent = true
    ownerId = task.ownerAgentId // NEW: read owner off the task @445844
    if (task.notified) return task
    firstTimeNotified = true
    return { ...task, notified: true }
  })
  ownerId ??= ownerAgentId // NEW: fall back to the passed-in owner @445847

  // ── THE OWNER-ALIVE GATE (verbatim shape from @445848-445849) ──
  //   let m = f ? o.get(f) : undefined;                                 // @445848
  //   let g = (od(m) && YR(m) && !xr()) || (od(m) && m.status === "running"); // @445849
  // The owner counts as alive when it is a local agent AND either:
  //   (a) it is parked-completed (finished its own turn but kept alive by keepalive reasons) AND
  //       we are NOT headless — only an interactive user can "send it another message and resume
  //       it", so in a headless run a parked owner is allowed to wind down; or
  //   (b) it is currently running.
  const owner = ownerId ? taskRegistry.get(ownerId) : undefined // @445848
  const ownerAlive =
    (isLocalAgent(owner) && isCompletedButKeptAlive(owner) && !isHeadless()) ||
    (isLocalAgent(owner) && owner.status === 'running') // @445849

  // NEW: release THIS child's keepalive pin from the owner — UNLESS this is the first notification
  // to a live owner. Read contrapositively: the pin is RETAINED only when (firstTimeNotified &&
  // ownerAlive). In every other case (re-notification, or a dead owner) the pin is dropped, and
  // `removeKeepaliveReason` schedules the owner's deferred eviction once it was the last pin. So a
  // live owner keeps its `agent:` pin until it itself is done. // @445850
  if (!(firstTimeNotified && ownerAlive)) {
    removeKeepaliveReason(ownerId, `${AGENT_KEEPALIVE_PREFIX}${taskId}`, taskRegistry)
  }

  // 88 dedupe early-out (skip already-notified / absent tasks). // @445851-445857
  if (!firstTimeNotified) {
    log(
      `[enqueueAgentNotification] skipped taskId=${taskId} status=${status} taskPresent=${taskPresent} ` +
        `reason=${taskPresent ? 'already-notified' : 'task-not-in-registry'}`,
      { level: taskPresent ? 'debug' : 'warn' },
    )
    return
  }

  // Background task state changed ⇒ discard any speculated response (carryover). // @445858
  taskRegistry.abortSpeculation()

  // Summary wording CHANGED in v2.1.183 to the "came to rest" phrasing (88: "completed" /
  // "failed: X" / "was stopped"). // @445859-445864
  const summary =
    status === 'completed'
      ? `Agent "${description}" came to rest`
      : status === 'failed'
        ? `Agent "${description}" came to rest with an error: ${error || 'Unknown error'}`
        : `Agent "${description}" came to rest (stopped by user)`

  // `fg(taskId)` (@575229) = the task's on-disk output file path; tag = <output-file> (bM). // @445865
  const outputPath = getTaskOutputPath(taskId)
  const toolUseIdLine = toolUseId ? `\n<${TOOL_USE_ID_TAG}>${toolUseId}</${TOOL_USE_ID_TAG}>` : '' // @445866-445869
  const resultSection = finalMessage ? `\n<result>${escapeXml(finalMessage)}</result>` : '' // @445870-445873
  const usageSection = usage
    ? `\n<usage><subagent_tokens>${usage.totalTokens}</subagent_tokens>` +
      `<tool_uses>${usage.toolUses}</tool_uses><duration_ms>${usage.durationMs}</duration_ms></usage>`
    : '' // @445874-445877
  const worktreeSection = worktreePath
    ? `\n<${WORKTREE_TAG}><${WORKTREE_PATH_TAG}>${worktreePath}</${WORKTREE_PATH_TAG}>` +
      `${worktreeBranch ? `<${WORKTREE_BRANCH_TAG}>${worktreeBranch}</${WORKTREE_BRANCH_TAG}>` : ''}</${WORKTREE_TAG}>`
    : '' // @445878-445881

  // The NEW <note> — verbatim from cli_inner_pretty.js:445887 (byte-exact; grep in 2.1.156 = 0).
  // It is the user-/model-facing contract for the new parked/resumable/child-gated lifecycle:
  //  - a notification fires EACH TIME the agent comes to rest (not only at final completion),
  //  - precisely when it has "no live background children of its own" (the `agent:`-keepalive
  //    condition — see hasLiveChildAgents), and
  //  - the same task-id MAY notify more than once (because the agent can be resumed).
  const note =
    '<note>A task-notification fires each time this agent comes to rest with no live background children of its own. The user can send it another message and resume it, so the same task-id may notify more than once.</note>'

  const xml =
    `<${TASK_NOTIFICATION_TAG}>\n` +
    `<${TASK_ID_TAG}>${taskId}</${TASK_ID_TAG}>${toolUseIdLine}\n` +
    `<${OUTPUT_FILE_TAG}>${outputPath}</${OUTPUT_FILE_TAG}>\n` +
    `<${STATUS_TAG}>${status}</${STATUS_TAG}>\n` +
    `<${SUMMARY_TAG}>${escapeXml(summary)}</${SUMMARY_TAG}>\n` +
    `${note}${resultSection}${usageSection}${worktreeSection}\n` +
    `</${TASK_NOTIFICATION_TAG}>` // @445882-445888

  // ── THE ROUTING (NEW @445889) — `agentId: g && f ? If(f) : Ls()` ──
  // If the owner is alive, address the notification TO THE OWNER agent (toAgentId(ownerId)) so it
  // lands in the owner's own pending-message queue and the owner stays in the picture; otherwise
  // route to the main session (mainAgentId()). In 88 the enqueue carried NO agentId at all.
  enqueuePendingNotification({
    value: xml,
    mode: 'task-notification',
    priority: 'next',
    agentId: ownerAlive && ownerId ? toAgentId(ownerId) : mainAgentId(), // @445889
    taskId,
  })
}

// ============================================================================
// Owner-reap reroute + kill/finalize paths (where the owner predicate lives)
// ============================================================================

/**
 * 2.1.183: reparentOwnedNotifications = Gmo @445891
 *
 * When an owner agent `agentId` is being reaped, re-route any of ITS queued task-notifications
 * (notifications whose underlying task is owned by `agentId`) back to the main session, so the
 * children's completions are not lost with the dying owner.
 *
 * THE OWNER PREDICATE (verbatim @445897): `return od(s) && s.ownerAgentId === e;`
 *   — a queued task-notification belongs to this owner iff its underlying task is a local agent
 *     whose `ownerAgentId` is `e` (the owner being reaped).
 *
 * Guard @445893: if the owner is itself parked-completed in an interactive session
 * (`isCompletedButKeptAlive(owner) && !isHeadless()`), DO NOTHING — the owner is still resumable
 * and should keep receiving its children's notifications (the survival case). Only a genuinely
 * dead owner has its children's notifications rerouted to the main session.
 */
export function reparentOwnedNotifications(agentId: string, reg: TaskRegistry): void {
  const owner = reg.get(agentId)
  // Parked-and-interactive owner is still alive ⇒ leave its notifications addressed to it. // @445893
  if (isLocalAgent(owner) && isCompletedButKeptAlive(owner) && !isHeadless()) return

  const matching = dequeueAllMatching(entry => {
    if (entry.mode !== 'task-notification' || entry.agentId !== toAgentId(agentId)) return false // @445895
    const child = entry.taskId ? reg.get(entry.taskId) : undefined // @445896
    return isLocalAgent(child) && child.ownerAgentId === agentId // @445897 — the owner predicate
  })
  for (const entry of matching) {
    enqueuePendingNotification({ ...entry, agentId: mainAgentId() } as Parameters<typeof enqueuePendingNotification>[0]) // @445899
  }
}

/**
 * 2.1.183: finalizeAndKillAgentTask = e0e @445901
 *
 * Finalize (and kill) an agent task. If the task is a parked-completed agent that was never
 * notified, FIRST emit its (killed) task-notification via `buildTaskNotification` — passing
 * `ownerAgentId` so routing still works (@445916). Then transition the task to "killed", clearing
 * its keepalive reasons and computing eviction with `park: false` (a hard kill does not park).
 * Finally reparent any of its still-queued owned notifications to the main session. // @445940
 *
 * 88 ancestor: `killAsyncAgent` (LocalAgentTask.tsx:281-303). 183 adds the parked-completed
 * pre-notification (e0e @445903-445918) and the `reparentOwnedNotifications` call (@445940).
 */
export function finalizeAndKillAgentTask(taskId: string, reg: TaskRegistry): void {
  const task = reg.get(taskId)
  // A parked-completed, un-notified agent gets its killed-notification emitted before teardown. // @445903
  if (isLocalAgent(task) && isCompletedButKeptAlive(task) && !task.notified) {
    const result = task.result
    buildTaskNotification({
      taskId,
      description: task.description ?? '',
      status: 'killed',
      taskRegistry: reg,
      finalMessage: result ? result.content.map(b => b.text).join('\n') : undefined, // @445910-445913
      usage: result
        ? { totalTokens: result.totalTokens, toolUses: result.totalToolUseCount, durationMs: result.totalDurationMs }
        : undefined, // @445914
      toolUseId: task.toolUseId,
      ownerAgentId: task.ownerAgentId, // @445916
    })
  }

  let killed = false
  reg.update(taskId, t => {
    // Kill running tasks AND parked-completed tasks (YR) — the latter are the survival case. // @445922
    if (t.status !== 'running' && !isCompletedButKeptAlive(t)) return t
    killed = true
    t.abortController?.abort() // @445925
    return {
      ...t,
      status: 'killed',
      notified: t.notified || isCompletedButKeptAlive(t), // @445929
      endTime: Date.now(),
      keepaliveReasons: new Set(), // drop all pins on hard kill @445931
      evictAfter: computeEvictAfter(t, { park: false }), // @445932 — park:false ⇒ always schedule
      abortController: undefined,
      selectedAgent: undefined,
    }
  })
  if (killed) {
    reparentOwnedNotifications(taskId, reg) // @445940
    // (i_(e) @445940 — evict the task's on-disk output — omitted: out of this unit's scope.)
  }
}

/**
 * 2.1.183: killAllAgentTasks = VYa @445942
 * Reap parked-completed agents first (so their notifications are emitted), then any still-running
 * local agents. Used by ESC cancellation in coordinator mode to stop all subagents.
 * 88 ancestor: `killAllRunningAgentTasks` (LocalAgentTask.tsx:309-315).
 */
export function killAllAgentTasks(tasks: Record<string, TaskState>, reg: TaskRegistry): void {
  for (const [taskId, task] of Object.entries(tasks)) {
    if (isLocalAgent(task) && isCompletedButKeptAlive(task)) finalizeAndKillAgentTask(taskId, reg) // @445943
  }
  for (const [taskId, task] of Object.entries(tasks)) {
    if (task.type === 'local_agent' && task.status === 'running') finalizeAndKillAgentTask(taskId, reg) // @445944
  }
}

export type { TaskRegistry, TaskState, AgentNotificationArgs, AgentId }
