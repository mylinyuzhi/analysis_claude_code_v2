# 40_ant_promoted — Features Promoted (or Not) from Ant-Only Gating

This directory documents the lifecycle of features that were gated to ant builds (Anthropic-internal) in earlier versions and reached external availability — or did not — by v2.1.142.

## Files

| File | Topic | Status v2.1.88 → v2.1.142 |
|---|---|---|
| `10_promoted_ultraplan.md` | `/ultraplan` slash command | Build-time DCE → GrowthBook runtime gate |
| `10_promoted_ultrareview.md` | `/ultrareview` + `claude ultrareview` | GB runtime → same GB + new CLI subcommand + enterprise policy |
| `10_promoted_fast_mode.md` | `/fast` slash command + fast mode | Single JSX → dual (local-jsx + local non-interactive) |
| `10_promoted_agents_dashboard.md` | `claude agents` dashboard | Ant-only `agents-platform` → GA `claude agents` (Research Preview) |
| `10_promoted_goal.md` | `/goal` slash command | Net-new in v2.1.139 (not promoted from ant — included for completeness) |
| `10_promoted_undercover_mode.md` | Undercover mode | Ant-only → **REMOVED** in external builds |
| `10_promoted_bridge_sessions.md` | `/bridge` → `/remote-control`, `/bridge-kick` | Ant-only `/bridge-kick` → hard-disabled; `/bridge` → `/remote-control` |

## Summary of patterns

1. **Direct promotion**: ant-only build-time gate → runtime GrowthBook gate. Examples: `/ultraplan`, fast mode.
2. **Rebrand and generalize**: internal codename → user-friendly name + opt-out setting. Examples: bridge → Remote Control, agents-platform → agents dashboard.
3. **Net-new with promotion-ready architecture**: built using the same dual-export pattern (local-jsx + local) that the promoted features adopted. Example: `/goal`.
4. **Quiet removal**: ant-only feature that doesn't generalize → removed from external builds, kept internally. Example: undercover mode.
5. **Preserve-but-disable**: ant-only debug feature that's risky externally → handler kept in binary but `isEnabled: () => false`. Example: `/bridge-kick`.

## Cross-references

- `00_inventory.md` — comprehensive list of promotion targets and their lifecycle states
- `01_status_table.md` — quick-glance status table for all features in this directory
- `../by_version/` — chronological history of each release
- `../00_overview/symbol_index_*.md` — symbol mappings
