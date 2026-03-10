# CLI-Hooks Integration

> How CLI flags `--init`, `--init-only`, and `--maintenance` control hook execution

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks Module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent Loop

Key functions in this document:
- `executeSetupHooks` (OyA) - Runs Setup hooks with specified trigger
- `executeSessionStartHooks` (qyA) - Runs SessionStart lifecycle hooks
- `HookTrigger` - Enum of hook trigger types (init, maintenance, startup)

---

## Overview

The CLI layer integrates with the hooks system through three hidden flags that control hook execution at startup:

1. **`--init`** - Runs Setup hooks with "init" trigger, then continues to normal session
2. **`--init-only`** - Runs Setup + SessionStart:startup hooks, then exits (no session)
3. **`--maintenance`** - Runs Setup hooks with "maintenance" trigger, then continues

These flags are hidden from `--help` output but provide essential CI/CD and automation integration points.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CLI → HOOKS INTEGRATION PIPELINE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  --init flag     │    │  --init-only      │    │  --maintenance   │     │
│  │  Setup:init      │    │  Setup:init       │    │  Setup:          │     │
│  │  then continue   │    │  SessionStart:    │    │  maintenance     │     │
│  │                  │    │  startup, exit    │    │  then continue   │     │
│  └────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘     │
│           │                        │                       │               │
│           └────────────────────────┼───────────────────────┘               │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │   executeSetupHooks()         │                       │
│                    │   (OyA)                       │                       │
│                    │   Trigger: init/maintenance   │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│                          ┌─────────┴─────────┐                            │
│                          │                   │                            │
│                    --init-only              Others                        │
│                          │                   │                            │
│                          ▼                   ▼                            │
│           ┌─────────────────────────┐   ┌─────────────┐                   │
│           │ executeSessionStart     │   │ Continue    │                   │
│           │ Hooks(startup)          │   │ to REPL     │                   │
│           │ then exit               │   │             │                   │
│           └─────────────────────────┘   └─────────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. CLI Flag Definitions

### 1.1 Hidden Hook Flags

**Source location:** `chunks.189.mjs:1017-1019`

```javascript
// ============================================
// Hook-related CLI flag definitions - Hidden from --help
// Location: chunks.189.mjs:1017-1019
// ============================================

// ORIGINAL (for source lookup):
.addOption(new J5("--init", "Run Setup hooks with init trigger, then continue").hideHelp())
.addOption(new J5("--init-only", "Run Setup and SessionStart:startup hooks, then exit").hideHelp())
.addOption(new J5("--maintenance", "Run Setup hooks with maintenance trigger, then continue").hideHelp())

// READABLE (for understanding):
.addOption(new Option("--init", "Run Setup hooks with init trigger, then continue").hideHelp())
.addOption(new Option("--init-only", "Run Setup and SessionStart:startup hooks, then exit").hideHelp())
.addOption(new Option("--maintenance", "Run Setup hooks with maintenance trigger, then continue").hideHelp())

// Mapping: J5→Option (commander), .hideHelp()→hides from --help output
```

### 1.2 Flag Extraction in Action Handler

**Source location:** `chunks.189.mjs:1054`

```javascript
// ============================================
// Hook flag extraction - Action handler
// Location: chunks.189.mjs:1054
// ============================================

// ORIGINAL (for source lookup):
let x = H.init ?? !1,
    p = H.initOnly ?? !1,
    l = H.maintenance ?? !1

// READABLE (for understanding):
let initFlag = options.init ?? false,
    initOnlyFlag = options.initOnly ?? false,
    maintenanceFlag = options.maintenance ?? false

// Mapping: x→initFlag, p→initOnlyFlag, l→maintenanceFlag, H→options
```

---

## 2. Hook Execution Flow

### 2.1 Setup Hooks with Triggers

**What it does:** The `--init` and `--maintenance` flags trigger Setup hooks with different trigger types, allowing different hook configurations for initialization vs. maintenance scenarios.

**Trigger Types:**

| Trigger | Flag | Use Case |
|---------|------|----------|
| `init` | `--init` | First-time project setup, environment initialization |
| `maintenance` | `--maintenance` | Routine maintenance tasks, cleanup operations |

