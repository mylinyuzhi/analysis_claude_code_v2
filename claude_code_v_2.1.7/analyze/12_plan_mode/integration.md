# Plan Mode - Integration and Subagent Propagation

This document covers session restore, attachment pipeline integration, main loop integration, and subagent plan mode propagation.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## 12. Session Restore and Plan Persistence

### 12.1 Plan Slug Caching

```javascript
// ============================================
// Plan Slug Cache - Global State
// Location: chunks.1.mjs:2778-2780
// ============================================

// ORIGINAL:
function Z7A() {
  return g0.planSlugCache  // Map<sessionId, slug>
}

// READABLE:
function getPlanSlugCache() {
  return globalState.planSlugCache;  // In-memory Map
}

// The cache stores session ID → slug mappings:
// "abc123" → "bright-exploring-aurora"
// "def456" → "calm-dancing-phoenix"
```

### 12.2 Slug Caching Functions

```javascript
// ============================================
// cachePlanSlug - Store slug in cache
// Location: chunks.86.mjs:39-41
// ============================================

// ORIGINAL:
function ZY0(A, Q) {
  Z7A().set(A, Q)
}

// READABLE:
function cachePlanSlug(sessionId, slug) {
  getPlanSlugCache().set(sessionId, slug);
}

// ============================================
// clearPlanSlugCacheForSession - Clear slug from cache
// Location: chunks.86.mjs:43-46
// ============================================

// ORIGINAL:
function J12(A) {
  let Q = A ?? q0();
  Z7A().delete(Q)
}

// READABLE:
function clearPlanSlugCacheForSession(sessionId) {
  let sessionToClear = sessionId ?? getSessionId();
  getPlanSlugCache().delete(sessionToClear);
}
```

### 12.3 Session Resume - Restoring Plan Slug

```javascript
// ============================================
// resumeSession - Restores plan slug from session messages
// Location: chunks.120.mjs:2608-2643
// ============================================

// ORIGINAL (key excerpt):
async function Zt(A, Q) {
  // ... session loading logic ...

  if (B) {
    if (Gj(B)) B = await Vx(B);  // Decompress if needed
    if (!Z) Z = xX(B);            // Extract session ID
    if (w71(B), Z) W71(B, lz(Z)); // KEY: Restore plan slug!
    EW1(B), G = B.messages
  }

  // Run SessionStart hooks (may add plan context)
  let Y = await WU("resume", Z);
  return G.push(...Y), { messages: G, sessionId: Z }
}

// READABLE:
async function resumeSession(sessionData, query) {
  // ... session loading ...

  if (messages) {
    if (needsDecompression(messages)) {
      messages = await decompressMessages(messages);
    }
    if (!sessionId) sessionId = extractSessionId(messages);

    // CRITICAL: Restore plan slug from session messages
    restorePlanSlugFromSession(messages, sessionId);

    validateMessages(messages);
    convertedMessages = messages;
  }

  // SessionStart hooks may restore plan context
  let hookMessages = await executeSessionStartHooks("resume", sessionId);
  convertedMessages.push(...hookMessages);

  return { messages: convertedMessages, sessionId };
}

// Mapping: Zt→resumeSession, W71→restorePlanSlugFromSession, WU→executeSessionStartHooks
```

### 12.4 Restore Plan Slug from Session

```javascript
// ============================================
// restorePlanSlugFromSession - Extracts and caches slug from messages
// Location: chunks.86.mjs:76-83
// ============================================

// ORIGINAL:
function W71(A, Q) {
  let B = A.messages.find((Y) => Y.slug)?.slug;
  if (!B) return !1;
  let G = Q ?? q0();
  ZY0(G, B);  // Cache the slug!
  let Z = tSA(NN(), `${B}.md`);
  return vA().existsSync(Z)
}

// READABLE:
function restorePlanSlugFromSession(messageContainer, sessionId) {
  // Find the first message with a slug property
  let slug = messageContainer.messages.find((msg) => msg.slug)?.slug;
  if (!slug) return false;

  let currentSessionId = sessionId ?? getSessionId();

  // RESTORE: Cache the slug for this session
  cachePlanSlug(currentSessionId, slug);

  // Verify plan file exists
  let planFilePath = path.join(getPlanDir(), `${slug}.md`);
  return fs.existsSync(planFilePath);
}

// Mapping: W71→restorePlanSlugFromSession, ZY0→cachePlanSlug
```

