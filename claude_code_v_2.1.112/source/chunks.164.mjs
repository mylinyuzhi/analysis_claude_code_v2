
// @from(Ln 423867, Col 4)
AZ = L(() => {
    p7();
    y8();
    C8();
    vy6();
    gq();
    pl();
    Wy6();
    vD();
    q68();
    Bz7();
    n7();
    Q8();
    m8();
    eK();
    cy();
    c7();
    Yq();
    Jk();
    b9();
    Rc8();
    $G();
    yY();
    BP();
    g96();
    X58();
    EH();
    hb6();
    mj6();
    ND();
    _Y7();
    zt();
    z78();
    MT();
    _SK();
    YSK();
    RSK();
    $a1();
    hR6();
    OK8();
    xM6();
    $K8();
    eU8();
    LY7 = K6(P6(), 1), xVY = new Set(["find", "grep", "rg", "ag", "ack", "locate", "which", "whereis"]), uVY = new Set(["cat", "head", "tail", "less", "more", "wc", "stat", "file", "strings", "jq", "awk", "cut", "sort", "uniq", "tr"]), mVY = new Set(["ls", "tree", "du"]), BVY = new Set(["echo", "printf", "true", "false", ":"]), pVY = new Set(["mv", "cp", "rm", "mkdir", "rmdir", "chmod", "chown", "chgrp", "touch", "ln", "cd", "export", "unset", "wait"]);
    UVY = ["sleep"], k98 = S6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS), wn8 = C6(() => y.strictObject({
        command: y.string().describe("The command to execute"),
        timeout: qL(y.number().optional()).describe(`Optional timeout in milliseconds (max ${V98()})`),
        description: y.string().optional().describe(`Clear, concise description of what this command does in active voice. Never use words like "complex" or "risk" in the description - just describe what it does.

For simple commands (git, npm, standard CLI tools), keep it brief (5-10 words):
- ls → "List files in current directory"
- git status → "Show working tree status"
- npm install → "Install package dependencies"

For commands that are harder to parse at a glance (piped commands, obscure flags, etc.), add enough context to clarify what it does:
- find . -name "*.tmp" -exec rm {} \\; → "Find and delete all .tmp files recursively"
- git reset --hard origin/main → "Discard all local changes and match remote main"
- curl -s url | jq '.data[]' → "Fetch JSON from URL and extract data array elements"`),
        run_in_background: _W(y.boolean().optional()).describe("Set to true to run this command in the background. Use Read to read the output later."),
        dangerouslyDisableSandbox: _W(y.boolean().optional()).describe("Set this to true to dangerously override sandbox mode and run commands without sandboxing."),
        rerun: y.string().optional().describe("Rerun a prior command exactly by passing the alias from a previous result's [rerun: bN] footer (e.g. 'b3'). Mutually exclusive with 'command'."),
        _simulatedSedEdit: y.object({
            filePath: y.string(),
            newContent: y.string()
        }).optional().describe("Internal: pre-computed sed edit result from preview")
    })), ISK = C6(() => k98 ? A36() ? wn8().omit({
        run_in_background: !0,
        _simulatedSedEdit: !0
    }) : wn8().omit({
        run_in_background: !0,
        _simulatedSedEdit: !0,
        rerun: !0
    }) : A36() ? wn8().omit({
        _simulatedSedEdit: !0
    }) : wn8().omit({
        _simulatedSedEdit: !0,
        rerun: !0
    })), QVY = ["npm", "yarn", "pnpm", "node", "python", "python3", "go", "cargo", "make", "docker", "terraform", "webpack", "vite", "jest", "pytest", "curl", "wget", "build", "test", "serve", "watch", "dev"];
    dVY = C6(() => y.object({
        stdout: y.string().describe("The standard output of the command"),
        stderr: y.string().describe("The standard error output of the command"),
        rawOutputPath: y.string().optional().describe("Path to raw output file for large MCP tool outputs"),
        interrupted: y.boolean().describe("Whether the command was interrupted"),
        isImage: y.boolean().optional().describe("Flag to indicate if stdout contains image data"),
        backgroundTaskId: y.string().optional().describe("ID of the background task if command is running in background"),
        backgroundedByUser: y.boolean().optional().describe("True if the user manually backgrounded the command with Ctrl+B"),
        assistantAutoBackgrounded: y.boolean().optional().describe("True if assistant-mode auto-backgrounded a long-running blocking command"),
        dangerouslyDisableSandbox: y.boolean().optional().describe("Flag to indicate if sandbox mode was overridden"),
        returnCodeInterpretation: y.string().optional().describe("Semantic interpretation for non-error exit codes with special meaning"),
        noOutputExpected: y.boolean().optional().describe("Whether the command is expected to produce no output on success"),
        structuredContent: y.array(y.any()).optional().describe("Structured content blocks"),
        persistedOutputPath: y.string().optional().describe("Path to the persisted full output in tool-results dir (set when output is too large for inline)"),
        persistedOutputSize: y.number().optional().describe("Total size of the output in bytes (set when output is too large for inline)"),
        staleReadFileStateHint: y.string().optional().describe("Model-facing note listing readFileState entries whose mtime bumped during this command (set when WRITE_COMMAND_MARKERS matches)")
    }));
    iVY = new RegExp(["--write", "--fix", "--in-place", "--auto-correct", "\\brun\\s+format\\b", "\\brun\\s+fix\\b", "\\b(yarn|pnpm)\\s+format\\b", "\\blint:file\\b", "\\blint:fix\\b", "\\bblack\\b", "\\bisort\\b", "\\bruff\\s+format\\b", "\\bcargo\\s+(fmt|fix)\\b", "\\brustfmt\\b", "\\bgo\\s+fmt\\b", "\\bterraform\\s+fmt\\b", "\\bdprint\\s+fmt\\b", "\\bswiftformat\\b", "\\bphpcbf\\b"].join("|"));
    KK = Iq({
        name: S7,
        searchHint: "execute shell commands",
        maxResultSizeChars: 30000,
        strict: !0,
        async description({
            description: q
        }) {
            return q || "Run shell command"
        },
        async prompt() {
            return hSK()
        },
        isConcurrencySafe(q) {
            return this.isReadOnly?.(q) ?? !1
        },
        isReadOnly(q) {
            let K = v78(q.command);
            return yu8(q, K).behavior === "allow"
        },
        toAutoClassifierInput(q) {
            if ("rerun" in q && typeof q.rerun === "string" && !q.command) return `rerun ${q.rerun}`;
            return q.command
        },
        async preparePermissionMatcher({
            command: q
        }) {
            let K = await Py6(q);
            if (K.kind !== "simple") return () => !0;
            let _ = K.commands.map((z) => z.argv.join(" "));
            return (z) => {
                let Y = xSK(z);
                return _.some((A) => {
                    if (Y !== null) return A === Y || A.startsWith(`${Y} `) || A === `xargs ${Y}` || A.startsWith(`xargs ${Y} `);
                    return ZP6(z, A) || ZP6(`xargs ${z}`, A)
                })
            }
        },
        isSearchOrReadCommand(q) {
            let K = ISK().safeParse(q);
            if (!K.success) return {
                isSearch: !1,
                isRead: !1,
                isList: !1
            };
            return FVY(K.data.command)
        },
        get inputSchema() {
            return ISK()
        },
        get outputSchema() {
            return dVY()
        },
        userFacingName(q) {
            if (!q) return "Bash";
            if (q.command) {
                let K = UC6(q.command);
                if (K) return el8({
                    file_path: K.filePath,
                    old_string: "x"
                })
            }
            return S6(process.env.CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR) && AL(q) ? "SandboxedBash" : "Bash"
        },
        getToolUseSummary(q) {
            if (!q?.command) return null;
            let {
                command: K,
                description: _
            } = q;
            if (_) return _;
            return w5(K, av)
        },
        getActivityDescription(q) {
            if (!q?.command) return "Running command";
            return `Running ${q.description??w5(q.command,av)}`
        },
        async validateInput(q) {
            if (KF() && !k98 && !q.run_in_background) {
                let K = lVY(q.command);
                if (K !== null) return {
                    result: !1,
                    message: `Blocked: ${K}. To wait for a condition, use Monitor with an until-loop (e.g. \`until <check>; do sleep 2; done\`). To wait for a command you started, use run_in_background: true. Do not chain shorter sleeps to work around this block.`,
                    errorCode: 10
                }
            }
            return {
                result: !0
            }
        },
        async checkPermissions(q, K) {
            return _38(q, K)
        },
        renderToolUseMessage: gwK,
        renderToolUseProgressMessage: UwK,
        renderToolUseQueuedMessage: QwK,
        renderToolResultMessage: dwK,
        extractSearchText({
            stdout: q,
            stderr: K
        }) {
            return K ? `${q}
${K}` : q
        },
        mapToolResultToToolResultBlockParam({
            interrupted: q,
            stdout: K,
            stderr: _,
            isImage: z,
            backgroundTaskId: Y,
            backgroundedByUser: A,
            assistantAutoBackgrounded: O,
            structuredContent: w,
            persistedOutputPath: $,
            persistedOutputSize: j,
            staleReadFileStateHint: H
        }, J) {
            if (w && w.length > 0) return {
                tool_use_id: J,
                type: "tool_result",
                content: w
            };
            if (z) {
                let W = oU8(K, J);
                if (W) return W
            }
            let X = K;
            if (K) X = K.replace(/^(\s*\n)+/, ""), X = X.trimEnd();
            if ($) {
                let W = se6(X, KL6);
                X = lK6({
                    filepath: $,
                    originalSize: j ?? 0,
                    isJson: !1,
                    preview: W.preview,
                    hasMore: W.hasMore
                })
            }
            let M = _.trim();
            if (q) {
                if (_) M += CSK;
                M += "<error>Command was aborted before completion</error>"
            }
            let P = "";
            if (Y) {
                let W = $A(Y);
                if (O) P = `Command exceeded the assistant-mode blocking budget (${IVY/1000}s) and was moved to the background with ID: ${Y}. It is still running — you will be notified when it completes. Output is being written to: ${W}. In assistant mode, delegate long-running work to a subagent or use run_in_background to keep this conversation responsive.`;
                else if (A) P = `Command was manually backgrounded by user with ID: ${Y}. Output is being written to: ${W}`;
                else P = `Command running in background with ID: ${Y}. Output is being written to: ${W}`
            }
            return {
                tool_use_id: J,
                type: "tool_result",
                content: [X, M, P, H].filter(Boolean).join(`
`),
                is_error: q
            }
        },
        async call(q, K, _, z, Y) {
            if (q._simulatedSedEdit) return nVY(q._simulatedSedEdit, K, z);
            let A = Math.floor(Date.now() / 1000) * 1000,
                {
                    abortController: O,
                    getAppState: w,
                    setToolJSX: $,
                    emitToolProgress: j
                } = K,
                H = new iU6,
                J = "",
                X, M = 0,
                P = !1,
                W, D = !K.agentId,
                Z = !D;
            try {
                let S = oVY({
                        input: q,
                        abortController: O,
                        taskRegistry: K.taskRegistry,
                        abortSpeculation: K.abortSpeculation,
                        setToolJSX: $,
                        emitToolProgress: j,
                        preventCwdChanges: Z,
                        isMainThread: D,
                        toolUseId: K.toolUseId,
                        agentId: K.agentId,
                        sessionEnvVars: K.sessionEnvVars,
                        tmuxSocket: K.tmuxSocket
                    }),
                    F;
                do
                    if (F = await S.next(), !F.done && Y) {
                        let n = F.value;
                        Y({
                            toolUseID: `bash-progress-${M++}`,
                            data: {
                                type: "bash_progress",
                                output: n.output,
                                fullOutput: n.fullOutput,
                                elapsedTimeSeconds: n.elapsedTimeSeconds,
                                totalLines: n.totalLines,
                                totalBytes: n.totalBytes,
                                taskId: n.taskId,
                                timeoutMs: n.timeoutMs
                            }
                        })
                    } while (!F.done);
                W = F.value, $u8(q.command, W.code, W.stdout);
                let U = W.interrupted && O.signal.reason === "interrupt";
                if (H.append((W.stdout || "").trimEnd() + CSK), X = KSK(q.command, W.code, W.stdout || "", ""), W.stdout && W.stdout.includes(".git/index.lock': File exists")) d("tengu_git_index_lock_error", {});
                if (X.isError && !U) {
                    if (W.code !== 0) H.append(`Exit code ${W.code}`)
                }
                if (!Z) {
                    let n = w();
                    if (tU8(n.toolPermissionContext)) J = sU8("")
                }
                let g = W.stdout || "",
                    c = Z7.annotateStderrWithSandboxFailures(q.command, g);
                if (W.preSpawnError) throw Error(W.preSpawnError);
                if (X.isError && !U) throw new JV("", c, W.code, W.interrupted, c !== g);
                P = W.interrupted
            } finally {
                if ($) $(null);
                if (K.toolUseId) j?.({
                    kind: "clear",
                    toolUseId: K.toolUseId
                })
            }
            let G = H.toString(),
                f = 67108864,
                v, V;
            if (W.outputFilePath && W.outputTaskId) try {
                let S = await RVY(W.outputFilePath);
                V = S.size, await tj6();
                let F = ae6(W.outputTaskId, !1);
                if (S.size > f) await SVY(W.outputFilePath, f);
                try {
                    await CVY(W.outputFilePath, F)
                } catch {
                    await hVY(W.outputFilePath, F)
                }
                v = F
            } catch {}
            let k = i5(q.command, " ");
            d("tengu_bash_tool_command_executed", {
                command_type: k,
                stdout_length: G.length,
                stderr_length: 0,
                exit_code: W.code,
                interrupted: P
            });
            let N = xhK(q.command);
            if (N) d("tengu_code_indexing_tool_used", {
                tool: N,
                source: "cli",
                success: W.code === 0
            });
            let R = rU8(G),
                h = ee6(R, q.command);
            if (R = h.stripped, D && h.hints.length > 0)
                for (let S of h.hints) b38(S);
            let C = D58(R),
                x = R;
            if (C) {
                let S = await aU8(R, W.outputFilePath, V, vO(K.options.mainLoopModel));
                if (S) x = S;
                else C = !1
            }
            let B;
            if (!P && !C && !W.backgroundTaskId) {
                let S = await rVY(q.command, K.readFileState, A);
                if (S.length > 0) {
                    let F = b8(),
                        U = 5,
                        g = S.slice(0, 5).map((n) => bVY(F, n) || n).join(", "),
                        c = S.length > 5 ? ` and ${S.length-5} more` : "";
                    B = `[This command modified ${S.length} ${O7(S.length,"file")} you've previously read: ${g}${c}. Call Read before editing.]`
                }
            }
            if (!P && !C && !W.backgroundTaskId) await zSK(q.command, K.readFileState, O.signal);
            return {
                data: {
                    stdout: x,
                    stderr: J,
                    interrupted: P,
                    isImage: C,
                    returnCodeInterpretation: X?.message,
                    noOutputExpected: gVY(q.command),
                    backgroundTaskId: W.backgroundTaskId,
                    backgroundedByUser: W.backgroundedByUser,
                    assistantAutoBackgrounded: W.assistantAutoBackgrounded,
                    dangerouslyDisableSandbox: "dangerouslyDisableSandbox" in q ? q.dangerouslyDisableSandbox : void 0,
                    persistedOutputPath: v,
                    persistedOutputSize: V,
                    staleReadFileStateHint: B
                }
            }
        },
        renderToolUseErrorMessage: cwK,
        isResultTruncated(q) {
            return yR(q.stdout) || yR(q.stderr)
        }
    })
})
// @from(Ln 424268, Col 0)
function hY7(q, K, _) {
    switch (q.type) {
        case "raw_string":
            K.raw.push([q.startIndex, q.endIndex]);
            return;
        case "ansi_c_string":
            K.ansiC.push([q.startIndex, q.endIndex]);
            return;
        case "string":
            if (!_) K.double.push([q.startIndex, q.endIndex]);
            for (let z of q.children)
                if (z) hY7(z, K, !0);
            return;
        case "heredoc_redirect": {
            let z = !1;
            for (let Y of q.children)
                if (Y && Y.type === "heredoc_start") {
                    let A = Y.text[0];
                    z = A === "'" || A === '"' || A === "\\";
                    break
                } if (z) {
                K.heredoc.push([q.startIndex, q.endIndex]);
                return
            }
            break
        }
    }
    for (let z of q.children)
        if (z) hY7(z, K, _)
}
// @from(Ln 424299, Col 0)
function aVY(q) {
    let K = new Set;
    for (let [_, z] of q)
        for (let Y = _; Y < z; Y++) K.add(Y);
    return K
}
// @from(Ln 424306, Col 0)
function uSK(q) {
    return q.filter((K, _) => !q.some((z, Y) => Y !== _ && z[0] <= K[0] && z[1] >= K[1] && (z[0] < K[0] || z[1] > K[1])))
}
// @from(Ln 424310, Col 0)
function sVY(q, K) {
    if (K.length === 0) return q;
    let _ = uSK(K).sort((Y, A) => A[0] - Y[0]),
        z = q;
    for (let [Y, A] of _) z = z.slice(0, Y) + z.slice(A);
    return z
}
// @from(Ln 424318, Col 0)
function tVY(q, K) {
    if (K.length === 0) return q;
    let _ = uSK(K).sort((Y, A) => A[0] - Y[0]),
        z = q;
    for (let [Y, A, O, w] of _) z = z.slice(0, Y) + O + w + z.slice(A);
    return z
}
// @from(Ln 424326, Col 0)
function eVY(q, K) {
    let _ = {
        raw: [],
        ansiC: [],
        double: [],
        heredoc: []
    };
    hY7(q, _, !1);
    let {
        raw: z,
        ansiC: Y,
        double: A,
        heredoc: O
    } = _, w = [...z, ...Y, ...A, ...O], $ = aVY([...z, ...Y, ...O]), j = new Set;
    for (let [P, W] of A) j.add(P), j.add(W - 1);
    let H = "";
    for (let P = 0; P < K.length; P++) {
        if ($.has(P)) continue;
        if (j.has(P)) continue;
        H += K[P]
    }
    let J = sVY(K, w),
        X = [];
    for (let [P, W] of z) X.push([P, W, "'", "'"]);
    for (let [P, W] of Y) X.push([P, W, "$'", "'"]);
    for (let [P, W] of A) X.push([P, W, '"', '"']);
    for (let [P, W] of O) X.push([P, W, "", ""]);
    let M = tVY(K, X);
    return {
        withDoubleQuotes: H,
        fullyUnquoted: J,
        unquotedKeepQuoteChars: M
    }
}
// @from(Ln 424361, Col 0)
function qkY(q, K) {
    let _ = q,
        z = [],
        Y = [],
        A = !1,
        O = !1,
        w = !1;

    function $(j) {
        for (let H of j.children) {
            if (!H) continue;
            if (H.type === "list")
                for (let J of H.children) {
                    if (!J) continue;
                    if (J.type === "&&" || J.type === "||") z.push(J.type);
                    else if (J.type === "list" || J.type === "redirected_statement") $({
                        ...j,
                        children: [J]
                    });
                    else if (J.type === "pipeline") w = !0, Y.push(J.text);
                    else if (J.type === "subshell") A = !0, Y.push(J.text);
                    else if (J.type === "compound_statement") O = !0, Y.push(J.text);
                    else Y.push(J.text)
                } else if (H.type === ";") z.push(";");
                else if (H.type === "pipeline") w = !0, Y.push(H.text);
            else if (H.type === "subshell") A = !0, Y.push(H.text);
            else if (H.type === "compound_statement") O = !0, Y.push(H.text);
            else if (H.type === "command" || H.type === "declaration_command" || H.type === "variable_assignment") Y.push(H.text);
            else if (H.type === "redirected_statement") {
                let J = !1;
                for (let X of H.children) {
                    if (!X || X.type === "file_redirect") continue;
                    J = !0, $({
                        ...H,
                        children: [X]
                    })
                }
                if (!J) Y.push(H.text)
            } else if (H.type === "negated_command") Y.push(H.text), $(H);
            else if (H.type === "if_statement" || H.type === "while_statement" || H.type === "for_statement" || H.type === "case_statement" || H.type === "function_definition") Y.push(H.text), $(H)
        }
    }
    if ($(_), Y.length === 0) Y.push(K);
    return {
        hasCompoundOperators: z.length > 0,
        hasPipeline: w,
        hasSubshell: A,
        hasCommandGroup: O,
        operators: z,
        segments: Y
    }
}
// @from(Ln 424414, Col 0)
function KkY(q) {
    let K = q;

    function _(z) {
        if (z.type === ";" || z.type === "&&" || z.type === "||") return !0;
        if (z.type === "list") return !0;
        for (let Y of z.children)
            if (Y && _(Y)) return !0;
        return !1
    }
    return _(K)
}
// @from(Ln 424427, Col 0)
function _kY(q) {
    let K = q,
        _ = !1,
        z = !1,
        Y = !1,
        A = !1,
        O = !1;

    function w($) {
        switch ($.type) {
            case "command_substitution":
                _ = !0;
                break;
            case "process_substitution":
                z = !0;
                break;
            case "expansion":
                Y = !0;
                break;
            case "heredoc_redirect":
                A = !0;
                break;
            case "comment":
                O = !0;
                break
        }
        for (let j of $.children)
            if (j) w(j)
    }
    return w(K), {
        hasCommandSubstitution: _,
        hasProcessSubstitution: z,
        hasParameterExpansion: Y,
        hasHeredoc: A,
        hasComment: O
    }
}
// @from(Ln 424465, Col 0)
function mSK(q, K) {
    return {
        quoteContext: eVY(q, K),
        compoundStructure: qkY(q, K),
        hasActualOperatorNodes: KkY(q),
        dangerousPatterns: _kY(q)
    }
}
// @from(Ln 424474, Col 0)
function RY7(q, K) {
    K(q);
    for (let _ of q.children) RY7(_, K)
}
// @from(Ln 424479, Col 0)
function zkY(q) {
    let K = [];
    return RY7(q, (_) => {
        if (_.type === "pipeline") {
            for (let z of _.children)
                if (z.type === "|") K.push(z.startIndex)
        }
    }), K.sort((_, z) => _ - z)
}
// @from(Ln 424489, Col 0)
function YkY(q) {
    let K = [];
    return RY7(q, (_) => {
        if (_.type === "file_redirect") {
            let z = _.children,
                Y = z.find((O) => O.type === ">" || O.type === ">>"),
                A = z.find((O) => O.type === "word");
            if (Y && A) K.push({
                startIndex: _.startIndex,
                endIndex: _.endIndex,
                target: A.text,
                operator: Y.type
            })
        }
    }), K
}
// @from(Ln 424505, Col 0)
class pSK {
    originalCommand;
    commandBytes;
    pipePositions;
    redirectionNodes;
    treeSitterAnalysis;
    constructor(q, K, _, z) {
        this.originalCommand = q, this.commandBytes = Buffer.from(q, "utf8"), this.pipePositions = K, this.redirectionNodes = _, this.treeSitterAnalysis = z
    }
    toString() {
        return this.originalCommand
    }
    getPipeSegments() {
        if (this.pipePositions.length === 0) return [this.originalCommand];
        let q = [],
            K = 0;
        for (let z of this.pipePositions) {
            let Y = this.commandBytes.subarray(K, z).toString("utf8").trim();
            if (Y) q.push(Y);
            K = z + 1
        }
        let _ = this.commandBytes.subarray(K).toString("utf8").trim();
        if (_) q.push(_);
        return q
    }
    withoutOutputRedirections() {
        if (this.redirectionNodes.length === 0) return this.originalCommand;
        let q = [...this.redirectionNodes].sort((_, z) => z.startIndex - _.startIndex),
            K = this.commandBytes;
        for (let _ of q) K = Buffer.concat([K.subarray(0, _.startIndex), K.subarray(_.endIndex)]);
        return K.toString("utf8").trim().replace(/\s+/g, " ")
    }
    getOutputRedirections() {
        return this.redirectionNodes.map(({
            target: q,
            operator: K
        }) => ({
            target: q,
            operator: K
        }))
    }
    getTreeSitterAnalysis() {
        return this.treeSitterAnalysis
    }
}
// @from(Ln 424551, Col 0)
function SY7(q, K) {
    let _ = zkY(K),
        z = YkY(K),
        Y = mSK(K, q);
    return new pSK(q, _, z, Y)
}
// @from(Ln 424557, Col 0)
async function AkY(q) {
    if (!q) return null;
    try {
        let {
            parseCommand: K
        } = await Promise.resolve().then(() => (kj6(), wP4)), _ = await K(q);
        if (_) return SY7(q, _.rootNode)
    } catch {}
    return null
}
// @from(Ln 424567, Col 4)
BSK
// @from(Ln 424567, Col 9)
$n8
// @from(Ln 424567, Col 14)
jn8
// @from(Ln 424568, Col 4)
FSK = L(() => {
    jn8 = {
        parse(q) {
            if (q === BSK && $n8 !== void 0) return $n8;
            return BSK = q, $n8 = AkY(q), $n8
        }
    }
})
// @from(Ln 424576, Col 0)
async function OkY(q, K, _, z) {
    let Y = new Map;
    for (let H of K) {
        let J = H.trim();
        if (!J) continue;
        let X = await _({
            ...q,
            command: J
        });
        Y.set(J, X)
    }
    let A = Array.from(Y.entries()).find(([, H]) => H.behavior === "deny");
    if (A) {
        let [H, J] = A;
        return {
            behavior: "deny",
            message: J.behavior === "deny" ? J.message : `Permission denied for: ${H}`,
            decisionReason: {
                type: "subcommandResults",
                reasons: Y
            }
        }
    }
    if (K.filter((H) => {
            let J = H.trim();
            return z.isNormalizedCdCommand(J)
        }).length > 1) {
        let H = {
            type: "other",
            reason: "Multiple directory changes in one command require approval for clarity",
            bashMissKind: "multi-cd"
        };
        return {
            behavior: "ask",
            decisionReason: H,
            message: Qz(KK.name, H)
        }
    } {
        let H = !1,
            J = !1;
        for (let X of K) {
            let M = TO(X);
            for (let P of M) {
                let W = P.trim();
                if (z.isNormalizedCdCommand(W)) H = !0;
                if (z.isNormalizedGitCommand(W)) J = !0
            }
        }
        if (H && J) {
            let X = {
                type: "other",
                reason: "Compound commands with cd and git require approval to prevent bare repository attacks",
                bashMissKind: "cd-git-compound"
            };
            return {
                behavior: "ask",
                decisionReason: X,
                message: Qz(KK.name, X)
            }
        }
    }
    if (Array.from(Y.values()).every((H) => H.behavior === "allow")) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "subcommandResults",
            reasons: Y
        }
    };
    let $ = [];
    for (let [, H] of Y)
        if (H.behavior !== "allow" && "suggestions" in H && H.suggestions) $.push(...H.suggestions);
    let j = {
        type: "subcommandResults",
        reasons: Y
    };
    return {
        behavior: "ask",
        message: Qz(KK.name, j),
        decisionReason: j,
        suggestions: $.length > 0 ? $ : void 0
    }
}
// @from(Ln 424659, Col 0)
async function wkY(q) {
    if (!q.includes(">")) return q;
    return (await jn8.parse(q))?.withoutOutputRedirections() ?? q
}
// @from(Ln 424663, Col 0)
async function gSK(q, K, _, z) {
    let Y = z && z !== TK6 ? SY7(q.command, z) : await jn8.parse(q.command);
    if (!Y) return {
        behavior: "passthrough",
        message: "Failed to parse command"
    };
    return $kY(q, K, _, Y)
}
// @from(Ln 424671, Col 0)
async function $kY(q, K, _, z) {
    let Y = z.getTreeSitterAnalysis();
    if (Y ? Y.compoundStructure.hasSubshell || Y.compoundStructure.hasCommandGroup : TO(q.command).length > 1) {
        let $ = {
            type: "other",
            reason: "This command uses shell operators that require approval for safety",
            bashMissKind: "shell-operators"
        };
        return {
            behavior: "ask",
            message: Qz(KK.name, $),
            decisionReason: $
        }
    }
    let O = z.getPipeSegments();
    if (O.length <= 1) return {
        behavior: "passthrough",
        message: "No pipes found in command"
    };
    let w = await Promise.all(O.map(($) => wkY($)));
    return OkY(q, w, K, _)
}
// @from(Ln 424693, Col 4)
USK = L(() => {
    vD();
    FSK();
    kj6();
    g$();
    AZ()
})
// @from(Ln 424701, Col 0)
function HkY(q) {
    return jkY.includes(q)
}
// @from(Ln 424705, Col 0)
function JkY(q, K) {
    let _ = jF(q),
        [z] = _.split(/\s+/);
    if (!z) return {
        behavior: "passthrough",
        message: "Base command not found"
    };
    if (K.mode === "acceptEdits" && HkY(z)) return {
        behavior: "allow",
        updatedInput: {
            command: q
        },
        decisionReason: {
            type: "mode",
            mode: "acceptEdits"
        }
    };
    return {
        behavior: "passthrough",
        message: `No mode-specific handling for '${z}' in ${K.mode} mode`
    }
}
// @from(Ln 424728, Col 0)
function QSK(q, K) {
    if (K.mode === "bypassPermissions") return {
        behavior: "passthrough",
        message: "Bypass mode is handled in main permission flow"
    };
    if (K.mode === "dontAsk") return {
        behavior: "passthrough",
        message: "DontAsk mode is handled in main permission flow"
    };
    let _ = TO(q.command);
    for (let z of _) {
        let Y = JkY(z, K);
        if (Y.behavior !== "passthrough") return Y
    }
    return {
        behavior: "passthrough",
        message: "No mode-specific validation required"
    }
}
// @from(Ln 424747, Col 4)
jkY
// @from(Ln 424748, Col 4)
dSK = L(() => {
    vD();
    MT();
    jkY = ["mkdir", "touch", "rm", "rmdir", "mv", "cp", "sed"]
})
// @from(Ln 424757, Col 0)
function cSK(q, K, _, z) {
    return
}
// @from(Ln 424761, Col 0)
function Jn8(q) {
    let K = q.trim().split(/\s+/).filter(Boolean);
    if (K.length === 0) return null;
    let _ = 0;
    while (_ < K.length && IY7.test(K[_])) {
        let A = i5(K[_], "="),
            O = !1;
        if (!N98.has(A)) return null;
        _++
    }
    let z = K.slice(_);
    if (z.length < 2) return null;
    let Y = z[1];
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(Y)) return null;
    return z.slice(0, 2).join(" ")
}
// @from(Ln 424778, Col 0)
function iSK(q) {
    let K = q.trim().split(/\s+/).filter(Boolean),
        _ = 0;
    while (_ < K.length && IY7.test(K[_])) {
        let Y = i5(K[_], "="),
            A = !1;
        if (!N98.has(Y)) return null;
        _++
    }
    let z = K[_];
    if (!z) return null;
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(z)) return null;
    if (PkY.has(z)) return null;
    return z
}
// @from(Ln 424794, Col 0)
function zx6(q) {
    let K = WkY(q);
    if (K) return tt6(KK.name, K);
    if (q.includes(`
`)) {
        let z = oY(q).trim();
        if (z) return tt6(KK.name, z)
    }
    let _ = Jn8(q);
    if (_) return tt6(KK.name, _);
    return KR8(KK.name, q)
}
// @from(Ln 424807, Col 0)
function WkY(q) {
    if (!q.includes("<<")) return null;
    let K = q.indexOf("<<");
    if (K <= 0) return null;
    let _ = q.substring(0, K).trim();
    if (!_) return null;
    let z = Jn8(_);
    if (z) return z;
    let Y = _.split(/\s+/).filter(Boolean),
        A = 0;
    while (A < Y.length && IY7.test(Y[A])) {
        let O = i5(Y[A], "="),
            w = !1;
        if (!N98.has(O)) return null;
        A++
    }
    if (A >= Y.length) return null;
    return Y.slice(A, A + 2).join(" ") || null
}
// @from(Ln 424827, Col 0)
function rSK(q) {
    return tt6(KK.name, q)
}
// @from(Ln 424831, Col 0)
function ZP6(q, K) {
    return Vk(q, K, !1, !0)
}
// @from(Ln 424835, Col 0)
function lR6(q) {
    return N98.has(q) || !1
}
// @from(Ln 424839, Col 0)
function bY7(q) {
    let _ = q.split(`
`).filter((z) => {
        let Y = z.trim();
        return Y !== "" && !Y.startsWith("#")
    });
    if (_.length === 0) return q;
    return _.join(`
`)
}
// @from(Ln 424850, Col 0)
function jF(q) {
    let K = [/^timeout[ \t]+(?:(?:--(?:foreground|preserve-status|verbose)|--(?:kill-after|signal)=[A-Za-z0-9_.+-]+|--(?:kill-after|signal)[ \t]+[A-Za-z0-9_.+-]+|-v|-[ks][ \t]+[A-Za-z0-9_.+-]+|-[ks][A-Za-z0-9_.+-]+)[ \t]+)*(?:--[ \t]+)?\d+(?:\.\d+)?[smhd]?[ \t]+/, /^time[ \t]+(?:--[ \t]+)?/, /^nice(?:[ \t]+-n[ \t]+-?\d+|[ \t]+-\d+)?[ \t]+(?:--[ \t]+)?/, /^stdbuf(?:[ \t]+-[ioe][LN0-9]+)+[ \t]+(?:--[ \t]+)?/, /^nohup[ \t]+(?:--[ \t]+)?/],
        _ = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)[ \t]+/,
        z = q,
        Y = "";
    while (z !== Y) {
        Y = z, z = bY7(z);
        let A = z.match(_);
        if (A) {
            let O = A[1],
                w = !1;
            if (N98.has(O)) z = z.replace(_, "")
        }
    }
    Y = "";
    while (z !== Y) {
        Y = z, z = bY7(z);
        for (let A of K) z = z.replace(A, "")
    }
    return z.trim()
}
// @from(Ln 424872, Col 0)
function DkY(q, K) {
    if (K) return K.envVars.some((A) => !lR6(A.name));
    let _ = /^([A-Za-z_][A-Za-z0-9_]*)\+?=/,
        z = /^[A-Za-z_][A-Za-z0-9_]*\+?=(?:"[^"$`\\]*"|'[^']*'|[A-Za-z0-9_./:+-]*)[ \t]+/,
        Y = q.command;
    for (;;) {
        let A = Y.match(_);
        if (!A) return !1;
        if (!lR6(A[1])) return !0;
        let O = Y.match(z);
        if (!O) return !0;
        Y = Y.slice(O[0].length)
    }
}
// @from(Ln 424887, Col 0)
function uY7(q, K) {
    let _ = /^([A-Za-z_][A-Za-z0-9_]*(?:\[[^\]]*\])?)\+?=(?:'[^'\n\r]*'|"(?:\\.|[^"$`\\\n\r])*"|\\.|[^ \t\n\r$`;|&()<>\\\\'"])*[ \t]+/,
        z = q,
        Y = "";
    while (z !== Y) {
        Y = z, z = bY7(z);
        let A = z.match(_);
        if (!A) continue;
        if (K?.test(A[1])) break;
        z = z.slice(A[0].length)
    }
    return z.trim()
}
// @from(Ln 424901, Col 0)
function CY7(q, K, _, {
    stripAllEnvVars: z = !1,
    skipCompoundCheck: Y = !1
} = {}) {
    let A = q.command.trim(),
        O = od(A).commandWithoutRedirections,
        $ = (_ === "exact" ? [A, O] : [O]).flatMap((H) => {
            let J = jF(H);
            return J !== H ? [H, J] : [H]
        });
    if (z) {
        let H = new Set($),
            J = 0;
        while (J < $.length) {
            let X = $.length;
            for (let M = J; M < X; M++) {
                let P = $[M];
                if (!P) continue;
                let W = uY7(P);
                if (!H.has(W)) $.push(W), H.add(W);
                let D = jF(P);
                if (!H.has(D)) $.push(D), H.add(D)
            }
            J = X
        }
    }
    let j = new Map;
    if (_ === "prefix" && !Y) {
        for (let H of $)
            if (!j.has(H)) j.set(H, TO(H).length > 1)
    }
    return Array.from(K.entries()).filter(([H]) => {
        let J = xY7(H);
        return $.some((X) => {
            switch (J.type) {
                case "exact":
                    return J.command === X;
                case "prefix": {
                    let M = J.prefix.replace(/[ \t]+/g, " "),
                        P = X.replace(/[ \t]+/g, " ");
                    switch (_) {
                        case "exact":
                            return M === P;
                        case "prefix": {
                            if (j.get(X)) return !1;
                            if (P === M) return !0;
                            if (P.startsWith(M + " ")) return !0;
                            let W = "xargs " + M;
                            if (P === W) return !0;
                            return P.startsWith(W + " ")
                        }
                    }
                    break
                }
                case "wildcard":
                    if (_ === "exact") return !1;
                    if (j.get(X)) return !1;
                    return ZP6(J.pattern, X) || ZP6(`xargs ${J.pattern}`, X)
            }
        })
    }).map(([, H]) => H)
}
// @from(Ln 424964, Col 0)
function Yx6(q, K, _, {
    skipCompoundCheck: z = !1
} = {}) {
    let Y = QF(K, KK, "deny"),
        A = CY7(q, Y, _, {
            stripAllEnvVars: !0,
            skipCompoundCheck: !0
        }),
        O = QF(K, KK, "ask"),
        w = CY7(q, O, _, {
            stripAllEnvVars: !0,
            skipCompoundCheck: !0
        }),
        $ = QF(K, KK, "allow"),
        j = CY7(q, $, _, {
            skipCompoundCheck: z
        });
    return {
        matchingDenyRules: A,
        matchingAskRules: w,
        matchingAllowRules: j
    }
}
// @from(Ln 424987, Col 0)
async function lSK(q, K, _, z, Y, A) {
    let O = Xn8(q, K);
    if (O.behavior !== "passthrough") return O;
    let w = oSK(q, K, z, Y, A);
    if (w.behavior === "deny" || w.behavior === "ask") return w;
    if (w.behavior === "allow") return w;
    let $ = _?.commandPrefix ? rSK(_.commandPrefix) : zx6(q.command);
    return {
        ...w,
        suggestions: $
    }
}
// @from(Ln 425000, Col 0)
function nSK(q, K, _) {
    if (!Z7.isSandboxingEnabled() || !Z7.isAutoAllowBashIfSandboxedEnabled() || !AL(q)) return null;
    let z = ZkY(q, K);
    if (z.behavior === "passthrough") return null;
    let Y = /^([A-Za-z_][A-Za-z0-9_]*)\+?=/,
        A = _.some((w) => w.envVars.some(($) => !lR6($.name)) || w.argv.some(($) => {
            let j = $.match(Y);
            return j !== null && !lR6(j[1])
        })),
        O = _.some((w) => w.redirects.some(($) => /^\/dev\/(tcp|udp)\//.test($.target)));
    if (A || O) return null;
    return z
}
// @from(Ln 425014, Col 0)
function ZkY(q, K) {
    let _ = q.command.trim(),
        {
            matchingDenyRules: z,
            matchingAskRules: Y
        } = Yx6(q, K, "prefix");
    if (z[0] !== void 0) return {
        behavior: "deny",
        message: `Permission to use ${KK.name} with command ${_} has been denied.`,
        decisionReason: {
            type: "rule",
            rule: z[0]
        }
    };
    let A = TO(_);
    if (A.length > 1) {
        let O;
        for (let w of A) {
            let $ = Yx6({
                command: w
            }, K, "prefix");
            if ($.matchingDenyRules[0] !== void 0) return {
                behavior: "deny",
                message: `Permission to use ${KK.name} with command ${_} has been denied.`,
                decisionReason: {
                    type: "rule",
                    rule: $.matchingDenyRules[0]
                }
            };
            O ??= $.matchingAskRules[0]
        }
        if (O) return {
            behavior: "ask",
            message: Qz(KK.name),
            decisionReason: {
                type: "rule",
                rule: O
            }
        }
    }
    if (Y[0] !== void 0) return {
        behavior: "ask",
        message: Qz(KK.name),
        decisionReason: {
            type: "rule",
            rule: Y[0]
        }
    };
    return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "other",
            reason: "Auto-allowed with sandbox (autoAllowBashIfSandboxed enabled)"
        }
    }
}
// @from(Ln 425072, Col 0)
function fkY(q, K, _, z) {
    let Y = [],
        A = [];
    for (let O = 0; O < q.length; O++) {
        let w = q[O];
        if (w === `cd ${_}` || w === `cd ${z}`) continue;
        Y.push(w), A.push(K?.[O])
    }
    return {
        subcommands: Y,
        astCommandsByIdx: A
    }
}
// @from(Ln 425086, Col 0)
function GkY(q) {
    if (q.includes("||") || q.includes(";")) return !1;
    if (q.replaceAll("&&", "").includes("&")) return !1;
    return !0
}
// @from(Ln 425092, Col 0)
function vkY(q, K, _) {
    if (!q) return null;
    if (q.envVars.length > 0 || q.redirects.length > 0) return null;
    if (q.argv.length !== 2 || q.argv[0] !== "cd") return null;
    let z = q.argv[1];
    if (z.startsWith("-")) return null;
    if (!XkY(z) && !z.startsWith("./") && !z.startsWith("../")) return null;
    let {
        allowed: Y,
        resolvedPath: A
    } = rt6(z, K, _, "read");
    if (!Y) return null;
    if (!Tk(A, _, [A])) return null;
    return A
}
// @from(Ln 425108, Col 0)
function aSK(q, K) {
    let _ = Xn8(q, K);
    if (_.behavior !== "passthrough") return _;
    let z = Yx6(q, K, "prefix").matchingDenyRules[0];
    if (z !== void 0) return {
        behavior: "deny",
        message: `Permission to use ${KK.name} with command ${q.command} has been denied.`,
        decisionReason: {
            type: "rule",
            rule: z
        }
    };
    return null
}
// @from(Ln 425123, Col 0)
function TkY(q, K, _) {
    let z = aSK(q, K);
    if (z !== null) return z;
    for (let Y of _) {
        let A = Yx6({
            ...q,
            command: Y.text
        }, K, "prefix").matchingDenyRules[0];
        if (A !== void 0) return {
            behavior: "deny",
            message: `Permission to use ${KK.name} with command ${q.command} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: A
            }
        }
    }
    return null
}
// @from(Ln 425143, Col 0)
function $kK(q, K, _, z) {
    if (!VK6()) return !1;
    if (K.mode === "auto") return !1;
    if (K.mode === "bypassPermissions") return !1;
    let Y = nh8(K);
    if (Y.length === 0) return !1;
    let A = b8(),
        O = ih8(q, A, Y, "allow", _, z);
    return O.catch(() => {}), sSK.set(q, O), !0
}
// @from(Ln 425154, Col 0)
function Vx8() {
    sSK.clear()
}
// @from(Ln 425157, Col 0)
async function _38(q, K, _ = Qt6) {
    let z = K.getAppState(),
        Y = await gt6(q.command),
        A = Y ? dt6(q.command, Y) : {
            kind: "simple",
            commands: []
        };
    if (A.kind === "too-complex") {
        let g = aSK(q, z.toolPermissionContext);
        if (g !== null) return g;
        let c = {
            type: "other",
            reason: A.reason,
            bashMissKind: "too-complex"
        };
        return d("tengu_bash_ast_too_complex", {
            nodeTypeId: WP4(A.nodeType)
        }), {
            behavior: "ask",
            decisionReason: c,
            message: Qz(KK.name, c),
            suggestions: [],
            ...{}
        }
    }
    let O = A.commands,
        w = VP4(O);
    if (!w.ok) {
        let g = TkY(q, z.toolPermissionContext, O);
        if (g !== null) return g;
        if (w.kind === "newline-hash") {
            let n = nSK(q, z.toolPermissionContext, O);
            if (n) return n
        }
        let c = {
            type: "other",
            reason: w.reason,
            bashMissKind: "semantics"
        };
        return {
            behavior: "ask",
            decisionReason: c,
            message: Qz(KK.name, c),
            suggestions: []
        }
    }
    let $ = O.map((g) => g.text),
        j = O.flatMap((g) => g.redirects),
        H = nSK(q, z.toolPermissionContext, O);
    if (H) return H;
    let J = Xn8(q, z.toolPermissionContext);
    if (J.behavior === "deny") return J;
    if (VK6() && z.toolPermissionContext.mode !== "auto") {
        let g = EP4(z.toolPermissionContext),
            c = yP4(z.toolPermissionContext),
            n = g.length > 0,
            l = c.length > 0;
        if (n || l) {
            let [z6, A6] = await Promise.all([n ? ih8(q.command, b8(), g, "deny", K.abortController.signal, K.options.isNonInteractiveSession) : null, l ? ih8(q.command, b8(), c, "ask", K.abortController.signal, K.options.isNonInteractiveSession) : null]);
            if (K.abortController.signal.aborted) throw new sz;
            if (z6) cSK(q.command, "deny", g, z6);
            if (A6) cSK(q.command, "ask", c, A6);
            if (z6?.matches && z6.confidence === "high") return {
                behavior: "deny",
                message: `Denied by Bash prompt rule: "${z6.matchedDescription}"`,
                decisionReason: {
                    type: "other",
                    reason: `Denied by Bash prompt rule: "${z6.matchedDescription}"`
                }
            };
            if (A6?.matches && A6.confidence === "high") {
                let e;
                if (_ === Qt6) e = zx6(q.command);
                else {
                    let i = await _(q.command, K.abortController.signal, K.options.isNonInteractiveSession);
                    if (K.abortController.signal.aborted) throw new sz;
                    e = i?.commandPrefix ? rSK(i.commandPrefix) : zx6(q.command)
                }
                return {
                    behavior: "ask",
                    message: Qz(KK.name),
                    decisionReason: {
                        type: "other",
                        reason: `Required by Bash prompt rule: "${A6.matchedDescription}"`,
                        bashMissKind: "prompt-ask-rule"
                    },
                    suggestions: e,
                    ...{}
                }
            }
        }
    }
    let X = await gSK(q, (g) => _38(g, K, _), {
        isNormalizedCdCommand: Hn8,
        isNormalizedGitCommand: Lu8
    }, Y);
    if (X.behavior !== "passthrough") {
        if (X.behavior === "allow") {
            z = K.getAppState();
            let g = Eu8(q, b8(), z.toolPermissionContext, v78(q.command), j, O);
            if (g.behavior !== "passthrough") return g
        }
        if (X.behavior === "ask") return z = K.getAppState(), {
            ...X,
            ...{}
        };
        return X
    }
    let M = b8(),
        P = y1() === "windows" ? sX(M) : M,
        {
            subcommands: W,
            astCommandsByIdx: D
        } = fkY($, O, M, P),
        Z = W.filter((g) => Hn8(g));
    if (Z.length > 1) {
        let g = {
            type: "other",
            reason: "Multiple directory changes in one command require approval for clarity",
            bashMissKind: "multi-cd"
        };
        return {
            behavior: "ask",
            decisionReason: g,
            message: Qz(KK.name, g)
        }
    }
    let G = Z.length > 0,
        f = M,
        v = G;
    if (G && W.length > 1 && W.length === $.length && Hn8(W[0]) && GkY(q.command)) {
        let g = vkY(D[0], M, z.toolPermissionContext);
        if (g !== null) f = g, v = !1
    }
    if (G) {
        if (W.some((c) => Lu8(c.trim()))) {
            let c = {
                type: "other",
                reason: "Compound commands with cd and git require approval to prevent bare repository attacks",
                bashMissKind: "cd-git-compound"
            };
            return {
                behavior: "ask",
                decisionReason: c,
                message: Qz(KK.name, c)
            }
        }
    }
    z = K.getAppState();
    let V = W.map((g, c) => oSK({
        command: g
    }, z.toolPermissionContext, v, D[c], f));
    if (V.find((g) => g.behavior === "deny") !== void 0) return {
        behavior: "deny",
        message: `Permission to use ${KK.name} with command ${q.command} has been denied.`,
        decisionReason: {
            type: "subcommandResults",
            reasons: new Map(V.map((g, c) => [W[c], g]))
        }
    };
    let N = D.filter((g) => g !== void 0),
        R = Eu8(q, f, z.toolPermissionContext, v, j, N);
    if (R.behavior === "deny") return R;
    let h = V.find((g) => g.behavior === "ask"),
        C = w7(V, (g) => g.behavior !== "allow");
    if (R.behavior === "ask" && h === void 0) return R;
    if (h !== void 0 && C === 1) return {
        ...h,
        ...{}
    };
    if (J.behavior === "allow") return J;
    if (V.every((g) => g.behavior === "allow")) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "subcommandResults",
            reasons: new Map(V.map((g, c) => [W[c], g]))
        }
    };
    let x = null;
    if (_ !== Qt6) {
        if (x = await _(q.command, K.abortController.signal, K.options.isNonInteractiveSession), K.abortController.signal.aborted) throw new sz
    }
    if (z = K.getAppState(), W.length === 1) {
        let g = await lSK({
            command: W[0]
        }, z.toolPermissionContext, x, v, D[0], f);
        if (g.behavior === "ask" || g.behavior === "passthrough") return {
            ...g,
            ...{}
        };
        return g
    }
    let B = new Map;
    for (let g = 0; g < W.length; g++) {
        let c = W[g];
        B.set(c, await lSK({
            ...q,
            command: c
        }, z.toolPermissionContext, x?.subcommandPrefixes.get(c), v, D[g], f))
    }
    if (W.every((g) => {
            return B.get(g)?.behavior === "allow"
        })) return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "subcommandResults",
            reasons: B
        }
    };
    let m = new Map;
    for (let [g, c] of B)
        if (c.behavior === "ask" || c.behavior === "passthrough") {
            let n = "suggestions" in c ? c.suggestions : void 0,
                l = gd(n);
            for (let z6 of l) {
                let A6 = I9(z6);
                m.set(A6, z6)
            }
            if (c.behavior === "ask" && l.length === 0 && c.decisionReason?.type !== "rule")
                for (let z6 of gd(zx6(g))) {
                    let A6 = I9(z6);
                    m.set(A6, z6)
                }
        } let S = {
            type: "subcommandResults",
            reasons: B
        },
        F = Array.from(m.values()).slice(0, MkY),
        U = F.length > 0 ? [{
            type: "addRules",
            rules: F,
            behavior: "allow",
            destination: "localSettings"
        }] : void 0;
    return {
        behavior: h !== void 0 ? "ask" : "passthrough",
        message: Qz(KK.name, S),
        decisionReason: S,
        suggestions: U,
        ...{}
    }
}
// @from(Ln 425402, Col 0)
function Lu8(q) {
    if (q.startsWith("git ") || q === "git") return !0;
    let K = jF(q),
        _ = XM(K);
    if (_[0] === "git") return !0;
    if (_[0] === "xargs" && _.includes("git")) return !0;
    return !1
}
// @from(Ln 425411, Col 0)
function Hn8(q) {
    let K = XM(jF(q))[0];
    return K === "cd" || K === "pushd" || K === "popd"
}
// @from(Ln 425416, Col 0)
function v78(q) {
    return TO(q).some((K) => Hn8(K.trim()))
}
// @from(Ln 425419, Col 4)
IY7
// @from(Ln 425419, Col 9)
MkY = 5
// @from(Ln 425420, Col 4)
PkY
// @from(Ln 425420, Col 9)
xSK
// @from(Ln 425420, Col 14)
xY7
// @from(Ln 425420, Col 19)
N98
// @from(Ln 425420, Col 24)
Xn8 = (q, K) => {
        let _ = q.command.trim(),
            {
                matchingDenyRules: z,
                matchingAskRules: Y,
                matchingAllowRules: A
            } = Yx6(q, K, "exact");
        if (z[0] !== void 0) return {
            behavior: "deny",
            message: `Permission to use ${KK.name} with command ${_} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: z[0]
            }
        };
        if (Y[0] !== void 0) return {
            behavior: "ask",
            message: Qz(KK.name),
            decisionReason: {
                type: "rule",
                rule: Y[0]
            }
        };
        if (A[0] !== void 0) return {
            behavior: "allow",
            updatedInput: q,
            decisionReason: {
                type: "rule",
                rule: A[0]
            }
        };
        let O = {
            type: "other",
            reason: "This command requires approval",
            bashMissKind: "no-rule-match"
        };
        return {
            behavior: "passthrough",
            message: Qz(KK.name, O),
            decisionReason: O,
            suggestions: zx6(_)
        }
    }
