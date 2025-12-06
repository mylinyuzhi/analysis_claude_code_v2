# Compact System Implementation

## Overview

The Compact system in Claude Code manages conversation summarization and context window optimization. It allows long conversations to be compressed into summaries while preserving important context, preventing context overflow and maintaining conversation continuity.

## /compact Command Implementation

### Manual Compaction Function

**From chunks.107.mjs:1120-1237:**
```javascript
async function j91(A, Q, B, G, Z = !1) {
  try {
    if (A.length === 0) throw Error(cMA);  // cMA = "Not enough messages to compact."

    let I = ZK(A),  // Get pre-compact token count
        Y = yI2(A),  // Extract metrics
        J = {};

    try {
      J = xI2(Y)  // Process metrics
    } catch (e) {
      AA(e)
    }

    let W = await Q.getAppState();
    P91(W.toolPermissionContext, "summary"),
    Q.setSpinnerColor?.("claudeBlue_FOR_SYSTEM_SPINNER"),
    Q.setSpinnerShimmerColor?.("claudeBlueShimmer_FOR_SYSTEM_SPINNER"),
    Q.setSpinnerMessage?.("Running PreCompact hooks..."),
    Q.setSDKStatus?.("compacting");

    // Run PreCompact hooks
    let X = await FQ0({
      trigger: Z ? "auto" : "manual",
      customInstructions: G ?? null,
      sessionId: Q.agentId
    }, Q.abortController.signal);

    if (X.newCustomInstructions) G = G ? `${G}\n\n${X.newCustomInstructions}` : X.newCustomInstructions;
    let V = X.userDisplayMessage;

    Q.setStreamMode?.("requesting"),
    Q.setResponseLength?.(() => 0),
    Q.setSpinnerMessage?.("Compacting conversation");

    // Create compaction prompt
    let F = R91(G),
        K = R0({
          content: F
        }),
        H = RYA({
          messages: WZ([...nk(A), K]),
          systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."],
          maxThinkingTokens: 0,
          tools: [n8],
          signal: Q.abortController.signal,
          options: {
            async getToolPermissionContext() {
              return (await Q.getAppState()).toolPermissionContext
            },
            model: k3(),  // Small fast model
            toolChoice: void 0,
            isNonInteractiveSession: Q.options.isNonInteractiveSession,
            hasAppendSystemPrompt: Q.options.hasAppendSystemPrompt,
            maxOutputTokensOverride: EkA,
            querySource: "compact",
            agents: Q.options.agentDefinitions.activeAgents,
            mcpTools: [],
            agentIdOrSessionId: e1()
          }
        })[Symbol.asyncIterator]();

    // Process streaming response
    let C = await H.next(),
        E = !1,
        U;

    while (!C.done) {
      let e = C.value;
      if (!E && e.type === "stream_event" && e.event.type === "content_block_start" && e.event.content_block.type === "text")
        E = !0, Q.setStreamMode?.("responding");

      if (e.type === "stream_event" && e.event.type === "content_block_delta" && e.event.delta.type === "text_delta") {
        let l = e.event.delta.text.length;
        Q.setResponseLength?.((k) => k + l)
      }

      if (e.type === "assistant") U = e;
      C = await H.next()
    }

    if (!U) throw Error("Failed to get summary response from streaming");

    let q = ji(U);  // Extract text from assistant message
    if (!q) throw GA("tengu_compact_failed", {
      reason: "no_summary",
      preCompactTokenCount: I
    }), Error("Failed to generate conversation summary - response did not contain valid text content");
    else if (q.startsWith(uV)) throw GA("tengu_compact_failed", {
      reason: "api_error",
      preCompactTokenCount: I
    }), Error(q);
    else if (q.startsWith(OYA)) throw GA("tengu_compact_failed", {
      reason: "prompt_too_long",
      preCompactTokenCount: I
    }), Error(xD5);

    // Restore read file state
    let w = GA2(Q.readFileState);
    Q.readFileState.clear();
    let N = await bD5(w, Q, _D5),
        R = fD5(Q.agentId);  // Get todo list
    if (R) N.push(R);
    let T = XQ0(Q.agentId);  // Get plan file
    if (T) N.push(T);

    Q.setSpinnerMessage?.("Running SessionStart hooks...");
    let y = await wq("compact"),
        v = ZK([U]),  // Post-compact token count
        x = C91(U);   // Compaction usage metrics

    // Log telemetry
    GA("tengu_compact", {
      preCompactTokenCount: I,
      postCompactTokenCount: v,
      compactionInputTokens: x?.input_tokens,
      compactionOutputTokens: x?.output_tokens,
      compactionCacheReadTokens: x?.cache_read_input_tokens ?? 0,
      compactionCacheCreationTokens: x?.cache_creation_input_tokens ?? 0,
      compactionTotalTokens: x ? x.input_tokens + (x.cache_creation_input_tokens ?? 0) + (x.cache_read_input_tokens ?? 0) + x.output_tokens : 0,
      ...J
    });

    let p = S91(Z ? "auto" : "manual", I ?? 0),
        u = [R0({
          content: T91(q, B),
          isCompactSummary: !0,
          isVisibleInTranscriptOnly: !0
        })];

    return {
      boundaryMarker: p,
      summaryMessages: u,
      attachments: N,
      hookResults: y,
      userDisplayMessage: V,
      preCompactTokenCount: I,
      postCompactTokenCount: v,
      compactionUsage: x
    }
  } catch (I) {
    throw vD5(I, Q), I
  } finally {
    Q.setStreamMode?.("requesting"),
    Q.setResponseLength?.(() => 0),
    Q.setSpinnerMessage?.(null),
    Q.setSDKStatus?.(null),
    Q.setSpinnerColor?.(null),
    Q.setSpinnerShimmerColor?.(null)
  }
}
```