### 12.5 /clear Command Behavior

```javascript
// ============================================
// clearSessionHandler - Clears session but NOT plan files
// Location: chunks.136.mjs:1907-1932
// ============================================

// ORIGINAL:
async function IE1({ setMessages: A, readFileState: Q, getAppState: B, setAppState: G }) {
  // Execute SessionEnd hooks
  if (await tU0("clear", { getAppState: B, setAppState: G }), !Tz())
    await sI();

  // Clear messages (but NOT plan files on disk!)
  if (A(() => []), XE1(), DO(EQ()), Q.clear(), G)
    G((Y) => ({
      ...Y,
      fileHistory: { snapshots: [], trackedFiles: new Set },
      mcp: { clients: [], tools: [], commands: [], resources: {} }
    }));

  // Clear plan slug cache (but NOT files!)
  J12();  // clearPlanSlugCacheForSession
  wb0();
  await wj();

  // Run SessionStart hooks (can restore plan context)
  let Z = await WU("clear");
  if (Z.length > 0) A(() => Z)
}

// READABLE:
async function clearSessionHandler({ setMessages, readFileState, getAppState, setAppState }) {
  // 1. Execute SessionEnd hooks
  await executeSessionEndHooks("clear", { getAppState, setAppState });
  if (!isSandboxMode()) await restoreSessionStorage();

  // 2. Clear all messages (NOT plan files!)
  setMessages(() => []);
  clearAllCaches();
  clearFileTracking();
  readFileState.clear();

  // 3. Reset MCP and file history
  if (setAppState) setAppState((state) => ({
    ...state,
    fileHistory: { snapshots: [], trackedFiles: new Set },
    mcp: { clients: [], tools: [], commands: [], resources: {} }
  }));

  // 4. Clear plan slug cache (files remain on disk!)
  clearPlanSlugCacheForSession();
  resetOtherState();

  // 5. Run SessionStart hooks (can add plan context back)
  let restoredMessages = await executeSessionStartHooks("clear");
  if (restoredMessages.length > 0) {
    setMessages(() => restoredMessages);
  }
}

// Key insight: Plan files at ~/.claude/plans/*.md are NOT deleted
// Only the in-memory slug cache is cleared
// This is why plan files "persist across /clear" (fixed in 2.1.3)
```

---

## 13. Full Attachment Pipeline Integration

### 13.1 Main Attachment Generator

