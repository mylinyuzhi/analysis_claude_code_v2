/**
 * journal.ts — Workflow resume protocol: append-only `journal.jsonl`, deterministic
 * SHA-256 cache key, longest-unchanged-prefix replay, respawn detection, and the
 * `/workflows` history snapshot writer/reader.
 *
 * This is a *readable-source-level* restoration of the v2.1.183 Dynamic-Workflow resume
 * machine. The contract (from the Workflow tool description @cli_inner_pretty.js:418328) is:
 *
 *   "To resume after a pause, kill, or script edit, relaunch with
 *    Workflow({scriptPath, resumeFromRunId}) — the longest unchanged prefix of agent()
 *    calls returns cached results instantly; the first edited/new call and everything
 *    after it runs live. Same script + same args → 100% cache hit."
 *
 * This only works because workflow scripts are deterministic: `Date.now()`/`Math.random()`/
 * `new Date()` are unavailable inside the VM sandbox (and statically flagged by
 * `isNonDeterministic` in meta.ts), so the same inputs always re-emit the same `agent()`
 * call sequence and therefore the same per-call cache keys. The journal turns that property
 * into a content-addressed cache: each `agent()` call hashes `(phaseTitle, prompt, canonical
 * opts)` into a key; if a prior run wrote a `result` line for that key, the result is replayed
 * instantly with no subagent spawned. The FIRST key with no cached result flips a one-way
 * `diverged` flag, after which every subsequent call runs live — that flag IS the
 * "longest unchanged prefix" rule. If a key was *started* but never produced a result, the
 * prior run crashed mid-agent: that's a respawn, telemetered via
 * `tengu_workflow_journal_started_hit_respawn`.
 *
 * Separate from the journal (which enables *resume*) is the run **snapshot**: on completion
 * the `call` handler writes a single `<runId>.json` under the session `workflows/` dir; that
 * feeds the `/workflows` history viewer. Both are reconstructed here.
 *
 * NOTE ON SCOPE: in the actual bundle the per-`agent()` cache-hit / respawn / journal-append
 * wiring lives *inside* the VM-bridge factory `EWa` (@416901-417087), interleaved with the
 * runtime dispatch in runtime.ts / subagents.ts. This file restores the journal-domain pieces
 * (journal I/O, index, key derivation, the cache-hit decision, snapshot I/O, path helpers) as
 * standalone, testable functions, and documents the exact lines they were lifted from so a
 * reviewer can re-stitch them into the dispatch loop.
 *
 * ── Evidence tiers (see _conventions.md) ─────────────────────────────────────────────
 *
 * PRIMARY (truth — every line below was read directly in the 183 bundle):
 *   /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
 *     LocalFileJournal class        ldo   @416833-416868  (path = Out(runId)/journal.jsonl; load/append)
 *     indexJournal                  pWa   @416787-416798  (fold lines → {results, started})
 *     canonicalizeAgentOpts         z0p   @416799-416828  (whitelist + recursive key-sort; __proto__ drop)
 *     journalKey                    mWa   @416829-416832  (sha256(phase \0 prompt \0 canonOpts); "v2:"+hex)
 *     JOURNAL_KEY_VERSION           V0p   @416872         ("v2")
 *     cache-hit / respawn / append  (in EWa) @416997-417040
 *         key compute + cursor advance        @416998       se = journalKey(prompt, opts, cursor); cursor = se
 *         cached lookup (gated on !diverged)   @416999       Ae = m ? void 0 : l?.results.get(se)
 *         cached return (cached:true, "done")  @417000-417022
 *         diverge flag + respawn telemetry     @417023-417025  m = !0; started.get(se) → respawn event
 *         started-append callback (de)         @417027-417033  journal.append({type:"started",key,agentId})
 *         result-append wrapper (ye)           @417034-417040  journal.append({type:"result",key,agentId,result})
 *     writeWorkflowSnapshot         uWa   @416721-416730  (mkdir 0o700 + writeFile 0o600 <runId>.json)
 *     listWorkflowSnapshots         dWa   @416731-416778  (readdir, tolerant parse, defaults, sort newest-first)
 *     snapshot path helper          q0p   @416710-416712  (workflows/<runId>.json)
 *     workflows dir helper          cWa   @416713-416716  (<projects>/<dir>/workflows)
 *     subagent run dir helper       Out   @416717-416720  (<projects>/<dir>/subagents/workflows/<runId>)
 *     preview truncation            XGe   @416895-416900  (trim + slice to AWa=400 + ellipsis)
 *     AGENT_PREVIEW_MAX            AWa   @417722         (400; owned by constants.ts, imported here)
 *     journal load in runner        MWa   @418086         (index = opts.journal ? await journal.load() : undefined)
 *     journal threaded into bridge  DWa   @418027         (EWa(... journal=a, index=l))
 *     journal instance created      ldo   @419649         (journal: new LocalFileJournal(runId))
 *     snapshot record written       uWa   @419714-419734  (full completed-run record)
 *     resume contract string        gdo   @418328         (longest-unchanged-prefix / 100% cache hit)
 *     determinism rationale         @419465              ("breaks resume")
 *     resumeFromRunId schema         @419363-419367      (same-session-only; cached unchanged calls)
 *
 * 2.1.88 CONVENTION MIRROR (shape only — Workflow stripped behind feature('WORKFLOW_SCRIPTS')):
 *   /lyz/codespace/3rd/claude-code/src/utils/filePersistence/filePersistence.ts
 *     — async-fs orchestration idiom: try/await, `logError(...)` on failure, ESM `.js` imports.
 *   /lyz/codespace/3rd/claude-code/src/utils/fileHistory.ts
 *     — `import { createHash } from 'crypto'` + `import { isENOENT } from './errors.js'` idioms.
 *   /lyz/codespace/3rd/claude-code/src/tasks/types.ts (LocalWorkflowTask referenced via
 *     feature('WORKFLOW_SCRIPTS') and stripped) — only the `local_workflow` task shape is borrowed.
 *   The whole resume protocol (journal.jsonl, cache key, replay, respawn, snapshot) is NEW
 *   post-2.1.88 — there is no named-TS implementation to copy, only the file-layout / fs idioms.
 *
 * 2.1.156 SCAFFOLD (readable logic + established names; re-verified line-by-line against 183):
 *   /lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/42_workflow/
 *     gate_caps_lifecycle_relations.md — Part 4 (Journal, Respawn & Snapshot).
 *
 * ── Cross-validation note ─────────────────────────────────────────────────────────────
 * Re-verified against the 183 bundle and reconciled with the 2.1.156 Part-4 scaffold:
 *   • LocalFileJournal: path/load/append byte-identical to 2.1.156 `bp6` (only obf re-mangled
 *     bp6→ldo, x74→pWa, atH→Out, stH→Nut/fs, P8→Pn/isENOENT). Confirmed @416833-416868.
 *   • CACHE-KEY FIELDS CHANGED vs 2.1.156. The 156 scaffold listed the canonicalized opts as
 *     {schema, model, isolation, agentType}. In 183 the whitelist is
 *     ["schema","model","effort","isolation","agentType"] — `effort` was ADDED (@416802). This
 *     means two otherwise-identical agent() calls that differ only in `effort` now hash to
 *     different keys (so changing effort busts the cache, which is correct). Verified directly.
 *   • REPLAY RULE confirmed identical: a one-way `diverged` flag (obf `m`) gates `results.get`;
 *     once any call misses, `results` is never consulted again → longest-unchanged-prefix
 *     (@416999/417023). Key version prefix is still "v2" (@416872) — unchanged from 156.
 *   • RESPAWN DETECTION confirmed identical: `started.get(key)` is checked at the first miss; if
 *     a prior `started` (with no matching `result`) exists, emit
 *     tengu_workflow_journal_started_hit_respawn with attempts = started-entry count (@417024-417025).
 *   • SNAPSHOT writer/reader confirmed: mode 0o700 dir / 0o600 file, ISO timestamp, sort
 *     newest-first by startTime, tolerant per-file parse with field defaults (@416721-416778).
 *     The 183 record set is one row richer than the 156 doc captured: it also carries
 *     `status`, `startTime`, `phases`, `defaultModel`, `workflowProgress`, `totalTokens`,
 *     `totalToolCalls`, `title`, `summary`, `workflowName` (@419714-419734 / read defaults @416748-416770).
 * Mirrored 2.1.88 conventions: `crypto`/`fs/promises`/`path` named imports, ESM `.js`
 * specifiers, `logError`/`logEvent` helpers, async try/catch fs with logged-and-swallowed errors.
 */

