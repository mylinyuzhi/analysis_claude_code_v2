
// @from(Ln 371277, Col 0)
class KI {
    static instance;
    baseline = new Map;
    initialized = !1;
    mcpClient;
    lastProcessedTimestamps = new Map;
    rightFileDiagnosticsState = new Map;
    static getInstance() {
        if (!KI.instance) KI.instance = new KI;
        return KI.instance
    }
    initialize(A) {
        if (this.initialized) return;
        this.mcpClient = A, this.initialized = !0
    }
    async shutdown() {
        this.initialized = !1, this.baseline.clear()
    }
    reset() {
        this.baseline.clear(), this.rightFileDiagnosticsState.clear()
    }
    normalizeFileUri(A) {
        let q = ["file://", "_claude_fs_right:", "_claude_fs_left:"],
            K = A;
        for (let Y of q)
            if (A.startsWith(Y)) {
                K = A.slice(Y.length);
                break
            } return eG6(K)
    }
    async ensureFileOpened(A) {
        if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
        try {
            await _h("openFile", {
                filePath: A,
                preview: !1,
                startText: "",
                endText: "",
                selectToEndOfLine: !1,
                makeFrontmost: !1
            }, this.mcpClient)
        } catch (q) {
            K1(q)
        }
    }
    async beforeFileEdited(A) {
        if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
        let q = Date.now();
        try {
            let K = await _h("getDiagnostics", {
                    uri: `file://${A}`
                }, this.mcpClient),
                Y = this.parseDiagnosticResult(K)[0];
            if (Y) {
                if (!oo4(this.normalizeFileUri(A), this.normalizeFileUri(Y.uri))) {
                    K1(new ro4(`Diagnostics file path mismatch: expected ${A}, got ${Y.uri})`));
                    return
                }
                let z = this.normalizeFileUri(A);
                this.baseline.set(z, Y.diagnostics), this.lastProcessedTimestamps.set(z, q)
            } else {
                let z = this.normalizeFileUri(A);
                this.baseline.set(z, []), this.lastProcessedTimestamps.set(z, q)
            }
        } catch (K) {}
    }
    async getNewDiagnostics() {
        if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return [];
        let A = [];
        try {
            let z = await _h("getDiagnostics", {}, this.mcpClient);
            A = this.parseDiagnosticResult(z)
        } catch (z) {
            return []
        }
        let q = A.filter((z) => this.baseline.has(this.normalizeFileUri(z.uri))).filter((z) => z.uri.startsWith("file://")),
            K = new Map;
        A.filter((z) => this.baseline.has(this.normalizeFileUri(z.uri))).filter((z) => z.uri.startsWith("_claude_fs_right:")).forEach((z) => {
            K.set(this.normalizeFileUri(z.uri), z)
        });
        let Y = [];
        for (let z of q) {
            let w = this.normalizeFileUri(z.uri),
                H = this.baseline.get(w) || [],
                $ = K.get(w),
                O = z;
            if ($) {
                let J = this.rightFileDiagnosticsState.get(w);
                if (!J || !this.areDiagnosticArraysEqual(J, $.diagnostics)) O = $;
                this.rightFileDiagnosticsState.set(w, $.diagnostics)
            }
            let _ = O.diagnostics.filter((J) => !H.some((X) => this.areDiagnosticsEqual(J, X)));
            if (_.length > 0) Y.push({
                uri: z.uri,
                diagnostics: _
            });
            this.baseline.set(w, O.diagnostics)
        }
        return Y
    }
    parseDiagnosticResult(A) {
        if (Array.isArray(A)) {
            let q = A.find((K) => K.type === "text");
            if (q && "text" in q) return _A(q.text)
        }
        return []
    }
    areDiagnosticsEqual(A, q) {
        return A.message === q.message && A.severity === q.severity && A.source === q.source && A.code === q.code && A.range.start.line === q.range.start.line && A.range.start.character === q.range.start.character && A.range.end.line === q.range.end.line && A.range.end.character === q.range.end.character
    }
    areDiagnosticArraysEqual(A, q) {
        if (A.length !== q.length) return !1;
        return A.every((K) => q.some((Y) => this.areDiagnosticsEqual(K, Y))) && q.every((K) => A.some((Y) => this.areDiagnosticsEqual(Y, K)))
    }
    isLinterDiagnostic(A) {
        let q = ["eslint", "eslint-plugin", "tslint", "prettier", "stylelint", "jshint", "standardjs", "xo", "rome", "biome", "deno-lint", "rubocop", "pylint", "flake8", "black", "ruff", "clippy", "rustfmt", "golangci-lint", "gofmt", "swiftlint", "detekt", "ktlint", "checkstyle", "pmd", "sonarqube", "sonarjs"];
        if (!A.source) return !1;
        let K = A.source.toLowerCase();
        return q.some((Y) => K.includes(Y))
    }
    async handleQueryStart(A) {
        if (!this.initialized) {
            let q = iV(A);
            if (q) this.initialize(q)
        } else this.reset()
    }
    static formatDiagnosticsSummary(A) {
        let K = A.map((Y) => {
            let z = Y.uri.split("/").pop() || Y.uri,
                w = Y.diagnostics.map((H) => {
                    return `  ${KI.getSeveritySymbol(H.severity)} [Line ${H.range.start.line+1}:${H.range.start.character+1}] ${H.message}${H.code?` [${H.code}]`:""}${H.source?` (${H.source})`:""}`
                }).join(`
`);
            return `${z}:
${w}`
        }).join(`

`);
        if (K.length > no4) return K.slice(0, no4 - 12) + "…[truncated]";
        return K
    }
    static getSeveritySymbol(A) {
        return {
            Error: l1.cross,
            Warning: l1.warning,
            Info: l1.info,
            Hint: l1.star
        } [A] || l1.bullet
    }
}
// @from(Ln 371427, Col 4)
ro4
// @from(Ln 371427, Col 9)
no4 = 4000
// @from(Ln 371428, Col 4)
Fd
// @from(Ln 371429, Col 4)
_51 = v(() => {
    SW();
    q$();
    y6();
    qH();
    b7();
    m6();
    wq();
    ro4 = class ro4 extends CT1 {};
    Fd = KI.getInstance()
})
// @from(Ln 371449, Col 0)
function QBY(A) {
    let q = e(27),
        {
            filePath: K,
            content: Y,
            verbose: z
        } = A,
        {
            columns: w
        } = Z8(),
        H = Y || "(No content)",
        $;
    if (q[0] !== Y) $ = Y.split(so4), q[0] = Y, q[1] = $;
    else $ = q[1];
    let O = $.length,
        _ = O - ao4,
        J;
    if (q[2] !== O) J = sK.createElement(V, {
        bold: !0
    }, O), q[2] = O, q[3] = J;
    else J = q[3];
    let X;
    if (q[4] !== K || q[5] !== z) X = z ? K : to4(h6(), K), q[4] = K, q[5] = z, q[6] = X;
    else X = q[6];
    let D;
    if (q[7] !== X) D = sK.createElement(V, {
        bold: !0
    }, X), q[7] = X, q[8] = D;
    else D = q[8];
    let j;
    if (q[9] !== J || q[10] !== D) j = sK.createElement(V, null, "Wrote ", J, " lines to", " ", D), q[9] = J, q[10] = D, q[11] = j;
    else j = q[11];
    let M;
    if (q[12] !== H || q[13] !== z) M = z ? H : H.split(`
`).slice(0, ao4).join(`
`), q[12] = H, q[13] = z, q[14] = M;
    else M = q[14];
    let P = w - 12,
        W;
    if (q[15] !== K || q[16] !== M || q[17] !== P) W = sK.createElement(I, {
        flexDirection: "column"
    }, sK.createElement(VN, {
        code: M,
        filePath: K,
        width: P
    })), q[15] = K, q[16] = M, q[17] = P, q[18] = W;
    else W = q[18];
    let G;
    if (q[19] !== O || q[20] !== _ || q[21] !== z) G = !z && _ > 0 && sK.createElement(V, {
        dimColor: !0
    }, "… +", _, " ", _ === 1 ? "line" : "lines", " ", O > 0 && sK.createElement(aS, null)), q[19] = O, q[20] = _, q[21] = z, q[22] = G;
    else G = q[22];
    let f;
    if (q[23] !== j || q[24] !== W || q[25] !== G) f = sK.createElement(HA, null, sK.createElement(I, {
        flexDirection: "column"
    }, j, W, G)), q[23] = j, q[24] = W, q[25] = G, q[26] = f;
    else f = q[26];
    return f
}
// @from(Ln 371509, Col 0)
function eo4(A) {
    if (A?.file_path?.startsWith(UM())) return "Updated plan";
    return "Write"
}
// @from(Ln 371514, Col 0)
function kCA(A) {
    if (!A?.file_path) return null;
    return L3(A.file_path)
}
// @from(Ln 371519, Col 0)
function Aa4(A, {
    verbose: q
}) {
    if (!A.file_path) return null;
    if (A.file_path.startsWith(UM())) return "";
    return sK.createElement(AE, {
        filePath: A.file_path
    }, q ? A.file_path : L3(A.file_path))
}
// @from(Ln 371529, Col 0)
function qa4({
    file_path: A,
    content: q
}, {
    style: K,
    verbose: Y
}) {
    try {
        let z = b1(),
            w = mBY(A) ? A : FBY(h6(), A);
        if (!z.existsSync(w)) return sK.createElement(ZW1, {
            file_path: A,
            operation: "write",
            content: q,
            firstLine: q.split(`
`)[0] ?? null,
            verbose: Y
        });
        let $ = AX(w),
            O = z.readFileSync(w, {
                encoding: $
            }),
            _ = kv({
                filePath: A,
                fileContents: O,
                edits: [{
                    old_string: O,
                    new_string: q,
                    replace_all: !1
                }]
            }),
            J = q.split(`
`)[0] ?? null;
        return sK.createElement(ZW1, {
            file_path: A,
            operation: "update",
            patch: _,
            firstLine: J,
            fileContent: O,
            style: K,
            verbose: Y
        })
    } catch (z) {
        return K1(z), sK.createElement(HA, null, sK.createElement(V, null, "(No changes)"))
    }
}
// @from(Ln 371576, Col 0)
function Ka4(A, {
    verbose: q
}) {
    if (!q && typeof A === "string" && C4(A, "tool_use_error")) return sK.createElement(HA, null, sK.createElement(V, {
        color: "error"
    }, "Error writing file"));
    return sK.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 371588, Col 0)
