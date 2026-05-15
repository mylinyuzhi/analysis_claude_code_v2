# `workspace` Is a Reserved MCP Server Name

**Versions:** 2.1.128 (added)

## Summary

v2.1.128 reserves the literal string `workspace` as an MCP server name. Two consequences:

1. **Add-time rejection** (`mcp add workspace …`) throws `Error("Cannot add MCP server "workspace": this name is reserved.")`.
2. **Load-time skip** — any pre-existing entry in `.mcp.json`/`.claude.json`/user config with `name === "workspace"` (and `type !== "sdk"`) is skipped with a warning during config loading.

The reservation exists because Claude Code now has an internal "workspace" server (mounted programmatically via `type: "sdk"`) that exposes built-in tools like `mcp__workspace__bash` and `mcp__workspace__web_fetch`. A user-defined server with the same name would shadow those built-in tools.

## Files Involved

| Version | Path | Lines | What |
|---------|------|------:|------|
| v2.1.112 | (no equivalent) | — | No reserved-name machinery for `workspace` |
| v2.1.142 | `cli_inner_pretty.js` | **50145** | `sq$ = "workspace"` — the reserved-name constant |
| v2.1.142 | `cli_inner_pretty.js` | 50157 | `UR$ = mcp__${sq$}__bash` and `Pwq = mcp__${sq$}__web_fetch` — built-in tool prefixes |
| v2.1.142 | `cli_inner_pretty.js` | **317445-317447** | `mcp add` add-time rejection |
| v2.1.142 | `cli_inner_pretty.js` | **317742-317749** | `parseMcpConfig` load-time skip with warning |
| v2.1.142 | `cli_inner_pretty.js` | 519128 | builtin server config registration (uses `alwaysLoad: true`) |

## The constant

```javascript
// ============================================
// RESERVED_MCP_SERVER_NAME - the "workspace" string
// Location: cli_inner_pretty.js:50145
// ============================================

// ORIGINAL (for source lookup):
var tu8,
  sq$ = "workspace",
  UR$,
  Pwq;
var cG = T(() => {
  tu8 = { /* tool renames */ };
  ((UR$ = `mcp__${sq$}__bash`), (Pwq = `mcp__${sq$}__web_fetch`));
});

// READABLE (for understanding):
let WORKSPACE_TOOL_NAME_RENAMES;
const RESERVED_MCP_SERVER_NAME = "workspace";        // ← the reservation
let WORKSPACE_BASH_TOOL_NAME;                        // mcp__workspace__bash
let WORKSPACE_WEB_FETCH_TOOL_NAME;                   // mcp__workspace__web_fetch

const initWorkspaceToolNames = T(() => {
    WORKSPACE_TOOL_NAME_RENAMES = { /* ... */ };
    WORKSPACE_BASH_TOOL_NAME = `mcp__${RESERVED_MCP_SERVER_NAME}__bash`;
    WORKSPACE_WEB_FETCH_TOOL_NAME = `mcp__${RESERVED_MCP_SERVER_NAME}__web_fetch`;
});

// Mapping: sq$→RESERVED_MCP_SERVER_NAME, UR$→WORKSPACE_BASH_TOOL_NAME,
//          Pwq→WORKSPACE_WEB_FETCH_TOOL_NAME, tu8→WORKSPACE_TOOL_NAME_RENAMES
```

## Add-time rejection

