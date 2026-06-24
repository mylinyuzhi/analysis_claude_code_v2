/**
 * Prompt template for the background memory-extraction subagent (v2.1.183).
 *
 * The extraction agent runs as a perfect fork of the main conversation — same
 * system prompt, same message prefix. The main agent's system prompt already
 * carries the full Memory section (taxonomy, frontmatter format, what-not-to-save
 * criteria, how-to-save instructions); when the main agent writes memories itself,
 * extractMemories.ts skips that turn (hasMemoryWritesSince). This prompt fires only
 * when the main agent did NOT write, so the save-criteria overlap the system prompt
 * harmlessly.
 *
 * 2.1.183 regions: cli_inner_pretty.js:454882-454927 (buildExtractionPrompt / SQa)
 * 2.1.88 ancestor: services/extractMemories/prompts.ts
 *   (opener + buildExtractAutoOnlyPrompt + buildExtractCombinedPrompt)
 * scaffold: v2.1.156 extract_memories_runtime.md §7 (extraction prompt);
 *   31_auto_memory/README.md (extraction subagent)
 * cross-val: re-read the verbatim prompt array in 183 (454910-454926); confirmed the
 *   two 88-era builders are collapsed into ONE parameterized SQa(newMessageCount,
 *   existingMemories, teamMemoryEnabled), and that the taxonomy/frontmatter/how-to-save
 *   blocks are NO LONGER inlined — the 183 prompt defers them to the system prompt's
 *   Memory section. The tiny-memory immutability variant is driven by isTinyMemoryEnabled()
 *   (aH @147673, reads tengu_billiard_aviary), NOT by the 88 `skipIndex` param.
 *
 * DELTA v2.1.x (shape): the v2.1.88 ancestor exported two builders
 *   (buildExtractAutoOnlyPrompt, buildExtractCombinedPrompt) that each inlined
 *   MEMORY_FRONTMATTER_EXAMPLE / TYPES_SECTION_* / WHAT_NOT_TO_SAVE_SECTION / a
 *   "## How to save memories" block. 183 (@454882) merges them into a single
 *   buildExtractionPrompt and replaces all the inlined taxonomy/how-to-save prose
 *   with a one-line "Apply the memory types … from the Memory section of your system
 *   prompt" pointer (@454924). The third parameter is teamMemoryEnabled (Nk @151098),
 *   not a skipIndex flag.
 *
 * NOTE on the task's `skipIndex (tengu_moth_copse)` hint: tengu_moth_copse does NOT
 * gate this prompt in 183 (its uses are in the recall path @151860/@225900 and a
 * stop-hook gate @465364). The index-vs-no-index distinction the 88 `skipIndex` made
 * is, in 183, the tiny-memory distinction (`isTinyMemoryEnabled`), which flips the
 * tool list / parallel-write guidance / existing-files guidance. See `isTinyMemory`
 * branches below, all anchored to @454889-454909. // see status_line_and_misc_delta.md
 */

// 2.1.183: tool-name imports resolve to the same string constants as the sandbox.
//   "Read"=Ws@152217, "Grep"=Uc@221419, "Glob"=_u@152243, "Bash"=ns@145275,
//   "PowerShell"=Xs@221424, "Edit"=Fa@152083, "Write"=Kc@193030.
// The 183 prompt no longer imports the memdir taxonomy sections (they moved into the
//   system-prompt Memory section), so memoryTypes.js is intentionally NOT imported here.
//   // DELTA v2.1.x: dropped MEMORY_FRONTMATTER_EXAMPLE / TYPES_SECTION_* / WHAT_NOT_TO_SAVE_SECTION imports
// NOTE: isTeamMemoryEnabled (Nk @151098) is NOT imported here — in 183 it is read at the
//   call site (extractMemories.ts @455155) and passed in as the teamMemoryEnabled argument;
//   the builder itself does not call it. feature('TEAMMEM') is likewise not referenced (no
//   compile-time gate exists in this builder in 183).
import { isPosixOS } from '../../utils/platform.js'
import { isTinyMemoryEnabled } from '../../memdir/paths.js'
import { BASH_TOOL_NAME } from '../../tools/BashTool/toolName.js'
import { POWERSHELL_TOOL_NAME } from '../../tools/PowerShellTool/toolName.js'
import { FILE_EDIT_TOOL_NAME } from '../../tools/FileEditTool/constants.js'
import { FILE_READ_TOOL_NAME } from '../../tools/FileReadTool/prompt.js'
import { FILE_WRITE_TOOL_NAME } from '../../tools/FileWriteTool/prompt.js'
import { GLOB_TOOL_NAME } from '../../tools/GlobTool/prompt.js'
import { GREP_TOOL_NAME } from '../../tools/GrepTool/prompt.js'

