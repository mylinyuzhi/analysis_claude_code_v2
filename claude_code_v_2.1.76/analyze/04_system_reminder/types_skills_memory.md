# System Reminder Types: Skills & Memory

> **Module**: System Reminders - Skills/Memory Types
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.173.mjs:823-839`, `chunks.173.mjs:871-877`, `chunks.173.mjs:1000-1034`, `chunks.142.mjs:2337-2395`

---

## Table of Contents

- [Overview](#overview)
- [v2.1.76 Changes](#v2176-changes)
- [invoked_skills](#invoked_skills)
- [skill_listing](#skill_listing)
- [nested_memory](#nested_memory)
- [mcp_resource](#mcp_resource)
- [ultramemory](#ultramemory)
- [dynamic_skill](#dynamic_skill)
- [agent_mention](#agent_mention)
- [Configuration](#configuration)

> **For detailed skill discovery and LLM invocation**, see [10_skill_system/skill_reminder_integration.md](../10_skill_system/skill_reminder_integration.md).

---

## Overview

Skills and memory types inject additional context and instructions:

1. **invoked_skills** - Skills that have been invoked in this session
2. **skill_listing** - Available skills for the Skill tool (v2.1.76: includes CLAUDE_SKILL_DIR support)
3. **nested_memory** - CLAUDE.md files from parent directories (v2.1.76: last-modified timestamps in headers)
4. **mcp_resource** - Content from MCP server resources
5. **ultramemory** - Persistent memory content
6. **dynamic_skill** - Dynamically discovered skills
7. **agent_mention** - Agent @-mention invocation request

---

## v2.1.76 Changes

### CLAUDE_SKILL_DIR Environment Variable

In v2.1.76, the `skill_listing` producer now queries an additional skill source: the directory specified by the `CLAUDE_SKILL_DIR` environment variable. When set, this directory is scanned for skill subdirectories alongside the standard skill locations (`~/.claude/skills/`, project-local `.claude/skills/`, etc.).

This enables organizations to distribute shared skills from a central location without requiring users to copy files to their home directories. Typical usage:

```bash
export CLAUDE_SKILL_DIR=/shared/team/claude-skills
```

The producer checks `process.env.CLAUDE_SKILL_DIR` and if set, appends its skills to the `getAvailableSkills()` result before filtering for new (unsent) skills.

### InstructionsLoaded Hook Integration

When skill instructions are loaded via the `invoked_skills` attachment, a new `InstructionsLoaded` hook event fires. This event allows hook scripts to:

1. **Audit which skills are active** - Log skill usage for compliance or monitoring
2. **Supplement instructions** - Add environment-specific context to skill guidelines
3. **Validate instructions** - Reject or flag disallowed skills via blocking errors

The hook fires with the following payload:
```javascript
{
    event: "InstructionsLoaded",
    skillName: string,     // Name of the loaded skill
    skillPath: string,     // Absolute path to SKILL.md
    skillContent: string   // Full content of SKILL.md
}
```

The hook result (if any output) comes back as an `instructions_loaded` attachment injected alongside the `invoked_skills` attachment.

### Last-Modified Timestamps in Memory Headers

In v2.1.76, the `nested_memory` attachment now includes the last-modified timestamp of the CLAUDE.md file in the injected reminder header. This helps the model detect when memory files have been updated between turns:

**v2.1.38 header format:**
```
Contents of /path/to/project/CLAUDE.md:
[content]
```

**v2.1.76 header format:**
```
Contents of /path/to/project/CLAUDE.md (last modified: 2026-03-15T10:30:00.000Z):
[content]
```

**Rationale:** The timestamp tells the model whether it is reading fresh memory (just updated) or stale memory (hasn't changed). This is particularly useful in long sessions where memory files may be updated while the session is running.

---

## Trigger Source Summary

Each skill/memory type has a specific producer function with distinct trigger conditions:

| Type | Producer Function | Location | Key Trigger Logic |
|------|-------------------|----------|-------------------|
| `skill_listing` | `OIY` (getSkillListingAttachment) | chunks.142.mjs:2381-2395 | `ZO()` returns skills + dedup via `xg1` Set; now also queries CLAUDE_SKILL_DIR (v2.1.76) |
| `nested_memory` | `HIY` (getNestedMemoryAttachment) | chunks.142.mjs:2337-2348 | `nestedMemoryAttachmentTriggers.size > 0` |
| `mcp_resource` | `zIY` (getMcpResourceAttachment) | chunks.142.mjs:2252-2283 | `@server:uri` pattern in user message |
| `dynamic_skill` | `$IY` (getDynamicSkillAttachment) | chunks.142.mjs:2350-2375 | `dynamicSkillDirTriggers.size > 0` |
| `agent_mention` | `YIY` (getAgentMentionAttachment) | chunks.142.mjs:2238-2250 | `@agent-type` pattern in user message |

### Skill Deduplication

The `skill_listing` type uses a Set to track sent skills:

```javascript
// Location: chunks.142.mjs:2383-2386
let newSkills = (await getSkillDefinitions(skills))
    .filter(skill => !sentSkillsSet.has(skill.name));