// @from(Ln 425463, Col 4)
oSK = (q, K, _, z, Y = b8()) => {
        let A = q.command.trim(),
            O = Xn8(q, K);
        if (O.behavior === "deny" || O.behavior === "ask") return O;
        let {
            matchingDenyRules: w,
            matchingAskRules: $,
            matchingAllowRules: j
        } = Yx6(q, K, "prefix", {
            skipCompoundCheck: z !== void 0
        });
        if (w[0] !== void 0) return {
            behavior: "deny",
            message: `Permission to use ${KK.name} with command ${A} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: w[0]
            }
        };
        if ($[0] !== void 0) return {
            behavior: "ask",
            message: Qz(KK.name),
            decisionReason: {
                type: "rule",
                rule: $[0]
            }
        };
        let H = Eu8(q, Y, K, _, z?.redirects, z ? [z] : void 0);
        if (H.behavior !== "passthrough") return H;
        if (O.behavior === "allow") return O;
        if (j[0] !== void 0) return {
            behavior: "allow",
            updatedInput: q,
            decisionReason: {
                type: "rule",
                rule: j[0]
            }
        };
        let J = Hc4(q, K);
        if (J.behavior !== "passthrough") return J;
        let X = QSK(q, K);
        if (X.behavior !== "passthrough") return X;
        if (KK.isReadOnly(q) && !DkY(q, z)) return {
            behavior: "allow",
            updatedInput: q,
            decisionReason: {
                type: "other",
                reason: "Read-only command is allowed"
            }
        };
        let M = {
            type: "other",
            reason: "This command requires approval",
            bashMissKind: "no-rule-match"
        };
        return {
            behavior: "passthrough",
            message: Qz(KK.name, M),
            decisionReason: M,
            suggestions: zx6(A)
        }
    }
// @from(Ln 425525, Col 4)
sSK
// @from(Ln 425526, Col 4)
MT = L(() => {
    eG();
    C8();
    Wy6();
    vD();
    kj6();
    n7();
    m8();
    Sz();
    MH();
    Gy6();
    cZ();
    g$();
    NK6();
    NK();
    yY();
    e8();
    rC();
    AZ();
    USK();
    dSK();
    Ya1();
    Nu8();
    xM6();
    IY7 = /^[A-Za-z_]\w*=/;
    PkY = new Set(["sh", "bash", "zsh", "fish", "csh", "tcsh", "ksh", "dash", "cmd", "powershell", "pwsh", "env", "xargs", "nice", "stdbuf", "nohup", "timeout", "time", "sudo", "doas", "pkexec"]);
    xSK = Tg1;
    xY7 = qR8, N98 = new Set(["GOEXPERIMENT", "GOOS", "GOARCH", "CGO_ENABLED", "GO111MODULE", "RUST_BACKTRACE", "RUST_LOG", "NODE_ENV", "PYTHONUNBUFFERED", "PYTHONDONTWRITEBYTECODE", "PYTEST_DISABLE_PLUGIN_AUTOLOAD", "PYTEST_DEBUG", "ANTHROPIC_API_KEY", "LANG", "LANGUAGE", "LC_ALL", "LC_CTYPE", "LC_TIME", "CHARSET", "TERM", "COLORTERM", "NO_COLOR", "FORCE_COLOR", "TZ", "LS_COLORS", "LSCOLORS", "GREP_COLOR", "GREP_COLORS", "GCC_COLORS", "TIME_STYLE", "BLOCK_SIZE", "BLOCKSIZE", "COLUMNS", "LINES", "CLICOLOR", "CLICOLOR_FORCE", "CI", "DEBIAN_FRONTEND", "GIT_TERMINAL_PROMPT"]);
    sSK = new Map
})
// @from(Ln 425557, Col 0)
function kkY(q) {
    let _ = y7().sandbox?.excludedCommands ?? [];
    if (_.length === 0) return !1;
    let z;
    try {
        z = TO(q)
    } catch {
        z = [q]
    }
    for (let Y of z) {
        let O = [Y.trim()],
            w = new Set(O),
            $ = 0;
        while ($ < O.length) {
            let j = O.length;
            for (let H = $; H < j; H++) {
                let J = O[H],
                    X = uY7(J, VkY);
                if (!w.has(X)) O.push(X), w.add(X);
                let M = jF(J);
                if (!w.has(M)) O.push(M), w.add(M)
            }
            $ = j
        }
        for (let j of _) {
            let H = xY7(j);
            for (let J of O) switch (H.type) {
                case "prefix":
                    if (J === H.prefix || J.startsWith(H.prefix + " ")) return !0;
                    break;
                case "exact":
                    if (J === H.command) return !0;
                    break;
                case "wildcard":
                    if (ZP6(H.pattern, J)) return !0;
                    break
            }
        }
    }
    return !1
}
// @from(Ln 425599, Col 0)
function AL(q) {
    if (xP() && Js()) return !0;
    if (!Z7.isSandboxingEnabled()) return !1;
    if (q.dangerouslyDisableSandbox && Z7.areUnsandboxedCommandsAllowed()) return !1;
    if (!q.command) return !1;
    if (kkY(q.command)) return !1;
    return !0
}
// @from(Ln 425607, Col 4)
VkY
// @from(Ln 425608, Col 4)
xM6 = L(() => {
    B1();
    vD();
    yY();
    a1();
    zy();
    MT();
    VkY = /^(LD_|DYLD_|PATH$)/
})
// @from(Ln 425617, Col 4)
KCK = {}
// @from(Ln 425622, Col 0)
function ykY(q) {
    return EkY.has(q)
}
// @from(Ln 425625, Col 4)
tSK = null
// @from(Ln 425626, Col 4)
eSK = null
// @from(Ln 425627, Col 4)
qCK = null
// @from(Ln 425628, Col 4)
EkY
// @from(Ln 425629, Col 4)
_CK = L(() => {
    cp();
    Rz();
    jJ();
    Kc();
    cX6();
    EkY = new Set([xq, a5, T9, dC6, Zj, py6, "ReadMcpResourceTool", Vy, YT, Sc, gk, xD, RV, tN, AO, d56, Fk, lp, Cc, tW, ...qCK ? [qCK] : [], ...tSK ? [tSK] : [], ...eSK ? [eSK] : [], XK8])
})
// @from(Ln 425638, Col 0)
function E98(q) {
    return qX8(q)
}
// @from(Ln 425642, Col 0)
function wx6(q) {
    return mY7.flatMap((K) => (q.alwaysAllowRules[K] || []).map((_) => ({
        source: K,
        ruleBehavior: "allow",
        ruleValue: h2(_)
    })))
}
// @from(Ln 425650, Col 0)
function Qz(q, K) {
    if (K) {
        if (K.type === "classifier") return `Classifier '${K.classifier}' requires approval for this ${q} command: ${K.reason}`;
        switch (K.type) {
            case "hook":
                return K.reason ? `Hook '${K.hookName}' blocked this action: ${K.reason}` : `Hook '${K.hookName}' requires approval for this ${q} command`;
            case "rule": {
                let z = I9(K.rule.ruleValue),
                    Y = E98(K.rule.source);
                return `Permission rule '${z}' from ${Y} requires approval for this ${q} command`
            }
            case "subcommandResults": {
                let z = [];
                for (let [Y, A] of K.reasons)
                    if (A.behavior === "ask" || A.behavior === "passthrough")
                        if (q === "Bash") {
                            let {
                                commandWithoutRedirections: O,
                                redirections: w
                            } = od(Y), $ = w.length > 0 ? O : Y;
                            z.push($)
                        } else z.push(Y);
                if (z.length > 0) {
                    let Y = z.length;
                    return `This ${q} command contains multiple operations. The following ${O7(Y,"part")} ${O7(Y,"requires","require")} approval: ${z.join(", ")}`
                }
                return `This ${q} command contains multiple operations that require approval`
            }
            case "permissionPromptTool":
                return `Tool '${K.permissionPromptToolName}' requires approval for this ${q} command`;
            case "sandboxOverride":
                return "Run outside of the sandbox";
            case "workingDir":
                return K.reason;
            case "safetyCheck":
            case "other":
                return K.reason;
            case "mode":
                return `Current permission mode (${yr(K.mode)}) requires approval for this ${q} command`;
            case "asyncAgent":
                return K.reason
        }
    }
    return `Claude requested permissions to use ${q}, but you haven't granted it yet.`
}
// @from(Ln 425696, Col 0)
function N_6(q) {
    return mY7.flatMap((K) => (q.alwaysDenyRules[K] || []).map((_) => ({
        source: K,
        ruleBehavior: "deny",
        ruleValue: h2(_)
    })))
}
// @from(Ln 425704, Col 0)
function $x6(q) {
    return mY7.flatMap((K) => (q.alwaysAskRules[K] || []).map((_) => ({
        source: K,
        ruleBehavior: "ask",
        ruleValue: h2(_)
    })))
}
// @from(Ln 425712, Col 0)
function BY7(q, K) {
    if (K.ruleValue.ruleContent !== void 0) return !1;
    let _ = WO1(q);
    if (K.ruleValue.toolName === _) return !0;
    let z = Cm(K.ruleValue.toolName),
        Y = Cm(_);
    return z !== null && Y !== null && (z.toolName === void 0 || z.toolName === "*") && z.serverName === Y.serverName
}
// @from(Ln 425721, Col 0)
function RkY(q, K) {
    return wx6(q).find((_) => BY7(K, _)) || null
}
// @from(Ln 425725, Col 0)
function dd8(q, K) {
    return N_6(q).find((_) => BY7(K, _)) || null
}
// @from(Ln 425729, Col 0)
function YCK(q, K) {
    return $x6(q).find((_) => BY7(K, _)) || null
}
// @from(Ln 425733, Col 0)
function bHK(q, K, _) {
    return N_6(q).find((z) => z.ruleValue.toolName === K && z.ruleValue.ruleContent === _) || null
}
// @from(Ln 425737, Col 0)
function QK8(q, K, _) {
    let z = new Set;
    for (let Y of N_6(K))
        if (Y.ruleValue.toolName === _ && Y.ruleValue.ruleContent !== void 0) z.add(Y.ruleValue.ruleContent);
    return q.filter((Y) => !z.has(Y.agentType))
}
// @from(Ln 425744, Col 0)
function QF(q, K, _) {
    return qP6(q, WO1(K), _)
}
// @from(Ln 425748, Col 0)
function qP6(q, K, _) {
    let z = new Map,
        Y = [];
    switch (_) {
        case "allow":
            Y = wx6(q);
            break;
        case "deny":
            Y = N_6(q);
            break;
        case "ask":
            Y = $x6(q);
            break
    }
    for (let A of Y)
        if (A.ruleValue.toolName === K && A.ruleValue.ruleContent !== void 0 && A.ruleBehavior === _) z.set(A.ruleValue.ruleContent, A);
    return z
}
// @from(Ln 425767, Col 0)
function y98(q, K) {
    if (q?.behavior === "deny" || q?.behavior === "ask") return E(`PermissionRequest hook allowed ${K} with updatedInput, but ${q.behavior} rule overrides: ${q.message}`), q;
    return null
}
// @from(Ln 425771, Col 0)
async function SkY(q, K, _, z, Y, A) {
    try {
        for await (let O of Be(q.name, _, K, z, Y, A, z.abortController.signal)) {
            if (!O.permissionRequestResult) continue;
            let w = O.permissionRequestResult;
            if (w.behavior === "allow") {
                let $ = w.updatedInput ?? K;
                if (w.updatedInput) {
                    let j = y98(await yM6(q, $, z), q.name);
                    if (j) return j.behavior === "ask" ? {
                        behavior: "deny",
                        message: j.message,
                        decisionReason: j.decisionReason ?? {
                            type: "other",
                            reason: "ask rule on hook-rewritten input"
                        }
                    } : j
                }
                if (w.updatedPermissions?.length) {
                    let j = w.updatedPermissions;
                    Hp(j), z.setToolPermissionContext((H) => Ky(H, j))
                }
                return {
                    behavior: "allow",
                    updatedInput: $,
                    decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest"
                    }
                }
            }
            if (w.behavior === "deny") {
                if (w.interrupt) E(`Hook interrupt: tool=${q.name} hookMessage=${w.message}`), z.abortController.abort();
                return {
                    behavior: "deny",
                    message: w.message || "Permission denied by hook",
                    decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest",
                        reason: w.message
                    }
                }
            }
        }
    } catch (O) {
        j6(Error("PermissionRequest hook failed for headless agent", {
            cause: r1(O)
        }))
    }
    return null
}
// @from(Ln 425823, Col 0)
function Ax6(q, K) {
    if (q.localDenialTracking) Object.assign(q.localDenialTracking, K);
    else q.setAppState((_) => {
        if (_.denialTracking === K) return _;
        return {
            ..._,
            denialTracking: K
        }
    })
}
// @from(Ln 425834, Col 0)
function CkY(q, K, _, z, Y, A, O) {
    if (!yI4(q)) return null;
    let w = q.totalDenials >= Mx8.maxTotal,
        $ = K.toolPermissionContext.shouldAvoidPermissionPrompts,
        j = q.totalDenials,
        H = q.consecutiveDenials,
        J = w ? `${j} actions were blocked this session. Please review the transcript before continuing.` : `${H} consecutive actions were blocked. Please review the transcript before continuing.`;
    if (d("tengu_auto_mode_denial_limit_exceeded", {
            limit: w ? "total" : "consecutive",
            mode: $ ? "headless" : "cli",
            messageID: z.message.id,
            consecutiveDenials: H,
            totalDenials: j,
            toolName: PK(Y.name)
        }), $) throw new sz("Agent aborted: too many classifier denials in headless mode");
    if (E(`Classifier denial limit exceeded, falling back to prompting: ${J}`, {
            level: "warn"
        }), w) Ax6(O, {
        ...q,
        totalDenials: 0,
        consecutiveDenials: 0
    });
    let X = A.decisionReason?.type === "classifier" ? A.decisionReason.classifier : "auto-mode";
    return {
        ...A,
        decisionReason: {
            type: "classifier",
            classifier: X,
            reason: `${J}

Latest blocked action: ${_}`
        }
    }
}
// @from(Ln 425869, Col 0)
function pY7(q) {
    if (q?.type === "rule" && q.rule.ruleBehavior === "ask") return !0;
    if (q?.type === "subcommandResults") {
        for (let K of q.reasons.values())
            if (K.behavior === "ask" && pY7(K.decisionReason)) return !0
    }
    return !1
}
// @from(Ln 425877, Col 0)
async function yM6(q, K, _) {
    let z = _.getAppState(),
        Y = dd8(z.toolPermissionContext, q);
    if (Y) return {
        behavior: "deny",
        decisionReason: {
            type: "rule",
            rule: Y
        },
        message: `Permission to use ${q.name} has been denied.`
    };
    let A = YCK(z.toolPermissionContext, q);
    if (A) {
        if (!(q.name === S7 && Z7.isSandboxingEnabled() && Z7.isAutoAllowBashIfSandboxedEnabled() && AL(K))) return {
            behavior: "ask",
            decisionReason: {
                type: "rule",
                rule: A
            },
            message: Qz(q.name)
        }
    }
    let O = {
        behavior: "passthrough",
        message: Qz(q.name)
    };
    try {
        let w = q.inputSchema.parse(K);
        O = await q.checkPermissions(w, _)
    } catch (w) {
        if (w instanceof sz || w instanceof r_) throw w;
        j6(w)
    }
    if (O?.behavior === "deny") return O;
    if (O?.behavior === "ask" && pY7(O.decisionReason)) return O;
    if (O?.behavior === "ask" && Mn8(O.decisionReason)) return O;
    return null
}
// @from(Ln 425915, Col 0)
async function bkY(q, K, _) {
    if (_.abortController.signal.aborted) throw new sz;
    let z = _.getAppState(),
        Y = dd8(z.toolPermissionContext, q);
    if (Y) return {
        behavior: "deny",
        decisionReason: {
            type: "rule",
            rule: Y
        },
        message: `Permission to use ${q.name} has been denied.`
    };
    let A = YCK(z.toolPermissionContext, q);
    if (A) {
        if (!(q.name === S7 && Z7.isSandboxingEnabled() && Z7.isAutoAllowBashIfSandboxedEnabled() && AL(K))) return {
            behavior: "ask",
            decisionReason: {
                type: "rule",
                rule: A
            },
            message: Qz(q.name)
        }
    }
    let O = {
        behavior: "passthrough",
        message: Qz(q.name)
    };
    try {
        let H = q.inputSchema.parse(K);
        O = await q.checkPermissions(H, _)
    } catch (H) {
        if (H instanceof sz || H instanceof r_) throw H;
        j6(H)
    }
    if (O?.behavior === "deny") return O;
    if (q.requiresUserInteraction?.() && O?.behavior === "ask") return O;
    if (O?.behavior === "ask" && pY7(O.decisionReason)) return O;
    if (O?.behavior === "ask" && Mn8(O.decisionReason)) return O;
    if (z = _.getAppState(), z.toolPermissionContext.mode === "bypassPermissions" || z.toolPermissionContext.mode === "plan" && z.toolPermissionContext.isBypassPermissionsModeAvailable) return {
        behavior: "allow",
        updatedInput: zCK(O, K),
        decisionReason: {
            type: "mode",
            mode: z.toolPermissionContext.mode
        }
    };
    let $ = RkY(z.toolPermissionContext, q);
    if ($) return {
        behavior: "allow",
        updatedInput: zCK(O, K),
        decisionReason: {
            type: "rule",
            rule: $
        }
    };
    let j = O.behavior === "passthrough" ? {
        ...O,
        behavior: "ask",
        message: Qz(q.name, O.decisionReason)
    } : O;
    if (j.behavior === "ask" && j.suggestions) E(`Permission suggestions for ${q.name}: ${I6(j.suggestions,null,2)}`);
    return j
}
// @from(Ln 425978, Col 0)
async function ACK({
    rule: q,
    initialContext: K,
    setToolPermissionContext: _
}) {
    if (q.source === "policySettings" || q.source === "flagSettings" || q.source === "command") throw Error("Cannot delete permission rules from read-only settings");
    let z = EY(K, {
        type: "removeRules",
        rules: [q.ruleValue],
        behavior: q.ruleBehavior,
        destination: q.source
    });
    switch (q.source) {
        case "localSettings":
        case "userSettings":
        case "projectSettings": {
            Xj4(q);
            break
        }
        case "cliArg":
        case "session":
            break
    }
    _(z)
}
// @from(Ln 426004, Col 0)
function OCK(q, K) {
    let _ = new Map;
    for (let Y of q) {
        let A = `${Y.source}:${Y.ruleBehavior}`;
        if (!_.has(A)) _.set(A, []);
        _.get(A).push(Y.ruleValue)
    }
    let z = [];
    for (let [Y, A] of _) {
        let [O, w] = Y.split(":");
        z.push({
            type: K,
            rules: A,
            behavior: w,
            destination: O
        })
    }
    return z
}
// @from(Ln 426024, Col 0)
function wCK(q, K) {
    let _ = OCK(K, "addRules");
    return Ky(q, _)
}
// @from(Ln 426029, Col 0)
function wc4(q, K) {
    let _ = q;
    if (Us6()) {
        let Y = [...$v, "cliArg", "session"],
            A = ["allow", "deny", "ask"];
        for (let O of Y)
            for (let w of A) _ = EY(_, {
                type: "replaceRules",
                rules: [],
                behavior: w,
                destination: O
            })
    }
    for (let Y of wv)
        for (let A of ["allow", "deny", "ask"]) _ = EY(_, {
            type: "replaceRules",
            rules: [],
            behavior: A,
            destination: Y
        });
    let z = OCK(K, "replaceRules");
    return Ky(_, z)
}
// @from(Ln 426053, Col 0)
function zCK(q, K) {
    return ("updatedInput" in q ? q.updatedInput : void 0) ?? K
}
// @from(Ln 426057, Col 0)
function Mn8(q, K = () => !0) {
    if (!q) return;
    if (q.type === "safetyCheck") return K(q) ? q : void 0;
    if (q.type === "subcommandResults")
        for (let _ of q.reasons.values()) {
            let z = Mn8(_.decisionReason, K);
            if (z) return z
        }
    return
}
// @from(Ln 426067, Col 4)
LkY
// @from(Ln 426067, Col 9)
hkY
// @from(Ln 426067, Col 14)
mY7
// @from(Ln 426067, Col 19)
LX = async (q, K, _, z, Y) => {
    let A = await bkY(q, K, _);
    if (A.behavior === "allow") {
        let O = _.getAppState();
        {
            let w = _.localDenialTracking ?? O.denialTracking;
            if (O.toolPermissionContext.mode === "auto" && w && w.consecutiveDenials > 0) {
                let $ = S18(w);
                Ax6(_, $)
            }
        }
        return A
    }
    if (A.behavior === "ask") {
        let O = _.getAppState();
        if (O.toolPermissionContext.mode === "dontAsk") return {
            behavior: "deny",
            decisionReason: {
                type: "mode",
                mode: "dontAsk"
            },
            message: jCK(q.name)
        };
        if (O.toolPermissionContext.mode === "auto" || O.toolPermissionContext.mode === "plan" && (hkY?.isAutoModeActive() ?? !1)) {
            if (Mn8(A.decisionReason, (P) => !P.classifierApprovable)) {
                if (O.toolPermissionContext.shouldAvoidPermissionPrompts) return {
                    behavior: "deny",
                    message: A.message,
                    decisionReason: {
                        type: "asyncAgent",
                        reason: "Safety check requires interactive approval and permission prompts are not available in this context"
                    }
                };
                return A
            }
            if (q.requiresUserInteraction?.() && A.behavior === "ask") return A;
            let $ = _.localDenialTracking ?? O.denialTracking ?? Px8();
            if (q.name === I5) {
                if (O.toolPermissionContext.shouldAvoidPermissionPrompts) return {
                    behavior: "deny",
                    message: "PowerShell tool requires interactive approval",
                    decisionReason: {
                        type: "asyncAgent",
                        reason: "PowerShell tool requires interactive approval and permission prompts are not available in this context"
                    }
                };
                return E(`Skipping auto mode classifier for ${q.name}: tool requires explicit user permission`), A
            }
            if (q.name !== T4) try {
                let P = q.inputSchema.parse(K),
                    W = await q.checkPermissions(P, {
                        ..._,
                        getAppState: () => {
                            let D = _.getAppState();
                            return {
                                ...D,
                                toolPermissionContext: {
                                    ...D.toolPermissionContext,
                                    mode: "acceptEdits"
                                }
                            }
                        }
                    });
                if (W.behavior === "allow") {
                    let D = S18($);
                    return Ax6(_, D), E(`Skipping auto mode classifier for ${q.name}: would be allowed in acceptEdits mode`), d("tengu_auto_mode_decision", {
                        decision: "allowed",
                        toolName: PK(q.name),
                        inProtectedNamespace: kC(),
                        agentMsgId: z.message.id,
                        confidence: "high",
                        fastPath: "acceptEdits"
                    }), {
                        behavior: "allow",
                        updatedInput: W.updatedInput ?? K,
                        decisionReason: {
                            type: "mode",
                            mode: "auto"
                        }
                    }
                }
            } catch (P) {
                if (P instanceof sz || P instanceof r_) throw P
            }
            if (LkY.isAutoModeAllowlistedTool(q.name)) {
                let P = S18($);
                return Ax6(_, P), E(`Skipping auto mode classifier for ${q.name}: tool is on the safe allowlist`), d("tengu_auto_mode_decision", {
                    decision: "allowed",
                    toolName: PK(q.name),
                    inProtectedNamespace: kC(),
                    agentMsgId: z.message.id,
                    confidence: "high",
                    fastPath: "allowlist"
                }), {
                    behavior: "allow",
                    updatedInput: K,
                    decisionReason: {
                        type: "mode",
                        mode: "auto"
                    }
                }
            }
            let j = F77(q.name, K);
            pI4(_.setClassifierApprovals, Y);
            let H;
            try {
                H = await PK8(_.messages, j, _.options.tools, O.toolPermissionContext, _.abortController.signal)
            } finally {
                _t(_.setClassifierApprovals, Y)
            }
            let J = H.unavailable ? "unavailable" : H.shouldBlock ? "blocked" : "allowed",
                X = H.usage && H.model ? UZ8(H.model, H.usage) : void 0;
            if (d("tengu_auto_mode_decision", {
                    decision: J,
                    toolName: PK(q.name),
                    inProtectedNamespace: kC(),
                    stripAllBashFlag: u8("tengu_bash_allowlist_strip_all", !1),
                    originalDecisionReasonType: A.decisionReason?.type,
                    agentMsgId: z.message.id,
                    classifierModel: H.model,
                    consecutiveDenials: H.shouldBlock ? $.consecutiveDenials + 1 : 0,
                    totalDenials: H.shouldBlock ? $.totalDenials + 1 : $.totalDenials,
                    classifierInputTokens: H.usage?.inputTokens,
                    classifierOutputTokens: H.usage?.outputTokens,
                    classifierCacheReadInputTokens: H.usage?.cacheReadInputTokens,
                    classifierCacheCreationInputTokens: H.usage?.cacheCreationInputTokens,
                    classifierDurationMs: H.durationMs,
                    classifierSystemPromptLength: H.promptLengths?.systemPrompt,
                    classifierToolCallsLength: H.promptLengths?.toolCalls,
                    classifierUserPromptsLength: H.promptLengths?.userPrompts,
                    sessionInputTokens: XY6(),
                    sessionOutputTokens: eu(),
                    sessionCacheReadInputTokens: FB6(),
                    sessionCacheCreationInputTokens: gB6(),
                    classifierCostUSD: X,
                    classifierStage: H.stage,
                    classifierStage1InputTokens: H.stage1Usage?.inputTokens,
                    classifierStage1OutputTokens: H.stage1Usage?.outputTokens,
                    classifierStage1CacheReadInputTokens: H.stage1Usage?.cacheReadInputTokens,
                    classifierStage1CacheCreationInputTokens: H.stage1Usage?.cacheCreationInputTokens,
                    classifierStage1DurationMs: H.stage1DurationMs,
                    classifierStage1RequestId: H.stage1RequestId,
                    classifierStage1MsgId: H.stage1MsgId,
                    classifierStage1CostUSD: H.stage1Usage && H.model ? UZ8(H.model, H.stage1Usage) : void 0,
                    classifierStage2InputTokens: H.stage2Usage?.inputTokens,
                    classifierStage2OutputTokens: H.stage2Usage?.outputTokens,
                    classifierStage2CacheReadInputTokens: H.stage2Usage?.cacheReadInputTokens,
                    classifierStage2CacheCreationInputTokens: H.stage2Usage?.cacheCreationInputTokens,
                    classifierStage2DurationMs: H.stage2DurationMs,
                    classifierStage2RequestId: H.stage2RequestId,
                    classifierStage2MsgId: H.stage2MsgId,
                    classifierStage2CostUSD: H.stage2Usage && H.model ? UZ8(H.model, H.stage2Usage) : void 0
                }), H.shouldBlock) {
                if (H.transcriptTooLong) {
                    if (q.name === T4) return {
                        behavior: "allow",
                        updatedInput: K,
                        decisionReason: {
                            type: "mode",
                            mode: "auto"
                        }
                    };
                    if (O.toolPermissionContext.shouldAvoidPermissionPrompts) throw new sz("Agent aborted: auto mode classifier transcript exceeded context window in headless mode");
                    return E("Auto mode classifier transcript too long, falling back to normal permission handling", {
                        level: "warn"
                    }), {
                        ...A,
                        decisionReason: {
                            type: "other",
                            reason: "Auto mode classifier transcript exceeded context window — falling back to manual approval"
                        }
                    }
                }
                if (H.unavailable) {
                    if (XD("tengu_iron_gate_closed", !0, g77)) return E("Auto mode classifier unavailable, denying with retry guidance (fail closed)", {
                        level: "warn"
                    }), {
                        behavior: "deny",
                        decisionReason: {
                            type: "classifier",
                            classifier: "auto-mode",
                            reason: "Classifier unavailable"
                        },
                        message: JCK(q.name, H.model)
                    };
                    return E("Auto mode classifier unavailable, falling back to normal permission handling (fail open)", {
                        level: "warn"
                    }), A
                }
                let P = EI4($);
                Ax6(_, P), E(`Auto mode classifier blocked action: ${H.reason}`, {
                    level: "warn"
                });
                let W = CkY(P, O, H.reason, z, q, A, _);
                if (W) return W;
                return {
                    behavior: "deny",
                    decisionReason: {
                        type: "classifier",
                        classifier: "auto-mode",
                        reason: H.reason
                    },
                    message: HCK(H.reason)
                }
            }
            let M = S18($);
            return Ax6(_, M), {
                behavior: "allow",
                updatedInput: K,
                decisionReason: {
                    type: "classifier",
                    classifier: "auto-mode",
                    reason: H.reason
                }
            }
        }
        if (O.toolPermissionContext.shouldAvoidPermissionPrompts) {
            let w = await SkY(q, K, Y, _, O.toolPermissionContext.mode, A.suggestions);
            if (w) return w;
            return {
                behavior: "deny",
                decisionReason: {
                    type: "asyncAgent",
                    reason: "Permission prompts are not available in this context"
                },
                message: $CK(q.name)
            }
        }
    }
    return A
}
// @from(Ln 426298, Col 4)
g$ = L(() => {
    Fi();
    fh();
    sY();
    xM6();
    vD();
    K8();
    m8();
    U8();
    yY();
    aY();
    OP();
    MH();
    cZ();
    uI();
    y8();
    B1();
    C8();
    q2();
    Q8();
    K9();
    _7();
    fo();
    e8();
    zr1();
    cX6();
    LkY = (_CK(), B7(KCK)), hkY = (Kn(), B7(Pe)), mY7 = [...wv, "cliArg", "command", "session"]
})
// @from(Ln 426326, Col 4)
P37 = {}
// @from(Ln 426367, Col 0)
function PCK(q, K) {
    if (q !== S7) return !1;
    if (K === void 0 || K === "") return !0;
    let _ = K.trim().toLowerCase();
    if (_ === "*") return !0;
    for (let z of iEK) {
        let Y = z.toLowerCase();
        if (_ === Y) return !0;
        if (_ === `${Y}:*` || _ === `${Y} *`) return !0;
        if (_ === `${Y}*`) return !0;
        if (_.startsWith(`${Y} -`) && _.endsWith("*")) return !0
    }
    return !1
}
// @from(Ln 426382, Col 0)
function WCK(q, K) {
    if (q !== I5) return !1;
    if (K === void 0 || K === "") return !0;
    let _ = K.trim().toLowerCase();
    if (_ === "*") return !0;
    let z = [...p38, "pwsh", "powershell", "cmd", "wsl", "iex", "invoke-expression", "icm", "invoke-command", "start-process", "saps", "start", "start-job", "sajb", "start-threadjob", "register-objectevent", "register-engineevent", "register-wmievent", "register-scheduledjob", "new-pssession", "nsn", "enter-pssession", "etsn", "add-type", "new-object"];
    for (let Y of z) {
        if (_ === Y) return !0;
        if (_ === `${Y}:*`) return !0;
        if (_ === `${Y}*`) return !0;
        if (_ === `${Y} *`) return !0;
        if (_.startsWith(`${Y} -`) && _.endsWith("*")) return !0;
        let A = Y.indexOf(" "),
            O = A === -1 ? `${Y}.exe` : `${Y.slice(0,A)}.exe${Y.slice(A)}`;
        if (_ === O) return !0;
        if (_ === `${O}:*`) return !0;
        if (_ === `${O}*`) return !0;
        if (_ === `${O} *`) return !0;
        if (_.startsWith(`${O} -`) && _.endsWith("*")) return !0
    }
    return !1
}
// @from(Ln 426405, Col 0)
function DCK(q, K) {
    return i0(q) === T4
}
// @from(Ln 426409, Col 0)
function UY7(q) {
    if (wv.includes(q)) {
        let K = Ww(q);
        if (K) {
            let _ = IkY(b8(), K);
            return _.length < K.length ? _ : K
        }
    }
    return q
}
// @from(Ln 426420, Col 0)
function XCK(q, K) {
    return PCK(q, K) || WCK(q, K) || DCK(q, K)
}
// @from(Ln 426424, Col 0)
function QY7(q, K) {
    let _ = [];
    for (let z of q)
        if (z.ruleBehavior === "allow" && XCK(z.ruleValue.toolName, z.ruleValue.ruleContent)) {
            let Y = z.ruleValue.ruleContent ? `${z.ruleValue.toolName}(${z.ruleValue.ruleContent})` : `${z.ruleValue.toolName}(*)`;
            _.push({
                ruleValue: z.ruleValue,
                source: z.source,
                ruleDisplay: Y,
                sourceDisplay: UY7(z.source)
            })
        } for (let z of K) {
        let Y = z.match(/^([^(]+)(?:\(([^)]*)\))?$/);
        if (Y) {
            let A = Y[1].trim(),
                O = Y[2]?.trim();
            if (XCK(A, O)) _.push({
                ruleValue: {
                    toolName: A,
                    ruleContent: O
                },
                source: "cliArg",
                ruleDisplay: O ? z : `${A}(*)`,
                sourceDisplay: "--allowed-tools"
            })
        }
    }
    return _
}
// @from(Ln 426454, Col 0)
function FY7(q) {
    return q.toolName === S7 && q.ruleContent === void 0
}
// @from(Ln 426458, Col 0)
function gY7(q) {
    return q.toolName === I5 && q.ruleContent === void 0
}
// @from(Ln 426462, Col 0)
function ukY(q, K) {
    let _ = [];
    for (let z of q)
        if (z.ruleBehavior === "allow" && FY7(z.ruleValue)) _.push({
            ruleValue: z.ruleValue,
            source: z.source,
            ruleDisplay: `${S7}(*)`,
            sourceDisplay: UY7(z.source)
        });
    for (let z of K) {
        let Y = h2(z);
        if (FY7(Y)) _.push({
            ruleValue: Y,
            source: "cliArg",
            ruleDisplay: `${S7}(*)`,
            sourceDisplay: "--allowed-tools"
        })
    }
    return _
}
// @from(Ln 426483, Col 0)
function mkY(q, K) {
    let _ = [];
    for (let z of q)
        if (z.ruleBehavior === "allow" && gY7(z.ruleValue)) _.push({
            ruleValue: z.ruleValue,
            source: z.source,
            ruleDisplay: `${I5}(*)`,
            sourceDisplay: UY7(z.source)
        });
    for (let z of K) {
        let Y = h2(z);
        if (gY7(Y)) _.push({
            ruleValue: Y,
            source: "cliArg",
            ruleDisplay: `${I5}(*)`,
            sourceDisplay: "--allowed-tools"
        })
    }
    return _
}
// @from(Ln 426504, Col 0)
function ZCK(q) {
    return $v.includes(q) || q === "session" || q === "cliArg"
}
// @from(Ln 426508, Col 0)
function fCK(q, K) {
    let _ = new Map;
    for (let Y of K) {
        if (!ZCK(Y.source)) continue;
        let A = Y.source,
            O = _.get(A) || [];
        O.push(Y.ruleValue), _.set(A, O)
    }
    let z = q;
    for (let [Y, A] of _) z = EY(z, {
        type: "removeRules",
        rules: A,
        behavior: "allow",
        destination: Y
    });
    return z
}
// @from(Ln 426526, Col 0)
function Pu(q) {
    let K = [];
    for (let [Y, A] of Object.entries(q.alwaysAllowRules)) {
        if (!A) continue;
        for (let O of A) {
            let w = h2(O);
            K.push({
                source: Y,
                ruleBehavior: "allow",
                ruleValue: w
            })
        }
    }
    let _ = QY7(K, []);
    if (_.length === 0) return q.strippedDangerousRules !== void 0 ? q : {
        ...q,
        strippedDangerousRules: {}
    };
    for (let Y of _) E(`Ignoring dangerous permission ${Y.ruleDisplay} from ${Y.sourceDisplay} (bypasses classifier)`);
    let z = {};
    for (let [Y, A] of Object.entries(q.strippedDangerousRules ?? {}))
        if (A) z[Y] = [...A];
    for (let Y of _) {
        if (!ZCK(Y.source)) continue;
        let A = I9(Y.ruleValue),
            O = z[Y.source] ??= [];
        if (!O.includes(A)) O.push(A)
    }
    return {
        ...fCK(q, _),
        strippedDangerousRules: z
    }
}
// @from(Ln 426560, Col 0)
function pe(q) {
    let K = q.strippedDangerousRules;
    if (!K) return q;
    let _ = q;
    for (let [z, Y] of Object.entries(K)) {
        if (!Y || Y.length === 0) continue;
        _ = EY(_, {
            type: "addRules",
            rules: Y.map(h2),
            behavior: "allow",
            destination: z
        })
    }
    return {
        ..._,
        strippedDangerousRules: void 0
    }
}
// @from(Ln 426579, Col 0)
function Fe(q, K, _) {
    if (q === K) return _;
    if (bi(q, K), m81(q, K), q === "plan" && K !== "plan") iL(!0);
    {
        if (K === "plan" && q !== "plan") return zI6(_);
        let z = q === "auto" || q === "plan" && (DG?.isAutoModeActive() ?? !1),
            Y = K === "auto";
        if (Y && !z) {
            if (!$L()) throw Error("Cannot transition to auto mode: gate is not enabled");
            DG?.setAutoModeActive(!0), _ = Pu(_)
        } else if (z && !Y) DG?.setAutoModeActive(!1), sG(!0), _ = pe(_)
    }
    if (q === "plan" && K !== "plan" && _.prePlanMode) return {
        ..._,
        prePlanMode: void 0
    };
    return _
}
// @from(Ln 426598, Col 0)
function GCK(q) {
    let K = q.join(" ").trim();
    if (s37(K)) return t37();
    return iR(q)
}
// @from(Ln 426604, Col 0)
function BkY({
    processPwd: q,
    originalCwd: K
}) {
    let {
        resolvedPath: _,
        isSymlink: z
    } = vA(V8(), q);
    return z ? _ === xkY(K) : !1
}
// @from(Ln 426615, Col 0)
function dY7({
    permissionModeCli: q,
    dangerouslySkipPermissions: K
}) {
    if (xP()) {
        let H = K || q && q !== "default",
            J = "Permission mode forced to default — CLAUDE_CODE_SUBPROCESS_ENV_SCRUB is set " + "(allowed_non_write_users hardening). Declare allowedTools explicitly, or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0 to opt out.";
        if (H) process.stderr.write(`⚠ ${J}
`);
        return {
            mode: "default",
            notification: H ? J : void 0
        }
    }
    let _ = y7() || {},
        z = Tw("tengu_disable_bypass_permissions_mode"),
        Y = _.permissions?.disableBypassPermissionsMode === "disable",
        A = z || Y,
        O = Pn8() === "disabled",
        w = [],
        $;
    if (K) w.push("bypassPermissions");
    if (q) {
        let H = yV(q);
        if (H === "auto")
            if (O) E("auto mode circuit breaker active (cached) — falling back to default", {
                level: "warn"
            });
            else w.push("auto");
        else w.push(H)
    }
    if (_.permissions?.defaultMode) {
        let H = _.permissions.defaultMode;
        if (S6(process.env.CLAUDE_CODE_REMOTE) && !["acceptEdits", "plan", "default"].includes(H)) E(`settings defaultMode "${H}" is not supported in CLAUDE_CODE_REMOTE — only acceptEdits and plan are allowed`, {
            level: "warn"
        }), d("tengu_ccr_unsupported_default_mode_ignored", {
            mode: H
        });
        else if (H === "auto")
            if (O) E("auto mode circuit breaker active (cached) — falling back to default", {
                level: "warn"
            });
            else w.push("auto");
        else w.push(H)
    }
    let j;
    for (let H of w) {
        if (H === "bypassPermissions" && A) {
            if (z) E("bypassPermissions mode is disabled by Statsig gate", {
                level: "warn"
            }), $ = "Bypass permissions mode was disabled by your organization policy";
            else E("bypassPermissions mode is disabled by settings", {
                level: "warn"
            }), $ = "Bypass permissions mode was disabled by settings";
            continue
        }
        j = {
            mode: H,
            notification: $
        };
        break
    }
    if (!j) j = {
        mode: "default",
        notification: $
    };
    if (!j) j = {
        mode: "default",
        notification: $
    };
    if (j.mode === "auto") DG?.setAutoModeActive(!0);
    return j
}
// @from(Ln 426689, Col 0)
function iR(q) {
    if (q.length === 0) return [];
    let K = [];
    for (let _ of q) {
        if (!_) continue;
        let z = "",
            Y = !1;
        for (let A of _) switch (A) {
            case "(":
                Y = !0, z += A;
                break;
            case ")":
                Y = !1, z += A;
                break;
            case ",":
                if (Y) z += A;
                else {
                    if (z.trim()) K.push(z.trim());
                    z = ""
                }
                break;
            case " ":
                if (Y) z += A;
                else if (z.trim()) K.push(z.trim()), z = "";
                break;
            default:
                z += A
        }
        if (z.trim()) K.push(z.trim())
    }
    return K
}
// @from(Ln 426721, Col 0)
async function cY7({
    allowedToolsCli: q,
    disallowedToolsCli: K,
    baseToolsCli: _,
    permissionMode: z,
    allowDangerouslySkipPermissions: Y,
    addDirs: A
}) {
    let O = iR(q).map((C) => I9(h2(C))),
        w = iR(K);
    if (_ && _.length > 0) {
        let C = GCK(_),
            x = new Set(C.map(i0)),
            m = t37().filter((F) => !x.has(F));
        if (s37(_.join(" ").trim()) === null && !x.has(I5)) m.push(I5);
        w = [...w, ...m]
    }
    let $ = [],
        j = new Map,
        H = process.env.PWD;
    if (H && H !== Y7() && BkY({
            originalCwd: Y7(),
            processPwd: H
        })) j.set(H, {
        path: H,
        source: "session"
    });
    let J = Tw("tengu_disable_bypass_permissions_mode"),
        X = y7() || {},
        M = X.permissions?.disableBypassPermissionsMode === "disable",
        P = (z === "bypassPermissions" || Y) && !J && !M,
        W = _L8(),
        D = w.map(h2),
        Z = D.some((C) => C.toolName === S7 && C.ruleContent === void 0),
        f = D.some((C) => C.toolName === S7) || W.some((C) => C.ruleBehavior === "deny" && C.ruleValue.toolName === S7),
        v = S6(process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL) || iR(_ ?? []).map(i0).includes(I5) || O.some((C) => h2(C).toolName === I5) || D.some((C) => C.toolName === I5) || W.some((C) => C.ruleValue.toolName === I5);
    if (y1() === "windows" && f && !v) w = [...w, I5];
    let V = [],
        k = [];
    if (z === "auto") k = QY7(W, O);
    let N = wCK({
            mode: z,
            additionalWorkingDirectories: j,
            alwaysAllowRules: {
                cliArg: O
            },
            alwaysDenyRules: {
                cliArg: w
            },
            alwaysAskRules: {},
            isBypassPermissionsModeAvailable: P,
            ...{
                isAutoModeAvailable: $L()
            },
            ...{},
            isRemoteMode: S6(process.env.CLAUDE_CODE_REMOTE) || nK()
        }, W),
        R = [...(X.permissions?.additionalDirectories || []).map((C) => ({
            dir: C,
            destination: "localSettings"
        })), ...A.map((C) => ({
            dir: C,
            destination: "cliArg"
        }))],
        h = await Promise.all(R.map(async ({
            dir: C,
            destination: x
        }) => ({
            destination: x,
            result: await KE6(C, N)
        })));
    for (let {
            result: C,
            destination: x
        }
        of h)
        if (C.resultType === "success") N = EY(N, {
            type: "addDirectories",
            directories: [C.absolutePath],
            destination: x
        });
        else if (C.resultType !== "alreadyInWorkingDirectory" && C.resultType !== "pathNotFound") $.push(_E6(C));
    return {
        toolPermissionContext: N,
        warnings: $,
        dangerousPermissions: k,
        overlyBroadBashPermissions: V
    }
}
// @from(Ln 426811, Col 0)
function E_6(q) {
    let K;
    switch (q) {
        case "settings":
            K = "auto mode disabled by settings";
            break;
        case "circuit-breaker":
            K = "auto mode is unavailable for your plan";
            break;
        case "model":
            K = "auto mode unavailable for this model";
            break
    }
    return K
}