```javascript
// ============================================
// addMcpServer - rejects "workspace" name during config write
// Location: cli_inner_pretty.js:317442-317451
// ============================================

// ORIGINAL (for source lookup, relevant prologue):
async function zwH(H, $, q) {
  if (H.match(/[^a-zA-Z0-9_-]/))
    throw Error(`Invalid name ${H}. Names can only contain letters, numbers, hyphens, and underscores.`);
  if (uTH(H)) throw Error(`Cannot add MCP server "${H}": this name is reserved.`);     // ← reserved-by-type (claude-for-chrome)
  if (AZH(H)) throw Error(`Cannot add MCP server "${H}": this name is reserved.`);     // ← reserved-by-type (computer-use)
  if (H === sq$) throw Error(`Cannot add MCP server "${H}": this name is reserved.`);  // ← NEW (v2.1.128): workspace
  if (KQ()) throw Error("Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers");
  // ...

// READABLE (for understanding):
async function addMcpServer(serverName, configJson, scope) {
    // Validate name character set.
    if (serverName.match(/[^a-zA-Z0-9_-]/)) {
        throw new Error(`Invalid name ${serverName}. Names can only contain letters, numbers, hyphens, and underscores.`);
    }

    // Reserved names (3 categories, all throw the same way):
    if (isReservedChromeName(serverName)) {
        throw new Error(`Cannot add MCP server "${serverName}": this name is reserved.`);
    }
    if (isReservedComputerUseName(serverName)) {
        throw new Error(`Cannot add MCP server "${serverName}": this name is reserved.`);
    }
    if (serverName === RESERVED_MCP_SERVER_NAME) {                                   // ← NEW
        throw new Error(`Cannot add MCP server "${serverName}": this name is reserved.`);
    }

    // Enterprise lockdown check.
    if (isEnterpriseMcpExclusive()) {
        throw new Error("Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers");
    }
    // ...
}

// Mapping: zwH→addMcpServer, H→serverName, $→configJson, q→scope,
//          uTH→isReservedChromeName, AZH→isReservedComputerUseName,
//          sq$→RESERVED_MCP_SERVER_NAME, KQ→isEnterpriseMcpExclusive
```

## Load-time skip

```javascript
// ============================================
// parseMcpConfig - skips "workspace" entry with warning during config parsing
// Location: cli_inner_pretty.js:317740-317749 (inside the per-server validation loop)
// ============================================

// ORIGINAL (for source lookup, relevant block):
let J = j.data;
if (O === sq$ && J.type !== "sdk") {
  f(
    O,
    `"${O}" is a reserved MCP server name and was not loaded`,
    `Rename this server in your MCP config — "${O}" is reserved for internal use`,
  );
  continue;
}

// READABLE (for understanding):
const validatedConfig = parseResult.data;

// Reservation check — applies to ALL transport types except sdk.
// (sdk type IS the legitimate workspace builtin, registered programmatically.)
if (currentServerName === RESERVED_MCP_SERVER_NAME && validatedConfig.type !== "sdk") {
    addWarning(
        currentServerName,
        `"${currentServerName}" is a reserved MCP server name and was not loaded`,
        `Rename this server in your MCP config — "${currentServerName}" is reserved for internal use`,
    );
    continue;  // skip — do not register this server
}

// Mapping: J→validatedConfig, O→currentServerName, j→parseResult,
//          f→addWarning, sq$→RESERVED_MCP_SERVER_NAME
```

## Why `type !== "sdk"` and not unconditional

The internal "workspace" server itself uses `type: "sdk"` (declared programmatically at `cli_inner_pretty.js:519128`):

```javascript
// (Excerpt from where the builtin is registered with alwaysLoad: true)
{
  alwaysLoad: !0,
  // ...
}
```

The validation loop iterates over user-supplied configs from disk. A `type: "sdk"` entry could only get into the loop if a user wrote `{"workspace": {"type": "sdk", "name": "workspace"}}` in `.mcp.json` — that would be unusual but not invalid (the user is essentially re-declaring the builtin). The `type !== "sdk"` carve-out lets the builtin registration path work without triggering its own warning.

In practice the carve-out is defensive — the builtin isn't registered through this disk-parsing path; it's wired up directly in code. But the check is cheap and removes any future ambiguity if the path ever does run.

## What the user sees on conflict

If a user already has a `.mcp.json` entry named `workspace` from before v2.1.128:

```
$ claude
[during MCP server load]
Warning: MCP server "workspace" is a reserved MCP server name and was not loaded
         Suggestion: Rename this server in your MCP config — "workspace" is reserved for internal use

[at /mcp]
(the user's "workspace" server is absent from the list; the builtin workspace tools still work)
```

If the user runs `claude mcp add workspace https://my-server.com`:

```
Error: Cannot add MCP server "workspace": this name is reserved.
```

## Built-in tools that justify the reservation

Looking at line 50157, the prefixes that depend on the reserved name:

| Built-in tool full name | Purpose |
|-------------------------|---------|
| `mcp__workspace__bash` (`UR$`) | Sandboxed Bash tool exposed through MCP-style invocation |
| `mcp__workspace__web_fetch` (`Pwq`) | Web fetch tool exposed through MCP-style invocation |

These tools are part of the Plan-Mode / Skill-internal toolset that *appears* to come from an MCP server (matching naming convention `mcp__<server>__<tool>`) but is actually built-in. The reservation prevents a user-defined server from colliding with their names.

## Why This Approach

### Why hard-reserve instead of "best-effort namespace"

Built-in tool naming relies on prefix uniqueness — the tool dispatcher routes `mcp__workspace__bash` to the builtin handler, not to any user-defined `workspace` MCP server. If a user named their server `workspace`, the dispatcher would still route to the builtin (because the builtin registration happens first), but the user-defined server's `bash`/`web_fetch` tools would be unreachable (no matter which way Claude resolved the conflict, *somebody's* tool would be invisible). Hard-reserving the name surfaces the conflict at load time with a clear remedy ("rename your server").

### Why skip (not fail) on existing config

A *hard fail* on an existing `.mcp.json` would mean upgrading Claude Code from v2.1.127 to v2.1.128 could prevent startup for any user who had named a server `workspace`. The skip-with-warning behavior is graceful: the rest of the user's servers still load, the user gets a notification about what changed, and they can rename at their convenience.

### Why reject (fail loudly) on `mcp add`

The user is *actively typing* this command. Failing fast with a clear error message is the right behavior — they can immediately re-issue the command with a different name. The alternative ("accept it, then ignore it on next load") would mean the user thinks the add succeeded but the server is silent.

### Why `workspace` specifically

The name is chosen because the builtin tools represent the user's *workspace* — the file system the agent operates on. Other candidates considered (by analogy from the other reserved name predicates `uTH` for chrome-for-claude and `AZH` for computer-use):
- `builtin` — clearer but less natural in conversation
- `local` — already an MCP scope (`scope: "local"`)
- `system` — overloaded across tools

`workspace` is intuitive in the model's mental model and was already used internally before the reservation.

### Edge case: third-party plugins that ship a `workspace` server

A plugin's `.mcp.json` entries are loaded through the same parser. The reservation applies — the plugin's `workspace` server is skipped and the user sees the warning. Plugin authors are expected to rename to avoid the collision. The warning is annotated with `mcpErrorMetadata.severity: "warning"` (line 317716), so it shows up in `/doctor` and `/plugin details` output.

### Key insight

Reserving the name is the *correct* solution to a namespace collision that was previously implicit (the dispatcher silently won, the user-side server was silently shadowed). Three lines of code — one constant declaration plus two if-statements — convert a silent failure into a loud one. The user gets a remedy at the point of failure, not after long debugging.

## Related Symbols

See [`symbol_additions_v2_1_142_mcp.md`](../00_overview/symbol_additions_v2_1_142_mcp.md) section "Module: MCP — Reserved Names".

Key entities:
- `RESERVED_MCP_SERVER_NAME` (`sq$`, cli_inner_pretty.js:50145) — the literal `"workspace"`
- `WORKSPACE_BASH_TOOL_NAME` (`UR$`, cli_inner_pretty.js:50157)
- `WORKSPACE_WEB_FETCH_TOOL_NAME` (`Pwq`, cli_inner_pretty.js:50157)
- `addMcpServer` (`zwH`, cli_inner_pretty.js:317442) — add-time rejection
- `parseMcpConfig` (`tD$`, cli_inner_pretty.js:317695) — load-time skip
- `isReservedChromeName` (`uTH`) — pre-existing reservation for `chrome-for-claude`
- `isReservedComputerUseName` (`AZH`) — pre-existing reservation for `computer-use`
- `isEnterpriseMcpExclusive` (`KQ`)