### 2.2 Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HOOK EXECUTION DECISION FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Entry (mainEntry)                                                       │
│  │                                                                          │
│  ├─► Parse flags                                                            │
│  │   init = options.init ?? false                                           │
│  │   initOnly = options.initOnly ?? false                                   │
│  │   maintenance = options.maintenance ?? false                             │
│  │                                                                          │
│  ├─► setup() function call                                                  │
│  │   │                                                                      │
│  │   ├─► init flag set?                                                     │
│  │   │   └─► executeSetupHooks(trigger: "init")                            │
│  │   │                                                                      │
│  │   ├─► maintenance flag set?                                              │
│  │   │   └─► executeSetupHooks(trigger: "maintenance")                     │
│  │   │                                                                      │
│  │   └─► initOnly flag set?                                                 │
│  │       ├─► executeSetupHooks(trigger: "init")                            │
│  │       ├─► executeSessionStartHooks(trigger: "startup")                  │
│  │       └─► process.exit(0)  // Exit without starting session             │
│  │                                                                          │
│  └─► Continue to REPL (if not initOnly)                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. executeSetupHooks (OyA)

**What it does:** Executes Setup hooks with the specified trigger type. This function iterates through configured hooks and executes those matching the trigger.

**Key design decisions:**

**Why different trigger types:**
- **`init`** - For initial project setup tasks (installing dependencies, creating config files)
- **`maintenance`** - For routine maintenance (cleaning caches, updating dependencies)
- Allows different hook scripts for different scenarios

**Error handling:**
- Hook failures are logged but don't prevent session start (for `--init`/`--maintenance`)
- For `--init-only`, failures may cause exit with error code

---

## 4. Use Cases

### 4.1 CI/CD Integration

```bash
# Run initialization hooks before starting session
claude --init -p "Review the codebase"

# Run maintenance hooks for cleanup
claude --maintenance -p "Generate documentation"
```

### 4.2 Setup-Only Mode

```bash
# Run setup hooks and exit - useful for CI pipelines
claude --init-only

# Typical output:
# - Runs Setup:init hooks
# - Runs SessionStart:startup hooks
# - Exits without starting interactive session
```

### 4.3 Hook Configuration Example

```json
{
  "hooks": {
    "Setup": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "npm install",
            "trigger": "init"
          },
          {
            "type": "command",
            "command": "npm run clean-cache",
            "trigger": "maintenance"
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Session starting'",
            "trigger": "startup"
          }
        ]
      }
    ]
  }
}
```

---

## 5. Integration with Other Systems

### 5.1 Permission Mode Interaction

Hook flags can be combined with permission mode flags:

```bash
# Run init hooks with bypass permissions
claude --init --dangerously-skip-permissions -p "Setup project"

# Run maintenance with plan mode
claude --maintenance --permission-mode plan
```

### 5.2 Print Mode Integration

Hook flags work with print mode for non-interactive execution:

```bash
# Initialize and run a prompt
claude --init -p "Analyze the project structure"

# Maintenance and analyze
claude --maintenance -p "Generate code coverage report"
```

---

## 6. Flag Combination Rules

### 6.1 Valid Combinations

| Combination | Allowed | Behavior |
|-------------|---------|----------|
| `--init` alone | Yes | Run init hooks, continue to session |
| `--maintenance` alone | Yes | Run maintenance hooks, continue to session |
| `--init-only` alone | Yes | Run init + startup hooks, exit |
| `--init` + `--maintenance` | No | Mutually exclusive (use separate invocations) |
| `--init` + `--init-only` | No | Redundant, use `--init-only` only |

### 6.2 Validation

The CLI does not explicitly validate these combinations. If both are specified, the behavior depends on the order of processing in `setup()`.

---

## 7. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Flag definitions | `chunks.189.mjs:1017` | Commander hidden options |
| Flag extraction | `chunks.189.mjs:1054` | Action handler destructuring |
| Setup hooks execution | `chunks.142.mjs` | `executeSetupHooks` |
| Session start hooks | `chunks.142.mjs` | `executeSessionStartHooks` |
| Hook trigger types | `chunks.142.mjs` | init, maintenance, startup |

---

## 8. Debugging Hook Execution

### 8.1 Enable Debug Output

```bash
# See hook execution details
claude --debug hooks --init

# Debug output includes:
# - Which hooks are being executed
# - Command output from hook scripts
# - Execution timing
# - Any errors or failures
```

### 8.2 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Hooks not running | No hooks configured | Check settings.json for hook definitions |
| Hook fails silently | Non-zero exit code | Check debug output for error details |
| Wrong trigger type | Mismatch in config | Verify trigger field matches flag |