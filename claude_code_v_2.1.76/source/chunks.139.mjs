
// @from(Ln 345135, Col 4)
c66 = E(() => {
    K7();
    V1();
    F21();
    Z7();
    Q$();
    NU();
    RY();
    F9();
    SA();
    iY6();
    Ib();
    AT6();
    k1();
    H1();
    El6();
    JN();
    cf6();
    ca4();
    lA();
    HA();
    tV1();
    A8();
    od();
    _LY = F6(() => C.strictObject({
        file_path: C.string().describe("The absolute path to the file to write (must be absolute, not relative)"),
        content: C.string().describe("The content to write to the file")
    })), wLY = F6(() => C.object({
        type: C.enum(["create", "update"]).describe("Whether a new file was created or an existing file was updated"),
        filePath: C.string().describe("The path to the file that was written"),
        content: C.string().describe("The content that was written to the file"),
        structuredPatch: C.array(nm8()).describe("Diff patch showing the changes"),
        originalFile: C.string().nullable().describe("The original file content before the write (null for new files)"),
        gitDiff: C.object({
            filename: C.string(),
            status: C.enum(["modified", "added"]),
            additions: C.number(),
            deletions: C.number(),
            changes: C.number(),
            patch: C.string(),
            repository: C.string().nullable().optional().describe("GitHub owner/repo when available")
        }).optional()
    })), xX = {
        name: _K,
        searchHint: "create or overwrite files",
        maxResultSizeChars: 1e5,
        strict: !0,
        input_examples: [{
            file_path: "/Users/username/project/src/newFile.ts",
            content: "Hello, World!"
        }],
        async description() {
            return "Write a file to the local filesystem."
        },
        userFacingName: ga4,
        getToolUseSummary: em8,
        getActivityDescription(A) {
            let q = em8(A);
            return q ? `Writing ${q}` : "Writing file"
        },
        async prompt() {
            return bG7()
        },
        isEnabled() {
            return !0
        },
        renderToolUseMessage: Fa4,
        get inputSchema() {
            return _LY()
        },
        inputParamAliases: {
            filePath: "file_path",
            filepath: "file_path",
            path: "file_path"
        },
        get outputSchema() {
            return wLY()
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput(A) {
            return `${A.file_path}: ${A.content}`
        },
        getPath(A) {
            return A.file_path
        },
        async checkPermissions(A, q) {
            let K = q.getAppState();
            return Xz6(xX, A, K.toolPermissionContext)
        },
        renderToolUseRejectedMessage: pa4,
        renderToolUseErrorMessage: Qa4,
        renderToolUseProgressMessage: Ua4,
        renderToolResultMessage: da4,
        async validateInput({
            file_path: A,
            content: q
        }, K) {
            let Y = L4(A),
                z = cV1(Y, q);
            if (z) return {
                result: !1,
                message: z,
                errorCode: 0
            };
            let _ = K.getAppState();
            if (ZX(Y, _.toolPermissionContext, "edit", "deny") !== null) return {
                result: !1,
                message: "File is in a directory that is denied by your permission settings.",
                errorCode: 1
            };
            if (Y.startsWith("\\\\") || Y.startsWith("//")) return {
                result: !0
            };
            let O = $1(),
                $;
            try {
                $ = (await O.stat(Y)).mtimeMs
            } catch (J) {
                if (J.code === "ENOENT") return {
                    result: !0
                };
                throw J
            }
            let H = K.readFileState.get(Y);
            if (!H || H.isPartialView) return {
                result: !1,
                message: "File has not been read yet. Read it first before writing to it.",
                errorCode: 2
            };
            if (Math.floor($) > H.timestamp) return {
                result: !1,
                message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
                errorCode: 3
            };
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
        }, _, w) {
            let O = L4(A),
                $ = YLY(O),
                H = $1(),
                j = G1(),
                J = await EW6([O], j);
            if (J.length > 0) {
                for (let f of J) z?.add(f);
                yW6(J).catch(() => {})
            }
            LW6([O], j), await Nl.beforeFileEdited(O);
            let M;
            try {
                M = i66(O)
            } catch (f) {
                if (f.code === "ENOENT") M = null;
                else throw f
            }
            if (M !== null) {
                let f = Jh(O),
                    v = K.get(O);
                if (!v || f > v.timestamp) {
                    if (!(v && v.offset === void 0 && v.limit === void 0) || M.content !== v.content) throw Error(y21)
                }
            }
            let D = M?.encoding ?? "utf8",
                X = M?.content ?? null;
            if (iz()) await R66(Y, O, w.uuid);
            let P = M?.lineEndings ?? await ra4();
            H.mkdirSync($), l66(O, q, D, P);
            let W = vl();
            if (W) pV1(`file://${O}`), W.changeFile(O, q).catch((f) => {
                k(`LSP: Failed to notify server of file change for ${O}: ${f.message}`), _6(f)
            }), W.saveFile(O).catch((f) => {
                k(`LSP: Failed to notify server of file save for ${O}: ${f.message}`), _6(f)
            });
            if (L66(O, X, q), K.set(O, {
                    content: q,
                    timestamp: Jh(O),
                    offset: void 0,
                    limit: void 0
                }), O.endsWith(`${zLY}CLAUDE.md`)) d("tengu_write_claudemd", {});
            let Z;
            if (t6(process.env.CLAUDE_CODE_REMOTE) && w8("tengu_quartz_lantern", !1)) {
                let f = Date.now(),
                    v = await sV1(O);
                if (v) Z = v;
                d("tengu_tool_use_diff_computed", {
                    isWriteTool: !0,
                    durationMs: Date.now() - f,
                    hasDiff: !!v
                })
            }
            if (X) {
                let f = SL({
                        filePath: A,
                        fileContents: X,
                        edits: [{
                            old_string: X,
                            new_string: q,
                            replace_all: !1
                        }]
                    }),
                    v = {
                        type: "update",
                        filePath: A,
                        content: q,
                        structuredPatch: f,
                        originalFile: X,
                        ...Z && {
                            gitDiff: Z
                        }
                    };
                return px6(f), RC({
                    operation: "write",
                    tool: "FileWriteTool",
                    filePath: O,
                    type: "update"
                }), {
                    data: v
                }
            }
            let G = {
                type: "create",
                filePath: A,
                content: q,
                structuredPatch: [],
                originalFile: null,
                ...Z && {
                    gitDiff: Z
                }
            };
            return px6([], q), RC({
                operation: "write",
                tool: "FileWriteTool",
                filePath: O,
                type: "create"
            }), {
                data: G
            }
        },
        mapToolResultToToolResultBlockParam({
            filePath: A,
            type: q
        }, K) {
            switch (q) {
                case "create":
                    return {
                        tool_use_id: K, type: "tool_result", content: `File created successfully at: ${A}`
                    };
                case "update":
                    return {
                        tool_use_id: K, type: "tool_result", content: `The file ${A} has been updated successfully.`
                    }
            }
        }
    }
})
// @from(Ln 345404, Col 0)
function KB8(A) {
    let q = A6(25),
        {
            count: K,
            countLabel: Y,
            secondaryCount: z,
            secondaryLabel: _,
            content: w,
            verbose: O
        } = A,
        $;
    if (q[0] !== K) $ = Oj.default.createElement(T, {
        bold: !0
    }, K, " "), q[0] = K, q[1] = $;
    else $ = q[1];
    let H;
    if (q[2] !== K || q[3] !== Y) H = K === 0 || K > 1 ? Y : Y.slice(0, -1), q[2] = K, q[3] = Y, q[4] = H;
    else H = q[4];
    let j;
    if (q[5] !== $ || q[6] !== H) j = Oj.default.createElement(T, null, "Found ", $, H), q[5] = $, q[6] = H, q[7] = j;
    else j = q[7];
    let J = j,
        M;
    if (q[8] !== z || q[9] !== _) M = z !== void 0 && _ ? Oj.default.createElement(T, null, " ", "across ", Oj.default.createElement(T, {
        bold: !0
    }, z, " "), z === 0 || z > 1 ? _ : _.slice(0, -1)) : null, q[8] = z, q[9] = _, q[10] = M;
    else M = q[10];
    let D = M;
    if (O) {
        let W;
        if (q[11] !== J || q[12] !== D) W = Oj.default.createElement(m, {
            flexDirection: "row"
        }, Oj.default.createElement(T, null, "  ⎿  ", J, D)), q[11] = J, q[12] = D, q[13] = W;
        else W = q[13];
        let Z;
        if (q[14] !== w) Z = Oj.default.createElement(m, {
            marginLeft: 5
        }, Oj.default.createElement(T, null, w)), q[14] = w, q[15] = Z;
        else Z = q[15];
        let G;
        if (q[16] !== W || q[17] !== Z) G = Oj.default.createElement(m, {
            flexDirection: "column"
        }, W, Z), q[16] = W, q[17] = Z, q[18] = G;
        else G = q[18];
        return G
    }
    let X;
    if (q[19] !== K) X = K > 0 && Oj.default.createElement(oJ, null), q[19] = K, q[20] = X;
    else X = q[20];
    let P;
    if (q[21] !== J || q[22] !== D || q[23] !== X) P = Oj.default.createElement(t1, {
        height: 1
    }, Oj.default.createElement(T, null, J, D, " ", X)), q[21] = J, q[22] = D, q[23] = X, q[24] = P;
    else P = q[24];
    return P
}
// @from(Ln 345461, Col 0)
function oa4({
    pattern: A,
    path: q
}, {
    verbose: K
}) {
    if (!A) return null;
    let Y = [`pattern: "${A}"`];
    if (q) Y.push(`path: "${K?q:$K(q)}"`);
    return Y.join(", ")
}
// @from(Ln 345473, Col 0)
function aa4() {
    return Oj.default.createElement(T3, null)
}
// @from(Ln 345477, Col 0)
function sa4(A, {
    verbose: q
}) {
    if (!q && typeof A === "string" && d4(A, "tool_use_error")) {
        if (d4(A, "tool_use_error")?.includes(wZ)) return Oj.default.createElement(t1, null, Oj.default.createElement(T, {
            color: "error"
        }, "File not found"));
        return Oj.default.createElement(t1, null, Oj.default.createElement(T, {
            color: "error"
        }, "Error searching files"))
    }
    return Oj.default.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 345494, Col 0)
