
// @from(Ln 514953, Col 0)
async function uqA(q) {
    let K = DS();
    if (!K) {
        su6("skip: no oauth token");
        return
    }
    let _;
    try {
        let w = `${g58()}/api/oauth/files/${encodeURIComponent(q.file_uuid)}/content`,
            $ = await Z1.get(w, {
                headers: {
                    Authorization: `Bearer ${K}`
                },
                responseType: "arraybuffer",
                timeout: SqA,
                validateStatus: () => !0
            });
        if ($.status !== 200) {
            su6(`fetch ${q.file_uuid} failed: status=${$.status}`);
            return
        }
        _ = Buffer.from($.data)
    } catch (w) {
        su6(`fetch ${q.file_uuid} threw: ${w}`);
        return
    }
    let z = IqA(q.file_name),
        Y = (q.file_uuid.slice(0, 8) || yqA().slice(0, 8)).replace(/[^a-zA-Z0-9_-]/g, "_"),
        A = xqA(),
        O = Vq5(A, `${Y}-${z}`);
    try {
        await LqA(A, {
            recursive: !0
        }), await hqA(O, _)
    } catch (w) {
        su6(`write ${O} failed: ${w}`);
        return
    }
    return su6(`resolved ${q.file_uuid} → ${O} (${_.length} bytes)`), O
}
// @from(Ln 514993, Col 0)
async function kq5(q) {
    if (q.length === 0) return "";
    su6(`resolving ${q.length} attachment(s)`);
    let _ = (await Promise.all(q.map(uqA))).filter((z) => z !== void 0);
    if (_.length === 0) return "";
    return _.map((z) => `@"${z}"`).join(" ") + " "
}
// @from(Ln 515001, Col 0)
function Nq5(q, K) {
    if (!K) return q;
    if (typeof q === "string") return K + q;
    let _ = q.findLastIndex((z) => z.type === "text");
    if (_ !== -1) {
        let z = q[_];
        if (z.type === "text") return [...q.slice(0, _), {
            ...z,
            text: K + z.text
        }, ...q.slice(_ + 1)]
    }
    return [...q, {
        type: "text",
        text: K.trimEnd()
    }]
}
// @from(Ln 515017, Col 0)
async function pX7(q, K) {
    let _ = pz8(q);
    if (_.length === 0) return K;
    let z = await kq5(_);
    return Nq5(K, z)
}
// @from(Ln 515023, Col 4)
SqA = 30000
// @from(Ln 515024, Col 4)
CqA
// @from(Ln 515024, Col 9)
bqA
// @from(Ln 515025, Col 4)
FX7 = L(() => {
    CK();
    p7();
    y8();
    K8();
    Q8();
    qn();
    CqA = C6(() => y.object({
        file_uuid: y.string(),
        file_name: y.string(),
        is_image: y.boolean().nullish()
    })), bqA = C6(() => y.array(CqA()))
})
// @from(Ln 515039, Col 0)
function yq5(q, K, _, z, Y) {
    let A = xH.useRef(null),
        O = xH.useRef(void 0),
        w = xH.useRef(0),
        $ = xH.useRef(void 0),
        j = xH.useRef(0),
        H = xH.useRef(void 0),
        J = R7(),
        X = xH.useRef(z);
    X.current = z;
    let M = xH.useRef(Y);
    M.current = Y;
    let P = xH.useRef(q);
    P.current = q;
    let W = H9(),
        {
            addNotification: D
        } = EK(),
        Z = M8((k) => k.replBridgeEnabled),
        G = M8((k) => k.replBridgeConnected),
        f = M8((k) => k.replBridgeOutboundOnly),
        v = M8((k) => k.replBridgeInitialName);
    return xH.useEffect(() => {
        if (!Z) return;
        let k = f;

        function N(C, x = !1) {
            if (E(`[bridge:repl] notifyBridgeFailed detail="${C}" outboundOnly=${k} wasConnected=${x}`), k) return;
            D({
                key: "bridge-failed",
                jsx: xH.default.createElement(xH.default.Fragment, null, xH.default.createElement(T, {
                    color: "error"
                }, "Remote Control ", x ? "disconnected" : "failed"), xH.default.createElement(T, {
                    dimColor: !0
                }, " ", "· ", x && C ? C : "/remote-control")),
                priority: "immediate"
            });
            let B = C ?? "";
            if (!x && H.current === B) return;
            if (!x) H.current = B;
            K((m) => [...m, eO(x ? `Remote Control disconnected${C?`: ${C}`:""}` : C ? `Remote Control failed to connect: ${C}` : "Remote Control failed to connect. Run /remote-control to retry.", x ? "info" : "warning")])
        }
        if (j.current >= mqA) {
            E(`[bridge:repl] Hook: ${j.current} consecutive init failures, not retrying this session`);
            let C = "disabled after repeated failures · restart to retry";
            if (!k) D({
                key: "bridge-failed",
                jsx: xH.default.createElement(xH.default.Fragment, null, xH.default.createElement(T, {
                    color: "error"
                }, "Remote Control failed"), xH.default.createElement(T, {
                    dimColor: !0
                }, " · ", C)),
                priority: "immediate"
            });
            J((x) => {
                if (x.replBridgeError === C && !x.replBridgeEnabled) return x;
                return {
                    ...x,
                    replBridgeError: C,
                    replBridgeEnabled: !1
                }
            });
            return
        }
        let R = !1,
            h = q.length;
        return (async () => {
            try {
                let m = function(g, c) {
                        if (E(`[bridge:repl] handleStateChange state=${g} detail="${c}" cancelled=${R} outboundOnly=${k}`), R) return;
                        if (k) {
                            if (E(`[bridge:repl] Mirror state=${g}${c?` detail=${c}`:""}`), g === "failed") J((l) => {
                                if (!l.replBridgeConnected) return l;
                                return {
                                    ...l,
                                    replBridgeConnected: !1
                                }
                            });
                            else if (g === "ready" || g === "connected") J((l) => {
                                if (l.replBridgeConnected) return l;
                                return {
                                    ...l,
                                    replBridgeConnected: !0
                                }
                            });
                            return
                        }
                        let n = A.current;
                        switch (g) {
                            case "ready":
                                J((l) => {
                                    let z6 = n ? g2(n.bridgeSessionId, n.sessionIngressUrl) : l.replBridgeSessionUrl,
                                        A6 = n?.environmentId,
                                        e = n?.bridgeSessionId;
                                    if (l.replBridgeConnected && !l.replBridgeSessionActive && !l.replBridgeReconnecting && l.replBridgeSessionUrl === z6 && l.replBridgeEnvironmentId === A6 && l.replBridgeSessionId === e) return l;
                                    return {
                                        ...l,
                                        replBridgeConnected: !0,
                                        replBridgeSessionActive: !1,
                                        replBridgeReconnecting: !1,
                                        replBridgeSessionUrl: z6,
                                        replBridgeEnvironmentId: A6,
                                        replBridgeSessionId: e,
                                        replBridgeError: void 0
                                    }
                                });
                                break;
                            case "connected": {
                                if (J((l) => {
                                        if (l.replBridgeSessionActive) return l;
                                        return {
                                            ...l,
                                            replBridgeConnected: !0,
                                            replBridgeSessionActive: !0,
                                            replBridgeReconnecting: !1,
                                            replBridgeError: void 0
                                        }
                                    }), u8("tengu_bridge_system_init", !1))(async () => {
                                    try {
                                        let l = await pH6(b8());
                                        if (R) return;
                                        let z6 = W.getState();
                                        A.current?.writeSdkMessages([Qa8({
                                            tools: [],
                                            mcpClients: [],
                                            model: M.current,
                                            permissionMode: z6.toolPermissionContext.mode,
                                            commands: X.current.filter(VeK),
                                            agents: z6.agentDefinitions.activeAgents,
                                            skills: l,
                                            plugins: [],
                                            pluginErrors: [],
                                            fastMode: z6.fastMode
                                        })])
                                    } catch (l) {
                                        E(`[bridge:repl] Failed to send system/init: ${b6(l)}`, {
                                            level: "error"
                                        })
                                    }
                                })();
                                break
                            }
                            case "reconnecting":
                                J((l) => {
                                    if (l.replBridgeReconnecting) return l;
                                    return {
                                        ...l,
                                        replBridgeReconnecting: !0,
                                        replBridgeSessionActive: !1
                                    }
                                });
                                break;
                            case "failed":
                                clearTimeout($.current), N(c, n !== null), J((l) => ({
                                    ...l,
                                    replBridgeError: c,
                                    replBridgeReconnecting: !1,
                                    replBridgeSessionActive: !1,
                                    replBridgeConnected: !1
                                })), $.current = setTimeout(() => {
                                    if (R) return;
                                    $.current = void 0, J((l) => {
                                        if (!l.replBridgeError) return l;
                                        return {
                                            ...l,
                                            replBridgeEnabled: !1,
                                            replBridgeError: void 0
                                        }
                                    })
                                }, UX7);
                                break
                        }
                    },
                    F = function(g) {
                        let c = g.response?.request_id;
                        if (!c) return;
                        let n = S.get(c);
                        if (!n) {
                            E(`[bridge:repl] No handler for control_response request_id=${c} (late response after local resolve, or unknown id)`, {
                                level: "verbose"
                            });
                            return
                        }
                        S.delete(c);
                        let l = g.response;
                        if (l.subtype === "success" && l.response && qq5(l.response)) n(l.response)
                    };
                if (O.current) E("[bridge:repl] Hook: waiting for previous teardown to complete before re-init"), await O.current, O.current = void 0, E("[bridge:repl] Hook: previous teardown complete, proceeding with re-init");
                if (R) return;
                let {
                    initReplBridge: C
                } = await Promise.resolve().then(() => (BX7(), mX7)), {
                    shouldShowAppUpgradeMessage: x
                } = await Promise.resolve().then(() => (Oz8(), ftK));
                async function B(g) {
                    try {
                        let c = Ua8(g);
                        if (!c) return;
                        let {
                            uuid: n
                        } = c, {
                            resolveAndPrepend: l
                        } = await Promise.resolve().then(() => (FX7(), Eq5)), z6 = c.content, A6 = await l(g, z6), e = typeof A6 === "string" ? A6.slice(0, 80) : `[${A6.length} content blocks]`;
                        E(`[bridge:repl] Injecting inbound user message: ${e}${n?` uuid=${n}`:""}`);
                        let i = void 0;
                        Dj({
                            value: A6,
                            mode: "prompt",
                            uuid: n,
                            skipSlashCommands: !0,
                            ...i ? {
                                origin: {
                                    kind: "peer",
                                    from: i
                                },
                                isMeta: !0
                            } : {
                                bridgeOrigin: !0
                            }
                        })
                    } catch (c) {
                        E(`[bridge:repl] handleInboundMessage failed: ${c}`, {
                            level: "error"
                        })
                    }
                }
                let S = new Map,
                    U = await C({
                        outboundOnly: k,
                        tags: k ? ["ccr-mirror"] : void 0,
                        onInboundMessage: B,
                        onPermissionResponse: F,
                        onInterrupt() {
                            _.current?.abort()
                        },
                        onSetModel(g) {
                            let c = g === "default" ? null : g ?? null;
                            kW(c), J((n) => {
                                if (n.mainLoopModelForSession === c) return n;
                                return {
                                    ...n,
                                    mainLoopModelForSession: c
                                }
                            })
                        },
                        onSetMaxThinkingTokens(g) {
                            let c = g !== null;
                            J((n) => {
                                if (n.thinkingEnabled === c) return n;
                                return {
                                    ...n,
                                    thinkingEnabled: c
                                }
                            })
                        },
                        onSetPermissionMode(g) {
                            if (g === "bypassPermissions") {
                                if (wt()) return {
                                    ok: !1,
                                    error: "Cannot set permission mode to bypassPermissions because it is disabled by settings or configuration"
                                };
                                if (!W.getState().toolPermissionContext.isBypassPermissionsModeAvailable) return {
                                    ok: !1,
                                    error: "Cannot set permission mode to bypassPermissions because the session was not launched with --dangerously-skip-permissions"
                                }
                            }
                            if (g === "auto" && !$L()) {
                                let c = ge();
                                return {
                                    ok: !1,
                                    error: c ? `Cannot set permission mode to auto: ${E_6(c)}` : "Cannot set permission mode to auto"
                                }
                            }
                            return J((c) => {
                                let n = c.toolPermissionContext.mode;
                                if (n === g) return c;
                                let l = Fe(n, g, c.toolPermissionContext);
                                return {
                                    ...c,
                                    toolPermissionContext: {
                                        ...l,
                                        mode: g
                                    }
                                }
                            }), setImmediate(() => {
                                fI6()?.((c) => {
                                    return c.forEach((n) => {
                                        n.recheckPermission()
                                    }), c
                                })
                            }), {
                                ok: !0
                            }
                        },
                        onStateChange: m,
                        initialMessages: q.length > 0 ? q : void 0,
                        getMessages: () => P.current,
                        initialName: v,
                        enableSessionPersistence: $36()
                    });
                if (R) {
                    if (E("[bridge:repl] Hook: init cancelled during flight, tearing down"), U) U.teardown();
                    return
                }
                if (!U) {
                    j.current++, E(`[bridge:repl] Init returned null (precondition or session creation failed); consecutive failures: ${j.current}`), clearTimeout($.current), J((g) => ({
                        ...g,
                        replBridgeError: g.replBridgeError ?? "check debug logs for details"
                    })), $.current = setTimeout(() => {
                        if (R) return;
                        $.current = void 0, J((g) => {
                            if (!g.replBridgeError) return g;
                            return {
                                ...g,
                                replBridgeEnabled: !1,
                                replBridgeError: void 0
                            }
                        })
                    }, UX7);
                    return
                }
                if (A.current = U, n37(U), j.current = 0, H.current = void 0, w.current = h, k) J((g) => {
                    if (g.replBridgeConnected && g.replBridgeSessionId === U.bridgeSessionId) return g;
                    return {
                        ...g,
                        replBridgeConnected: !0,
                        replBridgeSessionId: U.bridgeSessionId,
                        replBridgeSessionUrl: void 0,
                        replBridgeConnectUrl: void 0,
                        replBridgeError: void 0
                    }
                }), E(`[bridge:repl] Mirror initialized, session=${U.bridgeSessionId}`);
                else {
                    let g = {
                        sendRequest(l, z6, A6, e, i, O6, J6) {
                            U.sendControlRequest({
                                type: "control_request",
                                request_id: l,
                                request: {
                                    subtype: "can_use_tool",
                                    tool_name: z6,
                                    display_name: uz8(z6),
                                    input: A6,
                                    tool_use_id: e,
                                    description: i,
                                    ...O6 && {
                                        permission_suggestions: O6
                                    },
                                    ...J6 && {
                                        blocked_path: J6
                                    }
                                }
                            })
                        },
                        sendResponse(l, z6) {
                            let A6 = {
                                ...z6
                            };
                            U.sendControlResponse({
                                type: "control_response",
                                response: {
                                    subtype: "success",
                                    request_id: l,
                                    response: A6
                                }
                            })
                        },
                        cancelRequest(l) {
                            U.sendControlCancelRequest(l), S.delete(l)
                        },
                        onResponse(l, z6) {
                            return S.set(l, z6), () => {
                                S.delete(l)
                            }
                        }
                    };
                    J((l) => ({
                        ...l,
                        replBridgePermissionCallbacks: g
                    }));
                    let c = g2(U.bridgeSessionId, U.sessionIngressUrl);
                    J((l) => {
                        if (l.replBridgeConnected && l.replBridgeSessionUrl === c) return l;
                        return {
                            ...l,
                            replBridgeConnected: !0,
                            replBridgeSessionUrl: c,
                            replBridgeEnvironmentId: U.environmentId,
                            replBridgeSessionId: U.bridgeSessionId,
                            replBridgeError: void 0
                        }
                    });
                    let n = await x().catch(() => !1);
                    if (R) return;
                    K((l) => [...l, aCK(c, n ? "Please upgrade to the latest version of the Claude mobile app to see your Remote Control sessions." : void 0)]), E(`[bridge:repl] Hook initialized, session=${U.bridgeSessionId}`)
                }
            } catch (C) {
                if (R) return;
                j.current++;
                let x = b6(C);
                E(`[bridge:repl] Init failed: ${x}; consecutive failures: ${j.current}`), clearTimeout($.current), N(x), J((B) => ({
                    ...B,
                    replBridgeError: x
                })), $.current = setTimeout(() => {
                    if (R) return;
                    $.current = void 0, J((B) => {
                        if (!B.replBridgeError) return B;
                        return {
                            ...B,
                            replBridgeEnabled: !1,
                            replBridgeError: void 0
                        }
                    })
                }, UX7)
            }
        })(), () => {
            if (R = !0, clearTimeout($.current), $.current = void 0, A.current) E(`[bridge:repl] Hook cleanup: starting teardown for session=${A.current.bridgeSessionId}`), O.current = A.current.teardown(), A.current = null, n37(null);
            J((C) => {
                if (!C.replBridgeConnected && !C.replBridgeSessionActive && !C.replBridgeError) return C;
                return {
                    ...C,
                    replBridgeConnected: !1,
                    replBridgeSessionActive: !1,
                    replBridgeReconnecting: !1,
                    replBridgeConnectUrl: void 0,
                    replBridgeSessionUrl: void 0,
                    replBridgeEnvironmentId: void 0,
                    replBridgeSessionId: void 0,
                    replBridgeError: void 0,
                    replBridgePermissionCallbacks: void 0
                }
            }), w.current = 0
        }
    }, [Z, f, J, K, D]), xH.useEffect(() => {
        if (!G) return;
        let k = A.current;
        if (!k) return;
        if (w.current > q.length) E(`[bridge:repl] Compaction detected: lastWrittenIndex=${w.current} > messages.length=${q.length}, clamping`);
        let N = Math.min(w.current, q.length),
            R = [];
        for (let h = N; h < q.length; h++) {
            let C = q[h];
            if (C && (C.type === "user" || C.type === "assistant" || C.type === "system" && C.subtype === "local_command")) R.push(C)
        }
        if (w.current = q.length, R.length > 0) k.writeMessages(R)
    }, [q, G]), {
        sendBridgeResult: xH.useCallback(() => {
            A.current?.sendResult()
        }, [])
    }
}
// @from(Ln 515490, Col 4)
xH
// @from(Ln 515490, Col 8)
UX7 = 1e4
// @from(Ln 515491, Col 4)
mqA = 3
// @from(Ln 515492, Col 4)
Lq5 = L(() => {
    y8();
    aR();
    WX7();
    DX7();
    i37();
    CA();
    kY();
    g6();
    B1();
    N7();
    n7();
    K8();
    m8();
    b$();
    fX7();
    _7();
    vX();
    xH = K6(P6(), 1)
})
// @from(Ln 515512, Col 4)
Cq5 = {}
// @from(Ln 515523, Col 0)
function Rq5(q) {
    return q.type === "text"
}
// @from(Ln 515527, Col 0)
function dX7(q) {
    return q === "summarize" || q === "summarize_up_to"
}
// @from(Ln 515531, Col 0)
function cX7({
    messages: q,
    onPreRestore: K,
    onRestoreMessage: _,
    onRestoreCode: z,
    onSummarize: Y,
    onClose: A,
    preselectedMessage: O
}) {
    let w = M8((o) => o.fileHistory),
        [$, j] = mj.useState(void 0),
        H = kO(),
        J = mj.useMemo(BqA, []),
        X = mj.useMemo(() => [...q.filter(IW6), {
            ...t8({
                content: ""
            }),
            uuid: J
        }], [q, J]),
        [M, P] = mj.useState(X.length - 1),
        W = Math.max(0, Math.min(M - Math.floor(QX7 / 2), X.length - QX7)),
        D = X.length > 1,
        [Z, G] = mj.useState(O),
        [f, v] = mj.useState(void 0);
    mj.useEffect(() => {
        if (!O || !H) return;
        let o = !1;
        return r48(w, O.uuid).then((_6) => {
            if (!o) v(_6)
        }), () => {
            o = !0
        }
    }, [O, H, w]);
    let [V, k] = mj.useState(!1), [N, R] = mj.useState(null), [h, C] = mj.useState("both"), [x, B] = mj.useState(""), [m, S] = mj.useState("");

    function F(o) {
        let _6 = o ? [{
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
            }],
            r = {
                type: "input",
                placeholder: "add context (optional)",
                initialValue: "",
                allowEmptySubmitToCancel: !0,
                showLabelWithValue: !0,
                labelValueSeparator: ": "
            };
        return _6.push({
            value: "summarize",
            label: "Summarize from here",
            ...r,
            onChange: B
        }), _6.push({
            value: "nevermind",
            label: "Never mind"
        }), _6
    }
    mj.useEffect(() => {
        d("tengu_message_selector_opened", {})
    }, []);
    async function U(o) {
        K(), k(!0);
        try {
            await _(o), k(!1), A()
        } catch (_6) {
            j6(_6), k(!1), j(`Failed to restore the conversation:
${_6}`)
        }
    }
    async function g(o) {
        let _6 = q.indexOf(o),
            r = q.length - 1 - _6;
        if (d("tengu_message_selector_selected", {
                index_from_end: r,
                message_type: o.type,
                is_current_prompt: !1
            }), !q.includes(o)) {
            A();
            return
        }
        if (!H) {
            await U(o);
            return
        }
        let t = await r48(w, o.uuid);
        G(o), v(t)
    }
    async function c(o) {
        if (d("tengu_message_selector_restore_option_selected", {
                option: o
            }), !Z) {
            j("Message not found.");
            return
        }
        if (o === "nevermind") {
            if (O) A();
            else G(void 0);
            return
        }
        if (dX7(o)) {
            K(), k(!0), R(o), j(void 0);
            try {
                let t = o === "summarize_up_to" ? "up_to" : "from",
                    Y6 = (t === "up_to" ? m : x).trim() || void 0;
                await Y(Z, Y6, t), k(!1), R(null), G(void 0), A()
            } catch (t) {
                if (!(t instanceof be)) j6(t);
                k(!1), R(null), G(void 0), j(`Failed to summarize:
${t}`)
            }
            return
        }
        K(), k(!0), j(void 0);
        let _6 = null,
            r = null;
        if (o === "code" || o === "both") try {
            await z(Z)
        } catch (t) {
            _6 = t, j6(_6)
        }
        if (o === "conversation" || o === "both") try {
            await _(Z)
        } catch (t) {
            r = t, j6(r)
        }
        if (k(!1), G(void 0), r && _6) j(`Failed to restore the conversation and code:
${r}
${_6}`);
        else if (r) j(`Failed to restore the conversation:
${r}`);
        else if (_6) j(`Failed to restore the code:
${_6}`);
        else A()
    }
    let n = $3(),
        l = mj.useCallback(() => {
            if (Z && !O) {
                G(void 0);
                return
            }
            d("tengu_message_selector_cancelled", {}), A()
        }, [A, Z, O]),
        z6 = mj.useCallback(() => P((o) => Math.max(0, o - 1)), []),
        A6 = mj.useCallback(() => P((o) => Math.min(X.length - 1, o + 1)), [X.length]),
        e = mj.useCallback(() => P(0), []),
        i = mj.useCallback(() => P(X.length - 1), [X.length]),
        O6 = mj.useCallback(() => {
            let o = X[M];
            if (o) g(o)
        }, [X, M, g]);
    G1("confirm:no", l, {
        context: "Confirmation",
        isActive: !Z
    }), L7({
        "messageSelector:up": z6,
        "messageSelector:down": A6,
        "messageSelector:top": e,
        "messageSelector:bottom": i,
        "messageSelector:select": O6
    }, {
        context: "MessageSelector",
        isActive: !V && !$ && !Z && D
    });
    let [J6, $6] = mj.useState({});
    mj.useEffect(() => {
        async function o() {
            if (!H) return;
            Promise.all(X.map(async (_6, r) => {
                if (_6.uuid !== J) {
                    let t = nF8(w, _6.uuid),
                        Y6 = X.at(r + 1),
                        X6 = t ? UqA(q, _6.uuid, Y6?.uuid !== J ? Y6?.uuid : void 0) : void 0;
                    if (X6 !== void 0) $6((M6) => ({
                        ...M6,
                        [r]: X6
                    }));
                    else $6((M6) => ({
                        ...M6,
                        [r]: void 0
                    }))
                }
            }))
        }
        o()
    }, [X, q, J, w, H]);
    let H6 = H && f?.filesChanged && f.filesChanged.length > 0,
        q6 = !$ && !Z && !O && D;
    return l1.createElement(u, {
        flexDirection: "column",
        width: "100%"
    }, l1.createElement(zA, {
        color: "suggestion"
    }), l1.createElement(u, {
        flexDirection: "column",
        marginX: 1,
        gap: 1
    }, l1.createElement(T, {
        bold: !0,
        color: "suggestion"
    }, "Rewind"), $ && l1.createElement(l1.Fragment, null, l1.createElement(T, {
        color: "error"
    }, "Error: ", $)), !D && l1.createElement(l1.Fragment, null, l1.createElement(T, null, "Nothing to rewind to yet.")), !$ && Z && D && l1.createElement(l1.Fragment, null, l1.createElement(T, null, "Confirm you want to restore", " ", !f && "the conversation ", "to the point before you sent this message:"), l1.createElement(u, {
        flexDirection: "column",
        paddingLeft: 1,
        borderStyle: "single",
        borderRight: !1,
        borderTop: !1,
        borderBottom: !1,
        borderLeft: !0,
        borderLeftDimColor: !0
    }, l1.createElement(hq5, {
        userMessage: Z,
        color: "text",
        isCurrent: !1
    }), l1.createElement(T, {
        dimColor: !0
    }, "(", CC(new Date(Z.timestamp)), ")")), l1.createElement(FqA, {
        selectedRestoreOption: h,
        canRestoreCode: !!H6,
        diffStatsForRestore: f
    }), V && dX7(N) ? l1.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, l1.createElement(Y5, null), l1.createElement(T, null, "Summarizing…")) : l1.createElement(A1, {
        isDisabled: V,
        options: F(!!H6),
        defaultFocusValue: H6 ? "both" : "conversation",
        onFocus: (o) => C(o),
        onChange: (o) => c(o),
        onCancel: () => O ? A() : G(void 0)
    }), H6 && l1.createElement(u, {
        marginBottom: 1
    }, l1.createElement(T, {
        dimColor: !0
    }, e6.warning, " Rewinding does not affect files edited manually or via bash."))), q6 && l1.createElement(l1.Fragment, null, H ? l1.createElement(T, null, "Restore the code and/or conversation to the point before…") : l1.createElement(T, null, "Restore and fork the conversation to the point before…"), l1.createElement(u, {
        width: "100%",
        flexDirection: "column"
    }, X.slice(W, W + QX7).map((o, _6) => {
        let r = W + _6,
            t = r === M,
            Y6 = o.uuid === J,
            X6 = r in J6,
            M6 = J6[r],
            W6 = M6?.filesChanged && M6.filesChanged.length;
        return l1.createElement(u, {
            key: o.uuid,
            height: H ? 3 : 2,
            overflow: "hidden",
            width: "100%",
            flexDirection: "row"
        }, l1.createElement(u, {
            width: 2,
            minWidth: 2
        }, t ? l1.createElement(T, {
            color: "permission",
            bold: !0
        }, e6.pointer, " ") : l1.createElement(T, null, "  ")), l1.createElement(u, {
            flexDirection: "column"
        }, l1.createElement(u, {
            flexShrink: 1,
            height: 1,
            overflow: "hidden"
        }, l1.createElement(hq5, {
            userMessage: o,
            color: t ? "suggestion" : void 0,
            isCurrent: Y6,
            paddingRight: 10
        })), H && X6 && l1.createElement(u, {
            height: 1,
            flexDirection: "row"
        }, M6 ? l1.createElement(l1.Fragment, null, l1.createElement(T, {
            dimColor: !t,
            color: "inactive"
        }, W6 ? l1.createElement(l1.Fragment, null, W6 === 1 && M6.filesChanged[0] ? `${tu6.basename(M6.filesChanged[0])} ` : `${W6} files changed `, l1.createElement(Sq5, {
            diffStats: M6
        })) : l1.createElement(l1.Fragment, null, "No code changes"))) : l1.createElement(T, {
            dimColor: !0,
            color: "warning"
        }, e6.warning, " No code restore"))))
    }))), !Z && l1.createElement(T, {
        dimColor: !0,
        italic: !0
    }, n.pending ? l1.createElement(l1.Fragment, null, "Press ", n.keyName, " again to exit") : l1.createElement(z1, null, !$ && D && l1.createElement(A8, {
        chord: "enter",
        action: "continue"
    }), l1.createElement(A8, {
        chord: "escape",
        action: "exit"
    })))))
}
// @from(Ln 515832, Col 0)
function pqA(q) {
    switch (q) {
        case "summarize":
            return "Messages after this point will be summarized.";
        case "summarize_up_to":
            return "Preceding messages will be summarized. This and subsequent messages will remain unchanged — you will stay at the end of the conversation.";
        case "both":
        case "conversation":
            return "The conversation will be forked.";
        case "code":
        case "nevermind":
            return "The conversation will be unchanged."
    }
}
// @from(Ln 515847, Col 0)
function FqA(q) {
    let K = s(11),
        {
            selectedRestoreOption: _,
            canRestoreCode: z,
            diffStatsForRestore: Y
        } = q,
        A = z && (_ === "both" || _ === "code"),
        O;
    if (K[0] !== _) O = pqA(_), K[0] = _, K[1] = O;
    else O = K[1];
    let w;
    if (K[2] !== O) w = l1.createElement(T, {
        dimColor: !0
    }, O), K[2] = O, K[3] = w;
    else w = K[3];
    let $;
    if (K[4] !== Y || K[5] !== _ || K[6] !== A) $ = !dX7(_) && (A ? l1.createElement(gqA, {
        diffStatsForRestore: Y
    }) : l1.createElement(T, {
        dimColor: !0
    }, "The code will be unchanged.")), K[4] = Y, K[5] = _, K[6] = A, K[7] = $;
    else $ = K[7];
    let j;
    if (K[8] !== w || K[9] !== $) j = l1.createElement(u, {
        flexDirection: "column"
    }, w, $), K[8] = w, K[9] = $, K[10] = j;
    else j = K[10];
    return j
}
// @from(Ln 515878, Col 0)
function gqA(q) {
    let K = s(14),
        {
            diffStatsForRestore: _
        } = q;
    if (_ === void 0) return;
    if (!_.filesChanged || !_.filesChanged[0]) {
        let w;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = l1.createElement(T, {
            dimColor: !0
        }, "The code has not changed (nothing will be restored)."), K[0] = w;
        else w = K[0];
        return w
    }
    let z = _.filesChanged.length,
        Y;
    if (z === 1) {
        let w;
        if (K[1] !== _.filesChanged[0]) w = tu6.basename(_.filesChanged[0] || ""), K[1] = _.filesChanged[0], K[2] = w;
        else w = K[2];
        Y = w
    } else if (z === 2) {
        let w;
        if (K[3] !== _.filesChanged[0]) w = tu6.basename(_.filesChanged[0] || ""), K[3] = _.filesChanged[0], K[4] = w;
        else w = K[4];
        let $ = w,
            j;
        if (K[5] !== _.filesChanged[1]) j = tu6.basename(_.filesChanged[1] || ""), K[5] = _.filesChanged[1], K[6] = j;
        else j = K[6];
        Y = `${$} and ${j}`
    } else {
        let w;
        if (K[7] !== _.filesChanged[0]) w = tu6.basename(_.filesChanged[0] || ""), K[7] = _.filesChanged[0], K[8] = w;
        else w = K[8];
        Y = `${w} and ${_.filesChanged.length-1} other files`
    }
    let A;
    if (K[9] !== _) A = l1.createElement(Sq5, {
        diffStats: _
    }), K[9] = _, K[10] = A;
    else A = K[10];
    let O;
    if (K[11] !== Y || K[12] !== A) O = l1.createElement(l1.Fragment, null, l1.createElement(T, {
        dimColor: !0
    }, "The code will be restored", " ", A, " in ", Y, ".")), K[11] = Y, K[12] = A, K[13] = O;
    else O = K[13];
    return O
}
// @from(Ln 515927, Col 0)
function Sq5(q) {
    let K = s(7),
        {
            diffStats: _
        } = q;
    if (!_ || !_.filesChanged) return;
    let z;
    if (K[0] !== _.insertions) z = l1.createElement(T, {
        color: "diffAddedWord"
    }, "+", _.insertions, " "), K[0] = _.insertions, K[1] = z;
    else z = K[1];
    let Y;
    if (K[2] !== _.deletions) Y = l1.createElement(T, {
        color: "diffRemovedWord"
    }, "-", _.deletions), K[2] = _.deletions, K[3] = Y;
    else Y = K[3];
    let A;
    if (K[4] !== z || K[5] !== Y) A = l1.createElement(l1.Fragment, null, z, Y), K[4] = z, K[5] = Y, K[6] = A;
    else A = K[6];
    return A
}
// @from(Ln 515949, Col 0)
function hq5(q) {
    let K = s(30),
        {
            userMessage: _,
            color: z,
            dimColor: Y,
            isCurrent: A,
            paddingRight: O
        } = q,
        {
            columns: w
        } = s1();
    if (A) {
        let f;
        if (K[0] !== z || K[1] !== Y) f = l1.createElement(u, {
            width: "100%"
        }, l1.createElement(T, {
            italic: !0,
            color: z,
            dimColor: Y
        }, "(current)")), K[0] = z, K[1] = Y, K[2] = f;
        else f = K[2];
        return f
    }
    let $ = _.message.content,
        j, H, J, X, M, P, W, D;
    if (K[3] !== z || K[4] !== w || K[5] !== $ || K[6] !== Y || K[7] !== O) {
        D = Symbol.for("react.early_return_sentinel");
        q: {
            let f = typeof $ === "string" ? null : $.at(-1),
                v = typeof $ === "string" ? $.trim() : f && Rq5(f) && f.text ? f.text.trim() : "(no prompt)",
                V = tH8(v);
            if (my6(V)) {
                let k;
                if (K[16] !== z || K[17] !== Y) k = l1.createElement(u, {
                    flexDirection: "row",
                    width: "100%"
                }, l1.createElement(T, {
                    italic: !0,
                    color: z,
                    dimColor: Y
                }, "((empty message))")), K[16] = z, K[17] = Y, K[18] = k;
                else k = K[18];
                D = k;
                break q
            }
            if (V.includes("<bash-input>")) {
                let k = vK(V, "bash-input");
                if (k) {
                    let N;
                    if (K[19] === Symbol.for("react.memo_cache_sentinel")) N = l1.createElement(T, {
                        color: "bashBorder"
                    }, "!"), K[19] = N;
                    else N = K[19];
                    D = l1.createElement(u, {
                        flexDirection: "row",
                        width: "100%"
                    }, N, l1.createElement(T, {
                        color: z,
                        dimColor: Y
                    }, " ", k));
                    break q
                }
            }
            if (V.includes(`<${LW}>`)) {
                let k = vK(V, LW),
                    N = vK(V, "command-args"),
                    R = vK(V, "skill-format") === "true";
                if (k)
                    if (R) {
                        D = l1.createElement(u, {
                            flexDirection: "row",
                            width: "100%"
                        }, l1.createElement(T, {
                            color: z,
                            dimColor: Y
                        }, "Skill(", k, ")"));
                        break q
                    } else {
                        D = l1.createElement(u, {
                            flexDirection: "row",
                            width: "100%"
                        }, l1.createElement(T, {
                            color: z,
                            dimColor: Y
                        }, "/", k, " ", N));
                        break q
                    }
            }
            H = u,
            P = "row",
            W = "100%",
            j = T,
            J = z,
            X = Y,
            M = O ? w5(V, w - O, !0) : V.slice(0, 500).split(`
`).slice(0, 4).join(`
`)
        }
        K[3] = z, K[4] = w, K[5] = $, K[6] = Y, K[7] = O, K[8] = j, K[9] = H, K[10] = J, K[11] = X, K[12] = M, K[13] = P, K[14] = W, K[15] = D
    } else j = K[8], H = K[9], J = K[10], X = K[11], M = K[12], P = K[13], W = K[14], D = K[15];
    if (D !== Symbol.for("react.early_return_sentinel")) return D;
    let Z;
    if (K[20] !== j || K[21] !== J || K[22] !== X || K[23] !== M) Z = l1.createElement(j, {
        color: J,
        dimColor: X
    }, M), K[20] = j, K[21] = J, K[22] = X, K[23] = M, K[24] = Z;
    else Z = K[24];
    let G;
    if (K[25] !== H || K[26] !== P || K[27] !== W || K[28] !== Z) G = l1.createElement(H, {
        flexDirection: P,
        width: W
    }, Z), K[25] = H, K[26] = P, K[27] = W, K[28] = Z, K[29] = G;
    else G = K[29];
    return G
}
// @from(Ln 516066, Col 0)
function UqA(q, K, _) {
    let z = q.findIndex(($) => $.uuid === K);
    if (z === -1) return;
    let Y = _ ? q.findIndex(($) => $.uuid === _) : q.length;
    if (Y === -1) Y = q.length;
    let A = [],
        O = 0,
        w = 0;
    for (let $ = z + 1; $ < Y; $++) {
        let j = q[$];
        if (!j || !t48(j)) continue;
        let H = j.toolUseResult;
        if (!H || !H.filePath || !H.structuredPatch) continue;
        if (!A.includes(H.filePath)) A.push(H.filePath);
        try {
            if ("type" in H && H.type === "create") O += H.content.split(/\r?\n/).length;
            else
                for (let J of H.structuredPatch) {
                    let X = w7(J.lines, (P) => P.startsWith("+")),
                        M = w7(J.lines, (P) => P.startsWith("-"));
                    O += X, w += M
                }
        } catch {
            continue
        }
    }
    return {
        filesChanged: A,
        insertions: O,
        deletions: w
    }
}
// @from(Ln 516099, Col 0)
function IW6(q) {
    if (q.type !== "user") return !1;
    if (Array.isArray(q.message.content) && q.message.content[0]?.type === "tool_result") return !1;
    if (YM6(q)) return !1;
    if (q.isMeta) return !1;
    if (q.isCompactSummary || q.isVisibleInTranscriptOnly) return !1;
    let K = q.message.content,
        _ = typeof K === "string" ? null : K.at(-1),
        z = typeof K === "string" ? K.trim() : _ && Rq5(_) && _.text ? _.text.trim() : "";
    if (z.indexOf(`<${l0}>`) !== -1 || z.indexOf(`<${GA6}>`) !== -1 || z.indexOf(`<${Ru7}>`) !== -1 || z.indexOf(`<${Su7}>`) !== -1 || z.indexOf(`<${TA}>`) !== -1 || z.indexOf(`<${T16}>`) !== -1 || z.indexOf(`<${oX}`) !== -1) return !1;
    return !0
}
// @from(Ln 516112, Col 0)
function oa8(q, K) {
    for (let _ = K + 1; _ < q.length; _++) {
        let z = q[_];
        if (!z) continue;
        if (YM6(z)) continue;
        if (t48(z)) continue;
        if (z.type === "progress") continue;
        if (z.type === "system") continue;
        if (z.type === "attachment") continue;
        if (z.type === "user" && z.isMeta) continue;
        if (z.type === "assistant") {
            let Y = z.message.content;
            if (Array.isArray(Y)) {
                if (Y.some((O) => O.type === "text" && O.text?.trim() || O.type === "tool_use")) return !1
            }
            continue
        }
        if (z.type === "user") return !1
    }
    return !0
}
// @from(Ln 516133, Col 4)
l1
// @from(Ln 516133, Col 8)
mj
// @from(Ln 516133, Col 12)
QX7 = 7
// @from(Ln 516134, Col 4)
aa8 = L(() => {
    o6();
    Qq();
    C8();
    ep();
    N7();
    cy();
    U8();
    C$();
    g6();
    C7();
    Ef6();
    _7();
    gK();
    Ej();
    I4();
    rA();
    c7();
    Nq();
    VR();
    u7();
    l1 = K6(P6(), 1), mj = K6(P6(), 1)
})
// @from(Ln 516158, Col 0)
function Iq5(q) {
    bq5.useEffect(() => {
        if (!q.length) return;
        let K = ky(q);
        if (K) K.client.setNotificationHandler(QqA(), (_) => {
            let {
                eventName: z,
                eventData: Y
            } = _.params;
            d(`tengu_ide_${z}`, Y)
        })
    }, [q])
}
// @from(Ln 516171, Col 4)
bq5
// @from(Ln 516171, Col 9)
QqA
// @from(Ln 516172, Col 4)
xq5 = L(() => {
    C8();
    p7();
    kj();
    bq5 = K6(P6(), 1), QqA = C6(() => y.object({
        method: y.literal("log_event"),
        params: y.object({
            eventName: y.string(),
            eventData: y.object({}).passthrough()
        })
    }))
})
// @from(Ln 516185, Col 0)
function dqA() {
    return Date.now() - AV()
}
// @from(Ln 516189, Col 0)
function cqA(q) {
    return dqA() < q
}
// @from(Ln 516193, Col 0)
function lqA(q) {
    return !cqA(q)
}
// @from(Ln 516197, Col 0)
function Fz8(q, K) {
    let _ = fd();
    lX7.useEffect(() => {
        hi(!0)
    }, []), lX7.useEffect(() => {
        let z = !1,
            Y = setInterval(() => {
                if (lqA(uq5) && !z) z = !0, clearInterval(Y), Il({
                    message: q,
                    notificationType: K
                }, _)
            }, uq5);
        return () => clearInterval(Y)
    }, [q, K, _])
}
// @from(Ln 516212, Col 4)
lX7
// @from(Ln 516212, Col 9)
uq5 = 6000
// @from(Ln 516213, Col 4)
nX7 = L(() => {
    y8();
    Gd();
    h48();
    lX7 = K6(P6(), 1)
})
// @from(Ln 516227, Col 0)
function Bq5() {
    return sa8(A7(), mq5, I8())
}
// @from(Ln 516230, Col 0)
async function oqA() {
    let q = Bq5();
    await nqA(q, {
        recursive: !0
    })
}
// @from(Ln 516237, Col 0)
function pq5(q, K) {
    let _ = K.split("/")[1] || "png";
    return sa8(Bq5(), `${q}.${_}`)
}
// @from(Ln 516242, Col 0)
function eu6(q, K) {
    if (q.type !== "image") return null;
    let _ = pq5(q.id, q.mediaType || "image/png");
    return Uq5(K, q.id, _), _
}
// @from(Ln 516247, Col 0)
async function qm6(q, K) {
    let _ = await gq5(q);
    if (_) Uq5(K, q.id, _);
    return _
}
// @from(Ln 516252, Col 0)
async function Fq5(q, K) {
    let _ = new Map;
    for (let [z, Y] of Object.entries(q))
        if (Y.type === "image") {
            let A = await gq5(Y);
            if (A) _.set(Number(z), A)
        } if (_.size > 0) K((z) => {
        let Y = z.storedImagePaths;
        for (let [A, O] of _) Y = Qq5(Y, A, O);
        return Y === z.storedImagePaths ? z : {
            ...z,
            storedImagePaths: Y
        }
    });
    return _
}
// @from(Ln 516268, Col 0)
async function gq5(q) {
    if (q.type !== "image") return null;
    try {
        await oqA();
        let K = pq5(q.id, q.mediaType || "image/png"),
            _ = await iqA(K, "w", 384);
        try {
            await _.writeFile(q.content, {
                encoding: "base64"
            }), await _.datasync()
        } finally {
            await _.close()
        }
        return E(`Stored image ${q.id} to ${K}`), K
    } catch (K) {
        return E(`Failed to store image: ${K}`), null
    }
}
// @from(Ln 516287, Col 0)
function Uq5(q, K, _) {
    q((z) => {
        let Y = Qq5(z.storedImagePaths, K, _);
        return Y === z.storedImagePaths ? z : {
            ...z,
            storedImagePaths: Y
        }
    })
}
// @from(Ln 516297, Col 0)
function Qq5(q, K, _) {
    if (q.get(K) === _) return q;
    let z = new Map(q);
    if (!z.has(K))
        while (z.size >= rqA) {
            let Y = z.keys().next().value;
            if (Y === void 0) break;
            z.delete(Y)
        }
    return z.set(K, _), z
}
// @from(Ln 516308, Col 0)
async function dq5() {
    let q = V8(),
        K = sa8(A7(), mq5),
        _ = I8();
    try {
        let z;
        try {
            z = await q.readdir(K)
        } catch {
            return
        }
        for (let Y of z) {
            if (Y.name === _) continue;
            let A = sa8(K, Y.name);
            try {
                await q.rm(A, {
                    recursive: !0,
                    force: !0
                }), E(`Cleaned up old image cache: ${A}`)
            } catch {}
        }
        try {
            if ((await q.readdir(K)).length === 0) await q.rmdir(K)
        } catch {}
    } catch {}
}
// @from(Ln 516334, Col 4)
mq5 = "image-cache"
// @from(Ln 516335, Col 4)
rqA = 200
// @from(Ln 516336, Col 4)
Km6 = L(() => {
    y8();
    K8();
    Q8();
    Yq()
})
// @from(Ln 516343, Col 0)
function cq5(q) {
    let K = s(4);
    if (iO().syntaxHighlightingDisabled) {
        let Y;
        if (K[0] !== q) Y = ZZ.default.createElement(iX7, {
            ...q,
            highlight: null
        }), K[0] = q, K[1] = Y;
        else Y = K[1];
        return Y
    }
    let z;
    if (K[2] !== q) z = ZZ.default.createElement(ZZ.Suspense, {
        fallback: ZZ.default.createElement(iX7, {
            ...q,
            highlight: null
        })
    }, ZZ.default.createElement(aqA, {
        ...q
    })), K[2] = q, K[3] = z;
    else z = K[3];
    return z
}
// @from(Ln 516367, Col 0)
function aqA(q) {
    let K = s(4),
        _;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) _ = Y36(), K[0] = _;
    else _ = K[0];
    let z = ZZ.use(_),
        Y;
    if (K[1] !== z || K[2] !== q) Y = ZZ.default.createElement(iX7, {
        ...q,
        highlight: z
    }), K[1] = z, K[2] = q, K[3] = Y;
    else Y = K[3];
    return Y
}
// @from(Ln 516382, Col 0)
function iX7(q) {
    let K = s(34),
        {
            content: _,
            maxLines: z,
            minHeight: Y,
            minWidth: A,
            maxWidth: O,
            highlight: w
        } = q,
        $ = A === void 0 ? 40 : A,
        {
            columns: j
        } = s1(),
        [H] = Zq(),
        J = O ?? j - 4,
        X = z ?? 20,
        M;
    if (K[0] !== _ || K[1] !== w || K[2] !== H) M = Sg8(_, H, w), K[0] = _, K[1] = w, K[2] = H, K[3] = M;
    else M = K[3];
    let P = M,
        W, D, Z, G, f, v;
    if (K[4] !== X || K[5] !== J || K[6] !== Y || K[7] !== $ || K[8] !== P) {
        let R = P.split(`
`),
            h = R.length > X,
            C = h ? R.slice(0, X) : R,
            x = Math.min(Y ?? 0, X),
            B = Math.max(0, x - C.length - (h ? 1 : 0)),
            m = B > 0 ? [...C, ...Array(B).fill("")] : C,
            S = Math.max($, ...m.map(sqA)),
            F = Math.min(S + 4, J),
            U = F - 4,
            g;
        if (K[15] !== F) g = lS.horizontal.repeat(F - 2), K[15] = F, K[16] = g;
        else g = K[16];
        let c = `${lS.topLeft}${g}${lS.topRight}`,
            n;
        if (K[17] !== F) n = lS.horizontal.repeat(F - 2), K[17] = F, K[18] = n;
        else n = K[18];
        if (D = `${lS.bottomLeft}${n}${lS.bottomRight}`, v = h ? (() => {
                let z6 = R.length - X,
                    A6 = `${lS.horizontal.repeat(3)} ✂ ${lS.horizontal.repeat(3)} ${z6} lines hidden `,
                    e = N1(A6),
                    i = Math.max(0, F - 2 - e);
                return `${lS.teeLeft}${A6}${lS.horizontal.repeat(i)}${lS.teeRight}`
            })() : null, W = u, Z = "column", K[19] !== c) G = ZZ.default.createElement(T, {
            dimColor: !0
        }, c), K[19] = c, K[20] = G;
        else G = K[20];
        let l;
        if (K[21] !== U) l = (z6, A6) => {
            let i = N1(z6) > U ? vf(z6, 0, U) : z6,
                O6 = " ".repeat(Math.max(0, U - N1(i)));
            return ZZ.default.createElement(u, {
                key: A6,
                flexDirection: "row"
            }, ZZ.default.createElement(T, {
                dimColor: !0
            }, lS.vertical, " "), ZZ.default.createElement(v5, null, i), ZZ.default.createElement(T, {
                dimColor: !0
            }, O6, " ", lS.vertical))
        }, K[21] = U, K[22] = l;
        else l = K[22];
        f = m.map(l), K[4] = X, K[5] = J, K[6] = Y, K[7] = $, K[8] = P, K[9] = W, K[10] = D, K[11] = Z, K[12] = G, K[13] = f, K[14] = v
    } else W = K[9], D = K[10], Z = K[11], G = K[12], f = K[13], v = K[14];
    let V;
    if (K[23] !== v) V = v && ZZ.default.createElement(T, {
        color: "warning"
    }, v), K[23] = v, K[24] = V;
    else V = K[24];
    let k;
    if (K[25] !== D) k = ZZ.default.createElement(T, {
        dimColor: !0
    }, D), K[25] = D, K[26] = k;
    else k = K[26];
    let N;
    if (K[27] !== W || K[28] !== Z || K[29] !== G || K[30] !== f || K[31] !== V || K[32] !== k) N = ZZ.default.createElement(W, {
        flexDirection: Z
    }, G, f, V, k), K[27] = W, K[28] = Z, K[29] = G, K[30] = f, K[31] = V, K[32] = k, K[33] = N;
    else N = K[33];
    return N
}
// @from(Ln 516466, Col 0)
function sqA(q) {
    return N1(q)
}
// @from(Ln 516469, Col 4)
ZZ
// @from(Ln 516469, Col 8)
lS
// @from(Ln 516470, Col 4)
lq5 = L(() => {
    o6();
    tE();
    I4();
    n5();
    g6();
    fJ6();
    vK8();
    k$6();
    ZZ = K6(P6(), 1), lS = {
        topLeft: "┌",
        topRight: "┐",
        bottomLeft: "└",
        bottomRight: "┘",
        horizontal: "─",
        vertical: "│",
        teeLeft: "├",
        teeRight: "┤"
    }
})
// @from(Ln 516491, Col 0)
function _m6(q) {
    let K = s(39),
        {
            questions: _,
            currentQuestionIndex: z,
            answers: Y,
            hideSubmitTab: A
        } = q,
        O = A === void 0 ? !1 : A,
        {
            columns: w
        } = s1(),
        $;
    if (K[0] !== w || K[1] !== z || K[2] !== O || K[3] !== _) {
        q: {
            let D = O ? "" : ` ${e6.tick} Submit `,
                Z = N1("← ") + N1(" →") + N1(D),
                G = w - Z;
            if (G <= 0) {
                let m;
                if (K[5] !== z || K[6] !== _) {
                    let S;
                    if (K[8] !== z) S = (F, U) => {
                        let g = F?.header || `Q${U+1}`;
                        return U === z ? g.slice(0, 3) : ""
                    }, K[8] = z, K[9] = S;
                    else S = K[9];
                    m = _.map(S), K[5] = z, K[6] = _, K[7] = m
                } else m = K[7];
                $ = m;
                break q
            }
            let f = _.map(q4A);
            if (f.map(eqA).reduce(tqA, 0) <= G) {
                $ = f;
                break q
            }
            let k = f[z] || "",
                N = 4 + N1(k),
                R = Math.min(N, G / 2),
                h = G - R,
                C = _.length - 1,
                x = Math.max(6, Math.floor(h / Math.max(C, 1))),
                B;
            if (K[10] !== z || K[11] !== R || K[12] !== x) B = (m, S) => {
                if (S === z) {
                    let F = R - 2 - 2;
                    return j4(m, F)
                } else {
                    let F = x - 2 - 2;
                    return j4(m, F)
                }
            },
            K[10] = z,
            K[11] = R,
            K[12] = x,
            K[13] = B;
            else B = K[13];$ = f.map(B)
        }
        K[0] = w,
        K[1] = z,
        K[2] = O,
        K[3] = _,
        K[4] = $
    }
    else $ = K[4];
    let j = $,
        H = _.length === 1 && O,
        J;
    if (K[14] !== z || K[15] !== H) J = !H && Un.default.createElement(T, {
        color: z === 0 ? "inactive" : void 0
    }, "←", " "), K[14] = z, K[15] = H, K[16] = J;
    else J = K[16];
    let X;
    if (K[17] !== Y || K[18] !== z || K[19] !== _ || K[20] !== j) {
        let D;
        if (K[22] !== Y || K[23] !== z || K[24] !== j) D = (Z, G) => {
            let f = G === z,
                V = Z?.question && !!Y[Z.question] ? e6.checkboxOn : e6.checkboxOff,
                k = j[G] || Z?.header || `Q${G+1}`;
            return Un.default.createElement(u, {
                key: Z?.question || `question-${G}`
            }, f ? Un.default.createElement(T, {
                backgroundColor: "permission",
                color: "inverseText"
            }, " ", V, " ", k, " ") : Un.default.createElement(T, null, " ", V, " ", k, " "))
        }, K[22] = Y, K[23] = z, K[24] = j, K[25] = D;
        else D = K[25];
        X = _.map(D), K[17] = Y, K[18] = z, K[19] = _, K[20] = j, K[21] = X
    } else X = K[21];
    let M;
    if (K[26] !== z || K[27] !== O || K[28] !== _.length) M = !O && Un.default.createElement(u, {
        key: "submit"
    }, z === _.length ? Un.default.createElement(T, {
        backgroundColor: "permission",
        color: "inverseText"
    }, " ", e6.tick, " Submit", " ") : Un.default.createElement(T, null, " ", e6.tick, " Submit ")), K[26] = z, K[27] = O, K[28] = _.length, K[29] = M;
    else M = K[29];
    let P;
    if (K[30] !== z || K[31] !== H || K[32] !== _.length) P = !H && Un.default.createElement(T, {
        color: z === _.length ? "inactive" : void 0
    }, " ", "→"), K[30] = z, K[31] = H, K[32] = _.length, K[33] = P;
    else P = K[33];
    let W;
    if (K[34] !== J || K[35] !== X || K[36] !== M || K[37] !== P) W = Un.default.createElement(u, {
        flexDirection: "row",
        marginBottom: 1
    }, J, X, M, P), K[34] = J, K[35] = X, K[36] = M, K[37] = P, K[38] = W;
    else W = K[38];
    return W
}
// @from(Ln 516603, Col 0)
function tqA(q, K) {
    return q + K
}
// @from(Ln 516607, Col 0)
function eqA(q) {
    return 4 + N1(q)
}
// @from(Ln 516611, Col 0)
function q4A(q, K) {
    return q?.header || `Q${K+1}`
}
// @from(Ln 516614, Col 4)
Un
// @from(Ln 516615, Col 4)
ta8 = L(() => {
    o6();
    Qq();
    I4();
    n5();
    g6();
    c7();
    Un = K6(P6(), 1)
})
// @from(Ln 516625, Col 0)
function nq5({
    question: q,
    questions: K,
    currentQuestionIndex: _,
    answers: z,
    questionStates: Y,
    hideSubmitTab: A = !1,
    minContentHeight: O,
    minContentWidth: w,
    onUpdateQuestionState: $,
    onAnswer: j,
    onTextInputFocus: H,
    onCancel: J,
    onTabPrev: X,
    onTabNext: M,
    onRespondToClaude: P,
    onFinishPlanInterview: W
}) {
    let D = M8((t) => t.toolPermissionContext.mode) === "plan",
        [Z, G] = M5.useState(!1),
        [f, v] = M5.useState(0),
        [V, k] = M5.useState(!1),
        [N, R] = M5.useState(0),
        h = XL(),
        C = h ? kH(h) : null,
        x = q.question,
        B = Y[x],
        m = q.options,
        [S, F] = M5.useState(0),
        U = M5.useRef(x);
    if (U.current !== x) {
        U.current = x;
        let t = B?.selectedValue,
            Y6 = t ? m.findIndex((X6) => X6.label === t) : -1;
        F(Y6 >= 0 ? Y6 : 0)
    }
    let g = m[S],
        c = B?.selectedValue,
        n = B?.textInputValue || "",
        l = M5.useCallback((t) => {
            let Y6 = m[t];
            if (!Y6) return;
            F(t), $(x, {
                selectedValue: Y6.label
            }, !1), j(x, Y6.label)
        }, [m, x, $, j]),
        z6 = M5.useCallback((t) => {
            if (V) return;
            let Y6;
            if (typeof t === "number") Y6 = t;
            else if (t === "up") Y6 = S > 0 ? S - 1 : S;
            else Y6 = S < m.length - 1 ? S + 1 : S;
            if (Y6 >= 0 && Y6 < m.length) F(Y6)
        }, [S, m.length, V]);
    G1("chat:externalEditor", async () => {
        let t = B?.textInputValue || "",
            Y6 = await ML(t);
        if (Y6.content !== null && Y6.content !== t) $(x, {
            textInputValue: Y6.content
        }, !1)
    }, {
        context: "Chat",
        isActive: V && !!h
    }), L7({
        "tabs:previous": () => X?.(),
        "tabs:next": () => M?.()
    }, {
        context: "Tabs",
        isActive: !V && !Z
    });
    let A6 = M5.useCallback(() => {
            if (k(!1), H(!1), c) j(x, c)
        }, [c, x, j, H]),
        e = M5.useCallback(() => {
            G(!0)
        }, []),
        i = M5.useCallback(() => {
            G(!1)
        }, []),
        O6 = M5.useCallback((t) => {
            if (Z) {
                if (t.key === "up" || t.ctrl && t.key === "p") {
                    if (t.preventDefault(), f === 0) i();
                    else v(0);
                    return
                }
                if (t.key === "down" || t.ctrl && t.key === "n") {
                    if (t.preventDefault(), D && f === 0) v(1);
                    return
                }
                if (t.key === "return") {
                    if (t.preventDefault(), f === 0) P();
                    else W();
                    return
                }
                if (t.key === "escape") t.preventDefault(), J();
                return
            }
            if (V) {
                if (t.key === "escape") t.preventDefault(), A6();
                return
            }
            if (t.key === "up" || t.ctrl && t.key === "p") {
                if (t.preventDefault(), S > 0) z6("up")
            } else if (t.key === "down" || t.ctrl && t.key === "n")
                if (t.preventDefault(), S === m.length - 1) e();
                else z6("down");
            else if (t.key === "return") t.preventDefault(), l(S);
            else if (t.key === "n" && !t.ctrl && !t.meta) t.preventDefault(), k(!0), H(!0);
            else if (t.key === "escape") t.preventDefault(), J();
            else if (t.key.length === 1 && t.key >= "1" && t.key <= "9") {
                t.preventDefault();
                let Y6 = parseInt(t.key, 10) - 1;
                if (Y6 < m.length) z6(Y6)
            }
        }, [Z, f, D, V, S, m.length, i, e, z6, l, A6, P, W, J, H]),
        J6 = g?.preview || null,
        $6 = 30,
        H6 = 4,
        {
            columns: q6
        } = s1(),
        o = q6 - $6 - H6,
        _6 = 11,
        r = M5.useMemo(() => {
            return O ? Math.max(1, O - _6) : void 0
        }, [O]);
    return M5.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: O6
    }, M5.default.createElement(zA, {
        color: "inactive"
    }), M5.default.createElement(u, {
        flexDirection: "column",
        paddingTop: 0
    }, M5.default.createElement(_m6, {
        questions: K,
        currentQuestionIndex: _,
        answers: z,
        hideSubmitTab: A
    }), M5.default.createElement(X36, {
        title: q.question,
        color: "text"
    }), M5.default.createElement(u, {
        flexDirection: "column",
        minHeight: O
    }, M5.default.createElement(u, {
        marginTop: 1,
        flexDirection: "row",
        gap: 4
    }, M5.default.createElement(u, {
        flexDirection: "column",
        width: 30
    }, m.map((t, Y6) => {
        let X6 = S === Y6,
            M6 = c === t.label;
        return M5.default.createElement(u, {
            key: t.label,
            flexDirection: "row"
        }, X6 ? M5.default.createElement(T, {
            color: "suggestion"
        }, e6.pointer) : M5.default.createElement(T, null, " "), M5.default.createElement(T, {
            dimColor: !0
        }, " ", Y6 + 1, "."), M5.default.createElement(T, {
            color: M6 ? "success" : X6 ? "suggestion" : void 0,
            bold: X6
        }, " ", t.label), M6 && M5.default.createElement(T, {
            color: "success"
        }, " ", e6.tick))
    })), M5.default.createElement(u, {
        flexDirection: "column",
        flexGrow: 1
    }, M5.default.createElement(cq5, {
        content: J6 || "No preview available",
        maxLines: r,
        minWidth: w,
        maxWidth: o
    }), M5.default.createElement(u, {
        marginTop: 1,
        flexDirection: "row",
        gap: 1
    }, M5.default.createElement(T, {
        color: "suggestion"
    }, "Notes:"), V ? M5.default.createElement(l4, {
        value: n,
        placeholder: "Add notes on this design…",
        onChange: (t) => {
            $(x, {
                textInputValue: t
            }, !1)
        },
        onSubmit: A6,
        onExit: A6,
        focus: !0,
        showCursor: !0,
        columns: 60,
        cursorOffset: N,
        onChangeCursorOffset: R
    }) : M5.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, n || "press n to add notes")))), M5.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, M5.default.createElement(zA, {
        color: "inactive"
    }), M5.default.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, Z && f === 0 ? M5.default.createElement(T, {
        color: "suggestion"
    }, e6.pointer) : M5.default.createElement(T, null, " "), M5.default.createElement(T, {
        color: Z && f === 0 ? "suggestion" : void 0
    }, "Chat about this")), D && M5.default.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, Z && f === 1 ? M5.default.createElement(T, {
        color: "suggestion"
    }, e6.pointer) : M5.default.createElement(T, null, " "), M5.default.createElement(T, {
        color: Z && f === 1 ? "suggestion" : void 0
    }, "Skip interview and plan immediately"))), M5.default.createElement(u, {
        marginTop: 1
    }, M5.default.createElement(T, {
        color: "inactive",
        dimColor: !0
    }, M5.default.createElement(z1, null, M5.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), M5.default.createElement(A8, {
        chord: ["up", "down"],
        action: "navigate"
    }), M5.default.createElement(A8, {
        chord: "n",
        action: "add notes"
    }), K.length > 1 && M5.default.createElement(A8, {
        chord: "tab",
        action: "switch questions"
    }), V && C && M5.default.createElement(A8, {
        chord: "ctrl+g",
        action: `edit in ${C}`
    }), M5.default.createElement(A8, {
        chord: "escape",
        action: "cancel"
    })))))))
}
// @from(Ln 516873, Col 4)
M5
// @from(Ln 516874, Col 4)
iq5 = L(() => {
    Qq();
    I4();
    g6();
    C7();
    N7();
    Tn();
    kj();
    uS();
    Nq();
    VR();
    u7();
    NY();
    J78();
    lq5();
    ta8();
    M5 = K6(P6(), 1)
})
// @from(Ln 516893, Col 0)
function rq5(q) {
    let K = s(116),
        {
            question: _,
            questions: z,
            currentQuestionIndex: Y,
            answers: A,
            questionStates: O,
            hideSubmitTab: w,
            planFilePath: $,
            minContentHeight: j,
            minContentWidth: H,
            onUpdateQuestionState: J,
            onAnswer: X,
            onTextInputFocus: M,
            onCancel: P,
            onSubmit: W,
            onTabPrev: D,
            onTabNext: Z,
            onRespondToClaude: G,
            onFinishPlanInterview: f,
            onImagePaste: v,
            pastedContents: V,
            onRemoveImage: k
        } = q,
        N = w === void 0 ? !1 : w,
        R = M8(Y4A) === "plan",
        [h, C] = Gz.useState(!1),
        [x, B] = Gz.useState(0),
        [m, S] = Gz.useState(!1),
        F;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) {
        let q8 = XL();
        F = q8 ? kH(q8) : null, K[0] = F
    } else F = K[0];
    let U = F,
        g;
    if (K[1] !== M) g = (q8) => {
        let L8 = q8 === "__other__";
        S(L8), M(L8)
    }, K[1] = M, K[2] = g;
    else g = K[2];
    let c = g,
        n;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) n = () => {
        C(!0)
    }, K[3] = n;
    else n = K[3];
    let l = n,
        z6;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) z6 = () => {
        C(!1)
    }, K[4] = z6;
    else z6 = K[4];
    let A6 = z6,
        e;
    if (K[5] !== x || K[6] !== h || K[7] !== R || K[8] !== P || K[9] !== f || K[10] !== G) e = (q8) => {
        if (!h) return;
        if (q8.key === "up" || q8.ctrl && q8.key === "p") {
            if (q8.preventDefault(), x === 0) A6();
            else B(0);
            return
        }
        if (q8.key === "down" || q8.ctrl && q8.key === "n") {
            if (q8.preventDefault(), R && x === 0) B(1);
            return
        }
        if (q8.key === "return") {
            if (q8.preventDefault(), x === 0) G();
            else f();
            return
        }
        if (q8.key === "escape") q8.preventDefault(), P()
    }, K[5] = x, K[6] = h, K[7] = R, K[8] = P, K[9] = f, K[10] = G, K[11] = e;
    else e = K[11];
    let i = e,
        O6, J6, $6;
    if (K[12] !== J || K[13] !== _ || K[14] !== O) {
        let q8 = _.options.map(z4A);
        J6 = _.question;
        let L8 = O[J6],
            w8;
        if (K[18] !== J || K[19] !== _.multiSelect || K[20] !== J6) w8 = async (G8, s6) => {
            let u6 = await ML(G8);
            if (u6.content !== null && u6.content !== G8) s6(u6.content), J(J6, {
                textInputValue: u6.content
            }, _.multiSelect ?? !1)
        }, K[18] = J, K[19] = _.multiSelect, K[20] = J6, K[21] = w8;
        else w8 = K[21];
        O6 = w8;
        let x8 = _.multiSelect ? "Type something" : "Type something.",
            a6 = L8?.textInputValue ?? "",
            D8;
        if (K[22] !== J || K[23] !== _.multiSelect || K[24] !== J6) D8 = (G8) => {
            J(J6, {
                textInputValue: G8
            }, _.multiSelect ?? !1)
        }, K[22] = J, K[23] = _.multiSelect, K[24] = J6, K[25] = D8;
        else D8 = K[25];
        let Q6;
        if (K[26] !== a6 || K[27] !== D8 || K[28] !== x8) Q6 = {
            type: "input",
            value: "__other__",
            label: "Other",
            placeholder: x8,
            initialValue: a6,
            onChange: D8
        }, K[26] = a6, K[27] = D8, K[28] = x8, K[29] = Q6;
        else Q6 = K[29];
        let W8 = Q6;
        $6 = [...q8, W8], K[12] = J, K[13] = _, K[14] = O, K[15] = O6, K[16] = J6, K[17] = $6
    } else O6 = K[15], J6 = K[16], $6 = K[17];
    let H6 = $6;
    if (!_.multiSelect && _.options.some(_4A)) {
        let q8;
        if (K[30] !== A || K[31] !== Y || K[32] !== N || K[33] !== j || K[34] !== H || K[35] !== X || K[36] !== P || K[37] !== f || K[38] !== G || K[39] !== Z || K[40] !== D || K[41] !== M || K[42] !== J || K[43] !== _ || K[44] !== O || K[45] !== z) q8 = Gz.default.createElement(nq5, {
            question: _,
            questions: z,
            currentQuestionIndex: Y,
            answers: A,
            questionStates: O,
            hideSubmitTab: N,
            minContentHeight: j,
            minContentWidth: H,
            onUpdateQuestionState: J,
            onAnswer: X,
            onTextInputFocus: M,
            onCancel: P,
            onTabPrev: D,
            onTabNext: Z,
            onRespondToClaude: G,
            onFinishPlanInterview: f
        }), K[30] = A, K[31] = Y, K[32] = N, K[33] = j, K[34] = H, K[35] = X, K[36] = P, K[37] = f, K[38] = G, K[39] = Z, K[40] = D, K[41] = M, K[42] = J, K[43] = _, K[44] = O, K[45] = z, K[46] = q8;
        else q8 = K[46];
        return q8
    }
    let o;
    if (K[47] !== R || K[48] !== $) o = R && $ && Gz.default.createElement(u, {
        flexDirection: "column",
        gap: 0
    }, Gz.default.createElement(zA, {
        color: "inactive"
    }), Gz.default.createElement(T, {
        color: "inactive"
    }, "Planning: ", Gz.default.createElement(YG, {
        filePath: $
    }))), K[47] = R, K[48] = $, K[49] = o;
    else o = K[49];
    let _6;
    if (K[50] === Symbol.for("react.memo_cache_sentinel")) _6 = Gz.default.createElement(u, {
        marginTop: -1
    }, Gz.default.createElement(zA, {
        color: "inactive"
    })), K[50] = _6;
    else _6 = K[50];
    let r;
    if (K[51] !== A || K[52] !== Y || K[53] !== N || K[54] !== z) r = Gz.default.createElement(_m6, {
        questions: z,
        currentQuestionIndex: Y,
        answers: A,
        hideSubmitTab: N
    }), K[51] = A, K[52] = Y, K[53] = N, K[54] = z, K[55] = r;
    else r = K[55];
    let t;
    if (K[56] !== _.question) t = Gz.default.createElement(X36, {
        title: _.question,
        color: "text"
    }), K[56] = _.question, K[57] = t;
    else t = K[57];
    let Y6;
    if (K[58] !== Y || K[59] !== c || K[60] !== O6 || K[61] !== h || K[62] !== X || K[63] !== P || K[64] !== v || K[65] !== k || K[66] !== W || K[67] !== J || K[68] !== H6 || K[69] !== V || K[70] !== _.multiSelect || K[71] !== _.question || K[72] !== O || K[73] !== J6 || K[74] !== z.length) Y6 = Gz.default.createElement(u, {
        marginTop: 1
    }, _.multiSelect ? Gz.default.createElement(J36, {
        key: _.question,
        options: H6,
        defaultValue: O[_.question]?.selectedValue,
        onChange: (q8) => {
            J(J6, {
                selectedValue: q8
            }, !0);
            let L8 = q8.includes("__other__") ? O[J6]?.textInputValue : void 0,
                w8 = q8.filter(K4A).concat(L8 ? [L8] : []);
            X(J6, w8, void 0, !1)
        },
        onFocus: c,
        onCancel: P,
        submitButtonText: Y === z.length - 1 ? "Submit" : "Next",
        onSubmit: W,
        onDownFromLastItem: l,
        isDisabled: h,
        onOpenEditor: O6,
        onImagePaste: v,
        pastedContents: V,
        onRemoveImage: k
    }) : Gz.default.createElement(A1, {
        key: _.question,
        options: H6,
        defaultValue: O[_.question]?.selectedValue,
        onChange: (q8) => {
            J(J6, {
                selectedValue: q8
            }, !1);
            let L8 = q8 === "__other__" ? O[J6]?.textInputValue : void 0;
            X(J6, q8, L8)
        },
        onFocus: c,
        onCancel: P,
        onDownFromLastItem: l,
        isDisabled: h,
        layout: "compact-vertical",
        onOpenEditor: O6,
        onImagePaste: v,
        pastedContents: V,
        onRemoveImage: k
    })), K[58] = Y, K[59] = c, K[60] = O6, K[61] = h, K[62] = X, K[63] = P, K[64] = v, K[65] = k, K[66] = W, K[67] = J, K[68] = H6, K[69] = V, K[70] = _.multiSelect, K[71] = _.question, K[72] = O, K[73] = J6, K[74] = z.length, K[75] = Y6;
    else Y6 = K[75];
    let X6;
    if (K[76] === Symbol.for("react.memo_cache_sentinel")) X6 = Gz.default.createElement(zA, {
        color: "inactive"
    }), K[76] = X6;
    else X6 = K[76];
    let M6;
    if (K[77] !== x || K[78] !== h) M6 = h && x === 0 ? Gz.default.createElement(T, {
        color: "suggestion"
    }, e6.pointer) : Gz.default.createElement(T, null, " "), K[77] = x, K[78] = h, K[79] = M6;
    else M6 = K[79];
    let W6 = h && x === 0 ? "suggestion" : void 0,
        V6 = H6.length + 1,
        f6;
    if (K[80] !== W6 || K[81] !== V6) f6 = Gz.default.createElement(T, {
        color: W6
    }, V6, ". Chat about this"), K[80] = W6, K[81] = V6, K[82] = f6;
    else f6 = K[82];
    let G6;
    if (K[83] !== M6 || K[84] !== f6) G6 = Gz.default.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, M6, f6), K[83] = M6, K[84] = f6, K[85] = G6;
    else G6 = K[85];
    let k6;
    if (K[86] !== x || K[87] !== h || K[88] !== R || K[89] !== H6.length) k6 = R && Gz.default.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, h && x === 1 ? Gz.default.createElement(T, {
        color: "suggestion"
    }, e6.pointer) : Gz.default.createElement(T, null, " "), Gz.default.createElement(T, {
        color: h && x === 1 ? "suggestion" : void 0
    }, H6.length + 2, ". Skip interview and plan immediately")), K[86] = x, K[87] = h, K[88] = R, K[89] = H6.length, K[90] = k6;
    else k6 = K[90];
    let T6;
    if (K[91] !== G6 || K[92] !== k6) T6 = Gz.default.createElement(u, {
        flexDirection: "column"
    }, X6, G6, k6), K[91] = G6, K[92] = k6, K[93] = T6;
    else T6 = K[93];
    let v6;
    if (K[94] === Symbol.for("react.memo_cache_sentinel")) v6 = Gz.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), K[94] = v6;
    else v6 = K[94];
    let L6;
    if (K[95] !== z.length) L6 = z.length === 1 ? Gz.default.createElement(A8, {
        chord: ["up", "down"],
        action: "navigate"
    }) : Gz.default.createElement(T, null, "Tab/Arrow keys to navigate"), K[95] = z.length, K[96] = L6;
    else L6 = K[96];
    let y6;
    if (K[97] !== m) y6 = m && U && Gz.default.createElement(A8, {
        chord: "ctrl+g",
        action: `edit in ${U}`
    }), K[97] = m, K[98] = y6;
    else y6 = K[98];
    let c6;
    if (K[99] === Symbol.for("react.memo_cache_sentinel")) c6 = Gz.default.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }), K[99] = c6;
    else c6 = K[99];
    let Z8;
    if (K[100] !== L6 || K[101] !== y6) Z8 = Gz.default.createElement(u, {
        marginTop: 1
    }, Gz.default.createElement(T, {
        color: "inactive",
        dimColor: !0
    }, Gz.default.createElement(z1, null, v6, L6, y6, c6))), K[100] = L6, K[101] = y6, K[102] = Z8;
    else Z8 = K[102];
    let N8;
    if (K[103] !== j || K[104] !== Y6 || K[105] !== T6 || K[106] !== Z8) N8 = Gz.default.createElement(u, {
        flexDirection: "column",
        minHeight: j
    }, Y6, T6, Z8), K[103] = j, K[104] = Y6, K[105] = T6, K[106] = Z8, K[107] = N8;
    else N8 = K[107];
    let R6;
    if (K[108] !== r || K[109] !== t || K[110] !== N8) R6 = Gz.default.createElement(u, {
        flexDirection: "column",
        paddingTop: 0
    }, r, t, N8), K[108] = r, K[109] = t, K[110] = N8, K[111] = R6;
    else R6 = K[111];
    let p6;
    if (K[112] !== i || K[113] !== R6 || K[114] !== o) p6 = Gz.default.createElement(u, {
        flexDirection: "column",
        marginTop: 0,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: i
    }, o, _6, R6), K[112] = i, K[113] = R6, K[114] = o, K[115] = p6;
    else p6 = K[115];
    return p6
}
// @from(Ln 517203, Col 0)
function K4A(q) {
    return q !== "__other__"
}
// @from(Ln 517207, Col 0)
function _4A(q) {
    return q.preview
}
// @from(Ln 517211, Col 0)
function z4A(q) {
    return {
        type: "text",
        value: q.label,
        label: q.label,
        description: q.description
    }
}
// @from(Ln 517220, Col 0)
function Y4A(q) {
    return q.toolPermissionContext.mode
}
// @from(Ln 517223, Col 4)
Gz
// @from(Ln 517224, Col 4)
oq5 = L(() => {
    o6();
    Qq();
    g6();
    N7();
    Tn();
    kj();
    uS();
    g_();
    Nq();
    VR();
    u7();
    S96();
    J78();
    iq5();
    ta8();
    Gz = K6(P6(), 1)
})
// @from(Ln 517243, Col 0)
function O4A(q, K) {
    if (!q) return null;
    if (q.type === "classifier") {
        if (q.classifier === "auto-mode") return {
            reasonString: `Auto mode classifier requires confirmation for this ${K}.
${q.reason}`,
            configString: void 0,
            themeColor: "error"
        };
        return {
            reasonString: `Classifier ${Y8.bold(q.classifier)} requires confirmation for this ${K}.
${q.reason}`,
            configString: void 0
        }
    }
    switch (q.type) {
        case "rule":
            return {
                reasonString: `Permission rule ${Y8.bold(I9(q.rule.ruleValue))} requires confirmation for this ${K}.`, configString: q.rule.source === "policySettings" ? void 0 : "/permissions to update rules"
            };
        case "hook": {
            let _ = q.reason ? `:
${q.reason}` : ".",
                z = q.hookSource ? ` ${Y8.dim(`[${q.hookSource}]`)}` : "";
            return {
                reasonString: `Hook ${Y8.bold(q.hookName)} requires confirmation for this ${K}${_}${z}`,
                configString: "/hooks to update"
            }
        }
        case "safetyCheck":
        case "other":
            return {
                reasonString: q.reason, configString: void 0
            };
        case "workingDir":
            return {
                reasonString: q.reason, configString: "/permissions to update rules"
            };
        default:
            return null
    }
}
// @from(Ln 517286, Col 0)
function iT(q) {
    let K = s(11),
        {
            permissionResult: _,
            toolType: z
        } = q,
        Y = M8(w4A),
        A = _?.decisionReason,
        O;
    if (K[0] !== A || K[1] !== z) O = O4A(A, z), K[0] = A, K[1] = z, K[2] = O;
    else O = K[2];
    let w = O;
    if (!w) return null;
    let $ = w.themeColor ?? (_?.decisionReason?.type === "hook" && Y === "auto" ? "warning" : void 0),
        j;
    if (K[3] !== w.reasonString || K[4] !== $) j = $ ? zm6.default.createElement(T, {
        color: $
    }, w.reasonString) : zm6.default.createElement(T, null, zm6.default.createElement(v5, null, w.reasonString)), K[3] = w.reasonString, K[4] = $, K[5] = j;
    else j = K[5];
    let H;
    if (K[6] !== w.configString) H = w.configString && zm6.default.createElement(T, {
        dimColor: !0
    }, w.configString), K[6] = w.configString, K[7] = H;
    else H = K[7];
    let J;
    if (K[8] !== j || K[9] !== H) J = zm6.default.createElement(u, {
        marginBottom: 1,
        flexDirection: "column"
    }, j, H), K[8] = j, K[9] = H, K[10] = J;
    else J = K[10];
    return J
}
// @from(Ln 517319, Col 0)
function w4A(q) {
    return q.toolPermissionContext.mode
}
// @from(Ln 517322, Col 4)
zm6
// @from(Ln 517323, Col 4)
V66 = L(() => {
    o6();
    Y3();
    g6();
    N7();
    cZ();
    dN6();
    zm6 = K6(P6(), 1)
})
// @from(Ln 517333, Col 0)
function aq5(q) {
    let K = s(27),
        {
            questions: _,
            currentQuestionIndex: z,
            answers: Y,
            allQuestionsAnswered: A,
            permissionResult: O,
            minContentHeight: w,
            onFinalResponse: $
        } = q,
        j;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) j = fZ.default.createElement(zA, {
        color: "inactive"
    }), K[0] = j;
    else j = K[0];
    let H;
    if (K[1] !== Y || K[2] !== z || K[3] !== _) H = fZ.default.createElement(_m6, {
        questions: _,
        currentQuestionIndex: z,
        answers: Y
    }), K[1] = Y, K[2] = z, K[3] = _, K[4] = H;
    else H = K[4];
    let J;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) J = fZ.default.createElement(X36, {
        title: "Review your answers",
        color: "text"
    }), K[5] = J;
    else J = K[5];
    let X;
    if (K[6] !== A) X = !A && fZ.default.createElement(u, {
        marginBottom: 1
    }, fZ.default.createElement(T, {
        color: "warning"
    }, e6.warning, " You have not answered all questions")), K[6] = A, K[7] = X;
    else X = K[7];
    let M;
    if (K[8] !== Y || K[9] !== _) M = Object.keys(Y).length > 0 && fZ.default.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, _.filter((V) => V?.question && Y[V.question]).map((V) => {
        let k = Y[V?.question];
        return fZ.default.createElement(u, {
            key: V?.question || "answer",
            flexDirection: "column",
            marginLeft: 1
        }, fZ.default.createElement(T, null, e6.bullet, " ", V?.question || "Question"), fZ.default.createElement(u, {
            marginLeft: 2
        }, fZ.default.createElement(T, {
            color: "success"
        }, e6.arrowRight, " ", k)))
    })), K[8] = Y, K[9] = _, K[10] = M;
    else M = K[10];
    let P;
    if (K[11] !== O) P = fZ.default.createElement(iT, {
        permissionResult: O,
        toolType: "tool"
    }), K[11] = O, K[12] = P;
    else P = K[12];
    let W;
    if (K[13] === Symbol.for("react.memo_cache_sentinel")) W = fZ.default.createElement(T, {
        color: "inactive"
    }, "Ready to submit your answers?"), K[13] = W;
    else W = K[13];
    let D;
    if (K[14] === Symbol.for("react.memo_cache_sentinel")) D = {
        type: "text",
        label: "Submit answers",
        value: "submit"
    }, K[14] = D;
    else D = K[14];
    let Z;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) Z = [D, {
        type: "text",
        label: "Cancel",
        value: "cancel"
    }], K[15] = Z;
    else Z = K[15];
    let G;
    if (K[16] !== $) G = fZ.default.createElement(u, {
        marginTop: 1
    }, fZ.default.createElement(A1, {
        options: Z,
        onChange: (V) => $(V),
        onCancel: () => $("cancel")
    })), K[16] = $, K[17] = G;
    else G = K[17];
    let f;
    if (K[18] !== w || K[19] !== G || K[20] !== X || K[21] !== M || K[22] !== P) f = fZ.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1,
        minHeight: w
    }, X, M, P, W, G), K[18] = w, K[19] = G, K[20] = X, K[21] = M, K[22] = P, K[23] = f;
    else f = K[23];
    let v;
    if (K[24] !== f || K[25] !== H) v = fZ.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, j, fZ.default.createElement(u, {
        flexDirection: "column",
        borderTop: !0,
        borderColor: "inactive",
        paddingTop: 0
    }, H, J, f)), K[24] = f, K[25] = H, K[26] = v;
    else v = K[26];
    return v
}
// @from(Ln 517440, Col 4)
fZ
// @from(Ln 517441, Col 4)
sq5 = L(() => {
    o6();
    Qq();
    g6();
    g_();
    VR();
    J78();
    V66();
    ta8();
    fZ = K6(P6(), 1)
})
// @from(Ln 517453, Col 0)
function $4A(q, K) {
    switch (K.type) {
        case "next-question":
            return {
                ...q, currentQuestionIndex: q.currentQuestionIndex + 1, isInTextInput: !1
            };
        case "prev-question":
            return {
                ...q, currentQuestionIndex: Math.max(0, q.currentQuestionIndex - 1), isInTextInput: !1
            };
        case "update-question-state": {
            let _ = q.questionStates[K.questionText],
                z = {
                    selectedValue: K.updates.selectedValue ?? _?.selectedValue ?? (K.isMultiSelect ? [] : void 0),
                    textInputValue: K.updates.textInputValue ?? _?.textInputValue ?? ""
                };
            return {
                ...q,
                questionStates: {
                    ...q.questionStates,
                    [K.questionText]: z
                }
            }
        }
        case "set-answer": {
            let _ = {
                ...q,
                answers: {
                    ...q.answers,
                    [K.questionText]: K.answer
                }
            };
            if (K.shouldAdvance) return {
                ..._,
                currentQuestionIndex: _.currentQuestionIndex + 1,
                isInTextInput: !1
            };
            return _
        }
        case "set-text-input-mode":
            return {
                ...q, isInTextInput: K.isInInput
            }
    }
}
// @from(Ln 517499, Col 0)
function tq5() {
    let [q, K] = Zz6.useReducer($4A, j4A), _ = Zz6.useCallback(() => {
        K({
            type: "next-question"
        })
    }, []), z = Zz6.useCallback(() => {
        K({
            type: "prev-question"
        })
    }, []), Y = Zz6.useCallback((w, $, j) => {
        K({
            type: "update-question-state",
            questionText: w,
            updates: $,
            isMultiSelect: j
        })
    }, []), A = Zz6.useCallback((w, $, j = !0) => {
        K({
            type: "set-answer",
            questionText: w,
            answer: $,
            shouldAdvance: j
        })
    }, []), O = Zz6.useCallback((w) => {
        K({
            type: "set-text-input-mode",
            isInInput: w
        })
    }, []);
    return {
        currentQuestionIndex: q.currentQuestionIndex,
        answers: q.answers,
        questionStates: q.questionStates,
        isInTextInput: q.isInTextInput,
        nextQuestion: _,
        prevQuestion: z,
        updateQuestionState: Y,
        setAnswer: A,
        setTextInputMode: O
    }
}
// @from(Ln 517540, Col 4)
Zz6
// @from(Ln 517540, Col 9)
j4A
// @from(Ln 517541, Col 4)
eq5 = L(() => {
    Zz6 = K6(P6(), 1);
    j4A = {
        currentQuestionIndex: 0,
        answers: {},
        questionStates: {},
        isInTextInput: !1
    }
})
// @from(Ln 517551, Col 0)
function K45(q) {
    let K = s(4);
    if (iO().syntaxHighlightingDisabled) {
        let Y;
        if (K[0] !== q) Y = jW.default.createElement(oX7, {
            ...q,
            highlight: null
        }), K[0] = q, K[1] = Y;
        else Y = K[1];
        return Y
    }
    let z;
    if (K[2] !== q) z = jW.default.createElement(jW.Suspense, {
        fallback: jW.default.createElement(oX7, {
            ...q,
            highlight: null
        })
    }, jW.default.createElement(X4A, {
        ...q
    })), K[2] = q, K[3] = z;
    else z = K[3];
    return z
}
// @from(Ln 517575, Col 0)
function X4A(q) {
    let K = s(4),
        _;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) _ = Y36(), K[0] = _;
    else _ = K[0];
    let z = jW.use(_),
        Y;
    if (K[1] !== z || K[2] !== q) Y = jW.default.createElement(oX7, {
        ...q,
        highlight: z
    }), K[1] = z, K[2] = q, K[3] = Y;
    else Y = K[3];
    return Y
}