# UI Linkage - Code Indexing (Module 14)

## Overview

This document covers how the Code Indexing system (Module 14) connects to the terminal UI. The bridge from file search results to rendered autocomplete dropdown involves five layers: the React input hook, the suggestion aggregator, the list renderer, the item renderer, and the terminal display engine.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Code Indexing, UI Components)

Key UI functions in this document:
- `fileSuggestionsWrapper` (NgA) - Aggregates file + MCP + agent suggestions (chunks.182.mjs:2316)
- `useAutocompleteInput` (WGq) - React hook: orchestrates all `@` autocomplete state (chunks.183.mjs:1)
- `renderSuggestionList` (rU1) - List container with scroll window (chunks.151.mjs:1758)
- `suggestionItemComponent` (vlY) - Single item renderer with type-based branching (chunks.151.mjs:1819)
- `formatSuggestion` ($Gq) - Normalizes suggestion to display object (chunks.182.mjs)
- `getAgentSuggestions` (A0z) - Builds agent-type suggestion items (chunks.182.mjs)
- `getSuggestionWidth` (ElY) - Calculates terminal display width (chunks.151.mjs)

---

## Layer 1: Autocomplete React Hook (`WGq` / `useAutocompleteInput`)

**Location:** chunks.183.mjs
**Role:** The central React hook that manages all state for the `@` mention autocomplete. It fires on every keystroke, debounces the search, and returns the current suggestion list + selected index to the parent REPL component.

**Hook API:**
```typescript
interface AutocompleteResult {
    suggestions: SuggestionItem[];        // All ranked suggestions
    selectedSuggestion: number;           // Index of highlighted item
    commandArgumentHint: string | null;   // Hint text for command args
    inlineGhostText: string | null;       // Ghost text completion
    // ... keyboard handlers
}
```

**Trigger conditions:**
The hook fires `NgA` (fileSuggestionsWrapper) when:
1. User types `@` at start of input or within quoted context.
2. User types `@text` where `text` is the search query.
3. Input changes while a suggestion panel is open.

**Key invocations in chunks.183.mjs:**
```javascript
// Location 1: Standard @ detection (chunks.183.mjs:58)
let L1 = await NgA($1, y, $, G1);
// $1 = current query after "@", y = mcpResources map, $ = agents, G1 = forceShow

// Location 2: Inline @ in quoted context (chunks.183.mjs:399)
G1 = await NgA(f1, y, $, x1);
// f1 = query, x1 = forceShow flag
```

**State management flow:**
```
User types "@src" in InputBox
         │
         ▼
useAutocompleteInput hook fires
         │
         ├── Detects "@" prefix
         ├── Extracts query "src"
         ├── await NgA("src", mcpResources, agents)
         │
         ▼
[Returns to REPL parent component]
         │
         ├── suggestions = [{id:"file-src/...", ...}, ...]
         ├── selectedSuggestion = 0
         │
         ▼
renderSuggestionList(rU1) renders the dropdown
```

---

## Layer 2: Suggestion Aggregator (`NgA` / `fileSuggestionsWrapper`)

**Location:** chunks.182.mjs:2316
**Role:** Merges file suggestions (from indexing system), MCP resource suggestions, and agent suggestions into a single scored list.