```javascript
// ============================================
// buildSystemAttachments - Where plan mode fits in the pipeline
// Location: chunks.131.mjs:3121-3137
// ============================================

// ORIGINAL:
async function O27(A, Q, B, G, Z, Y) {
  if (a1(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) return [];

  let J = c9();  // AbortController
  setTimeout(() => { J.abort() }, 1000);  // 1 second timeout

  let X = { ...Q, abortController: J },
    I = !Q.agentId,  // Is main loop (not subagent)?

    // GROUP 1: User-mention attachments
    D = A ? [
      fJ("at_mentioned_files", () => h27(A, X)),
      fJ("mcp_resources", () => u27(A, X)),
      fJ("agent_mentions", () => Promise.resolve(g27(A, Q.options.agentDefinitions.activeAgents)))
    ] : [],
    W = await Promise.all(D),

    // GROUP 2: Core attachments (includes plan mode!)
    K = [
      fJ("changed_files", () => m27(X)),
      fJ("nested_memory", () => d27(X)),
      fJ("ultra_claude_md", async () => v27(Z)),
      fJ("plan_mode", () => j27(Z, Q)),           // ← PLAN MODE HERE (position 4)
      fJ("plan_mode_exit", () => T27(Q)),         // ← PLAN MODE EXIT (position 5)
      fJ("delegate_mode", () => P27(Q)),
      fJ("delegate_mode_exit", () => Promise.resolve(S27())),
      fJ("todo_reminders", () => t27(Z, Q)),
      fJ("collab_notification", async () => B97()),
      fJ("critical_system_reminder", () => Promise.resolve(x27(Q)))
    ],

    // GROUP 3: Main-loop-only attachments
    V = I ? [
      fJ("ide_selection", async () => k27(B, Q)),
      fJ("ide_opened_file", async () => f27(B, Q)),
      fJ("output_style", async () => Promise.resolve(y27())),
      fJ("queued_commands", async () => M27(G)),
      fJ("diagnostics", async () => o27()),
      fJ("lsp_diagnostics", async () => r27()),
      fJ("unified_tasks", async () => A97(Q, Z)),
      fJ("async_hook_responses", async () => Q97()),
      fJ("memory", async () => mr2(Q, Z, Y)),
      fJ("token_usage", async () => Promise.resolve(G97(Z ?? []))),
      fJ("budget_usd", async () => Promise.resolve(Z97(Q.options.maxBudgetUsd))),
      fJ("verify_plan_reminder", async () => J97(Z, Q))
    ] : [],

    [F, H] = await Promise.all([Promise.all(K), Promise.all(V)]);

  // Combine all groups: user-mentions → core → main-loop-only
  return [...W.flat(), ...F.flat(), ...H.flat()]
}
```

### 13.2 Attachment Ordering

| Priority | Group | Attachments |
|----------|-------|-------------|
| 1 | User-mentions | at_mentioned_files, mcp_resources, agent_mentions |
| 2 | **Core** | changed_files, nested_memory, ultra_claude_md, **plan_mode**, **plan_mode_exit**, delegate_mode, delegate_mode_exit, todo_reminders, collab_notification, critical_system_reminder |
| 3 | Main-loop-only | ide_selection, ide_opened_file, output_style, queued_commands, diagnostics, lsp_diagnostics, unified_tasks, async_hook_responses, memory, token_usage, budget_usd, verify_plan_reminder |

**Key insight:** Plan mode attachments are in the **core group** (always generated for both main agent and subagents), not in the main-loop-only group.

### 13.3 Attachment Telemetry Wrapper

```javascript
// ============================================
// generateAttachment - Wraps with telemetry
// Location: chunks.131.mjs:3140-3164
// ============================================

// ORIGINAL:
async function fJ(A, Q) {
  let B = Date.now();
  try {
    let G = await Q(),
      Z = Date.now() - B,
      Y = G.reduce((J, X) => J + eA(X).length, 0);

    // 5% sampling for telemetry
    if (Math.random() < 0.05) l("tengu_attachment_compute_duration", {
      label: A,
      duration_ms: Z,
      attachment_size_bytes: Y,
      attachment_count: G.length
    });
    return G
  } catch (G) {
    let Z = Date.now() - B;
    if (Math.random() < 0.05) l("tengu_attachment_compute_duration", {
      label: A,
      duration_ms: Z,
      error: !0
    });
    return e(G), xM(`Attachment error in ${A}`, G), []
  }
}
```

### 13.4 Attachment-to-Message Conversion

```javascript
// ============================================
// wrapAttachmentAsMessage - Wraps raw attachment
// Location: chunks.132.mjs:87-94
// ============================================

// ORIGINAL:
function X4(A) {
  return {
    attachment: A,
    type: "attachment",
    uuid: q27(),
    timestamp: new Date().toISOString()
  }
}

// READABLE:
function wrapAttachmentAsMessage(attachment) {
  return {
    attachment: attachment,
    type: "attachment",
    uuid: generateUUID(),
    timestamp: new Date().toISOString()
  }
}
```

### 13.5 Full Pipeline Flow

