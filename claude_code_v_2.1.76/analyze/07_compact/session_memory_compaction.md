# Session Memory Compaction

## Overview

Session Memory Compaction is a specialized compaction path in Claude Code v2.1.38 that differs fundamentally from the standard "conversation summary" compaction. Rather than using the LLM to generate a new summary of the conversation, session memory compaction leverages an existing **session notes file** (a structured Markdown document maintained throughout the session) as the post-compaction context. This approach is faster, cheaper (no LLM call for summarization), and preserves a richer, human-curated representation of what happened.

The session memory system is gated behind feature flags (`tengu_session_memory` and `tengu_sm_compact`) and an environment variable override (`ENABLE_CLAUDE_CODE_SM_COMPACT`). When enabled, it takes priority over the standard compaction path in `autoCompactDispatcher`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `performSessionMemoryCompaction` (vZ6) - Main entry point for session-memory-based compaction
- `createCompactionSummaryMessage` (imY) - Builds the compaction result from session notes
- `isSessionMemoryCompactEnabled` (TZ6) - Feature flag check for SM compaction
- `findCompactionBoundary` (lmY) - Determines where to split messages for keeping
- `adjustBoundaryForToolUseConsistency` (pCA) - Ensures tool_use/tool_result pairs are not split
- `parseSessionSections` (SmY) - Parses session notes into per-section token counts
- `buildOversizedWarning` (hmY) - Generates warnings when sections exceed limits
- `buildSessionMemoryPrompt` (Js4) - Constructs the prompt for session memory updates
- `isEmptyTemplate` (_s4) - Checks if session notes are still the unmodified template
- `truncateSections` (Xs4) - Truncates oversized sections to fit within limits
- `loadCustomTemplate` (BCA) - Loads user-customized session memory template
- `loadCustomPrompt` (CmY) - Loads user-customized session memory update prompt
- `loadSmCompactConfig` (pmY) - Loads feature-flag-driven configuration thresholds
- `SESSION_NOTES_TEMPLATE` (RmY) - Default template for session notes
- `SECTION_TOKEN_LIMIT` (WZ6) - Per-section token limit (2000)
- `TOTAL_TOKEN_LIMIT` (Hs4) - Total session notes token limit (12000)
- `SM_COMPACT_CONFIG_DEFAULTS` (NZ6) - Default config: minTokens=10000, minTextBlockMessages=5, maxTokens=40000
- `autoCompactDispatcher` (fs4) - Top-level auto-compaction orchestrator that calls SM compaction first

---

## Architecture: Session Memory vs. Conversation Compaction

### Two Compaction Paths

```
autoCompactDispatcher (fs4)
├── Path 1: Session Memory Compaction (vZ6) ← THIS DOCUMENT
│   ├── Uses existing session notes file as summary
│   ├── No LLM summarization call needed
│   ├── Faster and cheaper
│   └── Returns null if not available → falls through to Path 2
│
└── Path 2: Standard Conversation Compaction (AW1 / performFullCompaction)
    ├── Uses LLM to generate conversation summary
    ├── Requires streaming API call
    └── More expensive but always available
```

### Why Two Paths?

**Design rationale:** The standard compaction path calls the LLM to summarize the conversation, which costs tokens and introduces latency. Session memory compaction exploits the fact that a well-maintained session notes file already contains the critical context in a compact form. By reusing this existing artifact, the system avoids a redundant summarization call.

**Key insight:** Session notes are maintained incrementally throughout the session by a separate background process (using the Edit tool). This means at compaction time, the notes are already up-to-date and represent a curated distillation of the conversation - often better quality than what a single-shot summary would produce.

---

## The Session Notes File

### Default Template Structure

The session notes file follows a structured Markdown template with 9 sections:

