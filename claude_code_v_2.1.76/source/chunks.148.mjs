
// @from(Ln 375464, Col 0)
class ui6 {
    toolDefinitions;
    canUseTool;
    tools = [];
    toolUseContext;
    hasErrored = !1;
    erroredToolDescription = "";
    siblingAbortController;
    discarded = !1;
    progressAvailableResolve;
    constructor(A, q, K) {
        this.toolDefinitions = A;
        this.canUseTool = q;
        this.toolUseContext = K, this.siblingAbortController = Wm(K.abortController)
    }
    discard() {
        this.discarded = !0
    }
    addTool(A, q) {
        let K = dK(this.toolDefinitions, A.name);
        if (!K) {
            this.tools.push({
                id: A.id,
                block: A,
                assistantMessage: q,
                status: "completed",
                isConcurrencySafe: !0,
                pendingProgress: [],
                results: [p1({
                    content: [{
                        type: "tool_result",
                        content: `<tool_use_error>Error: No such tool available: ${A.name}</tool_use_error>`,
                        is_error: !0,
                        tool_use_id: A.id
                    }],
                    toolUseResult: `Error: No such tool available: ${A.name}`,
                    sourceToolAssistantUUID: q.uuid
                })]
            });
            return
        }
        A.input = PE1(K, A.input);
        let Y = K.inputSchema.safeParse(A.input),
            z = Y?.success ? (() => {
                try {
                    return Boolean(K.isConcurrencySafe(Y.data))
                } catch {
                    return !1
                }
            })() : !1;
        this.tools.push({
            id: A.id,
            block: A,
            assistantMessage: q,
            status: "queued",
            isConcurrencySafe: z,
            pendingProgress: []
        }), this.processQueue()
    }
    canExecuteTool(A) {
        let q = this.tools.filter((K) => K.status === "executing");
        return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
    }
    async processQueue() {
        for (let A of this.tools) {
            if (A.status !== "queued") continue;
            if (this.canExecuteTool(A.isConcurrencySafe)) await this.executeTool(A);
            else if (!A.isConcurrencySafe) break
        }
    }
    createSyntheticErrorMessage(A, q, K) {
        if (q === "user_interrupted") return p1({
            content: [{
                type: "tool_result",
                content: QT6(h96),
                is_error: !0,
                tool_use_id: A
            }],
            toolUseResult: "User rejected tool use",
            sourceToolAssistantUUID: K.uuid
        });
        if (q === "streaming_fallback") return p1({
            content: [{
                type: "tool_result",
                content: "<tool_use_error>Error: Streaming fallback - tool execution discarded</tool_use_error>",
                is_error: !0,
                tool_use_id: A
            }],
            toolUseResult: "Streaming fallback - tool execution discarded",
            sourceToolAssistantUUID: K.uuid
        });
        let Y = this.erroredToolDescription,
            z = Y ? `Cancelled: parallel tool call ${Y} errored` : "Cancelled: parallel tool call errored";
        return p1({
            content: [{
                type: "tool_result",
                content: `<tool_use_error>${z}</tool_use_error>`,
                is_error: !0,
                tool_use_id: A
            }],
            toolUseResult: z,
            sourceToolAssistantUUID: K.uuid
        })
    }
    getAbortReason(A) {
        if (this.discarded) return "streaming_fallback";
        if (this.hasErrored) return "sibling_error";
        if (this.toolUseContext.abortController.signal.aborted) {
            if (this.toolUseContext.abortController.signal.reason === "interrupt") return this.getToolInterruptBehavior(A) === "cancel" ? "user_interrupted" : null;
            return "user_interrupted"
        }
        return null
    }
    getToolInterruptBehavior(A) {
        let q = dK(this.toolDefinitions, A.block.name);
        if (!q?.interruptBehavior) return "block";
        try {
            return q.interruptBehavior()
        } catch {
            return "block"
        }
    }
    getToolDescription(A) {
        let q = A.block.input,
            K = q?.command ?? q?.file_path ?? q?.pattern ?? "";
        if (typeof K === "string" && K.length > 0) {
            let Y = K.length > 40 ? K.slice(0, 40) + "…" : K;
            return `${A.block.name}(${Y})`
        }
        return A.block.name
    }
    updateInterruptibleState() {
        let A = this.tools.filter((q) => q.status === "executing");
        this.toolUseContext.setHasInterruptibleToolInProgress?.(A.length > 0 && A.every((q) => this.getToolInterruptBehavior(q) === "cancel"))
    }
    async executeTool(A) {
        A.status = "executing", this.toolUseContext.setInProgressToolUseIDs((_) => new Set([..._, A.id])), this.updateInterruptibleState();
        let q = [],
            K = [],
            z = (async () => {
                let _ = this.getAbortReason(A);
                if (_) {
                    q.push(this.createSyntheticErrorMessage(A.id, _, A.assistantMessage)), A.results = q, A.contextModifiers = K, A.status = "completed", this.updateInterruptibleState();
                    return
                }
                let w = Wm(this.siblingAbortController);
                w.signal.addEventListener("abort", () => {
                    if (w.signal.reason !== "sibling_error" && !this.toolUseContext.abortController.signal.aborted && !this.discarded) this.toolUseContext.abortController.abort(w.signal.reason)
                }, {
                    once: !0
                });
                let O = Wi6(A.block, A.assistantMessage, this.canUseTool, {
                        ...this.toolUseContext,
                        abortController: w
                    }),
                    $ = !1;
                for await (let H of O) {
                    let j = this.getAbortReason(A);
                    if (j && !$) {
                        q.push(this.createSyntheticErrorMessage(A.id, j, A.assistantMessage));
                        break
                    }
                    if (H.message.type === "user" && Array.isArray(H.message.message.content) && H.message.message.content.some((M) => M.type === "tool_result" && M.is_error === !0)) {
                        if ($ = !0, A.block.name === Q7) this.hasErrored = !0, this.erroredToolDescription = this.getToolDescription(A), this.siblingAbortController.abort("sibling_error")
                    }
                    if (H.message)
                        if (H.message.type === "progress") {
                            if (A.pendingProgress.push(H.message), this.progressAvailableResolve) this.progressAvailableResolve(), this.progressAvailableResolve = void 0
                        } else q.push(H.message);
                    if (H.contextModifier) K.push(H.contextModifier.modifyContext)
                }
                if (A.results = q, A.contextModifiers = K, A.status = "completed", this.updateInterruptibleState(), !A.isConcurrencySafe && K.length > 0)
                    for (let H of K) this.toolUseContext = H(this.toolUseContext)
            })();
        A.promise = z, z.finally(() => {
            this.processQueue()
        })
    }* getCompletedResults() {
        if (this.discarded) return;
        for (let A of this.tools) {
            while (A.pendingProgress.length > 0) yield {
                message: A.pendingProgress.shift(),
                newContext: this.toolUseContext
            };
            if (A.status === "yielded") continue;
            if (A.status === "completed" && A.results) {
                A.status = "yielded";
                for (let q of A.results) yield {
                    message: q,
                    newContext: this.toolUseContext
                };
                umY(this.toolUseContext, A.id)
            } else if (A.status === "executing" && !A.isConcurrencySafe) break
        }
    }
    hasPendingProgress() {
        return this.tools.some((A) => A.pendingProgress.length > 0)
    }
    async * getRemainingResults() {
        if (this.discarded) return;
        while (this.hasUnfinishedTools()) {
            await this.processQueue();
            for (let A of this.getCompletedResults()) yield A;
            if (this.hasExecutingTools() && !this.hasCompletedResults() && !this.hasPendingProgress()) {
                let A = this.tools.filter((K) => K.status === "executing" && K.promise).map((K) => K.promise),
                    q = new Promise((K) => {
                        this.progressAvailableResolve = K
                    });
                if (A.length > 0) await Promise.race([...A, q])
            }
        }
        for (let A of this.getCompletedResults()) yield A
    }
    hasCompletedResults() {
        return this.tools.some((A) => A.status === "completed")
    }
    hasExecutingTools() {
        return this.tools.some((A) => A.status === "executing")
    }
    hasUnfinishedTools() {
        return this.tools.some((A) => A.status !== "yielded")
    }
    getUpdatedContext() {
        return this.toolUseContext
    }
}
// @from(Ln 375691, Col 0)
function umY(A, q) {
    A.setInProgressToolUseIDs((K) => new Set([...K].filter((Y) => Y !== q)))
}
// @from(Ln 375694, Col 4)
$Kq = E(() => {
    SF8();
    JA();
    U$()
})
// @from(Ln 375700, Col 0)
function Tp8() {
    if (!Zp8) Zp8 = x6("perf_hooks").performance;
    return Zp8
}
// @from(Ln 375705, Col 0)
function vp8() {
    if (!mi6) return;
    Tp8().clearMarks(), fp8.clear(), Gp8 = null, jKq++, K5("query_user_input_received")
}
// @from(Ln 375710, Col 0)
function K5(A) {
    if (!mi6) return;
    let q = Tp8();
    if (q.mark(A), fp8.set(A, process.memoryUsage()), A === "query_first_chunk_received" && Gp8 === null) {
        let K = q.getEntriesByType("mark");
        if (K.length > 0) Gp8 = K[K.length - 1]?.startTime ?? 0
    }
}
// @from(Ln 375719, Col 0)
function JKq() {
    if (!mi6) return;
    K5("query_profile_end")
}
// @from(Ln 375724, Col 0)
function Y16(A) {
    return A.toFixed(3)
}
// @from(Ln 375728, Col 0)
function HKq(A) {
    return (A / 1024 / 1024).toFixed(2)
}
// @from(Ln 375732, Col 0)
function mmY(A, q) {
    if (q === "query_user_input_received") return "";
    if (A > 1000) return " ⚠️  VERY SLOW";
    if (A > 100) return " ⚠️  SLOW";
    if (q.includes("git_status") && A > 50) return " ⚠️  git status";
    if (q.includes("tool_schema") && A > 50) return " ⚠️  tool schemas";
    if (q.includes("client_creation") && A > 50) return " ⚠️  client creation";
    return ""
}
// @from(Ln 375742, Col 0)
function BmY() {
    if (!mi6) return "Query profiling not enabled (set CLAUDE_CODE_PROFILE_QUERY=1)";
    let q = Tp8().getEntriesByType("mark");
    if (q.length === 0) return "No query profiling checkpoints recorded";
    let K = [];
    K.push("=".repeat(80)), K.push(`QUERY PROFILING REPORT - Query #${jKq}`), K.push("=".repeat(80)), K.push("");
    let Y = q[0]?.startTime ?? 0,
        z = Y,
        _ = 0,
        w = 0;
    for (let H of q) {
        let j = H.startTime - Y,
            J = Y16(j),
            M = H.startTime - z,
            D = Y16(M),
            X = fp8.get(H.name),
            P = mmY(M, H.name),
            W = X ? ` | RSS: ${HKq(X.rss)}MB, Heap: ${HKq(X.heapUsed)}MB` : "";
        if (K.push(`[+${J.padStart(10)}ms] (+${D.padStart(9)}ms) ${H.name}${P}${W}`), H.name === "query_api_request_sent") _ = j;
        if (H.name === "query_first_chunk_received") w = j;
        z = H.startTime
    }
    let O = q[q.length - 1],
        $ = O ? O.startTime - Y : 0;
    if (K.push(""), K.push("-".repeat(80)), w > 0) {
        let H = _,
            j = w - _,
            J = (H / w * 100).toFixed(1),
            M = (j / w * 100).toFixed(1);
        K.push(`Total TTFT: ${Y16(w)}ms`), K.push(`  - Pre-request overhead: ${Y16(H)}ms (${J}%)`), K.push(`  - Network latency: ${Y16(j)}ms (${M}%)`)
    } else K.push(`Total time: ${Y16($)}ms`);
    return K.push(gmY(q, Y)), K.push("=".repeat(80)), K.join(`
`)
}
// @from(Ln 375777, Col 0)
function gmY(A, q) {
    let K = [{
            name: "Context loading",
            start: "query_context_loading_start",
            end: "query_context_loading_end"
        }, {
            name: "Microcompact",
            start: "query_microcompact_start",
            end: "query_microcompact_end"
        }, {
            name: "Autocompact",
            start: "query_autocompact_start",
            end: "query_autocompact_end"
        }, {
            name: "Query setup",
            start: "query_setup_start",
            end: "query_setup_end"
        }, {
            name: "Tool schemas",
            start: "query_tool_schema_build_start",
            end: "query_tool_schema_build_end"
        }, {
            name: "Message normalization",
            start: "query_message_normalization_start",
            end: "query_message_normalization_end"
        }, {
            name: "Client creation",
            start: "query_client_creation_start",
            end: "query_client_creation_end"
        }, {
            name: "Network TTFB",
            start: "query_api_request_sent",
            end: "query_first_chunk_received"
        }, {
            name: "Tool execution",
            start: "query_tool_execution_start",
            end: "query_tool_execution_end"
        }],
        Y = new Map(A.map((w) => [w.name, w.startTime - q])),
        z = [];
    z.push(""), z.push("PHASE BREAKDOWN:");
    for (let w of K) {
        let O = Y.get(w.start),
            $ = Y.get(w.end);
        if (O !== void 0 && $ !== void 0) {
            let H = $ - O,
                j = "█".repeat(Math.min(Math.ceil(H / 10), 50));
            z.push(`  ${w.name.padEnd(22)} ${Y16(H).padStart(10)}ms ${j}`)
        }
    }
    let _ = Y.get("query_api_request_sent");
    if (_ !== void 0) z.push(""), z.push(`  ${"Total pre-API overhead".padEnd(22)} ${Y16(_).padStart(10)}ms`);
    return z.join(`
`)
}
// @from(Ln 375833, Col 0)
function MKq() {
    if (!mi6) return;
    k(BmY())
}
// @from(Ln 375837, Col 4)
mi6 = !1
// @from(Ln 375838, Col 4)
fp8
// @from(Ln 375838, Col 9)
jKq = 0
// @from(Ln 375839, Col 4)
Gp8 = null
// @from(Ln 375840, Col 4)
Zp8 = null
// @from(Ln 375841, Col 4)
qv6 = E(() => {
    H1();
    fp8 = new Map
})
// @from(Ln 375846, Col 0)
function sE1(A) {
    return `You are now acting as the memory extraction subagent. Any prior instruction to not write memory files applies to the main conversation — in this role, writing is your job. Analyze the most recent ~${A} messages above and use them to update your persistent memory systems.`
}
// @from(Ln 375850, Col 0)
function DKq(A) {
    return [sE1(A), "", "## You MUST save memories when:", "- You encounter information that might be useful in future conversations. Whenever you find new information, think to yourself whether it would be helpful to have if you started a new conversation tomorrow. If the answer is yes, save it immediately before continuing work on the task.", `- When the user describes what they are working on, their goals, or the broader context of their project (e.g., "I'm building...", "we're migrating to...", "the goal is..."), save this so you can reference it in future sessions.`, "- When in doubt about whether something is worth saving, save it — it is better to prune and curate memories later than it is to fail to remember and have users correct you later.", "", "## What to save in memories:", "- Reusable patterns and conventions within the project that are not otherwise documented in the CLAUDE.md files", "- Project or goal information that might help you understand the intent of future work", "- Architectural decisions, important file paths, and project structure", "- User preferences for workflow, tools, or communication style. Especially if the user corrects or guides you during the conversation.", "- Solutions to problems that are likely to recur or insights that may help you with future debugging.", "- Any information the user explicitly has asked you to remember for later.", "", "## What not to save in memories:", "- Ephemeral task details: information that is only relevant to the current task at hand like in-progress work or temporary state", "- Information that duplicates or contradicts existing CLAUDE.md instructions.", "", "## Explicit user requests:", '- If a user explicitly asks you to remember a piece of information, you MUST save it immediately. Messages like this will often begin with "never...", "always...", "next time...", "remember..." etc.', "- If a user explicitly asks you to forget or stop remembering information, you MUST find and remove the relevant entry from the appropriate memory.", "", "## How to save memories:", "- Organize memory semantically by topic, not chronologically", "- Use the Write and Edit tools to update your memory files", "- `MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated, so keep it concise", "- Create separate topic files (e.g., `debugging.md`, `patterns.md`) for detailed notes and link to them from MEMORY.md", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."].join(`
`)
}
// @from(Ln 375855, Col 0)
function XKq(A) {
    return [sE1(A), "", "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.", "", ...RD1, ..._36, "", "## How to save memories", "", "Saving a memory is a two-step process:", "", "**Step 1** — write the memory to its own file (e.g., `user_role.md`, `feedback_testing.md`) using this frontmatter format:", "", ...w36, "", "**Step 2** — add a pointer to that file in `MEMORY.md`. `MEMORY.md` is an index, not a memory — it should contain only links to memory files with brief descriptions. It has no frontmatter. Never write memory content directly into `MEMORY.md`.", "", "- `MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated, so keep the index concise", "- Organize memory semantically by topic, not chronologically", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."].join(`
`)
}
// @from(Ln 375860, Col 0)
function PKq(A) {
    return [sE1(A), "", "## You MUST save memories when:", "- You encounter information that might be useful in future conversations. Whenever you find new information, think to yourself whether it would be helpful to have if you started a new conversation tomorrow. If the answer is yes, save it immediately before continuing work on the task.", `- When the user describes what they are working on, their goals, or the broader context of their project (e.g., "I'm building...", "we're migrating to...", "the goal is..."), save this so you can reference it in future sessions.`, "- When in doubt about whether something is worth saving, save it — it is better to prune and curate memories later than it is to fail to remember and have users correct you later.", "", "## What to save in user memory (private):", "- User preferences for workflow, tools, or communication style. Especially if the user corrects or guides you during the conversation.", "- Information that might help you understand the user's personal projects and goals.", "- Solutions to problems you have encountered with the current user that are unlikely to recur for other users.", "- Any information the user has explicitly asked you to remember.", "", "## What to save in team memory (shared):", "- Reusable patterns and conventions within the project that are not otherwise documented in the CLAUDE.md files.", "- Project or goal information that might help you understand the intent of future and ongoing work within the user's organization.", "- Architectural decisions, important file paths, and project structure.", "- Solutions to problems that are likely to recur across users or conversations.", "- Insights that may help you with future debugging conversations with all users that might contribute to this project.", "- Any information the user explicitly has asked you to remember for the team or commit to team memory.", "", "## What not to save:", "- You MUST avoid saving sensitive data within shared team memories. For example, never save API keys or user credentials.", "- Ephemeral task details: information that is only relevant to the current task at hand like in-progress work or temporary state.", "- User-specific preferences in team memory: Not all new information will be useful to all members of the user's organization. For example, one user might prefer a functional programming style and another might prefer OOP. If you determine that a memory is user-specific, save it to user memory instead.", "- Information that duplicates or contradicts existing CLAUDE.md instructions.", "", "## Choosing between user memory and team memory:", '- If the user explicitly says "remember" or "save", use user memory.', '- If the user explicitly says "remember for the team" or "save to team memory", use team memory.', "- If the information is about personal preferences, style, or workflow specific to this user, use user memory.", "- If the information is about project conventions, architecture, or shared knowledge, use team memory.", "- If unclear, ask which memory to use.", "", "## Explicit user requests:", '- If a user explicitly asks you to remember a piece of information, you MUST save it immediately. Messages like this will often begin with "never...", "always...", "next time...", "remember..." etc.', "- If a user explicitly asks you to forget or stop remembering information, you MUST find and remove the relevant entry from the appropriate memory.", "", "## How to save memories:", "- Organize memory semantically by topic, not chronologically", "- Use the Write and Edit tools to update your memory files", "- `MEMORY.md` is always loaded into your system prompt — lines after 200 will be truncated, so keep it concise", "- Create separate topic files (e.g., `debugging.md`, `patterns.md`) for detailed notes and link to them from MEMORY.md", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."].join(`
`)
}
// @from(Ln 375865, Col 0)
function WKq(A) {
    return [sE1(A), "", "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.", "", ...LD1, ..._36, "- You MUST avoid saving sensitive data within shared team memories. For example, never save API keys or user credentials.", "", "## How to save memories", "", "Saving a memory is a two-step process:", "", "**Step 1** — write the memory to its own file in the chosen directory (private or team, per the type's scope guidance) using this frontmatter format:", "", ...w36, "", "**Step 2** — add a pointer to that file in the same directory's `MEMORY.md`. Each directory (private and team) has its own `MEMORY.md` index — these contain only links to memory files with brief descriptions. They have no frontmatter. Never write memory content directly into a `MEMORY.md`.", "", "- Both `MEMORY.md` indexes are loaded into your system prompt — lines after 200 will be truncated, so keep them concise", "- Organize memory semantically by topic, not chronologically", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."].join(`
`)
}
// @from(Ln 375869, Col 4)
ZKq = E(() => {
    jF6()
})
// @from(Ln 375872, Col 4)
Vp8 = {}
// @from(Ln 375879, Col 0)
function Np8(A) {
    return A.type === "user" || A.type === "assistant"
}
// @from(Ln 375883, Col 0)
function QmY(A, q) {
    if (q === null || q === void 0) return A.filter(Np8).length;
    let K = !1,
        Y = 0;
    for (let z of A) {
        if (!K) {
            if (z.uuid === q) K = !0;
            continue
        }
        if (Np8(z)) Y++
    }
    if (!K) return A.filter(Np8).length;
    return Y
}
// @from(Ln 375898, Col 0)
function UmY(A, q) {
    let K = q === void 0;
    for (let Y of A) {
        if (!K) {
            if (Y.uuid === q) K = !0;
            continue
        }
        if (Y.type !== "assistant") continue;
        let z = Y.message.content;
        if (!Array.isArray(z)) continue;
        for (let _ of z) {
            let w = TKq(_);
            if (w !== void 0 && Da(w)) return !0
        }
    }
    return !1
}
// @from(Ln 375916, Col 0)
function fKq(A) {
    return async (q, K) => {
        if (q.name === s7) return {
            behavior: "allow",
            updatedInput: K
        };
        if ((q.name === R4 || q.name === _K) && "file_path" in K) {
            let Y = K.file_path;
            if (typeof Y === "string" && Da(Y)) return {
                behavior: "allow",
                updatedInput: K
            }
        }
        return {
            behavior: "deny",
            message: `only ${s7}, ${R4}, and ${_K} within ${A} are allowed`,
            decisionReason: {
                type: "other",
                reason: `only ${s7}, ${R4}, and ${_K} within ${A} are allowed`
            }
        }
    }
}
// @from(Ln 375940, Col 0)
function TKq(A) {
    if (A.type !== "tool_use" || A.name !== R4 && A.name !== _K) return;
    let q = A.input;
    if (typeof q === "object" && q !== null && "file_path" in q) {
        let K = q.file_path;
        return typeof K === "string" ? K : void 0
    }
    return
}
// @from(Ln 375950, Col 0)
function dmY(A) {
    let q = [];
    for (let K of A) {
        if (K.type !== "assistant") continue;
        let Y = K.message.content;
        if (!Array.isArray(Y)) continue;
        for (let z of Y) {
            let _ = TKq(z);
            if (_ !== void 0) q.push(_)
        }
    }
    return q
}
// @from(Ln 375964, Col 0)
function cmY() {
    let A, q = !1,
        K = !1,
        Y = 0,
        z;
    async function _({
        context: w,
        addNotification: O,
        isTrailingRun: $
    }) {
        let {
            messages: H
        } = w, j = uH(), J = QmY(H, A);
        if (UmY(H, A)) {
            k("[extractMemories] skipping — conversation already wrote to memory files");
            let Z = H[H.length - 1];
            if (Z?.uuid) A = Z.uuid;
            d("tengu_extract_memories_skipped_direct_write", {
                message_count: J
            });
            return
        }
        let M = pmY.isTeamMemoryEnabled(),
            D = w8("tengu_swinburne_dune", !1),
            X = M ? (D ? WKq : PKq)(J) : (D ? XKq : DKq)(J),
            P = fKq(j),
            W = Fb(w);
        if (!$) {
            if (Y++, Y < (w8("tengu_bramble_lintel", null) ?? 1)) return
        }
        Y = 0, K = !0;
        try {
            k(`[extractMemories] starting — ${J} new messages, memoryDir=${j}`);
            let Z = await av({
                    promptMessages: [p1({
                        content: X
                    })],
                    cacheSafeParams: W,
                    canUseTool: P,
                    querySource: "extract_memories",
                    forkLabel: "extract_memories"
                }),
                G = H[H.length - 1];
            if (G?.uuid) A = G.uuid;
            let f = dmY(Z.messages),
                v = Z.totalUsage.input_tokens + Z.totalUsage.cache_creation_input_tokens + Z.totalUsage.cache_read_input_tokens,
                N = v > 0 ? (Z.totalUsage.cache_read_input_tokens / v * 100).toFixed(1) : "0.0";
            if (k(`[extractMemories] finished — ${f.length} files written, cache: read=${Z.totalUsage.cache_read_input_tokens} create=${Z.totalUsage.cache_creation_input_tokens} input=${Z.totalUsage.input_tokens} (${N}% hit)`), f.length > 0) k(`[extractMemories] memories saved: ${f.join(", ")}`);
            else k("[extractMemories] no memories saved this run");
            if (d("tengu_extract_memories_extraction", {
                    input_tokens: Z.totalUsage.input_tokens,
                    output_tokens: Z.totalUsage.output_tokens,
                    cache_read_input_tokens: Z.totalUsage.cache_read_input_tokens,
                    cache_creation_input_tokens: Z.totalUsage.cache_creation_input_tokens,
                    message_count: J
                }), k(`[extractMemories] writtenPaths=${f.length}, addNotification defined=${O!=null}`), f.length > 0) O?.({
                key: "extract-memories",
                text: `Saved ${f.length} memor${f.length===1?"y":"ies"}`,
                priority: "medium"
            })
        } catch (Z) {
            k(`[extractMemories] error: ${Z}`)
        } finally {
            K = !1;
            let Z = z;
            if (z = void 0, Z) k("[extractMemories] running trailing extraction for stashed context"), await _({
                context: Z.context,
                addNotification: Z.addNotification,
                isTrailingRun: !0
            })
        }
    }
    vKq = async function(O, $) {
        if (O.toolUseContext.agentId) return;
        if (!w8("tengu_passport_quail", !1)) return;
        if (!Z3()) return;
        if (t4()) return;
        if (K) {
            k("[extractMemories] extraction in progress — stashing for trailing run"), d("tengu_extract_memories_coalesced", {}), z = {
                context: O,
                addNotification: $
            };
            return
        }
        await _({
            context: O,
            addNotification: $
        })
    }
}
// @from(Ln 376054, Col 0)
async function lmY(A, q) {
    await vKq?.(A, q)
}
// @from(Ln 376057, Col 4)
pmY
// @from(Ln 376057, Col 9)
vKq = null
// @from(Ln 376058, Col 4)
kp8 = E(() => {
    T1();
    gR();
    JA();
    V1();
    HA();
    H1();
    mH();
    Q$();
    J_();
    ZKq();
    pmY = (Rk(), k4(Ld))
})
// @from(Ln 376071, Col 0)
async function* VKq(A, q, K, Y, z, _, w, O) {
    let $ = Date.now(),
        H = {
            messages: [...A, ...q],
            systemPrompt: K,
            userContext: Y,
            systemContext: z,
            toolUseContext: _,
            querySource: w
        };
    if (process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION !== "false") {
        if (w === "repl_main_thread" || w === "sdk") EKq(Fb(H));
        yKq(H)
    }
    if (!_.agentId) imY.executeExtractMemories(H, _.addNotification);
    try {
        let j = [],
            M = _.getAppState().toolPermissionContext.mode,
            D = Lp8(M, _.abortController.signal, void 0, O ?? !1, _.agentId, _, [...A, ...q], _.agentType),
            X = "",
            P = 0,
            W = !1,
            Z = "",
            G = !1,
            f = [],
            v = [];
        for await (let N of D) {
            if (N.message) {
                if (yield N.message, N.message.type === "progress" && N.message.toolUseID) {
                    X = N.message.toolUseID, P++;
                    let V = N.message.data;
                    if (V.command) v.push({
                        command: V.command,
                        promptText: V.promptText
                    })
                }
                if (N.message.type === "attachment") {
                    let V = N.message.attachment;
                    if ("hookEvent" in V && (V.hookEvent === "Stop" || V.hookEvent === "SubagentStop")) {
                        if (V.type === "hook_non_blocking_error") f.push(V.stderr || `Exit code ${V.exitCode}`), G = !0;
                        else if (V.type === "hook_error_during_execution") f.push(V.content), G = !0;
                        else if (V.type === "hook_success") {
                            if (V.stdout && V.stdout.trim() || V.stderr && V.stderr.trim()) G = !0
                        }
                        if ("durationMs" in V && "command" in V) {
                            let L = v.find((h) => h.command === V.command && h.durationMs === void 0);
                            if (L) L.durationMs = V.durationMs
                        }
                    }
                }
            }
            if (N.blockingError) {
                let V = p1({
                    content: Ep8(N.blockingError),
                    isMeta: !0
                });
                j.push(V), yield V, G = !0, f.push(N.blockingError.blockingError)
            }
            if (N.preventContinuation) W = !0, Z = N.stopReason || "Stop hook prevented continuation", yield f4({
                type: "hook_stopped_continuation",
                message: Z,
                hookName: "Stop",
                toolUseID: X,
                hookEvent: "Stop"
            });
            if (_.abortController.signal.aborted) return d("tengu_pre_stop_hooks_cancelled", {
                queryChainId: _.queryTracking?.chainId,
                queryDepth: _.queryTracking?.depth
            }), yield Ug({
                toolUse: !1
            }), {
                blockingErrors: [],
                preventContinuation: !0
            }
        }
        if (P > 0) {
            if (yield LKq(P, v, f, W, Z, G, "suggestion", X), f.length > 0) {
                let N = PX("app:toggleTranscript", "Global", "ctrl+o");
                _.addNotification?.({
                    key: "stop-hook-error",
                    text: `Stop hook error occurred · ${N} to see`,
                    priority: "immediate"
                })
            }
        }
        if (W) return {
            blockingErrors: [],
            preventContinuation: !0
        };
        if (j.length > 0) return {
            blockingErrors: j,
            preventContinuation: !1
        };
        if ($Y()) {
            let N = i3() ?? "",
                V = l5() ?? "",
                L = [],
                h = !1,
                R, u = "",
                I = jf(),
                B = (await DX(I)).filter((p) => p.status === "in_progress" && p.owner === N);
            for (let p of B) {
                let Q = Hi6(p.id, p.subject, p.description, N, V, M, _.abortController.signal, void 0, _);
                for await (let U of Q) {
                    if (U.message) {
                        if (U.message.type === "progress" && U.message.toolUseID) u = U.message.toolUseID;
                        yield U.message
                    }
                    if (U.blockingError) {
                        let r = p1({
                            content: $i6(U.blockingError),
                            isMeta: !0
                        });
                        L.push(r), yield r
                    }
                    if (U.preventContinuation) h = !0, R = U.stopReason || "TaskCompleted hook prevented continuation", yield f4({
                        type: "hook_stopped_continuation",
                        message: R,
                        hookName: "TaskCompleted",
                        toolUseID: u,
                        hookEvent: "TaskCompleted"
                    });
                    if (_.abortController.signal.aborted) return {
                        blockingErrors: [],
                        preventContinuation: !0
                    }
                }
            }
            let b = Rp8(N, V, M, _.abortController.signal);
            for await (let p of b) {
                if (p.message) {
                    if (p.message.type === "progress" && p.message.toolUseID) u = p.message.toolUseID;
                    yield p.message
                }
                if (p.blockingError) {
                    let Q = p1({
                        content: yp8(p.blockingError),
                        isMeta: !0
                    });
                    L.push(Q), yield Q
                }
                if (p.preventContinuation) h = !0, R = p.stopReason || "TeammateIdle hook prevented continuation", yield f4({
                    type: "hook_stopped_continuation",
                    message: R,
                    hookName: "TeammateIdle",
                    toolUseID: u,
                    hookEvent: "TeammateIdle"
                });
                if (_.abortController.signal.aborted) return {
                    blockingErrors: [],
                    preventContinuation: !0
                }
            }
            if (h) return {
                blockingErrors: [],
                preventContinuation: !0
            };
            if (L.length > 0) return {
                blockingErrors: L,
                preventContinuation: !1
            }
        }
        return {
            blockingErrors: [],
            preventContinuation: !1
        }
    } catch (j) {
        let J = Date.now() - $;
        return d("tengu_stop_hook_error", {
            duration: J,
            queryChainId: _.queryTracking?.chainId,
            queryDepth: _.queryTracking?.depth
        }), yield P$(`Stop hook failed: ${_1(j)}`, "warning"), {
            blockingErrors: [],
            preventContinuation: !1
        }
    }
}
// @from(Ln 376249, Col 4)
imY
// @from(Ln 376250, Col 4)
kKq = E(() => {
    V1();
    JA();
    M0();
    hw();
    zz();
    Bw();
    ld();
    s8();
    A16();
    gR();
    imY = (kp8(), k4(Vp8))
})
// @from(Ln 376264, Col 0)
function RKq() {
    return {
        sessionId: R1(),
        gates: {
            streamingToolExecution: jY("tengu_streaming_tool_execution2"),
            emitToolUseSummaries: t6(process.env.CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES),
            isAnt: !1,
            fastModeEnabled: !t6(process.env.CLAUDE_CODE_DISABLE_FAST_MODE)
        }
    }
}
// @from(Ln 376275, Col 4)
hKq = E(() => {
    HA();
    A8();
    T1()
})
// @from(Ln 376284, Col 0)
function SKq() {
    return {
        callModel: NT6,
        microcompact: pg,
        autocompact: sqq,
        uuid: nmY
    }
}
// @from(Ln 376292, Col 4)
CKq = E(() => {
    gw();
    Xl();
    eR()
})
// @from(Ln 376297, Col 4)
tE1 = () => {}
// @from(Ln 376298, Col 4)
IKq = E(() => {
    tE1()
})
// @from(Ln 376302, Col 0)
function* Sp8(A, q) {
    for (let K of A) {
        let Y = K.message.content.filter((z) => z.type === "tool_use");
        for (let z of Y) yield p1({
            content: [{
                type: "tool_result",
                content: q,
                is_error: !0,
                tool_use_id: z.id
            }],
            toolUseResult: q,
            sourceToolAssistantUUID: K.uuid
        })
    }
}
// @from(Ln 376318, Col 0)
function bKq(A) {
    return A?.type === "assistant" && A.apiError === "max_output_tokens"
}
// @from(Ln 376321, Col 0)
async function* Yh(A) {
    let q = [],
        K = yield* omY(A, q);
    for (let Y of q) pb(Y, "completed");
    return K
}
// @from(Ln 376327, Col 0)
async function* omY(A, q) {
    let {
        systemPrompt: K,
        userContext: Y,
        systemContext: z,
        canUseTool: _,
        fallbackModel: w,
        querySource: O,
        maxTurns: $,
        skipCacheWrite: H
    } = A, j = A.deps ?? SKq(), J = {
        messages: A.messages,
        toolUseContext: A.toolUseContext,
        maxOutputTokensOverride: A.maxOutputTokensOverride,
        autoCompactTracking: void 0,
        stopHookActive: void 0,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: !1,
        turnCount: 1,
        pendingToolUseSummary: void 0,
        transition: void 0
    }, M = null, D = RKq();
    while (!0) {
        let {
            toolUseContext: X
        } = J, {
            messages: P,
            autoCompactTracking: W,
            maxOutputTokensRecoveryCount: Z,
            hasAttemptedReactiveCompact: G,
            maxOutputTokensOverride: f,
            pendingToolUseSummary: v,
            stopHookActive: N,
            turnCount: V
        } = J, L = zqq(P, X), h = hp8?.startSkillDiscoveryPrefetch(null, P, X);
        if (yield {
                type: "stream_request_start"
            }, K5("query_fn_entry"), !X.agentId) Bz6("query_started");
        let R = X.queryTracking ? {
                chainId: X.queryTracking.chainId,
                depth: X.queryTracking.depth + 1
            } : {
                chainId: j.uuid(),
                depth: 0
            },
            u = R.chainId;
        X = {
            ...X,
            queryTracking: R
        };
        let I = [...fN(P)],
            g = W;
        I = await T34(I, X.contentReplacementState, O, (D6) => void pz6(D6).catch(_6));
        let B = 0;
        K5("query_microcompact_start"), I = (await j.microcompact(I, X, O)).messages;
        let p = void 0;
        K5("query_microcompact_end");
        let Q = uq(xKq(K, z));
        K5("query_autocompact_start");
        let {
            compactionResult: U,
            consecutiveFailures: r
        } = await j.autocompact(I, X, {
            systemPrompt: K,
            userContext: Y,
            systemContext: z,
            toolUseContext: X,
            forkContextMessages: I
        }, O, g, B);
        if (K5("query_autocompact_end"), U) {
            let {
                preCompactTokenCount: D6,
                postCompactTokenCount: Q6,
                truePostCompactTokenCount: k6,
                compactionUsage: Z6
            } = U;
            d("tengu_auto_compact_succeeded", {
                originalMessageCount: P.length,
                compactedMessageCount: U.summaryMessages.length + U.attachments.length + U.hookResults.length,
                preCompactTokenCount: D6,
                postCompactTokenCount: Q6,
                truePostCompactTokenCount: k6,
                compactionInputTokens: Z6?.input_tokens,
                compactionOutputTokens: Z6?.output_tokens,
                compactionCacheReadTokens: Z6?.cache_read_input_tokens ?? 0,
                compactionCacheCreationTokens: Z6?.cache_creation_input_tokens ?? 0,
                compactionTotalTokens: Z6 ? Z6.input_tokens + (Z6.cache_creation_input_tokens ?? 0) + (Z6.cache_read_input_tokens ?? 0) + Z6.output_tokens : 0,
                queryChainId: u,
                queryDepth: R.depth
            }), g = {
                compacted: !0,
                turnId: j.uuid(),
                turnCounter: 0,
                consecutiveFailures: 0
            };
            let u6 = jl(U);
            for (let C6 of u6) yield C6;
            I = u6
        } else if (r !== void 0) g = {
            ...g ?? {
                compacted: !1,
                turnId: "",
                turnCounter: 0
            },
            consecutiveFailures: r
        };
        X = {
            ...X,
            messages: I
        };
        let e = [],
            Y6 = [],
            H6 = [],
            J6 = !1;
        K5("query_setup_start");
        let s = D.gates.streamingToolExecution ? new ui6(X.options.tools, _, X) : null,
            X6 = X.getAppState(),
            z6 = X6.toolPermissionContext.mode,
            N6 = II({
                permissionMode: z6,
                mainLoopModel: X.options.mainLoopModel,
                exceeds200kTokens: z6 === "plan" && pD1(I)
            });
        K5("query_setup_end");
        let $6 = D.gates.isAnt ? s24(X.agentId ?? D.sessionId) : void 0,
            n = !1;
        if (!U && O !== "compact" && O !== "session_memory" && !(Bi6?.isReactiveOnlyMode() && Xh()) && !n) {
            let {
                isAtBlockingLimit: D6
            } = mz6(eW(I) - B, X.options.mainLoopModel);
            if (D6) return yield y9({
                content: EB,
                error: "invalid_request"
            }), {
                reason: "blocking_limit"
            }
        }
        let o = !0;
        K5("query_api_loop_start");
        try {
            while (o) {
                o = !1;
                try {
                    let D6 = !1;
                    K5("query_api_streaming_start");
                    for await (let Q6 of j.callModel({
                        messages: eE1(I, Y),
                        systemPrompt: Q,
                        thinkingConfig: X.options.thinkingConfig,
                        tools: X.options.tools,
                        signal: X.abortController.signal,
                        options: {
                            async getToolPermissionContext() {
                                return X.getAppState().toolPermissionContext
                            },
                            model: N6,
                            ...D.gates.fastModeEnabled ? {
                                fastMode: X6.fastMode
                            } : {},
                            toolChoice: void 0,
                            isNonInteractiveSession: X.options.isNonInteractiveSession,
                            fallbackModel: w,
                            onStreamingFallback: () => {
                                D6 = !0
                            },
                            querySource: O,
                            agents: X.options.agentDefinitions.activeAgents,
                            allowedAgentTypes: X.options.agentDefinitions.allowedAgentTypes,
                            hasAppendSystemPrompt: !!X.options.appendSystemPrompt,
                            maxOutputTokensOverride: f,
                            fetchOverride: $6,
                            mcpTools: X6.mcp.tools,
                            hasPendingMcpServers: X6.mcp.clients.some((k6) => k6.type === "pending"),
                            queryTracking: R,
                            effortValue: X6.effortValue,
                            skipCacheWrite: H,
                            agentId: X.agentId,
                            addNotification: X.addNotification
                        }
                    })) {
                        if (D6) {
                            for (let u6 of e) yield {
                                type: "tombstone",
                                message: u6
                            };
                            if (d("tengu_orphaned_messages_tombstoned", {
                                    orphanedMessageCount: e.length,
                                    queryChainId: u,
                                    queryDepth: R.depth
                                }), e.length = 0, Y6.length = 0, H6.length = 0, J6 = !1, s) s.discard(), s = new ui6(X.options.tools, _, X)
                        }
                        let k6 = Q6;
                        if (Q6.type === "assistant") {
                            let u6;
                            for (let C6 = 0; C6 < Q6.message.content.length; C6++) {
                                let o6 = Q6.message.content[C6];
                                if (o6.type === "tool_use" && typeof o6.input === "object" && o6.input !== null) {
                                    let V6 = dK(X.options.tools, o6.name);
                                    if (V6?.backfillObservableInput) {
                                        let b6 = {
                                            ...o6.input
                                        };
                                        V6.backfillObservableInput(b6), u6 ??= [...Q6.message.content], u6[C6] = {
                                            ...o6,
                                            input: b6
                                        }
                                    }
                                }
                            }
                            if (u6) k6 = {
                                ...Q6,
                                message: {
                                    ...Q6.message,
                                    content: u6
                                }
                            }
                        }
                        let Z6 = !1;
                        if (Bi6?.isWithheldPromptTooLong(Q6)) Z6 = !0;
                        if (bKq(Q6)) Z6 = !0;
                        if (!Z6) yield k6;
                        if (Q6.type === "assistant") {
                            e.push(Q6);
                            let u6 = Q6.message.content.filter((C6) => C6.type === "tool_use");
                            if (u6.length > 0) H6.push(...u6), J6 = !0;
                            if (s && !X.abortController.signal.aborted)
                                for (let C6 of u6) s.addTool(C6, Q6)
                        }
                        if (s && !X.abortController.signal.aborted) {
                            for (let u6 of s.getCompletedResults())
                                if (u6.message) yield u6.message, Y6.push(...cM([u6.message], X.options.tools).filter((C6) => C6.type === "user"))
                        }
                    }
                    K5("query_api_streaming_end")
                } catch (D6) {
                    if (D6 instanceof R36 && w) {
                        if (N6 = w, o = !0, yield* Sp8(e, "Model fallback triggered"), e.length = 0, Y6.length = 0, H6.length = 0, J6 = !1, s) s.discard(), s = new ui6(X.options.tools, _, X);
                        X.options.mainLoopModel = w, d("tengu_model_fallback_triggered", {
                            original_model: D6.originalModel,
                            fallback_model: w,
                            entrypoint: "cli",
                            queryChainId: u,
                            queryDepth: R.depth
                        }), yield P$(`Switched to ${qJ(D6.fallbackModel)} due to high demand for ${qJ(D6.originalModel)}`, "warning");
                        continue
                    }
                    throw D6
                }
            }
        } catch (D6) {
            _6(D6);
            let Q6 = D6 instanceof Error ? D6.message : String(D6);
            if (d("tengu_query_error", {
                    assistantMessages: e.length,
                    toolUses: e.flatMap((k6) => k6.message.content.filter((Z6) => Z6.type === "tool_use")).length,
                    queryChainId: u,
                    queryDepth: R.depth
                }), D6 instanceof n06 || D6 instanceof pd) return yield y9({
                content: D6.message
            }), {
                reason: "image_error"
            };
            return yield* Sp8(e, Q6), yield Ug({
                toolUse: !1
            }), jV("Query error", D6), {
                reason: "model_error",
                error: D6
            }
        }
        if (e.length > 0) OKq([...I, ...e], K, Y, z, X, O);
        if (X.abortController.signal.aborted) {
            if (s) {
                for await (let D6 of s.getRemainingResults()) if (D6.message) yield D6.message
            } else yield* Sp8(e, "Interrupted by user");
            if (X.abortController.signal.reason !== "interrupt") yield Ug({
                toolUse: !1
            });
            return {
                reason: "aborted_streaming"
            }
        }
        if (v) {
            let D6 = await v;
            if (D6) yield D6
        }
        if (!J6) {
            let D6 = e[e.length - 1],
                Q6 = D6?.type === "assistant" && D6.isApiErrorMessage && Tv8(D6);
            if (Q6 && Bi6) {
                let Z6 = await Bi6.tryReactiveCompact({
                    hasAttempted: G,
                    querySource: O,
                    aborted: X.abortController.signal.aborted,
                    messages: I,
                    cacheSafeParams: {
                        systemPrompt: K,
                        userContext: Y,
                        systemContext: z,
                        toolUseContext: X,
                        forkContextMessages: I
                    }
                });
                if (Z6) {
                    let u6 = jl(Z6);
                    for (let o6 of u6) yield o6;
                    J = {
                        messages: u6,
                        toolUseContext: X,
                        autoCompactTracking: void 0,
                        maxOutputTokensRecoveryCount: Z,
                        hasAttemptedReactiveCompact: !0,
                        maxOutputTokensOverride: void 0,
                        pendingToolUseSummary: void 0,
                        stopHookActive: void 0,
                        turnCount: V,
                        transition: {
                            reason: "reactive_compact_retry"
                        }
                    };
                    continue
                }
                return yield D6, {
                    reason: "prompt_too_long"
                }
            }
            if (bKq(D6)) {
                if (Z < rmY) {
                    let Z6 = p1({
                        content: "Output token limit hit. Resume directly — no apology, no recap of what you were doing. " + "Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces.",
                        isMeta: !0
                    });
                    J = {
                        messages: [...I, ...e, Z6],
                        toolUseContext: X,
                        autoCompactTracking: g,
                        maxOutputTokensRecoveryCount: Z + 1,
                        hasAttemptedReactiveCompact: G,
                        maxOutputTokensOverride: void 0,
                        pendingToolUseSummary: void 0,
                        stopHookActive: void 0,
                        turnCount: V,
                        transition: {
                            reason: "max_output_tokens_recovery",
                            attempt: Z + 1
                        }
                    };
                    continue
                }
                yield D6
            }
            if (Bi6?.isReactiveCompactEnabled() && D6 && Tv8(D6)) return {
                reason: "completed"
            };
            let k6 = yield* VKq(I, e, K, Y, z, X, O, N);
            if (k6.preventContinuation) return {
                reason: "stop_hook_prevented"
            };
            if (k6.blockingErrors.length > 0) {
                J = {
                    messages: [...I, ...e, ...k6.blockingErrors],
                    toolUseContext: X,
                    autoCompactTracking: g,
                    maxOutputTokensRecoveryCount: 0,
                    hasAttemptedReactiveCompact: G,
                    maxOutputTokensOverride: void 0,
                    pendingToolUseSummary: void 0,
                    stopHookActive: !0,
                    turnCount: V,
                    transition: {
                        reason: "stop_hook_blocking"
                    }
                };
                continue
            }
            return {
                reason: "completed"
            }
        }
        let a = !1,
            i = X;
        if (K5("query_tool_execution_start"), s) d("tengu_streaming_tool_execution_used", {
            tool_count: H6.length,
            queryChainId: u,
            queryDepth: R.depth
        });
        else d("tengu_streaming_tool_execution_not_used", {
            tool_count: H6.length,
            queryChainId: u,
            queryDepth: R.depth
        });
        let l = s ? s.getRemainingResults() : GE1(H6, e, _, X);
        for await (let D6 of l) {
            if (D6.message) {
                if (yield D6.message, D6.message.type === "attachment" && D6.message.attachment.type === "hook_stopped_continuation") a = !0;
                Y6.push(...cM([D6.message], X.options.tools).filter((Q6) => Q6.type === "user"))
            }
            if (D6.newContext) i = {
                ...D6.newContext,
                queryTracking: R
            }
        }
        K5("query_tool_execution_end");
        let q6;
        if (D.gates.emitToolUseSummaries && H6.length > 0 && !X.abortController.signal.aborted) {
            let D6 = e[e.length - 1],
                Q6;
            if (D6) {
                let u6 = D6.message.content.filter((C6) => C6.type === "text");
                if (u6.length > 0) {
                    let C6 = u6[u6.length - 1];
                    if (C6 && "text" in C6) Q6 = C6.text
                }
            }
            let k6 = H6.map((u6) => u6.id),
                Z6 = H6.map((u6) => {
                    let C6 = Y6.find((V6) => V6.type === "user" && Array.isArray(V6.message.content) && V6.message.content.some((b6) => b6.type === "tool_result" && b6.tool_use_id === u6.id)),
                        o6 = C6?.type === "user" && Array.isArray(C6.message.content) ? C6.message.content.find((V6) => V6.type === "tool_result" && V6.tool_use_id === u6.id) : void 0;
                    return {
                        name: u6.name,
                        input: u6.input,
                        output: o6 && "content" in o6 ? o6.content : null
                    }
                });
            q6 = AKq({
                tools: Z6,
                signal: X.abortController.signal,
                isNonInteractiveSession: X.options.isNonInteractiveSession,
                lastAssistantText: Q6
            }).then((u6) => {
                if (u6) return uKq(u6, k6);
                return null
            }).catch(() => null)
        }
        if (X.abortController.signal.aborted) {
            if (X.abortController.signal.reason !== "interrupt") yield Ug({
                toolUse: !0
            });
            let D6 = V + 1;
            if ($ && D6 > $) yield f4({
                type: "max_turns_reached",
                maxTurns: $,
                turnCount: D6
            });
            return {
                reason: "aborted_tools"
            }
        }
        if (a) return {
            reason: "hook_stopped"
        };
        if (g?.compacted) g.turnCounter++, d("tengu_post_autocompact_turn", {
            turnId: g.turnId,
            turnCounter: g.turnCounter,
            queryChainId: u,
            queryDepth: R.depth
        });
        d("tengu_query_before_attachments", {
            messagesForQueryCount: I.length,
            assistantMessagesCount: e.length,
            toolResultsCount: Y6.length,
            queryChainId: u,
            queryDepth: R.depth
        });
        let w6 = H6.some((D6) => D6.name === gz6),
            O6 = O.startsWith("repl_main_thread") || O === "sdk" ? rP1(w6 ? "later" : "next") : [];
        for await (let D6 of Vf6(null, i, null, O6, [...I, ...e, ...Y6], O)) yield D6, Y6.push(D6);
        if (L) {
            let D6 = _qq(await L, H6);
            for (let Q6 of D6) {
                let k6 = f4(Q6);
                yield k6, Y6.push(k6)
            }
        }
        if (hp8 && h) {
            let D6 = await hp8.collectSkillDiscoveryPrefetch(h);
            for (let Q6 of D6) {
                let k6 = f4(Q6);
                yield k6, Y6.push(k6)
            }
        }
        let L6 = O6.filter((D6) => D6.mode === "prompt" || D6.mode === "task-notification");
        if (L6.length > 0) {
            for (let D6 of L6)
                if (D6.uuid) q.push(D6.uuid), pb(D6.uuid, "started");
            YY4(L6)
        }
        let y6 = Y6.filter((D6) => D6.type === "attachment" && D6.attachment.type === "edited_text_file").length;
        if (d("tengu_query_after_attachments", {
                totalToolResultsCount: Y6.length,
                fileChangeAttachmentCount: y6,
                queryChainId: u,
                queryDepth: R.depth
            }), i.options.refreshTools) {
            let D6 = i.options.refreshTools();
            if (D6 !== i.options.tools) i = {
                ...i,
                options: {
                    ...i.options,
                    tools: D6
                }
            }
        }
        let G6 = {
                ...i,
                queryTracking: R
            },
            R6 = V + 1;
        if ($ && R6 > $) return yield f4({
            type: "max_turns_reached",
            maxTurns: $,
            turnCount: R6
        }), {
            reason: "max_turns",
            turnCount: R6
        };
        K5("query_recursive_call"), J = {
            messages: [...I, ...e, ...Y6],
            toolUseContext: G6,
            autoCompactTracking: g,
            turnCount: R6,
            maxOutputTokensRecoveryCount: 0,
            hasAttemptedReactiveCompact: !1,
            pendingToolUseSummary: q6,
            maxOutputTokensOverride: void 0,
            stopHookActive: N,
            transition: {
                reason: "next_turn"
            }
        }
    }
}
// @from(Ln 376858, Col 4)
Bi6 = null
// @from(Ln 376859, Col 4)
hp8 = null
// @from(Ln 376860, Col 4)
rmY = 3
// @from(Ln 376861, Col 4)
oY6 = E(() => {
    Ud();
    Xl();
    _l();
    V1();
    vX1();
    jR();
    k1();
    yB();
    H1();
    JA();
    qKq();
    Fz6();
    M0();
    aH();
    Ii6();
    z4();
    AZ();
    bi6();
    xi6();
    $e();
    $Kq();
    qv6();
    IF8();
    ZR();
    Oq();
    kKq();
    hKq();
    CKq();
    T1();
    IKq()
})
// @from(Ln 376893, Col 4)
gZ
// @from(Ln 376894, Col 4)
Cp8 = E(() => {
    gZ = {
        input_tokens: 0,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
        output_tokens: 0,
        server_tool_use: {
            web_search_requests: 0,
            web_fetch_requests: 0
        },
        service_tier: "standard",
        cache_creation: {
            ephemeral_1h_input_tokens: 0,
            ephemeral_5m_input_tokens: 0
        },
        inference_geo: "",
        iterations: [],
        speed: "standard"
    }
})
// @from(Ln 376915, Col 0)
function amY(A) {
    if (A instanceof a7) {
        let q = A.error;
        if (q?.error?.message) return q.error.message
    }
    return A instanceof Error ? A.message : String(A)
}
// @from(Ln 376923, Col 0)
function Ip8(A) {
    let q = new Set;
    A.forEach((K, Y) => q.add(Y));
    for (let [K, Y] of Object.entries(smY))
        if (Y.prefixes?.some((z) => Array.from(q).some((_) => _.startsWith(z)))) return K;
    return
}
// @from(Ln 376931, Col 0)
function bp8() {
    return {
        ...process.env.ANTHROPIC_BASE_URL ? {
            baseUrl: process.env.ANTHROPIC_BASE_URL
        } : {},
        ...process.env.ANTHROPIC_MODEL ? {
            envModel: process.env.ANTHROPIC_MODEL
        } : {},
        ...process.env.ANTHROPIC_SMALL_FAST_MODEL ? {
            envSmallFastModel: process.env.ANTHROPIC_SMALL_FAST_MODEL
        } : {}
    }
}
// @from(Ln 376945, Col 0)
function mKq() {
    if (!{
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.BUILD_TIME) return;
    let A = new Date({
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.BUILD_TIME).getTime();
    if (isNaN(A)) return;
    return Math.floor((Date.now() - A) / 60000)
}
// @from(Ln 376966, Col 0)
function BKq({
    model: A,
    messagesLength: q,
    temperature: K,
    betas: Y,
    permissionMode: z,
    querySource: _,
    queryTracking: w,
    thinkingType: O,
    effortValue: $,
    fastMode: H,
    previousRequestId: j
}) {
    d("tengu_api_query", {
        model: A,
        messagesLength: q,
        temperature: K,
        provider: k76(),
        buildAgeMins: mKq(),
        ...Y?.length ? {
            betas: Y.join(",")
        } : {},
        permissionMode: z,
        querySource: _,
        ...w ? {
            queryChainId: w.chainId,
            queryDepth: w.depth
        } : {},
        thinkingType: O,
        effortValue: $,
        fastMode: H,
        ...j ? {
            previousRequestId: j
        } : {},
        ...bp8()
    })
}
// @from(Ln 377004, Col 0)
function xp8({
    error: A,
    model: q,
    messageCount: K,
    messageTokens: Y,
    durationMs: z,
    durationMsIncludingRetries: _,
    attempt: w,
    requestId: O,
    didFallBackToNonStreaming: $,
    promptCategory: H,
    headers: j,
    queryTracking: J,
    querySource: M,
    llmSpan: D,
    fastMode: X,
    previousRequestId: P
}) {
    let W = void 0;
    if (A instanceof a7 && A.headers) W = Ip8(A.headers);
    else if (j) W = Ip8(j);
    let Z = amY(A),
        G = A instanceof a7 ? String(A.status) : void 0,
        f = i44(A),
        v = l06(A);
    if (v) {
        let V = v.isSSLError ? " (SSL error)" : "";
        k(`Connection error details: code=${v.code}${V}, message=${v.message}`, {
            level: "error"
        })
    }
    _6(A), d("tengu_api_error", {
        model: q,
        error: Z,
        status: G,
        errorType: f,
        messageCount: K,
        messageTokens: Y,
        durationMs: z,
        durationMsIncludingRetries: _,
        attempt: w,
        provider: k76(),
        requestId: O || void 0,
        didFallBackToNonStreaming: $,
        ...H ? {
            promptCategory: H
        } : {},
        ...W ? {
            gateway: W
        } : {},
        ...J ? {
            queryChainId: J.chainId,
            queryDepth: J.depth
        } : {},
        ...M ? {
            querySource: M
        } : {},
        fastMode: X,
        ...P ? {
            previousRequestId: P
        } : {},
        ...bp8()
    }), pw("api_error", {
        model: q,
        error: Z,
        status_code: String(G),
        duration_ms: String(z),
        attempt: String(w),
        speed: X ? "fast" : "normal"
    }), Hk8(D, {
        success: !1,
        statusCode: G ? parseInt(G) : void 0,
        error: Z,
        attempt: w
    });
    let N = Rt6();
    if (N?.isTeleported && !N.hasLoggedFirstMessage) d("tengu_teleport_first_message_error", {
        session_id: N.sessionId,
        error_type: f
    }), ht6()
}
// @from(Ln 377086, Col 0)
function tmY({
    model: A,
    preNormalizedModel: q,
    messageCount: K,
    messageTokens: Y,
    usage: z,
    durationMs: _,
    durationMsIncludingRetries: w,
    attempt: O,
    ttftMs: $,
    requestId: H,
    stopReason: j,
    costUSD: J,
    didFallBackToNonStreaming: M,
    querySource: D,
    gateway: X,
    queryTracking: P,
    permissionMode: W,
    globalCacheStrategy: Z,
    textContentLength: G,
    thinkingContentLength: f,
    toolUseContentLengths: v,
    fastMode: N,
    previousRequestId: V,
    betas: L
}) {
    let h = q7(),
        R = process.argv.includes("-p") || process.argv.includes("--print");
    d("tengu_api_success", {
        model: A,
        ...q !== A ? {
            preNormalizedModel: q
        } : {},
        ...L?.length ? {
            betas: L.join(",")
        } : {},
        messageCount: K,
        messageTokens: Y,
        inputTokens: z.input_tokens,
        outputTokens: z.output_tokens,
        cachedInputTokens: z.cache_read_input_tokens ?? 0,
        uncachedInputTokens: z.cache_creation_input_tokens ?? 0,
        durationMs: _,
        durationMsIncludingRetries: w,
        attempt: O,
        ttftMs: $ ?? void 0,
        buildAgeMins: mKq(),
        provider: k76(),
        requestId: H ?? void 0,
        stop_reason: j ?? void 0,
        costUSD: J,
        didFallBackToNonStreaming: M,
        isNonInteractiveSession: h,
        print: R,
        isTTY: process.stdout.isTTY ?? !1,
        querySource: D,
        ...X ? {
            gateway: X
        } : {},
        ...P ? {
            queryChainId: P.chainId,
            queryDepth: P.depth
        } : {},
        permissionMode: W,
        ...Z ? {
            globalCacheStrategy: Z
        } : {},
        ...G !== void 0 ? {
            textContentLength: G
        } : {},
        ...f !== void 0 ? {
            thinkingContentLength: f
        } : {},
        ...v !== void 0 ? {
            toolUseContentLengths: B6(v)
        } : {},
        fastMode: N,
        ...{},
        ...V ? {
            previousRequestId: V
        } : {},
        ...bp8()
    })
}
// @from(Ln 377171, Col 0)
function gKq({
    model: A,
    preNormalizedModel: q,
    start: K,
    startIncludingRetries: Y,
    ttftMs: z,
    usage: _,
    attempt: w,
    messageCount: O,
    messageTokens: $,
    requestId: H,
    stopReason: j,
    didFallBackToNonStreaming: J,
    querySource: M,
    headers: D,
    costUSD: X,
    queryTracking: P,
    permissionMode: W,
    newMessages: Z,
    llmSpan: G,
    globalCacheStrategy: f,
    requestSetupMs: v,
    attemptStartTimes: N,
    fastMode: V,
    previousRequestId: L,
    betas: h
}) {
    let R = D ? Ip8(D) : void 0,
        u, I, g;
    if (Z) {
        let e = 0,
            Y6 = 0,
            H6 = !1,
            J6 = {};
        for (let K6 of Z)
            for (let s of K6.message.content)
                if (s.type === "text") e += s.text.length;
                else if (s.type === "thinking") Y6 += s.thinking.length;
        else if (s.type === "tool_use" || s.type === "server_tool_use" || s.type === "mcp_tool_use") {
            let X6 = B6(s.input).length,
                z6 = hq(s.name);
            J6[z6] = (J6[z6] ?? 0) + X6, H6 = !0
        }
        u = e, I = Y6 > 0 ? Y6 : void 0, g = H6 ? J6 : void 0
    }
    let B = Date.now() - K,
        b = Date.now() - Y;
    ox1(b, B), tmY({
        model: A,
        preNormalizedModel: q,
        messageCount: O,
        messageTokens: $,
        usage: _,
        durationMs: B,
        durationMsIncludingRetries: b,
        attempt: w,
        ttftMs: z,
        requestId: H,
        stopReason: j,
        costUSD: X,
        didFallBackToNonStreaming: J,
        querySource: M,
        gateway: R,
        queryTracking: P,
        permissionMode: W,
        globalCacheStrategy: f,
        textContentLength: u,
        thinkingContentLength: I,
        toolUseContentLengths: g,
        fastMode: V,
        previousRequestId: L,
        betas: h
    }), pw("api_request", {
        model: A,
        input_tokens: String(_.input_tokens),
        output_tokens: String(_.output_tokens),
        cache_read_tokens: String(_.cache_read_input_tokens),
        cache_creation_tokens: String(_.cache_creation_input_tokens),
        cost_usd: String(X),
        duration_ms: String(B),
        speed: V ? "fast" : "normal"
    });
    let p, Q, U;
    if (a$() && Z) p = Z.flatMap((e) => e.message.content.filter((Y6) => Y6.type === "text").map((Y6) => Y6.text)).join(`
`) || void 0, U = Z.some((e) => e.message.content.some((Y6) => Y6.type === "tool_use"));
    Hk8(G, {
        success: !0,
        inputTokens: _.input_tokens,
        outputTokens: _.output_tokens,
        cacheReadTokens: _.cache_read_input_tokens,
        cacheCreationTokens: _.cache_creation_input_tokens,
        attempt: w,
        modelOutput: p,
        thinkingOutput: Q,
        hasToolCall: U,
        ttftMs: z ?? void 0,
        requestSetupMs: v,
        attemptStartTimes: N
    });
    let r = Rt6();
    if (r?.isTeleported && !r.hasLoggedFirstMessage) d("tengu_teleport_first_message_success", {
        session_id: r.sessionId
    }), ht6()
}
// @from(Ln 377275, Col 4)
smY
// @from(Ln 377276, Col 4)
gi6 = E(() => {
    wv();
    k1();
    H1();
    g1();
    o$();
    Nz();
    V1();
    FB();
    Ae();
    T1();
    yB();
    uv();
    Cp8();
    smY = {
        litellm: {
            prefixes: ["x-litellm-"]
        },
        helicone: {
            prefixes: ["helicone-"]
        },
        portkey: {
            prefixes: ["x-portkey-"]
        },
        "cloudflare-ai-gateway": {
            prefixes: ["cf-aig-"]
        }
    }
})
// @from(Ln 377306, Col 0)
function Ay1() {
    return {
        consecutiveDenials: 0,
        totalDenials: 0,
        consecutiveUnavailable: 0
    }
}
// @from(Ln 377314, Col 0)
function FKq(A) {
    return {
        ...A,
        consecutiveDenials: A.consecutiveDenials + 1,
        totalDenials: A.totalDenials + 1
    }
}
// @from(Ln 377322, Col 0)
function Fi6(A) {
    if (A.consecutiveDenials === 0) return A;
    return {
        ...A,
        consecutiveDenials: 0
    }
}
// @from(Ln 377330, Col 0)
function pKq(A) {
    return {
        ...A,
        consecutiveUnavailable: A.consecutiveUnavailable + 1
    }
}
// @from(Ln 377337, Col 0)
function QKq(A) {
    return A.consecutiveDenials >= Kv6.maxConsecutive || A.totalDenials >= Kv6.maxTotal
}
// @from(Ln 377341, Col 0)
function UKq(A) {
    return A.consecutiveUnavailable >= Kv6.maxConsecutiveUnavailable
}
// @from(Ln 377345, Col 0)
function dKq(A) {
    let q = Math.min(500 * Math.pow(2, A - 1), 32000),
        K = Math.random() * 0.25 * q;
    return Math.round(q + K)
}
// @from(Ln 377350, Col 4)
Kv6
// @from(Ln 377351, Col 4)
up8 = E(() => {
    Kv6 = {
        maxConsecutive: 3,
        maxTotal: 20,
        maxConsecutiveUnavailable: 10
    }
})
// @from(Ln 377362, Col 0)
function Fb(A) {
    return {
        systemPrompt: A.systemPrompt,
        userContext: A.userContext,
        systemContext: A.systemContext,
        toolUseContext: A.toolUseContext,
        forkContextMessages: A.messages
    }
}
// @from(Ln 377372, Col 0)
function ABY(A, q) {
    if (q.length === 0) return A;
    return () => {
        let K = A();
        return {
            ...K,
            toolPermissionContext: {
                ...K.toolPermissionContext,
                alwaysAllowRules: {
                    ...K.toolPermissionContext.alwaysAllowRules,
                    command: [...new Set([...K.toolPermissionContext.alwaysAllowRules.command || [], ...q])]
                }
            }
        }
    }
}
// @from(Ln 377388, Col 0)
async function DN1(A, q, K) {
    let z = (await A.getPromptForCommand(q, K)).map((J) => J.type === "text" ? J.text : "").join(`
`),
        _ = Kh(A.allowedTools ?? []),
        w = ABY(K.getAppState, _),
        O = A.agent ?? "general-purpose",
        $ = K.options.agentDefinitions.activeAgents,
        H = $.find((J) => J.agentType === O) ?? $.find((J) => J.agentType === "general-purpose") ?? $[0];
    if (!H) throw Error("No agent available for forked execution");
    let j = [p1({
        content: z
    })];
    return {
        skillContent: z,
        modifiedGetAppState: w,
        baseAgent: H,
        promptMessages: j
    }
}
// @from(Ln 377408, Col 0)
function XN1(A, q = "Execution completed") {
    let K = bX(A);
    if (!K) return q;
    return K.message.content.filter((z) => z.type === "text").map((z) => ("text" in z) ? z.text : "").join(`
`) || q
}
// @from(Ln 377415, Col 0)
function Bc6(A, q) {
    let K = q?.abortController ?? (q?.shareAbortController ? A.abortController : Wm(A.abortController)),
        Y = q?.getAppState ? q.getAppState : q?.shareAbortController ? A.getAppState : () => {
            let z = A.getAppState();
            if (z.toolPermissionContext.shouldAvoidPermissionPrompts) return z;
            return {
                ...z,
                toolPermissionContext: {
                    ...z.toolPermissionContext,
                    shouldAvoidPermissionPrompts: !0
                }
            }
        };
    return {
        readFileState: DI(q?.readFileState ?? A.readFileState),
        nestedMemoryAttachmentTriggers: new Set,
        dynamicSkillDirTriggers: new Set,
        toolDecisions: void 0,
        abortController: K,
        getAppState: Y,
        setAppState: q?.shareSetAppState ? A.setAppState : () => {},
        setAppStateForTasks: A.setAppStateForTasks ?? A.setAppState,
        localDenialTracking: q?.shareSetAppState ? A.localDenialTracking : Ay1(),
        setInProgressToolUseIDs: () => {},
        setResponseLength: q?.shareSetResponseLength ? A.setResponseLength : () => {},
        pushApiMetricsEntry: q?.shareSetResponseLength ? A.pushApiMetricsEntry : void 0,
        updateFileHistoryState: () => {},
        updateAttributionState: A.updateAttributionState,
        addNotification: void 0,
        setToolJSX: void 0,
        setStreamMode: void 0,
        setSDKStatus: void 0,
        openMessageSelector: void 0,
        options: q?.options ?? A.options,
        messages: q?.messages ?? A.messages,
        agentId: q?.agentId ?? bI(),
        agentType: q?.agentType,
        queryTracking: {
            chainId: emY(),
            depth: (A.queryTracking?.depth ?? -1) + 1
        },
        fileReadingLimits: A.fileReadingLimits,
        userModified: A.userModified,
        criticalSystemReminder_EXPERIMENTAL: q?.criticalSystemReminder_EXPERIMENTAL,
        requireCanUseTool: q?.requireCanUseTool
    }
}
// @from(Ln 377462, Col 0)
async function av({
    promptMessages: A,
    cacheSafeParams: q,
    canUseTool: K,
    querySource: Y,
    forkLabel: z,
    overrides: _,
    maxOutputTokens: w,
    maxTurns: O,
    onMessage: $,
    skipTranscript: H,
    skipCacheWrite: j
}) {
    let J = Date.now(),
        M = [],
        D = {
            ...gZ
        },
        {
            systemPrompt: X,
            userContext: P,
            systemContext: W,
            toolUseContext: Z,
            forkContextMessages: G
        } = q,
        f = Bc6(Z, _),
        v = [...G, ...A],
        N = H ? void 0 : bI(z),
        V = null;
    if (N) await dg(v, N).catch((h) => k(`Forked agent [${z}] failed to record initial transcript: ${h}`)), V = v.length > 0 ? v[v.length - 1].uuid : null;
    try {
        for await (let h of Yh({
            messages: v,
            systemPrompt: X,
            userContext: P,
            systemContext: W,
            canUseTool: K,
            toolUseContext: f,
            querySource: Y,
            maxOutputTokensOverride: w,
            maxTurns: O,
            skipCacheWrite: j
        })) {
            if (h.type === "stream_event") {
                if ("event" in h && h.event?.type === "message_delta" && h.event.usage) {
                    let u = Qz6({
                        ...gZ
                    }, h.event.usage);
                    D = qy1(D, u)
                }
                continue
            }
            if (h.type === "stream_request_start") continue;
            k(`Forked agent [${z}] received message: type=${h.type}`), M.push(h), $?.(h);
            let R = h;
            if (N && (R.type === "assistant" || R.type === "user" || R.type === "progress")) await dg([R], N, V).catch((u) => k(`Forked agent [${z}] failed to record transcript: ${u}`)), V = R.uuid
        }
    } finally {
        f.readFileState.clear(), v.length = 0
    }
    k(`Forked agent [${z}] finished: ${M.length} messages, types=[${M.map((h)=>h.type).join(", ")}], totalUsage: input=${D.input_tokens} output=${D.output_tokens} cacheRead=${D.cache_read_input_tokens} cacheCreate=${D.cache_creation_input_tokens}`);
    let L = Date.now() - J;
    return qBY({
        forkLabel: z,
        querySource: Y,
        durationMs: L,
        messageCount: M.length,
        totalUsage: D,
        queryTracking: Z.queryTracking
    }), {
        messages: M,
        totalUsage: D
    }
}
// @from(Ln 377537, Col 0)
function qBY({
    forkLabel: A,
    querySource: q,
    durationMs: K,
    messageCount: Y,
    totalUsage: z,
    queryTracking: _
}) {
    let w = z.input_tokens + z.cache_creation_input_tokens + z.cache_read_input_tokens,
        O = w > 0 ? z.cache_read_input_tokens / w : 0;
    d("tengu_fork_agent_query", {
        forkLabel: A,
        querySource: q,
        durationMs: K,
        messageCount: Y,
        inputTokens: z.input_tokens,
        outputTokens: z.output_tokens,
        cacheReadInputTokens: z.cache_read_input_tokens,
        cacheCreationInputTokens: z.cache_creation_input_tokens,
        serviceTier: z.service_tier,
        cacheCreationEphemeral1hTokens: z.cache_creation.ephemeral_1h_input_tokens,
        cacheCreationEphemeral5mTokens: z.cache_creation.ephemeral_5m_input_tokens,
        cacheHitRate: O,
        ..._ ? {
            queryChainId: _.chainId,
            queryDepth: _.depth
        } : {}
    })
}
// @from(Ln 377566, Col 4)
gR = E(() => {
    oY6();
    gw();
    gi6();
    V1();
    H1();
    Oq();
    tP();
    xI();
    up8();
    U$();
    JA();
    rJ()
})
// @from(Ln 377581, Col 0)
function EKq(A) {
    lKq = A
}
// @from(Ln 377585, Col 0)
function Ky1() {
    return lKq
}
// @from(Ln 377589, Col 0)
function NE1() {
    return "user_intent"
}
// @from(Ln 377593, Col 0)
function Yy1() {
    let A = process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION;
    if (A === "false") return d("tengu_prompt_suggestion_init", {
        enabled: !1,
        source: "env"
    }), !1;
    if (A === "1") return d("tengu_prompt_suggestion_init", {
        enabled: !0,
        source: "env"
    }), !0;
    if (!w8("tengu_chomp_inflection", !0)) return d("tengu_prompt_suggestion_init", {
        enabled: !1,
        source: "growthbook"
    }), !1;
    if (q7()) return d("tengu_prompt_suggestion_init", {
        enabled: !1,
        source: "non_interactive"
    }), !1;
    if (E7() && $Y()) return d("tengu_prompt_suggestion_init", {
        enabled: !1,
        source: "swarm_teammate"
    }), !1;
    let q = mA()?.promptSuggestionEnabled !== !1;
    return d("tengu_prompt_suggestion_init", {
        enabled: q,
        source: "setting"
    }), q
}
// @from(Ln 377622, Col 0)
function iKq() {
    if (Uz6) Uz6.abort(), Uz6 = null
}
// @from(Ln 377626, Col 0)
function pF8(A) {
    if (!A.promptSuggestionEnabled) return "disabled";
    if (A.pendingWorkerRequest || A.pendingSandboxRequest) return "pending_permission";
    if (A.elicitation.queue.length > 0) return "elicitation_active";
    if (A.toolPermissionContext.mode === "plan") return "plan_mode";
    if (Jf.status !== "allowed") return "rate_limit";
    return null
}
// @from(Ln 377634, Col 0)
async function mp8(A, q, K, Y, z) {
    if (A.signal.aborted) return F0("aborted", void 0, void 0, z), null;
    if (q.filter((M) => M.type === "assistant").length < 2) return F0("early_conversation", void 0, void 0, z), null;
    let w = bX(q);
    if (w?.isApiErrorMessage) return F0("last_response_error", void 0, void 0, z), null;
    if (w && YBY(w)) return F0("cache_cold", void 0, void 0, z), null;
    let O = K(),
        $ = pF8(O);
    if ($) return F0($, void 0, void 0, z), null;
    let H = NE1(),
        {
            suggestion: j,
            generationRequestId: J
        } = await QF8(A, H, Y);
    if (A.signal.aborted) return F0("aborted", void 0, void 0, z), null;
    if (!j) return F0("empty", void 0, H, z), null;
    if (UF8(j, H, z)) return null;
    return {
        suggestion: j,
        promptId: H,
        generationRequestId: J
    }
}
// @from(Ln 377657, Col 0)
async function yKq(A) {
    if (A.querySource !== "repl_main_thread") return;
    Uz6 = new AbortController;
    let q = Uz6,
        K = Fb(A);
    try {
        let Y = await mp8(q, A.messages, A.toolUseContext.getAppState, K, "cli");
        if (!Y) return;
        if (A.toolUseContext.setAppState((z) => ({
                ...z,
                promptSuggestion: {
                    text: Y.suggestion,
                    promptId: Y.promptId,
                    shownAt: 0,
                    acceptedAt: 0,
                    generationRequestId: Y.generationRequestId
                }
            })), gF8() && Y.suggestion) FF8(Y.suggestion, A, A.toolUseContext.setAppState, !1, K)
    } catch (Y) {
        if (Y instanceof Error && (Y.name === "AbortError" || Y.name === "APIUserAbortError")) {
            F0("aborted", void 0, void 0, "cli");
            return
        }
        _6(Y instanceof Error ? Y : Error("Prompt suggestion generation failed"))
    } finally {
        if (Uz6 === q) Uz6 = null
    }
}
// @from(Ln 377686, Col 0)
function YBY(A) {
    if (!A) return !1;
    let q = A.message.usage,
        K = q.input_tokens ?? 0,
        Y = q.cache_read_input_tokens ?? 0,
        z = q.cache_creation_input_tokens ?? 0,
        _ = K + Y + z;
    if (_ === 0) return !1;
    return z / _ > KBY
}
// @from(Ln 377696, Col 0)
async function QF8(A, q, K) {
    let Y = zBY[q],
        z = async () => ({
            behavior: "deny",
            message: "No tools needed for suggestion",
            decisionReason: {
                type: "other",
                reason: "suggestion only"
            }
        }), _ = await av({
            promptMessages: [p1({
                content: Y
            })],
            cacheSafeParams: K,
            canUseTool: z,
            querySource: "prompt_suggestion",
            forkLabel: "prompt_suggestion",
            overrides: {
                abortController: A
            },
            skipTranscript: !0,
            skipCacheWrite: !0
        }), w = _.messages.find(($) => $.type === "assistant"), O = w?.type === "assistant" ? w.requestId ?? null : null;
    for (let $ of _.messages) {
        if ($.type !== "assistant") continue;
        let H = $.message.content.find((j) => j.type === "text");
        if (H?.type === "text" && H.text.trim()) return {
            suggestion: H.text.trim(),
            generationRequestId: O
        }
    }
    return {
        suggestion: null,
        generationRequestId: O
    }
}
// @from(Ln 377733, Col 0)
function UF8(A, q, K) {
    if (!A) return F0("empty", void 0, q, K), !0;
    let Y = A.toLowerCase(),
        z = A.trim().split(/\s+/).length,
        _ = [
            ["done", () => Y === "done"],
            ["meta_text", () => Y === "nothing found" || Y === "nothing found." || Y.startsWith("nothing to suggest") || Y.startsWith("no suggestion") || /\bsilence is\b|\bstay(s|ing)? silent\b/.test(Y)],
            ["meta_wrapped", () => /^\(.*\)$|^\[.*\]$/.test(A)],
            ["error_message", () => Y.startsWith("api error:") || Y.startsWith("prompt is too long") || Y.startsWith("request timed out") || Y.startsWith("invalid api key") || Y.startsWith("image was too large")],
            ["prefixed_label", () => /^\w+:\s/.test(A)],
            ["too_few_words", () => {
                if (z >= 2) return !1;
                if (A.startsWith("/")) return !1;
                return !new Set(["yes", "yeah", "yep", "yea", "yup", "sure", "ok", "okay", "push", "commit", "deploy", "stop", "continue", "check", "exit", "quit", "no"]).has(Y)
            }],
            ["too_many_words", () => z > 12],
            ["too_long", () => A.length >= 100],
            ["multiple_sentences", () => /[.!?]\s+[A-Z]/.test(A)],
            ["has_formatting", () => /[\n*]|\*\*/.test(A)],
            ["evaluative", () => /thanks|thank you|looks good|sounds good|that works|that worked|that's all|nice|great|perfect|makes sense|awesome|excellent/.test(Y)],
            ["claude_voice", () => /^(let me|i'll|i've|i'm|i can|i would|i think|i notice|here's|here is|here are|that's|this is|this will|you can|you should|you could|sure,|of course|certainly)/i.test(A)]
        ];
    for (let [w, O] of _)
        if (O()) return F0(w, A, q, K), !0;
    return !1
}
// @from(Ln 377760, Col 0)
function nKq(A, q, K, Y, z) {
    let _ = Math.round(q.length / (A.length || 1) * 100) / 100,
        w = q === A,
        O = Math.max(0, Date.now() - K);
    d("tengu_prompt_suggestion", {
        source: "sdk",
        outcome: w ? "accepted" : "ignored",
        prompt_id: Y,
        ...z && {
            generationRequestId: z
        },
        ...w && {
            timeToAcceptMs: O
        },
        ...!w && {
            timeToIgnoreMs: O
        },
        similarity: _,
        ...!1
    })
}
// @from(Ln 377782, Col 0)
function F0(A, q, K, Y) {
    let z = K ?? NE1();
    d("tengu_prompt_suggestion", {
        ...Y && {
            source: Y
        },
        outcome: "suppressed",
        reason: A,
        prompt_id: z,
        ...!1
    })
}
// @from(Ln 377794, Col 4)
Uz6 = null
// @from(Ln 377795, Col 4)
lKq = null
// @from(Ln 377796, Col 4)
KBY = 0.5
// @from(Ln 377797, Col 4)
cKq = `[SUGGESTION MODE: Suggest what the user might naturally type next into Claude Code.]

FIRST: Look at the user's recent messages and original request.

Your job is to predict what THEY would type - not what you think they should do.

THE TEST: Would they think "I was just about to type that"?

EXAMPLES:
User asked "fix the bug and run tests", bug is fixed → "run the tests"
After code written → "try it out"
Claude offers options → suggest the one the user would likely pick, based on conversation
Claude asks to continue → "yes" or "go ahead"
Task complete, obvious follow-up → "commit this" or "push it"
After error or misunderstanding → silence (let them assess/correct)

Be specific: "run the tests" beats "continue".

NEVER SUGGEST:
- Evaluative ("looks good", "thanks")
- Questions ("what about...?")
- Claude-voice ("Let me...", "I'll...", "Here's...")
- New ideas they didn't ask about
- Multiple sentences

Stay silent if the next step isn't obvious from what the user said.

Format: 2-12 words, match the user's style. Or nothing.

Reply with ONLY the suggestion, no quotes or explanation.`
// @from(Ln 377827, Col 4)
zBY
// @from(Ln 377828, Col 4)
A16 = E(() => {
    gR();
    JA();
    V1();
    k1();
    Qz();
    zz();
    T1();
    ud();
    i8();
    sY6();
    HA();
    zBY = {
        user_intent: cKq,
        stated_intent: cKq
    }
})
// @from(Ln 377846, Col 0)
function z16() {
    let A = (zz(), k4(KT8)),
        q = A.isTeammate() && A.isPlanModeRequired() ? "plan" : "default";
    return {
        settings: mA(),
        tasks: {},
        agentNameRegistry: new Map,
        verbose: !1,
        mainLoopModel: null,
        mainLoopModelForSession: null,
        statusLineText: void 0,
        expandedView: "none",
        isBriefOnly: !1,
        showTeammateMessagePreview: !1,
        selectedIPAgentIndex: -1,
        viewSelectionMode: "none",
        kairosEnabled: !1,
        remoteSessionUrl: void 0,
        replBridgeEnabled: !1,
        replBridgeExplicit: !1,
        replBridgeConnected: !1,
        replBridgeSessionActive: !1,
        replBridgeReconnecting: !1,
        replBridgeConnectUrl: void 0,
        replBridgeSessionUrl: void 0,
        replBridgeEnvironmentId: void 0,
        replBridgeSessionId: void 0,
        replBridgeError: void 0,
        replBridgeInitialName: void 0,
        showRemoteCallout: !1,
        toolPermissionContext: {
            ...xM(),
            mode: q
        },
        agent: void 0,
        agentDefinitions: {
            activeAgents: [],
            allAgents: []
        },
        fileHistory: {
            snapshots: [],
            trackedFiles: new Set,
            snapshotSequence: 0
        },
        attribution: g06(),
        mcp: {
            clients: [],
            tools: [],
            commands: [],
            resources: {},
            pluginReconnectKey: 0
        },
        plugins: {
            enabled: [],
            disabled: [],
            commands: [],
            errors: [],
            installationStatus: {
                marketplaces: [],
                plugins: []
            },
            needsRefresh: !1
        },
        todos: {},
        notifications: {
            current: null,
            queue: []
        },
        elicitation: {
            queue: []
        },
        thinkingEnabled: fD6(),
        promptSuggestionEnabled: Yy1(),
        feedbackSurvey: {
            timeLastShown: null,
            submitCountAtLastAppearance: null
        },
        sessionHooks: new Map,
        inbox: {
            messages: []
        },
        workerSandboxPermissions: {
            queue: [],
            selectedIndex: 0
        },
        pendingWorkerRequest: null,
        pendingSandboxRequest: null,
        promptSuggestion: {
            text: null,
            promptId: null,
            shownAt: 0,
            acceptedAt: 0,
            generationRequestId: null
        },
        speculation: q16,
        speculationSessionTimeSavedMs: 0,
        skillImprovement: {
            suggestion: null
        },
        prStatus: {
            number: null,
            url: null,
            reviewState: null,
            lastUpdated: 0
        },
        authVersion: 0,
        initialMessage: null,
        effortValue: void 0,
        activeOverlays: new Set
    }
}
// @from(Ln 377957, Col 4)
q16
// @from(Ln 377958, Col 4)
cT6 = E(() => {
    xd();
    jm();
    A16();
    i8();
    q16 = {
        status: "idle"
    }
})
// @from(Ln 377968, Col 0)
function Yj(A) {
    let q = A6(13),
        {
            children: K,
            initialState: Y,
            onChangeAppState: z
        } = A;
    if (wD.useContext(rKq)) throw Error("AppStateProvider can not be nested within another AppStateProvider");
    let w;
    if (q[0] !== Y || q[1] !== z) w = () => WX1(Y ?? z16(), z), q[0] = Y, q[1] = z, q[2] = w;
    else w = q[2];
    let [O] = wD.useState(w), $;
    if (q[3] !== O) $ = () => {
        let {
            toolPermissionContext: X
        } = O.getState();
        if (X.isBypassPermissionsModeAvailable && bd()) k("Disabling bypass permissions mode on mount (remote settings loaded before mount)"), O.setState(_BY)
    }, q[3] = O, q[4] = $;
    else $ = q[4];
    let H;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) H = [], q[5] = H;
    else H = q[5];
    wD.useEffect($, H);
    let j;
    if (q[6] !== O.setState) j = (X) => PX1(X, O.setState), q[6] = O.setState, q[7] = j;
    else j = q[7];
    let J = wD.useEffectEvent(j);
    u06(J);
    let M;
    if (q[8] !== K) M = wD.default.createElement(c84, null, K), q[8] = K, q[9] = M;
    else M = q[9];
    let D;
    if (q[10] !== O || q[11] !== M) D = wD.default.createElement(rKq.Provider, {
        value: !0
    }, wD.default.createElement(XU6.Provider, {
        value: O
    }, M)), q[10] = O, q[11] = M, q[12] = D;
    else D = q[12];
    return D
}
// @from(Ln 378009, Col 0)
function _BY(A) {
    return {
        ...A,
        toolPermissionContext: X36(A.toolPermissionContext)
    }
}
// @from(Ln 378016, Col 0)
function Bp8() {
    let A = wD.useContext(XU6);
    if (!A) throw ReferenceError("useAppState/useSetAppState cannot be called outside of an <AppStateProvider />");
    return A
}
// @from(Ln 378022, Col 0)
function M1(A) {
    let q = A6(3),
        K = Bp8(),
        Y;
    if (q[0] !== A || q[1] !== K) Y = () => {
        let _ = K.getState(),
            w = A(_);
        if (_ === w) throw Error(`Your selector in \`useAppState(${A.toString()})\` returned the original state, which is not allowed. You must instead return a property for optimised rendering.`);
        return w
    }, q[0] = A, q[1] = K, q[2] = Y;
    else Y = q[2];
    let z = Y;
    return wD.useSyncExternalStore(K.subscribe, z, z)
}
// @from(Ln 378037, Col 0)
function xA() {
    return Bp8().setState
}
// @from(Ln 378041, Col 0)
function S5() {
    return Bp8()
}
// @from(Ln 378045, Col 0)
function FQ6(A) {
    let q = A6(3),
        K = wD.useContext(XU6),
        Y;
    if (q[0] !== A || q[1] !== K) Y = () => K ? A(K.getState()) : void 0, q[0] = A, q[1] = K, q[2] = Y;
    else Y = q[2];
    return wD.useSyncExternalStore(K ? K.subscribe : wBY, Y)
}
// @from(Ln 378053, Col 4)
wD
// @from(Ln 378053, Col 8)
XU6
// @from(Ln 378053, Col 13)
rKq
// @from(Ln 378053, Col 18)
wBY = () => () => {}
// @from(Ln 378054, Col 4)
NA = E(() => {
    e6();
    XX1();
    bT8();
    rJ();
    uT8();
    H1();
    cT6();
    cT6();
    wD = t(P6(), 1), XU6 = wD.default.createContext(null), rKq = wD.default.createContext(!1)
})