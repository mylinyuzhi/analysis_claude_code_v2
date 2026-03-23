# 36_loop_cron - Loop/Cron Scheduling System (v2.1.76)

> **Module**: Loop/Cron Scheduling System
> **Version**: Claude Code 2.1.76
> **Introduced**: v2.1.71
> **Source Files**: `chunks.145.mjs`, `chunks.186.mjs`, `chunks.91.mjs`, `chunks.181.mjs`, `chunks.187.mjs`, `chunks.1.mjs`

---

## Overview

The loop/cron scheduling system provides recurring and one-shot task execution within Claude Code sessions. It supports two interfaces:

1. **User-facing**: `/loop` slash command for intuitive recurring task setup
2. **Programmatic**: `CronCreate`, `CronDelete`, `CronList` tools for agent-driven scheduling

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  /loop 5m /check-status                    CronCreate({cron, prompt, ...})  │
│           │                                           │                      │
│           ▼                                           ▼                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                  SLASH COMMAND PARSER (chunks.181.mjs)              │    │
│  │  • gJz (registerLoopSkill) - Registration                          │    │
│  │  • BJz (buildLoopPrompt) - Prompt builder                           │    │
│  │  • Parses: "5m /foo" → cron: "*/5 * * * *", prompt: "/foo"         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
└──────────────────────────────────────┼───────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TOOL LAYER (chunks.145.mjs)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ TbY             │  │ VbY             │  │ ybY             │             │
│  │ CronCreateTool  │  │ CronDeleteTool  │  │ CronListTool    │             │
│  │                 │  │                 │  │                 │             │
│  │ isConcurrency-  │  │ isConcurrency-  │  │ isConcurrency-  │             │
│  │ Safe: false     │  │ Safe: false     │  │ Safe: true      │             │
│  │ isReadOnly:     │  │ isReadOnly:     │  │ isReadOnly:     │             │
│  │ false           │  │ false           │  │ true            │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    TASK STORAGE (chunks.145.mjs, chunks.1.mjs)      │   │
│  │  • A7q (createCronTask) - Create task                               │   │
│  │  • yz6 (deleteCronTasks) - Delete tasks                             │   │
│  │  • bT6 (getAllCronTasks) - Get all tasks                            │   │
│  │  • Mi6 (loadDurableTasks) - Load from disk                          │   │
│  │  • Bu1 (addSessionCronTask) - In-memory add                         │   │
│  │  • ck6 (getSessionCronTasks) - In-memory get                        │   │
│  │  • lk6 (removeSessionCronTasks) - In-memory remove                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SCHEDULER (chunks.186.mjs)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Ds8 (createCronScheduler)                                           │   │
│  │                                                                      │   │
│  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐            │   │
│  │  │ Lock Manager │   │ Task Watcher │   │  Poll Loop   │            │   │
│  │  │ (Ms8, Ehq)   │   │ (fs.watch)   │   │  (1s tick)   │            │   │
│  │  └──────────────┘   └──────────────┘   └──────────────┘            │   │
│  │         │                  │                  │                     │   │
│  │         └──────────────────┼──────────────────┘                     │   │
│  │                            ▼                                        │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │              TASK EXECUTION ENGINE                            │  │   │
│  │  │  • XF8 (calculateNextRecurringTime) - Jitter for recurring   │  │   │
│  │  │  • K7q (calculateNextOneShotTime) - Jitter for one-shot      │  │   │
│  │  │  • Y7q (findMissedOneShotTasks) - Missed task detection      │  │   │
│  │  │  • onFire callback → inject into agent loop                  │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AGENT LOOP INTEGRATION (chunks.187.mjs)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  if (nhq && rhq?.isKairosCronEnabled())                                     │
│    l = nhq.createCronScheduler({                                            │
│      onFire: (T6) => {                                                      │
│        _0({                                                                 │
│          mode: "prompt",                                                    │
│          value: T6,                                                         │
│          uuid: WD(),                                                        │
│          priority: "later",                                                 │
│          isMeta: true,                                                      │
│          workload: rA1                                                      │
│        }), i()                                                              │
│      }                                                                      │
│    })                                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Verified Symbol Mappings

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
>
> **Validation Status**: All 50+ symbols cross-validated against source code on 2026-03-23.

