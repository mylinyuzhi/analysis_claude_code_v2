# Swarm Plan Approval Complete Analysis (Claude Code 2.1.76)

> Complete analysis of plan approval flow for teammate agents in swarm mode.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Agent Teams section)

Key functions:
- `handlePlanApproval` (AhY) - Team-lead approval handler - chunks.145.mjs:2521
- `PlanApprovalRequestMessageSchema` (Vx4) - Request schema - chunks.129.mjs:1546
- `PlanApprovalResponseMessageSchema` (Nx4) - Response schema - chunks.129.mjs:1553

---

## Overview

When a teammate agent wants to exit plan mode, it must get approval from the team-lead. This ensures human oversight of implementation plans in multi-agent scenarios.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                  SWARM PLAN APPROVAL FLOW                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Teammate Agent (in Plan Mode)                                       │
│       │                                                               │
│       │ ExitPlanMode called                                          │
│       ▼                                                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Create plan_approval_request message                           │  │
│  │                                                                 │  │
│  │  {                                                              │  │
│  │    type: "plan_approval_request",                               │  │
│  │    planContent: "...",                                          │  │
│  │    planFilePath: "~/.claude_api/plans/...",                    │  │
│  │    fromAgent: "agent-1"                                         │  │
│  │  }                                                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│       │                                                               │
│       ▼ (via inbox)                                                   │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Team-Lead receives request                                      │  │
│  │                                                                 │  │
│  │  ├─ Show approval dialog                                       │  │
│  │  ├─ Display plan content                                       │  │
│  │  └─ User decides: approve/reject                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│       │                                                               │
│       ▼                                                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ plan_approval_response message                                 │  │
│  │                                                                 │  │
│  │  {                                                              │  │
│  │    type: "plan_approval_response",                              │  │
│  │    approved: true/false,                                        │  │
│  │    feedback: "Optional revision feedback"                       │  │
│  │  }                                                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│       │                                                               │
│       ▼                                                               │
│  Teammate Agent                                                      │
│       ├─→ If approved: Exit plan mode, begin implementation         │
│       └─→ If rejected: Revise plan, stay in plan mode               │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Message Formats

### Plan Approval Request

```javascript
// Vx4 - PlanApprovalRequestMessageSchema
{
    type: "plan_approval_request",
    planContent: string,      // Full plan text
    planFilePath: string,     // Path to plan file
    fromAgent: string,        // Agent name requesting
    timestamp: number
}
```

### Plan Approval Response

```javascript
// Nx4 - PlanApprovalResponseMessageSchema
{
    type: "plan_approval_response",
    approved: boolean,        // true = approved, false = rejected
    feedback: string?,        // Optional feedback for revision
    responderAgent: string    // Team-lead agent name
}
```

---

## Team-Lead Approval Handler

```javascript
// ============================================
// AhY (handlePlanApproval) - Team-lead handler
// Location: chunks.145.mjs:2521
// ============================================

async function handlePlanApproval(request, context) {
    // 1. Parse request
    const { planContent, planFilePath, fromAgent } = request;

    // 2. Show approval dialog to user
    const decision = await showPlanApprovalDialog({
        title: `Plan from ${fromAgent}`,
        content: planContent,
        options: [
            { label: "Approve", value: "approve" },
            { label: "Request Changes", value: "reject" }
        ]
    });

    // 3. Build response
    const response = {
        type: "plan_approval_response",
        approved: decision.approved,
        feedback: decision.feedback,
        responderAgent: context.agentName
    };

    // 4. Send response to teammate's inbox
    await writeToMailbox(fromAgent, response);

    return response;
}
```

---

## Integration Points

### Agent Teams (30)

- Teammate sends request via SendMessage
- Team-lead handles via message handler

### Plan Mode (12)

- Triggers on ExitPlanMode in teammate context
- Blocks until response received

### System Reminder (04)

- Approval request tracked as attachment
- Response updates task status

---

## Quick Reference

### Key Functions

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| AhY | handlePlanApproval | Team-lead handler |
| aSY | handleBroadcast | Broadcast to team |
| iP1 | parsePlanApprovalResponse | Parse response |

### Message Types

| Type | Direction | Purpose |
|------|-----------|---------|
| `plan_approval_request` | Teammate → Lead | Request approval |
| `plan_approval_response` | Lead → Teammate | Return decision |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced feedback support |
| 2.1.32 | Initial swarm plan approval |