```
User sends message
    ↓
aN() generator (chunks.134.mjs:99)
    ↓
O27() - buildSystemAttachments
    ├─ GROUP 1: User-mention attachments
    ├─ GROUP 2: Core attachments
    │  ├─ j27() → plan_mode attachment
    │  └─ T27() → plan_mode_exit attachment
    └─ GROUP 3: Main-loop-only attachments
    ↓
VHA() generator - yields each attachment
    ↓
X4() - wraps as message envelope
    ↓
q$7() - converts to API message format
    ├─ case "plan_mode" → z$7() → ($$7 or C$7 or U$7)
    ├─ case "plan_mode_reentry" → direct conversion
    └─ case "plan_mode_exit" → direct conversion
    ↓
API message ready for sending
```

---

## 14. Main Loop Integration

### 14.1 Model Selection in Main Loop

```javascript
// ============================================
// selectModelForPlanMode - Selects Opus/Sonnet based on plan mode
// Location: chunks.46.mjs:2259-2268
// ============================================

// ORIGINAL (for source lookup):
function HQA(A) {
  let {
    permissionMode: Q,
    mainLoopModel: B,
    exceeds200kTokens: G = !1
  } = A;
  if (FQA() === "opusplan" && Q === "plan" && !G) return sJA();
  if (FQA() === "haiku" && Q === "plan") return OR();
  return B
}

// READABLE (for understanding):
function selectModelForPlanMode({ permissionMode, mainLoopModel, exceeds200kTokens = false }) {
  // If "Opus Plan Mode" selected AND in plan mode AND under 200k tokens
  // → Use Opus 4.5 (better reasoning for complex planning)
  if (getMainLoopModelSetting() === "opusplan" && permissionMode === "plan" && !exceeds200kTokens) {
    return getOpusModel();  // claude-opus-4-5 or claude-opus-4-1
  }

  // If Haiku selected AND in plan mode
  // → Upgrade to Sonnet 4.5 (Haiku too weak for planning)
  if (getMainLoopModelSetting() === "haiku" && permissionMode === "plan") {
    return getSonnetModel();  // claude-sonnet-4-5
  }

  // Otherwise use configured main loop model
  return mainLoopModel;
}

// Mapping: HQA→selectModelForPlanMode, FQA→getMainLoopModelSetting, sJA→getOpusModel, OR→getSonnetModel
```

**Key insight:** Model selection is automatically adjusted in plan mode:
- "Opus Plan Mode" → Uses Opus 4.5 for better reasoning (unless >200k tokens)
- Haiku → Upgraded to Sonnet 4.5 (Haiku insufficient for planning)

### 14.2 Token Threshold Check

```javascript
// ============================================
// checkExceeds200kTokens - Check if last response exceeded 200k tokens
// Location: chunks.85.mjs:921-931
// ============================================

// ORIGINAL (for source lookup):
function h51(A) {
  for (let B = A.length - 1; B >= 0; B--) {
    let G = A[B];
    if (G?.type === "assistant") {
      let Z = Jd(G);
      if (Z) return uSA(Z) > 200000;
      return !1
    }
  }
  return !1
}

// READABLE (for understanding):
function checkExceeds200kTokens(messages) {
  // Search backwards for last assistant message
  for (let i = messages.length - 1; i >= 0; i--) {
    let message = messages[i];
    if (message?.type === "assistant") {
      let usage = getMessageUsage(message);
      if (usage) {
        return getTotalTokens(usage) > 200000;
      }
      return false;
    }
  }
  return false;
}

// Mapping: h51→checkExceeds200kTokens, Jd→getMessageUsage, uSA→getTotalTokens
```

**Why 200k threshold:** When token count exceeds 200k, the Opus model switch is skipped to avoid performance issues with very long contexts.

### 14.3 Permission Mode Retrieval in Main Loop

