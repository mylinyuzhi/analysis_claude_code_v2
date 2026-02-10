
// @from(Ln 459339, Col 0)
function V_z() {
    return `IMPORTANT: This message and these instructions are NOT part of the actual user conversation. Do NOT include any references to "documentation updates", "magic docs", or these update instructions in the document content.

Based on the user conversation above (EXCLUDING this documentation update instruction message), update the Magic Doc file to incorporate any NEW learnings, insights, or information that would be valuable to preserve.

The file {{docPath}} has already been read for you. Here are its current contents:
<current_doc_content>
{{docContents}}
</current_doc_content>

Document title: {{docTitle}}
{{customInstructions}}

Your ONLY task is to use the Edit tool to update the documentation file if there is substantial new information to add, then stop. You can make multiple edits (update multiple sections as needed) - make all Edit tool calls in parallel in a single message. If there's nothing substantial to add, simply respond with a brief explanation and do not call any tools.

CRITICAL RULES FOR EDITING:
- Preserve the Magic Doc header exactly as-is: # MAGIC DOC: {{docTitle}}
- If there's an italicized line immediately after the header, preserve it exactly as-is
- Keep the document CURRENT with the latest state of the codebase - this is NOT a changelog or history
- Update information IN-PLACE to reflect the current state - do NOT append historical notes or track changes over time
- Remove or replace outdated information rather than adding "Previously..." or "Updated to..." notes
- Clean up or DELETE sections that are no longer relevant or don't align with the document's purpose
- Fix obvious errors: typos, grammar mistakes, broken formatting, incorrect information, or confusing statements
- Keep the document well organized: use clear headings, logical section order, consistent formatting, and proper nesting

DOCUMENTATION PHILOSOPHY - READ CAREFULLY:
- BE TERSE. High signal only. No filler words or unnecessary elaboration.
- Documentation is for OVERVIEWS, ARCHITECTURE, and ENTRY POINTS - not detailed code walkthroughs
- Do NOT duplicate information that's already obvious from reading the source code
- Do NOT document every function, parameter, or line number reference
- Focus on: WHY things exist, HOW components connect, WHERE to start reading, WHAT patterns are used
- Skip: detailed implementation steps, exhaustive API docs, play-by-play narratives

What TO document:
- High-level architecture and system design
- Non-obvious patterns, conventions, or gotchas
- Key entry points and where to start reading code
- Important design decisions and their rationale
- Critical dependencies or integration points
- References to related files, docs, or code (like a wiki) - help readers navigate to relevant context

What NOT to document:
- Anything obvious from reading the code itself
- Exhaustive lists of files, functions, or parameters
- Step-by-step implementation details
- Low-level code mechanics
- Information already in CLAUDE.md or other project docs

Use the Edit tool with file_path: {{docPath}}

REMEMBER: Only update if there is substantial new information. The Magic Doc header (# MAGIC DOC: {{docTitle}}) must remain unchanged.`
}
// @from(Ln 459391, Col 0)
async function N_z() {
    let A = b1(),
        q = f_z(O8(), "magic-docs", "prompt.md");
    if (A.existsSync(q)) try {
        return A.readFileSync(q, {
            encoding: "utf-8"
        })
    } catch {}
    return V_z()
}
// @from(Ln 459402, Col 0)
function T_z(A, q) {
    let K = A;
    for (let [Y, z] of Object.entries(q)) K = K.replace(new RegExp(`\\{\\{${Y}\\}\\}`, "g"), z);
    return K
}
// @from(Ln 459407, Col 0)
async function mjq(A, q, K, Y) {
    let z = await N_z(),
        w = Y ? `

DOCUMENT-SPECIFIC UPDATE INSTRUCTIONS:
The document author has provided specific instructions for how this file should be updated. Pay extra attention to these instructions and follow them carefully:

"${Y}"

These instructions take priority over the general rules below. Make sure your updates align with these specific guidelines.` : "";
    return T_z(z, {
        docContents: A,
        docPath: q,
        docTitle: K,
        customInstructions: w
    })
}
// @from(Ln 459424, Col 4)
Fjq = v(() => {
    _8();
    hA()
})
// @from(Ln 459429, Col 0)
function k_z(A) {
    let q = A.match(v_z);
    if (!q || !q[1]) return null;
    let K = q[1].trim(),
        Y = q.index + q[0].length,
        w = A.slice(Y).match(/^\s*\n(?:\s*\n)?(.+?)(?:\n|$)/);
    if (w && w[1]) {
        let $ = w[1].match(E_z);
        if ($ && $[1]) {
            let O = $[1].trim();
            return {
                title: K,
                instructions: O
            }
        }
    }
    return {
        title: K
    }
}
// @from(Ln 459450, Col 0)
function L_z() {
    return {
        agentType: "magic-docs",
        whenToUse: "Update Magic Docs",
        tools: [bq],
        model: "sonnet",
        source: "built-in",
        baseDir: "built-in",
        getSystemPrompt: () => ""
    }
}
// @from(Ln 459461, Col 0)
async function R_z(A, q) {
    let {
        messages: K,
        systemPrompt: Y,
        userContext: z,
        systemContext: w,
        toolUseContext: H
    } = q, $ = yp(H.readFileState), O = {
        ...H,
        readFileState: $
    };
    if (!b1().existsSync(A.path)) {
        Mv6.delete(A.path);
        return
    }
    let J = await i5.call({
            file_path: A.path
        }, O),
        X = "",
        D = J.data;
    if (D.type === "text") X = D.file.content;
    let j = k_z(X);
    if (!j) {
        Mv6.delete(A.path);
        return
    }
    let M = await mjq(X, A.path, j.title, j.instructions),
        P = async (W, G) => {
            if (W.name === bq && typeof G === "object" && G !== null && "file_path" in G) {
                let f = G.file_path;
                if (typeof f === "string" && f === A.path) return {
                    behavior: "allow",
                    updatedInput: G
                }
            }
            return {
                behavior: "deny",
                message: `only ${bq} is allowed for ${A.path}`,
                decisionReason: {
                    type: "other",
                    reason: `only ${bq} is allowed`
                }
            }
        };
    for await (let W of dR({
        agentDefinition: L_z(),
        promptMessages: [c6({
            content: M
        })],
        toolUseContext: O,
        canUseTool: P,
        isAsync: !0,
        forkContextMessages: K,
        querySource: "magic_docs",
        override: {
            systemPrompt: Y,
            userContext: z,
            systemContext: w
        },
        availableTools: O.options.tools
    }));
}
// @from(Ln 459523, Col 0)
async function Qjq() {}
// @from(Ln 459524, Col 4)
v_z
// @from(Ln 459524, Col 9)
E_z
// @from(Ln 459524, Col 14)
Mv6
// @from(Ln 459524, Col 19)
Bp$
// @from(Ln 459525, Col 4)
gjq = v(() => {
    _8();
    YE();
    Fjq();
    At();
    IU1();
    pM();
    N8();
    YE();
    v_z = /^#\s*MAGIC\s+DOC:\s*(.+)$/im, E_z = /^[_*](.+?)[_*]\s*$/m, Mv6 = new Map;
    Bp$ = rb(async function(A) {
        let {
            messages: q,
            querySource: K
        } = A;
        if (K !== "repl_main_thread") return;
        if (cd1(q)) return;
        if (Mv6.size === 0) return;
        for (let w of Array.from(Mv6.values())) await R_z(w, A)
    })
})
// @from(Ln 459547, Col 0)
function Ujq(A) {
    let q = [];
    for (let K of A)
        if (K.type === "user" && K.message?.content) {
            let Y = "";
            if (typeof K.message.content === "string") Y = K.message.content;
            else if (Array.isArray(K.message.content)) {
                for (let z of K.message.content)
                    if (z.type === "text") Y += z.text + " "
            }
            if (Y.trim()) q.push(Y.trim().slice(0, y_z))
        } return q
}
// @from(Ln 459561, Col 0)
function C_z(A) {
    return A.map((K) => `User: ${K}
Asst: [response hidden]`).join(`
`)
}
// @from(Ln 459567, Col 0)
function S_z(A) {
    let q = C4(A, "frustrated"),
        K = C4(A, "pr_request");
    return {
        isFrustrated: q === "true",
        hasPRRequest: K === "true"
    }
}
// @from(Ln 459575, Col 0)
async function pjq() {
    return
}
// @from(Ln 459578, Col 4)
y_z = 300
// @from(Ln 459579, Col 4)
h_z
// @from(Ln 459580, Col 4)
djq = v(() => {
    OhA();
    IU1();
    N8();
    e7();
    u6();
    N8();
    h_z = {
        name: "session_quality_classifier",
        async shouldRun(A) {
            if (A.querySource !== "repl_main_thread") return !1;
            return Ujq(A.messages).length > 0
        },
        buildMessages(A) {
            let q = Ujq(A.messages),
                K = C_z(q);
            return [c6({
                content: `Analyze the following conversation between a user and an assistant (assistant responses are hidden).

${K}

Think step-by-step about:
1. Does the user seem frustrated at the Asst based on their messages? Look for signs like repeated corrections, negative language, etc.
2. Has the user explicitly asked to SEND/CREATE/PUSH a pull request to GitHub? This means they want to actually submit a PR to a repository, not just work on code together or prepare changes. Look for explicit requests like: "create a pr", "send a pull request", "push a pr", "open a pr", "submit a pr to github", etc. Do NOT count mentions of working on a PR together, preparing for a PR, or discussing PR content.

Based on your analysis, output:
<frustrated>true/false</frustrated>
<pr_request>true/false</pr_request>`
            })]
        },
        systemPrompt: "You are analyzing user messages from a conversation to detect certain features of the interaction.",
        useTools: !1,
        parseResponse(A) {
            return S_z(A)
        },
        logResult(A, q) {
            if (A.type === "success") {
                let K = A.result;
                if (K.isFrustrated || K.hasPRRequest) c("tengu_session_quality_classification", {
                    uuid: A.uuid,
                    isFrustrated: K.isFrustrated ? 1 : 0,
                    hasPRRequest: K.hasPRRequest ? 1 : 0,
                    messageCount: q.queryMessageCount
                })
            }
        },
        getModel: _J
    }
})
// @from(Ln 459633, Col 0)
function _Y1() {
    let K = ((C8() || {}).cleanupPeriodDays ?? I_z) * 24 * 60 * 60 * 1000;
    return new Date(Date.now() - K)
}
// @from(Ln 459638, Col 0)
function x_z(A, q) {
    return {
        messages: A.messages + q.messages,
        errors: A.errors + q.errors
    }
}
// @from(Ln 459645, Col 0)
function b_z(A) {
    let q = A.split(".")[0].replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/, "T$1:$2:$3.$4Z");
    return new Date(q)
}
// @from(Ln 459649, Col 0)
async function cjq(A, q, K) {
    let Y = {
        messages: 0,
        errors: 0
    };
    try {
        let z = await b1().readdir(A);
        for (let w of z) try {
            if (b_z(w.name) < q)
                if (await b1().unlink(Df(A, w.name)), K) Y.messages++;
                else Y.errors++
        } catch (H) {
            K1(H)
        }
    } catch (z) {
        if (z instanceof Error && "code" in z && z.code !== "ENOENT") K1(z)
    }
    return Y
}
// @from(Ln 459668, Col 0)
async function u_z() {
    let A = b1(),
        q = _Y1(),
        K = Wi.errors(),
        Y = Wi.baseLogs(),
        z = await cjq(K, q, !1);
    try {
        let w;
        try {
            w = await A.readdir(Y)
        } catch {
            return z
        }
        let H = w.filter(($) => $.isDirectory() && $.name.startsWith("mcp-logs-")).map(($) => Df(Y, $.name));
        for (let $ of H) {
            z = x_z(z, await cjq($, q, !0));
            try {
                await A.rmdir($)
            } catch {}
        }
    } catch (w) {
        if (w instanceof Error && "code" in w && w.code !== "ENOENT") K1(w)
    }
    return z
}
// @from(Ln 459693, Col 0)
async function ljq(A, q, K, Y) {
    let z = {
            messages: 0,
            errors: 0
        },
        w;
    try {
        w = await Y.readdir(A)
    } catch ($) {
        if ($ instanceof Error && "code" in $ && $.code === "ENOENT") return z;
        throw $
    }
    let H = w.filter(($) => $.isFile() && $.name.endsWith(K));
    for (let $ of H) try {
        let O = Df(A, $.name);
        if ((await Y.stat(O)).mtime < q) await Y.unlink(O), z.messages++
    } catch {
        z.errors++
    }
    try {
        await Y.rmdir(A)
    } catch {}
    return z
}
// @from(Ln 459717, Col 0)
async function B_z() {
    let A = _Y1(),
        q = {
            messages: 0,
            errors: 0
        },
        K = oI(),
        Y = b1();
    try {
        let z;
        try {
            z = await Y.readdir(K)
        } catch {
            return q
        }
        let w = z.filter((H) => H.isDirectory()).map((H) => Df(K, H.name));
        for (let H of w) try {
            let $ = await ljq(H, A, ".jsonl", Y);
            q.messages += $.messages, q.errors += $.errors;
            let O;
            try {
                O = await Y.readdir(H)
            } catch {
                continue
            }
            try {
                for (let _ of O) {
                    if (!_.isDirectory()) continue;
                    let J = Df(H, _.name, fXA),
                        X;
                    try {
                        X = await Y.readdir(J)
                    } catch {
                        continue
                    }
                    try {
                        for (let D of X) {
                            if (!D.isDirectory()) continue;
                            let j = Df(J, D.name),
                                M = await ljq(j, A, "", Y);
                            q.messages += M.messages, q.errors += M.errors;
                            try {
                                await Y.rmdir(j)
                            } catch {}
                        }
                        try {
                            await Y.rmdir(J)
                        } catch {}
                        try {
                            let D = Df(H, _.name);
                            await Y.rmdir(D)
                        } catch {}
                    } catch {}
                }
            } catch {
                q.errors++
            }
            try {
                await Y.rmdir(H)
            } catch {}
        } catch {
            q.errors++;
            continue
        }
    } catch {
        q.errors++
    }
    return q
}
// @from(Ln 459786, Col 0)
async function m_z(A, q, K = !0) {
    let Y = _Y1(),
        z = {
            messages: 0,
            errors: 0
        },
        w = b1();
    try {
        let H;
        try {
            H = await w.readdir(A)
        } catch {
            return z
        }
        let $ = H.filter((O) => O.isFile() && O.name.endsWith(q));
        for (let O of $) try {
            let _ = Df(A, O.name);
            if ((await w.stat(_)).mtime < Y) await w.unlink(_), z.messages++
        } catch {
            z.errors++
        }
        if (K) try {
            await w.rmdir(A)
        } catch {}
    } catch {
        z.errors++
    }
    return z
}
// @from(Ln 459815, Col 0)
async function F_z() {
    let A = Df(O8(), "plans");
    return m_z(A, ".md")
}
// @from(Ln 459819, Col 0)
async function Q_z() {
    let A = _Y1(),
        q = {
            messages: 0,
            errors: 0
        },
        K = b1();
    try {
        let Y = O8(),
            z = Df(Y, "file-history"),
            w;
        try {
            w = await K.readdir(z)
        } catch {
            return q
        }
        let H = w.filter(($) => $.isDirectory()).map(($) => Df(z, $.name));
        for (let $ of H) try {
            if ((await K.stat($)).mtime < A) await K.rm($, {
                recursive: !0,
                force: !0
            }), q.messages++
        } catch {
            q.errors++
        }
        try {
            await K.rmdir(z)
        } catch {}
    } catch (Y) {
        K1(Y)
    }
    return q
}
// @from(Ln 459852, Col 0)
async function g_z() {
    let A = _Y1(),
        q = {
            messages: 0,
            errors: 0
        },
        K = b1();
    try {
        let Y = O8(),
            z = Df(Y, "session-env"),
            w;
        try {
            w = await K.readdir(z)
        } catch {
            return q
        }
        let H = w.filter(($) => $.isDirectory()).map(($) => Df(z, $.name));
        for (let $ of H) try {
            if ((await K.stat($)).mtime < A) await K.rm($, {
                recursive: !0,
                force: !0
            }), q.messages++
        } catch {
            q.errors++
        }
        try {
            await K.rmdir(z)
        } catch {}
    } catch (Y) {
        K1(Y)
    }
    return q
}
// @from(Ln 459885, Col 0)
async function U_z() {
    let A = _Y1(),
        q = {
            messages: 0,
            errors: 0
        },
        K = b1();
    try {
        let Y = Df(O8(), "debug"),
            z;
        try {
            z = await K.readdir(Y)
        } catch {
            return q
        }
        let w = z.filter((H) => H.isFile() && H.name.endsWith(".txt") && H.name !== "latest");
        for (let H of w) try {
            let $ = Df(Y, H.name);
            if ((await K.stat($)).mtime < A) await K.unlink($), q.messages++
        } catch {
            q.errors++
        }
    } catch (Y) {
        K1(Y)
    }
    return q
}
// @from(Ln 459913, Col 0)
function njq() {
    setImmediate(() => {
        let {
            errors: q
        } = Jc();
        if (q.length > 0 && Mi8("cleanupPeriodDays")) {
            h("Skipping cleanup: settings have validation errors but cleanupPeriodDays was explicitly set. Fix settings errors to enable cleanup.");
            return
        }
        u_z(), B_z(), F_z(), Q_z(), g_z(), U_z(), Lk7(), FE7(_Y1())
    }).unref()
}
// @from(Ln 459925, Col 4)
ijq
// @from(Ln 459925, Col 9)
I_z = 30
// @from(Ln 459926, Col 4)
p_z = 86400000
// @from(Ln 459927, Col 4)
wd$
// @from(Ln 459928, Col 4)
rjq = v(() => {
    Pp();
    y6();
    NT1();
    _8();
    p8();
    Dp1();
    lq();
    hA();
    Z6();
    u6();
    po();
    m$A();
    BI();
    ijq = o(NQ(), 1);
    wd$ = 7 * p_z
})
// @from(Ln 459946, Col 0)
function ojq(A) {
    if (Pv6 = A, Xc1 !== null && Xc1.length > 0) A(Xc1), Xc1 = null;
    return () => {
        Pv6 = null
    }
}
// @from(Ln 459952, Col 0)
async function d_z() {
    let A = await n5(),
        q = new Set;
    for (let [K, Y] of Object.entries(A))
        if (yv1(K, Y)) q.add(K.toLowerCase());
    return q
}
// @from(Ln 459959, Col 0)
async function c_z(A, q) {
    let K = !1;
    for (let {
            scope: Y
        }
        of q) try {
        let z = await EZ1(A, Y);
        if (z.success && !z.alreadyUpToDate) K = !0, h(`Plugin autoupdate: updated ${A} from ${z.oldVersion} to ${z.newVersion}`);
        else if (!z.alreadyUpToDate) h(`Plugin autoupdate: failed to update ${A}: ${z.message}`, {
            level: "warn"
        })
    } catch (z) {
        h(`Plugin autoupdate: error updating ${A}: ${z instanceof Error?z.message:String(z)}`, {
            level: "warn"
        })
    }
    return K ? A : null
}
// @from(Ln 459977, Col 0)
async function l_z(A) {
    let q = ja(),
        K = Object.keys(q.plugins),
        Y = y8();
    if (K.length === 0) return [];
    return (await Promise.allSettled(K.map(async (w) => {
        let {
            marketplace: H
        } = Da(w);
        if (!H || !A.has(H.toLowerCase())) return null;
        let $ = q.plugins[w];
        if (!$ || $.length === 0) return null;
        let O = $.filter((_) => _.scope === "user" || _.scope === "managed" || _.projectPath === Y);
        if (O.length === 0) return null;
        return c_z(w, O)
    }))).filter((w) => w.status === "fulfilled" && w.value !== null).map((w) => w.value)
}
// @from(Ln 459995, Col 0)
function ajq() {
    (async () => {
        if (Cp1()) {
            h("Plugin autoupdate: skipped (auto-updater disabled)");
            return
        }
        try {
            let A = await d_z();
            if (A.size === 0) return;
            let K = (await Promise.allSettled(Array.from(A).map(async (z) => {
                try {
                    await St(z, void 0, {
                        disableCredentialHelper: !0
                    })
                } catch (w) {
                    h(`Plugin autoupdate: failed to refresh marketplace ${z}: ${w instanceof Error?w.message:String(w)}`, {
                        level: "warn"
                    })
                }
            }))).filter((z) => z.status === "rejected");
            if (K.length > 0) h(`Plugin autoupdate: ${K.length} marketplace refresh(es) failed`, {
                level: "warn"
            });
            h("Plugin autoupdate: checking installed plugins");
            let Y = await l_z(A);
            if (Y.length > 0)
                if (Pv6) Pv6(Y);
                else Xc1 = Y
        } catch (A) {
            K1(A instanceof Error ? A : Error(String(A)))
        }
    })()
}
// @from(Ln 460028, Col 4)
Pv6 = null
// @from(Ln 460029, Col 4)
Xc1 = null
// @from(Ln 460030, Col 4)
CQA = v(() => {
    Z6();
    y6();
    cA();
    mM();
    p$();
    kZ1();
    Qq1();
    B6();
    N0()
})
// @from(Ln 460041, Col 4)
sjq = {}
// @from(Ln 460046, Col 0)
function SQA() {
    Qjq(), pjq(), o1q(), e1q(), njq(), p$q(), Op1(), ajq(), $K1([], U6())
}
// @from(Ln 460049, Col 4)
hQA = v(() => {
    gjq();
    djq();
    JhA();
    mU1();
    rjq();
    EBA();
    BI();
    CQA();
    B6();
    pB()
})
// @from(Ln 460061, Col 4)
i_z
// @from(Ln 460061, Col 9)
tjq
// @from(Ln 460061, Col 14)
Dc1
// @from(Ln 460062, Col 4)
ejq = v(() => {
    R_1();
    i_z = ZK.object({
        entries: ZK.record(ZK.string(), ZK.string())
    }), tjq = ZK.object({
        userId: ZK.string(),
        version: ZK.number(),
        lastModified: ZK.string(),
        checksum: ZK.string(),
        content: i_z
    }), Dc1 = {
        USER_SETTINGS: "~/.claude/settings.json",
        USER_MEMORY: "~/.claude/CLAUDE.md",
        projectSettings: (A) => `projects/${A}/.claude/settings.local.json`,
        projectMemory: (A) => `projects/${A}/CLAUDE.local.md`
    }
})
// @from(Ln 460087, Col 0)
async function qMq() {
    try {
        if (!s_z()) return H8("info", "settings_sync_download_skipped"), c("tengu_settings_sync_download_skipped", {}), !1;
        H8("info", "settings_sync_download_starting");
        let A = await qJz();
        if (!A.success) return H8("warn", "settings_sync_download_fetch_failed"), c("tengu_settings_sync_download_fetch_failed", {}), !1;
        if (A.isEmpty) return H8("info", "settings_sync_download_empty"), c("tengu_settings_sync_download_empty", {}), !1;
        let q = A.data.content.entries,
            K = await xs1();
        return H8("info", "settings_sync_download_applying", {
            entryCount: Object.keys(q).length
        }), KJz(q, K), c("tengu_settings_sync_download_success", {
            entryCount: Object.keys(q).length
        }), !0
    } catch {
        return H8("error", "settings_sync_download_error"), c("tengu_settings_sync_download_error", {}), !1
    }
}
// @from(Ln 460106, Col 0)
function s_z() {
    if (E4() !== "firstParty" || !OH1()) return !1;
    let A = a4();
    return Boolean(A?.accessToken && A.scopes?.includes(Fx))
}
// @from(Ln 460112, Col 0)
function t_z() {
    return `${P4().BASE_API_URL}/api/claude_code/user_settings`
}
// @from(Ln 460116, Col 0)
function e_z() {
    let A = a4();
    if (A?.accessToken) return {
        headers: {
            Authorization: `Bearer ${A.accessToken}`,
            "anthropic-beta": uf
        }
    };
    return {
        headers: {},
        error: "No OAuth token available"
    }
}
// @from(Ln 460129, Col 0)
async function AJz() {
    try {
        await XM();
        let A = e_z();
        if (A.error) return {
            success: !1,
            error: A.error,
            skipRetry: !0
        };
        let q = {
                ...A.headers,
                "User-Agent": XH()
            },
            K = t_z(),
            Y = await sA.get(K, {
                headers: q,
                timeout: a_z,
                validateStatus: (w) => w === 200 || w === 404
            });
        if (Y.status === 404) return H8("info", "settings_sync_fetch_empty"), {
            success: !0,
            isEmpty: !0
        };
        let z = tjq.safeParse(Y.data);
        if (!z.success) return H8("warn", "settings_sync_fetch_invalid_format"), {
            success: !1,
            error: "Invalid settings sync response format"
        };
        return H8("info", "settings_sync_fetch_success"), {
            success: !0,
            data: z.data,
            isEmpty: !1
        }
    } catch (A) {
        if (sA.isAxiosError(A)) {
            if (A.response?.status === 401 || A.response?.status === 403) return {
                success: !1,
                error: "Not authorized for settings sync",
                skipRetry: !0
            };
            if (A.code === "ECONNABORTED") return {
                success: !1,
                error: "Settings sync request timeout"
            };
            if (A.code === "ECONNREFUSED" || A.code === "ENOTFOUND") return {
                success: !1,
                error: "Cannot connect to server"
            }
        }
        return {
            success: !1,
            error: A instanceof Error ? A.message : "Unknown error"
        }
    }
}
// @from(Ln 460184, Col 0)
async function qJz() {
    let A = null;
    for (let q = 1; q <= IQA + 1; q++) {
        if (A = await AJz(), A.success) return A;
        if (A.skipRetry) return A;
        if (q > IQA) return A;
        let K = cU(q);
        H8("info", "settings_sync_retry", {
            attempt: q,
            maxRetries: IQA,
            delayMs: K
        }), await dS(K)
    }
    return A
}
// @from(Ln 460200, Col 0)
function Wv6(A, q) {
    try {
        let K = o_z(A);
        if (K) n_z(K, {
            recursive: !0
        });
        return r_z(A, q, "utf8"), H8("info", "settings_sync_file_written"), !0
    } catch {
        return H8("warn", "settings_sync_file_write_failed"), !1
    }
}
// @from(Ln 460212, Col 0)
function KJz(A, q) {
    let K = 0,
        Y = !1,
        z = !1,
        w = (O, _) => {
            let J = Buffer.byteLength(O, "utf8");
            if (J > AMq) return H8("info", "settings_sync_file_too_large", {
                sizeBytes: J,
                maxBytes: AMq
            }), !0;
            return !1
        },
        H = A[Dc1.USER_SETTINGS];
    if (H) {
        let O = Vw("userSettings");
        if (O && !w(H, O)) {
            if (zX.markInternalWrite("userSettings"), Wv6(O, H)) K++, Y = !0
        }
    }
    let $ = A[Dc1.USER_MEMORY];
    if ($) {
        let O = cB("User");
        if (!w($, O)) {
            if (Wv6(O, $)) K++, z = !0
        }
    }
    if (q) {
        let O = Dc1.projectSettings(q),
            _ = A[O];
        if (_) {
            let D = Vw("localSettings");
            if (D && !w(_, D)) {
                if (zX.markInternalWrite("localSettings"), Wv6(D, _)) K++, Y = !0
            }
        }
        let J = Dc1.projectMemory(q),
            X = A[J];
        if (X) {
            let D = cB("Local");
            if (!w(X, D)) {
                if (Wv6(D, X)) K++, z = !0
            }
        }
    }
    if (Y) GO();
    if (z) I_.cache.clear?.();
    H8("info", "settings_sync_applied", {
        appliedCount: K
    })
}
// @from(Ln 460262, Col 4)
a_z = 1e4
// @from(Ln 460263, Col 4)
IQA = 3
// @from(Ln 460264, Col 4)
AMq = 512000
// @from(Ln 460265, Col 4)
KMq = v(() => {
    y5();
    U4();
    B0();
    f0();
    u6();
    Uz();
    J7();
    UH();
    h9();
    p8();
    IQ();
    cA();
    dD();
    wq();
    ejq();
    Yq1();
    QU();
    B6()
})
// @from(Ln 460286, Col 0)
function jc1(A, q, K, Y) {
    let z = {
        type: "permissionPromptTool",
        permissionPromptToolName: q.name,
        toolResult: A
    };
    if (A.behavior === "allow") {
        let w = A.updatedPermissions;
        if (w) Y.setAppState((H) => ({
            ...H,
            toolPermissionContext: WV(H.toolPermissionContext, w)
        })), nC(w);
        return {
            ...A,
            decisionReason: z
        }
    } else if (A.behavior === "deny" && A.interrupt) h(`SDK permission prompt deny+interrupt: tool=${q.name} message=${A.message}`), Y.abortController.abort();
    return {
        ...A,
        decisionReason: z
    }
}
// @from(Ln 460308, Col 4)
Oc$
// @from(Ln 460308, Col 9)
YJz
// @from(Ln 460308, Col 14)
zJz
// @from(Ln 460308, Col 19)
Gv6
// @from(Ln 460309, Col 4)
xQA = v(() => {
    i7();
    QMA();
    CO();
    Z6();
    Oc$ = y4.object({
        tool_name: y4.string().describe("The name of the tool requesting permission"),
        input: y4.record(y4.string(), y4.unknown()).describe("The input for the tool"),
        tool_use_id: y4.string().optional().describe("The unique tool use request ID")
    }), YJz = y4.object({
        behavior: y4.literal("allow"),
        updatedInput: y4.record(y4.string(), y4.unknown()),
        updatedPermissions: y4.array(YJ6).optional(),
        toolUseID: y4.string().optional()
    }), zJz = y4.object({
        behavior: y4.literal("deny"),
        message: y4.string(),
        interrupt: y4.boolean().optional(),
        toolUseID: y4.string().optional()
    }), Gv6 = y4.union([YJz, zJz])
})
// @from(Ln 460334, Col 0)
function HJz(A) {
    if (!A) return;
    switch (A.type) {
        case "rule":
        case "mode":
        case "subcommandResults":
        case "permissionPromptTool":
            return;
        case "hook":
        case "asyncAgent":
        case "sandboxOverride":
        case "classifier":
        case "workingDir":
        case "other":
            return A.reason
    }
}
// @from(Ln 460351, Col 0)
class Mc1 {
    input;
    replayUserMessages;
    structuredInput;
    pendingRequests = new Map;
    inputClosed = !1;
    unexpectedResponseCallback;
    constructor(A, q) {
        this.input = A;
        this.replayUserMessages = q;
        this.input = A, this.structuredInput = this.read()
    }
    async * read() {
        let A = "";
        for await (let q of this.input) {
            A += q;
            let K;
            while ((K = A.indexOf(`
`)) !== -1) {
                let Y = A.slice(0, K);
                A = A.slice(K + 1);
                let z = await this.processLine(Y);
                if (z) yield z
            }
        }
        if (A) {
            let q = await this.processLine(A);
            if (q) yield q
        }
        this.inputClosed = !0;
        for (let q of this.pendingRequests.values()) q.reject(Error("Tool permission stream closed before response received"))
    }
    getPendingPermissionRequests() {
        return Array.from(this.pendingRequests.values()).map((A) => A.request).filter((A) => A.request.subtype === "can_use_tool")
    }
    setUnexpectedResponseCallback(A) {
        this.unexpectedResponseCallback = A
    }
    async processLine(A) {
        try {
            let q = _A(A);
            if (q.type === "keep_alive") return;
            if (q.type === "update_environment_variables") {
                for (let [K, Y] of Object.entries(q.variables)) process.env[K] = Y;
                return
            }
            if (q.type === "control_response") {
                let K = this.pendingRequests.get(q.response.request_id);
                if (!K) {
                    if (this.unexpectedResponseCallback) await this.unexpectedResponseCallback(q);
                    return
                }
                if (this.pendingRequests.delete(q.response.request_id), q.response.subtype === "error") {
                    K.reject(Error(q.response.error));
                    return
                }
                let Y = q.response.response;
                if (K.schema) try {
                    K.resolve(K.schema.parse(Y))
                } catch (z) {
                    K.reject(z)
                } else K.resolve({});
                if (this.replayUserMessages) return q;
                return
            }
            if (q.type !== "user" && q.type !== "control_request") bQA(`Error: Expected message type 'user' or 'control', got '${q.type}'`);
            if (q.type === "control_request") {
                if (!q.request) bQA("Error: Missing request on control_request");
                return q
            }
            if (q.message.role !== "user") bQA(`Error: Expected message role 'user', got '${q.message.role}'`);
            return q
        } catch (q) {
            console.error(`Error parsing streaming input line: ${A}: ${q}`), process.exit(1)
        }
    }
    async write(A) {
        Q4(Q1(A) + `
`)
    }
    async sendRequest(A, q, K) {
        let Y = wJz(),
            z = {
                type: "control_request",
                request_id: Y,
                request: A
            };
        if (this.inputClosed) throw Error("Stream closed");
        if (K?.aborted) throw Error("Request aborted");
        await this.write(z);
        let w = () => {
            this.write({
                type: "control_cancel_request",
                request_id: Y
            });
            let H = this.pendingRequests.get(Y);
            if (H) H.reject(new dz)
        };
        if (K) K.addEventListener("abort", w, {
            once: !0
        });
        try {
            return await new Promise((H, $) => {
                this.pendingRequests.set(Y, {
                    request: {
                        type: "control_request",
                        request_id: Y,
                        request: A
                    },
                    resolve: (O) => {
                        H(O)
                    },
                    reject: $,
                    schema: q
                })
            })
        } finally {
            if (K) K.removeEventListener("abort", w);
            this.pendingRequests.delete(Y)
        }
    }
    createCanUseTool(A) {
        return async (q, K, Y, z, w) => {
            let H = await uX(q, K, Y, z, w);
            if (H.behavior === "allow" || H.behavior === "deny") return H;
            let $ = await $Jz(q.name, w, K, Y, H.suggestions);
            if ($) return $;
            try {
                A?.();
                let O = await this.sendRequest({
                    subtype: "can_use_tool",
                    tool_name: q.name,
                    input: K,
                    permission_suggestions: H.suggestions,
                    blocked_path: H.blockedPath,
                    decision_reason: HJz(H.decisionReason),
                    tool_use_id: w,
                    agent_id: Y.agentId
                }, Gv6, Y.abortController.signal);
                return jc1(O, q, K, Y)
            } catch (O) {
                return jc1({
                    behavior: "deny",
                    message: `Tool permission request failed: ${O}`,
                    toolUseID: w
                }, q, K, Y)
            }
        }
    }
    createHookCallback(A, q) {
        return {
            type: "callback",
            timeout: q,
            callback: async (K, Y, z) => {
                try {
                    return await this.sendRequest({
                        subtype: "hook_callback",
                        callback_id: A,
                        input: K,
                        tool_use_id: Y || void 0
                    }, zJ6, z)
                } catch (w) {
                    return console.error(`Error in hook callback ${A}:`, w), {}
                }
            }
        }
    }
    async sendMcpMessage(A, q) {
        return (await this.sendRequest({
            subtype: "mcp_message",
            server_name: A,
            message: q
        }, u.object({
            mcp_response: u.any()
        }))).mcp_response
    }
}
// @from(Ln 460529, Col 0)
function bQA(A) {
    console.error(A), process.exit(1)
}
// @from(Ln 460532, Col 0)
async function $Jz(A, q, K, Y, z) {
    let H = (await Y.getAppState()).toolPermissionContext.mode,
        $ = I51(A, q, K, Y, H, z, Y.abortController.signal);
    for await (let O of $) if (O.permissionRequestResult && (O.permissionRequestResult.behavior === "allow" || O.permissionRequestResult.behavior === "deny")) {
        let _ = O.permissionRequestResult;
        if (_.behavior === "allow") {
            let J = _.updatedInput || K,
                X = _.updatedPermissions ?? [];
            if (X.length > 0) {
                nC(X);
                let D = await Y.getAppState(),
                    j = WV(D.toolPermissionContext, X);
                Y.setAppState((M) => {
                    if (M.toolPermissionContext === j) return M;
                    return {
                        ...M,
                        toolPermissionContext: j
                    }
                })
            }
            return {
                behavior: "allow",
                updatedInput: J,
                userModified: !1,
                decisionReason: {
                    type: "hook",
                    hookName: "PermissionRequest"
                }
            }
        } else return {
            behavior: "deny",
            message: _.message || "Permission denied by PermissionRequest hook",
            decisionReason: {
                type: "hook",
                hookName: "PermissionRequest"
            }
        }
    }
    return
}
// @from(Ln 460572, Col 4)
uQA = v(() => {
    PJ();
    i7();
    xQA();
    gMA();
    qH();
    m6();
    aM();
    CO()
})
// @from(Ln 460582, Col 0)
class Pc1 {
    ws = null;
    lastSentId = null;
    url;
    state = "idle";
    onData;
    onCloseCallback;
    headers;
    sessionId;
    reconnectAttempts = 0;
    reconnectStartTime = null;
    reconnectTimer = null;
    pingInterval = null;
    pongReceived = !0;
    messageBuffer;
    constructor(A, q = {}, K) {
        this.url = A, this.headers = q, this.sessionId = K, this.messageBuffer = new $B1(OJz)
    }
    async connect() {
        if (this.state !== "idle" && this.state !== "reconnecting") {
            h(`WebSocketTransport: Cannot connect, current state is ${this.state}`, {
                level: "error"
            }), H8("error", "cli_websocket_connect_failed");
            return
        }
        this.state = "reconnecting";
        let A = Date.now();
        h(`WebSocketTransport: Opening ${this.url.href}`), H8("info", "cli_websocket_connect_opening");
        let q = {
            ...this.headers
        };
        if (this.lastSentId) q["X-Last-Request-Id"] = this.lastSentId, h(`WebSocketTransport: Adding X-Last-Request-Id header: ${this.lastSentId}`);
        if (typeof Bun < "u") {
            let K = new globalThis.WebSocket(this.url.href, {
                headers: q,
                proxy: H81(this.url.href)
            });
            this.ws = K, K.addEventListener("open", () => {
                if (this.handleOpenEvent(A), this.lastSentId) this.replayBufferedMessages("")
            }), K.addEventListener("message", (Y) => {
                let z = typeof Y.data === "string" ? Y.data : String(Y.data);
                if (this.onData) this.onData(z)
            }), K.addEventListener("error", () => {
                h("WebSocketTransport: Error", {
                    level: "error"
                }), H8("error", "cli_websocket_connect_error"), this.handleConnectionError()
            }), K.addEventListener("close", (Y) => {
                h(`WebSocketTransport: Closed: ${Y.code}`, {
                    level: "error"
                }), H8("error", "cli_websocket_connect_closed"), this.handleConnectionError()
            })
        } else {
            let {
                default: K
            } = await Promise.resolve().then(() => (zU1(), nG6)), Y = new K(this.url.href, {
                headers: q,
                agent: w81(this.url.href)
            });
            this.ws = Y, Y.on("open", () => {
                this.handleOpenEvent(A);
                let z = Y.upgradeReq;
                if (z?.headers?.["x-last-request-id"]) {
                    let w = z.headers["x-last-request-id"];
                    this.replayBufferedMessages(w)
                }
            }), Y.on("message", (z) => {
                let w = z.toString();
                if (this.onData) this.onData(w)
            }), Y.on("error", (z) => {
                h(`WebSocketTransport: Error: ${z.message}`, {
                    level: "error"
                }), H8("error", "cli_websocket_connect_error"), this.handleConnectionError()
            }), Y.on("close", (z, w) => {
                h(`WebSocketTransport: Closed: ${z}`, {
                    level: "error"
                }), H8("error", "cli_websocket_connect_closed"), this.handleConnectionError()
            }), Y.on("pong", () => {
                this.pongReceived = !0
            })
        }
    }
    handleOpenEvent(A) {
        let q = Date.now() - A;
        h("WebSocketTransport: Connected"), H8("info", "cli_websocket_connect_connected", {
            duration_ms: q
        }), this.reconnectAttempts = 0, this.reconnectStartTime = null, this.state = "connected", this.startPingInterval(), gx7(() => {
            if (this.state === "connected" && this.ws) try {
                this.ws.send(Q1({
                    type: "keep_alive"
                }) + `
`), h("WebSocketTransport: Sent keep_alive (activity signal)")
            } catch (K) {
                h(`WebSocketTransport: Keep-alive failed: ${K}`, {
                    level: "error"
                }), H8("error", "cli_websocket_keepalive_failed")
            }
        })
    }
    sendLine(A) {
        if (!this.ws || this.state !== "connected") return h("WebSocketTransport: Not connected"), H8("info", "cli_websocket_send_not_connected"), !1;
        try {
            return this.ws.send(A), !0
        } catch (q) {
            return h(`WebSocketTransport: Failed to send: ${q}`, {
                level: "error"
            }), H8("error", "cli_websocket_send_error"), this.ws = null, this.handleConnectionError(), !1
        }
    }
    doDisconnect() {
        if (this.stopPingInterval(), jXA(), this.ws) this.ws.close(), this.ws = null
    }
    handleConnectionError() {
        if (h(`WebSocketTransport: Disconnected from ${this.url.href}`), H8("info", "cli_websocket_disconnected"), this.doDisconnect(), this.state === "closing" || this.state === "closed") return;
        let A = Date.now();
        if (!this.reconnectStartTime) this.reconnectStartTime = A;
        let q = A - this.reconnectStartTime;
        if (q < XJz) {
            if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
            this.state = "reconnecting", this.reconnectAttempts++;
            let K = Math.min(_Jz * Math.pow(2, this.reconnectAttempts - 1), JJz),
                Y = Math.max(0, K + K * 0.25 * (2 * Math.random() - 1));
            h(`WebSocketTransport: Reconnecting in ${Math.round(Y)}ms (attempt ${this.reconnectAttempts}, ${Math.round(q/1000)}s elapsed)`), H8("error", "cli_websocket_reconnect_attempt", {
                reconnectAttempts: this.reconnectAttempts
            }), this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null, this.connect()
            }, Y)
        } else if (h(`WebSocketTransport: Reconnection time budget exhausted after ${Math.round(q/1000)}s for ${this.url.href}`, {
                level: "error"
            }), H8("error", "cli_websocket_reconnect_exhausted", {
                reconnectAttempts: this.reconnectAttempts,
                elapsedMs: q
            }), this.state = "closed", this.onCloseCallback) this.onCloseCallback()
    }
    close() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
        this.stopPingInterval(), jXA(), this.state = "closing", this.doDisconnect()
    }
    replayBufferedMessages(A) {
        let q = this.messageBuffer.toArray();
        if (q.length === 0) return;
        let K = 0;
        if (A) {
            let z = q.findIndex((w) => ("uuid" in w) && w.uuid === A);
            if (z >= 0) K = z + 1
        }
        let Y = q.slice(K);
        if (Y.length === 0) {
            h("WebSocketTransport: No new messages to replay"), H8("info", "cli_websocket_no_messages_to_replay");
            return
        }
        h(`WebSocketTransport: Replaying ${Y.length} buffered messages`), H8("info", "cli_websocket_messages_to_replay", {
            count: Y.length
        });
        for (let z of Y) {
            let w = Q1(z) + `
`;
            if (!this.sendLine(w)) {
                this.handleConnectionError();
                break
            }
        }
    }
    isConnectedStatus() {
        return this.state === "connected"
    }
    setOnData(A) {
        this.onData = A
    }
    setOnClose(A) {
        this.onCloseCallback = A
    }
    async write(A) {
        if ("uuid" in A && typeof A.uuid === "string") this.messageBuffer.add(A), this.lastSentId = A.uuid;
        let q = Q1(A) + `
`;
        if (this.state !== "connected") return;
        let K = this.sessionId ? ` session=${this.sessionId}` : "",
            Y = this.getControlMessageDetailLabel(A);
        h(`WebSocketTransport: Sending message type=${A.type}${K}${Y}`), this.sendLine(q)
    }
    getControlMessageDetailLabel(A) {
        if (A.type === "control_request") {
            let {
                request_id: q,
                request: K
            } = A, Y = K.subtype === "can_use_tool" ? K.tool_name : "";
            return ` subtype=${K.subtype} request_id=${q}${Y?` tool=${Y}`:""}`
        }
        if (A.type === "control_response") {
            let {
                subtype: q,
                request_id: K
            } = A.response;
            return ` subtype=${q} request_id=${K}`
        }
        return ""
    }
    startPingInterval() {
        if (this.stopPingInterval(), typeof Bun < "u") return;
        this.pongReceived = !0, this.pingInterval = setInterval(() => {
            if (this.state === "connected" && this.ws) {
                if (!this.pongReceived) {
                    h("WebSocketTransport: No pong received, connection appears dead", {
                        level: "error"
                    }), H8("error", "cli_websocket_pong_timeout"), this.handleConnectionError();
                    return
                }
                this.pongReceived = !1;
                try {
                    this.ws.ping()
                } catch (A) {
                    h(`WebSocketTransport: Ping failed: ${A}`, {
                        level: "error"
                    }), H8("error", "cli_websocket_ping_failed")
                }
            }
        }, DJz)
    }
    stopPingInterval() {
        if (this.pingInterval) clearInterval(this.pingInterval), this.pingInterval = null
    }
}
// @from(Ln 460804, Col 4)
OJz = 1000
// @from(Ln 460805, Col 4)
_Jz = 1000
// @from(Ln 460806, Col 4)
JJz = 30000
// @from(Ln 460807, Col 4)
XJz = 600000
// @from(Ln 460808, Col 4)
DJz = 1e4
// @from(Ln 460809, Col 4)
BQA = v(() => {
    Z6();
    bb();
    f0();
    m6()
})
// @from(Ln 460816, Col 0)
function PJz(A) {
    let q = A.protocol === "wss:" ? "https:" : "http:",
        K = A.pathname;
    if (K = K.replace("/ws/", "/session/"), !K.endsWith("/events")) K = K.endsWith("/") ? K + "events" : K + "/events";
    return `${q}//${A.host}${K}${A.search}`
}
// @from(Ln 460822, Col 4)
Wc1 = 10
// @from(Ln 460823, Col 4)
jJz = 500
// @from(Ln 460824, Col 4)
MJz = 8000
// @from(Ln 460825, Col 4)
mQA
// @from(Ln 460826, Col 4)
YMq = v(() => {
    y5();
    BQA();
    Z6();
    f0();
    Oa();
    mQA = class mQA extends Pc1 {
        postUrl;
        constructor(A, q = {}, K) {
            super(A, q, K);
            this.postUrl = PJz(A), h(`HybridTransport: POST URL = ${this.postUrl}`), H8("info", "cli_hybrid_transport_initialized")
        }
        async write(A) {
            let q = nV();
            if (!q) {
                h("HybridTransport: No session token available for POST"), H8("warn", "cli_hybrid_post_no_token");
                return
            }
            let K = {
                Authorization: `Bearer ${q}`,
                "Content-Type": "application/json"
            };
            for (let Y = 1; Y <= Wc1; Y++) {
                try {
                    let w = await sA.post(this.postUrl, {
                        events: [A]
                    }, {
                        headers: K,
                        validateStatus: () => !0
                    });
                    if (w.status === 200 || w.status === 201) {
                        h(`HybridTransport: POST success type=${A.type}`);
                        return
                    }
                    if (w.status >= 400 && w.status < 500 && w.status !== 429) {
                        h(`HybridTransport: POST returned ${w.status} (client error), not retrying`), H8("warn", "cli_hybrid_post_client_error", {
                            status: w.status
                        });
                        return
                    }
                    h(`HybridTransport: POST returned ${w.status}, attempt ${Y}/${Wc1}`), H8("warn", "cli_hybrid_post_retryable_error", {
                        status: w.status,
                        attempt: Y
                    })
                } catch (w) {
                    h(`HybridTransport: POST error: ${w.message}, attempt ${Y}/${Wc1}`), H8("warn", "cli_hybrid_post_network_error", {
                        attempt: Y
                    })
                }
                if (Y === Wc1) {
                    h(`HybridTransport: POST failed after ${Wc1} attempts, continuing`), H8("warn", "cli_hybrid_post_retries_exhausted");
                    return
                }
                let z = Math.min(jJz * Math.pow(2, Y - 1), MJz);
                await new Promise((w) => setTimeout(w, z))
            }
        }
    }
})
// @from(Ln 460886, Col 0)
function zMq(A, q = {}, K) {
    if (A.protocol === "ws:" || A.protocol === "wss:") {
        if (J6(process.env.CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2)) return new mQA(A, q, K);
        return new Pc1(A, q, K)
    } else throw Error(`Unsupported protocol: ${A.protocol}`)
}
// @from(Ln 460892, Col 4)
wMq = v(() => {
    BQA();
    YMq();
    hA()
})
// @from(Ln 460903, Col 4)
FQA
// @from(Ln 460904, Col 4)
HMq = v(() => {
    uQA();
    wMq();
    Tz();
    Oa();
    B6();
    FQA = class FQA extends Mc1 {
        url;
        transport;
        inputStream;
        constructor(A, q, K) {
            let Y = new GJz({
                encoding: "utf8"
            });
            super(Y, K);
            this.inputStream = Y, this.url = new WJz(A);
            let z = {},
                w = nV();
            if (w) z.Authorization = `Bearer ${w}`;
            let H = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
            if (H) z["x-environment-runner-version"] = H;
            if (this.transport = zMq(this.url, z, U6()), this.transport.setOnData(($) => {
                    this.inputStream.write($)
                }), this.transport.setOnClose(() => {
                    this.inputStream.end()
                }), this.transport.connect(), Tq(async () => this.close()), q) {
                let $ = this.inputStream;
                (async () => {
                    for await (let O of q) $.write(O + `
`)
                })()
            }
        }
        async write(A) {
            await this.transport.write(A)
        }
        close() {
            this.transport.close(), this.inputStream.end()
        }
    }
})
// @from(Ln 460945, Col 4)
$Mq = v(() => {
    DW();
    t81();
    _H();
    SD()
})
// @from(Ln 460952, Col 0)
function Gc1(A) {
    let q = e(13),
        {
            issue: K,
            branchName: Y,
            onDone: z,
            color: w,
            loadingState: H
        } = A,
        $ = w === void 0 ? "permission" : w,
        {
            hasUncommitted: O,
            hasUnpushed: _
        } = K,
        J;
    if (O && _) J = `Uncommitted changes and unpushed commits detected on ${Y}`;
    else if (O) J = "Uncommitted changes detected";
    else J = `Unpushed commits detected on ${Y}`;
    let X;
    if (q[0] !== z) X = function(Z) {
        z(Z)
    }, q[0] = z, q[1] = X;
    else X = q[1];
    let D = X,
        j = O ? "Commit and push my changes" : "Push my changes",
        M = H === "committing" ? "Committing…" : H === "pushing" ? "Pushing…" : null,
        P;
    if (q[2] !== D) P = () => D("cancel"), q[2] = D, q[3] = P;
    else P = q[3];
    let W;
    if (q[4] !== j || q[5] !== D || q[6] !== M) W = M ? Ax.createElement(I, {
        flexDirection: "row"
    }, Ax.createElement(c4, null), Ax.createElement(V, null, M)) : Ax.createElement(kA, {
        options: [{
            label: j,
            value: "commit-push"
        }, {
            label: "Run remote task without my local changes",
            value: "continue"
        }, {
            label: "Cancel",
            value: "cancel"
        }],
        onChange: D,
        onCancel: () => D("cancel"),
        layout: "compact-vertical"
    }), q[4] = j, q[5] = D, q[6] = M, q[7] = W;
    else W = q[7];
    let G;
    if (q[8] !== $ || q[9] !== J || q[10] !== P || q[11] !== W) G = Ax.createElement(w8, {
        title: "Include local changes in the remote task?",
        subtitle: J,
        color: $,
        onCancel: P,
        hideInputGuide: !0
    }, W), q[8] = $, q[9] = J, q[10] = P, q[11] = W, q[12] = G;
    else G = q[12];
    return G
}
// @from(Ln 461011, Col 4)
Ax
// @from(Ln 461012, Col 4)
QQA = v(() => {
    i1();
    m1();
    U5();
    x2();
    Bq();
    Ax = o(X1(), 1)
})
// @from(Ln 461020, Col 0)
async function OMq(A, q, K, Y, z, w) {
    c("tengu_input_background", {}), w(!0);
    let H = {
            text: `<background-task-input>${A}</background-task-input>`,
            type: "text"
        },
        $ = c6({
            content: pZ({
                inputString: H.text,
                precedingInputBlocks: q
            })
        });
    z({
        jsx: F2.createElement(I, {
            flexDirection: "column"
        }, F2.createElement(K51, {
            addMargin: !0,
            param: H
        }), F2.createElement(HA, null, F2.createElement(V, {
            dimColor: !0
        }, "Initializing session…"))),
        shouldHidePromptInput: !1
    });
    try {
        let O = await rW6();
        if (!O.eligible) {
            let T = O.errors.map(oW6).join(`

`);
            return {
                messages: [wP(), $, ...K, c6({
                    content: `<bash-stderr>Cannot launch remote Claude Code session.

${T}</bash-stderr>`
                })],
                shouldQuery: !1
            }
        }
        let _ = await bs1(),
            J = await sj(),
            X = await tj(),
            D = _.commitsAheadOfDefaultBranch === 0;
        if ((_.hasUncommitted || _.hasUnpushed) && !D) {
            let T = await new Promise((k) => {
                z({
                    jsx: F2.createElement(I, {
                        flexDirection: "column"
                    }, F2.createElement(K51, {
                        addMargin: !0,
                        param: H
                    }), F2.createElement(Gc1, {
                        issue: _,
                        branchName: J,
                        onDone: k,
                        color: "background"
                    })),
                    shouldHidePromptInput: !0
                })
            });
            if (T === "cancel") return {
                messages: [wP(), $, ...K, c6({
                    content: "<bash-stderr>Background task cancelled.</bash-stderr>"
                })],
                shouldQuery: !1
            };
            if (T === "commit-push") {
                let k = (S) => {
                    z({
                        jsx: F2.createElement(I, {
                            flexDirection: "column"
                        }, F2.createElement(K51, {
                            addMargin: !0,
                            param: H
                        }), F2.createElement(Gc1, {
                            issue: _,
                            branchName: J,
                            onDone: () => {},
                            color: "background",
                            loadingState: S
                        })),
                        shouldHidePromptInput: !0
                    })
                };
                if (_.hasUncommitted) k("committing");
                else k("pushing");
                let y = `Background task: ${A.slice(0,60)}${A.length>60?"...":""}`,
                    B = await us1(y, (S) => {
                        k(S)
                    });
                if (!B.success) return {
                    messages: [wP(), $, ...K, c6({
                        content: `<bash-stderr>Failed to commit and push changes:
${B.error}</bash-stderr>`
                    })],
                    shouldQuery: !1
                }
            }
        }
        let j = dO(),
            M = [];
        try {
            M = await ZQ(j)
        } catch (T) {
            h(`Could not read transcript file: ${T instanceof Error?T.message:String(T)}`)
        }
        let P = M.filter(vI);
        z({
            jsx: F2.createElement(I, {
                flexDirection: "column"
            }, F2.createElement(K51, {
                addMargin: !0,
                param: H
            }), F2.createElement(HA, null, F2.createElement(V, {
                dimColor: !0
            }, "Creating background task…"))),
            shouldHidePromptInput: !1
        });
        let W = _.commitsAheadOfDefaultBranch === 0 ? X : J,
            G = await b51({
                initialMessage: null,
                branchName: W,
                description: A,
                signal: Y.abortController.signal
            });
        if (!G) throw Error("Failed to create remote session");
        if (P.length > 0)
            for (let T = 0; T < P.length; T++) {
                let k = P[T];
                if (!k) continue;
                if (!await Ci4(G.id, k)) throw Error(`Failed to upload session history (message ${T+1}/${P.length})`)
            }
        if (!await JM6(G.id, A)) throw Error("Failed to send user task message to remote session");
        vg1({
            session: G,
            command: A,
            context: Y
        });
        let Z = u51(G.id),
            N = gi4(G.id);
        return {
            messages: [wP(), $, ...K, c6({
                content: `<background-task-output>This task is now running in the background.
Monitor it with /tasks or at ${Z}

Or, resume it later with: ${N}</background-task-output>`
            })],
            shouldQuery: !1
        }
    } catch (O) {
        let _ = O instanceof Error ? O.message : String(O);
        return {
            messages: [wP(), $, ...K, c6({
                content: `<bash-stderr>Failed to create background session: ${_}. Try running /login and signing in with a claude.ai account (not Console).</bash-stderr>`
            })],
            shouldQuery: !1
        }
    } finally {
        z(null)
    }
}
// @from(Ln 461180, Col 4)
F2
// @from(Ln 461181, Col 4)
_Mq = v(() => {
    u6();
    N8();
    m1();
    RvA();
    eq();
    Im();
    UR();
    pW1();
    cW6();
    Z6();
    lq();
    AH();
    yw();
    YE();
    e7();
    hf();
    h9();
    QQA();
    F2 = o(X1(), 1)
})
// @from(Ln 461203, Col 0)
function gQA(A) {
    let q = e(8),
        {
            input: K,
            progress: Y,
            verbose: z
        } = A,
        w = `<bash-input>${K}</bash-input>`,
        H;
    if (q[0] !== w) H = Zv6.default.createElement(jM6, {
        addMargin: !1,
        param: {
            text: w,
            type: "text"
        }
    }), q[0] = w, q[1] = H;
    else H = q[1];
    let $;
    if (q[2] !== Y || q[3] !== z) $ = Y ? Zv6.default.createElement(QM6, {
        fullOutput: Y.fullOutput,
        output: Y.output,
        elapsedTimeSeconds: Y.elapsedTimeSeconds,
        totalLines: Y.totalLines,
        verbose: z
    }) : qq.renderToolUseProgressMessage([], {
        verbose: z,
        tools: [],
        terminalSize: void 0
    }), q[2] = Y, q[3] = z, q[4] = $;
    else $ = q[4];
    let O;
    if (q[5] !== H || q[6] !== $) O = Zv6.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, H, $), q[5] = H, q[6] = $, q[7] = O;
    else O = q[7];
    return O
}
// @from(Ln 461241, Col 4)
Zv6
// @from(Ln 461242, Col 4)
JMq = v(() => {
    i1();
    m1();
    vvA();
    KEA();
    i0();
    Zv6 = o(X1(), 1)
})
// @from(Ln 461250, Col 0)
async function XMq(A, q, K, Y, z, w) {
    u8("bash-mode"), c("tengu_input_bash", {}), w(!0);
    let H = c6({
            content: pZ({
                inputString: `<bash-input>${A}</bash-input>`,
                precedingInputBlocks: q
            })
        }),
        $;
    z({
        jsx: GF.createElement(gQA, {
            input: A,
            progress: null,
            verbose: Y.options.verbose
        }),
        shouldHidePromptInput: !1
    });
    try {
        let O = {
                ...Y,
                setToolJSX: (j) => {
                    $ = j?.jsx
                }
            },
            J = (await qq.call({
                command: A,
                dangerouslyDisableSandbox: !0
            }, O, void 0, void 0, (j) => {
                z({
                    jsx: GF.createElement(GF.Fragment, null, GF.createElement(gQA, {
                        input: A,
                        progress: j.data,
                        verbose: Y.options.verbose
                    }), $),
                    shouldHidePromptInput: !1,
                    showSpinner: !1
                })
            })).data;
        if (!J) throw Error("No result received from bash command");
        let X = J.stderr,
            D = await Y.getAppState();
        if (OZ6(D.toolPermissionContext)) X = $Z6(X);
        return {
            messages: [wP(), H, ...K, c6({
                content: `<bash-stdout>${J.stdout}</bash-stdout><bash-stderr>${X}</bash-stderr>`
            })],
            shouldQuery: !1
        }
    } catch (O) {
        if (O instanceof DC) {
            if (O.interrupted) return {
                messages: [wP(), H, c6({
                    content: ts
                }), ...K],
                shouldQuery: !1
            };
            return {
                messages: [wP(), H, ...K, c6({
                    content: `<bash-stdout>${O.stdout}</bash-stdout><bash-stderr>${O.stderr}</bash-stderr>`
                })],
                shouldQuery: !1
            }
        }
        return {
            messages: [wP(), H, ...K, c6({
                content: `<bash-stderr>Command failed: ${O instanceof Error?O.message:String(O)}</bash-stderr>`
            })],
            shouldQuery: !1
        }
    } finally {
        z(null)
    }
}
// @from(Ln 461323, Col 4)
GF
// @from(Ln 461324, Col 4)
DMq = v(() => {
    u6();
    N8();
    N8();
    JMq();
    i0();
    GG1();
    GG1();
    qH();
    v3();
    GF = o(X1(), 1)
})
// @from(Ln 461337, Col 0)
function jMq(A, q, K, Y, z, w, H, $, O, _) {
    z(!0);
    let J = typeof A === "string" ? A : A.find((M) => M.type === "text")?.text || "";
    oi7(J);
    let X = {};
    if (typeof A === "string") {
        let M = Es4(A),
            P = ks4(A);
        X = {
            is_negative: M,
            is_keep_going: P
        }, zj("user_prompt", {
            prompt_length: String(A.length),
            prompt: p_6(A)
        })
    }
    if (c("tengu_input_prompt", X), q.length > 0) {
        let M = typeof A === "string" ? A.trim() ? [{
                type: "text",
                text: A
            }] : [] : A,
            P = c6({
                content: [...M, ...q],
                uuid: w,
                thinkingMetadata: H,
                todos: O,
                imagePasteIds: K.length > 0 ? K : void 0,
                permissionMode: _
            }),
            W = wOA([P], $ ?? void 0);
        return {
            messages: [P, ...Y],
            shouldQuery: !0,
            maxThinkingTokens: W
        }
    }
    let D = c6({
            content: A,
            uuid: w,
            thinkingMetadata: H,
            todos: O,
            permissionMode: _
        }),
        j = wOA([D], $ ?? void 0);
    return {
        messages: [D, ...Y],
        shouldQuery: !0,
        maxThinkingTokens: j
    }
}
// @from(Ln 461387, Col 4)
MMq = v(() => {
    u6();
    aa();
    As();
    N8();
    tD1()
})
// @from(Ln 461394, Col 0)
async function PMq() {}
// @from(Ln 461398, Col 0)
async function Vv6({
    input: A,
    mode: q,
    setIsLoading: K,
    setToolJSX: Y,
    context: z,
    pastedContents: w,
    ideSelection: H,
    messages: $,
    setUserInputOnProcessing: O,
    uuid: _,
    isAlreadyProcessing: J,
    thinkingMetadata: X,
    manualThinkingTokens: D,
    querySource: j,
    canUseTool: M
}) {
    let P = typeof A === "string" ? A : null;
    if (q === "prompt" && P !== null) O?.(P);
    try {
        y3("query_process_user_input_base_start");
        let W = await z.getAppState(),
            G = await fJz(A, q, K, Y, z, w, H, $, _, J, X, D, j, W.todos[z.agentId ?? U6()], M, W.toolPermissionContext.mode);
        if (y3("query_process_user_input_base_end"), !G.shouldQuery) return G;
        y3("query_hooks_start");
        let f = J51(A) || "";
        PMq(f, $ ?? [], W);
        for await (let Z of HyA(f, W.toolPermissionContext.mode, z)) {
            if (Z.message?.type === "progress") continue;
            if (Z.blockingError) {
                let N = eRA(Z.blockingError);
                return {
                    messages: [WP(`${N}

Original prompt: ${A}`, "warning")],
                    shouldQuery: !1,
                    allowedTools: G.allowedTools,
                    maxThinkingTokens: G.maxThinkingTokens
                }
            }
            if (Z.preventContinuation) {
                let N = Z.stopReason ? `Operation stopped by hook: ${Z.stopReason}` : "Operation stopped by hook";
                return G.messages.push(c6({
                    content: N
                })), G.shouldQuery = !1, G
            }
            if (Z.additionalContexts && Z.additionalContexts.length > 0) G.messages.push(kq({
                type: "hook_additional_context",
                content: Z.additionalContexts.map(WMq),
                hookName: "UserPromptSubmit",
                toolUseID: `hook-${ZJz()}`,
                hookEvent: "UserPromptSubmit"
            }));
            if (Z.message) switch (Z.message.attachment.type) {
                case "hook_success":
                    if (!Z.message.attachment.content) break;
                    G.messages.push({
                        ...Z.message,
                        attachment: {
                            ...Z.message.attachment,
                            content: WMq(Z.message.attachment.content)
                        }
                    });
                    break;
                default:
                    G.messages.push(Z.message);
                    break
            }
        }
        return y3("query_hooks_end"), G
    } finally {
        O?.(void 0)
    }
}
// @from(Ln 461473, Col 0)
function WMq(A) {
    if (A.length > UQA) return `${A.substring(0,UQA)}… [output truncated - exceeded ${UQA} characters]`;
    return A
}
// @from(Ln 461477, Col 0)
async function fJz(A, q, K, Y, z, w, H, $, O, _, J, X, D, j, M, P) {
    let W = null,
        G = [],
        f = [];
    if (typeof A === "string") W = A;
    else if (A.length > 0) {
        y3("query_image_processing_start");
        let S = [];
        for (let b of A)
            if (b.type === "image") {
                let g = await Aq1(b);
                if (g.dimensions) {
                    let U = WD1(g.dimensions);
                    if (U) f.push(U)
                }
                S.push(g.block)
            } else S.push(b);
        y3("query_image_processing_end");
        let m = S[S.length - 1];
        if (m?.type === "text") W = m.text, G = [...S.slice(0, -1)];
        else G = S
    }
    if (W === null && q !== "prompt") throw Error(`Mode: ${q} requires a string input.`);
    let Z = w ? Object.values(w).filter((S) => S.type === "image") : [],
        N = Z.map((S) => S.id);
    y3("query_pasted_image_processing_start");
    let T = await Promise.all(Z.map(async (S) => {
            let m = {
                type: "image",
                source: {
                    type: "base64",
                    media_type: S.mediaType || "image/png",
                    data: S.content
                }
            };
            return c("tengu_pasted_image_resize_attempt", {
                original_size_bytes: S.content.length
            }), {
                resized: await Aq1(m),
                originalDimensions: S.dimensions,
                sourcePath: S.sourcePath
            }
        })),
        k = [];
    for (let {
            resized: S,
            originalDimensions: m,
            sourcePath: b
        }
        of T) {
        if (S.dimensions) {
            let g = WD1(S.dimensions, b);
            if (g) f.push(g)
        } else if (m) {
            let g = WD1(m, b);
            if (g) f.push(g)
        } else if (b) f.push(`[Image source: ${b}]`);
        k.push(S.block)
    }
    if (y3("query_pasted_image_processing_end"), w) kk7(w);
    let y = W !== null && (q !== "prompt" || !W.startsWith("/"));
    y3("query_attachment_loading_start");
    let B = y ? await JJ6(oP1(W, z, H ?? null, [], $, D)) : [];
    if (y3("query_attachment_loading_end"), W !== null && q === "bash") return fv6(await XMq(W, G, B, z, Y, K), f);
    if (W !== null && q === "background") return fv6(await OMq(W, G, B, z, Y, K), f);
    if (W !== null && W.startsWith("/")) {
        let S = await Mb4(W, G, k, B, z, K, Y, O, _, M);
        return fv6(S, f)
    }
    if (W !== null && q === "prompt") {
        let S = W.trim(),
            m = B.find((b) => b.attachment.type === "agent_mention");
        if (m) {
            let b = `@agent-${m.attachment.agentType}`,
                g = S === b,
                U = S.startsWith(b) && !g;
            c("tengu_subagent_at_mention", {
                is_subagent_only: g,
                is_prefix: U
            })
        }
    }
    return fv6(jMq(A, k, N, B, K, O, J, X, j, P), f)
}
// @from(Ln 461562, Col 0)
function fv6(A, q) {
    if (q.length > 0) A.messages.push(c6({
        content: q.map((K) => ({
            type: "text",
            text: K
        })),
        isMeta: !0
    }));
    return A
}
// @from(Ln 461572, Col 4)
UQA = 1e4
// @from(Ln 461573, Col 4)
pQA = v(() => {
    N8();
    hK1();
    FW();
    N8();
    aM();
    _Mq();
    DMq();
    BM6();
    MMq();
    dL();
    u6();
    BG1();
    B6();
    po()
})
// @from(Ln 461594, Col 0)
function ZMq(A) {
    return A.type === "text"
}
// @from(Ln 461598, Col 0)
function fMq({
    messages: A,
    onPreRestore: q,
    onRestoreMessage: K,
    onRestoreCode: Y,
    onSummarize: z,
    onClose: w
}) {
    let H = v6((J1) => J1.fileHistory),
        [$, O] = K_.useState(void 0),
        _ = z2(),
        J = K_.useMemo(VJz, []),
        X = K_.useMemo(() => [...A.filter(Zc1), {
            ...c6({
                content: ""
            }),
            uuid: J
        }], [A, J]),
        [D, j] = K_.useState(X.length - 1),
        M = Math.max(0, Math.min(D - Math.floor(dQA / 2), X.length - dQA)),
        P = X.length > 1,
        [W, G] = K_.useState(void 0),
        [f, Z] = K_.useState(void 0),
        [N, T] = K_.useState(!1),
        [k, y] = K_.useState(null),
        [B, S] = K_.useState("both"),
        [m, b] = K_.useState("");

    function g(J1) {
        let D1 = J1 ? [{
            value: "both",
            label: "Restore code and conversation"
        }, {
            value: "conversation",
            label: "Restore conversation"
        }, {
            value: "code",
            label: "Restore code"
        }] : [{
            value: "conversation",
            label: "Restore conversation"
        }];
        return D1.push({
            value: "summarize",
            label: "Summarize from here",
            type: "input",
            placeholder: "add context (optional)",
            initialValue: "",
            onChange: b,
            allowEmptySubmitToCancel: !0,
            showLabelWithValue: !0,
            labelValueSeparator: ": "
        }), D1.push({
            value: "nevermind",
            label: "Never mind"
        }), D1
    }
    K_.useEffect(() => {
        c("tengu_message_selector_opened", {})
    }, []);
    async function U(J1) {
        let D1 = A.indexOf(J1),
            Z1 = A.length - 1 - D1;
        if (c("tengu_message_selector_selected", {
                index_from_end: Z1,
                message_type: J1.type,
                is_current_prompt: !1
            }), !A.includes(J1)) {
            w();
            return
        }
        if (_) {
            G(J1);
            let E1 = RP6(H, J1.uuid);
            Z(E1)
        } else {
            q(), T(!0);
            try {
                await K(J1), T(!1), w()
            } catch (E1) {
                K1(E1), T(!1), O(`Failed to restore the conversation:
${E1}`)
            }
        }
    }
    async function x(J1) {
        if (c("tengu_message_selector_restore_option_selected", {
                option: J1
            }), !W) {
            O("Message not found.");
            return
        }
        if (J1 === "nevermind") {
            G(void 0);
            return
        }
        if (J1 === "summarize") {
            q(), T(!0), y("summarize"), O(void 0);
            try {
                let E1 = m.trim() || void 0;
                await z(W, E1), T(!1), y(null), G(void 0), w()
            } catch (E1) {
                K1(E1), T(!1), y(null), O(`Failed to summarize:
${E1}`)
            }
            return
        }
        q(), T(!0), O(void 0);
        let D1 = null,
            Z1 = null;
        if (J1 === "code" || J1 === "both") try {
            await Y(W)
        } catch (E1) {
            D1 = E1, K1(D1)
        }
        if (J1 === "conversation" || J1 === "both") try {
            await K(W)
        } catch (E1) {
            Z1 = E1, K1(Z1)
        }
        if (T(!1), G(void 0), Z1 && D1) O(`Failed to restore the conversation and code:
${Z1}
${D1}`);
        else if (Z1) O(`Failed to restore the conversation:
${Z1}`);
        else if (D1) O(`Failed to restore the code:
${D1}`);
        else w()
    }
    let p = uq(),
        l = K_.useCallback(() => {
            if (W) {
                G(void 0);
                return
            }
            c("tengu_message_selector_cancelled", {}), w()
        }, [w, W]),
        r = K_.useCallback(() => j((J1) => Math.max(0, J1 - 1)), []),
        s = K_.useCallback(() => j((J1) => Math.min(X.length - 1, J1 + 1)), [X.length]),
        O1 = K_.useCallback(() => j(0), []),
        T1 = K_.useCallback(() => j(X.length - 1), [X.length]),
        N1 = K_.useCallback(() => {
            let J1 = X[D];
            if (J1) U(J1)
        }, [X, D, U]);
    DA("confirm:no", l, {
        context: "Confirmation",
        isActive: !W
    }), c7({
        "messageSelector:up": r,
        "messageSelector:down": s,
        "messageSelector:top": O1,
        "messageSelector:bottom": T1,
        "messageSelector:select": N1
    }, {
        context: "MessageSelector",
        isActive: !N && !$ && !W && P
    });
    let [j1, q1] = K_.useState({});
    K_.useEffect(() => {
        async function J1() {
            if (!_) return;
            Promise.all(X.map(async (D1, Z1) => {
                if (D1.uuid !== J) {
                    let E1 = LP6(H, D1.uuid),
                        a = X.at(Z1 + 1),
                        A1 = E1 ? TJz(A, D1.uuid, a?.uuid !== J ? a?.uuid : void 0) : void 0;
                    if (A1 !== void 0) q1((M1) => ({
                        ...M1,
                        [Z1]: A1
                    }));
                    else q1((M1) => ({
                        ...M1,
                        [Z1]: void 0
                    }))
                }
            }))
        }
        J1()
    }, [X, A, J, H, _]);
    let t = _ && f?.filesChanged && f.filesChanged.length > 0;
    return vA.createElement(I, {
        flexDirection: "column",
        width: "100%"
    }, vA.createElement(CY, {
        dividerColor: "suggestion"
    }), vA.createElement(I, {
        flexDirection: "column",
        marginX: 1,
        gap: 1
    }, vA.createElement(V, {
        bold: !0,
        color: "suggestion"
    }, "Rewind"), $ && vA.createElement(vA.Fragment, null, vA.createElement(V, {
        color: "error"
    }, "Error: ", $)), !P && vA.createElement(vA.Fragment, null, vA.createElement(V, null, "Nothing to rewind to yet.")), !$ && W && P && vA.createElement(vA.Fragment, null, vA.createElement(V, null, "Confirm you want to restore", " ", !f && "the conversation ", "to the point before you sent this message:"), vA.createElement(I, {
        flexDirection: "column",
        paddingLeft: 1,
        borderStyle: "single",
        borderRight: !1,
        borderTop: !1,
        borderBottom: !1,
        borderLeft: !0,
        borderLeftDimColor: !0
    }, vA.createElement(GMq, {
        userMessage: W,
        color: "text",
        isCurrent: !1
    }), vA.createElement(V, {
        dimColor: !0
    }, "(", q71(new Date(W.timestamp)), ")")), vA.createElement(I, {
        flexDirection: "column"
    }, B === "summarize" ? vA.createElement(V, {
        dimColor: !0
    }, "Messages after this point will be summarized.") : B === "both" || B === "conversation" ? vA.createElement(V, {
        dimColor: !0
    }, "The conversation will be forked.") : vA.createElement(V, {
        dimColor: !0
    }, "The conversation will be unchanged."), B !== "summarize" && (t && (B === "both" || B === "code") ? vA.createElement(NJz, {
        diffStatsForRestore: f
    }) : vA.createElement(V, {
        dimColor: !0
    }, "The code will be unchanged."))), N && k === "summarize" ? vA.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, vA.createElement(c4, null), vA.createElement(V, null, "Summarizing…")) : vA.createElement(kA, {
        isDisabled: N,
        options: g(!!t),
        defaultFocusValue: t ? "both" : "conversation",
        onFocus: (J1) => S(J1),
        onChange: (J1) => x(J1),
        onCancel: () => G(void 0)
    }), t && vA.createElement(I, {
        marginBottom: 1
    }, vA.createElement(V, {
        dimColor: !0
    }, l1.warning, " Rewinding does not affect files edited manually or via bash."))), !$ && !W && P && vA.createElement(vA.Fragment, null, _ ? vA.createElement(V, null, "Restore the code and/or conversation to the point before…") : vA.createElement(V, null, "Restore and fork the conversation to the point before…"), vA.createElement(I, {
        width: "100%",
        flexDirection: "column"
    }, X.slice(M, M + dQA).map((J1, D1) => {
        let Z1 = M + D1,
            E1 = Z1 === D,
            a = J1.uuid === J,
            A1 = Z1 in j1,
            M1 = j1[Z1],
            z1 = M1?.filesChanged && M1.filesChanged.length;
        return vA.createElement(I, {
            key: J1.uuid,
            height: _ ? 3 : 2,
            overflow: "hidden",
            width: "100%",
            flexDirection: "row"
        }, vA.createElement(I, {
            width: 2,
            minWidth: 2
        }, E1 ? vA.createElement(V, {
            color: "permission",
            bold: !0
        }, l1.pointer, " ") : vA.createElement(V, null, "  ")), vA.createElement(I, {
            flexDirection: "column"
        }, vA.createElement(I, {
            flexShrink: 1,
            height: 1,
            overflow: "hidden"
        }, vA.createElement(GMq, {
            userMessage: J1,
            color: E1 ? "suggestion" : void 0,
            isCurrent: a,
            paddingRight: 10
        })), _ && A1 && vA.createElement(I, {
            height: 1,
            flexDirection: "row"
        }, M1 ? vA.createElement(vA.Fragment, null, vA.createElement(V, {
            dimColor: !E1,
            color: "inactive"
        }, z1 ? vA.createElement(vA.Fragment, null, z1 === 1 && M1.filesChanged[0] ? `${Zf1.basename(M1.filesChanged[0])} ` : `${z1} files changed `, vA.createElement(VMq, {
            diffStats: M1
        })) : vA.createElement(vA.Fragment, null, "No code changes"))) : vA.createElement(V, {
            dimColor: !0,
            color: "warning"
        }, l1.warning, " No code restore"))))
    }))), !W && vA.createElement(V, {
        dimColor: !0,
        italic: !0
    }, p.pending ? vA.createElement(vA.Fragment, null, "Press ", p.keyName, " again to exit") : vA.createElement(vA.Fragment, null, !$ && P && "Enter to continue · ", "Esc to exit"))))
}
// @from(Ln 461885, Col 0)
function NJz(A) {
    let q = e(14),
        {
            diffStatsForRestore: K
        } = A;
    if (K === void 0) return;
    if (!K.filesChanged || !K.filesChanged[0]) {
        let $;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = vA.createElement(V, {
            dimColor: !0
        }, "The code has not changed (nothing will be restored)."), q[0] = $;
        else $ = q[0];
        return $
    }
    let Y = K.filesChanged.length,
        z;
    if (Y === 1) {
        let $;
        if (q[1] !== K.filesChanged[0]) $ = Zf1.basename(K.filesChanged[0] || ""), q[1] = K.filesChanged[0], q[2] = $;
        else $ = q[2];
        z = $
    } else if (Y === 2) {
        let $;
        if (q[3] !== K.filesChanged[0]) $ = Zf1.basename(K.filesChanged[0] || ""), q[3] = K.filesChanged[0], q[4] = $;
        else $ = q[4];
        let O = $,
            _;
        if (q[5] !== K.filesChanged[1]) _ = Zf1.basename(K.filesChanged[1] || ""), q[5] = K.filesChanged[1], q[6] = _;
        else _ = q[6];
        z = `${O} and ${_}`
    } else {
        let $;
        if (q[7] !== K.filesChanged[0]) $ = Zf1.basename(K.filesChanged[0] || ""), q[7] = K.filesChanged[0], q[8] = $;
        else $ = q[8];
        z = `${$} and ${K.filesChanged.length-1} other files`
    }
    let w;
    if (q[9] !== K) w = vA.createElement(VMq, {
        diffStats: K
    }), q[9] = K, q[10] = w;
    else w = q[10];
    let H;
    if (q[11] !== z || q[12] !== w) H = vA.createElement(vA.Fragment, null, vA.createElement(V, {
        dimColor: !0
    }, "The code will be restored", " ", w, " in ", z, ".")), q[11] = z, q[12] = w, q[13] = H;
    else H = q[13];
    return H
}
// @from(Ln 461934, Col 0)
function VMq(A) {
    let q = e(7),
        {
            diffStats: K
        } = A;
    if (!K || !K.filesChanged) return;
    let Y;
    if (q[0] !== K.insertions) Y = vA.createElement(V, {
        color: "diffAddedWord"
    }, "+", K.insertions, " "), q[0] = K.insertions, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] !== K.deletions) z = vA.createElement(V, {
        color: "diffRemovedWord"
    }, "-", K.deletions), q[2] = K.deletions, q[3] = z;
    else z = q[3];
    let w;
    if (q[4] !== Y || q[5] !== z) w = vA.createElement(vA.Fragment, null, Y, z), q[4] = Y, q[5] = z, q[6] = w;
    else w = q[6];
    return w
}
// @from(Ln 461956, Col 0)
function GMq(A) {
    let q = e(31),
        {
            userMessage: K,
            color: Y,
            dimColor: z,
            isCurrent: w,
            paddingRight: H
        } = A,
        {
            columns: $
        } = Z8();
    if (w) {
        let N;
        if (q[0] !== Y || q[1] !== z) N = vA.createElement(I, {
            width: "100%"
        }, vA.createElement(V, {
            italic: !0,
            color: Y,
            dimColor: z
        }, "(current)")), q[0] = Y, q[1] = z, q[2] = N;
        else N = q[2];
        return N
    }
    let O = K.message.content,
        _ = typeof O === "string" ? null : O[O.length - 1],
        J, X, D, j, M, P, W, G;
    if (q[3] !== Y || q[4] !== $ || q[5] !== O || q[6] !== z || q[7] !== _ || q[8] !== H) {
        G = Symbol.for("react.early_return_sentinel");
        A: {
            let N = typeof O === "string" ? O.trim() : _ && ZMq(_) ? _.text.trim() : "(no prompt)",
                T = to1(N);
            if (DM6(T)) {
                let k;
                if (q[17] !== Y || q[18] !== z) k = vA.createElement(I, {
                    flexDirection: "row",
                    width: "100%"
                }, vA.createElement(V, {
                    italic: !0,
                    color: Y,
                    dimColor: z
                }, "((empty message))")), q[17] = Y, q[18] = z, q[19] = k;
                else k = q[19];
                G = k;
                break A
            }
            if (T.includes("<bash-input>")) {
                let k = C4(T, "bash-input");
                if (k) {
                    let y;
                    if (q[20] === Symbol.for("react.memo_cache_sentinel")) y = vA.createElement(V, {
                        color: "bashBorder"
                    }, "!"), q[20] = y;
                    else y = q[20];
                    G = vA.createElement(I, {
                        flexDirection: "row",
                        width: "100%"
                    }, y, vA.createElement(V, {
                        color: Y,
                        dimColor: z
                    }, " ", k));
                    break A
                }
            }
            if (T.includes(`<${pP}>`)) {
                let k = C4(T, pP),
                    y = C4(T, "command-args"),
                    B = C4(T, "skill-format") === "true";
                if (k)
                    if (B) {
                        G = vA.createElement(I, {
                            flexDirection: "row",
                            width: "100%"
                        }, vA.createElement(V, {
                            color: Y,
                            dimColor: z
                        }, "Skill(", k, ")"));
                        break A
                    } else {
                        G = vA.createElement(I, {
                            flexDirection: "row",
                            width: "100%"
                        }, vA.createElement(V, {
                            color: Y,
                            dimColor: z
                        }, "/", k, " ", y));
                        break A
                    }
            }
            X = I,
            P = "row",
            W = "100%",
            J = V,
            D = Y,
            j = z,
            M = H ? DY(T, $ - H, !0) : T.slice(0, 500).split(`
`).slice(0, 4).join(`
`)
        }
        q[3] = Y, q[4] = $, q[5] = O, q[6] = z, q[7] = _, q[8] = H, q[9] = J, q[10] = X, q[11] = D, q[12] = j, q[13] = M, q[14] = P, q[15] = W, q[16] = G
    } else J = q[9], X = q[10], D = q[11], j = q[12], M = q[13], P = q[14], W = q[15], G = q[16];
    if (G !== Symbol.for("react.early_return_sentinel")) return G;
    let f;
    if (q[21] !== J || q[22] !== D || q[23] !== j || q[24] !== M) f = vA.createElement(J, {
        color: D,
        dimColor: j
    }, M), q[21] = J, q[22] = D, q[23] = j, q[24] = M, q[25] = f;
    else f = q[25];
    let Z;
    if (q[26] !== X || q[27] !== P || q[28] !== W || q[29] !== f) Z = vA.createElement(X, {
        flexDirection: P,
        width: W
    }, f), q[26] = X, q[27] = P, q[28] = W, q[29] = f, q[30] = Z;
    else Z = q[30];
    return Z
}
// @from(Ln 462073, Col 0)
function TJz(A, q, K) {
    let Y = A.findIndex((O) => O.uuid === q);
    if (Y === -1) return;
    let z = K ? A.findIndex((O) => O.uuid === K) : A.length;
    if (z === -1) z = A.length;
    let w = [],
        H = 0,
        $ = 0;
    for (let O = Y + 1; O < z; O++) {
        let _ = A[O];
        if (!_ || !jJq(_)) continue;
        let J = _.toolUseResult;
        if (!J || !J.filePath || !J.structuredPatch) continue;
        if (!w.includes(J.filePath)) w.push(J.filePath);
        try {
            if ("type" in J && J.type === "create") H += J.content.split(/\r?\n/).length;
            else
                for (let X of J.structuredPatch) {
                    let D = X.lines.filter((M) => M.startsWith("+")).length,
                        j = X.lines.filter((M) => M.startsWith("-")).length;
                    H += D, $ += j
                }
        } catch {
            continue
        }
    }
    return {
        filesChanged: w,
        insertions: H,
        deletions: $
    }
}
// @from(Ln 462106, Col 0)
function Zc1(A) {
    if (A.type !== "user") return !1;
    if (Array.isArray(A.message.content) && A.message.content[0]?.type === "tool_result") return !1;
    if (zP6(A)) return !1;
    if (A.isMeta) return !1;
    let q = A.message.content,
        K = typeof q === "string" ? null : q[q.length - 1],
        Y = typeof q === "string" ? q.trim() : K && ZMq(K) ? K.text.trim() : "";
    if (Y.indexOf(`<${Pw1}>`) !== -1 || Y.indexOf(`<${ao1}>`) !== -1 || Y.indexOf(`<${a98}>`) !== -1 || Y.indexOf(`<${s98}>`) !== -1 || Y.indexOf(`<${NO}>`) !== -1 || Y.indexOf(`<${JC}>`) !== -1 || Y.indexOf(`<${qJ}`) !== -1) return !1;
    return !0
}
// @from(Ln 462117, Col 4)
vA
// @from(Ln 462117, Col 8)
K_
// @from(Ln 462117, Col 12)
dQA = 7
// @from(Ln 462118, Col 4)
Nv6 = v(() => {
    i1();
    m1();
    K7();
    b7();
    x2();
    N8();
    QI6();
    u6();
    R2();
    U5();
    d8();
    y6();
    ZN();
    vq();
    mq();
    kW();
    vz();
    vA = o(X1(), 1), K_ = o(X1(), 1)
})