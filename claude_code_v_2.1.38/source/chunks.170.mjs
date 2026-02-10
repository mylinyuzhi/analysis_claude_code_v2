
// @from(Ln 438521, Col 0)
function wYz(A, q) {
    if (!A.length) return q;
    let K = "",
        Y = 0,
        z = !1;
    for (let w = 0; w < A.length; w++) {
        let H = A[w],
            $ = A[w - 1],
            O = A[w + 1];
        if (typeof H === "string") {
            let X = /[|&;]/.test(H) ? `"${H}"` : zYz(H) ? R7([H]) : H,
                D = X.endsWith("$"),
                j = O && typeof O === "object" && "op" in O && O.op === "(",
                M = K.endsWith("(") || $ === "$" || typeof $ === "object" && $ && "op" in $ && $.op === ")";
            if (K.endsWith("<(")) K += " " + X;
            else K = de(K, X, M);
            continue
        }
        if (typeof H !== "object" || !H || !("op" in H)) continue;
        let _ = H.op;
        if (_ === "glob" && "pattern" in H) {
            K = de(K, H.pattern);
            continue
        }
        if (_ === ">&" && typeof $ === "string" && /^\d+$/.test($) && typeof O === "string" && /^\d+$/.test(O)) {
            let J = K.lastIndexOf($);
            K = K.slice(0, J) + $ + _ + O, w++;
            continue
        }
        if (_ === "<" && p_(O, "<")) {
            let J = A[w + 2];
            if (J && typeof J === "string") {
                K = de(K, J), w += 2;
                continue
            }
        }
        if (_ === "<<<") {
            K = de(K, _);
            continue
        }
        if (_ === "(") {
            if (oOq($, A, w) || Y > 0) {
                if (Y++, K.endsWith(" ")) K = K.slice(0, -1);
                K += "("
            } else if (K.endsWith("$"))
                if (oOq($, A, w)) Y++, K += "(";
                else K = de(K, "(");
            else {
                let X = K.endsWith("<(") || K.endsWith("(");
                K = de(K, "(", X)
            }
            continue
        }
        if (_ === ")") {
            if (z) {
                z = !1, K += ")";
                continue
            }
            if (Y > 0) Y--;
            K += ")";
            continue
        }
        if (_ === "<(") {
            z = !0, K = de(K, _);
            continue
        }
        if (["&&", "||", "|", ";", ">", ">>", "<"].includes(_)) K = de(K, _)
    }
    return K.trim() || q
}
// @from(Ln 438591, Col 4)
Sd1
// @from(Ln 438591, Col 9)
Cd1
// @from(Ln 438591, Col 14)
KmA
// @from(Ln 438591, Col 19)
qmA
// @from(Ln 438591, Col 24)
sOq
// @from(Ln 438591, Col 29)
qYz
// @from(Ln 438592, Col 4)
wG = v(() => {
    zq();
    yw();
    U4();
    AB();
    M_();
    rOq();
    u6();
    q3();
    Sd1 = /^cd(?:\s|$)/;
    Cd1 = new Set(["0", "1", "2"]);
    KmA = KA((A, q, K) => {
        let Y = t9z(A, q, K);
        return Y.catch(() => {
            KmA.cache.delete(A)
        }), Y
    }, (A) => A);
    qmA = KA((A, q, K) => {
        let Y = AYz(A, q, K);
        return Y.catch(() => {
            qmA.cache.delete(A)
        }), Y
    }, (A) => A);
    sOq = new Set(["&&", "||", ";", ";;", "|"]), qYz = new Set([...sOq, ">&", ">", ">>"])
})
// @from(Ln 438618, Col 0)
function OYz(A) {
    let q = JYz(A),
        K = $Yz.get(q);
    return K !== void 0 ? K : HYz
}
// @from(Ln 438624, Col 0)
function _Yz(A) {
    return A.trim().split(/\s+/)[0] || ""
}
// @from(Ln 438628, Col 0)
function JYz(A) {
    let q = AD(A),
        K = q[q.length - 1] || A;
    return _Yz(K)
}
// @from(Ln 438634, Col 0)
function eOq(A, q, K, Y) {
    let w = OYz(A)(q, K, Y);
    return {
        isError: w.isError,
        message: w.message
    }
}
// @from(Ln 438641, Col 4)
HYz = (A, q, K) => ({
        isError: A !== 0,
        message: A !== 0 ? `Command failed with exit code ${A}` : void 0
    })
