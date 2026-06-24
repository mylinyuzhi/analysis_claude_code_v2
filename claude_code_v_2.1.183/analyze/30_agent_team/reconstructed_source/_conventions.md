# Reconstruction Conventions — Agent Team / "swarm" (v2.1.183, readable-source restoration)

> **Goal:** a *readable-source-level* restoration of the **entire** Agent-Team ("swarm")
> subsystem **as it exists in Claude Code v2.1.183**, written as clean TypeScript organized the way
> the genuine Anthropic source tree (v2.1.88 named-TS at `/lyz/codespace/3rd/claude-code/src`)
> organizes it. This is NOT a delta doc — reconstruct the *whole machine*, including the parts that
> are byte-for-byte carryover from v2.1.156 (mailbox, backend registry, in-process runner,
> permission bridge, prompt addendum), AND the v2.1.178 redesign (implicit session team,
> Agent-tool-as-spawner, tmux respawn-pane fix).

## Three evidence tiers (do not confuse them)

1. **PRIMARY — the v2.1.183 obfuscated bundle**
   `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
   **Every** reconstructed function, constant, branch, and verbatim string MUST be verified by
   *reading the exact line(s)* here. This is the only source of truth for **behavior**. Obfuscated
   names re-mangle every build — never trust a name from v2.1.156/v2.1.88; re-derive it here.
   Assets corroborate verbatim text: `extract/assets/tools/{Agent,SendMessage}.md` (verbatim tool
   descriptions), `assets/feature_gates.json` (`tengu_amber_flint`, `tengu_coordinator_*`),
   `assets/env_vars.json` (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`, `CLAUDE_CODE_COORDINATOR_MODE`,
   `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME`, `CLAUDE_CODE_TEAMMATE_COMMAND`).

2. **SCAFFOLD — the v2.1.183 delta analysis docs (this very module) + the scout dossier**
   `30_agent_team/{README.md, implicit_team_and_agent_tool_spawn.md, spawn_backends_and_tmux_fix.md,
   mailbox_lifecycle_and_sendmessage_delta.md, coordinator_and_background_survival.md}` and
   `_scout_dossier_agent_team.md`. These already contain **v2.1.183-specific** anchors, snippets,
   readable names, and before/after analysis. They are a strong jump-start — but **re-verify every
   anchor against the live bundle** (line numbers must be re-read; treat as hint, not gospel).
   Secondary scaffold for unchanged-carryover *logic*: the v2.1.156 baseline
   `claude_code_v_2.1.156/analyze/30_agent_team/`.

3. **CONVENTION + REAL ANCESTOR — the v2.1.88 named-TS source**
   `/lyz/codespace/3rd/claude-code/src`. **Unlike the Workflow feature, the swarm is NOT gated out
   in v2.1.88 — it is a real, fully-implemented subsystem.** So v2.1.88 is both the *shape* template
   (file layout, naming idioms, `Tool`/`buildTool` factory, Zod usage, `feature()`/gate helpers,
   ESM `.js` import specifiers on `.ts`, React/Ink `.tsx` for UI) **and** a genuine readable ancestor
   for the carryover parts — borrow real function names and logic where v2.1.183 still does the same
   thing (mailbox, registry, in-process runner, permission bridge, addendum, agent-id helpers).
   **But the v2.1.178 redesign means the topology differs:** v2.1.88 has `tools/TeamCreateTool/` and
   `tools/TeamDeleteTool/` (DELETED in v2.1.183 — do NOT reconstruct them as live; mention only as
   "before"), and v2.1.88 spawns teammates via the `team_name` parameter (v2.1.183 spawns via the
   Agent `name` + the implicit `teamContext`). When behavior diverges, the **183 bundle wins**; cite
   the 88 file only for the convention/name you borrowed.

   Key 88 ancestor → 183 unit map (cite the 88 path you mirror):
   - `utils/agentSwarmsEnabled.ts` → gate (`Sl`); NOTE 183 dropped the `USER_TYPE==='ant'` branch.
   - `utils/agentId.ts`, `utils/agentContext.ts`, `utils/teammateContext.ts` → identity/context.
   - `utils/mailbox.ts` (in-memory `Mailbox` class) + the file-mailbox helpers → `utils/mailbox.ts`.
   - `utils/teammateMailbox.ts` → control-message builders/parsers + `isControlMessage`.
   - `utils/swarm/teammateInit.ts`, `teamHelpers.ts` → implicit-team init + team-file I/O.
   - `utils/swarm/teammatePromptAddendum.ts` → addendum (`Rdo`).
   - `utils/swarm/inProcessRunner.ts`, `spawnInProcess.ts` → in-process runner (`sDp`/`qut`).
   - `utils/swarm/leaderPermissionBridge.ts`, `permissionSync.ts` → permission bridge (`eDp`).
   - `utils/swarm/backends/{registry,detection,TmuxBackend,ITermBackend,teammateModeSnapshot}.ts`
     → backend layer (NOTE the tmux `send-keys`→`respawn-pane -k --` fix in TmuxBackend).
   - `tools/AgentTool/AgentTool.tsx`, `prompt.ts`, `constants.ts` → Agent tool spawn routing.
   - `tools/SendMessageTool/{SendMessageTool.ts,prompt.ts,constants.ts}` → SendMessage.
   - `coordinator/coordinatorMode.ts` → coordinator mode.

## File format (each reconstructed `.ts`/`.tsx`)

- Clean, idiomatic, **readable** TypeScript — what the original source plausibly looked like. Prefer
  the readable names already used in the v2.1.183 delta docs + the scout dossier + the v2.1.88
  ancestor (see registry below).
