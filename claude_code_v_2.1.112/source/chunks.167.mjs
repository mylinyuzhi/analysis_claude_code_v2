
// @from(Ln 432696, Col 0)
function tbK({
    abortSignal: q,
    messages: K,
    initialDescription: _,
    onDone: z,
    backgroundTasks: Y = {}
}) {
    let [A, O] = RS.useState("userInput"), [w, $] = RS.useState(0), [j, H] = RS.useState(_ ?? ""), [J, X] = RS.useState(null), [M, P] = RS.useState(null), [W, D] = RS.useState({
        isGit: !1,
        gitState: null
    }), [Z, G] = RS.useState(null), f = s1().columns - 4;
    RS.useEffect(() => {
        async function R() {
            let h = await qX(),
                C = null;
            if (h) C = await dA1();
            D({
                isGit: h,
                gitState: C
            })
        }
        R()
    }, []);
    let v = RS.useCallback(async () => {
            O("submitting"), P(null), X(null);
            let R = rbK(),
                C = fM(K)?.requestId ?? null,
                [x, B] = await Promise.all([LA7(), XyY()]),
                m = yA7(Y),
                S = {
                    ...x,
                    ...m
                },
                F = {
                    latestAssistantMessageId: C,
                    message_count: K.length,
                    datetime: new Date().toISOString(),
                    description: j,
                    platform: X7.platform,
                    gitRepo: W.isGit,
                    terminal: X7.terminal,
                    version: {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.112",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-04-16T18:33:19Z"
                    }.VERSION,
                    transcript: K0(K),
                    errors: R,
                    lastApiRequest: V81(),
                    ...Object.keys(S).length > 0 && {
                        subagentTranscripts: S
                    },
                    ...B && {
                        rawTranscriptJsonl: B
                    }
                },
                [U, g] = await Promise.all([sbK(F, q), PyY(j, q)]),
                c = U;
            if (!c.success && c.payloadTooLarge) {
                let {
                    transcript: n,
                    subagentTranscripts: l,
                    lastApiRequest: z6,
                    rawTranscriptJsonl: A6,
                    ...e
                } = F;
                c = await sbK({
                    ...e,
                    transcript: []
                }, q)
            }
            if (G(g), c.success) {
                if (c.feedbackId) X(c.feedbackId), d("tengu_bug_report_submitted", {
                    retried_after_too_large: String(!U.success && U.payloadTooLarge === !0),
                    feedback_id: c.feedbackId,
                    last_assistant_message_id: C
                }), co6("tengu_bug_report_description", {
                    feedback_id: c.feedbackId,
                    description: fu(j)
                });
                O("done")
            } else {
                if (c.failureReason) d("tengu_bug_report_failed", {
                    reason: c.failureReason,
                    status_code: String(c.statusCode ?? ""),
                    first_attempt_too_large: String(!U.success && U.payloadTooLarge === !0)
                });
                if (c.isZdrOrg) P("Feedback collection is not available for organizations with custom data retention policies.");
                else P("Could not submit feedback. Please try again later.");
                O("userInput")
            }
        }, [j, W.isGit, K]),
        V = RS.useCallback(() => {
            z("Feedback / bug report cancelled", {
                display: "system"
            })
        }, [z]);
    G1("confirm:no", V, {
        context: "Settings",
        isActive: A === "userInput"
    });
    let k = A === "done" || M && A !== "userInput";

    function N(R) {
        if (R.ctrl || R.meta) return;
        if (A === "done") {
            if (R.preventDefault(), R.key === "return" && Z) {
                let h = MyY(J ?? "", Z, j, rbK());
                J3(h)
            }
            if (M) z("Error submitting feedback / bug report", {
                display: "system"
            });
            else z("Feedback / bug report submitted", {
                display: "system"
            });
            return
        }
        if (M && A !== "userInput") {
            R.preventDefault(), z("Error submitting feedback / bug report", {
                display: "system"
            });
            return
        }
        if (A === "consent" && (R.key === "return" || R.key === " ")) R.preventDefault(), v()
    }
    return A4.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: N
    }, A4.createElement(R1, {
        title: "Submit Feedback / Bug Report",
        onCancel: V,
        isCancelActive: A !== "userInput" && !k,
        inputGuide: (R) => R.pending ? A4.createElement(T, null, "Press ", R.keyName, " again to exit") : A === "userInput" ? A4.createElement(z1, null, A4.createElement(A8, {
            chord: "enter",
            action: "continue"
        }), A4.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })) : A === "consent" ? A4.createElement(z1, null, A4.createElement(A8, {
            chord: "enter",
            action: "submit"
        }), A4.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })) : null
    }, A === "userInput" && A4.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, A4.createElement(T, null, "Describe the issue below:"), A4.createElement(l4, {
        value: j,
        onChange: (R) => {
            if (H(R), M) P(null)
        },
        columns: f,
        onSubmit: () => {
            P(null), O("consent")
        },
        onExitMessage: () => z("Feedback cancelled", {
            display: "system"
        }),
        cursorOffset: w,
        onChangeCursorOffset: $,
        showCursor: !0
    }), M && A4.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, A4.createElement(T, {
        color: "error"
    }, M), A4.createElement(T, {
        dimColor: !0
    }, "Edit and press Enter to retry, or Esc to cancel"))), A === "consent" && A4.createElement(u, {
        flexDirection: "column"
    }, A4.createElement(T, null, "This report will include:"), A4.createElement(u, {
        marginLeft: 2,
        flexDirection: "column"
    }, A4.createElement(T, null, "- Your feedback / bug description:", " ", A4.createElement(T, {
        dimColor: !0
    }, j)), A4.createElement(T, null, "- Environment info:", " ", A4.createElement(T, {
        dimColor: !0
    }, X7.platform, ", ", X7.terminal, ", v", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.112",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-04-16T18:33:19Z"
    }.VERSION)), W.gitState && A4.createElement(T, null, "- Git repo metadata:", " ", A4.createElement(T, {
        dimColor: !0
    }, W.gitState.branchName, W.gitState.commitHash ? `, ${W.gitState.commitHash.slice(0,7)}` : "", W.gitState.remoteUrl ? ` @ ${W.gitState.remoteUrl}` : "", !W.gitState.isHeadOnRemote && ", not synced", !W.gitState.isClean && ", has local changes")), A4.createElement(T, null, "- Current session transcript")), A4.createElement(u, {
        marginTop: 1
    }, A4.createElement(T, {
        wrap: "wrap",
        dimColor: !0
    }, "We will use your feedback to debug related issues or to improve", " ", "Claude Code's functionality (eg. to reduce the risk of bugs occurring in the future).")), A4.createElement(u, {
        marginTop: 1
    }, A4.createElement(T, null, "Press ", A4.createElement(T, {
        bold: !0
    }, "Enter"), " to confirm and submit."))), A === "submitting" && A4.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, A4.createElement(T, null, "Submitting report…")), A === "done" && A4.createElement(u, {
        flexDirection: "column"
    }, M ? A4.createElement(T, {
        color: "error"
    }, M) : A4.createElement(T, {
        color: "success"
    }, "Thank you for your report!"), J && A4.createElement(T, {
        dimColor: !0
    }, "Feedback ID: ", J), A4.createElement(u, {
        marginTop: 1
    }, A4.createElement(T, null, "Press "), A4.createElement(T, {
        bold: !0
    }, "Enter "), A4.createElement(T, null, "to open your browser and draft a GitHub issue, or any other key to close.")))))
}
// @from(Ln 432921, Col 0)
function MyY(q, K, _, z) {
    let Y = fu(K),
        O = `**Bug Description**
${fu(_)}

**Environment Info**
- Platform: ${X7.platform}
- Terminal: ${X7.terminal}
- Version: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION||"unknown"}
- Feedback ID: ${q}

**Errors**
\`\`\`json
`,
        w = "\n```\n",
        $ = I6(z),
        j = `${$yY}/new?title=${encodeURIComponent(Y)}&labels=user-reported,bug&body=`,
        H = `
**Note:** Content was truncated.
`,
        J = encodeURIComponent(O),
        X = encodeURIComponent("\n```\n"),
        M = encodeURIComponent(`
**Note:** Content was truncated.
`),
        P = encodeURIComponent($),
        W = ibK - j.length - J.length - X.length - M.length;
    if (W <= 0) {
        let v = encodeURIComponent("…"),
            V = 50,
            k = ibK - j.length - v.length - M.length - 50,
            N = O + $ + "\n```\n",
            R = encodeURIComponent(N);
        if (R.length > k) {
            R = R.slice(0, k);
            let h = R.lastIndexOf("%");
            if (h >= R.length - 2) R = R.slice(0, h)
        }
        return j + R + v + M
    }
    if (P.length <= W) return j + J + P + X;
    let D = encodeURIComponent("…"),
        Z = 50,
        G = P.slice(0, W - D.length - Z),
        f = G.lastIndexOf("%");
    if (f >= G.length - 2) G = G.slice(0, f);
    return j + J + G + D + X + M
}
// @from(Ln 432969, Col 0)
async function PyY(q, K) {
    try {
        let _ = await ov({
                systemPrompt: sK(["Generate a concise, technical issue title (max 80 chars) for a public GitHub issue based on this bug report for Claude Code.", "Claude Code is an agentic coding CLI based on the Anthropic API.", "The title should:", "- Include the type of issue [Bug] or [Feature Request] as the first thing in the title", "- Be concise, specific and descriptive of the actual problem", "- Use technical terminology appropriate for a software issue", '- For error messages, extract the key error (e.g., "Missing Tool Result Block" rather than the full message)', "- Be direct and clear for developers to understand the problem", '- If you cannot determine a clear issue, use "Bug Report: [brief description]"', "- Any LLM API errors are from the Anthropic API, not from any other model provider", "Your response will be directly used as the title of the Github issue, and as such should not contain any other commentary or explaination", 'Examples of good titles include: "[Bug] Auto-Compact triggers to soon", "[Bug] Anthropic API Error: Missing Tool Result Block", "[Bug] Error: Invalid Model Name for Opus"']),
                userPrompt: q,
                signal: K,
                options: {
                    hasAppendSystemPrompt: !1,
                    toolChoice: void 0,
                    isNonInteractiveSession: !1,
                    agents: [],
                    querySource: "feedback",
                    mcpTools: []
                }
            }),
            z = _.message.content[0]?.type === "text" ? _.message.content[0].text : "Bug Report";
        if (fp(z)) return abK(q);
        return z
    } catch (_) {
        return j6(_), abK(q)
    }
}
// @from(Ln 432992, Col 0)
function abK(q) {
    let K = oY(q);
    if (K.length <= 60 && K.length > 5) return K;
    let _ = K.slice(0, 60);
    if (K.length > 60) {
        let z = _.lastIndexOf(" ");
        if (z > 30) _ = _.slice(0, z);
        _ += "..."
    }
    return _.length < 10 ? "Bug Report" : _
}
// @from(Ln 433004, Col 0)
function Rn8(q) {
    if (q instanceof Error) {
        let K = Error(fu(q.message));
        if (q.stack) K.stack = fu(q.stack);
        j6(K)
    } else {
        let K = fu(String(q));
        j6(Error(K))
    }
}
// @from(Ln 433014, Col 0)
async function sbK(q, K) {
    if (o3()) return {
        success: !1
    };
    let _ = 0;
    try {
        let z = hn8(q, jyY, HyY);
        if (_ = z.length, _ > obK) return {
            success: !1,
            payloadTooLarge: !0,
            failureReason: "payload_too_large_precheck"
        };
        await _Y();
        let Y = OH();
        if (Y.error) return {
            success: !1,
            failureReason: "auth_error"
        };
        let A = {
                "Content-Type": "application/json",
                "User-Agent": OI(),
                ...Y.headers
            },
            O = await Z1.post("https://api.anthropic.com/api/claude_cli_feedback", z, {
                headers: A,
                timeout: 30000,
                signal: K
            });
        if (O.status === 200) {
            let w = O.data;
            if (w?.feedback_id) return {
                success: !0,
                feedbackId: w.feedback_id
            };
            return Rn8(Error("Failed to submit feedback: request did not return feedback_id")), {
                success: !1,
                failureReason: "missing_feedback_id"
            }
        }
        return Rn8(Error("Failed to submit feedback:" + O.status)), {
            success: !1,
            failureReason: "http_error",
            statusCode: O.status
        }
    } catch (z) {
        if (Z1.isCancel(z)) return {
            success: !1
        };
        if (z instanceof RangeError) return {
            success: !1,
            payloadTooLarge: !0,
            failureReason: "payload_too_large_range_error"
        };
        if (Z1.isAxiosError(z)) {
            if (z.response?.status === 413) return {
                success: !1,
                payloadTooLarge: !0,
                failureReason: "payload_too_large_413",
                statusCode: 413
            };
            if (z.code === "ECONNABORTED" && _ > obK / 8) return {
                success: !1,
                payloadTooLarge: !0,
                failureReason: "payload_too_large_timeout"
            }
        }
        if (Z1.isAxiosError(z) && z.response?.status === 403) {
            let Y = z.response.data;
            if (Y?.error?.type === "permission_error" && Y?.error?.message?.includes("Custom data retention settings")) return Rn8(Error("Cannot submit feedback because custom data retention settings are enabled")), {
                success: !1,
                isZdrOrg: !0,
                failureReason: "zdr_org",
                statusCode: 403
            }
        }
        if (Rn8(z), Z1.isAxiosError(z) && z.response) return {
            success: !1,
            failureReason: "http_error",
            statusCode: z.response.status
        };
        return {
            success: !1,
            failureReason: Z1.isAxiosError(z) && z.code === "ECONNABORTED" ? "timeout" : "network_error"
        }
    }
}
// @from(Ln 433100, Col 4)
A4
// @from(Ln 433100, Col 8)
RS
// @from(Ln 433100, Col 12)
ibK = 7250
// @from(Ln 433101, Col 4)
$yY = "https://github.com/anthropics/claude-code/issues"
// @from(Ln 433102, Col 4)
jyY
// @from(Ln 433102, Col 9)
HyY
// @from(Ln 433102, Col 14)
JyY = 4194304
// @from(Ln 433103, Col 4)
obK = 8388608
// @from(Ln 433104, Col 4)
EA7 = L(() => {
    CK();
    y8();
    BB();
    C8();
    _7();
    I4();
    g6();
    C7();
    O2();
    rv();
    T7();
    Nj();
    NA7();
    D_();
    Yq();
    pK();
    Zf();
    U8();
    G$();
    g4();
    e8();
    bK();
    Nq();
    S4();
    u7();
    NY();
    A4 = K6(P6(), 1), RS = K6(P6(), 1), jyY = new Set(["transcript"]), HyY = new Set(["subagentTranscripts"])
})
// @from(Ln 433133, Col 4)
KIK = {}
// @from(Ln 433140, Col 0)
function ebK() {
    if (S6(process.env.CLAUDE_CODE_USE_BEDROCK)) return `/feedback is not available when using Amazon Bedrock. Report issues at ${Sn8}`;
    if (S6(process.env.CLAUDE_CODE_USE_VERTEX)) return `/feedback is not available when using Vertex AI. Report issues at ${Sn8}`;
    if (S6(process.env.CLAUDE_CODE_USE_FOUNDRY)) return `/feedback is not available when using Microsoft Foundry. Report issues at ${Sn8}`;
    if (S6(process.env.DISABLE_FEEDBACK_COMMAND)) return "/feedback has been disabled via the DISABLE_FEEDBACK_COMMAND environment variable";
    if (S6(process.env.DISABLE_BUG_COMMAND)) return "/feedback has been disabled via the DISABLE_BUG_COMMAND environment variable";
    if (o3()) return "/feedback has been disabled via the CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC environment variable";
    if (!N5("allow_product_feedback")) return "/feedback has been disabled by your organization's policy";
    if (OH().error) return `/feedback requires Anthropic credentials (OAuth or API key). Report issues at ${Sn8}`;
    return null
}
// @from(Ln 433152, Col 0)
function qIK(q, K, _, z = "", Y = {}) {
    return hA7.createElement(tbK, {
        abortSignal: K,
        messages: _,
        initialDescription: z,
        onDone: q,
        backgroundTasks: Y
    })
}
// @from(Ln 433161, Col 0)
async function WyY(q, K, _) {
    let z = ebK();
    if (z) return q(z), null;
    let Y = _ || "";
    return qIK(q, K.abortController.signal, K.messages, Y)
}
// @from(Ln 433167, Col 4)
hA7
// @from(Ln 433167, Col 9)
Sn8 = "https://github.com/anthropics/claude-code/issues"
// @from(Ln 433168, Col 4)
_IK = L(() => {
    EA7();
    J2();
    Q8();
    Zf();
    G$();
    hA7 = K6(P6(), 1)
})
// @from(Ln 433176, Col 4)
DyY
// @from(Ln 433176, Col 9)
RA7
// @from(Ln 433177, Col 4)
zIK = L(() => {
    DyY = {
        aliases: ["bug"],
        type: "local-jsx",
        name: "feedback",
        description: "Submit feedback about Claude Code",
        argumentHint: "[report]",
        isEnabled: () => !0,
        load: () => Promise.resolve().then(() => (_IK(), KIK))
    }, RA7 = DyY
})
// @from(Ln 433188, Col 0)
class F98 {
    paths = [];
    lowerPaths = [];
    charBits = new Int32Array(0);
    pathLens = new Uint16Array(0);
    topLevelCache = null;
    readyCount = 0;
    loadFromFileList(q) {
        let K = new Set,
            _ = [];
        for (let z of q)
            if (z.length > 0 && !K.has(z)) K.add(z), _.push(z);
        this.buildIndex(_)
    }
    loadFromFileListAsync(q) {
        let K = () => {},
            _ = new Promise((Y) => {
                K = Y
            }),
            z = this.buildAsync(q, K);
        return {
            queryable: _,
            done: z
        }
    }
    async buildAsync(q, K) {
        let _ = new Set,
            z = [],
            Y = performance.now();
        for (let O = 0; O < q.length; O++) {
            let w = q[O];
            if (w.length > 0 && !_.has(w)) _.add(w), z.push(w);
            if ((O & 255) === 255 && performance.now() - Y > 4) await bn8(), Y = performance.now()
        }
        this.resetArrays(z), Y = performance.now();
        let A = !0;
        for (let O = 0; O < z.length; O++)
            if (this.indexPath(O), (O & 255) === 255 && performance.now() - Y > 4) {
                if (this.readyCount = O + 1, A) K(), A = !1;
                await bn8(), Y = performance.now()
            } this.readyCount = z.length, K()
    }
    buildIndex(q) {
        this.resetArrays(q);
        for (let K = 0; K < q.length; K++) this.indexPath(K);
        this.readyCount = q.length
    }
    resetArrays(q) {
        let K = q.length;
        this.paths = q, this.lowerPaths = Array(K), this.charBits = new Int32Array(K), this.pathLens = new Uint16Array(K), this.readyCount = 0, this.topLevelCache = vyY(q, 100)
    }
    indexPath(q) {
        let K = this.paths[q].toLowerCase();
        this.lowerPaths[q] = K;
        let _ = K.length;
        this.pathLens[q] = _;
        let z = 0;
        for (let Y = 0; Y < _; Y++) {
            let A = K.charCodeAt(Y);
            if (A >= 97 && A <= 122) z |= 1 << A - 97
        }
        this.charBits[q] = z
    }
    search(q, K) {
        if (K <= 0) return [];
        if (q.length === 0) {
            if (this.topLevelCache) return this.topLevelCache.slice(0, K);
            return []
        }
        let _ = q !== q.toLowerCase(),
            z = _ ? q : q.toLowerCase(),
            Y = Math.min(z.length, 64),
            A = Array(Y),
            O = 0;
        for (let G = 0; G < Y; G++) {
            let f = z.charAt(G);
            A[G] = f;
            let v = f.charCodeAt(0);
            if (v >= 97 && v <= 122) O |= 1 << v - 97
        }
        let w = Y * 24 + 8 + 32,
            $ = [],
            j = -1 / 0,
            {
                paths: H,
                lowerPaths: J,
                charBits: X,
                pathLens: M,
                readyCount: P
            } = this;
        q: for (let G = 0; G < P; G++) {
            if ((X[G] & O) !== O) continue;
            let f = _ ? H[G] : J[G],
                v = f.indexOf(A[0]);
            if (v === -1) continue;
            Cn8[0] = v;
            let V = 0,
                k = 0,
                N = v;
            for (let x = 1; x < Y; x++) {
                if (v = f.indexOf(A[x], N + 1), v === -1) continue q;
                Cn8[x] = v;
                let B = v - N - 1;
                if (B === 0) k += 4;
                else V += 3 + B * 1;
                N = v
            }
            if ($.length === K && w + k - V <= j) continue;
            let R = H[G],
                h = M[G],
                C = Y * 16 + k - V;
            C += YIK(R, Cn8[0], !0);
            for (let x = 1; x < Y; x++) C += YIK(R, Cn8[x], !1);
            if (C += Math.max(0, 32 - (h >> 2)), $.length < K) {
                if ($.push({
                        path: R,
                        fuzzScore: C
                    }), $.length === K) $.sort((x, B) => x.fuzzScore - B.fuzzScore), j = $[0].fuzzScore
            } else if (C > j) {
                let x = 0,
                    B = $.length;
                while (x < B) {
                    let m = x + B >> 1;
                    if ($[m].fuzzScore < C) x = m + 1;
                    else B = m
                }
                $.splice(x, 0, {
                    path: R,
                    fuzzScore: C
                }), $.shift(), j = $[0].fuzzScore
            }
        }
        $.sort((G, f) => f.fuzzScore - G.fuzzScore);
        let W = $.length,
            D = Math.max(W, 1),
            Z = Array(W);
        for (let G = 0; G < W; G++) {
            let f = $[G].path,
                v = G / D,
                V = f.includes("test") ? Math.min(v * 1.05, 1) : v;
            Z[G] = {
                path: f,
                score: V
            }
        }
        return Z
    }
}
// @from(Ln 433337, Col 0)
function YIK(q, K, _) {
    if (K === 0) return _ ? 8 : 0;
    let z = q.charCodeAt(K - 1);
    if (ZyY(z)) return 8;
    if (fyY(z) && GyY(q.charCodeAt(K))) return 6;
    return 0
}
// @from(Ln 433345, Col 0)
function ZyY(q) {
    return q === 47 || q === 92 || q === 45 || q === 95 || q === 46 || q === 32
}
// @from(Ln 433349, Col 0)
function fyY(q) {
    return q >= 97 && q <= 122
}
// @from(Ln 433353, Col 0)
function GyY(q) {
    return q >= 65 && q <= 90
}
// @from(Ln 433357, Col 0)
function bn8() {
    return new Promise((q) => setImmediate(q))
}
// @from(Ln 433361, Col 0)
function vyY(q, K) {
    let _ = new Set;
    for (let Y of q) {
        let A = Y.length;
        for (let w = 0; w < Y.length; w++) {
            let $ = Y.charCodeAt(w);
            if ($ === 47 || $ === 92) {
                A = w;
                break
            }
        }
        let O = Y.slice(0, A);
        if (O.length > 0) {
            if (_.add(O), _.size >= K) break
        }
    }
    let z = Array.from(_);
    return z.sort((Y, A) => {
        let O = Y.length - A.length;
        if (O !== 0) return O;
        return Y < A ? -1 : Y > A ? 1 : 0
    }), z.slice(0, K).map((Y) => ({
        path: Y,
        score: 0
    }))
}
// @from(Ln 433387, Col 4)
AIK = 4
// @from(Ln 433388, Col 4)
Cn8
// @from(Ln 433389, Col 4)
OIK = L(() => {
    Cn8 = new Int32Array(64)
})
// @from(Ln 433397, Col 0)
function kyY() {
    return {
        fileIndex: null,
        fileListRefreshPromise: null,
        cacheGeneration: 0,
        untrackedFetchPromise: null,
        cachedTrackedFiles: [],
        cachedConfigFiles: [],
        cachedTrackedDirs: [],
        ignorePatternsCache: null,
        ignorePatternsCacheKey: null,
        lastRefreshMs: 0,
        lastGitIndexMtime: null,
        loadedTrackedSignature: null,
        loadedMergedSignature: null,
        indexBuildComplete: l5()
    }
}
// @from(Ln 433416, Col 0)
function HIK(q) {
    q.fileIndex = null, q.fileListRefreshPromise = null, q.cacheGeneration++, q.untrackedFetchPromise = null, q.cachedTrackedFiles = [], q.cachedConfigFiles = [], q.cachedTrackedDirs = [], q.ignorePatternsCache = null, q.ignorePatternsCacheKey = null, q.lastRefreshMs = 0, q.lastGitIndexMtime = null, q.loadedTrackedSignature = null, q.loadedMergedSignature = null
}
// @from(Ln 433420, Col 0)
function JIK(q) {
    let K = q.length,
        _ = Math.max(1, Math.floor(K / 500)),
        z = -2128831035;
    for (let Y = 0; Y < K; Y += _) {
        let A = q[Y];
        for (let O = 0; O < A.length; O++) z = (z ^ A.charCodeAt(O)) * 16777619 | 0;
        z = z * 16777619 | 0
    }
    if (K > 0) {
        let Y = q[K - 1];
        for (let A = 0; A < Y.length; A++) z = (z ^ Y.charCodeAt(A)) * 16777619 | 0
    }
    return `${K}:${(z>>>0).toString(16)}`
}
// @from(Ln 433436, Col 0)
function NyY() {
    let q = ez(b8());
    if (!q) return null;
    try {
        return VyY(uT.join(q, ".git", "index")).mtimeMs
    } catch {
        return null
    }
}
// @from(Ln 433446, Col 0)
function wIK(q, K, _) {
    if (_ === K) return q;
    return q.map((z) => {
        let Y = uT.join(K, z);
        return uT.relative(_, Y)
    })
}
// @from(Ln 433453, Col 0)
async function EyY(q, K) {
    if (K.length === 0) return;
    if (!q.fileIndex) return;
    let _ = await XIK(K),
        z = [...q.cachedTrackedFiles, ...q.cachedConfigFiles, ...q.cachedTrackedDirs, ...K, ..._],
        Y = JIK(z);
    if (Y === q.loadedMergedSignature) {
        E("[FileIndex] skipped index rebuild — merged paths unchanged");
        return
    }
    await q.fileIndex.loadFromFileListAsync(z).done, q.loadedMergedSignature = Y, E(`[FileIndex] rebuilt index with ${q.cachedTrackedFiles.length} tracked + ${K.length} untracked files`)
}
// @from(Ln 433465, Col 0)
async function $IK(q, K, _) {
    let z = `${K}:${_}`;
    if (q.ignorePatternsCacheKey === z) return q.ignorePatternsCache;
    let Y = V8(),
        A = [".ignore", ".rgignore"],
        O = F4([K, _]),
        w = jIK.default(),
        $ = !1,
        j = O.flatMap((X) => A.map((M) => uT.join(X, M))),
        H = await Promise.all(j.map((X) => Y.readFile(X, {
            encoding: "utf8"
        }).catch(() => null)));
    for (let [X, M] of H.entries()) {
        if (M === null) continue;
        w.add(M), $ = !0, E(`[FileIndex] loaded ignore patterns from ${j[X]}`)
    }
    let J = $ ? w : null;
    return q.ignorePatternsCache = J, q.ignorePatternsCacheKey = z, J
}
// @from(Ln 433484, Col 0)
async function yyY(q, K, _) {
    let z = Date.now();
    E("[FileIndex] getFilesUsingGit called");
    let Y = ez(b8());
    if (!Y) return E("[FileIndex] not a git repo, returning null"), null;
    try {
        let A = b8(),
            O = Date.now(),
            w = await M7(D7(), ["-c", "core.quotepath=false", "ls-files", "--recurse-submodules"], {
                timeout: 5000,
                abortSignal: K,
                cwd: Y
            });
        if (E(`[FileIndex] git ls-files (tracked) took ${Date.now()-O}ms`), w.code !== 0) return E(`[FileIndex] git ls-files failed (code=${w.code}, stderr=${w.stderr}), falling back to ripgrep`), null;
        let $ = w.stdout.trim().split(`
`).filter(Boolean),
            j = wIK($, Y, A),
            H = await $IK(q, Y, A);
        if (H) {
            let X = j.length;
            j = H.filter(j), E(`[FileIndex] applied ignore patterns: ${X} -> ${j.length} files`)
        }
        q.cachedTrackedFiles = j;
        let J = Date.now() - z;
        if (E(`[FileIndex] git ls-files: ${j.length} tracked files in ${J}ms`), d("tengu_file_suggestions_git_ls_files", {
                file_count: j.length,
                tracked_count: j.length,
                untracked_count: 0,
                duration_ms: J
            }), !q.untrackedFetchPromise) {
            let X = _ ? ["-c", "core.quotepath=false", "ls-files", "--others", "--exclude-standard"] : ["-c", "core.quotepath=false", "ls-files", "--others"],
                M = q.cacheGeneration;
            q.untrackedFetchPromise = M7(D7(), X, {
                timeout: 1e4,
                cwd: Y
            }).then(async (P) => {
                if (M !== q.cacheGeneration) return;
                if (P.code === 0) {
                    let W = P.stdout.trim().split(`
`).filter(Boolean),
                        D = wIK(W, Y, A),
                        Z = await $IK(q, Y, A);
                    if (Z && D.length > 0) {
                        let G = D.length;
                        D = Z.filter(D), E(`[FileIndex] applied ignore patterns to untracked: ${G} -> ${D.length} files`)
                    }
                    return E(`[FileIndex] background untracked fetch: ${D.length} files`), EyY(q, D)
                }
            }).catch((P) => {
                E(`[FileIndex] background untracked fetch failed: ${P}`)
            }).finally(() => {
                q.untrackedFetchPromise = null
            })
        }
        return j
    } catch (A) {
        return E(`[FileIndex] git ls-files error: ${b6(A)}`), null
    }
}
// @from(Ln 433543, Col 0)
async function XIK(q) {
    let K = new Set,
        _ = performance.now();
    for (let z = 0; z < q.length; z++)
        if (LyY(q, z, z + 1, K), (z & 255) === 255 && performance.now() - _ > AIK) await bn8(), _ = performance.now();
    return [...K].map((z) => z + uT.sep)
}
// @from(Ln 433551, Col 0)
function LyY(q, K, _, z) {
    for (let Y = K; Y < _; Y++) {
        let A = uT.dirname(q[Y]);
        while (A !== "." && !z.has(A)) {
            let O = uT.dirname(A);
            if (O === A) break;
            z.add(A), A = O
        }
    }
}
// @from(Ln 433561, Col 0)
async function hyY(q) {
    return (await Promise.all(VCK.map((_) => ls(_, q)))).flatMap((_) => _.map((z) => z.filePath))
}
// @from(Ln 433564, Col 0)
async function RyY(q, K, _) {
    E(`[FileIndex] getProjectFiles called, respectGitignore=${_}`);
    let z = await yyY(q, K, _);
    if (z !== null) return E(`[FileIndex] using git ls-files result (${z.length} files)`), z;
    E("[FileIndex] git ls-files returned null, falling back to ripgrep");
    let Y = Date.now(),
        A = b8(),
        O = null,
        w;
    {
        let H = ["--files", "--follow", "--hidden", "--glob", "!.git/", "--glob", "!.svn/", "--glob", "!.hg/", "--glob", "!.bzr/", "--glob", "!.jj/", "--glob", "!.sl/"];
        if (!_) H.push("--no-ignore-vcs");
        w = await dd(H, A, K)
    }
    let $ = w.map((H) => uT.relative(A, H)),
        j = Date.now() - Y;
    return E(`[FileIndex] ripgrep: ${$.length} files in ${j}ms`), d("tengu_file_suggestions_ripgrep", {
        file_count: $.length,
        duration_ms: j
    }), $
}
// @from(Ln 433585, Col 0)
async function SyY(q) {
    let K = AbortSignal.timeout(1e4),
        _ = q.fileIndex ??= new F98;
    try {
        let z = v7(),
            Y = H8(),
            A = z.respectGitignore ?? Y.respectGitignore ?? !0,
            O = b8(),
            [w, $] = await Promise.all([RyY(q, K, A), hyY(O)]);
        q.cachedConfigFiles = $;
        let j = [...w, ...$],
            H = await XIK(j);
        q.cachedTrackedDirs = H;
        let J = [...H, ...j],
            X = JIK(J);
        if (X !== q.loadedTrackedSignature) await _.loadFromFileListAsync(J).done, q.loadedTrackedSignature = X, q.loadedMergedSignature = null;
        else E("[FileIndex] skipped index rebuild — tracked paths unchanged")
    } catch (z) {
        j6(z)
    }
    return _
}
// @from(Ln 433608, Col 0)
function CyY(q, K) {
    let _ = Math.min(q.length, K.length),
        z = 0;
    while (z < _ && q[z] === K[z]) z++;
    return q.substring(0, z)
}
// @from(Ln 433615, Col 0)
function MIK(q) {
    if (q.length === 0) return "";
    let K = q.map((z) => z.displayText),
        _ = K[0];
    for (let z = 1; z < K.length; z++) {
        let Y = K[z];
        if (_ = CyY(_, Y), _ === "") return ""
    }
    return _
}
// @from(Ln 433626, Col 0)
function SA7(q, K) {
    return {
        id: `file-${q}`,
        displayText: q,
        metadata: K !== void 0 ? {
            score: K
        } : void 0
    }
}
// @from(Ln 433636, Col 0)
function byY(q, K) {
    return q.search(K, CA7).map((z) => SA7(z.path, z.score))
}
// @from(Ln 433640, Col 0)
function In8(q) {
    if (q.fileListRefreshPromise) return;
    let K = NyY();
    if (q.fileIndex) {
        if (K === null && q.lastRefreshMs > 0) return;
        if (!(K !== null && K !== q.lastGitIndexMtime) && Date.now() - q.lastRefreshMs < IyY) return
    }
    let _ = q.cacheGeneration,
        z = Date.now();
    q.fileIndex ??= new F98, q.fileListRefreshPromise = SyY(q).then((Y) => {
        if (_ !== q.cacheGeneration) return Y;
        return q.fileListRefreshPromise = null, q.indexBuildComplete.emit(), q.lastGitIndexMtime = K, q.lastRefreshMs = Date.now(), E(`[FileIndex] cache refresh completed in ${Date.now()-z}ms`), Y
    }).catch((Y) => {
        if (E(`[FileIndex] Cache refresh failed: ${b6(Y)}`), j6(Y), _ === q.cacheGeneration) q.fileListRefreshPromise = null;
        return q.fileIndex ??= new F98
    })
}
// @from(Ln 433657, Col 0)
async function xyY() {
    let q = V8(),
        K = b8();
    try {
        return (await q.readdir(K)).map((z) => {
            let Y = uT.join(K, z.name),
                A = uT.relative(K, Y);
            return z.isDirectory() ? A + uT.sep : A
        })
    } catch (_) {
        return j6(_), []
    }
}
// @from(Ln 433670, Col 0)
async function bA7(q, K, _ = !1) {
    if (!K && !_) return [];
    if (v7().fileSuggestion?.type === "command") {
        let Y = {
            ...J9(),
            query: K
        };
        return (await IA7(Y)).slice(0, CA7).map(SA7)
    }
    if (K === "" || K === "." || K === "./") {
        let Y = await xyY();
        return In8(q), Y.slice(0, CA7).map(SA7)
    }
    let z = Date.now();
    try {
        let Y = q.fileListRefreshPromise !== null;
        In8(q);
        let A = K,
            O = "." + uT.sep;
        if (K.startsWith(O)) A = K.substring(2);
        if (A.startsWith("~")) A = Wq(A);
        let w = q.fileIndex ? byY(q.fileIndex, A) : [],
            $ = Date.now() - z;
        return E(`[FileIndex] generateFileSuggestions: ${w.length} results in ${$}ms (${Y?"partial":"full"} index)`), d("tengu_file_suggestions_query", {
            duration_ms: $,
            cache_hit: !Y,
            result_count: w.length,
            query_length: K.length
        }), w
    } catch (Y) {
        return j6(Y), []
    }
}
// @from(Ln 433704, Col 0)
function xn8(q, K, _, z, Y, A) {
    let O = typeof q === "string" ? q : q.displayText,
        w = K.substring(0, z) + O + K.substring(z + _.length);
    Y(w);
    let $ = z + O.length;
    A($)
}
// @from(Ln 433711, Col 4)
jIK
// @from(Ln 433711, Col 9)
L_6
// @from(Ln 433711, Col 14)
CA7 = 15
// @from(Ln 433712, Col 4)
IyY = 5000
// @from(Ln 433713, Col 4)
g98 = L(() => {
    ds();
    OIK();
    C8();
    h1();
    n7();
    K8();
    m8();
    Q4();
    Yq();
    pK();
    K9();
    U8();
    b9();
    BI();
    a1();
    nH();
    jIK = K6(X$6(), 1);
    L_6 = kyY()
})
// @from(Ln 433733, Col 4)
uA7 = {}
// @from(Ln 433738, Col 0)
function xA7(q = new Set, K) {
    let _ = q.size > 0;
    if ($2.cache.clear?.(), fj.cache.clear?.(), _Q1.cache.clear?.(), $R8.cache.clear?.(), HIK(L_6), On(), !_) o04();
    if (SD6(null), _F(void 0, K), EI6(), Ue6("session_start"), K?.((z) => {
            if (z.storedImagePaths.size === 0 && z.imageDescriptions.size === 0) return z;
            return {
                ...z,
                storedImagePaths: new Map,
                imageDescriptions: new Map
            }
        }), aOK(), !_) Bb4();
    if (BA1(), HP4(), !_) Au4();
    U81(q), NA1(), SyK(), LC4(), Promise.resolve().then(() => (x57(), iZK)).then(({
        clearWebFetchCache: z
    }) => z()), Promise.resolve().then(() => (Gd8(), AvK)).then(({
        clearToolSearchDescriptionCache: z
    }) => z()), Promise.resolve().then(() => (cP(), ih4)).then(({
        clearAgentDefinitionsCache: z
    }) => z()), Promise.resolve().then(() => (Mh6(), th4)).then(({
        clearPromptCache: z
    }) => z())
}
// @from(Ln 433760, Col 4)
un8 = L(() => {
    y8();
    CA();
    Rj6();
    hk();
    g98();
    qR6();
    _36();
    FK6();
    QF8();
    JR6();
    uh6();
    ol();
    ZM();
    vD();
    PM();
    gZ();
    sC()
})
// @from(Ln 433779, Col 4)
PIK = {}
// @from(Ln 433786, Col 0)
async function U98({
    setMessages: q,
    readFileState: K,
    discoveredSkillNames: _,
    discoveredRemoteSkills: z,
    loadedNestedMemoryPaths: Y,
    sessionEnvVars: A,
    memorySelector: O,
    getAppState: w,
    setAppState: $,
    setConversationId: j,
    resultDedupState: H
}) {
    let J = d98();
    await VP6("clear", {
        getAppState: w,
        setAppState: $,
        signal: AbortSignal.timeout(J)
    });
    let X = UB6();
    if (X) d("tengu_cache_eviction_hint", {
        scope: "conversation_clear",
        last_request_id: X
    });
    let M = new Set,
        P = [],
        W = (f) => ("isBackgrounded" in f) && f.isBackgrounded === !1;
    if (w)
        for (let f of Object.values(w().tasks)) {
            if (W(f)) continue;
            if (sD(f)) M.add(f.agentId), P.push(f);
            else if (EJ(f)) M.add(f.identity.agentId)
        }
    if (q(() => []), j) j(uyY());
    if (xA7(M, $), l$(Y7()), K.clear(), _?.clear(), z?.clear(), Y?.clear(), A?.clear(), sj6(O), H) H.seen.clear(), H.counter = 0;
    if ($) $((f) => {
        let v = {};
        for (let [V, k] of Object.entries(f.tasks)) {
            if (!W(k)) {
                v[V] = k;
                continue
            }
            try {
                if (k.status === "running") {
                    if (WS(k)) {
                        if (k.shellCommand?.kill(), k.shellCommand?.cleanup(), k.cleanupTimeoutId) clearTimeout(k.cleanupTimeoutId)
                    }
                    if ("abortController" in k) k.abortController?.abort();
                    if ("unregisterCleanup" in k) k.unregisterCleanup?.()
                }
            } catch (N) {
                j6(N)
            }
            n2(V)
        }
        return {
            ...f,
            tasks: v,
            attribution: oR6(),
            cacheBreakerPhrase: void 0,
            standaloneAgentContext: void 0,
            fileHistory: {
                snapshots: [],
                trackedFiles: new Set,
                snapshotSequence: 0
            },
            mcp: {
                clients: [],
                tools: [],
                commands: [],
                resources: {},
                resourceTemplates: {},
                pluginReconnectKey: f.mcp.pluginReconnectKey
            }
        }
    });
    PR4();
    let D = NH(I8());
    if (Q98(), T61({
            setCurrentAsParent: !0
        }), await Gu(), D) await AN(I8(), D, void 0, "user");
    for (let f of P) {
        if (f.status !== "running") continue;
        uM6(f.id, X0(w2(f.agentId)))
    }
    let Z = sO();
    if (Z) zL(Z);
    let G = await lR("clear");
    if (G.length > 0) q(() => G)
}
// @from(Ln 433876, Col 4)
mn8 = L(() => {
    y8();
    C8();
    vM();
    Cf();
    sR();
    K9();
    U8();
    NJ();
    $G();
    a56();
    g4();
    EH();
    tD();
    un8()
})
// @from(Ln 433892, Col 4)
WIK = {}
// @from(Ln 433896, Col 4)
myY = async (q, K) => {
    return await U98(K), {
        type: "text",
        value: ""
    }
}
// @from(Ln 433902, Col 4)
DIK = L(() => {
    mn8()
})
// @from(Ln 433905, Col 4)
ByY
// @from(Ln 433905, Col 9)
Bn8
// @from(Ln 433906, Col 4)
ZIK = L(() => {
    ByY = {
        type: "local",
        name: "clear",
        description: "Start a new session with empty context; previous session stays on disk (resumable with /resume)",
        aliases: ["reset", "new"],
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (DIK(), WIK))
    }, Bn8 = ByY
})
// @from(Ln 433916, Col 4)
fIK = {}
// @from(Ln 433920, Col 0)
async function FyY(q, K, _) {
    if (Lz()) return q("Cannot set color: This session is a swarm teammate. Teammate colors are assigned by the team leader.", {
        display: "system"
    }), null;
    if (!_ || _.trim() === "") {
        let O = VJ.join(", ");
        return q(`Please provide a color. Available colors: ${O}, default`, {
            display: "system"
        }), null
    }
    let z = _.trim().toLowerCase();
    if (pyY.includes(z)) {
        let O = I8(),
            w = bY();
        return await pn8(O, "default", w), K.setAppState(($) => ({
            ...$,
            standaloneAgentContext: {
                ...$.standaloneAgentContext,
                name: $.standaloneAgentContext?.name ?? "",
                color: void 0
            }
        })), q("Session color reset to default", {
            display: "system"
        }), null
    }
    if (!VJ.includes(z)) {
        let O = VJ.join(", ");
        return q(`Invalid color "${z}". Available colors: ${O}, default`, {
            display: "system"
        }), null
    }
    let Y = I8(),
        A = bY();
    return await pn8(Y, z, A), K.setAppState((O) => ({
        ...O,
        standaloneAgentContext: {
            ...O.standaloneAgentContext,
            name: O.standaloneAgentContext?.name ?? "",
            color: z
        }
    })), q(`Session color set to: ${z}`, {
        display: "system"
    }), null
}
// @from(Ln 433964, Col 4)
pyY
// @from(Ln 433965, Col 4)
GIK = L(() => {
    y8();
    Uf();
    g4();
    zY();
    pyY = ["default", "reset", "none", "gray", "grey"]
})
// @from(Ln 433972, Col 4)
gyY
// @from(Ln 433972, Col 9)
mA7
// @from(Ln 433973, Col 4)
vIK = L(() => {
    gyY = {
        type: "local-jsx",
        name: "color",
        description: "Set the prompt bar color for this session",
        immediate: !0,
        argumentHint: "<color|default>",
        load: () => Promise.resolve().then(() => (GIK(), fIK))
    }, mA7 = gyY
})
// @from(Ln 433984, Col 0)
function UyY() {
    let {
        commit: q
    } = Kx6();
    return `${""}## Context

- Current git status: !\`git status\`
- Current git diff (staged and unstaged changes): !\`git diff HEAD\`
- Current branch: !\`git branch --show-current\`
- Recent commits: !\`git log --oneline -10\`

## Git Safety Protocol

- NEVER update the git config
- NEVER skip hooks (--no-verify, --no-gpg-sign, etc) unless the user explicitly requests it
- CRITICAL: ALWAYS create NEW commits. NEVER use git commit --amend, unless the user explicitly requests it
- Do not commit files that likely contain secrets (.env, credentials.json, etc). Warn the user if they specifically request to commit those files
- If there are no changes to commit (i.e., no untracked files and no modifications), do not create an empty commit
- Never use git commands with the -i flag (like git rebase -i or git add -i) since they require interactive input which is not supported

## Your task

Based on the above changes, create a single git commit:

1. Analyze all staged changes and draft a commit message:
   - Look at the recent commits above to follow this repository's commit message style
   - Summarize the nature of the changes (new feature, enhancement, bug fix, refactoring, test, docs, etc.)
   - Ensure the message accurately reflects the changes and their purpose (i.e. "add" means a wholly new feature, "update" means an enhancement to an existing feature, "fix" means a bug fix, etc.)
   - Draft a concise (1-2 sentences) commit message that focuses on the "why" rather than the "what"

2. Stage relevant files and create the commit using HEREDOC syntax:
\`\`\`
git commit -m "$(cat <<'EOF'
Commit message here.${q?`

${q}`:""}
EOF
)"
\`\`\`

You have the capability to call multiple tools in a single response. Stage and create the commit using a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.`
}
// @from(Ln 434026, Col 4)
TIK
// @from(Ln 434026, Col 9)
QyY
// @from(Ln 434026, Col 14)
VIK
// @from(Ln 434027, Col 4)
kIK = L(() => {
    An8();
    LI6();
    DP6();
    TIK = ["Bash(git add *)", "Bash(git status *)", "Bash(git commit *)"];
    QyY = {
        type: "prompt",
        name: "commit",
        description: "Create a git commit",
        allowedTools: TIK,
        contentLength: 0,
        progressMessage: "creating commit",
        source: "builtin",
        async getPromptForCommand(q, K) {
            let _ = UyY();
            return [{
                type: "text",
                text: await An(_, {
                    ...K,
                    getAppState() {
                        let Y = K.getAppState();
                        return {
                            ...Y,
                            toolPermissionContext: {
                                ...Y.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...Y.toolPermissionContext.alwaysAllowRules,
                                    command: TIK
                                }
                            }
                        }
                    }
                }, "/commit")
            }]
        }
    }, VIK = QyY
})
// @from(Ln 434064, Col 4)
SIK = {}
// @from(Ln 434078, Col 0)
function nyY(q) {
    let K = wY.lexer(E96(q)),
        _ = [];
    for (let z of K)
        if (z.type === "code") {
            let Y = z;
            _.push({
                code: Y.text,
                lang: Y.lang
            })
        } return _
}
// @from(Ln 434091, Col 0)
function LIK(q) {
    let K = [];
    for (let _ = q.length - 1; _ >= 0 && K.length < lyY; _--) {
        let z = q[_];
        if (z?.type !== "assistant" || z.isApiErrorMessage) continue;
        let Y = z.message.content;
        if (!Array.isArray(Y)) continue;
        let A = s5(Y, `

`);
        if (A) K.push(A)
    }
    return K
}
// @from(Ln 434106, Col 0)
function hIK(q) {
    if (q) {
        let K = q.replace(/[^a-zA-Z0-9]/g, "");
        if (K && K !== "plaintext") return `.${K}`
    }
    return ".txt"
}
// @from(Ln 434113, Col 0)
async function RIK(q, K) {
    let _ = EIK(NIK, K);
    return await dyY(NIK, {
        recursive: !0
    }), await cyY(_, q, "utf-8"), _
}
// @from(Ln 434119, Col 0)
async function BA7(q, K) {
    let _ = await hP(q);
    if (_) process.stdout.write(_);
    let z = tz(q, `
`) + 1,
        Y = q.length;
    try {
        let A = await RIK(q, K);
        return `Copied to clipboard (${Y} characters, ${z} lines)
Also written to ${A}`
    } catch {
        return `Copied to clipboard (${Y} characters, ${z} lines)`
    }
}
// @from(Ln 434134, Col 0)
function iyY(q, K) {
    let _ = oY(q);
    if (N1(_) <= K) return _;
    let z = "",
        Y = 0,
        A = K - 1;
    for (let O of _) {
        let w = N1(O);
        if (Y + w > A) break;
        z += O, Y += w
    }
    return z + "…"
}
// @from(Ln 434148, Col 0)
function ryY(q) {
    let K = s(35),
        {
            fullText: _,
            codeBlocks: z,
            messageAge: Y,
            onDone: A
        } = q,
        O = SS.useRef("full"),
        w = `${_.length} chars, ${tz(_,`
`)+1} lines`,
        $;
    if (K[0] !== w) $ = {
        label: "Full response",
        value: "full",
        description: w
    }, K[0] = w, K[1] = $;
    else $ = K[1];
    let j;
    if (K[2] !== z || K[3] !== $) {
        let C;
        if (K[5] === Symbol.for("react.memo_cache_sentinel")) C = {
            label: "Always copy full response",
            value: "always",
            description: "Skip this picker in the future (revert via /config)"
        }, K[5] = C;
        else C = K[5];
        j = [$, ...z.map(ayY), C], K[2] = z, K[3] = $, K[4] = j
    } else j = K[4];
    let H = j,
        J;
    if (K[6] !== z || K[7] !== _) J = function(x) {
        if (x === "full" || x === "always") return {
            text: _,
            filename: yIK
        };
        let B = z[x];
        return {
            text: B.code,
            filename: `copy${hIK(B.lang)}`,
            blockIndex: x
        }
    }, K[6] = z, K[7] = _, K[8] = J;
    else J = K[8];
    let X = J,
        M;
    if (K[9] !== z.length || K[10] !== X || K[11] !== Y || K[12] !== A) M = async function(x) {
        let B = X(x);
        if (x === "always") {
            if (!H8().copyFullResponse) d8(oyY);
            d("tengu_copy", {
                block_count: z.length,
                always: !0,
                message_age: Y
            });
            let S = await BA7(B.text, B.filename);
            A(`${S}
Preference saved. Use /config to change copyFullResponse`);
            return
        }
        d("tengu_copy", {
            selected_block: B.blockIndex,
            block_count: z.length,
            message_age: Y
        });
        let m = await BA7(B.text, B.filename);
        A(m)
    }, K[9] = z.length, K[10] = X, K[11] = Y, K[12] = A, K[13] = M;
    else M = K[13];
    let P = M,
        W;
    if (K[14] !== z.length || K[15] !== X || K[16] !== Y || K[17] !== A) {
        let C = async function(B) {
            let m = X(B);
            d("tengu_copy", {
                selected_block: m.blockIndex,
                block_count: z.length,
                message_age: Y,
                write_shortcut: !0
            });
            try {
                let S = await RIK(m.text, m.filename);
                A(`Written to ${S}`)
            } catch (S) {
                let F = S;
                A(`Failed to write file: ${F instanceof Error?F.message:F}`)
            }
        };
        W = function(B) {
            if (B.key === "w" && !B.ctrl && !B.meta) B.preventDefault(), C(O.current)
        }, K[14] = z.length, K[15] = X, K[16] = Y, K[17] = A, K[18] = W
    } else W = K[18];
    let D = W,
        Z;
    if (K[19] === Symbol.for("react.memo_cache_sentinel")) Z = SS.default.createElement(T, {
        dimColor: !0
    }, "Select content to copy:"), K[19] = Z;
    else Z = K[19];
    let G;
    if (K[20] === Symbol.for("react.memo_cache_sentinel")) G = (C) => {
        O.current = C
    }, K[20] = G;
    else G = K[20];
    let f;
    if (K[21] !== P) f = (C) => {
        P(C)
    }, K[21] = P, K[22] = f;
    else f = K[22];
    let v;
    if (K[23] !== A) v = () => {
        A("Copy cancelled", {
            display: "system"
        })
    }, K[23] = A, K[24] = v;
    else v = K[24];
    let V;
    if (K[25] !== H || K[26] !== v || K[27] !== f) V = SS.default.createElement(A1, {
        options: H,
        hideIndexes: !1,
        onFocus: G,
        onChange: f,
        onCancel: v
    }), K[25] = H, K[26] = v, K[27] = f, K[28] = V;
    else V = K[28];
    let k, N;
    if (K[29] === Symbol.for("react.memo_cache_sentinel")) k = SS.default.createElement(A8, {
        chord: "enter",
        action: "copy",
        format: {
            keyCase: "lower"
        }
    }), N = SS.default.createElement(A8, {
        chord: "w",
        action: "write to file"
    }), K[29] = k, K[30] = N;
    else k = K[29], N = K[30];
    let R;
    if (K[31] === Symbol.for("react.memo_cache_sentinel")) R = SS.default.createElement(T, {
        dimColor: !0
    }, SS.default.createElement(z1, null, k, N, SS.default.createElement(A8, {
        chord: "escape",
        action: "cancel",
        format: {
            keyCase: "lower"
        }
    }))), K[31] = R;
    else R = K[31];
    let h;
    if (K[32] !== D || K[33] !== V) h = SS.default.createElement(A_, null, SS.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: D
    }, Z, V, R)), K[32] = D, K[33] = V, K[34] = h;
    else h = K[34];
    return h
}
// @from(Ln 434307, Col 0)
function oyY(q) {
    return {
        ...q,
        copyFullResponse: !0
    }
}
// @from(Ln 434314, Col 0)
function ayY(q, K) {
    let _ = tz(q.code, `
`) + 1;
    return {
        label: iyY(q.code, 60),
        value: K,
        description: [q.lang, _ > 1 ? `${_} lines` : void 0].filter(Boolean).join(", ") || void 0
    }
}
// @from(Ln 434323, Col 4)
SS
// @from(Ln 434323, Col 8)
NIK
// @from(Ln 434323, Col 13)
yIK = "response.md"
// @from(Ln 434324, Col 4)
lyY = 20
// @from(Ln 434325, Col 4)
syY = async (q, K, _) => {
        let z = LIK(K.messages);
        if (z.length === 0) return q("No assistant message to copy"), null;
        let Y = 0,
            A = _?.trim();
        if (A) {
            let j = Number(A);
            if (!Number.isInteger(j) || j < 1) return q(`Usage: /copy [N] where N is 1 (latest), 2, 3, … Got: ${A}`), null;
            if (j > z.length) return q(`Only ${z.length} assistant ${z.length===1?"message":"messages"} available to copy`), null;
            Y = j - 1
        }
        let O = z[Y],
            w = nyY(O),
            $ = H8();
        if (w.length === 0 || $.copyFullResponse) {
            d("tengu_copy", {
                always: $.copyFullResponse,
                block_count: w.length,
                message_age: Y
            });
            let j = await BA7(O, yIK);
            return q(j), null
        }
        return SS.default.createElement(ryY, {
            fullText: O,
            codeBlocks: w,
            messageAge: Y,
            onDone: q
        })
    }
