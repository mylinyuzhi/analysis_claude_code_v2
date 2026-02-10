
// @from(Ln 374122, Col 0)
function ymY() {
    return `IMPORTANT: This message and these instructions are NOT part of the actual user conversation. Do NOT include any references to "note-taking", "session notes extraction", or these update instructions in the notes content.

Based on the user conversation above (EXCLUDING this note-taking instruction message as well as system prompt, claude.md entries, or any past session summaries), update the session notes file.

The file {{notesPath}} has already been read for you. Here are its current contents:
<current_notes_content>
{{currentNotes}}
</current_notes_content>

Your ONLY task is to use the Edit tool to update the notes file, then stop. You can make multiple edits (update every section as needed) - make all Edit tool calls in parallel in a single message. Do not call any other tools.

CRITICAL RULES FOR EDITING:
- The file must maintain its exact structure with all sections, headers, and italic descriptions intact
-- NEVER modify, delete, or add section headers (the lines starting with '#' like # Task specification)
-- NEVER modify or delete the italic _section description_ lines (these are the lines in italics immediately following each header - they start and end with underscores)
-- The italic _section descriptions_ are TEMPLATE INSTRUCTIONS that must be preserved exactly as-is - they guide what content belongs in each section
-- ONLY update the actual content that appears BELOW the italic _section descriptions_ within each existing section
-- Do NOT add any new sections, summaries, or information outside the existing structure
- Do NOT reference this note-taking process or instructions anywhere in the notes
- It's OK to skip updating a section if there are no substantial new insights to add. Do not add filler content like "No info yet", just leave sections blank/unedited if appropriate.
- Write DETAILED, INFO-DENSE content for each section - include specifics like file paths, function names, error messages, exact commands, technical details, etc.
- For "Key results", include the complete, exact output the user requested (e.g., full table, full answer, etc.)
- Do not include information that's already in the CLAUDE.md files included in the context
- Keep each section under ~${WZ6} tokens/words - if a section is approaching this limit, condense it by cycling out less important details while preserving the most critical information
- Focus on actionable, specific information that would help someone understand or recreate the work discussed in the conversation
- IMPORTANT: Always update "Current State" to reflect the most recent work - this is critical for continuity after compaction

Use the Edit tool with file_path: {{notesPath}}

STRUCTURE PRESERVATION REMINDER:
Each section has TWO parts that must be preserved exactly as they appear in the current file:
1. The section header (line starting with #)
2. The italic description line (the _italicized text_ immediately after the header - this is a template instruction)

You ONLY update the actual content that comes AFTER these two preserved lines. The italic description lines starting and ending with underscores are part of the template structure, NOT content to be edited or removed.

REMEMBER: Use the Edit tool in parallel and stop. Do not continue after the edits. Only include insights from the actual user conversation, never from these note-taking instructions. Do not delete or change section headers or italic _section descriptions_.`
}
// @from(Ln 374161, Col 0)
async function BCA() {
    let A = b1(),
        q = Os4(O8(), "session-memory", "config", "template.md");
    if (A.existsSync(q)) try {
        return A.readFileSync(q, {
            encoding: "utf-8"
        })
    } catch (K) {
        K1(K instanceof Error ? K : Error(`Failed to load custom session memory template: ${K}`))
    }
    return RmY
}
// @from(Ln 374173, Col 0)
async function CmY() {
    let A = b1(),
        q = Os4(O8(), "session-memory", "config", "prompt.md");
    if (A.existsSync(q)) try {
        return A.readFileSync(q, {
            encoding: "utf-8"
        })
    } catch (K) {
        K1(K instanceof Error ? K : Error(`Failed to load custom session memory prompt: ${K}`))
    }
    return ymY()
}
// @from(Ln 374186, Col 0)
function SmY(A) {
    let q = {},
        K = A.split(`
`),
        Y = "",
        z = [];
    for (let w of K)
        if (w.startsWith("# ")) {
            if (Y && z.length > 0) {
                let H = z.join(`
`).trim();
                q[Y] = A2(H)
            }
            Y = w, z = []
        } else z.push(w);
    if (Y && z.length > 0) {
        let w = z.join(`
`).trim();
        q[Y] = A2(w)
    }
    return q
}
// @from(Ln 374209, Col 0)
function hmY(A, q) {
    let K = q > Hs4,
        Y = Object.entries(A).filter(([w, H]) => H > WZ6).sort(([, w], [, H]) => H - w).map(([w, H]) => `- "${w}" is ~${H} tokens (limit: ${WZ6})`);
    if (Y.length === 0 && !K) return "";
    let z = [];
    if (K) z.push(`

CRITICAL: The session memory file is currently ~${q} tokens, which exceeds the maximum of ${Hs4} tokens. You MUST condense the file to fit within this budget. Aggressively shorten oversized sections by removing less important details, merging related items, and summarizing older entries. Prioritize keeping "Current State" and "Errors & Corrections" accurate and detailed.`);
    if (Y.length > 0) z.push(`

${K?"Oversized sections to condense":"IMPORTANT: The following sections exceed the per-section limit and MUST be condensed"}:
${Y.join(`
`)}`);
    return z.join("")
}
// @from(Ln 374225, Col 0)
function ImY(A, q) {
    let K = A;
    for (let [Y, z] of Object.entries(q)) K = K.replace(new RegExp(`\\{\\{${Y}\\}\\}`, "g"), z);
    return K
}
// @from(Ln 374230, Col 0)
async function _s4(A) {
    let q = await BCA();
    return A.trim() === q.trim()
}
// @from(Ln 374234, Col 0)
async function Js4(A, q) {
    let K = await CmY(),
        Y = SmY(A),
        z = A2(A),
        w = hmY(Y, z);
    return ImY(K, {
        currentNotes: A,
        notesPath: q
    }) + w
}
// @from(Ln 374245, Col 0)
function Xs4(A) {
    let q = A.split(`
`),
        K = WZ6 * 4,
        Y = [],
        z = [],
        w = "",
        H = !1;
    for (let O of q)
        if (O.startsWith("# ")) {
            let _ = $s4(w, z, K);
            Y.push(..._.lines), H = H || _.wasTruncated, w = O, z = []
        } else z.push(O);
    let $ = $s4(w, z, K);
    return Y.push(...$.lines), H = H || $.wasTruncated, {
        truncatedContent: Y.join(`
`),
        wasTruncated: H
    }
}
// @from(Ln 374266, Col 0)
function $s4(A, q, K) {
    if (!A) return {
        lines: q,
        wasTruncated: !1
    };
    if (q.join(`
`).length <= K) return {
        lines: [A, ...q],
        wasTruncated: !1
    };
    let z = 0,
        w = [A];
    for (let H of q) {
        if (z + H.length + 1 > K) break;
        w.push(H), z += H.length + 1
    }
    return w.push(`
[... section truncated for length ...]`), {
        lines: w,
        wasTruncated: !0
    }
}
// @from(Ln 374288, Col 4)
WZ6 = 2000
// @from(Ln 374289, Col 4)
Hs4 = 12000
// @from(Ln 374290, Col 4)
RmY = `
# Session Title
_A short and distinctive 5-10 word descriptive title for the session. Super info dense, no filler_

# Current State
_What is actively being worked on right now? Pending tasks not yet completed. Immediate next steps._

# Task specification
_What did the user ask to build? Any design decisions or other explanatory context_

# Files and Functions
_What are the important files? In short, what do they contain and why are they relevant?_

# Workflow
_What bash commands are usually run and in what order? How to interpret their output if not obvious?_

# Errors & Corrections
_Errors encountered and how they were fixed. What did the user correct? What approaches failed and should not be tried again?_

# Codebase and System Documentation
_What are the important system components? How do they work/fit together?_

# Learnings
_What has worked well? What has not? What to avoid? Do not duplicate items from other sections_

# Key results
_If the user asked a specific output such as an answer to a question, a table, or other document, repeat the exact result here_

# Worklog
_Step by step, what was attempted, done? Very terse summary for each step_
`
// @from(Ln 374321, Col 4)
mCA = v(() => {
    _8();
    hA();
    y6();
    vv()
})
// @from(Ln 374328, Col 0)
function xmY() {
    jU1.forEach((A) => A())
}
// @from(Ln 374332, Col 0)
function NG1() {
    MU1 = !0, xmY()
}
// @from(Ln 374336, Col 0)
function Ds4() {
    MU1 = !1
}
// @from(Ln 374340, Col 0)
function js4() {
    MU1 = !1, jU1 = []
}
// @from(Ln 374344, Col 0)
function FCA() {
    let [A, q] = GZ6.useState(MU1);
    return GZ6.useEffect(() => {
        let K = () => {
            q(MU1)
        };
        return jU1.push(K), () => {
            jU1 = jU1.filter((Y) => Y !== K)
        }
    }, []), A
}
// @from(Ln 374355, Col 4)
GZ6
// @from(Ln 374355, Col 9)
MU1 = !1
// @from(Ln 374356, Col 4)
jU1
// @from(Ln 374357, Col 4)
ZZ6 = v(() => {
    GZ6 = o(X1(), 1), jU1 = []
})
// @from(Ln 374361, Col 0)
function bmY(A) {
    return typeof A === "string" && (A === NXA || A.includes(C$6))
}
// @from(Ln 374365, Col 0)
function Ms4() {
    TG1.clear(), fZ6.clear(), VZ6.clear(), js4()
}
// @from(Ln 374369, Col 0)
function UCA(A) {
    TG1.clear(), fZ6.clear(), VZ6.clear();
    let q = EN(A);
    for (let Y of q)
        if (QCA(Y)) {
            let {
                compactedToolIds: z,
                clearedAttachmentUUIDs: w
            } = Y.microcompactMetadata;
            for (let H of z ?? []) TG1.add(H);
            for (let H of w ?? []) fZ6.add(H)
        } let K = q.findLastIndex(QCA);
    if (K !== -1) {
        if (!q.slice(K + 1).some((z) => z.type === "assistant")) NG1()
    }
}
// @from(Ln 374386, Col 0)
function Ps4(A) {
    if (!A.content) return 0;
    if (typeof A.content === "string") return A2(A.content);
    return A.content.reduce((q, K) => {
        if (K.type === "text") return q + A2(K.text);
        else if (K.type === "image") return q + gCA;
        return q
    }, 0)
}
// @from(Ln 374396, Col 0)
function QmY(A, q) {
    let K = VZ6.get(A);
    if (K === void 0) K = Ps4(q), VZ6.set(A, K);
    return K
}
// @from(Ln 374402, Col 0)
function PU1(A) {
    let q = 0;
    for (let K of A) {
        if (K.type !== "user" && K.type !== "assistant") continue;
        if (!Array.isArray(K.message.content)) continue;
        for (let Y of K.message.content)
            if (Y.type === "text") q += A2(Y.text);
            else if (Y.type === "tool_result") q += Ps4(Y);
        else if (Y.type === "image") q += gCA;
        else q += A2(Q1(Y))
    }
    return Math.ceil(q * 1.3333333333333333)
}
// @from(Ln 374415, Col 0)
async function gm(A, q, K) {
    if (Ds4(), J6(process.env.DISABLE_MICROCOMPACT) || x8("tengu_cache_plum_violet", !1)) return {
        messages: A
    };
    J6(process.env.USE_API_CONTEXT_MANAGEMENT);
    let Y = q !== void 0,
        z = Y ? q : BmY,
        w = [],
        H = new Map;
    for (let G of A)
        if ((G.type === "user" || G.type === "assistant") && Array.isArray(G.message.content)) {
            for (let f of G.message.content)
                if (f.type === "tool_use" && FmY.has(f.name)) {
                    if (!TG1.has(f.id)) w.push(f.id)
                } else if (f.type === "tool_result" && w.includes(f.tool_use_id)) {
                let Z = QmY(f.tool_use_id, f);
                H.set(f.tool_use_id, Z)
            }
        } let $ = w.slice(-mmY),
        O = Array.from(H.values()).reduce((G, f) => G + f, 0),
        _ = 0,
        J = new Set;
    for (let G of w) {
        if ($.includes(G)) continue;
        if (O - _ > z) J.add(G), _ += H.get(G) || 0
    }
    if (!Y) {
        let G = PZ(A),
            f = K?.options.mainLoopModel ?? l3();
        if (!Ac(G, f).isAboveWarningThreshold || _ < umY) J.clear(), _ = 0
    }
    let X = new Set,
        D = 0;
    {
        let G = new Set,
            f = [];
        for (let Z of A)
            if (Z.type === "user") f.push(Z.uuid);
            else if (Z.type === "assistant" && f.length > 0) {
            for (let N of f) G.add(N);
            f = []
        }
        for (let Z of A)
            if (Z.type === "user" && Array.isArray(Z.message.content) && G.has(Z.uuid)) {
                let N = 0;
                for (let T of Z.message.content)
                    if (T.type === "image") N += gCA;
                if (N > 0) X.add(Z.uuid), D += N
            }
    }
    let j = (G) => {
            return TG1.has(G) || J.has(G)
        },
        M = new Set;
    J.size > 0;
    let P = [];
    for (let G of A) {
        if (G.type === "attachment" && fZ6.has(G.uuid)) continue;
        if (G.type !== "user" && G.type !== "assistant") {
            P.push(G);
            continue
        }
        if (!Array.isArray(G.message.content)) {
            P.push(G);
            continue
        }
        if (G.type === "user") {
            let f = [],
                Z = !1,
                N = X.has(G.uuid);
            for (let T of G.message.content) {
                if (T.type === "image" && N) {
                    Z = !0, f.push({
                        type: "text",
                        text: "[image]"
                    });
                    continue
                }
                if (T.type === "tool_result" && j(T.tool_use_id) && T.content && !bmY(T.content)) {
                    Z = !0;
                    let k = NXA,
                        y = await uq1(T.content, T.tool_use_id);
                    if (!Bq1(y)) k = `${C$6}Tool result saved to: ${y.filepath}

Use ${Jq} to view${VXA}`;
                    f.push({
                        ...T,
                        content: k
                    })
                } else f.push(T)
            }
            if (f.length > 0) {
                let T = Z ? void 0 : G.toolUseResult;
                P.push({
                    ...G,
                    message: {
                        ...G.message,
                        content: f
                    },
                    toolUseResult: T
                })
            }
        } else {
            let f = [];
            for (let Z of G.message.content) f.push(Z);
            P.push({
                ...G,
                message: {
                    ...G.message,
                    content: f
                }
            })
        }
    }
    if (K && J.size > 0) {
        let G = new Map,
            f = new Set;
        for (let Z of A)
            if ((Z.type === "user" || Z.type === "assistant") && Array.isArray(Z.message.content)) {
                for (let N of Z.message.content)
                    if (N.type === "tool_use" && N.name === Jq) {
                        let T = N.input?.file_path;
                        if (typeof T === "string")
                            if (J.has(N.id)) G.set(T, N.id);
                            else f.add(T)
                    }
            } for (let [Z] of G)
            if (!f.has(Z)) K.readFileState.delete(Z)
    }
    for (let G of J) TG1.add(G);
    let W = _ + D;
    if (J.size > 0 || X.size > 0) {
        c("tengu_microcompact", {
            toolsCompacted: J.size,
            totalUncompactedTokens: O,
            tokensAfterCompaction: O - W,
            tokensSaved: _,
            imageTokensSaved: D,
            imagesCleared: X.size,
            triggerType: Y ? "manual" : "auto"
        }), NG1();
        let G = Ws4(Y ? "manual" : "auto", O, W, Array.from(J), Array.from(M));
        return bL7(K?.options.querySource ?? "repl_main_thread", K?.agentId), {
            messages: P,
            compactionInfo: {
                boundaryMessage: G
            }
        }
    }
    return {
        messages: P
    }
}
// @from(Ln 374568, Col 4)
umY = 20000
// @from(Ln 374569, Col 4)
BmY = 40000
// @from(Ln 374570, Col 4)
mmY = 3
// @from(Ln 374571, Col 4)
gCA = 2000
// @from(Ln 374572, Col 4)
FmY
// @from(Ln 374572, Col 9)
TG1
// @from(Ln 374572, Col 14)
fZ6
// @from(Ln 374572, Col 19)
VZ6
// @from(Ln 374573, Col 4)
Qt = v(() => {
    vv();
    u6();
    hA();
    bx1();
    U4();
    N8();
    N8();
    RW();
    xd();
    e7();
    ZZ6();
    _H();
    DW();
    t81();
    SD();
    Pp();
    m6();
    FmY = new Set([Jq, h4, s9, Jz, JL, xO, bq, f5]), TG1 = new Set, fZ6 = new Set, VZ6 = new Map
})
// @from(Ln 374594, Col 0)
function gmY(A) {
    dCA = {
        ...dCA,
        ...A
    }
}
// @from(Ln 374601, Col 0)
function UmY() {
    return {
        ...dCA
    }
}
// @from(Ln 374606, Col 0)
async function pmY() {
    if (Gs4) return;
    Gs4 = !0;
    let A = await CI("tengu_sm_compact_config", {}),
        q = {
            minTokens: A.minTokens && A.minTokens > 0 ? A.minTokens : NZ6.minTokens,
            minTextBlockMessages: A.minTextBlockMessages && A.minTextBlockMessages > 0 ? A.minTextBlockMessages : NZ6.minTextBlockMessages,
            maxTokens: A.maxTokens && A.maxTokens > 0 ? A.maxTokens : NZ6.maxTokens
        };
    gmY(q)
}
// @from(Ln 374618, Col 0)
function Zs4(A) {
    if (A.type === "assistant") return A.message.content.some((K) => K.type === "text");
    if (A.type === "user") {
        let q = A.message.content;
        if (typeof q === "string") return q.length > 0;
        if (Array.isArray(q)) return q.some((K) => K.type === "text")
    }
    return !1
}
// @from(Ln 374628, Col 0)
function dmY(A) {
    if (A.type !== "user") return [];
    let q = A.message.content;
    if (!Array.isArray(q)) return [];
    let K = [];
    for (let Y of q)
        if (Y.type === "tool_result") K.push(Y.tool_use_id);
    return K
}
// @from(Ln 374638, Col 0)
function cmY(A, q) {
    if (A.type !== "assistant") return !1;
    let K = A.message.content;
    if (!Array.isArray(K)) return !1;
    return K.some((Y) => Y.type === "tool_use" && q.has(Y.id))
}
// @from(Ln 374645, Col 0)
function pCA(A, q) {
    if (q <= 0 || q >= A.length) return q;
    let K = q,
        Y = [];
    for (let w = q; w < A.length; w++) Y.push(...dmY(A[w]));
    if (Y.length > 0) {
        let w = new Set;
        for (let $ = K; $ < A.length; $++) {
            let O = A[$];
            if (O.type === "assistant" && Array.isArray(O.message.content)) {
                for (let _ of O.message.content)
                    if (_.type === "tool_use") w.add(_.id)
            }
        }
        let H = new Set(Y.filter(($) => !w.has($)));
        for (let $ = K - 1; $ >= 0 && H.size > 0; $--) {
            let O = A[$];
            if (cmY(O, H)) {
                if (K = $, O.type === "assistant" && Array.isArray(O.message.content)) {
                    for (let _ of O.message.content)
                        if (_.type === "tool_use" && H.has(_.id)) H.delete(_.id)
                }
            }
        }
    }
    let z = new Set;
    for (let w = K; w < A.length; w++) {
        let H = A[w];
        if (H.type === "assistant" && H.message.id) z.add(H.message.id)
    }
    for (let w = K - 1; w >= 0; w--) {
        let H = A[w];
        if (H.type === "assistant" && H.message.id && z.has(H.message.id)) K = w
    }
    return K
}
// @from(Ln 374682, Col 0)
function lmY(A, q) {
    if (A.length === 0) return 0;
    let K = UmY(),
        Y = q >= 0 ? q + 1 : A.length,
        z = 0,
        w = 0;
    for (let H = Y; H < A.length; H++) {
        let $ = A[H];
        if (z += PU1([$]), Zs4($)) w++
    }
    if (z >= K.maxTokens) return pCA(A, Y);
    if (z >= K.minTokens && w >= K.minTextBlockMessages) return pCA(A, Y);
    for (let H = Y - 1; H >= 0; H--) {
        let $ = A[H],
            O = PU1([$]);
        if (z += O, Zs4($)) w++;
        if (Y = H, z >= K.maxTokens) break;
        if (z >= K.minTokens && w >= K.minTextBlockMessages) break
    }
    return pCA(A, Y)
}
// @from(Ln 374704, Col 0)
function TZ6() {
    if (J6(process.env.ENABLE_CLAUDE_CODE_SM_COMPACT)) return !0;
    if (J6(process.env.DISABLE_CLAUDE_CODE_SM_COMPACT)) return !1;
    let A = x8("tengu_session_memory", !1),
        q = x8("tengu_sm_compact", !1);
    return A && q
}
// @from(Ln 374712, Col 0)
function imY(A, q, K, Y, z, w) {
    let H = PZ(A),
        $ = JU1("auto", H ?? 0, A[A.length - 1]?.uuid),
        {
            truncatedContent: O,
            wasTruncated: _
        } = Xs4(q),
        J = ux1(O, !0, z, !0);
    if (_) {
        let M = VG1();
        J += `

Some session memory sections were truncated for length. The full session memory can be viewed at: ${M}`
    }
    let X = [c6({
            content: J,
            isCompactSummary: !0,
            isVisibleInTranscriptOnly: !0
        })],
        D = jZ6(w);
    return {
        boundaryMarker: $,
        summaryMessages: X,
        attachments: D ? [D] : [],
        hookResults: Y,
        messagesToKeep: K,
        preCompactTokenCount: H,
        postCompactTokenCount: PU1(X)
    }
}
// @from(Ln 374742, Col 0)
async function vZ6(A, q, K) {
    if (!TZ6()) return null;
    await pmY(), await sa4();
    let Y = ra4(),
        z = PZ6();
    if (!z) return c("tengu_sm_compact_no_session_memory", {}), null;
    if (await _s4(z)) return c("tengu_sm_compact_empty_template", {}), null;
    try {
        let w;
        if (Y) {
            if (w = A.findIndex((j) => j.uuid === Y), w === -1) return c("tengu_sm_compact_summarized_id_not_found", {}), null
        } else w = A.length - 1, c("tengu_sm_compact_resumed_session", {});
        let H = lmY(A, w),
            $ = A.slice(H).filter((j) => !cR(j)),
            O = await PP("compact", {
                model: l3()
            }),
            _ = a$(U6()),
            J = imY(A, z, $, O, _, q),
            X = qt(J),
            D = PU1(X);
        if (K !== void 0 && D >= K) return c("tengu_sm_compact_threshold_exceeded", {
            postCompactTokenCount: D,
            autoCompactThreshold: K
        }), null;
        return {
            ...J,
            postCompactTokenCount: D
        }
    } catch (w) {
        return c("tengu_sm_compact_error", {}), null
    }
}
// @from(Ln 374775, Col 4)
NZ6
// @from(Ln 374775, Col 9)
dCA
// @from(Ln 374775, Col 14)
Gs4 = !1
// @from(Ln 374776, Col 4)
EZ6 = v(() => {
    vd();
    RW();
    N8();
    fG1();
    E2();
    mCA();
    U4();
    U4();
    u6();
    Qt();
    Rt();
    lq();
    B6();
    e7();
    Z6();
    hA();
    NZ6 = {
        minTokens: 1e4,
        minTextBlockMessages: 5,
        maxTokens: 40000
    }, dCA = {
        ...NZ6
    }
})
// @from(Ln 374802, Col 0)
function m51(A) {
    let q = Math.min(iCA(A), nmY);
    return yG(A, FP()) - q
}
// @from(Ln 374807, Col 0)
function SQ1(A) {
    let q = m51(A),
        K = q - cCA,
        Y = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
    if (Y) {
        let z = parseFloat(Y);
        if (!isNaN(z) && z > 0 && z <= 100) {
            let w = Math.floor(q * (z / 100));
            return Math.min(w, K)
        }
    }
    return K
}
// @from(Ln 374821, Col 0)
function Ac(A, q) {
    let K = SQ1(q),
        Y = xm() ? K : m51(q),
        z = Math.max(0, Math.round((Y - A) / Y * 100)),
        w = Y - rmY,
        H = Y - omY,
        $ = A >= w,
        O = A >= H,
        _ = xm() && A >= K,
        X = yG(q, FP()) - lCA,
        D = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE,
        j = D ? parseInt(D, 10) : NaN,
        M = !isNaN(j) && j > 0 ? j : X,
        P = A >= M;
    return {
        percentLeft: z,
        isAboveWarningThreshold: $,
        isAboveErrorThreshold: O,
        isAboveAutoCompactThreshold: _,
        isAtBlockingLimit: P
    }
}
// @from(Ln 374844, Col 0)
function xm() {
    if (J6(process.env.DISABLE_COMPACT)) return !1;
    if (J6(process.env.DISABLE_AUTO_COMPACT)) return !1;
    return f6().autoCompactEnabled
}
// @from(Ln 374849, Col 0)
async function amY(A, q, K) {
    if (K === "session_memory" || K === "compact") return !1;
    if (!xm()) return !1;
    let Y = Ev(A),
        z = SQ1(q),
        w = m51(q);
    h(`autocompact: tokens=${Y} threshold=${z} effectiveWindow=${w}`);
    let {
        isAboveAutoCompactThreshold: H
    } = Ac(Y, q);
    return H
}
// @from(Ln 374861, Col 0)
async function fs4(A, q, K, Y) {
    if (J6(process.env.DISABLE_COMPACT)) return {
        wasCompacted: !1
    };
    let z = q.options.mainLoopModel;
    if (!await amY(A, z, Y)) return {
        wasCompacted: !1
    };
    let H = await vZ6(A, q.agentId, SQ1(z));
    if (H) return i51(void 0), {
        wasCompacted: !0,
        compactionResult: H
    };
    try {
        let $ = await AW1(A, q, K, !0, void 0, !0);
        return i51(void 0), {
            wasCompacted: !0,
            compactionResult: $
        }
    } catch ($) {
        if (!ST1($, e31)) K1($ instanceof Error ? $ : Error(String($)));
        return {
            wasCompacted: !1
        }
    }
}
// @from(Ln 374887, Col 4)
nmY = 20000
// @from(Ln 374888, Col 4)
cCA = 13000
// @from(Ln 374889, Col 4)
rmY = 20000
// @from(Ln 374890, Col 4)
omY = 20000
// @from(Ln 374891, Col 4)
lCA = 3000
// @from(Ln 374892, Col 4)
xd = v(() => {
    RW();
    vd();
    y6();
    Z6();
    cA();
    qH();
    yw();
    hf();
    B6();
    hA();
    EZ6();
    fG1()
})
// @from(Ln 374906, Col 4)
Vs4 = 344
// @from(Ln 374907, Col 0)
async function Ts4({
    tools: A,
    signal: q,
    isNonInteractiveSession: K,
    lastAssistantText: Y
}) {
    if (A.length === 0) return null;
    try {
        let z = A.map((O) => {
                let _ = Ns4(O.input, 300),
                    J = Ns4(O.output, 300);
                return `Tool: ${O.name}
Input: ${_}
Output: ${J}`
            }).join(`

`),
            w = Y ? `User's intent (from assistant's last message): ${Y.slice(0,200)}

` : "";
        return (await SX({
            systemPrompt: [smY],
            userPrompt: `${w}Tools completed:

${z}

Provide a brief summary of what was accomplished:`,
            signal: q,
            options: {
                querySource: "tool_use_summary_generation",
                enablePromptCaching: !0,
                agents: [],
                isNonInteractiveSession: K,
                hasAppendSystemPrompt: !1,
                mcpTools: []
            }
        })).message.content.filter((O) => O.type === "text").map((O) => O.type === "text" ? O.text : "").join("").trim() || null
    } catch (z) {
        let w = z instanceof Error ? z : Error(String(z));
        return w.cause = {
            errorId: Vs4
        }, K1(w), null
    }
}
// @from(Ln 374952, Col 0)
function Ns4(A, q) {
    try {
        let K = Q1(A);
        if (K.length <= q) return K;
        return K.slice(0, q - 3) + "..."
    } catch {
        return "[unable to serialize]"
    }
}
// @from(Ln 374961, Col 4)
smY = `You summarize what was accomplished by a coding assistant.
Given the tools executed and their results, provide a brief summary.

Rules:
- Use past tense (e.g., "Read package.json", "Fixed type error in utils.ts")
- Be specific about what was done
- Keep under 8 words
- Do not include phrases like "I did" or "The assistant" - just describe what happened
- Focus on the user-visible outcome, not implementation details

Examples:
- "Searched codebase for authentication code"
- "Read and analyzed Message.tsx component"
- "Fixed null pointer exception in data processor"
- "Created new user registration endpoint"
- "Ran tests and fixed 3 failing assertions"`
// @from(Ln 374977, Col 4)
vs4 = v(() => {
    yw();
    m6();
    y6()
})
// @from(Ln 374983, Col 0)
function Es4(A) {
    let q = A.toLowerCase();
    return /\b(wtf|wth|ffs|omfg|shit(ty|tiest)?|dumbass|horrible|awful|piss(ed|ing)? off|piece of (shit|crap|junk)|what the (fuck|hell)|fucking? (broken|useless|terrible|awful|horrible)|fuck you|screw (this|you)|so frustrating|this sucks|damn it)\b/.test(q)
}
// @from(Ln 374988, Col 0)
function ks4(A) {
    let q = A.toLowerCase().trim();
    if (q === "continue") return !0;
    return /\b(keep going|go on)\b/.test(q)
}
// @from(Ln 374994, Col 0)
function Ls4(A) {
    let q = A.toLowerCase();
    return /\b(you'?re absolutely right|you'?re right)\b/.test(q)
}
// @from(Ln 374999, Col 0)
function n51(A) {
    return RQ(A)
}
// @from(Ln 375002, Col 4)
kZ6 = v(() => {
    i7()
})
// @from(Ln 375005, Col 4)
LZ6 = R((ys4) => {
    Object.defineProperty(ys4, "__esModule", {
        value: !0
    });
    ys4.getDeepKeys = ys4.toJSON = void 0;
    var tmY = ["function", "symbol", "undefined"],
        emY = ["constructor", "prototype", "__proto__"],
        AFY = Object.getPrototypeOf({});

    function qFY() {
        let A = {},
            q = this;
        for (let K of Rs4(q))
            if (typeof K === "string") {
                let Y = q[K],
                    z = typeof Y;
                if (!tmY.includes(z)) A[K] = Y
            } return A
    }
    ys4.toJSON = qFY;

    function Rs4(A, q = []) {
        let K = [];
        while (A && A !== AFY) K = K.concat(Object.getOwnPropertyNames(A), Object.getOwnPropertySymbols(A)), A = Object.getPrototypeOf(A);
        let Y = new Set(K);
        for (let z of q.concat(emY)) Y.delete(z);
        return Y
    }
    ys4.getDeepKeys = Rs4
})
// @from(Ln 375035, Col 4)
nCA = R((Is4) => {
    Object.defineProperty(Is4, "__esModule", {
        value: !0
    });
    Is4.addInspectMethod = Is4.format = void 0;
    var Ss4 = h1("util"),
        YFY = LZ6(),
        hs4 = Ss4.inspect.custom || Symbol.for("nodejs.util.inspect.custom");
    Is4.format = Ss4.format;

    function zFY(A) {
        A[hs4] = wFY
    }
    Is4.addInspectMethod = zFY;

    function wFY() {
        let A = {},
            q = this;
        for (let K of YFY.getDeepKeys(q)) {
            let Y = q[K];
            A[K] = Y
        }
        return delete A[hs4], A
    }
})
// @from(Ln 375060, Col 4)
Fs4 = R((Bs4) => {
    Object.defineProperty(Bs4, "__esModule", {
        value: !0
    });
    Bs4.lazyJoinStacks = Bs4.joinStacks = Bs4.isWritableStack = Bs4.isLazyStack = void 0;
    var $FY = /\r?\n/,
        OFY = /\bono[ @]/;

    function _FY(A) {
        return Boolean(A && A.configurable && typeof A.get === "function")
    }
    Bs4.isLazyStack = _FY;

    function JFY(A) {
        return Boolean(!A || A.writable || typeof A.set === "function")
    }
    Bs4.isWritableStack = JFY;

    function bs4(A, q) {
        let K = us4(A.stack),
            Y = q ? q.stack : void 0;
        if (K && Y) return K + `

` + Y;
        else return K || Y
    }
    Bs4.joinStacks = bs4;

    function XFY(A, q, K) {
        if (K) Object.defineProperty(q, "stack", {
            get: () => {
                let Y = A.get.apply(q);
                return bs4({
                    stack: Y
                }, K)
            },
            enumerable: !1,
            configurable: !0
        });
        else DFY(q, A)
    }
    Bs4.lazyJoinStacks = XFY;

    function us4(A) {
        if (A) {
            let q = A.split($FY),
                K;
            for (let Y = 0; Y < q.length; Y++) {
                let z = q[Y];
                if (OFY.test(z)) {
                    if (K === void 0) K = Y
                } else if (K !== void 0) {
                    q.splice(K, Y - K);
                    break
                }
            }
            if (q.length > 0) return q.join(`
`)
        }
        return A
    }

    function DFY(A, q) {
        Object.defineProperty(A, "stack", {
            get: () => us4(q.get.apply(A)),
            enumerable: !1,
            configurable: !0
        })
    }
})
// @from(Ln 375130, Col 4)
ds4 = R((Us4) => {
    Object.defineProperty(Us4, "__esModule", {
        value: !0
    });
    Us4.extendError = void 0;
    var Qs4 = nCA(),
        RZ6 = Fs4(),
        gs4 = LZ6(),
        WFY = ["name", "message", "stack"];

    function GFY(A, q, K) {
        let Y = A;
        if (ZFY(Y, q), q && typeof q === "object") fFY(Y, q);
        if (Y.toJSON = gs4.toJSON, Qs4.addInspectMethod) Qs4.addInspectMethod(Y);
        if (K && typeof K === "object") Object.assign(Y, K);
        return Y
    }
    Us4.extendError = GFY;

    function ZFY(A, q) {
        let K = Object.getOwnPropertyDescriptor(A, "stack");
        if (RZ6.isLazyStack(K)) RZ6.lazyJoinStacks(K, A, q);
        else if (RZ6.isWritableStack(K)) A.stack = RZ6.joinStacks(A, q)
    }

    function fFY(A, q) {
        let K = gs4.getDeepKeys(q, WFY),
            Y = A,
            z = q;
        for (let w of K)
            if (Y[w] === void 0) try {
                Y[w] = z[w]
            } catch (H) {}
    }
})
// @from(Ln 375165, Col 4)
is4 = R((cs4) => {
    Object.defineProperty(cs4, "__esModule", {
        value: !0
    });
    cs4.normalizeArgs = cs4.normalizeOptions = void 0;
    var VFY = nCA();

    function NFY(A) {
        return A = A || {}, {
            concatMessages: A.concatMessages === void 0 ? !0 : Boolean(A.concatMessages),
            format: A.format === void 0 ? VFY.format : typeof A.format === "function" ? A.format : !1
        }
    }
    cs4.normalizeOptions = NFY;

    function TFY(A, q) {
        let K, Y, z, w = "";
        if (typeof A[0] === "string") z = A;
        else if (typeof A[1] === "string") {
            if (A[0] instanceof Error) K = A[0];
            else Y = A[0];
            z = A.slice(1)
        } else K = A[0], Y = A[1], z = A.slice(2);
        if (z.length > 0)
            if (q.format) w = q.format.apply(void 0, z);
            else w = z.join(" ");
        if (q.concatMessages && K && K.message) w += (w ? ` 
` : "") + K.message;
        return {
            originalError: K,
            props: Y,
            message: w
        }
    }
    cs4.normalizeArgs = TFY
})
// @from(Ln 375201, Col 4)
oCA = R((rs4) => {
    Object.defineProperty(rs4, "__esModule", {
        value: !0
    });
    rs4.Ono = void 0;
    var yZ6 = ds4(),
        ns4 = is4(),
        EFY = LZ6(),
        kFY = rCA;
    rs4.Ono = kFY;

    function rCA(A, q) {
        q = ns4.normalizeOptions(q);

        function K(...Y) {
            let {
                originalError: z,
                props: w,
                message: H
            } = ns4.normalizeArgs(Y, q), $ = new A(H);
            return yZ6.extendError($, z, w)
        }
        return K[Symbol.species] = A, K
    }
    rCA.toJSON = function(q) {
        return EFY.toJSON.call(q)
    };
    rCA.extend = function(q, K, Y) {
        if (Y || K instanceof Error) return yZ6.extendError(q, K, Y);
        else if (K) return yZ6.extendError(q, void 0, K);
        else return yZ6.extendError(q)
    }
})
// @from(Ln 375234, Col 4)
ts4 = R((as4) => {
    Object.defineProperty(as4, "__esModule", {
        value: !0
    });
    as4.ono = void 0;
    var r51 = oCA(),
        LFY = Um;
    as4.ono = LFY;
    Um.error = new r51.Ono(Error);
    Um.eval = new r51.Ono(EvalError);
    Um.range = new r51.Ono(RangeError);
    Um.reference = new r51.Ono(ReferenceError);
    Um.syntax = new r51.Ono(SyntaxError);
    Um.type = new r51.Ono(TypeError);
    Um.uri = new r51.Ono(URIError);
    var RFY = Um;

    function Um(...A) {
        let q = A[0];
        if (typeof q === "object" && typeof q.name === "string") {
            for (let K of Object.values(RFY))
                if (typeof K === "function" && K.name === "ono") {
                    let Y = K[Symbol.species];
                    if (Y && Y !== Error && (q instanceof Y || q.name === Y.name)) return K.apply(void 0, A)
                }
        }
        return Um.error.apply(void 0, A)
    }
})
// @from(Ln 375263, Col 4)
At4 = R((es4) => {
    Object.defineProperty(es4, "__esModule", {
        value: !0
    });
    var yRH = h1("util")
})
// @from(Ln 375269, Col 4)
gt = R((SI, vG1) => {
    var yFY = SI && SI.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            Object.defineProperty(A, Y, {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            })
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        CFY = SI && SI.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !q.hasOwnProperty(K)) yFY(q, A, K)
        };
    Object.defineProperty(SI, "__esModule", {
        value: !0
    });
    SI.ono = void 0;
    var qt4 = ts4();
    Object.defineProperty(SI, "ono", {
        enumerable: !0,
        get: function() {
            return qt4.ono
        }
    });
    var SFY = oCA();
    Object.defineProperty(SI, "Ono", {
        enumerable: !0,
        get: function() {
            return SFY.Ono
        }
    });
    CFY(At4(), SI);
    SI.default = qt4.ono;
    if (typeof vG1 === "object" && typeof vG1.exports === "object") vG1.exports = Object.assign(vG1.exports.default, vG1.exports)
})
// @from(Ln 375308, Col 4)
zy = R((uFY, Kt4) => {
    var CZ6 = /^win/.test(process.platform),
        hFY = /\//g,
        IFY = /^(\w{2,}):\/\//i,
        tCA = uFY,
        xFY = /~1/g,
        bFY = /~0/g,
        aCA = [/\?/g, "%3F", /\#/g, "%23"],
        sCA = [/\%23/g, "#", /\%24/g, "$", /\%26/g, "&", /\%2C/g, ",", /\%40/g, "@"];
    uFY.parse = h1("url").parse;
    uFY.resolve = h1("url").resolve;
    uFY.cwd = function() {
        let q = process.cwd(),
            K = q.slice(-1);
        if (K === "/" || K === "\\") return q;
        else return q + "/"
    };
    uFY.getProtocol = function(q) {
        let K = IFY.exec(q);
        if (K) return K[1].toLowerCase()
    };
    uFY.getExtension = function(q) {
        let K = q.lastIndexOf(".");
        if (K >= 0) return tCA.stripQuery(q.substr(K).toLowerCase());
        return ""
    };
    uFY.stripQuery = function(q) {
        let K = q.indexOf("?");
        if (K >= 0) q = q.substr(0, K);
        return q
    };
    uFY.getHash = function(q) {
        let K = q.indexOf("#");
        if (K >= 0) return q.substr(K);
        return "#"
    };
    uFY.stripHash = function(q) {
        let K = q.indexOf("#");
        if (K >= 0) q = q.substr(0, K);
        return q
    };
    uFY.isHttp = function(q) {
        let K = tCA.getProtocol(q);
        if (K === "http" || K === "https") return !0;
        else if (K === void 0) return !1;
        else return !1
    };
    uFY.isFileSystemPath = function(q) {
        let K = tCA.getProtocol(q);
        return K === void 0 || K === "file"
    };
    uFY.fromFileSystemPath = function(q) {
        if (CZ6) q = q.replace(/\\/g, "/");
        q = encodeURI(q);
        for (let K = 0; K < aCA.length; K += 2) q = q.replace(aCA[K], aCA[K + 1]);
        return q
    };
    uFY.toFileSystemPath = function(q, K) {
        q = decodeURI(q);
        for (let z = 0; z < sCA.length; z += 2) q = q.replace(sCA[z], sCA[z + 1]);
        let Y = q.substr(0, 7).toLowerCase() === "file://";
        if (Y) {
            if (q = q[7] === "/" ? q.substr(8) : q.substr(7), CZ6 && q[1] === "/") q = q[0] + ":" + q.substr(1);
            if (K) q = "file:///" + q;
            else Y = !1, q = CZ6 ? q : "/" + q
        }
        if (CZ6 && !Y) {
            if (q = q.replace(hFY, "\\"), q.substr(1, 2) === ":\\") q = q[0].toUpperCase() + q.substr(1)
        }
        return q
    };
    uFY.safePointerToPath = function(q) {
        if (q.length <= 1 || q[0] !== "#" || q[1] !== "/") return [];
        return q.slice(2).split("/").map((K) => {
            return decodeURIComponent(K).replace(xFY, "/").replace(bFY, "~")
        })
    }
})
// @from(Ln 375386, Col 4)
hI = R((KQY) => {
    var {
        Ono: Yt4
    } = gt(), {
        stripHash: zt4,
        toFileSystemPath: oFY
    } = zy(), Ut = KQY.JSONParserError = class extends Error {
        constructor(q, K) {
            super();
            this.code = "EUNKNOWN", this.message = q, this.source = K, this.path = null, Yt4.extend(this)
        }
        get footprint() {
            return `${this.path}+${this.source}+${this.code}+${this.message}`
        }
    };
    pt(Ut);
    var wt4 = KQY.JSONParserErrorGroup = class A extends Error {
        constructor(q) {
            super();
            this.files = q, this.message = `${this.errors.length} error${this.errors.length>1?"s":""} occurred while reading '${oFY(q.$refs._root$Ref.path)}'`, Yt4.extend(this)
        }
        static getParserErrors(q) {
            let K = [];
            for (let Y of Object.values(q.$refs._$refs))
                if (Y.errors) K.push(...Y.errors);
            return K
        }
        get errors() {
            return A.getParserErrors(this.files)
        }
    };
    pt(wt4);
    var aFY = KQY.ParserError = class extends Ut {
        constructor(q, K) {
            super(`Error parsing ${K}: ${q}`, K);
            this.code = "EPARSER"
        }
    };
    pt(aFY);
    var sFY = KQY.UnmatchedParserError = class extends Ut {
        constructor(q) {
            super(`Could not find parser for "${q}"`, q);
            this.code = "EUNMATCHEDPARSER"
        }
    };
    pt(sFY);
    var tFY = KQY.ResolverError = class extends Ut {
        constructor(q, K) {
            super(q.message || `Error reading file "${K}"`, K);
            if (this.code = "ERESOLVER", "code" in q) this.ioErrorCode = String(q.code)
        }
    };
    pt(tFY);
    var eFY = KQY.UnmatchedResolverError = class extends Ut {
        constructor(q) {
            super(`Could not find resolver for "${q}"`, q);
            this.code = "EUNMATCHEDRESOLVER"
        }
    };
    pt(eFY);
    var AQY = KQY.MissingPointerError = class extends Ut {
        constructor(q, K) {
            super(`Token "${q}" does not exist.`, zt4(K));
            this.code = "EMISSINGPOINTER"
        }
    };
    pt(AQY);
    var qQY = KQY.InvalidPointerError = class extends Ut {
        constructor(q, K) {
            super(`Invalid $ref pointer "${q}". Pointers must begin with "#/"`, zt4(K));
            this.code = "EINVALIDPOINTER"
        }
    };
    pt(qQY);

    function pt(A) {
        Object.defineProperty(A.prototype, "name", {
            value: A.name,
            enumerable: !0
        })
    }
    KQY.isHandledError = function(A) {
        return A instanceof Ut || A instanceof wt4
    };
    KQY.normalizeError = function(A) {
        if (A.path === null) A.path = [];
        return A
    }
})
// @from(Ln 375475, Col 4)
WU1 = R((QRH, Ot4) => {
    Ot4.exports = dt;
    var eCA = EG1(),
        ASA = zy(),
        {
            JSONParserError: wQY,
            InvalidPointerError: HQY,
            MissingPointerError: $QY,
            isHandledError: OQY
        } = hI(),
        _QY = /\//g,
        JQY = /~/g,
        XQY = /~1/g,
        DQY = /~0/g;

    function dt(A, q, K) {
        this.$ref = A, this.path = q, this.originalPath = K || q, this.value = void 0, this.circular = !1, this.indirections = 0
    }
    dt.prototype.resolve = function(A, q, K) {
        let Y = dt.parse(this.path, this.originalPath);
        this.value = $t4(A);
        for (let z = 0; z < Y.length; z++) {
            if (SZ6(this, q)) this.path = dt.join(this.path, Y.slice(z));
            if (typeof this.value === "object" && this.value !== null && "$ref" in this.value) return this;
            let w = Y[z];
            if (this.value[w] === void 0 || this.value[w] === null) throw this.value = null, new $QY(w, decodeURI(this.originalPath));
            else this.value = this.value[w]
        }
        if (!this.value || this.value.$ref && ASA.resolve(this.path, this.value.$ref) !== K) SZ6(this, q);
        return this
    };
    dt.prototype.set = function(A, q, K) {
        let Y = dt.parse(this.path),
            z;
        if (Y.length === 0) return this.value = q, q;
        this.value = $t4(A);
        for (let w = 0; w < Y.length - 1; w++)
            if (SZ6(this, K), z = Y[w], this.value && this.value[z] !== void 0) this.value = this.value[z];
            else this.value = Ht4(this, z, {});
        return SZ6(this, K), z = Y[Y.length - 1], Ht4(this, z, q), A
    };
    dt.parse = function(A, q) {
        let K = ASA.getHash(A).substr(1);
        if (!K) return [];
        K = K.split("/");
        for (let Y = 0; Y < K.length; Y++) K[Y] = decodeURIComponent(K[Y].replace(XQY, "/").replace(DQY, "~"));
        if (K[0] !== "") throw new HQY(K, q === void 0 ? A : q);
        return K.slice(1)
    };
    dt.join = function(A, q) {
        if (A.indexOf("#") === -1) A += "#";
        q = Array.isArray(q) ? q : [q];
        for (let K = 0; K < q.length; K++) {
            let Y = q[K];
            A += "/" + encodeURIComponent(Y.replace(JQY, "~0").replace(_QY, "~1"))
        }
        return A
    };

    function SZ6(A, q) {
        if (eCA.isAllowed$Ref(A.value, q)) {
            let K = ASA.resolve(A.path, A.value.$ref);
            if (K === A.path) A.circular = !0;
            else {
                let Y = A.$ref.$refs._resolve(K, A.path, q);
                if (Y === null) return !1;
                if (A.indirections += Y.indirections + 1, eCA.isExtended$Ref(A.value)) return A.value = eCA.dereference(A.value, Y.value), !1;
                else A.$ref = Y.$ref, A.path = Y.path, A.value = Y.value;
                return !0
            }
        }
    }

    function Ht4(A, q, K) {
        if (A.value && typeof A.value === "object")
            if (q === "-" && Array.isArray(A.value)) A.value.push(K);
            else A.value[q] = K;
        else throw new wQY(`Error assigning $ref pointer "${A.path}". 
Cannot set "${q}" of a non-object.`);
        return K
    }

    function $t4(A) {
        if (OQY(A)) throw A;
        return A
    }
})
// @from(Ln 375562, Col 4)
EG1 = R((gRH, Xt4) => {
    Xt4.exports = nZ;
    var Jt4 = WU1(),
        {
            InvalidPointerError: jQY,
            isHandledError: MQY,
            normalizeError: _t4
        } = hI(),
        {
            safePointerToPath: PQY,
            stripHash: WQY,
            getHash: GQY
        } = zy();

    function nZ() {
        this.path = void 0, this.value = void 0, this.$refs = void 0, this.pathType = void 0, this.errors = void 0
    }
    nZ.prototype.addError = function(A) {
        if (this.errors === void 0) this.errors = [];
        let q = this.errors.map(({
            footprint: K
        }) => K);
        if (Array.isArray(A.errors)) this.errors.push(...A.errors.map(_t4).filter(({
            footprint: K
        }) => !q.includes(K)));
        else if (!q.includes(A.footprint)) this.errors.push(_t4(A))
    };
    nZ.prototype.exists = function(A, q) {
        try {
            return this.resolve(A, q), !0
        } catch (K) {
            return !1
        }
    };
    nZ.prototype.get = function(A, q) {
        return this.resolve(A, q).value
    };
    nZ.prototype.resolve = function(A, q, K, Y) {
        let z = new Jt4(this, A, K);
        try {
            return z.resolve(this.value, q, Y)
        } catch (w) {
            if (!q || !q.continueOnError || !MQY(w)) throw w;
            if (w.path === null) w.path = PQY(GQY(Y));
            if (w instanceof jQY) w.source = decodeURI(WQY(Y));
            return this.addError(w), null
        }
    };
    nZ.prototype.set = function(A, q) {
        let K = new Jt4(this, A);
        this.value = K.set(this.value, q)
    };
    nZ.is$Ref = function(A) {
        return A && typeof A === "object" && typeof A.$ref === "string" && A.$ref.length > 0
    };
    nZ.isExternal$Ref = function(A) {
        return nZ.is$Ref(A) && A.$ref[0] !== "#"
    };
    nZ.isAllowed$Ref = function(A, q) {
        if (nZ.is$Ref(A)) {
            if (A.$ref.substr(0, 2) === "#/" || A.$ref === "#") return !0;
            else if (A.$ref[0] !== "#" && (!q || q.resolve.external)) return !0
        }
    };
    nZ.isExtended$Ref = function(A) {
        return nZ.is$Ref(A) && Object.keys(A).length > 1
    };
    nZ.dereference = function(A, q) {
        if (q && typeof q === "object" && nZ.isExtended$Ref(A)) {
            let K = {};
            for (let Y of Object.keys(A))
                if (Y !== "$ref") K[Y] = A[Y];
            for (let Y of Object.keys(q))
                if (!(Y in K)) K[Y] = q[Y];
            return K
        } else return q
    }
})
// @from(Ln 375640, Col 4)
Pt4 = R((URH, Mt4) => {
    var {
        ono: Dt4
    } = gt(), ZQY = EG1(), ct = zy();
    Mt4.exports = II;

    function II() {
        this.circular = !1, this._$refs = {}, this._root$Ref = null
    }
    II.prototype.paths = function(A) {
        return jt4(this._$refs, arguments).map((K) => {
            return K.decoded
        })
    };
    II.prototype.values = function(A) {
        let q = this._$refs;
        return jt4(q, arguments).reduce((Y, z) => {
            return Y[z.decoded] = q[z.encoded].value, Y
        }, {})
    };
    II.prototype.toJSON = II.prototype.values;
    II.prototype.exists = function(A, q) {
        try {
            return this._resolve(A, "", q), !0
        } catch (K) {
            return !1
        }
    };
    II.prototype.get = function(A, q) {
        return this._resolve(A, "", q).value
    };
    II.prototype.set = function(A, q) {
        let K = ct.resolve(this._root$Ref.path, A),
            Y = ct.stripHash(K),
            z = this._$refs[Y];
        if (!z) throw Dt4(`Error resolving $ref pointer "${A}". 
"${Y}" not found.`);
        z.set(K, q)
    };
    II.prototype._add = function(A) {
        let q = ct.stripHash(A),
            K = new ZQY;
        return K.path = q, K.$refs = this, this._$refs[q] = K, this._root$Ref = this._root$Ref || K, K
    };
    II.prototype._resolve = function(A, q, K) {
        let Y = ct.resolve(this._root$Ref.path, A),
            z = ct.stripHash(Y),
            w = this._$refs[z];
        if (!w) throw Dt4(`Error resolving $ref pointer "${A}". 
"${z}" not found.`);
        return w.resolve(Y, K, A, q)
    };
    II.prototype._get$Ref = function(A) {
        A = ct.resolve(this._root$Ref.path, A);
        let q = ct.stripHash(A);
        return this._$refs[q]
    };

    function jt4(A, q) {
        let K = Object.keys(A);
        if (q = Array.isArray(q[0]) ? q[0] : Array.prototype.slice.call(q), q.length > 0 && q[0]) K = K.filter((Y) => {
            return q.indexOf(A[Y].pathType) !== -1
        });
        return K.map((Y) => {
            return {
                encoded: Y,
                decoded: A[Y].pathType === "file" ? ct.toFileSystemPath(Y, !0) : Y
            }
        })
    }
})
// @from(Ln 375711, Col 4)
Gt4 = R((fQY) => {
    fQY.all = function(A) {
        return Object.keys(A).filter((q) => {
            return typeof A[q] === "object"
        }).map((q) => {
            return A[q].name = q, A[q]
        })
    };
    fQY.filter = function(A, q, K) {
        return A.filter((Y) => {
            return !!Wt4(Y, q, K)
        })
    };
    fQY.sort = function(A) {
        for (let q of A) q.order = q.order || Number.MAX_SAFE_INTEGER;
        return A.sort((q, K) => {
            return q.order - K.order
        })
    };
    fQY.run = function(A, q, K, Y) {
        let z, w, H = 0;
        return new Promise(($, O) => {
            _();

            function _() {
                if (z = A[H++], !z) return O(w);
                try {
                    let j = Wt4(z, q, K, J, Y);
                    if (j && typeof j.then === "function") j.then(X, D);
                    else if (j !== void 0) X(j);
                    else if (H === A.length) throw Error("No promise has been returned or callback has been called.")
                } catch (j) {
                    D(j)
                }
            }

            function J(j, M) {
                if (j) D(j);
                else X(M)
            }

            function X(j) {
                $({
                    plugin: z,
                    result: j
                })
            }

            function D(j) {
                w = {
                    plugin: z,
                    error: j
                }, _()
            }
        })
    };

    function Wt4(A, q, K, Y, z) {
        let w = A[q];
        if (typeof w === "function") return w.apply(A, [K, Y, z]);
        if (!Y) {
            if (w instanceof RegExp) return w.test(K.url);
            else if (typeof w === "string") return w === K.extension;
            else if (Array.isArray(w)) return w.indexOf(K.extension) !== -1
        }
        return w
    }
})
// @from(Ln 375779, Col 4)
KSA = R((dRH, Nt4) => {
    var {
        ono: qSA
    } = gt(), Zt4 = zy(), lt = Gt4(), {
        ResolverError: ft4,
        ParserError: Vt4,
        UnmatchedParserError: EQY,
        UnmatchedResolverError: kQY,
        isHandledError: LQY
    } = hI();
    Nt4.exports = RQY;
    async function RQY(A, q, K) {
        A = Zt4.stripHash(A);
        let Y = q._add(A),
            z = {
                url: A,
                extension: Zt4.getExtension(A)
            };
        try {
            let w = await yQY(z, K, q);
            Y.pathType = w.plugin.name, z.data = w.result;
            let H = await CQY(z, K, q);
            return Y.value = H.result, H.result
        } catch (w) {
            if (LQY(w)) Y.value = w;
            throw w
        }
    }

    function yQY(A, q, K) {
        return new Promise((Y, z) => {
            let w = lt.all(q.resolve);
            w = lt.filter(w, "canRead", A), lt.sort(w), lt.run(w, "read", A, K).then(Y, H);

            function H($) {
                if (!$ && q.continueOnError) z(new kQY(A.url));
                else if (!$ || !("error" in $)) z(qSA.syntax(`Unable to resolve $ref pointer "${A.url}"`));
                else if ($.error instanceof ft4) z($.error);
                else z(new ft4($, A.url))
            }
        })
    }

    function CQY(A, q, K) {
        return new Promise((Y, z) => {
            let w = lt.all(q.parse),
                H = lt.filter(w, "canParse", A),
                $ = H.length > 0 ? H : w;
            lt.sort($), lt.run($, "parse", A, K).then(O, _);

            function O(J) {
                if (!J.plugin.allowEmpty && SQY(J.result)) z(qSA.syntax(`Error parsing "${A.url}" as ${J.plugin.name}. 
Parsed value is empty`));
                else Y(J)
            }

            function _(J) {
                if (!J && q.continueOnError) z(new EQY(A.url));
                else if (!J || !("error" in J)) z(qSA.syntax(`Unable to parse ${A.url}`));
                else if (J.error instanceof Vt4) z(J.error);
                else z(new Vt4(J.error.message, A.url))
            }
        })
    }

    function SQY(A) {
        return A === void 0 || typeof A === "object" && Object.keys(A).length === 0 || typeof A === "string" && A.trim().length === 0 || Buffer.isBuffer(A) && A.length === 0
    }
})
// @from(Ln 375848, Col 4)
vt4 = R((cRH, Tt4) => {
    var {
        ParserError: hQY
    } = hI();
    Tt4.exports = {
        order: 100,
        allowEmpty: !0,
        canParse: ".json",
        async parse(A) {
            let q = A.data;
            if (Buffer.isBuffer(q)) q = q.toString();
            if (typeof q === "string")
                if (q.trim().length === 0) return;
                else try {
                    return JSON.parse(q)
                } catch (K) {
                    throw new hQY(K.message, A.url)
                } else return q
        }
    }
})
// @from(Ln 375869, Col 4)
kG1 = R((mQY, o51) => {
    function Et4(A) {
        return typeof A > "u" || A === null
    }

    function IQY(A) {
        return typeof A === "object" && A !== null
    }

    function xQY(A) {
        if (Array.isArray(A)) return A;
        else if (Et4(A)) return [];
        return [A]
    }

    function bQY(A, q) {
        var K, Y, z, w;
        if (q) {
            w = Object.keys(q);
            for (K = 0, Y = w.length; K < Y; K += 1) z = w[K], A[z] = q[z]
        }
        return A
    }

    function uQY(A, q) {
        var K = "",
            Y;
        for (Y = 0; Y < q; Y += 1) K += A;
        return K
    }

    function BQY(A) {
        return A === 0 && Number.NEGATIVE_INFINITY === 1 / A
    }
    mQY.isNothing = Et4;
    mQY.isObject = IQY;
    mQY.toArray = xQY;
    mQY.repeat = uQY;
    mQY.isNegativeZero = BQY;
    mQY.extend = bQY
})
// @from(Ln 375910, Col 4)
LG1 = R((lRH, Lt4) => {
    function kt4(A, q) {
        var K = "",
            Y = A.reason || "(unknown reason)";
        if (!A.mark) return Y;
        if (A.mark.name) K += 'in "' + A.mark.name + '" ';
        if (K += "(" + (A.mark.line + 1) + ":" + (A.mark.column + 1) + ")", !q && A.mark.snippet) K += `

` + A.mark.snippet;
        return Y + " " + K
    }

    function GU1(A, q) {
        if (Error.call(this), this.name = "YAMLException", this.reason = A, this.mark = q, this.message = kt4(this, !1), Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
        else this.stack = Error().stack || ""
    }
    GU1.prototype = Object.create(Error.prototype);
    GU1.prototype.constructor = GU1;
    GU1.prototype.toString = function(q) {
        return this.name + ": " + kt4(this, q)
    };
    Lt4.exports = GU1
})
// @from(Ln 375933, Col 4)
yt4 = R((iRH, Rt4) => {
    var ZU1 = kG1();

    function YSA(A, q, K, Y, z) {
        var w = "",
            H = "",
            $ = Math.floor(z / 2) - 1;
        if (Y - q > $) w = " ... ", q = Y - $ + w.length;
        if (K - Y > $) H = " ...", K = Y + $ - H.length;
        return {
            str: w + A.slice(q, K).replace(/\t/g, "→") + H,
            pos: Y - q + w.length
        }
    }

    function zSA(A, q) {
        return ZU1.repeat(" ", q - A.length) + A
    }

    function cQY(A, q) {
        if (q = Object.create(q || null), !A.buffer) return null;
        if (!q.maxLength) q.maxLength = 79;
        if (typeof q.indent !== "number") q.indent = 1;
        if (typeof q.linesBefore !== "number") q.linesBefore = 3;
        if (typeof q.linesAfter !== "number") q.linesAfter = 2;
        var K = /\r?\n|\r|\0/g,
            Y = [0],
            z = [],
            w, H = -1;
        while (w = K.exec(A.buffer))
            if (z.push(w.index), Y.push(w.index + w[0].length), A.position <= w.index && H < 0) H = Y.length - 2;
        if (H < 0) H = Y.length - 1;
        var $ = "",
            O, _, J = Math.min(A.line + q.linesAfter, z.length).toString().length,
            X = q.maxLength - (q.indent + J + 3);
        for (O = 1; O <= q.linesBefore; O++) {
            if (H - O < 0) break;
            _ = YSA(A.buffer, Y[H - O], z[H - O], A.position - (Y[H] - Y[H - O]), X), $ = ZU1.repeat(" ", q.indent) + zSA((A.line - O + 1).toString(), J) + " | " + _.str + `
` + $
        }
        _ = YSA(A.buffer, Y[H], z[H], A.position, X), $ += ZU1.repeat(" ", q.indent) + zSA((A.line + 1).toString(), J) + " | " + _.str + `
`, $ += ZU1.repeat("-", q.indent + J + 3 + _.pos) + `^
`;
        for (O = 1; O <= q.linesAfter; O++) {
            if (H + O >= z.length) break;
            _ = YSA(A.buffer, Y[H + O], z[H + O], A.position - (Y[H] - Y[H + O]), X), $ += ZU1.repeat(" ", q.indent) + zSA((A.line + O + 1).toString(), J) + " | " + _.str + `
`
        }
        return $.replace(/\n$/, "")
    }
    Rt4.exports = cQY
})
// @from(Ln 375985, Col 4)
YG = R((nRH, St4) => {
    var Ct4 = LG1(),
        lQY = ["kind", "multi", "resolve", "construct", "instanceOf", "predicate", "represent", "representName", "defaultStyle", "styleAliases"],
        iQY = ["scalar", "sequence", "mapping"];

    function nQY(A) {
        var q = {};
        if (A !== null) Object.keys(A).forEach(function(K) {
            A[K].forEach(function(Y) {
                q[String(Y)] = K
            })
        });
        return q
    }

    function rQY(A, q) {
        if (q = q || {}, Object.keys(q).forEach(function(K) {
                if (lQY.indexOf(K) === -1) throw new Ct4('Unknown option "' + K + '" is met in definition of "' + A + '" YAML type.')
            }), this.options = q, this.tag = A, this.kind = q.kind || null, this.resolve = q.resolve || function() {
                return !0
            }, this.construct = q.construct || function(K) {
                return K
            }, this.instanceOf = q.instanceOf || null, this.predicate = q.predicate || null, this.represent = q.represent || null, this.representName = q.representName || null, this.defaultStyle = q.defaultStyle || null, this.multi = q.multi || !1, this.styleAliases = nQY(q.styleAliases || null), iQY.indexOf(this.kind) === -1) throw new Ct4('Unknown kind "' + this.kind + '" is specified for "' + A + '" YAML type.')
    }
    St4.exports = rQY
})
// @from(Ln 376011, Col 4)
$SA = R((rRH, It4) => {
    var fU1 = LG1(),
        wSA = YG();

    function ht4(A, q) {
        var K = [];
        return A[q].forEach(function(Y) {
            var z = K.length;
            K.forEach(function(w, H) {
                if (w.tag === Y.tag && w.kind === Y.kind && w.multi === Y.multi) z = H
            }), K[z] = Y
        }), K
    }

    function oQY() {
        var A = {
                scalar: {},
                sequence: {},
                mapping: {},
                fallback: {},
                multi: {
                    scalar: [],
                    sequence: [],
                    mapping: [],
                    fallback: []
                }
            },
            q, K;

        function Y(z) {
            if (z.multi) A.multi[z.kind].push(z), A.multi.fallback.push(z);
            else A[z.kind][z.tag] = A.fallback[z.tag] = z
        }
        for (q = 0, K = arguments.length; q < K; q += 1) arguments[q].forEach(Y);
        return A
    }

    function HSA(A) {
        return this.extend(A)
    }
    HSA.prototype.extend = function(q) {
        var K = [],
            Y = [];
        if (q instanceof wSA) Y.push(q);
        else if (Array.isArray(q)) Y = Y.concat(q);
        else if (q && (Array.isArray(q.implicit) || Array.isArray(q.explicit))) {
            if (q.implicit) K = K.concat(q.implicit);
            if (q.explicit) Y = Y.concat(q.explicit)
        } else throw new fU1("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
        K.forEach(function(w) {
            if (!(w instanceof wSA)) throw new fU1("Specified list of YAML types (or a single Type object) contains a non-Type object.");
            if (w.loadKind && w.loadKind !== "scalar") throw new fU1("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
            if (w.multi) throw new fU1("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")
        }), Y.forEach(function(w) {
            if (!(w instanceof wSA)) throw new fU1("Specified list of YAML types (or a single Type object) contains a non-Type object.")
        });
        var z = Object.create(HSA.prototype);
        return z.implicit = (this.implicit || []).concat(K), z.explicit = (this.explicit || []).concat(Y), z.compiledImplicit = ht4(z, "implicit"), z.compiledExplicit = ht4(z, "explicit"), z.compiledTypeMap = oQY(z.compiledImplicit, z.compiledExplicit), z
    };
    It4.exports = HSA
})
// @from(Ln 376072, Col 4)
OSA = R((oRH, xt4) => {
    var aQY = YG();
    xt4.exports = new aQY("tag:yaml.org,2002:str", {
        kind: "scalar",
        construct: function(A) {
            return A !== null ? A : ""
        }
    })
})
// @from(Ln 376081, Col 4)
_SA = R((aRH, bt4) => {
    var sQY = YG();
    bt4.exports = new sQY("tag:yaml.org,2002:seq", {
        kind: "sequence",
        construct: function(A) {
            return A !== null ? A : []
        }
    })
})
// @from(Ln 376090, Col 4)
JSA = R((sRH, ut4) => {
    var tQY = YG();
    ut4.exports = new tQY("tag:yaml.org,2002:map", {
        kind: "mapping",
        construct: function(A) {
            return A !== null ? A : {}
        }
    })
})
// @from(Ln 376099, Col 4)
XSA = R((tRH, Bt4) => {
    var eQY = $SA();
    Bt4.exports = new eQY({
        explicit: [OSA(), _SA(), JSA()]
    })
})
// @from(Ln 376105, Col 4)
DSA = R((eRH, mt4) => {
    var AgY = YG();

    function qgY(A) {
        if (A === null) return !0;
        var q = A.length;
        return q === 1 && A === "~" || q === 4 && (A === "null" || A === "Null" || A === "NULL")
    }

    function KgY() {
        return null
    }

    function YgY(A) {
        return A === null
    }
    mt4.exports = new AgY("tag:yaml.org,2002:null", {
        kind: "scalar",
        resolve: qgY,
        construct: KgY,
        predicate: YgY,
        represent: {
            canonical: function() {
                return "~"
            },
            lowercase: function() {
                return "null"
            },
            uppercase: function() {
                return "NULL"
            },
            camelcase: function() {
                return "Null"
            },
            empty: function() {
                return ""
            }
        },
        defaultStyle: "lowercase"
    })
})
// @from(Ln 376146, Col 4)
jSA = R((AyH, Ft4) => {
    var zgY = YG();

    function wgY(A) {
        if (A === null) return !1;
        var q = A.length;
        return q === 4 && (A === "true" || A === "True" || A === "TRUE") || q === 5 && (A === "false" || A === "False" || A === "FALSE")
    }

    function HgY(A) {
        return A === "true" || A === "True" || A === "TRUE"
    }

    function $gY(A) {
        return Object.prototype.toString.call(A) === "[object Boolean]"
    }
    Ft4.exports = new zgY("tag:yaml.org,2002:bool", {
        kind: "scalar",
        resolve: wgY,
        construct: HgY,
        predicate: $gY,
        represent: {
            lowercase: function(A) {
                return A ? "true" : "false"
            },
            uppercase: function(A) {
                return A ? "TRUE" : "FALSE"
            },
            camelcase: function(A) {
                return A ? "True" : "False"
            }
        },
        defaultStyle: "lowercase"
    })
})
// @from(Ln 376181, Col 4)
MSA = R((qyH, Qt4) => {
    var OgY = kG1(),
        _gY = YG();

    function JgY(A) {
        return 48 <= A && A <= 57 || 65 <= A && A <= 70 || 97 <= A && A <= 102
    }

    function XgY(A) {
        return 48 <= A && A <= 55
    }

    function DgY(A) {
        return 48 <= A && A <= 57
    }

    function jgY(A) {
        if (A === null) return !1;
        var q = A.length,
            K = 0,
            Y = !1,
            z;
        if (!q) return !1;
        if (z = A[K], z === "-" || z === "+") z = A[++K];
        if (z === "0") {
            if (K + 1 === q) return !0;
            if (z = A[++K], z === "b") {
                K++;
                for (; K < q; K++) {
                    if (z = A[K], z === "_") continue;
                    if (z !== "0" && z !== "1") return !1;
                    Y = !0
                }
                return Y && z !== "_"
            }
            if (z === "x") {
                K++;
                for (; K < q; K++) {
                    if (z = A[K], z === "_") continue;
                    if (!JgY(A.charCodeAt(K))) return !1;
                    Y = !0
                }
                return Y && z !== "_"
            }
            if (z === "o") {
                K++;
                for (; K < q; K++) {
                    if (z = A[K], z === "_") continue;
                    if (!XgY(A.charCodeAt(K))) return !1;
                    Y = !0
                }
                return Y && z !== "_"
            }
        }
        if (z === "_") return !1;
        for (; K < q; K++) {
            if (z = A[K], z === "_") continue;
            if (!DgY(A.charCodeAt(K))) return !1;
            Y = !0
        }
        if (!Y || z === "_") return !1;
        return !0
    }

    function MgY(A) {
        var q = A,
            K = 1,
            Y;
        if (q.indexOf("_") !== -1) q = q.replace(/_/g, "");
        if (Y = q[0], Y === "-" || Y === "+") {
            if (Y === "-") K = -1;
            q = q.slice(1), Y = q[0]
        }
        if (q === "0") return 0;
        if (Y === "0") {
            if (q[1] === "b") return K * parseInt(q.slice(2), 2);
            if (q[1] === "x") return K * parseInt(q.slice(2), 16);
            if (q[1] === "o") return K * parseInt(q.slice(2), 8)
        }
        return K * parseInt(q, 10)
    }

    function PgY(A) {
        return Object.prototype.toString.call(A) === "[object Number]" && (A % 1 === 0 && !OgY.isNegativeZero(A))
    }
    Qt4.exports = new _gY("tag:yaml.org,2002:int", {
        kind: "scalar",
        resolve: jgY,
        construct: MgY,
        predicate: PgY,
        represent: {
            binary: function(A) {
                return A >= 0 ? "0b" + A.toString(2) : "-0b" + A.toString(2).slice(1)
            },
            octal: function(A) {
                return A >= 0 ? "0o" + A.toString(8) : "-0o" + A.toString(8).slice(1)
            },
            decimal: function(A) {
                return A.toString(10)
            },
            hexadecimal: function(A) {
                return A >= 0 ? "0x" + A.toString(16).toUpperCase() : "-0x" + A.toString(16).toUpperCase().slice(1)
            }
        },
        defaultStyle: "decimal",
        styleAliases: {
            binary: [2, "bin"],
            octal: [8, "oct"],
            decimal: [10, "dec"],
            hexadecimal: [16, "hex"]
        }
    })
})
// @from(Ln 376294, Col 4)
PSA = R((KyH, Ut4) => {
    var gt4 = kG1(),
        WgY = YG(),
        GgY = new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");

    function ZgY(A) {
        if (A === null) return !1;
        if (!GgY.test(A) || A[A.length - 1] === "_") return !1;
        return !0
    }

    function fgY(A) {
        var q, K;
        if (q = A.replace(/_/g, "").toLowerCase(), K = q[0] === "-" ? -1 : 1, "+-".indexOf(q[0]) >= 0) q = q.slice(1);
        if (q === ".inf") return K === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        else if (q === ".nan") return NaN;
        return K * parseFloat(q, 10)
    }
    var VgY = /^[-+]?[0-9]+e/;

    function NgY(A, q) {
        var K;
        if (isNaN(A)) switch (q) {
            case "lowercase":
                return ".nan";
            case "uppercase":
                return ".NAN";
            case "camelcase":
                return ".NaN"
        } else if (Number.POSITIVE_INFINITY === A) switch (q) {
            case "lowercase":
                return ".inf";
            case "uppercase":
                return ".INF";
            case "camelcase":
                return ".Inf"
        } else if (Number.NEGATIVE_INFINITY === A) switch (q) {
            case "lowercase":
                return "-.inf";
            case "uppercase":
                return "-.INF";
            case "camelcase":
                return "-.Inf"
        } else if (gt4.isNegativeZero(A)) return "-0.0";
        return K = A.toString(10), VgY.test(K) ? K.replace("e", ".e") : K
    }

    function TgY(A) {
        return Object.prototype.toString.call(A) === "[object Number]" && (A % 1 !== 0 || gt4.isNegativeZero(A))
    }
    Ut4.exports = new WgY("tag:yaml.org,2002:float", {
        kind: "scalar",
        resolve: ZgY,
        construct: fgY,
        predicate: TgY,
        represent: NgY,
        defaultStyle: "lowercase"
    })
})
// @from(Ln 376353, Col 4)
hZ6 = R((YyH, pt4) => {
    pt4.exports = XSA().extend({
        implicit: [DSA(), jSA(), MSA(), PSA()]
    })
})
// @from(Ln 376358, Col 4)
WSA = R((zyH, lt4) => {
    var vgY = YG(),
        dt4 = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),
        ct4 = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");

    function EgY(A) {
        if (A === null) return !1;
        if (dt4.exec(A) !== null) return !0;
        if (ct4.exec(A) !== null) return !0;
        return !1
    }

    function kgY(A) {
        var q, K, Y, z, w, H, $, O = 0,
            _ = null,
            J, X, D;
        if (q = dt4.exec(A), q === null) q = ct4.exec(A);
        if (q === null) throw Error("Date resolve error");
        if (K = +q[1], Y = +q[2] - 1, z = +q[3], !q[4]) return new Date(Date.UTC(K, Y, z));
        if (w = +q[4], H = +q[5], $ = +q[6], q[7]) {
            O = q[7].slice(0, 3);
            while (O.length < 3) O += "0";
            O = +O
        }
        if (q[9]) {
            if (J = +q[10], X = +(q[11] || 0), _ = (J * 60 + X) * 60000, q[9] === "-") _ = -_
        }
        if (D = new Date(Date.UTC(K, Y, z, w, H, $, O)), _) D.setTime(D.getTime() - _);
        return D
    }

    function LgY(A) {
        return A.toISOString()
    }
    lt4.exports = new vgY("tag:yaml.org,2002:timestamp", {
        kind: "scalar",
        resolve: EgY,
        construct: kgY,
        instanceOf: Date,
        represent: LgY
    })
})
// @from(Ln 376400, Col 4)
GSA = R((wyH, it4) => {
    var RgY = YG();

    function ygY(A) {
        return A === "<<" || A === null
    }
    it4.exports = new RgY("tag:yaml.org,2002:merge", {
        kind: "scalar",
        resolve: ygY
    })
})
// @from(Ln 376411, Col 4)
fSA = R((HyH, nt4) => {
    var CgY = YG(),
        ZSA = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;

    function SgY(A) {
        if (A === null) return !1;
        var q, K, Y = 0,
            z = A.length,
            w = ZSA;
        for (K = 0; K < z; K++) {
            if (q = w.indexOf(A.charAt(K)), q > 64) continue;
            if (q < 0) return !1;
            Y += 6
        }
        return Y % 8 === 0
    }

    function hgY(A) {
        var q, K, Y = A.replace(/[\r\n=]/g, ""),
            z = Y.length,
            w = ZSA,
            H = 0,
            $ = [];
        for (q = 0; q < z; q++) {
            if (q % 4 === 0 && q) $.push(H >> 16 & 255), $.push(H >> 8 & 255), $.push(H & 255);
            H = H << 6 | w.indexOf(Y.charAt(q))
        }
        if (K = z % 4 * 6, K === 0) $.push(H >> 16 & 255), $.push(H >> 8 & 255), $.push(H & 255);
        else if (K === 18) $.push(H >> 10 & 255), $.push(H >> 2 & 255);
        else if (K === 12) $.push(H >> 4 & 255);
        return new Uint8Array($)
    }

    function IgY(A) {
        var q = "",
            K = 0,
            Y, z, w = A.length,
            H = ZSA;
        for (Y = 0; Y < w; Y++) {
            if (Y % 3 === 0 && Y) q += H[K >> 18 & 63], q += H[K >> 12 & 63], q += H[K >> 6 & 63], q += H[K & 63];
            K = (K << 8) + A[Y]
        }
        if (z = w % 3, z === 0) q += H[K >> 18 & 63], q += H[K >> 12 & 63], q += H[K >> 6 & 63], q += H[K & 63];
        else if (z === 2) q += H[K >> 10 & 63], q += H[K >> 4 & 63], q += H[K << 2 & 63], q += H[64];
        else if (z === 1) q += H[K >> 2 & 63], q += H[K << 4 & 63], q += H[64], q += H[64];
        return q
    }

    function xgY(A) {
        return Object.prototype.toString.call(A) === "[object Uint8Array]"
    }
    nt4.exports = new CgY("tag:yaml.org,2002:binary", {
        kind: "scalar",
        resolve: SgY,
        construct: hgY,
        predicate: xgY,
        represent: IgY
    })
})
// @from(Ln 376471, Col 4)
VSA = R(($yH, rt4) => {
    var bgY = YG(),
        ugY = Object.prototype.hasOwnProperty,
        BgY = Object.prototype.toString;

    function mgY(A) {
        if (A === null) return !0;
        var q = [],
            K, Y, z, w, H, $ = A;
        for (K = 0, Y = $.length; K < Y; K += 1) {
            if (z = $[K], H = !1, BgY.call(z) !== "[object Object]") return !1;
            for (w in z)
                if (ugY.call(z, w))
                    if (!H) H = !0;
                    else return !1;
            if (!H) return !1;
            if (q.indexOf(w) === -1) q.push(w);
            else return !1
        }
        return !0
    }

    function FgY(A) {
        return A !== null ? A : []
    }
    rt4.exports = new bgY("tag:yaml.org,2002:omap", {
        kind: "sequence",
        resolve: mgY,
        construct: FgY
    })
})
// @from(Ln 376502, Col 4)
NSA = R((OyH, ot4) => {
    var QgY = YG(),
        ggY = Object.prototype.toString;

    function UgY(A) {
        if (A === null) return !0;
        var q, K, Y, z, w, H = A;
        w = Array(H.length);
        for (q = 0, K = H.length; q < K; q += 1) {
            if (Y = H[q], ggY.call(Y) !== "[object Object]") return !1;
            if (z = Object.keys(Y), z.length !== 1) return !1;
            w[q] = [z[0], Y[z[0]]]
        }
        return !0
    }

    function pgY(A) {
        if (A === null) return [];
        var q, K, Y, z, w, H = A;
        w = Array(H.length);
        for (q = 0, K = H.length; q < K; q += 1) Y = H[q], z = Object.keys(Y), w[q] = [z[0], Y[z[0]]];
        return w
    }
    ot4.exports = new QgY("tag:yaml.org,2002:pairs", {
        kind: "sequence",
        resolve: UgY,
        construct: pgY
    })
})
// @from(Ln 376531, Col 4)
TSA = R((_yH, at4) => {
    var dgY = YG(),
        cgY = Object.prototype.hasOwnProperty;

    function lgY(A) {
        if (A === null) return !0;
        var q, K = A;
        for (q in K)
            if (cgY.call(K, q)) {
                if (K[q] !== null) return !1
            } return !0
    }

    function igY(A) {
        return A !== null ? A : {}
    }
    at4.exports = new dgY("tag:yaml.org,2002:set", {
        kind: "mapping",
        resolve: lgY,
        construct: igY
    })
})
// @from(Ln 376553, Col 4)
IZ6 = R((JyH, st4) => {
    st4.exports = hZ6().extend({
        implicit: [WSA(), GSA()],
        explicit: [fSA(), VSA(), NSA(), TSA()]
    })
})