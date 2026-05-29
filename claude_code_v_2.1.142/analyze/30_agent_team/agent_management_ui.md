# Agent-Management UI (`/agents`) — v2.1.142

## TL;DR

There are **two** distinct agent UIs in Claude Code, and they're easy to
confuse:

| Surface | Entry | Purpose | Doc |
|---------|-------|---------|-----|
| **FleetView** | `claude agents` CLI / `←←` | Browse & attach to *running* background-fleet jobs | [fleet_view_ui.md](./fleet_view_ui.md) |
| **`/agents` menu** | `/agents` slash command | Create / view / edit / delete agent **definitions** | **this doc** |

This document covers the second one: the interactive `/agents` menu that
manages the `.md` agent-definition files under `.claude/agents/` (project) and
`~/.claude/agents/` (user). It's a multi-screen Ink wizard with a state
machine (`AgentsMenu`/`E24`), an LLM-assisted "Generate with Claude" path
(`generateAgent`/`rW4`), a validation layer (`validateAgent`/`pW4`), and a
frontmatter-file writer (`formatAgentAsMarkdown`/`zk5`).

**The headline v2.1.142 change:** the `/agents` list view now **embeds the
live FleetView dashboard** as a collapsible *"Running (N)"* section above the
static *"Library"* section. The definition-management UI and the
running-jobs UI, historically separate, are now stitched into one screen — you
see what's *running* and what's *defined* in the same place.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI Components, Slash Commands
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Agent Team, Background Agents
> - [symbol_additions_v2_1_142_agent_team_arch.md](../00_overview/symbol_additions_v2_1_142_agent_team_arch.md) — v2.1.142 agent-team additions

Key symbols in this document (all `cli_inner_pretty.js`):
- `agentsCommandCall` (`AN5`) — the `/agents` `call()` that mounts the menu (491371-491375)
- `agentsCommand` (`zN5`/`S24`) — slash-command registration (491384-491390)
- `AgentsMenu` (`E24`) — top-level state machine (490587-491290)
- `AgentsList` (`bW4`) — the "Library" list, now with running-status props (488096-488473)
- `AgentDetail` (`vW4`) — read-only detail view (487161-487345)
- `AgentEditor` (`IW4`) — inline tools/model/color editor (487954-488070)
- `ModelSelector` (`rX8`) — model picker (487497-487548)
- `ToolSelector` (`oX8`) — bucketed tool picker (487592-487896)
- `ColorPicker` (`iX8`) — color picker with `@name` preview (487400-487481)
- `CreateAgentWizard` (`G24`) — the create flow root (490198-490241)
- `generateAgent` (`rW4`) — LLM-assisted config generation (489317-489365)
- `AGENT_CREATION_SYSTEM_PROMPT` (`iW4`) — the "elite AI agent architect" prompt (489398+)
- `AGENT_MEMORY_INSTRUCTIONS` (`Rk5`) — appended when auto-memory is on (489367-489387)
- `validateAgent` (`pW4`) — errors + warnings (488757-488782)
- `validateAgentType` (`yp6`) — identifier regex/length (488749-488756)
- `formatAgentAsMarkdown` (`zk5`) — frontmatter serializer (487008-487045)
- `saveAgentToFile` (`ZW4`) — create file with `wx` flag (487097-487108)
- `updateAgentFile` (`GW4`) — frontmatter-preserving partial merge (487109-487131)
- `deleteAgentFromFile` (`TW4`) — unlink, ignore ENOENT (487133-487140)
- The embedded FleetView component in the list view (`V24`, mounted at 490796)

---

## Entry point & the `AgentsMenu` state machine

`/agents` is a `local-jsx` slash command — it renders an Ink React tree
in-place rather than streaming text.