**Compaction Process:**
1. Validate messages exist
2. Count pre-compaction tokens
3. Run PreCompact hooks
4. Generate summary using small fast model
5. Restore important context (files, todos, plans)
6. Run SessionStart hooks
7. Create boundary marker and summary messages
8. Log telemetry
9. Return compaction result

### Error Handling

**From chunks.107.mjs:1238-1246:**
```javascript
function vD5(A, Q) {
  if (!GKA(A, pMA) && !GKA(A, cMA))
    Q.addNotification?.({
      key: "error-compacting-conversation",
      text: "Error compacting conversation",
      priority: "immediate",
      color: "error"
    })
}
```

Displays error notification for non-expected errors (skips "prompt too long" and "not enough messages" errors).

## Autocompact Buffer Mechanism

### Autocompact Threshold Check

**From chunks.107.mjs:1694-1706:**
```javascript
function b1A() {
  return N1().autoCompactEnabled
}

async function tD5(A, Q) {
  if (Q === "session_memory") return !1;
  if (!b1A()) return !1;

  let B = ZK(A),  // Get current token count
      {
        isAboveAutoCompactThreshold: G
      } = x1A(B);  // Check if above threshold

  return G
}
```

**Threshold Calculation (chunks.107.mjs:1680-1691):**
```javascript
// x1A function
let G = Math.max(0, Math.round((B - A) / B * 100)),  // Percent left
    Z = B - rD5,  // Warning threshold
    I = B - oD5,  // Error threshold
    Y = A >= Z,   // isAboveWarningThreshold
    J = A >= I,   // isAboveErrorThreshold
    W = b1A() && A >= Q;  // isAboveAutoCompactThreshold

return {
  percentLeft: G,
  isAboveWarningThreshold: Y,
  isAboveErrorThreshold: J,
  isAboveAutoCompactThreshold: W
}
```

### Automatic Compaction Execution

**From chunks.107.mjs:1707-1729:**
```javascript
async function sI2(A, Q, B) {
  if (Y0(process.env.DISABLE_COMPACT)) return {
    wasCompacted: !1
  };

  if (!await tD5(A, B)) return {
    wasCompacted: !1
  };

  let Z = await f91(A, Q.agentId, aI2());  // Try micro-compact first
  if (Z) return {
    wasCompacted: !0,
    compactionResult: Z
  };

  try {
    return {
      wasCompacted: !0,
      compactionResult: await j91(A, Q, !0, void 0, !0)  // Full compact with auto=true
    }
  } catch (I) {
    if (!GKA(I, pMA)) AA(I instanceof Error ? I : Error(String(I)));
    return {
      wasCompacted: !1
    }
  }
}
```

