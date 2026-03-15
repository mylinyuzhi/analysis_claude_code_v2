# Telemetry and Monitoring

## Overview

This document provides comprehensive documentation of all telemetry events, metrics collection, and monitoring capabilities for the auto memory system. Telemetry enables product analytics, performance monitoring, and feature usage tracking across the Claude Code user base.

**Key insight**: Three distinct telemetry events track the complete lifecycle: memory loading (every turn), toggle actions (user settings), and disable reasons (when feature is off).

**Version**: Claude Code v2.1.76

---

## Telemetry Event 1: `tengu_memdir_loaded`

### Trigger Condition

**When**: After MEMORY.md read completes successfully OR fails

**Frequency**: Once per conversation turn (if auto memory is enabled)

**Location**: chunks.87.mjs:2282-2287

### Event Payload Structure

```javascript
{
  // File content metrics
  content_length: number,        // Character count of MEMORY.md
  line_count: number,            // Line count of MEMORY.md
  was_truncated: boolean,        // true if line_count > 200

  // Memory scope
  memory_type: "auto" | "agent", // "auto" for project memory, "agent" for agent-specific

  // Directory structure metrics
  total_file_count: number,      // Total files in memory directory
  total_subdir_count: number     // Total subdirectories in memory directory
}
```

### Payload Examples

**Example 1: Normal load (file within limits)**
```javascript
{
  content_length: 1024,         // 1KB file
  line_count: 42,               // 42 lines
  was_truncated: false,         // Within 200-line limit
  memory_type: "auto",
  total_file_count: 3,          // MEMORY.md + 2 topic files
  total_subdir_count: 0         // No subdirectories
}
```

**Example 2: Truncated load (file exceeds line limit)**
```javascript
{
  content_length: 15000,        // 15KB file
  line_count: 250,              // 250 lines (50 over limit)
  was_truncated: true,          // Truncated to 200 lines
  memory_type: "auto",
  total_file_count: 5,
  total_subdir_count: 1         // Has a subdirectory (e.g., "archive/")
}
```

**Example 3: Empty file (file exists but is empty)**
```javascript
{
  content_length: 0,
  line_count: 0,
  was_truncated: false,
  memory_type: "auto",
  total_file_count: 1,          // Only MEMORY.md
  total_subdir_count: 0
}
```