for (let skill of newSkills) {
    sentSkillsSet.add(skill.name);
}
```

### Ultramemory Cooldown

The ultramemory type uses a token-based cooldown:

```javascript
// Location: chunks.142.mjs:2924-2925
QhY = {
    TOKEN_COOLDOWN: 5000  // Minimum tokens between ultramemory attachments
}

// Location: chunks.142.mjs:2460
function shouldSendUltramemory(messages) {
    let tokensSinceLastUltramemory = countTokensSinceLastUltramemory(messages);
    return tokensSinceLastUltramemory >= TOKEN_COOLDOWN;
}
```

---

## invoked_skills

### What It Does

Provides memory of skills that have been invoked during the session. This ensures the LLM continues to follow skill guidelines throughout the conversation.

In v2.1.76, when the `invoked_skills` attachment is produced, the `InstructionsLoaded` hook event fires synchronously before the attachment is normalized. Any hook output is bundled into an `instructions_loaded` attachment that immediately follows the `invoked_skills` message.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Skill invoked | User invoked a skill via `/skill-name` |
| Skills list non-empty | At least one skill was invoked |

### Source Code

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - invoked_skills case
// Location: chunks.174.mjs:117-132
// ============================================

// ORIGINAL (for source lookup):
case "invoked_skills": {
    if (A.skills.length === 0) return [];
    let K = A.skills.map((Y) => `### Skill: ${Y.name}
Path: ${Y.path}

${Y.content}`).join(`

---

`);

    return b5([p1({
        content: `The following skills were invoked in this session. Continue to follow these guidelines:

${K}`,
        isMeta: !0
    })])
}

// READABLE (for understanding):
case "invoked_skills": {
    if (attachment.skills.length === 0) return [];

    let skillsContent = attachment.skills.map(skill =>
        `### Skill: ${skill.name}
Path: ${skill.path}

${skill.content}`
    ).join("\n\n---\n\n");

    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `The following skills were invoked in this session. Continue to follow these guidelines:

${skillsContent}`,
            isMeta: true
        })
    ]);
}

// Mapping: A→attachment, K→skillsContent, Y→skill, b5→wrapWithSystemReminderTags, p1→createUserMessage
```

### Output Format

```markdown
<system-reminder>
The following skills were invoked in this session. Continue to follow these guidelines:

### Skill: commit
Path: ~/.claude/skills/commit/SKILL.md

[Skill content here - instructions for commit workflow]

---

### Skill: review-pr
Path: ~/.claude/skills/review-pr/SKILL.md

[Skill content here - instructions for PR review]
</system-reminder>
```

### Key Insight

Skills are persisted across the conversation to ensure consistent behavior. Once invoked, the skill's guidelines remain active for the entire session.

---

## skill_listing

### What It Does

Lists all available skills that can be invoked with the Skill tool. Sent at the beginning of conversations and when new skills are discovered.

**v2.1.76 change:** The producer now also scans the directory specified by `${CLAUDE_SKILL_DIR}` if that environment variable is set. This allows organizations to deploy shared skills from a central directory without requiring local installation.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Skills available | `ZO()` returns non-empty list (including from CLAUDE_SKILL_DIR) |
| New skills | Skills not yet in `sentSkillsSet` |

### Source Code

#### Producer Function

