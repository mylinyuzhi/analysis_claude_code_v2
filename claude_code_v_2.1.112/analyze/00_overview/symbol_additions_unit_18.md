# Symbol Additions - Unit 18 (Changelog to Code Map, v2.1.112)

This file lists symbols cited in `changelog_to_code_map.md`. Because the map is an index document (per-bullet code-traceability table) rather than a deep deobfuscation pack, it does not introduce new mappings - it references existing symbols already documented in the canonical `symbol_index_*.md` files and the per-feature unit symbol files (`symbol_additions_unit_01.md` through `symbol_additions_unit_17.md`).

This file therefore lists which existing symbols the map references, so a reader can verify completeness against the canonical indices.

---

## Cross-reference: Symbols cited in `changelog_to_code_map.md`

All symbols below already exist in the canonical `symbol_index_*.md` files. The "Map cite" column points to the version section that mentions each symbol.

### Module: Hooks (Permission Decisions)

| Obfuscated | Readable | Canonical source | Map cite |
|------------|----------|------------------|----------|
| (no fn) | `applyHookPermissionDecision` (chunks.193.mjs:34-130) | `symbol_index.md` "Hooks (Permission Decisions)" | v2.1.89, v2.1.105, v2.1.110, v2.1.111 |

### Module: Effort / Model

| Obfuscated | Readable | Canonical source | Map cite |
|------------|----------|------------------|----------|
| `UI` | `EFFORT_LEVELS` (chunks.80.mjs:2835) | `symbol_index_core_features.md` Effort | v2.1.111 |
| `bt6` | `modelSupportsXhigh` (chunks.80.mjs:2708-2712) | `symbol_index_core_features.md` Effort | v2.1.111 |
| `wy6` | `resolveEffortForModel` (chunks.80.mjs:2746-2755) | `symbol_index_core_features.md` Effort | v2.1.111 |
| `IF1` | `getDefaultEffortForModel` (chunks.80.mjs:2811-2819) | `symbol_index_core_features.md` Effort | v2.1.94, v2.1.111 |
| `KhY` | `modelPicker keybindings` (chunks.168.mjs:740-750) | `symbol_index_core_features.md` Effort | v2.1.111 |
| `pdK` | `welcomeBanner` (chunks.181.mjs:1672, 1685, 1687) | `symbol_index_core_features.md` Effort | v2.1.111 |
| `ch` | `isMaxPlan` (chunks.61.mjs) | `symbol_index_core_features.md` Plan tier | v2.1.111 |

### Module: TUI

| Obfuscated | Readable | Canonical source | Map cite |
|------------|----------|------------------|----------|
| `lq` | `isFullscreenMode` (chunks.65.mjs:1491-1505) | `symbol_index_core_features.md` TUI | v2.1.89, v2.1.110 |
| `bcY`, `IcY`, `n$7` | `/tui` command, validTuiModes (chunks.185.mjs:397-454) | `symbol_index_core_features.md` TUI | v2.1.110 |

### Module: Focus / Recap / Slash Commands

| Obfuscated | Readable | Canonical source | Map cite |
|------------|----------|------------------|----------|
| `FoY` | `/focus` (chunks.189.mjs:1450-1475) | `symbol_index_core_features.md` Focus | v2.1.110 |
| `LaY` | `/recap` (chunks.189.mjs:2782-2792) | `symbol_index_core_features.md` Recap | v2.1.108 |
| `jsY` | `/team-onboarding` (chunks.190.mjs:195-210) | `symbol_index_core_features.md` Slash | v2.1.101 |
| `ulK`, `wW6` | `/ultrareview` (chunks.183.mjs:2170) | `symbol_index_core_features.md` Slash | v2.1.111 |
| `KQK`, `qQK`, `Xg` | `/powerup` (chunks.180.mjs:961, 1396-1403) | `symbol_index_core_features.md` Slash | v2.1.90 |
| `pFY` | `/release-notes` (chunks.180.mjs) | `symbol_index_core_features.md` Slash | v2.1.92 |
| `p25`, `WjA` | `/less-permission-prompts` skill (chunks.211.mjs:1403) | `symbol_index_core_features.md` Skills | v2.1.111 |

### Module: Tools (Deferred)

| Obfuscated | Readable | Canonical source | Map cite |
|------------|----------|------------------|----------|
| `ic` | `pushNotificationToolName` "PushNotification" (chunks.101.mjs:1261-1271) | `symbol_index_core_execution.md` Tools | v2.1.110 |
| `cI4`, `lI4` | `Monitor` tool (chunks.101.mjs:1288-1339) | `symbol_index_core_execution.md` Tools | v2.1.98 |
| `bjY` | `EnterWorktree` tool (chunks.151.mjs) | `symbol_index_core_execution.md` Tools | v2.1.105 |