/**
 * Build the extraction subagent's user prompt.
 *
 * Single 183 builder (the 88 auto-only / combined split is gone). The prompt:
 *  - tells the fork it is the extraction subagent and how many recent messages to mine,
 *  - declares the exact tool sandbox (mirrors createAutoMemCanUseTool),
 *  - gives turn-budget / parallelism guidance (read-then-edit vs immutable),
 *  - forbids investigation/verification (no grepping, no code-reading, no git),
 *  - appends the existing-memory manifest with update-don't-duplicate guidance,
 *  - lets "Nothing to save." short-circuit,
 *  - and defers the taxonomy + frontmatter + how-to-save rules to the system prompt.
 *
 * `teamMemoryEnabled` only toggles whether the closing pointer mentions "scope
 * guidance," (the per-type private/team scope guidance lives in the system prompt's
 * Memory section when team memory is on).
 *
 * `isTinyMemoryEnabled()` (read fresh, not a param) flips three spans: the tool list
 * (Edit forbidden, only Write/rm), the turn-budget guidance (no read-then-edit dance),
 * and the existing-files guidance (delete-and-recreate stale memories, never edit).
 *
 * 2.1.88 ancestor: opener() + buildExtractAutoOnlyPrompt() + buildExtractCombinedPrompt()
 */
