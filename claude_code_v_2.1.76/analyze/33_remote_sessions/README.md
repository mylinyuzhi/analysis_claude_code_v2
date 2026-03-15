# 33 - Remote Sessions

## Overview

Remote Sessions enables Claude Code to operate through bidirectional WebSocket connections with claude.ai. This allows users to start sessions remotely, forward permissions, hydrate session state, and resume sessions from different clients (including VSCode).

**Introduced**: v2.1.27, with enhancements in v2.1.30, v2.1.33, and v2.1.76

## Key Components

### WebSocket Communication
- Bidirectional WebSocket channel between CLI and claude.ai
- Stream event forwarding (tool calls, responses, status updates)
- Reconnection logic with exponential backoff
- Bridge session extended disconnect recovery (v2.1.76)

### Session Management
- **Session hydration** - Restore full session state on reconnect
- **Permission forwarding** - Remote permission requests routed to user
- **Session browsing** - List and resume previous remote sessions
- **Session naming** - Titles set from first prompt (v2.1.76)
- **Rapid message batching** - Multiple quick messages coalesced (v2.1.76)
- **Idle session recovery** - Reconnect to idle remote sessions (v2.1.76)

### Policy Gating
- `allow_remote_sessions` policy flag
- Organization-level control over remote session capability
- Enterprise compliance support

### Remote Control
- `claude remote-control --name <session-name>` option (v2.1.76) for targeting named sessions
- /poll rate capped at 10 minutes while connected (v2.1.76)
- JWT refresh with redelivery on expiry (v2.1.76)

### IDE Integration
- VSCode extension support for browsing remote sessions
- Session resume from IDE context
- Plan mode push to remote (`pushToRemote` in ExitPlanMode)

## Key Source Files

- `chunks.126.mjs` - Session API client (list, get, send event)
- `chunks.185.mjs` - `useRemoteSession` hook, session lifecycle
- `chunks.142.mjs` - Session creation, WebSocket connection
- `chunks.176.mjs` - Proxy support, WebSocket transport options

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Changelog References

- **v2.1.27**: Initial remote session support, WebSocket communication
- **v2.1.30**: Permission forwarding, policy gating
- **v2.1.33**: Session hydration improvements, VSCode integration
- **v2.1.76**: Session titles from first prompt, rapid message batching, JWT refresh redelivery, idle session recovery, `claude remote-control --name`, /poll rate 10min cap while connected