```javascript
// ============================================
// Main loop permission mode retrieval
// Location: chunks.134.mjs:174-180
// ============================================

// ORIGINAL (for source lookup):
h6("query_setup_start");
let x = f8("tengu_streaming_tool_execution2") ? new _H1(Y.options.tools, Z, Y) : null,
  b = await Y.getAppState(),
  S = b.toolPermissionContext.mode,  // Get current permission mode
  u = HQA({
    permissionMode: S,
    mainLoopModel: Y.options.mainLoopModel,
    exceeds200kTokens: S === "plan" && h51(z)  // Only check 200k in plan mode
  }),
  f = fA9(Q, G);
h6("query_setup_end");

// READABLE (for understanding):
logTiming("query_setup_start");

// 1. Get current app state
let appState = await toolUseContext.getAppState();

// 2. Extract permission mode ("default", "plan", "acceptEdits", "bypassPermissions", "dontAsk")
let permissionMode = appState.toolPermissionContext.mode;

// 3. Select model based on plan mode
let model = selectModelForPlanMode({
  permissionMode: permissionMode,
  mainLoopModel: toolUseContext.options.mainLoopModel,
  exceeds200kTokens: permissionMode === "plan" && checkExceeds200kTokens(messages)
});

logTiming("query_setup_end");

// Mapping: h6→logTiming, S→permissionMode, u→model, HQA→selectModelForPlanMode, h51→checkExceeds200kTokens
```

### 14.4 Mode Transition Triggering Exit Attachment

```javascript
// ============================================
// Mode cycle handler - triggers exit attachment on plan mode exit
// Location: chunks.152.mjs:2514-2528
// ============================================

// ORIGINAL (for source lookup):
let k1 = z4.useCallback(() => {
  let T0 = kK9(B, FA.teamContext);  // Get next mode in cycle
  if (l("tengu_mode_cycle", { to: T0 }),
    B.mode === "plan" && T0 !== "plan") Iq(!0);  // KEY: Set hasExitedPlanMode!
  if (Ty(B.mode, T0),  // Track mode transition
    B.mode === "delegate" && T0 !== "delegate") Df0(!0), jdA(!0);
  if (T0 === "plan") S0((PB) => ({
    ...PB,
    lastPlanModeUse: Date.now()
  }));
  if (T0 === "acceptEdits") T9("auto-accept-mode");
  let NQ = UJ(B, {
    type: "setMode",
    mode: T0,
    destination: "session"
  });
  if (G(NQ), XL7(T0, FA.teamContext?.teamName), ZA) zA(!1)
}, [B, FA.teamContext, G, ZA])

// READABLE (for understanding):
const handleModeCycle = useCallback(() => {
  let nextMode = getNextModeInCycle(currentPermissionContext, teamContext);

  logTelemetry("tengu_mode_cycle", { to: nextMode });

  // CRITICAL: When exiting plan mode → set flag for exit attachment
  if (currentPermissionContext.mode === "plan" && nextMode !== "plan") {
    setHasExitedPlanMode(true);  // Triggers plan_mode_exit attachment
  }

  // Track mode transition (sets needsPlanModeExitAttachment)
  onToolPermissionModeChanged(currentPermissionContext.mode, nextMode);

  // Handle delegate mode exit
  if (currentPermissionContext.mode === "delegate" && nextMode !== "delegate") {
    setNeedsDelegateModeExitAttachment(true);
    setDelegateModeExited(true);
  }

  // Track last plan mode usage
  if (nextMode === "plan") {
    updateUserPrefs((prefs) => ({
      ...prefs,
      lastPlanModeUse: Date.now()
    }));
  }

  // Apply mode change
  let newContext = applyPermissionAction(currentPermissionContext, {
    type: "setMode",
    mode: nextMode,
    destination: "session"
  });
  setPermissionContext(newContext);
}, [currentPermissionContext, teamContext, setPermissionContext]);

// Mapping: k1→handleModeCycle, kK9→getNextModeInCycle, Iq→setHasExitedPlanMode,
//          Ty→onToolPermissionModeChanged, UJ→applyPermissionAction
```

**Flow when user exits plan mode:**
1. User clicks mode cycle button (Shift+Escape)
2. `kK9()` calculates next mode
3. If exiting plan mode → `Iq(!0)` sets `hasExitedPlanMode = true`
4. `Ty()` tracks transition → sets `needsPlanModeExitAttachment = true`
5. Next turn: `T27()` generates `plan_mode_exit` attachment