import { createHash } from 'crypto'
import { mkdir, readFile, readdir, writeFile, appendFile } from 'fs/promises'
import { dirname, join } from 'path'

// Cross-file readable names (sourced from _conventions.md + sibling modules; import paths mirror
// the sibling reconstructions runtime.ts/source.ts):
//   logError      v   @cli_inner_pretty.js  ('../utils/log.js'        — as in runtime.ts)
//   logEvent      G   @cli_inner_pretty.js:3810  ('../utils/telemetry.js'; runtime.ts aliases it
//                 `logTelemetry`, keyword.ts uses `logEvent` — we follow the primer's `logEvent`)
//   isNotFound    Pn  @cli_inner_pretty.js:8860  ('../utils/errors.js' — as in source.ts; ENOENT)
import { logError } from '../utils/log.js'
import { logEvent } from '../utils/telemetry.js'
import { isNotFound } from '../utils/errors.js'
import { getWorkflowsDir, getWorkflowSubagentDir } from '../utils/workflowPaths.js'
import { AGENT_PREVIEW_MAX } from './constants.js' // AWa @417722 (= 400) — single source of truth

// ───────────────────────────────────────────────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────────────────────────────────────────────

// 2.1.183: JOURNAL_KEY_VERSION = V0p @416872
// Prefix on every cache key ("v2:<sha256hex>"). Bumping it invalidates *all* existing journals
// on a key-format change without touching the files on disk — a stale "v1:" key simply never
// matches a freshly-computed "v2:" key, so the whole prior run replays live.
export const JOURNAL_KEY_VERSION = 'v2'

