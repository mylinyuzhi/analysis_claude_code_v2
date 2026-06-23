// ============================================================================
// Reconstructed READABLE-SOURCE — Claude Code v2.1.183
// File: src/constants/systemPromptSections.ts
//       (the cacheable system-prompt-section registry + the "uncached" split)
// ----------------------------------------------------------------------------
// 2.1.183 regions covered (all anchors are 2.1.183-native cli_inner_pretty.js):
//   - systemPromptSection (descriptor factory) .. Jx   @429774-429776
//   - resolveSystemPromptSections (resolver) .... O8a  @429777-429786
//   - section-cache store .................... ayt  @3644-3646  (getSystemPromptSectionCache)
//                                              drr  @3647-3649  (setSystemPromptSectionCacheEntry)
//                                              lyt  @3650-3652  (clear)
//   - sticky-beta latch reset ................ dyt  @3698-3702  (clearBetaHeaderLatches analog)
//   - clearSystemPromptSections .............. iLe  @429787-429789  (== lyt + dyt)
//   - dynamic boundary marker ................ hoe  @53897 ; re-export @555558
//   - boundary-emit gate ..................... Xve  @134600-134605
//   - cache-scope splitter (the real "uncached" mechanism A) .. a0o @581374-581436
//   - sysprompt telemetry hash ............... QOl  @581366-581373
//   - identity-string set (org-cached prefix)  a_n  @149958-149960
//   - out-of-band date attachment (the real "uncached" mechanism B):
//       date drift detector ................. ftl  @464855-464864
//       today (memoized) .................... SCe  @220222 (= wn(Itt)) ; Itt @220209-220215
//       last-emitted-date store ............. prr  @3653 / cyt @3656
//       date_change reminder text ........... @590594 (verbatim, quoted below)
// ----------------------------------------------------------------------------
// 2.1.88 convention mirror: /lyz/codespace/3rd/claude-code/src/constants/systemPromptSections.ts
// 2.1.156 scaffold doc:    .../claude_code_v_2.1.156/analyze/44_lean_prompt/README.md
//                          (the 23_prompt_cache/README.md path in the task brief does not exist
//                           in the 2.1.156 focused tree; the anchor dossier §3/§7 is the spec.)
// Cross-validation: this whole registry machine is CARRYOVER from 2.1.156 — Jx/O8a/the
//   cache store and the hoe boundary are byte-identical in shape; the only structural fact
//   to capture for 2.1.183 is the ABSENCE of a separate uncached factory (see note below).
//
// ----------------------------------------------------------------------------
// IMPORTANT — the 2.1.88 `DANGEROUS_uncachedSystemPromptSection` convention vs. 2.1.183:
//
//   The 2.1.88 named source exposes TWO factories on this file:
//       systemPromptSection(name, compute)                       -> { cacheBreak: false }
//       DANGEROUS_uncachedSystemPromptSection(name, compute, why) -> { cacheBreak: true }
//   ...so an individual section could opt OUT of the cached prefix (cacheBreak makes
//   resolveSystemPromptSections skip the memo and recompute every turn, breaking the cache).
//
//   In 2.1.183 that second factory DOES NOT EXIST. `Jx` (systemPromptSection) hardcodes
//   `cacheBreak: !1`, and a grep of the whole 699,346-line bundle for `cacheBreak: !0`
//   / `cacheBreak: true` returns ZERO hits — no descriptor in the build is ever uncached.
//
//   "Uncached" is instead realized OUT of this file, by the TWO real mechanisms below
//   (modeled here so the convention maps faithfully):
//
//     (A) The cache-scope splitter `a0o` (§7): every assembled prompt block is tagged
//         with a cacheScope. The per-request BILLING HEADER block (`x-anthropic-billing-
//         header...`, emitted by `qun`) is ALWAYS pushed with `cacheScope: null` — i.e.
//         genuinely uncached, because it carries volatile per-request attribution. The
//         identity strings (the `a_n` set) are `cacheScope: "org"`; the static prefix is
//         `"global"`/`"org"`; everything after the `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__`
//         marker (`hoe`) is the dynamic suffix. So "uncached" is a property of the
//         billing block, not of a section descriptor.
//
//     (B) The out-of-band DATE attachment `ftl` (§7a): the date is deliberately NOT
//         embedded in any cached section (which is exactly what a 2.1.88
//         DANGEROUS_uncached "date" section would have done). Instead the cached body
//         stays date-free, and when the calendar day drifts `ftl` emits a transient
//         `date_change` attachment whose user-invisible reminder tells the model the new
//         date — keeping the cached prefix byte-stable across midnight.
//
//   Net: the cache-busting responsibility was MOVED off the section registry (where a
//   stray cacheBreak would have poisoned the whole prefix) and onto (A) a dedicated
//   uncached billing block and (B) a transient attachment. This file therefore keeps the
//   `cacheBreak` field on the type for shape-compatibility but provides only the cached
//   factory, plus readable models of (A) and (B) for documentation.
// ============================================================================

