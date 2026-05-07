
// @from(Ln 446967, Col 0)
async function ubY(q, K, _) {
    d("tengu_ext_ide_command", {});
    let {
        options: {
            dynamicMcpConfig: z
        },
        onChangeDynamicMcpConfig: Y
    } = K;
    if (_?.trim() === "open") {
        let j = sO(),
            H = j ? j.worktreePath : b8(),
            X = (await Vh6(!0)).filter((M) => M.isValid);
        if (X.length === 0) return q("No IDEs with Claude Code extension detected."), null;
        return S_.default.createElement(SbY, {
            availableIDEs: X,
            onSelectIDE: async (M) => {
                if (!M) {
                    q("No IDE selected.");
                    return
                }
                if (M.name.toLowerCase().includes("vscode") || M.name.toLowerCase().includes("cursor") || M.name.toLowerCase().includes("windsurf")) {
                    let {
                        code: P
                    } = await w1("code", [H]);
                    if (P === 0) q(`Opened ${j?"worktree":"project"} in ${Y8.bold(M.name)}`);
                    else q(`Failed to open in ${M.name}. Try opening manually: ${H}`)
                } else if (Th6()) q(`Please open the ${j?"worktree":"project"} manually in ${Y8.bold(M.name)}: ${H}`);
                else q(`Please open the ${j?"worktree":"project"} manually in ${Y8.bold(M.name)}: ${H}`)
            },
            onDone: () => {
                q("Exited without opening IDE", {
                    display: "system"
                })
            }
        })
    }
    let A = await Vh6(!0);
    if (A.length === 0 && K.onInstallIDEExtension && !q0()) {
        let j = await En1(),
            H = (J) => {
                if (K.onInstallIDEExtension)
                    if (K.onInstallIDEExtension(J), Up(J)) q(`Installed plugin to ${Y8.bold(kH(J))}
Please ${Y8.bold("restart your IDE")} completely for it to take effect`);
                    else q(`Installed extension to ${Y8.bold(kH(J))}`)
            };
        if (j.length > 1) return S_.default.createElement(bbY, {
            runningIDEs: j,
            onSelectIDE: H,
            onDone: () => {
                q("No IDE selected.", {
                    display: "system"
                })
            }
        });
        else if (j.length === 1) return S_.default.createElement(xbY, {
            ide: j[0],
            onInstall: H
        })
    }
    let O = A.filter((j) => j.isValid),
        w = A.filter((j) => !j.isValid),
        $ = await RbY(O, z);
    return S_.default.createElement(BbY, {
        availableIDEs: O,
        unavailableIDEs: w,
        currentIDE: $,
        dynamicMcpConfig: z,
        onChangeDynamicMcpConfig: Y,
        onDone: q
    })
}
// @from(Ln 447039, Col 0)
function BbY({
    availableIDEs: q,
    unavailableIDEs: K,
    currentIDE: _,
    dynamicMcpConfig: z,
    onChangeDynamicMcpConfig: Y,
    onDone: A
}) {
    let [O, w] = S_.useState(null), $ = M8((X) => X.mcp.clients.find((M) => M.name === "ide")), j = R7(), H = S_.useRef(!0);
    S_.useEffect(() => {
        if (!O) return;
        if (H.current) {
            H.current = !1;
            return
        }
        if (!$ || $.type === "pending") return;
        if ($.type === "connected") A(`Connected to ${O.name}.`);
        else if ($.type === "failed") A(`Failed to connect to ${O.name}.`)
    }, [$, O, A]), S_.useEffect(() => {
        if (!O) return;
        let X = setTimeout(A, mbY, `Connection to ${O.name} timed out.`);
        return () => clearTimeout(X)
    }, [O, A]);
    let J = S_.useCallback((X) => {
        if (!Y) {
            A("Error connecting to IDE.");
            return
        }
        let M = {
            ...z || {}
        };
        if (_) delete M.ide;
        if (!X) {
            if ($ && $.type === "connected" && _) $.client.onclose = () => {}, WG("ide", $.config), j((W) => ({
                ...W,
                mcp: {
                    ...W.mcp,
                    clients: W.mcp.clients.filter((D) => D.name !== "ide"),
                    tools: W.mcp.tools.filter((D) => !D.name?.startsWith("mcp__ide__")),
                    commands: W.mcp.commands.filter((D) => !D.name?.startsWith("mcp__ide__"))
                }
            }));
            Y(M), A(_ ? `Disconnected from ${_.name}.` : "No IDE selected.");
            return
        }
        let P = X.url;
        M.ide = {
            type: P.startsWith("ws:") ? "ws-ide" : "sse-ide",
            url: P,
            ideName: X.name,
            authToken: X.authToken,
            ideRunningInWindows: X.ideRunningInWindows,
            scope: "dynamic"
        }, H.current = !0, w(X), Y(M)
    }, [z, _, $, j, Y, A]);
    if (O) return S_.default.createElement(T, {
        dimColor: !0
    }, "Connecting to ", O.name, "…");
    return S_.default.createElement(EbY, {
        availableIDEs: q,
        unavailableIDEs: K,
        selectedIDE: _,
        onClose: () => A("IDE selection cancelled", {
            display: "system"
        }),
        onSelect: J
    })
}
// @from(Ln 447108, Col 0)
function dO7(q, K = 100) {
    if (q.length === 0) return "";
    let _ = b8(),
        z = q.slice(0, 2),
        Y = q.length > 2,
        A = Y ? 3 : 0,
        O = (z.length - 1) * 2,
        w = K - O - A,
        $ = Math.floor(w / z.length),
        j = _.normalize("NFC"),
        J = z.map((X) => {
            let M = X.normalize("NFC");
            if (M.startsWith(j + PBK.sep)) X = M.slice(j.length + 1);
            if (X.length <= $) return X;
            return "…" + X.slice(-($ - 1))
        }).join(", ");
    if (Y) J += ", …";
    return J
}
// @from(Ln 447127, Col 4)
S_
// @from(Ln 447127, Col 8)
mbY = 35000
// @from(Ln 447128, Col 4)
DBK = L(() => {
    o6();
    Y3();
    C8();
    g_();
    S4();
    MBK();
    g6();
    oW();
    N7();
    n7();
    Q4();
    kj();
    tD();
    S_ = K6(P6(), 1)
})
// @from(Ln 447144, Col 4)
pbY
// @from(Ln 447144, Col 9)
ZBK
// @from(Ln 447145, Col 4)
fBK = L(() => {
    pbY = {
        type: "local-jsx",
        name: "ide",
        description: "Manage IDE integrations and show status",
        argumentHint: "[open]",
        load: () => Promise.resolve().then(() => (DBK(), WBK))
    }, ZBK = pbY
})
// @from(Ln 447154, Col 4)
gbY = `Please analyze this codebase and create a CLAUDE.md file, which will be given to future instances of Claude Code to operate in this repository.

What to add:
1. Commands that will be commonly used, such as how to build, lint, and run tests. Include the necessary commands to develop in this codebase, such as how to run a single test.
2. High-level code architecture and structure so that future instances can be productive more quickly. Focus on the "big picture" architecture that requires reading multiple files to understand.

Usage notes:
- If there's already a CLAUDE.md, suggest improvements to it.
- When you make the initial CLAUDE.md, do not repeat yourself and do not include obvious instructions like "Provide helpful error messages to users", "Write unit tests for all new utilities", "Never include sensitive information (API keys, tokens) in code or commits".
- Avoid listing every component or file structure that can be easily discovered.
- Don't include generic development practices.
- If there are Cursor rules (in .cursor/rules/ or .cursorrules) or Copilot rules (in .github/copilot-instructions.md), make sure to include the important parts.
- If there is a README.md, make sure to include the important parts.
- Do not make up information such as "Common Development Tasks", "Tips for Development", "Support and Documentation" unless this is expressly included in other files that you read.
- Be sure to prefix the file with the following text:

\`\`\`
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
\`\`\``
// @from(Ln 447175, Col 4)
UbY = `Set up a minimal CLAUDE.md (and optionally skills and hooks) for this repo. CLAUDE.md is loaded into every Claude Code session, so it must be concise — only include what Claude would get wrong without it.

## Phase 1: Ask what to set up

Use AskUserQuestion to find out what the user wants:

- "Which CLAUDE.md files should /init set up?"
  Options: "Project CLAUDE.md" | "Personal CLAUDE.local.md" | "Both project + personal"
  Description for project: "Team-shared instructions checked into source control — architecture, coding standards, common workflows."
  Description for personal: "Your private preferences for this project (gitignored, not shared) — your role, sandbox URLs, preferred test data, workflow quirks."

- "Also set up skills and hooks?"
  Options: "Skills + hooks" | "Skills only" | "Hooks only" | "Neither, just CLAUDE.md"
  Description for skills: "On-demand capabilities you or Claude invoke with \`/skill-name\` — good for repeatable workflows and reference knowledge."
  Description for hooks: "Deterministic shell commands that run on tool events (e.g., format after every edit). Claude can't skip them."

## Phase 2: Explore the codebase

Launch a subagent to survey the codebase, and ask it to read key files to understand the project: manifest files (package.json, Cargo.toml, pyproject.toml, go.mod, pom.xml, etc.), README, Makefile/build configs, CI config, existing CLAUDE.md, .claude/rules/, AGENTS.md, .cursor/rules or .cursorrules, .github/copilot-instructions.md, .windsurfrules, .clinerules, .mcp.json.

Detect:
- Build, test, and lint commands (especially non-standard ones)
- Languages, frameworks, and package manager
- Project structure (monorepo with workspaces, multi-module, or single project)
- Code style rules that differ from language defaults
- Non-obvious gotchas, required env vars, or workflow quirks
- Existing .claude/skills/ and .claude/rules/ directories
- Formatter configuration (prettier, biome, ruff, black, gofmt, rustfmt, or a unified format script like \`npm run format\` / \`make fmt\`)
- Git worktree usage: run \`git worktree list\` to check if this repo has multiple worktrees (only relevant if the user wants a personal CLAUDE.local.md)

Note what you could NOT figure out from code alone — these become interview questions.

## Phase 3: Fill in the gaps

Use AskUserQuestion to gather what you still need to write good CLAUDE.md files and skills. Ask only things the code can't answer.

If the user chose project CLAUDE.md or both: ask about codebase practices — non-obvious commands, gotchas, branch/PR conventions, required env setup, testing quirks. Skip things already in README or obvious from manifest files. Do not mark any options as "recommended" — this is about how their team works, not best practices.

If the user chose personal CLAUDE.local.md or both: ask about them, not the codebase. Do not mark any options as "recommended" — this is about their personal preferences, not best practices. Examples of questions:
  - What's their role on the team? (e.g., "backend engineer", "data scientist", "new hire onboarding")
  - How familiar are they with this codebase and its languages/frameworks? (so Claude can calibrate explanation depth)
  - Do they have personal sandbox URLs, test accounts, API key paths, or local setup details Claude should know?
  - Only if Phase 2 found multiple git worktrees: ask whether their worktrees are nested inside the main repo (e.g., \`.claude/worktrees/<name>/\`) or siblings/external (e.g., \`../myrepo-feature/\`). If nested, the upward file walk finds the main repo's CLAUDE.local.md automatically — no special handling needed. If sibling/external, the personal content should live in a home-directory file (e.g., \`~/.claude/<project-name>-instructions.md\`) and each worktree gets a one-line CLAUDE.local.md stub that imports it: \`@~/.claude/<project-name>-instructions.md\`. Never put this import in the project CLAUDE.md — that would check a personal reference into the team-shared file.
  - Any communication preferences? (e.g., "be terse", "always explain tradeoffs", "don't summarize at the end")

**Synthesize a proposal from Phase 2 findings** — e.g., format-on-edit if a formatter exists, a \`/verify\` skill if tests exist, a CLAUDE.md note for anything from the gap-fill answers that's a guideline rather than a workflow. For each, pick the artifact type that fits, **constrained by the Phase 1 skills+hooks choice**:

  - **Hook** (stricter) — deterministic shell command on a tool event; Claude can't skip it. Fits mechanical, fast, per-edit steps: formatting, linting, running a quick test on the changed file.
  - **Skill** (on-demand) — you or Claude invoke \`/skill-name\` when you want it. Fits workflows that don't belong on every edit: deep verification, session reports, deploys.
  - **CLAUDE.md note** (looser) — influences Claude's behavior but not enforced. Fits communication/thinking preferences: "plan before coding", "be terse", "explain tradeoffs".

  **Respect Phase 1's skills+hooks choice as a hard filter**: if the user picked "Skills only", downgrade any hook you'd suggest to a skill or a CLAUDE.md note. If "Hooks only", downgrade skills to hooks (where mechanically possible) or notes. If "Neither", everything becomes a CLAUDE.md note. Never propose an artifact type the user didn't opt into.

**Show the proposal via AskUserQuestion's \`preview\` field, not as a separate text message** — the dialog overlays your output, so preceding text is hidden. The \`preview\` field renders markdown in a side-panel (like plan mode); the \`question\` field is plain-text-only. Structure it as:

  - \`question\`: short and plain, e.g. "Does this proposal look right?"
  - Each option gets a \`preview\` with the full proposal as markdown. The "Looks good — proceed" option's preview shows everything; per-item-drop options' previews show what remains after that drop.
  - **Keep previews compact — the preview box truncates with no scrolling.** One line per item, no blank lines between items, no header. Example preview content:

    • **Format-on-edit hook** (automatic) — \`ruff format <file>\` via PostToolUse
    • **/verify skill** (on-demand) — \`make lint && make typecheck && make test\`
    • **CLAUDE.md note** (guideline) — "run lint/typecheck/test before marking done"

  - Option labels stay short ("Looks good", "Drop the hook", "Drop the skill") — the tool auto-adds an "Other" free-text option, so don't add your own catch-all.

**Build the preference queue** from the accepted proposal. Each entry: {type: hook|skill|note, description, target file, any Phase-2-sourced details like the actual test/format command}. Phases 4-7 consume this queue.

## Phase 4: Write CLAUDE.md (if user chose project or both)

Write a minimal CLAUDE.md at the project root. Every line must pass this test: "Would removing this cause Claude to make mistakes?" If no, cut it.

**Consume \`note\` entries from the Phase 3 preference queue whose target is CLAUDE.md** (team-level notes) — add each as a concise line in the most relevant section. These are the behaviors the user wants Claude to follow but didn't need guaranteed (e.g., "propose a plan before implementing", "explain the tradeoffs when refactoring"). Leave personal-targeted notes for Phase 5.

Include:
- Build/test/lint commands Claude can't guess (non-standard scripts, flags, or sequences)
- Code style rules that DIFFER from language defaults (e.g., "prefer type over interface")
- Testing instructions and quirks (e.g., "run single test with: pytest -k 'test_name'")
- Repo etiquette (branch naming, PR conventions, commit style)
- Required env vars or setup steps
- Non-obvious gotchas or architectural decisions
- Important parts from existing AI coding tool configs if they exist (AGENTS.md, .cursor/rules, .cursorrules, .github/copilot-instructions.md, .windsurfrules, .clinerules)

Exclude:
- File-by-file structure or component lists (Claude can discover these by reading the codebase)
- Standard language conventions Claude already knows
- Generic advice ("write clean code", "handle errors")
- Detailed API docs or long references — use \`@path/to/import\` syntax instead (e.g., \`@docs/api-reference.md\`) to inline content on demand without bloating CLAUDE.md
- Information that changes frequently — reference the source with \`@path/to/import\` so Claude always reads the current version
- Long tutorials or walkthroughs (move to a separate file and reference with \`@path/to/import\`, or put in a skill)
- Commands obvious from manifest files (e.g., standard "npm test", "cargo test", "pytest")

Be specific: "Use 2-space indentation in TypeScript" is better than "Format code properly."

Do not repeat yourself and do not make up sections like "Common Development Tasks" or "Tips for Development" — only include information expressly found in files you read.

Prefix the file with:

\`\`\`
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
\`\`\`

If CLAUDE.md already exists: read it, propose specific changes as diffs, and explain why each change improves it. Do not silently overwrite.

For projects with multiple concerns, suggest organizing instructions into \`.claude/rules/\` as separate focused files (e.g., \`code-style.md\`, \`testing.md\`, \`security.md\`). These are loaded automatically alongside CLAUDE.md and can be scoped to specific file paths using \`paths\` frontmatter.

For projects with distinct subdirectories (monorepos, multi-module projects, etc.): mention that subdirectory CLAUDE.md files can be added for module-specific instructions (they're loaded automatically when Claude works in those directories). Offer to create them if the user wants.

## Phase 5: Write CLAUDE.local.md (if user chose personal or both)

Write a minimal CLAUDE.local.md at the project root. This file is automatically loaded alongside CLAUDE.md. After creating it, add \`CLAUDE.local.md\` to the project's .gitignore so it stays private.

**Consume \`note\` entries from the Phase 3 preference queue whose target is CLAUDE.local.md** (personal-level notes) — add each as a concise line. If the user chose personal-only in Phase 1, this is the sole consumer of note entries.

Include:
- The user's role and familiarity with the codebase (so Claude can calibrate explanations)
- Personal sandbox URLs, test accounts, or local setup details
- Personal workflow or communication preferences

Keep it short — only include what would make Claude's responses noticeably better for this user.

If Phase 2 found multiple git worktrees and the user confirmed they use sibling/external worktrees (not nested inside the main repo): the upward file walk won't find a single CLAUDE.local.md from all worktrees. Write the actual personal content to \`~/.claude/<project-name>-instructions.md\` and make CLAUDE.local.md a one-line stub that imports it: \`@~/.claude/<project-name>-instructions.md\`. The user can copy this one-line stub to each sibling worktree. Never put this import in the project CLAUDE.md. If worktrees are nested inside the main repo (e.g., \`.claude/worktrees/\`), no special handling is needed — the main repo's CLAUDE.local.md is found automatically.

If CLAUDE.local.md already exists: read it, propose specific additions, and do not silently overwrite.

## Phase 6: Suggest and create skills (if user chose "Skills + hooks" or "Skills only")

Skills add capabilities Claude can use on demand without bloating every session.

**First, consume \`skill\` entries from the Phase 3 preference queue.** Each queued skill preference becomes a SKILL.md tailored to what the user described. For each:
- Name it from the preference (e.g., "verify-deep", "session-report", "deploy-sandbox")
- Write the body using the user's own words from the interview plus whatever Phase 2 found (test commands, report format, deploy target). If the preference maps to an existing bundled skill (e.g., \`/verify\`), write a project skill that adds the user's specific constraints on top — tell the user the bundled one still exists and theirs is additive.
- Ask a quick follow-up if the preference is underspecified (e.g., "which test command should verify-deep run?")

**Then suggest additional skills** beyond the queue when you find:
- Reference knowledge for specific tasks (conventions, patterns, style guides for a subsystem)
- Repeatable workflows the user would want to trigger directly (deploy, fix an issue, release process, verify changes)

For each suggested skill, provide: name, one-line purpose, and why it fits this repo.

If \`.claude/skills/\` already exists with skills, review them first. Do not overwrite existing skills — only propose new ones that complement what is already there.

Create each skill at \`.claude/skills/<skill-name>/SKILL.md\`:

\`\`\`yaml
---
name: <skill-name>
description: <what the skill does and when to use it>
---

<Instructions for Claude>
\`\`\`

Both the user (\`/<skill-name>\`) and Claude can invoke skills by default. For workflows with side effects (e.g., \`/deploy\`, \`/fix-issue 123\`), add \`disable-model-invocation: true\` so only the user can trigger it, and use \`$ARGUMENTS\` to accept input.

## Phase 7: Suggest additional optimizations

Tell the user you're going to suggest a few additional optimizations now that CLAUDE.md and skills (if chosen) are in place.

Check the environment and ask about each gap you find (use AskUserQuestion):

- **GitHub CLI**: Run \`which gh\` (or \`where gh\` on Windows). If it's missing AND the project uses GitHub (check \`git remote -v\` for github.com), ask the user if they want to install it. Explain that the GitHub CLI lets Claude help with commits, pull requests, issues, and code review directly.

- **Linting**: If Phase 2 found no lint config (no .eslintrc, ruff.toml, .golangci.yml, etc. for the project's language), ask the user if they want Claude to set up linting for this codebase. Explain that linting catches issues early and gives Claude fast feedback on its own edits.

- **Proposal-sourced hooks** (if user chose "Skills + hooks" or "Hooks only"): Consume \`hook\` entries from the Phase 3 preference queue. If Phase 2 found a formatter and the queue has no formatting hook, offer format-on-edit as a fallback. If the user chose "Neither" or "Skills only" in Phase 1, skip this bullet entirely.

  For each hook preference (from the queue or the formatter fallback):

  1. Target file: default based on the Phase 1 CLAUDE.md choice — project → \`.claude/settings.json\` (team-shared, committed); personal → \`.claude/settings.local.json\`. Only ask if the user chose "both" in Phase 1 or the preference is ambiguous. Ask once for all hooks, not per-hook.

  2. Pick the event and matcher from the preference:
     - "after every edit" → \`PostToolUse\` with matcher \`Write|Edit\`
     - "when Claude finishes" / "before I review" → \`Stop\` event (fires at the end of every turn — including read-only ones)
     - "before running bash" → \`PreToolUse\` with matcher \`Bash\`
     - "before committing" (literal git-commit gate) → **not a hooks.json hook.** Matchers can't filter Bash by command content, so there's no way to target only \`git commit\`. Route this to a git pre-commit hook (\`.git/hooks/pre-commit\`, husky, pre-commit framework) instead — offer to write one. If the user actually means "before I review and commit Claude's output", that's \`Stop\` — probe to disambiguate.
     Probe if the preference is ambiguous.

  3. **Load the hook reference** (once per \`/init\` run, before the first hook): invoke the Skill tool with \`skill: 'update-config'\` and args starting with \`[hooks-only]\` followed by a one-line summary of what you're building — e.g., \`[hooks-only] Constructing a PostToolUse/Write|Edit format hook for .claude/settings.json using ruff\`. This loads the hooks schema and verification flow into context. Subsequent hooks reuse it — don't re-invoke.

  4. Follow the skill's **"Constructing a Hook"** flow: dedup check → construct for THIS project → pipe-test raw → wrap → write JSON → \`jq -e\` validate → live-proof (for \`Pre|PostToolUse\` on triggerable matchers) → cleanup → handoff. Target file and event/matcher come from steps 1–2 above.

Act on each "yes" before moving on.

## Phase 8: Summary and next steps

Recap what was set up — which files were written and the key points included in each. Remind the user these files are a starting point: they should review and tweak them, and can run \`/init\` again anytime to re-scan.

Then tell the user that you'll be introducing a few more suggestions for optimizing their codebase and Claude Code setup based on what you found. Present these as a single, well-formatted to-do list where every item is relevant to this repo. Put the most impactful items first.

When building the list, work through these checks and include only what applies:
- If frontend code was detected (React, Vue, Svelte, etc.): \`/plugin install frontend-design@claude-plugins-official\` gives Claude design principles and component patterns so it produces polished UI; \`/plugin install playwright@claude-plugins-official\` lets Claude launch a real browser, screenshot what it built, and fix visual bugs itself.
- If you found gaps in Phase 7 (missing GitHub CLI, missing linting) and the user said no: list them here with a one-line reason why each helps.
- If tests are missing or sparse: suggest setting up a test framework so Claude can verify its own changes.
- To help you create skills and optimize existing skills using evals, Claude Code has an official skill-creator plugin you can install. Install it with \`/plugin install skill-creator@claude-plugins-official\`, then run \`/skill-creator <skill-name>\` to create new skills or refine any existing skill. (Always include this one.)
- Browse official plugins with \`/plugin\` — these bundle skills, agents, hooks, and MCP servers that you may find helpful. You can also create your own custom plugins to share them with others. (Always include this one.)`
// @from(Ln 447372, Col 4)
QbY
// @from(Ln 447372, Col 9)
GBK
// @from(Ln 447373, Col 4)
vBK = L(() => {
    hs6();
    Q8();
    QbY = {
        type: "prompt",
        name: "init",
        get description() {
            return S6(process.env.CLAUDE_CODE_NEW_INIT) ? "Initialize new CLAUDE.md file(s) and optional skills/hooks with codebase documentation" : "Initialize a new CLAUDE.md file with codebase documentation"
        },
        contentLength: 0,
        progressMessage: "analyzing your codebase",
        source: "builtin",
        async getPromptForCommand() {
            return NE6(), [{
                type: "text",
                text: S6(process.env.CLAUDE_CODE_NEW_INIT) ? UbY : gbY
            }]
        }
    }, GBK = QbY
})
// @from(Ln 447393, Col 4)
dbY
// @from(Ln 447393, Col 9)
TBK
// @from(Ln 447394, Col 4)
VBK = L(() => {
    dbY = {
        type: "prompt",
        name: "init-verifiers",
        description: "Create verifier skill(s) for automated verification of code changes",
        contentLength: 0,
        progressMessage: "analyzing your project and creating verifier skills",
        source: "builtin",
        async getPromptForCommand() {
            return [{
                type: "text",
                text: `Use the TodoWrite tool to track your progress through this multi-step task.

## Goal

Create one or more verifier skills that can be used by the Verify agent to automatically verify code changes in this project or folder. You may create multiple verifiers if the project has different verification needs (e.g., both web UI and API endpoints).

**Do NOT create verifiers for unit tests or typechecking.** Those are already handled by the standard build/test workflow and don't need dedicated verifier skills. Focus on functional verification: web UI (Playwright), CLI (Tmux), and API (HTTP) verifiers.

## Phase 1: Auto-Detection

Analyze the project to detect what's in different subdirectories. The project may contain multiple sub-projects or areas that need different verification approaches (e.g., a web frontend, an API backend, and shared libraries all in one repo).

1. **Scan top-level directories** to identify distinct project areas:
   - Look for separate package.json, Cargo.toml, pyproject.toml, go.mod in subdirectories
   - Identify distinct application types in different folders

2. **For each area, detect:**

   a. **Project type and stack**
      - Primary language(s) and frameworks
      - Package managers (npm, yarn, pnpm, pip, cargo, etc.)

   b. **Application type**
      - Web app (React, Next.js, Vue, etc.) → suggest Playwright-based verifier
      - CLI tool → suggest Tmux-based verifier
      - API service (Express, FastAPI, etc.) → suggest HTTP-based verifier

   c. **Existing verification tools**
      - Test frameworks (Jest, Vitest, pytest, etc.)
      - E2E tools (Playwright, Cypress, etc.)
      - Dev server scripts in package.json

   d. **Dev server configuration**
      - How to start the dev server
      - What URL it runs on
      - What text indicates it's ready

3. **Installed verification packages** (for web apps)
   - Check if Playwright is installed (look in package.json dependencies/devDependencies)
   - Check MCP configuration (.mcp.json) for browser automation tools:
     - Playwright MCP server
     - Chrome DevTools MCP server
     - Claude Chrome Extension MCP (browser-use via Claude's Chrome extension)
   - For Python projects, check for playwright, pytest-playwright

## Phase 2: Verification Tool Setup

Based on what was detected in Phase 1, help the user set up appropriate verification tools.

### For Web Applications

1. **If browser automation tools are already installed/configured**, ask the user which one they want to use:
   - Use AskUserQuestion to present the detected options
   - Example: "I found Playwright and Chrome DevTools MCP configured. Which would you like to use for verification?"

2. **If NO browser automation tools are detected**, ask if they want to install/configure one:
   - Use AskUserQuestion: "No browser automation tools detected. Would you like to set one up for UI verification?"
   - Options to offer:
     - **Playwright** (Recommended) - Full browser automation library, works headless, great for CI
     - **Chrome DevTools MCP** - Uses Chrome DevTools Protocol via MCP
     - **Claude Chrome Extension** - Uses the Claude Chrome extension for browser interaction (requires the extension installed in Chrome)
     - **None** - Skip browser automation (will use basic HTTP checks only)

3. **If user chooses to install Playwright**, run the appropriate command based on package manager:
   - For npm: \`npm install -D @playwright/test && npx playwright install\`
   - For yarn: \`yarn add -D @playwright/test && yarn playwright install\`
   - For pnpm: \`pnpm add -D @playwright/test && pnpm exec playwright install\`
   - For bun: \`bun add -D @playwright/test && bun playwright install\`

4. **If user chooses Chrome DevTools MCP or Claude Chrome Extension**:
   - These require MCP server configuration rather than package installation
   - Ask if they want you to add the MCP server configuration to .mcp.json
   - For Claude Chrome Extension, inform them they need the extension installed from the Chrome Web Store

5. **MCP Server Setup** (if applicable):
   - If user selected an MCP-based option, configure the appropriate entry in .mcp.json
   - Update the verifier skill's allowed-tools to use the appropriate mcp__* tools

### For CLI Tools

1. Check if asciinema is available (run \`which asciinema\`)
2. If not available, inform the user that asciinema can help record verification sessions but is optional
3. Tmux is typically system-installed, just verify it's available

### For API Services

1. Check if HTTP testing tools are available:
   - curl (usually system-installed)
   - httpie (\`http\` command)
2. No installation typically needed

## Phase 3: Interactive Q&A

Based on the areas detected in Phase 1, you may need to create multiple verifiers. For each distinct area, use the AskUserQuestion tool to confirm:

1. **Verifier name** - Based on detection, suggest a name but let user choose:

   If there is only ONE project area, use the simple format:
   - "verifier-playwright" for web UI testing
   - "verifier-cli" for CLI/terminal testing
   - "verifier-api" for HTTP API testing

   If there are MULTIPLE project areas, use the format \`verifier-<project>-<type>\`:
   - "verifier-frontend-playwright" for the frontend web UI
   - "verifier-backend-api" for the backend API
   - "verifier-admin-playwright" for an admin dashboard

   The \`<project>\` portion should be a short identifier for the subdirectory or project area (e.g., the folder name or package name).

   Custom names are allowed but MUST include "verifier" in the name — the Verify agent discovers skills by looking for "verifier" in the folder name.

2. **Project-specific questions** based on type:

   For web apps (playwright):
   - Dev server command (e.g., "npm run dev")
   - Dev server URL (e.g., "http://localhost:3000")
   - Ready signal (text that appears when server is ready)

   For CLI tools:
   - Entry point command (e.g., "node ./cli.js" or "./target/debug/myapp")
   - Whether to record with asciinema

   For APIs:
   - API server command
   - Base URL

3. **Authentication & Login** (for web apps and APIs):

   Use AskUserQuestion to ask: "Does your app require authentication/login to access the pages or endpoints being verified?"
   - **No authentication needed** - App is publicly accessible, no login required
   - **Yes, login required** - App requires authentication before verification can proceed
   - **Some pages require auth** - Mix of public and authenticated routes

   If the user selects login required (or partial), ask follow-up questions:
   - **Login method**: How does a user log in?
     - Form-based login (username/password on a login page)
     - API token/key (passed as header or query param)
     - OAuth/SSO (redirect-based flow)
     - Other (let user describe)
   - **Test credentials**: What credentials should the verifier use?
     - Ask for the login URL (e.g., "/login", "http://localhost:3000/auth")
     - Ask for test username/email and password, or API key
     - Note: Suggest the user use environment variables for secrets (e.g., \`TEST_USER\`, \`TEST_PASSWORD\`) rather than hardcoding
   - **Post-login indicator**: How to confirm login succeeded?
     - URL redirect (e.g., redirects to "/dashboard")
     - Element appears (e.g., "Welcome" text, user avatar)
     - Cookie/token is set

## Phase 4: Generate Verifier Skill

**All verifier skills are created in the project root's \`.claude/skills/\` directory.** This ensures they are automatically loaded when Claude runs in the project.

Write the skill file to \`.claude/skills/<verifier-name>/SKILL.md\`.

### Skill Template Structure

\`\`\`markdown
---
name: <verifier-name>
description: <description based on type>
allowed-tools:
  # Tools appropriate for the verifier type
---

# <Verifier Title>

You are a verification executor. You receive a verification plan and execute it EXACTLY as written.

## Project Context
<Project-specific details from detection>

## Setup Instructions
<How to start any required services>

## Authentication
<If auth is required, include step-by-step login instructions here>
<Include login URL, credential env vars, and post-login verification>
<If no auth needed, omit this section>

## Reporting

Report PASS or FAIL for each step using the format specified in the verification plan.

## Cleanup

After verification:
1. Stop any dev servers started
2. Close any browser sessions
3. Report final summary

## Self-Update

If verification fails because this skill's instructions are outdated (dev server command/port/ready-signal changed, etc.) — not because the feature under test is broken — or if the user corrects you mid-run, use AskUserQuestion to confirm and then Edit this SKILL.md with a minimal targeted fix.
\`\`\`

### Allowed Tools by Type

**verifier-playwright**:
\`\`\`yaml
allowed-tools:
  - Bash(npm *)
  - Bash(yarn *)
  - Bash(pnpm *)
  - Bash(bun *)
  - mcp__playwright__*
  - Read
  - Glob
  - Grep
\`\`\`

**verifier-cli**:
\`\`\`yaml
allowed-tools:
  - Tmux
  - Bash(asciinema *)
  - Read
  - Glob
  - Grep
\`\`\`

**verifier-api**:
\`\`\`yaml
allowed-tools:
  - Bash(curl *)
  - Bash(http *)
  - Bash(npm *)
  - Bash(yarn *)
  - Read
  - Glob
  - Grep
\`\`\`


## Phase 5: Confirm Creation

After writing the skill file(s), inform the user:
1. Where each skill was created (always in \`.claude/skills/\`)
2. How the Verify agent will discover them — the folder name must contain "verifier" (case-insensitive) for automatic discovery
3. That they can edit the skills to customize them
4. That they can run /init-verifiers again to add more verifiers for other areas
5. That the verifier will offer to self-update if it detects its own instructions are outdated (wrong dev server command, changed ready signal, etc.)
`
            }]
        }
    }, TBK = dbY
})
// @from(Ln 447652, Col 0)
function cbY(q) {
    let K = new Set(Ps6.map((_) => U$6(_.key)));
    return q.map((_) => {
        let z = {};
        for (let [Y, A] of Object.entries(_.bindings))
            if (!K.has(U$6(Y))) z[Y] = A;
        return {
            context: _.context,
            bindings: z
        }
    }).filter((_) => Object.keys(_.bindings).length > 0)
}
// @from(Ln 447665, Col 0)
function kBK() {
    let K = {
        $schema: "https://www.schemastore.org/claude-code-keybindings.json",
        $docs: "https://code.claude.com/docs/en/keybindings",
        bindings: cbY(OE6)
    };
    return I6(K, null, 2) + `
`
}
// @from(Ln 447674, Col 4)
NBK = L(() => {
    e8();
    rE8();
    aE8()
})
// @from(Ln 447679, Col 4)
EBK = {}
// @from(Ln 447690, Col 0)
async function rbY() {
    if (!WR()) return {
        type: "text",
        value: "Keybinding customization is disabled in this environment."
    };
    let q = aa(),
        K = !1;
    await lbY(ibY(q), {
        recursive: !0
    });
    try {
        await nbY(q, kBK(), {
            encoding: "utf-8",
            flag: "wx"
        })
    } catch (z) {
        if (Q1(z) === "EEXIST") K = !0;
        else throw z
    }
    let _ = await xS(q);
    if (_.error) return {
        type: "text",
        value: `${K?"Opened":"Created"} ${q}. Could not open in editor: ${_.error}`
    };
    return {
        type: "text",
        value: K ? `Opened ${q} in your editor.` : `Created ${q} with template. Opened in your editor.`
    }
}
// @from(Ln 447719, Col 4)
yBK = L(() => {
    yd();
    NBK();
    m8();
    uS()
})
// @from(Ln 447725, Col 4)
obY
// @from(Ln 447725, Col 9)
LBK
// @from(Ln 447726, Col 4)
hBK = L(() => {
    yd();
    obY = {
        name: "keybindings",
        description: "Open or create your keybindings configuration file",
        isEnabled: () => WR(),
        supportsNonInteractive: !1,
        type: "local",
        load: () => Promise.resolve().then(() => (yBK(), EBK))
    }, LBK = obY
})
// @from(Ln 447737, Col 4)
RBK = () => ({
    type: "local-jsx",
    name: "login",
    get description() {
        return cR1() ? "Switch Anthropic accounts" : "Sign in with your Anthropic account"
    },
    isEnabled: () => !S6(process.env.DISABLE_LOGIN_COMMAND),
    load: () => Promise.resolve().then(() => (pg8(), v$K))
})
// @from(Ln 447746, Col 4)
SBK = L(() => {
    T7();
    Q8()
})
// @from(Ln 447750, Col 4)
CBK
// @from(Ln 447751, Col 4)
bBK = L(() => {
    Q8();
    CBK = {
        type: "local-jsx",
        name: "logout",
        description: "Sign out from your Anthropic account",
        isEnabled: () => !S6(process.env.DISABLE_LOGOUT_COMMAND),
        load: () => Promise.resolve().then(() => (G87(), f9K))
    }
})
// @from(Ln 447762, Col 0)
function sbY(q) {
    if (q.pending) return gT.default.createElement(T, null, "Press ", q.keyName, " again to exit");
    return gT.default.createElement(z1, null, gT.default.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), gT.default.createElement(A8, {
        chord: "space",
        action: "toggle"
    }), gT.default.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), gT.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))
}
// @from(Ln 447784, Col 0)
function IBK(q) {
    let K = s(14),
        {
            onSubmit: _,
            defaultSelections: z
        } = q,
        [Y, A] = gT.useState(!1),
        O;
    if (K[0] !== _) O = (Z) => {
        if (Z.length === 0) {
            A(!0);
            return
        }
        A(!1), _(Z)
    }, K[0] = _, K[1] = O;
    else O = K[1];
    let w = O,
        $;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) $ = () => {
        A(!1)
    }, K[2] = $;
    else $ = K[2];
    let j = $,
        H;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) H = () => {
        A(!0)
    }, K[3] = H;
    else H = K[3];
    let J = H,
        X;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) X = gT.default.createElement(u, null, gT.default.createElement(T, {
        dimColor: !0
    }, "More workflow examples (issue triage, CI fixes, etc.) at:", " ", gT.default.createElement(yq, {
        url: "https://github.com/anthropics/claude-code-action/blob/main/examples/"
    }, "https://github.com/anthropics/claude-code-action/blob/main/examples/"))), K[4] = X;
    else X = K[4];
    let M;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) M = abY.map(tbY), K[5] = M;
    else M = K[5];
    let P;
    if (K[6] !== z || K[7] !== w) P = gT.default.createElement(J36, {
        options: M,
        defaultValue: z,
        onSubmit: w,
        onChange: j,
        onCancel: J,
        hideIndexes: !0
    }), K[6] = z, K[7] = w, K[8] = P;
    else P = K[8];
    let W;
    if (K[9] !== Y) W = Y && gT.default.createElement(u, null, gT.default.createElement(T, {
        color: "error"
    }, "You must select at least one workflow to continue")), K[9] = Y, K[10] = W;
    else W = K[10];
    let D;
    if (K[11] !== P || K[12] !== W) D = gT.default.createElement(R1, {
        title: "Select GitHub workflows to install",
        subtitle: "We'll create a workflow file in your repository for each one you select.",
        onCancel: J,
        inputGuide: sbY
    }, X, P, W), K[11] = P, K[12] = W, K[13] = D;
    else D = K[13];
    return D
}
// @from(Ln 447849, Col 0)
function tbY(q) {
    return {
        label: q.label,
        value: q.value
    }
}
// @from(Ln 447855, Col 4)
gT
// @from(Ln 447855, Col 8)
abY
// @from(Ln 447856, Col 4)
xBK = L(() => {
    o6();
    g6();
    bK();
    H78();
    Nq();
    S4();
    u7();
    gT = K6(P6(), 1), abY = [{
        value: "claude",
        label: "@Claude Code - Tag @claude in issues and PR comments"
    }, {
        value: "claude-review",
        label: "Claude Code Review - Automated code review on new PRs"
    }]
})
// @from(Ln 447872, Col 4)
uBK = "Add Claude Code GitHub Workflow"
// @from(Ln 447873, Col 4)
Vn = "https://github.com/anthropics/claude-code-action/blob/main/docs/setup.md"
// @from(Ln 447874, Col 4)
mBK = `name: Claude Code

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')))
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
      actions: read # Required for Claude to read CI results on PRs
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}

          # This is an optional setting that allows Claude to read CI results on PRs
          additional_permissions: |
            actions: read

          # Optional: Give a custom prompt to Claude. If this is not specified, Claude will perform the instructions specified in the comment that tagged it.
          # prompt: 'Update the pull request description to include a summary of changes.'

          # Optional: Add claude_args to customize behavior and configuration
          # See https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md
          # or https://code.claude.com/docs/en/cli-reference for available options
          # claude_args: '--allowed-tools Bash(gh pr *)'

`
// @from(Ln 447925, Col 4)
BBK = `## \uD83E\uDD16 Installing Claude Code GitHub App

This PR adds a GitHub Actions workflow that enables Claude Code integration in our repository.

### What is Claude Code?

[Claude Code](https://claude.com/claude-code) is an AI coding agent that can help with:
- Bug fixes and improvements  
- Documentation updates
- Implementing new features
- Code reviews and suggestions
- Writing tests
- And more!

### How it works

Once this PR is merged, we'll be able to interact with Claude by mentioning @claude in a pull request or issue comment.
Once the workflow is triggered, Claude will analyze the comment and surrounding context, and execute on the request in a GitHub action.

### Important Notes

- **This workflow won't take effect until this PR is merged**
- **@claude mentions won't work until after the merge is complete**
- The workflow runs automatically whenever Claude is mentioned in PR or issue comments
- Claude gets access to the entire PR or issue context including files, diffs, and previous comments

### Security

- Our Anthropic API key is securely stored as a GitHub Actions secret
- Only users with write access to the repository can trigger the workflow
- All Claude runs are stored in the GitHub Actions run history
- Claude's default tools are limited to reading/writing files and interacting with our repo by creating comments, branches, and commits.
- We can add more allowed tools by adding them to the workflow file like:

\`\`\`
allowed_tools: Bash(npm install),Bash(npm run build),Bash(npm run lint),Bash(npm run test)
\`\`\`

There's more information in the [Claude Code action repo](https://github.com/anthropics/claude-code-action).

After merging this PR, let's try mentioning @claude in a comment on any PR to get started!`
// @from(Ln 447966, Col 4)
pBK = `name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]
    # Optional: Only run on specific file changes
    # paths:
    #   - "src/**/*.ts"
    #   - "src/**/*.tsx"
    #   - "src/**/*.js"
    #   - "src/**/*.jsx"

jobs:
  claude-review:
    # Optional: Filter by PR author
    # if: |
    #   github.event.pull_request.user.login == 'external-contributor' ||
    #   github.event.pull_request.user.login == 'new-developer' ||
    #   github.event.pull_request.author_association == 'FIRST_TIME_CONTRIBUTOR'

    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code Review
        id: claude-review
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: 'https://github.com/anthropics/claude-code.git'
          plugins: 'code-review@claude-code-plugins'
          prompt: '/code-review:code-review \${{ github.repository }}/pull/\${{ github.event.pull_request.number }}'
          # See https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md
          # or https://code.claude.com/docs/en/cli-reference for available options

`
// @from(Ln 448012, Col 0)
function ku(q) {
    let K = s(7),
        {
            children: _,
            subtitle: z
        } = q,
        Y;
    if (K[0] !== _) Y = xP6.createElement(T, {
        bold: !0
    }, _), K[0] = _, K[1] = Y;
    else Y = K[1];
    let A;
    if (K[2] !== z) A = z && xP6.createElement(T, {
        dimColor: !0
    }, z), K[2] = z, K[3] = A;
    else A = K[3];
    let O;
    if (K[4] !== Y || K[5] !== A) O = xP6.createElement(u, {
        flexDirection: "column"
    }, Y, A), K[4] = Y, K[5] = A, K[6] = O;
    else O = K[6];
    return O
}
// @from(Ln 448035, Col 4)
xP6
// @from(Ln 448036, Col 4)
uP6 = L(() => {
    o6();
    g6();
    xP6 = K6(P6(), 1)
})
// @from(Ln 448042, Col 0)
function FBK(q) {
    let K = s(55),
        {
            existingApiKey: _,
            apiKeyOrOAuthToken: z,
            onApiKeyChange: Y,
            onSubmit: A,
            onToggleUseExistingKey: O,
            onCreateOAuthToken: w,
            selectedOption: $,
            onSelectOption: j
        } = q,
        H = $ === void 0 ? _ ? "existing" : w ? "oauth" : "new" : $,
        [J, X] = wW.useState(0),
        M = s1(),
        [P] = Zq(),
        W;
    if (K[0] !== _ || K[1] !== w || K[2] !== j || K[3] !== O || K[4] !== H) W = () => {
        if (H === "new" && w) j?.("oauth");
        else if (H === "oauth" && _) j?.("existing"), O(!0)
    }, K[0] = _, K[1] = w, K[2] = j, K[3] = O, K[4] = H, K[5] = W;
    else W = K[5];
    let D = W,
        Z;
    if (K[6] !== w || K[7] !== j || K[8] !== O || K[9] !== H) Z = () => {
        if (H === "existing") j?.(w ? "oauth" : "new"), O(!1);
        else if (H === "oauth") j?.("new")
    }, K[6] = w, K[7] = j, K[8] = O, K[9] = H, K[10] = Z;
    else Z = K[10];
    let G = Z,
        f;
    if (K[11] !== w || K[12] !== A || K[13] !== H) f = () => {
        if (H === "oauth" && w) w();
        else A()
    }, K[11] = w, K[12] = A, K[13] = H, K[14] = f;
    else f = K[14];
    let v = f,
        V = H === "new",
        k;
    if (K[15] !== v || K[16] !== G || K[17] !== D) k = {
        "confirm:previous": D,
        "confirm:next": G,
        "confirm:yes": v
    }, K[15] = v, K[16] = G, K[17] = D, K[18] = k;
    else k = K[18];
    let N = !V,
        R;
    if (K[19] !== N) R = {
        context: "Confirmation",
        isActive: N
    }, K[19] = N, K[20] = R;
    else R = K[20];
    L7(k, R);
    let h;
    if (K[21] !== G || K[22] !== D) h = {
        "confirm:previous": D,
        "confirm:next": G
    }, K[21] = G, K[22] = D, K[23] = h;
    else h = K[23];
    let C;
    if (K[24] !== V) C = {
        context: "Confirmation",
        isActive: V
    }, K[24] = V, K[25] = C;
    else C = K[25];
    L7(h, C);
    let x;
    if (K[26] === Symbol.for("react.memo_cache_sentinel")) x = wW.default.createElement(u, {
        marginBottom: 1
    }, wW.default.createElement(ku, {
        subtitle: "Choose API key"
    }, "Install GitHub App")), K[26] = x;
    else x = K[26];
    let B;
    if (K[27] !== _ || K[28] !== H || K[29] !== P) B = _ && wW.default.createElement(u, {
        marginBottom: 1
    }, wW.default.createElement(T, null, H === "existing" ? d7("success", P)("> ") : "  ", "Use your existing Claude Code API key")), K[27] = _, K[28] = H, K[29] = P, K[30] = B;
    else B = K[30];
    let m;
    if (K[31] !== w || K[32] !== H || K[33] !== P) m = w && wW.default.createElement(u, {
        marginBottom: 1
    }, wW.default.createElement(T, null, H === "oauth" ? d7("success", P)("> ") : "  ", "Create a long-lived token with your Claude subscription")), K[31] = w, K[32] = H, K[33] = P, K[34] = m;
    else m = K[34];
    let S;
    if (K[35] !== H || K[36] !== P) S = H === "new" ? d7("success", P)("> ") : "  ", K[35] = H, K[36] = P, K[37] = S;
    else S = K[37];
    let F;
    if (K[38] !== S) F = wW.default.createElement(u, {
        marginBottom: 1
    }, wW.default.createElement(T, null, S, "Enter a new API key")), K[38] = S, K[39] = F;
    else F = K[39];
    let U;
    if (K[40] !== z || K[41] !== J || K[42] !== Y || K[43] !== A || K[44] !== H || K[45] !== M) U = H === "new" && wW.default.createElement(l4, {
        value: z,
        onChange: Y,
        onSubmit: A,
        onPaste: Y,
        focus: !0,
        placeholder: "sk-ant… (Create a new key at https://platform.claude.com/settings/keys)",
        mask: "*",
        columns: M.columns,
        cursorOffset: J,
        onChangeCursorOffset: X,
        showCursor: !0
    }), K[40] = z, K[41] = J, K[42] = Y, K[43] = A, K[44] = H, K[45] = M, K[46] = U;
    else U = K[46];
    let g;
    if (K[47] !== B || K[48] !== m || K[49] !== F || K[50] !== U) g = wW.default.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, x, B, m, F, U), K[47] = B, K[48] = m, K[49] = F, K[50] = U, K[51] = g;
    else g = K[51];
    let c;
    if (K[52] === Symbol.for("react.memo_cache_sentinel")) c = wW.default.createElement(u, {
        marginLeft: 3
    }, wW.default.createElement(T, {
        dimColor: !0
    }, wW.default.createElement(z1, null, wW.default.createElement(A8, {
        chord: ["up", "down"],
        action: "select"
    }), wW.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    })))), K[52] = c;
    else c = K[52];
    let n;
    if (K[53] !== g) n = wW.default.createElement(wW.default.Fragment, null, g, c), K[53] = g, K[54] = n;
    else n = K[54];
    return n
}
// @from(Ln 448173, Col 4)
wW
// @from(Ln 448174, Col 4)
gBK = L(() => {
    o6();
    Nq();
    uP6();
    u7();
    NY();
    I4();
    g6();
    C7();
    wW = K6(P6(), 1)
})
// @from(Ln 448186, Col 0)
function UBK(q) {
    let K = s(42),
        {
            useExistingSecret: _,
            secretName: z,
            onToggleUseExistingSecret: Y,
            onSecretNameChange: A,
            onSubmit: O
        } = q,
        [w, $] = n$.useState(0),
        j = s1(),
        [H] = Zq(),
        J;
    if (K[0] !== Y) J = () => Y(!0), K[0] = Y, K[1] = J;
    else J = K[1];
    let X = J,
        M;
    if (K[2] !== Y) M = () => Y(!1), K[2] = Y, K[3] = M;
    else M = K[3];
    let P = M,
        W;
    if (K[4] !== P || K[5] !== X || K[6] !== O) W = {
        "confirm:previous": X,
        "confirm:next": P,
        "confirm:yes": O
    }, K[4] = P, K[5] = X, K[6] = O, K[7] = W;
    else W = K[7];
    let D;
    if (K[8] !== _) D = {
        context: "Confirmation",
        isActive: _
    }, K[8] = _, K[9] = D;
    else D = K[9];
    L7(W, D);
    let Z;
    if (K[10] !== P || K[11] !== X) Z = {
        "confirm:previous": X,
        "confirm:next": P
    }, K[10] = P, K[11] = X, K[12] = Z;
    else Z = K[12];
    let G = !_,
        f;
    if (K[13] !== G) f = {
        context: "Confirmation",
        isActive: G
    }, K[13] = G, K[14] = f;
    else f = K[14];
    L7(Z, f);
    let v;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) v = n$.default.createElement(u, {
        marginBottom: 1
    }, n$.default.createElement(ku, {
        subtitle: "Setup API key secret"
    }, "Install GitHub App")), K[15] = v;
    else v = K[15];
    let V;
    if (K[16] === Symbol.for("react.memo_cache_sentinel")) V = n$.default.createElement(u, {
        marginBottom: 1
    }, n$.default.createElement(T, {
        color: "warning"
    }, "ANTHROPIC_API_KEY already exists in repository secrets!")), K[16] = V;
    else V = K[16];
    let k;
    if (K[17] === Symbol.for("react.memo_cache_sentinel")) k = n$.default.createElement(u, {
        marginBottom: 1
    }, n$.default.createElement(T, null, "Would you like to:")), K[17] = k;
    else k = K[17];
    let N;
    if (K[18] !== H || K[19] !== _) N = _ ? d7("success", H)("> ") : "  ", K[18] = H, K[19] = _, K[20] = N;
    else N = K[20];
    let R;
    if (K[21] !== N) R = n$.default.createElement(u, {
        marginBottom: 1
    }, n$.default.createElement(T, null, N, "Use the existing API key")), K[21] = N, K[22] = R;
    else R = K[22];
    let h;
    if (K[23] !== H || K[24] !== _) h = !_ ? d7("success", H)("> ") : "  ", K[23] = H, K[24] = _, K[25] = h;
    else h = K[25];
    let C;
    if (K[26] !== h) C = n$.default.createElement(u, {
        marginBottom: 1
    }, n$.default.createElement(T, null, h, "Create a new secret with a different name")), K[26] = h, K[27] = C;
    else C = K[27];
    let x;
    if (K[28] !== w || K[29] !== A || K[30] !== O || K[31] !== z || K[32] !== j || K[33] !== _) x = !_ && n$.default.createElement(n$.default.Fragment, null, n$.default.createElement(u, {
        marginBottom: 1
    }, n$.default.createElement(T, null, "Enter new secret name (alphanumeric with underscores):")), n$.default.createElement(l4, {
        value: z,
        onChange: A,
        onSubmit: O,
        focus: !0,
        placeholder: "e.g., CLAUDE_API_KEY",
        columns: j.columns,
        cursorOffset: w,
        onChangeCursorOffset: $,
        showCursor: !0
    })), K[28] = w, K[29] = A, K[30] = O, K[31] = z, K[32] = j, K[33] = _, K[34] = x;
    else x = K[34];
    let B;
    if (K[35] !== R || K[36] !== C || K[37] !== x) B = n$.default.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, v, V, k, R, C, x), K[35] = R, K[36] = C, K[37] = x, K[38] = B;
    else B = K[38];
    let m;
    if (K[39] === Symbol.for("react.memo_cache_sentinel")) m = n$.default.createElement(u, {
        marginLeft: 3
    }, n$.default.createElement(T, {
        dimColor: !0
    }, n$.default.createElement(z1, null, n$.default.createElement(A8, {
        chord: ["up", "down"],
        action: "select"
    }), n$.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    })))), K[39] = m;
    else m = K[39];
    let S;
    if (K[40] !== B) S = n$.default.createElement(n$.default.Fragment, null, B, m), K[40] = B, K[41] = S;
    else S = K[41];
    return S
}
// @from(Ln 448309, Col 4)
n$
// @from(Ln 448310, Col 4)
QBK = L(() => {
    o6();
    Nq();
    uP6();
    u7();
    NY();
    I4();
    g6();
    C7();
    n$ = K6(P6(), 1)
})
// @from(Ln 448322, Col 0)
function cBK() {
    let q = s(1),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = dBK.default.createElement(T, null, "Checking GitHub CLI installation…"), q[0] = K;
    else K = q[0];
    return K
}
// @from(Ln 448329, Col 4)
dBK
// @from(Ln 448330, Col 4)
lBK = L(() => {
    o6();
    g6();
    dBK = K6(P6(), 1)
})
// @from(Ln 448336, Col 0)
function nBK(q) {
    let K = s(52),
        {
            currentRepo: _,
            useCurrentRepo: z,
            repoUrl: Y,
            onRepoUrlChange: A,
            onSubmit: O,
            onToggleUseCurrentRepo: w
        } = q,
        [$, j] = mX.useState(0),
        [H, J] = mX.useState(!1),
        M = s1().columns,
        P;
    if (K[0] !== _ || K[1] !== O || K[2] !== Y || K[3] !== z) P = () => {
        if (!(z ? _ : Y)?.trim()) {
            J(!0);
            return
        }
        O()
    }, K[0] = _, K[1] = O, K[2] = Y, K[3] = z, K[4] = P;
    else P = K[4];
    let W = P,
        D = !z || !_,
        Z;
    if (K[5] !== w) Z = () => {
        w(!0), J(!1)
    }, K[5] = w, K[6] = Z;
    else Z = K[6];
    let G = Z,
        f;
    if (K[7] !== w) f = () => {
        w(!1), J(!1)
    }, K[7] = w, K[8] = f;
    else f = K[8];
    let v = f,
        V;
    if (K[9] !== v || K[10] !== G || K[11] !== W) V = {
        "confirm:previous": G,
        "confirm:next": v,
        "confirm:yes": W
    }, K[9] = v, K[10] = G, K[11] = W, K[12] = V;
    else V = K[12];
    let k = !D,
        N;
    if (K[13] !== k) N = {
        context: "Confirmation",
        isActive: k
    }, K[13] = k, K[14] = N;
    else N = K[14];
    L7(V, N);
    let R;
    if (K[15] !== v || K[16] !== G) R = {
        "confirm:previous": G,
        "confirm:next": v
    }, K[15] = v, K[16] = G, K[17] = R;
    else R = K[17];
    let h;
    if (K[18] !== D) h = {
        context: "Confirmation",
        isActive: D
    }, K[18] = D, K[19] = h;
    else h = K[19];
    L7(R, h);
    let C;
    if (K[20] === Symbol.for("react.memo_cache_sentinel")) C = mX.default.createElement(u, {
        marginBottom: 1
    }, mX.default.createElement(ku, {
        subtitle: "Select GitHub repository"
    }, "Install GitHub App")), K[20] = C;
    else C = K[20];
    let x;
    if (K[21] !== _ || K[22] !== z) x = _ && mX.default.createElement(u, {
        marginBottom: 1
    }, mX.default.createElement(T, {
        bold: z,
        color: z ? "permission" : void 0
    }, z ? "> " : "  ", "Use current repository: ", _)), K[21] = _, K[22] = z, K[23] = x;
    else x = K[23];
    let B = !z || !_,
        m = !z || !_ ? "permission" : void 0,
        S = !z || !_ ? "> " : "  ",
        F = _ ? "Enter a different repository" : "Enter repository",
        U;
    if (K[24] !== B || K[25] !== m || K[26] !== S || K[27] !== F) U = mX.default.createElement(u, {
        marginBottom: 1
    }, mX.default.createElement(T, {
        bold: B,
        color: m
    }, S, F)), K[24] = B, K[25] = m, K[26] = S, K[27] = F, K[28] = U;
    else U = K[28];
    let g;
    if (K[29] !== _ || K[30] !== $ || K[31] !== W || K[32] !== A || K[33] !== Y || K[34] !== M || K[35] !== z) g = (!z || !_) && mX.default.createElement(u, {
        marginLeft: 2,
        marginBottom: 1
    }, mX.default.createElement(l4, {
        value: Y,
        onChange: (i) => {
            A(i), J(!1)
        },
        onSubmit: W,
        focus: !0,
        placeholder: "Enter a repo as owner/repo or https://github.com/owner/repo…",
        columns: M,
        cursorOffset: $,
        onChangeCursorOffset: j,
        showCursor: !0
    })), K[29] = _, K[30] = $, K[31] = W, K[32] = A, K[33] = Y, K[34] = M, K[35] = z, K[36] = g;
    else g = K[36];
    let c;
    if (K[37] !== x || K[38] !== U || K[39] !== g) c = mX.default.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, C, x, U, g), K[37] = x, K[38] = U, K[39] = g, K[40] = c;
    else c = K[40];
    let n;
    if (K[41] !== H) n = H && mX.default.createElement(u, {
        marginLeft: 3,
        marginBottom: 1
    }, mX.default.createElement(T, {
        color: "error"
    }, "Please enter a repository name to continue")), K[41] = H, K[42] = n;
    else n = K[42];
    let l;
    if (K[43] !== _) l = _ ? mX.default.createElement(A8, {
        chord: ["up", "down"],
        action: "select"
    }) : null, K[43] = _, K[44] = l;
    else l = K[44];
    let z6;
    if (K[45] === Symbol.for("react.memo_cache_sentinel")) z6 = mX.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), K[45] = z6;
    else z6 = K[45];
    let A6;
    if (K[46] !== l) A6 = mX.default.createElement(u, {
        marginLeft: 3
    }, mX.default.createElement(T, {
        dimColor: !0
    }, mX.default.createElement(z1, null, l, z6))), K[46] = l, K[47] = A6;
    else A6 = K[47];
    let e;
    if (K[48] !== c || K[49] !== n || K[50] !== A6) e = mX.default.createElement(mX.default.Fragment, null, c, n, A6), K[48] = c, K[49] = n, K[50] = A6, K[51] = e;
    else e = K[51];
    return e
}
// @from(Ln 448484, Col 4)
mX
// @from(Ln 448485, Col 4)
iBK = L(() => {
    o6();
    Nq();
    uP6();
    u7();
    NY();
    I4();
    g6();
    C7();
    mX = K6(P6(), 1)
})
// @from(Ln 448497, Col 0)
function rBK(q) {
    let K = s(10),
        {
            currentWorkflowInstallStep: _,
            secretExists: z,
            useExistingSecret: Y,
            secretName: A,
            skipWorkflow: O,
            selectedWorkflows: w
        } = q,
        $ = O === void 0 ? !1 : O,
        j;
    if (K[0] !== z || K[1] !== A || K[2] !== w || K[3] !== $ || K[4] !== Y) j = $ ? ["Getting repository information", z && Y ? "Using existing API key secret" : `Setting up ${A} secret`] : ["Getting repository information", "Creating branch", w.length > 1 ? "Creating workflow files" : "Creating workflow file", z && Y ? "Using existing API key secret" : `Setting up ${A} secret`, "Opening pull request page"], K[0] = z, K[1] = A, K[2] = w, K[3] = $, K[4] = Y, K[5] = j;
    else j = K[5];
    let H = j,
        J;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) J = x_6.default.createElement(u, {
        marginBottom: 1
    }, x_6.default.createElement(ku, {
        subtitle: "Create GitHub Actions workflow"
    }, "Install GitHub App")), K[6] = J;
    else J = K[6];
    let X;
    if (K[7] !== _ || K[8] !== H) X = x_6.default.createElement(x_6.default.Fragment, null, x_6.default.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, J, H.map((M, P) => {
        let W = "pending";
        if (P < _) W = "completed";
        else if (P === _) W = "in-progress";
        return x_6.default.createElement(u, {
            key: P
        }, x_6.default.createElement(T, {
            color: W === "completed" ? "success" : W === "in-progress" ? "warning" : void 0
        }, W === "completed" ? "✓ " : "", M, W === "in-progress" ? "…" : ""))
    }))), K[7] = _, K[8] = H, K[9] = X;
    else X = K[9];
    return X
}
// @from(Ln 448537, Col 4)
x_6
// @from(Ln 448538, Col 4)
oBK = L(() => {
    o6();
    uP6();
    g6();
    x_6 = K6(P6(), 1)
})
// @from(Ln 448545, Col 0)
function aBK(q) {
    let K = s(15),
        {
            error: _,
            errorReason: z,
            errorInstructions: Y
        } = q,
        A;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) A = Z0.default.createElement(u, {
        marginBottom: 1
    }, Z0.default.createElement(ku, null, "Install GitHub App")), K[0] = A;
    else A = K[0];
    let O;
    if (K[1] !== _) O = Z0.default.createElement(T, {
        color: "error"
    }, "Error: ", _), K[1] = _, K[2] = O;
    else O = K[2];
    let w;
    if (K[3] !== z) w = z && Z0.default.createElement(u, {
        marginTop: 1
    }, Z0.default.createElement(T, {
        dimColor: !0
    }, "Reason: ", z)), K[3] = z, K[4] = w;
    else w = K[4];
    let $;
    if (K[5] !== Y) $ = Y && Y.length > 0 && Z0.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, Z0.default.createElement(T, {
        dimColor: !0
    }, "How to fix:"), Y.map(ebY)), K[5] = Y, K[6] = $;
    else $ = K[6];
    let j;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) j = Z0.default.createElement(u, {
        marginTop: 1
    }, Z0.default.createElement(T, {
        dimColor: !0
    }, "For manual setup instructions, see:", " ", Z0.default.createElement(T, {
        color: "claude"
    }, Vn))), K[7] = j;
    else j = K[7];
    let H;
    if (K[8] !== O || K[9] !== w || K[10] !== $) H = Z0.default.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, A, O, w, $, j), K[8] = O, K[9] = w, K[10] = $, K[11] = H;
    else H = K[11];
    let J;
    if (K[12] === Symbol.for("react.memo_cache_sentinel")) J = Z0.default.createElement(u, {
        marginLeft: 3
    }, Z0.default.createElement(T, {
        dimColor: !0
    }, "Press any key to exit")), K[12] = J;
    else J = K[12];
    let X;
    if (K[13] !== H) X = Z0.default.createElement(Z0.default.Fragment, null, H, J), K[13] = H, K[14] = X;
    else X = K[14];
    return X
}
// @from(Ln 448606, Col 0)
function ebY(q, K) {
    return Z0.default.createElement(u, {
        key: K,
        marginLeft: 2
    }, Z0.default.createElement(T, {
        dimColor: !0
    }, "• "), Z0.default.createElement(T, null, q))
}
// @from(Ln 448614, Col 4)
Z0
// @from(Ln 448615, Col 4)
sBK = L(() => {
    o6();
    uP6();
    g6();
    Z0 = K6(P6(), 1)
})
// @from(Ln 448622, Col 0)
function tBK(q) {
    let K = s(16),
        {
            repoName: _,
            onSelectAction: z
        } = q,
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = [{
        label: "Update workflow file with latest version",
        value: "update"
    }, {
        label: "Skip workflow update (configure secrets only)",
        value: "skip"
    }, {
        label: "Exit without making changes",
        value: "exit"
    }], K[0] = Y;
    else Y = K[0];
    let A = Y,
        O;
    if (K[1] !== z) O = (D) => {
        z(D)
    }, K[1] = z, K[2] = O;
    else O = K[2];
    let w = O,
        $;
    if (K[3] !== z) $ = () => {
        z("exit")
    }, K[3] = z, K[4] = $;
    else $ = K[4];
    let j = $,
        H;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) H = PL.default.createElement(T, {
        bold: !0
    }, "Existing Workflow Found"), K[5] = H;
    else H = K[5];
    let J;
    if (K[6] !== _) J = PL.default.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, H, PL.default.createElement(T, {
        dimColor: !0
    }, "Repository: ", _)), K[6] = _, K[7] = J;
    else J = K[7];
    let X;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) X = PL.default.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, PL.default.createElement(T, null, "A Claude workflow file already exists at", " ", PL.default.createElement(T, {
        color: "claude"
    }, ".github/workflows/claude.yml")), PL.default.createElement(T, {
        dimColor: !0
    }, "What would you like to do?")), K[8] = X;
    else X = K[8];
    let M;
    if (K[9] !== j || K[10] !== w) M = PL.default.createElement(u, {
        flexDirection: "column"
    }, PL.default.createElement(A1, {
        options: A,
        onChange: w,
        onCancel: j
    })), K[9] = j, K[10] = w, K[11] = M;
    else M = K[11];
    let P;
    if (K[12] === Symbol.for("react.memo_cache_sentinel")) P = PL.default.createElement(u, {
        marginTop: 1
    }, PL.default.createElement(T, {
        dimColor: !0
    }, "View the latest workflow template at:", " ", PL.default.createElement(T, {
        color: "claude"
    }, "https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml"))), K[12] = P;
    else P = K[12];
    let W;
    if (K[13] !== J || K[14] !== M) W = PL.default.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, J, X, M, P), K[13] = J, K[14] = M, K[15] = W;
    else W = K[15];
    return W
}
// @from(Ln 448704, Col 4)
PL
// @from(Ln 448705, Col 4)
eBK = L(() => {
    o6();
    g_();
    g6();
    PL = K6(P6(), 1)
})
// @from(Ln 448712, Col 0)
function qpK(q) {
    let K = s(12),
        {
            repoUrl: _,
            onSubmit: z
        } = q,
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = {
        context: "Confirmation"
    }, K[0] = Y;
    else Y = K[0];
    G1("confirm:yes", z, Y);
    let A;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) A = $W.default.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, $W.default.createElement(T, {
        bold: !0
    }, "Install the Claude GitHub App")), K[1] = A;
    else A = K[1];
    let O;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) O = $W.default.createElement(u, {
        marginBottom: 1
    }, $W.default.createElement(T, null, "Opening browser to install the Claude GitHub App…")), K[2] = O;
    else O = K[2];
    let w;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) w = $W.default.createElement(u, {
        marginBottom: 1
    }, $W.default.createElement(T, null, "If your browser doesn't open automatically, visit:")), K[3] = w;
    else w = K[3];
    let $;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) $ = $W.default.createElement(u, {
        marginBottom: 1
    }, $W.default.createElement(T, {
        underline: !0
    }, "https://github.com/apps/claude")), K[4] = $;
    else $ = K[4];
    let j;
    if (K[5] !== _) j = $W.default.createElement(u, {
        marginBottom: 1
    }, $W.default.createElement(T, null, "Please install the app for repository: ", $W.default.createElement(T, {
        bold: !0
    }, _))), K[5] = _, K[6] = j;
    else j = K[6];
    let H;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) H = $W.default.createElement(u, {
        marginBottom: 1
    }, $W.default.createElement(T, {
        dimColor: !0
    }, "Important: Make sure to grant access to this specific repository")), K[7] = H;
    else H = K[7];
    let J;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) J = $W.default.createElement(u, null, $W.default.createElement(T, {
        bold: !0,
        color: "permission"
    }, "Press Enter once you've installed the app", e6.ellipsis)), K[8] = J;
    else J = K[8];
    let X;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) X = $W.default.createElement(u, {
        marginTop: 1
    }, $W.default.createElement(T, {
        dimColor: !0
    }, "Having trouble? See manual setup instructions at:", " ", $W.default.createElement(T, {
        color: "claude"
    }, Vn))), K[9] = X;
    else X = K[9];
    let M;
    if (K[10] !== j) M = $W.default.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, A, O, w, $, j, H, J, X), K[10] = j, K[11] = M;
    else M = K[11];
    return M
}
// @from(Ln 448788, Col 4)
$W
// @from(Ln 448789, Col 4)
KpK = L(() => {
    o6();
    Qq();
    g6();
    C7();
    $W = K6(P6(), 1)
})
// @from(Ln 448797, Col 0)
function zpK({
    onSuccess: q,
    onCancel: K
}) {
    let [_, z] = X5.useState({
        state: "starting"
    }), [Y] = X5.useState(() => new Et), [A, O] = X5.useState(""), [w, $] = X5.useState(0), [j, H] = X5.useState(!1), [J, X] = X5.useState(!1), M = X5.useRef(new Set), P = X5.useRef(void 0), W = s1(), D = Math.max(50, W.columns - _pK.length - 4);

    function Z(v) {
        if (_.state !== "error") return;
        if (v.preventDefault(), v.key === "return" && _.toRetry) O(""), $(0), z({
            state: "about_to_retry",
            nextState: _.toRetry
        });
        else K()
    }
    async function G(v, V) {
        try {
            let [k, N] = v.split("#");
            if (!k || !N) {
                z({
                    state: "error",
                    message: "Invalid code. Please make sure the full code was copied",
                    toRetry: {
                        state: "waiting_for_login",
                        url: V
                    }
                });
                return
            }
            d("tengu_oauth_manual_entry", {}), Y.handleManualAuthCodeInput({
                authorizationCode: k,
                state: N
            })
        } catch (k) {
            j6(k), z({
                state: "error",
                message: b6(k),
                toRetry: {
                    state: "waiting_for_login",
                    url: V
                }
            })
        }
    }
    let f = X5.useCallback(async () => {
        M.current.forEach((v) => clearTimeout(v)), M.current.clear();
        try {
            let v = await Y.startOAuthFlow(async (k) => {
                z({
                    state: "waiting_for_login",
                    url: k
                });
                let N = setTimeout(H, 3000, !0);
                M.current.add(N)
            }, {
                loginWithClaudeAi: !0,
                inferenceOnly: !0,
                expiresIn: 31536000
            });
            z({
                state: "processing"
            }), yk6(v);
            let V = setTimeout((k, N, R, h) => {
                k({
                    state: "success",
                    token: N
                });
                let C = setTimeout(R, 1000, N);
                h.current.add(C)
            }, 100, z, v.accessToken, q, M);
            M.current.add(V)
        } catch (v) {
            let V = b6(v);
            z({
                state: "error",
                message: V,
                toRetry: {
                    state: "starting"
                }
            }), j6(v), d("tengu_oauth_error", {
                error: V
            })
        }
    }, [Y, q]);
    return X5.useEffect(() => {
        if (_.state === "starting") f()
    }, [_.state, f]), X5.useEffect(() => {
        if (_.state === "about_to_retry") {
            let v = setTimeout((V, k, N) => {
                k(V.state === "waiting_for_login"), N(V)
            }, 500, _.nextState, H, z);
            M.current.add(v)
        }
    }, [_]), X5.useEffect(() => {
        if (A === "c" && _.state === "waiting_for_login" && j && !J) hP(_.url).then((v) => {
            if (v) process.stdout.write(v);
            X(!0), clearTimeout(P.current), P.current = setTimeout(X, 2000, !1)
        }), O("")
    }, [A, _, j, J]), X5.useEffect(() => {
        let v = M.current;
        return () => {
            Y.cleanup(), v.forEach((V) => clearTimeout(V)), v.clear(), clearTimeout(P.current)
        }
    }, [Y]), X5.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: Z
    }, _.state === "starting" && X5.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        paddingBottom: 1
    }, X5.default.createElement(T, {
        bold: !0
    }, "Create Authentication Token"), X5.default.createElement(T, {
        dimColor: !0
    }, "Creating a long-lived token for GitHub Actions")), _.state !== "success" && _.state !== "starting" && _.state !== "processing" && X5.default.createElement(u, {
        key: "header",
        flexDirection: "column",
        gap: 1,
        paddingBottom: 1
    }, X5.default.createElement(T, {
        bold: !0
    }, "Create Authentication Token"), X5.default.createElement(T, {
        dimColor: !0
    }, "Creating a long-lived token for GitHub Actions")), _.state === "waiting_for_login" && j && X5.default.createElement(u, {
        flexDirection: "column",
        key: "urlToCopy",
        gap: 1,
        paddingBottom: 1
    }, X5.default.createElement(u, {
        paddingX: 1
    }, X5.default.createElement(T, {
        dimColor: !0
    }, "Browser didn't open? Use the url below to sign in", " "), J ? X5.default.createElement(T, {
        color: "success"
    }, "(Copied!)") : X5.default.createElement(T, {
        dimColor: !0
    }, X5.default.createElement(A8, {
        chord: "c",
        action: "copy",
        parens: !0
    }))), X5.default.createElement(yq, {
        url: _.url
    }, X5.default.createElement(T, {
        dimColor: !0
    }, _.url))), X5.default.createElement(u, {
        paddingLeft: 1,
        flexDirection: "column",
        gap: 1
    }, X5.default.createElement(qIY, {
        oauthStatus: _,
        showPastePrompt: j,
        pastedCode: A,
        setPastedCode: O,
        cursorOffset: w,
        setCursorOffset: $,
        textInputColumns: D,
        onSubmitCode: G
    })))
}
// @from(Ln 448961, Col 0)
function qIY(q) {
    let K = s(25),
        {
            oauthStatus: _,
            showPastePrompt: z,
            pastedCode: Y,
            setPastedCode: A,
            cursorOffset: O,
            setCursorOffset: w,
            textInputColumns: $,
            onSubmitCode: j
        } = q;
    switch (_.state) {
        case "starting": {
            let H;
            if (K[0] === Symbol.for("react.memo_cache_sentinel")) H = X5.default.createElement(u, null, X5.default.createElement(Y5, null), X5.default.createElement(T, null, "Starting authentication…")), K[0] = H;
            else H = K[0];
            return H
        }
        case "waiting_for_login": {
            let H;
            if (K[1] !== z) H = !z && X5.default.createElement(u, null, X5.default.createElement(Y5, null), X5.default.createElement(T, null, "Opening browser to sign in with your Claude account…")), K[1] = z, K[2] = H;
            else H = K[2];
            let J;
            if (K[3] !== O || K[4] !== _.url || K[5] !== j || K[6] !== Y || K[7] !== w || K[8] !== A || K[9] !== z || K[10] !== $) J = z && X5.default.createElement(u, null, X5.default.createElement(T, null, _pK), X5.default.createElement(l4, {
                value: Y,
                onChange: A,
                onSubmit: (M) => j(M, _.url),
                cursorOffset: O,
                onChangeCursorOffset: w,
                columns: $
            })), K[3] = O, K[4] = _.url, K[5] = j, K[6] = Y, K[7] = w, K[8] = A, K[9] = z, K[10] = $, K[11] = J;
            else J = K[11];
            let X;
            if (K[12] !== H || K[13] !== J) X = X5.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, H, J), K[12] = H, K[13] = J, K[14] = X;
            else X = K[14];
            return X
        }
        case "processing": {
            let H;
            if (K[15] === Symbol.for("react.memo_cache_sentinel")) H = X5.default.createElement(u, null, X5.default.createElement(Y5, null), X5.default.createElement(T, null, "Processing authentication…")), K[15] = H;
            else H = K[15];
            return H
        }
        case "success": {
            let H;
            if (K[16] === Symbol.for("react.memo_cache_sentinel")) H = X5.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, X5.default.createElement(T, {
                color: "success"
            }, "✓ Authentication token created successfully!"), X5.default.createElement(T, {
                dimColor: !0
            }, "Using token for GitHub Actions setup…")), K[16] = H;
            else H = K[16];
            return H
        }
        case "error": {
            let H;
            if (K[17] !== _.message) H = X5.default.createElement(T, {
                color: "error"
            }, "OAuth error: ", _.message), K[17] = _.message, K[18] = H;
            else H = K[18];
            let J;
            if (K[19] !== _.toRetry) J = _.toRetry ? X5.default.createElement(T, {
                dimColor: !0
            }, "Press Enter to try again, or any other key to cancel") : X5.default.createElement(T, {
                dimColor: !0
            }, "Press any key to return to API key selection"), K[19] = _.toRetry, K[20] = J;
            else J = K[20];
            let X;
            if (K[21] !== H || K[22] !== J) X = X5.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, H, J), K[21] = H, K[22] = J, K[23] = X;
            else X = K[23];
            return X
        }
        case "about_to_retry": {
            let H;
            if (K[24] === Symbol.for("react.memo_cache_sentinel")) H = X5.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, X5.default.createElement(T, {
                color: "permission"
            }, "Retrying…")), K[24] = H;
            else H = K[24];
            return H
        }
        default:
            return null
    }
}
// @from(Ln 449057, Col 4)
X5
// @from(Ln 449057, Col 8)
_pK = "Paste code here if prompted > "
// @from(Ln 449058, Col 4)
YpK = L(() => {
    o6();
    C8();
    u7();
    Ej();
    NY();
    I4();
    HX();
    g6();
    Fq8();
    T7();
    m8();
    U8();
    X5 = K6(P6(), 1)
})
// @from(Ln 449074, Col 0)
function ApK(q) {
    let K = s(21),
        {
            secretExists: _,
            useExistingSecret: z,
            secretName: Y,
            skipWorkflow: A
        } = q,
        O = A === void 0 ? !1 : A,
        w;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = Z2.default.createElement(u, {
        marginBottom: 1
    }, Z2.default.createElement(ku, {
        subtitle: "Success"
    }, "Install GitHub App")), K[0] = w;
    else w = K[0];
    let $;
    if (K[1] !== O) $ = !O && Z2.default.createElement(T, {
        color: "success"
    }, Z2.default.createElement(D4, {
        status: "success",
        withSpace: !0
    }), "GitHub Actions workflow created!"), K[1] = O, K[2] = $;
    else $ = K[2];
    let j;
    if (K[3] !== _ || K[4] !== z) j = _ && z && Z2.default.createElement(u, {
        marginTop: 1
    }, Z2.default.createElement(T, {
        color: "success"
    }, Z2.default.createElement(D4, {
        status: "success",
        withSpace: !0
    }), "Using existing ANTHROPIC_API_KEY secret")), K[3] = _, K[4] = z, K[5] = j;
    else j = K[5];
    let H;
    if (K[6] !== _ || K[7] !== Y || K[8] !== z) H = (!_ || !z) && Z2.default.createElement(u, {
        marginTop: 1
    }, Z2.default.createElement(T, {
        color: "success"
    }, Z2.default.createElement(D4, {
        status: "success",
        withSpace: !0
    }), "API key saved as ", Y, " secret")), K[6] = _, K[7] = Y, K[8] = z, K[9] = H;
    else H = K[9];
    let J;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) J = Z2.default.createElement(u, {
        marginTop: 1
    }, Z2.default.createElement(T, null, "Next steps:")), K[10] = J;
    else J = K[10];
    let X;
    if (K[11] !== O) X = O ? Z2.default.createElement(Z2.default.Fragment, null, Z2.default.createElement(T, null, "1. Install the Claude GitHub App if you haven't already"), Z2.default.createElement(T, null, "2. Your workflow file was kept unchanged"), Z2.default.createElement(T, null, "3. API key is configured and ready to use")) : Z2.default.createElement(Z2.default.Fragment, null, Z2.default.createElement(T, null, "1. A pre-filled PR page has been created"), Z2.default.createElement(T, null, "2. Install the Claude GitHub App if you haven't already"), Z2.default.createElement(T, null, "3. Merge the PR to enable Claude PR assistance")), K[11] = O, K[12] = X;
    else X = K[12];
    let M;
    if (K[13] !== $ || K[14] !== j || K[15] !== H || K[16] !== X) M = Z2.default.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, w, $, j, H, J, X), K[13] = $, K[14] = j, K[15] = H, K[16] = X, K[17] = M;
    else M = K[17];
    let P;
    if (K[18] === Symbol.for("react.memo_cache_sentinel")) P = Z2.default.createElement(u, {
        marginLeft: 3
    }, Z2.default.createElement(T, {
        dimColor: !0
    }, "Press any key to exit")), K[18] = P;
    else P = K[18];
    let W;
    if (K[19] !== M) W = Z2.default.createElement(Z2.default.Fragment, null, M, P), K[19] = M, K[20] = W;
    else W = K[20];
    return W
}
// @from(Ln 449145, Col 4)
Z2
// @from(Ln 449146, Col 4)
OpK = L(() => {
    o6();
    uP6();
    Y2();
    g6();
    Z2 = K6(P6(), 1)
})
// @from(Ln 449153, Col 0)
async function KIY(q, K, _, z, Y, A, O) {
    let w = await w1("gh", ["api", `repos/${q}/contents/${_}`, "--jq", ".sha"]),
        $ = null;
    if (w.code === 0) $ = w.stdout.trim();
    let j = z;
    if (Y === "CLAUDE_CODE_OAUTH_TOKEN") j = z.replace(/anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/g, "claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}");
    else if (Y !== "ANTHROPIC_API_KEY") j = z.replace(/anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/g, `anthropic_api_key: \${{ secrets.${Y} }}`);
    let H = Buffer.from(j).toString("base64"),
        J = ["api", "--method", "PUT", `repos/${q}/contents/${_}`, "-f", `message=${$?`"Update ${A}"`:`"${A}"`}`, "-f", `content=${H}`, "-f", `branch=${K}`];
    if ($) J.push("-f", `sha=${$}`);
    let X = await w1("gh", J);
    if (X.code !== 0) {
        if (X.stderr.includes("422") && X.stderr.includes("sha")) throw d("tengu_setup_github_actions_failed", {
            reason: "failed_to_create_workflow_file",
            exit_code: X.code,
            ...O
        }), Error(`Failed to create workflow file ${_}: A Claude workflow file already exists in this repository. Please remove it first or update it manually.`);
        d("tengu_setup_github_actions_failed", {
            reason: "failed_to_create_workflow_file",
            exit_code: X.code,
            ...O
        });
        let M = `

Need help? Common issues:
` + `· Permission denied → Run: gh auth refresh -h github.com -s repo,workflow
` + `· Not authorized → Ensure you have admin access to the repository
` + "· For manual setup → Visit: https://github.com/anthropics/claude-code-action";
        throw Error(`Failed to create workflow file ${_}: ${X.stderr}${M}`)
    }
}
// @from(Ln 449184, Col 0)
async function wpK(q, K, _, z, Y = !1, A, O, w) {
    try {
        d("tengu_setup_github_actions_started", {
            skip_workflow: Y,
            has_api_key: !!K,
            using_default_secret_name: _ === "ANTHROPIC_API_KEY",
            selected_claude_workflow: A.includes("claude"),
            selected_claude_review_workflow: A.includes("claude-review"),
            ...w
        });
        let $ = await w1("gh", ["api", `repos/${q}`, "--jq", ".id"]);
        if ($.code !== 0) throw d("tengu_setup_github_actions_failed", {
            reason: "repo_not_found",
            exit_code: $.code,
            ...w
        }), Error(`Failed to access repository ${q}: ${$.stderr}`);
        let j = await w1("gh", ["api", `repos/${q}`, "--jq", ".default_branch"]);
        if (j.code !== 0) throw d("tengu_setup_github_actions_failed", {
            reason: "failed_to_get_default_branch",
            exit_code: j.code,
            ...w
        }), Error(`Failed to get default branch: ${j.stderr}`);
        let H = j.stdout.trim(),
            J = await w1("gh", ["api", `repos/${q}/git/ref/heads/${H}`, "--jq", ".object.sha"]);
        if (J.code !== 0) throw d("tengu_setup_github_actions_failed", {
            reason: "failed_to_get_branch_sha",
            exit_code: J.code,
            ...w
        }), Error(`Failed to get branch SHA: ${J.stderr}`);
        let X = J.stdout.trim(),
            M = null;
        if (!Y) {
            z(), M = `add-claude-github-actions-${Date.now()}`;
            let P = await w1("gh", ["api", "--method", "POST", `repos/${q}/git/refs`, "-f", `ref=refs/heads/${M}`, "-f", `sha=${X}`]);
            if (P.code !== 0) throw d("tengu_setup_github_actions_failed", {
                reason: "failed_to_create_branch",
                exit_code: P.code,
                ...w
            }), Error(`Failed to create branch: ${P.stderr}`);
            z();
            let W = [];
            if (A.includes("claude")) W.push({
                path: ".github/workflows/claude.yml",
                content: mBK,
                message: "Claude PR Assistant workflow"
            });
            if (A.includes("claude-review")) W.push({
                path: ".github/workflows/claude-code-review.yml",
                content: pBK,
                message: "Claude Code Review workflow"
            });
            for (let D of W) await KIY(q, M, D.path, D.content, _, D.message, w)
        }
        if (z(), K) {
            let P = await w1("gh", ["secret", "set", _, "--body", K, "--repo", q]);
            if (P.code !== 0) {
                d("tengu_setup_github_actions_failed", {
                    reason: "failed_to_set_api_key_secret",
                    exit_code: P.code,
                    ...w
                });
                let W = `

Need help? Common issues:
` + `· Permission denied → Run: gh auth refresh -h github.com -s repo
` + `· Not authorized → Ensure you have admin access to the repository
` + "· For manual setup → Visit: https://github.com/anthropics/claude-code-action";
                throw Error(`Failed to set API key secret: ${P.stderr||"Unknown error"}${W}`)
            }
        }
        if (!Y && M) {
            z();
            let P = `https://github.com/${q}/compare/${H}...${M}?quick_pull=1&title=${encodeURIComponent(uBK)}&body=${encodeURIComponent(BBK)}`;
            await J3(P)
        }
        d("tengu_setup_github_actions_completed", {
            skip_workflow: Y,
            has_api_key: !!K,
            auth_type: O,
            using_default_secret_name: _ === "ANTHROPIC_API_KEY",
            selected_claude_workflow: A.includes("claude"),
            selected_claude_review_workflow: A.includes("claude-review"),
            ...w
        }), d8((P) => ({
            ...P,
            githubActionSetupCount: (P.githubActionSetupCount ?? 0) + 1
        }))
    } catch ($) {
        if (!$ || !($ instanceof Error) || !$.message.includes("Failed to")) d("tengu_setup_github_actions_failed", {
            reason: "unexpected_error",
            ...w
        });
        if ($ instanceof Error) j6($);
        throw $
    }
}
// @from(Ln 449280, Col 4)
$pK = L(() => {
    C8();
    h1();
    Nj();
    Q4();
    U8()
})
// @from(Ln 449288, Col 0)
function jpK(q) {
    let K = s(9),
        {
            warnings: _,
            onContinue: z
        } = q,
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = {
        context: "Confirmation"
    }, K[0] = Y;
    else Y = K[0];
    G1("confirm:yes", z, Y);
    let A;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) A = f0.default.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, f0.default.createElement(T, {
        bold: !0
    }, e6.warning, " Setup Warnings"), f0.default.createElement(T, {
        dimColor: !0
    }, "We found some potential issues, but you can continue anyway")), K[1] = A;
    else A = K[1];
    let O;
    if (K[2] !== _) O = _.map(_IY), K[2] = _, K[3] = O;
    else O = K[3];
    let w;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) w = f0.default.createElement(A8, {
        chord: "enter",
        action: "continue anyway"
    }), K[4] = w;
    else w = K[4];
    let $;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) $ = f0.default.createElement(u, {
        marginTop: 1
    }, f0.default.createElement(T, {
        bold: !0,
        color: "permission"
    }, "Press", " ", w, ", or", " ", f0.default.createElement(A8, {
        chord: "ctrl+c",
        action: "exit and fix issues",
        format: {
            modCase: "title",
            charCase: "upper"
        }
    }))), K[5] = $;
    else $ = K[5];
    let j;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) j = f0.default.createElement(u, {
        marginTop: 1
    }, f0.default.createElement(T, {
        dimColor: !0
    }, "You can also try the manual setup steps if needed:", " ", f0.default.createElement(T, {
        color: "claude"
    }, Vn))), K[6] = j;
    else j = K[6];
    let H;
    if (K[7] !== O) H = f0.default.createElement(f0.default.Fragment, null, f0.default.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, A, O, $, j)), K[7] = O, K[8] = H;
    else H = K[8];
    return H
}
// @from(Ln 449353, Col 0)
function _IY(q, K) {
    return f0.default.createElement(u, {
        key: K,
        flexDirection: "column",
        marginBottom: 1
    }, f0.default.createElement(T, {
        color: "warning",
        bold: !0
    }, q.title), f0.default.createElement(T, null, q.message), q.instructions.length > 0 && f0.default.createElement(u, {
        flexDirection: "column",
        marginLeft: 2,
        marginTop: 1
    }, q.instructions.map(zIY)))
}
// @from(Ln 449368, Col 0)
function zIY(q, K) {
    return f0.default.createElement(T, {
        key: K,
        dimColor: !0
    }, "• ", q)
}
// @from(Ln 449374, Col 4)
f0
// @from(Ln 449375, Col 4)
HpK = L(() => {
    o6();
    Qq();
    u7();
    g6();
    C7();
    f0 = K6(P6(), 1)
})
// @from(Ln 449383, Col 4)
JpK = {}