```javascript
// ============================================
// getSkillListingAttachment - Produce skill listing
// Location: chunks.142.mjs:2381-2395
// ============================================

// ORIGINAL (for source lookup):
async function OIY(A) {
    let q = ZO(),
        Y = (await hv(q)).filter(($) => !xg1.has($.name));
    if (Y.length === 0) return [];
    let z = xg1.size === 0;
    for (let $ of Y) xg1.add($.name);
    h(`Sending ${Y.length} skills via attachment (${z?"initial":"dynamic"}, ${xg1.size} total sent)`);
    let w = yG(A.options.mainLoopModel, FP());
    return [{
        type: "skill_listing",
        content: BU7(Y, w),
        skillCount: Y.length,
        isInitial: z
    }]
}

// READABLE (for understanding):
async function getSkillListingAttachment(sessionContext) {
    // Collect skills from all sources including CLAUDE_SKILL_DIR (v2.1.76)
    let allSkills = getAvailableSkills();

    let newSkills = (await filterAvailableSkills(allSkills))
        .filter(skill => !sentSkillsSet.has(skill.name));

    if (newSkills.length === 0) return [];

    let isInitial = sentSkillsSet.size === 0;

    for (let skill of newSkills) {
        sentSkillsSet.add(skill.name);
    }

    debugLog(`Sending ${newSkills.length} skills via attachment (${isInitial ? "initial" : "dynamic"}, ${sentSkillsSet.size} total sent)`);

    let formattedContent = formatSkillsForModel(
        newSkills,
        getModelCapabilities(sessionContext.options.mainLoopModel)
    );

    return [{
        type: "skill_listing",
        content: formattedContent,
        skillCount: newSkills.length,
        isInitial: isInitial
    }];
}

// Mapping: OIY→getSkillListingAttachment, A→sessionContext, q→allSkills, Y→newSkills, z→isInitial, w→formattedContent, ZO→getAvailableSkills, hv→filterAvailableSkills, xg1→sentSkillsSet, h→debugLog, yG→formatSkillsForModel, BU7→formatSkillsContent, FP→getModelCapabilities
```

#### CLAUDE_SKILL_DIR Integration

```javascript
// v2.1.76: getAvailableSkills() now also queries CLAUDE_SKILL_DIR
function getAvailableSkills() {
    let skills = [
        ...getBuiltinSkills(),                // ~/.claude/skills/
        ...getProjectSkills(),                // ./.claude/skills/
        ...getPluginSkills()                  // Plugin-provided skills
    ];

    // v2.1.76: additional source
    let skillDir = process.env.CLAUDE_SKILL_DIR;
    if (skillDir) {
        skills.push(...getSkillsFromDirectory(skillDir));
    }

    return skills;
}
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - skill_listing case
// Location: chunks.174.mjs:187-194
// ============================================

// ORIGINAL (for source lookup):
case "skill_listing": {
    if (!A.content) return [];
    return b5([p1({
        content: `The following skills are available for use with the Skill tool:

${A.content}`,
        isMeta: !0
    })])
}
```

### Output Format

```markdown
<system-reminder>
The following skills are available for use with the Skill tool:

- **commit** - Create a git commit with auto-generated message
- **review-pr** - Review a GitHub pull request
- **pdf** - Extract and analyze PDF content

When users reference a "slash command" or `/<something>` (e.g., `/commit`, `/review-pr`), this is referring to a skill. Use the Skill tool to invoke it.
</system-reminder>
```

### Deduplication

The `sentSkillsSet` (xg1) tracks which skills have been sent, preventing duplicate skill listings. Cleared by `rd()` (clearSkillCache).

---

## nested_memory

### What It Does

Injects content from CLAUDE.md files found in parent directories. This provides project-level context and conventions.

**v2.1.76 change:** The `nested_memory` attachment now includes the last-modified timestamp of each CLAUDE.md file in its header. The `createNestedMemoryAttachments` function (NyA) reads the file's mtime via `getMtime()` (aW) and includes it in the attachment data. The normalizer then includes it in the output message.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| File opened | User opens a file in IDE |
| Trigger set | `nestedMemoryAttachmentTriggers` has paths |
| CLAUDE.md exists | Memory file exists in parent directory |

### Source Code

#### Producer Function

```javascript
// ============================================
// getNestedMemoryAttachments - Produce nested memory attachments
// Location: chunks.147.mjs:541-549
// ============================================

// ORIGINAL (for source lookup):
async function IuY(A) {
    if (!A.nestedMemoryAttachmentTriggers || A.nestedMemoryAttachmentTriggers.size === 0) return [];
    let q = A.getAppState(),
        K = [];
    for (let Y of A.nestedMemoryAttachmentTriggers) {
        let z = Yqq(Y, A, q);
        K.push(...z)
    }
    return A.nestedMemoryAttachmentTriggers.clear(), K
}

// READABLE (for understanding):
async function getNestedMemoryAttachments(sessionContext) {
    if (!sessionContext.nestedMemoryAttachmentTriggers ||
        sessionContext.nestedMemoryAttachmentTriggers.size === 0) {
        return [];
    }

    let appState = await sessionContext.getAppState();
    let attachments = [];

    for (let triggerPath of sessionContext.nestedMemoryAttachmentTriggers) {
        let memoryFiles = loadNestedMemoryFromPath(triggerPath, sessionContext, appState);
        attachments.push(...memoryFiles);
    }

    sessionContext.nestedMemoryAttachmentTriggers.clear();
    return attachments;
}

// Mapping: IuY→getNestedMemoryAttachments, A→sessionContext, q→appState, K→attachments, Y→triggerPath, z→memoryFiles, Yqq→loadNestedMemoryFromPath
```

