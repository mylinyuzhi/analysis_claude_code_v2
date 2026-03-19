# Skill Context Modifier (Claude Code 2.1.76)

## Overview

When a skill is invoked via the Skill tool, it can modify the execution context of subsequent LLM interactions. This document details how skills inject `allowedTools`, override models, limit thinking tokens, and register hooks that persist for the session.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill System section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `SkillTool.call` (m66) - Main entry point returning contextModifier - chunks.137.mjs:46-274
- `validateSkillProperties` ($kY) - Check safe skill properties - chunks.136.mjs:2516
- `SKILL_PROPERTY_KEYS` (OkY) - Set of safe properties - chunks.137.mjs:274
- `registerSkillHooks` (gc4) - Register hooks from skill - chunks.133.mjs:862
- `skillInputSchema` (_kY) - Zod schema for skill tool input - chunks.137.mjs:27-30
- `addSessionHook` - Add hook to session state (see [11_hooks/implementation.md](../11_hooks/implementation.md))

---

## Context Modification Overview

### What Context Modification Means

When a skill is invoked inline (not forked), it returns a `contextModifier` function that transforms the tool use context for subsequent operations:

```javascript
// Return structure from SkillTool.call
{
    data: { success: true, commandName, allowedTools, model },
    newMessages: [...],           // Messages to add to conversation
    contextModifier: (ctx) => ctx  // Function to modify execution context
}
```

### Three Types of Context Modification

| Modification | Frontmatter Key | Effect |
|--------------|-----------------|--------|
| **allowedTools** | `allowed-tools:` | Grants permission for specified tools |
| **model** | `model:` | Overrides the LLM model for subsequent responses |
| **maxThinkingTokens** | (internal) | Limits extended thinking token budget |
| **hooks** | `hooks:` | Registers lifecycle event handlers |

---

## allowedTools Injection

### How It Works

The `allowed-tools:` frontmatter allows skills to grant themselves access to specific tools without requiring user permission for each tool use.

```
---
description: Commit changes
allowed-tools: Bash Edit Write
---

Create a git commit with the staged changes...
```

### Implementation

```javascript
// ============================================
// allowedTools contextModifier implementation
// From SkillTool.call (chunks.132.mjs:985-1015)
// ============================================

// READABLE (for understanding):
function createAllowedToolsModifier(allowedTools, originalContext) {
    return (ctx) => {
        if (!allowedTools || allowedTools.length === 0) {
            return ctx;  // No modification needed
        }

        return {
            ...ctx,
            async getAppState() {
                let state = await ctx.getAppState();

                // Merge allowedTools into the alwaysAllowRules
                return {
                    ...state,
                    toolPermissionContext: {
                        ...state.toolPermissionContext,
                        alwaysAllowRules: {
                            ...state.toolPermissionContext.alwaysAllowRules,
                            command: [
                                ...new Set([
                                    ...(state.toolPermissionContext.alwaysAllowRules.command || []),
                                    ...allowedTools
                                ])
                            ]
                        }
                    }
                };
            }
        };
    };
}
```

### Why This Design

**Security consideration:** Skills with `allowedTools` are NOT auto-allowed in the permission check because they grant additional tool access. The user must explicitly approve the skill, which implicitly approves the tool whitelist.

```javascript
// From validateSkillProperties ($kY)
// Skills with allowedTools require user confirmation
const SKILL_PROPERTY_KEYS = new Set([
    "type", "name", "description", ...
    // NOTE: "allowedTools" is NOT in this set
]);
```

### Example: Bash-Only Skill

```
---
description: Run tests
allowed-tools: Bash
---

Execute the test suite using:
!`npm test`
```

When invoked, this skill:
1. Requests user permission (because it has `allowedTools`)
2. On approval, grants Bash tool access for the skill's shell expansion
3. The LLM can subsequently use Bash without additional permission prompts

---

## Model Override

### How It Works

The `model:` frontmatter allows skills to switch to a specific model for their execution.

```
---
description: Deep analysis
model: claude-opus-4-6
---

Perform a deep analysis of the codebase...
```

### Implementation

```javascript
// ============================================
// Model override contextModifier implementation
// From SkillTool.call (chunks.132.mjs:1018-1025)
// ============================================

// READABLE (for understanding):
function createModelModifier(model, originalContext) {
    return (ctx) => {
        if (!model) {
            return ctx;  // No model override
        }

        return {
            ...ctx,
            options: {
                ...ctx.options,
                mainLoopModel: model
            }
        };
    };
}
```

### Model Resolution

The `model:` value is resolved via `resolveModelConfig` (t9):

```javascript
// From createSkillObject
let model = frontmatter.model === "inherit"
    ? undefined  // Explicitly use session model
    : frontmatter.model
        ? resolveModelConfig(frontmatter.model)  // Look up model config
        : undefined;  // No override
```

### Special Value: "inherit"

```
---
model: inherit
---
```