**Example 4: File read error (file doesn't exist or permission denied)**
```javascript
{
  content_length: 0,            // Default to 0 on error
  line_count: 0,
  was_truncated: false,
  memory_type: "auto",
  total_file_count: 0,          // Directory might not exist
  total_subdir_count: 0
}
```

### Code Analysis

```javascript
// ============================================
// recordMemoryDirLoadMetrics - Collects directory metrics and logs event
// Location: chunks.87.mjs:2240-2254
// ============================================

// ORIGINAL (for source lookup):
async function cN9(A, q) {
  try {
    const files = await fs.promises.readdir(q);
    const stats = await Promise.all(files.map(f => fs.promises.stat(path.join(q, f))));

    const fileCount = stats.filter(s => s.isFile()).length;
    const subdirCount = stats.filter(s => s.isDirectory()).length;

    recordEvent("tengu_memdir_loaded", {
      ...A,
      total_file_count: fileCount,
      total_subdir_count: subdirCount
    });
  } catch (error) {
    // Directory doesn't exist or permission denied
    recordEvent("tengu_memdir_loaded", A);
  }
}

// READABLE (for understanding):
async function recordMemoryDirLoadMetrics(basePayload, memoryDirectoryPath) {
  try {
    // Read directory contents
    const fileNames = await fs.promises.readdir(memoryDirectoryPath);

    // Get file stats for each entry
    const fileStats = await Promise.all(
      fileNames.map(name =>
        fs.promises.stat(path.join(memoryDirectoryPath, name))
      )
    );

    // Count files vs directories
    const fileCount = fileStats.filter(stat => stat.isFile()).length;
    const subdirectoryCount = fileStats.filter(stat => stat.isDirectory()).length;

    // Log event with directory metrics
    recordTelemetryEvent("tengu_memdir_loaded", {
      ...basePayload,
      total_file_count: fileCount,
      total_subdir_count: subdirectoryCount
    });

  } catch (error) {
    // Directory doesn't exist or permission denied
    // Log event with base payload only (no directory metrics)
    recordTelemetryEvent("tengu_memdir_loaded", basePayload);
  }
}

// Mapping: cN9→recordMemoryDirLoadMetrics, recordEvent→recordTelemetryEvent
```

**How it works:**
1. **Base payload constructed**: After file read, includes `content_length`, `line_count`, `was_truncated`
2. **Directory scan**: Asynchronously reads directory contents
3. **Stat collection**: Gets file stats for each entry to distinguish files from directories
4. **Count calculation**: Filters stats by type and counts
5. **Event logging**: Merges base payload with directory metrics and sends event
6. **Error handling**: If directory scan fails, logs base payload only

**Why async directory scan?**
- **Non-blocking**: Doesn't delay turn processing (telemetry is best-effort)
- **Parallel stats**: `Promise.all` fetches all stats concurrently
- **Graceful degradation**: If scan fails, still logs basic metrics

### Analytics Use Cases

**Use Case 1: Truncation Rate Analysis**
```sql
SELECT
  COUNT(*) FILTER (WHERE was_truncated = true) * 100.0 / COUNT(*) AS truncation_rate_pct
FROM tengu_memdir_loaded_events
WHERE memory_type = 'auto';
```

**Use Case 2: Topic File Adoption**
```sql
SELECT
  AVG(total_file_count - 1) AS avg_topic_files  -- Subtract 1 for MEMORY.md
FROM (
  SELECT DISTINCT project_id, total_file_count
  FROM tengu_memdir_loaded_events
  WHERE memory_type = 'auto'
) AS unique_projects;
```

---

## Telemetry Event 2: `tengu_auto_memory_toggled`

### Trigger Condition

**When**: User clicks toggle switch in memory editor modal (`/memory`)

**Frequency**: Once per toggle action (relatively rare)

**Location**: chunks.155.mjs:565-567

### Event Payload Structure

```javascript
{
  enabled: boolean   // true if toggled ON, false if toggled OFF
}
```

### Code Analysis

```javascript
// ============================================
// Auto Memory Toggle Handler with Telemetry
// Location: chunks.155.mjs:561-568
// ============================================

// ORIGINAL (for source lookup):
const handleToggle = () => {
  const newValue = !autoMemoryEnabled;
  Z7("userSettings", { autoMemoryEnabled: newValue });
  recordTelemetry("tengu_auto_memory_toggled", { enabled: newValue });
  setAutoMemoryEnabled(newValue);
};

// READABLE (for understanding):
const handleAutoMemoryToggle = () => {
  const newEnabledState = !autoMemoryEnabled;

  updateUserSettings("userSettings", {
    autoMemoryEnabled: newEnabledState
  });

  // Log telemetry event IMMEDIATELY after settings update
  recordTelemetryEvent("tengu_auto_memory_toggled", {
    enabled: newEnabledState
  });

  setAutoMemoryEnabled(newEnabledState);
};

// Mapping: recordTelemetry→recordTelemetryEvent, Z7→updateUserSettings
```

**Why log after settings update?**
- **Ensures persistence**: Only log if settings were successfully written
- **Consistency**: Logged state matches persisted state
- **Audit trail**: Can correlate with actual feature usage

### Analytics Use Cases

**Use Case 1: Adoption Rate**
```sql
SELECT
  COUNT(DISTINCT user_id) FILTER (WHERE enabled = true) * 100.0 / COUNT(DISTINCT user_id) AS adoption_rate_pct
FROM tengu_auto_memory_toggled_events;
```

**Use Case 2: Churn Analysis**
```sql
WITH enable_events AS (
  SELECT DISTINCT user_id, MIN(timestamp) AS first_enable
  FROM tengu_auto_memory_toggled_events WHERE enabled = true GROUP BY user_id
),
disable_events AS (
  SELECT DISTINCT user_id, MIN(timestamp) AS first_disable
  FROM tengu_auto_memory_toggled_events WHERE enabled = false GROUP BY user_id
)
SELECT e.user_id, (d.first_disable - e.first_enable) AS time_to_churn
FROM enable_events e JOIN disable_events d ON e.user_id = d.user_id
WHERE d.first_disable > e.first_enable;
```

---

## Telemetry Event 3: `tengu_memdir_disabled`

### Trigger Condition

**When**: Turn starts and auto memory is disabled (feature flag check returns false)

**Frequency**: Once per conversation turn when disabled

**Location**: chunks.87.mjs:2304-2306

### Event Payload Structure

```javascript
{
  disabled_by_env_var: boolean,   // true if CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
  disabled_by_setting: boolean    // true if userSettings.autoMemoryEnabled=false
}
```

### Payload Examples

**Example 1: Disabled by environment variable**
```javascript
{ disabled_by_env_var: true, disabled_by_setting: false }
```

**Example 2: Disabled by user setting**
```javascript
{ disabled_by_env_var: false, disabled_by_setting: true }
```

**Example 3: Disabled by feature flag default (research preview)**
```javascript
{
  disabled_by_env_var: false,
  disabled_by_setting: false  // User never explicitly enabled
}
```

### Code Analysis

```javascript
// ============================================
// Telemetry for Disabled State
// Location: chunks.87.mjs:2304-2306
// ============================================

// READABLE (for understanding):
function getMemoryContext() {
  const disabledByEnvVar = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY === "1";
  const disabledBySetting = userSettings.autoMemoryEnabled === false;

  if (!isAutoMemoryEnabled()) {
    recordTelemetryEvent("tengu_memdir_disabled", {
      disabled_by_env_var: disabledByEnvVar,
      disabled_by_setting: disabledBySetting
    });

    return null;
  }

  return buildMemoryPrompt();
}
```

**Why track disable reasons?**
- **Product analytics**: Understand why users don't adopt feature
- **Environment overrides**: Detect corporate policies disabling via env var
- **Setting churn**: Track users who explicitly disable in UI
- **Feature flag coverage**: Infer default behavior when neither env var nor setting is set

### Analytics Use Cases

**Use Case 1: Disable Reason Distribution**
```sql
SELECT
  disabled_by_env_var,
  disabled_by_setting,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS percentage
FROM tengu_memdir_disabled_events
GROUP BY disabled_by_env_var, disabled_by_setting
ORDER BY percentage DESC;
```

Example output:
| disabled_by_env_var | disabled_by_setting | percentage |
|---------------------|---------------------|------------|
| false | false | 60% | (Feature flag default) |
| false | true | 30% | (User explicitly disabled) |
| true | false | 8% | (Env var override) |
| true | true | 2% | (Both) |

---

## Monitoring Queries

### Query 1: Truncation Alert

```sql
-- Daily truncation rate (for alerting)
SELECT
  DATE(timestamp) AS date,
  COUNT(*) FILTER (WHERE was_truncated = true) * 100.0 / COUNT(*) AS truncation_rate_pct
FROM tengu_memdir_loaded_events
WHERE memory_type = 'auto'
  AND timestamp >= NOW() - INTERVAL '7 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

**Alert threshold**: If `truncation_rate_pct > 10%`, investigate UX improvements

---

### Query 2: Topic File Adoption Trend

```sql
-- Monthly average topic files per project
SELECT
  DATE_TRUNC('month', timestamp) AS month,
  AVG(total_file_count - 1) AS avg_topic_files
FROM (
  SELECT DISTINCT project_id, total_file_count, timestamp
  FROM tengu_memdir_loaded_events WHERE memory_type = 'auto'
) AS unique_projects
GROUP BY month ORDER BY month DESC;
```

---

## Verification Steps

### Test 1: Trigger `tengu_memdir_loaded` Event

```bash
export CLAUDE_CODE_TELEMETRY_LOG=1
export CLAUDE_CODE_TELEMETRY_LOG_FILE=/tmp/telemetry.log
```

Start conversation, send message, then check:
```bash
grep "tengu_memdir_loaded" /tmp/telemetry.log | jq .
```

**Expected log entry**:
```json
{
  "event": "tengu_memdir_loaded",
  "payload": {
    "content_length": 0,
    "line_count": 0,
    "was_truncated": false,
    "memory_type": "auto",
    "total_file_count": 0,
    "total_subdir_count": 0
  }
}
```

### Test 2: Trigger `tengu_auto_memory_toggled` Event

1. Launch TUI, press `/memory`
2. Toggle auto memory OFF
3. Check: `grep "tengu_auto_memory_toggled" /tmp/telemetry.log | tail -1 | jq .`

### Test 3: Verify Directory Metrics Collection

```bash
MEMORY_DIR=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/
mkdir -p "$MEMORY_DIR/archive"
touch "$MEMORY_DIR/MEMORY.md" "$MEMORY_DIR/debugging.md" "$MEMORY_DIR/patterns.md"
```

Expected payload after next turn: `total_file_count: 3, total_subdir_count: 1`

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `recordMemoryDirLoadMetrics` (cN9) - Collects directory metrics and logs `tengu_memdir_loaded` event
- `recordTelemetryEvent` (recordEvent) - Sends telemetry event to analytics backend

---

## Key Takeaways

1. **Three lifecycle events**: Load (every turn), toggle (user action), disabled (when off)
2. **Rich payload structure**: Tracks content size, truncation, directory structure
3. **Best-effort collection**: Directory metrics gracefully degrade on error
4. **Analytics-driven**: Events designed for product insights and monitoring
5. **Privacy-conscious**: No file content logged, only metadata

**Design rationale**:
- Comprehensive tracking: Covers all user interactions and state changes
- Actionable metrics: Enables data-driven UX improvements
- Non-blocking: Async directory scanning doesn't delay turns
- Privacy-safe: Only logs counts and sizes, not content

**Trade-offs**:
- **Granularity vs Privacy**: Log detailed metrics but not file content
- **Accuracy vs Performance**: Async collection is best-effort (may miss edge cases)
- **Completeness vs Complexity**: Three events cover lifecycle without over-instrumentation