```javascript
// ============================================
// agentsCommand / agentsCommandCall - the /agents slash command + its mount
// Location: cli_inner_pretty.js:491384-491390 (registration), 491371-491375 (call)
// ============================================

// ORIGINAL (for source lookup):
zN5 = {
  type: "local-jsx",
  name: "agents",
  description: "Manage agent configurations",
  load: () => Promise.resolve().then(() => (I24(), h24)),
};
async function AN5(H, $) {
  let K = $.getAppState().toolPermissionContext,
    _ = xV(K);
  return Rp6.createElement(E24, { tools: _, onExit: H, toolUseContext: $ });
}

// READABLE (for understanding):
const agentsCommand = {
  type: "local-jsx",
  name: "agents",
  description: "Manage agent configurations",
  load: () => import("./agentsMenuModule"),     // lazy
};
async function agentsCommandCall(onExit, toolUseContext) {
  const permissionContext = toolUseContext.getAppState().toolPermissionContext;
  const tools = getTools(permissionContext);                  // xV
  return React.createElement(AgentsMenu, { tools, onExit, toolUseContext });
}

// Mapping: zN5/S24→agentsCommand, AN5→agentsCommandCall, E24→AgentsMenu, xV→getTools,
//          $→toolUseContext, H→onExit
```

Note the v2.1.142 detail: `toolUseContext` is now threaded as a prop (v2.1.88's
`agents.tsx` did not pass it). It is consumed by the ToolSelector (to know the
real tool pool) and by `claude-code-guide`-style dynamic prompts.

`AgentsMenu` (`E24`, 490587-491290) holds a single `modeState`
(`useState({ mode: "list-agents", source: "all" })`) and `switch`es on
`modeState.mode`:

```
                          list-agents  (default)
                         /     │      \
            (select agent)  (create)   (Esc → onExit)
                   │           │
              agent-menu   create-agent ───────────► CreateAgentWizard (G24)
            /  /  │   \  \
        run  view-  edit- delete-   view-running
        agent agent  agent confirm  ──► task-detail (running instance)
        (dispatch (vW4) (IW4) (Yes/No)
         to fleet)
```

The `switch (modeState.mode)` has **eight** cases (490728). Six manage
definitions; **two — `run-agent` and `task-detail` — bridge to the running
fleet**, which is the v2.1.142 integration this UI is built around:

| Mode | Symbol/region | Renders |
|------|---------------|---------|
| `list-agents` | 490753 | "Running (N)" (FleetView `V24`) + "Library" (`AgentsList` `bW4`) — see below |
| `agent-menu` | 490881 | Per-agent actions: **Run agent** / (**View running instance** if any live) / View / Edit / Delete / Back |
| `run-agent` | 491158 | Dispatch this definition as a background-fleet job (title `Run <type>`) — the in-menu bridge to the `claude agents` dispatch path |
| `task-detail` | 490729 | Detail panel for a running task (back → `list-agents`) |
| `view-agent` | 491016 | `AgentDetail` (`vW4`) in a dialog |
| `edit-agent` | 491235 | `AgentEditor` (`IW4`), title `Edit agent: <type>` |
| `delete-confirm` | 491077 | "Delete agent" confirm ("Yes, delete" / "No, cancel") |
| `create-agent` | 490867 | `CreateAgentWizard` (`G24`) |

The `agent-menu` option list (490902-490928) is built as
`[Run agent, …(View running instance if running>0), View agent, …(Edit/Delete if editable), Back]`.
The first two entries — **"Run agent"** (`value:"run"` → `run-agent` mode) and
**"View running instance"** (`value:"view-running"`, shown only when a live
instance of this type exists) — are the menu's hooks into the fleet. So from a
single definition row a user can: inspect it, edit it, **dispatch it as a job**,
or **jump to its already-running instance**. This is the same fusion the
list view performs with its "Running / Library" split, expressed at the
per-agent level.

The seven source buckets — `built-in`, `userSettings`, `projectSettings`,
`localSettings`, `policySettings`, `flagSettings`, `plugin` — are computed
once and concatenated for the `source: "all"` view (490757-490766). Built-in
and plugin agents are surfaced but **not editable** (the `agent-menu` omits
Edit/Delete when `source ∈ {built-in, plugin, flagSettings}`); the list shows
"Built-in agents are provided by default and cannot be modified."

### The v2.1.142 "Running + Library" embedding

This is the structural change worth dwelling on. The `list-agents` branch
(490753-490866) builds **two collapsible sections**:

```javascript
// READABLE sketch of cli_inner_pretty.js:490792-490822
const runningTitle = runningCount > 0 ? `Running (${runningCount})` : "Running";

// Section 1 — the live FleetView dashboard, embedded.
const runningSection = createElement(CollapsibleSection, { title: runningTitle, id: "running" },
  createElement(FleetViewEmbedded /* V24 */, { onExit: () => done(undefined, { display: "skip" }) }));

// Section 2 — the static definition library.
const librarySection = createElement(CollapsibleSection, { title: "Library", id: "definitions" },
  createElement(AgentsList /* bW4 */, {
    source: modeState.source,
    agents: sortedAgents,
    runningByType,        // ← NEW: map of agentType → live running count
    usedThisSession,      // ← NEW: which definitions were dispatched this session
    onSelect: (agent) => setMode({ mode: "agent-menu", agent, previousMode: modeState }),
    onCreateNew: () => setMode({ mode: "create-agent" }),
    changes,
  }));
```

**Why merge them?** Before v2.1.142, a user managing agent *definitions* (the
`/agents` menu) and a user checking *running fleet jobs* (`claude agents`)
were two disjoint flows. But the two are conceptually linked — you define an
agent so you can *run* it. Embedding FleetView's running view as a section,
and annotating each library row with `runningByType` (how many of this type
are live) and `usedThisSession`, turns `/agents` into a single "agents
control panel": define here, see them running right above, all without
leaving the dialog. `AgentsList`'s prop set grew accordingly (`runningByType`,
`usedThisSession` added; the old `onBack` removed — navigation is now via
header focus).

---

## The create flow: `CreateAgentWizard` (`G24`)

`create-agent` mounts a `WizardProvider`-wrapped step sequence
(`G24`, 490198-490241, title "Create new agent", `showStepCounter: false`).
The ordered steps:

```
Location → Method ──manual──────────────────────────► Type → Prompt → Description ┐
              │                                                                    │
              └──generate──► Generate (LLM) ──────────► (prefilled) ───────────────┤
                                                                                   ▼
                                            Tools → Model → Color → [Memory] → Confirm → save
```

| Step | Symbol | Key copy |
|------|--------|----------|
| LocationStep (`eW4`) | 489614 | "Choose location": Project (`.claude/agents/`) → `projectSettings`, Personal (`~/.claude/agents/`) → `userSettings` |
| MethodStep (`A24`) | 489789 | "Generate with Claude (recommended)" → `generate`, "Manual configuration" → `manual` |
| GenerateStep (`aW4`) | 489471 | "Please describe what the agent should do" (supports external editor) |
| TypeStep (`P24`) | 490097 | "Agent type (identifier)" — "e.g., test-runner, tech-lead" |
| PromptStep (`w24`) | 489913 | "System prompt" — "Be comprehensive for best results" |
| DescriptionStep (`lW4`) | 489197 | "When should Claude use this agent?" (ctrl+g → external editor) |
| ToolsStep (`J24`) | 490037 | "Select tools" |
| ModelStep (`f24`) | 489860 | "Select model" |
| ColorStep (`mW4`) | 488659 | "Choose background color" |
| MemoryStep (`q24`) | 489682 | "Configure agent memory": None / Project / User / Local scope |
| ConfirmStep (`FW4`) | 488788 | "Confirm and save"; shows "Errors:" / "Warnings:" |

The `description`/`whenToUse` and `systemPrompt` steps both support popping
the user's `$EDITOR` (the `chat:externalEditor` action) for multi-line input —
important because system prompts are often long.

### LLM-assisted generation (`generateAgent` / `rW4`)

The "Generate with Claude" path is the interesting one: the user types a
one-line description ("an agent that reviews React PRs for accessibility") and
the model emits a full `{ identifier, whenToUse, systemPrompt }` JSON.

