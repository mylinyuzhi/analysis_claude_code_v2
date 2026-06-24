/**
 * Teammate Mailbox — file-based per-recipient JSON inbox (v2.1.183).
 *
 * Each teammate (leader or worker) owns exactly one inbox file at
 *   <teamsDir>/<team>/inboxes/<agent>.json
 * Other agents append messages to it under an advisory file lock; the recipient
 * polls that file every 500 ms. This single primitive is the lowest-common-
 * denominator transport that works uniformly across an in-process async boundary
 * AND a cross-process OS boundary, so the whole agent-team subsystem (SendMessage,
 * idle notifier, shutdown path, permission bridge) bottoms out in `writeToMailbox`.
 *
 * 2.1.183 regions covered (all cli_inner_pretty.js):
 *   - getInboxPath          v4e  @365916-365922
 *   - ensureInboxDir        Kyp  @365923-365929
 *   - readMailbox           Fhe  @365930-365944
 *   - readUnreadMessages    T4e  @365945-365949
 *   - writeToMailbox        $A   @365950-365976
 *   - markSingleMessageAsRead aUt @365977-366003
 *   - messageKey            Ilt  @366004-366006
 *   - markMessagesAsRead    w4e  @366007-366038
 *   - clearInbox            lUt  @366039-366053
 *   - formatAsTeammateXml   xlt  @366054-366061
 *   - formatMessagesAsTeammateXml klt @366062-366065
 *   - getTeamsDir           Gbe  @735   (= path.join(getConfigDir(), "teams"))
 *   - sanitizePathComponent dst  @299071
 *   - getTeamName           zp   @103460
 *   - LOCK_OPTIONS          iUt  @366363  ({retries:{retries:10,minTimeout:5,maxTimeout:100}, onCompromised})
 *   - TEAMMATE_MESSAGE_TAG  hN   @45671  ("teammate-message")
 *
 * 2.1.88 ancestor mirrored: utils/teammateMailbox.ts (file helpers) + utils/constants/xml.ts
 *   NOTE: 88 had `markMessageAsReadByIndex` (flip a `read` flag in place); v2.1.183 replaced the
 *   "consume" side with `markSingleMessageAsRead` (splice the matched message + drop all read ones)
 *   and `markMessagesAsRead` (prune everything except undelivered) — both reconstructed from the 183
 *   bundle, not from 88.
 *
 * scaffold: 30_agent_team/mailbox_lifecycle_and_sendmessage_delta.md §1 (proves identity of $A);
 *           baseline 30_agent_team/mailbox_and_lifecycle_tools.md §1 (v2.1.156 design rationale).
 * cross-val: re-read every function body @365916-366065 in the 183 bundle; confirmed getTeamsDir is
 *   `path.join(getConfigDir(),"teams")` with NO literal ".claude/teams" string, LOCK_OPTIONS retry
 *   config @366363, and the EEXIST-tolerant pre-create + re-read-under-lock control flow of $A.
 *
 * Helper mapping confirmed in the bundle:
 *   ci  = fs                  (@96215: AsyncLocalStorage fs store, .read/.mkdir/.writeExclusive/.atomicWrite)
 *   Gt  = jsonParse           (@9506)
 *   Re  = jsonStringify       (@9461)
 *   dn  = getErrnoCode        (@8835: reads error.code)
 *   De  = logError
 *   v   = logForDebugging
 *   $h  = lockfile.lock       (proper-lockfile; `await $h(path, {lockfilePath, ...iUt})`)
 *   Wn  = count               (@36216)
 *   bp  = escapeXmlAttribute  (@234072: escapeXml + " -> &quot;, ' -> &apos;)
 *   xnt = escapeXmlClosingTag (@234076: neutralizes `</tag` inside text)
 *   Kp  = escapeXml           (@234069: & < >)
 */

import { mkdir } from 'fs/promises'
import { join } from 'path'
import { TEAMMATE_MESSAGE_TAG } from '../constants/xml.js'
import { count } from './array.js'
import { logForDebugging } from './debug.js'
import { getTeamsDir } from './envUtils.js'
import { getErrnoCode } from './errors.js'
import { fs } from './fs.js'
import * as lockfile from './lockfile.js'
import { logError } from './log.js'
import {
  escapeXml,
  escapeXmlAttribute,
  escapeXmlClosingTag,
} from './messageXml.js'
import { jsonParse, jsonStringify } from './slowOperations.js'
import { sanitizePathComponent } from './tasks.js'
import { getTeamName } from './teammate.js'