**Autocompact Strategy:**
1. Check if DISABLE_COMPACT env var is set
2. Check if above autocompact threshold
3. Try micro-compaction first (for efficiency)
4. Fall back to full compaction if micro-compact unavailable
5. On error, log and return wasCompacted=false

## Compaction Trigger Conditions

### Manual Trigger

User invokes `/compact` command:
- Calls `j91()` with `Z = !1` (auto = false)
- Optional custom instructions
- User-initiated, not automatic

### Automatic Trigger

System triggers when threshold exceeded:
- Calls `sI2()` which calls `j91()` with `Z = !0` (auto = true)
- No custom instructions
- Happens automatically during conversation

### Threshold Conditions

**From chunks.107.mjs:1634-1640:**
```javascript
if (B !== void 0 && X >= B) return GA("tengu_sm_compact_threshold_exceeded", {
  postCompactTokenCount: X,
  autoCompactThreshold: B
}), null;

return {
  ...J,
  postCompactTokenCount: X
}
```

Compaction is triggered when:
- Token count exceeds autocompact threshold
- Autocompact is enabled in settings
- Not in session_memory mode

## Summary Generation for Compaction

### Compaction Prompt

**From chunks.107.mjs:1143-1151:**
```javascript
let F = R91(G),  // Build compaction prompt with custom instructions
    K = R0({
      content: F
    }),
    H = RYA({
      messages: WZ([...nk(A), K]),
      systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."],
      maxThinkingTokens: 0,
      tools: [n8],  // Compaction tool
      ...
    })
```

**System Prompt:**
```
You are a helpful AI assistant tasked with summarizing conversations.
```

### Complete Summarization Prompt (R91 function)

**Location: chunks.107.mjs:537-733**

This is the FULL prompt template used for conversation compaction:

```javascript
// ============================================
// R91 - Build Compaction Prompt with Custom Instructions
// Location: chunks.107.mjs:537-733
// ============================================
function R91(A) {
  // A = custom instructions parameter (optional)

  if (!A || A.trim() === "") {
    // No custom instructions - return base prompt
    return `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
This summary should be thorough in capturing technical details, code patterns, and architectural decisions that would be essential for continuing development work without losing context.

Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
  - Errors that you ran into and how you fixed them
  - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.

Your summary should include the following sections:

1. Primary Request and Intent: Capture all of the user's explicit requests and intents in detail
2. Key Technical Concepts: List all important technical concepts, technologies, and frameworks discussed.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Pay special attention to the most recent messages and include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List all errors that you ran into, and how you fixed them. Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages that are not tool results. These are critical for understanding the users' feedback and changing intent.
6. Pending Tasks: Outline any pending tasks that you have explicitly been asked to work on.
7. Current Work: Describe in detail precisely what was being worked on immediately before this summary request, paying special attention to the most recent messages from both user and assistant. Include file names and code snippets where applicable.
8. Optional Next Step: List the next step that you will take that is related to the most recent work you were doing. IMPORTANT: ensure that this step is DIRECTLY in line with the user's most recent explicit requests, and the task you were working on immediately before this summary request. If your last task was concluded, then only list next steps if they are explicitly in line with the users request. Do not start on tangential requests or really old requests that were already completed without confirming with the user first.
                       If there is a next step, include direct quotes from the most recent conversation showing exactly what task you were working on and where you left off. This should be verbatim to ensure there's no drift in task interpretation.

Here's an example of how your output should be structured:

<example>
<analysis>
[Your thought process, ensuring all points are covered thoroughly and accurately]
</analysis>

<summary>
1. Primary Request and Intent:
   [Detailed description]

2. Key Technical Concepts:
   - [Concept 1]
   - [Concept 2]
   - [...]

3. Files and Code Sections:
   - [File Name 1]
      - [Summary of why this file is important]
      - [Summary of the changes made to this file, if any]
      - [Important Code Snippet]
   - [File Name 2]
      - [Important Code Snippet]
   - [...]

4. Errors and fixes:
    - [Detailed description of error 1]:
      - [How you fixed the error]
      - [User feedback on the error if any]
    - [...]

5. Problem Solving:
   [Description of solved problems and ongoing troubleshooting]

