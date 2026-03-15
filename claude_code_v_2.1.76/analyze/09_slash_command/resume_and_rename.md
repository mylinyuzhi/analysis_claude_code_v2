# `/resume` and `/rename` — Deep Reverse Engineering Analysis

## Overview

`/resume` and `/rename` are two complementary slash commands that together form the **session lifecycle management** surface of Claude Code. `/resume` is a rich `local-jsx` command with a multi-mode interactive picker UI, agentic AI search, cross-project navigation, and direct-ID/title lookup. `/rename` is a simpler `local` command that sets a persistent custom title for the current session — but its logic also appears inline inside the `/resume` picker via `Ctrl+R`.

In v2.1.76, session titles are automatically set from the first user prompt (no need to manually rename), and session names are preserved through compaction and remote sync (see [../33_remote_sessions/state_sync.md](../33_remote_sessions/state_sync.md)).

This document traces every code path from user input through state management, persistence, and UI rendering.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI, Skills
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Session state (resumeSession)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions/components in this document:

**`/resume` — Registration & Dispatch**
- `i8z` (NYq init) - `/resume` command definition object (chunks.161.mjs:2560)
- `l8z` - `/resume` handler: args routing (chunks.161.mjs:2466)
- `c8z` - `/resume` interactive component (chunks.161.mjs:2388)
- `WN6` - Session picker UI — the main multi-mode picker (chunks.161.mjs:1227)

**`/resume` — Picker Sub-components**
- `KYq` - Session transcript preview (chunks.161.mjs:930)
- `_Yq` - Project tab bar (chunks.161.mjs:1057)
- `ZN6` - Cross-project resume resolver (chunks.161.mjs:2178)
- `fN6` - Agentic AI search (chunks.161.mjs:2244)
- `p8z` - Agentic search system prompt (chunks.161.mjs:2303)
- `GYq` - Error message formatter (chunks.161.mjs:2349)

**`/rename` — Registration & Persistence**
- `j8z` (IYq init) - `/rename` command definition object (chunks.161.mjs:2562)
- `RN6` - `/rename` handler: sets session title in app state (chunks.161.mjs:2430)
- `persistSessionTitle` - Writes title to session JSONL metadata
- `extractChatTitle` (I2z) - Derives title from conversation messages (chunks.174.mjs:60)

---

## `/rename` Command

### What it does

Sets a persistent custom title for the current session. The title is displayed in the `/resume` picker, session list, and (in v2.1.76) propagated to remote sessions.

### How it works

1. User runs `/rename My New Title`
2. `RN6` updates `appState.sessionTitle` to `"My New Title"`
3. The title is written to the session's JSONL metadata file
4. The title appears in `/resume` picker on subsequent sessions

### v2.1.76: Automatic Title from First Prompt

In v2.1.76, sessions are automatically titled from the first user message. This means most users never need to run `/rename` at all. The automatic title mechanism:

1. When the first user message completes (after the first LLM response), `extractChatTitle` (I2z) is called
2. The extracted title is saved as the session title
3. If the user later runs `/rename`, the manual title overrides the automatic one
4. Manual titles are marked with a flag so they are not overwritten by future automatic extraction

**Why automatic titling:** In v2.1.38, sessions displayed as untitled until the user ran `/rename`. In practice, most users never renamed sessions, making the `/resume` picker difficult to navigate. Automatic titling from the first prompt dramatically improves session discoverability.

### Title Persistence Through Compaction

In v2.1.76, session titles are explicitly preserved through context compaction. The compaction process:
1. Reads the current `sessionTitle` from app state
2. Writes it to the compaction summary as metadata (not part of the summarized conversation)
3. After compaction, restores `sessionTitle` from the metadata

This ensures that a session's title is not lost when the conversation is compacted. In v2.1.38, this was a known issue where the title could be reset after compaction.

---

## `/resume` Command

### What it does

Opens an interactive session picker UI that allows the user to:
1. Browse and search previous sessions (across all projects)
2. Preview session transcripts
3. Resume a specific session by ID or title
4. Rename sessions from within the picker (Ctrl+R)
5. Use AI-powered natural language search to find sessions by topic

### Picker Modes

**Tab 1 — Current Project Sessions:**
Lists sessions from the current project's `.claude/` directory, sorted by most recent. Shows automatic or manual title, timestamp, and truncated last message.

**Tab 2 — All Projects:**
Shows sessions across all projects. Uses cross-project resolver (`ZN6`) to load session lists from multiple directories in parallel.

**Tab 3 — AI Search:**
Allows natural language query (e.g., "session where I debugged the auth middleware"). Uses agentic search (`fN6`) to scan session transcripts and rank by relevance.

### Session Picker Component (WN6)

**What it does:** The main interactive picker component with keyboard navigation, preview panel, and search.

**How it works:**
1. Renders a scrollable list of sessions on the left
2. Preview panel on the right shows the last few messages from the highlighted session
3. Keyboard: arrows to navigate, Enter to resume, Ctrl+R to rename, `/` to filter, Esc to cancel
4. When user presses Enter: calls `resumeSession(sessionId)` which hydrates the app state from the JSONL file

### Agentic AI Search (fN6)

**What it does:** Uses the LLM to find sessions matching a natural language query.

**How it works:**
1. User types their query in the search box
2. `fN6` spawns a sub-agent with system prompt `p8z`
3. The agent scans session JSONL files and extracts relevant snippets
4. Results are ranked and returned as a list of `{ sessionId, relevance, excerpt }`
5. User selects a result to resume

**Why agentic search vs. text search:** Session transcripts are long and context-rich. Simple keyword search misses semantic matches (e.g., "authentication" matching a session about "login bugs"). The LLM understands intent and can match conceptually.

### Direct ID/Title Resume

`/resume <id-or-title>` bypasses the picker:
1. Tries to match `args` as an exact session ID
2. If no match, tries fuzzy title match
3. If match found, calls `resumeSession` directly
4. If no match, shows error and opens picker

---

## Session State on Resume

When a session is resumed via `resumeSession`:

1. Load JSONL file for the target session
2. Reconstruct `messages[]` from the JSONL events
3. Restore `sessionTitle`, `sessionId`, and other metadata
4. Update app state with reconstructed values
5. Re-render REPL with restored conversation

**What is NOT restored:**
- Tool permission decisions (these are session-scoped and cannot be meaningfully transferred)
- MCP server connections (must reconnect)
- Editor state (file open positions, etc.)

**What IS restored (v2.1.76):**
- Full conversation history
- Session title (auto or manual)
- Cron jobs (preserved in JSONL metadata, recreated with adjusted next-run times)
- Task graph (partial, if it was serialized)
