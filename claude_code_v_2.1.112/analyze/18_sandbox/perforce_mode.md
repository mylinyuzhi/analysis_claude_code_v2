# Perforce Mode — Edit/Write/NotebookEdit Read-Only Guard

> Documents `CLAUDE_CODE_PERFORCE_MODE` (2.1.98) — when enabled, Edit/Write/NotebookEdit fail on read-only files (`S_IWUSR=0`) with a Perforce-specific error message pointing the model at `p4 edit <file>`. Prevents Claude from silently bypassing Perforce check-out tracking via chmod or out-of-band writes.

---

## What Perforce Does Differently

Perforce (`p4`) is a centralized version-control system common in game dev, hardware/firmware, and large enterprise codebases. Its central invariant: **every file in the workspace defaults to read-only on disk**. To edit a file, you must:

```
p4 edit foo.txt
```

This atomically (a) marks the file open-for-edit in the depot, (b) sets the file writable on disk. When you submit your changelist, Perforce makes the file read-only again and assigns the new revision.

If a tool silently writes to a read-only file (by `chmod +w` first, then writing), the change happens **outside Perforce's tracking**. The next sync from depot will overwrite it. Worse, `p4` can mark workspace files as "missing checkout" — a long-tail of integrity errors that's painful to recover from.

Claude needs to be a good Perforce citizen.

---

## The Two-Function Gate

```javascript
// ============================================
// isPerforceMode - Gate for the entire Perforce subsystem
// Location: chunks.16.mjs:3070-3073
// ============================================

// ORIGINAL (for source lookup):
function mY1() {
    return S6(process.env.CLAUDE_CODE_PERFORCE_MODE)
}

// READABLE (for understanding):
function isPerforceMode() {
  return parseExplicitTrue(process.env.CLAUDE_CODE_PERFORCE_MODE);
}

// ============================================
// isPerforceProtected - File is Perforce-tracked AND lacks user-write bit
// Location: chunks.16.mjs:3075-3077
// ============================================

// ORIGINAL (for source lookup):
function gf6(q) {
    return mY1() && (q & 128) === 0
}

// READABLE (for understanding):
function isPerforceProtected(fileMode) {
  // 128 = 0o200 = S_IWUSR (owner-write bit in POSIX file mode).
  // Returns true if Perforce mode is on AND the file is NOT user-writable.
  return isPerforceMode() && (fileMode & 0o200) === 0;
}

// Mapping: mY1→isPerforceMode, gf6→isPerforceProtected, S6→parseExplicitTrue
```

### The S_IWUSR bit (0o200 = 128 decimal)

Perforce makes tracked files read-only by clearing the user-write bit in POSIX mode. The bit is `S_IWUSR` = `0o200` = 128 decimal:

| Mode (octal) | Mode (decimal) | Writable by owner? |
|--------------|----------------|---------------------|
| `0o644` (rw-r--r--) | 420 | yes (`420 & 128 == 128`) |
| `0o444` (r--r--r--) | 292 | no (`292 & 128 == 0`) |
| `0o755` (rwxr-xr-x) | 493 | yes |
| `0o555` (r-xr-xr-x) | 365 | no |

When Perforce check-outs a file (`p4 edit`), it adds `0o200` to the mode (typically `0o444 → 0o644`). When checked-in, it strips `0o200` back. The test `(mode & 128) === 0` answers "is this file currently read-only at the OS level?"

### Why a *separate* `isPerforceProtected` function?

The author could have inlined the check:

```javascript
if (isPerforceMode() && (fileMode & 128) === 0) { ... }
```

The named function exists because:

1. **The check is invoked from at least 3 different code paths** (Write, Edit, NotebookEdit). Naming makes the intent obvious at each call site.
2. **The bit-mask constant 128 is a magic number.** Without the wrapper, every call site needs the `0o200`/`S_IWUSR` comment. Centralizing avoids "what does 128 mean" lookups.
3. **The gate (`isPerforceMode()`) short-circuits.** Without the helper, every call site does the env-var lookup separately — small perf cost, but more importantly, easy to forget. The helper guarantees the order: gate first, then bit-check.

---

## Where It Fires

`gf6` (isPerforceProtected) is called from three tool implementations:

