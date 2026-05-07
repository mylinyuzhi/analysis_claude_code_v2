
// @from(Ln 555191, Col 4)
J$5 = `## Constructing a Hook (with verification)

Given an event, matcher, target file, and desired behavior, follow this flow. Each step catches a different failure class — a hook that silently does nothing is worse than no hook.

1. **Dedup check.** Read the target file. If a hook already exists on the same event+matcher, show the existing command and ask: keep it, replace it, or add alongside.

2. **Construct the command for THIS project — don't assume.** The hook receives JSON on stdin. Build a command that:
   - Extracts any needed payload safely — use \`jq -r\` into a quoted variable or \`{ read -r f; ... "$f"; }\`, NOT unquoted \`| xargs\` (splits on spaces)
   - Invokes the underlying tool the way this project runs it (npx/bunx/yarn/pnpm? Makefile target? globally-installed?)
   - Skips inputs the tool doesn't handle (formatters often have \`--ignore-unknown\`; if not, guard by extension)
   - Stays RAW for now — no \`|| true\`, no stderr suppression. You'll wrap it after the pipe-test passes.

3. **Pipe-test the raw command.** Synthesize the stdin payload the hook will receive and pipe it directly:
   - \`Pre|PostToolUse\` on \`Write|Edit\`: \`echo '{"tool_name":"Edit","tool_input":{"file_path":"<a real file from this repo>"}}' | <cmd>\`
   - \`Pre|PostToolUse\` on \`Bash\`: \`echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | <cmd>\`
   - \`Stop\`/\`UserPromptSubmit\`/\`SessionStart\`: most commands don't read stdin, so \`echo '{}' | <cmd>\` suffices

   Check exit code AND side effect (file actually formatted, test actually ran). If it fails you get a real error — fix (wrong package manager? tool not installed? jq path wrong?) and retest. Once it works, wrap with \`2>/dev/null || true\` (unless the user wants a blocking check).

4. **Write the JSON.** Merge into the target file (schema shape in the "Hook Structure" section above). If this creates \`.claude/settings.local.json\` for the first time, add it to .gitignore — the Write tool doesn't auto-gitignore it.

5. **Validate syntax + schema in one shot:**

   \`jq -e '.hooks.<event>[] | select(.matcher == "<matcher>") | .hooks[] | select(.type == "command") | .command' <target-file>\`

   Exit 0 + prints your command = correct. Exit 4 = matcher doesn't match. Exit 5 = malformed JSON or wrong nesting. A broken settings.json silently disables ALL settings from that file — fix any pre-existing malformation too.

6. **Prove the hook fires** — only for \`Pre|PostToolUse\` on a matcher you can trigger in-turn (\`Write|Edit\` via Edit, \`Bash\` via Bash). \`Stop\`/\`UserPromptSubmit\`/\`SessionStart\` fire outside this turn — skip to step 7.

   For a **formatter** on \`PostToolUse\`/\`Write|Edit\`: introduce a detectable violation via Edit (two consecutive blank lines, bad indentation, missing semicolon — something this formatter corrects; NOT trailing whitespace, Edit strips that before writing), re-read, confirm the hook **fixed** it. For **anything else**: temporarily prefix the command in settings.json with \`echo "$(date) hook fired" >> /tmp/claude-hook-check.txt; \`, trigger the matching tool (Edit for \`Write|Edit\`, a harmless \`true\` for \`Bash\`), read the sentinel file.

   **Always clean up** — revert the violation, strip the sentinel prefix — whether the proof passed or failed.

   **If proof fails but pipe-test passed and \`jq -e\` passed**: the settings watcher isn't watching \`.claude/\` — it only watches directories that had a settings file when this session started. The hook is written correctly. Tell the user to open \`/hooks\` once (reloads config) or restart — you can't do this yourself; \`/hooks\` is a user UI menu and opening it ends this turn.

7. **Handoff.** Tell the user the hook is live (or needs \`/hooks\`/restart per the watcher caveat). Point them at \`/hooks\` to review, edit, or disable it later. The UI only shows "Ran N hooks" if a hook errors or is slow — silent success is invisible by design.
`
// @from(Ln 555228, Col 4)
yjA
// @from(Ln 555229, Col 4)
M$5 = L(() => {
    p7();
    Th();
    e8();
    k0();
    yjA = `# Update Config Skill

Modify Claude Code configuration by updating settings.json files.

## When Hooks Are Required (Not Memory)

If the user wants something to happen automatically in response to an EVENT, they need a **hook** configured in settings.json. Memory/preferences cannot trigger automated actions.

**These require hooks:**
- "Before compacting, ask me what to preserve" → PreCompact hook
- "After writing files, run prettier" → PostToolUse hook with Write|Edit matcher
- "When I run bash commands, log them" → PreToolUse hook with Bash matcher
- "Always run tests after code changes" → PostToolUse hook

**Hook events:** PreToolUse, PostToolUse, PreCompact, PostCompact, Stop, Notification, SessionStart

## CRITICAL: Read Before Write

**Always read the existing settings file before making changes.** Merge new settings with existing ones - never replace the entire file.

## CRITICAL: Use AskUserQuestion for Ambiguity

When the user's request is ambiguous, use AskUserQuestion to clarify:
- Which settings file to modify (user/project/local)
- Whether to add to existing arrays or replace them
- Specific values when multiple options exist

## Decision: Config Tool vs Direct Edit

**Use the Config tool** for these simple settings:
- \`theme\`, \`editorMode\`, \`verbose\`, \`model\`
- \`language\`, \`alwaysThinkingEnabled\`
- \`permissions.defaultMode\`

**Edit settings.json directly** for:
- Hooks (PreToolUse, PostToolUse, etc.)
- Complex permission rules (allow/deny arrays)
- Environment variables
- MCP server configuration
- Plugin configuration

## Workflow

1. **Clarify intent** - Ask if the request is ambiguous
2. **Read existing file** - Use Read tool on the target settings file
3. **Merge carefully** - Preserve existing settings, especially arrays
4. **Edit file** - Use Edit tool (if file doesn't exist, ask user to create it first)
5. **Confirm** - Tell user what was changed

## Merging Arrays (Important!)

When adding to permission arrays or hook arrays, **merge with existing**, don't replace:

**WRONG** (replaces existing permissions):
\`\`\`json
{ "permissions": { "allow": ["Bash(npm *)"] } }
\`\`\`

**RIGHT** (preserves existing + adds new):
\`\`\`json
{
  "permissions": {
    "allow": [
      "Bash(git *)",      // existing
      "Edit(.claude)",    // existing
      "Bash(npm *)"       // new
    ]
  }
}
\`\`\`

${EjA}

${H$5}

${J$5}

## Example Workflows

### Adding a Hook

User: "Format my code after Claude writes it"

1. **Clarify**: Which formatter? (prettier, gofmt, etc.)
2. **Read**: \`.claude/settings.json\` (or create if missing)
3. **Merge**: Add to existing hooks, don't replace
4. **Result**:
\`\`\`json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_response.filePath // .tool_input.file_path' | { read -r f; prettier --write \\"$f\\"; } 2>/dev/null || true"
      }]
    }]
  }
}
\`\`\`

### Adding Permissions

User: "Allow npm commands without prompting"

1. **Read**: Existing permissions
2. **Merge**: Add \`Bash(npm *)\` to allow array
3. **Result**: Combined with existing allows

### Environment Variables

User: "Set DEBUG=true"

1. **Decide**: User settings (global) or project settings?
2. **Read**: Target file
3. **Merge**: Add to env object
\`\`\`json
{ "env": { "DEBUG": "true" } }
\`\`\`

## Common Mistakes to Avoid

1. **Replacing instead of merging** - Always preserve existing settings
2. **Wrong file** - Ask user if scope is unclear
3. **Invalid JSON** - Validate syntax after changes
4. **Forgetting to read first** - Always read before write

## Troubleshooting Hooks

If a hook isn't running:
1. **Check the settings file** - Read ~/.claude/settings.json or .claude/settings.json
2. **Verify JSON syntax** - Invalid JSON silently fails
3. **Check the matcher** - Does it match the tool name? (e.g., "Bash", "Write", "Edit")
4. **Check hook type** - Is it "command", "prompt", or "agent"?
5. **Test the command** - Run the hook command manually to see if it works
6. **Use --debug** - Run \`claude --debug\` to see hook execution logs
`
})
// @from(Ln 555372, Col 4)
W$5 = `# Verifying a CLI change

The handle is direct invocation. The evidence is stdout/stderr/exit code.

## Pattern

1. Build (if the CLI needs building)
2. Run with arguments that exercise the changed code
3. Capture output and exit code
4. Compare to expected

CLIs are usually the simplest to verify — no lifecycle, no ports.

## Worked example

**Diff:** adds a \`--json\` flag to the \`status\` subcommand. New flag
parsing in \`cmd/status.go\`, new output branch.

**Claim (commit msg):** "machine-readable status output."

**Inference:** \`tool status --json\` now exists, emits valid JSON with
the same fields the human output shows. \`tool status\` without the flag
is unchanged.

**Plan:**
1. Build
2. \`tool status\` → human output, same as before (non-regression)
3. \`tool status --json\` → valid JSON, parseable
4. JSON fields match human output fields

**Execute:**
\`\`\`bash
go build -o /tmp/tool ./cmd/tool

/tmp/tool status
# → Status: healthy
# → Uptime: 3h12m
# → Connections: 47

/tmp/tool status --json
# → {"status":"healthy","uptime_seconds":11520,"connections":47}

/tmp/tool status --json | jq -e .status
# → "healthy"
# (jq -e exits nonzero if the path is null/false — cheap validity check)

echo $?
# → 0
\`\`\`

**Verdict:** PASS — flag works, JSON is valid, fields line up.

## What FAIL looks like

- \`unknown flag: --json\` → not wired up, or you're running a stale build
- Output isn't valid JSON (\`jq\` errors) → serialization bug
- \`tool status\` (no flag) changed → regression; the diff touched more
  than it should
- JSON has different field names than expected → claim/code mismatch,
  might be fine, note it

## Reading from stdin, destructive commands

If the CLI reads stdin → pipe in test data.
If it writes files / hits a network / deletes things → point it at a
tmp dir / a mock / a dry-run flag. If there's no safe mode and the
diff touches the destructive path, say so and verify what you can
around it.
`
// @from(Ln 555441, Col 4)
P$5 = () => {}
// @from(Ln 555442, Col 4)
Z$5 = `# Verifying a server/API change

The handle is \`curl\` (or equivalent). The evidence is the response.

## Pattern

1. Start the server (background, with a readiness poll — see below)
2. \`curl\` the route the diff touches, with inputs that hit the changed branch
3. Capture the full response (status + headers + body)
4. Compare to expected

## Lifecycle

If there's a run-skill it handles this. If not:

\`\`\`bash
<start-command> &> /tmp/server.log &
SERVER_PID=$!
for i in {1..30}; do curl -sf localhost:PORT/health >/dev/null && break; sleep 1; done
# ... your curls ...
kill $SERVER_PID
\`\`\`

No readiness endpoint? Poll the route you're about to test until it
stops returning connection-refused, then add a beat.

## Worked example

**Diff:** adds a \`Retry-After\` header to 429 responses in \`rateLimit.ts\`.
**Claim (PR body):** "clients can now back off correctly."

**Inference:** hitting the rate limit should now return \`Retry-After: <n>\`
in the response headers. It didn't before.

**Plan:**
1. Start server
2. Hit the rate-limited endpoint enough times to trigger 429
3. Check the 429 response has \`Retry-After\` header
4. Check the value is a positive integer

**Execute:**
\`\`\`bash
# trigger the limit — 10 fast requests, limit is 5/sec per the diff
for i in {1..10}; do curl -s -o /dev/null -w "%{http_code}\\n" localhost:3000/api/thing; done
# → 200 200 200 200 200 429 429 429 429 429

# capture the 429 headers
curl -si localhost:3000/api/thing | head -20
# → HTTP/1.1 429 Too Many Requests
# → Retry-After: 12
# → ...
\`\`\`

**Verdict:** PASS — \`Retry-After: 12\` present, positive integer.

## What FAIL looks like

- Header absent → the diff didn't take effect, or you're not actually
  hitting the 429 path (check the status code first)
- Header present but value is \`NaN\` / \`undefined\` / negative → the
  logic is wrong
- You got 200s all the way through → you never triggered the changed
  path. Tighten the request burst or check the rate limit config.
`
// @from(Ln 555506, Col 4)
D$5 = () => {}
// @from(Ln 555507, Col 4)
G$5 = `---
name: verify
description: Verify that a code change actually does what it's supposed to by running the app and observing behavior. Use when asked to verify a PR, confirm a fix works, test a change manually, check that a feature works, or validate local changes before pushing.
---

**Verification is runtime observation.** You build the app, run it,
drive it to where the changed code executes, and capture what you
see. That capture is your evidence. Nothing else is.

**Don't run tests. Don't typecheck.** CI ran both before you got
here. Running them again proves you can run CI. Not as a warm-up,
not "just to be sure," not as a regression sweep after. The time
goes to running the app instead.

**Don't import-and-call.** \`import { foo } from './src/...'\` then
\`console.log(foo(x))\` is a unit test you wrote. The function did what
the function does — you knew that from reading it. The app never ran.
Whatever calls \`foo\` in the real codebase ends at a CLI, a socket, or
a window. Go there.

## Find the change

Establish the full range first — a branch may be many commits:

\`\`\`bash
git log --oneline @{u}..              # count commits
git diff @{u}.. --stat                # full range, not HEAD~1
gh pr diff                            # if in a PR context
\`\`\`

State the commit count in your report. Large diff truncating? Redirect:
\`git diff @{u}.. > /tmp/d\` then Read it. No diff at all → say so, stop.

**The diff is ground truth. The PR description is a claim about it.**
Read both. If they disagree, that's a finding.

## Surface

The surface is where a user — human or programmatic — meets the
change. That's where you observe.

| Change reaches | Surface | You |
|---|---|---|
| CLI / TUI | terminal | type the command, capture the pane — [example](examples/cli.md) |
| Server / API | socket | send the request, capture the response — [example](examples/server.md) |
| GUI | pixels | drive it under xvfb/Playwright, screenshot |
| Library | package boundary | sample code through the public export — \`import pkg\`, not \`import ./src/...\` |
| Prompt / agent config | the agent | run the agent, capture its behavior |
| CI workflow | Actions | dispatch it, read the run |

**Internal function? Not a surface.** Something in the repo calls it
and that caller ends at one of the rows above. Follow it there. A
bash security gate's surface isn't the function's return value — it's
the CLI prompting or auto-allowing when you type the command.

**No runtime surface at all** — docs-only, type declarations with no
emit, build config that produces no behavioral diff — report
**SKIP — no runtime surface: (reason).** Don't run tests to fill
the space.

**Tests in the diff are the author's evidence, not a surface.** CI
runs them. You'd be re-running CI. Tests-only PR → SKIP, one line.
Mixed src+tests → verify the src, ignore the test files. Reading a
test to learn what to check is fine — it's a spec. But then go run
the app. Checking that assertions match source is code review.

## Get a handle

**Check \`.claude/skills/\` first — even if you already know how to
build and run.** A matching \`verifier-*\` skill is the repo's
evidence-capture protocol: it wraps the session in whatever
recording/screenshot mechanism the review pipeline consumes. Drive
the surface without it and you get a verdict with no replay.

\`\`\`bash
ls .claude/skills/
\`\`\`

- **\`verifier-*\` matching your surface** (CLI verifier for a CLI
  change, etc.) → invoke it with the Skill tool and follow its
  setup. Mismatched surface → skip that one, try the next. Stale
  verifier (fails on mechanics unrelated to the change) → ask the
  user whether to patch it; don't FAIL the change for verifier rot.
- **\`run-*\` but no matching verifier** → use its build/launch
  primitives as your handle.
- **Neither** → cold start from README/package.json/Makefile. Timebox
  ~15min. Stuck → BLOCKED with exactly where, plus a filled-in
  \`/run-skill-generator\` prompt. Got through → mention
  \`/init-verifiers\` in your report so next time is faster.

## Drive it

Smallest path that makes the changed code execute:

- Changed a flag? Run with it.
- Changed a handler? Hit that route.
- Changed error handling? Trigger the error.
- Changed an internal function? Find the CLI command / request / render
  that reaches it. Run that.

**Read your plan back before running.** If every step is build /
typecheck / run test file — you've planned a CI rerun, not a
verification. Find a step that reaches the surface or report BLOCKED.

**The verdict is table stakes. Your observations are the signal.**
A PASS with three sharp "hey, I noticed…" lines is worth more than a
bare PASS. You're the only reviewer who actually *ran* the thing —
anything that made you pause, work around, or go "huh" is information
the author doesn't have. Don't filter for "is this a bug." Filter for
"would I mention this if they were sitting next to me."

**End-to-end, through the real interface.** Pieces passing in
isolation doesn't mean the flow works — seams are where bugs hide.
If users click buttons, test by clicking buttons, not by curling the
API underneath.

## Push on it

The claim checked out — that's the first half. Confirming is step
one, not the job. The PR description is what the author intended;
your value is what they didn't.

The diff told you exactly what's new. Probe *around* it, at the same
surface you just drove:

- **New flag / option** → empty value, passed twice, combined with a
  conflicting flag, typo'd (does the error name it?)
- **New handler / route** → wrong method, malformed body, missing
  required field, oversized payload
- **Changed error path** → the adjacent errors it didn't touch —
  did the refactor catch them too, or only the one in the diff?
- **Interactive / TUI** → Ctrl-C mid-op, resize the pane, paste
  garbage, rapid-fire the key, Esc at the wrong moment
- **State / persistence** → do it twice, do it with stale state
  underneath, do it in two sessions at once
- **Wander** → what's adjacent? What looked off while you were
  confirming? Go back to it.

These aren't a checklist — pick the ones the diff points at. Stop
when you've covered the obvious adjacents or hit something worth a
⚠️. A probe that finds nothing is still a step: "🔍 passed \`--from ''\`
→ clean \`error: --from requires a value\`, exit 2." That the author
didn't test it is exactly why it's worth knowing it holds.

Still not a test run. You're at the surface, typing what a user
would type wrong.

## Capture

Stdout, response bodies, screenshots, pane dumps. Captured output is
evidence; your memory isn't. Something unexpected? Don't route around
it — capture, note, decide if it's the change or the environment.
Unrelated breakage is a finding, not noise.

Shared process state (tmux, ports, lockfiles) — isolate. \`tmux -L
name\`, bind \`:0\`, \`mktemp -d\`. You share a namespace with your host.

## Report

Inline, final message:

\`\`\`
## Verification: <one-line what changed>

**Verdict:** PASS | FAIL | BLOCKED | SKIP

**Claim:** <what it's supposed to do — your read of the diff and/or
the stated claim; note any mismatch>

**Method:** <how you got a handle — which verifier/run-skill, or
cold start; what you launched>

### Steps

Each step is one thing you did to the **running app** and what it
showed. Build/install/checkout are setup, not steps. Test runs and
typecheck don't belong here — they're CI's output.

1. ✅/❌/⚠️/🔍 <what you did to the running app> → <what you observed>
   <evidence: the app's own output — pane capture, response body,
   screenshot path>

🔍 marks a probe — a step off the claim's happy path, trying to
break it. At least one. A Steps list that's all ✅ and no 🔍 is a
happy-path replay: still PASS, but you stopped at the first half.

**Screenshot / sample:** <the one frame a reviewer looks at to see
the feature — image path for GUI/TUI, code block for library/API;
omit for build/types-only>

### Findings
<Things you noticed. Not just bugs — friction, surprises, anything
a first-time user would trip on. "Took three tries to find the right
flag." "Error message on typo was unhelpful." "Default seems odd for
the common case." "Works, but slower than I expected." Lower the bar:
if it made you pause, it goes here. But the pause has to be yours,
from running the app — not from reading the PR page. A red CI check,
a review comment, someone else's bot: visible to anyone already, and
you relaying it isn't an observation. Claim/diff mismatch, pre-existing
breakage, and env notes also belong.

Each probe gets a line here even when it held — "🔍 empty \`--from\`
→ clean error" tells the author what *was* covered, which they
can't see from a bare PASS.

Lead with ⚠️ for lines worth interrupting the reviewer for — those get
hoisted above the PR comment fold. Plain bullets are context they'll
find if they expand. Empty is fine if nothing stuck out — but nothing
sticking out is itself rare.>
\`\`\`

**Verdicts:**
- **PASS** — you ran the app, the change did what it should at its
  surface. Not: tests pass, builds clean, code looks right.
- **FAIL** — you ran it and it doesn't. Or it breaks something else.
  Or claim and diff disagree materially.
- **BLOCKED** — couldn't reach a state where the change is observable.
  Build broke, env missing a dep, handle wouldn't come up. Not a
  verdict on the change. Say exactly where it stopped +
  \`/run-skill-generator\` prompt.
- **SKIP** — no runtime surface exists. Docs-only, types-only,
  tests-only. Nothing went wrong; there's just nothing here to run.
  One line why.

No partial pass. "3 of 4 passed" is FAIL until 4 passes or is
explained away.

**When in doubt, FAIL.** False PASS ships broken code; false FAIL
costs one more human look. Ambiguous output is FAIL with the raw
capture attached — don't interpret.
`
// @from(Ln 555738, Col 4)
f$5 = () => {}
// @from(Ln 555739, Col 4)
v$5
// @from(Ln 555739, Col 9)
T$5
// @from(Ln 555740, Col 4)
V$5 = L(() => {
    P$5();
    D$5();
    f$5();
    v$5 = G$5, T$5 = {
        "examples/cli.md": W$5,
        "examples/server.md": Z$5
    }
})
// @from(Ln 555750, Col 0)
function N$5() {
    return
}
// @from(Ln 555753, Col 4)
k$5
// @from(Ln 555753, Col 9)
SjA
// @from(Ln 555753, Col 14)
CjA
// @from(Ln 555754, Col 4)
E$5 = L(() => {
    Lf();
    k0();
    V$5();
    ({
        frontmatter: k$5,
        content: SjA
    } = p2(v$5)), CjA = typeof k$5.description === "string" ? k$5.description : "Verify a code change does what it should by running the app."
})
// @from(Ln 555763, Col 4)
L$5 = {}
// @from(Ln 555768, Col 0)
function mjA() {
    return !aG() && x3() && XD("tengu_kairos_dream", !1, ujA)
}
// @from(Ln 555772, Col 0)
function BjA() {
    let q = Math.floor(Math.random() * 360);
    return `${q%60} ${Math.floor(q/60)} * * *`
}
// @from(Ln 555777, Col 0)
function pjA(q, K, _, z, Y) {
    let [A = "0", O = "3"] = _.split(" "), w = parseInt(O, 10), $ = parseInt(A, 10), j = w < 12 ? "am" : "pm", J = `${w===0?12:w>12?w-12:w}:${$.toString().padStart(2,"0")}${j}`;
    return `# Dream: Schedule Nightly Consolidation

The user wants to set up a recurring nightly memory consolidation job.

**Step 1 — Dedup any existing nightly job**

Call ${nH6} and check for an existing task with prompt \`"/dream consolidate"\`. If one exists, delete it with ${wT} first so renewal doesn't leave overlapping jobs.

**Step 2 — Schedule**

Call ${DX} with:
- \`cron\`: \`"${_}"\`
- \`prompt\`: \`"/dream consolidate"\`
- \`recurring\`: true
- \`durable\`: true

(The \`consolidate\` suffix means this prompt won't match SCHEDULING_KEYWORDS when it fires (so it runs the consolidation path), won't exact-match migrateAssistantTasksPermanent()'s \`'/dream'\` check (so it stays non-permanent), and resolves via the primary name on both bundled and disk skills (so it keeps working if the bundled skill is disabled via kill-switch or KAIROS activation).)

**Step 3 — Confirm**

Tell the user:
- /dream will run nightly at ~${J} local to consolidate and organize memories
- The schedule persists across sessions (written to .claude/scheduled_tasks.json)
- Recurring tasks auto-expire after ${UR} days — re-run \`/dream nightly\` to renew
- Cancel anytime with ${wT} (include the job ID)

**Step 4 — Run an immediate consolidation**

${P38(q,K,z,Y)}`
}
// @from(Ln 555810, Col 0)
function FjA() {
    MA({
        name: "dream",
        aliases: ["learn"],
        description: "Reflective memory consolidation — review recent activity, synthesize learnings into typed memory files, and prune stale entries.",
        whenToUse: 'When the user wants Claude to reflect on and consolidate its memories, organize topic files, prune stale entries, or schedule nightly consolidation. Trigger phrases: "dream", "learn", "dream nightly", "consolidate memories", "learn from your experiences", "organize your memories".',
        argumentHint: "[nightly]",
        userInvocable: !0,
        context: "fork",
        isEnabled: mjA,
        async getPromptForCommand(q) {
            let K = Nw(),
                _ = e2(Y7()),
                z = bjA?.isTeamMemoryEnabled() ?? !1,
                Y = q.trim();
            if (Y === xjA) Y = "";
            let A = IjA.exec(Y);
            if (A) {
                let O = Y.slice(A[0].length).trim();
                if (!uD()) return d("tengu_dream_invoked", {
                    mode: "schedule_unavailable"
                }), [{
                    type: "text",
                    text: "Scheduling is not available in this environment. Tell the user they can run `/dream` without arguments to consolidate memories now. Do not call any tools."
                }];
                let w = BjA(),
                    [$ = "0", j = "0"] = w.split(" ");
                return d("tengu_dream_invoked", {
                    mode: "schedule",
                    cron_hour: parseInt(j, 10),
                    cron_minute: parseInt($, 10),
                    team_memory_enabled: z
                }), [{
                    type: "text",
                    text: pjA(K, _, w, O, z)
                }]
            }
            return d("tengu_dream_invoked", {
                mode: "consolidate",
                has_args: Y.length > 0,
                team_memory_enabled: z
            }), _fK(), [{
                type: "text",
                text: P38(K, _, Y, z)
            }]
        }
    })
}
// @from(Ln 555858, Col 4)
bjA
// @from(Ln 555858, Col 9)
IjA
// @from(Ln 555858, Col 14)
xjA = "consolidate"
// @from(Ln 555859, Col 4)
ujA = 300000
// @from(Ln 555860, Col 4)
h$5 = L(() => {
    y8();
    VY();
    B1();
    C8();
    F58();
    X97();
    QR();
    g4();
    k0();
    bjA = (ev(), B7(Tp)), IjA = /^(nightly|schedule|overnight)\b/i
})
// @from(Ln 555872, Col 4)
b$5 = {}
// @from(Ln 555877, Col 0)
function R$5() {
    return e56() ? ` Before you stop, send a one-line outcome via ${ic} — the user may be away and waiting to hear it's done. Skip this if you're stopping because the user just told you to; they're already here.` : ""
}
// @from(Ln 555881, Col 0)
function QjA(q) {
    let K = q[1],
        _ = q[2].toLowerCase();
    if (_.startsWith("s")) return `${K}s`;
    if (_.startsWith("h")) return `${K}h`;
    if (_.startsWith("d")) return `${K}d`;
    return `${K}m`
}
// @from(Ln 555890, Col 0)
function S$5() {
    if (!S6(process.env.CLAUDE_CODE_REMOTE) && u8("tengu_surreal_dali", !1) && N5("allow_remote_sessions") && u8("tengu_cinder_almanac", !1) && !(qj().length > 0)) return `
## Offer cloud first

Before any scheduling step, check whether EITHER is true:
- the parsed interval (rule 1 or 2) is **≥60 minutes**, or
- regardless of which rule matched, the original input uses daily phrasing ("every morning", "daily", "every day", "each night", "every weekday")

If either is true, call ${AO} first:
- \`question\`: "This loop stops when you close this session. Set it up as a cloud schedule instead so it keeps running?"
- \`header\`: "Schedule"
- \`options\`: \`[{label: "Cloud schedule (recommended)", description: "Runs in Anthropic's cloud even after you close this session"}, {label: "This session only", description: "Runs in this terminal until you exit"}]\`

If they pick **Cloud schedule**: do NOT call ${DX}. Invoke the \`schedule\` skill directly via the ${VH} tool with \`args\` set to their original input verbatim (e.g. \`${VH}({skill: "schedule", args: "every morning tell me a joke"})\`), then follow that skill's instructions to completion. Do NOT tell the user to run /schedule themselves. **Then stop — do not continue to any section below** (no ${DX}, no ${fH}, no "execute the prompt now").
If they pick **This session only**:
- If the trigger was a parsed ≥60-minute interval (rule 1 or 2): continue below with that interval.
- If the trigger was daily phrasing only (rule 3, no parsed interval): do NOT call ${DX}. Explain that a daily-cadence loop won't fire before this session closes, so there's nothing useful to schedule locally — suggest they either pick Cloud schedule, or re-run \`/loop\` with an explicit shorter interval (e.g. \`/loop 1h <prompt>\`) if they want a session loop. Then stop.
If neither trigger condition was met: continue below.
`;
    return ""
}
// @from(Ln 555912, Col 0)
function C$5() {
    if (!S6(process.env.CLAUDE_CODE_REMOTE) && u8("tengu_surreal_dali", !1) && N5("allow_remote_sessions") && u8("tengu_cinder_almanac", !1)) {
        if (qj().length > 0) return ` End the confirmation with this exact line on its own, italicized: ${"`_Runs until you close this session · For durable cloud-based loops, use /schedule_`"}`;
        return ` Only if you did NOT show the cloud-offer ${AO} above (i.e., neither trigger condition applied), end the confirmation with this exact line on its own, italicized: ${"`_Runs until you close this session · For durable cloud-based loops, use /schedule_`"}. If the user already answered that question, omit this line.`
    }
    return ""
}
// @from(Ln 555920, Col 0)
function ljA() {
    return `1. Call ${DX} with: \`cron\` (the expression above), \`prompt\` (the parsed prompt verbatim), \`recurring: true\`.
2. Briefly confirm: what's scheduled, the cron expression, the human-readable cadence, that recurring tasks auto-expire after ${UR} days, and that the user can cancel sooner with ${wT} (include the job ID).${C$5()}
3. **Then immediately execute the parsed prompt now** — don't wait for the first cron fire. If it's a slash command, invoke it via the Skill tool; otherwise act on it directly.`
}
// @from(Ln 555926, Col 0)
function njA(q) {
    return `# /loop — schedule a recurring prompt

Parse the input below into \`[interval] <prompt…>\` and schedule it with ${DX}.

## Parsing (in priority order)

1. **Leading token**: if the first whitespace-delimited token matches \`^\\d+[smhd]$\` (e.g. \`5m\`, \`2h\`), that's the interval; the rest is the prompt.
2. **Trailing "every" clause**: otherwise, if the input ends with \`every <N><unit>\` or \`every <N> <unit-word>\` (e.g. \`every 20m\`, \`every 5 minutes\`, \`every 2 hours\`), extract that as the interval and strip it from the prompt. Only match when what follows "every" is a time expression — \`check every PR\` has no interval.
3. **Default**: otherwise, interval is \`${xm6}\` and the entire input is the prompt.

If the resulting prompt is empty, show usage \`/loop [interval] <prompt>\` and stop — do not call ${DX}.

Examples:
- \`5m /babysit-prs\` → interval \`5m\`, prompt \`/babysit-prs\` (rule 1)
- \`check the deploy every 20m\` → interval \`20m\`, prompt \`check the deploy\` (rule 2)
- \`run tests every 5 minutes\` → interval \`5m\`, prompt \`run tests\` (rule 2)
- \`check the deploy\` → interval \`${xm6}\`, prompt \`check the deploy\` (rule 3)
- \`check every PR\` → interval \`${xm6}\`, prompt \`check every PR\` (rule 3 — "every" not followed by time)
- \`5m\` → empty prompt → show usage
${S$5()}
## Interval → cron

Supported suffixes: \`s\` (seconds, rounded up to nearest minute, min 1), \`m\` (minutes), \`h\` (hours), \`d\` (days). Convert:

| Interval pattern      | Cron expression     | Notes                                    |
|-----------------------|---------------------|------------------------------------------|
| \`Nm\` where N ≤ 59   | \`*/N * * * *\`     | every N minutes                          |
| \`Nm\` where N ≥ 60   | \`0 */H * * *\`     | round to hours (H = N/60, must divide 24)|
| \`Nh\` where N ≤ 23   | \`0 */N * * *\`     | every N hours                            |
| \`Nd\`                | \`0 0 */N * *\`     | every N days at midnight local           |
| \`Ns\`                | treat as \`ceil(N/60)m\` | cron minimum granularity is 1 minute  |

**If the interval doesn't cleanly divide its unit** (e.g. \`7m\` → \`*/7 * * * *\` gives uneven gaps at :56→:00; \`90m\` → 1.5h which cron can't express), pick the nearest clean interval and tell the user what you rounded to before scheduling.

## Action

1. Call ${DX} with:
   - \`cron\`: the expression from the table above
   - \`prompt\`: the parsed prompt from above, verbatim (slash commands are passed through unchanged)
   - \`recurring\`: \`true\`
2. Briefly confirm: what's scheduled, the cron expression, the human-readable cadence, that recurring tasks auto-expire after ${UR} days, and that they can cancel sooner with ${wT} (include the job ID).${C$5()}
3. **Then immediately execute the parsed prompt now** — don't wait for the first cron fire. If it's a slash command, invoke it via the Skill tool; otherwise act on it directly.

## Input

${q}`
}
// @from(Ln 555975, Col 0)
function ijA() {
    return `Usage: /loop [interval] <prompt>

Run a prompt or slash command on a recurring interval — or with no interval, let the model self-pace based on the task.

Intervals: Ns, Nm, Nh, Nd (e.g. 5m, 30m, 2h, 1d). Minimum granularity is 1 minute.
If no interval is specified, the model picks a delay between iterations based on what it's doing.

Examples:
  /loop 5m /babysit-prs
  /loop 30m check the deploy
  /loop 1h /standup 1
  /loop check the deploy          (dynamic — model picks delays)
  /loop check the deploy every 20m${""}`
}
// @from(Ln 555991, Col 0)
function rjA(q) {
    let K = `The user wants you to self-pace. Decide what makes the next iteration worth running — a passage of time, or an observable event.

1. **Run the parsed prompt now.** If it's a slash command, invoke it via the Skill tool; otherwise act on it directly.
2. **If the next run is gated on an event** (CI finishing, a log line matching, a file changing, a PR comment) and no ${_0} is already running for it: arm one now with \`persistent: true\`. Its events arrive as \`<task-notification>\` messages and wake this loop immediately — you do not wait for the ${fH} deadline. Arm once; on later iterations call ${xD} first and skip this step if a monitor is already running.
3. **At the end of this turn, call ${fH}** with:
   - \`delaySeconds\`: with a ${_0} armed this is the **fallback heartbeat** — how long to wait if no event fires (lean 1200–1800s; idle ticks past the 5-minute cache window are pure overhead). Without a ${_0} this is the cadence — pick based on what you observed. Read the tool's own description for cache-aware delay guidance.
   - \`reason\`: one short sentence on why you picked that delay.
   - \`prompt\`: the full original /loop input verbatim, prefixed with \`/loop \` so the next firing re-enters this skill and continues the loop. For example, if the user typed \`/loop check the deploy\`, pass \`/loop check the deploy\` as the prompt.
4. **If you were woken by a \`<task-notification>\`** rather than this prompt: handle the event in the context of the loop task, then call ${fH} again with the same \`prompt\` and the same 1200–1800s \`delaySeconds\` from step 3 — the ${_0} remains the wake signal; this only resets the safety net.
5. **To stop the loop**, omit the ${fH} call and ${RV} any ${_0} you armed (use ${xD} to find the task ID if it is no longer in context).${R$5()}
6. Briefly confirm: that you're self-pacing, whether a ${_0} is the primary wake signal, that you ran the task now, and what fallback delay you picked.`;
    return `# /loop — schedule a recurring or self-paced prompt

Parse the input below into \`[interval] <prompt…>\` and schedule it.

## Parsing (in priority order)

1. **Leading token**: if the first whitespace-delimited token matches \`^\\d+[smhd]$\` (e.g. \`5m\`, \`2h\`), that's the interval; the rest is the prompt.
2. **Trailing "every" clause**: otherwise, if the input ends with \`every <N><unit>\` or \`every <N> <unit-word>\` (e.g. \`every 20m\`, \`every 5 minutes\`, \`every 2 hours\`), extract that as the interval and strip it from the prompt. Only match when what follows "every" is a time expression — \`check every PR\` has no interval.
3. **No interval**: otherwise, the entire input is the prompt and you'll self-pace dynamically (see "Dynamic mode" below).

If the resulting prompt is empty, show usage \`/loop [interval] <prompt>\` and stop.

Examples:
- \`5m /babysit-prs\` → interval \`5m\`, prompt \`/babysit-prs\` (rule 1)
- \`check the deploy every 20m\` → interval \`20m\`, prompt \`check the deploy\` (rule 2)
- \`run tests every 5 minutes\` → interval \`5m\`, prompt \`run tests\` (rule 2)
- \`check the deploy\` → no interval → dynamic mode, prompt \`check the deploy\` (rule 3)
- \`check every PR\` → no interval → dynamic mode, prompt \`check every PR\` (rule 3 — "every" not followed by time)
- \`5m\` → empty prompt → show usage
${S$5()}
## Fixed-interval mode (rules 1 and 2)

Convert the interval to a cron expression:

${cjA}

Then:
${ljA()}

## Dynamic mode (rule 3 — no interval)

${K}

## Input

${q}`
}
// @from(Ln 556041, Col 0)
function ojA() {
    MA({
        name: "loop",
        aliases: ["proactive"],
        get description() {
            if (dW7.isLoopDynamicEnabled()) return "Run a prompt or slash command on a recurring interval (e.g. /loop 5m /foo). Omit the interval to let the model self-pace.";
            return "Run a prompt or slash command on a recurring interval (e.g. /loop 5m /foo, defaults to 10m)"
        },
        whenToUse: 'When the user wants to set up a recurring task, poll for status, or run something repeatedly on an interval (e.g. "check the deploy every 5 minutes", "keep running /babysit-prs"). Do NOT invoke for one-off tasks.',
        get argumentHint() {
            if (Im6.isLoopDefaultPromptEnabled()) return "[interval | until <condition>] [prompt]";
            return "[interval] <prompt>"
        },
        userInvocable: !0,
        isEnabled: uD,
        async getPromptForCommand(q, K) {
            let _ = q.trim(),
                z = _.match(/^until\s+(.+)$/is);
            {
                let Y = _.match(UjA),
                    A = !_,
                    O = gjA.test(_) || Y !== null;
                if (A || O) {
                    if (Im6.isLoopDefaultPromptEnabled()) {
                        let w = Y ? QjA(Y) : _ || xm6,
                            $ = (H, J) => {
                                let X = H ? `## Loop tasks (from ${H.path})` : "## Autonomous-loop instructions (for the immediate execution and every fire)",
                                    M = H ? H.content : Im6.AUTONOMOUS_LOOP_PREAMBLE,
                                    P = H ? "the loop.md tasks" : "the autonomous check";
                                if (J) {
                                    let f = H ? Im6.LOOP_FILE_DYNAMIC_SENTINEL : ys,
                                        v = H ? `# /loop — loop.md tasks with dynamic pacing

The user invoked \`/loop\` with no prompt and no interval and has a loop-tasks file at \`${H.path}\`. Run those tasks now, then self-pace the next iteration via ${fH} — no cron.` : `# /loop — autonomous default with dynamic pacing

The user invoked \`/loop\` with no prompt and no interval. Run the autonomous check now, then self-pace the next iteration via ${fH} — no cron.`,
                                        V = H ? `that you're running tasks from \`${H.path}\` in dynamic-pacing mode, that you ran the first tick now` : "that this is the autonomous default in dynamic-pacing mode, that you ran the check now",
                                        k = `1. **Run ${P} now**, following the instructions inlined below.
2. **If the next tick is gated on an event** (CI finishing, a PR comment, a log line) and no ${_0} is already running for it: arm one now with \`persistent: true\`. Its events wake this loop immediately — you do not wait for the ${fH} deadline. Arm once; on later ticks call ${xD} first and skip if a monitor is already running.
3. **At the end of this turn, call ${fH}** with:
   - \`delaySeconds\`: with a ${_0} armed this is the fallback heartbeat (lean 1200–1800s). Without one, pick based on what you observed this turn — quiet branch? wait longer. Lots in flight? wait shorter. Read the tool's own description for cache-aware delay guidance.
   - \`reason\`: one short sentence on why you picked that delay.
   - \`prompt\`: the literal string \`${f}\` — the dynamic-mode sentinel expands at fire time to the full instructions (first fire / first fire post-compact / loop.md edited) or a dynamic-pacing-specific short reminder (subsequent fires). Do not pass the full instructions; that is handled automatically.
4. **If woken by a \`<task-notification>\`** rather than this prompt: handle the event, then call ${fH} again with \`${f}\` and the same 1200–1800s \`delaySeconds\` — the ${_0} remains the wake signal; this only resets the safety net.
5. **To stop the loop**, omit the ${fH} call and ${RV} any ${_0} you armed (use ${xD} to find the task ID if it is no longer in context).${R$5()}
6. Briefly confirm: ${V}, whether a ${_0} is the primary wake signal, and what fallback delay you picked.`;
                                    return `${v}

## Action

${k}

${X}

${M}`
                                }
                                let W = H ? Im6.LOOP_FILE_SENTINEL : Fj6,
                                    D = H ? `# /loop — schedule loop.md tasks

The user invoked \`/loop\` with no prompt (input was empty or just the interval \`${w}\`) and has a loop-tasks file at \`${H.path}\`. Schedule a recurring cron that runs those tasks each tick, then run the first tick immediately.` : `# /loop — schedule the autonomous default

The user invoked \`/loop\` with no prompt (input was empty or just the interval \`${w}\`). Schedule the autonomous-loop default and then run the first autonomous check immediately.`,
                                    Z = H ? "it expands at fire time to the full loop.md contents on first delivery (and whenever loop.md has been edited since last fire), and to a short reminder on subsequent unchanged fires. The long instructions stay in the cached message-prefix." : "it expands at fire time to the full autonomous-loop instructions on first delivery, and to a short reminder on subsequent fires (the long instructions stay in the cached message-prefix).",
                                    G = H ? `what's scheduled, the cron expression, the human-readable cadence, that it's running tasks from \`${H.path}\`, that recurring tasks auto-expire after ${UR} days, and that the user can cancel sooner with ${wT} (include the job ID).` : `what's scheduled, the cron expression, the human-readable cadence, that recurring tasks auto-expire after ${UR} days, and that they can cancel sooner with ${wT} (include the job ID). Mention this is the autonomous default and that the autonomous-loop instructions are baked in.`;
                                return `${D}

## Action

1. Convert \`${w}\` to a 5-field cron expression. Supported suffixes: \`s\` → ceil to nearest minute, \`m\` (minutes), \`h\` (hours), \`d\` (days). Examples: \`5m\` → \`*/5 * * * *\`, \`1h\` → \`0 * * * *\`, \`1d\` → \`0 0 * * *\`. If the interval doesn't cleanly divide its unit, round to the nearest clean interval and tell the user what you rounded to.
2. Call ${DX} with:
   - \`cron\`: the expression from step 1
   - \`prompt\`: the literal string \`${W}\` — ${Z}
   - \`recurring\`: \`true\`
3. Briefly confirm: ${G}
4. **Then immediately run ${P} now**, following the instructions inlined below. Don't wait for the first cron fire.

${X}

${M}`
                            },
                            j = Im6.readLoopFile();
                        if (A && !0 && dW7.isLoopDynamicEnabled()) return [{
                            type: "text",
                            text: $(j, !0)
                        }];
                        return [{
                            type: "text",
                            text: $(j, !1)
                        }]
                    }
                }
            }
            if (dW7.isLoopDynamicEnabled()) {
                if (!_) return [{
                    type: "text",
                    text: ijA()
                }];
                return [{
                    type: "text",
                    text: rjA(_)
                }]
            }
            if (!_) return [{
                type: "text",
                text: djA
            }];
            return [{
                type: "text",
                text: njA(_)
            }]
        }
    })
}
// @from(Ln 556154, Col 4)
Im6
// @from(Ln 556154, Col 9)
dW7
// @from(Ln 556154, Col 14)
xm6 = "10m"
// @from(Ln 556155, Col 4)
gjA
// @from(Ln 556155, Col 9)
UjA
// @from(Ln 556155, Col 14)
djA
// @from(Ln 556155, Col 19)
cjA = "| Interval pattern      | Cron expression     | Notes                                    |\n|-----------------------|---------------------|------------------------------------------|\n| `Nm` where N ≤ 59   | `*/N * * * *`     | every N minutes                          |\n| `Nm` where N ≥ 60   | `0 */H * * *`     | round to hours (H = N/60, must divide 24)|\n| `Nh` where N ≤ 23   | `0 */N * * *`     | every N hours                            |\n| `Nd`                | `0 0 */N * *`     | every N days at midnight local           |\n| `Ns`                | treat as `ceil(N/60)m` | cron minimum granularity is 1 minute  |\n\n**If the interval doesn't cleanly divide its unit** (e.g. `7m` → `*/7 * * * *` gives uneven gaps at :56→:00; `90m` → 1.5h which cron can't express), pick the nearest clean interval and tell the user what you rounded to before scheduling."
// @from(Ln 556156, Col 4)
I$5 = L(() => {
    y8();
    B1();
    C8();
    J2();
    cp();
    zt();
    q36();
    QR();
    fe6();
    Q8();
    ty();
    k0();
    Im6 = (HR6(), B7(jR6)), dW7 = (cR8(), B7(dR8));
    gjA = /^\d+[smhd]$/, UjA = /^every\s+(\d+)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days)\s*$/i;
    djA = `Usage: /loop [interval] <prompt>

Run a prompt or slash command on a recurring interval.

Intervals: Ns, Nm, Nh, Nd (e.g. 5m, 30m, 2h, 1d). Minimum granularity is 1 minute.
If no interval is specified, defaults to ${xm6}.

Examples:
  /loop 5m /babysit-prs
  /loop 30m check the deploy
  /loop 1h /standup 1
  /loop check the deploy          (defaults to ${xm6})
  /loop check the deploy every 20m`
})
// @from(Ln 556185, Col 4)
m$5 = {}
// @from(Ln 556190, Col 0)
function sjA(q) {
    if (!q.startsWith("mcpsrv_")) return null;
    let z = q.slice(7).slice(2),
        Y = 0n;
    for (let O of z) {
        let w = ajA.indexOf(O);
        if (w === -1) return null;
        Y = Y * 58n + BigInt(w)
    }
    let A = Y.toString(16).padStart(32, "0");
    return `${A.slice(0,8)}-${A.slice(8,12)}-${A.slice(12,16)}-${A.slice(16,20)}-${A.slice(20,32)}`
}
// @from(Ln 556203, Col 0)
function tjA(q) {
    let K = [];
    for (let _ of q) {
        if (_.type !== "connected") continue;
        if (_.config.type !== "claudeai-proxy") continue;
        let z = sjA(_.config.id);
        if (!z) continue;
        K.push({
            uuid: z,
            name: _.name,
            url: _.config.url
        })
    }
    return K
}
// @from(Ln 556219, Col 0)
function ejA(q) {
    return q.replace(/^claude[.\s-]ai[.\s-]/i, "").replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}
