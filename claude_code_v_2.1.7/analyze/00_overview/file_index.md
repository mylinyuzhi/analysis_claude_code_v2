# File Index - Claude Code 2.1.7

> Maps chunk files to their content and key functions.
> Total: 157 chunk files, 16,225 symbols

---

## Quick Navigation

- [High-Symbol Files](#high-symbol-files-top-30) - Files with most symbols
- [Core Modules](#core-modules) - Agent loop, tools, API
- [New Features](#new-features-217) - Background agents, LSP, Chrome
- [Infrastructure](#infrastructure) - MCP, telemetry, auth

---

## High-Symbol Files (Top 30)

| File | Symbols | Expected Content |
|------|---------|------------------|
| chunks.1.mjs | 976 | Foundation runtime, module loader, global utilities |
| chunks.153.mjs | 463 | LLM API, System Prompts (from 2.0.59) |
| chunks.55.mjs | 366 | TBD - needs analysis |
| chunks.78.mjs | 364 | TBD - needs analysis |
| chunks.58.mjs | 336 | TBD - needs analysis |
| chunks.16.mjs | 332 | Tool constants, figures, frontmatter parsing |
| chunks.86.mjs | 304 | TBD - needs analysis |
| chunks.68.mjs | 285 | Shell command wrapper, bash utilities |
| chunks.77.mjs | 267 | TBD - needs analysis |
| chunks.46.mjs | 257 | TBD - needs analysis |
| chunks.85.mjs | 251 | TBD - needs analysis |
| chunks.148.mjs | 244 | TBD - needs analysis |
| chunks.66.mjs | 236 | TBD - needs analysis |
| chunks.89.mjs | 234 | TBD - needs analysis |
| chunks.79.mjs | 233 | TBD - needs analysis |
| chunks.19.mjs | 223 | Tool name constants |
| chunks.136.mjs | 223 | TBD - needs analysis |
| chunks.91.mjs | 219 | TBD - needs analysis |
| chunks.82.mjs | 214 | TBD - needs analysis |
| chunks.151.mjs | 210 | TBD - needs analysis |
| chunks.112.mjs | 202 | TBD - needs analysis |
| chunks.152.mjs | 198 | Skill loading, output style |
| chunks.155.mjs | 196 | Commander.js framework |
| chunks.135.mjs | 195 | TBD - needs analysis |
| chunks.107.mjs | 190 | Compact, attachments, telemetry |
| chunks.53.mjs | 188 | TBD - needs analysis |
| chunks.131.mjs | 187 | TBD - needs analysis |
| chunks.63.mjs | 185 | TBD - needs analysis |
| chunks.57.mjs | 184 | TBD - needs analysis |
| chunks.150.mjs | 183 | TBD - needs analysis |

---

## Core Modules (From 2.0.59 Analysis)

### Entry & CLI
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.158.mjs (if exists) | Main entry, command handler | mainEntry, commandHandler |
| chunks.155.mjs | Commander.js framework | Command, Option, Argument |

### Agent Loop & Tool Execution
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.146.mjs | Main agent loop, tool executor | mainAgentLoop, StreamingToolExecutor |

### LLM API
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.153.mjs | API streaming, request building | streamApiCall, buildRequestPayload |
| chunks.121.mjs | Retry wrapper, prompt hooks | retryWrapper, executePromptHook |

### System Prompts
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.152.mjs | Core system prompt | getCoreSystemPrompt |
| chunks.107.mjs | Attachments, reminders | generateAllAttachments |

### Tools
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.16.mjs | BASH_TOOL_NAME constant | C9 |
| chunks.19.mjs | READ/WRITE/EDIT tool names | d5, wX, $5 |
| chunks.60.mjs | TodoWrite tool | BY, QEB |
| chunks.130.mjs | Skills, Plan mode tools | ln, gq |

### Agents & Subagents
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.125.mjs | Built-in agents, agent helpers | generalPurposeAgent, exploreAgent |
| chunks.145.mjs | Task tool, subagent execution | executeAgent, TaskTool |

### Compact
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.107.mjs | Auto-compact, micro-compact | fullCompact, autoCompactDispatcher |

### Hooks
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.147.mjs | Hook execution | executeHooksInREPL |
| chunks.146.mjs | Shell/agent hooks | executeShellHook, executeAgentHook |

### Skills
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.130.mjs | Skill tool definition | SkillTool |
| chunks.152.mjs | Skill loading | loadSkillsFromDirectory |

---

## New Features (2.1.7)

### Background Agents (2.0.60)
| File | Content | Status |
|------|---------|--------|
| TBD | Background agent spawning | Needs identification |
| TBD | Ctrl+B backgrounding | Needs identification |
| TBD | Async result aggregation | Needs identification |

### LSP Tool (2.0.74)
| File | Content | Status |
|------|---------|--------|
| TBD | LSP server initialization | Needs identification |
| TBD | go-to-definition | Needs identification |

### Chrome Integration (2.0.72)
| File | Content | Status |
|------|---------|--------|
| TBD | Chrome extension comm | Needs identification |
| TBD | CDP client | Needs identification |

### MCP Auto-Search (2.1.7)
| File | Content | Status |
|------|---------|--------|
| TBD | MCPSearch tool | Needs identification |
| TBD | 10% threshold logic | Needs identification |

### Wildcard Permissions (2.1.2)
| File | Content | Status |
|------|---------|--------|
| TBD | Pattern matching | Needs identification |

---

## Infrastructure

### State Management
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.70.mjs | App state, React context | appState, AppStateProvider |
| chunks.154.mjs | Session storage paths | getProjectDir |
| chunks.106.mjs | Settings, todo persistence | loadSettings |

### MCP
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.101.mjs | MCP state initialization | initializeMcpState |

### Telemetry
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.107.mjs | BigQuery metrics | metrics endpoint |

### Auth
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.88.mjs | API client creation | createApiClient |

### Sandbox/Permissions
| File | Content | Key Symbols |
|------|---------|-------------|
| TBD | Permission validation | Needs identification |

---

## File Analysis Progress

| Status | Count | Description |
|--------|-------|-------------|
| Identified | ~30 | From 2.0.59 analysis |
| TBD | ~127 | Need analysis |
| New Features | ~10 | Priority for new feature discovery |

---

## Next Steps

1. Verify 2.0.59 file mappings still hold in 2.1.7
2. Identify chunks containing new features (background agents, LSP, Chrome)
3. Map high-symbol files (chunks.55, 78, 58, 86, etc.)
4. Build complete symbol_index files