### Tool Definitions (chunks.145.mjs)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| TbY | CronCreateTool | chunks.145.mjs:950-1045 | object |
| VbY | CronDeleteTool | chunks.145.mjs:1066-1145 | object |
| ybY | CronListTool | chunks.145.mjs:1173-1244 | object |
| ZbY | fullCronCreateSchema | chunks.145.mjs:938-943 | schema |
| GbY | cronCreateInputSchema | chunks.145.mjs:943-944 | schema |
| fbY | cronCreateOutputSchema | chunks.145.mjs:945-950 | schema |
| vbY | cronDeleteInputSchema | chunks.145.mjs:1062-1064 | schema |
| NbY | cronDeleteOutputSchema | chunks.145.mjs:1064-1066 | schema |
| kbY | cronListInputSchema | chunks.145.mjs:1164 | schema |
| EbY | cronListOutputSchema | chunks.145.mjs:1165-1172 | schema |

### Tool Names & Constants (chunks.91.mjs)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| ER | TOOL_NAME_CRON_CREATE | chunks.91.mjs:192 | constant ("CronCreate") |
| ed | TOOL_NAME_CRON_DELETE | chunks.91.mjs:194 | constant ("CronDelete") |
| SW6 | TOOL_NAME_CRON_LIST | chunks.91.mjs:196 | constant ("CronList") |
| kR | isKairosCronEnabled | chunks.91.mjs:186-188 | function |
| LB9 | FEATURE_FLAG_CACHE_TTL | chunks.91.mjs:190 | constant (300000ms = 5 min) |
| RV8 | CRON_CREATE_DESCRIPTION | chunks.91.mjs:198 | constant |
| hV8 | CRON_CREATE_PROMPT | chunks.91.mjs:214-248 | constant |
| SV8 | CRON_DELETE_DESCRIPTION | chunks.91.mjs:202 | constant |
| CV8 | CRON_DELETE_PROMPT | chunks.91.mjs:203 | constant |
| IV8 | CRON_LIST_DESCRIPTION | chunks.91.mjs:206 | constant |
| bV8 | CRON_LIST_PROMPT | chunks.91.mjs:208 | constant |
| rA1 | WORKLOAD_TYPE_CRON | chunks.18.mjs:1894 | constant ("cron") |

### Cron Expression Parsing (chunks.145.mjs)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| ji6 | parseCronExpression | chunks.145.mjs:543-559 | function |
| HbY | parseCronField | chunks.145.mjs:506-541 | function |
| tAq | findNextCronTime | chunks.145.mjs:561-595 | function |
| IT6 | getNextCronMatch | chunks.145.mjs:792-797 | function |
| CT6 | formatCronHumanReadable | chunks.145.mjs:613-651 | function |
| $bY | CRON_FIELD_BOUNDS | chunks.145.mjs:658-674 | constant |
| sAq | DAY_NAMES | chunks.145.mjs:674 | constant |

### Scheduler Implementation (chunks.186.mjs)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| Ds8 | createCronScheduler | chunks.186.mjs:110-248 | function |
| Ws8 | getCronJitterConfig | chunks.186.mjs:288-292 | function |
| Ms8 | acquireSchedulerLock | chunks.186.mjs:47-68 | function |
| Ehq | tryAcquireLock | chunks.186.mjs:14-38 | function |
| za6 | releaseSchedulerLock | chunks.186.mjs:70-78 | function |
| Rhq | readLockFile | chunks.186.mjs:3-12 | function |
| Ihq | isTaskExpired | chunks.186.mjs:106-108 | function |
| bhq | formatMissedTasksMessage | chunks.186.mjs:251-267 | function |
| Y7q | findMissedOneShots | chunks.145.mjs:821-825 | function |
| XF8 | calculateNextRecurringTime | chunks.145.mjs:804-811 | function |
| K7q | calculateNextOneShotTime | chunks.145.mjs:813-819 | function |