function ta4() {
    return null
}
// @from(Ln 345498, Col 0)
function ea4({
    mode: A = "files_with_matches",
    filenames: q,
    numFiles: K,
    content: Y,
    numLines: z,
    numMatches: _
}, w, {
    verbose: O
}) {
    if (A === "content") return Oj.default.createElement(KB8, {
        count: z ?? 0,
        countLabel: "lines",
        content: Y,
        verbose: O
    });
    if (A === "count") return Oj.default.createElement(KB8, {
        count: _ ?? 0,
        countLabel: "matches",
        secondaryCount: K,
        secondaryLabel: "files",
        content: Y,
        verbose: O
    });
    let $ = q.map((H) => H).join(`
`);
    return Oj.default.createElement(KB8, {
        count: K,
        countLabel: "files",
        content: $,
        verbose: O
    })
}
// @from(Ln 345532, Col 0)
function YB8(A) {
    if (!A?.pattern) return null;
    return R3(A.pattern, EI)
}
// @from(Ln 345536, Col 4)
Oj
// @from(Ln 345537, Col 4)
As4 = E(() => {
    e6();
    i6();
    gj();
    kO();
    iq();
    GR();
    Z7();
    JA();
    M4();
    Oj = t(P6(), 1)
})
// @from(Ln 345553, Col 0)
function zB8(A, q, K = 0) {
    if (q === void 0) return A.slice(K);
    return A.slice(K, K + q)
}
// @from(Ln 345558, Col 0)
function _B8(A) {
    let q = G1(),
        K = OLY(q, A);
    return K.startsWith("..") ? A : K
}
// @from(Ln 345564, Col 0)
function wB8(A, q) {
    if (!A && !q) return "";
    return `limit: ${A}, offset: ${q??0}`
}
// @from(Ln 345568, Col 4)
$LY
// @from(Ln 345568, Col 9)
HLY
// @from(Ln 345568, Col 14)
jLY
// @from(Ln 345568, Col 19)
bb
// @from(Ln 345569, Col 4)
KT6 = E(() => {
    K7();
    dq6();
    lA();
    F9();
    Z7();
    jy();
    VU();
    uP();
    RY();
    SA();
    yl6();
    As4();
    $LY = F6(() => C.strictObject({
        pattern: C.string().describe("The regular expression pattern to search for in file contents"),
        path: C.string().optional().describe("File or directory to search in (rg PATH). Defaults to current working directory."),
        glob: C.string().optional().describe('Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}") - maps to rg --glob'),
        output_mode: C.enum(["content", "files_with_matches", "count"]).optional().describe('Output mode: "content" shows matching lines (supports -A/-B/-C context, -n line numbers, head_limit), "files_with_matches" shows file paths (supports head_limit), "count" shows match counts (supports head_limit). Defaults to "files_with_matches".'),
        "-B": C.number().optional().describe('Number of lines to show before each match (rg -B). Requires output_mode: "content", ignored otherwise.'),
        "-A": C.number().optional().describe('Number of lines to show after each match (rg -A). Requires output_mode: "content", ignored otherwise.'),
        "-C": C.number().optional().describe("Alias for context."),
        context: C.number().optional().describe('Number of lines to show before and after each match (rg -C). Requires output_mode: "content", ignored otherwise.'),
        "-n": YX(C.boolean().optional()).describe('Show line numbers in output (rg -n). Requires output_mode: "content", ignored otherwise. Defaults to true.'),
        "-i": YX(C.boolean().optional()).describe("Case insensitive search (rg -i)"),
        type: C.string().optional().describe("File type to search (rg --type). Common types: js, py, rust, go, java, etc. More efficient than include for standard file types."),
        head_limit: C.number().optional().describe('Limit output to first N lines/entries, equivalent to "| head -N". Works across all output modes: content (limits output lines), files_with_matches (limits file paths), count (limits count entries). Defaults to 0 (unlimited).'),
        offset: C.number().optional().describe('Skip first N lines/entries before applying head_limit, equivalent to "| tail -n +N | head -N". Works across all output modes. Defaults to 0.'),
        multiline: YX(C.boolean().optional()).describe("Enable multiline mode where . matches newlines and patterns can span lines (rg -U --multiline-dotall). Default: false.")
    })), HLY = [".git", ".svn", ".hg", ".bzr"];
    jLY = F6(() => C.object({
        mode: C.enum(["content", "files_with_matches", "count"]).optional(),
        numFiles: C.number(),
        filenames: C.array(C.string()),
        content: C.string().optional(),
        numLines: C.number().optional(),
        numMatches: C.number().optional(),
        appliedLimit: C.number().optional(),
        appliedOffset: C.number().optional()
    })), bb = {
        name: N9,
        searchHint: "search file contents with regex (ripgrep)",
        maxResultSizeChars: 20000,
        strict: !0,
        input_examples: [{
            pattern: "TODO",
            output_mode: "files_with_matches"
        }, {
            pattern: "function.*export",
            glob: "*.ts",
            output_mode: "content",
            "-n": !0
        }, {
            pattern: "error",
            "-i": !0,
            type: "js",
            output_mode: "content",
            "-B": 2,
            "-A": 5
        }, {
            pattern: "import.*from",
            path: "/Users/username/project/src",
            output_mode: "content",
            "-C": 3,
            head_limit: 20
        }],
        async description() {
            return ew8()
        },
        userFacingName() {
            return "Search"
        },
        getToolUseSummary: YB8,
        getActivityDescription(A) {
            let q = YB8(A);
            return q ? `Searching for ${q}` : "Searching"
        },
        isEnabled() {
            return !0
        },
        get inputSchema() {
            return $LY()
        },
        inputParamAliases: {
            c: "-C",
            C: "-C",
            a: "-A",
            A: "-A",
            b: "-B",
            B: "-B",
            n: "-n",
            i: "-i",
            include: "glob",
            regex: "pattern",
            search: "pattern",
            directory: "path"
        },
        get outputSchema() {
            return jLY()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(A) {
            return A.path ? `${A.pattern} in ${A.path}` : A.pattern
        },
        isSearchOrReadCommand() {
            return {
                isSearch: !0,
                isRead: !1
            }
        },
        getPath({
            path: A
        }) {
            return A || G1()
        },
        async validateInput({
            path: A
        }) {
            if (A) {
                let q = $1(),
                    K = L4(A);
                if (K.startsWith("\\\\") || K.startsWith("//")) return {
                    result: !0
                };
                try {
                    await q.stat(K)
                } catch (Y) {
                    if (Y.code === "ENOENT") {
                        let z = await Ft(K),
                            _ = `Path does not exist: ${A}. ${wZ} ${G1()}.`;
                        if (z) _ += ` Did you mean ${z}?`;
                        return {
                            result: !1,
                            message: _,
                            errorCode: 1
                        }
                    }
                    throw Y
                }
            }
            return {
                result: !0
            }
        },
        async checkPermissions(A, q) {
            let K = q.getAppState();
            return gt(bb, A, K.toolPermissionContext)
        },
        async prompt() {
            return ew8()
        },
        renderToolUseMessage: oa4,
        renderToolUseRejectedMessage: aa4,
        renderToolUseErrorMessage: sa4,
        renderToolUseProgressMessage: ta4,
        renderToolResultMessage: ea4,
        mapToolResultToToolResultBlockParam({
            mode: A = "files_with_matches",
            numFiles: q,
            filenames: K,
            content: Y,
            numLines: z,
            numMatches: _,
            appliedLimit: w,
            appliedOffset: O
        }, $) {
            if (A === "content") {
                let J = wB8(w, O),
                    M = Y || "No matches found",
                    D = J ? `${M}

[Showing results with pagination = ${J}]` : M;
                return {
                    tool_use_id: $,
                    type: "tool_result",
                    content: D
                }
            }
            if (A === "count") {
                let J = wB8(w, O),
                    M = Y || "No matches found",
                    D = _ ?? 0,
                    X = q ?? 0,
                    P = `

Found ${D} total ${D===1?"occurrence":"occurrences"} across ${X} ${X===1?"file":"files"}.${J?` with pagination = ${J}`:""}`;
                return {
                    tool_use_id: $,
                    type: "tool_result",
                    content: M + P
                }
            }
            let H = wB8(w, O);
            if (q === 0) return {
                tool_use_id: $,
                type: "tool_result",
                content: "No files found"
            };
            let j = `Found ${q} file${q===1?"":"s"}${H?` ${H}`:""}
${K.join(`
`)}`;
            return {
                tool_use_id: $,
                type: "tool_result",
                content: j
            }
        },
        async call({
            pattern: A,
            path: q,
            glob: K,
            type: Y,
            output_mode: z = "files_with_matches",
            "-B": _,
            "-A": w,
            "-C": O,
            context: $,
            "-n": H = !0,
            "-i": j = !1,
            head_limit: J,
            offset: M = 0,
            multiline: D = !1
        }, {
            abortController: X,
            getAppState: P
        }) {
            let W = q ? L4(q) : G1(),
                Z = ["--hidden"];
            for (let u of HLY) Z.push("--glob", `!${u}`);
            if (Z.push("--max-columns", "500"), D) Z.push("-U", "--multiline-dotall");
            if (j) Z.push("-i");
            if (z === "files_with_matches") Z.push("-l");
            else if (z === "count") Z.push("-c");
            if (H && z === "content") Z.push("-n");
            if (z === "content")
                if ($ !== void 0) Z.push("-C", $.toString());
                else if (O !== void 0) Z.push("-C", O.toString());
            else {
                if (_ !== void 0) Z.push("-B", _.toString());
                if (w !== void 0) Z.push("-A", w.toString())
            }
            if (A.startsWith("-")) Z.push("-e", A);
            else Z.push(A);
            if (Y) Z.push("--type", Y);
            if (K) {
                let u = [],
                    I = K.split(/\s+/);
                for (let g of I)
                    if (g.includes("{") && g.includes("}")) u.push(g);
                    else u.push(...g.split(",").filter(Boolean));
                for (let g of u.filter(Boolean)) Z.push("--glob", g)
            }
            let G = P(),
                f = YT6(zT6(G.toolPermissionContext), G1());
            for (let u of f) {
                let I = u.startsWith("/") ? `!${u}` : `!**/${u}`;
                Z.push("--glob", I)
            }
            for (let u of await Pz6(W)) Z.push("--glob", u);
            let v = await yV(Z, W, X.signal);
            if (z === "content") {
                let B = zB8(v, J, M).map((p) => {
                    let Q = p.indexOf(":");
                    if (Q > 0) {
                        let U = p.substring(0, Q),
                            r = p.substring(Q);
                        return _B8(U) + r
                    }
                    return p
                });
                return {
                    data: {
                        mode: "content",
                        numFiles: 0,
                        filenames: [],
                        content: B.join(`
`),
                        numLines: B.length,
                        ...J !== void 0 && {
                            appliedLimit: J
                        },
                        ...M > 0 && {
                            appliedOffset: M
                        }
                    }
                }
            }
            if (z === "count") {
                let I = zB8(v, J, M).map((p) => {
                        let Q = p.lastIndexOf(":");
                        if (Q > 0) {
                            let U = p.substring(0, Q),
                                r = p.substring(Q);
                            return _B8(U) + r
                        }
                        return p
                    }),
                    g = 0,
                    B = 0;
                for (let p of I) {
                    let Q = p.lastIndexOf(":");
                    if (Q > 0) {
                        let U = p.substring(Q + 1),
                            r = parseInt(U, 10);
                        if (!isNaN(r)) g += r, B += 1
                    }
                }
                return {
                    data: {
                        mode: "count",
                        numFiles: B,
                        filenames: [],
                        content: I.join(`
`),
                        numMatches: g,
                        ...J !== void 0 && {
                            appliedLimit: J
                        },
                        ...M > 0 && {
                            appliedOffset: M
                        }
                    }
                }
            }
            let N = await Promise.all(v.map((u) => $1().stat(u))),
                V = v.map((u, I) => [u, N[I]]).sort((u, I) => {
                    let g = (I[1].mtimeMs ?? 0) - (u[1].mtimeMs ?? 0);
                    if (g === 0) return u[0].localeCompare(I[0]);
                    return g
                }).map((u) => u[0]),
                h = zB8(V, J, M).map(_B8);
            return {
                data: {
                    mode: "files_with_matches",
                    filenames: h,
                    numFiles: h.length,
                    ...J !== void 0 && {
                        appliedLimit: J
                    },
                    ...M > 0 && {
                        appliedOffset: M
                    }
                }
            }
        }
    }
})
// @from(Ln 345921, Col 0)
function qs4() {
    return "Search"
}
// @from(Ln 345925, Col 0)
function Ks4({
    pattern: A,
    path: q
}, {
    verbose: K
}) {
    if (!A) return null;
    if (!q) return `pattern: "${A}"`;
    return `pattern: "${A}", path: "${K?q:$K(q)}"`
}
// @from(Ln 345936, Col 0)
function Ys4() {
    return Wz6.default.createElement(T3, null)
}
// @from(Ln 345940, Col 0)
function zs4(A, {
    verbose: q
}) {
    if (!q && typeof A === "string" && d4(A, "tool_use_error")) {
        if (d4(A, "tool_use_error")?.includes(wZ)) return Wz6.default.createElement(t1, null, Wz6.default.createElement(T, {
            color: "error"
        }, "File not found"));
        return Wz6.default.createElement(t1, null, Wz6.default.createElement(T, {
            color: "error"
        }, "Error searching files"))
    }
    return Wz6.default.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 345957, Col 0)
function _s4() {
    return null
}
// @from(Ln 345961, Col 0)
function OB8(A) {
    if (!A?.pattern) return null;
    return R3(A.pattern, EI)
}
// @from(Ln 345965, Col 4)
Wz6
// @from(Ln 345965, Col 9)
ws4
// @from(Ln 345966, Col 4)
Os4 = E(() => {
    i6();
    gj();
    kO();
    iq();
    JA();
    Z7();
    KT6();
    M4();
    Wz6 = t(P6(), 1);
    ws4 = bb.renderToolResultMessage
})
// @from(Ln 345978, Col 4)
JLY
// @from(Ln 345978, Col 9)
MLY
// @from(Ln 345978, Col 14)
rg
// @from(Ln 345979, Col 4)
Ll6 = E(() => {
    K7();
    lA();
    Z7();
    RY();
    F9();
    SA();
    Os4();
    JLY = F6(() => C.strictObject({
        pattern: C.string().describe("The glob pattern to match files against"),
        path: C.string().optional().describe('The directory to search in. If not specified, the current working directory will be used. IMPORTANT: Omit this field to use the default directory. DO NOT enter "undefined" or "null" - simply omit it for the default behavior. Must be a valid directory path if provided.')
    })), MLY = F6(() => C.object({
        durationMs: C.number().describe("Time taken to execute the search in milliseconds"),
        numFiles: C.number().describe("Total number of files found"),
        filenames: C.array(C.string()).describe("Array of file paths that match the pattern"),
        truncated: C.boolean().describe("Whether results were truncated (limited to 100 files)")
    })), rg = {
        name: qz,
        searchHint: "find files by name pattern or wildcard",
        maxResultSizeChars: 1e5,
        async description() {
            return tw8
        },
        userFacingName: qs4,
        getToolUseSummary: OB8,
        getActivityDescription(A) {
            let q = OB8(A);
            return q ? `Finding ${q}` : "Finding files"
        },
        isEnabled() {
            return !0
        },
        get inputSchema() {
            return JLY()
        },
        inputParamAliases: {
            directory: "path"
        },
        get outputSchema() {
            return MLY()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(A) {
            return A.pattern
        },
        isSearchOrReadCommand() {
            return {
                isSearch: !0,
                isRead: !1
            }
        },
        getPath({
            path: A
        }) {
            return A ? L4(A) : G1()
        },
        async validateInput({
            path: A
        }) {
            if (A) {
                let q = $1(),
                    K = L4(A);
                if (K.startsWith("\\\\") || K.startsWith("//")) return {
                    result: !0
                };
                let Y;
                try {
                    Y = await q.stat(K)
                } catch (z) {
                    if (z.code === "ENOENT") {
                        let _ = await Ft(K),
                            w = `Directory does not exist: ${A}. ${wZ} ${G1()}.`;
                        if (_) w += ` Did you mean ${_}?`;
                        return {
                            result: !1,
                            message: w,
                            errorCode: 1
                        }
                    }
                    throw z
                }
                if (!Y.isDirectory()) return {
                    result: !1,
                    message: `Path is not a directory: ${A}`,
                    errorCode: 2
                }
            }
            return {
                result: !0
            }
        },
        async checkPermissions(A, q) {
            let K = q.getAppState();
            return gt(rg, A, K.toolPermissionContext)
        },
        async prompt() {
            return tw8
        },
        renderToolUseMessage: Ks4,
        renderToolUseRejectedMessage: Ys4,
        renderToolUseErrorMessage: zs4,
        renderToolUseProgressMessage: _s4,
        renderToolResultMessage: ws4,
        async call(A, {
            abortController: q,
            getAppState: K,
            globLimits: Y
        }) {
            let z = Date.now(),
                _ = K(),
                w = Y?.maxResults ?? 100,
                {
                    files: O,
                    truncated: $
                } = await $s4(A.pattern, rg.getPath(A), {
                    limit: w,
                    offset: 0
                }, q.signal, _.toolPermissionContext);
            return {
                data: {
                    filenames: O,
                    durationMs: Date.now() - z,
                    numFiles: O.length,
                    truncated: $
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            if (A.filenames.length === 0) return {
                tool_use_id: q,
                type: "tool_result",
                content: "No files found"
            };
            return {
                tool_use_id: q,
                type: "tool_result",
                content: [...A.filenames, ...A.truncated ? ["(Results are truncated. Consider using a more specific path or pattern.)"] : []].join(`
`)
            }
        }
    }
})
// @from(Ln 346126, Col 4)
Hs4 = "Replace the contents of a specific cell in a Jupyter notebook."
// @from(Ln 346127, Col 4)
js4 = "Completely replaces the contents of a specific cell in a Jupyter notebook (.ipynb file) with new source. Jupyter notebooks are interactive documents that combine code, text, and visualizations, commonly used for data analysis and scientific computing. The notebook_path parameter must be an absolute path, not a relative path. The cell_number is 0-indexed. Use edit_mode=insert to add a new cell at the index specified by cell_number. Use edit_mode=delete to delete the cell at the index specified by cell_number."
// @from(Ln 346132, Col 0)
function Js4(A) {
    let q = A6(20),
        {
            notebook_path: K,
            cell_id: Y,
            new_source: z,
            cell_type: _,
            edit_mode: w,
            verbose: O
        } = A,
        $ = w === void 0 ? "replace" : w,
        H = $ === "delete" ? "delete" : `${$} cell in`,
        j;
    if (q[0] !== H) j = x0.createElement(T, {
        color: "subtle"
    }, "User rejected ", H, " "), q[0] = H, q[1] = j;
    else j = q[1];
    let J;
    if (q[2] !== K || q[3] !== O) J = O ? K : DLY(G1(), K), q[2] = K, q[3] = O, q[4] = J;
    else J = q[4];
    let M;
    if (q[5] !== J) M = x0.createElement(T, {
        bold: !0,
        color: "subtle"
    }, J), q[5] = J, q[6] = M;
    else M = q[6];
    let D;
    if (q[7] !== Y) D = x0.createElement(T, {
        color: "subtle"
    }, " at cell ", Y), q[7] = Y, q[8] = D;
    else D = q[8];
    let X;
    if (q[9] !== j || q[10] !== M || q[11] !== D) X = x0.createElement(m, {
        flexDirection: "row"
    }, j, M, D), q[9] = j, q[10] = M, q[11] = D, q[12] = X;
    else X = q[12];
    let P;
    if (q[13] !== _ || q[14] !== $ || q[15] !== z) P = $ !== "delete" && x0.createElement(m, {
        marginTop: 1,
        flexDirection: "column"
    }, x0.createElement(bf, {
        code: z,
        filePath: _ === "markdown" ? "file.md" : "file.py",
        dim: !0
    })), q[13] = _, q[14] = $, q[15] = z, q[16] = P;
    else P = q[16];
    let W;
    if (q[17] !== X || q[18] !== P) W = x0.createElement(t1, null, x0.createElement(m, {
        flexDirection: "column"
    }, X, P)), q[17] = X, q[18] = P, q[19] = W;
    else W = q[19];
    return W
}
// @from(Ln 346185, Col 4)
x0
// @from(Ln 346186, Col 4)
Ms4 = E(() => {
    e6();
    i6();
    lA();
    iq();
    U66();
    x0 = t(P6(), 1)
})
// @from(Ln 346195, Col 0)
function $B8(A) {
    if (!A?.notebook_path) return null;
    return $K(A.notebook_path)
}
// @from(Ln 346200, Col 0)
function Ds4({
    notebook_path: A,
    cell_id: q,
    new_source: K,
    cell_type: Y,
    edit_mode: z
}, {
    verbose: _
}) {
    if (!A || !K || !Y) return null;
    let w = _ ? A : $K(A);
    if (_) return O9.createElement(O9.Fragment, null, O9.createElement(Qk, {
        filePath: A
    }, w), `@${q}, content: ${K.slice(0,30)}…, cell_type: ${Y}, edit_mode: ${z??"replace"}`);
    return O9.createElement(O9.Fragment, null, O9.createElement(Qk, {
        filePath: A
    }, w), `@${q}`)
}
// @from(Ln 346219, Col 0)
function Xs4(A, {
    verbose: q
}) {
    return O9.createElement(Js4, {
        notebook_path: A.notebook_path,
        cell_id: A.cell_id,
        new_source: A.new_source,
        cell_type: A.cell_type,
        edit_mode: A.edit_mode,
        verbose: q
    })
}
// @from(Ln 346232, Col 0)
function Ps4(A, {
    verbose: q
}) {
    if (!q && typeof A === "string" && d4(A, "tool_use_error")) return O9.createElement(t1, null, O9.createElement(T, {
        color: "error"
    }, "Error editing notebook"));
    return O9.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 346244, Col 0)
function Ws4() {
    return null
}
// @from(Ln 346248, Col 0)
function Zs4({
    cell_id: A,
    new_source: q,
    error: K
}) {
    if (K) return O9.createElement(t1, null, O9.createElement(T, {
        color: "error"
    }, K));
    return O9.createElement(t1, null, O9.createElement(m, {
        flexDirection: "column"
    }, O9.createElement(T, null, "Updated cell ", O9.createElement(T, {
        bold: !0
    }, A), ":"), O9.createElement(m, {
        marginLeft: 2
    }, O9.createElement(bf, {
        code: q,
        filePath: "notebook.py"
    }))))
}
// @from(Ln 346267, Col 4)
O9
// @from(Ln 346268, Col 4)
Gs4 = E(() => {
    i6();
    ZW6();
    U66();
    Ms4();
    iq();
    kO();
    JA();
    Z7();
    O9 = t(P6(), 1)
})
// @from(Ln 346284, Col 4)
PLY
// @from(Ln 346284, Col 9)
WLY
// @from(Ln 346284, Col 14)
Vl
// @from(Ln 346285, Col 4)
Rl6 = E(() => {
    K7();
    MP1();
    Z7();
    K_();
    lA();
    RY();
    JN();
    Gs4();
    g1();
    PLY = F6(() => C.strictObject({
        notebook_path: C.string().describe("The absolute path to the Jupyter notebook file to edit (must be absolute, not relative)"),
        cell_id: C.string().optional().describe("The ID of the cell to edit. When inserting a new cell, the new cell will be inserted after the cell with this ID, or at the beginning if not specified."),
        new_source: C.string().describe("The new source for the cell"),
        cell_type: C.enum(["code", "markdown"]).optional().describe("The type of the cell (code or markdown). If not specified, it defaults to the current cell type. If using edit_mode=insert, this is required."),
        edit_mode: C.enum(["replace", "insert", "delete"]).optional().describe("The type of edit to make (replace, insert, delete). Defaults to replace.")
    })), WLY = F6(() => C.object({
        new_source: C.string().describe("The new source code that was written to the cell"),
        cell_id: C.string().optional().describe("The ID of the cell that was edited"),
        cell_type: C.enum(["code", "markdown"]).describe("The type of the cell"),
        language: C.string().describe("The programming language of the notebook"),
        edit_mode: C.string().describe("The edit mode that was used"),
        error: C.string().optional().describe("Error message if the operation failed"),
        notebook_path: C.string().describe("The path to the notebook file"),
        original_file: C.string().describe("The original notebook content before modification"),
        updated_file: C.string().describe("The updated notebook content after modification")
    })), Vl = {
        name: bJ,
        searchHint: "edit Jupyter notebook cells (.ipynb)",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        async description() {
            return Hs4
        },
        async prompt() {
            return js4
        },
        userFacingName() {
            return "Edit Notebook"
        },
        getToolUseSummary: $B8,
        getActivityDescription(A) {
            let q = $B8(A);
            return q ? `Editing notebook ${q}` : "Editing notebook"
        },
        isEnabled() {
            return !0
        },
        get inputSchema() {
            return PLY()
        },
        get outputSchema() {
            return WLY()
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput(A) {
            {
                let q = A.edit_mode ?? "replace";
                return `${A.notebook_path} ${q}: ${A.new_source}`
            }
            return ""
        },
        getPath(A) {
            return A.notebook_path
        },
        async checkPermissions(A, q) {
            let K = q.getAppState();
            return Xz6(Vl, A, K.toolPermissionContext)
        },
        mapToolResultToToolResultBlockParam({
            cell_id: A,
            edit_mode: q,
            new_source: K,
            error: Y
        }, z) {
            if (Y) return {
                tool_use_id: z,
                type: "tool_result",
                content: Y,
                is_error: !0
            };
            switch (q) {
                case "replace":
                    return {
                        tool_use_id: z, type: "tool_result", content: `Updated cell ${A} with ${K}`
                    };
                case "insert":
                    return {
                        tool_use_id: z, type: "tool_result", content: `Inserted cell ${A} with ${K}`
                    };
                case "delete":
                    return {
                        tool_use_id: z, type: "tool_result", content: `Deleted cell ${A}`
                    };
                default:
                    return {
                        tool_use_id: z, type: "tool_result", content: "Unknown edit mode"
                    }
            }
        },
        renderToolUseMessage: Ds4,
        renderToolUseRejectedMessage: Xs4,
        renderToolUseErrorMessage: Ps4,
        renderToolUseProgressMessage: Ws4,
        renderToolResultMessage: Zs4,
        async validateInput({
            notebook_path: A,
            cell_type: q,
            cell_id: K,
            edit_mode: Y = "replace"
        }) {
            let z = fs4(A) ? A : Ts4(G1(), A);
            if (z.startsWith("\\\\") || z.startsWith("//")) return {
                result: !0
            };
            if (XLY(z) !== ".ipynb") return {
                result: !1,
                message: "File must be a Jupyter notebook (.ipynb file). For editing other file types, use the FileEdit tool.",
                errorCode: 2
            };
            if (Y !== "replace" && Y !== "insert" && Y !== "delete") return {
                result: !1,
                message: "Edit mode must be replace, insert, or delete.",
                errorCode: 4
            };
            if (Y === "insert" && !q) return {
                result: !1,
                message: "Cell type is required when using edit_mode=insert.",
                errorCode: 5
            };
            let _;
            try {
                _ = i66(z).content
            } catch (O) {
                if (O.code === "ENOENT") return {
                    result: !1,
                    message: "Notebook file does not exist.",
                    errorCode: 1
                };
                throw O
            }
            let w = WK(_);
            if (!w) return {
                result: !1,
                message: "Notebook is not valid JSON.",
                errorCode: 6
            };
            if (!K) {
                if (Y !== "insert") return {
                    result: !1,
                    message: "Cell ID must be specified when not inserting a new cell.",
                    errorCode: 7
                }
            } else if (w.cells.findIndex(($) => $.id === K) === -1) {
                let $ = Kp6(K);
                if ($ !== void 0) {
                    if (!w.cells[$]) return {
                        result: !1,
                        message: `Cell with index ${$} does not exist in notebook.`,
                        errorCode: 7
                    }
                } else return {
                    result: !1,
                    message: `Cell with ID "${K}" not found in notebook.`,
                    errorCode: 8
                }
            }
            return {
                result: !0
            }
        },
        async call({
            notebook_path: A,
            new_source: q,
            cell_id: K,
            cell_type: Y,
            edit_mode: z
        }, {
            updateFileHistoryState: _
        }, w, O) {
            let $ = fs4(A) ? A : Ts4(G1(), A);
            if (iz()) await R66(_, $, O.uuid);
            try {
                let {
                    content: H,
                    encoding: j,
                    lineEndings: J
                } = i66($), M = i1(H), D;
                if (!K) D = 0;
                else {
                    if (D = M.cells.findIndex((f) => f.id === K), D === -1) {
                        let f = Kp6(K);
                        if (f !== void 0) D = f
                    }
                    if (z === "insert") D += 1
                }
                let X = z;
                if (X === "replace" && D === M.cells.length) {
                    if (X = "insert", !Y) Y = "code"
                }
                let P = M.metadata.language_info?.name ?? "python",
                    W = void 0;
                if (M.nbformat > 4 || M.nbformat === 4 && M.nbformat_minor >= 5) {
                    if (X === "insert") W = Math.random().toString(36).substring(2, 15);
                    else if (K !== null) W = K
                }
                if (X === "delete") M.cells.splice(D, 1);
                else if (X === "insert") {
                    let f;
                    if (Y === "markdown") f = {
                        cell_type: "markdown",
                        id: W,
                        source: q,
                        metadata: {}
                    };
                    else f = {
                        cell_type: "code",
                        id: W,
                        source: q,
                        metadata: {},
                        execution_count: null,
                        outputs: []
                    };
                    M.cells.splice(D, 0, f)
                } else {
                    let f = M.cells[D];
                    if (f.source = q, f.cell_type === "code") f.execution_count = null, f.outputs = [];
                    if (Y && Y !== f.cell_type) f.cell_type = Y
                }
                let Z = B6(M, null, 1);
                return l66($, Z, j, J), {
                    data: {
                        new_source: q,
                        cell_type: Y ?? "code",
                        language: P,
                        edit_mode: X ?? "replace",
                        cell_id: W || void 0,
                        error: "",
                        notebook_path: $,
                        original_file: H,
                        updated_file: Z
                    }
                }
            } catch (H) {
                if (H instanceof Error) return {
                    data: {
                        new_source: q,
                        cell_type: Y ?? "code",
                        language: "python",
                        edit_mode: "replace",
                        error: H.message,
                        cell_id: K,
                        notebook_path: $,
                        original_file: "",
                        updated_file: ""
                    }
                };
                return {
                    data: {
                        new_source: q,
                        cell_type: Y ?? "code",
                        language: "python",
                        edit_mode: "replace",
                        error: "Unknown error occurred while editing notebook",
                        cell_id: K,
                        notebook_path: $,
                        original_file: "",
                        updated_file: ""
                    }
                }
            }
        }
    }
})
// @from(Ln 346564, Col 4)
eV1
// @from(Ln 346565, Col 4)
HB8 = E(() => {
    eV1 = new Set(["platform.claude.com", "code.claude.com", "modelcontextprotocol.io", "github.com/anthropics", "agentskills.io", "docs.python.org", "en.cppreference.com", "docs.oracle.com", "learn.microsoft.com", "developer.mozilla.org", "go.dev", "pkg.go.dev", "www.php.net", "docs.swift.org", "kotlinlang.org", "ruby-doc.org", "doc.rust-lang.org", "www.typescriptlang.org", "react.dev", "angular.io", "vuejs.org", "nextjs.org", "expressjs.com", "nodejs.org", "bun.sh", "jquery.com", "getbootstrap.com", "tailwindcss.com", "d3js.org", "threejs.org", "redux.js.org", "webpack.js.org", "jestjs.io", "reactrouter.com", "docs.djangoproject.com", "flask.palletsprojects.com", "fastapi.tiangolo.com", "pandas.pydata.org", "numpy.org", "www.tensorflow.org", "pytorch.org", "scikit-learn.org", "matplotlib.org", "requests.readthedocs.io", "jupyter.org", "laravel.com", "symfony.com", "wordpress.org", "docs.spring.io", "hibernate.org", "tomcat.apache.org", "gradle.org", "maven.apache.org", "asp.net", "dotnet.microsoft.com", "nuget.org", "blazor.net", "reactnative.dev", "docs.flutter.dev", "developer.apple.com", "developer.android.com", "keras.io", "spark.apache.org", "huggingface.co", "www.kaggle.com", "www.mongodb.com", "redis.io", "www.postgresql.org", "dev.mysql.com", "www.sqlite.org", "graphql.org", "prisma.io", "docs.aws.amazon.com", "cloud.google.com", "learn.microsoft.com", "kubernetes.io", "www.docker.com", "www.terraform.io", "www.ansible.com", "vercel.com/docs", "docs.netlify.com", "devcenter.heroku.com/", "cypress.io", "selenium.dev", "docs.unity.com", "docs.unrealengine.com", "git-scm.com", "nginx.org", "httpd.apache.org"])
})
// @from(Ln 346575, Col 0)
function vs4(A, q) {
    switch (A) {
        case "toolResult":
            return "Plain text";
        case "structuredContent":
            return q ? `JSON with schema: ${q}` : "JSON";
        case "contentArray":
            return q ? `JSON array with schema: ${q}` : "JSON array"
    }
}
// @from(Ln 346586, Col 0)
function Ns4(A, q, K, Y) {
    let z = `Error: result (${q.toLocaleString()} characters) exceeds maximum allowed tokens. Output has been saved to ${A}.
Format: ${K}
Use offset and limit parameters to read specific portions of the file, search within it for specific content, and jq to make structured queries.
REQUIREMENTS FOR SUMMARIZATION/ANALYSIS/REVIEW:
- You MUST read the content from the file at ${A} in sequential chunks until 100% of the content has been read.
`,
        _ = Y ? `- If you receive truncation warnings when reading the file ("[N lines truncated]"), reduce the chunk size until you have read 100% of the content without truncation ***DO NOT PROCEED UNTIL YOU HAVE DONE THIS***. Bash output is limited to ${Y.toLocaleString()} chars.
` : `- If you receive truncation warnings when reading the file, reduce the chunk size until you have read 100% of the content without truncation.
`,
        w = `- Before producing ANY summary or analysis, you MUST explicitly describe what portion of the content you have read. ***If you did not read the entire content, you MUST explicitly state this.***
`;
    return z + _ + `- Before producing ANY summary or analysis, you MUST explicitly describe what portion of the content you have read. ***If you did not read the entire content, you MUST explicitly state this.***
`
}
// @from(Ln 346602, Col 0)
function fLY(A) {
    if (!A) return "bin";
    switch ((A.split(";")[0] ?? "").trim().toLowerCase()) {
        case "application/pdf":
            return "pdf";
        case "application/json":
            return "json";
        case "text/csv":
            return "csv";
        case "text/plain":
            return "txt";
        case "text/html":
            return "html";
        case "text/markdown":
            return "md";
        case "application/zip":
            return "zip";
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return "docx";
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            return "xlsx";
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            return "pptx";
        case "application/msword":
            return "doc";
        case "application/vnd.ms-excel":
            return "xls";
        case "audio/mpeg":
            return "mp3";
        case "audio/wav":
            return "wav";
        case "audio/ogg":
            return "ogg";
        case "video/mp4":
            return "mp4";
        case "video/webm":
            return "webm";
        case "image/png":
            return "png";
        case "image/jpeg":
            return "jpg";
        case "image/gif":
            return "gif";
        case "image/webp":
            return "webp";
        case "image/svg+xml":
            return "svg";
        default:
            return "bin"
    }
}
// @from(Ln 346654, Col 0)
function Vs4(A) {
    if (!A) return !1;
    let q = (A.split(";")[0] ?? "").trim().toLowerCase();
    if (q.startsWith("text/")) return !1;
    if (q.endsWith("+json") || q === "application/json") return !1;
    if (q.endsWith("+xml") || q === "application/xml") return !1;
    if (q.startsWith("application/javascript")) return !1;
    if (q === "application/x-www-form-urlencoded") return !1;
    return !0
}
// @from(Ln 346664, Col 0)
async function _T6(A, q, K) {
    await zp6();
    let Y = fLY(q),
        z = ZLY(xt(), `${K}.${Y}`);
    try {
        await GLY(z, A)
    } catch (_) {
        let w = _ instanceof Error ? _ : Error(String(_));
        return _6(w), {
            error: w.message
        }
    }
    return d("tengu_binary_content_persisted", {
        mimeType: q ?? "unknown",
        sizeBytes: A.length,
        ext: Y
    }), {
        filepath: z,
        size: A.length,
        ext: Y
    }
}
// @from(Ln 346687, Col 0)
function Ak1(A, q, K, Y) {
    return `${Y}Binary content (${q||"unknown type"}, ${xq(K)}) saved to ${A}`
}
// @from(Ln 346690, Col 4)
qk1 = E(() => {
    Z7();
    k1();
    V1();
    ZR()
})
// @from(Ln 346696, Col 4)
wT6 = x((Nrw, ks4) => {
    ks4.exports = Zz6;
    Zz6.CAPTURING_PHASE = 1;
    Zz6.AT_TARGET = 2;
    Zz6.BUBBLING_PHASE = 3;

    function Zz6(A, q) {
        if (this.type = "", this.target = null, this.currentTarget = null, this.eventPhase = Zz6.AT_TARGET, this.bubbles = !1, this.cancelable = !1, this.isTrusted = !1, this.defaultPrevented = !1, this.timeStamp = Date.now(), this._propagationStopped = !1, this._immediatePropagationStopped = !1, this._initialized = !0, this._dispatching = !1, A) this.type = A;
        if (q)
            for (var K in q) this[K] = q[K]
    }
    Zz6.prototype = Object.create(Object.prototype, {
        constructor: {
            value: Zz6
        },
        stopPropagation: {
            value: function() {
                this._propagationStopped = !0
            }
        },
        stopImmediatePropagation: {
            value: function() {
                this._propagationStopped = !0, this._immediatePropagationStopped = !0
            }
        },
        preventDefault: {
            value: function() {
                if (this.cancelable) this.defaultPrevented = !0
            }
        },
        initEvent: {
            value: function(q, K, Y) {
                if (this._initialized = !0, this._dispatching) return;
                this._propagationStopped = !1, this._immediatePropagationStopped = !1, this.defaultPrevented = !1, this.isTrusted = !1, this.target = null, this.type = q, this.bubbles = K, this.cancelable = Y
            }
        }
    })
})
// @from(Ln 346734, Col 4)
JB8 = x((Vrw, ys4) => {
    var Es4 = wT6();
    ys4.exports = jB8;

    function jB8() {
        Es4.call(this), this.view = null, this.detail = 0
    }
    jB8.prototype = Object.create(Es4.prototype, {
        constructor: {
            value: jB8
        },
        initUIEvent: {
            value: function(A, q, K, Y, z) {
                this.initEvent(A, q, K), this.view = Y, this.detail = z
            }
        }
    })
})
// @from(Ln 346752, Col 4)
DB8 = x((krw, Rs4) => {
    var Ls4 = JB8();
    Rs4.exports = MB8;

    function MB8() {
        Ls4.call(this), this.screenX = this.screenY = this.clientX = this.clientY = 0, this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = !1, this.button = 0, this.buttons = 1, this.relatedTarget = null
    }
    MB8.prototype = Object.create(Ls4.prototype, {
        constructor: {
            value: MB8
        },
        initMouseEvent: {
            value: function(A, q, K, Y, z, _, w, O, $, H, j, J, M, D, X) {
                switch (this.initEvent(A, q, K, Y, z), this.screenX = _, this.screenY = w, this.clientX = O, this.clientY = $, this.ctrlKey = H, this.altKey = j, this.shiftKey = J, this.metaKey = M, this.button = D, D) {
                    case 0:
                        this.buttons = 1;
                        break;
                    case 1:
                        this.buttons = 4;
                        break;
                    case 2:
                        this.buttons = 2;
                        break;
                    default:
                        this.buttons = 0;
                        break
                }
                this.relatedTarget = X
            }
        },
        getModifierState: {
            value: function(A) {
                switch (A) {
                    case "Alt":
                        return this.altKey;
                    case "Control":
                        return this.ctrlKey;
                    case "Shift":
                        return this.shiftKey;
                    case "Meta":
                        return this.metaKey;
                    default:
                        return !1
                }
            }
        }
    })
})
// @from(Ln 346800, Col 4)
zk1 = x((Erw, Ss4) => {
    Ss4.exports = Yk1;
    var TLY = 1,
        vLY = 3,
        NLY = 4,
        VLY = 5,
        kLY = 7,
        ELY = 8,
        yLY = 9,
        LLY = 11,
        RLY = 12,
        hLY = 13,
        SLY = 14,
        CLY = 15,
        ILY = 17,
        bLY = 18,
        xLY = 19,
        uLY = 20,
        mLY = 21,
        BLY = 22,
        gLY = 23,
        FLY = 24,
        pLY = 25,
        QLY = [null, "INDEX_SIZE_ERR", null, "HIERARCHY_REQUEST_ERR", "WRONG_DOCUMENT_ERR", "INVALID_CHARACTER_ERR", null, "NO_MODIFICATION_ALLOWED_ERR", "NOT_FOUND_ERR", "NOT_SUPPORTED_ERR", "INUSE_ATTRIBUTE_ERR", "INVALID_STATE_ERR", "SYNTAX_ERR", "INVALID_MODIFICATION_ERR", "NAMESPACE_ERR", "INVALID_ACCESS_ERR", null, "TYPE_MISMATCH_ERR", "SECURITY_ERR", "NETWORK_ERR", "ABORT_ERR", "URL_MISMATCH_ERR", "QUOTA_EXCEEDED_ERR", "TIMEOUT_ERR", "INVALID_NODE_TYPE_ERR", "DATA_CLONE_ERR"],
        ULY = [null, "INDEX_SIZE_ERR (1): the index is not in the allowed range", null, "HIERARCHY_REQUEST_ERR (3): the operation would yield an incorrect nodes model", "WRONG_DOCUMENT_ERR (4): the object is in the wrong Document, a call to importNode is required", "INVALID_CHARACTER_ERR (5): the string contains invalid characters", null, "NO_MODIFICATION_ALLOWED_ERR (7): the object can not be modified", "NOT_FOUND_ERR (8): the object can not be found here", "NOT_SUPPORTED_ERR (9): this operation is not supported", "INUSE_ATTRIBUTE_ERR (10): setAttributeNode called on owned Attribute", "INVALID_STATE_ERR (11): the object is in an invalid state", "SYNTAX_ERR (12): the string did not match the expected pattern", "INVALID_MODIFICATION_ERR (13): the object can not be modified in this way", "NAMESPACE_ERR (14): the operation is not allowed by Namespaces in XML", "INVALID_ACCESS_ERR (15): the object does not support the operation or argument", null, "TYPE_MISMATCH_ERR (17): the type of the object does not match the expected type", "SECURITY_ERR (18): the operation is insecure", "NETWORK_ERR (19): a network error occurred", "ABORT_ERR (20): the user aborted an operation", "URL_MISMATCH_ERR (21): the given URL does not match another URL", "QUOTA_EXCEEDED_ERR (22): the quota has been exceeded", "TIMEOUT_ERR (23): a timeout occurred", "INVALID_NODE_TYPE_ERR (24): the supplied node is invalid or has an invalid ancestor for this operation", "DATA_CLONE_ERR (25): the object can not be cloned."],
        hs4 = {
            INDEX_SIZE_ERR: TLY,
            DOMSTRING_SIZE_ERR: 2,
            HIERARCHY_REQUEST_ERR: vLY,
            WRONG_DOCUMENT_ERR: NLY,
            INVALID_CHARACTER_ERR: VLY,
            NO_DATA_ALLOWED_ERR: 6,
            NO_MODIFICATION_ALLOWED_ERR: kLY,
            NOT_FOUND_ERR: ELY,
            NOT_SUPPORTED_ERR: yLY,
            INUSE_ATTRIBUTE_ERR: 10,
            INVALID_STATE_ERR: LLY,
            SYNTAX_ERR: RLY,
            INVALID_MODIFICATION_ERR: hLY,
            NAMESPACE_ERR: SLY,
            INVALID_ACCESS_ERR: CLY,
            VALIDATION_ERR: 16,
            TYPE_MISMATCH_ERR: ILY,
            SECURITY_ERR: bLY,
            NETWORK_ERR: xLY,
            ABORT_ERR: uLY,
            URL_MISMATCH_ERR: mLY,
            QUOTA_EXCEEDED_ERR: BLY,
            TIMEOUT_ERR: gLY,
            INVALID_NODE_TYPE_ERR: FLY,
            DATA_CLONE_ERR: pLY
        };

    function Yk1(A) {
        Error.call(this), Error.captureStackTrace(this, this.constructor), this.code = A, this.message = ULY[A], this.name = QLY[A]
    }
    Yk1.prototype.__proto__ = Error.prototype;
    for (hl6 in hs4) Kk1 = {
        value: hs4[hl6]
    }, Object.defineProperty(Yk1, hl6, Kk1), Object.defineProperty(Yk1.prototype, hl6, Kk1);
    var Kk1, hl6
})
// @from(Ln 346862, Col 4)
_k1 = x((dLY) => {
    dLY.isApiWritable = !globalThis.__domino_frozen__
})
// @from(Ln 346865, Col 4)
Hj = x((iLY) => {
    var $j = zk1(),
        KJ = $j,
        lLY = _k1().isApiWritable;
    iLY.NAMESPACE = {
        HTML: "http://www.w3.org/1999/xhtml",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/",
        MATHML: "http://www.w3.org/1998/Math/MathML",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink"
    };
    iLY.IndexSizeError = function() {
        throw new $j(KJ.INDEX_SIZE_ERR)
    };
    iLY.HierarchyRequestError = function() {
        throw new $j(KJ.HIERARCHY_REQUEST_ERR)
    };
    iLY.WrongDocumentError = function() {
        throw new $j(KJ.WRONG_DOCUMENT_ERR)
    };
    iLY.InvalidCharacterError = function() {
        throw new $j(KJ.INVALID_CHARACTER_ERR)
    };
    iLY.NoModificationAllowedError = function() {
        throw new $j(KJ.NO_MODIFICATION_ALLOWED_ERR)
    };
    iLY.NotFoundError = function() {
        throw new $j(KJ.NOT_FOUND_ERR)
    };
    iLY.NotSupportedError = function() {
        throw new $j(KJ.NOT_SUPPORTED_ERR)
    };
    iLY.InvalidStateError = function() {
        throw new $j(KJ.INVALID_STATE_ERR)
    };
    iLY.SyntaxError = function() {
        throw new $j(KJ.SYNTAX_ERR)
    };
    iLY.InvalidModificationError = function() {
        throw new $j(KJ.INVALID_MODIFICATION_ERR)
    };
    iLY.NamespaceError = function() {
        throw new $j(KJ.NAMESPACE_ERR)
    };
    iLY.InvalidAccessError = function() {
        throw new $j(KJ.INVALID_ACCESS_ERR)
    };
    iLY.TypeMismatchError = function() {
        throw new $j(KJ.TYPE_MISMATCH_ERR)
    };
    iLY.SecurityError = function() {
        throw new $j(KJ.SECURITY_ERR)
    };
    iLY.NetworkError = function() {
        throw new $j(KJ.NETWORK_ERR)
    };
    iLY.AbortError = function() {
        throw new $j(KJ.ABORT_ERR)
    };
    iLY.UrlMismatchError = function() {
        throw new $j(KJ.URL_MISMATCH_ERR)
    };
    iLY.QuotaExceededError = function() {
        throw new $j(KJ.QUOTA_EXCEEDED_ERR)
    };
    iLY.TimeoutError = function() {
        throw new $j(KJ.TIMEOUT_ERR)
    };
    iLY.InvalidNodeTypeError = function() {
        throw new $j(KJ.INVALID_NODE_TYPE_ERR)
    };
    iLY.DataCloneError = function() {
        throw new $j(KJ.DATA_CLONE_ERR)
    };
    iLY.nyi = function() {
        throw Error("NotYetImplemented")
    };
    iLY.shouldOverride = function() {
        throw Error("Abstract function; should be overriding in subclass.")
    };
    iLY.assert = function(A, q) {
        if (!A) throw Error("Assertion failed: " + (q || "") + `
` + Error().stack)
    };
    iLY.expose = function(A, q) {
        for (var K in A) Object.defineProperty(q.prototype, K, {
            value: A[K],
            writable: lLY
        })
    };
    iLY.merge = function(A, q) {
        for (var K in q) A[K] = q[K]
    };
    iLY.documentOrder = function(A, q) {
        return 3 - (A.compareDocumentPosition(q) & 6)
    };
    iLY.toASCIILowerCase = function(A) {
        return A.replace(/[A-Z]+/g, function(q) {
            return q.toLowerCase()
        })
    };
    iLY.toASCIIUpperCase = function(A) {
        return A.replace(/[a-z]+/g, function(q) {
            return q.toUpperCase()
        })
    }
})
// @from(Ln 346973, Col 4)
XB8 = x((Rrw, Is4) => {
    var Gz6 = wT6(),
        VRY = DB8(),
        kRY = Hj();
    Is4.exports = Cs4;

    function Cs4() {}
    Cs4.prototype = {
        addEventListener: function(q, K, Y) {
            if (!K) return;
            if (Y === void 0) Y = !1;
            if (!this._listeners) this._listeners = Object.create(null);
            if (!this._listeners[q]) this._listeners[q] = [];
            var z = this._listeners[q];
            for (var _ = 0, w = z.length; _ < w; _++) {
                var O = z[_];
                if (O.listener === K && O.capture === Y) return
            }
            var $ = {
                listener: K,
                capture: Y
            };
            if (typeof K === "function") $.f = K;
            z.push($)
        },
        removeEventListener: function(q, K, Y) {
            if (Y === void 0) Y = !1;
            if (this._listeners) {
                var z = this._listeners[q];
                if (z)
                    for (var _ = 0, w = z.length; _ < w; _++) {
                        var O = z[_];
                        if (O.listener === K && O.capture === Y) {
                            if (z.length === 1) this._listeners[q] = void 0;
                            else z.splice(_, 1);
                            return
                        }
                    }
            }
        },
        dispatchEvent: function(q) {
            return this._dispatchEvent(q, !1)
        },
        _dispatchEvent: function(q, K) {
            if (typeof K !== "boolean") K = !1;

            function Y(H, j) {
                var {
                    type: J,
                    eventPhase: M
                } = j;
                if (j.currentTarget = H, M !== Gz6.CAPTURING_PHASE && H._handlers && H._handlers[J]) {
                    var D = H._handlers[J],
                        X;
                    if (typeof D === "function") X = D.call(j.currentTarget, j);
                    else {
                        var P = D.handleEvent;
                        if (typeof P !== "function") throw TypeError("handleEvent property of event handler object isnot a function.");
                        X = P.call(D, j)
                    }
                    switch (j.type) {
                        case "mouseover":
                            if (X === !0) j.preventDefault();
                            break;
                        case "beforeunload":
                        default:
                            if (X === !1) j.preventDefault();
                            break
                    }
                }
                var W = H._listeners && H._listeners[J];
                if (!W) return;
                W = W.slice();
                for (var Z = 0, G = W.length; Z < G; Z++) {
                    if (j._immediatePropagationStopped) return;
                    var f = W[Z];
                    if (M === Gz6.CAPTURING_PHASE && !f.capture || M === Gz6.BUBBLING_PHASE && f.capture) continue;
                    if (f.f) f.f.call(j.currentTarget, j);
                    else {
                        var v = f.listener.handleEvent;
                        if (typeof v !== "function") throw TypeError("handleEvent property of event listener object is not a function.");
                        v.call(f.listener, j)
                    }
                }
            }
            if (!q._initialized || q._dispatching) kRY.InvalidStateError();
            q.isTrusted = K, q._dispatching = !0, q.target = this;
            var z = [];
            for (var _ = this.parentNode; _; _ = _.parentNode) z.push(_);
            q.eventPhase = Gz6.CAPTURING_PHASE;
            for (var w = z.length - 1; w >= 0; w--)
                if (Y(z[w], q), q._propagationStopped) break;
            if (!q._propagationStopped) q.eventPhase = Gz6.AT_TARGET, Y(this, q);
            if (q.bubbles && !q._propagationStopped) {
                q.eventPhase = Gz6.BUBBLING_PHASE;
                for (var O = 0, $ = z.length; O < $; O++)
                    if (Y(z[O], q), q._propagationStopped) break
            }
            if (q._dispatching = !1, q.eventPhase = Gz6.AT_TARGET, q.currentTarget = null, K && !q.defaultPrevented && q instanceof VRY) switch (q.type) {
                case "mousedown":
                    this._armed = {
                        x: q.clientX,
                        y: q.clientY,
                        t: q.timeStamp
                    };
                    break;
                case "mouseout":
                case "mouseover":
                    this._armed = null;
                    break;
                case "mouseup":
                    if (this._isClick(q)) this._doClick(q);
                    this._armed = null;
                    break
            }
            return !q.defaultPrevented
        },
        _isClick: function(A) {
            return this._armed !== null && A.type === "mouseup" && A.isTrusted && A.button === 0 && A.timeStamp - this._armed.t < 1000 && Math.abs(A.clientX - this._armed.x) < 10 && Math.abs(A.clientY - this._armed.Y) < 10
        },
        _doClick: function(A) {
            if (this._click_in_progress) return;
            this._click_in_progress = !0;
            var q = this;
            while (q && !q._post_click_activation_steps) q = q.parentNode;
            if (q && q._pre_click_activation_steps) q._pre_click_activation_steps();
            var K = this.ownerDocument.createEvent("MouseEvent");
            K.initMouseEvent("click", !0, !0, this.ownerDocument.defaultView, 1, A.screenX, A.screenY, A.clientX, A.clientY, A.ctrlKey, A.altKey, A.shiftKey, A.metaKey, A.button, null);
            var Y = this._dispatchEvent(K, !0);
            if (q) {
                if (Y) {
                    if (q._post_click_activation_steps) q._post_click_activation_steps(K)
                } else if (q._cancelled_activation_steps) q._cancelled_activation_steps()
            }
        },
        _setEventHandler: function(q, K) {
            if (!this._handlers) this._handlers = Object.create(null);
            this._handlers[q] = K
        },
        _getEventHandler: function(q) {
            return this._handlers && this._handlers[q] || null
        }
    }
})
// @from(Ln 347117, Col 4)
PB8 = x((hrw, bs4) => {
    var kl = Hj(),
        Mh = bs4.exports = {
            valid: function(A) {
                return kl.assert(A, "list falsy"), kl.assert(A._previousSibling, "previous falsy"), kl.assert(A._nextSibling, "next falsy"), !0
            },
            insertBefore: function(A, q) {
                kl.assert(Mh.valid(A) && Mh.valid(q));
                var K = A,
                    Y = A._previousSibling,
                    z = q,
                    _ = q._previousSibling;
                K._previousSibling = _, Y._nextSibling = z, _._nextSibling = K, z._previousSibling = Y, kl.assert(Mh.valid(A) && Mh.valid(q))
            },
            replace: function(A, q) {
                if (kl.assert(Mh.valid(A) && (q === null || Mh.valid(q))), q !== null) Mh.insertBefore(q, A);
                Mh.remove(A), kl.assert(Mh.valid(A) && (q === null || Mh.valid(q)))
            },
            remove: function(A) {
                kl.assert(Mh.valid(A));
                var q = A._previousSibling;
                if (q === A) return;
                var K = A._nextSibling;
                q._nextSibling = K, K._previousSibling = q, A._previousSibling = A._nextSibling = A, kl.assert(Mh.valid(A))
            }
        }
})
// @from(Ln 347144, Col 4)
WB8 = x((Srw, Qs4) => {
    Qs4.exports = {
        serializeOne: CRY,
        ɵescapeMatchingClosingTag: gs4,
        ɵescapeClosingCommentTag: Fs4,
        ɵescapeProcessingInstructionContent: ps4
    };
    var Bs4 = Hj(),
        fz6 = Bs4.NAMESPACE,
        xs4 = {
            STYLE: !0,
            SCRIPT: !0,
            XMP: !0,
            IFRAME: !0,
            NOEMBED: !0,
            NOFRAMES: !0,
            PLAINTEXT: !0
        },
        ERY = {
            area: !0,
            base: !0,
            basefont: !0,
            bgsound: !0,
            br: !0,
            col: !0,
            embed: !0,
            frame: !0,
            hr: !0,
            img: !0,
            input: !0,
            keygen: !0,
            link: !0,
            meta: !0,
            param: !0,
            source: !0,
            track: !0,
            wbr: !0
        },
        yRY = {},
        us4 = /[&<>\u00A0]/g,
        ms4 = /[&"<>\u00A0]/g;

    function LRY(A) {
        if (!us4.test(A)) return A;
        return A.replace(us4, (q) => {
            switch (q) {
                case "&":
                    return "&amp;";
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
                case " ":
                    return "&nbsp;"
            }
        })
    }

    function RRY(A) {
        if (!ms4.test(A)) return A;
        return A.replace(ms4, (q) => {
            switch (q) {
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
                case "&":
                    return "&amp;";
                case '"':
                    return "&quot;";
                case " ":
                    return "&nbsp;"
            }
        })
    }

    function hRY(A) {
        var q = A.namespaceURI;
        if (!q) return A.localName;
        if (q === fz6.XML) return "xml:" + A.localName;
        if (q === fz6.XLINK) return "xlink:" + A.localName;
        if (q === fz6.XMLNS)
            if (A.localName === "xmlns") return "xmlns";
            else return "xmlns:" + A.localName;
        return A.name
    }

    function gs4(A, q) {
        let K = "</" + q;
        if (!A.toLowerCase().includes(K)) return A;
        let Y = [...A],
            z = A.matchAll(new RegExp(K, "ig"));
        for (let _ of z) Y[_.index] = "&lt;";
        return Y.join("")
    }
    var SRY = /--!?>/;

    function Fs4(A) {
        if (!SRY.test(A)) return A;
        return A.replace(/(--\!?)>/g, "$1&gt;")
    }

    function ps4(A) {
        return A.includes(">") ? A.replaceAll(">", "&gt;") : A
    }

    function CRY(A, q) {
        var K = "";
        switch (A.nodeType) {
            case 1:
                var Y = A.namespaceURI,
                    z = Y === fz6.HTML,
                    _ = z || Y === fz6.SVG || Y === fz6.MATHML ? A.localName : A.tagName;
                K += "<" + _;
                for (var w = 0, O = A._numattrs; w < O; w++) {
                    var $ = A._attr(w);
                    if (K += " " + hRY($), $.value !== void 0) K += '="' + RRY($.value) + '"'
                }
                if (K += ">", !(z && ERY[_])) {
                    var H = A.serialize();
                    if (xs4[_.toUpperCase()]) H = gs4(H, _);
                    if (z && yRY[_] && H.charAt(0) === `
`) K += `
`;
                    K += H, K += "</" + _ + ">"
                }
                break;
            case 3:
            case 4:
                var j;
                if (q.nodeType === 1 && q.namespaceURI === fz6.HTML) j = q.tagName;
                else j = "";
                if (xs4[j] || j === "NOSCRIPT" && q.ownerDocument._scripting_enabled) K += A.data;
                else K += LRY(A.data);
                break;
            case 8:
                K += "<!--" + Fs4(A.data) + "-->";
                break;
            case 7:
                let J = ps4(A.data);
                K += "<?" + A.target + " " + J + "?>";
                break;
            case 10:
                K += "<!DOCTYPE " + A.name, K += ">";
                break;
            default:
                Bs4.InvalidStateError()
        }
        return K
    }
})
// @from(Ln 347295, Col 4)
u0 = x((Crw, ns4) => {
    ns4.exports = Z$;
    var is4 = XB8(),
        wk1 = PB8(),
        Us4 = WB8(),
        oz = Hj();

    function Z$() {
        is4.call(this), this.parentNode = null, this._nextSibling = this._previousSibling = this, this._index = void 0
    }
    var XN = Z$.ELEMENT_NODE = 1,
        ZB8 = Z$.ATTRIBUTE_NODE = 2,
        Ok1 = Z$.TEXT_NODE = 3,
        IRY = Z$.CDATA_SECTION_NODE = 4,
        bRY = Z$.ENTITY_REFERENCE_NODE = 5,
        GB8 = Z$.ENTITY_NODE = 6,
        ds4 = Z$.PROCESSING_INSTRUCTION_NODE = 7,
        cs4 = Z$.COMMENT_NODE = 8,
        Sl6 = Z$.DOCUMENT_NODE = 9,
        Dh = Z$.DOCUMENT_TYPE_NODE = 10,
        n66 = Z$.DOCUMENT_FRAGMENT_NODE = 11,
        fB8 = Z$.NOTATION_NODE = 12,
        TB8 = Z$.DOCUMENT_POSITION_DISCONNECTED = 1,
        vB8 = Z$.DOCUMENT_POSITION_PRECEDING = 2,
        NB8 = Z$.DOCUMENT_POSITION_FOLLOWING = 4,
        ls4 = Z$.DOCUMENT_POSITION_CONTAINS = 8,
        VB8 = Z$.DOCUMENT_POSITION_CONTAINED_BY = 16,
        kB8 = Z$.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
    Z$.prototype = Object.create(is4.prototype, {
        baseURI: {
            get: oz.nyi
        },
        parentElement: {
            get: function() {
                return this.parentNode && this.parentNode.nodeType === XN ? this.parentNode : null
            }
        },
        hasChildNodes: {
            value: oz.shouldOverride
        },
        firstChild: {
            get: oz.shouldOverride
        },
        lastChild: {
            get: oz.shouldOverride
        },
        isConnected: {
            get: function() {
                let A = this;
                while (A != null) {
                    if (A.nodeType === Z$.DOCUMENT_NODE) return !0;
                    if (A = A.parentNode, A != null && A.nodeType === Z$.DOCUMENT_FRAGMENT_NODE) A = A.host
                }
                return !1
            }
        },
        previousSibling: {
            get: function() {
                var A = this.parentNode;
                if (!A) return null;
                if (this === A.firstChild) return null;
                return this._previousSibling
            }
        },
        nextSibling: {
            get: function() {
                var A = this.parentNode,
                    q = this._nextSibling;
                if (!A) return null;
                if (q === A.firstChild) return null;
                return q
            }
        },
        textContent: {
            get: function() {
                return null
            },
            set: function(A) {}
        },
        innerText: {
            get: function() {
                return null
            },
            set: function(A) {}
        },
        _countChildrenOfType: {
            value: function(A) {
                var q = 0;
                for (var K = this.firstChild; K !== null; K = K.nextSibling)
                    if (K.nodeType === A) q++;
                return q
            }
        },
        _ensureInsertValid: {
            value: function(q, K, Y) {
                var z = this,
                    _, w;
                if (!q.nodeType) throw TypeError("not a node");
                switch (z.nodeType) {
                    case Sl6:
                    case n66:
                    case XN:
                        break;
                    default:
                        oz.HierarchyRequestError()
                }
                if (q.isAncestor(z)) oz.HierarchyRequestError();
                if (K !== null || !Y) {
                    if (K.parentNode !== z) oz.NotFoundError()
                }
                switch (q.nodeType) {
                    case n66:
                    case Dh:
                    case XN:
                    case Ok1:
                    case ds4:
                    case cs4:
                        break;
                    default:
                        oz.HierarchyRequestError()
                }
                if (z.nodeType === Sl6) switch (q.nodeType) {
                    case Ok1:
                        oz.HierarchyRequestError();
                        break;
                    case n66:
                        if (q._countChildrenOfType(Ok1) > 0) oz.HierarchyRequestError();
                        switch (q._countChildrenOfType(XN)) {
                            case 0:
                                break;
                            case 1:
                                if (K !== null) {
                                    if (Y && K.nodeType === Dh) oz.HierarchyRequestError();
                                    for (w = K.nextSibling; w !== null; w = w.nextSibling)
                                        if (w.nodeType === Dh) oz.HierarchyRequestError()
                                }
                                if (_ = z._countChildrenOfType(XN), Y) {
                                    if (_ > 0) oz.HierarchyRequestError()
                                } else if (_ > 1 || _ === 1 && K.nodeType !== XN) oz.HierarchyRequestError();
                                break;
                            default:
                                oz.HierarchyRequestError()
                        }
                        break;
                    case XN:
                        if (K !== null) {
                            if (Y && K.nodeType === Dh) oz.HierarchyRequestError();
                            for (w = K.nextSibling; w !== null; w = w.nextSibling)
                                if (w.nodeType === Dh) oz.HierarchyRequestError()
                        }
                        if (_ = z._countChildrenOfType(XN), Y) {
                            if (_ > 0) oz.HierarchyRequestError()
                        } else if (_ > 1 || _ === 1 && K.nodeType !== XN) oz.HierarchyRequestError();
                        break;
                    case Dh:
                        if (K === null) {
                            if (z._countChildrenOfType(XN)) oz.HierarchyRequestError()
                        } else
                            for (w = z.firstChild; w !== null; w = w.nextSibling) {
                                if (w === K) break;
                                if (w.nodeType === XN) oz.HierarchyRequestError()
                            }
                        if (_ = z._countChildrenOfType(Dh), Y) {
                            if (_ > 0) oz.HierarchyRequestError()
                        } else if (_ > 1 || _ === 1 && K.nodeType !== Dh) oz.HierarchyRequestError();
                        break
                } else if (q.nodeType === Dh) oz.HierarchyRequestError()
            }
        },
        insertBefore: {
            value: function(q, K) {
                var Y = this;
                Y._ensureInsertValid(q, K, !0);
                var z = K;
                if (z === q) z = q.nextSibling;
                return Y.doc.adoptNode(q), q._insertOrReplace(Y, z, !1), q
            }
        },
        appendChild: {
            value: function(A) {
                return this.insertBefore(A, null)
            }
        },
        _appendChild: {
            value: function(A) {
                A._insertOrReplace(this, null, !1)
            }
        },
        removeChild: {
            value: function(q) {
                var K = this;
                if (!q.nodeType) throw TypeError("not a node");
                if (q.parentNode !== K) oz.NotFoundError();
                return q.remove(), q
            }
        },
        replaceChild: {
            value: function(q, K) {
                var Y = this;
                if (Y._ensureInsertValid(q, K, !1), q.doc !== Y.doc) Y.doc.adoptNode(q);
                return q._insertOrReplace(Y, K, !0), K
            }
        },
        contains: {
            value: function(q) {
                if (q === null) return !1;
                if (this === q) return !0;
                return (this.compareDocumentPosition(q) & VB8) !== 0
            }
        },
        compareDocumentPosition: {
            value: function(q) {
                if (this === q) return 0;
                if (this.doc !== q.doc || this.rooted !== q.rooted) return TB8 + kB8;
                var K = [],
                    Y = [];
                for (var z = this; z !== null; z = z.parentNode) K.push(z);
                for (z = q; z !== null; z = z.parentNode) Y.push(z);
                if (K.reverse(), Y.reverse(), K[0] !== Y[0]) return TB8 + kB8;
                z = Math.min(K.length, Y.length);
                for (var _ = 1; _ < z; _++)
                    if (K[_] !== Y[_])
                        if (K[_].index < Y[_].index) return NB8;
                        else return vB8;
                if (K.length < Y.length) return NB8 + VB8;
                else return vB8 + ls4
            }
        },
        isSameNode: {
            value: function(q) {
                return this === q
            }
        },
        isEqualNode: {
            value: function(q) {
                if (!q) return !1;
                if (q.nodeType !== this.nodeType) return !1;
                if (!this.isEqual(q)) return !1;
                for (var K = this.firstChild, Y = q.firstChild; K && Y; K = K.nextSibling, Y = Y.nextSibling)
                    if (!K.isEqualNode(Y)) return !1;
                return K === null && Y === null
            }
        },
        cloneNode: {
            value: function(A) {
                var q = this.clone();
                if (A)
                    for (var K = this.firstChild; K !== null; K = K.nextSibling) q._appendChild(K.cloneNode(!0));
                return q
            }
        },
        lookupPrefix: {
            value: function(q) {
                var K;
                if (q === "" || q === null || q === void 0) return null;
                switch (this.nodeType) {
                    case XN:
                        return this._lookupNamespacePrefix(q, this);
                    case Sl6:
                        return K = this.documentElement, K ? K.lookupPrefix(q) : null;
                    case GB8:
                    case fB8:
                    case n66:
                    case Dh:
                        return null;
                    case ZB8:
                        return K = this.ownerElement, K ? K.lookupPrefix(q) : null;
                    default:
                        return K = this.parentElement, K ? K.lookupPrefix(q) : null
                }
            }
        },
        lookupNamespaceURI: {
            value: function(q) {
                if (q === "" || q === void 0) q = null;
                var K;
                switch (this.nodeType) {
                    case XN:
                        return oz.shouldOverride();
                    case Sl6:
                        return K = this.documentElement, K ? K.lookupNamespaceURI(q) : null;
                    case GB8:
                    case fB8:
                    case Dh:
                    case n66:
                        return null;
                    case ZB8:
                        return K = this.ownerElement, K ? K.lookupNamespaceURI(q) : null;
                    default:
                        return K = this.parentElement, K ? K.lookupNamespaceURI(q) : null
                }
            }
        },
        isDefaultNamespace: {
            value: function(q) {
                if (q === "" || q === void 0) q = null;
                var K = this.lookupNamespaceURI(null);
                return K === q
            }
        },
        index: {
            get: function() {
                var A = this.parentNode;
                if (this === A.firstChild) return 0;
                var q = A.childNodes;
                if (this._index === void 0 || q[this._index] !== this) {
                    for (var K = 0; K < q.length; K++) q[K]._index = K;
                    oz.assert(q[this._index] === this)
                }
                return this._index
            }
        },
        isAncestor: {
            value: function(A) {
                if (this.doc !== A.doc) return !1;
                if (this.rooted !== A.rooted) return !1;
                for (var q = A; q; q = q.parentNode)
                    if (q === this) return !0;
                return !1
            }
        },
        ensureSameDoc: {
            value: function(A) {
                if (A.ownerDocument === null) A.ownerDocument = this.doc;
                else if (A.ownerDocument !== this.doc) oz.WrongDocumentError()
            }
        },
        removeChildren: {
            value: oz.shouldOverride
        },
        _insertOrReplace: {
            value: function(q, K, Y) {
                var z = this,
                    _, w;
                if (z.nodeType === n66 && z.rooted) oz.HierarchyRequestError();
                if (q._childNodes) {
                    if (_ = K === null ? q._childNodes.length : K.index, z.parentNode === q) {
                        var O = z.index;
                        if (O < _) _--
                    }
                }
                if (Y) {
                    if (K.rooted) K.doc.mutateRemove(K);
                    K.parentNode = null
                }
                var $ = K;
                if ($ === null) $ = q.firstChild;
                var H = z.rooted && q.rooted;
                if (z.nodeType === n66) {
                    var j = [0, Y ? 1 : 0],
                        J;
                    for (var M = z.firstChild; M !== null; M = J) J = M.nextSibling, j.push(M), M.parentNode = q;
                    var D = j.length;
                    if (Y) wk1.replace($, D > 2 ? j[2] : null);
                    else if (D > 2 && $ !== null) wk1.insertBefore(j[2], $);
                    if (q._childNodes) {
                        j[0] = K === null ? q._childNodes.length : K._index, q._childNodes.splice.apply(q._childNodes, j);
                        for (w = 2; w < D; w++) j[w]._index = j[0] + (w - 2)
                    } else if (q._firstChild === K) {
                        if (D > 2) q._firstChild = j[2];
                        else if (Y) q._firstChild = null
                    }
                    if (z._childNodes) z._childNodes.length = 0;
                    else z._firstChild = null;
                    if (q.rooted) {
                        q.modify();
                        for (w = 2; w < D; w++) q.doc.mutateInsert(j[w])
                    }
                } else {
                    if (K === z) return;
                    if (H) z._remove();
                    else if (z.parentNode) z.remove();
                    if (z.parentNode = q, Y) {
                        if (wk1.replace($, z), q._childNodes) z._index = _, q._childNodes[_] = z;
                        else if (q._firstChild === K) q._firstChild = z
                    } else {
                        if ($ !== null) wk1.insertBefore(z, $);
                        if (q._childNodes) z._index = _, q._childNodes.splice(_, 0, z);
                        else if (q._firstChild === K) q._firstChild = z
                    }
                    if (H) q.modify(), q.doc.mutateMove(z);
                    else if (q.rooted) q.modify(), q.doc.mutateInsert(z)
                }
            }
        },
        lastModTime: {
            get: function() {
                if (!this._lastModTime) this._lastModTime = this.doc.modclock;
                return this._lastModTime
            }
        },
        modify: {
            value: function() {
                if (this.doc.modclock) {
                    var A = ++this.doc.modclock;
                    for (var q = this; q; q = q.parentElement)
                        if (q._lastModTime) q._lastModTime = A
                }
            }
        },
        doc: {
            get: function() {
                return this.ownerDocument || this
            }
        },
        rooted: {
            get: function() {
                return !!this._nid
            }
        },
        normalize: {
            value: function() {
                var A;
                for (var q = this.firstChild; q !== null; q = A) {
                    if (A = q.nextSibling, q.normalize) q.normalize();
                    if (q.nodeType !== Z$.TEXT_NODE) continue;
                    if (q.nodeValue === "") {
                        this.removeChild(q);
                        continue
                    }
                    var K = q.previousSibling;
                    if (K === null) continue;
                    else if (K.nodeType === Z$.TEXT_NODE) K.appendData(q.nodeValue), this.removeChild(q)
                }
            }
        },
        serialize: {
            value: function() {
                if (this._innerHTML) return this._innerHTML;
                var A = "";
                for (var q = this.firstChild; q !== null; q = q.nextSibling) A += Us4.serializeOne(q, this);
                return A
            }
        },
        outerHTML: {
            get: function() {
                return Us4.serializeOne(this, {
                    nodeType: 0
                })
            },
            set: oz.nyi
        },
        ELEMENT_NODE: {
            value: XN
        },
        ATTRIBUTE_NODE: {
            value: ZB8
        },
        TEXT_NODE: {
            value: Ok1
        },
        CDATA_SECTION_NODE: {
            value: IRY
        },
        ENTITY_REFERENCE_NODE: {
            value: bRY
        },
        ENTITY_NODE: {
            value: GB8
        },
        PROCESSING_INSTRUCTION_NODE: {
            value: ds4
        },
        COMMENT_NODE: {
            value: cs4
        },
        DOCUMENT_NODE: {
            value: Sl6
        },
        DOCUMENT_TYPE_NODE: {
            value: Dh
        },
        DOCUMENT_FRAGMENT_NODE: {
            value: n66
        },
        NOTATION_NODE: {
            value: fB8
        },
        DOCUMENT_POSITION_DISCONNECTED: {
            value: TB8
        },
        DOCUMENT_POSITION_PRECEDING: {
            value: vB8
        },
        DOCUMENT_POSITION_FOLLOWING: {
            value: NB8
        },
        DOCUMENT_POSITION_CONTAINS: {
            value: ls4
        },
        DOCUMENT_POSITION_CONTAINED_BY: {
            value: VB8
        },
        DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: {
            value: kB8
        }
    })
})
// @from(Ln 347793, Col 4)
os4 = x((Irw, rs4) => {
    rs4.exports = class extends Array {
        constructor(q) {
            super(q && q.length || 0);
            if (q)
                for (var K in q) this[K] = q[K]
        }
        item(q) {
            return this[q] || null
        }
    }
})
// @from(Ln 347805, Col 4)
ss4 = x((brw, as4) => {
    function xRY(A) {
        return this[A] || null
    }

    function uRY(A) {
        if (!A) A = [];
        return A.item = xRY, A
    }
    as4.exports = uRY
})
// @from(Ln 347816, Col 4)
Tz6 = x((xrw, ts4) => {
    var EB8;
    try {
        EB8 = os4()
    } catch (A) {
        EB8 = ss4()
    }
    ts4.exports = EB8
})
// @from(Ln 347825, Col 4)
$k1 = x((urw, qt4) => {
    qt4.exports = At4;
    var es4 = u0(),
        mRY = Tz6();

    function At4() {
        es4.call(this), this._firstChild = this._childNodes = null
    }
    At4.prototype = Object.create(es4.prototype, {
        hasChildNodes: {
            value: function() {
                if (this._childNodes) return this._childNodes.length > 0;
                return this._firstChild !== null
            }
        },
        childNodes: {
            get: function() {
                return this._ensureChildNodes(), this._childNodes
            }
        },
        firstChild: {
            get: function() {
                if (this._childNodes) return this._childNodes.length === 0 ? null : this._childNodes[0];
                return this._firstChild
            }
        },
        lastChild: {
            get: function() {
                var A = this._childNodes,
                    q;
                if (A) return A.length === 0 ? null : A[A.length - 1];
                if (q = this._firstChild, q === null) return null;
                return q._previousSibling
            }
        },
        _ensureChildNodes: {
            value: function() {
                if (this._childNodes) return;
                var A = this._firstChild,
                    q = A,
                    K = this._childNodes = new mRY;
                if (A)
                    do K.push(q), q = q._nextSibling; while (q !== A);
                this._firstChild = null
            }
        },
        removeChildren: {
            value: function() {
                var q = this.rooted ? this.ownerDocument : null,
                    K = this.firstChild,
                    Y;
                while (K !== null) {
                    if (Y = K, K = Y.nextSibling, q) q.mutateRemove(Y);
                    Y.parentNode = null
                }
                if (this._childNodes) this._childNodes.length = 0;
                else this._firstChild = null;
                this.modify()
            }
        }
    })
})
// @from(Ln 347887, Col 4)
Hk1 = x((lRY) => {
    lRY.isValidName = dRY;
    lRY.isValidQName = cRY;
    var BRY = /^[_:A-Za-z][-.:\w]+$/,
        gRY = /^([_A-Za-z][-.\w]+|[_A-Za-z][-.\w]+:[_A-Za-z][-.\w]+)$/,
        Cl6 = "_A-Za-zÀ-ÖØ-öø-˿Ͱ-ͽͿ-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�",
        Il6 = "-._A-Za-z0-9·À-ÖØ-öø-˿̀-ͽͿ-῿‌‍‿⁀⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�",
        vz6 = "[" + Cl6 + "][" + Il6 + "]*",
        yB8 = Cl6 + ":",
        LB8 = Il6 + ":",
        FRY = new RegExp("^[" + yB8 + "][" + LB8 + "]*$"),
        pRY = new RegExp("^(" + vz6 + "|" + vz6 + ":" + vz6 + ")$"),
        Kt4 = /[\uD800-\uDB7F\uDC00-\uDFFF]/,
        Yt4 = /[\uD800-\uDB7F\uDC00-\uDFFF]/g,
        zt4 = /[\uD800-\uDB7F][\uDC00-\uDFFF]/g;
    Cl6 += "\uD800-\uDB7F\uDC00-\uDFFF";
    Il6 += "\uD800-\uDB7F\uDC00-\uDFFF";
    vz6 = "[" + Cl6 + "][" + Il6 + "]*";
    yB8 = Cl6 + ":";
    LB8 = Il6 + ":";
    var QRY = new RegExp("^[" + yB8 + "][" + LB8 + "]*$"),
        URY = new RegExp("^(" + vz6 + "|" + vz6 + ":" + vz6 + ")$");

    function dRY(A) {
        if (BRY.test(A)) return !0;
        if (FRY.test(A)) return !0;
        if (!Kt4.test(A)) return !1;
        if (!QRY.test(A)) return !1;
        var q = A.match(Yt4),
            K = A.match(zt4);
        return K !== null && 2 * K.length === q.length
    }

    function cRY(A) {
        if (gRY.test(A)) return !0;
        if (pRY.test(A)) return !0;
        if (!Kt4.test(A)) return !1;
        if (!URY.test(A)) return !1;
        var q = A.match(Yt4),
            K = A.match(zt4);
        return K !== null && 2 * K.length === q.length
    }
})