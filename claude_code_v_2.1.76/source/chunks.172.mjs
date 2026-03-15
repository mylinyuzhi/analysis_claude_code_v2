
// @from(Ln 441287, Col 4)
OZ = E(() => {
    K7();
    dq6();
    jZ();
    JZ();
    jR();
    A8();
    Rf6();
    SM();
    oC6();
    Zn8();
    Uc6();
    Hn8();
    Lz();
    qp6();
    ZR();
    M4();
    JZ();
    sV8();
    Qr6();
    V1();
    T1();
    Mk8();
    ni8();
    s8();
    Afq();
    Zn8();
    ix8();
    WR();
    Z7();
    SA();
    JN();
    cf6();
    F9();
    k8();
    k1();
    HA();
    fn8 = t(P6(), 1), B9z = new Set(["find", "grep", "rg", "ag", "ack", "locate", "which", "whereis"]), g9z = new Set(["cat", "head", "tail", "less", "more", "wc", "stat", "file", "strings", "ls", "tree", "du", "jq", "awk", "cut", "sort", "uniq", "tr"]), wfq = new Set(["echo", "printf", "true", "false", ":"]), F9z = new Set(["mv", "cp", "rm", "mkdir", "rmdir", "chmod", "chown", "chgrp", "touch", "ln", "cd", "export", "unset", "wait"]);
    U9z = ["sleep"], rh1 = t6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS), zfq = F6(() => C.strictObject({
        command: C.string().describe("The command to execute"),
        timeout: C.number().optional().describe(`Optional timeout in milliseconds (max ${nh1()})`),
        description: C.string().optional().describe(`Clear, concise description of what this command does in active voice. Never use words like "complex" or "risk" in the description - just describe what it does.

For simple commands (git, npm, standard CLI tools), keep it brief (5-10 words):
- ls → "List files in current directory"
- git status → "Show working tree status"
- npm install → "Install package dependencies"

For commands that are harder to parse at a glance (piped commands, obscure flags, etc.), add enough context to clarify what it does:
- find . -name "*.tmp" -exec rm {} \\; → "Find and delete all .tmp files recursively"
- git reset --hard origin/main → "Discard all local changes and match remote main"
- curl -s url | jq '.data[]' → "Fetch JSON from URL and extract data array elements"`),
        run_in_background: YX(C.boolean().optional()).describe("Set to true to run this command in the background. Use TaskOutput to read the output later."),
        dangerouslyDisableSandbox: YX(C.boolean().optional()).describe("Set this to true to dangerously override sandbox mode and run commands without sandboxing."),
        _simulatedSedEdit: C.object({
            filePath: C.string(),
            newContent: C.string()
        }).optional().describe("Internal: pre-computed sed edit result from preview")
    })), _fq = F6(() => rh1 ? zfq().omit({
        run_in_background: !0,
        _simulatedSedEdit: !0
    }) : zfq().omit({
        _simulatedSedEdit: !0
    })), d9z = ["npm", "yarn", "pnpm", "node", "python", "python3", "go", "cargo", "make", "docker", "terraform", "webpack", "vite", "jest", "pytest", "curl", "wget", "build", "test", "serve", "watch", "dev"];
    c9z = F6(() => C.object({
        stdout: C.string().describe("The standard output of the command"),
        stderr: C.string().describe("The standard error output of the command"),
        rawOutputPath: C.string().optional().describe("Path to raw output file for large MCP tool outputs"),
        interrupted: C.boolean().describe("Whether the command was interrupted"),
        isImage: C.boolean().optional().describe("Flag to indicate if stdout contains image data"),
        backgroundTaskId: C.string().optional().describe("ID of the background task if command is running in background"),
        backgroundedByUser: C.boolean().optional().describe("True if the user manually backgrounded the command with Ctrl+B"),
        assistantAutoBackgrounded: C.boolean().optional().describe("True if assistant-mode auto-backgrounded a long-running blocking command"),
        dangerouslyDisableSandbox: C.boolean().optional().describe("Flag to indicate if sandbox mode was overridden"),
        returnCodeInterpretation: C.string().optional().describe("Semantic interpretation for non-error exit codes with special meaning"),
        noOutputExpected: C.boolean().optional().describe("Whether the command is expected to produce no output on success"),
        structuredContent: C.array(C.any()).optional().describe("Structured content blocks"),
        persistedOutputPath: C.string().optional().describe("Path to the persisted full output in tool-results dir (set when output is too large for inline)"),
        persistedOutputSize: C.number().optional().describe("Total size of the output in bytes (set when output is too large for inline)"),
        tokenSaverOutput: C.string().optional().describe("Compressed output sent to model when token-saver is active (UI still uses stdout)")
    }));
    J4 = {
        name: Q7,
        searchHint: "execute shell commands",
        maxResultSizeChars: 30000,
        strict: !0,
        async description({
            description: A
        }) {
            return A || "Run shell command"
        },
        async prompt() {
            return tGq()
        },
        isConcurrencySafe(A) {
            return this.isReadOnly(A)
        },
        isReadOnly(A) {
            let q = vi6(A.command);
            return Z01(A, q).behavior === "allow"
        },
        toAutoClassifierInput(A) {
            return A.command
        },
        isSearchOrReadCommand(A) {
            let q = _fq().safeParse(A);
            if (!q.success) return {
                isSearch: !1,
                isRead: !1
            };
            return p9z(q.data.command)
        },
        get inputSchema() {
            return _fq()
        },
        get outputSchema() {
            return c9z()
        },
        userFacingName(A) {
            if (!A) return "Bash";
            if (A.command) {
                let q = yf6(A.command);
                if (q) return ph1({
                    file_path: q.filePath,
                    old_string: "x"
                })
            }
            return t6(process.env.CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR) && Ti(A) ? "SandboxedBash" : "Bash"
        },
        getToolUseSummary(A) {
            if (!A?.command) return null;
            let {
                command: q,
                description: K
            } = A;
            if (K) return K;
            return R3(q, EI)
        },
        getActivityDescription(A) {
            if (!A?.command) return "Running command";
            return `Running ${A.description??R3(A.command,EI)}`
        },
        isEnabled() {
            return !0
        },
        async validateInput(A) {
            return {
                result: !0
            }
        },
        async checkPermissions(A, q) {
            return await Tn8(A, q)
        },
        renderToolUseMessage: Xl4,
        renderToolUseRejectedMessage: Pl4,
        renderToolUseProgressMessage: Wl4,
        renderToolUseQueuedMessage: Zl4,
        renderToolResultMessage: Gl4,
        mapToolResultToToolResultBlockParam({
            interrupted: A,
            stdout: q,
            stderr: K,
            isImage: Y,
            backgroundTaskId: z,
            backgroundedByUser: _,
            assistantAutoBackgrounded: w,
            structuredContent: O,
            persistedOutputPath: $,
            persistedOutputSize: H,
            tokenSaverOutput: j
        }, J) {
            if (O && O.length > 0) return {
                tool_use_id: J,
                type: "tool_result",
                content: O
            };
            if (Y) {
                let P = q.trim().match(/^data:([^;]+);base64,(.+)$/);
                if (P) {
                    let W = P[1],
                        Z = P[2];
                    return {
                        tool_use_id: J,
                        type: "tool_result",
                        content: [{
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: W || "image/jpeg",
                                data: Z || ""
                            }
                        }]
                    }
                }
            }
            let M = q;
            if (q) M = q.replace(/^(\s*\n)+/, ""), M = M.trimEnd();
            if (j) M = j;
            if ($) {
                let P = pN8(M, DP1);
                M = PP1({
                    filepath: $,
                    originalSize: H ?? 0,
                    isJson: !1,
                    preview: P.preview,
                    hasMore: P.hasMore
                })
            }
            let D = K.trim();
            if (A) {
                if (K) D += Kfq;
                D += "<error>Command was aborted before completion</error>"
            }
            let X = "";
            if (z) {
                let P = g2(z);
                if (w) X = `Command exceeded the assistant-mode blocking budget (${m9z/1000}s) and was moved to the background with ID: ${z}. It is still running — you will be notified when it completes. Output is being written to: ${P}. In assistant mode, delegate long-running work to a subagent or use run_in_background to keep this conversation responsive.`;
                else if (_) X = `Command was manually backgrounded by user with ID: ${z}. Output is being written to: ${P}`;
                else X = `Command running in background with ID: ${z}. Output is being written to: ${P}`
            }
            return {
                tool_use_id: J,
                type: "tool_result",
                content: [M, D, X].filter(Boolean).join(`
`),
                is_error: A
            }
        },
        async call(A, q, K, Y, z) {
            if (A._simulatedSedEdit) return await i9z(A._simulatedSedEdit, q, Y);
            let {
                abortController: _,
                getAppState: w,
                setAppState: O,
                setToolJSX: $
            } = q, H = new w38, j = "", J, M = 0, D = !1, X, P = !q.agentId, W = !P;
            try {
                let g = n9z({
                        input: A,
                        abortController: _,
                        setAppState: q.setAppStateForTasks ?? O,
                        setToolJSX: $,
                        preventCwdChanges: W,
                        isMainThread: P,
                        toolUseId: q.toolUseId,
                        agentId: q.agentId
                    }),
                    B;
                do
                    if (B = await g.next(), !B.done && z) {
                        let Q = B.value;
                        z({
                            toolUseID: `bash-progress-${M++}`,
                            data: {
                                type: "bash_progress",
                                output: Q.output,
                                fullOutput: Q.fullOutput,
                                elapsedTimeSeconds: Q.elapsedTimeSeconds,
                                totalLines: Q.totalLines,
                                totalBytes: Q.totalBytes,
                                taskId: Q.taskId,
                                timeoutMs: Q.timeoutMs
                            }
                        })
                    } while (!B.done);
                X = B.value, Y_4(A.command, X.code, X.stdout);
                let b = X.interrupted && _.signal.reason === "interrupt";
                if (H.append((X.stdout || "").trimEnd() + Kfq), J = eGq(A.command, X.code, X.stdout || "", ""), X.stdout && X.stdout.includes(".git/index.lock': File exists")) d("tengu_git_index_lock_error", {});
                if (J.isError && !b) {
                    if (X.code !== 0) H.append(`Exit code ${X.code}`)
                }
                if (!W) {
                    let Q = w();
                    if (JP1(Q.toolPermissionContext)) j = jP1("")
                }
                let p = vA.annotateStderrWithSandboxFailures(A.command, X.stdout || "");
                if (X.preSpawnError) throw Error(X.preSpawnError);
                if (J.isError && !b) throw new uS("", p, X.code, X.interrupted);
                D = X.interrupted
            } finally {
                if ($) $(null)
            }
            let Z = H.toString(),
                G = 67108864,
                f, v;
            if (X.outputFilePath && X.outputTaskId) try {
                let g = await x9z(X.outputFilePath);
                v = g.size, await zp6();
                let B = FN8(X.outputTaskId, !1);
                if (g.size > G) await u9z(X.outputFilePath, G);
                try {
                    await C9z(X.outputFilePath, B)
                } catch {
                    await I9z(X.outputFilePath, B)
                }
                f = B
            } catch {}
            let N = A.command.split(" ")[0];
            d("tengu_bash_tool_command_executed", {
                command_type: N,
                stdout_length: Z.length,
                stderr_length: 0,
                exit_code: X.code,
                interrupted: D
            });
            let V = UZq(A.command);
            if (V) d("tengu_code_indexing_tool_used", {
                tool: V,
                source: "cli",
                success: X.code === 0
            });
            let L = Y34(Z),
                h = bN8(L),
                R, u = L;
            if (h) {
                let B = (X.outputFilePath ? (await b9z(X.outputFilePath, "utf8")).trim() : L.trim()).match(/^data:([^;]+);base64,(.+)$/);
                if (B && B[1] && B[2]) {
                    let b = Buffer.from(B[2], "base64"),
                        p = B[1].split("/")[1] || "png",
                        Q = await Bk(b, b.length, p);
                    u = `data:image/${Q.mediaType};base64,${Q.buffer.toString("base64")}`
                }
            }
            return {
                data: {
                    stdout: u,
                    stderr: j,
                    interrupted: D,
                    isImage: h,
                    returnCodeInterpretation: J?.message,
                    noOutputExpected: Q9z(A.command),
                    backgroundTaskId: X.backgroundTaskId,
                    backgroundedByUser: X.backgroundedByUser,
                    assistantAutoBackgrounded: X.assistantAutoBackgrounded,
                    dangerouslyDisableSandbox: "dangerouslyDisableSandbox" in A ? A.dangerouslyDisableSandbox : void 0,
                    persistedOutputPath: f,
                    persistedOutputSize: v,
                    tokenSaverOutput: R
                }
            }
        },
        renderToolUseErrorMessage: fl4
    }
})
// @from(Ln 441632, Col 0)
function jfq(A) {
    return A.includes(ah1) || A.includes(vi)
}
// @from(Ln 441636, Col 0)
function Mfq(A) {
    if (!A) return -2;
    if (A === "ERROR") return -1;
    let q = e9z.indexOf(A);
    return q >= 0 ? q + 1 : 0
}
// @from(Ln 441643, Col 0)
function _Yz(A) {
    if (!A.includes("{")) return A;
    let q = [],
        K = !1,
        Y = !1,
        z = 0;
    while (z < A.length) {
        let _ = A[z];
        if (K) {
            if (_ === "'") K = !1;
            q.push(_ === "{" ? " " : _), z++
        } else if (Y)
            if (_ === "\\" && (A[z + 1] === '"' || A[z + 1] === "\\")) q.push(_, A[z + 1]), z += 2;
            else {
                if (_ === '"') Y = !1;
                q.push(_ === "{" ? " " : _), z++
            }
        else if (_ === "\\" && z + 1 < A.length) q.push(_, A[z + 1]), z += 2;
        else {
            if (_ === "'") K = !0;
            else if (_ === '"') Y = !0;
            q.push(_), z++
        }
    }
    return q.join("")
}
// @from(Ln 441669, Col 0)
async function Dfq(A) {
    if (AYz.test(A)) return {
        kind: "too-complex",
        reason: "Contains control characters"
    };
    if (qYz.test(A)) return {
        kind: "too-complex",
        reason: "Contains Unicode whitespace"
    };
    if (KYz.test(A)) return {
        kind: "too-complex",
        reason: "Contains backslash-escaped whitespace"
    };
    if (YYz.test(A)) return {
        kind: "too-complex",
        reason: "Contains zsh ~[ dynamic directory syntax"
    };
    if (zYz.test(_Yz(A))) return {
        kind: "too-complex",
        reason: "Contains brace with quote character (expansion obfuscation)"
    };
    if (A.trim() === "") return {
        kind: "simple",
        commands: []
    };
    let K = await pV8(A);
    if (!K) return {
        kind: "parse-unavailable"
    };
    return wYz(K)
}
// @from(Ln 441701, Col 0)
function wYz(A) {
    let q = [],
        Y = VF(A, q, new Map);
    if (Y) return Y;
    return {
        kind: "simple",
        commands: q
    }
}
// @from(Ln 441711, Col 0)
function VF(A, q, K) {
    if (A.type === "command") {
        let Y = HYz(A, [], q, K);
        if (Y.kind !== "simple") return Y;
        return q.push(...Y.commands), null
    }
    if (A.type === "redirected_statement") return OYz(A, q, K);
    if (A.type === "comment") return null;
    if (r9z.has(A.type)) {
        let Y = A.type === "pipeline",
            z = !1;
        if (!Y) {
            for (let O of A.children)
                if (O && (O.type === "||" || O.type === "&")) {
                    z = !0;
                    break
                }
        }
        let _ = z ? new Map(K) : null,
            w = Y ? new Map(K) : K;
        for (let O of A.children) {
            if (!O) continue;
            if (o9z.has(O.type)) {
                if (O.type === "||" || O.type === "|" || O.type === "|&" || O.type === "&") w = new Map(_ ?? K);
                continue
            }
            let $ = VF(O, q, w);
            if ($) return $
        }
        return null
    }
    if (A.type === "negated_command") {
        for (let Y of A.children) {
            if (!Y) continue;
            if (Y.type === "!") continue;
            return VF(Y, q, K)
        }
        return null
    }
    if (A.type === "declaration_command") {
        let Y = [];
        for (let z of A.children) {
            if (!z) continue;
            switch (z.type) {
                case "export":
                case "local":
                case "readonly":
                case "declare":
                case "typeset":
                    Y.push(z.text);
                    break;
                case "word":
                case "number":
                case "raw_string":
                case "string":
                case "concatenation": {
                    let _ = kF(z, q, K);
                    if (typeof _ !== "string") return _;
                    Y.push(_);
                    break
                }
                case "variable_assignment": {
                    let _ = Vn8(z, q, K);
                    if ("kind" in _) return _;
                    Hfq(K, _), Y.push(`${_.name}=${_.value}`);
                    break
                }
                case "variable_name":
                    Y.push(z.text);
                    break;
                default:
                    return XM(z)
            }
        }
        return q.push({
            argv: Y,
            envVars: [],
            redirects: [],
            text: A.text
        }), null
    }
    if (A.type === "variable_assignment") {
        let Y = Vn8(A, q, K);
        if ("kind" in Y) return Y;
        return Hfq(K, Y), null
    }
    if (A.type === "for_statement") {
        let Y = null,
            z = null;
        for (let w of A.children) {
            if (!w) continue;
            if (w.type === "variable_name") Y = w.text;
            else if (w.type === "do_group") z = w;
            else if (w.type === "for" || w.type === "in" || w.type === "select" || w.type === ";") continue;
            else if (w.type === "command_substitution") {
                let O = En8(w, q, K);
                if (O) return O
            } else {
                let O = kF(w, q, K);
                if (typeof O !== "string") return O
            }
        }
        if (Y === null || z === null) return XM(A);
        K.set(Y, vi);
        let _ = new Map(K);
        for (let w of z.children) {
            if (!w) continue;
            if (w.type === "do" || w.type === "done" || w.type === ";") continue;
            let O = VF(w, q, _);
            if (O) return O
        }
        return null
    }
    if (A.type === "if_statement" || A.type === "while_statement") {
        let Y = !1;
        for (let z of A.children) {
            if (!z) continue;
            if (z.type === "if" || z.type === "fi" || z.type === "else" || z.type === "elif" || z.type === "while" || z.type === "until" || z.type === ";") continue;
            if (z.type === "then") {
                Y = !0;
                continue
            }
            if (z.type === "do_group") {
                let $ = new Map(K);
                for (let H of z.children) {
                    if (!H) continue;
                    if (H.type === "do" || H.type === "done" || H.type === ";") continue;
                    let j = VF(H, q, $);
                    if (j) return j
                }
                continue
            }
            if (z.type === "elif_clause" || z.type === "else_clause") {
                let $ = new Map(K);
                for (let H of z.children) {
                    if (!H) continue;
                    if (H.type === "elif" || H.type === "else" || H.type === "then" || H.type === ";") continue;
                    let j = VF(H, q, $);
                    if (j) return j
                }
                continue
            }
            let _ = Y ? new Map(K) : K,
                w = q.length,
                O = VF(z, q, _);
            if (O) return O;
            if (!Y)
                for (let $ = w; $ < q.length; $++) {
                    let H = q[$];
                    if (H?.argv[0] === "read") {
                        for (let j of H.argv.slice(1))
                            if (!j.startsWith("-") && /^[A-Za-z_][A-Za-z0-9_]*$/.test(j)) K.set(j, vi)
                    }
                }
        }
        return null
    }
    if (A.type === "subshell") {
        let Y = new Map(K);
        for (let z of A.children) {
            if (!z) continue;
            if (z.type === "(" || z.type === ")") continue;
            let _ = VF(z, q, Y);
            if (_) return _
        }
        return null
    }
    if (A.type === "test_command") {
        let Y = ["[["];
        for (let z of A.children) {
            if (!z) continue;
            if (z.type === "[[" || z.type === "]]") continue;
            if (z.type === "[" || z.type === "]") continue;
            let _ = Xfq(z, Y, q, K);
            if (_) return _
        }
        return q.push({
            argv: Y,
            envVars: [],
            redirects: [],
            text: A.text
        }), null
    }
    if (A.type === "unset_command") {
        let Y = [];
        for (let z of A.children) {
            if (!z) continue;
            switch (z.type) {
                case "unset":
                    Y.push(z.text);
                    break;
                case "variable_name":
                    Y.push(z.text), K.delete(z.text);
                    break;
                case "word": {
                    let _ = kF(z, q, K);
                    if (typeof _ !== "string") return _;
                    Y.push(_);
                    break
                }
                default:
                    return XM(z)
            }
        }
        return q.push({
            argv: Y,
            envVars: [],
            redirects: [],
            text: A.text
        }), null
    }
    return XM(A)
}
// @from(Ln 441925, Col 0)
function Xfq(A, q, K, Y) {
    switch (A.type) {
        case "unary_expression":
        case "binary_expression":
        case "negated_expression":
        case "parenthesized_expression": {
            for (let z of A.children) {
                if (!z) continue;
                let _ = Xfq(z, q, K, Y);
                if (_) return _
            }
            return null
        }
        case "test_operator":
        case "!":
        case "(":
        case ")":
        case "&&":
        case "||":
        case "==":
        case "=":
        case "!=":
        case "<":
        case ">":
        case "=~":
            return q.push(A.text), null;
        default: {
            let z = kF(A, K, Y);
            if (typeof z !== "string") return z;
            return q.push(z), null
        }
    }
}
// @from(Ln 441959, Col 0)
function OYz(A, q, K) {
    let Y = [],
        z = null;
    for (let O of A.children) {
        if (!O) continue;
        if (O.type === "file_redirect") {
            let $ = Pfq(O, q, K);
            if ("kind" in $) return $;
            Y.push($)
        } else if (O.type === "heredoc_redirect") {
            let $ = Wfq(O);
            if ($) return $
        } else if (O.type === "command" || O.type === "pipeline" || O.type === "list" || O.type === "negated_command" || O.type === "declaration_command" || O.type === "unset_command") z = O;
        else return XM(O)
    }
    if (!z) return q.push({
        argv: [],
        envVars: [],
        redirects: Y,
        text: A.text
    }), null;
    let _ = q.length,
        w = VF(z, q, K);
    if (w) return w;
    if (q.length > _ && Y.length > 0) {
        let O = q[q.length - 1];
        if (O) O.redirects.push(...Y)
    }
    return null
}
// @from(Ln 441990, Col 0)
function Pfq(A, q, K) {
    let Y = null,
        z = null,
        _;
    for (let w of A.children) {
        if (!w) continue;
        if (w.type === "file_descriptor") _ = Number(w.text);
        else if (w.type in Ofq) Y = Ofq[w.type] ?? null;
        else if (w.type === "word" || w.type === "number") {
            if (Nn8.test(w.text)) return XM(w);
            z = w.text.replace(/\\(.)/g, "$1")
        } else if (w.type === "raw_string") z = Gfq(w.text);
        else if (w.type === "string") {
            let O = Zfq(w, q, K);
            if (typeof O !== "string") return O;
            z = O
        } else if (w.type === "concatenation") {
            let O = kF(w, q, K);
            if (typeof O !== "string") return O;
            z = O
        } else return XM(w)
    }
    if (!Y || z === null) return {
        kind: "too-complex",
        reason: "Unrecognized redirect shape",
        nodeType: A.type
    };
    return {
        op: Y,
        target: z,
        fd: _
    }
}
// @from(Ln 442024, Col 0)
function Wfq(A) {
    let q = null,
        K = null;
    for (let z of A.children) {
        if (!z) continue;
        if (z.type === "heredoc_start") q = z.text;
        else if (z.type === "heredoc_body") K = z;
        else if (z.type === "<<" || z.type === "<<-" || z.type === "heredoc_end" || z.type === "file_descriptor");
        else return XM(z)
    }
    if (!(q !== null && (q.startsWith("'") && q.endsWith("'") || q.startsWith('"') && q.endsWith('"') || q.startsWith("\\")))) return {
        kind: "too-complex",
        reason: "Heredoc with unquoted delimiter undergoes shell expansion",
        nodeType: "heredoc_redirect"
    };
    if (K)
        for (let z of K.children) {
            if (!z) continue;
            if (z.type !== "heredoc_content") return XM(z)
        }
    return null
}
// @from(Ln 442047, Col 0)
function $Yz(A, q, K) {
    for (let Y of A.children) {
        if (!Y) continue;
        if (Y.type === "<<<") continue;
        let z = kF(Y, q, K);
        if (typeof z !== "string") return z;
        if (oh1.test(z)) return XM(Y)
    }
    return null
}
// @from(Ln 442058, Col 0)
function HYz(A, q, K, Y) {
    let z = [],
        _ = [],
        w = [...q];
    for (let $ of A.children) {
        if (!$) continue;
        switch ($.type) {
            case "variable_assignment": {
                let H = Vn8($, K, Y);
                if ("kind" in H) return H;
                _.push({
                    name: H.name,
                    value: H.value
                });
                break
            }
            case "command_name": {
                let H = kF($.children[0] ?? $, K, Y);
                if (typeof H !== "string") return H;
                z.push(H);
                break
            }
            case "word":
            case "number":
            case "raw_string":
            case "string":
            case "concatenation":
            case "arithmetic_expansion": {
                let H = kF($, K, Y);
                if (typeof H !== "string") return H;
                z.push(H);
                break
            }
            case "simple_expansion": {
                let H = sh1($, Y, !1);
                if (typeof H !== "string") return H;
                z.push(H);
                break
            }
            case "file_redirect": {
                let H = Pfq($, K, Y);
                if ("kind" in H) return H;
                w.push(H);
                break
            }
            case "herestring_redirect": {
                let H = $Yz($, K, Y);
                if (H) return H;
                break
            }
            default:
                return XM($)
        }
    }
    let O = /\$[A-Za-z_]/.test(A.text) ? z.map(($) => $ === "" || /["'\\ \t\n$`;|&<>(){}*?[\]~#]/.test($) ? `'${$.replace(/'/g,"'\\''")}'` : $).join(" ") : A.text;
    return {
        kind: "simple",
        commands: [{
            argv: z,
            envVars: _,
            redirects: w,
            text: O
        }]
    }
}
// @from(Ln 442124, Col 0)
function En8(A, q, K) {
    let Y = new Map(K);
    for (let z of A.children) {
        if (!z) continue;
        if (z.type === "$(" || z.type === "`" || z.type === ")") continue;
        let _ = VF(z, q, Y);
        if (_) return _
    }
    return null
}
// @from(Ln 442135, Col 0)
function kF(A, q, K) {
    if (!A) return {
        kind: "too-complex",
        reason: "Null argument node"
    };
    switch (A.type) {
        case "word": {
            if (Nn8.test(A.text)) return {
                kind: "too-complex",
                reason: "Word contains brace expansion syntax",
                nodeType: "word"
            };
            return A.text.replace(/\\(.)/g, "$1")
        }
        case "number":
            return A.text;
        case "raw_string":
            return Gfq(A.text);
        case "string":
            return Zfq(A, q, K);
        case "concatenation": {
            if (Nn8.test(A.text)) return {
                kind: "too-complex",
                reason: "Brace expansion",
                nodeType: "concatenation"
            };
            let Y = "";
            for (let z of A.children) {
                if (!z) continue;
                let _ = kF(z, q, K);
                if (typeof _ !== "string") return _;
                Y += _
            }
            return Y
        }
        case "arithmetic_expansion": {
            let Y = yn8(A);
            if (Y) return Y;
            return A.text
        }
        case "simple_expansion":
            return sh1(A, K, !1);
        default:
            return XM(A)
    }
}
// @from(Ln 442182, Col 0)
function Zfq(A, q, K) {
    let Y = "",
        z = -1,
        _ = !1,
        w = !1;
    for (let O of A.children) {
        if (!O) continue;
        if (z !== -1 && O.startIndex > z) Y += `
`.repeat(O.startIndex - z), w = !0;
        switch (z = O.endIndex, O.type) {
            case '"':
                z = O.endIndex;
                break;
            case "string_content":
                Y += O.text.replace(/\\([$`"\\])/g, "$1"), w = !0;
                break;
            case $fq:
                Y += $fq, w = !0;
                break;
            case "command_substitution": {
                let $ = JYz(O);
                if ($ === "DANGEROUS") return XM(O);
                if ($ !== null) {
                    w = !0;
                    break
                }
                let H = En8(O, q, K);
                if (H) return H;
                Y += ah1, _ = !0;
                break
            }
            case "simple_expansion": {
                let $ = sh1(O, K, !0);
                if (typeof $ !== "string") return $;
                if ($ === vi) _ = !0;
                else w = !0;
                Y += $;
                break
            }
            case "arithmetic_expansion": {
                let $ = yn8(O);
                if ($) return $;
                Y += O.text, w = !0;
                break
            }
            default:
                return XM(O)
        }
    }
    if (_ && !w) return XM(A);
    return Y
}
// @from(Ln 442235, Col 0)
function yn8(A) {
    for (let q of A.children) {
        if (!q) continue;
        if (q.children.length === 0) {
            if (!jYz.test(q.text)) return {
                kind: "too-complex",
                reason: `Arithmetic expansion references variable or non-literal: ${q.text}`,
                nodeType: "arithmetic_expansion"
            };
            continue
        }
        switch (q.type) {
            case "binary_expression":
            case "unary_expression":
            case "ternary_expression":
            case "parenthesized_expression": {
                let K = yn8(q);
                if (K) return K;
                break
            }
            default:
                return XM(q)
        }
    }
    return null
}
// @from(Ln 442262, Col 0)
function JYz(A) {
    let q = null;
    for (let z of A.children) {
        if (!z) continue;
        if (z.type === "$(" || z.type === ")") continue;
        if (z.type === "redirected_statement" && q === null) q = z;
        else return null
    }
    if (!q) return null;
    let K = !1,
        Y = null;
    for (let z of q.children) {
        if (!z) continue;
        if (z.type === "command") {
            let _ = z.children.filter((O) => O);
            if (_.length !== 1) return null;
            let w = _[0];
            if (w?.type !== "command_name" || w.text !== "cat") return null;
            K = !0
        } else if (z.type === "heredoc_redirect") {
            if (Wfq(z) !== null) return null;
            for (let _ of z.children)
                if (_?.type === "heredoc_body") Y = _.text
        } else return null
    }
    if (!K || Y === null) return null;
    if (kn8.test(Y)) return "DANGEROUS";
    if (/\bsystem\s*\(/.test(Y)) return "DANGEROUS";
    return Y
}
// @from(Ln 442293, Col 0)
function Vn8(A, q, K) {
    let Y = null,
        z = "",
        _ = !1;
    for (let w of A.children) {
        if (!w) continue;
        if (w.type === "variable_name") Y = w.text;
        else if (w.type === "=" || w.type === "+=") {
            _ = w.type === "+=";
            continue
        } else if (w.type === "command_substitution") {
            let O = En8(w, q, K);
            if (O) return O;
            z = ah1
        } else if (w.type === "simple_expansion") {
            let O = sh1(w, K, !0);
            if (typeof O !== "string") return O;
            z = O
        } else {
            let O = kF(w, q, K);
            if (typeof O !== "string") return O;
            z = O
        }
    }
    if (Y === null) return {
        kind: "too-complex",
        reason: "Variable assignment without name",
        nodeType: "variable_assignment"
    };
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(Y)) return {
        kind: "too-complex",
        reason: `Invalid variable name (bash treats as command): ${Y}`,
        nodeType: "variable_assignment"
    };
    if (Y === "IFS") return {
        kind: "too-complex",
        reason: "IFS assignment changes word-splitting — cannot model statically",
        nodeType: "variable_assignment"
    };
    if (z.includes("~")) return {
        kind: "too-complex",
        reason: "Tilde in assignment value — bash may expand at assignment time",
        nodeType: "variable_assignment"
    };
    return {
        name: Y,
        value: z,
        isAppend: _
    }
}
// @from(Ln 442344, Col 0)
function sh1(A, q, K) {
    let Y = null,
        z = !1;
    for (let w of A.children) {
        if (w?.type === "variable_name") {
            Y = w.text;
            break
        }
        if (w?.type === "special_variable_name") {
            Y = w.text, z = !0;
            break
        }
    }
    if (Y === null) return XM(A);
    let _ = q.get(Y);
    if (_ !== void 0) {
        if (jfq(_)) {
            if (!K) return XM(A);
            return vi
        }
        if (!K && a9z.test(_)) return XM(A);
        return _
    }
    if (K) {
        if (s9z.has(Y)) return vi;
        if (z && (t9z.has(Y) || /^[0-9]+$/.test(Y))) return vi
    }
    return XM(A)
}
// @from(Ln 442374, Col 0)
function Hfq(A, q) {
    let K = A.get(q.name) ?? "",
        Y = q.isAppend ? K + q.value : q.value;
    A.set(q.name, jfq(Y) ? vi : Y)
}
// @from(Ln 442380, Col 0)
function Gfq(A) {
    return A.slice(1, -1)
}
// @from(Ln 442384, Col 0)
function XM(A) {
    return {
        kind: "too-complex",
        reason: A.type === "ERROR" ? "Parse error" : Jfq.has(A.type) ? `Contains ${A.type}` : `Unhandled node type: ${A.type}`,
        nodeType: A.type
    }
}
// @from(Ln 442392, Col 0)
function ffq(A) {
    for (let q of A) {
        let K = q.argv;
        for (;;)
            if (K[0] === "time" || K[0] === "nohup") K = K.slice(1);
            else if (K[0] === "timeout") {
            let z = 1;
            while (z < K.length) {
                let _ = K[z];
                if (_ === "--foreground" || _ === "--preserve-status" || _ === "--verbose") z++;
                else if (/^--(?:kill-after|signal)=[A-Za-z0-9_.+-]+$/.test(_)) z++;
                else if ((_ === "--kill-after" || _ === "--signal") && K[z + 1] && /^[A-Za-z0-9_.+-]+$/.test(K[z + 1])) z += 2;
                else if (_.startsWith("--")) return {
                    ok: !1,
                    reason: `timeout with ${_} flag cannot be statically analyzed`
                };
                else if (_ === "-v") z++;
                else if ((_ === "-k" || _ === "-s") && K[z + 1] && /^[A-Za-z0-9_.+-]+$/.test(K[z + 1])) z += 2;
                else if (/^-[ks][A-Za-z0-9_.+-]+$/.test(_)) z++;
                else if (_.startsWith("-")) return {
                    ok: !1,
                    reason: `timeout with ${_} flag cannot be statically analyzed`
                };
                else break
            }
            if (K[z] && /^\d+(?:\.\d+)?[smhd]?$/.test(K[z])) K = K.slice(z + 1);
            else if (K[z]) return {
                ok: !1,
                reason: `timeout duration '${K[z]}' cannot be statically analyzed`
            };
            else break
        } else if (K[0] === "nice")
            if (K[1] === "-n" && K[2] && /^-?\d+$/.test(K[2])) K = K.slice(3);
            else if (K[1] && /^-\d+$/.test(K[1])) K = K.slice(2);
        else K = K.slice(1);
        else if (K[0] === "env") {
            let z = 1;
            while (z < K.length) {
                let _ = K[z];
                if (_.includes("=") && !_.startsWith("-")) z++;
                else if (_ === "-i" || _ === "-0" || _ === "-v") z++;
                else if (_ === "-u" && K[z + 1]) z += 2;
                else if (_.startsWith("-")) return {
                    ok: !1,
                    reason: `env with ${_} flag cannot be statically analyzed`
                };
                else break
            }
            if (z < K.length) K = K.slice(z);
            else break
        } else if (K[0] === "stdbuf") {
            let z = 1;
            while (z < K.length) {
                let _ = K[z];
                if (/^-[ioe]$/.test(_) && K[z + 1]) z += 2;
                else if (/^-[ioe]./.test(_)) z++;
                else if (/^--(input|output|error)=/.test(_)) z++;
                else if (_.startsWith("-")) return {
                    ok: !1,
                    reason: `stdbuf with ${_} flag cannot be statically analyzed`
                };
                else break
            }
            if (z > 1 && z < K.length) K = K.slice(z);
            else break
        } else break;
        let Y = K[0];
        if (Y === void 0) continue;
        if (Y.includes(ah1) || Y.includes(vi)) return {
            ok: !1,
            reason: "Command name is runtime-determined (placeholder argv[0])"
        };
        if (Y.startsWith("-") || Y.startsWith("|") || Y.startsWith("&")) return {
            ok: !1,
            reason: "Command appears to be an incomplete fragment"
        };
        if (XYz.has(Y)) return {
            ok: !1,
            reason: `Shell keyword '${Y}' as command name — tree-sitter mis-parse`
        };
        for (let z of q.argv)
            if (z.includes(`
`) && oh1.test(z)) return {
                ok: !1,
                reason: "Newline followed by # inside a quoted argument can hide arguments from path validation"
            };
        for (let z of q.envVars)
            if (z.value.includes(`
`) && oh1.test(z.value)) return {
                ok: !1,
                reason: "Newline followed by # inside an env var value can hide arguments from path validation"
            };
        for (let z of q.redirects)
            if (z.target.includes(`
`) && oh1.test(z.target)) return {
                ok: !1,
                reason: "Newline followed by # inside a redirect target can hide arguments from path validation"
            };
        if (Y === "jq") {
            for (let z of K)
                if (/\bsystem\s*\(/.test(z)) return {
                    ok: !1,
                    reason: "jq command contains system() function which executes arbitrary commands"
                };
            if (K.some((z) => /^(?:-[fL](?:$|[^A-Za-z])|--(?:from-file|rawfile|slurpfile|library-path)(?:$|=))/.test(z))) return {
                ok: !1,
                reason: "jq command contains dangerous flags that could execute code or read arbitrary files"
            }
        }
        if (MYz.has(Y)) return {
            ok: !1,
            reason: `Zsh builtin '${Y}' can bypass security checks`
        };
        if (DYz.has(Y))
            if (Y === "command" && (K[1] === "-v" || K[1] === "-V"));
            else if (Y === "fc" && !K.slice(1).some((z) => /^-[^-]*[es]/.test(z)));
        else return {
            ok: !1,
            reason: `'${Y}' evaluates arguments as shell code`
        };
        for (let z of q.argv)
            if (z.includes("/proc/") && kn8.test(z)) return {
                ok: !1,
                reason: "Accesses /proc/*/environ which may expose secrets"
            };
        for (let z of q.redirects)
            if (z.target.includes("/proc/") && kn8.test(z.target)) return {
                ok: !1,
                reason: "Accesses /proc/*/environ which may expose secrets"
            }
    }
    return {
        ok: !0
    }
}
// @from(Ln 442527, Col 4)
r9z
// @from(Ln 442527, Col 9)
o9z
// @from(Ln 442527, Col 14)
ah1 = "__CMDSUB_OUTPUT__"
// @from(Ln 442528, Col 4)
vi = "__TRACKED_VAR__"
// @from(Ln 442529, Col 4)
a9z
// @from(Ln 442529, Col 9)
s9z
// @from(Ln 442529, Col 14)
t9z
// @from(Ln 442529, Col 19)
Jfq
// @from(Ln 442529, Col 24)
e9z
// @from(Ln 442529, Col 29)
Ofq
// @from(Ln 442529, Col 34)
Nn8
// @from(Ln 442529, Col 39)
AYz
// @from(Ln 442529, Col 44)
qYz
// @from(Ln 442529, Col 49)
KYz
// @from(Ln 442529, Col 54)
YYz
// @from(Ln 442529, Col 59)
zYz
// @from(Ln 442529, Col 64)
$fq
// @from(Ln 442529, Col 69)
jYz
// @from(Ln 442529, Col 74)
MYz
// @from(Ln 442529, Col 79)
DYz
// @from(Ln 442529, Col 84)
XYz
// @from(Ln 442529, Col 89)
kn8
// @from(Ln 442529, Col 94)
oh1
// @from(Ln 442530, Col 4)
Tfq = E(() => {
    Lp6();
    r9z = new Set(["program", "list", "pipeline", "redirected_statement"]), o9z = new Set(["&&", "||", "|", ";", "&", "|&", `
`]);
    a9z = /[ \t\n*?[]/, s9z = new Set(["HOME", "PWD", "OLDPWD", "USER", "LOGNAME", "SHELL", "PATH", "HOSTNAME", "UID", "EUID", "PPID", "RANDOM", "SECONDS", "LINENO", "TMPDIR", "BASH_VERSION", "BASHPID", "SHLVL", "HISTFILE", "IFS"]), t9z = new Set(["?", "$", "!", "@", "*", "#", "0", "-"]), Jfq = new Set(["command_substitution", "process_substitution", "expansion", "simple_expansion", "brace_expression", "subshell", "compound_statement", "for_statement", "while_statement", "until_statement", "if_statement", "case_statement", "function_definition", "test_command", "ansi_c_string", "translated_string", "herestring_redirect", "heredoc_redirect"]), e9z = [...Jfq];
    Ofq = {
        ">": ">",
        ">>": ">>",
        "<": "<",
        ">&": ">&",
        "<&": "<&",
        ">|": ">|",
        "&>": "&>",
        "&>>": "&>>",
        "<<<": "<<<"
    }, Nn8 = /\{[^{}\s]*(,|\.\.)[^{}\s]*\}/, AYz = /[\x00-\x08\x0B-\x1F\x7F]/, qYz = /[\u00A0\u1680\u2000-\u200B\u2028\u2029\u202F\u205F\u3000\uFEFF]/, KYz = /\\[ \t]|[^ \t\n\\]\\\n/, YYz = /~\[/, zYz = /\{[^}]*['"]/;
    $fq = String.fromCharCode(36);
    jYz = /^(?:[0-9]+|0[xX][0-9a-fA-F]+|[0-9]+#[0-9a-zA-Z]+|[-+*/%^&|~!<>=?:(),]+|<<|>>|\*\*|&&|\|\||[<>=!]=|\$\(\(|\)\))$/;
    MYz = new Set(["zmodload", "emulate", "sysopen", "sysread", "syswrite", "sysseek", "zpty", "ztcp", "zsocket", "zf_rm", "zf_mv", "zf_ln", "zf_chmod", "zf_chown", "zf_mkdir", "zf_rmdir", "zf_chgrp"]), DYz = new Set(["eval", "source", ".", "exec", "command", "builtin", "fc", "coproc", "noglob", "nocorrect", "trap", "enable", "mapfile", "readarray", "hash", "bind", "complete", "alias"]), XYz = new Set(["for", "do", "done", "while", "until", "if", "then", "elif", "else", "fi", "case", "esac", "select", "function", "in"]), kn8 = /\/proc\/.*\/environ/, oh1 = /\n[ \t]*#/
})
// @from(Ln 442550, Col 0)
async function PYz(A, q, K, Y) {
    if (q.filter((j) => {
            let J = j.trim();
            return Y.isNormalizedCdCommand(J)
        }).length > 1) {
        let j = {
            type: "other",
            reason: "Multiple directory changes in one command require approval for clarity"
        };
        return {
            behavior: "ask",
            decisionReason: j,
            message: ow(J4.name, j)
        }
    } {
        let j = !1,
            J = !1;
        for (let M of q) {
            let D = EO(M);
            for (let X of D) {
                let P = X.trim();
                if (Y.isNormalizedCdCommand(P)) j = !0;
                if (Y.isNormalizedGitCommand(P)) J = !0
            }
        }
        if (j && J) {
            let M = {
                type: "other",
                reason: "Compound commands with cd and git require approval to prevent bare repository attacks"
            };
            return {
                behavior: "ask",
                decisionReason: M,
                message: ow(J4.name, M)
            }
        }
    }
    let _ = new Map;
    for (let j of q) {
        let J = j.trim();
        if (!J) continue;
        let M = await K({
            ...A,
            command: J
        });
        _.set(J, M)
    }
    let w = Array.from(_.entries()).find(([, j]) => j.behavior === "deny");
    if (w) {
        let [j, J] = w;
        return {
            behavior: "deny",
            message: J.behavior === "deny" ? J.message : `Permission denied for: ${j}`,
            decisionReason: {
                type: "subcommandResults",
                reasons: _
            }
        }
    }
    if (Array.from(_.values()).every((j) => j.behavior === "allow")) return {
        behavior: "allow",
        updatedInput: A,
        decisionReason: {
            type: "subcommandResults",
            reasons: _
        }
    };
    let $ = [];
    for (let [, j] of _)
        if (j.behavior !== "allow" && "suggestions" in j && j.suggestions) $.push(...j.suggestions);
    let H = {
        type: "subcommandResults",
        reasons: _
    };
    return {
        behavior: "ask",
        message: ow(J4.name, H),
        decisionReason: H,
        suggestions: $.length > 0 ? $ : void 0
    }
}
// @from(Ln 442631, Col 0)
async function WYz(A) {
    if (!A.includes(">")) return A;
    return (await ot.parse(A))?.withoutOutputRedirections() ?? A
}
// @from(Ln 442635, Col 0)
async function vfq(A, q, K) {
    if (await oGq(A.command)) {
        let w = await O01(A.command),
            O = {
                type: "other",
                reason: w.behavior === "ask" && w.message ? w.message : "This command uses shell operators that require approval for safety"
            };
        return {
            behavior: "ask",
            message: ow(J4.name, O),
            decisionReason: O
        }
    }
    let Y = await ot.parse(A.command);
    if (!Y) return {
        behavior: "passthrough",
        message: "Failed to parse command"
    };
    let z = Y.getPipeSegments();
    if (z.length <= 1) return {
        behavior: "passthrough",
        message: "No pipes found in command"
    };
    let _ = await Promise.all(z.map((w) => WYz(w)));
    return PYz(A, _, q, K)
}
// @from(Ln 442661, Col 4)
Nfq = E(() => {
    OZ();
    jZ();
    Bj();
    $01();
    z01()
})
// @from(Ln 442669, Col 0)
function GYz(A) {
    return ZYz.includes(A)
}
// @from(Ln 442673, Col 0)
function fYz(A, q) {
    let K = A.trim(),
        [Y] = K.split(/\s+/);
    if (!Y) return {
        behavior: "passthrough",
        message: "Base command not found"
    };
    if (q.mode === "acceptEdits" && GYz(Y)) return {
        behavior: "allow",
        updatedInput: {
            command: A
        },
        decisionReason: {
            type: "mode",
            mode: "acceptEdits"
        }
    };
    return {
        behavior: "passthrough",
        message: `No mode-specific handling for '${Y}' in ${q.mode} mode`
    }
}
// @from(Ln 442696, Col 0)
function Vfq(A, q) {
    if (q.mode === "bypassPermissions") return {
        behavior: "passthrough",
        message: "Bypass mode is handled in main permission flow"
    };
    if (q.mode === "dontAsk") return {
        behavior: "passthrough",
        message: "DontAsk mode is handled in main permission flow"
    };
    let K = EO(A.command);
    for (let Y of K) {
        let z = fYz(Y, q);
        if (z.behavior !== "passthrough") return z
    }
    return {
        behavior: "passthrough",
        message: "No mode-specific validation required"
    }
}
// @from(Ln 442715, Col 4)
ZYz
// @from(Ln 442716, Col 4)
kfq = E(() => {
    jZ();
    ZYz = ["mkdir", "touch", "rm", "rmdir", "mv", "cp", "sed"]
})
// @from(Ln 442721, Col 0)
function Ln8(A) {
    return A.match(/^(.+):\*$/)?.[1] ?? null
}
// @from(Ln 442725, Col 0)
function TYz(A) {
    if (A.endsWith(":*")) return !1;
    for (let q = 0; q < A.length; q++)
        if (A[q] === "*") {
            let K = 0,
                Y = q - 1;
            while (Y >= 0 && A[Y] === "\\") K++, Y--;
            if (K % 2 === 0) return !0
        } return !1
}
// @from(Ln 442736, Col 0)
function Efq(A, q, K = !1) {
    let Y = A.trim(),
        z = "\x00ESCAPED_STAR\x00",
        _ = "\x00ESCAPED_BACKSLASH\x00",
        w = "",
        O = 0;
    while (O < Y.length) {
        let X = Y[O];
        if (X === "\\" && O + 1 < Y.length) {
            let P = Y[O + 1];
            if (P === "*") {
                w += "\x00ESCAPED_STAR\x00", O += 2;
                continue
            } else if (P === "\\") {
                w += "\x00ESCAPED_BACKSLASH\x00", O += 2;
                continue
            }
        }
        w += X, O++
    }
    let j = w.replace(/[.+?^${}()|[\]\\'"]/g, "\\$&").replace(/\*/g, ".*").replace(new RegExp("\x00ESCAPED_STAR\x00", "g"), "\\*").replace(new RegExp("\x00ESCAPED_BACKSLASH\x00", "g"), "\\\\"),
        J = (w.match(/\*/g) || []).length;
    if (j.endsWith(" .*") && J === 1) j = j.slice(0, -3) + "( .*)?";
    let M = "s" + (K ? "i" : "");
    return new RegExp(`^${j}$`, M).test(q)
}
// @from(Ln 442763, Col 0)
function yfq(A) {
    let q = Ln8(A);
    if (q !== null) return {
        type: "prefix",
        prefix: q
    };
    if (TYz(A)) return {
        type: "wildcard",
        pattern: A
    };
    return {
        type: "exact",
        command: A
    }
}
// @from(Ln 442779, Col 0)
function Lfq(A, q) {
    return [{
        type: "addRules",
        rules: [{
            toolName: A,
            ruleContent: q
        }],
        behavior: "allow",
        destination: "localSettings"
    }]
}
// @from(Ln 442791, Col 0)
function Ur6(A, q) {
    return [{
        type: "addRules",
        rules: [{
            toolName: A,
            ruleContent: `${q}:*`
        }],
        behavior: "allow",
        destination: "localSettings"
    }]
}
// @from(Ln 442803, Col 0)
function hfq(A, q, K, Y) {
    return
}
// @from(Ln 442807, Col 0)
function eh1(A) {
    let q = A.trim().split(/\s+/).filter(Boolean);
    if (q.length === 0) return null;
    let K = 0;
    while (K < q.length && /^[A-Za-z_]\w*=/.test(q[K])) {
        let _ = q[K].split("=")[0],
            w = !1;
        if (!AS1.has(_)) return null;
        K++
    }
    let Y = q.slice(K);
    if (Y.length < 2) return null;
    let z = Y[1];
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(z)) return null;
    return Y.slice(0, 2).join(" ")
}
// @from(Ln 442824, Col 0)
function Cfq(A) {
    let q = A.trim().split(/\s+/).filter(Boolean),
        K = 0;
    while (K < q.length && /^[A-Za-z_]\w*=/.test(q[K])) {
        let z = q[K].split("=")[0],
            _ = !1;
        if (!AS1.has(z)) return null;
        K++
    }
    let Y = q[K];
    if (!Y) return null;
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(Y)) return null;
    if (vYz.has(Y)) return null;
    return Y
}
// @from(Ln 442840, Col 0)
function SN6(A) {
    let q = NYz(A);
    if (q) return Ur6(J4.name, q);
    if (A.includes(`
`)) {
        let Y = A.split(`
`)[0].trim();
        if (Y) return Ur6(J4.name, Y)
    }
    let K = eh1(A);
    if (K) return Ur6(J4.name, K);
    return Lfq(J4.name, A)
}
// @from(Ln 442854, Col 0)
function NYz(A) {
    if (!A.includes("<<")) return null;
    let q = A.indexOf("<<");
    if (q <= 0) return null;
    let K = A.substring(0, q).trim();
    if (!K) return null;
    let Y = eh1(K);
    if (Y) return Y;
    let z = K.split(/\s+/).filter(Boolean),
        _ = 0;
    while (_ < z.length && /^[A-Za-z_]\w*=/.test(z[_])) {
        let w = z[_].split("=")[0],
            O = !1;
        if (!AS1.has(w)) return null;
        _++
    }
    if (_ >= z.length) return null;
    return z.slice(_, _ + 2).join(" ") || null
}
// @from(Ln 442874, Col 0)
function Ifq(A) {
    return Ur6(J4.name, A)
}
// @from(Ln 442878, Col 0)
function Cn8(A, q) {
    return Efq(A, q)
}
// @from(Ln 442882, Col 0)
function hn8(A) {
    let K = A.split(`
`).filter((Y) => {
        let z = Y.trim();
        return z !== "" && !z.startsWith("#")
    });
    if (K.length === 0) return A;
    return K.join(`
`)
}
// @from(Ln 442893, Col 0)
function Ac(A) {
    let q = [/^timeout[ \t]+(?:(?:--(?:foreground|preserve-status|verbose)|--(?:kill-after|signal)=[A-Za-z0-9_.+-]+|--(?:kill-after|signal)[ \t]+[A-Za-z0-9_.+-]+|-v|-[ks][ \t]+[A-Za-z0-9_.+-]+|-[ks][A-Za-z0-9_.+-]+)[ \t]+)*(?:--[ \t]+)?\d+(?:\.\d+)?[smhd]?[ \t]+/, /^time[ \t]+(?:--[ \t]+)?/, /^nice[ \t]+-n[ \t]+-?\d+[ \t]+(?:--[ \t]+)?/, /^nohup[ \t]+(?:--[ \t]+)?/],
        K = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)[ \t]+/,
        Y = A,
        z = "";
    while (Y !== z) {
        z = Y, Y = hn8(Y);
        let _ = Y.match(K);
        if (_) {
            let w = _[1],
                O = !1;
            if (AS1.has(w)) Y = Y.replace(K, "")
        }
    }
    z = "";
    while (Y !== z) {
        z = Y, Y = hn8(Y);
        for (let _ of q) Y = Y.replace(_, "")
    }
    return Y.trim()
}
// @from(Ln 442915, Col 0)
function bn8(A, q) {
    let K = /^([A-Za-z_][A-Za-z0-9_]*(?:\[[^\]]*\])?)\+?=(?:'[^'\n\r]*'|"(?:\\.|[^"$`\\\n\r])*"|\\.|[^ \t\n\r$`;|&()<>\\\\'"])*[ \t]+/,
        Y = A,
        z = "";
    while (Y !== z) {
        z = Y, Y = hn8(Y);
        let _ = Y.match(K);
        if (!_) continue;
        if (q?.test(_[1])) break;
        Y = Y.slice(_[0].length)
    }
    return Y.trim()
}
// @from(Ln 442929, Col 0)
function Rn8(A, q, K, {
    stripAllEnvVars: Y = !1,
    skipCompoundCheck: z = !1
} = {}) {
    let _ = A.command.trim(),
        w = ik(_).commandWithoutRedirections,
        $ = (K === "exact" ? [_, w] : [w]).flatMap((j) => {
            let J = Ac(j);
            return J !== j ? [j, J] : [j]
        });
    if (Y) {
        let j = new Set($),
            J = 0;
        while (J < $.length) {
            let M = $.length;
            for (let D = J; D < M; D++) {
                let X = $[D];
                if (!X) continue;
                let P = bn8(X);
                if (!j.has(P)) $.push(P), j.add(P);
                let W = Ac(X);
                if (!j.has(W)) $.push(W), j.add(W)
            }
            J = M
        }
    }
    let H = new Map;
    if (K === "prefix" && !z) {
        for (let j of $)
            if (!H.has(j)) H.set(j, th1(j).length > 1)
    }
    return Array.from(q.entries()).filter(([j]) => {
        let J = In8(j);
        return $.some((M) => {
            switch (J.type) {
                case "exact":
                    return J.command === M;
                case "prefix":
                    switch (K) {
                        case "exact":
                            return J.prefix === M;
                        case "prefix": {
                            if (H.get(M)) return !1;
                            if (M === J.prefix) return !0;
                            if (M.startsWith(J.prefix + " ")) return !0;
                            let D = "xargs " + J.prefix;
                            if (M === D) return !0;
                            return M.startsWith(D + " ")
                        }
                    }
                    break;
                case "wildcard":
                    if (K === "exact") return !1;
                    if (H.get(M)) return !1;
                    return Cn8(J.pattern, M)
            }
        })
    }).map(([, j]) => j)
}
// @from(Ln 442989, Col 0)
function CN6(A, q, K, {
    skipCompoundCheck: Y = !1
} = {}) {
    let z = Sb(q, J4, "deny"),
        _ = Rn8(A, z, K, {
            stripAllEnvVars: !0,
            skipCompoundCheck: !0
        }),
        w = Sb(q, J4, "ask"),
        O = Rn8(A, w, K, {
            stripAllEnvVars: !0,
            skipCompoundCheck: !0
        }),
        $ = Sb(q, J4, "allow"),
        H = Rn8(A, $, K, {
            skipCompoundCheck: Y
        });
    return {
        matchingDenyRules: _,
        matchingAskRules: O,
        matchingAllowRules: H
    }
}
// @from(Ln 443012, Col 0)
async function Sfq(A, q, K, Y, z) {
    let _ = cr6(A, q);
    if (_.behavior !== "passthrough") return _;
    let w = ufq(A, q, Y);
    if (w.behavior === "deny" || w.behavior === "ask") return w;
    if (!z && !t6(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK)) {
        let $ = await dr6(A.command);
        if ($.behavior !== "passthrough") {
            let H = {
                type: "other",
                reason: $.behavior === "ask" && $.message ? $.message : "This command contains patterns that could pose security risks and requires approval"
            };
            return {
                behavior: "ask",
                message: ow(J4.name, H),
                decisionReason: H,
                suggestions: []
            }
        }
    }
    if (w.behavior === "allow") return w;
    let O = K?.commandPrefix ? Ifq(K.commandPrefix) : SN6(A.command);
    return {
        ...w,
        suggestions: O
    }
}
// @from(Ln 443040, Col 0)
function VYz(A, q) {
    let K = A.command.trim(),
        {
            matchingDenyRules: Y,
            matchingAskRules: z
        } = CN6(A, q, "prefix");
    if (Y[0] !== void 0) return {
        behavior: "deny",
        message: `Permission to use ${J4.name} with command ${K} has been denied.`,
        decisionReason: {
            type: "rule",
            rule: Y[0]
        }
    };
    let _ = th1(K);
    if (_.length > 1) {
        let w;
        for (let O of _) {
            let $ = CN6({
                command: O
            }, q, "prefix");
            if ($.matchingDenyRules[0] !== void 0) return {
                behavior: "deny",
                message: `Permission to use ${J4.name} with command ${K} has been denied.`,
                decisionReason: {
                    type: "rule",
                    rule: $.matchingDenyRules[0]
                }
            };
            w ??= $.matchingAskRules[0]
        }
        if (w) return {
            behavior: "ask",
            message: ow(J4.name),
            decisionReason: {
                type: "rule",
                rule: w
            }
        }
    }
    if (z[0] !== void 0) return {
        behavior: "ask",
        message: ow(J4.name),
        decisionReason: {
            type: "rule",
            rule: z[0]
        }
    };
    return {
        behavior: "allow",
        updatedInput: A,
        decisionReason: {
            type: "other",
            reason: "Auto-allowed with sandbox (autoAllowBashIfSandboxed enabled)"
        }
    }
}
// @from(Ln 443098, Col 0)
function kYz(A, q, K, Y) {
    let z = [],
        _ = [];
    for (let w = 0; w < A.length; w++) {
        let O = A[w];
        if (O === `cd ${K}` || O === `cd ${Y}`) continue;
        z.push(O), _.push(q?.[w])
    }
    return {
        subcommands: z,
        astCommandsByIdx: _
    }
}
// @from(Ln 443112, Col 0)
function mfq(A, q) {
    let K = cr6(A, q);
    if (K.behavior !== "passthrough") return K;
    let Y = CN6(A, q, "prefix").matchingDenyRules[0];
    if (Y !== void 0) return {
        behavior: "deny",
        message: `Permission to use ${J4.name} with command ${A.command} has been denied.`,
        decisionReason: {
            type: "rule",
            rule: Y
        }
    };
    return null
}
// @from(Ln 443127, Col 0)
function EYz(A, q, K) {
    let Y = mfq(A, q);
    if (Y !== null) return Y;
    for (let z of K) {
        let _ = CN6({
            ...A,
            command: z.text
        }, q, "prefix").matchingDenyRules[0];
        if (_ !== void 0) return {
            behavior: "deny",
            message: `Permission to use ${J4.name} with command ${A.command} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: _
            }
        }
    }
    return null
}
// @from(Ln 443147, Col 0)
function S4q(A, q, K, Y) {
    if (!T66()) return !1;
    if (q.mode === "auto") return !1;
    if (q.mode === "bypassPermissions") return !1;
    let z = vN1(q);
    if (z.length === 0) return !1;
    let _ = G1(),
        w = NN1(A, _, z, "allow", K, Y);
    return w.catch(() => {}), Bfq.set(A, w), !0
}
// @from(Ln 443158, Col 0)
function rE1() {
    Bfq.clear()
}
// @from(Ln 443161, Col 0)
async function Tn8(A, q, K = pr6) {
    let Y = q.getAppState(),
        _ = t6(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK) ? {
            kind: "parse-unavailable"
        } : await Dfq(A.command),
        w = null,
        O, $;
    if (_.kind === "too-complex") {
        let B = mfq(A, Y.toolPermissionContext);
        if (B !== null) return B;
        let b = {
            type: "other",
            reason: _.reason
        };
        return d("tengu_bash_ast_too_complex", {
            nodeTypeId: Mfq(_.nodeType)
        }), {
            behavior: "ask",
            decisionReason: b,
            message: ow(J4.name, b),
            suggestions: [],
            ...{}
        }
    }
    if (_.kind === "simple") {
        let B = ffq(_.commands);
        if (!B.ok) {
            let b = EYz(A, Y.toolPermissionContext, _.commands);
            if (b !== null) return b;
            let p = {
                type: "other",
                reason: B.reason
            };
            return {
                behavior: "ask",
                decisionReason: p,
                message: ow(J4.name, p),
                suggestions: []
            }
        }
        w = _.commands.map((b) => b.text), O = _.commands.flatMap((b) => b.redirects), $ = _.commands
    }
    if (_.kind === "parse-unavailable") {
        k("bashToolHasPermission: tree-sitter unavailable, using legacy shell-quote path");
        let B = Fz(A.command);
        if (!B.success) {
            let b = {
                type: "other",
                reason: `Command contains malformed syntax that cannot be parsed: ${B.error}`
            };
            return {
                behavior: "ask",
                decisionReason: b,
                message: ow(J4.name, b)
            }
        }
    }
    if (vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled() && Ti(A)) {
        let B = VYz(A, Y.toolPermissionContext);
        if (B.behavior !== "passthrough") return B
    }
    let H = cr6(A, Y.toolPermissionContext);
    if (H.behavior === "deny") return H;
    if (T66() && Y.toolPermissionContext.mode !== "auto") {
        let B = Nl4(Y.toolPermissionContext),
            b = Vl4(Y.toolPermissionContext),
            p = B.length > 0,
            Q = b.length > 0;
        if (p || Q) {
            let [U, r] = await Promise.all([p ? NN1(A.command, G1(), B, "deny", q.abortController.signal, q.options.isNonInteractiveSession) : null, Q ? NN1(A.command, G1(), b, "ask", q.abortController.signal, q.options.isNonInteractiveSession) : null]);
            if (q.abortController.signal.aborted) throw new oY;
            if (U) hfq(A.command, "deny", B, U);
            if (r) hfq(A.command, "ask", b, r);
            if (U?.matches && U.confidence === "high") return {
                behavior: "deny",
                message: `Denied by Bash prompt rule: "${U.matchedDescription}"`,
                decisionReason: {
                    type: "other",
                    reason: `Denied by Bash prompt rule: "${U.matchedDescription}"`
                }
            };
            if (r?.matches && r.confidence === "high") {
                let e;
                if (K === pr6) e = SN6(A.command);
                else {
                    let Y6 = await K(A.command, q.abortController.signal, q.options.isNonInteractiveSession);
                    if (q.abortController.signal.aborted) throw new oY;
                    e = Y6?.commandPrefix ? Ifq(Y6.commandPrefix) : SN6(A.command)
                }
                return {
                    behavior: "ask",
                    message: ow(J4.name),
                    decisionReason: {
                        type: "other",
                        reason: `Required by Bash prompt rule: "${r.matchedDescription}"`
                    },
                    suggestions: e,
                    ...{}
                }
            }
        }
    }
    let j = await vfq(A, (B) => Tn8(B, q, K), {
        isNormalizedCdCommand: Sn8,
        isNormalizedGitCommand: G01
    });
    if (j.behavior !== "passthrough") {
        if (j.behavior === "allow") {
            let B = w === null ? await dr6(A.command) : null;
            if (B !== null && B.behavior !== "passthrough" && B.behavior !== "allow") return Y = q.getAppState(), {
                behavior: "ask",
                message: ow(J4.name, {
                    type: "other",
                    reason: B.message ?? "Command contains patterns that require approval"
                }),
                decisionReason: {
                    type: "other",
                    reason: B.message ?? "Command contains patterns that require approval"
                },
                ...{}
            };
            Y = q.getAppState();
            let b = j01(A, G1(), Y.toolPermissionContext, vi6(A.command), O, $);
            if (b.behavior !== "passthrough") return b
        }
        if (j.behavior === "ask") return Y = q.getAppState(), {
            ...j,
            ...{}
        };
        return j
    }
    if (w === null && !t6(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK)) {
        let B = await dr6(A.command);
        if (B.behavior === "ask" && B.isBashSecurityCheckForMisparsing) {
            let b = BY4(A.command),
                p = b !== null ? await dr6(b) : null;
            if (b === null || p?.behavior === "ask" && p.isBashSecurityCheckForMisparsing) {
                Y = q.getAppState();
                let Q = cr6(A, Y.toolPermissionContext);
                if (Q.behavior === "allow") return Q;
                let U = {
                    type: "other",
                    reason: B.message
                };
                return {
                    behavior: "ask",
                    message: ow(J4.name, U),
                    decisionReason: U,
                    suggestions: [],
                    ...{}
                }
            }
        }
    }
    let J = G1(),
        M = y8() === "windows" ? GP(J) : J,
        D = w ?? th1(A.command),
        {
            subcommands: X,
            astCommandsByIdx: P
        } = kYz(D, $, J, M);
    if (w === null && X.length > Rfq) {
        k(`bashPermissions: ${X.length} subcommands exceeds cap (${Rfq}) — returning ask`, {
            level: "debug"
        });
        let B = {
            type: "other",
            reason: `Command splits into ${X.length} subcommands, too many to safety-check individually`
        };
        return {
            behavior: "ask",
            message: ow(J4.name, B),
            decisionReason: B
        }
    }
    let W = X.filter((B) => Sn8(B));
    if (W.length > 1) {
        let B = {
            type: "other",
            reason: "Multiple directory changes in one command require approval for clarity"
        };
        return {
            behavior: "ask",
            decisionReason: B,
            message: ow(J4.name, B)
        }
    }
    let Z = W.length > 0;
    if (Z) {
        if (X.some((b) => G01(b.trim()))) {
            let b = {
                type: "other",
                reason: "Compound commands with cd and git require approval to prevent bare repository attacks"
            };
            return {
                behavior: "ask",
                decisionReason: b,
                message: ow(J4.name, b)
            }
        }
    }
    Y = q.getAppState();
    let G = X.map((B, b) => ufq({
        command: B
    }, Y.toolPermissionContext, Z, P[b]));
    if (G.find((B) => B.behavior === "deny") !== void 0) return {
        behavior: "deny",
        message: `Permission to use ${J4.name} with command ${A.command} has been denied.`,
        decisionReason: {
            type: "subcommandResults",
            reasons: new Map(G.map((B, b) => [X[b], B]))
        }
    };
    let v = j01(A, G1(), Y.toolPermissionContext, Z, O, $);
    if (v.behavior === "deny") return v;
    let N = G.find((B) => B.behavior === "ask"),
        V = G.filter((B) => B.behavior !== "allow").length;
    if (v.behavior === "ask" && N === void 0) return v;
    if (N !== void 0 && V === 1) return {
        ...N,
        ...{}
    };
    if (H.behavior === "allow") return H;
    let L = !1;
    if (w === null && !t6(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK)) {
        let B = 0,
            b = () => {
                B++
            };
        if (L = (await Promise.all(X.map((Q) => dr6(Q, b)))).some((Q) => Q.behavior !== "passthrough"), B > 0) d("tengu_tree_sitter_security_divergence", {
            quoteContextDivergence: !0,
            count: B
        })
    }
    if (G.every((B) => B.behavior === "allow") && !L) return {
        behavior: "allow",
        updatedInput: A,
        decisionReason: {
            type: "subcommandResults",
            reasons: new Map(G.map((B, b) => [X[b], B]))
        }
    };
    let h = null;
    if (K !== pr6) {
        if (h = await K(A.command, q.abortController.signal, q.options.isNonInteractiveSession), q.abortController.signal.aborted) throw new oY
    }
    if (Y = q.getAppState(), X.length === 1) {
        let B = await Sfq({
            command: X[0]
        }, Y.toolPermissionContext, h, Z, w !== null);
        if (B.behavior === "ask" || B.behavior === "passthrough") return {
            ...B,
            ...{}
        };
        return B
    }
    let R = new Map;
    for (let B of X) R.set(B, await Sfq({
        ...A,
        command: B
    }, Y.toolPermissionContext, h?.subcommandPrefixes.get(B), Z, w !== null));
    if (X.every((B) => {
            return R.get(B)?.behavior === "allow"
        })) return {
        behavior: "allow",
        updatedInput: A,
        decisionReason: {
            type: "subcommandResults",
            reasons: R
        }
    };
    let u = new Map;
    for (let [B, b] of R)
        if (b.behavior === "ask" || b.behavior === "passthrough") {
            let p = "suggestions" in b ? b.suggestions : void 0,
                Q = ya(p);
            for (let U of Q) {
                let r = L5(U);
                u.set(r, U)
            }
            if (b.behavior === "ask" && Q.length === 0 && b.decisionReason?.type !== "rule")
                for (let U of ya(SN6(B))) {
                    let r = L5(U);
                    u.set(r, U)
                }
        } let I = {
            type: "subcommandResults",
            reasons: R
        },
        g = u.size > 0 ? [{
            type: "addRules",
            rules: Array.from(u.values()),
            behavior: "allow",
            destination: "localSettings"
        }] : void 0;
    return {
        behavior: N !== void 0 ? "ask" : "passthrough",
        message: ow(J4.name, I),
        decisionReason: I,
        suggestions: g,
        ...{}
    }
}
// @from(Ln 443465, Col 0)
function G01(A) {
    if (A.startsWith("git ") || A === "git") return !0;
    let q = Ac(A),
        K = Fz(q);
    if (K.success && K.tokens.length > 0) {
        if (K.tokens[0] === "git") return !0;
        if (K.tokens[0] === "xargs" && K.tokens.includes("git")) return !0;
        return !1
    }
    return /^git(?:\s|$)/.test(q)
}
// @from(Ln 443477, Col 0)
function Sn8(A) {
    let q = Ac(A),
        K = Fz(q);
    if (K.success && K.tokens.length > 0) return K.tokens[0] === "cd";
    return lGq.test(q)
}
// @from(Ln 443484, Col 0)
function vi6(A) {
    return th1(A).some((q) => Sn8(q.trim()))
}
// @from(Ln 443487, Col 4)
dr6
// @from(Ln 443487, Col 9)
th1
// @from(Ln 443487, Col 14)
Rfq = 50
// @from(Ln 443488, Col 4)
vYz
// @from(Ln 443488, Col 9)
bfq
// @from(Ln 443488, Col 14)
In8
// @from(Ln 443488, Col 19)
AS1
// @from(Ln 443488, Col 24)
xfq
// @from(Ln 443488, Col 29)
cr6 = (A, q) => {
        let K = A.command.trim(),
            {
                matchingDenyRules: Y,
                matchingAskRules: z,
                matchingAllowRules: _
            } = CN6(A, q, "exact");
        if (Y[0] !== void 0) return {
            behavior: "deny",
            message: `Permission to use ${J4.name} with command ${K} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: Y[0]
            }
        };
        if (z[0] !== void 0) return {
            behavior: "ask",
            message: ow(J4.name),
            decisionReason: {
                type: "rule",
                rule: z[0]
            }
        };
        if (_[0] !== void 0) return {
            behavior: "allow",
            updatedInput: A,
            decisionReason: {
                type: "rule",
                rule: _[0]
            }
        };
        let w = {
            type: "other",
            reason: "This command requires approval"
        };
        return {
            behavior: "passthrough",
            message: ow(J4.name, w),
            decisionReason: w,
            suggestions: SN6(K)
        }
    }
// @from(Ln 443530, Col 4)
ufq = (A, q, K, Y) => {
        let z = A.command.trim(),
            _ = cr6(A, q);
        if (_.behavior === "deny" || _.behavior === "ask") return _;
        let {
            matchingDenyRules: w,
            matchingAskRules: O,
            matchingAllowRules: $
        } = CN6(A, q, "prefix", {
            skipCompoundCheck: Y !== void 0
        });
        if (w[0] !== void 0) return {
            behavior: "deny",
            message: `Permission to use ${J4.name} with command ${z} has been denied.`,
            decisionReason: {
                type: "rule",
                rule: w[0]
            }
        };
        if (O[0] !== void 0) return {
            behavior: "ask",
            message: ow(J4.name),
            decisionReason: {
                type: "rule",
                rule: O[0]
            }
        };
        let H = j01(A, G1(), q, K, Y?.redirects, Y ? [Y] : void 0);
        if (H.behavior !== "passthrough") return H;
        if (_.behavior === "allow") return _;
        if ($[0] !== void 0) return {
            behavior: "allow",
            updatedInput: A,
            decisionReason: {
                type: "rule",
                rule: $[0]
            }
        };
        let j = wz4(A, q);
        if (j.behavior !== "passthrough") return j;
        let J = Vfq(A, q);
        if (J.behavior !== "passthrough") return J;
        if (J4.isReadOnly(A)) return {
            behavior: "allow",
            updatedInput: A,
            decisionReason: {
                type: "other",
                reason: "Read-only command is allowed"
            }
        };
        let M = {
            type: "other",
            reason: "This command requires approval"
        };
        return {
            behavior: "passthrough",
            message: ow(J4.name, M),
            decisionReason: M,
            suggestions: SN6(z)
        }
    }
// @from(Ln 443591, Col 4)
Bfq
// @from(Ln 443592, Col 4)
JZ = E(() => {
    OZ();
    Qr6();
    Lz();
    $01();
    jZ();
    RJ();
    Tfq();
    s8();
    lA();
    YK();
    lx();
    F$();
    Bj();
    SP();
    Nfq();
    A8();
    H1();
    iV8();
    kfq();
    H01();
    V1();
    g1();
    wv();
    dr6 = O01, th1 = EO;
    vYz = new Set(["sh", "bash", "zsh", "fish", "csh", "tcsh", "ksh", "dash", "cmd", "powershell", "pwsh", "env", "xargs", "sudo", "doas", "pkexec"]);
    bfq = Ln8;
    In8 = yfq, AS1 = new Set(["GOEXPERIMENT", "GOOS", "GOARCH", "CGO_ENABLED", "GO111MODULE", "RUST_BACKTRACE", "RUST_LOG", "NODE_ENV", "PYTHONUNBUFFERED", "PYTHONDONTWRITEBYTECODE", "PYTEST_DISABLE_PLUGIN_AUTOLOAD", "PYTEST_DEBUG", "ANTHROPIC_API_KEY", "LANG", "LANGUAGE", "LC_ALL", "LC_CTYPE", "LC_TIME", "CHARSET", "TERM", "COLORTERM", "NO_COLOR", "FORCE_COLOR", "TZ", "LS_COLORS", "LSCOLORS", "GREP_COLOR", "GREP_COLORS", "GCC_COLORS", "TIME_STYLE", "BLOCK_SIZE", "BLOCKSIZE"]);
    xfq = /^(LD_|DYLD_|PATH$)/;
    Bfq = new Map
})
// @from(Ln 443624, Col 0)
function yYz(A) {
    let K = PA().sandbox?.excludedCommands ?? [];
    if (K.length === 0) return !1;
    let Y;
    try {
        Y = EO(A)
    } catch {
        Y = [A]
    }
    for (let z of Y) {
        let w = [z.trim()],
            O = new Set(w),
            $ = 0;
        while ($ < w.length) {
            let H = w.length;
            for (let j = $; j < H; j++) {
                let J = w[j],
                    M = bn8(J, xfq);
                if (!O.has(M)) w.push(M), O.add(M);
                let D = Ac(J);
                if (!O.has(D)) w.push(D), O.add(D)
            }
            $ = H
        }
        for (let H of K) {
            let j = In8(H);
            for (let J of w) switch (j.type) {
                case "prefix":
                    if (J === j.prefix || J.startsWith(j.prefix + " ")) return !0;
                    break;
                case "exact":
                    if (J === j.command) return !0;
                    break;
                case "wildcard":
                    if (Cn8(j.pattern, J)) return !0;
                    break
            }
        }
    }
    return !1
}
// @from(Ln 443666, Col 0)
function Ti(A) {
    if (!vA.isSandboxingEnabled()) return !1;
    if (A.dangerouslyDisableSandbox && vA.areUnsandboxedCommandsAllowed()) return !1;
    if (!A.command) return !1;
    if (yYz(A.command)) return !1;
    return !0
}
// @from(Ln 443673, Col 4)
Qr6 = E(() => {
    Lz();
    i8();
    JZ();
    jZ();
    HA()
})
// @from(Ln 443680, Col 4)
dfq = {}
// @from(Ln 443686, Col 0)
function RYz(A) {
    return Ufq.has(A)
}
// @from(Ln 443690, Col 0)
function hYz(A) {
    return null
}
// @from(Ln 443693, Col 4)
gfq = null
// @from(Ln 443694, Col 4)
Ffq = null
// @from(Ln 443695, Col 4)
pfq = null
// @from(Ln 443696, Col 4)
Ufq
// @from(Ln 443696, Col 9)
LYz
// @from(Ln 443696, Col 14)
D$$
// @from(Ln 443697, Col 4)
cfq = E(() => {
    k1();
    H1();
    uP();
    J_();
    Q$();
    ct();
    bi6();
    pt();
    lc6();
    Ufq = new Set([s7, N9, qz, Ai6, HZ, qi6, "ReadMcpResourceTool", MB, TR, lt, ck, it, OC, $C, Fw, dt, Uk, SI, l36, hI, gz6, ...gfq ? [gfq] : [], ...Ffq ? [Ffq] : [], ...pfq ? [pfq] : [], cc6]), LYz = new Set([_K, R4, bJ]), D$$ = new Set([...Ufq, ...LYz])
})
// @from(Ln 443710, Col 0)
function Zn6(A) {
    return E31(A)
}
// @from(Ln 443714, Col 0)
function yv6(A) {
    return un8.flatMap((q) => (A.alwaysAllowRules[q] || []).map((K) => ({
        source: q,
        ruleBehavior: "allow",
        ruleValue: CH(K)
    })))
}
// @from(Ln 443722, Col 0)
function ow(A, q) {
    if (q) {
        if (q.type === "classifier") return `Classifier '${q.classifier}' requires approval for this ${A} command: ${q.reason}`;
        switch (q.type) {
            case "hook":
                return q.reason ? `Hook '${q.hookName}' blocked this action: ${q.reason}` : `Hook '${q.hookName}' requires approval for this ${A} command`;
            case "rule": {
                let Y = L5(q.rule.ruleValue),
                    z = Zn6(q.rule.source);
                return `Permission rule '${Y}' from ${z} requires approval for this ${A} command`
            }
            case "subcommandResults": {
                let Y = [];
                for (let [z, _] of q.reasons)
                    if (_.behavior === "ask" || _.behavior === "passthrough")
                        if (A === "Bash") {
                            let {
                                commandWithoutRedirections: w,
                                redirections: O
                            } = ik(z), $ = O.length > 0 ? w : z;
                            Y.push($)
                        } else Y.push(z);
                if (Y.length > 0) return `This ${A} command contains multiple operations. The following part${Y.length>1?"s":""} require${Y.length>1?"":"s"} approval: ${Y.join(", ")}`;
                return `This ${A} command contains multiple operations that require approval`
            }
            case "permissionPromptTool":
                return `Tool '${q.permissionPromptToolName}' requires approval for this ${A} command`;
            case "sandboxOverride":
                return "Run outside of the sandbox";
            case "workingDir":
                return q.reason;
            case "other":
                return q.reason;
            case "mode":
                return `Current permission mode (${QQ(q.mode)}) requires approval for this ${A} command`;
            case "asyncAgent":
                return q.reason
        }
    }
    return `Claude requested permissions to use ${A}, but you haven't granted it yet.`
}
// @from(Ln 443764, Col 0)
function KF(A) {
    return un8.flatMap((q) => (A.alwaysDenyRules[q] || []).map((K) => ({
        source: q,
        ruleBehavior: "deny",
        ruleValue: CH(K)
    })))
}
// @from(Ln 443772, Col 0)
function Lv6(A) {
    return un8.flatMap((q) => (A.alwaysAskRules[q] || []).map((K) => ({
        source: q,
        ruleBehavior: "ask",
        ruleValue: CH(K)
    })))
}
// @from(Ln 443780, Col 0)
function mn8(A, q) {
    if (q.ruleValue.ruleContent !== void 0) return !1;
    let K = LC6(A);
    if (q.ruleValue.toolName === K) return !0;
    let Y = iV(q.ruleValue.toolName),
        z = iV(K);
    return Y !== null && z !== null && (Y.toolName === void 0 || Y.toolName === "*") && Y.serverName === z.serverName
}
// @from(Ln 443789, Col 0)
function IYz(A, q) {
    return yv6(A).find((K) => mn8(q, K)) || null
}
// @from(Ln 443793, Col 0)
function bYz(A, q) {
    return KF(A).find((K) => mn8(q, K)) || null
}
// @from(Ln 443797, Col 0)
function xYz(A, q) {
    return Lv6(A).find((K) => mn8(q, K)) || null
}
// @from(Ln 443801, Col 0)
function cn4(A, q, K) {
    return KF(A).find((Y) => Y.ruleValue.toolName === q && Y.ruleValue.ruleContent === K) || null
}
// @from(Ln 443805, Col 0)
function jm8(A, q, K) {
    let Y = new Set;
    for (let z of KF(q))
        if (z.ruleValue.toolName === K && z.ruleValue.ruleContent !== void 0) Y.add(z.ruleValue.ruleContent);
    return A.filter((z) => !Y.has(z.agentType))
}
// @from(Ln 443812, Col 0)
function Sb(A, q, K) {
    return Bn8(A, LC6(q), K)
}
// @from(Ln 443816, Col 0)
function Bn8(A, q, K) {
    let Y = new Map,
        z = [];
    switch (K) {
        case "allow":
            z = yv6(A);
            break;
        case "deny":
            z = KF(A);
            break;
        case "ask":
            z = Lv6(A);
            break
    }
    for (let _ of z)
        if (_.ruleValue.toolName === q && _.ruleValue.ruleContent !== void 0 && _.ruleBehavior === K) Y.set(_.ruleValue.ruleContent, _);
    return Y
}
// @from(Ln 443834, Col 0)
async function uYz(A, q, K, Y, z, _) {
    try {
        for await (let w of b_6(A.name, K, q, Y, z, _, Y.abortController.signal)) {
            if (!w.permissionRequestResult) continue;
            let O = w.permissionRequestResult;
            if (O.behavior === "allow") {
                let $ = O.updatedInput ?? q;
                if (O.updatedPermissions?.length) NC(O.updatedPermissions), Y.setAppState((H) => ({
                    ...H,
                    toolPermissionContext: _v(H.toolPermissionContext, O.updatedPermissions)
                }));
                return {
                    behavior: "allow",
                    updatedInput: $,
                    decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest"
                    }
                }
            }
            if (O.behavior === "deny") {
                if (O.interrupt) k(`Hook interrupt: tool=${A.name} hookMessage=${O.message}`), Y.abortController.abort();
                return {
                    behavior: "deny",
                    message: O.message || "Permission denied by hook",
                    decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest",
                        reason: O.message
                    }
                }
            }
        }
    } catch (w) {
        _6(w instanceof Error ? w : Error(`PermissionRequest hook failed for headless agent: ${String(w)}`))
    }
    return null
}
// @from(Ln 443873, Col 0)
function I_6(A, q) {
    if (A.localDenialTracking) Object.assign(A.localDenialTracking, q);
    else A.setAppState((K) => {
        if (K.denialTracking === q) return K;
        return {
            ...K,
            denialTracking: q
        }
    })
}
// @from(Ln 443884, Col 0)
function mYz(A, q, K, Y, z, _, w) {
    if (!QKq(A)) return null;
    let O = A.totalDenials >= Kv6.maxTotal,
        $ = q.toolPermissionContext.shouldAvoidPermissionPrompts,
        H = A.totalDenials,
        j = A.consecutiveDenials,
        J = O ? `${H} actions were blocked this session. Please review the transcript before continuing.` : `${j} consecutive actions were blocked. Please review the transcript before continuing.`;
    if (d("tengu_auto_mode_denial_limit_exceeded", {
            limit: O ? "total" : "consecutive",
            mode: $ ? "headless" : "cli",
            messageID: Y.message.id,
            consecutiveDenials: j,
            totalDenials: H,
            toolName: hq(z.name)
        }), $) throw new oY("Agent aborted: too many classifier denials in headless mode");
    if (k(`Classifier denial limit exceeded, falling back to prompting: ${J}`, {
            level: "warn"
        }), O) I_6(w, {
        ...A,
        totalDenials: 0,
        consecutiveDenials: 0
    });
    let M = _.decisionReason?.type === "classifier" ? _.decisionReason.classifier : "auto-mode";
    return {
        ..._,
        decisionReason: {
            type: "classifier",
            classifier: M,
            reason: `${J}

Latest blocked action: ${K}`
        }
    }
}
// @from(Ln 443918, Col 0)
async function BYz(A, q, K, Y, z) {
    if (K.abortController.signal.aborted) throw new oY;
    let _ = K.getAppState(),
        w = bYz(_.toolPermissionContext, A);
    if (w) return {
        behavior: "deny",
        decisionReason: {
            type: "rule",
            rule: w
        },
        message: `Permission to use ${A.name} has been denied.`
    };
    let O = xYz(_.toolPermissionContext, A);
    if (O) {
        if (!(A.name === Q7 && vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled() && Ti(q))) return {
            behavior: "ask",
            decisionReason: {
                type: "rule",
                rule: O
            },
            message: ow(A.name)
        }
    }
    let $ = {
        behavior: "passthrough",
        message: ow(A.name)
    };
    try {
        let M = A.inputSchema.parse(q);
        $ = await A.checkPermissions(M, K)
    } catch (M) {
        if (M instanceof oY || M instanceof Az) throw M;
        _6(M)
    }
    if ($?.behavior === "deny") return $;
    if (A.requiresUserInteraction?.() && $?.behavior === "ask") return $;
    if ($?.behavior === "ask" && $.decisionReason?.type === "rule" && $.decisionReason.rule.ruleBehavior === "ask") return $;
    if (_ = K.getAppState(), _.toolPermissionContext.mode === "bypassPermissions" || _.toolPermissionContext.mode === "plan" && _.toolPermissionContext.isBypassPermissionsModeAvailable) return {
        behavior: "allow",
        updatedInput: lfq($, q),
        decisionReason: {
            type: "mode",
            mode: _.toolPermissionContext.mode
        }
    };
    let j = IYz(_.toolPermissionContext, A);
    if (j) return {
        behavior: "allow",
        updatedInput: lfq($, q),
        decisionReason: {
            type: "rule",
            rule: j
        }
    };
    let J = $.behavior === "passthrough" ? {
        ...$,
        behavior: "ask",
        message: ow(A.name, $.decisionReason)
    } : $;
    if (J.behavior === "ask" && J.suggestions) k(`Permission suggestions for ${A.name}: ${B6(J.suggestions,null,2)}`);
    return J
}
// @from(Ln 443980, Col 0)
async function SMq({
    rule: A,
    initialContext: q,
    setToolPermissionContext: K
}) {
    if (A.source === "policySettings" || A.source === "flagSettings" || A.source === "command") throw Error("Cannot delete permission rules from read-only settings");
    let Y = Ez(q, {
        type: "removeRules",
        rules: [A.ruleValue],
        behavior: A.ruleBehavior,
        destination: A.source
    });
    switch (A.source) {
        case "localSettings":
        case "userSettings":
        case "projectSettings": {
            jX7(A);
            break
        }
        case "cliArg":
        case "session":
            break
    }
    K(Y)
}
// @from(Ln 444006, Col 0)
function ifq(A, q) {
    let K = new Map;
    for (let z of A) {
        let _ = `${z.source}:${z.ruleBehavior}`;
        if (!K.has(_)) K.set(_, []);
        K.get(_).push(z.ruleValue)
    }
    let Y = [];
    for (let [z, _] of K) {
        let [w, O] = z.split(":");
        Y.push({
            type: q,
            rules: _,
            behavior: O,
            destination: w
        })
    }
    return Y
}
// @from(Ln 444026, Col 0)
function nfq(A, q) {
    let K = ifq(q, "addRules");
    return _v(A, K)
}
// @from(Ln 444031, Col 0)
function U84(A, q) {
    let K = A;
    if (Eb6()) {
        let _ = ["userSettings", "projectSettings", "localSettings", "cliArg", "session"],
            w = ["allow", "deny", "ask"];
        for (let O of _)
            for (let $ of w) K = Ez(K, {
                type: "replaceRules",
                rules: [],
                behavior: $,
                destination: O
            })
    }
    let Y = ["userSettings", "projectSettings", "localSettings"];
    for (let _ of Y)
        for (let w of ["allow", "deny", "ask"]) K = Ez(K, {
            type: "replaceRules",
            rules: [],
            behavior: w,
            destination: _
        });
    let z = ifq(q, "replaceRules");
    return _v(K, z)
}
// @from(Ln 444056, Col 0)
function lfq(A, q) {
    return ("updatedInput" in A ? A.updatedInput : void 0) ?? q
}
// @from(Ln 444059, Col 4)
SYz
// @from(Ln 444059, Col 9)
CYz = 1800000
// @from(Ln 444060, Col 4)
un8