// @from(Ln 438645, Col 4)
$Yz
// @from(Ln 438646, Col 4)
A_q = v(() => {
    wG();
    $Yz = new Map([
        ["grep", (A, q, K) => ({
            isError: A >= 2,
            message: A === 1 ? "No matches found" : void 0
        })],
        ["rg", (A, q, K) => ({
            isError: A >= 2,
            message: A === 1 ? "No matches found" : void 0
        })],
        ["find", (A, q, K) => ({
            isError: A >= 2,
            message: A === 1 ? "Some directories were inaccessible" : void 0
        })],
        ["diff", (A, q, K) => ({
            isError: A >= 2,
            message: A === 1 ? "Files differ" : void 0
        })],
        ["test", (A, q, K) => ({
            isError: A >= 2,
            message: A === 1 ? "Condition is false" : void 0
        })],
        ["[", (A, q, K) => ({
            isError: A >= 2,
            message: A === 1 ? "Condition is false" : void 0
        })]
    ])
})
// @from(Ln 438684, Col 0)
function fYz(A) {
    let q;
    try {
        q = rZ1(A)
    } catch {
        return {
            isSearch: !1,
            isRead: !1
        }
    }
    if (q.length === 0) return {
        isSearch: !1,
        isRead: !1
    };
    let K = !1,
        Y = !1,
        z = null,
        w = !1,
        H = !1;
    for (let $ of q) {
        if (H) {
            H = !1;
            continue
        }
        if ($ === ">" || $ === ">>" || $ === ">&") {
            H = !0;
            continue
        }
        if ($ === "||" || $ === "&&" || $ === "|" || $ === ";") {
            z = $;
            continue
        }
        let O = $.trim().split(/\s+/)[0];
        if (!O) continue;
        let _ = WYz.has(O),
            J = GYz.has(O),
            X = w_q.has(O);
        if (z === "||" && X) continue;
        if (w = !0, !_ && !J) return {
            isSearch: !1,
            isRead: !1
        };
        if (_) K = !0;
        if (J) Y = !0
    }
    if (!w) return {
        isSearch: !1,
        isRead: !1
    };
    return {
        isSearch: K,
        isRead: Y
    }
}
// @from(Ln 438739, Col 0)
function VYz(A) {
    let q;
    try {
        q = rZ1(A)
    } catch {
        return !1
    }
    if (q.length === 0) return !1;
    let K = !1,
        Y = null,
        z = !1;
    for (let w of q) {
        if (z) {
            z = !1;
            continue
        }
        if (w === ">" || w === ">>" || w === ">&") {
            z = !0;
            continue
        }
        if (w === "||" || w === "&&" || w === "|" || w === ";") {
            Y = w;
            continue
        }
        let H = w.trim().split(/\s+/)[0];
        if (!H) continue;
        if (Y === "||" && w_q.has(H)) continue;
        if (K = !0, !ZYz.has(H)) return !1
    }
    return K
}
// @from(Ln 438771, Col 0)
function z_q(A) {
    let q = AD(A);
    if (q.length === 0) return "other";
    for (let K of q) {
        let Y = K.split(" ")[0] || "";
        if (TYz.includes(Y)) return Y
    }
    return "other"
}
// @from(Ln 438781, Col 0)
function EYz(A) {
    let q = A.match(/https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/);
    if (q?.[1] && q?.[2]) return {
        prNumber: parseInt(q[2], 10),
        prUrl: A,
        prRepository: q[1]
    };
    return null
}
// @from(Ln 438791, Col 0)
function kYz(A, q, K) {
    if (q !== 0) return;
    if (A.match(/\bgit\s+commit\b/)) {
        if (c("tengu_git_operation", {
                operation: "commit"
            }), A.match(/--amend\b/)) c("tengu_git_operation", {
            operation: "commit_amend"
        });
        CL6()?.add(1), u8("git-commits")
    }
    if (A.match(/\bgh\s+pr\s+create\b/)) {
        if (c("tengu_git_operation", {
                operation: "pr_create"
            }), HN1()?.add(1), u8("pr-creation"), K) {
            let H = K.match(/https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+/);
            if (H) {
                let $ = EYz(H[0]);
                if ($) Promise.resolve().then(() => (lq(), r0A)).then(({
                    linkSessionToPR: O
                }) => {
                    Promise.resolve().then(() => (B6(), scA)).then(({
                        getSessionId: _
                    }) => {
                        let J = _();
                        if (J) O(J, $.prNumber, $.prUrl, $.prRepository)
                    })
                })
            }
        }
    }
    if (A.match(/\bglab\s+mr\s+create\b/)) c("tengu_git_operation", {
        operation: "pr_create"
    }), HN1()?.add(1), u8("pr-creation");
    let z = A.match(/\bcurl\b/) && (A.match(/-X\s*POST\b/i) || A.match(/--request\s*=?\s*POST\b/i) || A.match(/\s-d\s/)),
        w = A.match(/https?:\/\/[^\s'"]*\/(pulls|pull-requests|merge[-_]requests)(?!\/\d)/i);
    if (z && w) c("tengu_git_operation", {
        operation: "pr_create"
    }), HN1()?.add(1), u8("pr-creation");
    if (A.match(/\bgit\s+(checkout|branch|switch)\b/)) u8("branch-management")
}
// @from(Ln 438832, Col 0)
function LYz(A) {
    let q = AD(A);
    if (q.length === 0) return !0;
    let K = q[0]?.trim();
    if (!K) return !0;
    return !NYz.includes(K)
}
// @from(Ln 438839, Col 0)
async function RYz(A, q, K) {
    let {
        filePath: Y,
        newContent: z
    } = A, w = g4(Y), H = b1();
    if (!H.existsSync(w)) return {
        data: {
            stdout: "",
            stderr: `sed: ${Y}: No such file or directory
Exit code 1`,
            interrupted: !1
        }
    };
    let $ = AX(w),
        O = H.readFileSync(w, {
            encoding: $
        });
    if (z2() && K) await Xt(q.updateFileHistoryState, w, K.uuid);
    let _ = Qd(w);
    return ft(w, z, $, _), _t(w, O, z), q.readFileState.set(w, {
        content: z,
        timestamp: aW(w),
        offset: void 0,
        limit: void 0
    }), {
        data: {
            stdout: "",
            stderr: "",
            interrupted: !1
        }
    }
}
// @from(Ln 438871, Col 0)
async function* yYz({
    input: A,
    abortController: q,
    setAppState: K,
    setToolJSX: Y,
    preventCwdChanges: z
}) {
    let {
        command: w,
        description: H,
        timeout: $,
        shellExecutable: O,
        run_in_background: _
    } = A, J = $ || YZ6(), X = "", D = "", j = 0, M = void 0, P = !1, W = !Id1 && LYz(w), G = await bW6(w, q.signal, J, O, (B, S, m) => {
        D = B, X = S, j = m
    }, z, Sc(A), W), f = G.result;
    async function Z() {
        return (await gj1.spawn({
            command: w,
            description: H || w,
            shellCommand: G
        }, {
            abortController: q,
            getAppState: async () => {
                throw Error("getAppState not available in runShellCommand context")
            },
            setAppState: K
        })).taskId
    }

    function N(B, S) {
        Z().then((m) => {
            if (M = m, c(B, {
                    command_type: z_q(w)
                }), S) S(m)
        })
    }
    if (G.onTimeout && W) G.onTimeout((B) => {
        N("tengu_bash_command_timeout_backgrounded", B)
    });
    if (_ === !0 && !Id1) {
        let B = await Z();
        return c("tengu_bash_command_explicitly_backgrounded", {
            command_type: z_q(w)
        }), {
            stdout: "",
            stderr: "",
            code: 0,
            interrupted: !1,
            backgroundTaskId: B
        }
    }
    let T = Date.now(),
        k = T + q_q,
        y = void 0;
    while (!0) {
        let B = Date.now(),
            S = Math.max(0, k - B),
            m = await Promise.race([f, new Promise((U) => setTimeout(() => U(null), S))]);
        if (m !== null) {
            if (y) jd7(y, K);
            return G.cleanup(), m
        }
        if (M) return {
            stdout: P ? X : "",
            stderr: "",
            code: 0,
            interrupted: !1,
            backgroundTaskId: M
        };
        if (q.signal.aborted && q.signal.reason === "interrupt" && !P)
            if (P = !0, !Id1) N("tengu_bash_command_interrupt_backgrounded");
            else G.kill();
        if (y) {
            if (G.status === "backgrounded") return {
                stdout: "",
                stderr: "",
                code: 0,
                interrupted: !1,
                backgroundTaskId: y,
                backgroundedByUser: !0
            }
        }
        let b = Date.now() - T,
            g = Math.floor(b / 1000);
        if (!Id1 && M === void 0 && g >= q_q / 1000 && Y) {
            if (!y) y = Xd7({
                command: w,
                description: H || w,
                shellCommand: G
            }, K);
            Y({
                jsx: YmA.createElement(gM6, null),
                shouldHidePromptInput: !1,
                shouldContinueAnimation: !0,
                showSpinner: !0
            })
        }
        yield {
            type: "progress",
            fullOutput: X,
            output: D,
            elapsedTimeSeconds: g,
            totalLines: j,
            ...$ ? {
                timeoutMs: J
            } : void 0
        }, k = Date.now() + PYz
    }
}
// @from(Ln 438981, Col 0)
async function CYz(A, q, K) {
    try {
        let Y = _A(A),
            {
                content: z,
                type: w,
                schema: H
            } = await ECA(Y, K.tool, K.server),
            $ = await pb1(z),
            O = Array.isArray(z) && z.some((W) => W.type === "image");
        if (!$ || O) {
            if (Array.isArray(z)) return {
                stdout: Pa4(z),
                structuredContent: z,
                rawOutputPath: void 0
            };
            else if (typeof z === "string") return {
                stdout: z,
                structuredContent: void 0,
                rawOutputPath: void 0
            };
            return null
        }
        let _ = typeof z === "string" ? z : Q1(z, null, 2),
            J = Date.now(),
            D = `mcp-cli-${q.replace(/[^a-zA-Z0-9_-]/g,"_").slice(0,30)}-${J}`,
            j = await uq1(_, D);
        if (Bq1(j)) return null;
        let M = L$6(w, H);
        return {
            stdout: R$6(j.filepath, j.originalSize, M, $U1()),
            structuredContent: void 0,
            rawOutputPath: j.filepath
        }
    } catch (Y) {
        return K1(Y), null
    }
}
// @from(Ln 439019, Col 4)
YmA
// @from(Ln 439019, Col 9)
q_q = 2000
// @from(Ln 439020, Col 4)
PYz = 1000
// @from(Ln 439021, Col 4)
WYz
// @from(Ln 439021, Col 9)
GYz
// @from(Ln 439021, Col 14)
w_q
// @from(Ln 439021, Col 19)
ZYz
// @from(Ln 439021, Col 24)
NYz
// @from(Ln 439021, Col 29)
Id1
// @from(Ln 439021, Col 34)
K_q
// @from(Ln 439021, Col 39)
Y_q
// @from(Ln 439021, Col 44)
TYz
// @from(Ln 439021, Col 49)
vYz
// @from(Ln 439021, Col 54)
qq
// @from(Ln 439022, Col 4)
i0 = v(() => {
    i7();
    wG();
    y6();
    G2();
    dL();
    N7();
    hA();
    YE();
    kK1();
    hZ();
    wZ6();
    kQ1();
    hkA();
    k2();
    pM();
    GG1();
    WXA();
    Pp();
    vq();
    km();
    _f6();
    xd1();
    U4();
    u6();
    B6();
    v3();
    SW();
    k$6();
    lyA();
    qH();
    A_q();
    wZ6();
    zEA();
    VI();
    Tj();
    m6();
    wq();
    _8();
    ZN();
    PW1();
    Ez();
    YmA = o(X1(), 1), WYz = new Set(["find", "grep", "rg", "ag", "ack", "locate", "which", "whereis"]), GYz = new Set(["cat", "head", "tail", "less", "more", "wc", "stat", "file", "strings", "ls", "tree", "du"]), w_q = new Set(["echo", "true", "false", ":"]), ZYz = new Set(["mv", "cp", "rm", "mkdir", "rmdir", "chmod", "chown", "chgrp", "touch", "ln", "cd", "export", "unset", "wait"]);
    NYz = ["sleep"], Id1 = J6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS), K_q = u.strictObject({
        command: u.string().describe("The command to execute"),
        timeout: u.number().optional().describe(`Optional timeout in milliseconds (max ${zZ6()})`),
        description: u.string().optional().describe(`Clear, concise description of what this command does in active voice. Never use words like "complex" or "risk" in the description - just describe what it does.

For simple commands (git, npm, standard CLI tools), keep it brief (5-10 words):
- ls → "List files in current directory"
- git status → "Show working tree status"
- npm install → "Install package dependencies"

For commands that are harder to parse at a glance (piped commands, obscure flags, etc.), add enough context to clarify what it does:
- find . -name "*.tmp" -exec rm {} \\; → "Find and delete all .tmp files recursively"
- git reset --hard origin/main → "Discard all local changes and match remote main"
- curl -s url | jq '.data[]' → "Fetch JSON from URL and extract data array elements"`),
        run_in_background: u.boolean().optional().describe("Set to true to run this command in the background. Use TaskOutput to read the output later."),
        dangerouslyDisableSandbox: u.boolean().optional().describe("Set this to true to dangerously override sandbox mode and run commands without sandboxing."),
        _simulatedSedEdit: u.object({
            filePath: u.string(),
            newContent: u.string()
        }).optional().describe("Internal: pre-computed sed edit result from preview")
    }), Y_q = z7(() => Id1 ? K_q.omit({
        run_in_background: !0
    }) : K_q), TYz = ["npm", "yarn", "pnpm", "node", "python", "python3", "go", "cargo", "make", "docker", "terraform", "webpack", "vite", "jest", "pytest", "curl", "wget", "build", "test", "serve", "watch", "dev"];
    vYz = z7(() => u.object({
        stdout: u.string().describe("The standard output of the command"),
        stderr: u.string().describe("The standard error output of the command"),
        rawOutputPath: u.string().optional().describe("Path to raw output file for large MCP tool outputs"),
        interrupted: u.boolean().describe("Whether the command was interrupted"),
        isImage: u.boolean().optional().describe("Flag to indicate if stdout contains image data"),
        backgroundTaskId: u.string().optional().describe("ID of the background task if command is running in background"),
        backgroundedByUser: u.boolean().optional().describe("True if the user manually backgrounded the command with Ctrl+B"),
        dangerouslyDisableSandbox: u.boolean().optional().describe("Flag to indicate if sandbox mode was overridden"),
        returnCodeInterpretation: u.string().optional().describe("Semantic interpretation for non-error exit codes with special meaning"),
        noOutputExpected: u.boolean().optional().describe("Whether the command is expected to produce no output on success"),
        structuredContent: u.array(u.any()).optional().describe("Structured content blocks from mcp-cli commands")
    }));
    qq = {
        name: h4,
        maxResultSizeChars: 30000,
        strict: !0,
        async description({
            description: A
        }) {
            return A || "Run shell command"
        },
        async prompt() {
            return ja4()
        },
        isConcurrencySafe(A) {
            return this.isReadOnly(A)
        },
        isReadOnly(A) {
            let q = Pf6(A.command);
            return Of6(A, q).behavior === "allow"
        },
        isSearchOrReadCommand(A) {
            let q = Y_q().safeParse(A);
            if (!q.success) return {
                isSearch: !1,
                isRead: !1
            };
            return fYz(q.data.command)
        },
        get inputSchema() {
            return Y_q()
        },
        get outputSchema() {
            return vYz()
        },
        userFacingName(A) {
            if (!A) return "Bash";
            if (A.command) {
                let q = aP1(A.command);
                if (q) return hP6({
                    file_path: q.filePath,
                    old_string: "x"
                })
            }
            return Sc(A) && J6(process.env.CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR) ? "SandboxedBash" : "Bash"
        },
        getToolUseSummary(A) {
            if (!A?.command) return null;
            let {
                command: q,
                description: K
            } = A;
            if (K) return K;
            return DY(q, sS)
        },
        getActivityDescription(A) {
            if (!A?.command) return "Running command";
            return `Running ${A.description??DY(A.command,sS)}`
        },
        isEnabled() {
            return !0
        },
        async checkPermissions(A, q) {
            return await zmA(A, q)
        },
        renderToolUseMessage: Tb4,
        renderToolUseRejectedMessage: vb4,
        renderToolUseProgressMessage: Eb4,
        renderToolUseQueuedMessage: kb4,
        renderToolResultMessage: Lb4,
        mapToolResultToToolResultBlockParam({
            interrupted: A,
            stdout: q,
            stderr: K,
            isImage: Y,
            backgroundTaskId: z,
            backgroundedByUser: w,
            structuredContent: H
        }, $) {
            if (H && H.length > 0) return {
                tool_use_id: $,
                type: "tool_result",
                content: H
            };
            if (Y) {
                let X = q.trim().match(/^data:([^;]+);base64,(.+)$/);
                if (X) {
                    let D = X[1],
                        j = X[2];
                    return {
                        tool_use_id: $,
                        type: "tool_result",
                        content: [{
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: D || "image/jpeg",
                                data: j || ""
                            }
                        }]
                    }
                }
            }
            let O = q;
            if (q) O = q.replace(/^(\s*\n)+/, ""), O = O.trimEnd();
            let _ = K.trim();
            if (A) {
                if (K) _ += hd1;
                _ += "<error>Command was aborted before completion</error>"
            }
            let J = z ? `Command ${w?"was manually backgrounded by user":"running in background"} with ID: ${z}. Output is being written to: ${ww(z)}` : "";
            return {
                tool_use_id: $,
                type: "tool_result",
                content: [O, _, J].filter(Boolean).join(`
`),
                is_error: A
            }
        },
        async call(A, q, K, Y, z) {
            if (A._simulatedSedEdit) return await RYz(A._simulatedSedEdit, q, Y);
            let {
                abortController: w,
                readFileState: H,
                getAppState: $,
                setAppState: O,
                setToolJSX: _
            } = q, J = new FD1, X = new FD1, D, j = 0, M = !1, P, G = !!q.agentId;
            try {
                let l = yYz({
                        input: A,
                        abortController: w,
                        setAppState: O,
                        setToolJSX: _,
                        preventCwdChanges: G
                    }),
                    r;
                do
                    if (r = await l.next(), !r.done && z) {
                        let T1 = r.value;
                        z({
                            toolUseID: `bash-progress-${j++}`,
                            data: {
                                type: "bash_progress",
                                output: T1.output,
                                fullOutput: T1.fullOutput,
                                elapsedTimeSeconds: T1.elapsedTimeSeconds,
                                totalLines: T1.totalLines,
                                timeoutMs: T1.timeoutMs
                            }
                        })
                    } while (!r.done);
                P = r.value, kYz(A.command, P.code, P.stdout);
                let s = P.interrupted && w.signal.reason === "interrupt";
                if (J.append((P.stdout || "").trimEnd() + hd1), D = eOq(A.command, P.code, P.stdout || "", P.stderr || ""), P.stderr && P.stderr.includes(".git/index.lock': File exists")) c("tengu_git_index_lock_error", {});
                if (D.isError && !s) {
                    if (X.append(P.stderr.trimEnd() + hd1), P.code !== 0) X.append(`Exit code ${P.code}`)
                } else if (ce(A.command) !== null) X.append(P.stderr.trimEnd() + hd1);
                else J.append(P.stderr.trimEnd() + hd1);
                if (!G) {
                    let T1 = await $();
                    if (OZ6(T1.toolPermissionContext)) {
                        let N1 = X.toString();
                        X.clear(), X.append($Z6(N1))
                    }
                }
                let O1 = b8.annotateStderrWithSandboxFailures(A.command, P.stderr || "");
                if (D.isError && !s) throw new DC(P.stdout, O1, P.code, P.interrupted);
                M = s ? !1 : P.interrupted
            } finally {
                if (_) _(null)
            }
            let f = J.toString(),
                Z = X.toString();
            {
                let l = Aq();
                Ma4(A.command, f, l.signal, q.options.isNonInteractiveSession).then(async (r) => {
                    for (let s of r) {
                        let O1 = XYz(s) ? DYz(s) : jYz(h6(), s);
                        try {
                            if (!(await i5.validateInput({
                                    file_path: O1
                                }, q)).result) {
                                H.delete(O1);
                                continue
                            }
                            await i5.call({
                                file_path: O1
                            }, q)
                        } catch (T1) {
                            H.delete(O1), K1(T1)
                        }
                    }
                    c("tengu_bash_tool_haiku_file_paths_read", {
                        filePathsExtracted: r.length,
                        readFileStateSize: H.size,
                        readFileStateValuesCharLength: Th(H).reduce((s, O1) => {
                            let T1 = H.get(O1);
                            return s + (T1?.content.length || 0)
                        }, 0)
                    })
                }).catch((r) => {
                    if (r instanceof Error && r.message.includes("Request was aborted")) return;
                    K1(r)
                })
            }
            let N = A.command.split(" ")[0];
            c("tengu_bash_tool_command_executed", {
                command_type: N,
                stdout_length: f.length,
                stderr_length: Z.length,
                exit_code: P.code,
                interrupted: M
            });
            let T = un4(A.command);
            if (T) c("tengu_code_indexing_tool_used", {
                tool: T,
                source: "cli",
                success: P.code === 0
            });
            let k = RCA(f),
                y = RCA(Z),
                B = yCA(k),
                S = void 0,
                m = k,
                b = y,
                g = void 0,
                U = ce(A.command);
            if (U !== null) {
                let l = await CYz(f, A.command, U);
                if (l !== null) m = l.stdout, g = l.structuredContent, S = l.rawOutputPath
            }
            let x = m;
            if (B) {
                let l = m.trim().match(/^data:([^;]+);base64,(.+)$/);
                if (l && l[1] && l[2]) {
                    let r = l[1],
                        s = l[2],
                        O1 = Buffer.from(s, "base64"),
                        T1 = await J26(O1, void 0, r);
                    x = `data:${T1.mediaType};base64,${T1.base64}`
                }
            }
            return {
                data: {
                    stdout: x,
                    stderr: b,
                    rawOutputPath: S,
                    interrupted: M,
                    isImage: B,
                    returnCodeInterpretation: D?.message,
                    noOutputExpected: VYz(A.command),
                    backgroundTaskId: P.backgroundTaskId,
                    backgroundedByUser: P.backgroundedByUser,
                    structuredContent: g,
                    dangerouslyDisableSandbox: "dangerouslyDisableSandbox" in A ? A.dangerouslyDisableSandbox : void 0
                }
            }
        },
        renderToolUseErrorMessage: Rb4
    }
})
// @from(Ln 439362, Col 0)
function oZ1(A) {
    if (A !== ie) throw Error("Illegal constructor")
}
// @from(Ln 439366, Col 0)
function ud1(A) {
    return !!A && typeof A.row === "number" && typeof A.column === "number"
}
// @from(Ln 439370, Col 0)
function O_q(A) {
    D6 = A
}
// @from(Ln 439374, Col 0)
function _mA(A, q, K, Y) {
    let z = K - q,
        w = A.textCallback(q, Y);
    if (w) {
        q += w.length;
        while (q < K) {
            let H = A.textCallback(q, Y);
            if (H && H.length > 0) q += H.length, w += H;
            else break
        }
        if (q > K) w = w.slice(0, z)
    }
    return w ?? ""
}
// @from(Ln 439389, Col 0)
function OmA(A, q, K, Y, z) {
    for (let w = 0, H = z.length; w < H; w++) {
        let $ = D6.getValue(K, "i32");
        K += jq;
        let O = KO(q, K);
        K += uN, z[w] = {
            patternIndex: Y,
            name: A.captureNames[$],
            node: O
        }
    }
    return K
}
// @from(Ln 439403, Col 0)
function _5(A, q = 0) {
    let K = r4 + q * uN;
    D6.setValue(K, A.id, "i32"), K += jq, D6.setValue(K, A.startIndex, "i32"), K += jq, D6.setValue(K, A.startPosition.row, "i32"), K += jq, D6.setValue(K, A.startPosition.column, "i32"), K += jq, D6.setValue(K, A[0], "i32")
}
// @from(Ln 439408, Col 0)
function KO(A, q = r4) {
    let K = D6.getValue(q, "i32");
    if (q += jq, K === 0) return null;
    let Y = D6.getValue(q, "i32");
    q += jq;
    let z = D6.getValue(q, "i32");
    q += jq;
    let w = D6.getValue(q, "i32");
    q += jq;
    let H = D6.getValue(q, "i32");
    return new bYz(ie, {
        id: K,
        tree: A,
        startIndex: Y,
        startPosition: {
            row: z,
            column: w
        },
        other: H
    })
}
// @from(Ln 439430, Col 0)
function cw(A, q = r4) {
    D6.setValue(q + 0 * jq, A[0], "i32"), D6.setValue(q + 1 * jq, A[1], "i32"), D6.setValue(q + 2 * jq, A[2], "i32"), D6.setValue(q + 3 * jq, A[3], "i32")
}
// @from(Ln 439434, Col 0)
function vE(A) {
    A[0] = D6.getValue(r4 + 0 * jq, "i32"), A[1] = D6.getValue(r4 + 1 * jq, "i32"), A[2] = D6.getValue(r4 + 2 * jq, "i32"), A[3] = D6.getValue(r4 + 3 * jq, "i32")
}
// @from(Ln 439438, Col 0)
function Wy(A, q) {
    D6.setValue(A, q.row, "i32"), D6.setValue(A + jq, q.column, "i32")
}
// @from(Ln 439442, Col 0)
function t91(A) {
    return {
        row: D6.getValue(A, "i32") >>> 0,
        column: D6.getValue(A + jq, "i32") >>> 0
    }
}
// @from(Ln 439449, Col 0)
function __q(A, q) {
    Wy(A, q.startPosition), A += jF, Wy(A, q.endPosition), A += jF, D6.setValue(A, q.startIndex, "i32"), A += jq, D6.setValue(A, q.endIndex, "i32"), A += jq
}
// @from(Ln 439453, Col 0)
function jT6(A) {
    let q = {};
    return q.startPosition = t91(A), A += jF, q.endPosition = t91(A), A += jF, q.startIndex = D6.getValue(A, "i32") >>> 0, A += jq, q.endIndex = D6.getValue(A, "i32") >>> 0, q
}
// @from(Ln 439458, Col 0)
function J_q(A, q = r4) {
    Wy(q, A.startPosition), q += jF, Wy(q, A.oldEndPosition), q += jF, Wy(q, A.newEndPosition), q += jF, D6.setValue(q, A.startIndex, "i32"), q += jq, D6.setValue(q, A.oldEndIndex, "i32"), q += jq, D6.setValue(q, A.newEndIndex, "i32"), q += jq
}
// @from(Ln 439462, Col 0)
function X_q(A) {
    let q = {};
    return q.major_version = D6.getValue(A, "i32"), A += jq, q.minor_version = D6.getValue(A, "i32"), A += jq, q.field_count = D6.getValue(A, "i32"), q
}
// @from(Ln 439467, Col 0)
function D_q(A, q, K, Y) {
    if (A.length !== 3) throw Error(`Wrong number of arguments to \`#${K}\` predicate. Expected 2, got ${A.length-1}`);
    if (!$_q(A[1])) throw Error(`First argument of \`#${K}\` predicate must be a capture. Got "${A[1].value}"`);
    let z = K === "eq?" || K === "any-eq?",
        w = !K.startsWith("any-");
    if ($_q(A[2])) {
        let H = A[1].name,
            $ = A[2].name;
        Y[q].push((O) => {
            let _ = [],
                J = [];
            for (let D of O) {
                if (D.name === H) _.push(D.node);
                if (D.name === $) J.push(D.node)
            }
            let X = WA((D, j, M) => {
                return M ? D.text === j.text : D.text !== j.text
            }, "compare");
            return w ? _.every((D) => J.some((j) => X(D, j, z))) : _.some((D) => J.some((j) => X(D, j, z)))
        })
    } else {
        let H = A[1].name,
            $ = A[2].value,
            O = WA((J) => J.text === $, "matches"),
            _ = WA((J) => J.text !== $, "doesNotMatch");
        Y[q].push((J) => {
            let X = [];
            for (let j of J)
                if (j.name === H) X.push(j.node);
            let D = z ? O : _;
            return w ? X.every(D) : X.some(D)
        })
    }
}
// @from(Ln 439502, Col 0)
function j_q(A, q, K, Y) {
    if (A.length !== 3) throw Error(`Wrong number of arguments to \`#${K}\` predicate. Expected 2, got ${A.length-1}.`);
    if (A[1].type !== "capture") throw Error(`First argument of \`#${K}\` predicate must be a capture. Got "${A[1].value}".`);
    if (A[2].type !== "string") throw Error(`Second argument of \`#${K}\` predicate must be a string. Got @${A[2].name}.`);
    let z = K === "match?" || K === "any-match?",
        w = !K.startsWith("any-"),
        H = A[1].name,
        $ = new RegExp(A[2].value);
    Y[q].push((O) => {
        let _ = [];
        for (let X of O)
            if (X.name === H) _.push(X.node.text);
        let J = WA((X, D) => {
            return D ? $.test(X) : !$.test(X)
        }, "test");
        if (_.length === 0) return !z;
        return w ? _.every((X) => J(X, z)) : _.some((X) => J(X, z))
    })
}
// @from(Ln 439522, Col 0)
function M_q(A, q, K, Y) {
    if (A.length < 2) throw Error(`Wrong number of arguments to \`#${K}\` predicate. Expected at least 1. Got ${A.length-1}.`);
    if (A[1].type !== "capture") throw Error(`First argument of \`#${K}\` predicate must be a capture. Got "${A[1].value}".`);
    let z = K === "any-of?",
        w = A[1].name,
        H = A.slice(2);
    if (!H.every(JmA)) throw Error(`Arguments to \`#${K}\` predicate must be strings.".`);
    let $ = H.map((O) => O.value);
    Y[q].push((O) => {
        let _ = [];
        for (let J of O)
            if (J.name === w) _.push(J.node.text);
        if (_.length === 0) return !z;
        return _.every((J) => $.includes(J)) === z
    })
}
// @from(Ln 439539, Col 0)
function P_q(A, q, K, Y, z) {
    if (A.length < 2 || A.length > 3) throw Error(`Wrong number of arguments to \`#${K}\` predicate. Expected 1 or 2. Got ${A.length-1}.`);
    if (!A.every(JmA)) throw Error(`Arguments to \`#${K}\` predicate must be strings.".`);
    let w = K === "is?" ? Y : z;
    if (!w[q]) w[q] = {};
    w[q][A[1].value] = A[2]?.value ?? null
}
// @from(Ln 439547, Col 0)
function W_q(A, q, K) {
    if (A.length < 2 || A.length > 3) throw Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${A.length-1}.`);
    if (!A.every(JmA)) throw Error('Arguments to `#set!` predicate must be strings.".');
    if (!K[q]) K[q] = {};
    K[q][A[1].value] = A[2]?.value ?? null
}
// @from(Ln 439554, Col 0)
function G_q(A, q, K, Y, z, w, H, $, O, _, J) {
    if (q === uYz) {
        let X = Y[K];
        w.push({
            type: "capture",
            name: X
        })
    } else if (q === BYz) w.push({
        type: "string",
        value: z[K]
    });
    else if (w.length > 0) {
        if (w[0].type !== "string") throw Error("Predicates must begin with a literal value");
        let X = w[0].value;
        switch (X) {
            case "any-not-eq?":
            case "not-eq?":
            case "any-eq?":
            case "eq?":
                D_q(w, A, X, H);
                break;
            case "any-not-match?":
            case "not-match?":
            case "any-match?":
            case "match?":
                j_q(w, A, X, H);
                break;
            case "not-any-of?":
            case "any-of?":
                M_q(w, A, X, H);
                break;
            case "is?":
            case "is-not?":
                P_q(w, A, X, _, J);
                break;
            case "set!":
                W_q(w, A, O);
                break;
            default:
                $[A].push({
                    operator: X,
                    operands: w.slice(1)
                })
        }
        w.length = 0
    }
}
// @from(Ln 439601, Col 0)
async function Z_q(A) {
    if (!DT6) DT6 = await UYz(A);
    return DT6
}
// @from(Ln 439606, Col 0)
function f_q() {
    return !!DT6
}
// @from(Ln 439609, Col 4)
SYz
// @from(Ln 439609, Col 9)
WA = (A, q) => SYz(A, "name", {
        value: q,
        configurable: !0
    })