### Session Memory Storage (chunks.1.mjs)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| ck6 | getSessionCronTasks | chunks.1.mjs:2897-2898 | function |
| Bu1 | addSessionCronTask | chunks.1.mjs:2901-2902 | function |
| lk6 | removeSessionCronTasks | chunks.1.mjs:2905-2911 | function |
| dk6 | setScheduledTasksEnabled | chunks.1.mjs:2889-2890 | function |
| pw6 | getScheduledTasksEnabled | chunks.1.mjs:2893-2894 | function |

### Durable Storage (chunks.145.mjs)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| Mi6 | loadDurableTasks | chunks.145.mjs:681-721 | function |
| eAq | saveDurableTasks | chunks.145.mjs:736-749 | function |
| bl | getScheduledTasksPath | chunks.145.mjs:677-679 | function |
| zE1 | hasScheduledTasks | chunks.145.mjs:723-734 | function |
| A7q | createCronTask | chunks.145.mjs:751-770 | function |
| yz6 | deleteCronTasks | chunks.145.mjs:772-780 | function |
| bT6 | getAllCronTasks | chunks.145.mjs:782-790 | function |
| WbY | SCHEDULED_TASKS_FILENAME | chunks.145.mjs:840 | constant |

### /loop Command (chunks.181.mjs)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| gJz | registerLoopSkill | chunks.181.mjs:1640-1660 | function |
| BJz | buildLoopPrompt | chunks.181.mjs:1592-1638 | function |
| no6 | DEFAULT_LOOP_INTERVAL | chunks.181.mjs:1662 | constant ("10m") |
| mJz | LOOP_USAGE_MESSAGE | chunks.181.mjs:1669-1681 | constant |

## UI Integration (chunks.195.mjs)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| yvz | useScheduledTasks | chunks.195.mjs:1948-1985 | React hook |
| vb1 | React | chunks.195.mjs (Ink context) | import |

### Teammate Task Routing

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| _g | findTaskById | chunks.113.mjs:1370-1377 | function |
| LJ6 | isTaskTerminal | chunks.41.mjs:2402-2404 | function |
| tQ6 | dispatchTaskPrompt | chunks.113.mjs:1357-1367 | function |
| w0 | enqueueMessage | chunks.90.mjs:2823-2827 | function |

### UI Rendering (chunks.145.mjs)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| z7q | renderCronCreateUseMessage | chunks.145.mjs:850-852 | function |
| _7q | renderCronCreateResultMessage | chunks.145.mjs:854-860 | function |
| w7q | renderCronDeleteUseMessage | chunks.145.mjs:862-864 | function |
| O7q | renderCronDeleteResultMessage | chunks.145.mjs:866-870 | function |
| $7q | renderCronListUseMessage | chunks.145.mjs:872-874 | function |
| H7q | renderCronListResultMessage | chunks.145.mjs:876-887 | function |
| xT6 | renderCronProgressMessage | chunks.145.mjs:889-891 | function |
| uT6 | renderCronRejectedMessage | chunks.145.mjs:893-894 | function |
| mT6 | renderCronErrorMessage | chunks.145.mjs:897-904 | function |

