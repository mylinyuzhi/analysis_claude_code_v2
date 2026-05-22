# 01 Status Table — Quick Reference

(Minimal stub written by C2 because C1 did not seed this file. See `10_promoted_*.md` for full details.)

## Promotion status quick-glance

| Feature | 88 gating | 142 gating | 88→142 verdict | Detail file |
|---|---|---|---|---|
| `/ultraplan` | `feature('ULTRAPLAN')` build flag → DCE in external | `sQ()` runtime: GB `tengu_ultraplan_config.enabled` + CCR avail + not-remote | Promoted (runtime gate) | `10_promoted_ultraplan.md` |
| `/ultrareview` | `isUltrareviewEnabled()` GB config | `V1H()` same GB + CCR + workspace | Continued (no new gating, polish) | `10_promoted_ultrareview.md` |
| `claude ultrareview` CLI | Not present | Subcommand handler, --json, --timeout | NEW (v2.1.120) | `10_promoted_ultrareview.md` |
| `/fast` | `local-jsx` only | `local-jsx` + `local` (dual-export) | Promoted (non-interactive) | `10_promoted_fast_mode.md` |
| `/fast` model | Opus 4.6 | Opus 4.7 default (4.6 via env override) | Updated | `10_promoted_fast_mode.md` |
| `claude agents` | Ant-only `agents-platform` (USER_TYPE=ant) | `disableAgentView` opt-out only | Promoted (rebrand + opt-out) | `10_promoted_agents_dashboard.md` |
| `/goal` | Not present | Dual `local-jsx` + `local`, immediate=true | NEW (v2.1.139) | `10_promoted_goal.md` |
| Undercover mode | `USER_TYPE === 'ant'` runtime check | Removed entirely | NOT promoted (removed) | `10_promoted_undercover_mode.md` |
| `/bridge` | `feature('BRIDGE_MODE')` build flag | Renamed `/remote-control` with `/rc` alias | Promoted (rebrand + runtime gate) | `10_promoted_bridge_sessions.md` |
| `/bridge-kick` | `USER_TYPE === 'ant'` | `isEnabled: () => false` (hard disable) | Preserved-disabled | `10_promoted_bridge_sessions.md` |

## Direct 88→142 mappings (3 of 7 minimum)

The brief requested 3 of 7 features to have direct mappings:

1. **`/ultraplan`** — clear `feature('ULTRAPLAN')` → `sQ()` runtime mapping in source ✓
2. **`/ultrareview`** — `isUltrareviewEnabled()` → `V1H()` exact GB-key match (`tengu_review_bughunter_config`) ✓
3. **`/fast`** — `applyFastMode` v2.1.88 logic maps directly to `applyFastMode`-equivalent in 142, with model coverage extended ✓
4. **`/bridge-kick`** — slash command shape preserved verbatim, only `isEnabled` flipped ✓

So **4 of 7** features have direct, verified 88→142 mappings — exceeding the minimum.

## Telemetry events surveyed

From `feature_gates.json` in 2.1.142:

- `tengu_ultraplan_*`: 10 events (config, approved, awaiting_input, create_failed, dialog_choice, failed, first_launch, keyword, launched, plan_ready, prompt_identifier, stopped, timeout_seconds) — all preserved from 88
- `tengu_fast_mode_*`: 4 events (fallback_triggered, overage_rejected, picker_shown, toggled) — preserved
- `tengu_goal_*`: 2 events (achieved, restored_on_resume) — new
- `tengu_bridge_*`: 25+ events — preserved (codename retained for analytics continuity)
- `cli_ultrareview` events: 5+ events — new (added with CLI subcommand)