// 2.1.183: LOCK_OPTIONS = iUt @cli_inner_pretty.js:366363
/**
 * proper-lockfile retry/backoff config. A contended writer retries with backoff
 * (up to 10 attempts, 5–100 ms) rather than failing immediately, which is what
 * serializes concurrent writes (leader + multiple workers) to the same inbox.
 * `onCompromised` logs but does not throw, so a stale-lock takeover is non-fatal.
 */
const LOCK_OPTIONS = {
  retries: { retries: 10, minTimeout: 5, maxTimeout: 100 },
  onCompromised: (error: unknown) => logError(error),
}

/**
 * One message object as stored in an inbox file. Chat messages carry
 * `type:"message"`; serialized control frames are written with their own `type`
 * but still flow through `writeToMailbox`, so the on-disk array is heterogeneous.
 */
export type TeammateMessage = {
  from: string
  text: string
  timestamp: string
  read: boolean
  type?: string
  color?: string
  summary?: string
}

// 2.1.183: getInboxPath = v4e @cli_inner_pretty.js:365916
/**
 * Resolve a teammate's inbox file path:
 *   <teamsDir>/<safeTeam>/inboxes/<safeAgent>.json
 * Both the team name and the agent name are sanitized (non `[a-zA-Z0-9_-]` -> "-")
 * so an arbitrary agent/team name can never escape the inbox directory.
 */
export function getInboxPath(agentName: string, teamName?: string): string {
  // @365917: team falls back to the AsyncLocalStorage/env team, then "default"
  const team = teamName || getTeamName() || 'default'
  const safeTeam = sanitizePathComponent(team) // dst
  const safeAgent = sanitizePathComponent(agentName)
  const inboxDir = join(getTeamsDir(), safeTeam, 'inboxes')
  const fullPath = join(inboxDir, `${safeAgent}.json`)
  logForDebugging(
    `[TeammateMailbox] getInboxPath: agent=${agentName}, team=${team}, fullPath=${fullPath}`,
  )
  return fullPath
}

// 2.1.183: ensureInboxDir = Kyp @cli_inner_pretty.js:365923
/** `mkdir -p` of `<teamsDir>/<safeTeam>/inboxes`. */
async function ensureInboxDir(teamName?: string): Promise<void> {
  const team = teamName || getTeamName() || 'default'
  const safeTeam = sanitizePathComponent(team)
  const inboxDir = join(getTeamsDir(), safeTeam, 'inboxes')
  await fs().mkdir(inboxDir) // recursive mkdir via the fs wrapper
  logForDebugging(`[TeammateMailbox] Ensured inbox directory: ${inboxDir}`)
}

// 2.1.183: readMailbox = Fhe @cli_inner_pretty.js:365930
/**
 * Read+parse the whole inbox array. Tolerates two non-fatal failure modes:
 *   - ENOENT (no inbox yet)             -> []
 *   - SyntaxError (half-written/corrupt) -> []  (treat as empty rather than crash)
 * Also back-fills a missing `type` field to "message" (@365936) so older entries
 * are treated as chat — a forward-compat shim.
 */
export async function readMailbox(
  agentName: string,
  teamName?: string,
): Promise<TeammateMessage[]> {
  const inboxPath = getInboxPath(agentName, teamName)
  logForDebugging(`[TeammateMailbox] readMailbox: path=${inboxPath}`)
  try {
    const content = await fs().read(inboxPath)
    const messages = jsonParse(content) as TeammateMessage[]
    // @365936: back-fill missing type -> "message"
    for (const m of messages) {
      if (m && m.type === undefined) m.type = 'message'
    }
    logForDebugging(
      `[TeammateMailbox] readMailbox: read ${messages.length} message(s)`,
    )
    return messages
  } catch (error) {
    if (getErrnoCode(error) === 'ENOENT') {
      logForDebugging(`[TeammateMailbox] readMailbox: file does not exist`)
      return []
    }
    if (error instanceof SyntaxError) {
      logForDebugging(
        `[TeammateMailbox] readMailbox: unparseable inbox, treating as empty: ${error}`,
      )
      return []
    }
    logForDebugging(`Failed to read inbox for ${agentName}: ${error}`)
    logError(error)
    return []
  }
}

