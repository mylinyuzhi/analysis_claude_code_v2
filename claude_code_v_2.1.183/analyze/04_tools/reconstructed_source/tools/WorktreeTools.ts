/**
 * WorktreeTools — EnterWorktree + ExitWorktree (readable-source restoration, v2.1.183)
 *
 * The two deferred git-worktree session tools. EnterWorktree creates a new isolated
 * git worktree (or switches into an existing one via `path`) and chdir's the whole
 * process into it; ExitWorktree restores the original working directory and optionally
 * removes the worktree. Both clear every CWD-dependent cache (system-prompt sections,
 * memory files, plans directory, git-branch) so the session state recomputes for the
 * new directory, and both refuse to run from a cwd-pinned subagent (it would mutate
 * the parent session's process-wide cwd).
 *
 * 2.1.183 regions (cli_inner_pretty.js):
 *   - 221266            EnterWorktree name const  (WAe)
 *   - 221547            ExitWorktree name const   (ZTn)
 *   - 429793-429830     EnterWorktree prompt fn   (N8a)
 *   - 429831-429852     EnterWorktree render helpers (B8a renderToolUseMessage, F8a renderToolResultMessage)
 *   - 429879-429899     EnterWorktree inputSchema (LMp)  + refine (name/path mutually exclusive)
 *   - 429900-429902     EnterWorktree outputSchema (DMp)
 *   - 429903-430018     EnterWorktree tool object  (G8a)
 *   - 430020-430051     ExitWorktree prompt fn     (q8a)
 *   - 430052-430081     ExitWorktree render helpers (V8a, z8a)
 *   - 430088-430101     countWorktreeChanges       (Y8a)
 *   - 430102-430137     restoreSessionToOriginalCwd (X8a)
 *   - 430138-430142     buildCwdRestoreNote        (Upo)
 *   - 430167-430177     ExitWorktree inputSchema   (PMp)
 *   - 430179-430190     ExitWorktree outputSchema  (MMp)
 *   - 430191-430320     ExitWorktree tool object   (Z8a)
 *   - 46253-46255       isPinnedCwdSubagent        (B$e — AsyncLocalStore presence)
 *   - 300318-300320     getCurrentWorktreeSession  (aA → module var A1t)
 *
 * 2.1.88 convention mirror:
 *   src/tools/EnterWorktreeTool/{EnterWorktreeTool.ts,prompt.ts,constants.ts}
 *   src/tools/ExitWorktreeTool/{ExitWorktreeTool.ts,prompt.ts,constants.ts}
 * 2.1.156 scaffold: 04_tools/README.md (deferred_tools.md — EnterWorktree listed as a deferred tool)
 *
 * Cross-validation (re-verified in the 183 bundle):
 *   - Both schemas, all describe() strings, the name/path mutual-exclusion refine, every
 *     validateInput error string + errorCode, and both call() messages quoted verbatim from
 *     cli_inner_pretty.js. NEW vs 2.1.88: the `path` field (enter-existing), the `B$e()`
 *     pinned-cwd-subagent guards, `enteredExisting` refusal, `tengu_worktree_entered_existing`
 *     telemetry, and `contextLayers: [{ kind: "working_directory" }]` for the pinned-agent branch.
 */

import { z } from 'zod/v4'
import { buildTool, type Tool, type ToolDef } from '../Tool'

// ---------------------------------------------------------------------------
// External helpers (obfuscated → readable). Reconstructed at call sites only;
// deep bodies live outside this unit and are referenced by their bundle anchor.
// ---------------------------------------------------------------------------

// helper: B$e @46253 — true when running inside an AsyncLocalStore-pinned cwd
//   (subagent with isolation:"worktree" or explicit cwd). Mutating process cwd here
//   would clobber the parent session, so both worktree tools refuse.
declare function isPinnedCwdSubagent(): boolean // 2.1.183: B$e @46253

// helper: aA @300318 — returns the current EnterWorktree session record (module var
//   A1t), or undefined. Only populated when EnterWorktree ran in THIS session.
declare function getCurrentWorktreeSession(): WorktreeSession | undefined // 2.1.183: aA @300318

declare function getCwd(): string // 2.1.183: Pt @429929/429978 (process cwd)
declare function findCanonicalGitRoot(cwd: string): string | null // 2.1.183: Nm @429930 (main repo root)
declare function setShellCwd(dir: string): void // 2.1.183: Iy @429956/429981 (mirror cwd into Shell util; throws if dir gone)
declare function getSessionId(): string // 2.1.183: xt @429956/429976/429983
declare function generateRandomWorktreeSlug(): string // 2.1.183: aLe @429983 (random worktree name)

