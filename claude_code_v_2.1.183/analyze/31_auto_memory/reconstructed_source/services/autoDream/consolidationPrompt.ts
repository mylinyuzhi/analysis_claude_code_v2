// ============================================================================
// services/autoDream/consolidationPrompt.ts  (v2.1.183 readable-source restoration)
// ============================================================================
//
// Builds the "# Dream: Memory Consolidation" prompt that the auto-dream
// scheduler feeds to a forked subagent. Extracted from dream.ts so auto-dream
// ships independently of the KAIROS feature-gated require() (88 ancestor note,
// still true in 183: dream.ts is behind a feature()-gated require).
//
// 2.1.183 regions covered:
//   - cli_inner_pretty.js:455311-455378  buildConsolidationPrompt (PQa)   — the 4-phase prompt
//   - cli_inner_pretty.js:455379-455389  H2p (team-memory section) + v2p (CLAUDE.md reconcile section)
//   - cli_inner_pretty.js:455280-455309  inert injection slots kQa()/LQa() + their always-false gates
//   - cli_inner_pretty.js:150799-150803  $w / tie / oZ  (ENTRYPOINT_NAME / MAX_ENTRYPOINT_LINES / DIR_EXISTS_GUIDANCE)
//
// 2.1.88 ancestor (shape + real names + doc-comments):
//   src/services/autoDream/consolidationPrompt.ts  (buildConsolidationPrompt)
//
// Scaffold: 31_auto_memory/README.md "Dream prompts" (PQa @455311; tiny prune @151521);
//   v2.1.156 auto_dream_runtime.md (consolidation prompt text).
//
// Cross-validation (re-read in the 183 bundle):
//   - PQa now takes a 4th param r=teamEnabled (default false) @455311. The caller is
//     dream runner BQa: `T = b ? Hgi(h, S, p) : PQa(h, y, S, p)` @455488, where
//     p = Nk() = isTeamMemoryEnabled @455465. So the team section is injected iff team memory is on.
//   - When teamEnabled, the "## Team memory (`team/` subdirectory)" block (H2p @455379) is spliced
//     in right after the "Session transcripts:" line — a DELTA over the 88 ancestor.
//   - Phase 1 / Phase 2 log layout changed from the 88 ancestor's `logs/YYYY/MM/YYYY-MM-DD.md`
//     "Daily logs" to 183's per-session `logs/YYYY/MM/DD/<id>-<title>.md` "Session logs", with
//     prefix-coded lines (`>` user, `<` assistant, `.` tool call). DELTA — read @455334/@455340.
//   - A new "### Reconcile memories against CLAUDE.md" block (v2p @455381) is appended after Phase 4
//     — a DELTA over the 88 ancestor.
//   - Two inert injection slots survive in 183: kQa() @455283 (between Phase 2 and Phase 3) and
//     LQa() @455298 (after the CLAUDE.md reconcile block). Both are gated by hard-false predicates
//     (y2p()/S2p() both `return !1` @455280/@455295) over empty arrays (_2p/E2p, only ever `[]`),
//     so both ALWAYS return "" in 2.1.183. Restored faithfully and marked inert.
//   - $w="MEMORY.md", tie=200, oZ=DIR_EXISTS_GUIDANCE confirmed @150799-150803 (unchanged carryover).
//   - The sibling tiny prune prompt "# Dream: Memory Pruning" (Hgi @151520) does NOT live here in
//     183 — it is defined in the memoryTypes/recall region (module S_n, near the type taxonomy),
//     and the dream runner picks it via `b = aH()` @455476. It belongs to memdir/, not this file.
//     See the note on `buildDreamPromptTiny` below.
//
// Divergence from 88 ancestor: 88 imported only { DIR_EXISTS_GUIDANCE, ENTRYPOINT_NAME,
//   MAX_ENTRYPOINT_LINES }. 183 still uses exactly those three from memdir; the team section,
//   the CLAUDE.md reconcile section, and the two inert slots are local to this module.
// ============================================================================

import {
  DIR_EXISTS_GUIDANCE,
  ENTRYPOINT_NAME,
  MAX_ENTRYPOINT_LINES,
} from '../../memdir/memdir.js'

// ----------------------------------------------------------------------------
// Inline section text (local to this module in 183)
// ----------------------------------------------------------------------------

// 2.1.183: TEAM_MEMORY_DREAM_SECTION = H2p @cli_inner_pretty.js:455379
// Spliced into the consolidation prompt (after "Session transcripts:") only when
// team memory is enabled. DELTA v2.1.172+: not present in the 88 ancestor — the
// team-store recall path is the big 172/181 expansion. See team_memory_stores_recall.md.
const TEAM_MEMORY_DREAM_SECTION = "## Team memory (`team/` subdirectory)\n\nThe `team/` subdirectory holds memories shared across everyone working in this repo. Other teammates' Claude sessions write here too — treat it differently from your personal files:\n\n- **Phase 1:** `ls team/` and skim it alongside your personal files. A teammate may have already captured something you'd otherwise duplicate.\n- **Phase 3:** Merge near-duplicates *within* `team/` the same way you would personal memories. If a personal memory restates a team memory, delete the personal one.\n- **Phase 4 — be conservative pruning `team/`:**\n  - DO delete or fix a team memory that is clearly contradicted by the current code, or that a newer team memory marks as superseded.\n  - DO NOT delete a team memory just because you don't recognize it or it isn't relevant to *your* recent sessions — a teammate may rely on it.\n  - When unsure, leave it. A stale team memory costs little; deleting a teammate's load-bearing note costs a lot.\n\nDo not promote personal memories into `team/` during a dream — that's a deliberate choice the user makes via `/remember`, not something to do reflexively."

