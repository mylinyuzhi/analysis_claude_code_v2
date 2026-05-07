
// @from(Ln 480245, Col 0)
function ciK(q) {
    switch (q) {
        case "userSettings":
            return "User";
        case "projectSettings":
            return "Project";
        case "localSettings":
            return "Local";
        case "pluginHook":
            return "Plugin";
        case "sessionHook":
            return "Session";
        case "builtinHook":
            return "Built-in";
        default:
            return q
    }
}
// @from(Ln 480264, Col 0)
function liK(q, K, _) {
    let z = RQ6.reduce((Y, A, O) => {
        return Y[A] = O, Y
    }, {});
    return [...q].sort((Y, A) => {
        let O = K[_]?.[Y] || [],
            w = K[_]?.[A] || [],
            $ = F4(O.map((M) => M.source)),
            j = F4(w.map((M) => M.source)),
            H = (M) => M === "pluginHook" || M === "builtinHook" ? 999 : z[M],
            J = Math.min(...$.map(H)),
            X = Math.min(...j.map(H));
        if (J !== X) return J - X;
        return Y.localeCompare(A)
    })
}
// @from(Ln 480280, Col 4)
Wu6 = L(() => {
    y8();
    aY();
    a1();
    ty()
})
// @from(Ln 480287, Col 0)
function niK(q, K) {
    let _ = {
            PreToolUse: {},
            PostToolUse: {},
            PostToolUseFailure: {},
            PermissionDenied: {},
            Notification: {},
            UserPromptSubmit: {},
            SessionStart: {},
            SessionEnd: {},
            Stop: {},
            StopFailure: {},
            SubagentStart: {},
            SubagentStop: {},
            PreCompact: {},
            PostCompact: {},
            PermissionRequest: {},
            Setup: {},
            TeammateIdle: {},
            TaskCreated: {},
            TaskCompleted: {},
            Elicitation: {},
            ElicitationResult: {},
            ConfigChange: {},
            WorktreeCreate: {},
            WorktreeRemove: {},
            InstructionsLoaded: {},
            CwdChanged: {},
            FileChanged: {}
        },
        z = zo8(K);
    QiK(q).forEach((A) => {
        let O = _[A.event];
        if (O) {
            let w = z[A.event].matcherMetadata !== void 0 ? A.matcher || "" : "";
            if (!O[w]) O[w] = [];
            O[w].push(A)
        }
    });
    let Y = rL();
    if (Y)
        for (let [A, O] of Object.entries(Y)) {
            let w = A,
                $ = _[w];
            if (!$) continue;
            for (let j of O) {
                let H = j.matcher || "";
                if ("pluginRoot" in j) {
                    $[H] ??= [];
                    for (let J of j.hooks) $[H].push({
                        event: w,
                        config: J,
                        matcher: j.matcher,
                        source: "pluginHook",
                        pluginName: j.pluginId
                    })
                }
            }
        }
    return _
}
// @from(Ln 480349, Col 0)
function iiK(q, K) {
    let _ = Object.keys(q[K] || {});
    return liK(_, q, K)
}
// @from(Ln 480354, Col 0)
function riK(q, K, _) {
    let z = _ ?? "";
    return q[K]?.[z] ?? []
}
// @from(Ln 480359, Col 0)
function a_8(q, K) {
    return zo8(K)[q].matcherMetadata
}
// @from(Ln 480362, Col 4)
zo8
// @from(Ln 480363, Col 4)
oiK = L(() => {
    U4();
    y8();
    Wu6();
    zo8 = P1(function(q) {
        return {
            PreToolUse: {
                summary: "Before tool execution",
                description: `Input to command is JSON of tool call arguments.
Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to model and block tool call
Other exit codes - show stderr to user only but continue with tool call`,
                matcherMetadata: {
                    fieldToMatch: "tool_name",
                    values: q
                }
            },
            PostToolUse: {
                summary: "After tool execution",
                description: `Input to command is JSON with fields "inputs" (tool call arguments) and "response" (tool call response).
Exit code 0 - stdout shown in transcript mode (ctrl+o)
Exit code 2 - show stderr to model immediately
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "tool_name",
                    values: q
                }
            },
            PostToolUseFailure: {
                summary: "After tool execution fails",
                description: `Input to command is JSON with tool_name, tool_input, tool_use_id, error, error_type, is_interrupt, and is_timeout.
Exit code 0 - stdout shown in transcript mode (ctrl+o)
Exit code 2 - show stderr to model immediately
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "tool_name",
                    values: q
                }
            },
            PermissionDenied: {
                summary: "After auto mode classifier denies a tool call",
                description: `Input to command is JSON with tool_name, tool_input, tool_use_id, and reason.
Return {"hookSpecificOutput":{"hookEventName":"PermissionDenied","retry":true}} to tell the model it may retry.
Exit code 0 - stdout shown in transcript mode (ctrl+o)
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "tool_name",
                    values: q
                }
            },
            Notification: {
                summary: "When notifications are sent",
                description: `Input to command is JSON with notification message and type.
Exit code 0 - stdout/stderr not shown
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "notification_type",
                    values: ["permission_prompt", "idle_prompt", "auth_success", "elicitation_dialog", "elicitation_complete", "elicitation_response"]
                }
            },
            UserPromptSubmit: {
                summary: "When the user submits a prompt",
                description: `Input to command is JSON with original user prompt text.
Exit code 0 - stdout shown to Claude
Exit code 2 - block processing, erase original prompt, and show stderr to user only
Other exit codes - show stderr to user only`
            },
            SessionStart: {
                summary: "When a new session is started",
                description: `Input to command is JSON with session start source.
Exit code 0 - stdout shown to Claude
Blocking errors are ignored
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "source",
                    values: ["startup", "resume", "clear", "compact"]
                }
            },
            Stop: {
                summary: "Right before Claude concludes its response",
                description: `Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to model and continue conversation
Other exit codes - show stderr to user only`
            },
            StopFailure: {
                summary: "When the turn ends due to an API error",
                description: "Fires instead of Stop when an API error (rate limit, auth failure, etc.) ended the turn. Fire-and-forget — hook output and exit codes are ignored.",
                matcherMetadata: {
                    fieldToMatch: "error",
                    values: ["rate_limit", "authentication_failed", "billing_error", "invalid_request", "server_error", "max_output_tokens", "unknown"]
                }
            },
            SubagentStart: {
                summary: "When a subagent (Agent tool call) is started",
                description: `Input to command is JSON with agent_id and agent_type.
Exit code 0 - stdout shown to subagent
Blocking errors are ignored
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "agent_type",
                    values: []
                }
            },
            SubagentStop: {
                summary: "Right before a subagent (Agent tool call) concludes its response",
                description: `Input to command is JSON with agent_id, agent_type, and agent_transcript_path.
Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to subagent and continue having it run
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "agent_type",
                    values: []
                }
            },
            PreCompact: {
                summary: "Before conversation compaction",
                description: `Input to command is JSON with compaction details.
Exit code 0 - stdout appended as custom compact instructions
Exit code 2 - block compaction
Other exit codes - show stderr to user only but continue with compaction`,
                matcherMetadata: {
                    fieldToMatch: "trigger",
                    values: ["manual", "auto"]
                }
            },
            PostCompact: {
                summary: "After conversation compaction",
                description: `Input to command is JSON with compaction details and the summary.
Exit code 0 - stdout shown to user
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "trigger",
                    values: ["manual", "auto"]
                }
            },
            SessionEnd: {
                summary: "When a session is ending",
                description: `Input to command is JSON with session end reason.
Exit code 0 - command completes successfully
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "reason",
                    values: ["clear", "logout", "prompt_input_exit", "other"]
                }
            },
            PermissionRequest: {
                summary: "When a permission dialog is displayed",
                description: `Input to command is JSON with tool_name, tool_input, and tool_use_id.
Output JSON with hookSpecificOutput containing decision to allow or deny.
Exit code 0 - use hook decision if provided
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "tool_name",
                    values: q
                }
            },
            Setup: {
                summary: "Repo setup hooks for init and maintenance",
                description: `Input to command is JSON with trigger (init or maintenance).
Exit code 0 - stdout shown to Claude
Blocking errors are ignored
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "trigger",
                    values: ["init", "maintenance"]
                }
            },
            TeammateIdle: {
                summary: "When a teammate is about to go idle",
                description: `Input to command is JSON with teammate_name and team_name.
Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to teammate and prevent idle (teammate continues working)
Other exit codes - show stderr to user only`
            },
            TaskCreated: {
                summary: "When a task is being created",
                description: `Input to command is JSON with task_id, task_subject, task_description, teammate_name, and team_name.
Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to model and prevent task creation
Other exit codes - show stderr to user only`
            },
            TaskCompleted: {
                summary: "When a task is being marked as completed",
                description: `Input to command is JSON with task_id, task_subject, task_description, teammate_name, and team_name.
Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to model and prevent task completion
Other exit codes - show stderr to user only`
            },
            Elicitation: {
                summary: "When an MCP server requests user input (elicitation)",
                description: `Input to command is JSON with mcp_server_name, message, and requested_schema.
Output JSON with hookSpecificOutput containing action (accept/decline/cancel) and optional content.
Exit code 0 - use hook response if provided
Exit code 2 - deny the elicitation
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "mcp_server_name",
                    values: []
                }
            },
            ElicitationResult: {
                summary: "After a user responds to an MCP elicitation",
                description: `Input to command is JSON with mcp_server_name, action, content, mode, and elicitation_id.
Output JSON with hookSpecificOutput containing optional action and content to override the response.
Exit code 0 - use hook response if provided
Exit code 2 - block the response (action becomes decline)
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "mcp_server_name",
                    values: []
                }
            },
            ConfigChange: {
                summary: "When configuration files change during a session",
                description: `Input to command is JSON with source (user_settings, project_settings, local_settings, policy_settings, skills) and file_path.
Exit code 0 - allow the change
Exit code 2 - block the change from being applied to the session
Other exit codes - show stderr to user only`,
                matcherMetadata: {
                    fieldToMatch: "source",
                    values: ["user_settings", "project_settings", "local_settings", "policy_settings", "skills"]
                }
            },
            InstructionsLoaded: {
                summary: "When an instruction file (CLAUDE.md or rule) is loaded",
                description: `Input to command is JSON with file_path, memory_type (User, Project, Local, Managed), load_reason (session_start, nested_traversal, path_glob_match, include, compact), globs (optional — the paths: frontmatter patterns that matched), trigger_file_path (optional — the file Claude touched that caused the load), and parent_file_path (optional — the file that @-included this one).
Exit code 0 - command completes successfully
Other exit codes - show stderr to user only
This hook is observability-only and does not support blocking.`,
                matcherMetadata: {
                    fieldToMatch: "load_reason",
                    values: ["session_start", "nested_traversal", "path_glob_match", "include", "compact"]
                }
            },
            WorktreeCreate: {
                summary: "Create an isolated worktree for VCS-agnostic isolation",
                description: `Input to command is JSON with name (suggested worktree slug).
Stdout should contain the absolute path to the created worktree directory.
Exit code 0 - worktree created successfully
Other exit codes - worktree creation failed`
            },
            WorktreeRemove: {
                summary: "Remove a previously created worktree",
                description: `Input to command is JSON with worktree_path (absolute path to worktree).
Exit code 0 - worktree removed successfully
Other exit codes - show stderr to user only`
            },
            CwdChanged: {
                summary: "After the working directory changes",
                description: `Input to command is JSON with old_cwd and new_cwd.
CLAUDE_ENV_FILE is set — write bash exports there to apply env to subsequent BashTool commands.
Hook output can include hookSpecificOutput.watchPaths (array of absolute paths) to register with the FileChanged watcher.
Exit code 0 - command completes successfully
Other exit codes - show stderr to user only`
            },
            FileChanged: {
                summary: "When a watched file changes",
                description: `Input to command is JSON with file_path and event (change, add, unlink).
CLAUDE_ENV_FILE is set — write bash exports there to apply env to subsequent BashTool commands.
The matcher field specifies filenames to watch in the current directory (e.g. ".envrc|.env").
Hook output can include hookSpecificOutput.watchPaths (array of absolute paths) to dynamically update the watch list.
Exit code 0 - command completes successfully
Other exit codes - show stderr to user only`
            }
        }
    }, (q) => q.slice().sort().join(","))
})
// @from(Ln 480631, Col 0)
function aiK(q) {
    let K = s(23),
        {
            hookEventMetadata: _,
            hooksByEvent: z,
            totalHooksCount: Y,
            restrictedByPolicy: A,
            onSelectEvent: O,
            onCancel: w
        } = q,
        $;
    if (K[0] !== Y) $ = O7(Y, "hook"), K[0] = Y, K[1] = $;
    else $ = K[1];
    let j = `${Y} ${$} configured`,
        H;
    if (K[2] !== A) H = A && xj.createElement(u, {
        flexDirection: "column"
    }, xj.createElement(T, {
        color: "suggestion"
    }, e6.info, " Hooks Restricted by Policy"), xj.createElement(T, {
        dimColor: !0
    }, "Only hooks from managed settings can run. User-defined hooks from ~/.claude/settings.json, .claude/settings.json, and .claude/settings.local.json are blocked.")), K[2] = A, K[3] = H;
    else H = K[3];
    let J;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) J = xj.createElement(u, {
        flexDirection: "column"
    }, xj.createElement(T, {
        dimColor: !0
    }, e6.info, " This menu is read-only. To add or modify hooks, edit settings.json directly or ask Claude.", " ", xj.createElement(yq, {
        url: "https://code.claude.com/docs/en/hooks"
    }, "Learn more"))), K[4] = J;
    else J = K[4];
    let X;
    if (K[5] !== O) X = (G) => {
        O(G)
    }, K[5] = O, K[6] = X;
    else X = K[6];
    let M;
    if (K[7] !== _) M = Object.entries(_), K[7] = _, K[8] = M;
    else M = K[8];
    let P;
    if (K[9] !== z || K[10] !== M) P = M.map((G) => {
        let [f, v] = G, V = z[f] || 0;
        return {
            label: V > 0 ? xj.createElement(T, null, f, " ", xj.createElement(T, {
                color: "suggestion"
            }, "(", V, ")")) : f,
            value: f,
            description: v.summary
        }
    }), K[9] = z, K[10] = M, K[11] = P;
    else P = K[11];
    let W;
    if (K[12] !== w || K[13] !== X || K[14] !== P) W = xj.createElement(u, {
        flexDirection: "column"
    }, xj.createElement(A1, {
        onChange: X,
        onCancel: w,
        options: P
    })), K[12] = w, K[13] = X, K[14] = P, K[15] = W;
    else W = K[15];
    let D;
    if (K[16] !== H || K[17] !== W) D = xj.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, H, J, W), K[16] = H, K[17] = W, K[18] = D;
    else D = K[18];
    let Z;
    if (K[19] !== w || K[20] !== j || K[21] !== D) Z = xj.createElement(R1, {
        title: "Hooks",
        subtitle: j,
        onCancel: w
    }, D), K[19] = w, K[20] = j, K[21] = D, K[22] = Z;
    else Z = K[22];
    return Z
}
// @from(Ln 480707, Col 4)
xj
// @from(Ln 480708, Col 4)
siK = L(() => {
    o6();
    Qq();
    g6();
    gK();
    S4();
    xj = K6(P6(), 1)
})
// @from(Ln 480717, Col 0)
function tiK(q) {
    let K = s(19),
        {
            selectedEvent: _,
            selectedMatcher: z,
            hooksForSelectedMatcher: Y,
            hookEventMetadata: A,
            onSelect: O,
            onCancel: w
        } = q,
        $ = A.matcherMetadata !== void 0 ? `${_} - Matcher: ${z||"(all)"}` : _;
    if (Y.length === 0) {
        let P;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) P = yG.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, yG.createElement(T, {
            dimColor: !0
        }, "No hooks configured for this event."), yG.createElement(T, {
            dimColor: !0
        }, "To add hooks, edit settings.json directly or ask Claude.")), K[0] = P;
        else P = K[0];
        let W;
        if (K[1] !== A.description || K[2] !== w || K[3] !== $) W = yG.createElement(R1, {
            title: $,
            subtitle: A.description,
            onCancel: w,
            inputGuide: vlY
        }, P), K[1] = A.description, K[2] = w, K[3] = $, K[4] = W;
        else W = K[4];
        return W
    }
    let j = A.description,
        H;
    if (K[5] !== Y) H = Y.map(GlY), K[5] = Y, K[6] = H;
    else H = K[6];
    let J;
    if (K[7] !== Y || K[8] !== O) J = (P) => {
        let W = parseInt(P, 10),
            D = Y[W];
        if (D) O(D)
    }, K[7] = Y, K[8] = O, K[9] = J;
    else J = K[9];
    let X;
    if (K[10] !== w || K[11] !== H || K[12] !== J) X = yG.createElement(u, {
        flexDirection: "column"
    }, yG.createElement(A1, {
        options: H,
        onChange: J,
        onCancel: w
    })), K[10] = w, K[11] = H, K[12] = J, K[13] = X;
    else X = K[13];
    let M;
    if (K[14] !== A.description || K[15] !== w || K[16] !== X || K[17] !== $) M = yG.createElement(R1, {
        title: $,
        subtitle: j,
        onCancel: w
    }, X), K[14] = A.description, K[15] = w, K[16] = X, K[17] = $, K[18] = M;
    else M = K[18];
    return M
}
// @from(Ln 480779, Col 0)
function GlY(q, K) {
    return {
        label: `[${q.config.type}] ${DL(q.config)}`,
        value: K.toString(),
        description: q.source === "pluginHook" && q.pluginName ? `${Aj7(q.source)} (${q.pluginName})` : Aj7(q.source)
    }
}
// @from(Ln 480787, Col 0)
function vlY() {
    return yG.createElement(A8, {
        chord: "escape",
        action: "go back"
    })
}
// @from(Ln 480793, Col 4)
yG
// @from(Ln 480794, Col 4)
eiK = L(() => {
    o6();
    g6();
    Wu6();
    gK();
    S4();
    u7();
    yG = K6(P6(), 1)
})
// @from(Ln 480804, Col 0)
function qrK(q) {
    let K = s(25),
        {
            selectedEvent: _,
            matchersForSelectedEvent: z,
            hooksByEventAndMatcher: Y,
            eventDescription: A,
            onSelect: O,
            onCancel: w
        } = q,
        $;
    if (K[0] !== Y || K[1] !== z || K[2] !== _) {
        let W;
        if (K[4] !== Y || K[5] !== _) W = (D) => {
            let Z = Y[_]?.[D] || [],
                G = F4(Z.map(klY));
            return {
                matcher: D,
                sources: G,
                hookCount: Z.length
            }
        }, K[4] = Y, K[5] = _, K[6] = W;
        else W = K[6];
        $ = z.map(W), K[0] = Y, K[1] = z, K[2] = _, K[3] = $
    } else $ = K[3];
    let j = $;
    if (z.length === 0) {
        let W = `${_} - Matchers`,
            D;
        if (K[7] === Symbol.for("react.memo_cache_sentinel")) D = LG.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, LG.createElement(T, {
            dimColor: !0
        }, "No hooks configured for this event."), LG.createElement(T, {
            dimColor: !0
        }, "To add hooks, edit settings.json directly or ask Claude.")), K[7] = D;
        else D = K[7];
        let Z;
        if (K[8] !== A || K[9] !== w || K[10] !== W) Z = LG.createElement(R1, {
            title: W,
            subtitle: A,
            onCancel: w,
            inputGuide: VlY
        }, D), K[8] = A, K[9] = w, K[10] = W, K[11] = Z;
        else Z = K[11];
        return Z
    }
    let H = `${_} - Matchers`,
        J;
    if (K[12] !== j) J = j.map(TlY), K[12] = j, K[13] = J;
    else J = K[13];
    let X;
    if (K[14] !== O) X = (W) => {
        O(W)
    }, K[14] = O, K[15] = X;
    else X = K[15];
    let M;
    if (K[16] !== w || K[17] !== J || K[18] !== X) M = LG.createElement(u, {
        flexDirection: "column"
    }, LG.createElement(A1, {
        options: J,
        onChange: X,
        onCancel: w
    })), K[16] = w, K[17] = J, K[18] = X, K[19] = M;
    else M = K[19];
    let P;
    if (K[20] !== A || K[21] !== w || K[22] !== H || K[23] !== M) P = LG.createElement(R1, {
        title: H,
        subtitle: A,
        onCancel: w
    }, M), K[20] = A, K[21] = w, K[22] = H, K[23] = M, K[24] = P;
    else P = K[24];
    return P
}
// @from(Ln 480880, Col 0)
function TlY(q) {
    let K = q.sources.map(ciK).join(", "),
        _ = q.matcher || "(all)";
    return {
        label: `[${K}] ${_}`,
        value: q.matcher,
        description: `${q.hookCount} ${O7(q.hookCount,"hook")}`
    }
}
// @from(Ln 480890, Col 0)
function VlY() {
    return LG.createElement(A8, {
        chord: "escape",
        action: "go back"
    })
}
// @from(Ln 480897, Col 0)
function klY(q) {
    return q.source
}
// @from(Ln 480900, Col 4)
LG
// @from(Ln 480901, Col 4)
KrK = L(() => {
    o6();
    g6();
    Wu6();
    gK();
    S4();
    u7();
    LG = K6(P6(), 1)
})
// @from(Ln 480911, Col 0)
function _rK(q) {
    let K = s(40),
        {
            selectedHook: _,
            eventSupportsMatcher: z,
            onCancel: Y
        } = q,
        A;
    if (K[0] !== _.event) A = K_.createElement(T, null, "Event: ", K_.createElement(T, {
        bold: !0
    }, _.event)), K[0] = _.event, K[1] = A;
    else A = K[1];
    let O;
    if (K[2] !== z || K[3] !== _.matcher) O = z && K_.createElement(T, null, "Matcher: ", K_.createElement(T, {
        bold: !0
    }, _.matcher || "(all)")), K[2] = z, K[3] = _.matcher, K[4] = O;
    else O = K[4];
    let w;
    if (K[5] !== _.config.type) w = K_.createElement(T, null, "Type: ", K_.createElement(T, {
        bold: !0
    }, _.config.type)), K[5] = _.config.type, K[6] = w;
    else w = K[6];
    let $;
    if (K[7] !== _.source) $ = diK(_.source), K[7] = _.source, K[8] = $;
    else $ = K[8];
    let j;
    if (K[9] !== $) j = K_.createElement(T, null, "Source:", " ", K_.createElement(T, {
        dimColor: !0
    }, $)), K[9] = $, K[10] = j;
    else j = K[10];
    let H;
    if (K[11] !== _.pluginName) H = _.pluginName && K_.createElement(T, null, "Plugin: ", K_.createElement(T, {
        dimColor: !0
    }, _.pluginName)), K[11] = _.pluginName, K[12] = H;
    else H = K[12];
    let J;
    if (K[13] !== A || K[14] !== O || K[15] !== w || K[16] !== j || K[17] !== H) J = K_.createElement(u, {
        flexDirection: "column"
    }, A, O, w, j, H), K[13] = A, K[14] = O, K[15] = w, K[16] = j, K[17] = H, K[18] = J;
    else J = K[18];
    let X;
    if (K[19] !== _.config) X = ElY(_.config), K[19] = _.config, K[20] = X;
    else X = K[20];
    let M;
    if (K[21] !== X) M = K_.createElement(T, {
        dimColor: !0
    }, X, ":"), K[21] = X, K[22] = M;
    else M = K[22];
    let P;
    if (K[23] !== _.config) P = ylY(_.config), K[23] = _.config, K[24] = P;
    else P = K[24];
    let W;
    if (K[25] !== P) W = K_.createElement(u, {
        borderStyle: "round",
        borderDimColor: !0,
        paddingLeft: 1,
        paddingRight: 1
    }, K_.createElement(T, null, P)), K[25] = P, K[26] = W;
    else W = K[26];
    let D;
    if (K[27] !== W || K[28] !== M) D = K_.createElement(u, {
        flexDirection: "column"
    }, M, W), K[27] = W, K[28] = M, K[29] = D;
    else D = K[29];
    let Z;
    if (K[30] !== _.config) Z = "statusMessage" in _.config && _.config.statusMessage && K_.createElement(T, null, "Status message:", " ", K_.createElement(T, {
        dimColor: !0
    }, _.config.statusMessage)), K[30] = _.config, K[31] = Z;
    else Z = K[31];
    let G;
    if (K[32] === Symbol.for("react.memo_cache_sentinel")) G = K_.createElement(T, {
        dimColor: !0
    }, "To modify or remove this hook, edit settings.json directly or ask Claude to help."), K[32] = G;
    else G = K[32];
    let f;
    if (K[33] !== D || K[34] !== Z || K[35] !== J) f = K_.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, J, D, Z, G), K[33] = D, K[34] = Z, K[35] = J, K[36] = f;
    else f = K[36];
    let v;
    if (K[37] !== Y || K[38] !== f) v = K_.createElement(R1, {
        title: "Hook details",
        onCancel: Y,
        inputGuide: NlY
    }, f), K[37] = Y, K[38] = f, K[39] = v;
    else v = K[39];
    return v
}
// @from(Ln 481001, Col 0)
function NlY() {
    return K_.createElement(A8, {
        chord: "escape",
        action: "go back"
    })
}
// @from(Ln 481008, Col 0)
function ElY(q) {
    switch (q.type) {
        case "command":
            return "Command";
        case "prompt":
            return "Prompt";
        case "agent":
            return "Prompt";
        case "http":
            return "URL"
    }
}
// @from(Ln 481021, Col 0)
function ylY(q) {
    switch (q.type) {
        case "command":
            return q.command;
        case "prompt":
            return q.prompt;
        case "agent":
            return q.prompt;
        case "http":
            return q.url
    }
}
// @from(Ln 481033, Col 4)
K_
// @from(Ln 481034, Col 4)
zrK = L(() => {
    o6();
    g6();
    Wu6();
    S4();
    u7();
    K_ = K6(P6(), 1)
})
// @from(Ln 481043, Col 0)
function YrK(q) {
    let K = s(100),
        {
            toolNames: _,
            onExit: z
        } = q,
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = {
        mode: "select-event"
    }, K[0] = Y;
    else Y = K[0];
    let [A, O] = Yo8.useState(Y), [w, $] = Yo8.useState(blY), [j, H] = Yo8.useState(ClY), J;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) J = (q6) => {
        if (q6 === "policySettings") {
            let _6 = y7()?.disableAllHooks === !0;
            $(_6 && E1("policySettings")?.disableAllHooks === !0), H(E1("policySettings")?.allowManagedHooksOnly === !0)
        }
    }, K[1] = J;
    else J = K[1];
    gR6(J);
    let X = A.mode,
        M = "event" in A ? A.event : "PreToolUse",
        P = "matcher" in A ? A.matcher : null,
        W = M8(SlY),
        D = H9(),
        Z;
    if (K[2] !== W.tools || K[3] !== _) Z = [..._, ...W.tools.map(RlY)], K[2] = W.tools, K[3] = _, K[4] = Z;
    else Z = K[4];
    let G = Z,
        f;
    if (K[5] !== D || K[6] !== G) f = niK(D.getState(), G), K[5] = D, K[6] = G, K[7] = f;
    else f = K[7];
    let v = f,
        V;
    if (K[8] !== v || K[9] !== M) V = iiK(v, M), K[8] = v, K[9] = M, K[10] = V;
    else V = K[10];
    let k = V,
        N;
    if (K[11] !== v || K[12] !== M || K[13] !== P) N = riK(v, M, P), K[11] = v, K[12] = M, K[13] = P, K[14] = N;
    else N = K[14];
    let R = N,
        h;
    if (K[15] !== z) h = () => {
        z("Hooks dialog dismissed", {
            display: "system"
        })
    }, K[15] = z, K[16] = h;
    else h = K[16];
    let C = h,
        x = X === "select-event",
        B;
    if (K[17] !== x) B = {
        context: "Confirmation",
        isActive: x
    }, K[17] = x, K[18] = B;
    else B = K[18];
    G1("confirm:no", C, B);
    let m;
    if (K[19] === Symbol.for("react.memo_cache_sentinel")) m = () => {
        O({
            mode: "select-event"
        })
    }, K[19] = m;
    else m = K[19];
    let S = X === "select-matcher",
        F;
    if (K[20] !== S) F = {
        context: "Confirmation",
        isActive: S
    }, K[20] = S, K[21] = F;
    else F = K[21];
    G1("confirm:no", m, F);
    let U;
    if (K[22] !== G || K[23] !== A) U = () => {
        if ("event" in A)
            if (a_8(A.event, G) !== void 0) O({
                mode: "select-matcher",
                event: A.event
            });
            else O({
                mode: "select-event"
            })
    }, K[22] = G, K[23] = A, K[24] = U;
    else U = K[24];
    let g = X === "select-hook",
        c;
    if (K[25] !== g) c = {
        context: "Confirmation",
        isActive: g
    }, K[25] = g, K[26] = c;
    else c = K[26];
    G1("confirm:no", U, c);
    let n;
    if (K[27] !== A) n = () => {
        if (A.mode === "view-hook") {
            let {
                event: q6,
                hook: o
            } = A;
            O({
                mode: "select-hook",
                event: q6,
                matcher: o.matcher || ""
            })
        }
    }, K[27] = A, K[28] = n;
    else n = K[28];
    let l = X === "view-hook",
        z6;
    if (K[29] !== l) z6 = {
        context: "Confirmation",
        isActive: l
    }, K[29] = l, K[30] = z6;
    else z6 = K[30];
    G1("confirm:no", n, z6);
    let A6;
    if (K[31] !== G) A6 = zo8(G), K[31] = G, K[32] = A6;
    else A6 = K[32];
    let e = A6,
        O6 = y7()?.disableAllHooks === !0,
        J6;
    if (K[33] !== v) {
        let q6 = {},
            o = 0;
        for (let [_6, r] of Object.entries(v)) {
            let t = Object.values(r).reduce(hlY, 0);
            q6[_6] = t, o = o + t
        }
        J6 = {
            hooksByEvent: q6,
            totalHooksCount: o
        }, K[33] = v, K[34] = J6
    } else J6 = K[34];
    let {
        hooksByEvent: $6,
        totalHooksCount: H6
    } = J6;
    if (O6) {
        let q6;
        if (K[35] === Symbol.for("react.memo_cache_sentinel")) q6 = FY.createElement(T, {
            bold: !0
        }, "disabled"), K[35] = q6;
        else q6 = K[35];
        let o = w && " by a managed settings file",
            _6;
        if (K[36] !== H6) _6 = FY.createElement(T, {
            bold: !0
        }, H6), K[36] = H6, K[37] = _6;
        else _6 = K[37];
        let r;
        if (K[38] !== H6) r = O7(H6, "hook"), K[38] = H6, K[39] = r;
        else r = K[39];
        let t;
        if (K[40] !== H6) t = O7(H6, "is", "are"), K[40] = H6, K[41] = t;
        else t = K[41];
        let Y6;
        if (K[42] !== o || K[43] !== _6 || K[44] !== r || K[45] !== t) Y6 = FY.createElement(T, null, "All hooks are currently ", q6, o, ". You have", " ", _6, " configured", " ", r, " that", " ", t, " not running."), K[42] = o, K[43] = _6, K[44] = r, K[45] = t, K[46] = Y6;
        else Y6 = K[46];
        let X6, M6, W6, V6;
        if (K[47] === Symbol.for("react.memo_cache_sentinel")) X6 = FY.createElement(u, {
            marginTop: 1
        }, FY.createElement(T, {
            dimColor: !0
        }, "When hooks are disabled:")), M6 = FY.createElement(T, {
            dimColor: !0
        }, "· No hook commands will execute"), W6 = FY.createElement(T, {
            dimColor: !0
        }, "· StatusLine will not be displayed"), V6 = FY.createElement(T, {
            dimColor: !0
        }, "· Tool operations will proceed without hook validation"), K[47] = X6, K[48] = M6, K[49] = W6, K[50] = V6;
        else X6 = K[47], M6 = K[48], W6 = K[49], V6 = K[50];
        let f6;
        if (K[51] !== Y6) f6 = FY.createElement(u, {
            flexDirection: "column"
        }, Y6, X6, M6, W6, V6), K[51] = Y6, K[52] = f6;
        else f6 = K[52];
        let G6;
        if (K[53] !== w) G6 = !w && FY.createElement(T, {
            dimColor: !0
        }, 'To re-enable hooks, remove "disableAllHooks" from settings.json or ask Claude.'), K[53] = w, K[54] = G6;
        else G6 = K[54];
        let k6;
        if (K[55] !== f6 || K[56] !== G6) k6 = FY.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, f6, G6), K[55] = f6, K[56] = G6, K[57] = k6;
        else k6 = K[57];
        let T6;
        if (K[58] !== C || K[59] !== k6) T6 = FY.createElement(R1, {
            title: "Hook Configuration - Disabled",
            onCancel: C,
            inputGuide: LlY
        }, k6), K[58] = C, K[59] = k6, K[60] = T6;
        else T6 = K[60];
        return T6
    }
    switch (A.mode) {
        case "select-event": {
            let q6;
            if (K[61] !== G) q6 = (_6) => {
                if (a_8(_6, G) !== void 0) O({
                    mode: "select-matcher",
                    event: _6
                });
                else O({
                    mode: "select-hook",
                    event: _6,
                    matcher: ""
                })
            }, K[61] = G, K[62] = q6;
            else q6 = K[62];
            let o;
            if (K[63] !== C || K[64] !== e || K[65] !== $6 || K[66] !== j || K[67] !== q6 || K[68] !== H6) o = FY.createElement(aiK, {
                hookEventMetadata: e,
                hooksByEvent: $6,
                totalHooksCount: H6,
                restrictedByPolicy: j,
                onSelectEvent: q6,
                onCancel: C
            }), K[63] = C, K[64] = e, K[65] = $6, K[66] = j, K[67] = q6, K[68] = H6, K[69] = o;
            else o = K[69];
            return o
        }
        case "select-matcher": {
            let q6 = e[A.event],
                o;
            if (K[70] !== A.event) o = (t) => {
                O({
                    mode: "select-hook",
                    event: A.event,
                    matcher: t
                })
            }, K[70] = A.event, K[71] = o;
            else o = K[71];
            let _6;
            if (K[72] === Symbol.for("react.memo_cache_sentinel")) _6 = () => {
                O({
                    mode: "select-event"
                })
            }, K[72] = _6;
            else _6 = K[72];
            let r;
            if (K[73] !== v || K[74] !== A.event || K[75] !== k || K[76] !== q6.description || K[77] !== o) r = FY.createElement(qrK, {
                selectedEvent: A.event,
                matchersForSelectedEvent: k,
                hooksByEventAndMatcher: v,
                eventDescription: q6.description,
                onSelect: o,
                onCancel: _6
            }), K[73] = v, K[74] = A.event, K[75] = k, K[76] = q6.description, K[77] = o, K[78] = r;
            else r = K[78];
            return r
        }
        case "select-hook": {
            let q6 = e[A.event],
                o;
            if (K[79] !== A.event) o = (t) => {
                O({
                    mode: "view-hook",
                    event: A.event,
                    hook: t
                })
            }, K[79] = A.event, K[80] = o;
            else o = K[80];
            let _6;
            if (K[81] !== G || K[82] !== A.event) _6 = () => {
                if (a_8(A.event, G) !== void 0) O({
                    mode: "select-matcher",
                    event: A.event
                });
                else O({
                    mode: "select-event"
                })
            }, K[81] = G, K[82] = A.event, K[83] = _6;
            else _6 = K[83];
            let r;
            if (K[84] !== R || K[85] !== A.event || K[86] !== A.matcher || K[87] !== q6 || K[88] !== o || K[89] !== _6) r = FY.createElement(tiK, {
                selectedEvent: A.event,
                selectedMatcher: A.matcher,
                hooksForSelectedMatcher: R,
                hookEventMetadata: q6,
                onSelect: o,
                onCancel: _6
            }), K[84] = R, K[85] = A.event, K[86] = A.matcher, K[87] = q6, K[88] = o, K[89] = _6, K[90] = r;
            else r = K[90];
            return r
        }
        case "view-hook": {
            let q6 = A.hook,
                o;
            if (K[91] !== G || K[92] !== A.event) o = a_8(A.event, G), K[91] = G, K[92] = A.event, K[93] = o;
            else o = K[93];
            let _6 = o !== void 0,
                r;
            if (K[94] !== A) r = () => {
                let {
                    event: Y6,
                    hook: X6
                } = A;
                O({
                    mode: "select-hook",
                    event: Y6,
                    matcher: X6.matcher || ""
                })
            }, K[94] = A, K[95] = r;
            else r = K[95];
            let t;
            if (K[96] !== A.hook || K[97] !== _6 || K[98] !== r) t = FY.createElement(_rK, {
                selectedHook: q6,
                eventSupportsMatcher: _6,
                onCancel: r
            }), K[96] = A.hook, K[97] = _6, K[98] = r, K[99] = t;
            else t = K[99];
            return t
        }
    }
}
// @from(Ln 481361, Col 0)
function LlY() {
    return FY.createElement(A8, {
        chord: "escape",
        action: "close"
    })
}
// @from(Ln 481368, Col 0)
function hlY(q, K) {
    return q + K.length
}
// @from(Ln 481372, Col 0)
function RlY(q) {
    return q.name
}
// @from(Ln 481376, Col 0)
function SlY(q) {
    return q.mcp
}
// @from(Ln 481380, Col 0)
function ClY() {
    return E1("policySettings")?.allowManagedHooksOnly === !0
}
// @from(Ln 481384, Col 0)
function blY() {
    return y7()?.disableAllHooks === !0 && E1("policySettings")?.disableAllHooks === !0
}
// @from(Ln 481387, Col 4)
FY
// @from(Ln 481387, Col 8)
Yo8
// @from(Ln 481388, Col 4)
ArK = L(() => {
    o6();
    N7();
    Tu8();
    g6();
    C7();
    oiK();
    a1();
    S4();
    u7();
    siK();
    eiK();
    KrK();
    zrK();
    FY = K6(P6(), 1), Yo8 = K6(P6(), 1)
})
// @from(Ln 481404, Col 4)
OrK = {}
// @from(Ln 481408, Col 4)
Oj7
// @from(Ln 481408, Col 9)
IlY = async (q, K) => {
    d("tengu_hooks_command", {});
    let z = K.getAppState().toolPermissionContext,
        Y = YZ(z).map((A) => A.name);
    return Oj7.createElement(YrK, {
        toolNames: Y,
        onExit: q
    })
}
// @from(Ln 481417, Col 4)
wrK = L(() => {
    ArK();
    C8();
    $0();
    Oj7 = K6(P6(), 1)
})
// @from(Ln 481423, Col 4)
xlY
// @from(Ln 481423, Col 9)
$rK
// @from(Ln 481424, Col 4)
jrK = L(() => {
    xlY = {
        type: "local-jsx",
        name: "hooks",
        description: "View hook configurations for tool events",
        immediate: !0,
        load: () => Promise.resolve().then(() => (wrK(), OrK))
    }, $rK = xlY
})
// @from(Ln 481434, Col 0)
function HrK(q) {
    let K = s(39),
        {
            initialPrompt: _,
            existingHookPresent: z,
            onSubmit: Y,
            onCancel: A
        } = q,
        O = _ === void 0 ? "" : _,
        w = z === void 0 ? !1 : z,
        [$, j] = MZ.useState(O),
        [H, J] = MZ.useState(O.length),
        [X, M] = MZ.useState("input"),
        {
            columns: P
        } = s1(),
        W;
    if (K[0] !== $) W = $.trim(), K[0] = $, K[1] = W;
    else W = K[1];
    let D = W,
        Z = D.length === 0,
        G = w && Z,
        f;
    if (K[2] !== G || K[3] !== Z || K[4] !== Y || K[5] !== D) f = function() {
        if (Z && !G) return;
        Y(D)
    }, K[2] = G, K[3] = Z, K[4] = Y, K[5] = D, K[6] = f;
    else f = K[6];
    let v = f,
        V;
    if (K[7] !== Y) V = () => {
        Y("")
    }, K[7] = Y, K[8] = V;
    else V = K[8];
    let k = V,
        N;
    if (K[9] !== w || K[10] !== X || K[11] !== k) N = (z6) => {
        if (!w) return;
        if (z6.key === "tab") {
            z6.preventDefault(), M(ulY);
            return
        }
        if (X === "delete" && z6.key === "return") z6.preventDefault(), k()
    }, K[9] = w, K[10] = X, K[11] = k, K[12] = N;
    else N = K[12];
    let R = N,
        h;
    if (K[13] === Symbol.for("react.memo_cache_sentinel")) h = {
        context: "Settings",
        isActive: !0
    }, K[13] = h;
    else h = K[13];
    G1("confirm:no", A, h);
    let C;
    if (K[14] !== G || K[15] !== w || K[16] !== X) C = function(A6) {
        if (A6.pending) return MZ.default.createElement(T, null, "Press ", A6.keyName, " again to exit");
        return MZ.default.createElement(z1, null, MZ.default.createElement(A8, {
            chord: "enter",
            action: X === "delete" ? "delete hook" : G ? "delete hook" : w ? "update hook" : "add hook"
        }), w ? MZ.default.createElement(A8, {
            chord: "tab",
            action: "switch focus"
        }) : null, MZ.default.createElement(v1, {
            action: "confirm:no",
            context: "Settings",
            fallback: "Esc",
            description: "cancel"
        }))
    }, K[14] = G, K[15] = w, K[16] = X, K[17] = C;
    else C = K[17];
    let x = C,
        B;
    if (K[18] === Symbol.for("react.memo_cache_sentinel")) B = MZ.default.createElement(T, null, ">"), K[18] = B;
    else B = K[18];
    let m = X === "input",
        S = X === "input",
        F = P - 4,
        U;
    if (K[19] !== H || K[20] !== v || K[21] !== $ || K[22] !== m || K[23] !== S || K[24] !== F) U = MZ.default.createElement(u, {
        flexDirection: "row",
        gap: 1,
        marginTop: 1
    }, B, MZ.default.createElement(l4, {
        value: $,
        onChange: j,
        onSubmit: v,
        focus: m,
        showCursor: S,
        multiline: !1,
        columns: F,
        cursorOffset: H,
        onChangeCursorOffset: J,
        placeholder: "e.g. Has Claude completed all requested tasks?",
        disableEscapeDoublePress: !0
    })), K[19] = H, K[20] = v, K[21] = $, K[22] = m, K[23] = S, K[24] = F, K[25] = U;
    else U = K[25];
    let g;
    if (K[26] !== w || K[27] !== X) g = w && MZ.default.createElement(u, {
        marginTop: 1
    }, MZ.default.createElement(T, {
        color: X === "delete" ? "error" : void 0,
        dimColor: X !== "delete"
    }, X === "delete" ? "› " : "  ", "Delete this hook")), K[26] = w, K[27] = X, K[28] = g;
    else g = K[28];
    let c;
    if (K[29] !== U || K[30] !== g) c = MZ.default.createElement(u, {
        flexDirection: "column"
    }, U, g), K[29] = U, K[30] = g, K[31] = c;
    else c = K[31];
    let n;
    if (K[32] !== A || K[33] !== x || K[34] !== c) n = MZ.default.createElement(R1, {
        title: "Set Stop hook (this session only)",
        subtitle: "Enter a stopping condition. A good condition asks whether something has been done.",
        color: "permission",
        onCancel: A,
        inputGuide: x,
        isCancelActive: !1
    }, c), K[32] = A, K[33] = x, K[34] = c, K[35] = n;
    else n = K[35];
    let l;
    if (K[36] !== R || K[37] !== n) l = MZ.default.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: R
    }, n), K[36] = R, K[37] = n, K[38] = l;
    else l = K[38];
    return l
}
// @from(Ln 481564, Col 0)
function ulY(q) {
    return q === "input" ? "delete" : "input"
}
// @from(Ln 481567, Col 4)
MZ
// @from(Ln 481568, Col 4)
JrK = L(() => {
    o6();
    I4();
    g6();
    C7();
    bK();
    Nq();
    S4();
    u7();
    NY();
    MZ = K6(P6(), 1)
})
// @from(Ln 481580, Col 4)
XrK = {}
// @from(Ln 481585, Col 0)
function mlY(q, K) {
    let _ = u96(q, K, "Stop"),
        z = [];
    for (let Y of _.get("Stop") ?? []) {
        if (Y.matcher !== "") continue;
        for (let A of Y.hooks)
            if (A.type === "prompt") z.push(A)
    }
    return z
}
// @from(Ln 481595, Col 4)
wj7
// @from(Ln 481595, Col 9)
BlY = async (q, K, _) => {
    d("tengu_stop_hook_command", {});
    let {
        sessionHooksRegistry: z
    } = K, Y = I8(), A = mlY(K.getAppState(), Y), O = A[0]?.prompt, w = _.trim() || O || "";

    function $(H) {
        if (H.length === 0) {
            for (let X of A) z.remove(Y, "Stop", X);
            let J = A.length > 0 ? "Stop hook cleared" : "Cancelled";
            if (A.length > 0) d("tengu_stop_hook_removed", {});
            q(J, {
                display: "system"
            });
            return
        }
        if (O === H) {
            q("Stop hook unchanged", {
                display: "system"
            });
            return
        }
        for (let J of A) z.remove(Y, "Stop", J);
        z.add(Y, "Stop", "", {
            type: "prompt",
            prompt: H
        }), d("tengu_stop_hook_added", {
            promptLength: H.length
        }), q(A.length === 0 ? "Stop hook set" : "Stop hook updated", {
            display: "system"
        })
    }

    function j() {
        q("Cancelled", {
            display: "system"
        })
    }
    return wj7.createElement(HrK, {
        initialPrompt: w,
        existingHookPresent: O !== void 0,
        onSubmit: $,
        onCancel: j
    })
}
// @from(Ln 481640, Col 4)
MrK = L(() => {
    y8();
    JrK();
    C8();
    ty();
    wj7 = K6(P6(), 1)
})
// @from(Ln 481647, Col 4)
plY
// @from(Ln 481647, Col 9)
PrK
// @from(Ln 481648, Col 4)
WrK = L(() => {
    plY = {
        type: "local-jsx",
        name: "stop-hook",
        description: "Set a session-only Stop hook with a quick prompt",
        immediate: !0,
        isEnabled: () => !1,
        load: () => Promise.resolve().then(() => (MrK(), XrK))
    }, PrK = plY
})
// @from(Ln 481659, Col 0)
function ZrK(q, K) {
    return q.length > K ? q.slice(0, K - 1) + "…" : q
}
// @from(Ln 481663, Col 0)
function frK(q) {
    let K = s(83),
        {
            loops: _,
            onDelete: z,
            onCreate: Y,
            onCancel: A
        } = q,
        [O, w] = p9.useState("list"),
        [$, j] = p9.useState(0),
        [H, J] = p9.useState("every"),
        [X, M] = p9.useState("10m"),
        [P, W] = p9.useState(3),
        [D, Z] = p9.useState(""),
        [G, f] = p9.useState(0),
        [v, V] = p9.useState(H === "every" ? "interval" : "text"),
        {
            columns: k
        } = s1(),
        N;
    if (K[0] !== _.length) N = {
        "select:previous": () => j((a6) => _.length ? Math.max(0, a6 - 1) : 0),
        "select:next": () => j((a6) => _.length ? Math.min(_.length - 1, a6 + 1) : 0)
    }, K[0] = _.length, K[1] = N;
    else N = K[1];
    let R = O === "list",
        h;
    if (K[2] !== R) h = {
        context: "Select",
        isActive: R
    }, K[2] = R, K[3] = h;
    else h = K[3];
    L7(N, h);
    let C;
    if (K[4] !== _ || K[5] !== H || K[6] !== A || K[7] !== z || K[8] !== $ || K[9] !== O) C = (a6) => {
        if (O !== "list") return;
        if (a6.key === "escape") {
            a6.preventDefault(), A();
            return
        }
        if (a6.key === "d" && _[$]) {
            a6.preventDefault(), z(_[$]), j((D8) => Math.max(0, Math.min(D8, _.length - 2)));
            return
        }
        if (a6.key === "n") a6.preventDefault(), w("create"), V(H === "every" ? "interval" : "text")
    }, K[4] = _, K[5] = H, K[6] = A, K[7] = z, K[8] = $, K[9] = O, K[10] = C;
    else C = K[10];
    let x = C,
        B;
    if (K[11] !== H) B = () => {
        let a6 = H === "every" ? "until" : "every";
        J(a6), V(a6 === "every" ? "interval" : "text")
    }, K[11] = H, K[12] = B;
    else B = K[12];
    let m = B,
        S;
    if (K[13] !== v || K[14] !== X || K[15] !== P || K[16] !== H || K[17] !== D.length || K[18] !== G || K[19] !== m || K[20] !== O) S = (a6) => {
        if (O !== "create") return;
        if (a6.key === "escape") {
            a6.preventDefault(), w("list");
            return
        }
        if (a6.key === "tab") {
            a6.preventDefault(), m();
            return
        }
        let D8 = v === "interval" ? P : G,
            Q6 = v === "interval" ? X.length : D.length;
        if (a6.key === "left" && D8 === 0 || a6.key === "right" && D8 >= Q6) {
            a6.preventDefault(), m();
            return
        }
        if (H === "every" && (a6.key === "down" || a6.key === "up")) a6.preventDefault(), V(FlY)
    }, K[13] = v, K[14] = X, K[15] = P, K[16] = H, K[17] = D.length, K[18] = G, K[19] = m, K[20] = O, K[21] = S;
    else S = K[21];
    let F = S,
        U;
    if (K[22] !== X || K[23] !== H || K[24] !== Y || K[25] !== D) U = function() {
        let D8 = D.trim();
        if (H === "every") {
            if (!X.trim() || !D8) return;
            Y({
                kind: "cron",
                interval: X.trim(),
                prompt: D8
            })
        } else {
            if (!D8) return;
            Y({
                kind: "stophook",
                condition: D8
            })
        }
    }, K[22] = X, K[23] = H, K[24] = Y, K[25] = D, K[26] = U;
    else U = K[26];
    let g = U,
        c;
    if (K[27] !== $) c = function(D8, Q6) {
        let W8 = Q6 === $;
        if (D8.kind === "cron") return p9.default.createElement(TR, {
            key: D8.id,
            isFocused: W8
        }, p9.default.createElement(T, null, p9.default.createElement(T, {
            bold: !0
        }, D8.human), p9.default.createElement(T, {
            dimColor: !0
        }, " · "), ZrK(D8.prompt, DrK), p9.default.createElement(T, {
            dimColor: !0
        }, " · ", D8.id)));
        return p9.default.createElement(TR, {
            key: D8.id,
            isFocused: W8
        }, p9.default.createElement(T, null, "until ", p9.default.createElement(T, {
            bold: !0
        }, ZrK(D8.condition, DrK)), p9.default.createElement(T, {
            dimColor: !0
        }, " · stop-hook")))
    }, K[27] = $, K[28] = c;
    else c = K[28];
    let n = c,
        l;
    if (K[29] !== _.length) l = function() {
        return p9.default.createElement(z1, null, _.length > 0 && p9.default.createElement(A8, {
            chord: ["up", "down"],
            action: "select"
        }), _.length > 0 && p9.default.createElement(A8, {
            chord: "d",
            action: "delete"
        }), p9.default.createElement(A8, {
            chord: "n",
            action: "new"
        }), p9.default.createElement(A8, {
            chord: "escape",
            action: "close"
        }))
    }, K[29] = _.length, K[30] = l;
    else l = K[30];
    let z6 = l,
        A6;
    if (K[31] !== H) A6 = function() {
        return p9.default.createElement(z1, null, p9.default.createElement(A8, {
            chord: "tab",
            action: "switch mode"
        }), H === "every" && p9.default.createElement(A8, {
            chord: ["up", "down"],
            action: "next field"
        }), p9.default.createElement(A8, {
            chord: "enter",
            action: "create"
        }), p9.default.createElement(A8, {
            chord: "escape",
            action: "back"
        }))
    }, K[31] = H, K[32] = A6;
    else A6 = K[32];
    let e = A6,
        i = H !== "every",
        O6 = H === "every" ? e6.radioOn : e6.radioOff,
        J6;
    if (K[33] !== i || K[34] !== O6) J6 = p9.default.createElement(T, {
        dimColor: i
    }, O6, " every"), K[33] = i, K[34] = O6, K[35] = J6;
    else J6 = K[35];
    let $6;
    if (K[36] === Symbol.for("react.memo_cache_sentinel")) $6 = p9.default.createElement(T, {
        dimColor: !0
    }, "  "), K[36] = $6;
    else $6 = K[36];
    let H6 = H !== "until",
        q6 = H === "until" ? e6.radioOn : e6.radioOff,
        o;
    if (K[37] !== H6 || K[38] !== q6) o = p9.default.createElement(T, {
        dimColor: H6
    }, q6, " until"), K[37] = H6, K[38] = q6, K[39] = o;
    else o = K[39];
    let _6;
    if (K[40] !== J6 || K[41] !== o) _6 = p9.default.createElement(T, null, J6, $6, o), K[40] = J6, K[41] = o, K[42] = _6;
    else _6 = K[42];
    let r;
    if (K[43] !== v || K[44] !== X || K[45] !== P || K[46] !== H) r = H === "every" && p9.default.createElement(u, {
        flexDirection: "row",
        gap: 1,
        marginTop: 1
    }, p9.default.createElement(T, {
        dimColor: v !== "interval"
    }, "Interval >"), p9.default.createElement(l4, {
        value: X,
        onChange: M,
        onSubmit: () => V("text"),
        focus: v === "interval",
        showCursor: v === "interval",
        multiline: !1,
        columns: 12,
        cursorOffset: P,
        onChangeCursorOffset: W,
        placeholder: "10m",
        disableEscapeDoublePress: !0
    })), K[43] = v, K[44] = X, K[45] = P, K[46] = H, K[47] = r;
    else r = K[47];
    let t = H === "every" && v !== "text",
        Y6 = H === "every" ? "Prompt   >" : "Condition>",
        X6;
    if (K[48] !== t || K[49] !== Y6) X6 = p9.default.createElement(T, {
        dimColor: t
    }, Y6), K[48] = t, K[49] = Y6, K[50] = X6;
    else X6 = K[50];
    let M6 = H === "until" || v === "text",
        W6 = H === "until" || v === "text",
        V6 = k - 16,
        f6 = H === "every" ? "e.g. /babysit-prs" : "e.g. tests pass and PR is merged",
        G6;
    if (K[51] !== g || K[52] !== M6 || K[53] !== W6 || K[54] !== V6 || K[55] !== f6 || K[56] !== D || K[57] !== G) G6 = p9.default.createElement(l4, {
        value: D,
        onChange: Z,
        onSubmit: g,
        focus: M6,
        showCursor: W6,
        multiline: !1,
        columns: V6,
        cursorOffset: G,
        onChangeCursorOffset: f,
        placeholder: f6,
        disableEscapeDoublePress: !0
    }), K[51] = g, K[52] = M6, K[53] = W6, K[54] = V6, K[55] = f6, K[56] = D, K[57] = G, K[58] = G6;
    else G6 = K[58];
    let k6;
    if (K[59] !== X6 || K[60] !== G6) k6 = p9.default.createElement(u, {
        flexDirection: "row",
        gap: 1,
        marginTop: 1
    }, X6, G6), K[59] = X6, K[60] = G6, K[61] = k6;
    else k6 = K[61];
    let T6;
    if (K[62] !== _6 || K[63] !== r || K[64] !== k6) T6 = p9.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, _6, r, k6), K[62] = _6, K[63] = r, K[64] = k6, K[65] = T6;
    else T6 = K[65];
    let v6 = T6,
        L6;
    if (K[66] !== _ || K[67] !== n) L6 = _.length === 0 ? p9.default.createElement(T, {
        dimColor: !0
    }, "No active loops") : _.map(n), K[66] = _, K[67] = n, K[68] = L6;
    else L6 = K[68];
    let y6;
    if (K[69] !== L6) y6 = p9.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, L6), K[69] = L6, K[70] = y6;
    else y6 = K[70];
    let c6 = y6,
        Z8 = O === "list" ? x : F,
        N8 = O === "list" ? "Loops" : "New loop",
        R6 = O === "list" ? "Recurring crons and stop-hooks active for this session" : void 0,
        p6;
    if (K[71] !== A || K[72] !== O) p6 = O === "list" ? A : () => w("list"), K[71] = A, K[72] = O, K[73] = p6;
    else p6 = K[73];
    let q8 = O === "list" ? z6 : e,
        L8 = O === "list" ? c6 : v6,
        w8;
    if (K[74] !== N8 || K[75] !== R6 || K[76] !== p6 || K[77] !== q8 || K[78] !== L8) w8 = p9.default.createElement(R1, {
        title: N8,
        subtitle: R6,
        color: "permission",
        onCancel: p6,
        isCancelActive: !1,
        inputGuide: q8
    }, L8), K[74] = N8, K[75] = R6, K[76] = p6, K[77] = q8, K[78] = L8, K[79] = w8;
    else w8 = K[79];
    let x8;
    if (K[80] !== Z8 || K[81] !== w8) x8 = p9.default.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: Z8
    }, w8), K[80] = Z8, K[81] = w8, K[82] = x8;
    else x8 = K[82];
    return x8
}
// @from(Ln 481943, Col 0)
function FlY(q) {
    return q === "interval" ? "text" : "interval"
}
// @from(Ln 481946, Col 4)
p9
// @from(Ln 481946, Col 8)
DrK = 50
// @from(Ln 481947, Col 4)
GrK = L(() => {
    o6();
    Qq();
    I4();
    g6();
    C7();
    Nq();
    S4();
    u7();
    xE6();
    NY();
    p9 = K6(P6(), 1)
})
// @from(Ln 481960, Col 4)
vrK = {}
// @from(Ln 481965, Col 0)
function UlY(q) {
    let K = q.match(glY);
    if (!K) return null;
    let _ = parseInt(K[1], 10);
    if (_ < 1) return null;
    let z;
    switch (K[2].toLowerCase()) {
        case "s":
            z = `*/${Math.max(1,Math.ceil(_/60))} * * * *`;
            break;
        case "m":
            z = _ <= 59 ? `*/${_} * * * *` : `0 */${Math.round(_/60)} * * *`;
            break;
        case "h":
            if (_ > 23) return null;
            z = `0 */${_} * * *`;
            break;
        case "d":
            if (_ > 31) return null;
            z = `0 0 */${_} * *`;
            break;
        default:
            return null
    }
    return gj6(z) ? z : null
}
// @from(Ln 481991, Col 4)
$j7
// @from(Ln 481991, Col 9)
glY
// @from(Ln 481991, Col 14)
QlY = async (q, K) => {
    d("tengu_loops_command", {});
    let {
        sessionHooksRegistry: _
    } = K, z = I8(), Y = await IK6(), A = u96(K.getAppState(), z, "Stop").get("Stop") ?? [], O = [];
    for (let H of A) {
        if (H.matcher !== "") continue;
        for (let J of H.hooks)
            if (J.type === "prompt") O.push(J)
    }
    let w = [...Y.map((H) => ({
        kind: "cron",
        id: H.id,
        cron: H.cron,
        human: Np(H.cron),
        prompt: H.prompt
    })), ...O.map((H, J) => ({
        kind: "stophook",
        id: `stophook-${J}`,
        condition: H.prompt
    }))];
    async function $(H) {
        if (H.kind === "cron") {
            try {
                await hs([H.id]), q(`Loop ${H.id} deleted`, {
                    display: "system"
                })
            } catch (X) {
                q(`Failed to delete loop ${H.id}: ${X}`, {
                    display: "system"
                })
            }
            return
        }
        let J = O.find((X) => X.prompt === H.condition);
        if (J) _.remove(z, "Stop", J), q("Stop hook cleared", {
            display: "system"
        });
        else q("Stop hook not found", {
            display: "system"
        })
    }
    async function j(H) {
        if (H.kind === "cron") {
            let J = UlY(H.interval);
            if (!J) {
                q(`Invalid interval: ${H.interval}`, {
                    display: "system"
                });
                return
            }
            let X = await UR8(J, H.prompt, !0, !1);
            q(`Loop ${X} created (${Np(J)})`, {
                display: "system"
            });
            return
        }
        for (let J of O) _.remove(z, "Stop", J);
        _.add(z, "Stop", "", {
            type: "prompt",
            prompt: H.condition
        }), d("tengu_stop_hook_added", {
            promptLength: H.condition.length
        }), q("Stop hook set", {
            display: "system"
        })
    }
    return $j7.createElement(frK, {
        loops: w,
        onDelete: (H) => void $(H),
        onCreate: (H) => void j(H),
        onCancel: () => q("", {
            display: "skip"
        })
    })
}
// @from(Ln 482067, Col 4)
TrK = L(() => {
    y8();
    GrK();
    C8();
    Uj6();
    yp();
    ty();
    $j7 = K6(P6(), 1), glY = /^(\d+)([smhd])$/i
})
// @from(Ln 482076, Col 4)
dlY
// @from(Ln 482076, Col 9)
VrK
// @from(Ln 482077, Col 4)
krK = L(() => {
    QR();
    dlY = {
        type: "local-jsx",
        name: "loops",
        description: "List, create, and delete recurring loops and stop-hooks",
        immediate: !0,
        isEnabled: () => !1,
        load: () => Promise.resolve().then(() => (TrK(), vrK))
    }, VrK = dlY
})
// @from(Ln 482088, Col 4)
NrK = {}
// @from(Ln 482095, Col 0)
async function llY(q, K) {
    let _ = K.readFileState ? gK6(K.readFileState) : [];
    if (_.length === 0) return {
        type: "text",
        value: "No files in context"
    };
    return {
        type: "text",
        value: `Files in context:
${_.map((Y)=>clY(b8(),Y)).join(`
`)}`
    }
}
// @from(Ln 482108, Col 4)
ErK = L(() => {
    n7();
    FP()
})
// @from(Ln 482112, Col 4)
nlY
// @from(Ln 482112, Col 9)
Ao8
// @from(Ln 482113, Col 4)
yrK = L(() => {
    nlY = {
        type: "local",
        name: "files",
        description: "List all files currently in context",
        isEnabled: () => !1,
        supportsNonInteractive: !0,
        load: () => Promise.resolve().then(() => (ErK(), NrK))
    }, Ao8 = nlY
})
// @from(Ln 482123, Col 4)
ilY
// @from(Ln 482123, Col 9)
LrK
// @from(Ln 482124, Col 4)
hrK = L(() => {
    ilY = {
        type: "local-jsx",
        name: "branch",
        aliases: ["fork"],
        description: "Create a branch of the current conversation at this point",
        argumentHint: "[name]",
        load: () => Promise.resolve().then(() => (GA7(), fA7))
    }, LrK = ilY
})
// @from(Ln 482135, Col 0)
function rlY(q, K, _, z) {
    var Y = -1,
        A = q == null ? 0 : q.length;
    while (++Y < A) {
        var O = q[Y];
        K(z, O, _(O), q)
    }
    return z
}
// @from(Ln 482144, Col 4)
RrK
// @from(Ln 482145, Col 4)
SrK = L(() => {
    RrK = rlY
})
// @from(Ln 482149, Col 0)
function olY(q, K, _, z) {
    return Ml8(q, function(Y, A, O) {
        K(z, Y, _(Y), O)
    }), z
}
// @from(Ln 482154, Col 4)
CrK
// @from(Ln 482155, Col 4)
brK = L(() => {
    fz7();
    CrK = olY
})
// @from(Ln 482160, Col 0)
function alY(q, K) {
    return function(_, z) {
        var Y = uO(_) ? RrK : CrK,
            A = K ? K() : {};
        return Y(_, q, xN(z, 2), A)
    }
}
// @from(Ln 482167, Col 4)
IrK
// @from(Ln 482168, Col 4)
xrK = L(() => {
    SrK();
    brK();
    N86();
    YV();
    IrK = alY
})
// @from(Ln 482175, Col 4)
slY
// @from(Ln 482175, Col 9)
Oo8
// @from(Ln 482176, Col 4)
jj7 = L(() => {
    xrK();
    slY = IrK(function(q, K, _) {
        q[_ ? 0 : 1].push(K)
    }, function() {
        return [
            [],
            []
        ]
    }), Oo8 = slY
})
// @from(Ln 482188, Col 0)
function Du6(q, K, _) {
    let [z, Y] = Oo8(j2([...q, ...K], "name"), yJ), A = (w, $) => w.name.localeCompare($.name);
    return [...Y.sort(A), ...z.sort(A)]
}
// @from(Ln 482192, Col 4)
wo8 = L(() => {
    jj7();
    tI();
    Sh6()
})
// @from(Ln 482198, Col 0)
function $o8(q, K, _) {
    let z = M8((A) => A.replBridgeEnabled),
        Y = M8((A) => A.replBridgeOutboundOnly);
    return K11(z && !Y), urK.useMemo(() => {
        let A = cl(_, K);
        return Du6(q, A, _.mode)
    }, [q, K, _, z, Y])
}
// @from(Ln 482206, Col 4)
urK
// @from(Ln 482207, Col 4)
Hj7 = L(() => {
    y8();
    N7();
    $0();
    wo8();
    urK = K6(P6(), 1)
})
// @from(Ln 482215, Col 0)
function jo8(q, K) {
    let _ = new Map;
    for (let A of K) _.set(A.agentType, A);
    let z = new Set,
        Y = [];
    for (let A of q) {
        let O = `${A.agentType}:${A.source}`;
        if (z.has(O)) continue;
        z.add(O);
        let w = _.get(A.agentType),
            $ = w && w.source !== A.source ? w.source : void 0;
        Y.push({
            ...A,
            overriddenBy: $
        })
    }
    return Y
}
// @from(Ln 482234, Col 0)
function Ho8(q) {
    let K = q.model || D77();
    if (!K) return;
    return K === "inherit" ? "inherit" : K
}
// @from(Ln 482240, Col 0)
function Jo8(q) {
    return sf6(q).toLowerCase()
}
// @from(Ln 482244, Col 0)
function Xo8(q, K) {
    return q.agentType.localeCompare(K.agentType, void 0, {
        sensitivity: "base"
    })
}
// @from(Ln 482249, Col 4)
s_8
// @from(Ln 482250, Col 4)
Mo8 = L(() => {
    Z96();
    aY();
    s_8 = [{
        label: "User agents",
        source: "userSettings"
    }, {
        label: "Project agents",
        source: "projectSettings"
    }, {
        label: "Local agents",
        source: "localSettings"
    }, {
        label: "Managed agents",
        source: "policySettings"
    }, {
        label: "Plugin agents",
        source: "plugin"
    }, {
        label: "CLI arg agents",
        source: "flagSettings"
    }, {
        label: "Built-in agents",
        source: "built-in"
    }]
})
// @from(Ln 482276, Col 4)
Sn
// @from(Ln 482277, Col 4)
mrK = L(() => {
    Sn = {
        FOLDER_NAME: ".claude",
        AGENTS_DIR: "agents"
    }
})
// @from(Ln 482293, Col 0)
function _nY(q, K, _, z, Y, A, O, w) {
    let $ = K.replaceAll("\\", "\\\\").replaceAll('"', "\\\"").replaceAll(`
`, "\\\\n"),
        H = _ === void 0 || _.length === 1 && _[0] === "*" ? "" : `
tools: ${_.join(", ")}`,
        J = A ? `
model: ${A}` : "",
        X = w !== void 0 ? `
effort: ${w}` : "",
        M = Y ? `
color: ${Y}` : "",
        P = O ? `
memory: ${O}` : "";
    return `---
name: "${q}"
description: "${$}"${H}${J}${X}${M}${P}
---

${z}
`
}
// @from(Ln 482315, Col 0)
function Po8(q) {
    switch (q) {
        case "flagSettings":
            throw Error(`Cannot get directory path for ${q} agents`);
        case "userSettings":
            return Cn(A7(), Sn.AGENTS_DIR);
        case "projectSettings":
            return Cn(b8(), Sn.FOLDER_NAME, Sn.AGENTS_DIR);
        case "policySettings":
            return Cn(SW(), Sn.FOLDER_NAME, Sn.AGENTS_DIR);
        case "localSettings":
            return Cn(b8(), Sn.FOLDER_NAME, Sn.AGENTS_DIR)
    }
}
// @from(Ln 482330, Col 0)
function BrK(q) {
    switch (q) {
        case "projectSettings":
            return Cn(".", Sn.FOLDER_NAME, Sn.AGENTS_DIR);
        default:
            return Po8(q)
    }
}
// @from(Ln 482339, Col 0)
function Jj7(q) {
    let K = Po8(q.source);
    return Cn(K, `${q.agentType}.md`)
}
// @from(Ln 482344, Col 0)
function Wo8(q) {
    if (q.source === "built-in") return "Built-in";
    if (q.source === "plugin") throw Error("Cannot get file path for plugin agents");
    let K = q.filename || q.agentType;
    if (q.baseDir) return Cn(q.baseDir, `${K}.md`);
    let _ = Po8(q.source);
    return Cn(_, `${K}.md`)
}
// @from(Ln 482353, Col 0)
function prK(q) {
    if (q.source === "built-in") return "Built-in";
    let K = BrK(q.source);
    return Cn(K, `${q.agentType}.md`)
}
// @from(Ln 482359, Col 0)
function FrK(q) {
    if (Vj(q)) return "Built-in";
    if (T88(q)) return `Plugin: ${q.plugin||"Unknown"}`;
    if (q.source === "flagSettings") return "CLI argument";
    let K = BrK(q.source),
        _ = q.filename || q.agentType;
    return Cn(K, `${_}.md`)
}
// @from(Ln 482367, Col 0)
async function znY(q) {
    let K = Po8(q);
    return await tlY(K, {
        recursive: !0
    }), K
}
// @from(Ln 482373, Col 0)
async function grK(q, K, _, z, Y, A = !0, O, w, $, j) {
    if (q === "built-in") throw Error("Cannot save built-in agents");
    await znY(q);
    let H = Jj7({
            source: q,
            agentType: K
        }),
        J = _nY(K, _, z, Y, O, w, $, j);
    try {
        await drK(H, J, A ? "wx" : "w")
    } catch (X) {
        if (Q1(X) === "EEXIST") throw Error(`Agent file already exists: ${H}`);
        throw X
    }
}
// @from(Ln 482388, Col 0)
async function UrK(q, K) {
    if (q.source === "built-in") throw Error("Cannot update built-in agents");
    let _ = Wo8(q),
        z = await qnY(_, "utf-8"),
        {
            frontmatter: Y,
            content: A
        } = p2(z, _),
        O = {
            ...Y
        };
    if ("tools" in K) {
        let w = K.tools;
        if (w === void 0 || w.length === 1 && w[0] === "*") delete O.tools;
        else O.tools = w.join(", ")
    }
    if ("color" in K)
        if (K.color) O.color = K.color;
        else delete O.color;
    if ("model" in K)
        if (K.model) O.model = K.model;
        else delete O.model;
    await drK(_, `---
${DM4(O)}---
${A}`)
}
// @from(Ln 482414, Col 0)
async function QrK(q) {
    if (q.source === "built-in") throw Error("Cannot delete built-in agents");
    let K = Wo8(q);
    try {
        await KnY(K)
    } catch (_) {
        if (Q1(_) !== "ENOENT") throw _
    }
}
// @from(Ln 482423, Col 0)
async function drK(q, K, _ = "w") {
    let z = await elY(q, _);
    try {
        await z.writeFile(K, {
            encoding: "utf-8"
        }), await z.datasync()
    } finally {
        await z.close()
    }
}
// @from(Ln 482433, Col 4)
Zu6 = L(() => {
    Rm();
    cP();
    n7();
    Q8();
    m8();
    Lf();
    mrK()
})
// @from(Ln 482443, Col 0)
function crK(q) {
    let K = s(49),
        {
            agent: _,
            tools: z,
            onBack: Y
        } = q,
        A;
    if (K[0] !== _ || K[1] !== z) A = lt(_, z, !1), K[0] = _, K[1] = z, K[2] = A;
    else A = K[2];
    let O = A,
        w;
    if (K[3] !== _) w = FrK(_), K[3] = _, K[4] = w;
    else w = K[4];
    let $ = w,
        j;
    if (K[5] !== _.agentType) j = cs(_.agentType), K[5] = _.agentType, K[6] = j;
    else j = K[6];
    let H = j,
        J;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Confirmation"
    }, K[7] = J;
    else J = K[7];
    G1("confirm:no", Y, J);
    let X;
    if (K[8] !== Y) X = (m) => {
        if (m.key === "return") m.preventDefault(), Y()
    }, K[8] = Y, K[9] = X;
    else X = K[9];
    let M = X,
        P;
    if (K[10] !== $) P = V4.createElement(T, {
        dimColor: !0
    }, $), K[10] = $, K[11] = P;
    else P = K[11];
    let W;
    if (K[12] === Symbol.for("react.memo_cache_sentinel")) W = V4.createElement(T, null, V4.createElement(T, {
        bold: !0
    }, "Description"), " (tells Claude when to use this agent):"), K[12] = W;
    else W = K[12];
    let D;
    if (K[13] !== _.whenToUse) D = V4.createElement(u, {
        flexDirection: "column"
    }, W, V4.createElement(u, {
        marginLeft: 2
    }, V4.createElement(T, null, _.whenToUse))), K[13] = _.whenToUse, K[14] = D;
    else D = K[14];
    let Z;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) Z = V4.createElement(T, null, V4.createElement(T, {
        bold: !0
    }, "Tools"), ":", " "), K[15] = Z;
    else Z = K[15];
    let G;
    if (K[16] !== _ || K[17] !== O) G = V4.createElement(u, null, Z, V4.createElement(YnY, {
        resolvedTools: O,
        agent: _
    })), K[16] = _, K[17] = O, K[18] = G;
    else G = K[18];
    let f;
    if (K[19] === Symbol.for("react.memo_cache_sentinel")) f = V4.createElement(T, {
        bold: !0
    }, "Model"), K[19] = f;
    else f = K[19];
    let v;
    if (K[20] !== _.model) v = _g8(_.model), K[20] = _.model, K[21] = v;
    else v = K[21];
    let V;
    if (K[22] !== v) V = V4.createElement(T, null, f, ": ", v), K[22] = v, K[23] = V;
    else V = K[23];
    let k;
    if (K[24] !== _.permissionMode) k = _.permissionMode && V4.createElement(T, null, V4.createElement(T, {
        bold: !0
    }, "Permission mode"), ": ", _.permissionMode), K[24] = _.permissionMode, K[25] = k;
    else k = K[25];
    let N;
    if (K[26] !== _.memory) N = _.memory && V4.createElement(T, null, V4.createElement(T, {
        bold: !0
    }, "Memory"), ": ", Do8(_.memory)), K[26] = _.memory, K[27] = N;
    else N = K[27];
    let R;
    if (K[28] !== _.hooks) R = _.hooks && Object.keys(_.hooks).length > 0 && V4.createElement(T, null, V4.createElement(T, {
        bold: !0
    }, "Hooks"), ": ", Object.keys(_.hooks).join(", ")), K[28] = _.hooks, K[29] = R;
    else R = K[29];
    let h;
    if (K[30] !== _.skills) h = _.skills && _.skills.length > 0 && V4.createElement(T, null, V4.createElement(T, {
        bold: !0
    }, "Skills"), ":", " ", _.skills.length > 10 ? `${_.skills.length} skills` : _.skills.join(", ")), K[30] = _.skills, K[31] = h;
    else h = K[31];
    let C;
    if (K[32] !== _.agentType || K[33] !== H) C = H && V4.createElement(u, null, V4.createElement(T, null, V4.createElement(T, {
        bold: !0
    }, "Color"), ":", " ", V4.createElement(T, {
        backgroundColor: H,
        color: "inverseText"
    }, " ", _.agentType, " "))), K[32] = _.agentType, K[33] = H, K[34] = C;
    else C = K[34];
    let x;
    if (K[35] !== _) x = !Vj(_) && V4.createElement(V4.Fragment, null, V4.createElement(u, null, V4.createElement(T, null, V4.createElement(T, {
        bold: !0
    }, "System prompt"), ":")), V4.createElement(u, {
        marginLeft: 2,
        marginRight: 2
    }, V4.createElement(xw, null, _.getSystemPrompt()))), K[35] = _, K[36] = x;
    else x = K[36];
    let B;
    if (K[37] !== M || K[38] !== G || K[39] !== V || K[40] !== k || K[41] !== N || K[42] !== R || K[43] !== h || K[44] !== C || K[45] !== x || K[46] !== P || K[47] !== D) B = V4.createElement(u, {
        flexDirection: "column",
        gap: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: M
    }, P, D, G, V, k, N, R, h, C, x), K[37] = M, K[38] = G, K[39] = V, K[40] = k, K[41] = N, K[42] = R, K[43] = h, K[44] = C, K[45] = x, K[46] = P, K[47] = D, K[48] = B;
    else B = K[48];
    return B
}
// @from(Ln 482561, Col 0)
function YnY(q) {
    let K = s(9),
        {
            resolvedTools: _,
            agent: z
        } = q;
    if (_.hasWildcard) {
        let w;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = V4.createElement(T, null, "All tools"), K[0] = w;
        else w = K[0];
        return w
    }
    if (!z.tools || z.tools.length === 0) {
        let w;
        if (K[1] === Symbol.for("react.memo_cache_sentinel")) w = V4.createElement(T, null, "None"), K[1] = w;
        else w = K[1];
        return w
    }
    let Y;
    if (K[2] !== _.validTools) Y = _.validTools.length > 0 && V4.createElement(T, null, _.validTools.join(", ")), K[2] = _.validTools, K[3] = Y;
    else Y = K[3];
    let A;
    if (K[4] !== _.invalidTools) A = _.invalidTools.length > 0 && V4.createElement(T, {
        color: "warning"
    }, e6.warning, " Unrecognized:", " ", _.invalidTools.join(", ")), K[4] = _.invalidTools, K[5] = A;
    else A = K[5];
    let O;
    if (K[6] !== Y || K[7] !== A) O = V4.createElement(V4.Fragment, null, Y, A), K[6] = Y, K[7] = A, K[8] = O;
    else O = K[8];
    return O
}
// @from(Ln 482592, Col 4)
V4
// @from(Ln 482593, Col 4)
lrK = L(() => {
    o6();
    Qq();
    g6();
    C7();
    Uf();
    pp();
    k96();
    cP();
    Z96();
    ry();
    Zu6();
    V4 = K6(P6(), 1)
})
// @from(Ln 482608, Col 0)
function Zo8(q) {
    let K = s(17),
        {
            agentName: _,
            currentColor: z,
            onConfirm: Y
        } = q,
        A = z === void 0 ? "automatic" : z,
        O;
    if (K[0] !== A) O = fu6.findIndex((Z) => Z === A), K[0] = A, K[1] = O;
    else O = K[1];
    let [w, $] = JN.useState(Math.max(0, O)), j;
    if (K[2] !== Y || K[3] !== w) j = (Z) => {
        if (Z.key === "up") Z.preventDefault(), $(OnY);
        else if (Z.key === "down") Z.preventDefault(), $(AnY);
        else if (Z.key === "return") {
            Z.preventDefault();
            let G = fu6[w];
            Y(G === "automatic" ? void 0 : G)
        }
    }, K[2] = Y, K[3] = w, K[4] = j;
    else j = K[4];
    let H = j,
        J = fu6[w],
        X;
    if (K[5] !== w) X = fu6.map((Z, G) => {
        let f = G === w;
        return JN.default.createElement(u, {
            key: Z,
            flexDirection: "row",
            gap: 1
        }, JN.default.createElement(T, {
            color: f ? "suggestion" : void 0
        }, f ? e6.pointer : " "), Z === "automatic" ? JN.default.createElement(T, {
            bold: f
        }, "Automatic color") : JN.default.createElement(u, {
            gap: 1
        }, JN.default.createElement(T, {
            backgroundColor: QP[Z],
            color: "inverseText"
        }, " "), JN.default.createElement(T, {
            bold: f
        }, zv(Z))))
    }), K[5] = w, K[6] = X;
    else X = K[6];
    let M;
    if (K[7] !== X) M = JN.default.createElement(u, {
        flexDirection: "column"
    }, X), K[7] = X, K[8] = M;
    else M = K[8];
    let P;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) P = JN.default.createElement(T, null, "Preview: "), K[9] = P;
    else P = K[9];
    let W;
    if (K[10] !== _ || K[11] !== J) W = JN.default.createElement(u, {
        marginTop: 1
    }, P, J === void 0 || J === "automatic" ? JN.default.createElement(T, {
        inverse: !0,
        bold: !0
    }, " ", "@", _, " ") : JN.default.createElement(T, {
        backgroundColor: QP[J],
        color: "inverseText",
        bold: !0
    }, " ", "@", _, " ")), K[10] = _, K[11] = J, K[12] = W;
    else W = K[12];
    let D;
    if (K[13] !== H || K[14] !== M || K[15] !== W) D = JN.default.createElement(u, {
        flexDirection: "column",
        gap: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: H
    }, M, W), K[13] = H, K[14] = M, K[15] = W, K[16] = D;
    else D = K[16];
    return D
}
// @from(Ln 482685, Col 0)
function AnY(q) {
    return q < fu6.length - 1 ? q + 1 : 0
}
// @from(Ln 482689, Col 0)
function OnY(q) {
    return q > 0 ? q - 1 : fu6.length - 1
}
// @from(Ln 482692, Col 4)
JN
// @from(Ln 482692, Col 8)
fu6
// @from(Ln 482693, Col 4)
Xj7 = L(() => {
    o6();
    Qq();
    g6();
    Uf();
    JN = K6(P6(), 1), fu6 = ["automatic", ...VJ]
})
// @from(Ln 482701, Col 0)
function fo8(q) {
    let K = s(11),
        {
            initialModel: _,
            onComplete: z,
            onCancel: Y
        } = q,
        A;
    if (K[0] !== _) {
        q: {
            let J = hwK();
            if (_ && !J.some((X) => X.value === _)) {
                A = [{
                    value: _,
                    label: _,
                    description: "Current model (custom ID)"
                }, ...J];
                break q
            }
            A = J
        }
        K[0] = _,
        K[1] = A
    }
    else A = K[1];
    let O = A,
        w = _ ?? "sonnet",
        $;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) $ = O66.createElement(u, {
        marginBottom: 1
    }, O66.createElement(T, {
        dimColor: !0
    }, "Model determines the agent's reasoning capabilities and speed.")), K[2] = $;
    else $ = K[2];
    let j;
    if (K[3] !== Y || K[4] !== z) j = () => Y ? Y() : z(void 0), K[3] = Y, K[4] = z, K[5] = j;
    else j = K[5];
    let H;
    if (K[6] !== w || K[7] !== O || K[8] !== z || K[9] !== j) H = O66.createElement(u, {
        flexDirection: "column"
    }, $, O66.createElement(A1, {
        options: O,
        defaultValue: w,
        onChange: z,
        onCancel: j
    })), K[6] = w, K[7] = O, K[8] = z, K[9] = j, K[10] = H;
    else H = K[10];
    return H
}
// @from(Ln 482750, Col 4)
O66
// @from(Ln 482751, Col 4)
Mj7 = L(() => {
    o6();
    g6();
    Z96();
    gK();
    O66 = K6(P6(), 1)
})
// @from(Ln 482759, Col 0)
function nrK() {
    return {
        READ_ONLY: {
            name: "Read-only tools",
            toolNames: new Set([Au.name, _N.name, zZ.name, Kz.name, _Z.name, YF.name, Hd8.name, oQ8.name, jd8.name, Ns.name, De.name])
        },
        EDIT: {
            name: "Edit tools",
            toolNames: new Set([mM.name, hX.name, Ou.name])
        },
        EXECUTION: {
            name: "Execution tools",
            toolNames: new Set([KK.name, void 0].filter((q) => q !== void 0))
        },
        MCP: {
            name: "MCP tools",
            toolNames: new Set,
            isMcp: !0
        },
        OTHER: {
            name: "Other tools",
            toolNames: new Set
        }
    }
}
// @from(Ln 482785, Col 0)
function wnY(q) {
    let K = new Map;
    return q.forEach((_) => {
        let z = iH6(_);
        if (z) {
            let Y = K.get(z) || [];
            Y.push(_), K.set(z, Y)
        }
    }), Array.from(K.entries()).map(([_, z]) => ({
        serverName: _,
        tools: z
    })).sort((_, z) => _.serverName.localeCompare(z.serverName))
}
// @from(Ln 482799, Col 0)
function Go8(q) {
    let K = s(69),
        {
            tools: _,
            initialTools: z,
            onComplete: Y,
            onCancel: A
        } = q,
        O;
    if (K[0] !== _) O = d77({
        tools: _,
        isBuiltIn: !1,
        isAsync: !1
    }), K[0] = _, K[1] = O;
    else O = K[1];
    let w = O,
        $;
    if (K[2] !== w || K[3] !== z) $ = !z || z.includes("*") ? w.map(WnY) : z, K[2] = w, K[3] = z, K[4] = $;
    else $ = K[4];
    let j = $,
        [H, J] = XN.useState(j),
        [X, M] = XN.useState(0),
        [P, W] = XN.useState(!1),
        D;
    if (K[5] !== w) D = new Set(w.map(PnY)), K[5] = w, K[6] = D;
    else D = K[6];
    let Z = D,
        G;
    if (K[7] !== H || K[8] !== Z) {
        let t;
        if (K[10] !== Z) t = (Y6) => Z.has(Y6), K[10] = Z, K[11] = t;
        else t = K[11];
        G = H.filter(t), K[7] = H, K[8] = Z, K[9] = G
    } else G = K[9];
    let f = G,
        v;
    if (K[12] !== f) v = new Set(f), K[12] = f, K[13] = v;
    else v = K[13];
    let V = v,
        k = f.length === w.length && w.length > 0,
        N;
    if (K[14] === Symbol.for("react.memo_cache_sentinel")) N = (t) => {
        if (!t) return;
        J((Y6) => Y6.includes(t) ? Y6.filter((X6) => X6 !== t) : [...Y6, t])
    }, K[14] = N;
    else N = K[14];
    let R = N,
        h;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) h = (t, Y6) => {
        J((X6) => {
            if (Y6) {
                let M6 = t.filter((W6) => !X6.includes(W6));
                return [...X6, ...M6]
            } else return X6.filter((M6) => !t.includes(M6))
        })
    }, K[15] = h;
    else h = K[15];
    let C = h,
        x;
    if (K[16] !== w || K[17] !== Y || K[18] !== f) x = () => {
        let t = w.map(MnY),
            X6 = f.length === t.length && t.every((M6) => f.includes(M6)) ? void 0 : f;
        Y(X6)
    }, K[16] = w, K[17] = Y, K[18] = f, K[19] = x;
    else x = K[19];
    let B = x,
        m;
    if (K[20] !== w) {
        let t = nrK();
        m = {
            readOnly: [],
            edit: [],
            execution: [],
            mcp: [],
            other: []
        }, w.forEach((Y6) => {
            if (yJ(Y6)) m.mcp.push(Y6);
            else if (t.READ_ONLY.toolNames.has(Y6.name)) m.readOnly.push(Y6);
            else if (t.EDIT.toolNames.has(Y6.name)) m.edit.push(Y6);
            else if (t.EXECUTION.toolNames.has(Y6.name)) m.execution.push(Y6);
            else if (Y6.name !== T4) m.other.push(Y6)
        }), K[20] = w, K[21] = m
    } else m = K[21];
    let S = m,
        F;
    if (K[22] !== V) F = (t) => {
        let X6 = w7(t, (M6) => V.has(M6.name)) < t.length;
        return () => {
            let M6 = t.map(XnY);
            C(M6, X6)
        }
    }, K[22] = V, K[23] = F;
    else F = K[23];
    let U = F,
        g;
    if (K[24] !== U || K[25] !== w || K[26] !== X || K[27] !== B || K[28] !== k || K[29] !== V || K[30] !== P || K[31] !== S.edit || K[32] !== S.execution || K[33] !== S.mcp || K[34] !== S.other || K[35] !== S.readOnly) {
        g = [], g.push({
            id: "continue",
            label: "Continue",
            action: B,
            isContinue: !0
        });
        let t;
        if (K[37] !== w || K[38] !== k) t = () => {
            let f6 = w.map(JnY);
            C(f6, !k)
        }, K[37] = w, K[38] = k, K[39] = t;
        else t = K[39];
        g.push({
            id: "bucket-all",
            label: `${k?e6.checkboxOn:e6.checkboxOff} All tools`,
            action: t
        });
        let Y6 = nrK();
        [{
            id: "bucket-readonly",
            name: Y6.READ_ONLY.name,
            tools: S.readOnly
        }, {
            id: "bucket-edit",
            name: Y6.EDIT.name,
            tools: S.edit
        }, {
            id: "bucket-execution",
            name: Y6.EXECUTION.name,
            tools: S.execution
        }, {
            id: "bucket-mcp",
            name: Y6.MCP.name,
            tools: S.mcp
        }, {
            id: "bucket-other",
            name: Y6.OTHER.name,
            tools: S.other
        }].forEach((f6) => {
            let {
                id: G6,
                name: k6,
                tools: T6
            } = f6;
            if (T6.length === 0) return;
            let L6 = w7(T6, (y6) => V.has(y6.name)) === T6.length;
            g.push({
                id: G6,
                label: `${L6?e6.checkboxOn:e6.checkboxOff} ${k6}`,
                action: U(T6)
            })
        });
        let M6 = g.length,
            W6;
        if (K[40] !== X || K[41] !== P || K[42] !== M6) W6 = () => {
            if (W(!P), P && X > M6) M(M6)
        }, K[40] = X, K[41] = P, K[42] = M6, K[43] = W6;
        else W6 = K[43];
        g.push({
            id: "toggle-individual",
            label: P ? "Hide advanced options" : "Show advanced options",
            action: W6,
            isToggle: !0
        });
        let V6 = wnY(w);
        if (P) {
            if (V6.length > 0) g.push({
                id: "mcp-servers-header",
                label: "MCP Servers:",
                action: HnY,
                isHeader: !0
            }), V6.forEach((f6) => {
                let {
                    serverName: G6,
                    tools: k6
                } = f6, v6 = w7(k6, (L6) => V.has(L6.name)) === k6.length;
                g.push({
                    id: `mcp-server-${G6}`,
                    label: `${v6?e6.checkboxOn:e6.checkboxOff} ${G6} (${k6.length} ${O7(k6.length,"tool")})`,
                    action: () => {
                        let L6 = k6.map(jnY);
                        C(L6, !v6)
                    }
                })
            }), g.push({
                id: "tools-header",
                label: "Individual Tools:",
                action: $nY,
                isHeader: !0
            });
            w.forEach((f6) => {
                let G6 = f6.name;
                if (yJ(f6)) {
                    let k6 = f6.mcpInfo ?? Cm(f6.name);
                    G6 = k6 ? `${k6.toolName} (${k6.serverName})` : f6.name
                }
                g.push({
                    id: `tool-${f6.name}`,
                    label: `${V.has(f6.name)?e6.checkboxOn:e6.checkboxOff} ${G6}`,
                    action: () => R(f6.name)
                })
            })
        }
        K[24] = U, K[25] = w, K[26] = X, K[27] = B, K[28] = k, K[29] = V, K[30] = P, K[31] = S.edit, K[32] = S.execution, K[33] = S.mcp, K[34] = S.other, K[35] = S.readOnly, K[36] = g
    } else g = K[36];
    let c;
    if (K[44] !== z || K[45] !== A || K[46] !== Y) c = () => {
        if (A) A();
        else Y(z)
    }, K[44] = z, K[45] = A, K[46] = Y, K[47] = c;
    else c = K[47];
    let n = c,
        l;
    if (K[48] === Symbol.for("react.memo_cache_sentinel")) l = {
        context: "Confirmation"
    }, K[48] = l;
    else l = K[48];
    G1("confirm:no", n, l);
    let z6;
    if (K[49] !== X || K[50] !== g) z6 = (t) => {
        if (t.key === "return") {
            t.preventDefault();
            let Y6 = g[X];
            if (Y6 && !Y6.isHeader) Y6.action()
        } else if (t.key === "up") {
            t.preventDefault();
            let Y6 = X - 1;
            while (Y6 > 0 && g[Y6]?.isHeader) Y6--;
            M(Math.max(0, Y6))
        } else if (t.key === "down") {
            t.preventDefault();
            let Y6 = X + 1;
            while (Y6 < g.length - 1 && g[Y6]?.isHeader) Y6++;
            M(Math.min(g.length - 1, Y6))
        }
    }, K[49] = X, K[50] = g, K[51] = z6;
    else z6 = K[51];
    let A6 = z6,
        e = X === 0 ? "suggestion" : void 0,
        i = X === 0,
        O6 = X === 0 ? `${e6.pointer} ` : "  ",
        J6;
    if (K[52] !== e || K[53] !== i || K[54] !== O6) J6 = XN.default.createElement(T, {
        color: e,
        bold: i
    }, O6, "[ Continue ]"), K[52] = e, K[53] = i, K[54] = O6, K[55] = J6;
    else J6 = K[55];
    let $6;
    if (K[56] === Symbol.for("react.memo_cache_sentinel")) $6 = XN.default.createElement(zA, {
        width: 40
    }), K[56] = $6;
    else $6 = K[56];
    let H6;
    if (K[57] !== g) H6 = g.slice(1), K[57] = g, K[58] = H6;
    else H6 = K[58];
    let q6;
    if (K[59] !== X || K[60] !== H6) q6 = H6.map((t, Y6) => {
        let X6 = Y6 + 1 === X,
            M6 = t.isToggle,
            W6 = t.isHeader;
        return XN.default.createElement(XN.default.Fragment, {
            key: t.id
        }, M6 && XN.default.createElement(zA, {
            width: 40
        }), W6 && Y6 > 0 && XN.default.createElement(u, {
            marginTop: 1
        }), XN.default.createElement(T, {
            color: W6 ? void 0 : X6 ? "suggestion" : void 0,
            dimColor: W6,
            bold: M6 && X6
        }, W6 ? "" : X6 ? `${e6.pointer} ` : "  ", M6 ? `[ ${t.label} ]` : t.label))
    }), K[59] = X, K[60] = H6, K[61] = q6;
    else q6 = K[61];
    let o = k ? "All tools selected" : `${V.size} of ${w.length} tools selected`,
        _6;
    if (K[62] !== o) _6 = XN.default.createElement(u, {
        marginTop: 1,
        flexDirection: "column"
    }, XN.default.createElement(T, {
        dimColor: !0
    }, o)), K[62] = o, K[63] = _6;
    else _6 = K[63];
    let r;
    if (K[64] !== A6 || K[65] !== J6 || K[66] !== q6 || K[67] !== _6) r = XN.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: A6
    }, J6, $6, q6, _6), K[64] = A6, K[65] = J6, K[66] = q6, K[67] = _6, K[68] = r;
    else r = K[68];
    return r
}
// @from(Ln 483089, Col 0)
function $nY() {}
// @from(Ln 483091, Col 0)
function jnY(q) {
    return q.name
}
// @from(Ln 483095, Col 0)
function HnY() {}
// @from(Ln 483097, Col 0)
function JnY(q) {
    return q.name
}
// @from(Ln 483101, Col 0)
function XnY(q) {
    return q.name
}
// @from(Ln 483105, Col 0)
function MnY(q) {
    return q.name
}
// @from(Ln 483109, Col 0)
function PnY(q) {
    return q.name
}
// @from(Ln 483113, Col 0)
function WnY(q) {
    return q.name
}
// @from(Ln 483116, Col 4)
XN
// @from(Ln 483117, Col 4)
Pj7 = L(() => {
    o6();
    Qq();
    fh();
    k96();
    sY();
    AZ();
    n58();
    A_6();
    aF();
    rl();
    yb6();
    c96();
    FR8();
    DM6();
    Dd8();
    $37();
    F57();
    O78();
    ib6();
    H37();
    g6();
    C7();
    VR();
    XN = K6(P6(), 1)
})
// @from(Ln 483144, Col 0)
function vo8(q) {
    if (q === "all") return "Agents";
    if (q === "built-in") return "Built-in agents";
    if (q === "plugin") return "Plugin agents";
    return gH6(u16(q))
}
// @from(Ln 483150, Col 4)
Wj7 = L(() => {
    cb8();
    aY()
})
// @from(Ln 483155, Col 0)
function irK({
    agent: q,
    tools: K,
    onSaved: _,
    onBack: z
}) {
    let Y = R7(),
        [A, O] = Su.useState("menu"),
        [w, $] = Su.useState(0),
        [j, H] = Su.useState(null),
        [J, X] = Su.useState(q.color),
        M = Su.useCallback(async () => {
            let f = Wo8(q),
                v = await xS(f);
            if (v.error) H(v.error);
            else _(`Opened ${q.agentType} in editor. If you made edits, restart to load the latest version.`)
        }, [q, _]),
        P = Su.useCallback(async (f = {}) => {
            let {
                tools: v,
                color: V,
                model: k
            } = f, N = V ?? J, R = v !== void 0, h = k !== void 0, C = N !== q.color;
            if (!R && !h && !C) return !1;
            try {
                if (!v88(q) && !T88(q)) return !1;
                if (await UrK(q, {
                        ...R && {
                            tools: v
                        },
                        ...C && {
                            color: N
                        },
                        ...h && {
                            model: k
                        }
                    }), C && N) BH6(q.agentType, N);
                return Y((x) => {
                    let B = x.agentDefinitions.allAgents.map((m) => m.agentType === q.agentType && m.source === q.source ? {
                        ...m,
                        tools: v ?? m.tools,
                        color: N,
                        model: k ?? m.model
                    } : m);
                    return {
                        ...x,
                        agentDefinitions: {
                            ...x.agentDefinitions,
                            activeAgents: zT(B),
                            allAgents: B
                        }
                    }
                }), _(`Updated agent: ${Y8.bold(q.agentType)}`), !0
            } catch (x) {
                return H(x instanceof Error ? x.message : "Failed to save agent"), !1
            }
        }, [q, J, _, Y]),
        W = Su.useMemo(() => [{
            label: "Open in editor",
            action: M
        }, {
            label: "Edit tools",
            action: () => O("edit-tools")
        }, {
            label: "Edit model",
            action: () => O("edit-model")
        }, {
            label: "Edit color",
            action: () => O("edit-color")
        }], [M]),
        D = Su.useCallback(() => {
            if (H(null), A === "menu") z();
            else O("menu")
        }, [A, z]),
        Z = Su.useCallback((f) => {
            if (f.key === "up") f.preventDefault(), $((v) => Math.max(0, v - 1));
            else if (f.key === "down") f.preventDefault(), $((v) => Math.min(W.length - 1, v + 1));
            else if (f.key === "return") {
                f.preventDefault();
                let v = W[w];
                if (v) v.action()
            }
        }, [W, w]);
    G1("confirm:no", D, {
        context: "Confirmation"
    });
    let G = () => T0.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: Z
    }, T0.createElement(T, {
        dimColor: !0
    }, "Source: ", vo8(q.source)), T0.createElement(u, {
        marginTop: 1,
        flexDirection: "column"
    }, W.map((f, v) => T0.createElement(T, {
        key: f.label,
        color: v === w ? "suggestion" : void 0
    }, v === w ? `${e6.pointer} ` : "  ", f.label))), j && T0.createElement(u, {
        marginTop: 1
    }, T0.createElement(T, {
        color: "error"
    }, j)));
    switch (A) {
        case "menu":
            return G();
        case "edit-tools":
            return T0.createElement(Go8, {
                tools: K,
                initialTools: q.tools,
                onComplete: async (f) => {
                    O("menu"), await P({
                        tools: f
                    })
                }
            });
        case "edit-color":
            return T0.createElement(Zo8, {
                agentName: q.agentType,
                currentColor: J || q.color || "automatic",
                onConfirm: async (f) => {
                    X(f), O("menu"), await P({
                        color: f
                    })
                }
            });
        case "edit-model":
            return T0.createElement(fo8, {
                initialModel: q.model,
                onComplete: async (f) => {
                    O("menu"), await P({
                        model: f
                    })
                }
            });
        default:
            return null
    }
}
// @from(Ln 483295, Col 4)
T0
// @from(Ln 483295, Col 8)
Su
// @from(Ln 483296, Col 4)
rrK = L(() => {
    Y3();
    Qq();
    N7();
    g6();
    C7();
    Uf();
    cP();
    uS();
    Zu6();
    Xj7();
    Mj7();
    Pj7();
    Wj7();
    T0 = K6(P6(), 1), Su = K6(P6(), 1)
})
// @from(Ln 483313, Col 0)
function Gu6({
    instructions: q = MN.createElement(T, null, "Press", " ", MN.createElement(z1, null, MN.createElement(A8, {
        chord: ["up", "down"],
        format: {
            arrowSep: ""
        },
        action: "navigate"
    }), MN.createElement(A8, {
        chord: "enter",
        action: "select"
    }), MN.createElement(A8, {
        chord: "escape",
        action: "go back"
    })))
}) {
    let K = $3();
    return MN.createElement(u, {
        marginLeft: 2,
        marginTop: 1
    }, MN.createElement(T, {
        dimColor: !0
    }, K.pending ? `Press ${K.keyName} again to exit` : q))
}
// @from(Ln 483336, Col 4)
MN
// @from(Ln 483337, Col 4)
orK = L(() => {
    C$();
    g6();
    Nq();
    u7();
    MN = K6(P6(), 1)
})