// The preview truncation cap (AWa = 400 @417722, declared with X0p/_Wa/rLp in the executor constants
// block and consumed by truncatePreview/XGe @416899) is owned by ./constants.js as AGENT_PREVIEW_MAX,
// imported above. Used by truncatePreview below for the progress-tree prompt/result previews.

// 2.1.183: opts whitelist inside canonicalizeAgentOpts (z0p) @416802
// ONLY these opts participate in the cache key. Display-only opts (label, phase, stallMs, …) are
// deliberately excluded so relabeling/re-phasing an agent does NOT bust its cached result.
// NOTE: `effort` is present in 183 (it was absent in the 2.1.156 scaffold's field list) — see
// the cross-validation note. Changing an agent's effort therefore correctly invalidates its cache.
const CACHE_RELEVANT_OPT_KEYS = ['schema', 'model', 'effort', 'isolation', 'agentType'] as const

// ───────────────────────────────────────────────────────────────────────────────────────
// Journal entry / index types
// ───────────────────────────────────────────────────────────────────────────────────────

/** A `{type:"started"}` line: an agent() call began (written before the subagent runs). */
export interface JournalStartedEntry {
  type: 'started'
  key: string
  agentId: string
}

/** A `{type:"result"}` line: an agent() call completed (written after the subagent settles). */
export interface JournalResultEntry {
  type: 'result'
  key: string
  agentId: string
  result: unknown
}

export type JournalEntry = JournalStartedEntry | JournalResultEntry

/**
 * Folded view of a journal file.
 *   results: key → last result line  (the resume cache)
 *   started: key → every start attempt for that key (respawn detection counts these)
 *
 * Structurally compatible with runtime.ts `JournalIndex` (which declares `started` loosely as
 * `Map<string, string[]>`); here we keep the full started-entry objects so `attempts =
 * started.get(key)!.length` is exact (matches the 183 `he.length` at @417025).
 */
export interface JournalIndex {
  results: Map<string, JournalResultEntry>
  started: Map<string, JournalStartedEntry[]>
}

// ───────────────────────────────────────────────────────────────────────────────────────
// indexJournal — fold journal lines into the resume cache + start-attempt map
// ───────────────────────────────────────────────────────────────────────────────────────