// 2.1.183: RECONCILE_AGAINST_CLAUDE_MD_SECTION = v2p @cli_inner_pretty.js:455381
// Appended after Phase 4. DELTA: not present in the 88 ancestor. Tells the dream
// pass to check feedback/project memories against project CLAUDE.md instructions
// (which are already loaded in the system prompt) and to NEVER edit CLAUDE.md during a dream.
const RECONCILE_AGAINST_CLAUDE_MD_SECTION = `### Reconcile memories against CLAUDE.md

Project CLAUDE.md instructions are loaded in your system prompt. For each \`feedback\` or \`project\` memory, check whether it contradicts a CLAUDE.md instruction on the same topic:

- **Memory is stale** — CLAUDE.md and the memory describe different procedures for the same task: CLAUDE.md is the maintained, checked-in source. Delete the memory, or rewrite it to agree if it carries context worth keeping (the *why* is still useful but the *how* is wrong).
- **CLAUDE.md may be stale** — the memory is clearly dated after CLAUDE.md and explicitly corrects it: do NOT edit CLAUDE.md during a dream. Annotate the memory with "contradicts CLAUDE.md — verify which is current" and list it in your summary so the user can update CLAUDE.md.
- **Not a conflict** — the memory adds detail CLAUDE.md doesn't cover, or narrows a CLAUDE.md rule with a stated reason. Leave it.

A \`feedback\` memory's "Why: the user corrected me" framing is not evidence it's newer than CLAUDE.md — CLAUDE.md may have been updated since.`

// ----------------------------------------------------------------------------
// Inert prompt-injection slots
// ----------------------------------------------------------------------------
//
// These two slots are wired into the prompt body but are dead in 2.1.183: each is
// guarded by a predicate that hard-returns false and joins an array that is only
// ever []. They appear to be extension points (e.g. for future dynamically-injected
// guidance), kept inert here. Restored verbatim so a reviewer can confirm they emit "".

// 2.1.183: midPromptInjectionEnabled = y2p @cli_inner_pretty.js:455280 (always false)
function midPromptInjectionEnabled(): boolean {
  // @455281: `return !1` — never enabled in 2.1.183
  return false
}

// 2.1.183: MID_PROMPT_INJECTIONS = _2p @cli_inner_pretty.js:455290 (only ever assigned [])
const MID_PROMPT_INJECTIONS: string[] = []

// 2.1.183: buildMidPromptInjection = kQa @cli_inner_pretty.js:455283
// Spliced between Phase 2 and Phase 3 (@455346). Always "" in 183.
function buildMidPromptInjection(): string {
  if (!midPromptInjectionEnabled()) return ''
  return `\n${MID_PROMPT_INJECTIONS.join('\n')}\n`
}

// 2.1.183: tailPromptInjectionEnabled = S2p @cli_inner_pretty.js:455295 (always false)
function tailPromptInjectionEnabled(): boolean {
  // @455296: `return !1` — never enabled in 2.1.183
  return false
}

// 2.1.183: TAIL_PROMPT_INJECTIONS = E2p @cli_inner_pretty.js:455305 (only ever assigned [])
const TAIL_PROMPT_INJECTIONS: string[] = []

// 2.1.183: buildTailPromptInjection = LQa @cli_inner_pretty.js:455298
// Spliced after the CLAUDE.md reconcile block (@455366). Always "" in 183.
function buildTailPromptInjection(): string {
  if (!tailPromptInjectionEnabled()) return ''
  return `\n${TAIL_PROMPT_INJECTIONS.join('\n')}\n`
}

// ----------------------------------------------------------------------------
// buildConsolidationPrompt
// ----------------------------------------------------------------------------

/**
 * Build the full "# Dream: Memory Consolidation" prompt for the forked dream
 * subagent. A dream is a reflective pass over the memory files: synthesize what
 * was learned recently into durable, well-organized memories so future sessions
 * can orient quickly. The prompt is a 4-phase script (Orient → Gather → Consolidate
 * → Prune and index).
 *
 * 2.1.183: buildConsolidationPrompt = PQa @cli_inner_pretty.js:455311
 * 2.1.88 ancestor: services/autoDream/consolidationPrompt.ts buildConsolidationPrompt
 * Caller: dream runner BQa @455488 — `PQa(h, y, S, p)` where
 *   h = getAutoMemPath() (hm @455473), y = transcript dir (yh(Ar()) @455474),
 *   S = run-specific tool-constraints text (the `extra` arg), p = isTeamMemoryEnabled() (Nk @455465).
 *
 * @param memoryRoot    Absolute path to the auto-memory directory.
 * @param transcriptDir Directory of session JSONL transcripts (large — grep narrowly).
 * @param extra         Run-specific trailer (the dream runner passes tool-constraint guidance here).
 * @param teamEnabled   DELTA v2.1.172+: when true, splice in the team-memory section. @455311 (r=!1 default)
 */
