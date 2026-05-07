
// @from(Ln 501121, Col 0)
function KJ7({
    json: q,
    command: K,
    hookName: _,
    toolUseID: z,
    hookEvent: Y,
    expectedHookEvent: A,
    stdout: O,
    stderr: w,
    exitCode: $,
    durationMs: j
}) {
    let H = {},
        J = q;
    if (J.continue === !1) {
        if (H.preventContinuation = !0, J.stopReason) H.stopReason = J.stopReason
    }
    if (q.decision) switch (q.decision) {
        case "approve":
            H.permissionBehavior = "allow";
            break;
        case "block":
            H.permissionBehavior = "deny", H.blockingError = {
                blockingError: q.reason || "Blocked by hook",
                command: K
            };
            break;
        default:
            throw Error(`Unknown hook decision type: ${q.decision}. Valid types are: approve, block`)
    }
    if (q.systemMessage) H.systemMessage = q.systemMessage;
    if (q.hookSpecificOutput?.hookEventName === "PreToolUse" && q.hookSpecificOutput.permissionDecision) switch (q.hookSpecificOutput.permissionDecision) {
        case "allow":
            H.permissionBehavior = "allow";
            break;
        case "deny":
            H.permissionBehavior = "deny", H.blockingError = {
                blockingError: q.reason || "Blocked by hook",
                command: K
            };
            break;
        case "ask":
            H.permissionBehavior = "ask";
            break;
        case "defer":
            H.permissionBehavior = "defer";
            break;
        default:
            throw Error(`Unknown hook permissionDecision type: ${q.hookSpecificOutput.permissionDecision}. Valid types are: allow, deny, ask, defer`)
    }
    if (H.permissionBehavior !== void 0 && q.reason !== void 0) H.hookPermissionDecisionReason = q.reason;
    if (q.hookSpecificOutput) {
        if (A && q.hookSpecificOutput.hookEventName !== A) throw Error(`Hook returned incorrect event name: expected '${A}' but got '${q.hookSpecificOutput.hookEventName}'. Full stdout: ${I6(q,null,2)}`);
        switch (q.hookSpecificOutput.hookEventName) {
            case "PreToolUse":
                if (q.hookSpecificOutput.permissionDecision) switch (q.hookSpecificOutput.permissionDecision) {
                    case "allow":
                        H.permissionBehavior = "allow";
                        break;
                    case "deny":
                        H.permissionBehavior = "deny", H.blockingError = {
                            blockingError: q.hookSpecificOutput.permissionDecisionReason || q.reason || "Blocked by hook",
                            command: K
                        };
                        break;
                    case "ask":
                        H.permissionBehavior = "ask";
                        break;
                    case "defer":
                        H.permissionBehavior = "defer";
                        break
                }
                if (H.hookPermissionDecisionReason = q.hookSpecificOutput.permissionDecisionReason, q.hookSpecificOutput.updatedInput) H.updatedInput = q.hookSpecificOutput.updatedInput;
                H.additionalContext = q.hookSpecificOutput.additionalContext;
                break;
            case "UserPromptSubmit":
                H.additionalContext = q.hookSpecificOutput.additionalContext, H.sessionTitle = q.hookSpecificOutput.sessionTitle;
                break;
            case "SessionStart":
                if (H.additionalContext = q.hookSpecificOutput.additionalContext, H.initialUserMessage = q.hookSpecificOutput.initialUserMessage, "watchPaths" in q.hookSpecificOutput && q.hookSpecificOutput.watchPaths) H.watchPaths = q.hookSpecificOutput.watchPaths;
                break;
            case "Setup":
                H.additionalContext = q.hookSpecificOutput.additionalContext;
                break;
            case "SubagentStart":
                H.additionalContext = q.hookSpecificOutput.additionalContext;
                break;
            case "PostToolUse":
                if (H.additionalContext = q.hookSpecificOutput.additionalContext, q.hookSpecificOutput.updatedMCPToolOutput) H.updatedMCPToolOutput = q.hookSpecificOutput.updatedMCPToolOutput;
                break;
            case "PostToolUseFailure":
                H.additionalContext = q.hookSpecificOutput.additionalContext;
                break;
            case "PermissionDenied":
                H.retry = q.hookSpecificOutput.retry;
                break;
            case "PermissionRequest":
                if (q.hookSpecificOutput.decision) {
                    if (H.permissionRequestResult = q.hookSpecificOutput.decision, H.permissionBehavior = q.hookSpecificOutput.decision.behavior === "allow" ? "allow" : "deny", q.hookSpecificOutput.decision.behavior === "allow" && q.hookSpecificOutput.decision.updatedInput) H.updatedInput = q.hookSpecificOutput.decision.updatedInput
                }
                break;
            case "Elicitation":
                if (q.hookSpecificOutput.action) {
                    if (H.elicitationResponse = {
                            action: q.hookSpecificOutput.action,
                            content: q.hookSpecificOutput.content
                        }, q.hookSpecificOutput.action === "decline") H.blockingError = {
                        blockingError: q.reason || "Elicitation denied by hook",
                        command: K
                    }
                }
                break;
            case "ElicitationResult":
                if (q.hookSpecificOutput.action) {
                    if (H.elicitationResultResponse = {
                            action: q.hookSpecificOutput.action,
                            content: q.hookSpecificOutput.content
                        }, q.hookSpecificOutput.action === "decline") H.blockingError = {
                        blockingError: q.reason || "Elicitation result blocked by hook",
                        command: K
                    }
                }
                break
        }
    }
    return {
        ...H,
        message: H.blockingError ? Y4({
            type: "hook_blocking_error",
            hookName: _,
            toolUseID: z,
            hookEvent: Y,
            blockingError: H.blockingError
        }) : Y4({
            type: "hook_success",
            hookName: _,
            toolUseID: z,
            hookEvent: Y,
            content: "",
            stdout: O,
            stderr: w,
            exitCode: $,
            command: K,
            durationMs: j
        })
    }
}
// @from(Ln 501268, Col 0)
async function Wa8(q, K, _, z, Y, A, O, w, $, j, H, J) {
    let X = K === "SessionStart" || K === "Setup" || K === "SessionEnd",
        M = Date.now(),
        P, W = !1,
        D = y1() === "windows",
        Z = q.shell ?? KG6,
        G = Z === "powershell",
        f = D && !G ? (t) => sX(t) : (t) => t,
        v = c9(),
        V = q.command,
        k;
    for (let [t, Y6] of [
            ["CLAUDE_PLUGIN_ROOT", w || j],
            ["CLAUDE_PLUGIN_DATA", w]
        ]) {
        if (Y6 || !V.includes("${" + t + "}")) continue;
        throw Error(j ? `Hook command references \${${t}} but only \${CLAUDE_PLUGIN_ROOT} is available for skill hooks (\${CLAUDE_PLUGIN_DATA} is plugin-only). Command: ${V}` : `Hook command references \${${t}} but the hook is not associated with a plugin. This variable is only available in hooks defined in a plugin's hooks/hooks.json file, not in settings.json. Command: ${V}`)
    }
    if (w) {
        if (!await a3(w)) throw Error(`Plugin directory does not exist: ${w}` + ($ ? ` (${$} — run /plugin to reinstall)` : ""));
        let t = f(w);
        if (V = V.replaceAll("${CLAUDE_PLUGIN_ROOT}", () => t), $) {
            let Y6 = f(Is($));
            V = V.replaceAll("${CLAUDE_PLUGIN_DATA}", () => Y6)
        }
        if ($) k = ID($), V = I56(V, k)
    }
    if (D && !G && V.trim().match(/\.sh(\s|$|")/)) {
        if (!V.trim().startsWith("bash ")) V = `bash ${V}`
    }
    let N = !G && process.env.CLAUDE_CODE_SHELL_PREFIX ? dU8(process.env.CLAUDE_CODE_SHELL_PREFIX, V) : V,
        R = q.timeout ? q.timeout * 1000 : u_,
        h = {
            ...Dk(),
            CLAUDE_PROJECT_DIR: f(v)
        };
    if (w) {
        if (h.CLAUDE_PLUGIN_ROOT = f(w), $) h.CLAUDE_PLUGIN_DATA = f(Is($))
    }
    if (k)
        for (let [t, Y6] of Object.entries(k)) {
            let X6 = t.replace(/[^A-Za-z0-9_]/g, "_").toUpperCase();
            h[`CLAUDE_PLUGIN_OPTION_${X6}`] = String(Y6)
        }
    if (j) h.CLAUDE_PLUGIN_ROOT = f(j);
    if (!G && (K === "SessionStart" || K === "Setup" || K === "CwdChanged" || K === "FileChanged") && O !== void 0) h.CLAUDE_ENV_FILE = await XC4(K, O);
    let C = b8(),
        x = await a3(C) ? C : Y7();
    if (x !== C) E(`Hooks: cwd ${C} not found, falling back to original cwd`, {
        level: "warn"
    });
    let B;
    if (Z === "powershell") {
        let t = await $e();
        if (!t) throw Error(`Hook "${q.command}" has shell: 'powershell' but no PowerShell executable (pwsh or powershell) was found on PATH. Install PowerShell, or remove "shell": "powershell" to use bash.`);
        B = i65(t, i47(N), {
            env: h,
            cwd: x,
            windowsHide: !0
        })
    } else {
        let t = D ? _Q6() : !0;
        B = i65(N, [], {
            env: h,
            cwd: x,
            shell: t,
            windowsHide: !0
        })
    }
    let m = new uw(`hook_${B.pid}`, null),
        S = nU8(B, Y, R, m),
        F = !1,
        U = !1,
        g = !I7() || O81();
    if ((q.async || q.asyncRewake && g) && !H) {
        let t = `async_hook_${B.pid}`;
        if (E(`Hooks: Config-based async hook, backgrounding process ${t}`), B.stdin.write(z + `
`, "utf8"), B.stdin.end(), U = !0, r65({
                processId: t,
                hookId: A,
                shellCommand: S,
                asyncResponse: {
                    async: !0,
                    asyncTimeout: R
                },
                hookEvent: K,
                hookName: _,
                command: q.command,
                asyncRewake: q.asyncRewake,
                rewakeMessage: q.rewakeMessage,
                rewakeSummary: q.rewakeSummary,
                pluginId: $
            })) return {
            stdout: "",
            stderr: "",
            output: "",
            status: 0,
            backgrounded: !0
        }
    }
    let c = "",
        n = "",
        l = "";
    B.stdout.setEncoding("utf8"), B.stderr.setEncoding("utf8");
    let z6 = !1,
        A6 = null,
        e = new Promise((t) => {
            A6 = t
        }),
        i = new Set,
        O6 = Promise.resolve(),
        J6 = "";
    B.stdout.on("data", (t) => {
        if (c += t, l += t, J) {
            J6 += t;
            let Y6 = J6.split(`
`);
            J6 = Y6.pop() ?? "";
            for (let X6 of Y6) {
                let M6 = X6.trim();
                if (!M6) continue;
                try {
                    let W6 = n8(M6),
                        V6 = f65().safeParse(W6);
                    if (V6.success) {
                        i.add(M6), E(`Hooks: Detected prompt request from hook: ${M6}`);
                        let f6 = V6.data,
                            G6 = J;
                        O6 = O6.then(async () => {
                            try {
                                let k6 = await G6(f6);
                                B.stdin.write(I6(k6) + `
`, "utf8")
                            } catch (k6) {
                                E(`Hooks: Prompt request handling failed: ${k6}`), B.stdin.destroy()
                            }
                        });
                        continue
                    }
                } catch {}
            }
        }
        if (!z6) {
            let Y6 = oY(c).trim();
            if (!Y6.includes("}")) return;
            z6 = !0, E(`Hooks: Checking first line for async: ${Y6}`);
            try {
                let X6 = n8(Y6);
                if (E(`Hooks: Parsed initial response: ${I6(X6)}`), Bn(X6) && !H) {
                    let M6 = `async_hook_${B.pid}`;
                    if (E(`Hooks: Detected async hook, backgrounding process ${M6}`), r65({
                            processId: M6,
                            hookId: A,
                            shellCommand: S,
                            asyncResponse: X6,
                            hookEvent: K,
                            hookName: _,
                            command: q.command,
                            pluginId: $
                        })) F = !0, A6?.({
                        stdout: c,
                        stderr: n,
                        output: l,
                        status: 0
                    })
                } else if (Bn(X6) && H) E("Hooks: Detected async hook but forceSyncExecution is true, waiting for completion");
                else E("Hooks: Initial response is not async, continuing normal processing")
            } catch (X6) {
                E(`Hooks: Failed to parse initial response as JSON: ${X6}`)
            }
        }
    }), B.stderr.on("data", (t) => {
        n += t, l += t
    });
    let $6 = vI8({
            hookId: A,
            hookName: _,
            hookEvent: K,
            getOutput: async () => ({
                stdout: c,
                stderr: n,
                output: l
            })
        }),
        H6 = new Promise((t) => {
            B.stdout.on("end", () => t())
        }),
        q6 = new Promise((t) => {
            B.stderr.on("end", () => t())
        }),
        o = U ? Promise.resolve() : new Promise((t, Y6) => {
            if (B.stdin.on("error", (X6) => {
                    if (!J) Y6(X6);
                    else E(`Hooks: stdin error during prompt flow (likely process exited): ${X6}`)
                }), B.stdin.write(z + `
`, "utf8"), !J) B.stdin.end();
            t()
        }),
        _6 = new Promise((t, Y6) => {
            B.on("error", Y6)
        }),
        r = new Promise((t) => {
            let Y6 = null;
            B.on("close", (X6) => {
                Y6 = X6 ?? 1, Promise.all([H6, q6]).then(() => {
                    let M6 = i.size === 0 ? c : c.split(`
`).filter((W6) => !i.has(W6.trim())).join(`
`);
                    t({
                        stdout: M6,
                        stderr: n,
                        output: l,
                        status: Y6,
                        aborted: Y.aborted
                    })
                })
            })
        });
    try {
        if (X) j1("info", "hook_spawn_started", {
            hook_event_name: K,
            index: O
        });
        await Promise.race([o, _6]);
        let t = await Promise.race([e, r, _6]);
        return await O6, P = t.status, W = t.aborted ?? !1, t
    } catch (t) {
        let Y6 = Q1(t);
        if (P = 1, Y6 === "EPIPE") {
            E("EPIPE error while writing to hook stdin (hook command likely closed early)");
            let X6 = "Hook command closed stdin before hook input was fully written (EPIPE)";
            return {
                stdout: "",
                stderr: X6,
                output: X6,
                status: 1
            }
        } else if (Y6 === "ABORT_ERR") return W = !0, {
            stdout: "",
            stderr: "Hook cancelled",
            output: "Hook cancelled",
            status: 1,
            aborted: !0
        };
        else {
            let M6 = `Error occurred while executing hook command: ${b6(t)}`;
            return {
                stdout: "",
                stderr: M6,
                output: M6,
                status: 1
            }
        }
    } finally {
        if (X) j1("info", "hook_spawn_completed", {
            hook_event_name: K,
            index: O,
            duration_ms: Date.now() - M,
            exit_code: P,
            aborted: W
        });
        if ($6(), !F) S.cleanup()
    }
}
// @from(Ln 501533, Col 0)
function geY(q, K) {
    if (!K || K === "*") return !0;
    if (/^[a-zA-Z0-9_|]+$/.test(K)) {
        if (K.includes("|")) return K.split("|").map((z) => i0(z.trim())).includes(q);
        return q === i0(K)
    }
    try {
        let _ = new RegExp(K);
        if (_.test(q)) return !0;
        for (let z of Ig7(q))
            if (_.test(z)) return !0;
        return !1
    } catch {
        return E(`Invalid regex pattern in hook matcher: ${K}`), !1
    }
}
// @from(Ln 501549, Col 0)
async function UeY(q, K) {
    if (q.hook_event_name !== "PreToolUse" && q.hook_event_name !== "PostToolUse" && q.hook_event_name !== "PostToolUseFailure" && q.hook_event_name !== "PermissionRequest") return;
    let _ = i0(q.tool_name),
        z = K && rK(K, q.tool_name),
        Y = z?.inputSchema.safeParse(q.tool_input),
        A = Y?.success && z?.preparePermissionMatcher ? await z.preparePermissionMatcher(Y.data) : void 0;
    return (O) => {
        let w = h2(O);
        if (i0(w.toolName) !== _) return !1;
        if (!w.ruleContent) return !0;
        return A ? A(w.ruleContent) : !1
    }
}
// @from(Ln 501563, Col 0)
function e65(q) {
    return q.hook.type === "callback" && q.hook.internal === !0
}
// @from(Ln 501567, Col 0)
function Pa8(q, K) {
    return `${q.pluginRoot??q.skillRoot??""}\x00${K}`
}
// @from(Ln 501571, Col 0)
function QeY(q) {
    let K = q.lastIndexOf("@");
    if (K <= 0) return !1;
    let _ = q.slice(K + 1);
    if (vU.has(_)) return !0;
    return !1
}
// @from(Ln 501579, Col 0)
function _J7(q) {
    let K = q.filter((z) => z.pluginId);
    if (K.length === 0) return;
    let _ = {};
    for (let z of K) {
        let Y = QeY(z.pluginId) ? z.pluginId : "third-party";
        _[Y] = (_[Y] || 0) + 1
    }
    return _
}
// @from(Ln 501590, Col 0)
function q85(q) {
    let K = {};
    for (let _ of q) K[_.hook.type] = (K[_.hook.type] || 0) + 1;
    return K
}
// @from(Ln 501596, Col 0)
function deY(q, K, _) {
    let z = [...Rx()?.[_] ?? []],
        Y = Ey(),
        A = Y ? OL6() : null,
        O = rL()?.[_];
    if (O)
        for (let w of O) {
            if (Y && "pluginRoot" in w && !A?.has(w.pluginId)) continue;
            z.push(w)
        }
    if (!Y && q !== void 0) {
        let w = u96(q, K, _).get(_);
        if (w)
            for (let j of w) z.push(j);
        let $ = AJK(q, K, _).get(_);
        if ($)
            for (let j of $) z.push(j)
    }
    return z
}
// @from(Ln 501617, Col 0)
function pn(q, K, _) {
    let z = Rx()?.[q];
    if (z && z.length > 0) return !0;
    let Y = rL()?.[q];
    if (Y && Y.length > 0) return !0;
    if (K?.sessionHooks.get(_)?.hooks[q]) return !0;
    return !1
}
// @from(Ln 501625, Col 0)
async function zJ7(q, K, _, z, Y) {
    try {
        let A = deY(q, K, _),
            O = void 0;
        switch (z.hook_event_name) {
            case "PreToolUse":
            case "PostToolUse":
            case "PostToolUseFailure":
            case "PermissionRequest":
            case "PermissionDenied":
                O = z.tool_name;
                break;
            case "SessionStart":
                O = z.source;
                break;
            case "Setup":
                O = z.trigger;
                break;
            case "PreCompact":
            case "PostCompact":
                O = z.trigger;
                break;
            case "Notification":
                O = z.notification_type;
                break;
            case "SessionEnd":
                O = z.reason;
                break;
            case "StopFailure":
                O = z.error;
                break;
            case "SubagentStart":
                O = z.agent_type;
                break;
            case "SubagentStop":
                O = z.agent_type;
                break;
            case "TeammateIdle":
            case "TaskCreated":
            case "TaskCompleted":
                break;
            case "Elicitation":
                O = z.mcp_server_name;
                break;
            case "ElicitationResult":
                O = z.mcp_server_name;
                break;
            case "ConfigChange":
                O = z.source;
                break;
            case "InstructionsLoaded":
                O = z.load_reason;
                break;
            case "FileChanged":
                O = peY(z.file_path);
                break;
            default:
                break
        }
        E(`Getting matching hook commands for ${_} with query: ${O}`, {
            level: "verbose"
        }), E(`Found ${A.length} hook matchers in settings`, {
            level: "verbose"
        });
        let $ = (O ? A.filter((V) => !V.matcher || geY(O, V.matcher)) : A).flatMap((V) => {
            let k = "pluginRoot" in V ? V.pluginRoot : void 0,
                N = "pluginId" in V ? V.pluginId : void 0,
                R = "skillRoot" in V ? V.skillRoot : void 0,
                h = k ? "pluginName" in V ? `plugin:${V.pluginName}` : "plugin" : R ? "skillName" in V ? `skill:${V.skillName}` : "skill" : "settings";
            return V.hooks.map((C) => ({
                hook: C,
                pluginRoot: k,
                pluginId: N,
                skillRoot: R,
                hookSource: h
            }))
        });
        if ($.every((V) => V.hook.type === "callback" || V.hook.type === "function")) return $;
        let j = (V) => V.if ?? "",
            H = Array.from(new Map($.filter((V) => V.hook.type === "command").map((V) => [Pa8(V, `${V.hook.shell??KG6}\x00${V.hook.command}\x00${j(V.hook)}`), V])).values()),
            J = Array.from(new Map($.filter((V) => V.hook.type === "prompt").map((V) => [Pa8(V, `${V.hook.prompt}\x00${j(V.hook)}`), V])).values()),
            X = Array.from(new Map($.filter((V) => V.hook.type === "agent").map((V) => [Pa8(V, `${V.hook.prompt}\x00${j(V.hook)}`), V])).values()),
            M = Array.from(new Map($.filter((V) => V.hook.type === "http").map((V) => [Pa8(V, `${V.hook.url}\x00${j(V.hook)}`), V])).values()),
            P = $.filter((V) => V.hook.type === "callback"),
            W = $.filter((V) => V.hook.type === "function"),
            D = [...H, ...J, ...X, ...M, ...P, ...W],
            G = D.some((V) => (V.hook.type === "command" || V.hook.type === "prompt" || V.hook.type === "agent" || V.hook.type === "http") && V.hook.if) ? await UeY(z, Y) : void 0,
            f = D.filter((V) => {
                if (V.hook.type !== "command" && V.hook.type !== "prompt" && V.hook.type !== "agent" && V.hook.type !== "http") return !0;
                let k = V.hook.if;
                if (!k) return !0;
                if (!G) return E(`Hook if condition "${k}" cannot be evaluated for non-tool event ${z.hook_event_name}`), !1;
                if (G(k)) return !0;
                return E(`Skipping hook due to if condition "${k}" not matching`), !1
            }),
            v = _ === "SessionStart" || _ === "Setup" ? f.filter((V) => {
                if (V.hook.type === "http") return E(`Skipping HTTP hook ${V.hook.url} — HTTP hooks are not supported for ${_}`), !1;
                return !0
            }) : f;
        return E(`Matched ${v.length} unique hooks for query "${O||"no match query"}" (${$.length} before deduplication)`, {
            level: "verbose"
        }), v
    } catch {
        return []
    }
}
// @from(Ln 501732, Col 0)
function s57(q, K) {
    return `${q} hook error: ${K.blockingError}`
}
// @from(Ln 501736, Col 0)
function zc8(q) {
    return `Stop hook feedback:
${q.blockingError}`
}
// @from(Ln 501741, Col 0)
function W97(q) {
    return `TeammateIdle hook feedback:
${q.blockingError}`
}
// @from(Ln 501746, Col 0)
function m37(q) {
    return `TaskCreated hook feedback:
${q.blockingError}`
}
// @from(Ln 501751, Col 0)
function q38(q) {
    return `TaskCompleted hook feedback:
${q.blockingError}`
}
// @from(Ln 501756, Col 0)
function YJ7(q) {
    return `UserPromptSubmit operation blocked by hook:
${q.blockingError}`
}
// @from(Ln 501760, Col 0)
async function* E0({
    hookInput: q,
    extendedHookInput: K,
    toolUseID: _,
    matchQuery: z,
    signal: Y,
    timeoutMs: A = u_,
    toolUseContext: O,
    messages: w,
    forceSyncExecution: $,
    requestPrompt: j,
    toolInputSummary: H
}) {
    if (Kt()) return;
    if (S6(process.env.CLAUDE_CODE_SIMPLE)) return;
    let J = q.hook_event_name,
        X = z ? `${J}:${z}` : J,
        M = j?.(X, H);
    if (Z66()) {
        E(`Skipping ${X} hook execution - workspace trust not accepted`);
        return
    }
    let P = O ? O.getAppState() : void 0,
        W = O?.agentId ?? I8(),
        D = await zJ7(P, W, J, q, O?.options?.tools);
    if (D.length === 0) return;
    if (Y?.aborted) return;
    let Z = D.filter((S) => !e65(S));
    if (Z.length > 0) {
        let S = _J7(Z),
            F = q85(Z);
        d("tengu_run_hook", {
            hookName: X,
            numCommands: Z.length,
            hookTypeCounts: I6(F),
            ...S && {
                pluginHookCounts: I6(S)
            }
        })
    } else {
        let S = Date.now(),
            F = O ? {
                getAppState: O.getAppState,
                applyAttributionOp: O.applyAttributionOp
            } : void 0;
        for (let [g, {
                hook: c
            }] of D.entries())
            if (c.type === "callback") await c.callback(q, _, Y, g, F);
        let U = Date.now() - S;
        y86()?.observe("hook_duration_ms", U), d("tengu_repl_hook_finished", {
            hookName: X,
            numCommands: D.length,
            numSuccess: D.length,
            numBlocking: 0,
            numNonBlockingError: 0,
            numCancelled: 0,
            totalDurationMs: U
        });
        return
    }
    let G = hJ() ? I6(o65(D)) : "[]";
    if (hJ()) Xz("hook_execution_start", {
        hook_event: J,
        hook_name: X,
        num_hooks: String(D.length),
        managed_only: String(Ey()),
        hook_definitions: G,
        hook_source: Ey() ? "policySettings" : "merged"
    });
    let f = DI4(J, X, D.length, G);
    for (let {
            hook: S
        }
        of D) yield {
        message: {
            type: "progress",
            data: {
                type: "hook_progress",
                hookEvent: J,
                hookName: X,
                command: DL(S),
                ...S.type === "prompt" && {
                    promptText: S.prompt
                },
                ..."statusMessage" in S && S.statusMessage != null && {
                    statusMessage: S.statusMessage
                }
            },
            parentToolUseID: _,
            toolUseID: _,
            timestamp: new Date().toISOString(),
            uuid: Bu6()
        }
    };
    let v = Date.now(),
        V, k;

    function N(S) {
        if (V !== void 0) return V;
        try {
            return V = {
                ok: !0,
                value: I6(q)
            }
        } catch (F) {
            return j6(Error(`Failed to stringify hook ${X} input`, {
                cause: F
            })), V = {
                ok: !1,
                error: F
            }
        }
    }
    let R = D.map(async function*({
            hook: S,
            pluginRoot: F,
            pluginId: U,
            skillRoot: g
        }, c) {
            if (S.type === "callback") {
                let O6 = S.timeout ? S.timeout * 1000 : A,
                    {
                        signal: J6,
                        cleanup: $6
                    } = GL(Y, {
                        timeoutMs: O6
                    });
                yield leY({
                    toolUseID: _,
                    hook: S,
                    hookEvent: J,
                    hookInput: q,
                    signal: J6,
                    hookIndex: c,
                    toolUseContext: O
                }).finally($6);
                return
            }
            if (S.type === "function") {
                if (!w) {
                    yield {
                        message: Y4({
                            type: "hook_error_during_execution",
                            hookName: X,
                            toolUseID: _,
                            hookEvent: J,
                            content: "Messages not provided for function hook"
                        }),
                        outcome: "non_blocking_error",
                        hook: S
                    };
                    return
                }
                yield ceY({
                    hook: S,
                    messages: w,
                    hookName: X,
                    toolUseID: _,
                    hookEvent: J,
                    timeoutMs: A,
                    signal: Y
                });
                return
            }
            let n = S.timeout ? S.timeout * 1000 : A,
                {
                    signal: l,
                    cleanup: z6
                } = GL(Y, {
                    timeoutMs: n
                }),
                A6 = Bu6(),
                e = Date.now(),
                i = DL(S);
            try {
                let O6 = N(U);
                if (!O6.ok) {
                    yield {
                        message: Y4({
                            type: "hook_error_during_execution",
                            hookName: X,
                            toolUseID: _,
                            hookEvent: J,
                            content: `Failed to prepare hook input: ${b6(O6.error)}`,
                            command: i,
                            durationMs: Date.now() - e
                        }),
                        outcome: "non_blocking_error",
                        hook: S
                    }, z6();
                    return
                }
                let J6 = O6.value;
                if (S.type === "prompt") {
                    if (!O) throw Error("ToolUseContext is required for prompt hooks. This is a bug.");
                    let r = await v65(S, X, J, J6, l, O, w, _);
                    if (r.message?.type === "attachment") {
                        let t = r.message.attachment;
                        if (t.type === "hook_success" || t.type === "hook_non_blocking_error") t.command = i, t.durationMs = Date.now() - e
                    }
                    yield r, z6?.();
                    return
                }
                if (S.type === "agent") {
                    if (!O) throw Error("ToolUseContext is required for agent hooks. This is a bug.");
                    if (!w) throw Error("Messages are required for agent hooks. This is a bug.");
                    let r = await k65(S, X, J, J6, l, O, _, w, "agent_type" in q ? q.agent_type : void 0);
                    if (r.message?.type === "attachment") {
                        let t = r.message.attachment;
                        if (t.type === "hook_success" || t.type === "hook_non_blocking_error") t.command = i, t.durationMs = Date.now() - e
                    }
                    yield r, z6?.();
                    return
                }
                if (S.type === "http") {
                    Yi1(A6, X, J);
                    let r = await tH7(S, J, J6, Y);
                    if (z6?.(), r.aborted) {
                        df({
                            hookId: A6,
                            hookName: X,
                            hookEvent: J,
                            output: "Hook cancelled",
                            stdout: "",
                            stderr: "",
                            exitCode: void 0,
                            outcome: "cancelled"
                        }), yield {
                            message: Y4({
                                type: "hook_cancelled",
                                hookName: X,
                                toolUseID: _,
                                hookEvent: J
                            }),
                            outcome: "cancelled",
                            hook: S
                        };
                        return
                    }
                    if (r.error || !r.ok) {
                        let X6 = r.error || `HTTP ${r.statusCode} from ${S.url}`;
                        df({
                            hookId: A6,
                            hookName: X,
                            hookEvent: J,
                            output: X6,
                            stdout: "",
                            stderr: X6,
                            exitCode: r.statusCode,
                            outcome: "error"
                        }), yield {
                            message: Y4({
                                type: "hook_non_blocking_error",
                                hookName: X,
                                toolUseID: _,
                                hookEvent: J,
                                stderr: X6,
                                stdout: "",
                                exitCode: r.statusCode ?? 0
                            }),
                            outcome: "non_blocking_error",
                            hook: S
                        };
                        return
                    }
                    let {
                        json: t,
                        validationError: Y6
                    } = t65(r.body);
                    if (Y6) {
                        df({
                            hookId: A6,
                            hookName: X,
                            hookEvent: J,
                            output: r.body,
                            stdout: r.body,
                            stderr: Y6,
                            exitCode: r.statusCode,
                            outcome: "error"
                        }), yield {
                            message: Y4({
                                type: "hook_non_blocking_error",
                                hookName: X,
                                toolUseID: _,
                                hookEvent: J,
                                stderr: Y6,
                                stdout: r.body,
                                exitCode: r.statusCode ?? 0
                            }),
                            outcome: "non_blocking_error",
                            hook: S
                        };
                        return
                    }
                    if (t && Bn(t)) {
                        df({
                            hookId: A6,
                            hookName: X,
                            hookEvent: J,
                            output: r.body,
                            stdout: r.body,
                            stderr: "",
                            exitCode: r.statusCode,
                            outcome: "success"
                        }), yield {
                            outcome: "success",
                            hook: S
                        };
                        return
                    }
                    if (t) {
                        let X6 = KJ7({
                            json: t,
                            command: S.url,
                            hookName: X,
                            toolUseID: _,
                            hookEvent: J,
                            expectedHookEvent: J,
                            stdout: r.body,
                            stderr: "",
                            exitCode: r.statusCode
                        });
                        df({
                            hookId: A6,
                            hookName: X,
                            hookEvent: J,
                            output: r.body,
                            stdout: r.body,
                            stderr: "",
                            exitCode: r.statusCode,
                            outcome: "success"
                        }), yield {
                            ...X6,
                            outcome: "success",
                            hook: S
                        };
                        return
                    }
                    return
                }
                Yi1(A6, X, J);
                let $6 = await Wa8(S, J, X, J6, l, A6, c, F, U, g, $, M);
                z6?.();
                let H6 = Date.now() - e;
                if ($6.backgrounded) {
                    yield {
                        outcome: "success",
                        hook: S
                    };
                    return
                }
                if ($6.aborted) {
                    df({
                        hookId: A6,
                        hookName: X,
                        hookEvent: J,
                        output: $6.output,
                        stdout: $6.stdout,
                        stderr: $6.stderr,
                        exitCode: $6.status,
                        outcome: "cancelled"
                    }), yield {
                        message: Y4({
                            type: "hook_cancelled",
                            hookName: X,
                            toolUseID: _,
                            hookEvent: J,
                            command: i,
                            durationMs: H6
                        }),
                        outcome: "cancelled",
                        hook: S
                    };
                    return
                }
                let {
                    json: q6,
                    plainText: o,
                    validationError: _6
                } = s65($6.stdout);
                if (_6) {
                    df({
                        hookId: A6,
                        hookName: X,
                        hookEvent: J,
                        output: $6.output,
                        stdout: $6.stdout,
                        stderr: _6,
                        exitCode: 1,
                        outcome: "error"
                    }), yield {
                        message: Y4({
                            type: "hook_non_blocking_error",
                            hookName: X,
                            toolUseID: _,
                            hookEvent: J,
                            stderr: _6,
                            stdout: $6.stdout,
                            exitCode: 1,
                            command: i,
                            durationMs: H6
                        }),
                        outcome: "non_blocking_error",
                        hook: S
                    };
                    return
                }
                if (q6) {
                    if (Bn(q6)) {
                        yield {
                            outcome: "success",
                            hook: S
                        };
                        return
                    }
                    let r = KJ7({
                        json: q6,
                        command: i,
                        hookName: X,
                        toolUseID: _,
                        hookEvent: J,
                        expectedHookEvent: J,
                        stdout: $6.stdout,
                        stderr: $6.stderr,
                        exitCode: $6.status,
                        durationMs: H6
                    });
                    if (bu(q6) && !q6.suppressOutput && o && $6.status === 0) {
                        let t = `${Y8.bold(X)} completed`;
                        df({
                            hookId: A6,
                            hookName: X,
                            hookEvent: J,
                            output: $6.output,
                            stdout: $6.stdout,
                            stderr: $6.stderr,
                            exitCode: $6.status,
                            outcome: "success"
                        }), yield {
                            ...r,
                            message: r.message || Y4({
                                type: "hook_success",
                                hookName: X,
                                toolUseID: _,
                                hookEvent: J,
                                content: t,
                                stdout: $6.stdout,
                                stderr: $6.stderr,
                                exitCode: $6.status,
                                command: i,
                                durationMs: H6
                            }),
                            outcome: "success",
                            hook: S
                        };
                        return
                    }
                    if ($6.status === 2 && !r.blockingError) r.blockingError = {
                        blockingError: `[${S.command}]: ${$6.stderr||"No stderr output"}`,
                        command: S.command
                    };
                    df({
                        hookId: A6,
                        hookName: X,
                        hookEvent: J,
                        output: $6.output,
                        stdout: $6.stdout,
                        stderr: $6.stderr,
                        exitCode: $6.status,
                        outcome: $6.status === 0 ? "success" : "error"
                    }), yield {
                        ...r,
                        outcome: r.blockingError ? "blocking" : "success",
                        hook: S
                    };
                    return
                }
                if ($6.status === 0) {
                    df({
                        hookId: A6,
                        hookName: X,
                        hookEvent: J,
                        output: $6.output,
                        stdout: $6.stdout,
                        stderr: $6.stderr,
                        exitCode: $6.status,
                        outcome: "success"
                    });
                    let r = await Vz8($6.stdout.trim(), A6, "stdout");
                    yield {
                        message: Y4({
                            type: "hook_success",
                            hookName: X,
                            toolUseID: _,
                            hookEvent: J,
                            content: r,
                            stdout: $6.stdout,
                            stderr: $6.stderr,
                            exitCode: $6.status,
                            command: i,
                            durationMs: H6
                        }),
                        outcome: "success",
                        hook: S
                    };
                    return
                }
                if ($6.status === 2) {
                    df({
                        hookId: A6,
                        hookName: X,
                        hookEvent: J,
                        output: $6.output,
                        stdout: $6.stdout,
                        stderr: $6.stderr,
                        exitCode: $6.status,
                        outcome: "error"
                    }), yield {
                        blockingError: {
                            blockingError: `[${S.command}]: ${$6.stderr||"No stderr output"}`,
                            command: S.command
                        },
                        outcome: "blocking",
                        hook: S
                    };
                    return
                }
                df({
                    hookId: A6,
                    hookName: X,
                    hookEvent: J,
                    output: $6.output,
                    stdout: $6.stdout,
                    stderr: $6.stderr,
                    exitCode: $6.status,
                    outcome: "error"
                }), yield {
                    message: Y4({
                        type: "hook_non_blocking_error",
                        hookName: X,
                        toolUseID: _,
                        hookEvent: J,
                        stderr: `Failed with non-blocking status code: ${$6.stderr.trim()||"No stderr output"}`,
                        stdout: $6.stdout,
                        exitCode: $6.status,
                        command: i,
                        durationMs: H6
                    }),
                    outcome: "non_blocking_error",
                    hook: S
                };
                return
            } catch (O6) {
                z6?.();
                let J6 = O6 instanceof Error ? O6.message : String(O6);
                df({
                    hookId: A6,
                    hookName: X,
                    hookEvent: J,
                    output: `Failed to run: ${J6}`,
                    stdout: "",
                    stderr: `Failed to run: ${J6}`,
                    exitCode: 1,
                    outcome: "error"
                }), yield {
                    message: Y4({
                        type: "hook_non_blocking_error",
                        hookName: X,
                        toolUseID: _,
                        hookEvent: J,
                        stderr: `Failed to run: ${J6}`,
                        stdout: "",
                        exitCode: 1,
                        command: i,
                        durationMs: Date.now() - e
                    }),
                    outcome: "non_blocking_error",
                    hook: S
                };
                return
            }
        }),
        h = {
            success: 0,
            blocking: 0,
            non_blocking_error: 0,
            cancelled: 0
        },
        C = {
            additionalContextChars: 0,
            systemMessageChars: 0,
            initialUserMessageChars: 0,
            hookSuccessStdoutChars: 0
        },
        x = 0,
        B;
    for await (let S of hu8(R)) {
        if (h[S.outcome]++, S.message?.type === "attachment" && S.message.attachment.type === "hook_success") C.hookSuccessStdoutChars += S.message.attachment.stdout?.length ?? 0;
        if (S.preventContinuation) E(`Hook ${J} (${DL(S.hook)}) requested preventContinuation`), yield {
            preventContinuation: !0,
            stopReason: S.stopReason
        };
        if (S.blockingError) yield {
            blockingError: S.blockingError
        }, B = "deny";
        if (S.message) yield {
            message: S.message
        };
        if (x++, S.systemMessage) {
            C.systemMessageChars += S.systemMessage.length;
            let F = await Vz8(S.systemMessage, `${_}-${x}`, "systemMessage");
            yield {
                message: Y4({
                    type: "hook_system_message",
                    content: F,
                    hookName: X,
                    toolUseID: _,
                    hookEvent: J
                })
            }
        }
        if (S.additionalContext) C.additionalContextChars += S.additionalContext.length, E(`Hook ${J} (${DL(S.hook)}) provided additionalContext (${S.additionalContext.length} chars)`), yield {
            additionalContexts: [await Vz8(S.additionalContext, `${_}-${x}`, "additionalContext")]
        };
        if (S.initialUserMessage) C.initialUserMessageChars += S.initialUserMessage.length, E(`Hook ${J} (${DL(S.hook)}) provided initialUserMessage (${S.initialUserMessage.length} chars)`), yield {
            initialUserMessage: await Vz8(S.initialUserMessage, `${_}-${x}`, "initialUserMessage")
        };
        if (S.watchPaths && S.watchPaths.length > 0) E(`Hook ${J} (${DL(S.hook)}) provided ${S.watchPaths.length} watchPaths`), yield {
            watchPaths: S.watchPaths
        };
        if (S.sessionTitle) E(`Hook ${J} (${DL(S.hook)}) provided sessionTitle (${[...S.sessionTitle].length} chars)`), yield {
            sessionTitle: S.sessionTitle
        };
        if (S.updatedMCPToolOutput) E(`Hook ${J} (${DL(S.hook)}) replaced MCP tool output`), yield {
            updatedMCPToolOutput: S.updatedMCPToolOutput
        };
        if (S.permissionBehavior) switch (E(`Hook ${J} (${DL(S.hook)}) returned permissionDecision: ${S.permissionBehavior}${S.hookPermissionDecisionReason?` (reason: ${S.hookPermissionDecisionReason})`:""}`), S.permissionBehavior) {
            case "deny":
                B = "deny";
                break;
            case "defer":
                if (B !== "deny") B = "defer";
                break;
            case "ask":
                if (B !== "deny" && B !== "defer") B = "ask";
                break;
            case "allow":
                if (!B) B = "allow";
                break;
            case "passthrough":
                break
        }
        if (S.permissionBehavior && B === S.permissionBehavior) {
            let F = S.updatedInput && (S.permissionBehavior === "allow" || S.permissionBehavior === "ask") ? S.updatedInput : void 0;
            if (F) E(`Hook ${J} (${DL(S.hook)}) modified tool input keys: [${Object.keys(F).join(", ")}]`);
            yield {
                permissionBehavior: B,
                hookPermissionDecisionReason: S.hookPermissionDecisionReason,
                hookSource: D.find((U) => U.hook === S.hook)?.hookSource,
                updatedInput: F
            }
        }
        if (S.updatedInput && S.permissionBehavior === void 0) E(`Hook ${J} (${DL(S.hook)}) modified tool input keys: [${Object.keys(S.updatedInput).join(", ")}]`), yield {
            updatedInput: S.updatedInput
        };
        if (S.permissionRequestResult) yield {
            permissionRequestResult: S.permissionRequestResult
        };
        if (S.retry) yield {
            retry: S.retry
        };
        if (S.elicitationResponse) yield {
            elicitationResponse: S.elicitationResponse
        };
        if (S.elicitationResultResponse) yield {
            elicitationResultResponse: S.elicitationResultResponse
        };
        if (P && S.hook.type !== "callback") {
            let F = I8(),
                g = OJK(P, F, J, z ?? "", S.hook);
            if (g?.onHookSuccess && S.outcome === "success") try {
                g.onHookSuccess(S.hook, S)
            } catch (c) {
                j6(Error("Session hook success callback failed", {
                    cause: c
                }))
            }
        }
    }
    let m = Date.now() - v;
    if (y86()?.observe("hook_duration_ms", m), d("tengu_repl_hook_finished", {
            hookName: X,
            numCommands: D.length,
            numSuccess: h.success,
            numBlocking: h.blocking,
            numNonBlockingError: h.non_blocking_error,
            numCancelled: h.cancelled,
            totalDurationMs: m,
            ...C
        }), hJ()) {
        let S = o65(D);
        Xz("hook_execution_complete", {
            hook_event: J,
            hook_name: X,
            num_hooks: String(D.length),
            num_success: String(h.success),
            num_blocking: String(h.blocking),
            num_non_blocking_error: String(h.non_blocking_error),
            num_cancelled: String(h.cancelled),
            managed_only: String(Ey()),
            hook_definitions: I6(S),
            hook_source: Ey() ? "policySettings" : "merged"
        })
    }
    ZI4(f, {
        numSuccess: h.success,
        numBlocking: h.blocking,
        numNonBlockingError: h.non_blocking_error,
        numCancelled: h.cancelled
    })
}
// @from(Ln 502483, Col 0)
function UE6(q) {
    return q.some((K) => K.blocked)
}
// @from(Ln 502486, Col 0)
async function BX({
    getAppState: q,
    hookInput: K,
    matchQuery: _,
    signal: z,
    timeoutMs: Y = u_
}) {
    if (S6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let A = K.hook_event_name,
        O = _ ? `${A}:${_}` : A;
    if (Kt()) return E(`Skipping hooks for ${O} due to 'disableAllHooks' managed setting`), [];
    if (Z66()) return E(`Skipping ${O} hook execution - workspace trust not accepted`), [];
    let w = q ? q() : void 0,
        $ = I8(),
        j = await zJ7(w, $, A, K);
    if (j.length === 0) return [];
    if (z?.aborted) return [];
    let H = j.filter((M) => !e65(M));
    if (H.length > 0) {
        let M = _J7(H),
            P = q85(H);
        d("tengu_run_hook", {
            hookName: O,
            numCommands: H.length,
            hookTypeCounts: I6(P),
            ...M && {
                pluginHookCounts: I6(M)
            }
        })
    }
    let J;
    try {
        J = I6(K)
    } catch (M) {
        return j6(M), []
    }
    let X = j.map(async ({
        hook: M,
        pluginRoot: P,
        pluginId: W,
        skillRoot: D
    }, Z) => {
        if (M.type === "callback") {
            let V = M.timeout ? M.timeout * 1000 : Y,
                {
                    signal: k,
                    cleanup: N
                } = GL(z, {
                    timeoutMs: V
                });
            try {
                let R = Bu6(),
                    h = await M.callback(K, R, k, Z);
                if (N?.(), Bn(h)) return E(`${O} [callback] returned async response, returning empty output`), {
                    command: "callback",
                    succeeded: !0,
                    output: "",
                    blocked: !1
                };
                let C = A === "WorktreeCreate" && bu(h) && h.hookSpecificOutput?.hookEventName === "WorktreeCreate" ? h.hookSpecificOutput.worktreePath : h.systemMessage || "",
                    x = bu(h) && h.decision === "block";
                return E(`${O} [callback] completed successfully`), {
                    command: "callback",
                    succeeded: !0,
                    output: C,
                    blocked: x
                }
            } catch (R) {
                N?.();
                let h = R instanceof Error ? R.message : String(R);
                return E(`${O} [callback] failed to run: ${h}`, {
                    level: "error"
                }), {
                    command: "callback",
                    succeeded: !1,
                    output: h,
                    blocked: !1
                }
            }
        }
        if (M.type === "prompt") return {
            command: M.prompt,
            succeeded: !1,
            output: "Prompt stop hooks are not yet supported outside REPL",
            blocked: !1
        };
        if (M.type === "agent") return {
            command: M.prompt,
            succeeded: !1,
            output: "Agent stop hooks are not yet supported outside REPL",
            blocked: !1
        };
        if (M.type === "function") return j6(Error(`Function hook reached executeHooksOutsideREPL for ${A}. Function hooks should only be used in REPL context (Stop hooks).`)), {
            command: "function",
            succeeded: !1,
            output: "Internal error: function hook executed outside REPL context",
            blocked: !1
        };
        if (M.type === "http") try {
            let V = await tH7(M, A, J, z);
            if (V.aborted) return E(`${O} [${M.url}] cancelled`), {
                command: M.url,
                succeeded: !1,
                output: "Hook cancelled",
                blocked: !1
            };
            if (V.error || !V.ok) {
                let C = V.error || `HTTP ${V.statusCode} from ${M.url}`;
                return E(`${O} [${M.url}] failed: ${C}`, {
                    level: "error"
                }), {
                    command: M.url,
                    succeeded: !1,
                    output: C,
                    blocked: !1
                }
            }
            let {
                json: k,
                validationError: N
            } = t65(V.body);
            if (N) throw Error(N);
            if (k && !Bn(k)) E(`Parsed JSON output from HTTP hook: ${I6(k)}`, {
                level: "verbose"
            });
            let R = k && bu(k) && k.decision === "block",
                h = R ? k && bu(k) && k.reason || "" : A === "WorktreeCreate" ? k && bu(k) && k.hookSpecificOutput?.hookEventName === "WorktreeCreate" ? k.hookSpecificOutput.worktreePath : "" : V.body;
            return {
                command: M.url,
                succeeded: !0,
                output: h,
                blocked: !!R
            }
        } catch (V) {
            let k = V instanceof Error ? V.message : String(V);
            return E(`${O} [${M.url}] failed to run: ${k}`, {
                level: "error"
            }), {
                command: M.url,
                succeeded: !1,
                output: k,
                blocked: !1
            }
        }
        let G = M.timeout ? M.timeout * 1000 : Y,
            {
                signal: f,
                cleanup: v
            } = GL(z, {
                timeoutMs: G
            });
        try {
            let V = await Wa8(M, A, O, J, f, Bu6(), Z, P, W, D);
            if (v?.(), V.aborted) return E(`${O} [${M.command}] cancelled`), {
                command: M.command,
                succeeded: !1,
                output: "Hook cancelled",
                blocked: !1
            };
            E(`${O} [${M.command}] completed with status ${V.status}`);
            let {
                json: k,
                validationError: N
            } = s65(V.stdout);
            if (N) throw Error(N);
            if (k && !Bn(k)) E(`Parsed JSON output from hook: ${I6(k)}`, {
                level: "verbose"
            });
            let R = k && bu(k) && k.decision === "block",
                h = V.status === 2 || !!R,
                C = R ? k && bu(k) && k.reason || V.stderr || "" : V.status === 0 ? V.stdout || "" : V.stderr || "",
                x = k && bu(k) && k.hookSpecificOutput && "watchPaths" in k.hookSpecificOutput ? k.hookSpecificOutput.watchPaths : void 0,
                B = k && bu(k) ? k.systemMessage : void 0;
            return {
                command: M.command,
                succeeded: V.status === 0,
                output: C,
                blocked: h,
                watchPaths: x,
                systemMessage: B
            }
        } catch (V) {
            v?.();
            let k = V instanceof Error ? V.message : String(V);
            return E(`${O} [${M.command}] failed to run: ${k}`, {
                level: "error"
            }), {
                command: M.command,
                succeeded: !1,
                output: k,
                blocked: !1
            }
        }
    });
    return await Promise.all(X)
}
// @from(Ln 502683, Col 0)
function de6() {
    let q = Rx()?.InstructionsLoaded;
    if (q && q.length > 0) return !0;
    let K = rL()?.InstructionsLoaded;
    if (K && K.length > 0) return !0;
    return !1
}
// @from(Ln 502691, Col 0)
function Ja8(q, K) {
    if (q.blocked && !q.succeeded) return {
        blockingError: {
            blockingError: q.output || "Elicitation blocked by hook",
            command: q.command
        }
    };
    if (!q.output.trim()) return {};
    let _ = q.output.trim();
    if (!_.startsWith("{")) return {};
    try {
        let z = xu6().parse(JSON.parse(_));
        if (Bn(z)) return {};
        if (!bu(z)) return {};
        if (z.decision === "block" || q.blocked) return {
            blockingError: {
                blockingError: z.reason || "Elicitation blocked by hook",
                command: q.command
            }
        };
        let Y = z.hookSpecificOutput;
        if (!Y || Y.hookEventName !== K) return {};
        if (!Y.action) return {};
        let O = {
            response: {
                action: Y.action,
                content: Y.content
            }
        };
        if (Y.action === "decline") O.blockingError = {
            blockingError: z.reason || (K === "Elicitation" ? "Elicitation denied by hook" : "Elicitation result blocked by hook"),
            command: q.command
        };
        return O
    } catch {
        return {}
    }
}
// @from(Ln 502729, Col 0)
async function AJ7(q, K, _ = 5000, z = !1) {
    if (Kt()) return;
    if (Z66()) {
        E("Skipping StatusLine command execution - workspace trust not accepted");
        return
    }
    let Y;
    if (Ey()) Y = E1("policySettings")?.statusLine;
    else Y = y7()?.statusLine;
    if (!Y || Y.type !== "command") return;
    let A = K || AbortSignal.timeout(_);
    try {
        let O = I6(q),
            w = await Wa8(Y, "StatusLine", "statusLine", O, A, Bu6());
        if (w.aborted) return;
        if (w.status === 0) {
            let $ = w.stdout.trim().split(`
`).flatMap((j) => j.trim() || []).join(`
`);
            if ($) {
                if (z) E(`StatusLine [${Y.command}] completed with status ${w.status}`);
                return $
            }
        } else if (z) E(`StatusLine [${Y.command}] completed with status ${w.status}`, {
            level: "warn"
        });
        return
    } catch (O) {
        E(`Status hook failed: ${O}`, {
            level: "error"
        });
        return
    }
}
// @from(Ln 502763, Col 0)
async function IA7(q, K, _ = 5000) {
    if (Kt()) return [];
    if (Z66()) return E("Skipping FileSuggestion command execution - workspace trust not accepted"), [];
    let z;
    if (Ey()) z = E1("policySettings")?.fileSuggestion;
    else z = y7()?.fileSuggestion;
    if (!z || z.type !== "command") return [];
    let Y = K || AbortSignal.timeout(_);
    try {
        let A = I6(q),
            O = {
                type: "command",
                command: z.command
            },
            w = await Wa8(O, "FileSuggestion", "FileSuggestion", A, Y, Bu6());
        if (w.aborted || w.status !== 0) return [];
        return w.stdout.split(`
`).map(($) => $.trim()).filter(Boolean)
    } catch (A) {
        return E(`File suggestion helper failed: ${A}`, {
            level: "error"
        }), []
    }
}
// @from(Ln 502787, Col 0)
async function ceY({
    hook: q,
    messages: K,
    hookName: _,
    toolUseID: z,
    hookEvent: Y,
    timeoutMs: A,
    signal: O
}) {
    let w = q.timeout ?? A,
        {
            signal: $,
            cleanup: j
        } = GL(O, {
            timeoutMs: w
        });
    try {
        if ($.aborted) return j(), {
            outcome: "cancelled",
            hook: q
        };
        let H = await new Promise((J, X) => {
            let M = () => X(Error("Function hook cancelled"));
            $.addEventListener("abort", M), Promise.resolve(q.callback(K, $)).then((P) => {
                $.removeEventListener("abort", M), J(P)
            }).catch((P) => {
                $.removeEventListener("abort", M), X(P)
            })
        });
        if (j(), H) return {
            outcome: "success",
            hook: q
        };
        return {
            blockingError: {
                blockingError: q.errorMessage,
                command: "function"
            },
            outcome: "blocking",
            hook: q
        }
    } catch (H) {
        if (j(), H instanceof Error && (H.message === "Function hook cancelled" || H.name === "AbortError")) return {
            outcome: "cancelled",
            hook: q
        };
        return j6(H), {
            message: Y4({
                type: "hook_error_during_execution",
                hookName: _,
                toolUseID: z,
                hookEvent: Y,
                content: H instanceof Error ? H.message : "Function hook execution error"
            }),
            outcome: "non_blocking_error",
            hook: q
        }
    }
}
// @from(Ln 502846, Col 0)
async function leY({
    toolUseID: q,
    hook: K,
    hookEvent: _,
    hookInput: z,
    signal: Y,
    hookIndex: A,
    toolUseContext: O
}) {
    let w = O ? {
            getAppState: O.getAppState,
            applyAttributionOp: O.applyAttributionOp
        } : void 0,
        $ = await K.callback(z, q, Y, A, w);
    if (Bn($)) return {
        outcome: "success",
        hook: K
    };
    return {
        ...KJ7({
            json: $,
            command: "callback",
            hookName: `${_}:Callback`,
            toolUseID: q,
            hookEvent: _,
            expectedHookEvent: _,
            stdout: void 0,
            stderr: void 0,
            exitCode: void 0
        }),
        outcome: "success",
        hook: K
    }
}
// @from(Ln 502881, Col 0)
function NW6() {
    let q = Rx()?.WorktreeCreate;
    if (q && q.length > 0) return !0;
    let K = rL()?.WorktreeCreate;
    if (!K || K.length === 0) return !1;
    let _ = Ey(),
        z = _ ? OL6() : null;
    return K.some((Y) => !(_ && ("pluginRoot" in Y) && !z?.has(Y.pluginId)))
}
// @from(Ln 502891, Col 0)
function o65(q) {
    return q.map(({
        hook: K
    }) => {
        if (K.type === "command") return {
            type: "command",
            command: K.command
        };
        else if (K.type === "prompt") return {
            type: "prompt",
            prompt: K.prompt
        };
        else if (K.type === "http") return {
            type: "http",
            command: K.url
        };
        else if (K.type === "function") return {
            type: "function",
            name: "function"
        };
        else if (K.type === "callback") return {
            type: "callback",
            name: "callback"
        };
        return {
            type: "unknown"
        }
    })
}
// @from(Ln 502920, Col 4)
u_ = 600000
// @from(Ln 502921, Col 4)
Xa8 = 1500
// @from(Ln 502922, Col 4)
FeY = 60000
// @from(Ln 502923, Col 4)
K9 = L(() => {
    eK();
    t47();
    hb6();
    n7();
    c47();
    oH6();
    zy();
    NK();
    rC();
    Rb6();
    JX8();
    r47();
    Gx();
    Jy();
    iK6();
    y8();
    h1();
    Bc();
    g4();
    a1();
    C8();
    uf();
    Hv();
    Qc();
    sH7();
    ND();
    Y3();
    Wu6();
    K8();
    VA();
    cZ();
    U8();
    uu6();
    TI8();
    b$();
    _7();
    rA();
    o88();
    ZM();
    EJ6();
    gq();
    T65();
    N65();
    C65();
    ty();
    e8();
    Q8();
    m8();
    n65()
})
// @from(Ln 502974, Col 4)
M85 = {}
// @from(Ln 503021, Col 0)
function kz8(q) {
    Rn1(q), u2((K) => ({
        ...K,
        activeWorktreeSession: q ?? void 0
    }))
}
// @from(Ln 503028, Col 0)
function YI6(q) {
    if (q.length > K85) throw Error(`Invalid worktree name: must be ${K85} characters or fewer (got ${q.length})`);
    for (let K of q.split("/")) {
        if (K === "." || K === "..") throw Error(`Invalid worktree name "${q}": must not contain "." or ".." path segments`);
        if (!oeY.test(K)) throw Error(`Invalid worktree name "${q}": each "/"-separated segment must be non-empty and contain only letters, digits, dots, underscores, and dashes`)
    }
}
// @from(Ln 503035, Col 0)
async function aeY(q) {
    await OJ7(q, {
        recursive: !0
    })
}
// @from(Ln 503040, Col 0)
async function seY(q, K, _) {
    for (let z of _) {
        if (MU(z)) {
            E(`Skipping symlink for "${z}": path traversal detected`, {
                level: "warn"
            });
            continue
        }
        let Y = WN(q, z),
            A = WN(K, z);
        try {
            await neY(Y, A, "dir"), E(`Symlinked ${z} from main repository to worktree to avoid disk bloat`)
        } catch (O) {
            let w = Q1(O);
            if (w !== "ENOENT" && w !== "EEXIST") E(`Failed to symlink ${z} (${w??"unknown"}): ${b6(O)}`, {
                level: "warn"
            })
        }
    }
}
// @from(Ln 503061, Col 0)
function fa8(q) {
    Rn1(q)
}
// @from(Ln 503065, Col 0)
function Ga8(q, K) {
    return `${Za8(q)}_${K}`.replace(/[/.]/g, "_")
}
// @from(Ln 503069, Col 0)
function jJ7(q) {
    return WN(q, ".claude", "worktrees")
}
// @from(Ln 503073, Col 0)
function $85(q) {
    return q.replaceAll("/", "+")
}
// @from(Ln 503077, Col 0)
function EW6(q) {
    return `worktree-${$85(q)}`
}
// @from(Ln 503081, Col 0)
function j85(q, K) {
    return WN(jJ7(q), $85(K))
}
// @from(Ln 503084, Col 0)
async function HJ7(q) {
    try {
        let K = (await wJ7(WN(q, ".git"), "utf-8")).trim();
        if (!K.startsWith("gitdir:")) return null;
        return w85(q, K.slice(7).trim())
    } catch {
        return null
    }
}
// @from(Ln 503093, Col 0)
async function teY(q, K) {
    let _ = await HJ7(q);
    if (!_) {
        E(`[worktree] cannot write baseline: gitdir unresolvable for ${q}`);
        return
    }
    try {
        await reY(WN(_, H85), K, "utf-8")
    } catch (z) {
        E(`[worktree] failed to write baseline to ${_}: ${z}`)
    }
}
// @from(Ln 503105, Col 0)
async function eeY(q) {
    let K = await HJ7(q);
    if (!K) return null;
    try {
        let _ = (await wJ7(WN(K, H85), "utf-8")).trim();
        return lf6(_) ? _ : null
    } catch {
        return null
    }
}
// @from(Ln 503115, Col 0)
async function JJ7(q, K, _) {
    let z = j85(q, K),
        Y = EW6(K),
        A = await bA1(z);
    if (A) {
        let P = await eeY(z);
        return {
            worktreePath: z,
            worktreeBranch: Y,
            headCommit: P ?? A,
            existed: !0
        }
    }
    let O = await HJ7(z);
    if (O) {
        let P = !1;
        try {
            await z85(O)
        } catch (W) {
            P = t1(W)
        }
        if (P) {
            let W = await M7(D7(), ["remote"], {
                cwd: q
            });
            if (W.code !== 0) throw Error(`Orphaned worktree dir at ${z} but \`git remote\` failed (${W.stderr.trim()}) — refusing to self-heal. Remove ${z} manually if it has no work to keep.`);
            let D = await M7(D7(), ["rev-parse", "--verify", "--quiet", Y], {
                cwd: q
            });
            if (D.code !== 0 && D.stderr.trim().length > 0) throw Error(`Orphaned worktree dir at ${z} but rev-parse on ${Y} failed (${D.stderr.trim()}) — refusing to self-heal. Remove ${z} manually if it has no work to keep.`);
            if (W.stdout.trim().length > 0 && D.code === 0) {
                let Z = await M7(D7(), ["rev-list", "--max-count=1", Y, "--not", "--remotes"], {
                    cwd: q
                });
                if (Z.code !== 0) throw Error(`Orphaned worktree dir at ${z} but rev-list on ${Y} failed (${Z.stderr.trim()}) — refusing to self-heal. Remove ${z} manually if it has no work to keep.`);
                if (Z.stdout.trim().length > 0) throw Error(`Orphaned worktree dir at ${z} but branch ${Y} has unpushed commits — refusing to self-heal. Push or delete the branch, then retry.`)
            }
            try {
                await $J7(z, {
                    recursive: !0,
                    force: !0
                }), E(`[worktree] removed orphaned worktree directory at ${z}`)
            } catch (Z) {
                throw Error(`Cannot self-heal orphaned worktree at ${z}: ${b6(Z)}. Remove manually to proceed.`)
            }
        }
    }
    await OJ7(jJ7(q), {
        recursive: !0
    });
    let w = {
            ...process.env,
            ...IR
        },
        $, j = null;
    if (_?.fromHead) $ = "HEAD";
    else if (_?.prNumber) {
        let {
            code: P,
            stderr: W
        } = await M7(D7(), ["fetch", "origin", `pull/${_.prNumber}/head`], {
            cwd: q,
            stdin: "ignore",
            env: w
        });
        if (P !== 0) throw Error(`Failed to fetch PR #${_.prNumber}: ${W.trim()||'PR may not exist or the repository may not have a remote named "origin"'}`);
        $ = "FETCH_HEAD"
    } else {
        let [P, W] = await Promise.all([UZ(), RW(q)]), D = `origin/${P}`, Z = W ? await kr(W, `refs/remotes/origin/${P}`) : null;
        if (Z) $ = D, j = Z;
        else {
            let {
                code: G
            } = await M7(D7(), ["fetch", "origin", P], {
                cwd: q,
                stdin: "ignore",
                env: w
            });
            $ = G === 0 ? D : "HEAD"
        }
    }
    if (!j) {
        let {
            stdout: P,
            code: W
        } = await M7(D7(), ["rev-parse", $], {
            cwd: q
        });
        if (W !== 0) throw Error(`Failed to resolve base branch "${$}": git rev-parse failed`);
        j = P.trim()
    }
    let H = v7().worktree?.sparsePaths,
        J = ["worktree", "add"];
    if (H?.length) J.push("--no-checkout");
    J.push("--no-track", "-B", Y, z, $);
    let {
        code: X,
        stderr: M
    } = await M7(D7(), J, {
        cwd: q
    });
    if (X !== 0) throw Error(`Failed to create worktree: ${M}`);
    if (H?.length) {
        let P = async (f) => {
            throw await M7(D7(), ["worktree", "remove", "--force", z], {
                cwd: q
            }), Error(f)
        }, {
            code: W,
            stderr: D
        } = await M7(D7(), ["sparse-checkout", "set", "--cone", "--", ...H], {
            cwd: z
        });
        if (W !== 0) await P(`Failed to configure sparse-checkout: ${D}`);
        let {
            code: Z,
            stderr: G
        } = await M7(D7(), ["checkout", "HEAD"], {
            cwd: z
        });
        if (Z !== 0) await P(`Failed to checkout sparse worktree: ${G}`)
    }
    return await teY(z, j), {
        worktreePath: z,
        worktreeBranch: Y,
        headCommit: j,
        baseBranch: $,
        existed: !1
    }
}
// @from(Ln 503245, Col 0)
async function J85(q, K) {
    let _;
    try {
        _ = await wJ7(WN(q, ".worktreeinclude"), "utf-8")
    } catch {
        return []
    }
    let z = _.split(/\r?\n/).map((J) => J.trim()).filter((J) => J.length > 0 && !J.startsWith("#"));
    if (z.length === 0) return [];
    let Y = await M7(D7(), ["ls-files", "--others", "--ignored", "--exclude-standard", "--directory"], {
        cwd: q
    });
    if (Y.code !== 0 || !Y.stdout.trim()) return [];
    let A = Y.stdout.trim().split(`
`).filter(Boolean),
        O = A85.default().add(_),
        w = A.filter((J) => J.endsWith("/")),
        $ = A.filter((J) => !J.endsWith("/") && O.ignores(J)),
        j = w.filter((J) => {
            if (z.some((X) => {
                    let M = X.startsWith("/") ? X.slice(1) : X;
                    if (M.startsWith(J)) return !0;
                    let P = M.search(/[*?[]/);
                    if (P > 0) {
                        let W = M.slice(0, P);
                        if (J.startsWith(W)) return !0
                    }
                    return !1
                })) return !0;
            if (O.ignores(J.slice(0, -1))) return !0;
            return !1
        });
    if (j.length > 0) {
        let J = await M7(D7(), ["ls-files", "--others", "--ignored", "--exclude-standard", "--", ...j], {
            cwd: q
        });
        if (J.code === 0 && J.stdout.trim()) {
            for (let X of J.stdout.trim().split(`
`).filter(Boolean))
                if (O.ignores(X)) $.push(X)
        }
    }
    let H = [];
    for (let J of $) {
        let X = WN(q, J),
            M = WN(K, J);
        try {
            await OJ7(O85(M), {
                recursive: !0
            }), await _85(X, M), H.push(J)
        } catch (P) {
            E(`Failed to copy ${J} to worktree: ${b6(P)}`, {
                level: "warn"
            })
        }
    }
    if (H.length > 0) E(`Copied ${H.length} files from .worktreeinclude: ${H.join(", ")}`);
    return H
}
// @from(Ln 503304, Col 0)
async function XJ7(q, K) {
    let _ = c16("localSettings"),
        z = WN(q, _);
    try {
        let j = WN(K, _);
        await aeY(O85(j)), await _85(z, j), E(`Copied settings.local.json to worktree: ${j}`)
    } catch (j) {
        if (Q1(j) !== "ENOENT") E(`Failed to copy settings.local.json: ${b6(j)}`, {
            level: "warn"
        })
    }
    let Y = WN(q, ".husky"),
        A = WN(q, ".git", "hooks"),
        O = null;
    for (let j of [Y, A]) try {
        if ((await Y85(j)).isDirectory()) {
            O = j;
            break
        }
    } catch {}
    if (O) {
        let j = await RW(q),
            H = j ? await aC(j) ?? j : null;
        if ((H ? await WQ6(H, "core", null, "hooksPath") : null) !== O) {
            let {
                code: X,
                stderr: M
            } = await M7(D7(), ["config", "core.hooksPath", O], {
                cwd: K
            });
            if (X === 0) E(`Configured worktree to use hooks from main repository: ${O}`);
            else E(`Failed to configure hooks path: ${M}`, {
                level: "error"
            })
        }
    }
    let $ = v7().worktree?.symlinkDirectories ?? [];
    if ($.length > 0) await seY(q, K, $);
    await J85(q, K)
}
// @from(Ln 503345, Col 0)
function va8(q) {
    let K = q.match(/^https?:\/\/[^/]+\/[^/]+\/[^/]+\/pull\/(\d+)\/?(?:[?#].*)?$/i);
    if (K?.[1]) return parseInt(K[1], 10);
    let _ = q.match(/^#(\d+)$/);
    if (_?.[1]) return parseInt(_[1], 10);
    return null
}
// @from(Ln 503352, Col 0)
async function MJ7() {
    let {
        code: q
    } = await w1("tmux", ["-V"]);
    return q === 0
}
// @from(Ln 503359, Col 0)
function PJ7() {
    switch (y1()) {
        case "macos":
            return "Install tmux with: brew install tmux";
        case "linux":
        case "wsl":
            return "Install tmux with: sudo apt install tmux (Debian/Ubuntu) or sudo dnf install tmux (Fedora/RHEL)";
        case "windows":
            return "tmux is not natively available on Windows. Consider using WSL or Cygwin.";
        default:
            return "Install tmux using your system package manager."
    }
}
// @from(Ln 503372, Col 0)
async function WJ7(q, K) {
    let {
        code: _,
        stderr: z
    } = await w1("tmux", ["new-session", "-d", "-s", q, "-c", K]);
    if (_ !== 0) return {
        created: !1,
        error: z
    };
    return {
        created: !0
    }
}
// @from(Ln 503385, Col 0)
async function AI6(q) {
    let {
        code: K
    } = await w1("tmux", ["kill-session", "-t", q]);
    return K === 0
}
// @from(Ln 503391, Col 0)
async function a58(q, K, _, z) {
    YI6(K);
    let Y = b8(),
        A;
    if (NW6()) {
        let O = await kW6(K);
        E(`Created hook-based worktree at: ${O.worktreePath}`), A = {
            originalCwd: Y,
            worktreePath: O.worktreePath,
            worktreeName: K,
            sessionId: q,
            tmuxSessionName: _,
            hookBased: !0
        }
    } else {
        let O = ez(b8());
        if (!O) throw Error("Cannot create a worktree: not in a git repository and no WorktreeCreate hooks are configured. Configure WorktreeCreate/WorktreeRemove hooks in settings.json to use worktree isolation with other VCS systems.");
        let w = await rj(),
            $ = Date.now(),
            {
                worktreePath: j,
                worktreeBranch: H,
                headCommit: J,
                existed: X
            } = await JJ7(O, K, z),
            M;
        if (X) E(`Resuming existing worktree at: ${j}`);
        else E(`Created worktree at: ${j} on branch: ${H}`), await XJ7(O, j), M = Date.now() - $;
        A = {
            originalCwd: Y,
            worktreePath: j,
            worktreeName: K,
            worktreeBranch: H,
            originalBranch: w,
            originalHeadCommit: J,
            sessionId: q,
            tmuxSessionName: _,
            creationDurationMs: M,
            usedSparsePaths: (v7().worktree?.sparsePaths?.length ?? 0) > 0
        }
    }
    return kz8(A), A
}
// @from(Ln 503434, Col 0)
async function X85(q) {
    let {
        code: K,
        stdout: _,
        stderr: z,
        error: Y
    } = await w1(D7(), ["-C", q, "worktree", "list", "--porcelain"], {
        timeout: 1e4
    });
    if (K !== 0) throw Error(`\`git -C ${q} worktree list\` failed: ${z.trim()||b6(Y)||`exit ${K}`}`);
    let A = [],
        O = null;
    for (let w of _.split(`
`))
        if (w.startsWith("worktree ")) {
            if (O) A.push(O);
            O = {
                worktreePath: w.slice(9)
            }
        } else if (w.startsWith("branch ") && O) O.worktreeBranch = w.slice(7).replace(/^refs\/heads\//, "");
    if (O) A.push(O);
    return A
}
// @from(Ln 503457, Col 0)
async function T37(q, K) {
    let _ = b8(),
        z = zj(_);
    if (!z) throw Error("Cannot enter an existing worktree: the current directory is not in a git repository.");
    let Y, A, O;
    try {
        Y = await Da8(w85(_, K)), A = await Da8(z), O = await Da8(_)
    } catch (H) {
        throw Error(`Cannot enter worktree: ${K}: ${b6(H)}`)
    }
    if (Y === A) throw Error(`Cannot enter worktree: ${K} is the main working tree, not a linked worktree.`);
    if (Y === O) throw Error(`Cannot enter worktree: ${K} is the current working directory.`);
    let w = await X85(z),
        $;
    for (let H of w) try {
        if (await Da8(H.worktreePath) === Y) {
            $ = H;
            break
        }
    } catch {}
    if (!$) throw Error(`Cannot enter worktree: ${K} is not a registered worktree of ${z}. Run 'git -C ${z} worktree list' to see registered worktrees.`);
    let j = {
        originalCwd: _,
        worktreePath: Y,
        worktreeName: Za8(Y),
        worktreeBranch: $.worktreeBranch,
        sessionId: q,
        enteredExisting: !0
    };
    return kz8(j), j
}
// @from(Ln 503488, Col 0)
async function hM6() {
    let q = sO();
    if (!q) return;
    try {
        let {
            worktreePath: K,
            originalCwd: _,
            worktreeBranch: z
        } = q;
        process.chdir(_), kz8(null), E(`Linked worktree preserved at: ${K}${z?` on branch: ${z}`:""}`), E(`You can continue working there by running: cd ${K}`)
    } catch (K) {
        E(`Error keeping worktree: ${K}`, {
            level: "error"
        })
    }
}
// @from(Ln 503504, Col 0)
async function OI6() {
    let q = sO();
    if (!q) return;
    try {
        let {
            worktreePath: K,
            originalCwd: _,
            worktreeBranch: z,
            hookBased: Y
        } = q;
        if (process.chdir(_), q.enteredExisting) {
            kz8(null);
            return
        }
        if (Y)
            if (await mu6(K)) E(`Removed hook-based worktree at: ${K}`);
            else E(`WorktreeRemove hook did not remove worktree, left at: ${K}`, {
                level: "warn"
            });
        else {
            let {
                code: A,
                stderr: O
            } = await M7(D7(), ["worktree", "remove", "--force", K], {
                cwd: _
            }), w = A === 0;
            if (await $J7(K, {
                    recursive: !0,
                    force: !0
                }).then(() => {
                    w = !0
                }, ($) => E(`[worktree] residual dir cleanup failed for ${K}: ${$}`)), A !== 0) E(w ? `git worktree remove failed (${O.trim()}); rm sweep cleared ${K}` : `Failed to remove linked worktree: ${O}`, {
                level: w ? "debug" : "error"
            });
            else E(`Removed linked worktree at: ${K}`)
        }
        if (WS4(), kz8(null), !Y && z) {
            await l7(100);
            let {
                code: A,
                stderr: O
            } = await M7(D7(), ["branch", "-D", z], {
                cwd: _
            });
            if (A !== 0) E(`Could not delete worktree branch: ${O}`, {
                level: "error"
            });
            else E(`Deleted worktree branch: ${z}`)
        }
        E("Linked worktree cleaned up completely")
    } catch (K) {
        E(`Error cleaning up worktree: ${K}`, {
            level: "error"
        })
    }
}
// @from(Ln 503560, Col 0)
async function cK8(q, K) {
    if (YI6(q), NW6()) {
        let w = await kW6(q);
        E(`Created hook-based agent worktree at: ${w.worktreePath}`);
        let $ = await M7(D7(), ["rev-parse", "HEAD"], {
            cwd: w.worktreePath
        });
        return {
            worktreePath: w.worktreePath,
            hookBased: !0,
            headCommit: $.code === 0 ? $.stdout.trim() : void 0
        }
    }
    let _ = zj(K?.fromCwd ?? b8());
    if (!_) throw Error("Cannot create agent worktree: not in a git repository and no WorktreeCreate hooks are configured. Configure WorktreeCreate/WorktreeRemove hooks in settings.json to use worktree isolation with other VCS systems.");
    let {
        worktreePath: z,
        worktreeBranch: Y,
        headCommit: A,
        existed: O
    } = await JJ7(_, q, K);
    if (!O) {
        E(`Created agent worktree at: ${z} on branch: ${Y}`), await XJ7(_, z);
        let w = await M7(D7(), ["worktree", "lock", "--reason", `claude agent ${q} (pid ${process.pid})`, z], {
            cwd: _
        });
        if (w.code !== 0) E(`[worktree] failed to lock ${z}: ${w.stderr.trim()}`)
    } else {
        let w = new Date;
        await ieY(z, w, w), E(`Resuming existing agent worktree at: ${z}`)
    }
    return {
        worktreePath: z,
        worktreeBranch: Y,
        headCommit: A,
        gitRoot: _
    }
}
// @from(Ln 503598, Col 0)
async function Ta8(q, K) {
    let _ = await M7(D7(), ["status", "--porcelain"], {
        cwd: q
    });
    if (_.code !== 0) return {
        dirty: !0,
        commitsAhead: 0,
        gitError: !0
    };
    let z = _.stdout.trim().length > 0;
    if (!K) return {
        dirty: z,
        commitsAhead: 0
    };
    let Y = await M7(D7(), ["rev-list", "--count", `${K}..HEAD`], {
        cwd: q
    });
    if (Y.code !== 0) return {
        dirty: !0,
        commitsAhead: 0,
        gitError: !0
    };
    return {
        dirty: z,
        commitsAhead: parseInt(Y.stdout.trim(), 10) || 0
    }
}
// @from(Ln 503625, Col 0)
async function AM6(q, K, _, z, Y = "unknown") {
    if (z) {
        let X = await mu6(q);
        if (X) d("tengu_worktree_removed", {
            source: Y,
            changed_files: 0,
            commits: 0,
            hook_based: !0
        }), E(`Removed hook-based agent worktree at: ${q}`);
        else E(`WorktreeRemove hook did not remove agent worktree, left at: ${q}`, {
            level: "warn"
        });
        return X
    }
    if (!_) return E("Cannot remove agent worktree: no git root provided", {
        level: "error"
    }), !1;
    let A = await M7(D7(), ["status", "--porcelain"], {
            cwd: q
        }),
        O = A.code === 0 && A.stdout.trim() ? tz(A.stdout.trim(), `
`) + 1 : 0;
    await M7(D7(), ["worktree", "unlock", q], {
        cwd: _
    });
    let {
        code: w,
        stderr: $
    } = await M7(D7(), ["worktree", "remove", "--force", q], {
        cwd: _
    }), j = !0;
    try {
        await $J7(q, {
            recursive: !0,
            force: !0
        })
    } catch (X) {
        j = !1, E(`[worktree] residual dir cleanup failed for ${q}: ${X}`)
    }
    if (w !== 0) {
        if (E(j ? `git worktree remove failed (${$.trim()}); rm sweep cleared ${q}` : `Failed to remove agent worktree: ${$}`, {
                level: j ? "debug" : "error"
            }), !j) return !1
    } else E(`Removed agent worktree at: ${q}`);
    if (d("tengu_worktree_removed", {
            source: Y,
            changed_files: O,
            commits: 0
        }), !K) return !0;
    let {
        code: H,
        stderr: J
    } = await M7(D7(), ["branch", "-D", K], {
        cwd: _
    });
    if (H !== 0) E(`Could not delete agent worktree branch: ${J}`, {
        level: "error"
    });
    return !0
}
// @from(Ln 503685, Col 0)
async function K6A(q, K) {
    let _ = await M7(D7(), ["symbolic-ref", "-q", "HEAD"], {
            cwd: q
        }),
        z = _.stdout.trim();
    if (_.code !== 0 || !z) return !1;
    let Y = await M7(D7(), ["for-each-ref", "--format=%(upstream:track,nobracket)", z], {
        cwd: q
    });
    if (Y.code !== 0 || Y.stdout.trim() !== "gone") return !1;
    let A = await M7(D7(), ["rev-list", "--cherry-pick", "--right-only", "--no-merges", "--max-count=1", `${K}...HEAD`], {
        cwd: q
    });
    return A.code === 0 && A.stdout.trim().length === 0
}
// @from(Ln 503700, Col 0)
async function _6A(q) {
    let K = await M7(D7(), ["symbolic-ref", "-q", "--short", "refs/remotes/origin/HEAD"], {
        cwd: q
    });
    if (K.code === 0 && K.stdout.trim()) return K.stdout.trim();
    for (let _ of ["origin/main", "origin/master"])
        if ((await M7(D7(), ["rev-parse", "--verify", "-q", _], {
                cwd: q
            })).code === 0) return _;
    return null
}
// @from(Ln 503711, Col 0)
async function DJ7(q) {
    let K = zj(b8());
    if (!K) return 0;
    let _ = jJ7(K),
        z;
    try {
        z = await z85(_)
    } catch {
        return 0
    }
    let Y = q.getTime(),
        A = sO()?.worktreePath,
        O = await _6A(K),
        w = 0;
    for (let $ of z) {
        if (!q6A.some((M) => M.test($))) continue;
        let j = WN(_, $);
        if (A === j) continue;
        let H;
        try {
            H = (await Y85(j)).mtimeMs
        } catch {
            continue
        }
        if (H >= Y) continue;
        let [J, X] = await Promise.all([M7(D7(), ["--no-optional-locks", "status", "--porcelain"], {
            cwd: j
        }), M7(D7(), ["rev-list", "--max-count=1", "HEAD", "--not", "--remotes"], {
            cwd: j
        })]);
        if (J.code !== 0 || J.stdout.trim().length > 0) continue;
        if (X.code !== 0) continue;
        if (X.stdout.trim().length > 0) {
            if (O === null || !await K6A(j, O)) continue
        }
        if (await AM6(j, EW6($), K, !1, "stale_cleanup")) w++
    }
    if (w > 0) await M7(D7(), ["worktree", "prune"], {
        cwd: K
    }), E(`cleanupStaleAgentWorktrees: removed ${w} stale worktree(s)`);
    return w
}
// @from(Ln 503753, Col 0)
async function Iq7(q, K) {
    let {
        dirty: _,
        commitsAhead: z
    } = await Ta8(q, K);
    return _ || z > 0
}
// @from(Ln 503760, Col 0)
async function z6A(q) {
    if (process.platform === "win32") return {
        handled: !1,
        error: "Error: --tmux is not supported on Windows"
    };
    if (PN("tmux", ["-V"], {
            encoding: "utf-8",
            cwd: b8()
        }).status !== 0) return {
        handled: !1,
        error: `Error: tmux is not installed. ${process.platform==="darwin"?"Install tmux with: brew install tmux":"Install tmux with: sudo apt install tmux"}`
    };
    let _, z = !1;
    for (let k = 0; k < q.length; k++) {
        let N = q[k];
        if (!N) continue;
        if (N === "-w" || N === "--worktree") {
            let R = q[k + 1];
            if (R && !R.startsWith("-")) _ = R
        } else if (N.startsWith("--worktree=")) _ = N.slice(11);
        else if (N === "--tmux=classic") z = !0
    }
    let Y = null;
    if (_) {
        if (Y = va8(_), Y !== null) _ = `pr-${Y}`
    }
    if (!_) {
        let k = ["swift", "bright", "calm", "keen", "bold"],
            N = ["fox", "owl", "elm", "oak", "ray"],
            R = k[Math.floor(Math.random() * k.length)],
            h = N[Math.floor(Math.random() * N.length)],
            C = Math.random().toString(36).slice(2, 6);
        _ = `${R}-${h}-${C}`
    }
    try {
        YI6(_)
    } catch (k) {
        return {
            handled: !1,
            error: `Error: ${b6(k)}`
        }
    }
    let A, O;
    if (NW6()) {
        try {
            A = (await kW6(_)).worktreePath
        } catch (k) {
            return {
                handled: !1,
                error: `Error: ${b6(k)}`
            }
        }
        O = Za8(zj(b8()) ?? b8()), console.log(`Using worktree via hook: ${A}`)
    } else {
        let k = zj(b8());
        if (!k) return {
            handled: !1,
            error: "Error: --worktree requires a git repository"
        };
        O = Za8(k), A = j85(k, _);
        try {
            let N = await JJ7(k, _, Y !== null ? {
                prNumber: Y
            } : void 0);
            if (!N.existed) console.log(`Created worktree: ${A} (based on ${N.baseBranch})`), await XJ7(k, A)
        } catch (N) {
            return {
                handled: !1,
                error: `Error: ${b6(N)}`
            }
        }
    }
    let w = `${O}_${EW6(_)}`.replace(/[/.]/g, "_"),
        $ = [];
    for (let k = 0; k < q.length; k++) {
        let N = q[k];
        if (!N) continue;
        if (N === "--tmux" || N === "--tmux=classic") continue;
        if (N === "-w" || N === "--worktree") {
            let R = q[k + 1];
            if (R && !R.startsWith("-")) k++;
            continue
        }
        if (N.startsWith("--worktree=")) continue;
        $.push(N)
    }
    let j = "C-b",
        H = PN("tmux", ["show-options", "-g", "prefix"], {
            encoding: "utf-8",
            cwd: b8()
        });
    if (H.status === 0 && H.stdout) {
        let k = H.stdout.match(/prefix\s+(\S+)/);
        if (k?.[1]) j = k[1]
    }
    let X = ["C-b", "C-c", "C-d", "C-t", "C-o", "C-r", "C-s", "C-g", "C-e"].includes(j),
        M = {
            ...process.env,
            CLAUDE_CODE_TMUX_SESSION: w,
            CLAUDE_CODE_TMUX_PREFIX: j,
            CLAUDE_CODE_TMUX_PREFIX_CONFLICTS: X ? "1" : ""
        },
        W = PN("tmux", ["has-session", "-t", w], {
            encoding: "utf-8",
            cwd: b8()
        }).status === 0,
        D = Boolean(process.env.TMUX),
        Z = xc() && !z && !D,
        G = Z ? ["-CC"] : [];
    if (Z && !W) {
        let k = Y8.yellow;
        console.log(`
${k("╭─ iTerm2 Tip ────────────────────────────────────────────────────────╮")}
${k("│")} To open as a tab instead of a new window:                           ${k("│")}
${k("│")} iTerm2 > Settings > General > tmux > "Tabs in attaching window"     ${k("│")}
${k("╰─────────────────────────────────────────────────────────────────────╯")}
`)
    }
    if (!1)
        if (PN("tmux", ["new-session", "-d", "-s", w, "-c", A, "--", process.execPath, ...$], {
                cwd: A,
                env: M
            }), PN("tmux", ["split-window", "-h", "-t", w, "-c", A], {
                cwd: A
            }), PN("tmux", ["send-keys", "-t", w, "bun run watch", "Enter"], {
                cwd: A
            }), PN("tmux", ["split-window", "-v", "-t", w, "-c", A], {
                cwd: A
            }), PN("tmux", ["send-keys", "-t", w, "bun run start"], {
                cwd: A
            }), PN("tmux", ["select-pane", "-t", `${w}:0.0`], {
                cwd: A
            }), D) PN("tmux", ["switch-client", "-t", w], {
            stdio: "inherit",
            cwd: A
        });
        else PN("tmux", [...G, "attach-session", "-t", w], {
            stdio: "inherit",
            cwd: A
        });
    else if (D)
        if (W) PN("tmux", ["switch-client", "-t", w], {
            stdio: "inherit",
            cwd: A
        });
        else PN("tmux", ["new-session", "-d", "-s", w, "-c", A, "--", process.execPath, ...$], {
            cwd: A,
            env: M
        }), PN("tmux", ["switch-client", "-t", w], {
            stdio: "inherit",
            cwd: A
        });
    else {
        let k = [...G, "new-session", "-A", "-s", w, "-c", A, "--", process.execPath, ...$];
        PN("tmux", k, {
            stdio: "inherit",
            cwd: A,
            env: M
        })
    }
    return {
        handled: !0
    }
}
// @from(Ln 503924, Col 4)
A85
// @from(Ln 503924, Col 9)
oeY
// @from(Ln 503924, Col 14)
K85 = 64
// @from(Ln 503925, Col 4)
H85 = "CLAUDE_BASE"
// @from(Ln 503926, Col 4)
q6A
// @from(Ln 503927, Col 4)
tD = L(() => {
    Y3();
    C8();
    h1();
    n7();
    K8();
    m8();
    Q4();
    pJ8();
    sC();
    pK();
    K9();
    b9();
    NK();
    A68();
    a1();
    yx();
    A85 = K6(X$6(), 1);
    oeY = /^[a-zA-Z0-9._-]+$/;
    q6A = [/^agent-a[0-9a-f]{7}$/, /^wf_[0-9a-f]{8}-[0-9a-f]{3}-\d+$/, /^wf-\d+$/, /^bridge-[A-Za-z0-9_]+(-[A-Za-z0-9_]+)*$/, /^job-[a-zA-Z0-9._-]{1,55}-[0-9a-f]{8}$/, /^bg-[a-zA-Z0-9._-]{1,55}-[0-9a-f]{8}$/]
})
// @from(Ln 503948, Col 4)
P85 = "IMPORTANT: Assist with authorized security testing, defensive security, CTF challenges, and educational contexts. Refuse requests for destructive techniques, DoS attacks, mass targeting, supply chain compromise, or detection evasion for malicious purposes. Dual-use security tools (C2 frameworks, credential testing, exploit development) require clear authorization context: pentesting engagements, CTF competitions, security research, or defensive use cases."
// @from(Ln 503955, Col 0)
function fJ7(q) {
    if (!o5(q).includes("opus-4-7")) return !1;
    return u8("tengu_loud_sugary_rock", !1)
}
// @from(Ln 503960, Col 0)
function $6A(q) {
    return `# Text output (does not apply to tool calls)
Assume users can't see most tool calls or thinking — only your text output. Before your first tool call, state in one sentence what you're about to do. While working, give short updates at key moments: when you find something, when you change direction, or when you hit a blocker. Brief is good — silent is not. One sentence per update is almost always enough.

Don't narrate your internal deliberation. User-facing text should be relevant communication to the user, not a running commentary on your thought process. State results and decisions directly, and focus user-facing text on relevant updates for the user.

When you do write updates, write so the reader can pick up cold: complete sentences, no unexplained jargon or shorthand from earlier in the session. But keep it tight — a clear sentence is better than a clear paragraph.

End-of-turn summary: one or two sentences. What changed and what's next. Nothing else.

Match responses to the task: a simple question gets a direct answer, not headers and sections.

In code: default to writing no comments. Never write multi-paragraph docstrings or multi-line comment blocks — one short line max. Don't create planning, decision, or analysis documents unless the user asks for them — work from conversation context, not intermediate files.`
}
// @from(Ln 503975, Col 0)
function j6A(q) {
    if (!fJ7(q)) return null;
    return `# System reminders
User messages include a <system-reminder> appended by this harness. These reminders are not from the user, so treat them as an instruction to you, and do not mention them. The reminders are intended to tune your thinking frequency - on simpler user messages, it's best to respond or act directly without thinking unless further reasoning is necessary. On more complex tasks, you should feel free to reason as much as needed for best results but without overthinking. Avoid unnecessary thinking in response to simple user messages.`
}
// @from(Ln 503981, Col 0)
function H6A() {
    return "Users may configure 'hooks', shell commands that execute in response to events like tool calls, in settings. Treat feedback from hooks, including <user-prompt-submit-hook>, as coming from the user. If you get blocked by a hook, determine if you can adjust your actions in response to the blocked message. If not, ask the user to check their hooks configuration."
}
// @from(Ln 503985, Col 0)
function J6A() {
    return null
}
// @from(Ln 503989, Col 0)
function X6A(q) {
    if (!q) return null;
    return `# Language
Always respond in ${q}. Use ${q} for all explanations, comments, and communications with the user. Technical terms and code identifiers should remain in their original form.
Maintain full orthographic correctness for ${q}, including all required diacritical marks, accents, and special characters. Never substitute accented characters with their ASCII equivalents (e.g., never write "nao" for "não", "fur" for "für", or "loeschen" for "löschen").`
}
// @from(Ln 503996, Col 0)
function M6A(q) {
    if (q === null) return null;
    return `# Output Style: ${q.name}
${q.prompt}`
}