// @from(Ln 434355, Col 4)
CIK = L(() => {
    o6();
    xe6();
    gK();
    Nq();
    u7();
    DJ();
    n5();
    HX();
    g6();
    C8();
    h1();
    _7();
    cW();
    SS = K6(P6(), 1), NIK = EIK(z2(), "claude")
})
// @from(Ln 434371, Col 4)
tyY
// @from(Ln 434371, Col 9)
pA7
// @from(Ln 434372, Col 4)
bIK = L(() => {
    tyY = {
        type: "local-jsx",
        name: "copy",
        description: "Copy Claude's last response to clipboard (or /copy N for the Nth-latest)",
        load: () => Promise.resolve().then(() => (CIK(), SIK))
    }, pA7 = tyY
})
// @from(Ln 434387, Col 0)
function FA7() {
    let q = [process.argv[1] || "", process.execPath || ""],
        K = ["/build-ant/", "/build-ant-native/", "/build-external/", "/build-external-native/"];
    return q.some((_) => K.some((z) => _.includes(z)))
}
// @from(Ln 434393, Col 0)
function KLY(q) {
    let K = FA7() ? "claude-dev" : "claude",
        _ = new URL(`${K}://resume`);
    return _.searchParams.set("session", q), _.toString()
}
// @from(Ln 434398, Col 0)
async function _LY() {
    if (FA7()) return !0;
    let q = process.platform;
    if (q === "darwin") return a3("/Applications/Claude.app");
    else if (q === "linux") {
        let {
            code: K,
            stdout: _
        } = await w1("xdg-mime", ["query", "default", "x-scheme-handler/claude"]);
        return K === 0 && _.trim().length > 0
    } else if (q === "win32") {
        let {
            code: K
        } = await w1("reg", ["query", "HKEY_CLASSES_ROOT\\claude", "/ve"]);
        return K === 0
    }
    return !1
}
// @from(Ln 434416, Col 0)
async function zLY() {
    let q = process.platform;
    if (q === "darwin") {
        let {
            code: K,
            stdout: _
        } = await w1("defaults", ["read", "/Applications/Claude.app/Contents/Info.plist", "CFBundleShortVersionString"]);
        if (K !== 0) return null;
        let z = _.trim();
        return z.length > 0 ? z : null
    } else if (q === "win32") {
        let K = process.env.LOCALAPPDATA;
        if (!K) return null;
        let _ = qLY(K, "AnthropicClaude");
        try {
            return (await eyY(_)).filter((A) => A.startsWith("app-")).map((A) => A.slice(4)).filter((A) => c98.coerce(A) !== null).sort((A, O) => {
                let w = c98.coerce(A),
                    $ = c98.coerce(O);
                return w.compare($)
            }).at(-1) ?? null
        } catch {
            return null
        }
    }
    return null
}
// @from(Ln 434442, Col 0)
async function gA7() {
    if (!await _LY()) return {
        status: "not-installed"
    };
    let K;
    try {
        K = await zLY()
    } catch {
        return {
            status: "ready",
            version: "unknown"
        }
    }
    if (!K) return {
        status: "ready",
        version: "unknown"
    };
    let _ = c98.coerce(K);
    if (!_ || !QW(_.version, Fn8)) return {
        status: "version-too-old",
        version: K
    };
    return {
        status: "ready",
        version: K
    }
}
// @from(Ln 434469, Col 0)
async function YLY(q) {
    let K = process.platform;
    if (E(`Opening deep link: ${q}`), K === "darwin") {
        if (FA7()) {
            let {
                code: z
            } = await w1("osascript", ["-e", `tell application "Electron" to open location "${q}"`]);
            return z === 0
        }
        let {
            code: _
        } = await w1("open", [q]);
        return _ === 0
    } else if (K === "linux") {
        let {
            code: _
        } = await w1("xdg-open", [q]);
        return _ === 0
    } else if (K === "win32") {
        let {
            code: _
        } = await w1("cmd", ["/c", "start", "", q]);
        return _ === 0
    }
    return !1
}
// @from(Ln 434495, Col 0)
async function IIK() {
    let q = I8(),
        K = await gA7();
    if (K.status === "not-installed") return {
        success: !1,
        error: "Claude Desktop is not installed. Install it from https://claude.ai/download"
    };
    if (K.status === "version-too-old") return {
        success: !1,
        error: `Claude Desktop ${K.version} is too old to resume this session. Please update to ${Fn8} or later.`
    };
    let _ = KLY(q);
    if (!await YLY(_)) return {
        success: !1,
        error: "Failed to open Claude Desktop. Please try opening it manually.",
        deepLinkUrl: _
    };
    return {
        success: !0,
        deepLinkUrl: _
    }
}
// @from(Ln 434517, Col 4)
c98
// @from(Ln 434517, Col 9)
Fn8 = "1.1.9669"
// @from(Ln 434518, Col 4)
xIK = L(() => {
    y8();
    K8();
    Q4();
    eK();
    c98 = K6(Pd(), 1)
})
// @from(Ln 434526, Col 0)
function ALY() {
    switch (process.platform) {
        case "win32":
            return "https://claude.ai/api/desktop/win32/x64/exe/latest/redirect";
        default:
            return "https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect"
    }
}
// @from(Ln 434535, Col 0)
function gn8(q) {
    let K = s(22),
        {
            onDone: _
        } = q,
        [z, Y] = HL.useState("checking"),
        [A, O] = HL.useState(null),
        [w, $] = HL.useState(""),
        j;
    if (K[0] !== A || K[1] !== _ || K[2] !== z) j = function(G) {
        if (G.ctrl || G.meta) return;
        if (z === "error") {
            G.preventDefault(), _(A ?? "Unknown error", {
                display: "system"
            });
            return
        }
        if (z === "prompt-download") {
            if ((G.key === "y" || G.key === "Y") && !G.ctrl && !G.meta) G.preventDefault(), J3(ALY()).catch(wLY), _(`Starting download. Re-run /desktop once you’ve installed the app.
Learn more at ${uIK}`, {
                display: "system"
            });
            else if ((G.key === "n" || G.key === "N") && !G.ctrl && !G.meta) G.preventDefault(), _(`The desktop app is required for /desktop. Learn more at ${uIK}`, {
                display: "system"
            })
        }
    }, K[0] = A, K[1] = _, K[2] = z, K[3] = j;
    else j = K[3];
    let H = j,
        J, X;
    if (K[4] !== _) J = () => {
        (async function() {
            Y("checking");
            let f = await gA7();
            if (f.status === "not-installed") {
                $("Claude Desktop is not installed."), Y("prompt-download");
                return
            }
            if (f.status === "version-too-old") {
                $(`Claude Desktop needs to be updated (found v${f.version}, need v${Fn8}+).`), Y("prompt-download");
                return
            }
            Y("flushing"), await mT(), Y("opening");
            let v = await IIK();
            if (!v.success) {
                O(v.error ?? "Failed to open Claude Desktop"), Y("error");
                return
            }
            Y("success"), setTimeout(OLY, 500, _)
        })().catch((G) => {
            O(b6(G)), Y("error")
        })
    }, X = [_], K[4] = _, K[5] = J, K[6] = X;
    else J = K[5], X = K[6];
    if (HL.useEffect(J, X), z === "error") {
        let Z;
        if (K[7] !== A) Z = HL.default.createElement(T, {
            color: "error"
        }, "Error: ", A), K[7] = A, K[8] = Z;
        else Z = K[8];
        let G;
        if (K[9] === Symbol.for("react.memo_cache_sentinel")) G = HL.default.createElement(T, {
            dimColor: !0
        }, "Press any key to continue…"), K[9] = G;
        else G = K[9];
        let f;
        if (K[10] !== H || K[11] !== Z) f = HL.default.createElement(u, {
            flexDirection: "column",
            paddingX: 2,
            tabIndex: 0,
            autoFocus: !0,
            onKeyDown: H
        }, Z, G), K[10] = H, K[11] = Z, K[12] = f;
        else f = K[12];
        return f
    }
    if (z === "prompt-download") {
        let Z;
        if (K[13] !== w) Z = HL.default.createElement(T, null, w), K[13] = w, K[14] = Z;
        else Z = K[14];
        let G;
        if (K[15] === Symbol.for("react.memo_cache_sentinel")) G = HL.default.createElement(T, null, "Download now? (y/n)"), K[15] = G;
        else G = K[15];
        let f;
        if (K[16] !== H || K[17] !== Z) f = HL.default.createElement(u, {
            flexDirection: "column",
            paddingX: 2,
            tabIndex: 0,
            autoFocus: !0,
            onKeyDown: H
        }, Z, G), K[16] = H, K[17] = Z, K[18] = f;
        else f = K[18];
        return f
    }
    let M;
    if (K[19] === Symbol.for("react.memo_cache_sentinel")) M = {
        checking: "Checking for Claude Desktop…",
        flushing: "Saving session…",
        opening: "Opening Claude Desktop…",
        success: "Opening in Claude Desktop…"
    }, K[19] = M;
    else M = K[19];
    let W = M[z],
        D;
    if (K[20] !== W) D = HL.default.createElement(Q$, {
        message: W
    }), K[20] = W, K[21] = D;
    else D = K[21];
    return D
}
// @from(Ln 434645, Col 0)
async function OLY(q) {
    q("Session transferred to Claude Desktop", {
        display: "system"
    }), await WK(0, "other")
}
// @from(Ln 434651, Col 0)
function wLY() {}
// @from(Ln 434652, Col 4)
HL
// @from(Ln 434652, Col 8)
uIK = "https://clau.de/desktop"
// @from(Ln 434653, Col 4)
UA7 = L(() => {
    o6();
    g6();
    Nj();
    xIK();
    m8();
    CY();
    g4();
    Qy();
    HL = K6(P6(), 1)
})
// @from(Ln 434664, Col 4)
BIK = {}
// @from(Ln 434668, Col 0)
async function $LY(q) {
    return mIK.default.createElement(gn8, {
        onDone: q
    })
}
// @from(Ln 434673, Col 4)
mIK
// @from(Ln 434674, Col 4)
pIK = L(() => {
    UA7();
    mIK = K6(P6(), 1)
})
// @from(Ln 434679, Col 0)
function FIK() {
    if (process.platform === "darwin") return !0;
    if (process.platform === "win32" && process.arch === "x64") return !0;
    return !1
}
// @from(Ln 434684, Col 4)
jLY
// @from(Ln 434684, Col 9)
gIK
// @from(Ln 434685, Col 4)
UIK = L(() => {
    jLY = {
        type: "local-jsx",
        name: "desktop",
        aliases: ["app"],
        description: "Continue the current session in Claude Desktop",
        availability: ["claude-ai"],
        isEnabled: FIK,
        get isHidden() {
            return !FIK()
        },
        load: () => Promise.resolve().then(() => (pIK(), BIK))
    }, gIK = jLY
})
// @from(Ln 434700, Col 0)
function dIK(q, K) {
    let {
        commit: _,
        pr: z
    } = Kx6(), Y = K ?? z, A = process.env.SAFEUSER || "", O = process.env.USER || "", w = "", $ = " and `--reviewer anthropics/claude-code`", j = " (and add `--add-reviewer anthropics/claude-code`)", H = `

## Changelog
<!-- CHANGELOG:START -->
[If this PR contains user-facing changes, add a changelog entry here. Otherwise, remove this section.]
<!-- CHANGELOG:END -->`, J = `

5. After creating/updating the PR, check if the user's CLAUDE.md mentions posting to Slack channels. If it does, use ToolSearch to search for "slack send message" tools. If ToolSearch finds a Slack tool, ask the user if they'd like you to post the PR URL to the relevant Slack channel. Only post if the user confirms. If ToolSearch returns no results or errors, skip this step silently—do not mention the failure, do not attempt workarounds, and do not try alternative approaches.`;
    return `${w}## Context

- \`SAFEUSER\`: ${A}
- \`whoami\`: ${O}
- \`git status\`: !\`git status\`
- \`git diff HEAD\`: !\`git diff HEAD\`
- \`git branch --show-current\`: !\`git branch --show-current\`
- \`git diff ${q}...HEAD\`: !\`git diff ${q}...HEAD\`
- \`gh pr view --json number 2>/dev/null || true\`: !\`gh pr view --json number 2>/dev/null || true\`

## Git Safety Protocol

- NEVER update the git config
- NEVER run destructive/irreversible git commands (like push --force, hard reset, etc) unless the user explicitly requests them
- NEVER skip hooks (--no-verify, --no-gpg-sign, etc) unless the user explicitly requests it
- NEVER run force push to main/master, warn the user if they request it
- Do not commit files that likely contain secrets (.env, credentials.json, etc)
- Never use git commands with the -i flag (like git rebase -i or git add -i) since they require interactive input which is not supported

## Your task

Analyze all changes that will be included in the pull request, making sure to look at all relevant commits (NOT just the latest commit, but ALL commits that will be included in the pull request from the git diff ${q}...HEAD output above).

Based on the above changes:
1. Create a new branch if on ${q} (use SAFEUSER from context above for the branch name prefix, falling back to whoami if SAFEUSER is empty, e.g., \`username/feature-name\`)
2. Create a single commit with an appropriate message using heredoc syntax${_?", ending with the attribution text shown in the example below":""}:
\`\`\`
git commit -m "$(cat <<'EOF'
Commit message here.${_?`

${_}`:""}
EOF
)"
\`\`\`
3. Push the branch to origin
4. If a PR already exists for this branch (check the gh pr view output above), update the PR title and body using \`gh pr edit\` to reflect the current diff${j}. Otherwise, create a pull request using \`gh pr create\` with heredoc syntax for the body${$}.
   - IMPORTANT: Keep PR titles short (under 70 characters). Use the body for details.
\`\`\`
gh pr create --title "Short, descriptive title" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points>

## Test plan
[Bulleted markdown checklist of TODOs for testing the pull request...]${H}${Y?`

${Y}`:""}
EOF
)"
\`\`\`

You have the capability to call multiple tools in a single response. You MUST do all of the above in a single message.${J}

Return the PR URL when you're done, so the user can see it.`
}
// @from(Ln 434766, Col 4)
QIK
// @from(Ln 434766, Col 9)
HLY
// @from(Ln 434766, Col 14)
cIK
// @from(Ln 434767, Col 4)
lIK = L(() => {
    An8();
    pK();
    LI6();
    DP6();
    QIK = ["Bash(git checkout -b *)", "Bash(git add *)", "Bash(git status *)", "Bash(git push *)", "Bash(git commit *)", "Bash(gh pr create *)", "Bash(gh pr edit *)", "Bash(gh pr view *)", "Bash(gh pr merge *)", "ToolSearch", "mcp__slack__send_message", "mcp__claude_ai_Slack__slack_send_message"];
    HLY = {
        type: "prompt",
        name: "commit-push-pr",
        description: "Commit, push, and open a PR",
        allowedTools: QIK,
        get contentLength() {
            return dIK("main").length
        },
        progressMessage: "creating commit and PR",
        source: "builtin",
        async getPromptForCommand(q, K) {
            let [_, z] = await Promise.all([UZ(), ySK(K.getAppState)]), Y = dIK(_, z), A = q?.trim();
            if (A) Y += `

## Additional instructions from user

${A}`;
            return [{
                type: "text",
                text: await An(Y, {
                    ...K,
                    getAppState() {
                        let w = K.getAppState();
                        return {
                            ...w,
                            toolPermissionContext: {
                                ...w.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...w.toolPermissionContext.alwaysAllowRules,
                                    command: QIK
                                }
                            }
                        }
                    }
                }, "/commit-push-pr")
            }]
        }
    }, cIK = HLY
})
// @from(Ln 434812, Col 4)
rIK = {}
// @from(Ln 434816, Col 0)
async function XLY(q, K, _) {
    K.onCompactProgress?.({
        type: "hooks_start",
        hookType: "pre_compact"
    }), K.setSDKStatus?.("compacting");
    let z = performance.now(),
        Y, A = qT(q),
        O;
    try {
        let [w, $] = await Promise.all([oc({
            trigger: "manual",
            customInstructions: _ || null
        }, K.abortController.signal), iIK(K, q)]);
        ec8(w, K);
        let j = r_7(_, w.newCustomInstructions);
        K.setStreamMode?.("requesting"), K.resetResponseLength?.(), K.onCompactProgress?.({
            type: "compact_start"
        });
        let H = await Dr1(q, $, {
            customInstructions: j,
            trigger: "manual"
        });
        if (!H.ok) switch (H.reason) {
            case "too_few_groups":
                throw Error(QI6);
            case "aborted":
                throw Error(at);
            case "exhausted":
                throw new be("Compaction failed · conversation could not be reduced below the context limit");
            case "media_unstrippable":
                throw new be("Compaction failed · attached media exceeds size limits");
            case "error":
                throw new be(`Error during compaction: ${H.detail||"unknown error"}`)
        }
        let J = H.result.boundaryMarker;
        if (J.subtype === "compact_boundary" && "compactMetadata" in J) O = J.compactMetadata.postTokens;
        bs(void 0), _F(void 0, K.setAppState, K.resultDedupState), nj6(), $2.cache.clear?.();
        let X = [w.userDisplayMessage, H.result.userDisplayMessage].filter(Boolean).join(`
`) || void 0;
        return {
            type: "compact",
            compactionResult: {
                ...H.result,
                userDisplayMessage: X
            },
            displayText: nIK(K, X)
        }
    } catch (w) {
        throw Y = w instanceof Error ? w.message : "reactive compaction failed", w
    } finally {
        K.setStreamMode?.("requesting"), K.resetResponseLength?.(), K.onCompactProgress?.({
            type: "compact_end"
        }), aK6({
            trigger: "manual",
            success: !Y,
            durationMs: performance.now() - z,
            preTokens: A,
            postTokens: O,
            error: Y
        }), K.setSDKStatus?.(null, {
            compactResult: Y ? "failed" : "success",
            ...Y && {
                compactError: Y
            }
        })
    }
}
// @from(Ln 434884, Col 0)
function nIK(q, K) {
    let _ = nC6("tip"),
        z = WJ("app:toggleTranscript", "Global", "ctrl+o"),
        Y = [...q.options.verbose ? [] : [`(${z} to see full summary)`], ...K ? [K] : [], ..._ ? [_] : []];
    return Y8.dim("Compacted " + Y.join(`
`))
}
// @from(Ln 434891, Col 0)
async function iIK(q, K) {
    let _ = q.getAppState(),
        z = await j0(q.options.tools, q.options.mainLoopModel, Array.from(_.toolPermissionContext.additionalWorkingDirectories.keys())),
        Y = ax({
            mainThreadAgentDefinition: void 0,
            toolUseContext: q,
            customSystemPrompt: q.options.customSystemPrompt,
            defaultSystemPrompt: z,
            appendSystemPrompt: q.options.appendSystemPrompt
        }),
        [A, O] = await Promise.all([$2(), fj(_.cacheBreakerPhrase)]);
    return {
        systemPrompt: Y,
        userContext: A,
        systemContext: O,
        toolUseContext: q,
        forkContextMessages: K
    }
}
// @from(Ln 434910, Col 4)
JLY = async (q, K) => {
    let {
        abortController: _
    } = K, {
        messages: z
    } = K;
    if (z = H2(z), z.length === 0) throw Error("No messages to compact");
    let Y = q.trim();
    try {
        if (bx()) return await XLY(z, K, Y);
        let O = (await _c(z, K)).messages,
            w = await vI6(O, K, await iIK(K, O), !1, Y, !1);
        return bs(void 0), nj6(), $2.cache.clear?.(), _F(void 0, K.setAppState, K.resultDedupState), {
            type: "compact",
            compactionResult: w,
            displayText: nIK(K, w.userDisplayMessage)
        }
    } catch (A) {
        if (K.setSDKStatus?.(null, {
                compactResult: "failed",
                compactError: A instanceof Error ? A.message : String(A)
            }), _.signal.aborted) throw Error("Compaction canceled.");
        else if (p86(A, QI6)) throw Error(QI6);
        else if (p86(A, ql8)) throw Error(ql8);
        else if (A instanceof be) throw A;
        else throw j6(A), Error(`Error during compaction: ${A instanceof Error?A.message:String(A)}`, {
            cause: A
        })
    }
}
// @from(Ln 434940, Col 4)
oIK = L(() => {
    Y3();
    sy();
    hk();
    zp();
    ep();
    ye6();
    $y();
    JR6();
    XR6();
    re6();
    wc();
    m8();
    K9();
    U8();
    _7();
    Ig8();
    pC6();
    uf()
})
// @from(Ln 434960, Col 4)
MLY
// @from(Ln 434960, Col 9)
Un8
// @from(Ln 434961, Col 4)
aIK = L(() => {
    Q8();
    MLY = {
        type: "local",
        name: "compact",
        description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
        isEnabled: () => !S6(process.env.DISABLE_COMPACT),
        supportsNonInteractive: !0,
        argumentHint: "<optional custom summarization instructions>",
        load: () => Promise.resolve().then(() => (oIK(), rIK))
    }, Un8 = MLY
})
// @from(Ln 434973, Col 4)
sIK = {}
// @from(Ln 434979, Col 0)
function PLY(q, K) {
    let {
        window: _,
        configured: z,
        source: Y
    } = Jn(q, K), A = Y === "env" ? " (from CLAUDE_CODE_AUTO_COMPACT_WINDOW)" : Y === "settings" ? " (from settings)" : Y === "experiment" ? " (from default)" : " (model default)", O = z > _ ? ` · capped to ${h3(_)} by model` : "", w = [`Auto-compact window: ${h3(z)} tokens${A}${O}`];
    if (!z0()) w.push("Auto-compact is currently disabled (see /config)");
    return w.push("Auto-compact summarizes the conversation when context usage approaches this limit. The actual threshold is the minimum of this setting and your model's context window."), w.join(`
`)
}
// @from(Ln 434990, Col 0)
function l98(q, K) {
    if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) return "CLAUDE_CODE_AUTO_COMPACT_WINDOW is set and takes precedence. Unset it to change this setting.";
    let _ = K.options.mainLoopModel,
        z = q.trim().toLowerCase(),
        Y = z === "reset" || z === "unset" || z === "default",
        A = Y ? void 0 : s_7(z);
    if (!Y && A === void 0) return `Invalid argument: ${q}. Expected 100k–1M tokens (e.g. 500k, 200000, or 200 as shorthand) or 'reset'`;
    P7("userSettings", {
        autoCompactWindow: A
    }), K.setAppState((J) => J.autoCompactWindow === A ? J : {
        ...J,
        autoCompactWindow: A
    }), d("tengu_autocompact_command", {
        action: Y ? "reset" : "set",
        ...A !== void 0 && {
            tokens: A
        }
    });
    let O = v7().autoCompactWindow,
        {
            window: w,
            source: $
        } = Jn(_, O),
        j = $ === "env" || $ === "experiment" || O !== A;
    if (Y) return j ? `Auto-compact window reset in settings, but a higher-priority override is active (${h3(w)} tokens)` : "Auto-compact window reset to model default";
    let H = "";
    if (j) H = `, but a higher-priority override is active (${h3(w)} tokens)`;
    else if (w < A) H = ` (capped to model limit of ${h3(w)})`;
    return `Auto-compact window set to ${h3(A)} tokens${H}`
}
// @from(Ln 435020, Col 4)
WLY = async (q, K) => {
    let _ = q.trim();
    if (!_) return {
        type: "text",
        value: PLY(K.options.mainLoopModel, K.getAppState().autoCompactWindow)
    };
    return {
        type: "text",
        value: l98(_, K)
    }
}
// @from(Ln 435031, Col 4)
QA7 = L(() => {
    C8();
    rR();
    c7();
    a1()
})
// @from(Ln 435037, Col 4)
tIK = {}
// @from(Ln 435042, Col 0)
function ZLY(q) {
    let K = s(45),
        {
            onDone: _,
            context: z
        } = q,
        Y = M8(GLY),
        A = s2(),
        O;
    if (K[0] !== Y || K[1] !== A) O = Jn(A, Y), K[0] = Y, K[1] = A, K[2] = O;
    else O = K[2];
    let {
        window: w,
        configured: $,
        source: j
    } = O, H;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) H = z0(), K[3] = H;
    else H = K[3];
    let J = H,
        X = $ > w,
        M = j === "env",
        P = j === "env" ? "from CLAUDE_CODE_AUTO_COMPACT_WINDOW" : j === "settings" ? "from settings" : j === "experiment" ? "from default" : "model default",
        W = j === "model" || j === "experiment" ? Dx6 : Math.min(lA7, Math.max(cA7, Math.round($ / dA7) * dA7)),
        [D, Z] = nA7.useState(W),
        [G, f] = nA7.useState(!1),
        v;
    if (K[4] !== M) v = function(q6) {
        if (M) return;
        f(!0), Z((o) => {
            if (o === Dx6) return q6 > 0 ? cA7 : lA7;
            let _6 = o + q6 * dA7;
            if (_6 < cA7) return Dx6;
            if (_6 > lA7) return Dx6;
            return _6
        })
    }, K[4] = M, K[5] = v;
    else v = K[5];
    let V = v,
        k;
    if (K[6] !== X || K[7] !== w) k = X ? ` · capped to ${h3(w)} by model` : "", K[6] = X, K[7] = w, K[8] = k;
    else k = K[8];
    let N = k,
        R;
    if (K[9] !== $) R = h3($), K[9] = $, K[10] = R;
    else R = K[10];
    let h = `${R} tokens (${P})${N}`,
        C;
    if (K[11] !== G || K[12] !== z || K[13] !== h || K[14] !== _ || K[15] !== D) C = function() {
        if (!G) {
            _(`Auto-compact window unchanged: ${h}`);
            return
        }
        let q6 = D === Dx6 ? "reset" : String(D);
        _(l98(q6, z))
    }, K[11] = G, K[12] = z, K[13] = h, K[14] = _, K[15] = D, K[16] = C;
    else C = K[16];
    let x = C,
        B, m;
    if (K[17] !== V) B = () => V(1), m = () => V(-1), K[17] = V, K[18] = B, K[19] = m;
    else B = K[18], m = K[19];
    let S;
    if (K[20] !== x || K[21] !== B || K[22] !== m) S = {
        "select:previous": B,
        "select:next": m,
        "select:accept": x
    }, K[20] = x, K[21] = B, K[22] = m, K[23] = S;
    else S = K[23];
    let F;
    if (K[24] === Symbol.for("react.memo_cache_sentinel")) F = {
        context: "Select"
    }, K[24] = F;
    else F = K[24];
    L7(S, F);
    let U;
    if (K[25] !== V) U = {
        "tabs:next": () => V(1),
        "tabs:previous": () => V(-1)
    }, K[25] = V, K[26] = U;
    else U = K[26];
    let g;
    if (K[27] === Symbol.for("react.memo_cache_sentinel")) g = {
        context: "Tabs"
    }, K[27] = g;
    else g = K[27];
    L7(U, g);
    let c;
    if (K[28] !== D) c = D === Dx6 ? "Model default" : `${h3(D)} tokens`, K[28] = D, K[29] = c;
    else c = K[29];
    let n = c,
        l = `Current setting: ${h}`,
        z6;
    if (K[30] !== h || K[31] !== _) z6 = () => _(`Auto-compact window unchanged: ${h}`), K[30] = h, K[31] = _, K[32] = z6;
    else z6 = K[32];
    let A6, e;
    if (K[33] === Symbol.for("react.memo_cache_sentinel")) A6 = dz.createElement(T, null, "This command configures when auto-compaction happens. The actual threshold is the minimum of this setting and your model's context window."), e = !J && dz.createElement(T, {
        color: "warning"
    }, "Auto-compact is currently disabled (see /config)"), K[33] = A6, K[34] = e;
    else A6 = K[33], e = K[34];
    let i;
    if (K[35] !== n || K[36] !== M) i = M ? dz.createElement(T, {
        color: "warning"
    }, "CLAUDE_CODE_AUTO_COMPACT_WINDOW is set and takes precedence. Unset it to change this setting here.") : dz.createElement(u, null, dz.createElement(T, null, "Select auto-compact window: "), dz.createElement(T, {
        bold: !0,
        color: "suggestion"
    }, n)), K[35] = n, K[36] = M, K[37] = i;
    else i = K[37];
    let O6;
    if (K[38] === Symbol.for("react.memo_cache_sentinel")) O6 = dz.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, dz.createElement(T, {
        bold: !0
    }, "Long context that holds up"), dz.createElement(T, null, "Both Opus 4.6 and Sonnet 4.6 achieve state-of-the-art scores on long-context retrieval benchmarks at 1M tokens — Opus 4.6 scores 78.3% on MRCR v2, the highest among frontier models at that length. Opus 4.6 includes 1M context at standard pricing; Sonnet 4.6 1M is available with overages."), dz.createElement(T, {
        dimColor: !0
    }, "Learn more: ", DLY)), K[38] = O6;
    else O6 = K[38];
    let J6;
    if (K[39] !== i) J6 = dz.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, A6, e, i, O6), K[39] = i, K[40] = J6;
    else J6 = K[40];
    let $6;
    if (K[41] !== l || K[42] !== z6 || K[43] !== J6) $6 = dz.createElement(R1, {
        title: "Auto-compact",
        subtitle: l,
        onCancel: z6,
        inputGuide: fLY
    }, J6), K[41] = l, K[42] = z6, K[43] = J6, K[44] = $6;
    else $6 = K[44];
    return $6
}
// @from(Ln 435175, Col 0)
function fLY() {
    return dz.createElement(T, {
        dimColor: !0
    }, dz.createElement(z1, null, dz.createElement(A8, {
        chord: ["up", "down"],
        action: "change"
    }), dz.createElement(A8, {
        chord: "enter",
        action: "apply"
    }), dz.createElement(A8, {
        chord: "escape",
        action: "cancel"
    })))
}
// @from(Ln 435190, Col 0)
function GLY(q) {
    return q.autoCompactWindow
}
// @from(Ln 435193, Col 4)
dz
// @from(Ln 435193, Col 8)
nA7
// @from(Ln 435193, Col 13)
DLY = "https://claude.com/blog/1m-context-ga"
// @from(Ln 435194, Col 4)
dA7 = 1e5
// @from(Ln 435195, Col 4)
cA7 = 1e5
// @from(Ln 435196, Col 4)
lA7 = 1e6
// @from(Ln 435197, Col 4)
Dx6 = 0
// @from(Ln 435198, Col 4)
vLY = async (q, K, _) => {
        let z = _?.trim() || "";
        if (z) {
            let Y = l98(z, K);
            return q(Y), null
        }
        return d("tengu_autocompact_dialog_opened", {
            source: "dialog"
        }), dz.createElement(ZLY, {
            onDone: q,
            context: K
        })
    }