The value `"inherit"` explicitly means "do NOT override the model." This is useful when you want to be explicit about using the session's current model.

### Use Cases

| Model | Use Case |
|-------|----------|
| `claude-opus-4-6` | Complex reasoning tasks requiring maximum capability |
| `claude-sonnet-4-6` | Balanced performance for most tasks |
| `claude-haiku-4-5` | Fast, lightweight operations |
| `inherit` | Explicitly use whatever model the session is using |

---

## Thinking Tokens Limit

### How It Works

Skills can limit the extended thinking token budget for cost control or performance reasons.

### Implementation

```javascript
// ============================================
// Thinking tokens contextModifier implementation
// From SkillTool.call (chunks.132.mjs:1027-1033)
// ============================================

// READABLE (for understanding):
function createThinkingTokensModifier(maxThinkingTokens, originalContext) {
    return (ctx) => {
        if (maxThinkingTokens === undefined) {
            return ctx;
        }

        return {
            ...ctx,
            options: {
                ...ctx.options,
                maxThinkingTokens: maxThinkingTokens
            }
        };
    };
}
```

### Combined Context Modifier

All three modifications are combined in the actual implementation:

```javascript
// ============================================
// Complete contextModifier from SkillTool.call
// Location: chunks.132.mjs:985-1040
// ============================================

// READABLE (for understanding):
contextModifier(ctx) {
    // Apply allowedTools restriction
    if (allowedTools.length > 0) {
        ctx = {
            ...ctx,
            async getAppState() {
                let state = await ctx.getAppState();
                return {
                    ...state,
                    toolPermissionContext: {
                        ...state.toolPermissionContext,
                        alwaysAllowRules: {
                            ...state.toolPermissionContext.alwaysAllowRules,
                            command: [...new Set([
                                ...(state.toolPermissionContext.alwaysAllowRules.command || []),
                                ...allowedTools
                            ])]
                        }
                    }
                };
            }
        };
    }

    // Apply model override
    if (model) {
        ctx = {
            ...ctx,
            options: { ...ctx.options, mainLoopModel: model }
        };
    }

    // Apply thinking tokens limit
    if (maxThinkingTokens !== undefined) {
        ctx = {
            ...ctx,
            options: { ...ctx.options, maxThinkingTokens: maxThinkingTokens }
        };
    }

    return ctx;
}
```

---

## Hook Registration

### How It Works

Skills can define hooks in their frontmatter that are registered when the skill is invoked. Hooks persist for the duration of the session, providing ongoing behavior modification even after the skill's primary task completes.

```
---
hooks:
  PreToolUse:
    - match: Bash
      command: ./check-command.sh
  PostToolUse:
    - match: Write
      agent: review-agent
---

When Bash is used, run the validation script...
```

### Implementation

```javascript
// ============================================
// registerSkillHooks - Registers hooks from a skill definition
// Location: chunks.133.mjs:862-876
// ============================================

// ORIGINAL (for source lookup):
function gc4(A, q, K, Y, z) {
    let _ = 0;
    for (let w of Fu) {
        let O = K[w];
        if (!O) continue;
        for (let $ of O)
            for (let H of $.hooks) {
                let j = H.once ? () => {
                    k(`Removing one-shot hook for event ${w} in skill '${Y}'`), l24(A, q, w, H)
                } : void 0;
                JW1(A, q, w, $.matcher || "", H, j, z), _++
            }
    }
    if (_ > 0) k(`Registered ${_} hooks from skill '${Y}'`)
}

// READABLE (for understanding):
function registerSkillHooks(setAppState, sessionId, hooks, skillName, skillRoot) {
    let hookCount = 0;
    for (let eventType of HOOK_EVENT_NAMES) {
        const hookConfigs = hooks[eventType];
        if (!hookConfigs) continue;

        for (let config of hookConfigs) {
            for (let hookDef of config.hooks) {
                // Handle one-shot hooks that auto-remove after first execution
                let onSuccess = hookDef.once ? () => {
                    log(`Removing one-shot hook for event ${eventType} in skill '${skillName}'`);
                    removeSessionHook(setAppState, sessionId, eventType, hookDef);
                } : undefined;

                addSkillHook(
                    setAppState,
                    sessionId,
                    eventType,
                    config.matcher || "",
                    hookDef,
                    onSuccess,
                    skillRoot
                );
                hookCount++;
            }
        }
    }
    if (hookCount > 0) {
        log(`Registered ${hookCount} hooks from skill '${skillName}'`);
    }
}

// Mapping: gc4→registerSkillHooks, A→setAppState, q→sessionId, K→hooks, Y→skillName, z→skillRoot,
// Fu→HOOK_EVENT_NAMES, JW1→addSkillHook, l24→removeSessionHook, k→log
```

### Registration Flow

