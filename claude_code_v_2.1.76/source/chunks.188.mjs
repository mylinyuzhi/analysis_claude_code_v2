
// @from(Ln 485103, Col 0)
function RSq(A, q, K) {
    let Y = Uh.useRef(null),
        z = Uh.useRef(void 0),
        _ = Uh.useRef(0),
        w = Uh.useRef(new Set),
        O = Uh.useRef(void 0),
        $ = Uh.useRef(0),
        H = xA(),
        j = S5(),
        J = M1((P) => P.replBridgeEnabled),
        M = M1((P) => P.replBridgeConnected),
        D = M1((P) => P.replBridgeInitialName);
    return Uh.useEffect(() => {
        {
            if (!J) return;
            if ($.current >= HPz) {
                k(`[bridge:repl] Hook: ${$.current} consecutive init failures, not retrying this session`), H((Z) => {
                    if (Z.replBridgeError === "Remote Control disabled after repeated failures this session. Restart to retry." && !Z.replBridgeEnabled) return Z;
                    return {
                        ...Z,
                        replBridgeError: "Remote Control disabled after repeated failures this session. Restart to retry.",
                        replBridgeEnabled: !1
                    }
                });
                return
            }
            let P = !1,
                W = A.length;
            return (async () => {
                try {
                    let v = function(I, g) {
                            if (P) return;
                            let B = Y.current;
                            switch (I) {
                                case "ready":
                                    H((b) => {
                                        let p = B ? z86(B.environmentId, B.sessionIngressUrl) : b.replBridgeConnectUrl,
                                            Q = B ? hZ(B.bridgeSessionId, B.sessionIngressUrl) : b.replBridgeSessionUrl,
                                            U = B?.environmentId,
                                            r = B?.bridgeSessionId;
                                        if (b.replBridgeConnected && !b.replBridgeSessionActive && !b.replBridgeReconnecting && b.replBridgeConnectUrl === p && b.replBridgeSessionUrl === Q && b.replBridgeEnvironmentId === U && b.replBridgeSessionId === r) return b;
                                        return {
                                            ...b,
                                            replBridgeConnected: !0,
                                            replBridgeSessionActive: !1,
                                            replBridgeReconnecting: !1,
                                            replBridgeConnectUrl: p,
                                            replBridgeSessionUrl: Q,
                                            replBridgeEnvironmentId: U,
                                            replBridgeSessionId: r,
                                            replBridgeError: void 0
                                        }
                                    });
                                    break;
                                case "connected":
                                    H((b) => {
                                        if (b.replBridgeSessionActive) return b;
                                        return {
                                            ...b,
                                            replBridgeConnected: !0,
                                            replBridgeSessionActive: !0,
                                            replBridgeReconnecting: !1,
                                            replBridgeError: void 0
                                        }
                                    });
                                    break;
                                case "reconnecting":
                                    H((b) => {
                                        if (b.replBridgeReconnecting) return b;
                                        return {
                                            ...b,
                                            replBridgeReconnecting: !0,
                                            replBridgeSessionActive: !1
                                        }
                                    });
                                    break;
                                case "failed":
                                    clearTimeout(O.current), H((b) => ({
                                        ...b,
                                        replBridgeError: g,
                                        replBridgeReconnecting: !1,
                                        replBridgeSessionActive: !1,
                                        replBridgeConnected: !1
                                    })), O.current = setTimeout(() => {
                                        if (P) return;
                                        O.current = void 0, H((b) => {
                                            if (!b.replBridgeError) return b;
                                            return {
                                                ...b,
                                                replBridgeEnabled: !1,
                                                replBridgeError: void 0
                                            }
                                        })
                                    }, Rs8);
                                    break
                            }
                        },
                        V = function(I) {
                            let g = I.response?.request_id;
                            if (!g) return;
                            let B = N.get(g);
                            if (!B) {
                                k(`[bridge:repl] No handler for control_response request_id=${g}`);
                                return
                            }
                            N.delete(g);
                            let b = I.response;
                            if (b.subtype === "success" && b.response && VSq(b.response)) B(b.response)
                        };
                    if (z.current) k("[bridge:repl] Hook: waiting for previous teardown to complete before re-init"), await z.current, z.current = void 0, k("[bridge:repl] Hook: previous teardown complete, proceeding with re-init");
                    if (P) return;
                    let {
                        initReplBridge: Z
                    } = await Promise.resolve().then(() => (Ns8(), vs8)), G = !1;
                    async function f(I) {
                        try {
                            let g = _I1(I);
                            if (!g) return;
                            let {
                                content: B
                            } = g, {
                                uuid: b
                            } = g, {
                                extractInboundAttachments: p,
                                resolveInboundAttachments: Q
                            } = await Promise.resolve().then(() => (LSq(), ySq)), U = p(I);
                            if (U.length > 0) {
                                k(`[bridge:repl] Resolving ${U.length} inbound attachment(s)`);
                                let e = await Q(U);
                                B = jPz(B, e)
                            }
                            let r = typeof B === "string" ? B.slice(0, 80) : `[${B.length} content blocks]`;
                            k(`[bridge:repl] Injecting inbound user message: ${r}${b?` uuid=${b}`:""}`), _0({
                                value: B,
                                mode: "prompt",
                                uuid: b,
                                skipSlashCommands: !0
                            })
                        } catch (g) {
                            k(`[bridge:repl] handleInboundMessage failed: ${g}`, {
                                level: "error"
                            })
                        }
                    }
                    let N = new Map,
                        L = await Z({
                            onInboundMessage: f,
                            onPermissionResponse: V,
                            onInterrupt() {
                                K.current?.abort()
                            },
                            onSetModel(I) {
                                let g = I === "default" ? null : I ?? null;
                                MW(g), H((B) => {
                                    if (B.mainLoopModelForSession === g) return B;
                                    return {
                                        ...B,
                                        mainLoopModelForSession: g
                                    }
                                })
                            },
                            onSetMaxThinkingTokens(I) {
                                let g = I !== null;
                                H((B) => {
                                    if (B.thinkingEnabled === g) return B;
                                    return {
                                        ...B,
                                        thinkingEnabled: g
                                    }
                                })
                            },
                            onSetPermissionMode(I) {
                                if (I === "bypassPermissions") {
                                    if (bd()) return {
                                        ok: !1,
                                        error: "Cannot set permission mode to bypassPermissions because it is disabled by settings or configuration"
                                    };
                                    if (!j.getState().toolPermissionContext.isBypassPermissionsModeAvailable) return {
                                        ok: !1,
                                        error: "Cannot set permission mode to bypassPermissions because the session was not launched with --dangerously-skip-permissions"
                                    }
                                }
                                if (I === "auto" && !IN()) return {
                                    ok: !1,
                                    error: "Cannot set permission mode to auto because the dangerous action classifier is not enabled"
                                };
                                return H((g) => {
                                    let B = g.toolPermissionContext.mode;
                                    if (B === I) return g;
                                    let b = ki(B, I, g.toolPermissionContext);
                                    return {
                                        ...g,
                                        toolPermissionContext: {
                                            ...b,
                                            mode: I
                                        }
                                    }
                                }), setImmediate(() => {
                                    Dl()?.((g) => {
                                        return g.forEach((B) => {
                                            B.recheckPermission()
                                        }), g
                                    })
                                }), {
                                    ok: !0
                                }
                            },
                            onStateChange: v,
                            initialMessages: A.length > 0 ? A : void 0,
                            previouslyFlushedUUIDs: w.current,
                            initialName: D,
                            perpetual: G
                        });
                    if (P) {
                        if (k(`[bridge:repl] Hook: init cancelled during flight, tearing down${L?` env=${L.environmentId}`:""}`), L) L.teardown();
                        return
                    }
                    if (!L) {
                        $.current++, k(`[bridge:repl] Init returned null (precondition or session creation failed); consecutive failures: ${$.current}`), clearTimeout(O.current), H((I) => ({
                            ...I,
                            replBridgeError: I.replBridgeError ?? "Remote Control initialization failed. Check debug logs for details."
                        })), O.current = setTimeout(() => {
                            if (P) return;
                            O.current = void 0, H((I) => {
                                if (!I.replBridgeError) return I;
                                return {
                                    ...I,
                                    replBridgeEnabled: !1,
                                    replBridgeError: void 0
                                }
                            })
                        }, Rs8);
                        return
                    }
                    Y.current = L, $.current = 0, _.current = W;
                    let h = {
                        sendRequest(I, g, B, b, p, Q, U) {
                            L.sendControlRequest({
                                type: "control_request",
                                request_id: I,
                                request: {
                                    subtype: "can_use_tool",
                                    tool_name: g,
                                    input: B,
                                    tool_use_id: b,
                                    description: p,
                                    ...Q ? {
                                        permission_suggestions: Q
                                    } : {},
                                    ...U ? {
                                        blocked_path: U
                                    } : {}
                                }
                            })
                        },
                        sendResponse(I, g) {
                            let B = {
                                ...g
                            };
                            L.sendControlResponse({
                                type: "control_response",
                                response: {
                                    subtype: "success",
                                    request_id: I,
                                    response: B
                                }
                            })
                        },
                        cancelRequest(I) {
                            L.sendControlCancelRequest(I)
                        },
                        onResponse(I, g) {
                            return N.set(I, g), () => {
                                N.delete(I)
                            }
                        }
                    };
                    H((I) => ({
                        ...I,
                        replBridgePermissionCallbacks: h
                    }));
                    let R = hZ(L.bridgeSessionId, L.sessionIngressUrl),
                        u = z86(L.environmentId, L.sessionIngressUrl);
                    H((I) => {
                        if (I.replBridgeConnected && I.replBridgeSessionUrl === R) return I;
                        return {
                            ...I,
                            replBridgeConnected: !0,
                            replBridgeSessionUrl: R,
                            replBridgeConnectUrl: u,
                            replBridgeEnvironmentId: L.environmentId,
                            replBridgeSessionId: L.bridgeSessionId,
                            replBridgeError: void 0
                        }
                    }), q((I) => [...I, vTq(R)]), k(`[bridge:repl] Hook initialized, session=${L.bridgeSessionId}`)
                } catch (Z) {
                    if (P) return;
                    $.current++;
                    let G = _1(Z);
                    k(`[bridge:repl] Init failed: ${G}; consecutive failures: ${$.current}`), clearTimeout(O.current), H((f) => ({
                        ...f,
                        replBridgeError: G
                    })), O.current = setTimeout(() => {
                        if (P) return;
                        O.current = void 0, H((f) => {
                            if (!f.replBridgeError) return f;
                            return {
                                ...f,
                                replBridgeEnabled: !1,
                                replBridgeError: void 0
                            }
                        })
                    }, Rs8), q((f) => [...f, P$(`Remote Control failed to connect: ${G}`, "warning")])
                }
            })(), () => {
                if (P = !0, clearTimeout(O.current), O.current = void 0, Y.current) k(`[bridge:repl] Hook cleanup: starting teardown for env=${Y.current.environmentId} session=${Y.current.bridgeSessionId}`), z.current = Y.current.teardown(), Y.current = null;
                H((Z) => {
                    if (!Z.replBridgeConnected && !Z.replBridgeSessionActive && !Z.replBridgeError) return Z;
                    return {
                        ...Z,
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
                }), _.current = 0
            }
        }
    }, [J, H, q]), Uh.useEffect(() => {
        {
            if (!M) return;
            let P = Y.current;
            if (!P) return;
            if (_.current > A.length) k(`[bridge:repl] Compaction detected: lastWrittenIndex=${_.current} > messages.length=${A.length}, clamping`);
            let W = Math.min(_.current, A.length),
                Z = [];
            for (let G = W; G < A.length; G++) {
                let f = A[G];
                if (f && (f.type === "user" || f.type === "assistant" || f.type === "system" && f.subtype === "local_command")) Z.push(f)
            }
            if (_.current = A.length, Z.length > 0) P.writeMessages(Z)
        }
    }, [A, M]), {
        sendBridgeResult: Uh.useCallback(() => {
            Y.current?.sendResult()
        }, [])
    }
}
// @from(Ln 485456, Col 4)
Uh
// @from(Ln 485456, Col 8)
Rs8 = 1e4
// @from(Ln 485457, Col 4)
HPz = 3
// @from(Ln 485458, Col 4)
hSq = E(() => {
    NA();
    _86();
    JA();
    H1();
    aH();
    T1();
    rJ();
    kSq();
    s8();
    Uh = t(P6(), 1)
})
// @from(Ln 485471, Col 0)
function CSq(A) {
    SSq.useEffect(() => {
        if (!A.length) return;
        let q = Gv(A);
        if (q) q.client.setNotificationHandler(JPz(), async (K) => {
            let {
                eventName: Y,
                eventData: z
            } = K.params;
            d(`tengu_ide_${Y}`, z)
        })
    }, [A])
}
// @from(Ln 485484, Col 4)
SSq
// @from(Ln 485484, Col 9)
JPz
// @from(Ln 485485, Col 4)
ISq = E(() => {
    K7();
    V1();
    Sw();
    SSq = t(P6(), 1), JPz = F6(() => C.object({
        method: C.literal("log_event"),
        params: C.object({
            eventName: C.string(),
            eventData: C.object({}).passthrough()
        })
    }))
})
// @from(Ln 485498, Col 0)
function ZI1(A) {
    let q = A6(26),
        {
            file_path: K,
            edits: Y
        } = A,
        {
            columns: z
        } = KA(),
        _;
    if (q[0] !== K) _ = $1().existsSync(K) ? IM(K) : "", q[0] = K, q[1] = _;
    else _ = q[1];
    let w = _,
        O;
    if (q[2] !== Y || q[3] !== w) {
        let P;
        if (q[5] !== w) P = (W) => {
            let Z = sq6(w, W.old_string) || W.old_string,
                G = hD6(W.old_string, Z, W.new_string);
            return {
                ...W,
                old_string: Z,
                new_string: G
            }
        }, q[5] = w, q[6] = P;
        else P = q[6];
        O = Y.filter(DPz).map(P), q[2] = Y, q[3] = w, q[4] = O
    } else O = q[4];
    let $ = O,
        H;
    if (q[7] !== w || q[8] !== K || q[9] !== $) H = SL({
        filePath: K,
        fileContents: w,
        edits: $
    }), q[7] = w, q[8] = K, q[9] = $, q[10] = H;
    else H = q[10];
    let j = H,
        J;
    if (q[11] !== w) J = w.split(`
`)[0] ?? null, q[11] = w, q[12] = J;
    else J = q[12];
    let M = J,
        D;
    if (q[13] !== z || q[14] !== w || q[15] !== K || q[16] !== M || q[17] !== j) {
        let P;
        if (q[19] !== z || q[20] !== w || q[21] !== K || q[22] !== M) P = (W) => Bi.createElement(DN, {
            key: W.newStart,
            patch: W,
            dim: !1,
            filePath: K,
            firstLine: M,
            fileContent: w,
            width: z
        }), q[19] = z, q[20] = w, q[21] = K, q[22] = M, q[23] = P;
        else P = q[23];
        D = jh(j.map(P), MPz), q[13] = z, q[14] = w, q[15] = K, q[16] = M, q[17] = j, q[18] = D
    } else D = q[18];
    let X;
    if (q[24] !== D) X = Bi.createElement(m, {
        flexDirection: "column"
    }, Bi.createElement(m, {
        borderColor: "subtle",
        borderStyle: "dashed",
        flexDirection: "column",
        borderLeft: !1,
        borderRight: !1
    }, D)), q[24] = D, q[25] = X;
    else X = q[25];
    return X
}
// @from(Ln 485569, Col 0)
function MPz(A) {
    return Bi.createElement(T, {
        dimColor: !0,
        key: `ellipsis-${A}`
    }, "...")
}
// @from(Ln 485576, Col 0)
function DPz(A) {
    return A.old_string != null && A.new_string != null
}
// @from(Ln 485579, Col 4)
Bi
// @from(Ln 485580, Col 4)
hs8 = E(() => {
    e6();
    p66();
    i6();
    NU();
    Z7();
    SA();
    tq6();
    _q();
    Bi = t(P6(), 1)
})
// @from(Ln 485592, Col 0)
function AW(A) {
    d("tengu_unary_event", {
        event: A.event,
        completion_type: A.completion_type,
        language_name: A.metadata.language_name,
        message_id: A.metadata.message_id,
        platform: A.metadata.platform,
        ...A.metadata.hasFeedback !== void 0 && {
            hasFeedback: A.metadata.hasFeedback
        }
    })
}
// @from(Ln 485604, Col 4)
GV6 = E(() => {
    V1()
})
// @from(Ln 485608, Col 0)
function BF(A, q) {
    let K = xA(),
        Y = GI1.useRef(null);
    GI1.useEffect(() => {
        if (Y.current === A.toolUseID) return;
        Y.current = A.toolUseID, K((_) => ({
            ..._,
            attribution: {
                ..._.attribution,
                permissionPromptCount: _.attribution.permissionPromptCount + 1
            }
        })), d("tengu_tool_use_show_permission_request", {
            messageID: A.assistantMessage.message.id,
            toolName: hq(A.tool.name),
            isMcp: A.tool.isMcp ?? !1,
            decisionReasonType: A.permissionResult.decisionReason?.type,
            sandboxEnabled: vA.isSandboxingEnabled()
        }), Promise.resolve(q.language_name).then((_) => {
            AW({
                completion_type: q.completion_type,
                event: "response",
                metadata: {
                    language_name: _,
                    message_id: A.assistantMessage.message.id,
                    platform: Q8.platform
                }
            })
        })
    }, [A, q, K])
}
// @from(Ln 485638, Col 4)
GI1
// @from(Ln 485639, Col 4)
fV6 = E(() => {
    V1();
    o$();
    jZ();
    OZ();
    SP();
    F$();
    d3();
    GV6();
    Lz();
    g1();
    NA();
    GI1 = t(P6(), 1)
})
// @from(Ln 485662, Col 0)
function ZPz(A) {
    let q = L4(A),
        K = L4(`${AA()}/.claude`),
        Y = BN(q),
        z = BN(K);
    return Y.startsWith(z + bSq.toLowerCase()) || Y.startsWith(z + "/")
}
// @from(Ln 485670, Col 0)
function GPz(A) {
    let q = L4(A),
        K = PPz(WPz(), ".claude"),
        Y = BN(q),
        z = BN(K);
    return Y.startsWith(z + bSq.toLowerCase()) || Y.startsWith(z + "/")
}
// @from(Ln 485678, Col 0)
function xSq({
    filePath: A,
    toolPermissionContext: q,
    operationType: K = "write",
    onRejectFeedbackChange: Y,
    onAcceptFeedbackChange: z,
    yesInputMode: _ = !1,
    noInputMode: w = !1
}) {
    let O = [],
        $ = PX("chat:cycleMode", "Chat", "shift+tab");
    if (_ && z) O.push({
        type: "input",
        label: "Yes",
        value: "yes",
        placeholder: "and tell Claude what to do next",
        onChange: z,
        allowEmptySubmitToCancel: !0,
        option: {
            type: "accept-once"
        }
    });
    else O.push({
        label: "Yes",
        value: "yes",
        option: {
            type: "accept-once"
        }
    });
    let H = kI(A, q),
        j = ZPz(A),
        J = GPz(A);
    if ((j || J) && K !== "read") O.push({
        label: "Yes, and allow Claude to edit its own settings for this session",
        value: "yes-claude-folder",
        option: {
            type: "accept-session",
            scope: J ? "global-claude-folder" : "claude-folder"
        }
    });
    else {
        let M;
        if (H)
            if (K === "read") M = "Yes, during this session";
            else M = H86.default.createElement(T, null, "Yes, allow all edits during this session", " ", H86.default.createElement(T, {
                bold: !0
            }, "(", $, ")"));
        else {
            let D = dp(A),
                X = XPz(D) || "this directory";
            if (K === "read") M = H86.default.createElement(T, null, "Yes, allow reading from ", H86.default.createElement(T, {
                bold: !0
            }, X, "/"), " during this session");
            else M = H86.default.createElement(T, null, "Yes, allow all edits in ", H86.default.createElement(T, {
                bold: !0
            }, X, "/"), " during this session ", H86.default.createElement(T, {
                bold: !0
            }, "(", $, ")"))
        }
        O.push({
            label: M,
            value: "yes-session",
            option: {
                type: "accept-session"
            }
        })
    }
    if (w && Y) O.push({
        type: "input",
        label: "No",
        value: "no",
        placeholder: "and tell Claude what to do differently",
        onChange: Y,
        allowEmptySubmitToCancel: !0,
        option: {
            type: "reject"
        }
    });
    else O.push({
        label: "No",
        value: "no",
        option: {
            type: "reject"
        }
    });
    return O
}
// @from(Ln 485765, Col 4)
H86
// @from(Ln 485766, Col 4)
uSq = E(() => {
    i6();
    RY();
    ld();
    F9();
    T1();
    H86 = t(P6(), 1)
})
// @from(Ln 485775, Col 0)
function Ss8(A, q, K, Y, z) {
    AW({
        completion_type: q,
        event: A,
        metadata: {
            language_name: K,
            message_id: Y,
            platform: Q8.platform,
            hasFeedback: z ?? !1
        }
    })
}
// @from(Ln 485788, Col 0)
function fPz(A, q) {
    let {
        messageId: K,
        toolUseConfirm: Y,
        onDone: z,
        completionType: _,
        languageName: w
    } = A;
    Ss8("accept", _, w, K), d("tengu_accept_submitted", {
        toolName: hq(Y.tool.name),
        isMcp: Y.tool.isMcp ?? !1,
        has_instructions: !!q?.feedback,
        instructions_length: q?.feedback?.length ?? 0,
        entered_feedback_mode: q?.enteredFeedbackMode ?? !1
    }), z(), Y.onAllow(Y.input, [], q?.feedback)
}
// @from(Ln 485805, Col 0)
function TPz(A, q) {
    let {
        messageId: K,
        path: Y,
        toolUseConfirm: z,
        toolPermissionContext: _,
        onDone: w,
        completionType: O,
        languageName: $,
        operationType: H
    } = A;
    if (Ss8("accept", O, $, K), q?.scope === "claude-folder" || q?.scope === "global-claude-folder") {
        let J = q.scope === "global-claude-folder" ? E21 : k21,
            M = [{
                type: "addRules",
                rules: [{
                    toolName: R4,
                    ruleContent: J
                }],
                behavior: "allow",
                destination: "session"
            }];
        w(), z.onAllow(z.input, M);
        return
    }
    let j = Y ? Zo6(Y, H, _) : [];
    w(), z.onAllow(z.input, j)
}
// @from(Ln 485834, Col 0)
function vPz(A, q) {
    let {
        messageId: K,
        toolUseConfirm: Y,
        onDone: z,
        onReject: _,
        completionType: w,
        languageName: O
    } = A;
    Ss8("reject", w, O, K, q?.hasFeedback), d("tengu_reject_submitted", {
        toolName: hq(Y.tool.name),
        isMcp: Y.tool.isMcp ?? !1,
        has_instructions: !!q?.feedback,
        instructions_length: q?.feedback?.length ?? 0,
        entered_feedback_mode: q?.enteredFeedbackMode ?? !1
    }), z(), _(), Y.onReject(q?.feedback)
}
// @from(Ln 485851, Col 4)
mSq
// @from(Ln 485852, Col 4)
BSq = E(() => {
    GV6();
    d3();
    RY();
    V1();
    o$();
    mSq = {
        "accept-once": fPz,
        "accept-session": TPz,
        reject: vPz
    }
})
// @from(Ln 485865, Col 0)
function gSq({
    filePath: A,
    completionType: q,
    languageName: K,
    toolUseConfirm: Y,
    onDone: z,
    onReject: _,
    parseInput: w,
    operationType: O = "write"
}) {
    let $ = M1((g) => g.toolPermissionContext),
        [H, j] = qT.useState(""),
        [J, M] = qT.useState(""),
        [D, X] = qT.useState("yes"),
        [P, W] = qT.useState(!1),
        [Z, G] = qT.useState(!1),
        [f, v] = qT.useState(!1),
        [N, V] = qT.useState(!1),
        L = qT.useMemo(() => xSq({
            filePath: A,
            toolPermissionContext: $,
            operationType: O,
            onRejectFeedbackChange: M,
            onAcceptFeedbackChange: j,
            yesInputMode: P,
            noInputMode: Z
        }), [A, $, O, P, Z]),
        h = qT.useCallback((g, B, b) => {
            let p = {
                    messageId: Y.assistantMessage.message.id,
                    path: A,
                    toolUseConfirm: Y,
                    toolPermissionContext: $,
                    onDone: z,
                    onReject: _,
                    completionType: q,
                    languageName: K,
                    operationType: O
                },
                Q = Y.onAllow;
            Y.onAllow = (r, e, Y6) => {
                Q(B, e, Y6)
            };
            let U = mSq[g.type];
            U(p, {
                feedback: b,
                hasFeedback: !!b,
                enteredFeedbackMode: g.type === "accept-once" ? f : N,
                scope: g.type === "accept-session" ? g.scope : void 0
            })
        }, [A, q, K, Y, $, z, _, O, f, N]),
        R = qT.useCallback(() => {
            let g = L.find((B) => B.option.type === "accept-session");
            if (g) {
                let B = w(Y.input);
                h(g.option, B)
            }
        }, [L, w, Y.input, h]);
    tA({
        "confirm:cycleMode": R
    }, {
        context: "Confirmation"
    });
    let u = qT.useCallback((g) => {
            if (g !== "yes" && P && !H.trim()) W(!1);
            if (g !== "no" && Z && !J.trim()) G(!1);
            X(g)
        }, [P, Z, H, J]),
        I = qT.useCallback((g) => {
            let B = {
                toolName: hq(Y.tool.name),
                isMcp: Y.tool.isMcp ?? !1
            };
            if (g === "yes")
                if (P) W(!1), d("tengu_accept_feedback_mode_collapsed", B);
                else W(!0), v(!0), d("tengu_accept_feedback_mode_entered", B);
            else if (g === "no")
                if (Z) G(!1), d("tengu_reject_feedback_mode_collapsed", B);
                else G(!0), V(!0), d("tengu_reject_feedback_mode_entered", B)
        }, [P, Z, Y]);
    return {
        options: L,
        onChange: h,
        acceptFeedback: H,
        rejectFeedback: J,
        focusedOption: D,
        setFocusedOption: u,
        handleInputModeToggle: I,
        yesInputMode: P,
        noInputMode: Z
    }
}
// @from(Ln 485957, Col 4)
qT
// @from(Ln 485958, Col 4)
FSq = E(() => {
    _7();
    uSq();
    BSq();
    NA();
    V1();
    o$();
    qT = t(P6(), 1)
})
// @from(Ln 485974, Col 0)
function pSq({
    onChange: A,
    toolUseContext: q,
    filePath: K,
    edits: Y,
    editMode: z
}) {
    let _ = gi.useRef(!1),
        [w, O] = gi.useState(!1),
        $ = gi.useMemo(() => NPz().slice(0, 6), []),
        H = gi.useMemo(() => `✻ [Claude Code] ${VPz(K)} (${$}) ⧉`, [K, $]),
        j = L$1(q.options.mcpClients) && X1().diffTool === "auto" && !K.endsWith(".ipynb"),
        J = R$1(q.options.mcpClients) ?? "IDE";
    async function M() {
        if (!j) return;
        try {
            d("tengu_ext_will_show_diff", {});
            let {
                oldContent: D,
                newContent: X
            } = await EPz(K, Y, q, H);
            if (_.current) return;
            d("tengu_ext_diff_accepted", {});
            let P = kPz(K, D, X, z);
            if (P.length === 0) {
                d("tengu_ext_diff_rejected", {});
                let W = Gv(q.options.mcpClients);
                if (W) await Cs8(H, W);
                A({
                    type: "reject"
                }, {
                    file_path: K,
                    edits: Y
                });
                return
            }
            A({
                type: "accept-once"
            }, {
                file_path: K,
                edits: P
            })
        } catch (D) {
            _6(D), O(!0)
        }
    }
    return gi.useEffect(() => {
        return M(), () => {
            _.current = !0
        }
    }, []), {
        closeTabInIDE() {
            let D = Gv(q.options.mcpClients);
            if (!D) return Promise.resolve();
            return Cs8(H, D)
        },
        showingDiffInIDE: j && !w,
        ideName: J,
        hasError: w
    }
}
// @from(Ln 486036, Col 0)
function kPz(A, q, K, Y) {
    let z = Y === "single",
        _ = t21({
            filePath: A,
            oldContent: q,
            newContent: K,
            singleHunk: z
        });
    if (_.length === 0) return [];
    if (z && _.length > 1) _6(Error(`Unexpected number of hunks: ${_.length}. Expected 1 hunk.`));
    return gf7(_)
}
// @from(Ln 486048, Col 0)
async function EPz(A, q, K, Y) {
    let z = !1,
        _ = L4(A),
        w = "";
    try {
        w = IM(_)
    } catch (H) {
        if (H.code !== "ENOENT") throw H
    }
    async function O() {
        if (z) return;
        z = !0;
        try {
            await Cs8(Y, $)
        } catch (H) {
            _6(H)
        }
        process.off("beforeExit", O), K.abortController.signal.removeEventListener("abort", O)
    }
    K.abortController.signal.addEventListener("abort", O), process.on("beforeExit", O);
    let $ = Gv(K.options.mcpClients);
    try {
        let {
            updatedFile: H
        } = Qx6({
            filePath: _,
            fileContents: w,
            edits: q
        });
        if (!$ || $.type !== "connected") throw Error("IDE client not available");
        let j = _,
            J = $.config.ideRunningInWindows === !0;
        if (y8() === "wsl" && J && process.env.WSL_DISTRO_NAME) j = new nD6(process.env.WSL_DISTRO_NAME).toIDEPath(_);
        let M = await pC("openDiff", {
                old_file_path: j,
                new_file_path: j,
                new_file_contents: H,
                tab_name: Y
            }, $),
            D = Array.isArray(M) ? M : [M];
        if (RPz(D)) return O(), {
            oldContent: w,
            newContent: D[1].text
        };
        else if (yPz(D)) return O(), {
            oldContent: w,
            newContent: H
        };
        else if (LPz(D)) return O(), {
            oldContent: w,
            newContent: w
        };
        throw Error("Not accepted")
    } catch (H) {
        throw _6(H), O(), H
    }
}
// @from(Ln 486105, Col 0)
async function Cs8(A, q) {
    try {
        if (!q || q.type !== "connected") throw Error("IDE client not available");
        await pC("close_tab", {
            tab_name: A
        }, q)
    } catch (K) {
        _6(K)
    }
}
// @from(Ln 486116, Col 0)
function yPz(A) {
    return Array.isArray(A) && typeof A[0] === "object" && A[0] !== null && "type" in A[0] && A[0].type === "text" && "text" in A[0] && A[0].text === "TAB_CLOSED"
}
// @from(Ln 486120, Col 0)
function LPz(A) {
    return Array.isArray(A) && typeof A[0] === "object" && A[0] !== null && "type" in A[0] && A[0].type === "text" && "text" in A[0] && A[0].text === "DIFF_REJECTED"
}
// @from(Ln 486124, Col 0)
function RPz(A) {
    return Array.isArray(A) && A[0]?.type === "text" && A[0].text === "FILE_SAVED" && typeof A[1].text === "string"
}
// @from(Ln 486127, Col 4)
gi
// @from(Ln 486128, Col 4)
QSq = E(() => {
    tq6();
    NU();
    k1();
    k8();
    Sw();
    V1();
    Sw();
    F9();
    E$8();
    YK();
    Z7();
    gi = t(P6(), 1)
})
// @from(Ln 486147, Col 0)
function USq(A) {
    let q = A6(36),
        {
            onChange: K,
            options: Y,
            input: z,
            filePath: _,
            ideName: w,
            symlinkTarget: O,
            rejectFeedback: $,
            acceptFeedback: H,
            setFocusedOption: j,
            onInputModeToggle: J,
            focusedOption: M,
            yesInputMode: D,
            noInputMode: X
        } = A,
        P;
    if (q[0] !== w) P = dh.default.createElement(T, {
        bold: !0,
        color: "permission"
    }, "Opened changes in ", w, " ⧉"), q[0] = w, q[1] = P;
    else P = q[1];
    let W;
    if (q[2] !== O) W = O && dh.default.createElement(T, {
        color: "warning"
    }, SPz(G1(), O).startsWith("..") ? `This will modify ${O} (outside working directory) via a symlink` : `Symlink target: ${O}`), q[2] = O, q[3] = W;
    else W = q[3];
    let Z;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) Z = lu6() && dh.default.createElement(T, {
        dimColor: !0
    }, "Save file to continue…"), q[4] = Z;
    else Z = q[4];
    let G;
    if (q[5] !== _) G = hPz(_), q[5] = _, q[6] = G;
    else G = q[6];
    let f;
    if (q[7] !== G) f = dh.default.createElement(T, null, "Do you want to make this edit to", " ", dh.default.createElement(T, {
        bold: !0
    }, G), "?"), q[7] = G, q[8] = f;
    else f = q[8];
    let v;
    if (q[9] !== H || q[10] !== z || q[11] !== K || q[12] !== Y || q[13] !== $) v = (g) => {
        let B = Y.find((b) => b.value === g);
        if (B) {
            if (B.option.type === "reject") {
                let b = $.trim();
                K(B.option, z, b || void 0);
                return
            }
            if (B.option.type === "accept-once") {
                let b = H.trim();
                K(B.option, z, b || void 0);
                return
            }
            K(B.option, z)
        }
    }, q[9] = H, q[10] = z, q[11] = K, q[12] = Y, q[13] = $, q[14] = v;
    else v = q[14];
    let N;
    if (q[15] !== z || q[16] !== K) N = () => K({
        type: "reject"
    }, z), q[15] = z, q[16] = K, q[17] = N;
    else N = q[17];
    let V;
    if (q[18] !== j) V = (g) => j(g), q[18] = j, q[19] = V;
    else V = q[19];
    let L;
    if (q[20] !== J || q[21] !== Y || q[22] !== v || q[23] !== N || q[24] !== V) L = dh.default.createElement(T8, {
        options: Y,
        inlineDescriptions: !0,
        onChange: v,
        onCancel: N,
        onFocus: V,
        onInputModeToggle: J
    }), q[20] = J, q[21] = Y, q[22] = v, q[23] = N, q[24] = V, q[25] = L;
    else L = q[25];
    let h;
    if (q[26] !== f || q[27] !== L) h = dh.default.createElement(m, {
        flexDirection: "column"
    }, f, L), q[26] = f, q[27] = L, q[28] = h;
    else h = q[28];
    let R = (M === "yes" && !D || M === "no" && !X) && " · Tab to amend",
        u;
    if (q[29] !== R) u = dh.default.createElement(m, {
        marginTop: 1
    }, dh.default.createElement(T, {
        dimColor: !0
    }, "Esc to cancel", R)), q[29] = R, q[30] = u;
    else u = q[30];
    let I;
    if (q[31] !== P || q[32] !== h || q[33] !== u || q[34] !== W) I = dh.default.createElement(S3, {
        color: "permission"
    }, dh.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, P, W, Z, h, u)), q[31] = P, q[32] = h, q[33] = u, q[34] = W, q[35] = I;
    else I = q[35];
    return I
}
// @from(Ln 486247, Col 4)
dh
// @from(Ln 486248, Col 4)
dSq = E(() => {
    e6();
    i6();
    o9();
    Sw();
    FJ();
    lA();
    dh = t(P6(), 1)
})
// @from(Ln 486261, Col 0)
function gF(A) {
    let q = A6(79),
        {
            toolUseConfirm: K,
            toolUseContext: Y,
            onDone: z,
            onReject: _,
            title: w,
            subtitle: O,
            question: $,
            content: H,
            completionType: j,
            languageName: J,
            path: M,
            parseInput: D,
            operationType: X,
            ideDiffSupport: P,
            workerBadge: W
        } = A,
        Z = $ === void 0 ? "Do you want to proceed?" : $,
        G = j === void 0 ? "tool_use_single" : j,
        f = J === void 0 ? "none" : J,
        v = X === void 0 ? "write" : X,
        N;
    if (q[0] !== G || q[1] !== f) N = {
        completion_type: G,
        language_name: f
    }, q[0] = G, q[1] = f, q[2] = N;
    else N = q[2];
    BF(K, N);
    let L;
    A: {
        if (!M || v === "read") {
            L = null;
            break A
        }
        let Q6;
        if (q[3] !== M) {
            let u6 = L4(M),
                C6 = $1();
            Q6 = qO(C6, u6), q[3] = M, q[4] = Q6
        } else Q6 = q[4];
        let {
            resolvedPath: k6,
            isSymlink: Z6
        } = Q6;
        if (Z6) {
            L = k6;
            break A
        }
        L = null
    }
    let h = L,
        R = M || "",
        u;
    if (q[5] !== G || q[6] !== f || q[7] !== z || q[8] !== _ || q[9] !== v || q[10] !== D || q[11] !== R || q[12] !== K) u = {
        filePath: R,
        completionType: G,
        languageName: f,
        toolUseConfirm: K,
        onDone: z,
        onReject: _,
        parseInput: D,
        operationType: v
    }, q[5] = G, q[6] = f, q[7] = z, q[8] = _, q[9] = v, q[10] = D, q[11] = R, q[12] = K, q[13] = u;
    else u = q[13];
    let I = gSq(u),
        {
            options: g,
            acceptFeedback: B,
            rejectFeedback: b,
            setFocusedOption: p,
            handleInputModeToggle: Q,
            focusedOption: U,
            yesInputMode: r,
            noInputMode: e
        } = I,
        Y6, H6, J6;
    if (q[14] !== I || q[15] !== P || q[16] !== D || q[17] !== K.input || q[18] !== Y) H6 = D(K.input), Y6 = P ? P.getConfig(H6) : null, J6 = Y6 ? {
        onChange: (Q6, k6) => {
            let Z6 = P.applyChanges(H6, k6.edits);
            I.onChange(Q6, Z6)
        },
        toolUseContext: Y,
        filePath: Y6.filePath,
        edits: (Y6.edits || []).map(bPz),
        editMode: Y6.editMode || "single"
    } : {
        onChange: IPz,
        toolUseContext: Y,
        filePath: "",
        edits: [],
        editMode: "single"
    }, q[14] = I, q[15] = P, q[16] = D, q[17] = K.input, q[18] = Y, q[19] = Y6, q[20] = H6, q[21] = J6;
    else Y6 = q[19], H6 = q[20], J6 = q[21];
    let K6 = J6,
        {
            closeTabInIDE: s,
            showingDiffInIDE: X6,
            ideName: z6
        } = pSq(K6),
        N6;
    if (q[22] !== s || q[23] !== I || q[24] !== H6) N6 = (Q6, k6) => {
        s?.(), I.onChange(Q6, H6, k6?.trim())
    }, q[22] = s, q[23] = I, q[24] = H6, q[25] = N6;
    else N6 = q[25];
    let $6 = N6;
    if (X6 && Y6 && M) {
        let Q6;
        if (q[26] !== $6) Q6 = (Z6, u6, C6) => $6(Z6, C6), q[26] = $6, q[27] = Q6;
        else Q6 = q[27];
        let k6;
        if (q[28] !== B || q[29] !== U || q[30] !== Q || q[31] !== z6 || q[32] !== e || q[33] !== g || q[34] !== H6 || q[35] !== M || q[36] !== b || q[37] !== p || q[38] !== h || q[39] !== Q6 || q[40] !== r) k6 = ch.default.createElement(USq, {
            onChange: Q6,
            options: g,
            filePath: M,
            input: H6,
            ideName: z6,
            symlinkTarget: h,
            rejectFeedback: b,
            acceptFeedback: B,
            setFocusedOption: p,
            onInputModeToggle: Q,
            focusedOption: U,
            yesInputMode: r,
            noInputMode: e
        }), q[28] = B, q[29] = U, q[30] = Q, q[31] = z6, q[32] = e, q[33] = g, q[34] = H6, q[35] = M, q[36] = b, q[37] = p, q[38] = h, q[39] = Q6, q[40] = r, q[41] = k6;
        else k6 = q[41];
        return k6
    }
    let n;
    if (q[42] !== h) n = h != null && CPz(G1(), h).startsWith(".."), q[42] = h, q[43] = n;
    else n = q[43];
    let o = n,
        a;
    if (q[44] !== o || q[45] !== h) a = h ? ch.default.createElement(m, {
        paddingX: 1,
        marginBottom: 1
    }, ch.default.createElement(T, {
        color: "warning"
    }, o ? `This will modify ${h} (outside working directory) via a symlink` : `Symlink target: ${h}`)) : null, q[44] = o, q[45] = h, q[46] = a;
    else a = q[46];
    let i = a,
        l;
    if (q[47] !== Z) l = typeof Z === "string" ? ch.default.createElement(T, null, Z) : Z, q[47] = Z, q[48] = l;
    else l = q[48];
    let q6;
    if (q[49] !== B || q[50] !== $6 || q[51] !== g || q[52] !== b) q6 = (Q6) => {
        let k6 = g.find((Z6) => Z6.value === Q6);
        if (k6) {
            if (k6.option.type === "reject") {
                let Z6 = b.trim();
                $6(k6.option, Z6 || void 0);
                return
            }
            if (k6.option.type === "accept-once") {
                let Z6 = B.trim();
                $6(k6.option, Z6 || void 0);
                return
            }
            $6(k6.option)
        }
    }, q[49] = B, q[50] = $6, q[51] = g, q[52] = b, q[53] = q6;
    else q6 = q[53];
    let w6;
    if (q[54] !== $6) w6 = () => $6({
        type: "reject"
    }), q[54] = $6, q[55] = w6;
    else w6 = q[55];
    let O6;
    if (q[56] !== p) O6 = (Q6) => p(Q6), q[56] = p, q[57] = O6;
    else O6 = q[57];
    let L6;
    if (q[58] !== Q || q[59] !== g || q[60] !== q6 || q[61] !== w6 || q[62] !== O6) L6 = ch.default.createElement(T8, {
        options: g,
        inlineDescriptions: !0,
        onChange: q6,
        onCancel: w6,
        onFocus: O6,
        onInputModeToggle: Q
    }), q[58] = Q, q[59] = g, q[60] = q6, q[61] = w6, q[62] = O6, q[63] = L6;
    else L6 = q[63];
    let y6;
    if (q[64] !== l || q[65] !== L6) y6 = ch.default.createElement(m, {
        flexDirection: "column",
        paddingX: 1
    }, l, L6), q[64] = l, q[65] = L6, q[66] = y6;
    else y6 = q[66];
    let G6;
    if (q[67] !== H || q[68] !== O || q[69] !== i || q[70] !== y6 || q[71] !== w || q[72] !== W) G6 = ch.default.createElement(cz, {
        title: w,
        subtitle: O,
        innerPaddingX: 0,
        workerBadge: W
    }, i, H, y6), q[67] = H, q[68] = O, q[69] = i, q[70] = y6, q[71] = w, q[72] = W, q[73] = G6;
    else G6 = q[73];
    let R6 = (U === "yes" && !r || U === "no" && !e) && " · Tab to amend",
        T6;
    if (q[74] !== R6) T6 = ch.default.createElement(m, {
        paddingX: 1,
        marginTop: 1
    }, ch.default.createElement(T, {
        dimColor: !0
    }, "Esc to cancel", R6)), q[74] = R6, q[75] = T6;
    else T6 = q[75];
    let D6;
    if (q[76] !== G6 || q[77] !== T6) D6 = ch.default.createElement(ch.default.Fragment, null, G6, T6), q[76] = G6, q[77] = T6, q[78] = D6;
    else D6 = q[78];
    return D6
}
// @from(Ln 486472, Col 0)
function IPz() {}
// @from(Ln 486474, Col 0)
function bPz(A) {
    return {
        old_string: A.old_string,
        new_string: A.new_string,
        replace_all: A.replace_all || !1
    }
}
// @from(Ln 486481, Col 4)
ch
// @from(Ln 486482, Col 4)
TV6 = E(() => {
    e6();
    i6();
    o9();
    NZ();
    fV6();
    FSq();
    QSq();
    dSq();
    SA();
    lA();
    F9();
    ch = t(P6(), 1)
})
// @from(Ln 486497, Col 0)
function fI1(A, q, K, Y) {
    return {
        filePath: A,
        edits: [{
            old_string: q,
            new_string: K,
            replace_all: Y
        }],
        editMode: "single"
    }
}
// @from(Ln 486515, Col 0)
function cSq(A) {
    let q = A6(61),
        K = A.toolUseConfirm.input,
        Y = BPz,
        z, _, w, O, $, H, j, J, M, D, X, P, W, Z, G, f, v, N;
    if (q[7] !== A.onDone || q[8] !== A.onReject || q[9] !== A.toolUseConfirm || q[10] !== A.toolUseContext || q[11] !== A.workerBadge)({
        file_path: O,
        old_string: H,
        new_string: $,
        replace_all: j
    } = Y(A.toolUseConfirm.input)), w = gF, W = A.toolUseConfirm, Z = A.toolUseContext, G = A.onDone, f = A.onReject, v = A.workerBadge, N = "Edit file", D = uPz(G1(), O), _ = T, X = "Do you want to make this edit to", P = " ", z = T, J = !0, M = xPz(O), q[7] = A.onDone, q[8] = A.onReject, q[9] = A.toolUseConfirm, q[10] = A.toolUseContext, q[11] = A.workerBadge, q[12] = z, q[13] = _, q[14] = w, q[15] = O, q[16] = $, q[17] = H, q[18] = j, q[19] = J, q[20] = M, q[21] = D, q[22] = X, q[23] = P, q[24] = W, q[25] = Z, q[26] = G, q[27] = f, q[28] = v, q[29] = N;
    else z = q[12], _ = q[13], w = q[14], O = q[15], $ = q[16], H = q[17], j = q[18], J = q[19], M = q[20], D = q[21], X = q[22], P = q[23], W = q[24], Z = q[25], G = q[26], f = q[27], v = q[28], N = q[29];
    let V;
    if (q[30] !== z || q[31] !== J || q[32] !== M) V = wa6.default.createElement(z, {
        bold: J
    }, M), q[30] = z, q[31] = J, q[32] = M, q[33] = V;
    else V = q[33];
    let L;
    if (q[34] !== _ || q[35] !== V || q[36] !== X || q[37] !== P) L = wa6.default.createElement(_, null, X, P, V, "?"), q[34] = _, q[35] = V, q[36] = X, q[37] = P, q[38] = L;
    else L = q[38];
    let h = j || !1,
        R;
    if (q[39] !== $ || q[40] !== H || q[41] !== h) R = [{
        old_string: H,
        new_string: $,
        replace_all: h
    }], q[39] = $, q[40] = H, q[41] = h, q[42] = R;
    else R = q[42];
    let u;
    if (q[43] !== O || q[44] !== R) u = wa6.default.createElement(ZI1, {
        file_path: O,
        edits: R
    }), q[43] = O, q[44] = R, q[45] = u;
    else u = q[45];
    let I;
    if (q[46] !== O) I = st(O), q[46] = O, q[47] = I;
    else I = q[47];
    let g;
    if (q[48] !== w || q[49] !== O || q[50] !== D || q[51] !== L || q[52] !== u || q[53] !== I || q[54] !== W || q[55] !== Z || q[56] !== G || q[57] !== f || q[58] !== v || q[59] !== N) g = wa6.default.createElement(w, {
        toolUseConfirm: W,
        toolUseContext: Z,
        onDone: G,
        onReject: f,
        workerBadge: v,
        title: N,
        subtitle: D,
        question: L,
        content: u,
        path: O,
        completionType: "str_replace_single",
        languageName: I,
        parseInput: Y,
        ideDiffSupport: mPz
    }), q[48] = w, q[49] = O, q[50] = D, q[51] = L, q[52] = u, q[53] = I, q[54] = W, q[55] = Z, q[56] = G, q[57] = f, q[58] = v, q[59] = N, q[60] = g;
    else g = q[60];
    return g
}
// @from(Ln 486573, Col 0)
function BPz(A) {
    return pX.inputSchema.parse(A)
}
// @from(Ln 486576, Col 4)
wa6
// @from(Ln 486576, Col 9)
mPz
// @from(Ln 486577, Col 4)
lSq = E(() => {
    e6();
    i6();
    Sz6();
    hs8();
    Z7();
    Z7();
    TV6();
    lA();
    VU();
    wa6 = t(P6(), 1), mPz = {
        getConfig: (A) => fI1(A.file_path, A.old_string, A.new_string, A.replace_all),
        applyChanges: (A, q) => {
            let K = q[0];
            if (K) return {
                ...A,
                old_string: K.old_string,
                new_string: K.new_string,
                replace_all: K.replace_all
            };
            return A
        }
    }
})
// @from(Ln 486602, Col 0)
function Fi(A, {
    assistantMessage: {
        message: {
            id: q
        }
    }
}, K, Y) {
    AW({
        completion_type: A,
        event: K,
        metadata: {
            language_name: "none",
            message_id: q,
            platform: T$6(),
            hasFeedback: Y ?? !1
        }
    })
}
// @from(Ln 486620, Col 4)
Is8 = E(() => {
    d3();
    GV6()
})
// @from(Ln 486626, Col 0)
function gPz(A) {
    switch (A.length) {
        case 0:
            return "";
        case 1:
            return Dw.default.createElement(T, {
                bold: !0
            }, A[0]);
        case 2:
            return Dw.default.createElement(T, null, Dw.default.createElement(T, {
                bold: !0
            }, A[0]), " and ", Dw.default.createElement(T, {
                bold: !0
            }, A[1]));
        default:
            return Dw.default.createElement(T, null, Dw.default.createElement(T, {
                bold: !0
            }, A.slice(0, -1).join(", ")), ", and", " ", Dw.default.createElement(T, {
                bold: !0
            }, A.slice(-1)[0]))
    }
}
// @from(Ln 486649, Col 0)
function bs8(A) {
    if (A.join(", ").length > 50) return "similar";
    return gPz(A)
}
// @from(Ln 486654, Col 0)
function Oa6(A) {
    if (A.length === 0) return "";
    let q = A.map((K) => K.split("/").pop() || K);
    if (q.length === 1) return Dw.default.createElement(T, null, Dw.default.createElement(T, {
        bold: !0
    }, q[0]), j86.sep);
    if (q.length === 2) return Dw.default.createElement(T, null, Dw.default.createElement(T, {
        bold: !0
    }, q[0]), j86.sep, " and ", Dw.default.createElement(T, {
        bold: !0
    }, q[1]), j86.sep);
    return Dw.default.createElement(T, null, Dw.default.createElement(T, {
        bold: !0
    }, q[0]), j86.sep, ", ", Dw.default.createElement(T, {
        bold: !0
    }, q[1]), j86.sep, " and ", A.length - 2, " more")
}
// @from(Ln 486672, Col 0)
function FPz(A) {
    let q = A.filter((j) => j.type === "addRules").flatMap((j) => j.rules || []),
        K = q.filter((j) => j.toolName === "Read"),
        Y = q.filter((j) => j.toolName === "Bash"),
        z = A.filter((j) => j.type === "addDirectories").flatMap((j) => j.directories || []),
        _ = K.map((j) => j.ruleContent?.replace("/**", "") || "").filter((j) => j),
        w = [...new Set(Y.flatMap((j) => {
            if (!j.ruleContent) return [];
            let J = bfq(j.ruleContent) ?? j.ruleContent,
                {
                    commandWithoutRedirections: M,
                    redirections: D
                } = ik(J);
            return D.length > 0 ? M : J
        }))],
        O = z.length > 0,
        $ = _.length > 0,
        H = w.length > 0;
    if ($ && !O && !H) {
        if (_.length === 1) {
            let j = _[0],
                J = j.split("/").pop() || j;
            return Dw.default.createElement(T, null, "Yes, allow reading from ", Dw.default.createElement(T, {
                bold: !0
            }, J), j86.sep, " from this project")
        }
        return Dw.default.createElement(T, null, "Yes, allow reading from ", Oa6(_), " from this project")
    }
    if (O && !$ && !H) {
        if (z.length === 1) {
            let j = z[0],
                J = j.split("/").pop() || j;
            return Dw.default.createElement(T, null, "Yes, and always allow access to ", Dw.default.createElement(T, {
                bold: !0
            }, J), j86.sep, " from this project")
        }
        return Dw.default.createElement(T, null, "Yes, and always allow access to ", Oa6(z), " from this project")
    }
    if (H && !O && !$) return Dw.default.createElement(T, null, "Yes, and don't ask again for ", bs8(w), " commands in", " ", Dw.default.createElement(T, {
        bold: !0
    }, AA()));
    if ((O || $) && !H) {
        let j = [...z, ..._];
        if (O && $) return Dw.default.createElement(T, null, "Yes, and always allow access to ", Oa6(j), " from this project")
    }
    if ((O || $) && H) {
        let j = [...z, ..._];
        if (j.length === 1 && w.length === 1) return Dw.default.createElement(T, null, "Yes, and allow access to ", Oa6(j), " and", " ", bs8(w), " commands");
        return Dw.default.createElement(T, null, "Yes, and allow ", Oa6(j), " access and", " ", bs8(w), " commands")
    }
    return null
}
// @from(Ln 486725, Col 0)
function iSq({
    suggestions: A = [],
    decisionReason: q,
    onRejectFeedbackChange: K,
    onAcceptFeedbackChange: Y,
    onClassifierDescriptionChange: z,
    classifierDescription: _,
    initialClassifierDescriptionEmpty: w = !1,
    existingAllowDescriptions: O = [],
    yesInputMode: $ = !1,
    noInputMode: H = !1,
    editablePrefix: j,
    onEditablePrefixChange: J
}) {
    let M = [];
    if ($) M.push({
        type: "input",
        label: "Yes",
        value: "yes",
        placeholder: "and tell Claude what to do next",
        onChange: Y,
        allowEmptySubmitToCancel: !0
    });
    else M.push({
        label: "Yes",
        value: "yes"
    });
    if (Ea()) {
        let D = A.some((P) => P.type === "addDirectories" || P.type === "addRules" && P.rules?.some((W) => W.toolName !== "Bash"));
        if (j !== void 0 && J && !D && A.length > 0) M.push({
            type: "input",
            label: "Yes, and don’t ask again for",
            value: "yes-prefix-edited",
            placeholder: "command prefix (e.g., npm run:*)",
            initialValue: j,
            onChange: J,
            allowEmptySubmitToCancel: !0,
            showLabelWithValue: !0,
            labelValueSeparator: ": ",
            resetCursorOnUpdate: !0
        });
        else if (A.length > 0) {
            let P = FPz(A);
            if (P) M.push({
                label: P,
                value: "yes-apply-suggestions"
            })
        }
        let X = M.some((P) => P.value === "yes-prefix-edited")
    }
    if (H) M.push({
        type: "input",
        label: "No",
        value: "no",
        placeholder: "and tell Claude what to do differently",
        onChange: K,
        allowEmptySubmitToCancel: !0
    });
    else M.push({
        label: "No",
        value: "no"
    });
    return M
}
// @from(Ln 486789, Col 4)
Dw
// @from(Ln 486790, Col 4)
nSq = E(() => {
    i6();
    T1();
    JZ();
    jZ();
    Km();
    Dw = t(P6(), 1)
})
// @from(Ln 486799, Col 0)
function rSq(A) {
    if (A.type === "classifier") return `${O1.bold(A.classifier)} classifier: ${A.reason}`;
    switch (A.type) {
        case "rule":
            return `${O1.bold(L5(A.rule.ruleValue))} rule from ${E31(A.rule.source)}`;
        case "mode":
            return `${QQ(A.mode)} mode`;
        case "sandboxOverride":
            return "Requires permission to bypass sandbox";
        case "workingDir":
            return A.reason;
        case "other":
            return A.reason;
        case "permissionPromptTool":
            return `${O1.bold(A.permissionPromptToolName)} permission prompt tool`;
        case "hook":
            return A.reason ? `${O1.bold(A.hookName)} hook: ${A.reason}` : `${O1.bold(A.hookName)} hook`;
        case "asyncAgent":
            return A.reason;
        default:
            return ""
    }
}
// @from(Ln 486823, Col 0)
function QPz(A) {
    let q = A6(10),
        {
            title: K,
            decisionReason: Y
        } = A,
        [z] = z7(),
        _;
    if (q[0] !== Y || q[1] !== z) _ = function() {
        switch (Y.type) {
            case "subcommandResults":
                return Jq.default.createElement(m, {
                    flexDirection: "column"
                }, Array.from(Y.reasons.entries()).map((J) => {
                    let [M, D] = J, X = D.behavior === "allow" ? kA("success", z)(a6.tick) : kA("error", z)(a6.cross);
                    return Jq.default.createElement(m, {
                        flexDirection: "column",
                        key: M
                    }, Jq.default.createElement(T, null, X, " ", M), D.decisionReason !== void 0 && D.decisionReason.type !== "subcommandResults" && Jq.default.createElement(T, null, "  ", "⎿", "  ", Jq.default.createElement(wK, null, rSq(D.decisionReason))), D.behavior === "ask" && (() => {
                        let P = ya(D.suggestions);
                        return P.length > 0 ? Jq.default.createElement(T, null, "  ", "⎿", "  ", "Suggested rules:", " ", Jq.default.createElement(wK, null, P.map(UPz).join(", "))) : null
                    })())
                }));
            default:
                return Jq.default.createElement(T, null, Jq.default.createElement(wK, null, rSq(Y)))
        }
    }, q[0] = Y, q[1] = z, q[2] = _;
    else _ = q[2];
    let w = _,
        O;
    if (q[3] !== K) O = K && Jq.default.createElement(T, null, K), q[3] = K, q[4] = O;
    else O = q[4];
    let $;
    if (q[5] !== w) $ = w(), q[5] = w, q[6] = $;
    else $ = q[6];
    let H;
    if (q[7] !== O || q[8] !== $) H = Jq.default.createElement(m, {
        flexDirection: "column"
    }, O, $), q[7] = O, q[8] = $, q[9] = H;
    else H = q[9];
    return H
}
// @from(Ln 486866, Col 0)
function UPz(A) {
    return O1.bold(L5(A))
}
// @from(Ln 486870, Col 0)
function dPz(A) {
    if (!A) return [];
    return A.flatMap((q) => {
        switch (q.type) {
            case "addDirectories":
                return q.directories;
            default:
                return []
        }
    })
}
// @from(Ln 486882, Col 0)
function cPz(A) {
    if (!A) return;
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K?.type === "setMode") return K.mode
    }
    return
}
// @from(Ln 486891, Col 0)
function lPz(A) {
    let q = A6(22),
        {
            suggestions: K,
            width: Y
        } = A;
    if (!K || K.length === 0) {
        let w;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = Jq.default.createElement(T, {
            dimColor: !0
        }, "Suggestions "), q[0] = w;
        else w = q[0];
        let O;
        if (q[1] !== Y) O = Jq.default.createElement(m, {
            justifyContent: "flex-end",
            minWidth: Y
        }, w), q[1] = Y, q[2] = O;
        else O = q[2];
        let $;
        if (q[3] === Symbol.for("react.memo_cache_sentinel")) $ = Jq.default.createElement(T, null, "None"), q[3] = $;
        else $ = q[3];
        let H;
        if (q[4] !== O) H = Jq.default.createElement(m, {
            flexDirection: "row"
        }, O, $), q[4] = O, q[5] = H;
        else H = q[5];
        return H
    }
    let z, _;
    if (q[6] !== K || q[7] !== Y) {
        _ = Symbol.for("react.early_return_sentinel");
        A: {
            let w = ya(K),
                O = dPz(K),
                $ = cPz(K);
            if (w.length === 0 && O.length === 0 && !$) {
                let D;
                if (q[10] === Symbol.for("react.memo_cache_sentinel")) D = Jq.default.createElement(T, {
                    dimColor: !0
                }, "Suggestion "), q[10] = D;
                else D = q[10];
                let X;
                if (q[11] !== Y) X = Jq.default.createElement(m, {
                    justifyContent: "flex-end",
                    minWidth: Y
                }, D), q[11] = Y, q[12] = X;
                else X = q[12];
                let P;
                if (q[13] === Symbol.for("react.memo_cache_sentinel")) P = Jq.default.createElement(T, null, "None"), q[13] = P;
                else P = q[13];
                let W;
                if (q[14] !== X) W = Jq.default.createElement(m, {
                    flexDirection: "row"
                }, X, P), q[14] = X, q[15] = W;
                else W = q[15];
                _ = W;
                break A
            }
            let H;
            if (q[16] === Symbol.for("react.memo_cache_sentinel")) H = Jq.default.createElement(T, {
                dimColor: !0
            }, "Suggestions "),
            q[16] = H;
            else H = q[16];
            let j;
            if (q[17] !== Y) j = Jq.default.createElement(m, {
                justifyContent: "flex-end",
                minWidth: Y
            }, H),
            q[17] = Y,
            q[18] = j;
            else j = q[18];
            let J;
            if (q[19] === Symbol.for("react.memo_cache_sentinel")) J = Jq.default.createElement(T, null, " "),
            q[19] = J;
            else J = q[19];
            let M;
            if (q[20] !== j) M = Jq.default.createElement(m, {
                flexDirection: "row"
            }, j, J),
            q[20] = j,
            q[21] = M;
            else M = q[21];z = Jq.default.createElement(m, {
                flexDirection: "column"
            }, M, w.length > 0 && Jq.default.createElement(m, {
                flexDirection: "row"
            }, Jq.default.createElement(m, {
                justifyContent: "flex-end",
                minWidth: Y
            }, Jq.default.createElement(T, {
                dimColor: !0
            }, " Rules ")), Jq.default.createElement(m, {
                flexDirection: "column"
            }, w.map(nPz))), O.length > 0 && Jq.default.createElement(m, {
                flexDirection: "row"
            }, Jq.default.createElement(m, {
                justifyContent: "flex-end",
                minWidth: Y
            }, Jq.default.createElement(T, {
                dimColor: !0
            }, " Directories ")), Jq.default.createElement(m, {
                flexDirection: "column"
            }, O.map(iPz))), $ && Jq.default.createElement(m, {
                flexDirection: "row"
            }, Jq.default.createElement(m, {
                justifyContent: "flex-end",
                minWidth: Y
            }, Jq.default.createElement(T, {
                dimColor: !0
            }, " Mode ")), Jq.default.createElement(T, null, QQ($))))
        }
        q[6] = K, q[7] = Y, q[8] = z, q[9] = _
    } else z = q[8], _ = q[9];
    if (_ !== Symbol.for("react.early_return_sentinel")) return _;
    return z
}
// @from(Ln 487008, Col 0)
function iPz(A, q) {
    return Jq.default.createElement(T, {
        key: q
    }, a6.bullet, " ", A)
}
// @from(Ln 487014, Col 0)
function nPz(A, q) {
    return Jq.default.createElement(T, {
        key: q
    }, a6.bullet, " ", L5(A))
}
// @from(Ln 487020, Col 0)
function oSq(A) {
    let q = A6(25),
        {
            permissionResult: K,
            toolName: Y
        } = A,
        z = M1(oPz),
        _ = K.decisionReason,
        w = "suggestions" in K ? K.suggestions : void 0,
        O;
    if (q[0] !== w || q[1] !== Y || q[2] !== z) {
        A: {
            let Z = vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled(),
                G = Ev6(z, {
                    sandboxAutoAllowEnabled: Z
                }),
                f = ya(w);
            if (f.length > 0) {
                O = G.filter((v) => f.some((N) => N.toolName === v.rule.ruleValue.toolName && N.ruleContent === v.rule.ruleValue.ruleContent));
                break A
            }
            if (Y) {
                let v;
                if (q[4] !== Y) v = (N) => N.rule.ruleValue.toolName === Y, q[4] = Y, q[5] = v;
                else v = q[5];
                O = G.filter(v);
                break A
            }
            O = G
        }
        q[0] = w,
        q[1] = Y,
        q[2] = z,
        q[3] = O
    }
    else O = q[3];
    let $ = O,
        H;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) H = Jq.default.createElement(m, {
        justifyContent: "flex-end",
        minWidth: 10
    }, Jq.default.createElement(T, {
        dimColor: !0
    }, "Behavior ")), q[6] = H;
    else H = q[6];
    let j;
    if (q[7] !== K.behavior) j = Jq.default.createElement(m, {
        flexDirection: "row"
    }, H, Jq.default.createElement(T, null, K.behavior)), q[7] = K.behavior, q[8] = j;
    else j = q[8];
    let J;
    if (q[9] !== K.behavior || q[10] !== K.message) J = K.behavior !== "allow" && Jq.default.createElement(m, {
        flexDirection: "row"
    }, Jq.default.createElement(m, {
        justifyContent: "flex-end",
        minWidth: 10
    }, Jq.default.createElement(T, {
        dimColor: !0
    }, "Message ")), Jq.default.createElement(T, null, K.message)), q[9] = K.behavior, q[10] = K.message, q[11] = J;
    else J = q[11];
    let M;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) M = Jq.default.createElement(m, {
        justifyContent: "flex-end",
        minWidth: 10
    }, Jq.default.createElement(T, {
        dimColor: !0
    }, "Reason ")), q[12] = M;
    else M = q[12];
    let D;
    if (q[13] !== _) D = Jq.default.createElement(m, {
        flexDirection: "row"
    }, M, _ === void 0 ? Jq.default.createElement(T, null, "undefined") : Jq.default.createElement(QPz, {
        decisionReason: _
    })), q[13] = _, q[14] = D;
    else D = q[14];
    let X;
    if (q[15] !== w) X = Jq.default.createElement(lPz, {
        suggestions: w,
        width: 10
    }), q[15] = w, q[16] = X;
    else X = q[16];
    let P;
    if (q[17] !== $) P = $.length > 0 && Jq.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, Jq.default.createElement(T, {
        color: "warning"
    }, a6.warning, " Unreachable Rules (", $.length, ")"), $.map(rPz)), q[17] = $, q[18] = P;
    else P = q[18];
    let W;
    if (q[19] !== j || q[20] !== J || q[21] !== D || q[22] !== X || q[23] !== P) W = Jq.default.createElement(m, {
        flexDirection: "column"
    }, j, J, D, X, P), q[19] = j, q[20] = J, q[21] = D, q[22] = X, q[23] = P, q[24] = W;
    else W = q[24];
    return W
}
// @from(Ln 487117, Col 0)
function rPz(A, q) {
    return Jq.default.createElement(m, {
        key: q,
        flexDirection: "column",
        marginLeft: 2
    }, Jq.default.createElement(T, {
        color: "warning"
    }, L5(A.rule.ruleValue)), Jq.default.createElement(T, {
        dimColor: !0
    }, "  ", A.reason), Jq.default.createElement(T, {
        dimColor: !0
    }, "  ", "Fix: ", A.fix))
}
// @from(Ln 487131, Col 0)
function oPz(A) {
    return A.toolPermissionContext
}
// @from(Ln 487134, Col 4)
Jq
// @from(Ln 487135, Col 4)
aSq = E(() => {
    e6();
    i6();
    SP();
    aK();
    b7();
    rD();
    F$();
    O2();
    NA();
    ay1();
    Lz();
    Jq = t(P6(), 1)
})
// @from(Ln 487150, Col 0)
function sPz(A, q) {
    if (!A) return null;
    if (A.type === "classifier") {
        if (A.classifier === "auto-mode") return {
            reasonString: `Auto mode classifier requires confirmation for this ${q}.
${A.reason}`,
            configString: void 0,
            themeColor: "error"
        };
        return {
            reasonString: `Classifier ${O1.bold(A.classifier)} requires confirmation for this ${q}.
${A.reason}`,
            configString: void 0
        }
    }
    switch (A.type) {
        case "rule":
            return {
                reasonString: `Permission rule ${O1.bold(L5(A.rule.ruleValue))} requires confirmation for this ${q}.`, configString: A.rule.source === "policySettings" ? void 0 : "/permissions to update rules"
            };
        case "hook": {
            let K = A.reason ? `:
${A.reason}` : ".",
                Y = A.hookSource ? ` ${O1.dim(`[${A.hookSource}]`)}` : "";
            return {
                reasonString: `Hook ${O1.bold(A.hookName)} requires confirmation for this ${q}${K}${Y}`,
                configString: "/hooks to update"
            }
        }
        case "other":
            return {
                reasonString: A.reason, configString: void 0
            };
        case "workingDir":
            return {
                reasonString: A.reason, configString: "/permissions to update rules"
            };
        default:
            return null
    }
}
// @from(Ln 487192, Col 0)
function lh(A) {
    let q = A6(11),
        {
            permissionResult: K,
            toolType: Y
        } = A,
        z = M1(tPz),
        _ = K?.decisionReason,
        w;
    if (q[0] !== _ || q[1] !== Y) w = sPz(_, Y), q[0] = _, q[1] = Y, q[2] = w;
    else w = q[2];
    let O = w;
    if (!O) return null;
    let $ = O.themeColor ?? (K?.decisionReason?.type === "hook" && z === "auto" ? "warning" : void 0),
        H;
    if (q[3] !== O.reasonString || q[4] !== $) H = $ ? vV6.default.createElement(T, {
        color: $
    }, O.reasonString) : vV6.default.createElement(T, null, vV6.default.createElement(wK, null, O.reasonString)), q[3] = O.reasonString, q[4] = $, q[5] = H;
    else H = q[5];
    let j;
    if (q[6] !== O.configString) j = O.configString && vV6.default.createElement(T, {
        dimColor: !0
    }, O.configString), q[6] = O.configString, q[7] = j;
    else j = q[7];
    let J;
    if (q[8] !== H || q[9] !== j) J = vV6.default.createElement(m, {
        marginBottom: 1,
        flexDirection: "column"
    }, H, j), q[8] = H, q[9] = j, q[10] = J;
    else J = q[10];
    return J
}
// @from(Ln 487225, Col 0)
function tPz(A) {
    return A.toolPermissionContext.mode
}
// @from(Ln 487228, Col 4)
vV6
// @from(Ln 487229, Col 4)
H26 = E(() => {
    e6();
    i6();
    RX6();
    SP();
    NA();
    aK();
    vV6 = t(P6(), 1)
})
// @from(Ln 487243, Col 0)
function sSq(A) {
    let q = A6(43),
        K, Y;
    if (q[0] !== A)({
        sedInfo: Y,
        ...K
    } = A), q[0] = A, q[1] = K, q[2] = Y;
    else K = q[1], Y = q[2];
    let {
        filePath: z
    } = Y, _;
    A: try {
        if ($1().existsSync(z)) {
            let g;
            if (q[3] !== z) g = IM(z), q[3] = z, q[4] = g;
            else g = q[4];
            let B;
            if (q[5] !== g) B = {
                oldContent: g,
                fileExists: !0
            }, q[5] = g, q[6] = B;
            else B = q[6];
            _ = B;
            break A
        }
        let I;
        if (q[7] === Symbol.for("react.memo_cache_sentinel")) I = {
            oldContent: "",
            fileExists: !1
        }, q[7] = I;
        else I = q[7];
        _ = I
    } catch {
        let u;
        if (q[8] === Symbol.for("react.memo_cache_sentinel")) u = {
            oldContent: "",
            fileExists: !1
        }, q[8] = u;
        else u = q[8];
        _ = u
    }
    let {
        oldContent: w,
        fileExists: O
    } = _, $;
    if (q[9] !== w || q[10] !== Y) $ = wl4(w, Y), q[9] = w, q[10] = Y, q[11] = $;
    else $ = q[11];
    let H = $,
        j;
    A: {
        if (w === H) {
            let I;
            if (q[12] === Symbol.for("react.memo_cache_sentinel")) I = [], q[12] = I;
            else I = q[12];
            j = I;
            break A
        }
        let u;
        if (q[13] !== H || q[14] !== w) u = [{
            old_string: w,
            new_string: H,
            replace_all: !1
        }],
        q[13] = H,
        q[14] = w,
        q[15] = u;
        else u = q[15];j = u
    }
    let J = j,
        M;
    A: {
        if (!O) {
            M = "File does not exist";
            break A
        }
        M = "Pattern did not match any content"
    }
    let D = M,
        X;
    if (q[16] !== z || q[17] !== H) X = (u) => {
        return {
            ...J4.inputSchema.parse(u),
            _simulatedSedEdit: {
                filePath: z,
                newContent: H
            }
        }
    }, q[16] = z, q[17] = H, q[18] = X;
    else X = q[18];
    let P = X,
        W = K.toolUseConfirm,
        Z = K.toolUseContext,
        G = K.onDone,
        f = K.onReject,
        v;
    if (q[19] !== z) v = A0z(G1(), z), q[19] = z, q[20] = v;
    else v = q[20];
    let N;
    if (q[21] !== z) N = ePz(z), q[21] = z, q[22] = N;
    else N = q[22];
    let V;
    if (q[23] !== N) V = NV6.default.createElement(T, null, "Do you want to make this edit to", " ", NV6.default.createElement(T, {
        bold: !0
    }, N), "?"), q[23] = N, q[24] = V;
    else V = q[24];
    let L;
    if (q[25] !== J || q[26] !== z || q[27] !== D) L = J.length > 0 ? NV6.default.createElement(ZI1, {
        file_path: z,
        edits: J
    }) : NV6.default.createElement(T, {
        dimColor: !0
    }, D), q[25] = J, q[26] = z, q[27] = D, q[28] = L;
    else L = q[28];
    let h;
    if (q[29] !== z) h = st(z), q[29] = z, q[30] = h;
    else h = q[30];
    let R;
    if (q[31] !== z || q[32] !== P || q[33] !== K.onDone || q[34] !== K.onReject || q[35] !== K.toolUseConfirm || q[36] !== K.toolUseContext || q[37] !== K.workerBadge || q[38] !== v || q[39] !== V || q[40] !== L || q[41] !== h) R = NV6.default.createElement(gF, {
        toolUseConfirm: W,
        toolUseContext: Z,
        onDone: G,
        onReject: f,
        title: "Edit file",
        subtitle: v,
        question: V,
        content: L,
        path: z,
        completionType: "str_replace_single",
        languageName: h,
        parseInput: P,
        workerBadge: K.workerBadge
    }), q[31] = z, q[32] = P, q[33] = K.onDone, q[34] = K.onReject, q[35] = K.toolUseConfirm, q[36] = K.toolUseContext, q[37] = K.workerBadge, q[38] = v, q[39] = V, q[40] = L, q[41] = h, q[42] = R;
    else R = q[42];
    return R
}
// @from(Ln 487378, Col 4)
NV6
// @from(Ln 487379, Col 4)
tSq = E(() => {
    e6();
    i6();
    hs8();
    Z7();
    TV6();
    lA();
    Z7();
    SA();
    Uc6();
    OZ();
    NV6 = t(P6(), 1)
})
// @from(Ln 487393, Col 0)
function $0z(A) {
    if (typeof A === "string") return A;
    try {
        return B6(A, null, 2)
    } catch {
        return String(A)
    }
}
// @from(Ln 487402, Col 0)
function H0z(A, q = 1000) {
    let K = A.filter((_) => _.type === "assistant").slice(-3),
        Y = [],
        z = 0;
    for (let _ of K.reverse()) {
        let w = _.message.content.filter((O) => O.type === "text").map((O) => ("text" in O) ? O.text : "").join(" ");
        if (w && z < q) {
            let O = q - z,
                $ = w.length > O ? w.slice(0, O) + "..." : w;
            Y.unshift($), z += $.length
        }
    }
    return Y.join(`

`)
}
// @from(Ln 487419, Col 0)
function xs8() {
    if (!w8("tengu_permission_explainer", !1)) return !1;
    return X1().permissionExplainerEnabled !== !1
}
// @from(Ln 487423, Col 0)
async function eSq({
    toolName: A,
    toolInput: q,
    toolDescription: K,
    messages: Y,
    signal: z
}) {
    if (!xs8()) return null;
    let _ = Date.now();
    try {
        let w = $0z(q),
            O = Y?.length ? H0z(Y) : "",
            $ = `Tool: ${A}
${K?`Description: ${K}
`:""}
Input:
${w}
${O?`
Recent conversation context:
${O}`:""}

Explain this command in context.`,
            H = cK(),
            j = await _h({
                model: H,
                system: _0z,
                messages: [{
                    role: "user",
                    content: $
                }],
                tools: [w0z],
                tool_choice: {
                    type: "tool",
                    name: "explain_command"
                },
                signal: z
            }),
            J = Date.now() - _;
        k(`Permission explainer: API returned in ${J}ms, stop_reason=${j.stop_reason}`);
        let M = j.content.find((D) => D.type === "tool_use");
        if (M && M.type === "tool_use") {
            k(`Permission explainer: tool input: ${B6(M.input).slice(0,500)}`);
            let D = O0z().safeParse(M.input);
            if (D.success) {
                let X = {
                    riskLevel: D.data.riskLevel,
                    explanation: D.data.explanation,
                    reasoning: D.data.reasoning,
                    risk: D.data.risk
                };
                return d("tengu_permission_explainer_generated", {
                    tool_name: hq(A),
                    risk_level: q0z[X.riskLevel],
                    latency_ms: J
                }), k(`Permission explainer: ${X.riskLevel} risk for ${A} (${J}ms)`), X
            }
        }
        return d("tengu_permission_explainer_error", {
            tool_name: hq(A),
            error_type: K0z,
            latency_ms: J
        }), k("Permission explainer: no parsed output in response"), null
    } catch (w) {
        let O = Date.now() - _;
        if (z.aborted) return k(`Permission explainer: request aborted for ${A}`), null;
        return k(`Permission explainer error: ${_1(w)}`), _6(w), d("tengu_permission_explainer_error", {
            tool_name: hq(A),
            error_type: w instanceof Error && w.name === "AbortError" ? Y0z : z0z,
            latency_ms: O
        }), null
    }
}
// @from(Ln 487495, Col 4)
q0z
// @from(Ln 487495, Col 9)
K0z = 1
// @from(Ln 487496, Col 4)
Y0z = 2
// @from(Ln 487497, Col 4)
z0z = 3
// @from(Ln 487498, Col 4)
_0z = "Analyze shell commands and explain what they do, why you're running them, and potential risks."
// @from(Ln 487499, Col 4)
w0z
// @from(Ln 487499, Col 9)
O0z
// @from(Ln 487500, Col 4)
ACq = E(() => {
    V1();
    o$();
    k1();
    H1();
    HA();
    k8();
    g1();
    z4();
    tY6();
    K7();
    s8();
    q0z = {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3
    }, w0z = {
        name: "explain_command",
        description: "Provide an explanation of a shell command",
        input_schema: {
            type: "object",
            properties: {
                explanation: {
                    type: "string",
                    description: "What this command does (1-2 sentences)"
                },
                reasoning: {
                    type: "string",
                    description: 'Why YOU are running this command. Start with "I" - e.g. "I need to check the file contents"'
                },
                risk: {
                    type: "string",
                    description: "What could go wrong, under 15 words"
                },
                riskLevel: {
                    type: "string",
                    enum: ["LOW", "MEDIUM", "HIGH"],
                    description: "LOW (safe dev workflows), MEDIUM (recoverable changes), HIGH (dangerous/irreversible)"
                }
            },
            required: ["explanation", "reasoning", "risk", "riskLevel"]
        }
    }, O0z = F6(() => C.object({
        riskLevel: C.enum(["LOW", "MEDIUM", "HIGH"]),
        explanation: C.string(),
        reasoning: C.string(),
        risk: C.string()
    }))
})
// @from(Ln 487550, Col 0)
function j0z() {
    let A = A6(7),
        [q, K] = RZ1("responding", qCq, !1),
        Y;
    if (A[0] !== K) Y = qCq.split("").map((w, O) => aX.default.createElement(CZ6, {
        key: O,
        char: w,
        index: O,
        glimmerIndex: K,
        messageColor: "inactive",
        shimmerColor: "text"
    })), A[0] = K, A[1] = Y;
    else Y = A[1];
    let z;
    if (A[2] !== Y) z = aX.default.createElement(T, null, Y), A[2] = Y, A[3] = z;
    else z = A[3];
    let _;
    if (A[4] !== q || A[5] !== z) _ = aX.default.createElement(m, {
        ref: q
    }, z), A[4] = q, A[5] = z, A[6] = _;
    else _ = A[6];
    return _
}
// @from(Ln 487574, Col 0)
function J0z(A) {
    switch (A) {
        case "LOW":
            return "success";
        case "MEDIUM":
            return "warning";
        case "HIGH":
            return "error"
    }
}
// @from(Ln 487585, Col 0)
function M0z(A) {
    switch (A) {
        case "LOW":
            return "Low risk";
        case "MEDIUM":
            return "Med risk";
        case "HIGH":
            return "High risk"
    }
}
// @from(Ln 487596, Col 0)
function D0z(A) {
    return eSq({
        toolName: A.toolName,
        toolInput: A.toolInput,
        toolDescription: A.toolDescription,
        messages: A.messages,
        signal: new AbortController().signal
    }).catch(() => null)
}
// @from(Ln 487606, Col 0)
function KCq(A) {
    let q = A6(9),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = xs8(), q[0] = K;
    else K = q[0];
    let Y = K,
        [z, _] = j26.useState(!1),
        [w, O] = j26.useState(null),
        $;
    if (q[1] !== w || q[2] !== A || q[3] !== z) $ = () => {
        if (!z) {
            if (d("tengu_permission_explainer_shortcut_used", {}), !w) O(D0z(A))
        }
        _(X0z)
    }, q[1] = w, q[2] = A, q[3] = z, q[4] = $;
    else $ = q[4];
    let H;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) H = {
        context: "Confirmation",
        isActive: Y
    }, q[5] = H;
    else H = q[5];
    D8("confirm:toggleExplanation", $, H);
    let j;
    if (q[6] !== w || q[7] !== z) j = {
        visible: z,
        enabled: Y,
        promise: w
    }, q[6] = w, q[7] = z, q[8] = j;
    else j = q[8];
    return j
}
// @from(Ln 487639, Col 0)
function X0z(A) {
    return !A
}
// @from(Ln 487643, Col 0)
function P0z(A) {
    let q = A6(21),
        {
            promise: K
        } = A,
        Y = j26.use(K);
    if (!Y) {
        let M;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) M = aX.default.createElement(m, {
            marginTop: 1
        }, aX.default.createElement(T, {
            dimColor: !0
        }, "Explanation unavailable")), q[0] = M;
        else M = q[0];
        return M
    }
    let z;
    if (q[1] !== Y.explanation) z = aX.default.createElement(T, null, Y.explanation), q[1] = Y.explanation, q[2] = z;
    else z = q[2];
    let _;
    if (q[3] !== Y.reasoning) _ = aX.default.createElement(m, {
        marginTop: 1
    }, aX.default.createElement(T, null, Y.reasoning)), q[3] = Y.reasoning, q[4] = _;
    else _ = q[4];
    let w;
    if (q[5] !== Y.riskLevel) w = J0z(Y.riskLevel), q[5] = Y.riskLevel, q[6] = w;
    else w = q[6];
    let O;
    if (q[7] !== Y.riskLevel) O = M0z(Y.riskLevel), q[7] = Y.riskLevel, q[8] = O;
    else O = q[8];
    let $;
    if (q[9] !== w || q[10] !== O) $ = aX.default.createElement(T, {
        color: w
    }, O, ":"), q[9] = w, q[10] = O, q[11] = $;
    else $ = q[11];
    let H;
    if (q[12] !== Y.risk) H = aX.default.createElement(T, null, " ", Y.risk), q[12] = Y.risk, q[13] = H;
    else H = q[13];
    let j;
    if (q[14] !== $ || q[15] !== H) j = aX.default.createElement(m, {
        marginTop: 1
    }, aX.default.createElement(T, null, $, H)), q[14] = $, q[15] = H, q[16] = j;
    else j = q[16];
    let J;
    if (q[17] !== z || q[18] !== _ || q[19] !== j) J = aX.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, z, _, j), q[17] = z, q[18] = _, q[19] = j, q[20] = J;
    else J = q[20];
    return J
}
// @from(Ln 487695, Col 0)
function YCq(A) {
    let q = A6(3),
        {
            visible: K,
            promise: Y
        } = A;
    if (!K || !Y) return null;
    let z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = aX.default.createElement(m, {
        marginTop: 1
    }, aX.default.createElement(j0z, null)), q[0] = z;
    else z = q[0];
    let _;
    if (q[1] !== Y) _ = aX.default.createElement(j26.Suspense, {
        fallback: z
    }, aX.default.createElement(P0z, {
        promise: Y
    })), q[1] = Y, q[2] = _;
    else _ = q[2];
    return _
}
// @from(Ln 487716, Col 4)
aX
// @from(Ln 487716, Col 8)
j26
// @from(Ln 487716, Col 13)
qCq = "Loading explanation…"
// @from(Ln 487717, Col 4)
zCq = E(() => {
    e6();
    i6();
    _7();
    ACq();
    V1();
    iQ6();
    hZ1();
    aX = t(P6(), 1), j26 = t(P6(), 1)
})
// @from(Ln 487728, Col 0)
function _Cq(A) {
    for (let {
            pattern: q,
            warning: K
        }
        of W0z)
        if (q.test(A)) return K;
    return null
}
// @from(Ln 487737, Col 4)
W0z
// @from(Ln 487738, Col 4)
wCq = E(() => {
    W0z = [{
        pattern: /\bgit\s+reset\s+--hard\b/,
        warning: "Note: may discard uncommitted changes"
    }, {
        pattern: /\bgit\s+push\b[^;&|\n]*[ \t](--force|--force-with-lease|-f)\b/,
        warning: "Note: may overwrite remote history"
    }, {
        pattern: /\bgit\s+clean\b(?![^;&|\n]*(?:-[a-zA-Z]*n|--dry-run))[^;&|\n]*-[a-zA-Z]*f/,
        warning: "Note: may permanently delete untracked files"
    }, {
        pattern: /\bgit\s+checkout\s+(--\s+)?\.[ \t]*($|[;&|\n])/,
        warning: "Note: may discard all working tree changes"
    }, {
        pattern: /\bgit\s+restore\s+(--\s+)?\.[ \t]*($|[;&|\n])/,
        warning: "Note: may discard all working tree changes"
    }, {
        pattern: /\bgit\s+stash[ \t]+(drop|clear)\b/,
        warning: "Note: may permanently remove stashed changes"
    }, {
        pattern: /\bgit\s+branch\s+(-D[ \t]|--delete\s+--force|--force\s+--delete)\b/,
        warning: "Note: may force-delete a branch"
    }, {
        pattern: /\bgit\s+(commit|push|merge)\b[^;&|\n]*--no-verify\b/,
        warning: "Note: may skip safety hooks"
    }, {
        pattern: /\bgit\s+commit\b[^;&|\n]*--amend\b/,
        warning: "Note: may rewrite the last commit"
    }, {
        pattern: /(^|[;&|\n]\s*)rm\s+-[a-zA-Z]*[rR][a-zA-Z]*f|(^|[;&|\n]\s*)rm\s+-[a-zA-Z]*f[a-zA-Z]*[rR]/,
        warning: "Note: may recursively force-remove files"
    }, {
        pattern: /(^|[;&|\n]\s*)rm\s+-[a-zA-Z]*[rR]/,
        warning: "Note: may recursively remove files"
    }, {
        pattern: /(^|[;&|\n]\s*)rm\s+-[a-zA-Z]*f/,
        warning: "Note: may force-remove files"
    }, {
        pattern: /\b(DROP|TRUNCATE)\s+(TABLE|DATABASE|SCHEMA)\b/i,
        warning: "Note: may drop or truncate database objects"
    }, {
        pattern: /\bDELETE\s+FROM\s+\w+[ \t]*(;|"|'|\n|$)/i,
        warning: "Note: may delete all rows from a database table"
    }, {
        pattern: /\bkubectl\s+delete\b/,
        warning: "Note: may delete Kubernetes resources"
    }, {
        pattern: /\bterraform\s+destroy\b/,
        warning: "Note: may destroy Terraform infrastructure"
    }]
})
// @from(Ln 487789, Col 4)
OCq
// @from(Ln 487790, Col 4)
$Cq = E(() => {
    OCq = {
        name: "pyright",
        description: "Type checker for Python",
        options: [{
            name: ["--help", "-h"],
            description: "Show help message"
        }, {
            name: "--version",
            description: "Print pyright version and exit"
        }, {
            name: ["--watch", "-w"],
            description: "Continue to run and watch for changes"
        }, {
            name: ["--project", "-p"],
            description: "Use the configuration file at this location",
            args: {
                name: "FILE OR DIRECTORY"
            }
        }, {
            name: "-",
            description: "Read file or directory list from stdin"
        }, {
            name: "--createstub",
            description: "Create type stub file(s) for import",
            args: {
                name: "IMPORT"
            }
        }, {
            name: ["--typeshedpath", "-t"],
            description: "Use typeshed type stubs at this location",
            args: {
                name: "DIRECTORY"
            }
        }, {
            name: "--verifytypes",
            description: "Verify completeness of types in py.typed package",
            args: {
                name: "IMPORT"
            }
        }, {
            name: "--ignoreexternal",
            description: "Ignore external imports for --verifytypes"
        }, {
            name: "--pythonpath",
            description: "Path to the Python interpreter",
            args: {
                name: "FILE"
            }
        }, {
            name: "--pythonplatform",
            description: "Analyze for platform",
            args: {
                name: "PLATFORM"
            }
        }, {
            name: "--pythonversion",
            description: "Analyze for Python version",
            args: {
                name: "VERSION"
            }
        }, {
            name: ["--venvpath", "-v"],
            description: "Directory that contains virtual environments",
            args: {
                name: "DIRECTORY"
            }
        }, {
            name: "--outputjson",
            description: "Output results in JSON format"
        }, {
            name: "--verbose",
            description: "Emit verbose diagnostics"
        }, {
            name: "--stats",
            description: "Print detailed performance stats"
        }, {
            name: "--dependencies",
            description: "Emit import dependency information"
        }, {
            name: "--level",
            description: "Minimum diagnostic level",
            args: {
                name: "LEVEL"
            }
        }, {
            name: "--skipunannotated",
            description: "Skip type analysis of unannotated functions"
        }, {
            name: "--warnings",
            description: "Use exit code of 1 if warnings are reported"
        }, {
            name: "--threads",
            description: "Use up to N threads to parallelize type checking",
            args: {
                name: "N",
                isOptional: !0
            }
        }],
        args: {
            name: "files",
            description: "Specify files or directories to analyze (overrides config file)",
            isVariadic: !0,
            isOptional: !0
        }
    }
})
// @from(Ln 487897, Col 4)
Z0z
// @from(Ln 487897, Col 9)
HCq
// @from(Ln 487898, Col 4)
jCq = E(() => {
    Z0z = {
        name: "timeout",
        description: "Run a command with a time limit",
        args: [{
            name: "duration",
            description: "Duration to wait before timing out (e.g., 10, 5s, 2m)",
            isOptional: !1
        }, {
            name: "command",
            description: "Command to run",
            isCommand: !0
        }]
    }, HCq = Z0z
})
// @from(Ln 487913, Col 4)
G0z
// @from(Ln 487913, Col 9)
JCq
// @from(Ln 487914, Col 4)
MCq = E(() => {
    G0z = {
        name: "sleep",
        description: "Delay for a specified amount of time",
        args: {
            name: "duration",
            description: "Duration to sleep (seconds or with suffix like 5s, 2m, 1h)",
            isOptional: !1
        }
    }, JCq = G0z
})
// @from(Ln 487925, Col 4)
f0z
// @from(Ln 487925, Col 9)
DCq
// @from(Ln 487926, Col 4)
XCq = E(() => {
    f0z = {
        name: "alias",
        description: "Create or list command aliases",
        args: {
            name: "definition",
            description: "Alias definition in the form name=value",
            isOptional: !0,
            isVariadic: !0
        }
    }, DCq = f0z
})
// @from(Ln 487938, Col 4)
T0z
// @from(Ln 487938, Col 9)
PCq
// @from(Ln 487939, Col 4)
WCq = E(() => {
    T0z = {
        name: "nohup",
        description: "Run a command immune to hangups",
        args: {
            name: "command",
            description: "Command to run with nohup",
            isCommand: !0
        }
    }, PCq = T0z
})
// @from(Ln 487950, Col 4)
v0z
// @from(Ln 487950, Col 9)
ZCq
// @from(Ln 487951, Col 4)
GCq = E(() => {
    v0z = {
        name: "time",
        description: "Time a command",
        args: {
            name: "command",
            description: "Command to time",
            isCommand: !0
        }
    }, ZCq = v0z
})
// @from(Ln 487962, Col 4)
N0z
// @from(Ln 487962, Col 9)
fCq
// @from(Ln 487963, Col 4)
TCq = E(() => {
    N0z = {
        name: "srun",
        description: "Run a command on SLURM cluster nodes",
        options: [{
            name: ["-n", "--ntasks"],
            description: "Number of tasks",
            args: {
                name: "count",
                description: "Number of tasks to run"
            }
        }, {
            name: ["-N", "--nodes"],
            description: "Number of nodes",
            args: {
                name: "count",
                description: "Number of nodes to allocate"
            }
        }],
        args: {
            name: "command",
            description: "Command to run on the cluster",
            isCommand: !0
        }
    }, fCq = N0z
})
// @from(Ln 487989, Col 4)
us8
// @from(Ln 487990, Col 4)
vCq = E(() => {
    $Cq();
    jCq();
    MCq();
    XCq();
    WCq();
    GCq();
    TCq();
    us8 = [OCq, HCq, JCq, DCq, PCq, ZCq, fCq]
})
// @from(Ln 488000, Col 0)
async function V0z(A) {
    if (!A || A.includes("/") || A.includes("\\")) return null;
    if (A.includes("..")) return null;
    if (A.startsWith("-") && A !== "-") return null;
    try {
        let q = await import(`@withfig/autocomplete/build/${A}.js`);
        return q.default || q
    } catch {
        return null
    }
}
// @from(Ln 488011, Col 4)
ms8
// @from(Ln 488012, Col 4)
NCq = E(() => {
    vCq();
    Up();
    ms8 = ZP(async (A) => {
        return us8.find((K) => K.name === A) || await V0z(A) || null
    }, (A) => A)
})
// @from(Ln 488020, Col 0)
function Bs8(A, q) {
    if (!q?.subcommands?.length) return !1;
    let K = A.toLowerCase();
    return q.subcommands.some((Y) => Array.isArray(Y.name) ? Y.name.some((z) => z.toLowerCase() === K) : Y.name.toLowerCase() === K)
}
// @from(Ln 488026, Col 0)
function VCq(A, q, K) {
    if (K?.options) {
        let Y = K.options.find((z) => Array.isArray(z.name) ? z.name.includes(A) : z.name === A);
        if (Y) return !!Y.args
    }
    if (K?.subcommands?.length && q && !q.startsWith("-")) return !Bs8(q, K);
    return !1
}
// @from(Ln 488035, Col 0)
function E0z(A, q) {
    for (let K = 0; K < A.length; K++) {
        let Y = A[K];
        if (!Y) continue;
        if (Y.startsWith("-")) {
            if (VCq(Y, A[K + 1], q)) K++;
            continue
        }
        if (!q?.subcommands?.length) return Y;
        if (Bs8(Y, q)) return Y
    }
    return
}
// @from(Ln 488048, Col 0)
async function kCq(A, q, K) {
    let Y = await y0z(A, q, K),
        z = [A],
        _ = !!K?.subcommands?.length,
        w = !1;
    for (let O = 0; O < q.length; O++) {
        let $ = q[O];
        if (!$ || z.length >= Y) break;
        if ($.startsWith("-")) {
            if ($ === "-c" && ["python", "python3"].includes(A.toLowerCase())) break;
            if (K?.options) {
                let H = K.options.find((j) => Array.isArray(j.name) ? j.name.includes($) : j.name === $);
                if (H?.args && VV6(H.args).some((j) => j?.isCommand || j?.isModule)) {
                    z.push($);
                    continue
                }
            }
            if (_ && !w) {
                if (VCq($, q[O + 1], K)) O++;
                continue
            }
            break
        }
        if (await L0z($, q.slice(0, O), K)) break;
        if (_ && !w) w = Bs8($, K);
        z.push($)
    }
    return z.join(" ")
}