| Tool | File:Line | Behavior |
|------|-----------|----------|
| **Write** | chunks.144.mjs:546-550 | `errorCode: 6`, returns `result: false` with `Ff6` message. No `behavior` field (Write doesn't expose ask/allow at this layer) |
| **Edit** | chunks.162.mjs:1391-1396 | `errorCode: 11`, returns `behavior: "ask"` with `Ff6` message. The "ask" lets the user accept the override if they really mean to bypass Perforce |
| **NotebookEdit** | chunks.145.mjs:145-148 | `errorCode: <unspecified in this snippet>`, returns `result: false` with `Ff6` message |

All three paths use the same error string `Ff6`:

```javascript
// chunks.16.mjs:3320
Ff6 = "File is read-only — it has not been opened for edit in Perforce. "
    + "Run `p4 edit <file>` to check it out, then retry. "
    + "Do not chmod the file writable; that bypasses Perforce tracking."
```

### The Three Components of the Error Message

```
[1] File is read-only — it has not been opened for edit in Perforce.
[2] Run `p4 edit <file>` to check it out, then retry.
[3] Do not chmod the file writable; that bypasses Perforce tracking.
```

Each line is **prompt engineering**:

1. **Diagnostic.** Tells the model *what's wrong* and *why* in terms it can act on.
2. **Remediation.** Gives the exact command to run. Backticks frame it as an example to execute.
3. **Anti-pattern warning.** Explicitly forbids the obvious-but-wrong workaround. A naive LLM, seeing "file is read-only", would try `chmod +w file && cp newcontent file`. The third line short-circuits that.

**Key insight:** The error message is part of the tool's spec. It's not just a user-facing log; it's a contract with the LLM that flows into the next turn's context. Phrasing it as instruction (line 2) and prohibition (line 3) leverages the model's instruction-following.

---

## Edit-Tool Permission Flow

Look at how `gf6` integrates with Edit's permission flow:

```javascript
// chunks.162.mjs:1391-1396 — Edit tool, inside checkPermission
try {
    const { size, mode } = await fs.stat(filePath);
    if (size > MAX_EDIT_FILE_SIZE) return {
        result: false,
        behavior: "ask",
        message: `File is too large to edit (${formatSize(size)}). Maximum editable file size is ${formatSize(MAX_EDIT_FILE_SIZE)}.`,
        errorCode: 10
    };
    if (isPerforceProtected(mode)) return {
        result: false,
        behavior: "ask",                                    // ← ASK, not deny
        message: PERFORCE_PROTECTED_FILE_ERROR_MESSAGE,
        errorCode: 11
    };
} catch (statError) {
    if (!isNotFoundError(statError)) throw statError;
    // File doesn't exist yet — that's fine, Edit will create it.
}
```

### Why "ask" instead of "deny"?

**Deny** would mean the Edit/NotebookEdit invocation fails permanently. **Ask** means the user sees a prompt and can:

- Approve → the edit proceeds despite Perforce protection (model bypasses Perforce — user's choice).
- Reject → the model gets the error message back, sees the `p4 edit` hint, runs it, retries.

The "ask" lets the user override for legitimate cases (e.g., the file isn't actually in Perforce, just happens to be read-only). The fallthrough message guides the model to the correct workflow when the user rejects.

### Why not also check on Write?

Write's check returns `result: false` without a behavior field — meaning Write's outer layer treats it as a hard validation failure, not a permission ask. This is because:

- **Edit's intent is "modify existing".** It only fires on extant files, so the read-only check is always meaningful.
- **Write's intent is "create or overwrite".** If the path doesn't exist yet, no Perforce check applies (Perforce doesn't track files until they exist in the depot). When it does exist, Write's validation layer already insists you Read the file first; the Perforce check is one more validation in that same layer.

This is **why the same check has slightly different surface treatments in different tools** — each tool's validation flow has different invariants.

---

## System Prompt Integration

Perforce mode also injects a system-prompt section. From `chunks.86.mjs:2221-2223`:

```javascript
...S6(process.env.CLAUDE_CODE_PERFORCE_MODE) && {
    perforceMode: "This is a Perforce workspace. Files not yet opened for edit are read-only; "
                + "if a file is read-only, run `p4 edit <file>` via Bash to check it out before "
                + "modifying. Files that are already writable have been opened and can be edited "
                + "directly."
}
```

This is part of the system-context section the user sees in `<env>` blocks (alongside cwd, OS, etc.). It primes the model up-front:

1. **Sets expectation.** "This is a Perforce workspace" — model knows the rules of the road.
2. **Tells the heuristic.** "Files not yet opened for edit are read-only" — the model learns that read-only is *expected*, not anomalous.
3. **Tells the workaround.** "Run `p4 edit <file>` via Bash" — explicit instruction, not just an after-the-fact error.
4. **Tells what writable means.** "Files that are already writable have been opened" — the model can rely on the writable bit as a status indicator.

**Key insight:** The error message (per-violation) and the system prompt (always-on) form a **two-layer prompt engineering**. The system prompt sets expectations; the error message corrects mistakes. The model rarely needs more than one mistake to get into the right workflow.

---

## Why an Opt-In Env Var?

Defaulting Perforce mode on would surprise the rest of the userbase:

- **System config files are intentionally read-only.** `/etc/passwd`, `/etc/hosts`, `/etc/shadow` — these have `0o644` or stricter. With Perforce mode on, the model trying to edit them would get a confusing "p4 edit" hint that doesn't apply.
- **Build artifacts.** Many build systems generate read-only output (e.g., to indicate "do not edit"). Treating those as Perforce-protected would be wrong.
- **Read-only mounts.** Container `:ro` mounts, NFS read-only exports. Same problem.

**Perforce mode is enterprise-specific.** The Perforce admin opts in:

```bash
export CLAUDE_CODE_PERFORCE_MODE=1
claude
```

Or sets it globally in the team's environment. Non-Perforce users never hit it.

---

## Cross-Tool Coverage

Perforce mode covers the three direct-write tools (Edit, Write, NotebookEdit). It deliberately **does not** cover:

- **Bash tool.** A `echo "x" > foo` redirect would still succeed against a read-only file (bash's `>` opens write-only, and if you're root or the file is somehow writable mid-check, it'd succeed). The system-prompt instruction is what guides the model away from this.
- **MultiEdit.** Internally uses Edit's validation, so it inherits the check.

**Why not also gate Bash writes?** Bash has too many ways to write (`>`, `>>`, `tee`, `mv`, `cp`, programs that take output paths, …). A bash-level gate would need to parse and intercept every write-path. The cost of false-negatives (missing a write that bypasses the gate) is high; the cost of false-positives (blocking a legitimate `git diff > out.txt` to a read-only path the user is fine writing) is also high. Cleaner to rely on the system prompt + the model's own discipline for Bash.

---

## Trade-offs

| Decision | Trade-off |
|----------|-----------|
| Opt-in via env var | Surprise-free for non-Perforce users; enterprise users must set it |
| `S_IWUSR=0` heuristic instead of `p4 fstat` | Cheap (single stat call); false-positive on non-Perforce read-only files; reasonable given the env var is enterprise-specific |
| "ask" behavior in Edit | Lets user override genuine read-only file (e.g., non-Perforce); two extra clicks for the user. Hard "deny" would have been more aggressive |
| Doesn't cover Bash writes | Reduces complexity; relies on system-prompt steering. Bash redirects to read-only files happen to fail naturally |
| Single error message string | Easier to audit; can't tailor message per tool. Acceptable because `p4 edit <file>` is the right action regardless of which tool hit the gate |
| System prompt addition is conditional | Doesn't pollute prompt cache for non-Perforce users. The conditional spread `...isPerforce && {...}` adds the section only when needed |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_13.md](../00_overview/symbol_additions_unit_13.md) — this module's additions
> - [symbol_index.md](../00_overview/symbol_index.md) — main v2.1.88 → v2.1.112 index

Key functions/constants in this document:
- `isPerforceMode` (mY1) — env-var gate
- `isPerforceProtected` (gf6) — gate + S_IWUSR bit check
- `PERFORCE_PROTECTED_FILE_ERROR_MESSAGE` (Ff6) — three-line error string
- `parseExplicitTrue` (S6) — env-var truthy parser
- Perforce system-prompt section — injected in `chunks.86.mjs:2221`
