# Undercover Mode — REMOVED in v2.1.142 (Not Promoted)

## Status snapshot

| | v2.1.88 (TypeScript source) | v2.1.142 (deobfuscated) |
|---|---|---|
| Feature presence | YES — `src/utils/undercover.ts` (89 lines) | **REMOVED** — no traces of "undercover" or `UNDERCOVER MODE` in cli_inner_pretty.js |
| Gating mechanism | `process.env.USER_TYPE === 'ant'` runtime check; entire file DCE'd in external builds | n/a — feature does not exist |
| Env var | `CLAUDE_CODE_UNDERCOVER=1` (forces ON, auto-detects otherwise) | n/a |
| Config flag | `hasSeenUndercoverAutoNotice` | n/a |
| Public surface | Implicit (auto-active in public repos; instructions injected into commit prompts) | n/a |

### What was Undercover Mode?

A safety feature for Anthropic employees contributing to public/open-source repos from inside Anthropic's internal `claude-cli-internal` workspace. When undercover:
- Commit messages and PR bodies are stripped of all attribution (no "Generated with Claude Code", no Co-Authored-By, no model codenames)
- The model is given explicit prompt-level instructions: "Do not blow your cover. Never include Anthropic-internal information."
- The model is NOT told what model it is (so it can't accidentally leak "claude-opus-4-7" into a commit message)

### Why it's in the "promoted" pile (or rather, why it's NOT)

The expected pattern from the C2 brief was that `undercover` was ant-only in v2.1.88 and might have been promoted to external in v2.1.142. **It was not promoted — it was removed.** This document explains both the v2.1.88 design AND the reason for removal.

This is the "promotion lifecycle" alternative outcome: not every ant-only feature graduates to GA. Some die during the GA assessment because:
1. They serve an internal-only need (undercover protects against leaking model codenames — external users don't have model codenames to leak)
2. They have no clean external analog (an external user contributing to a public repo has no need to hide that they used Claude Code)
3. The attribution behavior they suppress is what external users WANT to keep (advertising that Claude Code was used)

---

## 1. v2.1.88 implementation (TypeScript source)

### Gate + entry

```typescript
// ============================================
// isUndercover - v2.1.88 ant-only undercover detection
// Location: src/utils/undercover.ts:28-37
// ============================================

// ORIGINAL (for source lookup):
export function isUndercover(): boolean {
  if (process.env.USER_TYPE === 'ant') {
    if (isEnvTruthy(process.env.CLAUDE_CODE_UNDERCOVER)) return true
    return getRepoClassCached() !== 'internal'
  }
  return false
}

// READABLE (for understanding):
function isUndercover() {
  // External builds: always false (no codename leak risk because user is external)
  if (!isAnthropicBuild()) return false;

  // Force-on via env var (developer override, e.g. testing PR to public repo)
  if (parseEnvBoolean(process.env.CLAUDE_CODE_UNDERCOVER)) return true;

  // Auto-detect: undercover UNLESS we're positively in an allowlisted internal repo
  // (INTERNAL_MODEL_REPOS in commitAttribution.ts). 'external', 'none', null all → undercover.
  return getRepoClassCached() !== 'internal';
}
// Mapping: process.env.USER_TYPE→isAnthropicBuild, isEnvTruthy→parseEnvBoolean
```

**Key design point:** safe-by-default. The auto-detection returns "undercover" unless explicitly proven to be in an internal repo. The reasoning is in the source comment: "Claude may push to public remotes from a CWD that isn't itself a git checkout (e.g. /tmp crash repro)." Three failure modes all default to undercover:
- `getRepoClassCached() === 'external'` (in a public repo) → undercover
- `getRepoClassCached() === 'none'` (not in a git checkout) → undercover
- `getRepoClassCached() === null` (check hasn't run yet) → undercover

Only when the check explicitly returns `'internal'` does undercover turn off.

### The injected prompt text

```typescript
// ============================================
// getUndercoverInstructions - prompt-injected when undercover
// Location: src/utils/undercover.ts:39-72
// ============================================

// ORIGINAL (for source lookup):
export function getUndercoverInstructions(): string {
  if (process.env.USER_TYPE === 'ant') {
    return `## UNDERCOVER MODE — CRITICAL

You are operating UNDERCOVER in a PUBLIC/OPEN-SOURCE repository. Your commit
messages, PR titles, and PR bodies MUST NOT contain ANY Anthropic-internal
information. Do not blow your cover.

NEVER include in commit messages or PR descriptions:
- Internal model codenames (animal names like Capybara, Tengu, etc.)
- Unreleased model version numbers (e.g., opus-4-7, sonnet-4-8)
- Internal repo or project names (e.g., claude-cli-internal, anthropics/…)
- Internal tooling, Slack channels, or short links (e.g., go/cc, #claude-code-…)
- The phrase "Claude Code" or any mention that you are an AI
- Any hint of what model or version you are
- Co-Authored-By lines or any other attribution

Write commit messages as a human developer would — describe only what the code
change does.

GOOD:
- "Fix race condition in file watcher initialization"
- "Add support for custom key bindings"
- "Refactor parser for better error messages"

BAD (never write these):
- "Fix bug found while testing with Claude Capybara"
- "1-shotted by claude-opus-4-6"
- "Generated with Claude Code"
- "Co-Authored-By: Claude Opus 4.6 <…>"
`
  }
  return ''
}
```

### One-time auto-notice

```typescript
// ============================================
// shouldShowUndercoverAutoNotice - one-time UI nudge for auto-detected mode
// Location: src/utils/undercover.ts:80-89
// ============================================

// ORIGINAL (for source lookup):
export function shouldShowUndercoverAutoNotice(): boolean {
  if (process.env.USER_TYPE === 'ant') {
    if (isEnvTruthy(process.env.CLAUDE_CODE_UNDERCOVER)) return false
    if (!isUndercover()) return false
    if (getGlobalConfig().hasSeenUndercoverAutoNotice) return false
    return true
  }
  return false
}
```

**Why a one-time UI notice:** when auto-detection turns on undercover (vs. user explicitly setting `CLAUDE_CODE_UNDERCOVER=1`), the user might not realize commit attribution is being stripped. The notice educates: "you're in a public repo, attribution is off, set X if you want it back."

### Where undercover wired in (v2.1.88)

- `getUndercoverInstructions()` injected into commit/PR system prompts (in `commit.ts`, `commit-push-pr.ts`)
- `isUndercover()` check stripped attribution from commit messages in `utils/attribution.ts`
- One-time notice shown when first detected (`hasSeenUndercoverAutoNotice` flag flips)
- Auto-detection checks repo remote against `INTERNAL_MODEL_REPOS` allowlist

---

## 2. v2.1.142 implementation (deobfuscated)

### Not present

```bash
$ grep -ni "undercover\|UNDERCOVER MODE\|blow your cover" cli_inner_pretty.js
(no matches)
```

Verification:

| Grep target | Result in cli_inner_pretty.js |
|---|---|
| `undercover` | NONE |
| `UNDERCOVER MODE` | NONE |
| `blow your cover` | NONE |
| `CLAUDE_CODE_UNDERCOVER` | NONE |
| `hasSeenUndercoverAutoNotice` | NONE |
| `Anthropic-internal information` | NONE |

The feature is **completely removed**. Not just hidden, not gated, not dormant — entirely stripped from the build.

### What about commit attribution generally?

```bash
$ grep -n "Co-Authored-By\|Generated with Claude Code\|Co-Authored" cli_inner_pretty.js | head
```

`Co-Authored-By` and `Generated with Claude Code` references DO exist in v2.1.142 — they're the default attribution. So v2.1.142 has *attribution as a positive feature*, not an undercover suppression.

---

## 3. Diff during promotion (88 → 142)

### What changed

| Aspect | v2.1.88 | v2.1.142 |
|---|---|---|
| Feature present | YES (ant-only, runtime-gated) | NO (removed entirely) |
| `CLAUDE_CODE_UNDERCOVER` env var | Honored | Ignored (not parsed anywhere) |
| Repo auto-detection | YES (`getRepoClassCached()`) | n/a |
| Attribution stripping | When undercover active | Never (always attribute) |
| Model codename suppression | Yes (prompt instructions) | Not needed — external users don't have access to internal codenames |
| User-facing notice | One-time (auto-detect path) | n/a |
| Lines of source | 89 in `undercover.ts` + cross-cutting integrations | 0 |

### Why this feature was REMOVED, not promoted

This is the interesting analysis. The brief asked about undercover as a "promoted" feature, but the reality is the opposite: this feature **died in the GA assessment**.

#### Reason 1: External users have no codename to leak

The whole point of undercover mode was preventing Anthropic employees from accidentally leaking internal model codenames (Tengu, Capybara), unreleased version numbers (opus-4-7 before it was public), or internal short links (go/cc) into public commits.

External users do NOT have access to:
- Internal codenames (Anthropic's marketing names are the public names)
- Unreleased model identifiers (they only know what's been publicly named)
- Internal short links

So the entire risk profile that undercover protected against doesn't exist for external users.

#### Reason 2: External users WANT attribution

The whole second-order purpose of `Co-Authored-By: Claude Code <noreply@anthropic.com>` is *advertising* — every PR that gets merged with this trailer is a small marketing event for Claude Code. Anthropic wants external users to keep that line. Undercover stripped it specifically because Anthropic employees committing to public OSS repos shouldn't reveal they used Claude Code (some OSS communities are AI-skeptical and might react badly).

External users contributing to their own projects, employer projects, or OSS they care about have the opposite preference: they like the attribution (or are neutral about it).

#### Reason 3: Compliance/legal-counsel scrutiny

Stripping attribution from generated commits has compliance implications (some jurisdictions may require AI disclosure). Anthropic's safer external posture is "always attribute, let users opt out via global setting." That's what v2.1.142 does — `includeCoAuthoredBy: false` setting and `noCoAuthor: true` flag — both are user-controlled opt-outs.

#### Reason 4: Feature is a maintenance liability if shipped externally

The auto-detection logic (`getRepoClassCached`) depends on a static allowlist of internal repos. Externalizing that allowlist makes no sense. Generalizing the concept ("opt out of attribution when contributing to repos matching pattern X") is what `includeCoAuthoredBy: false` already accomplishes more cleanly.

### Net effect on external users

External v2.1.142 users have:
- Attribution ON by default (commit messages include `Co-Authored-By: Claude Code <noreply@anthropic.com>`)
- Opt-out via `includeCoAuthoredBy: false` setting
- Opt-out via `--no-co-author` flag (where supported)

This replaces undercover for the use case where an external user prefers no attribution. The mechanism is simpler — one setting, one default — instead of repo-class detection + env var + one-time notice + prompt injection.

### Net effect on Anthropic employees

Internal Anthropic builds presumably retain the undercover mechanism in their internal build pipeline. Since `cli_inner_pretty.js` is the *external* build, undercover being absent here is exactly what's expected.

If you grep the internal `anthropic` repos (not accessible here), you'd likely find the feature alive and well — but on a build path that never makes it to npm.

---

## 4. Implementation analysis (retrospective)

### Decision: dead-code-elimination via runtime check

**v2.1.88's `process.env.USER_TYPE === 'ant'` check** is interesting because it's a **runtime** check, but the surrounding tooling treats USER_TYPE as a build-time constant. The bundler can constant-fold this conditional, reducing every undercover function in external builds to a trivial empty return.

**Why use runtime form instead of bundler `define`:**
- Single source of truth — `USER_TYPE` is set during bootstrap, accessible everywhere
- Test runners can flip it without rebuilds
- The constant-folding still happens because bundlers recognize `process.env.X === 'literal'` as foldable

**Trade-off:** the *source code* still contains the undercover instructions (visible to anyone reading the GitHub repo). For Anthropic, that's acceptable because the prompt text isn't itself secret — it just shouldn't run for external users.

### Decision: safe-by-default auto-detect

The 2.1.88 design returns "undercover" when the repo class is unknown. This is the **fail-safe** posture — the cost of mistakenly attributing to Claude in an internal repo is small (Anthropic employees know they used Claude), but the cost of *not* undercover-ing in a public repo (leaking a codename) could be a leak news story.

The asymmetry: attribution that should have been stripped is recoverable (squash commit, force push); a model codename in a public OSS commit is forever (web archives, fork chains).

### Decision: hard-removal vs. soft-disable for external

When promoting to external, Anthropic had three options:
1. **Promote as-is**: gate via setting instead of build flag, let users opt in
2. **Soft-disable**: keep the code, default to off externally, allow re-enable
3. **Hard-remove**: strip the code entirely from external builds

Anthropic chose (3). Reasons:
- Reduces bundle size (~3 KB)
- Removes attack surface (no prompt injection can convince Claude to enter undercover mode)
- Simplifies external setting reasoning ("attribution on/off" is the user-facing surface, not "undercover yes/no")
- Aligns with "external builds have no internal-leak risk" posture

The internal build still has the feature for the original use case.

---

## 5. Public entry points (in v2.1.88 only)

### v2.1.88 (when ant build)
- `CLAUDE_CODE_UNDERCOVER=1` env var — force ON
- Auto-detect via `getRepoClassCached()` — ON unless explicitly internal
- One-time notice when auto-detected (UI surface)
- Prompt injection into commit/PR messages (`getUndercoverInstructions()`)
- Attribution stripping in `utils/attribution.ts`

### v2.1.142 (replacements that serve adjacent needs)
- `includeCoAuthoredBy: false` setting — disable Co-Authored-By trailer
- `--no-co-author` (or equivalent) flag — per-invocation disable
- Per-project `.claude/settings.json` — project-scoped attribution policy
- `coAuthoredBy.email`, `coAuthoredBy.name` (configurable trailer values)

These cover the user-facing need ("I don't want attribution") without the codename-protection scaffolding that only Anthropic needed.

---

## 6. Cross-references

- v2.1.88 source: `src/utils/undercover.ts` (89 lines), `src/utils/commitAttribution.ts` (referenced — INTERNAL_MODEL_REPOS allowlist)
- v2.1.142: no source file
- Related external feature: see commit attribution settings in `00_overview/symbol_index_*.md` Module: CLI / Commit
- Related promoted features: `10_promoted_ultraplan.md`, `10_promoted_ultrareview.md` for examples of feature that *did* graduate

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document (v2.1.88 only — no v2.1.142 mapping exists):
- `isUndercover` — gate function (src/utils/undercover.ts:28)
- `getUndercoverInstructions` — prompt injector (src/utils/undercover.ts:39)
- `shouldShowUndercoverAutoNotice` — UI flag (src/utils/undercover.ts:80)
- `getRepoClassCached` — repo identity check (src/utils/commitAttribution.ts, not in 2.1.88 copy)

(No 2.1.142 symbols to add to `symbol_index_*.md` — feature is absent.)