// Worktree lifecycle (utils/worktree.ts analog):
declare function enterExistingWorktreePinned( // 2.1.183: X3n @429955
  path: string,
  opts: { requireManagedLocation: boolean; requireCwdInsideRepo: boolean },
): Promise<WorktreeSession>
declare function enterExistingWorktree(sessionId: string, path: string): Promise<WorktreeSession> // 2.1.183: Fpo @429976
declare function createWorktreeForSession( // 2.1.183: b3t @429983
  sessionId: string,
  slug: string,
  base: undefined,
  opts: { fromCwd: string },
): Promise<WorktreeSession>
declare function keepWorktree(): Promise<void> // 2.1.183: cWe @430270
declare function cleanupWorktree(): Promise<boolean> // 2.1.183: cdt @430286 (false = could not remove)
declare function killTmuxSession(name: string): Promise<void> // 2.1.183: ldt @430285
declare function saveWorktreeState(session: WorktreeSession | null): void // 2.1.183: kW @429998/430129
declare function setProjectRootToWorktree(path: string, sessionId: string): void // 2.1.183: WYr @429956/429997

// CWD-dependent cache clears (each is a no-op-safe memo reset):
declare function clearSystemPromptSections(): void // 2.1.183: kde @430126
declare function recomputeEnvInfo(): void // 2.1.183: ETe @430126
declare function clearMemoryFileCaches(): void // 2.1.183: iLe @429999/430131
declare function clearPlanCaches(): void // 2.1.183: Yk @430000/430132
declare function clearProjectRootCache(dir: string): void // 2.1.183: kD @429996/430126 (rebind projectRoot)
declare function clearGitRootCache(): void // 2.1.183: uz @430002/430133
declare function refreshGitBranchUi(): void // 2.1.183: HS()?.refreshGitBranch?.() @430003/430134
declare const plansDirectoryCache: { cache: { clear?: () => void } } // 2.1.183: Ib.cache.clear @430001/430132

declare function getProjectRoot(): string // 2.1.183: Sc @430267
declare function getOriginalCwd(): string // 2.1.183: Ar @430267
declare function getAgentMetadata(agentId: string): Promise<AgentMetadata | undefined> // 2.1.183: lye @429958
declare function updateAgentMetadata(agentId: string, meta: AgentMetadata): Promise<void> // 2.1.183: Uct @429959

declare function logEvent(event: string, props: Record<string, unknown>): void // 2.1.183: G @429963 etc.
declare function execFileNoThrow(cmd: string, args: string[]): Promise<{ code: number; stdout: string }> // 2.1.183: Fn @430089
declare function gitBinary(): string // 2.1.183: bo @430089
declare function countNonEmptyLines(lines: string[], pred: (s: string) => boolean): number // 2.1.183: Wn @430091 (array count)
declare function formatError(e: unknown): string // 2.1.183: Se @429961
declare function logDebug(msg: string): void // 2.1.183: v @429961/430122
declare function realpath(p: string): Promise<string> // 2.1.183: J8a.realpath @430110 (fs/promises)
declare function isEnoent(e: unknown): boolean // 2.1.183: Pn @430112
declare function homedir(): string // 2.1.183: Q8a.homedir @430116 (os)
declare function getFallbackRootDir(): string // 2.1.183: oB @430116
declare function sanitizeTelemetrySource(s: string): string // 2.1.183: Qe @430300

// Error wrapper for tool-invocation failures (not a ValidationResult):
declare class ToolInvocationError extends Error {} // 2.1.183: YT @429954

declare const pathSep: string // 2.1.183: j8a.sep @429935 (require("path").sep)

interface WorktreeSession {
  worktreePath: string
  worktreeBranch?: string
  originalCwd: string
  originalHeadCommit?: string
  tmuxSessionName?: string
  enteredExisting?: boolean // set when entered via `path` rather than created
}
interface AgentMetadata {
  cwd?: string
  [k: string]: unknown
}

// ===========================================================================
//  Identity
// ===========================================================================

// 2.1.183: ENTER_WORKTREE_TOOL_NAME = WAe @cli_inner_pretty.js:221266
export const ENTER_WORKTREE_TOOL_NAME = 'EnterWorktree'

// 2.1.183: EXIT_WORKTREE_TOOL_NAME = ZTn @cli_inner_pretty.js:221547
export const EXIT_WORKTREE_TOOL_NAME = 'ExitWorktree'

// ===========================================================================
//  EnterWorktree
// ===========================================================================