// 2.1.183: buildExtractionPrompt = SQa @cli_inner_pretty.js:454882
//   called once @455155 as SQa(newMessageCount, existingMemories, isTeamMemoryEnabled())
export function buildExtractionPrompt(
  newMessageCount: number,
  existingMemories: string,
  teamMemoryEnabled: boolean,
): string {
  // 183 reads isPosixOS / isTinyMemoryEnabled fresh inside the builder. @454883-454889
  const posix = isPosixOS() // Su @221433
  const shellName = posix ? BASH_TOOL_NAME : POWERSHELL_TOOL_NAME // o = ns|Xs @454884
  // Read-only shell examples differ by platform. @454886-454887
  const readOnlyExamples = posix
    ? 'ls/find/cat/stat/wc/head/tail and similar'
    : 'Get-ChildItem/Get-Content/Select-Object -First/-Last and similar'
  const deleteVerb = posix ? 'rm' : 'Remove-Item' // i @454888
  const isTinyMemory = isTinyMemoryEnabled() // a = aH @454889 (tengu_billiard_aviary)

  // Existing-files guidance line. @454890-454892
  // DELTA v2.1.x: tiny-memory branch instructs delete-and-recreate (memories immutable).
  const existingFilesGuidance = isTinyMemory
    ? `Check this list before writing — if the fact is already covered, skip it; if a memory has gone stale, ${deleteVerb} it and write a fresh single-fact memory in its place. Never edit memories in-place.`
    : 'Check this list before writing — update an existing file rather than creating a duplicate.'

  // Existing-memory manifest block (empty when there are no files on disk). @454893-454902
  const manifest =
    existingMemories.length > 0
      ? `\n\n## Existing memory files\n\n${existingMemories}\n\n${existingFilesGuidance}`
      : ''

  // "scope guidance, " is woven into the closing pointer only when team memory is on. @454903
  const scopeClause = teamMemoryEnabled ? 'scope guidance, ' : ''

  // Tool-list sentence. @454905-454906
  // DELTA v2.1.x: tiny-memory variant forbids Edit (memories immutable) and notes
  //   Bash <shell> with paths inside the memory directory is allowed for deletes.
  const toolList = isTinyMemory
    ? `Available tools: ${FILE_READ_TOOL_NAME}, ${GREP_TOOL_NAME}, ${GLOB_TOOL_NAME}, read-only ${shellName} (${readOnlyExamples}), ${FILE_WRITE_TOOL_NAME} for paths inside the memory directory only, and ${shellName} ${deleteVerb} with paths inside the memory directory only. ${FILE_EDIT_TOOL_NAME} is not permitted — memories are immutable, so delete-and-recreate replaces in-place edits. All other tools — MCP, Agent, write-capable ${shellName}, etc — will be denied.`
    : `Available tools: ${FILE_READ_TOOL_NAME}, ${GREP_TOOL_NAME}, ${GLOB_TOOL_NAME}, read-only ${shellName} (${readOnlyExamples}), and ${FILE_EDIT_TOOL_NAME}/${FILE_WRITE_TOOL_NAME} for paths inside the memory directory only, and ${shellName} ${deleteVerb} with paths inside the memory directory only. All other tools — MCP, Agent, write-capable ${shellName}, etc — will be denied.`

  // Turn-budget / parallelism guidance. @454907-454909
  // DELTA v2.1.x: tiny-memory variant drops the read-then-edit dance (Write-only, immutable).
  const turnBudget = isTinyMemory
    ? `You have a limited turn budget. Issue all ${FILE_WRITE_TOOL_NAME} and ${deleteVerb} calls in parallel in a single turn — there is no read-then-edit dance, since memories are immutable.`
    : `You have a limited turn budget. ${FILE_EDIT_TOOL_NAME} requires a prior ${FILE_READ_TOOL_NAME} of the same file, so the efficient strategy is: turn 1 — issue all ${FILE_READ_TOOL_NAME} calls in parallel for every file you might update; turn 2 — issue all ${FILE_WRITE_TOOL_NAME}/${FILE_EDIT_TOOL_NAME} calls in parallel. Do not interleave reads and writes across multiple turns.`

  // Final prompt array. Verbatim strings copied from cli_inner_pretty.js:454910-454926.
  return [
    `You are now acting as the memory extraction subagent. Analyze the most recent ~${newMessageCount} messages above and use them to update your persistent memory systems.`,
    '',
    toolList,
    '',
    turnBudget,
    '',
    `You MUST only use content from the last ~${newMessageCount} messages to update your persistent memories. Do not waste any turns attempting to investigate or verify that content further — no grepping source files, no reading code to confirm a pattern exists, no git commands.` +
      manifest,
    '',
    // DELTA v2.1.x: new short-circuit line (not present in the 88 ancestor). @454920
    "If nothing is worth saving, output only 'Nothing to save.' Do not explain why.",
    '',
    'If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.',
    '',
    // DELTA v2.1.x: closing pointer REPLACES the 88 inlined TYPES_SECTION_* /
    //   WHAT_NOT_TO_SAVE_SECTION / MEMORY_FRONTMATTER_EXAMPLE / "## How to save memories"
    //   blocks. scopeClause inserts "scope guidance, " only when team memory is on. @454924
    `Apply the memory types, ${scopeClause}what-not-to-save criteria, and frontmatter format from the Memory section of your system prompt — it is already in your context above.`,
  ].join('\n')
}

// NOTE (88→183 shape change): the v2.1.88 ancestor exported TWO builders
//   (buildExtractAutoOnlyPrompt + buildExtractCombinedPrompt). 183 collapses them into the
//   single buildExtractionPrompt (SQa) above — there is no second exported builder in the 183
//   bundle (grep confirms "memory extraction subagent" appears only at @454911). The team-memory
//   decision is NOT made inside the builder; it is decided at the SINGLE call site
//   (extractMemories.ts @455155: `m = Nk()` → `SQa(f, _, m)`), where the live isTeamMemoryEnabled()
//   result is passed as the teamMemoryEnabled argument. No 88-compat shim wrappers are
//   reconstructed here because none exist in 183 (omitting per _conventions.md "No invented behavior").
