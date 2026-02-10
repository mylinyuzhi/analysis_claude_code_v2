
// @from(Ln 312723, Col 0)
function r31({
    onDone: A,
    startingMessage: q,
    mode: K = "login",
    forceLoginMethod: Y
}) {
    let z = C8() || {},
        w = Y ?? z.forceLoginMethod,
        H = z.forceLoginOrgUUID,
        $ = w === "claudeai" ? "Login method pre-selected: Subscription Plan (Claude Pro/Max)" : w === "console" ? "Login method pre-selected: API Usage Billing (Anthropic Console)" : null,
        O = YB(),
        [_, J] = D7.useState(() => {
            if (K === "setup-token") return {
                state: "ready_to_start"
            };
            if (w === "claudeai" || w === "console") return {
                state: "ready_to_start"
            };
            return {
                state: "idle"
            }
        }),
        [X, D] = D7.useState(""),
        [j, M] = D7.useState(0),
        [P] = D7.useState(() => new LF1),
        [W, G] = D7.useState(() => {
            return K === "setup-token" || w === "claudeai"
        }),
        [f, Z] = D7.useState(!1),
        [N, T] = D7.useState(!1),
        k = Z8().columns - lC4.length - 1;
    D7.useEffect(() => {
        if (w === "claudeai") c("tengu_oauth_claudeai_forced", {});
        else if (w === "console") c("tengu_oauth_console_forced", {})
    }, [w]), D7.useEffect(() => {
        if (_.state === "about_to_retry") setTimeout(() => {
            J(_.nextState)
        }, 1000)
    }, [_]), DA("confirm:yes", () => {
        c("tengu_oauth_success", {
            loginWithClaudeAi: W
        }), A()
    }, {
        context: "Confirmation",
        isActive: _.state === "success" && K !== "setup-token"
    }), DA("confirm:yes", () => {
        J({
            state: "idle"
        })
    }, {
        context: "Confirmation",
        isActive: _.state === "platform_setup"
    }), DA("confirm:yes", () => {
        if (_.state === "error" && _.toRetry) D(""), J({
            state: "about_to_retry",
            nextState: _.toRetry
        })
    }, {
        context: "Confirmation",
        isActive: _.state === "error" && !!_.toRetry
    }), D7.useEffect(() => {
        if (X === "c" && _.state === "waiting_for_login" && f && !N) l0(_.url).then((b) => {
            if (b) T(!0), setTimeout(() => T(!1), 2000)
        }), D("")
    }, [X, _, f, N]);
    async function y(b, g) {
        try {
            let [U, x] = b.split("#");
            if (!U || !x) {
                J({
                    state: "error",
                    message: "Invalid code. Please make sure the full code was copied",
                    toRetry: {
                        state: "waiting_for_login",
                        url: g
                    }
                });
                return
            }
            c("tengu_oauth_manual_entry", {}), P.handleManualAuthCodeInput({
                authorizationCode: U,
                state: x
            })
        } catch (U) {
            K1(U instanceof Error ? U : Error(String(U))), J({
                state: "error",
                message: U.message,
                toRetry: {
                    state: "waiting_for_login",
                    url: g
                }
            })
        }
    }
    let B = D7.useCallback(async () => {
            try {
                c("tengu_oauth_flow_start", {
                    loginWithClaudeAi: W
                });
                let b = await P.startOAuthFlow(async (g) => {
                    J({
                        state: "waiting_for_login",
                        url: g
                    }), setTimeout(() => Z(!0), 3000)
                }, {
                    loginWithClaudeAi: W,
                    inferenceOnly: K === "setup-token",
                    expiresIn: K === "setup-token" ? 31536000 : void 0,
                    orgUUID: H
                }).catch((g) => {
                    let U = g.message.includes("Token exchange failed");
                    throw J({
                        state: "error",
                        message: U ? "Failed to exchange authorization code for access token. Please try again." : g.message,
                        toRetry: K === "setup-token" ? {
                            state: "ready_to_start"
                        } : {
                            state: "idle"
                        }
                    }), c("tengu_oauth_token_exchange_error", {
                        error: g.message
                    }), g
                });
                if (K === "setup-token") J({
                    state: "success",
                    token: b.accessToken
                });
                else {
                    let g = DR1(b);
                    if (g.warning) c("tengu_oauth_storage_warning", {
                        warning: g.warning
                    });
                    if (await M$8(b.accessToken).catch((U) => {
                            throw J({
                                state: "error",
                                message: "Failed to fetch user roles: " + U.message,
                                toRetry: {
                                    state: "idle"
                                }
                            }), c("tengu_oauth_user_roles_error", {
                                error: U.message
                            }), U
                        }), bQ(b.scopes)) await c17(), kF1(), J({
                        state: "success"
                    }), Nm({
                        message: "Claude Code login successful",
                        notificationType: "auth_success"
                    }, O), pTA();
                    else if (J({
                            state: "creating_api_key"
                        }), await P$8(b.accessToken).catch((x) => {
                            throw J({
                                state: "error",
                                message: "Failed to create API key: " + x.message,
                                toRetry: {
                                    state: "idle"
                                }
                            }), c("tengu_oauth_api_key_error", {
                                error: x.message
                            }), x
                        })) kF1(), J({
                        state: "success"
                    }), Nm({
                        message: "Claude Code login successful",
                        notificationType: "auth_success"
                    }, O), pTA();
                    else J({
                        state: "error",
                        message: "Unable to create API key. The server accepted the request but didn't return a key.",
                        toRetry: {
                            state: "idle"
                        }
                    }), c("tengu_oauth_api_key_error", {
                        error: "server_returned_no_key"
                    })
                }
            } catch (b) {
                let g = b.message;
                c("tengu_oauth_error", {
                    error: g
                })
            }
        }, [P, Z, W, K, H]),
        S = D7.useRef(!1);
    D7.useEffect(() => {
        if (_.state === "ready_to_start" && !S.current) S.current = !0, process.nextTick(() => {
            B(), S.current = !1
        })
    }, [_.state, B]), D7.useEffect(() => {
        if (K === "setup-token" && _.state === "success") {
            let b = setTimeout(async () => {
                c("tengu_oauth_success", {
                    loginWithClaudeAi: W
                }), A()
            }, 500);
            return () => clearTimeout(b)
        }
    }, [K, _, W, A]), D7.useEffect(() => {
        return () => {
            P.cleanup()
        }
    }, [P]);

    function m() {
        switch (_.state) {
            case "idle":
                return D7.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1,
                    marginTop: 1
                }, D7.default.createElement(V, {
                    bold: !0
                }, q ? q : "Claude Code can be used with your Claude subscription or billed based on API usage through your Console account."), D7.default.createElement(V, null, "Select login method:"), D7.default.createElement(I, null, D7.default.createElement(kA, {
                    options: [{
                        label: D7.default.createElement(V, null, "Claude account with subscription ·", " ", D7.default.createElement(V, {
                            dimColor: !0
                        }, "Pro, Max, Team, or Enterprise"), `
`),
                        value: "claudeai"
                    }, {
                        label: D7.default.createElement(V, null, "Anthropic Console account ·", " ", D7.default.createElement(V, {
                            dimColor: !0
                        }, "API usage billing"), `
`),
                        value: "console"
                    }, {
                        label: D7.default.createElement(V, null, "3rd-party platform ·", " ", D7.default.createElement(V, {
                            dimColor: !0
                        }, "Amazon Bedrock, Microsoft Foundry, or Vertex AI"), `
`),
                        value: "platform"
                    }],
                    onCancel: () => {},
                    onChange: (b) => {
                        if (b === "platform") c("tengu_oauth_platform_selected", {}), J({
                            state: "platform_setup"
                        });
                        else if (J({
                                state: "ready_to_start"
                            }), b === "claudeai") c("tengu_oauth_claudeai_selected", {}), G(!0);
                        else c("tengu_oauth_console_selected", {}), G(!1)
                    }
                })));
            case "platform_setup":
                return D7.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1,
                    marginTop: 1
                }, D7.default.createElement(V, {
                    bold: !0
                }, "Using 3rd-party platforms"), D7.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, D7.default.createElement(V, null, "Claude Code supports Amazon Bedrock, Microsoft Foundry, and Vertex AI. Set the required environment variables, then restart Claude Code."), D7.default.createElement(V, null, "If you are part of an enterprise organization, contact your administrator for setup instructions."), D7.default.createElement(I, {
                    flexDirection: "column",
                    marginTop: 1
                }, D7.default.createElement(V, {
                    bold: !0
                }, "Documentation:"), D7.default.createElement(V, null, "· Amazon Bedrock:", " ", D7.default.createElement(d7, {
                    url: "https://code.claude.com/docs/en/amazon-bedrock"
                }, "https://code.claude.com/docs/en/amazon-bedrock")), D7.default.createElement(V, null, "· Microsoft Foundry:", " ", D7.default.createElement(d7, {
                    url: "https://code.claude.com/docs/en/microsoft-foundry"
                }, "https://code.claude.com/docs/en/microsoft-foundry")), D7.default.createElement(V, null, "· Vertex AI:", " ", D7.default.createElement(d7, {
                    url: "https://code.claude.com/docs/en/google-vertex-ai"
                }, "https://code.claude.com/docs/en/google-vertex-ai"))), D7.default.createElement(I, {
                    marginTop: 1
                }, D7.default.createElement(V, {
                    dimColor: !0
                }, "Press ", D7.default.createElement(V, {
                    bold: !0
                }, "Enter"), " to go back to login options."))));
            case "waiting_for_login":
                return D7.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, $ && D7.default.createElement(I, null, D7.default.createElement(V, {
                    dimColor: !0
                }, $)), !f && D7.default.createElement(I, null, D7.default.createElement(c4, null), D7.default.createElement(V, null, "Opening browser to sign in…")), f && D7.default.createElement(I, null, D7.default.createElement(V, null, lC4), D7.default.createElement(k3, {
                    value: X,
                    onChange: D,
                    onSubmit: (b) => y(b, _.url),
                    cursorOffset: j,
                    onChangeCursorOffset: M,
                    columns: k
                })));
            case "creating_api_key":
                return D7.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, D7.default.createElement(I, null, D7.default.createElement(c4, null), D7.default.createElement(V, null, "Creating API key for Claude Code…")));
            case "about_to_retry":
                return D7.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, D7.default.createElement(V, {
                    color: "permission"
                }, "Retrying…"));
            case "success":
                return D7.default.createElement(I, {
                    flexDirection: "column"
                }, K === "setup-token" && _.token ? null : D7.default.createElement(D7.default.Fragment, null, u3()?.emailAddress ? D7.default.createElement(V, {
                    dimColor: !0
                }, "Logged in as", " ", D7.default.createElement(V, null, u3()?.emailAddress)) : null, D7.default.createElement(V, {
                    color: "success"
                }, "Login successful. Press ", D7.default.createElement(V, {
                    bold: !0
                }, "Enter"), " to continue…")));
            case "error":
                return D7.default.createElement(I, {
                    flexDirection: "column",
                    gap: 1
                }, D7.default.createElement(V, {
                    color: "error"
                }, "OAuth error: ", _.message), _.toRetry && D7.default.createElement(I, {
                    marginTop: 1
                }, D7.default.createElement(V, {
                    color: "permission"
                }, "Press ", D7.default.createElement(V, {
                    bold: !0
                }, "Enter"), " to retry.")));
            default:
                return null
        }
    }
    return D7.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, _.state === "waiting_for_login" && f && D7.default.createElement(I, {
        flexDirection: "column",
        key: "urlToCopy",
        gap: 1,
        paddingBottom: 1
    }, D7.default.createElement(I, {
        paddingX: 1
    }, D7.default.createElement(V, {
        dimColor: !0
    }, "Browser didn't open? Use the url below to sign in", " "), N ? D7.default.createElement(V, {
        color: "success"
    }, "(Copied!)") : D7.default.createElement(V, {
        dimColor: !0
    }, D7.default.createElement(YA, {
        shortcut: "c",
        action: "copy",
        parens: !0
    }))), D7.default.createElement(d7, {
        url: _.url
    }, D7.default.createElement(V, {
        dimColor: !0
    }, _.url))), K === "setup-token" && _.state === "success" && _.token && D7.default.createElement(I, {
        key: "tokenOutput",
        flexDirection: "column",
        gap: 1,
        paddingTop: 1
    }, D7.default.createElement(V, {
        color: "success"
    }, "✓ Long-lived authentication token created successfully!"), D7.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, D7.default.createElement(V, null, "Your OAuth token (valid for 1 year):"), D7.default.createElement(V, {
        color: "warning"
    }, _.token), D7.default.createElement(V, {
        dimColor: !0
    }, "Store this token securely. You won't be able to see it again."), D7.default.createElement(V, {
        dimColor: !0
    }, "Use this token by setting: export CLAUDE_CODE_OAUTH_TOKEN=<token>"))), D7.default.createElement(I, {
        paddingLeft: 1,
        flexDirection: "column",
        gap: 1
    }, m()))
}
// @from(Ln 313093, Col 4)
D7
// @from(Ln 313093, Col 8)
lC4 = "Paste code here if prompted > "
// @from(Ln 313094, Col 4)
sF1 = v(() => {
    m1();
    K7();
    OB();
    wK();
    gO();
    wTA();
    Pk();
    J7();
    u6();
    mq();
    y6();
    x2();
    aF1();
    $q1();
    U5();
    Pj6();
    p8();
    e7();
    cC4();
    D7 = o(X1(), 1)
})
// @from(Ln 313117, Col 0)
function is() {
    let A = v6((K) => K.mainLoopModel),
        q = v6((K) => K.mainLoopModelForSession);
    return nC4.useMemo(() => {
        return t9(q ?? A ?? u_1())
    }, [q, A])
}
// @from(Ln 313124, Col 4)
nC4
// @from(Ln 313125, Col 4)
tF1 = v(() => {
    e7();
    d8();
    nC4 = o(X1(), 1)
})
// @from(Ln 313130, Col 4)
oC4 = R((rC4) => {
    Object.defineProperty(rC4, "__esModule", {
        value: !0
    })
})
// @from(Ln 313135, Col 4)
sC4 = R((aC4) => {
    Object.defineProperty(aC4, "__esModule", {
        value: !0
    })
})
// @from(Ln 313140, Col 4)
dTA = R((tC4) => {
    Object.defineProperty(tC4, "__esModule", {
        value: !0
    })
})
// @from(Ln 313145, Col 4)
cTA = R((MPY) => {
    function jPY(A, q, K) {
        q.split && (q = q.split("."));
        var Y = 0,
            z = q.length,
            w = A,
            H, $;
        while (Y < z) {
            if ($ = "" + q[Y++], $ === "__proto__" || $ === "constructor" || $ === "prototype") break;
            w = w[$] = Y === z ? K : typeof(H = w[$]) === typeof q ? H : q[Y] * 0 !== 0 || !!~("" + q[Y]).indexOf(".") ? {} : []
        }
    }
    MPY.dset = jPY
})
// @from(Ln 313159, Col 4)
qS4 = R((eC4) => {
    Object.defineProperty(eC4, "__esModule", {
        value: !0
    });
    eC4.pickBy = void 0;
    var WPY = function(A, q) {
        return Object.keys(A).filter(function(K) {
            return q(K, A[K])
        }).reduce(function(K, Y) {
            return K[Y] = A[Y], K
        }, {})
    };
    eC4.pickBy = WPY
})
// @from(Ln 313173, Col 4)
lTA = R((KS4) => {
    Object.defineProperty(KS4, "__esModule", {
        value: !0
    });
    KS4.ValidationError = void 0;
    var GPY = n2(),
        ZPY = function(A) {
            GPY.__extends(q, A);

            function q(K, Y) {
                var z = A.call(this, "".concat(K, " ").concat(Y)) || this;
                return z.field = K, z
            }
            return q
        }(Error);
    KS4.ValidationError = ZPY
})
// @from(Ln 313190, Col 4)
iTA = R((zS4) => {
    Object.defineProperty(zS4, "__esModule", {
        value: !0
    });
    zS4.isPlainObject = zS4.exists = zS4.isFunction = zS4.isNumber = zS4.isString = void 0;

    function fPY(A) {
        return typeof A === "string"
    }
    zS4.isString = fPY;

    function VPY(A) {
        return typeof A === "number"
    }
    zS4.isNumber = VPY;

    function NPY(A) {
        return typeof A === "function"
    }
    zS4.isFunction = NPY;

    function TPY(A) {
        return A !== void 0 && A !== null
    }
    zS4.exists = TPY;

    function vPY(A) {
        return Object.prototype.toString.call(A).slice(8, -1).toLowerCase() === "object"
    }
    zS4.isPlainObject = vPY
})
// @from(Ln 313221, Col 4)
oTA = R((jS4) => {
    Object.defineProperty(jS4, "__esModule", {
        value: !0
    });
    jS4.validateEvent = jS4.assertTraits = jS4.assertTrackEventProperties = jS4.assertTrackEventName = jS4.assertEventType = jS4.assertEventExists = jS4.assertUserIdentity = void 0;
    var ns = lTA(),
        o31 = iTA(),
        nTA = "is not a string",
        rTA = "is not an object",
        HS4 = "is nil";

    function $S4(A) {
        var q = ".userId/anonymousId/previousId/groupId",
            K = function(z) {
                var w, H, $;
                return ($ = (H = (w = z.userId) !== null && w !== void 0 ? w : z.anonymousId) !== null && H !== void 0 ? H : z.groupId) !== null && $ !== void 0 ? $ : z.previousId
            },
            Y = K(A);
        if (!(0, o31.exists)(Y)) throw new ns.ValidationError(q, HS4);
        else if (!(0, o31.isString)(Y)) throw new ns.ValidationError(q, nTA)
    }
    jS4.assertUserIdentity = $S4;

    function OS4(A) {
        if (!(0, o31.exists)(A)) throw new ns.ValidationError("Event", HS4);
        if (typeof A !== "object") throw new ns.ValidationError("Event", rTA)
    }
    jS4.assertEventExists = OS4;

    function _S4(A) {
        if (!(0, o31.isString)(A.type)) throw new ns.ValidationError(".type", nTA)
    }
    jS4.assertEventType = _S4;

    function JS4(A) {
        if (!(0, o31.isString)(A.event)) throw new ns.ValidationError(".event", nTA)
    }
    jS4.assertTrackEventName = JS4;

    function XS4(A) {
        if (!(0, o31.isPlainObject)(A.properties)) throw new ns.ValidationError(".properties", rTA)
    }
    jS4.assertTrackEventProperties = XS4;

    function DS4(A) {
        if (!(0, o31.isPlainObject)(A.traits)) throw new ns.ValidationError(".traits", rTA)
    }
    jS4.assertTraits = DS4;

    function yPY(A) {
        if (OS4(A), _S4(A), A.type === "track") JS4(A), XS4(A);
        if (["group", "identify"].includes(A.type)) DS4(A);
        $S4(A)
    }
    jS4.validateEvent = yPY
})
// @from(Ln 313277, Col 4)
GS4 = R((aTA) => {
    Object.defineProperty(aTA, "__esModule", {
        value: !0
    });
    aTA.EventFactory = void 0;
    var Z9 = n2();
    Z9.__exportStar(dTA(), aTA);
    var PS4 = cTA(),
        uPY = qS4(),
        BPY = oTA(),
        mPY = function() {
            function A(q) {
                this.user = q.user, this.createMessageId = q.createMessageId
            }
            return A.prototype.track = function(q, K, Y, z) {
                return this.normalize(Z9.__assign(Z9.__assign({}, this.baseEvent()), {
                    event: q,
                    type: "track",
                    properties: K !== null && K !== void 0 ? K : {},
                    options: Z9.__assign({}, Y),
                    integrations: Z9.__assign({}, z)
                }))
            }, A.prototype.page = function(q, K, Y, z, w) {
                var H, $ = {
                    type: "page",
                    properties: Z9.__assign({}, Y),
                    options: Z9.__assign({}, z),
                    integrations: Z9.__assign({}, w)
                };
                if (q !== null) $.category = q, $.properties = (H = $.properties) !== null && H !== void 0 ? H : {}, $.properties.category = q;
                if (K !== null) $.name = K;
                return this.normalize(Z9.__assign(Z9.__assign({}, this.baseEvent()), $))
            }, A.prototype.screen = function(q, K, Y, z, w) {
                var H = {
                    type: "screen",
                    properties: Z9.__assign({}, Y),
                    options: Z9.__assign({}, z),
                    integrations: Z9.__assign({}, w)
                };
                if (q !== null) H.category = q;
                if (K !== null) H.name = K;
                return this.normalize(Z9.__assign(Z9.__assign({}, this.baseEvent()), H))
            }, A.prototype.identify = function(q, K, Y, z) {
                return this.normalize(Z9.__assign(Z9.__assign({}, this.baseEvent()), {
                    type: "identify",
                    userId: q,
                    traits: K !== null && K !== void 0 ? K : {},
                    options: Z9.__assign({}, Y),
                    integrations: z
                }))
            }, A.prototype.group = function(q, K, Y, z) {
                return this.normalize(Z9.__assign(Z9.__assign({}, this.baseEvent()), {
                    type: "group",
                    traits: K !== null && K !== void 0 ? K : {},
                    options: Z9.__assign({}, Y),
                    integrations: Z9.__assign({}, z),
                    groupId: q
                }))
            }, A.prototype.alias = function(q, K, Y, z) {
                var w = {
                    userId: q,
                    type: "alias",
                    options: Z9.__assign({}, Y),
                    integrations: Z9.__assign({}, z)
                };
                if (K !== null) w.previousId = K;
                if (q === void 0) return this.normalize(Z9.__assign(Z9.__assign({}, w), this.baseEvent()));
                return this.normalize(Z9.__assign(Z9.__assign({}, this.baseEvent()), w))
            }, A.prototype.baseEvent = function() {
                var q = {
                    integrations: {},
                    options: {}
                };
                if (!this.user) return q;
                var K = this.user;
                if (K.id()) q.userId = K.id();
                if (K.anonymousId()) q.anonymousId = K.anonymousId();
                return q
            }, A.prototype.context = function(q) {
                var K, Y = ["userId", "anonymousId", "timestamp"];
                delete q.integrations;
                var z = Object.keys(q),
                    w = (K = q.context) !== null && K !== void 0 ? K : {},
                    H = {};
                return z.forEach(function($) {
                    if ($ === "context") return;
                    if (Y.includes($))(0, PS4.dset)(H, $, q[$]);
                    else(0, PS4.dset)(w, $, q[$])
                }), [w, H]
            }, A.prototype.normalize = function(q) {
                var K, Y, z = Object.keys((K = q.integrations) !== null && K !== void 0 ? K : {}).reduce(function(j, M) {
                    var P, W;
                    return Z9.__assign(Z9.__assign({}, j), (P = {}, P[M] = Boolean((W = q.integrations) === null || W === void 0 ? void 0 : W[M]), P))
                }, {});
                q.options = (0, uPY.pickBy)(q.options || {}, function(j, M) {
                    return M !== void 0
                });
                var w = Z9.__assign(Z9.__assign({}, z), (Y = q.options) === null || Y === void 0 ? void 0 : Y.integrations),
                    H = q.options ? this.context(q.options) : [],
                    $ = H[0],
                    O = H[1],
                    _ = q.options,
                    J = Z9.__rest(q, ["options"]),
                    X = Z9.__assign(Z9.__assign(Z9.__assign({
                        timestamp: new Date
                    }, J), {
                        integrations: w,
                        context: $
                    }), O),
                    D = Z9.__assign(Z9.__assign({}, X), {
                        messageId: this.createMessageId()
                    });
                return (0, BPY.validateEvent)(D), D
            }, A
        }();
    aTA.EventFactory = mPY
})
// @from(Ln 313394, Col 4)
sTA = R((VS4) => {
    Object.defineProperty(VS4, "__esModule", {
        value: !0
    });
    VS4.invokeCallback = VS4.sleep = VS4.pTimeout = void 0;

    function ZS4(A, q) {
        return new Promise(function(K, Y) {
            var z = setTimeout(function() {
                Y(Error("Promise timed out"))
            }, q);
            A.then(function(w) {
                return clearTimeout(z), K(w)
            }).catch(Y)
        })
    }
    VS4.pTimeout = ZS4;

    function fS4(A) {
        return new Promise(function(q) {
            return setTimeout(q, A)
        })
    }
    VS4.sleep = fS4;

    function FPY(A, q, K) {
        var Y = function() {
            try {
                return Promise.resolve(q(A))
            } catch (z) {
                return Promise.reject(z)
            }
        };
        return fS4(K).then(function() {
            return ZS4(Y(), 1000)
        }).catch(function(z) {
            A === null || A === void 0 || A.log("warn", "Callback Error", {
                error: z
            }), A === null || A === void 0 || A.stats.increment("callback_error")
        }).then(function() {
            return A
        })
    }
    VS4.invokeCallback = FPY
})
// @from(Ln 313439, Col 4)
ES4 = R((TS4) => {
    Object.defineProperty(TS4, "__esModule", {
        value: !0
    });
    TS4.createDeferred = void 0;
    var UPY = function() {
        var A, q, K = new Promise(function(Y, z) {
            A = Y, q = z
        });
        return {
            resolve: A,
            reject: q,
            promise: K
        }
    };
    TS4.createDeferred = UPY
})
// @from(Ln 313456, Col 4)
kS4 = R((tTA) => {
    Object.defineProperty(tTA, "__esModule", {
        value: !0
    });
    var pPY = n2();
    pPY.__exportStar(ES4(), tTA)
})
// @from(Ln 313463, Col 4)
yS4 = R((LS4) => {
    Object.defineProperty(LS4, "__esModule", {
        value: !0
    });
    LS4.Emitter = void 0;
    var dPY = function() {
        function A(q) {
            var K;
            this.callbacks = {}, this.warned = !1, this.maxListeners = (K = q === null || q === void 0 ? void 0 : q.maxListeners) !== null && K !== void 0 ? K : 10
        }
        return A.prototype.warnIfPossibleMemoryLeak = function(q) {
            if (this.warned) return;
            if (this.maxListeners && this.callbacks[q].length > this.maxListeners) console.warn("Event Emitter: Possible memory leak detected; ".concat(String(q), " has exceeded ").concat(this.maxListeners, " listeners.")), this.warned = !0
        }, A.prototype.on = function(q, K) {
            if (!this.callbacks[q]) this.callbacks[q] = [K];
            else this.callbacks[q].push(K), this.warnIfPossibleMemoryLeak(q);
            return this
        }, A.prototype.once = function(q, K) {
            var Y = this,
                z = function() {
                    var w = [];
                    for (var H = 0; H < arguments.length; H++) w[H] = arguments[H];
                    Y.off(q, z), K.apply(Y, w)
                };
            return this.on(q, z), this
        }, A.prototype.off = function(q, K) {
            var Y, z = (Y = this.callbacks[q]) !== null && Y !== void 0 ? Y : [],
                w = z.filter(function(H) {
                    return H !== K
                });
            return this.callbacks[q] = w, this
        }, A.prototype.emit = function(q) {
            var K = this,
                Y, z = [];
            for (var w = 1; w < arguments.length; w++) z[w - 1] = arguments[w];
            var H = (Y = this.callbacks[q]) !== null && Y !== void 0 ? Y : [];
            return H.forEach(function($) {
                $.apply(K, z)
            }), this
        }, A
    }();
    LS4.Emitter = dPY
})
// @from(Ln 313506, Col 4)
CS4 = R((eTA) => {
    Object.defineProperty(eTA, "__esModule", {
        value: !0
    });
    var cPY = n2();
    cPY.__exportStar(yS4(), eTA)
})
// @from(Ln 313513, Col 4)
FP1 = R((qM6) => {
    Object.defineProperty(qM6, "__esModule", {
        value: !0
    });
    var SS4 = n2();
    SS4.__exportStar(kS4(), qM6);
    SS4.__exportStar(CS4(), qM6)
})
// @from(Ln 313521, Col 4)
AvA = R((hS4) => {
    Object.defineProperty(hS4, "__esModule", {
        value: !0
    });
    hS4.backoff = void 0;

    function lPY(A) {
        var q = Math.random() + 1,
            K = A.minTimeout,
            Y = K === void 0 ? 500 : K,
            z = A.factor,
            w = z === void 0 ? 2 : z,
            H = A.attempt,
            $ = A.maxTimeout,
            O = $ === void 0 ? 1 / 0 : $;
        return Math.min(q * Y * Math.pow(w, H), O)
    }
    hS4.backoff = lPY
})
// @from(Ln 313540, Col 4)
qvA = R((xS4) => {
    Object.defineProperty(xS4, "__esModule", {
        value: !0
    });
    xS4.PriorityQueue = xS4.ON_REMOVE_FROM_FUTURE = void 0;
    var iPY = n2(),
        nPY = FP1(),
        rPY = AvA();
    xS4.ON_REMOVE_FROM_FUTURE = "onRemoveFromFuture";
    var oPY = function(A) {
        iPY.__extends(q, A);

        function q(K, Y, z) {
            var w = A.call(this) || this;
            return w.future = [], w.maxAttempts = K, w.queue = Y, w.seen = z !== null && z !== void 0 ? z : {}, w
        }
        return q.prototype.push = function() {
            var K = this,
                Y = [];
            for (var z = 0; z < arguments.length; z++) Y[z] = arguments[z];
            var w = Y.map(function(H) {
                var $ = K.updateAttempts(H);
                if ($ > K.maxAttempts || K.includes(H)) return !1;
                return K.queue.push(H), !0
            });
            return this.queue = this.queue.sort(function(H, $) {
                return K.getAttempts(H) - K.getAttempts($)
            }), w
        }, q.prototype.pushWithBackoff = function(K) {
            var Y = this;
            if (this.getAttempts(K) === 0) return this.push(K)[0];
            var z = this.updateAttempts(K);
            if (z > this.maxAttempts || this.includes(K)) return !1;
            var w = (0, rPY.backoff)({
                attempt: z - 1
            });
            return setTimeout(function() {
                Y.queue.push(K), Y.future = Y.future.filter(function(H) {
                    return H.id !== K.id
                }), Y.emit(xS4.ON_REMOVE_FROM_FUTURE)
            }, w), this.future.push(K), !0
        }, q.prototype.getAttempts = function(K) {
            var Y;
            return (Y = this.seen[K.id]) !== null && Y !== void 0 ? Y : 0
        }, q.prototype.updateAttempts = function(K) {
            return this.seen[K.id] = this.getAttempts(K) + 1, this.getAttempts(K)
        }, q.prototype.includes = function(K) {
            return this.queue.includes(K) || this.future.includes(K) || Boolean(this.queue.find(function(Y) {
                return Y.id === K.id
            })) || Boolean(this.future.find(function(Y) {
                return Y.id === K.id
            }))
        }, q.prototype.pop = function() {
            return this.queue.shift()
        }, Object.defineProperty(q.prototype, "length", {
            get: function() {
                return this.queue.length
            },
            enumerable: !1,
            configurable: !0
        }), Object.defineProperty(q.prototype, "todo", {
            get: function() {
                return this.queue.length + this.future.length
            },
            enumerable: !1,
            configurable: !0
        }), q
    }(nPY.Emitter);
    xS4.PriorityQueue = oPY
})
// @from(Ln 313610, Col 4)
KvA = R((sPY) => {
    var a31 = 256,
        YM6 = [],
        KM6;
    while (a31--) YM6[a31] = (a31 + 256).toString(16).substring(1);

    function aPY() {
        var A = 0,
            q, K = "";
        if (!KM6 || a31 + 16 > 256) {
            KM6 = Array(A = 256);
            while (A--) KM6[A] = 256 * Math.random() | 0;
            A = a31 = 0
        }
        for (; A < 16; A++) {
            if (q = KM6[a31 + A], A == 6) K += YM6[q & 15 | 64];
            else if (A == 8) K += YM6[q & 63 | 128];
            else K += YM6[q];
            if (A & 1 && A > 1 && A < 11) K += "-"
        }
        return a31++, K
    }
    sPY.v4 = aPY
})
// @from(Ln 313634, Col 4)
YvA = R((BS4) => {
    Object.defineProperty(BS4, "__esModule", {
        value: !0
    });
    BS4.CoreLogger = void 0;
    var zM6 = n2(),
        ePY = function() {
            function A() {
                this._logs = []
            }
            return A.prototype.log = function(q, K, Y) {
                var z = new Date;
                this._logs.push({
                    level: q,
                    message: K,
                    time: z,
                    extras: Y
                })
            }, Object.defineProperty(A.prototype, "logs", {
                get: function() {
                    return this._logs
                },
                enumerable: !1,
                configurable: !0
            }), A.prototype.flush = function() {
                if (this.logs.length > 1) {
                    var q = this._logs.reduce(function(K, Y) {
                        var z, w, H, $ = zM6.__assign(zM6.__assign({}, Y), {
                            json: JSON.stringify(Y.extras, null, " "),
                            extras: Y.extras
                        });
                        delete $.time;
                        var O = (H = (w = Y.time) === null || w === void 0 ? void 0 : w.toISOString()) !== null && H !== void 0 ? H : "";
                        if (K[O]) O = "".concat(O, "-").concat(Math.random());
                        return zM6.__assign(zM6.__assign({}, K), (z = {}, z[O] = $, z))
                    }, {});
                    if (console.table) console.table(q);
                    else console.log(q)
                } else this.logs.forEach(function(K) {
                    var {
                        level: Y,
                        message: z,
                        extras: w
                    } = K;
                    if (Y === "info" || Y === "debug") console.log(z, w !== null && w !== void 0 ? w : "");
                    else console[Y](z, w !== null && w !== void 0 ? w : "")
                });
                this._logs = []
            }, A
        }();
    BS4.CoreLogger = ePY
})
// @from(Ln 313686, Col 4)
wvA = R((QS4) => {
    Object.defineProperty(QS4, "__esModule", {
        value: !0
    });
    QS4.NullStats = QS4.CoreStats = void 0;
    var zvA = n2(),
        AWY = function(A) {
            var q = {
                gauge: "g",
                counter: "c"
            };
            return q[A]
        },
        FS4 = function() {
            function A() {
                this.metrics = []
            }
            return A.prototype.increment = function(q, K, Y) {
                if (K === void 0) K = 1;
                this.metrics.push({
                    metric: q,
                    value: K,
                    tags: Y !== null && Y !== void 0 ? Y : [],
                    type: "counter",
                    timestamp: Date.now()
                })
            }, A.prototype.gauge = function(q, K, Y) {
                this.metrics.push({
                    metric: q,
                    value: K,
                    tags: Y !== null && Y !== void 0 ? Y : [],
                    type: "gauge",
                    timestamp: Date.now()
                })
            }, A.prototype.flush = function() {
                var q = this.metrics.map(function(K) {
                    return zvA.__assign(zvA.__assign({}, K), {
                        tags: K.tags.join(",")
                    })
                });
                if (console.table) console.table(q);
                else console.log(q);
                this.metrics = []
            }, A.prototype.serialize = function() {
                return this.metrics.map(function(q) {
                    return {
                        m: q.metric,
                        v: q.value,
                        t: q.tags,
                        k: AWY(q.type),
                        e: q.timestamp
                    }
                })
            }, A
        }();
    QS4.CoreStats = FS4;
    var qWY = function(A) {
        zvA.__extends(q, A);

        function q() {
            return A !== null && A.apply(this, arguments) || this
        }
        return q.prototype.gauge = function() {
            var K = [];
            for (var Y = 0; Y < arguments.length; Y++) K[Y] = arguments[Y]
        }, q.prototype.increment = function() {
            var K = [];
            for (var Y = 0; Y < arguments.length; Y++) K[Y] = arguments[Y]
        }, q.prototype.flush = function() {
            var K = [];
            for (var Y = 0; Y < arguments.length; Y++) K[Y] = arguments[Y]
        }, q.prototype.serialize = function() {
            var K = [];
            for (var Y = 0; Y < arguments.length; Y++) K[Y] = arguments[Y];
            return []
        }, q
    }(FS4);
    QS4.NullStats = qWY
})
// @from(Ln 313765, Col 4)
wM6 = R((pS4) => {
    Object.defineProperty(pS4, "__esModule", {
        value: !0
    });
    pS4.CoreContext = pS4.ContextCancelation = void 0;
    var YWY = KvA(),
        zWY = cTA(),
        wWY = YvA(),
        HWY = wvA(),
        US4 = function() {
            function A(q) {
                var K, Y, z;
                this.retry = (K = q.retry) !== null && K !== void 0 ? K : !0, this.type = (Y = q.type) !== null && Y !== void 0 ? Y : "plugin Error", this.reason = (z = q.reason) !== null && z !== void 0 ? z : ""
            }
            return A
        }();
    pS4.ContextCancelation = US4;
    var $WY = function() {
        function A(q, K, Y, z) {
            if (K === void 0) K = (0, YWY.v4)();
            if (Y === void 0) Y = new HWY.NullStats;
            if (z === void 0) z = new wWY.CoreLogger;
            this.attempts = 0, this.event = q, this._id = K, this.logger = z, this.stats = Y
        }
        return A.system = function() {}, A.prototype.isSame = function(q) {
            return q.id === this.id
        }, A.prototype.cancel = function(q) {
            if (q) throw q;
            throw new US4({
                reason: "Context Cancel"
            })
        }, A.prototype.log = function(q, K, Y) {
            this.logger.log(q, K, Y)
        }, Object.defineProperty(A.prototype, "id", {
            get: function() {
                return this._id
            },
            enumerable: !1,
            configurable: !0
        }), A.prototype.updateEvent = function(q, K) {
            var Y;
            if (q.split(".")[0] === "integrations") {
                var z = q.split(".")[1];
                if (((Y = this.event.integrations) === null || Y === void 0 ? void 0 : Y[z]) === !1) return this.event
            }
            return (0, zWY.dset)(this.event, q, K), this.event
        }, A.prototype.failedDelivery = function() {
            return this._failedDelivery
        }, A.prototype.setFailedDelivery = function(q) {
            this._failedDelivery = q
        }, A.prototype.logs = function() {
            return this.logger.logs
        }, A.prototype.flush = function() {
            this.logger.flush(), this.stats.flush()
        }, A.prototype.toJSON = function() {
            return {
                id: this._id,
                event: this.event,
                logs: this.logger.logs,
                metrics: this.stats.metrics
            }
        }, A
    }();
    pS4.CoreContext = $WY
})
// @from(Ln 313830, Col 4)
nS4 = R((lS4) => {
    Object.defineProperty(lS4, "__esModule", {
        value: !0
    });
    lS4.groupBy = void 0;
    var cS4 = n2();

    function _WY(A, q) {
        var K = {};
        return A.forEach(function(Y) {
            var z, w = void 0;
            if (typeof q === "string") {
                var H = Y[q];
                w = typeof H !== "string" ? JSON.stringify(H) : H
            } else if (q instanceof Function) w = q(Y);
            if (w === void 0) return;
            K[w] = cS4.__spreadArray(cS4.__spreadArray([], (z = K[w]) !== null && z !== void 0 ? z : [], !0), [Y], !1)
        }), K
    }
    lS4.groupBy = _WY
})
// @from(Ln 313851, Col 4)
aS4 = R((rS4) => {
    Object.defineProperty(rS4, "__esModule", {
        value: !0
    });
    rS4.isThenable = void 0;
    var JWY = function(A) {
        return typeof A === "object" && A !== null && "then" in A && typeof A.then === "function"
    };
    rS4.isThenable = JWY
})
// @from(Ln 313861, Col 4)
eS4 = R((sS4) => {
    Object.defineProperty(sS4, "__esModule", {
        value: !0
    });
    sS4.createTaskGroup = void 0;
    var XWY = aS4(),
        DWY = function() {
            var A, q, K = 0;
            return {
                done: function() {
                    return A
                },
                run: function(Y) {
                    var z = Y();
                    if ((0, XWY.isThenable)(z)) {
                        if (++K === 1) A = new Promise(function(w) {
                            return q = w
                        });
                        z.finally(function() {
                            return --K === 0 && q()
                        })
                    }
                    return z
                }
            }
        };
    sS4.createTaskGroup = DWY
})
// @from(Ln 313889, Col 4)
$vA = R((Kh4) => {
    Object.defineProperty(Kh4, "__esModule", {
        value: !0
    });
    Kh4.ensure = Kh4.attempt = void 0;
    var Ah4 = n2(),
        HvA = wM6();

    function jWY(A) {
        return Ah4.__awaiter(this, void 0, void 0, function() {
            var q;
            return Ah4.__generator(this, function(K) {
                switch (K.label) {
                    case 0:
                        return K.trys.push([0, 2, , 3]), [4, A()];
                    case 1:
                        return [2, K.sent()];
                    case 2:
                        return q = K.sent(), [2, Promise.reject(q)];
                    case 3:
                        return [2]
                }
            })
        })
    }

    function qh4(A, q) {
        A.log("debug", "plugin", {
            plugin: q.name
        });
        var K = new Date().getTime(),
            Y = q[A.event.type];
        if (Y === void 0) return Promise.resolve(A);
        var z = jWY(function() {
            return Y.apply(q, [A])
        }).then(function(w) {
            var H = new Date().getTime() - K;
            return w.stats.gauge("plugin_time", H, ["plugin:".concat(q.name)]), w
        }).catch(function(w) {
            if (w instanceof HvA.ContextCancelation && w.type === "middleware_cancellation") throw w;
            if (w instanceof HvA.ContextCancelation) return A.log("warn", w.type, {
                plugin: q.name,
                error: w
            }), w;
            return A.log("error", "plugin Error", {
                plugin: q.name,
                error: w
            }), A.stats.increment("plugin_error", 1, ["plugin:".concat(q.name)]), w
        });
        return z
    }
    Kh4.attempt = qh4;

    function MWY(A, q) {
        return qh4(A, q).then(function(K) {
            if (K instanceof HvA.CoreContext) return K;
            A.log("debug", "Context canceled"), A.stats.increment("context_canceled"), A.cancel(K)
        })
    }
    Kh4.ensure = MWY
})
// @from(Ln 313950, Col 4)
Hh4 = R((zh4) => {
    Object.defineProperty(zh4, "__esModule", {
        value: !0
    });
    zh4.CoreEventQueue = void 0;
    var KP = n2(),
        WWY = nS4(),
        GWY = qvA(),
        OvA = wM6(),
        ZWY = FP1(),
        fWY = eS4(),
        HM6 = $vA(),
        VWY = function(A) {
            KP.__extends(q, A);

            function q(K) {
                var Y = A.call(this) || this;
                return Y.criticalTasks = (0, fWY.createTaskGroup)(), Y.plugins = [], Y.failedInitializations = [], Y.flushing = !1, Y.queue = K, Y.queue.on(GWY.ON_REMOVE_FROM_FUTURE, function() {
                    Y.scheduleFlush(0)
                }), Y
            }
            return q.prototype.register = function(K, Y, z) {
                return KP.__awaiter(this, void 0, void 0, function() {
                    var w = this;
                    return KP.__generator(this, function(H) {
                        switch (H.label) {
                            case 0:
                                return [4, Promise.resolve(Y.load(K, z)).then(function() {
                                    w.plugins.push(Y)
                                }).catch(function($) {
                                    if (Y.type === "destination") {
                                        w.failedInitializations.push(Y.name), console.warn(Y.name, $), K.log("warn", "Failed to load destination", {
                                            plugin: Y.name,
                                            error: $
                                        });
                                        return
                                    }
                                    throw $
                                })];
                            case 1:
                                return H.sent(), [2]
                        }
                    })
                })
            }, q.prototype.deregister = function(K, Y, z) {
                return KP.__awaiter(this, void 0, void 0, function() {
                    var w;
                    return KP.__generator(this, function(H) {
                        switch (H.label) {
                            case 0:
                                if (H.trys.push([0, 3, , 4]), !Y.unload) return [3, 2];
                                return [4, Promise.resolve(Y.unload(K, z))];
                            case 1:
                                H.sent(), H.label = 2;
                            case 2:
                                return this.plugins = this.plugins.filter(function($) {
                                    return $.name !== Y.name
                                }), [3, 4];
                            case 3:
                                return w = H.sent(), K.log("warn", "Failed to unload destination", {
                                    plugin: Y.name,
                                    error: w
                                }), [3, 4];
                            case 4:
                                return [2]
                        }
                    })
                })
            }, q.prototype.dispatch = function(K) {
                return KP.__awaiter(this, void 0, void 0, function() {
                    var Y;
                    return KP.__generator(this, function(z) {
                        return K.log("debug", "Dispatching"), K.stats.increment("message_dispatched"), this.queue.push(K), Y = this.subscribeToDelivery(K), this.scheduleFlush(0), [2, Y]
                    })
                })
            }, q.prototype.subscribeToDelivery = function(K) {
                return KP.__awaiter(this, void 0, void 0, function() {
                    var Y = this;
                    return KP.__generator(this, function(z) {
                        return [2, new Promise(function(w) {
                            var H = function($, O) {
                                if ($.isSame(K))
                                    if (Y.off("flush", H), O) w($);
                                    else w($)
                            };
                            Y.on("flush", H)
                        })]
                    })
                })
            }, q.prototype.dispatchSingle = function(K) {
                return KP.__awaiter(this, void 0, void 0, function() {
                    var Y = this;
                    return KP.__generator(this, function(z) {
                        return K.log("debug", "Dispatching"), K.stats.increment("message_dispatched"), this.queue.updateAttempts(K), K.attempts = 1, [2, this.deliver(K).catch(function(w) {
                            var H = Y.enqueuRetry(w, K);
                            if (!H) return K.setFailedDelivery({
                                reason: w
                            }), K;
                            return Y.subscribeToDelivery(K)
                        })]
                    })
                })
            }, q.prototype.isEmpty = function() {
                return this.queue.length === 0
            }, q.prototype.scheduleFlush = function(K) {
                var Y = this;
                if (K === void 0) K = 500;
                if (this.flushing) return;
                this.flushing = !0, setTimeout(function() {
                    Y.flush().then(function() {
                        setTimeout(function() {
                            if (Y.flushing = !1, Y.queue.length) Y.scheduleFlush(0)
                        }, 0)
                    })
                }, K)
            }, q.prototype.deliver = function(K) {
                return KP.__awaiter(this, void 0, void 0, function() {
                    var Y, z, w, H;
                    return KP.__generator(this, function($) {
                        switch ($.label) {
                            case 0:
                                return [4, this.criticalTasks.done()];
                            case 1:
                                $.sent(), Y = Date.now(), $.label = 2;
                            case 2:
                                return $.trys.push([2, 4, , 5]), [4, this.flushOne(K)];
                            case 3:
                                return K = $.sent(), z = Date.now() - Y, this.emit("delivery_success", K), K.stats.gauge("delivered", z), K.log("debug", "Delivered", K.event), [2, K];
                            case 4:
                                throw w = $.sent(), H = w, K.log("error", "Failed to deliver", H), this.emit("delivery_failure", K, H), K.stats.increment("delivery_failed"), w;
                            case 5:
                                return [2]
                        }
                    })
                })
            }, q.prototype.enqueuRetry = function(K, Y) {
                var z = !(K instanceof OvA.ContextCancelation) || K.retry;
                if (!z) return !1;
                return this.queue.pushWithBackoff(Y)
            }, q.prototype.flush = function() {
                return KP.__awaiter(this, void 0, void 0, function() {
                    var K, Y, z;
                    return KP.__generator(this, function(w) {
                        switch (w.label) {
                            case 0:
                                if (this.queue.length === 0) return [2, []];
                                if (K = this.queue.pop(), !K) return [2, []];
                                K.attempts = this.queue.getAttempts(K), w.label = 1;
                            case 1:
                                return w.trys.push([1, 3, , 4]), [4, this.deliver(K)];
                            case 2:
                                return K = w.sent(), this.emit("flush", K, !0), [3, 4];
                            case 3:
                                if (Y = w.sent(), z = this.enqueuRetry(Y, K), !z) K.setFailedDelivery({
                                    reason: Y
                                }), this.emit("flush", K, !1);
                                return [2, []];
                            case 4:
                                return [2, [K]]
                        }
                    })
                })
            }, q.prototype.isReady = function() {
                return !0
            }, q.prototype.availableExtensions = function(K) {
                var Y = this.plugins.filter(function(j) {
                        var M, P, W;
                        if (j.type !== "destination" && j.name !== "Segment.io") return !0;
                        var G = void 0;
                        return (M = j.alternativeNames) === null || M === void 0 || M.forEach(function(f) {
                            if (K[f] !== void 0) G = K[f]
                        }), (W = (P = K[j.name]) !== null && P !== void 0 ? P : G) !== null && W !== void 0 ? W : (j.name === "Segment.io" ? !0 : K.All) !== !1
                    }),
                    z = (0, WWY.groupBy)(Y, "type"),
                    w = z.before,
                    H = w === void 0 ? [] : w,
                    $ = z.enrichment,
                    O = $ === void 0 ? [] : $,
                    _ = z.destination,
                    J = _ === void 0 ? [] : _,
                    X = z.after,
                    D = X === void 0 ? [] : X;
                return {
                    before: H,
                    enrichment: O,
                    destinations: J,
                    after: D
                }
            }, q.prototype.flushOne = function(K) {
                var Y, z;
                return KP.__awaiter(this, void 0, void 0, function() {
                    var w, H, $, O, _, J, M, X, D, j, M, P, W, G, f;
                    return KP.__generator(this, function(Z) {
                        switch (Z.label) {
                            case 0:
                                if (!this.isReady()) throw Error("Not ready");
                                if (K.attempts > 1) this.emit("delivery_retry", K);
                                w = this.availableExtensions((Y = K.event.integrations) !== null && Y !== void 0 ? Y : {}), H = w.before, $ = w.enrichment, O = 0, _ = H, Z.label = 1;
                            case 1:
                                if (!(O < _.length)) return [3, 4];
                                return J = _[O], [4, (0, HM6.ensure)(K, J)];
                            case 2:
                                if (M = Z.sent(), M instanceof OvA.CoreContext) K = M;
                                this.emit("message_enriched", K, J), Z.label = 3;
                            case 3:
                                return O++, [3, 1];
                            case 4:
                                X = 0, D = $, Z.label = 5;
                            case 5:
                                if (!(X < D.length)) return [3, 8];
                                return j = D[X], [4, (0, HM6.attempt)(K, j)];
                            case 6:
                                if (M = Z.sent(), M instanceof OvA.CoreContext) K = M;
                                this.emit("message_enriched", K, j), Z.label = 7;
                            case 7:
                                return X++, [3, 5];
                            case 8:
                                return P = this.availableExtensions((z = K.event.integrations) !== null && z !== void 0 ? z : {}), W = P.destinations, G = P.after, [4, new Promise(function(N, T) {
                                    setTimeout(function() {
                                        var k = W.map(function(y) {
                                            return (0, HM6.attempt)(K, y)
                                        });
                                        Promise.all(k).then(N).catch(T)
                                    }, 0)
                                })];
                            case 9:
                                return Z.sent(), K.stats.increment("message_delivered"), this.emit("message_delivered", K), f = G.map(function(N) {
                                    return (0, HM6.attempt)(K, N)
                                }), [4, Promise.all(f)];
                            case 10:
                                return Z.sent(), [2, K]
                        }
                    })
                })
            }, q
        }(ZWY.Emitter);
    zh4.CoreEventQueue = VWY
})
// @from(Ln 314188, Col 4)
Oh4 = R(($h4) => {
    Object.defineProperty($h4, "__esModule", {
        value: !0
    })
})
// @from(Ln 314193, Col 4)
jh4 = R((Jh4) => {
    Object.defineProperty(Jh4, "__esModule", {
        value: !0
    });
    Jh4.dispatch = Jh4.getDelay = void 0;
    var _h4 = n2(),
        NWY = sTA(),
        TWY = function(A, q) {
            var K = Date.now() - A;
            return Math.max((q !== null && q !== void 0 ? q : 300) - K, 0)
        };
    Jh4.getDelay = TWY;

    function vWY(A, q, K, Y) {
        return _h4.__awaiter(this, void 0, void 0, function() {
            var z, w;
            return _h4.__generator(this, function(H) {
                switch (H.label) {
                    case 0:
                        if (K.emit("dispatch_start", A), z = Date.now(), !q.isEmpty()) return [3, 2];
                        return [4, q.dispatchSingle(A)];
                    case 1:
                        return w = H.sent(), [3, 4];
                    case 2:
                        return [4, q.dispatch(A)];
                    case 3:
                        w = H.sent(), H.label = 4;
                    case 4:
                        if (!(Y === null || Y === void 0 ? void 0 : Y.callback)) return [3, 6];
                        return [4, (0, NWY.invokeCallback)(w, Y.callback, Jh4.getDelay(z, Y.timeout))];
                    case 5:
                        w = H.sent(), H.label = 6;
                    case 6:
                        if (Y === null || Y === void 0 ? void 0 : Y.debug) w.flush();
                        return [2, w]
                }
            })
        })
    }
    Jh4.dispatch = vWY
})
// @from(Ln 314234, Col 4)
Wh4 = R((Mh4) => {
    Object.defineProperty(Mh4, "__esModule", {
        value: !0
    });
    Mh4.bindAll = void 0;

    function EWY(A) {
        var q = A.constructor.prototype;
        for (var K = 0, Y = Object.getOwnPropertyNames(q); K < Y.length; K++) {
            var z = Y[K];
            if (z !== "constructor") {
                var w = Object.getOwnPropertyDescriptor(A.constructor.prototype, z);
                if (!!w && typeof w.value === "function") A[z] = A[z].bind(A)
            }
        }
        return A
    }
    Mh4.bindAll = EWY
})
// @from(Ln 314253, Col 4)
rs = R((nX) => {
    Object.defineProperty(nX, "__esModule", {
        value: !0
    });
    nX.CoreLogger = nX.backoff = void 0;
    var cW = n2();
    cW.__exportStar(oC4(), nX);
    cW.__exportStar(sC4(), nX);
    cW.__exportStar(dTA(), nX);
    cW.__exportStar(GS4(), nX);
    cW.__exportStar(sTA(), nX);
    cW.__exportStar(qvA(), nX);
    var kWY = AvA();
    Object.defineProperty(nX, "backoff", {
        enumerable: !0,
        get: function() {
            return kWY.backoff
        }
    });
    cW.__exportStar(wM6(), nX);
    cW.__exportStar(Hh4(), nX);
    cW.__exportStar(Oh4(), nX);
    cW.__exportStar(jh4(), nX);
    cW.__exportStar(iTA(), nX);
    cW.__exportStar(lTA(), nX);
    cW.__exportStar(oTA(), nX);
    cW.__exportStar(Wh4(), nX);
    cW.__exportStar(wvA(), nX);
    var LWY = YvA();
    Object.defineProperty(nX, "CoreLogger", {
        enumerable: !0,
        get: function() {
            return LWY.CoreLogger
        }
    });
    cW.__exportStar($vA(), nX)
})
// @from(Ln 314290, Col 4)
fh4 = R((Gh4) => {
    Object.defineProperty(Gh4, "__esModule", {
        value: !0
    });
    Gh4.validateSettings = void 0;
    var yWY = rs(),
        CWY = (A) => {
            if (!A.writeKey) throw new yWY.ValidationError("writeKey", "writeKey is missing.")
        };
    Gh4.validateSettings = CWY
})
// @from(Ln 314301, Col 4)
_vA = R((Vh4) => {
    Object.defineProperty(Vh4, "__esModule", {
        value: !0
    });
    Vh4.version = void 0;
    Vh4.version = "1.3.0"
})
// @from(Ln 314308, Col 4)
Eh4 = R((Th4) => {
    Object.defineProperty(Th4, "__esModule", {
        value: !0
    });
    Th4.tryCreateFormattedUrl = void 0;
    var SWY = (A) => A.replace(/\/$/, ""),
        hWY = (A, q) => {
            return SWY(new URL(q || "", A).href)
        };
    Th4.tryCreateFormattedUrl = hWY
})
// @from(Ln 314319, Col 4)
XvA = R((JvA) => {
    Object.defineProperty(JvA, "__esModule", {
        value: !0
    });
    JvA.uuid = void 0;
    var IWY = KvA();
    Object.defineProperty(JvA, "uuid", {
        enumerable: !0,
        get: function() {
            return IWY.v4
        }
    })
})
// @from(Ln 314332, Col 4)
Sh4 = R((yh4) => {
    Object.defineProperty(yh4, "__esModule", {
        value: !0
    });
    yh4.ContextBatch = void 0;
    var bWY = XvA(),
        kh4 = 32,
        Lh4 = 480;
    class Rh4 {
        constructor(A) {
            this.id = (0, bWY.uuid)(), this.items = [], this.sizeInBytes = 0, this.maxEventCount = Math.max(1, A)
        }
        tryAdd(A) {
            if (this.length === this.maxEventCount) return {
                success: !1,
                message: `Event limit of ${this.maxEventCount} has been exceeded.`
            };
            let q = this.calculateSize(A.context);
            if (q > kh4 * 1024) return {
                success: !1,
                message: `Event exceeds maximum event size of ${kh4} KB`
            };
            if (this.sizeInBytes + q > Lh4 * 1024) return {
                success: !1,
                message: `Event has caused batch size to exceed ${Lh4} KB`
            };
            return this.items.push(A), this.sizeInBytes += q, {
                success: !0
            }
        }
        get length() {
            return this.items.length
        }
        calculateSize(A) {
            return encodeURI(JSON.stringify(A.event)).split(/%..|i/).length
        }
        getEvents() {
            return this.items.map(({
                context: q
            }) => q.event)
        }
        getContexts() {
            return this.items.map((A) => A.context)
        }
        resolveEvents() {
            this.items.forEach(({
                resolver: A,
                context: q
            }) => A(q))
        }
    }
    yh4.ContextBatch = Rh4
})
// @from(Ln 314385, Col 4)
xh4 = R((hh4) => {
    Object.defineProperty(hh4, "__esModule", {
        value: !0
    });
    hh4.b64encode = void 0;
    var uWY = h1("buffer"),
        BWY = (A) => {
            return uWY.Buffer.from(A).toString("base64")
        };
    hh4.b64encode = BWY
})
// @from(Ln 314396, Col 4)
Fh4 = R((Bh4) => {
    Object.defineProperty(Bh4, "__esModule", {
        value: !0
    });
    Bh4.Publisher = void 0;
    var mWY = rs(),
        FWY = Eh4(),
        QWY = FP1(),
        gWY = Sh4(),
        UWY = xh4();

    function pWY(A) {
        return new Promise((q) => setTimeout(q, A))
    }

    function eF1() {}
    class uh4 {
        constructor({
            host: A,
            path: q,
            maxRetries: K,
            flushAt: Y,
            flushInterval: z,
            writeKey: w,
            httpRequestTimeout: H,
            httpClient: $,
            disable: O
        }, _) {
            this._emitter = _, this._maxRetries = K, this._flushAt = Math.max(Y, 1), this._flushInterval = z, this._auth = (0, UWY.b64encode)(`${w}:`), this._url = (0, FWY.tryCreateFormattedUrl)(A ?? "https://api.segment.io", q ?? "/v1/batch"), this._httpRequestTimeout = H ?? 1e4, this._disable = Boolean(O), this._httpClient = $
        }
        createBatch() {
            this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout);
            let A = new gWY.ContextBatch(this._flushAt);
            return this._batch = A, this.pendingFlushTimeout = setTimeout(() => {
                if (A === this._batch) this._batch = void 0;
                if (this.pendingFlushTimeout = void 0, A.length) this.send(A).catch(eF1)
            }, this._flushInterval), A
        }
        clearBatch() {
            this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout), this._batch = void 0
        }
        flush(A) {
            if (!A) return;
            if (this._flushPendingItemsCount = A, !this._batch) return;
            if (this._batch.length === A) this.send(this._batch).catch(eF1), this.clearBatch()
        }
        enqueue(A) {
            let q = this._batch ?? this.createBatch(),
                {
                    promise: K,
                    resolve: Y
                } = (0, QWY.createDeferred)(),
                z = {
                    context: A,
                    resolver: Y
                };
            if (q.tryAdd(z).success) {
                let O = q.length === this._flushPendingItemsCount;
                if (q.length === this._flushAt || O) this.send(q).catch(eF1), this.clearBatch();
                return K
            }
            if (q.length) this.send(q).catch(eF1), this.clearBatch();
            let H = this.createBatch(),
                $ = H.tryAdd(z);
            if ($.success) {
                if (H.length === this._flushPendingItemsCount) this.send(H).catch(eF1), this.clearBatch();
                return K
            } else return A.setFailedDelivery({
                reason: Error($.message)
            }), Promise.resolve(A)
        }
        async send(A) {
            if (this._flushPendingItemsCount) this._flushPendingItemsCount -= A.length;
            let q = A.getEvents(),
                K = this._maxRetries + 1,
                Y = 0;
            while (Y < K) {
                Y++;
                let z;
                try {
                    if (this._disable) return A.resolveEvents();
                    let w = {
                        url: this._url,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${this._auth}`,
                            "User-Agent": "analytics-node-next/latest"
                        },
                        data: {
                            batch: q,
                            sentAt: new Date
                        },
                        httpRequestTimeout: this._httpRequestTimeout
                    };
                    this._emitter.emit("http_request", {
                        body: w.data,
                        method: w.method,
                        url: w.url,
                        headers: w.headers
                    });
                    let H = await this._httpClient.makeRequest(w);
                    if (H.status >= 200 && H.status < 300) {
                        A.resolveEvents();
                        return
                    } else if (H.status === 400) {
                        bh4(A, Error(`[${H.status}] ${H.statusText}`));
                        return
                    } else z = Error(`[${H.status}] ${H.statusText}`)
                } catch (w) {
                    z = w
                }
                if (Y === K) {
                    bh4(A, z);
                    return
                }
                await pWY((0, mWY.backoff)({
                    attempt: Y,
                    minTimeout: 25,
                    maxTimeout: 1000
                }))
            }
        }
    }
    Bh4.Publisher = uh4;

    function bh4(A, q) {
        A.getContexts().forEach((K) => K.setFailedDelivery({
            reason: q
        })), A.resolveEvents()
    }
})
// @from(Ln 314528, Col 4)
DvA = R((Qh4) => {
    Object.defineProperty(Qh4, "__esModule", {
        value: !0
    });
    Qh4.detectRuntime = void 0;
    var dWY = () => {
        if (typeof process === "object" && process && typeof process.env === "object" && process.env && typeof process.version === "string") return "node";
        if (typeof window === "object") return "browser";
        if (typeof WebSocketPair < "u") return "cloudflare-worker";
        if (typeof EdgeRuntime === "string") return "vercel-edge";
        if (typeof WorkerGlobalScope < "u" && typeof importScripts === "function") return "web-worker";
        return "unknown"
    };
    Qh4.detectRuntime = dWY
})
// @from(Ln 314543, Col 4)
ch4 = R((ph4) => {
    Object.defineProperty(ph4, "__esModule", {
        value: !0
    });
    ph4.createConfiguredNodePlugin = ph4.createNodePlugin = void 0;
    var cWY = Fh4(),
        lWY = _vA(),
        iWY = DvA();

    function nWY(A) {
        A.updateEvent("context.library.name", "@segment/analytics-node"), A.updateEvent("context.library.version", lWY.version);
        let q = (0, iWY.detectRuntime)();
        if (q === "node") A.updateEvent("_metadata.nodeVersion", process.version);
        A.updateEvent("_metadata.jsRuntime", q)
    }

    function Uh4(A) {
        function q(K) {
            return nWY(K), A.enqueue(K)
        }
        return {
            name: "Segment.io",
            type: "destination",
            version: "1.0.0",
            isLoaded: () => !0,
            load: () => Promise.resolve(),
            alias: q,
            group: q,
            identify: q,
            page: q,
            screen: q,
            track: q
        }
    }
    ph4.createNodePlugin = Uh4;
    var rWY = (A, q) => {
        let K = new cWY.Publisher(A, q);
        return {
            publisher: K,
            plugin: Uh4(K)
        }
    };
    ph4.createConfiguredNodePlugin = rWY
})
// @from(Ln 314587, Col 4)
nh4 = R((lh4) => {
    Object.defineProperty(lh4, "__esModule", {
        value: !0
    });
    lh4.createMessageId = void 0;
    var aWY = XvA(),
        sWY = () => {
            return `node-next-${Date.now()}-${(0,aWY.uuid)()}`
        };
    lh4.createMessageId = sWY
})
// @from(Ln 314598, Col 4)
sh4 = R((oh4) => {
    Object.defineProperty(oh4, "__esModule", {
        value: !0
    });
    oh4.NodeEventFactory = void 0;
    var tWY = rs(),
        eWY = nh4();
    class rh4 extends tWY.EventFactory {
        constructor() {
            super({
                createMessageId: eWY.createMessageId
            })
        }
    }
    oh4.NodeEventFactory = rh4
})
// @from(Ln 314614, Col 4)
$M6 = R((eh4) => {
    Object.defineProperty(eh4, "__esModule", {
        value: !0
    });
    eh4.Context = void 0;
    var AGY = rs();
    class th4 extends AGY.CoreContext {
        static system() {
            return new this({
                type: "track",
                event: "system"
            })
        }
    }
    eh4.Context = th4
})
// @from(Ln 314630, Col 4)
YI4 = R((qI4) => {
    Object.defineProperty(qI4, "__esModule", {
        value: !0
    });
    qI4.dispatchAndEmit = void 0;
    var qGY = rs(),
        KGY = $M6(),
        YGY = (A) => (q) => {
            let K = q.failedDelivery();
            return K ? A(K.reason, q) : A(void 0, q)
        },
        zGY = async (A, q, K, Y) => {
            try {
                let z = new KGY.Context(A),
                    w = await (0, qGY.dispatch)(z, q, K, {
                        ...Y ? {
                            callback: YGY(Y)
                        } : {}
                    }),
                    H = w.failedDelivery();
                if (H) K.emit("error", {
                    code: "delivery_failure",
                    reason: H.reason,
                    ctx: w
                });
                else K.emit(A.type, w)
            } catch (z) {
                K.emit("error", {
                    code: "unknown",
                    reason: z
                })
            }
        };
    qI4.dispatchAndEmit = zGY
})
// @from(Ln 314665, Col 4)
$I4 = R((wI4) => {
    Object.defineProperty(wI4, "__esModule", {
        value: !0
    });
    wI4.NodeEmitter = void 0;
    var wGY = FP1();
    class zI4 extends wGY.Emitter {}
    wI4.NodeEmitter = zI4
})
// @from(Ln 314674, Col 4)
jI4 = R((XI4) => {
    Object.defineProperty(XI4, "__esModule", {
        value: !0
    });
    XI4.NodeEventQueue = void 0;
    var OI4 = rs();
    class _I4 extends OI4.PriorityQueue {
        constructor() {
            super(1, [])
        }
        getAttempts(A) {
            return A.attempts ?? 0
        }
        updateAttempts(A) {
            return A.attempts = this.getAttempts(A) + 1, this.getAttempts(A)
        }
    }
    class JI4 extends OI4.CoreEventQueue {
        constructor() {
            super(new _I4)
        }
    }
    XI4.NodeEventQueue = JI4
})
// @from(Ln 314698, Col 4)
GI4 = R((PI4) => {
    Object.defineProperty(PI4, "__esModule", {
        value: !0
    });
    PI4.abortSignalAfterTimeout = PI4.AbortSignal = void 0;
    var HGY = FP1(),
        $GY = DvA();
    class jvA {
        constructor() {
            this.onabort = null, this.aborted = !1, this.eventEmitter = new HGY.Emitter
        }
        toString() {
            return "[object AbortSignal]"
        }
        get[Symbol.toStringTag]() {
            return "AbortSignal"
        }
        removeEventListener(...A) {
            this.eventEmitter.off(...A)
        }
        addEventListener(...A) {
            this.eventEmitter.on(...A)
        }
        dispatchEvent(A) {
            let q = {
                    type: A,
                    target: this
                },
                K = `on${A}`;
            if (typeof this[K] === "function") this[K](q);
            this.eventEmitter.emit(A, q)
        }
    }
    PI4.AbortSignal = jvA;
    class MI4 {
        constructor() {
            this.signal = new jvA
        }
        abort() {
            if (this.signal.aborted) return;
            this.signal.aborted = !0, this.signal.dispatchEvent("abort")
        }
        toString() {
            return "[object AbortController]"
        }
        get[Symbol.toStringTag]() {
            return "AbortController"
        }
    }
    var OGY = (A) => {
        if ((0, $GY.detectRuntime)() === "cloudflare-worker") return [];
        let q = new(globalThis.AbortController || MI4),
            K = setTimeout(() => {
                q.abort()
            }, A);
        return K?.unref?.(), [q.signal, K]
    };
    PI4.abortSignalAfterTimeout = OGY
})
// @from(Ln 314757, Col 4)
ZI4 = R((Tm) => {
    var JGY = Tm && Tm.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        XGY = Tm && Tm.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        DGY = Tm && Tm.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) JGY(q, A, K)
            }
            return XGY(q, A), q
        };
    Object.defineProperty(Tm, "__esModule", {
        value: !0
    });
    Tm.fetch = void 0;
    var jGY = async (...A) => {
        if (globalThis.fetch) return globalThis.fetch(...A);
        else if (typeof EdgeRuntime !== "string") return (await Promise.resolve().then(() => DGY(I2A()))).default(...A);
        else throw Error("Invariant: an edge runtime that does not support fetch should not exist")
    };
    Tm.fetch = jGY
})
// @from(Ln 314800, Col 4)
MvA = R((VI4) => {
    Object.defineProperty(VI4, "__esModule", {
        value: !0
    });
    VI4.FetchHTTPClient = void 0;
    var MGY = GI4(),
        PGY = ZI4();
    class fI4 {
        constructor(A) {
            this._fetch = A ?? PGY.fetch
        }
        async makeRequest(A) {
            let [q, K] = (0, MGY.abortSignalAfterTimeout)(A.httpRequestTimeout), Y = {
                url: A.url,
                method: A.method,
                headers: A.headers,
                body: JSON.stringify(A.data),
                signal: q
            };
            return this._fetch(A.url, Y).finally(() => clearTimeout(K))
        }
    }
    VI4.FetchHTTPClient = fI4
})
// @from(Ln 314824, Col 4)
PvA = R((LI4) => {
    Object.defineProperty(LI4, "__esModule", {
        value: !0
    });
    LI4.Analytics = void 0;
    var TI4 = rs(),
        WGY = fh4(),
        GGY = _vA(),
        ZGY = ch4(),
        fGY = sh4(),
        VGY = YI4(),
        NGY = $I4(),
        vI4 = $M6(),
        TGY = jI4(),
        EI4 = MvA();
    class kI4 extends NGY.NodeEmitter {
        constructor(A) {
            super();
            this._isClosed = !1, this._pendingEvents = 0, this._isFlushing = !1, (0, WGY.validateSettings)(A), this._eventFactory = new fGY.NodeEventFactory, this._queue = new TGY.NodeEventQueue;
            let q = A.flushInterval ?? 1e4;
            this._closeAndFlushDefaultTimeout = q * 1.25;
            let {
                plugin: K,
                publisher: Y
            } = (0, ZGY.createConfiguredNodePlugin)({
                writeKey: A.writeKey,
                host: A.host,
                path: A.path,
                maxRetries: A.maxRetries ?? 3,
                flushAt: A.flushAt ?? A.maxEventsInBatch ?? 15,
                httpRequestTimeout: A.httpRequestTimeout,
                disable: A.disable,
                flushInterval: q,
                httpClient: typeof A.httpClient === "function" ? new EI4.FetchHTTPClient(A.httpClient) : A.httpClient ?? new EI4.FetchHTTPClient
            }, this);
            this._publisher = Y, this.ready = this.register(K).then(() => {
                return
            }), this.emit("initialize", A), (0, TI4.bindAll)(this)
        }
        get VERSION() {
            return GGY.version
        }
        closeAndFlush({
            timeout: A = this._closeAndFlushDefaultTimeout
        } = {}) {
            return this.flush({
                timeout: A,
                close: !0
            })
        }
        async flush({
            timeout: A,
            close: q = !1
        } = {}) {
            if (this._isFlushing) {
                console.warn("Overlapping flush calls detected. Please wait for the previous flush to finish before calling .flush again");
                return
            } else this._isFlushing = !0;
            if (q) this._isClosed = !0;
            this._publisher.flush(this._pendingEvents);
            let K = new Promise((Y) => {
                if (!this._pendingEvents) Y();
                else this.once("drained", () => {
                    Y()
                })
            }).finally(() => {
                this._isFlushing = !1
            });
            return A ? (0, TI4.pTimeout)(K, A).catch(() => {
                return
            }) : K
        }
        _dispatch(A, q) {
            if (this._isClosed) {
                this.emit("call_after_close", A);
                return
            }
            this._pendingEvents++, (0, VGY.dispatchAndEmit)(A, this._queue, this, q).catch((K) => K).finally(() => {
                if (this._pendingEvents--, !this._pendingEvents) this.emit("drained")
            })
        }
        alias({
            userId: A,
            previousId: q,
            context: K,
            timestamp: Y,
            integrations: z
        }, w) {
            let H = this._eventFactory.alias(A, q, {
                context: K,
                integrations: z,
                timestamp: Y
            });
            this._dispatch(H, w)
        }
        group({
            timestamp: A,
            groupId: q,
            userId: K,
            anonymousId: Y,
            traits: z = {},
            context: w,
            integrations: H
        }, $) {
            let O = this._eventFactory.group(q, z, {
                context: w,
                anonymousId: Y,
                userId: K,
                timestamp: A,
                integrations: H
            });
            this._dispatch(O, $)
        }
        identify({
            userId: A,
            anonymousId: q,
            traits: K = {},
            context: Y,
            timestamp: z,
            integrations: w
        }, H) {
            let $ = this._eventFactory.identify(A, K, {
                context: Y,
                anonymousId: q,
                userId: A,
                timestamp: z,
                integrations: w
            });
            this._dispatch($, H)
        }
        page({
            userId: A,
            anonymousId: q,
            category: K,
            name: Y,
            properties: z,
            context: w,
            timestamp: H,
            integrations: $
        }, O) {
            let _ = this._eventFactory.page(K ?? null, Y ?? null, z, {
                context: w,
                anonymousId: q,
                userId: A,
                timestamp: H,
                integrations: $
            });
            this._dispatch(_, O)
        }
        screen({
            userId: A,
            anonymousId: q,
            category: K,
            name: Y,
            properties: z,
            context: w,
            timestamp: H,
            integrations: $
        }, O) {
            let _ = this._eventFactory.screen(K ?? null, Y ?? null, z, {
                context: w,
                anonymousId: q,
                userId: A,
                timestamp: H,
                integrations: $
            });
            this._dispatch(_, O)
        }
        track({
            userId: A,
            anonymousId: q,
            event: K,
            properties: Y,
            context: z,
            timestamp: w,
            integrations: H
        }, $) {
            let O = this._eventFactory.track(K, Y, {
                context: z,
                userId: A,
                anonymousId: q,
                timestamp: w,
                integrations: H
            });
            this._dispatch(O, $)
        }
        register(...A) {
            return this._queue.criticalTasks.run(async () => {
                let q = vI4.Context.system(),
                    K = A.map((Y) => this._queue.register(q, Y, this));
                await Promise.all(K), this.emit("register", A.map((Y) => Y.name))
            })
        }
        async deregister(...A) {
            let q = vI4.Context.system(),
                K = A.map((Y) => {
                    let z = this._queue.plugins.find((w) => w.name === Y);
                    if (z) return this._queue.deregister(q, z, this);
                    else q.log("warn", `plugin ${Y} not found`)
                });
            await Promise.all(K), this.emit("deregister", A)
        }
    }
    LI4.Analytics = kI4
})
// @from(Ln 315029, Col 4)
yI4 = R((AQ1) => {
    Object.defineProperty(AQ1, "__esModule", {
        value: !0
    });
    AQ1.FetchHTTPClient = AQ1.Context = AQ1.Analytics = void 0;
    var vGY = PvA();
    Object.defineProperty(AQ1, "Analytics", {
        enumerable: !0,
        get: function() {
            return vGY.Analytics
        }
    });
    var EGY = $M6();
    Object.defineProperty(AQ1, "Context", {
        enumerable: !0,
        get: function() {
            return EGY.Context
        }
    });
    var kGY = MvA();
    Object.defineProperty(AQ1, "FetchHTTPClient", {
        enumerable: !0,
        get: function() {
            return kGY.FetchHTTPClient
        }
    });
    var LGY = PvA();
    AQ1.default = LGY.Analytics
})
// @from(Ln 315059, Col 0)
function SGY() {
    return CGY.production
}
// @from(Ln 315062, Col 0)
async function hGY() {
    if (BZ()) return !1;
    return !0
}
// @from(Ln 315066, Col 0)
async function WvA(A, q) {
    let K = await SI4();
    if (!K) return;
    try {
        let Y = ZvA(),
            z = u3(),
            w = await c01({
                model: q.model
            }),
            H = sx7(w, q),
            $ = {
                anonymousId: Y,
                event: A,
                properties: H
            };
        if (z) {
            let O = tp(!0);
            $.userId = O.deviceId, $.properties.accountUuid = z.accountUuid, $.properties.organizationUuid = z.organizationUuid
        }
        K.track($)
    } catch (Y) {
        K1(Y instanceof Error ? Y : Error(String(Y)))
    }
}
// @from(Ln 315090, Col 0)
async function hI4(A) {
    let q = await SI4();
    if (!q) return;
    try {
        let K = ZvA(),
            Y = u3(),
            z = {
                anonymousId: K,
                traits: A
            };
        if (Y) {
            let w = tp(!0);
            z.userId = w.deviceId
        }
        q.identify(z)
    } catch (K) {
        K1(K instanceof Error ? K : Error(String(K)))
    }
}
// @from(Ln 315109, Col 4)
CI4
// @from(Ln 315109, Col 9)
CGY
// @from(Ln 315109, Col 14)
OM6 = null
// @from(Ln 315110, Col 4)
SI4
// @from(Ln 315111, Col 4)
GvA = v(() => {
    zq();
    _71();
    cA();
    y6();
    J7();
    U$();
    Js();
    CI4 = o(yI4(), 1), CGY = {
        production: "LKJN8LsLERHEOXkw487o7qCTFOrGPimI",
        development: "b64sf1kxwDGe1PiSAlv5ixuH0f509RKK"
    };
    SI4 = KA(async () => {
        if (!await hGY()) return null;
        try {
            return OM6 = new CI4.Analytics({
                writeKey: SGY()
            }), process.on("beforeExit", async () => {
                await OM6?.closeAndFlush()
            }), process.on("exit", () => {
                OM6?.closeAndFlush()
            }), OM6
        } catch (q) {
            return K1(q instanceof Error ? q : Error(String(q))), null
        }
    })
})
// @from(Ln 315138, Col 4)
II4 = {}
// @from(Ln 315144, Col 0)
function IGY() {
    let A = u3();
    if (!A) return {};
    return {
        email: A.emailAddress,
        account_uuid: A.accountUuid,
        organization_uuid: A.organizationUuid
    }
}
// @from(Ln 315153, Col 0)
async function xGY(A, q) {
    return lW.createElement(QP1, {
        onDone: async (K) => {
            if (q.onChangeAPIKey(), q.setMessages(xI4), K) az1(), hI4(IGY()), rX6(), T26(), q.setAppState((Y) => ({
                ...Y,
                authVersion: Y.authVersion + 1
            }));
            A(K ? "Login successful" : "Login interrupted")
        }
    })
}
// @from(Ln 315165, Col 0)
function QP1(A) {
    let q = e(21),
        K = is(),
        Y;
    if (q[0] !== K || q[1] !== A) Y = () => A.onDone(!1, K), q[0] = K, q[1] = A, q[2] = Y;
    else Y = q[2];
    let z = uq(Y),
        w;
    if (q[3] !== K || q[4] !== A) w = () => A.onDone(!1, K), q[3] = K, q[4] = A, q[5] = w;
    else w = q[5];
    let H;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) H = {
        context: "Confirmation"
    }, q[6] = H;
    else H = q[6];
    DA("confirm:no", w, H);
    let $;
    if (q[7] !== K || q[8] !== A) $ = () => A.onDone(!0, K), q[7] = K, q[8] = A, q[9] = $;
    else $ = q[9];
    let O;
    if (q[10] !== A.startingMessage || q[11] !== $) O = lW.createElement(r31, {
        onDone: $,
        startingMessage: A.startingMessage
    }), q[10] = A.startingMessage, q[11] = $, q[12] = O;
    else O = q[12];
    let _;
    if (q[13] !== z.keyName || q[14] !== z.pending) _ = z.pending ? lW.createElement(lW.Fragment, null, "Press ", z.keyName, " again to exit") : "", q[13] = z.keyName, q[14] = z.pending, q[15] = _;
    else _ = q[15];
    let J;
    if (q[16] !== _) J = lW.createElement(I, {
        marginLeft: 1
    }, lW.createElement(V, {
        dimColor: !0
    }, _)), q[16] = _, q[17] = J;
    else J = q[17];
    let X;
    if (q[18] !== O || q[19] !== J) X = lW.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, O, J), q[18] = O, q[19] = J, q[20] = X;
    else X = q[20];
    return X
}
// @from(Ln 315208, Col 4)
lW
// @from(Ln 315209, Col 4)
_M6 = v(() => {
    i1();
    sF1();
    R2();
    m1();
    K7();
    tF1();
    B6();
    N8();
    GvA();
    J7();
    Om1();
    mV();
    lW = o(X1(), 1)
})
// @from(Ln 315224, Col 0)
async function AI() {
    let A = h6();
    if (qQ1.has(A)) return qQ1.get(A) ?? null;
    try {
        let q = await uv1();
        if (h(`Git remote URL: ${q}`), !q) return h("No git remote URL found"), qQ1.set(A, null), null;
        let K = s31(q);
        return h(`Parsed repository: ${K} from URL: ${q}`), qQ1.set(A, K), K
    } catch (q) {
        return h(`Error detecting repository: ${q}`), qQ1.set(A, null), null
    }
}
// @from(Ln 315237, Col 0)
function s31(A) {
    let q = A.trim(),
        K = /github\.com[:/]([^/]+)\/([^/]+)$/,
        Y = q.match(K);
    if (Y && Y[1] && Y[2]) {
        let z = Y[1],
            w = Y[2].replace(/\.git$/, ""),
            H = `${z}/${w}`;
        return h(`Parsed repository: ${H} from ${q}`), H
    }
    if (!q.includes("://") && !q.includes("@") && q.includes("/")) {
        let z = q.split("/");
        if (z.length === 2 && z[0] && z[1]) {
            let w = z[1].replace(/\.git$/, "");
            return `${z[0]}/${w}`
        }
    }
    return h(`Could not parse repository from: ${q}`), null
}
// @from(Ln 315256, Col 4)
qQ1
// @from(Ln 315257, Col 4)
t31 = v(() => {
    h9();
    Z6();
    N7();
    qQ1 = new Map
})
// @from(Ln 315267, Col 0)
function uGY(A) {
    if (!sA.isAxiosError(A)) return !1;
    if (!A.response) return !0;
    if (A.response.status >= 500) return !0;
    return !1
}
// @from(Ln 315273, Col 0)
async function BGY(A, q) {
    let K;
    for (let Y = 0; Y <= fvA; Y++) try {
        return await sA.get(A, q)
    } catch (z) {
        if (K = z, !uGY(z)) throw z;
        if (Y >= fvA) throw h(`Teleport request failed after ${Y+1} attempts: ${z instanceof Error?z.message:String(z)}`), z;
        let w = bI4[Y] ?? 2000;
        h(`Teleport request failed (attempt ${Y+1}/${fvA+1}), retrying in ${w}ms: ${z instanceof Error?z.message:String(z)}`), await new Promise((H) => setTimeout(H, w))
    }
    throw K
}
// @from(Ln 315285, Col 0)
async function PN() {
    let A = a4()?.accessToken;
    if (A === void 0) throw Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
    let q = await Kb();
    if (!q) throw Error("Unable to get organization UUID");
    return {
        accessToken: A,
        orgUUID: q
    }
}
// @from(Ln 315295, Col 0)
async function uI4() {
    let {
        accessToken: A,
        orgUUID: q
    } = await PN(), K = `${P4().BASE_API_URL}/v1/sessions`;
    try {
        let Y = {
                ...rX(A),
                "x-organization-uuid": q
            },
            z = await BGY(K, {
                headers: Y
            });
        if (z.status !== 200) throw Error(`Failed to fetch code sessions: ${z.statusText}`);
        return z.data.data.map((H) => {
            let $ = H.session_context.sources.find((_) => _.type === "git_repository"),
                O = null;
            if ($?.url) {
                let _ = s31($.url);
                if (_) {
                    let [J, X] = _.split("/");
                    if (J && X) O = {
                        name: X,
                        owner: {
                            login: J
                        },
                        default_branch: $.revision || void 0
                    }
                }
            }
            return {
                id: H.id,
                title: H.title || "Untitled",
                description: "",
                status: H.session_status,
                repo: O,
                turns: [],
                created_at: H.created_at,
                updated_at: H.updated_at
            }
        })
    } catch (Y) {
        let z = Y instanceof Error ? Y : Error(String(Y));
        throw K1(z), Y
    }
}
// @from(Ln 315342, Col 0)
function rX(A) {
    return {
        Authorization: `Bearer ${A}`,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
    }
}
// @from(Ln 315349, Col 0)
async function KQ1(A) {
    let {
        accessToken: q,
        orgUUID: K
    } = await PN(), Y = `${P4().BASE_API_URL}/v1/sessions/${A}`, z = {
        ...rX(q),
        "x-organization-uuid": K
    }, w = await sA.get(Y, {
        headers: z,
        timeout: 15000,
        validateStatus: (H) => H < 500
    });
    if (w.status !== 200) {
        let $ = w.data?.error?.message;
        if (w.status === 404) throw Error(`Session not found: ${A}`);
        if (w.status === 401) throw Error("Session expired. Please run /login to sign in again.");
        throw Error($ || `Failed to fetch session: ${w.status} ${w.statusText}`)
    }
    return w.data
}
// @from(Ln 315370, Col 0)
function VvA(A) {
    return A.session_context.outcomes?.find((K) => K.type === "git_repository")?.git_info?.branches[0]
}
// @from(Ln 315373, Col 0)
async function JM6(A, q) {
    try {
        let {
            accessToken: K,
            orgUUID: Y
        } = await PN(), z = `${P4().BASE_API_URL}/v1/sessions/${A}/events`, w = {
            ...rX(K),
            "x-organization-uuid": Y
        }, $ = {
            events: [{
                uuid: bGY(),
                session_id: A,
                type: "user",
                parent_tool_use_id: null,
                message: {
                    role: "user",
                    content: q
                }
            }]
        };
        h(`[sendEventToRemoteSession] Sending event to session ${A}`);
        let O = await sA.post(z, $, {
            headers: w,
            validateStatus: (_) => _ < 500
        });
        if (O.status === 200 || O.status === 201) return h(`[sendEventToRemoteSession] Successfully sent event to session ${A}`), !0;
        return h(`[sendEventToRemoteSession] Failed with status ${O.status}: ${Q1(O.data)}`), !1
    } catch (K) {
        return h(`[sendEventToRemoteSession] Error: ${K instanceof Error?K.message:String(K)}`), !1
    }
}
// @from(Ln 315404, Col 0)
async function BI4(A, q) {
    try {
        let {
            accessToken: K,
            orgUUID: Y
        } = await PN(), z = `${P4().BASE_API_URL}/v1/sessions/${A}`, w = {
            ...rX(K),
            "x-organization-uuid": Y
        };
        h(`[updateSessionTitle] Updating title for session ${A}: "${q}"`);
        let H = await sA.patch(z, {
            title: q
        }, {
            headers: w,
            validateStatus: ($) => $ < 500
        });
        if (H.status === 200) return h(`[updateSessionTitle] Successfully updated title for session ${A}`), !0;
        return h(`[updateSessionTitle] Failed with status ${H.status}: ${Q1(H.data)}`), !1
    } catch (K) {
        return h(`[updateSessionTitle] Error: ${K instanceof Error?K.message:String(K)}`), !1
    }
}
// @from(Ln 315426, Col 4)
bI4
// @from(Ln 315426, Col 9)
fvA
// @from(Ln 315426, Col 14)
mGY
// @from(Ln 315426, Col 19)
gnw
// @from(Ln 315427, Col 4)
UR = v(() => {
    Uz();
    J7();
    y5();
    Pk();
    y6();
    Z6();
    t31();
    i7();
    m6();
    bI4 = [2000, 4000, 8000, 16000], fvA = bI4.length;
    mGY = y4.object({
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
    }), gnw = y4.array(mGY)
})
// @from(Ln 315455, Col 0)
async function mI4(A) {
    let {
        accessToken: q,
        orgUUID: K
    } = await PN(), Y = {
        ...rX(q),
        "x-organization-uuid": K
    }, z = `${P4().BASE_API_URL}/api/oauth/organizations/${K}/admin_requests`;
    return (await sA.post(z, A, {
        headers: Y
    })).data
}
// @from(Ln 315467, Col 0)
async function FI4(A, q) {
    let {
        accessToken: K,
        orgUUID: Y
    } = await PN(), z = {
        ...rX(K),
        "x-organization-uuid": Y
    }, w = `${P4().BASE_API_URL}/api/oauth/organizations/${Y}/admin_requests/me?request_type=${A}`;
    for (let $ of q) w += `&statuses=${$}`;
    return (await sA.get(w, {
        headers: z
    })).data
}
// @from(Ln 315480, Col 4)
QI4 = v(() => {
    y5();
    Uz();
    UR()
})
// @from(Ln 315485, Col 4)
UI4 = {}