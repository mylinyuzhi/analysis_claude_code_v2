
// @from(Ln 322548, Col 0)
function uY6({
    onDone: A,
    startingMessage: q,
    mode: K = "login",
    forceLoginMethod: Y
}) {
    let z = PA() || {},
        _ = Y ?? z.forceLoginMethod,
        w = z.forceLoginOrgUUID,
        O = _ === "claudeai" ? "Login method pre-selected: Subscription Plan (Claude Pro/Max)" : _ === "console" ? "Login method pre-selected: API Usage Billing (Anthropic Console)" : null,
        $ = Vm(),
        [H, j] = w7.useState(() => {
            if (K === "setup-token") return {
                state: "ready_to_start"
            };
            if (_ === "claudeai" || _ === "console") return {
                state: "ready_to_start"
            };
            return {
                state: "idle"
            }
        }),
        [J, M] = w7.useState(""),
        [D, X] = w7.useState(0),
        [P] = w7.useState(() => new I96),
        [W, Z] = w7.useState(() => {
            return K === "setup-token" || _ === "claudeai"
        }),
        [G, f] = w7.useState(!1),
        [v, N] = w7.useState(!1),
        V = KA().columns - bU4.length - 1;
    w7.useEffect(() => {
        if (_ === "claudeai") d("tengu_oauth_claudeai_forced", {});
        else if (_ === "console") d("tengu_oauth_console_forced", {})
    }, [_]), w7.useEffect(() => {
        if (H.state === "about_to_retry") setTimeout(j, 1000, H.nextState)
    }, [H]), D8("confirm:yes", () => {
        d("tengu_oauth_success", {
            loginWithClaudeAi: W
        }), A()
    }, {
        context: "Confirmation",
        isActive: H.state === "success" && K !== "setup-token"
    }), D8("confirm:yes", () => {
        j({
            state: "idle"
        })
    }, {
        context: "Confirmation",
        isActive: H.state === "platform_setup"
    }), D8("confirm:yes", () => {
        if (H.state === "error" && H.toRetry) M(""), j({
            state: "about_to_retry",
            nextState: H.toRetry
        })
    }, {
        context: "Confirmation",
        isActive: H.state === "error" && !!H.toRetry
    }), w7.useEffect(() => {
        if (J === "c" && H.state === "waiting_for_login" && G && !v) ZZ(H.url).then((I) => {
            if (I) N(!0), setTimeout(N, 2000, !1)
        }), M("")
    }, [J, H, G, v]);
    async function L(I, g) {
        try {
            let [B, b] = I.split("#");
            if (!B || !b) {
                j({
                    state: "error",
                    message: "Invalid code. Please make sure the full code was copied",
                    toRetry: {
                        state: "waiting_for_login",
                        url: g
                    }
                });
                return
            }
            d("tengu_oauth_manual_entry", {}), P.handleManualAuthCodeInput({
                authorizationCode: B,
                state: b
            })
        } catch (B) {
            _6(B), j({
                state: "error",
                message: B.message,
                toRetry: {
                    state: "waiting_for_login",
                    url: g
                }
            })
        }
    }
    let h = w7.useCallback(async () => {
            try {
                d("tengu_oauth_flow_start", {
                    loginWithClaudeAi: W
                });
                let I = await P.startOAuthFlow(async (g) => {
                    j({
                        state: "waiting_for_login",
                        url: g
                    }), setTimeout(f, 3000, !0)
                }, {
                    loginWithClaudeAi: W,
                    inferenceOnly: K === "setup-token",
                    expiresIn: K === "setup-token" ? 31536000 : void 0,
                    orgUUID: w
                }).catch((g) => {
                    let B = g.message.includes("Token exchange failed"),
                        b = kt(g);
                    throw j({
                        state: "error",
                        message: b ?? (B ? "Failed to exchange authorization code for access token. Please try again." : g.message),
                        toRetry: K === "setup-token" ? {
                            state: "ready_to_start"
                        } : {
                            state: "idle"
                        }
                    }), d("tengu_oauth_token_exchange_error", {
                        error: g.message,
                        ssl_error: b !== null
                    }), g
                });
                if (K === "setup-token") j({
                    state: "success",
                    token: I.accessToken
                });
                else {
                    await wc6(I);
                    let g = await Yl();
                    if (!g.valid) throw Error(g.message);
                    j({
                        state: "success"
                    }), Hg({
                        message: "Claude Code login successful",
                        notificationType: "auth_success"
                    }, $)
                }
            } catch (I) {
                let g = I.message,
                    B = kt(I);
                j({
                    state: "error",
                    message: B ?? g,
                    toRetry: {
                        state: K === "setup-token" ? "ready_to_start" : "idle"
                    }
                }), d("tengu_oauth_error", {
                    error: g,
                    ssl_error: B !== null
                })
            }
        }, [P, f, W, K, w]),
        R = w7.useRef(!1);
    w7.useEffect(() => {
        if (H.state === "ready_to_start" && !R.current) R.current = !0, process.nextTick((I, g) => {
            I(), g.current = !1
        }, h, R)
    }, [H.state, h]), w7.useEffect(() => {
        if (K === "setup-token" && H.state === "success") {
            let I = setTimeout((g, B) => {
                d("tengu_oauth_success", {
                    loginWithClaudeAi: g
                }), B()
            }, 500, W, A);
            return () => clearTimeout(I)
        }
    }, [K, H, W, A]), w7.useEffect(() => {
        return () => {
            P.cleanup()
        }
    }, [P]);

    function u() {
        switch (H.state) {
            case "idle":
                return w7.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1,
                    marginTop: 1
                }, w7.default.createElement(T, {
                    bold: !0
                }, q ? q : "Claude Code can be used with your Claude subscription or billed based on API usage through your Console account."), w7.default.createElement(T, null, "Select login method:"), w7.default.createElement(m, null, w7.default.createElement(T8, {
                    options: [{
                        label: w7.default.createElement(T, null, "Claude account with subscription ·", " ", w7.default.createElement(T, {
                            dimColor: !0
                        }, "Pro, Max, Team, or Enterprise"), `
`),
                        value: "claudeai"
                    }, {
                        label: w7.default.createElement(T, null, "Anthropic Console account ·", " ", w7.default.createElement(T, {
                            dimColor: !0
                        }, "API usage billing"), `
`),
                        value: "console"
                    }, {
                        label: w7.default.createElement(T, null, "3rd-party platform ·", " ", w7.default.createElement(T, {
                            dimColor: !0
                        }, "Amazon Bedrock, Microsoft Foundry, or Vertex AI"), `
`),
                        value: "platform"
                    }],
                    onChange: (I) => {
                        if (I === "platform") d("tengu_oauth_platform_selected", {}), j({
                            state: "platform_setup"
                        });
                        else if (j({
                                state: "ready_to_start"
                            }), I === "claudeai") d("tengu_oauth_claudeai_selected", {}), Z(!0);
                        else d("tengu_oauth_console_selected", {}), Z(!1)
                    }
                })));
            case "platform_setup":
                return w7.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1,
                    marginTop: 1
                }, w7.default.createElement(T, {
                    bold: !0
                }, "Using 3rd-party platforms"), w7.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, w7.default.createElement(T, null, "Claude Code supports Amazon Bedrock, Microsoft Foundry, and Vertex AI. Set the required environment variables, then restart Claude Code."), w7.default.createElement(T, null, "If you are part of an enterprise organization, contact your administrator for setup instructions."), w7.default.createElement(m, {
                    flexDirection: "column",
                    marginTop: 1
                }, w7.default.createElement(T, {
                    bold: !0
                }, "Documentation:"), w7.default.createElement(T, null, "· Amazon Bedrock:", " ", w7.default.createElement(y7, {
                    url: "https://code.claude.com/docs/en/amazon-bedrock"
                }, "https://code.claude.com/docs/en/amazon-bedrock")), w7.default.createElement(T, null, "· Microsoft Foundry:", " ", w7.default.createElement(y7, {
                    url: "https://code.claude.com/docs/en/microsoft-foundry"
                }, "https://code.claude.com/docs/en/microsoft-foundry")), w7.default.createElement(T, null, "· Vertex AI:", " ", w7.default.createElement(y7, {
                    url: "https://code.claude.com/docs/en/google-vertex-ai"
                }, "https://code.claude.com/docs/en/google-vertex-ai"))), w7.default.createElement(m, {
                    marginTop: 1
                }, w7.default.createElement(T, {
                    dimColor: !0
                }, "Press ", w7.default.createElement(T, {
                    bold: !0
                }, "Enter"), " to go back to login options."))));
            case "waiting_for_login":
                return w7.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, O && w7.default.createElement(m, null, w7.default.createElement(T, {
                    dimColor: !0
                }, O)), !G && w7.default.createElement(m, null, w7.default.createElement(Wq, null), w7.default.createElement(T, null, "Opening browser to sign in…")), G && w7.default.createElement(m, null, w7.default.createElement(T, null, bU4), w7.default.createElement(J5, {
                    value: J,
                    onChange: M,
                    onSubmit: (I) => L(I, H.url),
                    cursorOffset: D,
                    onChangeCursorOffset: X,
                    columns: V,
                    mask: "*"
                })));
            case "creating_api_key":
                return w7.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, w7.default.createElement(m, null, w7.default.createElement(Wq, null), w7.default.createElement(T, null, "Creating API key for Claude Code…")));
            case "about_to_retry":
                return w7.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, w7.default.createElement(T, {
                    color: "permission"
                }, "Retrying…"));
            case "success":
                return w7.default.createElement(m, {
                    flexDirection: "column"
                }, K === "setup-token" && H.token ? null : w7.default.createElement(w7.default.Fragment, null, L3()?.emailAddress ? w7.default.createElement(T, {
                    dimColor: !0
                }, "Logged in as", " ", w7.default.createElement(T, null, L3()?.emailAddress)) : null, w7.default.createElement(T, {
                    color: "success"
                }, "Login successful. Press ", w7.default.createElement(T, {
                    bold: !0
                }, "Enter"), " to continue…")));
            case "error":
                return w7.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, w7.default.createElement(T, {
                    color: "error"
                }, "OAuth error: ", H.message), H.toRetry && w7.default.createElement(m, {
                    marginTop: 1
                }, w7.default.createElement(T, {
                    color: "permission"
                }, "Press ", w7.default.createElement(T, {
                    bold: !0
                }, "Enter"), " to retry.")));
            default:
                return null
        }
    }
    return w7.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, H.state === "waiting_for_login" && G && w7.default.createElement(m, {
        flexDirection: "column",
        key: "urlToCopy",
        gap: 1,
        paddingBottom: 1
    }, w7.default.createElement(m, {
        paddingX: 1
    }, w7.default.createElement(T, {
        dimColor: !0
    }, "Browser didn't open? Use the url below to sign in", " "), v ? w7.default.createElement(T, {
        color: "success"
    }, "(Copied!)") : w7.default.createElement(T, {
        dimColor: !0
    }, w7.default.createElement(a1, {
        shortcut: "c",
        action: "copy",
        parens: !0
    }))), w7.default.createElement(y7, {
        url: H.url
    }, w7.default.createElement(T, {
        dimColor: !0
    }, H.url))), K === "setup-token" && H.state === "success" && H.token && w7.default.createElement(m, {
        key: "tokenOutput",
        flexDirection: "column",
        gap: 1,
        paddingTop: 1
    }, w7.default.createElement(T, {
        color: "success"
    }, "✓ Long-lived authentication token created successfully!"), w7.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, w7.default.createElement(T, null, "Your OAuth token (valid for 1 year):"), w7.default.createElement(T, {
        color: "warning"
    }, H.token), w7.default.createElement(T, {
        dimColor: !0
    }, "Store this token securely. You won't be able to see it again."), w7.default.createElement(T, {
        dimColor: !0
    }, "Use this token by setting: export CLAUDE_CODE_OAUTH_TOKEN=<token>"))), w7.default.createElement(m, {
        paddingLeft: 1,
        flexDirection: "column",
        gap: 1
    }, u()))
}
// @from(Ln 322888, Col 4)
w7
// @from(Ln 322888, Col 8)
bU4 = "Paste code here if prompted > "
// @from(Ln 322889, Col 4)
$c6 = E(() => {
    i6();
    _7();
    vc();
    Lq();
    AH();
    TZ1();
    fA();
    V1();
    _q();
    k1();
    LO();
    DU6();
    Hs();
    v3();
    Oc6();
    fA();
    i8();
    uv();
    w7 = t(P6(), 1)
})
// @from(Ln 322911, Col 0)
function sR() {
    let A = M1((z) => z.mainLoopModel),
        q = M1((z) => z.mainLoopModelForSession),
        [, K] = Iv1.useReducer((z) => z + 1, 0);
    return Iv1.useEffect(() => Hc6(K), []), H5(q ?? A ?? Mv())
}
// @from(Ln 322917, Col 4)
Iv1
// @from(Ln 322918, Col 4)
mY6 = E(() => {
    z4();
    HA();
    NA();
    Iv1 = t(P6(), 1)
})
// @from(Ln 322924, Col 0)
async function Jc6(A, q) {
    if (nb8) return;
    if (nb8 = !0, !A.isBypassPermissionsModeAvailable) return;
    if (!await bv1()) return;
    q((Y) => {
        return {
            ...Y,
            toolPermissionContext: X36(Y.toolPermissionContext)
        }
    })
}
// @from(Ln 322936, Col 0)
function uU4() {
    nb8 = !1
}
// @from(Ln 322940, Col 0)
function mU4() {
    let A = M1((K) => K.toolPermissionContext),
        q = xA();
    jc6.useEffect(() => {
        if (t4()) return;
        Jc6(A, q)
    }, [])
}
// @from(Ln 322948, Col 0)
async function Mc6(A, q, K) {
    {
        if (rb8) return;
        rb8 = !0;
        let {
            updateContext: Y,
            notification: z
        } = await Dc6(A, K);
        q((_) => {
            let w = Y(_.toolPermissionContext),
                O = w === _.toolPermissionContext ? _ : {
                    ..._,
                    toolPermissionContext: w
                };
            if (!z) return O;
            return {
                ...O,
                notifications: {
                    ...O.notifications,
                    queue: [...O.notifications.queue, {
                        key: "auto-mode-gate-notification",
                        text: z,
                        color: "warning",
                        priority: "high"
                    }]
                }
            }
        })
    }
}
// @from(Ln 322979, Col 0)
function ob8() {
    rb8 = !1
}
// @from(Ln 322983, Col 0)
function BU4() {
    let A = M1((w) => w.mainLoopModel),
        q = M1((w) => w.mainLoopModelForSession),
        K = M1((w) => w.fastMode),
        Y = xA(),
        z = S5(),
        _ = jc6.useRef(!0);
    jc6.useEffect(() => {
        if (t4()) return;
        if (_.current) _.current = !1;
        else ob8();
        Mc6(z.getState().toolPermissionContext, Y, K)
    }, [A, q, K])
}
// @from(Ln 322997, Col 4)
jc6
// @from(Ln 322997, Col 9)
nb8 = !1
// @from(Ln 322998, Col 4)
rb8 = !1
// @from(Ln 322999, Col 4)
ab8 = E(() => {
    NA();
    rJ();
    T1();
    jc6 = t(P6(), 1)
})
// @from(Ln 323005, Col 4)
gU4 = {}
// @from(Ln 323011, Col 0)
function ZGY() {
    let A = L3();
    if (!A) return {};
    return {
        email: A.emailAddress,
        account_uuid: A.accountUuid,
        organization_uuid: A.organizationUuid
    }
}
// @from(Ln 323020, Col 0)
async function GGY(A, q) {
    return Wb.createElement(Hf6, {
        onDone: async (K) => {
            if (q.onChangeAPIKey(), q.setMessages(FU4), K) {
                uw6(), QN4(ZGY()), pG1(), yU6(), r$6(), EY6(), uU4();
                let Y = q.getAppState();
                Jc6(Y.toolPermissionContext, q.setAppState), ob8(), Mc6(Y.toolPermissionContext, q.setAppState, Y.fastMode), q.setAppState((z) => ({
                    ...z,
                    authVersion: z.authVersion + 1
                }))
            }
            A(K ? "Login successful" : "Login interrupted")
        }
    })
}
// @from(Ln 323036, Col 0)
function Hf6(A) {
    let q = A6(12),
        K = sR(),
        Y;
    if (q[0] !== K || q[1] !== A) Y = () => A.onDone(!1, K), q[0] = K, q[1] = A, q[2] = Y;
    else Y = q[2];
    let z;
    if (q[3] !== K || q[4] !== A) z = () => A.onDone(!0, K), q[3] = K, q[4] = A, q[5] = z;
    else z = q[5];
    let _;
    if (q[6] !== A.startingMessage || q[7] !== z) _ = Wb.createElement(uY6, {
        onDone: z,
        startingMessage: A.startingMessage
    }), q[6] = A.startingMessage, q[7] = z, q[8] = _;
    else _ = q[8];
    let w;
    if (q[9] !== Y || q[10] !== _) w = Wb.createElement(m8, {
        title: "Login",
        onCancel: Y,
        color: "permission",
        inputGuide: fGY
    }, _), q[9] = Y, q[10] = _, q[11] = w;
    else w = q[11];
    return w
}
// @from(Ln 323062, Col 0)
function fGY(A) {
    return A.pending ? Wb.createElement(T, null, "Press ", A.keyName, " again to exit") : Wb.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })
}
// @from(Ln 323070, Col 4)
Wb
// @from(Ln 323071, Col 4)
xv1 = E(() => {
    e6();
    i6();
    $c6();
    wq();
    OK();
    mY6();
    T1();
    JA();
    SG1();
    fA();
    $G6();
    AN();
    HA();
    _76();
    ab8();
    Wb = t(P6(), 1)
})
// @from(Ln 323089, Col 4)
Xc6 = {}
// @from(Ln 323106, Col 0)
function TGY(A) {
    if (!X8.isAxiosError(A)) return !1;
    if (!A.response) return !0;
    if (A.response.status >= 500) return !0;
    return !1
}
// @from(Ln 323112, Col 0)
async function UU4(A, q) {
    let K;
    for (let Y = 0; Y <= sb8; Y++) try {
        return await X8.get(A, q)
    } catch (z) {
        if (K = z, !TGY(z)) throw z;
        if (Y >= sb8) throw k(`Teleport request failed after ${Y+1} attempts: ${_1(z)}`), z;
        let _ = QU4[Y] ?? 2000;
        k(`Teleport request failed (attempt ${Y+1}/${sb8+1}), retrying in ${_}ms: ${_1(z)}`), await new Promise((w) => setTimeout(w, _))
    }
    throw K
}
// @from(Ln 323124, Col 0)
async function k0() {
    let A = sA()?.accessToken;
    if (A === void 0) throw Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
    let q = await mR();
    if (!q) throw Error("Unable to get organization UUID");
    return {
        accessToken: A,
        orgUUID: q
    }
}
// @from(Ln 323134, Col 0)
async function tb8() {
    let {
        accessToken: A,
        orgUUID: q
    } = await k0(), K = `${P7().BASE_API_URL}/v1/sessions`;
    try {
        let Y = {
                ...zj(A),
                "anthropic-beta": "ccr-byoc-2025-07-29",
                "x-organization-uuid": q
            },
            z = await UU4(K, {
                headers: Y
            });
        if (z.status !== 200) throw Error(`Failed to fetch code sessions: ${z.statusText}`);
        return z.data.data.map((w) => {
            let O = w.session_context.sources.find((H) => H.type === "git_repository"),
                $ = null;
            if (O?.url) {
                let H = m46(O.url);
                if (H) {
                    let [j, J] = H.split("/");
                    if (j && J) $ = {
                        name: J,
                        owner: {
                            login: j
                        },
                        default_branch: O.revision || void 0
                    }
                }
            }
            return {
                id: w.id,
                title: w.title || "Untitled",
                description: "",
                status: w.session_status,
                repo: $,
                turns: [],
                created_at: w.created_at,
                updated_at: w.updated_at
            }
        })
    } catch (Y) {
        let z = Y instanceof Error ? Y : Error(String(Y));
        throw _6(z), Y
    }
}
// @from(Ln 323182, Col 0)
function zj(A) {
    return {
        Authorization: `Bearer ${A}`,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
    }
}
// @from(Ln 323189, Col 0)
async function jf6(A) {
    let {
        accessToken: q,
        orgUUID: K
    } = await k0(), Y = `${P7().BASE_API_URL}/v1/sessions/${A}`, z = {
        ...zj(q),
        "anthropic-beta": "ccr-byoc-2025-07-29",
        "x-organization-uuid": K
    }, _ = await X8.get(Y, {
        headers: z,
        timeout: 15000,
        validateStatus: (w) => w < 500
    });
    if (_.status !== 200) {
        let O = _.data?.error?.message;
        if (_.status === 404) throw Error(`Session not found: ${A}`);
        if (_.status === 401) throw Error("Session expired. Please run /login to sign in again.");
        throw Error(O || `Failed to fetch session: ${_.status} ${_.statusText}`)
    }
    return _.data
}
// @from(Ln 323211, Col 0)
function mv1(A) {
    return A.session_context.outcomes?.find((K) => K.type === "git_repository")?.git_info?.branches[0]
}
// @from(Ln 323214, Col 0)
async function eb8(A, q, K) {
    try {
        let {
            accessToken: Y,
            orgUUID: z
        } = await k0(), _ = `${P7().BASE_API_URL}/v1/sessions/${A}/events`, w = {
            ...zj(Y),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": z
        }, $ = {
            events: [{
                uuid: K?.uuid ?? pU4(),
                session_id: A,
                type: "user",
                parent_tool_use_id: null,
                message: {
                    role: "user",
                    content: q
                }
            }]
        };
        k(`[sendEventToRemoteSession] Sending event to session ${A}`);
        let H = await X8.post(_, $, {
            headers: w,
            validateStatus: (j) => j < 500,
            timeout: 30000
        });
        if (H.status === 200 || H.status === 201) return k(`[sendEventToRemoteSession] Successfully sent event to session ${A}`), !0;
        return k(`[sendEventToRemoteSession] Failed with status ${H.status}: ${B6(H.data)}`), !1
    } catch (Y) {
        return k(`[sendEventToRemoteSession] Error: ${_1(Y)}`), !1
    }
}
// @from(Ln 323248, Col 0)
function NGY(A, q) {
    let K = A.type === "assistant" ? "assistant" : "user",
        Y = A.message?.content ?? "";
    return {
        uuid: A.uuid ?? pU4(),
        session_id: q,
        type: K === "assistant" ? "assistant" : "user",
        parent_tool_use_id: null,
        message: {
            role: K,
            content: Y
        }
    }
}
// @from(Ln 323262, Col 0)
async function VGY(A, q) {
    if (q.length === 0) return 0;
    try {
        let {
            accessToken: K,
            orgUUID: Y
        } = await k0(), z = `${P7().BASE_API_URL}/v1/sessions/${A}/events`, _ = {
            ...zj(K),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": Y
        }, w = 0;
        for (let O = 0; O < q.length; O += uv1) {
            let $ = q.slice(O, O + uv1),
                H = $.map((J) => NGY(J, A)),
                j = await X8.post(z, {
                    events: H
                }, {
                    headers: _,
                    validateStatus: (J) => J < 500,
                    timeout: 30000
                });
            if (j.status !== 200 && j.status !== 201) return k(`[sendTranscriptToRemoteSession] Batch ${Math.floor(O/uv1)+1} failed with status ${j.status}: ${B6(j.data)}`), -1;
            w += $.length, k(`[sendTranscriptToRemoteSession] Uploaded batch ${Math.floor(O/uv1)+1} (${w}/${q.length} messages)`)
        }
        return w
    } catch (K) {
        return k(`[sendTranscriptToRemoteSession] Error: ${_1(K)}`), -1
    }
}
// @from(Ln 323291, Col 0)
async function Ax8(A, q) {
    try {
        let {
            accessToken: K,
            orgUUID: Y
        } = await k0(), z = `${P7().BASE_API_URL}/v1/sessions/${A}`, _ = {
            ...zj(K),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": Y
        };
        k(`[updateSessionTitle] Updating title for session ${A}: "${q}"`);
        let w = await X8.patch(z, {
            title: q
        }, {
            headers: _,
            validateStatus: (O) => O < 500
        });
        if (w.status === 200) return k(`[updateSessionTitle] Successfully updated title for session ${A}`), !0;
        return k(`[updateSessionTitle] Failed with status ${w.status}: ${B6(w.data)}`), !1
    } catch (K) {
        return k(`[updateSessionTitle] Error: ${_1(K)}`), !1
    }
}
// @from(Ln 323314, Col 4)
QU4
// @from(Ln 323314, Col 9)
sb8
// @from(Ln 323314, Col 14)
vGY
// @from(Ln 323314, Col 19)
uv1 = 100
// @from(Ln 323315, Col 4)
EZ = E(() => {
    F5();
    fA();
    kK();
    W0();
    k1();
    H1();
    yG();
    K7();
    g1();
    s8();
    QU4 = [2000, 4000, 8000, 16000], sb8 = QU4.length;
    vGY = F6(() => y4.object({
        id: y4.string(),
        title: y4.string(),
        description: y4.string(),
        status: y4.enum(["idle", "working", "waiting", "completed", "archived", "cancelled", "rejected"]),
        repo: y4.object({
            name: y4.string(),
            owner: y4.object({
                login: y4.string()
            }),
            default_branch: y4.string().optional()
        }).nullable(),
        turns: y4.array(y4.string()),
        created_at: y4.string(),
        updated_at: y4.string()
    }))
})
// @from(Ln 323344, Col 0)
async function dU4(A) {
    let {
        accessToken: q,
        orgUUID: K
    } = await k0(), Y = {
        ...zj(q),
        "x-organization-uuid": K
    }, z = `${P7().BASE_API_URL}/api/oauth/organizations/${K}/admin_requests`;
    return (await X8.post(z, A, {
        headers: Y
    })).data
}
// @from(Ln 323356, Col 0)
async function cU4(A, q) {
    let {
        accessToken: K,
        orgUUID: Y
    } = await k0(), z = {
        ...zj(K),
        "x-organization-uuid": Y
    }, _ = `${P7().BASE_API_URL}/api/oauth/organizations/${Y}/admin_requests/me?request_type=${A}`;
    for (let O of q) _ += `&statuses=${O}`;
    return (await X8.get(_, {
        headers: z
    })).data
}
// @from(Ln 323369, Col 0)
async function lU4(A) {
    let {
        accessToken: q,
        orgUUID: K
    } = await k0(), Y = {
        ...zj(q),
        "x-organization-uuid": K
    }, z = `${P7().BASE_API_URL}/api/oauth/organizations/${K}/admin_requests/eligibility?request_type=${A}`;
    return (await X8.get(z, {
        headers: Y
    })).data
}
// @from(Ln 323381, Col 4)
iU4 = E(() => {
    kK();
    F5();
    EZ()
})
// @from(Ln 323386, Col 0)
async function Bv1() {
    let A = CK(),
        q = A === "team" || A === "enterprise",
        K = fI(),
        Y = L3()?.hasExtraUsageEnabled === !0;
    if (!K && q) {
        try {
            if ((await lU4("limit_increase"))?.is_allowed === !1) return {
                type: "message",
                value: "Please contact your admin to manage extra usage settings."
            }
        } catch (_) {
            _6(_)
        }
        try {
            let _ = await cU4("limit_increase", ["pending", "dismissed"]);
            if (_ && _.length > 0) return {
                type: "message",
                value: "You have already submitted a request for extra usage to your admin."
            }
        } catch (_) {
            _6(_)
        }
        try {
            return await dU4({
                request_type: "limit_increase",
                details: null
            }), {
                type: "message",
                value: Y ? "Request sent to your admin to increase extra usage." : "Request sent to your admin to enable extra usage."
            }
        } catch (_) {
            _6(_)
        }
        return {
            type: "message",
            value: "Please contact your admin to manage extra usage settings."
        }
    }
    let z = q ? "https://claude.ai/admin-settings/usage" : "https://claude.ai/settings/usage";
    try {
        let _ = await R9(z);
        return {
            type: "browser-opened",
            url: z,
            opened: _
        }
    } catch (_) {
        return _6(_), {
            type: "message",
            value: `Failed to open browser. Please visit ${z} to manage extra usage.`
        }
    }
}
// @from(Ln 323440, Col 4)
qx8 = E(() => {
    k1();
    fA();
    kX();
    k8();
    iU4()
})
// @from(Ln 323447, Col 4)
rU4 = {}
// @from(Ln 323451, Col 0)
async function Kx8(A, q) {
    let K = await Bv1();
    if (K.type === "message") return A(K.value), null;
    return nU4.default.createElement(Hf6, {
        startingMessage: "Starting new login following /extra-usage. Exit with Ctrl-C to use existing account.",
        onDone: (Y) => {
            q.onChangeAPIKey(), A(Y ? "Login successful" : "Login interrupted")
        }
    })
}
// @from(Ln 323461, Col 4)
nU4
// @from(Ln 323462, Col 4)
Yx8 = E(() => {
    xv1();
    qx8();
    nU4 = t(P6(), 1)
})
// @from(Ln 323467, Col 4)
oU4 = {}
// @from(Ln 323471, Col 0)
async function kGY() {
    let A = await Bv1();
    if (A.type === "message") return {
        type: "text",
        value: A.value
    };
    return {
        type: "text",
        value: A.opened ? `Browser opened to manage extra usage. If it didn't open, visit: ${A.url}` : `Please visit ${A.url} to manage extra usage.`
    }
}
// @from(Ln 323482, Col 4)
aU4 = E(() => {
    qx8()
})
// @from(Ln 323486, Col 0)
function sU4() {
    if (process.env.DISABLE_EXTRA_USAGE_COMMAND) return !1;
    return U06()
}
// @from(Ln 323490, Col 4)
H66
// @from(Ln 323490, Col 9)
tU4
// @from(Ln 323491, Col 4)
Pc6 = E(() => {
    fA();
    T1();
    H66 = {
        type: "local-jsx",
        name: "extra-usage",
        description: "Configure extra usage to keep working when limits are hit",
        isEnabled: () => sU4() && !q7(),
        isHidden: !1,
        load: () => Promise.resolve().then(() => (Yx8(), rU4)),
        userFacingName() {
            return "extra-usage"
        }
    }, tU4 = {
        type: "local",
        name: "extra-usage",
        supportsNonInteractive: !0,
        description: "Configure extra usage to keep working when limits are hit",
        isEnabled: () => sU4() && q7(),
        get isHidden() {
            return !q7()
        },
        load: () => Promise.resolve().then(() => (aU4(), oU4)),
        userFacingName() {
            return "extra-usage"
        }
    }
})
// @from(Ln 323520, Col 0)
function j66() {
    let [A, q] = gv1.useState({
        ...Jf
    });
    return gv1.useEffect(() => {
        let K = (Y) => {
            q({
                ...Y
            })
        };
        return Nt.add(K), () => {
            Nt.delete(K)
        }
    }, []), A
}
// @from(Ln 323535, Col 4)
gv1
// @from(Ln 323536, Col 4)
Wc6 = E(() => {
    ud();
    gv1 = t(P6(), 1)
})
// @from(Ln 323541, Col 0)
function EGY({
    shouldShowUpsell: A,
    isMax20x: q,
    isExtraUsageCommandEnabled: K,
    shouldAutoOpenRateLimitOptionsMenu: Y,
    isTeamOrEnterprise: z,
    hasBillingAccess: _
}) {
    if (!A) return null;
    if (q) {
        if (K) return "/extra-usage to finish what you’re working on.";
        return "/login to switch to an API usage-billed account."
    }
    if (Y) return "Opening your options…";
    if (!z && !K) return "/upgrade to increase your usage limit.";
    if (z) {
        if (!K) return null;
        if (_) return "/extra-usage to finish what you’re working on.";
        return "/extra-usage to request more usage from your admin."
    }
    return "/upgrade or /extra-usage to finish what you’re working on."
}
// @from(Ln 323564, Col 0)
function eU4(A) {
    let q = A6(16),
        {
            text: K,
            onOpenRateLimitOptions: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = CK(), q[0] = z;
    else z = q[0];
    let _ = z,
        w;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) w = ox(), q[1] = w;
    else w = q[1];
    let O = w,
        $ = _ === "team" || _ === "enterprise",
        H = O === "default_claude_max_20x",
        j;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) j = F06() || iA(), q[2] = j;
    else j = q[2];
    let J = j,
        M = J && !H,
        [D, X] = Fv1.useState(!1),
        P = j66(),
        W = P.status === "rejected" && P.resetsAt !== void 0 && !P.isUsingOverage,
        Z = M && !D && W && Y,
        G, f;
    if (q[3] !== Y || q[4] !== Z) G = () => {
        if (Z) X(!0), Y()
    }, f = [Z, Y], q[3] = Y, q[4] = Z, q[5] = G, q[6] = f;
    else G = q[5], f = q[6];
    Fv1.useEffect(G, f);
    let v;
    A: {
        let R;
        if (q[7] !== Z) R = EGY({
            shouldShowUpsell: J,
            isMax20x: H,
            isExtraUsageCommandEnabled: H66.isEnabled(),
            shouldAutoOpenRateLimitOptionsMenu: !!Z,
            isTeamOrEnterprise: $,
            hasBillingAccess: fI()
        }),
        q[7] = Z,
        q[8] = R;
        else R = q[8];
        let u = R;
        if (!u) {
            v = null;
            break A
        }
        let I;
        if (q[9] !== u) I = Zc6.default.createElement(T, {
            dimColor: !0
        }, u),
        q[9] = u,
        q[10] = I;
        else I = q[10];v = I
    }
    let N = v,
        V;
    if (q[11] !== K) V = Zc6.default.createElement(T, {
        color: "error"
    }, K), q[11] = K, q[12] = V;
    else V = q[12];
    let L = D ? null : N,
        h;
    if (q[13] !== V || q[14] !== L) h = Zc6.default.createElement(t1, null, Zc6.default.createElement(m, {
        flexDirection: "column"
    }, V, L)), q[13] = V, q[14] = L, q[15] = h;
    else h = q[15];
    return h
}
// @from(Ln 323636, Col 4)
Zc6
// @from(Ln 323636, Col 9)
Fv1
// @from(Ln 323637, Col 4)
Ad4 = E(() => {
    e6();
    fA();
    IF6();
    i6();
    iq();
    Pc6();
    k8();
    Wc6();
    Zc6 = t(P6(), 1), Fv1 = t(P6(), 1)
})
// @from(Ln 323649, Col 0)
function yGY() {
    let A = A6(2),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = uJ7(), A[0] = q;
    else q = A[0];
    let K = q,
        Y;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) Y = C9.default.createElement(t1, null, C9.default.createElement(m, {
        flexDirection: "column"
    }, C9.default.createElement(T, {
        color: "error"
    }, lX1), K && C9.default.createElement(T, {
        dimColor: !0
    }, "· Run in another terminal: security unlock-keychain"))), A[1] = Y;
    else Y = A[1];
    return Y
}
// @from(Ln 323667, Col 0)
function Kd4(A) {
    let q = A6(32),
        {
            param: K,
            addMargin: Y,
            shouldShowDot: z,
            verbose: _,
            onOpenRateLimitOptions: w
        } = A,
        {
            text: O
        } = K;
    if (pv1(O)) return null;
    if ($A4(O)) {
        let $;
        if (q[0] !== w || q[1] !== O) $ = C9.default.createElement(eU4, {
            text: O,
            onOpenRateLimitOptions: w
        }), q[0] = w, q[1] = O, q[2] = $;
        else $ = q[2];
        return $
    }
    switch (O) {
        case N36:
            return null;
        case EB: {
            let $;
            if (q[3] === Symbol.for("react.memo_cache_sentinel")) $ = LZ6("warning"), q[3] = $;
            else $ = q[3];
            let H = $,
                j;
            if (q[4] === Symbol.for("react.memo_cache_sentinel")) j = C9.default.createElement(t1, {
                height: 1
            }, C9.default.createElement(T, {
                color: "error"
            }, "Context limit reached · /compact or /clear to continue", H ? ` · ${H}` : "")), q[4] = j;
            else j = q[4];
            return j
        }
        case cX1: {
            let $;
            if (q[5] === Symbol.for("react.memo_cache_sentinel")) $ = C9.default.createElement(t1, {
                height: 1
            }, C9.default.createElement(T, {
                color: "error"
            }, "Credit balance too low · Add funds: https://platform.claude.com/settings/billing")), q[5] = $;
            else $ = q[5];
            return $
        }
        case lX1: {
            let $;
            if (q[6] === Symbol.for("react.memo_cache_sentinel")) $ = C9.default.createElement(yGY, null), q[6] = $;
            else $ = q[6];
            return $
        }
        case iX1: {
            let $;
            if (q[7] === Symbol.for("react.memo_cache_sentinel")) $ = C9.default.createElement(t1, {
                height: 1
            }, C9.default.createElement(T, {
                color: "error"
            }, iX1)), q[7] = $;
            else $ = q[7];
            return $
        }
        case Nv8:
        case vv8: {
            let $;
            if (q[8] !== O) $ = C9.default.createElement(t1, null, C9.default.createElement(T, {
                color: "error"
            }, O)), q[8] = O, q[9] = $;
            else $ = q[9];
            return $
        }
        case nX1: {
            let $;
            if (q[10] === Symbol.for("react.memo_cache_sentinel")) $ = C9.default.createElement(t1, {
                height: 1
            }, C9.default.createElement(T, {
                color: "error"
            }, nX1)), q[10] = $;
            else $ = q[10];
            return $
        }
        case rX1: {
            let $;
            if (q[11] === Symbol.for("react.memo_cache_sentinel")) $ = C9.default.createElement(t1, {
                height: 1
            }, C9.default.createElement(T, {
                color: "error"
            }, rX1, process.env.API_TIMEOUT_MS && C9.default.createElement(C9.default.Fragment, null, " ", "(API_TIMEOUT_MS=", process.env.API_TIMEOUT_MS, "ms, try increasing it)"))), q[11] = $;
            else $ = q[11];
            return $
        }
        case v36: {
            let $;
            if (q[12] === Symbol.for("react.memo_cache_sentinel")) $ = C9.default.createElement(T, {
                color: "error"
            }, "We are experiencing high demand for Opus 4."), q[12] = $;
            else $ = q[12];
            let H;
            if (q[13] === Symbol.for("react.memo_cache_sentinel")) H = C9.default.createElement(t1, null, C9.default.createElement(m, {
                flexDirection: "column",
                gap: 1
            }, $, C9.default.createElement(T, null, "To continue immediately, use /model to switch to", " ", qJ(Ef()), " and continue coding."))), q[13] = H;
            else H = q[13];
            return H
        }
        case zl: {
            let $;
            if (q[14] === Symbol.for("react.memo_cache_sentinel")) $ = C9.default.createElement(t1, {
                height: 1
            }, C9.default.createElement(CB, null)), q[14] = $;
            else $ = q[14];
            return $
        }
        default: {
            if (O.startsWith(j$)) {
                let D = !_ && O.length > qd4,
                    X = O === j$ ? `${j$}: Please wait a moment and try again.` : D ? O.slice(0, qd4) + "…" : O,
                    P;
                if (q[15] !== X) P = C9.default.createElement(T, {
                    color: "error"
                }, X), q[15] = X, q[16] = P;
                else P = q[16];
                let W;
                if (q[17] !== D) W = D && C9.default.createElement(oJ, null), q[17] = D, q[18] = W;
                else W = q[18];
                let Z;
                if (q[19] !== P || q[20] !== W) Z = C9.default.createElement(t1, null, C9.default.createElement(m, {
                    flexDirection: "column"
                }, P, W)), q[19] = P, q[20] = W, q[21] = Z;
                else Z = q[21];
                return Z
            }
            let $ = Y ? 1 : 0,
                H;
            if (q[22] !== z) H = z && C9.default.createElement(m, {
                minWidth: 2
            }, C9.default.createElement(T, {
                color: "text"
            }, I3)), q[22] = z, q[23] = H;
            else H = q[23];
            let j;
            if (q[24] !== O) j = C9.default.createElement(m, {
                flexDirection: "column"
            }, C9.default.createElement(U_, null, O)), q[24] = O, q[25] = j;
            else j = q[25];
            let J;
            if (q[26] !== H || q[27] !== j) J = C9.default.createElement(m, {
                flexDirection: "row"
            }, H, j), q[26] = H, q[27] = j, q[28] = J;
            else J = q[28];
            let M;
            if (q[29] !== $ || q[30] !== J) M = C9.default.createElement(m, {
                alignItems: "flex-start",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: $,
                width: "100%"
            }, J), q[29] = $, q[30] = J, q[31] = M;
            else M = q[31];
            return M
        }
    }
}
// @from(Ln 323833, Col 4)
C9
// @from(Ln 323833, Col 8)
qd4 = 1000
// @from(Ln 323834, Col 4)
Yd4 = E(() => {
    e6();
    i6();
    yB();
    JA();
    qw();
    ov();
    iq();
    z4();
    WZ1();
    _l();
    MW6();
    QT8();
    Gq6();
    Ad4();
    GR();
    C9 = t(P6(), 1)
})
// @from(Ln 323853, Col 0)
function Qv1(A) {
    let q = A6(8),
        {
            param: K,
            addMargin: Y
        } = A,
        {
            text: z
        } = K,
        _;
    if (q[0] !== z) _ = d4(z, "bash-input"), q[0] = z, q[1] = _;
    else _ = q[1];
    let w = _;
    if (!w) return null;
    let O = Y ? 1 : 0,
        $;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) $ = BY6.createElement(T, {
        color: "bashBorder"
    }, "! "), q[2] = $;
    else $ = q[2];
    let H;
    if (q[3] !== w) H = BY6.createElement(T, {
        color: "text"
    }, w), q[3] = w, q[4] = H;
    else H = q[4];
    let j;
    if (q[5] !== O || q[6] !== H) j = BY6.createElement(m, {
        flexDirection: "row",
        marginTop: O,
        backgroundColor: "bashMessageBackgroundColor",
        paddingRight: 1
    }, $, H), q[5] = O, q[6] = H, q[7] = j;
    else j = q[7];
    return j
}
// @from(Ln 323888, Col 4)
BY6
// @from(Ln 323889, Col 4)
zx8 = E(() => {
    e6();
    i6();
    JA();
    BY6 = t(P6(), 1)
})
// @from(Ln 323896, Col 0)
function zd4(A) {
    let q = A6(19),
        {
            addMargin: K,
            param: Y
        } = A,
        {
            text: z
        } = Y,
        _;
    if (q[0] !== z) _ = d4(z, PP), q[0] = z, q[1] = _;
    else _ = q[1];
    let w = _,
        O;
    if (q[2] !== z) O = d4(z, "command-args"), q[2] = z, q[3] = O;
    else O = q[3];
    let $ = O,
        H = d4(z, "skill-format") === "true";
    if (!w) return null;
    if (H) {
        let W = K ? 1 : 0,
            Z;
        if (q[4] === Symbol.for("react.memo_cache_sentinel")) Z = E0.createElement(T, {
            color: "subtle"
        }, a6.pointer, " "), q[4] = Z;
        else Z = q[4];
        let G;
        if (q[5] !== w) G = E0.createElement(T, null, Z, E0.createElement(T, {
            color: "text"
        }, "Skill(", w, ")")), q[5] = w, q[6] = G;
        else G = q[6];
        let f;
        if (q[7] !== W || q[8] !== G) f = E0.createElement(m, {
            flexDirection: "column",
            marginTop: W,
            backgroundColor: "userMessageBackground",
            paddingRight: 1
        }, G), q[7] = W, q[8] = G, q[9] = f;
        else f = q[9];
        return f
    }
    let j;
    if (q[10] !== $ || q[11] !== w) j = [w, $].filter(Boolean), q[10] = $, q[11] = w, q[12] = j;
    else j = q[12];
    let J = `/${j.join(" ")}`,
        M = K ? 1 : 0,
        D;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) D = E0.createElement(T, {
        color: "subtle"
    }, a6.pointer, " "), q[13] = D;
    else D = q[13];
    let X;
    if (q[14] !== J) X = E0.createElement(T, null, D, E0.createElement(T, {
        color: "text"
    }, J)), q[14] = J, q[15] = X;
    else X = q[15];
    let P;
    if (q[16] !== M || q[17] !== X) P = E0.createElement(m, {
        flexDirection: "column",
        marginTop: M,
        backgroundColor: "userMessageBackground",
        paddingRight: 1
    }, X), q[16] = M, q[17] = X, q[18] = P;
    else P = q[18];
    return P
}
// @from(Ln 323962, Col 4)
E0
// @from(Ln 323963, Col 4)
_d4 = E(() => {
    e6();
    b7();
    i6();
    JA();
    vz();
    E0 = t(P6(), 1)
})
// @from(Ln 323972, Col 0)
function Uv1(A, q = new Date) {
    let K = new Date(A);
    if (Number.isNaN(K.getTime())) return "";
    let Y = K.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit"
        }),
        z = wd4(q) - wd4(K),
        _ = Math.round(z / 86400000);
    if (_ === 0) return Y;
    let w = K.toLocaleDateString("en-US", {
        weekday: "long"
    });
    if (_ > 0 && _ < 7) return `${w} ${Y}`;
    let O = K.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
    return `${w}, ${O} at ${Y}`
}
// @from(Ln 323993, Col 0)
function wd4(A) {
    return new Date(A.getFullYear(), A.getMonth(), A.getDate()).getTime()
}
// @from(Ln 323997, Col 0)
function Od4(A) {
    let q = A6(21),
        {
            text: K,
            useBriefLayout: Y,
            timestamp: z
        } = A;
    if (Y) {
        let H;
        if (q[0] !== z) H = z ? Uv1(z) : "", q[0] = z, q[1] = H;
        else H = q[1];
        let j = H,
            J;
        if (q[2] === Symbol.for("react.memo_cache_sentinel")) J = ww.createElement(T, {
            color: "briefLabelYou"
        }, "You"), q[2] = J;
        else J = q[2];
        let M;
        if (q[3] !== j) M = j ? ww.createElement(T, {
            dimColor: !0
        }, " ", j) : null, q[3] = j, q[4] = M;
        else M = q[4];
        let D;
        if (q[5] !== M) D = ww.createElement(m, {
            flexDirection: "row"
        }, J, M), q[5] = M, q[6] = D;
        else D = q[6];
        let X;
        if (q[7] !== K) X = ww.createElement(T, {
            color: "text"
        }, K), q[7] = K, q[8] = X;
        else X = q[8];
        let P;
        if (q[9] !== D || q[10] !== X) P = ww.createElement(m, {
            flexDirection: "column",
            paddingLeft: 2
        }, D, X), q[9] = D, q[10] = X, q[11] = P;
        else P = q[11];
        return P
    }
    let _, w;
    if (q[12] !== K) {
        w = Symbol.for("react.early_return_sentinel");
        A: {
            let H = GU() ? C21(K) : [];
            if (H.length === 0) {
                let J;
                if (q[15] === Symbol.for("react.memo_cache_sentinel")) J = ww.createElement(T, {
                    color: "subtle"
                }, a6.pointer, " "), q[15] = J;
                else J = q[15];
                let M = ww.createElement(T, {
                        color: "text"
                    }, K),
                    D;
                if (q[16] !== M) D = ww.createElement(T, null, J, M), q[16] = M, q[17] = D;
                else D = q[17];
                w = D;
                break A
            }
            _ = [];
            let j = 0;
            for (let J of H) {
                if (J.start > j) _.push(ww.createElement(T, {
                    key: `plain-${j}`,
                    color: "text"
                }, K.slice(j, J.start)));
                for (let M = J.start; M < J.end; M++) _.push(ww.createElement(T, {
                    key: `rb-${M}`,
                    color: Rx6(M - J.start)
                }, K[M]));
                j = J.end
            }
            if (j < K.length) _.push(ww.createElement(T, {
                key: `plain-${j}`,
                color: "text"
            }, K.slice(j)))
        }
        q[12] = K, q[13] = _, q[14] = w
    } else _ = q[13], w = q[14];
    if (w !== Symbol.for("react.early_return_sentinel")) return w;
    let O;
    if (q[18] === Symbol.for("react.memo_cache_sentinel")) O = ww.createElement(T, {
        color: "subtle"
    }, a6.pointer, " "), q[18] = O;
    else O = q[18];
    let $;
    if (q[19] !== _) $ = ww.createElement(T, null, O, _), q[19] = _, q[20] = $;
    else $ = q[20];
    return $
}
// @from(Ln 324088, Col 4)
ww
// @from(Ln 324089, Col 4)
$d4 = E(() => {
    e6();
    b7();
    i6();
    jm();
    ww = t(P6(), 1)
})
// @from(Ln 324097, Col 0)
function Hd4({
    addMargin: A,
    param: {
        text: q
    },
    isTranscriptMode: K,
    timestamp: Y
}) {
    let z = M1((O) => O.isBriefOnly),
        _ = M1((O) => O.viewingAgentTaskId),
        w = (Vn() || KG() && (t6(process.env.CLAUDE_CODE_BRIEF) || w8("tengu_kairos_brief", !1))) && z && !K && !_;
    if (!q) return _6(Error("No content found in user prompt message")), null;
    return _x8.default.createElement(m, {
        flexDirection: "column",
        marginTop: A ? 1 : 0,
        backgroundColor: w ? void 0 : "userMessageBackground",
        paddingRight: w ? 0 : 1
    }, _x8.default.createElement(Od4, {
        text: q,
        useBriefLayout: w,
        timestamp: w ? Y : void 0
    }))
}
// @from(Ln 324120, Col 4)
_x8
// @from(Ln 324121, Col 4)
jd4 = E(() => {
    i6();
    k1();
    NA();
    T1();
    HA();
    A8();
    $d4();
    _x8 = t(P6(), 1)
})
// @from(Ln 324131, Col 4)
wE = "(no content)"
// @from(Ln 324133, Col 0)
function LGY() {
    return YM(["Got it.", "Good to know.", "Noted."])
}
// @from(Ln 324137, Col 0)
function Jd4(A) {
    let q = A6(10),
        {
            text: K,
            addMargin: Y
        } = A,
        z;
    if (q[0] !== K) z = d4(K, "user-memory-input"), q[0] = K, q[1] = z;
    else z = q[1];
    let _ = z,
        w;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) w = LGY(), q[2] = w;
    else w = q[2];
    let O = w;
    if (!_) return null;
    let $ = Y ? 1 : 0,
        H;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) H = OE.createElement(T, {
        color: "remember",
        backgroundColor: "memoryBackgroundColor"
    }, "#"), q[3] = H;
    else H = q[3];
    let j;
    if (q[4] !== _) j = OE.createElement(m, null, H, OE.createElement(T, {
        backgroundColor: "memoryBackgroundColor",
        color: "text"
    }, " ", _, " ")), q[4] = _, q[5] = j;
    else j = q[5];
    let J;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) J = OE.createElement(t1, {
        height: 1
    }, OE.createElement(T, {
        dimColor: !0
    }, O)), q[6] = J;
    else J = q[6];
    let M;
    if (q[7] !== $ || q[8] !== j) M = OE.createElement(m, {
        flexDirection: "column",
        marginTop: $,
        width: "100%"
    }, j, J), q[7] = $, q[8] = j, q[9] = M;
    else M = q[9];
    return M
}
// @from(Ln 324181, Col 4)
OE
// @from(Ln 324182, Col 4)
Md4 = E(() => {
    e6();
    i6();
    JA();
    iq();
    Nc();
    OE = t(P6(), 1)
})
// @from(Ln 324191, Col 0)
function fc6(A) {
    let q = A6(10),
        {
            elapsedTimeSeconds: K,
            timeoutMs: Y
        } = A;
    if (K === void 0 && !Y) return null;
    let z;
    if (q[0] !== Y) z = Y ? UK(Y, {
        hideTrailingZeros: !0
    }) : void 0, q[0] = Y, q[1] = z;
    else z = q[1];
    let _ = z;
    if (K === void 0) {
        let J = `(timeout ${_})`,
            M;
        if (q[2] !== J) M = dv1.default.createElement(T, {
            dimColor: !0
        }, J), q[2] = J, q[3] = M;
        else M = q[3];
        return M
    }
    let w = K * 1000,
        O;
    if (q[4] !== w) O = UK(w), q[4] = w, q[5] = O;
    else O = q[5];
    let $ = O;
    if (_) {
        let J = `(${$} · timeout ${_})`,
            M;
        if (q[6] !== J) M = dv1.default.createElement(T, {
            dimColor: !0
        }, J), q[6] = J, q[7] = M;
        else M = q[7];
        return M
    }
    let H = `(${$})`,
        j;
    if (q[8] !== H) j = dv1.default.createElement(T, {
        dimColor: !0
    }, H), q[8] = H, q[9] = j;
    else j = q[9];
    return j
}
// @from(Ln 324235, Col 4)
dv1
// @from(Ln 324236, Col 4)
wx8 = E(() => {
    e6();
    i6();
    M4();
    dv1 = t(P6(), 1)
})
// @from(Ln 324243, Col 0)
function RGY(A) {
    if (!A.match(/<sandbox_violations>([\s\S]*?)<\/sandbox_violations>/)) return {
        cleanedStderr: A
    };
    return {
        cleanedStderr: NP1(A).trim()
    }
}
// @from(Ln 324252, Col 0)
function hGY(A) {
    let q = A.match(Dd4);
    if (!q) return {
        cleanedStderr: A,
        cwdResetWarning: null
    };
    let K = q[1] ?? null;
    return {
        cleanedStderr: A.replace(Dd4, "").trim(),
        cwdResetWarning: K
    }
}
// @from(Ln 324265, Col 0)
function gY6(A) {
    let q = A6(34),
        {
            content: K,
            verbose: Y,
            timeoutMs: z
        } = A,
        {
            stdout: _,
            stderr: w,
            isImage: O,
            returnCodeInterpretation: $,
            noOutputExpected: H,
            backgroundTaskId: j
        } = K,
        J = _ === void 0 ? "" : _,
        M = w === void 0 ? "" : w,
        D, X, P, W, Z, G, f;
    if (q[0] !== O || q[1] !== M || q[2] !== J || q[3] !== Y) {
        f = Symbol.for("react.early_return_sentinel");
        A: {
            let {
                cleanedStderr: h
            } = RGY(M);
            if ({
                    cleanedStderr: P,
                    cwdResetWarning: X
                } = hGY(h), O) {
                let R;
                if (q[11] === Symbol.for("react.memo_cache_sentinel")) R = yf.default.createElement(t1, {
                    height: 1
                }, yf.default.createElement(T, {
                    dimColor: !0
                }, "[Image data detected and sent to Claude]")), q[11] = R;
                else R = q[11];
                f = R;
                break A
            }
            if (D = m, W = "column", q[12] !== J || q[13] !== Y) Z = J !== "" ? yf.default.createElement(IB, {
                content: J,
                verbose: Y
            }) : null,
            q[12] = J,
            q[13] = Y,
            q[14] = Z;
            else Z = q[14];G = P.trim() !== "" ? yf.default.createElement(IB, {
                content: P,
                verbose: Y,
                isError: !0
            }) : null
        }
        q[0] = O, q[1] = M, q[2] = J, q[3] = Y, q[4] = D, q[5] = X, q[6] = P, q[7] = W, q[8] = Z, q[9] = G, q[10] = f
    } else D = q[4], X = q[5], P = q[6], W = q[7], Z = q[8], G = q[9], f = q[10];
    if (f !== Symbol.for("react.early_return_sentinel")) return f;
    let v;
    if (q[15] !== X) v = X ? yf.default.createElement(t1, null, yf.default.createElement(T, {
        dimColor: !0
    }, X)) : null, q[15] = X, q[16] = v;
    else v = q[16];
    let N;
    if (q[17] !== j || q[18] !== X || q[19] !== H || q[20] !== $ || q[21] !== P || q[22] !== J) N = J === "" && P.trim() === "" && !X ? yf.default.createElement(t1, {
        height: 1
    }, yf.default.createElement(T, {
        dimColor: !0
    }, j ? yf.default.createElement(yf.default.Fragment, null, "Running in the background", " ", yf.default.createElement(a1, {
        shortcut: "↓",
        action: "manage",
        parens: !0
    })) : $ || (H ? "Done" : "(No output)"))) : null, q[17] = j, q[18] = X, q[19] = H, q[20] = $, q[21] = P, q[22] = J, q[23] = N;
    else N = q[23];
    let V;
    if (q[24] !== z) V = z && yf.default.createElement(t1, null, yf.default.createElement(fc6, {
        timeoutMs: z
    })), q[24] = z, q[25] = V;
    else V = q[25];
    let L;
    if (q[26] !== D || q[27] !== V || q[28] !== W || q[29] !== Z || q[30] !== G || q[31] !== v || q[32] !== N) L = yf.default.createElement(D, {
        flexDirection: W
    }, Z, G, v, N, V), q[26] = D, q[27] = V, q[28] = W, q[29] = Z, q[30] = G, q[31] = v, q[32] = N, q[33] = L;
    else L = q[33];
    return L
}
// @from(Ln 324347, Col 4)
yf
// @from(Ln 324347, Col 8)
Dd4
// @from(Ln 324348, Col 4)
cv1 = E(() => {
    e6();
    i6();
    WW6();
    iq();
    Lq();
    wx8();
    yf = t(P6(), 1), Dd4 = /(?:^|\n)(Shell cwd was reset to .+)$/
})
// @from(Ln 324358, Col 0)
function Xd4(A) {
    let q = A6(10),
        {
            content: K,
            verbose: Y
        } = A,
        z;
    if (q[0] !== K) {
        let J = d4(K, "bash-stdout") ?? "";
        z = d4(J, "persisted-output") ?? J, q[0] = K, q[1] = z
    } else z = q[1];
    let _ = z,
        w;
    if (q[2] !== K) w = d4(K, "bash-stderr") ?? "", q[2] = K, q[3] = w;
    else w = q[3];
    let O = w,
        $;
    if (q[4] !== O || q[5] !== _) $ = {
        stdout: _,
        stderr: O
    }, q[4] = O, q[5] = _, q[6] = $;
    else $ = q[6];
    let H = !!Y,
        j;
    if (q[7] !== $ || q[8] !== H) j = Ox8.createElement(gY6, {
        content: $,
        verbose: H
    }), q[7] = $, q[8] = H, q[9] = j;
    else j = q[9];
    return j
}
// @from(Ln 324389, Col 4)
Ox8
// @from(Ln 324390, Col 4)
Pd4 = E(() => {
    e6();
    cv1();
    JA();
    Ox8 = t(P6(), 1)
})
// @from(Ln 324397, Col 0)
function Zd4(A) {
    let q = A6(4),
        {
            content: K
        } = A,
        Y, z;
    if (q[0] !== K) {
        z = Symbol.for("react.early_return_sentinel");
        A: {
            let _ = d4(K, "local-command-stdout"),
                w = d4(K, "local-command-stderr");
            if (!_ && !w) {
                let O;
                if (q[3] === Symbol.for("react.memo_cache_sentinel")) O = y0.createElement(t1, null, y0.createElement(T, {
                    dimColor: !0
                }, wE)), q[3] = O;
                else O = q[3];
                z = O;
                break A
            }
            if (Y = [], _?.trim()) Y.push(y0.createElement(Wd4, {
                key: "stdout"
            }, _.trim()));
            if (w?.trim()) Y.push(y0.createElement(Wd4, {
                key: "stderr",
                isError: !0
            }, w.trim()))
        }
        q[0] = K, q[1] = Y, q[2] = z
    } else Y = q[1], z = q[2];
    if (z !== Symbol.for("react.early_return_sentinel")) return z;
    return Y
}
// @from(Ln 324431, Col 0)
function Wd4(A) {
    let q = A6(7),
        {
            children: K,
            isError: Y
        } = A,
        z = Y ? "error" : "text",
        _;
    if (q[0] !== z) _ = y0.createElement(T, {
        color: z
    }, "  ⎿  "), q[0] = z, q[1] = _;
    else _ = q[1];
    let w;
    if (q[2] !== K) w = y0.createElement(m, {
        flexDirection: "column",
        flexGrow: 1
    }, y0.createElement(U_, null, K)), q[2] = K, q[3] = w;
    else w = q[3];
    let O;
    if (q[4] !== _ || q[5] !== w) O = y0.createElement(m, {
        flexDirection: "row"
    }, _, w), q[4] = _, q[5] = w, q[6] = O;
    else O = q[6];
    return O
}
// @from(Ln 324456, Col 4)
y0
// @from(Ln 324457, Col 4)
Gd4 = E(() => {
    e6();
    JA();
    i6();
    iq();
    ov();
    y0 = t(P6(), 1)
})
// @from(Ln 324466, Col 0)
function Mf6() {
    return `claude-swarm-${process.pid}`
}
// @from(Ln 324469, Col 4)
BY = "team-lead"
// @from(Ln 324470, Col 4)
$N = "claude-swarm"
// @from(Ln 324471, Col 4)
Jf6 = "swarm-view"
// @from(Ln 324472, Col 4)
yZ = "tmux"
// @from(Ln 324473, Col 4)
$x8 = "claude-hidden"
// @from(Ln 324474, Col 4)
Df6 = "CLAUDE_CODE_TEAMMATE_COMMAND"
// @from(Ln 324475, Col 4)
fd4
// @from(Ln 324475, Col 9)
SGY
// @from(Ln 324475, Col 14)
jEw
// @from(Ln 324475, Col 19)
CGY
// @from(Ln 324475, Col 24)
JEw
// @from(Ln 324475, Col 29)
IGY
// @from(Ln 324475, Col 34)
MEw
// @from(Ln 324475, Col 39)
DEw
// @from(Ln 324475, Col 44)
bGY
// @from(Ln 324475, Col 49)
xGY
// @from(Ln 324475, Col 54)
uGY
// @from(Ln 324475, Col 59)
XEw
// @from(Ln 324475, Col 64)
mGY
// @from(Ln 324475, Col 69)
BGY
// @from(Ln 324475, Col 74)
gGY
// @from(Ln 324475, Col 79)
FGY
// @from(Ln 324475, Col 84)
lv1
// @from(Ln 324475, Col 89)
pGY
// @from(Ln 324475, Col 94)
QGY
// @from(Ln 324475, Col 99)
Td4
// @from(Ln 324475, Col 104)
PEw
// @from(Ln 324475, Col 109)
Xf6
// @from(Ln 324475, Col 114)
Hx8
// @from(Ln 324475, Col 119)
jx8
// @from(Ln 324475, Col 124)
Tc6
// @from(Ln 324475, Col 129)
WEw
// @from(Ln 324475, Col 134)
J66
// @from(Ln 324475, Col 139)
UGY
// @from(Ln 324475, Col 144)
vd4
// @from(Ln 324475, Col 149)
_j
// @from(Ln 324475, Col 153)
dGY
// @from(Ln 324475, Col 158)
cGY
// @from(Ln 324475, Col 163)
lGY
// @from(Ln 324475, Col 168)
iGY
// @from(Ln 324475, Col 173)
nGY
// @from(Ln 324475, Col 178)
rGY
// @from(Ln 324475, Col 183)
oGY
// @from(Ln 324475, Col 188)
aGY
// @from(Ln 324475, Col 193)
sGY
// @from(Ln 324475, Col 198)
tGY
// @from(Ln 324475, Col 203)
eGY
// @from(Ln 324475, Col 208)
AfY
// @from(Ln 324475, Col 213)
qfY
// @from(Ln 324475, Col 218)
KfY
// @from(Ln 324475, Col 223)
YfY
// @from(Ln 324475, Col 228)
zfY
// @from(Ln 324475, Col 233)
_fY
// @from(Ln 324475, Col 238)
wfY
// @from(Ln 324475, Col 243)
OfY
// @from(Ln 324475, Col 248)
$fY
// @from(Ln 324475, Col 253)
HfY
// @from(Ln 324475, Col 258)
jfY
// @from(Ln 324475, Col 263)
JfY
// @from(Ln 324475, Col 268)
MfY
// @from(Ln 324475, Col 273)
DfY
// @from(Ln 324475, Col 278)
XfY
// @from(Ln 324475, Col 283)
PfY
// @from(Ln 324475, Col 288)
Nd4
// @from(Ln 324475, Col 293)
WfY
// @from(Ln 324475, Col 298)
ZfY
// @from(Ln 324475, Col 303)
GfY
// @from(Ln 324475, Col 308)
ffY
// @from(Ln 324475, Col 313)
TfY
// @from(Ln 324475, Col 318)
vfY
// @from(Ln 324475, Col 323)
NfY
// @from(Ln 324475, Col 328)
VfY
// @from(Ln 324475, Col 333)
kfY
// @from(Ln 324475, Col 338)
EfY
// @from(Ln 324475, Col 343)
yfY
// @from(Ln 324475, Col 348)
LfY
// @from(Ln 324475, Col 353)
RfY
// @from(Ln 324475, Col 358)
ZEw
// @from(Ln 324475, Col 363)
hfY
// @from(Ln 324475, Col 368)
GEw
// @from(Ln 324475, Col 373)
fEw
// @from(Ln 324475, Col 378)
Vd4
// @from(Ln 324475, Col 383)
kd4
// @from(Ln 324475, Col 388)
Ed4
// @from(Ln 324475, Col 393)
yd4
// @from(Ln 324475, Col 398)
SfY
// @from(Ln 324475, Col 403)
Ld4
// @from(Ln 324475, Col 408)
TEw
// @from(Ln 324475, Col 413)
vEw
// @from(Ln 324475, Col 418)
NEw
// @from(Ln 324475, Col 423)
CfY
// @from(Ln 324475, Col 428)
IfY
// @from(Ln 324475, Col 433)
bfY
// @from(Ln 324475, Col 438)
N2
// @from(Ln 324475, Col 442)
Rd4
// @from(Ln 324475, Col 447)
xfY
// @from(Ln 324475, Col 452)
ufY
// @from(Ln 324475, Col 457)
hd4
// @from(Ln 324475, Col 462)
Jx8
// @from(Ln 324475, Col 467)
mfY
// @from(Ln 324475, Col 472)
BfY
// @from(Ln 324475, Col 477)
gfY
// @from(Ln 324475, Col 482)
FfY
// @from(Ln 324475, Col 487)
Sd4
// @from(Ln 324475, Col 492)
Cd4
// @from(Ln 324475, Col 497)
Id4
// @from(Ln 324475, Col 502)
pfY
// @from(Ln 324475, Col 507)
QfY
// @from(Ln 324475, Col 512)
UfY
// @from(Ln 324475, Col 517)
dfY
// @from(Ln 324475, Col 522)
cfY
// @from(Ln 324475, Col 527)
lfY
// @from(Ln 324475, Col 532)
ifY
// @from(Ln 324475, Col 537)
nfY
// @from(Ln 324475, Col 542)
rfY
// @from(Ln 324475, Col 547)
ofY
// @from(Ln 324475, Col 552)
afY
// @from(Ln 324475, Col 557)
sfY
// @from(Ln 324475, Col 562)
tfY
// @from(Ln 324475, Col 567)
efY
// @from(Ln 324475, Col 572)
ATY
// @from(Ln 324475, Col 577)
qTY
// @from(Ln 324475, Col 582)
KTY
// @from(Ln 324475, Col 587)
YTY
// @from(Ln 324475, Col 592)
zTY
// @from(Ln 324475, Col 597)
_TY
// @from(Ln 324475, Col 602)
VEw
// @from(Ln 324475, Col 607)
bd4
// @from(Ln 324475, Col 612)
vc6
// @from(Ln 324476, Col 4)
Mx8 = E(() => {
    K7();
    fd4 = F6(() => C.object({
        inputTokens: C.number(),
        outputTokens: C.number(),
        cacheReadInputTokens: C.number(),
        cacheCreationInputTokens: C.number(),
        webSearchRequests: C.number(),
        costUSD: C.number(),
        contextWindow: C.number(),
        maxOutputTokens: C.number()
    })), SGY = F6(() => C.literal("json_schema")), jEw = F6(() => C.object({
        type: SGY()
    })), CGY = F6(() => C.object({
        type: C.literal("json_schema"),
        schema: C.record(C.string(), C.unknown())
    })), JEw = F6(() => CGY()), IGY = F6(() => C.enum(["user", "project", "org", "temporary", "oauth"])), MEw = F6(() => C.enum(["local", "user", "project"]).describe("Config scope for settings.")), DEw = F6(() => C.literal("context-1m-2025-08-07")), bGY = F6(() => C.object({
        type: C.literal("adaptive")
    }).describe("Claude decides when and how much to think (Opus 4.6+).")), xGY = F6(() => C.object({
        type: C.literal("enabled"),
        budgetTokens: C.number().optional()
    }).describe("Fixed thinking token budget (older models)")), uGY = F6(() => C.object({
        type: C.literal("disabled")
    }).describe("No extended thinking")), XEw = F6(() => C.union([bGY(), xGY(), uGY()]).describe("Controls Claude's thinking/reasoning behavior. When set, takes precedence over the deprecated maxThinkingTokens.")), mGY = F6(() => C.object({
        type: C.literal("stdio").optional(),
        command: C.string(),
        args: C.array(C.string()).optional(),
        env: C.record(C.string(), C.string()).optional()
    })), BGY = F6(() => C.object({
        type: C.literal("sse"),
        url: C.string(),
        headers: C.record(C.string(), C.string()).optional()
    })), gGY = F6(() => C.object({
        type: C.literal("http"),
        url: C.string(),
        headers: C.record(C.string(), C.string()).optional()
    })), FGY = F6(() => C.object({
        type: C.literal("sdk"),
        name: C.string()
    })), lv1 = F6(() => C.union([mGY(), BGY(), gGY(), FGY()])), pGY = F6(() => C.object({
        type: C.literal("claudeai-proxy"),
        url: C.string(),
        id: C.string()
    })), QGY = F6(() => C.union([lv1(), pGY()])), Td4 = F6(() => C.object({
        name: C.string().describe("Server name as configured"),
        status: C.enum(["connected", "failed", "needs-auth", "pending", "disabled"]).describe("Current connection status"),
        serverInfo: C.object({
            name: C.string(),
            version: C.string()
        }).optional().describe("Server information (available when connected)"),
        error: C.string().optional().describe("Error message (available when status is 'failed')"),
        config: QGY().optional().describe("Server configuration (includes URL for HTTP/SSE servers)"),
        scope: C.string().optional().describe("Configuration scope (e.g., project, user, local, claudeai, managed)"),
        tools: C.array(C.object({
            name: C.string(),
            description: C.string().optional(),
            annotations: C.object({
                readOnly: C.boolean().optional(),
                destructive: C.boolean().optional(),
                openWorld: C.boolean().optional()
            }).optional()
        })).optional().describe("Tools provided by this server (available when connected)")
    }).describe("Status information for an MCP server connection.")), PEw = F6(() => C.object({
        added: C.array(C.string()).describe("Names of servers that were added"),
        removed: C.array(C.string()).describe("Names of servers that were removed"),
        errors: C.record(C.string(), C.string()).describe("Map of server names to error messages for servers that failed to connect")
    }).describe("Result of a setMcpServers operation.")), Xf6 = F6(() => C.enum(["userSettings", "projectSettings", "localSettings", "session", "cliArg"])), Hx8 = F6(() => C.enum(["allow", "deny", "ask"])), jx8 = F6(() => C.object({
        toolName: C.string(),
        ruleContent: C.string().optional()
    })), Tc6 = F6(() => C.discriminatedUnion("type", [C.object({
        type: C.literal("addRules"),
        rules: C.array(jx8()),
        behavior: Hx8(),
        destination: Xf6()
    }), C.object({
        type: C.literal("replaceRules"),
        rules: C.array(jx8()),
        behavior: Hx8(),
        destination: Xf6()
    }), C.object({
        type: C.literal("removeRules"),
        rules: C.array(jx8()),
        behavior: Hx8(),
        destination: Xf6()
    }), C.object({
        type: C.literal("setMode"),
        mode: C.lazy(() => J66()),
        destination: Xf6()
    }), C.object({
        type: C.literal("addDirectories"),
        directories: C.array(C.string()),
        destination: Xf6()
    }), C.object({
        type: C.literal("removeDirectories"),
        directories: C.array(C.string()),
        destination: Xf6()
    })])), WEw = F6(() => C.union([C.object({
        behavior: C.literal("allow"),
        updatedInput: C.record(C.string(), C.unknown()).optional(),
        updatedPermissions: C.array(Tc6()).optional(),
        toolUseID: C.string().optional()
    }), C.object({
        behavior: C.literal("deny"),
        message: C.string(),
        interrupt: C.boolean().optional(),
        toolUseID: C.string().optional()
    })])), J66 = F6(() => C.enum(["default", "acceptEdits", "bypassPermissions", "plan", "dontAsk"]).describe("Permission mode for controlling how tool executions are handled. 'default' - Standard behavior, prompts for dangerous operations. 'acceptEdits' - Auto-accept file edit operations. 'bypassPermissions' - Bypass all permission checks (requires allowDangerouslySkipPermissions). 'plan' - Planning mode, no actual tool execution. 'dontAsk' - Don't prompt for permissions, deny if not pre-approved.")), UGY = ["PreToolUse", "PostToolUse", "PostToolUseFailure", "Notification", "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop", "SubagentStart", "SubagentStop", "PreCompact", "PostCompact", "PermissionRequest", "Setup", "TeammateIdle", "TaskCompleted", "Elicitation", "ElicitationResult", "ConfigChange", "WorktreeCreate", "WorktreeRemove", "InstructionsLoaded"], vd4 = F6(() => C.enum(UGY)), _j = F6(() => C.object({
        session_id: C.string(),
        transcript_path: C.string(),
        cwd: C.string(),
        permission_mode: C.string().optional(),
        agent_id: C.string().optional().describe("Subagent identifier. Present only when the hook fires from within a subagent (e.g., a tool called by an AgentTool worker). Absent for the main thread, even in --agent sessions. Use this field (not agent_type) to distinguish subagent calls from main-thread calls."),
        agent_type: C.string().optional().describe('Agent type name (e.g., "general-purpose", "code-reviewer"). Present when the hook fires from within a subagent (alongside agent_id), or on the main thread of a session started with --agent (without agent_id).')
    })), dGY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("PreToolUse"),
        tool_name: C.string(),
        tool_input: C.unknown(),
        tool_use_id: C.string()
    }))), cGY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("PermissionRequest"),
        tool_name: C.string(),
        tool_input: C.unknown(),
        permission_suggestions: C.array(Tc6()).optional()
    }))), lGY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("PostToolUse"),
        tool_name: C.string(),
        tool_input: C.unknown(),
        tool_response: C.unknown(),
        tool_use_id: C.string()
    }))), iGY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("PostToolUseFailure"),
        tool_name: C.string(),
        tool_input: C.unknown(),
        tool_use_id: C.string(),
        error: C.string(),
        is_interrupt: C.boolean().optional()
    }))), nGY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("Notification"),
        message: C.string(),
        title: C.string().optional(),
        notification_type: C.string()
    }))), rGY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("UserPromptSubmit"),
        prompt: C.string()
    }))), oGY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("SessionStart"),
        source: C.enum(["startup", "resume", "clear", "compact"]),
        agent_type: C.string().optional(),
        model: C.string().optional()
    }))), aGY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("Setup"),
        trigger: C.enum(["init", "maintenance"])
    }))), sGY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("Stop"),
        stop_hook_active: C.boolean(),
        last_assistant_message: C.string().optional().describe("Text content of the last assistant message before stopping. Avoids the need to read and parse the transcript file.")
    }))), tGY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("SubagentStart"),
        agent_id: C.string(),
        agent_type: C.string()
    }))), eGY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("SubagentStop"),
        stop_hook_active: C.boolean(),
        agent_id: C.string(),
        agent_transcript_path: C.string(),
        agent_type: C.string(),
        last_assistant_message: C.string().optional().describe("Text content of the last assistant message before stopping. Avoids the need to read and parse the transcript file.")
    }))), AfY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("PreCompact"),
        trigger: C.enum(["manual", "auto"]),
        custom_instructions: C.string().nullable()
    }))), qfY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("PostCompact"),
        trigger: C.enum(["manual", "auto"]),
        compact_summary: C.string().describe("The conversation summary produced by compaction")
    }))), KfY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("TeammateIdle"),
        teammate_name: C.string(),
        team_name: C.string()
    }))), YfY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("TaskCompleted"),
        task_id: C.string(),
        task_subject: C.string(),
        task_description: C.string().optional(),
        teammate_name: C.string().optional(),
        team_name: C.string().optional()
    }))), zfY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("Elicitation"),
        mcp_server_name: C.string(),
        message: C.string(),
        mode: C.enum(["form", "url"]).optional(),
        url: C.string().optional(),
        elicitation_id: C.string().optional(),
        requested_schema: C.record(C.string(), C.unknown()).optional()
    })).describe("Hook input for the Elicitation event. Fired when an MCP server requests user input. Hooks can auto-respond (accept/decline) instead of showing the dialog.")), _fY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("ElicitationResult"),
        mcp_server_name: C.string(),
        elicitation_id: C.string().optional(),
        mode: C.enum(["form", "url"]).optional(),
        action: C.enum(["accept", "decline", "cancel"]),
        content: C.record(C.string(), C.unknown()).optional()
    })).describe("Hook input for the ElicitationResult event. Fired after the user responds to an MCP elicitation. Hooks can observe or override the response before it is sent to the server.")), wfY = ["user_settings", "project_settings", "local_settings", "policy_settings", "skills"], OfY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("ConfigChange"),
        source: C.enum(wfY),
        file_path: C.string().optional()
    }))), $fY = ["session_start", "nested_traversal", "path_glob_match", "include"], HfY = ["User", "Project", "Local", "Managed"], jfY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("InstructionsLoaded"),
        file_path: C.string(),
        memory_type: C.enum(HfY),
        load_reason: C.enum($fY),
        globs: C.array(C.string()).optional(),
        trigger_file_path: C.string().optional(),
        parent_file_path: C.string().optional()
    }))), JfY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("WorktreeCreate"),
        name: C.string()
    }))), MfY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("WorktreeRemove"),
        worktree_path: C.string()
    }))), DfY = ["clear", "logout", "prompt_input_exit", "other", "bypass_permissions_disabled"], XfY = F6(() => C.enum(DfY)), PfY = F6(() => _j().and(C.object({
        hook_event_name: C.literal("SessionEnd"),
        reason: XfY()
    }))), Nd4 = F6(() => C.union([dGY(), lGY(), iGY(), nGY(), rGY(), oGY(), PfY(), sGY(), tGY(), eGY(), AfY(), qfY(), cGY(), aGY(), KfY(), YfY(), zfY(), _fY(), OfY(), jfY(), JfY(), MfY()])), WfY = F6(() => C.object({
        async: C.literal(!0),
        asyncTimeout: C.number().optional()
    })), ZfY = F6(() => C.object({
        hookEventName: C.literal("PreToolUse"),
        permissionDecision: C.enum(["allow", "deny", "ask"]).optional(),
        permissionDecisionReason: C.string().optional(),
        updatedInput: C.record(C.string(), C.unknown()).optional(),
        additionalContext: C.string().optional()
    })), GfY = F6(() => C.object({
        hookEventName: C.literal("UserPromptSubmit"),
        additionalContext: C.string().optional()
    })), ffY = F6(() => C.object({
        hookEventName: C.literal("SessionStart"),
        additionalContext: C.string().optional()
    })), TfY = F6(() => C.object({
        hookEventName: C.literal("Setup"),
        additionalContext: C.string().optional()
    })), vfY = F6(() => C.object({
        hookEventName: C.literal("SubagentStart"),
        additionalContext: C.string().optional()
    })), NfY = F6(() => C.object({
        hookEventName: C.literal("PostToolUse"),
        additionalContext: C.string().optional(),
        updatedMCPToolOutput: C.unknown().optional()
    })), VfY = F6(() => C.object({
        hookEventName: C.literal("PostToolUseFailure"),
        additionalContext: C.string().optional()
    })), kfY = F6(() => C.object({
        hookEventName: C.literal("Notification"),
        additionalContext: C.string().optional()
    })), EfY = F6(() => C.object({
        hookEventName: C.literal("PermissionRequest"),
        decision: C.union([C.object({
            behavior: C.literal("allow"),
            updatedInput: C.record(C.string(), C.unknown()).optional(),
            updatedPermissions: C.array(Tc6()).optional()
        }), C.object({
            behavior: C.literal("deny"),
            message: C.string().optional(),
            interrupt: C.boolean().optional()
        })])
    })), yfY = F6(() => C.object({
        continue: C.boolean().optional(),
        suppressOutput: C.boolean().optional(),
        stopReason: C.string().optional(),
        decision: C.enum(["approve", "block"]).optional(),
        systemMessage: C.string().optional(),
        reason: C.string().optional(),
        hookSpecificOutput: C.union([ZfY(), GfY(), ffY(), TfY(), vfY(), NfY(), VfY(), kfY(), EfY(), LfY(), RfY()]).optional()
    })), LfY = F6(() => C.object({
        hookEventName: C.literal("Elicitation"),
        action: C.enum(["accept", "decline", "cancel"]).optional(),
        content: C.record(C.string(), C.unknown()).optional()
    }).describe("Hook-specific output for the Elicitation event. Return this to programmatically accept or decline an MCP elicitation request.")), RfY = F6(() => C.object({
        hookEventName: C.literal("ElicitationResult"),
        action: C.enum(["accept", "decline", "cancel"]).optional(),
        content: C.record(C.string(), C.unknown()).optional()
    }).describe("Hook-specific output for the ElicitationResult event. Return this to override the action or content before the response is sent to the MCP server.")), ZEw = F6(() => C.union([WfY(), yfY()])), hfY = F6(() => C.object({
        key: C.string().describe("Unique key for this option, returned in the response"),
        label: C.string().describe("Display text for this option"),
        description: C.string().optional().describe("Optional description shown below the label")
    })), GEw = F6(() => C.object({
        prompt: C.string().describe("Request ID. Presence of this key marks the line as a prompt request."),
        message: C.string().describe("The prompt message to display to the user"),
        options: C.array(hfY()).describe("Available options for the user to choose from")
    })), fEw = F6(() => C.object({
        prompt_response: C.string().describe("The request ID from the corresponding prompt request"),
        selected: C.string().describe("The key of the selected option")
    })), Vd4 = F6(() => C.object({
        name: C.string().describe("Skill name (without the leading slash)"),
        description: C.string().describe("Description of what the skill does"),
        argumentHint: C.string().describe('Hint for skill arguments (e.g., "<file>")')
    }).describe("Information about an available skill (invoked via /command syntax).")), kd4 = F6(() => C.object({
        name: C.string().describe('Agent type identifier (e.g., "Explore")'),
        description: C.string().describe("Description of when to use this agent"),
        model: C.string().optional().describe("Model alias this agent uses. If omitted, inherits the parent's model")
    }).describe("Information about an available subagent that can be invoked via the Task tool.")), Ed4 = F6(() => C.object({
        value: C.string().describe("Model identifier to use in API calls"),
        displayName: C.string().describe("Human-readable display name"),
        description: C.string().describe("Description of the model's capabilities"),
        supportsEffort: C.boolean().optional().describe("Whether this model supports effort levels"),
        supportedEffortLevels: C.array(C.enum(["low", "medium", "high", "max"])).optional().describe("Available effort levels for this model"),
        supportsAdaptiveThinking: C.boolean().optional().describe("Whether this model supports adaptive thinking (Claude decides when and how much to think)"),
        supportsFastMode: C.boolean().optional().describe("Whether this model supports fast mode"),
        supportsAutoMode: C.boolean().optional().describe("Whether this model supports auto mode")
    }).describe("Information about an available model.")), yd4 = F6(() => C.object({
        email: C.string().optional(),
        organization: C.string().optional(),
        subscriptionType: C.string().optional(),
        tokenSource: C.string().optional(),
        apiKeySource: C.string().optional()
    }).describe("Information about the logged in user's account.")), SfY = F6(() => C.union([C.string(), C.record(C.string(), lv1())])), Ld4 = F6(() => C.object({
        description: C.string().describe("Natural language description of when to use this agent"),
        tools: C.array(C.string()).optional().describe("Array of allowed tool names. If omitted, inherits all tools from parent"),
        disallowedTools: C.array(C.string()).optional().describe("Array of tool names to explicitly disallow for this agent"),
        prompt: C.string().describe("The agent's system prompt"),
        model: C.string().optional().describe("Model alias (e.g. 'sonnet', 'opus', 'haiku') or full model ID (e.g. 'claude-opus-4-5'). If omitted or 'inherit', uses the main model"),
        mcpServers: C.array(SfY()).optional(),
        criticalSystemReminder_EXPERIMENTAL: C.string().optional().describe("Experimental: Critical reminder added to system prompt"),
        skills: C.array(C.string()).optional().describe("Array of skill names to preload into the agent context"),
        maxTurns: C.number().int().positive().optional().describe("Maximum number of agentic turns (API round-trips) before stopping")
    }).describe("Definition for a custom subagent that can be invoked via the Agent tool.")), TEw = F6(() => C.enum(["user", "project", "local"]).describe("Source for loading filesystem-based settings. 'user' - Global user settings (~/.claude/settings.json). 'project' - Project settings (.claude/settings.json). 'local' - Local settings (.claude/settings.local.json).")), vEw = F6(() => C.object({
        type: C.literal("local").describe("Plugin type. Currently only 'local' is supported"),
        path: C.string().describe("Absolute or relative path to the plugin directory")
    }).describe("Configuration for loading a plugin.")), NEw = F6(() => C.object({
        canRewind: C.boolean(),
        error: C.string().optional(),
        filesChanged: C.array(C.string()).optional(),
        insertions: C.number().optional(),
        deletions: C.number().optional()
    }).describe("Result of a rewindFiles operation.")), CfY = F6(() => C.unknown()), IfY = F6(() => C.unknown()), bfY = F6(() => C.unknown()), N2 = F6(() => C.string()), Rd4 = F6(() => C.unknown()), xfY = F6(() => C.enum(["authentication_failed", "billing_error", "rate_limit", "invalid_request", "server_error", "unknown", "max_output_tokens"])), ufY = F6(() => C.union([C.literal("compacting"), C.null()])), hd4 = F6(() => C.object({
        type: C.literal("user"),
        message: CfY(),
        parent_tool_use_id: C.string().nullable(),
        isSynthetic: C.boolean().optional(),
        tool_use_result: C.unknown().optional(),
        priority: C.enum(["now", "next", "later"]).optional()
    })), Jx8 = F6(() => hd4().extend({
        uuid: N2().optional(),
        session_id: C.string()
    })), mfY = F6(() => hd4().extend({
        uuid: N2(),
        session_id: C.string(),
        isReplay: C.literal(!0)
    })), BfY = F6(() => C.object({
        status: C.enum(["allowed", "allowed_warning", "rejected"]),
        resetsAt: C.number().optional(),
        rateLimitType: C.enum(["five_hour", "seven_day", "seven_day_opus", "seven_day_sonnet", "overage"]).optional(),
        utilization: C.number().optional(),
        overageStatus: C.enum(["allowed", "allowed_warning", "rejected"]).optional(),
        overageResetsAt: C.number().optional(),
        overageDisabledReason: C.enum(["overage_not_provisioned", "org_level_disabled", "org_level_disabled_until", "out_of_credits", "seat_tier_level_disabled", "member_level_disabled", "seat_tier_zero_credit_limit", "group_zero_credit_limit", "member_zero_credit_limit", "org_service_level_disabled", "org_service_zero_credit_limit", "no_limits_configured", "unknown"]).optional(),
        isUsingOverage: C.boolean().optional(),
        surpassedThreshold: C.number().optional()
    }).describe("Rate limit information for claude.ai subscription users.")), gfY = F6(() => C.object({
        type: C.literal("assistant"),
        message: IfY(),
        parent_tool_use_id: C.string().nullable(),
        error: xfY().optional(),
        uuid: N2(),
        session_id: C.string()
    })), FfY = F6(() => C.object({
        type: C.literal("rate_limit_event"),
        rate_limit_info: BfY(),
        uuid: N2(),
        session_id: C.string()
    }).describe("Rate limit event emitted when rate limit info changes.")), Sd4 = F6(() => C.object({
        type: C.literal("streamlined_text"),
        text: C.string().describe("Text content preserved from the assistant message"),
        session_id: C.string(),
        uuid: N2()
    }).describe("@internal Streamlined text message - replaces SDKAssistantMessage in streamlined output. Text content preserved, thinking and tool_use blocks removed.")), Cd4 = F6(() => C.object({
        type: C.literal("streamlined_tool_use_summary"),
        tool_summary: C.string().describe('Summary of tool calls (e.g., "Read 2 files, wrote 1 file")'),
        session_id: C.string(),
        uuid: N2()
    }).describe("@internal Streamlined tool use summary - replaces tool_use blocks in streamlined output with a cumulative summary string.")), Id4 = F6(() => C.object({
        tool_name: C.string(),
        tool_use_id: C.string(),
        tool_input: C.record(C.string(), C.unknown())
    })), pfY = F6(() => C.object({
        type: C.literal("result"),
        subtype: C.literal("success"),
        duration_ms: C.number(),
        duration_api_ms: C.number(),
        is_error: C.boolean(),
        num_turns: C.number(),
        result: C.string(),
        stop_reason: C.string().nullable(),
        total_cost_usd: C.number(),
        usage: Rd4(),
        modelUsage: C.record(C.string(), fd4()),
        permission_denials: C.array(Id4()),
        structured_output: C.unknown().optional(),
        fast_mode_state: vc6().optional(),
        uuid: N2(),
        session_id: C.string()
    })), QfY = F6(() => C.object({
        type: C.literal("result"),
        subtype: C.enum(["error_during_execution", "error_max_turns", "error_max_budget_usd", "error_max_structured_output_retries"]),
        duration_ms: C.number(),
        duration_api_ms: C.number(),
        is_error: C.boolean(),
        num_turns: C.number(),
        stop_reason: C.string().nullable(),
        total_cost_usd: C.number(),
        usage: Rd4(),
        modelUsage: C.record(C.string(), fd4()),
        permission_denials: C.array(Id4()),
        errors: C.array(C.string()),
        fast_mode_state: vc6().optional(),
        uuid: N2(),
        session_id: C.string()
    })), UfY = F6(() => C.union([pfY(), QfY()])), dfY = F6(() => C.object({
        type: C.literal("system"),
        subtype: C.literal("init"),
        agents: C.array(C.string()).optional(),
        apiKeySource: IGY(),
        betas: C.array(C.string()).optional(),
        claude_code_version: C.string(),
        cwd: C.string(),
        tools: C.array(C.string()),
        mcp_servers: C.array(C.object({
            name: C.string(),
            status: C.string()
        })),
        model: C.string(),
        permissionMode: J66(),
        slash_commands: C.array(C.string()),
        output_style: C.string(),
        skills: C.array(C.string()),
        plugins: C.array(C.object({
            name: C.string(),
            path: C.string()
        })),
        fast_mode_state: vc6().optional(),
        uuid: N2(),
        session_id: C.string()
    })), cfY = F6(() => C.object({
        type: C.literal("stream_event"),
        event: bfY(),
        parent_tool_use_id: C.string().nullable(),
        uuid: N2(),
        session_id: C.string()
    })), lfY = F6(() => C.object({
        type: C.literal("system"),
        subtype: C.literal("compact_boundary"),
        compact_metadata: C.object({
            trigger: C.enum(["manual", "auto"]),
            pre_tokens: C.number(),
            preserved_segment: C.object({
                head_uuid: N2(),
                anchor_uuid: N2(),
                tail_uuid: N2()
            }).optional().describe("Relink info for messagesToKeep. Loaders splice the preserved segment at anchor_uuid (summary for suffix-preserving, boundary for prefix-preserving partial compact) so resume includes preserved content. Unset when compaction summarizes everything (no messagesToKeep).")
        }),
        uuid: N2(),
        session_id: C.string()
    })), ifY = F6(() => C.object({
        type: C.literal("system"),
        subtype: C.literal("status"),
        status: ufY(),
        permissionMode: J66().optional(),
        uuid: N2(),
        session_id: C.string()
    })), nfY = F6(() => C.object({
        type: C.literal("system"),
        subtype: C.literal("local_command_output"),
        content: C.string(),
        uuid: N2(),
        session_id: C.string()
    }).describe("Output from a local slash command (e.g. /voice, /cost). Displayed as assistant-style text in the transcript.")), rfY = F6(() => C.object({
        type: C.literal("system"),
        subtype: C.literal("hook_started"),
        hook_id: C.string(),
        hook_name: C.string(),
        hook_event: C.string(),
        uuid: N2(),
        session_id: C.string()
    })), ofY = F6(() => C.object({
        type: C.literal("system"),
        subtype: C.literal("hook_progress"),
        hook_id: C.string(),
        hook_name: C.string(),
        hook_event: C.string(),
        stdout: C.string(),
        stderr: C.string(),
        output: C.string(),
        uuid: N2(),
        session_id: C.string()
    })), afY = F6(() => C.object({
        type: C.literal("system"),
        subtype: C.literal("hook_response"),
        hook_id: C.string(),
        hook_name: C.string(),
        hook_event: C.string(),
        output: C.string(),
        stdout: C.string(),
        stderr: C.string(),
        exit_code: C.number().optional(),
        outcome: C.enum(["success", "error", "cancelled"]),
        uuid: N2(),
        session_id: C.string()
    })), sfY = F6(() => C.object({
        type: C.literal("tool_progress"),
        tool_use_id: C.string(),
        tool_name: C.string(),
        parent_tool_use_id: C.string().nullable(),
        elapsed_time_seconds: C.number(),
        task_id: C.string().optional(),
        uuid: N2(),
        session_id: C.string()
    })), tfY = F6(() => C.object({
        type: C.literal("auth_status"),
        isAuthenticating: C.boolean(),
        output: C.array(C.string()),
        error: C.string().optional(),
        uuid: N2(),
        session_id: C.string()
    })), efY = F6(() => C.object({
        type: C.literal("system"),
        subtype: C.literal("files_persisted"),
        files: C.array(C.object({
            filename: C.string(),
            file_id: C.string()
        })),
        failed: C.array(C.object({
            filename: C.string(),
            error: C.string()
        })),
        processed_at: C.string(),
        uuid: N2(),
        session_id: C.string()
    })), ATY = F6(() => C.object({
        type: C.literal("system"),
        subtype: C.literal("task_notification"),
        task_id: C.string(),
        tool_use_id: C.string().optional(),
        status: C.enum(["completed", "failed", "stopped"]),
        output_file: C.string(),
        summary: C.string(),
        usage: C.object({
            total_tokens: C.number(),
            tool_uses: C.number(),
            duration_ms: C.number()
        }).optional(),
        uuid: N2(),
        session_id: C.string()
    })), qTY = F6(() => C.object({
        type: C.literal("system"),
        subtype: C.literal("task_started"),
        task_id: C.string(),
        tool_use_id: C.string().optional(),
        description: C.string(),
        task_type: C.string().optional(),
        prompt: C.string().optional(),
        uuid: N2(),
        session_id: C.string()
    })), KTY = F6(() => C.object({
        type: C.literal("system"),
        subtype: C.literal("task_progress"),
        task_id: C.string(),
        tool_use_id: C.string().optional(),
        description: C.string(),
        usage: C.object({
            total_tokens: C.number(),
            tool_uses: C.number(),
            duration_ms: C.number()
        }),
        last_tool_name: C.string().optional(),
        summary: C.string().optional(),
        uuid: N2(),
        session_id: C.string()
    })), YTY = F6(() => C.object({
        type: C.literal("tool_use_summary"),
        summary: C.string(),
        preceding_tool_use_ids: C.array(C.string()),
        uuid: N2(),
        session_id: C.string()
    })), zTY = F6(() => C.object({
        type: C.literal("system"),
        subtype: C.literal("elicitation_complete"),
        mcp_server_name: C.string(),
        elicitation_id: C.string(),
        uuid: N2(),
        session_id: C.string()
    }).describe("Emitted when an MCP server confirms that a URL-mode elicitation is complete.")), _TY = F6(() => C.object({
        type: C.literal("prompt_suggestion"),
        suggestion: C.string(),
        uuid: N2(),
        session_id: C.string()
    }).describe("Predicted next user prompt, emitted after each turn when promptSuggestions is enabled.")), VEw = F6(() => C.object({
        sessionId: C.string().describe("Unique session identifier (UUID)."),
        summary: C.string().describe("Display title for the session: custom title, auto-generated summary, or first prompt."),
        lastModified: C.number().describe("Last modified time in milliseconds since epoch."),
        fileSize: C.number().optional().describe("File size in bytes. Only populated for local JSONL storage."),
        customTitle: C.string().optional().describe("User-set session title via /rename."),
        firstPrompt: C.string().optional().describe("First meaningful user prompt in the session."),
        gitBranch: C.string().optional().describe("Git branch at the end of the session."),
        cwd: C.string().optional().describe("Working directory for the session."),
        tag: C.string().optional().describe("User-set session tag."),
        createdAt: C.number().optional().describe("Creation time in milliseconds since epoch, extracted from the first entry's timestamp.")
    }).describe("Session metadata returned by listSessions and getSessionInfo.")), bd4 = F6(() => C.union([gfY(), Jx8(), mfY(), UfY(), dfY(), cfY(), lfY(), ifY(), nfY(), rfY(), ofY(), afY(), sfY(), tfY(), ATY(), qTY(), KTY(), efY(), YTY(), FfY(), zTY(), _TY()])), vc6 = F6(() => C.enum(["off", "cooldown", "on"]).describe("Fast mode state: off, in cooldown after rate limit, or actively enabled."))
})
// @from(Ln 325083, Col 4)
Qd4 = {}
// @from(Ln 325135, Col 0)
function FY6(A, q) {
    let K = q || l5() || "default",
        Y = L06(K),
        z = L06(A),
        _ = Dx8(YG(), Y, "inboxes"),
        w = Dx8(_, `${z}.json`);
    return k(`[TeammateMailbox] getInboxPath: agent=${A}, team=${K}, fullPath=${w}`), w
}
// @from(Ln 325143, Col 0)
async function OTY(A) {
    let q = A || l5() || "default",
        K = L06(q),
        Y = Dx8(YG(), K, "inboxes");
    await wTY(Y, {
        recursive: !0
    }), k(`[TeammateMailbox] Ensured inbox directory: ${Y}`)
}