// 2.1.183: getEnterWorktreeToolPrompt = N8a @cli_inner_pretty.js:429793-429830
// Verbatim — matches assets/tools/EnterWorktree.md "## Prompt" through "## Parameters".
function getEnterWorktreeToolPrompt(): string {
  // @429794
  return `Use this tool ONLY when explicitly instructed to work in a worktree — either by the user directly, or by project instructions (CLAUDE.md / memory). This tool creates an isolated git worktree and switches the current session into it.

## When to Use

- The user explicitly says "worktree" (e.g., "start a worktree", "work in a worktree", "create a worktree", "use a worktree")
- CLAUDE.md or memory instructions direct you to work in a worktree for the current task

## When NOT to Use

- The user asks to create a branch, switch branches, or work on a different branch — use git commands instead
- The user asks to fix a bug or work on a feature — use normal git workflow unless worktrees are explicitly requested by the user or project instructions
- Never use this tool unless "worktree" is explicitly mentioned by the user or in CLAUDE.md / memory instructions

## Requirements

- Must be in a git repository, OR have WorktreeCreate/WorktreeRemove hooks configured in settings.json
- Must not already be in a worktree session when creating a new worktree (\`name\`); switching into another existing worktree via \`path\` is allowed

## Behavior

- In a git repository: creates a new git worktree inside \`.claude/worktrees/\` on a new branch. The base ref is governed by the \`worktree.baseRef\` setting: \`fresh\` (default) branches from origin/<default-branch>; \`head\` branches from your current local HEAD
- Outside a git repository: delegates to WorktreeCreate/WorktreeRemove hooks for VCS-agnostic isolation
- Switches the session's working directory to the new worktree
- Use ExitWorktree to leave the worktree mid-session (keep or remove). On session exit, if still in the worktree, the user will be prompted to keep or remove it

## Entering an existing worktree

Pass \`path\` instead of \`name\` to switch the session into a worktree that already exists (e.g., one you just created with \`git worktree add\`). The path must appear in \`git worktree list\` for the current repository — paths that are not registered worktrees of this repo are rejected. ExitWorktree will not remove a worktree entered this way; use \`action: "keep"\` to return to the original directory.

Switching with \`path\` also works when the session is already in a worktree (the previous worktree is left on disk, untouched, and only the new one is tracked for exit-time cleanup), and from agents whose working directory was pinned at launch (subagent isolation or explicit cwd). In both cases the target must be a worktree under \`.claude/worktrees/\` of the same repository, and from a pinned agent the switch only affects this agent, not the parent session. After a further switch, previously-visited worktrees are no longer writable — re-issue EnterWorktree with \`path\` to return to one.

## Parameters

- \`name\` (optional): A name for a new worktree. If neither \`name\` nor \`path\` is provided, a random name is generated.
- \`path\` (optional): Path to an existing worktree of the current repository to enter instead of creating one. Mutually exclusive with \`name\`.
`
}

// validateWorktreeSlug: adt @429884 — throws on an invalid slug; superRefine
// converts the thrown message into a Zod issue.
declare function validateWorktreeSlug(slug: string): void // 2.1.183: adt @429884

// 2.1.183: enterWorktreeInputSchema = LMp @cli_inner_pretty.js:429879-429899
// `name` and `path` are both optional; the trailing .refine enforces "at most one".
const enterWorktreeInputSchema = z
  .strictObject({
    name: z
      .string()
      .superRefine((value, ctx) => {
        // @429882-429888 — run the slug validator, surface its message as a custom issue
        try {
          validateWorktreeSlug(value)
        } catch (e) {
          ctx.addIssue({ code: 'custom', message: formatError(e) })
        }
      })
      .optional()
      .describe(
        // @429890-429892
        'Optional name for a new worktree. Each "/"-separated segment may contain only letters, digits, dots, underscores, and dashes; max 64 chars total. A random name is generated if not provided. Mutually exclusive with `path`.',
      ),
    path: z
      .string()
      .optional()
      .describe(
        // @429895-429897
        'Path to an existing worktree of the current repository to switch into instead of creating a new one. Must appear in `git worktree list` for the current repo. Mutually exclusive with `name`.',
      ),
  })
  // @429898 — name XOR path (neither is also fine: random name is generated)
  .refine(input => !(input.name && input.path), {
    message: 'Provide at most one of `name` or `path`, not both.',
  })
type EnterWorktreeInput = z.infer<typeof enterWorktreeInputSchema>

// 2.1.183: enterWorktreeOutputSchema = DMp @cli_inner_pretty.js:429900-429902
const enterWorktreeOutputSchema = z.object({
  worktreePath: z.string(),
  worktreeBranch: z.string().optional(),
  message: z.string(),
})
type EnterWorktreeOutput = z.infer<typeof enterWorktreeOutputSchema>