/**
 * 2.1.183: indexJournal = pWa @416787-416798
 *
 * Fold the parsed JSONL lines into two maps:
 *   - results: last `result` write wins per key (the cached agent() output to replay).
 *   - started: append-accumulates *every* `started` line per key. A key present in `started`
 *     but absent from `results` is an agent that began but never finished — i.e. the prior run
 *     crashed mid-agent, which is exactly what respawn detection keys off.
 *
 * Last-write-wins for results is correct because a deterministic re-run produces the same key,
 * so the newest result line for a key is the authoritative one.
 */
export function indexJournal(entries: JournalEntry[]): JournalIndex {
  const results = new Map<string, JournalResultEntry>()
  const started = new Map<string, JournalStartedEntry[]>()
  for (const entry of entries) {
    if (entry.type === 'result') {
      results.set(entry.key, entry) // @416791  last write wins → cached result
    } else if (entry.type === 'started') {
      // @416792-416795  accumulate every start attempt for this key
      const list = started.get(entry.key)
      if (list) list.push(entry)
      else started.set(entry.key, [entry])
    }
  }
  return { results, started }
}

// ───────────────────────────────────────────────────────────────────────────────────────
// canonicalizeAgentOpts — stable, cache-relevant JSON of the agent() opts
// ───────────────────────────────────────────────────────────────────────────────────────

/**
 * 2.1.183: canonicalizeAgentOpts = z0p @416799-416828
 *
 * Produce a stable string of the cache-relevant subset of an agent()'s opts, so that the same
 * logical opts always hash to the same key regardless of property insertion order. The subtle
 * parts (all re-verified in 183):
 *
 *   1. Whitelist (@416802): only `schema`, `model`, `effort`, `isolation`, `agentType` are
 *      considered. Everything else (label, phase, stallMs, retries, …) is excluded so it can't
 *      perturb the cache. `undefined` values and function values are skipped (@416805).
 *   2. Recursive normalize (@416808-416826): arrays are mapped element-wise; objects have their
 *      keys *sorted* before re-emitting, so `{model:'x',schema:S}` and `{schema:S,model:'x'}`
 *      canonicalize identically. `__proto__` keys are dropped (@416820) to avoid prototype
 *      pollution feeding into the hash. Functions normalize to `undefined` (@416809), so e.g. a
 *      Zod schema's methods don't leak into the key.
 *   3. The safe-integer guard on array length (@416813) defends against a hostile/proxy `length`.
 *
 * The empty-opts fast path returns `"{}"` (@416800).
 */
export function canonicalizeAgentOpts(opts: Record<string, unknown> | undefined): string {
  if (!opts) return '{}' // @416800

  // @416801-416807  copy only the whitelisted, defined, non-function opts.
  const picked: Record<string, unknown> = {}
  for (const key of CACHE_RELEVANT_OPT_KEYS) {
    const value = opts[key]
    if (value === undefined || typeof value === 'function') continue // @416805
    picked[key] = value
  }

  // @416808-416826  recursively normalize: functions→undefined, arrays element-wise,
  //                 objects with sorted keys (and __proto__ stripped).
  const normalize = (node: unknown): unknown => {
    if (typeof node === 'function') return undefined // @416809
    if (Array.isArray(node)) {
      const out: unknown[] = []
      const rawLen = node.length
      const len = Number.isSafeInteger(rawLen) ? rawLen : 0 // @416813  hostile-length guard
      for (let i = 0; i < len; i++) out[i] = normalize(node[i])
      return out
    }
    if (node && typeof node === 'object') {
      const out: Record<string, unknown> = {}
      for (const key of Object.keys(node).sort()) {
        // @416819  sort keys for order-independence
        if (key === '__proto__') continue // @416820  prototype-pollution guard
        out[key] = normalize((node as Record<string, unknown>)[key])
      }
      return out
    }
    return node
  }

  return JSON.stringify(normalize(picked)) // @416827
}

// ───────────────────────────────────────────────────────────────────────────────────────
// journalKey — deterministic SHA-256 cache key from (phaseTitle, prompt, canonical opts)
// ───────────────────────────────────────────────────────────────────────────────────────

