# File Index (Claude Code 2.1.38)

> Mapping of chunk files to their primary functional content.
> Total Chunks: 190

| File | Primary Module(s) | Key Symbols / Functionality |
|------|-------------------|-----------------------------|
| `chunks.1.mjs` | Global State | `globalState`, `sessionId` management |
| `chunks.54.mjs` | Keybindings | `loadKeybindings`, `watchKeybindingsFile` |
| `chunks.87.mjs` | Auto Memory | `MEMORY.md` logic and instructions |
| `chunks.110.mjs` | Keybindings UI | `KeybindingSetup`, `handleKeyEvent` (chord processing) |
| `chunks.126.mjs` | Remote Sessions | `sendEventToRemoteSession`, `updateSessionTitle` |
| `chunks.129.mjs` | Agent Teams | Swarm-related constants |
| `chunks.131.mjs` | Agent Teams | `TmuxBackend`, `swarm-view` orchestration |
| `chunks.140.mjs` | Task System | `TaskCreate`, `TaskGet`, Task management logic |
| `chunks.141.mjs` | Task System / Teams | `TaskUpdate`, `TaskList`, `TeamCreateTool`, `SendMessageTool` |
| `chunks.144.mjs` | Remote / MCP | WebSocket Transport (Lower level) |
| `chunks.145.mjs` | Remote / MCP | WebSocket Transport (Higher level) |
| `chunks.149.mjs` | Fast Mode | `ANTHROPIC_SMALL_FAST_MODEL` configuration |
| `chunks.153.mjs` | Fast Mode / UI | Fast mode status display and toggle hints |
| `chunks.169.mjs` | Auto Memory | `auto_memory` feature registration |
| `chunks.173.mjs` | Remote Sessions | Hydration error handling |
| `chunks.179.mjs` | Fast Mode | Main loop mode switching logic |
| `chunks.185.mjs` | Remote Sessions | `useRemoteSession` hook and session init |
| `chunks.189.mjs` | CLI / Teams | Swarm CLI arguments (`--teammate-mode`) |
| `cli.chunks.mjs` | CLI Entry | Root entry point, tool wiring, `bootstrapTelemetry` |