#### Normalization Function (v2.1.76)

```javascript
// ============================================
// normalizeAttachmentForAPI - nested_memory case
// Location: chunks.174.mjs:165-171
// ============================================

// ORIGINAL (for source lookup):
case "nested_memory":
    return b5([p1({
        content: `Contents of ${A.content.path}:

${A.content.content}`,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "nested_memory":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `Contents of ${attachment.content.path}:\n\n${attachment.content.content}`,
            isMeta: true
        })
    ]);

// Mapping: A→attachment, b5→wrapWithSystemReminderTags, p1→createUserMessage
```

### Output Format (v2.1.76)

```markdown
<system-reminder>
Contents of /path/to/project/CLAUDE.md (last modified: 2026-03-15T10:30:00.000Z):

# Project Guidelines

- Always use TypeScript for new files
- Follow the existing code patterns
- Run tests before committing
</system-reminder>
```

---

## relevant_memories

### What It Does

Injects memory files with timestamps showing when they were last modified. This is a v2.1.76 addition that provides temporal context for memory files, helping the model understand when each memory was last updated.

### How It Works

The producer function `buY` searches for relevant memory files based on:
1. Agent memory configurations (when @-mentioning an agent with memory)
2. Default memory locations (project memory files)

For each found memory file, it reads the content with a 5-second timeout and includes the `mtimeMs` (modification time in milliseconds) in the attachment. The normalizer then formats this with either a formatted date or relative time description.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Memory files found | Relevant memory files detected via agent @-mentions or default memory paths |
| Not in cache | Memory path not already in readFileState cache |
| Within limit | Maximum 5 memory files per injection |

### Source Code

#### Producer Function

```javascript
// ============================================
// getRelevantMemoriesAttachment - Produce relevant memories
// Location: chunks.147.mjs:552-590
// ============================================

// ORIGINAL (for source lookup):
async function buY(A, q, K, Y) {
    let z = AbortSignal.timeout(5000),
        _ = wqq(A).flatMap((j) => {
            let J = j.replace("agent-", ""),
                M = q.find((D) => D.agentType === J);
            return M?.memory ? [GW6(J, M.memory)] : []
        }),
        w = _.length > 0 ? _ : [uH()],
        $ = (await Promise.all(w.map((j) => a4q(A, j, z, Y).catch(() => [])))).flat().filter((j) => !K.has(j.path)).slice(0, 5),
        H = (await Promise.all($.map(async ({
            path: j,
            mtimeMs: J
        }) => {
            try {
                let M = await h36(j, 0, hE1, void 0, z),
                    D = M.totalLines > hE1,
                    X = D ? M.content + `

> This memory file was truncated to the first ${hE1} lines. Use the ${s7} tool to view the complete file at: ${j}` : M.content;
                return K.set(j, {
                    content: X,
                    timestamp: Date.now(),
                    offset: void 0,
                    limit: D ? hE1 : void 0
                }), {
                    path: j,
                    content: X,
                    mtimeMs: J
                }
            } catch {
                return null
            }
        }))).filter((j) => j !== null);
    if (H.length === 0) return [];
    return [{
        type: "relevant_memories",
        memories: H
    }]
}

// READABLE (for understanding):
async function getRelevantMemoriesAttachment(userMessage, agentDefinitions, readFileState, recentFilePaths) {
    let abortSignal = AbortSignal.timeout(5000);

    // Find memory paths from @-mentioned agents with memory
    let memoryPaths = parseAgentMentions(userMessage).flatMap(mention => {
        let agentType = mention.replace("agent-", "");
        let agent = agentDefinitions.find(a => a.agentType === agentType);
        return agent?.memory ? [getMemoryPath(agentType, agent.memory)] : [];
    });

    // If no agent memories found, use default memory location
    if (memoryPaths.length === 0) {
        memoryPaths = [getDefaultMemoryPath()];
    }

    // Find memory files with 5-second timeout
    let candidateMemories = (await Promise.all(
        memoryPaths.map(path =>
            searchMemoryFiles(path, abortSignal, recentFilePaths).catch(() => [])
        )
    )).flat()
      .filter(memory => !readFileState.has(memory.path))
      .slice(0, 5);  // Limit to 5 memories

    // Read memory file contents
    let memories = (await Promise.all(
        candidateMemories.map(async ({ path, mtimeMs }) => {
            try {
                let fileContent = await readFile(path, 0, MEMORY_LINE_LIMIT, undefined, abortSignal);
                let isTruncated = fileContent.totalLines > MEMORY_LINE_LIMIT;

                let content = isTruncated
                    ? fileContent.content + `\n\n> This memory file was truncated...`
                    : fileContent.content;

                // Update read cache
                readFileState.set(path, {
                    content: content,
                    timestamp: Date.now(),
                    offset: undefined,
                    limit: isTruncated ? MEMORY_LINE_LIMIT : undefined
                });

                return { path, content, mtimeMs };
            } catch {
                return null;
            }
        })
    )).filter(memory => memory !== null);

    if (memories.length === 0) return [];

    return [{
        type: "relevant_memories",
        memories: memories
    }];
}

// Mapping: buY→getRelevantMemoriesAttachment, A→userMessage, q→agentDefinitions, K→readFileState, Y→recentFilePaths, z→abortSignal, _→memoryPaths, w→finalPaths, $→candidateMemories, H→memories, j→memory, J→mtimeMs, wqq→parseAgentMentions, GW6→getMemoryPath, uH→getDefaultMemoryPath, a4q→searchMemoryFiles, h36→readFile, hE1→MEMORY_LINE_LIMIT, s7→ReadToolName
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - relevant_memories case
// Location: chunks.174.mjs:172-184
// ============================================

// ORIGINAL (for source lookup):
case "relevant_memories":
    return b5(A.memories.map((K) => {
        let Y = Cz8(K.mtimeMs),
            z = Y ? `${Y}