```markdown
# Session Title
_A short and distinctive 5-10 word descriptive title for the session_

# Current State
_What is actively being worked on right now?_

# Task specification
_What did the user ask to build?_

# Files and Functions
_What are the important files?_

# Workflow
_What bash commands are usually run?_

# Errors & Corrections
_Errors encountered and how they were fixed_

# Codebase and System Documentation
_Important system components_

# Learnings
_What has worked well? What has not?_

# Key results
_Specific output such as answers, tables, documents_

# Worklog
_Step by step, what was attempted, done?_
```

### Constraints

- **Per-section limit:** 2000 tokens (`WZ6 = 2000`)
- **Total file limit:** 12000 tokens (`Hs4 = 12000`)
- **Storage location:** `<config_dir>/session-memory/config/template.md` (customizable)
- **Prompt location:** `<config_dir>/session-memory/config/prompt.md` (customizable)

### Custom Templates

Users can override both the template and the update prompt:

```javascript
// ============================================
// loadCustomTemplate - Loads user-customized session memory template
// Location: chunks.147.mjs:43-53 (Ln 374161)
// ============================================

// ORIGINAL (for source lookup):
async function BCA() {
    let A = b1(),
        q = Os4(O8(), "session-memory", "config", "template.md");
    if (A.existsSync(q)) try {
        return A.readFileSync(q, { encoding: "utf-8" })
    } catch (K) { K1(K instanceof Error ? K : Error(`...`)) }
    return RmY
}

// READABLE (for understanding):
async function loadCustomTemplate() {
    let fs = getFileSystem(),
        templatePath = pathJoin(getConfigDir(), "session-memory", "config", "template.md");
    if (fs.existsSync(templatePath)) try {
        return fs.readFileSync(templatePath, { encoding: "utf-8" })
    } catch (err) { logError(err instanceof Error ? err : Error(`...`)) }
    return SESSION_NOTES_TEMPLATE  // fallback to default
}

// Mapping: BCA→loadCustomTemplate, A→fs, q→templatePath, K→err, RmY→SESSION_NOTES_TEMPLATE
```

---

## The performSessionMemoryCompaction Algorithm

### Entry Point

```javascript
// ============================================
// performSessionMemoryCompaction - Main session-memory compaction path
// Location: chunks.147.mjs:651-683 (Ln 374742)
// ============================================

// ORIGINAL (for source lookup):
async function vZ6(A, q, K) {
    if (!TZ6()) return null;
    await pmY(), await sa4();
    let Y = ra4(), z = PZ6();
    if (!z) return c("tengu_sm_compact_no_session_memory", {}), null;
    if (await _s4(z)) return c("tengu_sm_compact_empty_template", {}), null;
    try {
        let w;
        if (Y) {
            if (w = A.findIndex((j) => j.uuid === Y), w === -1) return null
        } else w = A.length - 1;
        let H = lmY(A, w),
            $ = A.slice(H).filter((j) => !cR(j)),
            O = await PP("compact", { model: l3() }),
            _ = a$(U6()),
            J = imY(A, z, $, O, _, q),
            X = qt(J), D = PU1(X);
        if (K !== void 0 && D >= K) return null;
        return { ...J, postCompactTokenCount: D }
    } catch (w) { return null }
}

// READABLE (for understanding):
async function performSessionMemoryCompaction(messages, agentId, autoCompactThreshold) {
    if (!isSessionMemoryCompactEnabled()) return null;
    await loadSmCompactConfig();
    await loadSessionState();
    let lastSummarizedMessageId = getLastSummarizedMessageId();
    let sessionNotesContent = getSessionNotesContent();
    if (!sessionNotesContent) return null;  // no session notes file
    if (await isEmptyTemplate(sessionNotesContent)) return null;  // notes never updated
    try {
        let anchorIndex;
        if (lastSummarizedMessageId) {
            anchorIndex = messages.findIndex(m => m.uuid === lastSummarizedMessageId);
            if (anchorIndex === -1) return null;
        } else {
            anchorIndex = messages.length - 1;  // resumed session
        }
        let boundaryIndex = findCompactionBoundary(messages, anchorIndex);
        let messagesToKeep = messages.slice(boundaryIndex).filter(m => !isCompactionBoundary(m));
        let hookResults = await executePreCompactHooks("compact", { model: getMainModel() });
        let planAttachment = collectPlanToKeep(agentId);
        let result = createCompactionSummaryMessage(messages, sessionNotesContent, messagesToKeep, hookResults, planAttachment, agentId);
        let allMessages = assembleMessages(result);
        let postCompactTokens = estimateTokenCount(allMessages);
        if (autoCompactThreshold !== undefined && postCompactTokens >= autoCompactThreshold) return null;
        return { ...result, postCompactTokenCount: postCompactTokens };
    } catch (err) { return null; }
}

// Mapping: vZ6→performSessionMemoryCompaction, A→messages, q→agentId, K→autoCompactThreshold,
//   TZ6→isSessionMemoryCompactEnabled, pmY→loadSmCompactConfig, sa4→loadSessionState,
//   Y→lastSummarizedMessageId, ra4→getLastSummarizedMessageId, z→sessionNotesContent,
//   PZ6→getSessionNotesContent, _s4→isEmptyTemplate, H→boundaryIndex, lmY→findCompactionBoundary,
//   $→messagesToKeep, O→hookResults, PP→executePreCompactHooks, _→planAttachment, a$→collectPlanToKeep,
//   J→result, imY→createCompactionSummaryMessage, X→allMessages, qt→assembleMessages, D→postCompactTokens,
//   PU1→estimateTokenCount
```

