
// @from(Ln 520705, Col 0)
function xKA({
    toolUseConfirm: q,
    toolUseContext: K,
    onDone: _,
    onReject: z,
    verbose: Y,
    workerBadge: A,
    command: O,
    description: w
}) {
    let [$] = Zq(), j = M8((q6) => q6.toolPermissionContext), H = zs8({
        toolName: q.tool.name,
        toolInput: q.input,
        toolDescription: q.description,
        messages: K.messages
    }), {
        yesInputMode: J,
        noInputMode: X,
        yesFeedbackModeEntered: M,
        noFeedbackModeEntered: P,
        acceptFeedback: W,
        rejectFeedback: D,
        setAcceptFeedback: Z,
        setRejectFeedback: G,
        focusedOption: f,
        handleInputModeToggle: v,
        handleReject: V,
        handleFocus: k
    } = Os8({
        toolUseConfirm: q,
        onDone: _,
        onReject: z,
        explainerVisible: H.visible
    }), [N, R] = y3.useState(!1), [h, C] = y3.useState(w || ""), [x, B] = y3.useState(!w?.trim());
    y3.useEffect(() => {
        if (!VK6()) return;
        let q6 = new AbortController;
        return LP4(O, w, q6.signal).then((o) => {
            if (o && !q6.signal.aborted) C(o), B(!1)
        }).catch(() => {}), () => q6.abort()
    }, [O, w]);
    let m = q.permissionResult.decisionReason?.type === "subcommandResults",
        [S, F] = y3.useState(() => {
            if (m) {
                let _6 = gd("suggestions" in q.permissionResult ? q.permissionResult.suggestions : void 0).filter((r) => r.toolName === KK.name && r.ruleContent);
                return _6.length === 1 ? _6[0].ruleContent : void 0
            }
            let q6 = Jn8(O);
            if (q6) return `${q6} *`;
            let o = iSK(O);
            if (o) return `${o} *`;
            return O
        }),
        U = y3.useRef(!1),
        g = y3.useCallback((q6) => {
            U.current = !0, F(q6)
        }, []);
    y3.useEffect(() => {
        if (m) return;
        let q6 = !1;
        return k45(O, (o) => KK.isReadOnly({
            command: o
        })).then((o) => {
            if (q6 || U.current) return;
            if (o.length > 0) F(`${o[0]} *`)
        }).catch(() => {}), () => {
            q6 = !0
        }
    }, [O, m]);
    let [c] = y3.useState(!1), {
        destructiveWarning: n,
        sandboxingEnabled: l,
        isSandboxed: z6
    } = y3.useMemo(() => {
        let q6 = u8("tengu_destructive_command_warning", !1) ? z45(O) : null,
            o = Z7.isSandboxingEnabled(),
            _6 = o && AL(q.input);
        return {
            destructiveWarning: q6,
            sandboxingEnabled: o,
            isSandboxed: _6
        }
    }, [O, q.input]), A6 = y3.useMemo(() => ({
        completion_type: "tool_use_single",
        language_name: "none"
    }), []);
    TL(q, A6);
    let e = y3.useMemo(() => nh8(j), [j]),
        i = y3.useMemo(() => c45({
            suggestions: q.permissionResult.behavior === "ask" ? q.permissionResult.suggestions : void 0,
            decisionReason: q.permissionResult.decisionReason,
            onRejectFeedbackChange: G,
            onAcceptFeedbackChange: Z,
            onClassifierDescriptionChange: C,
            classifierDescription: h,
            initialClassifierDescriptionEmpty: x,
            existingAllowDescriptions: e,
            yesInputMode: J,
            noInputMode: X,
            editablePrefix: S,
            onEditablePrefixChange: g
        }), [q, h, x, e, J, X, S, g, Z, G]),
        O6 = y3.useCallback(() => {
            R((q6) => !q6)
        }, []);
    G1("permission:toggleDebug", O6, {
        context: "Confirmation"
    });
    let J6 = y3.useCallback(() => {
        q.onDismissCheckmark?.()
    }, [q]);
    G1("confirm:no", J6, {
        context: "Confirmation",
        isActive: !1
    });

    function $6(q6) {
        d("tengu_permission_request_option_selected", {
            option_index: {
                yes: 1,
                "yes-apply-suggestions": 2,
                "yes-prefix-edited": 2,
                no: 3
            } [q6],
            explainer_visible: H.visible
        });
        let _6 = PK(q.tool.name);
        if (q6 === "yes-prefix-edited") {
            let r = (S ?? "").trim();
            if (y0("tool_use_single", q, "accept"), !r) q.onAllow(q.input, []);
            else {
                let t = [{
                    type: "addRules",
                    rules: [{
                        toolName: KK.name,
                        ruleContent: r
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }];
                q.onAllow(q.input, t)
            }
            _();
            return
        }
        switch (q6) {
            case "yes": {
                let r = W.trim();
                y0("tool_use_single", q, "accept"), d("tengu_accept_submitted", {
                    toolName: _6,
                    isMcp: q.tool.isMcp ?? !1,
                    has_instructions: !!r,
                    instructions_length: r.length,
                    entered_feedback_mode: M
                }), q.onAllow(q.input, [], r || void 0), _();
                break
            }
            case "yes-apply-suggestions": {
                y0("tool_use_single", q, "accept");
                let r = "suggestions" in q.permissionResult ? q.permissionResult.suggestions || [] : [];
                q.onAllow(q.input, r), _();
                break
            }
            case "no": {
                let r = D.trim();
                d("tengu_reject_submitted", {
                    toolName: _6,
                    isMcp: q.tool.isMcp ?? !1,
                    has_instructions: !!r,
                    instructions_length: r.length,
                    entered_feedback_mode: P
                }), V(r || void 0);
                break
            }
        }
    }
    return y3.default.createElement(IY, {
        workerBadge: A,
        title: l && !z6 ? "Bash command (unsandboxed)" : "Bash command",
        subtitle: void 0
    }, y3.default.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, y3.default.createElement(T, {
        dimColor: H.visible
    }, KK.renderToolUseMessage({
        command: O,
        description: w
    }, {
        theme: $,
        verbose: !0
    })), !H.visible && y3.default.createElement(T, {
        dimColor: !0
    }, q.description), y3.default.createElement(Ys8, {
        visible: H.visible,
        promise: H.promise
    })), N ? y3.default.createElement(y3.default.Fragment, null, y3.default.createElement(_s8, {
        permissionResult: q.permissionResult,
        toolName: "Bash"
    }), K.options.debug && y3.default.createElement(u, {
        justifyContent: "flex-end",
        marginTop: 1
    }, y3.default.createElement(T, {
        dimColor: !0
    }, y3.default.createElement(A8, {
        chord: "ctrl+d",
        action: "hide debug info",
        format: {
            modCase: "title",
            charCase: "upper",
            modSep: "-"
        }
    })))) : y3.default.createElement(y3.default.Fragment, null, y3.default.createElement(u, {
        flexDirection: "column"
    }, y3.default.createElement(iT, {
        permissionResult: q.permissionResult,
        toolType: "command"
    }), n && y3.default.createElement(u, {
        marginBottom: 1
    }, y3.default.createElement(T, {
        color: "warning",
        dimColor: !1
    }, n)), y3.default.createElement(T, {
        dimColor: !1
    }, "Do you want to proceed?"), y3.default.createElement(A1, {
        options: i,
        isDisabled: !1,
        inlineDescriptions: !0,
        onChange: $6,
        onCancel: () => V(),
        onFocus: k,
        onInputModeToggle: v
    })), y3.default.createElement(u, {
        justifyContent: "space-between",
        marginTop: 1
    }, y3.default.createElement(T, {
        dimColor: !0
    }, y3.default.createElement(z1, null, y3.default.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }), (f === "yes" && !J || f === "no" && !X) && y3.default.createElement(A8, {
        chord: "tab",
        action: "amend"
    }), H.enabled && y3.default.createElement(A8, {
        chord: "ctrl+e",
        action: H.visible ? "hide" : "explain"
    }))), K.options.debug && y3.default.createElement(T, {
        dimColor: !0
    }, y3.default.createElement(A8, {
        chord: "ctrl+d",
        action: "show debug info",
        format: {
            modCase: "title"
        }
    })))))
}
// @from(Ln 520962, Col 4)
y3
// @from(Ln 520963, Col 4)
i45 = L(() => {
    o6();
    g6();
    C7();
    B1();
    C8();
    q2();
    N7();
    AZ();
    MT();
    Y45();
    OK8();
    xM6();
    N45();
    MH();
    yY();
    gK();
    Nq();
    u7();
    Is6();
    RF8();
    fz6();
    qM7();
    pD();
    _M7();
    V66();
    d45();
    OM7();
    jm6();
    l45();
    y3 = K6(P6(), 1)
})
// @from(Ln 520996, Col 0)
function r45(q) {
    let K = s(18),
        {
            toolUseConfirm: _,
            onDone: z,
            onReject: Y,
            workerBadge: A
        } = q,
        O = M8(uKA),
        w;
    if (K[0] !== z || K[1] !== Y || K[2] !== O || K[3] !== _) w = function(G) {
        if (G === "yes") d("tengu_plan_enter", {
            interviewPhaseEnabled: Sj(),
            entryMethod: "tool"
        }), bi(O, "plan"), z(), _.onAllow({}, [{
            type: "setMode",
            mode: "plan",
            destination: "session"
        }]);
        else z(), Y(), _.onReject()
    }, K[0] = z, K[1] = Y, K[2] = O, K[3] = _, K[4] = w;
    else w = K[4];
    let $ = w,
        j;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) j = VL.default.createElement(T, null, "Claude wants to enter plan mode to explore and design an implementation approach."), K[5] = j;
    else j = K[5];
    let H;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) H = VL.default.createElement(u, {
        marginTop: 1,
        flexDirection: "column"
    }, VL.default.createElement(T, {
        dimColor: !0
    }, "In plan mode, Claude will:"), VL.default.createElement(T, {
        dimColor: !0
    }, " · Explore the codebase thoroughly"), VL.default.createElement(T, {
        dimColor: !0
    }, " · Identify existing patterns"), VL.default.createElement(T, {
        dimColor: !0
    }, " · Design an implementation strategy"), VL.default.createElement(T, {
        dimColor: !0
    }, " · Present a plan for your approval")), K[6] = H;
    else H = K[6];
    let J;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) J = VL.default.createElement(u, {
        marginTop: 1
    }, VL.default.createElement(T, {
        dimColor: !0
    }, "No code changes will be made until you approve the plan.")), K[7] = J;
    else J = K[7];
    let X;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) X = {
        label: "Yes, enter plan mode",
        value: "yes"
    }, K[8] = X;
    else X = K[8];
    let M;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) M = [X, {
        label: "No, start implementing now",
        value: "no"
    }], K[9] = M;
    else M = K[9];
    let P;
    if (K[10] !== $) P = () => $("no"), K[10] = $, K[11] = P;
    else P = K[11];
    let W;
    if (K[12] !== $ || K[13] !== P) W = VL.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1,
        paddingX: 1
    }, j, H, J, VL.default.createElement(u, {
        marginTop: 1
    }, VL.default.createElement(A1, {
        options: M,
        onChange: $,
        onCancel: P
    }))), K[12] = $, K[13] = P, K[14] = W;
    else W = K[14];
    let D;
    if (K[15] !== W || K[16] !== A) D = VL.default.createElement(IY, {
        color: "planMode",
        title: "Enter plan mode?",
        workerBadge: A
    }, W), K[15] = W, K[16] = A, K[17] = D;
    else D = K[17];
    return D
}
// @from(Ln 521083, Col 0)
function uKA(q) {
    return q.toolPermissionContext.mode
}
// @from(Ln 521086, Col 4)
VL
// @from(Ln 521087, Col 4)
o45 = L(() => {
    o6();
    y8();
    g6();
    C8();
    N7();
    e96();
    g_();
    pD();
    VL = K6(P6(), 1)
})
// @from(Ln 521099, Col 0)
function $s8(q, K) {
    let _ = [{
        type: "setMode",
        mode: Sm(q),
        destination: "session"
    }];
    if (VK6() && K && K.length > 0) _.push({
        type: "addRules",
        rules: K.map((z) => ({
            toolName: z.tool,
            ruleContent: NP4(z.prompt)
        })),
        behavior: "allow",
        destination: "session"
    });
    return _
}
// @from(Ln 521117, Col 0)
function mKA(q, K, _) {
    if (uN()) return;
    if (!_ && NH(I8())) return;
    zr8([t8({
        content: q.slice(0, 1000)
    })], new AbortController().signal).then(async (z) => {
        if (!z || NH(I8())) return;
        let Y = I8(),
            A = bY();
        await AN(Y, z, A, "auto"), await oP6(Y, z, A, "auto"), K((O) => {
            if (O.standaloneAgentContext?.name === z) return O;
            return {
                ...O,
                standaloneAgentContext: {
                    ...O.standaloneAgentContext,
                    name: z
                }
            }
        })
    }).catch(j6)
}
// @from(Ln 521139, Col 0)
function a45({
    toolUseConfirm: q,
    onDone: K,
    onReject: _,
    workerBadge: z,
    setStickyFooter: Y
}) {
    let A = M8((r) => r.toolPermissionContext),
        O = R7(),
        w = H9(),
        {
            addNotification: $
        } = EK(),
        [j, H] = yK.useState(""),
        [J, X] = yK.useState({}),
        M = yK.useRef(0),
        P = M8((r) => r.settings.showClearContextOnPlanAccept) ?? !1,
        W = M8((r) => r.ultraplanSessionUrl),
        D = M8((r) => r.ultraplanLaunching),
        Z = s2(),
        G = hn() && N5("allow_remote_sessions") && !W && !D,
        f = q.assistantMessage.message.usage,
        {
            mode: v,
            isAutoModeAvailable: V,
            isBypassPermissionsModeAvailable: k
        } = A,
        N = yK.useMemo(() => BKA({
            showClearContext: P,
            showUltraplan: G,
            usedPercent: P ? pKA(f, v) : null,
            isAutoModeAvailable: V,
            isBypassPermissionsModeAvailable: k,
            onFeedbackChange: H
        }), [P, G, f, v, V, k]);

    function R(r, t, Y6, X6, M6) {
        let W6 = M.current++,
            V6 = {
                id: W6,
                type: "image",
                content: r,
                mediaType: t || "image/png",
                filename: Y6 || "Pasted image",
                dimensions: X6
            };
        eu6(V6, O), qm6(V6, O), X((f6) => ({
            ...f6,
            [W6]: V6
        }))
    }
    let h = yK.useCallback((r) => {
            X((t) => {
                let Y6 = {
                    ...t
                };
                return delete Y6[r], Y6
            })
        }, []),
        C = Object.values(J).filter((r) => r.type === "image"),
        x = C.length > 0,
        B = q.tool.name === dP,
        m = B ? void 0 : q.input.plan,
        S = B ? eW() : void 0,
        F = q.input.allowedPrompts,
        U = m ?? lP(),
        g = !U || U.trim() === "",
        [c] = yK.useState(() => vd8() ?? void 0),
        [n, l] = yK.useState(() => {
            if (m) return m;
            return lP() ?? "No plan found. Please write your plan to the plan file first."
        }),
        [z6, A6] = yK.useState(!1),
        [e, i] = yK.useState(!1);
    yK.useEffect(() => {
        if (z6) {
            let r = setTimeout(A6, 5000, !1);
            return () => clearTimeout(r)
        }
    }, [z6]);
    let O6 = (r) => {
        if (r.ctrl && r.key === "g") {
            r.preventDefault(), d("tengu_plan_external_editor_used", {}), (async () => {
                if (B && S) {
                    let t = await xS(S);
                    if (t.error) $({
                        key: "external-editor-error",
                        text: t.error,
                        color: "warning",
                        priority: "high"
                    });
                    if (t.content !== null) {
                        if (t.content !== n) i(!0);
                        l(t.content), A6(!0)
                    }
                } else {
                    let t = await ML(n);
                    if (t.error) $({
                        key: "external-editor-error",
                        text: t.error,
                        color: "warning",
                        priority: "high"
                    });
                    if (t.content !== null && t.content !== n) l(t.content), A6(!0)
                }
            })();
            return
        }
        if (r.shift && r.key === "tab") {
            r.preventDefault(), J6(P ? "yes-accept-edits" : "yes-accept-edits-keep-context");
            return
        }
    };
    async function J6(r) {
        let t = j.trim(),
            Y6 = t || void 0;
        if (r === "ultraplan") {
            d("tengu_plan_exit", {
                planLengthChars: n.length,
                outcome: "ultraplan",
                interviewPhaseEnabled: Sj(),
                planStructureVariant: c
            }), K(), _(), q.onReject("Plan being refined via Ultraplan — please wait for the result."), c_8({
                arg: "",
                seedPlan: n,
                getAppState: w.getState,
                setAppState: w.setState,
                signal: new AbortController().signal
            }).then((T6) => LY({
                value: T6,
                mode: "task-notification"
            })).catch(j6);
            return
        }
        let X6 = B && !e ? {} : {
            plan: n
        };
        {
            let T6 = (r === "yes-resume-auto-mode" || r === "yes-auto-clear-context") && $L(),
                v6 = Hm6?.isAutoModeActive() ?? !1;
            if (r !== "no" && !T6 && v6) Hm6?.setAutoModeActive(!1), sG(!0), O((L6) => ({
                ...L6,
                toolPermissionContext: {
                    ...pe(L6.toolPermissionContext),
                    prePlanMode: void 0
                }
            }))
        }
        let W6 = r === "yes-accept-edits-keep-context" || r === "yes-default-keep-context" || r === "yes-resume-auto-mode";
        if (r !== "no") mKA(n, O, !W6);
        if (r !== "no" && !W6) {
            let T6 = "default";
            if (r === "yes-bypass-permissions") T6 = "bypassPermissions";
            else if (r === "yes-accept-edits") T6 = "acceptEdits";
            else if (r === "yes-auto-clear-context" && $L()) T6 = "auto", Hm6?.setAutoModeActive(!0);
            d("tengu_plan_exit", {
                planLengthChars: n.length,
                outcome: r,
                clearContext: !0,
                interviewPhaseEnabled: Sj(),
                planStructureVariant: c,
                hasFeedback: !!Y6
            });
            let v6 = "",
                y6 = `

If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: ${bY()}`,
                c6 = z4() ? `

If this plan can be broken down into multiple independent tasks, consider using the ${lp} tool to create a team and parallelize the work.` : "",
                Z8 = Y6 ? `

User feedback on this plan: ${Y6}` : "";
            O((N8) => ({
                ...N8,
                initialMessage: {
                    message: {
                        ...t8({
                            content: `Implement the following plan:

${n}${v6}${y6}${c6}${Z8}`
                        }),
                        planContent: n
                    },
                    clearContext: !0,
                    mode: T6,
                    allowedPrompts: F
                }
            })), iL(!0), K(), _(), q.onReject();
            return
        }
        if (r === "yes-resume-auto-mode" && $L()) {
            d("tengu_plan_exit", {
                planLengthChars: n.length,
                outcome: r,
                clearContext: !1,
                interviewPhaseEnabled: Sj(),
                planStructureVariant: c,
                hasFeedback: !!Y6
            }), iL(!0), Km(!0), Hm6?.setAutoModeActive(!0), O((T6) => ({
                ...T6,
                toolPermissionContext: Pu({
                    ...T6.toolPermissionContext,
                    mode: "auto",
                    prePlanMode: void 0
                })
            })), K(), q.onAllow(X6, [], Y6);
            return
        }
        let f6 = {
            "yes-accept-edits-keep-context": A.isBypassPermissionsModeAvailable ? "bypassPermissions" : "acceptEdits",
            "yes-default-keep-context": "default",
            ...{
                "yes-resume-auto-mode": "default"
            }
        } [r];
        if (f6) {
            d("tengu_plan_exit", {
                planLengthChars: n.length,
                outcome: r,
                clearContext: !1,
                interviewPhaseEnabled: Sj(),
                planStructureVariant: c,
                hasFeedback: !!Y6
            }), iL(!0), Km(!0), K(), q.onAllow(X6, $s8(f6, F), Y6);
            return
        }
        let k6 = {
            "yes-bypass-permissions": "bypassPermissions",
            "yes-accept-edits": "acceptEdits"
        } [r];
        if (k6) {
            d("tengu_plan_exit", {
                planLengthChars: n.length,
                outcome: r,
                interviewPhaseEnabled: Sj(),
                planStructureVariant: c,
                hasFeedback: !!Y6
            }), iL(!0), Km(!0), K(), q.onAllow(X6, $s8(k6, F), Y6);
            return
        }
        if (r === "no") {
            if (!t && !x) return;
            d("tengu_plan_exit", {
                planLengthChars: n.length,
                outcome: "no",
                interviewPhaseEnabled: Sj(),
                planStructureVariant: c
            });
            let T6;
            if (x) T6 = await Promise.all(C.map(async (v6) => {
                let {
                    block: L6
                } = await sE({
                    data: v6.content,
                    mediaType: v6.mediaType,
                    limits: vO(Z)
                });
                return L6
            }));
            K(), _(), q.onReject(t || (x ? "(See attached image)" : void 0), T6 && T6.length > 0 ? T6 : void 0)
        }
    }
    let $6 = XL(),
        H6 = $6 ? kH($6) : null,
        q6 = yK.useRef(J6);
    q6.current = J6;
    let o = yK.useRef(void 0);
    o.current = () => {
        d("tengu_plan_exit", {
            planLengthChars: n.length,
            outcome: "no",
            interviewPhaseEnabled: Sj(),
            planStructureVariant: c
        }), K(), _(), q.onReject()
    };
    let _6 = !g && !!Y;
    if (yK.useLayoutEffect(() => {
            if (!_6) return;
            return Y(yK.default.createElement(u, {
                flexDirection: "column",
                borderStyle: "round",
                borderColor: "planMode",
                borderLeft: !1,
                borderRight: !1,
                borderBottom: !1,
                paddingX: 1
            }, yK.default.createElement(T, {
                dimColor: !0
            }, "Would you like to proceed?"), yK.default.createElement(u, {
                marginTop: 1
            }, yK.default.createElement(A1, {
                options: N,
                onChange: (r) => void q6.current(r),
                onCancel: () => o.current?.(),
                onImagePaste: R,
                pastedContents: J,
                onRemoveImage: h
            })), H6 && yK.default.createElement(u, {
                flexDirection: "row",
                gap: 1,
                marginTop: 1
            }, yK.default.createElement(T, {
                dimColor: !0
            }, "ctrl-g to edit in "), yK.default.createElement(T, {
                bold: !0,
                dimColor: !0
            }, H6), B && S && yK.default.createElement(T, {
                dimColor: !0
            }, " · ", S3(S)), z6 && yK.default.createElement(yK.default.Fragment, null, yK.default.createElement(T, {
                dimColor: !0
            }, " · "), yK.default.createElement(T, {
                color: "success"
            }, yK.default.createElement(D4, {
                status: "success",
                withSpace: !0
            }), "Plan saved!"))))), () => Y(null)
        }, [_6, Y, N, J, H6, B, S, z6]), g) return yK.default.createElement(IY, {
        color: "planMode",
        title: "Exit plan mode?",
        workerBadge: z
    }, yK.default.createElement(u, {
        flexDirection: "column",
        paddingX: 1,
        marginTop: 1
    }, yK.default.createElement(T, null, "Claude wants to exit plan mode"), yK.default.createElement(u, {
        marginTop: 1
    }, yK.default.createElement(A1, {
        options: [{
            label: "Yes",
            value: "yes"
        }, {
            label: "No",
            value: "no"
        }],
        onChange: function(t) {
            if (t === "yes") {
                if (d("tengu_plan_exit", {
                        planLengthChars: 0,
                        outcome: "yes-default",
                        interviewPhaseEnabled: Sj(),
                        planStructureVariant: c
                    }), Hm6?.isAutoModeActive() ?? !1) Hm6?.setAutoModeActive(!1), sG(!0), O((X6) => ({
                    ...X6,
                    toolPermissionContext: {
                        ...pe(X6.toolPermissionContext),
                        prePlanMode: void 0
                    }
                }));
                iL(!0), Km(!0), K(), q.onAllow({}, [{
                    type: "setMode",
                    mode: "default",
                    destination: "session"
                }])
            } else d("tengu_plan_exit", {
                planLengthChars: 0,
                outcome: "no",
                interviewPhaseEnabled: Sj(),
                planStructureVariant: c
            }), K(), _(), q.onReject()
        },
        onCancel: () => {
            d("tengu_plan_exit", {
                planLengthChars: 0,
                outcome: "no",
                interviewPhaseEnabled: Sj(),
                planStructureVariant: c
            }), K(), _(), q.onReject()
        }
    }))));
    return yK.default.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: O6
    }, yK.default.createElement(IY, {
        color: "planMode",
        title: "Ready to code?",
        innerPaddingX: 0,
        workerBadge: z
    }, yK.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, yK.default.createElement(u, {
        paddingX: 1,
        flexDirection: "column"
    }, yK.default.createElement(T, null, "Here is Claude's plan:")), yK.default.createElement(u, {
        borderColor: "subtle",
        borderStyle: "dashed",
        flexDirection: "column",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1,
        marginBottom: 1,
        overflow: "hidden"
    }, yK.default.createElement(xw, null, n)), yK.default.createElement(u, {
        flexDirection: "column",
        paddingX: 1
    }, yK.default.createElement(iT, {
        permissionResult: q.permissionResult,
        toolType: "tool"
    }), VK6() && F && F.length > 0 && yK.default.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, yK.default.createElement(T, {
        bold: !0
    }, "Requested permissions:"), F.map((r, t) => yK.default.createElement(T, {
        key: t,
        dimColor: !0
    }, "  ", "· ", r.tool, "(", kP4, " ", r.prompt, ")"))), !_6 && yK.default.createElement(yK.default.Fragment, null, yK.default.createElement(T, {
        dimColor: !0
    }, "Claude has written up a plan and is ready to execute. Would you like to proceed?"), yK.default.createElement(u, {
        marginTop: 1
    }, yK.default.createElement(A1, {
        options: N,
        onChange: J6,
        onCancel: () => o.current?.(),
        onImagePaste: R,
        pastedContents: J,
        onRemoveImage: h
    })))))), !_6 && H6 && yK.default.createElement(u, {
        flexDirection: "row",
        gap: 1,
        paddingX: 1,
        marginTop: 1
    }, yK.default.createElement(u, null, yK.default.createElement(T, {
        dimColor: !0
    }, "ctrl-g to edit in "), yK.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, H6), B && S && yK.default.createElement(T, {
        dimColor: !0
    }, " · ", S3(S))), z6 && yK.default.createElement(u, null, yK.default.createElement(T, {
        dimColor: !0
    }, " · "), yK.default.createElement(T, {
        color: "success"
    }, yK.default.createElement(D4, {
        status: "success",
        withSpace: !0
    }), "Plan saved!"))))
}
// @from(Ln 521581, Col 0)
function BKA({
    showClearContext: q,
    showUltraplan: K,
    usedPercent: _,
    isAutoModeAvailable: z,
    isBypassPermissionsModeAvailable: Y,
    onFeedbackChange: A
}) {
    let O = [],
        w = _ !== null ? ` (${_}% used)` : "";
    if (q)
        if (z) O.push({
            label: `Yes, clear context${w} and use auto mode`,
            value: "yes-auto-clear-context"
        });
        else if (Y) O.push({
        label: `Yes, clear context${w} and bypass permissions`,
        value: "yes-bypass-permissions"
    });
    else O.push({
        label: `Yes, clear context${w} and auto-accept edits`,
        value: "yes-accept-edits"
    });
    if (z) O.push({
        label: "Yes, and use auto mode",
        value: "yes-resume-auto-mode"
    });
    else if (Y) O.push({
        label: "Yes, and bypass permissions",
        value: "yes-accept-edits-keep-context"
    });
    else O.push({
        label: "Yes, auto-accept edits",
        value: "yes-accept-edits-keep-context"
    });
    if (O.push({
            label: "Yes, manually approve edits",
            value: "yes-default-keep-context"
        }), K) O.push({
        label: "No, refine with Ultraplan on Claude Code on the web",
        value: "ultraplan"
    });
    return O.push({
        type: "input",
        label: "No, keep planning",
        value: "no",
        placeholder: "Tell Claude what to change",
        description: "shift+tab to approve with this feedback",
        onChange: A
    }), O
}
// @from(Ln 521633, Col 0)
function pKA(q, K) {
    if (!q) return null;
    let _ = HB({
            permissionMode: K,
            mainLoopModel: G5(),
            exceeds200kTokens: !1
        }),
        z = ff(_, eM()),
        {
            used: Y
        } = MV8({
            input_tokens: q.input_tokens,
            cache_creation_input_tokens: q.cache_creation_input_tokens ?? 0,
            cache_read_input_tokens: q.cache_read_input_tokens ?? 0
        }, z);
    return Y
}
// @from(Ln 521650, Col 4)
yK
// @from(Ln 521650, Col 8)
Hm6
// @from(Ln 521651, Col 4)
HM7 = L(() => {
    kY();
    C8();
    N7();
    y8();
    N27();
    $W6();
    oy();
    g6();
    J2();
    sY();
    fO();
    AJ();
    Tn();
    eK();
    kj();
    U8();
    b$();
    _7();
    Jk();
    Sq();
    OP();
    vX();
    e96();
    NJ();
    uS();
    g4();
    d_8();
    g_();
    Y2();
    ry();
    pD();
    V66();
    CI();
    Km6();
    yK = K6(P6(), 1), Hm6 = (Kn(), B7(Pe))
})
// @from(Ln 521689, Col 0)
function Jm6(q) {
    let K = s(57),
        {
            options: _,
            onSelect: z,
            onCancel: Y,
            question: A,
            toolAnalyticsContext: O
        } = q,
        w = A === void 0 ? "Do you want to proceed?" : A,
        $ = R7(),
        [j, H] = xG.useState(""),
        [J, X] = xG.useState(""),
        [M, P] = xG.useState(!1),
        [W, D] = xG.useState(!1),
        [Z, G] = xG.useState(null),
        [f, v] = xG.useState(!1),
        [V, k] = xG.useState(!1),
        N;
    if (K[0] !== Z || K[1] !== _) {
        let q6;
        if (K[3] !== Z) q6 = (o) => o.value === Z, K[3] = Z, K[4] = q6;
        else q6 = K[4];
        N = _.find(q6), K[0] = Z, K[1] = _, K[2] = N
    } else N = K[2];
    let h = N?.feedbackConfig?.type,
        C = h === "accept" && !M || h === "reject" && !W,
        x;
    if (K[5] !== M || K[6] !== _ || K[7] !== W) {
        let q6;
        if (K[9] !== M || K[10] !== W) q6 = (o) => {
            let {
                value: _6,
                label: r,
                feedbackConfig: t
            } = o;
            if (!t) return {
                label: r,
                value: _6
            };
            let {
                type: Y6,
                placeholder: X6
            } = t, M6 = Y6 === "accept" ? M : W, W6 = Y6 === "accept" ? H : X, V6 = FKA[Y6];
            if (M6) return {
                type: "input",
                label: r,
                value: _6,
                placeholder: X6 ?? V6,
                onChange: W6,
                allowEmptySubmitToCancel: !0
            };
            return {
                label: r,
                value: _6
            }
        }, K[9] = M, K[10] = W, K[11] = q6;
        else q6 = K[11];
        x = _.map(q6), K[5] = M, K[6] = _, K[7] = W, K[8] = x
    } else x = K[8];
    let B = x,
        m;
    if (K[12] !== M || K[13] !== _ || K[14] !== W || K[15] !== O?.isMcp || K[16] !== O?.toolName) m = (q6) => {
        let o = _.find((t) => t.value === q6);
        if (!o?.feedbackConfig) return;
        let {
            type: _6
        } = o.feedbackConfig, r = {
            toolName: O?.toolName,
            isMcp: O?.isMcp ?? !1
        };
        if (_6 === "accept")
            if (M) P(!1), d("tengu_accept_feedback_mode_collapsed", r);
            else P(!0), v(!0), d("tengu_accept_feedback_mode_entered", r);
        else if (_6 === "reject")
            if (W) D(!1), d("tengu_reject_feedback_mode_collapsed", r);
            else D(!0), k(!0), d("tengu_reject_feedback_mode_entered", r)
    }, K[12] = M, K[13] = _, K[14] = W, K[15] = O?.isMcp, K[16] = O?.toolName, K[17] = m;
    else m = K[17];
    let S = m,
        F;
    if (K[18] !== j || K[19] !== f || K[20] !== z || K[21] !== _ || K[22] !== J || K[23] !== V || K[24] !== O?.isMcp || K[25] !== O?.toolName) F = (q6) => {
        let o = _.find((r) => r.value === q6);
        if (!o) return;
        let _6;
        if (o.feedbackConfig) {
            let t = (o.feedbackConfig.type === "accept" ? j : J).trim();
            if (t) _6 = t;
            let Y6 = {
                toolName: O?.toolName,
                isMcp: O?.isMcp ?? !1,
                has_instructions: !!t,
                instructions_length: t?.length ?? 0,
                entered_feedback_mode: o.feedbackConfig.type === "accept" ? f : V
            };
            if (o.feedbackConfig.type === "accept") d("tengu_accept_submitted", Y6);
            else if (o.feedbackConfig.type === "reject") d("tengu_reject_submitted", Y6)
        }
        z(q6, _6)
    }, K[18] = j, K[19] = f, K[20] = z, K[21] = _, K[22] = J, K[23] = V, K[24] = O?.isMcp, K[25] = O?.toolName, K[26] = F;
    else F = K[26];
    let U = F,
        g;
    if (K[27] !== U || K[28] !== _) {
        g = {};
        for (let q6 of _)
            if (q6.keybinding) g[q6.keybinding] = () => U(q6.value);
        K[27] = U, K[28] = _, K[29] = g
    } else g = K[29];
    let c = g,
        n;
    if (K[30] === Symbol.for("react.memo_cache_sentinel")) n = {
        context: "Confirmation"
    }, K[30] = n;
    else n = K[30];
    L7(c, n);
    let l;
    if (K[31] !== Y || K[32] !== $) l = () => {
        d("tengu_permission_request_escape", {}), $(gKA), Y?.()
    }, K[31] = Y, K[32] = $, K[33] = l;
    else l = K[33];
    let z6 = l,
        A6;
    if (K[34] !== w) A6 = typeof w === "string" ? xG.default.createElement(T, null, w) : w, K[34] = w, K[35] = A6;
    else A6 = K[35];
    let e;
    if (K[36] !== j || K[37] !== M || K[38] !== _ || K[39] !== J || K[40] !== W) e = (q6) => {
        let o = _.find((_6) => _6.value === q6);
        if (o?.feedbackConfig?.type !== "accept" && M && !j.trim()) P(!1);
        if (o?.feedbackConfig?.type !== "reject" && W && !J.trim()) D(!1);
        G(q6)
    }, K[36] = j, K[37] = M, K[38] = _, K[39] = J, K[40] = W, K[41] = e;
    else e = K[41];
    let i;
    if (K[42] !== z6 || K[43] !== S || K[44] !== U || K[45] !== B || K[46] !== e) i = xG.default.createElement(A1, {
        options: B,
        inlineDescriptions: !0,
        onChange: U,
        onCancel: z6,
        onFocus: e,
        onInputModeToggle: S
    }), K[42] = z6, K[43] = S, K[44] = U, K[45] = B, K[46] = e, K[47] = i;
    else i = K[47];
    let O6;
    if (K[48] === Symbol.for("react.memo_cache_sentinel")) O6 = xG.default.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }), K[48] = O6;
    else O6 = K[48];
    let J6;
    if (K[49] !== C) J6 = C && xG.default.createElement(A8, {
        chord: "tab",
        action: "amend"
    }), K[49] = C, K[50] = J6;
    else J6 = K[50];
    let $6;
    if (K[51] !== J6) $6 = xG.default.createElement(u, {
        marginTop: 1
    }, xG.default.createElement(T, {
        dimColor: !0
    }, xG.default.createElement(z1, null, O6, J6))), K[51] = J6, K[52] = $6;
    else $6 = K[52];
    let H6;
    if (K[53] !== i || K[54] !== $6 || K[55] !== A6) H6 = xG.default.createElement(u, {
        flexDirection: "column"
    }, A6, i, $6), K[53] = i, K[54] = $6, K[55] = A6, K[56] = H6;
    else H6 = K[56];
    return H6
}
// @from(Ln 521859, Col 0)
function gKA(q) {
    return {
        ...q,
        attribution: {
            ...q.attribution,
            escapeCount: q.attribution.escapeCount + 1
        }
    }
}
// @from(Ln 521868, Col 4)
xG
// @from(Ln 521868, Col 8)
FKA
// @from(Ln 521869, Col 4)
js8 = L(() => {
    o6();
    g6();
    C7();
    C8();
    N7();
    gK();
    Nq();
    u7();
    xG = K6(P6(), 1), FKA = {
        accept: "tell Claude what to do next",
        reject: "tell Claude what to do differently"
    }
})
// @from(Ln 521884, Col 0)
function mW6(q) {
    let K = s(61),
        {
            toolUseConfirm: _,
            onDone: z,
            onReject: Y,
            workerBadge: A
        } = q,
        [O] = Zq(),
        w, $;
    if (K[0] !== _.input || K[1] !== _.tool) w = _.tool.userFacingName(_.input), $ = w.endsWith(" (MCP)") ? w.slice(0, -6) : w, K[0] = _.input, K[1] = _.tool, K[2] = w, K[3] = $;
    else w = K[2], $ = K[3];
    let j = $,
        H;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) H = {
        completion_type: "tool_use_single",
        language_name: "none"
    }, K[4] = H;
    else H = K[4];
    TL(_, H);
    let X;
    if (K[5] !== z || K[6] !== Y || K[7] !== _) X = (e, i) => {
        q: switch (e) {
            case "yes": {
                bG({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: _.assistantMessage.message.id,
                        platform: X7.platform
                    }
                }), _.onAllow(_.input, [], i), z();
                break q
            }
            case "yes-dont-ask-again": {
                bG({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: _.assistantMessage.message.id,
                        platform: X7.platform
                    }
                }), _.onAllow(_.input, [{
                    type: "addRules",
                    rules: [{
                        toolName: _.tool.name
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }]), z();
                break q
            }
            case "no":
                bG({
                    completion_type: "tool_use_single",
                    event: "reject",
                    metadata: {
                        language_name: "none",
                        message_id: _.assistantMessage.message.id,
                        platform: X7.platform
                    }
                }), _.onReject(i), Y(), z()
        }
    }, K[5] = z, K[6] = Y, K[7] = _, K[8] = X;
    else X = K[8];
    let M = X,
        P;
    if (K[9] !== z || K[10] !== Y || K[11] !== _) P = () => {
        bG({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
                language_name: "none",
                message_id: _.assistantMessage.message.id,
                platform: X7.platform
            }
        }), _.onReject(), Y(), z()
    }, K[9] = z, K[10] = Y, K[11] = _, K[12] = P;
    else P = K[12];
    let W = P,
        D;
    if (K[13] === Symbol.for("react.memo_cache_sentinel")) D = Y7(), K[13] = D;
    else D = K[13];
    let Z = D,
        G;
    if (K[14] === Symbol.for("react.memo_cache_sentinel")) G = xI(), K[14] = G;
    else G = K[14];
    let f = G,
        v = _.permissionResult.decisionReason,
        V = v?.type === "safetyCheck" && !v.classifierApprovable,
        k;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) k = {
        label: "Yes",
        value: "yes",
        feedbackConfig: {
            type: "accept"
        }
    }, K[15] = k;
    else k = K[15];
    let N;
    if (K[16] !== V || K[17] !== j) {
        if (N = [k], f && !V) {
            let i;
            if (K[19] !== j) i = mu.default.createElement(T, {
                bold: !0
            }, j), K[19] = j, K[20] = i;
            else i = K[20];
            let O6;
            if (K[21] === Symbol.for("react.memo_cache_sentinel")) O6 = mu.default.createElement(T, {
                bold: !0
            }, Z), K[21] = O6;
            else O6 = K[21];
            let J6;
            if (K[22] !== i) J6 = {
                label: mu.default.createElement(T, null, "Yes, and don't ask again for ", i, " ", "commands in ", O6),
                value: "yes-dont-ask-again"
            }, K[22] = i, K[23] = J6;
            else J6 = K[23];
            N.push(J6)
        }
        let e;
        if (K[24] === Symbol.for("react.memo_cache_sentinel")) e = {
            label: "No",
            value: "no",
            feedbackConfig: {
                type: "reject"
            }
        }, K[24] = e;
        else e = K[24];
        N.push(e), K[16] = V, K[17] = j, K[18] = N
    } else N = K[18];
    let R = N,
        h;
    if (K[25] !== _.tool.name) h = PK(_.tool.name), K[25] = _.tool.name, K[26] = h;
    else h = K[26];
    let C = _.tool.isMcp ?? !1,
        x;
    if (K[27] !== h || K[28] !== C) x = {
        toolName: h,
        isMcp: C
    }, K[27] = h, K[28] = C, K[29] = x;
    else x = K[29];
    let B = x,
        m;
    if (K[30] !== O || K[31] !== _.input || K[32] !== _.tool) m = _.tool.renderToolUseMessage(_.input, {
        theme: O,
        verbose: !0
    }), K[30] = O, K[31] = _.input, K[32] = _.tool, K[33] = m;
    else m = K[33];
    let S;
    if (K[34] !== w) S = w.endsWith(" (MCP)") ? mu.default.createElement(T, {
        dimColor: !0
    }, " (MCP)") : "", K[34] = w, K[35] = S;
    else S = K[35];
    let F;
    if (K[36] !== m || K[37] !== S || K[38] !== j) F = mu.default.createElement(T, null, j, "(", m, ")", S), K[36] = m, K[37] = S, K[38] = j, K[39] = F;
    else F = K[39];
    let U;
    if (K[40] !== _.description) U = KJ8(_.description, 3), K[40] = _.description, K[41] = U;
    else U = K[41];
    let g;
    if (K[42] !== U) g = mu.default.createElement(T, {
        dimColor: !0
    }, U), K[42] = U, K[43] = g;
    else g = K[43];
    let c;
    if (K[44] !== F || K[45] !== g) c = mu.default.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, F, g), K[44] = F, K[45] = g, K[46] = c;
    else c = K[46];
    let n;
    if (K[47] !== _.permissionResult) n = mu.default.createElement(iT, {
        permissionResult: _.permissionResult,
        toolType: "tool"
    }), K[47] = _.permissionResult, K[48] = n;
    else n = K[48];
    let l;
    if (K[49] !== W || K[50] !== M || K[51] !== R || K[52] !== B) l = mu.default.createElement(Jm6, {
        options: R,
        onSelect: M,
        onCancel: W,
        toolAnalyticsContext: B
    }), K[49] = W, K[50] = M, K[51] = R, K[52] = B, K[53] = l;
    else l = K[53];
    let z6;
    if (K[54] !== n || K[55] !== l) z6 = mu.default.createElement(u, {
        flexDirection: "column"
    }, n, l), K[54] = n, K[55] = l, K[56] = z6;
    else z6 = K[56];
    let A6;
    if (K[57] !== c || K[58] !== z6 || K[59] !== A) A6 = mu.default.createElement(IY, {
        title: "Tool use",
        workerBadge: A
    }, c, z6), K[57] = c, K[58] = z6, K[59] = A, K[60] = A6;
    else A6 = K[60];
    return A6
}
// @from(Ln 522085, Col 4)
mu
// @from(Ln 522086, Col 4)
JM7 = L(() => {
    o6();
    y8();
    g6();
    q2();
    D_();
    uI();
    Om6();
    fz6();
    pD();
    js8();
    V66();
    mu = K6(P6(), 1)
})
// @from(Ln 522101, Col 0)
function Hs8(q, K, _, z) {
    return {
        filePath: q,
        edits: [{
            old_string: K,
            new_string: _,
            replace_all: z
        }],
        editMode: "single"
    }
}
// @from(Ln 522117, Col 0)
function s45(q) {
    let K = s(51),
        _ = cKA,
        z, Y, A, O, w, $, j, H, J, X, M, P, W, D, Z, G, f, v;
    if (K[0] !== q.onDone || K[1] !== q.onReject || K[2] !== q.toolUseConfirm || K[3] !== q.toolUseContext || K[4] !== q.workerBadge)({
        file_path: O,
        old_string: $,
        new_string: w,
        replace_all: j
    } = _(q.toolUseConfirm.input)), A = Qn, W = q.toolUseConfirm, D = q.toolUseContext, Z = q.onDone, G = q.onReject, f = q.workerBadge, v = "Edit file", X = QKA(b8(), O), Y = T, M = "Do you want to make this edit to", P = " ", z = T, H = !0, J = UKA(O), K[0] = q.onDone, K[1] = q.onReject, K[2] = q.toolUseConfirm, K[3] = q.toolUseContext, K[4] = q.workerBadge, K[5] = z, K[6] = Y, K[7] = A, K[8] = O, K[9] = w, K[10] = $, K[11] = j, K[12] = H, K[13] = J, K[14] = X, K[15] = M, K[16] = P, K[17] = W, K[18] = D, K[19] = Z, K[20] = G, K[21] = f, K[22] = v;
    else z = K[5], Y = K[6], A = K[7], O = K[8], w = K[9], $ = K[10], j = K[11], H = K[12], J = K[13], X = K[14], M = K[15], P = K[16], W = K[17], D = K[18], Z = K[19], G = K[20], f = K[21], v = K[22];
    let V;
    if (K[23] !== z || K[24] !== H || K[25] !== J) V = Qz8.default.createElement(z, {
        bold: H
    }, J), K[23] = z, K[24] = H, K[25] = J, K[26] = V;
    else V = K[26];
    let k;
    if (K[27] !== Y || K[28] !== V || K[29] !== M || K[30] !== P) k = Qz8.default.createElement(Y, null, M, P, V, "?"), K[27] = Y, K[28] = V, K[29] = M, K[30] = P, K[31] = k;
    else k = K[31];
    let N = j || !1,
        R;
    if (K[32] !== w || K[33] !== $ || K[34] !== N) R = [{
        old_string: $,
        new_string: w,
        replace_all: N
    }], K[32] = w, K[33] = $, K[34] = N, K[35] = R;
    else R = K[35];
    let h;
    if (K[36] !== O || K[37] !== R) h = Qz8.default.createElement(As8, {
        file_path: O,
        edits: R
    }), K[36] = O, K[37] = R, K[38] = h;
    else h = K[38];
    let C;
    if (K[39] !== A || K[40] !== O || K[41] !== X || K[42] !== k || K[43] !== h || K[44] !== W || K[45] !== D || K[46] !== Z || K[47] !== G || K[48] !== f || K[49] !== v) C = Qz8.default.createElement(A, {
        toolUseConfirm: W,
        toolUseContext: D,
        onDone: Z,
        onReject: G,
        workerBadge: f,
        title: v,
        subtitle: X,
        question: k,
        content: h,
        path: O,
        completionType: "str_replace_single",
        parseInput: _,
        ideDiffSupport: dKA
    }), K[39] = A, K[40] = O, K[41] = X, K[42] = k, K[43] = h, K[44] = W, K[45] = D, K[46] = Z, K[47] = G, K[48] = f, K[49] = v, K[50] = C;
    else C = K[50];
    return C
}
// @from(Ln 522170, Col 0)
function cKA(q) {
    return mM.inputSchema.parse(q)
}
// @from(Ln 522173, Col 4)
Qz8
// @from(Ln 522173, Col 9)
dKA
// @from(Ln 522174, Col 4)
t45 = L(() => {
    o6();
    zM7();
    n7();
    g6();
    A_6();
    $m6();
    Qz8 = K6(P6(), 1), dKA = {
        getConfig: (q) => Hs8(q.file_path, q.old_string, q.new_string, q.replace_all),
        applyChanges: (q, K) => {
            let _ = K[0];
            if (_) return {
                ...q,
                old_string: _.old_string,
                new_string: _.new_string,
                replace_all: _.replace_all
            };
            return q
        }
    }
})
// @from(Ln 522196, Col 0)
function lKA(q) {
    let K = q.tool;
    if ("getPath" in K && typeof K.getPath === "function") try {
        return K.getPath(q.input)
    } catch {
        return null
    }
    return null
}
// @from(Ln 522206, Col 0)
function e45(q) {
    let K = s(30),
        {
            toolUseConfirm: _,
            onDone: z,
            onReject: Y,
            verbose: A,
            toolUseContext: O,
            workerBadge: w
        } = q,
        [$] = Zq(),
        j;
    if (K[0] !== _) j = lKA(_), K[0] = _, K[1] = j;
    else j = K[1];
    let H = j,
        J;
    if (K[2] !== _.input || K[3] !== _.tool) J = _.tool.userFacingName(_.input), K[2] = _.input, K[3] = _.tool, K[4] = J;
    else J = K[4];
    let X = J,
        M = _.tool.isReadOnly(_.input),
        W = `${M?"Read":"Edit"} file`,
        D = nKA;
    if (!H) {
        let k;
        if (K[5] !== z || K[6] !== Y || K[7] !== _ || K[8] !== O || K[9] !== A || K[10] !== w) k = dz8.default.createElement(mW6, {
            toolUseConfirm: _,
            toolUseContext: O,
            onDone: z,
            onReject: Y,
            verbose: A,
            workerBadge: w
        }), K[5] = z, K[6] = Y, K[7] = _, K[8] = O, K[9] = A, K[10] = w, K[11] = k;
        else k = K[11];
        return k
    }
    let Z;
    if (K[12] !== $ || K[13] !== _.input || K[14] !== _.tool || K[15] !== A) Z = _.tool.renderToolUseMessage(_.input, {
        theme: $,
        verbose: A
    }), K[12] = $, K[13] = _.input, K[14] = _.tool, K[15] = A, K[16] = Z;
    else Z = K[16];
    let G;
    if (K[17] !== Z || K[18] !== X) G = dz8.default.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, dz8.default.createElement(T, null, X, "(", Z, ")")), K[17] = Z, K[18] = X, K[19] = G;
    else G = K[19];
    let f = G,
        v = M ? "read" : "write",
        V;
    if (K[20] !== f || K[21] !== z || K[22] !== Y || K[23] !== H || K[24] !== v || K[25] !== W || K[26] !== _ || K[27] !== O || K[28] !== w) V = dz8.default.createElement(Qn, {
        toolUseConfirm: _,
        toolUseContext: O,
        onDone: z,
        onReject: Y,
        workerBadge: w,
        title: W,
        content: f,
        path: H,
        parseInput: D,
        operationType: v,
        completionType: "tool_use_single"
    }), K[20] = f, K[21] = z, K[22] = Y, K[23] = H, K[24] = v, K[25] = W, K[26] = _, K[27] = O, K[28] = w, K[29] = V;
    else V = K[29];
    return V
}
// @from(Ln 522274, Col 0)
function nKA(q) {
    return q
}
// @from(Ln 522277, Col 4)
dz8
// @from(Ln 522278, Col 4)
qK5 = L(() => {
    o6();
    g6();
    JM7();
    $m6();
    dz8 = K6(P6(), 1)
})
// @from(Ln 522286, Col 0)
function KK5(q) {
    let K = s(15),
        {
            file_path: _,
            content: z,
            fileExists: Y,
            oldContent: A
        } = q,
        {
            columns: O
        } = s1(),
        w;
    q: {
        if (!Y) {
            w = null;
            break q
        }
        let M;
        if (K[0] !== z || K[1] !== _ || K[2] !== A) M = Vx({
            filePath: _,
            fileContents: A,
            edits: [{
                old_string: A,
                new_string: z,
                replace_all: !1
            }]
        }),
        K[0] = z,
        K[1] = _,
        K[2] = A,
        K[3] = M;
        else M = K[3];w = M
    }
    let $ = w,
        j;
    if (K[4] !== z) j = oY(z), K[4] = z, K[5] = j;
    else j = K[5];
    let H = j,
        J;
    if (K[6] !== O || K[7] !== z || K[8] !== _ || K[9] !== H || K[10] !== $ || K[11] !== A) J = $ ? L16($.map((M) => nS.createElement(il, {
        key: M.newStart,
        patch: M,
        dim: !1,
        filePath: _,
        firstLine: H,
        fileContent: A,
        width: O - 2
    })), iKA) : nS.createElement(ey, {
        code: z || "(No content)",
        filePath: _
    }), K[6] = O, K[7] = z, K[8] = _, K[9] = H, K[10] = $, K[11] = A, K[12] = J;
    else J = K[12];
    let X;
    if (K[13] !== J) X = nS.createElement(u, {
        flexDirection: "column"
    }, nS.createElement(u, {
        borderColor: "subtle",
        borderStyle: "dashed",
        flexDirection: "column",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1
    }, J)), K[13] = J, K[14] = X;
    else X = K[14];
    return X
}
// @from(Ln 522353, Col 0)
function iKA(q) {
    return nS.createElement(PJ, {
        fromLeftEdge: !0,
        key: `ellipsis-${q}`
    }, nS.createElement(T, {
        dimColor: !0
    }, "..."))
}
// @from(Ln 522361, Col 4)
nS
// @from(Ln 522362, Col 4)
_K5 = L(() => {
    o6();
    I4();
    g6();
    Rc();
    MM6();
    fb6();
    nS = K6(P6(), 1)
})
// @from(Ln 522376, Col 0)
function zK5(q) {
    let K = s(30),
        _ = sKA,
        z;
    if (K[0] !== q.toolUseConfirm.input) z = _(q.toolUseConfirm.input), K[0] = q.toolUseConfirm.input, K[1] = z;
    else z = K[1];
    let Y = z,
        {
            file_path: A,
            content: O
        } = Y,
        w;
    if (K[2] !== A) {
        try {
            w = {
                fileExists: !0,
                oldContent: VV(A)
            }
        } catch (N) {
            let R = N;
            if (!t1(R)) throw R;
            let h;
            if (K[4] === Symbol.for("react.memo_cache_sentinel")) h = {
                fileExists: !1,
                oldContent: ""
            }, K[4] = h;
            else h = K[4];
            w = h
        }
        K[2] = A, K[3] = w
    } else w = K[3];
    let {
        fileExists: $,
        oldContent: j
    } = w, H = $ ? "overwrite" : "create", J = q.toolUseConfirm, X = q.toolUseContext, M = q.onDone, P = q.onReject, W = q.workerBadge, D = $ ? "Overwrite file" : "Create file", Z;
    if (K[5] !== A) Z = oKA(b8(), A), K[5] = A, K[6] = Z;
    else Z = K[6];
    let G;
    if (K[7] !== A) G = rKA(A), K[7] = A, K[8] = G;
    else G = K[8];
    let f;
    if (K[9] !== G) f = cz8.default.createElement(T, {
        bold: !0
    }, G), K[9] = G, K[10] = f;
    else f = K[10];
    let v;
    if (K[11] !== H || K[12] !== f) v = cz8.default.createElement(T, null, "Do you want to ", H, " ", f, "?"), K[11] = H, K[12] = f, K[13] = v;
    else v = K[13];
    let V;
    if (K[14] !== O || K[15] !== $ || K[16] !== A || K[17] !== j) V = cz8.default.createElement(KK5, {
        file_path: A,
        content: O,
        fileExists: $,
        oldContent: j
    }), K[14] = O, K[15] = $, K[16] = A, K[17] = j, K[18] = V;
    else V = K[18];
    let k;
    if (K[19] !== A || K[20] !== q.onDone || K[21] !== q.onReject || K[22] !== q.toolUseConfirm || K[23] !== q.toolUseContext || K[24] !== q.workerBadge || K[25] !== v || K[26] !== V || K[27] !== D || K[28] !== Z) k = cz8.default.createElement(Qn, {
        toolUseConfirm: J,
        toolUseContext: X,
        onDone: M,
        onReject: P,
        workerBadge: W,
        title: D,
        subtitle: Z,
        question: v,
        content: V,
        path: A,
        completionType: "write_file_single",
        parseInput: _,
        ideDiffSupport: aKA
    }), K[19] = A, K[20] = q.onDone, K[21] = q.onReject, K[22] = q.toolUseConfirm, K[23] = q.toolUseContext, K[24] = q.workerBadge, K[25] = v, K[26] = V, K[27] = D, K[28] = Z, K[29] = k;
    else k = K[29];
    return k
}
// @from(Ln 522452, Col 0)
function sKA(q) {
    return hX.inputSchema.parse(q)
}
// @from(Ln 522455, Col 4)
cz8
// @from(Ln 522455, Col 9)
aKA
// @from(Ln 522456, Col 4)
YK5 = L(() => {
    o6();
    g6();
    rl();
    n7();
    m8();
    nN();
    $m6();
    _K5();
    cz8 = K6(P6(), 1), aKA = {
        getConfig: (q) => {
            let K;
            try {
                K = VV(q.file_path)
            } catch (_) {
                if (!t1(_)) throw _;
                K = ""
            }
            return Hs8(q.file_path, K, q.content, !1)
        },
        applyChanges: (q, K) => {
            let _ = K[0];
            if (_) return {
                ...q,
                content: _.new_string
            };
            return q
        }
    }
})
// @from(Ln 522490, Col 0)
function AK5(q) {
    let K = s(5),
        _;
    if (K[0] !== q.notebook_path) _ = V8().readFile(q.notebook_path, {
        encoding: "utf-8"
    }).then(q5A).catch(eKA), K[0] = q.notebook_path, K[1] = _;
    else _ = K[1];
    let z = _,
        Y;
    if (K[2] !== z || K[3] !== q) Y = CO.createElement(Js8.Suspense, {
        fallback: null
    }, CO.createElement(K5A, {
        ...q,
        promise: z
    })), K[2] = z, K[3] = q, K[4] = Y;
    else Y = K[4];
    return Y
}
// @from(Ln 522509, Col 0)
function eKA() {
    return null
}
// @from(Ln 522513, Col 0)
function q5A(q) {
    return k5(q)
}
// @from(Ln 522517, Col 0)
function K5A(q) {
    let K = s(34),
        {
            notebook_path: _,
            cell_id: z,
            new_source: Y,
            cell_type: A,
            edit_mode: O,
            verbose: w,
            width: $,
            promise: j
        } = q,
        H = O === void 0 ? "replace" : O,
        J = Js8.use(j),
        X;
    if (K[0] !== z || K[1] !== J) {
        q: {
            if (!J || !z) {
                X = "";
                break q
            }
            let R = Z58(z);
            if (R !== void 0) {
                if (J.cells[R]) {
                    let x = J.cells[R].source,
                        B;
                    if (K[3] !== x) B = Array.isArray(x) ? x.join("") : x, K[3] = x, K[4] = B;
                    else B = K[4];
                    X = B;
                    break q
                }
                X = "";
                break q
            }
            let h;
            if (K[5] !== z) h = (x) => x.id === z,
            K[5] = z,
            K[6] = h;
            else h = K[6];
            let C = J.cells.find(h);
            if (!C) {
                X = "";
                break q
            }
            X = Array.isArray(C.source) ? C.source.join("") : C.source
        }
        K[0] = z,
        K[1] = J,
        K[2] = X
    }
    else X = K[2];
    let M = X,
        P;
    q: {
        if (!J || H === "insert" || H === "delete") {
            P = null;
            break q
        }
        let R;
        if (K[7] !== Y || K[8] !== _ || K[9] !== M) R = Vx({
            filePath: _,
            fileContents: M,
            edits: [{
                old_string: M,
                new_string: Y,
                replace_all: !1
            }],
            ignoreWhitespace: !1
        }),
        K[7] = Y,
        K[8] = _,
        K[9] = M,
        K[10] = R;
        else R = K[10];P = R
    }
    let W = P,
        D;
    q: switch (H) {
        case "insert": {
            D = "Insert new cell";
            break q
        }
        case "delete": {
            D = "Delete cell";
            break q
        }
        default:
            D = "Replace cell contents"
    }
    let Z;
    if (K[11] !== _ || K[12] !== w) Z = w ? _ : tKA(b8(), _), K[11] = _, K[12] = w, K[13] = Z;
    else Z = K[13];
    let G;
    if (K[14] !== Z) G = CO.createElement(T, {
        bold: !0
    }, Z), K[14] = Z, K[15] = G;
    else G = K[15];
    let f = A ? ` (${A})` : "",
        v;
    if (K[16] !== z || K[17] !== D || K[18] !== f) v = CO.createElement(T, {
        dimColor: !0
    }, D, " for cell ", z, f), K[16] = z, K[17] = D, K[18] = f, K[19] = v;
    else v = K[19];
    let V;
    if (K[20] !== G || K[21] !== v) V = CO.createElement(u, {
        paddingBottom: 1,
        flexDirection: "column"
    }, G, v), K[20] = G, K[21] = v, K[22] = V;
    else V = K[22];
    let k;
    if (K[23] !== A || K[24] !== H || K[25] !== W || K[26] !== Y || K[27] !== _ || K[28] !== M || K[29] !== $) k = H === "delete" ? CO.createElement(u, {
        flexDirection: "column",
        paddingLeft: 2
    }, CO.createElement(ey, {
        code: M,
        filePath: _
    })) : H === "insert" ? CO.createElement(u, {
        flexDirection: "column",
        paddingLeft: 2
    }, CO.createElement(ey, {
        code: Y,
        filePath: A === "markdown" ? "file.md" : _
    })) : W ? L16(W.map((R) => CO.createElement(il, {
        key: R.newStart,
        patch: R,
        dim: !1,
        width: $,
        filePath: _,
        firstLine: oY(Y),
        fileContent: M
    })), _5A) : CO.createElement(ey, {
        code: Y,
        filePath: A === "markdown" ? "file.md" : _
    }), K[23] = A, K[24] = H, K[25] = W, K[26] = Y, K[27] = _, K[28] = M, K[29] = $, K[30] = k;
    else k = K[30];
    let N;
    if (K[31] !== V || K[32] !== k) N = CO.createElement(u, {
        flexDirection: "column"
    }, CO.createElement(u, {
        borderStyle: "round",
        flexDirection: "column",
        paddingX: 1
    }, V, k)), K[31] = V, K[32] = k, K[33] = N;
    else N = K[33];
    return N
}
// @from(Ln 522664, Col 0)
function _5A(q) {
    return CO.createElement(PJ, {
        fromLeftEdge: !0,
        key: `ellipsis-${q}`
    }, CO.createElement(T, {
        dimColor: !0
    }, "..."))
}
// @from(Ln 522672, Col 4)
CO
// @from(Ln 522672, Col 8)
Js8
// @from(Ln 522673, Col 4)
OK5 = L(() => {
    o6();
    g6();
    n7();
    Rc();
    Yq();
    mO();
    qQ8();
    MM6();
    fb6();
    CO = K6(P6(), 1), Js8 = K6(P6(), 1)
})
// @from(Ln 522689, Col 0)
function wK5(q) {
    let K = s(52),
        _ = Y5A,
        z, Y, A, O, w, $, j, H, J, X, M, P, W, D, Z, G, f;
    if (K[0] !== q.onDone || K[1] !== q.onReject || K[2] !== q.toolUseConfirm || K[3] !== q.toolUseContext || K[4] !== q.workerBadge) {
        $ = _(q.toolUseConfirm.input);
        let {
            notebook_path: h,
            edit_mode: C,
            cell_type: x
        } = $;
        w = h, O = x === "markdown" ? "markdown" : "python";
        let B = C === "insert" ? "insert this cell into" : C === "delete" ? "delete this cell from" : "make this edit to";
        A = Qn, W = q.toolUseConfirm, D = q.toolUseContext, Z = q.onDone, G = q.onReject, f = q.workerBadge, J = "Edit notebook", Y = T, X = "Do you want to ", M = B, P = " ", z = T, j = !0, H = z5A(w), K[0] = q.onDone, K[1] = q.onReject, K[2] = q.toolUseConfirm, K[3] = q.toolUseContext, K[4] = q.workerBadge, K[5] = z, K[6] = Y, K[7] = A, K[8] = O, K[9] = w, K[10] = $, K[11] = j, K[12] = H, K[13] = J, K[14] = X, K[15] = M, K[16] = P, K[17] = W, K[18] = D, K[19] = Z, K[20] = G, K[21] = f
    } else z = K[5], Y = K[6], A = K[7], O = K[8], w = K[9], $ = K[10], j = K[11], H = K[12], J = K[13], X = K[14], M = K[15], P = K[16], W = K[17], D = K[18], Z = K[19], G = K[20], f = K[21];
    let v;
    if (K[22] !== z || K[23] !== j || K[24] !== H) v = lz8.default.createElement(z, {
        bold: j
    }, H), K[22] = z, K[23] = j, K[24] = H, K[25] = v;
    else v = K[25];
    let V;
    if (K[26] !== Y || K[27] !== v || K[28] !== X || K[29] !== M || K[30] !== P) V = lz8.default.createElement(Y, null, X, M, P, v, "?"), K[26] = Y, K[27] = v, K[28] = X, K[29] = M, K[30] = P, K[31] = V;
    else V = K[31];
    let k = q.verbose ? 120 : 80,
        N;
    if (K[32] !== $.cell_id || K[33] !== $.cell_type || K[34] !== $.edit_mode || K[35] !== $.new_source || K[36] !== $.notebook_path || K[37] !== q.verbose || K[38] !== k) N = lz8.default.createElement(AK5, {
        notebook_path: $.notebook_path,
        cell_id: $.cell_id,
        new_source: $.new_source,
        cell_type: $.cell_type,
        edit_mode: $.edit_mode,
        verbose: q.verbose,
        width: k
    }), K[32] = $.cell_id, K[33] = $.cell_type, K[34] = $.edit_mode, K[35] = $.new_source, K[36] = $.notebook_path, K[37] = q.verbose, K[38] = k, K[39] = N;
    else N = K[39];
    let R;
    if (K[40] !== A || K[41] !== O || K[42] !== w || K[43] !== J || K[44] !== V || K[45] !== N || K[46] !== W || K[47] !== D || K[48] !== Z || K[49] !== G || K[50] !== f) R = lz8.default.createElement(A, {
        toolUseConfirm: W,
        toolUseContext: D,
        onDone: Z,
        onReject: G,
        workerBadge: f,
        title: J,
        question: V,
        content: N,
        path: w,
        completionType: "tool_use_single",
        languageName: O,
        parseInput: _
    }), K[40] = A, K[41] = O, K[42] = w, K[43] = J, K[44] = V, K[45] = N, K[46] = W, K[47] = D, K[48] = Z, K[49] = G, K[50] = f, K[51] = R;
    else R = K[51];
    return R
}
// @from(Ln 522743, Col 0)
function Y5A(q) {
    let K = Ou.inputSchema.safeParse(q);
    if (!K.success) return j6(Error(`Failed to parse notebook edit input: ${K.error.message}`)), {
        notebook_path: "",
        new_source: "",
        cell_id: ""
    };
    return K.data
}
// @from(Ln 522752, Col 4)
lz8
// @from(Ln 522753, Col 4)
$K5 = L(() => {
    o6();
    g6();
    DM6();
    U8();
    $m6();
    OK5();
    lz8 = K6(P6(), 1)
})
// @from(Ln 522763, Col 0)
function jK5(q) {
    for (let {
            pattern: K,
            warning: _
        }
        of A5A)
        if (K.test(q)) return _;
    return null
}
// @from(Ln 522772, Col 4)
A5A
// @from(Ln 522773, Col 4)
HK5 = L(() => {
    A5A = [{
        pattern: /(?:^|[|;&\n({])\s*(Remove-Item|rm|del|rd|rmdir|ri)\b[^|;&\n}]*-Recurse\b[^|;&\n}]*-Force\b/i,
        warning: "Note: may recursively force-remove files"
    }, {
        pattern: /(?:^|[|;&\n({])\s*(Remove-Item|rm|del|rd|rmdir|ri)\b[^|;&\n}]*-Force\b[^|;&\n}]*-Recurse\b/i,
        warning: "Note: may recursively force-remove files"
    }, {
        pattern: /(?:^|[|;&\n({])\s*(Remove-Item|rm|del|rd|rmdir|ri)\b[^|;&\n}]*-Recurse\b/i,
        warning: "Note: may recursively remove files"
    }, {
        pattern: /(?:^|[|;&\n({])\s*(Remove-Item|rm|del|rd|rmdir|ri)\b[^|;&\n}]*-Force\b/i,
        warning: "Note: may force-remove files"
    }, {
        pattern: /\bClear-Content\b[^|;&\n]*\*/i,
        warning: "Note: may clear content of multiple files"
    }, {
        pattern: /\bFormat-Volume\b/i,
        warning: "Note: may format a disk volume"
    }, {
        pattern: /\bClear-Disk\b/i,
        warning: "Note: may clear a disk"
    }, {
        pattern: /\bgit\s+reset\s+--hard\b/i,
        warning: "Note: may discard uncommitted changes"
    }, {
        pattern: /\bgit\s+push\b[^|;&\n]*\s+(--force|--force-with-lease|-f)\b/i,
        warning: "Note: may overwrite remote history"
    }, {
        pattern: /\bgit\s+clean\b(?![^|;&\n]*(?:-[a-zA-Z]*n|--dry-run))[^|;&\n]*-[a-zA-Z]*f/i,
        warning: "Note: may permanently delete untracked files"
    }, {
        pattern: /\bgit\s+stash\s+(drop|clear)\b/i,
        warning: "Note: may permanently remove stashed changes"
    }, {
        pattern: /\b(DROP|TRUNCATE)\s+(TABLE|DATABASE|SCHEMA)\b/i,
        warning: "Note: may drop or truncate database objects"
    }, {
        pattern: /\bStop-Computer\b/i,
        warning: "Note: will shut down the computer"
    }, {
        pattern: /\bRestart-Computer\b/i,
        warning: "Note: will restart the computer"
    }, {
        pattern: /\bClear-RecycleBin\b/i,
        warning: "Note: permanently deletes recycled files"
    }]
})
// @from(Ln 522821, Col 0)
async function JK5(q) {
    if (q.nameType === "application") return null;
    let K = q.name;
    if (!K) return null;
    if (rEK.has(K.toLowerCase())) return null;
    if (q.nameType === "cmdlet") return K;
    if (q.elementTypes?.[0] !== "StringConstant") return null;
    for (let O = 0; O < q.args.length; O++) {
        let w = q.elementTypes[O + 1];
        if (w !== "StringConstant" && w !== "Parameter") return null
    }
    let _ = K.toLowerCase(),
        z = await Am6(_),
        Y = await ea8(K, q.args, z),
        A = 0;
    for (let O of Y.split(" ").slice(1)) {
        if (O.includes("\\")) return null;
        while (A < q.args.length) {
            let w = q.args[A];
            if (w === O) break;
            if (w.startsWith("-")) {
                if (A++, z?.options && A < q.args.length && q.args[A] !== O && !q.args[A].startsWith("-")) {
                    let $ = w.toLowerCase();
                    if (z.options.find((H) => Array.isArray(H.name) ? H.name.includes($) : H.name === $)?.args) A++
                }
                continue
            }
            return null
        }
        if (A >= q.args.length) return null;
        A++
    }
    if (!Y.includes(" ") && (z?.subcommands?.length || xW6[_])) return null;
    return Y
}
// @from(Ln 522856, Col 0)
async function XK5(q, K) {
    let _ = await SI6(q);
    if (!_.valid) return [];
    let z = AW(_).filter((w) => w.elementType === "CommandAst");
    if (z.length <= 1) {
        let w = z[0] ? await JK5(z[0]) : null;
        return w ? [w] : []
    }
    let Y = [];
    for (let w of z) {
        if (K?.(w)) continue;
        let $ = await JK5(w);
        if ($) Y.push($)
    }
    if (Y.length === 0) return [];
    let A = new Map;
    for (let w of Y) {
        let j = w.split(" ")[0].toLowerCase(),
            H = A.get(j);
        if (H) H.push(w);
        else A.set(j, [w])
    }
    let O = [];
    for (let [w, $] of A) {
        let j = O5A($);
        if ((j === "" ? 0 : tz(j, " ") + 1) <= 1) {
            if ((await Am6(w))?.subcommands?.length || xW6[w]) continue
        }
        O.push(j)
    }
    return O
}
// @from(Ln 522889, Col 0)
function O5A(q) {
    if (q.length === 0) return "";
    if (q.length === 1) return q[0];
    let K = q[0].split(" "),
        _ = K.length;
    for (let z = 1; z < q.length; z++) {
        let Y = q[z].split(" "),
            A = 0;
        while (A < _ && A < Y.length && Y[A].toLowerCase() === K[A].toLowerCase()) A++;
        if (_ = A, _ === 0) break
    }
    return K.slice(0, _).join(" ")
}
// @from(Ln 522902, Col 4)
MK5 = L(() => {
    eX7();
    sX7();
    S_7();
    Re()
})
// @from(Ln 522909, Col 0)
function PK5({
    suggestions: q = [],
    onRejectFeedbackChange: K,
    onAcceptFeedbackChange: _,
    yesInputMode: z = !1,
    noInputMode: Y = !1,
    editablePrefix: A,
    onEditablePrefixChange: O
}) {
    let w = [];
    if (z) w.push({
        type: "input",
        label: "Yes",
        value: "yes",
        placeholder: "and tell Claude what to do next",
        onChange: _,
        allowEmptySubmitToCancel: !0
    });
    else w.push({
        label: "Yes",
        value: "yes"
    });
    if (xI() && q.length > 0) {
        let $ = q.some((j) => j.type === "addDirectories" || j.type === "addRules" && j.rules?.some((H) => H.toolName !== I5));
        if (A !== void 0 && O && !$) w.push({
            type: "input",
            label: "Yes, and don’t ask again for",
            value: "yes-prefix-edited",
            placeholder: "command prefix (e.g., Get-Process *)",
            initialValue: A,
            onChange: O,
            allowEmptySubmitToCancel: !0,
            showLabelWithValue: !0,
            labelValueSeparator: ": ",
            resetCursorOnUpdate: !0
        });
        else {
            let j = ws8(q, I5);
            if (j) w.push({
                label: j,
                value: "yes-apply-suggestions"
            })
        }
    }
    if (Y) w.push({
        type: "input",
        label: "No",
        value: "no",
        placeholder: "and tell Claude what to do differently",
        onChange: K,
        allowEmptySubmitToCancel: !0
    });
    else w.push({
        label: "No",
        value: "no"
    });
    return w
}
// @from(Ln 522967, Col 4)
WK5 = L(() => {
    uI();
    jM7()
})
// @from(Ln 522972, Col 0)
function DK5(q) {
    let {
        toolUseConfirm: K,
        toolUseContext: _,
        onDone: z,
        onReject: Y,
        workerBadge: A
    } = q, {
        command: O,
        description: w
    } = KP6.inputSchema.parse(K.input), [$] = Zq(), j = zs8({
        toolName: K.tool.name,
        toolInput: K.input,
        toolDescription: K.description,
        messages: _.messages
    }), {
        yesInputMode: H,
        noInputMode: J,
        yesFeedbackModeEntered: X,
        noFeedbackModeEntered: M,
        acceptFeedback: P,
        rejectFeedback: W,
        setAcceptFeedback: D,
        setRejectFeedback: Z,
        focusedOption: G,
        handleInputModeToggle: f,
        handleReject: v,
        handleFocus: V
    } = Os8({
        toolUseConfirm: K,
        onDone: z,
        onReject: Y,
        explainerVisible: j.visible
    }), k = u8("tengu_destructive_command_warning", !1) ? jK5(O) : null, [N, R] = m_.useState(!1), [h, C] = m_.useState(O.includes(`
`) ? void 0 : O), x = m_.useRef(!1);
    m_.useEffect(() => {
        let g = !1;
        return XK5(O, (c) => tM6(c, c.text)).then((c) => {
            if (g || x.current) return;
            if (c.length > 0) C(`${c[0]} *`)
        }).catch(() => {}), () => {
            g = !0
        }
    }, [O]);
    let B = m_.useCallback((g) => {
            x.current = !0, C(g)
        }, []),
        m = m_.useMemo(() => ({
            completion_type: "tool_use_single",
            language_name: "none"
        }), []);
    TL(K, m);
    let S = m_.useMemo(() => PK5({
            suggestions: K.permissionResult.behavior === "ask" ? K.permissionResult.suggestions : void 0,
            onRejectFeedbackChange: Z,
            onAcceptFeedbackChange: D,
            yesInputMode: H,
            noInputMode: J,
            editablePrefix: h,
            onEditablePrefixChange: B
        }), [K, H, J, h, B]),
        F = m_.useCallback(() => {
            R((g) => !g)
        }, []);
    G1("permission:toggleDebug", F, {
        context: "Confirmation"
    });

    function U(g) {
        d("tengu_permission_request_option_selected", {
            option_index: {
                yes: 1,
                "yes-apply-suggestions": 2,
                "yes-prefix-edited": 2,
                no: 3
            } [g],
            explainer_visible: j.visible
        });
        let n = PK(K.tool.name);
        if (g === "yes-prefix-edited") {
            let l = (h ?? "").trim();
            if (y0("tool_use_single", K, "accept"), !l) K.onAllow(K.input, []);
            else {
                let z6 = [{
                    type: "addRules",
                    rules: [{
                        toolName: KP6.name,
                        ruleContent: l
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }];
                K.onAllow(K.input, z6)
            }
            z();
            return
        }
        switch (g) {
            case "yes": {
                let l = P.trim();
                y0("tool_use_single", K, "accept"), d("tengu_accept_submitted", {
                    toolName: n,
                    isMcp: K.tool.isMcp ?? !1,
                    has_instructions: !!l,
                    instructions_length: l.length,
                    entered_feedback_mode: X
                }), K.onAllow(K.input, [], l || void 0), z();
                break
            }
            case "yes-apply-suggestions": {
                y0("tool_use_single", K, "accept");
                let l = "suggestions" in K.permissionResult ? K.permissionResult.suggestions || [] : [];
                K.onAllow(K.input, l), z();
                break
            }
            case "no": {
                let l = W.trim();
                d("tengu_reject_submitted", {
                    toolName: n,
                    isMcp: K.tool.isMcp ?? !1,
                    has_instructions: !!l,
                    instructions_length: l.length,
                    entered_feedback_mode: M
                }), v(l || void 0);
                break
            }
        }
    }
    return m_.default.createElement(IY, {
        workerBadge: A,
        title: "PowerShell command"
    }, m_.default.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, m_.default.createElement(T, {
        dimColor: j.visible
    }, KP6.renderToolUseMessage({
        command: O,
        description: w
    }, {
        theme: $,
        verbose: !0
    })), !j.visible && m_.default.createElement(T, {
        dimColor: !0
    }, K.description), m_.default.createElement(Ys8, {
        visible: j.visible,
        promise: j.promise
    })), N ? m_.default.createElement(m_.default.Fragment, null, m_.default.createElement(_s8, {
        permissionResult: K.permissionResult,
        toolName: "PowerShell"
    }), _.options.debug && m_.default.createElement(u, {
        justifyContent: "flex-end",
        marginTop: 1
    }, m_.default.createElement(T, {
        dimColor: !0
    }, m_.default.createElement(A8, {
        chord: "ctrl+d",
        action: "hide debug info",
        format: {
            modCase: "title",
            charCase: "upper",
            modSep: "-"
        }
    })))) : m_.default.createElement(m_.default.Fragment, null, m_.default.createElement(u, {
        flexDirection: "column"
    }, m_.default.createElement(iT, {
        permissionResult: K.permissionResult,
        toolType: "command"
    }), k && m_.default.createElement(u, {
        marginBottom: 1
    }, m_.default.createElement(T, {
        color: "warning"
    }, k)), m_.default.createElement(T, null, "Do you want to proceed?"), m_.default.createElement(A1, {
        options: S,
        inlineDescriptions: !0,
        onChange: U,
        onCancel: () => v(),
        onFocus: V,
        onInputModeToggle: f
    })), m_.default.createElement(u, {
        justifyContent: "space-between",
        marginTop: 1
    }, m_.default.createElement(T, {
        dimColor: !0
    }, m_.default.createElement(z1, null, m_.default.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }), (G === "yes" && !H || G === "no" && !J) && m_.default.createElement(A8, {
        chord: "tab",
        action: "amend"
    }), j.enabled && m_.default.createElement(A8, {
        chord: "ctrl+e",
        action: j.visible ? "hide" : "explain"
    }))), _.options.debug && m_.default.createElement(T, {
        dimColor: !0
    }, m_.default.createElement(A8, {
        chord: "ctrl+d",
        action: "show debug info",
        format: {
            modCase: "title"
        }
    })))))
}
// @from(Ln 523176, Col 4)
m_
// @from(Ln 523177, Col 4)
ZK5 = L(() => {
    g6();
    C7();
    B1();
    C8();
    q2();
    HK5();
    PI6();
    bI6();
    MK5();
    gK();
    Nq();
    u7();
    fz6();
    qM7();
    pD();
    _M7();
    V66();
    OM7();
    jm6();
    WK5();
    m_ = K6(P6(), 1)
})
// @from(Ln 523201, Col 0)
function fK5(q) {
    let K = s(51),
        {
            toolUseConfirm: _,
            onDone: z,
            onReject: Y,
            workerBadge: A
        } = q,
        O = w5A,
        w;
    if (K[0] !== _.input) w = O(_.input), K[0] = _.input, K[1] = w;
    else w = K[1];
    let $ = w,
        j = _.permissionResult.behavior === "ask" && _.permissionResult.metadata && "command" in _.permissionResult.metadata ? _.permissionResult.metadata.command : void 0,
        H;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) H = {
        completion_type: "tool_use_single",
        language_name: "none"
    }, K[2] = H;
    else H = K[2];
    TL(_, H);
    let X;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) X = Y7(), K[3] = X;
    else X = K[3];
    let M = X,
        P;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) P = xI(), K[4] = P;
    else P = K[4];
    let W = P,
        D;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) D = [{
        label: "Yes",
        value: "yes",
        feedbackConfig: {
            type: "accept"
        }
    }], K[5] = D;
    else D = K[5];
    let Z = D,
        G;
    if (K[6] !== $) {
        if (G = [], W) {
            let e = kL.default.createElement(T, {
                    bold: !0
                }, $),
                i;
            if (K[8] === Symbol.for("react.memo_cache_sentinel")) i = kL.default.createElement(T, {
                bold: !0
            }, M), K[8] = i;
            else i = K[8];
            let O6;
            if (K[9] !== e) O6 = {
                label: kL.default.createElement(T, null, "Yes, and don't ask again for ", e, " in", " ", i),
                value: "yes-exact"
            }, K[9] = e, K[10] = O6;
            else O6 = K[10];
            G.push(O6);
            let J6 = $.indexOf(" ");
            if (J6 > 0) {
                let H6 = $.substring(0, J6) + ":*",
                    q6;
                if (K[11] !== H6) q6 = kL.default.createElement(T, {
                    bold: !0
                }, H6), K[11] = H6, K[12] = q6;
                else q6 = K[12];
                let o;
                if (K[13] === Symbol.for("react.memo_cache_sentinel")) o = kL.default.createElement(T, {
                    bold: !0
                }, M), K[13] = o;
                else o = K[13];
                let _6;
                if (K[14] !== q6) _6 = {
                    label: kL.default.createElement(T, null, "Yes, and don't ask again for", " ", q6, " commands in", " ", o),
                    value: "yes-prefix"
                }, K[14] = q6, K[15] = _6;
                else _6 = K[15];
                G.push(_6)
            }
        }
        K[6] = $, K[7] = G
    } else G = K[7];
    let f;
    if (K[16] === Symbol.for("react.memo_cache_sentinel")) f = {
        label: "No",
        value: "no",
        feedbackConfig: {
            type: "reject"
        }
    }, K[16] = f;
    else f = K[16];
    let v = f,
        V;
    if (K[17] !== G) V = [...Z, ...G, v], K[17] = G, K[18] = V;
    else V = K[18];
    let k = V,
        N;
    if (K[19] !== _.tool.name) N = PK(_.tool.name), K[19] = _.tool.name, K[20] = N;
    else N = K[20];
    let R = _.tool.isMcp ?? !1,
        h;
    if (K[21] !== N || K[22] !== R) h = {
        toolName: N,
        isMcp: R
    }, K[21] = N, K[22] = R, K[23] = h;
    else h = K[23];
    let C = h,
        x;
    if (K[24] !== z || K[25] !== Y || K[26] !== $ || K[27] !== _) x = (e, i) => {
        q: switch (e) {
            case "yes": {
                bG({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: _.assistantMessage.message.id,
                        platform: X7.platform
                    }
                }), _.onAllow(_.input, [], i), z();
                break q
            }
            case "yes-exact": {
                bG({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: _.assistantMessage.message.id,
                        platform: X7.platform
                    }
                }), _.onAllow(_.input, [{
                    type: "addRules",
                    rules: [{
                        toolName: VH,
                        ruleContent: $
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }]), z();
                break q
            }
            case "yes-prefix": {
                bG({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: _.assistantMessage.message.id,
                        platform: X7.platform
                    }
                });
                let O6 = $.indexOf(" "),
                    J6 = O6 > 0 ? $.substring(0, O6) : $;
                _.onAllow(_.input, [{
                    type: "addRules",
                    rules: [{
                        toolName: VH,
                        ruleContent: `${J6}:*`
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }]), z();
                break q
            }
            case "no":
                bG({
                    completion_type: "tool_use_single",
                    event: "reject",
                    metadata: {
                        language_name: "none",
                        message_id: _.assistantMessage.message.id,
                        platform: X7.platform
                    }
                }), _.onReject(i), Y(), z()
        }
    }, K[24] = z, K[25] = Y, K[26] = $, K[27] = _, K[28] = x;
    else x = K[28];
    let B = x,
        m;
    if (K[29] !== z || K[30] !== Y || K[31] !== _) m = () => {
        bG({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
                language_name: "none",
                message_id: _.assistantMessage.message.id,
                platform: X7.platform
            }
        }), _.onReject(), Y(), z()
    }, K[29] = z, K[30] = Y, K[31] = _, K[32] = m;
    else m = K[32];
    let S = m,
        F = `Use skill "${$}"?`,
        U;
    if (K[33] === Symbol.for("react.memo_cache_sentinel")) U = kL.default.createElement(T, null, "Claude may use instructions, code, or files from this Skill."), K[33] = U;
    else U = K[33];
    let g = j?.description,
        c;
    if (K[34] !== g) c = kL.default.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, kL.default.createElement(T, {
        dimColor: !0
    }, g)), K[34] = g, K[35] = c;
    else c = K[35];
    let n;
    if (K[36] !== _.permissionResult) n = kL.default.createElement(iT, {
        permissionResult: _.permissionResult,
        toolType: "tool"
    }), K[36] = _.permissionResult, K[37] = n;
    else n = K[37];
    let l;
    if (K[38] !== S || K[39] !== B || K[40] !== k || K[41] !== C) l = kL.default.createElement(Jm6, {
        options: k,
        onSelect: B,
        onCancel: S,
        toolAnalyticsContext: C
    }), K[38] = S, K[39] = B, K[40] = k, K[41] = C, K[42] = l;
    else l = K[42];
    let z6;
    if (K[43] !== n || K[44] !== l) z6 = kL.default.createElement(u, {
        flexDirection: "column"
    }, n, l), K[43] = n, K[44] = l, K[45] = z6;
    else z6 = K[45];
    let A6;
    if (K[46] !== F || K[47] !== c || K[48] !== z6 || K[49] !== A) A6 = kL.default.createElement(IY, {
        title: F,
        workerBadge: A
    }, U, c, z6), K[46] = F, K[47] = c, K[48] = z6, K[49] = A, K[50] = A6;
    else A6 = K[50];
    return A6
}
// @from(Ln 523435, Col 0)
function w5A(q) {
    let K = m96.inputSchema.safeParse(q);
    if (!K.success) return j6(Error(`Failed to parse skill tool input: ${K.error.message}`)), "";
    return K.data.skill
}
// @from(Ln 523440, Col 4)
kL
// @from(Ln 523441, Col 4)
GK5 = L(() => {
    o6();
    U8();
    y8();
    g6();
    q2();
    XU8();
    D_();
    uI();
    Om6();
    fz6();
    pD();
    js8();
    V66();
    kL = K6(P6(), 1)
})
// @from(Ln 523458, Col 0)
function $5A(q) {
    try {
        let K = _Z.inputSchema.safeParse(q);
        if (!K.success) return `input:${q.toString()}`;
        let {
            url: _
        } = K.data;
        return `domain:${new URL(_).hostname}`
    } catch {
        return `input:${q.toString()}`
    }
}
// @from(Ln 523471, Col 0)
function vK5(q) {
    let K = s(41),
        {
            toolUseConfirm: _,
            onDone: z,
            onReject: Y,
            verbose: A,
            workerBadge: O
        } = q,
        [w] = Zq(),
        {
            url: $
        } = _.input,
        j;
    if (K[0] !== $) j = new URL($), K[0] = $, K[1] = j;
    else j = K[1];
    let H = j.hostname,
        J;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) J = {
        completion_type: "tool_use_single",
        language_name: "none"
    }, K[2] = J;
    else J = K[2];
    TL(_, J);
    let M;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) M = xI(), K[3] = M;
    else M = K[3];
    let P = M,
        W;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) W = {
        label: "Yes",
        value: "yes"
    }, K[4] = W;
    else W = K[4];
    let D;
    if (K[5] !== H) {
        if (D = [W], P) {
            let F = iS.default.createElement(T, {
                    bold: !0
                }, H),
                U;
            if (K[7] !== F) U = {
                label: iS.default.createElement(T, null, "Yes, and don't ask again for ", F),
                value: "yes-dont-ask-again-domain"
            }, K[7] = F, K[8] = U;
            else U = K[8];
            D.push(U)
        }
        let S;
        if (K[9] === Symbol.for("react.memo_cache_sentinel")) S = {
            label: iS.default.createElement(T, null, "No, and tell Claude what to do differently ", iS.default.createElement(T, {
                bold: !0
            }, "(esc)")),
            value: "no"
        }, K[9] = S;
        else S = K[9];
        D.push(S), K[5] = H, K[6] = D
    } else D = K[6];
    let Z = D,
        G;
    if (K[10] !== z || K[11] !== Y || K[12] !== _) G = function(F) {
        q: switch (F) {
            case "yes": {
                y0("tool_use_single", _, "accept"), _.onAllow(_.input, []), z();
                break q
            }
            case "yes-dont-ask-again-domain": {
                y0("tool_use_single", _, "accept");
                let U = $5A(_.input),
                    g = {
                        toolName: _.tool.name,
                        ruleContent: U
                    };
                _.onAllow(_.input, [{
                    type: "addRules",
                    rules: [g],
                    behavior: "allow",
                    destination: "localSettings"
                }]), z();
                break q
            }
            case "no":
                y0("tool_use_single", _, "reject"), _.onReject(), Y(), z()
        }
    }, K[10] = z, K[11] = Y, K[12] = _, K[13] = G;
    else G = K[13];
    let f = G,
        v;
    if (K[14] !== w || K[15] !== _.input || K[16] !== A) v = _Z.renderToolUseMessage(_.input, {
        theme: w,
        verbose: A
    }), K[14] = w, K[15] = _.input, K[16] = A, K[17] = v;
    else v = K[17];
    let V;
    if (K[18] !== v) V = iS.default.createElement(T, null, v), K[18] = v, K[19] = V;
    else V = K[19];
    let k;
    if (K[20] !== _.description) k = iS.default.createElement(T, {
        dimColor: !0
    }, _.description), K[20] = _.description, K[21] = k;
    else k = K[21];
    let N;
    if (K[22] !== V || K[23] !== k) N = iS.default.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, V, k), K[22] = V, K[23] = k, K[24] = N;
    else N = K[24];
    let R;
    if (K[25] !== _.permissionResult) R = iS.default.createElement(iT, {
        permissionResult: _.permissionResult,
        toolType: "tool"
    }), K[25] = _.permissionResult, K[26] = R;
    else R = K[26];
    let h;
    if (K[27] === Symbol.for("react.memo_cache_sentinel")) h = iS.default.createElement(T, null, "Do you want to allow Claude to fetch this content?"), K[27] = h;
    else h = K[27];
    let C;
    if (K[28] !== f) C = () => f("no"), K[28] = f, K[29] = C;
    else C = K[29];
    let x;
    if (K[30] !== f || K[31] !== Z || K[32] !== C) x = iS.default.createElement(A1, {
        options: Z,
        onChange: f,
        onCancel: C
    }), K[30] = f, K[31] = Z, K[32] = C, K[33] = x;
    else x = K[33];
    let B;
    if (K[34] !== R || K[35] !== x) B = iS.default.createElement(u, {
        flexDirection: "column"
    }, R, h, x), K[34] = R, K[35] = x, K[36] = B;
    else B = K[36];
    let m;
    if (K[37] !== B || K[38] !== N || K[39] !== O) m = iS.default.createElement(IY, {
        title: "Fetch",
        workerBadge: O
    }, N, B), K[37] = B, K[38] = N, K[39] = O, K[40] = m;
    else m = K[40];
    return m
}
// @from(Ln 523611, Col 4)
iS
// @from(Ln 523612, Col 4)
TK5 = L(() => {
    o6();
    g6();
    ib6();
    uI();
    gK();
    fz6();
    pD();
    V66();
    jm6();
    iS = K6(P6(), 1)
})
// @from(Ln 523624, Col 4)
VK5 = {}
// @from(Ln 523629, Col 0)
function j5A(q) {
    let K = s(42),
        {
            toolUseConfirm: _,
            onDone: z,
            onReject: Y,
            workerBadge: A
        } = q,
        O;
    if (K[0] !== _.input) O = g37.inputSchema.safeParse(_.input), K[0] = _.input, K[1] = O;
    else O = K[1];
    let w = O,
        $ = w.success ? w.data : void 0,
        j = $ && "mcp" in $ ? $.mcp : void 0,
        H;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) H = {
        completion_type: "tool_use_single",
        language_name: "none"
    }, K[2] = H;
    else H = K[2];
    TL(_, H);
    let X;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) X = xI(), K[3] = X;
    else X = K[3];
    let M = X,
        P;
    if (K[4] !== _.permissionResult) P = "suggestions" in _.permissionResult ? _.permissionResult.suggestions ?? [] : [], K[4] = _.permissionResult, K[5] = P;
    else P = K[5];
    let W = P,
        D;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) D = {
        label: "Yes",
        value: "yes",
        feedbackConfig: {
            type: "accept"
        }
    }, K[6] = D;
    else D = K[6];
    let Z;
    if (K[7] !== W) {
        if (Z = [D], M && W.length > 0) {
            let g = H5A(W),
                c;
            if (K[9] !== g) c = {
                label: g,
                value: "yes-apply-suggestions"
            }, K[9] = g, K[10] = c;
            else c = K[10];
            Z.push(c)
        }
        let U;
        if (K[11] === Symbol.for("react.memo_cache_sentinel")) U = {
            label: "No",
            value: "no",
            feedbackConfig: {
                type: "reject"
            }
        }, K[11] = U;
        else U = K[11];
        Z.push(U), K[7] = W, K[8] = Z
    } else Z = K[8];
    let G = Z,
        f;
    if (K[12] !== z || K[13] !== Y || K[14] !== _) f = (U, g) => {
        q: switch (U) {
            case "yes": {
                y0("tool_use_single", _, "accept"), _.onAllow(_.input, [], g), z();
                break q
            }
            case "yes-apply-suggestions": {
                y0("tool_use_single", _, "accept");
                let c = "suggestions" in _.permissionResult ? _.permissionResult.suggestions ?? [] : [];
                _.onAllow(_.input, c), z();
                break q
            }
            case "no":
                y0("tool_use_single", _, "reject"), _.onReject(g), Y(), z()
        }
    }, K[12] = z, K[13] = Y, K[14] = _, K[15] = f;
    else f = K[15];
    let v = f,
        V;
    if (K[16] !== z || K[17] !== Y || K[18] !== _) V = () => {
        y0("tool_use_single", _, "reject"), _.onReject(), Y(), z()
    }, K[16] = z, K[17] = Y, K[18] = _, K[19] = V;
    else V = K[19];
    let k = V,
        N;
    if (K[20] !== $ || K[21] !== j) N = j ? Bu.default.createElement(T, null, "Poll", " ", Bu.default.createElement(T, {
        bold: !0
    }, j.server, "/", j.tool), " ", "every", " ", ($ && "interval_ms" in $ ? $.interval_ms : 30000) / 1000, "s") : Bu.default.createElement(T, null, $?.command), K[20] = $, K[21] = j, K[22] = N;
    else N = K[22];
    let R = $?.description,
        h;
    if (K[23] !== R) h = Bu.default.createElement(T, {
        dimColor: !0
    }, R), K[23] = R, K[24] = h;
    else h = K[24];
    let C;
    if (K[25] !== h || K[26] !== N) C = Bu.default.createElement(u, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, N, h), K[25] = h, K[26] = N, K[27] = C;
    else C = K[27];
    let x = j ? "tool" : "command",
        B;
    if (K[28] !== x || K[29] !== _.permissionResult) B = Bu.default.createElement(iT, {
        permissionResult: _.permissionResult,
        toolType: x
    }), K[28] = x, K[29] = _.permissionResult, K[30] = B;
    else B = K[30];
    let m;
    if (K[31] !== k || K[32] !== v || K[33] !== G) m = Bu.default.createElement(Jm6, {
        options: G,
        onSelect: v,
        onCancel: k
    }), K[31] = k, K[32] = v, K[33] = G, K[34] = m;
    else m = K[34];
    let S;
    if (K[35] !== B || K[36] !== m) S = Bu.default.createElement(u, {
        flexDirection: "column"
    }, B, m), K[35] = B, K[36] = m, K[37] = S;
    else S = K[37];
    let F;
    if (K[38] !== C || K[39] !== S || K[40] !== A) F = Bu.default.createElement(IY, {
        title: _0,
        workerBadge: A
    }, C, S), K[38] = C, K[39] = S, K[40] = A, K[41] = F;
    else F = K[41];
    return F
}
// @from(Ln 523762, Col 0)
function H5A(q) {
    let K = q.filter((_) => _.type === "addRules").flatMap((_) => _.rules ?? []);
    if (K.length === 1 && K[0].ruleContent) {
        let _ = K[0];
        return Bu.default.createElement(T, null, "Yes, and don't ask again for", " ", Bu.default.createElement(T, {
            bold: !0
        }, _.toolName, "(", _.ruleContent, ")"))
    }
    return `Yes, and add ${K.length} suggested permission rules`
}
// @from(Ln 523772, Col 4)
Bu
// @from(Ln 523773, Col 4)
kK5 = L(() => {
    o6();
    g6();
    md8();
    zt();
    uI();
    fz6();
    pD();
    js8();
    V66();
    jm6();
    Bu = K6(P6(), 1)
})
// @from(Ln 523787, Col 0)
function Z5A(q) {
    switch (q) {
        case mM:
            return s45;
        case hX:
            return zK5;
        case KK:
            return n45;
        case KP6:
            return DK5;
        case J5A:
            return X5A ?? mW6;
        case _Z:
            return vK5;
        case Ou:
            return wK5;
        case zZ:
            return a45;
        case o58:
            return r45;
        case m96:
            return fK5;
        case KI6:
            return K45;
        case M5A:
            return P5A ?? mW6;
        case W5A:
            return D5A ?? mW6;
        case Au:
        case _N:
        case Kz:
            return e45;
        default:
            return mW6
    }
}
// @from(Ln 523824, Col 0)
function f5A(q) {
    let K = q.tool.userFacingName(q.input);
    if (q.tool === zZ) return "Claude Code needs your approval for the plan";
    if (q.tool === o58) return "Claude Code wants to enter plan mode";
    if (!K || K.trim() === "") return "Claude Code needs your attention";
    return `Claude needs your permission to use ${K}`
}