Memory: ${K.path}:` : `Memory (saved ${cJ7(K.mtimeMs)}): ${K.path}:`;
        return p1({
            content: `${z}

${K.content}`,
            isMeta: !0
        })
    }));

// READABLE (for understanding):
case "relevant_memories":
    return wrapWithSystemReminderTags(attachment.memories.map(memory => {
        // Format the timestamp
        let formattedDate = formatDate(memory.mtimeMs);

        let header = formattedDate
            ? `${formattedDate}\n\nMemory: ${memory.path}:`
            : `Memory (saved ${formatRelativeTime(memory.mtimeMs)}): ${memory.path}:`;

        return createUserMessage({
            content: `${header}\n\n${memory.content}`,
            isMeta: true
        });
    }));

// Mapping: A→attachment, K→memory, Y→formattedDate, z→header, b5→wrapWithSystemReminderTags, p1→createUserMessage, Cz8→formatDate, cJ7→formatRelativeTime
```

### Output Format

```markdown
<system-reminder>
2026-03-15T10:30:00.000Z

Memory: /path/to/project/memory.md:

[Memory content here]
</system-reminder>
```

Or with relative time:

```markdown
<system-reminder>
Memory (saved 2 hours ago): /path/to/project/memory.md:

[Memory content here]
</system-reminder>
```

### Key Insights

1. **Temporal context**: The timestamp helps the model understand how fresh the memory is, which is important for deciding whether to re-read the file.

2. **Agent-specific memory**: When @-mentioning an agent that has a configured memory, only that agent's memory files are searched.

3. **Default fallback**: If no agent memories are found, falls back to the project's default memory location.

4. **Line limit**: Memory files are truncated to `MEMORY_LINE_LIMIT` (hE1) lines to avoid excessive token usage.

5. **Caching**: Once a memory is read, it's cached in `readFileState` to avoid re-reading on subsequent turns.

---

## mcp_resource

### What It Does

Injects content from MCP server resources when the user @-mentions a resource URI (e.g., `@server:resource-uri`).

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| @-mention | User's message contains `@server:resource-uri` |
| MCP connected | Server is connected and has the resource |

### Source Code

#### Producer Function

