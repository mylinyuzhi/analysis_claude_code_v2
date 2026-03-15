
// @from(Ln 488077, Col 0)
async function y0z(A, q, K) {
    let Y = E0z(q, K),
        z = A.toLowerCase(),
        _ = Y ? `${z} ${Y.toLowerCase()}` : z;
    if (TI1[_]) return TI1[_];
    if (TI1[z]) return TI1[z];
    if (!K) return 2;
    if (K.options && q.some((w) => w?.startsWith("-")))
        for (let w of q) {
            if (!w?.startsWith("-")) continue;
            let O = K.options.find(($) => Array.isArray($.name) ? $.name.includes(w) : $.name === w);
            if (O?.args && VV6(O.args).some(($) => $?.isCommand || $?.isModule)) return 3
        }
    if (Y && K.subcommands?.length) {
        let w = Y.toLowerCase(),
            O = K.subcommands.find(($) => Array.isArray($.name) ? $.name.some((H) => H.toLowerCase() === w) : $.name.toLowerCase() === w);
        if (O) {
            if (O.args) {
                let $ = VV6(O.args);
                if ($.some((H) => H?.isCommand)) return 3;
                if ($.some((H) => H?.isVariadic)) return 2
            }
            if (O.subcommands?.length) return 4;
            return 3
        }
    }
    if (K.args) {
        let w = VV6(K.args);
        if (w.some((O) => O?.isCommand)) return !Array.isArray(K.args) && K.args.isCommand ? 2 : Math.min(2 + w.findIndex((O) => O?.isCommand), 3);
        if (!K.subcommands?.length) {
            if (w.some((O) => O?.isVariadic)) return 1;
            if (w[0] && !w[0].isOptional) return 2
        }
    }
    return K.args && VV6(K.args).some((w) => w?.isDangerous) ? 3 : 2
}
// @from(Ln 488113, Col 0)
async function L0z(A, q, K) {
    if (A.startsWith("-")) return !0;
    let Y = A.lastIndexOf("."),
        z = Y > 0 && Y < A.length - 1 && !A.substring(Y + 1).includes(":"),
        _ = A.includes("/") || z,
        w = k0z.some((O) => A.startsWith(O));
    if (!_ && !w) return !1;
    if (K?.options && q.length > 0 && q[q.length - 1] === "-m") {
        let O = K.options.find(($) => Array.isArray($.name) ? $.name.includes("-m") : $.name === "-m");
        if (O?.args && VV6(O.args).some(($) => $?.isModule)) return !1
    }
    return !0
}
// @from(Ln 488126, Col 4)
k0z
// @from(Ln 488126, Col 9)
TI1
// @from(Ln 488126, Col 14)
VV6 = (A) => Array.isArray(A) ? A : [A]
// @from(Ln 488127, Col 4)
ECq = E(() => {
    k0z = ["http://", "https://", "ftp://"], TI1 = {
        rg: 2,
        "pre-commit": 2,
        gcloud: 4,
        "gcloud compute": 6,
        "gcloud beta": 6,
        aws: 4,
        az: 4,
        kubectl: 3,
        docker: 3,
        dotnet: 3,
        "git push": 2
    }
})
// @from(Ln 488143, Col 0)
function S0z(A, q) {
    if (!q?.subcommands?.length) return !1;
    return q.subcommands.some((K) => Array.isArray(K.name) ? K.name.includes(A) : K.name === A)
}
// @from(Ln 488147, Col 0)
async function vI1(A, q = 0, K = 0) {
    if (K > 2 || q > 10) return null;
    let Y = await FV8(A);
    if (!Y) return null;
    if (!Y.commandNode) return {
        commandPrefix: null
    };
    let {
        envVars: z,
        commandNode: _
    } = Y, w = QV8(_), [O, ...$] = w;
    if (!O) return {
        commandPrefix: null
    };
    let H = await ms8(O),
        j = h0z.has(O) || H?.args && LCq(H.args).some((D) => D?.isCommand);
    if (j && $[0] && S0z($[0], H)) j = !1;
    let J = j ? await C0z(O, $, q, K) : await kCq(O, $, H);
    if (J === null && q === 0 && j) return null;
    let M = z.length ? `${z.join(" ")} ` : "";
    return {
        commandPrefix: J ? M + J : null
    }
}
// @from(Ln 488171, Col 0)
async function C0z(A, q, K, Y) {
    let z = await ms8(A);
    if (z?.args) {
        let O = LCq(z.args).findIndex(($) => $?.isCommand);
        if (O !== -1) {
            let $ = [A];
            for (let H = 0; H < q.length && H <= O; H++)
                if (H === O) {
                    let j = await vI1(q.slice(H).join(" "), K + 1, Y + 1);
                    if (j?.commandPrefix) return $.push(...j.commandPrefix.split(" ")), $.join(" ");
                    break
                } else if (q[H] && !q[H].startsWith("-") && !yCq.test(q[H])) $.push(q[H])
        }
    }
    let _ = q.find((O) => !O.startsWith("-") && !R0z.test(O) && !yCq.test(O));
    if (!_) return A;
    let w = await vI1(q.slice(q.indexOf(_)).join(" "), K + 1, Y + 1);
    return !w?.commandPrefix ? null : `${A} ${w.commandPrefix}`
}
// @from(Ln 488190, Col 0)
async function RCq(A, q) {
    let K = EO(A);
    if (K.length <= 1) {
        let w = await vI1(A);
        return w?.commandPrefix ? [w.commandPrefix] : []
    }
    let Y = [];
    for (let w of K) {
        let O = w.trim();
        if (q?.(O)) continue;
        let $ = await vI1(O);
        if ($?.commandPrefix) Y.push($.commandPrefix)
    }
    if (Y.length === 0) return [];
    let z = new Map;
    for (let w of Y) {
        let O = w.split(" ")[0],
            $ = z.get(O);
        if ($) $.push(w);
        else z.set(O, [w])
    }
    let _ = [];
    for (let [, w] of z) _.push(I0z(w));
    return _
}
// @from(Ln 488216, Col 0)
function I0z(A) {
    if (A.length === 0) return "";
    if (A.length === 1) return A[0];
    let K = A[0].split(" "),
        Y = K.length;
    for (let z = 1; z < A.length; z++) {
        let _ = A[z].split(" "),
            w = 0;
        while (w < Y && w < _.length && K[w] === _[w]) w++;
        Y = w
    }
    return K.slice(0, Math.max(1, Y)).join(" ")
}
// @from(Ln 488229, Col 4)
R0z
// @from(Ln 488229, Col 9)
yCq
// @from(Ln 488229, Col 14)
h0z
// @from(Ln 488229, Col 19)
LCq = (A) => Array.isArray(A) ? A : [A]
// @from(Ln 488230, Col 4)
hCq = E(() => {
    Lp6();
    NCq();
    jZ();
    ECq();
    R0z = /^\d+$/, yCq = /^[A-Za-z_][A-Za-z0-9_]*=/, h0z = new Set(["nice"])
})
// @from(Ln 488238, Col 0)
function SCq(A) {
    let q = A6(21),
        {
            toolUseConfirm: K,
            toolUseContext: Y,
            onDone: z,
            onReject: _,
            verbose: w,
            workerBadge: O
        } = A,
        $, H, j;
    if (q[0] !== K.input)({
        command: $,
        description: H
    } = J4.inputSchema.parse(K.input)), j = yf6($), q[0] = K.input, q[1] = $, q[2] = H, q[3] = j;
    else $ = q[1], H = q[2], j = q[3];
    let J = j;
    if (J) {
        let D;
        if (q[4] !== z || q[5] !== _ || q[6] !== J || q[7] !== K || q[8] !== Y || q[9] !== w || q[10] !== O) D = N$.default.createElement(sSq, {
            toolUseConfirm: K,
            toolUseContext: Y,
            onDone: z,
            onReject: _,
            verbose: w,
            workerBadge: O,
            sedInfo: J
        }), q[4] = z, q[5] = _, q[6] = J, q[7] = K, q[8] = Y, q[9] = w, q[10] = O, q[11] = D;
        else D = q[11];
        return D
    }
    let M;
    if (q[12] !== $ || q[13] !== H || q[14] !== z || q[15] !== _ || q[16] !== K || q[17] !== Y || q[18] !== w || q[19] !== O) M = N$.default.createElement(b0z, {
        toolUseConfirm: K,
        toolUseContext: Y,
        onDone: z,
        onReject: _,
        verbose: w,
        workerBadge: O,
        command: $,
        description: H
    }), q[12] = $, q[13] = H, q[14] = z, q[15] = _, q[16] = K, q[17] = Y, q[18] = w, q[19] = O, q[20] = M;
    else M = q[20];
    return M
}
// @from(Ln 488284, Col 0)
function b0z({
    toolUseConfirm: A,
    toolUseContext: q,
    onDone: K,
    onReject: Y,
    verbose: z,
    workerBadge: _,
    command: w,
    description: O
}) {
    let [$] = z7(), H = M1((l) => l.toolPermissionContext), j = xA(), J = KCq({
        toolName: A.tool.name,
        toolInput: A.input,
        toolDescription: A.description,
        messages: q.messages
    }), [M, D] = Xw.useState(!1), [X, P] = Xw.useState(""), [W, Z] = Xw.useState(""), [G, f] = Xw.useState(O || ""), [v, N] = Xw.useState(!O?.trim());
    Xw.useEffect(() => {
        if (!T66()) return;
        let l = new AbortController;
        return kl4(w, O, l.signal).then((q6) => {
            if (q6 && !l.signal.aborted) f(q6), N(!1)
        }).catch(() => {}), () => l.abort()
    }, [w, O]);
    let [V, L] = Xw.useState(() => {
        let l = eh1(w);
        if (l) return `${l}:*`;
        let q6 = Cfq(w);
        if (q6) return `${q6}:*`;
        return w
    }), h = Xw.useRef(!1), R = Xw.useCallback((l) => {
        h.current = !0, L(l)
    }, []);
    Xw.useEffect(() => {
        let l = !1;
        return RCq(w, (q6) => J4.isReadOnly({
            command: q6
        })).then((q6) => {
            if (l || h.current) return;
            if (q6.length > 0) L(`${q6[0]}:*`)
        }).catch(() => {}), () => {
            l = !0
        }
    }, [w]);
    let [u, I] = Xw.useState(!1), [g, B] = Xw.useState(!1), [b, p] = Xw.useState("yes"), [Q, U] = Xw.useState(!1), [r, e] = Xw.useState(!1), [Y6] = Xw.useState(!1), {
        destructiveWarning: H6,
        sandboxingEnabled: J6,
        isSandboxed: K6
    } = Xw.useMemo(() => {
        let l = w8("tengu_destructive_command_warning", !1) ? _Cq(w) : null,
            q6 = vA.isSandboxingEnabled(),
            w6 = q6 && Ti(A.input);
        return {
            destructiveWarning: l,
            sandboxingEnabled: q6,
            isSandboxed: w6
        }
    }, [w, A.input]), s = Xw.useMemo(() => ({
        completion_type: "tool_use_single",
        language_name: "none"
    }), []);
    BF(A, s);
    let X6 = Xw.useMemo(() => vN1(H), [H]),
        z6 = Xw.useMemo(() => iSq({
            suggestions: A.permissionResult.behavior === "ask" ? A.permissionResult.suggestions : void 0,
            decisionReason: A.permissionResult.decisionReason,
            onRejectFeedbackChange: P,
            onAcceptFeedbackChange: Z,
            onClassifierDescriptionChange: f,
            classifierDescription: G,
            initialClassifierDescriptionEmpty: v,
            existingAllowDescriptions: X6,
            yesInputMode: u,
            noInputMode: g,
            editablePrefix: V,
            onEditablePrefixChange: R
        }), [A, G, v, X6, u, g, V, R]),
        N6 = Xw.useCallback(() => {
            D((l) => !l)
        }, []);
    D8("permission:toggleDebug", N6, {
        context: "Confirmation"
    });
    let $6 = Xw.useCallback(() => {
        A.onDismissCheckmark?.()
    }, [A]);
    D8("confirm:no", $6, {
        context: "Confirmation",
        isActive: !1
    });

    function n(l) {
        A.onUserInteraction();
        let q6 = {
            toolName: hq(A.tool.name),
            isMcp: A.tool.isMcp ?? !1
        };
        if (l === "yes")
            if (u) I(!1), d("tengu_accept_feedback_mode_collapsed", q6);
            else I(!0), U(!0), d("tengu_accept_feedback_mode_entered", q6);
        else if (l === "no")
            if (g) B(!1), d("tengu_reject_feedback_mode_collapsed", q6);
            else B(!0), e(!0), d("tengu_reject_feedback_mode_entered", q6)
    }

    function o(l) {
        let q6 = l?.trim(),
            w6 = !!q6;
        if (!w6) d("tengu_permission_request_escape", {
            explainer_visible: J.visible
        }), j((O6) => ({
            ...O6,
            attribution: {
                ...O6.attribution,
                escapeCount: O6.attribution.escapeCount + 1
            }
        }));
        if (Fi("tool_use_single", A, "reject", w6), q6) A.onReject(q6);
        else A.onReject();
        Y(), K()
    }

    function a(l) {
        d("tengu_permission_request_option_selected", {
            option_index: {
                yes: 1,
                "yes-apply-suggestions": 2,
                "yes-prefix-edited": 2,
                no: 3
            } [l],
            explainer_visible: J.visible
        });
        let w6 = hq(A.tool.name);
        if (l === "yes-prefix-edited") {
            let O6 = (V ?? "").trim();
            if (Fi("tool_use_single", A, "accept"), !O6) A.onAllow(A.input, []);
            else {
                let L6 = [{
                    type: "addRules",
                    rules: [{
                        toolName: J4.name,
                        ruleContent: O6
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }];
                A.onAllow(A.input, L6)
            }
            K();
            return
        }
        switch (l) {
            case "yes": {
                let O6 = W.trim();
                Fi("tool_use_single", A, "accept"), d("tengu_accept_submitted", {
                    toolName: w6,
                    isMcp: A.tool.isMcp ?? !1,
                    has_instructions: !!O6,
                    instructions_length: O6.length,
                    entered_feedback_mode: Q
                }), A.onAllow(A.input, [], O6 || void 0), K();
                break
            }
            case "yes-apply-suggestions": {
                Fi("tool_use_single", A, "accept");
                let O6 = "suggestions" in A.permissionResult ? A.permissionResult.suggestions || [] : [];
                A.onAllow(A.input, O6), K();
                break
            }
            case "no": {
                let O6 = X.trim();
                d("tengu_reject_submitted", {
                    toolName: w6,
                    isMcp: A.tool.isMcp ?? !1,
                    has_instructions: !!O6,
                    instructions_length: O6.length,
                    entered_feedback_mode: r
                }), o(O6 || void 0);
                break
            }
        }
    }
    return N$.default.createElement(cz, {
        workerBadge: _,
        title: J6 && !K6 ? "Bash command (unsandboxed)" : "Bash command",
        subtitle: void 0
    }, N$.default.createElement(m, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, N$.default.createElement(T, {
        dimColor: J.visible
    }, J4.renderToolUseMessage({
        command: w,
        description: O
    }, {
        theme: $,
        verbose: !0
    })), !J.visible && N$.default.createElement(T, {
        dimColor: !0
    }, A.description), N$.default.createElement(YCq, {
        visible: J.visible,
        promise: J.promise
    })), M ? N$.default.createElement(N$.default.Fragment, null, N$.default.createElement(oSq, {
        permissionResult: A.permissionResult,
        toolName: "Bash"
    }), q.options.debug && N$.default.createElement(m, {
        justifyContent: "flex-end",
        marginTop: 1
    }, N$.default.createElement(T, {
        dimColor: !0
    }, "Ctrl-D to hide debug info"))) : N$.default.createElement(N$.default.Fragment, null, N$.default.createElement(m, {
        flexDirection: "column"
    }, N$.default.createElement(lh, {
        permissionResult: A.permissionResult,
        toolType: "command"
    }), H6 && N$.default.createElement(m, {
        marginBottom: 1
    }, N$.default.createElement(T, {
        color: "warning",
        dimColor: !1
    }, H6)), N$.default.createElement(T, {
        dimColor: !1
    }, "Do you want to proceed?"), N$.default.createElement(T8, {
        options: z6,
        isDisabled: !1,
        inlineDescriptions: !0,
        onChange: a,
        onCancel: () => o(),
        onFocus: (l) => {
            if (l !== b) A.onUserInteraction();
            if (l !== "yes" && u && !W.trim()) I(!1);
            if (l !== "no" && g && !X.trim()) B(!1);
            p(l)
        },
        onInputModeToggle: n
    })), N$.default.createElement(m, {
        justifyContent: "space-between",
        marginTop: 1
    }, N$.default.createElement(T, {
        dimColor: !0
    }, "Esc to cancel", (b === "yes" && !u || b === "no" && !g) && " · Tab to amend", J.enabled && ` · ctrl+e to ${J.visible?"hide":"explain"}`), q.options.debug && N$.default.createElement(T, {
        dimColor: !0
    }, "Ctrl+d to show debug info"))))
}
// @from(Ln 488528, Col 4)
N$
// @from(Ln 488528, Col 8)
Xw
// @from(Ln 488529, Col 4)
CCq = E(() => {
    e6();
    i6();
    _7();
    OZ();
    Qr6();
    fV6();
    NZ();
    Is8();
    v3();
    nSq();
    aSq();
    H26();
    Lz();
    V1();
    o$();
    Uc6();
    tSq();
    NA();
    iQ6();
    hZ1();
    zCq();
    wCq();
    HA();
    hCq();
    JZ();
    N$ = t(P6(), 1), Xw = t(P6(), 1)
})
// @from(Ln 488558, Col 0)
function NI1(A) {
    let q = A6(54),
        {
            options: K,
            onSelect: Y,
            onCancel: z,
            question: _,
            toolAnalyticsContext: w
        } = A,
        O = _ === void 0 ? "Do you want to proceed?" : _,
        $ = xA(),
        [H, j] = pN.useState(""),
        [J, M] = pN.useState(""),
        [D, X] = pN.useState(!1),
        [P, W] = pN.useState(!1),
        [Z, G] = pN.useState(null),
        [f, v] = pN.useState(!1),
        [N, V] = pN.useState(!1),
        L;
    if (q[0] !== Z || q[1] !== K) {
        let $6;
        if (q[3] !== Z) $6 = (n) => n.value === Z, q[3] = Z, q[4] = $6;
        else $6 = q[4];
        L = K.find($6), q[0] = Z, q[1] = K, q[2] = L
    } else L = q[2];
    let R = L?.feedbackConfig?.type,
        u = R === "accept" && !D || R === "reject" && !P,
        I;
    if (q[5] !== D || q[6] !== K || q[7] !== P) {
        let $6;
        if (q[9] !== D || q[10] !== P) $6 = (n) => {
            let {
                value: o,
                label: a,
                feedbackConfig: i
            } = n;
            if (!i) return {
                label: a,
                value: o
            };
            let {
                type: l,
                placeholder: q6
            } = i, w6 = l === "accept" ? D : P, O6 = l === "accept" ? j : M, L6 = x0z[l];
            if (w6) return {
                type: "input",
                label: a,
                value: o,
                placeholder: q6 ?? L6,
                onChange: O6,
                allowEmptySubmitToCancel: !0
            };
            return {
                label: a,
                value: o
            }
        }, q[9] = D, q[10] = P, q[11] = $6;
        else $6 = q[11];
        I = K.map($6), q[5] = D, q[6] = K, q[7] = P, q[8] = I
    } else I = q[8];
    let g = I,
        B;
    if (q[12] !== D || q[13] !== K || q[14] !== P || q[15] !== w?.isMcp || q[16] !== w?.toolName) B = ($6) => {
        let n = K.find((i) => i.value === $6);
        if (!n?.feedbackConfig) return;
        let {
            type: o
        } = n.feedbackConfig, a = {
            toolName: w?.toolName,
            isMcp: w?.isMcp ?? !1
        };
        if (o === "accept")
            if (D) X(!1), d("tengu_accept_feedback_mode_collapsed", a);
            else X(!0), v(!0), d("tengu_accept_feedback_mode_entered", a);
        else if (o === "reject")
            if (P) W(!1), d("tengu_reject_feedback_mode_collapsed", a);
            else W(!0), V(!0), d("tengu_reject_feedback_mode_entered", a)
    }, q[12] = D, q[13] = K, q[14] = P, q[15] = w?.isMcp, q[16] = w?.toolName, q[17] = B;
    else B = q[17];
    let b = B,
        p;
    if (q[18] !== H || q[19] !== f || q[20] !== Y || q[21] !== K || q[22] !== J || q[23] !== N || q[24] !== w?.isMcp || q[25] !== w?.toolName) p = ($6) => {
        let n = K.find((a) => a.value === $6);
        if (!n) return;
        let o;
        if (n.feedbackConfig) {
            let i = (n.feedbackConfig.type === "accept" ? H : J).trim();
            if (i) o = i;
            let l = {
                toolName: w?.toolName,
                isMcp: w?.isMcp ?? !1,
                has_instructions: !!i,
                instructions_length: i?.length ?? 0,
                entered_feedback_mode: n.feedbackConfig.type === "accept" ? f : N
            };
            if (n.feedbackConfig.type === "accept") d("tengu_accept_submitted", l);
            else if (n.feedbackConfig.type === "reject") d("tengu_reject_submitted", l)
        }
        Y($6, o)
    }, q[18] = H, q[19] = f, q[20] = Y, q[21] = K, q[22] = J, q[23] = N, q[24] = w?.isMcp, q[25] = w?.toolName, q[26] = p;
    else p = q[26];
    let Q = p,
        U;
    if (q[27] !== Q || q[28] !== K) {
        U = {};
        for (let $6 of K)
            if ($6.keybinding) U[$6.keybinding] = () => Q($6.value);
        q[27] = Q, q[28] = K, q[29] = U
    } else U = q[29];
    let r = U,
        e;
    if (q[30] === Symbol.for("react.memo_cache_sentinel")) e = {
        context: "Confirmation"
    }, q[30] = e;
    else e = q[30];
    tA(r, e);
    let Y6;
    if (q[31] !== z || q[32] !== $) Y6 = () => {
        d("tengu_permission_request_escape", {}), $(u0z), z?.()
    }, q[31] = z, q[32] = $, q[33] = Y6;
    else Y6 = q[33];
    let H6 = Y6,
        J6;
    if (q[34] !== O) J6 = typeof O === "string" ? pN.default.createElement(T, null, O) : O, q[34] = O, q[35] = J6;
    else J6 = q[35];
    let K6;
    if (q[36] !== H || q[37] !== D || q[38] !== K || q[39] !== J || q[40] !== P) K6 = ($6) => {
        let n = K.find((o) => o.value === $6);
        if (n?.feedbackConfig?.type !== "accept" && D && !H.trim()) X(!1);
        if (n?.feedbackConfig?.type !== "reject" && P && !J.trim()) W(!1);
        G($6)
    }, q[36] = H, q[37] = D, q[38] = K, q[39] = J, q[40] = P, q[41] = K6;
    else K6 = q[41];
    let s;
    if (q[42] !== H6 || q[43] !== b || q[44] !== Q || q[45] !== g || q[46] !== K6) s = pN.default.createElement(T8, {
        options: g,
        inlineDescriptions: !0,
        onChange: Q,
        onCancel: H6,
        onFocus: K6,
        onInputModeToggle: b
    }), q[42] = H6, q[43] = b, q[44] = Q, q[45] = g, q[46] = K6, q[47] = s;
    else s = q[47];
    let X6 = u && " · Tab to amend",
        z6;
    if (q[48] !== X6) z6 = pN.default.createElement(m, {
        marginTop: 1
    }, pN.default.createElement(T, {
        dimColor: !0
    }, "Esc to cancel", X6)), q[48] = X6, q[49] = z6;
    else z6 = q[49];
    let N6;
    if (q[50] !== s || q[51] !== z6 || q[52] !== J6) N6 = pN.default.createElement(m, {
        flexDirection: "column"
    }, J6, s, z6), q[50] = s, q[51] = z6, q[52] = J6, q[53] = N6;
    else N6 = q[53];
    return N6
}
// @from(Ln 488717, Col 0)
function u0z(A) {
    return {
        ...A,
        attribution: {
            ...A.attribution,
            escapeCount: A.attribution.escapeCount + 1
        }
    }
}
// @from(Ln 488726, Col 4)
pN
// @from(Ln 488726, Col 8)
x0z
// @from(Ln 488727, Col 4)
gs8 = E(() => {
    e6();
    i6();
    v3();
    V1();
    NA();
    _7();
    pN = t(P6(), 1), x0z = {
        accept: "tell Claude what to do next",
        reject: "tell Claude what to do differently"
    }
})
// @from(Ln 488740, Col 0)
function M86(A) {
    let q = A6(58),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z,
            workerBadge: _
        } = A,
        [w] = z7(),
        O, $;
    if (q[0] !== K.input || q[1] !== K.tool) O = K.tool.userFacingName(K.input), $ = O.endsWith(" (MCP)") ? O.slice(0, -6) : O, q[0] = K.input, q[1] = K.tool, q[2] = O, q[3] = $;
    else O = q[2], $ = q[3];
    let H = $,
        j;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) j = {
        completion_type: "tool_use_single",
        language_name: "none"
    }, q[4] = j;
    else j = q[4];
    BF(K, j);
    let M;
    if (q[5] !== Y || q[6] !== z || q[7] !== K) M = (H6, J6) => {
        A: switch (H6) {
            case "yes": {
                AW({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: K.assistantMessage.message.id,
                        platform: Q8.platform
                    }
                }), K.onAllow(K.input, [], J6), Y();
                break A
            }
            case "yes-dont-ask-again": {
                AW({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: K.assistantMessage.message.id,
                        platform: Q8.platform
                    }
                }), K.onAllow(K.input, [{
                    type: "addRules",
                    rules: [{
                        toolName: K.tool.name
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }]), Y();
                break A
            }
            case "no":
                AW({
                    completion_type: "tool_use_single",
                    event: "reject",
                    metadata: {
                        language_name: "none",
                        message_id: K.assistantMessage.message.id,
                        platform: Q8.platform
                    }
                }), K.onReject(J6), z(), Y()
        }
    }, q[5] = Y, q[6] = z, q[7] = K, q[8] = M;
    else M = q[8];
    let D = M,
        X;
    if (q[9] !== Y || q[10] !== z || q[11] !== K) X = () => {
        AW({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
                language_name: "none",
                message_id: K.assistantMessage.message.id,
                platform: Q8.platform
            }
        }), K.onReject(), z(), Y()
    }, q[9] = Y, q[10] = z, q[11] = K, q[12] = X;
    else X = q[12];
    let P = X,
        W;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) W = AA(), q[13] = W;
    else W = q[13];
    let Z = W,
        G;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) G = Ea(), q[14] = G;
    else G = q[14];
    let f = G,
        v;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) v = {
        label: "Yes",
        value: "yes",
        feedbackConfig: {
            type: "accept"
        }
    }, q[15] = v;
    else v = q[15];
    let N;
    if (q[16] !== H) {
        if (N = [v], f) {
            let J6 = ih.default.createElement(T, {
                    bold: !0
                }, H),
                K6;
            if (q[18] === Symbol.for("react.memo_cache_sentinel")) K6 = ih.default.createElement(T, {
                bold: !0
            }, Z), q[18] = K6;
            else K6 = q[18];
            let s;
            if (q[19] !== J6) s = {
                label: ih.default.createElement(T, null, "Yes, and don't ask again for ", J6, " ", "commands in ", K6),
                value: "yes-dont-ask-again"
            }, q[19] = J6, q[20] = s;
            else s = q[20];
            N.push(s)
        }
        let H6;
        if (q[21] === Symbol.for("react.memo_cache_sentinel")) H6 = {
            label: "No",
            value: "no",
            feedbackConfig: {
                type: "reject"
            }
        }, q[21] = H6;
        else H6 = q[21];
        N.push(H6), q[16] = H, q[17] = N
    } else N = q[17];
    let V = N,
        L;
    if (q[22] !== K.tool.name) L = hq(K.tool.name), q[22] = K.tool.name, q[23] = L;
    else L = q[23];
    let h = K.tool.isMcp ?? !1,
        R;
    if (q[24] !== L || q[25] !== h) R = {
        toolName: L,
        isMcp: h
    }, q[24] = L, q[25] = h, q[26] = R;
    else R = q[26];
    let u = R,
        I;
    if (q[27] !== w || q[28] !== K.input || q[29] !== K.tool) I = K.tool.renderToolUseMessage(K.input, {
        theme: w,
        verbose: !0
    }), q[27] = w, q[28] = K.input, q[29] = K.tool, q[30] = I;
    else I = q[30];
    let g;
    if (q[31] !== O) g = O.endsWith(" (MCP)") ? ih.default.createElement(T, {
        dimColor: !0
    }, " (MCP)") : "", q[31] = O, q[32] = g;
    else g = q[32];
    let B;
    if (q[33] !== I || q[34] !== g || q[35] !== H) B = ih.default.createElement(T, null, H, "(", I, ")", g), q[33] = I, q[34] = g, q[35] = H, q[36] = B;
    else B = q[36];
    let b;
    if (q[37] !== K.description) b = T97(K.description, 3), q[37] = K.description, q[38] = b;
    else b = q[38];
    let p;
    if (q[39] !== b) p = ih.default.createElement(T, {
        dimColor: !0
    }, b), q[39] = b, q[40] = p;
    else p = q[40];
    let Q;
    if (q[41] !== B || q[42] !== p) Q = ih.default.createElement(m, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, B, p), q[41] = B, q[42] = p, q[43] = Q;
    else Q = q[43];
    let U;
    if (q[44] !== K.permissionResult) U = ih.default.createElement(lh, {
        permissionResult: K.permissionResult,
        toolType: "tool"
    }), q[44] = K.permissionResult, q[45] = U;
    else U = q[45];
    let r;
    if (q[46] !== P || q[47] !== D || q[48] !== V || q[49] !== u) r = ih.default.createElement(NI1, {
        options: V,
        onSelect: D,
        onCancel: P,
        toolAnalyticsContext: u
    }), q[46] = P, q[47] = D, q[48] = V, q[49] = u, q[50] = r;
    else r = q[50];
    let e;
    if (q[51] !== U || q[52] !== r) e = ih.default.createElement(m, {
        flexDirection: "column"
    }, U, r), q[51] = U, q[52] = r, q[53] = e;
    else e = q[53];
    let Y6;
    if (q[54] !== Q || q[55] !== e || q[56] !== _) Y6 = ih.default.createElement(cz, {
        title: "Tool use",
        workerBadge: _
    }, Q, e), q[54] = Q, q[55] = e, q[56] = _, q[57] = Y6;
    else Y6 = q[57];
    return Y6
}
// @from(Ln 488937, Col 4)
ih
// @from(Ln 488938, Col 4)
Fs8 = E(() => {
    e6();
    i6();
    NZ();
    GV6();
    d3();
    T1();
    fV6();
    H26();
    gs8();
    o$();
    Km();
    ih = t(P6(), 1)
})
// @from(Ln 488953, Col 0)
function m0z() {
    return Date.now() - yx()
}
// @from(Ln 488957, Col 0)
function B0z(A) {
    return m0z() < A
}
// @from(Ln 488961, Col 0)
function g0z(A) {
    return !B0z(A)
}
// @from(Ln 488965, Col 0)
function $a6(A, q) {
    let K = Vm();
    ps8.useEffect(() => {
        i86(!0)
    }, []), ps8.useEffect(() => {
        let Y = !1,
            z = setInterval(() => {
                if (g0z(ICq) && !Y) Y = !0, clearInterval(z), Hg({
                    message: A,
                    notificationType: q
                }, K)
            }, ICq);
        return () => clearInterval(z)
    }, [A, q, K])
}
// @from(Ln 488980, Col 4)
ps8
// @from(Ln 488980, Col 9)
ICq = 6000
// @from(Ln 488981, Col 4)
Qs8 = E(() => {
    Hs();
    DU6();
    T1();
    ps8 = t(P6(), 1)
})
// @from(Ln 488988, Col 0)
function bCq(A) {
    let q = A6(17),
        {
            file_path: K,
            content: Y
        } = A,
        {
            columns: z
        } = KA(),
        _ = $1().existsSync(K),
        w;
    A: {
        if (!_) {
            w = "";
            break A
        }
        let X;
        if (q[0] !== K) {
            let P = d66(K);
            X = $1().readFileSync(K, {
                encoding: P
            }), q[0] = K, q[1] = X
        } else X = q[1];w = X
    }
    let O = w,
        $;
    A: {
        if (!_) {
            $ = null;
            break A
        }
        let X;
        if (q[2] !== Y || q[3] !== K || q[4] !== O) X = SL({
            filePath: K,
            fileContents: O,
            edits: [{
                old_string: O,
                new_string: Y,
                replace_all: !1
            }]
        }),
        q[2] = Y,
        q[3] = K,
        q[4] = O,
        q[5] = X;
        else X = q[5];$ = X
    }
    let H = $,
        j;
    if (q[6] !== Y) j = Y.split(`
`)[0] ?? null, q[6] = Y, q[7] = j;
    else j = q[7];
    let J = j,
        M;
    if (q[8] !== z || q[9] !== Y || q[10] !== K || q[11] !== J || q[12] !== H || q[13] !== O) M = H ? jh(H.map((X) => wx.createElement(DN, {
        key: X.newStart,
        patch: X,
        dim: !1,
        filePath: K,
        firstLine: J,
        fileContent: O,
        width: z - 2
    })), F0z) : wx.createElement(bf, {
        code: Y || "(No content)",
        filePath: K
    }), q[8] = z, q[9] = Y, q[10] = K, q[11] = J, q[12] = H, q[13] = O, q[14] = M;
    else M = q[14];
    let D;
    if (q[15] !== M) D = wx.createElement(m, {
        flexDirection: "column"
    }, wx.createElement(m, {
        borderColor: "subtle",
        borderStyle: "dashed",
        flexDirection: "column",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1
    }, M)), q[15] = M, q[16] = D;
    else D = q[16];
    return D
}
// @from(Ln 489070, Col 0)
function F0z(A) {
    return wx.createElement(T, {
        dimColor: !0,
        key: `ellipsis-${A}`
    }, "...")
}
// @from(Ln 489076, Col 4)
wx
// @from(Ln 489077, Col 4)
xCq = E(() => {
    e6();
    p66();
    i6();
    Z7();
    U66();
    NU();
    SA();
    _q();
    wx = t(P6(), 1)
})
// @from(Ln 489093, Col 0)
function uCq(A) {
    let q = A6(28),
        K = d0z,
        Y;
    if (q[0] !== A.toolUseConfirm.input) Y = K(A.toolUseConfirm.input), q[0] = A.toolUseConfirm.input, q[1] = Y;
    else Y = q[1];
    let z = Y,
        {
            file_path: _,
            content: w
        } = z,
        O = $1().existsSync(_),
        $ = O ? "overwrite" : "create",
        H = A.toolUseConfirm,
        j = A.toolUseContext,
        J = A.onDone,
        M = A.onReject,
        D = A.workerBadge,
        X = O ? "Overwrite file" : "Create file",
        P;
    if (q[2] !== _) P = Q0z(G1(), _), q[2] = _, q[3] = P;
    else P = q[3];
    let W;
    if (q[4] !== _) W = p0z(_), q[4] = _, q[5] = W;
    else W = q[5];
    let Z;
    if (q[6] !== W) Z = Ha6.default.createElement(T, {
        bold: !0
    }, W), q[6] = W, q[7] = Z;
    else Z = q[7];
    let G;
    if (q[8] !== $ || q[9] !== Z) G = Ha6.default.createElement(T, null, "Do you want to ", $, " ", Z, "?"), q[8] = $, q[9] = Z, q[10] = G;
    else G = q[10];
    let f;
    if (q[11] !== w || q[12] !== _) f = Ha6.default.createElement(bCq, {
        file_path: _,
        content: w
    }), q[11] = w, q[12] = _, q[13] = f;
    else f = q[13];
    let v;
    if (q[14] !== _) v = st(_), q[14] = _, q[15] = v;
    else v = q[15];
    let N;
    if (q[16] !== _ || q[17] !== A.onDone || q[18] !== A.onReject || q[19] !== A.toolUseConfirm || q[20] !== A.toolUseContext || q[21] !== A.workerBadge || q[22] !== G || q[23] !== f || q[24] !== v || q[25] !== X || q[26] !== P) N = Ha6.default.createElement(gF, {
        toolUseConfirm: H,
        toolUseContext: j,
        onDone: J,
        onReject: M,
        workerBadge: D,
        title: X,
        subtitle: P,
        question: G,
        content: f,
        path: _,
        completionType: "write_file_single",
        languageName: v,
        parseInput: K,
        ideDiffSupport: U0z
    }), q[16] = _, q[17] = A.onDone, q[18] = A.onReject, q[19] = A.toolUseConfirm, q[20] = A.toolUseContext, q[21] = A.workerBadge, q[22] = G, q[23] = f, q[24] = v, q[25] = X, q[26] = P, q[27] = N;
    else N = q[27];
    return N
}
// @from(Ln 489156, Col 0)
function d0z(A) {
    return xX.inputSchema.parse(A)
}
// @from(Ln 489159, Col 4)
Ha6
// @from(Ln 489159, Col 9)
U0z
// @from(Ln 489160, Col 4)
mCq = E(() => {
    e6();
    i6();
    c66();
    xCq();
    Z7();
    SA();
    TV6();
    lA();
    Ha6 = t(P6(), 1), U0z = {
        getConfig: (A) => {
            let K = $1().existsSync(A.file_path) ? IM(A.file_path) : "";
            return fI1(A.file_path, K, A.content, !1)
        },
        applyChanges: (A, q) => {
            let K = q[0];
            if (K) return {
                ...A,
                content: K.new_string
            };
            return A
        }
    }
})
// @from(Ln 489185, Col 0)
function c0z(A) {
    let q = A.tool;
    if ("getPath" in q && typeof q.getPath === "function") try {
        return q.getPath(A.input)
    } catch {
        return null
    }
    return null
}
// @from(Ln 489195, Col 0)
function BCq(A) {
    let q = A6(30),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z,
            verbose: _,
            toolUseContext: w,
            workerBadge: O
        } = A,
        [$] = z7(),
        H;
    if (q[0] !== K) H = c0z(K), q[0] = K, q[1] = H;
    else H = q[1];
    let j = H,
        J;
    if (q[2] !== K.input || q[3] !== K.tool) J = K.tool.userFacingName(K.input), q[2] = K.input, q[3] = K.tool, q[4] = J;
    else J = q[4];
    let M = J,
        D = K.tool.isReadOnly(K.input),
        P = `${D?"Read":"Edit"} file`,
        W = l0z;
    if (!j) {
        let V;
        if (q[5] !== Y || q[6] !== z || q[7] !== K || q[8] !== w || q[9] !== _ || q[10] !== O) V = ja6.default.createElement(M86, {
            toolUseConfirm: K,
            toolUseContext: w,
            onDone: Y,
            onReject: z,
            verbose: _,
            workerBadge: O
        }), q[5] = Y, q[6] = z, q[7] = K, q[8] = w, q[9] = _, q[10] = O, q[11] = V;
        else V = q[11];
        return V
    }
    let Z;
    if (q[12] !== $ || q[13] !== K.input || q[14] !== K.tool || q[15] !== _) Z = K.tool.renderToolUseMessage(K.input, {
        theme: $,
        verbose: _
    }), q[12] = $, q[13] = K.input, q[14] = K.tool, q[15] = _, q[16] = Z;
    else Z = q[16];
    let G;
    if (q[17] !== Z || q[18] !== M) G = ja6.default.createElement(m, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, ja6.default.createElement(T, null, M, "(", Z, ")")), q[17] = Z, q[18] = M, q[19] = G;
    else G = q[19];
    let f = G,
        v = D ? "read" : "write",
        N;
    if (q[20] !== f || q[21] !== Y || q[22] !== z || q[23] !== j || q[24] !== v || q[25] !== P || q[26] !== K || q[27] !== w || q[28] !== O) N = ja6.default.createElement(gF, {
        toolUseConfirm: K,
        toolUseContext: w,
        onDone: Y,
        onReject: z,
        workerBadge: O,
        title: P,
        content: f,
        path: j,
        parseInput: W,
        operationType: v,
        completionType: "tool_use_single",
        languageName: "none"
    }), q[20] = f, q[21] = Y, q[22] = z, q[23] = j, q[24] = v, q[25] = P, q[26] = K, q[27] = w, q[28] = O, q[29] = N;
    else N = q[29];
    return N
}
// @from(Ln 489264, Col 0)
function l0z(A) {
    return A
}
// @from(Ln 489267, Col 4)
ja6
// @from(Ln 489268, Col 4)
gCq = E(() => {
    e6();
    i6();
    Fs8();
    TV6();
    ja6 = t(P6(), 1)
})
// @from(Ln 489276, Col 0)
function i0z(A) {
    try {
        let q = BX.inputSchema.safeParse(A);
        if (!q.success) return `input:${A.toString()}`;
        let {
            url: K
        } = q.data;
        return `domain:${new URL(K).hostname}`
    } catch {
        return `input:${A.toString()}`
    }
}
// @from(Ln 489289, Col 0)
function FCq(A) {
    let q = A6(41),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z,
            verbose: _,
            workerBadge: w
        } = A,
        [O] = z7(),
        {
            url: $
        } = K.input,
        H;
    if (q[0] !== $) H = new URL($), q[0] = $, q[1] = H;
    else H = q[1];
    let j = H.hostname,
        J;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) J = {
        completion_type: "tool_use_single",
        language_name: "none"
    }, q[2] = J;
    else J = q[2];
    BF(K, J);
    let D;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) D = Ea(), q[3] = D;
    else D = q[3];
    let X = D,
        P;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) P = {
        label: "Yes",
        value: "yes"
    }, q[4] = P;
    else P = q[4];
    let W;
    if (q[5] !== j) {
        if (W = [P], X) {
            let p = mE.default.createElement(T, {
                    bold: !0
                }, j),
                Q;
            if (q[7] !== p) Q = {
                label: mE.default.createElement(T, null, "Yes, and don't ask again for ", p),
                value: "yes-dont-ask-again-domain"
            }, q[7] = p, q[8] = Q;
            else Q = q[8];
            W.push(Q)
        }
        let b;
        if (q[9] === Symbol.for("react.memo_cache_sentinel")) b = {
            label: mE.default.createElement(T, null, "No, and tell Claude what to do differently ", mE.default.createElement(T, {
                bold: !0
            }, "(esc)")),
            value: "no"
        }, q[9] = b;
        else b = q[9];
        W.push(b), q[5] = j, q[6] = W
    } else W = q[6];
    let Z = W,
        G;
    if (q[10] !== Y || q[11] !== z || q[12] !== K) G = function(p) {
        A: switch (p) {
            case "yes": {
                Fi("tool_use_single", K, "accept"), K.onAllow(K.input, []), Y();
                break A
            }
            case "yes-dont-ask-again-domain": {
                Fi("tool_use_single", K, "accept");
                let Q = i0z(K.input),
                    U = {
                        toolName: K.tool.name,
                        ruleContent: Q
                    };
                K.onAllow(K.input, [{
                    type: "addRules",
                    rules: [U],
                    behavior: "allow",
                    destination: "localSettings"
                }]), Y();
                break A
            }
            case "no":
                Fi("tool_use_single", K, "reject"), K.onReject(), z(), Y()
        }
    }, q[10] = Y, q[11] = z, q[12] = K, q[13] = G;
    else G = q[13];
    let f = G,
        v;
    if (q[14] !== O || q[15] !== K.input || q[16] !== _) v = BX.renderToolUseMessage(K.input, {
        theme: O,
        verbose: _
    }), q[14] = O, q[15] = K.input, q[16] = _, q[17] = v;
    else v = q[17];
    let N;
    if (q[18] !== v) N = mE.default.createElement(T, null, v), q[18] = v, q[19] = N;
    else N = q[19];
    let V;
    if (q[20] !== K.description) V = mE.default.createElement(T, {
        dimColor: !0
    }, K.description), q[20] = K.description, q[21] = V;
    else V = q[21];
    let L;
    if (q[22] !== N || q[23] !== V) L = mE.default.createElement(m, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, N, V), q[22] = N, q[23] = V, q[24] = L;
    else L = q[24];
    let h;
    if (q[25] !== K.permissionResult) h = mE.default.createElement(lh, {
        permissionResult: K.permissionResult,
        toolType: "tool"
    }), q[25] = K.permissionResult, q[26] = h;
    else h = q[26];
    let R;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) R = mE.default.createElement(T, null, "Do you want to allow Claude to fetch this content?"), q[27] = R;
    else R = q[27];
    let u;
    if (q[28] !== f) u = () => f("no"), q[28] = f, q[29] = u;
    else u = q[29];
    let I;
    if (q[30] !== f || q[31] !== Z || q[32] !== u) I = mE.default.createElement(T8, {
        options: Z,
        onChange: f,
        onCancel: u
    }), q[30] = f, q[31] = Z, q[32] = u, q[33] = I;
    else I = q[33];
    let g;
    if (q[34] !== h || q[35] !== I) g = mE.default.createElement(m, {
        flexDirection: "column"
    }, h, R, I), q[34] = h, q[35] = I, q[36] = g;
    else g = q[36];
    let B;
    if (q[37] !== g || q[38] !== L || q[39] !== w) B = mE.default.createElement(cz, {
        title: "Fetch",
        workerBadge: w
    }, L, g), q[37] = g, q[38] = L, q[39] = w, q[40] = B;
    else B = q[40];
    return B
}
// @from(Ln 489429, Col 4)
mE
// @from(Ln 489430, Col 4)
pCq = E(() => {
    e6();
    i6();
    vT6();
    fV6();
    NZ();
    Is8();
    v3();
    H26();
    Km();
    mE = t(P6(), 1)
})
// @from(Ln 489446, Col 0)
function QCq(A) {
    let q = A6(5),
        K;
    if (q[0] !== A.notebook_path) K = $1().readFile(A.notebook_path, {
        encoding: "utf-8"
    }).then(o0z).catch(r0z), q[0] = A.notebook_path, q[1] = K;
    else K = q[1];
    let Y = K,
        z;
    if (q[2] !== Y || q[3] !== A) z = e_.createElement(VI1.Suspense, {
        fallback: null
    }, e_.createElement(a0z, {
        ...A,
        promise: Y
    })), q[2] = Y, q[3] = A, q[4] = z;
    else z = q[4];
    return z
}
// @from(Ln 489465, Col 0)
function r0z() {
    return null
}
// @from(Ln 489469, Col 0)
function o0z(A) {
    return WK(A)
}
// @from(Ln 489473, Col 0)
function a0z(A) {
    let q = A6(34),
        {
            notebook_path: K,
            cell_id: Y,
            new_source: z,
            cell_type: _,
            edit_mode: w,
            verbose: O,
            width: $,
            promise: H
        } = A,
        j = w === void 0 ? "replace" : w,
        J = VI1.use(H),
        M;
    if (q[0] !== Y || q[1] !== J) {
        A: {
            if (!J || !Y) {
                M = "";
                break A
            }
            let h = Kp6(Y);
            if (h !== void 0) {
                if (J.cells[h]) {
                    let I = J.cells[h].source,
                        g;
                    if (q[3] !== I) g = Array.isArray(I) ? I.join("") : I, q[3] = I, q[4] = g;
                    else g = q[4];
                    M = g;
                    break A
                }
                M = "";
                break A
            }
            let R;
            if (q[5] !== Y) R = (I) => I.id === Y,
            q[5] = Y,
            q[6] = R;
            else R = q[6];
            let u = J.cells.find(R);
            if (!u) {
                M = "";
                break A
            }
            M = Array.isArray(u.source) ? u.source.join("") : u.source
        }
        q[0] = Y,
        q[1] = J,
        q[2] = M
    }
    else M = q[2];
    let D = M,
        X;
    A: {
        if (!J || j === "insert" || j === "delete") {
            X = null;
            break A
        }
        let h;
        if (q[7] !== z || q[8] !== K || q[9] !== D) h = SL({
            filePath: K,
            fileContents: D,
            edits: [{
                old_string: D,
                new_string: z,
                replace_all: !1
            }],
            ignoreWhitespace: !1
        }),
        q[7] = z,
        q[8] = K,
        q[9] = D,
        q[10] = h;
        else h = q[10];X = h
    }
    let P = X,
        W;
    A: switch (j) {
        case "insert": {
            W = "Insert new cell";
            break A
        }
        case "delete": {
            W = "Delete cell";
            break A
        }
        default:
            W = "Replace cell contents"
    }
    let Z;
    if (q[11] !== K || q[12] !== O) Z = O ? K : n0z(G1(), K), q[11] = K, q[12] = O, q[13] = Z;
    else Z = q[13];
    let G;
    if (q[14] !== Z) G = e_.createElement(T, {
        bold: !0
    }, Z), q[14] = Z, q[15] = G;
    else G = q[15];
    let f = _ ? ` (${_})` : "",
        v;
    if (q[16] !== Y || q[17] !== W || q[18] !== f) v = e_.createElement(T, {
        dimColor: !0
    }, W, " for cell ", Y, f), q[16] = Y, q[17] = W, q[18] = f, q[19] = v;
    else v = q[19];
    let N;
    if (q[20] !== G || q[21] !== v) N = e_.createElement(m, {
        paddingBottom: 1,
        flexDirection: "column"
    }, G, v), q[20] = G, q[21] = v, q[22] = N;
    else N = q[22];
    let V;
    if (q[23] !== _ || q[24] !== j || q[25] !== P || q[26] !== z || q[27] !== K || q[28] !== D || q[29] !== $) V = j === "delete" ? e_.createElement(m, {
        flexDirection: "column",
        paddingLeft: 2
    }, e_.createElement(bf, {
        code: D,
        filePath: K
    })) : j === "insert" ? e_.createElement(m, {
        flexDirection: "column",
        paddingLeft: 2
    }, e_.createElement(bf, {
        code: z,
        filePath: _ === "markdown" ? "file.md" : K
    })) : P ? jh(P.map((h) => e_.createElement(DN, {
        key: h.newStart,
        patch: h,
        dim: !1,
        width: $,
        filePath: K,
        firstLine: z.split(`
`)[0] ?? null,
        fileContent: D
    })), s0z) : e_.createElement(bf, {
        code: z,
        filePath: _ === "markdown" ? "file.md" : K
    }), q[23] = _, q[24] = j, q[25] = P, q[26] = z, q[27] = K, q[28] = D, q[29] = $, q[30] = V;
    else V = q[30];
    let L;
    if (q[31] !== N || q[32] !== V) L = e_.createElement(m, {
        flexDirection: "column"
    }, e_.createElement(m, {
        borderStyle: "round",
        flexDirection: "column",
        paddingX: 1
    }, N, V)), q[31] = N, q[32] = V, q[33] = L;
    else L = q[33];
    return L
}
// @from(Ln 489621, Col 0)
function s0z(A) {
    return e_.createElement(T, {
        dimColor: !0,
        key: `ellipsis-${A}`
    }, "...")
}
// @from(Ln 489627, Col 4)
e_
// @from(Ln 489627, Col 8)
VI1
// @from(Ln 489628, Col 4)
UCq = E(() => {
    e6();
    p66();
    i6();
    lA();
    U66();
    NU();
    K_();
    SA();
    MP1();
    e_ = t(P6(), 1), VI1 = t(P6(), 1)
})
// @from(Ln 489644, Col 0)
function dCq(A) {
    let q = A6(52),
        K = e0z,
        Y, z, _, w, O, $, H, j, J, M, D, X, P, W, Z, G, f;
    if (q[0] !== A.onDone || q[1] !== A.onReject || q[2] !== A.toolUseConfirm || q[3] !== A.toolUseContext || q[4] !== A.workerBadge) {
        $ = K(A.toolUseConfirm.input);
        let {
            notebook_path: R,
            edit_mode: u,
            cell_type: I
        } = $;
        O = R, w = I === "markdown" ? "markdown" : "python";
        let g = u === "insert" ? "insert this cell into" : u === "delete" ? "delete this cell from" : "make this edit to";
        _ = gF, P = A.toolUseConfirm, W = A.toolUseContext, Z = A.onDone, G = A.onReject, f = A.workerBadge, J = "Edit notebook", z = T, M = "Do you want to ", D = g, X = " ", Y = T, H = !0, j = t0z(O), q[0] = A.onDone, q[1] = A.onReject, q[2] = A.toolUseConfirm, q[3] = A.toolUseContext, q[4] = A.workerBadge, q[5] = Y, q[6] = z, q[7] = _, q[8] = w, q[9] = O, q[10] = $, q[11] = H, q[12] = j, q[13] = J, q[14] = M, q[15] = D, q[16] = X, q[17] = P, q[18] = W, q[19] = Z, q[20] = G, q[21] = f
    } else Y = q[5], z = q[6], _ = q[7], w = q[8], O = q[9], $ = q[10], H = q[11], j = q[12], J = q[13], M = q[14], D = q[15], X = q[16], P = q[17], W = q[18], Z = q[19], G = q[20], f = q[21];
    let v;
    if (q[22] !== Y || q[23] !== H || q[24] !== j) v = Ja6.default.createElement(Y, {
        bold: H
    }, j), q[22] = Y, q[23] = H, q[24] = j, q[25] = v;
    else v = q[25];
    let N;
    if (q[26] !== z || q[27] !== v || q[28] !== M || q[29] !== D || q[30] !== X) N = Ja6.default.createElement(z, null, M, D, X, v, "?"), q[26] = z, q[27] = v, q[28] = M, q[29] = D, q[30] = X, q[31] = N;
    else N = q[31];
    let V = A.verbose ? 120 : 80,
        L;
    if (q[32] !== $.cell_id || q[33] !== $.cell_type || q[34] !== $.edit_mode || q[35] !== $.new_source || q[36] !== $.notebook_path || q[37] !== A.verbose || q[38] !== V) L = Ja6.default.createElement(QCq, {
        notebook_path: $.notebook_path,
        cell_id: $.cell_id,
        new_source: $.new_source,
        cell_type: $.cell_type,
        edit_mode: $.edit_mode,
        verbose: A.verbose,
        width: V
    }), q[32] = $.cell_id, q[33] = $.cell_type, q[34] = $.edit_mode, q[35] = $.new_source, q[36] = $.notebook_path, q[37] = A.verbose, q[38] = V, q[39] = L;
    else L = q[39];
    let h;
    if (q[40] !== _ || q[41] !== w || q[42] !== O || q[43] !== J || q[44] !== N || q[45] !== L || q[46] !== P || q[47] !== W || q[48] !== Z || q[49] !== G || q[50] !== f) h = Ja6.default.createElement(_, {
        toolUseConfirm: P,
        toolUseContext: W,
        onDone: Z,
        onReject: G,
        workerBadge: f,
        title: J,
        question: N,
        content: L,
        path: O,
        completionType: "tool_use_single",
        languageName: w,
        parseInput: K
    }), q[40] = _, q[41] = w, q[42] = O, q[43] = J, q[44] = N, q[45] = L, q[46] = P, q[47] = W, q[48] = Z, q[49] = G, q[50] = f, q[51] = h;
    else h = q[51];
    return h
}
// @from(Ln 489698, Col 0)
function e0z(A) {
    let q = Vl.inputSchema.safeParse(A);
    if (!q.success) return _6(Error(`Failed to parse notebook edit input: ${q.error.message}`)), {
        notebook_path: "",
        new_source: "",
        cell_id: ""
    };
    return q.data
}
// @from(Ln 489707, Col 4)
Ja6
// @from(Ln 489708, Col 4)
cCq = E(() => {
    e6();
    i6();
    Rl6();
    UCq();
    TV6();
    k1();
    Ja6 = t(P6(), 1)
})
// @from(Ln 489718, Col 0)
function EI1(A, q) {
    let K = [{
        type: "setMode",
        mode: _C(A),
        destination: "session"
    }];
    if (T66() && q && q.length > 0) K.push({
        type: "addRules",
        rules: q.map((Y) => ({
            toolName: Y.tool,
            ruleContent: vl4(Y.prompt)
        })),
        behavior: "allow",
        destination: "session"
    });
    return K
}
// @from(Ln 489736, Col 0)
function lCq({
    toolUseConfirm: A,
    onDone: q,
    onReject: K,
    workerBadge: Y
}) {
    let z = M1((Q) => Q.toolPermissionContext),
        _ = xA(),
        {
            addNotification: w
        } = o4(),
        [O, $] = nh.useState(""),
        [H, j] = nh.useState({}),
        J = nh.useRef(0),
        M = AWz(A.assistantMessage.message.usage, z.mode),
        D = (Q) => M !== null ? `Yes, clear context (${M}% used) ${Q}` : `Yes, clear context ${Q}`;

    function X(Q, U, r, e, Y6) {
        let H6 = J.current++,
            J6 = {
                id: H6,
                type: "image",
                content: Q,
                mediaType: U || "image/png",
                filename: r || "Pasted image",
                dimensions: e
            };
        sZ6(J6), c96(J6), j((K6) => ({
            ...K6,
            [H6]: J6
        }))
    }
    let P = nh.useCallback((Q) => {
            j((U) => {
                let r = {
                    ...U
                };
                return delete r[Q], r
            })
        }, []),
        W = Object.values(H).filter((Q) => Q.type === "image"),
        Z = W.length > 0,
        G = A.tool.name === aJ,
        f = G ? void 0 : A.input.plan,
        v = G ? Fj() : void 0,
        N = A.input.allowedPrompts,
        V = f ?? sJ(),
        L = !V || V.trim() === "",
        [h] = nh.useState(() => Hz1() ?? void 0),
        [R, u] = nh.useState(() => {
            if (f) return f;
            return sJ() ?? "No plan found. Please write your plan to the plan file first."
        }),
        [I, g] = nh.useState(!1);
    nh.useEffect(() => {
        if (I) {
            let Q = setTimeout(g, 5000, !1);
            return () => clearTimeout(Q)
        }
    }, [I]), jA((Q, U) => {
        if (U.ctrl && Q.toLowerCase() === "g") d("tengu_plan_external_editor_used", {}), (async () => {
            if (G && v) {
                let r = await NE(v);
                if (r.error) w({
                    key: "external-editor-error",
                    text: r.error,
                    color: "warning",
                    priority: "high"
                });
                if (r.content !== null) u(r.content), g(!0)
            } else {
                let r = await NN(R);
                if (r.error) w({
                    key: "external-editor-error",
                    text: r.error,
                    color: "warning",
                    priority: "high"
                });
                if (r.content !== null && r.content !== R) u(r.content), g(!0)
            }
        })();
        if (U.shift && U.tab) {
            B("yes-accept-edits");
            return
        }
    });
    async function B(Q) {
        let U = G ? {} : {
            plan: R
        };
        {
            let s = (Q === "yes-resume-auto-mode" || Q === "yes-auto-clear-context") && IN();
            if (Q !== "no" && !s && z.prePlanMode === "auto") kI1?.setAutoModeActive(!1), MS(!0), _((X6) => ({
                ...X6,
                toolPermissionContext: {
                    ...x_6(X6.toolPermissionContext),
                    prePlanMode: void 0
                }
            }))
        }
        if (Q !== "no" && !(Q === "yes-accept-edits-keep-context" || Q === "yes-default-keep-context" || Q === "yes-resume-auto-mode")) {
            let s = "default";
            if (Q === "yes-bypass-permissions") s = "bypassPermissions";
            else if (Q === "yes-accept-edits") s = "acceptEdits";
            else if (Q === "yes-auto-clear-context" && IN()) s = "auto", kI1?.setAutoModeActive(!0);
            d("tengu_plan_exit", {
                planLengthChars: R.length,
                outcome: Q,
                clearContext: !0,
                interviewPhaseEnabled: rO(),
                planStructureVariant: h
            });
            let X6 = "",
                N6 = `

If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: ${Cz()}`,
                $6 = E7() ? `

If this plan can be broken down into multiple independent tasks, consider using the ${SI} tool to create a team and parallelize the work.` : "";
            _((n) => ({
                ...n,
                initialMessage: {
                    message: {
                        ...p1({
                            content: `Implement the following plan:

${R}${X6}${N6}${$6}`
                        }),
                        planContent: R
                    },
                    clearContext: !0,
                    mode: s,
                    allowedPrompts: N
                }
            })), HV(!0), q(), K(), A.onReject();
            return
        }
        if (Q === "yes-resume-auto-mode" && IN()) {
            d("tengu_plan_exit", {
                planLengthChars: R.length,
                outcome: Q,
                clearContext: !1,
                interviewPhaseEnabled: rO(),
                planStructureVariant: h
            }), HV(!0), JS(!0), kI1?.setAutoModeActive(!0), _((s) => ({
                ...s,
                toolPermissionContext: Vi({
                    ...s.toolPermissionContext,
                    mode: "auto",
                    prePlanMode: void 0
                })
            })), q(), A.onAllow(U, []);
            return
        }
        let H6 = {
            "yes-accept-edits-keep-context": z.isBypassPermissionsModeAvailable ? "bypassPermissions" : "acceptEdits",
            "yes-default-keep-context": "default",
            ...{
                "yes-resume-auto-mode": "default"
            }
        } [Q];
        if (H6) {
            d("tengu_plan_exit", {
                planLengthChars: R.length,
                outcome: Q,
                clearContext: !1,
                interviewPhaseEnabled: rO(),
                planStructureVariant: h
            }), HV(!0), JS(!0), q(), A.onAllow(U, EI1(H6, N));
            return
        }
        let K6 = {
            "yes-bypass-permissions": "bypassPermissions",
            "yes-accept-edits": "acceptEdits"
        } [Q];
        if (K6) {
            d("tengu_plan_exit", {
                planLengthChars: R.length,
                outcome: Q,
                interviewPhaseEnabled: rO(),
                planStructureVariant: h
            }), HV(!0), JS(!0), q(), A.onAllow(U, EI1(K6, N));
            return
        }
        if (Q === "no") {
            let s = O.trim();
            if (!s && !Z) return;
            d("tengu_plan_exit", {
                planLengthChars: R.length,
                outcome: "no",
                interviewPhaseEnabled: rO(),
                planStructureVariant: h
            });
            let X6;
            if (Z) X6 = await Promise.all(W.map(async (z6) => {
                let N6 = {
                    type: "image",
                    source: {
                        type: "base64",
                        media_type: z6.mediaType || "image/png",
                        data: z6.content
                    }
                };
                return (await Qd(N6)).block
            }));
            q(), K(), A.onReject(s || (Z ? "(See attached image)" : void 0), X6 && X6.length > 0 ? X6 : void 0)
        }
    }
    let b = vh(),
        p = b ? Y$(b) : null;
    if (L) return N_.default.createElement(cz, {
        color: "planMode",
        title: "Exit plan mode?",
        workerBadge: Y
    }, N_.default.createElement(m, {
        flexDirection: "column",
        paddingX: 1,
        marginTop: 1
    }, N_.default.createElement(T, null, "Claude wants to exit plan mode"), N_.default.createElement(m, {
        marginTop: 1
    }, N_.default.createElement(T8, {
        options: [{
            label: "Yes",
            value: "yes"
        }, {
            label: "No",
            value: "no"
        }],
        onChange: function(U) {
            if (U === "yes") {
                if (d("tengu_plan_exit", {
                        planLengthChars: 0,
                        outcome: "yes-default",
                        interviewPhaseEnabled: rO(),
                        planStructureVariant: h
                    }), z.prePlanMode === "auto") kI1?.setAutoModeActive(!1), MS(!0), _((r) => ({
                    ...r,
                    toolPermissionContext: {
                        ...x_6(r.toolPermissionContext),
                        prePlanMode: void 0
                    }
                }));
                HV(!0), JS(!0), q(), A.onAllow({}, [{
                    type: "setMode",
                    mode: "default",
                    destination: "session"
                }])
            } else d("tengu_plan_exit", {
                planLengthChars: 0,
                outcome: "no",
                interviewPhaseEnabled: rO(),
                planStructureVariant: h
            }), q(), K(), A.onReject()
        },
        onCancel: () => {
            d("tengu_plan_exit", {
                planLengthChars: 0,
                outcome: "no",
                interviewPhaseEnabled: rO(),
                planStructureVariant: h
            }), q(), K(), A.onReject()
        }
    }))));
    return N_.default.createElement(N_.default.Fragment, null, N_.default.createElement(cz, {
        color: "planMode",
        title: "Ready to code?",
        innerPaddingX: 0,
        workerBadge: Y
    }, N_.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, N_.default.createElement(m, {
        paddingX: 1,
        flexDirection: "column"
    }, N_.default.createElement(T, null, "Here is Claude's plan:")), N_.default.createElement(m, {
        borderColor: "subtle",
        borderStyle: "dashed",
        flexDirection: "column",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1,
        marginBottom: 1,
        overflow: "hidden"
    }, N_.default.createElement(U_, null, R)), N_.default.createElement(m, {
        flexDirection: "column",
        paddingX: 1
    }, N_.default.createElement(lh, {
        permissionResult: A.permissionResult,
        toolType: "tool"
    }), T66() && N && N.length > 0 && N_.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, N_.default.createElement(T, {
        bold: !0
    }, "Requested permissions:"), N.map((Q, U) => N_.default.createElement(T, {
        key: U,
        dimColor: !0
    }, "  ", "· ", Q.tool, "(", Tl4, " ", Q.prompt, ")"))), N_.default.createElement(T, {
        dimColor: !0
    }, "Claude has written up a plan and is ready to execute. Would you like to proceed?"), N_.default.createElement(m, {
        marginTop: 1
    }, N_.default.createElement(T8, {
        options: [...z.isAutoModeAvailable ? [{
            label: D("and use auto mode"),
            value: "yes-auto-clear-context"
        }] : z.isBypassPermissionsModeAvailable ? [{
            label: D("and bypass permissions"),
            value: "yes-bypass-permissions"
        }] : [{
            label: D("and auto-accept edits"),
            value: "yes-accept-edits"
        }], z.isAutoModeAvailable ? {
            label: "Yes, and use auto mode",
            value: "yes-resume-auto-mode"
        } : {
            label: z.isBypassPermissionsModeAvailable ? "Yes, and bypass permissions" : "Yes, auto-accept edits",
            value: "yes-accept-edits-keep-context"
        }, {
            label: "Yes, manually approve edits",
            value: "yes-default-keep-context"
        }, {
            type: "input",
            label: "No, keep planning",
            value: "no",
            placeholder: "Type here to tell Claude what to change",
            onChange: $
        }],
        onChange: (Q) => B(Q),
        onCancel: () => {
            d("tengu_plan_exit", {
                planLengthChars: R.length,
                outcome: "no",
                interviewPhaseEnabled: rO(),
                planStructureVariant: h
            }), q(), K(), A.onReject()
        },
        onImagePaste: X,
        pastedContents: H,
        onRemoveImage: P
    }))))), p && N_.default.createElement(m, {
        flexDirection: "row",
        gap: 1,
        paddingX: 1,
        marginTop: 1
    }, N_.default.createElement(m, null, N_.default.createElement(T, {
        dimColor: !0
    }, "ctrl-g to edit in "), N_.default.createElement(T, {
        bold: !0,
        dimColor: !0
    }, p), G && v && N_.default.createElement(T, {
        dimColor: !0
    }, " · ", $K(v))), I && N_.default.createElement(m, null, N_.default.createElement(T, {
        dimColor: !0
    }, " · "), N_.default.createElement(T, {
        color: "success"
    }, a6.tick, "Plan saved!"))))
}
// @from(Ln 490094, Col 0)
function AWz(A, q) {
    if (!A) return null;
    let K = II({
            permissionMode: q,
            mainLoopModel: cK(),
            exceeds200kTokens: !1
        }),
        Y = uM(K, Zj()),
        {
            used: z
        } = bS1({
            input_tokens: A.input_tokens,
            cache_creation_input_tokens: A.cache_creation_input_tokens ?? 0,
            cache_read_input_tokens: A.cache_read_input_tokens ?? 0
        }, Y);
    return z
}
// @from(Ln 490111, Col 4)
N_
// @from(Ln 490111, Col 8)
nh
// @from(Ln 490111, Col 12)
kI1
// @from(Ln 490112, Col 4)
Us8 = E(() => {
    i6();
    Qz();
    o9();
    NZ();
    ov();
    H26();
    NA();
    wz();
    VE();
    V1();
    b7();
    ll();
    Sw();
    rH();
    Z7();
    T1();
    Oq();
    JA();
    rJ();
    rD();
    Xa();
    xJ();
    z4();
    jR();
    Sc();
    N_ = t(P6(), 1), nh = t(P6(), 1), kI1 = k4(VT6)
})
// @from(Ln 490141, Col 0)
function iCq(A) {
    let q = A6(18),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z,
            workerBadge: _
        } = A,
        w = M1(qWz),
        O;
    if (q[0] !== Y || q[1] !== z || q[2] !== w || q[3] !== K) O = function(G) {
        if (G === "yes") d("tengu_plan_enter", {
            interviewPhaseEnabled: rO(),
            entryMethod: "tool"
        }), Dp(w, "plan"), Y(), K.onAllow({}, [{
            type: "setMode",
            mode: "plan",
            destination: "session"
        }]);
        else Y(), z(), K.onReject()
    }, q[0] = Y, q[1] = z, q[2] = w, q[3] = K, q[4] = O;
    else O = q[4];
    let $ = O,
        H;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) H = QN.default.createElement(T, null, "Claude wants to enter plan mode to explore and design an implementation approach."), q[5] = H;
    else H = q[5];
    let j;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) j = QN.default.createElement(m, {
        marginTop: 1,
        flexDirection: "column"
    }, QN.default.createElement(T, {
        dimColor: !0
    }, "In plan mode, Claude will:"), QN.default.createElement(T, {
        dimColor: !0
    }, " · Explore the codebase thoroughly"), QN.default.createElement(T, {
        dimColor: !0
    }, " · Identify existing patterns"), QN.default.createElement(T, {
        dimColor: !0
    }, " · Design an implementation strategy"), QN.default.createElement(T, {
        dimColor: !0
    }, " · Present a plan for your approval")), q[6] = j;
    else j = q[6];
    let J;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) J = QN.default.createElement(m, {
        marginTop: 1
    }, QN.default.createElement(T, {
        dimColor: !0
    }, "No code changes will be made until you approve the plan.")), q[7] = J;
    else J = q[7];
    let M;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) M = {
        label: "Yes, enter plan mode",
        value: "yes"
    }, q[8] = M;
    else M = q[8];
    let D;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) D = [M, {
        label: "No, start implementing now",
        value: "no"
    }], q[9] = D;
    else D = q[9];
    let X;
    if (q[10] !== $) X = () => $("no"), q[10] = $, q[11] = X;
    else X = q[11];
    let P;
    if (q[12] !== $ || q[13] !== X) P = QN.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1,
        paddingX: 1
    }, H, j, J, QN.default.createElement(m, {
        marginTop: 1
    }, QN.default.createElement(T8, {
        options: D,
        onChange: $,
        onCancel: X
    }))), q[12] = $, q[13] = X, q[14] = P;
    else P = q[14];
    let W;
    if (q[15] !== P || q[16] !== _) W = QN.default.createElement(cz, {
        color: "planMode",
        title: "Enter plan mode?",
        workerBadge: _
    }, P), q[15] = P, q[16] = _, q[17] = W;
    else W = q[17];
    return W
}
// @from(Ln 490228, Col 0)
function qWz(A) {
    return A.toolPermissionContext.mode
}
// @from(Ln 490231, Col 4)
QN
// @from(Ln 490232, Col 4)
nCq = E(() => {
    e6();
    i6();
    o9();
    NZ();
    T1();
    NA();
    V1();
    Xa();
    QN = t(P6(), 1)
})
// @from(Ln 490244, Col 0)
function rCq(A) {
    let q = A6(51),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z,
            workerBadge: _
        } = A,
        w = KWz,
        O;
    if (q[0] !== K.input) O = w(K.input), q[0] = K.input, q[1] = O;
    else O = q[1];
    let $ = O,
        H = K.permissionResult.behavior === "ask" && K.permissionResult.metadata && "command" in K.permissionResult.metadata ? K.permissionResult.metadata.command : void 0,
        j;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) j = {
        completion_type: "tool_use_single",
        language_name: "none"
    }, q[2] = j;
    else j = q[2];
    BF(K, j);
    let M;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) M = AA(), q[3] = M;
    else M = q[3];
    let D = M,
        X;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) X = Ea(), q[4] = X;
    else X = q[4];
    let P = X,
        W;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) W = [{
        label: "Yes",
        value: "yes",
        feedbackConfig: {
            type: "accept"
        }
    }], q[5] = W;
    else W = q[5];
    let Z = W,
        G;
    if (q[6] !== $) {
        if (G = [], P) {
            let K6 = UN.default.createElement(T, {
                    bold: !0
                }, $),
                s;
            if (q[8] === Symbol.for("react.memo_cache_sentinel")) s = UN.default.createElement(T, {
                bold: !0
            }, D), q[8] = s;
            else s = q[8];
            let X6;
            if (q[9] !== K6) X6 = {
                label: UN.default.createElement(T, null, "Yes, and don't ask again for ", K6, " in", " ", s),
                value: "yes-exact"
            }, q[9] = K6, q[10] = X6;
            else X6 = q[10];
            G.push(X6);
            let z6 = $.indexOf(" ");
            if (z6 > 0) {
                let $6 = $.substring(0, z6) + ":*",
                    n;
                if (q[11] !== $6) n = UN.default.createElement(T, {
                    bold: !0
                }, $6), q[11] = $6, q[12] = n;
                else n = q[12];
                let o;
                if (q[13] === Symbol.for("react.memo_cache_sentinel")) o = UN.default.createElement(T, {
                    bold: !0
                }, D), q[13] = o;
                else o = q[13];
                let a;
                if (q[14] !== n) a = {
                    label: UN.default.createElement(T, null, "Yes, and don't ask again for", " ", n, " commands in", " ", o),
                    value: "yes-prefix"
                }, q[14] = n, q[15] = a;
                else a = q[15];
                G.push(a)
            }
        }
        q[6] = $, q[7] = G
    } else G = q[7];
    let f;
    if (q[16] === Symbol.for("react.memo_cache_sentinel")) f = {
        label: "No",
        value: "no",
        feedbackConfig: {
            type: "reject"
        }
    }, q[16] = f;
    else f = q[16];
    let v = f,
        N;
    if (q[17] !== G) N = [...Z, ...G, v], q[17] = G, q[18] = N;
    else N = q[18];
    let V = N,
        L;
    if (q[19] !== K.tool.name) L = hq(K.tool.name), q[19] = K.tool.name, q[20] = L;
    else L = q[20];
    let h = K.tool.isMcp ?? !1,
        R;
    if (q[21] !== L || q[22] !== h) R = {
        toolName: L,
        isMcp: h
    }, q[21] = L, q[22] = h, q[23] = R;
    else R = q[23];
    let u = R,
        I;
    if (q[24] !== Y || q[25] !== z || q[26] !== $ || q[27] !== K) I = (K6, s) => {
        A: switch (K6) {
            case "yes": {
                AW({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: K.assistantMessage.message.id,
                        platform: Q8.platform
                    }
                }), K.onAllow(K.input, [], s), Y();
                break A
            }
            case "yes-exact": {
                AW({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: K.assistantMessage.message.id,
                        platform: Q8.platform
                    }
                }), K.onAllow(K.input, [{
                    type: "addRules",
                    rules: [{
                        toolName: oH,
                        ruleContent: $
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }]), Y();
                break A
            }
            case "yes-prefix": {
                AW({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: K.assistantMessage.message.id,
                        platform: Q8.platform
                    }
                });
                let X6 = $.indexOf(" "),
                    z6 = X6 > 0 ? $.substring(0, X6) : $;
                K.onAllow(K.input, [{
                    type: "addRules",
                    rules: [{
                        toolName: oH,
                        ruleContent: `${z6}:*`
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }]), Y();
                break A
            }
            case "no":
                AW({
                    completion_type: "tool_use_single",
                    event: "reject",
                    metadata: {
                        language_name: "none",
                        message_id: K.assistantMessage.message.id,
                        platform: Q8.platform
                    }
                }), K.onReject(s), z(), Y()
        }
    }, q[24] = Y, q[25] = z, q[26] = $, q[27] = K, q[28] = I;
    else I = q[28];
    let g = I,
        B;
    if (q[29] !== Y || q[30] !== z || q[31] !== K) B = () => {
        AW({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
                language_name: "none",
                message_id: K.assistantMessage.message.id,
                platform: Q8.platform
            }
        }), K.onReject(), z(), Y()
    }, q[29] = Y, q[30] = z, q[31] = K, q[32] = B;
    else B = q[32];
    let b = B,
        p = `Use skill "${$}"?`,
        Q;
    if (q[33] === Symbol.for("react.memo_cache_sentinel")) Q = UN.default.createElement(T, null, "Claude may use instructions, code, or files from this Skill."), q[33] = Q;
    else Q = q[33];
    let U = H?.description,
        r;
    if (q[34] !== U) r = UN.default.createElement(m, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, UN.default.createElement(T, {
        dimColor: !0
    }, U)), q[34] = U, q[35] = r;
    else r = q[35];
    let e;
    if (q[36] !== K.permissionResult) e = UN.default.createElement(lh, {
        permissionResult: K.permissionResult,
        toolType: "tool"
    }), q[36] = K.permissionResult, q[37] = e;
    else e = q[37];
    let Y6;
    if (q[38] !== b || q[39] !== g || q[40] !== V || q[41] !== u) Y6 = UN.default.createElement(NI1, {
        options: V,
        onSelect: g,
        onCancel: b,
        toolAnalyticsContext: u
    }), q[38] = b, q[39] = g, q[40] = V, q[41] = u, q[42] = Y6;
    else Y6 = q[42];
    let H6;
    if (q[43] !== e || q[44] !== Y6) H6 = UN.default.createElement(m, {
        flexDirection: "column"
    }, e, Y6), q[43] = e, q[44] = Y6, q[45] = H6;
    else H6 = q[45];
    let J6;
    if (q[46] !== p || q[47] !== r || q[48] !== H6 || q[49] !== _) J6 = UN.default.createElement(cz, {
        title: p,
        workerBadge: _
    }, Q, r, H6), q[46] = p, q[47] = r, q[48] = H6, q[49] = _, q[50] = J6;
    else J6 = q[50];
    return J6
}
// @from(Ln 490478, Col 0)
function KWz(A) {
    let q = m66.inputSchema.safeParse(A);
    if (!q.success) return _6(Error(`Failed to parse skill tool input: ${q.error.message}`)), "";
    return q.data.skill
}
// @from(Ln 490483, Col 4)
UN
// @from(Ln 490484, Col 4)
oCq = E(() => {
    e6();
    i6();
    NZ();
    GV6();
    d3();
    T1();
    fV6();
    H26();
    EV1();
    k1();
    gs8();
    o$();
    Km();
    UN = t(P6(), 1)
})
// @from(Ln 490501, Col 0)
function YWz(A, q) {
    switch (q.type) {
        case "next-question":
            return {
                ...A, currentQuestionIndex: A.currentQuestionIndex + 1, isInTextInput: !1
            };
        case "prev-question":
            return {
                ...A, currentQuestionIndex: Math.max(0, A.currentQuestionIndex - 1), isInTextInput: !1
            };
        case "update-question-state": {
            let K = A.questionStates[q.questionText],
                Y = {
                    selectedValue: q.updates.selectedValue ?? K?.selectedValue ?? (q.isMultiSelect ? [] : void 0),
                    textInputValue: q.updates.textInputValue ?? K?.textInputValue ?? ""
                };
            return {
                ...A,
                questionStates: {
                    ...A.questionStates,
                    [q.questionText]: Y
                }
            }
        }
        case "set-answer": {
            let K = {
                ...A,
                answers: {
                    ...A.answers,
                    [q.questionText]: q.answer
                }
            };
            if (q.shouldAdvance) return {
                ...K,
                currentQuestionIndex: K.currentQuestionIndex + 1,
                isInTextInput: !1
            };
            return K
        }
        case "set-text-input-mode":
            return {
                ...A, isInTextInput: q.isInInput
            }
    }
}
// @from(Ln 490547, Col 0)
function aCq() {
    let [A, q] = D86.useReducer(YWz, zWz), K = D86.useCallback(() => {
        q({
            type: "next-question"
        })
    }, []), Y = D86.useCallback(() => {
        q({
            type: "prev-question"
        })
    }, []), z = D86.useCallback((O, $, H) => {
        q({
            type: "update-question-state",
            questionText: O,
            updates: $,
            isMultiSelect: H
        })
    }, []), _ = D86.useCallback((O, $, H = !0) => {
        q({
            type: "set-answer",
            questionText: O,
            answer: $,
            shouldAdvance: H
        })
    }, []), w = D86.useCallback((O) => {
        q({
            type: "set-text-input-mode",
            isInInput: O
        })
    }, []);
    return {
        currentQuestionIndex: A.currentQuestionIndex,
        answers: A.answers,
        questionStates: A.questionStates,
        isInTextInput: A.isInTextInput,
        nextQuestion: K,
        prevQuestion: Y,
        updateQuestionState: z,
        setAnswer: _,
        setTextInputMode: w
    }
}
// @from(Ln 490588, Col 4)
D86
// @from(Ln 490588, Col 9)
zWz
// @from(Ln 490589, Col 4)
sCq = E(() => {
    D86 = t(P6(), 1);
    zWz = {
        currentQuestionIndex: 0,
        answers: {},
        questionStates: {},
        isInTextInput: !1
    }
})
// @from(Ln 490599, Col 0)
function kV6(A) {
    let q = A6(39),
        {
            questions: K,
            currentQuestionIndex: Y,
            answers: z,
            hideSubmitTab: _
        } = A,
        w = _ === void 0 ? !1 : _,
        {
            columns: O
        } = KA(),
        $;
    if (q[0] !== O || q[1] !== Y || q[2] !== w || q[3] !== K) {
        A: {
            let W = w ? "" : ` ${a6.tick} Submit `,
                Z = f8("← ") + f8(" →") + f8(W),
                G = O - Z;
            if (G <= 0) {
                let B;
                if (q[5] !== Y || q[6] !== K) {
                    let b;
                    if (q[8] !== Y) b = (p, Q) => {
                        let U = p?.header || `Q${Q+1}`;
                        return Q === Y ? U.slice(0, 3) : ""
                    }, q[8] = Y, q[9] = b;
                    else b = q[9];
                    B = K.map(b), q[5] = Y, q[6] = K, q[7] = B
                } else B = q[7];
                $ = B;
                break A
            }
            let f = K.map(OWz);
            if (f.map(wWz).reduce(_Wz, 0) <= G) {
                $ = f;
                break A
            }
            let V = f[Y] || "",
                L = 4 + f8(V),
                h = Math.min(L, G / 2),
                R = G - h,
                u = K.length - 1,
                I = Math.max(6, Math.floor(R / Math.max(u, 1))),
                g;
            if (q[10] !== Y || q[11] !== h || q[12] !== I) g = (B, b) => {
                if (b === Y) {
                    let p = h - 2 - 2;
                    return jq(B, p)
                } else {
                    let p = I - 2 - 2;
                    return jq(B, p)
                }
            },
            q[10] = Y,
            q[11] = h,
            q[12] = I,
            q[13] = g;
            else g = q[13];$ = f.map(g)
        }
        q[0] = O,
        q[1] = Y,
        q[2] = w,
        q[3] = K,
        q[4] = $
    }
    else $ = q[4];
    let H = $,
        j = K.length === 1 && w,
        J;
    if (q[14] !== Y || q[15] !== j) J = !j && FF.default.createElement(T, {
        color: Y === 0 ? "inactive" : void 0
    }, "←", " "), q[14] = Y, q[15] = j, q[16] = J;
    else J = q[16];
    let M;
    if (q[17] !== z || q[18] !== Y || q[19] !== K || q[20] !== H) {
        let W;
        if (q[22] !== z || q[23] !== Y || q[24] !== H) W = (Z, G) => {
            let f = G === Y,
                N = Z?.question && !!z[Z.question] ? a6.checkboxOn : a6.checkboxOff,
                V = H[G] || Z?.header || `Q${G+1}`;
            return FF.default.createElement(m, {
                key: Z?.question || `question-${G}`
            }, f ? FF.default.createElement(T, {
                backgroundColor: "permission",
                color: "inverseText"
            }, " ", N, " ", V, " ") : FF.default.createElement(T, null, " ", N, " ", V, " "))
        }, q[22] = z, q[23] = Y, q[24] = H, q[25] = W;
        else W = q[25];
        M = K.map(W), q[17] = z, q[18] = Y, q[19] = K, q[20] = H, q[21] = M
    } else M = q[21];
    let D;
    if (q[26] !== Y || q[27] !== w || q[28] !== K.length) D = !w && FF.default.createElement(m, {
        key: "submit"
    }, Y === K.length ? FF.default.createElement(T, {
        backgroundColor: "permission",
        color: "inverseText"
    }, " ", a6.tick, " Submit", " ") : FF.default.createElement(T, null, " ", a6.tick, " Submit ")), q[26] = Y, q[27] = w, q[28] = K.length, q[29] = D;
    else D = q[29];
    let X;
    if (q[30] !== Y || q[31] !== j || q[32] !== K.length) X = !j && FF.default.createElement(T, {
        color: Y === K.length ? "inactive" : void 0
    }, " ", "→"), q[30] = Y, q[31] = j, q[32] = K.length, q[33] = X;
    else X = q[33];
    let P;
    if (q[34] !== J || q[35] !== M || q[36] !== D || q[37] !== X) P = FF.default.createElement(m, {
        flexDirection: "row",
        marginBottom: 1
    }, J, M, D, X), q[34] = J, q[35] = M, q[36] = D, q[37] = X, q[38] = P;
    else P = q[38];
    return P
}
// @from(Ln 490711, Col 0)
function _Wz(A, q) {
    return A + q
}
// @from(Ln 490715, Col 0)
function wWz(A) {
    return 4 + f8(A)
}
// @from(Ln 490719, Col 0)
function OWz(A, q) {
    return A?.header || `Q${q+1}`
}
// @from(Ln 490722, Col 4)
FF
// @from(Ln 490723, Col 4)
yI1 = E(() => {
    e6();
    b7();
    i6();
    _q();
    q3();
    M4();
    FF = t(P6(), 1)
})
// @from(Ln 490733, Col 0)
function tCq(A) {
    let q = A6(34),
        {
            content: K,
            maxLines: Y,
            minHeight: z,
            minWidth: _,
            maxWidth: w
        } = A,
        O = _ === void 0 ? 40 : _,
        {
            columns: $
        } = KA(),
        [H] = z7(),
        J = Kj().syntaxHighlightingDisabled ?? !1,
        M = w ?? $ - 4,
        D = Y ?? 20,
        X;
    if (q[0] !== K || q[1] !== J || q[2] !== H) X = $Z1(K, H, J), q[0] = K, q[1] = J, q[2] = H, q[3] = X;
    else X = q[3];
    let P = X,
        W, Z, G, f, v, N;
    if (q[4] !== D || q[5] !== M || q[6] !== z || q[7] !== O || q[8] !== P) {
        let R = P.split(`
`),
            u = R.length > D,
            I = u ? R.slice(0, D) : R,
            g = Math.min(z ?? 0, D),
            B = Math.max(0, g - I.length - (u ? 1 : 0)),
            b = B > 0 ? [...I, ...Array(B).fill("")] : I,
            p = Math.max(O, ...b.map($Wz)),
            Q = Math.min(p + 4, M),
            U = Q - 4,
            r;
        if (q[15] !== Q) r = BE.horizontal.repeat(Q - 2), q[15] = Q, q[16] = r;
        else r = q[16];
        let e = `${BE.topLeft}${r}${BE.topRight}`,
            Y6;
        if (q[17] !== Q) Y6 = BE.horizontal.repeat(Q - 2), q[17] = Q, q[18] = Y6;
        else Y6 = q[18];
        if (Z = `${BE.bottomLeft}${Y6}${BE.bottomRight}`, N = u ? (() => {
                let J6 = R.length - D,
                    K6 = `${BE.horizontal.repeat(3)} ✂ ${BE.horizontal.repeat(3)} ${J6} lines hidden `,
                    s = f8(K6),
                    X6 = Math.max(0, Q - 2 - s);
                return `${BE.teeLeft}${K6}${BE.horizontal.repeat(X6)}${BE.teeRight}`
            })() : null, W = m, G = "column", q[19] !== e) f = pi.default.createElement(T, {
            dimColor: !0
        }, e), q[19] = e, q[20] = f;
        else f = q[20];
        let H6;
        if (q[21] !== U) H6 = (J6, K6) => {
            let X6 = f8(J6) > U ? Xk(J6, 0, U) : J6,
                z6 = " ".repeat(Math.max(0, U - f8(X6)));
            return pi.default.createElement(m, {
                key: K6,
                flexDirection: "row"
            }, pi.default.createElement(T, {
                dimColor: !0
            }, BE.vertical, " "), pi.default.createElement(wK, null, X6), pi.default.createElement(T, {
                dimColor: !0
            }, z6, " ", BE.vertical))
        }, q[21] = U, q[22] = H6;
        else H6 = q[22];
        v = b.map(H6), q[4] = D, q[5] = M, q[6] = z, q[7] = O, q[8] = P, q[9] = W, q[10] = Z, q[11] = G, q[12] = f, q[13] = v, q[14] = N
    } else W = q[9], Z = q[10], G = q[11], f = q[12], v = q[13], N = q[14];
    let V;
    if (q[23] !== N) V = N && pi.default.createElement(T, {
        color: "warning"
    }, N), q[23] = N, q[24] = V;
    else V = q[24];
    let L;
    if (q[25] !== Z) L = pi.default.createElement(T, {
        dimColor: !0
    }, Z), q[25] = Z, q[26] = L;
    else L = q[26];
    let h;
    if (q[27] !== W || q[28] !== G || q[29] !== f || q[30] !== v || q[31] !== V || q[32] !== L) h = pi.default.createElement(W, {
        flexDirection: G
    }, f, v, V, L), q[27] = W, q[28] = G, q[29] = f, q[30] = v, q[31] = V, q[32] = L, q[33] = h;
    else h = q[33];
    return h
}
// @from(Ln 490817, Col 0)
function $Wz(A) {
    return f8(A)
}
// @from(Ln 490820, Col 4)
pi
// @from(Ln 490820, Col 8)
BE
// @from(Ln 490821, Col 4)
eCq = E(() => {
    e6();
    i6();
    _q();
    nI();
    q3();
    CQ6();
    XX6();
    pi = t(P6(), 1), BE = {
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
// @from(Ln 490841, Col 0)
function AIq({
    question: A,
    questions: q,
    currentQuestionIndex: K,
    answers: Y,
    questionStates: z,
    hideSubmitTab: _ = !1,
    minContentHeight: w,
    minContentWidth: O,
    onUpdateQuestionState: $,
    onAnswer: H,
    onTextInputFocus: j,
    onCancel: J,
    onTabPrev: M,
    onTabNext: D,
    onRespondToClaude: X,
    onFinishPlanInterview: P
}) {
    let W = M1((i) => i.toolPermissionContext.mode) === "plan",
        [Z, G] = AK.useState(!1),
        [f, v] = AK.useState(0),
        [N, V] = AK.useState(!1),
        [L, h] = AK.useState(0),
        R = vh(),
        u = R ? Y$(R) : null,
        I = A.question,
        g = z[I],
        B = A.options,
        [b, p] = AK.useState(0),
        Q = AK.useRef(I);
    if (Q.current !== I) {
        Q.current = I;
        let i = g?.selectedValue,
            l = i ? B.findIndex((q6) => q6.label === i) : -1;
        p(l >= 0 ? l : 0)
    }
    let U = B[b],
        r = g?.selectedValue,
        e = g?.textInputValue || "",
        Y6 = AK.useCallback((i) => {
            let l = B[i];
            if (!l) return;
            p(i), $(I, {
                selectedValue: l.label
            }, !1), H(I, l.label)
        }, [B, I, $, H]),
        H6 = AK.useCallback((i) => {
            if (N) return;
            let l;
            if (typeof i === "number") l = i;
            else if (i === "up") l = b > 0 ? b - 1 : b;
            else l = b < B.length - 1 ? b + 1 : b;
            if (l >= 0 && l < B.length) p(l)
        }, [b, B.length, N]);
    D8("chat:externalEditor", async () => {
        let i = g?.textInputValue || "",
            l = await NN(i);
        if (l.content !== null && l.content !== i) $(I, {
            textInputValue: l.content
        }, !1)
    }, {
        context: "Chat",
        isActive: N && !!R
    }), tA({
        "tabs:previous": () => M?.(),
        "tabs:next": () => D?.()
    }, {
        context: "Tabs",
        isActive: !N && !Z
    });
    let J6 = AK.useCallback(() => {
            if (V(!1), j(!1), r) H(I, r)
        }, [r, I, H, j]),
        K6 = AK.useCallback(() => {
            G(!0)
        }, []),
        s = AK.useCallback(() => {
            G(!1)
        }, []);
    jA((i, l) => {
        if (Z) {
            if (l.upArrow || l.ctrl && i === "p") {
                if (f === 0) s();
                else v(0);
                return
            }
            if (l.downArrow || l.ctrl && i === "n") {
                if (W && f === 0) v(1);
                return
            }
            if (l.return) {
                if (f === 0) X();
                else P();
                return
            }
            if (l.escape) J();
            return
        }
        if (N) {
            if (l.escape) J6();
            return
        }
        if (l.upArrow || l.ctrl && i === "p") {
            if (b > 0) H6("up")
        } else if (l.downArrow || l.ctrl && i === "n")
            if (b === B.length - 1) K6();
            else H6("down");
        else if (l.return) Y6(b);
        else if (i === "n" && !l.ctrl && !l.meta) V(!0), j(!0);
        else if (l.escape) J();
        else if (i >= "1" && i <= "9") {
            let q6 = parseInt(i, 10) - 1;
            if (q6 < B.length) H6(q6)
        }
    });
    let X6 = U?.preview || null,
        z6 = 30,
        N6 = 4,
        {
            columns: $6
        } = KA(),
        n = $6 - z6 - N6,
        o = 11,
        a = AK.useMemo(() => {
            return w ? Math.max(1, w - o) : void 0
        }, [w]);
    return AK.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, AK.default.createElement(DD, {
        dividerColor: "inactive"
    }), AK.default.createElement(m, {
        flexDirection: "column",
        paddingTop: 0
    }, AK.default.createElement(kV6, {
        questions: q,
        currentQuestionIndex: K,
        answers: Y,
        hideSubmitTab: _
    }), AK.default.createElement(be, {
        title: A.question,
        color: "text"
    }), AK.default.createElement(m, {
        flexDirection: "column",
        minHeight: w
    }, AK.default.createElement(m, {
        marginTop: 1,
        flexDirection: "row",
        gap: 4
    }, AK.default.createElement(m, {
        flexDirection: "column",
        width: 30
    }, B.map((i, l) => {
        let q6 = b === l,
            w6 = r === i.label;
        return AK.default.createElement(m, {
            key: i.label,
            flexDirection: "row"
        }, q6 ? AK.default.createElement(T, {
            color: "suggestion"
        }, a6.pointer) : AK.default.createElement(T, null, " "), AK.default.createElement(T, {
            dimColor: !0
        }, " ", l + 1, "."), AK.default.createElement(T, {
            color: w6 ? "success" : q6 ? "suggestion" : void 0,
            bold: q6
        }, " ", i.label), w6 && AK.default.createElement(T, {
            color: "success"
        }, " ", a6.tick))
    })), AK.default.createElement(m, {
        flexDirection: "column",
        flexGrow: 1
    }, AK.default.createElement(tCq, {
        content: X6 || "No preview available",
        maxLines: a,
        minWidth: O,
        maxWidth: n
    }), AK.default.createElement(m, {
        marginTop: 1,
        flexDirection: "row",
        gap: 1
    }, AK.default.createElement(T, {
        color: "suggestion"
    }, "Notes:"), N ? AK.default.createElement(J5, {
        value: e,
        placeholder: "Add notes on this design…",
        onChange: (i) => {
            $(I, {
                textInputValue: i
            }, !1)
        },
        onSubmit: J6,
        onExit: J6,
        focus: !0,
        showCursor: !0,
        columns: 60,
        cursorOffset: L,
        onChangeCursorOffset: h
    }) : AK.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, e || "press n to add notes")))), AK.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, AK.default.createElement(DD, {
        dividerColor: "inactive"
    }), AK.default.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, Z && f === 0 ? AK.default.createElement(T, {
        color: "suggestion"
    }, a6.pointer) : AK.default.createElement(T, null, " "), AK.default.createElement(T, {
        color: Z && f === 0 ? "suggestion" : void 0
    }, "Chat about this")), W && AK.default.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, Z && f === 1 ? AK.default.createElement(T, {
        color: "suggestion"
    }, a6.pointer) : AK.default.createElement(T, null, " "), AK.default.createElement(T, {
        color: Z && f === 1 ? "suggestion" : void 0
    }, "Skip interview and plan immediately"))), AK.default.createElement(m, {
        marginTop: 1
    }, AK.default.createElement(T, {
        color: "inactive",
        dimColor: !0
    }, "Enter to select · ", a6.arrowUp, "/", a6.arrowDown, " to navigate · n to add notes", q.length > 1 && AK.default.createElement(AK.default.Fragment, null, " · Tab to switch questions"), N && u && AK.default.createElement(AK.default.Fragment, null, " · ctrl+g to edit in ", u), " ", "· Esc to cancel")))))
}
// @from(Ln 491067, Col 4)
AK
// @from(Ln 491068, Col 4)
qIq = E(() => {
    b7();
    i6();
    AH();
    NU6();
    yI1();
    C16();
    eCq();
    NA();
    VE();
    ll();
    Sw();
    _7();
    _q();
    AK = t(P6(), 1)
})