```javascript
// ============================================
// generateAgent - turn a free-text description into an agent config via the model
// Location: cli_inner_pretty.js:489317-489365
// ============================================

// ORIGINAL (for source lookup):
async function rW4(H, $, q, K) {
  let _ = q.length > 0 ? `\n\nIMPORTANT: The following identifiers already exist and must NOT be used: ${q.join(", ")}` : "",
    A = `Create an agent configuration based on this request: "${H}".${_}\n  Return ONLY the JSON object, no other text.`,
    z = w8({ content: A }), Y = await qM(), f = EO8([z], Y),
    O = x9() ? iW4 + Rk5 : iW4,
    D = (await uEH({ messages: dZ(f), systemPrompt: r4([O]), thinkingConfig: { type: "disabled" },
                     tools: [], signal: K,
                     options: { getToolPermissionContext: async () => vZ(), model: $, toolChoice: void 0,
                                agents: [], isNonInteractiveSession: !1, hasAppendSystemPrompt: !1,
                                querySource: "agent_creation", mcpTools: [] } })).message.content
      .filter((J) => J.type === "text").map((J) => J.text).join("\n"),
    j;
  try { j = x$(D.trim()); }
  catch { let J = D.match(/\{[\s\S]*\}/); if (!J) throw Error("No JSON object found in response"); j = x$(J[0]); }
  if (!j.identifier || !j.whenToUse || !j.systemPrompt) throw Error("Invalid agent configuration generated");
  return (d("tengu_agent_definition_generated", { agent_identifier: j.identifier }),
          { identifier: j.identifier, whenToUse: j.whenToUse, systemPrompt: j.systemPrompt });
}

// READABLE (for understanding):
async function generateAgent(userRequest, model, existingIdentifiers, abortSignal) {
  const collisionWarning = existingIdentifiers.length > 0
    ? `\n\nIMPORTANT: The following identifiers already exist and must NOT be used: ${existingIdentifiers.join(", ")}`
    : "";
  const userPrompt = `Create an agent configuration based on this request: "${userRequest}".${collisionWarning}\n  Return ONLY the JSON object, no other text.`;

  const userMessage = makeUserMessage({ content: userPrompt });
  const userContext = await getUserContext();                 // CLAUDE.md hierarchy
  const messages = prependUserContext([userMessage], userContext);

  // System prompt = architect prompt, plus memory instructions when auto-memory is on.
  const systemPrompt = isAutoMemoryEnabled() ? AGENT_CREATION_SYSTEM_PROMPT + AGENT_MEMORY_INSTRUCTIONS
                                             : AGENT_CREATION_SYSTEM_PROMPT;

  const text = (await queryModelWithoutStreaming({
    messages: normalize(messages),
    systemPrompt: joinPrompt([systemPrompt]),
    thinkingConfig: { type: "disabled" },     // deterministic, no extended thinking
    tools: [],                                 // no tool use — pure generation
    signal: abortSignal,
    options: { getToolPermissionContext: async () => emptyPermissionContext(),
               model, agents: [], isNonInteractiveSession: false,
               hasAppendSystemPrompt: false, querySource: "agent_creation", mcpTools: [] },
  })).message.content.filter(b => b.type === "text").map(b => b.text).join("\n");

  // Parse JSON, with a brace-extraction fallback if the model wrapped it in prose.
  let config;
  try { config = jsonParse(text.trim()); }
  catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw Error("No JSON object found in response");
    config = jsonParse(match[0]);
  }
  if (!config.identifier || !config.whenToUse || !config.systemPrompt)
    throw Error("Invalid agent configuration generated");

  emitTelemetry("tengu_agent_definition_generated", { agent_identifier: config.identifier });
  return { identifier: config.identifier, whenToUse: config.whenToUse, systemPrompt: config.systemPrompt };
}

// Mapping: rW4→generateAgent, H→userRequest, $→model, q→existingIdentifiers, K→abortSignal,
//          x9→isAutoMemoryEnabled, iW4→AGENT_CREATION_SYSTEM_PROMPT, Rk5→AGENT_MEMORY_INSTRUCTIONS,
//          uEH→queryModelWithoutStreaming, qM→getUserContext, EO8→prependUserContext,
//          x$→jsonParse, w8→makeUserMessage, vZ→emptyPermissionContext, dZ→normalize, r4→joinPrompt
```

**Design points worth calling out:**

1. **`thinkingConfig: { type: "disabled" }` + `tools: []`.** Generation is a
   *pure* one-shot completion — no extended thinking, no tool calls. The model
   must return JSON directly. This keeps generation fast and cheap and makes
   the output parseable.