6. All user messages:
    - [Detailed non tool use user message]
    - [...]

7. Pending Tasks:
   - [Task 1]
   - [Task 2]
   - [...]

8. Current Work:
   [Precise description of current work]

9. Optional Next Step:
   [Optional Next step to take]

</summary>
</example>

Please provide your summary based on the conversation so far, following this structure and ensuring precision and thoroughness in your response.

There may be additional summarization instructions provided in the included context. If so, remember to follow these instructions when creating the above summary. Examples of instructions include:
<example>
## Compact Instructions
When summarizing the conversation focus on typescript code changes and also remember the mistakes you made and how you fixed them.
</example>

<example>
# Summary instructions
When you are using compact - please focus on test output and code changes. Include file reads verbatim.
</example>
`;
  }

  // Custom instructions provided - append them
  return `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
This summary should be thorough in capturing technical details, code patterns, and architectural decisions that would be essential for continuing development work without losing context.

Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
  - Errors that you ran into and how you fixed them
  - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.

Your summary should include the following sections:

1. Primary Request and Intent: Capture all of the user's explicit requests and intents in detail
2. Key Technical Concepts: List all important technical concepts, technologies, and frameworks discussed.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Pay special attention to the most recent messages and include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List all errors that you ran into, and how you fixed them. Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages that are not tool results. These are critical for understanding the users' feedback and changing intent.
6. Pending Tasks: Outline any pending tasks that you have explicitly been asked to work on.
7. Current Work: Describe in detail precisely what was being worked on immediately before this summary request, paying special attention to the most recent messages from both user and assistant. Include file names and code snippets where applicable.
8. Optional Next Step: List the next step that you will take that is related to the most recent work you were doing. IMPORTANT: ensure that this step is DIRECTLY in line with the user's most recent explicit requests, and the task you were working on immediately before this summary request. If your last task was concluded, then only list next steps if they are explicitly in line with the users request. Do not start on tangential requests or really old requests that were already completed without confirming with the user first.
                       If there is a next step, include direct quotes from the most recent conversation showing exactly what task you were working on and where you left off. This should be verbatim to ensure there's no drift in task interpretation.

Here's an example of how your output should be structured:

<example>
<analysis>
[Your thought process, ensuring all points are covered thoroughly and accurately]
</analysis>

<summary>
1. Primary Request and Intent:
   [Detailed description]

2. Key Technical Concepts:
   - [Concept 1]
   - [Concept 2]
   - [...]

3. Files and Code Sections:
   - [File Name 1]
      - [Summary of why this file is important]
      - [Summary of the changes made to this file, if any]
      - [Important Code Snippet]
   - [File Name 2]
      - [Important Code Snippet]
   - [...]

4. Errors and fixes:
    - [Detailed description of error 1]:
      - [How you fixed the error]
      - [User feedback on the error if any]
    - [...]

5. Problem Solving:
   [Description of solved problems and ongoing troubleshooting]

6. All user messages:
    - [Detailed non tool use user message]
    - [...]

7. Pending Tasks:
   - [Task 1]
   - [Task 2]
   - [...]

8. Current Work:
   [Precise description of current work]

9. Optional Next Step:
   [Optional Next step to take]

</summary>
</example>

Please provide your summary based on the conversation so far, following this structure and ensuring precision and thoroughness in your response.

There may be additional summarization instructions provided in the included context. If so, remember to follow these instructions when creating the above summary. Examples of instructions include:
<example>
## Compact Instructions
When summarizing the conversation focus on typescript code changes and also remember the mistakes you made and how you fixed them.
</example>

<example>
# Summary instructions
When you are using compact - please focus on test output and code changes. Include file reads verbatim.
</example>


Additional Instructions:
${A}`  // A = custom instructions appended here
}
```

**Key Features of the Prompt:**
1. **Structured Output**: Requires <analysis> and <summary> tags
2. **9-Section Format**: Primary Request, Technical Concepts, Files, Errors, Problem Solving, User Messages, Pending Tasks, Current Work, Next Step
3. **Code Preservation**: Emphasizes including full code snippets and file names
4. **Context Continuity**: Tracks errors, fixes, and user feedback
5. **Custom Instructions**: Supports appending custom compaction instructions (from CLAUDE.md or `/compact` args)