```javascript
// ============================================
// fileSuggestionsWrapper - Multi-source suggestion aggregator
// Location: chunks.182.mjs:2316-2369
// ============================================

// ORIGINAL (for source lookup):
async function NgA(A, q, K, Y = !1) {
    if (!A && !Y) return [];
    let [z, w] = await Promise.all([gAq(A, Y), Promise.resolve(A0z(K, A, Y))]),
        H = z.map((J) => ({
            type: "file",
            displayText: J.displayText,
            description: J.description,
            path: J.displayText,
            filename: OGq.basename(J.displayText),
            score: J.metadata?.score
        })),
        $ = Object.values(q).flat().map((J) => ({
            type: "mcp_resource",
            displayText: `${J.server}:${J.uri}`,
            description: _Gq(J.description || J.name || J.uri),
            server: J.server,
            uri: J.uri,
            name: J.name || J.uri
        }));
    if (!A) return [...H, ...$, ...w].slice(0, VgA).map($Gq);
    let O = [...$, ...w], _ = [];
    for (let J of H) _.push({ source: J, score: J.score ?? 0.5 });
    if (O.length > 0) {
        let X = new wy(O, {
            includeScore: !0, threshold: 0.6,
            keys: [
                { name: "displayText", weight: 2 },
                { name: "name", weight: 3 },
                { name: "server", weight: 1 },
                { name: "description", weight: 1 },
                { name: "agentType", weight: 3 }
            ]
        }).search(A, { limit: VgA });
        for (let D of X) _.push({ source: D.item, score: D.score ?? 0.5 })
    }
    return _.sort((J, X) => J.score - X.score),
           _.slice(0, VgA).map((J) => J.source).map($Gq)
}

// READABLE (for understanding):
async function fileSuggestionsWrapper(query, mcpResources, agents, forceShow = false) {
    if (!query && !forceShow) return [];

    // Parallel fetch: files (from indexing system) + agents
    let [fileSuggestions, agentSuggestions] = await Promise.all([
        getFileSuggestions(query, forceShow),
        Promise.resolve(getAgentSuggestions(agents, query, forceShow))
    ]);

    // Normalize file suggestions to display objects
    let normalizedFiles = fileSuggestions.map((f) => ({
        type: "file",
        displayText: f.displayText,
        description: f.description,
        path: f.displayText,
        filename: path.basename(f.displayText),
        score: f.metadata?.score      // Rust score or undefined
    }));

    // Normalize MCP resources to display objects
    let normalizedMcp = Object.values(mcpResources).flat().map((r) => ({
        type: "mcp_resource",
        displayText: `${r.server}:${r.uri}`,
        description: truncateDescription(r.description || r.name || r.uri),
        server: r.server,
        uri: r.uri,
        name: r.name || r.uri
    }));

    // No query → merge all sources, no ranking
    if (!query) {
        return [...normalizedFiles, ...normalizedMcp, ...agentSuggestions]
            .slice(0, MAX_SUGGESTIONS)
            .map(formatSuggestion);
    }

    // With query → score file results (use Rust scores), Fuse.js rank MCP+agents
    let scored = [];
    for (let f of normalizedFiles) {
        scored.push({ source: f, score: f.score ?? 0.5 });
    }

    if ([...normalizedMcp, ...agentSuggestions].length > 0) {
        let fuseResults = new Fuse([...normalizedMcp, ...agentSuggestions], {
            includeScore: true,
            threshold: 0.6,
            keys: [
                { name: "displayText", weight: 2 },
                { name: "name", weight: 3 },
                { name: "server", weight: 1 },
                { name: "description", weight: 1 },
                { name: "agentType", weight: 3 }
            ]
        }).search(query, { limit: MAX_SUGGESTIONS });

        for (let r of fuseResults) {
            scored.push({ source: r.item, score: r.score ?? 0.5 });
        }
    }

    return scored
        .sort((a, b) => a.score - b.score)
        .slice(0, MAX_SUGGESTIONS)
        .map((item) => item.source)
        .map(formatSuggestion);
}

// Mapping: NgA→fileSuggestionsWrapper, A→query, q→mcpResources, K→agents, Y→forceShow,
//          z→fileSuggestions, w→agentSuggestions, H→normalizedFiles, $→normalizedMcp,
//          O→allNonFiles, _→scored, J→fileResult, X→fuseResults, D→fuseResult,
//          VgA→MAX_SUGGESTIONS, $Gq→formatSuggestion, gAq→getFileSuggestions,
//          A0z→getAgentSuggestions, OGq→path, _Gq→truncateDescription, wy→Fuse
```

### Scoring Architecture for Mixed Results

When a query exists, file results and non-file results are scored separately:

```
File results (from indexing):
  - Use Rust-native score (0.0 = perfect match)
  - Fallback to 0.5 if no Rust score (Fuse.js path doesn't provide scores)

MCP + Agent results:
  - Fuse.js with threshold 0.6 (stricter than file search threshold 0.5)
  - Key weights: name(3) > displayText(2) > agentType(3) > description(1) > server(1)

Merge: both pools are combined in one `scored[]` array and sorted by score ascending.
```