// @from(Ln 435211, Col 4)
eIK = L(() => {
    o6();
    Nq();
    S4();
    u7();
    oy();
    g6();
    C7();
    C8();
    rR();
    N7();
    c7();
    QA7();
    dz = K6(P6(), 1), nA7 = K6(P6(), 1)
})
// @from(Ln 435226, Col 4)
qxK
// @from(Ln 435226, Col 9)
iA7
// @from(Ln 435227, Col 4)
KxK = L(() => {
    y8();
    qxK = {
        type: "local-jsx",
        name: "autocompact",
        description: "Configure the auto-compact window size",
        isEnabled: () => !I7(),
        isHidden: !1,
        argumentHint: "[tokens|reset]",
        load: () => Promise.resolve().then(() => (eIK(), tIK)),
        userFacingName() {
            return "autocompact"
        }
    }, iA7 = {
        type: "local",
        name: "autocompact",
        supportsNonInteractive: !0,
        description: "Configure the auto-compact window size",
        get isHidden() {
            return !I7()
        },
        isEnabled() {
            return I7()
        },
        argumentHint: "[tokens|reset]",
        load: () => Promise.resolve().then(() => (QA7(), sIK)),
        userFacingName() {
            return "autocompact"
        }
    }
})
// @from(Ln 435259, Col 0)
function JL(q) {
    let K = s(31),
        {
            title: _,
            color: z,
            defaultTab: Y,
            children: A,
            hidden: O,
            useFullWidth: w,
            selectedTab: $,
            onTabChange: j,
            banner: H,
            disableNavigation: J,
            initialHeaderFocused: X,
            contentHeight: M,
            navFromContent: P
        } = q,
        W = X === void 0 ? !0 : X,
        D = P === void 0 ? !1 : P,
        {
            columns: Z
        } = s1(),
        G = A.map(NLY),
        f = Y ? G.findIndex((Z8) => Y === Z8[0]) : 0,
        v = $ !== void 0,
        [V, k] = q$.useState(f !== -1 ? f : 0),
        N = v ? G.findIndex((Z8) => Z8[0] === $) : -1,
        R = v ? N !== -1 ? N : 0 : V,
        h = jj4(),
        C = !1,
        x = q$.useRef(null),
        {
            focus: B,
            focusDirection: m,
            blur: S
        } = oN6(),
        [F, U] = q$.useState(W),
        g;
    if (K[0] !== B) g = () => {
        U(!0)
    }, K[0] = B, K[1] = g;
    else g = K[1];
    let c = g,
        n;
    if (K[2] !== S) n = () => {
        U(!1)
    }, K[2] = S, K[3] = n;
    else n = K[3];
    let l = n,
        [z6, A6] = q$.useState(0),
        e;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) e = () => {
        return A6(kLY), () => A6(VLY)
    }, K[4] = e;
    else e = K[4];
    let i = e,
        O6 = z6 > 0,
        J6 = (Z8) => {
            let N8 = (R + G.length + Z8) % G.length,
                R6 = G[N8]?.[0];
            if (v && j && R6) j(R6);
            else k(N8);
            c()
        },
        $6 = !O && !J && F,
        H6;
    if (K[5] !== $6) H6 = {
        context: "Tabs",
        isActive: $6
    }, K[5] = $6, K[6] = H6;
    else H6 = K[6];
    L7({
        "tabs:next": () => J6(1),
        "tabs:previous": () => J6(-1)
    }, H6);
    let q6;
    if (K[7] !== J || K[8] !== m || K[9] !== F || K[10] !== O || K[11] !== O6) q6 = (Z8) => {
        if (O || J) return;
        if (!F || !O6) return;
        if (Z8.key === "down") Z8.preventDefault(), U(!1)
    }, K[7] = J, K[8] = m, K[9] = F, K[10] = O, K[11] = O6, K[12] = q6;
    else q6 = K[12];
    let o = q6,
        _6 = D && !F && O6 && !O && !J,
        r;
    if (K[13] !== _6) r = {
        context: "Tabs",
        isActive: _6
    }, K[13] = _6, K[14] = r;
    else r = K[14];
    L7({
        "tabs:next": () => J6(1),
        "tabs:previous": () => J6(-1)
    }, r);
    let t = _ ? N1(_) + 1 : 0,
        Y6 = G.reduce(TLY, 0),
        X6 = t + Y6,
        M6 = w ? Math.max(0, Z - X6) : 0,
        W6 = w ? Z : void 0,
        V6 = u,
        f6 = "column",
        G6 = 0,
        k6 = W,
        T6 = o,
        v6 = h ? 0 : void 0,
        L6 = !O && q$.default.createElement(u, {
            ref: void 0,
            tabIndex: void 0,
            autoFocus: void 0,
            onFocus: void 0,
            onBlur: void 0,
            onKeyDown: void 0,
            flexDirection: "row",
            gap: 1,
            flexShrink: h ? 0 : void 0,
            alignSelf: void 0
        }, _ !== void 0 && q$.default.createElement(T, {
            bold: !0,
            color: z
        }, _), G.map((Z8, N8) => {
            let [R6, p6] = Z8;
            return q$.default.createElement(ELY, {
                key: R6,
                title: p6,
                isCurrent: R === N8,
                headerFocused: F,
                color: z
            })
        }), M6 > 0 && q$.default.createElement(T, null, " ".repeat(M6))),
        y6;
    if (K[15] !== A || K[16] !== M || K[17] !== W6 || K[18] !== O || K[19] !== h || K[20] !== R) y6 = h ? q$.default.createElement(u, {
        width: W6,
        marginTop: O ? 0 : 1,
        flexShrink: 0
    }, q$.default.createElement(Px6, {
        key: R,
        ref: h,
        flexDirection: "column",
        flexShrink: 0
    }, A)) : q$.default.createElement(u, {
        width: W6,
        marginTop: O ? 0 : 1,
        height: M,
        overflowY: M !== void 0 ? "hidden" : void 0
    }, A), K[15] = A, K[16] = M, K[17] = W6, K[18] = O, K[19] = h, K[20] = R, K[21] = y6;
    else y6 = K[21];
    let c6;
    if (K[22] !== V6 || K[23] !== H || K[24] !== G6 || K[25] !== k6 || K[26] !== T6 || K[27] !== v6 || K[28] !== L6 || K[29] !== y6) c6 = q$.default.createElement(V6, {
        flexDirection: f6,
        tabIndex: G6,
        autoFocus: k6,
        onKeyDown: T6,
        flexShrink: v6
    }, L6, H, y6), K[22] = V6, K[23] = H, K[24] = G6, K[25] = k6, K[26] = T6, K[27] = v6, K[28] = L6, K[29] = y6, K[30] = c6;
    else c6 = K[30];
    return q$.default.createElement(Qn8.Provider, {
        value: {
            selectedTab: G[R][0],
            width: W6,
            headerFocused: F,
            focusHeader: c,
            blurHeader: l,
            registerOptIn: i
        }
    }, c6)
}
// @from(Ln 435426, Col 0)
function TLY(q, K) {
    let [, _] = K;
    return q + (_ ? N1(_) : 0) + 2 + 1
}
// @from(Ln 435431, Col 0)
function VLY(q) {
    return q - 1
}
// @from(Ln 435435, Col 0)
function kLY(q) {
    return q + 1
}
// @from(Ln 435439, Col 0)
function NLY(q) {
    return [q.props.id ?? q.props.title, q.props.title]
}
// @from(Ln 435443, Col 0)
function ELY(q) {
    let K = s(11),
        {
            title: _,
            isCurrent: z,
            headerFocused: Y,
            color: A
        } = q,
        O = z && Y,
        w;
    if (K[0] !== O) w = {
        line: 0,
        column: 1,
        active: O
    }, K[0] = O, K[1] = w;
    else w = K[1];
    let $ = n46(w),
        j = A && z && Y,
        H = j ? A : void 0,
        J = j ? "inverseText" : void 0,
        X = z && !j,
        M;
    if (K[2] !== z || K[3] !== H || K[4] !== J || K[5] !== X || K[6] !== _) M = q$.default.createElement(T, {
        backgroundColor: H,
        color: J,
        inverse: X,
        bold: z
    }, " ", _, " "), K[2] = z, K[3] = H, K[4] = J, K[5] = X, K[6] = _, K[7] = M;
    else M = K[7];
    let P;
    if (K[8] !== $ || K[9] !== M) P = q$.default.createElement(u, {
        ref: $
    }, M), K[8] = $, K[9] = M, K[10] = P;
    else P = K[10];
    return P
}
// @from(Ln 435480, Col 0)
function $O(q) {
    let K = s(4),
        {
            title: _,
            id: z,
            children: Y
        } = q,
        {
            selectedTab: A,
            width: O
        } = q$.useContext(Qn8),
        w = bP();
    if (A !== (z ?? _)) return null;
    let $ = w ? 0 : void 0,
        j;
    if (K[0] !== Y || K[1] !== $ || K[2] !== O) j = q$.default.createElement(u, {
        width: O,
        flexShrink: $
    }, Y), K[0] = Y, K[1] = $, K[2] = O, K[3] = j;
    else j = K[3];
    return j
}
// @from(Ln 435503, Col 0)
function _xK() {
    let {
        width: q
    } = q$.useContext(Qn8);
    return q
}
// @from(Ln 435510, Col 0)
function uX() {
    let q = s(6),
        {
            headerFocused: K,
            focusHeader: _,
            blurHeader: z,
            registerOptIn: Y
        } = q$.useContext(Qn8),
        A;
    if (q[0] !== Y) A = [Y], q[0] = Y, q[1] = A;
    else A = q[1];
    q$.useEffect(Y, A);
    let O;
    if (q[2] !== z || q[3] !== _ || q[4] !== K) O = {
        headerFocused: K,
        focusHeader: _,
        blurHeader: z
    }, q[2] = z, q[3] = _, q[4] = K, q[5] = O;
    else O = q[5];
    return O
}
// @from(Ln 435531, Col 4)
q$
// @from(Ln 435531, Col 8)
Qn8
// @from(Ln 435532, Col 4)
BT = L(() => {
    o6();
    Mk();
    I4();
    En8();
    bs6();
    uE8();
    n5();
    g6();
    C7();
    q$ = K6(P6(), 1), Qn8 = q$.createContext({
        selectedTab: void 0,
        width: void 0,
        headerFocused: !1,
        focusHeader: () => {},
        blurHeader: () => {},
        registerOptIn: () => () => {}
    })
})
// @from(Ln 435552, Col 0)
function vu() {
    let q = v7()?.autoUpdatesChannel;
    if (q) return q;
    return "latest"
}
// @from(Ln 435557, Col 4)
h_6 = L(() => {
    B1();
    a1()
})
// @from(Ln 435562, Col 0)
function LLY(q, K) {
    switch (q) {
        case "grid":
            return 3 * K + 1;
        case "simple":
            return 3 * K - 1;
        case "minimal":
        case "plain":
            return oA7 * (K - 1)
    }
}
// @from(Ln 435574, Col 0)
function hLY(q) {
    if (typeof q === "string" || typeof q === "number") return !0;
    if (jY.isValidElement(q) && q.type === jY.Fragment) return !0;
    return !1
}
// @from(Ln 435580, Col 0)
function RLY(q, K, _) {
    if (!hLY(q)) return q;
    return jY.default.createElement(T, {
        dimColor: K.dim && !_,
        bold: K.bold || _
    }, q)
}
// @from(Ln 435588, Col 0)
function zxK(q) {
    return N1(qj6(q))
}
// @from(Ln 435592, Col 0)
function SLY(q, K, _, z, Y) {
    let A = q.length,
        O = q.map((j, H) => {
            let J = _ ? zxK(j.header) : 0;
            for (let X of K) J = Math.max(J, zxK(X[H]));
            return J
        }),
        w = Array(A),
        $ = [];
    for (let j = 0; j < A; j++) {
        let H = q[j].width;
        if (typeof H === "number") w[j] = H;
        else if (H && "ratio" in H && H.ratio !== void 0) $.push(j), w[j] = 0;
        else if (H) w[j] = lE(O[j], H.min ?? 0, H.max ?? 1 / 0);
        else w[j] = O[j]
    }
    if ($.length > 0) {
        let j = w.reduce((X, M) => X + M, 0),
            H = Math.max(0, z - LLY(Y, A) - j),
            J = $.reduce((X, M) => X + (q[M].width.ratio ?? 0), 0);
        for (let X of $) {
            let M = q[X].width,
                P = J > 0 ? Math.floor(H * (M.ratio ?? 0) / J) : 0;
            w[X] = lE(P, M.min ?? 1, M.max ?? 1 / 0)
        }
    }
    return w
}
// @from(Ln 435621, Col 0)
function CLY(q) {
    let K = s(2),
        {
            box: _
        } = q;
    if (_ === "grid" || _ === "simple") {
        let Y;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = jY.default.createElement(T, {
            dimColor: !0
        }, " │ "), K[0] = Y;
        else Y = K[0];
        return Y
    }
    let z;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) z = jY.default.createElement(u, {
        width: oA7,
        flexShrink: 0
    }), K[1] = z;
    else z = K[1];
    return z
}
// @from(Ln 435643, Col 0)
function YxK(q) {
    let K = s(3),
        {
            box: _,
            side: z
        } = q;
    if (_ === "grid") {
        let Y = z === "left" ? "│ " : " │",
            A;
        if (K[0] !== Y) A = jY.default.createElement(T, {
            dimColor: !0
        }, Y), K[0] = Y, K[1] = A;
        else A = K[1];
        return A
    }
    if (_ === "simple") {
        let Y;
        if (K[2] === Symbol.for("react.memo_cache_sentinel")) Y = jY.default.createElement(T, null, " "), K[2] = Y;
        else Y = K[2];
        return Y
    }
    return null
}
// @from(Ln 435667, Col 0)
function rA7(q) {
    let K = s(19),
        {
            box: _,
            type: z,
            widths: Y
        } = q;
    if (_ === "minimal") {
        let X;
        if (K[0] !== Y) X = Y.map(ILY), K[0] = Y, K[1] = X;
        else X = K[1];
        let M;
        if (K[2] !== X) M = jY.default.createElement(u, {
            flexDirection: "row"
        }, X), K[2] = X, K[3] = M;
        else M = K[3];
        return M
    }
    let A, O, w, $, j, H;
    if (K[4] !== _ || K[5] !== z || K[6] !== Y) {
        H = Symbol.for("react.early_return_sentinel");
        q: {
            let X = Y.map(bLY);
            if (_ === "simple") {
                H = jY.default.createElement(T, {
                    dimColor: !0
                }, X.join("┼"));
                break q
            }
            let [M, P, W] = z === "top" ? ["┌", "┬", "┐"] : z === "bottom" ? ["└", "┴", "┘"] : ["├", "┼", "┤"];O = W,
            A = T,
            w = !0,
            $ = M,
            j = X.join(P)
        }
        K[4] = _, K[5] = z, K[6] = Y, K[7] = A, K[8] = O, K[9] = w, K[10] = $, K[11] = j, K[12] = H
    } else A = K[7], O = K[8], w = K[9], $ = K[10], j = K[11], H = K[12];
    if (H !== Symbol.for("react.early_return_sentinel")) return H;
    let J;
    if (K[13] !== A || K[14] !== O || K[15] !== w || K[16] !== $ || K[17] !== j) J = jY.default.createElement(A, {
        dimColor: w
    }, $, j, O), K[13] = A, K[14] = O, K[15] = w, K[16] = $, K[17] = j, K[18] = J;
    else J = K[18];
    return J
}
// @from(Ln 435713, Col 0)
function bLY(q) {
    return "─".repeat(q + 2)
}
// @from(Ln 435717, Col 0)
function ILY(q, K) {
    return jY.default.createElement(jY.default.Fragment, {
        key: K
    }, K > 0 && jY.default.createElement(u, {
        width: oA7,
        flexShrink: 0
    }), jY.default.createElement(T, {
        dimColor: !0
    }, "─".repeat(q)))
}