// @from(Ln 439613, Col 4)
H_q = 2
// @from(Ln 439614, Col 4)
jq = 4
// @from(Ln 439615, Col 4)
wmA
// @from(Ln 439615, Col 9)
uN
// @from(Ln 439615, Col 13)
jF
// @from(Ln 439615, Col 17)
Bd1
// @from(Ln 439615, Col 22)
le
// @from(Ln 439615, Col 26)
ie
// @from(Ln 439615, Col 30)
D6
// @from(Ln 439615, Col 34)
hYz
// @from(Ln 439615, Col 39)
IYz
// @from(Ln 439615, Col 44)
xYz
// @from(Ln 439615, Col 49)
bYz
// @from(Ln 439615, Col 54)
uYz = 1
// @from(Ln 439616, Col 4)
BYz = 2
// @from(Ln 439617, Col 4)
mYz
// @from(Ln 439617, Col 9)
NE$
// @from(Ln 439617, Col 14)
$_q
// @from(Ln 439617, Col 19)
JmA
// @from(Ln 439617, Col 24)
sI
// @from(Ln 439617, Col 28)
bd1
// @from(Ln 439617, Col 33)
FYz
// @from(Ln 439617, Col 38)
QYz
// @from(Ln 439617, Col 43)
MT6
// @from(Ln 439617, Col 48)
gYz
// @from(Ln 439617, Col 53)
UYz
// @from(Ln 439617, Col 58)
DT6 = null
// @from(Ln 439618, Col 4)
r4
// @from(Ln 439618, Col 8)
HmA
// @from(Ln 439618, Col 13)
$mA
// @from(Ln 439618, Col 18)
md1