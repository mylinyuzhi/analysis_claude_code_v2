# `/less-permission-prompts` Skill (v2.1.111)

## What it does

`/less-permission-prompts` is a bundled, user-invocable skill that scans the user's recent JSONL session transcripts (`~/.claude/projects/<sanitized-cwd>/*.jsonl`), extracts the read-only Bash commands and MCP tool calls the user has been running, filters out everything that mutates state or grants arbitrary code execution, drops commands that Claude Code already auto-allows (so the user doesn't add no-op rules), ranks the survivors by frequency, presents a prioritized list to the user, and merges the user-approved patterns into project `.claude/settings.json` under `permissions.allow`.

The goal is to reduce permission prompts for safe, frequently-used commands without weakening the security model. The skill is intentionally **conservative**: when in doubt, drop. The skill body is over 6 KB of prose instructing the model exactly what to keep, what to drop, what pattern form to use, and how to merge into the existing settings file.

The skill is `userInvocable: true` and has no `disable-model-invocation`, meaning both the user (`/less-permission-prompts`) and Claude (via the Skill tool) can invoke it.

---

## How it works

### 1. The builder (chunks.211.mjs:1401-1419)

```javascript
// ============================================
// lessPermissionPromptsBuilder - Registers the bundled skill with the command registry
// Location: chunks.211.mjs:1401-1419
// ============================================

// ORIGINAL (for source lookup):
function p25() {
    MA({
        name: "less-permission-prompts",
        description: "Scan your transcripts for common read-only Bash and MCP tool calls, then add a prioritized allowlist to project .claude/settings.json to reduce permission prompts.",
        userInvocable: !0,
        async getPromptForCommand(q) {
            let K = WjA;
            if (q) K += `

## Additional instructions from the user

${q}`;
            return [{ type: "text", text: K }]
        }
    })
}

// READABLE (for understanding):
function registerLessPermissionPromptsSkill() {
  registerBundledSkill({
    name: "less-permission-prompts",
    description:
      "Scan your transcripts for common read-only Bash and MCP tool calls, " +
      "then add a prioritized allowlist to project .claude/settings.json " +
      "to reduce permission prompts.",
    userInvocable: true,
    async getPromptForCommand(userArgs) {
      let body = LESS_PERMISSION_PROMPTS_BODY;
      if (userArgs) {
        body += `\n\n## Additional instructions from the user\n\n${userArgs}`;
      }
      return [{ type: "text", text: body }];
    },
  });
}

// Mapping: p25 -> registerLessPermissionPromptsSkill, MA -> registerBundledSkill,
//          WjA -> LESS_PERMISSION_PROMPTS_BODY, q -> userArgs, K -> body
```

**Why append user args under a heading instead of inline?** Because the body is a 9-step instruction list. Inline interpolation would risk breaking the numbered structure. A trailing header section keeps the user's added instructions visible to the model without polluting the canonical recipe.

### 2. The skill body (chunks.211.mjs:1421)

The body is a ~6 KB string literal that gives the model a 9-step procedure plus an auto-allow exclusion list. The full structure:

```
# Less Permission Prompts

[Intro: explain the goal and the permission rule format]

## Steps

