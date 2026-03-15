# Skill Tool Pipeline Bridge (Claude Code 2.1.76)

> Analysis of how the Skill tool integrates with the 8-stage tool execution pipeline, and the two distinct execution paths for inline vs. forked skill execution.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `m66` (SkillTool) - The standard tool object for skill execution (`chunks.137.mjs:46`)
- `oH` - Skill tool name constant
- `G66` - Skill registry lookup function
- `$kY` - Safe prompt skill guard (auto-allow check)
- `Sb` - Permission rules checker

**Cross-references:**
- [10_skill_system/skill_tool.md](../10_skill_system/skill_tool.md) - Deep skill system analysis
- [09_slash_command/](../09_slash_command/) - Slash command → skill invocation
- [05_tools/tool_execution_pipeline.md](tool_execution_pipeline.md) - Main pipeline reference

---

## Architecture Overview

### Skill Tool in the Pipeline

The Skill tool (`m66`) is a **standard tool object** — it goes through the same 8-stage execution pipeline as Read, Bash, Edit, or any other tool. There is no special bypass or shortcut.

```
Assistant tool_use { name: "Skill", input: { skill: "commit", args: "..." } }
  │
  ▼
Wi6 (toolDispatcher) → looks up m66 (SkillTool) in registry
  │
  ▼
ZxY (toolExecutionOrchestrator) → wraps in async queue
  │
  ▼
fxY (toolExecutionPipeline):
  ├── Stage 1: Schema validation (skill name required, args optional)
  ├── Stage 2: validateInput → registry lookup (G66), error if not found
  ├── Stage 3: Pre-tool hooks (y4q/LF8)
  ├── Stage 4: checkPermissions → rule check + auto-allow for safe prompts
  ├── Stage 5: m66.call() → inline OR forked execution
  └── Stage 6: Post-tool hooks (k4q/RF8)
```

**What makes Skill special within the pipeline:**
- Stage 2 custom validation performs a live registry lookup
- Stage 4 permission check has auto-allow logic for stateless prompt skills
- Stage 5 `call()` has two completely different execution branches (inline vs forked)
- The result type (`{ newMessages, contextModifier }` vs `{ status: "forked" }`) is unique to Skill

---

## Stage 2: Registry Lookup in validateInput

**What it does:** Before any hooks or permissions are checked, the Skill tool verifies the requested skill exists in the loaded skill registry.

```javascript
// ============================================
// SkillTool validateInput - Registry lookup
// Location: chunks.137.mjs:65-96
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ skill: A }, q) {
    let K = A.trim();
    if (!K) return { result: !1, message: `Invalid skill format: ${A}`, errorCode: 1 };
    let Y = K.startsWith("/");
    let z = Y ? K.substring(1) : K;
    let _ = await I0(qY());
    let w = G66(z, _);
    if (!w) return { result: !1, message: `Skill "${z}" not found...`, errorCode: 1 };
    // ...
}

// READABLE (for understanding):
async validateInput({ skill: skillInput }, context) {
    let skillName = skillInput.trim();
    if (!skillName) return { result: false, message: `Invalid skill format: ${skillInput}`, errorCode: 1 };
    let hasSlashPrefix = skillName.startsWith("/");
    let normalizedName = hasSlashPrefix ? skillName.substring(1) : skillName;
    let allSkills = await loadAllSkills(getSkillPaths());
    let skill = findSkillByName(normalizedName, allSkills);
    if (!skill) return { result: false, message: `Skill "${normalizedName}" not found`, errorCode: 1 };
    // return success
}

// Mapping: A→skillInput, K→skillName, Y→hasSlashPrefix, z→normalizedName,
//          _→allSkills, w→skill, I0→loadAllSkills, qY→getSkillPaths, G66→findSkillByName
```

**Key insight:** Validation failure at Stage 2 returns a tool error immediately and does **not** trigger `PostToolUseFailure` hooks (only Stage 5 failures do that).

---

## Stage 4: checkPermissions

**What it does:** The Skill tool uses standard permission rules but adds special handling for "safe" prompt skills.

```javascript
// ============================================
// SkillTool checkPermissions - Rule check + auto-allow
// Location: chunks.137.mjs:98-175
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions({ skill: A, args: q }, K) {
    let Y = A.trim(), z = Y.startsWith("/") ? Y.substring(1) : Y;
    let w = K.getAppState().toolPermissionContext;
    let O = await I0(qY()), $ = G66(z, O);
    // Check deny rules first
    let j = Sb(w, m66, "deny");
    for (let [D, X] of j.entries()) if (matchesSkill(D, z)) return { behavior: "deny", ... };
    // Check allow rules
    let J = Sb(w, m66, "allow");
    for (let [D, X] of J.entries()) if (matchesSkill(D, z)) return { behavior: "allow", ... };
    // Auto-allow safe prompt skills
    if ($?.type === "prompt" && $kY($)) return { behavior: "allow", ... };
    // Default: ask user
    return { behavior: "ask", message: `Execute skill: ${z}`, suggestions: [...] };
}

// READABLE (for understanding):
async checkPermissions({ skill: skillInput, args }, context) {
    let normalizedName = normalize(skillInput);
    let permissionContext = context.getAppState().toolPermissionContext;
    let skill = findSkill(normalizedName);
    // 1. Deny rules win first
    if (matchesDenyRule(normalizedName)) return { behavior: "deny" };
    // 2. Explicit allow rules
    if (matchesAllowRule(normalizedName)) return { behavior: "allow" };
    // 3. Auto-allow safe prompt skills (stateless, no dangerous side-effects)
    if (skill?.type === "prompt" && isSafePromptSkill(skill)) return { behavior: "allow" };
    // 4. Ask user for everything else
    return { behavior: "ask", message: `Execute skill: ${normalizedName}`, suggestions: addRuleSuggestions };
}

// Mapping: Sb→checkPermissionRules, $kY→isSafePromptSkill, m66→SkillTool, $→skill
```

