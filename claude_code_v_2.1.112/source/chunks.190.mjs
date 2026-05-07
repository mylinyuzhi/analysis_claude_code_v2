
// @from(Ln 492390, Col 0)
async function AsY(q) {
    let K = Y7(),
        _ = mf6(K),
        z = await rtK(_, q),
        Y = [...z.slashCommandCounts.entries()].sort((H, J) => J[1] - H[1]).map(([H, J]) => ({
            name: `/${H}`,
            count: J
        })),
        A = await YsY(K),
        O = [...z.mcpServerCounts.entries()].sort((H, J) => J[1] - H[1]).map(([H, J]) => {
            let X = A[H];
            return {
                name: H,
                callCount: J,
                urlOrigin: typeof X?.url === "string" ? zsY(X.url) : void 0
            }
        }),
        w = (await M7("git", ["config", "user.name"], {
            cwd: K
        })).stdout.trim(),
        $ = (await M7("git", ["remote", "get-url", "origin"], {
            cwd: K
        })).stdout.trim();
    return {
        usageData: I6({
            generatedBy: w || void 0,
            currentRepo: TQ6($) ?? qsY(K),
            windowDays: q,
            sessionCount: z.sessionFileCount,
            slashCommands: Y,
            mcpServers: O,
            sessionDescriptors: z.sessionDescriptors
        }, null, 2),
        sessionCount: z.sessionFileCount,
        slashCommandCount: z.slashCommandCounts.size,
        mcpServerCount: z.mcpServerCounts.size
    }
}
// @from(Ln 492428, Col 4)
_sY = 30
// @from(Ln 492429, Col 4)
OsY = `# Welcome to [Team Name]

## How We Use Claude

Based on [name]'s usage over the last [N] days:

Work Type Breakdown:
  [Category 1]  [ascii bar]  [N]%
  [Category 2]  [ascii bar]  [N]%
  [Category 3]  [ascii bar]  [N]%
  ...

Top Skills & Commands:
  [/command]  [ascii bar]  [N]x/month
  ...

Top MCP Servers:
  [Server]  [ascii bar]  [N] calls
  ...

## Your Setup Checklist

### Codebases
- [ ] [repo-name] — [repo url]
...

### MCP Servers to Activate
- [ ] [Server] — [what it's for]. [How to get access]
...

### Skills to Know About
- [/command] — [what it does, when the team uses it]
...

## Team Tips

_TODO_

## Get Started

_TODO_

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->`
// @from(Ln 492492, Col 4)
wsY = `You are helping a power user generate an onboarding guide for teammates who are new to Claude Code. The guide will live in the team's onboarding docs and can be pasted into Claude for an interactive walkthrough.

You're co-authoring this with them — collaborative and helpful, like a teammate who's done this before and is happy to share.

## Usage data (last {{WINDOW_DAYS}} days)

This was scanned from the guide creator's local Claude Code transcripts:

\`\`\`json
{{USAGE_DATA}}
\`\`\`

## Your task

Before anything else — including before thinking through the classification — output exactly this line as your first visible text:

> Looking at how you've used Claude over the last {{WINDOW_DAYS}} days to put together an onboarding guide for teammates new to Claude Code.

This must come before any extended thinking about session descriptors. The guide creator is staring at a blank screen until you do. Classification is step 2, not step 1.

Generate the guide immediately, then ask for revisions. Don't wait for answers first — it's easier for the guide creator to edit a concrete draft than answer abstract questions.

1. **Output the acknowledgment line above.** No thinking, no classification, no tool calls before this. One line, then move on.

2. **Derive the work-type breakdown.** Read the \`sessionDescriptors\` array — each entry describes one session via its title, any linked code reviews (\`prNumbers\`), and first user message. Classify each session into one of these task types:

   - **build_feature** — new functionality, scripts, tools, config/CI/env setup
   - **debug_fix** — investigating and fixing bugs
   - **improve_quality** — refactoring, tests, cleanup, code review
   - **analyze_data** — queries, metrics, number crunching
   - **plan_design** — architecture, approach, strategy, understanding unfamiliar code, design review
   - **prototype** — spikes, POCs, throwaway exploration
   - **write_docs** — PRDs, RFCs, READMEs, design docs, copy/doc review

   Categories describe the *type of task*, not the project or domain — a teammate on any project should recognize them. Review sessions belong with whatever's being reviewed: code review is improve_quality, doc review is write_docs, design review is plan_design. Most sessions fit the list; only invent a new category if it's genuinely a different type of task. Pick the top 3-5 with rough percentages. First messages alone are usually enough; titles and code-review links are enrichment. If first messages are uninformative, use tool and MCP counts as a weak hint. If there are ~0 sessions, leave the breakdown as a TODO.

   In the rendered guide, display categories with spaces and title case (e.g. "Build Feature" not "build_feature").

3. **Gather the remaining pieces.** For repos, start with \`currentRepo\` and check the workspace for sibling repo directories. For MCP server setup, use each entry's \`name\` (and \`urlOrigin\` where present) to infer what the server does and how a teammate would get access. Leave the Team Tips and Get Started sections as TODO placeholders — you'll ask for these in Review and fill them in after.

4. **Write the guide to \`ONBOARDING.md\`** following this template:

\`\`\`
{{GUIDE_TEMPLATE}}
\`\`\`

   Fill in real numbers from the usage data (not placeholders). Use \`generatedBy\` for the name; if it's missing, omit the name. Ascii bar charts: \`█\` for filled, \`░\` for empty, 20 chars wide. Keep the HTML comment instruction at the bottom exactly as shown.

5. **Render the guide in a code block, then close out the first turn.** You're co-authoring this guide with the guide creator — frame the follow-up as collaboration, not corrections.

   After the code block, add a \`---\` horizontal rule and a \`**Review**\` heading so the guide is visually separated from your questions. Under the heading, number these three questions:

   1. "I went with '[X]' for the team name — let me know if that sounds right." (or if you couldn't tell: "What's the team name? I'll add it in.")
   2. Is there a starter task for someone new to Claude Code? (ticket or doc link — optional)
   3. Any team tips you'd tell a new teammate that aren't already in CLAUDE.md?

   After they answer, update \`ONBOARDING.md\` with their team name, tips, and starter task. Then close with this exact line (not numbered, not paraphrased):

   Saved to \`ONBOARDING.md\`. Drop it in your team docs and channels — when a new teammate pastes it into Claude Code, they get a guided onboarding tour from there.

   Apply any edits they come back with to the file.`