// 2.1.183: EnterWorktreeTool = G8a @cli_inner_pretty.js:429903-430018
export const EnterWorktreeTool: Tool<typeof enterWorktreeInputSchema, EnterWorktreeOutput> =
  buildTool({
    name: ENTER_WORKTREE_TOOL_NAME, // @429904
    searchHint: 'create an isolated git worktree and switch into it', // @429905
    maxResultSizeChars: 100_000, // @429906 (1e5)

    async description() {
      // @429908
      return 'Creates an isolated worktree (via git or configured hooks) and switches the session into it'
    },
    async prompt() {
      return getEnterWorktreeToolPrompt() // @429911
    },
    get inputSchema() {
      return enterWorktreeInputSchema // @429914 (LMp)
    },
    get outputSchema() {
      return enterWorktreeOutputSchema // @429917 (DMp)
    },

    // @429919-429921 — label is "Entering worktree" when switching into an existing
    // worktree (path given), "Creating worktree" otherwise.
    userFacingName(input) {
      return input?.path ? 'Entering worktree' : 'Creating worktree'
    },

    shouldDefer: true, // @429922 — ToolSearch-loaded; not in the eager tool list

    // @429923-429925 — classifier sees the path/name (or "")
    toAutoClassifierInput(input) {
      return input.path ?? input.name ?? ''
    },

    // -----------------------------------------------------------------------
    // validateInput @429926-429948 — two refusal branches (no checkPermissions:
    // approval is handled by the deferral + the explicit cwd mutation).
    // -----------------------------------------------------------------------
    async validateInput(input) {
      // (1) pinned-cwd subagent: creating a worktree would mutate the PARENT
      // session's process-wide cwd. Only `path` (switch this agent into an
      // already-managed worktree) is permitted. @429927-429940
      if (isPinnedCwdSubagent()) {
        if (input.path) return { result: true }
        const cwd = getCwd() // Pt() @429929
        const repoRoot = findCanonicalGitRoot(cwd) // Nm(cwd) @429930
        // If the pinned cwd sits inside a managed repo, point the agent at `path`;
        // otherwise tell it to spawn an Agent with `cwd`. @429935-429937
        const canEnterByPath =
          repoRoot != null && cwd !== repoRoot && cwd.startsWith(repoRoot + pathSep)
        return {
          result: false,
          // @429934-429937
          message:
            'EnterWorktree cannot create a worktree from a subagent with a cwd override (isolation: "worktree" or explicit cwd) — it would mutate the parent session\'s process-wide working directory. ' +
            (canEnterByPath
              ? 'To switch this agent into an existing worktree managed by Claude Code (under .claude/worktrees/ of this repository), call EnterWorktree with `path`. To work in any other directory, spawn an Agent with `cwd` set to it.'
              : 'To work in a different directory (including a worktree), spawn an Agent with `cwd` set to it.'),
          errorCode: 1,
        }
      }

      // (2) already in a worktree session and trying to CREATE a new one (no path).
      // Switching into another existing worktree (path) is still allowed. @429941-429947
      if (getCurrentWorktreeSession() && !input.path) {
        return {
          result: false,
          message:
            'Already in a worktree session. Pass `path` to switch into another existing worktree, or use ExitWorktree to leave this one before creating a new worktree.',
          errorCode: 2,
        }
      }

      return { result: true }
    },

    renderToolUseMessage, // B8a @429831 → path ?? name ?? ""
    renderToolResultMessage: renderEnterWorktreeResultMessage, // F8a @429834

    // -----------------------------------------------------------------------
    // call @429952-430014 — three flows: pinned-agent switch, normal switch (path),
    // normal create (name/random). All but the pinned branch chdir the process.
    // -----------------------------------------------------------------------
    async call(input, context): Promise<{ data: EnterWorktreeOutput; contextLayers?: unknown[] }> {
      // --- pinned-cwd subagent branch @429953-429972 ---
      // Requires `path` (validateInput already rejects the no-path case, but the
      // call defends independently). Switches ONLY this agent, not the parent session;
      // emits a contextLayers working_directory so the runtime scopes write access.
      if (isPinnedCwdSubagent()) {
        if (!input.path) {
          throw new ToolInvocationError(
            'EnterWorktree from a session with a pinned working directory requires `path`.', // @429954
          )
        }
        const session = await enterExistingWorktreePinned(input.path, {
          requireManagedLocation: true, // must be under .claude/worktrees/
          requireCwdInsideRepo: true,
        }) // @429955
        setShellCwd(session.worktreePath) // Iy @429956
        setProjectRootToWorktree(session.worktreePath, context.agentId ?? getSessionId()) // WYr @429956

        // Persist the new cwd onto this agent's metadata so resumes stay pinned. @429957-429962
        if (context.agentId) {
          try {
            const meta = await getAgentMetadata(context.agentId)
            if (meta) await updateAgentMetadata(context.agentId, { ...meta, cwd: session.worktreePath })
          } catch (e) {
            logDebug(`Failed to update agent metadata cwd after worktree switch: ${formatError(e)}`)
          }
        }

        logEvent('tengu_worktree_entered_existing', { mid_session: true, cwd_override: true }) // @429963

        const branchInfo = session.worktreeBranch ? ` on branch ${session.worktreeBranch}` : '' // @429964
        return {
          data: {
            worktreePath: session.worktreePath,
            worktreeBranch: session.worktreeBranch,
            // @429969
            message: `Entered worktree at ${session.worktreePath}${branchInfo}. This agent's working directory and write access now point at the worktree; the previous directory was left untouched.`,
          },
          // @429971 — scopes the agent's working_directory to the worktree
          contextLayers: [{ kind: 'working_directory', directory: session.worktreePath }],
        }
      }

      // --- normal session (not pinned) @429974-430013 ---
      // Defensive re-check of the create-while-in-worktree race. @429974
      if (getCurrentWorktreeSession() && !input.path) {
        throw new Error('Already in a worktree session')
      }

      let session: WorktreeSession
      if (input.path) {
        // switch the whole session into an existing worktree @429976
        session = await enterExistingWorktree(getSessionId(), input.path)
      } else {
        // create a new worktree. First hop to the canonical repo root so creation
        // works even when invoked from inside a worktree; roll back on failure. @429977-429992
        const startCwd = getCwd() // Pt()
        const repoRoot = findCanonicalGitRoot(startCwd) // Nm()
        let movedToRoot = false
        if (repoRoot && repoRoot !== startCwd) {
          process.chdir(repoRoot)
          setShellCwd(repoRoot)
          movedToRoot = true
        }
        try {
          session = await createWorktreeForSession(
            getSessionId(),
            input.name ?? generateRandomWorktreeSlug(), // aLe() @429983
            undefined,
            { fromCwd: startCwd },
          )
        } catch (e) {
          if (movedToRoot) {
            try {
              process.chdir(startCwd)
              setShellCwd(startCwd)
            } catch {
              // original dir vanished mid-create — drop git-root cache + refresh branch UI
              clearGitRootCache()
              refreshGitBranchUi()
            }
          }
          throw e
        }
      }

      // chdir into the (new or existing) worktree and rebuild every CWD-derived cache. @429994-430004
      process.chdir(session.worktreePath)
      setShellCwd(session.worktreePath) // Iy
      clearProjectRootCache(getCwd()) // kD(Pt())
      setProjectRootToWorktree(session.worktreePath, getSessionId()) // WYr
      saveWorktreeState(session) // kW(session)
      clearMemoryFileCaches() // iLe()
      clearPlanCaches() // Yk()
      plansDirectoryCache.cache.clear?.() // Ib.cache.clear?.()
      clearGitRootCache() // uz()
      refreshGitBranchUi() // HS()?.refreshGitBranch?.()
      logEvent(input.path ? 'tengu_worktree_entered_existing' : 'tengu_worktree_created', {
        mid_session: true,
      }) // @430004

      const branchInfo = session.worktreeBranch ? ` on branch ${session.worktreeBranch}` : '' // @430005
      const verb = input.path ? 'Entered' : 'Created' // @430006
      return {
        data: {
          worktreePath: session.worktreePath,
          worktreeBranch: session.worktreeBranch,
          // @430011
          message: `${verb} worktree at ${session.worktreePath}${branchInfo}. The session is now working in the worktree. Use ExitWorktree to leave mid-session, or exit the session to be prompted.`,
        },
      }
    },

    // @430015-430017 — passes the human message straight through as the tool_result
    mapToolResultToToolResultBlockParam({ message }, toolUseID) {
      return { type: 'tool_result', content: message, tool_use_id: toolUseID }
    },
  } satisfies ToolDef<typeof enterWorktreeInputSchema, EnterWorktreeOutput>)

