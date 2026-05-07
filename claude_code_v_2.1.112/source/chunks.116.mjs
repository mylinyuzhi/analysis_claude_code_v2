
// @from(Ln 288985, Col 4)
nd4 = L(() => {
    CP();
    yB1();
    H36 = K6(P6(), 1)
})
// @from(Ln 288991, Col 0)
function J36(q) {
    let K = s(54),
        {
            isDisabled: _,
            visibleOptionCount: z,
            options: Y,
            defaultValue: A,
            onCancel: O,
            onChange: w,
            onFocus: $,
            focusValue: j,
            submitButtonText: H,
            onSubmit: J,
            onDownFromLastItem: X,
            onUpFromFirstItem: M,
            initialFocusLast: P,
            onOpenEditor: W,
            hideIndexes: D,
            onImagePaste: Z,
            pastedContents: G,
            onRemoveImage: f
        } = q,
        v = _ === void 0 ? !1 : _,
        V = z === void 0 ? 5 : z,
        k;
    if (K[0] !== A) k = A === void 0 ? [] : A, K[0] = A, K[1] = k;
    else k = K[1];
    let N = k,
        R = D === void 0 ? !1 : D,
        h;
    if (K[2] !== N || K[3] !== j || K[4] !== R || K[5] !== P || K[6] !== v || K[7] !== O || K[8] !== w || K[9] !== X || K[10] !== $ || K[11] !== J || K[12] !== M || K[13] !== Y || K[14] !== H || K[15] !== V) h = {
        isDisabled: v,
        visibleOptionCount: V,
        options: Y,
        defaultValue: N,
        onChange: w,
        onCancel: O,
        onFocus: $,
        focusValue: j,
        submitButtonText: H,
        onSubmit: J,
        onDownFromLastItem: X,
        onUpFromFirstItem: M,
        initialFocusLast: P,
        hideIndexes: R
    }, K[2] = N, K[3] = j, K[4] = R, K[5] = P, K[6] = v, K[7] = O, K[8] = w, K[9] = X, K[10] = $, K[11] = J, K[12] = M, K[13] = Y, K[14] = H, K[15] = V, K[16] = h;
    else h = K[16];
    let C = ld4(h),
        x = oP.useRef(null),
        B, m;
    if (K[17] !== v) B = () => {
        if (!v && x.current) cE(x.current).focus(x.current)
    }, m = [v], K[17] = v, K[18] = B, K[19] = m;
    else B = K[18], m = K[19];
    oP.useEffect(B, m);
    let S, F, U, g, c, n, l;
    if (K[20] !== R || K[21] !== v || K[22] !== O || K[23] !== Z || K[24] !== W || K[25] !== f || K[26] !== Y.length || K[27] !== G || K[28] !== C) {
        let i = Y.length.toString().length;
        if (F = u, g = "column", c = x, K[36] !== v || K[37] !== C.handleKeyDown) n = v ? {} : {
            tabIndex: 0,
            onKeyDown: C.handleKeyDown
        }, K[36] = v, K[37] = C.handleKeyDown, K[38] = n;
        else n = K[38];
        S = u, l = "column", U = C.visibleOptions.map((O6, J6) => {
            let $6 = !v && C.focusedValue === O6.value && !C.isSubmitFocused,
                H6 = C.selectedValues.includes(O6.value),
                q6 = O6.index === C.visibleFromIndex,
                o = O6.index === C.visibleToIndex - 1,
                _6 = C.visibleToIndex < Y.length,
                r = C.visibleFromIndex > 0,
                t = C.visibleFromIndex + J6 + 1;
            if (O6.type === "input") {
                let Y6 = C.inputValues.get(O6.value) || "";
                return oP.default.createElement(u, {
                    key: String(O6.value),
                    gap: 1
                }, oP.default.createElement(uE6, {
                    option: O6,
                    isFocused: $6,
                    isSelected: !1,
                    shouldShowDownArrow: _6 && o,
                    shouldShowUpArrow: r && q6,
                    maxIndexWidth: i,
                    index: t,
                    inputValue: Y6,
                    onInputChange: (X6) => {
                        C.updateInputValue(O6.value, X6)
                    },
                    onSubmit: oNz,
                    onExit: () => {
                        O()
                    },
                    layout: "compact",
                    onOpenEditor: W,
                    onImagePaste: Z,
                    pastedContents: G,
                    onRemoveImage: f
                }, oP.default.createElement(T, {
                    color: H6 ? "success" : void 0
                }, "[", H6 ? e6.tick : " ", "]", " ")))
            }
            return oP.default.createElement(u, {
                key: String(O6.value),
                gap: 1
            }, oP.default.createElement(r46, {
                isFocused: $6,
                isSelected: !1,
                shouldShowDownArrow: _6 && o,
                shouldShowUpArrow: r && q6,
                description: O6.description
            }, !R && oP.default.createElement(T, {
                dimColor: !0
            }, `${t}.`.padEnd(i)), oP.default.createElement(T, {
                color: H6 ? "success" : void 0
            }, "[", H6 ? e6.tick : " ", "]"), oP.default.createElement(T, {
                color: $6 ? "suggestion" : void 0
            }, O6.label)))
        }), K[20] = R, K[21] = v, K[22] = O, K[23] = Z, K[24] = W, K[25] = f, K[26] = Y.length, K[27] = G, K[28] = C, K[29] = S, K[30] = F, K[31] = U, K[32] = g, K[33] = c, K[34] = n, K[35] = l
    } else S = K[29], F = K[30], U = K[31], g = K[32], c = K[33], n = K[34], l = K[35];
    let z6;
    if (K[39] !== S || K[40] !== U || K[41] !== l) z6 = oP.default.createElement(S, {
        flexDirection: l
    }, U), K[39] = S, K[40] = U, K[41] = l, K[42] = z6;
    else z6 = K[42];
    let A6;
    if (K[43] !== J || K[44] !== C.isSubmitFocused || K[45] !== H) A6 = H && J && oP.default.createElement(u, {
        marginTop: 0,
        gap: 1
    }, C.isSubmitFocused ? oP.default.createElement(T, {
        color: "suggestion"
    }, e6.pointer) : oP.default.createElement(T, null, " "), oP.default.createElement(u, {
        marginLeft: 3
    }, oP.default.createElement(T, {
        color: C.isSubmitFocused ? "suggestion" : void 0,
        bold: !0
    }, H))), K[43] = J, K[44] = C.isSubmitFocused, K[45] = H, K[46] = A6;
    else A6 = K[46];
    let e;
    if (K[47] !== F || K[48] !== g || K[49] !== c || K[50] !== n || K[51] !== z6 || K[52] !== A6) e = oP.default.createElement(F, {
        flexDirection: g,
        ref: c,
        ...n
    }, z6, A6), K[47] = F, K[48] = g, K[49] = c, K[50] = n, K[51] = z6, K[52] = A6, K[53] = e;
    else e = K[53];
    return e
}
// @from(Ln 289138, Col 0)
function oNz() {}
// @from(Ln 289139, Col 4)
oP
// @from(Ln 289140, Col 4)
H78 = L(() => {
    o6();
    Qq();
    lB();
    g6();
    NB1();
    sy8();
    nd4();
    oP = K6(P6(), 1)
})
// @from(Ln 289150, Col 4)
g_ = L(() => {
    H78();
    gK()
})
// @from(Ln 289155, Col 0)
function X36(q) {
    let K = s(13),
        {
            title: _,
            subtitle: z,
            color: Y,
            workerBadge: A
        } = q,
        O = Y === void 0 ? "permission" : Y,
        w;
    if (K[0] !== O || K[1] !== _) w = wF.createElement(T, {
        bold: !0,
        color: O
    }, _), K[0] = O, K[1] = _, K[2] = w;
    else w = K[2];
    let $;
    if (K[3] !== A) $ = A && wF.createElement(T, {
        dimColor: !0
    }, "· ", "@", A.name), K[3] = A, K[4] = $;
    else $ = K[4];
    let j;
    if (K[5] !== w || K[6] !== $) j = wF.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, w, $), K[5] = w, K[6] = $, K[7] = j;
    else j = K[7];
    let H;
    if (K[8] !== z) H = z != null && (typeof z === "string" ? wF.createElement(T, {
        dimColor: !0,
        wrap: "truncate-start"
    }, z) : z), K[8] = z, K[9] = H;
    else H = K[9];
    let J;
    if (K[10] !== j || K[11] !== H) J = wF.createElement(u, {
        flexDirection: "column"
    }, j, H), K[10] = j, K[11] = H, K[12] = J;
    else J = K[12];
    return J
}
// @from(Ln 289194, Col 4)
wF
// @from(Ln 289195, Col 4)
J78 = L(() => {
    o6();
    g6();
    wF = K6(P6(), 1)
})
// @from(Ln 289201, Col 0)
function IY(q) {
    let K = s(15),
        {
            title: _,
            subtitle: z,
            color: Y,
            titleColor: A,
            innerPaddingX: O,
            workerBadge: w,
            titleRight: $,
            children: j
        } = q,
        H = Y === void 0 ? "permission" : Y,
        J = O === void 0 ? 1 : O,
        X;
    if (K[0] !== z || K[1] !== _ || K[2] !== A || K[3] !== w) X = $F.createElement(X36, {
        title: _,
        subtitle: z,
        color: A,
        workerBadge: w
    }), K[0] = z, K[1] = _, K[2] = A, K[3] = w, K[4] = X;
    else X = K[4];
    let M;
    if (K[5] !== X || K[6] !== $) M = $F.createElement(u, {
        paddingX: 1,
        flexDirection: "column"
    }, $F.createElement(u, {
        justifyContent: "space-between"
    }, X, $)), K[5] = X, K[6] = $, K[7] = M;
    else M = K[7];
    let P;
    if (K[8] !== j || K[9] !== J) P = $F.createElement(u, {
        flexDirection: "column",
        paddingX: J
    }, j), K[8] = j, K[9] = J, K[10] = P;
    else P = K[10];
    let W;
    if (K[11] !== H || K[12] !== M || K[13] !== P) W = $F.createElement(u, {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: H,
        borderLeft: !1,
        borderRight: !1,
        borderBottom: !1,
        marginTop: 1
    }, M, P), K[11] = H, K[12] = M, K[13] = P, K[14] = W;
    else W = K[14];
    return W
}
// @from(Ln 289250, Col 4)
$F
// @from(Ln 289251, Col 4)
pD = L(() => {
    o6();
    g6();
    J78();
    $F = K6(P6(), 1)
})
// @from(Ln 289258, Col 0)
function id4(q) {
    let K = q.toUpperCase();
    return aNz.has(K) || sNz.some((_) => K.startsWith(_))
}
// @from(Ln 289262, Col 4)
aNz
// @from(Ln 289262, Col 9)
sNz
// @from(Ln 289262, Col 14)
rd4
// @from(Ln 289262, Col 19)
BR6
// @from(Ln 289263, Col 4)
fu8 = L(() => {
    aNz = new Set(["CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST", "CLAUDE_CODE_USE_BEDROCK", "CLAUDE_CODE_USE_VERTEX", "CLAUDE_CODE_USE_FOUNDRY", "CLAUDE_CODE_USE_ANTHROPIC_AWS", "CLAUDE_CODE_USE_MANTLE", "ANTHROPIC_BASE_URL", "ANTHROPIC_BEDROCK_BASE_URL", "ANTHROPIC_VERTEX_BASE_URL", "ANTHROPIC_FOUNDRY_BASE_URL", "ANTHROPIC_AWS_BASE_URL", "ANTHROPIC_BEDROCK_MANTLE_BASE_URL", "ANTHROPIC_FOUNDRY_RESOURCE", "ANTHROPIC_VERTEX_PROJECT_ID", "ANTHROPIC_AWS_WORKSPACE_ID", "CLOUD_ML_REGION", "ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN", "CLAUDE_CODE_OAUTH_TOKEN", "AWS_BEARER_TOKEN_BEDROCK", "ANTHROPIC_FOUNDRY_API_KEY", "ANTHROPIC_AWS_API_KEY", "ANTHROPIC_BEDROCK_MANTLE_API_KEY", "CLAUDE_CODE_SKIP_BEDROCK_AUTH", "CLAUDE_CODE_SKIP_VERTEX_AUTH", "CLAUDE_CODE_SKIP_FOUNDRY_AUTH", "CLAUDE_CODE_SKIP_ANTHROPIC_AWS_AUTH", "CLAUDE_CODE_SKIP_MANTLE_AUTH", "ANTHROPIC_MODEL", "ANTHROPIC_DEFAULT_HAIKU_MODEL", "ANTHROPIC_DEFAULT_HAIKU_MODEL_DESCRIPTION", "ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME", "ANTHROPIC_DEFAULT_HAIKU_MODEL_SUPPORTED_CAPABILITIES", "ANTHROPIC_DEFAULT_OPUS_MODEL", "ANTHROPIC_DEFAULT_OPUS_MODEL_DESCRIPTION", "ANTHROPIC_DEFAULT_OPUS_MODEL_NAME", "ANTHROPIC_DEFAULT_OPUS_MODEL_SUPPORTED_CAPABILITIES", "ANTHROPIC_DEFAULT_SONNET_MODEL", "ANTHROPIC_DEFAULT_SONNET_MODEL_DESCRIPTION", "ANTHROPIC_DEFAULT_SONNET_MODEL_NAME", "ANTHROPIC_DEFAULT_SONNET_MODEL_SUPPORTED_CAPABILITIES", "ANTHROPIC_SMALL_FAST_MODEL", "ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION", "CLAUDE_CODE_SUBAGENT_MODEL", "CLAUDE_CODE_CERT_STORE"]), sNz = ["VERTEX_REGION_CLAUDE_"];
    rd4 = ["apiKeyHelper", "awsAuthRefresh", "awsCredentialExport", "fileSuggestion", "gcpAuthRefresh", "otelHeadersHelper", "proxyAuthHelper", "statusLine"], BR6 = new Set(["ANTHROPIC_CUSTOM_HEADERS", "ANTHROPIC_CUSTOM_MODEL_OPTION", "ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION", "ANTHROPIC_CUSTOM_MODEL_OPTION_NAME", "ANTHROPIC_CUSTOM_MODEL_OPTION_SUPPORTED_CAPABILITIES", "ANTHROPIC_DEFAULT_HAIKU_MODEL", "ANTHROPIC_DEFAULT_HAIKU_MODEL_DESCRIPTION", "ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME", "ANTHROPIC_DEFAULT_HAIKU_MODEL_SUPPORTED_CAPABILITIES", "ANTHROPIC_DEFAULT_OPUS_MODEL", "ANTHROPIC_DEFAULT_OPUS_MODEL_DESCRIPTION", "ANTHROPIC_DEFAULT_OPUS_MODEL_NAME", "ANTHROPIC_DEFAULT_OPUS_MODEL_SUPPORTED_CAPABILITIES", "ANTHROPIC_DEFAULT_SONNET_MODEL", "ANTHROPIC_DEFAULT_SONNET_MODEL_DESCRIPTION", "ANTHROPIC_DEFAULT_SONNET_MODEL_NAME", "ANTHROPIC_DEFAULT_SONNET_MODEL_SUPPORTED_CAPABILITIES", "ANTHROPIC_FOUNDRY_API_KEY", "ANTHROPIC_MODEL", "ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION", "ANTHROPIC_SMALL_FAST_MODEL", "AWS_DEFAULT_REGION", "AWS_PROFILE", "AWS_REGION", "BASH_DEFAULT_TIMEOUT_MS", "BASH_MAX_OUTPUT_LENGTH", "BASH_MAX_TIMEOUT_MS", "CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR", "CLAUDE_CODE_API_KEY_HELPER_TTL_MS", "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS", "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC", "CLAUDE_CODE_DISABLE_TERMINAL_TITLE", "CLAUDE_CODE_ENABLE_TELEMETRY", "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS", "CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL", "CLAUDE_CODE_MAX_OUTPUT_TOKENS", "CLAUDE_CODE_SKIP_BEDROCK_AUTH", "CLAUDE_CODE_SKIP_FOUNDRY_AUTH", "CLAUDE_CODE_SKIP_ANTHROPIC_AWS_AUTH", "CLAUDE_CODE_SKIP_MANTLE_AUTH", "CLAUDE_CODE_SKIP_VERTEX_AUTH", "CLAUDE_CODE_SUBAGENT_MODEL", "CLAUDE_CODE_USE_BEDROCK", "CLAUDE_CODE_USE_FOUNDRY", "CLAUDE_CODE_USE_ANTHROPIC_AWS", "CLAUDE_CODE_USE_MANTLE", "CLAUDE_CODE_USE_VERTEX", "DISABLE_AUTOUPDATER", "DISABLE_BUG_COMMAND", "DISABLE_COST_WARNINGS", "DISABLE_ERROR_REPORTING", "DISABLE_FEEDBACK_COMMAND", "DISABLE_INSTALLATION_CHECKS", "DISABLE_TELEMETRY", "ENABLE_TOOL_SEARCH", "MAX_MCP_OUTPUT_TOKENS", "MAX_THINKING_TOKENS", "MCP_TIMEOUT", "MCP_TOOL_TIMEOUT", "OTEL_EXPORTER_OTLP_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_PROTOCOL", "OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE", "OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY", "OTEL_EXPORTER_OTLP_METRICS_HEADERS", "OTEL_EXPORTER_OTLP_METRICS_PROTOCOL", "OTEL_EXPORTER_OTLP_PROTOCOL", "OTEL_EXPORTER_OTLP_TRACES_HEADERS", "OTEL_LOG_RAW_API_BODIES", "OTEL_LOG_TOOL_CONTENT", "OTEL_LOG_TOOL_DETAILS", "OTEL_LOG_USER_PROMPTS", "OTEL_LOGS_EXPORT_INTERVAL", "OTEL_LOGS_EXPORTER", "OTEL_METRIC_EXPORT_INTERVAL", "OTEL_METRICS_EXPORTER", "OTEL_METRICS_INCLUDE_ACCOUNT_UUID", "OTEL_METRICS_INCLUDE_SESSION_ID", "OTEL_METRICS_INCLUDE_VERSION", "OTEL_RESOURCE_ATTRIBUTES", "USE_BUILTIN_RIPGREP", "VERTEX_REGION_CLAUDE_3_5_HAIKU", "VERTEX_REGION_CLAUDE_3_5_SONNET", "VERTEX_REGION_CLAUDE_3_7_SONNET", "VERTEX_REGION_CLAUDE_4_0_OPUS", "VERTEX_REGION_CLAUDE_4_0_SONNET", "VERTEX_REGION_CLAUDE_4_1_OPUS", "VERTEX_REGION_CLAUDE_4_5_OPUS", "VERTEX_REGION_CLAUDE_4_6_OPUS", "VERTEX_REGION_CLAUDE_4_7_OPUS", "VERTEX_REGION_CLAUDE_4_5_SONNET", "VERTEX_REGION_CLAUDE_4_6_SONNET", "VERTEX_REGION_CLAUDE_HAIKU_4_5"])
})
// @from(Ln 289268, Col 0)
function pR6(q) {
    if (!q) return {
        shellSettings: {},
        envVars: {},
        hasHooks: !1
    };
    let K = {};
    for (let Y of rd4) {
        let A = q[Y],
            O;
        if (typeof A === "string") O = A;
        else if (A !== null && typeof A === "object" && "command" in A && typeof A.command === "string") O = A.command;
        if (O !== void 0 && O.length > 0) K[Y] = O
    }
    let _ = {};
    if (q.env && typeof q.env === "object") {
        for (let [Y, A] of Object.entries(q.env))
            if (typeof A === "string" && A.length > 0) {
                if (!BR6.has(Y.toUpperCase())) _[Y] = A
            }
    }
    let z = q.hooks !== void 0 && q.hooks !== null && typeof q.hooks === "object" && Object.keys(q.hooks).length > 0;
    return {
        shellSettings: K,
        envVars: _,
        hasHooks: z,
        hooks: z ? q.hooks : void 0
    }
}
// @from(Ln 289298, Col 0)
function Gu8(q) {
    return Object.keys(q.shellSettings).length > 0 || Object.keys(q.envVars).length > 0 || q.hasHooks
}
// @from(Ln 289302, Col 0)
function od4(q, K) {
    let _ = pR6(q),
        z = pR6(K);
    if (!Gu8(z)) return !1;
    if (!Gu8(_)) return !0;
    let Y = I6({
            shellSettings: _.shellSettings,
            envVars: _.envVars,
            hooks: _.hooks
        }),
        A = I6({
            shellSettings: z.shellSettings,
            envVars: z.envVars,
            hooks: z.hooks
        });
    return Y !== A
}
// @from(Ln 289320, Col 0)
function ad4(q) {
    let K = [];
    for (let _ of Object.keys(q.shellSettings)) K.push(_);
    for (let _ of Object.keys(q.envVars)) K.push(_);
    if (q.hasHooks) K.push("hooks");
    return K
}
// @from(Ln 289327, Col 4)
to1 = L(() => {
    fu8();
    e8()
})
// @from(Ln 289332, Col 0)
function sd4(q) {
    let K = s(26),
        {
            settings: _,
            onAccept: z,
            onReject: Y
        } = q,
        A = pR6(_),
        O = ad4(A),
        w = $3(),
        $;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) $ = {
        context: "Confirmation"
    }, K[0] = $;
    else $ = K[0];
    G1("confirm:no", Y, $);
    let j;
    if (K[1] !== z || K[2] !== Y) j = function(U) {
        if (U === "exit") {
            Y();
            return
        }
        z()
    }, K[1] = z, K[2] = Y, K[3] = j;
    else j = K[3];
    let H = j,
        J = IY,
        X = "warning",
        M = "warning",
        P = "Managed settings require approval",
        W = u,
        D = "column",
        Z = 1,
        G = 1,
        f;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) f = FD.default.createElement(T, null, "Your organization has configured managed settings that could allow execution of arbitrary code or interception of your prompts and responses."), K[4] = f;
    else f = K[4];
    let v = u,
        V = "column",
        k;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) k = FD.default.createElement(T, {
        dimColor: !0
    }, "Settings requiring approval:"), K[5] = k;
    else k = K[5];
    let N = O.map(tNz),
        R;
    if (K[6] !== v || K[7] !== k || K[8] !== N) R = FD.default.createElement(v, {
        flexDirection: V
    }, k, N), K[6] = v, K[7] = k, K[8] = N, K[9] = R;
    else R = K[9];
    let h;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) h = FD.default.createElement(T, null, "Only accept if you trust your organization's IT administration and expect these settings to be configured."), K[10] = h;
    else h = K[10];
    let C;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) C = [{
        label: "Yes, I trust these settings",
        value: "accept"
    }, {
        label: "No, exit Claude Code",
        value: "exit"
    }], K[11] = C;
    else C = K[11];
    let x;
    if (K[12] !== H) x = FD.default.createElement(A1, {
        options: C,
        onChange: (F) => H(F),
        onCancel: () => H("exit")
    }), K[12] = H, K[13] = x;
    else x = K[13];
    let B;
    if (K[14] !== w.keyName || K[15] !== w.pending) B = FD.default.createElement(T, {
        dimColor: !0
    }, w.pending ? FD.default.createElement(FD.default.Fragment, null, "Press ", w.keyName, " again to exit") : FD.default.createElement(z1, null, FD.default.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), FD.default.createElement(A8, {
        chord: "escape",
        action: "exit"
    }))), K[14] = w.keyName, K[15] = w.pending, K[16] = B;
    else B = K[16];
    let m;
    if (K[17] !== W || K[18] !== R || K[19] !== x || K[20] !== B || K[21] !== f) m = FD.default.createElement(W, {
        flexDirection: D,
        gap: Z,
        paddingTop: G
    }, f, R, h, x, B), K[17] = W, K[18] = R, K[19] = x, K[20] = B, K[21] = f, K[22] = m;
    else m = K[22];
    let S;
    if (K[23] !== J || K[24] !== m) S = FD.default.createElement(J, {
        color: X,
        titleColor: M,
        title: P
    }, m), K[23] = J, K[24] = m, K[25] = S;
    else S = K[25];
    return S
}
// @from(Ln 289429, Col 0)
function tNz(q, K) {
    return FD.default.createElement(u, {
        key: K,
        paddingLeft: 2
    }, FD.default.createElement(T, null, FD.default.createElement(T, {
        dimColor: !0
    }, "· "), FD.default.createElement(T, null, q)))
}
// @from(Ln 289437, Col 4)
FD
// @from(Ln 289438, Col 4)
td4 = L(() => {
    o6();
    C$();
    g6();
    C7();
    g_();
    Nq();
    u7();
    pD();
    to1();
    FD = K6(P6(), 1)
})
// @from(Ln 289451, Col 0)
function ed4(q) {
    let K = eNz[q.name],
        _ = {
            upArrow: K === "upArrow",
            downArrow: K === "downArrow",
            leftArrow: K === "leftArrow",
            rightArrow: K === "rightArrow",
            pageDown: K === "pageDown",
            pageUp: K === "pageUp",
            wheelUp: K === "wheelUp",
            wheelDown: K === "wheelDown",
            home: K === "home",
            end: K === "end",
            return: K === "return",
            escape: K === "escape",
            tab: K === "tab",
            backspace: K === "backspace",
            delete: K === "delete",
            ctrl: q.ctrl,
            shift: q.shift,
            fn: q.fn,
            super: q.superKey,
            meta: q.meta || K === "escape"
        };
    return {
        input: q.name === "enter" ? `
` : [...q.key].length === 1 ? q.key : "",
        key: _
    }
}
// @from(Ln 289481, Col 4)
eNz
// @from(Ln 289482, Col 4)
qc4 = L(() => {
    eNz = {
        up: "upArrow",
        down: "downArrow",
        left: "leftArrow",
        right: "rightArrow",
        pagedown: "pageDown",
        pageup: "pageUp",
        wheelup: "wheelUp",
        wheeldown: "wheelDown",
        home: "home",
        end: "end",
        return: "return",
        escape: "escape",
        tab: "tab",
        backspace: "backspace",
        delete: "delete"
    }
})
// @from(Ln 289502, Col 0)
function KEz(q, K) {
    let _ = s(5),
        {
            addNotification: z,
            removeNotification: Y
        } = EK(),
        A, O;
    if (_[0] !== z || _[1] !== Y || _[2] !== q) A = () => {
        if (q.length === 0) {
            Y("keybinding-config-warning");
            return
        }
        let w = w7(q, zEz),
            $ = w7(q, _Ez),
            j;
        if (w > 0 && $ > 0) j = `Found ${w} keybinding ${O7(w,"error")} and ${$} ${O7($,"warning")}`;
        else if (w > 0) j = `Found ${w} keybinding ${O7(w,"error")}`;
        else j = `Found ${$} keybinding ${O7($,"warning")}`;
        j = j + " · /doctor for details", z({
            key: "keybinding-config-warning",
            text: j,
            color: w > 0 ? "error" : "warning",
            priority: w > 0 ? "immediate" : "high",
            timeoutMs: 60000
        })
    }, O = [q, z, Y], _[0] = z, _[1] = Y, _[2] = q, _[3] = A, _[4] = O;
    else A = _[3], O = _[4];
    r2.useEffect(A, O)
}
// @from(Ln 289532, Col 0)
function _Ez(q) {
    return q.severity === "warning"
}
// @from(Ln 289536, Col 0)
function zEz(q) {
    return q.severity === "error"
}
// @from(Ln 289540, Col 0)
function TM({
    children: q
}) {
    let [{
        bindings: K,
        warnings: _
    }, z] = r2.useState(() => {
        let D = Ds6(RI);
        return E(`[keybindings] KeybindingSetup initialized with ${D.bindings.length} bindings, ${D.warnings.length} warnings`), D
    }), [Y, A] = r2.useState(!1);
    KEz(_, Y);
    let O = r2.useRef(null),
        [w, $] = r2.useState(null),
        j = r2.useRef(null),
        H = r2.useRef(new Map),
        J = r2.useRef(new Set),
        X = r2.useCallback((D) => {
            J.current.add(D)
        }, []),
        M = r2.useCallback((D) => {
            J.current.delete(D)
        }, []),
        P = r2.useCallback(() => {
            if (j.current) clearTimeout(j.current), j.current = null
        }, []),
        W = r2.useCallback((D) => {
            if (P(), D !== null) j.current = setTimeout((Z, G) => {
                E("[keybindings] Chord timeout - cancelling"), Z.current = null, G(null)
            }, qEz, O, $);
            O.current = D, $(D)
        }, [P]);
    return r2.useEffect(() => {
        tA4(RI);
        let D = RI.changed.subscribe((Z) => {
            A(!0), z(Z), E(`[keybindings] Reloaded: ${Z.bindings.length} bindings, ${Z.warnings.length} warnings`)
        });
        return () => {
            D(), P()
        }
    }, [P]), r2.default.createElement(Qy8, {
        bindings: K,
        pendingChordRef: O,
        pendingChord: w,
        setPendingChord: W,
        activeContexts: J.current,
        registerActiveContext: X,
        unregisterActiveContext: M,
        handlerRegistryRef: H
    }, r2.default.createElement(r2.default.Fragment, null, r2.default.createElement(YEz, {
        bindings: K,
        pendingChordRef: O,
        setPendingChord: W,
        activeContexts: J.current,
        handlerRegistryRef: H
    }), q))
}
// @from(Ln 289597, Col 0)
function YEz(q) {
    let K = s(23),
        {
            bindings: _,
            pendingChordRef: z,
            setPendingChord: Y,
            activeContexts: A,
            handlerRegistryRef: O,
            children: w
        } = q,
        $;
    if (K[0] !== A || K[1] !== _ || K[2] !== O || K[3] !== z || K[4] !== Y) $ = (k, N, R, h) => {
        let C = O.current,
            x = new Set;
        if (C)
            for (let U of C.values())
                for (let g of U) x.add(g.context);
        let B = [...x, ...A, "Global"],
            m = z.current !== null,
            S = Zs6(k, N, B, _, z.current);
        q: switch (S.type) {
            case "chord_started": {
                Y(S.pending), R();
                return
            }
            case "chord_cancelled": {
                Y(null), R();
                return
            }
            case "unbound": {
                if (Y(null), m) {
                    R();
                    return
                }
                break q
            }
            case "match": {
                if (Y(null), m) {
                    let U = C?.get(S.action);
                    if (U)
                        for (let g of U) {
                            g.handler(), R();
                            break
                        }
                    return
                }
                break q
            }
            case "none":
        }
        if (!h || !C) return;
        let F = new Map;
        for (let U of C.values())
            for (let g of U) {
                if (!g.singleKey) continue;
                let c = F.get(g.context);
                if (c === void 0) {
                    let n = Zs6(k, N, [...A, g.context, "Global"], _, null);
                    c = n.type === "match" ? n.action : null, F.set(g.context, c)
                }
                if (c === g.action) {
                    if (g.handler() !== !1) {
                        R();
                        return
                    }
                }
            }
    }, K[0] = A, K[1] = _, K[2] = O, K[3] = z, K[4] = Y, K[5] = $;
    else $ = K[5];
    let j = $,
        H;
    if (K[6] !== j || K[7] !== z) H = (k, N, R) => {
        if ((N.wheelUp || N.wheelDown) && z.current === null) return;
        j(k, N, () => R.stopImmediatePropagation(), !1)
    }, K[6] = j, K[7] = z, K[8] = H;
    else H = K[8];
    let J = H,
        X = AEz,
        M;
    if (K[9] !== j) M = (k) => {
        let {
            input: N,
            key: R
        } = ed4(k);
        j(N, R, () => X(k), !0)
    }, K[9] = j, K[10] = M;
    else M = K[10];
    let P = M,
        W;
    if (K[11] !== j) W = (k) => {
        let N = {
            upArrow: !1,
            downArrow: !1,
            leftArrow: !1,
            rightArrow: !1,
            pageDown: !1,
            pageUp: !1,
            wheelUp: k.deltaY < 0,
            wheelDown: k.deltaY > 0,
            home: !1,
            end: !1,
            return: !1,
            escape: !1,
            tab: !1,
            backspace: !1,
            delete: !1,
            ctrl: k.ctrl,
            shift: k.shift,
            meta: k.meta,
            fn: !1,
            super: !1
        };
        j("", N, () => X(k), !0)
    }, K[11] = j, K[12] = W;
    else W = K[12];
    let D = W,
        Z;
    if (K[13] !== J) Z = J, K[13] = J, K[14] = Z;
    else Z = K[14];
    XR(Z);
    let G = r2.useRef(null),
        f, v;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) f = () => {
        return
    }, v = [], K[15] = f, K[16] = v;
    else f = K[15], v = K[16];
    r2.useLayoutEffect(f, v);
    let V;
    if (K[21] !== w) V = r2.default.createElement(r2.default.Fragment, null, w), K[21] = w, K[22] = V;
    else V = K[22];
    return V
}
// @from(Ln 289730, Col 0)
function AEz(q) {
    q.preventDefault(), q.stopImmediatePropagation()
}
// @from(Ln 289733, Col 4)
r2
// @from(Ln 289733, Col 8)
qEz = 1000
// @from(Ln 289734, Col 4)
ql = L(() => {
    o6();
    kY();
    lB();
    g6();
    K8();
    qc4();
    jp();
    yd();
    fs6();
    r2 = K6(P6(), 1)
})
// @from(Ln 289746, Col 0)
class qa1 {
    queue = [];
    waiters = [];
    changed = l5();
    _revision = 0;
    get length() {
        return this.queue.length
    }
    get revision() {
        return this._revision
    }
    send(q) {
        this._revision++;
        let K = this.waiters.findIndex((_) => _.fn(q));
        if (K !== -1) {
            let _ = this.waiters.splice(K, 1)[0];
            if (_) {
                _.resolve(q), this.notify();
                return
            }
        }
        this.queue.push(q), this.notify()
    }
    poll(q = () => !0) {
        let K = this.queue.findIndex(q);
        if (K === -1) return;
        return this.queue.splice(K, 1)[0]
    }
    receive(q = () => !0) {
        let K = this.queue.findIndex(q);
        if (K !== -1) {
            let _ = this.queue.splice(K, 1)[0];
            if (_) return this.notify(), Promise.resolve(_)
        }
        return new Promise((_) => {
            this.waiters.push({
                fn: q,
                resolve: _
            })
        })
    }
    subscribe = this.changed.subscribe;
    notify() {
        this.changed.emit()
    }
}
// @from(Ln 289792, Col 4)
Kc4 = L(() => {
    nH()
})
// @from(Ln 289796, Col 0)
function zc4(q) {
    let K = s(3),
        {
            children: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = new qa1, K[0] = z;
    else z = K[0];
    let Y = z,
        A;
    if (K[1] !== _) A = FR6.default.createElement(_c4.Provider, {
        value: Y
    }, _), K[1] = _, K[2] = A;
    else A = K[2];
    return A
}
// @from(Ln 289813, Col 0)
function Yc4() {
    let q = FR6.useContext(_c4);
    if (!q) throw Error("useMailbox must be used within a MailboxProvider");
    return q
}
// @from(Ln 289818, Col 4)
FR6
// @from(Ln 289818, Col 9)
_c4
// @from(Ln 289819, Col 4)
Ka1 = L(() => {
    o6();
    Kc4();
    FR6 = K6(P6(), 1), _c4 = FR6.createContext(void 0)
})
// @from(Ln 289825, Col 0)
function gR6(q) {
    let K = vu8.useCallback((_) => {
        let z = y7();
        q(_, z)
    }, [q]);
    vu8.useEffect(() => _y.subscribe(K), [K])
}
// @from(Ln 289832, Col 4)
vu8
// @from(Ln 289833, Col 4)
Tu8 = L(() => {
    zK6();
    a1();
    vu8 = K6(P6(), 1)
})
// @from(Ln 289839, Col 0)
function UR6() {
    let q = process.env.CLAUDE_CODE_ENABLE_AWAY_SUMMARY;
    if (c5(q)) return !1;
    if (S6(q)) return !0;
    if (!u8("tengu_sedge_lantern", !0)) return !1;
    if (I7()) return !1;
    return v7()?.awaySummaryEnabled !== !1
}
// @from(Ln 289847, Col 0)
async function Vu8(q) {
    let K = XJ6();
    if (!K) return E("[awaySummary] no CacheSafeParams saved, skipping"), null;
    let _ = new AbortController;
    q.addEventListener("abort", () => _.abort(), {
        once: !0
    });
    try {
        let {
            messages: z
        } = await rP({
            promptMessages: [t8({
                content: OEz
            })],
            cacheSafeParams: K,
            overrides: {
                abortController: _
            },
            canUseTool: async () => ({
                behavior: "deny",
                message: "Away summary cannot use tools",
                decisionReason: {
                    type: "other",
                    reason: "away_summary"
                }
            }),
            querySource: "away_summary",
            forkLabel: "away_summary",
            maxTurns: 1,
            skipCacheWrite: !0,
            skipTranscript: !0
        });
        if (q.aborted) return null;
        return wEz(z) || null
    } catch (z) {
        if (q.aborted) return null;
        return E(`[awaySummary] generation failed: ${z}`), null
    }
}
// @from(Ln 289887, Col 0)
function wEz(q) {
    return q.flatMap((K) => K.type === "assistant" && !K.isApiErrorMessage ? K.message.content : []).filter((K) => K.type === "text").map((K) => ("text" in K) ? K.text : "").join("").trim()
}
// @from(Ln 289890, Col 4)
OEz = "The user stepped away and is coming back. Recap in under 40 words, 1-2 plain sentences, no markdown. Lead with the overall goal and current task, then the one next action. Skip root-cause narrative, fix internals, secondary to-dos, and em-dash tangents."
// @from(Ln 289891, Col 4)
QR6 = L(() => {
    y8();
    K8();
    Q8();
    lf();
    _7();
    a1();
    B1()
})
// @from(Ln 289904, Col 0)
function ku8(q, K) {
    let _ = v7();
    E(`Settings changed from ${q}, updating app state`);
    let z = _L8();
    KR6(), $t(), K((Y) => {
        let A = wc4(Y.toolPermissionContext, z);
        if (A = jEz(A, Y.settings.permissions?.additionalDirectories, _.permissions?.additionalDirectories), A.isBypassPermissionsModeAvailable && wt()) A = NJ6(A);
        if (A.strippedDangerousRules !== void 0) {
            let H = new Set($v),
                J = {};
            for (let [X, M] of Object.entries(A.strippedDangerousRules))
                if (M && !H.has(X)) J[X] = [...M];
            A = {
                ...A,
                strippedDangerousRules: J
            }
        }
        A = dR6(A);
        let O = Y.settings.effortLevel,
            w = _.effortLevel,
            $ = O !== w,
            j = UR6();
        if ($) d8((H) => H.unpinOpus47LaunchEffort ? H : {
            ...H,
            unpinOpus47LaunchEffort: !0
        });
        return {
            ...Y,
            settings: _,
            toolPermissionContext: A,
            ...$ && w !== void 0 && {
                effortValue: w
            },
            ...Y.awaySummaryEnabled !== j && {
                awaySummaryEnabled: j
            }
        }
    })
}
// @from(Ln 289944, Col 0)
function jEz(q, K, _) {
    let z = new Set((K ?? []).map(Oc4)),
        Y = new Set((_ ?? []).map(Oc4)),
        A = q.additionalWorkingDirectories,
        O = [...z].filter((j) => !Y.has(j) && !Ac4(A.get(j)?.source)),
        w = [...Y].filter((j) => !z.has(j) && !Ac4(A.get(j)?.source));
    if (O.length === 0 && w.length === 0) return q;
    let $ = q;
    if (O.length > 0) $ = EY($, {
        type: "removeDirectories",
        directories: O,
        destination: "localSettings"
    });
    if (w.length > 0) $ = EY($, {
        type: "addDirectories",
        directories: w,
        destination: "localSettings"
    });
    return $
}
// @from(Ln 289965, Col 0)
function Ac4(q) {
    return q === "cliArg" || q === "command" || q === "session"
}
// @from(Ln 289969, Col 0)
function Oc4(q) {
    return $Ez(Wq(q))
}
// @from(Ln 289972, Col 4)
_a1 = L(() => {
    CA();
    QR6();
    h1();
    K8();
    Q8();
    Bc();
    b9();
    MH();
    vX();
    g$();
    uI();
    aY();
    a1()
})
// @from(Ln 289988, Col 0)
function jc4(q, K) {
    for (let _ of q)
        if (_.startsWith("-") && !_.startsWith("--") && _.length > 2)
            for (let z = 1; z < _.length; z++) {
                let Y = "-" + _[z];
                if (!K.includes(Y)) return !1
            } else if (!K.includes(_)) return !1;
    return !0
}
// @from(Ln 289998, Col 0)
function HEz(q, K) {
    let _ = XM(q);
    if (_[0] !== "sed") return !1;
    let Y = _.slice(1).filter((w) => w.startsWith("-") && w !== "--");
    if (!jc4(Y, ["-n", "--quiet", "--silent", "-E", "--regexp-extended", "-r", "-z", "--zero-terminated", "--posix"])) return !1;
    let O = !1;
    for (let w of Y) {
        if (w === "-n" || w === "--quiet" || w === "--silent") {
            O = !0;
            break
        }
        if (w.startsWith("-") && !w.startsWith("--") && w.includes("n")) {
            O = !0;
            break
        }
    }
    if (!O) return !1;
    if (K.length === 0) return !1;
    for (let w of K) {
        let $ = w.split(";");
        for (let j of $)
            if (!JEz(j.trim())) return !1
    }
    return !0
}
// @from(Ln 290024, Col 0)
function JEz(q) {
    if (!q) return !1;
    return /^(?:\d+|\d+,\d+)?p$/.test(q)
}
// @from(Ln 290029, Col 0)
function $c4(q, K, _, z) {
    let Y = z?.allowFileWrites ?? !1;
    if (!Y && _) return !1;
    let A = XM(q);
    if (A[0] !== "sed") return !1;
    let w = A.slice(1).filter((Z) => Z.startsWith("-") && Z !== "--"),
        $ = ["-E", "--regexp-extended", "-r", "--posix"];
    if (Y) $.push("-i", "--in-place");
    if (!jc4(w, $)) return !1;
    if (K.length !== 1) return !1;
    let j = K[0].trim();
    if (!j.startsWith("s")) return !1;
    let H = j.match(/^s\/(.*?)$/);
    if (!H) return !1;
    let J = H[1],
        X = 0,
        M = -1,
        P = 0;
    while (P < J.length) {
        if (J[P] === "\\") {
            P += 2;
            continue
        }
        if (J[P] === "/") X++, M = P;
        P++
    }
    if (X !== 2) return !1;
    let W = J.slice(M + 1);
    if (!/^[gpimIM]*[1-9]?[gpimIM]*$/.test(W)) return !1;
    return !0
}
// @from(Ln 290061, Col 0)
function cR6(q, K) {
    let _ = K?.allowFileWrites ?? !1,
        z;
    try {
        z = MEz(q)
    } catch (w) {
        return !1
    }
    let Y = XEz(q),
        A = !1,
        O = !1;
    if (_) O = $c4(q, z, Y, {
        allowFileWrites: !0
    });
    else A = HEz(q, z), O = $c4(q, z, Y);
    if (!A && !O) return !1;
    for (let w of z)
        if (O && w.includes(";")) return !1;
    for (let w of z)
        if (PEz(w)) return !1;
    return !0
}
// @from(Ln 290084, Col 0)
function XEz(q) {
    let K = XM(q);
    if (K[0] !== "sed") return !1;
    let _ = K.slice(1),
        z = 0,
        Y = !1;
    for (let A = 0; A < _.length; A++) {
        let O = _[A];
        if ((O === "-e" || O === "--expression") && A + 1 < _.length) {
            Y = !0, A++;
            continue
        }
        if (O.startsWith("--expression=")) {
            Y = !0;
            continue
        }
        if (O.startsWith("-e=")) {
            Y = !0;
            continue
        }
        if (O.startsWith("-")) continue;
        if (z++, Y) return !0;
        if (z > 1) return !0
    }
    return !1
}
// @from(Ln 290111, Col 0)
function MEz(q) {
    let K = [],
        _ = XM(q);
    if (_[0] !== "sed") return K;
    let z = _.slice(1);
    if (z.some((Y) => /^-e[wWe]/.test(Y) || /^-w[eE]/.test(Y))) throw Error("Dangerous flag combination detected");
    if (z.length === 0) throw Error("No sed arguments");
    try {
        let Y = !1,
            A = !1;
        for (let O = 0; O < z.length; O++) {
            let w = z[O];
            if (typeof w !== "string") continue;
            if ((w === "-e" || w === "--expression") && O + 1 < z.length) {
                Y = !0;
                let $ = z[O + 1];
                if (typeof $ === "string") K.push($), O++;
                continue
            }
            if (w.startsWith("--expression=")) {
                Y = !0, K.push(w.slice(13));
                continue
            }
            if (w.startsWith("-e=")) {
                Y = !0, K.push(w.slice(3));
                continue
            }
            if (w.startsWith("-")) continue;
            if (!Y && !A) {
                K.push(w), A = !0;
                continue
            }
            break
        }
    } catch (Y) {
        throw Error(`Failed to parse sed command: ${Y instanceof Error?Y.message:"Unknown error"}`)
    }
    return K
}
// @from(Ln 290151, Col 0)
function PEz(q) {
    let K = q.trim();
    if (!K) return !1;
    if (/[^\x01-\x7F]/.test(K)) return !0;
    if (K.includes("{") || K.includes("}")) return !0;
    if (K.includes(`
`)) return !0;
    let _ = K.indexOf("#");
    if (_ !== -1 && !(_ > 0 && K[_ - 1] === "s")) return !0;
    if (/^!/.test(K) || /[/\d$]!/.test(K)) return !0;
    if (/\d\s*~\s*\d|,\s*~\s*\d|\$\s*~\s*\d/.test(K)) return !0;
    if (/^,/.test(K)) return !0;
    if (/,\s*[+-]/.test(K)) return !0;
    if (/s\\/.test(K) || /\\[|#%@]/.test(K)) return !0;
    if (/\\\/.*[wW]/.test(K)) return !0;
    if (/\/[^/]*\s+[wWeE]/.test(K)) return !0;
    if (/^s\//.test(K) && !/^s\/[^/]*\/[^/]*\/[^/]*$/.test(K)) return !0;
    if (/^s./.test(K) && /[wWeE]$/.test(K)) {
        if (!/^s([^\\\n]).*?\1.*?\1[^wWeE]*$/.test(K)) return !0
    }
    if (/^[wW]\s*\S+/.test(K) || /^\d+\s*[wW]\s*\S+/.test(K) || /^\$\s*[wW]\s*\S+/.test(K) || /^\/[^/]*\/[IMim]*\s*[wW]\s*\S+/.test(K) || /^\d+,\d+\s*[wW]\s*\S+/.test(K) || /^\d+,\$\s*[wW]\s*\S+/.test(K) || /^\/[^/]*\/[IMim]*,\/[^/]*\/[IMim]*\s*[wW]\s*\S+/.test(K)) return !0;
    if (/^e/.test(K) || /^\d+\s*e/.test(K) || /^\$\s*e/.test(K) || /^\/[^/]*\/[IMim]*\s*e/.test(K) || /^\d+,\d+\s*e/.test(K) || /^\d+,\$\s*e/.test(K) || /^\/[^/]*\/[IMim]*,\/[^/]*\/[IMim]*\s*e/.test(K)) return !0;
    let z = K.match(/s([^\\\n]).*?\1.*?\1(.*?)$/);
    if (z) {
        let A = z[2] || "";
        if (A.includes("w") || A.includes("W")) return !0;
        if (A.includes("e") || A.includes("E")) return !0
    }
    if (K.match(/y([^\\\n])/)) {
        if (/[wWeE]/.test(K)) return !0
    }
    return !1
}
// @from(Ln 290185, Col 0)
function Hc4(q, K) {
    let _ = TO(q.command);
    for (let z of _) {
        let Y = z.trim();
        if (Y.split(/\s+/)[0] !== "sed") continue;
        let O = K.mode === "acceptEdits";
        if (!cR6(Y, {
                allowFileWrites: O
            })) return {
            behavior: "ask",
            message: "sed command requires approval (contains potentially dangerous operations)",
            decisionReason: {
                type: "other",
                reason: "sed command contains operations that require explicit approval (e.g., write commands, execute commands)",
                bashMissKind: "sed-dangerous"
            }
        }
    }
    return {
        behavior: "passthrough",
        message: "No dangerous sed operations detected"
    }
}
// @from(Ln 290208, Col 4)
Nu8 = L(() => {
    vD()
})
// @from(Ln 290219, Col 0)
function fEz(q, K, _) {
    let z = X78[q],
        Y = z(K);
    for (let A of Y) {
        let O = kK6(A.replace(/^['"]|['"]$/g, "")),
            w = DEz(O) ? O : ZEz(_, O);
        if (fy6(w)) return {
            behavior: "ask",
            message: `Dangerous ${q} operation detected: '${w}'

This command would remove a critical system directory. This requires explicit approval and cannot be auto-allowed by permission rules.`,
            decisionReason: {
                type: "other",
                reason: `Dangerous ${q} operation on critical path: ${w}`,
                bashMissKind: "dangerous-path"
            },
            suggestions: []
        }
    }
    return {
        behavior: "passthrough",
        message: `No dangerous removals detected for ${q} command`
    }
}
// @from(Ln 290244, Col 0)
function U$(q) {
    let K = [],
        _ = !1;
    for (let z of q)
        if (_) K.push(z);
        else if (z === "--") _ = !0;
    else if (!z?.startsWith("-")) K.push(z);
    return K
}
// @from(Ln 290254, Col 0)
function za1(q) {
    return (K) => {
        let _ = [],
            z = !1;
        for (let Y = 0; Y < K.length; Y++) {
            let A = K[Y];
            if (A === void 0 || A === null) continue;
            if (z) _.push(A);
            else if (A === "--") z = !0;
            else if (A.startsWith("-")) {
                if (q.has(A)) Y++
            } else _.push(A)
        }
        return _
    }
}
// @from(Ln 290271, Col 0)
function Jc4(q, K, _ = []) {
    let z = [],
        Y = !1,
        A = !1;
    for (let O = 0; O < q.length; O++) {
        let w = q[O];
        if (w === void 0 || w === null) continue;
        if (!A && w === "--") {
            A = !0;
            continue
        }
        if (!A && w.startsWith("-")) {
            let $ = w.indexOf("="),
                j = $ >= 0 ? w.slice(0, $) : w;
            if (["-e", "--regexp", "-f", "--file"].includes(j)) {
                if (Y = !0, j === "-f" || j === "--file") {
                    let H = $ >= 0 ? w.slice($ + 1) : q[O + 1];
                    if (H) z.push(H)
                }
            }
            if (K.has(j) && $ < 0) O++;
            continue
        }
        if (!Y) {
            Y = !0;
            continue
        }
        z.push(w)
    }
    return z.length > 0 ? z : _
}
// @from(Ln 290303, Col 0)
function TEz(q, K, _, z, Y, A) {
    let O = X78[q],
        w = O(K),
        $ = A ?? M78[q],
        j = vEz[q];
    if (j && !j(K)) return {
        behavior: "ask",
        message: `${q} with flags requires manual approval to ensure path safety. For security, Claude Code cannot automatically validate ${q} commands that use flags, as some flags like --target-directory=PATH can bypass path validation.`,
        decisionReason: {
            type: "other",
            reason: `${q} command with flags requires manual approval`,
            bashMissKind: "flag-validation"
        }
    };
    if (Y && $ !== "read") return {
        behavior: "ask",
        message: "Commands that change directories and perform write operations require explicit approval to ensure paths are evaluated correctly. For security, Claude Code cannot automatically determine the final working directory when 'cd' is used in compound commands.",
        decisionReason: {
            type: "other",
            reason: "Compound command contains cd with write operation - manual approval required to prevent path resolution bypass",
            bashMissKind: "cd-compound-write"
        }
    };
    for (let H of w) {
        let {
            allowed: J,
            resolvedPath: X,
            decisionReason: M
        } = rt6(H, _, z, $);
        if (!J) {
            let P = Array.from(qp(z)),
                W = Gg1(P),
                D = M?.type === "other" || M?.type === "safetyCheck" ? M.reason : `${q} in '${X}' was blocked. For security, Claude Code may only ${GEz[q]} the allowed working directories for this session: ${W}.`;
            if (M?.type === "rule") return {
                behavior: "deny",
                message: D,
                decisionReason: M
            };
            return {
                behavior: "ask",
                message: D,
                blockedPath: X,
                decisionReason: M
            }
        }
    }
    return {
        behavior: "passthrough",
        message: `Path validation passed for ${q} command`
    }
}
// @from(Ln 290355, Col 0)
function Pc4(q, K) {
    return (_, z, Y, A) => {
        let O = TEz(q, _, z, Y, A, K);
        if (O.behavior === "deny") return O;
        if (q === "rm" || q === "rmdir") {
            let w = fEz(q, _, z);
            if (w.behavior !== "passthrough") return w
        }
        if (O.behavior === "passthrough") return O;
        if (O.behavior === "ask") {
            let w = K ?? M78[q],
                $ = [];
            if (O.blockedPath)
                if (w === "read") {
                    let H = Yv(O.blockedPath),
                        J = _j6(H, "session");
                    if (J) $.push(J)
                } else $.push({
                    type: "addDirectories",
                    directories: [Yv(O.blockedPath)],
                    destination: "session"
                });
            let j = Y.mode === "plan" && (Y.prePlanMode === "auto" || Y.prePlanMode === "bypassPermissions" || Y.prePlanMode === "acceptEdits" || Y.prePlanMode === "dontAsk");
            if ((w === "write" || w === "create") && (Y.mode === "default" || Y.mode === "plan") && !j) $.push({
                type: "setMode",
                mode: "acceptEdits",
                destination: "session"
            });
            O.suggestions = $
        }
        return O
    }
}
// @from(Ln 290389, Col 0)
function VEz(q) {
    return XM(q)
}
// @from(Ln 290393, Col 0)
function kEz(q, K, _, z) {
    let Y = jF(q),
        A = VEz(Y);
    if (A.length === 0) return {
        behavior: "passthrough",
        message: "Empty command - no paths to validate"
    };
    let [O, ...w] = A;
    if (!O || !Mc4.includes(O)) return {
        behavior: "passthrough",
        message: `Command '${O}' is not a path-restricted command`
    };
    let $ = O === "sed" && cR6(Y) ? "read" : void 0;
    return Pc4(O, $)(w, K, _, z)
}
// @from(Ln 290409, Col 0)
function NEz(q, K, _, z) {
    let Y = SEz(q.argv);
    if (Y.length === 0) return {
        behavior: "passthrough",
        message: "Empty command - no paths to validate"
    };
    let [A, ...O] = Y;
    if (!A || !Mc4.includes(A)) return {
        behavior: "passthrough",
        message: `Command '${A}' is not a path-restricted command`
    };
    let w = A === "sed" && cR6(jF(q.text)) ? "read" : void 0;
    return Pc4(A, w)(O, K, _, z)
}
// @from(Ln 290424, Col 0)
function EEz(q, K, _, z) {
    if (z && q.length > 0) return {
        behavior: "ask",
        message: "Commands that change directories and write via output redirection require explicit approval to ensure paths are evaluated correctly. For security, Claude Code cannot automatically determine the final working directory when 'cd' is used in compound commands.",
        decisionReason: {
            type: "other",
            reason: "Compound command contains cd with output redirection - manual approval required to prevent path resolution bypass",
            bashMissKind: "cd-compound-redirect"
        }
    };
    for (let {
            target: Y
        }
        of q) {
        if (Y === "/dev/null") continue;
        let {
            allowed: A,
            resolvedPath: O,
            decisionReason: w
        } = rt6(Y, K, _, "create");
        if (!A) {
            let $ = Array.from(qp(_)),
                j = Gg1($),
                H = w?.type === "other" || w?.type === "safetyCheck" ? w.reason : w?.type === "rule" ? `Output redirection to '${O}' was blocked by a deny rule.` : `Output redirection to '${O}' was blocked. For security, Claude Code may only write to files in the allowed working directories for this session: ${j}.`;
            if (w?.type === "rule") return {
                behavior: "deny",
                message: H,
                decisionReason: w
            };
            return {
                behavior: "ask",
                message: H,
                blockedPath: O,
                decisionReason: w,
                suggestions: [{
                    type: "addDirectories",
                    directories: [Yv(O)],
                    destination: "session"
                }]
            }
        }
    }
    return {
        behavior: "passthrough",
        message: "No unsafe redirections found"
    }
}
// @from(Ln 290472, Col 0)
function Eu8(q, K, _, z, Y, A) {
    if (!A && />>\s*>\s*\(|>\s*>\s*\(|<\s*\(/.test(q.command)) return {
        behavior: "ask",
        message: "Process substitution (>(...) or <(...)) can execute arbitrary commands and requires manual approval",
        decisionReason: {
            type: "other",
            reason: "Process substitution requires manual approval",
            bashMissKind: "process-substitution"
        }
    };
    let {
        redirections: O,
        hasDangerousRedirection: w,
        dangerousRedirectionReason: $
    } = Y ? yEz(Y) : od(q.command);
    if (w) {
        let H = $ === "network_device" ? "Redirect involving /dev/tcp or /dev/udp opens a network connection" : "Shell expansion syntax in paths requires manual approval";
        return {
            behavior: "ask",
            message: H,
            decisionReason: {
                type: "other",
                reason: H,
                bashMissKind: $ === "network_device" ? "net-redirect" : "shell-expansion"
            }
        }
    }
    let j = EEz(O, K, _, z);
    if (j.behavior !== "passthrough") return j;
    if (A)
        for (let H of A) {
            let J = NEz(H, K, _, z);
            if (J.behavior === "ask" || J.behavior === "deny") return J
        } else {
            let H = TO(q.command);
            for (let J of H) {
                let X = kEz(J, K, _, z);
                if (X.behavior === "ask" || X.behavior === "deny") return X
            }
        }
    return {
        behavior: "passthrough",
        message: "All path commands validated successfully"
    }
}
// @from(Ln 290518, Col 0)
function yEz(q) {
    let K = [],
        _ = !1,
        z;
    for (let Y of q) {
        if (/^\/dev\/(tcp|udp)\//.test(Y.target)) {
            _ = !0, z = "network_device";
            continue
        }
        switch (Y.op) {
            case ">":
            case ">|":
            case "&>":
                K.push({
                    target: Y.target,
                    operator: ">"
                });
                break;
            case ">>":
            case "&>>":
                K.push({
                    target: Y.target,
                    operator: ">>"
                });
                break;
            case ">&":
                if (!/^\d+$/.test(Y.target)) K.push({
                    target: Y.target,
                    operator: ">"
                });
                break;
            case "<":
            case "<&":
            case "<<":
            case "<<<":
                break
        }
    }
    return {
        redirections: K,
        hasDangerousRedirection: _,
        dangerousRedirectionReason: z
    }
}
// @from(Ln 290563, Col 0)
function LEz(q) {
    let K = 1;
    while (K < q.length) {
        let _ = q[K],
            z = q[K + 1];
        if (_ === "--foreground" || _ === "--preserve-status" || _ === "--verbose") K++;
        else if (/^--(?:kill-after|signal)=[A-Za-z0-9_.+-]+$/.test(_)) K++;
        else if ((_ === "--kill-after" || _ === "--signal") && z && Xc4.test(z)) K += 2;
        else if (_ === "--") {
            K++;
            break
        } else if (_.startsWith("--")) return -1;
        else if (_ === "-v") K++;
        else if ((_ === "-k" || _ === "-s") && z && Xc4.test(z)) K += 2;
        else if (/^-[ks][A-Za-z0-9_.+-]+$/.test(_)) K++;
        else if (_.startsWith("-")) return -1;
        else break
    }
    return K
}
// @from(Ln 290584, Col 0)
function hEz(q) {
    let K = 1;
    while (K < q.length) {
        let _ = q[K];
        if (/^-[ioe]$/.test(_) && q[K + 1]) K += 2;
        else if (/^-[ioe]./.test(_)) K++;
        else if (/^--(input|output|error)=/.test(_)) K++;
        else if (_.startsWith("-")) return -1;
        else break
    }
    return K > 1 && K < q.length ? K : -1
}
// @from(Ln 290597, Col 0)
function REz(q) {
    let K = 1;
    while (K < q.length) {
        let _ = q[K];
        if (_.includes("=") && !_.startsWith("-")) K++;
        else if (_ === "-i" || _ === "-0" || _ === "-v") K++;
        else if (_ === "-u" && q[K + 1]) K += 2;
        else if (_.startsWith("-")) return -1;
        else break
    }
    return K < q.length ? K : -1
}
// @from(Ln 290610, Col 0)
function SEz(q) {
    let K = q;
    for (;;)
        if (K[0] === "time" || K[0] === "nohup") K = K.slice(K[1] === "--" ? 2 : 1);
        else if (K[0] === "timeout") {
        let _ = LEz(K);
        if (_ < 0 || !K[_] || !/^\d+(?:\.\d+)?[smhd]?$/.test(K[_])) return K;
        K = K.slice(_ + 1)
    } else if (K[0] === "nice")
        if (K[1] === "-n" && K[2] && /^-?\d+$/.test(K[2])) K = K.slice(K[3] === "--" ? 4 : 3);
        else if (K[1] && /^-\d+$/.test(K[1])) K = K.slice(K[2] === "--" ? 3 : 2);
    else K = K.slice(K[1] === "--" ? 2 : 1);
    else if (K[0] === "stdbuf") {
        let _ = hEz(K);
        if (_ < 0) return K;
        K = K.slice(_)
    } else if (K[0] === "env") {
        let _ = REz(K);
        if (_ < 0) return K;
        K = K.slice(_)
    } else return K
}
// @from(Ln 290632, Col 4)
X78
// @from(Ln 290632, Col 9)
Mc4
// @from(Ln 290632, Col 14)
GEz
// @from(Ln 290632, Col 19)
M78
// @from(Ln 290632, Col 24)
vEz
// @from(Ln 290632, Col 29)
Xc4
// @from(Ln 290633, Col 4)
Ya1 = L(() => {
    vD();
    b9();
    Sz();
    MH();
    Gy6();
    MT();
    Nu8();
    X78 = {
        cd: (q) => q.length === 0 ? [WEz()] : [q.join(" ")],
        ls: (q) => {
            let K = U$(q);
            return K.length > 0 ? K : ["."]
        },
        find: (q) => {
            let K = [],
                _ = new Set(["-newer", "-anewer", "-cnewer", "-mnewer", "-samefile", "-path", "-wholename", "-ilname", "-lname", "-ipath", "-iwholename"]),
                z = /^-newer[acmBt][acmtB]$/,
                Y = !1,
                A = !1;
            for (let O = 0; O < q.length; O++) {
                let w = q[O];
                if (!w) continue;
                if (A) {
                    K.push(w);
                    continue
                }
                if (w === "--") {
                    A = !0;
                    continue
                }
                if (w.startsWith("-")) {
                    if (["-H", "-L", "-P"].includes(w)) continue;
                    if (Y = !0, _.has(w) || z.test(w)) {
                        let $ = q[O + 1];
                        if ($) K.push($), O++
                    }
                    continue
                }
                if (!Y) K.push(w)
            }
            return K.length > 0 ? K : ["."]
        },
        mkdir: U$,
        touch: U$,
        rm: U$,
        rmdir: U$,
        mv: U$,
        cp: U$,
        cat: U$,
        head: U$,
        tail: U$,
        sort: U$,
        uniq: U$,
        wc: U$,
        cut: za1(new Set(["-d", "--delimiter", "-f", "--fields", "-b", "--bytes", "-c", "--characters", "--output-delimiter"])),
        paste: za1(new Set(["-d", "--delimiters"])),
        column: za1(new Set(["-s", "--separator", "-o", "--output-separator", "-c", "--output-width"])),
        file: U$,
        stat: U$,
        diff: U$,
        awk: (q) => {
            let K = new Set(["-F", "--field-separator", "-v", "--assign", "-e", "--source"]),
                _ = new Set(["-f", "--file", "-E", "--exec"]),
                z = [],
                Y = !1,
                A = !1;
            for (let O = 0; O < q.length; O++) {
                let w = q[O];
                if (w === void 0 || w === null) continue;
                if (!Y && w === "--") {
                    Y = !0;
                    continue
                }
                if (!Y && w.startsWith("-")) {
                    let $ = w.indexOf("="),
                        j = $ >= 0 ? w.slice(0, $) : w;
                    if (K.has(j)) {
                        if (j === "-e" || j === "--source") A = !0;
                        if ($ < 0) O++;
                        continue
                    }
                    if (_.has(j)) {
                        if (A = !0, $ >= 0) z.push(w.slice($ + 1));
                        else {
                            let H = q[O + 1];
                            if (H !== void 0) z.push(H), O++
                        }
                        continue
                    }
                    continue
                }
                if (!A) {
                    A = !0;
                    continue
                }
                z.push(w)
            }
            return z
        },
        strings: U$,
        hexdump: U$,
        od: U$,
        base64: U$,
        nl: U$,
        sha256sum: U$,
        sha1sum: U$,
        md5sum: U$,
        tr: (q) => {
            let K = q.some((z) => z === "-d" || z === "--delete" || z.startsWith("-") && z.includes("d"));
            return U$(q).slice(K ? 1 : 2)
        },
        grep: (q) => {
            let _ = Jc4(q, new Set(["-e", "--regexp", "-f", "--file", "--exclude", "--include", "--exclude-dir", "--include-dir", "-m", "--max-count", "-A", "--after-context", "-B", "--before-context", "-C", "--context"]));
            if (_.length === 0 && q.some((z) => ["-r", "-R", "--recursive"].includes(z))) return ["."];
            return _
        },
        rg: (q) => {
            return Jc4(q, new Set(["-e", "--regexp", "-f", "--file", "-t", "--type", "-T", "--type-not", "-g", "--glob", "-m", "--max-count", "--max-depth", "-r", "--replace", "-A", "--after-context", "-B", "--before-context", "-C", "--context"]), ["."])
        },
        sed: (q) => {
            let K = [],
                _ = !1,
                z = !1,
                Y = !1;
            for (let A = 0; A < q.length; A++) {
                if (_) {
                    _ = !1;
                    continue
                }
                let O = q[A];
                if (!O) continue;
                if (!Y && O === "--") {
                    Y = !0;
                    continue
                }
                if (!Y && O.startsWith("-")) {
                    if (["-f", "--file"].includes(O)) {
                        let w = q[A + 1];
                        if (w) K.push(w), _ = !0;
                        z = !0
                    } else if (["-e", "--expression"].includes(O)) _ = !0, z = !0;
                    else if (O.includes("e") || O.includes("f")) z = !0;
                    continue
                }
                if (!z) {
                    z = !0;
                    continue
                }
                K.push(O)
            }
            return K
        },
        jq: (q) => {
            let K = [],
                _ = new Set(["-e", "--expression", "--arg", "--argjson", "--args", "--jsonargs", "-L", "--library-path", "--indent", "--tab"]),
                z = !1,
                Y = !1;
            for (let A = 0; A < q.length; A++) {
                let O = q[A];
                if (O === void 0 || O === null) continue;
                if (!Y && O === "--") {
                    Y = !0;
                    continue
                }
                if (!Y && O.startsWith("-")) {
                    let w = O.indexOf("="),
                        $ = w >= 0 ? O.slice(0, w) : O;
                    if (["-e", "--expression"].includes($)) z = !0;
                    if (["-f", "--from-file"].includes($)) {
                        if (z = !0, w >= 0) K.push(O.slice(w + 1));
                        else {
                            let j = q[A + 1];
                            if (j !== void 0) K.push(j), A++
                        }
                        continue
                    }
                    if (["--slurpfile", "--rawfile"].includes($)) {
                        let j = q[A + 2];
                        if (j !== void 0) K.push(j);
                        A += 2;
                        continue
                    }
                    if (_.has($) && w < 0) A++;
                    continue
                }
                if (!z) {
                    z = !0;
                    continue
                }
                K.push(O)
            }
            return K
        },
        git: (q) => {
            if (q.length >= 1 && q[0] === "diff") {
                if (q.includes("--no-index")) return U$(q.slice(1)).slice(0, 2)
            }
            return []
        }
    }, Mc4 = Object.keys(X78), GEz = {
        cd: "change directories to",
        ls: "list files in",
        find: "search files in",
        mkdir: "create directories in",
        touch: "create or modify files in",
        rm: "remove files from",
        rmdir: "remove directories from",
        mv: "move files to/from",
        cp: "copy files to/from",
        cat: "concatenate files from",
        head: "read the beginning of files from",
        tail: "read the end of files from",
        sort: "sort contents of files from",
        uniq: "filter duplicate lines from files in",
        wc: "count lines/words/bytes in files from",
        cut: "extract columns from files in",
        paste: "merge files from",
        column: "format files from",
        tr: "transform text from files in",
        file: "examine file types in",
        stat: "read file stats from",
        diff: "compare files from",
        awk: "process text from files in",
        strings: "extract strings from files in",
        hexdump: "display hex dump of files from",
        od: "display octal dump of files from",
        base64: "encode/decode files from",
        nl: "number lines in files from",
        grep: "search for patterns in files from",
        rg: "search for patterns in files from",
        sed: "edit files in",
        git: "access files with git from",
        jq: "process JSON from files in",
        sha256sum: "compute SHA-256 checksums for files in",
        sha1sum: "compute SHA-1 checksums for files in",
        md5sum: "compute MD5 checksums for files in"
    }, M78 = {
        cd: "read",
        ls: "read",
        find: "read",
        mkdir: "create",
        touch: "create",
        rm: "write",
        rmdir: "write",
        mv: "write",
        cp: "write",
        cat: "read",
        head: "read",
        tail: "read",
        sort: "read",
        uniq: "read",
        wc: "read",
        cut: "read",
        paste: "read",
        column: "read",
        tr: "read",
        file: "read",
        stat: "read",
        diff: "read",
        awk: "read",
        strings: "read",
        hexdump: "read",
        od: "read",
        base64: "read",
        nl: "read",
        grep: "read",
        rg: "read",
        sed: "write",
        git: "read",
        jq: "read",
        sha256sum: "read",
        sha1sum: "read",
        md5sum: "read"
    }, vEz = {
        mv: (q) => !q.some((K) => K?.startsWith("-")),
        cp: (q) => !q.some((K) => K?.startsWith("-"))
    };
    Xc4 = /^[A-Za-z0-9_.+-]+$/
})
// @from(Ln 290914, Col 0)
function bEz() {
    let q = CEz;
    if (y1() === "windows") {
        let {
            xargs: K,
            ..._
        } = q;
        q = _
    }
    return q
}
// @from(Ln 290926, Col 0)
function xEz(q) {
    let K = XM(q);
    if (K.length === 0) return !1;
    let _, z = 0,
        Y = bEz();
    for (let [A] of Object.entries(Y)) {
        let O = A.split(" ");
        if (K.length >= O.length) {
            let w = !0;
            for (let $ = 0; $ < O.length; $++)
                if (K[$] !== O[$]) {
                    w = !1;
                    break
                } if (w) {
                _ = Y[A], z = O.length;
                break
            }
        }
    }
    if (!_) return !1;
    if (K[0] === "git" && K[1] === "ls-remote") {
        if (K.some((A) => A === "-o" || A === "--server-option" || A.startsWith("--server-option="))) return !1;
        for (let A = 2; A < K.length; A++) {
            let O = K[A];
            if (O && !O.startsWith("-")) {
                if (O.includes("://")) return !1;
                if (O.includes("@") || O.includes(":")) return !1;
                if (O.includes("$")) return !1
            }
        }
    }
    for (let A = z; A < K.length; A++) {
        let O = K[A];
        if (!O) continue;
        if (O.includes("$")) return !1;
        if (O.includes("{") && (O.includes(",") || O.includes(".."))) return !1
    }
    if (!Dy6(K, z, _, {
            commandName: K[0],
            rawCommand: q,
            xargsTargetCommands: K[0] === "xargs" ? IEz : void 0
        })) return !1;
    if (_.regex && !_.regex.test(q)) return !1;
    if (!_.regex && /`/.test(q)) return !1;
    if (!_.regex && (K[0] === "rg" || K[0] === "grep" || K[0] === "egrep" || K[0] === "fgrep") && /[\n\r]/.test(q)) return !1;
    if (_.additionalCommandIsDangerousCallback && _.additionalCommandIsDangerousCallback(q, K.slice(z))) return !1;
    return !0
}
// @from(Ln 290975, Col 0)
function uEz(q) {
    return new RegExp(`^${q}(?:\\s|$)[^<>()$\`|{}&;\\n\\r]*$`)
}
// @from(Ln 290979, Col 0)
function QEz(q) {
    if (q.length === 0) return !1;
    let K = q[0];
    if (gEz.has(K)) return q.length === 1;
    for (let _ of UEz)
        if (q.length === _.length && q.every((z, Y) => z === _[Y])) return !0;
    if (mEz.has(K)) return !0;
    for (let _ of BEz) {
        let z = _.split(" ");
        if (q.length >= z.length && z.every((Y, A) => q[A] === Y)) return !0
    }
    if (K === "echo") return !0;
    if (K === "printf") return !q[1]?.startsWith("-v");
    if (K === "[[") {
        for (let _ = 1; _ < q.length; _++) {
            let z = q[_];
            if ((z === "-v" || z === "-R") && q[_ + 1]?.includes("[")) return !1;
            if (Xg1.has(z)) {
                if (q[_ - 1]?.includes("[") || q[_ + 1]?.includes("[")) return !1
            }
        }
        return !0
    }
    if (K === "ls") return !0;
    if (K === "cd") return q.length <= 2;
    if (K === "find") {
        for (let _ = 1; _ < q.length; _++) {
            let z = q[_];
            if (FEz.has(z) || /^-newer[aBcmt]{2}$/.test(z)) {
                _++;
                continue
            }
            if (pEz.has(z)) return !1
        }
        return !0
    }
    if (K === "history") return q.length === 1 || q.length === 2 && /^\d+$/.test(q[1]);
    if (K === "arch") return q.length === 1 || q.length === 2 && (q[1] === "-h" || q[1] === "--help");
    if (K === "ifconfig") return q.length === 1 || q.length === 2 && /^[a-zA-Z]/.test(q[1]);
    return null
}
// @from(Ln 291021, Col 0)
function Oa1(q) {
    let K = !1,
        _ = !1,
        z = !1,
        Y = !1,
        A = !1;
    for (let O = 0; O < q.length; O++) {
        let w = q[O];
        if (z) {
            z = !1;
            continue
        }
        if (w === "\\" && !K) {
            z = !0;
            continue
        }
        if (w === "'" && !_) {
            K = !K;
            continue
        }
        if (w === '"' && !K) {
            _ = !_;
            continue
        }
        if (K) continue;
        if (w === "$") {
            let $ = q[O + 1];
            if ($ && /[A-Za-z_@*#?!$0-9-]/.test($)) return "variable"
        }
        if (_) continue;
        if (w === " " || w === "\t" || w === `
` || w === "|" || w === "&" || w === ";" || w === "(" || w === ")" || w === "<" || w === ">") {
            A = !1;
            continue
        }
        if (w === "?" || w === "*") {
            Y = !0;
            continue
        }
        if (w === "[") {
            A = !0;
            continue
        }
        if (w === "]" && A) Y = !0
    }
    return Y ? "glob" : !1
}
// @from(Ln 291069, Col 0)
function lEz(q) {
    let K = q.trim();
    if (K.endsWith(" 2>&1")) K = K.slice(0, -5).trim();
    if (Gp(K)) return !1;
    if (Oa1(K) === "variable") return !1;
    if (xEz(K)) return !0;
    for (let _ of dEz)
        if (_.test(K)) {
            if (K.includes("git") && /\s-c[\s=]/.test(K)) return !1;
            if (K.includes("git") && /\s--exec-path[\s=]/.test(K)) return !1;
            if (K.includes("git") && /\s--config-env[\s=]/.test(K)) return !1;
            return !0
        } return !1
}
// @from(Ln 291084, Col 0)
function nEz(q) {
    return TO(q).some((K) => Lu8(K.trim()))
}
// @from(Ln 291088, Col 0)
function Dc4(q) {
    let K = q.replace(/^\.?\//, "");
    return iEz.some((_) => _.test(K))
}
// @from(Ln 291093, Col 0)
function oEz(q) {
    let K = XM(q);
    if (K.length === 0) return [];
    let _ = K[0];
    if (!_) return [];
    if (!(_ in M78)) return [];
    let z = M78[_];
    if (z !== "write" && z !== "create" || rEz.has(_)) return [];
    let Y = X78[_];
    if (!Y) return [];
    return Y(K.slice(1))
}
// @from(Ln 291106, Col 0)
function aEz(q) {
    let K = TO(q);
    for (let _ of K) {
        let z = _.trim(),
            Y = oEz(z);
        for (let O of Y)
            if (Dc4(O)) return !0;
        let {
            redirections: A
        } = od(z);
        for (let {
                target: O
            }
            of A)
            if (Dc4(O)) return !0
    }
    return !1
}
// @from(Ln 291125, Col 0)
function yu8(q, K) {
    let {
        command: _
    } = q, z = vs().parse(_), Y = z ? dt6(_, z) : {
        kind: "simple",
        commands: []
    };
    if (Y.kind === "too-complex") return {
        behavior: "passthrough",
        message: `Not a simple read-only command: ${Y.reason}`
    };
    let A = Oa1(_);
    if (A === "variable") return {
        behavior: "passthrough",
        message: "Command contains unquoted variable expansion"
    };
    if (Gp(_)) return {
        behavior: "ask",
        message: "Command contains Windows UNC path that could be vulnerable to WebDAV attacks"
    };
    let O = nEz(_);
    if (K && O) return {
        behavior: "passthrough",
        message: "Compound commands with cd and git require permission checks for enhanced security"
    };
    if (O && kQ6()) return {
        behavior: "passthrough",
        message: "Git commands in directories with bare repository structure require permission checks for enhanced security"
    };
    if (O && aEz(_)) return {
        behavior: "passthrough",
        message: "Compound commands that create git internal files and run git require permission checks for enhanced security"
    };
    if (O && Z7.isSandboxingEnabled() && b8() !== Y7()) return {
        behavior: "passthrough",
        message: "Git commands outside the original working directory require permission checks when sandbox is enabled"
    };
    if (Y.commands.length > 0 && Y.commands.every(($) => {
            if ($.redirects.some((H) => !sEz.has(H.op) && H.target !== "/dev/null" && !(H.op === ">&" && /^\d+$/.test(H.target)))) return !1;
            if ($.redirects.some((H) => /^\/dev\/(tcp|udp)\//.test(H.target))) return !1;
            if ($.envVars.some((H) => !lR6(H.name))) return !1;
            if ($.argv.some((H) => Gp(H))) return !1;
            if (A === "glob" && (Oa1($.text) === "glob" || $.argv.some((H) => /[*?]|\[.*\]/.test(H)))) return cEz.has($.argv[0] ?? "");
            let j = QEz($.argv);
            if (j !== null) return j;
            return lEz($.text)
        })) return {
        behavior: "allow",
        updatedInput: q
    };
    return {
        behavior: "passthrough",
        message: "Command is not read-only, requires further permission checks"
    }
}
// @from(Ln 291180, Col 4)
Wc4
// @from(Ln 291180, Col 9)
Aa1
// @from(Ln 291180, Col 14)
CEz
// @from(Ln 291180, Col 19)
p62
// @from(Ln 291180, Col 24)
IEz
// @from(Ln 291180, Col 29)
wa1
// @from(Ln 291180, Col 34)
mEz
// @from(Ln 291180, Col 39)
BEz
// @from(Ln 291180, Col 44)
pEz
// @from(Ln 291180, Col 49)
FEz
// @from(Ln 291180, Col 54)
gEz
// @from(Ln 291180, Col 59)
UEz
// @from(Ln 291180, Col 64)
dEz
// @from(Ln 291180, Col 69)
cEz
// @from(Ln 291180, Col 74)
iEz
// @from(Ln 291180, Col 79)
rEz
// @from(Ln 291180, Col 84)
sEz