import {
  // 2.1.183: getSystemPromptSectionCache = ayt @3644 ; setSystemPromptSectionCacheEntry = drr @3647
  //          clearSystemPromptSectionState = lyt @3650 ; clearBetaHeaderLatches = dyt @3698
  clearBetaHeaderLatches,
  clearSystemPromptSectionState,
  getSystemPromptSectionCache,
  setSystemPromptSectionCacheEntry,
} from '../bootstrap/state.js'

// SYSTEM_PROMPT_DYNAMIC_BOUNDARY = hoe @53897 ; re-export @555558. The sentinel that the
// cache-scope splitter (a0o) uses to cleave the cached static prefix from the dynamic suffix.
import { SYSTEM_PROMPT_DYNAMIC_BOUNDARY } from './prompts.js'

// ----------------------------------------------------------------------------
// Section descriptor type & registry
// ----------------------------------------------------------------------------

type ComputeFn = () => string | null | Promise<string | null>

// The descriptor shape carries `cacheBreak` for compatibility with the 2.1.88 convention,
// but in 2.1.183 it is always `false` (see file header note). Kept so resolveSystemPrompt-
// Sections can branch on it exactly as the bundle does (`!n.cacheBreak && cache.has(...)`).
type SystemPromptSection = {
  name: string
  compute: ComputeFn
  cacheBreak: boolean
}

// 2.1.183: systemPromptSection = Jx @429774
//   function Jx(e, t) { return { name: e, compute: t, cacheBreak: !1 }; }
// The ONLY section factory in the 2.1.183 build. `cacheBreak` is hardcoded `false` — there
// is no `DANGEROUS_uncachedSystemPromptSection` counterpart (grep for `cacheBreak: !0` → 0).
// Sections are memoized once per process and survive until clearSystemPromptSections().
//
// The assembler (KL @580888) registers ~25 of these, appending the lean cache-key suffix
// `":L"` to the name for lean-model variants so lean/full text caches separately, e.g.
// `Jx("anti_verbosity" + leanSuffix, () => l_f())`, `Jx("memory" + leanSuffix, ...)`,
// `Jx("env_info_simple", () => D_f(...))`, `Jx("fable_identity", () => d_f())`, etc.
export function systemPromptSection(
  name: string,
  compute: ComputeFn,
): SystemPromptSection {
  return { name, compute, cacheBreak: false } // @429775
}

// 2.1.183: resolveSystemPromptSections = O8a @429777
//   async function O8a(e) {
//     let t = ayt();
//     return Promise.all(e.map(async (n) => {
//       if (!n.cacheBreak && t.has(n.name)) return t.get(n.name) ?? null;
//       let r = await n.compute();
//       return (drr(n.name, r), r);
//     }));
//   }
// Resolves the registry: for each descriptor, return the memoized value if cached (and not
// cache-breaking — which it never is here), otherwise compute(), store it, and return it.
// This is the memo that makes each section's text compute exactly once per process. Result
// is a `(string | null)[]` aligned with the input order; `null` entries are filtered out by
// the assembler's trailing `.filter(x => x !== null)`.
export async function resolveSystemPromptSections(
  sections: SystemPromptSection[],
): Promise<(string | null)[]> {
  const cache = getSystemPromptSectionCache() // ayt() @429778

  return Promise.all(
    sections.map(async s => {
      // @429781: memo hit — cached and not cache-breaking (cacheBreak is always false in 2.1.183)
      if (!s.cacheBreak && cache.has(s.name)) {
        return cache.get(s.name) ?? null
      }
      const value = await s.compute() // @429782
      setSystemPromptSectionCacheEntry(s.name, value) // drr(name, value) @429783
      return value
    }),
  )
}

