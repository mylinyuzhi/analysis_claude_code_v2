# Changelog Analysis: Claude Code 2.0.59 → 2.1.7

> Analysis of significant changes between versions for guiding codebase analysis.

---

## Summary Statistics

| Metric | 2.0.59 | 2.1.7 | Change |
|--------|--------|-------|--------|
| Chunk files | ~80 | 157 | +77 files |
| Total symbols | ~8,000 | 16,225 | +8,225 symbols |
| Estimated lines | ~240K | ~450K | +210K lines |

---

## Category 1: NEW Major Features (Require New Modules)

### 1.1 Background Agents (2.0.60)
**Impact:** Core architecture change
- Agents can run in background while user continues working
- Ctrl+B unified backgrounding for bash commands and agents
- Progress notifications and async result aggregation
- `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` env var (2.1.4)

**New Module:** `26_background_agents/`

### 1.2 LSP Tool (2.0.74)
**Impact:** New tool subsystem
- Language Server Protocol integration
- go-to-definition, find-references, hover documentation
- `/terminal-setup` support for Kitty, Alacritty, Zed, Warp (2.0.74)

**New Module:** `27_lsp_integration/`

### 1.3 Chrome/Browser Integration (2.0.72)
**Impact:** New tool subsystem
- "Claude in Chrome" beta feature
- Browser control via Chrome extension
- CDP (Chrome DevTools Protocol) client
- macOS code-sign fixes (2.0.76)

**New Module:** `28_browser_control/`

---

## Category 2: Merged/Restructured Systems

### 2.1 Slash Commands + Skills Merger (2.1.3)
**Impact:** Architectural unification
- "Merged slash commands and skills, simplifying the mental model"
- Unified execution model
- Skills visible in slash command menu by default (2.1.0)
- Skill hot-reload (2.1.0)
- `context: fork` for forked sub-agent execution (2.1.0)
- `agent` field in skills (2.1.0)

**Affected Modules:** `09_slash_command/`, `10_skill/`

### 2.2 Hooks System Extension (2.1.0)
**Impact:** Feature expansion
- Hooks support in agent/skill frontmatter
- `once: true` hook configuration
- Tool hook timeout: 60s → 10 minutes (2.1.3)
- Plugin hooks loading improvements

**Affected Module:** `11_hook/`

---

## Category 3: Permission & Security Changes

### 3.1 Wildcard Permissions (2.1.2)
- `Bash(npm *)`, `Bash(* install)`, `Bash(git * main)` syntax
- MCP wildcard: `mcp__server__*` (2.0.70)
- `Task(AgentName)` for disabling specific agents (2.1.0)

### 3.2 Security Fixes
- **2.1.7:** Wildcard permission rules matching compound commands with shell operators
- **2.1.6:** Permission bypass via shell line continuation
- **2.1.2:** Command injection vulnerability in bash processing
- **2.1.0:** Sensitive data exposure in debug logs

**Affected Module:** `18_sandbox/`

---

## Category 4: MCP & Plugin Updates

### 4.1 MCP Auto-Search Mode (2.1.7)
- Enabled by default for all users
- 10% context window threshold triggers deferred loading
- MCPSearch tool for discovery
- `list_changed` notifications (2.1.0)

### 4.2 Plugin System
- Auto-update toggle per marketplace
- Git submodule initialization fix (2.1.7)
- Plugin hooks loading from plugins (2.1.0)

**Affected Modules:** `06_mcp/`, `25_plugin/`

---

## Category 5: Session & State Management

### 5.1 Named Sessions (2.0.64)
- `/rename` command for naming sessions
- `/resume <name>` for resuming by name
- Session grouping in resume screen

### 5.2 Plan Mode Improvements
- Plan files persistence across `/clear` fixed (2.1.3)
- Enter plan mode without approval (2.1.0)

### 5.3 Remote Sessions (2.1.0)
- `/teleport` command
- `/remote-env` command

**Affected Modules:** `15_state_management/`, `12_plan_mode/`

---

## Category 6: UI & Terminal Changes

### 6.1 Terminal Rendering
- Fixed-width braille characters for title animation (2.1.7)
- IME support for CJK languages (2.0.68)
- Kitty keyboard protocol fixes
- Shift+Enter in iTerm2, WezTerm, Ghostty, Kitty (2.1.0)

### 6.2 New Vim Motions (2.1.0)
- `;`, `,` for f/F/t/T repeats
- `y` operator: `yy`, `Y`, `p`, `P`
- Text objects: `iw`, `aw`, `iW`, `aW`, `i"`, `a"`, etc.
- `>>`, `<<` for indent/dedent
- `J` to join lines

