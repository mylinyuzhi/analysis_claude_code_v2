# 00 Inventory — Ant-Promoted Features Inventory

(Minimal stub written by C2 because C1 did not seed this file. C1 should populate the full inventory; the deep-dive `10_promoted_*.md` files contain detailed information about each feature.)

## Promotion lifecycle states

| Lifecycle state | Description | Example |
|---|---|---|
| `ant_only_88` | Ant-only in v2.1.88 build | `/ultraplan` build-time DCE'd in external |
| `promoted_runtime_gate` | Lifted to external with runtime gate | `/ultraplan`, `/ultrareview` GB config |
| `promoted_rebrand` | Renamed to user-friendly name | bridge → Remote Control, agents-platform → agents |
| `promoted_dual_export` | Got dual interactive + non-interactive variants | `/fast`, `/goal` |
| `removed_external` | Stripped from external builds | undercover mode |
| `preserved_disabled` | Code kept but `isEnabled: false` | `/bridge-kick` |
| `net_new_in_window` | New feature in v2.1.139-142 window | `/goal`, claude agents dashboard |

## Inventory

| Feature | State | Detail file |
|---|---|---|
| `/ultraplan` | `promoted_runtime_gate` | `10_promoted_ultraplan.md` |
| `/ultrareview` | `promoted_runtime_gate` (CLI added v2.1.120) | `10_promoted_ultrareview.md` |
| `claude ultrareview` (CLI) | `net_new_in_window` (v2.1.120) | `10_promoted_ultrareview.md` |
| `/fast` slash command | `promoted_dual_export` | `10_promoted_fast_mode.md` |
| `claude agents` | `promoted_rebrand` (was `agents-platform`) | `10_promoted_agents_dashboard.md` |
| `/goal` | `net_new_in_window` (v2.1.139) | `10_promoted_goal.md` |
| Undercover mode | `removed_external` | `10_promoted_undercover_mode.md` |
| `/bridge-kick` | `preserved_disabled` | `10_promoted_bridge_sessions.md` |
| `/bridge` → `/remote-control` | `promoted_rebrand` | `10_promoted_bridge_sessions.md` |

## Verification

Each detail file documents:
- v2.1.88 implementation (TypeScript source) with code snippets
- v2.1.142 implementation (deobfuscated) with code snippets
- The diff during promotion and design rationale
- Public entry points
- Cross-references

Total: 7 deep-dive files, each in the 300-500 line range.
