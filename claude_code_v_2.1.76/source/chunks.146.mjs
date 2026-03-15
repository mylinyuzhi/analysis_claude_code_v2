
// @from(Ln 369803, Col 0)
async function* E4q(A, q, K, Y, z, _, w, O, $, H) {
    let j = Date.now();
    try {
        let M = A.getAppState().toolPermissionContext.mode;
        for await (let D of hF8(q.name, K, z, _, A, w, M, A.abortController.signal)) try {
            if (D.message?.type === "attachment" && D.message.attachment.type === "hook_cancelled") {
                d("tengu_post_tool_failure_hooks_cancelled", {
                    toolName: hq(q.name),
                    queryChainId: A.queryTracking?.chainId,
                    queryDepth: A.queryTracking?.depth
                }), yield {
                    message: f4({
                        type: "hook_cancelled",
                        hookName: `PostToolUseFailure:${q.name}`,
                        toolUseID: K,
                        hookEvent: "PostToolUseFailure"
                    })
                };
                continue
            }
            if (D.message && !(D.message.type === "attachment" && D.message.attachment.type === "hook_blocking_error")) yield {
                message: D.message
            };
            if (D.blockingError) yield {
                message: f4({
                    type: "hook_blocking_error",
                    hookName: `PostToolUseFailure:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUseFailure",
                    blockingError: D.blockingError
                })
            };
            if (D.additionalContexts && D.additionalContexts.length > 0) yield {
                message: f4({
                    type: "hook_additional_context",
                    content: D.additionalContexts,
                    hookName: `PostToolUseFailure:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUseFailure"
                })
            }
        } catch (X) {
            let P = Date.now() - j;
            d("tengu_post_tool_failure_hook_error", {
                messageID: Y,
                toolName: hq(q.name),
                isMcp: q.isMcp ?? !1,
                duration: P,
                queryChainId: A.queryTracking?.chainId,
                queryDepth: A.queryTracking?.depth,
                ...$ ? {
                    mcpServerType: $
                } : {},
                ...O ? {
                    requestId: O
                } : {}
            }), yield {
                message: f4({
                    type: "hook_error_during_execution",
                    content: pT6(X),
                    hookName: `PostToolUseFailure:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUseFailure"
                })
            }
        }
    } catch (J) {
        _6(J)
    }
}
// @from(Ln 369873, Col 0)
async function* y4q(A, q, K, Y, z, _, w, O) {
    let $ = Date.now();
    try {
        let H = A.getAppState();
        for await (let j of LF8(q.name, Y, K, A, H.toolPermissionContext.mode, A.abortController.signal, void 0, A.requestPrompt, q.getToolUseSummary?.(K))) try {
            if (j.message) yield {
                type: "message",
                message: {
                    message: j.message
                }
            };
            if (j.blockingError) {
                let J = yF8(`PreToolUse:${q.name}`, j.blockingError);
                yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: "deny",
                        message: J,
                        decisionReason: {
                            type: "hook",
                            hookName: `PreToolUse:${q.name}`,
                            reason: J
                        }
                    }
                }
            }
            if (j.preventContinuation) {
                if (yield {
                        type: "preventContinuation",
                        shouldPreventContinuation: !0
                    }, j.stopReason) yield {
                    type: "stopReason",
                    stopReason: j.stopReason
                }
            }
            if (j.permissionBehavior !== void 0) {
                k(`Hook result has permissionBehavior=${j.permissionBehavior}`);
                let J = {
                    type: "hook",
                    hookName: `PreToolUse:${q.name}`,
                    hookSource: j.hookSource,
                    reason: j.hookPermissionDecisionReason
                };
                if (j.permissionBehavior === "allow") yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: "allow",
                        updatedInput: j.updatedInput,
                        decisionReason: J
                    }
                };
                else if (j.permissionBehavior === "ask") yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: "ask",
                        updatedInput: j.updatedInput,
                        message: j.hookPermissionDecisionReason || `Hook PreToolUse:${q.name} ${EF8(j.permissionBehavior)} this tool`,
                        decisionReason: J
                    }
                };
                else yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: j.permissionBehavior,
                        message: j.hookPermissionDecisionReason || `Hook PreToolUse:${q.name} ${EF8(j.permissionBehavior)} this tool`,
                        decisionReason: J
                    }
                }
            }
            if (j.updatedInput && j.permissionBehavior === void 0) yield {
                type: "hookUpdatedInput",
                updatedInput: j.updatedInput
            };
            if (j.additionalContexts && j.additionalContexts.length > 0) yield {
                type: "additionalContext",
                message: {
                    message: f4({
                        type: "hook_additional_context",
                        content: j.additionalContexts,
                        hookName: `PreToolUse:${q.name}`,
                        toolUseID: Y,
                        hookEvent: "PreToolUse"
                    })
                }
            };
            if (A.abortController.signal.aborted) {
                d("tengu_pre_tool_hooks_cancelled", {
                    toolName: hq(q.name),
                    queryChainId: A.queryTracking?.chainId,
                    queryDepth: A.queryTracking?.depth
                }), yield {
                    type: "message",
                    message: {
                        message: f4({
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
        } catch (J) {
            _6(J);
            let M = Date.now() - $;
            d("tengu_pre_tool_hook_error", {
                messageID: z,
                toolName: hq(q.name),
                isMcp: q.isMcp ?? !1,
                duration: M,
                queryChainId: A.queryTracking?.chainId,
                queryDepth: A.queryTracking?.depth,
                ...w ? {
                    mcpServerType: w
                } : {},
                ..._ ? {
                    requestId: _
                } : {}
            }), yield {
                type: "message",
                message: {
                    message: f4({
                        type: "hook_error_during_execution",
                        content: pT6(J),
                        hookName: `PreToolUse:${q.name}`,
                        toolUseID: Y,
                        hookEvent: "PreToolUse"
                    })
                }
            }, yield {
                type: "stop"
            }
        }
    } catch (H) {
        _6(H), yield {
            type: "stop"
        };
        return
    }
}
// @from(Ln 370016, Col 4)
L4q = E(() => {
    V1();
    o$();
    k1();
    H1();
    M0();
    hw();
    qM();
    XE1()
})
// @from(Ln 370027, Col 0)
function XxY(A) {
    if (A instanceof EV) return A.telemetryMessage.slice(0, 200);
    if (A instanceof Error) {
        let q = A.code;
        if (typeof q === "string") return `Error:${q}`;
        if (A.name && A.name !== "Error" && A.name.length > 3) return A.name.slice(0, 60);
        return "Error"
    }
    return "UnknownError"
}
// @from(Ln 370038, Col 0)
function PE1(A, q) {
    if (!A.inputParamAliases || !w8("tengu_tool_input_aliasing", !1)) return q;
    let K = A.inputParamAliases,
        Y = {},
        z = [];
    for (let [_, w] of Object.entries(q)) {
        let O = K[_];
        if (O && !(O in q)) Y[O] = w, z.push(`${_}->${O}`);
        else Y[_] = w
    }
    if (z.length > 0) return d("tengu_tool_input_alias_applied", {
        toolName: hq(A.name),
        aliases: z.join(",")
    }), Y;
    return q
}
// @from(Ln 370055, Col 0)
function R4q(A) {
    let q = 0;
    for (let K of A)
        if (K.type === "user" && K.imagePasteIds) {
            for (let Y of K.imagePasteIds)
                if (Y > q) q = Y
        } return q + 1
}
// @from(Ln 370064, Col 0)
function h4q(A, q) {
    if (!A.startsWith("mcp__")) return;
    let K = iV(A);
    if (!K) return;
    return q.find((Y) => lO(Y.name) === K.serverName)
}
// @from(Ln 370071, Col 0)
function PxY(A, q) {
    let K = h4q(A, q);
    if (K?.type === "connected") return K.config.type ?? "stdio";
    return
}
// @from(Ln 370077, Col 0)
function WxY(A, q) {
    let K = h4q(A, q);
    if (K?.type !== "connected") return;
    return Uj(K.config)
}
// @from(Ln 370082, Col 0)
async function* Wi6(A, q, K, Y) {
    let z = A.name,
        _ = dK(Y.options.tools, z);
    if (!_) {
        let J = dK(ng(), z);
        if (J && J.aliases?.includes(z)) _ = J
    }
    let w = q.message.id,
        O = q.requestId,
        $ = PxY(z, Y.options.mcpClients),
        H = WxY(z, Y.options.mcpClients);
    if (!_) {
        let J = hq(z);
        k(`Unknown tool ${z}: ${A.id}`), d("tengu_tool_use_error", {
            error: `No such tool available: ${J}`,
            toolName: J,
            toolUseID: A.id,
            isMcp: z.startsWith("mcp__"),
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...$ ? {
                mcpServerType: $
            } : {},
            ...H ? {
                mcpServerBaseUrl: H
            } : {},
            ...O ? {
                requestId: O
            } : {},
            ...YF() ? (() => {
                let M = gb(z);
                return M ? {
                    mcpServerName: M.serverName,
                    mcpToolName: M.mcpToolName
                } : {}
            })() : {}
        }), yield {
            message: p1({
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
    let j = A.input;
    try {
        if (Y.abortController.signal.aborted) {
            d("tengu_tool_use_cancelled", {
                toolName: hq(_.name),
                toolUseID: A.id,
                isMcp: _.isMcp ?? !1,
                queryChainId: Y.queryTracking?.chainId,
                queryDepth: Y.queryTracking?.depth,
                ...$ ? {
                    mcpServerType: $
                } : {},
                ...H ? {
                    mcpServerBaseUrl: H
                } : {},
                ...O ? {
                    requestId: O
                } : {},
                ...YF() ? (() => {
                    let M = gb(_.name);
                    return M ? {
                        mcpServerName: M.serverName,
                        mcpToolName: M.mcpToolName
                    } : {}
                })() : {}
            });
            let J = CF8(A.id);
            J.content = QT6(R96), yield {
                message: p1({
                    content: [J],
                    toolUseResult: R96,
                    sourceToolAssistantUUID: q.uuid
                })
            };
            return
        }
        for await (let J of ZxY(_, A.id, j, Y, K, q, w, O, $, H)) yield J
    } catch (J) {
        _6(J);
        let M = J instanceof Error ? J.message : String(J),
            X = `Error calling tool${_?` (${_.name})`:""}: ${M}`;
        yield {
            message: p1({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${X}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: A.id
                }],
                toolUseResult: X,
                sourceToolAssistantUUID: q.uuid
            })
        }
    }
}
// @from(Ln 370188, Col 0)
function ZxY(A, q, K, Y, z, _, w, O, $, H) {
    let j = new Pi6;
    return fxY(A, q, K, Y, z, _, w, O, $, H, (J) => {
        d("tengu_tool_use_progress", {
            messageID: w,
            toolName: hq(A.name),
            isMcp: A.isMcp ?? !1,
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...$ ? {
                mcpServerType: $
            } : {},
            ...H ? {
                mcpServerBaseUrl: H
            } : {},
            ...O ? {
                requestId: O
            } : {},
            ...YF() ? (() => {
                let M = gb(A.name);
                return M ? {
                    mcpServerName: M.serverName,
                    mcpToolName: M.mcpToolName
                } : {}
            })() : {}
        }), j.enqueue({
            message: C4q({
                toolUseID: J.toolUseID,
                parentToolUseID: q,
                data: J.data
            })
        })
    }).then((J) => {
        for (let M of J) j.enqueue(M)
    }).catch((J) => {
        j.error(J)
    }).finally(() => {
        j.done()
    }), j
}
// @from(Ln 370229, Col 0)
function GxY(A, q, K) {
    if (!dk()) return null;
    if (!bz6(K)) return null;
    if (!GX(A)) return null;
    if (zF(q).has(A.name)) return null;
    return `

This tool's schema was not sent to the API — it was not in the discovered-tool set derived from message history. ` + `Without the schema in your prompt, typed parameters (arrays, numbers, booleans) get emitted as strings and the client-side parser rejects them. Load the tool first: call ${HZ} with query "select:${A.name}", then retry this call.`
}
// @from(Ln 370238, Col 0)
async function fxY(A, q, K, Y, z, _, w, O, $, H, j) {
    let J = A.inputSchema.safeParse(K);
    if (!J.success) {
        let u = V4q(A.name, J.error),
            I = GxY(A, Y.messages, Y.options.tools);
        if (I) d("tengu_deferred_tool_schema_not_sent", {
            toolName: hq(A.name),
            isMcp: A.isMcp ?? !1
        }), u += I;
        return k(`${A.name} tool input error: ${u.slice(0,200)}`), d("tengu_tool_use_error", {
            error: "InputValidationError",
            errorDetails: u.slice(0, 2000),
            messageID: w,
            toolName: hq(A.name),
            isMcp: A.isMcp ?? !1,
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...$ ? {
                mcpServerType: $
            } : {},
            ...H ? {
                mcpServerBaseUrl: H
            } : {},
            ...O ? {
                requestId: O
            } : {},
            ...YF() ? (() => {
                let g = gb(A.name);
                return g ? {
                    mcpServerName: g.serverName,
                    mcpToolName: g.mcpToolName
                } : {}
            })() : {}
        }), [{
            message: p1({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>InputValidationError: ${u}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: q
                }],
                toolUseResult: `InputValidationError: ${J.error.message}`,
                sourceToolAssistantUUID: _.uuid
            })
        }]
    }
    let M = await A.validateInput?.(J.data, Y);
    if (M?.result === !1) return k(`${A.name} tool validation error: ${M.message?.slice(0,200)}`), d("tengu_tool_use_error", {
        messageID: w,
        toolName: hq(A.name),
        error: M.message,
        errorCode: M.errorCode,
        isMcp: A.isMcp ?? !1,
        queryChainId: Y.queryTracking?.chainId,
        queryDepth: Y.queryTracking?.depth,
        ...$ ? {
            mcpServerType: $
        } : {},
        ...H ? {
            mcpServerBaseUrl: H
        } : {},
        ...O ? {
            requestId: O
        } : {},
        ...YF() ? (() => {
            let u = gb(A.name);
            return u ? {
                mcpServerName: u.serverName,
                mcpToolName: u.mcpToolName
            } : {}
        })() : {}
    }), [{
        message: p1({
            content: [{
                type: "tool_result",
                content: `<tool_use_error>${M.message}</tool_use_error>`,
                is_error: !0,
                tool_use_id: q
            }],
            toolUseResult: `Error: ${M.message}`,
            sourceToolAssistantUUID: _.uuid
        })
    }];
    if (A.name === Q7 && J.data && "command" in J.data) {
        let u = Y.getAppState();
        S4q(J.data.command, u.toolPermissionContext, Y.abortController.signal, Y.options.isNonInteractiveSession)
    }
    let D = [],
        X = J.data;
    if (A.name === Q7 && X && typeof X === "object" && "_simulatedSedEdit" in X) {
        let {
            _simulatedSedEdit: u,
            ...I
        } = X;
        X = I
    }
    if (A.backfillObservableInput && typeof X === "object" && X !== null) A.backfillObservableInput(X);
    let P = !1,
        W, Z, G = [],
        f = Date.now();
    for await (let u of y4q(Y, A, X, q, _.message.id, O, $, H)) switch (u.type) {
        case "message":
            if (u.message.message.type === "progress") j(u.message.message);
            else {
                D.push(u.message);
                let I = u.message.message.attachment;
                if (I && "command" in I && I.command !== void 0 && "durationMs" in I && I.durationMs !== void 0) G.push({
                    command: I.command,
                    durationMs: I.durationMs
                })
            }
            break;
        case "hookPermissionResult":
            Z = u.hookPermissionResult;
            break;
        case "hookUpdatedInput":
            X = u.updatedInput;
            break;
        case "preventContinuation":
            P = u.shouldPreventContinuation;
            break;
        case "stopReason":
            W = u.stopReason;
            break;
        case "additionalContext":
            D.push(u.message);
            break;
        case "stop":
            return bw6()?.observe("pre_tool_hook_duration_ms", Date.now() - f), D.push({
                message: p1({
                    content: [CF8(q)],
                    toolUseResult: `Error: ${W}`,
                    sourceToolAssistantUUID: _.uuid
                })
            }), D
    }
    let v = Date.now() - f;
    bw6()?.observe("pre_tool_hook_duration_ms", v);
    let N = {};
    if (X && typeof X === "object") {
        if (A.name === s7 && "file_path" in X) N.file_path = String(X.file_path);
        else if ((A.name === R4 || A.name === _K) && "file_path" in X) N.file_path = String(X.file_path);
        else if (A.name === Q7 && "command" in X) {
            let u = X;
            N.full_command = u.command
        }
    }
    az4(A.name, N, a$() ? B6(X) : void 0), sz4();
    let V;
    if (Z !== void 0 && Z.behavior === "allow" && !A.requiresUserInteraction?.() && !Y.requireCanUseTool) k(`Hook approved tool use for ${A.name}, bypassing permission check`), V = Z;
    else if (Z !== void 0 && Z.behavior === "allow" && (A.requiresUserInteraction?.() || Y.requireCanUseTool)) {
        if (k(`Hook approved tool use for ${A.name}, but canUseTool is required`), Z.updatedInput) X = Z.updatedInput;
        V = await z(A, X, Y, _, q)
    } else if (Z !== void 0 && Z.behavior === "deny") k(`Hook denied tool use for ${A.name}`), V = Z;
    else {
        let u = Z?.behavior === "ask" ? Z : void 0;
        if (Z?.behavior === "ask" && Z.updatedInput) X = Z.updatedInput;
        V = await z(A, X, Y, _, q, u)
    }
    if (V.behavior !== "ask" && !Y.toolDecisions?.has(q)) {
        let u = V.behavior === "allow" ? "accept" : "reject",
            I = V.decisionReason?.type === "hook" ? "hook" : "config";
        if (pw("tool_decision", {
                decision: u,
                source: I,
                tool_name: hq(A.name)
            }), qk8(A.name)) {
            let g = Kk8(A, X, u, I);
            Bk6()?.add(1, g)
        }
    }
    if (V.decisionReason?.type === "hook" && V.decisionReason.hookName === "PermissionRequest" && V.behavior !== "ask") D.push({
        message: f4({
            type: "hook_permission_decision",
            decision: V.behavior,
            toolUseID: q,
            hookEvent: "PermissionRequest"
        })
    });
    if (V.behavior !== "allow") {
        k(`${A.name} tool permission denied`);
        let u = Y.toolDecisions?.get(q);
        jk8("reject", u?.source || "unknown"), h01(), d("tengu_tool_use_can_use_tool_rejected", {
            messageID: w,
            toolName: hq(A.name),
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...$ ? {
                mcpServerType: $
            } : {},
            ...H ? {
                mcpServerBaseUrl: H
            } : {},
            ...O ? {
                requestId: O
            } : {},
            ...YF() ? (() => {
                let p = gb(A.name);
                return p ? {
                    mcpServerName: p.serverName,
                    mcpToolName: p.mcpToolName
                } : {}
            })() : {}
        });
        let I = V.message;
        if (P && !I) I = `Execution stopped by PreToolUse hook${W?`: ${W}`:""}`;
        let g = [{
                type: "tool_result",
                content: I,
                is_error: !0,
                tool_use_id: q
            }],
            B = V.behavior === "ask" ? V.contentBlocks : void 0;
        if (B?.length) g.push(...B);
        let b;
        if (B?.length) {
            let p = B.filter((Q) => Q.type === "image").length;
            if (p > 0) {
                let Q = R4q(Y.messages);
                b = Array.from({
                    length: p
                }, (U, r) => Q + r)
            }
        }
        return D.push({
            message: p1({
                content: g,
                imagePasteIds: b,
                toolUseResult: `Error: ${I}`,
                sourceToolAssistantUUID: _.uuid
            })
        }), D
    }
    if (d("tengu_tool_use_can_use_tool_allowed", {
            messageID: w,
            toolName: hq(A.name),
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...$ ? {
                mcpServerType: $
            } : {},
            ...H ? {
                mcpServerBaseUrl: H
            } : {},
            ...O ? {
                requestId: O
            } : {},
            ...YF() ? (() => {
                let u = gb(A.name);
                return u ? {
                    mcpServerName: u.serverName,
                    mcpToolName: u.mcpToolName
                } : {}
            })() : {}
        }), V.updatedInput !== void 0) X = V.updatedInput;
    let L = {};
    if (A.name === Q7 && "command" in X) {
        let u = X;
        L = {
            bash_command: u.command.trim().split(/\s+/)[0] || "",
            full_command: u.command,
            ...u.timeout !== void 0 && {
                timeout: u.timeout
            },
            ...u.description !== void 0 && {
                description: u.description
            },
            ..."dangerouslyDisableSandbox" in u && {
                dangerouslyDisableSandbox: u.dangerouslyDisableSandbox
            }
        }
    }
    if (I4q()) {
        let u = gb(A.name);
        if (u) L.mcp_server_name = u.serverName, L.mcp_tool_name = u.mcpToolName;
        let I = b4q(A.name, X);
        if (I) L.skill_name = I
    }
    let h = Y.toolDecisions?.get(q);
    jk8(h?.decision || "unknown", h?.source || "unknown"), tz4();
    let R = Date.now();
    ME1();
    try {
        let u = await A.call(X, {
                ...Y,
                toolUseId: q,
                userModified: V.userModified ?? !1
            }, z, _, (z6) => {
                j({
                    toolUseID: z6.toolUseID,
                    data: z6.data
                })
            }),
            I = Date.now() - R;
        if (Pt6(I), u.data && typeof u.data === "object") {
            let z6 = {};
            if (A.name === s7 && "content" in u.data) {
                if ("file_path" in X) z6.file_path = String(X.file_path);
                z6.content = String(u.data.content)
            }
            if ((A.name === R4 || A.name === _K) && "file_path" in X) {
                if (z6.file_path = String(X.file_path), A.name === R4 && "diff" in u.data) z6.diff = String(u.data.diff);
                if (A.name === _K && "content" in X) z6.content = String(X.content)
            }
            if (A.name === Q7 && "command" in X) {
                let N6 = X;
                if (z6.bash_command = N6.command, "output" in u.data) z6.output = String(u.data.output)
            }
            if (Object.keys(z6).length > 0) ez4("tool.output", z6)
        }
        if (typeof u === "object" && "structured_output" in u) D.push({
            message: f4({
                type: "structured_output",
                data: u.structured_output
            })
        });
        Jk8({
            success: !0
        });
        let g = u.data && typeof u.data === "object" ? B6(u.data) : String(u.data ?? "");
        h01(g);
        let B = A.mapToolResultToToolResultBlockParam(u.data, q),
            b = B.content,
            p = !b ? 0 : typeof b === "string" ? b.length : B6(b).length,
            Q;
        if (X && typeof X === "object") {
            if ((A.name === s7 || A.name === R4 || A.name === _K) && "file_path" in X) Q = F36(String(X.file_path));
            else if (A.name === bJ && "notebook_path" in X) Q = F36(String(X.notebook_path));
            else if (A.name === Q7 && "command" in X) {
                let z6 = X;
                Q = x4q(z6.command, z6._simulatedSedEdit?.filePath)
            }
        }
        if (d("tengu_tool_use_success", {
                messageID: w,
                toolName: hq(A.name),
                isMcp: A.isMcp ?? !1,
                durationMs: I,
                preToolHookDurationMs: v,
                toolResultSizeBytes: p,
                ...Q !== void 0 && {
                    fileExtension: Q
                },
                queryChainId: Y.queryTracking?.chainId,
                queryDepth: Y.queryTracking?.depth,
                ...$ ? {
                    mcpServerType: $
                } : {},
                ...H ? {
                    mcpServerBaseUrl: H
                } : {},
                ...O ? {
                    requestId: O
                } : {},
                ...YF() ? (() => {
                    let z6 = gb(A.name);
                    return z6 ? {
                        mcpServerName: z6.serverName,
                        mcpToolName: z6.mcpToolName
                    } : {}
                })() : {}
            }), (A.name === Q7 || A.name === z_4) && "command" in X && typeof X.command === "string" && X.command.match(/\bgit\s+commit\b/) && u.data && typeof u.data === "object" && "stdout" in u.data) {
            let z6 = K_4(String(u.data.stdout));
            if (z6) L.git_commit_id = z6
        }
        let U = rk(A) ? jE8(A.name) : null;
        pw("tool_result", {
            tool_name: hq(A.name),
            success: "true",
            duration_ms: String(I),
            ...Object.keys(L).length > 0 && {
                tool_parameters: B6(L)
            },
            tool_result_size_bytes: String(p),
            ...h && {
                decision_source: h.source,
                decision_type: h.decision
            },
            ...U ? {
                mcp_server_scope: U
            } : {}
        });
        let r = u.data,
            e = [],
            Y6 = u.contextModifier,
            H6 = u.mcpMeta;
        async function J6(z6, N6) {
            let n = [N6 ? await D34(N6, A.name, A.maxResultSizeChars) : await JW6(A, z6, q)];
            if ("acceptFeedback" in V && V.acceptFeedback) n.push({
                type: "text",
                text: V.acceptFeedback
            });
            let o = "contentBlocks" in V ? V.contentBlocks : void 0;
            if (o?.length) n.push(...o);
            let a;
            if (o?.length) {
                let i = o.filter((l) => l.type === "image").length;
                if (i > 0) {
                    let l = R4q(Y.messages);
                    a = Array.from({
                        length: i
                    }, (q6, w6) => l + w6)
                }
            }
            D.push({
                message: p1({
                    content: n,
                    imagePasteIds: a,
                    toolUseResult: Y.agentId && !Y.preserveToolUseResults ? void 0 : z6,
                    mcpMeta: Y.agentId ? void 0 : H6,
                    sourceToolAssistantUUID: _.uuid
                }),
                contextModifier: Y6 ? {
                    toolUseID: q,
                    modifyContext: Y6
                } : void 0
            })
        }
        if (!rk(A)) await J6(r, B);
        let K6 = [],
            s = Date.now();
        for await (let z6 of k4q(Y, A, q, _.message.id, X, r, O, $, H)) if ("updatedMCPToolOutput" in z6) {
            if (rk(A)) r = z6.updatedMCPToolOutput
        } else if (rk(A)) {
            if (e.push(z6), z6.message.type === "attachment") {
                let N6 = z6.message.attachment;
                if ("command" in N6 && N6.command !== void 0 && "durationMs" in N6 && N6.durationMs !== void 0) K6.push({
                    command: N6.command,
                    durationMs: N6.durationMs
                })
            }
        } else if (D.push(z6), z6.message.type === "attachment") {
            let N6 = z6.message.attachment;
            if ("command" in N6 && N6.command !== void 0 && "durationMs" in N6 && N6.durationMs !== void 0) K6.push({
                command: N6.command,
                durationMs: N6.durationMs
            })
        }
        let X6 = Date.now() - s;
        if (rk(A)) await J6(r);
        if (u.newMessages && u.newMessages.length > 0)
            for (let z6 of u.newMessages) D.push({
                message: z6
            });
        if (P) D.push({
            message: f4({
                type: "hook_stopped_continuation",
                message: W || "Execution stopped by hook",
                hookName: `PreToolUse:${A.name}`,
                toolUseID: q,
                hookEvent: "PreToolUse"
            })
        });
        for (let z6 of e) D.push(z6);
        return D
    } catch (u) {
        let I = Date.now() - R;
        if (Pt6(I), Jk8({
                success: !1,
                error: _1(u)
            }), h01(), u instanceof WE1) Y.setAppState((p) => {
            let Q = u.serverName,
                U = p.mcp.clients.findIndex((Y6) => Y6.name === Q);
            if (U === -1) return p;
            let r = p.mcp.clients[U];
            if (!r || r.type !== "connected") return p;
            let e = [...p.mcp.clients];
            return e[U] = {
                name: Q,
                type: "needs-auth",
                config: r.config
            }, {
                ...p,
                mcp: {
                    ...p.mcp,
                    clients: e
                }
            }
        });
        if (!(u instanceof oY)) {
            let p = _1(u);
            if (k(`${A.name} tool error (${I}ms): ${p.slice(0,200)}`), !(u instanceof uS)) _6(u);
            d("tengu_tool_use_error", {
                messageID: w,
                toolName: hq(A.name),
                error: XxY(u),
                isMcp: A.isMcp ?? !1,
                queryChainId: Y.queryTracking?.chainId,
                queryDepth: Y.queryTracking?.depth,
                ...$ ? {
                    mcpServerType: $
                } : {},
                ...H ? {
                    mcpServerBaseUrl: H
                } : {},
                ...O ? {
                    requestId: O
                } : {},
                ...YF() ? (() => {
                    let U = gb(A.name);
                    return U ? {
                        mcpServerName: U.serverName,
                        mcpToolName: U.mcpToolName
                    } : {}
                })() : {}
            });
            let Q = rk(A) ? jE8(A.name) : null;
            pw("tool_result", {
                tool_name: hq(A.name),
                use_id: q,
                success: "false",
                duration_ms: String(I),
                error: _1(u),
                ...Object.keys(L).length > 0 && {
                    tool_parameters: B6(L)
                },
                ...h && {
                    decision_source: h.source,
                    decision_type: h.decision
                },
                ...Q ? {
                    mcp_server_scope: Q
                } : {}
            })
        }
        let g = pT6(u),
            B = u instanceof oY,
            b = [];
        for await (let p of E4q(Y, A, q, w, X, g, B, O, $, H)) b.push(p);
        return [{
            message: p1({
                content: [{
                    type: "tool_result",
                    content: g,
                    is_error: !0,
                    tool_use_id: q
                }],
                toolUseResult: `Error: ${g}`,
                mcpMeta: Y.agentId ? void 0 : u instanceof ZE1 ? u.mcpMeta : void 0,
                sourceToolAssistantUUID: _.uuid
            })
        }, ...b]
    } finally {
        if (DE1(), h) Y.toolDecisions?.delete(q)
    }
}
// @from(Ln 370784, Col 4)
SF8 = E(() => {
    V1();
    o$();
    k01();
    FB();
    Ae();
    T1();
    Mk8();
    J_();
    Q$();
    IX();
    s8();
    k1();
    H1();
    ZR();
    JA();
    M0();
    sy();
    qM();
    FT6();
    QP();
    VF8();
    g1();
    JZ();
    XE1();
    fR();
    pt();
    L4q();
    HA()
})
// @from(Ln 370815, Col 0)
function TxY() {
    return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10
}
// @from(Ln 370818, Col 0)
async function* GE1(A, q, K, Y) {
    let z = Y;
    for (let {
            isConcurrencySafe: _,
            blocks: w
        }
        of vxY(A, z))
        if (_) {
            let O = {};
            for await (let $ of VxY(w, q, K, z)) {
                if ($.contextModifier) {
                    let {
                        toolUseID: H,
                        modifyContext: j
                    } = $.contextModifier;
                    if (!O[H]) O[H] = [];
                    O[H].push(j)
                }
                yield {
                    message: $.message,
                    newContext: z
                }
            }
            for (let $ of w) {
                let H = O[$.id];
                if (!H) continue;
                for (let j of H) z = j(z)
            }
            yield {
                newContext: z
            }
        } else
            for await (let O of NxY(w, q, K, z)) {
                if (O.newContext) z = O.newContext;
                yield {
                    message: O.message,
                    newContext: z
                }
            }
}
// @from(Ln 370859, Col 0)
function vxY(A, q) {
    return A.reduce((K, Y) => {
        let z = dK(q.options.tools, Y.name);
        if (z) Y.input = PE1(z, Y.input);
        let _ = z?.inputSchema.safeParse(Y.input),
            w = _?.success ? (() => {
                try {
                    return Boolean(z?.isConcurrencySafe(_.data))
                } catch {
                    return !1
                }
            })() : !1;
        if (w && K[K.length - 1]?.isConcurrencySafe) K[K.length - 1].blocks.push(Y);
        else K.push({
            isConcurrencySafe: w,
            blocks: [Y]
        });
        return K
    }, [])
}
// @from(Ln 370879, Col 0)
async function* NxY(A, q, K, Y) {
    let z = Y;
    for (let _ of A) {
        Y.setInProgressToolUseIDs((w) => new Set([...w, _.id]));
        for await (let w of Wi6(_, q.find((O) => O.message.content.some(($) => $.type === "tool_use" && $.id === _.id)), K, z)) {
            if (w.contextModifier) z = w.contextModifier.modifyContext(z);
            yield {
                message: w.message,
                newContext: z
            }
        }
        u4q(Y, _.id)
    }
}
// @from(Ln 370893, Col 0)
async function* VxY(A, q, K, Y) {
    yield* f01(A.map(async function*(z) {
        Y.setInProgressToolUseIDs((_) => new Set([..._, z.id])), yield* Wi6(z, q.find((_) => _.message.content.some((w) => w.type === "tool_use" && w.id === z.id)), K, Y), u4q(Y, z.id)
    }), TxY())
}
// @from(Ln 370899, Col 0)
function u4q(A, q) {
    A.setInProgressToolUseIDs((K) => new Set([...K].filter((Y) => Y !== q)))
}
// @from(Ln 370902, Col 4)
IF8 = E(() => {
    o36();
    SF8()
})
// @from(Ln 370907, Col 0)
function m4q(A) {
    if (!A) return !1;
    if (A.type === "assistant") {
        let q = fL(A.message.content);
        return q?.type === "text" || q?.type === "thinking" || q?.type === "redacted_thinking"
    }
    if (A.type === "user") {
        let q = A.message.content;
        if (!Array.isArray(q) || q.length === 0) return !1;
        return q.every((K) => ("type" in K) && K.type === "tool_result")
    }
    return !1
}
// @from(Ln 370921, Col 0)
function* bF8(A) {
    switch (A.type) {
        case "assistant":
            for (let q of JM([A])) {
                if (!Gi6(q)) continue;
                yield {
                    type: "assistant",
                    message: q.message,
                    parent_tool_use_id: null,
                    session_id: R1(),
                    uuid: q.uuid,
                    error: q.error
                }
            }
            return;
        case "progress":
            if (A.data.type === "agent_progress")
                for (let q of JM([A.data.message])) switch (q.type) {
                    case "assistant":
                        if (!Gi6(q)) break;
                        yield {
                            type: "assistant", message: q.message, parent_tool_use_id: A.parentToolUseID, session_id: R1(), uuid: q.uuid, error: q.error
                        };
                        break;
                    case "user":
                        yield {
                            type: "user", message: q.message, parent_tool_use_id: A.parentToolUseID, session_id: R1(), uuid: q.uuid, isSynthetic: q.isMeta || q.isVisibleInTranscriptOnly, tool_use_result: q.mcpMeta ? {
                                content: q.toolUseResult,
                                ...q.mcpMeta
                            } : q.toolUseResult
                        };
                        break
                } else if (A.data.type === "bash_progress" || A.data.type === "powershell_progress") {
                    if (!t6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_CONTAINER_ID) break;
                    let q = A.parentToolUseID,
                        K = Date.now(),
                        Y = Zi6.get(q) || 0;
                    if (K - Y >= yxY) {
                        if (Zi6.size >= ExY) {
                            let _ = Zi6.keys().next().value;
                            if (_ !== void 0) Zi6.delete(_)
                        }
                        Zi6.set(q, K), yield {
                            type: "tool_progress",
                            tool_use_id: A.toolUseID,
                            tool_name: A.data.type === "bash_progress" ? "Bash" : "PowerShell",
                            parent_tool_use_id: A.parentToolUseID,
                            elapsed_time_seconds: A.data.elapsedTimeSeconds,
                            task_id: A.data.taskId,
                            session_id: R1(),
                            uuid: A.uuid
                        }
                    }
                } break;
        case "user":
            for (let q of JM([A])) yield {
                type: "user",
                message: q.message,
                parent_tool_use_id: null,
                session_id: R1(),
                uuid: q.uuid,
                isSynthetic: q.isMeta || q.isVisibleInTranscriptOnly,
                tool_use_result: q.mcpMeta ? {
                    content: q.toolUseResult,
                    ...q.mcpMeta
                } : q.toolUseResult
            };
            return;
        default:
    }
}
// @from(Ln 370992, Col 0)
async function* B4q(A, q, K, Y) {
    let z = !jS(),
        {
            permissionResult: _,
            assistantMessage: w
        } = A,
        {
            toolUseID: O
        } = _;
    if (!O) return;
    let $ = w.message.content,
        H;
    if (Array.isArray($)) {
        for (let G of $)
            if (G.type === "tool_use" && G.id === O) {
                H = G;
                break
            }
    }
    if (!H) return;
    let {
        name: j,
        input: J
    } = H;
    if (!dK(q, j)) return;
    let D = J;
    if (_.behavior === "allow")
        if (_.updatedInput !== void 0) D = _.updatedInput;
        else k(`Orphaned permission for ${j}: updatedInput is undefined, falling back to original tool input`, {
            level: "warn"
        });
    let X = {
            ...H,
            input: D
        },
        P = async () => ({
            ..._,
            decisionReason: {
                type: "mode",
                mode: "default"
            }
        });
    if (!K.some((G) => G.type === "assistant" && Array.isArray(G.message.content) && G.message.content.some((f) => f.type === "tool_use" && ("id" in f) && f.id === O))) {
        if (K.push(w), z) await _F(K)
    }
    yield {
        ...w,
        session_id: R1(),
        parent_tool_use_id: null
    };
    for await (let G of GE1([X], [w], P, Y)) if (G.message) {
        if (K.push(G.message), z) await _F(K);
        yield {
            ...G.message,
            session_id: R1(),
            parent_tool_use_id: null
        }
    }
}
// @from(Ln 371052, Col 0)
function UT6(A, q, K = kxY) {
    let Y = yd(K),
        z = new Map,
        _ = new Map;
    for (let w of A)
        if (w.type === "assistant" && Array.isArray(w.message.content)) {
            for (let O of w.message.content)
                if (O.type === "tool_use" && O.name === s7) {
                    let $ = O.input;
                    if ($?.file_path && $?.offset === void 0 && $?.limit === void 0) {
                        let H = L4($.file_path, q);
                        z.set(O.id, H)
                    }
                } else if (O.type === "tool_use" && O.name === _K) {
                let $ = O.input;
                if ($?.file_path && $?.content) {
                    let H = L4($.file_path, q);
                    _.set(O.id, {
                        filePath: H,
                        content: $.content
                    })
                }
            }
        } for (let w of A)
        if (w.type === "user" && Array.isArray(w.message.content)) {
            for (let O of w.message.content)
                if (O.type === "tool_result" && O.tool_use_id) {
                    let $ = z.get(O.tool_use_id);
                    if ($ && typeof O.content === "string") {
                        let M = O.content.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").split(`
`).map((D) => {
                            let X = D.match(/^\s*\d+\u2192(.*)$/);
                            return X ? X[1] : D
                        }).join(`
`).trim();
                        if (w.timestamp) {
                            let D = new Date(w.timestamp).getTime();
                            Y.set($, {
                                content: M,
                                timestamp: D,
                                offset: void 0,
                                limit: void 0
                            })
                        }
                    }
                    let H = _.get(O.tool_use_id);
                    if (H && w.timestamp) {
                        let j = new Date(w.timestamp).getTime();
                        Y.set(H.filePath, {
                            content: H.content,
                            timestamp: j,
                            offset: void 0,
                            limit: void 0
                        })
                    }
                }
        } return Y
}
// @from(Ln 371110, Col 4)
kxY = 10
// @from(Ln 371111, Col 4)
ExY = 100
// @from(Ln 371112, Col 4)
yxY = 30000
// @from(Ln 371113, Col 4)
Zi6
// @from(Ln 371114, Col 4)
fi6 = E(() => {
    eI6();
    tP();
    J_();
    Q$();
    F9();
    A8();
    Oq();
    JA();
    T1();
    IF8();
    H1();
    Zi6 = new Map
})
// @from(Ln 371146, Col 0)
function Ti6(A) {
    RxY(A, {
        recursive: !0,
        force: !0,
        maxRetries: 3,
        retryDelay: 100
    }, () => {})
}
// @from(Ln 371155, Col 0)
function TE1(A) {
    return xz6(_k(), "speculation", String(process.pid), A)
}
// @from(Ln 371159, Col 0)
function fE1(A, q) {
    return {
        behavior: "deny",
        message: A,
        decisionReason: {
            type: "other",
            reason: q
        }
    }
}
// @from(Ln 371169, Col 0)
async function mxY(A, q, K) {
    let Y = !0;
    for (let z of q) {
        let _ = xz6(A, z),
            w = xz6(K, z);
        try {
            await xF8(F4q(w), {
                recursive: !0
            }), await g4q(_, w)
        } catch {
            Y = !1, k(`[Speculation] Failed to copy ${z} to main`)
        }
    }
    return Y
}
// @from(Ln 371185, Col 0)
function vE1(A, q, K, Y, z, _, w) {
    d("tengu_speculation", {
        speculation_id: A,
        outcome: q,
        duration_ms: Date.now() - K,
        suggestion_length: Y,
        tools_executed: mF8(z),
        completed: _ !== null,
        boundary_type: _?.type,
        boundary_tool: BxY(_),
        boundary_detail: gxY(_),
        ...w
    })
}
// @from(Ln 371200, Col 0)
function mF8(A) {
    return A.filter(BF8).flatMap((q) => q.message.content).filter((q) => typeof q === "object" && q !== null && ("type" in q)).filter((q) => q.type === "tool_result" && !q.is_error).length
}
// @from(Ln 371204, Col 0)
function BxY(A) {
    if (!A) return;
    switch (A.type) {
        case "bash":
            return "Bash";
        case "edit":
        case "denied_tool":
            return A.toolName;
        case "complete":
            return
    }
}
// @from(Ln 371217, Col 0)
function gxY(A) {
    if (!A) return;
    switch (A.type) {
        case "bash":
            return A.command.slice(0, 200);
        case "edit":
            return A.filePath;
        case "denied_tool":
            return A.detail;
        case "complete":
            return
    }
}
// @from(Ln 371231, Col 0)
function BF8(A) {
    return A.type === "user" && "message" in A && Array.isArray(A.message.content)
}
// @from(Ln 371235, Col 0)
function FxY(A) {
    let q = (_) => typeof _ === "object" && _ !== null && _.type === "tool_result" && typeof _.tool_use_id === "string",
        K = (_) => !_.is_error && !(typeof _.content === "string" && _.content.includes(P0)),
        Y = new Set(A.filter(BF8).flatMap((_) => _.message.content).filter(q).filter(K).map((_) => _.tool_use_id)),
        z = (_) => _.type !== "thinking" && _.type !== "redacted_thinking" && !(_.type === "tool_use" && !Y.has(_.id)) && !(_.type === "tool_result" && !Y.has(_.tool_use_id)) && !(_.type === "text" && (_.text === D66 || _.text === P0));
    return A.map((_) => {
        if (!("message" in _) || !Array.isArray(_.message.content)) return _;
        let w = _.message.content.filter(z);
        if (w.length === _.message.content.length) return _;
        if (w.length === 0) return null;
        if (!w.some(($) => $.type !== "text" || $.text !== void 0 && $.text.trim() !== "")) return null;
        return {
            ..._,
            message: {
                ..._.message,
                content: w
            }
        }
    }).filter((_) => _ !== null)
}
// @from(Ln 371256, Col 0)
function pxY(A, q, K, Y) {
    return null
}
// @from(Ln 371260, Col 0)
function dT6(A, q) {
    A((K) => {
        if (K.speculation.status !== "active") return K;
        let Y = K.speculation,
            z = q(Y);
        if (!Object.entries(z).some(([w, O]) => Y[w] !== O)) return K;
        return {
            ...K,
            speculation: {
                ...Y,
                ...z
            }
        }
    })
}
// @from(Ln 371276, Col 0)
function uF8(A) {
    A((q) => {
        if (q.speculation.status === "idle") return q;
        return {
            ...q,
            speculation: q16
        }
    })
}
// @from(Ln 371286, Col 0)
function gF8() {
    return k("[Speculation] enabled=false"), !1
}
// @from(Ln 371289, Col 0)
async function QxY(A, q, K, Y, z) {
    try {
        let _ = A.toolUseContext.getAppState(),
            w = pF8(_);
        if (w) {
            F0(`pipeline_${w}`);
            return
        }
        let O = {
                ...A,
                messages: [...A.messages, p1({
                    content: q
                }), ...K]
            },
            $ = Wm(z);
        if ($.signal.aborted) return;
        let H = NE1(),
            {
                suggestion: j,
                generationRequestId: J
            } = await QF8($, H, Fb(O));
        if ($.signal.aborted) return;
        if (UF8(j, H)) return;
        k(`[Speculation] Pipelined suggestion: "${j.slice(0,50)}..."`), dT6(Y, () => ({
            pipelinedSuggestion: {
                text: j,
                promptId: H,
                generationRequestId: J
            }
        }))
    } catch (_) {
        if (_ instanceof Error && _.name === "AbortError") return;
        k(`[Speculation] Pipelined suggestion failed: ${_1(_)}`)
    }
}
// @from(Ln 371324, Col 0)
async function FF8(A, q, K, Y = !1, z) {
    if (!gF8()) return;
    Nb(K);
    let _ = LxY().slice(0, 8),
        w = Wm(q.toolUseContext.abortController);
    if (w.signal.aborted) return;
    let O = Date.now(),
        $ = {
            current: []
        },
        H = {
            current: new Set
        },
        j = TE1(_),
        J = OS();
    try {
        await xF8(j, {
            recursive: !0
        })
    } catch {
        k("[Speculation] Failed to create overlay directory");
        return
    }
    let M = {
        current: q
    };
    K((D) => ({
        ...D,
        speculation: {
            status: "active",
            id: _,
            abort: () => w.abort(),
            startTime: O,
            messagesRef: $,
            writtenPathsRef: H,
            boundary: null,
            suggestionLength: A.length,
            toolUseCount: 0,
            isPipelined: Y,
            contextRef: M
        }
    })), k(`[Speculation] Starting speculation ${_}`);
    try {
        let D = await av({
            promptMessages: [p1({
                content: A
            })],
            cacheSafeParams: z ?? Fb(q),
            skipTranscript: !0,
            canUseTool: async (X, P) => {
                let W = xxY.has(X.name),
                    Z = uxY.has(X.name);
                if (W) {
                    let f = q.toolUseContext.getAppState(),
                        {
                            mode: v,
                            isBypassPermissionsModeAvailable: N
                        } = f.toolPermissionContext;
                    if (!(v === "acceptEdits" || v === "bypassPermissions" || v === "plan" && N)) {
                        k(`[Speculation] Stopping at file edit: ${X.name}`);
                        let L = "file_path" in P ? P.file_path : void 0;
                        return dT6(K, () => ({
                            boundary: {
                                type: "edit",
                                toolName: X.name,
                                filePath: L ?? "",
                                completedAt: Date.now()
                            }
                        })), w.abort(), fE1("Speculation paused: file edit requires permission", "speculation_edit_boundary")
                    }
                }
                if (W || Z) {
                    let f = "notebook_path" in P ? "notebook_path" : ("path" in P) ? "path" : "file_path",
                        v = P[f];
                    if (v) {
                        let N = CxY(J, v);
                        if (SxY(N) || N.startsWith("..")) {
                            if (W) return k(`[Speculation] Denied ${X.name}: path outside cwd: ${v}`), fE1("Write outside cwd not allowed during speculation", "speculation_write_outside_root");
                            return {
                                behavior: "allow",
                                updatedInput: P,
                                decisionReason: {
                                    type: "other",
                                    reason: "speculation_read_outside_root"
                                }
                            }
                        }
                        if (W) {
                            if (!H.current.has(N)) {
                                let V = xz6(j, N);
                                await xF8(F4q(V), {
                                    recursive: !0
                                });
                                try {
                                    await g4q(xz6(J, N), V)
                                } catch {}
                                H.current.add(N)
                            }
                            P = {
                                ...P,
                                [f]: xz6(j, N)
                            }
                        } else if (H.current.has(N)) P = {
                            ...P,
                            [f]: xz6(j, N)
                        };
                        return k(`[Speculation] ${W?"Write":"Read"} ${v} -> ${P[f]}`), {
                            behavior: "allow",
                            updatedInput: P,
                            decisionReason: {
                                type: "other",
                                reason: "speculation_file_access"
                            }
                        }
                    }
                    if (Z) return {
                        behavior: "allow",
                        updatedInput: P,
                        decisionReason: {
                            type: "other",
                            reason: "speculation_read_default_cwd"
                        }
                    }
                }
                if (X.name === "Bash") {
                    let f = "command" in P && typeof P.command === "string" ? P.command : "";
                    if (!f || Z01({
                            command: f
                        }, vi6(f)).behavior !== "allow") return k(`[Speculation] Stopping at bash: ${f.slice(0,50)||"missing command"}`), dT6(K, () => ({
                        boundary: {
                            type: "bash",
                            command: f,
                            completedAt: Date.now()
                        }
                    })), w.abort(), fE1("Speculation paused: bash boundary", "speculation_bash_boundary");
                    return {
                        behavior: "allow",
                        updatedInput: P,
                        decisionReason: {
                            type: "other",
                            reason: "speculation_readonly_bash"
                        }
                    }
                }
                k(`[Speculation] Stopping at denied tool: ${X.name}`);
                let G = String("url" in P && P.url || "file_path" in P && P.file_path || "path" in P && P.path || "command" in P && P.command || "").slice(0, 200);
                return dT6(K, () => ({
                    boundary: {
                        type: "denied_tool",
                        toolName: X.name,
                        detail: G,
                        completedAt: Date.now()
                    }
                })), w.abort(), fE1(`Tool ${X.name} not allowed during speculation`, "speculation_unknown_tool")
            },
            querySource: "speculation",
            forkLabel: "speculation",
            maxTurns: IxY,
            overrides: {
                abortController: w,
                requireCanUseTool: !0
            },
            onMessage: (X) => {
                if (X.type === "assistant" || X.type === "user") {
                    if ($.current.push(X), $.current.length >= bxY) w.abort();
                    if (BF8(X)) {
                        let P = X.message.content.filter((W) => W.type === "tool_result" && !W.is_error).length;
                        if (P > 0) dT6(K, (W) => ({
                            toolUseCount: W.toolUseCount + P
                        }))
                    }
                }
            }
        });
        if (w.signal.aborted) return;
        dT6(K, () => ({
            boundary: {
                type: "complete",
                completedAt: Date.now(),
                outputTokens: D.totalUsage.output_tokens
            }
        })), k(`[Speculation] Complete: ${mF8($.current)} tools`), QxY(M.current, A, $.current, K, w)
    } catch (D) {
        if (w.abort(), D instanceof Error && D.name === "AbortError") {
            Ti6(j), uF8(K);
            return
        }
        Ti6(j), _6(D instanceof Error ? D : Error("Speculation failed")), vE1(_, "error", O, A.length, $.current, null, {
            error_type: D instanceof Error ? D.name : "Unknown",
            error_message: _1(D).slice(0, 200),
            error_phase: "start",
            is_pipelined: Y
        }), uF8(K)
    }
}
// @from(Ln 371519, Col 0)
async function UxY(A, q, K) {
    if (A.status !== "active") return null;
    let {
        id: Y,
        messagesRef: z,
        writtenPathsRef: _,
        abort: w,
        startTime: O,
        suggestionLength: $,
        isPipelined: H
    } = A, j = z.current, J = TE1(Y), M = Date.now();
    if (w(), K > 0) await mxY(J, _.current, OS());
    Ti6(J);
    let D = A.boundary,
        X = Math.min(M, D?.completedAt ?? 1 / 0) - O;
    if (q((P) => {
            if (P.speculation.status === "active" && P.speculation.boundary) D = P.speculation.boundary, X = Math.min(M, D.completedAt ?? 1 / 0) - O;
            return {
                ...P,
                speculation: q16,
                speculationSessionTimeSavedMs: P.speculationSessionTimeSavedMs + X
            }
        }), k(D === null ? `[Speculation] Accept ${Y}: still running, using ${j.length} messages` : `[Speculation] Accept ${Y}: already complete`), vE1(Y, "accepted", O, $, j, D, {
            message_count: j.length,
            time_saved_ms: X,
            is_pipelined: H
        }), X > 0) {
        let P = {
            type: "speculation-accept",
            timestamp: new Date().toISOString(),
            timeSavedMs: X
        };
        hxY(Cz(), B6(P) + `
`, {
            mode: 384
        }).catch(() => {
            k("[Speculation] Failed to write speculation-accept to transcript")
        })
    }
    return {
        messages: j,
        boundary: D,
        timeSavedMs: X
    }
}
// @from(Ln 371565, Col 0)
function Nb(A) {
    A((q) => {
        if (q.speculation.status !== "active") return q;
        let {
            id: K,
            abort: Y,
            startTime: z,
            boundary: _,
            suggestionLength: w,
            messagesRef: O,
            isPipelined: $
        } = q.speculation;
        return k(`[Speculation] Aborting ${K}`), vE1(K, "aborted", z, w, O.current, _, {
            abort_reason: "user_typed",
            is_pipelined: $
        }), Y(), Ti6(TE1(K)), {
            ...q,
            speculation: q16
        }
    })
}
// @from(Ln 371586, Col 0)
async function p4q(A, q, K, Y, z) {
    try {
        let {
            setMessages: _,
            readFileState: w,
            cwd: O
        } = z;
        K((Z) => {
            if (Z.promptSuggestion.text === null && Z.promptSuggestion.promptId === null) return Z;
            return {
                ...Z,
                promptSuggestion: {
                    text: null,
                    promptId: null,
                    shownAt: 0,
                    acceptedAt: 0,
                    generationRequestId: null
                }
            }
        });
        let $ = A.messagesRef.current,
            H = FxY($),
            j = p1({
                content: Y
            });
        _((Z) => [...Z, j]);
        let J = await UxY(A, K, H.length),
            M = J?.boundary?.type === "complete";
        if (!M) {
            let Z = H.findLastIndex((G) => G.type !== "assistant");
            H = H.slice(0, Z + 1)
        }
        let D = J?.timeSavedMs ?? 0,
            X = q + D,
            P = pxY(H, J?.boundary ?? null, D, X);
        _((Z) => [...Z, ...H]);
        let W = UT6(H, O, Ed);
        if (w.current = yD1(w.current, W), P) _((Z) => [...Z, P]);
        if (k(`[Speculation] ${J?.boundary?.type??"incomplete"}, injected ${H.length} messages`), M && A.pipelinedSuggestion) {
            let {
                text: Z,
                promptId: G,
                generationRequestId: f
            } = A.pipelinedSuggestion;
            k(`[Speculation] Promoting pipelined suggestion: "${Z.slice(0,50)}..."`), K((N) => ({
                ...N,
                promptSuggestion: {
                    text: Z,
                    promptId: G,
                    shownAt: Date.now(),
                    acceptedAt: 0,
                    generationRequestId: f
                }
            }));
            let v = {
                ...A.contextRef.current,
                messages: [...A.contextRef.current.messages, p1({
                    content: Y
                }), ...H]
            };
            FF8(Z, v, K, !0)
        }
        return {
            queryRequired: !M
        }
    } catch (_) {
        return _6(_ instanceof Error ? _ : Error("handleSpeculationAccept failed")), vE1(A.id, "error", A.startTime, A.suggestionLength, A.messagesRef.current, A.boundary, {
            error_type: _ instanceof Error ? _.name : "Unknown",
            error_message: _1(_).slice(0, 200),
            error_phase: "accept",
            is_pipelined: A.isPipelined
        }), Ti6(TE1(A.id)), uF8(K), {
            queryRequired: !0
        }
    }
}
// @from(Ln 371662, Col 4)
IxY = 20
// @from(Ln 371663, Col 4)
bxY = 100
// @from(Ln 371664, Col 4)
xxY
// @from(Ln 371664, Col 9)
uxY
// @from(Ln 371665, Col 4)
sY6 = E(() => {
    RY();
    cT6();
    gR();
    JA();
    M4();
    sV8();
    JZ();
    V1();
    H1();
    Oq();
    g1();
    k8();
    k1();
    U$();
    T1();
    fi6();
    tP();
    A16();
    s8();
    xxY = new Set(["Edit", "Write", "NotebookEdit"]), uxY = new Set(["Read", "Glob", "Grep", "ToolSearch", "LSP", "TaskGet", "TaskList"])
})
// @from(Ln 371688, Col 0)
function xf6() {
    return {
        toolUseCount: 0,
        latestInputTokens: 0,
        cumulativeOutputTokens: 0,
        recentActivities: []
    }
}
// @from(Ln 371697, Col 0)
function vV1(A) {
    return A.latestInputTokens + A.cumulativeOutputTokens
}
// @from(Ln 371701, Col 0)
function Az6(A, q, K, Y) {
    if (q.type !== "assistant") return;
    let z = q.message.usage;
    A.latestInputTokens = z.input_tokens + (z.cache_creation_input_tokens ?? 0) + (z.cache_read_input_tokens ?? 0), A.cumulativeOutputTokens += z.output_tokens;
    for (let _ of q.message.content)
        if (_.type === "tool_use") {
            if (A.toolUseCount++, _.name !== oM) {
                let w = _.input,
                    O = Y ? i36(_.name, w, Y) : void 0;
                A.recentActivities.push({
                    toolName: _.name,
                    input: w,
                    activityDescription: K?.(_.name, w),
                    isSearch: O?.isSearch,
                    isRead: O?.isRead
                })
            }
        } while (A.recentActivities.length > dxY) A.recentActivities.shift()
}
// @from(Ln 371721, Col 0)
function v66(A) {
    return {
        toolUseCount: A.toolUseCount,
        tokenCount: vV1(A),
        lastActivity: A.recentActivities.length > 0 ? A.recentActivities[A.recentActivities.length - 1] : void 0,
        recentActivities: [...A.recentActivities]
    }
}
// @from(Ln 371730, Col 0)
function uf6(A) {
    return (q, K) => {
        return dK(A, q)?.getActivityDescription?.(K) ?? void 0
    }
}
// @from(Ln 371736, Col 0)
function Sf(A) {
    return typeof A === "object" && A !== null && "type" in A && A.type === "local_agent"
}
// @from(Ln 371740, Col 0)
function NV1(A, q, K) {
    i9(A, K, (Y) => ({
        ...Y,
        pendingMessages: [...Y.pendingMessages, q]
    }))
}
// @from(Ln 371747, Col 0)
function Q4q(A, q, K) {
    let Y = q().tasks[A];
    if (!Sf(Y) || Y.pendingMessages.length === 0) return [];
    let z = Y.pendingMessages;
    return i9(A, K, (_) => ({
        ..._,
        pendingMessages: []
    })), z
}
// @from(Ln 371757, Col 0)
function $z6({
    taskId: A,
    description: q,
    status: K,
    error: Y,
    setAppState: z,
    finalMessage: _,
    usage: w,
    toolUseId: O,
    worktreePath: $,
    worktreeBranch: H
}) {
    let j = !1;
    if (i9(A, z, (f) => {
            if (f.notified) return f;
            return j = !0, {
                ...f,
                notified: !0,
                messages: f.messages?.length ? [f.messages[f.messages.length - 1]] : void 0
            }
        }), !j) return;
    Nb(z);
    let J = K === "completed" ? `Agent "${q}" completed` : K === "failed" ? `Agent "${q}" failed: ${Y||"Unknown error"}` : `Agent "${q}" was stopped`,
        M = g2(A),
        D = O ? `
<${NV}>${O}</${NV}>` : "",
        X = _ ? `
<result>${_}</result>` : "",
        P = w ? `
<usage><total_tokens>${w.totalTokens}</total_tokens><tool_uses>${w.toolUses}</tool_uses><duration_ms>${w.durationMs}</duration_ms></usage>` : "",
        W = $ ? `
<${Gl1}><${fl1}>${$}</${fl1}>${H?`<${Tl1}>${H}</${Tl1}>`:""}</${Gl1}>` : "",
        Z = e2() ? "" : `
Full transcript available at: ${M}`,
        G = `<${EH}>
<${JG}>${A}</${JG}>${D}
<${VV}>${M}</${VV}>
<${uD}>${K}</${uD}>
<${mD}>${J}</${mD}>${X}${P}${W}
</${EH}>${Z}`;
    w0({
        value: G,
        mode: "task-notification"
    })
}
// @from(Ln 371803, Col 0)
function x66(A, q) {
    let K = !1;
    if (i9(A, q, (Y) => {
            if (Y.status !== "running") return Y;
            return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
                ...Y,
                status: "killed",
                endTime: Date.now(),
                messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                selectedAgent: void 0
            }
        }), K) $O(A);
    return K
}
// @from(Ln 371820, Col 0)
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}
// @from(Ln 371825, Col 0)
function d4q(A, q) {
    i9(A, q, (K) => {
        if (K.notified) return K;
        return {
            ...K,
            notified: !0,
            messages: K.messages?.length ? [K.messages[K.messages.length - 1]] : void 0
        }
    })
}
// @from(Ln 371836, Col 0)
function TV1(A, q, K) {
    i9(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        let z = Y.progress?.summary;
        return {
            ...Y,
            progress: z ? {
                ...q,
                summary: z
            } : q
        }
    })
}
// @from(Ln 371850, Col 0)
function nl4(A, q, K) {
    let Y = null;
    if (i9(A, K, (z) => {
            if (z.status !== "running") return z;
            return Y = {
                tokenCount: z.progress?.tokenCount ?? 0,
                toolUseCount: z.progress?.toolUseCount ?? 0,
                startTime: z.startTime,
                toolUseId: z.toolUseId
            }, {
                ...z,
                progress: {
                    ...z.progress,
                    toolUseCount: z.progress?.toolUseCount ?? 0,
                    tokenCount: z.progress?.tokenCount ?? 0,
                    summary: q
                }
            }
        }), Y && Nn()) {
        let {
            tokenCount: z,
            toolUseCount: _,
            startTime: w,
            toolUseId: O
        } = Y;
        c36({
            type: "system",
            subtype: "task_progress",
            task_id: A,
            tool_use_id: O,
            description: q,
            usage: {
                total_tokens: z,
                tool_uses: _,
                duration_ms: Date.now() - w
            },
            summary: q
        })
    }
}
// @from(Ln 371891, Col 0)
function $m8(A, q) {
    let K = A.agentId;
    i9(K, q, (Y) => {
        if (Y.status !== "running") return Y;
        return Y.unregisterCleanup?.(), {
            ...Y,
            status: "completed",
            result: A,
            endTime: Date.now(),
            messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
            abortController: void 0,
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), $O(K)
}
// @from(Ln 371908, Col 0)
function Hm8(A, q, K) {
    i9(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        return Y.unregisterCleanup?.(), {
            ...Y,
            status: "failed",
            error: q,
            endTime: Date.now(),
            messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
            abortController: void 0,
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), $O(A)
}
// @from(Ln 371924, Col 0)
function Qn4({
    agentId: A,
    description: q,
    prompt: K,
    selectedAgent: Y,
    setAppState: z,
    parentAbortController: _,
    toolUseId: w
}) {
    Co(A, L0(X$(A)));
    let O = _ ? Wm(_) : sK(),
        $ = {
            ...RG(A, "local_agent", q, w),
            type: "local_agent",
            status: "running",
            agentId: A,
            prompt: K,
            selectedAgent: Y,
            agentType: Y.agentType ?? "general-purpose",
            abortController: O,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !0,
            pendingMessages: []
        },
        H = E4(async () => {
            x66(A, z)
        });
    return $.unregisterCleanup = H, Zf($, z), $
}
// @from(Ln 371956, Col 0)
function Un4({
    agentId: A,
    description: q,
    prompt: K,
    selectedAgent: Y,
    setAppState: z,
    autoBackgroundMs: _,
    toolUseId: w
}) {
    Co(A, L0(X$(A)));
    let O = sK(),
        $ = E4(async () => {
            x66(A, z)
        }),
        H = {
            ...RG(A, "local_agent", q, w),
            type: "local_agent",
            status: "running",
            agentId: A,
            prompt: K,
            selectedAgent: Y,
            agentType: Y.agentType ?? "general-purpose",
            abortController: O,
            unregisterCleanup: $,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !1,
            pendingMessages: []
        },
        j, J = new Promise((D) => {
            j = D
        });
    lT6.set(A, j), Zf(H, z);
    let M;
    if (_ !== void 0 && _ > 0) {
        let D = setTimeout((X, P) => {
            X((Z) => {
                let G = Z.tasks[P];
                if (!Sf(G) || G.isBackgrounded) return Z;
                return {
                    ...Z,
                    tasks: {
                        ...Z.tasks,
                        [P]: {
                            ...G,
                            isBackgrounded: !0
                        }
                    }
                }
            });
            let W = lT6.get(P);
            if (W) W(), lT6.delete(P)
        }, _, z, A);
        M = () => clearTimeout(D)
    }
    return {
        taskId: A,
        backgroundSignal: J,
        cancelAutoBackground: M
    }
}
// @from(Ln 372019, Col 0)
function Ml4(A, q, K) {
    let z = q().tasks[A];
    if (!Sf(z) || z.isBackgrounded) return !1;
    K((w) => {
        let O = w.tasks[A];
        if (!Sf(O)) return w;
        return {
            ...w,
            tasks: {
                ...w.tasks,
                [A]: {
                    ...O,
                    isBackgrounded: !0
                }
            }
        }
    });
    let _ = lT6.get(A);
    if (_) _(), lT6.delete(A);
    return !0
}
// @from(Ln 372041, Col 0)
function dn4(A, q) {
    lT6.delete(A);
    let K;
    q((Y) => {
        let z = Y.tasks[A];
        if (!Sf(z) || z.isBackgrounded) return Y;
        K = z.unregisterCleanup;
        let {
            [A]: _, ...w
        } = Y.tasks;
        return {
            ...Y,
            tasks: w
        }
    }), K?.()
}
// @from(Ln 372057, Col 4)
ml
// @from(Ln 372057, Col 8)
dxY = 5
// @from(Ln 372058, Col 4)
Fk1
// @from(Ln 372058, Col 9)
lT6
// @from(Ln 372059, Col 4)
Vb = E(() => {
    i6();
    qL();
    U$();
    KY();
    aH();
    O0();
    SM();
    Oq();
    Fv();
    gB();
    BB();
    vz();
    sY6();
    Vp6();
    T1();
    ml = t(P6(), 1);
    Fk1 = {
        name: "LocalAgentTask",
        type: "local_agent",
        async spawn(A, q) {
            let {
                prompt: K,
                description: Y,
                agentType: z,
                model: _,
                selectedAgent: w,
                agentId: O,
                toolUseId: $
            } = A, {
                setAppState: H
            } = q, j = O ?? oV("local_agent");
            Co(j, L0(X$(j)));
            let J = sK(),
                M = {
                    ...RG(j, "local_agent", Y, $),
                    type: "local_agent",
                    status: "running",
                    agentId: j,
                    prompt: K,
                    selectedAgent: w,
                    agentType: z,
                    model: _,
                    abortController: J,
                    retrieved: !1,
                    lastReportedToolCount: 0,
                    lastReportedTokenCount: 0,
                    isBackgrounded: !0,
                    pendingMessages: []
                },
                D = E4(async () => {
                    x66(j, H)
                });
            return M.unregisterCleanup = D, Zf(M, H), {
                taskId: j,
                cleanup: () => {
                    D(), J.abort()
                }
            }
        },
        async kill(A, q) {
            x66(A, q.setAppState)
        },
        renderStatus(A) {
            let q = A,
                K = q.status,
                Y = q.description,
                z = q.progress,
                _ = K === "running" ? "warning" : K === "completed" ? "success" : K === "failed" ? "error" : "inactive",
                w = z ? ` (${z.toolUseCount} tools, ${z.tokenCount} tokens)` : "";
            return ml.createElement(m, null, ml.createElement(T, {
                color: _
            }, "[", K, "] ", Y, w))
        },
        renderOutput(A) {
            return ml.createElement(m, null, ml.createElement(T, null, A))
        }
    };
    lT6 = new Map
})
// @from(Ln 372140, Col 0)
function iT6() {
    if (t6(process.env.CLAUDE_CODE_MCP_INSTR_DELTA)) return !0;
    if (xz(process.env.CLAUDE_CODE_MCP_INSTR_DELTA)) return !1;
    return w8("tengu_basalt_3kr", !1)
}
// @from(Ln 372146, Col 0)
function c4q(A, q, K) {
    let Y = new Set;
    for (let H of q) {
        if (H.type !== "attachment") continue;
        if (H.attachment.type !== "mcp_instructions_delta") continue;
        for (let j of H.attachment.addedNames) Y.add(j);
        for (let j of H.attachment.removedNames) Y.delete(j)
    }
    let z = A.filter((H) => H.type === "connected"),
        _ = new Set(z.map((H) => H.name)),
        w = new Map;
    for (let H of z)
        if (H.instructions) w.set(H.name, `## ${H.name}
${H.instructions}`);
    for (let H of K) {
        if (!_.has(H.serverName)) continue;
        let j = w.get(H.serverName);
        w.set(H.serverName, j ? `${j}

${H.block}` : `## ${H.serverName}
${H.block}`)
    }
    let O = [];
    for (let [H, j] of w)
        if (!Y.has(H)) O.push({
            name: H,
            block: j
        });
    let $ = [];
    for (let H of Y)
        if (!_.has(H)) $.push(H);
    if (O.length === 0 && $.length === 0) return null;
    return d("tengu_mcp_instructions_pool_change", {
        addedCount: O.length,
        removedCount: $.length,
        priorAnnouncedCount: Y.size,
        clientSideCount: K.length
    }), O.sort((H, j) => H.name.localeCompare(j.name)), {
        addedNames: O.map((H) => H.name),
        addedBlocks: O.map((H) => H.block),
        removedNames: $.sort()
    }
}
// @from(Ln 372189, Col 4)
VE1 = E(() => {
    HA();
    V1();
    A8()
})
// @from(Ln 372195, Col 0)
function dF8() {
    return `# Claude in Chrome browser automation

You have access to browser automation tools (mcp__claude-in-chrome__*) for interacting with web pages in Chrome. Follow these guidelines for effective browser automation.

## GIF recording

When performing multi-step browser interactions that the user may want to review or share, use mcp__claude-in-chrome__gif_creator to record them.

You must ALWAYS:
* Capture extra frames before and after taking actions to ensure smooth playback
* Name the file meaningfully to help the user identify it later (e.g., "login_process.gif")

## Console log debugging

You can use mcp__claude-in-chrome__read_console_messages to read console output. Console output may be verbose. If you are looking for specific log entries, use the 'pattern' parameter with a regex-compatible pattern. This filters results efficiently and avoids overwhelming output. For example, use pattern: "[MyApp]" to filter for application-specific logs rather than reading all console output.

## Alerts and dialogs

IMPORTANT: Do not trigger JavaScript alerts, confirms, prompts, or browser modal dialogs through your actions. These browser dialogs block all further browser events and will prevent the extension from receiving any subsequent commands. Instead, when possible, use console.log for debugging and then use the mcp__claude-in-chrome__read_console_messages tool to read those log messages. If a page has dialog-triggering elements:
1. Avoid clicking buttons or links that may trigger alerts (e.g., "Delete" buttons with confirmation dialogs)
2. If you must interact with such elements, warn the user first that this may interrupt the session
3. Use mcp__claude-in-chrome__javascript_tool to check for and dismiss any existing dialogs before proceeding

If you accidentally trigger a dialog and lose responsiveness, inform the user they need to manually dismiss it in the browser.

## Avoid rabbit holes and loops

When using browser automation tools, stay focused on the specific task. If you encounter any of the following, stop and ask the user for guidance:
- Unexpected complexity or tangential browser exploration
- Browser tool calls failing or returning errors after 2-3 attempts
- No response from the browser extension
- Page elements not responding to clicks or input
- Pages not loading or timing out
- Unable to complete the browser task despite multiple approaches

Explain what you attempted, what went wrong, and ask how the user would like to proceed. Do not keep retrying the same failing browser action or explore unrelated pages without checking in first.

## Tab context and session startup

IMPORTANT: At the start of each browser automation session, call mcp__claude-in-chrome__tabs_context_mcp first to get information about the user's current browser tabs. Use this context to understand what the user might want to work with before creating new tabs.

Never reuse tab IDs from a previous/other session. Follow these guidelines:
1. Only reuse an existing tab if the user explicitly asks to work with it
2. Otherwise, create a new tab with mcp__claude-in-chrome__tabs_create_mcp
3. If a tool returns an error indicating the tab doesn't exist or is invalid, call tabs_context_mcp to get fresh tab IDs
4. When a tab is closed by the user or a navigation error occurs, call tabs_context_mcp to see what tabs are available`
}
// @from(Ln 372243, Col 4)
l4q = `# Claude in Chrome browser automation

You have access to browser automation tools (mcp__claude-in-chrome__*) for interacting with web pages in Chrome. Follow these guidelines for effective browser automation.

## GIF recording

When performing multi-step browser interactions that the user may want to review or share, use mcp__claude-in-chrome__gif_creator to record them.

You must ALWAYS:
* Capture extra frames before and after taking actions to ensure smooth playback
* Name the file meaningfully to help the user identify it later (e.g., "login_process.gif")

## Console log debugging

You can use mcp__claude-in-chrome__read_console_messages to read console output. Console output may be verbose. If you are looking for specific log entries, use the 'pattern' parameter with a regex-compatible pattern. This filters results efficiently and avoids overwhelming output. For example, use pattern: "[MyApp]" to filter for application-specific logs rather than reading all console output.

## Alerts and dialogs

IMPORTANT: Do not trigger JavaScript alerts, confirms, prompts, or browser modal dialogs through your actions. These browser dialogs block all further browser events and will prevent the extension from receiving any subsequent commands. Instead, when possible, use console.log for debugging and then use the mcp__claude-in-chrome__read_console_messages tool to read those log messages. If a page has dialog-triggering elements:
1. Avoid clicking buttons or links that may trigger alerts (e.g., "Delete" buttons with confirmation dialogs)
2. If you must interact with such elements, warn the user first that this may interrupt the session
3. Use mcp__claude-in-chrome__javascript_tool to check for and dismiss any existing dialogs before proceeding

If you accidentally trigger a dialog and lose responsiveness, inform the user they need to manually dismiss it in the browser.

## Avoid rabbit holes and loops

When using browser automation tools, stay focused on the specific task. If you encounter any of the following, stop and ask the user for guidance:
- Unexpected complexity or tangential browser exploration
- Browser tool calls failing or returning errors after 2-3 attempts
- No response from the browser extension
- Page elements not responding to clicks or input
- Pages not loading or timing out
- Unable to complete the browser task despite multiple approaches

Explain what you attempted, what went wrong, and ask how the user would like to proceed. Do not keep retrying the same failing browser action or explore unrelated pages without checking in first.

## Tab context and session startup

IMPORTANT: At the start of each browser automation session, call mcp__claude-in-chrome__tabs_context_mcp first to get information about the user's current browser tabs. Use this context to understand what the user might want to work with before creating new tabs.

Never reuse tab IDs from a previous/other session. Follow these guidelines:
1. Only reuse an existing tab if the user explicitly asks to work with it
2. Otherwise, create a new tab with mcp__claude-in-chrome__tabs_create_mcp
3. If a tool returns an error indicating the tab doesn't exist or is invalid, call tabs_context_mcp to get fresh tab IDs
4. When a tab is closed by the user or a navigation error occurs, call tabs_context_mcp to see what tabs are available`
// @from(Ln 372289, Col 4)
kE1 = `**IMPORTANT: Before using any chrome browser tools, you MUST first load them using ToolSearch.**

Chrome browser tools are MCP tools that require loading before use. Before calling any mcp__claude-in-chrome__* tool:
1. Use ToolSearch with \`select:mcp__claude-in-chrome__<tool_name>\` to load the specific tool
2. Then call the tool

For example, to get tab context:
1. First: ToolSearch with query "select:mcp__claude-in-chrome__tabs_context_mcp"
2. Then: Call mcp__claude-in-chrome__tabs_context_mcp`
// @from(Ln 372298, Col 4)
cF8 = '**Browser Automation**: Chrome browser tools are available via the "claude-in-chrome" skill. CRITICAL: Before using any mcp__claude-in-chrome__* tools, invoke the skill by calling the Skill tool with skill: "claude-in-chrome". The skill provides browser automation instructions and enables the tools.'
// @from(Ln 372300, Col 0)
function i4q(A) {
    if (lF8 = A, A && Ni6.length > 0)
        for (let q of Ni6.splice(0)) A(q)
}
// @from(Ln 372305, Col 0)
function iF8(A) {
    if (lF8) lF8(A);
    else if (Ni6.push(A), Ni6.length > lxY) Ni6.shift()
}
// @from(Ln 372310, Col 0)
function EE1(A) {
    return cxY.includes(A)
}
// @from(Ln 372314, Col 0)
function nF8(A, q, K) {
    if (!EE1(K)) return;
    iF8({
        type: "started",
        hookId: A,
        hookName: q,
        hookEvent: K
    })
}
// @from(Ln 372324, Col 0)
function ixY(A) {
    if (!EE1(A.hookEvent)) return;
    if (!t6(process.env.CLAUDE_CODE_REMOTE)) return;
    iF8({
        type: "progress",
        ...A
    })
}
// @from(Ln 372333, Col 0)
function yE1(A) {
    if (!EE1(A.hookEvent)) return () => {};
    if (!t6(process.env.CLAUDE_CODE_REMOTE)) return () => {};
    let q = "",
        K = setInterval(() => {
            A.getOutput().then(({
                stdout: Y,
                stderr: z,
                output: _
            }) => {
                if (_ === q) return;
                q = _, ixY({
                    hookId: A.hookId,
                    hookName: A.hookName,
                    hookEvent: A.hookEvent,
                    stdout: Y,
                    stderr: z,
                    output: _
                })
            })
        }, 1000);
    return K.unref(), () => clearInterval(K)
}
// @from(Ln 372357, Col 0)
function p0(A) {
    let q = A.stdout || A.stderr || A.output;
    if (q) k(`Hook ${A.hookName} (${A.hookEvent}) ${A.outcome}:
${q}`);
    if (!EE1(A.hookEvent)) return;
    iF8({
        type: "response",
        ...A
    })
}
// @from(Ln 372367, Col 4)
cxY
// @from(Ln 372367, Col 9)
lxY = 100
// @from(Ln 372368, Col 4)
Ni6
// @from(Ln 372368, Col 9)
lF8 = null
// @from(Ln 372369, Col 4)
LE1 = E(() => {
    A8();
    H1();
    cxY = ["SessionStart", "Setup"], Ni6 = []
})
// @from(Ln 372375, Col 0)
function n4q({
    processId: A,
    hookId: q,
    asyncResponse: K,
    hookName: Y,
    hookEvent: z,
    command: _,
    shellCommand: w,
    toolName: O,
    pluginId: $
}) {
    let H = K.asyncTimeout || 15000;
    k(`Hooks: Registering async hook ${A} (${Y}) with timeout ${H}ms`);
    let j = yE1({
        hookId: q,
        hookName: Y,
        hookEvent: z,
        getOutput: async () => {
            let J = wF.get(A)?.shellCommand?.taskOutput;
            if (!J) return {
                stdout: "",
                stderr: "",
                output: ""
            };
            let M = await J.getStdout(),
                D = J.getStderr();
            return {
                stdout: M,
                stderr: D,
                output: M + D
            }
        }
    });
    wF.set(A, {
        processId: A,
        hookId: q,
        hookName: Y,
        hookEvent: z,
        toolName: O,
        pluginId: $,
        command: _,
        startTime: Date.now(),
        timeout: H,
        responseAttachmentSent: !1,
        shellCommand: w,
        stopProgressInterval: j
    })
}
// @from(Ln 372423, Col 0)
async function rF8(A, q, K) {
    A.stopProgressInterval();
    let Y = A.shellCommand?.taskOutput,
        z = Y ? await Y.getStdout() : "",
        _ = Y?.getStderr() ?? "";
    A.shellCommand?.cleanup(), p0({
        hookId: A.hookId,
        hookName: A.hookName,
        hookEvent: A.hookEvent,
        output: z + _,
        stdout: z,
        stderr: _,
        exitCode: q,
        outcome: K
    })
}
// @from(Ln 372439, Col 0)
async function r4q() {
    let A = [],
        q = wF.size;
    k(`Hooks: Found ${q} total hooks in registry`);
    let K = Array.from(wF.values()),
        Y = await Promise.allSettled(K.map(async (_) => {
            let w = await _.shellCommand?.taskOutput.getStdout() ?? "",
                O = _.shellCommand?.taskOutput.getStderr() ?? "";
            if (k(`Hooks: Checking hook ${_.processId} (${_.hookName}) - attachmentSent: ${_.responseAttachmentSent}, stdout length: ${w.length}`), !_.shellCommand) return k(`Hooks: Hook ${_.processId} has no shell command, removing from registry`), _.stopProgressInterval(), {
                type: "remove",
                processId: _.processId
            };
            if (k(`Hooks: Hook shell status ${_.shellCommand.status}`), _.shellCommand.status === "killed") return k(`Hooks: Hook ${_.processId} is ${_.shellCommand.status}, removing from registry`), _.stopProgressInterval(), _.shellCommand.cleanup(), {
                type: "remove",
                processId: _.processId
            };
            if (_.shellCommand.status !== "completed") return {
                type: "skip"
            };
            if (_.responseAttachmentSent || !w.trim()) return k(`Hooks: Skipping hook ${_.processId} - already delivered/sent or no stdout`), _.stopProgressInterval(), {
                type: "remove",
                processId: _.processId
            };
            let $ = w.split(`
`);
            k(`Hooks: Processing ${$.length} lines of stdout for ${_.processId}`);
            let j = (await _.shellCommand.result).code,
                J = {};
            for (let M of $)
                if (M.trim().startsWith("{")) {
                    k(`Hooks: Found JSON line: ${M.trim().substring(0,100)}...`);
                    try {
                        let D = i1(M.trim());
                        if (!("async" in D)) {
                            k(`Hooks: Found sync response from ${_.processId}: ${B6(D)}`), J = D;
                            break
                        }
                    } catch {
                        k(`Hooks: Failed to parse JSON from ${_.processId}: ${M.trim()}`)
                    }
                } return _.responseAttachmentSent = !0, await rF8(_, j, j === 0 ? "success" : "error"), {
                type: "response",
                processId: _.processId,
                isSessionStart: _.hookEvent === "SessionStart",
                payload: {
                    processId: _.processId,
                    response: J,
                    hookName: _.hookName,
                    hookEvent: _.hookEvent,
                    toolName: _.toolName,
                    pluginId: _.pluginId,
                    stdout: w,
                    stderr: O,
                    exitCode: j
                }
            }
        })),
        z = !1;
    for (let _ of Y) {
        if (_.status !== "fulfilled") {
            k(`Hooks: checkForAsyncHookResponses callback rejected: ${_.reason}`, {
                level: "error"
            });
            continue
        }
        let w = _.value;
        if (w.type === "remove") wF.delete(w.processId);
        else if (w.type === "response") {
            if (A.push(w.payload), wF.delete(w.processId), w.isSessionStart) z = !0
        }
    }
    if (z) k("Invalidating session env cache after SessionStart hook completed"), g97();
    return k(`Hooks: checkForNewResponses returning ${A.length} responses`), A
}
// @from(Ln 372514, Col 0)
function o4q(A) {
    for (let q of A) {
        let K = wF.get(q);
        if (K && K.responseAttachmentSent) k(`Hooks: Removing delivered hook ${q}`), K.stopProgressInterval(), wF.delete(q)
    }
}
// @from(Ln 372520, Col 0)
async function oF8() {
    let A = Array.from(wF.values());
    await Promise.all(A.map(async (q) => {
        if (q.shellCommand?.status === "completed") {
            let K = await q.shellCommand.result;
            await rF8(q, K.code, K.code === 0 ? "success" : "error")
        } else {
            if (q.shellCommand && q.shellCommand.status !== "killed") q.shellCommand.kill();
            await rF8(q, 1, "cancelled")
        }
    })), wF.clear()
}
// @from(Ln 372532, Col 4)
wF
// @from(Ln 372533, Col 4)
RE1 = E(() => {
    H1();
    D91();
    g1();
    LE1();
    wF = new Map
})
// @from(Ln 372548, Col 0)
async function a4q(A, q, K, Y = []) {
    let z = await AuY(q, K);
    if (z.length === 0) return [];
    let _ = await quY(A, z, K, Y),
        w = new Map(z.map((O) => [O.filename, O]));
    return _.map((O) => w.get(O)).filter((O) => O !== void 0).map((O) => ({
        path: O.filePath,
        mtimeMs: O.mtimeMs
    }))
}
// @from(Ln 372558, Col 0)
async function AuY(A, q) {
    try {
        let Y = (await nxY(A, {
                recursive: !0
            })).filter((O) => O.endsWith(".md") && axY(O) !== "MEMORY.md"),
            _ = (await Promise.allSettled(Y.map(async (O) => {
                let $ = oxY(A, O),
                    H = await rxY($);
                return {
                    relativePath: O,
                    filePath: $,
                    mtimeMs: H.mtimeMs
                }
            }))).filter((O) => O.status === "fulfilled").map((O) => O.value).sort((O, $) => $.mtimeMs - O.mtimeMs).slice(0, sxY);
        return (await Promise.allSettled(_.map(async ({
            relativePath: O,
            filePath: $,
            mtimeMs: H
        }) => {
            let {
                content: j
            } = await h36($, 0, txY, void 0, q), {
                frontmatter: J
            } = BH(j, $);
            return {
                filename: O,
                filePath: $,
                mtimeMs: H,
                description: J.description || null,
                type: S14(J.type)
            }
        }))).filter((O) => O.status === "fulfilled").map((O) => O.value)
    } catch {
        return []
    }
}
// @from(Ln 372594, Col 0)
async function quY(A, q, K, Y) {
    let z = new Set(q.map((O) => O.filename)),
        _ = q.map((O) => {
            let $ = O.type ? `[${O.type}] ` : "",
                H = new Date(O.mtimeMs).toISOString();
            return O.description ? `- ${$}${O.filename} (${H}): ${O.description}` : `- ${$}${O.filename} (${H})`
        }).join(`
`),
        w = Y.length > 0 ? `

Recently used tools: ${Y.join(", ")}` : "";
    try {
        let $ = (await _h({
            model: Ef(),
            system: exY,
            skipSystemPromptPrefix: !0,
            messages: [{
                role: "user",
                content: `Query: ${A}

Available memories:
${_}${w}`
            }],
            max_tokens: 256,
            output_format: {
                type: "json_schema",
                schema: {
                    type: "object",
                    properties: {
                        selected_memories: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        }
                    },
                    required: ["selected_memories"],
                    additionalProperties: !1
                }
            },
            signal: K
        })).content.find((j) => j.type === "text");
        if (!$ || $.type !== "text") return [];
        return i1($.text).selected_memories.filter((j) => z.has(j))
    } catch {
        return []
    }
}
// @from(Ln 372642, Col 4)
sxY = 200
// @from(Ln 372643, Col 4)
txY = 30
// @from(Ln 372644, Col 4)
exY = `You are selecting memories that will be useful to Claude Code as it processes a user's query. You will be given the user's query and a list of available memory files with their filenames and descriptions.

Return a list of filenames for the memories that will clearly be useful to Claude Code as it processes the user's query (up to 5). Only include memories that you are certain will be helpful based on their name and description.
- If you are unsure if a memory will be useful in processing the user's query, then do not include it in your list. Be selective and discerning.
- If there are no memories in the list that would clearly be useful, feel free to return an empty list.
- If a list of recently-used tools is provided, do not select memories that are usage reference or API documentation for those tools (Claude Code is already exercising them). DO still select memories containing warnings, gotchas, or known issues about those tools — active use is exactly when those matter.
`
// @from(Ln 372651, Col 4)
s4q = E(() => {
    tY6();
    z4();
    BG();
    g1();
    jF6();
    eF6()
})