/**
 * 2.1.183: journalKey = mWa @416829-416832
 *
 * The content-addressed cache key for one agent() call. Hash order is
 *   phaseTitle  \0  prompt  \0  canonicalizeAgentOpts(opts)
 * with NUL separators so concatenation can't alias (e.g. ("ab","c") vs ("a","bc")). The
 * version prefix lets the team invalidate all journals on a format change.
 *
 * Note the argument order at the call site (@416998): `journalKey(prompt, opts, cursor)` —
 * the *prompt* is the first arg there and the running phase title (`cursor`) is the third; this
 * function's signature mirrors the hash *order* (phaseTitle first), and the caller passes its
 * own positional args accordingly. Kept faithful here: parameters are named for the hash slot.
 */
export function journalKey(prompt: string, opts: Record<string, unknown> | undefined, phaseTitle: string): string {
  const hex = createHash('sha256')
    .update(phaseTitle)
    .update('\x00')
    .update(prompt)
    .update('\x00')
    .update(canonicalizeAgentOpts(opts))
    .digest('hex')
  return `${JOURNAL_KEY_VERSION}:${hex}` // @416831  e.g. "v2:<64-hex>"
}

// ───────────────────────────────────────────────────────────────────────────────────────
// LocalFileJournal — append-only journal.jsonl per run
// ───────────────────────────────────────────────────────────────────────────────────────

/**
 * 2.1.183: LocalFileJournal = ldo @416833-416868
 *
 * Append-only JSONL log of `started`/`result` events for one workflow run, stored at
 * `<projects>/<dir>/subagents/workflows/<runId>/journal.jsonl`. JSONL is chosen so a crash
 * mid-run leaves a valid *prefix*: `load()` parses line-by-line and tolerates a torn last line
 * by skipping it (@416853-416855). A missing file (no journal yet) is not an error — it yields
 * an empty index (@416844). Directory creation is lazy (first append), so a pure-read load never
 * touches the filesystem layout.
 */
export class LocalFileJournal {
  readonly path: string
  private dirReady = false

  // 2.1.183: constructor @416836 — path = workflowSubagentDir(runId)/journal.jsonl
  constructor(runId: string) {
    this.path = join(getWorkflowSubagentDir(runId), 'journal.jsonl')
  }

  /**
   * 2.1.183: load = ldo.load @416839-416858
   * Read + parse the journal into an index. ENOENT (no journal) → empty index (@416844). Other
   * read errors rethrow (@416845). Each non-empty line is JSON.parse'd; an unparseable line is
   * logged and skipped (@416853) so a partially-flushed/torn final line can't abort resume.
   */
  async load(): Promise<JournalIndex> {
    let raw: string
    try {
      raw = await readFile(this.path, 'utf8')
    } catch (err) {
      if (isNotFound(err)) return indexJournal([]) // @416844  no journal yet → empty index (Pn = ENOENT)
      throw err // @416845
    }
    const entries: JournalEntry[] = []
    for (const line of raw.split('\n')) {
      if (!line) continue // @416850  skip blank (incl. trailing newline)
      try {
        entries.push(JSON.parse(line) as JournalEntry)
      } catch (parseErr) {
        // @416853-416854  tolerate a torn/unparseable line (e.g. crash mid-write)
        logError(`LocalFileJournal: skipping unparseable line in ${this.path}: ${parseErr}`)
      }
    }
    return indexJournal(entries)
  }

  /**
   * 2.1.183: append = ldo.append @416859-416867
   * Append one JSON line (newline-terminated). Lazily mkdir's the parent dir on first append
   * (@416860) so an empty run never creates the directory.
   */
  async append(entry: JournalEntry): Promise<void> {
    if (!this.dirReady) {
      await mkdir(dirname(this.path), { recursive: true }) // @416860
      this.dirReady = true
    }
    await appendFile(this.path, `${JSON.stringify(entry)}\n`, 'utf8') // @416861-416866
  }
}

// ───────────────────────────────────────────────────────────────────────────────────────
// truncatePreview — short, single-line preview for the progress tree
// ───────────────────────────────────────────────────────────────────────────────────────