### 6.3 Thinking Mode
- Enabled by default for Opus 4.5 (2.0.67)
- Configuration moved to `/config`
- Tab toggle for thinking (2.0.72)

**Affected Modules:** `02_ui/`, `19_think_level/`

---

## Category 7: Infrastructure Changes

### 7.1 OAuth & Auth
- URLs changed: console.anthropic.com → platform.claude.com (2.1.7)
- Token refresh improvements

### 7.2 Telemetry
- MCP tool names sanitized (2.1.0)
- Metrics endpoint updates

### 7.3 New Environment Variables
- `CLAUDE_CODE_TMPDIR` - Override temp directory (2.1.5)
- `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` - Disable background tasks (2.1.4)
- `CLAUDE_CODE_SHELL` - Override shell detection (2.0.65)
- `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` - Override file read limit (2.1.0)
- `FORCE_AUTOUPDATE_PLUGINS` - Force plugin updates (2.1.2)
- `IS_DEMO` - Hide email/org in UI (2.1.0)

**Affected Modules:** `24_auth/`, `17_telemetry/`

---

## Category 8: New Slash Commands

| Command | Version | Description |
|---------|---------|-------------|
| `/teleport` | 2.1.0 | Resume remote sessions |
| `/remote-env` | 2.1.0 | Configure remote environment |
| `/plan` | 2.1.0 | Enable plan mode directly |
| `/rename` | 2.0.64 | Name current session |
| `/stats` | 2.0.64 | Usage statistics with date filtering |

---

## Symbol Migration Notes

### Key File Changes (Expected)
Based on 2.0.59 analysis, core files to verify:
- `chunks.153.mjs` - LLM API, System Prompts
- `chunks.146.mjs` - Agent Loop, Tool Execution
- `chunks.107.mjs` - Compact, Attachments
- `chunks.154.mjs` - Session Management, Messages
- `chunks.130.mjs` - Skills, Plan Mode Tools
- `chunks.125.mjs` - Agents, Skill Loading

### New Chunk Files (2.1.7 specific)
Files numbered >80 likely contain new features:
- Background agents implementation
- LSP tool implementation
- Chrome integration
- Wildcard permission matching
- MCP auto-search

---

## Analysis Priority Order

1. **Phase 1 (Critical):** Background agents, async execution model
2. **Phase 2 (High):** Slash/Skill merger, hooks extension
3. **Phase 3 (High):** LSP tool, Chrome integration
4. **Phase 4 (High):** Permission wildcard matching, security fixes
5. **Phase 5 (Medium):** MCP auto-search, plugin updates
6. **Phase 6 (Medium):** Named sessions, remote commands
7. **Phase 7 (Low):** UI improvements, Vim motions
8. **Phase 8 (Low):** Auth/telemetry infrastructure

---

## Analysis Completion Status

### Completed Analysis Documents

| Module | Document | Key Content |
|--------|----------|-------------|
| 26_background_agents | `background_agents.md` | TaskOutput tool, KillShell, Ctrl+B backgrounding |
| 27_lsp_integration | `lsp_tool.md` | LSP operations, symbol extraction, server management |
| 28_browser_control | `chrome_integration.md` | Chrome skill, MCP tools, settings |
| 11_hook | `hooks_extension.md` | once: true, frontmatter hooks, timeout changes |
| 18_sandbox | `wildcard_permissions.md` | Pattern matching, security checks, compound commands |
| 06_mcp | `mcp_autosearch.md` | 10% threshold, MCPSearch tool, list_changed |
| 25_plugin | `plugin_updates.md` | Git submodules, marketplace management |
| 15_state_management | `session_updates.md` | Named sessions, teleport, repository validation |

### Symbol Index Updates

Both symbol index files updated with discovered symbols:
- `symbol_index_core.md` - Background agents, hooks, skills
- `symbol_index_infra.md` - LSP, Chrome, MCP, permissions, sessions

### Key Symbols Discovered

| Category | Key Symbols |
|----------|-------------|
| Background Agents | `aHA` (TaskOutput), `YK1` (formatTaskOutput), `GK1` (KillShell) |
| LSP Tool | `Sg2` (LSP), `xg2` (extractSymbolAtPosition), `Py2` (initLspManager) |
| Chrome | `TI9` (registerChromeSkill), `Fq7` (chromeSkillPrompt) |
| Hooks | `S75`/`x75`/`y75` (hook schemas), `OD1` (frontmatter hooks) |
| Permissions | `Mf` (checkCommandInjection), `hq0` (matchWildcard), `gq0` (classifyPattern) |
| MCP | `Db` (MCPSearch), `RZ0` (shouldEnableToolSearch), `heB` (0.1 threshold) |
| Sessions | `Vz1` (renameSession), `Yt` (resumeTeleport), `Xq0` (validateRepo) |