---

## 15. Subagent Plan Mode Propagation

### 15.1 How Plan Mode is Propagated

Plan mode is **NOT passed as an explicit parameter** to subagents. Instead, it's enforced through:

1. **Tool restrictions** via `disallowedTools` array
2. **System prompts** with explicit read-only instructions
3. **Critical system reminders** in agent configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PLAN MODE PROPAGATION TO SUBAGENTS                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Main Agent (mode = "plan")                                                │
│         │                                                                   │
│         ├─── Task tool spawns subagent ──────────────────────────────────┐  │
│         │                                                                │  │
│         ▼                                                                ▼  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    SUBAGENT CONFIGURATION                            │  │
│   │                                                                      │  │
│   │   1. disallowedTools: [Task, ExitPlanMode, Edit, Write, KillShell]  │  │
│   │      ↳ Cannot spawn more agents                                      │  │
│   │      ↳ Cannot exit plan mode                                         │  │
│   │      ↳ Cannot edit/write files                                       │  │
│   │                                                                      │  │
│   │   2. System Prompt:                                                  │  │
│   │      "=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ==="     │  │
│   │      "You are STRICTLY PROHIBITED from..."                           │  │
│   │                                                                      │  │
│   │   3. criticalSystemReminder_EXPERIMENTAL:                           │  │
│   │      "CRITICAL: This is a READ-ONLY task. You CANNOT edit..."       │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   Result: Subagent cannot modify files even if it tries                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 15.2 Explore Agent Configuration

```javascript
// ============================================
// Explore Agent - Plan Mode Configuration
// Location: chunks.93.mjs:219-228
// ============================================

// ORIGINAL (for source lookup):
MS = {
  agentType: "Explore",
  whenToUse: 'Fast agent specialized for exploring codebases...',
  disallowedTools: [f3, CY1, I8, BY, tq],
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",
  getSystemPrompt: () => sZ5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// READABLE (for understanding):
const ExploreAgentConfig = {
  agentType: "Explore",
  whenToUse: 'Fast agent for exploring codebases. Use for file searches, code keywords, codebase questions.',

  // KEY: These tools are BLOCKED for this agent
  disallowedTools: [
    "Task",          // Cannot spawn further agents
    "ExitPlanMode",  // Cannot exit plan mode
    "Edit",          // Cannot edit files
    "Write",         // Cannot write files
    "KillShell"      // Cannot kill shells
  ],

  source: "built-in",
  baseDir: "built-in",
  model: "haiku",  // Uses Haiku for speed
  getSystemPrompt: () => exploreAgentSystemPrompt,

  // Additional reminder for read-only enforcement
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// Mapping: MS→ExploreAgentConfig, f3→"Task", CY1→"ExitPlanMode", I8→"Edit", BY→"Write", tq→"KillShell"
```

### 15.3 Plan Agent Configuration

```javascript
// ============================================
// Plan Agent - Configuration with Read-Only Enforcement
// Location: chunks.93.mjs:289-299
// ============================================

// ORIGINAL (for source lookup):
UY1 = {
  agentType: "Plan",
  whenToUse: "Software architect agent for designing implementation plans...",
  disallowedTools: [f3, CY1, I8, BY, tq],
  source: "built-in",
  tools: MS.tools,  // Same tools as Explore
  baseDir: "built-in",
  model: "inherit",  // Inherits parent model (Opus in plan mode)
  getSystemPrompt: () => tZ5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// READABLE (for understanding):
const PlanAgentConfig = {
  agentType: "Plan",
  whenToUse: "Software architect for designing implementation plans. Returns step-by-step plans, identifies critical files.",

  // SAME restrictions as Explore agent
  disallowedTools: ["Task", "ExitPlanMode", "Edit", "Write", "KillShell"],

  source: "built-in",
  tools: ExploreAgentConfig.tools,  // Same tool set
  baseDir: "built-in",
  model: "inherit",  // KEY: Inherits parent model (Opus when in plan mode)
  getSystemPrompt: () => planAgentSystemPrompt,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// Mapping: UY1→PlanAgentConfig, tZ5→planAgentSystemPrompt
```