// 2.1.183: renderToolUseMessage = B8a @cli_inner_pretty.js:429831-429833
function renderToolUseMessage({ name, path }: { name?: string; path?: string }): string {
  return path ?? name ?? ''
}

// 2.1.183: renderToolResultMessage = F8a @cli_inner_pretty.js:429834-429852
// UI-only ("Switched to worktree" + optional branch + dimmed path); summarized.
declare function renderEnterWorktreeResultMessage(
  output: EnterWorktreeOutput,
  ...rest: unknown[]
): unknown // helper: F8a @429834 — Ink element, no contract surface

// ===========================================================================
//  ExitWorktree
// ===========================================================================

// 2.1.183: getExitWorktreeToolPrompt = q8a @cli_inner_pretty.js:430020-430051
// Verbatim — matches assets/tools/ExitWorktree.md "## Prompt" through "## Behavior".
function getExitWorktreeToolPrompt(): string {
  // @430021
  return `Exit a worktree session created by EnterWorktree and return the session to the original working directory.

## Scope

This tool ONLY operates on worktrees created by EnterWorktree in this session. It will NOT touch:
- Worktrees you created manually with \`git worktree add\`
- Worktrees from a previous session (even if created by EnterWorktree then)
- The directory you're in if EnterWorktree was never called

If called outside an EnterWorktree session, the tool is a **no-op**: it reports that no worktree session is active and takes no action. Filesystem state is unchanged.

## When to Use

- The user explicitly asks to "exit the worktree", "leave the worktree", "go back", or otherwise end the worktree session
- Do NOT call this proactively — only when the user asks

## Parameters

- \`action\` (required): \`"keep"\` or \`"remove"\`
  - \`"keep"\` — leave the worktree directory and branch intact on disk. Use this if the user wants to come back to the work later, or if there are changes to preserve.
  - \`"remove"\` — delete the worktree directory and its branch. Use this for a clean exit when the work is done or abandoned.
- \`discard_changes\` (optional, default false): only meaningful with \`action: "remove"\`. If the worktree has uncommitted files or commits not on the original branch, the tool will REFUSE to remove it unless this is set to \`true\`. If the tool returns an error listing changes, confirm with the user before re-invoking with \`discard_changes: true\`.

## Behavior

- Restores the session's working directory to where it was before EnterWorktree
- Clears CWD-dependent caches (system prompt sections, memory files, plans directory) so the session state reflects the original directory
- If a tmux session was attached to the worktree: killed on \`remove\`, left running on \`keep\` (its name is returned so the user can reattach)
- Once exited, EnterWorktree can be called again to create a fresh worktree
`
}

