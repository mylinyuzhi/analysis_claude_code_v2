# High Watermark Algorithm Complete Analysis (Claude Code 2.1.76)

> Complete analysis of task ID auto-increment and high watermark tracking.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions:
- `writeHighWaterMark` (P84) - Update max ID - chunks.84.mjs:1580
- `getMaxTaskIdFromFiles` (W84) - Scan files for max ID
- `readHighWaterMarkFile` (zT8) - Read watermark file

---

## Overview

The high watermark algorithm ensures unique, monotonically increasing task IDs across concurrent operations and task deletions.

---

## Algorithm Design

### Goals

1. **Unique IDs**: No two tasks get the same ID
2. **Monotonic**: IDs always increase
3. **Gap handling**: Deleted task IDs are not reused
4. **Concurrent safe**: Multiple processes can create tasks

### Data Structures

```
~/.claude/tasks/{team-name}/
├── 1.json           # Task file
├── 2.json           # Task file
├── 3.json           # Task file
└── .highwatermark   # File containing max ID seen
```

---

## Algorithm Steps

```javascript
// ============================================
// Task ID generation algorithm
// ============================================

async function getNextTaskId(taskManager) {
    // 1. Read current high watermark
    const watermark = await readHighWaterMarkFile(taskManager);

    // 2. Also scan files (handles manual additions)
    const maxFromFile = await getMaxTaskIdFromFiles(taskManager);

    // 3. Take the maximum
    const nextId = Math.max(watermark, maxFromFile) + 1;

    // 4. Update high watermark
    await writeHighWaterMark(taskManager, nextId);

    return String(nextId);
}
```

### Edge Cases

```javascript
// Task deletion handling
async function deleteTask(taskManager, taskId) {
    const taskIdInt = parseInt(taskId, 10);

    // If deleting the highest ID, update watermark
    const currentMax = await readHighWaterMarkFile(taskManager);
    if (taskIdInt >= currentMax) {
        // Scan files to find new max
        const newMax = await getMaxTaskIdFromFiles(taskManager);
        await writeHighWaterMark(taskManager, Math.max(taskIdInt, newMax));
    }

    // Delete the file
    await deleteFile(getTaskFilePath(taskManager, taskId));

    // Clean up dependency references
    await cleanupDependencies(taskManager, taskId);
}
```

---

## Concurrency Handling

### File Locking

```javascript
// Lock configuration
const lockOptions = {
    retries: 10,
    minTimeout: 5,    // 5ms minimum wait
    maxTimeout: 100   // 100ms maximum wait
};

async function withLock(taskManager, operation) {
    const lockPath = getTaskFilePath(taskManager, ".lock");
    await properLockfile.lock(lockPath, lockOptions);
    try {
        return await operation();
    } finally {
        await properLockfile.unlock(lockPath);
    }
}
```

---

## Implementation

```javascript
// ============================================
// P84 (writeHighWaterMark) - Update watermark
// Location: chunks.84.mjs:1580
// ============================================

async function writeHighWaterMark(taskManager, id) {
    const watermarkPath = getTaskDirectory(taskManager) + "/.highwatermark";
    await writeFile(watermarkPath, String(id));
}

// ============================================
// W84 (getMaxTaskIdFromFiles) - Scan files
// ============================================

async function getMaxTaskIdFromFiles(taskManager) {
    const dir = getTaskDirectory(taskManager);
    const files = await readdir(dir);

    let maxId = 0;
    for (const file of files) {
        const match = file.match(/^(\d+)\.json$/);
        if (match) {
            const id = parseInt(match[1], 10);
            maxId = Math.max(maxId, id);
        }
    }

    return maxId;
}
```

---

## Source Code Restoration

### High Watermark File Path

```javascript
// ============================================
// X84 - Get high watermark file path
// Location: chunks.84.mjs:1565-1567
// ============================================

// ORIGINAL (for source lookup):
function X84(A) {
    return kF6(wR(A), _N9)
}

// READABLE (for understanding):
function getHighWatermarkFilePath(taskListId) {
    return path.join(getTaskDirectory(taskListId), HIGHWATERMARK_FILENAME);
}

// Mapping: X84→getHighWatermarkFilePath, A→taskListId, kF6→path.join, wR→getTaskDirectory, _N9→HIGHWATERMARK_FILENAME
```

### readHighWaterMarkFile (zT8)

**What it does:**
Reads the `.highwatermark` file and returns the stored maximum task ID. Returns 0 if the file doesn't exist or contains invalid data.

**How it works:**
1. Construct the watermark file path
2. Read file contents with UTF-8 encoding
3. Parse as integer, defaulting to 0 on any error

```javascript
// ============================================
// zT8 - readHighWaterMarkFile
// Location: chunks.84.mjs:1569-1578
// ============================================

// ORIGINAL (for source lookup):
async function zT8(A) {
    let q = X84(A);
    try {
        let K = (await H84(q, "utf-8")).trim(),
            Y = parseInt(K, 10);
        return isNaN(Y) ? 0 : Y
    } catch {
        return 0
    }
}

// READABLE (for understanding):
async function readHighWaterMarkFile(taskListId) {
    const watermarkPath = getHighWatermarkFilePath(taskListId);
    try {
        const content = (await readFile(watermarkPath, "utf-8")).trim();
        const watermark = parseInt(content, 10);
        return isNaN(watermark) ? 0 : watermark;
    } catch {
        // File doesn't exist or read error
        return 0;
    }
}

// Mapping: zT8→readHighWaterMarkFile, A→taskListId, q→watermarkPath, K→content, Y→watermark, H84→readFile
```

