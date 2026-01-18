# packages/cli Scaffold Documentation

## Overview

The `packages/cli/` directory contains a **TypeScript scaffold** reconstructed from the obfuscated runtime code. This is NOT the actual runtime implementation.

---

## Purpose

This scaffold serves as:
1. Type definitions for the CLI interface
2. Reference documentation for function signatures
3. Development aid for understanding CLI structure

---

## Scaffold vs Runtime

| Scaffold File | Runtime Location | Completeness |
|---------------|------------------|--------------|
| src/commands/entry.ts | chunks.157.mjs:1860-1891 | Partial (stubs) |
| src/commands/options.ts | chunks.157.mjs:21-27 | Complete |
| src/commands/mcp-cli.ts | cli.chunks.mjs:5055-5441 | Partial (stubs) |
| src/commands/chrome-handlers.ts | chunks.157.mjs:1599-1677 | Partial |
| src/types.ts | chunks.157.mjs | Complete |

---

## Stub Implementations

The following functions are **stubs** in the scaffold:

### Initialization (entry.ts)
- `enableConfigs()` - Empty, no config loading
- `applySafeEnvVars()` - Empty stub
- `initializeEventLogging()` - Empty stub
- `populateOAuth()` - Empty stub
- `runMigrations()` - Empty stub
- `loadRemoteSettings()` - Empty stub

### MCP CLI (mcp-cli.ts)
- `getMcpState()` - Returns empty state
- `initializeMcp()` - Empty stub
- Tool execution not implemented

### Chrome (chrome-handlers.ts)
- Tool execution stubs only
- Resource reading not implemented

---

## Key Insight

For actual implementation details, refer to:
- **Runtime CLI:** `chunks.157.mjs` (entry points)
- **Runtime MCP CLI:** `cli.chunks.mjs` (MCP commands)
- **Analysis docs:** `01_cli/*.md`

The scaffold provides readable interfaces but all actual logic resides in the obfuscated chunks.

---

## Related Documents

- [entry_points.md](./entry_points.md) - CLI entry point analysis
- [argument_parsing.md](./argument_parsing.md) - Argument parsing details
- [mcp_cli.md](./mcp_cli.md) - MCP CLI command reference
- [subcommands.md](./subcommands.md) - Subcommand implementations
- [chrome_integration.md](./chrome_integration.md) - Chrome integration

---

## Symbol References

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (includes MCP CLI)

Key symbols documented in this file:
- `mainEntry` (D_7) - Main CLI entry point
- `mcpCliHandler` (nX9) - MCP CLI entry handler
- `mcpProgram` (de) - MCP CLI Commander.js program