### Step-by-Step Explanation

1. **Feature gate check:** Verifies `tengu_session_memory` AND `tengu_sm_compact` flags are enabled (or env override is set).

2. **Configuration loading:** Loads remote config for compaction thresholds (minTokens, minTextBlockMessages, maxTokens). These determine how aggressively the system keeps messages.

3. **Session notes validation:** Reads the current session notes content. Returns null if the notes file does not exist or if it is still the unmodified template (meaning no useful context has been captured yet).

4. **Anchor point determination:** Finds the message that was last summarized. For resumed sessions (no prior summarization), uses the last message as the anchor.

5. **Boundary calculation:** The `findCompactionBoundary` algorithm (detailed below) determines which messages to keep after compaction.

6. **Hook execution:** Runs `PreCompact` hooks to allow user-defined scripts to inject custom instructions.

7. **Summary assembly:** Creates the compaction result using the session notes content (not an LLM-generated summary).

8. **Threshold check:** If the post-compaction token count would exceed the auto-compact threshold, abandons the attempt (falls through to standard compaction).

---

## The findCompactionBoundary Algorithm

### Purpose

Given a message array and an anchor point, determine the optimal split point: messages before the boundary get discarded, messages after are kept.

```javascript
// ============================================
// findCompactionBoundary - Determines which messages to keep
// Location: chunks.147.mjs:590-610 (Ln 374682)
// ============================================

// ORIGINAL (for source lookup):
function lmY(A, q) {
    if (A.length === 0) return 0;
    let K = UmY(), Y = q >= 0 ? q + 1 : A.length, z = 0, w = 0;
    for (let H = Y; H < A.length; H++) {
        let $ = A[H];
        if (z += PU1([$]), Zs4($)) w++
    }
    if (z >= K.maxTokens) return pCA(A, Y);
    if (z >= K.minTokens && w >= K.minTextBlockMessages) return pCA(A, Y);
    for (let H = Y - 1; H >= 0; H--) {
        let $ = A[H], O = PU1([$]);
        if (z += O, Zs4($)) w++;
        if (Y = H, z >= K.maxTokens) break;
        if (z >= K.minTokens && w >= K.minTextBlockMessages) break
    }
    return pCA(A, Y)
}

// READABLE (for understanding):
function findCompactionBoundary(messages, anchorIndex) {
    if (messages.length === 0) return 0;
    let config = getSmCompactConfig();  // { minTokens: 10000, minTextBlockMessages: 5, maxTokens: 40000 }
    let startIndex = anchorIndex >= 0 ? anchorIndex + 1 : messages.length;
    let totalTokens = 0, textBlockCount = 0;

    // Phase 1: Count tokens in messages AFTER the anchor
    for (let i = startIndex; i < messages.length; i++) {
        totalTokens += estimateTokenCount([messages[i]]);
        if (hasTextContent(messages[i])) textBlockCount++;
    }

    // If already enough content after anchor, use anchor as boundary
    if (totalTokens >= config.maxTokens) return adjustBoundary(messages, startIndex);
    if (totalTokens >= config.minTokens && textBlockCount >= config.minTextBlockMessages)
        return adjustBoundary(messages, startIndex);

    // Phase 2: Walk backward from anchor, adding messages until thresholds met
    for (let i = startIndex - 1; i >= 0; i--) {
        totalTokens += estimateTokenCount([messages[i]]);
        if (hasTextContent(messages[i])) textBlockCount++;
        startIndex = i;
        if (totalTokens >= config.maxTokens) break;
        if (totalTokens >= config.minTokens && textBlockCount >= config.minTextBlockMessages) break;
    }

    return adjustBoundary(messages, startIndex);
}

// Mapping: lmY→findCompactionBoundary, A→messages, q→anchorIndex, K→config, UmY→getSmCompactConfig,
//   Y→startIndex, z→totalTokens, w→textBlockCount, PU1→estimateTokenCount, Zs4→hasTextContent,
//   pCA→adjustBoundaryForToolUseConsistency
```

