# Telemetry and Monitoring

## Overview

This document provides comprehensive documentation of all telemetry events, metrics collection, and monitoring capabilities for the auto memory system. Telemetry enables product analytics, performance monitoring, and feature usage tracking across the Claude Code user base.

**Key insight**: Three distinct telemetry events track the complete lifecycle: memory loading (every turn), toggle actions (user settings), and disable reasons (when feature is off).

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
  content_length: 0,            // 0 characters
  line_count: 0,                // 0 lines (empty string splits to [""])
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
  line_count: 0,                // Default to 0 on error
  was_truncated: false,         // Default to false on error
  memory_type: "auto",
  total_file_count: 0,          // Directory might not exist
  total_subdir_count: 0         // Directory might not exist
}
```

**Example 5: Agent memory (multi-agent scenario)**
```javascript
{
  content_length: 512,
  line_count: 20,
  was_truncated: false,
  memory_type: "agent",         // Agent-specific memory directory
  total_file_count: 2,
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
      ...basePayload,                     // Spread base payload (content_length, line_count, etc.)
      total_file_count: fileCount,        // Add file count
      total_subdir_count: subdirectoryCount // Add subdirectory count
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
-- Calculate percentage of loads that were truncated
SELECT
  COUNT(*) FILTER (WHERE was_truncated = true) * 100.0 / COUNT(*) AS truncation_rate_pct
FROM tengu_memdir_loaded_events
WHERE memory_type = 'auto';
```

**Use Case 2: Average File Size Distribution**
```sql
-- Bucket file sizes to identify common size ranges
SELECT
  CASE
    WHEN content_length < 1000 THEN '<1KB'
    WHEN content_length < 5000 THEN '1-5KB'
    WHEN content_length < 10000 THEN '5-10KB'
    WHEN content_length < 20000 THEN '10-20KB'
    ELSE '>20KB'
  END AS size_bucket,
  COUNT(*) AS occurrences
FROM tengu_memdir_loaded_events
GROUP BY size_bucket
ORDER BY size_bucket;
```

**Use Case 3: Topic File Adoption**
```sql
-- Calculate average number of topic files per project
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

### Payload Examples

**Example 1: User enables auto memory**
```javascript
{
  enabled: true
}
```

**Example 2: User disables auto memory**
```javascript
{
  enabled: false
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
  // Calculate new state
  const newEnabledState = !autoMemoryEnabled;

  // Persist to settings file
  updateUserSettings("userSettings", {
    autoMemoryEnabled: newEnabledState
  });

  // Log telemetry event IMMEDIATELY after settings update
  recordTelemetryEvent("tengu_auto_memory_toggled", {
    enabled: newEnabledState
  });

  // Update UI state
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
-- Calculate percentage of users who enable auto memory
SELECT
  COUNT(DISTINCT user_id) FILTER (WHERE enabled = true) * 100.0 / COUNT(DISTINCT user_id) AS adoption_rate_pct
FROM tengu_auto_memory_toggled_events;
```

**Use Case 2: Churn Analysis**
```sql
-- Identify users who disabled after initially enabling
SELECT user_id, timestamp
FROM tengu_auto_memory_toggled_events
WHERE enabled = false
  AND user_id IN (
    SELECT user_id
    FROM tengu_auto_memory_toggled_events
    WHERE enabled = true
  )
ORDER BY timestamp DESC;
```

**Use Case 3: Toggle Frequency**
```sql
-- Count how many times each user toggles (measure experimentation)
SELECT
  user_id,
  COUNT(*) AS toggle_count
FROM tengu_auto_memory_toggled_events
GROUP BY user_id
HAVING COUNT(*) > 5  -- Users who toggle frequently
ORDER BY toggle_count DESC;
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
{
  disabled_by_env_var: true,
  disabled_by_setting: false
}
```

**Example 2: Disabled by user setting**
```javascript
{
  disabled_by_env_var: false,
  disabled_by_setting: true
}
```

**Example 3: Disabled by both (env var takes precedence)**
```javascript
{
  disabled_by_env_var: true,
  disabled_by_setting: true  // Setting is true but overridden by env var
}
```

**Example 4: Disabled by feature flag default (research preview)**
```javascript
{
  disabled_by_env_var: false,
  disabled_by_setting: false  // User never explicitly enabled
}
// Note: This case is inferred from absence of enable path
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
    // Auto memory is disabled, log the reason
    recordTelemetryEvent("tengu_memdir_disabled", {
      disabled_by_env_var: disabledByEnvVar,
      disabled_by_setting: disabledBySetting
    });

    // Return null (no memory section in system prompt)
    return null;
  }

  // Auto memory is enabled, proceed normally
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
-- Calculate percentage of disabled states by reason
SELECT
  disabled_by_env_var,
  disabled_by_setting,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS percentage
FROM tengu_memdir_disabled_events
GROUP BY disabled_by_env_var, disabled_by_setting
ORDER BY percentage DESC;
```

**Example output**:
| disabled_by_env_var | disabled_by_setting | percentage |
|---------------------|---------------------|------------|
| false | false | 60% | (Feature flag default) |
| false | true | 30% | (User explicitly disabled) |
| true | false | 8% | (Env var override) |
| true | true | 2% | (Both) |

**Use Case 2: Corporate Environment Detection**
```sql
-- Identify organizations with high env var disable rate
SELECT
  organization_id,
  COUNT(*) FILTER (WHERE disabled_by_env_var = true) * 100.0 / COUNT(*) AS env_var_disable_rate_pct
FROM tengu_memdir_disabled_events
GROUP BY organization_id
HAVING env_var_disable_rate_pct > 50  -- More than half disabled by env var
ORDER BY env_var_disable_rate_pct DESC;
```

**Use Case 3: Opt-out After Trial**
```sql
-- Find users who loaded memory previously, then disabled via setting
SELECT user_id, COUNT(*) AS disabled_turns
FROM tengu_memdir_disabled_events
WHERE disabled_by_setting = true
  AND user_id IN (
    SELECT DISTINCT user_id
    FROM tengu_memdir_loaded_events  -- Previously had memory enabled
  )
GROUP BY user_id
ORDER BY disabled_turns DESC;
```

---

## Metrics Collection Function

### Directory Metrics Collection

```javascript
// ============================================
// recordMemoryDirLoadMetrics - Full implementation
// Location: chunks.87.mjs:2240-2254
// ============================================

// READABLE (for understanding):
async function recordMemoryDirLoadMetrics(basePayload, memoryDirectoryPath) {
  try {
    // Step 1: Read directory contents
    const fileNames = await fs.promises.readdir(memoryDirectoryPath);

    // Step 2: Get stats for each entry (parallel)
    const fileStats = await Promise.all(
      fileNames.map(async (name) => {
        const fullPath = path.join(memoryDirectoryPath, name);
        return await fs.promises.stat(fullPath);
      })
    );

    // Step 3: Count files vs directories
    let fileCount = 0;
    let subdirectoryCount = 0;

    fileStats.forEach((stat) => {
      if (stat.isFile()) {
        fileCount++;
      } else if (stat.isDirectory()) {
        subdirectoryCount++;
      }
      // Ignore symbolic links, sockets, etc.
    });

    // Step 4: Log event with full metrics
    recordTelemetryEvent("tengu_memdir_loaded", {
      ...basePayload,                       // content_length, line_count, was_truncated, memory_type
      total_file_count: fileCount,          // Files in directory
      total_subdir_count: subdirectoryCount // Subdirectories in directory
    });

  } catch (error) {
    // Directory doesn't exist, permission denied, or I/O error
    // Log event with base payload only
    recordTelemetryEvent("tengu_memdir_loaded", basePayload);
  }
}
```

**Performance characteristics**:
- **Async non-blocking**: Doesn't delay turn processing
- **Parallel stat calls**: Uses `Promise.all` for concurrent I/O
- **Best-effort**: If directory scan fails, still logs basic metrics
- **Graceful degradation**: Missing directory metrics don't block event

**Alternative implementations** (not used):
- **Synchronous**: `fs.readdirSync()` would block turn processing
- **Recursive scan**: Would count nested files (more expensive)
- **Cached counts**: Would need invalidation on file changes (complex)

---

## Monitoring Queries

### Query 1: Truncation Alert

**Purpose**: Alert when truncation rate spikes (indicates users hitting limits)

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

### Query 2: Oversized File Monitoring

**Purpose**: Detect files approaching character limit (40000 chars)

```sql
-- Files within 20% of character limit
SELECT
  project_id,
  content_length,
  line_count
FROM tengu_memdir_loaded_events
WHERE content_length > 32000  -- 80% of 40000
  AND memory_type = 'auto'
ORDER BY content_length DESC
LIMIT 100;
```

**Action**: Proactively notify users via TUI warning banner

---

### Query 3: Topic File Adoption Trend

**Purpose**: Track growth of topic file usage over time

```sql
-- Monthly average topic files per project
SELECT
  DATE_TRUNC('month', timestamp) AS month,
  AVG(total_file_count - 1) AS avg_topic_files  -- Subtract MEMORY.md
FROM (
  SELECT DISTINCT project_id, total_file_count, timestamp
  FROM tengu_memdir_loaded_events
  WHERE memory_type = 'auto'
) AS unique_projects
GROUP BY month
ORDER BY month DESC;
```

**Insight**: Increasing trend indicates users adopting best practice (topic files vs monolithic MEMORY.md)

---

### Query 4: Enable → Disable Funnel

**Purpose**: Understand feature churn

```sql
-- Users who enabled, then later disabled
WITH enable_events AS (
  SELECT DISTINCT user_id, MIN(timestamp) AS first_enable
  FROM tengu_auto_memory_toggled_events
  WHERE enabled = true
  GROUP BY user_id
),
disable_events AS (
  SELECT DISTINCT user_id, MIN(timestamp) AS first_disable
  FROM tengu_auto_memory_toggled_events
  WHERE enabled = false
  GROUP BY user_id
)
SELECT
  e.user_id,
  e.first_enable,
  d.first_disable,
  (d.first_disable - e.first_enable) AS time_to_churn
FROM enable_events e
JOIN disable_events d ON e.user_id = d.user_id
WHERE d.first_disable > e.first_enable
ORDER BY time_to_churn ASC;
```

**Insight**: Short `time_to_churn` indicates users tried feature and quickly abandoned

---

### Query 5: Directory Structure Patterns

**Purpose**: Identify common organization patterns

```sql
-- Distribution of directory structures
SELECT
  total_file_count,
  total_subdir_count,
  COUNT(*) AS project_count
FROM (
  SELECT DISTINCT project_id, total_file_count, total_subdir_count
  FROM tengu_memdir_loaded_events
  WHERE memory_type = 'auto'
) AS unique_projects
GROUP BY total_file_count, total_subdir_count
ORDER BY project_count DESC
LIMIT 20;
```

**Example output**:
| total_file_count | total_subdir_count | project_count |
|------------------|---------------------|---------------|
| 1 | 0 | 5000 | (Just MEMORY.md, no topic files) |
| 3 | 0 | 1200 | (MEMORY.md + 2 topic files) |
| 5 | 1 | 800 | (MEMORY.md + 4 topic files + subdirectory) |

**Insight**: Most common pattern is single MEMORY.md file (low topic file adoption)

---

## Verification Steps

### Test 1: Trigger `tengu_memdir_loaded` Event

**Objective**: Verify event is logged on every turn

**Setup**:
```bash
# Enable telemetry logging
export CLAUDE_CODE_TELEMETRY_LOG=1
export CLAUDE_CODE_TELEMETRY_LOG_FILE=/tmp/telemetry.log
```

**Steps**:
1. Start conversation
2. Send message: "Hello"
3. Check telemetry log

**Expected log entry**:
```json
{
  "event": "tengu_memdir_loaded",
  "timestamp": "2024-02-14T12:00:00Z",
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

**Verify**:
```bash
grep "tengu_memdir_loaded" /tmp/telemetry.log | jq .
```

---

### Test 2: Trigger `tengu_auto_memory_toggled` Event

**Objective**: Verify event is logged on toggle action

**Steps**:
1. Launch TUI, press `/memory`
2. Toggle auto memory OFF
3. Check telemetry log

**Expected log entry**:
```json
{
  "event": "tengu_auto_memory_toggled",
  "timestamp": "2024-02-14T12:01:00Z",
  "payload": {
    "enabled": false
  }
}
```

**Verify**:
```bash
grep "tengu_auto_memory_toggled" /tmp/telemetry.log | tail -1 | jq .
```

---

### Test 3: Trigger `tengu_memdir_disabled` Event

**Objective**: Verify event is logged when feature is disabled

**Setup**:
```bash
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

**Steps**:
1. Start conversation
2. Send message: "Hello"
3. Check telemetry log

**Expected log entry**:
```json
{
  "event": "tengu_memdir_disabled",
  "timestamp": "2024-02-14T12:02:00Z",
  "payload": {
    "disabled_by_env_var": true,
    "disabled_by_setting": false
  }
}
```

**Verify**:
```bash
grep "tengu_memdir_disabled" /tmp/telemetry.log | jq .
```

---

### Test 4: Verify Directory Metrics Collection

**Objective**: Confirm `total_file_count` and `total_subdir_count` are accurate

**Setup**:
```bash
MEMORY_DIR=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/
mkdir -p "$MEMORY_DIR/archive"
touch "$MEMORY_DIR/MEMORY.md"
touch "$MEMORY_DIR/debugging.md"
touch "$MEMORY_DIR/patterns.md"
```

**Steps**:
1. Start conversation
2. Send message: "Hello"
3. Check telemetry log

**Expected payload**:
```json
{
  "total_file_count": 3,       // MEMORY.md + debugging.md + patterns.md
  "total_subdir_count": 1      // archive/
}
```

**Verify**:
```bash
grep "tengu_memdir_loaded" /tmp/telemetry.log | tail -1 | jq '.payload.total_file_count, .payload.total_subdir_count'
# Output: 3 1
```

---

### Test 5: Verify Truncation Metric

**Objective**: Confirm `was_truncated` is true when file > 200 lines

**Setup**:
```bash
MEMORY_PATH=~/.claude/projects/$(ls ~/.claude/projects | head -1)/memory/MEMORY.md
printf '# Line %d\n' {1..250} > "$MEMORY_PATH"
```

**Steps**:
1. Start conversation
2. Send message: "Hello"
3. Check telemetry log

**Expected payload**:
```json
{
  "line_count": 250,
  "was_truncated": true
}
```

**Verify**:
```bash
grep "tengu_memdir_loaded" /tmp/telemetry.log | tail -1 | jq '.payload.line_count, .payload.was_truncated'
# Output: 250 true
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `recordMemoryDirLoadMetrics` (cN9) - Collects directory metrics and logs `tengu_memdir_loaded` event
- `recordTelemetryEvent` (recordTelemetry / recordEvent) - Sends telemetry event to analytics backend

---

## Key Takeaways

1. **Three lifecycle events**: Load (every turn), toggle (user action), disabled (when off)
2. **Rich payload structure**: Tracks content size, truncation, directory structure
3. **Best-effort collection**: Directory metrics gracefully degrade on error
4. **Analytics-driven**: Events designed for product insights and monitoring
5. **Privacy-conscious**: No file content logged, only metadata

**Design rationale**:
- ✅ **Comprehensive tracking**: Covers all user interactions and state changes
- ✅ **Actionable metrics**: Enables data-driven UX improvements
- ✅ **Non-blocking**: Async directory scanning doesn't delay turns
- ✅ **Privacy-safe**: Only logs counts and sizes, not content
- ⚠️ **Metric overhead**: Directory scan adds I/O cost (minimal impact)

**Trade-offs**:
- **Granularity vs Privacy**: Log detailed metrics but not file content
- **Accuracy vs Performance**: Async collection is best-effort (may miss edge cases)
- **Completeness vs Complexity**: Three events cover lifecycle without over-instrumentation