**Example Custom Instructions (from CLAUDE.md):**
```
## Compact Instructions
When summarizing the conversation focus on typescript code changes and also remember the mistakes you made and how you fixed them.
```

**Compaction Instructions (from chunks.107.mjs:625-631 and 721-727):**
```
## Compact Instructions

When you are using compact - please focus on test output and code changes. Include file reads verbatim.
```

### Summary Structure

**From chunks.107.mjs:1216-1221:**
```javascript
let p = S91(Z ? "auto" : "manual", I ?? 0),  // Boundary marker
    u = [R0({
      content: T91(q, B),  // Formatted summary content
      isCompactSummary: !0,
      isVisibleInTranscriptOnly: !0
    })];
```

Summary messages include:
- **Boundary marker**: Indicates compaction point (auto/manual)
- **Summary content**: LLM-generated summary
- **Metadata flags**:
  - `isCompactSummary: true`
  - `isVisibleInTranscriptOnly: true` (hidden from API, visible in transcript)

### Context Restoration

**From chunks.107.mjs:1195-1202:**
```javascript
let w = GA2(Q.readFileState);  // Get read files
Q.readFileState.clear();
let N = await bD5(w, Q, _D5),  // Restore file reads
    R = fD5(Q.agentId);  // Get todos
if (R) N.push(R);
let T = XQ0(Q.agentId);  // Get plan
if (T) N.push(T);
```

**Restored Context:**
1. **Read files**: Recently read files (up to token limit)
2. **Todo list**: Current todos for agent
3. **Plan file**: Current plan if in plan mode

**File Restoration (chunks.107.mjs:1248-1269):**
```javascript
async function bD5(A, Q, B) {
  let G = Object.entries(A)
    .map(([Y, J]) => ({
      filename: Y,
      ...J
    }))
    .filter((Y) => !hD5(Y.filename, Q.agentId))  // Exclude agent file
    .sort((Y, J) => J.timestamp - Y.timestamp)   // Most recent first
    .slice(0, B),  // Limit to _D5 (max files)
      Z = await Promise.all(G.map(async (Y) => {
        let J = await VQ0(Y.filename, {
          ...Q,
          fileReadingLimits: {
            maxTokens: yD5  // Max tokens per file
          }
        }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
        return J ? l9(J) : null
      })),
      I = 0;

  return Z.filter((Y) => {
    if (Y === null) return !1;
    let J = gG(JSON.stringify(Y));
    if (I + J <= kD5) return I += J, !0;  // Stay within budget
    return !1
  })
}
```

Files are restored with:
- Token limits per file
- Total token budget
- Most recent files prioritized
- Agent's own file excluded

## PreCompact Hooks

### Hook Definition

**From chunks.107.mjs:1011 and 1059:**
```javascript
// Hook registry includes PreCompact
{
  SessionStart: [],
  SessionEnd: [],
  Stop: [],
  SubagentStart: [],
  SubagentStop: [],
  PreCompact: [],
  PermissionRequest: []
}
```

### Hook Execution

**From chunks.107.mjs:1132-1137:**
```javascript
let W = await Q.getAppState();
P91(W.toolPermissionContext, "summary"),
Q.setSpinnerColor?.("claudeBlue_FOR_SYSTEM_SPINNER"),
Q.setSpinnerShimmerColor?.("claudeBlueShimmer_FOR_SYSTEM_SPINNER"),
Q.setSpinnerMessage?.("Running PreCompact hooks..."),
Q.setSDKStatus?.("compacting");

let X = await FQ0({
  trigger: Z ? "auto" : "manual",
  customInstructions: G ?? null,
  sessionId: Q.agentId
}, Q.abortController.signal);
```

**Hook Context:**
```javascript
{
  trigger: "auto" | "manual",
  customInstructions: string | null,
  sessionId: string
}
```

### Hook Results

**From chunks.107.mjs:1138-1141:**
```javascript
if (X.newCustomInstructions) G = G ? `${G}\n\n${X.newCustomInstructions}` : X.newCustomInstructions;
let V = X.userDisplayMessage;
```

PreCompact hooks can:
- Add custom instructions to compaction prompt
- Provide user display message
- Influence summary generation

## Compaction Metrics and Telemetry

### Telemetry Event