// 2.1.183: readUnreadMessages = T4e @cli_inner_pretty.js:365945
/** `readMailbox(...).filter(m => !m.read)`. */
export async function readUnreadMessages(
  agentName: string,
  teamName?: string,
): Promise<TeammateMessage[]> {
  const messages = await readMailbox(agentName, teamName)
  const unread = messages.filter(m => !m.read)
  logForDebugging(
    `[TeammateMailbox] readUnreadMessages: ${unread.length} unread of ${messages.length} total`,
  )
  return unread
}

// 2.1.183: writeToMailbox = $A @cli_inner_pretty.js:365950
/**
 * The universal send. Must tolerate N agents writing to the same inbox at once.
 *
 * Steps (byte-confirmed @365950-365976):
 *   1. ensureInboxDir
 *   2. pre-create the file EXCLUSIVELY with "[]" (writeExclusive = 'wx' flag);
 *      swallow EEXIST — proper-lockfile needs the lockee file to exist first.
 *   3. take the per-inbox lock with LOCK_OPTIONS.
 *   4. RE-READ the array under the lock (so concurrent appends aren't lost).
 *   5. push {...message, type:"message", read:false}.
 *   6. atomic-write the pretty-printed JSON.
 *   7. release the lock in finally.
 *
 * The re-read under lock is what makes the file safe as a multi-writer queue: a
 * second writer sees the first writer's append after acquiring the lock. The lock
 * is per-inbox (`<inboxPath>.lock`), so writes to different recipients never contend.
 */
export async function writeToMailbox(
  recipientName: string,
  message: Omit<TeammateMessage, 'read' | 'type'>,
  teamName?: string,
): Promise<void> {
  await ensureInboxDir(teamName)
  const inboxPath = getInboxPath(recipientName, teamName)
  const lockFilePath = `${inboxPath}.lock`
  logForDebugging(
    `[TeammateMailbox] writeToMailbox: recipient=${recipientName}, from=${message.from}, path=${inboxPath}`,
  )

  // @365955: pre-create so proper-lockfile has a lockee; EEXIST is fine.
  try {
    await fs().writeExclusive(inboxPath, '[]')
    logForDebugging(`[TeammateMailbox] writeToMailbox: created new inbox file`)
  } catch (error) {
    if (getErrnoCode(error) !== 'EEXIST') {
      logForDebugging(
        `[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error}`,
      )
      logError(error)
      return
    }
  }

  let release: (() => Promise<void>) | undefined
  try {
    release = await lockfile.lock(inboxPath, {
      lockfilePath: lockFilePath,
      ...LOCK_OPTIONS,
    })
    const messages = await readMailbox(recipientName, teamName) // RE-READ under lock
    const newMessage: TeammateMessage = { ...message, type: 'message', read: false }
    messages.push(newMessage)
    await fs().atomicWrite(inboxPath, jsonStringify(messages, null, 2))
    logForDebugging(
      `[TeammateMailbox] Wrote message to ${recipientName}'s inbox from ${message.from}`,
    )
  } catch (error) {
    logForDebugging(`Failed to write to inbox for ${recipientName}: ${error}`)
    logError(error)
  } finally {
    if (release) await release()
  }
}

// 2.1.183: markSingleMessageAsRead = aUt @cli_inner_pretty.js:365977
/**
 * The "consume one" op. Unlike the v2.1.88 `markMessageAsReadByIndex` (which
 * flipped a `read` flag in place), v2.1.183 SPLICES out the matched unread
 * message and then DROPS all already-read messages, keeping only undelivered
 * ones (@365988-365991). The match key is the (from, timestamp, text) triple.
 * ENOENT is swallowed; the lock is released in finally.
 */
