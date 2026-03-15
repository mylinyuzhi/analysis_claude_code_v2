# Plan Mode — Interview Phase Deep Analysis (Claude Code 2.1.76)

> Complete reverse engineering of the **Interview Phase** variant of Plan Mode:
> feature flag detection, LLM-user iterative Q&A loop, multi-round interaction mechanics,
> UI callback injection, image support, "Ready to code?" approval dialog, context-clearing,
> and telemetry integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode section
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key symbols in this document:
- `sO` (chunks.140.mjs:1475) - `isPlanModeInterviewPhase` (feature flag reader)
- `UCY` (chunks.140.mjs:1572) - Standard "What Happens in Plan Mode" text (omitted in interview mode)
- `pCY` (chunks.140.mjs:1488) - `buildEnterPlanModePrompt` (interview vs standard variants)
- `ezz` (chunks.173.mjs:619) - `buildPlanModeInterviewReminder` (iterative loop instructions)
- `tzz` (chunks.173.mjs:611) - `buildAllowedToolsList` (Read/Glob/Grep filtered by allowedTools)
- `$Wq` (chunks.181.mjs:1920) - `QuestionForm` outer permission component
- `YWq` (chunks.181.mjs:1503) - `SingleQuestionComponent` per-question renderer
- `wWq` (chunks.181.mjs:1800) - `ReviewAnswersScreen` final review before submit
- `Sv6` (chunks.181.mjs:1367) - `QuestionProgressTabs` horizontal tab bar
- `aPq` (chunks.181.mjs:405) - `ExitPlanModeDialog` ("Ready to code?" permission component)
- `HgA` (chunks.181.mjs:2176) - `collectPastedImages` (image-to-API-block converter)
- `GDz` (chunks.181.mjs:1778) - mode selector (YWq's plan mode detection)
- `VDz` (chunks.181.mjs:2164) - mode selector ($Wq's plan mode detection)

---

## 1. Feature Flag: `isPlanModeInterviewPhase` (`sO`, chunks.140.mjs:1475)

### What it does

Controls whether the **iterative interview loop** (Explore → Update → Ask → repeat) replaces the standard **5-phase workflow** (Phase 1 through Phase 5). This flag gates:
- Which system reminder is injected into the LLM context (`ezz` vs `szz`)
- Whether the "What Happens in Plan Mode" section appears in the `EnterPlanMode` tool prompt
- UI telemetry tracking (all plan mode telemetry events include `interviewPhaseEnabled`)
- The sparse reminder wording (iterative vs 5-phase)

### How it works

```javascript
// ============================================
// sO - isPlanModeInterviewPhase
// Location: chunks.140.mjs:1474-1480
// ============================================

// ORIGINAL (for source lookup):
function sO() {
    let A = process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE;
    if (J6(A)) return !0;
    if (FY(A)) return !1;
    return x8("tengu_plan_mode_interview_phase", !1)
}

// READABLE (for understanding):
function isPlanModeInterviewPhase() {
    let envVar = process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE;
    if (parseTruthy(envVar)) return true;   // "true"/"1"/"yes" → override ON
    if (parseFalsy(envVar)) return false;   // "false"/"0"/"no" → override OFF
    return getFeatureFlag("tengu_plan_mode_interview_phase", false)  // default: OFF
}

// Mapping: sO→isPlanModeInterviewPhase, J6→parseTruthy, FY→parseFalsy, x8→getFeatureFlag
```

### Priority Hierarchy

```
1. Env var CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE=true  → always ON (override)
2. Env var CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE=false → always OFF (override)
3. Feature flag "tengu_plan_mode_interview_phase"      → dynamic ON/OFF
4. Default (no env var, no flag)                       → FALSE (interview OFF)
```

**Key insight:** Interview phase is **opt-in only** — disabled by default. It must be explicitly enabled via env var or Anthropic's feature flag system.

---

## 2. EnterPlanMode Tool — Interview vs Standard Variants

When `sO()` returns `true`, the `EnterPlanMode` tool's system prompt is modified.

### Standard Mode: Includes "What Happens in Plan Mode" (`UCY`)

```javascript
// ============================================
// UCY - Standard plan mode workflow description
// Location: chunks.140.mjs:1572
// ============================================

// ORIGINAL (for source lookup):
UCY = `## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using Glob, Grep, and Read tools
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use ${TH} if you need to clarify approaches
6. Exit plan mode with ExitPlanMode when ready to implement

`
```

This section is included in `pCY()` (the EnterPlanMode tool prompt builder) **only when interview phase is OFF**.

### Interview Mode: `UCY` Section Omitted

```javascript
// ============================================
// pCY - buildEnterPlanModePrompt (two variants)
// Location: chunks.140.mjs:1488
// ============================================

// ORIGINAL (for source lookup):
function pCY() {
    let A = sO() ? "" : UCY;
    return `Use this tool proactively when you're about to start a non-trivial implementation task...
    ${A}## Examples
    ...`
}

// READABLE (for understanding):
function buildEnterPlanModePrompt() {
    // Interview mode: skip the "What Happens in Plan Mode" section
    // Standard mode: include the 6-step workflow description
    let workflowSection = isPlanModeInterviewPhase() ? "" : standardWorkflowDescription;
    return `...` + workflowSection + `...examples...`;
}

// Mapping: pCY→buildEnterPlanModePrompt, sO→isPlanModeInterviewPhase, UCY→standardWorkflowDescription
```

**Why omit `UCY` in interview mode?**
- The standard 6-step workflow (Explore → Design → Review → Write Plan → ExitPlanMode) is replaced by the iterative loop (Explore → Update Plan → Ask → repeat)
- Including the standard steps would confuse the LLM by presenting contradictory workflows
- The `ezz()` reminder (injected as a system attachment on the next turn) fully replaces `UCY`

### `mapToolResultToToolResultBlockParam` — Interview Shortform

After `EnterPlanMode.call()` succeeds, the tool result injected into the API conversation varies:

**Interview mode** (`sO() === true`):
```
Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.

DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.
```

**Standard mode** (`sO() === false`):
```
Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.
```

**Key difference:** Interview mode only injects a brief placeholder. The full loop instructions come on the **next turn** as the `ezz()` system reminder attachment, which is more accurate at that point (since the plan file may or may not exist).

---

## 3. Interview Reminder: `buildPlanModeInterviewReminder` (`ezz`, chunks.173.mjs:619)

This is the full system reminder injected on the **first turn after entering plan mode** (and every 5th subsequent turn) when `isPlanModeInterviewPhase() === true`.

### Tool List Computation (`tzz`, chunks.173.mjs:611)

```javascript
// ============================================
// tzz - buildAllowedToolsList
// Location: chunks.173.mjs:611
// ============================================

// ORIGINAL (for source lookup):
function tzz() {
    let A = [Jq, Jz, s9],
        { allowedTools: q } = sz();
    return (q && q.length > 0 ? A.filter((Y) => q.includes(Y)) : A).join(", ")
}

// READABLE (for understanding):
function buildAllowedToolsList() {
    const readTools = ["Read", "Glob", "Grep"];   // Jq="Read", Jz="Glob", s9="Grep"
    const { allowedTools } = getSessionConfig();  // sz() = getSessionConfig
    // If user has restricted tools, show only allowed ones; else show all three
    return (allowedTools && allowedTools.length > 0
        ? readTools.filter(tool => allowedTools.includes(tool))
        : readTools
    ).join(", ");
}

// Mapping: tzz→buildAllowedToolsList, Jq→"Read", Jz→"Glob", s9→"Grep", sz→getSessionConfig
```

**Why filter by `allowedTools`?** The reminder tells the LLM which exploration tools it can use. If the user has restricted the session to specific tools, the reminder must not suggest unavailable tools.

### Reminder Content Structure

The `ezz()` reminder provides the iterative loop workflow:

```
Plan mode is active...

## Iterative Planning Workflow

You are pair-planning with the user. Explore the code to build context, ask the user questions...

### The Loop
Repeat this cycle until the plan is complete:
1. **Explore** — Use {allowedToolsList} to read code...
2. **Update the plan file** — After each discovery, immediately capture what you learned...
3. **Ask the user** — When you hit an ambiguity... use AskUserQuestion...

### First Turn
Start by quickly scanning a few key files... write a skeleton plan (headers and rough notes) and ask first questions...

### Asking Good Questions
- Never ask what you could find out by reading the code
- Batch related questions together
- Focus on things only the user can answer...

### Plan File Structure
[structure requirements]

### When to Converge
Your plan is ready when... Call ExitPlanMode when ready.

### Ending Your Turn
Your turn should only end by either:
- Using AskUserQuestion to gather more information
- Calling ExitPlanMode when the plan is ready for approval
```

---

## 4. Multi-Round Interaction State Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   INTERVIEW PHASE LOOP                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EnterPlanMode called                                           │
│        │                                                        │
│        ▼                                                        │
│  Turn 1 (full reminder ezz() injected):                        │
│    • Quick scan key files                                       │
│    • Write skeleton plan                                        │
│    • AskUserQuestion (round 1)                                  │
│        │                                                        │
│        ▼                                                        │
│  User answers (or: "Chat about this" / "Skip interview")        │
│        │                                                        │
│        ▼                                                        │
│  Turn 2 (sparse reminder A2z() injected):                      │
│    • Deeper exploration based on answers                        │
│    • Update plan file                                           │
│    • AskUserQuestion (round 2) OR ExitPlanMode                  │
│        │                                                        │
│        ▼                                                        │
│  [repeat until converged]                                       │
│        │                                                        │
│        ▼                                                        │
│  ExitPlanMode → "Ready to code?" dialog (aPq)                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Sparse reminder (`A2z`)** is injected on turns 2-5 (every 5 turns), then full reminder again on turn 6, 11, etc.:
```
Plan mode still active... Follow iterative workflow: explore codebase, interview user, write to plan incrementally.
End turns with AskUserQuestion (for clarifications) or ExitPlanMode (for plan approval).
```

---

## 5. UI Component Tree

```
$Wq (QuestionForm)  ← registered as permission component for AskUserQuestion
├── Sv6 (QuestionProgressTabs)   ← horizontal tab bar: [☐ Q1] [☐ Q2] [✓ Submit] →
│
├── YWq (SingleQuestionComponent) × N   ← one per question
│   ├── header: question text
│   ├── option list (if options provided):
│   │   ├── 1. Option A    ← Press 1 or navigate ↑/↓ + Enter
│   │   ├── 2. Option B    ← v2.1.69+: numeric keypad 1-9 also works
│   │   ├── ...
│   │   ├── N. Option N
│   │   └── N+1. Other [text input]   ← always appended
│   │       (accepts paste of images)
│   ├── or text input (if no options)
│   ├── N+2. Chat about this    ← always shown (if extraOptionsActive)
│   └── N+3. Skip interview and plan immediately  ← plan mode only
│
└── wWq (ReviewAnswersScreen)   ← shown after all questions answered
    ├── Summary: Q1 → A1, Q2 → A2, ...
    ├── ► Submit answers
    └── Cancel
```

---

## 6. "Chat About This" Callback

The "Chat about this" option (option N+1 in the extra options row, `y===0` in focus state) enables the user to break out of structured Q&A and have a free-form conversation with Claude.

```javascript
// ============================================
// j1 - onRespondToClaude callback
// Location: chunks.181.mjs:~2010 (inside $Wq)
// ============================================

// READABLE (for understanding):
const onRespondToClaude = async () => {
    const clarificationMessage = `The user wants to clarify these questions.
This means they may have additional information, context or questions for you.
Take their response into account and then reformulate the questions if appropriate.
Start by asking them what they would like to clarify.

Questions asked:
${questions.map(q => {
    const answer = currentAnswers[q.question];
    if (answer) return `- "${q.question}"\n  Answer: ${answer}`;
    return `- "${q.question}"\n  (No answer provided)`;
}).join('\n')}`;

    const images = await collectPastedImages(pastedContentsByQuestion);

    // REJECT the AskUserQuestion tool — inject clarification message instead
    onDoneClosingDialog();
    toolUseConfirm.onReject(clarificationMessage, images?.length > 0 ? images : undefined);
};

// Mapping: j1→onRespondToClaude, HgA→collectPastedImages, G→pastedContentsByQuestion
// Mapping: Y→onDoneClosingDialog, K→toolUseConfirm, B→currentAnswers, H→questions
// Mapping: Z→isPlanMode, $→metadataSource
```

### Injection Mechanism

Calling `K.onReject(message, images)` triggers the tool rejection path:
1. AskUserQuestion tool result = `renderToolUseRejectedMessage()` → `"✓ User declined to answer questions"`
2. The `message` parameter is injected as a **user message** into the API conversation
3. Images are attached to that user message as `image` content blocks
4. Claude receives this and knows to "start by asking them what they would like to clarify"

---

## 7. "Skip Interview and Plan Immediately" Callback

This is option N+2 (the last item in the option list, **plan mode only**). Selecting it tells Claude to **stop asking questions** and complete the plan with whatever information it has.

**Why this exists:** Sometimes the user has a clear enough vision that they don't want to go through Q&A rounds. This provides an escape hatch to skip to the planning phase immediately.

### Visibility Condition

```javascript
// ORIGINAL (for source lookup):
G1 = N && tY.default.createElement(I, { flexDirection: "row", gap: 1 },
    T && y === 1
        ? tY.default.createElement(V, { color: "suggestion" }, l1.pointer)
        : tY.default.createElement(V, null, " "),
    tY.default.createElement(V, {
        color: T && y === 1 ? "suggestion" : void 0
    }, t.length + 2, ". Skip interview and plan immediately"))

// READABLE (for understanding):
// G1 (skipOption) is ONLY rendered when N (planFilePath) is truthy
// i.e. toolPermissionContext.mode === "plan"
// It's the (questionCount + 2)th option in the list
// When keyboard focused (y===1, T=true): shown with "▶" pointer + "suggestion" color
```

### How it works

```javascript
// ============================================
// onFinishPlanInterview - "Skip interview" callback
// Location: chunks.181.mjs:2030-2047 (inside $Wq)
// ============================================

// ORIGINAL (for source lookup):
t = async () => {
    let _1 = `The user has indicated they have provided enough answers for the plan interview.
Stop asking clarifying questions and proceed to finish the plan with the information you have.

Questions asked and answers provided:
${H.map((G1) => {
    let L1 = B[G1.question];
    if (L1) return `- "${G1.question}"\n  Answer: ${L1}`;
    return `- "${G1.question}"\n  (No answer provided)`;
}).join(`\n        `)}`;
    if ($) c("tengu_ask_user_question_finish_plan_interview", {
        source: $, questionCount: H.length, isInPlanMode: Z, interviewPhaseEnabled: Z && sO()
    });
    let $1 = await HgA(G);
    Y(), K.onReject(_1, $1 && $1.length > 0 ? $1 : void 0)
}

// READABLE (for understanding):
const onFinishPlanInterview = async () => {
    const finishMessage = `The user has indicated they have provided enough answers for the plan interview.
Stop asking clarifying questions and proceed to finish the plan with the information you have.

Questions asked and answers provided:
${questions.map(q => {
    const answer = currentAnswers[q.question];
    if (answer) return `- "${q.question}"\n  Answer: ${answer}`;
    return `- "${q.question}"\n  (No answer provided)`;
}).join('\n')}`;

    if (metadataSource) track("tengu_ask_user_question_finish_plan_interview", {
        source: metadataSource, questionCount: questions.length,
        isInPlanMode: isPlanMode, interviewPhaseEnabled: isPlanMode && isPlanModeInterviewPhase()
    });

    const images = await collectPastedImages(pastedContentsByQuestion);
    onDoneClosingDialog();
    toolUseConfirm.onReject(finishMessage, images?.length > 0 ? images : undefined);
};
```

---

## 8. Image Support in Interview Phase: `HgA` (`collectPastedImages`)

Images can be pasted into any text field in the AskUserQuestion dialog (the "Other" text input) and are transmitted alongside the answer or rejection message.

```javascript
// ============================================
// HgA - collectPastedImages (image-to-API-block converter)
// Location: chunks.181.mjs:2176
// ============================================

// ORIGINAL (for source lookup):
async function HgA(A) {
    if (A.length === 0) return;
    return Promise.all(A.map(async (q) => {
        let K = {
            type: "image",
            source: {
                type: "base64",
                media_type: q.mediaType || "image/png",
                data: q.content
            }
        };
        return (await Aq1(K)).block
    }))
}

// READABLE (for understanding):
async function collectPastedImages(imageArray) {
    if (imageArray.length === 0) return undefined;
    return Promise.all(imageArray.map(async (img) => {
        const rawImageBlock = {
            type: "image",
            source: {
                type: "base64",
                media_type: img.mediaType || "image/png",
                data: img.content  // base64 data
            }
        };
        // Aq1 = normalizeImageBlock (handles size checks, format conversion)
        return (await normalizeImageBlock(rawImageBlock)).block;
    }));
}

// Mapping: HgA→collectPastedImages, Aq1→normalizeImageBlock
```

---

## 9. Keyboard Navigation in Interview Phase

### Within `YWq` (SingleQuestionComponent)

The component uses `useInput` with `isActive: T` (when focused on the extra options row):

```
// Key bindings for extra options navigation:
//   ↑ / Ctrl+P: if y===0 (on "Chat about this"), go back to selection; else move to "Chat about this" (y=0)
//   ↓ / Ctrl+N: if in plan mode (N) and y===0, move to "Skip interview" (y=1)
//   Enter: if y===0 → call onRespondToClaude(); if y===1 → call onFinishPlanInterview()
//   Esc: call onCancel()
```

**Numeric keypad support (v2.1.69+):** Within the option selector, pressing digit keys 1–9 immediately selects the option at that position. This matches the visual numbering shown in the terminal ("1. Option A", "2. Option B", etc.) and provides a fast-path for experienced users without requiring ↑/↓ navigation.

```
  ► 1. passport.js  - Proven ecosystem    ← Press "1" to instantly select
    2. next-auth    - Modern framework     ← Press "2" to instantly select
    3. custom JWT   - Maximum control      ← Press "3" to instantly select
```

### Special keybindings

| Key | When | Action |
|-----|------|--------|
| `Tab` / `→` | question navigator active | Next question |
| `Shift+Tab` / `←` | question navigator active | Previous question |
| `↓` / `Ctrl+N` | on "Chat about this" | Move to "Skip interview" (plan mode only) |
| `↑` / `Ctrl+P` | on "Chat about this" | Back to option selector |
| `Enter` | y=0 (Chat about this) | Submit clarification request |
| `Enter` | y=1 (Skip interview) | Finish plan interview |
| `Esc` | any | Cancel (reject with no message) |
| `1`–`9` | option list | Select option by number (v2.1.69+) |
| `Ctrl+G` | "Other" text input | Open external editor (if configured) |

---

## 10. "Ready to Code?" Dialog (`aPq`, chunks.181.mjs:405)

When the LLM calls `ExitPlanMode` in a main session (non-swarm), the user sees the "Ready to code?" dialog. This is the **final gate** before implementation begins.

### Component Structure

`aPq` is the **permission component** registered for `ExitPlanMode` tool. It receives `toolUseConfirm` and renders the plan with approval options.

### State Machine

The component has 5 UI states:

```
"default"            → Show plan + approval options ("Ready to code?")
"checking"           → "Checking prerequisites…" spinner (push-to-remote flow)
"creating"           → "Creating remote session…" spinner
"git-dialog"         → Git status dialog (uncommitted changes before push)
"eligibility-error"  → Error list for push-to-remote prerequisites
```

Plus an edge case:
```
isEmpty (plan="" or whitespace) → Simplified "Exit plan mode?" Yes/No dialog
```

### Full Plan Path — Options

```
  ► Yes, clear context and auto-accept edits (shift+tab)   [value: "yes-accept-edits"]
    Yes, auto-accept edits                                  [value: "yes-accept-edits-keep-context"]
    Yes, manually approve edits                             [value: "yes-default-keep-context"]
    No, keep planning [____________________________________][value: "no"]
                       Type here to tell Claude what to change
```

If `isBypassPermissionsModeAvailable` (enterprise), the option list changes to bypass-permissions variants.

### Context-Clearing vs Keep-Context Paths

- **"clear context" options** (yes-accept-edits, yes-bypass-permissions): Call `toolUseConfirm.onReject()` + set `initialMessage{clearContext:true}` in app state → session cleared, plan injected as new user message
- **"keep context" options** (yes-accept-edits-keep-context, yes-default-keep-context): Call `toolUseConfirm.onAllow()` → ExitPlanMode.call() executes → LLM receives "User has approved your plan"
- **"no"**: Dialog closes, LLM receives feedback text, stays in plan mode

---

## 11. Telemetry Events

All plan mode telemetry events include `interviewPhaseEnabled: sO()` when applicable:

| Event | Trigger | Interview-specific field |
|-------|---------|--------------------------|
| `tengu_plan_exit` | Any ExitPlanMode approval/rejection | `interviewPhaseEnabled: sO()` |
| `tengu_ask_user_question_accepted` | User submits answers | `interviewPhaseEnabled: isPlanMode && sO()` |
| `tengu_ask_user_question_rejected` | User cancels dialog | `interviewPhaseEnabled: isPlanMode && sO()` |
| `tengu_ask_user_question_respond_to_claude` | "Chat about this" | `interviewPhaseEnabled: isPlanMode && sO()` |
| `tengu_ask_user_question_finish_plan_interview` | "Skip interview" | `interviewPhaseEnabled: isPlanMode && sO()` |

**Why include `interviewPhaseEnabled`?** This lets Anthropic A/B test the impact of interview mode vs standard mode on user satisfaction, plan quality, and implementation success rates.

---

## 12. Differences: Interview Phase vs Standard 5-Phase Mode

| Aspect | Standard 5-Phase | Interview Phase |
|--------|-----------------|----------------|
| **Enabled by** | Default | `CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE=true` or feature flag |
| **System reminder** | `szz()` (5 phases) | `ezz()` (iterative loop) |
| **EnterPlanMode prompt** | Includes 6-step "What Happens" section | Omits that section |
| **EnterPlanMode result** | Full 6-step plan mode guide | Brief placeholder |
| **First turn instruction** | Comprehensive context-building, then design | Quick scan + skeleton + questions |
| **Plan update timing** | Phase 4 (after all exploration) | After EVERY discovery |
| **Agent usage** | Phase 1: up to 3 explore agents; Phase 2: 1-3 design agents | Optional, hinted as one-liner |
| **Q&A philosophy** | Batch all questions in Phase 1-3 | Incremental, question-answer-repeat |
| **Skip option** | Not applicable | "Skip interview and plan immediately" shown in AskUserQuestion |
| **Chat option** | Not applicable | "Chat about this" (always shown) |
| **Sparse reminder** | "Follow 5-phase workflow." | "Follow iterative workflow: explore, interview, write incrementally." |
| **Numeric keypad** | v2.1.69+: works in option selection | v2.1.69+: works in option selection |
| **Telemetry** | `interviewPhaseEnabled: false` | `interviewPhaseEnabled: true` |