**From chunks.107.mjs:1206-1215:**
```javascript
GA("tengu_compact", {
  preCompactTokenCount: I,
  postCompactTokenCount: v,
  compactionInputTokens: x?.input_tokens,
  compactionOutputTokens: x?.output_tokens,
  compactionCacheReadTokens: x?.cache_read_input_tokens ?? 0,
  compactionCacheCreationTokens: x?.cache_creation_input_tokens ?? 0,
  compactionTotalTokens: x ? x.input_tokens + (x.cache_creation_input_tokens ?? 0) + (x.cache_read_input_tokens ?? 0) + x.output_tokens : 0,
  ...J
});
```

**Metrics Tracked:**
- `preCompactTokenCount`: Tokens before compaction
- `postCompactTokenCount`: Tokens after compaction (summary + restored context)
- `compactionInputTokens`: Tokens sent to LLM for summarization
- `compactionOutputTokens`: Tokens in generated summary
- `compactionCacheReadTokens`: Prompt cache hits
- `compactionCacheCreationTokens`: Prompt cache creation
- `compactionTotalTokens`: Total API token usage

### Failure Telemetry

**From chunks.107.mjs:1183-1194:**
```javascript
if (!q) throw GA("tengu_compact_failed", {
  reason: "no_summary",
  preCompactTokenCount: I
}), Error("...");
else if (q.startsWith(uV)) throw GA("tengu_compact_failed", {
  reason: "api_error",
  preCompactTokenCount: I
}), Error(q);
else if (q.startsWith(OYA)) throw GA("tengu_compact_failed", {
  reason: "prompt_too_long",
  preCompactTokenCount: I
}), Error(xD5);
```

**Failure Reasons:**
- `no_summary`: LLM didn't generate summary
- `api_error`: API returned error
- `prompt_too_long`: Prompt exceeded limits

### Threshold Exceeded Telemetry

**From chunks.107.mjs:1634-1636:**
```javascript
if (B !== void 0 && X >= B) return GA("tengu_sm_compact_threshold_exceeded", {
  postCompactTokenCount: X,
  autoCompactThreshold: B
}), null;
```

Tracks when post-compaction still exceeds threshold.

### Microcompact Telemetry

**From chunks.107.mjs:1533-1540:**
```javascript
if (V.size > 0) return GA("tengu_microcompact", {
  toolsCompacted: V.size,
  totalUncompactedTokens: W,
  tokensAfterCompaction: W - X,
}), {
  ...
  preCompactTokenCount: Z,
  postCompactTokenCount: EQ0(Y)
};
```

Tracks micro-compaction (tool result compression) separately.

## Micro-Compaction

### Micro-Compact Strategy

**From chunks.107.mjs:1395:**
```javascript
if (BZ("cc_microcompact_ext", "mc_disabled", !1)) CQ0.add(A)
```

Micro-compaction can be disabled via experiment flag.

**Purpose**: Compress individual tool results instead of full conversation summary. More efficient for conversations with many tool calls.

## Configuration Options

### Environment Variables

```bash
# Disable compaction entirely
DISABLE_COMPACT=1

# Configure plan agent count (affects plan file restoration)
CLAUDE_CODE_PLAN_V2_AGENT_COUNT=3
```

### Settings

```json
{
  "autoCompactEnabled": true
}
```

Retrieved via `N1().autoCompactEnabled`

### Experiment Flags

```javascript
BZ("cc_microcompact_ext", "mc_disabled", false)
```

Controls micro-compaction behavior.

## Summary

The Compact system provides sophisticated conversation management:

1. **Manual Compaction**: `/compact` command for user-initiated summarization
2. **Auto-Compaction**: Automatic when threshold exceeded
3. **Micro-Compaction**: Efficient tool result compression
4. **Context Preservation**: Restores files, todos, and plans after compaction
5. **Hooks**: PreCompact and SessionStart hooks for customization
6. **Telemetry**: Comprehensive metrics for monitoring and optimization
7. **Error Handling**: Graceful degradation on failure
8. **Token Management**: Multiple thresholds (warning, error, autocompact)

**Key Benefits:**
- Prevents context overflow
- Maintains conversation continuity
- Preserves important context
- Efficient token usage
- Customizable via hooks
- Observable via telemetry
