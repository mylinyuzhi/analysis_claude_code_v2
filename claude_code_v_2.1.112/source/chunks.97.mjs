
// @from(Ln 255966, Col 4)
Uh4 = L(() => {
    gh4 = {
        agentType: "statusline-setup",
        whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
        tools: ["Read", "Edit"],
        source: "built-in",
        baseDir: "built-in",
        model: "sonnet",
        color: "orange",
        getSystemPrompt: () => `You are a status line setup agent for Claude Code. Your job is to create or update the statusLine command in the user's Claude Code settings.

When asked to convert the user's shell PS1 configuration, follow these steps:
1. Read the user's shell configuration files in this order of preference:
   - ~/.zshrc
   - ~/.bashrc  
   - ~/.bash_profile
   - ~/.profile

2. Extract the PS1 value using this regex pattern: /(?:^|\\n)\\s*(?:export\\s+)?PS1\\s*=\\s*["']([^"']+)["']/m

3. Convert PS1 escape sequences to shell commands:
   - \\u → $(whoami)
   - \\h → $(hostname -s)  
   - \\H → $(hostname)
   - \\w → $(pwd)
   - \\W → $(basename "$(pwd)")
   - \\$ → $
   - \\n → \\n
   - \\t → $(date +%H:%M:%S)
   - \\d → $(date "+%a %b %d")
   - \\@ → $(date +%I:%M%p)
   - \\# → #
   - \\! → !

4. When using ANSI color codes, be sure to use \`printf\`. Do not remove colors. Note that the status line will be printed in a terminal using dimmed colors.

5. If the imported PS1 would have trailing "$" or ">" characters in the output, you MUST remove them.

6. If no PS1 is found and user did not provide other instructions, ask for further instructions.

How to use the statusLine command:
1. The statusLine command will receive the following JSON input via stdin:
   {
     "session_id": "string", // Unique session ID
     "session_name": "string", // Optional: Human-readable session name set via /rename
     "transcript_path": "string", // Path to the conversation transcript
     "cwd": "string",         // Current working directory
     "model": {
       "id": "string",           // Model ID (e.g., "claude-3-5-sonnet-20241022")
       "display_name": "string"  // Display name (e.g., "Claude 3.5 Sonnet")
     },
     "workspace": {
       "current_dir": "string",  // Current working directory path
       "project_dir": "string",  // Project root directory path
       "added_dirs": ["string"], // Directories added via /add-dir
       "git_worktree": "string"  // Optional: git worktree name when cwd is in a linked worktree
     },
     "version": "string",        // Claude Code app version (e.g., "1.0.71")
     "output_style": {
       "name": "string",         // Output style name (e.g., "default", "Explanatory", "Learning")
     },
     "context_window": {
       "total_input_tokens": number,       // Total input tokens used in session (cumulative)
       "total_output_tokens": number,      // Total output tokens used in session (cumulative)
       "context_window_size": number,      // Context window size for current model (e.g., 200000)
       "current_usage": {                   // Token usage from last API call (null if no messages yet)
         "input_tokens": number,           // Input tokens for current context
         "output_tokens": number,          // Output tokens generated
         "cache_creation_input_tokens": number,  // Tokens written to cache
         "cache_read_input_tokens": number       // Tokens read from cache
       } | null,
       "used_percentage": number | null,      // Pre-calculated: % of context used (0-100), null if no messages yet
       "remaining_percentage": number | null  // Pre-calculated: % of context remaining (0-100), null if no messages yet
     },
     "rate_limits": {             // Optional: Claude.ai subscription usage limits. Only present for subscribers after first API response.
       "five_hour": {             // Optional: 5-hour session limit (may be absent)
         "used_percentage": number,   // Percentage of limit used (0-100)
         "resets_at": number          // Unix epoch seconds when this window resets
       },
       "seven_day": {             // Optional: 7-day weekly limit (may be absent)
         "used_percentage": number,   // Percentage of limit used (0-100)
         "resets_at": number          // Unix epoch seconds when this window resets
       }
     },
     "vim": {                     // Optional, only present when vim mode is enabled
       "mode": "INSERT" | "NORMAL"  // Current vim editor mode
     },
     "agent": {                    // Optional, only present when Claude is started with --agent flag
       "name": "string",           // Agent name (e.g., "code-architect", "test-runner")
       "type": "string"            // Optional: Agent type identifier
     },
     "worktree": {                 // Optional, only present when in a --worktree session
       "name": "string",           // Worktree name/slug (e.g., "my-feature")
       "path": "string",           // Full path to the worktree directory
       "branch": "string",         // Optional: Git branch name for the worktree
       "original_cwd": "string",   // The directory Claude was in before entering the worktree
       "original_branch": "string" // Optional: Branch that was checked out before entering the worktree
     }
   }
   
   You can use this JSON data in your command like:
   - $(cat | jq -r '.model.display_name')
   - $(cat | jq -r '.workspace.current_dir')
   - $(cat | jq -r '.output_style.name')

   Or store it in a variable first:
   - input=$(cat); echo "$(echo "$input" | jq -r '.model.display_name') in $(echo "$input" | jq -r '.workspace.current_dir')"

   To display context remaining percentage (simplest approach using pre-calculated field):
   - input=$(cat); remaining=$(echo "$input" | jq -r '.context_window.remaining_percentage // empty'); [ -n "$remaining" ] && echo "Context: $remaining% remaining"

   Or to display context used percentage:
   - input=$(cat); used=$(echo "$input" | jq -r '.context_window.used_percentage // empty'); [ -n "$used" ] && echo "Context: $used% used"

   To display Claude.ai subscription rate limit usage (5-hour session limit):
   - input=$(cat); pct=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty'); [ -n "$pct" ] && printf "5h: %.0f%%" "$pct"

   To display both 5-hour and 7-day limits when available:
   - input=$(cat); five=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty'); week=$(echo "$input" | jq -r '.rate_limits.seven_day.used_percentage // empty'); out=""; [ -n "$five" ] && out="5h:$(printf '%.0f' "$five")%"; [ -n "$week" ] && out="$out 7d:$(printf '%.0f' "$week")%"; echo "$out"

2. For longer commands, you can save a new file in the user's ~/.claude directory, e.g.:
   - ~/.claude/statusline-command.sh and reference that file in the settings.

3. Update the user's ~/.claude/settings.json with:
   {
     "statusLine": {
       "type": "command", 
       "command": "your_command_here"
     }
   }

4. If ~/.claude/settings.json is a symlink, update the target file instead.

Guidelines:
- Preserve existing settings when updating
- Return a summary of what was configured, including the name of the script file if used
- If the script includes git commands, they should skip optional locks
- IMPORTANT: At the end of your response, inform the parent agent that this "statusline-setup" agent must be used for further status line changes.
  Also ensure that the user is informed that they can ask Claude to continue to make changes to the status line.
`
    }
})
// @from(Ln 256108, Col 4)
fCw
// @from(Ln 256109, Col 4)
Qh4 = L(() => {
    u$();
    sY();
    fCw = `You are the verification specialist. You receive the parent's CURRENT-TURN conversation — every tool call the parent made this turn, every output it saw, every shortcut it took. Your job is not to confirm the work. Your job is to break it.

=== SELF-AWARENESS ===
You are Claude, and you are bad at verification. This is documented and persistent:
- You read code and write "PASS" instead of running it.
- You see the first 80% — polished UI, passing tests — and feel inclined to pass. The first 80% is on-distribution, the easy part. Your entire value is the last 20%.
- You're easily fooled by AI slop. The parent is also an LLM. Its tests may be circular, heavy on mocks, or assert what the code does instead of what it should do. Volume of output is not evidence of correctness.
- You trust self-reports. "All tests pass." Did YOU run them?
- When uncertain, you hedge with PARTIAL instead of deciding. PARTIAL is for environmental blockers, not for "I found something ambiguous." If you ran the check, you must decide PASS or FAIL.

Knowing this, your mission is to catch yourself doing these things and do the opposite.

=== CRITICAL: DO NOT MODIFY THE PROJECT ===
You are STRICTLY PROHIBITED from:
- Creating, modifying, or deleting any files IN THE PROJECT DIRECTORY
- Installing dependencies or packages
- Running git write operations (add, commit, push)

You MAY write ephemeral test scripts to a temp directory (/tmp or $TMPDIR) via ${S7} redirection when inline commands aren't sufficient — e.g., a multi-step race harness or a Playwright test. Clean up after yourself.

Check your ACTUAL available tools rather than assuming from this prompt. You may have browser automation (mcp__claude-in-chrome__*, mcp__playwright__*), ${PH}, or other MCP tools depending on the session — do not skip capabilities you didn't think to check for.

=== SCAN THE PARENT'S CONVERSATION FIRST ===
You have the parent's current-turn conversation. Before verifying anything:
1. File list: run \`git diff --name-only HEAD\` if in a git repo — authoritative, catches Bash file writes / sed -i / anything git sees. Not in a repo: scan for Edit/Write/NotebookEdit tool_use blocks, AND for REPL tool_results check the innerToolCalls array (REPL-wrapped edits don't appear as direct tool_use blocks). Union the sources.
2. Look for claims ("I verified...", "tests pass", "it works"). These need independent verification.
3. Look for shortcuts ("should be fine", "probably", "I think"). These need extra scrutiny.
4. Note any tool_result errors the parent may have glossed over.

=== VERIFICATION STRATEGY ===
Adapt your strategy based on what was changed:

**Frontend changes**: Start dev server → check your tools for browser automation (mcp__claude-in-chrome__*, mcp__playwright__*) and USE them to navigate, screenshot, click, and read console — do NOT say "needs a real browser" without attempting → curl a sample of page subresources (image-optimizer URLs like /_next/image, same-origin API routes, static assets) since HTML can serve 200 while everything it references fails → run frontend tests
**Backend/API changes**: Start server → curl/fetch endpoints → verify response shapes against expected values (not just status codes) → test error handling → check edge cases
**CLI/script changes**: Run with representative inputs → verify stdout/stderr/exit codes → test edge inputs (empty, malformed, boundary) → verify --help / usage output is accurate
**Infrastructure/config changes**: Validate syntax → dry-run where possible (terraform plan, kubectl apply --dry-run=server, docker build, nginx -t) → check env vars / secrets are actually referenced, not just defined
**Library/package changes**: Build → full test suite → import the library from a fresh context and exercise the public API as a consumer would → verify exported types match README/docs examples
**Bug fixes**: Reproduce the original bug → verify fix → run regression tests → check related functionality for side effects
**Mobile (iOS/Android)**: Clean build → install on simulator/emulator → dump accessibility/UI tree (idb ui describe-all / uiautomator dump), find elements by label, tap by tree coords, re-dump to verify; screenshots secondary → kill and relaunch to test persistence → check crash logs (logcat / device console)
**Data/ML pipeline**: Run with sample input → verify output shape/schema/types → test empty input, single row, NaN/null handling → check for silent data loss (row counts in vs out)
**Database migrations**: Run migration up → verify schema matches intent → run migration down (reversibility) → test against existing data, not just empty DB
**Refactoring (no behavior change)**: Existing test suite MUST pass unchanged → diff the public API surface (no new/removed exports) → spot-check observable behavior is identical (same inputs → same outputs)
**Other change types**: The pattern is always the same — (a) figure out how to exercise this change directly (run/call/invoke/deploy it), (b) check outputs against expectations, (c) try to break it with inputs/conditions the implementer didn't test. The strategies above are worked examples for common cases.

=== REQUIRED STEPS (universal baseline) ===
1. Read the project's CLAUDE.md / README for build/test commands and conventions. Check package.json / Makefile / pyproject.toml for script names. If the implementer pointed you to a plan or spec file, read it — that's the success criteria.
2. Run the build (if applicable). A broken build is an automatic FAIL.
3. Run the project's test suite (if it has one). Failing tests are an automatic FAIL.
4. Run linters/type-checkers if configured (eslint, tsc, mypy, etc.).
5. Check for regressions in related code.

Then apply the type-specific strategy above. Match rigor to stakes: a one-off script doesn't need race-condition probes; production payments code needs everything.

Test suite results are context, not evidence. Run the suite, note pass/fail, then move on to your real verification. The implementer is an LLM too — its tests may be heavy on mocks, circular assertions, or happy-path coverage that proves nothing about whether the system actually works end-to-end.

=== VERIFICATION PROTOCOL ===
For each modified file / change area you identified in your scan:
1. Happy path: run it, confirm expected output.
2. MANDATORY adversarial probe: at least ONE of — boundary value (0, -1, empty, MAX_INT, very long string, unicode), concurrency (parallel requests to create-if-not-exists), idempotency (same mutation twice), orphan op (delete/reference nonexistent ID). Document the result even if handled correctly.
3. If the parent added tests: read them. Are they circular? Mocked to meaninglessness? Do they cover the change?

A report with zero adversarial probes is a happy-path confirmation, not verification. It will be rejected.

=== RECOGNIZE YOUR OWN RATIONALIZATIONS ===
You will feel the urge to skip checks. These are the exact excuses you reach for — recognize them and do the opposite:
- "The code looks correct based on my reading" — reading is not verification. Run it.
- "The implementer's tests already pass" — the implementer is an LLM. Verify independently.
- "This is probably fine" — probably is not verified. Run it.
- "Let me start the server and check the code" — no. Start the server and hit the endpoint.
- "I don't have a browser" — did you actually check for mcp__claude-in-chrome__* / mcp__playwright__*? If present, use them. If an MCP tool fails, troubleshoot (server running? selector right?). The fallback exists so you don't invent your own "can't do this" story.
- "This would take too long" — not your call.
If you catch yourself writing an explanation instead of a command, stop. Run the command.

=== ADVERSARIAL PROBES (adapt to the change type) ===
Functional tests confirm the happy path. Also try to break it:
- **Concurrency** (servers/APIs): parallel requests to create-if-not-exists paths — duplicate sessions? lost writes?
- **Boundary values**: 0, -1, empty string, very long strings, unicode, MAX_INT
- **Idempotency**: same mutating request twice — duplicate created? error? correct no-op?
- **Orphan operations**: delete/reference IDs that don't exist
These are seeds, not a checklist — pick the ones that fit what you're verifying.

=== BEFORE ISSUING PASS ===
Your report must include at least one adversarial probe you ran (concurrency, boundary, idempotency, orphan op, or similar) and its result — even if the result was "handled correctly." If all your checks are "returns 200" or "test suite passes," you have confirmed the happy path, not verified correctness. Go back and try to break something.

=== BEFORE ISSUING FAIL ===
You found something that looks broken. Before reporting FAIL, check you haven't missed why it's actually fine:
- **Already handled**: is there defensive code elsewhere (validation upstream, error recovery downstream) that prevents this?
- **Intentional**: does CLAUDE.md / comments / commit message explain this as deliberate?
- **Not actionable**: is this a real limitation but unfixable without breaking an external contract (stable API, protocol spec, backwards compat)? If so, note it as an observation, not a FAIL — a "bug" that can't be fixed isn't actionable.
Don't use these as excuses to wave away real issues — but don't FAIL on intentional behavior either.

=== OUTPUT FORMAT (REQUIRED) ===
Every check MUST follow this structure. A check without a Command run block is not a PASS — it's a skip.

\`\`\`
### Check: [what you're verifying]
**Command run:**
  [exact command you executed]
**Output observed:**
  [actual terminal output — copy-paste, not paraphrased. Truncate if very long but keep the relevant part.]
**Result: PASS** (or FAIL — with Expected vs Actual)
\`\`\`

Bad (rejected):
\`\`\`
### Check: POST /api/register validation
**Result: PASS**
Evidence: Reviewed the route handler in routes/auth.py. The logic correctly validates
email format and password length before DB insert.
\`\`\`
(No command run. Reading code is not verification.)

Good:
\`\`\`
### Check: POST /api/register rejects short password
**Command run:**
  curl -s -X POST localhost:8000/api/register -H 'Content-Type: application/json' \\
    -d '{"email":"t@t.co","password":"short"}' | python3 -m json.tool
**Output observed:**
  {
    "error": "password must be at least 8 characters"
  }
  (HTTP 400)
**Expected vs Actual:** Expected 400 with password-length error. Got exactly that.
**Result: PASS**
\`\`\`

End with exactly this line (parsed by caller):

VERDICT: PASS
or
VERDICT: FAIL
or
VERDICT: PARTIAL

PARTIAL is for environmental limitations only (no test framework, tool unavailable, server can't start) — not for "I'm unsure whether this is a bug." If you can run the check, you must decide PASS or FAIL.

PARTIAL is NOT a hedge. "I found a hardcoded key and a TODO but they might be intentional" is FAIL — a hardcoded secret-pattern and an admitted-incomplete TODO are actionable findings regardless of intent. "The tests are circular but the implementer may have known" is FAIL — circular tests are a defect. PARTIAL means "I could not run the check at all," not "I ran it and the result is ambiguous."

Use the literal string \`VERDICT: \` followed by exactly one of \`PASS\`, \`FAIL\`, \`PARTIAL\`. No markdown bold, no punctuation, no variation.
- **FAIL**: include what failed, exact error output, reproduction steps.
- **PARTIAL**: what was verified, what could not be and why (missing tool/env), what the implementer should know.`
})
// @from(Ln 256256, Col 0)
function G88() {
    return u8("tengu_amber_stoat", !0)
}
// @from(Ln 256260, Col 0)
function hb8() {
    if (S6(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && I7()) return [];
    let q = [hc, gh4];
    if (G88()) q.push(Lc, Lb8);
    if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") q.push(ph4);
    return q
}
// @from(Ln 256267, Col 4)
Rb8 = L(() => {
    y8();
    B1();
    Q8();
    nl1();
    Z88();
    f88();
    il1();
    Uh4();
    Qh4()
})
// @from(Ln 256278, Col 4)
ih4 = {}
// @from(Ln 256296, Col 0)
function Vj(q) {
    return q.source === "built-in"
}
// @from(Ln 256300, Col 0)
function v88(q) {
    return q.source !== "built-in" && q.source !== "plugin"
}
// @from(Ln 256304, Col 0)
function T88(q) {
    return q.source === "plugin"
}
// @from(Ln 256308, Col 0)
function zT(q) {
    let K = q.filter((j) => j.source === "built-in"),
        _ = q.filter((j) => j.source === "plugin"),
        z = q.filter((j) => j.source === "userSettings"),
        Y = q.filter((j) => j.source === "projectSettings"),
        A = q.filter((j) => j.source === "policySettings"),
        O = q.filter((j) => j.source === "flagSettings"),
        w = [K, _, z, Y, O, A],
        $ = new Map;
    for (let j of w)
        for (let H of j) $.set(H.agentType, H);
    return Array.from($.values()).sort((j, H) => j.agentType.localeCompare(H.agentType))
}
// @from(Ln 256322, Col 0)
function Sb8(q, K) {
    if (!q.requiredMcpServers || q.requiredMcpServers.length === 0) return !0;
    return q.requiredMcpServers.every((_) => K.some((z) => z.toLowerCase().includes(_.toLowerCase())))
}
// @from(Ln 256327, Col 0)
function V88(q, K) {
    return q.filter((_) => Sb8(_, K))
}
// @from(Ln 256331, Col 0)
function ol1() {
    FR.cache.clear?.(), Eb8()
}
// @from(Ln 256335, Col 0)
function DJz(q) {
    let {
        name: K,
        description: _
    } = q;
    if (!K || typeof K !== "string") return 'Missing required "name" field in frontmatter';
    if (!_ || typeof _ !== "string") return 'Missing required "description" field in frontmatter';
    return "Unknown parsing error"
}
// @from(Ln 256345, Col 0)
function ZJz(q, K) {
    if (!q.hooks) return;
    let _ = sN().safeParse(q.hooks);
    if (!_.success) {
        E(`Invalid hooks in agent '${K}': ${_.error.message}`);
        return
    }
    return _.data
}
// @from(Ln 256355, Col 0)
function lh4(q, K, _ = "flagSettings") {
    try {
        let z = ch4().parse(K),
            Y = x56(z.tools);
        if (x3() && z.memory && Y !== void 0) {
            let $ = new Set(Y);
            for (let j of [IK, J4, xq])
                if (!$.has(j)) Y = [...Y, j]
        }
        let A = z.disallowedTools !== void 0 ? x56(z.disallowedTools) : void 0,
            O = z.prompt;
        return {
            agentType: q,
            whenToUse: z.description,
            ...Y !== void 0 && {
                tools: Y
            },
            ...A !== void 0 && {
                disallowedTools: A
            },
            getSystemPrompt: () => {
                if (x3() && z.memory) return O + `

` + mH6(q, z.memory);
                return O
            },
            source: _,
            ...z.model && {
                model: z.model
            },
            ...z.effort !== void 0 && {
                effort: z.effort
            },
            ...z.permissionMode && {
                permissionMode: z.permissionMode
            },
            ...z.mcpServers && z.mcpServers.length > 0 && {
                mcpServers: z.mcpServers
            },
            ...z.hooks && {
                hooks: z.hooks
            },
            ...z.maxTurns !== void 0 && {
                maxTurns: z.maxTurns
            },
            ...z.skills && z.skills.length > 0 && {
                skills: z.skills
            },
            ...z.initialPrompt && {
                initialPrompt: z.initialPrompt
            },
            ...z.background && {
                background: z.background
            },
            ...z.memory && {
                memory: z.memory
            },
            ...z.isolation && {
                isolation: z.isolation
            }
        }
    } catch (z) {
        let Y = z instanceof Error ? z.message : String(z);
        return E(`Error parsing agent '${q}' from JSON: ${Y}`), j6(z), null
    }
}
// @from(Ln 256422, Col 0)
function k88(q, K = "flagSettings") {
    try {
        let _ = WJz().parse(q);
        return Object.entries(_).map(([z, Y]) => lh4(z, Y, K)).filter((z) => z !== null)
    } catch (_) {
        let z = _ instanceof Error ? _.message : String(_);
        return E(`Error parsing agents from JSON: ${z}`), j6(_), []
    }
}
// @from(Ln 256432, Col 0)
function nh4(q, K, _, z, Y) {
    try {
        let {
            name: A,
            description: O
        } = _;
        if (!A || typeof A !== "string") return null;
        if (!O || typeof O !== "string") return E(`Agent file ${q} is missing required 'description' in frontmatter`), null;
        O = O.replaceAll("\\n", `
`);
        let {
            color: w,
            model: $
        } = _, j;
        if (typeof $ === "string" && $.trim().length > 0) {
            let l = $.trim();
            j = l.toLowerCase() === "inherit" ? "inherit" : l
        }
        let H = _.background;
        if (H !== void 0 && H !== "true" && H !== "false" && H !== !0 && H !== !1) E(`Agent file ${q} has invalid background value '${H}'. Must be 'true', 'false', or omitted.`);
        let J = H === "true" || H === !0 ? !0 : void 0,
            X = ["user", "project", "local"],
            M = _.memory,
            P;
        if (M !== void 0)
            if (X.includes(M)) P = M;
            else E(`Agent file ${q} has invalid memory value '${M}'. Valid options: ${X.join(", ")}`);
        let W = ["worktree"],
            D = _.isolation,
            Z;
        if (D !== void 0)
            if (W.includes(D)) Z = D;
            else E(`Agent file ${q} has invalid isolation value '${D}'. Valid options: ${W.join(", ")}`);
        let G = _.effort,
            f = G !== void 0 ? id(G) : void 0;
        if (G !== void 0 && f === void 0) E(`Agent file ${q} has invalid effort '${G}'. Valid options: ${UI.join(", ")} or an integer`);
        let v = _.permissionMode,
            V = v && jv.includes(v);
        if (v && !V) {
            let l = `Agent file ${q} has invalid permissionMode '${v}'. Valid options: ${jv.join(", ")}`;
            E(l)
        }
        let k = _.maxTurns,
            N = Gh8(k);
        if (k !== void 0 && N === void 0) E(`Agent file ${q} has invalid maxTurns '${k}'. Must be a positive integer.`);
        let R = PJz(q, ".md"),
            h = x56(_.tools);
        if (x3() && P && h !== void 0) {
            let l = new Set(h);
            for (let z6 of [IK, J4, xq])
                if (!l.has(z6)) h = [...h, z6]
        }
        let C = _.disallowedTools,
            x = C !== void 0 ? x56(C) : void 0,
            B = yc(_.skills),
            m = _.initialPrompt,
            S = typeof m === "string" && m.trim() ? m : void 0,
            F = _.mcpServers,
            U;
        if (Array.isArray(F)) U = F.map((l) => {
            let z6 = dh4().safeParse(l);
            if (z6.success) return z6.data;
            return E(`Agent file ${q} has invalid mcpServers item: ${I6(l)}. Error: ${z6.error.message}`), null
        }).filter((l) => l !== null);
        let g = ZJz(_, A),
            c = z.trim();
        return {
            baseDir: K,
            agentType: A,
            whenToUse: O,
            ...h !== void 0 && {
                tools: h
            },
            ...x !== void 0 && {
                disallowedTools: x
            },
            ...B !== void 0 && {
                skills: B
            },
            ...S !== void 0 && {
                initialPrompt: S
            },
            ...U !== void 0 && U.length > 0 && {
                mcpServers: U
            },
            ...g !== void 0 && {
                hooks: g
            },
            getSystemPrompt: () => {
                if (x3() && P) {
                    let l = mH6(A, P);
                    return c + `

` + l
                }
                return c
            },
            source: Y,
            filename: R,
            ...w && typeof w === "string" && VJ.includes(w) && {
                color: w
            },
            ...j !== void 0 && {
                model: j
            },
            ...f !== void 0 && {
                effort: f
            },
            ...V && {
                permissionMode: v
            },
            ...N !== void 0 && {
                maxTurns: N
            },
            ...J && {
                background: J
            },
            ...P && {
                memory: P
            },
            ...Z && {
                isolation: Z
            }
        }
    } catch (A) {
        let O = A instanceof Error ? A.message : String(A);
        return E(`Error parsing agent from ${q}: ${O}`), j6(A), null
    }
}
// @from(Ln 256561, Col 4)
dh4
// @from(Ln 256561, Col 9)
ch4
// @from(Ln 256561, Col 14)
WJz
// @from(Ln 256561, Col 19)
FR
// @from(Ln 256562, Col 4)
cP = L(() => {
    U4();
    p7();
    VY();
    C8();
    FA6();
    K8();
    hf();
    Q8();
    Lf();
    U8();
    ds();
    OP();
    yb8();
    Th();
    e8();
    Rz();
    u$();
    Uf();
    pp();
    mh4();
    Rb8();
    dh4 = C6(() => y.union([y.string(), y.record(y.string(), GU())])), ch4 = C6(() => y.object({
        description: y.string().min(1, "Description cannot be empty"),
        tools: y.array(y.string()).optional(),
        disallowedTools: y.array(y.string()).optional(),
        prompt: y.string().min(1, "Prompt cannot be empty"),
        model: y.string().trim().min(1, "Model cannot be empty").transform((q) => q.toLowerCase() === "inherit" ? "inherit" : q).optional(),
        effort: y.union([y.enum(UI), y.number().int()]).optional(),
        permissionMode: y.enum(jv).optional(),
        mcpServers: y.array(dh4()).optional(),
        hooks: sN().optional(),
        maxTurns: y.number().int().positive().optional(),
        skills: y.array(y.string()).optional(),
        initialPrompt: y.string().optional(),
        memory: y.enum(["user", "project", "local"]).optional(),
        background: y.boolean().optional(),
        isolation: y.enum(["worktree"]).optional()
    })), WJz = C6(() => y.record(y.string(), ch4()));
    FR = P1(async (q) => {
        if (S6(process.env.CLAUDE_CODE_SIMPLE)) {
            let K = hb8();
            return {
                activeAgents: K,
                allAgents: K
            }
        }
        try {
            let K = await ls("agents", q),
                _ = [],
                z = K.map(({
                    filePath: j,
                    baseDir: H,
                    frontmatter: J,
                    content: X,
                    source: M
                }) => {
                    let P = nh4(j, H, J, X, M);
                    if (!P) {
                        if (!J.name) return null;
                        let W = DJz(J);
                        return _.push({
                            path: j,
                            error: W
                        }), E(`Failed to parse agent from ${j}: ${W}`), d("tengu_agent_parse_error", {
                            error: W,
                            location: M
                        }), null
                    }
                    return P
                }).filter((j) => j !== null),
                A = await D88(),
                w = [...hb8(), ...A, ...z],
                $ = zT(w);
            for (let j of $)
                if (j.color) BH6(j.agentType, j.color);
            return {
                activeAgents: $,
                allAgents: w,
                failedFiles: _.length > 0 ? _ : void 0
            }
        } catch (K) {
            let _ = K instanceof Error ? K.message : String(K);
            E(`Error loading agent definitions: ${_}`), j6(K);
            let z = hb8();
            return {
                activeAgents: z,
                allAgents: z,
                failedFiles: [{
                    path: "unknown",
                    error: _
                }]
            }
        }
    })
})
// @from(Ln 256659, Col 0)
function Cb8() {
    return v7().skillListingMaxDescChars ?? GJz
}
// @from(Ln 256663, Col 0)
function ah4() {
    return v7().skillListingBudgetFraction ?? rh4
}
// @from(Ln 256667, Col 0)
function N88(q) {
    if (Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET)) return Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET);
    let K = ah4(),
        _ = q ? q * oh4 * K : fJz * (K / rh4);
    return Math.max(1, Math.floor(_))
}
// @from(Ln 256674, Col 0)
function al1(q) {
    return q.whenToUse ? `${q.description} - ${q.whenToUse}` : q.description
}
// @from(Ln 256678, Col 0)
function vJz(q) {
    return q.type === "prompt" && q.source === "bundled"
}
// @from(Ln 256682, Col 0)
function sh4(q, K, _) {
    let z = N88(K),
        Y = Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET) > 0,
        A = Cb8(),
        O = [],
        w = Math.max(0, q.length - 1),
        $ = q.map((G) => {
            if (_?.has(G.name)) return w += G.name.length + 2, {
                cmd: G,
                descLen: 0,
                entryLen: G.name.length + 2
            };
            let f = al1(G),
                v = Math.min(f.length, A);
            if (f.length > A) O.push({
                name: G.name,
                rawLen: f.length
            });
            return w += G.name.length + 4 + f.length, {
                cmd: G,
                descLen: v,
                entryLen: G.name.length + 4 + v
            }
        });
    O.sort((G, f) => f.rawLen - G.rawLen);
    let j = O.map((G) => G.name),
        H = $.reduce((G, f) => G + f.entryLen, 0) + Math.max(0, $.length - 1);
    if (H <= z) return {
        cappedSkills: j,
        budgetMode: "fits",
        maxDescLen: A,
        budgetTruncatedSkills: [],
        totalChars: H,
        rawTotalChars: w,
        budget: z,
        budgetFromEnv: Y
    };
    let J = (G) => vJz(G.cmd) || _?.has(G.cmd.name),
        X = $.reduce((G, f) => J(f) ? G + f.entryLen + 1 : G, 0),
        M = $.filter((G) => !J(G)),
        P = M.reduce((G, f) => G + f.cmd.name.length + 4, 0) + Math.max(0, M.length - 1),
        W = M.length > 0 ? Math.floor((z - X - P) / M.length) : A,
        D = W < sl1 ? "names-only" : "truncate",
        Z = D === "names-only" ? M.filter((G) => G.descLen > 0) : M.filter((G) => G.descLen > W);
    return Z.sort((G, f) => f.descLen - G.descLen), {
        cappedSkills: j,
        budgetMode: D,
        maxDescLen: Math.max(0, W),
        budgetTruncatedSkills: Z.map((G) => G.cmd.name),
        totalChars: H,
        rawTotalChars: w,
        budget: z,
        budgetFromEnv: Y
    }
}
// @from(Ln 256737, Col 4)
rh4 = 0.01
// @from(Ln 256738, Col 4)
oh4 = 4
// @from(Ln 256739, Col 4)
fJz = 8000
// @from(Ln 256740, Col 4)
GJz = 1536
// @from(Ln 256741, Col 4)
sl1 = 20
// @from(Ln 256742, Col 4)
Xh6 = L(() => {
    a1()
})
// @from(Ln 256745, Col 4)
th4 = {}
// @from(Ln 256755, Col 0)
function tl1(q) {
    let K = al1(q),
        _ = Cb8();
    return K.length > _ ? K.slice(0, _ - 1) + "…" : K
}
// @from(Ln 256761, Col 0)
function TJz(q) {
    let K = y_(q);
    if (q.name !== K && q.type === "prompt" && q.source === "plugin") E(`Skill prompt: showing "${q.name}" (userFacingName="${K}")`);
    return `- ${q.name}: ${tl1(q)}`
}
// @from(Ln 256767, Col 0)
function el1(q, K, _) {
    if (q.length === 0) return "";
    let z = N88(K),
        Y = new Set,
        A = q.map((W, D) => {
            if (u56(W) === "name-only") return Y.add(D), {
                cmd: W,
                full: `- ${W.name}`
            };
            return {
                cmd: W,
                full: TJz(W)
            }
        });
    if (A.reduce((W, D) => W + N1(D.full), 0) + (A.length - 1) <= z) return A.map((W) => W.full).join(`
`);
    let w = new Set(Y),
        $ = [];
    for (let W = 0; W < q.length; W++) {
        let D = q[W];
        if (D.type === "prompt" && D.source === "bundled") w.add(W);
        else if (!Y.has(W)) $.push(D)
    }
    let j = A.reduce((W, D, Z) => w.has(Z) ? W + N1(D.full) + 1 : W, 0),
        H = z - j;
    if ($.length === 0) return A.map((W) => W.full).join(`
`);
    let J = $.reduce((W, D) => W + N1(D.name) + 4, 0) + ($.length - 1),
        X = H - J,
        M = Math.floor(X / $.length);
    if (M < sl1) return q.map((W, D) => w.has(D) ? A[D].full : `- ${W.name}`).join(`
`);
    let P = w7($, (W) => N1(tl1(W)) > M);
    return q.map((W, D) => {
        if (w.has(D)) return A[D].full;
        let Z = tl1(W);
        return `- ${W.name}: ${w5(Z,M)}`
    }).join(`
`)
}
// @from(Ln 256807, Col 0)
async function qn1(q) {
    let K = await Ty(q);
    return {
        totalCommands: K.length,
        includedCommands: K.length
    }
}
// @from(Ln 256815, Col 0)
function Kn1(q) {
    return Ty(q)
}
// @from(Ln 256819, Col 0)
function _n1() {
    bb8.cache?.clear?.()
}
// @from(Ln 256822, Col 0)
async function VJz(q) {
    try {
        let K = await pH6(q);
        return {
            totalSkills: K.length,
            includedSkills: K.length
        }
    } catch (K) {
        return j6(r1(K)), {
            totalSkills: 0,
            includedSkills: 0
        }
    }
}
// @from(Ln 256836, Col 4)
bb8
// @from(Ln 256837, Col 4)
Mh6 = L(() => {
    v16();
    CA();
    rA();
    n5();
    C8();
    K8();
    m8();
    c7();
    U8();
    Xh6();
    bb8 = P1(async (q) => {
        return `Execute a skill within the main conversation

When users ask you to perform tasks, check if any of the available skills match. Skills provide specialized capabilities and domain knowledge.

When users reference a "slash command" or "/<something>", they are referring to a skill. Use this tool to invoke it.

How to invoke:
- Set \`skill\` to the exact name of an available skill (no leading slash). For plugin-namespaced skills use the fully qualified \`plugin:skill\` form.
- Set \`args\` to pass optional arguments.

Important:
- Available skills are listed in system-reminder messages in the conversation
- Only invoke a skill that appears in that list, or one the user explicitly typed as \`/<name>\` in their message. Never guess or invent a skill name from training data; otherwise do not call this tool
- When a skill matches the user's request, this is a BLOCKING REQUIREMENT: invoke the relevant Skill tool BEFORE generating any other response about the task
- NEVER mention a skill without actually calling this tool
- Do not invoke a skill that is already running
- Do not use this tool for built-in CLI commands (like /help, /clear, etc.)
- If you see a <${TV}> tag in the current conversation turn, the skill has ALREADY been loaded - follow the instructions directly instead of calling this tool again
`
    })
})
// @from(Ln 256878, Col 0)
async function m56(q, K = 0, _, z, Y, A) {
    Y?.throwIfAborted();
    let O = A?.truncateOnByteLimit ?? !1,
        w = await EJz(q);
    if (w.isDirectory()) throw Error(`EISDIR: illegal operation on a directory, read '${q}'`);
    if (w.isFile() && w.size < LJz) {
        if (!O && z !== void 0 && w.size > z) throw new E88(w.size, z);
        let $ = await yJz(q, {
            encoding: "utf8",
            signal: Y
        });
        return hJz($, w.size, w.mtimeMs, K, _, O ? z : void 0)
    }
    return bJz(q, K, _, z, O, Y)
}
// @from(Ln 256894, Col 0)
function hJz(q, K, _, z, Y, A) {
    let O = q.charCodeAt(0) === 65279;
    if (O) K -= 3;
    let w = O ? q.slice(1) : q;
    if (z === 0 && Y === void 0 && A === void 0) {
        let G = w.includes("\r") ? w.replaceAll(`\r
`, `
`) : w;
        if (G.endsWith("\r")) G = G.slice(0, -1);
        let f = 1,
            v = G.indexOf(`
`);
        while (v !== -1) f++, v = G.indexOf(`
`, v + 1);
        return {
            content: G,
            lineCount: f,
            totalLines: f,
            totalBytes: K,
            readBytes: Buffer.byteLength(G, "utf8"),
            mtimeMs: _
        }
    }
    let $ = Y !== void 0 ? z + Y : 1 / 0,
        j = [],
        H = 0,
        J = 0,
        X, M = 0,
        P = !1;

    function W(G) {
        if (A !== void 0) {
            let f = j.length > 0 ? 1 : 0,
                v = M + f + Buffer.byteLength(G);
            if (v > A) return P = !0, !1;
            M = v
        }
        return j.push(G), !0
    }
    while ((X = w.indexOf(`
`, J)) !== -1) {
        if (H >= z && H < $ && !P) {
            let G = w.slice(J, X);
            if (G.endsWith("\r")) G = G.slice(0, -1);
            W(G)
        }
        H++, J = X + 1
    }
    if (H >= z && H < $ && !P) {
        let G = w.slice(J);
        if (G.endsWith("\r")) G = G.slice(0, -1);
        W(G)
    }
    H++;
    let D = j.join(`
`),
        Z = {
            content: D,
            lineCount: j.length,
            totalLines: H,
            totalBytes: K,
            readBytes: Buffer.byteLength(D, "utf8"),
            mtimeMs: _
        };
    if (P) Z.truncatedByBytes = !0;
    return Z
}
// @from(Ln 256962, Col 0)
function RJz(q) {
    NJz(q, (K, _) => {
        this.resolveMtime(K ? 0 : _.mtimeMs)
    })
}
// @from(Ln 256968, Col 0)
function SJz(q) {
    if (this.isFirstChunk) {
        if (this.isFirstChunk = !1, q.charCodeAt(0) === 65279) q = q.slice(1)
    }
    if (this.totalBytesRead += Buffer.byteLength(q), !this.truncateOnByteLimit && this.maxBytes !== void 0 && this.totalBytesRead > this.maxBytes) {
        this.stream.destroy(new E88(this.totalBytesRead, this.maxBytes));
        return
    }
    let K = this.partial.length > 0 ? this.partial + q : q;
    this.partial = "";
    let _ = 0,
        z;
    while ((z = K.indexOf(`
`, _)) !== -1) {
        if (this.currentLineIndex >= this.offset && this.currentLineIndex < this.endLine) {
            let Y = K.slice(_, z);
            if (Y.endsWith("\r")) Y = Y.slice(0, -1);
            if (this.truncateOnByteLimit && this.maxBytes !== void 0) {
                let A = this.selectedLines.length > 0 ? 1 : 0,
                    O = this.selectedBytes + A + Buffer.byteLength(Y);
                if (O > this.maxBytes) this.truncatedByBytes = !0, this.endLine = this.currentLineIndex;
                else this.selectedBytes = O, this.selectedLines.push(Y)
            } else this.selectedLines.push(Y)
        }
        this.currentLineIndex++, _ = z + 1
    }
    if (_ < K.length) {
        if (this.currentLineIndex >= this.offset && this.currentLineIndex < this.endLine) {
            let Y = K.slice(_);
            if (this.truncateOnByteLimit && this.maxBytes !== void 0) {
                let A = this.selectedLines.length > 0 ? 1 : 0;
                if (this.selectedBytes + A + Buffer.byteLength(Y) > this.maxBytes) {
                    this.truncatedByBytes = !0, this.endLine = this.currentLineIndex;
                    return
                }
            }
            this.partial = Y
        }
    }
}
// @from(Ln 257009, Col 0)
function CJz() {
    let q = this.partial;
    if (q.endsWith("\r")) q = q.slice(0, -1);
    if (this.currentLineIndex >= this.offset && this.currentLineIndex < this.endLine)
        if (this.truncateOnByteLimit && this.maxBytes !== void 0) {
            let z = this.selectedLines.length > 0 ? 1 : 0;
            if (this.selectedBytes + z + Buffer.byteLength(q) > this.maxBytes) this.truncatedByBytes = !0;
            else this.selectedLines.push(q)
        } else this.selectedLines.push(q);
    this.currentLineIndex++;
    let K = this.selectedLines.join(`
`),
        _ = this.truncatedByBytes;
    this.mtimeReady.then((z) => {
        let Y = {
            content: K,
            lineCount: this.selectedLines.length,
            totalLines: this.currentLineIndex,
            totalBytes: this.totalBytesRead,
            readBytes: Buffer.byteLength(K, "utf8"),
            mtimeMs: z
        };
        if (_) Y.truncatedByBytes = !0;
        this.resolve(Y)
    })
}
// @from(Ln 257036, Col 0)
function bJz(q, K, _, z, Y, A) {
    return new Promise((O, w) => {
        let $ = {
            stream: kJz(q, {
                encoding: "utf8",
                highWaterMark: 524288,
                ...A ? {
                    signal: A
                } : void 0
            }),
            offset: K,
            endLine: _ !== void 0 ? K + _ : 1 / 0,
            maxBytes: z,
            truncateOnByteLimit: Y,
            resolve: O,
            totalBytesRead: 0,
            selectedBytes: 0,
            truncatedByBytes: !1,
            currentLineIndex: 0,
            selectedLines: [],
            partial: "",
            isFirstChunk: !0,
            resolveMtime: () => {},
            mtimeReady: null
        };
        $.mtimeReady = new Promise((j) => {
            $.resolveMtime = j
        }), $.stream.once("open", RJz.bind($)), $.stream.on("data", SJz.bind($)), $.stream.once("end", CJz.bind($)), $.stream.once("error", w)
    })
}
// @from(Ln 257066, Col 4)
LJz = 10485760
// @from(Ln 257067, Col 4)
E88
// @from(Ln 257068, Col 4)
Ph6 = L(() => {
    c7();
    E88 = class E88 extends Error {
        sizeInBytes;
        maxSizeBytes;
        constructor(q, K) {
            super(`File content (${o4(q)}) exceeds maximum allowed size (${o4(K)}). Use offset and limit parameters to read specific portions of the file, or search for specific content instead of reading the whole file.`);
            this.sizeInBytes = q;
            this.maxSizeBytes = K;
            this.name = "FileTooLargeError"
        }
    }
})
// @from(Ln 257081, Col 4)
Vy = "TodoWrite"
// @from(Ln 257082, Col 4)
YT = "TaskCreate"
// @from(Ln 257083, Col 4)
gk = "TaskUpdate"
// @from(Ln 257084, Col 4)
VH = "Skill"
// @from(Ln 257096, Col 0)
function _R4(q) {
    if (y88 === q) return;
    y88 = q, B56()
}
// @from(Ln 257101, Col 0)
function zR4() {
    if (y88 === void 0) return;
    y88 = void 0, B56()
}
// @from(Ln 257106, Col 0)
function B56() {
    try {
        KR4.emit()
    } catch {}
}
// @from(Ln 257112, Col 0)
function AR4(q) {
    return L88(gp(q), uJz)
}
// @from(Ln 257115, Col 0)
async function Yn1(q) {
    let K = AR4(q);
    try {
        let _ = (await eh4(K, "utf-8")).trim(),
            z = parseInt(_, 10);
        return isNaN(z) ? 0 : z
    } catch {
        return 0
    }
}
// @from(Ln 257125, Col 0)
async function OR4(q, K) {
    let _ = AR4(q);
    await Ib8(_, String(K))
}
// @from(Ln 257130, Col 0)
function kJ() {
    if (S6(process.env.CLAUDE_CODE_ENABLE_TASKS)) return !0;
    return !I7()
}
// @from(Ln 257134, Col 0)
async function xb8(q) {
    let K = gp(q),
        _ = await wn1(q),
        z;
    try {
        z = await Jj(_, h88);
        let Y = await wR4(q);
        if (Y > 0) {
            let O = await Yn1(q);
            if (Y > O) await OR4(q, Y)
        }
        let A;
        try {
            A = await zn1(K)
        } catch {
            A = []
        }
        for (let O of A)
            if (O.endsWith(".json") && !O.startsWith(".")) {
                let w = L88(K, O);
                try {
                    await qR4(w)
                } catch {}
            } B56()
    } finally {
        if (z) await z()
    }
}
// @from(Ln 257163, Col 0)
function AT() {
    if (process.env.CLAUDE_CODE_TASK_LIST_ID) return process.env.CLAUDE_CODE_TASK_LIST_ID;
    let q = uW();
    if (q) return q.teamName;
    return Z9() || y88 || I8()
}
// @from(Ln 257170, Col 0)
function Wh6(q) {
    return q.replace(/[^a-zA-Z0-9_-]/g, "-")
}
// @from(Ln 257174, Col 0)
function gp(q) {
    return L88(A7(), "tasks", Wh6(q))
}
// @from(Ln 257178, Col 0)
function Dh6(q, K) {
    return L88(gp(q), `${Wh6(K)}.json`)
}
// @from(Ln 257181, Col 0)
async function An1(q) {
    let K = gp(q);
    try {
        await IJz(K, {
            recursive: !0
        })
    } catch {}
}
// @from(Ln 257189, Col 0)
async function wR4(q) {
    let K = gp(q),
        _;
    try {
        _ = await zn1(K)
    } catch {
        return 0
    }
    let z = 0;
    for (let Y of _) {
        if (!Y.endsWith(".json")) continue;
        let A = parseInt(Y.replace(".json", ""), 10);
        if (!isNaN(A) && A > z) z = A
    }
    return z
}
// @from(Ln 257205, Col 0)
async function mJz(q) {
    let [K, _] = await Promise.all([wR4(q), Yn1(q)]);
    return Math.max(K, _)
}
// @from(Ln 257209, Col 0)
async function $R4(q, K) {
    let _ = await wn1(q),
        z;
    try {
        z = await Jj(_, h88);
        let Y = await mJz(q),
            A = String(Y + 1),
            O = {
                id: A,
                ...K
            },
            w = Dh6(q, A);
        return await Ib8(w, I6(O, null, 2)), B56(), A
    } finally {
        if (z) await z()
    }
}
// @from(Ln 257226, Col 0)
async function Fp(q, K) {
    let _ = Dh6(q, K);
    try {
        let z = await eh4(_, "utf-8"),
            Y = n8(z),
            A = xJz().safeParse(Y);
        if (!A.success) return E(`[Tasks] Task ${K} failed schema validation: ${A.error.message}`), null;
        return A.data
    } catch (z) {
        if (Q1(z) === "ENOENT") return null;
        return E(`[Tasks] Failed to read task ${K}: ${b6(z)}`), j6(z), null
    }
}
// @from(Ln 257239, Col 0)
async function jR4(q, K, _) {
    let z = await Fp(q, K);
    if (!z) return null;
    let Y = {
            ...z,
            ..._,
            id: K
        },
        A = Dh6(q, K);
    return await Ib8(A, I6(Y, null, 2)), B56(), Y
}
// @from(Ln 257250, Col 0)
async function ns(q, K, _) {
    let z = Dh6(q, K);
    if (!await Fp(q, K)) return null;
    let A;
    try {
        return A = await Jj(z, h88), await jR4(q, K, _)
    } finally {
        await A?.()
    }
}
// @from(Ln 257260, Col 0)
async function ub8(q, K) {
    let _ = Dh6(q, K);
    try {
        let z = parseInt(K, 10);
        if (!isNaN(z)) {
            let A = await Yn1(q);
            if (z > A) await OR4(q, z)
        }
        try {
            await qR4(_)
        } catch (A) {
            if (Q1(A) === "ENOENT") return !1;
            throw A
        }
        let Y = await Qf(q);
        for (let A of Y) {
            let O = A.blocks.filter(($) => $ !== K),
                w = A.blockedBy.filter(($) => $ !== K);
            if (O.length !== A.blocks.length || w.length !== A.blockedBy.length) await ns(q, A.id, {
                blocks: O,
                blockedBy: w
            })
        }
        return B56(), !0
    } catch {
        return !1
    }
}
// @from(Ln 257288, Col 0)
async function Qf(q) {
    let K = gp(q),
        _;
    try {
        _ = await zn1(K)
    } catch {
        return []
    }
    let z = _.filter((A) => A.endsWith(".json")).map((A) => A.replace(".json", ""));
    return (await Promise.all(z.map((A) => Fp(q, A)))).filter((A) => A !== null)
}
// @from(Ln 257299, Col 0)
async function On1(q, K, _) {
    let [z, Y] = await Promise.all([Fp(q, K), Fp(q, _)]);
    if (!z || !Y) return !1;
    if (!z.blocks.includes(_)) await ns(q, K, {
        blocks: [...z.blocks, _]
    });
    if (!Y.blockedBy.includes(K)) await ns(q, _, {
        blockedBy: [...Y.blockedBy, K]
    });
    return !0
}
// @from(Ln 257311, Col 0)
function BJz(q) {
    return L88(gp(q), ".lock")
}
// @from(Ln 257314, Col 0)
async function wn1(q) {
    await An1(q);
    let K = BJz(q);
    try {
        await Ib8(K, "", {
            flag: "wx"
        })
    } catch {}
    return K
}
// @from(Ln 257324, Col 0)
async function HR4(q, K, _, z = {}) {
    let Y = Dh6(q, K);
    if (!await Fp(q, K)) return {
        success: !1,
        reason: "task_not_found"
    };
    if (z.checkAgentBusy) return pJz(q, K, _);
    let O;
    try {
        O = await Jj(Y, h88);
        let w = await Fp(q, K);
        if (!w) return {
            success: !1,
            reason: "task_not_found"
        };
        if (w.owner && w.owner !== _) return {
            success: !1,
            reason: "already_claimed",
            task: w
        };
        if (w.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: w
        };
        let $ = await Qf(q),
            j = new Set($.filter((X) => X.status !== "completed").map((X) => X.id)),
            H = w.blockedBy.filter((X) => j.has(X));
        if (H.length > 0) return {
            success: !1,
            reason: "blocked",
            task: w,
            blockedByTasks: H
        };
        return {
            success: !0,
            task: await jR4(q, K, {
                owner: _
            })
        }
    } catch (w) {
        return E(`[Tasks] Failed to claim task ${K}: ${b6(w)}`), j6(w), {
            success: !1,
            reason: "task_not_found"
        }
    } finally {
        if (O) await O()
    }
}
// @from(Ln 257373, Col 0)
async function pJz(q, K, _) {
    let z = await wn1(q),
        Y;
    try {
        Y = await Jj(z, h88);
        let A = await Qf(q),
            O = A.find((J) => J.id === K);
        if (!O) return {
            success: !1,
            reason: "task_not_found"
        };
        if (O.owner && O.owner !== _) return {
            success: !1,
            reason: "already_claimed",
            task: O
        };
        if (O.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: O
        };
        let w = new Set(A.filter((J) => J.status !== "completed").map((J) => J.id)),
            $ = O.blockedBy.filter((J) => w.has(J));
        if ($.length > 0) return {
            success: !1,
            reason: "blocked",
            task: O,
            blockedByTasks: $
        };
        let j = A.filter((J) => J.status !== "completed" && J.owner === _ && J.id !== K);
        if (j.length > 0) return {
            success: !1,
            reason: "agent_busy",
            task: O,
            busyWithTasks: j.map((J) => J.id)
        };
        return {
            success: !0,
            task: await ns(q, K, {
                owner: _
            })
        }
    } catch (A) {
        return E(`[Tasks] Failed to claim task ${K} with busy check: ${b6(A)}`), j6(A), {
            success: !1,
            reason: "task_not_found"
        }
    } finally {
        if (Y) await Y()
    }
}
// @from(Ln 257424, Col 0)
async function p56(q, K, _, z) {
    let A = (await Qf(q)).filter(($) => $.status !== "completed" && ($.owner === K || $.owner === _));
    for (let $ of A) await ns(q, $.id, {
        owner: void 0,
        status: "pending"
    });
    if (A.length > 0) E(`[Tasks] Unassigned ${A.length} task(s) from ${_}`);
    let w = `${_} ${z==="terminated"?"was terminated":"has shut down"}.`;
    if (A.length > 0) {
        let $ = A.map((j) => `#${j.id} "${j.subject}"`).join(", ");
        w += ` ${A.length} task(s) were unassigned: ${$}. Use TaskList to check availability and TaskUpdate with owner to reassign them to idle teammates.`
    }
    return {
        unassignedTasks: A.map(($) => ({
            id: $.id,
            subject: $.subject
        })),
        notificationMessage: w
    }
}
// @from(Ln 257444, Col 4)
KR4
// @from(Ln 257444, Col 9)
y88
// @from(Ln 257444, Col 14)
YR4
// @from(Ln 257444, Col 19)
FH6
// @from(Ln 257444, Col 24)
xJz
// @from(Ln 257444, Col 29)
uJz = ".highwatermark"
// @from(Ln 257445, Col 4)
h88
// @from(Ln 257446, Col 4)
PX = L(() => {
    p7();
    y8();
    K8();
    Q8();
    m8();
    U8();
    nH();
    e8();
    zY();
    Rv();
    KR4 = l5();
    YR4 = KR4.subscribe;
    FH6 = C6(() => y.enum(["pending", "in_progress", "completed"])), xJz = C6(() => y.object({
        id: y.string(),
        subject: y.string(),
        description: y.string(),
        activeForm: y.string().optional(),
        owner: y.string().optional(),
        status: FH6(),
        blocks: y.array(y.string()),
        blockedBy: y.array(y.string()),
        metadata: y.record(y.string(), y.unknown()).optional()
    })), h88 = {
        retries: {
            retries: 30,
            minTimeout: 5,
            maxTimeout: 100
        }
    }
})
// @from(Ln 257478, Col 0)
function mb8() {
    let q = process.env.CLAUDE_CODE_ENVIRONMENT_KIND;
    if (q === "byoc" || q === "anthropic_cloud") return q;
    return null
}
// @from(Ln 257483, Col 4)
$n1 = L(() => {
    K8()
})
// @from(Ln 257490, Col 0)
function UJz(q) {
    return FJz(4).readUInt32BE(0) % q
}
// @from(Ln 257494, Col 0)
function R88(q) {
    return q[UJz(q.length)]
}
// @from(Ln 257498, Col 0)
function Bb8() {
    let q = R88(JR4),
        K = R88(gJz),
        _ = R88(XR4);
    return `${q}-${K}-${_}`
}
// @from(Ln 257505, Col 0)
function MR4(q, K = {}) {
    let {
        words: _ = 4,
        maxLen: z = 40
    } = K;
    return q.split(/\s+/).slice(0, _).join(" ").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, z).replace(/^-+|-+$/g, "")
}
// @from(Ln 257513, Col 0)
function Zh6() {
    let q = R88(JR4),
        K = R88(XR4);
    return `${q}-${K}`
}
// @from(Ln 257518, Col 4)
JR4
// @from(Ln 257518, Col 9)
XR4
// @from(Ln 257518, Col 14)
gJz
// @from(Ln 257519, Col 4)
S88 = L(() => {
    JR4 = ["abundant", "ancient", "bright", "calm", "cheerful", "clever", "cozy", "curious", "dapper", "dazzling", "deep", "delightful", "eager", "elegant", "enchanted", "fancy", "fluffy", "gentle", "gleaming", "golden", "graceful", "happy", "hidden", "humble", "jolly", "joyful", "keen", "kind", "lively", "lovely", "lucky", "luminous", "magical", "majestic", "mellow", "merry", "mighty", "misty", "noble", "peaceful", "playful", "polished", "precious", "proud", "quiet", "quirky", "radiant", "rosy", "serene", "shiny", "silly", "sleepy", "smooth", "snazzy", "snug", "snuggly", "soft", "sparkling", "spicy", "splendid", "sprightly", "starry", "steady", "sunny", "swift", "tender", "tidy", "toasty", "tranquil", "twinkly", "valiant", "vast", "velvet", "vivid", "warm", "whimsical", "wild", "wise", "witty", "wondrous", "zany", "zesty", "zippy", "breezy", "bubbly", "buzzing", "cheeky", "cosmic", "cozy", "crispy", "crystalline", "cuddly", "drifting", "dreamy", "effervescent", "ethereal", "fizzy", "flickering", "floating", "floofy", "fluttering", "foamy", "frolicking", "fuzzy", "giggly", "glimmering", "glistening", "glittery", "glowing", "goofy", "groovy", "harmonic", "hazy", "humming", "iridescent", "jaunty", "jazzy", "jiggly", "melodic", "moonlit", "mossy", "nifty", "peppy", "prancy", "purrfect", "purring", "quizzical", "rippling", "rustling", "shimmering", "shimmying", "snappy", "snoopy", "squishy", "swirling", "ticklish", "tingly", "twinkling", "velvety", "wiggly", "wobbly", "woolly", "zazzy", "abstract", "adaptive", "agile", "async", "atomic", "binary", "cached", "compiled", "composed", "compressed", "concurrent", "cryptic", "curried", "declarative", "delegated", "distributed", "dynamic", "eager", "elegant", "encapsulated", "enumerated", "eventual", "expressive", "federated", "functional", "generic", "greedy", "hashed", "idempotent", "immutable", "imperative", "indexed", "inherited", "iterative", "lazy", "lexical", "linear", "linked", "logical", "memoized", "modular", "mutable", "nested", "optimized", "parallel", "parsed", "partitioned", "piped", "polymorphic", "pure", "reactive", "recursive", "refactored", "reflective", "replicated", "resilient", "robust", "scalable", "sequential", "serialized", "sharded", "sorted", "staged", "stateful", "stateless", "streamed", "structured", "synchronous", "synthetic", "temporal", "transient", "typed", "unified", "validated", "vectorized", "virtual"], XR4 = ["aurora", "avalanche", "blossom", "breeze", "brook", "bubble", "canyon", "cascade", "cloud", "clover", "comet", "coral", "cosmos", "creek", "crescent", "crystal", "dawn", "dewdrop", "dusk", "eclipse", "ember", "feather", "fern", "firefly", "flame", "flurry", "fog", "forest", "frost", "galaxy", "garden", "glacier", "glade", "grove", "harbor", "horizon", "island", "lagoon", "lake", "leaf", "lightning", "meadow", "meteor", "mist", "moon", "moonbeam", "mountain", "nebula", "nova", "ocean", "orbit", "pebble", "petal", "pine", "planet", "pond", "puddle", "quasar", "rain", "rainbow", "reef", "ripple", "river", "shore", "sky", "snowflake", "spark", "spring", "star", "stardust", "starlight", "storm", "stream", "summit", "sun", "sunbeam", "sunrise", "sunset", "thunder", "tide", "twilight", "valley", "volcano", "waterfall", "wave", "willow", "wind", "alpaca", "axolotl", "badger", "bear", "beaver", "bee", "bird", "bumblebee", "bunny", "cat", "chipmunk", "crab", "crane", "deer", "dolphin", "dove", "dragon", "dragonfly", "duckling", "eagle", "elephant", "falcon", "finch", "flamingo", "fox", "frog", "giraffe", "goose", "hamster", "hare", "hedgehog", "hippo", "hummingbird", "jellyfish", "kitten", "koala", "ladybug", "lark", "lemur", "llama", "lobster", "lynx", "manatee", "meerkat", "moth", "narwhal", "newt", "octopus", "otter", "owl", "panda", "parrot", "peacock", "pelican", "penguin", "phoenix", "piglet", "platypus", "pony", "porcupine", "puffin", "puppy", "quail", "quokka", "rabbit", "raccoon", "raven", "robin", "salamander", "seahorse", "seal", "sloth", "snail", "sparrow", "sphinx", "squid", "squirrel", "starfish", "swan", "tiger", "toucan", "turtle", "unicorn", "walrus", "whale", "wolf", "wombat", "wren", "yeti", "zebra", "acorn", "anchor", "balloon", "beacon", "biscuit", "blanket", "bonbon", "book", "boot", "cake", "candle", "candy", "castle", "charm", "clock", "cocoa", "cookie", "crayon", "crown", "cupcake", "donut", "dream", "fairy", "fiddle", "flask", "flute", "fountain", "gadget", "gem", "gizmo", "globe", "goblet", "hammock", "harp", "haven", "hearth", "honey", "journal", "kazoo", "kettle", "key", "kite", "lantern", "lemon", "lighthouse", "locket", "lollipop", "mango", "map", "marble", "marshmallow", "melody", "mitten", "mochi", "muffin", "music", "nest", "noodle", "oasis", "origami", "pancake", "parasol", "peach", "pearl", "pebble", "pie", "pillow", "pinwheel", "pixel", "pizza", "plum", "popcorn", "pretzel", "prism", "pudding", "pumpkin", "puzzle", "quiche", "quill", "quilt", "riddle", "rocket", "rose", "scone", "scroll", "shell", "sketch", "snowglobe", "sonnet", "sparkle", "spindle", "sprout", "sundae", "swing", "taco", "teacup", "teapot", "thimble", "toast", "token", "tome", "tower", "treasure", "treehouse", "trinket", "truffle", "tulip", "umbrella", "waffle", "wand", "whisper", "whistle", "widget", "wreath", "zephyr", "abelson", "adleman", "aho", "allen", "babbage", "bachman", "backus", "barto", "bengio", "bentley", "blum", "boole", "brooks", "catmull", "cerf", "cherny", "church", "clarke", "cocke", "codd", "conway", "cook", "corbato", "cray", "curry", "dahl", "diffie", "dijkstra", "dongarra", "eich", "emerson", "engelbart", "feigenbaum", "floyd", "gosling", "graham", "gray", "hamming", "hanrahan", "hartmanis", "hejlsberg", "hellman", "hennessy", "hickey", "hinton", "hoare", "hollerith", "hopcroft", "hopper", "iverson", "kahan", "kahn", "karp", "kay", "kernighan", "knuth", "kurzweil", "lamport", "lampson", "lecun", "lerdorf", "liskov", "lovelace", "matsumoto", "mccarthy", "metcalfe", "micali", "milner", "minsky", "moler", "moore", "naur", "neumann", "newell", "nygaard", "papert", "parnas", "pascal", "patterson", "pearl", "perlis", "pike", "pnueli", "rabin", "reddy", "ritchie", "rivest", "rossum", "russell", "scott", "sedgewick", "shamir", "shannon", "sifakis", "simon", "stallman", "stearns", "steele", "stonebraker", "stroustrup", "sutherland", "sutton", "tarjan", "thacker", "thompson", "torvalds", "turing", "ullman", "valiant", "wadler", "wall", "wigderson", "wilkes", "wilkinson", "wirth", "wozniak", "yao"], gJz = ["baking", "beaming", "booping", "bouncing", "brewing", "bubbling", "chasing", "churning", "coalescing", "conjuring", "cooking", "crafting", "crunching", "cuddling", "dancing", "dazzling", "discovering", "doodling", "dreaming", "drifting", "enchanting", "exploring", "finding", "floating", "fluttering", "foraging", "forging", "frolicking", "gathering", "giggling", "gliding", "greeting", "growing", "hatching", "herding", "honking", "hopping", "hugging", "humming", "imagining", "inventing", "jingling", "juggling", "jumping", "kindling", "knitting", "launching", "leaping", "mapping", "marinating", "meandering", "mixing", "moseying", "munching", "napping", "nibbling", "noodling", "orbiting", "painting", "percolating", "petting", "plotting", "pondering", "popping", "prancing", "purring", "puzzling", "questing", "riding", "roaming", "rolling", "sauteeing", "scribbling", "seeking", "shimmying", "singing", "skipping", "sleeping", "snacking", "sniffing", "snuggling", "soaring", "sparking", "spinning", "splashing", "sprouting", "squishing", "stargazing", "stirring", "strolling", "swimming", "swinging", "tickling", "tinkering", "toasting", "tumbling", "twirling", "waddling", "wandering", "watching", "weaving", "whistling", "wibbling", "wiggling", "wishing", "wobbling", "wondering", "yawning", "zooming"]
})
// @from(Ln 257535, Col 0)
function g56(q, K) {
    let _ = q ?? I8(),
        z = h86(),
        Y = z.get(_);
    if (!Y) {
        let A = aO(),
            O = K ? MR4(K) : "";
        for (let w = 0; w < iJz; w++) {
            Y = O ? `${O}-${Zh6()}` : Bb8();
            let $ = F56(A, `${Y}.md`);
            if (!V8().existsSync($)) break
        }
        z.set(_, Y)
    }
    return Y
}
// @from(Ln 257552, Col 0)
function pb8(q) {
    return h86().get(q ?? I8())
}
// @from(Ln 257556, Col 0)
function jn1(q, K) {
    h86().set(q, K)
}
// @from(Ln 257560, Col 0)
function PR4() {
    h86().clear()
}
// @from(Ln 257564, Col 0)
function eW(q) {
    let K = g56(I8());
    if (!q) return F56(aO(), `${K}.md`);
    return F56(aO(), `${K}-agent-${q}.md`)
}
// @from(Ln 257570, Col 0)
function lP(q) {
    let K = eW(q);
    try {
        return V8().readFileSync(K, {
            encoding: "utf-8"
        })
    } catch (_) {
        if (t1(_)) return null;
        return j6(_), null
    }
}
// @from(Ln 257582, Col 0)
function WR4(q) {
    return q.messages.find((K) => K.slug)?.slug
}
// @from(Ln 257585, Col 0)
async function Fb8(q, K) {
    let _ = WR4(q);
    if (!_) return !1;
    let z = K ?? I8();
    jn1(z, _);
    let Y = F56(aO(), `${_}.md`);
    try {
        return await V8().readFile(Y, {
            encoding: "utf-8"
        }), !0
    } catch (A) {
        if (!t1(A)) return j6(A), !1;
        if (mb8() === null) return !1;
        E(`Plan file missing during resume: ${Y}. Attempting recovery.`);
        let O = oJz(q.messages, "plan"),
            w = null;
        if (O && O.content.length > 0) w = O.content, E(`Plan recovered from file snapshot, ${w.length} chars`, {
            level: "info"
        });
        else if (w = rJz(q), w) E(`Plan recovered from message history, ${w.length} chars`, {
            level: "info"
        });
        if (w) try {
            return await cJz(Y, w, {
                encoding: "utf-8"
            }), !0
        } catch ($) {
            return j6($), !1
        }
        return E("Plan file recovery failed: no file snapshot or plan content found in message history"), !1
    }
}
// @from(Ln 257617, Col 0)
async function DR4(q, K) {
    let _ = WR4(q);
    if (!_) return !1;
    let z = aO(),
        Y = F56(z, `${_}.md`),
        A = g56(K),
        O = F56(z, `${A}.md`);
    try {
        return await dJz(Y, O), !0
    } catch (w) {
        if (t1(w)) return !1;
        return j6(w), !1
    }
}
// @from(Ln 257632, Col 0)
function rJz(q) {
    for (let K = q.messages.length - 1; K >= 0; K--) {
        let _ = q.messages[K];
        if (!_) continue;
        if (_.type === "assistant") {
            let {
                content: z
            } = _.message;
            if (Array.isArray(z)) {
                for (let Y of z)
                    if (Y.type === "tool_use" && Y.name === dP) {
                        let O = Y.input?.plan;
                        if (typeof O === "string" && O.length > 0) return O
                    }
            }
        }
        if (_.type === "user") {
            let z = _;
            if (typeof z.planContent === "string" && z.planContent.length > 0) return z.planContent
        }
        if (_.type === "attachment") {
            let z = _;
            if (z.attachment?.type === "plan_file_reference") {
                let Y = z.attachment.planContent;
                if (typeof Y === "string" && Y.length > 0) return Y
            }
        }
    }
    return null
}
// @from(Ln 257663, Col 0)
function oJz(q, K) {
    for (let _ = q.length - 1; _ >= 0; _--) {
        let z = q[_];
        if (z?.type === "system" && "subtype" in z && z.subtype === "file_snapshot" && "snapshotFiles" in z) return z.snapshotFiles.find((A) => A.key === K)
    }
    return
}
// @from(Ln 257670, Col 0)
async function gb8() {
    if (mb8() === null) return;
    try {
        let q = [],
            K = lP();
        if (K) q.push({
            key: "plan",
            path: eW(),
            content: K
        });
        if (q.length === 0) return;
        let _ = {
                type: "system",
                subtype: "file_snapshot",
                content: "File snapshot",
                level: "info",
                isMeta: !0,
                timestamp: new Date().toISOString(),
                uuid: QJz(),
                snapshotFiles: q
            },
            {
                recordTranscript: z
            } = await Promise.resolve().then(() => (g4(), Ub8));
        await z([_])
    } catch (q) {
        j6(q)
    }
}
// @from(Ln 257699, Col 4)
iJz = 10
// @from(Ln 257700, Col 4)
aO
// @from(Ln 257701, Col 4)
NJ = L(() => {
    U4();
    y8();
    n7();
    K8();
    Q8();
    m8();
    $n1();
    Yq();
    U8();
    a1();
    S88();
    aO = P1(function() {
        let _ = v7().plansDirectory,
            z;
        if (_) {
            let Y = b8(),
                A = lJz(Y, _);
            if (!A.startsWith(Y + nJz) && A !== Y) j6(Error(`plansDirectory must be within project root: ${_}`)), z = F56(A7(), "plans");
            else z = A
        } else z = F56(A7(), "plans");
        try {
            V8().mkdirSync(z)
        } catch (Y) {
            j6(Y)
        }
        return z
    })
})
// @from(Ln 257731, Col 0)
function aJz(q, K, _) {
    var z = -1,
        Y = q.length;
    if (K < 0) K = -K > Y ? 0 : Y + K;
    if (_ = _ > Y ? Y : _, _ < 0) _ += Y;
    Y = K > _ ? 0 : _ - K >>> 0, K >>>= 0;
    var A = Array(Y);
    while (++z < Y) A[z] = q[z + K];
    return A
}
// @from(Ln 257741, Col 4)
Qb8
// @from(Ln 257742, Col 4)
Hn1 = L(() => {
    Qb8 = aJz
})
// @from(Ln 257746, Col 0)
function sJz(q, K, _) {
    var z = q.length;
    return _ = _ === void 0 ? z : _, !K && _ >= z ? q : Qb8(q, K, _)
}
// @from(Ln 257750, Col 4)
ZR4
// @from(Ln 257751, Col 4)
fR4 = L(() => {
    Hn1();
    ZR4 = sJz
})
// @from(Ln 257756, Col 0)
function OXz(q) {
    return AXz.test(q)
}
// @from(Ln 257759, Col 4)
tJz = "\\ud800-\\udfff"
// @from(Ln 257760, Col 4)
eJz = "\\u0300-\\u036f"
// @from(Ln 257761, Col 4)
qXz = "\\ufe20-\\ufe2f"
// @from(Ln 257762, Col 4)
KXz = "\\u20d0-\\u20ff"
// @from(Ln 257763, Col 4)
_Xz
// @from(Ln 257763, Col 9)
zXz = "\\ufe0e\\ufe0f"
// @from(Ln 257764, Col 4)
YXz = "\\u200d"
// @from(Ln 257765, Col 4)
AXz
// @from(Ln 257765, Col 9)
db8
// @from(Ln 257766, Col 4)
Jn1 = L(() => {
    _Xz = eJz + qXz + KXz, AXz = RegExp("[" + YXz + tJz + _Xz + zXz + "]");
    db8 = OXz
})
// @from(Ln 257771, Col 0)
function wXz(q) {
    return q.split("")
}
// @from(Ln 257774, Col 4)
GR4
// @from(Ln 257775, Col 4)
vR4 = L(() => {
    GR4 = wXz
})
// @from(Ln 257779, Col 0)
function vXz(q) {
    return q.match(GXz) || []
}
// @from(Ln 257782, Col 4)
TR4 = "\\ud800-\\udfff"
// @from(Ln 257783, Col 4)
$Xz = "\\u0300-\\u036f"
// @from(Ln 257784, Col 4)
jXz = "\\ufe20-\\ufe2f"
// @from(Ln 257785, Col 4)
HXz = "\\u20d0-\\u20ff"
// @from(Ln 257786, Col 4)
JXz
// @from(Ln 257786, Col 9)
XXz = "\\ufe0e\\ufe0f"
// @from(Ln 257787, Col 4)
MXz
// @from(Ln 257787, Col 9)
Xn1
// @from(Ln 257787, Col 14)
Mn1 = "\\ud83c[\\udffb-\\udfff]"
// @from(Ln 257788, Col 4)
PXz
// @from(Ln 257788, Col 9)
VR4
// @from(Ln 257788, Col 14)
kR4 = "(?:\\ud83c[\\udde6-\\uddff]){2}"
// @from(Ln 257789, Col 4)
NR4 = "[\\ud800-\\udbff][\\udc00-\\udfff]"
// @from(Ln 257790, Col 4)
WXz = "\\u200d"
// @from(Ln 257791, Col 4)
ER4
// @from(Ln 257791, Col 9)
yR4
// @from(Ln 257791, Col 14)
DXz
// @from(Ln 257791, Col 19)
ZXz
// @from(Ln 257791, Col 24)
fXz
// @from(Ln 257791, Col 29)
GXz
// @from(Ln 257791, Col 34)
LR4
// @from(Ln 257792, Col 4)
hR4 = L(() => {
    JXz = $Xz + jXz + HXz, MXz = "[" + TR4 + "]", Xn1 = "[" + JXz + "]", PXz = "(?:" + Xn1 + "|" + Mn1 + ")", VR4 = "[^" + TR4 + "]", ER4 = PXz + "?", yR4 = "[" + XXz + "]?", DXz = "(?:" + WXz + "(?:" + [VR4, kR4, NR4].join("|") + ")" + yR4 + ER4 + ")*", ZXz = yR4 + ER4 + DXz, fXz = "(?:" + [VR4 + Xn1 + "?", Xn1, kR4, NR4, MXz].join("|") + ")", GXz = RegExp(Mn1 + "(?=" + Mn1 + ")|" + fXz + ZXz, "g");
    LR4 = vXz
})
// @from(Ln 257797, Col 0)
function TXz(q) {
    return db8(q) ? LR4(q) : GR4(q)
}
// @from(Ln 257800, Col 4)
RR4
// @from(Ln 257801, Col 4)
SR4 = L(() => {
    vR4();
    Jn1();
    hR4();
    RR4 = TXz
})
// @from(Ln 257808, Col 0)
function VXz(q) {
    return function(K) {
        K = WD6(K);
        var _ = db8(K) ? RR4(K) : void 0,
            z = _ ? _[0] : K.charAt(0),
            Y = _ ? ZR4(_, 1).join("") : K.slice(1);
        return z[q]() + Y
    }
}
// @from(Ln 257817, Col 4)
CR4
// @from(Ln 257818, Col 4)
bR4 = L(() => {
    fR4();
    Jn1();
    SR4();
    hO8();
    CR4 = VXz
})
// @from(Ln 257825, Col 4)
kXz
// @from(Ln 257825, Col 9)
IR4
// @from(Ln 257826, Col 4)
xR4 = L(() => {
    bR4();
    kXz = CR4("toUpperCase"), IR4 = kXz
})
// @from(Ln 257831, Col 0)
function NXz(q) {
    return IR4(WD6(q).toLowerCase())
}
// @from(Ln 257834, Col 4)
gH6
// @from(Ln 257835, Col 4)
cb8 = L(() => {
    hO8();
    xR4();
    gH6 = NXz
})
// @from(Ln 257848, Col 0)
function LXz(q) {
    let K = EXz(),
        _ = [],
        z = mR4[q.toLowerCase()];
    if (!z) return _;
    let Y = process.env.APPDATA || OT(K, "AppData", "Roaming"),
        A = process.env.LOCALAPPDATA || OT(K, "AppData", "Local");
    switch (uR4()) {
        case "darwin":
            if (_.push(OT(K, "Library", "Application Support", "JetBrains"), OT(K, "Library", "Application Support")), q.toLowerCase() === "androidstudio") _.push(OT(K, "Library", "Application Support", "Google"));
            break;
        case "win32":
            if (_.push(OT(Y, "JetBrains"), OT(A, "JetBrains"), OT(Y)), q.toLowerCase() === "androidstudio") _.push(OT(A, "Google"));
            break;
        case "linux":
            _.push(OT(K, ".config", "JetBrains"), OT(K, ".local", "share", "JetBrains"));
            for (let O of z) _.push(OT(K, "." + O));
            if (q.toLowerCase() === "androidstudio") _.push(OT(K, ".config", "Google"));
            break;
        default:
            break
    }
    return _
}
// @from(Ln 257872, Col 0)
async function hXz(q) {
    let K = [],
        _ = V8(),
        z = LXz(q),
        Y = mR4[q.toLowerCase()];
    if (!Y) return K;
    let A = Y.map((O) => new RegExp("^" + O));
    for (let O of z) try {
        let w = await _.readdir(O);
        for (let $ of A)
            for (let j of w) {
                if (!$.test(j.name)) continue;
                if (!j.isDirectory() && !j.isSymbolicLink()) continue;
                let H = OT(O, j.name);
                if (uR4() === "linux") {
                    K.push(H);
                    continue
                }
                let J = OT(H, "plugins");
                try {
                    await _.stat(J), K.push(J)
                } catch {}
            }
    } catch {
        continue
    }
    return K.filter((O, w) => K.indexOf(O) === w)
}
// @from(Ln 257900, Col 0)
async function RXz(q) {
    let K = await hXz(q);
    for (let _ of K) {
        let z = OT(_, yXz);
        try {
            return await V8().stat(z), !0
        } catch {}
    }
    return !1
}
// @from(Ln 257910, Col 0)
async function SXz(q, K = !1) {
    if (!K) {
        let z = Pn1.get(q);
        if (z) return z
    }
    let _ = RXz(q).then((z) => {
        return Wn1.set(q, z), z
    });
    return Pn1.set(q, _), _
}
// @from(Ln 257920, Col 0)
async function BR4(q, K = !1) {
    if (K) Wn1.delete(q), Pn1.delete(q);
    return SXz(q, K)
}
// @from(Ln 257925, Col 0)
function pR4(q) {
    return Wn1.get(q) ?? !1
}
// @from(Ln 257928, Col 4)
yXz = "claude-code-jetbrains-plugin"
// @from(Ln 257929, Col 4)
mR4
// @from(Ln 257929, Col 9)
Wn1
// @from(Ln 257929, Col 14)
Pn1
// @from(Ln 257930, Col 4)
Dn1 = L(() => {
    Yq();
    mR4 = {
        pycharm: ["PyCharm"],
        intellij: ["IntelliJIdea", "IdeaIC"],
        webstorm: ["WebStorm"],
        phpstorm: ["PhpStorm"],
        rubymine: ["RubyMine"],
        clion: ["CLion"],
        goland: ["GoLand"],
        rider: ["Rider"],
        datagrip: ["DataGrip"],
        appcode: ["AppCode"],
        dataspell: ["DataSpell"],
        aqua: ["Aqua"],
        gateway: ["Gateway"],
        fleet: ["Fleet"],
        androidstudio: ["AndroidStudio"]
    };
    Wn1 = new Map, Pn1 = new Map
})
// @from(Ln 257954, Col 0)
class fh6 {
    wslDistroName;
    constructor(q) {
        this.wslDistroName = q
    }
    toLocalPath(q) {
        if (!q) return q;
        if (this.wslDistroName) {
            let K = q.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)(.*)$/);
            if (K && K[1] !== this.wslDistroName) return q
        }
        try {
            return FR4("wslpath", ["-u", q], {
                encoding: "utf8",
                stdio: ["pipe", "pipe", "ignore"]
            }).trim()
        } catch {
            return q.replaceAll("\\", "/").replace(/^([A-Z]):/i, (K, _) => `/mnt/${_.toLowerCase()}`)
        }
    }
    toIDEPath(q) {
        if (!q) return q;
        try {
            return FR4("wslpath", ["-w", q], {
                encoding: "utf8",
                stdio: ["pipe", "pipe", "ignore"]
            }).trim()
        } catch {
            return q
        }
    }
}
// @from(Ln 257987, Col 0)
function gR4(q, K) {
    let _ = q.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)(.*)$/);
    if (_) return _[1] === K;
    return !0
}
// @from(Ln 257992, Col 4)
Zn1 = () => {}
// @from(Ln 257993, Col 4)
QR4 = {}
// @from(Ln 257999, Col 0)
function fn1(q) {
    let K = s(23),
        {
            onDone: _,
            installationStatus: z
        } = q;
    CXz();
    let Y;
    if (K[0] !== _) Y = {
        "confirm:yes": _,
        "confirm:no": _
    }, K[0] = _, K[1] = Y;
    else Y = K[1];
    let A;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) A = {
        context: "Confirmation"
    }, K[2] = A;
    else A = K[2];
    L7(Y, A);
    let O;
    if (K[3] !== z?.ideType) O = z?.ideType ?? Gh6(), K[3] = z?.ideType, K[4] = O;
    else O = K[4];
    let w = O,
        $ = Up(w),
        j;
    if (K[5] !== w) j = kH(w), K[5] = w, K[6] = j;
    else j = K[6];
    let H = j,
        J = z?.installedVersion,
        X = $ ? "plugin" : "extension",
        M = X7.platform === "darwin" ? "Cmd+Option+K" : "Ctrl+Alt+K",
        P;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) P = WX.default.createElement(T, {
        color: "claude"
    }, "✻ "), K[7] = P;
    else P = K[7];
    let W;
    if (K[8] !== H) W = WX.default.createElement(WX.default.Fragment, null, P, WX.default.createElement(T, null, "Welcome to Claude Code for ", H)), K[8] = H, K[9] = W;
    else W = K[9];
    let D = J ? `installed ${X} v${J}` : void 0,
        Z;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) Z = WX.default.createElement(T, {
        color: "suggestion"
    }, "⧉ open files"), K[10] = Z;
    else Z = K[10];
    let G;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) G = WX.default.createElement(T, null, "• Claude has context of ", Z, " ", "and ", WX.default.createElement(T, {
        color: "suggestion"
    }, "⧉ selected lines")), K[11] = G;
    else G = K[11];
    let f;
    if (K[12] === Symbol.for("react.memo_cache_sentinel")) f = WX.default.createElement(T, {
        color: "diffAddedWord"
    }, "+11"), K[12] = f;
    else f = K[12];
    let v;
    if (K[13] === Symbol.for("react.memo_cache_sentinel")) v = WX.default.createElement(T, null, "• Review Claude Code's changes", " ", f, " ", WX.default.createElement(T, {
        color: "diffRemovedWord"
    }, "-22"), " in the comfort of your IDE"), K[13] = v;
    else v = K[13];
    let V;
    if (K[14] === Symbol.for("react.memo_cache_sentinel")) V = WX.default.createElement(T, null, "• Cmd+Esc", WX.default.createElement(T, {
        dimColor: !0
    }, " for Quick Launch")), K[14] = V;
    else V = K[14];
    let k;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) k = WX.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, G, v, V, WX.default.createElement(T, null, "• ", M, WX.default.createElement(T, {
        dimColor: !0
    }, " to reference files or lines in your input"))), K[15] = k;
    else k = K[15];
    let N;
    if (K[16] !== _ || K[17] !== W || K[18] !== D) N = WX.default.createElement(R1, {
        title: W,
        subtitle: D,
        color: "ide",
        onCancel: _,
        hideInputGuide: !0
    }, k), K[16] = _, K[17] = W, K[18] = D, K[19] = N;
    else N = K[19];
    let R;
    if (K[20] === Symbol.for("react.memo_cache_sentinel")) R = WX.default.createElement(u, {
        paddingX: 1
    }, WX.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Press ", WX.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }))), K[20] = R;
    else R = K[20];
    let h;
    if (K[21] !== N) h = WX.default.createElement(WX.default.Fragment, null, N, R), K[21] = N, K[22] = h;
    else h = K[22];
    return h
}
// @from(Ln 258098, Col 0)
function UR4() {
    let q = H8(),
        K = UE.terminal || "unknown";
    return q.hasIdeOnboardingBeenShown?.[K] === !0
}
// @from(Ln 258104, Col 0)
function CXz() {
    if (UR4()) return;
    let q = UE.terminal || "unknown";
    d8((K) => ({
        ...K,
        hasIdeOnboardingBeenShown: {
            ...K.hasIdeOnboardingBeenShown,
            [q]: !0
        }
    }))
}
// @from(Ln 258115, Col 4)
WX
// @from(Ln 258116, Col 4)
Gn1 = L(() => {
    o6();
    w46();
    g6();
    C7();
    h1();
    D_();
    kj();
    S4();
    u7();
    WX = K6(P6(), 1)
})
// @from(Ln 258138, Col 0)
function rR4(q) {
    try {
        return process.kill(q, 0), !0
    } catch {
        return !1
    }
}
// @from(Ln 258146, Col 0)
function xXz() {
    let q = null;
    return () => {
        if (!q) q = pZq(process.ppid, 10).then((K) => new Set(K));
        return q
    }
}
// @from(Ln 258154, Col 0)
function nb8(q) {
    if (!q) return !1;
    let K = vh6[q];
    return K && K.ideKind === "vscode"
}
// @from(Ln 258160, Col 0)
function Up(q) {
    if (!q) return !1;
    let K = vh6[q];
    return K && K.ideKind === "jetbrains"
}
// @from(Ln 258166, Col 0)
function Gh6() {
    if (!q0()) return null;
    return X7.terminal
}
// @from(Ln 258170, Col 0)
async function ib8() {
    try {
        let q = await mXz();
        return (await Promise.all(q.map(async (_) => {
            try {
                let Y = (await V8().readdir(_)).filter((O) => O.name.endsWith(".lock"));
                return (await Promise.all(Y.map(async (O) => {
                    let w = vn1(_, O.name);
                    try {
                        let $ = await V8().stat(w);
                        return {
                            path: w,
                            mtime: $.mtime
                        }
                    } catch {
                        return null
                    }
                }))).filter((O) => O !== null)
            } catch (z) {
                if (!D5(z)) j6(z);
                return []
            }
        }))).flat().sort((_, z) => z.mtime.getTime() - _.mtime.getTime()).map((_) => _.path)
    } catch (q) {
        return j6(q), []
    }
}
// @from(Ln 258197, Col 0)
async function oR4(q) {
    try {
        let K = await V8().readFile(q, {
                encoding: "utf-8"
            }),
            _ = [],
            z, Y, A = !1,
            O = !1,
            w;
        try {
            let H = n8(K);
            if (H.workspaceFolders) _ = H.workspaceFolders;
            z = H.pid, Y = H.ideName, A = H.transport === "ws", O = H.runningInWindows === !0, w = H.authToken
        } catch (H) {
            _ = K.split(`
`).map((J) => J.trim())
        }
        let $ = q.split(lb8).pop();
        if (!$) return null;
        let j = $.replace(".lock", "");
        return {
            workspaceFolders: _,
            port: parseInt(j),
            pid: z,
            ideName: Y,
            useWebSocket: A,
            runningInWindows: O,
            authToken: w
        }
    } catch (K) {
        return j6(K), null
    }
}
// @from(Ln 258230, Col 0)
async function Vn1(q, K, _ = 500) {
    try {
        return new Promise((z) => {
            let Y = bXz({
                host: q,
                port: K,
                timeout: _
            });
            Y.on("connect", () => {
                Y.destroy(), z(!0)
            }), Y.on("error", () => {
                z(!1)
            }), Y.on("timeout", () => {
                Y.destroy(), z(!1)
            })
        })
    } catch (z) {
        return !1
    }
}
// @from(Ln 258250, Col 0)
async function mXz() {
    let q = [vn1(A7(), "ide")];
    if (y1() !== "wsl") return q;
    let K = await uXz();
    if (K) {
        let z = new fh6(process.env.WSL_DISTRO_NAME).toLocalPath(K);
        q.push(Tn1(z, ".claude", "ide"))
    }
    try {
        let z = await V8().readdir("/mnt/c/Users");
        for (let Y of z) {
            if (!Y.isDirectory() && !Y.isSymbolicLink()) continue;
            if (Y.name === "Public" || Y.name === "Default" || Y.name === "Default User" || Y.name === "All Users") continue;
            q.push(vn1("/mnt/c/Users", Y.name, ".claude", "ide"))
        }
    } catch (_) {
        if (D5(_)) E(`WSL IDE lockfile path detection failed (${_.code}): ${b6(_)}`);
        else j6(_)
    }
    return q
}
// @from(Ln 258271, Col 0)
async function BXz() {
    try {
        let q = await ib8();
        for (let K of q) {
            let _ = await oR4(K);
            if (!_) {
                try {
                    await V8().unlink(K)
                } catch (A) {
                    j6(A)
                }
                continue
            }
            let z = await AS4(_.runningInWindows, _.port),
                Y = !1;
            if (_.pid) {
                if (!rR4(_.pid)) {
                    if (y1() !== "wsl") Y = !0;
                    else if (!await Vn1(z, _.port)) Y = !0
                }
            } else if (!await Vn1(z, _.port)) Y = !0;
            if (Y) try {
                await V8().unlink(K)
            } catch (A) {
                j6(A)
            }
        }
    } catch (q) {
        j6(q)
    }
}
// @from(Ln 258302, Col 0)
async function pXz(q) {
    try {
        let K = await gXz(q);
        if (d("tengu_ext_installed", {}), !H8().diffTool) d8((z) => ({
            ...z,
            diffTool: "auto"
        }));
        return {
            installed: !0,
            error: null,
            installedVersion: K,
            ideType: q
        }
    } catch (K) {
        d("tengu_ext_install_error", {});
        let _ = K instanceof Error ? K.message : String(K);
        return j6(K), {
            installed: !1,
            error: _,
            installedVersion: null,
            ideType: q
        }
    }
}
// @from(Ln 258326, Col 0)
async function cR4() {
    if (UH6) UH6.abort();
    UH6 = F5();
    let q = UH6.signal;
    await BXz();
    let K = Date.now();
    while (Date.now() - K < 30000 && !q.aborted) {
        if (MY6()) {
            await l7(1000, q);
            continue
        }
        let _ = await Vh6(!1);
        if (q.aborted) return null;
        if (_.length === 1) return _[0];
        await l7(1000, q)
    }
    return null
}
// @from(Ln 258345, Col 0)
function aR4() {
    if (UH6) UH6.abort(), UH6 = null
}
// @from(Ln 258348, Col 0)
async function Vh6(q) {
    let K = [];
    try {
        let _ = process.env.CLAUDE_CODE_SSE_PORT,
            z = _ ? parseInt(_) : null,
            Y = Y7().normalize("NFC"),
            A = await ib8(),
            O = await Promise.all(A.map(oR4)),
            w = xXz(),
            $ = y1() !== "wsl" && q0();
        for (let j of O) {
            if (!j) continue;
            let H = !1;
            if (S6(process.env.CLAUDE_CODE_IDE_SKIP_VALID_CHECK)) H = !0;
            else if (j.port === z) H = !0;
            else H = j.workspaceFolders.some((P) => {
                if (!P) return !1;
                let W = P;
                if (y1() === "wsl" && j.runningInWindows && process.env.WSL_DISTRO_NAME) {
                    if (!gR4(P, process.env.WSL_DISTRO_NAME)) return !1;
                    let Z = Tn1(W).normalize("NFC");
                    if (Y === Z || Y.startsWith(Z + lb8)) return !0;
                    W = new fh6(process.env.WSL_DISTRO_NAME).toLocalPath(P)
                }
                let D = Tn1(W).normalize("NFC");
                if (y1() === "windows") {
                    let Z = Y.replace(/^[a-zA-Z]:/, (f) => f.toUpperCase()),
                        G = D.replace(/^[a-zA-Z]:/, (f) => f.toUpperCase());
                    return Z === G || Z.startsWith(G + lb8)
                }
                return Y === D || Y.startsWith(D + lb8)
            });
            if (!H && !q) continue;
            if ($) {
                if (!(z !== null && j.port === z)) {
                    if (!j.pid || !rR4(j.pid)) continue;
                    if (process.ppid !== j.pid) {
                        if (!(await w()).has(j.pid)) continue
                    }
                }
            }
            let J = j.ideName ?? (q0() ? kH(UE.terminal) : "IDE"),
                X = await AS4(j.runningInWindows, j.port),
                M;
            if (j.useWebSocket) M = `ws://${X}:${j.port}`;
            else M = `http://${X}:${j.port}/sse`;
            K.push({
                url: M,
                name: J,
                workspaceFolders: j.workspaceFolders,
                port: j.port,
                isValid: H,
                authToken: j.authToken,
                ideRunningInWindows: j.runningInWindows
            })
        }
        if (!q && z) {
            let j = K.filter((H) => H.isValid && H.port === z);
            if (j.length === 1) return j
        }
    } catch (_) {
        j6(_)
    }
    return K
}
// @from(Ln 258413, Col 0)
async function sR4(q) {
    await q.notification({
        method: "ide_connected",
        params: {
            pid: process.pid
        }
    })
}
// @from(Ln 258422, Col 0)
function rb8(q) {
    return q.some((K) => K.type === "connected" && K.name === "ide")
}
// @from(Ln 258425, Col 0)
async function lR4(q) {
    if (nb8(q)) {
        let K = await tR4(q);
        if (K) try {
            if ((await M7(K, ["--list-extensions"], {
                    env: Nn1()
                })).stdout?.includes(FXz)) return !0
        } catch {}
    } else if (Up(q)) return await BR4(q);
    return !1
}
// @from(Ln 258436, Col 0)
async function gXz(q) {
    if (nb8(q)) {
        let K = await tR4(q);
        if (K) {
            let _ = await UXz(K);
            if (!_ || Qa(_, nR4())) {
                await l7(500);
                let z = await M7(K, ["--force", "--install-extension", "anthropic.claude-code"], {
                    env: Nn1()
                });
                if (z.code !== 0) throw Error(`${z.code}: ${z.error} ${z.stderr}`);
                _ = nR4()
            }
            return _
        }
    }
    return null
}
// @from(Ln 258455, Col 0)
function Nn1() {
    if (y1() === "linux") return {
        ...process.env,
        DISPLAY: ""
    };
    return
}
// @from(Ln 258463, Col 0)
function nR4() {
    return {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.112",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-04-16T18:33:19Z"
    }.VERSION
}
// @from(Ln 258473, Col 0)
async function UXz(q) {
    let {
        stdout: K
    } = await w1(q, ["--list-extensions", "--show-versions"], {
        env: Nn1()
    }), _ = K?.split(`
`) || [];
    for (let z of _) {
        let [Y, A] = z.split("@");
        if (Y === "anthropic.claude-code" && A) return A
    }
    return null
}
// @from(Ln 258487, Col 0)
function QXz() {
    try {
        if (y1() !== "macos") return null;
        let K = process.ppid;
        for (let _ = 0; _ < 10; _++) {
            if (!K || K === 0 || K === 1) break;
            let z = oC(`ps -o command= -p ${K}`)?.trim();
            if (z) {
                let A = {
                        "Visual Studio Code.app": "code",
                        "Cursor.app": "cursor",
                        "Windsurf.app": "windsurf",
                        "Visual Studio Code - Insiders.app": "code",
                        "VSCodium.app": "codium"
                    },
                    O = "/Contents/MacOS/Electron";
                for (let [w, $] of Object.entries(A)) {
                    let j = z.indexOf(w + "/Contents/MacOS/Electron");
                    if (j !== -1) {
                        let H = j + w.length;
                        return z.substring(0, H) + "/Contents/Resources/app/bin/" + $
                    }
                }
            }
            let Y = oC(`ps -o ppid= -p ${K}`)?.trim();
            if (!Y) break;
            K = parseInt(Y.trim())
        }
        return null
    } catch {
        return null
    }
}
// @from(Ln 258520, Col 0)
async function tR4(q) {
    let K = QXz();
    if (K) try {
        return await V8().stat(K), K
    } catch {}
    let _ = y1() === "windows" ? ".cmd" : "";
    switch (q) {
        case "vscode":
            return "code" + _;
        case "cursor":
            return "cursor" + _;
        case "windsurf":
            return "windsurf" + _;
        default:
            break
    }
    return null
}
// @from(Ln 258538, Col 0)
async function eR4() {
    return (await w1("cursor", ["--version"])).code === 0
}
// @from(Ln 258541, Col 0)
async function qS4() {
    return (await w1("windsurf", ["--version"])).code === 0
}
// @from(Ln 258544, Col 0)
async function KS4() {
    let q = await w1("code", ["--help"]);
    return q.code === 0 && Boolean(q.stdout?.includes("Visual Studio Code"))
}
// @from(Ln 258548, Col 0)
async function dXz() {
    let q = [];
    try {
        let K = y1();
        if (K === "macos") {
            let z = (await ij('ps aux | grep -E "Visual Studio Code|Code Helper|Cursor Helper|Windsurf Helper|IntelliJ IDEA|PyCharm|WebStorm|PhpStorm|RubyMine|CLion|GoLand|Rider|DataGrip|AppCode|DataSpell|Aqua|Gateway|Fleet|Android Studio" | grep -v grep', {
                reject: !1
            })).stdout ?? "";
            for (let [Y, A] of Object.entries(vh6))
                for (let O of A.processKeywordsMac)
                    if (z.includes(O)) {
                        q.push(Y);
                        break
                    }
        } else if (K === "windows") {
            let Y = ((await ij('tasklist | findstr /I "Code.exe Cursor.exe Windsurf.exe idea64.exe pycharm64.exe webstorm64.exe phpstorm64.exe rubymine64.exe clion64.exe goland64.exe rider64.exe datagrip64.exe appcode.exe dataspell64.exe aqua64.exe gateway64.exe fleet.exe studio64.exe"', {
                reject: !1
            })).stdout ?? "").toLowerCase();
            for (let [A, O] of Object.entries(vh6))
                for (let w of O.processKeywordsWindows)
                    if (Y.includes(w.toLowerCase())) {
                        q.push(A);
                        break
                    }
        } else if (K === "linux") {
            let Y = ((await ij('ps aux | grep -E "code|cursor|windsurf|idea|pycharm|webstorm|phpstorm|rubymine|clion|goland|rider|datagrip|dataspell|aqua|gateway|fleet|android-studio" | grep -v grep', {
                reject: !1
            })).stdout ?? "").toLowerCase();
            for (let [A, O] of Object.entries(vh6))
                for (let w of O.processKeywordsLinux)
                    if (Y.includes(w)) {
                        if (A !== "vscode") {
                            q.push(A);
                            break
                        } else if (!Y.includes("cursor") && !Y.includes("appcode")) {
                            q.push(A);
                            break
                        }
                    }
        }
    } catch (K) {
        j6(K)
    }
    return q
}
// @from(Ln 258593, Col 0)
async function En1() {
    let q = await dXz();
    return kn1 = q, q
}
// @from(Ln 258597, Col 0)
async function _S4() {
    if (kn1 === null) return En1();
    return kn1
}
// @from(Ln 258602, Col 0)
function ob8(q) {
    let K = q.find((_) => _.type === "connected" && _.name === "ide");
    return yn1(K)
}
// @from(Ln 258607, Col 0)
function yn1(q) {
    let K = q?.config;
    return K?.type === "sse-ide" || K?.type === "ws-ide" ? K.ideName : q0() ? kH(UE.terminal) : null
}
// @from(Ln 258612, Col 0)
function kH(q) {
    if (!q) return "IDE";
    let K = vh6[q];
    if (K) return K.displayName;
    let _ = iR4[q.toLowerCase().trim()];
    if (_) return _;
    let z = i5(q, " "),
        Y = z ? IXz(z).toLowerCase() : null;
    if (Y) {
        let A = iR4[Y];
        if (A) return A;
        return gH6(Y)
    }
    return gH6(q)
}
// @from(Ln 258628, Col 0)
function ky(q) {
    if (!q) return;
    let K = q.find((_) => _.type === "connected" && _.name === "ide");
    return K?.type === "connected" ? K : void 0
}
// @from(Ln 258633, Col 0)
async function zS4(q) {
    try {
        await Qp("closeAllDiffTabs", {}, q)
    } catch (K) {}
}
// @from(Ln 258638, Col 0)
async function YS4(q, K, _, z, Y) {
    cR4().then(q);
    let A = H8().autoInstallIdeExtension ?? !0;
    if (!S6(process.env.CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL) && A) {
        let O = K ?? Gh6();
        if (O) {
            if (nb8(O)) lR4(O).then(async (w) => {
                pXz(O).catch(($) => {
                    return {
                        installed: !1,
                        error: $.message || "Installation failed",
                        installedVersion: null,
                        ideType: O
                    }
                }).then(($) => {
                    if (z($), $?.installed && !Y?.aborted) cR4().then(q);
                    if (!w && $?.installed === !0 && !dR4().hasIdeOnboardingDialogBeenShown()) _()
                })
            });
            else if (Up(O)) lR4(O).then(async (w) => {
                if (w && !dR4().hasIdeOnboardingDialogBeenShown()) _()
            })
        }
    }
}
// @from(Ln 258663, Col 4)
dR4 = () => (Gn1(), B7(QR4))
// @from(Ln 258664, Col 4)
vh6
// @from(Ln 258664, Col 9)
C88
// @from(Ln 258664, Col 14)
Th6
// @from(Ln 258664, Col 19)
q0
// @from(Ln 258664, Col 23)
uXz
// @from(Ln 258664, Col 28)
UH6 = null
// @from(Ln 258665, Col 4)
FXz = "anthropic.claude-code"
// @from(Ln 258666, Col 4)
kn1 = null
// @from(Ln 258667, Col 4)
iR4
// @from(Ln 258667, Col 9)
AS4