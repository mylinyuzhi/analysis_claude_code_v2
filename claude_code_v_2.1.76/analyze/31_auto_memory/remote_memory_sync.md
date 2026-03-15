# Remote Memory Sync - Shared Memory for Distributed Teams

> **Module**: Auto Memory - Remote Storage
> **Source**: `chunks.87.mjs` (lines 2204-2221) - Remote memory directory resolution
> **Version**: Claude Code v2.1.76

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

### Key Benefits

- **Shared knowledge**: All agents see same MEMORY.md, learn from each other's discoveries
- **Continuity**: Switch machines mid-task, memory persists
- **Team coordination**: Shared debugging notes, patterns, architecture decisions

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
2. `autoMemoryDirectory` setting (if configured, v2.1.59)
3. `os.homedir()` (standard user home directory)

### Full Directory Construction

```javascript
function getAutoMemoryDirectory() {
    let homeDir = getHomeDirectory();  // Remote override happens here
    let projectsDir = path.join(homeDir, "projects");
    let projectHash = hashPath(getCurrentContextPath());
    let memoryDir = path.join(projectsDir, projectHash, "memory");
    return (memoryDir + "/").normalize("NFC");
}
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

### Advanced Setup (SSHFS)

**Scenario**: Local machine wants to use remote server's memory

```bash
# Install SSHFS
brew install macfuse sshfs  # macOS
# or: sudo apt install sshfs  # Linux

# Create local mount point
mkdir -p ~/mnt/remote-claude

# Mount remote server's .claude directory
sshfs user@remote-server:/home/user/.claude ~/mnt/remote-claude

# Configure Claude Code
export CLAUDE_CODE_REMOTE_MEMORY_DIR=~/mnt/remote-claude

# Start Claude Code - now using remote memory
claude
```

### Cloud Storage Setup (Dropbox)

```bash
# Create .claude-memory directory in Dropbox
mkdir -p ~/Dropbox/.claude-memory

# On both machines
export CLAUDE_CODE_REMOTE_MEMORY_DIR=~/Dropbox/.claude-memory
```

**Limitations**:
- Cloud storage has sync latency (seconds to minutes)
- Conflict files may appear if both machines write simultaneously
- Not recommended for real-time collaboration (use NFS instead)

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
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    }
    return os.homedir();
}

// Mapping: ga→getHomeDirectory, O8→os.homedir
```

### Resolution Examples

**Example 1: Local memory (default)**
```bash
# No remote override
homeDir = /Users/alice/.claude
memoryDir = /Users/alice/.claude/projects/a1b2c3d4e5f6g7h8/memory/
```

**Example 2: NFS remote memory**
```bash
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/nfs-share
homeDir = /mnt/nfs-share
memoryDir = /mnt/nfs-share/projects/a1b2c3d4e5f6g7h8/memory/
```

**Key insight**: The project hash is computed from **local** `cwd`, so all agents working on the same project (even on different machines) resolve to the same memory directory if they have the same project path structure.

---

## 5. Network Storage Requirements

### Supported Storage Types

| Storage Type | Supported | Latency | Recommended Use |
|--------------|-----------|---------|-----------------|
| **NFS** | Yes | <10ms | Production teams, always-on servers |
| **SMB/CIFS** | Yes | <20ms | Windows shares, cross-platform teams |
| **SSHFS** | Yes | 10-50ms | Remote development, SSH-based workflows |
| **Dropbox/Google Drive** | Limited | 1-60s | Personal multi-machine (sync lag acceptable) |
| **S3/GCS (direct)** | No | 100-500ms | Not POSIX-compliant, too slow |
| **S3/GCS (FUSE mount)** | Limited | 50-200ms | Possible but slow, not recommended |

### Performance Requirements

**Read latency**: <10ms (memory loaded at every turn)
- NFS/SMB: 1-5ms typical
- SSHFS: 10-50ms (acceptable with fast connection)
- Cloud sync: 1-60s (too slow for real-time)

**Write atomicity**: Small files (<4KB) must write atomically
- NFS/SMB: Atomic for small files
- SSHFS: Atomic via SSH protocol
- Cloud sync: No atomicity guarantee

---

## 6. Synchronization Behavior

### Read Synchronization

**When memory is read**: At the start of every agent turn

**Cache behavior**: No caching - always read from disk

**Implications**:
- Agents always see latest changes (no stale reads)
- Changes from other agents visible immediately (next turn)
- Network latency affects turn start time (extra 10-50ms)

### Write Synchronization

**When memory is written**: When agent uses Write or Edit tool on memory files

**Write mechanism**: Direct `fs.writeFileSync` (no locking)

**Conflict behavior**: Last-write-wins (no merge)

```
T0: MEMORY.md = "Entry A"
T1: Agent 1 reads: "Entry A"
T2: Agent 2 reads: "Entry A"
T3: Agent 1 writes: "Entry A\nEntry B"
T4: Agent 2 writes: "Entry A\nEntry C"
T5: MEMORY.md = "Entry A\nEntry C"  ← Entry B lost!
```

**Mitigation**: Use topic files to reduce conflicts (see [memory_maintenance.md](./memory_maintenance.md))

### NFS Cache Coherency

**Recommended NFS mount options** for real-time sync:
```bash
sudo mount -t nfs -o actimeo=0,noac server:/exports/memory /mnt/memory
# actimeo=0: No attribute cache
# noac: No data cache
```

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

**Setup on teammate VMs** (NFS clients):
```bash
sudo apt install nfs-common
sudo mkdir -p /mnt/shared-memory
sudo mount -t nfs -o actimeo=0 192.168.1.10:/Users/alice/.claude /mnt/shared-memory
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/mnt/shared-memory
claude
```

### Example 2: Multi-Machine Personal Setup (Desktop + Laptop)

```bash
# On both machines
mkdir -p ~/Dropbox/.claude-memory
echo 'export CLAUDE_CODE_REMOTE_MEMORY_DIR=~/Dropbox/.claude-memory' >> ~/.bashrc
source ~/.bashrc
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
- Don't use both machines simultaneously (sync conflicts)
- Wait for Dropbox sync before switching machines

---

## 8. Error Handling and Fallbacks

### Network Unavailable on Startup

**Scenario**: Remote memory directory not accessible when Claude Code starts

**Current behavior**: Likely crashes or fails silently

**User action**:
- Check network connection: `ping server`
- Verify mount: `ls $CLAUDE_CODE_REMOTE_MEMORY_DIR`
- Re-mount if needed
- Restart Claude Code

### Write Conflicts

**Scenario**: Two agents write to same file simultaneously

**Mitigation strategies**:

**Strategy 1: Topic file separation** (Recommended)
```
Agent 1 writes to: debugging.md
Agent 2 writes to: architecture.md
→ No conflict
```

**Strategy 2: Manual merge** (If conflict detected)
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

### Bandwidth Usage

**Memory size**: Typical MEMORY.md is 5-10KB

**Read frequency**: Every turn (could be 10-100+ times per session)

**Total bandwidth**: 10KB × 100 turns = 1MB per session (negligible)

**Conclusion**: Bandwidth is not a concern even over cellular hotspot

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
