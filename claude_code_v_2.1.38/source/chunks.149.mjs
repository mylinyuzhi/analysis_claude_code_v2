
// @from(Ln 379368, Col 0)
async function* b1q(A, q, K, Y, z, w, H, $, O) {
    let _ = Date.now();
    try {
        let X = (await A.getAppState()).toolPermissionContext.mode,
            D = w;
        for await (let j of KyA(q.name, K, z, D, A, X, A.abortController.signal)) try {
            if (j.message?.type === "attachment" && j.message.attachment.type === "hook_cancelled") {
                c("tengu_post_tool_hooks_cancelled", {
                    toolName: AK(q.name),
                    queryChainId: A.queryTracking?.chainId,
                    queryDepth: A.queryTracking?.depth
                }), yield {
                    message: kq({
                        type: "hook_cancelled",
                        hookName: `PostToolUse:${q.name}`,
                        toolUseID: K,
                        hookEvent: "PostToolUse"
                    })
                };
                continue
            }
            if (j.message) yield {
                message: j.message
            };
            if (j.blockingError) yield {
                message: kq({
                    type: "hook_blocking_error",
                    hookName: `PostToolUse:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUse",
                    blockingError: j.blockingError
                })
            };
            if (j.preventContinuation) {
                yield {
                    message: kq({
                        type: "hook_stopped_continuation",
                        message: j.stopReason || "Execution stopped by PostToolUse hook",
                        hookName: `PostToolUse:${q.name}`,
                        toolUseID: K,
                        hookEvent: "PostToolUse"
                    })
                };
                return
            }
            if (j.additionalContexts && j.additionalContexts.length > 0) yield {
                message: kq({
                    type: "hook_additional_context",
                    content: j.additionalContexts,
                    hookName: `PostToolUse:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUse"
                })
            };
            if (j.updatedMCPToolOutput && $E(q)) D = j.updatedMCPToolOutput, yield {
                updatedMCPToolOutput: D
            }
        } catch (M) {
            let P = Date.now() - _;
            c("tengu_post_tool_hook_error", {
                messageID: Y,
                toolName: AK(q.name),
                isMcp: q.isMcp ?? !1,
                duration: P,
                queryChainId: A.queryTracking?.chainId,
                queryDepth: A.queryTracking?.depth,
                ...$ ? {
                    mcpServerType: $
                } : {},
                ...H ? {
                    requestId: H
                } : {}
            }), yield {
                message: kq({
                    type: "hook_error_during_execution",
                    content: uG1(M),
                    hookName: `PostToolUse:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUse"
                })
            }
        }
    } catch (J) {
        K1(J instanceof Error ? J : Error(String(J)))
    }
}
// @from(Ln 379454, Col 0)
async function* u1q(A, q, K, Y, z, w, H, $, O, _) {
    let J = Date.now();
    try {
        let D = (await A.getAppState()).toolPermissionContext.mode;
        for await (let j of YyA(q.name, K, z, w, A, H, D, A.abortController.signal)) try {
            if (j.message?.type === "attachment" && j.message.attachment.type === "hook_cancelled") {
                c("tengu_post_tool_failure_hooks_cancelled", {
                    toolName: AK(q.name),
                    queryChainId: A.queryTracking?.chainId,
                    queryDepth: A.queryTracking?.depth
                }), yield {
                    message: kq({
                        type: "hook_cancelled",
                        hookName: `PostToolUseFailure:${q.name}`,
                        toolUseID: K,
                        hookEvent: "PostToolUseFailure"
                    })
                };
                continue
            }
            if (j.message) yield {
                message: j.message
            };
            if (j.blockingError) yield {
                message: kq({
                    type: "hook_blocking_error",
                    hookName: `PostToolUseFailure:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUseFailure",
                    blockingError: j.blockingError
                })
            };
            if (j.additionalContexts && j.additionalContexts.length > 0) yield {
                message: kq({
                    type: "hook_additional_context",
                    content: j.additionalContexts,
                    hookName: `PostToolUseFailure:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUseFailure"
                })
            }
        } catch (M) {
            let P = Date.now() - J;
            c("tengu_post_tool_failure_hook_error", {
                messageID: Y,
                toolName: AK(q.name),
                isMcp: q.isMcp ?? !1,
                duration: P,
                queryChainId: A.queryTracking?.chainId,
                queryDepth: A.queryTracking?.depth,
                ...O ? {
                    mcpServerType: O
                } : {},
                ...$ ? {
                    requestId: $
                } : {}
            }), yield {
                message: kq({
                    type: "hook_error_during_execution",
                    content: uG1(M),
                    hookName: `PostToolUseFailure:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUseFailure"
                })
            }
        }
    } catch (X) {
        K1(X instanceof Error ? X : Error(String(X)))
    }
}
// @from(Ln 379524, Col 0)
async function* B1q(A, q, K, Y, z, w, H, $) {
    let O = Date.now();
    try {
        let _ = await A.getAppState();
        for await (let J of qyA(q.name, Y, K, A, _.toolPermissionContext.mode, A.abortController.signal)) try {
            if (J.message) yield {
                type: "message",
                message: {
                    message: J.message
                }
            };
            if (J.blockingError) {
                let X = aRA(`PreToolUse:${q.name}`, J.blockingError);
                yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: "deny",
                        message: X,
                        decisionReason: {
                            type: "hook",
                            hookName: `PreToolUse:${q.name}`,
                            reason: X
                        }
                    }
                }
            }
            if (J.preventContinuation) {
                if (yield {
                        type: "preventContinuation",
                        shouldPreventContinuation: !0
                    }, J.stopReason) yield {
                    type: "stopReason",
                    stopReason: J.stopReason
                }
            }
            if (J.permissionBehavior !== void 0) {
                h(`Hook result has permissionBehavior=${J.permissionBehavior}`);
                let X = {
                    type: "hook",
                    hookName: `PreToolUse:${q.name}`,
                    reason: J.hookPermissionDecisionReason
                };
                if (J.permissionBehavior === "allow") yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: "allow",
                        updatedInput: J.updatedInput,
                        decisionReason: X
                    }
                };
                else if (J.permissionBehavior === "ask") yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: "ask",
                        updatedInput: J.updatedInput,
                        message: J.hookPermissionDecisionReason || `Hook PreToolUse:${q.name} ${AhA(J.permissionBehavior)} this tool`,
                        decisionReason: X
                    }
                };
                else yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: J.permissionBehavior,
                        message: J.hookPermissionDecisionReason || `Hook PreToolUse:${q.name} ${AhA(J.permissionBehavior)} this tool`,
                        decisionReason: X
                    }
                }
            }
            if (J.updatedInput && J.permissionBehavior === void 0) yield {
                type: "hookUpdatedInput",
                updatedInput: J.updatedInput
            };
            if (J.additionalContexts && J.additionalContexts.length > 0) yield {
                type: "additionalContext",
                message: {
                    message: kq({
                        type: "hook_additional_context",
                        content: J.additionalContexts,
                        hookName: `PreToolUse:${q.name}`,
                        toolUseID: Y,
                        hookEvent: "PreToolUse"
                    })
                }
            };
            if (A.abortController.signal.aborted) {
                c("tengu_pre_tool_hooks_cancelled", {
                    toolName: AK(q.name),
                    queryChainId: A.queryTracking?.chainId,
                    queryDepth: A.queryTracking?.depth
                }), yield {
                    type: "message",
                    message: {
                        message: kq({
                            type: "hook_cancelled",
                            hookName: `PreToolUse:${q.name}`,
                            toolUseID: Y,
                            hookEvent: "PreToolUse"
                        })
                    }
                }, yield {
                    type: "stop"
                };
                return
            }
        } catch (X) {
            K1(X instanceof Error ? X : Error(String(X)));
            let D = Date.now() - O;
            c("tengu_pre_tool_hook_error", {
                messageID: z,
                toolName: AK(q.name),
                isMcp: q.isMcp ?? !1,
                duration: D,
                queryChainId: A.queryTracking?.chainId,
                queryDepth: A.queryTracking?.depth,
                ...H ? {
                    mcpServerType: H
                } : {},
                ...w ? {
                    requestId: w
                } : {}
            }), yield {
                type: "message",
                message: {
                    message: kq({
                        type: "hook_error_during_execution",
                        content: uG1(X),
                        hookName: `PreToolUse:${q.name}`,
                        toolUseID: Y,
                        hookEvent: "PreToolUse"
                    })
                }
            }, yield {
                type: "stop"
            }
        }
    } catch (_) {
        K1(_ instanceof Error ? _ : Error(String(_))), yield {
            type: "stop"
        };
        return
    }
}
// @from(Ln 379666, Col 4)
m1q = v(() => {
    u6();
    U$();
    y6();
    Z6();
    FW();
    aM();
    tX();
    sZ6()
})
// @from(Ln 379677, Col 0)
function F1q(A) {
    let q = 0;
    for (let K of A)
        if (K.type === "user" && K.imagePasteIds) {
            for (let Y of K.imagePasteIds)
                if (Y > q) q = Y
        } return q + 1
}
// @from(Ln 379686, Col 0)
function Q1q(A, q) {
    if (!A.startsWith("mcp__")) return;
    let K = VD(A);
    if (!K) return;
    return q.find((Y) => P5(Y.name) === K.serverName)
}
// @from(Ln 379693, Col 0)
function ZdY(A, q) {
    let K = Q1q(A, q);
    if (K?.type === "connected") return K.config.type ?? "stdio";
    return
}
// @from(Ln 379699, Col 0)
function fdY(A, q) {
    let K = Q1q(A, q);
    if (K?.type !== "connected") return;
    return U_(K.config)
}
// @from(Ln 379704, Col 0)
async function* bU1(A, q, K, Y) {
    let z = A.name,
        w = Tv(Y.options.tools, z);
    if (!w) {
        let X = Tv(kt(), z);
        if (X && X.aliases?.includes(z)) w = X
    }
    let H = q.message.id,
        $ = q.requestId,
        O = ZdY(z, Y.options.mcpClients),
        _ = fdY(z, Y.options.mcpClients);
    if (!w) {
        let X = AK(z);
        h(`Unknown tool ${z}: ${A.id}`), c("tengu_tool_use_error", {
            error: `No such tool available: ${X}`,
            toolName: X,
            toolUseID: A.id,
            isMcp: z.startsWith("mcp__"),
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...O ? {
                mcpServerType: O
            } : {},
            ..._ ? {
                mcpServerBaseUrl: _
            } : {},
            ...$ ? {
                requestId: $
            } : {},
            ...vB() ? (() => {
                let D = Jh(z);
                return D ? {
                    mcpServerName: D.serverName,
                    mcpToolName: D.mcpToolName
                } : {}
            })() : {}
        }), yield {
            message: c6({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>Error: No such tool available: ${z}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: A.id
                }],
                toolUseResult: `Error: No such tool available: ${z}`,
                sourceToolAssistantUUID: q.uuid
            })
        };
        return
    }
    let J = A.input;
    try {
        if (Y.abortController.signal.aborted) {
            c("tengu_tool_use_cancelled", {
                toolName: AK(w.name),
                toolUseID: A.id,
                isMcp: w.isMcp ?? !1,
                queryChainId: Y.queryTracking?.chainId,
                queryDepth: Y.queryTracking?.depth,
                ...O ? {
                    mcpServerType: O
                } : {},
                ..._ ? {
                    mcpServerBaseUrl: _
                } : {},
                ...$ ? {
                    requestId: $
                } : {},
                ...vB() ? (() => {
                    let D = Jh(w.name);
                    return D ? {
                        mcpServerName: D.serverName,
                        mcpToolName: D.mcpToolName
                    } : {}
                })() : {}
            });
            let X = KhA(A.id);
            yield {
                message: c6({
                    content: [X],
                    toolUseResult: _M1,
                    sourceToolAssistantUUID: q.uuid
                })
            };
            return
        }
        for await (let X of VdY(w, A.id, J, Y, K, q, H, $, O, _)) yield X
    } catch (X) {
        K1(X instanceof Error ? X : Error(String(X)));
        let D = X instanceof Error ? X.message : String(X),
            M = `Error calling tool${w?` (${w.name})`:""}: ${D}`;
        yield {
            message: c6({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${M}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: A.id
                }],
                toolUseResult: M,
                sourceToolAssistantUUID: q.uuid
            })
        }
    }
}
// @from(Ln 379810, Col 0)
function VdY(A, q, K, Y, z, w, H, $, O, _) {
    let J = new xU1;
    return NdY(A, q, K, Y, z, w, H, $, O, _, (X) => {
        c("tengu_tool_use_progress", {
            messageID: H,
            toolName: AK(A.name),
            isMcp: A.isMcp ?? !1,
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...O ? {
                mcpServerType: O
            } : {},
            ..._ ? {
                mcpServerBaseUrl: _
            } : {},
            ...$ ? {
                requestId: $
            } : {},
            ...vB() ? (() => {
                let D = Jh(A.name);
                return D ? {
                    mcpServerName: D.serverName,
                    mcpToolName: D.mcpToolName
                } : {}
            })() : {}
        }), J.enqueue({
            message: U1q({
                toolUseID: X.toolUseID,
                parentToolUseID: q,
                data: X.data
            })
        })
    }).then((X) => {
        for (let D of X) J.enqueue(D)
    }).catch((X) => {
        J.error(X)
    }).finally(() => {
        J.done()
    }), J
}
// @from(Ln 379850, Col 0)
async function NdY(A, q, K, Y, z, w, H, $, O, _, J) {
    let X = A.inputSchema.safeParse(K);
    if (!X.success) {
        let y = x1q(A.name, X.error);
        return h(`${A.name} tool input error: ${y.slice(0,200)}`), c("tengu_tool_use_error", {
            error: "InputValidationError",
            errorDetails: y.slice(0, 2000),
            messageID: H,
            toolName: AK(A.name),
            isMcp: A.isMcp ?? !1,
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...O ? {
                mcpServerType: O
            } : {},
            ..._ ? {
                mcpServerBaseUrl: _
            } : {},
            ...$ ? {
                requestId: $
            } : {},
            ...vB() ? (() => {
                let B = Jh(A.name);
                return B ? {
                    mcpServerName: B.serverName,
                    mcpToolName: B.mcpToolName
                } : {}
            })() : {}
        }), [{
            message: c6({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>InputValidationError: ${y}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: q
                }],
                toolUseResult: `InputValidationError: ${X.error.message}`,
                sourceToolAssistantUUID: w.uuid
            })
        }]
    }
    let D = await A.validateInput?.(X.data, Y);
    if (D?.result === !1) return h(`${A.name} tool validation error: ${D.message?.slice(0,200)}`), c("tengu_tool_use_error", {
        messageID: H,
        toolName: AK(A.name),
        error: D.message,
        errorCode: D.errorCode,
        isMcp: A.isMcp ?? !1,
        queryChainId: Y.queryTracking?.chainId,
        queryDepth: Y.queryTracking?.depth,
        ...O ? {
            mcpServerType: O
        } : {},
        ..._ ? {
            mcpServerBaseUrl: _
        } : {},
        ...$ ? {
            requestId: $
        } : {},
        ...vB() ? (() => {
            let y = Jh(A.name);
            return y ? {
                mcpServerName: y.serverName,
                mcpToolName: y.mcpToolName
            } : {}
        })() : {}
    }), [{
        message: c6({
            content: [{
                type: "tool_result",
                content: `<tool_use_error>${D.message}</tool_use_error>`,
                is_error: !0,
                tool_use_id: q
            }],
            toolUseResult: `Error: ${D.message}`,
            sourceToolAssistantUUID: w.uuid
        })
    }];
    if (A.name === h4 && X.data && "command" in X.data) {
        let y = await Y.getAppState();
        if (g1q(X.data.command, y.toolPermissionContext, Y.abortController.signal, Y.options.isNonInteractiveSession)) W74(q)
    }
    let j = [],
        M = X.data,
        P = !1,
        W, G;
    for await (let y of B1q(Y, A, M, q, w.message.id, $, O, _)) switch (y.type) {
        case "message":
            if (y.message.message.type === "progress") J(y.message.message);
            else j.push(y.message);
            break;
        case "hookPermissionResult":
            G = y.hookPermissionResult;
            break;
        case "hookUpdatedInput":
            M = y.updatedInput;
            break;
        case "preventContinuation":
            P = y.shouldPreventContinuation;
            break;
        case "stopReason":
            W = y.stopReason;
            break;
        case "additionalContext":
            j.push(y.message);
            break;
        case "stop":
            return j.push({
                message: c6({
                    content: [KhA(q)],
                    toolUseResult: `Error: ${W}`,
                    sourceToolAssistantUUID: w.uuid
                })
            }), j
    }
    let f = {};
    if (M && typeof M === "object") {
        if (A.name === Jq && "file_path" in M) f.file_path = String(M.file_path);
        else if ((A.name === bq || A.name === f5) && "file_path" in M) f.file_path = String(M.file_path);
        else if (A.name === h4 && "command" in M) {
            let y = M;
            f.full_command = y.command
        }
    }
    si7(A.name, f), ti7();
    let Z;
    if (G !== void 0 && G.behavior === "allow" && !A.requiresUserInteraction?.() && !Y.requireCanUseTool) h(`Hook approved tool use for ${A.name}, bypassing permission check`), Z = G;
    else if (G !== void 0 && G.behavior === "allow" && (A.requiresUserInteraction?.() || Y.requireCanUseTool)) {
        if (h(`Hook approved tool use for ${A.name}, but canUseTool is required`), G.updatedInput) M = G.updatedInput;
        Z = await z(A, M, Y, w, q)
    } else if (G !== void 0 && G.behavior === "deny") h(`Hook denied tool use for ${A.name}`), Z = G;
    else {
        let y = G?.behavior === "ask" ? G : void 0;
        if (G?.behavior === "ask" && G.updatedInput) M = G.updatedInput;
        Z = await z(A, M, Y, w, q, y)
    }
    if (Z.decisionReason?.type === "hook" && Z.decisionReason.hookName === "PermissionRequest" && Z.behavior !== "ask") j.push({
        message: kq({
            type: "hook_permission_decision",
            decision: Z.behavior,
            toolUseID: q,
            hookEvent: "PermissionRequest"
        })
    });
    if (Z.behavior !== "allow") {
        h(`${A.name} tool permission denied`);
        let y = Y.toolDecisions?.get(q);
        mMA("reject", y?.source || "unknown"), qJ6(), c("tengu_tool_use_can_use_tool_rejected", {
            messageID: H,
            toolName: AK(A.name),
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...O ? {
                mcpServerType: O
            } : {},
            ..._ ? {
                mcpServerBaseUrl: _
            } : {},
            ...$ ? {
                requestId: $
            } : {},
            ...vB() ? (() => {
                let g = Jh(A.name);
                return g ? {
                    mcpServerName: g.serverName,
                    mcpToolName: g.mcpToolName
                } : {}
            })() : {}
        });
        let B = Z.message;
        if (P && !B) B = `Execution stopped by PreToolUse hook${W?`: ${W}`:""}`;
        let S = [{
                type: "tool_result",
                content: B,
                is_error: !0,
                tool_use_id: q
            }],
            m = Z.behavior === "ask" ? Z.contentBlocks : void 0;
        if (m?.length) S.push(...m);
        let b;
        if (m?.length) {
            let g = m.filter((U) => U.type === "image").length;
            if (g > 0) {
                let U = F1q(Y.messages);
                b = Array.from({
                    length: g
                }, (x, p) => U + p)
            }
        }
        return j.push({
            message: c6({
                content: S,
                imagePasteIds: b,
                toolUseResult: `Error: ${B}`,
                sourceToolAssistantUUID: w.uuid
            })
        }), j
    }
    if (c("tengu_tool_use_can_use_tool_allowed", {
            messageID: H,
            toolName: AK(A.name),
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...O ? {
                mcpServerType: O
            } : {},
            ..._ ? {
                mcpServerBaseUrl: _
            } : {},
            ...$ ? {
                requestId: $
            } : {},
            ...vB() ? (() => {
                let y = Jh(A.name);
                return y ? {
                    mcpServerName: y.serverName,
                    mcpToolName: y.mcpToolName
                } : {}
            })() : {}
        }), Z.updatedInput !== void 0) M = Z.updatedInput;
    let N = {};
    if (A.name === h4 && "command" in M) {
        let y = M;
        N = {
            bash_command: y.command.trim().split(/\s+/)[0] || "",
            full_command: y.command,
            ...y.timeout !== void 0 && {
                timeout: y.timeout
            },
            ...y.description !== void 0 && {
                description: y.description
            },
            ..."dangerouslyDisableSandbox" in y && {
                dangerouslyDisableSandbox: y.dangerouslyDisableSandbox
            }
        }
    }
    if (rx7()) {
        let y = Jh(A.name);
        if (y) N.mcp_server_name = y.serverName, N.mcp_tool_name = y.mcpToolName;
        let B = ox7(A.name, M);
        if (B) N.skill_name = B
    }
    let T = Y.toolDecisions?.get(q);
    mMA(T?.decision || "unknown", T?.source || "unknown"), ei7();
    let k = Date.now();
    try {
        let y = await A.call(M, {
                ...Y,
                userModified: Z.userModified ?? !1
            }, z, w, (s) => {
                J({
                    toolUseID: s.toolUseID,
                    data: s.data
                })
            }),
            B = Date.now() - k;
        if (Jn1(B), y.data && typeof y.data === "object") {
            let s = {};
            if (A.name === Jq && "content" in y.data) {
                if ("file_path" in M) s.file_path = String(M.file_path);
                s.content = String(y.data.content)
            }
            if ((A.name === bq || A.name === f5) && "file_path" in M) {
                if (s.file_path = String(M.file_path), A.name === bq && "diff" in y.data) s.diff = String(y.data.diff);
                if (A.name === f5 && "content" in M) s.content = String(M.content)
            }
            if (A.name === h4 && "command" in M) {
                let O1 = M;
                if (s.bash_command = O1.command, "output" in y.data) s.output = String(y.data.output)
            }
            if (Object.keys(s).length > 0) An7("tool.output", s)
        }
        if (typeof y === "object" && "structured_output" in y) j.push({
            message: kq({
                type: "structured_output",
                data: y.structured_output
            })
        });
        FMA({
            success: !0
        });
        let S = y.data && typeof y.data === "object" ? Q1(y.data) : String(y.data ?? "");
        qJ6(S);
        let m = 0;
        try {
            m = Q1(y.data).length
        } catch (s) {
            K1(s instanceof Error ? s : Error(String(s)))
        }
        let b;
        if (M && typeof M === "object") {
            if ((A.name === Jq || A.name === bq || A.name === f5) && "file_path" in M) b = cb1(String(M.file_path));
            else if (A.name === jM && "notebook_path" in M) b = cb1(String(M.notebook_path));
            else if (A.name === h4 && "command" in M) {
                let s = M;
                b = ax7(s.command, s._simulatedSedEdit?.filePath)
            }
        }
        c("tengu_tool_use_success", {
            messageID: H,
            toolName: AK(A.name),
            isMcp: A.isMcp ?? !1,
            durationMs: B,
            toolResultSizeBytes: m,
            ...b !== void 0 && {
                fileExtension: b
            },
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...O ? {
                mcpServerType: O
            } : {},
            ..._ ? {
                mcpServerBaseUrl: _
            } : {},
            ...$ ? {
                requestId: $
            } : {},
            ...vB() ? (() => {
                let s = Jh(A.name);
                return s ? {
                    mcpServerName: s.serverName,
                    mcpToolName: s.mcpToolName
                } : {}
            })() : {}
        }), Up7(A.name);
        let g = $E(A) ? dyA(A.name) : null;
        zj("tool_result", {
            tool_name: AK(A.name),
            success: "true",
            duration_ms: String(B),
            ...Object.keys(N).length > 0 && {
                tool_parameters: Q1(N)
            },
            tool_result_size_bytes: String(m),
            ...T && {
                decision_source: T.source,
                decision_type: T.decision
            },
            ...g ? {
                mcp_server_scope: g
            } : {}
        });
        let U = y.data,
            x = [],
            p = y.contextModifier,
            l = y.mcpMeta;
        async function r(s) {
            let T1 = [await S$6(A, s, q)];
            if ("acceptFeedback" in Z && Z.acceptFeedback) T1.push({
                type: "text",
                text: Z.acceptFeedback
            });
            let N1 = "contentBlocks" in Z ? Z.contentBlocks : void 0;
            if (N1?.length) T1.push(...N1);
            let j1;
            if (N1?.length) {
                let q1 = N1.filter((t) => t.type === "image").length;
                if (q1 > 0) {
                    let t = F1q(Y.messages);
                    j1 = Array.from({
                        length: q1
                    }, (J1, D1) => t + D1)
                }
            }
            j.push({
                message: c6({
                    content: T1,
                    imagePasteIds: j1,
                    toolUseResult: Y.agentId && !Y.preserveToolUseResults ? void 0 : s,
                    mcpMeta: Y.agentId ? void 0 : l,
                    sourceToolAssistantUUID: w.uuid
                }),
                contextModifier: p ? {
                    toolUseID: q,
                    modifyContext: p
                } : void 0
            })
        }
        if (!$E(A)) await r(U);
        for await (let s of b1q(Y, A, q, w.message.id, M, U, $, O, _)) if ("updatedMCPToolOutput" in s) {
            if ($E(A)) U = s.updatedMCPToolOutput
        } else if ($E(A)) x.push(s);
        else j.push(s);
        if ($E(A)) await r(U);
        if (y.newMessages && y.newMessages.length > 0)
            for (let s of y.newMessages) j.push({
                message: s
            });
        if (P) j.push({
            message: kq({
                type: "hook_stopped_continuation",
                message: W || "Execution stopped by hook",
                hookName: `PreToolUse:${A.name}`,
                toolUseID: q,
                hookEvent: "PreToolUse"
            })
        });
        for (let s of x) j.push(s);
        return j
    } catch (y) {
        let B = Date.now() - k;
        if (Jn1(B), FMA({
                success: !1,
                error: y instanceof Error ? y.message : String(y)
            }), qJ6(), y instanceof aG6) Y.setAppState((g) => {
            let U = y.serverName,
                x = g.mcp.clients.findIndex((r) => r.name === U);
            if (x === -1) return g;
            let p = g.mcp.clients[x];
            if (!p || p.type !== "connected") return g;
            let l = [...g.mcp.clients];
            return l[x] = {
                name: U,
                type: "needs-auth",
                config: p.config
            }, {
                ...g,
                mcp: {
                    ...g.mcp,
                    clients: l
                }
            }
        });
        if (!(y instanceof dz)) {
            let g = y instanceof Error ? y.message : String(y);
            if (h(`${A.name} tool error (${B}ms): ${g.slice(0,200)}`), !(y instanceof DC)) K1(y instanceof Error ? y : Error(String(y)));
            c("tengu_tool_use_error", {
                messageID: H,
                toolName: AK(A.name),
                error: y instanceof Ok ? y.telemetryMessage.slice(0, 200) : y instanceof Error ? y.constructor.name : "UnknownError",
                isMcp: A.isMcp ?? !1,
                queryChainId: Y.queryTracking?.chainId,
                queryDepth: Y.queryTracking?.depth,
                ...O ? {
                    mcpServerType: O
                } : {},
                ..._ ? {
                    mcpServerBaseUrl: _
                } : {},
                ...$ ? {
                    requestId: $
                } : {},
                ...vB() ? (() => {
                    let x = Jh(A.name);
                    return x ? {
                        mcpServerName: x.serverName,
                        mcpToolName: x.mcpToolName
                    } : {}
                })() : {}
            });
            let U = $E(A) ? dyA(A.name) : null;
            zj("tool_result", {
                tool_name: AK(A.name),
                use_id: q,
                success: "false",
                duration_ms: String(B),
                error: y instanceof Error ? y.message : String(y),
                ...Object.keys(N).length > 0 && {
                    tool_parameters: Q1(N)
                },
                ...T && {
                    decision_source: T.source,
                    decision_type: T.decision
                },
                ...U ? {
                    mcp_server_scope: U
                } : {}
            })
        }
        let S = uG1(y),
            m = y instanceof dz,
            b = [];
        for await (let g of u1q(Y, A, q, H, M, S, m, $, O, _)) b.push(g);
        return [{
            message: c6({
                content: [{
                    type: "tool_result",
                    content: S,
                    is_error: !0,
                    tool_use_id: q
                }],
                toolUseResult: `Error: ${S}`,
                sourceToolAssistantUUID: w.uuid
            })
        }, ...b]
    } finally {
        if (T) Y.toolDecisions?.delete(q)
    }
}
// @from(Ln 380341, Col 4)
qhA = v(() => {
    u6();
    U$();
    aa();
    As();
    B6();
    _H();
    SD();
    $P();
    qH();
    y6();
    Z6();
    Pp();
    T_6();
    N8();
    FW();
    _T();
    tX();
    SW();
    tSA();
    m6();
    km();
    iK1();
    sZ6();
    m1q()
})
// @from(Ln 380367, Col 0)
class uU1 {
    toolDefinitions;
    canUseTool;
    tools = [];
    toolUseContext;
    hasErrored = !1;
    discarded = !1;
    progressAvailableResolve;
    constructor(A, q, K) {
        this.toolDefinitions = A;
        this.canUseTool = q;
        this.toolUseContext = K
    }
    discard() {
        this.discarded = !0
    }
    addTool(A, q) {
        let K = this.toolDefinitions.find((w) => w.name === A.name);
        if (!K) {
            this.tools.push({
                id: A.id,
                block: A,
                assistantMessage: q,
                status: "completed",
                isConcurrencySafe: !0,
                pendingProgress: [],
                results: [c6({
                    content: [{
                        type: "tool_result",
                        content: `<tool_use_error>Error: No such tool available: ${A.name}</tool_use_error>`,
                        is_error: !0,
                        tool_use_id: A.id
                    }],
                    toolUseResult: `Error: No such tool available: ${A.name}`,
                    sourceToolAssistantUUID: q.uuid
                })]
            });
            return
        }
        let Y = K.inputSchema.safeParse(A.input),
            z = Y?.success ? (() => {
                try {
                    return Boolean(K.isConcurrencySafe(Y.data))
                } catch {
                    return !1
                }
            })() : !1;
        this.tools.push({
            id: A.id,
            block: A,
            assistantMessage: q,
            status: "queued",
            isConcurrencySafe: z,
            pendingProgress: []
        }), this.processQueue()
    }
    canExecuteTool(A) {
        let q = this.tools.filter((K) => K.status === "executing");
        return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
    }
    async processQueue() {
        for (let A of this.tools) {
            if (A.status !== "queued") continue;
            if (this.canExecuteTool(A.isConcurrencySafe)) await this.executeTool(A);
            else if (!A.isConcurrencySafe) break
        }
    }
    createSyntheticErrorMessage(A, q, K) {
        if (q === "user_interrupted") return c6({
            content: [{
                type: "tool_result",
                content: nK1,
                is_error: !0,
                tool_use_id: A
            }],
            toolUseResult: "User rejected tool use",
            sourceToolAssistantUUID: K.uuid
        });
        if (q === "streaming_fallback") return c6({
            content: [{
                type: "tool_result",
                content: "<tool_use_error>Error: Streaming fallback - tool execution discarded</tool_use_error>",
                is_error: !0,
                tool_use_id: A
            }],
            toolUseResult: "Streaming fallback - tool execution discarded",
            sourceToolAssistantUUID: K.uuid
        });
        return c6({
            content: [{
                type: "tool_result",
                content: "<tool_use_error>Sibling tool call errored</tool_use_error>",
                is_error: !0,
                tool_use_id: A
            }],
            toolUseResult: "Sibling tool call errored",
            sourceToolAssistantUUID: K.uuid
        })
    }
    getAbortReason() {
        if (this.discarded) return "streaming_fallback";
        if (this.hasErrored) return "sibling_error";
        if (this.toolUseContext.abortController.signal.aborted) {
            if (this.toolUseContext.abortController.signal.reason === "interrupt") return null;
            return "user_interrupted"
        }
        return null
    }
    async executeTool(A) {
        A.status = "executing", this.toolUseContext.setInProgressToolUseIDs((w) => new Set([...w, A.id]));
        let q = [],
            K = [],
            z = (async () => {
                let w = this.getAbortReason();
                if (w) {
                    q.push(this.createSyntheticErrorMessage(A.id, w, A.assistantMessage)), A.results = q, A.contextModifiers = K, A.status = "completed";
                    return
                }
                let H = bU1(A.block, A.assistantMessage, this.canUseTool, this.toolUseContext),
                    $ = !1;
                for await (let O of H) {
                    let _ = this.getAbortReason();
                    if (_ && !$) {
                        q.push(this.createSyntheticErrorMessage(A.id, _, A.assistantMessage));
                        break
                    }
                    if (O.message.type === "user" && Array.isArray(O.message.message.content) && O.message.message.content.some((X) => X.type === "tool_result" && X.is_error === !0)) this.hasErrored = !0, $ = !0;
                    if (O.message)
                        if (O.message.type === "progress") {
                            if (A.pendingProgress.push(O.message), this.progressAvailableResolve) this.progressAvailableResolve(), this.progressAvailableResolve = void 0
                        } else q.push(O.message);
                    if (O.contextModifier) K.push(O.contextModifier.modifyContext)
                }
                if (A.results = q, A.contextModifiers = K, A.status = "completed", !A.isConcurrencySafe && K.length > 0)
                    for (let O of K) this.toolUseContext = O(this.toolUseContext)
            })();
        A.promise = z, z.finally(() => {
            this.processQueue()
        })
    }* getCompletedResults() {
        if (this.discarded) return;
        for (let A of this.tools) {
            while (A.pendingProgress.length > 0) yield {
                message: A.pendingProgress.shift()
            };
            if (A.status === "yielded") continue;
            if (A.status === "completed" && A.results) {
                A.status = "yielded";
                for (let q of A.results) yield {
                    message: q
                };
                TdY(this.toolUseContext, A.id)
            } else if (A.status === "executing" && !A.isConcurrencySafe) break
        }
    }
    hasPendingProgress() {
        return this.tools.some((A) => A.pendingProgress.length > 0)
    }
    async * getRemainingResults() {
        if (this.discarded) return;
        while (this.hasUnfinishedTools()) {
            await this.processQueue();
            for (let A of this.getCompletedResults()) yield A;
            if (this.hasExecutingTools() && !this.hasCompletedResults() && !this.hasPendingProgress()) {
                let A = this.tools.filter((K) => K.status === "executing" && K.promise).map((K) => K.promise),
                    q = new Promise((K) => {
                        this.progressAvailableResolve = K
                    });
                if (A.length > 0) await Promise.race([...A, q])
            }
        }
        for (let A of this.getCompletedResults()) yield A
    }
    hasCompletedResults() {
        return this.tools.some((A) => A.status === "completed")
    }
    hasExecutingTools() {
        return this.tools.some((A) => A.status === "executing")
    }
    hasUnfinishedTools() {
        return this.tools.some((A) => A.status !== "yielded")
    }
    getUpdatedContext() {
        return this.toolUseContext
    }
}
// @from(Ln 380554, Col 0)
function TdY(A, q) {
    A.setInProgressToolUseIDs((K) => new Set([...K].filter((Y) => Y !== q)))
}
// @from(Ln 380557, Col 4)
p1q = v(() => {
    qhA();
    N8()
})
// @from(Ln 380562, Col 0)
function HhA() {
    if (!YhA) YhA = h1("perf_hooks").performance;
    return YhA
}
// @from(Ln 380567, Col 0)
function l1q() {
    if (!BU1) return;
    HhA().clearMarks(), whA.clear(), zhA = null, c1q++, y3("query_user_input_received")
}
// @from(Ln 380572, Col 0)
function y3(A) {
    if (!BU1) return;
    let q = HhA();
    if (q.mark(A), whA.set(A, process.memoryUsage()), A === "query_first_chunk_received" && zhA === null) {
        let K = q.getEntriesByType("mark");
        if (K.length > 0) zhA = K[K.length - 1]?.startTime ?? 0
    }
}
// @from(Ln 380581, Col 0)
function i1q() {
    if (!BU1) return;
    y3("query_profile_end")
}
// @from(Ln 380586, Col 0)
function st(A) {
    return A.toFixed(3)
}
// @from(Ln 380590, Col 0)
function d1q(A) {
    return (A / 1024 / 1024).toFixed(2)
}
// @from(Ln 380594, Col 0)
function vdY(A, q) {
    if (q === "query_user_input_received") return "";
    if (A > 1000) return " ⚠️  VERY SLOW";
    if (A > 100) return " ⚠️  SLOW";
    if (q.includes("git_status") && A > 50) return " ⚠️  git status";
    if (q.includes("tool_schema") && A > 50) return " ⚠️  tool schemas";
    if (q.includes("client_creation") && A > 50) return " ⚠️  client creation";
    return ""
}
// @from(Ln 380604, Col 0)
function EdY() {
    if (!BU1) return "Query profiling not enabled (set CLAUDE_CODE_PROFILE_QUERY=1)";
    let q = HhA().getEntriesByType("mark");
    if (q.length === 0) return "No query profiling checkpoints recorded";
    let K = [];
    K.push("=".repeat(80)), K.push(`QUERY PROFILING REPORT - Query #${c1q}`), K.push("=".repeat(80)), K.push("");
    let Y = q[0]?.startTime ?? 0,
        z = Y,
        w = 0,
        H = 0;
    for (let _ of q) {
        let J = _.startTime - Y,
            X = st(J),
            D = _.startTime - z,
            j = st(D),
            M = whA.get(_.name),
            P = vdY(D, _.name),
            W = M ? ` | RSS: ${d1q(M.rss)}MB, Heap: ${d1q(M.heapUsed)}MB` : "";
        if (K.push(`[+${X.padStart(10)}ms] (+${j.padStart(9)}ms) ${_.name}${P}${W}`), _.name === "query_api_request_sent") w = J;
        if (_.name === "query_first_chunk_received") H = J;
        z = _.startTime
    }
    let $ = q[q.length - 1],
        O = $ ? $.startTime - Y : 0;
    if (K.push(""), K.push("-".repeat(80)), H > 0) {
        let _ = w,
            J = H - w,
            X = (_ / H * 100).toFixed(1),
            D = (J / H * 100).toFixed(1);
        K.push(`Total TTFT: ${st(H)}ms`), K.push(`  - Pre-request overhead: ${st(_)}ms (${X}%)`), K.push(`  - Network latency: ${st(J)}ms (${D}%)`)
    } else K.push(`Total time: ${st(O)}ms`);
    return K.push(kdY(q, Y)), K.push("=".repeat(80)), K.join(`
`)
}
// @from(Ln 380639, Col 0)
function kdY(A, q) {
    let K = [{
            name: "Context loading",
            start: "query_context_loading_start",
            end: "query_context_loading_end"
        }, {
            name: "Microcompact",
            start: "query_microcompact_start",
            end: "query_microcompact_end"
        }, {
            name: "Autocompact",
            start: "query_autocompact_start",
            end: "query_autocompact_end"
        }, {
            name: "Query setup",
            start: "query_setup_start",
            end: "query_setup_end"
        }, {
            name: "Tool schemas",
            start: "query_tool_schema_build_start",
            end: "query_tool_schema_build_end"
        }, {
            name: "Message normalization",
            start: "query_message_normalization_start",
            end: "query_message_normalization_end"
        }, {
            name: "Client creation",
            start: "query_client_creation_start",
            end: "query_client_creation_end"
        }, {
            name: "Network TTFB",
            start: "query_api_request_sent",
            end: "query_first_chunk_received"
        }, {
            name: "Tool execution",
            start: "query_tool_execution_start",
            end: "query_tool_execution_end"
        }],
        Y = new Map(A.map((H) => [H.name, H.startTime - q])),
        z = [];
    z.push(""), z.push("PHASE BREAKDOWN:");
    for (let H of K) {
        let $ = Y.get(H.start),
            O = Y.get(H.end);
        if ($ !== void 0 && O !== void 0) {
            let _ = O - $,
                J = "█".repeat(Math.min(Math.ceil(_ / 10), 50));
            z.push(`  ${H.name.padEnd(22)} ${st(_).padStart(10)}ms ${J}`)
        }
    }
    let w = Y.get("query_api_request_sent");
    if (w !== void 0) z.push(""), z.push(`  ${"Total pre-API overhead".padEnd(22)} ${st(w).padStart(10)}ms`);
    return z.join(`
`)
}
// @from(Ln 380695, Col 0)
function n1q() {
    if (!BU1) return;
    h(EdY())
}
// @from(Ln 380699, Col 4)
BU1 = !1
// @from(Ln 380700, Col 4)
whA
// @from(Ln 380700, Col 9)
c1q = 0
// @from(Ln 380701, Col 4)
zhA = null
// @from(Ln 380702, Col 4)
YhA = null
// @from(Ln 380703, Col 4)
BG1 = v(() => {
    Z6();
    whA = new Map
})
// @from(Ln 380708, Col 0)
function LdY() {
    return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10
}
// @from(Ln 380711, Col 0)
async function* tZ6(A, q, K, Y) {
    let z = Y;
    for (let {
            isConcurrencySafe: w,
            blocks: H
        }
        of RdY(A, z))
        if (w) {
            let $ = {};
            for await (let O of CdY(H, q, K, z)) {
                if (O.contextModifier) {
                    let {
                        toolUseID: _,
                        modifyContext: J
                    } = O.contextModifier;
                    if (!$[_]) $[_] = [];
                    $[_].push(J)
                }
                yield {
                    message: O.message,
                    newContext: z
                }
            }
            for (let O of H) {
                let _ = $[O.id];
                if (!_) continue;
                for (let J of _) z = J(z)
            }
            yield {
                newContext: z
            }
        } else
            for await (let $ of ydY(H, q, K, z)) {
                if ($.newContext) z = $.newContext;
                yield {
                    message: $.message,
                    newContext: z
                }
            }
}
// @from(Ln 380752, Col 0)
function RdY(A, q) {
    return A.reduce((K, Y) => {
        let z = q.options.tools.find(($) => $.name === Y.name),
            w = z?.inputSchema.safeParse(Y.input),
            H = w?.success ? (() => {
                try {
                    return Boolean(z?.isConcurrencySafe(w.data))
                } catch {
                    return !1
                }
            })() : !1;
        if (H && K[K.length - 1]?.isConcurrencySafe) K[K.length - 1].blocks.push(Y);
        else K.push({
            isConcurrencySafe: H,
            blocks: [Y]
        });
        return K
    }, [])
}
// @from(Ln 380771, Col 0)
async function* ydY(A, q, K, Y) {
    let z = Y;
    for (let w of A) {
        Y.setInProgressToolUseIDs((H) => new Set([...H, w.id]));
        for await (let H of bU1(w, q.find(($) => $.message.content.some((O) => O.type === "tool_use" && O.id === w.id)), K, z)) {
            if (H.contextModifier) z = H.contextModifier.modifyContext(z);
            yield {
                message: H.message,
                newContext: z
            }
        }
        r1q(Y, w.id)
    }
}
// @from(Ln 380785, Col 0)
async function* CdY(A, q, K, Y) {
    yield* _J6(A.map(async function*(z) {
        Y.setInProgressToolUseIDs((w) => new Set([...w, z.id])), yield* bU1(z, q.find((w) => w.message.content.some((H) => H.type === "tool_use" && H.id === z.id)), K, Y), r1q(Y, z.id)
    }), LdY())
}
// @from(Ln 380791, Col 0)
function r1q(A, q) {
    A.setInProgressToolUseIDs((K) => new Set([...K].filter((Y) => Y !== q)))
}
// @from(Ln 380794, Col 4)
$hA = v(() => {
    hK1();
    qhA()
})
// @from(Ln 380802, Col 0)
function eZ6(A) {
    return async (q) => {
        try {
            if (!await A.shouldRun(q)) return;
            let Y = SdY(),
                z = A.buildMessages(q);
            q.queryMessageCount = z.length;
            let w = A.systemPrompt ? [A.systemPrompt] : q.systemPrompt,
                $ = A.useTools ?? !0 ? q.toolUseContext.options.tools : [],
                O = A.getModel(),
                _ = await mp({
                    messages: z,
                    systemPrompt: w,
                    maxThinkingTokens: 0,
                    tools: $,
                    signal: Aq().signal,
                    options: {
                        getToolPermissionContext: async () => {
                            return (await q.toolUseContext.getAppState()).toolPermissionContext
                        },
                        model: O,
                        toolChoice: void 0,
                        isNonInteractiveSession: q.toolUseContext.options.isNonInteractiveSession,
                        hasAppendSystemPrompt: !!q.toolUseContext.options.appendSystemPrompt,
                        temperatureOverride: 0,
                        agents: q.toolUseContext.options.agentDefinitions.activeAgents,
                        querySource: A.name,
                        mcpTools: [],
                        agentId: q.toolUseContext.agentId
                    }
                }),
                J = _.message.content.filter((X) => X.type === "text").map((X) => X.text).join("").trim();
            try {
                let X = A.parseResponse(J, q);
                A.logResult({
                    type: "success",
                    queryName: A.name,
                    result: X,
                    messageId: _.message.id,
                    model: O,
                    uuid: Y
                }, q)
            } catch (X) {
                A.logResult({
                    type: "error",
                    queryName: A.name,
                    error: X,
                    uuid: Y
                }, q)
            }
        } catch (K) {
            K1(K instanceof Error ? K : Error(`API query hook ${A.name} failed`))
        }
    }
}
// @from(Ln 380857, Col 4)
OhA = v(() => {
    yw();
    G2();
    y6()
})
// @from(Ln 380862, Col 0)
async function o1q() {
    return
}
// @from(Ln 380865, Col 0)
async function a1q(A) {
    if (_hA) return _hA(A);
    return null
}
// @from(Ln 380869, Col 4)
_hA = null
// @from(Ln 380870, Col 4)
JhA = v(() => {
    OhA();
    N8();
    u6();
    U4();
    e7();
    cM();
    at()
})
// @from(Ln 380880, Col 0)
function s1q() {
    hdY = []
}
// @from(Ln 380883, Col 4)
hdY
// @from(Ln 380884, Col 4)
t1q = v(() => {
    hdY = []
})
// @from(Ln 380887, Col 0)
async function e1q() {
    return
}
// @from(Ln 380891, Col 0)
function bdY() {
    s1q(), xdY = "", jA((A) => ({
        ...A,
        coachingTipsThisSession: 0
    }))
}
// @from(Ln 380898, Col 0)
function A6q() {
    return f6().coachingMode ?? "off"
}
// @from(Ln 380901, Col 4)
IdY = !1
// @from(Ln 380902, Col 4)
xdY = ""
// @from(Ln 380903, Col 4)
mU1 = v(() => {
    YI();
    N8();
    B6();
    cA();
    u6();
    y6();
    t1q()
})
// @from(Ln 380912, Col 0)
async function* q6q(A, q, K, Y, z, w, H, $) {
    let O = Date.now(),
        _ = {
            messages: [...A, ...q],
            systemPrompt: K,
            userContext: Y,
            systemContext: z,
            toolUseContext: w,
            querySource: H
        },
        J = a1q(_);
    if (process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION !== "false") Y6q(_);
    try {
        let X = [],
            j = (await w.getAppState()).toolPermissionContext.mode,
            M = zyA(j, w.abortController.signal, void 0, $ ?? !1, w.agentId, w, [...A, ...q], w.agentType),
            P = "",
            W = 0,
            G = !1,
            f = "",
            Z = !1,
            N = [],
            T = [];
        for await (let k of M) {
            if (k.message) {
                if (yield k.message, k.message.type === "progress" && k.message.toolUseID) {
                    P = k.message.toolUseID, W++;
                    let y = k.message.data;
                    if (y.command) T.push({
                        command: y.command,
                        promptText: y.promptText
                    })
                }
                if (k.message.type === "attachment") {
                    let y = k.message.attachment;
                    if ("hookEvent" in y && (y.hookEvent === "Stop" || y.hookEvent === "SubagentStop")) {
                        if (y.type === "hook_non_blocking_error") N.push(y.stderr || `Exit code ${y.exitCode}`), Z = !0;
                        else if (y.type === "hook_error_during_execution") N.push(y.content), Z = !0;
                        else if (y.type === "hook_success") {
                            if (y.stdout && y.stdout.trim() || y.stderr && y.stderr.trim()) Z = !0
                        }
                    }
                }
            }
            if (k.blockingError) {
                let y = c6({
                    content: sRA(k.blockingError),
                    isMeta: !0
                });
                X.push(y), yield y, Z = !0, N.push(k.blockingError.blockingError)
            }
            if (k.preventContinuation) G = !0, f = k.stopReason || "Stop hook prevented continuation", yield kq({
                type: "hook_stopped_continuation",
                message: f,
                hookName: "Stop",
                toolUseID: P,
                hookEvent: "Stop"
            });
            if (w.abortController.signal.aborted) return c("tengu_pre_stop_hooks_cancelled", {
                queryChainId: w.queryTracking?.chainId,
                queryDepth: w.queryTracking?.depth
            }), yield FG1({
                toolUse: !1
            }), {
                blockingErrors: [],
                preventContinuation: !0
            }
        }
        if (W > 0) {
            if (yield z6q(W, T, N, G, f, Z, "suggestion", P), N.length > 0) {
                let k = m0("app:toggleTranscript", "Global", "ctrl+o");
                w.addNotification?.({
                    key: "stop-hook-error",
                    text: `Stop hook error occurred · ${k} to see`,
                    priority: "immediate"
                })
            }
        }
        if (G) return {
            blockingErrors: [],
            preventContinuation: !0
        };
        if (X.length > 0) return {
            blockingErrors: X,
            preventContinuation: !1
        };
        if (Dz()) {
            let k = g5() ?? "",
                y = i3() ?? "",
                B = [],
                S = WM(),
                b = WX(S).filter((U) => U.status === "in_progress" && U.owner === k);
            for (let U of b) {
                let x = Cg1(U.id, U.subject, U.description, k, y, j, w.abortController.signal, void 0, w);
                for await (let p of x) {
                    if (p.message) yield p.message;
                    if (p.blockingError) {
                        let l = c6({
                            content: yg1(p.blockingError),
                            isMeta: !0
                        });
                        B.push(l), yield l
                    }
                    if (w.abortController.signal.aborted) return {
                        blockingErrors: [],
                        preventContinuation: !0
                    }
                }
            }
            let g = wyA(k, y, j, w.abortController.signal);
            for await (let U of g) {
                if (U.message) yield U.message;
                if (U.blockingError) {
                    let x = c6({
                        content: tRA(U.blockingError),
                        isMeta: !0
                    });
                    B.push(x), yield x
                }
                if (w.abortController.signal.aborted) return {
                    blockingErrors: [],
                    preventContinuation: !0
                }
            }
            if (B.length > 0) return {
                blockingErrors: B,
                preventContinuation: !1
            }
        }
        return {
            blockingErrors: [],
            preventContinuation: !1
        }
    } catch (X) {
        let D = Date.now() - O;
        return c("tengu_stop_hook_error", {
            duration: D,
            queryChainId: w.queryTracking?.chainId,
            queryDepth: w.queryTracking?.depth
        }), yield WP(`Stop hook failed: ${X instanceof Error?X.message:String(X)}`, "warning"), {
            blockingErrors: [],
            preventContinuation: !1
        }
    } finally {
        let X = await J;
        if (X) yield X
    }
}
// @from(Ln 381060, Col 4)
K6q = v(() => {
    u6();
    N8();
    FW();
    aM();
    Cz();
    vw();
    JhA();
    s2();
    mG1();
    mU1()
})
// @from(Ln 381076, Col 0)
function* XhA(A, q) {
    for (let K of A) {
        let Y = K.message.content.filter((z) => z.type === "tool_use");
        for (let z of Y) yield c6({
            content: [{
                type: "tool_result",
                content: q,
                is_error: !0,
                tool_use_id: z.id
            }],
            toolUseResult: q,
            sourceToolAssistantUUID: K.uuid
        })
    }
}
// @from(Ln 381091, Col 0)
async function* ZR({
    messages: A,
    systemPrompt: q,
    userContext: K,
    systemContext: Y,
    canUseTool: z,
    toolUseContext: w,
    fallbackModel: H,
    querySource: $,
    maxOutputTokensOverride: O,
    maxTurns: _
}) {
    let J, X, D = 0,
        j = 1,
        M;
    while (!0) {
        if (yield {
                type: "stream_request_start"
            }, y3("query_fn_entry"), !w.agentId) t51("query_started");
        let P = w.queryTracking ? {
                chainId: w.queryTracking.chainId,
                depth: w.queryTracking.depth + 1
            } : {
                chainId: w6q(),
                depth: 0
            },
            W = P.chainId;
        w = {
            ...w,
            queryTracking: P
        };
        let G = [...EN(A)],
            f = J;
        y3("query_microcompact_start");
        let Z = await gm(G, void 0, w);
        if (G = Z.messages, Z.compactionInfo?.boundaryMessage) yield Z.compactionInfo.boundaryMessage;
        y3("query_microcompact_end");
        let N = k1q(q, Y);
        y3("query_autocompact_start");
        let {
            compactionResult: T
        } = await fs4(G, w, {
            systemPrompt: q,
            userContext: K,
            systemContext: Y,
            toolUseContext: w,
            forkContextMessages: G
        }, $);
        if (y3("query_autocompact_end"), T) {
            let {
                preCompactTokenCount: Z1,
                postCompactTokenCount: E1,
                compactionUsage: a
            } = T;
            if (c("tengu_auto_compact_succeeded", {
                    originalMessageCount: A.length,
                    compactedMessageCount: T.summaryMessages.length + T.attachments.length + T.hookResults.length,
                    preCompactTokenCount: Z1,
                    postCompactTokenCount: E1,
                    compactionInputTokens: a?.input_tokens,
                    compactionOutputTokens: a?.output_tokens,
                    compactionCacheReadTokens: a?.cache_read_input_tokens ?? 0,
                    compactionCacheCreationTokens: a?.cache_creation_input_tokens ?? 0,
                    compactionTotalTokens: a ? a.input_tokens + (a.cache_creation_input_tokens ?? 0) + (a.cache_read_input_tokens ?? 0) + a.output_tokens : 0,
                    queryChainId: W,
                    queryDepth: P.depth
                }), !f?.compacted) f = {
                compacted: !0,
                turnId: w6q(),
                turnCounter: 0
            };
            let A1 = qt(T);
            for (let M1 of A1) yield M1;
            G = A1, Ms4()
        }
        w = {
            ...w,
            messages: G
        };
        let k = [],
            y = [];
        y3("query_setup_start");
        let S = i2("tengu_streaming_tool_execution2") ? new uU1(w.options.tools, z, w) : null,
            m = await w.getAppState(),
            b = m.toolPermissionContext.mode,
            g = $71({
                permissionMode: b,
                mainLoopModel: w.options.mainLoopModel,
                exceeds200kTokens: b === "plan" && kw6(G)
            });
        y3("query_setup_end");
        let U = void 0;
        if (!T) {
            let {
                isAtBlockingLimit: Z1
            } = Ac(Ev(G), w.options.mainLoopModel);
            if (Z1) {
                yield pY({
                    content: dU,
                    error: "invalid_request"
                });
                return
            }
        }
        let x = !0;
        y3("query_api_loop_start");
        try {
            while (x) {
                x = !1;
                try {
                    let Z1 = !1;
                    y3("query_api_streaming_start");
                    for await (let E1 of UW1({
                        messages: bG1(G, K),
                        systemPrompt: N,
                        maxThinkingTokens: w.options.maxThinkingTokens,
                        tools: w.options.tools,
                        signal: w.abortController.signal,
                        options: {
                            async getToolPermissionContext() {
                                return (await w.getAppState()).toolPermissionContext
                            },
                            model: g,
                            ...i4() ? {
                                fastMode: m.fastMode
                            } : {},
                            toolChoice: void 0,
                            isNonInteractiveSession: w.options.isNonInteractiveSession,
                            fallbackModel: H,
                            onStreamingFallback: () => {
                                Z1 = !0
                            },
                            querySource: $,
                            agents: w.options.agentDefinitions.activeAgents,
                            allowedAgentTypes: w.options.agentDefinitions.allowedAgentTypes,
                            hasAppendSystemPrompt: !!w.options.appendSystemPrompt,
                            maxOutputTokensOverride: O,
                            fetchOverride: U,
                            mcpTools: m.mcp.tools,
                            queryTracking: P,
                            effortValue: m.effortValue,
                            agentId: w.agentId
                        }
                    })) {
                        if (Z1) {
                            for (let a of k) yield {
                                type: "tombstone",
                                message: a
                            };
                            if (c("tengu_orphaned_messages_tombstoned", {
                                    orphanedMessageCount: k.length,
                                    queryChainId: W,
                                    queryDepth: P.depth
                                }), k.length = 0, y.length = 0, S) S.discard(), S = new uU1(w.options.tools, z, w)
                        }
                        if (yield E1, E1.type === "assistant") {
                            if (k.push(E1), S && !w.abortController.signal.aborted) {
                                let a = E1.message.content.filter((A1) => A1.type === "tool_use");
                                for (let A1 of a) S.addTool(A1, E1)
                            }
                        }
                        if (S && !w.abortController.signal.aborted) {
                            for (let a of S.getCompletedResults())
                                if (a.message) yield a.message, y.push(...WJ([a.message], w.options.tools).filter((A1) => A1.type === "user"))
                        }
                    }
                    y3("query_api_streaming_end")
                } catch (Z1) {
                    if (Z1 instanceof f26 && H) {
                        if (g = H, x = !0, yield* XhA(k, "Model fallback triggered"), k.length = 0, y.length = 0, S) S.discard(), S = new uU1(w.options.tools, z, w);
                        w.options.mainLoopModel = H, c("tengu_model_fallback_triggered", {
                            original_model: Z1.originalModel,
                            fallback_model: H,
                            entrypoint: "cli",
                            queryChainId: W,
                            queryDepth: P.depth
                        }), yield WP(`Model fallback triggered: switching from ${Z1.originalModel} to ${Z1.fallbackModel}`, "info");
                        continue
                    }
                    throw Z1
                }
            }
        } catch (Z1) {
            K1(Z1 instanceof Error ? Z1 : Error(String(Z1)));
            let E1 = Z1 instanceof Error ? Z1.message : String(Z1);
            if (c("tengu_query_error", {
                    assistantMessages: k.length,
                    toolUses: k.flatMap((a) => a.message.content.filter((A1) => A1.type === "tool_use")).length,
                    queryChainId: W,
                    queryDepth: P.depth
                }), Z1 instanceof GD1 || Z1 instanceof e41) {
                yield pY({
                    content: Z1.message
                });
                return
            }
            yield* XhA(k, E1), yield FG1({
                toolUse: !1
            }), Yk("Query error", Z1);
            return
        }
        if (k.length > 0) h1q([...G, ...k], q, K, Y, w, $);
        if (k.some((Z1) => Z1.message.content.some((E1) => E1.type === "text" && Ls4(E1.text)))) c("tengu_model_response_keyword_detected", {
            is_overly_agreeable: !0,
            queryChainId: W,
            queryDepth: P.depth
        });
        if (w.abortController.signal.aborted) {
            if (S) {
                for await (let Z1 of S.getRemainingResults()) if (Z1.message) yield Z1.message
            } else yield* XhA(k, "Interrupted by user");
            if (w.abortController.signal.reason !== "interrupt") yield FG1({
                toolUse: !1
            });
            return
        }
        let l = k.flatMap((Z1) => Z1.message.content.filter((E1) => E1.type === "tool_use"));
        if (M) {
            let Z1 = await M;
            if (Z1) yield Z1
        }
        if (!k.length || !l.length) {
            if (k[k.length - 1]?.apiError === "max_output_tokens" && D < udY) {
                let a = c6({
                        content: "Your response was cut off because it exceeded the output token limit. Please break your work into smaller pieces. Continue from where you left off.",
                        isMeta: !0
                    }),
                    A1 = {
                        messages: [...G, ...k, a],
                        toolUseContext: w,
                        autoCompactTracking: f,
                        maxOutputTokensRecoveryCount: D + 1,
                        maxOutputTokensOverride: void 0,
                        pendingToolUseSummary: void 0,
                        stopHookActive: void 0,
                        turnCount: j
                    };
                A = A1.messages, w = A1.toolUseContext, J = A1.autoCompactTracking, D = A1.maxOutputTokensRecoveryCount, O = A1.maxOutputTokensOverride, M = A1.pendingToolUseSummary, X = A1.stopHookActive, j = A1.turnCount;
                continue
            }
            let E1 = yield* q6q(G, k, q, K, Y, w, $, X);
            if (E1.preventContinuation) return;
            if (E1.blockingErrors.length > 0) {
                let a = {
                    messages: [...G, ...k, ...E1.blockingErrors],
                    toolUseContext: w,
                    autoCompactTracking: f,
                    maxOutputTokensRecoveryCount: 0,
                    maxOutputTokensOverride: void 0,
                    pendingToolUseSummary: void 0,
                    stopHookActive: !0,
                    turnCount: j
                };
                A = a.messages, w = a.toolUseContext, J = a.autoCompactTracking, D = a.maxOutputTokensRecoveryCount, O = a.maxOutputTokensOverride, M = a.pendingToolUseSummary, X = a.stopHookActive, j = a.turnCount;
                continue
            }
            return
        }
        let r = !1,
            s = w;
        if (y3("query_tool_execution_start"), S) {
            c("tengu_streaming_tool_execution_used", {
                tool_count: l.length,
                queryChainId: W,
                queryDepth: P.depth
            });
            for await (let Z1 of S.getRemainingResults()) {
                let E1 = Z1.message;
                if (!E1) continue;
                if (yield E1, E1 && E1.type === "attachment" && E1.attachment.type === "hook_stopped_continuation") r = !0;
                y.push(...WJ([E1], w.options.tools).filter((a) => a.type === "user"))
            }
            s = {
                ...S.getUpdatedContext(),
                queryTracking: P
            }
        } else {
            c("tengu_streaming_tool_execution_not_used", {
                tool_count: l.length,
                queryChainId: W,
                queryDepth: P.depth
            });
            for await (let Z1 of tZ6(l, k, z, w)) {
                if (Z1.message) {
                    if (yield Z1.message, Z1.message.type === "attachment" && Z1.message.attachment.type === "hook_stopped_continuation") r = !0;
                    y.push(...WJ([Z1.message], w.options.tools).filter((E1) => E1.type === "user"))
                }
                if (Z1.newContext) s = {
                    ...Z1.newContext,
                    queryTracking: P
                }
            }
        }
        y3("query_tool_execution_end");
        let O1;
        if (J6(process.env.CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES) && l.length > 0 && !w.abortController.signal.aborted) {
            let Z1 = k[k.length - 1],
                E1;
            if (Z1) {
                let M1 = Z1.message.content.filter((z1) => z1.type === "text");
                if (M1.length > 0) {
                    let z1 = M1[M1.length - 1];
                    if (z1 && "text" in z1) E1 = z1.text
                }
            }
            let a = l.map((M1) => M1.id),
                A1 = l.map((M1) => {
                    let z1 = y.find((_1) => _1.type === "user" && Array.isArray(_1.message.content) && _1.message.content.some(($1) => $1.type === "tool_result" && $1.tool_use_id === M1.id)),
                        Y1 = z1?.type === "user" && Array.isArray(z1.message.content) ? z1.message.content.find((_1) => _1.type === "tool_result" && _1.tool_use_id === M1.id) : void 0;
                    return {
                        name: M1.name,
                        input: M1.input,
                        output: Y1 && "content" in Y1 ? Y1.content : null
                    }
                });
            O1 = Ts4({
                tools: A1,
                signal: w.abortController.signal,
                isNonInteractiveSession: w.options.isNonInteractiveSession,
                lastAssistantText: E1
            }).then((M1) => {
                if (M1) return H6q(M1, a);
                return null
            }).catch(() => null)
        }
        if (w.abortController.signal.aborted) {
            if (w.abortController.signal.reason !== "interrupt") yield FG1({
                toolUse: !0
            });
            let Z1 = j + 1;
            if (_ && Z1 > _) yield kq({
                type: "max_turns_reached",
                maxTurns: _,
                turnCount: Z1
            });
            return
        }
        if (r) return;
        if (f?.compacted) f.turnCounter++, c("tengu_post_autocompact_turn", {
            turnId: f.turnId,
            turnCounter: f.turnCounter,
            queryChainId: W,
            queryDepth: P.depth
        });
        c("tengu_query_before_attachments", {
            messagesForQueryCount: G.length,
            assistantMessagesCount: k.length,
            toolResultsCount: y.length,
            queryChainId: W,
            queryDepth: P.depth
        });
        let N1 = (await s.getAppState()).queuedCommands;
        for await (let Z1 of oP1(null, s, null, N1, [...G, ...k, ...y], $)) yield Z1, y.push(Z1);
        let j1 = N1.filter((Z1) => Z1.mode === "prompt");
        if (j1.length > 0) Bp7(j1, s.setAppState);
        let q1 = y.filter((Z1) => Z1.type === "attachment" && Z1.attachment.type === "edited_text_file").length;
        c("tengu_query_after_attachments", {
            totalToolResultsCount: y.length,
            fileChangeAttachmentCount: q1,
            queryChainId: W,
            queryDepth: P.depth
        });
        let t = {
                ...s,
                queryTracking: P
            },
            J1 = j + 1;
        if (_ && J1 > _) {
            yield kq({
                type: "max_turns_reached",
                maxTurns: _,
                turnCount: J1
            });
            return
        }
        y3("query_recursive_call");
        let D1 = {
            messages: [...G, ...k, ...y],
            toolUseContext: t,
            autoCompactTracking: f,
            turnCount: J1,
            maxOutputTokensRecoveryCount: 0,
            pendingToolUseSummary: O1,
            maxOutputTokensOverride: void 0,
            stopHookActive: X
        };
        A = D1.messages, w = D1.toolUseContext, J = D1.autoCompactTracking, j = D1.turnCount, D = D1.maxOutputTokensRecoveryCount, M = D1.pendingToolUseSummary, O = D1.maxOutputTokensOverride, X = D1.stopHookActive
    }
}
// @from(Ln 381480, Col 4)
udY = 3
// @from(Ln 381481, Col 4)
EK1 = v(() => {
    yw();
    Yq1();
    xd();
    Qt();
    vd();
    U4();
    u6();
    X26();
    dL();
    hA();
    y6();
    AB();
    Z6();
    N8();
    vs4();
    at();
    FW();
    AN();
    B6();
    hU1();
    e7();
    RW();
    IU1();
    oj1();
    p1q();
    BG1();
    $hA();
    K6q();
    OJ()
})
// @from(Ln 381513, Col 0)
function BdY(A) {
    if (A instanceof k4) {
        let q = A.error;
        if (q?.error?.message) return q.error.message
    }
    return A instanceof Error ? A.message : String(A)
}
// @from(Ln 381521, Col 0)
function DhA(A) {
    let q = new Set;
    A.forEach((K, Y) => q.add(Y));
    for (let [K, Y] of Object.entries(mdY))
        if (Y.prefixes?.some((z) => Array.from(q).some((w) => w.startsWith(z)))) return K;
    return
}
// @from(Ln 381529, Col 0)
function jhA() {
    return {
        ...process.env.ANTHROPIC_BASE_URL ? {
            baseUrl: process.env.ANTHROPIC_BASE_URL
        } : {},
        ...process.env.ANTHROPIC_MODEL ? {
            envModel: process.env.ANTHROPIC_MODEL
        } : {},
        ...process.env.ANTHROPIC_SMALL_FAST_MODEL ? {
            envSmallFastModel: process.env.ANTHROPIC_SMALL_FAST_MODEL
        } : {}
    }
}
// @from(Ln 381543, Col 0)
function $6q() {
    if (!{
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.BUILD_TIME) return;
    let A = new Date({
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.BUILD_TIME).getTime();
    if (isNaN(A)) return;
    return Math.floor((Date.now() - A) / 60000)
}
// @from(Ln 381564, Col 0)
function O6q({
    model: A,
    messagesLength: q,
    temperature: K,
    betas: Y,
    permissionMode: z,
    querySource: w,
    queryTracking: H,
    effortValue: $,
    fastMode: O
}) {
    c("tengu_api_query", {
        model: A,
        messagesLength: q,
        temperature: K,
        provider: qb(),
        buildAgeMins: $6q(),
        ...Y?.length ? {
            betas: Y.join(",")
        } : {},
        permissionMode: z,
        querySource: w,
        ...H ? {
            queryChainId: H.chainId,
            queryDepth: H.depth
        } : {},
        effortValue: $,
        fastMode: O,
        ...jhA()
    })
}
// @from(Ln 381596, Col 0)
function MhA({
    error: A,
    model: q,
    messageCount: K,
    messageTokens: Y,
    durationMs: z,
    durationMsIncludingRetries: w,
    attempt: H,
    requestId: $,
    didFallBackToNonStreaming: O,
    promptCategory: _,
    headers: J,
    queryTracking: X,
    querySource: D,
    llmSpan: j,
    fastMode: M
}) {
    let P = void 0;
    if (A instanceof k4 && A.headers) P = DhA(A.headers);
    else if (J) P = DhA(J);
    let W = BdY(A),
        G = A instanceof k4 ? String(A.status) : void 0,
        f = Av7(A),
        Z = Kx1(A);
    if (Z) {
        let T = Z.isSSLError ? " (SSL error)" : "";
        h(`Connection error details: code=${Z.code}${T}, message=${Z.message}`, {
            level: "error"
        })
    }
    K1(A), c("tengu_api_error", {
        model: q,
        error: W,
        status: G,
        errorType: f,
        messageCount: K,
        messageTokens: Y,
        durationMs: z,
        durationMsIncludingRetries: w,
        attempt: H,
        provider: qb(),
        requestId: $ || void 0,
        didFallBackToNonStreaming: O,
        ..._ ? {
            promptCategory: _
        } : {},
        ...P ? {
            gateway: P
        } : {},
        ...X ? {
            queryChainId: X.chainId,
            queryDepth: X.depth
        } : {},
        ...D ? {
            querySource: D
        } : {},
        fastMode: M,
        ...jhA()
    }), zj("api_error", {
        model: q,
        error: W,
        status_code: String(G),
        duration_ms: String(z),
        attempt: String(H)
    }), BMA(j, {
        success: !1,
        statusCode: G ? parseInt(G) : void 0,
        error: W,
        attempt: H
    });
    let N = Nn1();
    if (N?.isTeleported && !N.hasLoggedFirstMessage) c("tengu_teleport_first_message_error", {
        session_id: N.sessionId,
        error_type: f
    }), Tn1()
}
// @from(Ln 381673, Col 0)
function FdY({
    model: A,
    preNormalizedModel: q,
    messageCount: K,
    messageTokens: Y,
    usage: z,
    durationMs: w,
    durationMsIncludingRetries: H,
    attempt: $,
    ttftMs: O,
    requestId: _,
    stopReason: J,
    costUSD: X,
    didFallBackToNonStreaming: D,
    querySource: j,
    gateway: M,
    queryTracking: P,
    permissionMode: W,
    globalCacheStrategy: G,
    textContentLength: f,
    fastMode: Z
}) {
    let N = w4(),
        T = process.argv.includes("-p") || process.argv.includes("--print");
    c("tengu_api_success", {
        model: A,
        ...q !== A ? {
            preNormalizedModel: q
        } : {},
        messageCount: K,
        messageTokens: Y,
        inputTokens: z.input_tokens,
        outputTokens: z.output_tokens,
        cachedInputTokens: z.cache_read_input_tokens ?? 0,
        uncachedInputTokens: z.cache_creation_input_tokens ?? 0,
        durationMs: w,
        durationMsIncludingRetries: H,
        attempt: $,
        ttftMs: O ?? void 0,
        buildAgeMins: $6q(),
        provider: qb(),
        requestId: _ ?? void 0,
        stop_reason: J ?? void 0,
        costUSD: X,
        didFallBackToNonStreaming: D,
        isNonInteractiveSession: N,
        print: T,
        isTTY: process.stdout.isTTY ?? !1,
        querySource: j,
        ...M ? {
            gateway: M
        } : {},
        ...P ? {
            queryChainId: P.chainId,
            queryDepth: P.depth
        } : {},
        permissionMode: W,
        ...G ? {
            globalCacheStrategy: G
        } : {},
        ...f !== void 0 ? {
            textContentLength: f
        } : {},
        fastMode: Z,
        ...jhA()
    })
}
// @from(Ln 381741, Col 0)
function _6q({
    model: A,
    preNormalizedModel: q,
    start: K,
    startIncludingRetries: Y,
    ttftMs: z,
    usage: w,
    attempt: H,
    messageCount: $,
    messageTokens: O,
    requestId: _,
    stopReason: J,
    didFallBackToNonStreaming: X,
    querySource: D,
    headers: j,
    costUSD: M,
    queryTracking: P,
    permissionMode: W,
    newMessages: G,
    llmSpan: f,
    globalCacheStrategy: Z,
    requestSetupMs: N,
    attemptStartTimes: T,
    fastMode: k
}) {
    let y = j ? DhA(j) : void 0,
        B = G ? G.reduce((p, l) => p + l.message.content.reduce((r, s) => r + (s.type === "text" ? s.text.length : 0), 0), 0) : void 0,
        S = Date.now() - K,
        m = Date.now() - Y;
    GL6(m, S), FdY({
        model: A,
        preNormalizedModel: q,
        messageCount: $,
        messageTokens: O,
        usage: w,
        durationMs: S,
        durationMsIncludingRetries: m,
        attempt: H,
        ttftMs: z,
        requestId: _,
        stopReason: J,
        costUSD: M,
        didFallBackToNonStreaming: X,
        querySource: D,
        gateway: y,
        queryTracking: P,
        permissionMode: W,
        globalCacheStrategy: Z,
        textContentLength: B,
        fastMode: k
    }), zj("api_request", {
        model: A,
        input_tokens: String(w.input_tokens),
        output_tokens: String(w.output_tokens),
        cache_read_tokens: String(w.cache_read_input_tokens),
        cache_creation_tokens: String(w.cache_creation_input_tokens),
        cost_usd: String(M),
        duration_ms: String(S)
    });
    let b, g, U;
    if (FX() && G) b = G.flatMap((p) => p.message.content.filter((l) => l.type === "text").map((l) => l.text)).join(`
`) || void 0, U = G.some((p) => p.message.content.some((l) => l.type === "tool_use"));
    BMA(f, {
        success: !0,
        inputTokens: w.input_tokens,
        outputTokens: w.output_tokens,
        cacheReadTokens: w.cache_read_input_tokens,
        cacheCreationTokens: w.cache_creation_input_tokens,
        attempt: H,
        modelOutput: b,
        thinkingOutput: g,
        hasToolCall: U,
        ttftMs: z ?? void 0,
        requestSetupMs: N,
        attemptStartTimes: T
    });
    let x = Nn1();
    if (x?.isTeleported && !x.hasLoggedFirstMessage) c("tengu_teleport_first_message_success", {
        session_id: x.sessionId
    }), Tn1()
}
// @from(Ln 381822, Col 4)
mdY
// @from(Ln 381822, Col 9)
LN
// @from(Ln 381823, Col 4)
FU1 = v(() => {
    GV();
    y6();
    Z6();
    UH();
    u6();
    aa();
    As();
    B6();
    AB();
    QU();
    mdY = {
        litellm: {
            prefixes: ["x-litellm-"]
        },
        helicone: {
            prefixes: ["helicone-"]
        },
        portkey: {
            prefixes: ["x-portkey-"]
        },
        "cloudflare-ai-gateway": {
            prefixes: ["cf-aig-"]
        }
    };
    LN = {
        input_tokens: 0,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
        output_tokens: 0,
        server_tool_use: {
            web_search_requests: 0,
            web_fetch_requests: 0
        },
        service_tier: "standard",
        cache_creation: {
            ephemeral_1h_input_tokens: 0,
            ephemeral_5m_input_tokens: 0
        },
        inference_geo: "",
        iterations: []
    }
})
// @from(Ln 381870, Col 0)
function tt(A) {
    return {
        systemPrompt: A.systemPrompt,
        userContext: A.userContext,
        systemContext: A.systemContext,
        toolUseContext: A.toolUseContext,
        forkContextMessages: A.messages
    }
}
// @from(Ln 381880, Col 0)
function gdY(A, q) {
    if (q.length === 0) return A;
    return async () => {
        let K = await A();
        return {
            ...K,
            toolPermissionContext: {
                ...K.toolPermissionContext,
                alwaysAllowRules: {
                    ...K.toolPermissionContext.alwaysAllowRules,
                    command: [...new Set([...K.toolPermissionContext.alwaysAllowRules.command || [], ...q])]
                }
            }
        }
    }
}
// @from(Ln 381896, Col 0)
async function mM6(A, q, K) {
    let z = (await A.getPromptForCommand(q, K)).map((X) => X.type === "text" ? X.text : "").join(`
`),
        w = hd(A.allowedTools ?? []),
        H = gdY(K.getAppState, w),
        $ = A.agent ?? "general-purpose",
        O = K.options.agentDefinitions.activeAgents,
        _ = O.find((X) => X.agentType === $) ?? O.find((X) => X.agentType === "general-purpose") ?? O[0];
    if (!_) throw Error("No agent available for forked execution");
    let J = [c6({
        content: z
    })];
    return {
        skillContent: z,
        modifiedGetAppState: H,
        baseAgent: _,
        promptMessages: J
    }
}
// @from(Ln 381916, Col 0)
function FM6(A, q = "Execution completed") {
    let K = GN(A);
    if (!K) return q;
    return K.message.content.filter((z) => z.type === "text").map((z) => ("text" in z) ? z.text : "").join(`
`) || q
}
// @from(Ln 381923, Col 0)
function vQ1(A, q) {
    let K = q?.abortController ?? (q?.shareAbortController ? A.abortController : R61(A.abortController)),
        Y = q?.getAppState ? q.getAppState : q?.shareAbortController ? A.getAppState : async () => {
            let z = await A.getAppState();
            if (z.toolPermissionContext.shouldAvoidPermissionPrompts) return z;
            return {
                ...z,
                toolPermissionContext: {
                    ...z.toolPermissionContext,
                    shouldAvoidPermissionPrompts: !0
                }
            }
        };
    return {
        readFileState: yp(q?.readFileState ?? A.readFileState),
        nestedMemoryAttachmentTriggers: new Set,
        dynamicSkillDirTriggers: new Set,
        toolDecisions: void 0,
        abortController: K,
        getAppState: Y,
        setAppState: q?.shareSetAppState ? A.setAppState : () => {},
        setInProgressToolUseIDs: () => {},
        setResponseLength: q?.shareSetResponseLength ? A.setResponseLength : () => {},
        updateFileHistoryState: () => {},
        updateAttributionState: () => {},
        addNotification: void 0,
        setToolJSX: void 0,
        setStreamMode: void 0,
        setSDKStatus: void 0,
        openMessageSelector: void 0,
        options: q?.options ?? A.options,
        messages: q?.messages ?? A.messages,
        agentId: q?.agentId ?? NR(),
        agentType: q?.agentType,
        queryTracking: {
            chainId: QdY(),
            depth: (A.queryTracking?.depth ?? -1) + 1
        },
        fileReadingLimits: A.fileReadingLimits,
        userModified: A.userModified,
        criticalSystemReminder_EXPERIMENTAL: q?.criticalSystemReminder_EXPERIMENTAL,
        requireCanUseTool: q?.requireCanUseTool
    }
}
// @from(Ln 381967, Col 0)
async function av({
    promptMessages: A,
    cacheSafeParams: q,
    canUseTool: K,
    querySource: Y,
    forkLabel: z,
    overrides: w,
    maxOutputTokens: H,
    maxTurns: $,
    onMessage: O,
    skipTranscript: _
}) {
    let J = Date.now(),
        X = [],
        D = {
            ...LN
        },
        {
            systemPrompt: j,
            userContext: M,
            systemContext: P,
            toolUseContext: W,
            forkContextMessages: G
        } = q,
        f = vQ1(W, w),
        Z = [...TQ1(G), ...A],
        N = _ ? void 0 : NR(z),
        T = null;
    if (N) await X51(Z, N).catch((y) => h(`Forked agent [${z}] failed to record initial transcript: ${y}`)), T = Z.length > 0 ? Z[Z.length - 1].uuid : null;
    for await (let y of ZR({
        messages: Z,
        systemPrompt: j,
        userContext: M,
        systemContext: P,
        canUseTool: K,
        toolUseContext: f,
        querySource: Y,
        maxOutputTokensOverride: H,
        maxTurns: $
    })) {
        if (y.type === "stream_event") {
            if ("event" in y && y.event?.type === "message_delta" && y.event.usage) {
                let S = e51({
                    ...LN
                }, y.event.usage);
                D = Af6(D, S)
            }
            continue
        }
        if (y.type === "stream_request_start") continue;
        h(`Forked agent [${z}] received message: type=${y.type}`), X.push(y), O?.(y);
        let B = y;
        if (N && (B.type === "assistant" || B.type === "user" || B.type === "progress")) await X51([B], N, T).catch((S) => h(`Forked agent [${z}] failed to record transcript: ${S}`)), T = B.uuid
    }
    h(`Forked agent [${z}] finished: ${X.length} messages, types=[${X.map((y)=>y.type).join(", ")}], totalUsage: input=${D.input_tokens} output=${D.output_tokens} cacheRead=${D.cache_read_input_tokens} cacheCreate=${D.cache_creation_input_tokens}`);
    let k = Date.now() - J;
    return UdY({
        forkLabel: z,
        querySource: Y,
        durationMs: k,
        messageCount: X.length,
        totalUsage: D,
        queryTracking: W.queryTracking
    }), {
        messages: X,
        totalUsage: D
    }
}
// @from(Ln 382036, Col 0)
function UdY({
    forkLabel: A,
    querySource: q,
    durationMs: K,
    messageCount: Y,
    totalUsage: z,
    queryTracking: w
}) {
    let H = z.input_tokens + z.cache_creation_input_tokens + z.cache_read_input_tokens,
        $ = H > 0 ? z.cache_read_input_tokens / H : 0;
    c("tengu_fork_agent_query", {
        forkLabel: A,
        querySource: q,
        durationMs: K,
        messageCount: Y,
        inputTokens: z.input_tokens,
        outputTokens: z.output_tokens,
        cacheReadInputTokens: z.cache_read_input_tokens,
        cacheCreationInputTokens: z.cache_creation_input_tokens,
        serviceTier: z.service_tier,
        cacheCreationEphemeral1hTokens: z.cache_creation.ephemeral_1h_input_tokens,
        cacheCreationEphemeral5mTokens: z.cache_creation.ephemeral_5m_input_tokens,
        cacheHitRate: $,
        ...w ? {
            queryChainId: w.chainId,
            queryDepth: w.depth
        } : {}
    })
}
// @from(Ln 382065, Col 4)
YI = v(() => {
    EK1();
    yw();
    FU1();
    u6();
    At();
    Z6();
    lq();
    pM();
    Sh();
    G2();
    N8();
    qp()
})
// @from(Ln 382080, Col 0)
function pdY(A) {
    for (let q of A) {
        if (typeof q !== "string") continue;
        let K = (q.match(/{/g) || []).length,
            Y = (q.match(/}/g) || []).length;
        if (K !== Y) return !0;
        let z = (q.match(/\(/g) || []).length,
            w = (q.match(/\)/g) || []).length;
        if (z !== w) return !0;
        let H = (q.match(/\[/g) || []).length,
            $ = (q.match(/\]/g) || []).length;
        if (H !== $) return !0;
        if ((q.match(/(?<!\\)"/g) || []).length % 2 !== 0) return !0;
        if ((q.match(/(?<!\\)'/g) || []).length % 2 !== 0) return !0
    }
    return !1
}
// @from(Ln 382098, Col 0)
function cdY(A, q = !1) {
    let K = "",
        Y = "",
        z = !1,
        w = !1,
        H = !1;
    for (let $ = 0; $ < A.length; $++) {
        let O = A[$];
        if (H) {
            if (H = !1, !z) K += O;
            if (!z && !w) Y += O;
            continue
        }
        if (O === "\\" && !z) {
            if (H = !0, !z) K += O;
            if (!z && !w) Y += O;
            continue
        }
        if (O === "'" && !w) {
            z = !z;
            continue
        }
        if (O === '"' && !z) {
            if (w = !w, !q) continue
        }
        if (!z) K += O;
        if (!z && !w) Y += O
    }
    return {
        withDoubleQuotes: K,
        fullyUnquoted: Y
    }
}
// @from(Ln 382132, Col 0)
function ldY(A) {
    return A.replace(/\s+2\s*>&\s*1(?=\s|$)/g, "").replace(/[012]?\s*>\s*\/dev\/null/g, "").replace(/\s*<\s*\/dev\/null/g, "")
}
// @from(Ln 382136, Col 0)
function idY(A, q) {
    if (q.length !== 1) throw Error("hasUnescapedChar only works with single characters");
    let K = 0;
    while (K < A.length) {
        if (A[K] === "\\" && K + 1 < A.length) {
            K += 2;
            continue
        }
        if (A[K] === q) return !0;
        K++
    }
    return !1
}
// @from(Ln 382150, Col 0)
function ndY(A) {
    if (!A.originalCommand.trim()) return {
        behavior: "allow",
        updatedInput: {
            command: A.originalCommand
        },
        decisionReason: {
            type: "other",
            reason: "Empty command is safe"
        }
    };
    return {
        behavior: "passthrough",
        message: "Command is not empty"
    }
}
// @from(Ln 382167, Col 0)
function rdY(A) {
    let {
        originalCommand: q
    } = A, K = q.trim();
    if (/^\s*\t/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.INCOMPLETE_COMMANDS,
        subId: 1
    }), {
        behavior: "ask",
        message: "Command appears to be an incomplete fragment (starts with tab)"
    };
    if (K.startsWith("-")) return c("tengu_bash_security_check_triggered", {
        checkId: kH.INCOMPLETE_COMMANDS,
        subId: 2
    }), {
        behavior: "ask",
        message: "Command appears to be an incomplete fragment (starts with flags)"
    };
    if (/^\s*(&&|\|\||;|>>?|<)/.test(q)) return c("tengu_bash_security_check_triggered", {
        checkId: kH.INCOMPLETE_COMMANDS,
        subId: 3
    }), {
        behavior: "ask",
        message: "Command appears to be a continuation line (starts with operator)"
    };
    return {
        behavior: "passthrough",
        message: "Command appears complete"
    }
}
// @from(Ln 382198, Col 0)
function odY(A) {
    if (!PhA.test(A)) return !1;
    let q = /\$\(cat\s*<<-?\s*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g,
        K, Y = [];
    while ((K = q.exec(A)) !== null) {
        let w = K[1] || K[2];
        if (w) Y.push({
            start: K.index,
            delimiter: w
        })
    }
    if (Y.length === 0) return !1;
    for (let {
            start: w,
            delimiter: H
        }
        of Y) {
        let $ = A.substring(w),
            O = H.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (!new RegExp(`(?:
|^[^\\n]*
)${O}\\s*\\)`).test($)) return !1;
        let J = new RegExp(`^\\$\\(cat\\s*<<-?\\s*(?:'+${O}'+|\\\\${O})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${O}\\s*\\)`);
        if (!$.match(J)) return !1
    }
    let z = A;
    for (let {
            delimiter: w
        }
        of Y) {
        let H = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $ = new RegExp(`\\$\\(cat\\s*<<-?\\s*(?:'+${H}'+|\\\\${H})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${H}\\s*\\)`);
        z = z.replace($, "")
    }
    if (/\$\(/.test(z)) return !1;
    if (/\${/.test(z)) return !1;
    return !0
}
// @from(Ln 382237, Col 0)
function adY(A) {
    let {
        originalCommand: q
    } = A;
    if (!PhA.test(q)) return {
        behavior: "passthrough",
        message: "No heredoc in substitution"
    };
    if (odY(q)) return {
        behavior: "allow",
        updatedInput: {
            command: q
        },
        decisionReason: {
            type: "other",
            reason: "Safe command substitution: cat with quoted/escaped heredoc delimiter"
        }
    };
    return {
        behavior: "passthrough",
        message: "Command substitution needs validation"
    }
}
// @from(Ln 382261, Col 0)
function sdY(A) {
    let {
        originalCommand: q,
        baseCommand: K
    } = A;
    if (K !== "git" || !/^git\s+commit\s+/.test(q)) return {
        behavior: "passthrough",
        message: "Not a git commit"
    };
    let Y = q.match(/^git\s+commit\s+.*-m\s+(["'])([\s\S]*?)\1(.*)$/);
    if (Y) {
        let [, z, w, H] = Y;
        if (z === '"' && w && /\$\(|`|\$\{/.test(w)) return c("tengu_bash_security_check_triggered", {
            checkId: kH.GIT_COMMIT_SUBSTITUTION,
            subId: 1
        }), {
            behavior: "ask",
            message: "Git commit message contains command substitution patterns"
        };
        if (H && /\$\(|`|\$\{/.test(H)) return {
            behavior: "passthrough",
            message: "Check patterns in flags"
        };
        if (w && w.startsWith("-")) return c("tengu_bash_security_check_triggered", {
            checkId: kH.OBFUSCATED_FLAGS,
            subId: 5
        }), {
            behavior: "ask",
            message: "Command contains quoted characters in flag names"
        };
        return {
            behavior: "allow",
            updatedInput: {
                command: q
            },
            decisionReason: {
                type: "other",
                reason: "Git commit with simple quoted message is allowed"
            }
        }
    }
    return {
        behavior: "passthrough",
        message: "Git commit needs validation"
    }
}
// @from(Ln 382308, Col 0)
function tdY(A) {
    let {
        originalCommand: q
    } = A;
    if (PhA.test(q)) return {
        behavior: "passthrough",
        message: "Heredoc in substitution"
    };
    let K = /<<-?\s*'[^']+'/,
        Y = /<<-?\s*\\\w+/;
    if (K.test(q) || Y.test(q)) return {
        behavior: "allow",
        updatedInput: {
            command: q
        },
        decisionReason: {
            type: "other",
            reason: "Heredoc with quoted/escaped delimiter is safe"
        }
    };
    return {
        behavior: "passthrough",
        message: "No heredoc patterns"
    }
}