- **Every** top-level function/const carries an anchor comment tying it to evidence, e.g.
  `// 2.1.183: initializeSessionTeam = j3f @cli_inner_pretty.js:682765`. Non-trivial branches get
  inline `// @<line>` anchors so a reviewer can re-verify any line.
- **File header block** (top of file) listing: the v2.1.183 source regions covered, the v2.1.88
  convention/ancestor mirror (path), which delta doc was used as scaffold, and a one-line
  cross-validation note (what you re-verified in the 183 bundle).
- **No invented behavior.** If a detail can't be confirmed in the 183 bundle, omit it or mark
  `// UNVERIFIED: …` and report it in your manifest. Faithful-to-source beats plausible-but-guessed.
- For REMOVED-in-183 surfaces (TeamCreate/TeamDelete): do NOT create live files for them. If a
  carryover file references the old surface, note `// REMOVED in v2.1.178 redesign` inline.
- UI/`.tsx` display components (spinners, dialogs, status lines) are OUT OF SCOPE for full
  reconstruction — the focus is the agent-team *capability/logic*. Reconstruct logic-bearing `.tsx`
  (e.g. `AgentTool.tsx` `call`/schema/description) fully; for pure-render components, only note their
  existence + role in a header comment if a logic file depends on them.
- Keep obfuscated single-letter locals only where readability doesn't suffer; otherwise rename to
  intent-revealing names and add a trailing `// Mapping: …` comment for that function. English only.

## Anchor-comment style (so reviewers can re-verify fast)

```ts
/**
 * Implicit session team created once at CLI startup (v2.1.178 redesign).
 * 2.1.183 regions: cli_inner_pretty.js:682752-682820 ; bootstrap gate @693472
 * 2.1.88 ancestor: utils/swarm/teammateInit.ts (shape) — but 88 had no implicit team (TeamCreate did this)
 * scaffold: 30_agent_team/implicit_team_and_agent_tool_spawn.md
 * cross-val: re-read j3f/xic/F3f bodies in 183 bundle; team name = `session-${id.slice(0,8)}`
 */
// 2.1.183: sessionTeamName = xic @682752 ; SESSION_TEAM_PREFIX = B3f ("session")
export function sessionTeamName(sessionId: string): string {
  return `${SESSION_TEAM_PREFIX}-${sessionId.slice(0, 8)}`   // @682753
}
```

## Naming consistency (reuse across files — sourced from scout dossier + 88 ancestor)

`isAgentSwarmsEnabled`(Sl @293832), `hasAgentTeamsCliFlag`(yqd @293828), `getTeamsDir`(Gbe @735),
`getInboxPath`(v4e @365920), `ensureInboxDir`(Kyp @365927), `readMailbox`(Fhe), `writeToMailbox`($A @365950),
`LOCK_OPTIONS`(iUt), `TEAM_LEAD_NAME`(np="team-lead" @362636), `MAIN_RESERVED_NAME`(LY="main" @362512),
`formatAgentId`(bQ @103172), `isTeammateSession`(em @103466),
`TEAMMATE_SYSTEM_PROMPT_ADDENDUM`(Rdo @420705), `createTeammateCanUseTool`(eDp @420713),
`initializeSessionTeam`(j3f @682765), `sessionTeamName`(xic @682752), `SESSION_TEAM_PREFIX`(B3f="session"),
`resolveInheritedTeamName`(F3f @682756), `getTeamFilePath`(gte @362812), `readTeamFile`(Nhe/gj @362824/362815),
`AGENT_TOOL_NAME`(vs), `agentTool`(f3n @423515), `agentInputSchema`(IDp @423446), `agentBaseInputSchema`(CDp @423432),
`spawnTeammate`(cqa @423053), `dispatchTeammateSpawn`(HDp @423041), `spawnInProcessTeammate`(sqa @422925),
`spawnPaneTeammate`(SDp @422644), `spawnNonSplitPaneTeammate`(EDp @422762),
`isInProcessEnabled`(rWe @422425), `getTeammateMode`(Aje @293813), `detectBackend`(eLe @422314),
`markInProcessFallback`(Wdo @422419), `backendRegistry`(_F @422467), `TmuxBackend`(Ndo @421879),
`sendCommandToPane`(via a3n @421874 respawn-pane), `TMUX_HOLDING_CMD`(Gke="cat" @362642), `TMUX_BIN`(B8="tmux" @362640),
`TEAMMATE_COMMAND_ENV`(_lt="CLAUDE_CODE_TEAMMATE_COMMAND" @362643),
`startInProcessTeammate`(qut @421374), `runInProcessTeammate`(sDp @421006), `IN_PROCESS_POLL_MS`(ZLp=500 @421380),
`deliverIdleNotification`(C5a), `SEND_MESSAGE_TOOL_NAME`(zh="SendMessage" @221450), `sendMessageTool`(p$p @434568),
`sendMessageInputSchema`(o$p @434558), `sendMessageDescription`(nza @434314), `buildSendMessagePrompt`(rza @434286),
`isCoordinatorMode`(oI/z9 @221870/221874), `getCoordinatorSystemPrompt`(bvd @221940),
`matchSessionMode`(yvd @221898), `workerStopToolName`(uP), `buildTaskNotification`(G4e @445826),
`keepaliveReasons`(Lye @445750), `isCompletedButKeptAlive`(YR @445754).

If you discover a NEW symbol not listed above, record it in your manifest so it lands in the symbol
index (`00_overview/symbol_additions_v2_1_183_agent_team.md`).