// 2.1.183: exitWorktreeInputSchema = PMp @cli_inner_pretty.js:430167-430177
const exitWorktreeInputSchema = z.strictObject({
  action: z
    .enum(['keep', 'remove'])
    .describe(
      // @430170
      '"keep" leaves the worktree and branch on disk; "remove" deletes both.',
    ),
  discard_changes: z
    .boolean()
    .optional()
    .describe(
      // @430174-430176
      'Required true when action is "remove" and the worktree has uncommitted files or unmerged commits. The tool will refuse and list them otherwise.',
    ),
})
type ExitWorktreeInput = z.infer<typeof exitWorktreeInputSchema>

// 2.1.183: exitWorktreeOutputSchema = MMp @cli_inner_pretty.js:430179-430190
const exitWorktreeOutputSchema = z.object({
  action: z.enum(['keep', 'remove']),
  originalCwd: z.string(),
  worktreePath: z.string(),
  worktreeBranch: z.string().optional(),
  tmuxSessionName: z.string().optional(),
  discardedFiles: z.number().optional(),
  discardedCommits: z.number().optional(),
  message: z.string(),
})
type ExitWorktreeOutput = z.infer<typeof exitWorktreeOutputSchema>

type ChangeSummary = { changedFiles: number; commits: number }

// 2.1.183: countWorktreeChanges = Y8a @cli_inner_pretty.js:430088-430101
// Fail-closed: returns null when git state cannot be reliably determined (non-zero
// exit) OR when there is no baseline head commit to count commits against. Callers
// treat null as "unknown, assume unsafe" — a silent 0/0 would let remove() destroy work.
async function countWorktreeChanges(
  worktreePath: string,
  originalHeadCommit: string | undefined,
): Promise<ChangeSummary | null> {
  // @430089 — git -C <wt> status --porcelain
  const status = await execFileNoThrow(gitBinary(), ['-C', worktreePath, 'status', '--porcelain'])
  if (status.code !== 0) return null
  const changedFiles = countNonEmptyLines(status.stdout.split('\n'), l => l.trim() !== '') // @430091

  // No baseline commit (e.g. hook-based worktree wrapping git): cannot count commits. @430096
  if (!originalHeadCommit) return null

  // @430097 — git -C <wt> rev-list --count <base>..HEAD
  const revList = await execFileNoThrow(gitBinary(), [
    '-C',
    worktreePath,
    'rev-list',
    '--count',
    `${originalHeadCommit}..HEAD`,
  ])
  if (revList.code !== 0) return null
  const commits = parseInt(revList.stdout.trim(), 10) || 0
  return { changedFiles, commits }
}

interface CwdRestoreResult {
  restoredCwd: string
  originalCwdMissing: boolean
  fellBackToWorktree: boolean
}

// 2.1.183: restoreSessionToOriginalCwd = X8a @cli_inner_pretty.js:430102-430137
// Inverse of EnterWorktree's session mutations. Tries to chdir back to the original
// cwd; if it's gone, falls back through [worktreePath, homedir, fallbackRoot] and
// reports the recovery. Clears every CWD-dependent cache regardless of outcome.
async function restoreSessionToOriginalCwd(
  originalCwd: string,
  projectRootIsWorktree: boolean,
  worktreePath: string,
): Promise<CwdRestoreResult> {
  let restoredCwd = originalCwd
  let originalCwdMissing = false
  try {
    setShellCwd(originalCwd) // Iy(originalCwd) @430106
  } catch (e) {
    // Distinguish "dir genuinely gone (ENOENT)" from other failures (rethrow). @430108-430114
    let missing = false
    try {
      await realpath(originalCwd)
    } catch (statErr) {
      missing = isEnoent(statErr)
    }
    if (!missing) throw e
    originalCwdMissing = true
    restoredCwd = ''
    // @430116 — recover into the first usable of: worktree, home, fallback root
    for (const candidate of [worktreePath, homedir(), getFallbackRootDir()]) {
      try {
        setShellCwd(candidate)
        restoredCwd = candidate
        break
      } catch {
        /* try next */
      }
    }
    if (!restoredCwd) throw e
    logDebug(
      `ExitWorktree: original directory "${originalCwd}" no longer exists; session cwd recovered to "${restoredCwd}"`, // @430122
    )
  }

  // Only restore projectRoot/system-prompt caches when we actually landed on a real
  // original directory (not when we fell back to the now-doomed worktree). @430124-430127
  const fellBackToWorktree = originalCwdMissing && restoredCwd === worktreePath
  if (!originalCwdMissing || fellBackToWorktree) {
    clearProjectRootCache(restoredCwd) // kD(restoredCwd)
    if (projectRootIsWorktree) {
      clearSystemPromptSections() // kde(restoredCwd)
      recomputeEnvInfo() // ETe()
    }
  }

  saveWorktreeState(null) // kW(null) @430129
  clearMemoryFileCaches() // iLe()
  clearPlanCaches() // Yk()
  plansDirectoryCache.cache.clear?.() // Ib.cache.clear?.()
  clearGitRootCache() // uz()
  refreshGitBranchUi() // HS()?.refreshGitBranch?.()
  return { restoredCwd, originalCwdMissing, fellBackToWorktree }
}