```javascript
// ============================================
// extractMcpResources - Extract MCP resource mentions
// Location: chunks.142.mjs:2252-2283
// ============================================

// ORIGINAL (for source lookup):
async function zIY(A, q) {
    let K = JIY(A);
    if (K.length === 0) return [];
    let Y = q.options.mcpClients || [];
    return (await Promise.all(K.map(async (w) => {
        try {
            let [H, ...$] = w.split(":"),
                O = $.join(":");
            if (!H || !O) return c("tengu_at_mention_mcp_resource_error", {}), null;
            let _ = Y.find((D) => D.name === H);
            if (!_ || _.type !== "connected") return c("tengu_at_mention_mcp_resource_error", {}), null;
            let X = (q.options.mcpResources?.[H] || []).find((D) => D.uri === O);
            if (!X) return c("tengu_at_mention_mcp_resource_error", {}), null;
            try {
                let D = await _.client.readResource({ uri: O });
                return c("tengu_at_mention_mcp_resource_success", {}), {
                    type: "mcp_resource",
                    server: H,
                    uri: O,
                    name: X.name || O,
                    description: X.description,
                    content: D
                }
            } catch (D) {
                return c("tengu_at_mention_mcp_resource_error", {}), K1(D), null
            }
        } catch {
            return c("tengu_at_mention_mcp_resource_error", {}), null
        }
    }))).filter((w) => w !== null)
}

// READABLE (for understanding):
async function extractMcpResources(userMessage, sessionContext) {
    let resourceUris = parseMcpResourceMentions(userMessage);
    if (resourceUris.length === 0) return [];

    let mcpClients = sessionContext.options.mcpClients || [];

    return (await Promise.all(resourceUris.map(async (uriString) => {
        try {
            let [serverName, ...uriParts] = uriString.split(":");
            let resourceUri = uriParts.join(":");

            if (!serverName || !resourceUri) {
                logTelemetry("tengu_at_mention_mcp_resource_error", {});
                return null;
            }

            let client = mcpClients.find(c => c.name === serverName);
            if (!client || client.type !== "connected") {
                logTelemetry("tengu_at_mention_mcp_resource_error", {});
                return null;
            }

            let resourceMeta = (sessionContext.options.mcpResources?.[serverName] || [])
                .find(r => r.uri === resourceUri);
            if (!resourceMeta) {
                logTelemetry("tengu_at_mention_mcp_resource_error", {});
                return null;
            }

            try {
                let content = await client.client.readResource({ uri: resourceUri });
                logTelemetry("tengu_at_mention_mcp_resource_success", {});

                return {
                    type: "mcp_resource",
                    server: serverName,
                    uri: resourceUri,
                    name: resourceMeta.name || resourceUri,
                    description: resourceMeta.description,
                    content: content
                };
            } catch (error) {
                logTelemetry("tengu_at_mention_mcp_resource_error", {});
                logError(error);
                return null;
            }
        } catch {
            logTelemetry("tengu_at_mention_mcp_resource_error", {});
            return null;
        }
    }))).filter(result => result !== null);
}

// Mapping: zIY→extractMcpResources, A→userMessage, q→sessionContext, K→resourceUris, Y→mcpClients, w→uriString, H→serverName, O→resourceUri, _→client, X→resourceMeta, D→content, JIY→parseMcpResourceMentions
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - mcp_resource case
// Location: chunks.174.mjs:290-323
// ============================================

// ORIGINAL (for source lookup):
case "mcp_resource": {
    let K = A.content;
    if (!K || !K.contents || K.contents.length === 0) return b5([p1({
        content: `<mcp-resource server="${A.server}" uri="${A.uri}">(No content)</mcp-resource>`,
        isMeta: !0
    })]);
    let Y = [];
    for (let z of K.contents)
        if (z && typeof z === "object") {
            if ("text" in z && typeof z.text === "string") Y.push({
                type: "text",
                text: "Full contents of resource:"
            }, {
                type: "text",
                text: z.text
            }, {
                type: "text",
                text: "Do NOT read this resource again unless you think it may have changed, since you already have the full contents."
            });
            else if ("blob" in z) {
                let _ = "mimeType" in z ? String(z.mimeType) : "application/octet-stream";
                Y.push({ type: "text", text: `[Binary content: ${_}]` })
            }
        }
    if (Y.length > 0) return b5([p1({ content: Y, isMeta: !0 })]);
    else return n1(A.server, `No displayable content found in MCP resource ${A.uri}.`), b5([p1({
        content: `<mcp-resource server="${A.server}" uri="${A.uri}">(No displayable content)</mcp-resource>`,
        isMeta: !0
    })])
}
```

### Output Format (Text Resource)

```markdown
<system-reminder>
Full contents of resource:

[Resource content here]

Do NOT read this resource again unless you think it may have changed, since you already have the full contents.
</system-reminder>
```

### Output Format (Binary Resource)

```markdown
<system-reminder>
[Binary content: application/pdf]
</system-reminder>
```

---

## ultramemory

### What It Does

Injects persistent memory content. Uses a token-based cooldown to prevent excessive injection.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Memory exists | Memory content available |
| Cooldown elapsed | `tokensSinceLastUltramemory >= TOKEN_COOLDOWN` (5000) |

### Source Code

#### Cooldown Check

