# Anchors: MODE / WEB / MCP tool group — Claude Code v2.1.183

Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
Verbatim tool descriptions: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/assets/tools/<Name>.md`

All line numbers below are `cli_inner_pretty.js:<line>`. Every decl was read and verified in this bundle. Tools: EnterPlanMode, ExitPlanMode, EnterWorktree, ExitWorktree, AskUserQuestion, WebFetch, WebSearch, ListMcpResourcesTool, ReadMcpResourceTool, WaitForMcpServers, mcp (generic wrapper).

---

## 0. Shared factory + key gating predicates (read these first)

- `pi` — tool factory, **@149995-149997**. `function pi(e){return Object.defineProperties({...jJu, userFacingName:()=>e.name}, Object.getOwnPropertyDescriptors(e))}`. `jJu` is the base tool object (defaults). Every tool object below is `X = pi({...})`.
- `ct` — Statsig gate getter, **@146595** (`ct("tengu_*", default)`).
- `Dg` — **the "lean/simple system prompt" predicate (scaffold X3)**, **@134268-134273**. `Dg = wn((e)=>{ if(!e) return !1; if(st(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return !0; if(yl(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return !1; return !I8u(e)||C8u(e); })`. Takes the model `e`. Used to pick the SHORT prompt branch for WebFetch / WebSearch / AskUserQuestion. Confidence: high.
- `F1r` — **`schemaDescFixes` gate (NEW in 2.1.183)**, **@147797-147799**. `function F1r(){return Dkt().schemaDescFixes}`. Backed by `Dkt()` **@147759**, key `t.thistle_skein === !0` of Statsig config object `Umi()?.juniper_shoal`; default `Fmi.schemaDescFixes = !1` **@147844**. Switches AskUserQuestion schema `.describe()` strings to the longer "hard schema constraints" wording. `grep -c schemaDescFixes` in 2.1.156 bundle = **0** (new).
- `Ot` global session state: `qb` (allowedChannels) **@3665**, `xr` (= `!Ot.isInteractive`, i.e. non-interactive) **@3151**, `FKt`/`UKt` (`questionPreviewFormat`) **@3238 / @3241**.
- `em` — agent/team auto-approve predicate, **@103466-103469**: `if(Pk()) return !0; return !!($q?.agentId && $q?.teamName)`. Used by ExitPlanMode + AskUserQuestion-adjacent flows.

---

## 1. EnterPlanMode

Asset: `assets/tools/EnterPlanMode.md`. Schema fn `Wwp`, tool object `a2n`.

- name const `A7 = "EnterPlanMode"` — **@221314**.
- inputSchema `Wwp` — **@392327**: `we(() => H.strictObject({}))` (no params; pure side-effect tool).
- outputSchema `qwp` — **@392328**: `H.object({ message: H.string().describe("Confirmation that plan mode was entered") })`.
- tool object `a2n = pi({...})` — **@392329-392392**.
  - `searchHint: "switch to plan mode to design an approach before coding"` **@392331**.
  - `maxResultSizeChars: 1e5` **@392332**.
  - `description()` returns `"Requests permission to enter plan mode for complex tasks requiring exploration and design"` **@392334**.
  - `prompt()` → `BUa()` **@392337**. `BUa` **@392270** → `Gwp()` **@392271**. The full prompt text is in `Gwp` **@392192** (verbatim matches asset, starts `Use this tool proactively when you're about to start a non-trivial implementation task...`).
  - `userFacingName()` → `""` **@392346**.
  - `shouldDefer: !0` **@392348** (deferred / ToolSearch-loaded).
  - `isEnabled()` **@392349-392352**: `if (qb().length > 0 && xr()) return !1; return !0;` → disabled when there are agent channels AND session is non-interactive.
  - `isConcurrencySafe() → !0` **@392353**; `isReadOnly() → !0` **@392356**.
  - **No validateInput / no checkPermissions** (approval handled by the deferral + the `call` permission-context mutation).
  - `call(e, t)` **@392362-392374**:
    - `if (t.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts")` **@392363** — cannot be used by subagents.
    - `Ode(Br(t).mode, "plan")` **@392365** (`Ode` setMode helper @3489) records prior mode.
    - `t.setToolPermissionContext((n)=> Yh(aut(n), { type:"setMode", mode:"plan", destination:"session" }))` **@392366** — **plan-mode coupling**: pushes a `setMode → plan` permission-context update (session scope).
    - returns `{ data: { message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach." } }` **@392369-392370**.
  - `mapToolResultToToolResultBlockParam` **@392375-392391** appends a 6-step reminder; verbatim includes `4. Use ${Ff} if you need to clarify the approach` (Ff = AskUserQuestion name) and `6. When ready, use ${yx} to present your plan for approval` (yx = ExitPlanMode name) **@392384,392386**, ending `Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.` **@392388**.

Render helpers: `renderToolUseMessage: UUa` (@392281 → null), `renderToolResultMessage: jUa` (@392284, "Entered plan mode"), `renderToolUseRejectedMessage: GUa` (@392301, "User declined to enter plan mode").

---

## 2. ExitPlanMode

Asset: `assets/tools/ExitPlanMode.md`. Schema fn `ZUa`, tool object `Ij`.

- name consts `yx = "ExitPlanMode"`, `WM = "ExitPlanMode"` — **@152252-152253** (two aliases; `yx` used inside EnterPlanMode reminder, `WM` is the tool's `name`).
- prompt text const `VUa` — **@392403-392426** (verbatim matches asset; starts `Use this tool when you are in plan mode and have finished writing your plan to the plan file...`).
- inputSchema `ZUa` — **@392576-392584**: `H.strictObject({ allowedPrompts: H.array(eCp()).optional().describe("Prompt-based permissions needed to implement the plan. These describe categories of actions rather than specific commands.") }).passthrough()`. Element schema `eCp` **@392570-392574**: `{ tool: H.enum(["Bash"]).describe("The tool this prompt applies to"), prompt: H.string().describe('Semantic description of the action, e.g. "run tests", "install dependencies"') }`.
- normalized input `jcy` **@392585-392589**: `ZUa().extend({ plan: H.string().optional().describe("The plan content (injected by normalizeToolInput from disk)"), planFilePath: H.string().optional().describe("The plan file path (injected by normalizeToolInput)") })`.
- outputSchema `tCp` **@392591-392606**: `{ plan: string|null, isAgent: boolean, filePath?: string, hasTaskTool?: boolean, planWasEdited?: boolean, awaitingLeaderApproval?: boolean ("When true, the teammate has sent a plan approval request to the team leader"), requestId?: string ("Unique identifier for the plan approval request") }`.
- tool object `Ij = pi({...})` **@392608-392807**.
  - `searchHint: "present plan for approval and start coding (plan mode only)"` **@392610**.
  - `description()` → `"Prompts the user to exit plan mode and start coding"` **@392613**.
  - `prompt()` → `VUa` **@392616**.
  - `shouldDefer: !0` **@392627**.
  - `isEnabled()` **@392628-392631**: same `qb().length>0 && xr()` gate as EnterPlanMode.
  - `isReadOnly() → !1` **@392635** (NOT read-only).
  - `requiresUserInteraction()` **@392638-392641**: `if (em()) return !1; return !0;` (auto-approve under agent/team context).
  - `validateInput(e,t)` **@392642-392659**: if `em()` → `{result:!0}`. Else read `r = Br(t).mode`; **if `r !== "plan"`** fire telemetry `G("tengu_exit_plan_mode_called_outside_plan", { model, mode:Ne(r), hasExitedPlanModeInSession: ryt() })` **@392648** and return error verbatim **@392655**: `` `You are not in plan mode. To enter plan mode, call the ${A7} tool first. If your plan was already approved, continue with implementation.` `` with `errorCode: 1`.
  - `checkPermissions(e,t)` **@392661-392664**: if `em()` → `{behavior:"allow", updatedInput:e}`. Else `{behavior:"ask", message:"Exit plan mode?", updatedInput:e}`.
  - `call(e,t,n,r,o)` **@392668-392755** — **plan-mode coupling, the heart of plan exit**:
    - Persists `plan` to disk path `l = xP(t.agentId)` (`ci().write(l, c)`) if provided **@392679-392685**.
    - **Team-lead approval branch** (`if (em() && gwt())`) **@392686-392707**: throws `nco`/`PlanPreconditionError` (class @392396) with `` `No plan file found at ${l}. Please write your plan to this file before calling ExitPlanMode.` `` **@392688-392690** if no plan; otherwise builds a `plan_approval_request` message `{ type:"plan_approval_request", from, timestamp, planFilePath, planContent, requestId }` **@392694-392701**, sends to `"team-lead"` via `$A(...)` **@392702**, and returns `{ data: { plan, isAgent:!0, filePath, awaitingLeaderApproval:!0, requestId } }` **@392706**.
    - **auto-mode fallback** block **@392708-392730**: if `prePlanMode === "auto"` but auto-mode gate is off, emits notification `key:"auto-mode-gate-plan-exit-fallback"` with text `` `plan exit → default · ${d}` `` **@392725**.
    - **mode restore** **@392731-392750**: `if (p.mode === "plan")` → `k6(!0); kre(!0)`; computes target `m = p.prePlanMode ?? "default"`; `EAe({ from:"plan", to:m, trigger:"exit_plan_mode" })` **@392741**; `t.setToolPermissionContext((h)=>{ ... return { ...y, mode:m, prePlanMode:void 0 } })` **@392744-392749** — strips/restores dangerous permissions for auto-mode.
    - returns `{ data: { plan:u, isAgent:a, filePath:l, hasTaskTool: f||void 0, planWasEdited: c!==void 0||void 0 } }` **@392752-392753**.
  - `mapToolResultToToolResultBlockParam` **@392756-392806**: four content branches —
    - awaitingLeaderApproval: `"Your plan has been submitted to the team lead for approval. ... Request ID: ${i}"` **@392763-392775**.
    - isAgent: `'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"'` **@392781**.
    - empty plan: `"User has approved exiting plan mode. You can now proceed."` **@392787**.
    - default: `` `User has approved your plan. You can now start coding...` `` **@392797-392803** (suffix `l` suggests spawning teammates with `${vs}` SendMessage tool when `hasTaskTool`).

Render helpers: `renderToolUseMessage: zUa` (@392427 → null), `renderToolResultMessage: KUa` (@392430; "Entered plan mode"/"Plan submitted for team lead approval"/"User approved Claude's plan"), `renderToolUseRejectedMessage: YUa` (@392488).

Note: `awaitingLeaderApproval` / `plan_approval_request` are NOT new (4 hits each in 2.1.156).

---

## 3. EnterWorktree

Asset: `assets/tools/EnterWorktree.md`. Schema fn `LMp`, tool object `G8a`.

- name const `WAe = "EnterWorktree"` — **@221266**.
- inputSchema `LMp` — **@429879-429899**:
  - `name: H.string().superRefine((e,t)=>{ try{ adt(e) }catch(n){ t.addIssue({code:"custom", message:Se(n)}) } }).optional().describe('Optional name for a new worktree. Each "/"-separated segment may contain only letters, digits, dots, underscores, and dashes; max 64 chars total. A random name is generated if not provided. Mutually exclusive with \`path\`.')` **@429881-429892**.
  - `path: H.string().optional().describe("Path to an existing worktree of the current repository to switch into instead of creating a new one. Must appear in \`git worktree list\` for the current repo. Mutually exclusive with \`name\`.")` **@429893-429897**.
  - `.refine((e)=> !(e.name && e.path), { message: "Provide at most one of \`name\` or \`path\`, not both." })` **@429898**.
- outputSchema `DMp` **@429900-429902**: `{ worktreePath: string, worktreeBranch?: string, message: string }`.
- tool object `G8a = pi({...})` **@429903-430018**.
  - `searchHint: "create an isolated git worktree and switch into it"` **@429905**.
  - `description()` → `"Creates an isolated worktree (via git or configured hooks) and switches the session into it"` **@429908**.
  - `prompt()` → `N8a()` (the long "Use this tool ONLY when explicitly instructed to work in a worktree..." text; matches asset).
  - `userFacingName(e)` **@429919-429921**: `e?.path ? "Entering worktree" : "Creating worktree"`.
  - `shouldDefer: !0` **@429922**.
  - **No isEnabled / no isReadOnly / no checkPermissions** (relies on validateInput + deferral).
  - `validateInput(e)` **@429926-429948**:
    - `if (B$e())` (pinned-cwd subagent): if no `path` → error verbatim **@429934-429937**: `` `EnterWorktree cannot create a worktree from a subagent with a cwd override (isolation: "worktree" or explicit cwd) — it would mutate the parent session's process-wide working directory. ` `` + branch about calling with `path` / spawning Agent with `cwd`. `errorCode: 1`.
    - `if (aA() && !e.path)` (already in worktree, creating new) → error `"Already in a worktree session. Pass \`path\` to switch into another existing worktree, or use ExitWorktree to leave this one before creating a new worktree."` `errorCode: 2` **@429941-429947**.
  - `call(e,t)` **@429952-430014**:
    - pinned-cwd branch (`B$e()`): requires `path` (else throws `YT(...)` **@429954**), enters existing worktree via `X3n(e.path, {requireManagedLocation:!0, requireCwdInsideRepo:!0})` **@429955**, updates agent metadata cwd, fires `G("tengu_worktree_entered_existing", { mid_session:!0, cwd_override:!0 })` **@429963**, returns `contextLayers:[{kind:"working_directory", directory: s.worktreePath}]` **@429971**.
    - normal branch: if `e.path` → `Fpo(xt(), e.path)` **@429976**; else create via `b3t(xt(), e.name ?? aLe(), void 0, {fromCwd:s})` **@429983** (`aLe()` random name). Then `process.chdir(n.worktreePath); Iy(...)`, clears caches `kD/iLe/Yk/Ib.cache.clear`, fires `tengu_worktree_entered_existing` or `tengu_worktree_created` **@429994-430004**.
    - returns `{ data: { worktreePath, worktreeBranch, message: "${Created|Entered} worktree at ... Use ExitWorktree to leave mid-session, or exit the session to be prompted." } }` **@430007-430012**.

Render helpers: `renderToolUseMessage: B8a`, `renderToolResultMessage: F8a`. Property `toAutoClassifierInput(e) → e.path ?? e.name ?? ""` **@429923-429925**.

---

## 4. ExitWorktree

Asset: `assets/tools/ExitWorktree.md`. Schema fn `PMp`, tool object `Z8a`.

- name const `ZTn = "ExitWorktree"` — **@221547**.
- prompt text fn `q8a` **@430020-430051** (verbatim matches asset; `Exit a worktree session created by EnterWorktree and return the session to the original working directory.` + Scope/When/Parameters/Behavior sections).
- inputSchema `PMp` **@430167-430177**:
  - `action: H.enum(["keep","remove"]).describe('"keep" leaves the worktree and branch on disk; "remove" deletes both.')` **@430169-430171**.
  - `discard_changes: H.boolean().optional().describe('Required true when action is "remove" and the worktree has uncommitted files or unmerged commits. The tool will refuse and list them otherwise.')` **@430172-430176**.
- outputSchema `MMp` **@430179-430189**: `{ action: enum["keep","remove"], originalCwd: string, worktreePath: string, worktreeBranch?: string, tmuxSessionName?: string, discardedFiles?: number, discardedCommits?: number, message: string }`.
- tool object `Z8a = pi({...})` **@430191-430320**.
  - `searchHint: "exit a worktree session and return to the original directory"` **@430193**.
  - `description()` → `"Exits a worktree session created by EnterWorktree and restores the original working directory"` **@430196**.
  - `userFacingName(e)` **@430207-430209**: `e?.action === "remove" ? "Cleaning up worktree" : "Exiting worktree"`.
  - `shouldDefer: !0` **@430210**; `isDestructive(e) → e.action === "remove"` **@430211-430213**.
  - `validateInput(e)` **@430217-430259** — four error branches:
    - `if (B$e())` pinned-cwd subagent → `'ExitWorktree cannot be called from a subagent with a cwd override ... use Bash with \`cd\` for directory changes within it.'` `errorCode: 5` **@430218-430224**.
    - `if (!aA())` no active session → **no-op** message `"No-op: there is no active EnterWorktree session to exit. ... No filesystem changes were made."` `errorCode: 1` **@430226-430232**.
    - `if (e.action === "remove" && t.enteredExisting)` → refuses to remove an entered-existing worktree; `errorCode: 4` **@430233-430238**.
    - `if (e.action === "remove" && !e.discard_changes)` → checks `Y8a(t.worktreePath, t.originalHeadCommit)` (@430088, `git status --porcelain` + `rev-list --count`); if null → `errorCode: 3` **@430242-430246**; if `r>0||o>0` → lists `${r} uncommitted files` / `${o} commits` and refuses, `errorCode: 2` **@430252-430256**.
  - `call(e)` **@430263-430316**:
    - `t = aA()`; if !t throw `"Not in a worktree session"` **@430265**.
    - `action === "keep"` branch **@430269-430283**: `cWe()`, `X8a(n, a, r)` restores cwd, fires `G("tengu_worktree_kept", {mid_session:!0, commits:c, changed_files:l})` **@430272**, returns message with tmux reattach hint.
    - `action === "remove"` branch **@430285-430315**: kills tmux `ldt(s)`, `cdt()` removes worktree, `X8a(...)` restores cwd, fires `G("tengu_worktree_removed", {source:Qe("exit_tool"), mid_session:!0, commits:c, changed_files:l})` **@430300**, returns discard summary.
    - cwd restore helper `X8a` **@430102-430137** clears CWD-dependent caches (`kde/ETe/iLe/Yk/Ib.cache.clear`) and handles missing-original-dir fallback (message via `Upo` @430138).

Render helpers: `renderToolUseMessage: V8a` (@430052 → ""), `renderToolResultMessage: z8a` (@430055, "Kept worktree"/"Removed worktree").

Note: worktree tools + `worktree.baseRef` exist in 2.1.156 (carryover); the per-tool wording is refreshed but the family is not new.

---

## 5. AskUserQuestion  ★ (reservation prompt gating)

Asset: `assets/tools/AskUserQuestion.md`. Schema fn `$wp`, tool object `sut`. Module init `G2t` @392316 region is actually @391332.

- name const `Ff = "AskUserQuestion"`, header-max const `u1i = 12` — **@221315-221316**.
- description const `d1i` — **@221317-221318**: `"Asks the user multiple choice questions to gather information, clarify ambiguity, understand preferences, make decisions or offer them choices."`

### 5a. Reservation prompt paragraph (scaffold FUK) — gated by Dg (X3) + tengu_cinder_plover

- **Fallback reservation text const `f1i`** — **@221321-221323** (verbatim):
  ```
  
  Reserve this for decisions where the user's answer changes what you do next — not for choices with a conventional default or facts you can verify in the codebase yourself. In those cases pick the obvious option, mention it in your response, and proceed.
  
  ```
- **Base prompt const `f5r`** — **@221346-221354** (verbatim head): `Use this tool only when you are blocked on a decision that is genuinely the user's to make: one you cannot resolve from the request, the code, or sensible defaults.` ... includes `Plan mode note: To switch into plan mode, use ${A7} (not this tool)...` and `Do NOT use this tool to ask "Is my plan ready?", "Should I proceed?", ... — the user cannot see the plan until you call ${yx} for approval.` **@221353**.
- **Preview-format suffix map `p1i`** — **@221325-221345**: keys `markdown` (@221326) and `html` (@221336), each a "Preview feature:" paragraph describing the optional `preview` field.
- **`prompt({model:e})`** in the tool object — **@391457-391470** — the EXACT gating logic:
  ```js
  let t = "";
  if (Dg(e)) {                                   // lean / simple-system-prompt model
    let r = ct("tengu_cinder_plover", "").trim(); // Statsig override @391460
    t = r ? `\n${r}\n` : f1i;                      // override else fallback f1i @391461-391465
  }
  let n = FKt();                                  // questionPreviewFormat
  if (n === void 0) return f5r + t;               // @391468
  return f5r + t + p1i[n];                         // append markdown|html preview block @391469
  ```
  So the **reservation paragraph (`f1i` or its `tengu_cinder_plover` Statsig override) is appended only when `Dg(e)` is true** (the lean predicate X3), and the preview-format block is appended based on `FKt()` (`Ot.questionPreviewFormat`). `tengu_cinder_plover` gate exists in 2.1.156 too (1 hit) — carryover, but it is the live override for the reservation text. Confidence: high.

### 5b. Input/output schema

- question schema `bUa` **@391361-391382**: `{ question: string (...end with a question mark...), header: string ("Very short label displayed as a chip/tag (max ${u1i} chars)..."), options: H.array(Pwp()).min(2).max(4).describe(F1r() ? <long "2-4 options... no 'Other' option" text> : <short text>), multiSelect: H.boolean().default(!1) }`. The `options` `.describe` is **switched by `F1r()`** (schemaDescFixes gate) **@391373-391375**.
- option schema `Pwp` **@391346-391359**: `{ label: string ("...concise (1-5 words)..."), description: string, preview?: string ("Optional preview content rendered when this option is focused...") }`.
- reservation/answer field bundle `Rwp` **@391412-391423** (spread into the input as `...Rwp()`): `{ answers: H.record(H.string(), Mwp()).optional()..., annotations: SUa(), metadata: H.object({ source: H.string().optional().describe('Optional identifier for the source of this question (e.g., "remember" for /remember command)...') }).optional() }`. `Mwp` **@391409** coerces string arrays to comma-joined string. `SUa` annotations schema **@391384-391396**.
- inputSchema `$wp` **@391425-391436**: `H.strictObject({ questions: H.array(bUa()).min(1).max(4).describe(F1r() ? "Questions to ask the user (1-4 questions). The 1-4 questions and 2-4 options bounds are hard schema constraints; do not exceed them even if the user requests more — split into multiple calls instead." : "Questions to ask the user (1-4 questions)"), ...Rwp() }).refine(yUa.check, {message: yUa.message})`. The `questions` `.describe` is also **`F1r()`-gated** **@391430-391433**.
- refinement `yUa` **@391397-391408**: enforces unique question texts and unique option labels per question; message `"Question texts must be unique, option labels must be unique within each question"`.
- outputSchema `Owp` **@391438-391448**.
- `Wlo = "(notes only)"` sentinel — **@221... actually @391330**.

### 5c. Tool object `sut = pi({...})` **@391450-391582**
- `searchHint: "prompt the user with a multiple-choice question"` **@391452**.
- `description()` → `d1i` **@391455**.
- `isEnabled()` **@391480-391483**: `qb().length>0 && xr()` → disabled.
- `isReadOnly() → !0` **@391487**.
- `toAutoClassifierInput(e)` → questions joined by `" | "` **@391490-391492**.
- `requiresUserInteraction() → !0` **@391493-391495**.
- `validateInput({questions:e})` **@391496-391504**: only runs when `FKt() === "html"`; for each option validates `Fwp(n.preview)` (HTML-fragment validator @391310-391318) and returns `{result:!1, message:'Option "${label}" in question "${question}": ${r}', errorCode:1}` on failure. (`Fwp` rejects full documents `<html>/<body>/<!doctype>` @391312-391313, `<script>/<style>` @391314-391315, and non-HTML content @391316-391317.)
- `checkPermissions(e)` **@391505-391511**: `{behavior:"ask", message:"Answer questions?", updatedInput:{questions:e.questions, ...(e.metadata && {metadata:e.metadata})}}`.
- `call(e,t)` **@391555-391559**: pure echo — returns `{ data: { questions, answers, ...(response?.trim() && {response}), ...(annotations && {annotations}) } }`.
- `mapToolResultToToolResultBlockParam` **@391560-391581**: formats `"question"="answer"` pairs (uses `Wlo` sentinel for "no option selected" @391565), `selected preview:`, `notes:`; if freeform `response` → `The user responded: ${n}`.

Render helpers: `renderToolUseMessage`/`renderToolUseProgressMessage`/`renderToolUseErrorMessage` → null; `renderToolResultMessage` → `Nwp`; `renderToolUseRejectedMessage` **@391521-391551** ("User declined to answer questions").

---

## 6. WebFetch

Asset: `assets/tools/WebFetch.md`. Schema fn `Ykp`, tool object `gF`.

- name const `nE = "WebFetch"` — **@210992**.
- inputSchema `Ykp` **@409266-409271**: `H.strictObject({ url: H.string().url().describe("The URL to fetch content from"), prompt: H.string().describe("The prompt to run on the fetched content") })`.
- outputSchema `Xkp` **@409272-409282**: `{ bytes, code, codeText, result, durationMs, url, artifactRead?:{slug,ver} }`.
- tool object `gF = pi({...})` **@409283-409518**.
  - `ruleContentField: "url"` **@409285**; `searchHint: "fetch and extract content from a URL"` **@409286**; `shouldDefer: !0` **@409288**.
  - `description(e)` **@409289-409296**: `` `Claude wants to fetch content from ${new URL(t).hostname}` `` else `"Claude wants to fetch content from this URL"`.
  - `userFacingName() → "Fetch"` **@409298**.
  - `isEnabled() → di("allow_web_fetch")` **@409311-409313** (feature flag).
  - `isReadOnly() → !0` **@409317**; `isConcurrencySafe() → !0` **@409314**.
  - `checkPermissions(e,t)` **@409323-409349**: rule-based via `jY(n, gF, "deny"|"ask"|"allow")` + `m2n(...)` matching on `lGa(e)` (host rule). deny → `` `${gF.name} denied access to ${r}.` `` **@409330**; ask (no rule) → `` `Claude requested permissions to use ${gF.name}, but you haven't granted it yet.` `` with `suggestions: Guo(r)` **@409347-409348**; preapproved host (`tjn(e.url)` @408554) → allow with `reason:"Preapproved host"` **@409343-409344**.
  - `validateInput(e)` **@409354-409366**: parses `new URL(t)`; on failure → `{result:!1, message:'Error: Invalid URL "${t}". The URL provided could not be parsed.', meta:{reason:"invalid_url"}, errorCode:1}`.
  - **`prompt({model:e, tools:t})`** **@409368-409378**: detects whether the Artifact tool is enabled (`n = !!vl(t,r) && o()`), then returns `m$i(e, n)`.
    - `m$i(e, t=!1)` **@210993-211007** — **two branches keyed by `Dg(e)` (lean predicate)**:
      - lean branch (Dg true) **@210995-210999**: `` `Fetches a URL, converts the page to markdown, and answers \`prompt\` against it using a small fast model.` `` + bullet list; the artifact exception sentence is inserted only when `t` true: `" Exception: claude.ai/code/artifact/{uuid} URLs ARE fetchable via your claude.ai login — use WebFetch, not curl (curl gets the SPA shell or a Cloudflare 403)."`
      - verbose branch **@211000-211006**: `IMPORTANT: WebFetch WILL FAIL for authenticated or private URLs...` + (artifact exception block if `t`) + the long `DSd` usage-notes const.
    - `DSd` usage-notes const **@211028-211046** (the "- Fetches content from a specified URL..." block; verbatim ends `- For GitHub URLs, prefer using the gh CLI via Bash instead (e.g., gh pr view, gh issue view, gh api).`).
  - `call(e,t,n,r)` **@409379-409514**:
    - upgrades `http:`→`https:` **@409389-409391**.
    - **Artifact path** (`Jkp(b,t)` @409393): reads claude.ai artifact via `readArtifactContent`; owner-role artifacts return raw/saved HTML, else summarized via `rjn(...)`.
    - `njn(o,i)` performs the fetch; handles `provenance_denied` (prompts via `y2a`, telemetry `tengu_web_fetch_provenance_prompt` @409464), `http_error` (telemetry `tengu_web_fetch_http_error` @409469), and **`redirect`** **@409482-409503** returning the verbatim block `REDIRECT DETECTED: The URL redirects to a different host. ... Please use WebFetch again with these parameters: - url: "${redirectUrl}" - prompt: "${prompt}"`.
    - markdown shortcut: preapproved host + `text/markdown` + small → returns raw; else `rjn(...)` summarizes with the AI model **@409504-409508**.
  - content-summarization prompt `A$i` **@211008-211027** (the "Web page content: ... 125-character maximum for quotes..." prompt).

Render: `renderToolUseMessage: _2a`, `renderToolUseProgressMessage: b2a`, `renderToolResultMessage: S2a`. Summary helper `getToolUseSummary: lco` (@393584).

---

## 7. WebSearch

Asset: `assets/tools/WebSearch.md`. Schema fn `dMp`, tool object `V3n`.

- name const `rG = "WebSearch"` — **@221393**.
- inputSchema `dMp` **@428532-428537**: `H.strictObject({ query: H.string().min(2).describe("The search query to use"), allowed_domains: H.array(H.string()).optional().describe("Only include search results from these domains"), blocked_domains: H.array(H.string()).optional().describe("Never include search results from these domains") })`.
- outputSchema `fMp` **@428549-428555**: `{ query, results: array(union(hit-block, string)), durationSeconds, searchCount? }`.
- tool object `V3n = pi({...})` **@428557-...**.
  - `searchHint: "search the web for current information"` **@428559**; `shouldDefer: !0` **@428561**.
  - `description(e)` → `` `Claude wants to search the web for: ${e.query}` `` **@428562-428564**.
  - `userFacingName() → "Web Search"` **@428566**.
  - `isEnabled()` **@428573-428588**: by API provider `Ir()` — firstParty/anthropicAws → true; gateway → false; vertex → only if model is `claude-fable-5`/`opus-4`/`sonnet-4`/`haiku-4`; foundry → true; else false.
  - `isReadOnly() → !0` **@428598**.
  - `checkPermissions(e)` **@428604-428610**: `{behavior:"passthrough", message:"WebSearchTool requires permission.", suggestions:[{type:"addRules", rules:[{toolName: rG}], behavior:"allow", destination:"localSettings"}]}`.
  - **`prompt({model:e})` → `m1i(e)`** **@428611-428613**.
    - `m1i(e)` **@221357-221391** — **two branches keyed by `Dg(e)` (lean predicate)**, with `t = kOi()` (current month):
      - lean branch **@221360-221364**: `` `Search the web. Returns result blocks with titles and URLs. US-only.` `` + 3 bullets incl. `- The current month is ${t} — use this when searching for recent information.` and `- After answering from results, end with a "Sources:" list of the URLs you used as markdown links.`
      - verbose branch **@221365-221390**: the long `- Allows Claude to search the web...` + `CRITICAL REQUIREMENT - You MUST follow this:` + `Sources:` mandate + `IMPORTANT - Use the correct year in search queries:`.
  - `validateInput(e)` **@428620-428629**: empty query → `{result:!1, message:"Error: Missing query", errorCode:1}`; both allowed+blocked domains → `{result:!1, message:"Error: Cannot specify both allowed_domains and blocked_domains in the same request", errorCode:2}`.
  - `call(e,t,n,r,o)` **@428631-...**: CCR-proxy path `Z9a()` (@428634) uses `e8a(...)`; otherwise issues a nested model query with `toolChoice:{type:"tool", name:"web_search"}` and `extraToolSchemas:[mMp(e)]` (@428662-428684; `mMp` @428475 builds the `web_search` server-tool schema with allowed/blocked domains), streams `server_tool_use` + `web_search_tool_result` blocks. Model selected via `ct("tengu_plum_vx3", !1) ? Tw() : t.options.mainLoopModel` **@428659**. Foundry guard `Zoe(u, "web_search")` @428660.
  - `extractSearchText() → ""` **@428617-428619**.

Render: `renderToolUseMessage: n8a`, `renderToolUseProgressMessage: r8a`, `renderToolResultMessage: o8a`. Summary `getToolUseSummary: Dpo`.

---

## 8. ListMcpResourcesTool

Asset: `assets/tools/ListMcpResourcesTool.md`. Schema fn `qxd`, tool object `_G`.

- name const `Hae = "ListMcpResourcesTool"` — **@235977**.
- description const `kji` **@235978-235985** (the "Lists available resources from configured MCP servers..." text).
- prompt const `Lji` **@235986-235994** (the "List available resources from configured MCP servers... Parameters: - server (optional)..." text).
- inputSchema `qxd` **@236150-236152**: `H.object({ server: H.string().optional().describe("Optional server name to filter resources by") })`.
- outputSchema `Vxd` **@236153-236163**: array of `{ uri, name, mimeType?, description?, server }`.
- tool object `_G = pi({...})` **@236164-236237**.
  - `isReadOnly() → !0`, `isConcurrencySafe() → !0`, `shouldDefer: !0` **@236165-236174**.
  - `name: Hae`, `aliases: ["ListMcpResources"]` **@236175-236176**.
  - `searchHint: "list resources from connected MCP servers"` **@236177**.
  - `userFacingName: () => "listMcpResources"` **@236223**.
  - `description()` → `kji`; `prompt()` → `Lji` **@236179-236184**.
  - **No checkPermissions** (read-only).
  - `call(e, {options:{mcpClients:t}})` **@236191-236221**: filters clients by `server` (exact name or normalized via `oc` @55423); if server given and none found throws `Bl("Server "${n}" not found. Available servers: ${...}", "MCP server not found")` **@236202-236204**; for each `connected` client calls `u2e(i)` then `X2(a)` to list resources, swallows per-client errors with `wu(...)`.
  - `mapToolResultToToolResultBlockParam` **@236228-236235**: empty → `"No resources found. MCP servers may still provide tools even if they have no resources."`.

Render: `renderToolUseMessage: jji`, `renderToolResultMessage: Gji`.

---

## 9. ReadMcpResourceTool

Asset: `assets/tools/ReadMcpResourceTool.md`. Schema fn `k2d`, tool object `kG`.

- name const `Jrt = "ReadMcpResourceTool"` — **@275509**.
- description const `QQi` **@275510-275517** (the "Reads a specific resource from an MCP server..." text).
- prompt const `ZQi` **@275521-275529** — note it mentions the **NEW directory-resource feature**: `When the URI names a directory resource on a server that supports directory listing, the result carries a "resources" array listing the directory's direct children. Subdirectories appear with mimeType "${zrt}"; read them again to descend.` (`zrt = "inode/directory"` @274900).
- inputSchema `k2d` **@275598-275603**: `H.object({ server: H.string().describe("The MCP server name"), uri: H.string().describe("The resource URI to read") })`.
- error-code set `L2d` **@275604**: `new Set([-32002, Oi.InvalidParams])`.
- outputSchema `D2d` **@275605-275628**: `{ contents: array({uri, mimeType?, text?, blobSavedTo?}), error?: string, resources?: array({uri,name,mimeType?}).describe('Direct children when the URI is a directory resource (SEP-2640 resources/directory/read)...') }` — **SEP-2640 directory listing**.
- tool object `kG = pi({...})` **@275629-...**.
  - `isReadOnly() → !0`, `isConcurrencySafe() → !0`, `shouldDefer: !0` **@275630-275639**.
  - `name: "ReadMcpResourceTool"`, `aliases: ["ReadMcpResource"]` **@275640-275641**.
  - `searchHint: "read a specific MCP resource by URI"` **@275642**; `userFacingName → "readMcpResource"` (`tZi` @275535).
  - `description()` → `QQi`; `prompt()` → `ZQi` **@275644-275649**.
  - `call(e, {options:{mcpClients:t}})` **@275656-...**: resolves client by name or normalized name (`oc`); throws `Bl(...)` `"Server "${n}" not found. Available servers: ..."` **@275661-275663**, `"Server "${s.name}" is not connected"` **@275665**, or `"Server "${s.name}" does not support resources"` **@275666-275667** (capabilities check). Plugin-source check `$9(...)` **@275668**. Directory listing handled by `P2d` @275557 producing the `resources` array.
  - **No checkPermissions** (read-only).

---

## 10. WaitForMcpServers

Asset: `assets/tools/WaitForMcpServers.md`. Schema fn `M9d`, tool object `sla`.

- name const `kCe = "WaitForMcpServers"` — **@221698**.
- description/prompt fn `E5r` **@221682-221697** (both `description()` and `prompt()` return it) — the "Wait for MCP servers that are still connecting and whose tools are not yet in your tool list..." text, ending `You do not need to ask the user for confirmation to use this tool.`
- timeout const `P9d = 5000` (5 s) — **@298069**.
- inputSchema `M9d` **@298081-298083**: `H.object({ servers: H.array(H.string()).optional().describe("Server names to wait for (default: all pending)") })`.
- outputSchema `R9d` **@298084-298093**: `{ ready: boolean, connected, failed, stillPending, needsAuth, disabled, unknown : string[] }`.
- tool object `sla = pi({...})` **@298095-298206**.
  - `isEnabled() → CXr(Gs())` **@298096-298098**. `CXr(e)` **@298065-298068**: `if (fR() && f7(e)) return !1; return ola().length > 0` (enabled only when there are pending MCP servers; `ola()` @298062 = pending server names via `iRe()`).
  - `isConcurrencySafe() → !1` **@298099-298101** (NOT concurrency-safe); `isReadOnly() → !0` **@298102**.
  - `name: kCe`, `maxResultSizeChars: 1e4` **@298105-298106**.
  - `checkPermissions(e)` **@298119-298121**: `{behavior:"allow", updatedInput:e}` (always allowed).
  - `call(e,t)` **@298122-298183**: polls `c()` (clients matching requested names/normalized) every 50 ms via `Un(50, signal)` until none `pending` or `P9d` (5 s) elapsed or aborted **@298134**; buckets results into connected/failed/pending/needsAuth/disabled/unknown **@298142-298163**; logs `[WaitForMcpServers] waited=...` **@298166** and fires `G("tengu_mcp_pending_call", {requestedCount, connectedCount, failedCount, pendingCount, needsAuthCount, disabledCount, unknownCount, waitMs, matched, matchType:Qe("wait"), success})` **@298168-298180**.
  - `mapToolResultToToolResultBlockParam(e,t)` **@298186-298205**: human-readable summary, e.g. `Connected (their tools are now available — call them directly): ...`, `Needs authentication (ask the user to run /mcp): ...`, `Disabled (ask the user to enable via /mcp): ...`, `Unknown (no MCP server with this name is configured): ...`; `is_error: !e.ready`.

Render: `renderToolUseMessage: rla`, `userFacingName: nla`.

---

## 11. mcp — generic MCP tool wrapper template  ★ (dynamic MCP tool wrapping)

Asset: `assets/tools/mcp.md`. Schema fn `E$d`, base tool object `mVr`.

### 11a. The base template `mVr`
- inputSchema `E$d` **@261830**: `we(() => H.object({}).passthrough())` (accepts any object).
- outputSchema `H$d` **@261831-261835**: `H.union([H.string(), H.array(H.object({type:H.string()}).passthrough()), H.undefined()]).describe("MCP tool execution result")`.
- base tool object `mVr = pi({...})` **@261836-261874**:
  - `isMcp: !0` **@261837**; `isOpenWorld() → !1` **@261838-261840**.
  - `name: "mcp"` **@261841**; `maxResultSizeChars: 1e5` **@261842**.
  - `description()` → `Yji` **@261843-261845**; `prompt()` → `Kji` **@261846-261848**. Both `Kji` and `Yji` are **empty strings** (`Kji = ""` @236359, `Yji = ""` @236360) — the base template has no description; real text comes from the per-server tool definition.
  - `call() → { data: "" }` **@261855-261857** (placeholder; overridden per dynamic tool).
  - `checkPermissions() → { behavior:"passthrough", message:"MCPTool requires permission." }` **@261858-261860**.
  - `isResultTruncated`, `mapToolResultToToolResultBlockParam` (calls `Nnt(e)` to strip `_meta` @236249) **@261865-261873**.

### 11b. Dynamic per-server MCP tool factory (how MCP tools are wrapped)
Located in the MCP-client tool-loading function around **@285100-285300+** (the `l = a.map((u)=>{ ... })` block). For each upstream tool `u` from connected server `e`:
- name = `V3(e.name, u.name)` **@285135** → `mcp__${oc(server)}__${oc(tool)}` (`V3` @55438, `q3` @55435, `oc` @55423). When `e.config.type === "sdk"` and `CLAUDE_AGENT_SDK_MCP_NO_PREFIX` set, uses bare `u.name` **@285100/285140**.
- spreads the base: `m = { ...mVr, name, mcpInfo:{serverName, scope, displayName, iconUrl, serverInfoName, toolName, title, execution, role, effectiveMaxPermission}, isMcp:!0, searchHint: u._meta?.["anthropic/searchHint"], alwaysLoad: e.config.alwaysLoad===!0 || u._meta?.["anthropic/alwaysLoad"]===!0, ... }` **@285138-285158**.
- `description()` → `u.description ?? ""` **@285159-285161**; `prompt()` → truncated `u.description` (`RD(g, oxe)+"… [truncated]"` if `> oxe`; `oxe = 2048` @284376) **@285162-285165**.
- `isConcurrencySafe()`/`isReadOnly()` → `u.annotations?.readOnlyHint ?? !1` **@285166-285171**; `isDestructive()` → `destructiveHint` **@285176-285178**; `isOpenWorld()` → `openWorldHint` **@285179-285181**.
- `maxResultSizeChars`: `f ? Math.min(p, K9r) : mVr.maxResultSizeChars` where `p = u._meta?.["anthropic/maxResultSizeChars"]`, `K9r = 500000` @233595 **@285136-285137,285182-285183**.
- `inputJSONSchema: u.inputSchema` **@285184** (raw JSON schema passed through; before this, `CGd(u.inputSchema)` @285115 filters out tools whose schema uses constructs the Anthropic API rejects, emitting `wu(... "Skipping tool ... its input schema uses ${d}, which the Anthropic API does not accept...")` @285119-285124 + telemetry `tengu_mcp_degraded` @285127).
- `checkPermissions()` **@285185-285198**: `{behavior:"passthrough", message:"MCPTool requires permission.", suggestions:[{type:"addRules", rules:[{toolName:d, ruleContent:void 0}], behavior:"allow", destination:"localSettings"}]}` (suggests `mcp__server__tool` allow rule).
- `call(g,h,y,_,b)` **@285199-...**: emits `mcp_progress` `started`/`completed`/`failed` progress events; calls `u2e(e)` (get client) then `k7r({client, clientConnection, tool:u.name, args:g, meta, signal, ...})` to invoke the MCP tool; retries once on `yot` (session recovery) **@285256-285260**; returns `{ data: L.content, ...(mcpMeta from _meta/structuredContent) }` **@285247-285255**.

MCP name helpers: `oc` (normalize, @55423), `kk` (parse `mcp__server__tool`, @55428), `q3` (prefix, @55435), `V3` (full name, @55438), `lOe` (tool→name, @55441), `_nn` (strip prefix, @55444). The `mcp__<server>__bash`/`mcp__<server>__web_fetch` special names: `THt`/`hns` @55562.

---

## NEW-in-2.1.183 deltas (0-count greps in 2.1.156 before-picture bundle)

- `schemaDescFixes` (the `F1r` AskUserQuestion/`bUa` description gate) — **NEW** (`grep -c schemaDescFixes` 2.1.156 = 0). Backed by `thistle_skein` flag in `juniper_shoal` config (`Dkt` @147759).
- SEP-2640 directory-resource listing in ReadMcpResourceTool (`resources` array + `inode/directory` mime descend) — wording new in 2.1.183 (`ZQi` @275521, `D2d.resources` @275616-275626).
- Carryover (NOT new): `tengu_cinder_plover` (1 hit in 2.1.156), worktree family + `worktree.baseRef`, `awaitingLeaderApproval` / `plan_approval_request` (4 hits each), `WaitForMcpServers`, `EnterWorktree`.

## Open questions
- `m$i`'s artifact-exception flag `t` depends on `vl(tools, ARTIFACT_TOOL_NAME) && isArtifactToolEnabled()` (@409371-409375) — the Artifact tool wiring is out of scope here but couples WebFetch's prompt.
- The exact body of `N8a()` (EnterWorktree long prompt) was confirmed present (matches asset) but not line-quoted in full here; it lives near the `W8a`/`U8a` module init just above @429879.
