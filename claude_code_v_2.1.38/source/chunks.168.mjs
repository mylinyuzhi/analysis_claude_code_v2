
// @from(Ln 433914, Col 4)
jOq = v(() => {
    i1();
    m1();
    K7();
    x2();
    X91();
    b7();
    q3();
    EBA();
    i$q();
    vq();
    LY();
    wOq();
    e7();
    cA();
    Wu();
    Tr();
    mq();
    W8 = o(X1(), 1), Of = o(X1(), 1), OOq = o(Q$q(), 1);
    HOq = {
        "7d": "Last 7 days",
        "30d": "Last 30 days",
        all: "All time"
    }, qT6 = ["all", "7d", "30d"];
    M5z = [{
        name: "The Little Prince",
        tokens: 22000
    }, {
        name: "The Old Man and the Sea",
        tokens: 35000
    }, {
        name: "A Christmas Carol",
        tokens: 37000
    }, {
        name: "Animal Farm",
        tokens: 39000
    }, {
        name: "Fahrenheit 451",
        tokens: 60000
    }, {
        name: "The Great Gatsby",
        tokens: 62000
    }, {
        name: "Slaughterhouse-Five",
        tokens: 64000
    }, {
        name: "Brave New World",
        tokens: 83000
    }, {
        name: "The Catcher in the Rye",
        tokens: 95000
    }, {
        name: "Harry Potter and the Philosopher's Stone",
        tokens: 103000
    }, {
        name: "The Hobbit",
        tokens: 123000
    }, {
        name: "1984",
        tokens: 123000
    }, {
        name: "To Kill a Mockingbird",
        tokens: 130000
    }, {
        name: "Pride and Prejudice",
        tokens: 156000
    }, {
        name: "Dune",
        tokens: 244000
    }, {
        name: "Moby-Dick",
        tokens: 268000
    }, {
        name: "Crime and Punishment",
        tokens: 274000
    }, {
        name: "A Game of Thrones",
        tokens: 381000
    }, {
        name: "Anna Karenina",
        tokens: 468000
    }, {
        name: "Don Quixote",
        tokens: 520000
    }, {
        name: "The Lord of the Rings",
        tokens: 576000
    }, {
        name: "The Count of Monte Cristo",
        tokens: 603000
    }, {
        name: "Les Misérables",
        tokens: 689000
    }, {
        name: "War and Peace",
        tokens: 730000
    }], P5z = [{
        name: "a TED talk",
        minutes: 18
    }, {
        name: "an episode of The Office",
        minutes: 22
    }, {
        name: "listening to Abbey Road",
        minutes: 47
    }, {
        name: "a yoga class",
        minutes: 60
    }, {
        name: "a World Cup soccer match",
        minutes: 90
    }, {
        name: "a half marathon (average time)",
        minutes: 120
    }, {
        name: "the movie Inception",
        minutes: 148
    }, {
        name: "watching Titanic",
        minutes: 195
    }, {
        name: "a transatlantic flight",
        minutes: 420
    }, {
        name: "a full night of sleep",
        minutes: 480
    }]
})
// @from(Ln 434042, Col 4)
MOq = {}
// @from(Ln 434046, Col 4)
uBA
// @from(Ln 434046, Col 9)
y5z = async (A) => {
    return u8("stats"), uBA.createElement(_Oq, {
        onClose: A
    })
}
// @from(Ln 434051, Col 4)
POq = v(() => {
    jOq();
    v3();
    uBA = o(X1(), 1)
})
// @from(Ln 434056, Col 4)
C5z
// @from(Ln 434056, Col 9)
WOq
// @from(Ln 434057, Col 4)
GOq = v(() => {
    C5z = {
        type: "local-jsx",
        name: "stats",
        description: "Show your Claude Code usage statistics and activity",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (POq(), MOq)),
        userFacingName() {
            return "stats"
        }
    }, WOq = C5z
})
// @from(Ln 434078, Col 0)
function fOq() {
    return _u()
}
// @from(Ln 434082, Col 0)
function I5z() {
    return _u()
}
// @from(Ln 434086, Col 0)
function B5z(A) {
    let q = S5z(A).toLowerCase();
    return x5z[q] || null
}
// @from(Ln 434091, Col 0)
function m5z(A) {
    let q = {},
        K = {},
        Y = 0,
        z = 0,
        w = 0,
        H = 0,
        $ = 0,
        O = [],
        _ = 0,
        J = {},
        X = !1,
        D = 0,
        j = 0,
        M = new Set,
        P = [],
        W = [],
        G = !1,
        f = !1,
        Z = !1,
        N = null;
    for (let T of A.messages) {
        let k = T.timestamp;
        if (T.type === "assistant" && T.message) {
            if (k) N = k;
            let y = T.message.usage;
            if (y) w += y.input_tokens || 0, H += y.output_tokens || 0;
            let B = T.message.content;
            if (Array.isArray(B)) {
                for (let S of B)
                    if (S.type === "tool_use" && "name" in S) {
                        let m = S.name;
                        if (q[m] = (q[m] || 0) + 1, m === "Task") X = !0;
                        if (m.startsWith("mcp__")) G = !0;
                        if (m === "WebSearch") f = !0;
                        if (m === "WebFetch") Z = !0;
                        let b = S.input;
                        if (b) {
                            let g = b.file_path || "";
                            if (g) {
                                let x = B5z(g);
                                if (x) K[x] = (K[x] || 0) + 1;
                                if (m === "Edit" || m === "Write") M.add(g)
                            }
                            if (m === "Edit") {
                                let x = b.old_string || "",
                                    p = b.new_string || "";
                                for (let l of lo(x, p)) {
                                    if (l.added) D += l.count || 0;
                                    if (l.removed) j += l.count || 0
                                }
                            }
                            if (m === "Write") {
                                let x = b.content || "";
                                if (x) D += x.split(`
`).length
                            }
                            let U = b.command || "";
                            if (U.includes("git commit")) Y++;
                            if (U.includes("git push")) z++
                        }
                    }
            }
        }
        if (T.type === "user" && T.message) {
            let y = T.message.content,
                B = !1;
            if (typeof y === "string" && y.trim()) B = !0;
            else if (Array.isArray(y)) {
                for (let S of y)
                    if (S.type === "text" && "text" in S) {
                        B = !0;
                        break
                    }
            }
            if (B) {
                if (k) try {
                    let m = new Date(k).getHours();
                    P.push(m), W.push(k)
                } catch {}
                if (N && k) {
                    let S = new Date(N).getTime(),
                        b = (new Date(k).getTime() - S) / 1000;
                    if (b > 2 && b < 3600) O.push(b)
                }
            }
            if (Array.isArray(y)) {
                for (let S of y)
                    if (S.type === "tool_result" && "content" in S) {
                        if (S.is_error) {
                            _++;
                            let b = S.content,
                                g = "Other";
                            if (typeof b === "string") {
                                let U = b.toLowerCase();
                                if (U.includes("exit code")) g = "Command Failed";
                                else if (U.includes("rejected") || U.includes("doesn't want")) g = "User Rejected";
                                else if (U.includes("string to replace not found") || U.includes("no changes")) g = "Edit Failed";
                                else if (U.includes("modified since read")) g = "File Changed";
                                else if (U.includes("exceeds maximum") || U.includes("too large")) g = "File Too Large";
                                else if (U.includes("file not found") || U.includes("does not exist")) g = "File Not Found"
                            }
                            J[g] = (J[g] || 0) + 1
                        }
                    }
            }
            if (typeof y === "string") {
                if (y.includes("[Request interrupted by user")) $++
            } else if (Array.isArray(y)) {
                for (let S of y)
                    if (S.type === "text" && "text" in S && S.text.includes("[Request interrupted by user")) {
                        $++;
                        break
                    }
            }
        }
    }
    return {
        toolCounts: q,
        languages: K,
        gitCommits: Y,
        gitPushes: z,
        inputTokens: w,
        outputTokens: H,
        userInterruptions: $,
        userResponseTimes: O,
        toolErrors: _,
        toolErrorCategories: J,
        usesTaskAgent: X,
        usesMcp: G,
        usesWebSearch: f,
        usesWebFetch: Z,
        linesAdded: D,
        linesRemoved: j,
        filesModified: M,
        messageHours: P,
        userMessageTimestamps: W
    }
}
// @from(Ln 434231, Col 0)
function F5z(A) {
    return !Number.isNaN(A.created.getTime()) && !Number.isNaN(A.modified.getTime())
}
// @from(Ln 434235, Col 0)
function FBA(A) {
    let q = m5z(A),
        K = Xw(A) || "unknown",
        Y = A.created.toISOString(),
        z = Math.round((A.modified.getTime() - A.created.getTime()) / 1000 / 60),
        w = 0,
        H = 0;
    for (let $ of A.messages) {
        if ($.type === "assistant") H++;
        if ($.type === "user" && $.message) {
            let O = $.message.content,
                _ = !1;
            if (typeof O === "string" && O.trim()) _ = !0;
            else if (Array.isArray(O)) {
                for (let J of O)
                    if (J.type === "text" && "text" in J) {
                        _ = !0;
                        break
                    }
            }
            if (_) w++
        }
    }
    return {
        session_id: K,
        project_path: A.projectPath || "",
        start_time: Y,
        duration_minutes: z,
        user_message_count: w,
        assistant_message_count: H,
        tool_counts: q.toolCounts,
        languages: q.languages,
        git_commits: q.gitCommits,
        git_pushes: q.gitPushes,
        input_tokens: q.inputTokens,
        output_tokens: q.outputTokens,
        first_prompt: A.firstPrompt || "",
        summary: A.summary,
        user_interruptions: q.userInterruptions,
        user_response_times: q.userResponseTimes,
        tool_errors: q.toolErrors,
        tool_error_categories: q.toolErrorCategories,
        uses_task_agent: q.usesTaskAgent,
        uses_mcp: q.usesMcp,
        uses_web_search: q.usesWebSearch,
        uses_web_fetch: q.usesWebFetch,
        lines_added: q.linesAdded,
        lines_removed: q.linesRemoved,
        files_modified: q.filesModified.size,
        message_hours: q.messageHours,
        user_message_timestamps: q.userMessageTimestamps
    }
}
// @from(Ln 434289, Col 0)
function Q5z(A) {
    let q = [],
        K = FBA(A);
    q.push(`Session: ${K.session_id.slice(0,8)}`), q.push(`Date: ${K.start_time}`), q.push(`Project: ${K.project_path}`), q.push(`Duration: ${K.duration_minutes} min`), q.push("");
    for (let Y of A.messages)
        if (Y.type === "user" && Y.message) {
            let z = Y.message.content;
            if (typeof z === "string") q.push(`[User]: ${z.slice(0,500)}`);
            else if (Array.isArray(z)) {
                for (let w of z)
                    if (w.type === "text" && "text" in w) q.push(`[User]: ${w.text.slice(0,500)}`)
            }
        } else if (Y.type === "assistant" && Y.message) {
        let z = Y.message.content;
        if (Array.isArray(z)) {
            for (let w of z)
                if (w.type === "text" && "text" in w) q.push(`[Assistant]: ${w.text.slice(0,300)}`);
                else if (w.type === "tool_use" && "name" in w) q.push(`[Tool: ${w.name}]`)
        }
    }
    return q.join(`
`)
}
// @from(Ln 434312, Col 0)
async function U5z(A) {
    try {
        return (await wT6({
            systemPrompt: [],
            userPrompt: g5z + A,
            signal: new AbortController().signal,
            options: {
                model: fOq(),
                querySource: "insights",
                agents: [],
                isNonInteractiveSession: !0,
                hasAppendSystemPrompt: !1,
                mcpTools: [],
                maxOutputTokensOverride: 500
            }
        })).message.content.filter((Y) => Y.type === "text").map((Y) => Y.text).join("") || A.slice(0, 2000)
    } catch {
        return A.slice(0, 2000)
    }
}
// @from(Ln 434332, Col 0)
async function p5z(A) {
    let q = Q5z(A);
    if (q.length <= 30000) return q;
    let K = 25000,
        Y = [];
    for (let $ = 0; $ < q.length; $ += K) Y.push(q.slice($, $ + K));
    let z = await Promise.all(Y.map(U5z)),
        w = FBA(A);
    return [`Session: ${w.session_id.slice(0,8)}`, `Date: ${w.start_time}`, `Project: ${w.project_path}`, `Duration: ${w.duration_minutes} min`, `[Long session - ${Y.length} parts summarized]`, ""].join(`
`) + z.join(`

---

`)
}
// @from(Ln 434348, Col 0)
function d5z(A) {
    let q = b1(),
        K = Cc(zT6, `${A}.json`);
    try {
        let Y = q.readFileSync(K, {
                encoding: "utf-8"
            }),
            z = _A(Y);
        if (!VOq(z)) {
            try {
                q.unlinkSync(K)
            } catch {}
            return null
        }
        return z
    } catch {
        return null
    }
}
// @from(Ln 434368, Col 0)
function c5z(A) {
    try {
        b1().mkdirSync(zT6)
    } catch {}
    let q = Cc(zT6, `${A.session_id}.json`);
    c8(q, Q1(A, null, 2), {
        encoding: "utf-8",
        flush: !0,
        mode: 384
    })
}
// @from(Ln 434379, Col 0)
async function l5z(A) {
    let q = Cc(mBA, `${A}.json`);
    try {
        let K = await h5z(q, {
            encoding: "utf-8"
        });
        return _A(K)
    } catch {
        return null
    }
}
// @from(Ln 434391, Col 0)
function i5z(A) {
    try {
        b1().mkdirSync(mBA)
    } catch {}
    let q = Cc(mBA, `${A.session_id}.json`);
    c8(q, Q1(A, null, 2), {
        encoding: "utf-8",
        flush: !0,
        mode: 384
    })
}
// @from(Ln 434402, Col 0)
async function n5z(A, q) {
    try {
        let K = await p5z(A),
            Y = `${u5z}${K}

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
            H = (await wT6({
                systemPrompt: [],
                userPrompt: Y,
                signal: new AbortController().signal,
                options: {
                    model: fOq(),
                    querySource: "insights",
                    agents: [],
                    isNonInteractiveSession: !0,
                    hasAppendSystemPrompt: !1,
                    mcpTools: [],
                    maxOutputTokensOverride: 4096
                }
            })).message.content.filter((_) => _.type === "text").map((_) => _.text).join("").match(/\{[\s\S]*\}/);
        if (!H) return null;
        let $ = _A(H[0]);
        if (!VOq($)) return null;
        return {
            ...$,
            session_id: q
        }
    } catch (K) {
        return K1(K instanceof Error ? K : Error("Facet extraction failed")), null
    }
}
// @from(Ln 434446, Col 0)
function r5z(A) {
    let K = [];
    for (let O of A)
        for (let _ of O.user_message_timestamps) try {
            let J = new Date(_).getTime();
            K.push({
                ts: J,
                sessionId: O.session_id
            })
        } catch {}
    K.sort((O, _) => O.ts - _.ts);
    let Y = new Set,
        z = new Set,
        w = 0,
        H = new Map;
    for (let O = 0; O < K.length; O++) {
        let _ = K[O];
        while (w < O && _.ts - K[w].ts > 1800000) {
            let X = K[w];
            if (H.get(X.sessionId) === w) H.delete(X.sessionId);
            w++
        }
        let J = H.get(_.sessionId);
        if (J !== void 0)
            for (let X = J + 1; X < O; X++) {
                let D = K[X];
                if (D.sessionId !== _.sessionId) {
                    let j = [_.sessionId, D.sessionId].sort().join(":");
                    Y.add(j), z.add(`${K[J].ts}:${_.sessionId}`), z.add(`${D.ts}:${D.sessionId}`), z.add(`${_.ts}:${_.sessionId}`);
                    break
                }
            }
        H.set(_.sessionId, O)
    }
    let $ = new Set;
    for (let O of Y) {
        let [_, J] = O.split(":");
        if (_) $.add(_);
        if (J) $.add(J)
    }
    return {
        overlap_events: Y.size,
        sessions_involved: $.size,
        user_messages_during: z.size
    }
}
// @from(Ln 434493, Col 0)
function o5z(A, q) {
    let K = {
            total_sessions: A.length,
            sessions_with_facets: q.size,
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
        Y = [],
        z = [],
        w = [];
    for (let $ of A) {
        Y.push($.start_time), K.total_messages += $.user_message_count, K.total_duration_hours += $.duration_minutes / 60, K.total_input_tokens += $.input_tokens, K.total_output_tokens += $.output_tokens, K.git_commits += $.git_commits, K.git_pushes += $.git_pushes, K.total_interruptions += $.user_interruptions, K.total_tool_errors += $.tool_errors;
        for (let [_, J] of Object.entries($.tool_error_categories)) K.tool_error_categories[_] = (K.tool_error_categories[_] || 0) + J;
        if (z.push(...$.user_response_times), $.uses_task_agent) K.sessions_using_task_agent++;
        if ($.uses_mcp) K.sessions_using_mcp++;
        if ($.uses_web_search) K.sessions_using_web_search++;
        if ($.uses_web_fetch) K.sessions_using_web_fetch++;
        K.total_lines_added += $.lines_added, K.total_lines_removed += $.lines_removed, K.total_files_modified += $.files_modified, w.push(...$.message_hours);
        for (let [_, J] of Object.entries($.tool_counts)) K.tool_counts[_] = (K.tool_counts[_] || 0) + J;
        for (let [_, J] of Object.entries($.languages)) K.languages[_] = (K.languages[_] || 0) + J;
        if ($.project_path) K.projects[$.project_path] = (K.projects[$.project_path] || 0) + 1;
        let O = q.get($.session_id);
        if (O) {
            for (let [_, J] of BBA(O.goal_categories))
                if (J > 0) K.goal_categories[_] = (K.goal_categories[_] || 0) + J;
            K.outcomes[O.outcome] = (K.outcomes[O.outcome] || 0) + 1;
            for (let [_, J] of BBA(O.user_satisfaction_counts))
                if (J > 0) K.satisfaction[_] = (K.satisfaction[_] || 0) + J;
            K.helpfulness[O.claude_helpfulness] = (K.helpfulness[O.claude_helpfulness] || 0) + 1, K.session_types[O.session_type] = (K.session_types[O.session_type] || 0) + 1;
            for (let [_, J] of BBA(O.friction_counts))
                if (J > 0) K.friction[_] = (K.friction[_] || 0) + J;
            if (O.primary_success !== "none") K.success[O.primary_success] = (K.success[O.primary_success] || 0) + 1
        }
        if (K.session_summaries.length < 50) K.session_summaries.push({
            id: $.session_id.slice(0, 8),
            date: $.start_time.split("T")[0] || "",
            summary: $.summary || $.first_prompt.slice(0, 100),
            goal: O?.underlying_goal
        })
    }
    if (Y.sort(), K.date_range.start = Y[0]?.split("T")[0] || "", K.date_range.end = Y[Y.length - 1]?.split("T")[0] || "", K.user_response_times = z, z.length > 0) {
        let $ = [...z].sort((O, _) => O - _);
        K.median_response_time = $[Math.floor($.length / 2)] || 0, K.avg_response_time = z.reduce((O, _) => O + _, 0) / z.length
    }
    let H = new Set(Y.map(($) => $.split("T")[0]));
    return K.days_active = H.size, K.messages_per_day = K.days_active > 0 ? Math.round(K.total_messages / K.days_active * 10) / 10 : 0, K.message_hours = w, K.multi_clauding = r5z(A), K
}
// @from(Ln 434580, Col 0)
async function ZOq(A, q) {
    try {
        let Y = (await wT6({
            systemPrompt: [],
            userPrompt: A.prompt + `

DATA:
` + q,
            signal: new AbortController().signal,
            options: {
                model: I5z(),
                querySource: "insights",
                agents: [],
                isNonInteractiveSession: !0,
                hasAppendSystemPrompt: !1,
                mcpTools: [],
                maxOutputTokensOverride: A.maxTokens
            }
        })).message.content.filter((z) => z.type === "text").map((z) => z.text).join("");
        if (Y) {
            let z = Y.match(/\{[\s\S]*\}/);
            if (z) try {
                return {
                    name: A.name,
                    result: _A(z[0])
                }
            } catch {
                return {
                    name: A.name,
                    result: null
                }
            }
        }
        return {
            name: A.name,
            result: null
        }
    } catch (K) {
        return K1(K instanceof Error ? K : Error(`${A.name} failed`)), {
            name: A.name,
            result: null
        }
    }
}
// @from(Ln 434624, Col 0)
async function s5z(A, q) {
    let K = Array.from(q.values()).slice(0, 50).map((f) => `- ${f.brief_summary} (${f.outcome}, ${f.claude_helpfulness})`).join(`
`),
        Y = Array.from(q.values()).filter((f) => f.friction_detail).slice(0, 20).map((f) => `- ${f.friction_detail}`).join(`
`),
        z = Array.from(q.values()).flatMap((f) => f.user_instructions_to_claude || []).slice(0, 15).map((f) => `- ${f}`).join(`
`),
        H = Q1({
            sessions: A.total_sessions,
            analyzed: A.sessions_with_facets,
            date_range: A.date_range,
            messages: A.total_messages,
            hours: Math.round(A.total_duration_hours),
            commits: A.git_commits,
            top_tools: Object.entries(A.tool_counts).sort((f, Z) => Z[1] - f[1]).slice(0, 8),
            top_goals: Object.entries(A.goal_categories).sort((f, Z) => Z[1] - f[1]).slice(0, 8),
            outcomes: A.outcomes,
            satisfaction: A.satisfaction,
            friction: A.friction,
            success: A.success,
            languages: A.languages
        }, null, 2) + `

SESSION SUMMARIES:
` + K + `

FRICTION DETAILS:
` + Y + `

USER INSTRUCTIONS TO CLAUDE:
` + (z || "None captured"),
        $ = await Promise.all(a5z.map((f) => ZOq(f, H))),
        O = {};
    for (let {
            name: f,
            result: Z
        }
        of $)
        if (Z) O[f] = Z;
    let _ = O.project_areas?.areas?.map((f) => `- ${f.name}: ${f.description}`).join(`
`) || "",
        J = O.what_works?.impressive_workflows?.map((f) => `- ${f.title}: ${f.description}`).join(`
`) || "",
        X = O.friction_analysis?.categories?.map((f) => `- ${f.category}: ${f.description}`).join(`
`) || "",
        D = O.suggestions?.features_to_try?.map((f) => `- ${f.feature}: ${f.one_liner}`).join(`
`) || "",
        j = O.suggestions?.usage_patterns?.map((f) => `- ${f.title}: ${f.suggestion}`).join(`
`) || "",
        M = O.on_the_horizon?.opportunities?.map((f) => `- ${f.title}: ${f.whats_possible}`).join(`
`) || "",
        W = {
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
${H}

## Project Areas (what user works on)
${_}

## Big Wins (impressive accomplishments)
${J}

## Friction Categories (where things go wrong)
${X}

## Features to Try
${D}

## Usage Patterns to Adopt
${j}

## On the Horizon (ambitious workflows for better models)
${M}`,
            maxTokens: 8192
        },
        G = await ZOq(W, "");
    if (G.result) O.at_a_glance = G.result;
    return O
}
// @from(Ln 434726, Col 0)
function T9(A) {
    return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}