### 15.4 Plan Agent System Prompt (Full Text)

```javascript
// ============================================
// Plan Agent System Prompt - Read-Only Instructions
// Location: chunks.93.mjs:240-289
// ============================================

planAgentSystemPrompt = `You are a software architect and planning specialist for Claude Code. Your role is to explore the codebase and design implementation plans.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to explore the codebase and design implementation plans. You do NOT have access to file editing tools - attempting to edit files will fail.

## Your Process

1. **Understand Requirements**: Focus on the requirements provided.

2. **Explore Thoroughly**:
   - Read any files provided to you in the initial prompt
   - Find existing patterns using ${Glob.name}, ${Grep.name}, and ${Read.name}
   - Understand the current architecture
   - Identify similar features as reference
   - Use ${Bash.name} ONLY for read-only operations (ls, git status, git log, git diff)
   - NEVER use ${Bash.name} for: mkdir, touch, rm, cp, mv, git add, git commit

3. **Design Solution**:
   - Create implementation approach
   - Consider trade-offs and architectural decisions

4. **Detail the Plan**:
   - Provide step-by-step implementation strategy
   - Identify dependencies and sequencing

## Required Output

End your response with:

### Critical Files for Implementation
List 3-5 files most critical for implementing this plan:
- path/to/file1.ts - [Brief reason]

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files.`
```

### 15.5 Multi-Layered Read-Only Enforcement

| Layer | Mechanism | Location |
|-------|-----------|----------|
| **1. Tool Blocking** | `disallowedTools` array prevents Edit/Write | chunks.93.mjs:222, 292 |
| **2. System Prompt** | Explicit "READ-ONLY MODE" instructions | chunks.93.mjs:240-289 |
| **3. Critical Reminder** | `criticalSystemReminder_EXPERIMENTAL` | chunks.93.mjs:227, 298 |
| **4. Permission Check** | Tools check mode === "plan" | chunks.147.mjs:1570-1598 |
| **5. SubAgent Reminder** | `buildSubAgentPlanReminder()` | chunks.147.mjs:3340-3351 |

**Why multi-layered:** LLMs can sometimes ignore instructions. Multiple enforcement layers ensure read-only behavior is maintained even if one layer fails.

---

## 16. Design Decisions for Integration

### 16.1 Why 200k Token Threshold for Opus Switch?

**Problem:** Opus 4.5 provides better reasoning but is slower and more expensive.

**Decision:** Only use Opus in plan mode when under 200k tokens.

```javascript
if (getMainLoopModelSetting() === "opusplan" && permissionMode === "plan" && !exceeds200kTokens) {
  return getOpusModel();  // Use Opus
}
```

**Why 200k?**
- Opus performance degrades significantly with very long contexts
- Token count is a proxy for conversation complexity
- 200k is approximately where Opus's advantage diminishes
- Above 200k, Sonnet's speed advantage outweighs Opus's reasoning advantage

### 16.2 Why Plan Files Persist Across /clear?

**Problem:** User runs /clear to reset conversation. Should plan file be deleted?

| Option | Behavior | User Experience |
|--------|----------|-----------------|
| Delete plan file | Clean slate | Work lost if accidental |
| **Keep plan file** | Plan survives | Can resume, might confuse |

**Decision:** Keep plan file, clear only in-memory slug cache.

**Why:**
1. Plan represents significant user investment
2. Accidental /clear shouldn't lose work
3. User can manually delete if needed
4. Re-entry detection handles confusion case

### 16.3 Why Plan Mode Uses Core Attachment Group?

**Problem:** Where should plan_mode attachment appear in the pipeline?

