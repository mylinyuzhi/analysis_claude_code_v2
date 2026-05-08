# Claude Code v2.1.88 → v2.1.112 — Source Diff Analysis

This directory analyzes every changelog item from Claude Code **v2.1.88** (sources in `claude-code-kim/src/*.ts`/`*.tsx`) through **v2.1.112** (obfuscated sources in `../source/chunks.*.mjs`).

## Layout

| Path | Content |
|------|---------|
| `00_overview/changelog_analysis.md` | High-level narrative — major arcs, themes, breaking changes |
| `00_overview/symbol_index.md` | Obfuscated → readable mapping for symbols introduced/changed in this window |
| `00_overview/file_index.md` | Which `chunks.NN.mjs` contains which feature |
| `00_overview/compact_v2.1.112.md` | Deep-dive on the full compact subsystem (autocompact + microcompact + context_hint) — verifies that snip/context-collapse remain absent in 2.1.112 |
| `00_overview/snip_collapse_audit_v2.1.112.md` | Reference-by-reference audit of every 2.1.88 snip+collapse touchpoint against 2.1.112 — finds collapse persistence is *more* complete than 2.1.88 source describes (read+write+tail-keep wired for forward-compat) while snip is *more* eliminated (even SDK schema docs scrubbed) |
| `by_version/v2.1.89.md` | Per-version item-by-item diff |
| `by_version/v2.1.90.md` | … |
| `by_version/v2.1.91.md` | … |
| `by_version/v2.1.92.md` | … |
| `by_version/v2.1.94.md` | … |
| `by_version/v2.1.96-97.md` | (Bedrock auth fix + No-Flicker stabilization waves) |
| `by_version/v2.1.98.md` | (Vertex wizard, Monitor tool, Bash hardening) |
| `by_version/v2.1.101.md` | (/team-onboarding, OS CA trust, settings resilience) |
| `by_version/v2.1.105.md` | (PreCompact hook, plugin monitors, stalled streams) |
| `by_version/v2.1.107-109.md` | (Recap, prompt cache 1h, model-invokable built-in skills) |
| `by_version/v2.1.110.md` | (/tui, push notifications, /focus split from Ctrl+O) |
| `by_version/v2.1.111-112.md` | (Opus 4.7, xhigh effort, /ultrareview, /less-permission-prompts) |

## How to Read

Each per-version file follows this template:

```
## <item title from changelog>
**Type:** feature | fix | UX | infra | security
**Modules touched:** ...

**v2.1.88 (kim) state:**
<code or "did not exist">

**v2.1.112 state:**
<obfuscated → readable code with mapping>

**Why this approach:**
<rationale, edge cases, alternatives>
```

For trivial fixes the analysis is one paragraph; for architectural changes it goes deeper.

## Key Themes (v2.1.88 → v2.1.112)

1. **Opus 4.7 + xhigh** (v2.1.111) — new top-tier effort level wedged between `high` and `max`, with interactive slider UI.
2. **No-Flicker / TUI rendering** (v2.1.89 → v2.1.110) — flag-gated `NO_FLICKER` mode that landed in v2.1.89, hardened across many releases, then promoted to a first-class `/tui` command in v2.1.110.
3. **Auto Mode for Max subscribers** (v2.1.111) — `--enable-auto-mode` flag dropped, auto mode generally available with Opus 4.7.
4. **Compact + Cache resilience** (v2.1.89, v2.1.105, v2.1.108) — autocompact thrash circuit-breaker, PreCompact blocking hooks, 1-hour prompt cache TTL.
5. **Bash/PowerShell permission hardening** (v2.1.97, v2.1.98) — backslash-escape bypass fixed, env-var prefix tightening, `/dev/tcp` redirects, archive TOCTOU fixes.
6. **Plugin platform deepening** (v2.1.91, v2.1.94, v2.1.105) — `bin/` executables, `monitors` manifest key, MCP `_meta` annotations.
7. **Resume/Session reliability** (v2.1.89 → v2.1.105) — chain-break recovery, anchor selection, name persistence, deferred-tool resumption.
8. **Cloud features GA-ing** (v2.1.101, v2.1.111) — `/ultraplan` auto-creates cloud env, `/ultrareview` ships, `/team-onboarding` ramps new joiners.

See `00_overview/changelog_analysis.md` for the long-form treatment.
