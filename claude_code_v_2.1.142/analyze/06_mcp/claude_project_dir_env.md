# `CLAUDE_PROJECT_DIR` Passed to stdio MCP Servers

**Versions:** 2.1.139 (added)

## Summary

Hooks have always received `CLAUDE_PROJECT_DIR` in their environment (set to the project root, distinct from the agent's current working directory which may have been changed by an `EnterWorktree` operation or by the model running `cd`). v2.1.139 extends this to **stdio MCP servers**: when an MCP server is spawned, its env now includes `CLAUDE_PROJECT_DIR` pointing at the same root.

This lets MCP servers find project-relative resources (`.mcp.json`, `CLAUDE.md`, project-specific data files) without relying on the more-fragile `process.cwd()` of the spawn, which can be misleading when the user opens Claude Code from a subdirectory.

## Files Involved

| Version | Path | Lines | What |
|---------|------|------:|------|
| v2.1.112 | `chunks.161.mjs` (StdioClientTransport spawn) | (search for `new bP$\|new ClientStdioTransport`) | env does **not** include `CLAUDE_PROJECT_DIR` |
| v2.1.142 | `cli_inner_pretty.js` | **414308** | `env: { ...x, CLAUDE_PROJECT_DIR: R9(), ...$.env }` — the new injection |
| v2.1.142 | `cli_inner_pretty.js` | 49475 | plugin-monitor description mentions `${CLAUDE_PROJECT_DIR}` substitution |
| v2.1.142 | `cli_inner_pretty.js` | 228571 | `${CLAUDE_PROJECT_DIR}` substituted inside plugin command-line strings |
| v2.1.142 | `cli_inner_pretty.js` | 353922-353924 | plugin-script env: `CLAUDE_PROJECT_DIR: R9()` (preserved during merge) |
| v2.1.142 | `cli_inner_pretty.js` | 520835, 520849, 520863 | `${CLAUDE_PROJECT_DIR}` substitution inside skill commands |
| v2.1.142 | `cli_inner_pretty.js` | 547360 | `CLAUDE_PROJECT_DIR: M(R9())` in shell-helper env |
| v2.1.88 ref | `src/utils/projectDir.ts` | various | `R9` = `getProjectDir()` (also referenced as `cwd()` analog in tests) |

## The v2.1.142 stdio spawn

```javascript
// ============================================
// spawnStdioMcpServer - now injects CLAUDE_PROJECT_DIR
// Location: cli_inner_pretty.js:414304-414309
// ============================================

// ORIGINAL (for source lookup):
} else if ($.type === "stdio" || !$.type) {
  let u = process.env.CLAUDE_CODE_SHELL_PREFIX || $.command,
    S = process.env.CLAUDE_CODE_SHELL_PREFIX ? [W4([$.command, ...$.args])] : $.args,
    x = pA6() ? { ...SY6(), ...lt$() } : XI();
  A = new bP$({ command: u, args: S, env: { ...x, CLAUDE_PROJECT_DIR: R9(), ...$.env }, stderr: "pipe" });
} else throw Error(`Unsupported server type: ${$.type}`);

// READABLE (for understanding):
// stdio MCP server: spawn child process with project-aware env.
} else if (transportConfig.type === "stdio" || !transportConfig.type) {
    const command = process.env.CLAUDE_CODE_SHELL_PREFIX || transportConfig.command;
    const args = process.env.CLAUDE_CODE_SHELL_PREFIX
        ? [shellQuote([transportConfig.command, ...transportConfig.args])]
        : transportConfig.args;

    // Base env: when sandboxed, augment env with sandboxing vars; otherwise use process env.
    const baseEnv = isSandboxedEnvironment()
        ? { ...getSandboxedEnv(), ...getSandboxedShellEnv() }
        : getDefaultStdioEnv();

    transport = new ClientStdioTransport({
        command,
        args,
        env: {
            ...baseEnv,                          // (1) ambient env (parent process)
            CLAUDE_PROJECT_DIR: getProjectDir(), // (2) NEW: project root injection
            ...transportConfig.env,              // (3) user-supplied env (highest priority)
        },
        stderr: "pipe",
    });
}

// Mapping: bP$→ClientStdioTransport, $→transportConfig, A→transport,
//          R9→getProjectDir, XI→getDefaultStdioEnv, pA6→isSandboxedEnvironment,
//          SY6→getSandboxedEnv, lt$→getSandboxedShellEnv, W4→shellQuote
```

## Why `CLAUDE_PROJECT_DIR` is wedged between `baseEnv` and `transportConfig.env`

```
spread order             precedence (last wins)
─────────────            ──────────────────────
{...baseEnv}             low
CLAUDE_PROJECT_DIR: …    middle
{...transportConfig.env} HIGH (user overrides anything)
```

If the user has set `CLAUDE_PROJECT_DIR=/some/path` in their MCP config's `env`, that **wins**. This matters because:
- Test fixtures might want to point an MCP server at a synthetic project root for reproducibility.
- A single MCP server config could be reused across projects with explicit `CLAUDE_PROJECT_DIR` overrides.

If the user has set `CLAUDE_PROJECT_DIR` in their *shell* (parent env), `baseEnv` carries it through — and the v2.1.142 injection then *overrides* it with the current Claude Code session's project dir. This is intentional: an inherited shell var is more likely a leftover from a previous session than a deliberate setting for this MCP spawn. The user-config `env` is the escape hatch.

## What `getProjectDir` (`R9`) returns

`getProjectDir` returns the path of the directory where the Claude Code session is rooted. In v2.1.142 this is the same value used by hooks via `CLAUDE_PROJECT_DIR` and by the placeholder substitution in plugin commands. After an `EnterWorktree` operation, it stays pointed at the *original* project root — the worktree-cwd is exposed separately.

This is the same value as the `${CLAUDE_PROJECT_DIR}` interpolation token used elsewhere:

```javascript
// ============================================
// substituteClaudeProjectDir - placeholder expansion in plugin commands
// Location: cli_inner_pretty.js:228571
// ============================================

// ORIGINAL (for source lookup):
if (((K = K.replace(/\$\{CLAUDE_PROJECT_DIR\}/g, () => q(R9()))), $.source)) {

// READABLE (for understanding):
// Replace literal "${CLAUDE_PROJECT_DIR}" in command strings with the project dir.
commandStr = commandStr.replace(/\$\{CLAUDE_PROJECT_DIR\}/g, () => quote(getProjectDir()));

// Mapping: K→commandStr, q→quote (shell-escape), R9→getProjectDir
```

This is how, for example, `.mcp.json` entries like:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "${CLAUDE_PROJECT_DIR}/scripts/start-mcp.sh"
    }
  }
}
```

…get resolved before the spawn, and *additionally* receive `CLAUDE_PROJECT_DIR=/project/root` in their env so the script can use it for further path resolution.

## Why This Approach

### Why an env var rather than an MCP-protocol field

The MCP protocol could carry "project context" as a per-connection capability or notification (e.g. a `notifications/projectDir`). But:
- MCP servers are *processes*; the env is the cheapest way to communicate startup parameters that don't change for the process lifetime.
- Hooks already use `CLAUDE_PROJECT_DIR`. Reusing the same convention makes the documentation simpler ("scripts get this env var, whether they're a hook or an MCP server").
- Stdio servers can't know about MCP-protocol-level context until *after* the protocol handshake. The env is available before the process even calls `main()`.

### Why only stdio (not HTTP/SSE)

HTTP/SSE MCP servers run in a separate process *space* — they're long-lived services, not spawned per-session. There's no "env injection" possible at session-connect time. The user would have to set `CLAUDE_PROJECT_DIR` on the server's own start-up environment, which Claude Code doesn't control. The feature only applies where Claude Code does the spawning.

### Why not also inject `CLAUDE_SESSION_ID` etc.

This was a focused fix: parity with hooks for `CLAUDE_PROJECT_DIR`. Other env vars (`CLAUDE_SESSION_ID`, `CLAUDE_CWD`) would have to be designed carefully — they change *during* a session, but the MCP server env is set *once* at spawn time. Restating "the current cwd" via env would mislead a long-lived server. `CLAUDE_PROJECT_DIR` is safe because the project root is intentionally session-stable (unlike cwd, which `cd` can change).

### Edge case: spawning under `CLAUDE_CODE_SHELL_PREFIX`

When `CLAUDE_CODE_SHELL_PREFIX` is set (e.g. `bash -c` or a sandboxing wrapper), the spawn becomes `prefix args [shellquote(command, ...args)]` — the actual server command is passed as one argument to the prefix. The env still applies to the prefix process, which then forks the server. Modern shells (`bash`, `sh`, `zsh`) inherit env by default, so the server gets `CLAUDE_PROJECT_DIR` transparently.

### Trade-off: env-var leak surface

Adding `CLAUDE_PROJECT_DIR` to every stdio MCP server's env increases the "what your server learns about you" surface marginally. The project directory is non-secret data already visible in many other places (the server might be a shell tool with stdin access to file contents anyway), so the privacy impact is negligible. The convenience for plugin authors is large.

### Key insight

The fix is **two literal characters** (the `,` and `CLAUDE_PROJECT_DIR: R9()` insertion in the env spread). The entire concept — "MCP servers should know the project root" — was previously reachable only by:
1. Making the user wire `CLAUDE_PROJECT_DIR: "${CLAUDE_PROJECT_DIR}"` into their MCP config `env` (which depends on prior shell-level setting and is verbose), or
2. Asking the server to read `package.json` upward from cwd (heuristic and fails for non-Node projects).

Promoting the convention from "you do it" to "we always do it" makes a class of project-relative MCP-server features (project-local databases, file-watch root, fixture loading) trivially writable.

## Related Symbols

See [`symbol_additions_v2_1_142_mcp.md`](../00_overview/symbol_additions_v2_1_142_mcp.md) section "Module: MCP — stdio Environment Injection".

Key entities:
- `getProjectDir` (`R9`) — returns the canonical project root for the current session (defined elsewhere in the bundle)
- `ClientStdioTransport` (`bP$`, cli_inner_pretty.js:412126-412134) — the stdio transport class (now uses bounded read buffer)
- `getDefaultStdioEnv` (`XI`) — the base env factory; unchanged
- `getSandboxedEnv` (`SY6`) — sandboxed-shell env factory; unchanged
- `isSandboxedEnvironment` (`pA6`) — sandbox-mode predicate; unchanged