// 2.1.183: clearSystemPromptSections = iLe @429787
//   function iLe() { (lyt(), dyt()); }
// Called on /clear, /compact, and on worktree enter/exit (callers @429999, @430130,
// @628950, @628959, @628964). Two effects:
//   1. lyt()  — Ot.systemPromptSectionCache.clear(): drop every memoized section so the next
//               prompt build recomputes fresh (e.g. after cwd/model/output-style changes).
//   2. dyt()  — reset the sticky-beta latches (Ot.stickyBetas = Hre()): so a fresh
//               conversation re-evaluates AFK / fast-mode / cache-editing beta headers
//               instead of inheriting the prior session's latched set. This is the 2.1.88
//               `clearBetaHeaderLatches()` half of this function.
export function clearSystemPromptSections(): void {
  clearSystemPromptSectionState() // lyt() @429788 — clear the section cache
  clearBetaHeaderLatches() // dyt() @429788 — reset sticky beta-header latches
}

// ============================================================================
// The two REAL "uncached" mechanisms (modeled for documentation; the live code lives
// elsewhere — a0o @581374 and ftl @464855 — but is reproduced here readably so the
// 2.1.88 DANGEROUS_uncached convention has a faithful 2.1.183 mapping).
// ============================================================================

type CacheScope = 'global' | 'org' | null

type ScopedPromptBlock = { text: string; cacheScope: CacheScope }

// 2.1.183: splitSystemPromptByCacheScope = a0o @581374
// Classifies an assembled prompt-block array into cache-scoped blocks. This is mechanism (A)
// of the file-header note: it is where a block becomes genuinely uncached (`cacheScope: null`).
//
//   - The per-request BILLING HEADER (a block starting with "x-anthropic-billing-header",
//     produced by qun @103199) is ALWAYS uncached → `cacheScope: null`. It carries volatile
//     per-request attribution, so it must not poison the cached prefix.  @581385 / @581407
//   - Identity strings (members of the `a_n` set: gNr/OAi/NAi, the "You are Claude Code..."
//     lines) are org-cached → `cacheScope: "org"`, shared cross-session.  @581386 / @581391
//   - Everything BEFORE the `hoe` boundary marker is the static prefix (`"global"` when the
//     marker is present, else `"org"`); everything AFTER it is the dynamic suffix.  @581404+
//
// When the boundary gate is off OR the marker is absent, the array collapses to the simple
// 3-way classification (billing→null, identity→org, rest→org) — see the bundle's tail branch.
export function splitSystemPromptByCacheScope(
  blocks: (string | null)[],
  // a_n @149958: the identity-string set (org-cached prefix)
  identityStrings: ReadonlySet<string>,
): ScopedPromptBlock[] {
  // r = blocks.findIndex(b => b === SYSTEM_PROMPT_DYNAMIC_BOUNDARY)  @581376
  const boundaryIndex = blocks.findIndex(b => b === SYSTEM_PROMPT_DYNAMIC_BOUNDARY)
  const boundaryGateOn = isDynamicBoundaryEnabled() // Xve() @581375

  let billing: string | undefined
  let identity: string | undefined
  const staticPrefix: string[] = []
  const dynamicSuffix: string[] = []

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    if (!b || b === SYSTEM_PROMPT_DYNAMIC_BOUNDARY) continue
    // @581385: the billing header is the one always-uncached block
    if (b.startsWith('x-anthropic-billing-header')) billing = b
    else if (identityStrings.has(b)) identity = b // @581386
    else if (boundaryGateOn && boundaryIndex !== -1 && i < boundaryIndex) staticPrefix.push(b)
    else dynamicSuffix.push(b)
  }

  const out: ScopedPromptBlock[] = []
  // @581407 (classify) / @581413 (push): billing header → cacheScope null (UNCACHED — mechanism A)
  if (billing) out.push({ text: billing, cacheScope: null })
  if (identity) {
    // With a boundary present, identity rides the static prefix; the bundle pushes it as
    // null here so it is re-sent with the volatile prefix block (@581414), otherwise "org".
    out.push({ text: identity, cacheScope: boundaryIndex !== -1 ? null : 'org' })
  }
  const staticText = staticPrefix.join('\n\n')
  if (staticText) out.push({ text: staticText, cacheScope: 'global' }) // @581418
  const dynamicText = dynamicSuffix.join('\n\n')
  if (dynamicText) out.push({ text: dynamicText, cacheScope: 'org' }) // @581422
  return out
}

