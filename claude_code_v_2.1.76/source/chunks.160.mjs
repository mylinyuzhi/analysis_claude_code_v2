
// @from(Ln 409102, Col 0)
async function NHq(A, q = {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.76",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-03-14T00:12:49Z"
}.VERSION) {
    let K = await sL1();
    if (A !== q || !K) Xc8().catch((_) => _6(_ instanceof Error ? _ : Error("Failed to fetch changelog")));
    let Y = vHq(q, A, K);
    return {
        hasReleaseNotes: Y.length > 0,
        releaseNotes: Y
    }
}
// @from(Ln 409119, Col 0)
function VHq(A, q = {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.76",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-03-14T00:12:49Z"
}.VERSION) {
    let K = vHq(q, A);
    return {
        hasReleaseNotes: K.length > 0,
        releaseNotes: K
    }
}
// @from(Ln 409133, Col 4)
Mc8
// @from(Ln 409133, Col 9)
JtY = 5
// @from(Ln 409134, Col 4)
fHq = "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md"
// @from(Ln 409135, Col 4)
MtY = "https://raw.githubusercontent.com/anthropics/claude-code/refs/heads/main/CHANGELOG.md"
// @from(Ln 409136, Col 4)
zN6 = null
// @from(Ln 409137, Col 4)
_N6 = E(() => {
    k1();
    kK();
    k8();
    T1();
    A8();
    Mc8 = t(lD6(), 1)
})
// @from(Ln 409145, Col 4)
EHq = {}
// @from(Ln 409150, Col 0)
function kHq(A) {
    return A.map(([q, K]) => {
        let Y = `Version ${q}:`,
            z = K.map((_) => `• ${_}`).join(`
`);
        return `${Y}
${z}`
    }).join(`

`)
}
// @from(Ln 409161, Col 0)
async function DtY() {
    let A = [];
    try {
        let K = new Promise((Y, z) => {
            setTimeout((_) => _(Error("Timeout")), 500, z)
        });
        await Promise.race([Xc8(), K]), A = Pc8(await sL1())
    } catch {}
    if (A.length > 0) return {
        type: "text",
        value: kHq(A)
    };
    let q = Pc8(await sL1());
    if (q.length > 0) return {
        type: "text",
        value: kHq(q)
    };
    return {
        type: "text",
        value: `See the full changelog at: ${fHq}`
    }
}
// @from(Ln 409183, Col 4)
yHq = E(() => {
    _N6()
})
// @from(Ln 409186, Col 4)
XtY
// @from(Ln 409186, Col 9)
LHq
// @from(Ln 409187, Col 4)
RHq = E(() => {
    XtY = {
        description: "View release notes",
        isEnabled: () => !0,
        isHidden: !1,
        name: "release-notes",
        userFacingName() {
            return "release-notes"
        },
        type: "local",
        supportsNonInteractive: !0,
        load: () => Promise.resolve().then(() => (yHq(), EHq))
    }, LHq = XtY
})
// @from(Ln 409202, Col 0)
function PtY(A) {
    let q = [];
    for (let Y of A) {
        if (Y.type !== "user" && Y.type !== "assistant") continue;
        if ("isMeta" in Y && Y.isMeta) continue;
        let z = Y.message.content;
        if (typeof z === "string") q.push(z);
        else if (Array.isArray(z)) {
            for (let _ of z)
                if ("type" in _ && _.type === "text" && "text" in _) q.push(_.text)
        }
    }
    let K = q.join(`
`);
    if (K.length > hHq) return K.slice(-hHq);
    return K
}
// @from(Ln 409219, Col 0)
async function SHq(A, q) {
    let K = PtY(A);
    if (!K) return null;
    try {
        let z = (await WX({
                systemPrompt: uq(['Generate a short kebab-case name (2-4 words) that captures the main topic of this conversation. Use lowercase words separated by hyphens. Examples: "fix-login-bug", "add-auth-feature", "refactor-api-client", "debug-test-failures". Return JSON with a "name" field.']),
                userPrompt: K,
                outputFormat: {
                    type: "json_schema",
                    schema: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string"
                            }
                        },
                        required: ["name"],
                        additionalProperties: !1
                    }
                },
                signal: q,
                options: {
                    querySource: "rename_generate_name",
                    agents: [],
                    isNonInteractiveSession: !1,
                    hasAppendSystemPrompt: !1,
                    mcpTools: []
                }
            })).message.content.filter((w) => w.type === "text").map((w) => w.text).join(""),
            _ = WK(z);
        if (_ && typeof _ === "object" && "name" in _ && typeof _.name === "string") return _.name;
        return null
    } catch (Y) {
        return _6(Y), null
    }
}
// @from(Ln 409255, Col 4)
hHq = 1000
// @from(Ln 409256, Col 4)
CHq = E(() => {
    gw();
    K_();
    k1()
})
// @from(Ln 409261, Col 4)
dn6 = {}
// @from(Ln 409268, Col 0)
async function Wc8({
    environmentId: A,
    title: q,
    events: K,
    gitRepoUrl: Y,
    branch: z,
    signal: _,
    baseUrl: w,
    getAccessToken: O,
    permissionMode: $
}) {
    let {
        getClaudeAIOAuthTokens: H
    } = await Promise.resolve().then(() => (fA(), S16)), {
        getOrganizationUUID: j
    } = await Promise.resolve().then(() => (W0(), SZ6)), {
        getOauthConfig: J
    } = await Promise.resolve().then(() => (F5(), q$6)), {
        getOAuthHeaders: M
    } = await Promise.resolve().then(() => (EZ(), Xc6)), {
        parseGitHubRepository: D
    } = await Promise.resolve().then(() => (yG(), gC6)), {
        getDefaultBranch: X
    } = await Promise.resolve().then(() => ($5(), h58)), {
        getMainLoopModel: P
    } = await Promise.resolve().then(() => (z4(), IHq)), {
        default: W
    } = await Promise.resolve().then(() => (kK(), G$6)), Z = O?.() ?? H()?.accessToken;
    if (!Z) return k("[bridge] No access token for session creation"), null;
    let G = await j();
    if (!G) return k("[bridge] No org UUID for session creation"), null;
    let f = null,
        v = null;
    if (Y) {
        let {
            parseGitRemote: I
        } = await Promise.resolve().then(() => (yG(), gC6)), g = I(Y);
        if (g) {
            let {
                host: B,
                owner: b,
                name: p
            } = g, Q = z || await X() || void 0;
            f = {
                type: "git_repository",
                url: `https://${B}/${b}/${p}`,
                revision: Q
            }, v = {
                type: "git_repository",
                git_info: {
                    type: "github",
                    repo: `${b}/${p}`,
                    branches: [`claude/${z||"task"}`]
                }
            }
        } else {
            let B = D(Y);
            if (B) {
                let [b, p] = B.split("/");
                if (b && p) {
                    let Q = z || await X() || void 0;
                    f = {
                        type: "git_repository",
                        url: `https://github.com/${b}/${p}`,
                        revision: Q
                    }, v = {
                        type: "git_repository",
                        git_info: {
                            type: "github",
                            repo: `${b}/${p}`,
                            branches: [`claude/${z||"task"}`]
                        }
                    }
                }
            }
        }
    }
    let N = {
            ...q !== void 0 && {
                title: q
            },
            events: K,
            session_context: {
                sources: f ? [f] : [],
                outcomes: v ? [v] : [],
                model: P()
            },
            environment_id: A,
            source: "remote-control",
            ...$ && {
                permission_mode: $
            }
        },
        V = {
            ...M(Z),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": G
        },
        L = `${w??J().BASE_API_URL}/v1/sessions`,
        h;
    try {
        h = await W.post(L, N, {
            headers: V,
            signal: _,
            validateStatus: (I) => I < 500
        })
    } catch (I) {
        return k(`[bridge] Session creation request failed: ${_1(I)}`), null
    }
    if (!(h.status === 200 || h.status === 201)) {
        let I = AR1(h.data);
        return k(`[bridge] Session creation failed with status ${h.status}${I?`: ${I}`:""}`), null
    }
    let u = h.data;
    if (!u || typeof u !== "object" || !("id" in u) || typeof u.id !== "string") return k("[bridge] No session ID in response"), null;
    return u.id
}
// @from(Ln 409385, Col 0)
async function WtY(A, q) {
    let {
        getClaudeAIOAuthTokens: K
    } = await Promise.resolve().then(() => (fA(), S16)), {
        getOrganizationUUID: Y
    } = await Promise.resolve().then(() => (W0(), SZ6)), {
        getOauthConfig: z
    } = await Promise.resolve().then(() => (F5(), q$6)), {
        getOAuthHeaders: _
    } = await Promise.resolve().then(() => (EZ(), Xc6)), {
        default: w
    } = await Promise.resolve().then(() => (kK(), G$6)), O = q?.getAccessToken?.() ?? K()?.accessToken;
    if (!O) return k("[bridge] No access token for session fetch"), null;
    let $ = await Y();
    if (!$) return k("[bridge] No org UUID for session fetch"), null;
    let H = {
            ..._(O),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": $
        },
        j = `${q?.baseUrl??z().BASE_API_URL}/v1/sessions/${A}`;
    k(`[bridge] Fetching session ${A}`);
    let J;
    try {
        J = await w.get(j, {
            headers: H,
            timeout: 1e4,
            validateStatus: (M) => M < 500
        })
    } catch (M) {
        return k(`[bridge] Session fetch request failed: ${_1(M)}`), null
    }
    if (J.status !== 200) {
        let M = AR1(J.data);
        return k(`[bridge] Session fetch failed with status ${J.status}${M?`: ${M}`:""}`), null
    }
    return J.data
}
// @from(Ln 409423, Col 0)
async function Zc8(A, q) {
    let {
        getClaudeAIOAuthTokens: K
    } = await Promise.resolve().then(() => (fA(), S16)), {
        getOrganizationUUID: Y
    } = await Promise.resolve().then(() => (W0(), SZ6)), {
        getOauthConfig: z
    } = await Promise.resolve().then(() => (F5(), q$6)), {
        getOAuthHeaders: _
    } = await Promise.resolve().then(() => (EZ(), Xc6)), {
        default: w
    } = await Promise.resolve().then(() => (kK(), G$6)), O = q?.getAccessToken?.() ?? K()?.accessToken;
    if (!O) {
        k("[bridge] No access token for session archive");
        return
    }
    let $ = await Y();
    if (!$) {
        k("[bridge] No org UUID for session archive");
        return
    }
    let H = {
            ..._(O),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": $
        },
        j = `${q?.baseUrl??z().BASE_API_URL}/v1/sessions/${A}/archive`;
    k(`[bridge] Archiving session ${A}`);
    let J = await w.post(j, {}, {
        headers: H,
        timeout: 1e4,
        validateStatus: (M) => M < 500
    });
    if (J.status === 200) k(`[bridge] Session ${A} archived successfully`);
    else {
        let M = AR1(J.data);
        k(`[bridge] Session archive failed with status ${J.status}${M?`: ${M}`:""}`)
    }
}
// @from(Ln 409462, Col 0)
async function Gc8(A, q, K) {
    let {
        getClaudeAIOAuthTokens: Y
    } = await Promise.resolve().then(() => (fA(), S16)), {
        getOrganizationUUID: z
    } = await Promise.resolve().then(() => (W0(), SZ6)), {
        getOauthConfig: _
    } = await Promise.resolve().then(() => (F5(), q$6)), {
        getOAuthHeaders: w
    } = await Promise.resolve().then(() => (EZ(), Xc6)), {
        default: O
    } = await Promise.resolve().then(() => (kK(), G$6)), $ = K?.getAccessToken?.() ?? Y()?.accessToken;
    if (!$) {
        k("[bridge] No access token for session title update");
        return
    }
    let H = await z();
    if (!H) {
        k("[bridge] No org UUID for session title update");
        return
    }
    let j = {
            ...w($),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": H
        },
        J = `${K?.baseUrl??_().BASE_API_URL}/v1/sessions/${A}`;
    k(`[bridge] Updating session title: ${A} → ${q}`);
    try {
        let M = await O.patch(J, {
            title: q
        }, {
            headers: j,
            timeout: 1e4,
            validateStatus: (D) => D < 500
        });
        if (M.status === 200) k("[bridge] Session title updated successfully");
        else {
            let D = AR1(M.data);
            k(`[bridge] Session title update failed with status ${M.status}${D?`: ${D}`:""}`)
        }
    } catch (M) {
        k(`[bridge] Session title update request failed: ${_1(M)}`)
    }
}
// @from(Ln 409508, Col 0)
function AR1(A) {
    if (!A || typeof A !== "object") return;
    if ("message" in A && typeof A.message === "string") return A.message;
    if ("error" in A && A.error !== null && typeof A.error === "object" && "message" in A.error && typeof A.error.message === "string") return A.error.message;
    return
}
// @from(Ln 409514, Col 4)
wN6 = E(() => {
    H1();
    s8()
})
// @from(Ln 409518, Col 4)
bHq = {}
// @from(Ln 409522, Col 0)
async function ZtY(A, q, K) {
    if ($Y()) return A("Cannot rename: This session is a swarm teammate. Teammate names are set by the team leader.", {
        display: "system"
    }), null;
    let Y;
    if (!K || K.trim() === "") {
        let $ = await SHq(q.messages, q.abortController.signal);
        if (!$) return A("Could not generate a name: no conversation context yet. Usage: /rename <name>", {
            display: "system"
        }), null;
        Y = $
    } else Y = K.trim();
    let z = R1(),
        _ = Cz();
    await X_6(z, Y, _);
    let O = q.getAppState().replBridgeSessionId;
    if (O) Promise.resolve().then(() => (wN6(), dn6)).then(({
        updateBridgeSessionTitle: j
    }) => j(O, Y, {
        baseUrl: void 0,
        getAccessToken: void 0
    }).catch(() => {}));
    return await fc8(z, Y, _), q.setAppState(($) => ({
        ...$,
        standaloneAgentContext: {
            ...$.standaloneAgentContext,
            name: Y
        }
    })), A(`Session renamed to: ${Y}`, {
        display: "system"
    }), null
}
// @from(Ln 409554, Col 4)
xHq = E(() => {
    Oq();
    T1();
    zz();
    CHq()
})
// @from(Ln 409560, Col 4)
GtY
// @from(Ln 409560, Col 9)
uHq
// @from(Ln 409561, Col 4)
mHq = E(() => {
    GtY = {
        type: "local-jsx",
        name: "rename",
        description: "Rename the current conversation",
        isEnabled: () => !0,
        isHidden: !1,
        immediate: !0,
        argumentHint: "[name]",
        load: () => Promise.resolve().then(() => (xHq(), bHq)),
        userFacingName() {
            return "rename"
        }
    }, uHq = GtY
})
// @from(Ln 409577, Col 0)
function BHq(A) {
    let q = A6(47),
        {
            nodes: K,
            onSelect: Y,
            onCancel: z,
            onFocus: _,
            focusNodeId: w,
            visibleOptionCount: O,
            layout: $,
            isDisabled: H,
            hideIndexes: j,
            isNodeExpanded: J,
            onExpand: M,
            onCollapse: D,
            getParentPrefix: X,
            getChildPrefix: P,
            onUpFromFirstItem: W
        } = A,
        Z = $ === void 0 ? "expanded" : $,
        G = H === void 0 ? !1 : H,
        f = j === void 0 ? !1 : j,
        v;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) v = new Set, q[0] = v;
    else v = q[0];
    let [N, V] = cn6.default.useState(v), L = cn6.default.useRef(!1), h = cn6.default.useRef(null), R;
    if (q[1] !== N || q[2] !== J) R = (w6) => {
        if (J) return J(w6);
        return N.has(w6)
    }, q[1] = N, q[2] = J, q[3] = R;
    else R = q[3];
    let u = R,
        I;
    if (q[4] !== u || q[5] !== K) {
        let w6 = function(O6, L6, y6) {
            let G6 = !!O6.children && O6.children.length > 0,
                R6 = u(O6.id);
            if (I.push({
                    node: O6,
                    depth: L6,
                    isExpanded: R6,
                    hasChildren: G6,
                    parentId: y6
                }), G6 && R6 && O6.children)
                for (let T6 of O6.children) w6(T6, L6 + 1, O6.id)
        };
        I = [];
        for (let O6 of K) w6(O6, 0);
        q[4] = u, q[5] = K, q[6] = I
    } else I = q[6];
    let g = I,
        B = TtY,
        b = ftY,
        p = X ?? B,
        Q = P ?? b,
        U;
    if (q[7] !== Q || q[8] !== p) U = (w6) => {
        let O6 = "";
        if (w6.hasChildren) O6 = p(w6.isExpanded);
        else if (w6.depth > 0) O6 = Q(w6.depth);
        return O6 + w6.node.label
    }, q[7] = Q, q[8] = p, q[9] = U;
    else U = q[9];
    let r = U,
        e;
    if (q[10] !== r || q[11] !== g) e = g.map((w6) => ({
        label: r(w6),
        description: w6.node.description,
        dimDescription: w6.node.dimDescription ?? !0,
        value: w6.node.id
    })), q[10] = r, q[11] = g, q[12] = e;
    else e = q[12];
    let Y6 = e,
        H6;
    if (q[13] !== g) H6 = new Map, g.forEach((w6) => H6.set(w6.node.id, w6.node)), q[13] = g, q[14] = H6;
    else H6 = q[14];
    let J6 = H6,
        K6;
    if (q[15] !== g) K6 = (w6) => g.find((O6) => O6.node.id === w6), q[15] = g, q[16] = K6;
    else K6 = q[16];
    let s = K6,
        X6;
    if (q[17] !== s || q[18] !== D || q[19] !== M) X6 = (w6, O6) => {
        let L6 = s(w6);
        if (!L6 || !L6.hasChildren) return;
        if (O6)
            if (M) M(w6);
            else V((y6) => new Set([...y6, w6]));
        else if (D) D(w6);
        else V((y6) => {
            let G6 = new Set(y6);
            return G6.delete(w6), G6
        })
    }, q[17] = s, q[18] = D, q[19] = M, q[20] = X6;
    else X6 = q[20];
    let z6 = X6,
        N6;
    if (q[21] !== s || q[22] !== w || q[23] !== G || q[24] !== J6 || q[25] !== _ || q[26] !== z6) N6 = (w6, O6) => {
        if (!w || G) return;
        let L6 = s(w);
        if (!L6) return;
        if (O6.rightArrow && L6.hasChildren) z6(w, !0);
        else if (O6.leftArrow) {
            if (L6.hasChildren && L6.isExpanded) z6(w, !1);
            else if (L6.parentId !== void 0) {
                if (L.current = !0, z6(L6.parentId, !1), _) {
                    let y6 = J6.get(L6.parentId);
                    if (y6) _(y6)
                }
            }
        }
    }, q[21] = s, q[22] = w, q[23] = G, q[24] = J6, q[25] = _, q[26] = z6, q[27] = N6;
    else N6 = q[27];
    let $6 = !G,
        n;
    if (q[28] !== $6) n = {
        isActive: $6
    }, q[28] = $6, q[29] = n;
    else n = q[29];
    jA(N6, n);
    let o;
    if (q[30] !== J6 || q[31] !== Y) o = (w6) => {
        let O6 = J6.get(w6);
        if (!O6) return;
        Y(O6)
    }, q[30] = J6, q[31] = Y, q[32] = o;
    else o = q[32];
    let a = o,
        i;
    if (q[33] !== J6 || q[34] !== _) i = (w6) => {
        if (L.current) {
            L.current = !1;
            return
        }
        if (h.current === w6) return;
        if (h.current = w6, _) {
            let O6 = J6.get(w6);
            if (O6) _(O6)
        }
    }, q[33] = J6, q[34] = _, q[35] = i;
    else i = q[35];
    let l = i,
        q6;
    if (q[36] !== w || q[37] !== a || q[38] !== l || q[39] !== f || q[40] !== G || q[41] !== Z || q[42] !== z || q[43] !== W || q[44] !== Y6 || q[45] !== O) q6 = cn6.default.createElement(T8, {
        options: Y6,
        onChange: a,
        onFocus: l,
        onCancel: z,
        defaultFocusValue: w,
        visibleOptionCount: O,
        layout: Z,
        isDisabled: G,
        hideIndexes: f,
        onUpFromFirstItem: W
    }), q[36] = w, q[37] = a, q[38] = l, q[39] = f, q[40] = G, q[41] = Z, q[42] = z, q[43] = W, q[44] = Y6, q[45] = O, q[46] = q6;
    else q6 = q[46];
    return q6
}
// @from(Ln 409736, Col 0)
function ftY(A) {
    return "  ▸ "
}
// @from(Ln 409740, Col 0)
function TtY(A) {
    return A ? "▼ " : "▶ "
}
// @from(Ln 409743, Col 4)
cn6
// @from(Ln 409744, Col 4)
gHq = E(() => {
    e6();
    v3();
    i6();
    cn6 = t(P6(), 1)
})
// @from(Ln 409753, Col 0)
async function al(A) {
    let q = Date.now(),
        {
            stdout: K,
            code: Y
        } = await RA(hA(), ["worktree", "list", "--porcelain"], {
            cwd: A,
            preserveOutputOnError: !1
        }),
        z = Date.now() - q;
    if (Y !== 0) return d("tengu_worktree_detection", {
        duration_ms: z,
        worktree_count: 0,
        success: !1
    }), [];
    let _ = K.split(`
`).filter(($) => $.startsWith("worktree ")).map(($) => $.slice(9).normalize("NFC"));
    d("tengu_worktree_detection", {
        duration_ms: z,
        worktree_count: _.length,
        success: !0
    });
    let w = _.find(($) => A === $ || A.startsWith($ + vtY)),
        O = _.filter(($) => $ !== w).sort(($, H) => $.localeCompare(H));
    return w ? [w, ...O] : O
}
// @from(Ln 409779, Col 4)
ln6 = E(() => {
    Eq();
    V1();
    $5()
})
// @from(Ln 409785, Col 0)
function NtY(A) {
    let q = FHq.get(A);
    if (!q) q = new Set(A.filter((K) => K.renderGroupedToolUse).map((K) => K.name)), FHq.set(A, q);
    return q
}
// @from(Ln 409791, Col 0)
function Tc8(A) {
    if (A.type === "assistant" && A.message.content[0]?.type === "tool_use") {
        let q = A.message.content[0];
        return {
            messageId: A.message.id,
            toolUseId: q.id,
            toolName: q.name
        }
    }
    return null
}
// @from(Ln 409803, Col 0)
function pHq(A, q, K = !1) {
    if (K) return {
        messages: A
    };
    let Y = NtY(q),
        z = new Map;
    for (let j of A) {
        let J = Tc8(j);
        if (J && Y.has(J.toolName)) {
            let M = `${J.messageId}:${J.toolName}`,
                D = z.get(M) ?? [];
            D.push(j), z.set(M, D)
        }
    }
    let _ = new Map,
        w = new Set;
    for (let [j, J] of z)
        if (J.length >= 2) {
            _.set(j, J);
            for (let M of J) {
                let D = Tc8(M);
                if (D) w.add(D.toolUseId)
            }
        } let O = new Map;
    for (let j of A)
        if (j.type === "user") {
            for (let J of j.message.content)
                if (J.type === "tool_result" && w.has(J.tool_use_id)) O.set(J.tool_use_id, j)
        } let $ = [],
        H = new Set;
    for (let j of A) {
        let J = Tc8(j);
        if (J) {
            let M = `${J.messageId}:${J.toolName}`,
                D = _.get(M);
            if (D) {
                if (!H.has(M)) {
                    H.add(M);
                    let X = D[0],
                        P = [];
                    for (let Z of D) {
                        let G = Z.message.content[0].id,
                            f = O.get(G);
                        if (f) P.push(f)
                    }
                    let W = {
                        type: "grouped_tool_use",
                        toolName: J.toolName,
                        messages: D,
                        results: P,
                        displayMessage: X,
                        uuid: `grouped-${X.uuid}`,
                        timestamp: X.timestamp,
                        messageId: J.messageId
                    };
                    $.push(W)
                }
                continue
            }
        }
        if (j.type === "user") {
            let M = j.message.content.filter((D) => D.type === "tool_result");
            if (M.length > 0) {
                if (M.every((X) => w.has(X.tool_use_id))) continue
            }
        }
        $.push(j)
    }
    return {
        messages: $
    }
}
// @from(Ln 409875, Col 4)
FHq
// @from(Ln 409876, Col 4)
QHq = E(() => {
    FHq = new WeakMap
})
// @from(Ln 409880, Col 0)
function UHq(A) {
    return A.type === "attachment" && A.attachment.type === "task_status" && A.attachment.taskType === "in_process_teammate" && A.attachment.status === "completed"
}
// @from(Ln 409884, Col 0)
function dHq(A) {
    let q = [],
        K = 0;
    while (K < A.length) {
        let Y = A[K];
        if (UHq(Y)) {
            let z = 0;
            while (K < A.length && UHq(A[K])) z++, K++;
            if (z === 1) q.push(Y);
            else q.push({
                type: "attachment",
                uuid: Y.uuid,
                timestamp: Y.timestamp,
                attachment: {
                    type: "teammate_shutdown_batch",
                    count: z
                }
            })
        } else q.push(Y), K++
    }
    return q
}
// @from(Ln 409910, Col 0)
function cHq(A) {
    return CtY.filter((q) => q.isActive(A))
}
// @from(Ln 409913, Col 4)
u4
// @from(Ln 409913, Col 8)
ktY
// @from(Ln 409913, Col 13)
EtY
// @from(Ln 409913, Col 18)
ytY
// @from(Ln 409913, Col 23)
LtY
// @from(Ln 409913, Col 28)
RtY
// @from(Ln 409913, Col 33)
htY
// @from(Ln 409913, Col 38)
StY
// @from(Ln 409913, Col 43)
CtY
// @from(Ln 409914, Col 4)
lHq = E(() => {
    i6();
    lM();
    b7();
    lA();
    M4();
    fA();
    PU8();
    Sw();
    k$8();
    u4 = t(P6(), 1), ktY = {
        id: "large-memory-files",
        type: "warning",
        isActive: () => {
            return Pt().length > 0
        },
        render: () => {
            let A = Pt();
            return u4.createElement(u4.Fragment, null, A.map((q) => {
                let K = q.path.startsWith(G1()) ? VtY(G1(), q.path) : q.path;
                return u4.createElement(m, {
                    key: q.path,
                    flexDirection: "row"
                }, u4.createElement(T, {
                    color: "warning"
                }, a6.warning), u4.createElement(T, {
                    color: "warning"
                }, "Large ", u4.createElement(T, {
                    bold: !0
                }, K), " will impact performance (", fq(q.content.length), " chars >", " ", fq(JB), ")", u4.createElement(T, {
                    dimColor: !0
                }, " • /memory to edit")))
            }))
        }
    }, EtY = {
        id: "ultra-claude-md",
        type: "warning",
        isActive: () => {
            let A = Wt();
            return A !== null && A.content.length > O36
        },
        render: () => {
            let A = Wt();
            if (!A) return null;
            let q = A.content.length;
            return u4.createElement(m, {
                flexDirection: "row",
                gap: 1
            }, u4.createElement(T, {
                color: "warning"
            }, a6.warning), u4.createElement(T, {
                color: "warning"
            }, "CLAUDE.md entries marked as IMPORTANT exceed", " ", O36, " chars (", q, " chars)", u4.createElement(T, {
                dimColor: !0
            }, " • /memory to edit")))
        }
    }, ytY = {
        id: "claude-ai-external-token",
        type: "warning",
        isActive: () => {
            let A = aR();
            return iA() && (A.source === "ANTHROPIC_AUTH_TOKEN" || A.source === "apiKeyHelper")
        },
        render: () => {
            let A = aR();
            return u4.createElement(m, {
                flexDirection: "row",
                marginTop: 1
            }, u4.createElement(T, {
                color: "warning"
            }, a6.warning), u4.createElement(T, {
                color: "warning"
            }, "Auth conflict: Using ", A.source, " instead of Claude account subscription token. Either unset ", A.source, ", or run `claude /logout`."))
        }
    }, LtY = {
        id: "api-key-conflict",
        type: "warning",
        isActive: () => {
            let {
                source: A
            } = s2({
                skipRetrievingKeyFromApiKeyHelper: !0
            });
            return !!ON6() && (A === "ANTHROPIC_API_KEY" || A === "apiKeyHelper")
        },
        render: () => {
            let {
                source: A
            } = s2({
                skipRetrievingKeyFromApiKeyHelper: !0
            });
            return u4.createElement(m, {
                flexDirection: "row",
                marginTop: 1
            }, u4.createElement(T, {
                color: "warning"
            }, a6.warning), u4.createElement(T, {
                color: "warning"
            }, "Auth conflict: Using ", A, " instead of Anthropic Console key. Either unset ", A, ", or run `claude /logout`."))
        }
    }, RtY = {
        id: "both-auth-methods",
        type: "warning",
        isActive: () => {
            let {
                source: A
            } = s2({
                skipRetrievingKeyFromApiKeyHelper: !0
            }), q = aR();
            return A !== "none" && q.source !== "none" && !(A === "apiKeyHelper" && q.source === "apiKeyHelper")
        },
        render: () => {
            let {
                source: A
            } = s2({
                skipRetrievingKeyFromApiKeyHelper: !0
            }), q = aR();
            return u4.createElement(m, {
                flexDirection: "column",
                marginTop: 1
            }, u4.createElement(m, {
                flexDirection: "row"
            }, u4.createElement(T, {
                color: "warning"
            }, a6.warning), u4.createElement(T, {
                color: "warning"
            }, "Auth conflict: Both a token (", q.source, ") and an API key (", A, ") are set. This may lead to unexpected behavior.")), u4.createElement(m, {
                flexDirection: "column",
                marginLeft: 3
            }, u4.createElement(T, {
                color: "warning"
            }, "• Trying to use", " ", q.source === "claude.ai" ? "claude.ai" : q.source, "?", " ", A === "ANTHROPIC_API_KEY" ? 'Unset the ANTHROPIC_API_KEY environment variable, or claude /logout then say "No" to the API key approval before login.' : A === "apiKeyHelper" ? "Unset the apiKeyHelper setting." : "claude /logout"), u4.createElement(T, {
                color: "warning"
            }, "• Trying to use ", A, "?", " ", q.source === "claude.ai" ? "claude /logout to sign out of claude.ai." : `Unset the ${q.source} environment variable.`)))
        }
    }, htY = {
        id: "large-agent-descriptions",
        type: "warning",
        isActive: (A) => {
            return Wn6(A.agentDefinitions) > tz6
        },
        render: (A) => {
            let q = Wn6(A.agentDefinitions);
            return u4.createElement(m, {
                flexDirection: "row"
            }, u4.createElement(T, {
                color: "warning"
            }, a6.warning), u4.createElement(T, {
                color: "warning"
            }, "Large cumulative agent descriptions will impact performance (~", fq(q), " tokens >", " ", fq(tz6), ")", u4.createElement(T, {
                dimColor: !0
            }, " • /agents to manage")))
        }
    }, StY = {
        id: "jetbrains-plugin-install",
        type: "info",
        isActive: (A) => {
            if (!FX6()) return !1;
            if (!(A.config.autoInstallIdeExtension ?? !0)) return !1;
            let K = BX6();
            return K !== null && !yN7(K)
        },
        render: () => {
            let A = BX6(),
                q = Y$(A);
            return u4.createElement(m, {
                flexDirection: "row",
                gap: 1,
                marginLeft: 1
            }, u4.createElement(T, {
                color: "ide"
            }, a6.arrowUp), u4.createElement(T, null, "Install the ", u4.createElement(T, {
                color: "ide"
            }, q), " plugin from the JetBrains Marketplace:", " ", u4.createElement(T, {
                bold: !0
            }, "https://docs.claude.com/s/claude-code-jetbrains")))
        }
    }, CtY = [ktY, EtY, htY, ytY, LtY, RtY, StY]
})
// @from(Ln 410094, Col 0)
function iHq(A) {
    let q = A6(11),
        K, Y, z, _, w;
    if (q[0] !== A) {
        w = Symbol.for("react.early_return_sentinel");
        A: {
            let {
                agentDefinitions: $
            } = A === void 0 ? {} : A,
            j = {
                config: X1(),
                agentDefinitions: $
            },
            J = cHq(j);
            if (J.length === 0) {
                w = null;
                break A
            }
            K = m,
            Y = "column",
            z = 1,
            _ = J.map((M) => P_6.createElement(P_6.Fragment, {
                key: M.id
            }, M.render(j)))
        }
        q[0] = A, q[1] = K, q[2] = Y, q[3] = z, q[4] = _, q[5] = w
    } else K = q[1], Y = q[2], z = q[3], _ = q[4], w = q[5];
    if (w !== Symbol.for("react.early_return_sentinel")) return w;
    let O;
    if (q[6] !== K || q[7] !== Y || q[8] !== z || q[9] !== _) O = P_6.createElement(K, {
        flexDirection: Y,
        paddingLeft: z
    }, _), q[6] = K, q[7] = Y, q[8] = z, q[9] = _, q[10] = O;
    else O = q[10];
    return O
}
// @from(Ln 410130, Col 4)
P_6
// @from(Ln 410131, Col 4)
nHq = E(() => {
    e6();
    i6();
    k8();
    lHq();
    P_6 = t(P6(), 1)
})
// @from(Ln 410139, Col 0)
function ItY(A) {
    let q = A6(15),
        {
            orientation: K,
            width: Y,
            dividerChar: z,
            dividerColor: _,
            dividerDimColor: w,
            boxProps: O
        } = A,
        $ = K === void 0 ? "horizontal" : K,
        H = Y === void 0 ? "auto" : Y,
        j = w === void 0 ? !0 : w,
        J = $ === "vertical",
        M = z || (J ? "│" : "─");
    if (J) {
        let P;
        if (q[0] !== M) P = {
            topLeft: "",
            top: "",
            topRight: "",
            right: M,
            bottomRight: "",
            bottom: "",
            bottomLeft: "",
            left: ""
        }, q[0] = M, q[1] = P;
        else P = q[1];
        let W;
        if (q[2] !== O || q[3] !== _ || q[4] !== j || q[5] !== P) W = sl.default.createElement(m, {
            height: "100%",
            borderStyle: P,
            borderColor: _,
            borderDimColor: j,
            borderBottom: !1,
            borderTop: !1,
            borderLeft: !1,
            borderRight: !0,
            ...O
        }), q[2] = O, q[3] = _, q[4] = j, q[5] = P, q[6] = W;
        else W = q[6];
        return W
    }
    let D;
    if (q[7] !== M) D = {
        topLeft: "",
        top: "",
        topRight: "",
        right: "",
        bottomRight: "",
        bottom: M,
        bottomLeft: "",
        left: ""
    }, q[7] = M, q[8] = D;
    else D = q[8];
    let X;
    if (q[9] !== O || q[10] !== _ || q[11] !== j || q[12] !== D || q[13] !== H) X = sl.default.createElement(m, {
        width: H,
        borderStyle: D,
        borderColor: _,
        borderDimColor: j,
        flexGrow: 1,
        borderBottom: !0,
        borderTop: !1,
        borderLeft: !1,
        borderRight: !1,
        ...O
    }), q[9] = O, q[10] = _, q[11] = j, q[12] = D, q[13] = H, q[14] = X;
    else X = q[14];
    return X
}
// @from(Ln 410211, Col 0)
function btY(A) {
    let q = A6(21),
        {
            orientation: K,
            title: Y,
            width: z,
            padding: _,
            titlePadding: w,
            titleColor: O,
            titleDimColor: $,
            dividerChar: H,
            dividerColor: j,
            dividerDimColor: J,
            boxProps: M
        } = A,
        D = K === void 0 ? "horizontal" : K,
        X = z === void 0 ? "auto" : z,
        P = _ === void 0 ? 0 : _,
        W = w === void 0 ? 1 : w,
        Z = O === void 0 ? "text" : O,
        G = $ === void 0 ? !0 : $,
        f = J === void 0 ? !0 : J,
        v = D === "vertical",
        V = H || (v ? "│" : "─"),
        L;
    if (q[0] !== M || q[1] !== j || q[2] !== f || q[3] !== D || q[4] !== V) L = sl.default.createElement(ItY, {
        orientation: D,
        dividerChar: V,
        dividerColor: j,
        dividerDimColor: f,
        boxProps: M
    }), q[0] = M, q[1] = j, q[2] = f, q[3] = D, q[4] = V, q[5] = L;
    else L = q[5];
    let h = L;
    if (v) return h;
    if (!Y) {
        let g;
        if (q[6] !== h || q[7] !== P) g = sl.default.createElement(m, {
            paddingLeft: P,
            paddingRight: P
        }, h), q[6] = h, q[7] = P, q[8] = g;
        else g = q[8];
        return g
    }
    let R;
    if (q[9] !== Y) R = sl.default.createElement(wK, null, Y), q[9] = Y, q[10] = R;
    else R = q[10];
    let u;
    if (q[11] !== R || q[12] !== Z || q[13] !== G) u = sl.default.createElement(m, null, sl.default.createElement(T, {
        color: Z,
        dimColor: G
    }, R)), q[11] = R, q[12] = Z, q[13] = G, q[14] = u;
    else u = q[14];
    let I;
    if (q[15] !== h || q[16] !== P || q[17] !== u || q[18] !== W || q[19] !== X) I = sl.default.createElement(m, {
        flexDirection: "row",
        width: X,
        paddingLeft: P,
        paddingRight: P,
        gap: W
    }, h, u, h), q[15] = h, q[16] = P, q[17] = u, q[18] = W, q[19] = X, q[20] = I;
    else I = q[20];
    return I
}
// @from(Ln 410275, Col 4)
sl
// @from(Ln 410275, Col 8)
DD
// @from(Ln 410276, Col 4)
C16 = E(() => {
    e6();
    i6();
    sl = t(P6(), 1);
    DD = btY
})
// @from(Ln 410283, Col 0)
function rHq(A, q) {
    for (let K of A)
        if (!q.has(K)) return !1;
    return !0
}
// @from(Ln 410289, Col 0)
function aHq(A) {
    if (A >= 70) return "horizontal";
    return "compact"
}
// @from(Ln 410294, Col 0)
function sHq(A, q, K) {
    if (q === "horizontal") {
        let z = K,
            _ = vc8 + KR1 + qR1 + z,
            w = A - _,
            O = Math.max(30, w),
            $ = Math.min(z + O + qR1 + KR1, A - vc8);
        if ($ < z + O + qR1 + KR1) O = $ - z - qR1 - KR1;
        return {
            leftWidth: z,
            rightWidth: O,
            totalWidth: $
        }
    }
    let Y = Math.min(A - vc8, oHq + 20);
    return {
        leftWidth: Y,
        rightWidth: Y,
        totalWidth: Y
    }
}
// @from(Ln 410316, Col 0)
function tHq(A, q, K) {
    let Y = Math.max(f8(A), f8(q), f8(K), 20);
    return Math.min(Y + 4, oHq)
}
// @from(Ln 410321, Col 0)
function zR1(A) {
    if (!A || A.length > xtY) return "Welcome back!";
    return `Welcome back ${A}!`
}
// @from(Ln 410326, Col 0)
function nn6(A, q) {
    if (f8(A) <= q) return A;
    let K = "/",
        Y = "…",
        z = 1,
        _ = 1,
        w = A.split(K),
        O = w[0] || "",
        $ = w[w.length - 1] || "",
        H = f8(O),
        j = f8($);
    if (w.length === 1) return jq(A, q);
    if (O === "" && z + _ + j >= q) return `${K}${jq($,Math.max(1,q-_))}`;
    if (O !== "" && z * 2 + _ + j >= q) return `${Y}${K}${jq($,Math.max(1,q-z-_))}`;
    if (w.length === 2) {
        let D = q - z - _ - j;
        return `${kJ6(O,D)}${Y}${K}${$}`
    }
    let J = q - H - j - z - 2 * _;
    if (J <= 0) {
        let D = Math.max(0, q - j - z - 2 * _);
        return `${kJ6(O,D)}${K}${Y}${K}${$}`
    }
    let M = [];
    for (let D = w.length - 2; D > 0; D--) {
        let X = w[D];
        if (X && f8(X) + _ <= J) M.unshift(X), J -= f8(X) + _;
        else break
    }
    if (M.length === 0) return `${O}${K}${Y}${K}${$}`;
    return `${O}${K}${Y}${K}${M.join(K)}${K}${$}`
}
// @from(Ln 410358, Col 0)
async function eHq() {
    if (YR1) return YR1;
    let A = R1();
    return YR1 = OR1(10).then((q) => {
        return in6 = q.filter((K) => {
            if (K.isSidechain) return !1;
            if (K.sessionId === A) return !1;
            if (K.summary?.includes("I apologize")) return !1;
            let Y = K.summary && K.summary !== "No prompt",
                z = K.firstPrompt && K.firstPrompt !== "No prompt";
            return Y || z
        }).slice(0, 3), in6
    }).catch(() => {
        return in6 = [], in6
    }), YR1
}
// @from(Ln 410375, Col 0)
function Ajq() {
    return in6
}
// @from(Ln 410379, Col 0)
function _R1() {
    let A = process.env.DEMO_VERSION ?? {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION,
        q = rx1(),
        K = process.env.DEMO_VERSION ? "/code/claude" : $K(G1()),
        Y = q ? `${K} in ${q.replace(/^https?:\/\//,"")}` : K,
        z = iA() ? $R1() : "API Usage Billing",
        _ = mA().agent;
    return {
        version: A,
        cwd: Y,
        billingType: z,
        agentName: _
    }
}
// @from(Ln 410401, Col 0)
function qjq(A, q, K) {
    if (f8(A) + 3 + f8(q) > K) return {
        shouldSplit: !0,
        truncatedModel: R3(A, K),
        truncatedBilling: R3(q, K)
    };
    return {
        shouldSplit: !1,
        truncatedModel: R3(A, Math.max(K - f8(q) - 3, 10)),
        truncatedBilling: q
    }
}
// @from(Ln 410414, Col 0)
function Kjq(A) {
    let q = tL1();
    if (!q) return [];
    let K;
    try {
        K = eL1(q)
    } catch {
        return []
    }
    let Y = [],
        z = Object.keys(K).sort((_, w) => UG(_, w) ? -1 : 1).slice(0, 3);
    for (let _ of z) {
        let w = K[_];
        if (w) Y.push(...w)
    }
    return Y.slice(0, A)
}
// @from(Ln 410431, Col 4)
oHq = 50
// @from(Ln 410432, Col 4)
xtY = 20
// @from(Ln 410433, Col 4)
vc8 = 4
// @from(Ln 410434, Col 4)
qR1 = 1
// @from(Ln 410435, Col 4)
KR1 = 2
// @from(Ln 410436, Col 4)
in6
// @from(Ln 410436, Col 9)
YR1 = null
// @from(Ln 410437, Col 4)
wR1 = E(() => {
    _N6();
    M4();
    Oq();
    q3();
    T1();
    lA();
    Z7();
    fA();
    i8();
    in6 = []
})
// @from(Ln 410450, Col 0)
function $N6(A) {
    let q = A6(26),
        K;
    if (q[0] !== A) K = A === void 0 ? {} : A, q[0] = A, q[1] = K;
    else K = q[1];
    let {
        pose: Y
    } = K, z = Y === void 0 ? "default" : Y;
    if (Q8.terminal === "Apple_Terminal") {
        let W;
        if (q[2] !== z) W = b9.createElement(BtY, {
            pose: z
        }), q[2] = z, q[3] = W;
        else W = q[3];
        return W
    }
    let _ = utY[z],
        w;
    if (q[4] !== _.r1L) w = b9.createElement(T, {
        color: "clawd_body"
    }, _.r1L), q[4] = _.r1L, q[5] = w;
    else w = q[5];
    let O;
    if (q[6] !== _.r1E) O = b9.createElement(T, {
        color: "clawd_body",
        backgroundColor: "clawd_background"
    }, _.r1E), q[6] = _.r1E, q[7] = O;
    else O = q[7];
    let $;
    if (q[8] !== _.r1R) $ = b9.createElement(T, {
        color: "clawd_body"
    }, _.r1R), q[8] = _.r1R, q[9] = $;
    else $ = q[9];
    let H;
    if (q[10] !== w || q[11] !== O || q[12] !== $) H = b9.createElement(T, null, w, O, $), q[10] = w, q[11] = O, q[12] = $, q[13] = H;
    else H = q[13];
    let j;
    if (q[14] !== _.r2L) j = b9.createElement(T, {
        color: "clawd_body"
    }, _.r2L), q[14] = _.r2L, q[15] = j;
    else j = q[15];
    let J;
    if (q[16] === Symbol.for("react.memo_cache_sentinel")) J = b9.createElement(T, {
        color: "clawd_body",
        backgroundColor: "clawd_background"
    }, "█████"), q[16] = J;
    else J = q[16];
    let M;
    if (q[17] !== _.r2R) M = b9.createElement(T, {
        color: "clawd_body"
    }, _.r2R), q[17] = _.r2R, q[18] = M;
    else M = q[18];
    let D;
    if (q[19] !== j || q[20] !== M) D = b9.createElement(T, null, j, J, M), q[19] = j, q[20] = M, q[21] = D;
    else D = q[21];
    let X;
    if (q[22] === Symbol.for("react.memo_cache_sentinel")) X = b9.createElement(T, {
        color: "clawd_body"
    }, "  ", "▘▘ ▝▝", "  "), q[22] = X;
    else X = q[22];
    let P;
    if (q[23] !== D || q[24] !== H) P = b9.createElement(m, {
        flexDirection: "column"
    }, H, D, X), q[23] = D, q[24] = H, q[25] = P;
    else P = q[25];
    return P
}
// @from(Ln 410518, Col 0)
function BtY(A) {
    let q = A6(10),
        {
            pose: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = b9.createElement(T, {
        color: "clawd_body"
    }, "▗"), q[0] = Y;
    else Y = q[0];
    let z = mtY[K],
        _;
    if (q[1] !== z) _ = b9.createElement(T, {
        color: "clawd_background",
        backgroundColor: "clawd_body"
    }, z), q[1] = z, q[2] = _;
    else _ = q[2];
    let w;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) w = b9.createElement(T, {
        color: "clawd_body"
    }, "▖"), q[3] = w;
    else w = q[3];
    let O;
    if (q[4] !== _) O = b9.createElement(T, null, Y, _, w), q[4] = _, q[5] = O;
    else O = q[5];
    let $, H;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) $ = b9.createElement(T, {
        backgroundColor: "clawd_body"
    }, " ".repeat(7)), H = b9.createElement(T, {
        color: "clawd_body"
    }, "▘▘ ▝▝"), q[6] = $, q[7] = H;
    else $ = q[6], H = q[7];
    let j;
    if (q[8] !== O) j = b9.createElement(m, {
        flexDirection: "column",
        alignItems: "center"
    }, O, $, H), q[8] = O, q[9] = j;
    else j = q[9];
    return j
}
// @from(Ln 410558, Col 4)
b9
// @from(Ln 410558, Col 8)
utY
// @from(Ln 410558, Col 13)
mtY
// @from(Ln 410559, Col 4)
HR1 = E(() => {
    e6();
    i6();
    d3();
    b9 = t(P6(), 1), utY = {
        default: {
            r1L: " ▐",
            r1E: "▛███▜",
            r1R: "▌",
            r2L: "▝▜",
            r2R: "▛▘"
        },
        "look-left": {
            r1L: " ▐",
            r1E: "▟███▟",
            r1R: "▌",
            r2L: "▝▜",
            r2R: "▛▘"
        },
        "look-right": {
            r1L: " ▐",
            r1E: "▙███▙",
            r1R: "▌",
            r2L: "▝▜",
            r2R: "▛▘"
        },
        "arms-up": {
            r1L: "▗▟",
            r1E: "▛███▜",
            r1R: "▙▖",
            r2L: " ▜",
            r2R: "▛ "
        }
    }, mtY = {
        default: " ▗   ▖ ",
        "look-left": " ▘   ▘ ",
        "look-right": " ▝   ▝ ",
        "arms-up": " ▗   ▖ "
    }
})
// @from(Ln 410600, Col 0)
function Yjq(A) {
    let {
        title: q,
        lines: K,
        footer: Y,
        emptyMessage: z,
        customContent: _
    } = A, w = f8(q);
    if (_ !== void 0) w = Math.max(w, _.width);
    else if (K.length === 0 && z) w = Math.max(w, f8(z));
    else {
        let $ = Math.max(0, ...K.map((H) => H.timestamp ? f8(H.timestamp) : 0));
        for (let H of K) {
            let j = $ > 0 ? $ : 0,
                J = f8(H.text) + (j > 0 ? j + 2 : 0);
            w = Math.max(w, J)
        }
    }
    if (Y) w = Math.max(w, f8(Y));
    return w
}
// @from(Ln 410622, Col 0)
function zjq(A) {
    let q = A6(15),
        {
            config: K,
            actualWidth: Y
        } = A,
        {
            title: z,
            lines: _,
            footer: w,
            emptyMessage: O,
            customContent: $
        } = K,
        H;
    if (q[0] !== _) H = Math.max(0, ..._.map(gtY)), q[0] = _, q[1] = H;
    else H = q[1];
    let j = H,
        J;
    if (q[2] !== z) J = T_.createElement(T, {
        bold: !0,
        color: "claude"
    }, z), q[2] = z, q[3] = J;
    else J = q[3];
    let M;
    if (q[4] !== Y || q[5] !== $ || q[6] !== O || q[7] !== w || q[8] !== _ || q[9] !== j) M = $ ? T_.createElement(T_.Fragment, null, $.content, w && T_.createElement(T, {
        dimColor: !0,
        italic: !0
    }, R3(w, Y))) : _.length === 0 && O ? T_.createElement(T, {
        dimColor: !0
    }, R3(O, Y)) : T_.createElement(T_.Fragment, null, _.map((X, P) => {
        let W = Math.max(10, Y - (j > 0 ? j + 2 : 0));
        return T_.createElement(T, {
            key: P
        }, j > 0 && T_.createElement(T_.Fragment, null, T_.createElement(T, {
            dimColor: !0
        }, (X.timestamp || "").padEnd(j)), "  "), T_.createElement(T, null, R3(X.text, W)))
    }), w && T_.createElement(T, {
        dimColor: !0,
        italic: !0
    }, R3(w, Y))), q[4] = Y, q[5] = $, q[6] = O, q[7] = w, q[8] = _, q[9] = j, q[10] = M;
    else M = q[10];
    let D;
    if (q[11] !== Y || q[12] !== J || q[13] !== M) D = T_.createElement(m, {
        flexDirection: "column",
        width: Y
    }, J, M), q[11] = Y, q[12] = J, q[13] = M, q[14] = D;
    else D = q[14];
    return D
}
// @from(Ln 410672, Col 0)
function gtY(A) {
    return A.timestamp ? f8(A.timestamp) : 0
}
// @from(Ln 410675, Col 4)
T_
// @from(Ln 410676, Col 4)
_jq = E(() => {
    e6();
    i6();
    M4();
    q3();
    T_ = t(P6(), 1)
})
// @from(Ln 410684, Col 0)
function wjq(A) {
    let q = A6(10),
        {
            feeds: K,
            maxWidth: Y
        } = A,
        z;
    if (q[0] !== K) {
        let H = K.map(FtY);
        z = Math.max(...H), q[0] = K, q[1] = z
    } else z = q[1];
    let w = Math.min(z, Y),
        O;
    if (q[2] !== w || q[3] !== K) {
        let H;
        if (q[5] !== w || q[6] !== K.length) H = (j, J) => lb.createElement(lb.Fragment, {
            key: J
        }, lb.createElement(zjq, {
            config: j,
            actualWidth: w
        }), J < K.length - 1 && lb.createElement(DD, {
            dividerColor: "claude"
        })), q[5] = w, q[6] = K.length, q[7] = H;
        else H = q[7];
        O = K.map(H), q[2] = w, q[3] = K, q[4] = O
    } else O = q[4];
    let $;
    if (q[8] !== O) $ = lb.createElement(m, {
        flexDirection: "column"
    }, O), q[8] = O, q[9] = $;
    else $ = q[9];
    return $
}
// @from(Ln 410718, Col 0)
function FtY(A) {
    return Yjq(A)
}
// @from(Ln 410721, Col 4)
lb
// @from(Ln 410722, Col 4)
Ojq = E(() => {
    e6();
    i6();
    _jq();
    C16();
    lb = t(P6(), 1)
})
// @from(Ln 410729, Col 0)
async function ptY(A = "claude_code_guest_pass") {
    let {
        accessToken: q,
        orgUUID: K
    } = await k0(), Y = {
        ...zj(q),
        "x-organization-uuid": K
    }, z = `${P7().BASE_API_URL}/api/oauth/organizations/${K}/referral/eligibility`;
    return (await X8.get(z, {
        headers: Y,
        params: {
            campaign: A
        },
        timeout: 5000
    })).data
}
// @from(Ln 410745, Col 0)
async function jjq(A = "claude_code_guest_pass") {
    let {
        accessToken: q,
        orgUUID: K
    } = await k0(), Y = {
        ...zj(q),
        "x-organization-uuid": K
    }, z = `${P7().BASE_API_URL}/api/oauth/organizations/${K}/referral/redemptions`;
    return (await X8.get(z, {
        headers: Y,
        params: {
            campaign: A
        },
        timeout: 1e4
    })).data
}
// @from(Ln 410762, Col 0)
function Jjq() {
    return !!(L3()?.organizationUuid && iA() && CK() === "max")
}
// @from(Ln 410766, Col 0)
function HN6() {
    if (!Jjq()) return {
        eligible: !1,
        needsRefresh: !1,
        hasCache: !1
    };
    let A = L3()?.organizationUuid;
    if (!A) return {
        eligible: !1,
        needsRefresh: !1,
        hasCache: !1
    };
    let K = X1().passesEligibilityCache?.[A];
    if (!K) return {
        eligible: !1,
        needsRefresh: !0,
        hasCache: !1
    };
    let {
        eligible: Y,
        timestamp: z
    } = K, w = Date.now() - z > Hjq;
    return {
        eligible: Y,
        needsRefresh: w,
        hasCache: !0
    }
}
// @from(Ln 410795, Col 0)
function I16(A) {
    let q = QtY[A.currency] ?? `${A.currency} `,
        K = A.amount_minor_units / 100,
        Y = K % 1 === 0 ? K.toString() : K.toFixed(2);
    return `${q}${Y}`
}
// @from(Ln 410802, Col 0)
function b16() {
    let A = L3()?.organizationUuid;
    if (!A) return null;
    return X1().passesEligibilityCache?.[A]?.referrer_reward ?? null
}
// @from(Ln 410808, Col 0)
function jR1() {
    let A = L3()?.organizationUuid;
    if (!A) return null;
    return X1().passesEligibilityCache?.[A]?.remaining_passes ?? null
}
// @from(Ln 410813, Col 0)
async function $jq() {
    if (rn6) return k("Passes: Reusing in-flight eligibility fetch"), rn6;
    let A = L3()?.organizationUuid;
    if (!A) return null;
    return rn6 = (async () => {
        try {
            let q = await ptY(),
                K = {
                    ...q,
                    timestamp: Date.now()
                };
            return d1((Y) => ({
                ...Y,
                passesEligibilityCache: {
                    ...Y.passesEligibilityCache,
                    [A]: K
                }
            })), k(`Passes eligibility cached for org ${A}: ${q.eligible}`), q
        } catch (q) {
            return k("Failed to fetch and cache passes eligibility"), _6(q), null
        } finally {
            rn6 = null
        }
    })(), rn6
}
// @from(Ln 410838, Col 0)
async function Nc8() {
    if (!Jjq()) return null;
    let A = L3()?.organizationUuid;
    if (!A) return null;
    let K = X1().passesEligibilityCache?.[A],
        Y = Date.now();
    if (!K) return k("Passes: No cache, fetching eligibility in background (command unavailable this session)"), $jq(), null;
    if (Y - K.timestamp > Hjq) {
        k("Passes: Cache stale, returning cached data and refreshing in background"), $jq();
        let {
            timestamp: w,
            ...O
        } = K;
        return O
    }
    k("Passes: Using fresh cached eligibility data");
    let {
        timestamp: z,
        ..._
    } = K;
    return _
}
// @from(Ln 410860, Col 0)
async function Mjq() {
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
    Nc8()
}
// @from(Ln 410864, Col 4)
Hjq = 86400000
// @from(Ln 410865, Col 4)
rn6 = null
// @from(Ln 410866, Col 4)
QtY
// @from(Ln 410867, Col 4)
x16 = E(() => {
    kK();
    F5();
    EZ();
    k8();
    fA();
    H1();
    k1();
    QtY = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        BRL: "R$",
        CAD: "CA$",
        AUD: "A$",
        NZD: "NZ$",
        SGD: "S$"
    }
})
// @from(Ln 410890, Col 0)
function JR1(A) {
    let q = A.map((K) => {
        let Y = Q46(K.modified);
        return {
            text: (K.summary && K.summary !== "No prompt" ? K.summary : K.firstPrompt) || "",
            timestamp: Y
        }
    });
    return {
        title: "Recent activity",
        lines: q,
        footer: q.length > 0 ? "/resume for more" : void 0,
        emptyMessage: "No recent activity"
    }
}
// @from(Ln 410906, Col 0)
function Djq(A) {
    let q = A.map((Y) => {
            return {
                text: Y
            }
        }),
        K = "Check the Claude Code changelog for updates";
    return {
        title: "What's new",
        lines: q,
        footer: q.length > 0 ? "/release-notes for more" : void 0,
        emptyMessage: "Check the Claude Code changelog for updates"
    }
}
// @from(Ln 410921, Col 0)
function Xjq(A) {
    let K = A.filter(({
            isEnabled: z
        }) => z).sort((z, _) => Number(z.isComplete) - Number(_.isComplete)).map(({
            text: z,
            isComplete: _
        }) => {
            return {
                text: `${_?`${a6.tick} `:""}${z}`
            }
        }),
        Y = G1() === UtY() ? "Note: You have launched claude in your home directory. For the best experience, launch it in a project directory instead." : void 0;
    if (Y) K.push({
        text: Y
    });
    return {
        title: "Tips for getting started",
        lines: K
    }
}
// @from(Ln 410942, Col 0)
function Pjq() {
    let A = b16(),
        q = A ? `Share Claude Code and earn ${I16(A)} of extra usage` : "Share Claude Code with friends";
    return {
        title: "3 guest passes",
        lines: [],
        customContent: {
            content: Rh.createElement(Rh.Fragment, null, Rh.createElement(m, {
                marginY: 1
            }, Rh.createElement(T, {
                color: "claude"
            }, "[✻] [✻] [✻]")), Rh.createElement(T, {
                dimColor: !0
            }, q)),
            width: 48
        },
        footer: "/passes"
    }
}
// @from(Ln 410961, Col 4)
Rh
// @from(Ln 410962, Col 4)
Wjq = E(() => {
    M4();
    b7();
    lA();
    i6();
    x16();
    Rh = t(P6(), 1)
})
// @from(Ln 410971, Col 0)
function dtY() {
    let A = jR1();
    if (A == null || A <= 0) return;
    let K = X1().passesLastSeenRemaining ?? 0;
    if (A > K) d1((Y) => ({
        ...Y,
        passesUpsellSeenCount: 0,
        hasVisitedPasses: !1,
        passesLastSeenRemaining: A
    }))
}
// @from(Ln 410983, Col 0)
function ctY() {
    let {
        eligible: A,
        hasCache: q
    } = HN6();
    if (!A || !q) return !1;
    dtY();
    let K = X1();
    if ((K.passesUpsellSeenCount ?? 0) >= 3) return !1;
    if (K.hasVisitedPasses) return !1;
    return !0
}
// @from(Ln 410996, Col 0)
function MR1() {
    let [A] = Zjq.useState(ltY);
    return A
}
// @from(Ln 411001, Col 0)
function ltY() {
    return ctY()
}
// @from(Ln 411005, Col 0)
function DR1() {
    let q = (X1().passesUpsellSeenCount ?? 0) + 1;
    d1((K) => ({
        ...K,
        passesUpsellSeenCount: q
    })), d("tengu_guest_passes_upsell_shown", {
        seen_count: q
    })
}
// @from(Ln 411015, Col 0)
function Gjq() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) {
        let K = b16();
        q = tl.createElement(T, {
            dimColor: !0
        }, tl.createElement(T, {
            color: "claude"
        }, "[✻]"), " ", tl.createElement(T, {
            color: "claude"
        }, "[✻]"), " ", tl.createElement(T, {
            color: "claude"
        }, "[✻]"), " ·", " ", K ? `Share Claude Code and earn ${I16(K)} of extra usage · /passes` : "3 guest passes at /passes"), A[0] = q
    } else q = A[0];
    return q
}
// @from(Ln 411032, Col 4)
tl
// @from(Ln 411032, Col 8)
Zjq
// @from(Ln 411033, Col 4)
Vc8 = E(() => {
    e6();
    i6();
    k8();
    x16();
    V1();
    tl = t(P6(), 1), Zjq = t(P6(), 1)
})
// @from(Ln 411042, Col 0)
function el(A, q, K) {
    return Array.from({
        length: K
    }, () => ({
        pose: A,
        offset: q
    }))
}
// @from(Ln 411050, Col 4)
itY
// @from(Ln 411050, Col 9)
kc8
// @from(Ln 411050, Col 14)
muO
// @from(Ln 411050, Col 19)
BuO
// @from(Ln 411051, Col 4)
fjq = E(() => {
    e6();
    i6();
    i8();
    HR1();
    itY = t(P6(), 1), kc8 = t(P6(), 1);
    muO = [...el("default", 1, 2), ...el("arms-up", 0, 3), ...el("default", 0, 1), ...el("default", 1, 2), ...el("arms-up", 0, 3), ...el("default", 0, 1)], BuO = [...el("look-right", 0, 5), ...el("look-left", 0, 5), ...el("default", 0, 1)]
})
// @from(Ln 411060, Col 0)
function vjq() {
    let A = A6(20),
        {
            columns: q
        } = KA(),
        K = M1(rtY),
        Y = M1(ntY),
        z = sR(),
        _ = on6(z),
        {
            version: w,
            cwd: O,
            billingType: $,
            agentName: H
        } = _R1(),
        j = K ?? H,
        J = MR1(),
        M, D;
    if (A[0] !== J) M = () => {
        if (J) DR1()
    }, D = [J], A[0] = J, A[1] = M, A[2] = D;
    else M = A[1], D = A[2];
    Tjq.useEffect(M, D);
    let X = Math.max(q - 15, 20),
        P = R3(w, Math.max(X - 13, 6)),
        W = vD6(z, Y),
        {
            shouldSplit: Z,
            truncatedModel: G,
            truncatedBilling: f
        } = qjq(_ + W, $, X),
        v = j ? X - 1 - f8(j) - 3 : X,
        N = nn6(O, Math.max(v, 10)),
        V;
    if (A[3] === Symbol.for("react.memo_cache_sentinel")) V = v_.createElement($N6, null), A[3] = V;
    else V = A[3];
    let L;
    if (A[4] === Symbol.for("react.memo_cache_sentinel")) L = v_.createElement(T, {
        bold: !0
    }, "Claude Code"), A[4] = L;
    else L = A[4];
    let h;
    if (A[5] !== P) h = v_.createElement(T, null, L, " ", v_.createElement(T, {
        dimColor: !0
    }, "v", P)), A[5] = P, A[6] = h;
    else h = A[6];
    let R;
    if (A[7] !== Z || A[8] !== f || A[9] !== G) R = Z ? v_.createElement(v_.Fragment, null, v_.createElement(T, {
        dimColor: !0
    }, G), v_.createElement(T, {
        dimColor: !0
    }, f)) : v_.createElement(T, {
        dimColor: !0
    }, G, " · ", f), A[7] = Z, A[8] = f, A[9] = G, A[10] = R;
    else R = A[10];
    let u = j ? `@${j} · ${N}` : N,
        I;
    if (A[11] !== u) I = v_.createElement(T, {
        dimColor: !0
    }, u), A[11] = u, A[12] = I;
    else I = A[12];
    let g;
    if (A[13] !== J) g = J && v_.createElement(Gjq, null), A[13] = J, A[14] = g;
    else g = A[14];
    let B;
    if (A[15] !== h || A[16] !== R || A[17] !== I || A[18] !== g) B = v_.createElement(f66, null, v_.createElement(m, {
        flexDirection: "row",
        gap: 2,
        alignItems: "center"
    }, V, v_.createElement(m, {
        flexDirection: "column"
    }, h, R, I, g))), A[15] = h, A[16] = R, A[17] = I, A[18] = g, A[19] = B;
    else B = A[19];
    return B
}
// @from(Ln 411136, Col 0)
function ntY(A) {
    return A.effortValue
}
// @from(Ln 411140, Col 0)
function rtY(A) {
    return A.agent
}
// @from(Ln 411143, Col 4)
v_
// @from(Ln 411143, Col 8)
Tjq
// @from(Ln 411144, Col 4)
Njq = E(() => {
    e6();
    i6();
    _q();
    M4();
    q3();
    wR1();
    WN1();
    Vc8();
    NA();
    wk();
    mY6();
    z4();
    HR1();
    fjq();
    Tb();
    v_ = t(P6(), 1), Tjq = t(P6(), 1)
})
// @from(Ln 411163, Col 0)
function Ec8() {
    let A = sn6.useMemo(stY, []),
        q = sn6.useMemo(() => X1().lastShownEmergencyTip, []),
        K = A.tip && A.tip !== q;
    if (sn6.useEffect(() => {
            if (K) d1((Y) => {
                if (Y.lastShownEmergencyTip === A.tip) return Y;
                return {
                    ...Y,
                    lastShownEmergencyTip: A.tip
                }
            })
        }, [K, A.tip]), !K) return null;
    return an6.createElement(m, {
        paddingLeft: 2,
        flexDirection: "column"
    }, an6.createElement(T, {
        ...A.color === "warning" ? {
            color: "warning"
        } : A.color === "error" ? {
            color: "error"
        } : {
            dimColor: !0
        }
    }, A.tip))
}
// @from(Ln 411190, Col 0)
function stY() {
    return mf(otY, atY)
}
// @from(Ln 411193, Col 4)
an6
// @from(Ln 411193, Col 9)
sn6
// @from(Ln 411193, Col 14)
otY = "tengu-top-of-feed-tip"
// @from(Ln 411194, Col 4)
atY
// @from(Ln 411195, Col 4)
Vjq = E(() => {
    i6();
    HA();
    k8();
    an6 = t(P6(), 1), sn6 = t(P6(), 1);
    atY = {
        tip: "",
        color: "dim"
    }
})
// @from(Ln 411206, Col 0)
function XR1({
    char: A = Me
}) {
    let [q] = W_6.useState(() => mA().prefersReducedMotion ?? !1), [K, Y] = W_6.useState(q), z = W_6.useRef(null), [_, w] = gJ(K ? null : 50);
    if (W_6.useEffect(() => {
            if (K) return;
            let H = setTimeout(Y, etY, !0);
            return () => clearTimeout(H)
        }, [K]), K) return Ai.createElement(m, {
        ref: _
    }, Ai.createElement(T, {
        color: AeY
    }, A));
    if (z.current === null) z.current = w;
    let $ = (w - z.current) / kjq * 360 % 360;
    return Ai.createElement(m, {
        ref: _
    }, Ai.createElement(T, {
        color: ok(yZ1($))
    }, A))
}
// @from(Ln 411227, Col 4)
Ai
// @from(Ln 411227, Col 8)
W_6
// @from(Ln 411227, Col 13)
kjq = 1500
// @from(Ln 411228, Col 4)
ttY = 2
// @from(Ln 411229, Col 4)
etY
// @from(Ln 411229, Col 9)
AeY
// @from(Ln 411230, Col 4)
yc8 = E(() => {
    i6();
    qw();
    i8();
    Vc();
    Ai = t(P6(), 1), W_6 = t(P6(), 1), etY = kjq * ttY, AeY = ok({
        r: 153,
        g: 153,
        b: 153
    })
})
// @from(Ln 411242, Col 0)
function Lc8() {
    return pH() && (X1().opus1mMergeNoticeSeenCount ?? 0) < qeY
}
// @from(Ln 411246, Col 0)
function WR1() {
    let A = A6(4),
        [q] = PR1.useState(Lc8),
        K, Y;
    if (A[0] !== q) K = () => {
        if (!q) return;
        let _ = (X1().opus1mMergeNoticeSeenCount ?? 0) + 1;
        d1((w) => {
            if ((w.opus1mMergeNoticeSeenCount ?? 0) >= _) return w;
            return {
                ...w,
                opus1mMergeNoticeSeenCount: _
            }
        })
    }, Y = [q], A[0] = q, A[1] = K, A[2] = Y;
    else K = A[1], Y = A[2];
    if (PR1.useEffect(K, Y), !q) return null;
    let z;
    if (A[3] === Symbol.for("react.memo_cache_sentinel")) z = Z_6.createElement(m, {
        paddingLeft: 2
    }, Z_6.createElement(XR1, {
        char: Nw4
    }), Z_6.createElement(T, {
        dimColor: !0
    }, " ", "Opus now defaults to 1M context · 5x more room, same pricing")), A[3] = z;
    else z = A[3];
    return z
}
// @from(Ln 411274, Col 4)
Z_6
// @from(Ln 411274, Col 9)
PR1
// @from(Ln 411274, Col 14)
qeY = 6
// @from(Ln 411275, Col 4)
Rc8 = E(() => {
    e6();
    i6();
    z4();
    k8();
    qw();
    yc8();
    Z_6 = t(P6(), 1), PR1 = t(P6(), 1)
})
// @from(Ln 411285, Col 0)
function GR1() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = qi.createElement(YeY, null), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 411293, Col 0)
function YeY() {
    let A = A6(4),
        [q] = ZR1.useState(zeY),
        K, Y;
    if (A[0] !== q) K = () => {
        if (!q) return;
        let _ = (X1().voiceNoticeSeenCount ?? 0) + 1;
        d1((w) => {
            if ((w.voiceNoticeSeenCount ?? 0) >= _) return w;
            return {
                ...w,
                voiceNoticeSeenCount: _
            }
        })
    }, Y = [q], A[0] = q, A[1] = K, A[2] = Y;
    else K = A[1], Y = A[2];
    if (ZR1.useEffect(K, Y), !q) return null;
    let z;
    if (A[3] === Symbol.for("react.memo_cache_sentinel")) z = qi.createElement(m, {
        paddingLeft: 2
    }, qi.createElement(XR1, null), qi.createElement(T, {
        dimColor: !0
    }, " Voice mode is now available · /voice to enable")), A[3] = z;
    else z = A[3];
    return z
}
// @from(Ln 411320, Col 0)
function zeY() {
    return m06() && mA().voiceEnabled !== !0 && (X1().voiceNoticeSeenCount ?? 0) < KeY && !Lc8()
}
// @from(Ln 411323, Col 4)
qi
// @from(Ln 411323, Col 8)
ZR1
// @from(Ln 411323, Col 13)
KeY = 3
// @from(Ln 411324, Col 4)
Ejq = E(() => {
    e6();
    i6();
    Id();
    k8();
    i8();
    yc8();
    Rc8();
    qi = t(P6(), 1), ZR1 = t(P6(), 1)
})
// @from(Ln 411335, Col 0)
function yjq() {
    let A = A6(80),
        q = Ajq(),
        K = X1().oauthAccount?.displayName ?? "",
        {
            columns: Y
        } = KA(),
        z;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) z = T84(), A[0] = z;
    else z = A[0];
    let _ = z,
        w;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) w = vA.isSandboxingEnabled(), A[1] = w;
    else w = A[1];
    let O = w,
        $ = MR1(),
        H = M1(OeY),
        j = M1(weY),
        J = X1(),
        M;
    try {
        M = Kjq(3)
    } catch {
        M = []
    }
    let [D] = tn6.useState(() => {
        let n6 = mA().companyAnnouncements;
        if (!n6 || n6.length === 0) return;
        return J.numStartups === 1 ? n6[0] : n6[Math.floor(Math.random() * n6.length)]
    }), {
        hasReleaseNotes: X
    } = VHq(J.lastReleaseNotesSeen), P;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) P = () => {
        if (X1().lastReleaseNotesSeen === {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION) return;
        if (d1(_eY), _) v84()
    }, A[2] = P;
    else P = A[2];
    let W;
    if (A[3] !== J) W = [J, _], A[3] = J, A[4] = W;
    else W = A[4];
    tn6.useEffect(P, W);
    let Z, G;
    if (A[5] !== $) Z = () => {
        if ($ && !_) DR1()
    }, G = [$, _], A[5] = $, A[6] = Z, A[7] = G;
    else Z = A[6], G = A[7];
    tn6.useEffect(Z, G);
    let f = sR(),
        v = on6(f),
        {
            version: N,
            cwd: V,
            billingType: L,
            agentName: h
        } = _R1(),
        R = H ?? h,
        u = vD6(f, j),
        I = v + u,
        g;
    if (A[8] !== I) g = R3(I, hc8 - 20), A[8] = I, A[9] = g;
    else g = A[9];
    let B = g;
    if (!X && !_ && !t6(process.env.CLAUDE_CODE_FORCE_FULL_LOGO)) {
        let n6, d6, S6, g6, D1, J1;
        if (A[10] === Symbol.for("react.memo_cache_sentinel")) D1 = OA.createElement(vjq, null), J1 = OA.createElement(GR1, null), n6 = OA.createElement(WR1, null), d6 = PT() && OA.createElement(m, {
            paddingLeft: 2,
            flexDirection: "column"
        }, OA.createElement(T, {
            color: "warning"
        }, "Debug mode enabled"), OA.createElement(T, {
            dimColor: !0
        }, "Logging to: ", Sx() ? "stderr" : $A6())), S6 = OA.createElement(Ec8, null), g6 = process.env.CLAUDE_CODE_TMUX_SESSION && OA.createElement(m, {
            paddingLeft: 2,
            flexDirection: "column"
        }, OA.createElement(T, {
            dimColor: !0
        }, "tmux session: ", process.env.CLAUDE_CODE_TMUX_SESSION), OA.createElement(T, {
            dimColor: !0
        }, process.env.CLAUDE_CODE_TMUX_PREFIX_CONFLICTS ? `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} ${process.env.CLAUDE_CODE_TMUX_PREFIX} d (press prefix twice - Claude uses ${process.env.CLAUDE_CODE_TMUX_PREFIX})` : `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} d`)), A[10] = n6, A[11] = d6, A[12] = S6, A[13] = g6, A[14] = D1, A[15] = J1;
        else n6 = A[10], d6 = A[11], S6 = A[12], g6 = A[13], D1 = A[14], J1 = A[15];
        let E1;
        if (A[16] !== D || A[17] !== J) E1 = D && OA.createElement(m, {
            paddingLeft: 2,
            flexDirection: "column"
        }, !process.env.IS_DEMO && J.oauthAccount?.organizationName && OA.createElement(T, {
            dimColor: !0
        }, "Message from ", J.oauthAccount.organizationName, ":"), OA.createElement(T, null, D)), A[16] = D, A[17] = J, A[18] = E1;
        else E1 = A[18];
        let K8, e8;
        if (A[19] === Symbol.for("react.memo_cache_sentinel")) K8 = !1, e8 = !1, A[19] = K8, A[20] = e8;
        else K8 = A[19], e8 = A[20];
        let n8;
        if (A[21] !== E1) n8 = OA.createElement(OA.Fragment, null, D1, J1, n6, d6, S6, g6, E1, K8, e8), A[21] = E1, A[22] = n8;
        else n8 = A[22];
        return n8
    }
    let b = aHq(Y),
        p = km(X1().theme),
        Q = ` ${kA("claude",p)("Claude Code")} ${kA("inactive",p)(`v${N}`)} `,
        U = kA("claude", p)(" Claude Code ");
    if (b === "compact") {
        let n6 = zR1(K);
        if (f8(n6) > Y - 4) {
            let n8;
            if (A[23] === Symbol.for("react.memo_cache_sentinel")) n8 = zR1(null), A[23] = n8;
            else n8 = A[23];
            n6 = n8
        }
        let d6 = R ? Y - 4 - 1 - f8(R) - 3 : Y - 4,
            S6 = nn6(V, Math.max(d6, 10)),
            g6;
        if (A[24] !== U) g6 = {
            content: U,
            position: "top",
            align: "start",
            offset: 1
        }, A[24] = U, A[25] = g6;
        else g6 = A[25];
        let D1;
        if (A[26] === Symbol.for("react.memo_cache_sentinel")) D1 = OA.createElement(m, {
            marginY: 1
        }, OA.createElement($N6, null)), A[26] = D1;
        else D1 = A[26];
        let J1;
        if (A[27] !== B) J1 = OA.createElement(T, {
            dimColor: !0
        }, B), A[27] = B, A[28] = J1;
        else J1 = A[28];
        let E1, K8;
        if (A[29] === Symbol.for("react.memo_cache_sentinel")) E1 = OA.createElement(GR1, null), K8 = OA.createElement(WR1, null), A[29] = E1, A[30] = K8;
        else E1 = A[29], K8 = A[30];
        let e8;
        if (A[31] !== O) e8 = O && OA.createElement(m, {
            marginTop: 1,
            flexDirection: "column"
        }, OA.createElement(T, {
            color: "warning"
        }, "Your bash commands will be sandboxed. Disable with /sandbox.")), A[31] = O, A[32] = e8;
        else e8 = A[32];
        return OA.createElement(OA.Fragment, null, OA.createElement(f66, null, OA.createElement(m, {
            flexDirection: "column",
            borderStyle: "round",
            borderColor: "claude",
            borderText: g6,
            paddingX: 1,
            paddingY: 1,
            alignItems: "center",
            width: Y
        }, OA.createElement(T, {
            bold: !0
        }, n6), D1, J1, OA.createElement(T, {
            dimColor: !0
        }, L), OA.createElement(T, {
            dimColor: !0
        }, R ? `@${R} · ${S6}` : S6))), E1, K8, e8)
    }
    let r = zR1(K),
        e = !process.env.IS_DEMO && J.oauthAccount?.organizationName ? `${B} · ${L} · ${J.oauthAccount.organizationName}` : `${B} · ${L}`,
        Y6 = R ? hc8 - 1 - f8(R) - 3 : hc8,
        H6 = nn6(V, Math.max(Y6, 10)),
        J6 = R ? `@${R} · ${H6}` : H6,
        K6 = tHq(r, J6, e),
        {
            leftWidth: s,
            rightWidth: X6
        } = sHq(Y, b, K6),
        z6 = f66,
        N6 = m,
        $6 = "column",
        n = "round",
        o = "claude",
        a;
    if (A[33] !== Q) a = {
        content: Q,
        position: "top",
        align: "start",
        offset: 3
    }, A[33] = Q, A[34] = a;
    else a = A[34];
    let i = m,
        l = b === "horizontal" ? "row" : "column",
        q6 = 1,
        w6 = 1,
        O6;
    if (A[35] !== r) O6 = OA.createElement(m, {
        marginTop: 1
    }, OA.createElement(T, {
        bold: !0
    }, r)), A[35] = r, A[36] = O6;
    else O6 = A[36];
    let L6;
    if (A[37] === Symbol.for("react.memo_cache_sentinel")) L6 = OA.createElement($N6, null), A[37] = L6;
    else L6 = A[37];
    let y6;
    if (A[38] !== e) y6 = OA.createElement(T, {
        dimColor: !0
    }, e), A[38] = e, A[39] = y6;
    else y6 = A[39];
    let G6;
    if (A[40] !== J6) G6 = OA.createElement(T, {
        dimColor: !0
    }, J6), A[40] = J6, A[41] = G6;
    else G6 = A[41];
    let R6;
    if (A[42] !== y6 || A[43] !== G6) R6 = OA.createElement(m, {
        flexDirection: "column",
        alignItems: "center"
    }, y6, G6), A[42] = y6, A[43] = G6, A[44] = R6;
    else R6 = A[44];
    let T6;
    if (A[45] !== s || A[46] !== O6 || A[47] !== R6) T6 = OA.createElement(m, {
        flexDirection: "column",
        width: s,
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 9
    }, O6, L6, R6), A[45] = s, A[46] = O6, A[47] = R6, A[48] = T6;
    else T6 = A[48];
    let D6;
    if (A[49] !== b) D6 = b === "horizontal" && OA.createElement(DD, {
        orientation: "vertical",
        dividerColor: "claude"
    }), A[49] = b, A[50] = D6;
    else D6 = A[50];
    let Q6 = b === "horizontal" && OA.createElement(wjq, {
            feeds: _ ? [Xjq(JT8()), JR1(q)] : $ ? [JR1(q), Pjq()] : [JR1(q), Djq(M)],
            maxWidth: X6
        }),
        k6;
    if (A[51] !== i || A[52] !== l || A[53] !== T6 || A[54] !== D6 || A[55] !== Q6) k6 = OA.createElement(i, {
        flexDirection: l,
        paddingX: q6,
        gap: w6
    }, T6, D6, Q6), A[51] = i, A[52] = l, A[53] = T6, A[54] = D6, A[55] = Q6, A[56] = k6;
    else k6 = A[56];
    let Z6;
    if (A[57] !== N6 || A[58] !== a || A[59] !== k6) Z6 = OA.createElement(N6, {
        flexDirection: $6,
        borderStyle: n,
        borderColor: o,
        borderText: a
    }, k6), A[57] = N6, A[58] = a, A[59] = k6, A[60] = Z6;
    else Z6 = A[60];
    let u6;
    if (A[61] !== z6 || A[62] !== Z6) u6 = OA.createElement(z6, null, Z6), A[61] = z6, A[62] = Z6, A[63] = u6;
    else u6 = A[63];
    let C6, o6, V6, b6, E6;
    if (A[64] === Symbol.for("react.memo_cache_sentinel")) C6 = OA.createElement(GR1, null), o6 = OA.createElement(WR1, null), V6 = PT() && OA.createElement(m, {
        paddingLeft: 2,
        flexDirection: "column"
    }, OA.createElement(T, {
        color: "warning"
    }, "Debug mode enabled"), OA.createElement(T, {
        dimColor: !0
    }, "Logging to: ", Sx() ? "stderr" : $A6())), b6 = OA.createElement(Ec8, null), E6 = process.env.CLAUDE_CODE_TMUX_SESSION && OA.createElement(m, {
        paddingLeft: 2,
        flexDirection: "column"
    }, OA.createElement(T, {
        dimColor: !0
    }, "tmux session: ", process.env.CLAUDE_CODE_TMUX_SESSION), OA.createElement(T, {
        dimColor: !0
    }, process.env.CLAUDE_CODE_TMUX_PREFIX_CONFLICTS ? `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} ${process.env.CLAUDE_CODE_TMUX_PREFIX} d (press prefix twice - Claude uses ${process.env.CLAUDE_CODE_TMUX_PREFIX})` : `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} d`)), A[64] = C6, A[65] = o6, A[66] = V6, A[67] = b6, A[68] = E6;
    else C6 = A[64], o6 = A[65], V6 = A[66], b6 = A[67], E6 = A[68];
    let U6;
    if (A[69] !== D || A[70] !== J) U6 = D && OA.createElement(m, {
        paddingLeft: 2,
        flexDirection: "column"
    }, !process.env.IS_DEMO && J.oauthAccount?.organizationName && OA.createElement(T, {
        dimColor: !0
    }, "Message from ", J.oauthAccount.organizationName, ":"), OA.createElement(T, null, D)), A[69] = D, A[70] = J, A[71] = U6;
    else U6 = A[71];
    let c6;
    if (A[72] !== O) c6 = O && OA.createElement(m, {
        paddingLeft: 2,
        flexDirection: "column"
    }, OA.createElement(T, {
        color: "warning"
    }, "Your bash commands will be sandboxed. Disable with /sandbox.")), A[72] = O, A[73] = c6;
    else c6 = A[73];
    let K1, j6;
    if (A[74] === Symbol.for("react.memo_cache_sentinel")) K1 = !1, j6 = !1, A[74] = K1, A[75] = j6;
    else K1 = A[74], j6 = A[75];
    let W6;
    if (A[76] !== u6 || A[77] !== U6 || A[78] !== c6) W6 = OA.createElement(OA.Fragment, null, u6, C6, o6, V6, b6, E6, U6, c6, K1, j6), A[76] = u6, A[77] = U6, A[78] = c6, A[79] = W6;
    else W6 = A[79];
    return W6
}
// @from(Ln 411630, Col 0)
function _eY(A) {
    if (A.lastReleaseNotesSeen === {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION) return A;
    return {
        ...A,
        lastReleaseNotesSeen: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION
    }
}
// @from(Ln 411652, Col 0)
function weY(A) {
    return A.effortValue
}
// @from(Ln 411656, Col 0)
function OeY(A) {
    return A.agent
}
// @from(Ln 411659, Col 4)
OA
// @from(Ln 411659, Col 8)
tn6
// @from(Ln 411659, Col 13)
hc8 = 50
// @from(Ln 411660, Col 4)
Ljq = E(() => {
    e6();
    i6();
    _q();
    q3();
    wR1();
    M4();
    Z7();
    HR1();
    Ojq();
    Wjq();
    C16();
    k8();
    EX6();
    i8();
    H1();
    SF6();
    Njq();
    WN1();
    _N6();
    $e();
    A8();
    XS();
    Vjq();
    Ejq();
    Rc8();
    Lz();
    Vc8();
    NA();
    wk();
    mY6();
    z4();
    OA = t(P6(), 1), tn6 = t(P6(), 1)
})
// @from(Ln 411695, Col 0)
function Rjq(A) {
    let q = A6(10),
        {
            message: K,
            isTranscriptMode: Y
        } = A;
    if (!(Y && K.timestamp && K.type === "assistant" && K.message.content.some($eY))) return null;
    let _, w, O;
    if (q[0] !== K.timestamp) w = new Date(K.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: !0
    }), _ = m, O = f8(w), q[0] = K.timestamp, q[1] = _, q[2] = w, q[3] = O;
    else _ = q[1], w = q[2], O = q[3];
    let $;
    if (q[4] !== w) $ = Sc8.default.createElement(T, {
        dimColor: !0
    }, w), q[4] = w, q[5] = $;
    else $ = q[5];
    let H;
    if (q[6] !== _ || q[7] !== O || q[8] !== $) H = Sc8.default.createElement(_, {
        minWidth: O
    }, $), q[6] = _, q[7] = O, q[8] = $, q[9] = H;
    else H = q[9];
    return H
}
// @from(Ln 411722, Col 0)
function $eY(A) {
    return A.type === "text"
}
// @from(Ln 411725, Col 4)
Sc8
// @from(Ln 411726, Col 4)
hjq = E(() => {
    e6();
    i6();
    q3();
    Sc8 = t(P6(), 1)
})
// @from(Ln 411733, Col 0)
function Sjq(A) {
    let q = A6(5),
        {
            message: K,
            isTranscriptMode: Y
        } = A;
    if (!(Y && K.type === "assistant" && K.message.model && K.message.content.some(HeY))) return null;
    let _ = f8(K.message.model) + 8,
        w;
    if (q[0] !== K.message.model) w = Cc8.default.createElement(T, {
        dimColor: !0
    }, K.message.model), q[0] = K.message.model, q[1] = w;
    else w = q[1];
    let O;
    if (q[2] !== _ || q[3] !== w) O = Cc8.default.createElement(m, {
        minWidth: _
    }, w), q[2] = _, q[3] = w, q[4] = O;
    else O = q[4];
    return O
}
// @from(Ln 411754, Col 0)
function HeY(A) {
    return A.type === "text"
}
// @from(Ln 411757, Col 4)
Cc8
// @from(Ln 411758, Col 4)
Cjq = E(() => {
    e6();
    i6();
    q3();
    Cc8 = t(P6(), 1)
})
// @from(Ln 411765, Col 0)
function Ijq(A, q, K, Y) {
    for (let z = q + 1; z < A.length; z++) {
        let _ = A[z];
        if (_?.type === "assistant") {
            let w = _.message.content[0];
            if (w?.type === "thinking" || w?.type === "redacted_thinking") continue;
            if (w?.type === "tool_use") {
                if (i36(w.name, w.input, K).isCollapsible) continue;
                if (Y.has(w.id)) continue
            }
            return !0
        }
        if (_?.type === "system" || _?.type === "attachment") continue;
        if (_?.type === "user") {
            if (_.message.content[0]?.type === "tool_result") continue
        }
        if (_?.type === "grouped_tool_use") {
            let w = _.messages[0]?.message.content[0]?.input;
            if (i36(_.toolName, w, K).isCollapsible) continue
        }
        return !0
    }
    return !1
}
// @from(Ln 411790, Col 0)
function jeY(A) {
    let q = A6(62),
        {
            message: K,
            isUserContinuation: Y,
            hasContentAfter: z,
            tools: _,
            commands: w,
            verbose: O,
            inProgressToolUseIDs: $,
            streamingToolUseIDs: H,
            screen: j,
            canAnimate: J,
            onOpenRateLimitOptions: M,
            lastThinkingBlockId: D,
            latestBashOutputUUID: X,
            columns: P,
            isLoading: W,
            lookups: Z
        } = A,
        G = j === "transcript",
        f = K.type === "grouped_tool_use",
        v = K.type === "collapsed_read_search",
        N;
    if (q[0] !== z || q[1] !== $ || q[2] !== v || q[3] !== W || q[4] !== K) N = v && (BV8(K, $) || W && !z), q[0] = z, q[1] = $, q[2] = v, q[3] = W, q[4] = K, q[5] = N;
    else N = q[5];
    let V = N,
        L;
    if (q[6] !== v || q[7] !== f || q[8] !== K) L = f ? K.displayMessage : v ? VY4(K) : K, q[6] = v, q[7] = f, q[8] = K, q[9] = L;
    else L = q[9];
    let h = L,
        R;
    if (q[10] !== v || q[11] !== f || q[12] !== Z || q[13] !== K) R = f || v ? [] : Bjq(K, Z), q[10] = v, q[11] = f, q[12] = Z, q[13] = K, q[14] = R;
    else R = q[14];
    let u = R,
        I;
    if (q[15] !== $ || q[16] !== v || q[17] !== f || q[18] !== Z || q[19] !== K || q[20] !== j || q[21] !== H) {
        let Y6 = f || v ? fR1 : mjq(K, Z);
        I = ujq(K, H, $, Y6, j, Z), q[15] = $, q[16] = v, q[17] = f, q[18] = Z, q[19] = K, q[20] = j, q[21] = H, q[22] = I
    } else I = q[22];
    let g = I,
        B = !1;
    if (J)
        if (f) {
            let Y6;
            if (q[23] !== $ || q[24] !== K.messages) {
                let H6;
                if (q[26] !== $) H6 = (J6) => {
                    let K6 = J6.message.content[0];
                    return K6?.type === "tool_use" && $.has(K6.id)
                }, q[26] = $, q[27] = H6;
                else H6 = q[27];
                Y6 = K.messages.some(H6), q[23] = $, q[24] = K.messages, q[25] = Y6
            } else Y6 = q[25];
            B = Y6
        } else if (v) {
        let Y6;
        if (q[28] !== $ || q[29] !== K) Y6 = BV8(K, $), q[28] = $, q[29] = K, q[30] = Y6;
        else Y6 = q[30];
        B = Y6
    } else {
        let Y6;
        if (q[31] !== $ || q[32] !== K) {
            let H6 = u16(K);
            Y6 = !H6 || $.has(H6), q[31] = $, q[32] = K, q[33] = Y6
        } else Y6 = q[33];
        B = Y6
    }
    let b;
    if (q[34] !== h || q[35] !== G) b = G && h.type === "assistant" && h.message.content.some(JeY) && (h.timestamp || h.message.model), q[34] = h, q[35] = G, q[36] = b;
    else b = q[36];
    let p = b,
        Q;
    if (q[37] !== h || q[38] !== p || q[39] !== G) Q = p && yE.createElement(m, {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 1,
        marginTop: 1
    }, yE.createElement(Rjq, {
        message: h,
        isTranscriptMode: G
    }), yE.createElement(Sjq, {
        message: h,
        isTranscriptMode: G
    })), q[37] = h, q[38] = p, q[39] = G, q[40] = Q;
    else Q = q[40];
    let U = !p,
        r;
    if (q[41] !== w || q[42] !== $ || q[43] !== V || q[44] !== g || q[45] !== G || q[46] !== Y || q[47] !== D || q[48] !== X || q[49] !== Z || q[50] !== K || q[51] !== M || q[52] !== u || q[53] !== B || q[54] !== U || q[55] !== _ || q[56] !== O) r = yE.createElement(tR, {
        message: K,
        lookups: Z,
        addMargin: U,
        tools: _,
        commands: w,
        verbose: O,
        inProgressToolUseIDs: $,
        progressMessagesForMessage: u,
        shouldAnimate: B,
        shouldShowDot: !0,
        isTranscriptMode: G,
        isStatic: g,
        onOpenRateLimitOptions: M,
        isActiveCollapsedGroup: V,
        isUserContinuation: Y,
        lastThinkingBlockId: D,
        latestBashOutputUUID: X
    }), q[41] = w, q[42] = $, q[43] = V, q[44] = g, q[45] = G, q[46] = Y, q[47] = D, q[48] = X, q[49] = Z, q[50] = K, q[51] = M, q[52] = u, q[53] = B, q[54] = U, q[55] = _, q[56] = O, q[57] = r;
    else r = q[57];
    let e;
    if (q[58] !== P || q[59] !== Q || q[60] !== r) e = yE.createElement(m, {
        width: P,
        flexDirection: "column"
    }, Q, r), q[58] = P, q[59] = Q, q[60] = r, q[61] = e;
    else e = q[61];
    return e
}
// @from(Ln 411907, Col 0)
function JeY(A) {
    return A.type === "text"
}
// @from(Ln 411911, Col 0)
function MeY(A, q) {
    if (A.type === "grouped_tool_use") return A.messages.some((Y) => {
        let z = Y.message.content[0];
        return z?.type === "tool_use" && q.has(z.id)
    });
    if (A.type === "collapsed_read_search") return IW6(A).some((z) => q.has(z));
    let K = u16(A);
    return !!K && q.has(K)
}
// @from(Ln 411921, Col 0)
function DeY(A, q) {
    if (A.type === "grouped_tool_use") return A.messages.every((Y) => {
        let z = Y.message.content[0];
        return z?.type === "tool_use" && q.has(z.id)
    });
    if (A.type === "collapsed_read_search") return IW6(A).every((z) => q.has(z));
    let K = u16(A);
    return !K || q.has(K)
}
// @from(Ln 411931, Col 0)
function XeY(A, q) {
    if (A.message !== q.message) return !1;
    if (A.screen !== q.screen) return !1;
    if (A.verbose !== q.verbose) return !1;
    if (A.message.type === "collapsed_read_search" && q.screen !== "transcript") return !1;
    if (A.columns !== q.columns) return !1;
    let K = A.latestBashOutputUUID === A.message.uuid,
        Y = q.latestBashOutputUUID === q.message.uuid;
    if (K !== Y) return !1;
    if (A.lastThinkingBlockId !== q.lastThinkingBlockId) return !1;
    let z = MeY(A.message, A.streamingToolUseIDs),
        _ = DeY(A.message, A.lookups.resolvedToolUseIDs);
    if (z || !_) return !1;
    return !0
}
// @from(Ln 411946, Col 4)
yE
// @from(Ln 411946, Col 8)
bjq
// @from(Ln 411947, Col 4)
xjq = E(() => {
    e6();
    i6();
    JA();
    gB();
    Gf6();
    hjq();
    Cjq();
    en6();
    yE = t(P6(), 1);
    bjq = yE.memo(jeY, XeY)
})
// @from(Ln 411960, Col 0)
function feY(A, q) {
    let K = new Set(q),
        Y = new Set;
    return A.filter((z) => {
        if (z.type === "system") return !0;
        let _ = z.message?.content[0];
        if (z.type === "assistant") {
            if (_?.type === "tool_use" && _.name && K.has(_.name)) {
                if ("id" in _) Y.add(_.id);
                return !0
            }
            return !1
        }
        if (z.type === "user") {
            if (_?.type === "tool_result") return _.tool_use_id !== void 0 && Y.has(_.tool_use_id);
            return !z.isMeta
        }
        if (z.type === "attachment") {
            let w = z.attachment;
            return w?.type === "queued_command" && w.commandMode === "prompt" && !w.isMeta && w.origin === void 0
        }
        return !1
    })
}
// @from(Ln 411985, Col 0)
function TeY(A, q) {
    let K = new Set(q),
        Y = new Set,
        z = [],
        _ = 0;
    for (let w = 0; w < A.length; w++) {
        let O = A[w],
            $ = O.message?.content[0];
        if (O.type === "user" && $?.type !== "tool_result" && !O.isMeta) {
            _++;
            continue
        }
        if (O.type === "assistant") {
            if ($?.type === "text") z[w] = _;
            else if ($?.type === "tool_use" && $.name && K.has($.name)) Y.add(_)
        }
    }
    if (Y.size === 0) return A;
    return A.filter((w, O) => {
        let $ = z[O];
        return $ === void 0 || !Y.has($)
    })
}
// @from(Ln 412009, Col 0)
function NeY(A, q) {
    if (A.size !== q.size) return !1;
    for (let K of A)
        if (!q.has(K)) return !1;
    return !0
}
// @from(Ln 412016, Col 0)
function ujq(A, q, K, Y, z, _) {
    if (z === "transcript") return !0;
    switch (A.type) {
        case "attachment":
        case "user":
        case "assistant": {
            let w = u16(A);
            if (!w) return !0;
            if (q.has(w)) return !1;
            if (K.has(w)) return !1;
            if (Ujq(w, "PostToolUse", _)) return !1;
            return rHq(Y, _.resolvedToolUseIDs)
        }
        case "system":
            return A.subtype !== "api_error";
        case "grouped_tool_use":
            return A.messages.every((O) => {
                let $ = O.message.content[0];
                return $?.type === "tool_use" && _.resolvedToolUseIDs.has($.id)
            });
        case "collapsed_read_search":
            return !1
    }
}
// @from(Ln 412041, Col 0)
function VeY(A) {
    return A.type === "tool_result"
}
// @from(Ln 412045, Col 0)
function keY(A) {
    let q = $Z({
        content: [A.contentBlock]
    });
    return q.uuid = qr6(A.contentBlock.id, 0), JM([q])
}
// @from(Ln 412052, Col 0)
function EeY(A) {
    return A.type !== "progress"
}
// @from(Ln 412056, Col 0)
function yeY(A) {
    return A !== null
}
// @from(Ln 412060, Col 0)
function LeY(A) {
    return A !== null
}
// @from(Ln 412064, Col 0)
function ReY(A) {
    return A.contentBlock.id
}
// @from(Ln 412067, Col 4)
r5
// @from(Ln 412067, Col 8)
Ar6
// @from(Ln 412067, Col 13)
PeY
// @from(Ln 412067, Col 18)
WeY = null
// @from(Ln 412068, Col 4)
gjq
// @from(Ln 412068, Col 9)
ZeY = null
// @from(Ln 412069, Col 4)
GeY = null
// @from(Ln 412070, Col 4)
Ic8 = 30
// @from(Ln 412071, Col 4)
Fjq = 200