**Why different thresholds?**
File search uses `threshold: 0.5` because filenames often have short, abbreviated names. MCP resources use `threshold: 0.6` (stricter) because their identifiers are typically more structured (e.g., `server:resource/path`), so matches should be more precise.

---

## Layer 3: List Container Renderer (`rU1` / `renderSuggestionList`)

**Location:** chunks.151.mjs:1758
**Role:** Renders the visible portion of the suggestion list, implementing a scroll window that keeps the selected item centered.

### Scroll Window Algorithm

```
Terminal rows = 24, viewport = min(6, max(1, 24-3)) = 6

If selectedSuggestion = 8, suggestions.length = 15:
  startIndex = max(0, min(8 - floor(6/2), 15 - 6))
             = max(0, min(8 - 3, 9))
             = max(0, min(5, 9))
             = max(0, 5) = 5
  endIndex = min(5 + 6, 15) = 11
  Visible: items[5..10] (items 5,6,7,8,9,10)
  Selected item (8) is at position 3/6 in viewport → centered

Key property: selection stays within the visible window by keeping
startIndex = selectedSuggestion - floor(viewportSize/2)
(clamped to [0, length - viewportSize])
```

### Manual React Compiler Cache

The 21-slot cache (`e(21)`) is the React 19 compiler's manual memoization array. Each slot represents a dependency. When any dependency changes, the output is recomputed; otherwise the cached value is returned. This avoids allocating new objects on every render without using `useMemo` hooks.

---

## Layer 4: Individual Item Renderer (`vlY` / `suggestionItemComponent`)

**Location:** chunks.151.mjs:1819
**Role:** Renders one suggestion item. Has three rendering branches based on item type: file, MCP resource, or generic.

### Rendering Branches Summary

| `item.id` prefix | Branch | Icon source | Text truncation | Description |
|------------------|--------|-------------|----------------|-------------|
| `file-` | File | `getIconForItemId(id)` | None on primary | max 20 display chars |
| `mcp-resource-` | MCP | `getIconForItemId(id)` | URI truncated to 30 | Full description |
| (other) | Generic | None | 40% of terminal width | Right-aligned column |

### Visual Format

**File item (selected):**
```
▸  src/components/Button.tsx  – React button component
```

**File item (not selected, dimmed):**
```
   src/utils/formatDate.ts    – date formatting
```

**MCP resource item:**
```
   context7:anthropic/cli...  – Claude Code CLI documentation
```

**Generic item:**
```
   TaskCreate                 Start a new todo task
```

---

## Layer 5: The `formatSuggestion` Normalizer (`$Gq`)

**Location:** chunks.182.mjs
**Role:** Final normalization step applied to all suggestions before they reach the UI layer. Ensures every item has a stable `id` field for React's `key` prop and a consistent shape.

The normalizer:
1. Ensures `id` is set (falls back to `displayText` if missing).
2. Preserves all existing fields (file type, MCP type, agent type).
3. Used as `.map($Gq)` at the very end of `fileSuggestionsWrapper`.

---

## Complete UI Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         REPL Component                              │
│                     (chunks.188.mjs: TUA)                           │
│                                                                     │
│  InputBox (igA) ──▶ useAutocompleteInput (WGq, chunks.183.mjs)      │
│                         │                                           │
│                         │ query = "src"                             │
│                         ▼                                           │
│              fileSuggestionsWrapper (NgA, chunks.182.mjs)           │
│              ┌──────────────┬──────────────────────┐               │
│              ▼              ▼                      ▼               │
│         getFileSuggestions  getAgentSuggestions    MCP resources    │
│         (gAq, 152.mjs)      (A0z, 182.mjs)         from state       │
│              │                                                      │
│              ├── cache expired? → refreshIndexCache (OIA)           │
│              ├── cold start?    → await cacheRefreshPromise          │
│              └── searchFileIndex (uiY) → [{id:"file-src/.."}...]    │
│                                                                     │
│              [All 3 sources merged + Fuse.js scored + sorted]       │
│                         │                                           │
│                         ▼                                           │
│              suggestions: SuggestionItem[]                          │
│              selectedSuggestion: 0                                  │
│                         │                                           │
│                         ▼                                           │
│              renderSuggestionList (rU1, chunks.151.mjs)             │
│              ├── viewport = min(6, terminalRows - 3)                │
│              ├── scroll window: startIndex..endIndex                │
│              └── visibleItems.map(suggestionItemComponent(vlY))     │
│                         │                                           │
│                         ▼                                           │
│              ┌──────────────────────────┐                           │
│              │ Terminal Output (Ink)    │                           │
│              │                          │                           │
│              │  📄 src/App.tsx          │                           │
│              │  📄 src/index.ts         │                           │
│              │ ▶ src/components/...     │  ← selected (highlighted) │
│              │  📄 src/utils/...        │                           │
│              │  ...                     │                           │
│              └──────────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Keyboard Navigation Integration

