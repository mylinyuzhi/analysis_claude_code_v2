# Sandbox & Shell Hardening Module (18_sandbox) — v2.1.112

> Documents the sandbox and shell-execution hardening between v2.1.88 and v2.1.112. Centers on the PowerShell tool's progressive rollout, Linux subprocess isolation via PID namespacing, per-session script invocation caps, Perforce-aware Edit/Write blocking, bash glob/`cd <project-dir>` permission relaxations, and Accept Edits auto-approval through safe env-var/wrapper prefixes.

---

## Why a Sandbox & Hardening Module?

By v2.1.88 the BashTool/PowerShellTool security surface had grown to a fragile constellation:

- Subprocesses inherited the full parent environment, including `ANTHROPIC_API_KEY` and GitHub Actions tokens.
- Permission gating treated every glob pattern (`ls *.ts`) and every `cd <project-dir> &&` prefix as a compound command requiring an explicit prompt.
- There was no concept of "this filesystem is owned by an SCM that needs check-out before write" — Edit/Write would either succeed (overwriting a Perforce read-only file out-of-band) or fail with a generic permission error.
- Accept Edits mode only auto-approved bare command names; `timeout 5 mkdir out` or `LANG=C rm tmp` still prompted.
- Native Windows users were forced into Bash semantics.

The 2.1.89 → 2.1.112 window stitches these gaps closed via seven independent but related landings, gated by environment variables so platform-managed environments can opt out individually.

---

## Architecture: Six Independent Gates

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Bash/Shell Tool Invocation                              │
│                                                                                 │
│  user/model command  →  parseShellCommand (AST)                                 │
│                          │                                                       │
│                          ├──► isPowerShellToolEnabled (ly6)                     │
│                          │    CLAUDE_CODE_USE_POWERSHELL_TOOL env / Windows     │
│                          │    default-on for ant / opt-in elsewhere             │
│                          │                                                       │
│                          ├──► checkReadOnlyConstraints (yu8)                    │
│                          │    Glob whitelist (cEz) — ls/cat/head/tail/wc/grep/  │
│                          │      ...allowed with `*?[]`                          │
│                          │    `cd ${cwd}` prefix stripping (fkY)                │
│                          │                                                       │
│                          ├──► acceptEditsCheck (QSK + JkY)                      │
│                          │    Safe wrappers (jF): timeout|time|nice|stdbuf|     │
│                          │       nohup                                          │
│                          │    Safe env vars (N98): LANG, TZ, NO_COLOR, ...      │
│                          │                                                       │
│                          ├──► subprocessEnvScrub (xP/Dk)                        │
│                          │    Strip 25 sensitive env vars + INPUT_<name>        │
│                          │    Activated via CLAUDE_CODE_SUBPROCESS_ENV_SCRUB    │
│                          │                                                       │
│                          ├──► scriptCapsEnforce ($p1)                           │
│                          │    Per-session per-script-name call counter          │
│                          │    Activated via CLAUDE_CODE_SCRIPT_CAPS={"x":N,...} │
│                          │                                                       │
│                          └──► (on Linux) bwrap + apply-seccomp                  │
│                               PID namespace isolation + syscall filter           │
│                                                                                 │
│                          ╔══════════════════════════════════════╗                │
│                          ║  Edit/Write/NotebookEdit (separate)  ║                │
│                          ║  isPerforceProtected (gf6) — gated   ║                │
│                          ║  on CLAUDE_CODE_PERFORCE_MODE        ║                │
│                          ╚══════════════════════════════════════╝                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

Each gate is **independently opt-in** via its own environment variable. The matrix is:

| Env Var | Default | Effect | Platforms |
|---------|---------|--------|-----------|
| `CLAUDE_CODE_USE_POWERSHELL_TOOL` | on for ant on Windows, off elsewhere | Routes shell tool to PowerShell instead of Bash | Windows (gated), Linux/macOS (opt-in with `pwsh` on PATH) |
| `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` | off (auto-on inside `claude-code-action` with untrusted-user inputs) | Strips 25 sensitive env vars + activates bwrap + apply-seccomp + PID namespace + bare-repo file scrubbing | Linux |
| `CLAUDE_CODE_SCRIPT_CAPS` | off | Per-session per-script-name invocation cap (JSON object) | All |
| `CLAUDE_CODE_PERFORCE_MODE` | off | Edit/Write/NotebookEdit fail on read-only files with `p4 edit` hint | All |
| (no env var) | always on | Bash glob whitelist for read-only commands (`ls *.ts`) and `cd ${cwd} &&` prefix strip | All |
| (no env var) | always on | Accept Edits mode auto-allows filesystem commands prefixed with safe env vars / wrappers | All |

---

## Documents in This Module