// @from(Ln 556223, Col 0)
function qHA(q) {
    if (q.length === 0) return "No connected MCP connectors found. The user may need to connect servers at https://claude.ai/settings/connectors";
    let K = ["Connected connectors (available for triggers):"];
    for (let _ of q) {
        let z = ejA(_.name);
        K.push(`- ${_.name} (connector_uuid: ${_.uuid}, name: ${z}, url: ${_.url})`)
    }
    return K.join(`
`)
}
// @from(Ln 556234, Col 0)
function u$5(q) {
    return `⚠ Heads-up:
${q.map((_)=>`- ${_}`).join(`
`)}`
}
// @from(Ln 556239, Col 0)
async function KHA() {
    let q = await DU();
    if (!q) return null;
    let K = xA6(q);
    if (!K) return null;
    return `https://${K.host}/${K.owner}/${K.name}`
}
// @from(Ln 556247, Col 0)
function _HA(q) {
    let {
        userTimezone: K,
        connectorsInfo: _,
        gitRepoUrl: z,
        environmentsInfo: Y,
        createdEnvironment: A,
        setupNotes: O,
        needsGitHubAccessReminder: w,
        userArgs: $
    } = q, j = $ && O.length > 0 ? `
## Setup Notes

${u$5(O)}
` : "", H = O.length > 0 ? `${u$5(O)}

${x$5}` : x$5;
    return `# Schedule Remote Agents

You are helping the user schedule, update, list, or run **remote** Claude Code agents. These are NOT local cron jobs — each trigger spawns a fully isolated remote session (CCR) in Anthropic's cloud infrastructure on a cron schedule. The agent runs in a sandboxed environment with its own git checkout, tools, and optional MCP connections.

## First Step

${$?"The user has already told you what they want (see User Request at the bottom). Skip the initial question and go directly to the matching workflow.":`Your FIRST action must be a single ${AO} tool call (no preamble). Use this EXACT string for the \`question\` field — do not paraphrase or shorten it:

${I6(H)}

Set \`header: "Action"\` and offer the four actions (create/list/update/run) as options. After the user picks, follow the matching workflow below.`}
${j}