/**
 * 2.1.183: truncatePreview = XGe @416895-416900
 *
 * Render a value (string passed through; object stringified) as a trimmed preview capped at
 * AGENT_PREVIEW_MAX, appending an ellipsis when truncated. Used for both `promptPreview` and
 * `resultPreview` in the progress events, including the cached-replay event.
 * Returns undefined for null/undefined or for an empty-after-trim value (@416896/416898).
 */
export function truncatePreview(value: unknown): string | undefined {
  if (value == null) return undefined // @416896
  const text = (typeof value === 'string' ? value : safeStringify(value)).trim()
  if (!text) return undefined // @416898
  return text.length > AGENT_PREVIEW_MAX ? text.slice(0, AGENT_PREVIEW_MAX) + '…' : text // @416899
}

// `safeStringify` stands in for the bundle's `Re` (@9461) — a thin JSON.stringify(e,t,n) wrapper
// (with a debug `using` timing block; no cycle/try-catch in the original). Used by truncatePreview
// (XGe @416897) and writeWorkflowSnapshot (uWa @416726). The try/catch here is a defensive
// reconstruction nicety; the original `Re` would simply throw on a cyclic value.
function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? ''
  } catch {
    return String(value)
  }
}

// ───────────────────────────────────────────────────────────────────────────────────────
// The cache-hit / respawn decision (resume replay core)
// ───────────────────────────────────────────────────────────────────────────────────────

/**
 * Per-run mutable cursor for the resume replay. In the bundle these are two locals inside the
 * VM-bridge closure `EWa`:
 *   - `cursor`   (obf `f` @416906) — the running key chain; seeded "" and overwritten with the
 *     latest computed key on each agent() call (@416998). It is the *previous* call's phase-title
 *     slot fed into the next key (so the key chain threads phase context forward).
 *   - `diverged` (obf `m` @416907) — the one-way "we've left the cached prefix" flag.
 */
export interface ReplayCursor {
  cursor: string
  diverged: boolean
}

export function createReplayCursor(): ReplayCursor {
  return { cursor: '', diverged: false } // f = "" @416906 ; m = !1 @416907
}

/** A cache-hit decision the dispatch loop acts on. */
export type CacheDecision =
  | { kind: 'hit'; key: string; agentId: string; result: unknown } // replay cached result, no spawn
  | { kind: 'miss'; key: string } // run live (everything from here on is live)

/**
 * 2.1.183: agent() journal cache-hit + respawn block, inside EWa @416997-417026
 *
 * Called only when a journal exists for the run (`if (a)` @416997). It:
 *   1. Computes this call's key and advances the cursor chain (@416998).
 *   2. If we have NOT yet diverged, looks up the key in the cached `results` (@416999). A hit
 *      returns the cached result for instant replay — no subagent is spawned (@417000-417022).
 *   3. The FIRST miss sets `diverged = true` (@417023): from now on `results` is never consulted
 *      again, which is the longest-unchanged-prefix guarantee (a changed call invalidates all
 *      downstream state, so everything after the first miss must run live).
 *   4. On that first miss, if the key was previously `started` but never produced a `result`,
 *      the prior run crashed mid-agent — emit a respawn telemetry event with the attempt count
 *      (@417024-417025).
 *
 * Returns a `CacheDecision` so the dispatch loop knows whether to short-circuit (`hit`) or
 * proceed to spawn (`miss`). The actual cached-result progress event is emitted by the caller
 * (it needs the per-call index/label/phase); the shape is documented at @417000-417022.
 *
 * NOTE on the hit return value: in the bundle the cached result is returned via `p(Ae.result)`
 * where `p = (z) => sN(z)` and `sN` (@9485) is `structuredClone`. So the real replay hands back a
 * deep clone of the cached result, isolating the consumer from the cached object. This standalone
 * restatement returns `cached.result` raw — clone at the call site if you re-stitch it in.
 */