### Jitter Configuration (chunks.145.mjs, chunks.186.mjs)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| Lz6 | DEFAULT_JITTER_CONFIG | chunks.145.mjs:841-847 | object |
| q7q | hashJobId | chunks.145.mjs:799-802 | function |
| vXz | JITTER_CONFIG_CACHE_TTL | chunks.186.mjs:294 | constant (60000ms) |
| Ps8 | MAX_JITTER_CAP_MS | chunks.186.mjs:296 | constant (1800000ms) |
| NXz | jitterConfigSchema | chunks.186.mjs:304-310 | schema |
| Chq | THREE_DAYS_MS | chunks.186.mjs:275 | constant (259200000ms) |
| Shq | FIRE_CHECK_INTERVAL_MS | chunks.186.mjs:269 | constant (1000ms) |
| fXz | FILE_STABILITY_THRESHOLD_MS | chunks.186.mjs:271 | constant (300ms) |
| TXz | LOCK_RETRY_INTERVAL_MS | chunks.186.mjs:273 | constant (5000ms) |

### Lock Files (chunks.186.mjs)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| Rhq | readLockFile | chunks.186.mjs:3-12 | function |
| Ehq | tryAcquireLock | chunks.186.mjs:14-38 | function |
| Ms8 | acquireSchedulerLock | chunks.186.mjs:47-68 | function |
| za6 | releaseSchedulerLock | chunks.186.mjs:70-79 | function |
| js8 | scheduleLockHeartbeat | chunks.186.mjs:41-45 | function |
| jI1 | heartbeatHandle | chunks.186.mjs:85 | variable |
| Ka6 | lockedBySession | chunks.186.mjs:87 | variable |
| ZXz | LOCK_FILE_PATH | chunks.186.mjs:97 | constant |
| GXz | lockFileSchema | chunks.186.mjs:97-101 | schema |

### Limit Constants (chunks.145.mjs)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| j7q | MAX_SCHEDULED_JOBS | chunks.145.mjs:919 | constant (50) |
| q7q | hashJobId | chunks.145.mjs:799-801 | function |

### Telemetry Events (chunks.186.mjs)

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `tengu_scheduled_task_missed` | Missed one-shot tasks detected at scheduler start | `count`, `taskIds` |
| `tengu_scheduled_task_fire` | A scheduled task fires | `recurring`, `taskId` |
| `tengu_scheduled_task_expired` | Recurring task expires (3-day limit) | `taskId`, `ageHours` |
| `tengu_scheduled_task_created` | Task created via CronCreate | `recurring`, `durable`, `taskId` |
| `tengu_scheduled_task_deleted` | Task deleted via CronDelete | `taskId` |

### Team Delegate Tools (chunks.91.mjs:269)

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| WY4 | TEAM_DELEGATE_TOOLS | chunks.91.mjs:269 | Set |

**Contents:** `{TeamCreate, TeamDelete, TeamList, TeamChat, TeamStatus, CronCreate, CronDelete, CronList}`

**Key insight:** Cron tools are included in the team delegate set, allowing teammate agents to schedule and manage their own cron jobs independently.

---

## Feature Flag Integration

### isCronEnabled (kR)

**Location:** chunks.91.mjs:186-188

```javascript
// ============================================
// isCronEnabled - Check if cron feature is enabled
// Location: chunks.91.mjs:186-188
// ============================================

// ORIGINAL (for source lookup):
function kR() {
    return !t6(process.env.CLAUDE_CODE_DISABLE_CRON) && lk("tengu_kairos_cron", !0, LB9)
}

// READABLE (for understanding):
function isCronEnabled() {
    // Disabled if CLAUDE_CODE_DISABLE_CRON is set
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_CRON)) {
        return false;
    }
    // Feature flag with 5-minute cache (LB9 = 300000ms)
    return getFeatureFlag("tengu_kairos_cron", true, 300000);
}

// Mapping: kR→isCronEnabled, t6→parseBoolean, lk→getFeatureFlag, LB9→300000
```

---

## Documentation Index

| Document | Content | Key Topics |
|----------|---------|------------|
| [cron_tools.md](./cron_tools.md) | CronCreate/CronDelete/CronList tool definitions | Tool schemas, validation, execution flow |
| [implementation.md](./implementation.md) | Cron parsing, scheduler, jitter algorithms | Lock mechanism, hash-based jitter, missed task detection |
| [ui_design.md](./ui_design.md) | UI rendering, React/Ink components | `useScheduledTasks` hook, teammate task routing, notification UI |
| [integration.md](./integration.md) | Cross-module integration | Agent loop, system_reminder, load distribution, team mode |