```
SkillTool.call() executes
       │
       ├── Skill has hooks defined?
       │   │
       │   └── Yes → registerSkillHooks(gc4) called
       │              │
       │              ├── For each event type in hooks
       │              │   ├── Extract matcher pattern
       │              │   ├── Extract hook configuration
       │              │   ├── Handle one-shot hooks (once: true)
       │              │   └── Add to sessionHooks state via JW1(addSkillHook)
       │              │
       │              └── Hooks active for rest of session
       │
       └── No → Continue without hook registration
```

### When Hooks Are Registered

Hooks are registered when:
1. **SkillTool.call()** completes successfully (not on validation failure)
2. Skill has `hooks:` frontmatter defined
3. Skill type is `"prompt"` (not `local`/`local-jsx`)

> **Note:** Hooks persist for the session even after the skill's primary task completes. This is by design - hooks provide ongoing behavior modification.

### Hook Types and Usage Scenarios

| Hook Type | When Triggered | Use Case |
|-----------|----------------|----------|
| `PreToolUse` | Before tool execution | Validation, input modification, security policies |
| `PostToolUse` | After successful tool | Logging, cleanup, auditing |
| `PostToolUseFailure` | After failed tool | Error handling, notification |
| `SessionStart` | Session begins | Initialization, environment setup |
| `SessionEnd` | Session ends | Cleanup, resource release |
| `SubagentStart` | Subagent spawns | Workflow automation, monitoring |
| `SubagentStop` | Subagent completes | Result tracking, cleanup |

### Complete Hook Documentation

> **For comprehensive hook system documentation**, see [11_hooks/implementation.md](../11_hooks/implementation.md) which covers:
> - All hook types and their parameters
> - Hook execution pipeline
> - Matcher syntax and patterns
> - Timeout and error handling
> - Hook events catalog

---

## Permission Implications

### Safe vs Unsafe Properties

The `validateSkillProperties` ($kY) function determines if a skill can be auto-allowed:

```javascript
// ============================================
// validateSkillProperties - Check safe properties
// Location: chunks.136.mjs:2516-2530
// ============================================

// READABLE (for understanding):
function validateSkillProperties(skill) {
    for (let key of Object.keys(skill)) {
        // Skip if key is in allowed set
        if (SKILL_PROPERTY_KEYS.has(key)) continue;

        let value = skill[key];

        // Ignore empty/null/undefined values
        if (value === undefined || value === null) continue;
        if (Array.isArray(value) && value.length === 0) continue;
        if (typeof value === "object" && Object.keys(value).length === 0) continue;

        // Found a non-allowed property with a value
        return false;
    }
    return true;
}
```

### Properties That Require Permission

| Property | Why It Requires Permission |
|----------|---------------------------|
| `allowedTools` | Grants additional tool access |
| `hooks` | Can execute arbitrary code on events |
| `context: "fork"` | Spawns a subagent (resource usage) |

### Properties That Are Auto-Allowed

```javascript
// ============================================
// SKILL_PROPERTY_KEYS - Safe properties set
// Location: chunks.137.mjs:274
// ============================================

const SKILL_PROPERTY_KEYS = new Set([
    // Core identity
    "type", "name", "description", "version", "userFacingName",

    // Execution flags (don't grant additional access)
    "userInvocable", "isEnabled", "isHidden", "disableModelInvocation",

    // Context hints (user-visible, not security-sensitive)
    "context", "agent", "model", "source", "skillRoot", "loadedFrom",

    // Prompt generation (read-only)
    "getPromptForCommand", "progressMessage", "contentLength",
    "argNames", "argumentHint", "whenToUse", "frontmatterKeys",

    // Discovery metadata
    "aliases", "isMcp", "hasUserSpecifiedDescription",

    // Plugin integration (metadata only)
    "pluginInfo"
]);
```

---

## Forked vs Inline Execution

### Context Modification Only Applies to Inline

When `context: "fork"` is set, the skill runs in an isolated subagent:

```javascript
// Forked execution - no contextModifier
if (skillDefinition.context === "fork") {
    return await executeForkedSkill(
        skillDefinition,
        skillName,
        args,
        toolUseContext,
        /* ... */
    );
    // Returns { data: { success, commandName, status: "forked", agentId, result } }
    // No contextModifier - isolation is the point
}
```

### Inline Execution with ContextModifier

```javascript
// Inline execution - returns contextModifier
let result = await handlePromptCommandFromTool(...);

return {
    data: {
        success: true,
        commandName: skillName,
        allowedTools: allowedTools.length > 0 ? allowedTools : undefined,
        model: model
    },
    newMessages: result.messages,
    contextModifier(ctx) {
        // Apply modifications...
        return ctx;
    }
};
```

---

## Summary

The context modifier system enables skills to:

1. **Grant tool access** via `allowed-tools:` frontmatter
2. **Switch models** via `model:` frontmatter
3. **Limit thinking** via internal configuration
4. **Register hooks** via `hooks:` frontmatter

The permission system ensures that skills with context-modifying capabilities require explicit user approval, while skills that only provide prompts are auto-allowed for smoother UX.