export function decideFromJournal(
  state: ReplayCursor,
  index: JournalIndex | undefined,
  prompt: string,
  opts: Record<string, unknown> | undefined,
  phaseTitle: string,
): CacheDecision {
  // @416998  compute key, advance the chain
  const key = journalKey(prompt, opts, phaseTitle)
  state.cursor = key

  // @416999  only consult the cache while we are still inside the unchanged prefix
  const cached = state.diverged ? undefined : index?.results.get(key)
  if (cached !== undefined) {
    return { kind: 'hit', key, agentId: cached.agentId, result: cached.result } // @417000-417022
  }

  // @417023  first miss: leave the cached prefix permanently
  state.diverged = true

  // @417024-417025  respawn detection: a prior start with no matching result = crash mid-agent
  const priorStarts = index?.started.get(key)
  if (priorStarts && priorStarts.length > 0) {
    logEvent('tengu_workflow_journal_started_hit_respawn', { attempts: priorStarts.length })
  }

  return { kind: 'miss', key }
}

/**
 * 2.1.183: started-append callback (de) @417027-417033
 *
 * Write the `started` line for a (key, agentId) pair right before the subagent runs. Append
 * failures are logged at warn level and swallowed (@417031) — a journal write must never crash
 * the run. No-op when there is no journal (resume disabled).
 */
export function appendStarted(journal: LocalFileJournal | undefined, key: string, agentId: string): void {
  if (!journal || !key) return
  journal.append({ type: 'started', key, agentId }).catch((err) => {
    logError(`workflow journal started-append failed: ${err}`, { level: 'warn' }) // @417031
  })
}

/**
 * 2.1.183: result-append wrapper (ye) @417034-417040
 *
 * After the subagent settles with a non-null result, write the `result` line (so a later resume
 * can replay it). The `agentId` falls back to "" when the started-id wasn't captured (`le ?? ""`
 * @417037). Skipped for null results and when there is no journal/key. Returns the result
 * unchanged (it's used as a pass-through `await`). Failures are logged-and-swallowed (@417038).
 */
export async function appendResult<T>(
  journal: LocalFileJournal | undefined,
  key: string | undefined,
  agentId: string | undefined,
  result: T,
): Promise<T> {
  if (journal && key && result !== null) {
    await journal
      .append({ type: 'result', key, agentId: agentId ?? '', result }) // @417037
      .catch((err) => logError(`workflow journal result-append failed: ${err}`, { level: 'warn' })) // @417038
  }
  return result // @417039
}

// ───────────────────────────────────────────────────────────────────────────────────────
// Run snapshot — /workflows history (separate from the resume journal)
// ───────────────────────────────────────────────────────────────────────────────────────

/**
 * The completed-run record persisted as `<runId>.json`. Field set matches the writer call at
 * @419714-419734 and the reader defaults at @416748-416770. `timestamp` is added by the writer;
 * `startTime` (epoch ms) is what the history list sorts on. Most fields are optional because the
 * reader defaults every missing one.
 */
export interface WorkflowSnapshotRecord {
  runId?: string
  timestamp?: string
  taskId?: string
  script?: string
  scriptPath?: string
  args?: unknown
  result?: unknown
  agentCount?: number
  logs?: string[]
  durationMs?: number
  error?: string
  summary?: string
  workflowName?: string
  title?: string
  status?: 'completed' | 'failed' | 'killed' | string
  startTime?: number
  phases?: unknown
  defaultModel?: string
  workflowProgress?: unknown[]
  totalTokens?: number
  totalToolCalls?: number
}

/**
 * 2.1.183: writeWorkflowSnapshot = uWa @416721-416730
 *
 * Persist a completed run's full record for the `/workflows` history viewer. Stamps `runId` and
 * an ISO `timestamp`, writes `<workflows>/<runId>.json` with restrictive perms (dir 0o700 / file
 * 0o600 — the 448/384 octal literals in the bundle), and logs-and-swallows any failure (@416728)
 * so a snapshot write never breaks completion. The caller (@419714) passes the rich record; on
 * abort it skips downstream task-finalization but the snapshot is still written.
 */
export async function writeWorkflowSnapshot(runId: string, record: WorkflowSnapshotRecord): Promise<void> {
  try {
    const snapshot = { runId, timestamp: new Date().toISOString(), ...record } // @416723
    const file = workflowSnapshotPath(runId) // @416724  q0p(runId)
    await mkdir(dirname(file), { recursive: true, mode: 0o700 }) // @416725  mode 448
    await writeFile(file, safeStringify(snapshot), { encoding: 'utf8', mode: 0o600 }) // @416726  mode 384
  } catch (err) {
    logError(`Failed to write workflow snapshot ${runId}: ${err instanceof Error ? err.message : err}`) // @416728
  }
}