The `useAutocompleteInput` hook (`WGq`) handles keyboard events for the suggestion dropdown:

| Key | Action |
|-----|--------|
| `↑` | `selectedSuggestion = (selected - 1 + total) % total` |
| `↓` | `selectedSuggestion = (selected + 1) % total` |
| `Tab` | `acceptCommandSuggestion`: writes `@{selectedItem.path}` into input |
| `Escape` | Dismisses suggestion panel, clears query |
| `Enter` | Accepts current suggestion and proceeds to submit |

When Tab is pressed (`acceptCommandSuggestion`, `WgA`, chunks.182.mjs:2057):
```javascript
// Inserts the selected suggestion's path into the input at the @ position
inputValue = inputValue.slice(0, atPosition) + selectedItem.path + " ";
// Closes the suggestion panel and refocuses input
```

---

## Performance: React Memoization Strategy

The rendering layer uses aggressive manual memoization to avoid re-renders on every keystroke:

| Component | Memoization | Cache slots |
|-----------|-------------|-------------|
| `rU1` (list) | React compiler 21-slot manual cache | columnWidth, suggestions identity, scroll window, rendered items |
| `vlY` (item) | `React.memo` + 33-slot manual cache | id→icon, description→width, displayText→truncation |

**Why manual cache instead of hooks?**
The terminal renders at 30+ frames/second when typing. Each keystroke triggers a re-render of the entire suggestion list. Using `useMemo` hooks would cause React to allocate new dependency arrays on every render. The compiler-generated manual cache avoids all allocations: it uses a fixed-size array and slot-level equality checks.

**Key insight:** Slots 12-16 in `rU1`'s cache specifically memoize the `renderItem` callback function, preventing it from being recreated when unrelated deps (like `startIndex`) change. This means `React.createElement(vlY, ...)` is not called for unchanged visible items.

---

## Edge Cases and Special Handling

### 1. Empty Query with `forceShow = true`
When the user types `@` with no text and the panel is forced open:
- `gAq` returns `listCurrentDirectory()` results (immediate fs.readdir).
- `NgA` merges all MCP resources and agents with no filtering.
- `renderSuggestionList` shows up to 6 items from the combined pool.

### 2. Query Starting with `./` or `~/`
- `./` prefix is stripped: `gAq` converts `./src` → `src` before calling `searchFileIndex`.
- `~` prefix is expanded via `expandHome(path)`: `~/Documents` becomes an absolute path.
- This ensures the index (which stores relative paths) can match the query.

### 3. Large Terminal vs Small Terminal
- `viewportSize = Math.min(6, Math.max(1, terminalRows - 3))`:
  - 80-row terminal: 6 items visible.
  - 5-row terminal: 2 items visible.
  - This prevents the suggestion panel from overflowing the terminal.

### 4. Score Normalization across Sources
- Rust `FileIndex.search()` returns scores in range `[0, 1]` where 0 = perfect.
- Fuse.js also returns `[0, 1]` where 0 = perfect match.
- When Fuse.js is used for file search (no Rust score), `score = undefined` → defaults to `0.5` in `NgA`.
- MCP/agent Fuse.js results also default to `0.5` if score is undefined.
- All scores are comparable after normalization.

### 5. MCP Resource Threshold Difference
- File search: `threshold: 0.5` (more permissive).
- MCP search in `NgA`: `threshold: 0.6` (stricter).
- Rationale: MCP resource URIs are structured identifiers that users type precisely. File paths have abbreviated names needing fuzzier matching.