export async function markSingleMessageAsRead(
  agentName: string,
  teamName: string | undefined,
  target: TeammateMessage,
): Promise<void> {
  const inboxPath = getInboxPath(agentName, teamName)
  logForDebugging(
    `[TeammateMailbox] markSingleMessageAsRead called: agentName=${agentName}, teamName=${teamName}, target=${target.from}@${target.timestamp}, path=${inboxPath}`,
  )
  const lockFilePath = `${inboxPath}.lock`
  let release: (() => Promise<void>) | undefined
  try {
    release = await lockfile.lock(inboxPath, {
      lockfilePath: lockFilePath,
      ...LOCK_OPTIONS,
    })
    const messages = await readMailbox(agentName, teamName)
    // @365988: find the matching unread message by (from, timestamp, text)
    const idx = messages.findIndex(
      m =>
        !m.read &&
        m.from === target.from &&
        m.timestamp === target.timestamp &&
        m.text === target.text,
    )
    if (idx !== -1) messages.splice(idx, 1)
    // @365990: keep only still-unread messages (prune everything already consumed)
    const remaining = messages.filter(m => !m.read)
    await fs().atomicWrite(inboxPath, jsonStringify(remaining, null, 2))
    logForDebugging(
      `[TeammateMailbox] markSingleMessageAsRead: dropped target (${idx === -1 ? 'not found' : 'found'}); ${remaining.length} remain at ${inboxPath}`,
    )
  } catch (error) {
    if (getErrnoCode(error) === 'ENOENT') {
      logForDebugging(
        `[TeammateMailbox] markSingleMessageAsRead: file does not exist at ${inboxPath}`,
      )
      return
    }
    logForDebugging(
      `[TeammateMailbox] markSingleMessageAsRead FAILED for ${agentName}: ${error}`,
    )
    logError(error)
  } finally {
    if (release) await release()
  }
}

// 2.1.183: messageKey = Ilt @cli_inner_pretty.js:366004
/** Stable de-dupe key for a message: `${from}|${timestamp}|${text}`. */
function messageKey(m: TeammateMessage): string {
  return `${m.from}|${m.timestamp}|${m.text}`
}

// 2.1.183: markMessagesAsRead = w4e @cli_inner_pretty.js:366007
/**
 * The "consume a batch" op. Given the set of messages that were just delivered
 * (`delivered`), prune the inbox to keep ONLY unread messages that are NOT in
 * that delivered set (@366029-366031). When `delivered` is undefined the
 * comparison set is null and nothing is kept (every unread is pruned). No-op on
 * an empty inbox; ENOENT swallowed; lock released in finally.
 */
export async function markMessagesAsRead(
  agentName: string,
  teamName: string | undefined,
  delivered?: TeammateMessage[],
): Promise<void> {
  const inboxPath = getInboxPath(agentName, teamName)
  logForDebugging(
    `[TeammateMailbox] markMessagesAsRead called: agentName=${agentName}, teamName=${teamName}, path=${inboxPath}`,
  )
  const lockFilePath = `${inboxPath}.lock`
  let release: (() => Promise<void>) | undefined
  try {
    logForDebugging(`[TeammateMailbox] markMessagesAsRead: acquiring lock...`)
    release = await lockfile.lock(inboxPath, {
      lockfilePath: lockFilePath,
      ...LOCK_OPTIONS,
    })
    logForDebugging(`[TeammateMailbox] markMessagesAsRead: lock acquired`)
    const messages = await readMailbox(agentName, teamName)
    logForDebugging(
      `[TeammateMailbox] markMessagesAsRead: read ${messages.length} messages after lock`,
    )
    if (messages.length === 0) {
      logForDebugging(`[TeammateMailbox] markMessagesAsRead: no messages to mark`)
      return
    }
    const unreadCount = count(messages, m => !m.read) // Wn
    logForDebugging(
      `[TeammateMailbox] markMessagesAsRead: ${unreadCount} unread of ${messages.length} total`,
    )
    // @366029: keep unread messages NOT in the delivered set.
    const deliveredKeys =
      delivered === undefined ? null : new Set(delivered.map(messageKey))
    const remaining = messages.filter(
      m => !m.read && deliveredKeys !== null && !deliveredKeys.has(messageKey(m)),
    )
    await fs().atomicWrite(inboxPath, jsonStringify(remaining, null, 2))
    logForDebugging(
      `[TeammateMailbox] markMessagesAsRead: pruned ${messages.length - remaining.length} delivered message(s), ${remaining.length} remain at ${inboxPath}`,
    )
  } catch (error) {
    if (getErrnoCode(error) === 'ENOENT') {
      logForDebugging(
        `[TeammateMailbox] markMessagesAsRead: file does not exist at ${inboxPath}`,
      )
      return
    }
    logForDebugging(
      `[TeammateMailbox] markMessagesAsRead FAILED for ${agentName}: ${error}`,
    )
    logError(error)
  } finally {
    if (release) {
      await release()
      logForDebugging(`[TeammateMailbox] markMessagesAsRead: lock released`)
    }
  }
}

