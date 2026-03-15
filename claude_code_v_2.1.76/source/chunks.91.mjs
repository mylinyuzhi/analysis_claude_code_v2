
// @from(Ln 236528, Col 4)
ct = E(() => {
    jY4 = {
        markdown: `
Preview feature:
Use the optional \`preview\` field on options when presenting concrete artifacts that users need to visually compare:
- ASCII mockups of UI layouts or components
- Code snippets showing different implementations
- Diagram variations
- Configuration examples

Preview content is rendered as markdown in a monospace box. Multi-line text with newlines is supported. When any option has a preview, the UI switches to a side-by-side layout with a vertical option list on the left and preview on the right. Do not use previews for simple preference questions where labels and descriptions suffice. Note: previews are only supported for single-select questions (not multiSelect).
`,
        html: `
Preview feature:
Use the optional \`preview\` field on options when presenting concrete artifacts that users need to visually compare:
- HTML mockups of UI layouts or components
- Formatted code snippets showing different implementations
- Visual comparisons or diagrams

Preview content must be a self-contained HTML fragment (no <html>/<body> wrapper, no <script> or <style> tags — use inline style attributes instead). Do not use previews for simple preference questions where labels and descriptions suffice. Note: previews are only supported for single-select questions (not multiSelect).
`
    }, yV8 = `Use this tool when you need to ask the user questions during execution. This allows you to:
1. Gather user preferences or requirements
2. Clarify ambiguous instructions
3. Get decisions on implementation choices as you work
4. Offer choices to the user about what direction to take.

Usage notes:
- Users will always be able to select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers to be selected for a question
- If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label

Plan mode note: In plan mode, use this tool to clarify requirements or choose between approaches BEFORE finalizing your plan. Do NOT use this tool to ask "Is my plan ready?" or "Should I proceed?" - use ${Uk} for plan approval. IMPORTANT: Do not reference "the plan" in your questions (e.g., "Do you have feedback about the plan?", "Does the plan look good?") because the user cannot see the plan in the UI until you call ${Uk}. If you need plan approval, use ${Uk} instead.
`
})
// @from(Ln 236563, Col 4)
hI = "SendMessage"
// @from(Ln 236564, Col 4)
lt = "TaskGet"
// @from(Ln 236565, Col 4)
it = "TaskList"
// @from(Ln 236567, Col 0)
function DY4(A) {
    return A.isNonInteractiveSession
}
// @from(Ln 236571, Col 0)
function aP1(A) {
    let q = JY4.get(A);
    if (q) return q;
    let K = yB9(A);
    return JY4.set(A, K), K
}
// @from(Ln 236578, Col 0)
function yB9(A) {
    try {
        let q = new MY4.Ajv({
            allErrors: !0
        });
        if (!q.validateSchema(A)) return {
            error: q.errorsText(q.errors)
        };
        let Y = q.compile(A);
        return {
            tool: {
                ...LV8,
                inputJSONSchema: A,
                async call(z) {
                    if (!Y(z)) {
                        let w = Y.errors?.map((O) => `${O.instancePath||"root"}: ${O.message}`).join(", ");
                        throw Error(`Output does not match required schema: ${w}`)
                    }
                    return {
                        data: "Structured output provided successfully",
                        structured_output: z
                    }
                }
            }
        }
    } catch (q) {
        return {
            error: q instanceof Error ? q.message : String(q)
        }
    }
}
// @from(Ln 236609, Col 4)
MY4
// @from(Ln 236609, Col 9)
kB9
// @from(Ln 236609, Col 14)
EB9
// @from(Ln 236609, Col 19)
oM = "StructuredOutput"
// @from(Ln 236610, Col 4)
LV8
// @from(Ln 236610, Col 9)
JY4
// @from(Ln 236611, Col 4)
BB = E(() => {
    K7();
    g1();
    MY4 = t(N11(), 1), kB9 = F6(() => C.object({}).passthrough()), EB9 = F6(() => C.string().describe("Structured output tool result"));
    LV8 = {
        isMcp: !1,
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput() {
            return ""
        },
        isDestructive() {
            return !1
        },
        isOpenWorld() {
            return !1
        },
        name: oM,
        searchHint: "return the final response as structured JSON",
        maxResultSizeChars: 1e5,
        async description() {
            return "Return structured output in the requested format"
        },
        async prompt() {
            return "Use this tool to return your final response in the requested structured format. You MUST call this tool exactly once at the end of your response to provide the structured output."
        },
        get inputSchema() {
            return kB9()
        },
        get outputSchema() {
            return EB9()
        },
        async call(A) {
            return {
                data: "Structured output provided successfully",
                structured_output: A
            }
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage(A) {
            let q = Object.keys(A);
            if (q.length === 0) return null;
            if (q.length <= 3) return q.map((K) => `${K}: ${B6(A[K])}`).join(", ");
            return `${q.length} fields: ${q.slice(0,3).join(", ")}…`
        },
        userFacingName: () => oM,
        renderToolUseRejectedMessage() {
            return "Structured output rejected"
        },
        renderToolUseErrorMessage() {
            return "Structured output error"
        },
        renderToolUseProgressMessage() {
            return null
        },
        renderToolResultMessage(A) {
            return A
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: A
            }
        }
    }, JY4 = new WeakMap
})
// @from(Ln 236690, Col 4)
sP1 = "EnterWorktree"
// @from(Ln 236691, Col 4)
tP1 = "ExitWorktree"
// @from(Ln 236692, Col 4)
XY4 = {}
// @from(Ln 236706, Col 0)
function kR() {
    return !t6(process.env.CLAUDE_CODE_DISABLE_CRON) && lk("tengu_kairos_cron", !0, LB9)
}
// @from(Ln 236709, Col 4)
LB9 = 300000
// @from(Ln 236710, Col 4)
ER = "CronCreate"
// @from(Ln 236711, Col 4)
ed = "CronDelete"
// @from(Ln 236712, Col 4)
SW6 = "CronList"
// @from(Ln 236713, Col 4)
RV8 = "Schedule a prompt to run at a future time — either recurring on a cron schedule, or once at a specific time. Session-only: the job dies when this Claude session ends."
// @from(Ln 236714, Col 4)
hV8
// @from(Ln 236714, Col 9)
SV8 = "Cancel a scheduled cron job by ID"
// @from(Ln 236715, Col 4)
CV8
// @from(Ln 236715, Col 9)
IV8 = "List scheduled cron jobs"
// @from(Ln 236716, Col 4)
bV8
// @from(Ln 236717, Col 4)
nt = E(() => {
    HA();
    A8();
    hV8 = `Schedule a prompt to be enqueued at a future time. Use for both recurring schedules and one-shot reminders.

Uses standard 5-field cron in the user's local timezone: minute hour day-of-month month day-of-week. "0 9 * * *" means 9am local — no timezone conversion needed.

## One-shot tasks (recurring: false)

For "remind me at X" or "at <time>, do Y" requests — fire once then auto-delete.
Pin minute/hour/day-of-month/month to specific values:
  "remind me at 2:30pm today to check the deploy" → cron: "30 14 <today_dom> <today_month> *", recurring: false
  "tomorrow morning, run the smoke test" → cron: "57 8 <tomorrow_dom> <tomorrow_month> *", recurring: false

## Recurring jobs (recurring: true, the default)

For "every N minutes" / "every hour" / "weekdays at 9am" requests:
  "*/5 * * * *" (every 5 min), "0 * * * *" (hourly), "0 9 * * 1-5" (weekdays at 9am local)

## Avoid the :00 and :30 minute marks when the task allows it

Every user who asks for "9am" gets \`0 9\`, and every user who asks for "hourly" gets \`0 *\` — which means requests from across the planet land on the API at the same instant. When the user's request is approximate, pick a minute that is NOT 0 or 30:
  "every morning around 9" → "57 8 * * *" or "3 9 * * *" (not "0 9 * * *")
  "hourly" → "7 * * * *" (not "0 * * * *")
  "in an hour or so, remind me to..." → pick whatever minute you land on, don't round

Only use minute 0 or 30 when the user names that exact time and clearly means it ("at 9:00 sharp", "at half past", coordinating with a meeting). When in doubt, nudge a few minutes early or late — the user will not notice, and the fleet will.

${`## Session-only

Jobs live only in this Claude session — nothing is written to disk, and the job is gone when Claude exits.`}

## Runtime behavior

Jobs only fire while the REPL is idle (not mid-query). ${""}The scheduler adds a small deterministic jitter on top of whatever you pick: recurring tasks fire up to 10% of their period late (max 15 min); one-shot tasks landing on :00 or :30 fire up to 90 s early. Picking an off-minute is still the bigger lever.

Recurring tasks auto-expire after 3 days — they fire one final time, then are deleted. This bounds session lifetime. Tell the user about the 3-day limit when scheduling recurring jobs.

Returns a job ID you can pass to ${ed}.`, CV8 = `Cancel a cron job previously scheduled with ${ER}. Removes it from the in-memory session store.`, bV8 = `List all cron jobs scheduled via ${ER} in this session.`
})
// @from(Ln 236757, Col 4)
CW6
// @from(Ln 236757, Col 9)
xV8
// @from(Ln 236757, Col 14)
eP1
// @from(Ln 236757, Col 19)
WY4
// @from(Ln 236758, Col 4)
kp6 = E(() => {
    ct();
    J_();
    cq6();
    uP();
    ZD6();
    Q$();
    pt();
    BB();
    nt();
    CW6 = new Set([$C, aJ, dt, r4, Fw, OC]), xV8 = new Set([...CW6]), eP1 = new Set([s7, jv, MB, N9, sO, qz, ...ZU, R4, _K, bJ, oH, oM, HZ, sP1, tP1]), WY4 = new Set([TR, lt, it, ck, hI, ER, ed, SW6])
})
// @from(Ln 236770, Col 4)
SI = "TeamCreate"
// @from(Ln 236771, Col 4)
l36 = "TeamDelete"
// @from(Ln 236773, Col 0)
function e2() {
    return !1
}
// @from(Ln 236776, Col 4)
Fv = E(() => {
    V1();
    A8();
    kp6();
    J_();
    BB()
})
// @from(Ln 236784, Col 0)
function eJ(A) {
    return A
}
// @from(Ln 236788, Col 0)
function X$(A) {
    return A
}
// @from(Ln 236792, Col 0)
function ZY4(A) {
    return A.includes("@") ? null : A
}
// @from(Ln 236795, Col 4)
A01 = "REPL"
// @from(Ln 236796, Col 4)
GY4
// @from(Ln 236797, Col 4)
uV8 = E(() => {
    GY4 = new Set(["Read", "Write", "Edit", "Glob", "Grep", "Bash", "NotebookEdit"])
})
// @from(Ln 236800, Col 4)
fY4 = {}
// @from(Ln 236808, Col 0)
function RB9(A) {
    let q = A;
    if (!q) return !1;
    if (q.path && JF6(q.path)) return !0;
    return !1
}
// @from(Ln 236815, Col 0)
function hB9(A, q) {
    if (A !== _K && A !== R4) return !1;
    let K = q,
        Y = K?.file_path ?? K?.path;
    return Y !== void 0 && JF6(Y)
}
// @from(Ln 236822, Col 0)
function SB9(A, q, K) {
    let Y = A.teamMemoryReadCount ?? 0,
        z = A.teamMemorySearchCount ?? 0,
        _ = A.teamMemoryWriteCount ?? 0;
    if (Y > 0) {
        let w = q ? K.length === 0 ? "Recalling" : "recalling" : K.length === 0 ? "Recalled" : "recalled";
        K.push(`${w} ${Y} team ${Y===1?"memory":"memories"}`)
    }
    if (z > 0) {
        let w = q ? K.length === 0 ? "Searching" : "searching" : K.length === 0 ? "Searched" : "searched";
        K.push(`${w} team memories`)
    }
    if (_ > 0) {
        let w = q ? K.length === 0 ? "Writing" : "writing" : K.length === 0 ? "Wrote" : "wrote";
        K.push(`${w} ${_} team ${_===1?"memory":"memories"}`)
    }
}
// @from(Ln 236839, Col 4)
TY4 = E(() => {
    Rk();
    Q$()
})
// @from(Ln 236844, Col 0)
function CB9(A) {
    let q = A;
    return q?.file_path ?? q?.path
}
// @from(Ln 236849, Col 0)
function IB9(A) {
    let q = A;
    if (!q) return !1;
    if (q.path) {
        if (Xp6(q.path) || OV8(q.path)) return !0
    }
    if (q.glob && W94(q.glob)) return !0;
    if (q.command && P94(q.command)) return !0;
    return !1
}
// @from(Ln 236860, Col 0)
function bB9(A, q) {
    if (A !== _K && A !== R4) return !1;
    let K = CB9(q);
    return K !== void 0 && Xp6(K)
}
// @from(Ln 236866, Col 0)
function i36(A, q, K) {
    if (A === A01) return {
        isCollapsible: !1,
        isSearch: !1,
        isRead: !1,
        isREPL: !0,
        isMemoryWrite: !1,
        isSnip: !1
    };
    if (bB9(A, q)) return {
        isCollapsible: !0,
        isSearch: !1,
        isRead: !1,
        isREPL: !1,
        isMemoryWrite: !0,
        isSnip: !1
    };
    let Y = dK(K, A);
    if (!Y?.isSearchOrReadCommand) return {
        isCollapsible: !1,
        isSearch: !1,
        isRead: !1,
        isREPL: !1,
        isMemoryWrite: !1,
        isSnip: !1
    };
    let z = Y.isSearchOrReadCommand(q);
    return {
        isCollapsible: z.isSearch || z.isRead,
        isSearch: z.isSearch,
        isRead: z.isRead,
        isREPL: !1,
        isMemoryWrite: !1,
        isSnip: !1
    }
}
// @from(Ln 236903, Col 0)
function yp6(A, q) {
    if (A?.type === "tool_use" && A.name) {
        let K = i36(A.name, A.input, q);
        if (K.isCollapsible || K.isREPL) return {
            isSearch: K.isSearch,
            isRead: K.isRead,
            isREPL: K.isREPL,
            isMemoryWrite: K.isMemoryWrite,
            isSnip: K.isSnip
        }
    }
    return null
}
// @from(Ln 236917, Col 0)
function q01(A, q, K) {
    return i36(A, q, K).isCollapsible
}
// @from(Ln 236921, Col 0)
function xB9(A, q) {
    if (A.type === "assistant") {
        let K = A.message.content[0],
            Y = yp6(K, q);
        if (Y && K?.type === "tool_use") return {
            name: K.name,
            input: K.input,
            ...Y
        }
    }
    if (A.type === "grouped_tool_use") {
        let K = A.messages[0]?.message.content[0],
            Y = yp6(K ? {
                type: "tool_use",
                name: A.toolName,
                input: K.input
            } : void 0, q);
        if (Y && K?.type === "tool_use") return {
            name: A.toolName,
            input: K.input,
            ...Y
        }
    }
    return null
}
// @from(Ln 236947, Col 0)
function uB9(A) {
    if (A.type === "assistant") {
        let q = A.message.content[0];
        if (q?.type === "text" && q.text.trim().length > 0) return !0
    }
    return !1
}
// @from(Ln 236955, Col 0)
function mB9(A, q) {
    if (A.type === "assistant") {
        let K = A.message.content[0];
        if (K?.type === "tool_use" && !q01(K.name, K.input, q)) return !0
    }
    if (A.type === "grouped_tool_use") {
        let K = A.messages[0]?.message.content[0];
        if (K?.type === "tool_use" && !q01(A.toolName, K.input, q)) return !0
    }
    return !1
}
// @from(Ln 236967, Col 0)
function BB9(A) {
    return A.type === "system" && A.subtype === "stop_hook_summary" && A.hookLabel === "PreToolUse"
}
// @from(Ln 236971, Col 0)
function gB9(A) {
    if (A.type === "assistant") {
        let q = A.message.content[0];
        if (q?.type === "thinking" || q?.type === "redacted_thinking") return !0
    }
    if (A.type === "attachment") return !0;
    if (A.type === "system") return !0;
    return !1
}
// @from(Ln 236981, Col 0)
function FB9(A, q) {
    if (A.type === "assistant") {
        let K = A.message.content[0];
        return K?.type === "tool_use" && q01(K.name, K.input, q)
    }
    if (A.type === "grouped_tool_use") {
        let K = A.messages[0]?.message.content[0];
        return K?.type === "tool_use" && q01(A.toolName, K.input, q)
    }
    return !1
}
// @from(Ln 236993, Col 0)
function pB9(A, q) {
    if (A.type === "user") {
        let K = A.message.content.filter((Y) => Y.type === "tool_result");
        return K.length > 0 && K.every((Y) => q.has(Y.tool_use_id))
    }
    return !1
}
// @from(Ln 237001, Col 0)
function NY4(A) {
    if (A.type === "assistant") {
        let q = A.message.content[0];
        if (q?.type === "tool_use") return [q.id]
    }
    if (A.type === "grouped_tool_use") return A.messages.map((q) => {
        let K = q.message.content[0];
        return K.type === "tool_use" ? K.id : ""
    }).filter(Boolean);
    return []
}
// @from(Ln 237013, Col 0)
function IW6(A) {
    let q = [];
    for (let K of A.messages) q.push(...NY4(K));
    return q
}
// @from(Ln 237019, Col 0)
function BV8(A, q) {
    return IW6(A).some((K) => q.has(K))
}
// @from(Ln 237023, Col 0)
function VY4(A) {
    let q = A.displayMessage;
    if (q.type === "grouped_tool_use") return q.displayMessage;
    return q
}
// @from(Ln 237029, Col 0)
function mV8(A) {
    if (A.type === "grouped_tool_use") return A.messages.length;
    return 1
}
// @from(Ln 237034, Col 0)
function QB9(A) {
    let q = [];
    if (A.type === "assistant") {
        let K = A.message.content[0];
        if (K?.type === "tool_use") {
            let Y = K.input;
            if (Y?.file_path) q.push(Y.file_path)
        }
    } else if (A.type === "grouped_tool_use")
        for (let K of A.messages) {
            let Y = K.message.content[0];
            if (Y?.type === "tool_use") {
                let z = Y.input;
                if (z?.file_path) q.push(z.file_path)
            }
        }
    return q
}
// @from(Ln 237053, Col 0)
function vY4() {
    let A = {
        messages: [],
        searchCount: 0,
        readFilePaths: new Set,
        readOperationCount: 0,
        toolUseIds: new Set,
        memorySearchCount: 0,
        memoryReadFilePaths: new Set,
        memoryWriteCount: 0,
        nonMemSearchArgs: [],
        latestDisplayHint: void 0,
        hookTotalMs: 0,
        hookCount: 0,
        hookInfos: []
    };
    return A.teamMemorySearchCount = 0, A.teamMemoryReadFilePaths = new Set, A.teamMemoryWriteCount = 0, A
}
// @from(Ln 237072, Col 0)
function UB9(A) {
    let q = A.messages[0],
        K = A.readFilePaths.size > 0 ? A.readFilePaths.size : A.readOperationCount,
        Y = A.memoryReadFilePaths.size,
        z = A.teamMemoryReadFilePaths,
        _ = [...A.readFilePaths].filter((j) => !A.memoryReadFilePaths.has(j) && !(z?.has(j) ?? !1)),
        w = A.teamMemorySearchCount ?? 0,
        O = A.teamMemoryReadFilePaths?.size ?? 0,
        $ = A.teamMemoryWriteCount ?? 0,
        H = {
            type: "collapsed_read_search",
            searchCount: Math.max(0, A.searchCount - A.memorySearchCount - w),
            readCount: Math.max(0, K - Y - O),
            replCount: 0,
            memorySearchCount: A.memorySearchCount,
            memoryReadCount: Y,
            memoryWriteCount: A.memoryWriteCount,
            readFilePaths: _,
            searchArgs: A.nonMemSearchArgs,
            latestDisplayHint: A.latestDisplayHint,
            messages: A.messages,
            displayMessage: q,
            uuid: `collapsed-${q.uuid}`,
            timestamp: q.timestamp
        };
    if (H.teamMemorySearchCount = w, H.teamMemoryReadCount = O, H.teamMemoryWriteCount = $, A.hookCount > 0) H.hookTotalMs = A.hookTotalMs, H.hookCount = A.hookCount, H.hookInfos = A.hookInfos;
    return H
}
// @from(Ln 237101, Col 0)
function kY4(A, q) {
    let K = [],
        Y = vY4(),
        z = [];

    function _() {
        if (Y.messages.length === 0) return;
        K.push(UB9(Y));
        for (let w of z) K.push(w);
        z = [], Y = vY4()
    }
    for (let w of A)
        if (FB9(w, q)) {
            let O = xB9(w, q);
            if (O.isMemoryWrite) {
                let $ = mV8(w);
                if (Ep6?.isTeamMemoryWriteOrEdit(O.name, O.input)) Y.teamMemoryWriteCount = (Y.teamMemoryWriteCount ?? 0) + $;
                else Y.memoryWriteCount += $
            } else if (O.isSearch) {
                let $ = mV8(w);
                if (Y.searchCount += $, Ep6?.isTeamMemorySearch(O.input)) Y.teamMemorySearchCount = (Y.teamMemorySearchCount ?? 0) + $;
                else if (IB9(O.input)) Y.memorySearchCount += $;
                else {
                    let H = O.input;
                    if (H?.pattern) Y.nonMemSearchArgs.push(H.pattern), Y.latestDisplayHint = `"${H.pattern}"`
                }
            } else {
                let $ = QB9(w);
                for (let H of $)
                    if (Y.readFilePaths.add(H), Ep6?.isTeamMemFile(H)) Y.teamMemoryReadFilePaths?.add(H);
                    else if (Xp6(H)) Y.memoryReadFilePaths.add(H);
                else Y.latestDisplayHint = $K(H);
                if ($.length === 0) {
                    Y.readOperationCount += mV8(w);
                    let H = O.input;
                    if (H?.command) {
                        let j = H.command.replace(/\s+/g, " ").trim();
                        Y.latestDisplayHint = j.length > 60 ? j.slice(0, 57) + "…" : j
                    }
                }
            }
            for (let $ of NY4(w)) Y.toolUseIds.add($);
            Y.messages.push(w)
        } else if (pB9(w, Y.toolUseIds)) Y.messages.push(w);
    else if (Y.messages.length > 0 && BB9(w)) Y.hookCount += w.hookCount, Y.hookTotalMs += w.totalDurationMs ?? w.hookInfos.reduce((O, $) => O + ($.durationMs ?? 0), 0), Y.hookInfos.push(...w.hookInfos);
    else if (gB9(w))
        if (Y.messages.length > 0) z.push(w);
        else K.push(w);
    else if (uB9(w)) _(), K.push(w);
    else if (mB9(w, q)) _(), K.push(w);
    else _(), K.push(w);
    return _(), K
}
// @from(Ln 237155, Col 0)
function K01(A, q, K, Y = 0, z) {
    let _ = [];
    if (z) {
        let {
            memorySearchCount: O,
            memoryReadCount: $,
            memoryWriteCount: H
        } = z;
        if ($ > 0) {
            let j = K ? _.length === 0 ? "Recalling" : "recalling" : _.length === 0 ? "Recalled" : "recalled";
            _.push(`${j} ${$} ${$===1?"memory":"memories"}`)
        }
        if (O > 0) {
            let j = K ? _.length === 0 ? "Searching" : "searching" : _.length === 0 ? "Searched" : "searched";
            _.push(`${j} memories`)
        }
        if (H > 0) {
            let j = K ? _.length === 0 ? "Writing" : "writing" : _.length === 0 ? "Wrote" : "wrote";
            _.push(`${j} ${H} ${H===1?"memory":"memories"}`)
        }
        if (Ep6) Ep6.appendTeamMemorySummaryParts(z, K, _)
    }
    if (A > 0) {
        let O = K ? _.length === 0 ? "Searching for" : "searching for" : _.length === 0 ? "Searched for" : "searched for";
        _.push(`${O} ${A} ${A===1?"pattern":"patterns"}`)
    }
    if (q > 0) {
        let O = K ? _.length === 0 ? "Reading" : "reading" : _.length === 0 ? "Read" : "read";
        _.push(`${O} ${q} ${q===1?"file":"files"}`)
    }
    if (Y > 0) {
        let O = K ? "REPL'ing" : "REPL'd";
        _.push(`${O} ${Y} ${Y===1?"time":"times"}`)
    }
    let w = _.join(", ");
    return K ? `${w}…` : w
}
// @from(Ln 237193, Col 0)
function rt(A) {
    if (A.length === 0) return;
    let q = 0,
        K = 0;
    for (let z = A.length - 1; z >= 0; z--) {
        let _ = A[z];
        if (_.isSearch) q++;
        else if (_.isRead) K++;
        else break
    }
    if (q + K >= 2) return K01(q, K, !0);
    for (let z = A.length - 1; z >= 0; z--)
        if (A[z]?.activityDescription) return A[z].activityDescription;
    return
}
// @from(Ln 237208, Col 4)
Ep6
// @from(Ln 237209, Col 4)
gB = E(() => {
    uV8();
    Q$();
    hP1();
    Z7();
    Ep6 = (TY4(), k4(fY4))
})
// @from(Ln 237217, Col 0)
function gV8(A, q, K) {
    switch (A.type) {
        case "raw_string":
            q.raw.push([A.startIndex, A.endIndex]);
            return;
        case "ansi_c_string":
            q.ansiC.push([A.startIndex, A.endIndex]);
            return;
        case "string":
            if (!K) q.double.push([A.startIndex, A.endIndex]);
            for (let Y of A.children)
                if (Y) gV8(Y, q, !0);
            return;
        case "heredoc_redirect": {
            let Y = !1;
            for (let z of A.children)
                if (z && z.type === "heredoc_start") {
                    let _ = z.text[0];
                    Y = _ === "'" || _ === '"' || _ === "\\";
                    break
                } if (Y) {
                q.heredoc.push([A.startIndex, A.endIndex]);
                return
            }
            break
        }
    }
    for (let Y of A.children)
        if (Y) gV8(Y, q, K)
}
// @from(Ln 237248, Col 0)
function dB9(A) {
    let q = new Set;
    for (let [K, Y] of A)
        for (let z = K; z < Y; z++) q.add(z);
    return q
}
// @from(Ln 237255, Col 0)
function EY4(A) {
    return A.filter((q, K) => !A.some((Y, z) => z !== K && Y[0] <= q[0] && Y[1] >= q[1] && (Y[0] < q[0] || Y[1] > q[1])))
}
// @from(Ln 237259, Col 0)
function cB9(A, q) {
    if (q.length === 0) return A;
    let K = EY4(q).sort((z, _) => _[0] - z[0]),
        Y = A;
    for (let [z, _] of K) Y = Y.slice(0, z) + Y.slice(_);
    return Y
}
// @from(Ln 237267, Col 0)
function lB9(A, q) {
    if (q.length === 0) return A;
    let K = EY4(q).sort((z, _) => _[0] - z[0]),
        Y = A;
    for (let [z, _, w, O] of K) Y = Y.slice(0, z) + w + O + Y.slice(_);
    return Y
}
// @from(Ln 237275, Col 0)
function iB9(A, q) {
    let K = {
        raw: [],
        ansiC: [],
        double: [],
        heredoc: []
    };
    gV8(A, K, !1);
    let {
        raw: Y,
        ansiC: z,
        double: _,
        heredoc: w
    } = K, O = [...Y, ...z, ..._, ...w], $ = dB9([...Y, ...z, ...w]), H = new Set;
    for (let [X, P] of _) H.add(X), H.add(P - 1);
    let j = "";
    for (let X = 0; X < q.length; X++) {
        if ($.has(X)) continue;
        if (H.has(X)) continue;
        j += q[X]
    }
    let J = cB9(q, O),
        M = [];
    for (let [X, P] of Y) M.push([X, P, "'", "'"]);
    for (let [X, P] of z) M.push([X, P, "$'", "'"]);
    for (let [X, P] of _) M.push([X, P, '"', '"']);
    for (let [X, P] of w) M.push([X, P, "", ""]);
    let D = lB9(q, M);
    return {
        withDoubleQuotes: j,
        fullyUnquoted: J,
        unquotedKeepQuoteChars: D
    }
}
// @from(Ln 237310, Col 0)
function nB9(A, q) {
    let K = A,
        Y = [],
        z = [],
        _ = !1,
        w = !1,
        O = !1;

    function $(H) {
        for (let j of H.children) {
            if (!j) continue;
            if (j.type === "list")
                for (let J of j.children) {
                    if (!J) continue;
                    if (J.type === "&&" || J.type === "||") Y.push(J.type);
                    else if (J.type === "list" || J.type === "redirected_statement") $({
                        ...H,
                        children: [J]
                    });
                    else if (J.type === "pipeline") O = !0, z.push(J.text);
                    else if (J.type === "subshell") _ = !0, z.push(J.text);
                    else if (J.type === "compound_statement") w = !0, z.push(J.text);
                    else z.push(J.text)
                } else if (j.type === ";") Y.push(";");
                else if (j.type === "pipeline") O = !0, z.push(j.text);
            else if (j.type === "subshell") _ = !0, z.push(j.text);
            else if (j.type === "compound_statement") w = !0, z.push(j.text);
            else if (j.type === "command" || j.type === "declaration_command" || j.type === "variable_assignment") z.push(j.text);
            else if (j.type === "redirected_statement") {
                let J = !1;
                for (let M of j.children) {
                    if (!M || M.type === "file_redirect") continue;
                    J = !0, $({
                        ...j,
                        children: [M]
                    })
                }
                if (!J) z.push(j.text)
            } else if (j.type === "negated_command") z.push(j.text), $(j);
            else if (j.type === "if_statement" || j.type === "while_statement" || j.type === "for_statement" || j.type === "case_statement" || j.type === "function_definition") z.push(j.text), $(j)
        }
    }
    if ($(K), z.length === 0) z.push(q);
    return {
        hasCompoundOperators: Y.length > 0,
        hasPipeline: O,
        hasSubshell: _,
        hasCommandGroup: w,
        operators: Y,
        segments: z
    }
}
// @from(Ln 237363, Col 0)
function rB9(A) {
    let q = A;

    function K(Y) {
        if (Y.type === ";" || Y.type === "&&" || Y.type === "||") return !0;
        if (Y.type === "list") return !0;
        for (let z of Y.children)
            if (z && K(z)) return !0;
        return !1
    }
    return K(q)
}
// @from(Ln 237376, Col 0)
function oB9(A) {
    let q = A,
        K = !1,
        Y = !1,
        z = !1,
        _ = !1,
        w = !1;

    function O($) {
        switch ($.type) {
            case "command_substitution":
                K = !0;
                break;
            case "process_substitution":
                Y = !0;
                break;
            case "expansion":
                z = !0;
                break;
            case "heredoc_redirect":
                _ = !0;
                break;
            case "comment":
                w = !0;
                break
        }
        for (let H of $.children)
            if (H) O(H)
    }
    return O(q), {
        hasCommandSubstitution: K,
        hasProcessSubstitution: Y,
        hasParameterExpansion: z,
        hasHeredoc: _,
        hasComment: w
    }
}
// @from(Ln 237414, Col 0)
function yY4(A, q) {
    return {
        quoteContext: iB9(A, q),
        compoundStructure: nB9(A, q),
        hasActualOperatorNodes: rB9(A),
        dangerousPatterns: oB9(A)
    }
}
// @from(Ln 237422, Col 4)
LY4 = () => {}
// @from(Ln 237423, Col 4)
UV8 = {}
// @from(Ln 237430, Col 0)
async function eB9() {}
// @from(Ln 237431, Col 0)
async function FV8(A) {
    if (!A || A.length > hY4) return null;
    return null
}
// @from(Ln 237435, Col 0)
async function pV8(A) {
    if (!A || A.length > hY4) return null;
    return null
}
// @from(Ln 237440, Col 0)
function QV8(A) {
    if (A.type === "declaration_command") {
        let Y = A.children[0];
        return Y && aB9.has(Y.text) ? [Y.text] : []
    }
    let q = [],
        K = !1;
    for (let Y of A.children) {
        if (Y.type === "variable_assignment") continue;
        if (Y.type === "command_name" || !K && Y.type === "word") {
            K = !0, q.push(Y.text);
            continue
        }
        if (sB9.has(Y.type)) q.push(Ag9(Y.text));
        else if (tB9.has(Y.type)) break
    }
    return q
}
// @from(Ln 237459, Col 0)
function Ag9(A) {
    return A.length >= 2 && (A[0] === '"' && A.at(-1) === '"' || A[0] === "'" && A.at(-1) === "'") ? A.slice(1, -1) : A
}
// @from(Ln 237462, Col 4)
hY4 = 1e4
// @from(Ln 237463, Col 4)
aB9
// @from(Ln 237463, Col 9)
sB9
// @from(Ln 237463, Col 14)
tB9
// @from(Ln 237464, Col 4)
Lp6 = E(() => {
    LY4();
    V1();
    H1();
    aB9 = new Set(["export", "declare", "typeset", "readonly", "local", "unset", "unsetenv"]), sB9 = new Set(["word", "string", "raw_string", "number"]), tB9 = new Set(["command_substitution", "process_substitution"])
})
// @from(Ln 237470, Col 4)
IY4 = {}
// @from(Ln 237475, Col 0)
class dV8 {
    originalCommand;
    constructor(A) {
        this.originalCommand = A
    }
    toString() {
        return this.originalCommand
    }
    getPipeSegments() {
        try {
            let A = bW6(this.originalCommand),
                q = [],
                K = [];
            for (let Y of A)
                if (Y === "|") {
                    if (K.length > 0) q.push(K.join(" ")), K = []
                } else K.push(Y);
            if (K.length > 0) q.push(K.join(" "));
            return q.length > 0 ? q : [this.originalCommand]
        } catch {
            return [this.originalCommand]
        }
    }
    withoutOutputRedirections() {
        if (!this.originalCommand.includes(">")) return this.originalCommand;
        let {
            commandWithoutRedirections: A,
            redirections: q
        } = ik(this.originalCommand);
        return q.length > 0 ? A : this.originalCommand
    }
    getOutputRedirections() {
        let {
            redirections: A
        } = ik(this.originalCommand);
        return A
    }
    getTreeSitterAnalysis() {
        return null
    }
}
// @from(Ln 237517, Col 0)
function cV8(A, q) {
    q(A);
    for (let K of A.children) cV8(K, q)
}
// @from(Ln 237522, Col 0)
function qg9(A) {
    let q = [];
    return cV8(A, (K) => {
        if (K.type === "pipeline") {
            for (let Y of K.children)
                if (Y.type === "|") q.push(Y.startIndex)
        }
    }), q.sort((K, Y) => K - Y)
}
// @from(Ln 237532, Col 0)
function Kg9(A) {
    let q = [];
    return cV8(A, (K) => {
        if (K.type === "file_redirect") {
            let Y = K.children,
                z = Y.find((w) => w.type === ">" || w.type === ">>"),
                _ = Y.find((w) => w.type === "word");
            if (z && _) q.push({
                startIndex: K.startIndex,
                endIndex: K.endIndex,
                target: _.text,
                operator: z.type
            })
        }
    }), q
}
// @from(Ln 237548, Col 0)
class CY4 {
    originalCommand;
    commandBytes;
    pipePositions;
    redirectionNodes;
    treeSitterAnalysis;
    constructor(A, q, K, Y) {
        this.originalCommand = A, this.commandBytes = Buffer.from(A, "utf8"), this.pipePositions = q, this.redirectionNodes = K, this.treeSitterAnalysis = Y
    }
    toString() {
        return this.originalCommand
    }
    getPipeSegments() {
        if (this.pipePositions.length === 0) return [this.originalCommand];
        let A = [],
            q = 0;
        for (let Y of this.pipePositions) {
            let z = this.commandBytes.subarray(q, Y).toString("utf8").trim();
            if (z) A.push(z);
            q = Y + 1
        }
        let K = this.commandBytes.subarray(q).toString("utf8").trim();
        if (K) A.push(K);
        return A
    }
    withoutOutputRedirections() {
        if (this.redirectionNodes.length === 0) return this.originalCommand;
        let A = [...this.redirectionNodes].sort((K, Y) => Y.startIndex - K.startIndex),
            q = this.commandBytes;
        for (let K of A) q = Buffer.concat([q.subarray(0, K.startIndex), q.subarray(K.endIndex)]);
        return q.toString("utf8").trim().replace(/\s+/g, " ")
    }
    getOutputRedirections() {
        return this.redirectionNodes.map(({
            target: A,
            operator: q
        }) => ({
            target: A,
            operator: q
        }))
    }
    getTreeSitterAnalysis() {
        return this.treeSitterAnalysis
    }
}
// @from(Ln 237593, Col 0)
async function zg9(A) {
    if (!A) return null;
    if (await Yg9()) try {
        let {
            parseCommand: K
        } = await Promise.resolve().then(() => (Lp6(), UV8)), Y = await K(A);
        if (Y) {
            let z = qg9(Y.rootNode),
                _ = Kg9(Y.rootNode),
                w = yY4(Y.rootNode, A);
            return new CY4(A, z, _, w)
        }
    } catch {}
    return new dV8(A)
}
// @from(Ln 237608, Col 4)
Yg9
// @from(Ln 237608, Col 9)
SY4
// @from(Ln 237608, Col 14)
Y01
// @from(Ln 237608, Col 19)
ot
// @from(Ln 237609, Col 4)
z01 = E(() => {
    U4();
    jZ();
    Yg9 = e1(async () => {
        try {
            let {
                parseCommand: A
            } = await Promise.resolve().then(() => (Lp6(), UV8));
            return await A("echo test") !== null
        } catch {
            return !1
        }
    });
    ot = {
        parse(A) {
            if (A === SY4 && Y01 !== void 0) return Y01;
            return SY4 = A, Y01 = zg9(A), Y01
        }
    }
})
// @from(Ln 237630, Col 0)
function _g9(A) {
    for (let q of A) {
        if (typeof q !== "string") continue;
        let K = (q.match(/{/g) || []).length,
            Y = (q.match(/}/g) || []).length;
        if (K !== Y) return !0;
        let z = (q.match(/\(/g) || []).length,
            _ = (q.match(/\)/g) || []).length;
        if (z !== _) return !0;
        let w = (q.match(/\[/g) || []).length,
            O = (q.match(/\]/g) || []).length;
        if (w !== O) return !0;
        if ((q.match(/(?<!\\)"/g) || []).length % 2 !== 0) return !0;
        if ((q.match(/(?<!\\)'/g) || []).length % 2 !== 0) return !0
    }
    return !1
}
// @from(Ln 237648, Col 0)
function bY4(A, q = !1) {
    let K = "",
        Y = "",
        z = "",
        _ = !1,
        w = !1,
        O = !1;
    for (let $ = 0; $ < A.length; $++) {
        let H = A[$];
        if (O) {
            if (O = !1, !_) K += H;
            if (!_ && !w) Y += H;
            if (!_ && !w) z += H;
            continue
        }
        if (H === "\\" && !_) {
            if (O = !0, !_) K += H;
            if (!_ && !w) Y += H;
            if (!_ && !w) z += H;
            continue
        }
        if (H === "'" && !w) {
            _ = !_, z += H;
            continue
        }
        if (H === '"' && !_) {
            if (w = !w, z += H, !q) continue
        }
        if (!_) K += H;
        if (!_ && !w) Y += H;
        if (!_ && !w) z += H
    }
    return {
        withDoubleQuotes: K,
        fullyUnquoted: Y,
        unquotedKeepQuoteChars: z
    }
}
// @from(Ln 237687, Col 0)
function xY4(A) {
    return A.replace(/\s+2\s*>&\s*1(?=\s|$)/g, "").replace(/[012]?\s*>\s*\/dev\/null(?=\s|$)/g, "").replace(/\s*<\s*\/dev\/null(?=\s|$)/g, "")
}
// @from(Ln 237691, Col 0)
function $g9(A, q) {
    if (q.length !== 1) throw Error("hasUnescapedChar only works with single characters");
    let K = 0;
    while (K < A.length) {
        if (A[K] === "\\" && K + 1 < A.length) {
            K += 2;
            continue
        }
        if (A[K] === q) return !0;
        K++
    }
    return !1
}
// @from(Ln 237705, Col 0)
function uY4(A) {
    if (!A.originalCommand.trim()) return {
        behavior: "allow",
        updatedInput: {
            command: A.originalCommand
        },
        decisionReason: {
            type: "other",
            reason: "Empty command is safe"
        }
    };
    return {
        behavior: "passthrough",
        message: "Command is not empty"
    }
}
// @from(Ln 237722, Col 0)
function mY4(A) {
    let {
        originalCommand: q
    } = A, K = q.trim();
    if (/^\s*\t/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.INCOMPLETE_COMMANDS,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command appears to be an incomplete fragment (starts with tab)"
    };
    if (K.startsWith("-")) return d("tengu_bash_security_check_triggered", {
        checkId: w3.INCOMPLETE_COMMANDS,
        subId: 2
    }), {
        behavior: "ask",
        message: "Command appears to be an incomplete fragment (starts with flags)"
    };
    if (/^\s*(&&|\|\||;|>>?|<)/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.INCOMPLETE_COMMANDS,
        subId: 3
    }), {
        behavior: "ask",
        message: "Command appears to be a continuation line (starts with operator)"
    };
    return {
        behavior: "passthrough",
        message: "Command appears complete"
    }
}
// @from(Ln 237753, Col 0)
function Hg9(A) {
    if (!lV8.test(A)) return !1;
    let q = /\$\(cat[ \t]*<<(-?)[ \t]*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g,
        K, Y = [];
    while ((K = q.exec(A)) !== null) {
        let $ = K[2] || K[3];
        if ($) Y.push({
            start: K.index,
            operatorEnd: K.index + K[0].length,
            delimiter: $,
            isDash: K[1] === "-"
        })
    }
    if (Y.length === 0) return !1;
    let z = [];
    for (let {
            start: $,
            operatorEnd: H,
            delimiter: j,
            isDash: J
        }
        of Y) {
        let M = A.slice(H),
            D = M.indexOf(`
`);
        if (D === -1) return !1;
        let X = M.slice(0, D);
        if (!/^[ \t]*$/.test(X)) return !1;
        let P = H + D + 1,
            Z = A.slice(P).split(`
`),
            G = -1,
            f = -1,
            v = -1;
        for (let V = 0; V < Z.length; V++) {
            let L = Z[V],
                h = J ? L.replace(/^\t*/, "") : L;
            if (h === j) {
                G = V;
                let R = Z[V + 1];
                if (R === void 0) return !1;
                let u = R.match(/^([ \t]*)\)/);
                if (!u) return !1;
                f = V + 1, v = u[1].length;
                break
            }
            if (h.startsWith(j)) {
                let R = h.slice(j.length),
                    u = R.match(/^([ \t]*)\)/);
                if (u) {
                    G = V, f = V, v = (J ? L.match(/^\t*/)?.[0] ?? "" : "").length + j.length + u[1].length;
                    break
                }
                if (/^[)}`|&;(<>]/.test(R)) return !1
            }
        }
        if (G === -1) return !1;
        let N = P;
        for (let V = 0; V < f; V++) N += Z[V].length + 1;
        N += v + 1, z.push({
            start: $,
            end: N
        })
    }
    for (let $ of z)
        for (let H of z) {
            if (H === $) continue;
            if (H.start > $.start && H.start < $.end) return !1
        }
    let _ = [...z].sort(($, H) => H.start - $.start),
        w = A;
    for (let {
            start: $,
            end: H
        }
        of _) w = w.slice(0, $) + w.slice(H);
    if (w.trim().length > 0) {
        let $ = Math.min(...z.map((j) => j.start));
        if (A.slice(0, $).trim().length === 0) return !1
    }
    if (!/^[a-zA-Z0-9 \t"'.\-/_@=,:+~]*$/.test(w)) return !1;
    if (Rp6(w).behavior !== "passthrough") return !1;
    return !0
}
// @from(Ln 237838, Col 0)
function BY4(A) {
    if (!lV8.test(A)) return null;
    let q = /\$\(cat[ \t]*<<(-?)[ \t]*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g,
        K = A,
        Y = !1,
        z, _ = [];
    while ((z = q.exec(A)) !== null) {
        if (z.index > 0 && A[z.index - 1] === "\\") continue;
        let w = z[2] || z[3];
        if (!w) continue;
        let O = z[1] === "-",
            $ = z.index + z[0].length,
            H = A.slice($),
            j = H.indexOf(`
`);
        if (j === -1) continue;
        if (!/^[ \t]*$/.test(H.slice(0, j))) continue;
        let J = $ + j + 1,
            M = A.slice(J).split(`
`);
        for (let D = 0; D < M.length; D++) {
            let X = M[D],
                P = O ? X.replace(/^\t*/, "") : X;
            if (P.startsWith(w)) {
                let W = P.slice(w.length),
                    Z = -1;
                if (/^[ \t]*\)/.test(W)) {
                    let G = J + M.slice(0, D).join(`
`).length + (D > 0 ? 1 : 0);
                    Z = A.indexOf(")", G)
                } else if (W === "") {
                    let G = M[D + 1];
                    if (G !== void 0 && /^[ \t]*\)/.test(G)) {
                        let f = J + M.slice(0, D + 1).join(`
`).length + 1;
                        Z = A.indexOf(")", f)
                    }
                }
                if (Z !== -1) _.push({
                    start: z.index,
                    end: Z + 1
                }), Y = !0;
                break
            }
        }
    }
    if (!Y) return null;
    for (let w = _.length - 1; w >= 0; w--) {
        let O = _[w];
        K = K.slice(0, O.start) + K.slice(O.end)
    }
    return K
}
// @from(Ln 237892, Col 0)
function gY4(A) {
    let {
        originalCommand: q
    } = A;
    if (!lV8.test(q)) return {
        behavior: "passthrough",
        message: "No heredoc in substitution"
    };
    if (Hg9(q)) return {
        behavior: "allow",
        updatedInput: {
            command: q
        },
        decisionReason: {
            type: "other",
            reason: "Safe command substitution: cat with quoted/escaped heredoc delimiter"
        }
    };
    return {
        behavior: "passthrough",
        message: "Command substitution needs validation"
    }
}
// @from(Ln 237916, Col 0)
function FY4(A) {
    let {
        originalCommand: q,
        baseCommand: K
    } = A;
    if (K !== "git" || !/^git\s+commit\s+/.test(q)) return {
        behavior: "passthrough",
        message: "Not a git commit"
    };
    if (q.includes("\\")) return {
        behavior: "passthrough",
        message: "Git commit contains backslash, needs full validation"
    };
    let Y = q.match(/^git[ \t]+commit[ \t]+[^;&|`$<>()\n\r]*?-m[ \t]+(["'])([\s\S]*?)\1(.*)$/);
    if (Y) {
        let [, z, _, w] = Y;
        if (z === '"' && _ && /\$\(|`|\$\{/.test(_)) return d("tengu_bash_security_check_triggered", {
            checkId: w3.GIT_COMMIT_SUBSTITUTION,
            subId: 1
        }), {
            behavior: "ask",
            message: "Git commit message contains command substitution patterns"
        };
        if (w && /[;|&()`]|\$\(|\$\{/.test(w)) return {
            behavior: "passthrough",
            message: "Git commit remainder contains shell metacharacters"
        };
        if (w) {
            let O = "",
                $ = !1,
                H = !1;
            for (let j = 0; j < w.length; j++) {
                let J = w[j];
                if (J === "'" && !H) {
                    $ = !$;
                    continue
                }
                if (J === '"' && !$) {
                    H = !H;
                    continue
                }
                if (!$ && !H) O += J
            }
            if (/[<>]/.test(O)) return {
                behavior: "passthrough",
                message: "Git commit remainder contains unquoted redirect operator"
            }
        }
        if (_ && _.startsWith("-")) return d("tengu_bash_security_check_triggered", {
            checkId: w3.OBFUSCATED_FLAGS,
            subId: 5
        }), {
            behavior: "ask",
            message: "Command contains quoted characters in flag names"
        };
        return {
            behavior: "allow",
            updatedInput: {
                command: q
            },
            decisionReason: {
                type: "other",
                reason: "Git commit with simple quoted message is allowed"
            }
        }
    }
    return {
        behavior: "passthrough",
        message: "Git commit needs validation"
    }
}
// @from(Ln 237988, Col 0)
function pY4(A) {
    let {
        originalCommand: q,
        baseCommand: K
    } = A;
    if (K !== "jq") return {
        behavior: "passthrough",
        message: "Not jq"
    };
    if (/\bsystem\s*\(/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.JQ_SYSTEM_FUNCTION,
        subId: 1
    }), {
        behavior: "ask",
        message: "jq command contains system() function which executes arbitrary commands"
    };
    let Y = q.substring(3).trim();
    if (/(?:^|\s)(?:-f\b|--from-file|--rawfile|--slurpfile|-L\b|--library-path)/.test(Y)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.JQ_FILE_ARGUMENTS,
        subId: 1
    }), {
        behavior: "ask",
        message: "jq command contains dangerous flags that could execute code or read arbitrary files"
    };
    return {
        behavior: "passthrough",
        message: "jq command is safe"
    }
}
// @from(Ln 238018, Col 0)
function QY4(A) {
    let {
        unquotedContent: q
    } = A, K = "Command contains shell metacharacters (;, |, or &) in arguments";
    if (/(?:^|\s)["'][^"']*[;&][^"']*["'](?:\s|$)/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.SHELL_METACHARACTERS,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains shell metacharacters (;, |, or &) in arguments"
    };
    if ([/-name\s+["'][^"']*[;|&][^"']*["']/, /-path\s+["'][^"']*[;|&][^"']*["']/, /-iname\s+["'][^"']*[;|&][^"']*["']/].some((z) => z.test(q))) return d("tengu_bash_security_check_triggered", {
        checkId: w3.SHELL_METACHARACTERS,
        subId: 2
    }), {
        behavior: "ask",
        message: "Command contains shell metacharacters (;, |, or &) in arguments"
    };
    if (/-regex\s+["'][^"']*[;&][^"']*["']/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.SHELL_METACHARACTERS,
        subId: 3
    }), {
        behavior: "ask",
        message: "Command contains shell metacharacters (;, |, or &) in arguments"
    };
    return {
        behavior: "passthrough",
        message: "No metacharacters"
    }
}
// @from(Ln 238049, Col 0)
function UY4(A) {
    let {
        fullyUnquotedContent: q
    } = A;
    if (/[<>|]\s*\$[A-Za-z_]/.test(q) || /\$[A-Za-z_][A-Za-z0-9_]*\s*[|<>]/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.DANGEROUS_VARIABLES,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains variables in dangerous contexts (redirections or pipes)"
    };
    return {
        behavior: "passthrough",
        message: "No dangerous variables"
    }
}
// @from(Ln 238066, Col 0)
function dY4(A) {
    let {
        unquotedContent: q
    } = A;
    if ($g9(q, "`")) return {
        behavior: "ask",
        message: "Command contains backticks (`) for command substitution"
    };
    for (let {
            pattern: K,
            message: Y
        }
        of wg9)
        if (K.test(q)) return d("tengu_bash_security_check_triggered", {
            checkId: w3.DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION,
            subId: 1
        }), {
            behavior: "ask",
            message: `Command contains ${Y}`
        };
    return {
        behavior: "passthrough",
        message: "No dangerous patterns"
    }
}
// @from(Ln 238092, Col 0)
function _01(A) {
    let {
        fullyUnquotedContent: q
    } = A;
    if (/</.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.DANGEROUS_PATTERNS_INPUT_REDIRECTION,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains input redirection (<) which could read sensitive files"
    };
    if (/>/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.DANGEROUS_PATTERNS_OUTPUT_REDIRECTION,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains output redirection (>) which could write to arbitrary files"
    };
    return {
        behavior: "passthrough",
        message: "No redirections"
    }
}
// @from(Ln 238116, Col 0)
function w01(A) {
    let {
        fullyUnquotedPreStrip: q
    } = A;
    if (!/[\n\r]/.test(q)) return {
        behavior: "passthrough",
        message: "No newlines"
    };
    if (/(?<![\s]\\)[\n\r]\s*\S/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.NEWLINES,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains newlines that could separate multiple commands"
    };
    return {
        behavior: "passthrough",
        message: "Newlines appear to be within data"
    }
}
// @from(Ln 238137, Col 0)
function cY4(A) {
    let {
        originalCommand: q
    } = A;
    if (!q.includes("\r")) return {
        behavior: "passthrough",
        message: "No carriage return"
    };
    let K = !1,
        Y = !1,
        z = !1;
    for (let _ = 0; _ < q.length; _++) {
        let w = q[_];
        if (z) {
            z = !1;
            continue
        }
        if (w === "\\" && !K) {
            z = !0;
            continue
        }
        if (w === "'" && !Y) {
            K = !K;
            continue
        }
        if (w === '"' && !K) {
            Y = !Y;
            continue
        }
        if (w === "\r" && !Y) return d("tengu_bash_security_check_triggered", {
            checkId: w3.NEWLINES,
            subId: 2
        }), {
            behavior: "ask",
            message: "Command contains carriage return (\\r) which shell-quote and bash tokenize differently"
        }
    }
    return {
        behavior: "passthrough",
        message: "CR only inside double quotes"
    }
}
// @from(Ln 238180, Col 0)
function lY4(A) {
    let {
        originalCommand: q
    } = A;
    if (/\$IFS|\$\{[^}]*IFS/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.IFS_INJECTION,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains IFS variable usage which could bypass security validation"
    };
    return {
        behavior: "passthrough",
        message: "No IFS injection detected"
    }
}
// @from(Ln 238197, Col 0)
function iY4(A) {
    let {
        originalCommand: q
    } = A;
    if (/\/proc\/.*\/environ/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.PROC_ENVIRON_ACCESS,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command accesses /proc/*/environ which could expose sensitive environment variables"
    };
    return {
        behavior: "passthrough",
        message: "No /proc/environ access detected"
    }
}
// @from(Ln 238214, Col 0)
function nY4(A) {
    let {
        originalCommand: q
    } = A, K = Fz(q);
    if (!K.success) return {
        behavior: "passthrough",
        message: "Parse failed, handled elsewhere"
    };
    let Y = K.tokens;
    if (!Y.some((_) => typeof _ === "object" && _ !== null && ("op" in _) && (_.op === ";" || _.op === "&&" || _.op === "||"))) return {
        behavior: "passthrough",
        message: "No command separators"
    };
    if (_g9(Y)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.MALFORMED_TOKEN_INJECTION,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command contains ambiguous syntax with command separators that could be misinterpreted"
    };
    return {
        behavior: "passthrough",
        message: "No malformed token injection detected"
    }
}
// @from(Ln 238240, Col 0)
function rY4(A) {
    let {
        originalCommand: q,
        baseCommand: K
    } = A, Y = /[|&;]/.test(q);
    if (K === "echo" && !Y) return {
        behavior: "passthrough",
        message: "echo command is safe and has no dangerous flags"
    };
    if (/\$'[^']*'/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.OBFUSCATED_FLAGS,
        subId: 5
    }), {
        behavior: "ask",
        message: "Command contains ANSI-C quoting which can hide characters"
    };
    if (/\$"[^"]*"/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.OBFUSCATED_FLAGS,
        subId: 6
    }), {
        behavior: "ask",
        message: "Command contains locale quoting which can hide characters"
    };
    if (/\$['"]{2}\s*-/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.OBFUSCATED_FLAGS,
        subId: 9
    }), {
        behavior: "ask",
        message: "Command contains empty special quotes before dash (potential bypass)"
    };
    if (/(?:^|\s)(?:''|"")+\s*-/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.OBFUSCATED_FLAGS,
        subId: 7
    }), {
        behavior: "ask",
        message: "Command contains empty quotes before dash (potential bypass)"
    };
    if (/(?:""|'')+['"]-/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.OBFUSCATED_FLAGS,
        subId: 10
    }), {
        behavior: "ask",
        message: "Command contains empty quote pair adjacent to quoted dash (potential flag obfuscation)"
    };
    if (/(?:^|\s)['"]{3,}/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.OBFUSCATED_FLAGS,
        subId: 11
    }), {
        behavior: "ask",
        message: "Command contains consecutive quote characters at word start (potential obfuscation)"
    };
    let z = !1,
        _ = !1,
        w = !1;
    for (let O = 0; O < q.length - 1; O++) {
        let $ = q[O],
            H = q[O + 1];
        if (w) {
            w = !1;
            continue
        }
        if ($ === "\\" && !z) {
            w = !0;
            continue
        }
        if ($ === "'" && !_) {
            z = !z;
            continue
        }
        if ($ === '"' && !z) {
            _ = !_;
            continue
        }
        if (z || _) continue;
        if ($ && H && /\s/.test($) && /['"`]/.test(H)) {
            let j = H,
                J = O + 2,
                M = "";
            while (J < q.length && q[J] !== j) M += q[J], J++;
            if (J < q.length && q[J] === j && M.startsWith("-")) return d("tengu_bash_security_check_triggered", {
                checkId: w3.OBFUSCATED_FLAGS,
                subId: 4
            }), {
                behavior: "ask",
                message: "Command contains quoted characters in flag names"
            }
        }
        if ($ && H && /\s/.test($) && H === "-") {
            let j = O + 1,
                J = "";
            while (j < q.length) {
                let M = q[j];
                if (!M) break;
                if (/[\s=]/.test(M)) break;
                if (/['"`]/.test(M)) {
                    if (K === "cut" && J === "-d" && /['"`]/.test(M)) break;
                    if (j + 1 < q.length) {
                        let D = q[j + 1];
                        if (D && !/[a-zA-Z0-9_'"-]/.test(D)) break
                    }
                }
                J += M, j++
            }
            if (J.includes('"') || J.includes("'")) return d("tengu_bash_security_check_triggered", {
                checkId: w3.OBFUSCATED_FLAGS,
                subId: 1
            }), {
                behavior: "ask",
                message: "Command contains quoted characters in flag names"
            }
        }
    }
    if (/\s['"`]-/.test(A.fullyUnquotedContent)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.OBFUSCATED_FLAGS,
        subId: 2
    }), {
        behavior: "ask",
        message: "Command contains quoted characters in flag names"
    };
    if (/['"`]{2}-/.test(A.fullyUnquotedContent)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.OBFUSCATED_FLAGS,
        subId: 3
    }), {
        behavior: "ask",
        message: "Command contains quoted characters in flag names"
    };
    return {
        behavior: "passthrough",
        message: "No obfuscated flags detected"
    }
}
// @from(Ln 238372, Col 0)
function jg9(A) {
    let q = !1,
        K = !1;
    for (let Y = 0; Y < A.length; Y++) {
        let z = A[Y];
        if (z === "\\" && !q) {
            if (!K) {
                let _ = A[Y + 1];
                if (_ === " " || _ === "\t") return !0
            }
            Y++;
            continue
        }
        if (z === '"' && !q) {
            K = !K;
            continue
        }
        if (z === "'" && !K) {
            q = !q;
            continue
        }
    }
    return !1
}
// @from(Ln 238397, Col 0)
function oY4(A) {
    if (jg9(A.originalCommand)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.BACKSLASH_ESCAPED_WHITESPACE
    }), {
        behavior: "ask",
        message: "Command contains backslash-escaped whitespace that could alter command parsing"
    };
    return {
        behavior: "passthrough",
        message: "No backslash-escaped whitespace"
    }
}
// @from(Ln 238410, Col 0)
function Mg9(A) {
    let q = !1,
        K = !1;
    for (let Y = 0; Y < A.length; Y++) {
        let z = A[Y];
        if (z === "\\" && !q) {
            if (!K) {
                let _ = A[Y + 1];
                if (_ && Jg9.has(_)) return !0
            }
            Y++;
            continue
        }
        if (z === "'" && !K) {
            q = !q;
            continue
        }
        if (z === '"' && !q) {
            K = !K;
            continue
        }
    }
    return !1
}
// @from(Ln 238435, Col 0)
function aY4(A) {
    if (A.treeSitter && !A.treeSitter.hasActualOperatorNodes) return {
        behavior: "passthrough",
        message: "No operator nodes in AST"
    };
    if (Mg9(A.originalCommand)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.BACKSLASH_ESCAPED_OPERATORS
    }), {
        behavior: "ask",
        message: "Command contains a backslash before a shell operator (;, |, &, <, >) which can hide command structure"
    };
    return {
        behavior: "passthrough",
        message: "No backslash-escaped operators"
    }
}
// @from(Ln 238452, Col 0)
function n36(A, q) {
    let K = 0,
        Y = q - 1;
    while (Y >= 0 && A[Y] === "\\") K++, Y--;
    return K % 2 === 1
}
// @from(Ln 238459, Col 0)
function sY4(A) {
    let q = A.fullyUnquotedPreStrip,
        K = 0,
        Y = 0;
    for (let z = 0; z < q.length; z++)
        if (q[z] === "{" && !n36(q, z)) K++;
        else if (q[z] === "}" && !n36(q, z)) Y++;
    if (K > 0 && Y > K) return d("tengu_bash_security_check_triggered", {
        checkId: w3.BRACE_EXPANSION,
        subId: 2
    }), {
        behavior: "ask",
        message: "Command has excess closing braces after quote stripping, indicating possible brace expansion obfuscation"
    };
    if (K > 0) {
        let z = A.originalCommand;
        if (/['"][{}]['"]/.test(z)) return d("tengu_bash_security_check_triggered", {
            checkId: w3.BRACE_EXPANSION,
            subId: 3
        }), {
            behavior: "ask",
            message: "Command contains quoted brace character inside brace context (potential brace expansion obfuscation)"
        }
    }
    for (let z = 0; z < q.length; z++) {
        if (q[z] !== "{") continue;
        if (n36(q, z)) continue;
        let _ = 1,
            w = -1;
        for (let $ = z + 1; $ < q.length; $++) {
            let H = q[$];
            if (H === "{" && !n36(q, $)) _++;
            else if (H === "}" && !n36(q, $)) {
                if (_--, _ === 0) {
                    w = $;
                    break
                }
            }
        }
        if (w === -1) continue;
        let O = 0;
        for (let $ = z + 1; $ < w; $++) {
            let H = q[$];
            if (H === "{" && !n36(q, $)) O++;
            else if (H === "}" && !n36(q, $)) O--;
            else if (O === 0) {
                if (H === "," || H === "." && $ + 1 < w && q[$ + 1] === ".") return d("tengu_bash_security_check_triggered", {
                    checkId: w3.BRACE_EXPANSION,
                    subId: 1
                }), {
                    behavior: "ask",
                    message: "Command contains brace expansion that could alter command parsing"
                }
            }
        }
    }
    return {
        behavior: "passthrough",
        message: "No brace expansion detected"
    }
}
// @from(Ln 238521, Col 0)
function tY4(A) {
    let {
        originalCommand: q
    } = A;
    if (Dg9.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.UNICODE_WHITESPACE
    }), {
        behavior: "ask",
        message: "Command contains Unicode whitespace characters that could cause parsing inconsistencies"
    };
    return {
        behavior: "passthrough",
        message: "No Unicode whitespace"
    }
}
// @from(Ln 238537, Col 0)
function eY4(A) {
    let {
        unquotedKeepQuoteChars: q
    } = A, K = q.replace(/\\+\n/g, (Y) => {
        let z = Y.length - 1;
        return z % 2 === 1 ? "\\".repeat(z - 1) : Y
    });
    if (/\S(?<!\$\{)#/.test(q) || /\S(?<!\$\{)#/.test(K)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.MID_WORD_HASH
    }), {
        behavior: "ask",
        message: "Command contains mid-word # which is parsed differently by shell-quote vs bash"
    };
    return {
        behavior: "passthrough",
        message: "No mid-word hash"
    }
}
// @from(Ln 238556, Col 0)
function Az4(A) {
    if (A.treeSitter) return {
        behavior: "passthrough",
        message: "Tree-sitter quote context is authoritative"
    };
    let {
        originalCommand: q
    } = A, K = !1, Y = !1, z = !1;
    for (let _ = 0; _ < q.length; _++) {
        let w = q[_];
        if (z) {
            z = !1;
            continue
        }
        if (K) {
            if (w === "'") K = !1;
            continue
        }
        if (w === "\\") {
            z = !0;
            continue
        }
        if (Y) {
            if (w === '"') Y = !1;
            continue
        }
        if (w === "'") {
            K = !0;
            continue
        }
        if (w === '"') {
            Y = !0;
            continue
        }
        if (w === "#") {
            let O = q.indexOf(`
`, _),
                $ = q.slice(_ + 1, O === -1 ? q.length : O);
            if (/['"]/.test($)) return d("tengu_bash_security_check_triggered", {
                checkId: w3.COMMENT_QUOTE_DESYNC
            }), {
                behavior: "ask",
                message: "Command contains quote characters inside a # comment which can desync quote tracking"
            };
            if (O === -1) break;
            _ = O
        }
    }
    return {
        behavior: "passthrough",
        message: "No comment quote desync"
    }
}
// @from(Ln 238610, Col 0)
function qz4(A) {
    let {
        originalCommand: q
    } = A;
    if (!q.includes(`
`) || !q.includes("#")) return {
        behavior: "passthrough",
        message: "No newline or no hash"
    };
    let K = !1,
        Y = !1,
        z = !1;
    for (let _ = 0; _ < q.length; _++) {
        let w = q[_];
        if (z) {
            z = !1;
            continue
        }
        if (w === "\\" && !K) {
            z = !0;
            continue
        }
        if (w === "'" && !Y) {
            K = !K;
            continue
        }
        if (w === '"' && !K) {
            Y = !Y;
            continue
        }
        if (w === `
` && (K || Y)) {
            let O = _ + 1,
                $ = q.indexOf(`
`, O),
                H = $ === -1 ? q.length : $;
            if (q.slice(O, H).trim().startsWith("#")) return d("tengu_bash_security_check_triggered", {
                checkId: w3.QUOTED_NEWLINE
            }), {
                behavior: "ask",
                message: "Command contains a quoted newline followed by a #-prefixed line, which can hide arguments from line-based permission checks"
            }
        }
    }
    return {
        behavior: "passthrough",
        message: "No quoted newline-hash pattern"
    }
}
// @from(Ln 238660, Col 0)
function Kz4(A) {
    let {
        originalCommand: q
    } = A, K = new Set(["command", "builtin", "noglob", "nocorrect"]), Y = q.trim(), z = Y.split(/\s+/), _ = "";
    for (let w of z) {
        if (/^[A-Za-z_]\w*=/.test(w)) continue;
        if (K.has(w)) continue;
        _ = w;
        break
    }
    if (Og9.has(_)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.ZSH_DANGEROUS_COMMANDS,
        subId: 1
    }), {
        behavior: "ask",
        message: `Command uses Zsh-specific '${_}' which can bypass security checks`
    };
    if (_ === "fc" && /\s-\S*e/.test(Y)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.ZSH_DANGEROUS_COMMANDS,
        subId: 2
    }), {
        behavior: "ask",
        message: "Command uses 'fc -e' which can execute arbitrary commands via editor"
    };
    return {
        behavior: "passthrough",
        message: "No Zsh dangerous commands"
    }
}
// @from(Ln 238690, Col 0)
function Rp6(A) {
    if (Yz4.test(A)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.CONTROL_CHARACTERS
    }), {
        behavior: "ask",
        message: "Command contains non-printable control characters that could be used to bypass security checks",
        isBashSecurityCheckForMisparsing: !0
    };
    if (X38(A)) return {
        behavior: "ask",
        message: "Command contains single-quoted backslash pattern that could bypass security checks",
        isBashSecurityCheckForMisparsing: !0
    };
    let {
        processedCommand: q
    } = ca(A, {
        quotedOnly: !0
    }), K = A.split(" ")[0] || "", {
        withDoubleQuotes: Y,
        fullyUnquoted: z,
        unquotedKeepQuoteChars: _
    } = bY4(q, K === "jq"), w = {
        originalCommand: A,
        baseCommand: K,
        unquotedContent: Y,
        fullyUnquotedContent: xY4(z),
        fullyUnquotedPreStrip: z,
        unquotedKeepQuoteChars: _
    }, O = [uY4, mY4, gY4, FY4];
    for (let J of O) {
        let M = J(w);
        if (M.behavior === "allow") return {
            behavior: "passthrough",
            message: M.decisionReason?.type === "other" ? M.decisionReason.reason : "Command allowed"
        };
        if (M.behavior !== "passthrough") return M.behavior === "ask" ? {
            ...M,
            isBashSecurityCheckForMisparsing: !0
        } : M
    }
    let $ = new Set([w01, _01]),
        H = [pY4, rY4, QY4, UY4, Az4, qz4, cY4, w01, lY4, iY4, dY4, _01, oY4, aY4, tY4, eY4, sY4, Kz4, nY4],
        j = null;
    for (let J of H) {
        let M = J(w);
        if (M.behavior === "ask") {
            if ($.has(J)) {
                if (j === null) j = M;
                continue
            }
            return {
                ...M,
                isBashSecurityCheckForMisparsing: !0
            }
        }
    }
    if (j !== null) return j;
    return {
        behavior: "passthrough",
        message: "Command passed all security checks"
    }
}
// @from(Ln 238752, Col 0)
async function O01(A, q) {
    let Y = (await ot.parse(A))?.getTreeSitterAnalysis() ?? null;
    if (!Y) return Rp6(A);
    if (Yz4.test(A)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.CONTROL_CHARACTERS
    }), {
        behavior: "ask",
        message: "Command contains non-printable control characters that could be used to bypass security checks",
        isBashSecurityCheckForMisparsing: !0
    };
    if (X38(A)) return {
        behavior: "ask",
        message: "Command contains single-quoted backslash pattern that could bypass security checks",
        isBashSecurityCheckForMisparsing: !0
    };
    let {
        processedCommand: z
    } = ca(A, {
        quotedOnly: !0
    }), _ = A.split(" ")[0] || "", w = Y.quoteContext, O = bY4(z, _ === "jq"), $ = w.withDoubleQuotes, H = w.fullyUnquoted, j = w.unquotedKeepQuoteChars, J = {
        originalCommand: A,
        baseCommand: _,
        unquotedContent: $,
        fullyUnquotedContent: xY4(H),
        fullyUnquotedPreStrip: H,
        unquotedKeepQuoteChars: j,
        treeSitter: Y
    };
    if (!Y.dangerousPatterns.hasHeredoc) {
        if (w.fullyUnquoted !== O.fullyUnquoted || w.withDoubleQuotes !== O.withDoubleQuotes)
            if (q) q();
            else d("tengu_tree_sitter_security_divergence", {
                quoteContextDivergence: !0
            })
    }
    let M = [uY4, mY4, gY4, FY4];
    for (let W of M) {
        let Z = W(J);
        if (Z.behavior === "allow") return {
            behavior: "passthrough",
            message: Z.decisionReason?.type === "other" ? Z.decisionReason.reason : "Command allowed"
        };
        if (Z.behavior !== "passthrough") return Z.behavior === "ask" ? {
            ...Z,
            isBashSecurityCheckForMisparsing: !0
        } : Z
    }
    let D = new Set([w01, _01]),
        X = [pY4, rY4, QY4, UY4, Az4, qz4, cY4, w01, lY4, iY4, dY4, _01, oY4, aY4, tY4, eY4, sY4, Kz4, nY4],
        P = null;
    for (let W of X) {
        let Z = W(J);
        if (Z.behavior === "ask") {
            if (D.has(W)) {
                if (P === null) P = Z;
                continue
            }
            return {
                ...Z,
                isBashSecurityCheckForMisparsing: !0
            }
        }
    }
    if (P !== null) return P;
    return {
        behavior: "passthrough",
        message: "Command passed all security checks"
    }
}
// @from(Ln 238821, Col 4)
lV8
// @from(Ln 238821, Col 9)
wg9
// @from(Ln 238821, Col 14)
Og9
// @from(Ln 238821, Col 19)
w3
// @from(Ln 238821, Col 23)
Jg9
// @from(Ln 238821, Col 28)
Dg9
// @from(Ln 238821, Col 33)
Yz4
// @from(Ln 238822, Col 4)
$01 = E(() => {
    V1();
    RJ();
    sw8();
    z01();
    lV8 = /\$\(.*<</, wg9 = [{
        pattern: /<\(/,
        message: "process substitution <()"
    }, {
        pattern: />\(/,
        message: "process substitution >()"
    }, {
        pattern: /=\(/,
        message: "Zsh process substitution =()"
    }, {
        pattern: /\$\(/,
        message: "$() command substitution"
    }, {
        pattern: /\$\{/,
        message: "${} parameter substitution"
    }, {
        pattern: /\$\[/,
        message: "$[] legacy arithmetic expansion"
    }, {
        pattern: /~\[/,
        message: "Zsh-style parameter expansion"
    }, {
        pattern: /\(e:/,
        message: "Zsh-style glob qualifiers"
    }, {
        pattern: /\(\+/,
        message: "Zsh glob qualifier with command execution"
    }, {
        pattern: /\}\s*always\s*\{/,
        message: "Zsh always block (try/always construct)"
    }, {
        pattern: /<#/,
        message: "PowerShell comment syntax"
    }], Og9 = new Set(["zmodload", "emulate", "sysopen", "sysread", "syswrite", "sysseek", "zpty", "ztcp", "zsocket", "mapfile", "zf_rm", "zf_mv", "zf_ln", "zf_chmod", "zf_chown", "zf_mkdir", "zf_rmdir", "zf_chgrp"]), w3 = {
        INCOMPLETE_COMMANDS: 1,
        JQ_SYSTEM_FUNCTION: 2,
        JQ_FILE_ARGUMENTS: 3,
        OBFUSCATED_FLAGS: 4,
        SHELL_METACHARACTERS: 5,
        DANGEROUS_VARIABLES: 6,
        NEWLINES: 7,
        DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION: 8,
        DANGEROUS_PATTERNS_INPUT_REDIRECTION: 9,
        DANGEROUS_PATTERNS_OUTPUT_REDIRECTION: 10,
        IFS_INJECTION: 11,
        GIT_COMMIT_SUBSTITUTION: 12,
        PROC_ENVIRON_ACCESS: 13,
        MALFORMED_TOKEN_INJECTION: 14,
        BACKSLASH_ESCAPED_WHITESPACE: 15,
        BRACE_EXPANSION: 16,
        CONTROL_CHARACTERS: 17,
        UNICODE_WHITESPACE: 18,
        MID_WORD_HASH: 19,
        ZSH_DANGEROUS_COMMANDS: 20,
        BACKSLASH_ESCAPED_OPERATORS: 21,
        COMMENT_QUOTE_DESYNC: 22,
        QUOTED_NEWLINE: 23
    };
    Jg9 = new Set([";", "|", "&", "<", ">"]);
    Dg9 = /[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]/;
    Yz4 = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/
})
// @from(Ln 238890, Col 0)
function _z4(A, q) {
    for (let K of A)
        if (K.startsWith("-") && !K.startsWith("--") && K.length > 2)
            for (let Y = 1; Y < K.length; Y++) {
                let z = "-" + K[Y];
                if (!q.includes(z)) return !1
            } else if (!q.includes(K)) return !1;
    return !0
}
// @from(Ln 238900, Col 0)
function Xg9(A, q) {
    let K = A.match(/^\s*sed\s+/);
    if (!K) return !1;
    let Y = A.slice(K[0].length),
        z = Fz(Y);
    if (!z.success) return !1;
    let _ = z.tokens,
        w = [];
    for (let H of _)
        if (typeof H === "string" && H.startsWith("-") && H !== "--") w.push(H);
    if (!_z4(w, ["-n", "--quiet", "--silent", "-E", "--regexp-extended", "-r", "-z", "--zero-terminated", "--posix"])) return !1;
    let $ = !1;
    for (let H of w) {
        if (H === "-n" || H === "--quiet" || H === "--silent") {
            $ = !0;
            break
        }
        if (H.startsWith("-") && !H.startsWith("--") && H.includes("n")) {
            $ = !0;
            break
        }
    }
    if (!$) return !1;
    if (q.length === 0) return !1;
    for (let H of q) {
        let j = H.split(";");
        for (let J of j)
            if (!Pg9(J.trim())) return !1
    }
    return !0
}
// @from(Ln 238932, Col 0)
function Pg9(A) {
    if (!A) return !1;
    return /^(?:\d+|\d+,\d+)?p$/.test(A)
}
// @from(Ln 238937, Col 0)
function zz4(A, q, K, Y) {
    let z = Y?.allowFileWrites ?? !1;
    if (!z && K) return !1;
    let _ = A.match(/^\s*sed\s+/);
    if (!_) return !1;
    let w = A.slice(_[0].length),
        O = Fz(w);
    if (!O.success) return !1;
    let $ = O.tokens,
        H = [];
    for (let f of $)
        if (typeof f === "string" && f.startsWith("-") && f !== "--") H.push(f);
    let j = ["-E", "--regexp-extended", "-r", "--posix"];
    if (z) j.push("-i", "--in-place");
    if (!_z4(H, j)) return !1;
    if (q.length !== 1) return !1;
    let J = q[0].trim();
    if (!J.startsWith("s")) return !1;
    let M = J.match(/^s\/(.*?)$/);
    if (!M) return !1;
    let D = M[1],
        X = 0,
        P = -1,
        W = 0;
    while (W < D.length) {
        if (D[W] === "\\") {
            W += 2;
            continue
        }
        if (D[W] === "/") X++, P = W;
        W++
    }
    if (X !== 2) return !1;
    let Z = D.slice(P + 1);
    if (!/^[gpimIM]*[1-9]?[gpimIM]*$/.test(Z)) return !1;
    return !0
}
// @from(Ln 238975, Col 0)
function xW6(A, q) {
    let K = q?.allowFileWrites ?? !1,
        Y;
    try {
        Y = Zg9(A)
    } catch (O) {
        return !1
    }
    let z = Wg9(A),
        _ = !1,
        w = !1;
    if (K) w = zz4(A, Y, z, {
        allowFileWrites: !0
    });
    else _ = Xg9(A, Y), w = zz4(A, Y, z);
    if (!_ && !w) return !1;
    for (let O of Y)
        if (w && O.includes(";")) return !1;
    for (let O of Y)
        if (Gg9(O)) return !1;
    return !0
}
// @from(Ln 238998, Col 0)
function Wg9(A) {
    let q = A.match(/^\s*sed\s+/);
    if (!q) return !1;
    let K = A.slice(q[0].length),
        Y = Fz(K);
    if (!Y.success) return !0;
    let z = Y.tokens;
    try {
        let _ = 0,
            w = !1;
        for (let O = 0; O < z.length; O++) {
            let $ = z[O];
            if (typeof $ !== "string" && typeof $ !== "object") continue;
            if (typeof $ === "object" && $ !== null && "op" in $ && $.op === "glob") return !0;
            if (typeof $ !== "string") continue;
            if (($ === "-e" || $ === "--expression") && O + 1 < z.length) {
                w = !0, O++;
                continue
            }
            if ($.startsWith("--expression=")) {
                w = !0;
                continue
            }
            if ($.startsWith("-e=")) {
                w = !0;
                continue
            }
            if ($.startsWith("-")) continue;
            if (_++, w) return !0;
            if (_ > 1) return !0
        }
        return !1
    } catch (_) {
        return !0
    }
}
// @from(Ln 239035, Col 0)
function Zg9(A) {
    let q = [],
        K = A.match(/^\s*sed\s+/);
    if (!K) return q;
    let Y = A.slice(K[0].length);
    if (/-e[wWe]/.test(Y) || /-w[eE]/.test(Y)) throw Error("Dangerous flag combination detected");
    let z = Fz(Y);
    if (!z.success) throw Error(`Malformed shell syntax: ${z.error}`);
    let _ = z.tokens;
    try {
        let w = !1,
            O = !1;
        for (let $ = 0; $ < _.length; $++) {
            let H = _[$];
            if (typeof H !== "string") continue;
            if ((H === "-e" || H === "--expression") && $ + 1 < _.length) {
                w = !0;
                let j = _[$ + 1];
                if (typeof j === "string") q.push(j), $++;
                continue
            }
            if (H.startsWith("--expression=")) {
                w = !0, q.push(H.slice(13));
                continue
            }
            if (H.startsWith("-e=")) {
                w = !0, q.push(H.slice(3));
                continue
            }
            if (H.startsWith("-")) continue;
            if (!w && !O) {
                q.push(H), O = !0;
                continue
            }
            break
        }
    } catch (w) {
        throw Error(`Failed to parse sed command: ${w instanceof Error?w.message:"Unknown error"}`)
    }
    return q
}
// @from(Ln 239077, Col 0)
function Gg9(A) {
    let q = A.trim();
    if (!q) return !1;
    if (/[^\x01-\x7F]/.test(q)) return !0;
    if (q.includes("{") || q.includes("}")) return !0;
    if (q.includes(`
`)) return !0;
    let K = q.indexOf("#");
    if (K !== -1 && !(K > 0 && q[K - 1] === "s")) return !0;
    if (/^!/.test(q) || /[/\d$]!/.test(q)) return !0;
    if (/\d\s*~\s*\d|,\s*~\s*\d|\$\s*~\s*\d/.test(q)) return !0;
    if (/^,/.test(q)) return !0;
    if (/,\s*[+-]/.test(q)) return !0;
    if (/s\\/.test(q) || /\\[|#%@]/.test(q)) return !0;
    if (/\\\/.*[wW]/.test(q)) return !0;
    if (/\/[^/]*\s+[wWeE]/.test(q)) return !0;
    if (/^s\//.test(q) && !/^s\/[^/]*\/[^/]*\/[^/]*$/.test(q)) return !0;
    if (/^s./.test(q) && /[wWeE]$/.test(q)) {
        if (!/^s([^\\\n]).*?\1.*?\1[^wWeE]*$/.test(q)) return !0
    }
    if (/^[wW]\s*\S+/.test(q) || /^\d+\s*[wW]\s*\S+/.test(q) || /^\$\s*[wW]\s*\S+/.test(q) || /^\/[^/]*\/[IMim]*\s*[wW]\s*\S+/.test(q) || /^\d+,\d+\s*[wW]\s*\S+/.test(q) || /^\d+,\$\s*[wW]\s*\S+/.test(q) || /^\/[^/]*\/[IMim]*,\/[^/]*\/[IMim]*\s*[wW]\s*\S+/.test(q)) return !0;
    if (/^e/.test(q) || /^\d+\s*e/.test(q) || /^\$\s*e/.test(q) || /^\/[^/]*\/[IMim]*\s*e/.test(q) || /^\d+,\d+\s*e/.test(q) || /^\d+,\$\s*e/.test(q) || /^\/[^/]*\/[IMim]*,\/[^/]*\/[IMim]*\s*e/.test(q)) return !0;
    let Y = q.match(/s([^\\\n]).*?\1.*?\1(.*?)$/);
    if (Y) {
        let _ = Y[2] || "";
        if (_.includes("w") || _.includes("W")) return !0;
        if (_.includes("e") || _.includes("E")) return !0
    }
    if (q.match(/y([^\\\n])/)) {
        if (/[wWeE]/.test(q)) return !0
    }
    return !1
}
// @from(Ln 239111, Col 0)
function wz4(A, q) {
    let K = EO(A.command);
    for (let Y of K) {
        let z = Y.trim();
        if (z.split(/\s+/)[0] !== "sed") continue;
        let w = q.mode === "acceptEdits";
        if (!xW6(z, {
                allowFileWrites: w
            })) return {
            behavior: "ask",
            message: "sed command requires approval (contains potentially dangerous operations)",
            decisionReason: {
                type: "other",
                reason: "sed command contains operations that require explicit approval (e.g., write commands, execute commands)"
            }
        }
    }
    return {
        behavior: "passthrough",
        message: "No dangerous sed operations detected"
    }
}
// @from(Ln 239133, Col 4)
H01 = E(() => {
    jZ();
    RJ()
})
// @from(Ln 239145, Col 0)
function Ng9(A, q, K) {
    let Y = hp6[A],
        z = Y(q);
    for (let _ of z) {
        let w = at(_.replace(/^['"]|['"]$/g, "")),
            O = fg9(w) ? w : Tg9(K, w);
        if (Jz4(O)) return {
            behavior: "ask",
            message: `Dangerous ${A} operation detected: '${O}'

This command would remove a critical system directory. This requires explicit approval and cannot be auto-allowed by permission rules.`,
            decisionReason: {
                type: "other",
                reason: `Dangerous ${A} operation on critical path: ${O}`
            },
            suggestions: []
        }
    }
    return {
        behavior: "passthrough",
        message: `No dangerous removals detected for ${A} command`
    }
}
// @from(Ln 239169, Col 0)
function P_(A) {
    let q = [],
        K = !1;
    for (let Y of A)
        if (K) q.push(Y);
        else if (Y === "--") K = !0;
    else if (!Y?.startsWith("-")) q.push(Y);
    return q
}
// @from(Ln 239179, Col 0)
function Oz4(A, q, K = []) {
    let Y = [],
        z = !1,
        _ = !1;
    for (let w = 0; w < A.length; w++) {
        let O = A[w];
        if (O === void 0 || O === null) continue;
        if (!_ && O === "--") {
            _ = !0;
            continue
        }
        if (!_ && O.startsWith("-")) {
            let $ = O.split("=")[0];
            if ($ && ["-e", "--regexp", "-f", "--file"].includes($)) z = !0;
            if ($ && q.has($) && !O.includes("=")) w++;
            continue
        }
        if (!z) {
            z = !0;
            continue
        }
        Y.push(O)
    }
    return Y.length > 0 ? Y : K
}
// @from(Ln 239205, Col 0)
function Eg9(A, q, K, Y, z, _) {
    let w = hp6[A],
        O = w(q),
        $ = _ ?? Sp6[A],
        H = kg9[A];
    if (H && !H(q)) return {
        behavior: "ask",
        message: `${A} with flags requires manual approval to ensure path safety. For security, Claude Code cannot automatically validate ${A} commands that use flags, as some flags like --target-directory=PATH can bypass path validation.`,
        decisionReason: {
            type: "other",
            reason: `${A} command with flags requires manual approval`
        }
    };
    if (z && $ !== "read") return {
        behavior: "ask",
        message: "Commands that change directories and perform write operations require explicit approval to ensure paths are evaluated correctly. For security, Claude Code cannot automatically determine the final working directory when 'cd' is used in compound commands.",
        decisionReason: {
            type: "other",
            reason: "Compound command contains cd with write operation - manual approval required to prevent path resolution bypass"
        }
    };
    for (let j of O) {
        let {
            allowed: J,
            resolvedPath: M,
            decisionReason: D
        } = rV8(j, K, Y, $);
        if (!J) {
            let X = Array.from(uW6(Y)),
                P = nV8(X),
                W = D?.type === "other" ? D.reason : `${A} in '${M}' was blocked. For security, Claude Code may only ${Vg9[A]} the allowed working directories for this session: ${P}.`;
            if (D?.type === "rule") return {
                behavior: "deny",
                message: W,
                decisionReason: D
            };
            return {
                behavior: "ask",
                message: W,
                blockedPath: M,
                decisionReason: D
            }
        }
    }
    return {
        behavior: "passthrough",
        message: `Path validation passed for ${A} command`
    }
}
// @from(Ln 239255, Col 0)
function jz4(A, q) {
    return (K, Y, z, _) => {
        let w = Eg9(A, K, Y, z, _, q);
        if (w.behavior === "deny") return w;
        if (A === "rm" || A === "rmdir") {
            let O = Ng9(A, K, Y);
            if (O.behavior !== "passthrough") return O
        }
        if (w.behavior === "passthrough") return w;
        if (w.behavior === "ask") {
            let O = q ?? Sp6[A],
                $ = [];
            if (w.blockedPath)
                if (O === "read") {
                    let H = dp(w.blockedPath),
                        j = ez1(H, "session");
                    if (j) $.push(j)
                } else $.push({
                    type: "addDirectories",
                    directories: [dp(w.blockedPath)],
                    destination: "session"
                });
            if (O === "write" || O === "create") $.push({
                type: "setMode",
                mode: "acceptEdits",
                destination: "session"
            });
            w.suggestions = $
        }
        return w
    }
}
// @from(Ln 239288, Col 0)
function yg9(A) {
    let q = Fz(A, (z) => `$${z}`);
    if (!q.success) return [];
    let K = q.tokens,
        Y = [];
    for (let z of K)
        if (typeof z === "string") Y.push(z);
        else if (typeof z === "object" && z !== null && "op" in z && z.op === "glob" && "pattern" in z) Y.push(String(z.pattern));
    return Y
}
// @from(Ln 239299, Col 0)
function Lg9(A, q, K, Y) {
    let z = Ac(A),
        _ = yg9(z);
    if (_.length === 0) return {
        behavior: "passthrough",
        message: "Empty command - no paths to validate"
    };
    let [w, ...O] = _;
    if (!w || !Hz4.includes(w)) return {
        behavior: "passthrough",
        message: `Command '${w}' is not a path-restricted command`
    };
    let $ = w === "sed" && xW6(z) ? "read" : void 0;
    return jz4(w, $)(O, q, K, Y)
}
// @from(Ln 239315, Col 0)
function Rg9(A, q, K, Y) {
    let z = xg9(A.argv);
    if (z.length === 0) return {
        behavior: "passthrough",
        message: "Empty command - no paths to validate"
    };
    let [_, ...w] = z;
    if (!_ || !Hz4.includes(_)) return {
        behavior: "passthrough",
        message: `Command '${_}' is not a path-restricted command`
    };
    let O = _ === "sed" && xW6(Ac(A.text)) ? "read" : void 0;
    return jz4(_, O)(w, q, K, Y)
}
// @from(Ln 239330, Col 0)
function hg9(A, q, K, Y) {
    if (Y && A.length > 0) return {
        behavior: "ask",
        message: "Commands that change directories and write via output redirection require explicit approval to ensure paths are evaluated correctly. For security, Claude Code cannot automatically determine the final working directory when 'cd' is used in compound commands.",
        decisionReason: {
            type: "other",
            reason: "Compound command contains cd with output redirection - manual approval required to prevent path resolution bypass"
        }
    };
    for (let {
            target: z
        }
        of A) {
        if (z === "/dev/null") continue;
        let {
            allowed: _,
            resolvedPath: w,
            decisionReason: O
        } = rV8(z, q, K, "create");
        if (!_) {
            let $ = Array.from(uW6(K)),
                H = nV8($),
                j = O?.type === "other" ? O.reason : O?.type === "rule" ? `Output redirection to '${w}' was blocked by a deny rule.` : `Output redirection to '${w}' was blocked. For security, Claude Code may only write to files in the allowed working directories for this session: ${H}.`;
            if (O?.type === "rule") return {
                behavior: "deny",
                message: j,
                decisionReason: O
            };
            return {
                behavior: "ask",
                message: j,
                blockedPath: w,
                suggestions: [{
                    type: "addDirectories",
                    directories: [dp(w)],
                    destination: "session"
                }]
            }
        }
    }
    return {
        behavior: "passthrough",
        message: "No unsafe redirections found"
    }
}
// @from(Ln 239376, Col 0)
function j01(A, q, K, Y, z, _) {
    if (!_ && />>\s*>\s*\(|>\s*>\s*\(|<\s*\(/.test(A.command)) return {
        behavior: "ask",
        message: "Process substitution (>(...) or <(...)) can execute arbitrary commands and requires manual approval",
        decisionReason: {
            type: "other",
            reason: "Process substitution requires manual approval"
        }
    };
    let {
        redirections: w,
        hasDangerousRedirection: O
    } = z ? Sg9(z) : ik(A.command);
    if (O) return {
        behavior: "ask",
        message: "Shell expansion syntax in paths requires manual approval",
        decisionReason: {
            type: "other",
            reason: "Shell expansion syntax in paths requires manual approval"
        }
    };
    let $ = hg9(w, q, K, Y);
    if ($.behavior !== "passthrough") return $;
    if (_)
        for (let H of _) {
            let j = Rg9(H, q, K, Y);
            if (j.behavior === "ask" || j.behavior === "deny") return j
        } else {
            let H = EO(A.command);
            for (let j of H) {
                let J = Lg9(j, q, K, Y);
                if (J.behavior === "ask" || J.behavior === "deny") return J
            }
        }
    return {
        behavior: "passthrough",
        message: "All path commands validated successfully"
    }
}
// @from(Ln 239416, Col 0)
function Sg9(A) {
    let q = [];
    for (let K of A) switch (K.op) {
        case ">":
        case ">|":
        case "&>":
            q.push({
                target: K.target,
                operator: ">"
            });
            break;
        case ">>":
        case "&>>":
            q.push({
                target: K.target,
                operator: ">>"
            });
            break;
        case ">&":
            if (!/^\d+$/.test(K.target)) q.push({
                target: K.target,
                operator: ">"
            });
            break;
        case "<":
        case "<<":
        case "<&":
        case "<<<":
            break
    }
    return {
        redirections: q,
        hasDangerousRedirection: !1
    }
}
// @from(Ln 239452, Col 0)
function Cg9(A) {
    let q = 1;
    while (q < A.length) {
        let K = A[q],
            Y = A[q + 1];
        if (K === "--foreground" || K === "--preserve-status" || K === "--verbose") q++;
        else if (/^--(?:kill-after|signal)=[A-Za-z0-9_.+-]+$/.test(K)) q++;
        else if ((K === "--kill-after" || K === "--signal") && Y && $z4.test(Y)) q += 2;
        else if (K === "--") {
            q++;
            break
        } else if (K.startsWith("--")) return -1;
        else if (K === "-v") q++;
        else if ((K === "-k" || K === "-s") && Y && $z4.test(Y)) q += 2;
        else if (/^-[ks][A-Za-z0-9_.+-]+$/.test(K)) q++;
        else if (K.startsWith("-")) return -1;
        else break
    }
    return q
}
// @from(Ln 239473, Col 0)
function Ig9(A) {
    let q = 1;
    while (q < A.length) {
        let K = A[q];
        if (/^-[ioe]$/.test(K) && A[q + 1]) q += 2;
        else if (/^-[ioe]./.test(K)) q++;
        else if (/^--(input|output|error)=/.test(K)) q++;
        else if (K.startsWith("-")) return -1;
        else break
    }
    return q > 1 && q < A.length ? q : -1
}
// @from(Ln 239486, Col 0)
function bg9(A) {
    let q = 1;
    while (q < A.length) {
        let K = A[q];
        if (K.includes("=") && !K.startsWith("-")) q++;
        else if (K === "-i" || K === "-0" || K === "-v") q++;
        else if (K === "-u" && A[q + 1]) q += 2;
        else if (K.startsWith("-")) return -1;
        else break
    }
    return q < A.length ? q : -1
}
// @from(Ln 239499, Col 0)
function xg9(A) {
    let q = A;
    for (;;)
        if (q[0] === "time" || q[0] === "nohup") q = q.slice(q[1] === "--" ? 2 : 1);
        else if (q[0] === "timeout") {
        let K = Cg9(q);
        if (K < 0 || !q[K] || !/^\d+(?:\.\d+)?[smhd]?$/.test(q[K])) return q;
        q = q.slice(K + 1)
    } else if (q[0] === "nice")
        if (q[1] === "-n" && q[2] && /^-?\d+$/.test(q[2])) q = q.slice(q[3] === "--" ? 4 : 3);
        else if (q[1] && /^-\d+$/.test(q[1])) q = q.slice(q[2] === "--" ? 3 : 2);
    else q = q.slice(q[1] === "--" ? 2 : 1);
    else if (q[0] === "stdbuf") {
        let K = Ig9(q);
        if (K < 0) return q;
        q = q.slice(K)
    } else if (q[0] === "env") {
        let K = bg9(q);
        if (K < 0) return q;
        q = q.slice(K)
    } else return q
}
// @from(Ln 239521, Col 4)
hp6
// @from(Ln 239521, Col 9)
Hz4
// @from(Ln 239521, Col 14)
Vg9
// @from(Ln 239521, Col 19)
Sp6
// @from(Ln 239521, Col 24)
kg9
// @from(Ln 239521, Col 29)
$z4