// 2.1.183: PQa(e, t, n, r = !1)  →  (memoryRoot, transcriptDir, extra, teamEnabled)
export function buildConsolidationPrompt(
  memoryRoot: string,
  transcriptDir: string,
  extra: string,
  teamEnabled: boolean = false,
): string {
  return `# Dream: Memory Consolidation

You are performing a dream — a reflective pass over your memory files. Synthesize what you've learned recently into durable, well-organized memories so that future sessions can orient quickly.

Memory directory: \`${memoryRoot}\`
${DIR_EXISTS_GUIDANCE}

Session transcripts: \`${transcriptDir}\` (large JSONL files — grep narrowly, don't read whole files)
${
  // DELTA v2.1.172+: team-memory section injected when team memory is enabled. @455320-455326
  teamEnabled
    ? `
${TEAM_MEMORY_DREAM_SECTION}
`
    : ''
}
---

## Phase 1 — Orient

- \`ls\` the memory directory to see what already exists
- Read \`${ENTRYPOINT_NAME}\` to understand the current index
- Skim existing topic files so you improve them rather than creating duplicates
- \`ls -R logs/\` — recent activity logs (one file per session under \`YYYY/MM/DD/\`). If a \`sessions/\` subdirectory also exists, review recent entries there too

## Phase 2 — Gather recent signal

Look for new information worth persisting. Sources in rough priority order:

1. **Session logs** (\`logs/YYYY/MM/DD/<id>-<title>.md\`) — the append-only activity stream, one file per session. Read the most recent 1–3 days of sessions (the filename title tells you what each was about); each line is prefix-coded (\`>\` user, \`<\` assistant, \`.\` tool call)
2. **Existing memories that drifted** — facts that contradict something you see in the codebase now
3. **Transcript search** — if you need specific context (e.g., "what was the error message from yesterday's build failure?"), grep the JSONL transcripts for narrow terms:
   \`grep -rn "<narrow term>" ${transcriptDir}/ --include="*.jsonl" | tail -50\`

Don't exhaustively read transcripts. Look only for things you already suspect matter.
${buildMidPromptInjection()}
## Phase 3 — Consolidate

For each thing worth remembering, write or update a memory file at the top level of the memory directory. Use the memory file format and type conventions from your system prompt's auto-memory section — it's the source of truth for what to save, how to structure it, and what NOT to save.

Focus on:
- Merging new signal into existing topic files rather than creating near-duplicates
- Converting relative dates ("yesterday", "last week") to absolute dates so they remain interpretable after time passes
- Deleting contradicted facts — if today's investigation disproves an old memory, fix it at the source

## Phase 4 — Prune and index

Update \`${ENTRYPOINT_NAME}\` so it stays under ${MAX_ENTRYPOINT_LINES} lines AND under ~25KB. It's an **index**, not a dump — each entry should be one line under ~150 characters: \`- [Title](file.md) — one-line hook\`. Never write memory content directly into it.

- Remove pointers to memories that are now stale, wrong, or superseded
- Demote verbose entries: if an index line is over ~200 chars, it's carrying content that belongs in the topic file — shorten the line, move the detail
- Add pointers to newly important memories
- Resolve contradictions — if two files disagree, fix the wrong one

${RECONCILE_AGAINST_CLAUDE_MD_SECTION}
${buildTailPromptInjection()}
---

Return a brief summary of what you consolidated, updated, or pruned. If nothing changed (memories are already tight), say so.${
    extra
      ? `

## Additional context

${extra}`
      : ''
  }`
}

// ----------------------------------------------------------------------------
// Sibling: the tiny "# Dream: Memory Pruning" prompt — NOT defined in this module.
// ----------------------------------------------------------------------------
//
// 2.1.183: buildDreamPromptTiny = Hgi @cli_inner_pretty.js:151520  (signature: Hgi(e, t, n = !1))
//   → (memoryRoot, extra, teamEnabled).  Note it takes NO transcriptDir.
//
// In 2.1.183 the tiny prune prompt lives in the memoryTypes/recall region (module S_n,
// alongside the typed-memory taxonomy), not in services/autoDream/. The dream runner
// chooses between the two prompts via `b = aH()` @455476:
//   `T = b ? Hgi(h, S, p) : PQa(h, y, S, p)`  @455488
// i.e. when the prune-mode predicate aH() is true it sends the small pruning script,
// otherwise the full 4-phase consolidation script above.
//
// Reconstruct buildDreamPromptTiny in the memdir/ module that owns Hgi (see the unit map
// in _conventions.md). Cross-link only here to avoid duplicating its verbatim text.
// (Tiny prune prompt header: "# Dream: Memory Pruning" @cli_inner_pretty.js:151521.)
