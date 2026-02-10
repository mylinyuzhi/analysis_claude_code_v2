# 33 - Remote Sessions

## Overview

Remote Sessions enables Claude Code to operate through bidirectional WebSocket connections with claude.ai. This allows users to start sessions remotely, forward permissions, hydrate session state, and resume sessions from different clients (including VSCode).

**Introduced**: v2.1.27, with enhancements in v2.1.30, v2.1.33

## Key Components

### WebSocket Communication
- Bidirectional WebSocket channel between CLI and claude.ai
- Stream event forwarding (tool calls, responses, status updates)
- Reconnection logic with exponential backoff

### Session Management
- **Session hydration** - Restore full session state on reconnect
- **Permission forwarding** - Remote permission requests routed to user
- **Session browsing** - List and resume previous remote sessions

### Policy Gating
- `allow_remote_sessions` policy flag
- Organization-level control over remote session capability
- Enterprise compliance support

### IDE Integration
- VSCode extension support for browsing remote sessions
- Session resume from IDE context
- Plan mode push to remote (`pushToRemote` in ExitPlanMode)

## Key Source Files

> To be populated during analysis. Estimated ~20 source files.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Changelog References

- **v2.1.27**: Initial remote session support, WebSocket communication
- **v2.1.30**: Permission forwarding, policy gating
- **v2.1.33**: Session hydration improvements, VSCode integration