### Documentation Highlights

#### implementation.md
- Cron expression parsing algorithms (5-field format)
- Inter-process lock mechanism with heartbeat
- Hash-based jitter calculation for thundering herd prevention
- Missed one-shot task detection on startup

#### ui_design.md
- `useScheduledTasks` (yvz) React hook implementation
- Teammate-aware task handling in UI
- Missed task notification flow

#### integration.md
- System reminder integration for missed task notifications
- Load distribution strategy (LLM prompt guidance)
- Team mode orphaned cron cleanup
- Agent loop scheduler initialization

---

## Cross-Module Integration

The cron/loop system integrates with multiple Claude Code modules:

### Core Integrations

| Module | Integration Point | Description |
|--------|-------------------|-------------|
| [04_system_reminder](../04_system_reminder) | `isMeta: true` flag | Cron messages hidden from UI transcript |
| [08_subagent](../08_subagent) | `onFireTask` routing | Tasks routed to teammate agents |
| [09_slash_command](../09_slash_command) | `/loop` skill registration | User-facing interface for recurring tasks |
| [01_cli](../01_cli) | Agent loop scheduler | Scheduler lifecycle managed by main loop |
| [30_agent_teams](../30_agent_teams) | `agentId` ownership | Teammate isolation and orphaned cron cleanup |

### State Management

| Module | State Used |
|--------|------------|
| chunks.1.mjs | `sessionCronTasks`, `scheduledTasksEnabled` |
| chunks.90.mjs | `enqueueMessage` for prompt injection |
| chunks.195.mjs | Redux store for teammate task routing |

### Feature Flags

| Flag | Purpose | Default |
|------|---------|---------|
| `tengu_kairos_cron` | Enable/disable cron feature | `true` |
| `tengu_kairos_cron_config` | Jitter configuration overrides | Default config |
| `CLAUDE_CODE_DISABLE_CRON` | Environment override | (not set) |

### Telemetry Events

Emitted by the scheduler for observability:

- `tengu_scheduled_task_missed` - One-shot tasks that passed their time
- `tengu_scheduled_task_fire` - Task execution (includes recurring flag)
- `tengu_scheduled_task_expired` - 3-day auto-expiry notification

---

## Quick Reference

### Cron Expression Format

```
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6, Sunday=0)
│ │ │ │ │
* * * * *
```

### Supported Field Patterns

| Pattern | Example | Description |
|---------|---------|-------------|
| `*` | `* * * * *` | Every minute |
| `*/N` | `*/5 * * * *` | Every N units |
| `N` | `30 * * * *` | At specific value |
| `N-M` | `0-5 * * * *` | Range |
| `N,M` | `0,30 * * * *` | List |

### Task Types

| Type | `recurring` | Behavior |
|------|-------------|----------|
| Recurring | `true` | Fires repeatedly, auto-expires after 3 days |
| One-shot | `false` | Fires once, auto-deletes after firing |

### Storage Types

| Type | `durable` | Persistence |
|------|-----------|-------------|
| Session-only | `false` (default) | In-memory only, dies on session exit |
| Durable | `true` | Persisted to `.claude/scheduled_tasks.json` |

---

**Last Updated**: 2026-03-23
**Version**: Claude Code 2.1.76
**Status**: ✅ Complete - All 50+ symbols cross-validated against source code. Includes:
- UI integration (`useScheduledTasks` React hook in chunks.195.mjs)
- Load distribution strategy (hash-based jitter algorithm)
- Cross-module integration ([system_reminder](../04_system_reminder), [team_mode](../30_agent_teams))
- Agent loop scheduler initialization (chunks.187.mjs:571-586)
- Lock acquisition race condition analysis (implementation.md)
- Mathematical jitter analysis (implementation.md)