1. Locate transcripts        -- glob ~/.claude/projects/.../*.jsonl, cap at 50 recent
2. Extract tool-call frequencies
   - For Bash: parse input.command, take leading token
   - For MCP: record full tool name (mcp__server__tool)
   - Count occurrences
3. Filter to read-only
   - Keep: ls, cat, git status/log/diff, gh pr view, etc.
   - Drop anything that writes/deletes/mutates
   - Drop interpreters, shells, package runners (arbitrary code execution)
   - Drop wildcards on task runners (npm run *, make *, etc.)
4. Drop commands Claude Code already auto-allows
   - Always auto-allowed (any args): cal, uptime, cat, head, tail, wc, ...
   - Auto-allowed with zero args only: pwd, whoami, alias
   - Auto-allowed exact forms: claude -h, node -v, ...
   - Auto-allowed with safe flags: xargs, file, sed (read-only), sort, ...
   - All git read-only subcommands
   - All gh read-only subcommands
   - Docker read-only subcommands
5. Pick the pattern form
   - Bash(foo *) for variants
   - Bash(foo) for single exact form
   - MCP: full tool name verbatim
6. Prioritize: rank by count desc, drop count<3, cap at top 20
7. Present to user as a markdown table (rank, pattern, count, notes)
8. Merge into .claude/settings.json
   - Create file if needed
   - Preserve existing keys/entries
   - De-duplicate
9. Report back: what added, what was already there, what skipped + why

Do not touch permissions.deny or permissions.ask
```

The model gets all of this verbatim every time the skill is invoked. The skill is not interactive in the sense of partial execution - the model is expected to follow all 9 steps in one go.

### 3. Why the auto-allow exclusion list is in the prompt

Step 4 is the largest section by character count. It lists every command Claude Code's BashTool already auto-allows, sourced from:

- `src/tools/BashTool/readOnlyValidation.ts` -- `READONLY_COMMANDS`, `READONLY_NOARGS`, `READONLY_EXACT`, `COMMAND_ALLOWLIST`
- `src/utils/shell/readOnlyCommandValidation.ts` -- `GIT_READ_ONLY_COMMANDS`, `GH_READ_ONLY_COMMANDS`, `DOCKER_READ_ONLY_COMMANDS`, `RIPGREP_READ_ONLY_COMMANDS`, `PYRIGHT_READ_ONLY_COMMANDS`

These commands never prompt regardless of the user's allowlist. If the skill suggested `Bash(ls *)` and the user added it, the rule would be a no-op (ls is in `COMMAND_ALLOWLIST`). The user would gain false confidence ("I added 20 rules!") while gaining nothing.

The skill body inlines the list rather than referring to those source files because:

1. The model can't read the user's local source tree (at runtime the model sees only this prompt).
2. If the source files change, the inline list will drift - but the skill body is part of the binary, so on each release the list is re-synced.
3. The closing note "Source of truth: ... If the user is in this repo and you're unsure whether a command is covered, grep these files rather than guessing" gives the model an escape hatch for the case where the user actually has the source available and the list might be stale.

### 4. Why "never allowlist a pattern that grants arbitrary code execution"

The skill explicitly bans wildcards on:

- Interpreters: `python`, `node`, `bun`, `deno`, `ruby`, `perl`, ...
- Shells: `bash`, `sh`, `zsh`, `fish`, `eval`, `exec`, `ssh`
- Package runners: `npx`, `bunx`, `uvx`, `uv run`
- Task-runner wildcards: `npm run *`, `make *`, `bun run *`
- `gh api *`, `docker run`/`exec`, `kubectl exec`, `sudo`

The threat model: a user's allowlist is **per-project, version-controlled, and frequently shared**. If a teammate clones the repo and runs `claude`, they inherit the allowlist. A wildcard like `Bash(python:*)` would silently grant any Python script execution to any future Claude Code session in that project - the next time someone says "run this script for me," Claude executes it without prompting.

A narrow exact pattern (`Bash(bun run typecheck)`) is fine because the user explicitly opted into that one form. The wildcard variant (`Bash(bun run *)`) is not, because it lets a careless skill author or a malicious prompt smuggle arbitrary code into the run-target slot.

The skill body's "When in doubt, leave it out" line is the operationalization of this principle: if the model isn't sure a pattern is safe, the right answer is to skip it. Better to leave a few prompts in place than to widen the trust boundary by accident.

### 5. Why merge into `.claude/settings.json` (not `.claude/settings.local.json` or `~/.claude/settings.json`)

The skill is explicit about the target file:

> Merge into `.claude/settings.json` in the current project (not `~/.claude/settings.json`, not `.claude/settings.local.json`).

Reasoning:

- `~/.claude/settings.json` (user settings) - would apply to every project. The patterns were derived from this project's transcripts, so they don't necessarily generalize. Don't pollute the global allowlist with project-specific rules.
- `.claude/settings.local.json` (project-local, gitignored) - would be hidden from teammates. If the user spent time analyzing their workflow, the team benefits from sharing the result; gitignored means each teammate would need to re-run the skill.
- `.claude/settings.json` (project, version-controlled) - shared, scoped to this project. The right home.

### 6. Why drop patterns that appeared fewer than ~3 times

Step 6 says "Drop anything that appeared fewer than ~3 times - not worth the allowlist entry." Two reasons:

1. **Signal-to-noise** - a one-off command in the transcripts might be exploratory (the user was trying something they don't normally do). Adding it to the allowlist would calcify a non-pattern.
2. **List length** - the cap of "top ~20" is to keep the proposal scannable by the user. A long tail of one-time commands would push frequent commands off the visible list.

The "~3" threshold is loose by design - it's a guideline, not a hard cutoff. The model can use judgment.

---

## Why this approach?

### Alternative 1: have the host scan automatically and prompt the user

Instead of a model-driven skill, the host could background-scan transcripts on session start and surface a notification ("we found 20 patterns you could allowlist; click to review"). Why not?

- **Quality** - the read-only/mutation distinction has many edge cases (`sed -i` is mutation, `sed` without `-i` is read-only; `bun run test` is "read-only if your test suite doesn't have side effects, otherwise mutation"). A model can reason about these; a deterministic scanner can't.
- **Context** - the user might run `git push` regularly but never want it in the allowlist. The model can spot the intent ("this is destructive even though they use it daily"); a frequency scanner can't.
- **Surface area** - building a UI for "here are 20 patterns; uncheck the ones you don't want" is significant engineering. Letting the model present a markdown table and asking the user "looks good?" is essentially free.

### Alternative 2: ship the rules pre-baked into the host

Just put a curated allowlist into every `claude` install. Why not?

- **Per-project customization** - some projects have non-obvious read-only commands (e.g., `./scripts/check-types.sh` in one repo, `make typecheck` in another). A global allowlist would either be too narrow (covers only common tools) or too broad (covers every tool the user might have).
- **Auditability** - users want to see the rules in their own settings.json. Hidden rules are unsearchable when something unexpected happens.
- **Trust** - a global allowlist baked into the binary requires trusting Anthropic's choice. A user-merged allowlist requires trusting only what the user explicitly approved.

### Alternative 3: turn it into a `/doctor` subcommand

Make permission-allowlist analysis a built-in `/doctor` flag rather than a separate skill. Why not?

- **Visibility** - `/doctor` is for diagnostics, not configuration changes. Bundling them would confuse the model about when each fires.
- **Skill discoverability** - `/less-permission-prompts` shows up in the slash-menu autocomplete with its own description, so users discover it by browsing. `/doctor --less-prompts` would be hidden behind a flag.
- **Composability** - the skill can be invoked by the model proactively ("user is hitting many permission prompts; let me run /less-permission-prompts"). A doctor-flag would lock the feature to a single entry point.

---

## Key insight

The skill is essentially **the security-team's allowlist heuristics in prose form, executed by the model on demand**. Two design choices reveal the priority:

1. **"When in doubt, leave it out"** - the skill repeatedly tells the model to drop ambiguous cases rather than guess. The cost of a missed allowlist entry is one more permission prompt; the cost of a wrong one is a widened trust boundary. The asymmetry is intentional.

2. **"Drop commands Claude Code already auto-allows"** - the skill knows what BashTool's built-in safe-set is, so it doesn't propose redundant rules. Without this step, the user would get a list of mostly-no-op rules that look like progress but accomplish nothing. This is the rare case where adding more text to the model's prompt actively reduces noise in the user's final settings file.

The skill's name (`less-permission-prompts`) is a direct framing of the user value: not "more allowlist rules" (the implementation) but "fewer prompts" (the outcome). It's a pattern the team chose to bundle precisely because the right answer requires nuance (which the model provides) and explicit knowledge of the host's auto-allow set (which the bundled prompt inlines).

In v2.1.88 no such skill existed. Adding it as a bundled skill (rather than a host feature or a third-party plugin) puts it in the official-blessed tier and ensures the auto-allow list stays in sync with the rest of the binary on each release.