### writeHighWaterMark (P84)

**What it does:**
Writes a new high watermark value to the `.highwatermark` file.

```javascript
// ============================================
// P84 - writeHighWaterMark
// Location: chunks.84.mjs:1580-1583
// ============================================

// ORIGINAL (for source lookup):
async function P84(A, q) {
    let K = X84(A);
    await iD1(K, String(q))
}

// READABLE (for understanding):
async function writeHighWaterMark(taskListId, id) {
    const watermarkPath = getHighWatermarkFilePath(taskListId);
    await writeFile(watermarkPath, String(id));
}

// Mapping: P84→writeHighWaterMark, A→taskListId, q→id, K→watermarkPath, iD1→writeFile
```

### getMaxTaskIdFromFiles (W84)

**What it does:**
Scans the task directory for all `.json` files and extracts the maximum task ID from filenames. This handles edge cases where tasks are manually added or the watermark file is out of sync.

**How it works:**
1. Read directory contents
2. Filter for `.json` files
3. Parse numeric IDs from filenames
4. Return the maximum ID found (or 0 if none)

```javascript
// ============================================
// W84 - getMaxTaskIdFromFiles
// Location: chunks.84.mjs:1647-1661
// ============================================

// ORIGINAL (for source lookup):
async function W84(A) {
    let q = wR(A),
        K;
    try {
        K = await YT8(q)
    } catch {
        return 0
    }
    let Y = 0;
    for (let z of K) {
        if (!z.endsWith(".json")) continue;
        let _ = parseInt(z.replace(".json", ""), 10);
        if (!isNaN(_) && _ > Y) Y = _
    }
    return Y
}

// READABLE (for understanding):
async function getMaxTaskIdFromFiles(taskListId) {
    const taskDir = getTaskDirectory(taskListId);
    let files;
    try {
        files = await readdir(taskDir);
    } catch {
        return 0; // Directory doesn't exist
    }

    let maxId = 0;
    for (const file of files) {
        if (!file.endsWith(".json")) continue;
        const id = parseInt(file.replace(".json", ""), 10);
        if (!isNaN(id) && id > maxId) {
            maxId = id;
        }
    }
    return maxId;
}

// Mapping: W84→getMaxTaskIdFromFiles, A→taskListId, q→taskDir, K→files, Y→maxId, YT8→readdir
```

### getHighWaterMark (wN9)

**What it does:**
Returns the effective high watermark by taking the maximum of the file scan and the watermark file. This ensures robustness against manual file additions.

```javascript
// ============================================
// wN9 - getHighWaterMark
// Location: chunks.84.mjs:1664-1667
// ============================================

// ORIGINAL (for source lookup):
async function wN9(A) {
    let [q, K] = await Promise.all([W84(A), zT8(A)]);
    return Math.max(q, K)
}

// READABLE (for understanding):
async function getHighWaterMark(taskListId) {
    const [maxFromFiles, watermarkFromFile] = await Promise.all([
        getMaxTaskIdFromFiles(taskListId),
        readHighWaterMarkFile(taskListId)
    ]);
    return Math.max(maxFromFiles, watermarkFromFile);
}

// Mapping: wN9→getHighWaterMark, A→taskListId, q→maxFromFiles, K→watermarkFromFile, W84→getMaxTaskIdFromFiles, zT8→readHighWaterMarkFile
```

---

## Key Design Decisions

### Why Both File Scan and Watermark File?

**What it does:**
The algorithm uses two sources of truth: scanning files and reading the watermark file.

**Why this approach:**
- **File scan** catches manually added tasks that bypass the API
- **Watermark file** is fast for normal operations
- **Taking max** ensures no ID collisions

**Trade-offs:**
- Extra I/O overhead (but parallelized with Promise.all)
- Guaranteed uniqueness even with manual file manipulation

### Watermark File vs. Database

**Why a file?**
- No database dependency
- Simple atomic writes
- Human-readable for debugging
- Works with file locking for concurrency

---

## Constants

```javascript
// ============================================
// _N9 - HIGHWATERMARK_FILENAME
// Location: chunks.84.mjs:1914
// ============================================

// ORIGINAL (for source lookup):
_N9 = ".highwatermark"

// READABLE (for understanding):
const HIGHWATERMARK_FILENAME = ".highwatermark";
```

---

## Quick Reference

### File Structure

```
.highwatermark  → Contains single number (max ID seen)
{N}.json        → Task file with ID N
.lock           → Lock file for concurrent access
```

### Key Functions

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| X84 | getHighWatermarkFilePath | Build watermark path |
| zT8 | readHighWaterMarkFile | Read max ID |
| P84 | writeHighWaterMark | Write max ID |
| W84 | getMaxTaskIdFromFiles | Scan files |
| wN9 | getHighWaterMark | Combined max |
| _N9 | HIGHWATERMARK_FILENAME | ".highwatermark" |
| nD1 | lockOptions | Lock config |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced concurrency handling |
| 2.1.32 | Initial high watermark system |