**Auto-allow condition:** A `prompt` type skill passes `$kY` (safe guard) when it has no fields beyond the standard set (checked by iterating `OkY` allowlist). This means: stateless skills with no custom model, agent, or context configuration are auto-allowed.

**Permission suggestions:** When the user is prompted, two "add rule" suggestions are shown: one for the exact skill name (`commit`) and one for all sub-skills (`commit:*`). This supports namespace-based permission grants.

---

## Two Execution Paths in Stage 5

### Path 1: Inline Execution (prompt-type skill)

**Trigger:** Skill has `type: "prompt"` (most simple skills).

**What happens:**
1. `m66.call()` is invoked with the skill name and args
2. The skill's prompt is evaluated and expanded with the args
3. A sub-agent loop runs inline (same thread, same turn)
4. Returns `{ newMessages, contextModifier }` — messages injected into conversation, context optionally modified

```javascript
// READABLE (for understanding):
// Location: chunks.137.mjs:~150-214
async call({ skill, args }, context, canUseTool, assistantMessage, progressCallback) {
    // Run skill inline
    let { newMessages, contextModifier } = await executeInlineSkill(skill, args, context, ...);
    return {
        data: {
            success: true,
            commandName: skill,
            status: "inline"  // or absent
        },
        newMessages: newMessages,          // Injected into conversation
        contextModifier: contextModifier   // Optional context modification (e.g., tool permissions)
    };
}
```

**`contextModifier` purpose:** Allows a skill to expand the tool permission context for subsequent turns. For example, a skill might grant `always-allow` permission for specific Bash commands it knows are safe in the project context.

### Path 2: Forked Execution (agent-type skill)

**Trigger:** Skill has `type !== "prompt"` (e.g., agent-type skills with their own loop).

**What happens:**
1. `m66.call()` is invoked
2. A new sub-agent is created via `qh` (the main agent loop)
3. The sub-agent runs asynchronously
4. Execution returns immediately with `{ status: "forked", agentId, result }`

```javascript
// ============================================
// SkillTool forked execution
// Location: chunks.136.mjs:~2460-2514
// ============================================

// ORIGINAL (for source lookup):
k(`SkillTool executing forked skill ${q} with agent ${P.agentType}`);
for await (let N of qh({ agentDefinition: P, ... })) {
    if (G.push(N), (N.type === "assistant" || N.type === "user") && w) {
        // Emit progress for tool_use/tool_result messages
        w({ toolUseID: `skill_${_.message.id}`, data: { message: N, type: "skill_progress", ... } })
    }
}
let f = XN1(G, "Skill execution completed");
return { data: { success: true, commandName: q, status: "forked", agentId: $, result: f } }

// READABLE (for understanding):
for await (let message of agentLoop({ agentDefinition: baseAgent, ... })) {
    if (isConversationMessage(message) && progressCallback) {
        progressCallback({
            toolUseID: `skill_${assistantMessageId}`,
            data: { message, type: "skill_progress", agentId: agentId }
        });
    }
}
let summary = summarizeAgentOutput(messages, "Skill execution completed");
return { data: { success: true, commandName: skillName, status: "forked", agentId, result: summary } };

// Mapping: qh→agentLoop, XN1→summarizeAgentOutput, P→baseAgent, G→messages,
//          $→agentId, w→progressCallback
```

---

## Progress Visibility

| Execution type | Progress updates | Mechanism |
|----------------|-----------------|-----------|
| Inline skill | None | Runs synchronously to completion |
| Forked skill | Yes — `skill_progress` type | `progressCallback` called for each sub-agent message |
| Sub-tools of forked skill | Yes — own tool progress | Sub-agent's tool calls have their own pipeline progress |

**Forked skill progress data:** Each progress event includes the sub-agent message and type `"skill_progress"`, allowing the UI to show real-time output from the forked sub-agent.

---

## Permission Flow in Forked Skills

When a forked skill's sub-agent calls tools:
1. The sub-agent's tool calls go through the **independent tool execution pipeline** in the sub-agent's context
2. Permissions are checked against the sub-agent's `toolPermissionContext` (may differ from parent)
3. The skill's initial `checkPermissions` approval does **not** cascade to the sub-agent's tool calls

This means a user approving "run the `deploy` skill" does not automatically approve the Bash commands that skill may invoke.

---

## mapToolResultToToolResultBlockParam

After `m66.call()` returns, the result is serialized back to the LLM as a `tool_result` block:

```javascript
// Location: chunks.137.mjs:254-267
mapToolResultToToolResultBlockParam(result, toolUseId) {
    if ("status" in result && result.status === "forked") {
        return {
            type: "tool_result",
            tool_use_id: toolUseId,
            content: `Skill "${result.commandName}" completed (forked execution).\n\nResult:\n${result.result}`
        };
    }
    return {
        type: "tool_result",
        tool_use_id: toolUseId,
        content: `Launching skill: ${result.commandName}`
    };
}
```

**Inline result:** The `tool_result` content is `"Launching skill: {name}"` (minimal). The actual output is in `newMessages` which are injected into the conversation separately.

**Forked result:** The `tool_result` includes the summarized output from the sub-agent execution.

---

## Key Insight

The Skill tool is architecturally interesting because its `call()` return value has two formats that the pipeline must handle differently:
- `newMessages` field (inline) → injected into the conversation message array as new messages
- `status: "forked"` (forked) → serialized into the tool_result content

This dual-format output is unique to the Skill tool among all standard tools. The agent loop handles the `newMessages` injection as part of processing Skill tool results after the pipeline completes.