function Ya4() {
    return null
}
// @from(Ln 371592, Col 0)
function za4({
    filePath: A,
    content: q,
    structuredPatch: K,
    type: Y,
    originalFile: z
}, w, {
    style: H,
    verbose: $
}) {
    switch (Y) {
        case "create": {
            if (A.startsWith(UM()) && !$) {
                if (H !== "condensed") return sK.createElement(HA, null, sK.createElement(V, {
                    dimColor: !0
                }, "/plan to preview"))
            } else if (H === "condensed" && !$) {
                let _ = q.split(so4).length;
                return sK.createElement(V, null, "Wrote ", sK.createElement(V, {
                    bold: !0
                }, _), " lines to", " ", sK.createElement(V, {
                    bold: !0
                }, to4(h6(), A)))
            }
            return sK.createElement(QBY, {
                filePath: A,
                content: q,
                verbose: $
            })
        }
        case "update": {
            let O = A.startsWith(UM());
            return sK.createElement(SP6, {
                filePath: A,
                structuredPatch: K,
                firstLine: q.split(`
`)[0] ?? null,
                fileContent: z ?? void 0,
                style: H,
                verbose: $,
                previewHint: O ? "/plan to preview" : void 0
            })
        }
    }
}
// @from(Ln 371637, Col 4)
sK
// @from(Ln 371637, Col 8)
ao4 = 10
// @from(Ln 371638, Col 4)
wa4 = v(() => {
    i1();
    m1();
    RkA();
    CkA();
    fW1();
    Z51();
    eq();
    UO();
    no();
    wq();
    N7();
    wp();
    _8();
    y6();
    N8();
    mX();
    mq();
    sK = o(X1(), 1)
})
// @from(Ln 371662, Col 4)
Ha4 = 16000
// @from(Ln 371663, Col 4)
pBY = "<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with Grep in order to find the line numbers of what you are looking for.</NOTE>"
// @from(Ln 371664, Col 4)
dBY
// @from(Ln 371664, Col 9)
cBY
// @from(Ln 371664, Col 14)
vj
// @from(Ln 371665, Col 4)
Lt = v(() => {
    i7();
    u6();
    Uw6();
    wq();
    SD();
    wp();
    E2();
    Ez();
    _8();
    _51();
    Ot();
    lQ1();
    y6();
    Z6();
    gw6();
    ZN();
    PW1();
    wa4();
    N7();
    U4();
    rQ1();
    Zt();
    dBY = z7(() => u.strictObject({
        file_path: u.string().describe("The absolute path to the file to write (must be absolute, not relative)"),
        content: u.string().describe("The content to write to the file")
    })), cBY = z7(() => u.object({
        type: u.enum(["create", "update"]).describe("Whether a new file was created or an existing file was updated"),
        filePath: u.string().describe("The path to the file that was written"),
        content: u.string().describe("The content that was written to the file"),
        structuredPatch: u.array(xOA).describe("Diff patch showing the changes"),
        originalFile: u.string().nullable().describe("The original file content before the write (null for new files)"),
        gitDiff: u.object({
            filename: u.string(),
            status: u.enum(["modified", "added"]),
            additions: u.number(),
            deletions: u.number(),
            changes: u.number(),
            patch: u.string()
        }).optional()
    })), vj = {
        name: f5,
        maxResultSizeChars: 1e5,
        strict: !0,
        input_examples: [{
            file_path: "/Users/username/project/src/newFile.ts",
            content: "Hello, World!"
        }],
        async description() {
            return "Write a file to the local filesystem."
        },
        userFacingName: eo4,
        getToolUseSummary: kCA,
        getActivityDescription(A) {
            let q = kCA(A);
            return q ? `Writing ${q}` : "Writing file"
        },
        async prompt() {
            return $17()
        },
        isEnabled() {
            return !0
        },
        renderToolUseMessage: Aa4,
        get inputSchema() {
            return dBY()
        },
        get outputSchema() {
            return cBY()
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        getPath(A) {
            return A.file_path
        },
        async checkPermissions(A, q) {
            let K = await q.getAppState();
            return N51(vj, A, K.toolPermissionContext)
        },
        renderToolUseRejectedMessage: qa4,
        renderToolUseErrorMessage: Ka4,
        renderToolUseProgressMessage: Ya4,
        renderToolResultMessage: za4,
        async validateInput({
            file_path: A
        }, q) {
            let K = g4(A),
                Y = await q.getAppState();
            if (Gj(K, Y.toolPermissionContext, "edit", "deny") !== null) return {
                result: !1,
                message: "File is in a directory that is denied by your permission settings.",
                errorCode: 1
            };
            if (K.startsWith("\\\\") || K.startsWith("//")) return {
                result: !0
            };
            if (!b1().existsSync(K)) return {
                result: !0
            };
            let H = q.readFileState.get(K);
            if (!H) return {
                result: !1,
                message: "File has not been read yet. Read it first before writing to it.",
                errorCode: 2
            };
            if (H) {
                if (aW(K) > H.timestamp) return {
                    result: !1,
                    message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
                    errorCode: 3
                }
            }
            return {
                result: !0
            }
        },
        async call({
            file_path: A,
            content: q
        }, {
            readFileState: K,
            updateFileHistoryState: Y,
            dynamicSkillDirTriggers: z
        }, w, H) {
            let $ = g4(A),
                O = gBY($),
                _ = b1(),
                J = h6(),
                X = TW1([$], J);
            if (X.length > 0) {
                for (let Z of X) z?.add(Z);
                vW1(X).catch(() => {})
            }
            EW1([$], J), await Fd.beforeFileEdited($);
            let D = _.existsSync($);
            if (D) {
                let Z = aW($),
                    N = K.get($);
                if (!N || Z > N.timestamp)
                    if (N && N.offset === void 0 && N.limit === void 0) {
                        let k = AX($);
                        if (_.readFileSync($, {
                                encoding: k
                            }).replaceAll(`\r
`, `
`) !== N.content) throw Error(ty1)
                    } else throw Error(ty1)
            }
            let j = D ? AX($) : "utf-8",
                M = D ? _.readFileSync($, {
                    encoding: j
                }) : null;
            if (z2()) await Xt(Y, $, H.uuid);
            let P = D ? Qd($) : await $a4();
            _.mkdirSync(O), ft($, q, j, P);
            let W = md();
            if (W) NP6(`file://${$}`), W.changeFile($, q).catch((Z) => {
                h(`LSP: Failed to notify server of file change for ${$}: ${Z.message}`), K1(Z)
            }), W.saveFile($).catch((Z) => {
                h(`LSP: Failed to notify server of file save for ${$}: ${Z.message}`), K1(Z)
            });
            if (_t($, M, q), K.set($, {
                    content: q,
                    timestamp: aW($),
                    offset: void 0,
                    limit: void 0
                }), $.endsWith(`${UBY}CLAUDE.md`)) c("tengu_write_claudemd", {});
            let G;
            if (process.env.CLAUDE_CODE_ENTRYPOINT === "remote" && !0 && x8("tengu_quartz_lantern", !1)) {
                let Z = Date.now(),
                    N = await xP6($);
                if (N) G = N;
                c("tengu_tool_use_diff_computed", {
                    isWriteTool: !0,
                    durationMs: Date.now() - Z,
                    hasDiff: !!N
                })
            }
            if (M) {
                let Z = kv({
                        filePath: A,
                        fileContents: M,
                        edits: [{
                            old_string: M,
                            new_string: q,
                            replace_all: !1
                        }]
                    }),
                    N = {
                        type: "update",
                        filePath: A,
                        content: q,
                        structuredPatch: Z,
                        originalFile: M,
                        ...G && {
                            gitDiff: G
                        }
                    };
                return ix1(Z), eS({
                    operation: "write",
                    tool: "FileWriteTool",
                    filePath: $,
                    type: "update"
                }), {
                    data: N
                }
            }
            let f = {
                type: "create",
                filePath: A,
                content: q,
                structuredPatch: [],
                originalFile: null,
                ...G && {
                    gitDiff: G
                }
            };
            return ix1([], q), eS({
                operation: "write",
                tool: "FileWriteTool",
                filePath: $,
                type: "create"
            }), {
                data: f
            }
        },
        mapToolResultToToolResultBlockParam({
            filePath: A,
            content: q,
            type: K
        }, Y) {
            switch (K) {
                case "create":
                    return {
                        tool_use_id: Y, type: "tool_result", content: `File created successfully at: ${A}`
                    };
                case "update": {
                    if (x8("tengu_file_write_optimization", !1)) return {
                        tool_use_id: Y,
                        type: "tool_result",
                        content: `The file ${A} has been overwritten successfully.`
                    };
                    return {
                        tool_use_id: Y,
                        type: "tool_result",
                        content: `The file ${A} has been updated. Here's the result of running \`cat -n\` on a snippet of the edited file:
${Sj1({content:q.split(/\r?\n/).length>Ha4?q.split(/\r?\n/).slice(0,Ha4).join(`
`)+pBY:q,startLine:1})}`
                    }
                }
            }
        }
    }
})
// @from(Ln 371923, Col 4)
Xa4 = {}
// @from(Ln 371929, Col 0)
function Oa4(A, q) {
    switch (A) {
        case Jq: {
            let K = i5.inputSchema.safeParse(q);
            return K.success ? K.data.file_path : null
        }
        case bq: {
            let K = Qw6().safeParse(q);
            return K.success ? K.data.file_path : null
        }
        case f5: {
            let K = vj.inputSchema.safeParse(q);
            return K.success ? K.data.file_path : null
        }
        default:
            return null
    }
}
// @from(Ln 371948, Col 0)
function _a4(A, q) {
    switch (A) {
        case Jq: {
            let K = i5.inputSchema.safeParse(q);
            if (!K.success) return null;
            return qB1(K.data.file_path)
        }
        case s9: {
            let K = tS.inputSchema.safeParse(q);
            if (!K.success) return null;
            if (K.data.path) {
                let Y = qB1(K.data.path);
                if (Y) return Y
            }
            if (K.data.glob) {
                let Y = C_6(K.data.glob);
                if (Y) return Y
            }
            return null
        }
        case Jz: {
            let K = WB.inputSchema.safeParse(q);
            if (!K.success) return null;
            if (K.data.path) {
                let z = qB1(K.data.path);
                if (z) return z
            }
            let Y = C_6(K.data.pattern);
            if (Y) return Y;
            return null
        }
        default:
            return null
    }
}
// @from(Ln 371984, Col 0)
function Ja4(A, q) {
    if (_a4(A, q) === "session_memory") return !0;
    let K = Oa4(A, q);
    if (K && S_6(K)) return !0;
    return !1
}
// @from(Ln 371990, Col 0)
async function lBY(A, q, K) {
    if (A.hook_event_name !== "PostToolUse") return {};
    let Y = _a4(A.tool_name, A.tool_input),
        z = nx7(),
        w = z ? {
            subagent_name: z
        } : {};
    if (Y === "session_memory") c("tengu_session_memory_accessed", {
        ...w
    });
    else if (Y === "session_transcript") c("tengu_transcript_accessed", {
        ...w
    });
    let H = Oa4(A.tool_name, A.tool_input);
    if (H && S_6(H)) switch (c("tengu_memdir_accessed", {
            tool: A.tool_name,
            ...w
        }), A.tool_name) {
        case Jq:
            c("tengu_memdir_file_read", {
                ...w
            });
            break;
        case bq:
            c("tengu_memdir_file_edit", {
                ...w
            });
            break;
        case f5:
            c("tengu_memdir_file_write", {
                ...w
            });
            break
    }
    return {}
}
// @from(Ln 372027, Col 0)
function iBY() {
    let A = {
        type: "callback",
        callback: lBY,
        timeout: 1
    };
    O61({
        PostToolUse: [{
            matcher: Jq,
            hooks: [A]
        }, {
            matcher: s9,
            hooks: [A]
        }, {
            matcher: Jz,
            hooks: [A]
        }, {
            matcher: bq,
            hooks: [A]
        }, {
            matcher: f5,
            hooks: [A]
        }]
    })
}
// @from(Ln 372052, Col 4)
LCA = v(() => {
    B6();
    u6();
    _H();
    DW();
    SD();
    YE();
    $01();
    cx1();
    gw6();
    Lt();
    EjA();
    d01()
})
// @from(Ln 372067, Col 0)
function AZ6() {
    if (ON1() === "remote") {
        let H = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
        if (H) {
            let $ = process.env.SESSION_INGRESS_URL;
            if (!$?.includes("localhost")) {
                let O = bw6(H, $);
                return {
                    commit: O,
                    pr: O
                }
            }
        }
        return {
            commit: "",
            pr: ""
        }
    }
    let A = l3(),
        q = gq6(A) !== null,
        K = ck7() || q ? i17(A) : "Claude Opus 4.6",
        Y = `\uD83E\uDD16 Generated with [Claude Code](${mL7})`,
        z = `Co-Authored-By: ${K} <noreply@anthropic.com>`,
        w = l4();
    if (w.attribution) return {
        commit: w.attribution.commit ?? z,
        pr: w.attribution.pr ?? Y
    };
    if (w.includeCoAuthoredBy === !1) return {
        commit: "",
        pr: ""
    };
    return {
        commit: z,
        pr: Y
    }
}
// @from(Ln 372104, Col 4)
qZ6 = v(() => {
    B6();
    p8();
    e7();
    lq();
    AH();
    Mq1();
    LCA();
    y6();
    Z6();
    vz();
    _H();
    DW();
    SD()
})
// @from(Ln 372120, Col 0)
function KZ6(A = process.env) {
    let q = A.BASH_DEFAULT_TIMEOUT_MS;
    if (q) {
        let K = parseInt(q, 10);
        if (!isNaN(K) && K > 0) return K
    }
    return 120000
}
// @from(Ln 372129, Col 0)
function Da4(A = process.env) {
    let q = A.BASH_MAX_TIMEOUT_MS;
    if (q) {
        let K = parseInt(q, 10);
        if (!isNaN(K) && K > 0) return Math.max(K, KZ6(A))
    }
    return Math.max(600000, KZ6(A))
}
// @from(Ln 372138, Col 0)
function $U1() {
    let A = zn1.validate(process.env.BASH_MAX_OUTPUT_LENGTH);
    if (A.status === "capped") h(`BASH_MAX_OUTPUT_LENGTH ${A.message}`);
    return A.effective
}
// @from(Ln 372144, Col 0)
function YZ6() {
    return KZ6()
}
// @from(Ln 372148, Col 0)
function zZ6() {
    return Da4()
}
// @from(Ln 372152, Col 0)
function nBY() {
    if (!b8.isSandboxingEnabled()) return "";
    let A = b8.getFsReadConfig(),
        q = b8.getFsWriteConfig(),
        K = b8.getNetworkRestrictionConfig(),
        Y = b8.getAllowUnixSockets(),
        z = b8.getIgnoreViolations(),
        w = b8.areUnsandboxedCommandsAllowed(),
        H = {
            read: A,
            write: q
        },
        $ = {
            ...K?.allowedHosts && {
                allowedHosts: K.allowedHosts
            },
            ...K?.deniedHosts && {
                deniedHosts: K.deniedHosts
            },
            ...Y && {
                allowUnixSockets: Y
            }
        },
        O = [];
    if (Object.keys(H).length > 0) O.push(`    - Filesystem: ${Q1(H,null,2).split(`
`).join(`
      `)}`);
    if (Object.keys($).length > 0) O.push(`    - Network: ${Q1($,null,2).split(`
`).join(`
      `)}`);
    if (z) O.push(`    - Ignored violations: ${Q1(z,null,2).split(`
`).join(`
      `)}`);
    let _ = O$() ? "    - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true` as they do not work properly in sandboxed mode\n" : "",
        J = w ? `  - CRITICAL: Commands run in sandbox mode by default - do NOT set \`dangerouslyDisableSandbox\`
    - Even if you have recently run commands with \`dangerouslyDisableSandbox: true\`, you MUST NOT continue that pattern
    - VERY IMPORTANT: Do NOT learn from or repeat the pattern of overriding sandbox - each command should run sandboxed by default
${_}    - Set \`dangerouslyDisableSandbox: true\` if:
      1. The user *explicitly* asks to bypass sandbox, OR
      2. A command just failed and you see evidence of sandbox restrictions causing the failure
    - When analyzing failures:
      - Commands can fail for many reasons unrelated to the sandbox (missing files, wrong arguments, network issues, etc.)
      - Evidence of sandbox-caused failures includes:
        - "Operation not permitted" errors for file/network operations
        - Access denied to specific paths outside allowed directories
        - Network connection failures to non-whitelisted hosts
        - Unix socket connection errors
      - Sandbox violation logs can be noisy, but clear permission errors are strong indicators
    - When you see evidence of sandbox-caused failure:
      - IMMEDIATELY retry with \`dangerouslyDisableSandbox: true\` (don't ask, just do it)
      - Briefly explain what sandbox restriction likely caused the failure
      - Mention: "Use \`/sandbox\` to manage restrictions"
      - This will prompt the user for permission
    - Example of normal usage: { "command": "ls", "description": "List files" }
    - Example of override: { "command": "my-tool", "description": "Run my-tool", "dangerouslyDisableSandbox": true }
    - DO NOT suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the allowlist` : "  - CRITICAL: All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter is disabled by policy\n    - Commands cannot run outside the sandbox under any circumstances\n    - If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead";
    return `- Commands run in a sandbox by default with the following restrictions:
${O.join(`
`)}
${J}
  - IMPORTANT: For temporary files, use \`/tmp/claude/\` as your temporary directory
    - The TMPDIR environment variable is automatically set to \`/tmp/claude\` when running in sandbox mode
    - Do NOT use \`/tmp\` directly - use \`/tmp/claude/\` or rely on TMPDIR instead
    - Most programs that respect TMPDIR will automatically use \`/tmp/claude/\``
}
// @from(Ln 372218, Col 0)
function rBY() {
    if (J6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return "";
    return "\n  - You can use the `run_in_background` parameter to run the command in the background. Only use this if you don't need the result immediately and are OK being notified when the command completes later. You do not need to check the output right away - you'll be notified when it finishes. You do not need to use '&' at the end of the command when using this parameter."
}
// @from(Ln 372223, Col 0)
function ja4() {
    return `Executes a given bash command with optional timeout. Working directory persists between commands; shell state (everything else) does not. The shell environment is initialized from the user's profile (bash or zsh).

IMPORTANT: This tool is for terminal operations like git, npm, docker, etc. DO NOT use it for file operations (reading, writing, editing, searching, finding files) - use the specialized tools for this instead.

Before executing the command, please follow these steps:

1. Directory Verification:
   - If the command will create new directories or files, first use \`ls\` to verify the parent directory exists and is the correct location
   - For example, before running "mkdir foo/bar", first use \`ls foo\` to check that "foo" exists and is the intended parent directory

2. Command Execution:
   - Always quote file paths that contain spaces with double quotes (e.g., cd "path with spaces/file.txt")
   - Examples of proper quoting:
     - cd "/Users/name/My Documents" (correct)
     - cd /Users/name/My Documents (incorrect - will fail)
     - python "/path/with spaces/script.py" (correct)
     - python /path/with spaces/script.py (incorrect - will fail)
   - After ensuring proper quoting, execute the command.
   - Capture the output of the command.

Usage notes:
  - The command argument is required.
  - You can specify an optional timeout in milliseconds (up to ${zZ6()}ms / ${zZ6()/60000} minutes). If not specified, commands will timeout after ${YZ6()}ms (${YZ6()/60000} minutes).
  - It is very helpful if you write a clear, concise description of what this command does. For simple commands, keep it brief (5-10 words). For complex commands (piped commands, obscure flags, or anything hard to understand at a glance), add enough context to clarify what it does.
  - If the output exceeds ${$U1()} characters, output will be truncated before being returned to you.
  ${rBY()}
  ${nBY()}
  - Avoid using Bash with the \`find\`, \`grep\`, \`cat\`, \`head\`, \`tail\`, \`sed\`, \`awk\`, or \`echo\` commands, unless explicitly instructed or when these commands are truly necessary for the task. Instead, always prefer using the dedicated tools for these commands:
    - File search: Use ${Jz} (NOT find or ls)
    - Content search: Use ${s9} (NOT grep or rg)
    - Read files: Use ${Jq} (NOT cat/head/tail)
    - Edit files: Use ${bq} (NOT sed/awk)
    - Write files: Use ${f5} (NOT echo >/cat <<EOF)
    - Communication: Output text directly (NOT echo/printf)
  - When issuing multiple commands:
    - If the commands are independent and can run in parallel, make multiple ${h4} tool calls in a single message. For example, if you need to run "git status" and "git diff", send a single message with two ${h4} tool calls in parallel.
    - If the commands depend on each other and must run sequentially, use a single ${h4} call with '&&' to chain them together (e.g., \`git add . && git commit -m "message" && git push\`). For instance, if one operation must complete before another starts (like mkdir before cp, Write before Bash for git operations, or git add before git commit), run these operations sequentially instead.
    - Use ';' only when you need to run commands sequentially but don't care if earlier commands fail
    - DO NOT use newlines to separate commands (newlines are ok in quoted strings)
  - Try to maintain your current working directory throughout the session by using absolute paths and avoiding usage of \`cd\`. You may use \`cd\` if the User explicitly requests it.
    <good-example>
    pytest /foo/bar/tests
    </good-example>
    <bad-example>
    cd /foo/bar && pytest tests
    </bad-example>

${oBY()}`
}
// @from(Ln 372274, Col 0)
function oBY() {
    let A = "You can call multiple tools in a single response. When multiple independent pieces of information are requested and all commands are likely to succeed, run multiple tool calls in parallel for optimal performance.",
        {
            commit: q,
            pr: K
        } = AZ6();
    return `# Committing changes with git

Only create commits when requested by the user. If unclear, ask first. When the user asks you to create a new git commit, follow these steps carefully:

Git Safety Protocol:
- NEVER update the git config
- NEVER run destructive git commands (push --force, reset --hard, checkout ., restore ., clean -f, branch -D) unless the user explicitly requests these actions. Taking unauthorized destructive actions is unhelpful and can result in lost work, so it's best to ONLY run these commands when given direct instructions 
- NEVER skip hooks (--no-verify, --no-gpg-sign, etc) unless the user explicitly requests it
- NEVER run force push to main/master, warn the user if they request it
- CRITICAL: Always create NEW commits rather than amending, unless the user explicitly requests a git amend. When a pre-commit hook fails, the commit did NOT happen — so --amend would modify the PREVIOUS commit, which may result in destroying work or losing previous changes. Instead, after hook failure, fix the issue, re-stage, and create a NEW commit
- When staging files, prefer adding specific files by name rather than using "git add -A" or "git add .", which can accidentally include sensitive files (.env, credentials) or large binaries
- NEVER commit changes unless the user explicitly asks you to. It is VERY IMPORTANT to only commit when explicitly asked, otherwise the user will feel that you are being too proactive

1. ${A} run the following bash commands in parallel, each using the ${h4} tool:
  - Run a git status command to see all untracked files. IMPORTANT: Never use the -uall flag as it can cause memory issues on large repos.
  - Run a git diff command to see both staged and unstaged changes that will be committed.
  - Run a git log command to see recent commit messages, so that you can follow this repository's commit message style.
2. Analyze all staged changes (both previously staged and newly added) and draft a commit message:
  - Summarize the nature of the changes (eg. new feature, enhancement to an existing feature, bug fix, refactoring, test, docs, etc.). Ensure the message accurately reflects the changes and their purpose (i.e. "add" means a wholly new feature, "update" means an enhancement to an existing feature, "fix" means a bug fix, etc.).
  - Do not commit files that likely contain secrets (.env, credentials.json, etc). Warn the user if they specifically request to commit those files
  - Draft a concise (1-2 sentences) commit message that focuses on the "why" rather than the "what"
  - Ensure it accurately reflects the changes and their purpose
3. ${A} run the following commands:
   - Add relevant untracked files to the staging area.
   - Create the commit with a message${q?` ending with:
   ${q}`:"."}
   - Run git status after the commit completes to verify success.
   Note: git status depends on the commit completing, so run it sequentially after the commit.
4. If the commit fails due to pre-commit hook: fix the issue and create a NEW commit

Important notes:
- NEVER run additional commands to read or explore code, besides git bash commands
- NEVER use the ${bO.name} or ${fK} tools
- DO NOT push to the remote repository unless the user explicitly asks you to do so
- IMPORTANT: Never use git commands with the -i flag (like git rebase -i or git add -i) since they require interactive input which is not supported.
- IMPORTANT: Do not use --no-edit with git rebase commands, as the --no-edit flag is not a valid option for git rebase.
- If there are no changes to commit (i.e., no untracked files and no modifications), do not create an empty commit
- In order to ensure good formatting, ALWAYS pass the commit message via a HEREDOC, a la this example:
<example>
git commit -m "$(cat <<'EOF'
   Commit message here.${q?`

   ${q}`:""}
   EOF
   )"
</example>

# Creating pull requests
Use the gh command via the Bash tool for ALL GitHub-related tasks including working with issues, pull requests, checks, and releases. If given a Github URL use the gh command to get the information needed.

IMPORTANT: When the user asks you to create a pull request, follow these steps carefully:

1. ${A} run the following bash commands in parallel using the ${h4} tool, in order to understand the current state of the branch since it diverged from the main branch:
   - Run a git status command to see all untracked files (never use -uall flag)
   - Run a git diff command to see both staged and unstaged changes that will be committed
   - Check if the current branch tracks a remote branch and is up to date with the remote, so you know if you need to push to the remote
   - Run a git log command and \`git diff [base-branch]...HEAD\` to understand the full commit history for the current branch (from the time it diverged from the base branch)
2. Analyze all changes that will be included in the pull request, making sure to look at all relevant commits (NOT just the latest commit, but ALL commits that will be included in the pull request!!!), and draft a pull request title and summary:
   - Keep the PR title short (under 70 characters)
   - Use the description/body for details, not the title
3. ${A} run the following commands in parallel:
   - Create new branch if needed
   - Push to remote with -u flag if needed
   - Create PR using gh pr create with the format below. Use a HEREDOC to pass the body to ensure correct formatting.
<example>
gh pr create --title "the pr title" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points>

## Test plan
[Bulleted markdown checklist of TODOs for testing the pull request...]${K?`

${K}`:""}
EOF
)"
</example>

Important:
- DO NOT use the ${bO.name} or ${fK} tools
- Return the PR URL when you're done, so the user can see it

# Other common operations
- View comments on a Github PR: gh api repos/foo/bar/pulls/123/comments`
}
// @from(Ln 372364, Col 4)
wZ6 = v(() => {
    DW();
    _H();
    SD();
    r_1();
    qZ6();
    Z6();
    aV1();
    k2();
    Tj();
    m6();
    hA();
    ov()
})
// @from(Ln 372379, Col 0)
function RCA(A) {
    let q = A.split(`
`),
        K = 0;
    while (K < q.length && q[K]?.trim() === "") K++;
    let Y = q.length - 1;
    while (Y >= 0 && q[Y]?.trim() === "") Y--;
    if (K > Y) return "";
    return q.slice(K, Y + 1).join(`
`)
}
// @from(Ln 372391, Col 0)
function yCA(A) {
    return /^data:image\/[a-z0-9.+_-]+;base64,/i.test(A)
}
// @from(Ln 372395, Col 0)
function HZ6(A) {
    let q = yCA(A);
    if (q) return {
        totalLines: 1,
        truncatedContent: A,
        isImage: q
    };
    let K = $U1();
    if (A.length <= K) return {
        totalLines: A.split(`
`).length,
        truncatedContent: A,
        isImage: q
    };
    let Y = A.slice(0, K),
        z = A.slice(K).split(`
`).length,
        w = `${Y}

... [${z} lines truncated] ...`;
    return {
        totalLines: A.split(`
`).length,
        truncatedContent: w,
        isImage: q
    }
}
// @from(Ln 372423, Col 0)
function OZ6(A) {
    if (TR6() || !EI(h6(), A)) {
        if (lZ(y8()), !TR6()) return c("tengu_bash_tool_reset_to_original_dir", {}), !0
    }
    return !1
}
// @from(Ln 372429, Col 0)
async function Ma4(A, q, K, Y) {
    let z = q.length > px1 ? q.slice(0, px1) + `
... [output truncated]` : q,
        H = (await SX({
            systemPrompt: [`Extract any file paths that this command reads or modifies. For commands like "git diff" and "cat", include the paths of files being shown. Use paths verbatim -- don't add any slashes or try to resolve them. Do not try to infer paths that were not explicitly listed in the command output.

IMPORTANT: Commands that do not display the contents of the files should not return any filepaths. For eg. "ls", pwd", "find". Even more complicated commands that don't display the contents should not be considered: eg "find . -type f -exec ls -la {} + | sort -k5 -nr | head -5"

First, determine if the command displays the contents of the files. If it does, then <is_displaying_contents> tag should be true. If it does not, then <is_displaying_contents> tag should be false.

Format your response as:
<is_displaying_contents>
true
</is_displaying_contents>

<filepaths>
path/to/file1
path/to/file2
</filepaths>

If no files are read or modified, return empty filepaths tags:
<filepaths>
</filepaths>

Do not include any other text in your response.`],
            userPrompt: `Command: ${A}
Output: ${z}`,
            signal: K,
            options: {
                enablePromptCaching: !0,
                querySource: "bash_extract_command_paths",
                agents: [],
                isNonInteractiveSession: Y,
                hasAppendSystemPrompt: !1,
                mcpTools: []
            }
        })).message.content.filter(($) => $.type === "text").map(($) => $.text).join("");
    return C4(H, "filepaths")?.trim().split(`
`).filter(Boolean) || []
}
// @from(Ln 372470, Col 0)
function Pa4(A) {
    let q = [],
        K = 0,
        Y = 0;
    for (let w of A)
        if (w.type === "image") Y++;
        else if (w.type === "text" && "text" in w) {
        K++;
        let H = w.text.slice(0, 200);
        q.push(H + (w.text.length > 200 ? "..." : ""))
    }
    let z = [];
    if (Y > 0) z.push(`[${Y} image${Y>1?"s":""}]`);
    if (K > 0) z.push(`[${K} text block${K>1?"s":""}]`);
    return `MCP Result: ${z.join(", ")}${q.length>0?`

`+q.join(`

`):""}`
}
// @from(Ln 372490, Col 4)
$Z6 = (A) => `${A.trim()}
Shell cwd was reset to ${y8()}`
// @from(Ln 372492, Col 4)
GG1 = v(() => {
    hA();
    yw();
    N8();
    wZ6();
    E2();
    B6();
    u6();
    N7();
    VI()
})
// @from(Ln 372504, Col 0)
function CCA(A) {
    if (!A) return "";
    let q = Array.isArray(A) ? A.join("") : A,
        {
            truncatedContent: K
        } = HZ6(q);
    return K
}
// @from(Ln 372513, Col 0)
function aBY(A) {
    if (typeof A["image/png"] === "string") return {
        image_data: A["image/png"].replace(/\s/g, ""),
        media_type: "image/png"
    };
    if (typeof A["image/jpeg"] === "string") return {
        image_data: A["image/jpeg"].replace(/\s/g, ""),
        media_type: "image/jpeg"
    };
    return
}
// @from(Ln 372525, Col 0)
function sBY(A) {
    switch (A.output_type) {
        case "stream":
            return {
                output_type: A.output_type, text: CCA(A.text)
            };
        case "execute_result":
        case "display_data":
            return {
                output_type: A.output_type, text: CCA(A.data?.["text/plain"]), image: A.data && aBY(A.data)
            };
        case "error":
            return {
                output_type: A.output_type, text: CCA(`${A.ename}: ${A.evalue}
${A.traceback.join(`
`)}`)
            }
    }
}
// @from(Ln 372545, Col 0)
function Wa4(A, q, K, Y) {
    let z = A.id ?? `cell-${q}`,
        w = {
            cellType: A.cell_type,
            source: Array.isArray(A.source) ? A.source.join("") : A.source,
            execution_count: A.cell_type === "code" ? A.execution_count || void 0 : void 0,
            cell_id: z
        };
    if (A.cell_type === "code") w.language = K;
    if (A.cell_type === "code" && A.outputs?.length) {
        let H = A.outputs.map(sBY);
        if (!Y && Q1(H).length > 1e4) w.outputs = [{
            output_type: "stream",
            text: `Outputs are too large to include. Use ${h4} with: cat <notebook_path> | jq '.cells[${q}].outputs'`
        }];
        else w.outputs = H
    }
    return w
}
// @from(Ln 372565, Col 0)
function tBY(A) {
    let q = [];
    if (A.cellType !== "code") q.push(`<cell_type>${A.cellType}</cell_type>`);
    if (A.language !== "python" && A.cellType === "code") q.push(`<language>${A.language}</language>`);
    return {
        text: `<cell id="${A.cell_id}">${q.join("")}${A.source}</cell id="${A.cell_id}">`,
        type: "text"
    }
}
// @from(Ln 372575, Col 0)
function eBY(A) {
    let q = [];
    if (A.text) q.push({
        text: `
${A.text}`,
        type: "text"
    });
    if (A.image) q.push({
        type: "image",
        source: {
            data: A.image.image_data,
            media_type: A.image.media_type,
            type: "base64"
        }
    });
    return q
}
// @from(Ln 372593, Col 0)
function AmY(A) {
    let q = tBY(A),
        K = A.outputs?.flatMap(eBY);
    return [q, ...K ?? []]
}
// @from(Ln 372599, Col 0)
function Ga4(A, q) {
    let K = g4(A),
        Y = b1().readFileSync(K, {
            encoding: "utf-8"
        }),
        z = _A(Y),
        w = z.metadata.language_info?.name ?? "python";
    if (q) {
        let H = z.cells.find(($) => $.id === q);
        if (!H) throw Error(`Cell with ID "${q}" not found in notebook`);
        return [Wa4(H, z.cells.indexOf(H), w, !0)]
    }
    return z.cells.map((H, $) => Wa4(H, $, w, !1))
}
// @from(Ln 372614, Col 0)
function Za4(A, q) {
    let K = A.flatMap(AmY);
    return {
        tool_use_id: q,
        type: "tool_result",
        content: K.reduce((Y, z) => {
            if (Y.length === 0) return [z];
            let w = Y[Y.length - 1];
            if (w && w.type === "text" && z.type === "text") return w.text += `
` + z.text, Y;
            return Y.push(z), Y
        }, [])
    }
}
// @from(Ln 372629, Col 0)
function sQ1(A) {
    let q = A.match(/^cell-(\d+)$/);
    if (q && q[1]) {
        let K = parseInt(q[1], 10);
        return isNaN(K) ? void 0 : K
    }
    return
}
// @from(Ln 372637, Col 4)
FP6 = v(() => {
    GG1();
    Ez();
    _8();
    m6()
})
// @from(Ln 372644, Col 0)
function _Z6(A) {
    let q = `${eu1()}/`,
        K = ".output";
    if (A.startsWith(q) && A.endsWith(".output")) {
        let Y = A.slice(q.length, -7);
        if (Y.length > 0 && Y.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(Y)) return Y
    }
    return null
}
// @from(Ln 372654, Col 0)
function fa4({
    file_path: A,
    offset: q,
    limit: K,
    pages: Y
}, {
    verbose: z
}) {
    if (!A) return null;
    if (_Z6(A)) return "";
    let w = z ? A : L3(A);
    if (Y) return XK.createElement(XK.Fragment, null, XK.createElement(AE, {
        filePath: A
    }, w), ` · pages ${Y}`);
    if (z && (q || K)) {
        let H = q ?? 1,
            $ = K ? `lines ${H}-${H+K-1}` : `from line ${H}`;
        return XK.createElement(XK.Fragment, null, XK.createElement(AE, {
            filePath: A
        }, w), ` · ${$}`)
    }
    return XK.createElement(AE, {
        filePath: A
    }, w)
}
// @from(Ln 372680, Col 0)
function Va4({
    file_path: A
}) {
    let q = A ? _Z6(A) : null;
    if (!q) return null;
    return XK.createElement(V, {
        dimColor: !0
    }, " ", q)
}
// @from(Ln 372690, Col 0)
function Na4() {
    return null
}
// @from(Ln 372694, Col 0)
function Ta4(A) {
    switch (A.type) {
        case "image": {
            let {
                originalSize: q
            } = A.file, K = L2(q);
            return XK.createElement(HA, {
                height: 1
            }, XK.createElement(V, null, "Read image (", K, ")"))
        }
        case "notebook": {
            let {
                cells: q
            } = A.file;
            if (!q || q.length < 1) return XK.createElement(V, {
                color: "error"
            }, "No cells found in notebook");
            return XK.createElement(HA, {
                height: 1
            }, XK.createElement(V, null, "Read ", XK.createElement(V, {
                bold: !0
            }, q.length), " cells"))
        }
        case "pdf": {
            let {
                originalSize: q
            } = A.file, K = L2(q);
            return XK.createElement(HA, {
                height: 1
            }, XK.createElement(V, null, "Read PDF (", K, ")"))
        }
        case "parts":
            return XK.createElement(HA, {
                height: 1
            }, XK.createElement(V, null, "Read ", XK.createElement(V, {
                bold: !0
            }, A.file.count), " ", A.file.count === 1 ? "page" : "pages", " (", L2(A.file.originalSize), ")"));
        case "text": {
            let {
                numLines: q
            } = A.file;
            return XK.createElement(HA, {
                height: 1
            }, XK.createElement(V, null, "Read ", XK.createElement(V, {
                bold: !0
            }, q), " ", q === 1 ? "line" : "lines"))
        }
    }
}
// @from(Ln 372744, Col 0)
function va4() {
    return XK.createElement(Y9, null)
}
// @from(Ln 372748, Col 0)
function Ea4(A, {
    verbose: q
}) {
    if (!q && typeof A === "string" && C4(A, "tool_use_error")) return XK.createElement(HA, null, XK.createElement(V, {
        color: "error"
    }, "Error reading file"));
    return XK.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 372760, Col 0)
function ka4(A) {
    if (A?.file_path?.startsWith(UM())) return "Reading Plan";
    if (A?.file_path && _Z6(A.file_path)) return "Read agent output";
    return "Read"
}
// @from(Ln 372766, Col 0)
function SCA(A) {
    if (!A?.file_path) return null;
    let q = _Z6(A.file_path);
    if (q) return q;
    return L3(A.file_path)
}
// @from(Ln 372772, Col 4)
XK
// @from(Ln 372773, Col 4)
La4 = v(() => {
    m1();
    CX();
    UO();
    fW1();
    eq();
    wq();
    N8();
    mX();
    hZ();
    XK = o(X1(), 1)
})
// @from(Ln 372791, Col 0)
function Ra4(A) {
    let q = b1();
    if (q.existsSync(A)) return A;
    let K = l51.basename(A),
        Y = /^(.+)([ \u202F])(AM|PM)(\.png)$/,
        z = K.match(Y);
    if (z) {
        let w = z[2],
            H = w === " " ? YmY : " ",
            $ = A.replace(`${w}${z[3]}${z[4]}`, `${H}${z[3]}${z[4]}`);
        if (q.existsSync($)) return $
    }
    return A
}
// @from(Ln 372806, Col 0)
function ICA() {
    let A = process.env.CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS;
    if (A) {
        let q = parseInt(A, 10);
        if (!isNaN(q) && q > 0) return q
    }
    return wmY
}
// @from(Ln 372815, Col 0)
function $mY(A) {
    let q = O8();
    if (!A.startsWith(q)) return null;
    let K = A.split(KmY.sep).join(qmY.sep);
    if (K.includes("/session-memory/") && K.endsWith(".md")) return "session_memory";
    if (K.includes("/projects/") && K.endsWith(".jsonl")) return "session_transcript";
    return null
}
// @from(Ln 372824, Col 0)
function jmY() {
    return !0
}
// @from(Ln 372827, Col 0)
async function ya4(A, q, {
    maxSizeBytes: K = OU1,
    maxTokens: Y
}) {
    let z = Y ?? ICA();
    if (!JZ6.has(q) && A.length > K) throw Error(hCA(A.length, K));
    let w = wL7(A, q);
    if (!w || w <= z / 4) return;
    let $ = await zL7(A) ?? w;
    if ($ > z) throw new qG6($, z)
}
// @from(Ln 372839, Col 0)
function XZ6(A, q, K, Y) {
    return {
        type: "image",
        file: {
            base64: A.toString("base64"),
            type: `image/${q}`,
            originalSize: K,
            dimensions: Y
        }
    }
}
// @from(Ln 372850, Col 0)
async function MmY(A, q) {
    let Y = b1().statSync(A).size,
        z = b1().readFileBytesSync(A),
        w = PD1(z);
    try {
        let H = await sT7(z, q, w);
        return {
            type: "image",
            file: {
                base64: H.base64,
                type: H.mediaType,
                originalSize: Y
            }
        }
    } catch (H) {
        K1(H);
        try {
            let $ = await Promise.resolve().then(() => o(oHA(), 1)),
                _ = await ($.default || $)(z).resize(400, 400, {
                    fit: "inside",
                    withoutEnlargement: !0
                }).jpeg({
                    quality: 20
                }).toBuffer();
            return XZ6(_, "jpeg", Y)
        } catch ($) {
            K1($);
            let O = w.split("/")[1] || "png";
            return XZ6(z, O, Y)
        }
    }
}
// @from(Ln 372882, Col 0)
async function PmY(A, q) {
    let Y = b1().statSync(A).size;
    if (Y === 0) throw Error(`Image file is empty: ${A}`);
    let z = b1().readFileBytesSync(A),
        H = PD1(z).split("/")[1] || "png";
    try {
        let $ = await eu(z, Y, H);
        return XZ6($.buffer, $.mediaType, Y, $.dimensions)
    } catch ($) {
        return K1($), XZ6(z, H, Y)
    }
}
// @from(Ln 372894, Col 0)
async function vyA(A, q = ICA(), K = A.split(".").pop()?.toLowerCase() || "png") {
    let Y = await PmY(A, K);
    if (Math.ceil(Y.file.base64.length * 0.125) > q) return await MmY(A, q);
    return Y
}
// @from(Ln 372899, Col 4)
YmY
// @from(Ln 372899, Col 9)
zmY
// @from(Ln 372899, Col 14)
wmY = 25000
// @from(Ln 372900, Col 4)
qG6
// @from(Ln 372900, Col 9)
JZ6
// @from(Ln 372900, Col 14)
HmY
// @from(Ln 372900, Col 19)
OmY
// @from(Ln 372900, Col 24)
_mY
// @from(Ln 372900, Col 29)
JmY
// @from(Ln 372900, Col 34)
i5
// @from(Ln 372900, Col 38)
XmY = `

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
`
// @from(Ln 372906, Col 4)
DmY
// @from(Ln 372906, Col 9)
hCA = (A, q = OU1) => `File content (${L2(A)}) exceeds maximum allowed size (${L2(q)}). Please use offset and limit parameters to read specific portions of the file, or use the GrepTool to search for specific content.`
// @from(Ln 372907, Col 4)
YE = v(() => {
    i7();
    N7();
    B6();
    hA();
    dL();
    wq();
    Ez();
    FP6();
    y6();
    _H();
    E2();
    Vq6();
    fyA();
    o41();
    N8();
    vv();
    _8();
    La4();
    Uw6();
    u6();
    e7();
    wq();
    m6();
    Zt();
    YmY = String.fromCharCode(8239);
    zmY = [];
    qG6 = class qG6 extends Error {
        tokenCount;
        maxTokens;
        constructor(A, q) {
            super(`File content (${A} tokens) exceeds maximum allowed tokens (${q}). Please use offset and limit parameters to read specific portions of the file, or use the GrepTool to search for specific content.`);
            this.tokenCount = A;
            this.maxTokens = q;
            this.name = "MaxFileReadTokenExceededError"
        }
    };
    JZ6 = new Set(["png", "jpg", "jpeg", "gif", "webp"]), HmY = new Set(["mp3", "wav", "flac", "ogg", "aac", "m4a", "wma", "aiff", "opus", "mp4", "avi", "mov", "wmv", "flv", "mkv", "webm", "m4v", "mpeg", "mpg", "zip", "rar", "tar", "gz", "bz2", "7z", "xz", "z", "tgz", "iso", "exe", "dll", "so", "dylib", "app", "msi", "deb", "rpm", "bin", "dat", "db", "sqlite", "sqlite3", "mdb", "idx", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp", "ttf", "otf", "woff", "woff2", "eot", "psd", "ai", "eps", "sketch", "fig", "xd", "blend", "obj", "3ds", "max", "class", "jar", "war", "pyc", "pyo", "rlib", "swf", "fla"]);
    OmY = z7(() => u.strictObject({
        file_path: u.string().describe("The absolute path to the file to read"),
        offset: u.number().optional().describe("The line number to start reading from. Only provide if the file is too large to read at once"),
        limit: u.number().optional().describe("The number of lines to read. Only provide if the file is too large to read at once."),
        pages: u.string().optional().describe(`Page range for PDF files (e.g., "1-5", "3", "10-20"). Only applicable to PDF files. Maximum ${wD1} pages per request.`)
    })), _mY = u.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]), JmY = z7(() => u.discriminatedUnion("type", [u.object({
        type: u.literal("text"),
        file: u.object({
            filePath: u.string().describe("The path to the file that was read"),
            content: u.string().describe("The content of the file"),
            numLines: u.number().describe("Number of lines in the returned content"),
            startLine: u.number().describe("The starting line number"),
            totalLines: u.number().describe("Total number of lines in the file")
        })
    }), u.object({
        type: u.literal("image"),
        file: u.object({
            base64: u.string().describe("Base64-encoded image data"),
            type: _mY.describe("The MIME type of the image"),
            originalSize: u.number().describe("Original file size in bytes"),
            dimensions: u.object({
                originalWidth: u.number().optional().describe("Original image width in pixels"),
                originalHeight: u.number().optional().describe("Original image height in pixels"),
                displayWidth: u.number().optional().describe("Displayed image width in pixels (after resizing)"),
                displayHeight: u.number().optional().describe("Displayed image height in pixels (after resizing)")
            }).optional().describe("Image dimension info for coordinate mapping")
        })
    }), u.object({
        type: u.literal("notebook"),
        file: u.object({
            filePath: u.string().describe("The path to the notebook file"),
            cells: u.array(u.any()).describe("Array of notebook cells")
        })
    }), u.object({
        type: u.literal("pdf"),
        file: u.object({
            filePath: u.string().describe("The path to the PDF file"),
            base64: u.string().describe("Base64-encoded PDF data"),
            originalSize: u.number().describe("Original file size in bytes")
        })
    }), u.object({
        type: u.literal("parts"),
        file: u.object({
            filePath: u.string().describe("The path to the PDF file"),
            originalSize: u.number().describe("Original file size in bytes"),
            count: u.number().describe("Number of pages extracted"),
            outputDir: u.string().describe("Directory containing extracted page images")
        })
    })])), i5 = {
        name: Jq,
        maxResultSizeChars: 1e5,
        strict: !0,
        input_examples: [{
            file_path: "/Users/username/project/src/index.ts"
        }, {
            file_path: "/Users/username/project/README.md",
            limit: 100,
            offset: 50
        }],
        async description() {
            return pe8
        },
        async prompt() {
            return de8
        },
        get inputSchema() {
            return OmY()
        },
        get outputSchema() {
            return JmY()
        },
        userFacingName: ka4,
        getToolUseSummary: SCA,
        getActivityDescription(A) {
            let q = SCA(A);
            return q ? `Reading ${q}` : "Reading file"
        },
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        isSearchOrReadCommand() {
            return {
                isSearch: !1,
                isRead: !0
            }
        },
        getPath({
            file_path: A
        }) {
            return A || h6()
        },
        async checkPermissions(A, q) {
            let K = await q.getAppState();
            return ro(i5, A, K.toolPermissionContext)
        },
        renderToolUseMessage: fa4,
        renderToolUseTag: Va4,
        renderToolUseProgressMessage: Na4,
        renderToolResultMessage: Ta4,
        renderToolUseRejectedMessage: va4,
        renderToolUseErrorMessage: Ea4,
        async validateInput({
            file_path: A,
            offset: q,
            limit: K,
            pages: Y
        }, z) {
            if (Y !== void 0) {
                let W = l8A(Y);
                if (!W) return {
                    result: !1,
                    message: `Invalid pages parameter: "${Y}". Use formats like "1-5", "3", or "10-20". Pages are 1-indexed.`,
                    errorCode: 7
                };
                if ((W.lastPage === 1 / 0 ? wD1 + 1 : W.lastPage - W.firstPage + 1) > wD1) return {
                    result: !1,
                    message: `Page range "${Y}" exceeds maximum of ${wD1} pages per request. Please use a smaller range.`,
                    errorCode: 8
                }
            }
            let w = b1(),
                H = g4(A),
                $ = await z.getAppState();
            if (Gj(H, $.toolPermissionContext, "read", "deny") !== null) return {
                result: !1,
                message: "File is in a directory that is denied by your permission settings.",
                errorCode: 1
            };
            if (H.startsWith("\\\\") || H.startsWith("//")) return {
                result: !0
            };
            let J = Ra4(H);
            if (!w.existsSync(J)) {
                let W = mP6(H),
                    G = "File does not exist.",
                    f = h6(),
                    Z = y8();
                if (f !== Z) G += ` Current working directory: ${f}`;
                if (W) G += ` Did you mean ${W}?`;
                return {
                    result: !1,
                    message: G,
                    errorCode: 2
                }
            }
            let X = l51.extname(H).toLowerCase();
            if (HmY.has(X.slice(1)) && !s81(X)) return {
                result: !1,
                message: `This tool cannot read binary files. The file appears to be a binary ${X} file. Please use appropriate tools for binary file analysis.`,
                errorCode: 4
            };
            let j = w.statSync(J).size;
            if (j === 0) {
                if (JZ6.has(X.slice(1))) return {
                    result: !1,
                    message: "Empty image files cannot be processed.",
                    errorCode: 5
                }
            }
            let M = X === ".ipynb",
                P = s81(X);
            if (!JZ6.has(X.slice(1)) && !M && !P) {
                if (!KG6(H) && !q && !K) return {
                    result: !1,
                    message: hCA(j),
                    meta: {
                        fileSize: j
                    },
                    errorCode: 6
                }
            }
            return {
                result: !0
            }
        },
        async call({
            file_path: A,
            offset: q = 1,
            limit: K = void 0,
            pages: Y
        }, z) {
            let {
                readFileState: w,
                fileReadingLimits: H
            } = z, $ = H?.maxSizeBytes ?? OU1, O = H?.maxTokens ?? ICA(), _ = l51.extname(A).toLowerCase().slice(1), J = g4(A), X = Ra4(J), D = h6(), j = TW1([J], D);
            if (j.length > 0) {
                for (let N of j) z.dynamicSkillDirTriggers?.add(N);
                vW1(j).catch(() => {})
            }
            if (EW1([J], D), _ === "ipynb") {
                let N = Ga4(X),
                    T = Q1(N);
                if (T.length > $) throw Error(`Notebook content (${L2(T.length)}) exceeds maximum allowed size (${L2($)}). Use ${h4} with jq to read specific portions:
  cat "${A}" | jq '.cells[:20]' # First 20 cells
  cat "${A}" | jq '.cells[100:120]' # Cells 100-120
  cat "${A}" | jq '.cells | length' # Count total cells
  cat "${A}" | jq '.cells[] | select(.cell_type=="code") | .source' # All code sources`);
                await ya4(T, _, {
                    maxSizeBytes: $,
                    maxTokens: O
                }), w.set(J, {
                    content: T,
                    timestamp: aW(X),
                    offset: q,
                    limit: K
                }), z.nestedMemoryAttachmentTriggers?.add(J);
                let k = {
                    type: "notebook",
                    file: {
                        filePath: A,
                        cells: N
                    }
                };
                return eS({
                    operation: "read",
                    tool: "FileReadTool",
                    filePath: J,
                    content: T
                }), {
                    data: k
                }
            }
            if (JZ6.has(_)) {
                let N = await vyA(X, O, _);
                z.nestedMemoryAttachmentTriggers?.add(J), eS({
                    operation: "read",
                    tool: "FileReadTool",
                    filePath: J,
                    content: N.file.base64
                });
                let T = N.file.dimensions ? WD1(N.file.dimensions) : null;
                return {
                    data: N,
                    ...T && {
                        newMessages: [c6({
                            content: T,
                            isMeta: !0
                        })]
                    }
                }
            }
            if (s81(_)) {
                if (Y) {
                    let m = l8A(Y),
                        b = await ZyA(X, m ?? void 0);
                    if (!b.success) throw Error(b.error.message);
                    c("tengu_pdf_page_extraction", {
                        success: !0,
                        pageCount: b.data.file.count,
                        fileSize: b.data.file.originalSize,
                        hasPageRange: !0
                    }), eS({
                        operation: "read",
                        tool: "FileReadTool",
                        filePath: J,
                        content: `PDF pages ${Y}`
                    });
                    let {
                        readdir: g,
                        readFile: U
                    } = await import("fs/promises"), p = (await g(b.data.file.outputDir)).filter((r) => r.endsWith(".jpg")).sort(), l = await Promise.all(p.map(async (r) => {
                        let s = l51.join(b.data.file.outputDir, r),
                            O1 = await U(s),
                            T1 = await eu(O1, O1.length, "jpeg");
                        return {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: `image/${T1.mediaType}`,
                                data: T1.buffer.toString("base64")
                            }
                        }
                    }));
                    return {
                        data: b.data,
                        ...l.length > 0 && {
                            newMessages: [c6({
                                content: l,
                                isMeta: !0
                            })]
                        }
                    }
                }
                let N = await sW6(X);
                if (N !== null && N > gz6) throw Error(`This PDF has ${N} pages, which is too many to read at once. Use the pages parameter to read specific page ranges (e.g., pages: "1-5"). Maximum ${wD1} pages per request.`);
                let k = await b1().stat(X);
                if (!ey1() || k.size > VV7) {
                    let m = await ZyA(X);
                    if (m.success) c("tengu_pdf_page_extraction", {
                        success: !0,
                        pageCount: m.data.file.count,
                        fileSize: m.data.file.originalSize
                    });
                    else c("tengu_pdf_page_extraction", {
                        success: !1,
                        available: m.error.reason !== "unavailable",
                        fileSize: k.size
                    })
                }
                if (!ey1()) throw Error("PDF reading is not supported. Install poppler-utils (e.g. `brew install poppler` or `apt-get install poppler-utils`) to enable PDF reading.");
                let B = await li4(X);
                if (!B.success) throw Error(B.error.message);
                let S = B.data;
                return eS({
                    operation: "read",
                    tool: "FileReadTool",
                    filePath: J,
                    content: S.file.base64
                }), {
                    data: S,
                    newMessages: [c6({
                        content: [{
                            type: "document",
                            source: {
                                type: "base64",
                                media_type: "application/pdf",
                                data: S.file.base64
                            }
                        }],
                        isMeta: !0
                    })]
                }
            }
            let M = q === 0 ? 0 : q - 1,
                {
                    content: P,
                    lineCount: W,
                    totalLines: G
                } = Ca4(X, M, K);
            if (P.length > $) throw Error(hCA(P.length, $));
            await ya4(P, _, {
                maxSizeBytes: $,
                maxTokens: O
            }), w.set(J, {
                content: P,
                timestamp: aW(X),
                offset: q,
                limit: K
            }), z.nestedMemoryAttachmentTriggers?.add(J);
            for (let N of zmY) N(X, P);
            let f = {
                type: "text",
                file: {
                    filePath: A,
                    content: P,
                    numLines: W,
                    startLine: q,
                    totalLines: G
                }
            };
            eS({
                operation: "read",
                tool: "FileReadTool",
                filePath: J,
                content: P
            });
            let Z = $mY(J);
            if (Z) c("tengu_session_file_read", {
                is_session_memory: Z === "session_memory",
                is_session_transcript: Z === "session_transcript"
            });
            return {
                data: f
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            switch (A.type) {
                case "image":
                    return {
                        tool_use_id: q, type: "tool_result", content: [{
                            type: "image",
                            source: {
                                type: "base64",
                                data: A.file.base64,
                                media_type: A.file.type
                            }
                        }]
                    };
                case "notebook":
                    return Za4(A.file.cells, q);
                case "pdf":
                    return {
                        tool_use_id: q, type: "tool_result", content: `PDF file read: ${A.file.filePath} (${L2(A.file.originalSize)})`
                    };
                case "parts":
                    return {
                        tool_use_id: q, type: "tool_result", content: `PDF pages extracted: ${A.file.count} page(s) from ${A.file.filePath} (${L2(A.file.originalSize)})`
                    };
                case "text": {
                    let K;
                    if (A.file.content) K = Sj1(A.file) + (jmY() ? XmY : "");
                    else K = A.file.totalLines === 0 ? "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>" : `<system-reminder>Warning: the file exists but is shorter than the provided offset (${A.file.startLine}). The file has ${A.file.totalLines} lines.</system-reminder>`;
                    return {
                        tool_use_id: q,
                        type: "tool_result",
                        content: K
                    }
                }
            }
        }
    }, DmY = new Set(["claude-opus-4-6"])
})
// @from(Ln 373354, Col 0)
function DZ6(A, q) {
    return
}
// @from(Ln 373357, Col 4)
WmY
// @from(Ln 373357, Col 9)
GmY
// @from(Ln 373358, Col 4)
xCA = v(() => {
    _8();
    u6();
    zq();
    m6();
    WmY = KA(() => {
        return null
    }), GmY = KA(() => {
        return null
    })
})
// @from(Ln 373370, Col 0)
function bCA(A) {
    if (A === "Local") return "project (local)";
    if (A === "AutoMem") return "auto memory";
    return A.toLowerCase()
}
// @from(Ln 373375, Col 4)
Sa4
// @from(Ln 373376, Col 4)
uCA = v(() => {
    Sa4 = ["User", "Project", "Local", "Managed", "ExperimentalUltraClaudeMd", "AutoMem"]
})
// @from(Ln 373380, Col 0)
function Ia4(A) {
    let q = {
            toolRequests: new Map,
            toolResults: new Map,
            humanMessages: 0,
            assistantMessages: 0,
            localCommandOutputs: 0,
            other: 0,
            attachments: new Map,
            duplicateFileReads: new Map,
            total: 0
        },
        K = new Map,
        Y = new Map,
        z = new Map;
    return A.forEach((H) => {
        if (H.type === "attachment") {
            let $ = H.attachment.type || "unknown";
            q.attachments.set($, (q.attachments.get($) || 0) + 1)
        }
    }), WJ(A).forEach((H) => {
        let {
            content: $
        } = H.message;
        if (typeof $ === "string") {
            let O = A2($);
            if (q.total += O, H.type === "user" && $.includes("local-command-stdout")) q.localCommandOutputs += O;
            else q[H.type === "user" ? "humanMessages" : "assistantMessages"] += O
        } else $.forEach((O) => ZmY(O, H, q, K, Y, z))
    }), z.forEach((H, $) => {
        if (H.count > 1) {
            let _ = Math.floor(H.totalTokens / H.count) * (H.count - 1);
            q.duplicateFileReads.set($, {
                count: H.count,
                tokens: _
            })
        }
    }), q
}
// @from(Ln 373420, Col 0)
function ZmY(A, q, K, Y, z, w) {
    let H = A2(Q1(A));
    switch (K.total += H, A.type) {
        case "text":
            if (q.type === "user" && "text" in A && A.text.includes("local-command-stdout")) K.localCommandOutputs += H;
            else K[q.type === "user" ? "humanMessages" : "assistantMessages"] += H;
            break;
        case "tool_use": {
            if ("name" in A && "id" in A) {
                let $ = A.name || "unknown";
                if (ha4(K.toolRequests, $, H), Y.set(A.id, $), $ === "Read" && "input" in A && A.input && typeof A.input === "object" && "file_path" in A.input) {
                    let O = String(A.input.file_path);
                    z.set(A.id, O)
                }
            }
            break
        }
        case "tool_result": {
            if ("tool_use_id" in A) {
                let $ = Y.get(A.tool_use_id) || "unknown";
                if (ha4(K.toolResults, $, H), $ === "Read") {
                    let O = z.get(A.tool_use_id);
                    if (O) {
                        let _ = w.get(O) || {
                            count: 0,
                            totalTokens: 0
                        };
                        w.set(O, {
                            count: _.count + 1,
                            totalTokens: _.totalTokens + H
                        })
                    }
                }
            }
            break
        }
        case "image":
        case "server_tool_use":
        case "web_search_tool_result":
        case "search_result":
        case "document":
        case "thinking":
        case "redacted_thinking":
        case "code_execution_tool_result":
        case "mcp_tool_use":
        case "mcp_tool_result":
        case "container_upload":
        case "web_fetch_tool_result":
        case "bash_code_execution_tool_result":
        case "text_editor_code_execution_tool_result":
        case "tool_search_tool_result":
        case "compaction":
            K.other += H;
            break
    }
}
// @from(Ln 373477, Col 0)
function ha4(A, q, K) {
    A.set(q, (A.get(q) || 0) + K)
}
// @from(Ln 373481, Col 0)
function xa4(A) {
    let q = {
        total_tokens: A.total,
        human_message_tokens: A.humanMessages,
        assistant_message_tokens: A.assistantMessages,
        local_command_output_tokens: A.localCommandOutputs,
        other_tokens: A.other
    };
    A.attachments.forEach((Y, z) => {
        q[`attachment_${z}_count`] = Y
    }), A.toolRequests.forEach((Y, z) => {
        q[`tool_request_${z}_tokens`] = Y
    }), A.toolResults.forEach((Y, z) => {
        q[`tool_result_${z}_tokens`] = Y
    });
    let K = [...A.duplicateFileReads.values()].reduce((Y, z) => Y + z.tokens, 0);
    if (q.duplicate_read_tokens = K, q.duplicate_read_file_count = A.duplicateFileReads.size, A.total > 0) {
        q.human_message_percent = Math.round(A.humanMessages / A.total * 100), q.assistant_message_percent = Math.round(A.assistantMessages / A.total * 100), q.local_command_output_percent = Math.round(A.localCommandOutputs / A.total * 100), q.duplicate_read_percent = Math.round(K / A.total * 100);
        let Y = [...A.toolRequests.values()].reduce((w, H) => w + H, 0),
            z = [...A.toolResults.values()].reduce((w, H) => w + H, 0);
        q.tool_request_percent = Math.round(Y / A.total * 100), q.tool_result_percent = Math.round(z / A.total * 100), A.toolRequests.forEach((w, H) => {
            q[`tool_request_${H}_percent`] = Math.round(w / A.total * 100)
        }), A.toolResults.forEach((w, H) => {
            q[`tool_result_${H}_percent`] = Math.round(w / A.total * 100)
        })
    }
    return q
}
// @from(Ln 373509, Col 4)
ba4 = v(() => {
    vv();
    N8();
    m6()
})
// @from(Ln 373515, Col 0)
function TmY(A) {
    return A.map((q) => {
        if (q.type !== "user") return q;
        let K = q.message.content;
        if (!Array.isArray(K)) return q;
        let Y = !1,
            z = K.flatMap((w) => {
                if (w.type === "image") return Y = !0, [{
                    type: "text",
                    text: "[image]"
                }];
                if (w.type === "tool_result" && Array.isArray(w.content)) {
                    let H = !1,
                        $ = w.content.map((O) => {
                            if (O.type === "image") return H = !0, {
                                type: "text",
                                text: "[image]"
                            };
                            return O
                        });
                    if (H) return Y = !0, [{
                        ...w,
                        content: $
                    }]
                }
                return [w]
            });
        if (!Y) return q;
        return {
            ...q,
            message: {
                ...q.message,
                content: z
            }
        }
    })
}
// @from(Ln 373553, Col 0)
function qt(A) {
    return [A.boundaryMarker, ...A.summaryMessages, ...A.messagesToKeep ?? [], ...A.attachments, ...A.hookResults]
}
// @from(Ln 373556, Col 0)
async function AW1(A, q, K, Y, z, w = !1) {
    try {
        if (A.length === 0) throw Error(_U1);
        let H = Ev(A),
            $ = Ia4(A),
            O = {};
        try {
            O = xa4($)
        } catch (x) {
            K1(x)
        }
        let _ = await q.getAppState();
        DZ6(_.toolPermissionContext, "summary"), q.onCompactProgress?.({
            type: "hooks_start",
            hookType: "pre_compact"
        }), q.setSDKStatus?.("compacting");
        let J = await mW6({
            trigger: w ? "auto" : "manual",
            customInstructions: z ?? null
        }, q.abortController.signal);
        if (J.newCustomInstructions) z = z ? `${z}

${J.newCustomInstructions}` : J.newCustomInstructions;
        let X = J.userDisplayMessage;
        q.setStreamMode?.("requesting"), q.setResponseLength?.(() => 0), q.onCompactProgress?.({
            type: "compact_start"
        });
        let D = x8("tengu_compact_cache_prefix", !1),
            j = VOA(z),
            M = c6({
                content: j
            }),
            P = await ga4({
                messages: A,
                summaryRequest: M,
                appState: _,
                context: q,
                preCompactTokenCount: H,
                cacheSafeParams: K
            }),
            W = B51(P);
        if (!W) throw h(`Compact failed: no summary text in response. Response: ${Q1(P)}`, {
            level: "error"
        }), c("tengu_compact_failed", {
            reason: "no_summary",
            preCompactTokenCount: H,
            promptCacheSharingEnabled: D
        }), Error("Failed to generate conversation summary - response did not contain valid text content");
        else if (W.startsWith(QO)) throw c("tengu_compact_failed", {
            reason: "api_error",
            preCompactTokenCount: H,
            promptCacheSharingEnabled: D
        }), Error(W);
        else if (W.startsWith(dU)) throw c("tengu_compact_failed", {
            reason: "prompt_too_long",
            preCompactTokenCount: H,
            promptCacheSharingEnabled: D
        }), Error(ma4);
        let G = wjA(q.readFileState);
        q.readFileState.clear(), rd();
        let [f, Z] = await Promise.all([Ua4(G, q, Ba4), ca4(q)]), N = [...f, ...Z], T = pa4(q.agentId ?? U6());
        if (T) N.push(T);
        let k = jZ6(q.agentId);
        if (k) N.push(k);
        let y = da4();
        if (y) N.push(y);
        q.onCompactProgress?.({
            type: "hooks_start",
            hookType: "session_start"
        });
        let B = await PP("compact", {
                model: q.options.mainLoopModel
            }),
            S = PZ([P]),
            m = Yp(P);
        c("tengu_compact", {
            preCompactTokenCount: H,
            postCompactTokenCount: S,
            compactionInputTokens: m?.input_tokens,
            compactionOutputTokens: m?.output_tokens,
            compactionCacheReadTokens: m?.cache_read_input_tokens ?? 0,
            compactionCacheCreationTokens: m?.cache_creation_input_tokens ?? 0,
            compactionTotalTokens: m ? m.input_tokens + (m.cache_creation_input_tokens ?? 0) + (m.cache_read_input_tokens ?? 0) + m.output_tokens : 0,
            promptCacheSharingEnabled: D,
            ...O
        });
        let b = JU1(w ? "auto" : "manual", H ?? 0, A[A.length - 1]?.uuid),
            g = a$(U6()),
            U = [c6({
                content: ux1(W, Y, g),
                isCompactSummary: !0,
                isVisibleInTranscriptOnly: !0
            })];
        return fOA(q.options.querySource ?? "compact", q.agentId), {
            boundaryMarker: b,
            summaryMessages: U,
            attachments: N,
            hookResults: B,
            userDisplayMessage: X,
            preCompactTokenCount: H,
            postCompactTokenCount: S,
            compactionUsage: m
        }
    } catch (H) {
        throw Qa4(H, q), H
    } finally {
        q.setStreamMode?.("requesting"), q.setResponseLength?.(() => 0), q.onCompactProgress?.({
            type: "compact_end"
        }), q.setSDKStatus?.(null)
    }
}
// @from(Ln 373667, Col 0)
async function Fa4(A, q, K, Y, z) {
    try {
        let w = A.slice(q),
            H = A.slice(0, q);
        if (w.length === 0) throw Error("Nothing to summarize after the selected message.");
        let $ = Ev(A);
        K.onCompactProgress?.({
            type: "hooks_start",
            hookType: "pre_compact"
        }), K.setSDKStatus?.("compacting");
        let O = await mW6({
                trigger: "manual",
                customInstructions: null
            }, K.abortController.signal),
            _;
        if (O.newCustomInstructions && z) _ = `${O.newCustomInstructions}

User context: ${z}`;
        else if (O.newCustomInstructions) _ = O.newCustomInstructions;
        else if (z) _ = `User context: ${z}`;
        K.setStreamMode?.("requesting"), K.setResponseLength?.(() => 0), K.onCompactProgress?.({
            type: "compact_start"
        });
        let J = BL7(_),
            X = c6({
                content: J
            }),
            D = await ga4({
                messages: A,
                summaryRequest: X,
                appState: await K.getAppState(),
                context: K,
                preCompactTokenCount: $,
                cacheSafeParams: Y
            }),
            j = B51(D);
        if (!j) throw c("tengu_partial_compact_failed", {
            reason: "no_summary",
            preCompactTokenCount: $
        }), Error("Failed to generate conversation summary - response did not contain valid text content");
        else if (j.startsWith(QO)) throw c("tengu_partial_compact_failed", {
            reason: "api_error",
            preCompactTokenCount: $
        }), Error(j);
        else if (j.startsWith(dU)) throw c("tengu_partial_compact_failed", {
            reason: "prompt_too_long",
            preCompactTokenCount: $
        }), Error(ma4);
        let M = wjA(K.readFileState);
        K.readFileState.clear(), rd();
        let [P, W] = await Promise.all([Ua4(M, K, Ba4), ca4(K)]), G = [...P, ...W], f = pa4(K.agentId ?? U6());
        if (f) G.push(f);
        let Z = jZ6(K.agentId);
        if (Z) G.push(Z);
        let N = da4();
        if (N) G.push(N);
        K.onCompactProgress?.({
            type: "hooks_start",
            hookType: "session_start"
        });
        let T = await PP("compact", {
                model: K.options.mainLoopModel
            }),
            k = PZ([D]),
            y = Yp(D);
        c("tengu_partial_compact", {
            preCompactTokenCount: $,
            postCompactTokenCount: k,
            messagesKept: H.length,
            messagesSummarized: w.length,
            trigger: "message_selector",
            compactionInputTokens: y?.input_tokens,
            compactionOutputTokens: y?.output_tokens,
            compactionCacheReadTokens: y?.cache_read_input_tokens ?? 0,
            compactionCacheCreationTokens: y?.cache_creation_input_tokens ?? 0
        });
        let B = JU1("manual", $ ?? 0, H[H.length - 1]?.uuid, z, w.length),
            S = a$(U6()),
            m = [c6({
                content: ux1(j, !1, S),
                isCompactSummary: !0,
                ...H.length > 0 ? {
                    summarizeMetadata: {
                        messagesSummarized: w.length,
                        userContext: z
                    }
                } : {
                    isVisibleInTranscriptOnly: !0
                }
            })];
        return fOA(K.options.querySource ?? "compact", K.agentId), {
            boundaryMarker: B,
            summaryMessages: m,
            messagesToKeep: H,
            attachments: G,
            hookResults: T,
            preCompactTokenCount: $,
            postCompactTokenCount: k,
            compactionUsage: y
        }
    } catch (w) {
        throw Qa4(w, K), w
    } finally {
        K.setStreamMode?.("requesting"), K.setResponseLength?.(() => 0), K.onCompactProgress?.({
            type: "compact_end"
        }), K.setSDKStatus?.(null)
    }
}
// @from(Ln 373776, Col 0)
function Qa4(A, q) {
    if (!ST1(A, e31) && !ST1(A, _U1)) q.addNotification?.({
        key: "error-compacting-conversation",
        text: "Error compacting conversation",
        priority: "immediate",
        color: "error"
    })
}
// @from(Ln 373785, Col 0)
function vmY() {
    return async () => ({
        behavior: "deny",
        message: "Tool use is not allowed during compaction",
        decisionReason: {
            type: "other",
            reason: "compaction agent should only produce text summary"
        }
    })
}
// @from(Ln 373795, Col 0)
async function ga4({
    messages: A,
    summaryRequest: q,
    appState: K,
    context: Y,
    preCompactTokenCount: z,
    cacheSafeParams: w
}) {
    if (x8("tengu_compact_cache_prefix", !1)) try {
        let _ = await av({
                promptMessages: [q],
                cacheSafeParams: w,
                canUseTool: vmY(),
                querySource: "compact",
                forkLabel: "compact",
                maxTurns: 1
            }),
            J = GN(_.messages);
        if (J && B51(J)) return c("tengu_compact_cache_sharing_success", {
            preCompactTokenCount: z,
            outputTokens: _.totalUsage.output_tokens,
            cacheReadInputTokens: _.totalUsage.cache_read_input_tokens,
            cacheCreationInputTokens: _.totalUsage.cache_creation_input_tokens,
            cacheHitRate: _.totalUsage.cache_read_input_tokens > 0 ? _.totalUsage.cache_read_input_tokens / (_.totalUsage.cache_read_input_tokens + _.totalUsage.cache_creation_input_tokens + _.totalUsage.input_tokens) : 0
        }), J;
        h(`Compact cache sharing: no text in response, falling back. Response: ${Q1(J)}`, {
            level: "warn"
        }), c("tengu_compact_cache_sharing_fallback", {
            reason: "no_text_response",
            preCompactTokenCount: z
        })
    } catch (_) {
        K1(_ instanceof Error ? _ : Error(String(_))), c("tengu_compact_cache_sharing_fallback", {
            reason: "error",
            preCompactTokenCount: z
        })
    }
    let $ = x8("tengu_compact_streaming_retry", !1),
        O = $ ? NmY : 1;
    for (let _ = 1; _ <= O; _++) {
        let J = !1,
            X;
        Y.setResponseLength?.(() => 0);
        let j = await XU1(Y.options.mainLoopModel, Y.options.tools, async () => K.toolPermissionContext, Y.options.agentDefinitions.activeAgents, "compact") ? Sx([i5, IW6, ...K.mcp.tools], "name") : [i5],
            P = UW1({
                messages: WJ(TmY([...EN(A), q])),
                systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."],
                maxThinkingTokens: 0,
                tools: j,
                signal: Y.abortController.signal,
                options: {
                    async getToolPermissionContext() {
                        return (await Y.getAppState()).toolPermissionContext
                    },
                    model: Y.options.mainLoopModel,
                    toolChoice: void 0,
                    isNonInteractiveSession: Y.options.isNonInteractiveSession,
                    hasAppendSystemPrompt: !!Y.options.appendSystemPrompt,
                    maxOutputTokensOverride: JL6,
                    querySource: "compact",
                    agents: Y.options.agentDefinitions.activeAgents,
                    mcpTools: [],
                    effortValue: K.effortValue
                }
            })[Symbol.asyncIterator](),
            W = await P.next();
        while (!W.done) {
            let G = W.value;
            if (!J && G.type === "stream_event" && G.event.type === "content_block_start" && G.event.content_block.type === "text") J = !0, Y.setStreamMode?.("responding");
            if (G.type === "stream_event" && G.event.type === "content_block_delta" && G.event.delta.type === "text_delta") {
                let f = G.event.delta.text.length;
                Y.setResponseLength?.((Z) => Z + f)
            }
            if (G.type === "assistant") X = G;
            W = await P.next()
        }
        if (X) return X;
        if (_ < O) {
            c("tengu_compact_streaming_retry", {
                attempt: _,
                preCompactTokenCount: z,
                hasStartedStreaming: J
            }), await dS(cU(_), Y.abortController.signal);
            continue
        }
        throw h(`Compact streaming failed after ${_} attempts. hasStartedStreaming=${J}`, {
            level: "error"
        }), c("tengu_compact_failed", {
            reason: "no_streaming_response",
            preCompactTokenCount: z,
            hasStartedStreaming: J,
            retryEnabled: $,
            attempts: _,
            promptCacheSharingEnabled: !1
        }), Error(ua4)
    }
    throw Error(ua4)
}
// @from(Ln 373893, Col 0)
async function Ua4(A, q, K) {
    let Y = Object.entries(A).map(([H, $]) => ({
            filename: H,
            ...$
        })).filter((H) => !EmY(H.filename, q.agentId)).sort((H, $) => $.timestamp - H.timestamp).slice(0, K),
        z = await Promise.all(Y.map(async (H) => {
            let $ = await TyA(H.filename, {
                ...q,
                fileReadingLimits: {
                    maxTokens: VmY
                }
            }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
            return $ ? kq($) : null
        })),
        w = 0;
    return z.filter((H) => {
        if (H === null) return !1;
        let $ = A2(Q1(H));
        if (w + $ <= fmY) return w += $, !0;
        return !1
    })
}
// @from(Ln 373916, Col 0)
function pa4(A) {
    let q = UB(A);
    if (q.length === 0) return null;
    return kq({
        type: "todo",
        content: q,
        itemCount: q.length,
        context: "post-compact"
    })
}
// @from(Ln 373927, Col 0)
function jZ6(A) {
    let q = pD(A);
    if (!q) return null;
    let K = uW(A);
    return kq({
        type: "plan_file_reference",
        planFilePath: K,
        planContent: q
    })
}
// @from(Ln 373938, Col 0)
function da4() {
    let A = zR6();
    if (A.size === 0) return null;
    let q = Array.from(A.values()).sort((K, Y) => Y.invokedAt - K.invokedAt).map((K) => ({
        name: K.skillName,
        path: K.skillPath,
        content: K.content
    }));
    return kq({
        type: "invoked_skills",
        skills: q
    })
}
// @from(Ln 373951, Col 0)
async function ca4(A) {
    let q = await A.getAppState();
    return Object.values(q.tasks).filter((Y) => Y.type === "local_agent").flatMap((Y) => {
        if (Y.retrieved) return [];
        let {
            status: z
        } = Y;
        if (z === "completed" || z === "failed" || z === "killed") return [kq({
            type: "task_status",
            taskId: Y.agentId,
            taskType: "local_agent",
            description: Y.description,
            status: z,
            deltaSummary: Y.error ?? null
        })];
        return []
    })
}
// @from(Ln 373970, Col 0)
function EmY(A, q) {
    let K = g4(A);
    try {
        let Y = q ?? U6(),
            z = g4(Lp(Y));
        if (K === z) return !0
    } catch {}
    try {
        let Y = g4(uW(q));
        if (K === Y) return !0
    } catch {}
    try {
        if (new Set(Sa4.map((z) => g4(cB(z)))).has(K)) return !0
    } catch {}
    return !1
}
// @from(Ln 373986, Col 4)
Ba4 = 5
// @from(Ln 373987, Col 4)
fmY = 50000
// @from(Ln 373988, Col 4)
VmY = 5000
// @from(Ln 373989, Col 4)
NmY = 2
// @from(Ln 373990, Col 4)
_U1 = "Not enough messages to compact."
// @from(Ln 373991, Col 4)
ma4 = "Conversation too long. Press esc twice to go up a few messages and try again."
// @from(Ln 373992, Col 4)
e31 = "API Error: Request was aborted."
// @from(Ln 373993, Col 4)
ua4 = "Compaction interrupted · This may be due to network issues — please try again."
// @from(Ln 373994, Col 4)
vd = v(() => {
    H21();
    yw();
    bx1();
    AB();
    N8();
    u6();
    qH();
    RW();
    YE();
    RRA();
    oL();
    pM();
    xCA();
    FW();
    pB();
    cA();
    mX();
    Ez();
    uCA();
    hf();
    vv();
    ba4();
    y6();
    Z6();
    U4();
    Yq1();
    QU();
    aM();
    Rt();
    B6();
    lq();
    m6();
    YI()
})
// @from(Ln 374030, Col 0)
function ra4() {
    return la4
}
// @from(Ln 374034, Col 0)
function i51(A) {
    la4 = A
}
// @from(Ln 374038, Col 0)
function oa4() {
    MZ6 = Date.now()
}
// @from(Ln 374042, Col 0)
function aa4() {
    MZ6 = void 0
}
// @from(Ln 374045, Col 0)
async function sa4() {
    let A = Date.now();
    while (MZ6) {
        if (Date.now() - MZ6 > LmY) return;
        if (Date.now() - A > kmY) return;
        await new Promise((K) => setTimeout(K, 1000))
    }
}
// @from(Ln 374054, Col 0)
function PZ6() {
    let A = b1(),
        q = VG1();
    if (!A.existsSync(q)) return null;
    let K = A.readFileSync(q, {
        encoding: "utf-8"
    });
    return c("tengu_session_memory_loaded", {
        content_length: K.length
    }), K
}
// @from(Ln 374066, Col 0)
function ta4(A) {
    ZG1 = {
        ...ZG1,
        ...A
    }
}
// @from(Ln 374073, Col 0)
function ea4() {
    return {
        ...ZG1
    }
}
// @from(Ln 374079, Col 0)
function As4(A) {
    ia4 = A
}
// @from(Ln 374083, Col 0)
function qs4() {
    return na4
}
// @from(Ln 374087, Col 0)
function Ks4() {
    na4 = !0
}
// @from(Ln 374091, Col 0)
function Ys4(A) {
    return A >= ZG1.minimumMessageTokensToInit
}
// @from(Ln 374095, Col 0)
function zs4(A) {
    return A - ia4 >= ZG1.minimumTokensBetweenUpdate
}
// @from(Ln 374099, Col 0)
function ws4() {
    return ZG1.toolCallsBetweenUpdates
}
// @from(Ln 374102, Col 4)
kmY = 15000
// @from(Ln 374103, Col 4)
LmY = 60000
// @from(Ln 374104, Col 4)
DU1
// @from(Ln 374104, Col 9)
ZG1
// @from(Ln 374104, Col 14)
la4
// @from(Ln 374104, Col 19)
MZ6
// @from(Ln 374104, Col 24)
ia4 = 0
// @from(Ln 374105, Col 4)
na4 = !1
// @from(Ln 374106, Col 4)
fG1 = v(() => {
    _8();
    E2();
    u6();
    DU1 = {
        minimumMessageTokensToInit: 1e4,
        minimumTokensBetweenUpdate: 5000,
        toolCallsBetweenUpdates: 3
    }, ZG1 = {
        ...DU1
    }
})