// @from(Ln 492553, Col 4)
$sY
// @from(Ln 492553, Col 9)
jsY
// @from(Ln 492553, Col 14)
JsY
// @from(Ln 492553, Col 19)
mo8
// @from(Ln 492553, Col 24)
HsY
// @from(Ln 492554, Col 4)
$z8 = L(() => {
    U4();
    y8();
    B1();
    C8();
    T7();
    K8();
    m8();
    Q4();
    pK();
    hm();
    e8();
    otK();
    $sY = ["Edit(ONBOARDING.md)", "Bash(ls *)"], jsY = {
        type: "prompt",
        name: "team-onboarding",
        description: "Help teammates ramp on Claude Code with a guide from your usage",
        allowedTools: $sY,
        contentLength: 0,
        isEnabled: () => !0,
        isHidden: !1,
        progressMessage: "scanning usage data",
        userFacingName() {
            return "team-onboarding"
        },
        source: "builtin",
        disableModelInvocation: !0,
        async getPromptForCommand() {
            let q = u8("tengu_flint_harbor_prompt", {}),
                K = typeof q?.prompt === "string" ? q.prompt : wsY,
                _ = typeof q?.guideTemplate === "string" ? q.guideTemplate : OsY,
                z = typeof q?.windowDays === "number" ? Math.min(Math.max(Math.floor(q.windowDays), 1), 365) : _sY;
            d("tengu_team_onboarding_invoked", {
                window_days: z
            });
            let {
                usageData: Y,
                sessionCount: A,
                slashCommandCount: O,
                mcpServerCount: w
            } = await AsY(z), $ = K.replaceAll("{{WINDOW_DAYS}}", String(z)).replaceAll("{{GUIDE_TEMPLATE}}", _).replaceAll("{{USAGE_DATA}}", Y);
            return d("tengu_team_onboarding_generated", {
                session_count: A,
                slash_command_count: O,
                mcp_server_count: w,
                window_days: z
            }), [{
                type: "text",
                text: $
            }]
        }
    }, JsY = jsY, mo8 = {
        heading: "On a team?",
        body: `Ask a teammate to run /team-onboarding and share the guide.
Paste it as your first message and I'll get you set up.`
    }, HsY = P1(() => {
        if (u26()) return "off";
        let q = process.env.CLAUDE_CODE_TEAM_ONBOARDING;
        if (q === "banner" || q === "step") return q;
        let K = u8("tengu_cedar_inlet", "off");
        if (K !== "off") d("tengu_team_onboarding_discovery_shown", {
            arm: K
        });
        return K
    })
})
// @from(Ln 492620, Col 4)
zeK = {}
// @from(Ln 492641, Col 0)
function ttK() {
    return LE()
}
// @from(Ln 492645, Col 0)
function WsY() {
    return LE()
}
// @from(Ln 492649, Col 0)
function Fo8() {
    return W66(A7(), "usage-data")
}
// @from(Ln 492653, Col 0)
function go8() {
    return W66(Fo8(), "facets")
}
// @from(Ln 492657, Col 0)
function $H7() {
    return W66(Fo8(), "session-meta")
}
// @from(Ln 492661, Col 0)
function GsY(q) {
    let K = PsY(q).toLowerCase();
    return DsY[K] || null
}
// @from(Ln 492666, Col 0)
function vsY(q) {
    let K = {},
        _ = {},
        z = 0,
        Y = 0,
        A = 0,
        O = 0,
        w = 0,
        $ = [],
        j = 0,
        H = {},
        J = !1,
        X = 0,
        M = 0,
        P = new Set,
        W = [],
        D = [],
        Z = !1,
        G = !1,
        f = !1,
        v = null;
    for (let V of q.messages) {
        let k = V.timestamp;
        if (V.type === "assistant" && V.message) {
            if (k) v = k;
            let N = V.message.usage;
            if (N) A += N.input_tokens || 0, O += N.output_tokens || 0;
            let R = V.message.content;
            if (Array.isArray(R)) {
                for (let h of R)
                    if (h.type === "tool_use" && "name" in h) {
                        let C = h.name;
                        if (K[C] = (K[C] || 0) + 1, C === T4 || C === Gh) J = !0;
                        if (C.startsWith("mcp__")) Z = !0;
                        if (C === "WebSearch") G = !0;
                        if (C === "WebFetch") f = !0;
                        let x = h.input;
                        if (x) {
                            let B = x.file_path || "";
                            if (B) {
                                let S = GsY(B);
                                if (S) _[S] = (_[S] || 0) + 1;
                                if (C === "Edit" || C === "Write") P.add(B)
                            }
                            if (C === "Edit") {
                                let S = x.old_string || "",
                                    F = x.new_string || "";
                                for (let U of mK6(S, F)) {
                                    if (U.added) X += U.count || 0;
                                    if (U.removed) M += U.count || 0
                                }
                            }
                            if (C === "Write") {
                                let S = x.content || "";
                                if (S) X += tz(S, `
`) + 1
                            }
                            let m = x.command || "";
                            if (m.includes("git commit")) z++;
                            if (m.includes("git push")) Y++
                        }
                    }
            }
        }
        if (V.type === "user" && V.message) {
            let N = V.message.content,
                R = !1;
            if (typeof N === "string" && N.trim()) R = !0;
            else if (Array.isArray(N)) {
                for (let h of N)
                    if (h.type === "text" && "text" in h) {
                        R = !0;
                        break
                    }
            }
            if (R) {
                if (k) try {
                    let C = new Date(k).getHours();
                    W.push(C), D.push(k)
                } catch {}
                if (v && k) {
                    let h = new Date(v).getTime(),
                        x = (new Date(k).getTime() - h) / 1000;
                    if (x > 2 && x < 3600) $.push(x)
                }
            }
            if (Array.isArray(N)) {
                for (let h of N)
                    if (h.type === "tool_result" && "content" in h) {
                        if (h.is_error) {
                            j++;
                            let x = h.content,
                                B = "Other";
                            if (typeof x === "string") {
                                let m = x.toLowerCase();
                                if (m.includes("exit code")) B = "Command Failed";
                                else if (m.includes("rejected") || m.includes("doesn't want")) B = "User Rejected";
                                else if (m.includes("string to replace not found") || m.includes("no changes")) B = "Edit Failed";
                                else if (m.includes("modified since read")) B = "File Changed";
                                else if (m.includes("exceeds maximum") || m.includes("too large")) B = "File Too Large";
                                else if (m.includes("file not found") || m.includes("does not exist")) B = "File Not Found"
                            }
                            H[B] = (H[B] || 0) + 1
                        }
                    }
            }
            if (typeof N === "string") {
                if (N.includes("[Request interrupted by user")) w++
            } else if (Array.isArray(N)) {
                for (let h of N)
                    if (h.type === "text" && "text" in h && h.text.includes("[Request interrupted by user")) {
                        w++;
                        break
                    }
            }
        }
    }
    return {
        toolCounts: K,
        languages: _,
        gitCommits: z,
        gitPushes: Y,
        inputTokens: A,
        outputTokens: O,
        userInterruptions: w,
        userResponseTimes: $,
        toolErrors: j,
        toolErrorCategories: H,
        usesTaskAgent: J,
        usesMcp: Z,
        usesWebSearch: G,
        usesWebFetch: f,
        linesAdded: X,
        linesRemoved: M,
        filesModified: P,
        messageHours: W,
        userMessageTimestamps: D
    }
}
// @from(Ln 492806, Col 0)
function TsY(q) {
    return !Number.isNaN(q.created.getTime()) && !Number.isNaN(q.modified.getTime())
}
// @from(Ln 492810, Col 0)
function JH7(q) {
    let K = vsY(q),
        _ = xY(q) || "unknown",
        z = q.created.toISOString(),
        Y = Math.round((q.modified.getTime() - q.created.getTime()) / 1000 / 60),
        A = 0,
        O = 0;
    for (let w of q.messages) {
        if (w.type === "assistant") O++;
        if (w.type === "user" && w.message) {
            let $ = w.message.content,
                j = !1;
            if (typeof $ === "string" && $.trim()) j = !0;
            else if (Array.isArray($)) {
                for (let H of $)
                    if (H.type === "text" && "text" in H) {
                        j = !0;
                        break
                    }
            }
            if (j) A++
        }
    }
    return {
        session_id: _,
        project_path: q.projectPath || "",
        start_time: z,
        duration_minutes: Y,
        user_message_count: A,
        assistant_message_count: O,
        tool_counts: K.toolCounts,
        languages: K.languages,
        git_commits: K.gitCommits,
        git_pushes: K.gitPushes,
        input_tokens: K.inputTokens,
        output_tokens: K.outputTokens,
        first_prompt: q.firstPrompt || "",
        summary: q.summary,
        user_interruptions: K.userInterruptions,
        user_response_times: K.userResponseTimes,
        tool_errors: K.toolErrors,
        tool_error_categories: K.toolErrorCategories,
        uses_task_agent: K.usesTaskAgent,
        uses_mcp: K.usesMcp,
        uses_web_search: K.usesWebSearch,
        uses_web_fetch: K.usesWebFetch,
        lines_added: K.linesAdded,
        lines_removed: K.linesRemoved,
        files_modified: K.filesModified.size,
        message_hours: K.messageHours,
        user_message_timestamps: K.userMessageTimestamps
    }
}
// @from(Ln 492864, Col 0)
function VsY(q) {
    let K = new Map;
    for (let _ of q) {
        let z = _.meta.session_id,
            Y = K.get(z);
        if (!Y || _.meta.user_message_count > Y.meta.user_message_count || _.meta.user_message_count === Y.meta.user_message_count && _.meta.duration_minutes > Y.meta.duration_minutes) K.set(z, _)
    }
    return [...K.values()]
}
// @from(Ln 492874, Col 0)
function ksY(q) {
    let K = [],
        _ = JH7(q);
    K.push(`Session: ${_.session_id.slice(0,8)}`), K.push(`Date: ${_.start_time}`), K.push(`Project: ${_.project_path}`), K.push(`Duration: ${_.duration_minutes} min`), K.push("");
    for (let z of q.messages)
        if (z.type === "user" && z.message) {
            let Y = z.message.content;
            if (typeof Y === "string") K.push(`[User]: ${Y.slice(0,500)}`);
            else if (Array.isArray(Y)) {
                for (let A of Y)
                    if (A.type === "text" && "text" in A) K.push(`[User]: ${A.text.slice(0,500)}`)
            }
        } else if (z.type === "assistant" && z.message) {
        let Y = z.message.content;
        if (Array.isArray(Y)) {
            for (let A of Y)
                if (A.type === "text" && "text" in A) K.push(`[Assistant]: ${A.text.slice(0,300)}`);
                else if (A.type === "tool_use" && "name" in A) K.push(`[Tool: ${A.name}]`)
        }
    }
    return K.join(`
`)
}
// @from(Ln 492897, Col 0)
async function EsY(q) {
    try {
        let K = await ob6({
            systemPrompt: sK([]),
            userPrompt: NsY + q,
            signal: new AbortController().signal,
            options: {
                model: ttK(),
                querySource: "insights",
                agents: [],
                isNonInteractiveSession: !0,
                hasAppendSystemPrompt: !1,
                mcpTools: [],
                maxOutputTokensOverride: 500
            }
        });
        return s5(K.message.content) || q.slice(0, 2000)
    } catch {
        return q.slice(0, 2000)
    }
}
// @from(Ln 492918, Col 0)
async function ysY(q) {
    let K = ksY(q);
    if (K.length <= 30000) return K;
    let _ = 25000,
        z = [];
    for (let w = 0; w < K.length; w += _) z.push(K.slice(w, w + _));
    let Y = await Promise.all(z.map(EsY)),
        A = JH7(q);
    return [`Session: ${A.session_id.slice(0,8)}`, `Date: ${A.start_time}`, `Project: ${A.project_path}`, `Duration: ${A.duration_minutes} min`, `[Long session - ${z.length} parts summarized]`, ""].join(`
`) + Y.join(`

---

`)
}
// @from(Ln 492933, Col 0)
async function LsY(q) {
    let K = W66(go8(), `${q}.json`);
    try {
        let _ = await stK(K, {
                encoding: "utf-8"
            }),
            z = n8(_);
        if (!_eK(z)) {
            try {
                await MsY(K)
            } catch {}
            return null
        }
        return z
    } catch {
        return null
    }
}
// @from(Ln 492951, Col 0)
async function hsY(q) {
    try {
        await jH7(go8(), {
            recursive: !0
        })
    } catch {}
    let K = W66(go8(), `${q.session_id}.json`);
    await HH7(K, I6(q, null, 2), {
        encoding: "utf-8",
        mode: 384
    })
}
// @from(Ln 492963, Col 0)
async function RsY(q) {
    let K = W66($H7(), `${q}.json`);
    try {
        let _ = await stK(K, {
            encoding: "utf-8"
        });
        return n8(_)
    } catch {
        return null
    }
}
// @from(Ln 492974, Col 0)
async function SsY(q) {
    await jH7($H7(), {
        recursive: !0
    });
    let K = W66($H7(), `${q.session_id}.json`);
    await HH7(K, I6(q, null, 2), {
        encoding: "utf-8",
        mode: 384
    })
}
// @from(Ln 492984, Col 0)
async function CsY(q, K) {
    try {
        let _ = await ysY(q),
            z = `${fsY}${_}

RESPOND WITH ONLY A VALID JSON OBJECT matching this schema:
{
  "underlying_goal": "What the user fundamentally wanted to achieve",
  "goal_categories": {"category_name": count, ...},
  "outcome": "fully_achieved|mostly_achieved|partially_achieved|not_achieved|unclear_from_transcript",
  "user_satisfaction_counts": {"level": count, ...},
  "claude_helpfulness": "unhelpful|slightly_helpful|moderately_helpful|very_helpful|essential",
  "session_type": "single_task|multi_task|iterative_refinement|exploration|quick_question",
  "friction_counts": {"friction_type": count, ...},
  "friction_detail": "One sentence describing friction or empty",
  "primary_success": "none|fast_accurate_search|correct_code_edits|good_explanations|proactive_help|multi_file_changes|good_debugging",
  "brief_summary": "One sentence: what user wanted and whether they got it"
}`,
            Y = await ob6({
                systemPrompt: sK([]),
                userPrompt: z,
                signal: new AbortController().signal,
                options: {
                    model: ttK(),
                    querySource: "insights",
                    agents: [],
                    isNonInteractiveSession: !0,
                    hasAppendSystemPrompt: !1,
                    mcpTools: [],
                    maxOutputTokensOverride: 4096
                }
            }),
            O = s5(Y.message.content).match(/\{[\s\S]*\}/);
        if (!O) return null;
        let w = n8(O[0]);
        if (!_eK(w)) return null;
        return {
            ...w,
            session_id: K
        }
    } catch (_) {
        return j6(Error(`Facet extraction failed: ${r1(_).message}`)), null
    }
}
// @from(Ln 493029, Col 0)
function etK(q) {
    let _ = [];
    for (let $ of q)
        for (let j of $.user_message_timestamps) try {
            let H = new Date(j).getTime();
            _.push({
                ts: H,
                sessionId: $.session_id
            })
        } catch {}
    _.sort(($, j) => $.ts - j.ts);
    let z = new Set,
        Y = new Set,
        A = 0,
        O = new Map;
    for (let $ = 0; $ < _.length; $++) {
        let j = _[$];
        while (A < $ && j.ts - _[A].ts > 1800000) {
            let J = _[A];
            if (O.get(J.sessionId) === A) O.delete(J.sessionId);
            A++
        }
        let H = O.get(j.sessionId);
        if (H !== void 0)
            for (let J = H + 1; J < $; J++) {
                let X = _[J];
                if (X.sessionId !== j.sessionId) {
                    let M = [j.sessionId, X.sessionId].sort().join(":");
                    z.add(M), Y.add(`${_[H].ts}:${j.sessionId}`), Y.add(`${X.ts}:${X.sessionId}`), Y.add(`${j.ts}:${j.sessionId}`);
                    break
                }
            }
        O.set(j.sessionId, $)
    }
    let w = new Set;
    for (let $ of z) {
        let [j, H] = $.split(":");
        if (j) w.add(j);
        if (H) w.add(H)
    }
    return {
        overlap_events: z.size,
        sessions_involved: w.size,
        user_messages_during: Y.size
    }
}
// @from(Ln 493076, Col 0)
function bsY(q, K) {
    let _ = {
            total_sessions: q.length,
            sessions_with_facets: K.size,
            date_range: {
                start: "",
                end: ""
            },
            total_messages: 0,
            total_duration_hours: 0,
            total_input_tokens: 0,
            total_output_tokens: 0,
            tool_counts: {},
            languages: {},
            git_commits: 0,
            git_pushes: 0,
            projects: {},
            goal_categories: {},
            outcomes: {},
            satisfaction: {},
            helpfulness: {},
            session_types: {},
            friction: {},
            success: {},
            session_summaries: [],
            total_interruptions: 0,
            total_tool_errors: 0,
            tool_error_categories: {},
            user_response_times: [],
            median_response_time: 0,
            avg_response_time: 0,
            sessions_using_task_agent: 0,
            sessions_using_mcp: 0,
            sessions_using_web_search: 0,
            sessions_using_web_fetch: 0,
            total_lines_added: 0,
            total_lines_removed: 0,
            total_files_modified: 0,
            days_active: 0,
            messages_per_day: 0,
            message_hours: [],
            multi_clauding: {
                overlap_events: 0,
                sessions_involved: 0,
                user_messages_during: 0
            }
        },
        z = [],
        Y = [],
        A = [];
    for (let w of q) {
        z.push(w.start_time), _.total_messages += w.user_message_count, _.total_duration_hours += w.duration_minutes / 60, _.total_input_tokens += w.input_tokens, _.total_output_tokens += w.output_tokens, _.git_commits += w.git_commits, _.git_pushes += w.git_pushes, _.total_interruptions += w.user_interruptions, _.total_tool_errors += w.tool_errors;
        for (let [j, H] of Object.entries(w.tool_error_categories)) _.tool_error_categories[j] = (_.tool_error_categories[j] || 0) + H;
        if (Y.push(...w.user_response_times), w.uses_task_agent) _.sessions_using_task_agent++;
        if (w.uses_mcp) _.sessions_using_mcp++;
        if (w.uses_web_search) _.sessions_using_web_search++;
        if (w.uses_web_fetch) _.sessions_using_web_fetch++;
        _.total_lines_added += w.lines_added, _.total_lines_removed += w.lines_removed, _.total_files_modified += w.files_modified, A.push(...w.message_hours);
        for (let [j, H] of Object.entries(w.tool_counts)) _.tool_counts[j] = (_.tool_counts[j] || 0) + H;
        for (let [j, H] of Object.entries(w.languages)) _.languages[j] = (_.languages[j] || 0) + H;
        if (w.project_path) _.projects[w.project_path] = (_.projects[w.project_path] || 0) + 1;
        let $ = K.get(w.session_id);
        if ($) {
            for (let [j, H] of Eu6($.goal_categories))
                if (H > 0) _.goal_categories[j] = (_.goal_categories[j] || 0) + H;
            _.outcomes[$.outcome] = (_.outcomes[$.outcome] || 0) + 1;
            for (let [j, H] of Eu6($.user_satisfaction_counts))
                if (H > 0) _.satisfaction[j] = (_.satisfaction[j] || 0) + H;
            _.helpfulness[$.claude_helpfulness] = (_.helpfulness[$.claude_helpfulness] || 0) + 1, _.session_types[$.session_type] = (_.session_types[$.session_type] || 0) + 1;
            for (let [j, H] of Eu6($.friction_counts))
                if (H > 0) _.friction[j] = (_.friction[j] || 0) + H;
            if ($.primary_success !== "none") _.success[$.primary_success] = (_.success[$.primary_success] || 0) + 1
        }
        if (_.session_summaries.length < 50) _.session_summaries.push({
            id: w.session_id.slice(0, 8),
            date: i5(w.start_time, "T"),
            summary: w.summary || w.first_prompt.slice(0, 100),
            goal: $?.underlying_goal
        })
    }
    if (z.sort(), _.date_range.start = i5(z[0] ?? "", "T"), _.date_range.end = i5(z.at(-1) ?? "", "T"), _.user_response_times = Y, Y.length > 0) {
        let w = [...Y].sort(($, j) => $ - j);
        _.median_response_time = w[Math.floor(w.length / 2)] || 0, _.avg_response_time = Y.reduce(($, j) => $ + j, 0) / Y.length
    }
    let O = new Set(z.map((w) => i5(w, "T")));
    return _.days_active = O.size, _.messages_per_day = _.days_active > 0 ? Math.round(_.total_messages / _.days_active * 10) / 10 : 0, _.message_hours = A, _.multi_clauding = etK(q), _
}
// @from(Ln 493163, Col 0)
async function atK(q, K) {
    try {
        let _ = await ob6({
                systemPrompt: sK([]),
                userPrompt: q.prompt + `

DATA:
` + K,
                signal: new AbortController().signal,
                options: {
                    model: WsY(),
                    querySource: "insights",
                    agents: [],
                    isNonInteractiveSession: !0,
                    hasAppendSystemPrompt: !1,
                    mcpTools: [],
                    maxOutputTokensOverride: q.maxTokens
                }
            }),
            z = s5(_.message.content);
        if (z) {
            let Y = z.match(/\{[\s\S]*\}/);
            if (Y) try {
                return {
                    name: q.name,
                    result: n8(Y[0])
                }
            } catch {
                return {
                    name: q.name,
                    result: null
                }
            }
        }
        return {
            name: q.name,
            result: null
        }
    } catch (_) {
        return j6(Error(`${q.name} failed: ${r1(_).message}`)), {
            name: q.name,
            result: null
        }
    }
}
// @from(Ln 493208, Col 0)
async function xsY(q, K) {
    let _ = Array.from(K.values()).slice(0, 50).map((G) => `- ${G.brief_summary} (${G.outcome}, ${G.claude_helpfulness})`).join(`
`),
        z = Array.from(K.values()).filter((G) => G.friction_detail).slice(0, 20).map((G) => `- ${G.friction_detail}`).join(`
`),
        Y = Array.from(K.values()).flatMap((G) => G.user_instructions_to_claude || []).slice(0, 15).map((G) => `- ${G}`).join(`
`),
        O = I6({
            sessions: q.total_sessions,
            analyzed: q.sessions_with_facets,
            date_range: q.date_range,
            messages: q.total_messages,
            hours: Math.round(q.total_duration_hours),
            commits: q.git_commits,
            top_tools: Object.entries(q.tool_counts).sort((G, f) => f[1] - G[1]).slice(0, 8),
            top_goals: Object.entries(q.goal_categories).sort((G, f) => f[1] - G[1]).slice(0, 8),
            outcomes: q.outcomes,
            satisfaction: q.satisfaction,
            friction: q.friction,
            success: q.success,
            languages: q.languages
        }, null, 2) + `

SESSION SUMMARIES:
` + _ + `

FRICTION DETAILS:
` + z + `

USER INSTRUCTIONS TO CLAUDE:
` + (Y || "None captured"),
        w = await Promise.all(IsY.map((G) => atK(G, O))),
        $ = {};
    for (let {
            name: G,
            result: f
        }
        of w)
        if (f) $[G] = f;
    let j = $.project_areas?.areas?.map((G) => `- ${G.name}: ${G.description}`).join(`
`) || "",
        H = $.what_works?.impressive_workflows?.map((G) => `- ${G.title}: ${G.description}`).join(`
`) || "",
        J = $.friction_analysis?.categories?.map((G) => `- ${G.category}: ${G.description}`).join(`
`) || "",
        X = $.suggestions?.features_to_try?.map((G) => `- ${G.feature}: ${G.one_liner}`).join(`
`) || "",
        M = $.suggestions?.usage_patterns?.map((G) => `- ${G.title}: ${G.suggestion}`).join(`
`) || "",
        P = $.on_the_horizon?.opportunities?.map((G) => `- ${G.title}: ${G.whats_possible}`).join(`
`) || "",
        D = {
            name: "at_a_glance",
            prompt: `You're writing an "At a Glance" summary for a Claude Code usage insights report for Claude Code users. The goal is to help them understand their usage and improve how they can use Claude better, especially as models improve.

Use this 4-part structure:

1. **What's working** - What is the user's unique style of interacting with Claude and what are some impactful things they've done? You can include one or two details, but keep it high level since things might not be fresh in the user's memory. Don't be fluffy or overly complimentary. Also, don't focus on the tool calls they use.

2. **What's hindering you** - Split into (a) Claude's fault (misunderstandings, wrong approaches, bugs) and (b) user-side friction (not providing enough context, environment issues -- ideally more general than just one project). Be honest but constructive.

3. **Quick wins to try** - Specific Claude Code features they could try from the examples below, or a workflow technique if you think it's really compelling. (Avoid stuff like "Ask Claude to confirm before taking actions" or "Type out more context up front" which are less compelling.)

4. **Ambitious workflows for better models** - As we move to much more capable models over the next 3-6 months, what should they prepare for? What workflows that seem impossible now will become possible? Draw from the appropriate section below.

Keep each section to 2-3 not-too-long sentences. Don't overwhelm the user. Don't mention specific numerical stats or underlined_categories from the session data below. Use a coaching tone.

RESPOND WITH ONLY A VALID JSON OBJECT:
{
  "whats_working": "(refer to instructions above)",
  "whats_hindering": "(refer to instructions above)",
  "quick_wins": "(refer to instructions above)",
  "ambitious_workflows": "(refer to instructions above)"
}

SESSION DATA:
${O}

## Project Areas (what user works on)
${j}

## Big Wins (impressive accomplishments)
${H}

## Friction Categories (where things go wrong)
${J}

## Features to Try
${X}

## Usage Patterns to Adopt
${M}

## On the Horizon (ambitious workflows for better models)
${P}`,
            maxTokens: 8192
        },
        Z = await atK(D, "");
    if (Z.result) $.at_a_glance = Z.result;
    return $
}
// @from(Ln 493310, Col 0)
function po8(q) {
    return O_(q).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
}
// @from(Ln 493314, Col 0)
function P66(q, K, _ = 6, z) {
    let Y;
    if (z) Y = z.filter((O) => (O in q) && (q[O] ?? 0) > 0).map((O) => [O, q[O] ?? 0]);
    else Y = Object.entries(q).sort((O, w) => w[1] - O[1]).slice(0, _);
    if (Y.length === 0) return '<p class="empty">No data</p>';
    let A = Math.max(...Y.map((O) => O[1]));
    return Y.map(([O, w]) => {
        let $ = w / A * 100,
            j = ZsY[O] || O.replaceAll("_", " ").replace(/\b\w/g, (H) => H.toUpperCase());
        return `<div class="bar-row">
        <div class="bar-label">${O_(j)}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${$}%;background:${K}"></div></div>
        <div class="bar-value">${w}</div>
      </div>`
    }).join(`
`)
}
// @from(Ln 493332, Col 0)
function BsY(q) {
    if (q.length === 0) return '<p class="empty">No response time data</p>';
    let K = {
        "2-10s": 0,
        "10-30s": 0,
        "30s-1m": 0,
        "1-2m": 0,
        "2-5m": 0,
        "5-15m": 0,
        ">15m": 0
    };
    for (let z of q)
        if (z < 10) K["2-10s"] = (K["2-10s"] ?? 0) + 1;
        else if (z < 30) K["10-30s"] = (K["10-30s"] ?? 0) + 1;
    else if (z < 60) K["30s-1m"] = (K["30s-1m"] ?? 0) + 1;
    else if (z < 120) K["1-2m"] = (K["1-2m"] ?? 0) + 1;
    else if (z < 300) K["2-5m"] = (K["2-5m"] ?? 0) + 1;
    else if (z < 900) K["5-15m"] = (K["5-15m"] ?? 0) + 1;
    else K[">15m"] = (K[">15m"] ?? 0) + 1;
    let _ = Math.max(...Object.values(K));
    if (_ === 0) return '<p class="empty">No response time data</p>';
    return Object.entries(K).map(([z, Y]) => {
        let A = Y / _ * 100;
        return `<div class="bar-row">
        <div class="bar-label">${z}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${A}%;background:#6366f1"></div></div>
        <div class="bar-value">${Y}</div>
      </div>`
    }).join(`
`)
}
// @from(Ln 493364, Col 0)
function psY(q) {
    if (q.length === 0) return '<p class="empty">No time data</p>';
    let K = [{
            label: "Morning (6-12)",
            range: [6, 7, 8, 9, 10, 11]
        }, {
            label: "Afternoon (12-18)",
            range: [12, 13, 14, 15, 16, 17]
        }, {
            label: "Evening (18-24)",
            range: [18, 19, 20, 21, 22, 23]
        }, {
            label: "Night (0-6)",
            range: [0, 1, 2, 3, 4, 5]
        }],
        _ = {};
    for (let O of q) _[O] = (_[O] || 0) + 1;
    let z = K.map((O) => ({
            label: O.label,
            count: O.range.reduce((w, $) => w + (_[$] || 0), 0)
        })),
        Y = Math.max(...z.map((O) => O.count)) || 1;
    return `<div id="hour-histogram">${z.map((O)=>`
      <div class="bar-row">
        <div class="bar-label">${O.label}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${O.count/Y*100}%;background:#8b5cf6"></div></div>
        <div class="bar-value">${O.count}</div>
      </div>`).join(`
`)}</div>`
}
// @from(Ln 493395, Col 0)
function FsY(q) {
    let K = {};
    for (let _ of q) K[_] = (K[_] || 0) + 1;
    return I6(K)
}
// @from(Ln 493401, Col 0)
function gsY(q, K) {
    let _ = (h) => {
            if (!h) return "";
            return h.split(`

`).map((C) => {
                let x = O_(C);
                return x = x.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"), x = x.replace(/^- /gm, "• "), x = x.replaceAll(`
`, "<br>"), `<p>${x}</p>`
            }).join(`
`)
        },
        z = K.at_a_glance,
        Y = z ? `
    <div class="at-a-glance">
      <div class="glance-title">At a Glance</div>
      <div class="glance-sections">
        ${z.whats_working?`<div class="glance-section"><strong>What's working:</strong> ${po8(z.whats_working)} <a href="#section-wins" class="see-more">Impressive Things You Did →</a></div>`:""}
        ${z.whats_hindering?`<div class="glance-section"><strong>What's hindering you:</strong> ${po8(z.whats_hindering)} <a href="#section-friction" class="see-more">Where Things Go Wrong →</a></div>`:""}
        ${z.quick_wins?`<div class="glance-section"><strong>Quick wins to try:</strong> ${po8(z.quick_wins)} <a href="#section-features" class="see-more">Features to Try →</a></div>`:""}
        ${z.ambitious_workflows?`<div class="glance-section"><strong>Ambitious workflows:</strong> ${po8(z.ambitious_workflows)} <a href="#section-horizon" class="see-more">On the Horizon →</a></div>`:""}
      </div>
    </div>
    ` : "",
        A = K.project_areas?.areas || [],
        O = A.length > 0 ? `
    <h2 id="section-work">What You Work On</h2>
    <div class="project-areas">
      ${A.map((h)=>`
        <div class="project-area">
          <div class="area-header">
            <span class="area-name">${O_(h.name)}</span>
            <span class="area-count">~${h.session_count} sessions</span>
          </div>
          <div class="area-desc">${O_(h.description)}</div>
        </div>
      `).join("")}
    </div>
    ` : "",
        w = K.interaction_style,
        $ = w?.narrative ? `
    <h2 id="section-usage">How You Use Claude Code</h2>
    <div class="narrative">
      ${_(w.narrative)}
      ${w.key_pattern?`<div class="key-insight"><strong>Key pattern:</strong> ${O_(w.key_pattern)}</div>`:""}
    </div>
    ` : "",
        j = K.what_works,
        H = j?.impressive_workflows && j.impressive_workflows.length > 0 ? `
    <h2 id="section-wins">Impressive Things You Did</h2>
    ${j.intro?`<p class="section-intro">${O_(j.intro)}</p>`:""}
    <div class="big-wins">
      ${j.impressive_workflows.map((h)=>`
        <div class="big-win">
          <div class="big-win-title">${O_(h.title||"")}</div>
          <div class="big-win-desc">${O_(h.description||"")}</div>
        </div>
      `).join("")}
    </div>
    ` : "",
        J = K.friction_analysis,
        X = J?.categories && J.categories.length > 0 ? `
    <h2 id="section-friction">Where Things Go Wrong</h2>
    ${J.intro?`<p class="section-intro">${O_(J.intro)}</p>`:""}
    <div class="friction-categories">
      ${J.categories.map((h)=>`
        <div class="friction-category">
          <div class="friction-title">${O_(h.category||"")}</div>
          <div class="friction-desc">${O_(h.description||"")}</div>
          ${h.examples?`<ul class="friction-examples">${h.examples.map((C)=>`<li>${O_(C)}</li>`).join("")}</ul>`:""}
        </div>
      `).join("")}
    </div>
    ` : "",
        M = K.suggestions,
        P = M ? `
    ${M.claude_md_additions&&M.claude_md_additions.length>0?`
    <h2 id="section-features">Existing CC Features to Try</h2>
    <div class="claude-md-section">
      <h3>Suggested CLAUDE.md Additions</h3>
      <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Just copy this into Claude Code to add it to your CLAUDE.md.</p>
      <div class="claude-md-actions">
        <button class="copy-all-btn" onclick="copyAllCheckedClaudeMd()">Copy All Checked</button>
      </div>
      ${M.claude_md_additions.map((h,C)=>`
        <div class="claude-md-item">
          <input type="checkbox" id="cmd-${C}" class="cmd-checkbox" checked data-text="${O_(h.prompt_scaffold||h.where||"Add to CLAUDE.md")}\\n\\n${O_(h.addition)}">
          <label for="cmd-${C}">
            <code class="cmd-code">${O_(h.addition)}</code>
            <button class="copy-btn" onclick="copyCmdItem(${C})">Copy</button>
          </label>
          <div class="cmd-why">${O_(h.why)}</div>
        </div>
      `).join("")}
    </div>
    `:""}
    ${M.features_to_try&&M.features_to_try.length>0?`
    <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Just copy this into Claude Code and it'll set it up for you.</p>
    <div class="features-section">
      ${M.features_to_try.map((h)=>`
        <div class="feature-card">
          <div class="feature-title">${O_(h.feature||"")}</div>
          <div class="feature-oneliner">${O_(h.one_liner||"")}</div>
          <div class="feature-why"><strong>Why for you:</strong> ${O_(h.why_for_you||"")}</div>
          ${h.example_code?`
          <div class="feature-examples">
            <div class="feature-example">
              <div class="example-code-row">
                <code class="example-code">${O_(h.example_code)}</code>
                <button class="copy-btn" onclick="copyText(this)">Copy</button>
              </div>
            </div>
          </div>
          `:""}
        </div>
      `).join("")}
    </div>
    `:""}
    ${M.usage_patterns&&M.usage_patterns.length>0?`
    <h2 id="section-patterns">New Ways to Use Claude Code</h2>
    <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Just copy this into Claude Code and it'll walk you through it.</p>
    <div class="patterns-section">
      ${M.usage_patterns.map((h)=>`
        <div class="pattern-card">
          <div class="pattern-title">${O_(h.title||"")}</div>
          <div class="pattern-summary">${O_(h.suggestion||"")}</div>
          ${h.detail?`<div class="pattern-detail">${O_(h.detail)}</div>`:""}
          ${h.copyable_prompt?`
          <div class="copyable-prompt-section">
            <div class="prompt-label">Paste into Claude Code:</div>
            <div class="copyable-prompt-row">
              <code class="copyable-prompt">${O_(h.copyable_prompt)}</code>
              <button class="copy-btn" onclick="copyText(this)">Copy</button>
            </div>
          </div>
          `:""}
        </div>
      `).join("")}
    </div>
    `:""}
    ` : "",
        W = K.on_the_horizon,
        D = W?.opportunities && W.opportunities.length > 0 ? `
    <h2 id="section-horizon">On the Horizon</h2>
    ${W.intro?`<p class="section-intro">${O_(W.intro)}</p>`:""}
    <div class="horizon-section">
      ${W.opportunities.map((h)=>`
        <div class="horizon-card">
          <div class="horizon-title">${O_(h.title||"")}</div>
          <div class="horizon-possible">${O_(h.whats_possible||"")}</div>
          ${h.how_to_try?`<div class="horizon-tip"><strong>Getting started:</strong> ${O_(h.how_to_try)}</div>`:""}
          ${h.copyable_prompt?`<div class="pattern-prompt"><div class="prompt-label">Paste into Claude Code:</div><code>${O_(h.copyable_prompt)}</code><button class="copy-btn" onclick="copyText(this)">Copy</button></div>`:""}
        </div>
      `).join("")}
    </div>
    ` : "",
        Z = [],
        G = [],
        f = Z.length > 0 || G.length > 0 ? `
    <h2 id="section-feedback" class="feedback-header">Closing the Loop: Feedback for Other Teams</h2>
    <p class="feedback-intro">Suggestions for the CC product and model teams based on your usage patterns. Click to expand.</p>
    ${Z.length>0?`
    <div class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapsible(this)">
        <span class="collapsible-arrow">▶</span>
        <h3>Product Improvements for CC Team</h3>
      </div>
      <div class="collapsible-content">
        <div class="suggestions-section">
          ${Z.map((h)=>`
            <div class="feedback-card team-card">
              <div class="feedback-title">${O_(h.title||"")}</div>
              <div class="feedback-detail">${O_(h.detail||"")}</div>
              ${h.evidence?`<div class="feedback-evidence"><em>Evidence:</em> ${O_(h.evidence)}</div>`:""}
            </div>
          `).join("")}
        </div>
      </div>
    </div>
    `:""}
    ${G.length>0?`
    <div class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapsible(this)">
        <span class="collapsible-arrow">▶</span>
        <h3>Model Behavior Improvements</h3>
      </div>
      <div class="collapsible-content">
        <div class="suggestions-section">
          ${G.map((h)=>`
            <div class="feedback-card model-card">
              <div class="feedback-title">${O_(h.title||"")}</div>
              <div class="feedback-detail">${O_(h.detail||"")}</div>
              ${h.evidence?`<div class="feedback-evidence"><em>Evidence:</em> ${O_(h.evidence)}</div>`:""}
            </div>
          `).join("")}
        </div>
      </div>
    </div>
    `:""}
    ` : "",
        v = K.fun_ending,
        V = v?.headline ? `
    <div class="fun-ending">
      <div class="fun-headline">"${O_(v.headline)}"</div>
      ${v.detail?`<div class="fun-detail">${O_(v.detail)}</div>`:""}
    </div>
    ` : "",
        k = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #f8fafc; color: #334155; line-height: 1.65; padding: 48px 24px; }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    h2 { font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 48px; margin-bottom: 16px; }
    .subtitle { color: #64748b; font-size: 15px; margin-bottom: 32px; }
    .nav-toc { display: flex; flex-wrap: wrap; gap: 8px; margin: 24px 0 32px 0; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e2e8f0; }
    .nav-toc a { font-size: 12px; color: #64748b; text-decoration: none; padding: 6px 12px; border-radius: 6px; background: #f1f5f9; transition: all 0.15s; }
    .nav-toc a:hover { background: #e2e8f0; color: #334155; }
    .stats-row { display: flex; gap: 24px; margin-bottom: 40px; padding: 20px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-value { font-size: 24px; font-weight: 700; color: #0f172a; }
    .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
    .at-a-glance { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #f59e0b; border-radius: 12px; padding: 20px 24px; margin-bottom: 32px; }
    .glance-title { font-size: 16px; font-weight: 700; color: #92400e; margin-bottom: 16px; }
    .glance-sections { display: flex; flex-direction: column; gap: 12px; }
    .glance-section { font-size: 14px; color: #78350f; line-height: 1.6; }
    .glance-section strong { color: #92400e; }
    .see-more { color: #b45309; text-decoration: none; font-size: 13px; white-space: nowrap; }
    .see-more:hover { text-decoration: underline; }
    .project-areas { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
    .project-area { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .area-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .area-name { font-weight: 600; font-size: 15px; color: #0f172a; }
    .area-count { font-size: 12px; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; }
    .area-desc { font-size: 14px; color: #475569; line-height: 1.5; }
    .narrative { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .narrative p { margin-bottom: 12px; font-size: 14px; color: #475569; line-height: 1.7; }
    .key-insight { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-top: 12px; font-size: 14px; color: #166534; }
    .section-intro { font-size: 14px; color: #64748b; margin-bottom: 16px; }
    .big-wins { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
    .big-win { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; }
    .big-win-title { font-weight: 600; font-size: 15px; color: #166534; margin-bottom: 8px; }
    .big-win-desc { font-size: 14px; color: #15803d; line-height: 1.5; }
    .friction-categories { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
    .friction-category { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; }
    .friction-title { font-weight: 600; font-size: 15px; color: #991b1b; margin-bottom: 6px; }
    .friction-desc { font-size: 13px; color: #7f1d1d; margin-bottom: 10px; }
    .friction-examples { margin: 0 0 0 20px; font-size: 13px; color: #334155; }
    .friction-examples li { margin-bottom: 4px; }
    .claude-md-section { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .claude-md-section h3 { font-size: 14px; font-weight: 600; color: #1e40af; margin: 0 0 12px 0; }
    .claude-md-actions { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #dbeafe; }
    .copy-all-btn { background: #2563eb; color: white; border: none; border-radius: 4px; padding: 6px 12px; font-size: 12px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .copy-all-btn:hover { background: #1d4ed8; }
    .copy-all-btn.copied { background: #16a34a; }
    .claude-md-item { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 8px; padding: 10px 0; border-bottom: 1px solid #dbeafe; }
    .claude-md-item:last-child { border-bottom: none; }
    .cmd-checkbox { margin-top: 2px; }
    .cmd-code { background: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; color: #1e40af; border: 1px solid #bfdbfe; font-family: monospace; display: block; white-space: pre-wrap; word-break: break-word; flex: 1; }
    .cmd-why { font-size: 12px; color: #64748b; width: 100%; padding-left: 24px; margin-top: 4px; }
    .features-section, .patterns-section { display: flex; flex-direction: column; gap: 12px; margin: 16px 0; }
    .feature-card { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; }
    .pattern-card { background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 16px; }
    .feature-title, .pattern-title { font-weight: 600; font-size: 15px; color: #0f172a; margin-bottom: 6px; }
    .feature-oneliner { font-size: 14px; color: #475569; margin-bottom: 8px; }
    .pattern-summary { font-size: 14px; color: #475569; margin-bottom: 8px; }
    .feature-why, .pattern-detail { font-size: 13px; color: #334155; line-height: 1.5; }
    .feature-examples { margin-top: 12px; }
    .feature-example { padding: 8px 0; border-top: 1px solid #d1fae5; }
    .feature-example:first-child { border-top: none; }
    .example-desc { font-size: 13px; color: #334155; margin-bottom: 6px; }
    .example-code-row { display: flex; align-items: flex-start; gap: 8px; }
    .example-code { flex: 1; background: #f1f5f9; padding: 8px 12px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #334155; overflow-x: auto; white-space: pre-wrap; }
    .copyable-prompt-section { margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0; }
    .copyable-prompt-row { display: flex; align-items: flex-start; gap: 8px; }
    .copyable-prompt { flex: 1; background: #f8fafc; padding: 10px 12px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #334155; border: 1px solid #e2e8f0; white-space: pre-wrap; line-height: 1.5; }
    .feature-code { background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 12px; border: 1px solid #e2e8f0; display: flex; align-items: flex-start; gap: 8px; }
    .feature-code code { flex: 1; font-family: monospace; font-size: 12px; color: #334155; white-space: pre-wrap; }
    .pattern-prompt { background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 12px; border: 1px solid #e2e8f0; }
    .pattern-prompt code { font-family: monospace; font-size: 12px; color: #334155; display: block; white-space: pre-wrap; margin-bottom: 8px; }
    .prompt-label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
    .copy-btn { background: #e2e8f0; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; color: #475569; flex-shrink: 0; }
    .copy-btn:hover { background: #cbd5e1; }
    .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; }
    .chart-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .chart-title { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 12px; }
    .bar-row { display: flex; align-items: center; margin-bottom: 6px; }
    .bar-label { width: 100px; font-size: 11px; color: #475569; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bar-track { flex: 1; height: 6px; background: #f1f5f9; border-radius: 3px; margin: 0 8px; }
    .bar-fill { height: 100%; border-radius: 3px; }
    .bar-value { width: 28px; font-size: 11px; font-weight: 500; color: #64748b; text-align: right; }
    .empty { color: #94a3b8; font-size: 13px; }
    .horizon-section { display: flex; flex-direction: column; gap: 16px; }
    .horizon-card { background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%); border: 1px solid #c4b5fd; border-radius: 8px; padding: 16px; }
    .horizon-title { font-weight: 600; font-size: 15px; color: #5b21b6; margin-bottom: 8px; }
    .horizon-possible { font-size: 14px; color: #334155; margin-bottom: 10px; line-height: 1.5; }
    .horizon-tip { font-size: 13px; color: #6b21a8; background: rgba(255,255,255,0.6); padding: 8px 12px; border-radius: 4px; }
    .feedback-header { margin-top: 48px; color: #64748b; font-size: 16px; }
    .feedback-intro { font-size: 13px; color: #94a3b8; margin-bottom: 16px; }
    .feedback-section { margin-top: 16px; }
    .feedback-section h3 { font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 12px; }
    .feedback-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
    .feedback-card.team-card { background: #eff6ff; border-color: #bfdbfe; }
    .feedback-card.model-card { background: #faf5ff; border-color: #e9d5ff; }
    .feedback-title { font-weight: 600; font-size: 14px; color: #0f172a; margin-bottom: 6px; }
    .feedback-detail { font-size: 13px; color: #475569; line-height: 1.5; }
    .feedback-evidence { font-size: 12px; color: #64748b; margin-top: 8px; }
    .fun-ending { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #fbbf24; border-radius: 12px; padding: 24px; margin-top: 40px; text-align: center; }
    .fun-headline { font-size: 18px; font-weight: 600; color: #78350f; margin-bottom: 8px; }
    .fun-detail { font-size: 14px; color: #92400e; }
    .collapsible-section { margin-top: 16px; }
    .collapsible-header { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .collapsible-header h3 { margin: 0; font-size: 14px; font-weight: 600; color: #475569; }
    .collapsible-arrow { font-size: 12px; color: #94a3b8; transition: transform 0.2s; }
    .collapsible-content { display: none; padding-top: 16px; }
    .collapsible-content.open { display: block; }
    .collapsible-header.open .collapsible-arrow { transform: rotate(90deg); }
    @media (max-width: 640px) { .charts-row { grid-template-columns: 1fr; } .stats-row { justify-content: center; } }
  `,
        R = `
    function toggleCollapsible(header) {
      header.classList.toggle('open');
      const content = header.nextElementSibling;
      content.classList.toggle('open');
    }
    function copyText(btn) {
      const code = btn.previousElementSibling;
      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    }
    function copyCmdItem(idx) {
      const checkbox = document.getElementById('cmd-' + idx);
      if (checkbox) {
        const text = checkbox.dataset.text;
        navigator.clipboard.writeText(text).then(() => {
          const btn = checkbox.nextElementSibling.querySelector('.copy-btn');
          if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy'; }, 2000); }
        });
      }
    }
    function copyAllCheckedClaudeMd() {
      const checkboxes = document.querySelectorAll('.cmd-checkbox:checked');
      const texts = [];
      checkboxes.forEach(cb => {
        if (cb.dataset.text) { texts.push(cb.dataset.text); }
      });
      const combined = texts.join('\\n');
      const btn = document.querySelector('.copy-all-btn');
      if (btn) {
        navigator.clipboard.writeText(combined).then(() => {
          btn.textContent = 'Copied ' + texts.length + ' items!';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'Copy All Checked'; btn.classList.remove('copied'); }, 2000);
        });
      }
    }
    // Timezone selector for time of day chart (data is from our own analytics, not user input)
    const rawHourCounts = ${FsY(q.message_hours)};
    function updateHourHistogram(offsetFromPT) {
      const periods = [
        { label: "Morning (6-12)", range: [6,7,8,9,10,11] },
        { label: "Afternoon (12-18)", range: [12,13,14,15,16,17] },
        { label: "Evening (18-24)", range: [18,19,20,21,22,23] },
        { label: "Night (0-6)", range: [0,1,2,3,4,5] }
      ];
      const adjustedCounts = {};
      for (const [hour, count] of Object.entries(rawHourCounts)) {
        const newHour = (parseInt(hour) + offsetFromPT + 24) % 24;
        adjustedCounts[newHour] = (adjustedCounts[newHour] || 0) + count;
      }
      const periodCounts = periods.map(p => ({
        label: p.label,
        count: p.range.reduce((sum, h) => sum + (adjustedCounts[h] || 0), 0)
      }));
      const maxCount = Math.max(...periodCounts.map(p => p.count)) || 1;
      const container = document.getElementById('hour-histogram');
      container.textContent = '';
      periodCounts.forEach(p => {
        const row = document.createElement('div');
        row.className = 'bar-row';
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = p.label;
        const track = document.createElement('div');
        track.className = 'bar-track';
        const fill = document.createElement('div');
        fill.className = 'bar-fill';
        fill.style.width = (p.count / maxCount) * 100 + '%';
        fill.style.background = '#8b5cf6';
        track.appendChild(fill);
        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = p.count;
        row.appendChild(label);
        row.appendChild(track);
        row.appendChild(value);
        container.appendChild(row);
      });
    }
    document.getElementById('timezone-select').addEventListener('change', function() {
      const customInput = document.getElementById('custom-offset');
      if (this.value === 'custom') {
        customInput.style.display = 'inline-block';
        customInput.focus();
      } else {
        customInput.style.display = 'none';
        updateHourHistogram(parseInt(this.value));
      }
    });
    document.getElementById('custom-offset').addEventListener('change', function() {
      const parsed = parseInt(this.value, 10);
      if (isNaN(parsed)) return;
      updateHourHistogram(parsed + 8);
    });
  `;
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Claude Code Insights</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #f8fafc; color: #334155; line-height: 1.65; padding: 48px 24px; }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    h2 { font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 48px; margin-bottom: 16px; }
    .subtitle { color: #64748b; font-size: 15px; margin-bottom: 32px; }
    .nav-toc { display: flex; flex-wrap: wrap; gap: 8px; margin: 24px 0 32px 0; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e2e8f0; }
    .nav-toc a { font-size: 12px; color: #64748b; text-decoration: none; padding: 6px 12px; border-radius: 6px; background: #f1f5f9; transition: all 0.15s; }
    .nav-toc a:hover { background: #e2e8f0; color: #334155; }
    .stats-row { display: flex; gap: 24px; margin-bottom: 40px; padding: 20px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-value { font-size: 24px; font-weight: 700; color: #0f172a; }
    .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
    .at-a-glance { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #f59e0b; border-radius: 12px; padding: 20px 24px; margin-bottom: 32px; }
    .glance-title { font-size: 16px; font-weight: 700; color: #92400e; margin-bottom: 16px; }
    .glance-sections { display: flex; flex-direction: column; gap: 12px; }
    .glance-section { font-size: 14px; color: #78350f; line-height: 1.6; }
    .glance-section strong { color: #92400e; }
    .see-more { color: #b45309; text-decoration: none; font-size: 13px; white-space: nowrap; }
    .see-more:hover { text-decoration: underline; }
    .project-areas { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
    .project-area { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .area-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .area-name { font-weight: 600; font-size: 15px; color: #0f172a; }
    .area-count { font-size: 12px; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; }
    .area-desc { font-size: 14px; color: #475569; line-height: 1.5; }
    .narrative { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .narrative p { margin-bottom: 12px; font-size: 14px; color: #475569; line-height: 1.7; }
    .key-insight { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-top: 12px; font-size: 14px; color: #166534; }
    .section-intro { font-size: 14px; color: #64748b; margin-bottom: 16px; }
    .big-wins { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
    .big-win { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; }
    .big-win-title { font-weight: 600; font-size: 15px; color: #166534; margin-bottom: 8px; }
    .big-win-desc { font-size: 14px; color: #15803d; line-height: 1.5; }
    .friction-categories { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
    .friction-category { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; }
    .friction-title { font-weight: 600; font-size: 15px; color: #991b1b; margin-bottom: 6px; }
    .friction-desc { font-size: 13px; color: #7f1d1d; margin-bottom: 10px; }
    .friction-examples { margin: 0 0 0 20px; font-size: 13px; color: #334155; }
    .friction-examples li { margin-bottom: 4px; }
    .claude-md-section { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .claude-md-section h3 { font-size: 14px; font-weight: 600; color: #1e40af; margin: 0 0 12px 0; }
    .claude-md-actions { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #dbeafe; }
    .copy-all-btn { background: #2563eb; color: white; border: none; border-radius: 4px; padding: 6px 12px; font-size: 12px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .copy-all-btn:hover { background: #1d4ed8; }
    .copy-all-btn.copied { background: #16a34a; }
    .claude-md-item { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 8px; padding: 10px 0; border-bottom: 1px solid #dbeafe; }
    .claude-md-item:last-child { border-bottom: none; }
    .cmd-checkbox { margin-top: 2px; }
    .cmd-code { background: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; color: #1e40af; border: 1px solid #bfdbfe; font-family: monospace; display: block; white-space: pre-wrap; word-break: break-word; flex: 1; }
    .cmd-why { font-size: 12px; color: #64748b; width: 100%; padding-left: 24px; margin-top: 4px; }
    .features-section, .patterns-section { display: flex; flex-direction: column; gap: 12px; margin: 16px 0; }
    .feature-card { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; }
    .pattern-card { background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 16px; }
    .feature-title, .pattern-title { font-weight: 600; font-size: 15px; color: #0f172a; margin-bottom: 6px; }
    .feature-oneliner { font-size: 14px; color: #475569; margin-bottom: 8px; }
    .pattern-summary { font-size: 14px; color: #475569; margin-bottom: 8px; }
    .feature-why, .pattern-detail { font-size: 13px; color: #334155; line-height: 1.5; }
    .feature-examples { margin-top: 12px; }
    .feature-example { padding: 8px 0; border-top: 1px solid #d1fae5; }
    .feature-example:first-child { border-top: none; }
    .example-desc { font-size: 13px; color: #334155; margin-bottom: 6px; }
    .example-code-row { display: flex; align-items: flex-start; gap: 8px; }
    .example-code { flex: 1; background: #f1f5f9; padding: 8px 12px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #334155; overflow-x: auto; white-space: pre-wrap; }
    .copyable-prompt-section { margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0; }
    .copyable-prompt-row { display: flex; align-items: flex-start; gap: 8px; }
    .copyable-prompt { flex: 1; background: #f8fafc; padding: 10px 12px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #334155; border: 1px solid #e2e8f0; white-space: pre-wrap; line-height: 1.5; }
    .feature-code { background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 12px; border: 1px solid #e2e8f0; display: flex; align-items: flex-start; gap: 8px; }
    .feature-code code { flex: 1; font-family: monospace; font-size: 12px; color: #334155; white-space: pre-wrap; }
    .pattern-prompt { background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 12px; border: 1px solid #e2e8f0; }
    .pattern-prompt code { font-family: monospace; font-size: 12px; color: #334155; display: block; white-space: pre-wrap; margin-bottom: 8px; }
    .prompt-label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
    .copy-btn { background: #e2e8f0; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; color: #475569; flex-shrink: 0; }
    .copy-btn:hover { background: #cbd5e1; }
    .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; }
    .chart-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .chart-title { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 12px; }
    .bar-row { display: flex; align-items: center; margin-bottom: 6px; }
    .bar-label { width: 100px; font-size: 11px; color: #475569; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bar-track { flex: 1; height: 6px; background: #f1f5f9; border-radius: 3px; margin: 0 8px; }
    .bar-fill { height: 100%; border-radius: 3px; }
    .bar-value { width: 28px; font-size: 11px; font-weight: 500; color: #64748b; text-align: right; }
    .empty { color: #94a3b8; font-size: 13px; }
    .horizon-section { display: flex; flex-direction: column; gap: 16px; }
    .horizon-card { background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%); border: 1px solid #c4b5fd; border-radius: 8px; padding: 16px; }
    .horizon-title { font-weight: 600; font-size: 15px; color: #5b21b6; margin-bottom: 8px; }
    .horizon-possible { font-size: 14px; color: #334155; margin-bottom: 10px; line-height: 1.5; }
    .horizon-tip { font-size: 13px; color: #6b21a8; background: rgba(255,255,255,0.6); padding: 8px 12px; border-radius: 4px; }
    .feedback-header { margin-top: 48px; color: #64748b; font-size: 16px; }
    .feedback-intro { font-size: 13px; color: #94a3b8; margin-bottom: 16px; }
    .feedback-section { margin-top: 16px; }
    .feedback-section h3 { font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 12px; }
    .feedback-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
    .feedback-card.team-card { background: #eff6ff; border-color: #bfdbfe; }
    .feedback-card.model-card { background: #faf5ff; border-color: #e9d5ff; }
    .feedback-title { font-weight: 600; font-size: 14px; color: #0f172a; margin-bottom: 6px; }
    .feedback-detail { font-size: 13px; color: #475569; line-height: 1.5; }
    .feedback-evidence { font-size: 12px; color: #64748b; margin-top: 8px; }
    .fun-ending { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #fbbf24; border-radius: 12px; padding: 24px; margin-top: 40px; text-align: center; }
    .fun-headline { font-size: 18px; font-weight: 600; color: #78350f; margin-bottom: 8px; }
    .fun-detail { font-size: 14px; color: #92400e; }
    .collapsible-section { margin-top: 16px; }
    .collapsible-header { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .collapsible-header h3 { margin: 0; font-size: 14px; font-weight: 600; color: #475569; }
    .collapsible-arrow { font-size: 12px; color: #94a3b8; transition: transform 0.2s; }
    .collapsible-content { display: none; padding-top: 16px; }
    .collapsible-content.open { display: block; }
    .collapsible-header.open .collapsible-arrow { transform: rotate(90deg); }
    @media (max-width: 640px) { .charts-row { grid-template-columns: 1fr; } .stats-row { justify-content: center; } }
  </style>
</head>
<body>
  <div class="container">
    <h1>Claude Code Insights</h1>
    <p class="subtitle">${q.total_messages.toLocaleString()} messages across ${q.total_sessions} sessions${q.total_sessions_scanned&&q.total_sessions_scanned>q.total_sessions?` (${q.total_sessions_scanned.toLocaleString()} total)`:""} | ${q.date_range.start} to ${q.date_range.end}</p>

    ${Y}

    <nav class="nav-toc">
      <a href="#section-work">What You Work On</a>
      <a href="#section-usage">How You Use CC</a>
      <a href="#section-wins">Impressive Things</a>
      <a href="#section-friction">Where Things Go Wrong</a>
      <a href="#section-features">Features to Try</a>
      <a href="#section-patterns">New Usage Patterns</a>
      <a href="#section-horizon">On the Horizon</a>
      <a href="#section-feedback">Team Feedback</a>
    </nav>

    <div class="stats-row">
      <div class="stat"><div class="stat-value">${q.total_messages.toLocaleString()}</div><div class="stat-label">Messages</div></div>
      <div class="stat"><div class="stat-value">+${q.total_lines_added.toLocaleString()}/-${q.total_lines_removed.toLocaleString()}</div><div class="stat-label">Lines</div></div>
      <div class="stat"><div class="stat-value">${q.total_files_modified}</div><div class="stat-label">Files</div></div>
      <div class="stat"><div class="stat-value">${q.days_active}</div><div class="stat-label">Days</div></div>
      <div class="stat"><div class="stat-value">${q.messages_per_day}</div><div class="stat-label">Msgs/Day</div></div>
    </div>

    ${O}

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">What You Wanted</div>
        ${P66(q.goal_categories,"#2563eb")}
      </div>
      <div class="chart-card">
        <div class="chart-title">Top Tools Used</div>
        ${P66(q.tool_counts,"#0891b2")}
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">Languages</div>
        ${P66(q.languages,"#10b981")}
      </div>
      <div class="chart-card">
        <div class="chart-title">Session Types</div>
        ${P66(q.session_types||{},"#8b5cf6")}
      </div>
    </div>

    ${$}

    <!-- Response Time Distribution -->
    <div class="chart-card" style="margin: 24px 0;">
      <div class="chart-title">User Response Time Distribution</div>
      ${BsY(q.user_response_times)}
      <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
        Median: ${q.median_response_time.toFixed(1)}s &bull; Average: ${q.avg_response_time.toFixed(1)}s
      </div>
    </div>

    <!-- Multi-clauding Section (matching Python reference) -->
    <div class="chart-card" style="margin: 24px 0;">
      <div class="chart-title">Multi-Clauding (Parallel Sessions)</div>
      ${q.multi_clauding.overlap_events===0?`
        <p style="font-size: 14px; color: #64748b; padding: 8px 0;">
          No parallel session usage detected. You typically work with one Claude Code session at a time.
        </p>
      `:`
        <div style="display: flex; gap: 24px; margin: 12px 0;">
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #7c3aed;">${q.multi_clauding.overlap_events}</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Overlap Events</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #7c3aed;">${q.multi_clauding.sessions_involved}</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Sessions Involved</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #7c3aed;">${q.total_messages>0?Math.round(100*q.multi_clauding.user_messages_during/q.total_messages):0}%</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Of Messages</div>
          </div>
        </div>
        <p style="font-size: 13px; color: #475569; margin-top: 12px;">
          You run multiple Claude Code sessions simultaneously. Multi-clauding is detected when sessions
          overlap in time, suggesting parallel workflows.
        </p>
      `}
    </div>

    <!-- Time of Day & Tool Errors -->
    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title" style="display: flex; align-items: center; gap: 12px;">
          User Messages by Time of Day
          <select id="timezone-select" style="font-size: 12px; padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
            <option value="0">PT (UTC-8)</option>
            <option value="3">ET (UTC-5)</option>
            <option value="8">London (UTC)</option>
            <option value="9">CET (UTC+1)</option>
            <option value="17">Tokyo (UTC+9)</option>
            <option value="custom">Custom offset...</option>
          </select>
          <input type="number" id="custom-offset" placeholder="UTC offset" style="display: none; width: 80px; font-size: 12px; padding: 4px; border-radius: 4px; border: 1px solid #e2e8f0;">
        </div>
        ${psY(q.message_hours)}
      </div>
      <div class="chart-card">
        <div class="chart-title">Tool Errors Encountered</div>
        ${Object.keys(q.tool_error_categories).length>0?P66(q.tool_error_categories,"#dc2626"):'<p class="empty">No tool errors</p>'}
      </div>
    </div>

    ${H}

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">What Helped Most (Claude's Capabilities)</div>
        ${P66(q.success,"#16a34a")}
      </div>
      <div class="chart-card">
        <div class="chart-title">Outcomes</div>
        ${P66(q.outcomes,"#8b5cf6",6,msY)}
      </div>
    </div>

    ${X}

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">Primary Friction Types</div>
        ${P66(q.friction,"#dc2626")}
      </div>
      <div class="chart-card">
        <div class="chart-title">Inferred Satisfaction (model-estimated)</div>
        ${P66(q.satisfaction,"#eab308",6,usY)}
      </div>
    </div>

    ${P}

    ${D}

    ${V}

    ${f}
  </div>
  <script>${R}</script>
</body>
</html>`
}
// @from(Ln 494087, Col 0)
function UsY(q, K, _, z) {
    let Y = {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION,
        A = z?.hosts.filter((w) => w.sessionCount > 0).map((w) => w.name),
        O = {
            total: _.size,
            goal_categories: {},
            outcomes: {},
            satisfaction: {},
            friction: {}
        };
    for (let w of _.values()) {
        for (let [$, j] of Eu6(w.goal_categories))
            if (j > 0) O.goal_categories[$] = (O.goal_categories[$] || 0) + j;
        O.outcomes[w.outcome] = (O.outcomes[w.outcome] || 0) + 1;
        for (let [$, j] of Eu6(w.user_satisfaction_counts))
            if (j > 0) O.satisfaction[$] = (O.satisfaction[$] || 0) + j;
        for (let [$, j] of Eu6(w.friction_counts))
            if (j > 0) O.friction[$] = (O.friction[$] || 0) + j
    }
    return {
        metadata: {
            username: process.env.SAFEUSER || process.env.USER || "unknown",
            generated_at: new Date().toISOString(),
            claude_code_version: Y,
            date_range: q.date_range,
            session_count: q.total_sessions,
            ...A && A.length > 0 && {
                remote_hosts_collected: A
            }
        },
        aggregated_data: q,
        insights: K,
        facets_summary: O
    }
}
// @from(Ln 494129, Col 0)
async function QsY() {
    let q = jg(),
        K;
    try {
        K = await XsY(q, {
            withFileTypes: !0
        })
    } catch {
        return []
    }
    let _ = K.filter((Y) => Y.isDirectory()).map((Y) => W66(q, Y.name)),
        z = [];
    for (let Y = 0; Y < _.length; Y++) {
        let A = await jz8(_[Y]);
        for (let [O, w] of A) z.push({
            sessionId: O,
            path: w.path,
            mtime: w.mtime,
            size: w.size
        });
        if (Y % 10 === 9) await new Promise((O) => setImmediate(O))
    }
    return z.sort((Y, A) => A.mtime - Y.mtime), z
}
// @from(Ln 494153, Col 0)
async function qeK(q) {
    let K, _ = await QsY(),
        z = _.length,
        Y = 50,
        A = 200,
        O = [],
        w = [];
    for (let x = 0; x < _.length; x += Y) {
        let B = _.slice(x, x + Y),
            m = await Promise.all(B.map(async (S) => ({
                sessionInfo: S,
                cached: await RsY(S.sessionId)
            })));
        for (let {
                sessionInfo: S,
                cached: F
            }
            of m)
            if (F) O.push(F);
            else if (w.length < A) w.push(S)
    }
    let $ = new Map,
        j = (x) => {
            for (let B of x.messages.slice(0, 5))
                if (B.type === "user" && B.message) {
                    let m = B.message.content;
                    if (typeof m === "string") {
                        if (m.includes("RESPOND WITH ONLY A VALID JSON OBJECT") || m.includes("record_facets")) return !0
                    }
                } return !1
        },
        H = 10;
    for (let x = 0; x < w.length; x += H) {
        let B = w.slice(x, x + H),
            m = await Promise.all(B.map(async (F) => {
                try {
                    return await Uo8(F.path)
                } catch {
                    return []
                }
            })),
            S = [];
        for (let F of m)
            for (let U of F) {
                if (j(U) || !TsY(U)) continue;
                let g = JH7(U);
                O.push(g), S.push(g), $.set(g.session_id, U)
            }
        await Promise.all(S.map((F) => SsY(F)))
    }
    let J = new Map;
    for (let x of O) {
        let B = J.get(x.session_id);
        if (!B || x.user_message_count > B.user_message_count || x.user_message_count === B.user_message_count && x.duration_minutes > B.duration_minutes) J.set(x.session_id, x)
    }
    let X = new Set(J.keys());
    O = [...J.values()];
    for (let x of $.keys())
        if (!X.has(x)) $.delete(x);
    O.sort((x, B) => B.start_time.localeCompare(x.start_time));
    let M = (x) => {
            if (x.user_message_count < 2) return !1;
            if (x.duration_minutes < 1) return !1;
            return !0
        },
        P = O.filter(M),
        W = new Map,
        D = [],
        Z = 50,
        G = await Promise.all(P.map(async (x) => ({
            sessionId: x.session_id,
            cached: await LsY(x.session_id)
        })));
    for (let {
            sessionId: x,
            cached: B
        }
        of G)
        if (B) W.set(x, B);
        else {
            let m = $.get(x);
            if (m && D.length < Z) D.push({
                log: m,
                sessionId: x
            })
        } let f = 50;
    for (let x = 0; x < D.length; x += f) {
        let B = D.slice(x, x + f),
            m = await Promise.all(B.map(async ({
                log: F,
                sessionId: U
            }) => {
                let g = await CsY(F, U);
                return {
                    sessionId: U,
                    newFacets: g
                }
            })),
            S = [];
        for (let {
                sessionId: F,
                newFacets: U
            }
            of m)
            if (U) W.set(F, U), S.push(U);
        await Promise.all(S.map((F) => hsY(F)))
    }
    let v = (x) => {
            let B = W.get(x);
            if (!B) return !1;
            let m = B.goal_categories,
                S = dsY(m).filter((F) => (m[F] ?? 0) > 0);
            return S.length === 1 && S[0] === "warmup_minimal"
        },
        V = P.filter((x) => !v(x.session_id)),
        k = new Map;
    for (let [x, B] of W)
        if (!v(x)) k.set(x, B);
    let N = bsY(V, k);
    N.total_sessions_scanned = z;
    let R = await xsY(N, W),
        h = gsY(N, R);
    try {
        await jH7(Fo8(), {
            recursive: !0
        })
    } catch {}
    let C = W66(Fo8(), "report.html");
    return await HH7(C, h, {
        encoding: "utf-8",
        mode: 384
    }), {
        insights: R,
        htmlPath: C,
        data: N,
        remoteStats: K,
        facets: k
    }
}
// @from(Ln 494293, Col 0)
function Eu6(q) {
    return q ? Object.entries(q) : []
}
// @from(Ln 494297, Col 0)
function dsY(q) {
    return q ? Object.keys(q) : []
}
// @from(Ln 494301, Col 0)
function KeK({
    insightsJson: q,
    reportUrl: K,
    uploadHint: _,
    htmlPath: z,
    facetsDir: Y,
    header: A,
    summaryText: O
}) {
    return `The user just ran /insights to generate a usage report analyzing their Claude Code sessions.

Here is the full insights data:
${q}

Report URL: ${K}
HTML file: ${z}
Facets directory: ${Y}

At-a-glance summary (for your context only — the user has not seen any output yet):
${A}${O}

Output the text between <message> tags verbatim as your entire response. Do not omit any line:

<message>
Your shareable insights report is ready:
${K}${_}

Want to dig into any section or try one of the suggestions?
</message>`
}
// @from(Ln 494332, Col 0)
function _eK(q) {
    if (!q || typeof q !== "object") return !1;
    let K = q;
    return typeof K.underlying_goal === "string" && typeof K.outcome === "string" && typeof K.brief_summary === "string" && K.goal_categories !== null && typeof K.goal_categories === "object" && K.user_satisfaction_counts !== null && typeof K.user_satisfaction_counts === "object" && K.friction_counts !== null && typeof K.friction_counts === "object"
}
// @from(Ln 494337, Col 4)
DsY
// @from(Ln 494337, Col 9)
ZsY
// @from(Ln 494337, Col 14)
fsY = `Analyze this Claude Code session and extract structured facets.

CRITICAL GUIDELINES:

1. **goal_categories**: Count ONLY what the USER explicitly asked for.
   - DO NOT count Claude's autonomous codebase exploration
   - DO NOT count work Claude decided to do on its own
   - ONLY count when user says "can you...", "please...", "I need...", "let's..."

2. **user_satisfaction_counts**: Base ONLY on explicit user signals.
   - "Yay!", "great!", "perfect!" → happy
   - "thanks", "looks good", "that works" → satisfied
   - "ok, now let's..." (continuing without complaint) → likely_satisfied
   - "that's not right", "try again" → dissatisfied
   - "this is broken", "I give up" → frustrated

3. **friction_counts**: Be specific about what went wrong.
   - misunderstood_request: Claude interpreted incorrectly
   - wrong_approach: Right goal, wrong solution method
   - buggy_code: Code didn't work correctly
   - user_rejected_action: User said no/stop to a tool call
   - excessive_changes: Over-engineered or changed too much

4. If very short or just warmup, use warmup_minimal for goal_category

SESSION:
`
// @from(Ln 494364, Col 4)
NsY = `Summarize this portion of a Claude Code session transcript. Focus on:
1. What the user asked for
2. What Claude did (tools used, files modified)
3. Any friction or issues
4. The outcome

Keep it concise - 3-5 sentences. Preserve specific details like file names, error messages, and user feedback.

TRANSCRIPT CHUNK:
`
// @from(Ln 494374, Col 4)
IsY
// @from(Ln 494374, Col 9)
usY
// @from(Ln 494374, Col 14)
msY
// @from(Ln 494374, Col 19)
csY
// @from(Ln 494374, Col 24)
lsY
// @from(Ln 494375, Col 4)
YeK = L(() => {
    pK6();
    O2();
    sY();
    Q8();
    m8();
    Q4();
    U8();
    _7();
    Sq();
    g4();
    e8();
    cW();
    DsY = {
        ".ts": "TypeScript",
        ".tsx": "TypeScript",
        ".js": "JavaScript",
        ".jsx": "JavaScript",
        ".py": "Python",
        ".rb": "Ruby",
        ".go": "Go",
        ".rs": "Rust",
        ".java": "Java",
        ".md": "Markdown",
        ".json": "JSON",
        ".yaml": "YAML",
        ".yml": "YAML",
        ".sh": "Shell",
        ".css": "CSS",
        ".html": "HTML"
    }, ZsY = {
        debug_investigate: "Debug/Investigate",
        implement_feature: "Implement Feature",
        fix_bug: "Fix Bug",
        write_script_tool: "Write Script/Tool",
        refactor_code: "Refactor Code",
        configure_system: "Configure System",
        create_pr_commit: "Create PR/Commit",
        analyze_data: "Analyze Data",
        understand_codebase: "Understand Codebase",
        write_tests: "Write Tests",
        write_docs: "Write Docs",
        deploy_infra: "Deploy/Infra",
        warmup_minimal: "Cache Warmup",
        fast_accurate_search: "Fast/Accurate Search",
        correct_code_edits: "Correct Code Edits",
        good_explanations: "Good Explanations",
        proactive_help: "Proactive Help",
        multi_file_changes: "Multi-file Changes",
        handled_complexity: "Multi-file Changes",
        good_debugging: "Good Debugging",
        misunderstood_request: "Misunderstood Request",
        wrong_approach: "Wrong Approach",
        buggy_code: "Buggy Code",
        user_rejected_action: "User Rejected Action",
        claude_got_blocked: "Claude Got Blocked",
        user_stopped_early: "User Stopped Early",
        wrong_file_or_location: "Wrong File/Location",
        excessive_changes: "Excessive Changes",
        slow_or_verbose: "Slow/Verbose",
        tool_failed: "Tool Failed",
        user_unclear: "User Unclear",
        external_issue: "External Issue",
        frustrated: "Frustrated",
        dissatisfied: "Dissatisfied",
        likely_satisfied: "Likely Satisfied",
        satisfied: "Satisfied",
        happy: "Happy",
        unsure: "Unsure",
        neutral: "Neutral",
        delighted: "Delighted",
        single_task: "Single Task",
        multi_task: "Multi Task",
        iterative_refinement: "Iterative Refinement",
        exploration: "Exploration",
        quick_question: "Quick Question",
        fully_achieved: "Fully Achieved",
        mostly_achieved: "Mostly Achieved",
        partially_achieved: "Partially Achieved",
        not_achieved: "Not Achieved",
        unclear_from_transcript: "Unclear",
        unhelpful: "Unhelpful",
        slightly_helpful: "Slightly Helpful",
        moderately_helpful: "Moderately Helpful",
        very_helpful: "Very Helpful",
        essential: "Essential"
    };
    IsY = [{
        name: "project_areas",
        prompt: `Analyze this Claude Code usage data and identify project areas.

RESPOND WITH ONLY A VALID JSON OBJECT:
{
  "areas": [
    {"name": "Area name", "session_count": N, "description": "2-3 sentences about what was worked on and how Claude Code was used."}
  ]
}

Include 4-5 areas. Skip internal CC operations.`,
        maxTokens: 8192
    }, {
        name: "interaction_style",
        prompt: `Analyze this Claude Code usage data and describe the user's interaction style.

RESPOND WITH ONLY A VALID JSON OBJECT:
{
  "narrative": "2-3 paragraphs analyzing HOW the user interacts with Claude Code. Use second person 'you'. Describe patterns: iterate quickly vs detailed upfront specs? Interrupt often or let Claude run? Include specific examples. Use **bold** for key insights.",
  "key_pattern": "One sentence summary of most distinctive interaction style"
}`,
        maxTokens: 8192
    }, {
        name: "what_works",
        prompt: `Analyze this Claude Code usage data and identify what's working well for this user. Use second person ("you").

RESPOND WITH ONLY A VALID JSON OBJECT:
{
  "intro": "1 sentence of context",
  "impressive_workflows": [
    {"title": "Short title (3-6 words)", "description": "2-3 sentences describing the impressive workflow or approach. Use 'you' not 'the user'."}
  ]
}

Include 3 impressive workflows.`,
        maxTokens: 8192
    }, {
        name: "friction_analysis",
        prompt: `Analyze this Claude Code usage data and identify friction points for this user. Use second person ("you").

RESPOND WITH ONLY A VALID JSON OBJECT:
{
  "intro": "1 sentence summarizing friction patterns",
  "categories": [
    {"category": "Concrete category name", "description": "1-2 sentences explaining this category and what could be done differently. Use 'you' not 'the user'.", "examples": ["Specific example with consequence", "Another example"]}
  ]
}

Include 3 friction categories with 2 examples each.`,
        maxTokens: 8192
    }, {
        name: "suggestions",
        prompt: `Analyze this Claude Code usage data and suggest improvements.

## CC FEATURES REFERENCE (pick from these for features_to_try):
1. **MCP Servers**: Connect Claude to external tools, databases, and APIs via Model Context Protocol.
   - How to use: Run \`claude mcp add <server-name> -- <command>\`
   - Good for: database queries, Slack integration, GitHub issue lookup, connecting to internal APIs

2. **Custom Skills**: Reusable prompts you define as markdown files that run with a single /command.
   - How to use: Create \`.claude/skills/commit/SKILL.md\` with instructions. Then type \`/commit\` to run it.
   - Good for: repetitive workflows - /commit, /review, /test, /deploy, /pr, or complex multi-step workflows

3. **Hooks**: Shell commands that auto-run at specific lifecycle events.
   - How to use: Add to \`.claude/settings.json\` under "hooks" key.
   - Good for: auto-formatting code, running type checks, enforcing conventions

4. **Headless Mode**: Run Claude non-interactively from scripts and CI/CD.
   - How to use: \`claude -p "fix lint errors" --allowedTools "Edit,Read,Bash"\`
   - Good for: CI/CD integration, batch code fixes, automated reviews

5. **Task Agents**: Claude spawns focused sub-agents for complex exploration or parallel work.
   - How to use: Claude auto-invokes when helpful, or ask "use an agent to explore X"
   - Good for: codebase exploration, understanding complex systems

RESPOND WITH ONLY A VALID JSON OBJECT:
{
  "claude_md_additions": [
    {"addition": "A specific line or block to add to CLAUDE.md based on workflow patterns. E.g., 'Always run tests after modifying auth-related files'", "why": "1 sentence explaining why this would help based on actual sessions", "prompt_scaffold": "Instructions for where to add this in CLAUDE.md. E.g., 'Add under ## Testing section'"}
  ],
  "features_to_try": [
    {"feature": "Feature name from CC FEATURES REFERENCE above", "one_liner": "What it does", "why_for_you": "Why this would help YOU based on your sessions", "example_code": "Actual command or config to copy"}
  ],
  "usage_patterns": [
    {"title": "Short title", "suggestion": "1-2 sentence summary", "detail": "3-4 sentences explaining how this applies to YOUR work", "copyable_prompt": "A specific prompt to copy and try"}
  ]
}

IMPORTANT for claude_md_additions: PRIORITIZE instructions that appear MULTIPLE TIMES in the user data. If user told Claude the same thing in 2+ sessions (e.g., 'always run tests', 'use TypeScript'), that's a PRIME candidate - they shouldn't have to repeat themselves.

IMPORTANT for features_to_try: Pick 2-3 from the CC FEATURES REFERENCE above. Include 2-3 items for each category.`,
        maxTokens: 8192
    }, {
        name: "on_the_horizon",
        prompt: `Analyze this Claude Code usage data and identify future opportunities.

RESPOND WITH ONLY A VALID JSON OBJECT:
{
  "intro": "1 sentence about evolving AI-assisted development",
  "opportunities": [
    {"title": "Short title (4-8 words)", "whats_possible": "2-3 ambitious sentences about autonomous workflows", "how_to_try": "1-2 sentences mentioning relevant tooling", "copyable_prompt": "Detailed prompt to try"}
  ]
}

Include 3 opportunities. Think BIG - autonomous workflows, parallel agents, iterating against tests.`,
        maxTokens: 8192
    }, ...[], {
        name: "fun_ending",
        prompt: `Analyze this Claude Code usage data and find a memorable moment.

RESPOND WITH ONLY A VALID JSON OBJECT:
{
  "headline": "A memorable QUALITATIVE moment from the transcripts - not a statistic. Something human, funny, or surprising.",
  "detail": "Brief context about when/where this happened"
}

Find something genuinely interesting or amusing from the session summaries.`,
        maxTokens: 8192
    }];
    usY = ["frustrated", "dissatisfied", "likely_satisfied", "satisfied", "happy", "unsure"], msY = ["not_achieved", "partially_achieved", "mostly_achieved", "fully_achieved", "unclear_from_transcript"];
    csY = {
        type: "prompt",
        name: "insights",
        description: "Generate a report analyzing your Claude Code sessions",
        contentLength: 0,
        progressMessage: "analyzing your sessions",
        source: "builtin",
        async getPromptForCommand(q) {
            let K = !1,
                _ = [],
                z = !1,
                {
                    insights: Y,
                    htmlPath: A,
                    data: O,
                    remoteStats: w
                } = await qeK({
                    collectRemote: K
                }),
                $ = `file://${A}`,
                j = "",
                J = [O.total_sessions_scanned && O.total_sessions_scanned > O.total_sessions ? `${O.total_sessions_scanned.toLocaleString()} sessions total · ${O.total_sessions} analyzed` : `${O.total_sessions} sessions`, `${O.total_messages.toLocaleString()} messages`, `${Math.round(O.total_duration_hours)}h`, `${O.git_commits} commits`].join(" · "),
                X = "",
                M = Y.at_a_glance,
                P = M ? `## At a Glance

${M.whats_working?`**What's working:** ${M.whats_working} See _Impressive Things You Did_.`:""}

${M.whats_hindering?`**What's hindering you:** ${M.whats_hindering} See _Where Things Go Wrong_.`:""}

${M.quick_wins?`**Quick wins to try:** ${M.quick_wins} See _Features to Try_.`:""}

${M.ambitious_workflows?`**Ambitious workflows:** ${M.ambitious_workflows} See _On the Horizon_.`:""}` : "_No insights generated_",
                W = `# Claude Code Insights

${J}
${O.date_range.start} to ${O.date_range.end}
${X}
`;
            return [{
                type: "text",
                text: KeK({
                    insightsJson: I6(Y, null, 2),
                    reportUrl: $,
                    uploadHint: j,
                    htmlPath: A,
                    facetsDir: go8(),
                    header: W,
                    summaryText: P
                })
            }]
        }
    };
    lsY = csY
})