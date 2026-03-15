
// @from(Ln 444060, Col 9)
tJ = async (A, q, K, Y, z) => {
        let _ = await BYz(A, q, K, Y, z);
        if (_.behavior === "allow") {
            let w = K.getAppState();
            {
                let O = K.localDenialTracking ?? w.denialTracking;
                if (w.toolPermissionContext.mode === "auto" && O && O.consecutiveDenials > 0) {
                    let $ = Fi6(O);
                    I_6(K, $)
                }
            }
            return _
        }
        if (_.behavior === "ask") {
            let w = K.getAppState();
            if (w.toolPermissionContext.mode === "dontAsk") return {
                behavior: "deny",
                decisionReason: {
                    type: "mode",
                    mode: "dontAsk"
                },
                message: ofq(A.name)
            };
            if (w.toolPermissionContext.mode === "auto" || !1 || w.toolPermissionContext.prePlanMode === "auto") {
                if (A.requiresUserInteraction?.() && _.behavior === "ask") return _;
                let O = K.localDenialTracking ?? w.denialTracking ?? Ay1();
                if (_.decisionReason?.type === "classifier" && _.decisionReason.classifier === "dangerous-agent-action-unavailable") {
                    let D = pKq(O);
                    if (I_6(K, D), UKq(D)) {
                        let W = w.toolPermissionContext.shouldAvoidPermissionPrompts;
                        if (k(`Dangerous action classifier unavailable ${D.consecutiveUnavailable} consecutive times, falling back to ${W?"abort":"user prompt"}`, {
                                level: "warn"
                            }), W) throw new oY("Agent aborted: DAC unavailable too many times in headless mode");
                        return _
                    }
                    let X = D.consecutiveUnavailable,
                        P = dKq(X);
                    return k(`Dangerous action classifier unavailable (${X}/${Kv6.maxConsecutiveUnavailable}), retrying after ${P}ms`, {
                        level: "warn"
                    }), await uk(P, K.abortController.signal), {
                        behavior: "deny",
                        decisionReason: _.decisionReason,
                        message: xn8(A.name, "data-exfiltration")
                    }
                }
                if (_.behavior === "ask" && A.name !== r4) try {
                    let D = A.inputSchema.parse(q),
                        X = await A.checkPermissions(D, {
                            ...K,
                            getAppState: () => {
                                let P = K.getAppState();
                                return {
                                    ...P,
                                    toolPermissionContext: {
                                        ...P.toolPermissionContext,
                                        mode: "acceptEdits"
                                    }
                                }
                            }
                        });
                    if (X.behavior === "allow") {
                        let P = Fi6(O);
                        return I_6(K, P), k(`Skipping auto mode classifier for ${A.name}: would be allowed in acceptEdits mode`), d("tengu_auto_mode_decision", {
                            decision: "allowed",
                            toolName: hq(A.name),
                            confidence: "high",
                            fastPath: "acceptEdits"
                        }), {
                            behavior: "allow",
                            updatedInput: X.updatedInput ?? q,
                            decisionReason: {
                                type: "mode",
                                mode: "auto"
                            }
                        }
                    }
                } catch (D) {
                    if (D instanceof oY || D instanceof Az) throw D
                }
                if (SYz.isAutoModeAllowlistedTool(A.name)) {
                    let D = Fi6(O);
                    return I_6(K, D), k(`Skipping auto mode classifier for ${A.name}: tool is on the safe allowlist`), d("tengu_auto_mode_decision", {
                        decision: "allowed",
                        toolName: hq(A.name),
                        confidence: "high",
                        fastPath: "allowlist"
                    }), {
                        behavior: "allow",
                        updatedInput: q,
                        decisionReason: {
                            type: "mode",
                            mode: "auto"
                        }
                    }
                }
                let $ = ll4(A.name, q);
                KW4(z);
                let H;
                try {
                    H = await EN1(K.messages, $, K.options.tools, w.toolPermissionContext, K.abortController.signal)
                } finally {
                    L96(z)
                }
                let j = H.unavailable ? "unavailable" : H.shouldBlock ? "blocked" : "allowed",
                    J = H.usage && H.model ? PD1(H.model, H.usage) : void 0;
                if (d("tengu_auto_mode_decision", {
                        decision: j,
                        toolName: hq(A.name),
                        classifierModel: H.model,
                        consecutiveDenials: H.shouldBlock ? O.consecutiveDenials + 1 : 0,
                        totalDenials: H.shouldBlock ? O.totalDenials + 1 : O.totalDenials,
                        classifierInputTokens: H.usage?.inputTokens,
                        classifierOutputTokens: H.usage?.outputTokens,
                        classifierCacheReadInputTokens: H.usage?.cacheReadInputTokens,
                        classifierCacheCreationInputTokens: H.usage?.cacheCreationInputTokens,
                        classifierDurationMs: H.durationMs,
                        classifierSystemPromptLength: H.promptLengths?.systemPrompt,
                        classifierToolCallsLength: H.promptLengths?.toolCalls,
                        classifierToolResultsLength: H.promptLengths?.toolResults,
                        classifierUserPromptsLength: H.promptLengths?.userPrompts,
                        sessionInputTokens: o86(),
                        sessionOutputTokens: Mp(),
                        sessionCacheReadInputTokens: Ik6(),
                        sessionCacheCreationInputTokens: bk6(),
                        classifierCostUSD: J,
                        classifierStage: H.stage,
                        classifierStage1InputTokens: H.stage1Usage?.inputTokens,
                        classifierStage1OutputTokens: H.stage1Usage?.outputTokens,
                        classifierStage1CacheReadInputTokens: H.stage1Usage?.cacheReadInputTokens,
                        classifierStage1CacheCreationInputTokens: H.stage1Usage?.cacheCreationInputTokens,
                        classifierStage1DurationMs: H.stage1DurationMs,
                        classifierStage1RequestId: H.stage1RequestId,
                        classifierStage1CostUSD: H.stage1Usage && H.model ? PD1(H.model, H.stage1Usage) : void 0,
                        classifierStage2InputTokens: H.stage2Usage?.inputTokens,
                        classifierStage2OutputTokens: H.stage2Usage?.outputTokens,
                        classifierStage2CacheReadInputTokens: H.stage2Usage?.cacheReadInputTokens,
                        classifierStage2CacheCreationInputTokens: H.stage2Usage?.cacheCreationInputTokens,
                        classifierStage2DurationMs: H.stage2DurationMs,
                        classifierStage2RequestId: H.stage2RequestId,
                        classifierStage2CostUSD: H.stage2Usage && H.model ? PD1(H.model, H.stage2Usage) : void 0
                    }), H.durationMs !== void 0) Ku1(H.durationMs);
                if (H.shouldBlock) {
                    if (H.unavailable) {
                        if (lk("tengu_iron_gate_closed", !0, CYz)) return k("Auto mode classifier unavailable, denying with retry guidance (fail closed)", {
                            level: "warn"
                        }), {
                            behavior: "deny",
                            decisionReason: {
                                type: "classifier",
                                classifier: "auto-mode",
                                reason: "Classifier unavailable"
                            },
                            message: xn8(A.name, "auto-mode")
                        };
                        return k("Auto mode classifier unavailable, falling back to normal permission handling (fail open)", {
                            level: "warn"
                        }), _
                    }
                    let D = FKq(O);
                    I_6(K, D), k(`Auto mode classifier blocked action: ${H.reason}`, {
                        level: "warn"
                    });
                    let X = mYz(D, w, H.reason, Y, A, _, K);
                    if (X) return X;
                    let P = !!K.agentId;
                    return {
                        behavior: "deny",
                        decisionReason: {
                            type: "classifier",
                            classifier: "auto-mode",
                            reason: H.reason
                        },
                        message: afq(H.reason, P)
                    }
                }
                let M = Fi6(O);
                return I_6(K, M), {
                    behavior: "allow",
                    updatedInput: q,
                    decisionReason: {
                        type: "classifier",
                        classifier: "auto-mode",
                        reason: H.reason
                    }
                }
            }
            if (w.toolPermissionContext.shouldAvoidPermissionPrompts) {
                let O = await uYz(A, q, z, K, w.toolPermissionContext.mode, _.suggestions);
                if (O) return O;
                return {
                    behavior: "deny",
                    decisionReason: {
                        type: "asyncAgent",
                        reason: "Permission prompts are not available in this context"
                    },
                    message: rfq(A.name)
                }
            }
        }
        return _
    }
