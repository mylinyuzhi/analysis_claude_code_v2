# Symbol Cross-Validation Report (v2.1.76)

> Generated: 2026-03-15
> Purpose: Cross-validate symbol mappings from v2.1.38 against v2.1.76 source

---

## Summary

| Category | Verified Correct | Location Changed | Symbol Incorrect | Not Verified |
|----------|------------------|------------------|------------------|--------------|
| Tool Name Constants | 5 | 0 | 8 | 0 |
| Hook Dispatchers | 5 | 0 | 0 | 0 |
| Circuit Breaker | 2 | 0 | 0 | 0 |
| MCP Symbols | 0 | 2 | 1 | 0 |
| State Management | 2 | 2 | 2 | 0 |
| Agent Loop | 0 | 0 | 2 | 0 |
| Tool Discovery | 0 | 0 | 1 | 0 |

**Total Sampled**: ~25 symbols
**Estimated Accuracy**: ~40% of v2.1.38 mappings are still correct

---

## ✓ VERIFIED CORRECT

These symbols were confirmed to be correct in v2.1.76:

| Obfuscated | Readable | Location | Notes |
|------------|----------|----------|-------|
| sP1 | TOOL_NAME_ENTER_WORKTREE | chunks.91.mjs:180 | ✓ Exact match |
| tP1 | TOOL_NAME_EXIT_WORKTREE | chunks.91.mjs:182 | ✓ Exact match |
| ER | TOOL_NAME_CRON_CREATE | chunks.91.mjs:192 | ✓ Exact match |
| ed | TOOL_NAME_CRON_DELETE | chunks.91.mjs:194 | ✓ Exact match |
| SW6 | TOOL_NAME_CRON_LIST | chunks.91.mjs:196 | ✓ Exact match |
| aqq | MAX_CONSECUTIVE_COMPACT_FAILURES | chunks.147.mjs:2686 | ✓ Line shifted from 2666 |
| sqq | autoCompactWithCircuitBreaker | chunks.147.mjs:2633 | ✓ Exact match |
| FE1 | executePostCompactHooks | chunks.175.mjs:2713 | ✓ Exact match |
| A$8 | executeElicitationHooks | chunks.175.mjs:2876 | ✓ Exact match |
| q$8 | executeElicitationResultHooks | chunks.175.mjs:2915 | ✓ Exact match |
| nN1 | executeWorktreeCreateHook | chunks.176.mjs:105 | ✓ Exact match |
| rN1 | executeWorktreeRemoveHook | chunks.176.mjs:125 | ✓ Exact match |
| M1 | useAppState | chunks.148.mjs:2598 | ✓ NEW - correct symbol |
| xA | useSetAppState | chunks.148.mjs:2613 | ✓ NEW - correct symbol |

---

## ⚠️ LOCATION CHANGED

These symbols exist but have moved to different files/lines:

| Obfuscated | Readable | Old Location | New Location |
|------------|----------|--------------|--------------|
| rH6 | McpClient | chunks.79.mjs:214313 | chunks.25.mjs:1086 |
| nXq | McpHub | chunks.175.mjs:1897 | chunks.165.mjs:864 |
| Gf6 | createStore | chunks.151.mjs:398 | chunks.133.mjs:100 |
| gG1 | initialAppState | chunks.151.mjs:419 | chunks.117.mjs:2087 |

---

## ❌ SYMBOL CHANGED / INCORRECT MAPPING

These obfuscated names now refer to different symbols in v2.1.76:

### Tool Name Constants (CRITICAL)

| Old Obfuscated | New Obfuscated | Readable | New Location |
|----------------|----------------|----------|--------------|
| Jq | s7 | TOOL_NAME_READ | chunks.56.mjs:173 |
| h4 | Q7 | TOOL_NAME_BASH | chunks.54.mjs:2264 |
| bq | R4 | TOOL_NAME_EDIT | chunks.56.mjs:102 |
| f5 | _K | TOOL_NAME_WRITE | chunks.56.mjs:1234 |
| NJ | oH | TOOL_NAME_SKILL | chunks.90.mjs:2596 |
| fK | I46 | TOOL_NAME_TASK | chunks.40.mjs:408 |
| JL | jv | TOOL_NAME_WEB_SEARCH | chunks.56.mjs:1287 |
| xO | sO | TOOL_NAME_WEB_FETCH | chunks.56.mjs:80 |

### Agent Loop / Tool Execution

| Obfuscated | Claimed Readable | Actual Symbol | Actual Location |
|------------|------------------|---------------|-----------------|
| ZR | mainAgentLoop | init function (NOT mainAgentLoop) | chunks.89.mjs:2252 |
| uU1 | StreamingToolExecutor | KeywordCxt (validation class) | chunks.10.mjs:300 |
| bU1 | toolDispatcher | validation module | chunks.10.mjs:10 |
| kt | getDynamicToolSet | file extension function | chunks.85.mjs:2497 |
| tD | getDefaultTools | crypto cipher module | chunks.45.mjs:874 |

### State Management

| Obfuscated | Claimed Readable | Actual Symbol | Correct Symbol |
|------------|------------------|---------------|----------------|
| v6 | useAppState | different symbol | Use M1 instead |
| L7 | useSetAppState | React.createElement | Use xA instead |

### MCP

| Obfuscated | Claimed Readable | Actual Symbol | Actual Location |
|------------|------------------|---------------|-----------------|
| ZQA | MCPContext | serializer middleware option | chunks.28.mjs:1716 |

---

## Key Findings

### 1. Tool Name Constants Changed Significantly

The obfuscated names for core tool constants changed in v2.1.76:

```
v2.1.38          v2.1.76
----------------- -----------------
Jq (Read)    →   s7
h4 (Bash)    →   Q7
bq (Edit)    →   R4
f5 (Write)   →   _K
NJ (Skill)   →   oH
fK (Task)    →   I46
JL (WebSearch) → jv
xO (WebFetch) →  sO
```

**Recommendation**: Update all documentation to use new obfuscated names.

### 2. New v2.1.76 Symbols Are Correctly Mapped

Symbols added specifically for v2.1.76 features are correctly mapped:
- Worktree tools (sP1, tP1)
- Cron tools (ER, ed, SW6)
- Circuit breaker (aqq, sqq)
- Hook dispatchers (FE1, A$8, q$8, nN1, rN1)

### 3. Many "Core" Symbols Are Incorrect

Several fundamental symbols from v2.1.38 mapping are wrong:
- `ZR` is NOT `mainAgentLoop`
- `uU1` is NOT `StreamingToolExecutor`
- `bU1` is NOT `toolDispatcher`
- `kt` is NOT `getDynamicToolSet`
- `tD` is NOT `getDefaultTools`

**Recommendation**: These need re-verification to find the actual obfuscated names.

### 4. State Management Refactored

The state management hooks changed:
- `useAppState` is now `M1` (not `v6`)
- `useSetAppState` is now `xA` (not `L7`)

---

## Verification Methodology

1. **Grep for obfuscated name**: `grep -rn "\bsP1\b" source/`
2. **Grep for readable context**: `grep -rn '"EnterWorktree"' source/`
3. **Cross-reference**: Verify obfuscated name at location matches expected symbol
4. **Update documentation**: Mark with status (✓, ⚠️, ❌)

---

## Next Steps

1. **Priority 1**: Update tool name constant mappings across all documentation
2. **Priority 2**: Find correct obfuscated names for agent loop functions
3. **Priority 3**: Verify remaining ~475 symbols systematically
4. **Priority 4**: Update symbol_index files with Status column for all entries