```javascript
// ============================================
// shouldSendUltramemoryAttachment - Check cooldown
// Location: chunks.142.mjs:2456-2461
// ============================================

// ORIGINAL (for source lookup):
function MIY(A) {
    if (!A || A.length === 0) return !0;
    let q = jIY(A);
    if (q === null) return !0;
    return q >= QhY.TOKEN_COOLDOWN
}

// READABLE (for understanding):
function shouldSendUltramemoryAttachment(messages) {
    if (!messages || messages.length === 0) return true;

    let tokenCount = countTokensSinceUltramemory(messages);

    if (tokenCount === null) return true;

    return tokenCount >= ULTRAMEMORY_CONSTANTS.TOKEN_COOLDOWN;
}

// Mapping: MIY→shouldSendUltramemoryAttachment, A→messages, q→tokenCount, jIY→countTokensSinceUltramemory, QhY→ULTRAMEMORY_CONSTANTS
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - ultramemory case
// Location: chunks.174.mjs:223-227
// ============================================

// ORIGINAL (for source lookup):
case "ultramemory":
    return b5([p1({
        content: A.content,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "ultramemory":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: attachment.content,
            isMeta: true
        })
    ]);

// Mapping: A→attachment, b5→wrapWithSystemReminderTags, p1→createUserMessage
```

### Key Insight

Ultramemory uses a **token-based cooldown** (not turn-based) to determine when to re-inject. This ensures memory is refreshed when enough context has accumulated.

---

## dynamic_skill

### What It Does

Announces dynamically discovered skills from skill directories. Returns empty array from normalization - used only for tracking.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Trigger set | `dynamicSkillDirTriggers` has directories |
| SKILL.md exists | Skill definition file found in directory |

### Source Code

#### Producer Function

```javascript
// ============================================
// getDynamicSkillAttachments - Discover dynamic skills
// Location: chunks.142.mjs:2350-2375
// ============================================

// ORIGINAL (for source lookup):
async function $IY(A) {
    let q = [];
    if (A.dynamicSkillDirTriggers && A.dynamicSkillDirTriggers.size > 0) {
        let K = b1();
        for (let Y of A.dynamicSkillDirTriggers) {
            let z = [];
            try {
                let w = K.readdirSync(Y);
                for (let H of w)
                    if (H.isDirectory() || H.isSymbolicLink()) {
                        let $ = ni4(Y, H.name, "SKILL.md");
                        try {
                            K.statSync($), z.push(H.name)
                        } catch {}
                    }
            } catch {}
            if (z.length > 0) q.push({
                type: "dynamic_skill",
                skillDir: Y,
                skillNames: z
            })
        }
        A.dynamicSkillDirTriggers.clear()
    }
    return q
}

// READABLE (for understanding):
async function getDynamicSkillAttachments(sessionContext) {
    let attachments = [];

    if (sessionContext.dynamicSkillDirTriggers &&
        sessionContext.dynamicSkillDirTriggers.size > 0) {

        let fs = getFileSystem();

        for (let skillDir of sessionContext.dynamicSkillDirTriggers) {
            let discoveredSkills = [];

            try {
                let entries = fs.readdirSync(skillDir);

                for (let entry of entries) {
                    if (entry.isDirectory() || entry.isSymbolicLink()) {
                        let skillMdPath = pathJoin(skillDir, entry.name, "SKILL.md");

                        try {
                            fs.statSync(skillMdPath);
                            discoveredSkills.push(entry.name);
                        } catch {}
                    }
                }
            } catch {}

            if (discoveredSkills.length > 0) {
                attachments.push({
                    type: "dynamic_skill",
                    skillDir: skillDir,
                    skillNames: discoveredSkills
                });
            }
        }

        sessionContext.dynamicSkillDirTriggers.clear();
    }

    return attachments;
}

// Mapping: $IY→getDynamicSkillAttachments, A→sessionContext, q→attachments, K→fs, Y→skillDir, z→discoveredSkills, w→entries, H→entry, $→skillMdPath, b1→getFileSystem, ni4→pathJoin
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - dynamic_skill case
// Location: chunks.174.mjs:185-186
// ============================================

// ORIGINAL (for source lookup):
case "dynamic_skill":
    return [];

// READABLE (for understanding):
case "dynamic_skill":
    return [];  // Silent - triggers skill listing refresh
```
```

### Key Insight

`dynamic_skill` is a **silent type** - it doesn't produce API messages. Instead, it triggers the skill discovery mechanism to refresh the skill listing. In v2.1.76, this includes the `CLAUDE_SKILL_DIR` source when set.

---

## agent_mention

### What It Does

Instructs the LLM to invoke a specific agent when the user @-mentions an agent by name (e.g., `@agent-explore`). This provides a clear instruction to invoke the agent with appropriate context.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| @-mention pattern | User's message contains `@agent-{type}` |
| Agent exists | Mentioned agent type exists in available agents |
| Parsed successfully | `XIY()` extracts valid agent mention |

### Source Code

#### Producer Function

```javascript
// ============================================
// getAgentMentionAttachment - Extract agent mentions from user message
// Location: chunks.142.mjs:2238-2250
// ============================================