// 2.1.183: isDynamicBoundaryEnabled = Xve @134600
//   Gate that decides whether the hoe boundary marker is emitted / honored.
//   Xve() = $M() && Pu() && (Ir() === "firstParty" || Ir() === "anthropicAws")
//   (auth/feature-flag gate AND a first-party or Anthropic-AWS endpoint). Modeled as an
//   injectable predicate here; see prompts.ts for the marker constant itself.
declare function isDynamicBoundaryEnabled(): boolean

// ----------------------------------------------------------------------------
// Mechanism (B): the out-of-band date_change attachment.
// The date is NEVER baked into a cached section (that is what a 2.1.88
// DANGEROUS_uncached "date" section would have been). Instead the cached prefix stays
// date-free and ftl emits a transient attachment when the calendar day drifts.
// ----------------------------------------------------------------------------

type DateChangeAttachment = { type: 'date_change'; newDate: string }

// 2.1.183: detectDateChangeAttachment = ftl @464855
//   function ftl(e) {
//     let t = Itt();                              // today, YYYY-MM-DD
//     if (prr() !== t) cyt(t);                    // advance last-emitted-date store
//     if (SCe() === t) return [];                 // memoized-today still matches → nothing
//     for (let r of Cy(e ?? [])) {                // already announced this turn? → nothing
//       if (r.type !== "attachment") continue;
//       if (r.attachment.type === "date_change" && r.attachment.newDate === t) return [];
//     }
//     return [{ type: "date_change", newDate: t }];
//   }
// Returns a transient `date_change` attachment exactly once when the day rolls over. Because
// it is an attachment (not a system-prompt section), the cached prefix is untouched — the
// model still learns the new date via the reminder below, but the prompt cache survives midnight.
export function detectDateChangeAttachment(
  existingAttachments: Array<{ type: string; attachment?: { type: string; newDate?: string } }>,
): DateChangeAttachment[] {
  const today = computeTodayISO() // Itt() @464856
  if (lastEmittedDate() !== today) setLastEmittedDate(today) // prr()/cyt() @464857
  if (memoizedToday() === today) return [] // SCe() @464858 — memoized today still current
  // already announced the change this turn → don't duplicate (@464859-464862)
  for (const a of existingAttachments) {
    if (a.type !== 'attachment') continue
    if (a.attachment?.type === 'date_change' && a.attachment.newDate === today) return []
  }
  return [{ type: 'date_change', newDate: today }] // @464863
}

// 2.1.183: date_change reminder renderer @590594 — VERBATIM user-invisible reminder text.
// Rendered as an isMeta message (not shown to the user) so the model silently re-anchors its
// notion of "today" without surfacing the change. This is the payload that makes mechanism (B)
// equivalent-in-effect to a DANGEROUS_uncached date section, minus the cache cost.
export function renderDateChangeReminder(a: DateChangeAttachment): string {
  // @590594 (quoted verbatim — do not paraphrase):
  return `The date has changed. Today's date is now ${a.newDate}. DO NOT mention this to the user explicitly because they are already aware.`
}

// 2.1.183: computeTodayISO = Itt @220209 — local `YYYY-MM-DD`.
function computeTodayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0') // @220212
  const day = String(d.getDate()).padStart(2, '0') // @220213
  return `${y}-${m}-${day}` // @220214
}

// 2.1.183: memoizedToday = SCe @220222 (= wn(Itt)) — process-memoized today; the stable value
//   the cached env block was built against. Mechanism (B) fires precisely when it falls behind
//   computeTodayISO(). Modeled as injectable accessors (state lives in bootstrap state `Ot`).
declare function memoizedToday(): string // SCe @220222
declare function lastEmittedDate(): string // prr @3653 (Ot.lastEmittedDate)
declare function setLastEmittedDate(date: string): void // cyt @3656

// 2.1.183: recordSystemPromptHash = QOl @581366 — telemetry only; emits `tengu_sysprompt_block`
// with the first cacheable block's length + sha256. Listed here for completeness because it is
// the sibling of a0o in the bundle, but it has no caching effect of its own.
