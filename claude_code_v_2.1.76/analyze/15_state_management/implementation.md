# Implementation Report - State Management (Module 15)

## Overview

State Management in Claude Code v2.1.76 is built on a custom Reactive Store architecture designed to handle highly dynamic, multi-agent environments. It provides a single source of truth for UI state, agent tasks, security contexts, and extension registries. The system integrates with the Ink terminal UI framework using modern React patterns like `useSyncExternalStore`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `initialAppState` (gG1) - Defines the schema and default values for the entire application state.
- `createStore` (Gf6) - A factory that creates a pub/sub store with `getState`, `setState`, and `subscribe`.
- `AppStateProvider` (u_) - React context provider for the state.
- `useAppState` (v6) - A selector-based hook for efficient state consumption.
- `updateGlobalConfig` (jA) - Atomically updates and persists system-wide settings.
- `getGlobalConfig` (f6) - Retrieves the current persisted configuration.

## Core State Structure (`gG1`)

The state is organized into logical domains:

| Domain | Key Fields | Description |
|--------|------------|-------------|
| **Execution** | `tasks`, `initialMessage` | Tracks all active agents and shell commands. |
| **Security** | `toolPermissionContext` | Manages permission modes (default, plan, bypass). |
| **Context** | `fileHistory`, `mcp` | Preserves read files and MCP resources for Prompt Building. |
| **Extensions** | `plugins`, `sessionHooks` | Registry for loaded plugins and lifecycle interceptors. |
| **LLM Config**| `thinkingEnabled`, `effortValue` | Controls reasoning depth and token budgets. |
| **Feedback** | `feedbackSurveyRate` | Enterprise-configurable session quality survey probability (0.0–1.0). |
| **UI** | `notifications`, `expandedView` | Manages the terminal display and status line. |

## Feedback Survey Configuration (v2.1.76)

### feedbackSurveyRate Setting

**Purpose:** Controls the probability of showing a post-session quality survey to collect user feedback on Claude Code sessions.

**Configuration:**
- **Type:** Float (0.0–1.0)
- **Default:** 0.1 (10% of sessions)
- **Scope:** Enterprise-admin configurable via managed settings
- **Applied at:** Session end

**How it works:**

1. **Probability calculation**: At session end, system generates random value `r ∈ [0, 1)`
2. **Survey trigger**: If `r < feedbackSurveyRate`, post-session quality survey is shown
3. **Survey content**: Multi-question feedback form on session helpfulness, clarity, and suggestions
4. **Storage**: Responses aggregated for product analytics and quality insights

**Examples:**
- `feedbackSurveyRate: 0.0` - Never show survey
- `feedbackSurveyRate: 0.5` - Show survey ~50% of the time
- `feedbackSurveyRate: 1.0` - Always show survey

**Enterprise admin usage:**

Admins can configure `feedbackSurveyRate` in the managed settings section to:
- Increase feedback collection by raising rate (0.3–0.5 for active feedback programs)
- Disable feedback collection entirely by setting to 0.0
- Fine-tune rate based on session volume and feedback goals

---

## Core Algorithms

### 1. The Reactive Store (`Gf6`)

The store uses a functional update pattern similar to Redux or Zustand, but optimized for the `useSyncExternalStore` hook.

====
// createStore - Reactive store implementation
// Location: chunks.151.mjs:398-417
====

// ORIGINAL (for source lookup):
function Gf6(A, q) {
    let K = A, Y = new Set;
    return {
        getState: () => K,
        setState: (z) => {
            let w = K, H = z(w);
            if (Object.is(H, w)) return;
            K = H, q?.({ newState: H, oldState: w });
            for (let $ of Y) $()
        },
        subscribe: (z) => {
            return Y.add(z), () => Y.delete(z)
        }
    }
}

// READABLE (for understanding):
function createStore(initialState, onStateChange) {
    let currentState = initialState;
    let listeners = new Set();

    return {
        getState: () => currentState,
        setState: (updater) => {
            let previousState = currentState;
            let nextState = typeof updater === 'function' ? updater(previousState) : updater;
            
            // Optimization: Skip notification if state didn't change
            if (Object.is(nextState, previousState)) return;
            
            currentState = nextState;
            
            // Trigger external persistence or logging
            onStateChange?.({ newState: nextState, oldState: previousState });
            
            // Notify all reactive subscribers (React/Ink components)
            for (let listener of listeners) {
                listener();
            }
        },
        subscribe: (listener) => {
            listeners.add(listener);
            // Return unsubscribe function
            return () => listeners.delete(listener);
        }
    }
}

// Mapping: Gf6→createStore, A→initialState, q→onStateChange, K→currentState, Y→listeners

### 2. Multi-Agent Task Tracking (`bZ`)

In v2.1.76, Agent Swarms are managed as "Tasks" within the global state. This allows the main UI to monitor all teammates simultaneously.

```javascript
function registerTaskInState(task, setAppState) {
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [task.id]: task
        }
    }));
}
```

### 3. Atomic Config Persistence (`jA`)

To prevent corruption when multiple agents or sessions attempt to modify the global config (e.g., `~/.claude/config.json`), the system uses a locking mechanism.

====
// updateGlobalConfig - Atomic persistence with locking
// Location: chunks.174.mjs:1460-1482
====

// ORIGINAL (for source lookup):
function jA(A) {
    try {
        nJq(ij(), Gy, (q) => {
            let K = A(q);
            if (K === q) return q;
            return { ...K, projects: UJq(q.projects) }
        }), Ic.config = null, Ic.mtime = 0
    } catch (q) {
        let K = se(ij(), Gy), Y = A(K);
        if (Y === K) return;
        iJq(ij(), { ...Y, projects: UJq(K.projects) }, Gy), Ic.config = null, Ic.mtime = 0
    }
}

// READABLE (for understanding):
function updateGlobalConfig(updater) {
    const configPath = getConfigPath();
    try {
        // Attempt atomic update with file lock
        runWithFileLock(configPath, LOCK_RETRIES, (currentConfig) => {
            let nextConfig = updater(currentConfig);
            if (nextConfig === currentConfig) return currentConfig;
            
            // Sanitize project history before saving
            return {
                ...nextConfig,
                projects: sanitizeProjectData(nextConfig.projects)
            };
        });
        
        // Invalidate in-memory cache
        configCache.data = null;
    } catch (e) {
        log.error("Failed to save config with lock, falling back to unsafe write");
        // Fallback: Read-Modify-Write without locking
        let current = readConfigUnsafe(configPath);
        let next = updater(current);
        writeConfigUnsafe(configPath, next);
    }
}

// Mapping: jA→updateGlobalConfig, nJq→runWithFileLock, ij()→getConfigPath, UJq→sanitizeProjectData

## Key Insight

Claude Code v2.1.76 implements a **Distributed State Pattern**. While the "App State" is in-memory and highly reactive for UI updates, the "Global Config" serves as an atomic, persistent backend. This dual-layer approach allows for high-frequency UI updates (like spinners and token counters) while ensuring that user preferences and project history are safely synchronized across multiple agent processes.
