# System Reminder Types: Skills & Memory

> **Module**: System Reminders - Skills/Memory Types
> **Version**: Claude Code 2.1.38
> **Source**: `chunks.173.mjs:823-839`, `chunks.173.mjs:871-877`, `chunks.173.mjs:1000-1034`, `chunks.142.mjs:2337-2395`

---

## Table of Contents

- [Overview](#overview)
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
2. **skill_listing** - Available skills for the Skill tool
3. **nested_memory** - CLAUDE.md files from parent directories
4. **mcp_resource** - Content from MCP server resources
5. **ultramemory** - Persistent memory content
6. **dynamic_skill** - Dynamically discovered skills
7. **agent_mention** - Agent @-mention invocation request

---

## Trigger Source Summary

Each skill/memory type has a specific producer function with distinct trigger conditions:

| Type | Producer Function | Location | Key Trigger Logic |
|------|-------------------|----------|-------------------|
| `skill_listing` | `OIY` (getSkillListingAttachment) | chunks.142.mjs:2381-2395 | `ZO()` returns skills + dedup via `xg1` Set |
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
// Location: chunks.173.mjs:823-839
// ============================================

// ORIGINAL (for source lookup):
case "invoked_skills": {
    if (A.skills.length === 0) return [];
    let K = A.skills.map((Y) => `### Skill: ${Y.name}
Path: ${Y.path}

${Y.content}`).join(`

---

`);

    return _9([c6({
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

// Mapping: A→attachment, K→skillsContent, Y→skill, _9→wrapWithSystemReminderTags, c6→createUserMessage
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

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Skills available | `ZO()` returns non-empty list |
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
    let allSkills = getAvailableSkills();

    // Filter to only skills not yet sent
    let newSkills = (await filterAvailableSkills(allSkills))
        .filter(skill => !sentSkillsSet.has(skill.name));

    if (newSkills.length === 0) return [];

    // Track if this is initial or dynamic
    let isInitial = sentSkillsSet.size === 0;

    // Add all new skills to sent set
    for (let skill of newSkills) {
        sentSkillsSet.add(skill.name);
    }

    debugLog(`Sending ${newSkills.length} skills via attachment (${isInitial ? "initial" : "dynamic"}, ${sentSkillsSet.size} total sent)`);

    // Format for model
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

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - skill_listing case
// Location: chunks.173.mjs:880-888
// ============================================

// ORIGINAL (for source lookup):
case "skill_listing": {
    if (!A.content) return [];
    return _9([c6({
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
// Location: chunks.142.mjs:2337-2348
// ============================================

// ORIGINAL (for source lookup):
async function HIY(A) {
    let q = await A.getAppState(),
        K = [];
    if (A.nestedMemoryAttachmentTriggers && A.nestedMemoryAttachmentTriggers.size > 0) {
        for (let Y of A.nestedMemoryAttachmentTriggers) {
            let z = ri4(Y, A, q);
            K.push(...z)
        }
        A.nestedMemoryAttachmentTriggers.clear()
    }
    return K
}

// READABLE (for understanding):
async function getNestedMemoryAttachments(sessionContext) {
    let appState = await sessionContext.getAppState();
    let attachments = [];

    if (sessionContext.nestedMemoryAttachmentTriggers &&
        sessionContext.nestedMemoryAttachmentTriggers.size > 0) {

        for (let triggerPath of sessionContext.nestedMemoryAttachmentTriggers) {
            let memoryFiles = loadNestedMemory(triggerPath, sessionContext, appState);
            attachments.push(...memoryFiles);
        }

        // Clear triggers after processing
        sessionContext.nestedMemoryAttachmentTriggers.clear();
    }

    return attachments;
}

// Mapping: HIY→getNestedMemoryAttachments, A→sessionContext, q→appState, K→attachments, Y→triggerPath, z→memoryFiles, ri4→loadNestedMemory
```

#### Loading Logic

```javascript
// ============================================
// loadNestedMemory - Load CLAUDE.md from parent directories
// Location: chunks.142.mjs:2163-2187
// ============================================

// ORIGINAL (for source lookup):
function ri4(A, q, K) {
    let Y = [];
    try {
        if (!EI(A, K.toolPermissionContext)) return Y;
        let z = new Set,
            w = y8(),
            H = jp7(A, z);
        Y.push(...NyA(H, q));
        let {
            nestedDirs: $,
            cwdLevelDirs: O
        } = AIY(A, w);
        for (let _ of $) {
            let J = Mp7(_, A, z);
            Y.push(...NyA(J, q))
        }
        for (let _ of O) {
            let J = Pp7(_, A, z);
            Y.push(...NyA(J, q))
        }
    } catch (z) {
        K1(z)
    }
    return Y
}

// READABLE (for understanding):
function loadNestedMemory(filePath, sessionContext, appState) {
    let attachments = [];

    try {
        // Check read permission
        if (!hasReadPermission(filePath, appState.toolPermissionContext)) {
            return attachments;
        }

        let seenPaths = new Set();
        let cwd = getCurrentWorkingDirectory();

        // Load CLAUDE.md from the file's directory
        let directMemory = findMemoryFilesInDir(filePath, seenPaths);
        attachments.push(...createNestedMemoryAttachments(directMemory, sessionContext));

        // Get nested directory paths
        let { nestedDirs, cwdLevelDirs } = getNestedDirectoryPaths(filePath, cwd);

        // Load CLAUDE.md from parent directories (nested)
        for (let dir of nestedDirs) {
            let dirMemory = findMemoryFilesInParentDir(dir, filePath, seenPaths);
            attachments.push(...createNestedMemoryAttachments(dirMemory, sessionContext));
        }

        // Load CLAUDE.md from cwd-level directories
        for (let dir of cwdLevelDirs) {
            let dirMemory = findMemoryFilesInCwdDir(dir, filePath, seenPaths);
            attachments.push(...createNestedMemoryAttachments(dirMemory, sessionContext));
        }

    } catch (error) {
        logError(error);
    }

    return attachments;
}

// Mapping: ri4→loadNestedMemory, A→filePath, q→sessionContext, K→appState, Y→attachments, z→seenPaths, w→cwd, H→directMemory, $→nestedDirs, O→cwdLevelDirs, EI→hasReadPermission, y8→getCurrentWorkingDirectory, jp7→findMemoryFilesInDir, NyA→createNestedMemoryAttachments, AIY→getNestedDirectoryPaths, Mp7→findMemoryFilesInParentDir, Pp7→findMemoryFilesInCwdDir
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - nested_memory case
// Location: chunks.173.mjs:871-877
// ============================================

// ORIGINAL (for source lookup):
case "nested_memory":
    return _9([c6({
        content: `Contents of ${A.content.path}:

${A.content.content}`,
        isMeta: !0
    })]);
```

### Output Format

```markdown
<system-reminder>
Contents of /path/to/project/CLAUDE.md:

# Project Guidelines

- Always use TypeScript for new files
- Follow the existing code patterns
- Run tests before committing
</system-reminder>
```

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
                let D = await _.client.readResource({
                    uri: O
                });
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
            // Parse "server:resource-uri" format
            let [serverName, ...uriParts] = uriString.split(":");
            let resourceUri = uriParts.join(":");

            if (!serverName || !resourceUri) {
                logTelemetry("tengu_at_mention_mcp_resource_error", {});
                return null;
            }

            // Find the MCP client
            let client = mcpClients.find(c => c.name === serverName);
            if (!client || client.type !== "connected") {
                logTelemetry("tengu_at_mention_mcp_resource_error", {});
                return null;
            }

            // Find resource metadata
            let resourceMeta = (sessionContext.options.mcpResources?.[serverName] || [])
                .find(r => r.uri === resourceUri);
            if (!resourceMeta) {
                logTelemetry("tengu_at_mention_mcp_resource_error", {});
                return null;
            }

            try {
                // Fetch resource content
                let content = await client.client.readResource({
                    uri: resourceUri
                });

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
// Location: chunks.173.mjs:1000-1034
// ============================================

// ORIGINAL (for source lookup):
case "mcp_resource": {
    let K = A.content;
    if (!K || !K.contents || K.contents.length === 0) return _9([c6({
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
                let w = "mimeType" in z ? String(z.mimeType) : "application/octet-stream";
                Y.push({
                    type: "text",
                    text: `[Binary content: ${w}]`
                })
            }
        } if (Y.length > 0) return _9([c6({
        content: Y,
        isMeta: !0
    })]);
    else return SA(A.server, `No displayable content found in MCP resource ${A.uri}.`), _9([c6({
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
    // Empty history = send ultramemory
    if (!messages || messages.length === 0) return true;

    // Get token count since last ultramemory
    let tokenCount = countTokensSinceUltramemory(messages);

    // No previous ultramemory = send ultramemory
    if (tokenCount === null) return true;

    // Send if token count exceeds cooldown threshold
    return tokenCount >= ULTRAMEMORY_CONSTANTS.TOKEN_COOLDOWN;
}

// Mapping: MIY→shouldSendUltramemoryAttachment, A→messages, q→tokenCount, jIY→countTokensSinceUltramemory, QhY→ULTRAMEMORY_CONSTANTS
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - ultramemory case
// Location: chunks.173.mjs:914-918
// ============================================

// ORIGINAL (for source lookup):
case "ultramemory":
    return _9([c6({
        content: A.content,
        isMeta: !0
    })]);
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
// Location: chunks.173.mjs:878-879
// ============================================

// ORIGINAL (for source lookup):
case "dynamic_skill":
    return [];

// READABLE (for understanding):
case "dynamic_skill":
    return [];  // Silent - triggers skill listing refresh
```

### Key Insight

`dynamic_skill` is a **silent type** - it doesn't produce API messages. Instead, it triggers the skill discovery mechanism to refresh the skill listing.

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
    // Parse @agent-{type} mentions from message
    let agentMentions = parseAgentMentions(userMessage);
    if (agentMentions.length === 0) return [];

    return agentMentions.map(mention => {
        // Extract agent type from "agent-{type}"
        let agentType = mention.replace("agent-", "");

        // Find matching agent
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
// Location: chunks.173.mjs:1035-1039
// ============================================

// ORIGINAL (for source lookup):
case "agent_mention":
    return _9([c6({
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

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:

- `getSkillListingAttachment` (OIY) - Skill listing producer, `chunks.142.mjs:2381-2395`
- `getNestedMemoryAttachments` (HIY) - Nested memory producer, `chunks.142.mjs:2337-2348`
- `loadNestedMemory` (ri4) - Memory loader, `chunks.142.mjs:2163-2187`
- `extractMcpResources` (zIY) - MCP resource extractor, `chunks.142.mjs:2252-2283`
- `getDynamicSkillAttachments` ($IY) - Dynamic skill producer, `chunks.142.mjs:2350-2375`
- `getAgentMentionAttachment` (YIY) - Agent mention extractor, `chunks.142.mjs:2238-2250`
- `parseAgentMentions` (XIY) - Agent mention parser, `chunks.142.mjs:2237` (implied)
- `shouldSendUltramemoryAttachment` (MIY) - Ultramemory cooldown check, `chunks.142.mjs:2456-2461`
- `countTokensSinceUltramemory` (jIY) - Token counter, `chunks.142.mjs:2442-2454`
- `clearSkillCache` (rd) - Clear sent skills set, `chunks.142.mjs:2377-2379`
- `sentSkillsSet` (xg1) - Set of sent skill names
- `ULTRAMEMORY_CONSTANTS` (QhY) - Configuration constants

---

## Related Documents

- [README.md](./README.md) - Documentation index
- [implementation_details.md](./implementation_details.md) - Core implementation
- [types_silent.md](./types_silent.md) - Silent types including dynamic_skill