### Algorithm Design Rationale

**Two-phase approach:**
1. First, count what is already past the anchor (messages added since last summarization). If this alone exceeds the thresholds, the boundary is at the anchor.
2. If not enough content exists past the anchor, walk backwards to include older messages until either `maxTokens` (40,000) or the combined `minTokens` (10,000) + `minTextBlockMessages` (5) thresholds are met.

**Why these thresholds?**
- `minTokens: 10000` ensures enough context is kept for the model to be useful.
- `minTextBlockMessages: 5` ensures at least 5 meaningful text exchanges are preserved (not just tool results).
- `maxTokens: 40000` caps how much is kept to prevent the compacted context from being too large.

**The adjustBoundary step** (`pCA`) is critical: it ensures the boundary does not split a `tool_use`/`tool_result` pair. If a user message contains `tool_result` blocks whose corresponding `tool_use` blocks are before the boundary, the boundary is moved back to include those `tool_use` messages. This prevents dangling references in the post-compaction context.

---

## Section Truncation and Oversized Warnings

When session notes are used as the compaction summary, they may themselves be too large. The system handles this in two ways:

### Truncation

```javascript
// ============================================
// truncateSections - Truncates oversized sections within session notes
// Location: chunks.147.mjs:130-149 (Ln 374245)
// ============================================

// READABLE (for understanding):
function truncateSections(notesContent) {
    let lines = notesContent.split("\n");
    let charLimit = SECTION_TOKEN_LIMIT * 4;  // ~8000 chars per section
    let result = [], currentHeader = "", currentLines = [];
    let wasTruncated = false;

    for (let line of lines) {
        if (line.startsWith("# ")) {
            let { lines: processed, wasTruncated: t } = truncateSection(currentHeader, currentLines, charLimit);
            result.push(...processed);
            wasTruncated = wasTruncated || t;
            currentHeader = line; currentLines = [];
        } else currentLines.push(line);
    }
    // process last section
    let last = truncateSection(currentHeader, currentLines, charLimit);
    result.push(...last.lines);

    return { truncatedContent: result.join("\n"), wasTruncated: wasTruncated || last.wasTruncated };
}
```

If any section is truncated, a note is appended pointing the model to the full session memory file path.

### Oversized Warnings

The `buildOversizedWarning` function (`hmY`) generates warnings that are appended to the session memory update prompt when sections exceed limits:

- **Per-section warning:** Lists sections exceeding 2000 tokens with their current token count.
- **Total file critical warning:** If total exceeds 12000 tokens, instructs aggressive condensation prioritizing "Current State" and "Errors & Corrections".

---

## Integration with autoCompactDispatcher

### How Session Memory Compaction Fits into Auto-Compaction

```javascript
// ============================================
// autoCompactDispatcher - Top-level compaction orchestrator
// Location: chunks.147.mjs:778-803 (Ln 374861)
// ============================================

// READABLE (for understanding):
async function autoCompactDispatcher(messages, sessionContext, sessionMemoryType) {
    if (parseBoolean(process.env.DISABLE_COMPACT)) return { wasCompacted: false };
    let model = sessionContext.options.mainLoopModel;
    if (!await shouldAutoCompact(messages, model, sessionMemoryType)) return { wasCompacted: false };

    // Try session memory compaction FIRST
    let smResult = await performSessionMemoryCompaction(messages, sessionContext.agentId, getAutoCompactThreshold(model));
    if (smResult) {
        clearCachedPromptPrefix(undefined);
        return { wasCompacted: true, compactionResult: smResult };
    }

    // Fall back to standard LLM-based compaction
    try {
        let standardResult = await performFullCompaction(messages, sessionContext, ...);
        clearCachedPromptPrefix(undefined);
        return { wasCompacted: true, compactionResult: standardResult };
    } catch (err) {
        return { wasCompacted: false };
    }
}
```

**Key insight:** Session memory compaction is the preferred path. It only falls through to the standard LLM-based compaction when:
1. The feature is disabled (flags off)
2. No session notes exist or they are empty
3. The post-compaction size would still exceed the auto-compact threshold
4. An error occurs

---

## Integration with "Summarize from Here"

The "Summarize from Here" (partial compaction) feature uses `performPartialCompaction` (`Fa4`), which is a **separate path** from session memory compaction. It always uses the LLM to summarize, because:

1. The user explicitly selected a message as the split point
2. The user may have provided custom context for what to focus on
3. It needs to produce a targeted summary of specific messages, not reuse generic session notes

However, after partial compaction completes, it preserves session-relevant attachments including:
- `collectFilesToKeep` - Recently read files
- `collectTasksToKeep` - Active background task statuses
- `collectPlanToKeep` - Current plan file reference
- `collectSkillsToKeep` - Invoked skill contents
- `collectTodosToKeep` - Active todo items

These same collectors are also used during session memory compaction to ensure critical context survives regardless of which compaction path is taken.

---

## Microcompaction: A Third Path

In addition to the two main compaction strategies, there is a "microcompaction" system (`gm`) that runs before either compaction path. Microcompaction does not summarize the conversation; instead it:

1. Replaces large tool results with file references (saving them to disk)
2. Replaces images from completed user-assistant exchanges with `[image]` placeholders
3. Operates incrementally on individual tool results rather than the entire conversation

This is a lightweight, always-on optimization that reduces token pressure without losing information (the full tool results can be re-read from disk via the FileRead tool).

---

## Session Memory Update Prompt

The prompt used to instruct the model to update session notes is carefully crafted:

```
IMPORTANT: This message and these instructions are NOT part of the actual user conversation.
Do NOT include any references to "note-taking" or "session notes extraction" in the notes content.

Based on the user conversation above, update the session notes file.
The file {{notesPath}} has already been read for you.

CRITICAL RULES FOR EDITING:
- Maintain exact structure with all sections, headers, and italic descriptions intact
- NEVER modify section headers or italic description lines
- ONLY update actual content BELOW the italic descriptions
- Write DETAILED, INFO-DENSE content including file paths, function names, error messages
- Keep each section under ~2000 tokens
- IMPORTANT: Always update "Current State" to reflect the most recent work
```

**Why this design:** The prompt explicitly separates the template structure (headers + italic descriptions) from the content. This ensures the session notes file always maintains its structured format, making it reliable for programmatic parsing and section-level truncation.