// 2.1.183: clearInbox = lUt @cli_inner_pretty.js:366039
/** Atomically reset an inbox to "[]" under the lock. ENOENT swallowed. */
export async function clearInbox(
  agentName: string,
  teamName?: string,
): Promise<void> {
  const inboxPath = getInboxPath(agentName, teamName)
  const lockFilePath = `${inboxPath}.lock`
  let release: (() => Promise<void>) | undefined
  try {
    release = await lockfile.lock(inboxPath, {
      lockfilePath: lockFilePath,
      ...LOCK_OPTIONS,
    })
    await fs().atomicWrite(inboxPath, '[]')
    logForDebugging(`[TeammateMailbox] Cleared inbox for ${agentName}`)
  } catch (error) {
    if (getErrnoCode(error) === 'ENOENT') return
    logForDebugging(`Failed to clear inbox for ${agentName}: ${error}`)
    logError(error)
  } finally {
    await release?.()
  }
}

// 2.1.183: formatAsTeammateXml = xlt @cli_inner_pretty.js:366054
/**
 * Render one inbox message into a `<teammate-message …>` envelope. The `from`,
 * `color`, and `summary` attributes are XML-attribute-escaped (bp); the body is
 * run through `escapeXmlClosingTag` (xnt) so a literal `</teammate-message` inside
 * the message text cannot prematurely close the envelope.
 */
export function formatAsTeammateXml(m: TeammateMessage): string {
  const colorAttr = m.color ? ` color="${escapeXmlAttribute(m.color)}"` : ''
  const summaryAttr = m.summary
    ? ` summary="${escapeXmlAttribute(m.summary)}"`
    : ''
  const body = escapeXmlClosingTag(TEAMMATE_MESSAGE_TAG, m.text)
  return `<${TEAMMATE_MESSAGE_TAG} teammate_id="${escapeXmlAttribute(m.from)}"${colorAttr}${summaryAttr}>
${body}
</${TEAMMATE_MESSAGE_TAG}>`
}

// 2.1.183: formatMessagesAsTeammateXml = klt @cli_inner_pretty.js:366062
/**
 * Render an array of messages into stacked `<teammate-message>` envelopes joined
 * by blank lines. When the recipient is the team lead, the result is wrapped via
 * `nUt(...)` (the lead-facing relay wrapper, out of scope here) — otherwise
 * returned as-is.
 *
 * NOTE: `wrapForLead` (nUt) lives outside this unit; only its call site is shown.
 */
export function formatMessagesAsTeammateXml(
  messages: TeammateMessage[],
  options: { recipientIsLead: boolean },
): string {
  const rendered = messages.map(formatAsTeammateXml).join('\n\n')
  // @366064: lead gets the relay wrapper; everyone else gets the raw envelopes.
  return options.recipientIsLead
    ? wrapForLead(rendered, { midTurn: false })
    : rendered
}

// UNVERIFIED-as-local: wrapForLead (nUt @cli_inner_pretty.js, called @366064) is defined elsewhere
// (lead-relay wrapper). Declared here only so this file type-checks in isolation.
declare function wrapForLead(content: string, options: { midTurn: boolean }): string

// Re-export the XML escape helper used by callers of this module for envelope text.
export { escapeXml }

// Mapping:
//   v4e->getInboxPath, Kyp->ensureInboxDir, Fhe->readMailbox, T4e->readUnreadMessages,
//   $A->writeToMailbox, aUt->markSingleMessageAsRead, Ilt->messageKey, w4e->markMessagesAsRead,
//   lUt->clearInbox, xlt->formatAsTeammateXml, klt->formatMessagesAsTeammateXml,
//   iUt->LOCK_OPTIONS, hN->TEAMMATE_MESSAGE_TAG, dst->sanitizePathComponent, zp->getTeamName,
//   Gbe->getTeamsDir, ci->fs, Gt->jsonParse, Re->jsonStringify, dn->getErrnoCode, De->logError,
//   v->logForDebugging, $h->lockfile.lock, Wn->count, bp->escapeXmlAttribute,
//   xnt->escapeXmlClosingTag, Kp->escapeXml, nUt->wrapForLead
