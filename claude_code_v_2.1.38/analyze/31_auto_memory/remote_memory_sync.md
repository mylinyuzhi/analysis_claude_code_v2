# Remote Memory Sync - Shared Memory for Distributed Teams

> **Module**: Auto Memory - Remote Storage
> **Source**: `chunks.87.mjs` (lines 2204-2221) - Remote memory directory resolution
> **Version**: Claude Code 2.1.38

---

## Table of Contents

1. [Overview](#1-overview)
2. [Remote Memory Architecture](#2-remote-memory-architecture)
3. [Configuration Setup](#3-configuration-setup)
4. [Directory Resolution with Remote Override](#4-directory-resolution-with-remote-override)
5. [Network Storage Requirements](#5-network-storage-requirements)
6. [Synchronization Behavior](#6-synchronization-behavior)
7. [Distributed Team Setup Examples](#7-distributed-team-setup-examples)
8. [Error Handling and Fallbacks](#8-error-handling-and-fallbacks)
9. [Performance Considerations](#9-performance-considerations)
10. [Related Documents](#10-related-documents)

---

## 1. Overview

Remote memory enables multiple Claude Code instances (on different machines or sessions) to share the same memory directory via network storage. This is critical for distributed agent teams and multi-machine development workflows.

### Use Cases

**Distributed agent teams**: Team lead on laptop, teammates on cloud VMs
```
Laptop (team lead) ────┐
                       ├──> Shared NFS /mnt/memory/
Cloud VM 1 (teammate) ─┤
Cloud VM 2 (teammate) ─┘
```

**Multi-machine development**: Desktop + laptop working on same project
```
Desktop (home) ────┐
                   ├──> Dropbox ~/Dropbox/.claude-memory/
Laptop (office) ───┘
```

**Remote SSH sessions**: Local machine SSH to remote server
```
Local machine → SSH → Remote server
                      Remote server uses local memory via SSHFS mount
```

### Key Benefits

**Shared knowledge**: All agents see same MEMORY.md, learn from each other's discoveries

**Continuity**: Switch machines mid-task, memory persists

**Team coordination**: Shared debugging notes, patterns, architecture decisions

---

## 2. Remote Memory Architecture

### Environment Variable Override

The remote memory system works via a single environment variable:

```bash
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/path/to/shared/storage
```

**When set**: All memory operations use this directory as the base instead of `~/.claude/`

**When unset**: Standard local behavior (`~/.claude/projects/{hash}/memory/`)

### Override Priority in Directory Resolution

```javascript
// From chunks.87.mjs:2204-2207
function getHomeDirectory() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    }
    return os.homedir();  // ~/.
}
```

**Priority order**:
1. `CLAUDE_CODE_REMOTE_MEMORY_DIR` (if set)
2. `os.homedir()` (standard user home directory)

### Full Directory Construction

```javascript
// From chunks.87.mjs:2213-2216
function getAutoMemoryDirectory() {
    let homeDir = getHomeDirectory();  // Remote override happens here
    let projectsDir = path.join(homeDir, "projects");
    let projectHash = hashPath(getCurrentContextPath());
    let memoryDir = path.join(projectsDir, projectHash, "memory");
    return memoryDir.normalize("NFC");
}
```

**Example resolution**:
```bash
# Without remote override
CLAUDE_CODE_REMOTE_MEMORY_DIR=  # unset
→ homeDir = /Users/alice
→ memoryDir = /Users/alice/.claude/projects/abc123/memory/

# With remote override
CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/shared
→ homeDir = /mnt/shared
→ memoryDir = /mnt/shared/projects/abc123/memory/
```

---

## 3. Configuration Setup

### Basic Setup (NFS/SMB)

**Step 1: Mount network storage**

```bash
# NFS example
sudo mkdir -p /mnt/claude-memory
sudo mount -t nfs server.example.com:/exports/claude-memory /mnt/claude-memory

# Verify mount
ls /mnt/claude-memory  # Should be accessible
```

**Step 2: Set environment variable**

```bash
# In ~/.bashrc or ~/.zshrc
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/claude-memory

# Reload shell config
source ~/.bashrc
```

**Step 3: Verify configuration**

```bash
# Start Claude Code
claude

# Memory should now be at /mnt/claude-memory/projects/{hash}/memory/
# Check with:
echo "Check memory location" | claude --non-interactive
# Then inspect logs or use Read tool to check path
```

### Advanced Setup (SSHFS)

**Scenario**: Local machine wants to use remote server's memory

**Step 1: Install SSHFS**

```bash
# macOS
brew install macfuse sshfs

# Linux
sudo apt install sshfs
```

**Step 2: Mount remote directory**

```bash
# Create local mount point
mkdir -p ~/mnt/remote-claude

# Mount remote server's .claude directory
sshfs user@remote-server:/home/user/.claude ~/mnt/remote-claude

# Verify
ls ~/mnt/remote-claude/projects  # Should show remote projects
```

**Step 3: Configure Claude Code**

```bash
# Use remote directory
export CLAUDE_CODE_REMOTE_MEMORY_DIR=~/mnt/remote-claude

# Start Claude Code - now using remote memory
claude
```

**Step 4: Unmount when done**

```bash
# Unmount
umount ~/mnt/remote-claude
# or
fusermount -u ~/mnt/remote-claude  # Linux
```

### Cloud Storage Setup (Dropbox/Google Drive)

**Step 1: Install and configure cloud sync**

```bash
# Dropbox example
# 1. Install Dropbox
# 2. Create .claude-memory directory in Dropbox
mkdir -p ~/Dropbox/.claude-memory
```

**Step 2: Configure on all machines**

```bash
# Machine 1 (Desktop)
export CLAUDE_CODE_REMOTE_MEMORY_DIR=~/Dropbox/.claude-memory

# Machine 2 (Laptop)
export CLAUDE_CODE_REMOTE_MEMORY_DIR=~/Dropbox/.claude-memory
```

**Step 3: Wait for initial sync**

```bash
# Give Dropbox time to sync (check status icon)
# Then start Claude Code on both machines
```

**Limitations**:
- ⚠️ Cloud storage has sync latency (seconds to minutes)
- ⚠️ Conflict files may appear if both machines write simultaneously
- ⚠️ Not recommended for real-time collaboration (use NFS instead)

---

## 4. Directory Resolution with Remote Override

### Code Flow with Remote Override

```javascript
// ============================================
// getHomeDirectory - Remote memory override
// Location: chunks.87.mjs:2204-2207
// ============================================

// ORIGINAL (for source lookup):
function ga() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    return O8()
}

// READABLE (for understanding):
function getHomeDirectory() {
    // Check for remote memory override
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    }

    // Default to user's home directory
    return os.homedir();  // /Users/alice, /home/bob, etc.
}

// Mapping: ga→getHomeDirectory, O8→os.homedir


// ============================================
// getAutoMemoryDirectory - Full path resolution
// Location: chunks.87.mjs:2213-2216
// ============================================

// ORIGINAL (for source lookup):
function mu1() {
    let A = cO6(ga(), "projects");
    return (cO6(A, dx(LU7()), kU7) + UN9).normalize("NFC")
}

// READABLE (for understanding):
function getAutoMemoryDirectory() {
    // Step 1: Get base directory (remote or local)
    let homeDir = getHomeDirectory();

    // Step 2: Build projects directory
    let projectsDir = path.join(homeDir, "projects");

    // Step 3: Hash current context path (cwd or session context)
    let contextPath = getCurrentContextPath();
    let projectHash = hashPath(contextPath);

    // Step 4: Build full memory directory path
    let memoryDir = path.join(projectsDir, projectHash, "memory") + "/";

    // Step 5: Normalize Unicode
    return memoryDir.normalize("NFC");
}

// Mapping: mu1→getAutoMemoryDirectory, ga→getHomeDirectory, cO6→path.join, dx→hashPath, LU7→getCurrentContextPath, kU7→"memory", UN9→"/"
```

### Resolution Examples

**Example 1: Local memory (default)**
```bash
# No remote override
$ env | grep CLAUDE_CODE_REMOTE
# (empty)

# Directory resolution:
homeDir = /Users/alice                          (os.homedir())
projectsDir = /Users/alice/.claude/projects
contextPath = /Users/alice/projects/myapp
projectHash = a1b2c3d4e5f6g7h8                  (hash of contextPath)
memoryDir = /Users/alice/.claude/projects/a1b2c3d4e5f6g7h8/memory/
```

**Example 2: NFS remote memory**
```bash
# Remote override set
$ export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/nfs-share

# Directory resolution:
homeDir = /mnt/nfs-share                        (from env var)
projectsDir = /mnt/nfs-share/projects
contextPath = /Users/alice/projects/myapp       (still local cwd)
projectHash = a1b2c3d4e5f6g7h8                  (same hash)
memoryDir = /mnt/nfs-share/projects/a1b2c3d4e5f6g7h8/memory/
```

**Example 3: SSHFS remote memory**
```bash
# SSHFS mounted remote directory
$ export CLAUDE_CODE_REMOTE_MEMORY_DIR=~/mnt/remote-claude

# Directory resolution:
homeDir = /Users/alice/mnt/remote-claude        (expanded ~)
projectsDir = /Users/alice/mnt/remote-claude/projects
contextPath = /Users/alice/projects/myapp
projectHash = a1b2c3d4e5f6g7h8
memoryDir = /Users/alice/mnt/remote-claude/projects/a1b2c3d4e5f6g7h8/memory/
```

**Key insight**: The project hash is computed from **local** `cwd`, so all agents working on the same project (even on different machines) resolve to the same memory directory if they have the same project path structure.

---

## 5. Network Storage Requirements

### Supported Storage Types

| Storage Type | Supported | Latency | Recommended Use |
|--------------|-----------|---------|-----------------|
| **NFS** | ✅ Yes | <10ms | Production teams, always-on servers |
| **SMB/CIFS** | ✅ Yes | <20ms | Windows shares, cross-platform teams |
| **SSHFS** | ✅ Yes | 10-50ms | Remote development, SSH-based workflows |
| **Dropbox/Google Drive** | ⚠️ Limited | 1-60s | Personal multi-machine (sync lag acceptable) |
| **S3/GCS (direct)** | ❌ No | 100-500ms | Not POSIX-compliant, too slow |
| **S3/GCS (FUSE mount)** | ⚠️ Limited | 50-200ms | Possible but slow, not recommended |

### Performance Requirements

**Read latency**: <10ms (memory loaded at every turn)
- NFS/SMB: ✅ 1-5ms typical
- SSHFS: ⚠️ 10-50ms (acceptable with fast connection)
- Cloud sync: ❌ 1-60s (too slow for real-time)

**Write atomicity**: Small files (<4KB) must write atomically
- NFS/SMB: ✅ Atomic for small files
- SSHFS: ✅ Atomic via SSH protocol
- Cloud sync: ❌ No atomicity guarantee

**File locking**: Not required (last-write-wins acceptable)
- Current implementation doesn't use file locks
- Future enhancement may add locking for conflict resolution

### Network Stability

**Connection reliability**: Must stay connected during Claude Code session
- Disconnect during memory read: Agent fails to start turn
- Disconnect during memory write: Write may fail or corrupt file

**Recommended**:
- Use wired Ethernet for NFS/SMB (not WiFi for production)
- Monitor network stability (ping <1ms jitter)
- Have fallback plan (local memory) if network fails

---

## 6. Synchronization Behavior

### Read Synchronization

**When memory is read**: At the start of every agent turn

**Cache behavior**: No caching - always read from disk

```javascript
// buildMemoryPrompt is called fresh each turn
function buildMemoryPrompt() {
    // Reads file from disk (always latest version)
    let content = fs.readFileSync(memoryPath, 'utf-8');
    return formatPrompt(content);
}
```

**Implications**:
- ✅ Agents always see latest changes (no stale reads)
- ✅ Changes from other agents visible immediately (next turn)
- ⚠️ Network latency affects turn start time (extra 10-50ms)

### Write Synchronization

**When memory is written**: When agent uses Write or Edit tool on memory files

**Write mechanism**: Direct `fs.writeFileSync` (no locking)

```javascript
// Write tool writes directly to remote path
fs.writeFileSync(memoryPath, content);
// File system handles sync to network storage
```

**Conflict behavior**: Last-write-wins (no merge)

```
T0: MEMORY.md = "Entry A"
T1: Agent 1 reads: "Entry A"
T2: Agent 2 reads: "Entry A"
T3: Agent 1 writes: "Entry A\nEntry B"
T4: Agent 2 writes: "Entry A\nEntry C"
T5: MEMORY.md = "Entry A\nEntry C"  ← Entry B lost!
```

**Mitigation**: Use topic files to reduce conflicts (see [memory_maintenance.md](./memory_maintenance.md#deduplication-strategies))

### Network File System Caching

**NFS cache coherency**:
- NFS clients cache file data and metadata
- Cache invalidation: `actimeo=0` mount option forces fresh reads
- Default NFS: 3-60 second cache (may see stale data)

**Recommended NFS mount options**:
```bash
sudo mount -t nfs -o actimeo=0,noac server:/exports/memory /mnt/memory
# actimeo=0: No attribute cache
# noac: No data cache
```

**SMB cache coherency**:
- SMB has built-in oplocks for cache invalidation
- Generally more aggressive cache invalidation than NFS
- Recommended: Use `cache=none` for real-time sync

**SSHFS cache coherency**:
- SSHFS doesn't cache by default (always fetches remote)
- Every read/write is a network round-trip
- No stale data issues, but slower

---

## 7. Distributed Team Setup Examples

### Example 1: Team Lead on Laptop, Teammates on Cloud VMs

**Architecture**:
```
Team Lead (Laptop, 192.168.1.10)
  └─> Creates NFS export: /Users/alice/.claude/

Teammate 1 (AWS VM, 10.0.1.5)
  └─> Mounts NFS: /mnt/shared-memory

Teammate 2 (AWS VM, 10.0.1.6)
  └─> Mounts NFS: /mnt/shared-memory
```

**Setup steps**:

**On team lead's laptop** (NFS server):
```bash
# 1. Install NFS server
# macOS: Built-in, configure in System Preferences > Sharing > File Sharing
# Linux: sudo apt install nfs-kernel-server

# 2. Export .claude directory
# Add to /etc/exports:
/Users/alice/.claude 10.0.1.0/24(rw,sync,no_subtree_check)

# 3. Start NFS server
sudo exportfs -ra
sudo systemctl restart nfs-server  # Linux
```

**On teammate VMs** (NFS clients):
```bash
# 1. Install NFS client
sudo apt install nfs-common

# 2. Create mount point
sudo mkdir -p /mnt/shared-memory

# 3. Mount NFS share
sudo mount -t nfs -o actimeo=0 192.168.1.10:/Users/alice/.claude /mnt/shared-memory

# 4. Configure Claude Code
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/shared-memory

# 5. Start Claude Code
claude --agent-id teammate-1 --agent-name researcher
```

**Verification**:
```bash
# On teammate VM, check memory directory
ls /mnt/shared-memory/projects/
# Should show same projects as team lead's laptop

# Write test from teammate
echo "Test from teammate" >> /mnt/shared-memory/test.txt

# Verify on team lead's laptop
cat /Users/alice/.claude/test.txt
# Should show "Test from teammate"
```

### Example 2: Multi-Machine Personal Setup (Desktop + Laptop)

**Architecture**:
```
Desktop (home) ──┐
                 ├─> Dropbox ~/Dropbox/.claude-memory/
Laptop (office) ─┘
```

**Setup steps**:

**On both machines**:
```bash
# 1. Ensure Dropbox is installed and synced

# 2. Create memory directory in Dropbox (do once)
mkdir -p ~/Dropbox/.claude-memory

# 3. Configure Claude Code
echo 'export CLAUDE_CODE_REMOTE_MEMORY_DIR=~/Dropbox/.claude-memory' >> ~/.bashrc
source ~/.bashrc

# 4. Start Claude Code
claude
```

**Usage pattern**:
```
Day 1 (Desktop):
  - Work on project, accumulate memory
  - MEMORY.md updated with debugging notes
  - Dropbox syncs in background

Day 2 (Laptop):
  - Open same project
  - Memory loaded from Dropbox (synced overnight)
  - Continue where desktop left off
```

**Limitations**:
- ⚠️ Don't use both machines simultaneously (sync conflicts)
- ⚠️ Wait for Dropbox sync before switching machines
- ⚠️ Check Dropbox icon for sync status

### Example 3: Remote SSH Development

**Architecture**:
```
Local Machine (macOS)
  └─> SSH → Remote Server (Linux)
             Remote Server runs Claude Code with local .claude/
```

**Setup (Remote memory on remote server)**:
```bash
# On local machine, SSH to remote
ssh user@remote-server

# On remote server, use default local memory
# No CLAUDE_CODE_REMOTE_MEMORY_DIR needed
claude

# Memory at /home/user/.claude/projects/{hash}/memory/
```

**Setup (Remote memory mounted locally via SSHFS)**:
```bash
# On local machine
# 1. Mount remote .claude directory
mkdir -p ~/mnt/remote-claude
sshfs user@remote-server:/home/user/.claude ~/mnt/remote-claude

# 2. Configure Claude Code
export CLAUDE_CODE_REMOTE_MEMORY_DIR=~/mnt/remote-claude

# 3. Start Claude Code locally (uses remote memory)
claude

# Memory at ~/mnt/remote-claude/projects/{hash}/memory/
# (Which is actually remote-server:/home/user/.claude/projects/{hash}/memory/)
```

---

## 8. Error Handling and Fallbacks

### Network Unavailable on Startup

**Scenario**: Remote memory directory not accessible when Claude Code starts

**Detection**:
```javascript
try {
    fs.mkdirSync(memoryDir, { recursive: true });
} catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EACCES') {
        // Remote directory not accessible
    }
}
```

**Current behavior**: Likely crashes or fails silently

**User action**:
- Check network connection: `ping server`
- Verify mount: `ls $CLAUDE_CODE_REMOTE_MEMORY_DIR`
- Re-mount if needed
- Restart Claude Code

**Graceful fallback** (not currently implemented):
```javascript
function getAutoMemoryDirectory() {
    let remoteDir = process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;

    if (remoteDir) {
        try {
            // Test if remote directory is accessible
            fs.accessSync(remoteDir, fs.constants.R_OK | fs.constants.W_OK);
            return buildMemoryPath(remoteDir);
        } catch (error) {
            console.warn(`Remote memory unavailable: ${error.message}`);
            console.warn('Falling back to local memory');
            // Fall through to local
        }
    }

    // Use local memory
    return buildMemoryPath(os.homedir());
}
```

### Network Disconnects Mid-Session

**Scenario**: NFS/SSHFS mount becomes unavailable during agent operation

**Impact**:
- **Memory read fails**: Turn cannot start (fs.readFileSync throws)
- **Memory write fails**: Agent sees error from Write/Edit tool

**Current behavior**: Unhandled exception, agent crashes

**User action**:
- Reconnect network
- Re-mount storage
- Restart Claude Code session

### Write Conflicts

**Scenario**: Two agents write to same file simultaneously

**Behavior**: Last write wins, earlier writes lost (see [Synchronization Behavior](#6-synchronization-behavior))

**Mitigation strategies**:

**Strategy 1: Topic file separation** (Recommended)
```
Agent 1 writes to: debugging.md
Agent 2 writes to: architecture.md
→ No conflict
```

**Strategy 2: Timed coordination**
```
Agent 1: Works 9-5, writes memory at end of day
Agent 2: Works 5-1, writes memory at end of night
→ No simultaneous writes
```

**Strategy 3: Manual merge** (If conflict detected)
```bash
# Find Dropbox conflict files
find ~/Dropbox/.claude-memory -name "*conflicted*"

# Manually merge
vimdiff MEMORY.md "MEMORY (conflicted copy).md"
```

---

## 9. Performance Considerations

### Latency Impact

**Turn start latency**:
```
Local memory:  buildMemoryPrompt reads file in ~1ms
Remote memory: buildMemoryPrompt reads file in 10-50ms (network round-trip)
```

**Impact**: ~10-50ms added to every turn start (negligible for human interaction)

**Optimization**: Not currently implemented, but could cache memory content and only re-read if modified:
```javascript
let memoryCache = { content: "", mtime: 0 };

function buildMemoryPrompt() {
    let stat = fs.statSync(memoryPath);
    if (stat.mtimeMs === memoryCache.mtime) {
        return memoryCache.content;  // Use cache
    }

    // File modified, re-read
    let content = fs.readFileSync(memoryPath, 'utf-8');
    memoryCache = { content, mtime: stat.mtimeMs };
    return content;
}
```

### Bandwidth Usage

**Memory size**: Typical MEMORY.md is 5-10KB

**Read frequency**: Every turn (could be 10-100+ times per session)

**Total bandwidth**: 10KB × 100 turns = 1MB per session (negligible)

**Write frequency**: 1-5 times per session (when agent learns something new)

**Conclusion**: Bandwidth is not a concern even over cellular hotspot

### Concurrent Access Scaling

**Number of agents**: System designed for 2-5 concurrent agents

**Scaling limits**:
- **NFS**: Handles 100+ concurrent clients easily
- **SSHFS**: Limited by SSH server connections (~10-50 typically)
- **Dropbox**: Limited by sync API rate (avoid >10 simultaneous writes)

**Current bottleneck**: Last-write-wins conflicts, not network performance

---

## 10. Related Documents

> Cross-references:
> - [multi_agent_memory.md](./multi_agent_memory.md) - Memory isolation models, shared vs isolated scenarios
> - [memory_maintenance.md](./memory_maintenance.md) - Deduplication to reduce conflicts
> - [usage_patterns.md](./usage_patterns.md) - Topic file organization (conflict reduction)
> - [architecture.md](./architecture.md) - Overall memory system architecture

Key functions referenced:
- `getHomeDirectory` (ga) - Returns remote dir if `CLAUDE_CODE_REMOTE_MEMORY_DIR` set
- `getAutoMemoryDirectory` (mu1) - Full path resolution with remote override
- `getCurrentContextPath` (LU7) - Get cwd for project hash computation
- `hashPath` (dx) - Generate stable project hash
- `buildMemoryPrompt` (m0A) - Read memory from disk (remote or local)