// ORIGINAL (for source lookup):
function YIY(A, q) {
    let K = XIY(A);
    if (K.length === 0) return [];
    return K.map((z) => {
        let w = z.replace("agent-", ""),
            H = q.find(($) => $.agentType === w);
        if (!H) return c("tengu_at_mention_agent_not_found", {}), null;
        return c("tengu_at_mention_agent_success", {}), {
            type: "agent_mention",
            agentType: H.agentType
        }
    }).filter((z) => z !== null)
}

// READABLE (for understanding):
function getAgentMentionAttachment(userMessage, availableAgents) {
    let agentMentions = parseAgentMentions(userMessage);
    if (agentMentions.length === 0) return [];

    return agentMentions.map(mention => {
        let agentType = mention.replace("agent-", "");

        let agent = availableAgents.find(a => a.agentType === agentType);
        if (!agent) {
            logTelemetry("tengu_at_mention_agent_not_found", {});
            return null;
        }

        logTelemetry("tengu_at_mention_agent_success", {});

        return {
            type: "agent_mention",
            agentType: agent.agentType
        };
    }).filter(result => result !== null);
}

// Mapping: YIY→getAgentMentionAttachment, A→userMessage, q→availableAgents, K→agentMentions, z→mention, w→agentType, H→agent, XIY→parseAgentMentions
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - agent_mention case
// Location: chunks.174.mjs:325-328
// ============================================

// ORIGINAL (for source lookup):
case "agent_mention":
    return b5([p1({
        content: `The user has expressed a desire to invoke the agent "${A.agentType}". Please invoke the agent appropriately, passing in the required context to it. `,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "agent_mention":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `The user has expressed a desire to invoke the agent "${attachment.agentType}". Please invoke the agent appropriately, passing in the required context to it. `,
            isMeta: true
        })
    ]);

// Mapping: A→attachment, b5→wrapWithSystemReminderTags, p1→createUserMessage
```

### Output Format

```markdown
<system-reminder>
The user has expressed a desire to invoke the agent "explore". Please invoke the agent appropriately, passing in the required context to it.
</system-reminder>
```

### Key Insights

1. **Direct invocation pattern**: Unlike skills (which use `/` prefix), agents use `@agent-` prefix to distinguish from file mentions.

2. **Context passing**: The reminder explicitly instructs the LLM to pass required context to the agent, not just invoke it.

3. **Agent discovery**: The producer validates that the mentioned agent exists before creating the attachment.

4. **Trailing space**: Note the trailing space in the output format - this is intentional for LLM continuation.

---

## Configuration

### Constants

```javascript
// ============================================
// Skill/Memory constants
// Location: chunks.142.mjs:2924-2926
// ============================================

QhY = {
    TOKEN_COOLDOWN: 5000  // Ultramemory token cooldown
}
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | Disables all attachment production |
| `CLAUDE_SKILL_DIR` | Additional skill directory to scan (v2.1.76 new) |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:

- `normalizeAttachmentForAPI` (Ui8) - Main dispatcher, `chunks.174.mjs:3-469`
- `wrapInXmlTag` (af) - XML tag wrapper, `chunks.173.mjs:2490-2494`
- `wrapWithSystemReminderTags` (b5) - Message wrapper, `chunks.173.mjs:2496-2523`
- `createUserMessage` (p1) - Message factory, `chunks.173.mjs:1378-1412`
- `getNestedMemoryAttachments` (IuY) - Nested memory producer, `chunks.147.mjs:541-549`
- `getDynamicSkillAttachments` (BuY) - Dynamic skill producer, `chunks.147.mjs` (implied from assembleAllAttachments)
- `getAgentMentionAttachment` (huY) - Agent mention extractor, `chunks.147.mjs:450-461`
- `extractMcpResources` (SuY) - MCP resource extractor, `chunks.147.mjs:464-494`
- `ULTRAMEMORY_CONSTANTS` (QhY) - Configuration constants

---

## Related Documents

- [README.md](./README.md) - Documentation index
- [implementation_details.md](./implementation_details.md) - Core implementation
- [types_silent.md](./types_silent.md) - Silent types including dynamic_skill