| Document | Purpose |
|----------|---------|
| [powershell_tool.md](./powershell_tool.md) | PowerShell tool progressive rollout (2.1.111), Windows default-on for ant, Linux/macOS opt-in via `pwsh`, plus 2.1.89/2.1.90 permission hardening |
| [subprocess_pid_namespace.md](./subprocess_pid_namespace.md) | `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` (2.1.98) — 25 scrubbed vars, bwrap PID namespace + apply-seccomp helper (2.1.92), bare-repo file scrubbing |
| [script_caps.md](./script_caps.md) | `CLAUDE_CODE_SCRIPT_CAPS` (2.1.98) — JSON-configured per-script invocation cap, exfil prevention rationale |
| [glob_permissions.md](./glob_permissions.md) | Bash glob whitelist (2.1.111) — read-only `cEz` set with 31 allowed commands, `cd ${cwd} &&` prefix strip |
| [env_var_prefixes.md](./env_var_prefixes.md) | Safe env-var (LANG/TZ/NO_COLOR/…) + safe wrapper (timeout/nice/nohup/…) stripping for permission matching; Accept Edits auto-approval (2.1.97) |
| [perforce_mode.md](./perforce_mode.md) | `CLAUDE_CODE_PERFORCE_MODE` (2.1.98) — Edit/Write/NotebookEdit fail on `S_IWUSR=0` files with `p4 edit <file>` hint |

Plus shared symbol additions: [../00_overview/symbol_additions_unit_13.md](../00_overview/symbol_additions_unit_13.md)

---

## Hardening Timeline (2.1.88 → 2.1.112)

| Version | Landing | Impact |
|---------|---------|--------|
| **2.1.89** | PowerShell permission tightening (back-tick escape, sub-expression detection) | Closed RCE via PS string interpolation |
| **2.1.90** | PowerShell argument validation hardening | Validated `Set-ItemProperty` style mutations |
| **2.1.92** | Linux sandbox now ships `apply-seccomp` helper in both npm and native builds | Restored unix-socket blocking inside the seccomp sandbox |
| **2.1.97** | Accept Edits auto-allow with safe env-var/wrapper prefixes | `LANG=C rm`, `timeout 5 mkdir` no longer prompt |
| **2.1.98** | `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` (PID namespace + env scrub) | Untrusted-user GitHub Actions hardening |
| **2.1.98** | `CLAUDE_CODE_SCRIPT_CAPS` per-script call cap | Caps data exfil via repeated writes in untrusted workflows |
| **2.1.98** | `CLAUDE_CODE_PERFORCE_MODE` | Edit/Write fail on read-only Perforce files |
| **2.1.111** | PowerShell tool progressive rollout (CLAUDE_CODE_USE_POWERSHELL_TOOL) | Windows users default to PowerShell; Linux/macOS opt-in |
| **2.1.111** | Glob whitelist + `cd <project-dir>` prefix strip | Removes hundreds of useless prompts per session |

---

## Why the Env-Var Opt-In Pattern?

Every hardening landing in this window is opt-in. The pattern was deliberate:

1. **Platform compatibility.** PID namespacing requires `unshare(CLONE_NEWPID)` which corporate-managed kernels often forbid. Opt-in keeps Claude Code usable in those environments without breaking subprocess execution.
2. **Workflow specificity.** Perforce mode would surprise non-Perforce users with confusing read-only errors on intentionally-read-only system files. Script caps would surprise users who legitimately run a build script 200 times in a session.
3. **Progressive rollout.** PowerShell tool semantics differ from Bash; rolling out fast would break Windows users with mixed-platform muscle memory. The flag-gated rollout lets the team A/B each cohort.
4. **Inferred-from-context activation.** `claude-code-action` sets `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` automatically when `allowed_non_write_users` is configured — the action knows it's exposed to prompt-injection surface and turns on hardening accordingly.

The opt-in model leaves the **safest configuration** to platform integrators (GitHub Actions for cloud, Perforce admins for enterprise) without imposing it on every individual developer.

---

## Cross-Module Integration

| Module | Integration Point |
|--------|-------------------|
| Permissions (10_permissions) | All sandbox env-var gates fold into `bashPermissions` / `powershellPermissions` decision-tree |
| Shell Snapshot (38_shell_snapshot) | Snapshots are sourced inside the bwrap container; `TMPDIR` is overridden per-session |
| MCP (mcp) | `CLAUDE_CODE_MCP_ALLOWLIST_ENV` gates env propagation to MCP stdio servers (parallel to subprocess scrub) |
| Hooks (hooks) | Hook subprocesses receive the scrubbed env, not parent process env |
| Background Agents (background_agents) | Long-running subprocess tasks share the same isolation primitives |
| Plugin (plugin) | Plugin `bin/` executables run with the same scrub + cap rules as Bash tool |
| Edit/Write/NotebookEdit | Perforce gate runs **inside** these tools' permission check, not as a Bash classifier |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_13.md](../00_overview/symbol_additions_unit_13.md) — this module's additions
> - [symbol_index.md](../00_overview/symbol_index.md) — main v2.1.88 → v2.1.112 index

Key functions in this module:
- `isPowerShellToolEnabled` (ly6) — runtime gate for PowerShell tool
- `isSubprocessEnvScrubEnabled` (xP) — gate for env scrubbing + PID namespace
- `parseScriptCapsConfig` (FH4) — parses `CLAUDE_CODE_SCRIPT_CAPS` JSON
- `enforceScriptCap` ($p1) — increments per-session call counter, throws on cap
- `isPerforceMode` (mY1) — gate for Edit/Write Perforce check
- `isPerforceProtected` (gf6) — bitwise S_IWUSR=0 check
- `checkReadOnlyConstraints` (yu8) — bash classifier with glob whitelist
- `filterCdCwdPrefix` (fkY) — strips `cd ${cwd}` from compound command list
- `stripSafeWrappers` (jF) — strips `timeout`/`nice`/`nohup` and safe env vars
- `subprocessEnv` (Dk) — returns scrubbed env for child processes