## What You Can Do

Use the \`${bM6}\` tool (load it first with \`ToolSearch select:${bM6}\`; auth is handled in-process — do not use curl):

- \`{action: "list"}\` — list all triggers
- \`{action: "get", trigger_id: "..."}\` — fetch one trigger
- \`{action: "create", body: {...}}\` — create a trigger
- \`{action: "update", trigger_id: "...", body: {...}}\` — partial update
- \`{action: "run", trigger_id: "..."}\` — run a trigger now

You CANNOT delete triggers. If the user asks to delete, direct them to: https://claude.ai/code/scheduled

## Create body shape

\`\`\`json
{
  "name": "AGENT_NAME",
  "cron_expression": "CRON_EXPR",
  "enabled": true,
  "job_config": {
    "ccr": {
      "environment_id": "ENVIRONMENT_ID",
      "session_context": {
        "model": "claude-sonnet-4-6",
        "sources": [
          {"git_repository": {"url": "${z||"https://github.com/ORG/REPO"}"}}
        ],
        "allowed_tools": ["Bash", "Read", "Write", "Edit", "Glob", "Grep"]
      },
      "events": [
        {"data": {
          "uuid": "<lowercase v4 uuid>",
          "session_id": "",
          "type": "user",
          "parent_tool_use_id": null,
          "message": {"content": "PROMPT_HERE", "role": "user"}
        }}
      ]
    }
  }
}
\`\`\`

Generate a fresh lowercase UUID for \`events[].data.uuid\` yourself.

## Available MCP Connectors

These are the user's currently connected claude.ai MCP connectors:

${_}

When attaching connectors to a trigger, use the \`connector_uuid\` and \`name\` shown above (the name is already sanitized to only contain letters, numbers, hyphens, and underscores), and the connector's URL. The \`name\` field in \`mcp_connections\` must only contain \`[a-zA-Z0-9_-]\` — dots and spaces are NOT allowed.

**Important:** Infer what services the agent needs from the user's description. For example, if they say "check Datadog and Slack me errors," the agent needs both Datadog and Slack connectors. Cross-reference against the list above and warn if any required service isn't connected. If a needed connector is missing, direct the user to https://claude.ai/settings/connectors to connect it first.

## Environments

Every trigger requires an \`environment_id\` in the job config. This determines where the remote agent runs. Ask the user which environment to use.

${Y}

Use the \`id\` value as the \`environment_id\` in \`job_config.ccr.environment_id\`.
${A?`
**Note:** A new environment \`${A.name}\` (id: \`${A.environment_id}\`) was just created for the user because they had none. Use this id for \`job_config.ccr.environment_id\` and mention the creation when you confirm the trigger config.
`:""}