2. **Existing-identifier collision avoidance is in-prompt, not post-hoc.** The
   wizard passes the set of names already in use; the prompt forbids them.
   This is cheaper than generate-then-retry-on-collision and gives the model
   the chance to pick a semantically distinct name.
3. **Brace-extraction fallback.** If `JSON.parse` fails (model wrapped the
   object in prose despite "Return ONLY the JSON object"), it retries with the
   first `{…}` match. Defensive against chatty completions.
4. **Auto-memory awareness.** When auto-memory is enabled (`x9()`), the
   architect prompt gets `AGENT_MEMORY_INSTRUCTIONS` (`Rk5`) appended, telling
   the model to bake domain-specific "update your agent memory as you
   discover…" guidance into the generated `systemPrompt`. This is how a
   generated `code-reviewer` ends up with memory instructions tailored to code
   review.

The system prompt `iW4` ("You are an elite AI agent architect specializing in
crafting high-performance agent configurations…") is **verbatim identical** to
v2.1.88's `generateAgent.ts` prompt — it instructs the model to extract core
intent, design an expert persona, architect comprehensive instructions, create
a lowercase-hyphenated 2-4-word identifier, and embed `<example>` usage
scenarios in `whenToUse`.

---

## Validation (`validateAgentType` / `validateAgent`)

Before save, two validators run. The rules are nearly identical to v2.1.88 — the
one v2.1.142 addition is the `"Not available to subagents: …"` warning (driven by
`resolveAgentTools.unavailableTools`, which didn't exist in v2.1.88's resolver).

```javascript
// validateAgentType (yp6, cli_inner_pretty.js:488749-488756)
//   regex: /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/   (start/end alphanumeric, hyphens inside)
//   length: 3..50
//   messages: "Agent type must start and end with alphanumeric…",
//             "…at least 3 characters long", "…less than 50 characters"

// validateAgent (pW4, cli_inner_pretty.js:488757-488782) — splits into errors (K) and warnings (_):
//   ERROR  "Agent type is required"                               (if !agentType)
//   ERROR  <validateAgentType message>                            (yp6 result)
//   ERROR  `Agent type "<type>" already exists in <source>`       (same name, different source)
//   ERROR  "Description (description) is required"                (if !whenToUse)
//   ERROR  "Tools must be an array"                               (if tools defined && !Array)
//   ERROR  "Invalid tools: …"                                     (resolveAgentTools.invalidTools)
//   ERROR  "System prompt is required"                            (if !prompt)
//   ERROR  "System prompt is too short (minimum 20 characters)"   (if len < 20)
//   WARN   "Description should be more descriptive (at least 10 characters)"  (if 0 < len < 10)
//   WARN   "Description is very long (over 5000 characters)"       (if len > 5000)
//   WARN   "Agent has access to all tools"                        (if tools === undefined)  ← NOT ['*']
//   WARN   "No tools selected - agent will have very limited capabilities"   (if tools.length === 0)
//   WARN   "Not available to subagents: …"                        (resolveAgentTools.unavailableTools — NEW in v2.1.142)
//   WARN   "System prompt is very long (over 10,000 characters)"  (if len > 10000)
```

The `Invalid tools: …` check reuses `resolveAgentTools` (the same resolver the
runtime uses — see the *tool resolver* section of
[tool_inheritance.md](./tool_inheritance.md)), so the UI's notion of "valid
tool" can't drift from the runtime's. Errors block save; warnings are shown but
allow save (the ConfirmStep lists both).

---

## File writing — definitions are markdown with YAML frontmatter

```javascript
// ============================================
// formatAgentAsMarkdown - serialize a definition to a .md file with frontmatter
// Location: cli_inner_pretty.js:487008-487045
// ============================================

// ORIGINAL (for source lookup):
function zk5(H, $, q, K, _, A, z, Y) {
  let f = $.replaceAll("\\","\\\\").replaceAll('"','\\"').replaceAll("\n","\\\\n"),
    M = q === void 0 || (q.length === 1 && q[0] === "*") ? "" : `\ntools: ${q.join(", ")}`,
    w = A ? `\nmodel: ${A}` : "",
    D = Y !== void 0 ? `\neffort: ${Y}` : "",
    j = _ ? `\ncolor: ${_}` : "",
    J = z ? `\nmemory: ${z}` : "";
  return `---\nname: "${H}"\ndescription: "${f}"${M}${w}${D}${j}${J}\n---\n\n${K}\n`;
}

// READABLE (for understanding):
function formatAgentAsMarkdown(agentType, description, tools, systemPrompt, color, model, memory, effort) {
  const descEscaped = description.replaceAll("\\","\\\\").replaceAll('"','\\"').replaceAll("\n","\\n");
  // tools omitted entirely when undefined or the ['*'] wildcard.
  const toolsLine  = (tools === undefined || (tools.length === 1 && tools[0] === "*")) ? "" : `\ntools: ${tools.join(", ")}`;
  const modelLine  = model  ? `\nmodel: ${model}`   : "";
  const effortLine = effort !== undefined ? `\neffort: ${effort}` : "";
  const colorLine  = color  ? `\ncolor: ${color}`   : "";
  const memoryLine = memory ? `\nmemory: ${memory}` : "";
  return `---\nname: "${agentType}"\ndescription: "${descEscaped}"${toolsLine}${modelLine}${effortLine}${colorLine}${memoryLine}\n---\n\n${systemPrompt}\n`;
}

// Mapping: zk5→formatAgentAsMarkdown, H→agentType, $→description, q→tools, K→systemPrompt,
//          _→color, A→model, z→memory, Y→effort
```

Frontmatter field order: **`name`, `description`, `tools`, `model`, `effort`,
`color`, `memory`**, then the body is the raw system prompt. Two details:

- `name` is **quoted** in v2.1.142 (`name: "${agentType}"`); v2.1.88 emitted it
  unquoted. Minor, but it means hand-diffing 88-vs-142 generated files shows a
  spurious change on the `name` line.
- `tools` is **omitted** when the agent has the `['*']` wildcard or no explicit
  list — an all-tools agent simply has no `tools:` key, which `resolveAgentTools`
  treats as the wildcard. This keeps generated files clean.

Three file operations back the menu:

- **`saveAgentToFile` (`ZW4`, 487097-487108)** — `mkdir -p` the agents dir, write
  `<dir>/<type>.md`. New-agent saves use the `wx` open flag (**fail if exists**)
  and throw "Agent file already exists: …" on `EEXIST`, so the create wizard
  can't silently clobber.
- **`updateAgentFile` (`GW4`, 487109-487131)** — **v2.1.142 partial merge.** Reads
  the existing file, parses frontmatter (`parseMarkdownFrontmatter`/`tO`),
  mutates *only* `tools`/`color`/`model` (deleting a key when the field is
  cleared), re-serializes, and **preserves the body and any unknown
  frontmatter keys**. v2.1.88 rebuilt the whole file via
  `formatAgentAsMarkdown`, which required all fields. This pairs with
  `AgentEditor` (`IW4`) only ever editing tools/model/color inline — the
  description/system-prompt are edited via "Open in editor", not rewritten by
  the menu.
- **`deleteAgentFromFile` (`TW4`, 487133-487140)** — `unlink`, ignoring `ENOENT`
  (idempotent delete). Driven by the `delete-confirm` mode.

Path resolution honors `agent.baseDir` in v2.1.142 (`getActualAgentFilePath`/`nX8`,
487072-487079) — `if (agent.baseDir) return join(agent.baseDir, …)` — so agents
loaded from plugin/managed directories edit in place. v2.1.88 had no `baseDir`
branch.

---

## Sub-components

### ToolSelector (`oX8`, 487592-487896)

The largest sub-component. It categorizes the available tools into **five**
buckets — `readOnly` / `edit` / `execution` / `mcp` / `other` (note camelCase
`readOnly`; there is no `all` bucket — "select all" is a menu action, not a
category) — renders "Individual Tools:" and "MCP Servers:" sections, has a
"Show/Hide advanced options" toggle, and a footer that reads "All tools
selected" or "N of M tools selected". The tool pool comes from the `tools` prop the
`/agents` `call()` resolved from the live `toolPermissionContext` — so the
selector reflects the *actual* tools available in this session (including
connected MCP servers), not a hardcoded list.

### ModelSelector (`rX8`, 487497-487548)

`{ initialModel, onComplete, onCancel }`. Default "sonnet"; a custom model ID
already on the agent surfaces as "Current model (custom ID)". Help text:
"Model determines the agent's reasoning capabilities and speed." This is where
a user pins `haiku`/`sonnet`/`opus`/`inherit` or a raw model string — the same
values the *Model* section of [builtin_agents.md](./builtin_agents.md)
describes for built-ins (resolved at runtime by `getAgentModel`/`kwH`).

### ColorPicker (`iX8`, 487400-487481)

`{ agentName, currentColor, onConfirm }`. Options are "Automatic color" plus
the theme palette; it live-previews "Preview: @name" in the chosen color. The
color is what FleetView / the bg-task dialog / the spinner-tree use to tint
this agent's rows and labels.

### AgentDetail (`vW4`, 487161-487345) & AgentEditor (`IW4`, 487954-488070)

`AgentDetail` is read-only: it renders Description ("(tells Claude when to use
this agent)"), Tools, Model, Permission mode, Memory, Hooks, Skills, Color,
and the System prompt (as Markdown). `AgentEditor` is the editable counterpart
but **only** for tools/model/color inline (menu: "Edit tools" / "Edit model" /
"Edit color" / "Open in editor"); deeper edits go through `$EDITOR`. This
narrow inline-edit surface is exactly what the `updateAgentFile` partial-merge
supports.

---

## Cross-validation with v2.1.88

The `/agents` UI is one of the more *stable* subsystems — most of it is
byte-identical to v2.1.88. The deltas:

| Aspect | v2.1.88 | v2.1.142 |
|--------|---------|----------|
| **List view** | `AgentsList` + footer only | `AgentsList` ("Library") **+ embedded FleetView** ("Running (N)") |
| **Menu modes** | 6 (definition-only) | 8 — adds `run-agent` + `task-detail` (fleet bridge) |
| **`agent-menu` actions** | View / Edit / Delete / Back | adds **Run agent** + **View running instance** |
| **`AgentsList` props** | `{source, agents, onBack, onSelect, onCreateNew, changes}` | adds `runningByType`, `usedThisSession`; drops `onBack` |
| **`updateAgentFile`** | full rebuild from all fields | frontmatter-preserving partial merge (tools/color/model) |
| **`getActualAgentFilePath`** | no `baseDir` branch | honors `agent.baseDir` (plugin/managed dirs) |
| **Frontmatter `name`** | unquoted | quoted (`name: "<type>"`) |
| **`call()` props** | no `toolUseContext` | threads `toolUseContext` |
| **Validation** | (baseline) | adds **"Not available to subagents: …"** warning (the rest of the rules unchanged) |
| **Generation prompt (`iW4`) & memory instructions (`Rk5`)** | — | **verbatim identical** |
| **"No agents found" copy, wizard steps, ToolSelector buckets, ColorPicker/ModelSelector** | — | **unchanged** (the empty-list string is byte-identical in both: AgentsList.tsx:245) |

The throughline matches the rest of v2.1.142's agent work: the *mechanics*
(generation, validation, file format) are frozen and proven; the *change* is
integration — fusing the definition-management UI with the live running-fleet
view so "manage agents" and "watch agents run" are one screen.

---

## See also

- [fleet_view_ui.md](./fleet_view_ui.md) — the running-jobs dashboard now
  embedded as the "Running" section here, and reached standalone via
  `claude agents`.
- [builtin_agents.md](./builtin_agents.md) — the built-in agents shown
  (non-editable) in the "Built-in" source bucket; model/tool resolution shared
  with this UI's ModelSelector/ToolSelector/validator.
- [34_subagent/definition_schema.md](../34_subagent/definition_schema.md) — the
  full agent-frontmatter schema this UI reads and writes
  (`name`/`description`/`tools`/`model`/`effort`/`color`/`memory`/`hooks`/`skills`/…).
- [task_taxonomy.md](./task_taxonomy.md) — what the "Running" rows represent.