/**
 * 2.1.183: listWorkflowSnapshots = dWa @416731-416778
 *
 * Read every `<runId>.json` in the workflows dir back into a normalized record list for the
 * `/workflows` viewer. Robustness is the point:
 *   - missing dir → [] (@416736)
 *   - per-file parse is independent; a malformed file is logged and skipped (null-filtered)
 *     (@416771-416776) so one bad snapshot can't blank the whole history.
 *   - every field is defaulted (runId from filename, status inferred from `error`, startTime from
 *     `Date.parse(timestamp)`, etc.) (@416748-416770) so old/partial snapshots still render.
 *   - sorted newest-first by `startTime` (@416777).
 */
export async function listWorkflowSnapshots(): Promise<Required<WorkflowSnapshotRecord>[]> {
  const dir = getWorkflowsDir() // @416732  cWa()
  let names: string[]
  try {
    names = await readdir(dir)
  } catch {
    return [] // @416736  no workflows dir yet
  }

  const records = (
    await Promise.all(
      names
        .filter((name) => name.endsWith('.json')) // @416742
        .map(async (name) => {
          try {
            const raw = await readFile(join(dir, name), 'utf8')
            const s = JSON.parse(raw) as WorkflowSnapshotRecord
            const runId = s.runId ?? name.replace(/\.json$/, '') // @416747
            // @416748-416770  default every field so partial/old snapshots still render
            return {
              runId,
              taskId: s.taskId ?? runId,
              timestamp: s.timestamp ?? new Date(0).toISOString(),
              script: s.script ?? '',
              scriptPath: s.scriptPath,
              args: s.args,
              result: s.result,
              agentCount: s.agentCount ?? 0,
              logs: s.logs ?? [],
              durationMs: s.durationMs ?? 0,
              error: s.error,
              summary: s.summary,
              workflowName: s.workflowName,
              title: s.title,
              status: s.status ?? (s.error ? 'failed' : 'completed'), // @416763
              startTime: s.startTime ?? (Date.parse(s.timestamp ?? '') || 0), // @416764
              phases: s.phases,
              defaultModel: s.defaultModel,
              workflowProgress: s.workflowProgress ?? [],
              totalTokens: s.totalTokens ?? 0,
              totalToolCalls: s.totalToolCalls ?? 0,
            } as Required<WorkflowSnapshotRecord>
          } catch (err) {
            // @416771-416772  tolerate a malformed snapshot file
            logError(`Failed to parse workflow snapshot ${name}: ${err instanceof Error ? err.message : err}`)
            return null
          }
        }),
    )
  ).filter((r): r is Required<WorkflowSnapshotRecord> => r !== null) // @416776

  records.sort((a, b) => b.startTime - a.startTime) // @416777  newest first
  return records
}

// ───────────────────────────────────────────────────────────────────────────────────────
// Path helpers
// ───────────────────────────────────────────────────────────────────────────────────────

/**
 * 2.1.183: workflowSnapshotPath = q0p @416710-416712
 * `<workflows-dir>/<runId>.json` — where a run's history snapshot lives.
 */
export function workflowSnapshotPath(runId: string): string {
  return join(getWorkflowsDir(), `${runId}.json`)
}

// The two directory roots (getWorkflowsDir / getWorkflowSubagentDir) are imported above from
// '../utils/workflowPaths.js' and correspond to the obf helpers below — restored here for reference
// (they read the project
// directory via the session-projects helpers, obf cU/yh/Ar and the project-dir name obf xt):
//
//   2.1.183: getWorkflowsDir       = cWa @416713-416716  →  <projects>/<dirName>/workflows
//   2.1.183: getWorkflowSubagentDir = Out @416717-416720 →  <projects>/<dirName>/subagents/workflows/<runId>
//
// UNVERIFIED-DETAIL: the exact obf names cU/yh/Ar/xt for the project-dir resolution were read in
// context (@416714/416718) but their own definitions live outside the assigned journal region;
// they are imported, not reconstructed here. The *shape* (workflows vs subagents/workflows/<runId>)
// is verified directly at @416715/416719.