```javascript
// GROUP 2: Core attachments (includes plan mode!)
K = [
  fJ("changed_files", () => m27(X)),
  fJ("nested_memory", () => d27(X)),
  fJ("ultra_claude_md", async () => v27(Z)),
  fJ("plan_mode", () => j27(Z, Q)),           // ← HERE
  fJ("plan_mode_exit", () => T27(Q)),
  ...
]
```

**Why Core Group (not Main-loop-only)?**
- **Subagents need it:** Plan mode reminders must propagate to Explore/Plan agents
- **Consistency:** Both main agent and subagents see same plan context
- **Simplicity:** One code path for all agents

### 16.4 Why Model Inheritance for Plan Agent?

```javascript
PlanAgentConfig = {
  model: "inherit",  // Not "opus" or "sonnet"
  ...
}
```

**Why inherit instead of fixed model?**
- If parent uses Opus (in plan mode), Plan agent gets Opus too
- Better reasoning for plan generation
- If parent uses Sonnet/Haiku, Plan agent follows
- User's model choice is respected throughout hierarchy

---

## 17. Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

### Tool Definitions
- `EnterPlanModeTool` (gbA) - Enter plan mode tool object
- `ExitPlanModeTool` (V$) - Exit plan mode tool object

### Plan File Management
- `getPlanDir` (NN) - Get ~/.claude/plans directory
- `getPlanFilePath` (dC) - Get plan file path for session/agent
- `readPlanFile` (AK) - Read plan content from file
- `checkPlanExists` (W71) - Check if plan file exists, restore slug

### State Tracking
- `hasExitedPlanMode` (Xf0) - Check if exited plan mode
- `setHasExitedPlanMode` (Iq) - Set exit flag
- `needsPlanModeExitAttachment` (If0) - Check if exit attachment needed
- `setNeedsPlanModeExitAttachment` (lw) - Set exit attachment flag
- `onToolPermissionModeChanged` (Ty) - Handle mode transitions
- `getPlanSlugCache` (Z7A) - Get slug cache Map
- `cachePlanSlug` (ZY0) - Cache slug for session
- `clearPlanSlugCacheForSession` (J12) - Clear cached slug

### System Reminders
- `buildPlanModeSystemReminder` (z$7) - Router for plan reminders
- `buildFullPlanReminder` ($$7) - Full 5-phase workflow
- `buildSparsePlanReminder` (C$7) - Abbreviated reminder
- `buildSubAgentPlanReminder` (U$7) - Subagent instructions
- `getMaxPlanAgents` (LJ9) - Get max design agents
- `getMaxExploreAgents` (OJ9) - Get max explore agents

### Attachment Generation
- `buildPlanModeAttachment` (j27) - Main attachment builder
- `buildPlanModeExitAttachment` (T27) - Exit attachment builder
- `findPlanModeAttachmentInfo` (R27) - Count turns since attachment
- `countPlanModeAttachments` (_27) - Count plan attachments
- `buildSystemAttachments` (O27) - Full attachment pipeline

### Permission Integration
- `buildPermissionRules` (re) - Convert allowedPrompts to rules
- `semanticToRegex` (aK1) - Convert semantic description to regex

### Main Loop Integration
- `selectModelForPlanMode` (HQA) - Select Opus/Sonnet for plan mode
- `checkExceeds200kTokens` (h51) - Check 200k token threshold
- `handleModeCycle` (k1) - UI mode cycle handler
- `getNextModeInCycle` (kK9) - Calculate next permission mode

### Subagent Configurations
- `ExploreAgentConfig` (MS) - Explore agent definition
- `PlanAgentConfig` (UY1) - Plan agent definition
- `exploreAgentSystemPrompt` (sZ5) - Explore agent prompt
- `planAgentSystemPrompt` (tZ5) - Plan agent prompt with READ-ONLY enforcement

### Disallowed Tools (Agent Restrictions)
- Task (f3), ExitPlanMode (CY1), Edit (I8), Write (BY), KillShell (tq)

---

## Related Documents

- [overview.md](./overview.md) - Architecture, tools, file management, state tracking
- [system_and_attachments.md](./system_and_attachments.md) - System reminders, attachments, permissions