### Module: Compact

| Obfuscated | Readable | Canonical source | Map cite |
|------------|----------|------------------|----------|
| `QkK` | `autoCompactDispatcher` (chunks.159.mjs:1379-1428) | `symbol_index_core_features.md` Compact | v2.1.89, v2.1.105 |
| `wLK` | `MAX_CONSECUTIVE_COMPACT_FAILURES = 3` (chunks.159.mjs) | `symbol_index_core_features.md` Compact | v2.1.89 |
| `jLK` | `MAX_RAPID_COMPACT_REFILLS = 3` (chunks.159.mjs) | `symbol_index_core_features.md` Compact | v2.1.89 |
| `a_7` | `RAPID_REFILL_TURN_WINDOW = 3` (chunks.159.mjs) | `symbol_index_core_features.md` Compact | v2.1.89 |
| `GI6` | `PRECOMPACT_BLOCKED_ERROR_PREFIX` (chunks.159.mjs) | `symbol_index_core_features.md` Compact | v2.1.105 |

### Module: Plugin Schema

| Obfuscated | Readable | Canonical source | Map cite |
|------------|----------|------------------|----------|
| `wi5` | `PluginMonitorSchema` (chunks.18.mjs:2251) | `symbol_index_infra_integration.md` Plugin | v2.1.105 |
| `XO1` | `PluginMonitorArraySchema` (chunks.18.mjs) | `symbol_index_infra_integration.md` Plugin | v2.1.105 |
| `ht6` | `outputStyleFrontmatterParser` (chunks.156.mjs:420, chunks.165.mjs:485-494) | `symbol_index_infra_integration.md` Plugin | v2.1.94 |

### Module: MCP

| Obfuscated | Readable | Canonical source | Map cite |
|------------|----------|------------------|----------|
| `Zz7`, `M98` | `mcpToolMetaWrapper` (chunks.162.mjs:578-617) | `symbol_index_infra_platform.md` MCP | v2.1.91, v2.1.98 |
| `Vg1` | `MAX_MCP_PERSIST_BYTES = 500_000` (chunks.83.mjs) | `symbol_index_infra_platform.md` MCP | v2.1.91 |
| `FhK`, `iGY`, `lGY` | `SlackMcpRenderer` (chunks.161.mjs:777-797) | `symbol_index_infra_platform.md` MCP | v2.1.94 |

### Module: Prompt Cache

| Obfuscated | Readable | Canonical source | Map cite |
|------------|----------|------------------|----------|
| `o85` | `is1HourCacheEligible` (chunks.194.mjs:1034-1043) | `symbol_index_infra_platform.md` PromptCache | v2.1.108 |

### Module: File I/O / Perforce

| Obfuscated | Readable | Canonical source | Map cite |
|------------|----------|------------------|----------|
| `mY1` | `isPerforceMode` (chunks.16.mjs:3070-3076) | `symbol_index_core_execution.md` Tools/Edit | v2.1.98 |
| `gf6` | `isPerforceProtected` (chunks.16.mjs:3320) | `symbol_index_core_execution.md` Tools/Edit | v2.1.98 |
| `Ff6` | `perforceErrorString` (chunks.16.mjs) | `symbol_index_core_execution.md` Tools/Edit | v2.1.98 |
| `S16` | `writeFileWithEol` (chunks.16.mjs) | `symbol_index_core_execution.md` Tools/Edit | v2.1.89 |

### Module: Provider / Env

| Obfuscated | Readable | Canonical source | Map cite |
|------------|----------|------------------|----------|
| `aNz`, `BR6` | `CLAUDE_CODE_USE_MANTLE` env handler (chunks.116.mjs:297-298) | `symbol_index_infra_platform.md` Provider | v2.1.94 |

### Module: Settings / CA

| Obfuscated | Readable | Canonical source | Map cite |
|------------|----------|------------------|----------|
| `Mr5` | `resolveCaStores` (chunks.19.mjs:2150-2167) | `symbol_index_infra_platform.md` Settings | v2.1.101 |
| `NU7` | `DEFAULT_CA_STORES` (chunks.19.mjs) | `symbol_index_infra_platform.md` Settings | v2.1.101 |

---

## Note on additions

Unit 18 does not contribute new symbols to any canonical `symbol_index_*.md` file. Its purpose is to provide a per-bullet traceability map from CHANGELOG.md to the obfuscated source, citing existing mappings. If a reader follows a citation in `changelog_to_code_map.md` and discovers a symbol that is not yet in any canonical index, the symbol should be added to the appropriate `symbol_index_*.md` file (per the project conventions in `/lyz/codespace/analysis_claude_code_v2/CLAUDE.md`), not to this file.