// @from(Ln 434730, Col 0)
function KT6(A) {
    return T9(A).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
}
// @from(Ln 434734, Col 0)
function yc(A, q, K = 6, Y) {
    let z;
    if (Y) z = Y.filter((H) => (H in A) && (A[H] ?? 0) > 0).map((H) => [H, A[H] ?? 0]);
    else z = Object.entries(A).sort((H, $) => $[1] - H[1]).slice(0, K);
    if (z.length === 0) return '<p class="empty">No data</p>';
    let w = Math.max(...z.map((H) => H[1]));
    return z.map(([H, $]) => {
        let O = $ / w * 100,
            _ = b5z[H] || H.replace(/_/g, " ").replace(/\b\w/g, (J) => J.toUpperCase());
        return `<div class="bar-row">
        <div class="bar-label">${T9(_)}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${O}%;background:${q}"></div></div>
        <div class="bar-value">${$}</div>
      </div>`
    }).join(`
`)
}
// @from(Ln 434752, Col 0)
function A9z(A) {
    if (A.length === 0) return '<p class="empty">No response time data</p>';
    let q = {
        "2-10s": 0,
        "10-30s": 0,
        "30s-1m": 0,
        "1-2m": 0,
        "2-5m": 0,
        "5-15m": 0,
        ">15m": 0
    };
    for (let Y of A)
        if (Y < 10) q["2-10s"] = (q["2-10s"] ?? 0) + 1;
        else if (Y < 30) q["10-30s"] = (q["10-30s"] ?? 0) + 1;
    else if (Y < 60) q["30s-1m"] = (q["30s-1m"] ?? 0) + 1;
    else if (Y < 120) q["1-2m"] = (q["1-2m"] ?? 0) + 1;
    else if (Y < 300) q["2-5m"] = (q["2-5m"] ?? 0) + 1;
    else if (Y < 900) q["5-15m"] = (q["5-15m"] ?? 0) + 1;
    else q[">15m"] = (q[">15m"] ?? 0) + 1;
    let K = Math.max(...Object.values(q));
    if (K === 0) return '<p class="empty">No response time data</p>';
    return Object.entries(q).map(([Y, z]) => {
        let w = z / K * 100;
        return `<div class="bar-row">
        <div class="bar-label">${Y}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${w}%;background:#6366f1"></div></div>
        <div class="bar-value">${z}</div>
      </div>`
    }).join(`
`)
}
// @from(Ln 434784, Col 0)
function q9z(A) {
    if (A.length === 0) return '<p class="empty">No time data</p>';
    let q = [{
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
        K = {};
    for (let H of A) K[H] = (K[H] || 0) + 1;
    let Y = q.map((H) => ({
            label: H.label,
            count: H.range.reduce(($, O) => $ + (K[O] || 0), 0)
        })),
        z = Math.max(...Y.map((H) => H.count)) || 1;
    return `<div id="hour-histogram">${Y.map((H)=>`
      <div class="bar-row">
        <div class="bar-label">${H.label}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${H.count/z*100}%;background:#8b5cf6"></div></div>
        <div class="bar-value">${H.count}</div>
      </div>`).join(`
`)}</div>`
}
// @from(Ln 434815, Col 0)
function K9z(A) {
    let q = {};
    for (let K of A) q[K] = (q[K] || 0) + 1;
    return Q1(q)
}
// @from(Ln 434821, Col 0)
function Y9z(A, q) {
    let K = (S) => {
            if (!S) return "";
            return S.split(`

`).map((m) => {
                let b = T9(m);
                return b = b.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"), b = b.replace(/^- /gm, "• "), b = b.replace(/\n/g, "<br>"), `<p>${b}</p>`
            }).join(`
`)
        },
        Y = q.at_a_glance,
        z = Y ? `
    <div class="at-a-glance">
      <div class="glance-title">At a Glance</div>
      <div class="glance-sections">
        ${Y.whats_working?`<div class="glance-section"><strong>What's working:</strong> ${KT6(Y.whats_working)} <a href="#section-wins" class="see-more">Impressive Things You Did →</a></div>`:""}
        ${Y.whats_hindering?`<div class="glance-section"><strong>What's hindering you:</strong> ${KT6(Y.whats_hindering)} <a href="#section-friction" class="see-more">Where Things Go Wrong →</a></div>`:""}
        ${Y.quick_wins?`<div class="glance-section"><strong>Quick wins to try:</strong> ${KT6(Y.quick_wins)} <a href="#section-features" class="see-more">Features to Try →</a></div>`:""}
        ${Y.ambitious_workflows?`<div class="glance-section"><strong>Ambitious workflows:</strong> ${KT6(Y.ambitious_workflows)} <a href="#section-horizon" class="see-more">On the Horizon →</a></div>`:""}
      </div>
    </div>
    ` : "",
        w = q.project_areas?.areas || [],
        H = w.length > 0 ? `
    <h2 id="section-work">What You Work On</h2>
    <div class="project-areas">
      ${w.map((S)=>`
        <div class="project-area">
          <div class="area-header">
            <span class="area-name">${T9(S.name)}</span>
            <span class="area-count">~${S.session_count} sessions</span>
          </div>
          <div class="area-desc">${T9(S.description)}</div>
        </div>
      `).join("")}
    </div>
    ` : "",
        $ = q.interaction_style,
        O = $?.narrative ? `
    <h2 id="section-usage">How You Use Claude Code</h2>
    <div class="narrative">
      ${K($.narrative)}
      ${$.key_pattern?`<div class="key-insight"><strong>Key pattern:</strong> ${T9($.key_pattern)}</div>`:""}
    </div>
    ` : "",
        _ = q.what_works,
        J = _?.impressive_workflows && _.impressive_workflows.length > 0 ? `
    <h2 id="section-wins">Impressive Things You Did</h2>
    ${_.intro?`<p class="section-intro">${T9(_.intro)}</p>`:""}
    <div class="big-wins">
      ${_.impressive_workflows.map((S)=>`
        <div class="big-win">
          <div class="big-win-title">${T9(S.title||"")}</div>
          <div class="big-win-desc">${T9(S.description||"")}</div>
        </div>
      `).join("")}
    </div>
    ` : "",
        X = q.friction_analysis,
        D = X?.categories && X.categories.length > 0 ? `
    <h2 id="section-friction">Where Things Go Wrong</h2>
    ${X.intro?`<p class="section-intro">${T9(X.intro)}</p>`:""}
    <div class="friction-categories">
      ${X.categories.map((S)=>`
        <div class="friction-category">
          <div class="friction-title">${T9(S.category||"")}</div>
          <div class="friction-desc">${T9(S.description||"")}</div>
          ${S.examples?`<ul class="friction-examples">${S.examples.map((m)=>`<li>${T9(m)}</li>`).join("")}</ul>`:""}
        </div>
      `).join("")}
    </div>
    ` : "",
        j = q.suggestions,
        M = j ? `
    ${j.claude_md_additions&&j.claude_md_additions.length>0?`
    <h2 id="section-features">Existing CC Features to Try</h2>
    <div class="claude-md-section">
      <h3>Suggested CLAUDE.md Additions</h3>
      <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Just copy this into Claude Code to add it to your CLAUDE.md.</p>
      <div class="claude-md-actions">
        <button class="copy-all-btn" onclick="copyAllCheckedClaudeMd()">Copy All Checked</button>
      </div>
      ${j.claude_md_additions.map((S,m)=>`
        <div class="claude-md-item">
          <input type="checkbox" id="cmd-${m}" class="cmd-checkbox" checked data-text="${T9(S.prompt_scaffold||S.where||"Add to CLAUDE.md")}\\n\\n${T9(S.addition)}">
          <label for="cmd-${m}">
            <code class="cmd-code">${T9(S.addition)}</code>
            <button class="copy-btn" onclick="copyCmdItem(${m})">Copy</button>
          </label>
          <div class="cmd-why">${T9(S.why)}</div>
        </div>
      `).join("")}
    </div>
    `:""}
    ${j.features_to_try&&j.features_to_try.length>0?`
    <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Just copy this into Claude Code and it'll set it up for you.</p>
    <div class="features-section">
      ${j.features_to_try.map((S)=>`
        <div class="feature-card">
          <div class="feature-title">${T9(S.feature||"")}</div>
          <div class="feature-oneliner">${T9(S.one_liner||"")}</div>
          <div class="feature-why"><strong>Why for you:</strong> ${T9(S.why_for_you||"")}</div>
          ${S.example_code?`
          <div class="feature-examples">
            <div class="feature-example">
              <div class="example-code-row">
                <code class="example-code">${T9(S.example_code)}</code>
                <button class="copy-btn" onclick="copyText(this)">Copy</button>
              </div>
            </div>
          </div>
          `:""}
        </div>
      `).join("")}
    </div>
    `:""}
    ${j.usage_patterns&&j.usage_patterns.length>0?`
    <h2 id="section-patterns">New Ways to Use Claude Code</h2>
    <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Just copy this into Claude Code and it'll walk you through it.</p>
    <div class="patterns-section">
      ${j.usage_patterns.map((S)=>`
        <div class="pattern-card">
          <div class="pattern-title">${T9(S.title||"")}</div>
          <div class="pattern-summary">${T9(S.suggestion||"")}</div>
          ${S.detail?`<div class="pattern-detail">${T9(S.detail)}</div>`:""}
          ${S.copyable_prompt?`
          <div class="copyable-prompt-section">
            <div class="prompt-label">Paste into Claude Code:</div>
            <div class="copyable-prompt-row">
              <code class="copyable-prompt">${T9(S.copyable_prompt)}</code>
              <button class="copy-btn" onclick="copyText(this)">Copy</button>
            </div>
          </div>
          `:""}
        </div>
      `).join("")}
    </div>
    `:""}
    ` : "",
        P = q.on_the_horizon,
        W = P?.opportunities && P.opportunities.length > 0 ? `
    <h2 id="section-horizon">On the Horizon</h2>
    ${P.intro?`<p class="section-intro">${T9(P.intro)}</p>`:""}
    <div class="horizon-section">
      ${P.opportunities.map((S)=>`
        <div class="horizon-card">
          <div class="horizon-title">${T9(S.title||"")}</div>
          <div class="horizon-possible">${T9(S.whats_possible||"")}</div>
          ${S.how_to_try?`<div class="horizon-tip"><strong>Getting started:</strong> ${T9(S.how_to_try)}</div>`:""}
          ${S.copyable_prompt?`<div class="pattern-prompt"><div class="prompt-label">Paste into Claude Code:</div><code>${T9(S.copyable_prompt)}</code><button class="copy-btn" onclick="copyText(this)">Copy</button></div>`:""}
        </div>
      `).join("")}
    </div>
    ` : "",
        G = [],
        f = [],
        Z = G.length > 0 || f.length > 0 ? `
    <h2 id="section-feedback" class="feedback-header">Closing the Loop: Feedback for Other Teams</h2>
    <p class="feedback-intro">Suggestions for the CC product and model teams based on your usage patterns. Click to expand.</p>
    ${G.length>0?`
    <div class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapsible(this)">
        <span class="collapsible-arrow">▶</span>
        <h3>Product Improvements for CC Team</h3>
      </div>
      <div class="collapsible-content">
        <div class="suggestions-section">
          ${G.map((S)=>`
            <div class="feedback-card team-card">
              <div class="feedback-title">${T9(S.title||"")}</div>
              <div class="feedback-detail">${T9(S.detail||"")}</div>
              ${S.evidence?`<div class="feedback-evidence"><em>Evidence:</em> ${T9(S.evidence)}</div>`:""}
            </div>
          `).join("")}
        </div>
      </div>
    </div>
    `:""}
    ${f.length>0?`
    <div class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapsible(this)">
        <span class="collapsible-arrow">▶</span>
        <h3>Model Behavior Improvements</h3>
      </div>
      <div class="collapsible-content">
        <div class="suggestions-section">
          ${f.map((S)=>`
            <div class="feedback-card model-card">
              <div class="feedback-title">${T9(S.title||"")}</div>
              <div class="feedback-detail">${T9(S.detail||"")}</div>
              ${S.evidence?`<div class="feedback-evidence"><em>Evidence:</em> ${T9(S.evidence)}</div>`:""}
            </div>
          `).join("")}
        </div>
      </div>
    </div>
    `:""}
    ` : "",
        N = q.fun_ending,
        T = N?.headline ? `
    <div class="fun-ending">
      <div class="fun-headline">"${T9(N.headline)}"</div>
      ${N.detail?`<div class="fun-detail">${T9(N.detail)}</div>`:""}
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
        B = `
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
    const rawHourCounts = ${K9z(A.message_hours)};
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
      const offset = parseInt(this.value) + 8;
      updateHourHistogram(offset);
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
    <p class="subtitle">${A.total_messages.toLocaleString()} messages across ${A.total_sessions} sessions${A.total_sessions_scanned&&A.total_sessions_scanned>A.total_sessions?` (${A.total_sessions_scanned.toLocaleString()} total)`:""} | ${A.date_range.start} to ${A.date_range.end}</p>

    ${z}

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
      <div class="stat"><div class="stat-value">${A.total_messages.toLocaleString()}</div><div class="stat-label">Messages</div></div>
      <div class="stat"><div class="stat-value">+${A.total_lines_added.toLocaleString()}/-${A.total_lines_removed.toLocaleString()}</div><div class="stat-label">Lines</div></div>
      <div class="stat"><div class="stat-value">${A.total_files_modified}</div><div class="stat-label">Files</div></div>
      <div class="stat"><div class="stat-value">${A.days_active}</div><div class="stat-label">Days</div></div>
      <div class="stat"><div class="stat-value">${A.messages_per_day}</div><div class="stat-label">Msgs/Day</div></div>
    </div>

    ${H}

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">What You Wanted</div>
        ${yc(A.goal_categories,"#2563eb")}
      </div>
      <div class="chart-card">
        <div class="chart-title">Top Tools Used</div>
        ${yc(A.tool_counts,"#0891b2")}
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">Languages</div>
        ${yc(A.languages,"#10b981")}
      </div>
      <div class="chart-card">
        <div class="chart-title">Session Types</div>
        ${yc(A.session_types||{},"#8b5cf6")}
      </div>
    </div>

    ${O}

    <!-- Response Time Distribution -->
    <div class="chart-card" style="margin: 24px 0;">
      <div class="chart-title">User Response Time Distribution</div>
      ${A9z(A.user_response_times)}
      <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
        Median: ${A.median_response_time.toFixed(1)}s &bull; Average: ${A.avg_response_time.toFixed(1)}s
      </div>
    </div>

    <!-- Multi-clauding Section (matching Python reference) -->
    <div class="chart-card" style="margin: 24px 0;">
      <div class="chart-title">Multi-Clauding (Parallel Sessions)</div>
      ${A.multi_clauding.overlap_events===0?`
        <p style="font-size: 14px; color: #64748b; padding: 8px 0;">
          No parallel session usage detected. You typically work with one Claude Code session at a time.
        </p>
      `:`
        <div style="display: flex; gap: 24px; margin: 12px 0;">
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #7c3aed;">${A.multi_clauding.overlap_events}</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Overlap Events</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #7c3aed;">${A.multi_clauding.sessions_involved}</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Sessions Involved</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #7c3aed;">${A.total_messages>0?Math.round(100*A.multi_clauding.user_messages_during/A.total_messages):0}%</div>
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
        ${q9z(A.message_hours)}
      </div>
      <div class="chart-card">
        <div class="chart-title">Tool Errors Encountered</div>
        ${Object.keys(A.tool_error_categories).length>0?yc(A.tool_error_categories,"#dc2626"):'<p class="empty">No tool errors</p>'}
      </div>
    </div>

    ${J}

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">What Helped Most (Claude's Capabilities)</div>
        ${yc(A.success,"#16a34a")}
      </div>
      <div class="chart-card">
        <div class="chart-title">Outcomes</div>
        ${yc(A.outcomes,"#8b5cf6",6,e5z)}
      </div>
    </div>

    ${D}

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">Primary Friction Types</div>
        ${yc(A.friction,"#dc2626")}
      </div>
      <div class="chart-card">
        <div class="chart-title">Inferred Satisfaction (model-estimated)</div>
        ${yc(A.satisfaction,"#eab308",6,t5z)}
      </div>
    </div>

    ${M}

    ${W}

    ${T}

    ${Z}
  </div>
  <script>${B}</script>
</body>
</html>`
}
// @from(Ln 435504, Col 0)
async function z9z() {
    let A = b1(),
        q = oI(),
        K;
    try {
        K = A.readdirSync(q)
    } catch {
        return []
    }
    let Y = K.filter((w) => w.isDirectory()).map((w) => Cc(q, w.name)),
        z = [];
    for (let w = 0; w < Y.length; w++) {
        let H = Rd1(Y[w]);
        for (let [$, O] of H) z.push({
            sessionId: $,
            path: O.path,
            mtime: O.mtime,
            size: O.size
        });
        if (w % 10 === 9) await new Promise(($) => setImmediate($))
    }
    return z.sort((w, H) => H.mtime - w.mtime), z
}
// @from(Ln 435527, Col 0)
async function w9z(A) {
    let q, K = await z9z(),
        Y = K.length,
        z = 50,
        w = 200,
        H = [],
        $ = [];
    for (let m = 0; m < K.length; m += z) {
        let b = K.slice(m, m + z),
            g = await Promise.all(b.map(async (U) => ({
                sessionInfo: U,
                cached: await l5z(U.sessionId)
            })));
        for (let {
                sessionInfo: U,
                cached: x
            }
            of g)
            if (x) H.push(x);
            else if ($.length < w) $.push(U)
    }
    let O = new Map,
        _ = (m) => {
            for (let b of m.messages.slice(0, 5))
                if (b.type === "user" && b.message) {
                    let g = b.message.content;
                    if (typeof g === "string") {
                        if (g.includes("RESPOND WITH ONLY A VALID JSON OBJECT") || g.includes("record_facets")) return !0
                    }
                } return !1
        },
        J = 10;
    for (let m = 0; m < $.length; m += J) {
        let b = $.slice(m, m + J),
            g = await Promise.all(b.map(async (U) => {
                try {
                    return await HT6(U.path)
                } catch {
                    return []
                }
            }));
        for (let U of g)
            for (let x of U) {
                if (_(x) || !F5z(x)) continue;
                let p = FBA(x);
                H.push(p), i5z(p), O.set(p.session_id, x)
            }
    }
    let X = new Map;
    for (let m of H) {
        let b = X.get(m.session_id);
        if (!b || m.user_message_count > b.user_message_count || m.user_message_count === b.user_message_count && m.duration_minutes > b.duration_minutes) X.set(m.session_id, m)
    }
    let D = new Set(X.keys());
    H = [...X.values()];
    for (let m of O.keys())
        if (!D.has(m)) O.delete(m);
    H.sort((m, b) => b.start_time.localeCompare(m.start_time));
    let j = (m) => {
            if (m.user_message_count < 2) return !1;
            if (m.duration_minutes < 1) return !1;
            return !0
        },
        M = H.filter(j),
        P = new Map,
        W = [],
        G = 50;
    for (let m of M) {
        let b = m.session_id,
            g = d5z(b);
        if (g) P.set(b, g);
        else {
            let U = O.get(b);
            if (U && W.length < G) W.push({
                log: U,
                sessionId: b
            })
        }
    }
    let f = 50;
    for (let m = 0; m < W.length; m += f) {
        let b = W.slice(m, m + f),
            g = await Promise.all(b.map(async ({
                log: U,
                sessionId: x
            }) => {
                let p = await n5z(U, x);
                return {
                    sessionId: x,
                    newFacets: p
                }
            }));
        for (let {
                sessionId: U,
                newFacets: x
            }
            of g)
            if (x) P.set(U, x), c5z(x)
    }
    let Z = (m) => {
            let b = P.get(m);
            if (!b) return !1;
            let g = b.goal_categories,
                U = H9z(g).filter((x) => (g[x] ?? 0) > 0);
            return U.length === 1 && U[0] === "warmup_minimal"
        },
        N = M.filter((m) => !Z(m.session_id)),
        T = new Map;
    for (let [m, b] of P)
        if (!Z(m)) T.set(m, b);
    let k = o5z(N, T);
    k.total_sessions_scanned = Y;
    let y = await s5z(k, P),
        B = Y9z(k, y);
    try {
        b1().mkdirSync(YT6)
    } catch {}
    let S = Cc(YT6, "report.html");
    return c8(S, B, {
        encoding: "utf-8",
        flush: !0,
        mode: 384
    }), {
        insights: y,
        htmlPath: S,
        data: k,
        remoteStats: q,
        facets: T
    }
}
// @from(Ln 435658, Col 0)
function BBA(A) {
    return A ? Object.entries(A) : []
}
// @from(Ln 435662, Col 0)
function H9z(A) {
    return A ? Object.keys(A) : []
}
// @from(Ln 435666, Col 0)
function VOq(A) {
    if (!A || typeof A !== "object") return !1;
    let q = A;
    return typeof q.underlying_goal === "string" && typeof q.outcome === "string" && typeof q.brief_summary === "string" && q.goal_categories !== null && typeof q.goal_categories === "object" && q.user_satisfaction_counts !== null && typeof q.user_satisfaction_counts === "object" && q.friction_counts !== null && typeof q.friction_counts === "object"
}
// @from(Ln 435671, Col 4)
x5z
// @from(Ln 435671, Col 9)
b5z
// @from(Ln 435671, Col 14)
YT6
// @from(Ln 435671, Col 19)
zT6
// @from(Ln 435671, Col 24)
mBA
// @from(Ln 435671, Col 29)
u5z = `Analyze this Claude Code session and extract structured facets.

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
// @from(Ln 435698, Col 4)
g5z = `Summarize this portion of a Claude Code session transcript. Focus on:
1. What the user asked for
2. What Claude did (tools used, files modified)
3. Any friction or issues
4. The outcome

Keep it concise - 3-5 sentences. Preserve specific details like file names, error messages, and user feedback.

TRANSCRIPT CHUNK:
`
// @from(Ln 435708, Col 4)
a5z
// @from(Ln 435708, Col 9)
t5z
// @from(Ln 435708, Col 14)
e5z
// @from(Ln 435708, Col 19)
$9z
// @from(Ln 435708, Col 24)
NOq
// @from(Ln 435709, Col 4)
TOq = v(() => {
    lq();
    e7();
    _8();
    m6();
    hA();
    y6();
    yw();
    m6();
    Pq1();
    v3();
    x5z = {
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
    }, b5z = {
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
    }, YT6 = Cc(O8(), "usage-data"), zT6 = Cc(YT6, "facets"), mBA = Cc(YT6, "session-meta");
    a5z = [{
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
    t5z = ["frustrated", "dissatisfied", "likely_satisfied", "satisfied", "happy", "unsure"], e5z = ["not_achieved", "partially_achieved", "mostly_achieved", "fully_achieved", "unclear_from_transcript"];
    $9z = {
        type: "prompt",
        name: "insights",
        description: "Generate a report analyzing your Claude Code sessions",
        contentLength: 0,
        isEnabled: () => !0,
        isHidden: !1,
        progressMessage: "analyzing your sessions",
        source: "builtin",
        async getPromptForCommand(A) {
            u8("insights");
            let q = !1,
                K = [],
                Y = !1,
                {
                    insights: z,
                    htmlPath: w,
                    data: H,
                    remoteStats: $
                } = await w9z({
                    collectRemote: q
                }),
                O = `file://${w}`,
                _ = "",
                X = [H.total_sessions_scanned && H.total_sessions_scanned > H.total_sessions ? `${H.total_sessions_scanned.toLocaleString()} sessions total · ${H.total_sessions} analyzed` : `${H.total_sessions} sessions`, `${H.total_messages.toLocaleString()} messages`, `${Math.round(H.total_duration_hours)}h`, `${H.git_commits} commits`].join(" · "),
                D = "",
                j = z.at_a_glance,
                M = j ? `## At a Glance

${j.whats_working?`**What's working:** ${j.whats_working} See _Impressive Things You Did_.`:""}

${j.whats_hindering?`**What's hindering you:** ${j.whats_hindering} See _Where Things Go Wrong_.`:""}

${j.quick_wins?`**Quick wins to try:** ${j.quick_wins} See _Features to Try_.`:""}

${j.ambitious_workflows?`**Ambitious workflows:** ${j.ambitious_workflows} See _On the Horizon_.`:""}` : "_No insights generated_",
                W = `${`# Claude Code Insights

${X}
${H.date_range.start} to ${H.date_range.end}
${D}
`}${M}

Your full shareable insights report is ready: ${O}${_}`;
            return [{
                type: "text",
                text: `The user just ran /insights to generate a usage report analyzing their Claude Code sessions.

Here is the full insights data:
${Q1(z,null,2)}

Report URL: ${O}
HTML file: ${w}
Facets directory: ${zT6}

Here is what the user sees:
${W}

Now output the following message exactly:

<message>
Your shareable insights report is ready:
${O}${_}

Want to dig into any section or try one of the suggestions?
</message>`
            }]
        },
        userFacingName() {
            return "insights"
        }
    };
    NOq = $9z
})
// @from(Ln 435989, Col 4)
vOq = () => {}
// @from(Ln 435990, Col 0)
async function O9z() {
    try {
        return (await op1())?.eligible ? [ezq] : []
    } catch (A) {
        return []
    }
}
// @from(Ln 435997, Col 0)
async function _9z(A) {
    try {
        let [q, K] = await Promise.all([ukA(A).catch((z) => {
            return K1(z instanceof Error ? z : Error("Failed to load skill directory commands")), h("Skill directory commands failed to load, continuing without them"), []
        }), B0A().catch((z) => {
            return K1(z instanceof Error ? z : Error("Failed to load plugin skills")), h("Plugin skills failed to load, continuing without them"), []
        })]), Y = nHq();
        return h(`getSkills returning: ${q.length} skill dir commands, ${K.length} plugin skills, ${Y.length} bundled skills`), {
            skillDirCommands: q,
            pluginSkills: K,
            bundledSkills: Y
        }
    } catch (q) {
        return K1(q instanceof Error ? q : Error("Unexpected error loading skills")), h("Unexpected error in getSkills, returning empty"), {
            skillDirCommands: [],
            pluginSkills: [],
            bundledSkills: []
        }
    }
}
// @from(Ln 436018, Col 0)
function UBA() {
    cZ.cache?.clear?.(), hv.cache?.clear?.(), aO6.cache?.clear?.()
}
// @from(Ln 436022, Col 0)
function bm() {
    UBA(), dO6(), EU7(), BP6()
}
// @from(Ln 436026, Col 0)
function yOq(A) {
    return A.filter((q) => pBA.has(q))
}
// @from(Ln 436030, Col 0)
function Sd(A, q) {
    return q.some((K) => K.name === A || K.userFacingName() === A || K.aliases?.includes(A))
}
// @from(Ln 436034, Col 0)
function zI(A, q) {
    let K = q.find((Y) => Y.name === A || Y.userFacingName() === A || Y.aliases?.includes(A));
    if (!K) throw ReferenceError(`Command ${A} not found. Available commands: ${q.map((Y)=>{let z=Y.userFacingName();return Y.aliases?`${z} (aliases: ${Y.aliases.join(", ")})`:z}).sort((Y,z)=>Y.localeCompare(z)).join(", ")}`);
    return K
}
// @from(Ln 436040, Col 0)
function jZ1(A) {
    if (A.type !== "prompt") return A.description;
    if (A.source === "plugin") {
        let q = A.pluginInfo?.pluginManifest.name;
        if (q) return `(${q}) ${A.description}`;
        return `${A.description} (plugin)`
    }
    if (A.source === "builtin" || A.source === "mcp") return A.description;
    if (A.source === "bundled") return `${A.description} (bundled)`;
    return `${A.description} (${vi(A.source)})`
}
// @from(Ln 436051, Col 4)
EOq = null
// @from(Ln 436052, Col 4)
kOq = null
// @from(Ln 436053, Col 4)
LOq = null
// @from(Ln 436054, Col 4)
ROq = null
// @from(Ln 436055, Col 4)
QBA
// @from(Ln 436055, Col 9)
Cd
// @from(Ln 436055, Col 13)
cZ
// @from(Ln 436055, Col 17)
hv
// @from(Ln 436055, Col 21)
aO6
// @from(Ln 436055, Col 26)
pBA
// @from(Ln 436056, Col 4)
c$ = v(() => {
    s6q();
    t6q();
    e6q();
    zAq();
    wAq();
    HAq();
    PAq();
    lAq();
    rAq();
    oAq();
    tAq();
    eAq();
    A8q();
    z8q();
    D7q();
    E7q();
    R7q();
    y7q();
    C7q();
    i7q();
    n7q();
    z4q();
    j4q();
    v4q();
    k4q();
    L4q();
    h4q();
    x4q();
    u4q();
    yqq();
    xqq();
    bqq();
    LKq();
    b5q();
    u5q();
    B5q();
    F5q();
    r5q();
    t5q();
    NYq();
    HuA();
    EYq();
    kYq();
    hYq();
    uYq();
    eYq();
    Azq();
    zzq();
    Hzq();
    TV6();
    _zq();
    Dzq();
    Pzq();
    Vzq();
    kzq();
    Fzq();
    Uzq();
    rzq();
    A2q();
    Pc();
    O2q();
    b2q();
    F2q();
    p2q();
    cwq();
    rwq();
    twq();
    ewq();
    AHq();
    qHq();
    KHq();
    YHq();
    WHq();
    pHq();
    lHq();
    y6();
    Z6();
    Zt();
    nI();
    Bu1();
    zq();
    J7();
    _BA();
    _$q();
    j$q();
    Z$q();
    T$q();
    S$q();
    WBA();
    YQ1();
    B$q();
    m$q();
    F$q();
    GOq();
    TOq();
    vOq();
    E$();
    QBA = KA(() => [a6q, dwq, dhA, UHq, fIA, NIA, Y8q, X7q, TIA, T7q, v7q, sIA, l7q, Vd1, nzq, m2q, U2q, XxA, T4q, E4q, jxA, Rqq, Iqq, kKq, Y4q, bbA, D$q, N$q, C$q, nwq, m5q, n5q, s5q, VYq, $uA, SYq, WOq, bYq, GBA, $BA, G$q, WuA, Yzq, ohA, NN6, swq, wzq, E91, dN6, os, u$q, PuA, NOq, GuA, ...EOq ? [EOq] : [], ...kOq ? [kOq] : [], ...LOq ? [LOq] : [], ...ROq ? [ROq] : [], fzq, Ezq, mzq, TuA, $2q, x2q, O$q, PHq, ...!cC() ? [b4q, I4q()] : [], tYq, ...[]]), Cd = KA(() => new Set(QBA().map((A) => A.name)));
    cZ = KA(async (A) => {
        let [{
            skillDirCommands: q,
            pluginSkills: K,
            bundledSkills: Y
        }, z, w] = await Promise.all([_9z(A), YK1(), O9z()]), H = iF4(), $ = [...Y, ...q, ...z, ...K, ...w, ...QBA()].filter((D) => D.isEnabled());
        if (H.length === 0) return $;
        let O = new Set($.map((D) => D.name)),
            _ = H.filter((D) => !O.has(D.name) && D.isEnabled());
        if (_.length === 0) return $;
        let J = new Set(QBA().map((D) => D.name)),
            X = $.findIndex((D) => J.has(D.name));
        if (X === -1) return [...$, ..._];
        return [...$.slice(0, X), ..._, ...$.slice(X)]
    });
    hv = KA(async (A) => {
        return (await cZ(A)).filter((K) => K.type === "prompt" && !K.disableModelInvocation && K.source !== "builtin" && (K.loadedFrom === "bundled" || K.loadedFrom === "commands_DEPRECATED" || K.hasUserSpecifiedDescription || K.whenToUse))
    }), aO6 = KA(async (A) => {
        try {
            return (await cZ(A)).filter((K) => K.type === "prompt" && K.source !== "builtin" && (K.hasUserSpecifiedDescription || K.whenToUse) && (K.loadedFrom === "skills" || K.loadedFrom === "plugin" || K.loadedFrom === "bundled" || K.disableModelInvocation))
        } catch (q) {
            return K1(q instanceof Error ? q : Error("Failed to load slash command skills")), h("Returning empty skills array due to load failure"), []
        }
    }), pBA = new Set([$uA, Vd1, fIA, XxA, WuA, NIA, GuA, sIA, PuA, TIA, dhA, ohA, TuA, jxA, GBA, $BA, bbA])
})
// @from(Ln 436180, Col 4)
dBA = "Sleep"
// @from(Ln 436181, Col 4)
WN$
// @from(Ln 436182, Col 4)
cBA = v(() => {
    vz();
    WN$ = `Wait for a specified duration. The user can interrupt the sleep at any time.

Use this when the user tells you to sleep or rest, when you have nothing to do, or when you're waiting for something.

You may receive <${JC}> prompts — these are periodic check-ins. Look for useful work to do before sleeping.

You can call this concurrently with other tools — it won't interfere with them.

Prefer this over \`Bash(sleep ...)\` — it doesn't hold a shell process.

Each wake-up costs an API call, but the prompt cache expires after 5 minutes of inactivity — balance accordingly.`
})
// @from(Ln 436196, Col 0)
async function X9z() {
    if (!i8()) return null;
    let A = `${P4().BASE_API_URL}/api/oauth/claude_cli/client_data`,
        q = a4()?.accessToken ?? null,
        K = () => {
            let Y = DH();
            if (Y.error) throw Error(`Auth error: ${Y.error}`);
            let z = {
                "Content-Type": "application/json",
                "User-Agent": XH(),
                ...Y.headers
            };
            return sA.get(A, {
                headers: z,
                timeout: 5000
            }).then((w) => w.data.client_data ?? null)
        };
    try {
        return await K()
    } catch (Y) {
        if (sA.isAxiosError(Y) && Y.response?.status === 401 && q) {
            if (await EO1(q)) return await K()
        }
        throw Y
    }
}
// @from(Ln 436222, Col 0)
async function j9z() {
    try {
        let A = await D9z(),
            q = {
                data: A,
                timestamp: Date.now()
            };
        return jA((K) => ({
            ...K,
            clientDataCache: q
        })), A
    } catch (A) {
        return K1(A), null
    }
}
// @from(Ln 436238, Col 0)
function M9z(A) {
    if (!A) return null;
    let q = A.system_prompt_variant;
    return typeof q === "string" ? q : null
}
// @from(Ln 436244, Col 0)
function COq() {
    j9z();
    try {
        let A = f6().clientDataCache;
        return A ? M9z(A.data) : null
    } catch {
        return null
    }
}
// @from(Ln 436253, Col 4)
J9z = 3600000
// @from(Ln 436254, Col 4)
D9z
// @from(Ln 436255, Col 4)
SOq = v(() => {
    y5();
    Rw1();
    B0();
    y6();
    cA();
    Uz();
    J7();
    D9z = Lw1(X9z, J9z)
})
// @from(Ln 436265, Col 4)
$T6 = "IMPORTANT: Assist with authorized security testing, defensive security, CTF challenges, and educational contexts. Refuse requests for destructive techniques, DoS attacks, mass targeting, supply chain compromise, or detection evasion for malicious purposes. Dual-use security tools (C2 frameworks, credential testing, exploit development) require clear authorization context: pentesting engagements, CTF competitions, security research, or defensive use cases."