// 2.1.183: buildCwdRestoreNote = Upo @cli_inner_pretty.js:430138-430142
// Trailing sentence appended to every Exit message describing where the session landed.
function buildCwdRestoreNote(originalCwd: string, restore: CwdRestoreResult): string {
  if (!restore.originalCwdMissing) return `Session is now back in ${originalCwd}.` // @430139
  const note = `The original directory ${originalCwd} no longer exists, so the session is now in ${restore.restoredCwd}.` // @430140
  return restore.fellBackToWorktree
    ? note
    : `${note} Consider restarting Claude from an existing directory.` // @430141
}

// 2.1.183: ExitWorktreeTool = Z8a @cli_inner_pretty.js:430191-430320
export const ExitWorktreeTool: Tool<typeof exitWorktreeInputSchema, ExitWorktreeOutput> = buildTool({
  name: EXIT_WORKTREE_TOOL_NAME, // @430192
  searchHint: 'exit a worktree session and return to the original directory', // @430193
  maxResultSizeChars: 100_000, // @430194 (1e5)

  async description() {
    // @430196
    return 'Exits a worktree session created by EnterWorktree and restores the original working directory'
  },
  async prompt() {
    return getExitWorktreeToolPrompt() // @430199
  },
  get inputSchema() {
    return exitWorktreeInputSchema // @430202 (PMp)
  },
  get outputSchema() {
    return exitWorktreeOutputSchema // @430205 (MMp)
  },

  // @430207-430209 — "Cleaning up worktree" for remove, "Exiting worktree" for keep
  userFacingName(input) {
    return input?.action === 'remove' ? 'Cleaning up worktree' : 'Exiting worktree'
  },

  shouldDefer: true, // @430210

  // @430211-430213 — remove is destructive (drives the permission UI badge)
  isDestructive(input) {
    return input.action === 'remove'
  },

  toAutoClassifierInput(input) {
    return input.action // @430215
  },

  // -------------------------------------------------------------------------
  // validateInput @430217-430259 — four refusal branches (no checkPermissions;
  // safety is enforced entirely here + isDestructive gating).
  // -------------------------------------------------------------------------
  async validateInput(input) {
    // (1) pinned-cwd subagent: mutating process cwd would clobber the parent. @430218-430224
    if (isPinnedCwdSubagent()) {
      return {
        result: false,
        message:
          'ExitWorktree cannot be called from a subagent with a cwd override (isolation: "worktree" or explicit cwd) — it would mutate the parent session\'s process-wide working directory. This agent is already isolated; use Bash with `cd` for directory changes within it.',
        errorCode: 5,
      }
    }

    // (2) no active EnterWorktree session → no-op (this tool only touches sessions
    // it created, never manual `git worktree add` or prior-session worktrees). @430225-430232
    const session = getCurrentWorktreeSession()
    if (!session) {
      return {
        result: false,
        message:
          'No-op: there is no active EnterWorktree session to exit. This tool only operates on worktrees created by EnterWorktree in the current session — it will not touch worktrees created manually or in a previous session. No filesystem changes were made.',
        errorCode: 1,
      }
    }

    // (3) remove refused on an entered-existing worktree (we did not create it). @430233-430238
    if (input.action === 'remove' && session.enteredExisting) {
      return {
        result: false,
        message: `This session entered an existing worktree (${session.worktreePath}); it was not created by EnterWorktree, so this tool will not remove it. Use action: "keep" to return to ${session.originalCwd}, then remove the worktree manually with \`git worktree remove\` if desired.`,
        errorCode: 4,
      }
    }

    // (4) remove without discard_changes: count work and refuse if anything would be
    // lost. Fail-closed when git state is indeterminate (null → errorCode 3). @430239-430257
    if (input.action === 'remove' && !input.discard_changes) {
      const summary = await countWorktreeChanges(session.worktreePath, session.originalHeadCommit)
      if (summary === null) {
        return {
          result: false,
          message: `Could not verify worktree state at ${session.worktreePath}. Refusing to remove without explicit confirmation. Re-invoke with discard_changes: true to proceed — or use action: "keep" to preserve the worktree.`,
          errorCode: 3,
        }
      }
      const { changedFiles, commits } = summary
      if (changedFiles > 0 || commits > 0) {
        const parts: string[] = []
        if (changedFiles > 0) {
          parts.push(`${changedFiles} uncommitted ${changedFiles === 1 ? 'file' : 'files'}`)
        }
        if (commits > 0) {
          parts.push(
            `${commits} ${commits === 1 ? 'commit' : 'commits'} on ${session.worktreeBranch ?? 'the worktree branch'}`,
          )
        }
        return {
          result: false,
          message: `Worktree has ${parts.join(' and ')}. Removing will discard this work permanently. Confirm with the user, then re-invoke with discard_changes: true — or use action: "keep" to preserve the worktree.`,
          errorCode: 2,
        }
      }
    }

    return { result: true }
  },

  renderToolUseMessage: renderExitWorktreeUseMessage, // V8a @430052 → ""
  renderToolResultMessage: renderExitWorktreeResultMessage, // z8a @430055

  // -------------------------------------------------------------------------
  // call @430263-430316 — keep or remove. Both re-count changes (for analytics +
  // output), restore the original cwd, fire telemetry, and emit a message.
  // -------------------------------------------------------------------------
  async call(input): Promise<{ data: ExitWorktreeOutput }> {
    const session = getCurrentWorktreeSession()
    // validateInput guards this, but the session is module-mutable state — defend
    // against a race between validation and execution. @430264-430265
    if (!session) throw new Error('Not in a worktree session')

    const {
      originalCwd,
      worktreePath,
      worktreeBranch,
      tmuxSessionName,
      originalHeadCommit,
    } = session

    // projectRoot was redirected to the worktree only by --worktree startup, not by
    // mid-session EnterWorktree. Detect that case so restore is symmetric. @430267
    const projectRootIsWorktree = getProjectRoot() === getOriginalCwd()

    // Re-count at execution time (state may differ from validateInput). Null → 0/0:
    // safety already enforced in validateInput, so this only affects messaging. @430268
    const { changedFiles, commits } = (await countWorktreeChanges(worktreePath, originalHeadCommit)) ?? {
      changedFiles: 0,
      commits: 0,
    }

    // --- keep @430269-430283 ---
    if (input.action === 'keep') {
      await keepWorktree() // cWe()
      const restore = await restoreSessionToOriginalCwd(originalCwd, projectRootIsWorktree, worktreePath)
      logEvent('tengu_worktree_kept', { mid_session: true, commits, changed_files: changedFiles }) // @430272

      const tmuxNote = tmuxSessionName
        ? ` Tmux session ${tmuxSessionName} is still running; reattach with: tmux attach -t ${tmuxSessionName}`
        : '' // @430273
      return {
        data: {
          action: 'keep',
          originalCwd,
          worktreePath,
          worktreeBranch,
          tmuxSessionName,
          // @430281
          message: `Exited worktree. Your work is preserved at ${worktreePath}${worktreeBranch ? ` on branch ${worktreeBranch}` : ''}. ${buildCwdRestoreNote(originalCwd, restore)}${tmuxNote}`,
        },
      }
    }

    // --- remove @430285-430315 ---
    if (tmuxSessionName) await killTmuxSession(tmuxSessionName) // ldt(s) @430285
    const removed = await cleanupWorktree() // cdt() @430286 — false if it could not be removed
    const restore = await restoreSessionToOriginalCwd(originalCwd, projectRootIsWorktree, worktreePath)

    // cleanup failed (e.g. directory busy): keep the worktree, report. @430288-430299
    if (!removed) {
      return {
        data: {
          action: 'remove',
          originalCwd,
          worktreePath,
          worktreeBranch,
          discardedFiles: 0,
          discardedCommits: 0,
          // @430297
          message: `Exited worktree but could not remove it — kept at ${worktreePath}. ${buildCwdRestoreNote(originalCwd, restore)}`,
        },
      }
    }

    logEvent('tengu_worktree_removed', {
      source: sanitizeTelemetrySource('exit_tool'), // Qe("exit_tool") @430300
      mid_session: true,
      commits,
      changed_files: changedFiles,
    })

    const discardParts: string[] = []
    if (commits > 0) discardParts.push(`${commits} ${commits === 1 ? 'commit' : 'commits'}`) // @430302
    if (changedFiles > 0) {
      discardParts.push(`${changedFiles} uncommitted ${changedFiles === 1 ? 'file' : 'files'}`) // @430303
    }
    const discardNote = discardParts.length > 0 ? ` Discarded ${discardParts.join(' and ')}.` : '' // @430304
    return {
      data: {
        action: 'remove',
        originalCwd,
        worktreePath,
        worktreeBranch,
        discardedFiles: changedFiles,
        discardedCommits: commits,
        // @430313
        message: `Exited and removed worktree at ${worktreePath}.${discardNote} ${buildCwdRestoreNote(originalCwd, restore)}`,
      },
    }
  },

  // @430317-430319 — message passed straight through
  mapToolResultToToolResultBlockParam({ message }, toolUseID) {
    return { type: 'tool_result', content: message, tool_use_id: toolUseID }
  },
} satisfies ToolDef<typeof exitWorktreeInputSchema, ExitWorktreeOutput>)

// 2.1.183: renderToolUseMessage = V8a @cli_inner_pretty.js:430052-430054 (always "")
function renderExitWorktreeUseMessage(_input: ExitWorktreeInput): string {
  return ''
}

// 2.1.183: renderToolResultMessage = z8a @cli_inner_pretty.js:430055-430081
// UI-only ("Kept worktree"/"Removed worktree" + optional branch + "Returned to <cwd>"); summarized.
declare function renderExitWorktreeResultMessage(
  output: ExitWorktreeOutput,
  ...rest: unknown[]
): unknown // helper: z8a @430055 — Ink element, no contract surface