## API Field Reference

### Create Trigger — Required Fields
- \`name\` (string) — A descriptive name
- \`cron_expression\` (string) — 5-field cron. **Minimum interval is 1 hour.**
- \`job_config\` (object) — Session configuration (see structure above)

### Create Trigger — Optional Fields
- \`enabled\` (boolean, default: true)
- \`mcp_connections\` (array) — MCP servers to attach:
  \`\`\`json
  [{"connector_uuid": "uuid", "name": "server-name", "url": "https://..."}]
  \`\`\`

### Update Trigger — Optional Fields
All fields optional (partial update):
- \`name\`, \`cron_expression\`, \`enabled\`, \`job_config\`
- \`mcp_connections\` — Replace MCP connections
- \`clear_mcp_connections\` (boolean) — Remove all MCP connections

### Cron Expression Examples

The user's local timezone is **${K}**. Cron expressions are always in UTC. When the user says a local time, convert it to UTC for the cron expression but confirm with them: "9am ${K} = Xam UTC, so the cron would be \`0 X * * 1-5\`."

- \`0 9 * * 1-5\` — Every weekday at 9am **UTC**
- \`0 */2 * * *\` — Every 2 hours
- \`0 0 * * *\` — Daily at midnight **UTC**
- \`30 14 * * 1\` — Every Monday at 2:30pm **UTC**
- \`0 8 1 * *\` — First of every month at 8am **UTC**

Minimum interval is 1 hour. \`*/30 * * * *\` will be rejected.

## Workflow

### CREATE a new trigger:

1. **Understand the goal** — Ask what they want the remote agent to do. What repo(s)? What task? Remind them that the agent runs remotely — it won't have access to their local machine, local files, or local environment variables.
2. **Craft the prompt** — Help them write an effective agent prompt. Good prompts are:
   - Specific about what to do and what success looks like
   - Clear about which files/areas to focus on
   - Explicit about what actions to take (open PRs, commit, just analyze, etc.)
3. **Set the schedule** — Ask when and how often. The user's timezone is ${K}. When they say a time (e.g., "every morning at 9am"), assume they mean their local time and convert to UTC for the cron expression. Always confirm the conversion: "9am ${K} = Xam UTC."
4. **Choose the model** — Default to \`claude-sonnet-4-6\`. Tell the user which model you're defaulting to and ask if they want a different one.
5. **Validate connections** — Infer what services the agent will need from the user's description. For example, if they say "check Datadog and Slack me errors," the agent needs both Datadog and Slack MCP connectors. Cross-reference with the connectors list above. If any are missing, warn the user and link them to https://claude.ai/settings/connectors to connect first.${z?` The default git repo is already set to \`${z}\`. Ask the user if this is the right repo or if they need a different one.`:" Ask which git repos the remote agent needs cloned into its environment."}
6. **Review and confirm** — Show the full configuration before creating. Let them adjust.
7. **Create it** — Call \`${bM6}\` with \`action: "create"\` and show the result. The response includes the trigger ID. Always output a link at the end: \`https://claude.ai/code/scheduled/{TRIGGER_ID}\`

### UPDATE a trigger:

1. List triggers first so they can pick one
2. Ask what they want to change
3. Show current vs proposed value
4. Confirm and update

### LIST triggers:

1. Fetch and display in a readable format
2. Show: name, schedule (human-readable), enabled/disabled, next run, repo(s)

### RUN NOW:

1. List triggers if they haven't specified which one
2. Confirm which trigger
3. Execute and confirm

## Important Notes

- These are REMOTE agents — they run in Anthropic's cloud, not on the user's machine. They cannot access local files, local services, or local environment variables.
- Always convert cron to human-readable when displaying
- Default to \`enabled: true\` unless user says otherwise
- Accept GitHub URLs in any format (https://github.com/org/repo, org/repo, etc.) and normalize to the full HTTPS URL (without .git suffix)
- The prompt is the most important part — spend time getting it right. The remote agent starts with zero context, so the prompt must be self-contained.
- To delete a trigger, direct users to https://claude.ai/code/scheduled
${w?`- If the user's request seems to require GitHub repo access (e.g. cloning a repo, opening PRs, reading code), remind them that ${u8("tengu_cobalt_lantern",!1)&&N5("allow_quick_web_setup")?"they should run /web-setup to connect their GitHub account (or install the Claude GitHub App on the repo as an alternative) — otherwise the remote agent won't be able to access it":"they need the Claude GitHub App installed on the repo — otherwise the remote agent won't be able to access it"}.`:""}
${$?`
## User Request

The user said: "${$}"

Start by understanding their intent and working through the appropriate workflow above.`:""}`
}
// @from(Ln 556425, Col 0)
function zHA() {
    MA({
        name: "schedule",
        aliases: ["routines"],
        description: "Create, update, list, or run scheduled remote agents (triggers) that execute on a cron schedule.",
        whenToUse: "When the user wants to schedule a recurring remote agent, set up automated tasks, create a cron job for Claude Code, or manage their scheduled agents/triggers.",
        userInvocable: !0,
        isEnabled: () => !S6(process.env.CLAUDE_CODE_REMOTE) && u8("tengu_surreal_dali", !1) && N5("allow_remote_sessions"),
        allowedTools: [bM6, AO],
        async getPromptForCommand(q, K) {
            if (!o7()?.accessToken) return [{
                type: "text",
                text: "You need to authenticate with a claude.ai account first. API accounts are not supported. Run /login, then try /schedule again."
            }];
            let _;
            try {
                _ = await AF()
            } catch (P) {
                return E(`[schedule] Failed to fetch environments: ${P}`, {
                    level: "warn"
                }), [{
                    type: "text",
                    text: "We're having trouble connecting with your remote claude.ai account to set up a scheduled task. Please try /schedule again in a few minutes."
                }]
            }
            let z = null;
            if (_.length === 0) try {
                z = await bR6(), _ = [z]
            } catch (P) {
                return E(`[schedule] Failed to create environment: ${P}`, {
                    level: "warn"
                }), [{
                    type: "text",
                    text: "No remote environments found, and we could not create one automatically. Visit https://claude.ai/code to set one up, then run /schedule again."
                }]
            }
            let Y = [],
                A = !1,
                O = await oN();
            if (O === null) Y.push("Not in a git repo — you'll need to specify a repo URL manually (or skip repos entirely).");
            else if (O.host === "github.com") {
                let {
                    hasAccess: P
                } = await Bd4(O.owner, O.name);
                if (!P) {
                    A = !0;
                    let D = u8("tengu_cobalt_lantern", !1) && N5("allow_quick_web_setup") ? `GitHub not connected for ${O.owner}/${O.name} — run /web-setup to sync your GitHub credentials, or install the Claude GitHub App at https://claude.ai/code/onboarding?magic=github-app-setup.` : `Claude GitHub App not installed on ${O.owner}/${O.name} — install at https://claude.ai/code/onboarding?magic=github-app-setup if your trigger needs this repo.`;
                    Y.push(D)
                }
            }
            let w = tjA(K.options.mcpClients);
            if (w.length === 0) Y.push("No MCP connectors — connect at https://claude.ai/settings/connectors if needed.");
            let $ = Intl.DateTimeFormat().resolvedOptions().timeZone,
                j = qHA(w),
                H = await KHA(),
                J = ["Available environments:"];
            for (let P of _) J.push(`- ${P.name} (id: ${P.environment_id}, kind: ${P.kind})`);
            let X = J.join(`
`);
            return [{
                type: "text",
                text: _HA({
                    userTimezone: $,
                    connectorsInfo: j,
                    gitRepoUrl: H,
                    environmentsInfo: X,
                    createdEnvironment: z,
                    setupNotes: Y,
                    needsGitHubAccessReminder: A,
                    userArgs: q
                })
            }]
        }
    })
}
// @from(Ln 556500, Col 4)
ajA = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
// @from(Ln 556501, Col 4)
x$5 = "What would you like to do with scheduled remote agents?"
// @from(Ln 556502, Col 4)
B$5 = L(() => {
    B1();
    J2();
    cp();
    T7();
    xR6();
    K8();
    gZ();
    Q8();
    pK();
    e8();
    IR6();
    k0()
})
// @from(Ln 556516, Col 4)
F$5 = `# Claude API — C#

> **Note:** The C# SDK is the official Anthropic SDK for C#. Tool use is supported via the Messages API. A class-annotation-based tool runner is not available; use raw tool definitions with JSON schema. The SDK also supports Microsoft.Extensions.AI IChatClient integration with function invocation.

## Installation

\`\`\`bash
dotnet add package Anthropic
\`\`\`

## Client Initialization

\`\`\`csharp
using Anthropic;

// Default (uses ANTHROPIC_API_KEY env var)
AnthropicClient client = new();

// Explicit API key (use environment variables — never hardcode keys)
AnthropicClient client = new() {
    ApiKey = Environment.GetEnvironmentVariable("ANTHROPIC_API_KEY")
};
\`\`\`

---

## Basic Message Request

\`\`\`csharp
using Anthropic.Models.Messages;

var parameters = new MessageCreateParams
{
    Model = Model.ClaudeOpus4_6,
    MaxTokens = 16000,
    Messages = [new() { Role = Role.User, Content = "What is the capital of France?" }]
};
var response = await client.Messages.Create(parameters);

// ContentBlock is a union wrapper. .Value unwraps to the variant object,
// then OfType<T> filters to the type you want. Or use the TryPick* idiom
// shown in the Thinking section below.
foreach (var text in response.Content.Select(b => b.Value).OfType<TextBlock>())
{
    Console.WriteLine(text.Text);
}
\`\`\`

---

## Streaming

\`\`\`csharp
using Anthropic.Models.Messages;

var parameters = new MessageCreateParams
{
    Model = Model.ClaudeOpus4_6,
    MaxTokens = 64000,
    Messages = [new() { Role = Role.User, Content = "Write a haiku" }]
};

await foreach (RawMessageStreamEvent streamEvent in client.Messages.CreateStreaming(parameters))
{
    if (streamEvent.TryPickContentBlockDelta(out var delta) &&
        delta.Delta.TryPickText(out var text))
    {
        Console.Write(text.Text);
    }
}
\`\`\`

**\`RawMessageStreamEvent\` TryPick methods** (naming drops the \`Message\`/\`Raw\` prefix): \`TryPickStart\`, \`TryPickDelta\`, \`TryPickStop\`, \`TryPickContentBlockStart\`, \`TryPickContentBlockDelta\`, \`TryPickContentBlockStop\`. There is no \`TryPickMessageStop\` — use \`TryPickStop\`.

---

## Thinking

**Adaptive thinking is the recommended mode for Claude 4.6+ models.** Claude decides dynamically when and how much to think.

\`\`\`csharp
using Anthropic.Models.Messages;

var response = await client.Messages.Create(new MessageCreateParams
{
    Model = Model.ClaudeOpus4_6,
    MaxTokens = 16000,
    // ThinkingConfigParam? implicitly converts from the concrete variant classes —
    // no wrapper needed.
    Thinking = new ThinkingConfigAdaptive(),
    Messages =
    [
        new() { Role = Role.User, Content = "Solve: 27 * 453" },
    ],
});

// ThinkingBlock(s) precede TextBlock in Content. TryPick* narrows the union.
foreach (var block in response.Content)
{
    if (block.TryPickThinking(out ThinkingBlock? t))
    {
        Console.WriteLine($"[thinking] {t.Thinking}");
    }
    else if (block.TryPickText(out TextBlock? text))
    {
        Console.WriteLine(text.Text);
    }
}
\`\`\`

> **Deprecated:** \`new ThinkingConfigEnabled { BudgetTokens = N }\` (fixed-budget extended thinking) still works on Claude 4.6 but is deprecated. Use adaptive thinking above.

Alternative to \`TryPick*\`: \`.Select(b => b.Value).OfType<ThinkingBlock>()\` (same LINQ pattern as the Basic Message example).

---

## Tool Use

### Defining a tool

\`Tool\` (NOT \`ToolParam\`) with an \`InputSchema\` record. \`InputSchema.Type\` is auto-set to \`"object"\` by the constructor — don't set it. \`ToolUnion\` has an implicit conversion from \`Tool\`, triggered by the collection expression \`[...]\`.

\`\`\`csharp
using System.Text.Json;
using Anthropic.Models.Messages;

var parameters = new MessageCreateParams
{
    Model = Model.ClaudeSonnet4_6,
    MaxTokens = 16000,
    Tools = [
        new Tool {
            Name = "get_weather",
            Description = "Get the current weather in a given location",
            InputSchema = new() {
                Properties = new Dictionary<string, JsonElement> {
                    ["location"] = JsonSerializer.SerializeToElement(
                        new { type = "string", description = "City name" }),
                },
                Required = ["location"],
            },
        },
    ],
    Messages = [new() { Role = Role.User, Content = "Weather in Paris?" }],
};
\`\`\`

Derived from \`anthropic-sdk-csharp/src/Anthropic/Models/Messages/Tool.cs\` and \`ToolUnion.cs:799\` (implicit conversion).

See [shared tool use concepts](../shared/tool-use-concepts.md) for the loop pattern.
### Converting response content to the follow-up assistant message

When echoing Claude's response back in the assistant turn, **there is no \`.ToParam()\` helper** — manually reconstruct each \`ContentBlock\` variant as its \`*Param\` counterpart. Do NOT use \`new ContentBlockParam(block.Json)\`: it compiles and serializes, but \`.Value\` stays \`null\` so \`TryPick*\`/\`Validate()\` fail (degraded JSON pass-through, not the typed path).

\`\`\`csharp
using Anthropic.Models.Messages;

Message response = await client.Messages.Create(parameters);

// No .ToParam() — reconstruct per variant. Implicit conversions from each
// *Param type to ContentBlockParam mean no explicit wrapper.
List<ContentBlockParam> assistantContent = [];
List<ContentBlockParam> toolResults = [];
foreach (ContentBlock block in response.Content)
{
    if (block.TryPickText(out TextBlock? text))
    {
        assistantContent.Add(new TextBlockParam { Text = text.Text });
    }
    else if (block.TryPickThinking(out ThinkingBlock? thinking))
    {
        // Signature MUST be preserved — the API rejects tampering
        assistantContent.Add(new ThinkingBlockParam
        {
            Thinking = thinking.Thinking,
            Signature = thinking.Signature,
        });
    }
    else if (block.TryPickRedactedThinking(out RedactedThinkingBlock? redacted))
    {
        assistantContent.Add(new RedactedThinkingBlockParam { Data = redacted.Data });
    }
    else if (block.TryPickToolUse(out ToolUseBlock? toolUse))
    {
        // ToolUseBlock has required Caller; ToolUseBlockParam.Caller is optional — don't copy it
        assistantContent.Add(new ToolUseBlockParam
        {
            ID = toolUse.ID,
            Name = toolUse.Name,
            Input = toolUse.Input,
        });
        // Execute the tool; collect ONE result per tool_use block — the API
        // rejects the follow-up if any tool_use ID lacks a matching tool_result.
        string result = ExecuteYourTool(toolUse.Name, toolUse.Input);
        toolResults.Add(new ToolResultBlockParam
        {
            ToolUseID = toolUse.ID,
            Content = result,
        });
    }
}

// Follow-up: prior messages + assistant echo + user tool_result(s)
List<MessageParam> followUpMessages =
[
    .. parameters.Messages,
    new() { Role = Role.Assistant, Content = assistantContent },
    new() { Role = Role.User, Content = toolResults },
];
\`\`\`

\`ToolResultBlockParam\` has no tuple constructor — use the object initializer. \`Content\` is a string-or-list union; a plain \`string\` implicitly converts.

---

## Context Editing / Compaction (Beta)

**Beta-namespace prefix is inconsistent** (source-verified against \`src/Anthropic/Models/Beta/Messages/*.cs\` @ 12.9.0). No prefix: \`MessageCreateParams\`, \`MessageCountTokensParams\`, \`Role\`. **Everything else has the \`Beta\` prefix**: \`BetaMessageParam\`, \`BetaMessage\`, \`BetaContentBlock\`, \`BetaToolUseBlock\`, all block param types. The unprefixed \`Role\` WILL collide with \`Anthropic.Models.Messages.Role\` if you import both namespaces (CS0104). Safest: import only Beta; if mixing, alias the beta \`Role\`:

\`\`\`csharp
using Anthropic.Models.Beta.Messages;
using NonBeta = Anthropic.Models.Messages;  // only if you also need non-beta types
// Now: MessageCreateParams, BetaMessageParam, Role (beta's), NonBeta.Role (if needed)
\`\`\`


\`BetaMessage.Content\` is \`IReadOnlyList<BetaContentBlock>\` — a 15-variant discriminated union. Narrow with \`TryPick*\`. **Response \`BetaContentBlock\` is NOT assignable to param \`BetaContentBlockParam\`** — there's no \`.ToParam()\` in C#. Round-trip by converting each block:

\`\`\`csharp
using Anthropic.Models.Beta.Messages;

var betaParams = new MessageCreateParams   // no Beta prefix — one of only 2 unprefixed
{
    Model = Model.ClaudeOpus4_6,
    MaxTokens = 16000,
    Betas = ["compact-2026-01-12"],
    ContextManagement = new BetaContextManagementConfig
    {
        Edits = [new BetaCompact20260112Edit()],
    },
    Messages = messages,
};
BetaMessage resp = await client.Beta.Messages.Create(betaParams);

foreach (BetaContentBlock block in resp.Content)
{
    if (block.TryPickCompaction(out BetaCompactionBlock? compaction))
    {
        // Content is nullable — compaction can fail server-side
        Console.WriteLine($"compaction summary: {compaction.Content}");
    }
}

// Context-edit metadata lives on a separate nullable field
if (resp.ContextManagement is { } ctx)
{
    foreach (var edit in ctx.AppliedEdits)
        Console.WriteLine($"cleared {edit.ClearedInputTokens} tokens");
}

// ROUND-TRIP: BetaMessageParam.Content is BetaMessageParamContent (a string|list
// union). It implicit-converts from List<BetaContentBlockParam>, NOT from the
// response's IReadOnlyList<BetaContentBlock>. Convert each block:
List<BetaContentBlockParam> paramBlocks = [];
foreach (var b in resp.Content)
{
    if (b.TryPickText(out var t)) paramBlocks.Add(new BetaTextBlockParam { Text = t.Text });
    else if (b.TryPickCompaction(out var c)) paramBlocks.Add(new BetaCompactionBlockParam { Content = c.Content });
    // ... other variants as needed
}
messages.Add(new BetaMessageParam { Role = Role.Assistant, Content = paramBlocks });
\`\`\`

All 15 \`BetaContentBlock.TryPick*\` variants: \`Text\`, \`Thinking\`, \`RedactedThinking\`, \`ToolUse\`, \`ServerToolUse\`, \`WebSearchToolResult\`, \`WebFetchToolResult\`, \`CodeExecutionToolResult\`, \`BashCodeExecutionToolResult\`, \`TextEditorCodeExecutionToolResult\`, \`ToolSearchToolResult\`, \`McpToolUse\`, \`McpToolResult\`, \`ContainerUpload\`, \`Compaction\`.

**\`BetaToolUseBlock.Input\` is \`IReadOnlyDictionary<string, JsonElement>\`** — index by key then call the \`JsonElement\` extractor:

\`\`\`csharp
if (block.TryPickToolUse(out BetaToolUseBlock? tu))
{
    int a = tu.Input["a"].GetInt32();
    string s = tu.Input["name"].GetString()!;
}
\`\`\`

---

## Effort Parameter

Effort is nested under \`OutputConfig\`, NOT a top-level property. \`ApiEnum<string, Effort>\` has an implicit conversion from the enum, so assign \`Effort.High\` directly.

\`\`\`csharp
OutputConfig = new OutputConfig { Effort = Effort.High },
\`\`\`

Values: \`Effort.Low\`, \`Effort.Medium\`, \`Effort.High\`, \`Effort.Max\`. Combine with \`Thinking = new ThinkingConfigAdaptive()\` for cost-quality control.

---

## Prompt Caching

\`System\` takes \`MessageCreateParamsSystem?\` — a union of \`string\` or \`List<TextBlockParam>\`. There is no \`SystemTextBlockParam\`; use plain \`TextBlockParam\`. The implicit conversion needs the concrete \`List<TextBlockParam>\` type (array literals won't convert). For placement patterns and the silent-invalidator audit checklist, see \`shared/prompt-caching.md\`.

\`\`\`csharp
System = new List<TextBlockParam> {
    new() {
        Text = longSystemPrompt,
        CacheControl = new CacheControlEphemeral(),  // auto-sets Type = "ephemeral"
    },
},
\`\`\`

Optional \`Ttl\` on \`CacheControlEphemeral\`: \`new() { Ttl = Ttl.Ttl1h }\` or \`Ttl.Ttl5m\`. \`CacheControl\` also exists on \`Tool.CacheControl\` and top-level \`MessageCreateParams.CacheControl\`.

Verify hits via \`response.Usage.CacheCreationInputTokens\` / \`response.Usage.CacheReadInputTokens\`.

---

## Token Counting

\`\`\`csharp
MessageTokensCount result = await client.Messages.CountTokens(new MessageCountTokensParams {
    Model = Model.ClaudeOpus4_6,
    Messages = [new() { Role = Role.User, Content = "Hello" }],
});
long tokens = result.InputTokens;
\`\`\`

\`MessageCountTokensParams.Tools\` uses a different union type (\`MessageCountTokensTool\`) than \`MessageCreateParams.Tools\` (\`ToolUnion\`) — if you're passing tools, the compiler will tell you when it matters.

---

## Structured Output

\`\`\`csharp
OutputConfig = new OutputConfig {
    Format = new JsonOutputFormat {
        Schema = new Dictionary<string, JsonElement> {
            ["type"] = JsonSerializer.SerializeToElement("object"),
            ["properties"] = JsonSerializer.SerializeToElement(
                new { name = new { type = "string" } }),
            ["required"] = JsonSerializer.SerializeToElement(new[] { "name" }),
        },
    },
},
\`\`\`

\`JsonOutputFormat.Type\` is auto-set to \`"json_schema"\` by the constructor. \`Schema\` is \`required\`.

---

## PDF / Document Input

\`DocumentBlockParam\` takes a \`DocumentBlockParamSource\` union: \`Base64PdfSource\` / \`UrlPdfSource\` / \`PlainTextSource\` / \`ContentBlockSource\`. \`Base64PdfSource\` auto-sets \`MediaType = "application/pdf"\` and \`Type = "base64"\`.

\`\`\`csharp
new MessageParam {
    Role = Role.User,
    Content = new List<ContentBlockParam> {
        new DocumentBlockParam { Source = new Base64PdfSource { Data = base64String } },
        new TextBlockParam { Text = "Summarize this PDF" },
    },
}
\`\`\`

---

## Server-Side Tools

Web search, bash, text editor, and code execution are built-in server tools. Type names are version-suffixed; constructors auto-set \`name\`/\`type\`. All implicit-convert to \`ToolUnion\`.

\`\`\`csharp
Tools = [
    new WebSearchTool20260209(),
    new ToolBash20250124(),
    new ToolTextEditor20250728(),
    new CodeExecutionTool20260120(),
],
\`\`\`

Also available: \`WebFetchTool20260209\`, \`MemoryTool20250818\`. \`WebSearchTool20260209\` optionals: \`AllowedDomains\`, \`BlockedDomains\`, \`MaxUses\`, \`UserLocation\`.

---

## Files API (Beta)

Files live under \`client.Beta.Files\` (namespace \`Anthropic.Models.Beta.Files\`). \`BinaryContent\` implicit-converts from \`Stream\` and \`byte[]\`.

\`\`\`csharp
using Anthropic.Models.Beta.Files;
using Anthropic.Models.Beta.Messages;

FileMetadata meta = await client.Beta.Files.Upload(
    new FileUploadParams { File = File.OpenRead("doc.pdf") });

// Referencing the uploaded file requires Beta message types:
new BetaRequestDocumentBlock {
    Source = new BetaFileDocumentSource { FileID = meta.ID },
}
\`\`\`

The non-beta \`DocumentBlockParamSource\` union has no file-ID variant — file references need \`client.Beta.Messages.Create()\`.
`
// @from(Ln 556919, Col 4)
p$5 = () => {}
// @from(Ln 556920, Col 4)
U$5 = `# Claude API — cURL / Raw HTTP

Use these examples when the user needs raw HTTP requests or is working in a language without an official SDK.

## Setup

\`\`\`bash
export ANTHROPIC_API_KEY="your-api-key"
\`\`\`

---

## Basic Message Request

\`\`\`bash
curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "{{OPUS_ID}}",
    "max_tokens": 16000,
    "messages": [
      {"role": "user", "content": "What is the capital of France?"}
    ]
  }'
\`\`\`

### Parsing the response

Use \`jq\` to extract fields from the JSON response. Do not use \`grep\`/\`sed\` —
JSON strings can contain any character and regex parsing will break on quotes,
escapes, or multi-line content.

\`\`\`bash
# Capture the response, then extract fields
response=$(curl -s https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{"model":"{{OPUS_ID}}","max_tokens":16000,"messages":[{"role":"user","content":"Hello"}]}')

# Print the first text block (-r strips the JSON quotes)
echo "$response" | jq -r '.content[0].text'

# Read usage fields
input_tokens=$(echo "$response" | jq -r '.usage.input_tokens')
output_tokens=$(echo "$response" | jq -r '.usage.output_tokens')

# Read stop reason (for tool-use loops)
stop_reason=$(echo "$response" | jq -r '.stop_reason')

# Extract all text blocks (content is an array; filter to type=="text")
echo "$response" | jq -r '.content[] | select(.type == "text") | .text'
\`\`\`


---

## Streaming (SSE)

\`\`\`bash
curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "{{OPUS_ID}}",
    "max_tokens": 64000,
    "stream": true,
    "messages": [{"role": "user", "content": "Write a haiku"}]
  }'
\`\`\`

The response is a stream of Server-Sent Events:

\`\`\`
event: message_start
data: {"type":"message_start","message":{"id":"msg_...","type":"message",...}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":12}}

event: message_stop
data: {"type":"message_stop"}
\`\`\`

---

## Tool Use

\`\`\`bash
curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "{{OPUS_ID}}",
    "max_tokens": 16000,
    "tools": [{
      "name": "get_weather",
      "description": "Get current weather for a location",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {"type": "string", "description": "City name"}
        },
        "required": ["location"]
      }
    }],
    "messages": [{"role": "user", "content": "What is the weather in Paris?"}]
  }'
\`\`\`

When Claude responds with a \`tool_use\` block, send the result back:

\`\`\`bash
curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "{{OPUS_ID}}",
    "max_tokens": 16000,
    "tools": [{
      "name": "get_weather",
      "description": "Get current weather for a location",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {"type": "string", "description": "City name"}
        },
        "required": ["location"]
      }
    }],
    "messages": [
      {"role": "user", "content": "What is the weather in Paris?"},
      {"role": "assistant", "content": [
        {"type": "text", "text": "Let me check the weather."},
        {"type": "tool_use", "id": "toolu_abc123", "name": "get_weather", "input": {"location": "Paris"}}
      ]},
      {"role": "user", "content": [
        {"type": "tool_result", "tool_use_id": "toolu_abc123", "content": "72°F and sunny"}
      ]}
    ]
  }'
\`\`\`

---

## Prompt Caching

Put \`cache_control\` on the last block of the stable prefix. See \`shared/prompt-caching.md\` for placement patterns and the silent-invalidator audit checklist.

\`\`\`bash
curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "{{OPUS_ID}}",
    "max_tokens": 16000,
    "system": [
      {"type": "text", "text": "<large shared prompt...>", "cache_control": {"type": "ephemeral"}}
    ],
    "messages": [{"role": "user", "content": "Summarize the key points"}]
  }'
\`\`\`

For 1-hour TTL: \`"cache_control": {"type": "ephemeral", "ttl": "1h"}\`. Top-level \`"cache_control"\` on the request body auto-places on the last cacheable block. Verify hits via the response \`usage.cache_creation_input_tokens\` / \`usage.cache_read_input_tokens\` fields.

---

## Extended Thinking

> **Opus 4.7, Opus 4.6, and Sonnet 4.6:** Use adaptive thinking. \`budget_tokens\` is removed on Opus 4.7 (400 if sent); deprecated on Opus 4.6 and Sonnet 4.6.
> **Older models:** Use \`"type": "enabled"\` with \`"budget_tokens": N\` (must be < \`max_tokens\`, min 1024).

\`\`\`bash
# Opus 4.7 / 4.6: adaptive thinking (recommended)
curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "{{OPUS_ID}}",
    "max_tokens": 16000,
    "thinking": {
      "type": "adaptive"
    },
    "output_config": {
      "effort": "high"
    },
    "messages": [{"role": "user", "content": "Solve this step by step..."}]
  }'
\`\`\`

---

## Required Headers

| Header              | Value              | Description                |
| ------------------- | ------------------ | -------------------------- |
| \`Content-Type\`      | \`application/json\` | Required                   |
| \`x-api-key\`         | Your API key       | Authentication             |
| \`anthropic-version\` | \`2023-06-01\`       | API version                |
| \`anthropic-beta\`    | Beta feature IDs   | Required for beta features |
`
// @from(Ln 557137, Col 4)
g$5 = () => {}
// @from(Ln 557138, Col 4)
d$5 = `# Managed Agents — cURL / Raw HTTP

Use these examples when the user needs raw HTTP requests or is working without an SDK.

## Setup

\`\`\`bash
export ANTHROPIC_API_KEY="your-api-key"

# Common headers
HEADERS=(
  -H "Content-Type: application/json"
  -H "x-api-key: $ANTHROPIC_API_KEY"
  -H "anthropic-version: 2023-06-01"
  -H "anthropic-beta: managed-agents-2026-04-01"
)
\`\`\`

---

## Create an Environment

\`\`\`bash
curl -X POST https://api.anthropic.com/v1/environments \\
  "\${HEADERS[@]}" \\
  -d '{
    "name": "my-dev-env",
    "config": {
      "type": "cloud",
      "networking": { "type": "unrestricted" }
    }
  }'
\`\`\`

### With restricted networking

\`\`\`bash
curl -X POST https://api.anthropic.com/v1/environments \\
  "\${HEADERS[@]}" \\
  -d '{
    "name": "restricted-env",
    "config": {
      "type": "cloud",
      "networking": {
        "type": "package_managers_and_custom",
        "allowed_hosts": ["api.example.com"]
      }
    }
  }'
\`\`\`

---

## Create an Agent (required first step)

> ⚠️ **There is no inline agent config.** Under \`managed-agents-2026-04-01\`, \`model\`/\`system\`/\`tools\` are top-level fields on \`POST /v1/agents\`, not on the session. Always create the agent first — the session only takes \`"agent": {"type": "agent", "id": "..."}\`.

### Minimal

\`\`\`bash
# 1. Create the agent
curl -X POST https://api.anthropic.com/v1/agents \\
  "\${HEADERS[@]}" \\
  -d '{
    "name": "Coding Assistant",
    "model": "{{OPUS_ID}}",
    "tools": [{ "type": "agent_toolset_20260401" }]
  }'
# → { "id": "agent_abc123", ... }

# 2. Start a session
curl -X POST https://api.anthropic.com/v1/sessions \\
  "\${HEADERS[@]}" \\
  -d '{
    "agent": { "type": "agent", "id": "agent_abc123", "version": "1772585501101368014" },
    "environment_id": "env_abc123"
  }'
\`\`\`

### With system prompt, custom tools, and GitHub repo

\`\`\`bash
# 1. Create the agent
curl -X POST https://api.anthropic.com/v1/agents \\
  "\${HEADERS[@]}" \\
  -d '{
    "name": "Code Reviewer",
    "model": "{{OPUS_ID}}",
    "system": "You are a senior code reviewer. Be thorough and constructive.",
    "tools": [
      { "type": "agent_toolset_20260401" },
      {
        "type": "custom",
        "name": "run_linter",
        "description": "Run the project linter on a file",
        "input_schema": {
          "type": "object",
          "properties": {
            "file_path": { "type": "string", "description": "Path to lint" }
          },
          "required": ["file_path"]
        }
      }
    ]
  }'

# 2. Start a session with the repo mounted
curl -X POST https://api.anthropic.com/v1/sessions \\
  "\${HEADERS[@]}" \\
  -d '{
    "agent": { "type": "agent", "id": "agent_abc123", "version": "1772585501101368014" },
    "environment_id": "env_abc123",
    "title": "Code review session",
    "resources": [
      {
        "type": "github_repository",
        "url": "https://github.com/owner/repo",
        "mount_path": "/workspace/repo",
        "authorization_token": "ghp_...",
        "branch": "feature-branch"
      }
    ]
  }'
\`\`\`

---

## Send a User Message

\`\`\`bash
curl -X POST https://api.anthropic.com/v1/sessions/$SESSION_ID/events \\
  "\${HEADERS[@]}" \\
  -d '{
    "events": [
      {
        "type": "user.message",
        "content": [{ "type": "text", "text": "Review the auth module for security issues" }]
      }
    ]
  }'
\`\`\`

---

## Stream Events (SSE)

\`\`\`bash
curl -N https://api.anthropic.com/v1/sessions/$SESSION_ID/events/stream \\
  "\${HEADERS[@]}"
\`\`\`

Response format:

\`\`\`
event: session.status_running
data: {"type":"session.status_running","id":"sevt_...","processed_at":"..."}

event: agent.message
data: {"type":"agent.message","id":"sevt_...","content":[{"type":"text","text":"I'll review..."}],"processed_at":"..."}

event: session.status_idle
data: {"type":"session.status_idle","id":"sevt_...","processed_at":"..."}
\`\`\`

---

## Poll Events

\`\`\`bash
# Get all events
curl https://api.anthropic.com/v1/sessions/$SESSION_ID/events \\
  "\${HEADERS[@]}"

# Paginated — get next page of events
curl "https://api.anthropic.com/v1/sessions/$SESSION_ID/events?page=page_abc123" \\
  "\${HEADERS[@]}"
\`\`\`

---

## Provide Custom Tool Result

When the agent calls a custom tool, send the result back:

\`\`\`bash
curl -X POST https://api.anthropic.com/v1/sessions/$SESSION_ID/events \\
  "\${HEADERS[@]}" \\
  -d '{
    "events": [
      {
        "type": "user.custom_tool_result",
        "custom_tool_use_id": "sevt_abc123",
        "content": [{ "type": "text", "text": "No linting errors found." }]
      }
    ]
  }'
\`\`\`

---

## Interrupt a Running Session

\`\`\`bash
curl -X POST https://api.anthropic.com/v1/sessions/$SESSION_ID/events \\
  "\${HEADERS[@]}" \\
  -d '{
    "events": [
      {
        "type": "interrupt"
      }
    ]
  }'
\`\`\`

---

## Get Session Details

\`\`\`bash
curl https://api.anthropic.com/v1/sessions/$SESSION_ID \\
  "\${HEADERS[@]}"
\`\`\`

---

## List Sessions

\`\`\`bash
curl https://api.anthropic.com/v1/sessions \\
  "\${HEADERS[@]}"
\`\`\`

---

## Delete a Session

\`\`\`bash
curl -X DELETE https://api.anthropic.com/v1/sessions/$SESSION_ID \\
  "\${HEADERS[@]}"
\`\`\`

---

## Upload a File

\`\`\`bash
curl -X POST https://api.anthropic.com/v1/files \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "anthropic-beta: files-api-2025-04-14" \\
  -F "file=@path/to/file.txt" \\
  -F "purpose=agent"
\`\`\`

---

## List and Download Session Files

List files the agent wrote to \`/mnt/session/outputs/\` during a session, then download them.

\`\`\`bash
# List files associated with a session
curl "https://api.anthropic.com/v1/files?scope_id=$SESSION_ID" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "anthropic-beta: files-api-2025-04-14,managed-agents-2026-04-01"

# Download a specific file
curl "https://api.anthropic.com/v1/files/$FILE_ID/content" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "anthropic-beta: files-api-2025-04-14,managed-agents-2026-04-01" \\
  -o downloaded_file.txt
\`\`\`

---

## List Agents

\`\`\`bash
curl https://api.anthropic.com/v1/agents \\
  "\${HEADERS[@]}"
\`\`\`

---

## MCP Server Integration

\`\`\`bash
# 1. Agent declares MCP server (no auth here — auth goes in a vault)
curl -X POST https://api.anthropic.com/v1/agents \\
  "\${HEADERS[@]}" \\
  -d '{
    "name": "MCP Agent",
    "model": "{{OPUS_ID}}",
    "mcp_servers": [
      { "type": "url", "name": "my-tools", "url": "https://my-mcp-server.example.com/sse" }
    ],
    "tools": [
      { "type": "agent_toolset_20260401" },
      { "type": "mcp_toolset", "mcp_server_name": "my-tools" }
    ]
  }'

# 2. Session attaches vault containing credentials for that MCP server URL
curl -X POST https://api.anthropic.com/v1/sessions \\
  "\${HEADERS[@]}" \\
  -d '{
    "agent": "agent_abc123",
    "environment_id": "env_abc123",
    "vault_ids": ["vlt_abc123"]
  }'
\`\`\`

See \`shared/managed-agents-tools.md\` §Vaults for creating vaults and adding credentials.

---

## Tool Configuration

\`\`\`bash
curl -X POST https://api.anthropic.com/v1/agents \\
  "\${HEADERS[@]}" \\
  -d '{
    "name": "Restricted Agent",
    "model": "{{OPUS_ID}}",
    "tools": [
      {
        "type": "agent_toolset_20260401",
        "default_config": { "enabled": true },
        "configs": [
          { "name": "bash", "enabled": false }
        ]
      }
    ]
  }'
\`\`\`
`
// @from(Ln 557476, Col 4)
Q$5 = () => {}