// @from(Ln 444261, Col 4)
Bj = E(() => {
    F$();
    s8();
    wv();
    k1();
    H1();
    Km();
    SP();
    O2();
    sy();
    Qr6();
    Lz();
    rD();
    jZ();
    g1();
    lc6();
    Ve();
    T1();
    up8();
    uv();
    JA();
    hw();
    V1();
    o$();
    Mt();
    HA();
    SYz = (cfq(), k4(dfq)), un8 = [...VG, "cliArg", "command", "session"]
})
// @from(Ln 444289, Col 4)
y1q = {}
// @from(Ln 444325, Col 0)
function QYz() {
    let A = X1().oauthAccount?.organizationUuid;
    if (lr6 && lr6.orgId === A) return lr6.result;
    if (!A) return k("DAC org allowlist check: no org ID (OAuth not active)"), lr6 = {
        orgId: A,
        result: !1
    }, !1;
    let q = t6(process.env.USE_STAGING_OAUTH),
        Y = ((q ? sfq?.DAC_ALLOWLISTED_ORG_IDS_STAGING : sfq?.DAC_ALLOWLISTED_ORG_IDS_PRODUCTION) ?? []).includes(A);
    return k(`DAC org allowlist check: org=${A} env=${q?"staging":"production"} result=${Y?"allowed":"denied"}`), lr6 = {
        orgId: A,
        result: Y
    }, Y
}
// @from(Ln 444340, Col 0)
function efq(A, q) {
    if (A !== Q7) return !1;
    if (q === void 0 || q === "") return !0;
    let K = q.trim().toLowerCase();
    if (K === "*") return !0;
    for (let Y of pYz) {
        let z = Y.toLowerCase();
        if (K === z) return !0;
        if (K === `${z}:*`) return !0;
        if (K === `${z}*`) return !0;
        if (K === `${z} *`) return !0;
        if (K.startsWith(`${z} -`) && K.endsWith("*")) return !0
    }
    return !1
}
// @from(Ln 444356, Col 0)
function ATq(A, q) {
    return EG(A) === r4
}
// @from(Ln 444360, Col 0)
function qTq(A) {
    if (VG.includes(A)) {
        let q = F_(A);
        if (q) {
            let K = gYz(G1(), q);
            return K.length < q.length ? K : q
        }
    }
    return A
}
// @from(Ln 444371, Col 0)
function tfq(A, q) {
    return efq(A, q) || ATq(A, q)
}
// @from(Ln 444375, Col 0)
function Fn8(A, q) {
    let K = [];
    for (let Y of A)
        if (Y.ruleBehavior === "allow" && tfq(Y.ruleValue.toolName, Y.ruleValue.ruleContent)) {
            let z = Y.ruleValue.ruleContent ? `${Y.ruleValue.toolName}(${Y.ruleValue.ruleContent})` : `${Y.ruleValue.toolName}(*)`;
            K.push({
                ruleValue: Y.ruleValue,
                source: Y.source,
                ruleDisplay: z,
                sourceDisplay: qTq(Y.source)
            })
        } for (let Y of q) {
        let z = Y.match(/^([^(]+)(?:\(([^)]*)\))?$/);
        if (z) {
            let _ = z[1].trim(),
                w = z[2]?.trim();
            if (tfq(_, w)) K.push({
                ruleValue: {
                    toolName: _,
                    ruleContent: w
                },
                source: "cliArg",
                ruleDisplay: w ? Y : `${_}(*)`,
                sourceDisplay: "--allowed-tools"
            })
        }
    }
    return K
}
// @from(Ln 444405, Col 0)
function gn8(A) {
    return A.toolName === Q7 && A.ruleContent === void 0
}
// @from(Ln 444409, Col 0)
function UYz(A, q) {
    let K = [];
    for (let Y of A)
        if (Y.ruleBehavior === "allow" && gn8(Y.ruleValue)) K.push({
            ruleValue: Y.ruleValue,
            source: Y.source,
            ruleDisplay: `${Q7}(*)`,
            sourceDisplay: qTq(Y.source)
        });
    for (let Y of q) {
        let z = CH(Y);
        if (gn8(z)) K.push({
            ruleValue: z,
            source: "cliArg",
            ruleDisplay: `${Q7}(*)`,
            sourceDisplay: "--allowed-tools"
        })
    }
    return K
}
// @from(Ln 444430, Col 0)
function KTq(A) {
    return ["userSettings", "projectSettings", "localSettings", "session", "cliArg"].includes(A)
}
// @from(Ln 444434, Col 0)
function YTq(A, q) {
    let K = new Map;
    for (let z of q) {
        if (!KTq(z.source)) continue;
        let _ = z.source,
            w = K.get(_) || [];
        w.push(z.ruleValue), K.set(_, w)
    }
    let Y = A;
    for (let [z, _] of K) Y = Ez(Y, {
        type: "removeRules",
        rules: _,
        behavior: "allow",
        destination: z
    });
    return Y
}
// @from(Ln 444452, Col 0)
function Vi(A) {
    let q = [];
    for (let [z, _] of Object.entries(A.alwaysAllowRules)) {
        if (!_) continue;
        for (let w of _) {
            let O = CH(w);
            q.push({
                source: z,
                ruleBehavior: "allow",
                ruleValue: O
            })
        }
    }
    let K = Fn8(q, []);
    if (K.length === 0) return A;
    for (let z of K) k(`Ignoring dangerous permission ${z.ruleDisplay} from ${z.sourceDisplay} (bypasses classifier)`);
    let Y = {};
    for (let z of K) {
        if (!KTq(z.source)) continue;
        (Y[z.source] ??= []).push(L5(z.ruleValue))
    }
    return {
        ...YTq(A, K),
        strippedDangerousRules: Y
    }
}
// @from(Ln 444479, Col 0)
function x_6(A) {
    let q = A.strippedDangerousRules;
    if (!q) return A;
    let K = A;
    for (let [Y, z] of Object.entries(q)) {
        if (!z || z.length === 0) continue;
        K = Ez(K, {
            type: "addRules",
            rules: z.map(CH),
            behavior: "allow",
            destination: Y
        })
    }
    return {
        ...K,
        strippedDangerousRules: void 0
    }
}
// @from(Ln 444498, Col 0)
function ki(A, q, K) {
    if (A === q) return K;
    if (Dp(A, q), Qu1(A, q, K.prePlanMode), A === "plan" && q !== "plan") HV(!0);
    {
        if (q === "plan" && A !== "plan") return LT6(K);
        let Y = A === "auto" || A === "plan" && K.prePlanMode === "auto",
            z = q === "auto";
        if (z && !Y) {
            if (!IN()) throw Error("Cannot transition to auto mode: gate is not enabled");
            yF?.setAutoModeActive(!0), K = Vi(K)
        } else if (Y && !z) yF?.setAutoModeActive(!1), K = x_6(K)
    }
    if (A === "plan" && q !== "plan" && K.prePlanMode) return {
        ...K,
        prePlanMode: void 0
    };
    return K
}
// @from(Ln 444517, Col 0)
function zTq(A) {
    let q = A.join(" ").trim();
    if (Z4q(q)) return vF8();
    return Kh(A)
}
// @from(Ln 444523, Col 0)
function dYz({
    processPwd: A,
    originalCwd: q
}) {
    let {
        resolvedPath: K,
        isSymlink: Y
    } = qO($1(), A);
    return Y ? K === FYz(q) : !1
}
// @from(Ln 444534, Col 0)
function pn8({
    permissionModeCli: A,
    dangerouslySkipPermissions: q
}) {
    let K = PA() || {},
        Y = jY("tengu_disable_bypass_permissions_mode"),
        z = K.permissions?.disableBypassPermissionsMode === "disable",
        _ = Y || z,
        w = J16() === "disabled",
        O = [],
        $;
    if (q) O.push("bypassPermissions");
    if (A) {
        let j = wC(A);
        if (j === "auto")
            if (w) k("auto mode circuit breaker active (cached) — falling back to default", {
                level: "warn"
            });
            else O.push("auto");
        else O.push(j)
    }
    if (K.permissions?.defaultMode) {
        let j = K.permissions.defaultMode;
        if (t6(process.env.CLAUDE_CODE_REMOTE) && !["acceptEdits", "plan", "default"].includes(j)) k(`settings defaultMode "${j}" is not supported in CLAUDE_CODE_REMOTE — only acceptEdits and plan are allowed`, {
            level: "warn"
        }), d("tengu_ccr_unsupported_default_mode_ignored", {
            mode: j
        });
        else if (j === "auto")
            if (w) k("auto mode circuit breaker active (cached) — falling back to default", {
                level: "warn"
            });
            else O.push("auto");
        else O.push(j)
    }
    let H;
    for (let j of O) {
        if (j === "bypassPermissions" && _) {
            if (Y) k("bypassPermissions mode is disabled by Statsig gate", {
                level: "warn"
            }), $ = "Bypass permissions mode was disabled by your organization policy";
            else k("bypassPermissions mode is disabled by settings", {
                level: "warn"
            }), $ = "Bypass permissions mode was disabled by settings";
            continue
        }
        H = {
            mode: j,
            notification: $
        };
        break
    }
    if (!H) H = {
        mode: "default",
        notification: $
    };
    if (!H) H = {
        mode: "default",
        notification: $
    };
    if (H.mode === "auto") yF?.setAutoModeActive(!0);
    return H
}
// @from(Ln 444598, Col 0)
function Kh(A) {
    if (A.length === 0) return [];
    let q = [];
    for (let K of A) {
        if (!K) continue;
        let Y = "",
            z = !1;
        for (let _ of K) switch (_) {
            case "(":
                z = !0, Y += _;
                break;
            case ")":
                z = !1, Y += _;
                break;
            case ",":
                if (z) Y += _;
                else {
                    if (Y.trim()) q.push(Y.trim());
                    Y = ""
                }
                break;
            case " ":
                if (z) Y += _;
                else if (Y.trim()) q.push(Y.trim()), Y = "";
                break;
            default:
                Y += _
        }
        if (Y.trim()) q.push(Y.trim())
    }
    return q
}
// @from(Ln 444630, Col 0)
async function Qn8({
    allowedToolsCli: A,
    disallowedToolsCli: q,
    baseToolsCli: K,
    permissionMode: Y,
    allowDangerouslySkipPermissions: z,
    addDirs: _
}) {
    let w = Kh(A).map((N) => L5(CH(N))),
        O = Kh(q);
    if (K && K.length > 0) {
        let N = zTq(K),
            V = new Set(N.map(EG)),
            h = vF8().filter((R) => !V.has(R));
        O = [...O, ...h]
    }
    let $ = [],
        H = new Map,
        j = process.env.PWD;
    if (j && j !== AA() && dYz({
            originalCwd: AA(),
            processPwd: j
        })) H.set(j, {
        path: j,
        source: "session"
    });
    let J = jY("tengu_disable_bypass_permissions_mode"),
        M = PA() || {},
        D = M.permissions?.disableBypassPermissionsMode === "disable",
        X = (Y === "bypassPermissions" || z) && !J && !D,
        P = tz1(),
        W = [],
        Z = [];
    if (Y === "auto") Z = Fn8(P, w);
    let G = nfq({
            mode: Y,
            additionalWorkingDirectories: H,
            alwaysAllowRules: {
                cliArg: w
            },
            alwaysDenyRules: {
                cliArg: O
            },
            alwaysAskRules: {},
            isBypassPermissionsModeAvailable: X,
            ...{
                isAutoModeAvailable: IN()
            }
        }, P),
        f = [...M.permissions?.additionalDirectories || [], ..._],
        v = await Promise.all(f.map((N) => _v6(N, G)));
    for (let N of v)
        if (N.resultType === "success") G = Ez(G, {
            type: "addDirectories",
            directories: [N.absolutePath],
            destination: "cliArg"
        });
        else if (N.resultType !== "alreadyInWorkingDirectory" && N.resultType !== "pathNotFound") $.push(wv6(N));
    return {
        toolPermissionContext: G,
        warnings: $,
        dangerousPermissions: Z,
        overlyBroadBashPermissions: W
    }
}
// @from(Ln 444696, Col 0)
function qS1(A) {
    let q;
    switch (A) {
        case "settings":
            q = "auto mode disabled by settings";
            break;
        case "circuit-breaker":
            q = "auto mode temporarily unavailable";
            break;
        case "org-allowlist":
            q = "auto mode temporarily unavailable";
            break;
        case "model":
            q = "auto mode unavailable for this model";
            break
    }
    return q
}
// @from(Ln 444714, Col 0)
async function Dc6(A, q) {
    let K = !0,
        Y = await rR("tengu_auto_mode_config", {}),
        z = _Tq(Y?.enabled),
        _ = Un8();
    yF?.setAutoModeCircuitBroken(z === "disabled" || _);
    let w = cK(),
        O = !!Y?.disableFastMode && (!!q || !1),
        $ = IN6(w) && !O,
        H = !1;
    if (K && z !== "disabled" && !_ && $) H = z === "enabled" || my1();
    let j = K && z !== "disabled" && !_ && $,
        J = yF?.getAutoModeFlagCli() ?? !1,
        M = (f, v) => f.isAutoModeAvailable === v ? f : {
            ...f,
            isAutoModeAvailable: v
        };
    if (j) return {
        updateContext: (f) => M(f, H)
    };
    let D;
    if (_) D = "settings", k("auto mode disabled: disableAutoMode in settings", {
        level: "warn"
    });
    else if (z === "disabled") D = "circuit-breaker", k('auto mode disabled: tengu_auto_mode_config.enabled === "disabled" (circuit breaker)', {
        level: "warn"
    });
    else if (!$) D = "model", k(`auto mode disabled: model ${cK()} does not support auto mode`, {
        level: "warn"
    });
    else D = "org-allowlist", k("auto mode disabled: org not in DAC allowlist (async check)", {
        level: "warn"
    });
    let X = qS1(D),
        P = (f) => {
            let v = f.mode === "auto",
                N = f.mode === "plan" && f.prePlanMode === "auto";
            if (!v && !N) return M(f, !1);
            if (yF?.setAutoModeActive(!1), MS(!0), v) return {
                ...Ez(x_6(f), {
                    type: "setMode",
                    mode: "default",
                    destination: "session"
                }),
                isAutoModeAvailable: !1
            };
            return {
                ...x_6(f),
                prePlanMode: "default",
                isAutoModeAvailable: !1
            }
        },
        W = A.mode === "auto",
        Z = A.mode === "plan" && A.prePlanMode === "auto";
    if (!(W || Z || J)) return {
        updateContext: P
    };
    if (W || Z) return {
        updateContext: P,
        notification: X
    };
    return {
        updateContext: P,
        notification: A.isAutoModeAvailable ? X : void 0
    }
}
// @from(Ln 444781, Col 0)
function bv1() {
    return ln8("tengu_disable_bypass_permissions_mode")
}
// @from(Ln 444785, Col 0)
function Un8() {
    let A = PA() || {};
    return A.disableAutoMode === "disable" || A.permissions?.disableAutoMode === "disable"
}
// @from(Ln 444790, Col 0)
function IN() {
    if (yF?.isAutoModeCircuitBroken() ?? !1) return !1;
    if (Un8()) return !1;
    if (!IN6(cK())) return !1;
    return !0
}
// @from(Ln 444797, Col 0)
function dn8() {
    if (Un8()) return "settings";
    if (yF?.isAutoModeCircuitBroken() ?? !1) return "circuit-breaker";
    if (!IN6(cK())) return "model";
    return null
}
// @from(Ln 444804, Col 0)
function _Tq(A) {
    if (A === "enabled" || A === "disabled" || A === "opt-in") return A;
    return cYz
}
// @from(Ln 444809, Col 0)
function J16() {
    let A = w8("tengu_auto_mode_config", {});
    return _Tq(A?.enabled)
}
// @from(Ln 444814, Col 0)
function my1() {
    if (yF?.getAutoModeFlagCli() ?? !1) return !0;
    return s16()
}
// @from(Ln 444819, Col 0)
function bd() {
    let A = jY("tengu_disable_bypass_permissions_mode"),
        K = (PA() || {}).permissions?.disableBypassPermissionsMode === "disable";
    return A || K
}
// @from(Ln 444825, Col 0)
function X36(A) {
    let q = A;
    if (A.mode === "bypassPermissions") q = Ez(A, {
        type: "setMode",
        mode: "default",
        destination: "session"
    });
    return {
        ...q,
        isBypassPermissionsModeAvailable: !1
    }
}
// @from(Ln 444837, Col 0)
async function cn8(A) {
    if (!A.isBypassPermissionsModeAvailable) return;
    if (!await bv1()) return;
    k("bypassPermissions mode is being disabled by Statsig gate (async check)", {
        level: "warn"
    }), Vq(1, "bypass_permissions_disabled")
}
// @from(Ln 444845, Col 0)
function KS1() {
    return (PA() || {}).permissions?.defaultMode === "auto"
}
// @from(Ln 444849, Col 0)
function LT6(A) {
    let q = A.mode;
    if (q === "plan") return A;
    if (q === "auto") return {
        ...A,
        prePlanMode: "auto"
    };
    if (KS1() && IN() && q !== "bypassPermissions") return yF?.setAutoModeActive(!0), {
        ...Vi(A),
        prePlanMode: "auto"
    };
    return {
        ...A,
        prePlanMode: q
    }
}
// @from(Ln 444865, Col 4)
yF
// @from(Ln 444865, Col 8)
sfq = null
// @from(Ln 444866, Col 4)
pYz
// @from(Ln 444866, Col 9)
lr6 = null
// @from(Ln 444867, Col 4)
cYz = "disabled"
// @from(Ln 444868, Col 4)
rJ = E(() => {
    A8();
    lA();
    Bj();
    Km();
    rD();
    T1();
    i8();
    O2();
    jy1();
    F$();
    SA();
    HA();
    H1();
    V1();
    c_();
    z4();
    Mf();
    IX();
    SP();
    k8();
    yF = k4(VT6), pYz = ["python", "python3", "python2", "node", "deno", "tsx", "ruby", "perl", "php", "lua", "bash", "sh", "zsh", "fish", "npm run", "yarn run", "pnpm run", "bun run", "npx", "bunx", "eval", "exec", "env", "xargs", "sudo", "ssh", ...[]]
})
// @from(Ln 444911, Col 0)
function ad(A, q = "Custom item") {
    let K = A.split(`
`);
    for (let Y of K) {
        let z = Y.trim();
        if (z) {
            let w = z.match(/^#+\s+(.+)$/)?.[1] ?? z;
            return w.length > 100 ? w.substring(0, 97) + "..." : w
        }
    }
    return q
}
// @from(Ln 444924, Col 0)
function $Tq(A) {
    if (A === void 0 || A === null) return null;
    if (!A) return [];
    let q = [];
    if (typeof A === "string") q = [A];
    else if (Array.isArray(A)) q = A.filter((Y) => typeof Y === "string");
    if (q.length === 0) return [];
    let K = Kh(q);
    if (K.includes("*")) return ["*"];
    return K
}
// @from(Ln 444936, Col 0)
function X96(A) {
    let q = $Tq(A);
    if (q === null) return A === void 0 ? void 0 : [];
    if (q.includes("*")) return;
    return q
}
// @from(Ln 444943, Col 0)
function LI(A) {
    let q = $Tq(A);
    if (q === null) return [];
    return q
}
// @from(Ln 444948, Col 0)
async function tYz(A) {
    try {
        let q = await oYz(A, {
            bigint: !0
        });
        if (q.dev === 0n && q.ino === 0n) return null;
        return `${q.dev}:${q.ino}`
    } catch {
        return null
    }
}
// @from(Ln 444960, Col 0)
function eYz(A) {
    let q = H_(A),
        K = H_(qY());
    if (!q || !K) return q;
    let Y = LJ(A);
    if (Y && $$(Y) === $$(K)) return q;
    let z = $$(q),
        _ = $$(K);
    if (z !== _ && z.startsWith(_ + iYz)) return K;
    return q
}
// @from(Ln 444972, Col 0)
function DV8(A, q) {
    let K = wTq(sYz()).normalize("NFC"),
        Y = eYz(q),
        z = wTq(q),
        _ = [];
    if (!nn8(z)) return _;
    while (!0) {
        if ($$(z) === $$(K)) break;
        let w = bN6(z, ".claude", A);
        if (nn8(w)) _.push(w);
        if (Y && $$(z) === $$(Y)) break;
        let O = lYz(z);
        if (O === z) break;
        z = O
    }
    return _
}
// @from(Ln 444989, Col 0)
async function Azz(A, q) {
    let K = [],
        Y = new Set;
    async function z(_) {
        if (q.aborted) return;
        try {
            let w = await OTq(_, {
                bigint: !0
            });
            if (w.isDirectory()) {
                let O = w.dev !== void 0 && w.ino !== void 0 ? `${w.dev}:${w.ino}` : await aYz(_);
                if (Y.has(O)) {
                    k(`Skipping already visited directory (circular symlink): ${_}`);
                    return
                }
                Y.add(O)
            }
        } catch (w) {
            let O = w instanceof Error ? w.message : String(w);
            k(`Failed to stat directory ${_}: ${O}`);
            return
        }
        try {
            let w = await nYz(_, {
                withFileTypes: !0
            });
            for (let O of w) {
                if (q.aborted) break;
                let $ = bN6(_, O.name);
                try {
                    if (O.isSymbolicLink()) try {
                            let H = await OTq($);
                            if (H.isDirectory()) await z($);
                            else if (H.isFile() && O.name.endsWith(".md")) K.push($)
                        } catch (H) {
                            let j = H instanceof Error ? H.message : String(H);
                            k(`Failed to follow symlink ${$}: ${j}`)
                        } else if (O.isDirectory()) await z($);
                        else if (O.isFile() && O.name.endsWith(".md")) K.push($)
                } catch (H) {
                    let j = H instanceof Error ? H.message : String(H);
                    k(`Failed to access ${$}: ${j}`)
                }
            }
        } catch (w) {
            let O = w instanceof Error ? w.message : String(w);
            k(`Failed to read directory ${_}: ${O}`)
        }
    }
    return await z(A), K
}
// @from(Ln 445040, Col 0)
async function in8(A) {
    if (!nn8(A)) return [];
    let q = t6(process.env.CLAUDE_CODE_USE_NATIVE_FILE_SEARCH),
        K = AbortSignal.timeout(3000),
        Y = q ? await Azz(A, K) : await yV(["--files", "--hidden", "--follow", "--no-ignore", "--glob", "*.md"], A, K);
    return (await Promise.all(Y.map(async (_) => {
        try {
            let w = await rYz(_, {
                    encoding: "utf-8"
                }),
                {
                    frontmatter: O,
                    content: $
                } = BH(w, _);
            return {
                filePath: _,
                frontmatter: O,
                content: $
            }
        } catch (w) {
            let O = w instanceof Error ? w.message : String(w);
            return k(`Failed to read/parse markdown file:  ${_}: ${O}`), null
        }
    }))).filter((_) => _ !== null)
}
// @from(Ln 445065, Col 4)
X3q
// @from(Ln 445065, Col 9)
sd
// @from(Ln 445066, Col 4)
td = E(() => {
    jy();
    BG();
    rJ();
    H1();
    A8();
    So();
    V1();
    O2();
    U4();
    $5();
    T1();
    Z7();
    X3q = ["commands", "agents", "output-styles", "skills", "workflows"];
    sd = e1(async function(A, q) {
        let K = Date.now(),
            Y = bN6(c8(), A),
            z = bN6(bW(), ".claude", A),
            _ = DV8(A, q),
            w = H_(q),
            O = LJ(q);
        if (w && O && O !== w) {
            let Z = $$(bN6(w, ".claude", A));
            if (!_.some((f) => $$(f) === Z)) {
                let f = bN6(O, ".claude", A);
                if (!_.includes(f)) _.push(f)
            }
        }
        let [$, H, j] = await Promise.all([in8(z).then((Z) => Z.map((G) => ({
            ...G,
            baseDir: z,
            source: "policySettings"
        }))), SH("userSettings") ? in8(Y).then((Z) => Z.map((G) => ({
            ...G,
            baseDir: Y,
            source: "userSettings"
        }))) : Promise.resolve([]), SH("projectSettings") ? Promise.all(_.map((Z) => in8(Z).then((G) => G.map((f) => ({
            ...f,
            baseDir: Z,
            source: "projectSettings"
        }))))) : Promise.resolve([])]), J = j.flat(), M = [...$, ...H, ...J], D = await Promise.all(M.map((Z) => tYz(Z.filePath))), X = new Map, P = [];
        for (let [Z, G] of M.entries()) {
            let f = D[Z] ?? null;
            if (f === null) {
                P.push(G);
                continue
            }
            let v = X.get(f);
            if (v !== void 0) {
                k(`Skipping duplicate file '${G.filePath}' from ${G.source} (same inode already loaded from ${v})`);
                continue
            }
            X.set(f, G.source), P.push(G)
        }
        let W = M.length - P.length;
        if (W > 0) k(`Deduplicated ${W} files in ${A} (same inode via symlinks or hard links)`);
        return d("tengu_dir_search", {
            durationMs: Date.now() - K,
            managedFilesFound: $.length,
            userFilesFound: H.length,
            projectFilesFound: J.length,
            projectDirsSearched: _.length,
            subdir: A
        }), P
    }, (A, q) => `${A}:${q}`)
})
// @from(Ln 445135, Col 4)
HTq
// @from(Ln 445136, Col 4)
jTq = E(() => {
    U4();
    k1();
    td();
    c01();
    H1();
    BG();
    HTq = e1(async (A) => {
        try {
            return (await sd("output-styles", A)).map(({
                filePath: Y,
                frontmatter: z,
                content: _,
                source: w
            }) => {
                try {
                    let $ = qzz(Y).replace(/\.md$/, ""),
                        H = z.name || $,
                        j = NL(z.description, $) ?? ad(_, `Custom ${$} output style`),
                        J = z["keep-coding-instructions"],
                        M = J === !0 || J === "true" ? !0 : J === !1 || J === "false" ? !1 : void 0;
                    if (z["force-for-plugin"] !== void 0) k(`Output style "${H}" has force-for-plugin set, but this option only applies to plugin output styles. Ignoring.`, {
                        level: "warn"
                    });
                    return {
                        name: H,
                        description: j,
                        prompt: _.trim(),
                        source: w,
                        keepCodingInstructions: M
                    }
                } catch (O) {
                    return _6(O), null
                }
            }).filter((Y) => Y !== null)
        } catch (q) {
            return _6(q), []
        }
    })
})
// @from(Ln 445177, Col 0)
function q24() {
    Tv6.cache?.clear?.()
}
// @from(Ln 445180, Col 0)
async function IZq() {
    let A = await Tv6(G1()),
        q = Object.values(A).filter((_) => _ !== null && _.source === "plugin" && _.forceForPlugin === !0),
        K = q[0];
    if (K) {
        if (q.length > 1) k(`Multiple plugins have forced output styles: ${q.map((_)=>_.name).join(", ")}. Using: ${K.name}`, {
            level: "warn"
        });
        return k(`Using forced plugin output style: ${K.name}`), K
    }
    let z = PA()?.outputStyle || hf;
    return A[z] ?? null
}
// @from(Ln 445193, Col 4)
JTq
// @from(Ln 445193, Col 9)
hf = "default"
// @from(Ln 445194, Col 4)
aY6
// @from(Ln 445194, Col 9)
Tv6
// @from(Ln 445195, Col 4)
aB = E(() => {
    b7();
    U4();
    i8();
    jTq();
    c01();
    lA();
    H1();
    JTq = `
## Insights
In order to encourage learning, before and after writing code, always provide brief educational explanations about implementation choices using (with backticks):
"\`${a6.star} Insight ─────────────────────────────────────\`
[2-3 key educational points]
\`─────────────────────────────────────────────────\`"

These insights should be included in the conversation, not in the codebase. You should generally focus on interesting insights that are specific to the codebase or the code you just wrote, rather than general programming concepts.`, aY6 = {
        [hf]: null,
        Explanatory: {
            name: "Explanatory",
            source: "built-in",
            description: "Claude explains its implementation choices and codebase patterns",
            keepCodingInstructions: !0,
            prompt: `You are an interactive CLI tool that helps users with software engineering tasks. In addition to software engineering tasks, you should provide educational insights about the codebase along the way.

You should be clear and educational, providing helpful explanations while remaining focused on the task. Balance educational content with task completion. When providing insights, you may exceed typical length constraints, but remain focused and relevant.

# Explanatory Style Active
${JTq}`
        },
        Learning: {
            name: "Learning",
            source: "built-in",
            description: "Claude pauses and asks you to write small pieces of code for hands-on practice",
            keepCodingInstructions: !0,
            prompt: `You are an interactive CLI tool that helps users with software engineering tasks. In addition to software engineering tasks, you should help users learn more about the codebase through hands-on practice and educational insights.

You should be collaborative and encouraging. Balance task completion with learning by requesting user input for meaningful design decisions while handling routine implementation yourself.   

# Learning Style Active
## Requesting Human Contributions
In order to encourage learning, ask the human to contribute 2-10 line code pieces when generating 20+ lines involving:
- Design decisions (error handling, data structures)
- Business logic with multiple valid approaches  
- Key algorithms or interface definitions

**TodoList Integration**: If using a TodoList for the overall task, include a specific todo item like "Request human input on [specific decision]" when planning to request human input. This ensures proper task tracking. Note: TodoList is not required for all tasks.

Example TodoList flow:
   ✓ "Set up component structure with placeholder for logic"
   ✓ "Request human collaboration on decision logic implementation"
   ✓ "Integrate contribution and complete feature"

### Request Format
\`\`\`
${a6.bullet} **Learn by Doing**
**Context:** [what's built and why this decision matters]
**Your Task:** [specific function/section in file, mention file and TODO(human) but do not include line numbers]
**Guidance:** [trade-offs and constraints to consider]
\`\`\`

### Key Guidelines
- Frame contributions as valuable design decisions, not busy work
- You must first add a TODO(human) section into the codebase with your editing tools before making the Learn by Doing request      
- Make sure there is one and only one TODO(human) section in the code
- Don't take any action or output anything after the Learn by Doing request. Wait for human implementation before proceeding.

### Example Requests

**Whole Function Example:**
\`\`\`
${a6.bullet} **Learn by Doing**

**Context:** I've set up the hint feature UI with a button that triggers the hint system. The infrastructure is ready: when clicked, it calls selectHintCell() to determine which cell to hint, then highlights that cell with a yellow background and shows possible values. The hint system needs to decide which empty cell would be most helpful to reveal to the user.

**Your Task:** In sudoku.js, implement the selectHintCell(board) function. Look for TODO(human). This function should analyze the board and return {row, col} for the best cell to hint, or null if the puzzle is complete.

**Guidance:** Consider multiple strategies: prioritize cells with only one possible value (naked singles), or cells that appear in rows/columns/boxes with many filled cells. You could also consider a balanced approach that helps without making it too easy. The board parameter is a 9x9 array where 0 represents empty cells.
\`\`\`

**Partial Function Example:**
\`\`\`
${a6.bullet} **Learn by Doing**

**Context:** I've built a file upload component that validates files before accepting them. The main validation logic is complete, but it needs specific handling for different file type categories in the switch statement.

**Your Task:** In upload.js, inside the validateFile() function's switch statement, implement the 'case "document":' branch. Look for TODO(human). This should validate document files (pdf, doc, docx).

**Guidance:** Consider checking file size limits (maybe 10MB for documents?), validating the file extension matches the MIME type, and returning {valid: boolean, error?: string}. The file object has properties: name, size, type.
\`\`\`

**Debugging Example:**
\`\`\`
${a6.bullet} **Learn by Doing**

**Context:** The user reported that number inputs aren't working correctly in the calculator. I've identified the handleInput() function as the likely source, but need to understand what values are being processed.

**Your Task:** In calculator.js, inside the handleInput() function, add 2-3 console.log statements after the TODO(human) comment to help debug why number inputs fail.

**Guidance:** Consider logging: the raw input value, the parsed result, and any validation state. This will help us understand where the conversion breaks.
\`\`\`

### After Contributions
Share one insight connecting their code to broader patterns or system effects. Avoid praise or repetition.

## Insights
${JTq}`
        }
    }, Tv6 = e1(async function(q) {
        let K = await HTq(q),
            Y = await Ik8(),
            z = {
                ...aY6
            },
            _ = K.filter((H) => H.source === "policySettings"),
            w = K.filter((H) => H.source === "userSettings"),
            O = K.filter((H) => H.source === "projectSettings"),
            $ = [Y, w, O, _];
        for (let H of $)
            for (let j of H) z[j.name] = {
                name: j.name,
                description: j.description,
                prompt: j.prompt,
                source: j.source,
                keepCodingInstructions: j.keepCodingInstructions,
                forceForPlugin: j.forceForPlugin
            };
        return z
    })
})
// @from(Ln 445328, Col 0)
function Kzz() {
    return qH(), k4(Qd4)
}
// @from(Ln 445332, Col 0)
function QT6(A) {
    if (Z3() && w8("tengu_amber_prism", !1)) return A + Yzz;
    return A
}
// @from(Ln 445337, Col 0)
function rfq(A) {
    return `Permission to use ${A} has been denied. ${en8}`
}
// @from(Ln 445341, Col 0)
function ofq(A) {
    return `Permission to use ${A} has been denied because Claude Code is running in don't ask mode. ${en8}`
}
// @from(Ln 445345, Col 0)
function o04(A) {
    return A.startsWith(WTq) || A.startsWith(ZTq) || A.startsWith(zzz) || A.startsWith(_zz)
}
// @from(Ln 445349, Col 0)
function afq(A, q) {
    let K = q ? ZTq : WTq,
        Y = "To allow this type of action in the future, the user can add a Bash permission rule to their settings.";
    return `${K}${A}. If you have other tasks that don't depend on this action, continue working on those. ${en8} To allow this type of action in the future, the user can add a Bash permission rule to their settings.`
}
// @from(Ln 445355, Col 0)
function xn8(A, q) {
    let K = q === "data-exfiltration" ? "data exfiltration classifier" : "auto mode classifier",
        Y = "";
    return `The ${K} is temporarily unavailable, so ${A} cannot be used right now. Wait briefly and then try this action again. If it keeps failing, continue with other tasks that don't require this action and come back to it later. Note: reading files, searching code, and other read-only operations do not require the classifier and can still be used. (dacEnabled=n/a, hasExtraBody=${!!process.env.CLAUDE_CODE_EXTRA_BODY})`
}
// @from(Ln 445361, Col 0)
function Hz6(A) {
    return A.type !== "progress" && A.type !== "attachment" && A.type !== "system" && Array.isArray(A.message.content) && A.message.content[0]?.type === "text" && TF6.has(A.message.content[0].text)
}
// @from(Ln 445365, Col 0)
function rn8(A) {
    return A.type === "assistant" && A.isApiErrorMessage === !0 && A.message.model === $36
}
// @from(Ln 445369, Col 0)
function bX(A) {
    return A.findLast((q) => q.type === "assistant")
}
// @from(Ln 445373, Col 0)
function ri6(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K && K.type === "assistant") {
            let z = K.message.content;
            if (Array.isArray(z)) return z.some((_) => _.type === "tool_use")
        }
    }
    return !1
}
// @from(Ln 445384, Col 0)
function GTq({
    content: A,
    isApiErrorMessage: q = !1,
    apiError: K,
    error: Y,
    errorDetails: z,
    usage: _ = {
        input_tokens: 0,
        output_tokens: 0,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
        server_tool_use: {
            web_search_requests: 0,
            web_fetch_requests: 0
        },
        service_tier: null,
        cache_creation: {
            ephemeral_1h_input_tokens: 0,
            ephemeral_5m_input_tokens: 0
        },
        inference_geo: null,
        iterations: null,
        speed: null
    }
}) {
    return {
        type: "assistant",
        uuid: SE(),
        timestamp: new Date().toISOString(),
        message: {
            id: SE(),
            container: null,
            model: $36,
            role: "assistant",
            stop_reason: "stop_sequence",
            stop_sequence: "",
            type: "message",
            usage: _,
            content: A,
            context_management: null
        },
        requestId: void 0,
        apiError: K,
        error: Y,
        errorDetails: z,
        isApiErrorMessage: q
    }
}
// @from(Ln 445433, Col 0)
function $Z({
    content: A,
    usage: q
}) {
    return GTq({
        content: typeof A === "string" ? [{
            type: "text",
            text: A === "" ? wE : A
        }] : A,
        usage: q
    })
}
// @from(Ln 445446, Col 0)
function y9({
    content: A,
    apiError: q,
    error: K,
    errorDetails: Y
}) {
    return GTq({
        content: [{
            type: "text",
            text: A === "" ? wE : A
        }],
        isApiErrorMessage: !0,
        apiError: q,
        error: K,
        errorDetails: Y
    })
}
// @from(Ln 445464, Col 0)
function p1({
    content: A,
    isMeta: q,
    isVisibleInTranscriptOnly: K,
    isCompactSummary: Y,
    summarizeMetadata: z,
    toolUseResult: _,
    mcpMeta: w,
    uuid: O,
    timestamp: $,
    imagePasteIds: H,
    sourceToolAssistantUUID: j,
    permissionMode: J,
    origin: M
}) {
    return {
        type: "user",
        message: {
            role: "user",
            content: A || wE
        },
        isMeta: q,
        isVisibleInTranscriptOnly: K,
        isCompactSummary: Y,
        summarizeMetadata: z,
        uuid: O || SE(),
        timestamp: $ ?? new Date().toISOString(),
        toolUseResult: _,
        mcpMeta: w,
        imagePasteIds: H,
        sourceToolAssistantUUID: j,
        permissionMode: J,
        origin: M
    }
}
// @from(Ln 445500, Col 0)
function HE({
    inputString: A,
    precedingInputBlocks: q
}) {
    if (q.length === 0) return A;
    return [...q, {
        text: A,
        type: "text"
    }]
}
// @from(Ln 445511, Col 0)
function Ug({
    toolUse: A = !1
}) {
    return p1({
        content: [{
            type: "text",
            text: A ? P0 : D66
        }]
    })
}
// @from(Ln 445522, Col 0)
function Ah() {
    return p1({
        content: `<${mL6}>Caveat: The messages below were generated by the user while running local commands. DO NOT respond to these messages or otherwise consider them in your response unless the user explicitly asks you to.</${mL6}>`,
        isMeta: !0
    })
}
// @from(Ln 445529, Col 0)
function uc6(A, q) {
    return `<${XP}>/${A}</${XP}>
            <${PP}>${A}</${PP}>
            <${Zl1}>${q}</${Zl1}>`
}
// @from(Ln 445535, Col 0)
function fTq(A, q) {
    return [Ah(), p1({
        content: uc6("model", A)
    }), p1({
        content: `<${WP}>Set model to ${q}</${WP}>`
    })]
}
// @from(Ln 445543, Col 0)
function C4q({
    toolUseID: A,
    parentToolUseID: q,
    data: K
}) {
    return {
        type: "progress",
        data: K,
        toolUseID: A,
        parentToolUseID: q,
        uuid: SE(),
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 445558, Col 0)
function CF8(A) {
    return {
        type: "tool_result",
        content: R96,
        is_error: !0,
        tool_use_id: A
    }
}
// @from(Ln 445567, Col 0)
function d4(A, q) {
    if (!A.trim() || !q.trim()) return null;
    let K = RJ6(q),
        Y = new RegExp(`<${K}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${K}>`, "gi"),
        z, _ = 0,
        w = 0,
        O = new RegExp(`<${K}(?:\\s+[^>]*?)?>`, "gi"),
        $ = new RegExp(`<\\/${K}>`, "gi");
    while ((z = Y.exec(A)) !== null) {
        let H = z[1],
            j = A.slice(w, z.index);
        _ = 0, O.lastIndex = 0;
        while (O.exec(j) !== null) _++;
        $.lastIndex = 0;
        while ($.exec(j) !== null) _--;
        if (_ === 0 && H) return H;
        w = z.index + z[0].length
    }
    return null
}
// @from(Ln 445588, Col 0)
function Gi6(A) {
    if (A.type === "progress" || A.type === "attachment" || A.type === "system") return !0;
    if (typeof A.message.content === "string") return A.message.content.trim().length > 0;
    if (A.message.content.length === 0) return !1;
    if (A.message.content.length > 1) return !0;
    if (A.message.content[0].type !== "text") return !0;
    return A.message.content[0].text.trim().length > 0 && A.message.content[0].text !== wE && A.message.content[0].text !== P0
}
// @from(Ln 445597, Col 0)
function qr6(A, q) {
    let K = q.toString(16).padStart(12, "0");
    return `${A.slice(0,24)}${K}`
}
// @from(Ln 445602, Col 0)
function JM(A) {
    let q = !1;
    return A.flatMap((K) => {
        switch (K.type) {
            case "assistant":
                return q = q || K.message.content.length > 1, K.message.content.map((Y, z) => {
                    let _ = q ? qr6(K.uuid, z) : K.uuid;
                    return {
                        type: "assistant",
                        timestamp: K.timestamp,
                        message: {
                            ...K.message,
                            content: [Y],
                            context_management: K.message.context_management ?? null
                        },
                        isMeta: K.isMeta,
                        requestId: K.requestId,
                        uuid: _,
                        error: K.error,
                        isApiErrorMessage: K.isApiErrorMessage
                    }
                });
            case "attachment":
                return [K];
            case "progress":
                return [K];
            case "system":
                return [K];
            case "user": {
                if (typeof K.message.content === "string") {
                    let z = q ? qr6(K.uuid, 0) : K.uuid;
                    return [{
                        ...K,
                        uuid: z,
                        message: {
                            ...K.message,
                            content: [{
                                type: "text",
                                text: K.message.content
                            }]
                        }
                    }]
                }
                q = q || K.message.content.length > 1;
                let Y = 0;
                return K.message.content.map((z, _) => {
                    let w = z.type === "image",
                        O = w && K.imagePasteIds ? K.imagePasteIds[Y] : void 0;
                    if (w) Y++;
                    return {
                        ...p1({
                            content: [z],
                            toolUseResult: K.toolUseResult,
                            mcpMeta: K.mcpMeta,
                            isMeta: K.isMeta,
                            isVisibleInTranscriptOnly: K.isVisibleInTranscriptOnly,
                            timestamp: K.timestamp,
                            imagePasteIds: O !== void 0 ? [O] : void 0
                        }),
                        uuid: q ? qr6(K.uuid, _) : K.uuid
                    }
                })
            }
        }
    })
}
// @from(Ln 445669, Col 0)
function DTq(A) {
    return A.type === "assistant" && A.message.content.some((q) => q.type === "tool_use")
}
// @from(Ln 445673, Col 0)
function wl6(A) {
    return A.type === "user" && (Array.isArray(A.message.content) && A.message.content[0]?.type === "tool_result" || Boolean(A.toolUseResult))
}
// @from(Ln 445677, Col 0)
function pjq(A, q) {
    let K = new Map;
    for (let w of A) {
        if (DTq(w)) {
            let O = w.message.content[0]?.id;
            if (O) {
                if (!K.has(O)) K.set(O, {
                    toolUse: null,
                    preHooks: [],
                    toolResult: null,
                    postHooks: []
                });
                K.get(O).toolUse = w
            }
            continue
        }
        if (rr6(w) && w.attachment.hookEvent === "PreToolUse") {
            let O = w.attachment.toolUseID;
            if (!K.has(O)) K.set(O, {
                toolUse: null,
                preHooks: [],
                toolResult: null,
                postHooks: []
            });
            K.get(O).preHooks.push(w);
            continue
        }
        if (w.type === "user" && w.message.content[0]?.type === "tool_result") {
            let O = w.message.content[0].tool_use_id;
            if (!K.has(O)) K.set(O, {
                toolUse: null,
                preHooks: [],
                toolResult: null,
                postHooks: []
            });
            K.get(O).toolResult = w;
            continue
        }
        if (rr6(w) && w.attachment.hookEvent === "PostToolUse") {
            let O = w.attachment.toolUseID;
            if (!K.has(O)) K.set(O, {
                toolUse: null,
                preHooks: [],
                toolResult: null,
                postHooks: []
            });
            K.get(O).postHooks.push(w);
            continue
        }
    }
    let Y = [],
        z = new Set;
    for (let w of A) {
        if (DTq(w)) {
            let O = w.message.content[0]?.id;
            if (O && !z.has(O)) {
                z.add(O);
                let $ = K.get(O);
                if ($ && $.toolUse) {
                    if (Y.push($.toolUse), Y.push(...$.preHooks), $.toolResult) Y.push($.toolResult);
                    Y.push(...$.postHooks)
                }
            }
            continue
        }
        if (rr6(w) && (w.attachment.hookEvent === "PreToolUse" || w.attachment.hookEvent === "PostToolUse")) continue;
        if (w.type === "user" && w.message.content[0]?.type === "tool_result") continue;
        if (w.type === "system" && w.subtype === "api_error") {
            let O = Y.at(-1);
            if (O?.type === "system" && O.subtype === "api_error") Y[Y.length - 1] = w;
            else Y.push(w);
            continue
        }
        Y.push(w)
    }
    for (let w of q) Y.push(w);
    let _ = Y.at(-1);
    return Y.filter((w) => w.type !== "system" || w.subtype !== "api_error" || w === _)
}
// @from(Ln 445757, Col 0)
function rr6(A) {
    return A.type === "attachment" && (A.attachment.type === "hook_blocking_error" || A.attachment.type === "hook_cancelled" || A.attachment.type === "hook_error_during_execution" || A.attachment.type === "hook_non_blocking_error" || A.attachment.type === "hook_success" || A.attachment.type === "hook_system_message" || A.attachment.type === "hook_additional_context" || A.attachment.type === "hook_stopped_continuation")
}
// @from(Ln 445761, Col 0)
function Qjq(A, q) {
    let K = new Map,
        Y = new Map,
        z = new Map;
    for (let D of q)
        if (D.type === "assistant") {
            let X = D.message.id,
                P = K.get(X);
            if (!P) P = new Set, K.set(X, P);
            for (let W of D.message.content)
                if (W.type === "tool_use") P.add(W.id), Y.set(W.id, X), z.set(W.id, W)
        } let _ = new Map;
    for (let [D, X] of Y) _.set(D, K.get(X));
    let w = new Map,
        O = new Map,
        $ = new Map,
        H = new Map,
        j = new Set,
        J = new Set;
    for (let D of A) {
        if (D.type === "progress") {
            let X = D.parentToolUseID,
                P = w.get(X);
            if (P) P.push(D);
            else w.set(X, [D]);
            if (D.data.type === "hook_progress") {
                let W = D.data.hookEvent,
                    Z = O.get(X);
                if (!Z) Z = new Map, O.set(X, Z);
                Z.set(W, (Z.get(W) ?? 0) + 1)
            }
        }
        if (D.type === "user") {
            for (let X of D.message.content)
                if (X.type === "tool_result") {
                    if (H.set(X.tool_use_id, D), j.add(X.tool_use_id), X.is_error) J.add(X.tool_use_id)
                }
        }
        if (rr6(D)) {
            let X = D.attachment.toolUseID,
                P = D.attachment.hookEvent,
                W = D.attachment.hookName;
            if (W !== void 0) {
                let Z = $.get(X);
                if (!Z) Z = new Map, $.set(X, Z);
                let G = Z.get(P);
                if (!G) G = new Set, Z.set(P, G);
                G.add(W)
            }
        }
    }
    let M = new Map;
    for (let [D, X] of $) {
        let P = new Map;
        for (let [W, Z] of X) P.set(W, Z.size);
        M.set(D, P)
    }
    return {
        siblingToolUseIDs: _,
        progressMessagesByToolUseID: w,
        inProgressHookCounts: O,
        resolvedHookCounts: M,
        toolResultByToolUseID: H,
        toolUseByToolUseID: z,
        normalizedMessageCount: A.length,
        resolvedToolUseIDs: j,
        erroredToolUseIDs: J
    }
}
// @from(Ln 445831, Col 0)
function Ic6(A) {
    let q = new Map,
        K = new Set,
        Y = new Map;
    for (let {
            message: _
        }
        of A)
        if (_.type === "assistant") {
            for (let w of _.message.content)
                if (w.type === "tool_use") q.set(w.id, w)
        } else if (_.type === "user") {
        for (let w of _.message.content)
            if (w.type === "tool_result") K.add(w.tool_use_id), Y.set(w.tool_use_id, _)
    }
    let z = new Set;
    for (let _ of q.keys())
        if (!K.has(_)) z.add(_);
    return {
        lookups: {
            ...Hl,
            toolUseByToolUseID: q,
            resolvedToolUseIDs: K,
            toolResultByToolUseID: Y
        },
        inProgressToolUseIDs: z
    }
}
// @from(Ln 445860, Col 0)
function mjq(A, q) {
    let K = u16(A);
    if (!K) return fR1;
    return q.siblingToolUseIDs.get(K) ?? fR1
}
// @from(Ln 445866, Col 0)
function Bjq(A, q) {
    let K = u16(A);
    if (!K) return [];
    return q.progressMessagesByToolUseID.get(K) ?? []
}
// @from(Ln 445872, Col 0)
function Ujq(A, q, K) {
    let Y = K.inProgressHookCounts.get(A)?.get(q) ?? 0,
        z = K.resolvedHookCounts.get(A)?.get(q) ?? 0;
    return Y > z
}
// @from(Ln 445878, Col 0)
function wzz(A) {
    let q = [],
        K = [];
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z.type === "attachment") K.push(z);
        else if ((z.type === "assistant" || z.type === "user" && Array.isArray(z.message.content) && z.message.content[0]?.type === "tool_result") && K.length > 0) {
            for (let w = 0; w < K.length; w++) q.push(K[w]);
            q.push(z), K.length = 0
        } else q.push(z)
    }
    for (let Y = 0; Y < K.length; Y++) q.push(K[Y]);
    return q.reverse(), q
}
// @from(Ln 445893, Col 0)
function gx8(A) {
    return A.type === "system" && A.subtype === "local_command"
}
// @from(Ln 445897, Col 0)
function Ozz(A, q) {
    let K = A.message.content;
    if (!Array.isArray(K)) return A;
    if (!K.some((z) => z.type === "tool_result" && Array.isArray(z.content) && z.content.some((_) => {
            if (!tb(_)) return !1;
            let w = _.tool_name;
            return w && !q.has(EG(w))
        }))) return A;
    return {
        ...A,
        message: {
            ...A.message,
            content: K.map((z) => {
                if (z.type !== "tool_result" || !Array.isArray(z.content)) return z;
                let _ = z.content.filter((w) => {
                    if (!tb(w)) return !0;
                    let O = w.tool_name;
                    if (!O) return !0;
                    let $ = EG(O),
                        H = q.has($);
                    if (!H) k(`Filtering out tool_reference for unavailable tool: ${$}`, {
                        level: "warn"
                    });
                    return H
                });
                if (_.length === 0) return {
                    ...z,
                    content: [{
                        type: "text",
                        text: "[Tool references removed - tools no longer available]"
                    }]
                };
                return {
                    ...z,
                    content: _
                }
            })
        }
    }
}
// @from(Ln 445938, Col 0)
function Xn8(A) {
    let q = A.message.content;
    if (!Array.isArray(q)) return A;
    if (!q.some((Y) => Y.type === "tool_result" && Array.isArray(Y.content) && Y.content.some(tb))) return A;
    return {
        ...A,
        message: {
            ...A.message,
            content: q.map((Y) => {
                if (Y.type !== "tool_result" || !Array.isArray(Y.content)) return Y;
                let z = Y.content.filter((_) => !tb(_));
                if (z.length === 0) return {
                    ...Y,
                    content: [{
                        type: "text",
                        text: "[Tool references removed - tool search not enabled]"
                    }]
                };
                return {
                    ...Y,
                    content: z
                }
            })
        }
    }
}
// @from(Ln 445965, Col 0)
function BGq(A) {
    if (!A.message.content.some((K) => K.type === "tool_use" && ("caller" in K) && K.caller !== null)) return A;
    return {
        ...A,
        message: {
            ...A.message,
            content: A.message.content.map((K) => {
                if (K.type !== "tool_use") return K;
                return {
                    type: "tool_use",
                    id: K.id,
                    name: K.name,
                    input: K.input
                }
            })
        }
    }
}
// @from(Ln 445984, Col 0)
function on8(A) {
    return A.some((q) => q.type === "tool_result" && Array.isArray(q.content) && q.content.some(tb))
}
// @from(Ln 445988, Col 0)
function $zz(A) {
    let q = A.message.content;
    if (typeof q === "string") {
        if (q.startsWith("<system-reminder>")) return A;
        return {
            ...A,
            message: {
                ...A.message,
                content: af(q)
            }
        }
    }
    let K = !1,
        Y = q.map((z) => {
            if (z.type === "text" && !z.text.startsWith("<system-reminder>")) return K = !0, {
                ...z,
                text: af(z.text)
            };
            return z
        });
    return K ? {
        ...A,
        message: {
            ...A.message,
            content: Y
        }
    } : A
}
// @from(Ln 446017, Col 0)
function Hzz(A) {
    return A.map((q) => {
        if (q.type !== "user") return q;
        let K = q.message.content;
        if (!Array.isArray(K)) return q;
        if (!K.some((j) => j.type === "tool_result")) return q;
        let z = [],
            _ = [];
        for (let j of K)
            if (j.type === "text" && j.text.startsWith("<system-reminder>")) z.push(j);
            else _.push(j);
        if (z.length === 0) return q;
        let w = _.map((j) => j.type).lastIndexOf("tool_result"),
            O = _[w],
            $ = sn8(O, z);
        if ($ === null) return q;
        let H = [..._.slice(0, w), $, ..._.slice(w + 1)];
        return {
            ...q,
            message: {
                ...q.message,
                content: H
            }
        }
    })
}
// @from(Ln 446044, Col 0)
function jzz(A) {
    let q = [...A];
    for (let K = 0; K < q.length; K++) {
        let Y = q[K];
        if (Y.type !== "user") continue;
        let z = Y.message.content;
        if (!Array.isArray(z)) continue;
        if (!on8(z)) continue;
        let _ = z.filter(($) => $.type === "text");
        if (_.length === 0) continue;
        let w = -1;
        for (let $ = K + 1; $ < q.length; $++) {
            let H = q[$];
            if (H.type !== "user") continue;
            let j = H.message.content;
            if (!Array.isArray(j)) continue;
            if (!j.some((J) => J.type === "tool_result")) continue;
            if (on8(j)) continue;
            w = $;
            break
        }
        if (w === -1) continue;
        q[K] = {
            ...Y,
            message: {
                ...Y.message,
                content: z.filter(($) => $.type !== "text")
            }
        };
        let O = q[w];
        q[w] = {
            ...O,
            message: {
                ...O.message,
                content: [...O.message.content, ..._]
            }
        }
    }
    return q
}
// @from(Ln 446085, Col 0)
function cM(A, q = []) {
    let K = new Set(q.map((M) => M.name)),
        Y = wzz(A),
        z = {
            [kv8()]: new Set(["document"]),
            [Ev8()]: new Set(["document"]),
            [yv8()]: new Set(["document"]),
            [dX1()]: new Set(["image"]),
            [Lv8()]: new Set(["document", "image"])
        },
        _ = new Map;
    for (let M = 0; M < Y.length; M++) {
        let D = Y[M];
        if (!rn8(D)) continue;
        let X = Array.isArray(D.message.content) && D.message.content[0]?.type === "text" ? D.message.content[0].text : void 0;
        if (!X) continue;
        let P = z[X];
        if (!P) continue;
        for (let W = M - 1; W >= 0; W--) {
            let Z = Y[W];
            if (Z.type === "user" && Z.isMeta) {
                let G = _.get(Z.uuid);
                if (G)
                    for (let f of P) G.add(f);
                else _.set(Z.uuid, new Set(P));
                break
            }
            if (rn8(Z)) continue;
            break
        }
    }
    let w = [];
    Y.filter((M) => {
        if (M.type === "progress" || M.type === "system" && !gx8(M) || rn8(M)) return !1;
        return !0
    }).forEach((M) => {
        switch (M.type) {
            case "system": {
                let D = p1({
                        content: M.content,
                        uuid: M.uuid,
                        timestamp: M.timestamp
                    }),
                    X = fL(w);
                if (X?.type === "user") {
                    w[w.length - 1] = an8(X, D);
                    return
                }
                w.push(D);
                return
            }
            case "user": {
                let D = M;
                if (!dk()) D = Xn8(M);
                else D = Ozz(M, K);
                let X = _.get(D.uuid);
                if (X && D.isMeta) {
                    let W = D.message.content;
                    if (Array.isArray(W)) {
                        let Z = W.filter((G) => !X.has(G.type));
                        if (Z.length === 0) return;
                        if (Z.length < W.length) D = {
                            ...D,
                            message: {
                                ...D.message,
                                content: Z
                            }
                        }
                    }
                }
                if (!jY("tengu_toolref_defer_j8m")) {
                    let W = D.message.content;
                    if (Array.isArray(W) && !W.some((Z) => Z.type === "text" && Z.text.startsWith(MTq)) && on8(W)) D = {
                        ...D,
                        message: {
                            ...D.message,
                            content: [...W, {
                                type: "text",
                                text: MTq
                            }]
                        }
                    }
                }
                let P = fL(w);
                if (P?.type === "user") {
                    w[w.length - 1] = an8(P, D);
                    return
                }
                w.push(D);
                return
            }
            case "assistant": {
                let D = dk(),
                    X = {
                        ...M,
                        message: {
                            ...M.message,
                            content: M.message.content.map((P) => {
                                if (P.type === "tool_use") {
                                    let W = q.find((f) => z3(f, P.name)),
                                        Z = W ? CGq(W, P.input) : P.input,
                                        G = W?.name ?? P.name;
                                    if (D) return {
                                        ...P,
                                        name: G,
                                        input: Z
                                    };
                                    return {
                                        type: "tool_use",
                                        id: P.id,
                                        name: G,
                                        input: Z
                                    }
                                }
                                return P
                            })
                        }
                    };
                for (let P = w.length - 1; P >= 0; P--) {
                    let W = w[P];
                    if (W.type !== "assistant" && !Dzz(W)) break;
                    if (W.type === "assistant") {
                        if (W.message.id === X.message.id) {
                            w[P] = Mzz(W, X);
                            return
                        }
                        continue
                    }
                }
                w.push(X);
                return
            }
            case "attachment": {
                let D = Ui8(M.attachment),
                    X = jY("tengu_chair_sermon") ? D.map($zz) : D,
                    P = fL(w);
                if (P?.type === "user") {
                    w[w.length - 1] = X.reduce((W, Z) => Jzz(W, Z), P);
                    return
                }
                w.push(...X);
                return
            }
        }
    });
    let O = jY("tengu_toolref_defer_j8m") ? jzz(w) : w,
        $ = jY("tengu_chair_sermon") ? Hzz(O) : O;
    WA4($);
    let H = $l6($),
        j = Czz(H),
        J = Ol6(j);
    return bzz(J)
}
// @from(Ln 446239, Col 0)
function Jzz(A, q) {
    let K = YS1(A.message.content),
        Y = YS1(q.message.content);
    return {
        ...A,
        message: {
            ...A.message,
            content: TTq(Xzz(K, Y))
        }
    }
}
// @from(Ln 446251, Col 0)
function Mzz(A, q) {
    return {
        ...A,
        message: {
            ...A.message,
            content: [...A.message.content, ...q.message.content]
        }
    }
}
// @from(Ln 446261, Col 0)
function Dzz(A) {
    if (A.type !== "user") return !1;
    let q = A.message.content;
    if (typeof q === "string") return !1;
    return q.some((K) => K.type === "tool_result")
}
// @from(Ln 446268, Col 0)
function an8(A, q) {
    let K = YS1(A.message.content),
        Y = YS1(q.message.content);
    return {
        ...A,
        uuid: A.isMeta ? q.uuid : A.uuid,
        message: {
            ...A.message,
            content: TTq([...K, ...Y])
        }
    }
}
// @from(Ln 446281, Col 0)
function TTq(A) {
    let q = [],
        K = [];
    for (let Y of A)
        if (Y.type === "tool_result") q.push(Y);
        else K.push(Y);
    return [...q, ...K]
}
// @from(Ln 446290, Col 0)
function YS1(A) {
    if (typeof A === "string") return [{
        type: "text",
        text: A
    }];
    return A
}
// @from(Ln 446298, Col 0)
function sn8(A, q) {
    if (q.length === 0) return A;
    let K = A.content;
    if (Array.isArray(K) && K.some(tb)) return null;
    if (q.every((w) => w.type === "text") && (K === void 0 || typeof K === "string")) {
        let w = [(K ?? "").trim(), ...q.map((O) => O.text.trim())].filter(Boolean).join(`

`);
        return {
            ...A,
            content: w
        }
    }
    let _ = [...K === void 0 ? [] : typeof K === "string" ? K.trim() ? [{
        type: "text",
        text: K.trim()
    }] : [] : [...K], ...q].reduce((w, O) => {
        if (O.type === "text") {
            let $ = O.text.trim();
            if (!$) return w;
            let H = w[w.length - 1];
            if (H?.type === "text") return [...w.slice(0, -1), {
                ...H,
                text: `${H.text}

${$}`
            }];
            return [...w, {
                type: "text",
                text: $
            }]
        }
        return [...w, O]
    }, []);
    return {
        ...A,
        content: _
    }
}
// @from(Ln 446338, Col 0)
function Xzz(A, q) {
    let K = fL(A);
    if (K?.type !== "tool_result") return [...A, ...q];
    if (!jY("tengu_chair_sermon")) {
        if (typeof K.content === "string" && q.every((w) => w.type === "text")) return [...A.slice(0, -1), sn8(K, q)];
        return [...A, ...q]
    }
    let Y = q.filter((w) => w.type !== "tool_result"),
        z = q.filter((w) => w.type === "tool_result");
    if (Y.length === 0) return [...A, ...q];
    let _ = sn8(K, Y);
    if (_ === null) return [...A, ...q];
    return [...A.slice(0, -1), _, ...z]
}
// @from(Ln 446353, Col 0)
function dh1(A, q, K) {
    if (!A) return [];
    return A.map((Y) => {
        switch (Y.type) {
            case "tool_use": {
                if (typeof Y.input !== "string" && !A_(Y.input)) throw Error("Tool use input must be a string or object");
                let z = typeof Y.input === "string" ? WK(Y.input) ?? {} : Y.input;
                if (typeof z === "object" && z !== null) {
                    let _ = dK(q, Y.name);
                    if (_) try {
                        z = SGq(_, z, K)
                    } catch (w) {
                        _6(Error("Error normalizing tool input: " + w))
                    }
                }
                return {
                    ...Y,
                    input: z
                }
            }
            case "text":
                if (Y.text.trim().length === 0) d("tengu_model_whitespace_response", {
                    length: Y.text.length
                });
                return Y;
            case "code_execution_tool_result":
            case "mcp_tool_use":
            case "mcp_tool_result":
            case "container_upload":
                return Y;
            case "server_tool_use":
                if (typeof Y.input === "string") return {
                    ...Y,
                    input: WK(Y.input) ?? {}
                };
                return Y;
            default:
                return Y
        }
    })
}
// @from(Ln 446395, Col 0)
function pv1(A) {
    return Ne(A).trim() === "" || A.trim() === wE
}
// @from(Ln 446399, Col 0)
function Ne(A) {
    let q = new RegExp(`<(${Pzz.join("|")})>.*?</\\1>
?`, "gs");
    return A.replace(q, "").trim()
}
// @from(Ln 446405, Col 0)
function u16(A) {
    switch (A.type) {
        case "attachment":
            if (rr6(A)) return A.attachment.toolUseID;
            return null;
        case "assistant":
            if (A.message.content[0]?.type !== "tool_use") return null;
            return A.message.content[0].id;
        case "user":
            if (A.sourceToolUseID) return A.sourceToolUseID;
            if (A.message.content[0]?.type !== "tool_result") return null;
            return A.message.content[0].tool_use_id;
        case "progress":
            return A.toolUseID;
        case "system":
            return A.subtype === "informational" ? A.toolUseID ?? null : null
    }
}
// @from(Ln 446424, Col 0)
function _V1(A) {
    let q = new Set,
        K = new Set;
    for (let z of A) {
        if (z.type !== "user" && z.type !== "assistant") continue;
        let _ = z.message.content;
        if (!Array.isArray(_)) continue;
        for (let w of _) {
            if (w.type === "tool_use") q.add(w.id);
            if (w.type === "tool_result") K.add(w.tool_use_id)
        }
    }
    let Y = new Set([...q].filter((z) => !K.has(z)));
    if (Y.size === 0) return A;
    return A.filter((z) => {
        if (z.type !== "assistant") return !0;
        let _ = z.message.content;
        if (!Array.isArray(_)) return !0;
        let w = [];
        for (let O of _)
            if (O.type === "tool_use") w.push(O.id);
        if (w.length === 0) return !0;
        return !w.every((O) => Y.has(O))
    })
}
// @from(Ln 446450, Col 0)
function BE1(A) {
    if (A.type !== "assistant") return null;
    if (Array.isArray(A.message.content)) return A.message.content.filter((q) => q.type === "text").map((q) => q.type === "text" ? q.text : "").join(`
`).trim() || null;
    return null
}
// @from(Ln 446457, Col 0)
function Fg(A) {
    if (A.type !== "user") return null;
    let q = A.message.content;
    return $l(q)
}
// @from(Ln 446463, Col 0)
function $l(A) {
    if (typeof A === "string") return A;
    if (Array.isArray(A)) return A.filter((q) => q.type === "text").map((q) => q.type === "text" ? q.text : "").join(`
`).trim() || null;
    return null
}
// @from(Ln 446470, Col 0)
function xN6(A, q, K, Y, z, _, w, O, $) {
    if (A.type !== "stream_event" && A.type !== "stream_request_start") {
        if (A.type === "tombstone") {
            _?.(A.message);
            return
        }
        if (A.type === "tool_use_summary") return;
        if (A.type === "assistant") {
            let H = A.message.content.find((j) => j.type === "thinking");
            if (H && H.type === "thinking") w?.(() => ({
                thinking: H.thinking,
                isStreaming: !1,
                streamingEndedAt: Date.now()
            }))
        }
        $?.(() => null), q(A);
        return
    }
    if (A.type === "stream_request_start") {
        Y("requesting");
        return
    }
    if (A.event.type === "message_start") {
        if (A.ttftMs != null) O?.({
            ttftMs: A.ttftMs
        })
    }
    if (A.event.type === "message_stop") {
        Y("tool-use"), z(() => []);
        return
    }
    switch (A.event.type) {
        case "content_block_start":
            switch ($?.(() => null), A.event.content_block.type) {
                case "thinking":
                case "redacted_thinking":
                    Y("thinking");
                    return;
                case "text":
                    Y("responding");
                    return;
                case "tool_use": {
                    Y("tool-input");
                    let H = A.event.content_block,
                        j = A.event.index;
                    z((J) => [...J, {
                        index: j,
                        contentBlock: H,
                        unparsedToolInput: ""
                    }]);
                    return
                }
                case "server_tool_use":
                case "web_search_tool_result":
                case "code_execution_tool_result":
                case "mcp_tool_use":
                case "mcp_tool_result":
                case "container_upload":
                case "web_fetch_tool_result":
                case "bash_code_execution_tool_result":
                case "text_editor_code_execution_tool_result":
                case "tool_search_tool_result":
                case "compaction":
                    Y("tool-input");
                    return
            }
            break;
        case "content_block_delta":
            switch (A.event.delta.type) {
                case "text_delta": {
                    let H = A.event.delta.text;
                    K(H), $?.((j) => (j ?? "") + H);
                    return
                }
                case "input_json_delta": {
                    let H = A.event.delta.partial_json,
                        j = A.event.index;
                    K(H), z((J) => {
                        let M = J.find((D) => D.index === j);
                        if (!M) return J;
                        return [...J.filter((D) => D !== M), {
                            ...M,
                            unparsedToolInput: M.unparsedToolInput + H
                        }]
                    });
                    return
                }
                case "thinking_delta":
                    K(A.event.delta.thinking);
                    return;
                case "signature_delta":
                    return;
                default:
                    return
            }
        case "content_block_stop":
            return;
        case "message_delta":
            Y("responding");
            return;
        default:
            Y("responding");
            return
    }
}
// @from(Ln 446576, Col 0)
function af(A) {
    return `<system-reminder>
${A}
</system-reminder>`
}
// @from(Ln 446582, Col 0)
function b5(A) {
    return A.map((q) => {
        if (typeof q.message.content === "string") return {
            ...q,
            message: {
                ...q.message,
                content: af(q.message.content)
            }
        };
        else if (Array.isArray(q.message.content)) {
            let K = q.message.content.map((Y) => {
                if (Y.type === "text") return {
                    ...Y,
                    text: af(Y.text)
                };
                return Y
            });
            return {
                ...q,
                message: {
                    ...q.message,
                    content: K
                }
            }
        }
        return q
    })
}
// @from(Ln 446611, Col 0)
function Wzz(A) {
    if (A.reminderType === "ultraplan-complete") return Zzz(A);
    if (A.isSubAgent) return yzz(A);
    if (A.reminderType === "sparse") return Ezz(A);
    return Nzz(A)
}
// @from(Ln 446618, Col 0)
function Zzz(A) {
    let q = `Ultraplan complete. The plan has been pre-written to the plan file (${A.planFilePath}) by the remote planning session. Do NOT read files, explore the codebase, or modify anything. Your ONLY permitted action is to call ${zD.name} immediately to present the plan to the user for approval.`;
    return b5([p1({
        content: q,
        isMeta: !0
    })])
}
// @from(Ln 446626, Col 0)
function vzz() {
    let A = Hz1();
    switch (A) {
        case "trim":
            return Gzz;
        case "cut":
            return fzz;
        case "cap":
            return Tzz;
        case null:
            return XTq;
        default:
            return XTq
    }
}
// @from(Ln 446642, Col 0)
function Nzz(A) {
    if (A.isSubAgent) return [];
    if (rO()) return kzz(A);
    let q = iJ7(),
        K = nJ7(),
        z = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${A.planExists?`A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${pX.name} tool.`:`No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${xX.name} tool.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain a comprehensive understanding of the user's request by reading through code and asking them questions. Critical: In this phase you should only use the ${QB.agentType} subagent type.

1. Focus on understanding the user's request and the code associated with their request. Actively search for existing functions, utilities, and patterns that can be reused — avoid proposing new code when suitable implementations already exist.

2. **Launch up to ${K} ${QB.agentType} agents IN PARALLEL** (single message, multiple tool calls) to efficiently explore the codebase.
   - Use 1 agent when the task is isolated to known files, the user provided specific file paths, or you're making a small targeted change.
   - Use multiple agents when: the scope is uncertain, multiple areas of the codebase are involved, or you need to understand existing patterns before planning.
   - Quality over quantity - ${K} agents maximum, but you should try to use the minimum number of agents necessary (usually just 1)
   - If using multiple agents: Provide each agent with a specific search focus or area to explore. Example: One agent searches for existing implementations, another explores related components, a third investigating testing patterns

### Phase 2: Design
Goal: Design an implementation approach.

Launch ${x01.agentType} agent(s) to design the implementation based on the user's intent and your exploration results from Phase 1.

You can launch up to ${q} agent(s) in parallel.

**Guidelines:**
- **Default**: Launch at least 1 Plan agent for most tasks - it helps validate your understanding and consider alternatives
- **Skip agents**: Only for truly trivial tasks (typo fixes, single-line changes, simple renames)
${q>1?`- **Multiple agents**: Use up to ${q} agents for complex tasks that benefit from different perspectives

Examples of when to use multiple agents:
- The task touches multiple parts of the codebase
- It's a large refactor or architectural change
- There are many edge cases to consider
- You'd benefit from exploring different approaches

Example perspectives by task type:
- New feature: simplicity vs performance vs maintainability
- Bug fix: root cause vs workaround vs prevention
- Refactoring: minimal change vs clean architecture
`:""}
In the agent prompt:
- Provide comprehensive background context from Phase 1 exploration including filenames and code path traces
- Describe requirements and constraints
- Request a detailed implementation plan

### Phase 3: Review
Goal: Review the plan(s) from Phase 2 and ensure alignment with the user's intentions.
1. Read the critical files identified by agents to deepen your understanding
2. Ensure that the plans align with the user's original request
3. Use ${Fw} to clarify any remaining questions with the user

${vzz()}

### Phase 5: Call ${zD.name}
At the very end of your turn, once you have asked the user questions and are happy with your final plan file - you should always call ${zD.name} to indicate to the user that you are done planning.
This is critical - your turn should only end with either using the ${Fw} tool OR calling ${zD.name}. Do not stop unless it's for these 2 reasons

**Important:** Use ${Fw} ONLY to clarify requirements or choose between approaches. Use ${zD.name} to request plan approval. Do NOT ask about plan approval in any other way - no text questions, no AskUserQuestion. Phrases like "Is this plan okay?", "Should I proceed?", "How does this plan look?", "Any changes before we start?", or similar MUST use ${zD.name}.

NOTE: At any point in time through this workflow you should feel free to ask the user questions or clarifications using the ${Fw} tool. Don't make large assumptions about user intent. The goal is to present a well researched plan to the user, and tie any loose ends before implementation begins.`;
    return b5([p1({
        content: z,
        isMeta: !0
    })])
}
// @from(Ln 446715, Col 0)
function Vzz() {
    let A = n$() ? [s7, "`find`", "`grep`"] : [s7, qz, N9],
        {
            allowedTools: q
        } = d2();
    return (q && q.length > 0 && !n$() ? A.filter((Y) => q.includes(Y)) : A).join(", ")
}
// @from(Ln 446723, Col 0)
function kzz(A) {
    let K = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${A.planExists?`A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${pX.name} tool.`:`No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${xX.name} tool.`}

## Iterative Planning Workflow

You are pair-planning with the user. Explore the code to build context, ask the user questions when you hit decisions you can't make alone, and write your findings into the plan file as you go. The plan file (above) is the ONLY file you may edit — it starts as a rough skeleton and gradually becomes the final plan.

### The Loop

Repeat this cycle until the plan is complete:

1. **Explore** — Use ${Vzz()} to read code. Look for existing functions, utilities, and patterns to reuse. You can use the ${QB.agentType} agent type to parallelize complex searches without filling your context, though for straightforward queries direct tools are simpler.
2. **Update the plan file** — After each discovery, immediately capture what you learned. Don't wait until the end.
3. **Ask the user** — When you hit an ambiguity or decision you can't resolve from code alone, use ${Fw}. Then go back to step 1.

### First Turn

Start by quickly scanning a few key files to form an initial understanding of the task scope. Then write a skeleton plan (headers and rough notes) and ask the user your first round of questions. Don't explore exhaustively before engaging the user.

### Asking Good Questions

- Never ask what you could find out by reading the code
- Batch related questions together (use multi-question ${Fw} calls)
- Focus on things only the user can answer: requirements, preferences, tradeoffs, edge case priorities
- Scale depth to the task — a vague feature request needs many rounds; a focused bug fix may need one or none

### Plan File Structure
Your plan file should be divided into clear sections using markdown headers, based on the request. Fill out these sections as you go.
- Begin with a **Context** section: explain why this change is being made — the problem or need it addresses, what prompted it, and the intended outcome
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly, but detailed enough to execute effectively
- Include the paths of critical files to be modified
- Reference existing functions and utilities you found that should be reused, with their file paths
- Include a verification section describing how to test the changes end-to-end (run the code, use MCP tools, run tests)

### When to Converge

Your plan is ready when you've addressed all ambiguities and it covers: what to change, which files to modify, what existing code to reuse (with file paths), and how to verify the changes. Call ${zD.name} when the plan is ready for approval.

### Ending Your Turn

Your turn should only end by either:
- Using ${Fw} to gather more information
- Calling ${zD.name} when the plan is ready for approval

**Important:** Use ${zD.name} to request plan approval. Do NOT ask about plan approval via text or AskUserQuestion.`;
    return b5([p1({
        content: K,
        isMeta: !0
    })])
}
// @from(Ln 446778, Col 0)
function Ezz(A) {
    let q = rO() ? "Follow iterative workflow: explore codebase, interview user, write to plan incrementally." : "Follow 5-phase workflow.",
        K = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${A.planFilePath}). ${q} End turns with ${Fw} (for clarifications) or ${zD.name} (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
    return b5([p1({
        content: K,
        isMeta: !0
    })])
}
// @from(Ln 446787, Col 0)
function yzz(A) {
    let K = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
${A.planExists?`A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${pX.name} tool if you need to.`:`No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${xX.name} tool if you need to.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
Answer the user's query comprehensively, using the ${Fw} tool if you need to ask the user clarifying questions. If you do use the ${Fw}, make sure to ask all clarifying questions you need to fully understand the user's intent before proceeding.`;
    return b5([p1({
        content: K,
        isMeta: !0
    })])
}
// @from(Ln 446800, Col 0)
function Lzz(A) {
    if (A.reminderType === "sparse") return hzz();
    return Rzz()
}
// @from(Ln 446805, Col 0)
function Rzz() {
    return b5([p1({
        content: `## Auto Mode Active

Auto mode is active. The user chose continuous, autonomous execution. You should:

1. **Execute immediately** — Start implementing right away. Make reasonable assumptions and proceed.
2. **Minimize interruptions** — Prefer making reasonable assumptions over asking questions. Use AskUserQuestion only when the task genuinely cannot proceed without user input (e.g., choosing between fundamentally different approaches with no clear default).
3. **Prefer action over planning** — Do not enter plan mode unless the user explicitly asks. When in doubt, start coding.
4. **Make reasonable decisions** — Choose the most sensible approach and keep moving. Don't block on ambiguity that you can resolve with a reasonable default.
5. **Be thorough** — Complete the full task including tests, linting, and verification without stopping to ask.`,
        isMeta: !0
    })])
}
// @from(Ln 446820, Col 0)
function hzz() {
    return b5([p1({
        content: "Auto mode still active (see full instructions earlier in conversation). Execute autonomously, minimize interruptions, prefer action over planning.",
        isMeta: !0
    })])
}