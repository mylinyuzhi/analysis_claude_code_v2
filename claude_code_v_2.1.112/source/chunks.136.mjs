
// @from(Ln 341653, Col 0)
function mOK() {
    let q = s(17),
        {
            goBack: K,
            goToStep: _,
            updateWizardData: z,
            wizardData: Y
        } = QK(),
        [A, O] = TT.useState(Y.keyFile ?? ""),
        [w, $] = TT.useState(A.length),
        [j, H] = TT.useState(null),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Settings"
    }, q[0] = J;
    else J = q[0];
    G1("confirm:no", K, J);
    let X;
    if (q[1] !== _ || q[2] !== z || q[3] !== A) X = () => {
        let v = A.trim();
        if (!v) {
            H("Path is required");
            return
        }
        H(null);
        let V = v === "~" || v.startsWith("~/") ? H1Y(j1Y(), v.slice(1)) : v;
        z({
            keyFile: V
        }), _(J96.PROJECT)
    }, q[1] = _, q[2] = z, q[3] = A, q[4] = X;
    else X = q[4];
    let M = X,
        P;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) P = TT.default.createElement(z1, null, TT.default.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), TT.default.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), q[5] = P;
    else P = q[5];
    let W, D;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) W = TT.default.createElement(T, null, "Path to the service account JSON key file."), D = TT.default.createElement(T, {
        dimColor: !0
    }, "Download one from the GCP console under IAM → Service Accounts → Keys → Add key."), q[6] = W, q[7] = D;
    else W = q[6], D = q[7];
    let Z;
    if (q[8] !== w || q[9] !== M || q[10] !== A) Z = TT.default.createElement(u, {
        marginTop: 1
    }, TT.default.createElement(l4, {
        value: A,
        onChange: O,
        onSubmit: M,
        placeholder: "~/keys/my-project-vertex.json",
        columns: 60,
        cursorOffset: w,
        onChangeCursorOffset: $,
        focus: !0,
        showCursor: !0
    })), q[8] = w, q[9] = M, q[10] = A, q[11] = Z;
    else Z = q[11];
    let G;
    if (q[12] !== j) G = j && TT.default.createElement(u, {
        marginTop: 1
    }, TT.default.createElement(T, {
        color: "error"
    }, j)), q[12] = j, q[13] = G;
    else G = q[13];
    let f;
    if (q[14] !== Z || q[15] !== G) f = TT.default.createElement(HK, {
        subtitle: "Service account key",
        footerText: P
    }, TT.default.createElement(u, {
        flexDirection: "column"
    }, W, D, Z, G)), q[14] = Z, q[15] = G, q[16] = f;
    else f = q[16];
    return f
}
// @from(Ln 341733, Col 4)
TT
// @from(Ln 341734, Col 4)
BOK = L(() => {
    o6();
    g6();
    C7();
    bK();
    Nq();
    u7();
    NY();
    xA();
    Kw();
    uF8();
    TT = K6(P6(), 1)
})
// @from(Ln 341748, Col 0)
function pOK() {
    let {
        goBack: q,
        goNext: K,
        updateWizardData: _,
        wizardData: z
    } = QK(), [Y, A] = hM.useState({
        phase: "checking"
    });
    if (hM.useEffect(() => {
            let w = !1;
            return NOK(z).then(($) => {
                if (w) return;
                if ($.status === "ok") _({
                    verifiedIdentity: $.identity
                });
                else _({
                    verifiedIdentity: void 0
                });
                A({
                    phase: "done",
                    result: $
                })
            }), () => {
                w = !0
            }
        }, []), Y.phase === "checking") return hM.default.createElement(HK, {
        subtitle: "Verifying credentials"
    }, hM.default.createElement(Q$, {
        message: "Calling Google Cloud…",
        subtitle: "This may take a few seconds."
    }));
    let {
        result: O
    } = Y;
    switch (O.status) {
        case "ok":
            return hM.default.createElement(HK, {
                subtitle: "Verification"
            }, hM.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, hM.default.createElement(T, null, hM.default.createElement(D4, {
                status: "success",
                withSpace: !0
            }), "Authenticated as ", hM.default.createElement(T, {
                bold: !0
            }, O.identity)), O.note && hM.default.createElement(T, {
                dimColor: !0
            }, O.note), hM.default.createElement(A1, {
                options: [{
                    label: "Continue",
                    value: "continue"
                }],
                onChange: () => K(),
                onCancel: q
            })));
        case "error":
            return hM.default.createElement(HK, {
                subtitle: "Verification failed",
                color: "error"
            }, hM.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, hM.default.createElement(u, {
                flexDirection: "column"
            }, hM.default.createElement(T, null, hM.default.createElement(D4, {
                status: "error",
                withSpace: !0
            }), O.error), O.command && hM.default.createElement(T, {
                bold: !0,
                color: "suggestion"
            }, "    ", O.command)), hM.default.createElement(A1, {
                options: [{
                    label: "Go back and fix",
                    value: "back"
                }, {
                    label: "Save anyway (skip verification)",
                    value: "skip"
                }],
                onChange: (w) => {
                    if (w === "back") q();
                    else K()
                },
                onCancel: q
            })))
    }
}
// @from(Ln 341836, Col 4)
hM
// @from(Ln 341837, Col 4)
FOK = L(() => {
    g6();
    gK();
    Qy();
    Y2();
    xA();
    Kw();
    d17();
    hM = K6(P6(), 1)
})
// @from(Ln 341848, Col 0)
function mF8({
    onComplete: q,
    onCancel: K
}) {
    let _ = SC6.useRef(q);
    _.current = q;
    let [z] = SC6.default.useState(() => [fOK, mOK, bOK, xOK, pOK, yOK, () => SC6.default.createElement(vOK, {
        onComplete: (Y) => _.current(Y)
    })]);
    return SC6.default.createElement(LX6, {
        steps: z,
        initialData: {},
        onComplete: () => {},
        onCancel: K,
        title: "Set up Google Vertex AI",
        showStepCounter: !1
    })
}
// @from(Ln 341866, Col 4)
SC6
// @from(Ln 341867, Col 4)
l17 = L(() => {
    xA();
    GOK();
    TOK();
    LOK();
    IOK();
    uOK();
    BOK();
    FOK();
    SC6 = K6(P6(), 1)
})
// @from(Ln 341883, Col 0)
function CC6() {
    if (v$()) {
        let K = gOK(aS6(), "claude", "versions") + J1Y;
        if (process.execPath.startsWith(K)) {
            let _ = process.platform === "win32" ? "claude.exe" : "claude";
            return {
                cmd: gOK(sS6(), _),
                prefixArgs: []
            }
        }
        return {
            cmd: process.execPath,
            prefixArgs: []
        }
    }
    let q = process.argv[1];
    if (!q) return {
        cmd: process.execPath,
        prefixArgs: []
    };
    return {
        cmd: process.execPath,
        prefixArgs: [q]
    }
}
// @from(Ln 341908, Col 4)
BF8 = L(() => {
    aq8()
})
// @from(Ln 341911, Col 4)
d48 = {}
// @from(Ln 341929, Col 0)
function pF8() {
    for (let q = 0; q < 32; q++) {
        if (q === 1 || q === 2) continue;
        try {
            if (W1Y(q)) M1Y(q)
        } catch {}
    }
}
// @from(Ln 341937, Col 0)
async function D1Y() {
    await new Promise((A) => setImmediate(A));
    let {
        cmd: q,
        prefixArgs: K
    } = CC6(), _ = process.argv.slice(2), z = X1Y(q, [...K, ..._], {
        stdio: "inherit",
        env: process.env
    });
    pF8();
    let Y = ["SIGINT", "SIGTERM", "SIGHUP"];
    for (let A of Y) process.on(A, () => {
        try {
            z.kill(A)
        } catch {}
    });
    return new Promise(() => {
        z.on("close", (A, O) => {
            let w = O ? 128 + (P1Y.signals[O] ?? 0) : 0;
            process.exit(A ?? w)
        }), z.on("error", (A) => {
            process.stderr.write(`Failed to relaunch Claude Code: ${A.message}
`), process.exit(1)
        })
    })
}
// @from(Ln 341963, Col 4)
bC6 = L(() => {
    BF8()
})
// @from(Ln 341966, Col 4)
QOK = {}
// @from(Ln 341971, Col 0)
function RX6({
    onDone: q,
    startingMessage: K,
    mode: _ = "login",
    forceLoginMethod: z,
    urlOutdent: Y = 0
}) {
    let O = (bP() ? Bs6 : 0) + Y,
        w = y7() || {},
        $ = z ?? w.forceLoginMethod,
        j = typeof w.forceLoginOrgUUID === "string" ? w.forceLoginOrgUUID : void 0,
        H = $ === "claudeai" ? "Login method pre-selected: Subscription Plan (Claude Pro/Max)" : $ === "console" ? "Login method pre-selected: API Usage Billing (Anthropic Console)" : null,
        J = fd(),
        [X, M] = Eq.useState(() => {
            if (_ === "setup-token") return {
                state: "ready_to_start"
            };
            if ($ === "claudeai" || $ === "console") return {
                state: "ready_to_start"
            };
            return {
                state: "idle"
            }
        }),
        [P, W] = Eq.useState(""),
        [D, Z] = Eq.useState(0),
        [G] = Eq.useState(() => new Et),
        [f, v] = Eq.useState(() => {
            return _ === "setup-token" || $ === "claudeai"
        }),
        [V, k] = Eq.useState(!1),
        [N, R] = Eq.useState(!1),
        h = s1().columns - UOK.length - 1;
    Eq.useEffect(() => {
        if ($ === "claudeai") d("tengu_oauth_claudeai_forced", {});
        else if ($ === "console") d("tengu_oauth_console_forced", {})
    }, [$]), Eq.useEffect(() => {
        if (X.state === "about_to_retry") {
            let S = setTimeout(M, 1000, X.nextState);
            return () => clearTimeout(S)
        }
    }, [X]), G1("confirm:yes", () => {
        d("tengu_oauth_success", {
            loginWithClaudeAi: f
        }), q()
    }, {
        context: "Confirmation",
        isActive: X.state === "success" && _ !== "setup-token"
    });
    let C = hI();
    G1("confirm:yes", () => {
        d8((S) => ({
            ...S,
            hasCompletedOnboarding: !0,
            lastOnboardingVersion: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION
        })), C.exit(), Promise.resolve().then(() => (bC6(), d48)).then((S) => S.execRelaunch())
    }, {
        context: "Confirmation",
        isActive: X.state === "bedrock_done" || X.state === "vertex_done"
    }), G1("confirm:yes", () => {
        if (X.state === "error" && X.toRetry) W(""), M({
            state: "about_to_retry",
            nextState: X.toRetry
        })
    }, {
        context: "Confirmation",
        isActive: X.state === "error" && !!X.toRetry
    }), Eq.useEffect(() => {
        if (P === "c" && X.state === "waiting_for_login" && V && !N) hP(X.url).then((S) => {
            if (S) process.stdout.write(S);
            R(!0), setTimeout(R, 2000, !1)
        }), W("")
    }, [P, X, V, N]);
    async function x(S, F) {
        try {
            let [U, g] = S.split("#");
            if (!U || !g) {
                M({
                    state: "error",
                    message: "Invalid code. Please make sure the full code was copied",
                    toRetry: {
                        state: "waiting_for_login",
                        url: F
                    }
                });
                return
            }
            d("tengu_oauth_manual_entry", {}), G.handleManualAuthCodeInput({
                authorizationCode: U,
                state: g
            })
        } catch (U) {
            j6(U), M({
                state: "error",
                message: b6(U),
                toRetry: {
                    state: "waiting_for_login",
                    url: F
                }
            })
        }
    }
    let B = Eq.useCallback(async () => {
            try {
                d("tengu_oauth_flow_start", {
                    loginWithClaudeAi: f
                });
                let S = await G.startOAuthFlow(async (F) => {
                    M({
                        state: "waiting_for_login",
                        url: F
                    }), setTimeout(k, 3000, !0)
                }, {
                    loginWithClaudeAi: f,
                    inferenceOnly: _ === "setup-token",
                    expiresIn: _ === "setup-token" ? 31536000 : void 0,
                    orgUUID: j
                }).catch((F) => {
                    let U = F.message.includes("Token exchange failed"),
                        g = GK6(F);
                    throw M({
                        state: "error",
                        message: g ?? (U ? "Failed to exchange authorization code for access token. Please try again." : F.message),
                        toRetry: _ === "setup-token" ? {
                            state: "ready_to_start"
                        } : {
                            state: "idle"
                        }
                    }), d("tengu_oauth_token_exchange_error", {
                        error: F.message,
                        ssl_error: g !== null
                    }), F
                });
                if (_ === "setup-token") M({
                    state: "success",
                    token: S.accessToken
                });
                else {
                    await fX6(S);
                    let F = await Ma();
                    if (!F.valid) throw Error(F.message);
                    M({
                        state: "success"
                    }), Il({
                        message: "Claude Code login successful",
                        notificationType: "auth_success"
                    }, J)
                }
            } catch (S) {
                let F = b6(S),
                    U = GK6(S);
                M({
                    state: "error",
                    message: U ?? F,
                    toRetry: {
                        state: _ === "setup-token" ? "ready_to_start" : "idle"
                    }
                }), d("tengu_oauth_error", {
                    error: F,
                    ssl_error: U !== null
                })
            }
        }, [G, k, f, _, j]),
        m = Eq.useRef(!1);
    return Eq.useEffect(() => {
        if (X.state === "ready_to_start" && !m.current) m.current = !0, process.nextTick((S, F) => {
            S().finally(() => {
                F.current = !1
            })
        }, B, m)
    }, [X.state, B]), Eq.useEffect(() => {
        if (_ === "setup-token" && X.state === "success") {
            let S = setTimeout((F, U) => {
                d("tengu_oauth_success", {
                    loginWithClaudeAi: F
                }), U()
            }, 500, f, q);
            return () => clearTimeout(S)
        }
    }, [_, X, f, q]), Eq.useEffect(() => {
        return () => {
            G.cleanup()
        }
    }, [G]), Eq.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, X.state === "waiting_for_login" && V && Eq.default.createElement(u, {
        flexDirection: "column",
        key: "urlToCopy",
        gap: 1,
        paddingBottom: 1
    }, Eq.default.createElement(u, {
        paddingX: 1
    }, Eq.default.createElement(T, {
        dimColor: !0
    }, "Browser didn't open? Use the url below to sign in", " "), N ? Eq.default.createElement(T, {
        color: "success"
    }, "(Copied!)") : Eq.default.createElement(T, {
        dimColor: !0
    }, Eq.default.createElement(A8, {
        chord: "c",
        action: "copy",
        parens: !0
    }))), Eq.default.createElement(u, {
        marginX: O ? -O : void 0
    }, Eq.default.createElement(yq, {
        url: X.url
    }, Eq.default.createElement(T, {
        dimColor: !0
    }, X.url)))), _ === "setup-token" && X.state === "success" && X.token && Eq.default.createElement(u, {
        key: "tokenOutput",
        flexDirection: "column",
        gap: 1,
        paddingTop: 1
    }, Eq.default.createElement(T, {
        color: "success"
    }, "✓ Long-lived authentication token created successfully!"), Eq.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, Eq.default.createElement(T, null, "Your OAuth token (valid for 1 year):"), Eq.default.createElement(T, {
        color: "warning"
    }, X.token), Eq.default.createElement(T, {
        dimColor: !0
    }, "Store this token securely. You won't be able to see it again."), Eq.default.createElement(T, {
        dimColor: !0
    }, "Use this token by setting: export CLAUDE_CODE_OAUTH_TOKEN=<token>"))), Eq.default.createElement(u, {
        paddingLeft: 1,
        flexDirection: "column",
        gap: 1
    }, Eq.default.createElement(Z1Y, {
        oauthStatus: X,
        mode: _,
        startingMessage: K,
        forcedMethodMessage: H,
        showPastePrompt: V,
        pastedCode: P,
        setPastedCode: W,
        cursorOffset: D,
        setCursorOffset: Z,
        textInputColumns: h,
        handleSubmitCode: x,
        setOAuthStatus: M,
        setLoginWithClaudeAi: v
    })))
}
// @from(Ln 342224, Col 0)
function Z1Y(q) {
    let K = s(61),
        {
            oauthStatus: _,
            mode: z,
            startingMessage: Y,
            forcedMethodMessage: A,
            showPastePrompt: O,
            pastedCode: w,
            setPastedCode: $,
            cursorOffset: j,
            setCursorOffset: H,
            textInputColumns: J,
            handleSubmitCode: X,
            setOAuthStatus: M,
            setLoginWithClaudeAi: P
        } = q;
    switch (_.state) {
        case "idle": {
            let W = Y ? Y : "Claude Code can be used with your Claude subscription or billed based on API usage through your Console account.",
                D;
            if (K[0] !== W) D = Eq.default.createElement(T, {
                bold: !0
            }, W), K[0] = W, K[1] = D;
            else D = K[1];
            let Z;
            if (K[2] === Symbol.for("react.memo_cache_sentinel")) Z = Eq.default.createElement(T, null, "Select login method:"), K[2] = Z;
            else Z = K[2];
            let G;
            if (K[3] === Symbol.for("react.memo_cache_sentinel")) G = {
                label: Eq.default.createElement(T, null, "Claude account with subscription ·", " ", Eq.default.createElement(T, {
                    dimColor: !0
                }, "Pro, Max, Team, or Enterprise"), !1, `
`),
                value: "claudeai"
            }, K[3] = G;
            else G = K[3];
            let f;
            if (K[4] === Symbol.for("react.memo_cache_sentinel")) f = {
                label: Eq.default.createElement(T, null, "Anthropic Console account ·", " ", Eq.default.createElement(T, {
                    dimColor: !0
                }, "API usage billing"), `
`),
                value: "console"
            }, K[4] = f;
            else f = K[4];
            let v;
            if (K[5] === Symbol.for("react.memo_cache_sentinel")) v = [G, f, {
                label: Eq.default.createElement(T, null, "3rd-party platform ·", " ", Eq.default.createElement(T, {
                    dimColor: !0
                }, "Amazon Bedrock, Microsoft Foundry, or Vertex AI"), `
`),
                value: "platform"
            }], K[5] = v;
            else v = K[5];
            let V;
            if (K[6] !== P || K[7] !== M) V = Eq.default.createElement(u, null, Eq.default.createElement(A1, {
                options: v,
                onChange: (N) => {
                    if (N === "platform") d("tengu_oauth_platform_selected", {}), M({
                        state: "platform_setup"
                    });
                    else if (M({
                            state: "ready_to_start"
                        }), N === "claudeai") d("tengu_oauth_claudeai_selected", {}), P(!0);
                    else d("tengu_oauth_console_selected", {}), P(!1)
                }
            })), K[6] = P, K[7] = M, K[8] = V;
            else V = K[8];
            let k;
            if (K[9] !== D || K[10] !== V) k = Eq.default.createElement(u, {
                flexDirection: "column",
                gap: 1,
                marginTop: 1
            }, D, Z, V), K[9] = D, K[10] = V, K[11] = k;
            else k = K[11];
            return k
        }
        case "platform_setup": {
            let W;
            if (K[12] === Symbol.for("react.memo_cache_sentinel")) W = Eq.default.createElement(T, {
                bold: !0
            }, "Using 3rd-party platforms"), K[12] = W;
            else W = K[12];
            let D;
            if (K[13] === Symbol.for("react.memo_cache_sentinel")) D = {
                label: Eq.default.createElement(T, null, "Amazon Bedrock · ", Eq.default.createElement(T, {
                    dimColor: !0
                }, "interactive setup")),
                value: "bedrock"
            }, K[13] = D;
            else D = K[13];
            let Z;
            if (K[14] === Symbol.for("react.memo_cache_sentinel")) Z = {
                label: Eq.default.createElement(T, null, "Microsoft Foundry · ", Eq.default.createElement(T, {
                    dimColor: !0
                }, "opens docs")),
                value: "foundry"
            }, K[14] = Z;
            else Z = K[14];
            let G;
            if (K[15] === Symbol.for("react.memo_cache_sentinel")) G = [D, Z, {
                label: Eq.default.createElement(T, null, "Google Vertex AI · ", Eq.default.createElement(T, {
                    dimColor: !0
                }, "interactive setup")),
                value: "vertex"
            }, {
                label: "Go back",
                value: "back"
            }], K[15] = G;
            else G = K[15];
            let f;
            if (K[16] !== M) f = Eq.default.createElement(A1, {
                options: G,
                onChange: (k) => {
                    q: switch (k) {
                        case "bedrock": {
                            d("tengu_oauth_bedrock_wizard_launched", {}), M({
                                state: "bedrock_wizard"
                            });
                            break q
                        }
                        case "foundry": {
                            d("tengu_oauth_platform_docs_opened", {
                                platform: "foundry"
                            }), J3("https://code.claude.com/docs/en/microsoft-foundry"), M({
                                state: "idle"
                            });
                            break q
                        }
                        case "vertex": {
                            d("tengu_oauth_vertex_wizard_launched", {}), M({
                                state: "vertex_wizard"
                            });
                            break q
                        }
                        default:
                            M({
                                state: "idle"
                            })
                    }
                },
                onCancel: () => M({
                    state: "idle"
                })
            }), K[16] = M, K[17] = f;
            else f = K[17];
            let v;
            if (K[18] === Symbol.for("react.memo_cache_sentinel")) v = Eq.default.createElement(T, {
                dimColor: !0
            }, "Foundry: ", Eq.default.createElement(yq, {
                url: "https://code.claude.com/docs/en/microsoft-foundry"
            }, "https://code.claude.com/docs/en/microsoft-foundry")), K[18] = v;
            else v = K[18];
            let V;
            if (K[19] !== f) V = Eq.default.createElement(u, {
                flexDirection: "column",
                gap: 1,
                marginTop: 1
            }, W, f, v), K[19] = f, K[20] = V;
            else V = K[20];
            return V
        }
        case "bedrock_wizard": {
            let W;
            if (K[21] !== M) W = Eq.default.createElement(xF8, {
                onComplete: (D) => M({
                    state: "bedrock_done",
                    message: D
                }),
                onCancel: () => M({
                    state: "platform_setup"
                })
            }), K[21] = M, K[22] = W;
            else W = K[22];
            return W
        }
        case "bedrock_done":
        case "vertex_done": {
            let W;
            if (K[23] !== _.message) W = Eq.default.createElement(T, {
                color: "success"
            }, _.message), K[23] = _.message, K[24] = W;
            else W = K[24];
            let D;
            if (K[25] === Symbol.for("react.memo_cache_sentinel")) D = Eq.default.createElement(T, {
                dimColor: !0
            }, "Press ", Eq.default.createElement(T, {
                bold: !0
            }, "Enter"), " to restart Claude Code."), K[25] = D;
            else D = K[25];
            let Z;
            if (K[26] !== W) Z = Eq.default.createElement(u, {
                flexDirection: "column",
                gap: 1,
                marginTop: 1
            }, W, D), K[26] = W, K[27] = Z;
            else Z = K[27];
            return Z
        }
        case "vertex_wizard": {
            let W;
            if (K[28] !== M) W = Eq.default.createElement(mF8, {
                onComplete: (D) => M({
                    state: "vertex_done",
                    message: D
                }),
                onCancel: () => M({
                    state: "platform_setup"
                })
            }), K[28] = M, K[29] = W;
            else W = K[29];
            return W
        }
        case "waiting_for_login": {
            let W;
            if (K[30] !== A) W = A && Eq.default.createElement(u, null, Eq.default.createElement(T, {
                dimColor: !0
            }, A)), K[30] = A, K[31] = W;
            else W = K[31];
            let D;
            if (K[32] !== O) D = !O && Eq.default.createElement(u, null, Eq.default.createElement(Y5, null), Eq.default.createElement(T, null, "Opening browser to sign in…")), K[32] = O, K[33] = D;
            else D = K[33];
            let Z;
            if (K[34] !== j || K[35] !== X || K[36] !== _.url || K[37] !== w || K[38] !== H || K[39] !== $ || K[40] !== O || K[41] !== J) Z = O && Eq.default.createElement(u, null, Eq.default.createElement(T, null, UOK), Eq.default.createElement(l4, {
                value: w,
                onChange: $,
                onSubmit: (f) => X(f, _.url),
                cursorOffset: j,
                onChangeCursorOffset: H,
                columns: J,
                mask: "*"
            })), K[34] = j, K[35] = X, K[36] = _.url, K[37] = w, K[38] = H, K[39] = $, K[40] = O, K[41] = J, K[42] = Z;
            else Z = K[42];
            let G;
            if (K[43] !== W || K[44] !== D || K[45] !== Z) G = Eq.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, W, D, Z), K[43] = W, K[44] = D, K[45] = Z, K[46] = G;
            else G = K[46];
            return G
        }
        case "creating_api_key": {
            let W;
            if (K[47] === Symbol.for("react.memo_cache_sentinel")) W = Eq.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, Eq.default.createElement(u, null, Eq.default.createElement(Y5, null), Eq.default.createElement(T, null, "Creating API key for Claude Code…"))), K[47] = W;
            else W = K[47];
            return W
        }
        case "about_to_retry": {
            let W;
            if (K[48] === Symbol.for("react.memo_cache_sentinel")) W = Eq.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, Eq.default.createElement(T, {
                color: "permission"
            }, "Retrying…")), K[48] = W;
            else W = K[48];
            return W
        }
        case "success": {
            let W;
            if (K[49] !== z || K[50] !== _.token) W = z === "setup-token" && _.token ? null : Eq.default.createElement(Eq.default.Fragment, null, k_()?.emailAddress ? Eq.default.createElement(T, {
                dimColor: !0
            }, "Logged in as", " ", Eq.default.createElement(T, null, k_()?.emailAddress)) : null, Eq.default.createElement(T, {
                color: "success"
            }, "Login successful. Press ", Eq.default.createElement(T, {
                bold: !0
            }, "Enter"), " to continue…")), K[49] = z, K[50] = _.token, K[51] = W;
            else W = K[51];
            let D;
            if (K[52] !== W) D = Eq.default.createElement(u, {
                flexDirection: "column"
            }, W), K[52] = W, K[53] = D;
            else D = K[53];
            return D
        }
        case "error": {
            let W;
            if (K[54] !== _.message) W = Eq.default.createElement(T, {
                color: "error"
            }, "OAuth error: ", _.message), K[54] = _.message, K[55] = W;
            else W = K[55];
            let D;
            if (K[56] !== _.toRetry) D = _.toRetry && Eq.default.createElement(u, {
                marginTop: 1
            }, Eq.default.createElement(T, {
                color: "permission"
            }, "Press ", Eq.default.createElement(T, {
                bold: !0
            }, "Enter"), " to retry.")), K[56] = _.toRetry, K[57] = D;
            else D = K[57];
            let Z;
            if (K[58] !== W || K[59] !== D) Z = Eq.default.createElement(u, {
                flexDirection: "column",
                gap: 1
            }, W, D), K[58] = W, K[59] = D, K[60] = Z;
            else Z = K[60];
            return Z
        }
        default:
            return null
    }
}
// @from(Ln 342530, Col 4)
Eq
// @from(Ln 342530, Col 8)
UOK = "Paste code here if prompted > "
// @from(Ln 342531, Col 4)
c48 = L(() => {
    o6();
    C8();
    OC6();
    Mk();
    I4();
    HX();
    Gd();
    g6();
    C7();
    Ws();
    h48();
    Fq8();
    T7();
    Nj();
    h1();
    m8();
    U8();
    a1();
    g17();
    gK();
    u7();
    DJ();
    Ej();
    NY();
    l17();
    Eq = K6(P6(), 1)
})
// @from(Ln 342560, Col 0)
function dOK({
    onStashAndContinue: q,
    onCancel: K
}) {
    let [_, z] = Iw.useState(null), Y = _ !== null ? [..._.tracked, ..._.untracked] : [], [A, O] = Iw.useState(!0), [w, $] = Iw.useState(!1), [j, H] = Iw.useState(null);
    Iw.useEffect(() => {
        (async () => {
            try {
                let W = await rJ8();
                z(W)
            } catch (W) {
                let D = W instanceof Error ? W.message : String(W);
                E(`Error getting changed files: ${D}`, {
                    level: "error"
                }), H("Failed to get changed files")
            } finally {
                O(!1)
            }
        })()
    }, []);
    let J = async () => {
        $(!0);
        try {
            if (E("Stashing changes before teleport..."), await QA1("Teleport auto-stash")) E("Successfully stashed changes"), q();
            else H("Failed to stash changes")
        } catch (P) {
            let W = P instanceof Error ? P.message : String(P);
            E(`Error stashing changes: ${W}`, {
                level: "error"
            }), H("Failed to stash changes")
        } finally {
            $(!1)
        }
    }, X = (P) => {
        if (P === "stash") J();
        else K()
    };
    if (A) return Iw.default.createElement(u, {
        flexDirection: "column",
        padding: 1
    }, Iw.default.createElement(u, {
        marginBottom: 1
    }, Iw.default.createElement(Y5, null), Iw.default.createElement(T, null, " Checking git status", e6.ellipsis)));
    if (j) return Iw.default.createElement(u, {
        flexDirection: "column",
        padding: 1
    }, Iw.default.createElement(T, {
        bold: !0,
        color: "error"
    }, "Error: ", j), Iw.default.createElement(u, {
        marginTop: 1
    }, Iw.default.createElement(T, {
        dimColor: !0
    }, "Press "), Iw.default.createElement(T, {
        bold: !0
    }, "Escape"), Iw.default.createElement(T, {
        dimColor: !0
    }, " to cancel")));
    let M = Y.length > 8;
    return Iw.default.createElement(R1, {
        title: "Working Directory Has Changes",
        onCancel: K
    }, Iw.default.createElement(T, null, "Teleport will switch git branches. The following changes were found:"), Iw.default.createElement(u, {
        flexDirection: "column",
        paddingLeft: 2
    }, Y.length > 0 ? M ? Iw.default.createElement(T, null, Y.length, " files changed") : Y.map((P, W) => Iw.default.createElement(T, {
        key: W
    }, P)) : Iw.default.createElement(T, {
        dimColor: !0
    }, "No changes detected")), Iw.default.createElement(T, null, "Would you like to stash these changes and continue with teleport?"), w ? Iw.default.createElement(u, null, Iw.default.createElement(Y5, null), Iw.default.createElement(T, null, " Stashing changes...")) : Iw.default.createElement(A1, {
        options: [{
            label: "Stash changes and continue",
            value: "stash"
        }, {
            label: "Exit",
            value: "exit"
        }],
        onChange: X
    }))
}
// @from(Ln 342640, Col 4)
Iw
// @from(Ln 342641, Col 4)
cOK = L(() => {
    Qq();
    g6();
    K8();
    pK();
    g_();
    S4();
    Ej();
    Iw = K6(P6(), 1)
})
// @from(Ln 342652, Col 0)
function FF8(q) {
    let K = s(18),
        {
            onComplete: _,
            errorsToIgnore: z
        } = q,
        Y = z === void 0 ? f1Y : z,
        [A, O] = wS.useState(null),
        [w, $] = wS.useState(!1),
        j;
    if (K[0] !== Y || K[1] !== _) j = async () => {
        let k = await n17(),
            N = new Set(Array.from(k).filter((R) => !Y.has(R)));
        if (N.size === 0) {
            _();
            return
        }
        if (N.has("needsLogin")) O("needsLogin");
        else if (N.has("needsGitStash")) O("needsGitStash")
    }, K[0] = Y, K[1] = _, K[2] = j;
    else j = K[2];
    let H = j,
        J, X;
    if (K[3] !== H) J = () => {
        H()
    }, X = [H], K[3] = H, K[4] = J, K[5] = X;
    else J = K[4], X = K[5];
    wS.useEffect(J, X);
    let M = G1Y,
        P;
    if (K[6] !== H) P = () => {
        $(!1), H()
    }, K[6] = H, K[7] = P;
    else P = K[7];
    let W = P,
        D;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) D = () => {
        $(!0)
    }, K[8] = D;
    else D = K[8];
    let Z = D,
        G;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) G = (k) => {
        if (k === "login") Z();
        else M()
    }, K[9] = G;
    else G = K[9];
    let f = G,
        v;
    if (K[10] !== H) v = () => {
        H()
    }, K[10] = H, K[11] = v;
    else v = K[11];
    let V = v;
    if (!A) return null;
    switch (A) {
        case "needsGitStash": {
            let k;
            if (K[12] !== V) k = wS.default.createElement(dOK, {
                onStashAndContinue: V,
                onCancel: M
            }), K[12] = V, K[13] = k;
            else k = K[13];
            return k
        }
        case "needsLogin": {
            if (w) {
                let R;
                if (K[14] !== W) R = wS.default.createElement(RX6, {
                    onDone: W,
                    mode: "login",
                    forceLoginMethod: "claudeai"
                }), K[14] = W, K[15] = R;
                else R = K[15];
                return R
            }
            let k;
            if (K[16] === Symbol.for("react.memo_cache_sentinel")) k = wS.default.createElement(u, {
                flexDirection: "column"
            }, wS.default.createElement(T, {
                dimColor: !0
            }, "Teleport requires a Claude.ai account."), wS.default.createElement(T, {
                dimColor: !0
            }, "Your Claude Pro/Max subscription will be used by Claude Code.")), K[16] = k;
            else k = K[16];
            let N;
            if (K[17] === Symbol.for("react.memo_cache_sentinel")) N = wS.default.createElement(R1, {
                title: "Log in to Claude",
                onCancel: M
            }, k, wS.default.createElement(A1, {
                options: [{
                    label: "Login with Claude account",
                    value: "login"
                }, {
                    label: "Exit",
                    value: "exit"
                }],
                onChange: f
            })), K[17] = N;
            else N = K[17];
            return N
        }
    }
}
// @from(Ln 342757, Col 0)
function G1Y() {
    j5(0)
}
// @from(Ln 342760, Col 0)
async function n17() {
    let q = new Set,
        [K, _] = await Promise.all([Pu8(), ud4()]);
    if (K) q.add("needsLogin");
    if (!_) q.add("needsGitStash");
    return q
}
// @from(Ln 342767, Col 4)
wS
// @from(Ln 342767, Col 8)
f1Y
// @from(Ln 342768, Col 4)
i17 = L(() => {
    o6();
    xR6();
    CY();
    g6();
    c48();
    g_();
    S4();
    cOK();
    wS = K6(P6(), 1), f1Y = new Set
})
// @from(Ln 342780, Col 0)
function v1Y() {
    let q = D81();
    if (q !== void 0) return q;
    let K = process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
    if (!K) {
        let z = process.env.CLAUDE_SESSION_INGRESS_TOKEN_FILE ?? jZ8,
            Y = nl6(z, "session ingress token");
        return WY6(Y), Y
    }
    let _ = parseInt(K, 10);
    if (Number.isNaN(_)) return E(`CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${K}`, {
        level: "error"
    }), WY6(null), null;
    try {
        let z = V8(),
            Y = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${_}` : `/proc/self/fd/${_}`,
            A = z.readFileSync(Y, {
                encoding: "utf8"
            }).trim();
        if (!A) return E("File descriptor contained empty token", {
            level: "error"
        }), WY6(null), null;
        return E(`Successfully read token from file descriptor ${_}`), WY6(A), nf1(jZ8, A, "session ingress token"), A
    } catch (z) {
        E(`Failed to read token from file descriptor ${_}: ${b6(z)}`, {
            level: "error"
        });
        let Y = process.env.CLAUDE_SESSION_INGRESS_TOKEN_FILE ?? jZ8,
            A = nl6(Y, "session ingress token");
        return WY6(A), A
    }
}
// @from(Ln 342813, Col 0)
function qW() {
    let q = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN;
    if (q) return q;
    return v1Y()
}
// @from(Ln 342819, Col 0)
function gF8() {
    let q = qW();
    if (!q) return {};
    if (q.startsWith("sk-ant-sid")) {
        let K = {
                Cookie: `sessionKey=${q}`
            },
            _ = process.env.CLAUDE_CODE_ORGANIZATION_UUID;
        if (_) K["X-Organization-Uuid"] = _;
        return K
    }
    return {
        Authorization: `Bearer ${q}`
    }
}
// @from(Ln 342835, Col 0)
function lOK(q) {
    process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN = q
}
// @from(Ln 342838, Col 4)
ox = L(() => {
    y8();
    rf1();
    K8();
    m8();
    Yq()
})
// @from(Ln 342846, Col 0)
function V1Y(q) {
    let K = r17.get(q);
    if (!K) K = y16(async (_, z, Y) => await k1Y(q, _, z, Y)), r17.set(q, K);
    return K
}
// @from(Ln 342851, Col 0)
async function k1Y(q, K, _, z) {
    for (let Y = 1; Y <= UF8; Y++) {
        try {
            let O = SX6.get(q),
                w = {
                    ...z
                };
            if (O) w["Last-Uuid"] = O;
            let $ = await Z1.put(_, K, {
                headers: w,
                timeout: 30000,
                validateStatus: (j) => j < 500
            });
            if ($.status === 200 || $.status === 201) return SX6.set(q, K.uuid), E(`Successfully persisted session log entry for session ${q}`), !0;
            if ($.status === 409) {
                let j = $.headers["x-last-uuid"];
                if (j === K.uuid) return SX6.set(q, K.uuid), E(`Session entry ${K.uuid} already present on server, recovering from stale state`), j1("info", "session_persist_recovered_from_409"), !0;
                if (j) SX6.set(q, j), E(`Session 409: adopting server lastUuid=${j} from header, retrying entry ${K.uuid}`);
                else {
                    let H = await o17(q, _, z),
                        J = N1Y(H);
                    if (J) SX6.set(q, J), E(`Session 409: re-fetched ${H.length} entries, adopting lastUuid=${J}, retrying entry ${K.uuid}`);
                    else {
                        let M = $.data.error?.message || "Concurrent modification detected";
                        return j6(Error(`Session persistence conflict: UUID mismatch for session ${q}, entry ${K.uuid}. ${M}`)), j1("error", "session_persist_fail_concurrent_modification"), !1
                    }
                }
                j1("info", "session_persist_409_adopt_server_uuid");
                continue
            }
            if ($.status === 401) return E("Session token expired or invalid"), j1("error", "session_persist_fail_bad_token"), !1;
            E(`Failed to persist session log: ${$.status} ${$.statusText}`), j1("error", "session_persist_fail_status", {
                status: $.status,
                attempt: Y
            })
        } catch (O) {
            j6(Error(`Error persisting session log: ${b6(O)}`)), j1("error", "session_persist_fail_status", {
                status: Z1.isAxiosError(O) ? O.status : void 0,
                attempt: Y
            })
        }
        if (Y === UF8) return E(`Remote persistence failed after ${UF8} attempts`), j1("error", "session_persist_error_retries_exhausted", {
            attempt: Y
        }), !1;
        let A = Math.min(T1Y * Math.pow(2, Y - 1), 8000);
        E(`Remote persistence attempt ${Y}/${UF8} failed, retrying in ${A}ms…`), await l7(A)
    }
    return !1
}
// @from(Ln 342900, Col 0)
async function nOK(q, K, _) {
    let z = qW();
    if (!z) return E("No session token available for session persistence"), j1("error", "session_persist_fail_jwt_no_token"), !1;
    let Y = {
        Authorization: `Bearer ${z}`,
        "Content-Type": "application/json"
    };
    return V1Y(q)(K, _, Y)
}
// @from(Ln 342909, Col 0)
async function iOK(q, K) {
    let _ = qW();
    if (!_) return E("No session token available for fetching session logs"), j1("error", "session_get_fail_no_token"), null;
    let z = {
            Authorization: `Bearer ${_}`
        },
        Y = await o17(q, K, z);
    if (Y && Y.length > 0) {
        let A = Y.at(-1);
        if (A && "uuid" in A && A.uuid) SX6.set(q, A.uuid)
    }
    return Y
}
// @from(Ln 342922, Col 0)
async function rOK(q, K, _) {
    let z = `${r7().BASE_API_URL}/v1/session_ingress/session/${q}`;
    E(`[session-ingress] Fetching session logs from: ${z}`);
    let Y = {
        ...bA(K),
        "x-organization-uuid": _
    };
    return await o17(q, z, Y)
}
// @from(Ln 342931, Col 0)
async function oOK(q, K, _, z) {
    let Y = `${r7().BASE_API_URL}/v1/code/sessions/${q}/teleport-events`,
        A = {
            ...bA(K),
            "x-organization-uuid": _
        };
    if (z) A["X-Trusted-Device-Token"] = z;
    E(`[teleport] Fetching events from: ${Y}`);
    let O = [],
        w, $ = 0,
        j = 100;
    while ($ < j) {
        let H = {
            limit: 1000
        };
        if (w !== void 0) H.cursor = w;
        let J;
        try {
            J = await Z1.get(Y, {
                headers: A,
                params: H,
                timeout: 20000,
                validateStatus: (P) => P < 500
            })
        } catch (P) {
            return j6(Error(`Teleport events fetch failed: ${b6(P)}`)), j1("error", "teleport_events_fetch_fail"), null
        }
        if (J.status === 404) return E(`[teleport] Session ${q} not found (page ${$})`), j1("warn", "teleport_events_not_found"), $ === 0 ? null : O;
        if (J.status === 401) {
            j1("error", "teleport_events_bad_token");
            let P = "Your session has expired. Please run /login to sign in again.";
            throw new dj(P, P)
        }
        if (J.status === 403) {
            j1("error", "teleport_events_forbidden");
            let P = J.data;
            if (P?.error?.resource === "untrusted_device") throw new dj("This session requires a trusted device. Run /login to enroll this device, then retry.", "This session requires a trusted device. Run /login to enroll this device, then retry.");
            let W = P?.error?.message ?? "Access denied fetching session events";
            throw new dj(W, W)
        }
        if (J.status !== 200) return j6(Error(`Teleport events returned ${J.status}: ${I6(J.data)}`)), j1("error", "teleport_events_bad_status"), null;
        let {
            data: X,
            next_cursor: M
        } = J.data;
        if (!Array.isArray(X)) return j6(Error(`Teleport events invalid response shape: ${I6(J.data)}`)), j1("error", "teleport_events_invalid_shape"), null;
        for (let P of X)
            if (P.payload !== null) O.push(P.payload);
        if ($++, M == null) break;
        w = M
    }
    if ($ >= j) j6(Error(`Teleport events hit page cap (${j}) for ${q}`)), j1("warn", "teleport_events_page_cap");
    return E(`[teleport] Fetched ${O.length} events over ${$} page(s) for ${q}`), O
}
// @from(Ln 342985, Col 0)
async function o17(q, K, _) {
    try {
        let z = await Z1.get(K, {
            headers: _,
            timeout: 20000,
            validateStatus: (Y) => Y < 500,
            params: S6(process.env.CLAUDE_AFTER_LAST_COMPACT) ? {
                after_last_compact: !0
            } : void 0
        });
        if (z.status === 200) {
            let Y = z.data;
            if (!Y || typeof Y !== "object" || !Array.isArray(Y.loglines)) return j6(Error(`Invalid session logs response format: ${I6(Y)}`)), j1("error", "session_get_fail_invalid_response"), null;
            let A = Y.loglines;
            return E(`Fetched ${A.length} session logs for session ${q}`), A
        }
        if (z.status === 404) return E(`No existing logs for session ${q}`), j1("warn", "session_get_no_logs_for_session"), [];
        if (z.status === 401) throw E("Auth token expired or invalid"), j1("error", "session_get_fail_bad_token"), Error("Your session has expired. Please run /login to sign in again.");
        return E(`Failed to fetch session logs: ${z.status} ${z.statusText}`), j1("error", "session_get_fail_status", {
            status: z.status
        }), null
    } catch (z) {
        if (!Z1.isAxiosError(z)) throw z;
        return j6(Error(`Error fetching session logs: ${z.message}`)), j1("error", "session_get_fail_status", {
            status: z.status
        }), null
    }
}
// @from(Ln 343014, Col 0)
function N1Y(q) {
    if (!q) return;
    let K = q.findLast((_) => ("uuid" in _) && _.uuid);
    return K && "uuid" in K ? K.uuid : void 0
}
// @from(Ln 343020, Col 0)
function aOK() {
    SX6.clear(), r17.clear()
}
// @from(Ln 343023, Col 4)
SX6
// @from(Ln 343023, Col 9)
UF8 = 10
// @from(Ln 343024, Col 4)
T1Y = 500
// @from(Ln 343025, Col 4)
r17
// @from(Ln 343026, Col 4)
QF8 = L(() => {
    CK();
    z3();
    K8();
    VA();
    Q8();
    m8();
    U8();
    ox();
    e8();
    VX();
    SX6 = new Map, r17 = new Map
})
// @from(Ln 343061, Col 0)
function bX6(q, K) {
    switch (K.kind) {
        case "track":
            try {
                let _ = q.snapshots.at(-1);
                if (!_ || _.trackedFileBackups[K.trackingPath]) return q;
                let z = q.trackedFiles.has(K.trackingPath) ? q.trackedFiles : new Set(q.trackedFiles).add(K.trackingPath),
                    Y = {
                        ..._,
                        trackedFileBackups: {
                            ..._.trackedFileBackups,
                            [K.trackingPath]: K.backup
                        }
                    },
                    A = {
                        ...q,
                        snapshots: (() => {
                            let O = q.snapshots.slice();
                            return O[O.length - 1] = Y, O
                        })(),
                        trackedFiles: z
                    };
                return tOK(A), i48(K.messageId, Y, !0).catch((O) => {
                    j6(Error(`FileHistory: Failed to record snapshot: ${O}`))
                }), d("tengu_file_history_track_edit_success", {
                    isNewFile: K.isAddingFile,
                    version: K.backup.version
                }), E(`FileHistory: Tracked file modification for ${K.filePath}`), A
            } catch (_) {
                return j6(_), d("tengu_file_history_track_edit_failed", {}), q
            }
        case "snapshot":
            try {
                let _ = {
                        ...K.trackedFileBackups
                    },
                    z = q.snapshots.at(-1);
                if (z)
                    for (let $ of q.trackedFiles) {
                        if ($ in _) continue;
                        let j = z.trackedFileBackups[$];
                        if (j) _[$] = j
                    }
                let Y = new Date,
                    A = {
                        messageId: K.messageId,
                        trackedFileBackups: _,
                        timestamp: Y
                    },
                    O = [...q.snapshots, A],
                    w = {
                        ...q,
                        snapshots: O.length > sOK ? O.slice(-sOK) : O,
                        snapshotSequence: (q.snapshotSequence ?? 0) + 1
                    };
                return tOK(w), B1Y(q, w).catch(j6), i48(K.messageId, A, !1).catch(($) => {
                    j6(Error(`FileHistory: Failed to record snapshot: ${$}`))
                }), E(`FileHistory: Added snapshot for ${K.messageId}, tracking ${q.trackedFiles.size} files`), d("tengu_file_history_snapshot_success", {
                    trackedFilesCount: q.trackedFiles.size,
                    snapshotCount: w.snapshots.length
                }), w
            } catch (_) {
                return j6(_), d("tengu_file_history_snapshot_failed", {}), q
            }
    }
}
// @from(Ln 343128, Col 0)
function kO() {
    if (I7()) return C1Y();
    return H8().fileCheckpointingEnabled !== !1 && !S6(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}
// @from(Ln 343133, Col 0)
function C1Y() {
    return S6(process.env.CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING) && !S6(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}
// @from(Ln 343136, Col 0)
async function M96(q, K, _, z) {
    if (!kO()) return;
    let Y = YwK(_),
        A = q();
    if (!A) return;
    let O = A.snapshots.at(-1);
    if (!O) {
        j6(Error("FileHistory: Missing most recent snapshot")), d("tengu_file_history_track_edit_failed", {});
        return
    }
    if (O.trackedFileBackups[Y]) return;
    let w;
    try {
        w = await zwK(_, 1)
    } catch (j) {
        j6(j), d("tengu_file_history_track_edit_failed", {});
        return
    }
    let $ = w.backupFileName === null;
    K({
        kind: "track",
        trackingPath: Y,
        filePath: _,
        backup: w,
        messageId: z,
        isAddingFile: $
    })
}
// @from(Ln 343164, Col 0)
async function IC6(q, K, _) {
    if (!kO()) return;
    let z = q();
    if (!z) return;
    let Y = {},
        A = z.snapshots.at(-1);
    if (A) E(`FileHistory: Making snapshot for message ${_}`), await Promise.all(Array.from(z.trackedFiles, async (O) => {
        try {
            let w = o48(O),
                $ = A.trackedFileBackups[O],
                j = $ ? $.version + 1 : 1,
                H;
            try {
                H = await n48(w)
            } catch (J) {
                if (!t1(J)) throw J
            }
            if (!H) {
                Y[O] = {
                    backupFileName: null,
                    version: j,
                    backupTime: new Date
                }, d("tengu_file_history_backup_deleted_file", {
                    version: j
                }), E(`FileHistory: Missing tracked file: ${O}`);
                return
            }
            if ($ && $.backupFileName !== null && !await t17(w, $.backupFileName, H)) {
                Y[O] = $;
                return
            }
            Y[O] = await zwK(w, j)
        } catch (w) {
            j6(w), d("tengu_file_history_backup_file_failed", {})
        }
    }));
    K({
        kind: "snapshot",
        messageId: _,
        trackedFileBackups: Y
    })
}
// @from(Ln 343206, Col 0)
async function lF8(q, K) {
    if (!kO()) return;
    let _ = q();
    if (!_) return;
    let z = _.snapshots.findLast((Y) => Y.messageId === K);
    if (!z) throw j6(Error(`FileHistory: Snapshot for ${K} not found`)), d("tengu_file_history_rewind_failed", {
        trackedFilesCount: _.trackedFiles.size,
        snapshotFound: !1
    }), Error("The selected snapshot was not found");
    try {
        E(`FileHistory: [Rewind] Rewinding to snapshot for ${K}`);
        let Y = await b1Y(_, z);
        E(`FileHistory: [Rewind] Finished rewinding to ${K}`), d("tengu_file_history_rewind_success", {
            trackedFilesCount: _.trackedFiles.size,
            filesChangedCount: Y.length
        })
    } catch (Y) {
        throw j6(Y), d("tengu_file_history_rewind_failed", {
            trackedFilesCount: _.trackedFiles.size,
            snapshotFound: !0
        }), Y
    }
}
// @from(Ln 343230, Col 0)
function nF8(q, K) {
    if (!kO()) return !1;
    return q.snapshots.some((_) => _.messageId === K)
}
// @from(Ln 343234, Col 0)
async function r48(q, K) {
    if (!kO()) return;
    let _ = q.snapshots.findLast((w) => w.messageId === K);
    if (!_) return;
    let z = await Promise.all(Array.from(q.trackedFiles, async (w) => {
            try {
                let $ = o48(w),
                    j = _.trackedFileBackups[w],
                    H = j ? j.backupFileName : e17(w, q);
                if (H === void 0) return j6(Error("FileHistory: Error finding the backup file to apply")), d("tengu_file_history_rewind_restore_file_failed", {
                    dryRun: !0
                }), null;
                let J = await x1Y($, H === null ? void 0 : H);
                if (J?.insertions || J?.deletions) return {
                    filePath: $,
                    stats: J
                };
                if (H === null && await a3($)) return {
                    filePath: $,
                    stats: J
                };
                return null
            } catch ($) {
                return j6($), d("tengu_file_history_rewind_restore_file_failed", {
                    dryRun: !0
                }), null
            }
        })),
        Y = [],
        A = 0,
        O = 0;
    for (let w of z) {
        if (!w) continue;
        Y.push(w.filePath), A += w.stats?.insertions || 0, O += w.stats?.deletions || 0
    }
    return {
        filesChanged: Y,
        insertions: A,
        deletions: O
    }
}
// @from(Ln 343275, Col 0)
async function _wK(q, K) {
    if (!kO()) return !1;
    let _ = q.snapshots.findLast((z) => z.messageId === K);
    if (!_) return !1;
    for (let z of q.trackedFiles) try {
        let Y = o48(z),
            A = _.trackedFileBackups[z],
            O = A ? A.backupFileName : e17(z, q);
        if (O === void 0) continue;
        if (O === null) {
            if (await a3(Y)) return !0;
            continue
        }
        if (await t17(Y, O)) return !0
    } catch (Y) {
        j6(Y)
    }
    return !1
}
// @from(Ln 343294, Col 0)
async function b1Y(q, K) {
    let _ = [];
    for (let z of q.trackedFiles) try {
        let Y = o48(z),
            A = K.trackedFileBackups[z],
            O = A ? A.backupFileName : e17(z, q);
        if (O === void 0) {
            j6(Error("FileHistory: Error finding the backup file to apply")), d("tengu_file_history_rewind_restore_file_failed", {
                dryRun: !1
            });
            continue
        }
        if (O === null) {
            try {
                await h1Y(Y), E(`FileHistory: [Rewind] Deleted ${Y}`), _.push(Y)
            } catch (w) {
                if (!t1(w)) throw w
            }
            continue
        }
        if (await t17(Y, O)) await m1Y(Y, O), E(`FileHistory: [Rewind] Restored ${Y} from ${O}`), _.push(Y)
    } catch (Y) {
        j6(Y), d("tengu_file_history_rewind_restore_file_failed", {
            dryRun: !1
        })
    }
    return _
}
// @from(Ln 343322, Col 0)
async function t17(q, K, _) {
    let z = CX6(K),
        Y = _ ?? null;
    if (!Y) try {
        Y = await n48(q)
    } catch (O) {
        if (!t1(O)) return !0
    }
    let A = null;
    try {
        A = await n48(z)
    } catch (O) {
        if (!t1(O)) return !0
    }
    return I1Y(Y, A, async () => {
        try {
            let [O, w] = await Promise.all([a17(q, "utf-8"), a17(z, "utf-8")]);
            return O !== w
        } catch {
            return !0
        }
    })
}
// @from(Ln 343346, Col 0)
function I1Y(q, K, _) {
    if (q === null !== (K === null)) return !0;
    if (q === null || K === null) return !1;
    if (q.mode !== K.mode || q.size !== K.size) return !0;
    if (q.mtimeMs < K.mtimeMs) return !1;
    return _()
}
// @from(Ln 343353, Col 0)
async function x1Y(q, K) {
    let _ = [],
        z = 0,
        Y = 0;
    try {
        let A = K ? CX6(K) : void 0,
            [O, w] = await Promise.all([cF8(q), A ? cF8(A) : null]);
        if (O === null && w === null) return {
            filesChanged: _,
            insertions: z,
            deletions: Y
        };
        _.push(q), mK6(O ?? "", w ?? "").forEach((j) => {
            if (j.added) z += j.count || 0;
            if (j.removed) Y += j.count || 0
        })
    } catch (A) {
        j6(Error(`FileHistory: Error generating diffStats: ${A}`))
    }
    return {
        filesChanged: _,
        insertions: z,
        deletions: Y
    }
}
// @from(Ln 343379, Col 0)
function u1Y(q, K) {
    return `${y1Y("sha256").update(q).digest("hex").slice(0,16)}@v${K}`
}
// @from(Ln 343383, Col 0)
function CX6(q, K) {
    let _ = A7();
    return dF8(_, "file-history", K || I8(), q)
}
// @from(Ln 343387, Col 0)
async function zwK(q, K) {
    if (q === null) return {
        backupFileName: null,
        version: K,
        backupTime: new Date
    };
    let _ = u1Y(q, K),
        z = CX6(_),
        Y;
    try {
        Y = await n48(q)
    } catch (A) {
        if (t1(A)) return {
            backupFileName: null,
            version: K,
            backupTime: new Date
        };
        throw A
    }
    try {
        await l48(q, z)
    } catch (A) {
        if (!t1(A)) throw A;
        await s17(qwK(z), {
            recursive: !0
        }), await l48(q, z)
    }
    return await eOK(z, Y.mode), d("tengu_file_history_backup_file_created", {
        version: K,
        fileSize: Y.size
    }), {
        backupFileName: _,
        version: K,
        backupTime: new Date
    }
}
// @from(Ln 343423, Col 0)
async function m1Y(q, K) {
    let _ = CX6(K),
        z;
    try {
        z = await n48(_)
    } catch (Y) {
        if (t1(Y)) {
            d("tengu_file_history_rewind_restore_file_failed", {}), j6(Error(`FileHistory: [Rewind] Backup file not found: ${_}`));
            return
        }
        throw Y
    }
    try {
        await l48(_, q)
    } catch (Y) {
        if (!t1(Y)) throw Y;
        await s17(qwK(q), {
            recursive: !0
        }), await l48(_, q)
    }
    await eOK(q, z.mode)
}
// @from(Ln 343446, Col 0)
function e17(q, K) {
    for (let _ of K.snapshots) {
        let z = _.trackedFileBackups[q];
        if (z !== void 0 && z.version === 1) return z.backupFileName
    }
    return
}
// @from(Ln 343454, Col 0)
function YwK(q) {
    if (!KwK(q)) return q;
    let K = Y7();
    if (q.startsWith(K)) return R1Y(K, q);
    return q
}
// @from(Ln 343461, Col 0)
function o48(q) {
    if (KwK(q)) return q;
    return dF8(Y7(), q)
}
// @from(Ln 343466, Col 0)
function iF8(q, K) {
    if (!kO()) return;
    let _ = [],
        z = new Set;
    for (let Y of q) {
        let A = {};
        for (let [O, w] of Object.entries(Y.trackedFileBackups)) {
            let $ = YwK(O);
            z.add($), A[$] = w
        }
        _.push({
            ...Y,
            trackedFileBackups: A
        })
    }
    K({
        snapshots: _,
        trackedFiles: z,
        snapshotSequence: _.length
    })
}
// @from(Ln 343487, Col 0)
async function rF8(q) {
    if (!kO()) return;
    let K = q.fileHistorySnapshots;
    if (!K || q.messages.length === 0) return;
    let z = q.messages.at(-1)?.sessionId;
    if (!z) {
        j6(Error("FileHistory: Failed to copy backups on restore (no previous session id)"));
        return
    }
    let Y = I8();
    if (z === Y) {
        E(`FileHistory: No need to copy file history for resuming with same session id: ${Y}`);
        return
    }
    try {
        let A = dF8(A7(), "file-history", Y);
        await s17(A, {
            recursive: !0
        });
        let O = 0;
        if (await Promise.allSettled(K.map(async (w) => {
                let $ = Object.values(w.trackedFileBackups).filter((J) => J.backupFileName !== null);
                if (!(await Promise.allSettled($.map(async ({
                        backupFileName: J
                    }) => {
                        let X = CX6(J, z),
                            M = dF8(A, J);
                        try {
                            await L1Y(X, M)
                        } catch (P) {
                            let W = Q1(P);
                            if (W === "EEXIST") return;
                            if (W === "ENOENT") throw j6(Error(`FileHistory: Failed to copy backup ${J} on restore (backup file does not exist in ${z})`)), P;
                            j6(Error("FileHistory: Error hard linking backup file from previous session"));
                            try {
                                await l48(X, M)
                            } catch (D) {
                                throw j6(Error("FileHistory: Error copying over backup from previous session")), D
                            }
                        }
                        E(`FileHistory: Copied backup ${J} from session ${z} to ${Y}`)
                    }))).some((J) => J.status === "rejected")) i48(w.messageId, w, !1).catch((J) => {
                    j6(Error("FileHistory: Failed to record copy backup snapshot"))
                });
                else O++
            })), O > 0) d("tengu_file_history_resume_copy_failed", {
            numSnapshots: K.length,
            failedSnapshots: O
        })
    } catch (A) {
        j6(A)
    }
}
// @from(Ln 343540, Col 0)
async function B1Y(q, K) {
    let _ = q.snapshots.at(-1),
        z = K.snapshots.at(-1);
    if (!z) return;
    for (let Y of K.trackedFiles) {
        let A = o48(Y),
            O = _?.trackedFileBackups[Y],
            w = z.trackedFileBackups[Y];
        if (O?.backupFileName === w?.backupFileName && O?.version === w?.version) continue;
        let $ = null;
        if (O?.backupFileName) {
            let H = CX6(O.backupFileName);
            $ = await cF8(H)
        }
        let j = null;
        if (w?.backupFileName) {
            let H = CX6(w.backupFileName);
            j = await cF8(H)
        }
        if ($ !== j) EK6(A, $, j)
    }
}
// @from(Ln 343562, Col 0)
async function cF8(q) {
    try {
        return await a17(q, "utf-8")
    } catch {
        return null
    }
}
// @from(Ln 343570, Col 0)
function tOK(q) {
    if (p1Y) console.error(S1Y(q, !1, 5))
}
// @from(Ln 343573, Col 4)
sOK = 100
// @from(Ln 343574, Col 4)
p1Y = !1
// @from(Ln 343575, Col 4)
cy = L(() => {
    pK6();
    y8();
    C8();
    vy6();
    h1();
    K8();
    Q8();
    m8();
    eK();
    U8();
    g4()
})
// @from(Ln 343588, Col 4)
wwK = {}
// @from(Ln 343600, Col 0)
function d1Y(q) {
    if (q.type !== "attachment") return q;
    let K = q.attachment;
    if (Q1Y.has(K.type)) return null;
    if (K.type === "new_file") return {
        ...q,
        attachment: {
            ...K,
            type: "file",
            displayPath: q77(b8(), K.filename)
        }
    };
    if (K.type === "new_directory") return {
        ...q,
        attachment: {
            ...K,
            type: "directory",
            displayPath: q77(b8(), K.path)
        }
    };
    if (!("displayPath" in K)) {
        let _ = "filename" in K ? K.filename : ("path" in K) ? K.path : ("skillDir" in K) ? K.skillDir : void 0;
        if (_) return {
            ...q,
            attachment: {
                ...K,
                displayPath: q77(b8(), _)
            }
        }
    }
    return q
}
// @from(Ln 343633, Col 0)
function s48(q) {
    return K77(q).messages
}
// @from(Ln 343637, Col 0)
function K77(q, K) {
    try {
        let _ = q.map(d1Y).filter((H) => H !== null),
            z = new Set(jv);
        for (let H of _)
            if (H.type === "user" && H.permissionMode !== void 0 && !z.has(H.permissionMode)) H.permissionMode = void 0;
        let Y = oF8(_, K),
            A = qK8(Y),
            O = e48(A),
            w = K?.size ? {
                kind: "none"
            } : c1Y(O),
            $;
        if (w.kind === "interrupted_turn") {
            let [H] = aP([t8({
                content: "Continue from where you left off.",
                isMeta: !0
            })]);
            O.push(H), $ = {
                kind: "interrupted_prompt",
                message: H
            }
        } else $ = w;
        let j = O.findLastIndex((H) => H.type !== "system" && H.type !== "progress");
        if (j !== -1 && O[j].type === "user") O.splice(j + 1, 0, yj({
            content: Tj6
        }));
        return {
            messages: O,
            turnInterruptionState: $
        }
    } catch (_) {
        throw j6(_), _
    }
}
// @from(Ln 343673, Col 0)
function c1Y(q) {
    if (q.length === 0) return {
        kind: "none"
    };
    let K = q.findLastIndex((z) => z.type !== "system" && z.type !== "progress" && !(z.type === "assistant" && z.isApiErrorMessage)),
        _ = K !== -1 ? q[K] : void 0;
    if (!_) return {
        kind: "none"
    };
    if (_.type === "assistant") return {
        kind: "none"
    };
    if (_.type === "user") {
        if (_.isMeta || _.isCompactSummary) return {
            kind: "none"
        };
        if (t48(_)) {
            if (l1Y(_, q, K)) return {
                kind: "none"
            };
            return {
                kind: "interrupted_turn"
            }
        }
        return {
            kind: "interrupted_prompt",
            message: _
        }
    }
    if (_.type === "attachment") return {
        kind: "interrupted_turn"
    };
    return {
        kind: "none"
    }
}
// @from(Ln 343710, Col 0)
function l1Y(q, K, _) {
    let z = q.message.content;
    if (!Array.isArray(z)) return !1;
    let Y = z[0];
    if (Y?.type !== "tool_result") return !1;
    let A = Y.tool_use_id;
    for (let O = _ - 1; O >= 0; O--) {
        let w = K[O];
        if (w.type !== "assistant") continue;
        for (let $ of w.message.content)
            if ($.type === "tool_use" && $.id === A) return $.name === F1Y || $.name === g1Y || $.name === U1Y
    }
    return !1
}
// @from(Ln 343725, Col 0)
function AwK(q) {
    for (let K of q) {
        if (K.type !== "attachment") continue;
        if (K.attachment.type === "invoked_skills") {
            for (let _ of K.attachment.skills)
                if (_.name && _.path && _.content) RD6(_.name, _.path, _.content, null)
        }
        if (K.attachment.type === "skill_listing") $wK()
    }
}
// @from(Ln 343735, Col 0)
async function OwK(q) {
    let {
        messages: K,
        leafUuids: _
    } = await Ut(q), z = null, Y = 0;
    for (let O of K.values()) {
        if (O.isSidechain || !_.has(O.uuid)) continue;
        let w = new Date(O.timestamp).getTime();
        if (w > Y) Y = w, z = O
    }
    if (!z) return {
        messages: [],
        sessionId: void 0
    };
    let A = P96(K, z);
    return {
        messages: xC6(A),
        sessionId: z.sessionId
    }
}
// @from(Ln 343755, Col 0)
async function Ft(q, K) {
    try {
        let _ = null,
            z = null,
            Y;
        if (q === void 0) {
            let j = uC6(),
                H = new Set;
            _ = (await j).find((X) => {
                let M = xY(X);
                return !M || !H.has(M)
            }) ?? null
        } else if (K) {
            let j = await OwK(K);
            z = j.messages, Y = j.sessionId
        } else if (typeof q === "string") _ = await KK8(q), Y = q;
        else _ = q;
        if (!_ && !z) return null;
        if (_) {
            if (SF(_)) _ = await gt(_);
            if (!Y) Y = xY(_);
            if (Y) await Fb8(_, pP(Y));
            rF8(_), z = _.messages, _77(z)
        }
        AwK(z);
        let A = _?.fullPath ?? K,
            O = A ? await z77(A) ?? void 0 : void 0,
            w = K77(z, O ? new Set([O.toolUseID]) : void 0);
        z = w.messages;
        let $ = await lR("resume", {
            sessionId: Y
        });
        return z.push(...$), {
            messages: z,
            turnInterruptionState: w.turnInterruptionState,
            deferredToolUse: O,
            fileHistorySnapshots: _?.fileHistorySnapshots,
            attributionSnapshots: _?.attributionSnapshots,
            contentReplacements: _?.contentReplacements,
            contextCollapseCommits: _?.contextCollapseCommits,
            contextCollapseSnapshot: _?.contextCollapseSnapshot,
            sessionId: Y,
            agentName: _?.agentName,
            agentColor: _?.agentColor,
            agentSetting: _?.agentSetting,
            customTitle: _?.customTitle,
            tag: _?.tag,
            mode: _?.mode,
            permissionMode: _?.permissionMode,
            worktreeSession: _?.worktreeSession,
            prNumber: _?.prNumber,
            prUrl: _?.prUrl,
            prRepository: _?.prRepository,
            fullPath: _?.fullPath
        }
    } catch (_) {
        throw j6(_), _
    }
}
// @from(Ln 343814, Col 4)
F1Y
// @from(Ln 343814, Col 9)
g1Y
// @from(Ln 343814, Col 14)
U1Y = null
// @from(Ln 343815, Col 4)
Q1Y
// @from(Ln 343816, Col 4)
IX6 = L(() => {
    n7();
    y8();
    Cf();
    qG6();
    ZM();
    cy();
    U8();
    _7();
    NJ();
    a56();
    g4();
    F1Y = (vh(), B7(TU)).BRIEF_TOOL_NAME, g1Y = (vh(), B7(TU)).LEGACY_BRIEF_TOOL_NAME, Q1Y = new Set(["compaction_reminder", "companion_intro", "pen_mode_enter", "pen_mode_exit"])
})
// @from(Ln 343836, Col 0)
function XwK() {
    return process.env.ANTHROPIC_BASE_URL || process.env.CLAUDE_CODE_API_BASE_URL || "https://api.anthropic.com"
}
// @from(Ln 343840, Col 0)
function Y77(q) {
    E(`[files-api] ${q}`, {
        level: "error"
    })
}
// @from(Ln 343846, Col 0)
function Qt(q) {
    E(`[files-api] ${q}`)
}
// @from(Ln 343849, Col 0)
async function MwK(q, K) {
    let _ = "";
    for (let z = 1; z <= aF8; z++) {
        let Y = await K(z);
        if (Y.done) return Y.value;
        if (_ = Y.error || `${q} failed`, Qt(`${q} attempt ${z}/${aF8} failed: ${_}`), z < aF8) {
            let A = i1Y * Math.pow(2, z - 1);
            Qt(`Retrying ${q} in ${A}ms...`), await l7(A)
        }
    }
    throw Error(`${_} after ${aF8} attempts`)
}
// @from(Ln 343861, Col 0)
async function r1Y(q, K) {
    let z = `${K.baseUrl||XwK()}/v1/files/${q}/content`,
        Y = {
            Authorization: `Bearer ${K.oauthToken}`,
            "anthropic-version": JwK,
            "anthropic-beta": HwK
        };
    return Qt(`Downloading file ${q} from ${z}`), MwK(`Download file ${q}`, async () => {
        try {
            let A = await Z1.get(z, {
                headers: Y,
                responseType: "arraybuffer",
                timeout: 60000,
                validateStatus: (O) => O < 500
            });
            if (A.status === 200) return Qt(`Downloaded file ${q} (${A.data.length} bytes)`), {
                done: !0,
                value: Buffer.from(A.data)
            };
            if (A.status === 404) throw Error(`File not found: ${q}`);
            if (A.status === 401) throw Error("Authentication failed: invalid or missing API key");
            if (A.status === 403) throw Error(`Access denied to file: ${q}`);
            return {
                done: !1,
                error: `status ${A.status}`
            }
        } catch (A) {
            if (!Z1.isAxiosError(A)) throw A;
            return {
                done: !1,
                error: A.message
            }
        }
    })
}
// @from(Ln 343897, Col 0)
function o1Y(q, K, _) {
    let z = ly.normalize(_);
    if (z.startsWith("..")) return Y77(`Invalid file path: ${_}. Path must not traverse above workspace`), null;
    let Y = ly.join(q, K, "uploads"),
        O = [ly.join(q, K, "uploads") + ly.sep, ly.sep + "uploads" + ly.sep].find(($) => z.startsWith($)),
        w = O ? z.slice(O.length) : z;
    return ly.join(Y, w)
}
// @from(Ln 343905, Col 0)
async function a1Y(q, K) {
    let {
        fileId: _,
        relativePath: z
    } = q, Y = o1Y(b8(), K.sessionId, z);
    if (!Y) return {
        fileId: _,
        path: "",
        success: !1,
        error: `Invalid file path: ${z}`
    };
    try {
        let A = await r1Y(_, K),
            O = ly.dirname(Y);
        return await mC6.mkdir(O, {
            recursive: !0
        }), await mC6.writeFile(Y, A), Qt(`Saved file ${_} to ${Y} (${A.length} bytes)`), {
            fileId: _,
            path: Y,
            success: !0,
            bytesWritten: A.length
        }
    } catch (A) {
        if (Y77(`Failed to download file ${_}: ${b6(A)}`), A instanceof Error) j6(A);
        return {
            fileId: _,
            path: Y,
            success: !1,
            error: b6(A)
        }
    }
}
// @from(Ln 343937, Col 0)
async function t1Y(q, K, _) {
    let z = Array(q.length),
        Y = 0;
    async function A() {
        while (Y < q.length) {
            let $ = Y++,
                j = q[$];
            if (j !== void 0) z[$] = await K(j, $)
        }
    }
    let O = [],
        w = Math.min(_, q.length);
    for (let $ = 0; $ < w; $++) O.push(A());
    return await Promise.all(O), z
}
// @from(Ln 343952, Col 0)
async function PwK(q, K, _ = s1Y) {
    if (q.length === 0) return [];
    Qt(`Downloading ${q.length} file(s) for session ${K.sessionId}`);
    let z = Date.now(),
        Y = await t1Y(q, (w) => a1Y(w, K), _),
        A = Date.now() - z,
        O = w7(Y, (w) => w.success);
    return Qt(`Downloaded ${O}/${q.length} file(s) in ${A}ms`), Y
}
// @from(Ln 343961, Col 0)
async function WwK(q, K, _, z) {
    let A = `${_.baseUrl||XwK()}/v1/files`,
        O = {
            Authorization: `Bearer ${_.oauthToken}`,
            "anthropic-version": JwK,
            "anthropic-beta": HwK
        };
    Qt(`Uploading file ${q} as ${K}`);
    let w;
    try {
        w = await mC6.readFile(q)
    } catch (M) {
        return d("tengu_file_upload_failed", {
            error_type: "file_read"
        }), {
            path: K,
            error: b6(M),
            success: !1
        }
    }
    let $ = w.length;
    if ($ > jwK) return d("tengu_file_upload_failed", {
        error_type: "file_too_large"
    }), {
        path: K,
        error: `File exceeds maximum size of ${jwK} bytes (actual: ${$})`,
        success: !1
    };
    let j = `----FormBoundary${n1Y()}`,
        H = ly.basename(K),
        J = [];
    J.push(Buffer.from(`--${j}\r
Content-Disposition: form-data; name="file"; filename="${H}"\r
Content-Type: application/octet-stream\r
\r
`)), J.push(w), J.push(Buffer.from(`\r
`)), J.push(Buffer.from(`--${j}\r
Content-Disposition: form-data; name="purpose"\r
\r
user_data\r
`)), J.push(Buffer.from(`--${j}--\r
`));
    let X = Buffer.concat(J);
    try {
        return await MwK(`Upload file ${K}`, async () => {
            try {
                let M = await Z1.post(A, X, {
                    headers: {
                        ...O,
                        "Content-Type": `multipart/form-data; boundary=${j}`,
                        "Content-Length": X.length.toString()
                    },
                    timeout: 120000,
                    signal: z?.signal,
                    validateStatus: (P) => P < 500
                });
                if (M.status === 200 || M.status === 201) {
                    let P = M.data?.id;
                    if (!P) return {
                        done: !1,
                        error: "Upload succeeded but no file ID returned"
                    };
                    return Qt(`Uploaded file ${q} -> ${P} (${$} bytes)`), {
                        done: !0,
                        value: {
                            path: K,
                            fileId: P,
                            size: $,
                            success: !0
                        }
                    }
                }
                if (M.status === 401) throw d("tengu_file_upload_failed", {
                    error_type: "auth"
                }), new xX6("Authentication failed: invalid or missing API key");
                if (M.status === 403) throw d("tengu_file_upload_failed", {
                    error_type: "forbidden"
                }), new xX6("Access denied for upload");
                if (M.status === 413) throw d("tengu_file_upload_failed", {
                    error_type: "size"
                }), new xX6("File too large for upload");
                return {
                    done: !1,
                    error: `status ${M.status}`
                }
            } catch (M) {
                if (M instanceof xX6) throw M;
                if (Z1.isCancel(M)) throw new xX6("Upload canceled");
                if (Z1.isAxiosError(M)) return {
                    done: !1,
                    error: M.message
                };
                throw M
            }
        })
    } catch (M) {
        if (M instanceof xX6) return {
            path: K,
            error: M.message,
            success: !1
        };
        return d("tengu_file_upload_failed", {
            error_type: "network"
        }), {
            path: K,
            error: b6(M),
            success: !1
        }
    }
}
// @from(Ln 344072, Col 0)
function DwK(q) {
    let K = [],
        _ = q.flatMap((z) => z.split(" ").filter(Boolean));
    for (let z of _) {
        let Y = z.indexOf(":");
        if (Y === -1) continue;
        let A = z.substring(0, Y),
            O = z.substring(Y + 1);
        if (!A || !O) {
            Y77(`Invalid file spec: ${z}. Both file_id and path are required`);
            continue
        }
        K.push({
            fileId: A,
            relativePath: O
        })
    }
    return K
}
// @from(Ln 344091, Col 4)
HwK = "files-api-2025-04-14,oauth-2025-04-20"
// @from(Ln 344092, Col 4)
JwK = "2023-06-01"
// @from(Ln 344093, Col 4)
aF8 = 3
// @from(Ln 344094, Col 4)
i1Y = 500
// @from(Ln 344095, Col 4)
jwK = 524288000
// @from(Ln 344096, Col 4)
s1Y = 5
// @from(Ln 344097, Col 4)
xX6
// @from(Ln 344098, Col 4)
sF8 = L(() => {
    CK();
    n7();
    K8();
    m8();
    U8();
    C8();
    xX6 = class xX6 extends Error {
        constructor(q) {
            super(q);
            this.name = "UploadNonRetriableError"
        }
    }
})
// @from(Ln 344117, Col 0)
function ZwK() {
    return u8("tengu_ccr_bundle_max_bytes", null) ?? q7Y
}
// @from(Ln 344120, Col 0)
async function fwK(q, K) {
    let _ = await M7(D7(), ["count-objects", "-v"], {
        cwd: q,
        abortSignal: K
    });
    if (_.code !== 0) return {
        sizeBytes: null,
        inPackCount: null
    };
    let z = _.stdout.match(/^size-pack:\s*(\d+)/m),
        Y = _.stdout.match(/^in-pack:\s*(\d+)/m);
    return {
        sizeBytes: z ? Number(z[1]) * 1024 : null,
        inPackCount: Y ? Number(Y[1]) : null
    }
}
// @from(Ln 344136, Col 0)
async function GwK(q) {
    let K = ez(q?.cwd ?? b8());
    if (!K) return !1;
    let {
        sizeBytes: _,
        inPackCount: z
    } = await fwK(K, q?.signal);
    if (_ === null) return !1;
    let Y = ZwK();
    return _ > 3 * Y && (_ > 100 * Y || z !== null && z > 5000000)
}
// @from(Ln 344147, Col 0)
async function K7Y(q, K, _, z, Y, A) {
    let O = z ? ["refs/seed/stash"] : [],
        w = (f) => M7(D7(), ["bundle", "create", K, f, ...O], {
            cwd: q,
            abortSignal: Y
        }),
        {
            sizeBytes: $,
            inPackCount: j
        } = await fwK(q, Y),
        H = $ !== null && $ > _,
        J = $ !== null && $ > 3 * _,
        X = J && ($ !== null && $ > 100 * _ || j !== null && j > 5000000);
    if (H) E(`[gitBundle] size-pack ${($/1024/1024).toFixed(0)}MB > ${(_/1024/1024).toFixed(0)}MB cap; skipping --all${J?" and HEAD":""}${X?" and squashed":""}`);
    if (!H) {
        let f = await w("--all");
        if (f.code !== 0) return {
            ok: !1,
            error: `git bundle create --all failed (${f.code}): ${f.stderr.slice(0,200)}`,
            failReason: "git_error"
        };
        let {
            size: v
        } = await A77(K);
        if (v <= _) return {
            ok: !0,
            size: v,
            scope: "all"
        };
        E(`[gitBundle] --all bundle is ${(v/1024/1024).toFixed(1)}MB (> ${(_/1024/1024).toFixed(0)}MB), retrying HEAD-only`)
    }
    if (!J) {
        let f = await w("HEAD");
        if (f.code !== 0) return {
            ok: !1,
            error: `git bundle create HEAD failed (${f.code}): ${f.stderr.slice(0,200)}`,
            failReason: "git_error"
        };
        let {
            size: v
        } = await A77(K);
        if (v <= _) return {
            ok: !0,
            size: v,
            scope: "head"
        };
        E(`[gitBundle] HEAD bundle is ${(v/1024/1024).toFixed(1)}MB, retrying squashed-root`)
    }
    if (X) return {
        ok: !1,
        error: "Repo is too large to bundle. Please setup GitHub on https://claude.ai/code",
        failReason: "too_large"
    };
    let M = z ? "refs/seed/stash^{tree}" : "HEAD^{tree}",
        P = [];
    if (A) {
        let [f, v] = await Promise.all([M, `${A}^{tree}`].map((k) => M7(D7(), ["rev-parse", k], {
            cwd: q,
            abortSignal: Y
        })));
        if (f?.code === 0 && f.stdout.trim() === v?.stdout.trim()) return {
            ok: !1,
            error: "It doesn't look like you have any new commits or changes to review. Stage or commit them first?",
            failReason: "no_changes"
        };
        let V = await M7(D7(), ["commit-tree", `${A}^{tree}`, "-m", "seed-base"], {
            cwd: q,
            abortSignal: Y
        });
        if (V.code === 0) P = ["-p", V.stdout.trim()];
        else E(`[gitBundle] baseRef commit-tree failed (${V.code}), squashing without parent: ${V.stderr.slice(0,200)}`)
    }
    let W = await M7(D7(), ["commit-tree", M, ...P, "-m", "seed"], {
        cwd: q,
        abortSignal: Y
    });
    if (W.code !== 0) return {
        ok: !1,
        error: `git commit-tree failed (${W.code}): ${W.stderr.slice(0,200)}`,
        failReason: "git_error"
    };
    let D = W.stdout.trim();
    await M7(D7(), ["update-ref", "refs/seed/root", D], {
        cwd: q
    });
    let Z = await M7(D7(), ["bundle", "create", K, "refs/seed/root"], {
        cwd: q,
        abortSignal: Y
    });
    if (Z.code !== 0) return {
        ok: !1,
        error: `git bundle create refs/seed/root failed (${Z.code}): ${Z.stderr.slice(0,200)}`,
        failReason: "git_error"
    };
    let {
        size: G
    } = await A77(K);
    if (G <= _) return {
        ok: !0,
        size: G,
        scope: "squashed"
    };
    return {
        ok: !1,
        error: "Repo is too large to bundle. Please setup GitHub on https://claude.ai/code",
        failReason: "too_large"
    }
}
// @from(Ln 344255, Col 0)
async function O77(q, K) {
    let _ = K?.cwd ?? b8(),
        z = ez(_);
    if (!z) return {
        success: !1,
        error: "Not in a git repository"
    };
    for (let j of ["refs/seed/stash", "refs/seed/root"]) await M7(D7(), ["update-ref", "-d", j], {
        cwd: z
    });
    let Y = await M7(D7(), ["for-each-ref", "--count=1", "refs/"], {
        cwd: z
    });
    if (Y.code === 0 && Y.stdout.trim() === "") return d("tengu_ccr_bundle_upload", {
        outcome: "empty_repo"
    }), {
        success: !1,
        error: "Repository has no commits yet",
        failReason: "empty_repo"
    };
    let A = await M7(D7(), ["stash", "create"], {
            cwd: z,
            abortSignal: K?.signal
        }),
        O = A.code === 0 ? A.stdout.trim() : "",
        w = O !== "";
    if (A.code !== 0) {
        if (E(`[gitBundle] git stash create failed (${A.code}): ${A.stderr.slice(0,200)}`), (await M7(D7(), ["rev-parse", "--verify", "HEAD"], {
                cwd: z
            })).code === 0) return d("tengu_ccr_bundle_upload", {
            outcome: "stash_failed"
        }), {
            success: !1,
            error: `Could not capture uncommitted changes (git stash create: ${oY(A.stderr.trim())}). Run \`git add .\` or commit, then retry.`,
            failReason: "stash_failed"
        }
    } else if (w) E(`[gitBundle] Captured WIP as stash ${O}`), await M7(D7(), ["update-ref", "refs/seed/stash", O], {
        cwd: z
    });
    let $ = vE6("ccr-seed", ".bundle");
    try {
        let j = ZwK(),
            H = await K7Y(z, $, j, w, K?.signal, K?.baseRef);
        if (!H.ok) return E(`[gitBundle] ${H.error}`), d("tengu_ccr_bundle_upload", {
            outcome: H.failReason,
            max_bytes: j
        }), {
            success: !1,
            error: H.error,
            failReason: H.failReason
        };
        let J = await WwK($, "_source_seed.bundle", q, {
            signal: K?.signal
        });
        if (!J.success) return d("tengu_ccr_bundle_upload", {
            outcome: "failed"
        }), {
            success: !1,
            error: J.error
        };
        return E(`[gitBundle] Uploaded ${J.size} bytes as file_id ${J.fileId}`), d("tengu_ccr_bundle_upload", {
            outcome: "success",
            size_bytes: J.size,
            scope: H.scope,
            has_wip: w
        }), {
            success: !0,
            fileId: J.fileId,
            bundleSizeBytes: J.size,
            scope: H.scope,
            hasWip: w
        }
    } finally {
        try {
            await e1Y($)
        } catch {
            E(`[gitBundle] Could not delete ${$} (non-fatal)`)
        }
        for (let j of ["refs/seed/stash", "refs/seed/root"]) await M7(D7(), ["update-ref", "-d", j], {
            cwd: z
        })
    }
}
// @from(Ln 344338, Col 4)
q7Y = 104857600
// @from(Ln 344339, Col 4)
w77 = L(() => {
    C8();
    B1();
    sF8();
    n7();
    K8();
    Q4();
    pK();
    cW()
})
// @from(Ln 344349, Col 4)
H77 = {}
// @from(Ln 344366, Col 0)
function _7Y(q) {
    if (q === null) return eO("Session resumed", "suggestion");
    let K = q instanceof dj ? q.formattedMessage : q.message;
    return eO(`Session resumed without branch: ${K}`, "warning")
}
// @from(Ln 344372, Col 0)
function z7Y() {
    return t8({
        content: `This session is being continued from another machine. Application state may have changed. The updated working directory is ${Y7()}`,
        isMeta: !0
    })
}
// @from(Ln 344378, Col 0)
async function A7Y(q, K) {
    let _ = j4(q, 75),
        z = "claude/task";
    try {
        let Y = Y7Y.replace("{description}", q),
            O = (await ov({
                systemPrompt: sK([]),
                userPrompt: Y,
                outputFormat: {
                    type: "json_schema",
                    schema: {
                        type: "object",
                        properties: {
                            title: {
                                type: "string"
                            },
                            branch: {
                                type: "string"
                            }
                        },
                        required: ["title", "branch"],
                        additionalProperties: !1
                    }
                },
                signal: K,
                options: {
                    querySource: "teleport_generate_title",
                    agents: [],
                    isNonInteractiveSession: !1,
                    hasAppendSystemPrompt: !1,
                    mcpTools: []
                }
            })).message.content[0];
        if (O?.type !== "text") return {
            title: _,
            branchName: "claude/task"
        };
        let w = k5(O.text.trim()),
            $ = y.object({
                title: y.string(),
                branch: y.string()
            }).safeParse(w);
        if ($.success) return {
            title: $.data.title || _,
            branchName: $.data.branch || "claude/task"
        };
        return {
            title: _,
            branchName: "claude/task"
        }
    } catch (Y) {
        return j6(Error(`Error generating title and branch: ${Y}`)), {
            title: _,
            branchName: "claude/task"
        }
    }
}
// @from(Ln 344435, Col 0)
async function $77() {
    if (!await if6({
            ignoreUntracked: !0
        })) throw d("tengu_teleport_error_git_not_clean", {}), new dj("Git working directory is not clean. Please commit or stash your changes before using --teleport.", Y8.red(`Error: Git working directory is not clean. Please commit or stash your changes before using --teleport.
`))
}
// @from(Ln 344441, Col 0)
async function O7Y(q) {
    let K = q ? ["fetch", "origin", `${q}:${q}`] : ["fetch", "origin"],
        {
            code: _,
            stderr: z
        } = await w1(D7(), K);
    if (_ !== 0)
        if (q && z.includes("refspec")) {
            E(`Specific branch fetch failed, trying to fetch ref: ${q}`);
            let {
                code: Y,
                stderr: A
            } = await w1(D7(), ["fetch", "origin", q]);
            if (Y !== 0) j6(Error(`Failed to fetch from remote origin: ${A}`))
        } else j6(Error(`Failed to fetch from remote origin: ${z}`))
}
// @from(Ln 344457, Col 0)
async function w7Y(q) {
    let {
        code: K
    } = await w1(D7(), ["rev-parse", "--abbrev-ref", `${q}@{upstream}`]);
    if (K === 0) {
        E(`Branch '${q}' already has upstream set`);
        return
    }
    let {
        code: _
    } = await w1(D7(), ["rev-parse", "--verify", `origin/${q}`]);
    if (_ === 0) {
        E(`Setting upstream for '${q}' to 'origin/${q}'`);
        let {
            code: z,
            stderr: Y
        } = await w1(D7(), ["branch", "--set-upstream-to", `origin/${q}`, q]);
        if (z !== 0) E(`Failed to set upstream for '${q}': ${Y}`);
        else E(`Successfully set upstream for '${q}'`)
    } else E(`Remote branch 'origin/${q}' does not exist, skipping upstream setup`)
}
// @from(Ln 344478, Col 0)
async function $7Y(q) {
    let {
        code: K,
        stderr: _
    } = await w1(D7(), ["checkout", q]);
    if (K !== 0) {
        E(`Local checkout failed, trying to checkout from origin: ${_}`);
        let z = await w1(D7(), ["checkout", "-b", q, "--track", `origin/${q}`]);
        if (K = z.code, _ = z.stderr, K !== 0) {
            E(`Remote checkout with -b failed, trying without -b: ${_}`);
            let Y = await w1(D7(), ["checkout", "--track", `origin/${q}`]);
            K = Y.code, _ = Y.stderr
        }
    }
    if (K !== 0) throw d("tengu_teleport_error_branch_checkout_failed", {}), new dj(`Failed to checkout branch '${q}': ${_}`, Y8.red(`Failed to checkout branch '${q}'
`));
    await w7Y(q)
}
// @from(Ln 344496, Col 0)
async function tF8() {
    let {
        stdout: q
    } = await w1(D7(), ["branch", "--show-current"]);
    return q.trim()
}
// @from(Ln 344503, Col 0)
function _K8(q, K) {
    return [...s48(q), z7Y(), _7Y(K)]
}
// @from(Ln 344506, Col 0)
async function zK8(q) {
    try {
        let K = await tF8();
        if (E(`Current branch before teleport: '${K}'`), q) {
            E(`Switching to branch '${q}'...`), await O7Y(q), await $7Y(q);
            let z = await tF8();
            E(`Branch after checkout: '${z}'`)
        } else E("No branch specified, staying on current branch");
        return {
            branchName: await tF8(),
            branchError: null
        }
    } catch (K) {
        let _ = await tF8(),
            z = r1(K);
        return {
            branchName: _,
            branchError: z
        }
    }
}
// @from(Ln 344527, Col 0)
async function qg8(q) {
    let K = await oN(),
        _ = K ? `${K.owner}/${K.name}` : null,
        z = q.session_context.sources.find((j) => j.type === "git_repository");
    if (!z?.url) return E(_ ? "Session has no associated repository, proceeding without validation" : "Session has no repo requirement and not in git directory, proceeding"), {
        status: "no_repo_required"
    };
    let Y = xA6(z.url),
        A = Y ? `${Y.owner}/${Y.name}` : uA6(z.url);
    if (!A) return {
        status: "no_repo_required"
    };
    if (E(`Session is for repository: ${A}, current repo: ${_??"none"}`), !_) return {
        status: "not_in_repo",
        sessionRepo: A,
        sessionHost: Y?.host,
        currentRepo: null
    };
    let O = (j) => j.replace(/:\d+$/, ""),
        w = _.toLowerCase() === A.toLowerCase(),
        $ = !K || !Y || O(K.host.toLowerCase()) === O(Y.host.toLowerCase());
    if (w && $) return {
        status: "match",
        sessionRepo: A,
        currentRepo: _
    };
    return {
        status: "mismatch",
        sessionRepo: A,
        currentRepo: _,
        sessionHost: Y?.host,
        currentHost: K?.host
    }
}
// @from(Ln 344561, Col 0)
async function uX6(q, K) {
    if (!N5("allow_remote_sessions")) throw Error("Remote sessions are disabled by your organization's policy.");
    E(`Resuming code session ID: ${q}`);
    try {
        let _ = o7()?.accessToken;
        if (!_) throw d("tengu_teleport_resume_error", {
            error_type: "no_access_token"
        }), Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
        let z = await zD();
        if (!z) throw d("tengu_teleport_resume_error", {
            error_type: "no_org_uuid"
        }), Error("Unable to get organization UUID for constructing session URL");
        K?.("validating");
        let Y = await w36(q),
            A = await qg8(Y);
        switch (A.status) {
            case "match":
            case "no_repo_required":
                break;
            case "not_in_repo": {
                d("tengu_teleport_error_repo_not_in_git_dir_sessions_api", {
                    sessionId: q
                });
                let O = A.sessionHost && A.sessionHost.toLowerCase() !== "github.com" ? `${A.sessionHost}/${A.sessionRepo}` : A.sessionRepo;
                throw new dj(`You must run claude --teleport ${q} from a checkout of ${O}.`, Y8.red(`You must run claude --teleport ${q} from a checkout of ${Y8.bold(O)}.
`))
            }
            case "mismatch": {
                d("tengu_teleport_error_repo_mismatch_sessions_api", {
                    sessionId: q
                });
                let O = A.sessionHost && A.currentHost && A.sessionHost.replace(/:\d+$/, "").toLowerCase() !== A.currentHost.replace(/:\d+$/, "").toLowerCase(),
                    w = O ? `${A.sessionHost}/${A.sessionRepo}` : A.sessionRepo,
                    $ = O ? `${A.currentHost}/${A.currentRepo}` : A.currentRepo;
                throw new dj(`You must run claude --teleport ${q} from a checkout of ${w}.
This repo is ${$}.`, Y8.red(`You must run claude --teleport ${q} from a checkout of ${Y8.bold(w)}.
This repo is ${Y8.bold($)}.
`))
            }
            case "error":
                throw new dj(A.errorMessage || "Failed to validate session repository", Y8.red(`Error: ${A.errorMessage||"Failed to validate session repository"}
`));
            default: {
                let O = A.status;
                throw Error(`Unhandled repo validation status: ${O}`)
            }
        }
        return await VwK(q, z, _, K, Y)
    } catch (_) {
        if (_ instanceof dj) throw _;
        let z = r1(_);
        throw j6(z), d("tengu_teleport_resume_error", {
            error_type: "resume_session_id_catch"
        }), new dj(z.message, Y8.red(`Error: ${z.message}
`))
    }
}
// @from(Ln 344618, Col 0)
async function j7Y(q, K) {
    let _ = await n17();
    if (_.size > 0) d("tengu_teleport_errors_detected", {
        error_types: Array.from(_).join(","),
        errors_ignored: Array.from(K || []).join(",")
    }), await new Promise((z) => {
        q.render(eF8.default.createElement(kX, null, eF8.default.createElement(TM, null, eF8.default.createElement(FF8, {
            errorsToIgnore: K,
            onComplete: () => {
                d("tengu_teleport_errors_resolved", {
                    error_types: Array.from(_).join(",")
                }), z()
            }
        }))))
    })
}
// @from(Ln 344635, Col 0)
function TwK(q, K) {
    d("tengu_ccr_session_link", {
        ccr_session_id: q,
        source: K
    })
}
// @from(Ln 344641, Col 0)
async function j77(q, K, _, z, Y) {
    return await j7Y(q, new Set(["needsGitStash"])), CF({
        initialMessage: K,
        signal: _,
        source: z,
        branchName: Y,
        onBundleFail: (O) => process.stderr.write(`
${O}
`)
    })
}