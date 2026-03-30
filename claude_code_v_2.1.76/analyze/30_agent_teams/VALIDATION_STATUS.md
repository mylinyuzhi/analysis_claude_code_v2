# Validation Status - 30_agent_teams

> **Date**: 2026-03-29
> **Method**: Branch-by-branch source code comparison for every ORIGINAL/READABLE snippet

## File Reliability Rating

### TRUSTED (source code verified, all snippets accurate)
| File | Size | Snippets Verified | Issues |
|------|------|-------------------|--------|
| `agent_teams_complete_analysis.md` | 98KB | 45+ | All fixed after cross-validation |
| `README.md` | 9KB | N/A | Index only |

### MOSTLY RELIABLE (logic correct, minor issues)
| File | Size | Issues |
|------|------|--------|
| `01_complete_chain_analysis.md` | 77KB | 1 HIGH (Rb fabricated), 3 VERIFIED, 1 LOW (writeToMailbox logging stripped) |
| `02_spawn_mechanisms_deep_dive.md` | 66KB | 1 HIGH (same Rb fabrication), 3 VERIFIED, 1 LOW |
| `03_mailbox_and_locking.md` | 38KB | 1 MEDIUM (writeToMailbox ORIGINAL adds comments, strips catch block), 1 LOW, 1 VERIFIED |
| `06_system_prompts_and_reminders.md` | 32KB | 2 VERIFIED (Ui8 exact match), 2 LOW (acknowledged pseudocode) |

### UNRELIABLE (many wrong symbols/locations)
| File | Size | HIGH Issues |
|------|------|-------------|
| **`07_plan_mode_team_integration.md`** | **53KB** | **7 HIGH**: dVY/AhY/qhY/$fY/OfY don't exist; ExitPlanMode all obfuscated names wrong (Dz→$Y, MC1→NF6, g5→i3, f9→x3 etc.); fabricated "delegate" mode check |
| **`pane_backend_executor.md`** | **59KB** | **11 HIGH**: _EA/lb4/Au4/Ku4/lP1/ss/MTA/DVY all wrong functions; getAppState shown as async (sync); multiple wrong mappings |
| **`04_polling_priorities.md`** | **25KB** | **2 HIGH**: fabricated return type discriminators (user_message/team_message/peer_message/task_assignment — actual code uses only "new_message"); wrong shutdown return fields |
| **`error_recovery.md`** | **46KB** | 1 HIGH (handleShutdownRejection wrong param structure), 1 MEDIUM |
| `12_complete_lifecycle_consolidated.md` | 46KB | Not verified - likely same patterns |
| `13_tui_interactions_complete.md` | 36KB | Not verified |
| `08_task_dependency_resolution.md` | 29KB | Not verified |
| `09_telemetry_monitoring.md` | 29KB | Not verified |
| `10_session_memory_persistence.md` | 29KB | Not verified |
| `11_storage_cleanup_management.md` | 30KB | Not verified |
| `14_official_docs_implementation_comparison.md` | 31KB | Not verified |
| `agent_teams_architecture.md` | 19KB | Not verified |
| `delegate_mode.md` | 25KB | Not verified |
| `hooks_integration.md` | 35KB | Not verified |
| `inter_agent_communication.md` | 13KB | Not verified |
| `resource_limits.md` | 15KB | Not verified |
| `swarm_architecture.md` | 4KB | Not verified |
| `swarms_implementation.md` | 9KB | Not verified |
| `team_config_schema.md` | 19KB | Not verified |
| `05_tui_integration.md` | 15KB | Not verified |

## Root Cause

Same pattern as plan_mode: ORIGINAL code sections contain **invented obfuscated names** that don't exist in source. The worst offenders are:
- `pane_backend_executor.md`: 11 fabricated function names (_EA, lb4, Au4, Ku4, lP1, ss, MTA, DVY, c31, sq6, Rj6)
- `07_plan_mode_team_integration.md`: Nearly every symbol wrong (Dz, MC1, g5, f9, K2, Q1, pv, uW, pD, Hd4, $d4, dVY, AhY, qhY, $fY, OfY, Vx4, Nx4, iP1)
- `04_polling_priorities.md`: Fabricated return type discriminators that don't exist

## Recommendation

For source-level analysis, use ONLY `agent_teams_complete_analysis.md`. The UNRELIABLE files can be used for conceptual flow understanding but NOT for symbol lookups or code tracing. Files 01-03 and 06 are mostly reliable with known caveats.
