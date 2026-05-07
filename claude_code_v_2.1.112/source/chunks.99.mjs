
// @from(Ln 261350, Col 0)
function fC4({
    processId: q,
    hookId: K,
    asyncResponse: _,
    hookName: z,
    hookEvent: Y,
    command: A,
    shellCommand: O,
    toolName: w,
    pluginId: $
}) {
    let j = _.asyncTimeout || 15000;
    E(`Hooks: Registering async hook ${q} (${z}) with timeout ${j}ms`);
    let H = vI8({
        hookId: K,
        hookName: z,
        hookEvent: Y,
        getOutput: async () => {
            let J = Ic.get(q)?.shellCommand?.taskOutput;
            if (!J) return {
                stdout: "",
                stderr: "",
                output: ""
            };
            let X = await J.getStdout(),
                M = J.getStderr();
            return {
                stdout: X,
                stderr: M,
                output: X + M
            }
        }
    });
    Ic.set(q, {
        processId: q,
        hookId: K,
        hookName: z,
        hookEvent: Y,
        toolName: w,
        pluginId: $,
        command: A,
        startTime: Date.now(),
        timeout: j,
        responseAttachmentSent: !1,
        shellCommand: O,
        stopProgressInterval: H
    })
}
// @from(Ln 261398, Col 0)
async function Ai1(q, K, _) {
    q.stopProgressInterval();
    let z = q.shellCommand?.taskOutput,
        Y = z ? await z.getStdout() : "",
        A = z?.getStderr() ?? "";
    q.shellCommand?.cleanup(), df({
        hookId: q.hookId,
        hookName: q.hookName,
        hookEvent: q.hookEvent,
        output: Y + A,
        stdout: Y,
        stderr: A,
        exitCode: K,
        outcome: _
    })
}
// @from(Ln 261414, Col 0)
async function GC4() {
    let q = [],
        K = Ic.size;
    E(`Hooks: Found ${K} total hooks in registry`);
    let _ = Array.from(Ic.values()),
        z = await Promise.allSettled(_.map(async (A) => {
            let O = await A.shellCommand?.taskOutput.getStdout() ?? "",
                w = A.shellCommand?.taskOutput.getStderr() ?? "";
            if (E(`Hooks: Checking hook ${A.processId} (${A.hookName}) - attachmentSent: ${A.responseAttachmentSent}, stdout length: ${O.length}`), !A.shellCommand) return E(`Hooks: Hook ${A.processId} has no shell command, removing from registry`), A.stopProgressInterval(), {
                type: "remove",
                processId: A.processId
            };
            if (E(`Hooks: Hook shell status ${A.shellCommand.status}`), A.shellCommand.status === "killed") return E(`Hooks: Hook ${A.processId} is ${A.shellCommand.status}, removing from registry`), A.stopProgressInterval(), A.shellCommand.cleanup(), {
                type: "remove",
                processId: A.processId
            };
            if (A.shellCommand.status !== "completed") return {
                type: "skip"
            };
            if (A.responseAttachmentSent || !O.trim()) return E(`Hooks: Skipping hook ${A.processId} - already delivered/sent or no stdout`), A.stopProgressInterval(), {
                type: "remove",
                processId: A.processId
            };
            let $ = O.split(`
`);
            E(`Hooks: Processing ${$.length} lines of stdout for ${A.processId}`);
            let H = (await A.shellCommand.result).code,
                J = {};
            for (let X of $)
                if (X.trim().startsWith("{")) {
                    E(`Hooks: Found JSON line: ${X.trim().substring(0,100)}...`);
                    try {
                        let M = n8(X.trim());
                        if (!("async" in M)) {
                            E(`Hooks: Found sync response from ${A.processId}: ${I6(M)}`), J = M;
                            break
                        }
                    } catch {
                        E(`Hooks: Failed to parse JSON from ${A.processId}: ${X.trim()}`)
                    }
                } return A.responseAttachmentSent = !0, await Ai1(A, H, H === 0 ? "success" : "error"), {
                type: "response",
                processId: A.processId,
                isSessionStart: A.hookEvent === "SessionStart",
                payload: {
                    processId: A.processId,
                    response: J,
                    hookName: A.hookName,
                    hookEvent: A.hookEvent,
                    toolName: A.toolName,
                    pluginId: A.pluginId,
                    stdout: O,
                    stderr: w,
                    exitCode: H
                }
            }
        })),
        Y = !1;
    for (let A of z) {
        if (A.status !== "fulfilled") {
            E(`Hooks: checkForAsyncHookResponses callback rejected: ${A.reason}`, {
                level: "error"
            });
            continue
        }
        let O = A.value;
        if (O.type === "remove") Ic.delete(O.processId);
        else if (O.type === "response") {
            if (q.push(O.payload), Ic.delete(O.processId), O.isSessionStart) Y = !0
        }
    }
    if (Y) E("Invalidating session env cache after SessionStart hook completed"), xh6();
    return E(`Hooks: checkForNewResponses returning ${q.length} responses`), q
}
// @from(Ln 261489, Col 0)
function vC4(q) {
    for (let K of q) {
        let _ = Ic.get(K);
        if (_ && _.responseAttachmentSent) E(`Hooks: Removing delivered hook ${K}`), _.stopProgressInterval(), Ic.delete(K)
    }
}
// @from(Ln 261495, Col 0)
async function Oi1() {
    let q = Array.from(Ic.values());
    await Promise.all(q.map(async (K) => {
        if (K.shellCommand?.status === "completed") {
            let _ = await K.shellCommand.result;
            await Ai1(K, _.code, _.code === 0 ? "success" : "error")
        } else {
            if (K.shellCommand && K.shellCommand.status !== "killed") K.shellCommand.kill();
            await Ai1(K, 1, "cancelled")
        }
    })), Ic.clear()
}
// @from(Ln 261507, Col 4)
Ic
// @from(Ln 261508, Col 4)
TI8 = L(() => {
    K8();
    oH6();
    e8();
    o88();
    Ic = new Map
})
// @from(Ln 261519, Col 0)
function kC4({
    serverName: q,
    files: K
}) {
    let _ = hMz();
    E(`LSP Diagnostics: Registering ${K.length} diagnostic file(s) from ${q} (ID: ${_})`), rp.set(_, {
        serverName: q,
        files: K,
        timestamp: Date.now(),
        attachmentSent: !1
    })
}
// @from(Ln 261532, Col 0)
function VC4(q) {
    switch (q) {
        case "Error":
            return 1;
        case "Warning":
            return 2;
        case "Info":
            return 3;
        case "Hint":
            return 4;
        default:
            return 4
    }
}
// @from(Ln 261547, Col 0)
function NC4(q) {
    return I6({
        message: q.message,
        severity: q.severity,
        range: q.range,
        source: q.source || null,
        code: q.code || null
    })
}
// @from(Ln 261557, Col 0)
function SMz(q) {
    let K = new Map,
        _ = [];
    for (let z of q) {
        if (!K.has(z.uri)) K.set(z.uri, new Set), _.push({
            uri: z.uri,
            diagnostics: []
        });
        let Y = K.get(z.uri),
            A = _.find((w) => w.uri === z.uri),
            O = n56.get(z.uri) || new Set;
        for (let w of z.diagnostics) try {
            let $ = NC4(w);
            if (Y.has($) || O.has($)) continue;
            Y.add($), A.diagnostics.push(w)
        } catch ($) {
            let j = r1($),
                H = w.message?.substring(0, 100) || "<no message>";
            j6(Error(`Failed to deduplicate diagnostic in ${z.uri}: ${j.message}. Diagnostic message: ${H}`)), A.diagnostics.push(w)
        }
    }
    return _.filter((z) => z.diagnostics.length > 0)
}
// @from(Ln 261581, Col 0)
function EC4() {
    E(`LSP Diagnostics: Checking registry - ${rp.size} pending`);
    let q = [],
        K = new Set,
        _ = [];
    for (let j of rp.values())
        if (!j.attachmentSent) q.push(...j.files), K.add(j.serverName), _.push(j);
    if (q.length === 0) return [];
    let z;
    try {
        z = SMz(q)
    } catch (j) {
        let H = r1(j);
        j6(Error(`Failed to deduplicate LSP diagnostics: ${H.message}`)), z = q
    }
    for (let j of _) j.attachmentSent = !0;
    for (let [j, H] of rp)
        if (H.attachmentSent) rp.delete(j);
    let Y = q.reduce((j, H) => j + H.diagnostics.length, 0),
        A = z.reduce((j, H) => j + H.diagnostics.length, 0);
    if (Y > A) E(`LSP Diagnostics: Deduplication removed ${Y-A} duplicate diagnostic(s)`);
    let O = 0,
        w = 0;
    for (let j of z) {
        if (j.diagnostics.sort((J, X) => VC4(J.severity) - VC4(X.severity)), j.diagnostics.length > VI8) w += j.diagnostics.length - VI8, j.diagnostics = j.diagnostics.slice(0, VI8);
        let H = TC4 - O;
        if (j.diagnostics.length > H) w += j.diagnostics.length - H, j.diagnostics = j.diagnostics.slice(0, H);
        O += j.diagnostics.length
    }
    if (z = z.filter((j) => j.diagnostics.length > 0), w > 0) E(`LSP Diagnostics: Volume limiting removed ${w} diagnostic(s) (max ${VI8}/file, ${TC4} total)`);
    for (let j of z) {
        if (!n56.has(j.uri)) n56.set(j.uri, new Set);
        let H = n56.get(j.uri);
        for (let J of j.diagnostics) try {
            H.add(NC4(J))
        } catch (X) {
            let M = r1(X),
                P = J.message?.substring(0, 100) || "<no message>";
            j6(Error(`Failed to track delivered diagnostic in ${j.uri}: ${M.message}. Diagnostic message: ${P}`))
        }
    }
    let $ = z.reduce((j, H) => j + H.diagnostics.length, 0);
    if ($ === 0) return E("LSP Diagnostics: No new diagnostics to deliver (all filtered by deduplication)"), [];
    return E(`LSP Diagnostics: Delivering ${z.length} file(s) with ${$} diagnostic(s) from ${K.size} server(s)`), [{
        serverName: Array.from(K).join(", "),
        files: z
    }]
}
// @from(Ln 261630, Col 0)
function yC4() {
    E(`LSP Diagnostics: Clearing ${rp.size} pending diagnostic(s)`), rp.clear()
}
// @from(Ln 261634, Col 0)
function LC4() {
    E(`LSP Diagnostics: Resetting all state (${rp.size} pending, ${n56.size} files tracked)`), rp.clear(), n56.clear()
}
// @from(Ln 261638, Col 0)
function kI8(q) {
    if (n56.has(q)) E(`LSP Diagnostics: Clearing delivered diagnostics for ${q}`), n56.delete(q)
}
// @from(Ln 261642, Col 0)
function NI8(q) {
    let K = 0;
    for (let [_, z] of rp) {
        let Y = z.files.filter((A) => A.uri !== q);
        if (Y.length === z.files.length) continue;
        if (Y.length === 0) rp.delete(_);
        else z.files = Y;
        K++
    }
    if (K > 0) E(`LSP Diagnostics: Purged ${K} pending entry(ies) referencing ${q}`)
}
// @from(Ln 261653, Col 4)
VI8 = 10
// @from(Ln 261654, Col 4)
TC4 = 30
// @from(Ln 261655, Col 4)
RMz = 500
// @from(Ln 261656, Col 4)
rp
// @from(Ln 261656, Col 8)
n56
// @from(Ln 261657, Col 4)
uh6 = L(() => {
    If6();
    K8();
    m8();
    U8();
    e8();
    rp = new Map, n56 = new iN({
        max: RMz
    })
})
// @from(Ln 261668, Col 0)
function a88(q) {
    return q.type === "user" && !q.isMeta && q.toolUseResult === void 0
}
// @from(Ln 261682, Col 0)
async function RC4(q) {
    try {
        let z = (await V8().stat(q)).size;
        if (z === 0) return {
            success: !1,
            error: {
                reason: "empty",
                message: `PDF file is empty: ${q}`
            }
        };
        if (z > ys6) return {
            success: !1,
            error: {
                reason: "too_large",
                message: `PDF file exceeds maximum allowed size of ${o4(ys6)}.`
            }
        };
        let Y = await xMz(q);
        if (!Y.subarray(0, 5).toString("ascii").startsWith("%PDF-")) return {
            success: !1,
            error: {
                reason: "corrupted",
                message: `File is not a valid PDF (missing %PDF- header): ${q}`
            }
        };
        let O = Y.toString("base64");
        return {
            success: !0,
            data: {
                type: "pdf",
                file: {
                    filePath: q,
                    base64: O,
                    originalSize: z
                }
            }
        }
    } catch (K) {
        return {
            success: !1,
            error: {
                reason: "unknown",
                message: b6(K)
            }
        }
    }
}
// @from(Ln 261729, Col 0)
async function yI8(q) {
    let {
        code: K,
        stdout: _
    } = await w1("pdfinfo", [q], {
        timeout: 1e4,
        useCwd: !1
    });
    if (K !== 0) return null;
    let z = /^Pages:\s+(\d+)/m.exec(_);
    if (!z) return null;
    let Y = parseInt(z[1], 10);
    return isNaN(Y) ? null : Y
}
// @from(Ln 261743, Col 0)
async function uMz() {
    if (EI8 !== void 0) return EI8;
    let {
        code: q,
        stderr: K
    } = await w1("pdftoppm", ["-v"], {
        timeout: 5000,
        useCwd: !1
    });
    return EI8 = q === 0 || K.length > 0, EI8
}
// @from(Ln 261754, Col 0)
async function wi1(q, K) {
    try {
        let Y = (await V8().stat(q)).size;
        if (Y === 0) return {
            success: !1,
            error: {
                reason: "empty",
                message: `PDF file is empty: ${q}`
            }
        };
        if (Y > gm1) return {
            success: !1,
            error: {
                reason: "too_large",
                message: `PDF file exceeds maximum allowed size for text extraction (${o4(gm1)}).`
            }
        };
        if (!await uMz()) return {
            success: !1,
            error: {
                reason: "unavailable",
                message: "pdftoppm is not installed. Install poppler-utils (e.g. `brew install poppler` or `apt-get install poppler-utils`) to enable PDF page rendering."
            }
        };
        let O = CMz(),
            w = hC4(cK6(), `pdf-${O}`);
        await bMz(w, {
            recursive: !0
        });
        let $ = hC4(w, "page"),
            j = ["-jpeg", "-r", "100"];
        if (K?.firstPage) j.push("-f", String(K.firstPage));
        if (K?.lastPage && K.lastPage !== 1 / 0) j.push("-l", String(K.lastPage));
        j.push(q, $);
        let {
            code: H,
            stderr: J
        } = await w1("pdftoppm", j, {
            timeout: 120000,
            useCwd: !1
        });
        if (H !== 0) {
            if (/password/i.test(J)) return {
                success: !1,
                error: {
                    reason: "password_protected",
                    message: "PDF is password-protected. Please provide an unprotected version."
                }
            };
            if (/damaged|corrupt|invalid/i.test(J)) return {
                success: !1,
                error: {
                    reason: "corrupted",
                    message: "PDF file is corrupted or invalid."
                }
            };
            return {
                success: !1,
                error: {
                    reason: "unknown",
                    message: `pdftoppm failed: ${J}`
                }
            }
        }
        let M = (await IMz(w)).filter((D) => D.endsWith(".jpg")).sort();
        if (M.length === 0) return {
            success: !1,
            error: {
                reason: "corrupted",
                message: "pdftoppm produced no output pages. The PDF may be invalid."
            }
        };
        let W = M.length;
        return {
            success: !0,
            data: {
                type: "parts",
                file: {
                    filePath: q,
                    originalSize: Y,
                    outputDir: w,
                    count: W
                }
            }
        }
    } catch (_) {
        return {
            success: !1,
            error: {
                reason: "unknown",
                message: b6(_)
            }
        }
    }
}
// @from(Ln 261849, Col 4)
EI8
// @from(Ln 261850, Col 4)
$i1 = L(() => {
    _s();
    m8();
    Q4();
    c7();
    Yq();
    ND()
})
// @from(Ln 261859, Col 0)
function CC4(q) {
    if (typeof q !== "string") return;
    return SC4.find((K) => K === q)
}
// @from(Ln 261863, Col 4)
SC4
// @from(Ln 261863, Col 9)
bC4
// @from(Ln 261863, Col 14)
IC4
// @from(Ln 261863, Col 19)
aH6
// @from(Ln 261863, Col 24)
ji1 = "- Memory records can become stale over time. Use memory as context for what was true at a given point in time. Before answering the user or building assumptions based solely on information in memory records, verify that the memory is still correct and up-to-date by reading the current state of the files or resources. If a recalled memory conflicts with current information, trust what you observe now — and update or remove the stale memory rather than acting on it."
// @from(Ln 261864, Col 4)
xC4
// @from(Ln 261864, Col 9)
sH6
// @from(Ln 261864, Col 14)
mh6
// @from(Ln 261865, Col 4)
s88 = L(() => {
    SC4 = ["user", "feedback", "project", "reference"];
    bC4 = ["## Types of memory", "", "There are several discrete types of memory that you can store in your memory system. Each type below declares a <scope> of `private`, `team`, or guidance for choosing between the two.", "", "<types>", "<type>", "    <name>user</name>", "    <scope>always private</scope>", "    <description>Contain information about the user's role, goals, responsibilities, and knowledge. Great user memories help you tailor your future behavior to the user's preferences and perspective. Your goal in reading and writing these memories is to build up an understanding of who the user is and how you can be most helpful to them specifically. For example, you should collaborate with a senior software engineer differently than a student who is coding for the very first time. Keep in mind, that the aim here is to be helpful to the user. Avoid writing memories about the user that could be viewed as a negative judgement or that are not relevant to the work you're trying to accomplish together.</description>", "    <when_to_save>When you learn any details about the user's role, preferences, responsibilities, or knowledge</when_to_save>", "    <how_to_use>When your work should be informed by the user's profile or perspective. For example, if the user is asking you to explain a part of the code, you should answer that question in a way that is tailored to the specific details that they will find most valuable or that helps them build their mental model in relation to domain knowledge they already have.</how_to_use>", "    <examples>", "    user: I'm a data scientist investigating what logging we have in place", "    assistant: [saves private user memory: user is a data scientist, currently focused on observability/logging]", "", "    user: I've been writing Go for ten years but this is my first time touching the React side of this repo", "    assistant: [saves private user memory: deep Go expertise, new to React and this project's frontend — frame frontend explanations in terms of backend analogues]", "    </examples>", "</type>", "<type>", "    <name>feedback</name>", "    <scope>default to private. Save as team only when the guidance is clearly a project-wide convention that every contributor should follow (e.g., a testing policy, a build invariant), not a personal style preference.</scope>", "    <description>Guidance the user has given you about how to approach work — both what to avoid and what to keep doing. These are a very important type of memory to read and write as they allow you to remain coherent and responsive to the way you should approach work in the project. Record from failure AND success: if you only save corrections, you will avoid past mistakes but drift away from approaches the user has already validated, and may grow overly cautious. Before saving a private feedback memory, check that it doesn't contradict a team feedback memory — if it does, either don't save it or note the override explicitly.</description>", `    <when_to_save>Any time the user corrects your approach ("no not that", "don't", "stop doing X") OR confirms a non-obvious approach worked ("yes exactly", "perfect, keep doing that", accepting an unusual choice without pushback). Corrections are easy to notice; confirmations are quieter — watch for them. In both cases, save what is applicable to future conversations, especially if surprising or not obvious from the code. Include *why* so you can judge edge cases later.</when_to_save>`, "    <how_to_use>Let these memories guide your behavior so that the user and other users in the project do not need to offer the same guidance twice.</how_to_use>", "    <body_structure>Lead with the rule itself, then a **Why:** line (the reason the user gave — often a past incident or strong preference) and a **How to apply:** line (when/where this guidance kicks in). Knowing *why* lets you judge edge cases instead of blindly following the rule.</body_structure>", "    <examples>", "    user: don't mock the database in these tests — we got burned last quarter when mocked tests passed but the prod migration failed", "    assistant: [saves team feedback memory: integration tests must hit a real database, not mocks. Reason: prior incident where mock/prod divergence masked a broken migration. Team scope: this is a project testing policy, not a personal preference]", "", "    user: stop summarizing what you just did at the end of every response, I can read the diff", "    assistant: [saves private feedback memory: this user wants terse responses with no trailing summaries. Private because it's a communication preference, not a project convention]", "", "    user: yeah the single bundled PR was the right call here, splitting this one would've just been churn", "    assistant: [saves private feedback memory: for refactors in this area, user prefers one bundled PR over many small ones. Confirmed after I chose this approach — a validated judgment call, not a correction]", "    </examples>", "</type>", "<type>", "    <name>project</name>", "    <scope>private or team, but strongly bias toward team</scope>", "    <description>Information that you learn about ongoing work, goals, initiatives, bugs, or incidents within the project that is not otherwise derivable from the code or git history. Project memories help you understand the broader context and motivation behind the work users are working on within this working directory.</description>", '    <when_to_save>When you learn who is doing what, why, or by when. These states change relatively quickly so try to keep your understanding of this up to date. Always convert relative dates in user messages to absolute dates when saving (e.g., "Thursday" → "2026-03-05"), so the memory remains interpretable after time passes.</when_to_save>', "    <how_to_use>Use these memories to more fully understand the details and nuance behind the user's request, anticipate coordination issues across users, make better informed suggestions.</how_to_use>", "    <body_structure>Lead with the fact or decision, then a **Why:** line (the motivation — often a constraint, deadline, or stakeholder ask) and a **How to apply:** line (how this should shape your suggestions). Project memories decay fast, so the why helps future-you judge whether the memory is still load-bearing.</body_structure>", "    <examples>", "    user: we're freezing all non-critical merges after Thursday — mobile team is cutting a release branch", "    assistant: [saves team project memory: merge freeze begins 2026-03-05 for mobile release cut. Flag any non-critical PR work scheduled after that date]", "", "    user: the reason we're ripping out the old auth middleware is that legal flagged it for storing session tokens in a way that doesn't meet the new compliance requirements", "    assistant: [saves team project memory: auth middleware rewrite is driven by legal/compliance requirements around session token storage, not tech-debt cleanup — scope decisions should favor compliance over ergonomics]", "    </examples>", "</type>", "<type>", "    <name>reference</name>", "    <scope>usually team</scope>", "    <description>Stores pointers to where information can be found in external systems. These memories allow you to remember where to look to find up-to-date information outside of the project directory.</description>", "    <when_to_save>When you learn about resources in external systems and their purpose. For example, that bugs are tracked in a specific project in Linear or that feedback can be found in a specific Slack channel.</when_to_save>", "    <how_to_use>When the user references an external system or information that may be in an external system.</how_to_use>", "    <examples>", `    user: check the Linear project "INGEST" if you want context on these tickets, that's where we track all pipeline bugs`, '    assistant: [saves team reference memory: pipeline bugs are tracked in Linear project "INGEST"]', "", "    user: the Grafana board at grafana.internal/d/api-latency is what oncall watches — if you're touching request handling, that's the thing that'll page someone", "    assistant: [saves team reference memory: grafana.internal/d/api-latency is the oncall latency dashboard — check it when editing request-path code]", "    </examples>", "</type>", "</types>", ""], IC4 = ["## Types of memory", "", "There are several discrete types of memory that you can store in your memory system:", "", "<types>", "<type>", "    <name>user</name>", "    <description>Contain information about the user's role, goals, responsibilities, and knowledge. Great user memories help you tailor your future behavior to the user's preferences and perspective. Your goal in reading and writing these memories is to build up an understanding of who the user is and how you can be most helpful to them specifically. For example, you should collaborate with a senior software engineer differently than a student who is coding for the very first time. Keep in mind, that the aim here is to be helpful to the user. Avoid writing memories about the user that could be viewed as a negative judgement or that are not relevant to the work you're trying to accomplish together.</description>", "    <when_to_save>When you learn any details about the user's role, preferences, responsibilities, or knowledge</when_to_save>", "    <how_to_use>When your work should be informed by the user's profile or perspective. For example, if the user is asking you to explain a part of the code, you should answer that question in a way that is tailored to the specific details that they will find most valuable or that helps them build their mental model in relation to domain knowledge they already have.</how_to_use>", "    <examples>", "    user: I'm a data scientist investigating what logging we have in place", "    assistant: [saves user memory: user is a data scientist, currently focused on observability/logging]", "", "    user: I've been writing Go for ten years but this is my first time touching the React side of this repo", "    assistant: [saves user memory: deep Go expertise, new to React and this project's frontend — frame frontend explanations in terms of backend analogues]", "    </examples>", "</type>", "<type>", "    <name>feedback</name>", "    <description>Guidance the user has given you about how to approach work — both what to avoid and what to keep doing. These are a very important type of memory to read and write as they allow you to remain coherent and responsive to the way you should approach work in the project. Record from failure AND success: if you only save corrections, you will avoid past mistakes but drift away from approaches the user has already validated, and may grow overly cautious.</description>", `    <when_to_save>Any time the user corrects your approach ("no not that", "don't", "stop doing X") OR confirms a non-obvious approach worked ("yes exactly", "perfect, keep doing that", accepting an unusual choice without pushback). Corrections are easy to notice; confirmations are quieter — watch for them. In both cases, save what is applicable to future conversations, especially if surprising or not obvious from the code. Include *why* so you can judge edge cases later.</when_to_save>`, "    <how_to_use>Let these memories guide your behavior so that the user does not need to offer the same guidance twice.</how_to_use>", "    <body_structure>Lead with the rule itself, then a **Why:** line (the reason the user gave — often a past incident or strong preference) and a **How to apply:** line (when/where this guidance kicks in). Knowing *why* lets you judge edge cases instead of blindly following the rule.</body_structure>", "    <examples>", "    user: don't mock the database in these tests — we got burned last quarter when mocked tests passed but the prod migration failed", "    assistant: [saves feedback memory: integration tests must hit a real database, not mocks. Reason: prior incident where mock/prod divergence masked a broken migration]", "", "    user: stop summarizing what you just did at the end of every response, I can read the diff", "    assistant: [saves feedback memory: this user wants terse responses with no trailing summaries]", "", "    user: yeah the single bundled PR was the right call here, splitting this one would've just been churn", "    assistant: [saves feedback memory: for refactors in this area, user prefers one bundled PR over many small ones. Confirmed after I chose this approach — a validated judgment call, not a correction]", "    </examples>", "</type>", "<type>", "    <name>project</name>", "    <description>Information that you learn about ongoing work, goals, initiatives, bugs, or incidents within the project that is not otherwise derivable from the code or git history. Project memories help you understand the broader context and motivation behind the work the user is doing within this working directory.</description>", '    <when_to_save>When you learn who is doing what, why, or by when. These states change relatively quickly so try to keep your understanding of this up to date. Always convert relative dates in user messages to absolute dates when saving (e.g., "Thursday" → "2026-03-05"), so the memory remains interpretable after time passes.</when_to_save>', "    <how_to_use>Use these memories to more fully understand the details and nuance behind the user's request and make better informed suggestions.</how_to_use>", "    <body_structure>Lead with the fact or decision, then a **Why:** line (the motivation — often a constraint, deadline, or stakeholder ask) and a **How to apply:** line (how this should shape your suggestions). Project memories decay fast, so the why helps future-you judge whether the memory is still load-bearing.</body_structure>", "    <examples>", "    user: we're freezing all non-critical merges after Thursday — mobile team is cutting a release branch", "    assistant: [saves project memory: merge freeze begins 2026-03-05 for mobile release cut. Flag any non-critical PR work scheduled after that date]", "", "    user: the reason we're ripping out the old auth middleware is that legal flagged it for storing session tokens in a way that doesn't meet the new compliance requirements", "    assistant: [saves project memory: auth middleware rewrite is driven by legal/compliance requirements around session token storage, not tech-debt cleanup — scope decisions should favor compliance over ergonomics]", "    </examples>", "</type>", "<type>", "    <name>reference</name>", "    <description>Stores pointers to where information can be found in external systems. These memories allow you to remember where to look to find up-to-date information outside of the project directory.</description>", "    <when_to_save>When you learn about resources in external systems and their purpose. For example, that bugs are tracked in a specific project in Linear or that feedback can be found in a specific Slack channel.</when_to_save>", "    <how_to_use>When the user references an external system or information that may be in an external system.</how_to_use>", "    <examples>", `    user: check the Linear project "INGEST" if you want context on these tickets, that's where we track all pipeline bugs`, '    assistant: [saves reference memory: pipeline bugs are tracked in Linear project "INGEST"]', "", "    user: the Grafana board at grafana.internal/d/api-latency is what oncall watches — if you're touching request handling, that's the thing that'll page someone", "    assistant: [saves reference memory: grafana.internal/d/api-latency is the oncall latency dashboard — check it when editing request-path code]", "    </examples>", "</type>", "</types>", ""], aH6 = ["## What NOT to save in memory", "", "- Code patterns, conventions, architecture, file paths, or project structure — these can be derived by reading the current project state.", "- Git history, recent changes, or who-changed-what — `git log` / `git blame` are authoritative.", "- Debugging solutions or fix recipes — the fix is in the code; the commit message has the context.", "- Anything already documented in CLAUDE.md files.", "- Ephemeral task details: in-progress work, temporary state, current conversation context.", "", "These exclusions apply even when the user explicitly asks you to save. If they ask you to save a PR list or activity summary, ask what was *surprising* or *non-obvious* about it — that is the part worth keeping."], xC4 = ["## When to access memories", "- When memories seem relevant, or the user references prior-conversation work.", "- You MUST access memory when the user explicitly asks you to check, recall, or remember.", "- If the user says to *ignore* or *not use* memory: Do not apply remembered facts, cite, compare against, or mention memory content.", ji1], sH6 = ["## Before recommending from memory", "", "A memory that names a specific function, file, or flag is a claim that it existed *when the memory was written*. It may have been renamed, removed, or never merged. Before recommending it:", "", "- If the memory names a file path: check the file exists.", "- If the memory names a function or flag: grep for it.", "- If the user is about to act on your recommendation (not just asking about history), verify first.", "", '"The memory says X exists" is not the same as "X exists now."', "", "A memory that summarizes repo state (activity logs, architecture snapshots) is frozen in time. If the user asks about *recent* or *current* state, prefer `git log` or reading the code over recalling the snapshot."], mh6 = ["```markdown", "---", "name: {{memory name}}", "description: {{one-line description — used to decide relevance in future conversations, so be specific}}", `type: {{${SC4.join(", ")}}}`, "---", "", "{{memory content — for feedback/project types, structure as: rule/fact, then **Why:** and **How to apply:** lines}}", "```"]
})
// @from(Ln 261877, Col 0)
function dMz(q) {
    if (typeof q !== "string") return null;
    let K = /^(\d{4})-(\d{2})-(\d{2})$/.exec(q);
    if (!K) return null;
    let _ = Number(K[1]),
        z = Number(K[2]),
        Y = Number(K[3]),
        A = new Date(_, z - 1, Y).getTime();
    return Number.isNaN(A) ? null : A
}
// @from(Ln 261887, Col 0)
async function t88(q, K) {
    let _ = wH(),
        z = _ ? QMz : UMz;
    try {
        let A = (await mMz(q, {
            recursive: !0
        })).filter((w) => w.endsWith(".md") && BMz(w) !== "MEMORY.md");
        return (await Promise.allSettled(A.map(async (w) => {
            let $ = pMz(q, w),
                {
                    content: j,
                    mtimeMs: H
                } = await m56($, 0, z, void 0, K),
                {
                    frontmatter: J,
                    content: X
                } = p2(j, $),
                M = (_ ? dMz(J.created) : null) ?? H;
            return {
                filename: w,
                filePath: $,
                mtimeMs: M,
                description: J.description || null,
                type: CC4(J.type),
                created: typeof J.created === "string" ? J.created : null,
                last_read: typeof J.last_read === "string" ? J.last_read : null,
                content: _ ? X.trim() || null : null
            }
        }))).filter((w) => w.status === "fulfilled").map((w) => w.value).sort((w, $) => $.mtimeMs - w.mtimeMs).slice(0, _ ? gMz : FMz)
    } catch {
        return []
    }
}
// @from(Ln 261921, Col 0)
function e88(q) {
    return q.map((K) => {
        let _ = K.type ? `[${K.type}] ` : "",
            z = new Date(K.mtimeMs).toISOString(),
            Y = `- ${_}${K.filename} (${z})`;
        if (K.content !== null) {
            let A = K.content.replace(/\n/g, `
  `);
            return `${Y}
  ${A}`
        }
        return K.description ? `${Y}: ${K.description}` : Y
    }).join(`
`)
}
// @from(Ln 261936, Col 4)
FMz = 200
// @from(Ln 261937, Col 4)
gMz = 500
// @from(Ln 261938, Col 4)
UMz = 30
// @from(Ln 261939, Col 4)
QMz = 200
// @from(Ln 261940, Col 4)
Hi1 = L(() => {
    Lf();
    Ph6();
    s88();
    VY()
})
// @from(Ln 261946, Col 0)
async function uC4(q, K, _, z, Y = new Set) {
    _.lastUsage = null;
    let A = {
            type: "ephemeral"
        },
        O = AQ1(_, K) ?? await t88(K, z).then((j) => j.length > 0 && !z.aborted ? OQ1(_, K, j, e88(j), A) : void 0);
    if (!O || O.memories.every((j) => Y.has(j.filePath))) return [];
    return (await nMz(q, K, _, O.messages, O.byFilename, A, z)).map((j) => O.byFilename.get(j)).filter((j) => j !== void 0 && !Y.has(j.filePath)).map((j) => ({
        path: j.filePath,
        mtimeMs: j.mtimeMs
    }))
}
// @from(Ln 261958, Col 0)
async function nMz(q, K, _, z, Y, A, O) {
    let w = `Select memories relevant to:
${q}`;
    try {
        let $ = await dR({
                model: Af(),
                system: [{
                    type: "text",
                    text: cMz,
                    cache_control: A
                }],
                skipSystemPromptPrefix: !0,
                messages: [...z, {
                    role: "user",
                    content: [{
                        type: "text",
                        text: w,
                        cache_control: A
                    }]
                }],
                max_tokens: 256,
                output_format: {
                    type: "json_schema",
                    schema: {
                        type: "object",
                        properties: {
                            selected_memories: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            }
                        },
                        required: ["selected_memories"],
                        additionalProperties: !1
                    }
                },
                signal: O,
                querySource: YQ1
            }),
            j = $.content.find((J) => J.type === "text");
        if (!j || j.type !== "text") return [];
        let H = n8(j.text);
        return wQ1(_, K, w, j.text), _.lastUsage = {
            cacheReadInputTokens: $.usage.cache_read_input_tokens ?? 0,
            cacheCreationInputTokens: $.usage.cache_creation_input_tokens ?? 0,
            turnCount: (z.length + 1) / 2
        }, H.selected_memories.filter((J) => Y.has(J))
    } catch ($) {
        if (_.lastUsage = null, O.aborted) return [];
        return E(`[memdir] selectRelevantMemories failed: ${b6($)}`, {
            level: "warn"
        }), []
    }
}
// @from(Ln 262013, Col 0)
async function mC4(q, K, _, z) {
    _.lastUsage = null;
    let Y = {
            type: "ephemeral"
        },
        A = AQ1(_, K) ?? await t88(K, z).then((O) => O.length > 0 && !z.aborted ? OQ1(_, K, O, e88(O), Y) : void 0);
    if (!A) return null;
    return iMz(q, K, _, A.messages, A.byFilename, Y, z)
}
// @from(Ln 262022, Col 0)
async function iMz(q, K, _, z, Y, A, O) {
    let w = `Extract facts relevant to:
${q}`;
    try {
        let $ = await dR({
                model: Af(),
                system: [{
                    type: "text",
                    text: lMz,
                    cache_control: A
                }],
                skipSystemPromptPrefix: !0,
                messages: [...z, {
                    role: "user",
                    content: [{
                        type: "text",
                        text: w,
                        cache_control: A
                    }]
                }],
                max_tokens: 2000,
                output_format: {
                    type: "json_schema",
                    schema: {
                        type: "object",
                        properties: {
                            relevant_facts: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            },
                            cited_memories: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            }
                        },
                        required: ["relevant_facts", "cited_memories"],
                        additionalProperties: !1
                    }
                },
                signal: O,
                querySource: YQ1
            }),
            j = $.content.find((P) => P.type === "text");
        if (!j || j.type !== "text") return null;
        let H = n8(j.text);
        wQ1(_, K, w, j.text), _.lastUsage = {
            cacheReadInputTokens: $.usage.cache_read_input_tokens ?? 0,
            cacheCreationInputTokens: $.usage.cache_creation_input_tokens ?? 0,
            turnCount: (z.length + 1) / 2
        };
        let J = H.relevant_facts.map((P) => P.trim()).filter((P) => P.length > 0).slice(0, 7);
        if (J.length === 0) return null;
        let X = J.map((P) => `- ${P}`).join(`
`),
            M = H.cited_memories.filter((P) => Y.has(P));
        return {
            synthesis: X,
            citedMemories: M
        }
    } catch ($) {
        if (_.lastUsage = null, O.aborted) return null;
        return E(`[memdir] synthesizeRelevantMemories failed: ${b6($)}`, {
            level: "warn"
        }), null
    }
}
// @from(Ln 262092, Col 4)
cMz = `You are selecting memories that will be useful to Claude Code as it processes a user's query. The first message lists the available memory files with their filenames and descriptions; subsequent messages each contain one user query.

Return a list of filenames for the memories that will clearly be useful to Claude Code as it processes the user's query (up to 5). Only include memories that you are certain will be helpful based on their name and description.
- If you are unsure if a memory will be useful in processing the user's query, then do not include it in your list. Be selective and discerning.
- If there are no memories in the list that would clearly be useful, feel free to return an empty list.
- Be especially conservative with user-profile and project-overview memories ([user], [project]). These describe the user's ongoing focus, not what every question is about. A profile saying "works on DB performance" is NOT relevant to a question that merely contains the word "performance" unless the question is actually about that DB work. Match on what the question IS ABOUT, not on surface keyword overlap with who the user is.
- Do not re-select memories you already returned for an earlier query in this conversation.
`
// @from(Ln 262100, Col 4)
lMz = `You read persistent memory files for an AI coding assistant and extract facts to help the coding assistant answer queries. The first message lists every available memory file with its frontmatter and full body; each subsequent user message contains one query.

For each query, return a JSON object:
- relevant_facts: an array of facts (max 7) that would be useful for processing the query. Each fact is 1-2 sentences and stands on its own.
- cited_memories: array of filenames (matching the manifest exactly) for the memories you drew from

If no memories are relevant, return relevant_facts: [] and cited_memories: [].

A fact is useful when it lets the assistant do one of these things:
- Avoid re-asking: supply something the user would otherwise have to restate (a path, a name, a config value, a decision already made).
- Apply user preferences: surface conventions, styles, or tooling choices the assistant should follow for this query.
- Maintain continuity: surface the state of an ongoing project, goal, or prior thread that this query is continuing.
- Avoid a known pitfall: surface past corrections or mistakes so the assistant pre-empts repeating them.

Style and length:
- Each fact is 1-2 sentences. State the fact directly, then add the context needed to act on it.
- Name a path, flag, or identifier only when it is the thing the assistant must use or avoid. Drop supporting details like timestamps, byte counts, version numbers, and historical asides.
- Do not answer or solve the query yourself. You are a retrieval step, not the assistant: every fact must be lifted from a memory file body, not derived from general knowledge or your own reasoning about the query. If no memory covers it, return relevant_facts: [].
- Do not restate the query.
- If a prior turn in this conversation already returned the relevant facts for this query, return relevant_facts: [] and cited_memories: [] rather than restating.
`
// @from(Ln 262121, Col 4)
BC4 = L(() => {
    K8();
    m8();
    Sq();
    tH6();
    e8();
    Hi1()
})
// @from(Ln 262129, Col 4)
pC4
// @from(Ln 262130, Col 4)
FC4 = L(() => {
    pC4 = ["blocking_limit", "rapid_refill_breaker", "prompt_too_long", "image_error", "model_error", "aborted_streaming", "aborted_tools", "stop_hook_prevented", "hook_stopped", "tool_deferred", "max_turns", "completed"]
})
// @from(Ln 262133, Col 4)
UC4
// @from(Ln 262133, Col 9)
rMz
// @from(Ln 262133, Col 14)
tpw
// @from(Ln 262133, Col 19)
oMz
// @from(Ln 262133, Col 24)
epw
// @from(Ln 262133, Col 29)
aMz
// @from(Ln 262133, Col 34)
qFw
// @from(Ln 262133, Col 39)
KFw
// @from(Ln 262133, Col 44)
sMz
// @from(Ln 262133, Col 49)
tMz
// @from(Ln 262133, Col 54)
eMz
// @from(Ln 262133, Col 59)
_Fw
// @from(Ln 262133, Col 64)
qPz
// @from(Ln 262133, Col 69)
QC4
// @from(Ln 262133, Col 74)
KPz
// @from(Ln 262133, Col 79)
_Pz
// @from(Ln 262133, Col 84)
zPz
// @from(Ln 262133, Col 89)
LI8
// @from(Ln 262133, Col 94)
YPz
// @from(Ln 262133, Col 99)
APz
// @from(Ln 262133, Col 104)
Mi1
// @from(Ln 262133, Col 109)
zFw
// @from(Ln 262133, Col 114)
Bh6
// @from(Ln 262133, Col 119)
Ji1
// @from(Ln 262133, Col 124)
OPz
// @from(Ln 262133, Col 129)
Xi1
// @from(Ln 262133, Col 134)
q18
// @from(Ln 262133, Col 139)
gC4
// @from(Ln 262133, Col 144)
YFw
// @from(Ln 262133, Col 149)
ss
// @from(Ln 262133, Col 153)
wPz
// @from(Ln 262133, Col 158)
dC4
// @from(Ln 262133, Col 163)
l2
// @from(Ln 262133, Col 167)
$Pz
// @from(Ln 262133, Col 172)
jPz
// @from(Ln 262133, Col 177)
HPz
// @from(Ln 262133, Col 182)
JPz
// @from(Ln 262133, Col 187)
XPz
// @from(Ln 262133, Col 192)
MPz
// @from(Ln 262133, Col 197)
PPz
// @from(Ln 262133, Col 202)
WPz
// @from(Ln 262133, Col 207)
DPz
// @from(Ln 262133, Col 212)
ZPz
// @from(Ln 262133, Col 217)
fPz
// @from(Ln 262133, Col 222)
GPz
// @from(Ln 262133, Col 227)
vPz
// @from(Ln 262133, Col 232)
TPz
// @from(Ln 262133, Col 237)
VPz
// @from(Ln 262133, Col 242)
kPz
// @from(Ln 262133, Col 247)
NPz
// @from(Ln 262133, Col 252)
EPz
// @from(Ln 262133, Col 257)
yPz
// @from(Ln 262133, Col 262)
LPz
// @from(Ln 262133, Col 267)
hPz
// @from(Ln 262133, Col 272)
RPz
// @from(Ln 262133, Col 277)
SPz
// @from(Ln 262133, Col 282)
CPz
// @from(Ln 262133, Col 287)
bPz
// @from(Ln 262133, Col 292)
IPz
// @from(Ln 262133, Col 297)
xPz
// @from(Ln 262133, Col 302)
uPz
// @from(Ln 262133, Col 307)
mPz
// @from(Ln 262133, Col 312)
BPz
// @from(Ln 262133, Col 317)
pPz
// @from(Ln 262133, Col 322)
FPz
// @from(Ln 262133, Col 327)
cC4
// @from(Ln 262133, Col 332)
gPz
// @from(Ln 262133, Col 337)
UPz
// @from(Ln 262133, Col 342)
QPz
// @from(Ln 262133, Col 347)
dPz
// @from(Ln 262133, Col 352)
cPz
// @from(Ln 262133, Col 357)
lPz
// @from(Ln 262133, Col 362)
nPz
// @from(Ln 262133, Col 367)
iPz
// @from(Ln 262133, Col 372)
rPz
// @from(Ln 262133, Col 377)
oPz
// @from(Ln 262133, Col 382)
aPz
// @from(Ln 262133, Col 387)
sPz
// @from(Ln 262133, Col 392)
tPz
// @from(Ln 262133, Col 397)
ePz
// @from(Ln 262133, Col 402)
qWz
// @from(Ln 262133, Col 407)
KWz
// @from(Ln 262133, Col 412)
_Wz
// @from(Ln 262133, Col 417)
AFw
// @from(Ln 262133, Col 422)
zWz
// @from(Ln 262133, Col 427)
OFw
// @from(Ln 262133, Col 432)
wFw
// @from(Ln 262133, Col 437)
Pi1
// @from(Ln 262133, Col 442)
Wi1
// @from(Ln 262133, Col 447)
lC4
// @from(Ln 262133, Col 452)
nC4
// @from(Ln 262133, Col 457)
YWz
// @from(Ln 262133, Col 462)
iC4
// @from(Ln 262133, Col 467)
$Fw
// @from(Ln 262133, Col 472)
jFw
// @from(Ln 262133, Col 477)
HFw
// @from(Ln 262133, Col 482)
AWz
// @from(Ln 262133, Col 487)
OWz
// @from(Ln 262133, Col 492)
wWz
// @from(Ln 262133, Col 497)
jA
// @from(Ln 262133, Col 501)
rC4
// @from(Ln 262133, Col 506)
Di1
// @from(Ln 262133, Col 511)
$Wz
// @from(Ln 262133, Col 516)
jWz
// @from(Ln 262133, Col 521)
oC4
// @from(Ln 262133, Col 526)
Zi1
// @from(Ln 262133, Col 531)
HWz
// @from(Ln 262133, Col 536)
JWz
// @from(Ln 262133, Col 541)
XWz
// @from(Ln 262133, Col 546)
MWz
// @from(Ln 262133, Col 551)
aC4
// @from(Ln 262133, Col 556)
PWz
// @from(Ln 262133, Col 561)
sC4
// @from(Ln 262133, Col 566)
WWz
// @from(Ln 262133, Col 571)
DWz
// @from(Ln 262133, Col 576)
ZWz
// @from(Ln 262133, Col 581)
tC4
// @from(Ln 262133, Col 586)
fWz
// @from(Ln 262133, Col 591)
GWz
// @from(Ln 262133, Col 596)
vWz
// @from(Ln 262133, Col 601)
TWz
// @from(Ln 262133, Col 606)
eC4
// @from(Ln 262133, Col 611)
qb4
// @from(Ln 262133, Col 616)
JFw
// @from(Ln 262133, Col 621)
VWz
// @from(Ln 262133, Col 626)
kWz
// @from(Ln 262133, Col 631)
NWz
// @from(Ln 262133, Col 636)
EWz
// @from(Ln 262133, Col 641)
yWz
// @from(Ln 262133, Col 646)
LWz
// @from(Ln 262133, Col 651)
hWz
// @from(Ln 262133, Col 656)
RWz
// @from(Ln 262133, Col 661)
SWz
// @from(Ln 262133, Col 666)
CWz
// @from(Ln 262133, Col 671)
bWz
// @from(Ln 262133, Col 676)
IWz
// @from(Ln 262133, Col 681)
xWz
// @from(Ln 262133, Col 686)
uWz
// @from(Ln 262133, Col 691)
mWz
// @from(Ln 262133, Col 696)
BWz
// @from(Ln 262133, Col 701)
pWz
// @from(Ln 262133, Col 706)
FWz
// @from(Ln 262133, Col 711)
gWz
// @from(Ln 262133, Col 716)
XFw
// @from(Ln 262133, Col 721)
Kb4
// @from(Ln 262133, Col 726)
K18
// @from(Ln 262134, Col 4)
fi1 = L(() => {
    p7();
    FC4();
    UC4 = C6(() => y.object({
        inputTokens: y.number(),
        outputTokens: y.number(),
        cacheReadInputTokens: y.number(),
        cacheCreationInputTokens: y.number(),
        webSearchRequests: y.number(),
        costUSD: y.number(),
        contextWindow: y.number(),
        maxOutputTokens: y.number()
    })), rMz = C6(() => y.literal("json_schema")), tpw = C6(() => y.object({
        type: rMz()
    })), oMz = C6(() => y.object({
        type: y.literal("json_schema"),
        schema: y.record(y.string(), y.unknown())
    })), epw = C6(() => oMz()), aMz = C6(() => y.enum(["user", "project", "org", "temporary", "oauth"])), qFw = C6(() => y.enum(["local", "user", "project"]).describe("Config scope for settings.")), KFw = C6(() => y.literal("context-1m-2025-08-07")), sMz = C6(() => y.object({
        type: y.literal("adaptive"),
        display: y.enum(["summarized", "omitted"]).optional()
    }).describe("Claude decides when and how much to think (Opus 4.6+).")), tMz = C6(() => y.object({
        type: y.literal("enabled"),
        budgetTokens: y.number().optional(),
        display: y.enum(["summarized", "omitted"]).optional()
    }).describe("Fixed thinking token budget (older models)")), eMz = C6(() => y.object({
        type: y.literal("disabled")
    }).describe("No extended thinking")), _Fw = C6(() => y.union([sMz(), tMz(), eMz()]).describe("Controls Claude's thinking/reasoning behavior. When set, takes precedence over the deprecated maxThinkingTokens.")), qPz = C6(() => y.object({
        type: y.literal("stdio").optional(),
        command: y.string(),
        args: y.array(y.string()).optional(),
        env: y.record(y.string(), y.string()).optional()
    })), QC4 = C6(() => y.object({
        name: y.string(),
        permission_policy: y.enum(["always_allow", "always_ask", "always_deny"])
    }).describe("Per-tool permission policy carried on mcp_set_servers for remote servers.")), KPz = C6(() => y.object({
        type: y.literal("sse"),
        url: y.string(),
        headers: y.record(y.string(), y.string()).optional(),
        tools: y.array(QC4()).optional()
    })), _Pz = C6(() => y.object({
        type: y.literal("http"),
        url: y.string(),
        headers: y.record(y.string(), y.string()).optional(),
        tools: y.array(QC4()).optional()
    })), zPz = C6(() => y.object({
        type: y.literal("sdk"),
        name: y.string()
    })), LI8 = C6(() => y.union([qPz(), KPz(), _Pz(), zPz()])), YPz = C6(() => y.object({
        type: y.literal("claudeai-proxy"),
        url: y.string(),
        id: y.string()
    })), APz = C6(() => y.union([LI8(), YPz()])), Mi1 = C6(() => y.object({
        name: y.string().describe("Server name as configured"),
        status: y.enum(["connected", "failed", "needs-auth", "pending", "disabled"]).describe("Current connection status"),
        serverInfo: y.object({
            name: y.string(),
            version: y.string()
        }).optional().describe("Server information (available when connected)"),
        error: y.string().optional().describe("Error message (available when status is 'failed')"),
        config: APz().optional().describe("Server configuration (includes URL for HTTP/SSE servers)"),
        scope: y.string().optional().describe("Configuration scope (e.g., project, user, local, claudeai, managed)"),
        tools: y.array(y.object({
            name: y.string(),
            description: y.string().optional(),
            annotations: y.object({
                readOnly: y.boolean().optional(),
                destructive: y.boolean().optional(),
                openWorld: y.boolean().optional()
            }).optional()
        })).optional().describe("Tools provided by this server (available when connected)"),
        capabilities: y.object({
            experimental: y.record(y.string(), y.unknown()).optional()
        }).optional().describe("@internal Server capabilities (available when connected). experimental['claude/channel'] is only present if the server's plugin is on the approved channels allowlist — use its presence to decide whether to show an Enable-channel prompt.")
    }).describe("Status information for an MCP server connection.")), zFw = C6(() => y.object({
        added: y.array(y.string()).describe("Names of servers that were added"),
        removed: y.array(y.string()).describe("Names of servers that were removed"),
        errors: y.record(y.string(), y.string()).describe("Map of server names to error messages for servers that failed to connect")
    }).describe("Result of a setMcpServers operation.")), Bh6 = C6(() => y.enum(["userSettings", "projectSettings", "localSettings", "session", "cliArg"])), Ji1 = C6(() => y.enum(["allow", "deny", "ask"])), OPz = C6(() => y.enum(["allow", "deny", "ask", "defer"])), Xi1 = C6(() => y.object({
        toolName: y.string(),
        ruleContent: y.string().optional()
    })), q18 = C6(() => y.discriminatedUnion("type", [y.object({
        type: y.literal("addRules"),
        rules: y.array(Xi1()),
        behavior: Ji1(),
        destination: Bh6()
    }), y.object({
        type: y.literal("replaceRules"),
        rules: y.array(Xi1()),
        behavior: Ji1(),
        destination: Bh6()
    }), y.object({
        type: y.literal("removeRules"),
        rules: y.array(Xi1()),
        behavior: Ji1(),
        destination: Bh6()
    }), y.object({
        type: y.literal("setMode"),
        mode: y.lazy(() => ss()),
        destination: Bh6()
    }), y.object({
        type: y.literal("addDirectories"),
        directories: y.array(y.string()),
        destination: Bh6()
    }), y.object({
        type: y.literal("removeDirectories"),
        directories: y.array(y.string()),
        destination: Bh6()
    })])), gC4 = C6(() => y.enum(["user_temporary", "user_permanent", "user_reject"]).describe("Classification of this permission decision for telemetry. SDK hosts that prompt users (desktop apps, IDEs) should set this to reflect what actually happened: user_temporary for allow-once, user_permanent for always-allow (both the click and later cache hits), user_reject for deny. If unset, the CLI infers conservatively (temporary for allow, reject for deny). The vocabulary matches tool_decision OTel events (monitoring-usage docs).")), YFw = C6(() => y.union([y.object({
        behavior: y.literal("allow"),
        updatedInput: y.record(y.string(), y.unknown()).optional(),
        updatedPermissions: y.array(q18()).optional(),
        toolUseID: y.string().optional(),
        decisionClassification: gC4().optional()
    }), y.object({
        behavior: y.literal("deny"),
        message: y.string(),
        interrupt: y.boolean().optional(),
        toolUseID: y.string().optional(),
        decisionClassification: gC4().optional()
    })])), ss = C6(() => y.enum(["default", "acceptEdits", "bypassPermissions", "plan", "dontAsk", "auto"]).describe("Permission mode for controlling how tool executions are handled. 'default' - Standard behavior, prompts for dangerous operations. 'acceptEdits' - Auto-accept file edit operations. 'bypassPermissions' - Bypass all permission checks (requires allowDangerouslySkipPermissions). 'plan' - Planning mode, no actual tool execution. 'dontAsk' - Don't prompt for permissions, deny if not pre-approved. 'auto' - Use a model classifier to approve/deny permission prompts.")), wPz = ["PreToolUse", "PostToolUse", "PostToolUseFailure", "Notification", "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop", "StopFailure", "SubagentStart", "SubagentStop", "PreCompact", "PostCompact", "PermissionRequest", "PermissionDenied", "Setup", "TeammateIdle", "TaskCreated", "TaskCompleted", "Elicitation", "ElicitationResult", "ConfigChange", "WorktreeCreate", "WorktreeRemove", "InstructionsLoaded", "CwdChanged", "FileChanged"], dC4 = C6(() => y.enum(wPz)), l2 = C6(() => y.object({
        session_id: y.string(),
        transcript_path: y.string(),
        cwd: y.string(),
        permission_mode: y.string().optional(),
        agent_id: y.string().optional().describe("Subagent identifier. Present only when the hook fires from within a subagent (e.g., a tool called by an AgentTool worker). Absent for the main thread, even in --agent sessions. Use this field (not agent_type) to distinguish subagent calls from main-thread calls."),
        agent_type: y.string().optional().describe('Agent type name (e.g., "general-purpose", "code-reviewer"). Present when the hook fires from within a subagent (alongside agent_id), or on the main thread of a session started with --agent (without agent_id).')
    })), $Pz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("PreToolUse"),
        tool_name: y.string(),
        tool_input: y.unknown(),
        tool_use_id: y.string()
    }))), jPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("PermissionRequest"),
        tool_name: y.string(),
        tool_input: y.unknown(),
        permission_suggestions: y.array(q18()).optional()
    }))), HPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("PostToolUse"),
        tool_name: y.string(),
        tool_input: y.unknown(),
        tool_response: y.unknown(),
        tool_use_id: y.string()
    }))), JPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("PostToolUseFailure"),
        tool_name: y.string(),
        tool_input: y.unknown(),
        tool_use_id: y.string(),
        error: y.string(),
        is_interrupt: y.boolean().optional()
    }))), XPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("PermissionDenied"),
        tool_name: y.string(),
        tool_input: y.unknown(),
        tool_use_id: y.string(),
        reason: y.string()
    }))), MPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("Notification"),
        message: y.string(),
        title: y.string().optional(),
        notification_type: y.string()
    }))), PPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("UserPromptSubmit"),
        prompt: y.string(),
        session_title: y.string().optional()
    }))), WPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("SessionStart"),
        source: y.enum(["startup", "resume", "clear", "compact"]),
        agent_type: y.string().optional(),
        model: y.string().optional()
    }))), DPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("Setup"),
        trigger: y.enum(["init", "maintenance"])
    }))), ZPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("Stop"),
        stop_hook_active: y.boolean(),
        last_assistant_message: y.string().optional().describe("Text content of the last assistant message before stopping. Avoids the need to read and parse the transcript file.")
    }))), fPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("StopFailure"),
        error: Di1(),
        error_details: y.string().optional(),
        last_assistant_message: y.string().optional()
    }))), GPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("SubagentStart"),
        agent_id: y.string(),
        agent_type: y.string()
    }))), vPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("SubagentStop"),
        stop_hook_active: y.boolean(),
        agent_id: y.string(),
        agent_transcript_path: y.string(),
        agent_type: y.string(),
        last_assistant_message: y.string().optional().describe("Text content of the last assistant message before stopping. Avoids the need to read and parse the transcript file.")
    }))), TPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("PreCompact"),
        trigger: y.enum(["manual", "auto"]),
        custom_instructions: y.string().nullable()
    }))), VPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("PostCompact"),
        trigger: y.enum(["manual", "auto"]),
        compact_summary: y.string().describe("The conversation summary produced by compaction")
    }))), kPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("TeammateIdle"),
        teammate_name: y.string(),
        team_name: y.string()
    }))), NPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("TaskCreated"),
        task_id: y.string(),
        task_subject: y.string(),
        task_description: y.string().optional(),
        teammate_name: y.string().optional(),
        team_name: y.string().optional()
    }))), EPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("TaskCompleted"),
        task_id: y.string(),
        task_subject: y.string(),
        task_description: y.string().optional(),
        teammate_name: y.string().optional(),
        team_name: y.string().optional()
    }))), yPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("Elicitation"),
        mcp_server_name: y.string(),
        message: y.string(),
        mode: y.enum(["form", "url"]).optional(),
        url: y.string().optional(),
        elicitation_id: y.string().optional(),
        requested_schema: y.record(y.string(), y.unknown()).optional()
    })).describe("Hook input for the Elicitation event. Fired when an MCP server requests user input. Hooks can auto-respond (accept/decline) instead of showing the dialog.")), LPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("ElicitationResult"),
        mcp_server_name: y.string(),
        elicitation_id: y.string().optional(),
        mode: y.enum(["form", "url"]).optional(),
        action: y.enum(["accept", "decline", "cancel"]),
        content: y.record(y.string(), y.unknown()).optional()
    })).describe("Hook input for the ElicitationResult event. Fired after the user responds to an MCP elicitation. Hooks can observe or override the response before it is sent to the server.")), hPz = ["user_settings", "project_settings", "local_settings", "policy_settings", "skills"], RPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("ConfigChange"),
        source: y.enum(hPz),
        file_path: y.string().optional()
    }))), SPz = ["session_start", "nested_traversal", "path_glob_match", "include", "compact"], CPz = ["User", "Project", "Local", "Managed"], bPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("InstructionsLoaded"),
        file_path: y.string(),
        memory_type: y.enum(CPz),
        load_reason: y.enum(SPz),
        globs: y.array(y.string()).optional(),
        trigger_file_path: y.string().optional(),
        parent_file_path: y.string().optional()
    }))), IPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("WorktreeCreate"),
        name: y.string()
    }))), xPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("WorktreeRemove"),
        worktree_path: y.string()
    }))), uPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("CwdChanged"),
        old_cwd: y.string(),
        new_cwd: y.string()
    }))), mPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("FileChanged"),
        file_path: y.string(),
        event: y.enum(["change", "add", "unlink"])
    }))), BPz = ["clear", "resume", "logout", "prompt_input_exit", "other", "bypass_permissions_disabled"], pPz = C6(() => y.enum(BPz)), FPz = C6(() => l2().and(y.object({
        hook_event_name: y.literal("SessionEnd"),
        reason: pPz()
    }))), cC4 = C6(() => y.union([$Pz(), HPz(), JPz(), XPz(), MPz(), PPz(), WPz(), FPz(), ZPz(), fPz(), GPz(), vPz(), TPz(), VPz(), jPz(), DPz(), kPz(), NPz(), EPz(), yPz(), LPz(), RPz(), bPz(), IPz(), xPz(), uPz(), mPz()])), gPz = C6(() => y.object({
        async: y.literal(!0),
        asyncTimeout: y.number().optional()
    })), UPz = C6(() => y.object({
        hookEventName: y.literal("PreToolUse"),
        permissionDecision: OPz().optional(),
        permissionDecisionReason: y.string().optional(),
        updatedInput: y.record(y.string(), y.unknown()).optional(),
        additionalContext: y.string().optional()
    })), QPz = C6(() => y.object({
        hookEventName: y.literal("UserPromptSubmit"),
        additionalContext: y.string().optional(),
        sessionTitle: y.string().optional()
    })), dPz = C6(() => y.object({
        hookEventName: y.literal("SessionStart"),
        additionalContext: y.string().optional(),
        initialUserMessage: y.string().optional(),
        watchPaths: y.array(y.string()).optional()
    })), cPz = C6(() => y.object({
        hookEventName: y.literal("Setup"),
        additionalContext: y.string().optional()
    })), lPz = C6(() => y.object({
        hookEventName: y.literal("SubagentStart"),
        additionalContext: y.string().optional()
    })), nPz = C6(() => y.object({
        hookEventName: y.literal("PostToolUse"),
        additionalContext: y.string().optional(),
        updatedMCPToolOutput: y.unknown().optional()
    })), iPz = C6(() => y.object({
        hookEventName: y.literal("PostToolUseFailure"),
        additionalContext: y.string().optional()
    })), rPz = C6(() => y.object({
        hookEventName: y.literal("PermissionDenied"),
        retry: y.boolean().optional()
    })), oPz = C6(() => y.object({
        hookEventName: y.literal("Notification"),
        additionalContext: y.string().optional()
    })), aPz = C6(() => y.object({
        hookEventName: y.literal("PermissionRequest"),
        decision: y.union([y.object({
            behavior: y.literal("allow"),
            updatedInput: y.record(y.string(), y.unknown()).optional(),
            updatedPermissions: y.array(q18()).optional()
        }), y.object({
            behavior: y.literal("deny"),
            message: y.string().optional(),
            interrupt: y.boolean().optional()
        })])
    })), sPz = C6(() => y.object({
        hookEventName: y.literal("CwdChanged"),
        watchPaths: y.array(y.string()).optional()
    })), tPz = C6(() => y.object({
        hookEventName: y.literal("FileChanged"),
        watchPaths: y.array(y.string()).optional()
    })), ePz = C6(() => y.object({
        continue: y.boolean().optional(),
        suppressOutput: y.boolean().optional(),
        stopReason: y.string().optional(),
        decision: y.enum(["approve", "block"]).optional(),
        systemMessage: y.string().optional(),
        reason: y.string().optional(),
        hookSpecificOutput: y.union([UPz(), QPz(), dPz(), cPz(), lPz(), nPz(), iPz(), rPz(), oPz(), aPz(), qWz(), KWz(), sPz(), tPz(), _Wz()]).optional()
    })), qWz = C6(() => y.object({
        hookEventName: y.literal("Elicitation"),
        action: y.enum(["accept", "decline", "cancel"]).optional(),
        content: y.record(y.string(), y.unknown()).optional()
    }).describe("Hook-specific output for the Elicitation event. Return this to programmatically accept or decline an MCP elicitation request.")), KWz = C6(() => y.object({
        hookEventName: y.literal("ElicitationResult"),
        action: y.enum(["accept", "decline", "cancel"]).optional(),
        content: y.record(y.string(), y.unknown()).optional()
    }).describe("Hook-specific output for the ElicitationResult event. Return this to override the action or content before the response is sent to the MCP server.")), _Wz = C6(() => y.object({
        hookEventName: y.literal("WorktreeCreate"),
        worktreePath: y.string()
    }).describe("Hook-specific output for the WorktreeCreate event. Provides the absolute path to the created worktree directory. Command hooks print the path on stdout instead.")), AFw = C6(() => y.union([gPz(), ePz()])), zWz = C6(() => y.object({
        key: y.string().describe("Unique key for this option, returned in the response"),
        label: y.string().describe("Display text for this option"),
        description: y.string().optional().describe("Optional description shown below the label")
    })), OFw = C6(() => y.object({
        prompt: y.string().describe("Request ID. Presence of this key marks the line as a prompt request."),
        message: y.string().describe("The prompt message to display to the user"),
        options: y.array(zWz()).describe("Available options for the user to choose from")
    })), wFw = C6(() => y.object({
        prompt_response: y.string().describe("The request ID from the corresponding prompt request"),
        selected: y.string().describe("The key of the selected option")
    })), Pi1 = C6(() => y.object({
        name: y.string().describe("Skill name (without the leading slash)"),
        description: y.string().describe("Description of what the skill does"),
        argumentHint: y.string().describe('Hint for skill arguments (e.g., "<file>")')
    }).describe("Information about an available skill (invoked via /command syntax).")), Wi1 = C6(() => y.object({
        name: y.string().describe('Agent type identifier (e.g., "Explore")'),
        description: y.string().describe("Description of when to use this agent"),
        model: y.string().optional().describe("Model alias this agent uses. If omitted, inherits the parent's model")
    }).describe("Information about an available subagent that can be invoked via the Task tool.")), lC4 = C6(() => y.object({
        value: y.string().describe("Model identifier to use in API calls"),
        displayName: y.string().describe("Human-readable display name"),
        description: y.string().describe("Description of the model's capabilities"),
        supportsEffort: y.boolean().optional().describe("Whether this model supports effort levels"),
        supportedEffortLevels: y.array(y.enum(["low", "medium", "high", "xhigh", "max"])).optional().describe("Available effort levels for this model"),
        supportsAdaptiveThinking: y.boolean().optional().describe("Whether this model supports adaptive thinking (Claude decides when and how much to think)"),
        supportsFastMode: y.boolean().optional().describe("Whether this model supports fast mode"),
        supportsAutoMode: y.boolean().optional().describe("Whether this model supports auto mode")
    }).describe("Information about an available model.")), nC4 = C6(() => y.object({
        email: y.string().optional(),
        organization: y.string().optional(),
        subscriptionType: y.string().optional(),
        tokenSource: y.string().optional(),
        apiKeySource: y.string().optional(),
        apiProvider: y.enum(["firstParty", "bedrock", "vertex", "foundry", "anthropicAws", "mantle"]).optional().describe('Active API backend. Anthropic OAuth login only applies when "firstParty"; for 3P providers the other fields are absent and auth is external (AWS creds, gcloud ADC, etc.).')
    }).describe("Information about the logged in user's account.")), YWz = C6(() => y.union([y.string(), y.record(y.string(), LI8())])), iC4 = C6(() => y.object({
        description: y.string().describe("Natural language description of when to use this agent"),
        tools: y.array(y.string()).optional().describe("Array of allowed tool names. If omitted, inherits all tools from parent"),
        disallowedTools: y.array(y.string()).optional().describe("Array of tool names to explicitly disallow for this agent"),
        prompt: y.string().describe("The agent's system prompt"),
        model: y.string().optional().describe("Model alias (e.g. 'sonnet', 'opus', 'haiku') or full model ID (e.g. 'claude-opus-4-5'). If omitted or 'inherit', uses the main model"),
        mcpServers: y.array(YWz()).optional(),
        criticalSystemReminder_EXPERIMENTAL: y.string().optional().describe("Experimental: Critical reminder added to system prompt"),
        skills: y.array(y.string()).optional().describe("Array of skill names to preload into the agent context"),
        initialPrompt: y.string().optional().describe("Auto-submitted as the first user turn when this agent is the main thread agent. Slash commands are processed. Prepended to any user-provided prompt."),
        maxTurns: y.number().int().positive().optional().describe("Maximum number of agentic turns (API round-trips) before stopping"),
        background: y.boolean().optional().describe("Run this agent as a background task (non-blocking, fire-and-forget) when invoked"),
        memory: y.enum(["user", "project", "local"]).optional().describe("Scope for auto-loading agent memory files. 'user' - ~/.claude/agent-memory/<agentType>/, 'project' - .claude/agent-memory/<agentType>/, 'local' - .claude/agent-memory-local/<agentType>/"),
        effort: y.union([y.enum(["low", "medium", "high", "xhigh", "max"]), y.number().int()]).optional().describe("Reasoning effort level for this agent. Either a named level or an integer"),
        permissionMode: ss().optional().describe("Permission mode controlling how tool executions are handled")
    }).describe("Definition for a custom subagent that can be invoked via the Agent tool.")), $Fw = C6(() => y.enum(["user", "project", "local"]).describe("Source for loading filesystem-based settings. 'user' - Global user settings (~/.claude/settings.json). 'project' - Project settings (.claude/settings.json). 'local' - Local settings (.claude/settings.local.json).")), jFw = C6(() => y.object({
        type: y.literal("local").describe("Plugin type. Currently only 'local' is supported"),
        path: y.string().describe("Absolute or relative path to the plugin directory")
    }).describe("Configuration for loading a plugin.")), HFw = C6(() => y.object({
        canRewind: y.boolean(),
        error: y.string().optional(),
        filesChanged: y.array(y.string()).optional(),
        insertions: y.number().optional(),
        deletions: y.number().optional()
    }).describe("Result of a rewindFiles operation.")), AWz = C6(() => y.unknown()), OWz = C6(() => y.unknown()), wWz = C6(() => y.unknown()), jA = C6(() => y.string()), rC4 = C6(() => y.unknown()), Di1 = C6(() => y.enum(["authentication_failed", "billing_error", "rate_limit", "invalid_request", "server_error", "unknown", "max_output_tokens"])), $Wz = C6(() => y.union([y.literal("compacting"), y.literal("requesting"), y.null()])), jWz = C6(() => y.discriminatedUnion("kind", [y.object({
        kind: y.literal("human")
    }), y.object({
        kind: y.literal("channel"),
        server: y.string()
    }), y.object({
        kind: y.literal("peer"),
        from: y.string(),
        name: y.string().optional()
    }), y.object({
        kind: y.literal("task-notification")
    }), y.object({
        kind: y.literal("coordinator")
    })]).describe("Provenance of a user-role message (peer session, team lead, channel). Absent or `human` means keyboard input from the user.")), oC4 = C6(() => y.object({
        type: y.literal("user"),
        message: AWz(),
        parent_tool_use_id: y.string().nullable(),
        isSynthetic: y.boolean().optional(),
        tool_use_result: y.unknown().optional(),
        priority: y.enum(["now", "next", "later"]).optional(),
        origin: jWz().optional(),
        shouldQuery: y.boolean().optional().describe("When false, the message is appended to the transcript without triggering an assistant turn. It will be merged into the next user message that does query."),
        timestamp: y.string().optional().describe("ISO timestamp when the message was created on the originating process. Older emitters omit it; consumers should fall back to receive time.")
    })), Zi1 = C6(() => oC4().extend({
        uuid: jA().optional(),
        session_id: y.string().optional()
    })), HWz = C6(() => oC4().extend({
        uuid: jA(),
        session_id: y.string(),
        isReplay: y.literal(!0),
        file_attachments: y.array(y.unknown()).optional()
    })), JWz = C6(() => y.object({
        status: y.enum(["allowed", "allowed_warning", "rejected"]),
        resetsAt: y.number().optional(),
        rateLimitType: y.enum(["five_hour", "seven_day", "seven_day_opus", "seven_day_sonnet", "overage"]).optional(),
        utilization: y.number().optional(),
        overageStatus: y.enum(["allowed", "allowed_warning", "rejected"]).optional(),
        overageResetsAt: y.number().optional(),
        overageDisabledReason: y.enum(["overage_not_provisioned", "org_level_disabled", "org_level_disabled_until", "out_of_credits", "seat_tier_level_disabled", "member_level_disabled", "seat_tier_zero_credit_limit", "group_zero_credit_limit", "member_zero_credit_limit", "org_service_level_disabled", "org_service_zero_credit_limit", "no_limits_configured", "unknown"]).optional(),
        isUsingOverage: y.boolean().optional(),
        surpassedThreshold: y.number().optional()
    }).describe("Rate limit information for claude.ai subscription users.")), XWz = C6(() => y.object({
        type: y.literal("assistant"),
        message: OWz(),
        parent_tool_use_id: y.string().nullable(),
        error: Di1().optional(),
        uuid: jA(),
        session_id: y.string()
    })), MWz = C6(() => y.object({
        type: y.literal("rate_limit_event"),
        rate_limit_info: JWz(),
        uuid: jA(),
        session_id: y.string()
    }).describe("Rate limit event emitted when rate limit info changes.")), aC4 = C6(() => y.object({
        tool_name: y.string(),
        tool_use_id: y.string(),
        tool_input: y.record(y.string(), y.unknown())
    })), PWz = C6(() => y.object({
        id: y.string(),
        name: y.string(),
        input: y.record(y.string(), y.unknown())
    })), sC4 = C6(() => y.enum(pC4).describe("Why the query loop terminated. Unset when the loop was bypassed (local slash command) or interrupted externally (budget/retry limits checked between yields).")), WWz = C6(() => y.object({
        type: y.literal("result"),
        subtype: y.literal("success"),
        duration_ms: y.number(),
        duration_api_ms: y.number(),
        is_error: y.boolean(),
        api_error_status: y.number().nullable().optional(),
        num_turns: y.number(),
        result: y.string(),
        stop_reason: y.string().nullable(),
        total_cost_usd: y.number(),
        usage: rC4(),
        modelUsage: y.record(y.string(), UC4()),
        permission_denials: y.array(aC4()),
        structured_output: y.unknown().optional(),
        deferred_tool_use: PWz().optional(),
        terminal_reason: sC4().optional(),
        fast_mode_state: K18().optional(),
        uuid: jA(),
        session_id: y.string()
    })), DWz = C6(() => y.object({
        type: y.literal("result"),
        subtype: y.enum(["error_during_execution", "error_max_turns", "error_max_budget_usd", "error_max_structured_output_retries"]),
        duration_ms: y.number(),
        duration_api_ms: y.number(),
        is_error: y.boolean(),
        num_turns: y.number(),
        stop_reason: y.string().nullable(),
        total_cost_usd: y.number(),
        usage: rC4(),
        modelUsage: y.record(y.string(), UC4()),
        permission_denials: y.array(aC4()),
        errors: y.array(y.string()),
        terminal_reason: sC4().optional(),
        fast_mode_state: K18().optional(),
        uuid: jA(),
        session_id: y.string()
    })), ZWz = C6(() => y.union([WWz(), DWz()])), tC4 = C6(() => y.object({
        file: y.string().optional().describe("Path to the settings file that failed to parse or validate."),
        path: y.string().describe("Dot-notation path to the field with the error, or empty string for whole-file errors."),
        message: y.string().describe("Human-readable error message.")
    }).describe("A settings file parse or validation error. When a settings.json file fails to parse (invalid JSON, JSON comments, schema mismatch), the file is skipped and any rules it contained — including permission allow/deny lists — are not applied.")), fWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("init"),
        agents: y.array(y.string()).optional(),
        apiKeySource: aMz(),
        betas: y.array(y.string()).optional(),
        claude_code_version: y.string(),
        cwd: y.string(),
        tools: y.array(y.string()),
        mcp_servers: y.array(y.object({
            name: y.string(),
            status: y.string()
        })),
        model: y.string(),
        permissionMode: ss(),
        slash_commands: y.array(y.string()),
        output_style: y.string(),
        skills: y.array(y.string()),
        plugins: y.array(y.object({
            name: y.string(),
            path: y.string(),
            source: y.string().optional().describe('@internal Plugin source identifier in "name\\@marketplace" format. Sentinels: "name\\@inline" for --plugin-dir, "name\\@builtin" for built-in plugins.')
        })),
        plugin_errors: y.array(y.object({
            plugin: y.string(),
            type: y.string(),
            message: y.string()
        })).optional().describe("@internal Plugin load-time errors (e.g., unsatisfied dependency version). Affected plugins are demoted and absent from `plugins[]`. The key is omitted when there are no errors; CI can fail on `(plugin_errors?.length ?? 0) > 0`."),
        fast_mode_state: K18().optional(),
        memory_paths: y.object({
            auto: y.string().optional(),
            team: y.string().optional()
        }).optional().describe("@internal Absolute directory paths for the auto-memory and team-memory stores. Lets SDK renderers classify Read/Write/Edit tool calls on these paths as memory operations without re-implementing CLI path detection."),
        uuid: jA(),
        session_id: y.string()
    })), GWz = C6(() => y.object({
        type: y.literal("stream_event"),
        event: wWz(),
        parent_tool_use_id: y.string().nullable(),
        uuid: jA(),
        session_id: y.string(),
        ttft_ms: y.number().optional()
    })), vWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("compact_boundary"),
        compact_metadata: y.object({
            trigger: y.enum(["manual", "auto"]),
            pre_tokens: y.number(),
            post_tokens: y.number().optional(),
            duration_ms: y.number().optional(),
            preserved_segment: y.object({
                head_uuid: jA(),
                anchor_uuid: jA(),
                tail_uuid: jA()
            }).optional().describe("Relink info for messagesToKeep. Loaders splice the preserved segment at anchor_uuid (summary for suffix-preserving, boundary for prefix-preserving partial compact) so resume includes preserved content. Unset when compaction summarizes everything (no messagesToKeep).")
        }),
        uuid: jA(),
        session_id: y.string()
    })), TWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("status"),
        status: $Wz(),
        permissionMode: ss().optional(),
        compact_result: y.enum(["success", "failed"]).optional(),
        compact_error: y.string().optional(),
        uuid: jA(),
        session_id: y.string()
    })), eC4 = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("post_turn_summary"),
        summarizes_uuid: y.string(),
        status_category: y.enum(["blocked", "completed", "review_ready"]),
        status_detail: y.string(),
        title: y.string(),
        description: y.string(),
        recent_action: y.string(),
        needs_action: y.string(),
        uuid: jA(),
        session_id: y.string()
    }).describe("@internal Background post-turn summary emitted after each assistant turn. summarizes_uuid points to the assistant message this summarizes.")), qb4 = C6(() => y.object({
        type: y.literal("transcript_mirror"),
        filePath: y.string(),
        entries: y.array(y.unknown())
    }).describe("@internal Emitted after each successful local transcript write. The parent peels these off the stdout stream and batches them to the SessionStore adapter. Not exposed to public SDK consumers.")), JFw = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("mirror_error"),
        error: y.string(),
        key: y.object({
            projectKey: y.string(),
            sessionId: y.string(),
            subpath: y.string().optional()
        }),
        uuid: jA(),
        session_id: y.string()
    }).describe("@internal Emitted when SessionStore.append() rejects or times out for a transcript-mirror batch. The batch is dropped (at-most-once delivery); this surfaces the failure so consumers are not silent on data loss.")), VWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("api_retry"),
        attempt: y.number(),
        max_retries: y.number(),
        retry_delay_ms: y.number(),
        error_status: y.number().nullable(),
        error: Di1(),
        uuid: jA(),
        session_id: y.string()
    }).describe("Emitted when an API request fails with a retryable error and will be retried after a delay. error_status is null for connection errors (e.g. timeouts) that had no HTTP response.")), kWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("local_command_output"),
        content: y.string(),
        uuid: jA(),
        session_id: y.string()
    }).describe("Output from a local slash command (e.g. /voice, /cost). Displayed as assistant-style text in the transcript.")), NWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("hook_started"),
        hook_id: y.string(),
        hook_name: y.string(),
        hook_event: y.string(),
        uuid: jA(),
        session_id: y.string()
    })), EWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("hook_progress"),
        hook_id: y.string(),
        hook_name: y.string(),
        hook_event: y.string(),
        stdout: y.string(),
        stderr: y.string(),
        output: y.string(),
        uuid: jA(),
        session_id: y.string()
    })), yWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("hook_response"),
        hook_id: y.string(),
        hook_name: y.string(),
        hook_event: y.string(),
        output: y.string(),
        stdout: y.string(),
        stderr: y.string(),
        exit_code: y.number().optional(),
        outcome: y.enum(["success", "error", "cancelled"]),
        uuid: jA(),
        session_id: y.string()
    })), LWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("plugin_install"),
        status: y.enum(["started", "installed", "failed", "completed"]),
        name: y.string().optional(),
        error: y.string().optional(),
        uuid: jA(),
        session_id: y.string()
    }).describe("Headless plugin installation progress (CLAUDE_CODE_SYNC_PLUGIN_INSTALL). started/completed bracket the whole install; installed/failed carry a per-marketplace name.")), hWz = C6(() => y.object({
        type: y.literal("tool_progress"),
        tool_use_id: y.string(),
        tool_name: y.string(),
        parent_tool_use_id: y.string().nullable(),
        elapsed_time_seconds: y.number(),
        task_id: y.string().optional(),
        uuid: jA(),
        session_id: y.string()
    })), RWz = C6(() => y.object({
        type: y.literal("auth_status"),
        isAuthenticating: y.boolean(),
        output: y.array(y.string()),
        error: y.string().optional(),
        uuid: jA(),
        session_id: y.string()
    })), SWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("files_persisted"),
        files: y.array(y.object({
            filename: y.string(),
            file_id: y.string()
        })),
        failed: y.array(y.object({
            filename: y.string(),
            error: y.string()
        })),
        processed_at: y.string(),
        uuid: jA(),
        session_id: y.string()
    })), CWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("task_notification"),
        task_id: y.string(),
        tool_use_id: y.string().optional(),
        status: y.enum(["completed", "failed", "stopped"]),
        output_file: y.string(),
        summary: y.string(),
        usage: y.object({
            total_tokens: y.number(),
            tool_uses: y.number(),
            duration_ms: y.number()
        }).optional(),
        skip_transcript: y.boolean().optional(),
        uuid: jA(),
        session_id: y.string()
    })), bWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("task_started"),
        task_id: y.string(),
        tool_use_id: y.string().optional(),
        description: y.string(),
        task_type: y.string().optional(),
        workflow_name: y.string().optional().describe("meta.name from the workflow script (e.g. 'spec'). Only set when task_type is 'local_workflow'."),
        prompt: y.string().optional(),
        skip_transcript: y.boolean().optional().describe("Ambient/housekeeping task. Consumers should hide this from the inline transcript; it may still appear in a tasks panel."),
        uuid: jA(),
        session_id: y.string()
    })), IWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("task_updated"),
        task_id: y.string(),
        patch: y.object({
            status: y.enum(["pending", "running", "completed", "failed", "killed"]).optional(),
            description: y.string().optional(),
            end_time: y.number().optional(),
            total_paused_ms: y.number().optional(),
            error: y.string().optional(),
            is_backgrounded: y.boolean().optional()
        }).describe("Wire-safe subset of TaskState fields that changed. Excludes abortController, unregisterCleanup, messages, result. Clients merge into their local task map."),
        uuid: jA(),
        session_id: y.string()
    })), xWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("session_state_changed"),
        state: y.enum(["idle", "running", "requires_action"]),
        uuid: jA(),
        session_id: y.string()
    }).describe("Mirrors notifySessionStateChanged. 'idle' fires after heldBackResult flushes and the bg-agent do-while exits — authoritative turn-over signal.")), uWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("notification"),
        key: y.string(),
        text: y.string(),
        priority: y.enum(["low", "medium", "high", "immediate"]),
        color: y.string().optional(),
        timeout_ms: y.number().optional(),
        uuid: jA(),
        session_id: y.string()
    }).describe("Loop-side text notification. Mirrors the interactive REPL notification queue (key/priority/timeout). JSX notifications are not emitted on this channel.")), mWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("task_progress"),
        task_id: y.string(),
        tool_use_id: y.string().optional(),
        description: y.string(),
        usage: y.object({
            total_tokens: y.number(),
            tool_uses: y.number(),
            duration_ms: y.number()
        }),
        last_tool_name: y.string().optional(),
        summary: y.string().optional(),
        uuid: jA(),
        session_id: y.string()
    })), BWz = C6(() => y.object({
        type: y.literal("tool_use_summary"),
        summary: y.string(),
        preceding_tool_use_ids: y.array(y.string()),
        uuid: jA(),
        session_id: y.string()
    })), pWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("memory_recall"),
        mode: y.enum(["select", "synthesize"]).describe("How memories were surfaced: 'select' returns full file bodies chosen by the parallel selector; 'synthesize' returns a Sonnet-authored paragraph distilled from many tiny memories."),
        memories: y.array(y.object({
            path: y.string().describe("Absolute path to the memory file, or a synthesis sentinel of the form `<synthesis:DIR>` when mode is 'synthesize'."),
            scope: y.enum(["personal", "team"]),
            content: y.string().optional().describe("Synthesis paragraph. Only present when mode is 'synthesize'; always absent for 'select' (renderers lazy-load from path).")
        })),
        uuid: jA(),
        session_id: y.string()
    }).describe('Emitted when the memory recall supervisor surfaces relevant memories into the turn. Mirrors the CLI relevant_memories attachment so SDK renderers can show "Recalled from memory" inline.')), FWz = C6(() => y.object({
        type: y.literal("system"),
        subtype: y.literal("elicitation_complete"),
        mcp_server_name: y.string(),
        elicitation_id: y.string(),
        uuid: jA(),
        session_id: y.string()
    }).describe("Emitted when an MCP server confirms that a URL-mode elicitation is complete.")), gWz = C6(() => y.object({
        type: y.literal("prompt_suggestion"),
        suggestion: y.string(),
        uuid: jA(),
        session_id: y.string()
    }).describe("Predicted next user prompt, emitted after each turn when promptSuggestions is enabled.")), XFw = C6(() => y.object({
        sessionId: y.string().describe("Unique session identifier (UUID)."),
        summary: y.string().describe("Display title for the session: custom title, auto-generated summary, or first prompt."),
        lastModified: y.number().describe("Last modified time in milliseconds since epoch."),
        fileSize: y.number().optional().describe("File size in bytes. Only populated for local JSONL storage."),
        customTitle: y.string().optional().describe("User-set session title via /rename."),
        firstPrompt: y.string().optional().describe("First meaningful user prompt in the session."),
        gitBranch: y.string().optional().describe("Git branch at the end of the session."),
        cwd: y.string().optional().describe("Working directory for the session."),
        tag: y.string().optional().describe("User-set session tag."),
        createdAt: y.number().optional().describe("Creation time in milliseconds since epoch, extracted from the first entry's timestamp.")
    }).describe("Session metadata returned by listSessions and getSessionInfo.")), Kb4 = C6(() => y.union([XWz(), Zi1(), HWz(), ZWz(), fWz(), GWz(), vWz(), TWz(), VWz(), kWz(), NWz(), EWz(), yWz(), LWz(), hWz(), RWz(), CWz(), bWz(), IWz(), mWz(), xWz(), uWz(), SWz(), BWz(), pWz(), MWz(), FWz(), gWz()])), K18 = C6(() => y.enum(["off", "cooldown", "on"]).describe("Fast mode state: off, in cooldown after rate limit, or actively enabled."))
})
// @from(Ln 262926, Col 0)
function op(q, K) {
    return `${q}@${K}`
}
// @from(Ln 262930, Col 0)
function _18(q) {
    let K = q.indexOf("@");
    if (K === -1) return null;
    return {
        agentName: q.slice(0, K),
        teamName: q.slice(K + 1)
    }
}
// @from(Ln 262939, Col 0)
function ph6(q, K) {
    let _ = Date.now();
    return `${q}-${_}@${K}`
}
// @from(Ln 262944, Col 0)
function gh6() {
    return `claude-swarm-${process.pid}`
}
// @from(Ln 262947, Col 4)
Mz = "team-lead"
// @from(Ln 262948, Col 4)
Ny = "claude-swarm"
// @from(Ln 262949, Col 4)
Fh6 = "swarm-view"
// @from(Ln 262950, Col 4)
mD = "tmux"
// @from(Ln 262951, Col 4)
Gi1 = "claude-hidden"
// @from(Ln 262952, Col 4)
Uh6 = "CLAUDE_CODE_TEAMMATE_COMMAND"
// @from(Ln 262953, Col 4)
$b4 = {}
// @from(Ln 263005, Col 0)
function eH6(q, K) {
    let _ = K || Z9() || "default",
        z = Wh6(_),
        Y = Wh6(q),
        A = vi1(ID6(), z, "inboxes"),
        O = vi1(A, `${Y}.json`);
    return E(`[TeammateMailbox] getInboxPath: agent=${q}, team=${_}, fullPath=${O}`), O
}
// @from(Ln 263013, Col 0)
async function dWz(q) {
    let K = q || Z9() || "default",
        _ = Wh6(K),
        z = vi1(ID6(), _, "inboxes");
    await UWz(z, {
        recursive: !0
    }), E(`[TeammateMailbox] Ensured inbox directory: ${z}`)
}
// @from(Ln 263021, Col 0)
async function ts(q, K) {
    let _ = eH6(q, K);
    E(`[TeammateMailbox] readMailbox: path=${_}`);
    try {
        let z = await QWz(_, "utf-8"),
            Y = n8(z);
        return E(`[TeammateMailbox] readMailbox: read ${Y.length} message(s)`), Y
    } catch (z) {
        if (Q1(z) === "ENOENT") return E("[TeammateMailbox] readMailbox: file does not exist"), [];
        return E(`Failed to read inbox for ${q}: ${z}`), j6(z), []
    }
}
// @from(Ln 263033, Col 0)
async function qJ6(q, K) {
    let _ = await ts(q, K),
        z = _.filter((Y) => !Y.read);
    return E(`[TeammateMailbox] readUnreadMessages: ${z.length} unread of ${_.length} total`), z
}