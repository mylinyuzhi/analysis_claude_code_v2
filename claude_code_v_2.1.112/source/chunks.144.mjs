
// @from(Ln 365108, Col 0)
async function pU8(q) {
    let K = Buffer.allocUnsafe(d96),
        _ = 0;
    for (;;) {
        if (_ === K.length) {
            let Y = Buffer.allocUnsafe(Math.min(K.length * 2, mU8 + d96));
            K.copy(Y, 0, 0, _), K = Y
        }
        let {
            bytesRead: z
        } = await q.read(K, _, K.length - _, _);
        if (z === 0) break;
        if (_ += z, _ > mU8) return null
    }
    return XPK(K, _)
}
// @from(Ln 365125, Col 0)
function HPK(q, K, _) {
    let z = q.indexOf(K);
    return z === -1 || z + K.length > _ ? -1 : z
}
// @from(Ln 365130, Col 0)
function h47(q, K, _) {
    let z = 0;
    for (let Y = K; Y < _; Y++)
        if (q[Y] === BU8) z++;
    return z
}
// @from(Ln 365137, Col 0)
function XPK(q, K) {
    let _ = q.toString("utf8", 0, K);
    return _.includes("\r") ? _.replaceAll(`\r
`, `
`) : _
}
// @from(Ln 365143, Col 0)
async function H_Y(q, K, _, z, Y, A) {
    let O = Math.min(_, d96),
        {
            bytesRead: w
        } = await q.read(K, 0, O, _ - O),
        $ = _,
        j = 0;
    for (let G = w - 1; G >= 0 && j <= Y; G--) {
        if (K[G] === BU8) {
            if (j++, j > Y) break
        }
        $--
    }
    let H = _ - $,
        J = A - h47(K, w - H, w) + 1,
        X = _ + z,
        {
            bytesRead: M
        } = await q.read(K, 0, d96, X),
        P = X;
    j = 0;
    for (let G = 0; G < M; G++)
        if (P++, K[G] === BU8) {
            if (j++, j >= Y + 1) break
        } let W = P - $,
        D = W <= K.length ? K : Buffer.allocUnsafe(W),
        {
            bytesRead: Z
        } = await q.read(D, 0, W, $);
    return {
        content: XPK(D, Z),
        lineOffset: J,
        truncated: !1
    }
}
// @from(Ln 365178, Col 4)
d96 = 8192
// @from(Ln 365179, Col 4)
mU8 = 10485760
// @from(Ln 365180, Col 4)
BU8 = 10
// @from(Ln 365181, Col 4)
FU8 = L(() => {
    m8()
})
// @from(Ln 365190, Col 0)
function PPK(q) {
    let K = q.split(H58);
    return q.endsWith(H58) ? K.length - 1 : K.length
}
// @from(Ln 365195, Col 0)
function WPK(q, K) {
    let _ = fN6(q, K).height;
    return q.endsWith(H58) ? _ - 1 : _
}
// @from(Ln 365200, Col 0)
function M_Y(q) {
    let K = s(30),
        {
            filePath: _,
            content: z,
            verbose: Y
        } = q,
        {
            columns: A
        } = s1(),
        O = Math.max(1, A - 12),
        w = z || "(No content)",
        $ = PPK(z),
        j;
    if (K[0] !== w || K[1] !== O || K[2] !== Y) j = Y ? w : w.split(H58).slice(0, j58).join(H58).slice(0, j58 * (O + 1)), K[0] = w, K[1] = O, K[2] = Y, K[3] = j;
    else j = K[3];
    let H = j,
        J = Y ? 0 : WPK(w, O) - j58,
        X;
    if (K[4] !== $) X = y5.createElement(T, {
        bold: !0
    }, $), K[4] = $, K[5] = X;
    else X = K[5];
    let M;
    if (K[6] !== _ || K[7] !== Y) M = Y ? _ : MPK(b8(), _), K[6] = _, K[7] = Y, K[8] = M;
    else M = K[8];
    let P;
    if (K[9] !== M) P = y5.createElement(T, {
        bold: !0
    }, M), K[9] = M, K[10] = P;
    else P = K[10];
    let W;
    if (K[11] !== X || K[12] !== P) W = y5.createElement(T, null, "Wrote ", X, " lines to", " ", P), K[11] = X, K[12] = P, K[13] = W;
    else W = K[13];
    let D = Y ? void 0 : "hidden",
        Z = Y ? void 0 : j58,
        G;
    if (K[14] !== H || K[15] !== _ || K[16] !== O) G = y5.createElement(ey, {
        code: H,
        filePath: _,
        width: O
    }), K[14] = H, K[15] = _, K[16] = O, K[17] = G;
    else G = K[17];
    let f;
    if (K[18] !== D || K[19] !== Z || K[20] !== G) f = y5.createElement(u, {
        flexDirection: "column",
        overflowY: D,
        maxHeight: Z
    }, G), K[18] = D, K[19] = Z, K[20] = G, K[21] = f;
    else f = K[21];
    let v;
    if (K[22] !== $ || K[23] !== J || K[24] !== Y) v = !Y && J > 0 && y5.createElement(T, {
        dimColor: !0
    }, "… +", J, " ", J === 1 ? "line" : "lines", " ", $ > 0 && y5.createElement(U2, null)), K[22] = $, K[23] = J, K[24] = Y, K[25] = v;
    else v = K[25];
    let V;
    if (K[26] !== v || K[27] !== W || K[28] !== f) V = y5.createElement(_1, null, y5.createElement(u, {
        flexDirection: "column"
    }, W, f, v)), K[26] = v, K[27] = W, K[28] = f, K[29] = V;
    else V = K[29];
    return V
}
// @from(Ln 365263, Col 0)
function DPK(q) {
    if (q?.file_path?.startsWith(aO())) return "Updated plan";
    return "Write"
}
// @from(Ln 365268, Col 0)
function ZPK({
    type: q,
    content: K
}, {
    columns: _
}) {
    if (q !== "create") return !1;
    return WPK(K, Math.max(1, _ - 12)) > j58
}
// @from(Ln 365278, Col 0)
function S47(q) {
    if (!q?.file_path) return null;
    return S3(q.file_path)
}
// @from(Ln 365283, Col 0)
function fPK(q, {
    verbose: K
}) {
    if (!q.file_path) return null;
    if (q.file_path.startsWith(aO())) return "";
    return y5.createElement(YG, {
        filePath: q.file_path
    }, K ? q.file_path : S3(q.file_path))
}
// @from(Ln 365293, Col 0)
function GPK({
    file_path: q,
    content: K
}, {
    style: _,
    verbose: z
}) {
    return y5.createElement(P_Y, {
        filePath: q,
        content: K,
        style: _,
        verbose: z
    })
}
// @from(Ln 365308, Col 0)
function P_Y(q) {
    let K = s(20),
        {
            filePath: _,
            content: z,
            style: Y,
            verbose: A
        } = q,
        O;
    if (K[0] !== z || K[1] !== _) O = () => D_Y(_, z), K[0] = z, K[1] = _, K[2] = O;
    else O = K[2];
    let [w] = Gb6.useState(O), $;
    if (K[3] !== z) $ = oY(z), K[3] = z, K[4] = $;
    else $ = K[4];
    let j = $,
        H;
    if (K[5] !== z || K[6] !== _ || K[7] !== j || K[8] !== A) H = y5.createElement(Q96, {
        file_path: _,
        operation: "write",
        content: z,
        firstLine: j,
        verbose: A
    }), K[5] = z, K[6] = _, K[7] = j, K[8] = A, K[9] = H;
    else H = K[9];
    let J = H,
        X;
    if (K[10] !== J || K[11] !== w || K[12] !== _ || K[13] !== j || K[14] !== Y || K[15] !== A) X = y5.createElement(W_Y, {
        promise: w,
        filePath: _,
        firstLine: j,
        createFallback: J,
        style: Y,
        verbose: A
    }), K[10] = J, K[11] = w, K[12] = _, K[13] = j, K[14] = Y, K[15] = A, K[16] = X;
    else X = K[16];
    let M;
    if (K[17] !== J || K[18] !== X) M = y5.createElement(Gb6.Suspense, {
        fallback: J
    }, X), K[17] = J, K[18] = X, K[19] = M;
    else M = K[19];
    return M
}
// @from(Ln 365351, Col 0)
function W_Y(q) {
    let K = s(8),
        {
            promise: _,
            filePath: z,
            firstLine: Y,
            createFallback: A,
            style: O,
            verbose: w
        } = q,
        $ = Gb6.use(_);
    if ($.type === "create") return A;
    if ($.type === "error") {
        let H;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) H = y5.createElement(_1, null, y5.createElement(T, null, "(No changes)")), K[0] = H;
        else H = K[0];
        return H
    }
    let j;
    if (K[1] !== $.oldContent || K[2] !== $.patch || K[3] !== z || K[4] !== Y || K[5] !== O || K[6] !== w) j = y5.createElement(Q96, {
        file_path: z,
        operation: "update",
        patch: $.patch,
        firstLine: Y,
        fileContent: $.oldContent,
        style: O,
        verbose: w
    }), K[1] = $.oldContent, K[2] = $.patch, K[3] = z, K[4] = Y, K[5] = O, K[6] = w, K[7] = j;
    else j = K[7];
    return j
}
// @from(Ln 365382, Col 0)
async function D_Y(q, K) {
    try {
        let _ = J_Y(q) ? q : X_Y(b8(), q),
            z = await $58(_);
        if (z === null) return {
            type: "create"
        };
        let Y;
        try {
            Y = await pU8(z)
        } finally {
            await z.close()
        }
        if (Y === null) return {
            type: "create"
        };
        return {
            type: "update",
            patch: Vx({
                filePath: q,
                fileContents: Y,
                edits: [{
                    old_string: Y,
                    new_string: K,
                    replace_all: !1
                }]
            }),
            oldContent: Y
        }
    } catch (_) {
        return j6(_), {
            type: "error"
        }
    }
}
// @from(Ln 365418, Col 0)
function vPK(q, {
    verbose: K
}) {
    if (!K && typeof q === "string" && vK(q, "tool_use_error")) return y5.createElement(_1, null, y5.createElement(T, {
        color: "error"
    }, "Error writing file"));
    return y5.createElement(d$, {
        result: q,
        verbose: K
    })
}
// @from(Ln 365430, Col 0)
function TPK({
    filePath: q = "",
    content: K,
    structuredPatch: _,
    type: z,
    originalFile: Y
}, A, {
    style: O,
    verbose: w
}) {
    if (!q) return null;
    switch (z) {
        case "create": {
            if (q.startsWith(aO()) && !w) {
                if (O !== "condensed") return y5.createElement(_1, null, y5.createElement(T, {
                    dimColor: !0
                }, "/plan to preview"))
            } else if (O === "condensed" && !w) {
                let j = PPK(K);
                return y5.createElement(T, null, "Wrote ", y5.createElement(T, {
                    bold: !0
                }, j), " lines to", " ", y5.createElement(T, {
                    bold: !0
                }, MPK(b8(), q)))
            }
            return y5.createElement(M_Y, {
                filePath: q,
                content: K,
                verbose: w
            })
        }
        case "update": {
            let $ = q.startsWith(aO());
            return y5.createElement(uU8, {
                filePath: q,
                structuredPatch: _,
                firstLine: oY(K),
                fileContent: Y ?? void 0,
                style: O,
                verbose: w,
                previewHint: $ ? "/plan to preview" : void 0
            })
        }
    }
}
// @from(Ln 365475, Col 4)
y5
// @from(Ln 365475, Col 8)
Gb6
// @from(Ln 365475, Col 13)
j58 = 10
// @from(Ln 365476, Col 4)
H58 = `
`
// @from(Ln 365478, Col 4)
VPK = L(() => {
    o6();
    GK();
    _7();
    kk();
    ny();
    y47();
    L47();
    S96();
    MM6();
    I4();
    gI1();
    g6();
    n7();
    Rc();
    eK();
    U8();
    NJ();
    FU8();
    y5 = K6(P6(), 1), Gb6 = K6(P6(), 1)
})
// @from(Ln 365504, Col 4)
v_Y
// @from(Ln 365504, Col 9)
T_Y
// @from(Ln 365504, Col 14)
hX
// @from(Ln 365505, Col 4)
rl = L(() => {
    C8();
    p7();
    Vy6();
    B1();
    aX6();
    uh6();
    nl();
    vy6();
    ol();
    gq();
    n7();
    K8();
    Rc();
    Q8();
    m8();
    eK();
    cy();
    LU8();
    nN();
    FP();
    Yq();
    SU8();
    U8();
    b9();
    Sz();
    NK6();
    A58();
    Rz();
    u$();
    VPK();
    v_Y = C6(() => y.strictObject({
        file_path: y.string().describe("The absolute path to the file to write (must be absolute, not relative)"),
        content: y.string().describe("The content to write to the file")
    })), T_Y = C6(() => y.object({
        type: y.enum(["create", "update"]).describe("Whether a new file was created or an existing file was updated"),
        filePath: y.string().describe("The path to the file that was written"),
        content: y.string().describe("The content that was written to the file"),
        structuredPatch: y.array(f47()).describe("Diff patch showing the changes"),
        originalFile: y.string().nullable().describe("The original file content before the write (null for new files)"),
        gitDiff: G47().optional(),
        userModified: y.boolean().optional().describe("True when the user edited the proposed content in the permission dialog before accepting")
    })), hX = Iq({
        name: IK,
        searchHint: "create or overwrite files",
        maxResultSizeChars: 1e5,
        strict: !0,
        async description() {
            return "Write a file to the local filesystem."
        },
        userFacingName: DPK,
        getToolUseSummary: S47,
        getActivityDescription(q) {
            let K = S47(q);
            return K ? `Writing ${K}` : "Writing file"
        },
        async prompt() {
            return wW4()
        },
        renderToolUseMessage: fPK,
        isResultTruncated: ZPK,
        get inputSchema() {
            return v_Y()
        },
        get outputSchema() {
            return T_Y()
        },
        stripForStorage(q) {
            if (typeof q !== "object" || q === null) return q;
            if (q.type !== "update") return q;
            if (q.content === "" && (q.originalFile ?? "") === "") return q;
            return {
                ...q,
                content: "",
                originalFile: null
            }
        },
        toAutoClassifierInput(q) {
            return `${q.file_path}: ${q.content}`
        },
        getPath(q) {
            return q.file_path
        },
        inputsEquivalent(q, K) {
            if (q.file_path !== K.file_path) return !1;
            if (q.content === K.content) return !0;
            return q.content.replace(/\n+$/, "") === K.content.replace(/\n+$/, "")
        },
        backfillObservableInput(q) {
            if (typeof q.file_path === "string") q.file_path = Wq(q.file_path)
        },
        async preparePermissionMatcher({
            file_path: q
        }) {
            return (K) => Vk(K, q)
        },
        async checkPermissions(q, K) {
            let _ = K.getAppState();
            return PM6(hX, q, _.toolPermissionContext)
        },
        renderToolUseRejectedMessage: GPK,
        renderToolUseErrorMessage: vPK,
        renderToolResultMessage: TPK,
        extractSearchText() {
            return ""
        },
        async validateInput({
            file_path: q,
            content: K
        }, _) {
            let z = Wq(q);
            if (u8("tengu_sub_nomdrep_q7k", !1) && _.agentId && /^(REPORT|SUMMARY|FINDINGS|ANALYSIS).*\.md$/i.test(Z_Y(z))) return d("tengu_subagent_md_report_blocked", {
                contentBytes: Buffer.byteLength(K)
            }), {
                result: !1,
                message: "Subagents should return findings as text, not write report files. Include this content in your final response instead.",
                errorCode: 5
            };
            let Y = yU8(z, K);
            if (Y) return {
                result: !1,
                message: Y,
                errorCode: 0
            };
            let A = _.getAppState();
            if (ZJ(z, A.toolPermissionContext, "edit", "deny") !== null) return {
                result: !1,
                message: "File is in a directory that is denied by your permission settings.",
                errorCode: 1
            };
            if (z.startsWith("\\\\") || z.startsWith("//")) return {
                result: !0
            };
            let w = V8(),
                $;
            try {
                let J = await w.stat(z);
                if ($ = J.mtimeMs, gf6(J.mode)) return {
                    result: !1,
                    message: Ff6,
                    errorCode: 6
                }
            } catch (J) {
                if (t1(J)) return {
                    result: !0
                };
                throw J
            }
            let j = _.readFileState.get(z);
            if (!j || j.isPartialView) return {
                result: !1,
                message: "File has not been read yet. Read it first before writing to it.",
                errorCode: 2
            };
            if (Math.floor($) > j.timestamp) {
                let J = (j.offset ?? 1) <= 1 && j.limit === void 0,
                    X = !1;
                if (J) {
                    let P = (await w.readFileBytes(z)).toString("utf8").replaceAll(`\r
`, `
`);
                    X = Ac(j, P)
                }
                if (!X) return {
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
            file_path: q,
            content: K
        }, {
            readFileState: _,
            userModified: z,
            getFileHistoryState: Y,
            applyFileHistoryOp: A,
            dynamicSkillDirTriggers: O
        }, w, $) {
            let j = Wq(q),
                H = f_Y(j),
                J = b8(),
                X = await vb6([j], J);
            if (X.length > 0) {
                for (let f of X) O?.add(f);
                Tb6(X).catch(() => {})
            }
            if (Vb6([j], J), await we.beforeFileEdited(j), await V8().mkdir(H), kO()) await M96(Y, A, j, $.uuid);
            let M;
            try {
                M = iC(j)
            } catch (f) {
                if (t1(f)) M = null;
                else throw f
            }
            if (M !== null) {
                let f = _.get(j);
                if (!f) throw Error(NL8);
                if (Av(j) > f.timestamp) {
                    if (!((f.offset ?? 1) <= 1 && f.limit === void 0 && Ac(f, M.content))) throw Error(EL8)
                }
            }
            let P = M?.encoding ?? "utf8",
                W = M?.content ?? null;
            K = XR8(j, K), S16(j, K, P, "LF");
            let D = F96();
            if (D) kI8(j), NI8(j), D.changeFile(j, K).catch((f) => {
                E(`LSP: Failed to notify server of file change for ${j}: ${f.message}`), j6(f)
            }), D.saveFile(j).catch((f) => {
                E(`LSP: Failed to notify server of file save for ${j}: ${f.message}`), j6(f)
            });
            if (EK6(j, W, K), _.set(j, {
                    content: K,
                    timestamp: Av(j),
                    offset: void 0,
                    limit: void 0
                }), j.endsWith(`${G_Y}CLAUDE.md`)) d("tengu_write_claudemd", {});
            let Z;
            if (S6(process.env.CLAUDE_CODE_REMOTE)) {
                let f = Date.now(),
                    v = await RU8(j);
                if (v) Z = v;
                d("tengu_tool_use_diff_computed", {
                    isWriteTool: !0,
                    durationMs: Date.now() - f,
                    hasDiff: !!v
                })
            }
            if (W) {
                let f = U56({
                        filePath: q,
                        oldContent: W,
                        newContent: K,
                        convertTabs: !0
                    }),
                    v = {
                        type: "update",
                        filePath: q,
                        content: K,
                        structuredPatch: f,
                        originalFile: W,
                        userModified: z ?? !1,
                        ...Z && {
                            gitDiff: Z
                        }
                    };
                return g88(f), cF({
                    operation: "write",
                    tool: "FileWriteTool",
                    filePath: j,
                    type: "update"
                }), {
                    data: v
                }
            }
            let G = {
                type: "create",
                filePath: q,
                content: K,
                structuredPatch: [],
                originalFile: null,
                userModified: z ?? !1,
                ...Z && {
                    gitDiff: Z
                }
            };
            return g88([], K), cF({
                operation: "write",
                tool: "FileWriteTool",
                filePath: j,
                type: "create"
            }), {
                data: G
            }
        },
        mapToolResultToToolResultBlockParam({
            filePath: q,
            type: K,
            userModified: _
        }, z) {
            let Y = _ ? " The user modified your proposed content before accepting it." : "",
                A = qN6() && !_ ? ok8 : "";
            switch (K) {
                case "create":
                    return {
                        tool_use_id: z, type: "tool_result", content: `File created successfully at: ${q}${Y}${A}`
                    };
                case "update":
                    return {
                        tool_use_id: z, type: "tool_result", content: `The file ${q} has been updated successfully.${Y}${A}`
                    }
            }
        }
    })
})
// @from(Ln 365813, Col 0)
function L_Y() {
    return {
        cachedExclusions: null
    }
}
// @from(Ln 365818, Col 0)
async function WM6(q) {
    let K = EPK,
        _ = NPK(N_Y(gP(), "cache"));
    if (q && !h_Y(q, _)) return [];
    if (K.cachedExclusions !== null) return K.cachedExclusions;
    try {
        let z = await dd(["--files", "--hidden", "--no-ignore", "--max-depth", "4", "--glob", y_Y], _, new AbortController().signal);
        return K.cachedExclusions = z.map((Y) => {
            let A = V_Y(Y);
            return `!**/${(k_Y(A)?E_Y(_,A):A).replaceAll("\\","/")}/**`
        }), K.cachedExclusions
    } catch {
        return K.cachedExclusions = [], K.cachedExclusions
    }
}
// @from(Ln 365834, Col 0)
function yPK() {
    EPK.cachedExclusions = null
}
// @from(Ln 365838, Col 0)
function h_Y(q, K) {
    let _ = kPK(q),
        z = kPK(K);
    return _ === z || _ === gU8 || z === gU8 || _.startsWith(z + gU8) || z.startsWith(_ + gU8)
}
// @from(Ln 365844, Col 0)
function kPK(q) {
    let K = NPK(q);
    return process.platform === "win32" ? K.toLowerCase() : K
}
// @from(Ln 365848, Col 4)
y_Y = ".orphaned_at"
// @from(Ln 365849, Col 4)
EPK
// @from(Ln 365850, Col 4)
J58 = L(() => {
    BI();
    Jy();
    EPK = L_Y()
})
// @from(Ln 365863, Col 0)
function I_Y(q) {
    let K = /[*?[{]/,
        _ = q.match(K);
    if (!_ || _.index === void 0) {
        let w = C_Y(q),
            $ = S_Y(q);
        return {
            baseDir: w,
            relativePattern: $
        }
    }
    let z = q.slice(0, _.index),
        Y = Math.max(z.lastIndexOf("/"), z.lastIndexOf(hPK));
    if (Y === -1) return {
        baseDir: "",
        relativePattern: q
    };
    let A = z.slice(0, Y),
        O = q.slice(Y + 1);
    if (A === "" && Y === 0) A = "/";
    if (y1() === "windows" && /^[A-Za-z]:$/.test(A)) A = A + hPK;
    return {
        baseDir: A,
        relativePattern: O
    }
}
// @from(Ln 365889, Col 0)
async function RPK(q, K, {
    limit: _,
    offset: z
}, Y, A) {
    let O = K,
        w = q;
    if (LPK(q)) {
        let {
            baseDir: G,
            relativePattern: f
        } = I_Y(q);
        if (G) O = G, w = f
    }
    let $ = kb6(Nb6(A), O),
        j = S6(process.env.CLAUDE_CODE_GLOB_NO_IGNORE || "true"),
        H = S6(process.env.CLAUDE_CODE_GLOB_HIDDEN || "true"),
        J = ["--files", "--glob", w, "--sort=modified", ...j ? ["--no-ignore"] : [], ...H ? ["--hidden"] : []];
    for (let G of $) J.push("--glob", `!${G}`);
    for (let G of await WM6(O)) J.push("--glob", G);
    let X = null,
        M, P = !1;
    M = await dd(J, O, Y);
    let W = M.map((G) => LPK(G) ? G : b_Y(O, G)),
        D = P || W.length > z + _;
    return {
        files: W.slice(z, z + _),
        truncated: D
    }
}
// @from(Ln 365918, Col 4)
SPK = L(() => {
    Q8();
    Sz();
    NK();
    J58();
    BI()
})
// @from(Ln 365926, Col 0)
function qL(q = y.number()) {
    return y.preprocess((K) => {
        if (typeof K === "string" && /^-?\d+(\.\d+)?$/.test(K)) {
            let _ = Number(K);
            if (Number.isFinite(_)) return _
        }
        return K
    }, q)
}
// @from(Ln 365935, Col 4)
X58 = L(() => {
    p7()
})
// @from(Ln 365939, Col 0)
function C47(q) {
    let K = s(26),
        {
            count: _,
            countLabel: z,
            secondaryCount: Y,
            secondaryLabel: A,
            content: O,
            verbose: w
        } = q,
        $;
    if (K[0] !== _) $ = RX.default.createElement(T, {
        bold: !0
    }, _, " "), K[0] = _, K[1] = $;
    else $ = K[1];
    let j;
    if (K[2] !== _ || K[3] !== z) j = _ === 0 || _ > 1 ? z : z.slice(0, -1), K[2] = _, K[3] = z, K[4] = j;
    else j = K[4];
    let H;
    if (K[5] !== $ || K[6] !== j) H = RX.default.createElement(T, null, "Found ", $, j), K[5] = $, K[6] = j, K[7] = H;
    else H = K[7];
    let J = H,
        X;
    if (K[8] !== Y || K[9] !== A) X = Y !== void 0 && A ? RX.default.createElement(T, null, " ", "across ", RX.default.createElement(T, {
        bold: !0
    }, Y, " "), Y === 0 || Y > 1 ? A : A.slice(0, -1)) : null, K[8] = Y, K[9] = A, K[10] = X;
    else X = K[10];
    let M = X;
    if (w) {
        let D;
        if (K[11] === Symbol.for("react.memo_cache_sentinel")) D = RX.default.createElement(T, {
            dimColor: !0
        }, "  ⎿  "), K[11] = D;
        else D = K[11];
        let Z;
        if (K[12] !== J || K[13] !== M) Z = RX.default.createElement(u, {
            flexDirection: "row"
        }, RX.default.createElement(T, null, D, J, M)), K[12] = J, K[13] = M, K[14] = Z;
        else Z = K[14];
        let G;
        if (K[15] !== O) G = RX.default.createElement(u, {
            marginLeft: 5
        }, RX.default.createElement(T, null, O)), K[15] = O, K[16] = G;
        else G = K[16];
        let f;
        if (K[17] !== Z || K[18] !== G) f = RX.default.createElement(u, {
            flexDirection: "column"
        }, Z, G), K[17] = Z, K[18] = G, K[19] = f;
        else f = K[19];
        return f
    }
    let P;
    if (K[20] !== _) P = _ > 0 && RX.default.createElement(U2, null), K[20] = _, K[21] = P;
    else P = K[21];
    let W;
    if (K[22] !== J || K[23] !== M || K[24] !== P) W = RX.default.createElement(_1, {
        height: 1
    }, RX.default.createElement(T, null, J, M, " ", P)), K[22] = J, K[23] = M, K[24] = P, K[25] = W;
    else W = K[25];
    return W
}
// @from(Ln 366001, Col 0)
function CPK({
    pattern: q,
    path: K
}, {
    verbose: _
}) {
    if (!q) return null;
    let z = [`pattern: "${q}"`];
    if (K) z.push(`path: "${_?K:S3(K)}"`);
    return z.join(", ")
}
// @from(Ln 366013, Col 0)
function bPK(q, {
    verbose: K
}) {
    if (!K && typeof q === "string" && vK(q, "tool_use_error")) {
        if (vK(q, "tool_use_error")?.includes(Ov)) return RX.default.createElement(_1, null, RX.default.createElement(T, {
            color: "error"
        }, "File not found"));
        return RX.default.createElement(_1, null, RX.default.createElement(T, {
            color: "error"
        }, "Error searching files"))
    }
    return RX.default.createElement(d$, {
        result: q,
        verbose: K
    })
}
// @from(Ln 366030, Col 0)
function IPK({
    mode: q = "files_with_matches",
    filenames: K,
    numFiles: _,
    content: z,
    numLines: Y,
    numMatches: A
}, O, {
    verbose: w
}) {
    if (q === "content") return RX.default.createElement(C47, {
        count: Y ?? 0,
        countLabel: "lines",
        content: z,
        verbose: w
    });
    if (q === "count") return RX.default.createElement(C47, {
        count: A ?? 0,
        countLabel: "matches",
        secondaryCount: _,
        secondaryLabel: "files",
        content: z,
        verbose: w
    });
    let $ = K.map((j) => j).join(`
`);
    return RX.default.createElement(C47, {
        count: _,
        countLabel: "files",
        content: $,
        verbose: w
    })
}
// @from(Ln 366064, Col 0)
function b47(q) {
    if (!q?.pattern) return null;
    return w5(q.pattern, av)
}
// @from(Ln 366068, Col 4)
RX
// @from(Ln 366069, Col 4)
xPK = L(() => {
    o6();
    kk();
    ny();
    GK();
    g6();
    eK();
    c7();
    _7();
    RX = K6(P6(), 1)
})
// @from(Ln 366081, Col 0)
function I47(q, K, _ = 0) {
    if (K === 0) return {
        items: q.slice(_),
        appliedLimit: void 0
    };
    let z = K ?? B_Y,
        Y = q.slice(_, _ + z),
        A = q.length - _ > z;
    return {
        items: Y,
        appliedLimit: A ? z : void 0
    }
}
// @from(Ln 366095, Col 0)
function x47(q, K) {
    let _ = [];
    if (q !== void 0) _.push(`limit: ${q}`);
    if (K) _.push(`offset: ${K}`);
    return _.join(", ")
}
// @from(Ln 366101, Col 4)
u_Y
// @from(Ln 366101, Col 9)
m_Y
// @from(Ln 366101, Col 14)
B_Y = 250
// @from(Ln 366102, Col 4)
p_Y
// @from(Ln 366102, Col 9)
_N
// @from(Ln 366103, Col 4)
c96 = L(() => {
    p7();
    gq();
    n7();
    m8();
    eK();
    Yq();
    b9();
    Sz();
    NK6();
    J58();
    BI();
    g96();
    X58();
    jJ();
    xPK();
    u_Y = C6(() => y.strictObject({
        pattern: y.string().describe("The regular expression pattern to search for in file contents"),
        path: y.string().optional().describe("File or directory to search in (rg PATH). Defaults to current working directory."),
        glob: y.string().optional().describe('Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}") - maps to rg --glob'),
        output_mode: y.enum(["content", "files_with_matches", "count"]).optional().describe('Output mode: "content" shows matching lines (supports -A/-B/-C context, -n line numbers, head_limit), "files_with_matches" shows file paths (supports head_limit), "count" shows match counts (supports head_limit). Defaults to "files_with_matches".'),
        "-B": qL(y.number().optional()).describe('Number of lines to show before each match (rg -B). Requires output_mode: "content", ignored otherwise.'),
        "-A": qL(y.number().optional()).describe('Number of lines to show after each match (rg -A). Requires output_mode: "content", ignored otherwise.'),
        "-C": qL(y.number().optional()).describe("Alias for context."),
        context: qL(y.number().optional()).describe('Number of lines to show before and after each match (rg -C). Requires output_mode: "content", ignored otherwise.'),
        "-n": _W(y.boolean().optional()).describe('Show line numbers in output (rg -n). Requires output_mode: "content", ignored otherwise. Defaults to true.'),
        "-i": _W(y.boolean().optional()).describe("Case insensitive search (rg -i)"),
        type: y.string().optional().describe("File type to search (rg --type). Common types: js, py, rust, go, java, etc. More efficient than include for standard file types."),
        head_limit: qL(y.number().optional()).describe('Limit output to first N lines/entries, equivalent to "| head -N". Works across all output modes: content (limits output lines), files_with_matches (limits file paths), count (limits count entries). Defaults to 250 when unspecified. Pass 0 for unlimited (use sparingly — large result sets waste context).'),
        offset: qL(y.number().optional()).describe('Skip first N lines/entries before applying head_limit, equivalent to "| tail -n +N | head -N". Works across all output modes. Defaults to 0.'),
        multiline: _W(y.boolean().optional()).describe("Enable multiline mode where . matches newlines and patterns can span lines (rg -U --multiline-dotall). Default: false.")
    })), m_Y = [".git", ".svn", ".hg", ".bzr", ".jj", ".sl"];
    p_Y = C6(() => y.object({
        mode: y.enum(["content", "files_with_matches", "count"]).optional(),
        numFiles: y.number(),
        filenames: y.array(y.string()),
        content: y.string().optional(),
        numLines: y.number().optional(),
        numMatches: y.number().optional(),
        appliedLimit: y.number().optional(),
        appliedOffset: y.number().optional()
    })), _N = Iq({
        name: a5,
        searchHint: "search file contents with regex (ripgrep)",
        maxResultSizeChars: 20000,
        strict: !0,
        async description() {
            return yb1()
        },
        userFacingName() {
            return "Search"
        },
        getToolUseSummary: b47,
        getActivityDescription(q) {
            let K = b47(q);
            return K ? `Searching for ${K}` : "Searching"
        },
        get inputSchema() {
            return u_Y()
        },
        get outputSchema() {
            return p_Y()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.path ? `${q.pattern} in ${q.path}` : q.pattern
        },
        isSearchOrReadCommand() {
            return {
                isSearch: !0,
                isRead: !1
            }
        },
        getPath({
            path: q
        }) {
            return q || b8()
        },
        async preparePermissionMatcher({
            pattern: q
        }) {
            return (K) => Vk(K, q)
        },
        async validateInput({
            path: q
        }) {
            if (q) {
                let K = V8(),
                    _ = Wq(q);
                if (_.startsWith("\\\\") || _.startsWith("//")) return {
                    result: !0
                };
                try {
                    await K.stat(_)
                } catch (z) {
                    if (t1(z)) {
                        let Y = await C16(_),
                            A = `Path does not exist: ${q}. ${Ov} ${b8()}.`;
                        if (Y) A += ` Did you mean ${Y}?`;
                        return {
                            result: !1,
                            message: A,
                            errorCode: 1
                        }
                    }
                    throw z
                }
            }
            return {
                result: !0
            }
        },
        async checkPermissions(q, K) {
            let _ = K.getAppState();
            return l96(_N, q, _.toolPermissionContext)
        },
        async prompt() {
            return yb1()
        },
        renderToolUseMessage: CPK,
        renderToolUseErrorMessage: bPK,
        renderToolResultMessage: IPK,
        extractSearchText({
            mode: q,
            content: K,
            filenames: _
        }) {
            if (q === "content" && K) return K;
            return _.join(`
`)
        },
        mapToolResultToToolResultBlockParam({
            mode: q = "files_with_matches",
            numFiles: K,
            filenames: _,
            content: z,
            numLines: Y,
            numMatches: A,
            appliedLimit: O,
            appliedOffset: w
        }, $) {
            if (q === "content") {
                let J = x47(O, w),
                    X = z || "No matches found",
                    M = J ? `${X}

[Showing results with pagination = ${J}]` : X;
                return {
                    tool_use_id: $,
                    type: "tool_result",
                    content: M
                }
            }
            if (q === "count") {
                let J = x47(O, w),
                    X = z || "No matches found",
                    M = A ?? 0,
                    P = K ?? 0,
                    W = `

Found ${M} total ${M===1?"occurrence":"occurrences"} across ${P} ${P===1?"file":"files"}.${J?` with pagination = ${J}`:""}`;
                return {
                    tool_use_id: $,
                    type: "tool_result",
                    content: X + W
                }
            }
            let j = x47(O, w);
            if (K === 0) return {
                tool_use_id: $,
                type: "tool_result",
                content: "No files found"
            };
            let H = `Found ${K} ${O7(K,"file")}${j?` ${j}`:""}
${_.join(`
`)}`;
            return {
                tool_use_id: $,
                type: "tool_result",
                content: H
            }
        },
        async call({
            pattern: q,
            path: K,
            glob: _,
            type: z,
            output_mode: Y = "files_with_matches",
            "-B": A,
            "-A": O,
            "-C": w,
            context: $,
            "-n": j = !0,
            "-i": H = !1,
            head_limit: J,
            offset: X = 0,
            multiline: M = !1
        }, {
            abortController: P,
            getAppState: W
        }) {
            let D = K ? Wq(K) : b8(),
                Z = ["--hidden"];
            for (let B of m_Y) Z.push("--glob", `!${B}`);
            if (Z.push("--max-columns", "500"), M) Z.push("-U", "--multiline-dotall");
            if (H) Z.push("-i");
            if (Y === "files_with_matches") Z.push("-l");
            else if (Y === "count") Z.push("-c");
            if (j && Y === "content") Z.push("-n");
            if (Y === "content")
                if ($ !== void 0) Z.push("-C", $.toString());
                else if (w !== void 0) Z.push("-C", w.toString());
            else {
                if (A !== void 0) Z.push("-B", A.toString());
                if (O !== void 0) Z.push("-A", O.toString())
            }
            if (q.startsWith("-")) Z.push("-e", q);
            else Z.push(q);
            if (z) Z.push("--type", z);
            if (_) {
                let B = [],
                    m = _.split(/\s+/);
                for (let S of m)
                    if (S.includes("{") && S.includes("}")) B.push(S);
                    else B.push(...S.split(",").filter(Boolean));
                for (let S of B.filter(Boolean)) Z.push("--glob", S)
            }
            let G = W(),
                f = kb6(Nb6(G.toolPermissionContext), b8());
            for (let B of f) {
                let m = B.startsWith("/") ? `!${B}` : `!**/${B}`;
                Z.push("--glob", m)
            }
            for (let B of await WM6(D)) Z.push("--glob", B);
            let v, V = null;
            if (v = await dd(Z, D, P.signal), Y === "content") {
                let {
                    items: B,
                    appliedLimit: m
                } = I47(v, J, X), S = B.map((U) => {
                    let g = U.indexOf(":");
                    if (g > 0) {
                        let c = U.substring(0, g),
                            n = U.substring(g);
                        return Bf6(c) + n
                    }
                    return U
                });
                return {
                    data: {
                        mode: "content",
                        numFiles: 0,
                        filenames: [],
                        content: S.join(`
`),
                        numLines: S.length,
                        ...m !== void 0 && {
                            appliedLimit: m
                        },
                        ...X > 0 && {
                            appliedOffset: X
                        }
                    }
                }
            }
            if (Y === "count") {
                let {
                    items: B,
                    appliedLimit: m
                } = I47(v, J, X), S = B.map((c) => {
                    let n = c.lastIndexOf(":");
                    if (n > 0) {
                        let l = c.substring(0, n),
                            z6 = c.substring(n);
                        return Bf6(l) + z6
                    }
                    return c
                }), F = 0, U = 0;
                for (let c of S) {
                    let n = c.lastIndexOf(":");
                    if (n > 0) {
                        let l = c.substring(n + 1),
                            z6 = parseInt(l, 10);
                        if (!isNaN(z6)) F += z6, U += 1
                    }
                }
                return {
                    data: {
                        mode: "count",
                        numFiles: U,
                        filenames: [],
                        content: S.join(`
`),
                        numMatches: F,
                        ...m !== void 0 && {
                            appliedLimit: m
                        },
                        ...X > 0 && {
                            appliedOffset: X
                        }
                    }
                }
            }
            let k = await Promise.allSettled(v.map((B) => V8().stat(B))),
                N = v.map((B, m) => {
                    let S = k[m];
                    return [B, S.status === "fulfilled" ? S.value.mtimeMs ?? 0 : 0]
                }).sort((B, m) => {
                    let S = m[1] - B[1];
                    if (S === 0) return B[0].localeCompare(m[0]);
                    return S
                }).map((B) => B[0]),
                {
                    items: R,
                    appliedLimit: h
                } = I47(N, J, X),
                C = R.map(Bf6);
            return {
                data: {
                    mode: "files_with_matches",
                    filenames: C,
                    numFiles: C.length,
                    ...h !== void 0 && {
                        appliedLimit: h
                    },
                    ...X > 0 && {
                        appliedOffset: X
                    }
                }
            }
        }
    })
})
// @from(Ln 366442, Col 0)
function uPK() {
    return "Search"
}
// @from(Ln 366446, Col 0)
function mPK({
    pattern: q,
    path: K
}, {
    verbose: _
}) {
    if (!q) return null;
    if (!K) return `pattern: "${q}"`;
    return `pattern: "${q}", path: "${_?K:S3(K)}"`
}
// @from(Ln 366457, Col 0)
function BPK(q, {
    verbose: K
}) {
    if (!K && typeof q === "string" && vK(q, "tool_use_error")) {
        if (vK(q, "tool_use_error")?.includes(Ov)) return Eb6.default.createElement(_1, null, Eb6.default.createElement(T, {
            color: "error"
        }, "File not found"));
        return Eb6.default.createElement(_1, null, Eb6.default.createElement(T, {
            color: "error"
        }, "Error searching files"))
    }
    return Eb6.default.createElement(d$, {
        result: q,
        verbose: K
    })
}
// @from(Ln 366474, Col 0)
function u47(q) {
    if (!q?.pattern) return null;
    return w5(q.pattern, av)
}
// @from(Ln 366478, Col 4)
Eb6
// @from(Ln 366478, Col 9)
pPK
// @from(Ln 366479, Col 4)
FPK = L(() => {
    GK();
    _7();
    ny();
    g6();
    eK();
    c7();
    c96();
    Eb6 = K6(P6(), 1);
    pPK = _N.renderToolResultMessage
})
// @from(Ln 366490, Col 4)
F_Y
// @from(Ln 366490, Col 9)
g_Y
// @from(Ln 366490, Col 14)
Au
// @from(Ln 366491, Col 4)
yb6 = L(() => {
    p7();
    gq();
    n7();
    m8();
    eK();
    Yq();
    SPK();
    b9();
    Sz();
    NK6();
    FPK();
    F_Y = C6(() => y.strictObject({
        pattern: y.string().describe("The glob pattern to match files against"),
        path: y.string().optional().describe('The directory to search in. If not specified, the current working directory will be used. IMPORTANT: Omit this field to use the default directory. DO NOT enter "undefined" or "null" - simply omit it for the default behavior. Must be a valid directory path if provided.')
    })), g_Y = C6(() => y.object({
        durationMs: y.number().describe("Time taken to execute the search in milliseconds"),
        numFiles: y.number().describe("Total number of files found"),
        filenames: y.array(y.string()).describe("Array of file paths that match the pattern"),
        truncated: y.boolean().describe("Whether results were truncated (limited to 100 files)")
    })), Au = Iq({
        name: T9,
        searchHint: "find files by name pattern or wildcard",
        maxResultSizeChars: 1e5,
        async description() {
            return hb1
        },
        userFacingName: uPK,
        getToolUseSummary: u47,
        getActivityDescription(q) {
            let K = u47(q);
            return K ? `Finding ${K}` : "Finding files"
        },
        get inputSchema() {
            return F_Y()
        },
        get outputSchema() {
            return g_Y()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.pattern
        },
        isSearchOrReadCommand() {
            return {
                isSearch: !0,
                isRead: !1
            }
        },
        getPath({
            path: q
        }) {
            return q ? Wq(q) : b8()
        },
        async preparePermissionMatcher({
            pattern: q
        }) {
            return (K) => Vk(K, q)
        },
        async validateInput({
            path: q
        }) {
            if (q) {
                let K = V8(),
                    _ = Wq(q);
                if (_.startsWith("\\\\") || _.startsWith("//")) return {
                    result: !0
                };
                let z;
                try {
                    z = await K.stat(_)
                } catch (Y) {
                    if (t1(Y)) {
                        let A = await C16(_),
                            O = `Directory does not exist: ${q}. ${Ov} ${b8()}.`;
                        if (A) O += ` Did you mean ${A}?`;
                        return {
                            result: !1,
                            message: O,
                            errorCode: 1
                        }
                    }
                    throw Y
                }
                if (!z.isDirectory()) return {
                    result: !1,
                    message: `Path is not a directory: ${q}`,
                    errorCode: 2
                }
            }
            return {
                result: !0
            }
        },
        async checkPermissions(q, K) {
            let _ = K.getAppState();
            return l96(Au, q, _.toolPermissionContext)
        },
        async prompt() {
            return hb1
        },
        renderToolUseMessage: mPK,
        renderToolUseErrorMessage: BPK,
        renderToolResultMessage: pPK,
        extractSearchText({
            filenames: q
        }) {
            return q.join(`
`)
        },
        async call(q, {
            abortController: K,
            getAppState: _,
            globLimits: z
        }) {
            let Y = Date.now(),
                A = _(),
                O = z?.maxResults ?? 100,
                {
                    files: w,
                    truncated: $
                } = await RPK(q.pattern, Au.getPath(q), {
                    limit: O,
                    offset: 0
                }, K.signal, A.toolPermissionContext),
                j = w.map(Bf6);
            return {
                data: {
                    filenames: j,
                    durationMs: Date.now() - Y,
                    numFiles: j.length,
                    truncated: $
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            if (q.filenames.length === 0) return {
                tool_use_id: K,
                type: "tool_result",
                content: "No files found"
            };
            return {
                tool_use_id: K,
                type: "tool_result",
                content: [...q.filenames, ...q.truncated ? ["(Results are truncated. Consider using a more specific path or pattern.)"] : []].join(`
`)
            }
        }
    })
})
// @from(Ln 366646, Col 0)
class M58 {
    capacity;
    buffer;
    head = 0;
    size = 0;
    constructor(q) {
        this.capacity = q;
        this.buffer = Array(q)
    }
    add(q) {
        if (this.buffer[this.head] = q, this.head = (this.head + 1) % this.capacity, this.size < this.capacity) this.size++
    }
    addAll(q) {
        for (let K of q) this.add(K)
    }
    getRecent(q) {
        let K = [],
            _ = this.size < this.capacity ? 0 : this.head,
            z = Math.min(q, this.size);
        for (let Y = 0; Y < z; Y++) {
            let A = (_ + this.size - z + Y) % this.capacity;
            K.push(this.buffer[A])
        }
        return K
    }
    toArray() {
        if (this.size === 0) return [];
        let q = [],
            K = this.size < this.capacity ? 0 : this.head;
        for (let _ = 0; _ < this.size; _++) {
            let z = (K + _) % this.capacity;
            q.push(this.buffer[z])
        }
        return q
    }
    clear() {
        this.buffer.length = 0, this.head = 0, this.size = 0
    }
    length() {
        return this.size
    }
}
// @from(Ln 366689, Col 0)
function Lb6() {
    return Lp("BASH_MAX_OUTPUT_LENGTH", process.env.BASH_MAX_OUTPUT_LENGTH, B47, m47).effective
}
// @from(Ln 366692, Col 4)
m47 = 150000
// @from(Ln 366693, Col 4)
B47 = 30000
// @from(Ln 366694, Col 4)
P58 = L(() => {
    ty6()
})
// @from(Ln 366700, Col 4)
Q_Y = 8388608
// @from(Ln 366701, Col 4)
d_Y = 1000
// @from(Ln 366702, Col 4)
c_Y = 4096
// @from(Ln 366703, Col 4)
uw
// @from(Ln 366704, Col 4)
hb6 = L(() => {
    K8();
    Yq();
    P58();
    EH();
    uw = class uw {
        taskId;
        path;
        stdoutToFile;
        #q = "";
        #K = "";
        #_ = null;
        #Y = new M58(1000);
        #z = 0;
        #w = 0;
        #A;
        #$;
        #H = !1;
        #j = 0;
        static #O = new Map;
        static #X = new Map;
        static #D = null;
        constructor(q, K, _ = !1, z = Q_Y) {
            if (this.taskId = q, this.path = $A(q), this.stdoutToFile = _, this.#A = z, this.#$ = K, _ && K) uw.#O.set(q, this)
        }
        static startPolling(q) {
            let K = uw.#O.get(q);
            if (!K || !K.#$) return;
            if (uw.#X.set(q, K), !uw.#D) uw.#D = setInterval(uw.#P, d_Y), uw.#D.unref()
        }
        static stopPolling(q) {
            if (uw.#X.delete(q), uw.#X.size === 0 && uw.#D) clearInterval(uw.#D), uw.#D = null
        }
        static #P() {
            for (let [, q] of uw.#X) {
                if (!q.#$) continue;
                RC(q.path, c_Y).then(({
                    content: K,
                    bytesRead: _,
                    bytesTotal: z
                }) => {
                    if (!q.#$) return;
                    if (!K) {
                        q.#$("", "", q.#z, z, !1);
                        return
                    }
                    let Y = K.length,
                        A = 0,
                        O = 0,
                        w = 0;
                    while (Y > 0) {
                        if (Y = K.lastIndexOf(`
`, Y - 1), w++, w === 5) A = Y <= 0 ? 0 : Y + 1;
                        if (w === 100) O = Y <= 0 ? 0 : Y + 1
                    }
                    let $ = _ >= z ? w : Math.max(q.#z, Math.round(z / _ * w));
                    q.#z = $, q.#w = z, q.#$(K.slice(A), K.slice(O), $, z, _ < z)
                }, () => {})
            }
        }
        writeStdout(q) {
            this.#J(q, !1)
        }
        writeStderr(q) {
            this.#J(q, !0)
        }
        #J(q, K) {
            if (this.#w += q.length, this.#Z(q), this.#_) {
                this.#_.append(K ? `[stderr] ${q}` : q);
                return
            }
            if (this.#q.length + this.#K.length + q.length > this.#A) {
                this.#W(K ? q : null, K ? null : q);
                return
            }
            if (K) this.#K += q;
            else this.#q += q
        }
        #Z(q) {
            let z = 0,
                Y = [],
                A = 0,
                O = q.length;
            while (O > 0) {
                let w = q.lastIndexOf(`
`, O - 1);
                if (w === -1) break;
                if (z++, Y.length < 100 && A < 4096) {
                    let $ = O - w - 1;
                    if ($ > 0 && $ <= 4096 - A) {
                        let j = q.slice(w + 1, O);
                        if (j.trim()) Y.push(Buffer.from(j).toString()), A += $
                    }
                }
                O = w
            }
            this.#z += z;
            for (let w = Y.length - 1; w >= 0; w--) this.#Y.add(Y[w]);
            if (this.#$ && Y.length > 0) {
                let w = this.#Y.getRecent(5);
                this.#$(qJ8(w, `
`), qJ8(this.#Y.getRecent(100), `
`), this.#z, this.#w, this.#_ !== null)
            }
        }
        #W(q, K) {
            if (this.#_ = new UU8(this.taskId), this.#q) this.#_.append(this.#q), this.#q = "";
            if (this.#K) this.#_.append(`[stderr] ${this.#K}`), this.#K = "";
            if (K) this.#_.append(K);
            if (q) this.#_.append(`[stderr] ${q}`)
        }
        async getStdout() {
            if (this.stdoutToFile) return this.#G();
            if (this.#_) {
                let q = this.#Y.getRecent(5),
                    K = qJ8(q, `
`),
                    z = `
Output truncated (${Math.round(this.#w/1024)}KB total). Full output saved to: ${this.path}`;
                return K ? K + z : z.trimStart()
            }
            return this.#q
        }
        async #G() {
            let q = Lb6();
            try {
                let K = await rw8(this.path, 0, q);
                if (!K) return this.#H = !0, "";
                let {
                    content: _,
                    bytesRead: z,
                    bytesTotal: Y
                } = K;
                return this.#j = Y, this.#H = Y <= z, _
            } catch (K) {
                let _ = K instanceof Error && "code" in K ? String(K.code) : "unknown";
                return E(`TaskOutput.#readStdoutFromFile: failed to read ${this.path} (${_}): ${K}`), `<bash output unavailable: output file ${this.path} could not be read (${_}). This usually means another Claude Code process in the same project deleted it during startup cleanup.>`
            }
        }
        getStderr() {
            if (this.#_) return "";
            return this.#K
        }
        get isOverflowed() {
            return this.#_ !== null
        }
        get totalLines() {
            return this.#z
        }
        get totalBytes() {
            return this.#w
        }
        get outputFileRedundant() {
            return this.#H
        }
        get outputFileSize() {
            return this.#j
        }
        spillToDisk() {
            if (!this.#_) this.#W(null, null)
        }
        async flush() {
            await this.#_?.flush()
        }
        async deleteOutputFile() {
            try {
                await U_Y(this.path)
            } catch {}
        }
        clear() {
            this.#q = "", this.#K = "", this.#Y.clear(), this.#$ = null, this.#_?.cancel(), uw.stopPolling(this.taskId), uw.#O.delete(this.taskId)
        }
    }
})
// @from(Ln 366879, Col 0)
function gPK(q) {
    return l_Y(q) + " < /dev/null"
}
// @from(Ln 366883, Col 0)
function l_Y(q) {
    return "'" + q.replaceAll("'", `'"'"'`) + "'"
}
// @from(Ln 366898, Col 0)
function U47(q, K, _ = []) {
    let z = _.length > 0 ? `${_.join(" ")} "$@"` : '"$@"';
    return [`function ${q} {`, `  local _cc_bin="\${${d47}:-}"`, "  [[ -x $_cc_bin ]] || _cc_bin=$(command -v claude 2>/dev/null)", `  if [[ ! -x $_cc_bin ]]; then command ${q} "$@"; return; fi`, "  if [[ -n $ZSH_VERSION ]]; then", `    ARGV0=${K} "$_cc_bin" ${z}`, '  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then', `    ARGV0=${K} "$_cc_bin" ${z}`, "  elif [[ $BASHPID != $$ ]]; then", `    exec -a ${K} "$_cc_bin" ${z}`, "  else", `    (exec -a ${K} "$_cc_bin" ${z})`, "  fi", "}"].join(`
`)
}
// @from(Ln 366904, Col 0)
function o_Y() {
    let q = wj6();
    if (q.argv0) return {
        type: "function",
        snippet: U47("rg", q.argv0)
    };
    let K = A5([q.rgPath]),
        _ = q.rgArgs.map((Y) => A5([Y]));
    return {
        type: "alias",
        snippet: q.rgArgs.length > 0 ? `${K} ${_.join(" ")}` : K
    }
}
// @from(Ln 366918, Col 0)
function s_Y() {
    if (!$H()) return null;
    return ["unalias find 2>/dev/null || true", "unalias grep 2>/dev/null || true", U47("find", "bfs", ["-regextype", "findutils-default"]), U47("grep", "ugrep", ["-G", "--ignore-files", "--hidden", "-I", ...a_Y.map((q) => `--exclude-dir=${q}`)])].join(`
`)
}
// @from(Ln 366924, Col 0)
function t_Y() {
    return null
}
// @from(Ln 366928, Col 0)
function Q47(q) {
    let K = q.includes("zsh") ? ".zshrc" : q.includes("bash") ? ".bashrc" : ".profile";
    return F47(QU8.homedir(), K)
}
// @from(Ln 366933, Col 0)
function e_Y(q) {
    let K = q.endsWith(".zshrc"),
        _ = "";
    if (K) _ += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      typeset -f > /dev/null 2>&1

      # Now get user function names - filter completion functions (single underscore prefix)
      # but keep double-underscore helpers (e.g. __zsh_like_cd from mise, __pyenv_init)
      typeset +f | grep -vE '^_[^_]' | while read func; do
        typeset -f "$func" >> "$SNAPSHOT_FILE"
      done
    `;
    else _ += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      declare -f > /dev/null 2>&1

      # Now get user function names - filter completion functions (single underscore prefix)
      # but keep double-underscore helpers (e.g. __zsh_like_cd from mise, __pyenv_init)
      declare -F | cut -d' ' -f3 | grep -vE '^_[^_]' | while read func; do
        # Encode the function to base64, preserving all special characters
        encoded_func=$(declare -f "$func" | base64 )
        # Write the function definition to the snapshot
        echo "eval ${p47}"${p47}$(echo '$encoded_func' | base64 -d)${p47}" > /dev/null 2>&1" >> "$SNAPSHOT_FILE"
      done
    `;
    if (K) _ += `
      echo "# Shell Options" >> "$SNAPSHOT_FILE"
      setopt | sed 's/^/setopt /' | head -n 1000 >> "$SNAPSHOT_FILE"
    `;
    else _ += `
      echo "# Shell Options" >> "$SNAPSHOT_FILE"
      shopt -p | head -n 1000 >> "$SNAPSHOT_FILE"
      set -o | grep "on" | awk '{print "set -o " $1}' | head -n 1000 >> "$SNAPSHOT_FILE"
      echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"
    `;
    return _ += `
      echo "# Aliases" >> "$SNAPSHOT_FILE"
      # Filter out winpty aliases on Windows to avoid "stdin is not a tty" errors
      # Git Bash automatically creates aliases like "alias node='winpty node.exe'" for
      # programs that need Win32 Console in mintty, but winpty fails when there's no TTY
      if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        alias | grep -v "='winpty " | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
      else
        alias | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
      fi
  `, _
}
// @from(Ln 366985, Col 0)
async function qzY(q) {
    let K = process.env.PATH;
    if (y1() === "windows") {
        let $ = await Xh(q, ["-lc", 'echo "$PATH"'], {
            reject: !1,
            timeout: g47
        });
        if ($.exitCode === 0 && $.stdout) K = $.stdout.trim()
    }
    let _ = await RG4();
    if (_.length > 0) {
        let $ = y1() === "windows" ? _.map(sX) : _;
        K = [K, ...$].filter(Boolean).join(":")
    }
    let z = o_Y(),
        Y = "";
    if (Y += `
      # Check for rg availability
      echo "# Check for rg availability" >> "$SNAPSHOT_FILE"
      echo "if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
  `, z.type === "function") Y += `
      cat >> "$SNAPSHOT_FILE" << 'RIPGREP_FUNC_END'
  ${z.snippet}
RIPGREP_FUNC_END
    `;
    else {
        let $ = z.snippet.replaceAll("'", "'\\''");
        Y += `
      echo '  alias rg='"'${$}'" >> "$SNAPSHOT_FILE"
    `
    }
    Y += `
      echo "fi" >> "$SNAPSHOT_FILE"
  `;
    let A = s_Y();
    if (A !== null) Y += `
      # Shadow find/grep with embedded bfs/ugrep (ant-native only)
      echo "# Shadow find/grep with embedded bfs/ugrep" >> "$SNAPSHOT_FILE"
      cat >> "$SNAPSHOT_FILE" << 'FIND_GREP_FUNC_END'
${A}
FIND_GREP_FUNC_END
    `;
    let O = t_Y();
    if (O !== null) Y += `
      echo "# Shadow bq to label query jobs with source=claude_code" >> "$SNAPSHOT_FILE"
      cat >> "$SNAPSHOT_FILE" << 'BQ_FUNC_END'
${O}
BQ_FUNC_END
    `;
    let w = `PATH_END_${Math.random().toString(36).substring(2,18)}`;
    return Y += `

      # Add PATH to the file
      cat >> "$SNAPSHOT_FILE" << '${w}'
export PATH=${A5([K||""])}
${w}
  `, Y
}
// @from(Ln 367043, Col 0)
async function KzY(q, K, _) {
    let z = Q47(q),
        Y = z.endsWith(".zshrc"),
        A = _ ? e_Y(z) : !Y ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "",
        O = await qzY(q);
    return `SNAPSHOT_FILE=${A5([K])}
      ${_?`source "${z}" < /dev/null`:"# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # When this file is sourced, we first unalias to avoid conflicts
      # This is necessary because aliases get "frozen" inside function definitions at definition time,
      # which can cause unexpected behavior when functions use commands that conflict with aliases
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${A}

      ${O}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `
}
// @from(Ln 367071, Col 4)
p47 = "\\"
// @from(Ln 367072, Col 4)
g47 = 1e4
// @from(Ln 367073, Col 4)
d47 = "CLAUDE_CODE_EXECPATH"
// @from(Ln 367074, Col 4)
a_Y
// @from(Ln 367074, Col 9)
UPK = async (q) => {
        let K = q.includes("zsh") ? "zsh" : q.includes("bash") ? "bash" : "sh";
        return E(`Creating shell snapshot for ${K} (${q})`), new Promise(async (_) => {
            try {
                let z = Q47(q);
                E(`Looking for shell config file: ${z}`);
                let Y = await a3(z);
                if (!Y) E(`Shell config file not found: ${z}, creating snapshot with Claude Code defaults only`);
                let A = Date.now(),
                    O = Math.random().toString(36).substring(2, 8),
                    w = F47(A7(), "shell-snapshots");
                E(`Snapshots directory: ${w}`);
                let $ = F47(w, `snapshot-${K}-${A}-${O}.sh`);
                await i_Y(w, {
                    recursive: !0
                });
                let j = await KzY(q, $, Y);
                E(`Creating snapshot at: ${$}`), E(`Execution timeout: ${g47}ms`), n_Y(q, ["-c", "-l", j], {
                    env: {
                        ...process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : Dk(),
                        SHELL: q,
                        GIT_EDITOR: "true",
                        CLAUDECODE: "1"
                    },
                    timeout: g47,
                    maxBuffer: 1048576,
                    encoding: "utf8"
                }, async (H, J, X) => {
                    if (H) {
                        let M = H;
                        if (E(`Shell snapshot creation failed: ${H.message}`), E("Error details:"), E(`  - Error code: ${M?.code}`), E(`  - Error signal: ${M?.signal}`), E(`  - Error killed: ${M?.killed}`), E(`  - Shell path: ${q}`), E(`  - Config file: ${Q47(q)}`), E(`  - Config file exists: ${Y}`), E(`  - Working directory: ${b8()}`), E(`  - Claude home: ${A7()}`), E(`Full snapshot script:
${j}`), J) E(`stdout output (${J.length} chars):
${J}`);
                        else E("No stdout output captured");
                        if (X) E(`stderr output (${X.length} chars): ${X}`);
                        else E("No stderr output captured");
                        j6(Error(`Failed to create shell snapshot: ${H.message}`));
                        let P = M?.signal ? QU8.constants.signals[M.signal] : void 0;
                        d("tengu_shell_snapshot_failed", {
                            stderr_length: X?.length || 0,
                            has_error_code: !!M?.code,
                            error_signal_number: P,
                            error_killed: M?.killed
                        }), _(void 0)
                    } else {
                        let M;
                        try {
                            M = (await r_Y($)).size
                        } catch {}
                        if (M !== void 0) E(`Shell snapshot created successfully (${M} bytes)`), eq(async () => {
                            try {
                                await V8().unlink($), E(`Cleaned up session snapshot: ${$}`)
                            } catch (P) {
                                E(`Error cleaning up session snapshot: ${P}`)
                            }
                        }), _($);
                        else {
                            E(`Shell snapshot file not found after creation: ${$}`), E(`Checking if parent directory still exists: ${w}`);
                            try {
                                let P = await V8().readdir(w);
                                E(`Directory contains ${P.length} files`)
                            } catch {
                                E(`Parent directory does not exist or is not accessible: ${w}`)
                            }
                            d("tengu_shell_unknown_error", {}), _(void 0)
                        }
                    }
                })
            } catch (z) {
                if (E(`Unexpected error during snapshot creation: ${z}`), z instanceof Error) E(`Error stack trace: ${z.stack}`);
                j6(z), d("tengu_shell_snapshot_error", {}), _(void 0)
            }
        })
    }
// @from(Ln 367148, Col 4)
QPK = L(() => {
    C8();
    R9();
    n7();
    K8();
    pB();
    Q8();
    eK();
    Yq();
    U8();
    NK();
    vH();
    BI();
    NV();
    zy();
    rC();
    a_Y = [".git", ".svn", ".hg", ".bzr", ".jj", ".sl"]
})
// @from(Ln 367167, Col 0)
function dU8(q, K) {
    let _ = q.lastIndexOf(" -");
    if (_ > 0) {
        let z = q.substring(0, _),
            Y = q.substring(_ + 1);
        return `${A5([z])} ${Y} ${A5([K])}`
    } else return `${A5([q])} ${A5([K])}`
}
// @from(Ln 367175, Col 4)
c47 = () => {}
// @from(Ln 367177, Col 0)
function l47(q) {
    if (/\d\s*<<\s*\d/.test(q) || /\[\[\s*\d+\s*<<\s*\d+\s*\]\]/.test(q) || /\$\(\(.*<<.*\)\)/.test(q)) return !1;
    return /<<-?\s*(?:(['"]?)(\w+)\1|\\(\w+))/.test(q)
}
// @from(Ln 367182, Col 0)
function _zY(q) {
    let K = /'(?:[^'\\]|\\.)*\n(?:[^'\\]|\\.)*'/,
        _ = /"(?:[^"\\]|\\.)*\n(?:[^"\\]|\\.)*"/;
    return K.test(q) || _.test(q)
}
// @from(Ln 367188, Col 0)
function dPK(q, K = !0) {
    if (l47(q) || _zY(q)) {
        let Y = `'${q.replaceAll("'",`'"'"'`)}'`;
        if (l47(q)) return Y;
        return K ? `${Y} < /dev/null` : Y
    }
    let _ = A5([q]);
    return K ? `${_} < /dev/null` : _
}
// @from(Ln 367198, Col 0)
function zzY(q) {
    return /(?:^|[\s;&|])<(?![<(])\s*\S+/.test(q)
}
// @from(Ln 367202, Col 0)
function cPK(q) {
    if (l47(q)) return !1;
    if (zzY(q)) return !1;
    return !0
}
// @from(Ln 367208, Col 0)
function lPK(q) {
    return q.replace(YzY, "$1/dev/null")
}
// @from(Ln 367211, Col 4)
YzY
// @from(Ln 367212, Col 4)
nPK = L(() => {
    YzY = /(\d?&?>+\s*)[Nn][Uu][Ll](?=\s|$|[|&;)\n])/g
})
// @from(Ln 367225, Col 0)
function wzY(q) {
    if (process.env.CLAUDE_CODE_SHELL_PREFIX) return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true";
    if (q.includes("bash")) return "shopt -u extglob 2>/dev/null || true";
    else if (q.includes("zsh")) return "setopt NO_EXTENDED_GLOB 2>/dev/null || true";
    return null
}
// @from(Ln 367231, Col 0)
async function iPK(q, K) {
    let _, z = K?.skipSnapshot ? Promise.resolve(void 0) : UPK(q).catch((A) => {
            E(`Failed to create shell snapshot: ${A}`);
            return
        }),
        Y;
    return {
        type: "bash",
        shellPath: q,
        detached: !0,
        async buildExecCommand(A, O) {
            let w = await z;
            if (w) try {
                await AzY(w)
            } catch {
                E(`Snapshot file missing, falling back to login shell: ${w}`), w = void 0
            }
            Y = w, _ = O.sandboxTmpDir;
            let $ = z2(),
                H = y1() === "windows" ? sX($) : $,
                J = O.useSandbox ? cU8(O.sandboxTmpDir, `cwd-${O.id}`) : cU8(H, `claude-${O.id}-cwd`),
                X = O.useSandbox ? cU8(O.sandboxTmpDir, `cwd-${O.id}`) : OzY($, `claude-${O.id}-cwd`),
                M = lPK(A),
                P = cPK(M),
                W = dPK(M, P);
            if (M.includes("|") && P) W = gPK(M);
            let D = [];
            if (w) {
                let v = y1() === "windows" ? sX(w) : w;
                D.push(`source ${A5([v])} 2>/dev/null || true`)
            }
            let Z = await PC4();
            if (Z) D.push(`${Z}
:`);
            if (S6(process.env.CLAUDE_CODE_REMOTE)) D.push('export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}"');
            let G = wzY(q);
            if (G) D.push(G);
            D.push(`eval ${W}`), D.push(`pwd -P >| ${A5([J])}`);
            let f = D.join(" && ");
            if (process.env.CLAUDE_CODE_SHELL_PREFIX) f = dU8(process.env.CLAUDE_CODE_SHELL_PREFIX, f);
            return {
                commandString: f,
                cwdFilePath: X
            }
        },
        getSpawnArgs(A) {
            let O = Y !== void 0;
            if (O) E("Spawning shell without login (-l flag skipped)");
            return ["-c", ...O ? [] : ["-l"], A]
        },
        async getEnvironmentOverrides(A, O, w) {
            let $ = A.includes("tmux"),
                j = w?.getTmuxEnv() ?? null,
                H = {};
            if (H[d47] = process.execPath, j) H.TMUX = j;
            if (O)
                for (let [J, X] of O) H[J] = X;
            if (_) {
                let J = _;
                if (y1() === "windows") J = sX(J);
                H.TMPDIR = J, H.CLAUDE_CODE_TMPDIR = J, H.TMPPREFIX = cU8(J, "zsh")
            }
            return H
        }
    }
}
// @from(Ln 367297, Col 4)
rPK = L(() => {
    QPK();
    c47();
    nPK();
    K8();
    Q8();
    NK();
    oH6();
    cW();
    rC()
})
// @from(Ln 367312, Col 0)
async function aPK(q) {
    try {
        return (await $zY(q)).isFile() ? q : null
    } catch {
        return null
    }
}
// @from(Ln 367319, Col 0)
async function jzY() {
    let q = await oA("pwsh");
    if (q) {
        if (y1() === "linux") {
            let _ = await oPK(q).catch(() => q);
            if (q.startsWith("/snap/") || _.startsWith("/snap/")) {
                let z = await aPK("/opt/microsoft/powershell/7/pwsh") ?? await aPK("/usr/bin/pwsh");
                if (z) {
                    let Y = await oPK(z).catch(() => z);
                    if (!z.startsWith("/snap/") && !Y.startsWith("/snap/")) return z
                }
            }
        }
        return q
    }
    let K = await oA("powershell");
    if (K) return K;
    return null
}
// @from(Ln 367339, Col 0)
function $e() {
    if (!n47) n47 = jzY();
    return n47
}
// @from(Ln 367343, Col 0)
async function lU8() {
    let q = await $e();
    if (!q) return null;
    return q.split(/[/\\]/).pop().toLowerCase().replace(/\.exe$/, "") === "pwsh" ? "core" : "desktop"
}
// @from(Ln 367348, Col 4)
n47 = null
// @from(Ln 367349, Col 4)
Rb6 = L(() => {
    NK();
    n0()
})
// @from(Ln 367360, Col 0)
function i47(q) {
    return ["-NoProfile", "-NonInteractive", "-Command", q]
}
// @from(Ln 367364, Col 0)
function XzY(q) {
    return Buffer.from(q, "utf16le").toString("base64")
}
// @from(Ln 367368, Col 0)
function sPK(q) {
    let K;
    return {
        type: "powershell",
        shellPath: q,
        detached: !1,
        async buildExecCommand(_, z) {
            K = z.useSandbox ? z.sandboxTmpDir : void 0;
            let Y = z.useSandbox && z.sandboxTmpDir ? JzY(z.sandboxTmpDir, `claude-pwd-ps-${z.id}`) : HzY(z2(), `claude-pwd-ps-${z.id}`),
                O = `
; $_ec = if ($null -ne $LASTEXITCODE) { $LASTEXITCODE } elseif ($?) { 0 } else { 1 }
; (Get-Location).Path | Out-File -FilePath '${Y.replaceAll("'","''")}' -Encoding utf8 -NoNewline
; exit $_ec`,
                w = _ + O;
            return {
                commandString: z.useSandbox ? [`'${q.replace(/'/g,"'\\''")}'`, "-NoProfile", "-NonInteractive", "-EncodedCommand", XzY(w)].join(" ") : w,
                cwdFilePath: Y
            }
        },
        getSpawnArgs(_) {
            return i47(_)
        },
        async getEnvironmentOverrides(_, z) {
            let Y = {};
            if (z)
                for (let [A, O] of z) Y[A] = O;
            if (K) Y.TMPDIR = K, Y.CLAUDE_CODE_TMPDIR = K;
            return Y
        }
    }
}
// @from(Ln 367399, Col 4)
r47 = L(() => {
    cW()
})
// @from(Ln 367427, Col 0)
function o47(q) {
    try {
        return VzY(q, W58.X_OK), !0
    } catch (K) {
        try {
            return MzY(q, ["--version"], {
                timeout: 1000,
                stdio: "ignore"
            }), !0
        } catch {
            return !1
        }
    }
}
// @from(Ln 367441, Col 0)
async function NzY() {
    let q = process.env.CLAUDE_CODE_SHELL;
    if (q)
        if ((q.includes("bash") || q.includes("zsh")) && o47(q)) return E(`Using shell override: ${q}`), q;
        else E(`CLAUDE_CODE_SHELL="${q}" is not a valid bash/zsh path, falling back to detection`);
    let K = process.env.SHELL,
        _ = K && (K.includes("bash") || K.includes("zsh")),
        z = K?.includes("bash"),
        [Y, A] = await Promise.all([oA("zsh"), oA("bash")]),
        O = ["/bin", "/usr/bin", "/usr/local/bin", "/opt/homebrew/bin"],
        $ = (z ? ["bash", "zsh"] : ["zsh", "bash"]).flatMap((H) => O.map((J) => `${J}/${H}`));
    if (z) {
        if (A) $.unshift(A);
        if (Y) $.push(Y)
    } else {
        if (Y) $.unshift(Y);
        if (A) $.push(A)
    }
    if (_ && o47(K)) $.unshift(K);
    let j = $.find((H) => H && o47(H));
    if (!j) {
        let H = "No suitable shell found. Claude CLI requires a Posix shell environment. Please ensure you have a valid shell installed and the SHELL environment variable set.";
        throw j6(Error(H)), Error(H)
    }
    return j
}
// @from(Ln 367467, Col 0)
async function EzY() {
    let q = await NzY();
    return {
        provider: await iPK(q)
    }
}
// @from(Ln 367474, Col 0)
function qWK() {
    ePK.cache?.clear?.()
}
// @from(Ln 367477, Col 0)
async function al(q, K, _, z) {
    let {
        timeout: Y,
        onProgress: A,
        preventCwdChanges: O,
        shouldUseSandbox: w,
        shouldAutoBackground: $,
        onStdout: j,
        sessionEnvVars: H,
        tmuxSocket: J
    } = z ?? {}, X = Y || kzY, M = await LzY[_](), P = Math.floor(Math.random() * 65536).toString(16).padStart(4, "0"), W = TzY(z2(), s47()), {
        commandString: D,
        cwdFilePath: Z
    } = await M.buildExecCommand(q, {
        id: P,
        sandboxTmpDir: w ? W : void 0,
        useSandbox: w ?? !1
    }), G = D, f = jJ8();
    try {
        await tPK(f)
    } catch {
        let F = Y7();
        E(`Shell CWD "${f}" no longer exists, recovering to "${F}"`);
        try {
            await tPK(F), yY1(F), f = F
        } catch {
            return KWK(`Working directory "${f}" no longer exists. Please restart Claude from an existing directory.`)
        }
    }
    if (K.aborted) return a47();
    let v = M.shellPath,
        V = w && _ === "powershell",
        k = V ? "/bin/sh" : v;
    if (xP()) {
        let F = await Py6(q);
        $p1(F.kind === "simple" ? F.commands.map((U) => U.text).join(`
`) : q)
    }
    if (w) {
        let F;
        if (xP() && Js()) {
            let g = Hp1(),
                c = g.filesystem.denyWrite,
                n = g.filesystem.allowWrite,
                l = Z7.getFsWriteConfig(),
                z6 = Z7.getConfig()?.filesystem,
                A6 = z6?.allowWrite ?? [],
                e = F4([...n, ...A6.filter((O6) => O6 !== "/" && O6.length > 0)]),
                i = l.denyWithinAllow.filter((O6) => e.some((J6) => O6 === J6 || O6.startsWith(`${J6}/`)) && !c.some((J6) => O6 === J6 || O6.startsWith(`${J6}/`)));
            F = {
                ...g,
                filesystem: {
                    allowWrite: e,
                    denyWrite: F4([...c, ...i]),
                    denyRead: F4([...g.filesystem.denyRead, ...z6?.denyRead ?? []])
                }
            }
        }
        let U = !1;
        try {
            await V8().mkdir(W, {
                mode: 448
            }), U = !0
        } catch (g) {
            if (Q1(g) === "EEXIST") U = !0;
            else E(`Failed to create ${W} directory: ${g}`)
        }
        if (U && !process.env.CLAUDE_TMPDIR) process.env.CLAUDE_TMPDIR = W;
        G = await Z7.wrapWithSandbox(G, k, F, K)
    }
    let N = w ? await KJ4() : void 0,
        R = V ? "/bin/sh" : v,
        h = V ? ["-c", G] : M.getSpawnArgs(G),
        C = await M.getEnvironmentOverrides(q, H, J),
        x = !!j,
        B = cR("local_bash"),
        m = new uw(B, A ?? null, !x);
    await ZzY(Sb6(), {
        recursive: !0
    });
    let S;
    if (!x) {
        let F = W58.O_NOFOLLOW ?? 0;
        S = await fzY(m.path, process.platform === "win32" ? "w" : W58.O_WRONLY | W58.O_CREAT | W58.O_APPEND | F)
    }
    try {
        let F = WI4(),
            U = PzY(R, h, {
                env: {
                    ...Dk(),
                    SHELL: _ === "bash" ? v : void 0,
                    GIT_EDITOR: "true",
                    CLAUDECODE: "1",
                    ...C,
                    ...F && {
                        TRACEPARENT: F
                    },
                    ...!1
                },
                cwd: f,
                stdio: hzY(x, S?.fd, N),
                detached: M.detached,
                windowsHide: !0
            }),
            g = nU8(U, K, X, m, $);
        if (S !== void 0) try {
            await S.close()
        } catch {}
        if (U.stdout && j) U.stdout.on("data", (n) => {
            j(typeof n === "string" ? n : n.toString())
        });
        let c = y1() === "windows" ? LA6(Z) : Z;
        return g.result.then(async (n) => {
            if (w) Z7.cleanupAfterCommand();
            if (n && !O && !n.backgroundTaskId) try {
                let l = WzY(c, {
                    encoding: "utf8"
                }).trim();
                if (y1() === "windows") l = LA6(l);
                if (l.normalize("NFC") !== f) {
                    if (l$(l, f), !Sf6()) xh6(), lb4(f, l)
                }
            } catch {
                d("tengu_shell_set_cwd", {
                    success: !1
                })
            }
            try {
                DzY(c)
            } catch {}
        }), g
    } catch (F) {
        if (S !== void 0) try {
            await S.close()
        } catch {}
        return m.clear(), E(`Shell exec error: ${b6(F)}`), a47(void 0, {
            code: 126,
            stderr: b6(F)
        })
    }
}
// @from(Ln 367619, Col 0)
function l$(q, K) {
    let _ = GzY(q) ? q : vzY(K || V8().cwd(), q),
        z;
    try {
        z = V8().realpathSync(_)
    } catch (Y) {
        if (t1(Y)) throw Error(`Path "${_}" does not exist`);
        throw Y
    }
    yY1(z);
    try {
        d("tengu_shell_set_cwd", {
            success: !0
        })
    } catch (Y) {}
}
// @from(Ln 367636, Col 0)
function hzY(q, K, _) {
    let z = q ? ["pipe", "pipe", "pipe"] : ["pipe", K, K];
    if (_ !== void 0) z[Xp1] = _;
    return z
}
// @from(Ln 367641, Col 4)
kzY = 1800000
// @from(Ln 367642, Col 4)
ePK
// @from(Ln 367642, Col 9)
yzY
// @from(Ln 367642, Col 14)
LzY
// @from(Ln 367643, Col 4)
$G = L(() => {
    U4();
    C8();
    y8();
    $T();
    n7();
    K8();
    m8();
    Yq();
    U8();
    t47();
    EH();
    hb6();
    cW();
    n0();
    Wy6();
    V18();
    Sz();
    NK();
    yY();
    Mp1();
    oH6();
    rPK();
    Rb6();
    r47();
    zy();
    Qc();
    rC();
    ePK = P1(EzY);
    yzY = P1(async () => {
        let q = await $e();
        if (!q) throw Error("PowerShell is not available");
        return sPK(q)
    }), LzY = {
        bash: async () => (await ePK()).provider,
        powershell: yzY
    }
})
// @from(Ln 367686, Col 0)
function rU8(q) {
    let K = q.split(`
`),
        _ = 0;
    while (_ < K.length && K[_]?.trim() === "") _++;
    let z = K.length - 1;
    while (z >= 0 && K[z]?.trim() === "") z--;
    if (_ > z) return "";
    return K.slice(_, z + 1).join(`
`)
}
// @from(Ln 367698, Col 0)
function D58(q) {
    return /^data:image\/[a-z0-9.+_-]+;base64,/i.test(q)
}
// @from(Ln 367702, Col 0)
function _WK(q) {
    let K = q.trim().match(bzY);
    if (!K || !K[1] || !K[2]) return null;
    return {
        mediaType: K[1],
        data: K[2]
    }
}
// @from(Ln 367711, Col 0)
function oU8(q, K) {
    let _ = _WK(q);
    if (!_) return null;
    return {
        tool_use_id: K,
        type: "tool_result",
        content: [{
            type: "image",
            source: {
                type: "base64",
                media_type: _.mediaType,
                data: _.data
            }
        }]
    }
}
// @from(Ln 367727, Col 0)
async function aU8(q, K, _, z) {
    let Y = q;
    if (K) {
        if ((_ ?? (await CzY(K)).size) > IzY) return null;
        Y = await SzY(K, "utf8")
    }
    let A = _WK(Y);
    if (!A) return null;
    let O = Buffer.from(A.data, "base64"),
        w = A.mediaType.split("/")[1] || "png",
        $ = await zs(O, O.length, w, z);
    return `data:image/${$.mediaType};base64,${$.buffer.toString("base64")}`
}
// @from(Ln 367741, Col 0)
function zWK(q) {
    let K = D58(q);
    if (K) return {
        totalLines: 1,
        truncatedContent: q,
        isImage: K
    };
    let _ = Lb6();
    if (q.length <= _) return {
        totalLines: tz(q, `
`) + 1,
        truncatedContent: q,
        isImage: K
    };
    let z = q.slice(0, _),
        Y = tz(q, `
`, _) + 1,
        A = `${z}

... [${Y} lines truncated] ...`;
    return {
        totalLines: tz(q, `
`) + 1,
        truncatedContent: A,
        isImage: K
    }
}
// @from(Ln 367769, Col 0)
function tU8(q) {
    let K = b8(),
        _ = Y7(),
        z = _G7();
    if (z || K !== _ && !Tk(K, q)) {
        if (l$(_), !z) return d("tengu_bash_tool_reset_to_original_dir", {}), !0
    }
    return !1
}
// @from(Ln 367778, Col 4)
iU8 = 25
// @from(Ln 367779, Col 4)
bzY
// @from(Ln 367779, Col 9)
IzY = 20971520
// @from(Ln 367780, Col 4)
sU8 = (q) => `${q.trim()}
Shell cwd was reset to ${Y7()}`
// @from(Ln 367782, Col 4)
eU8 = L(() => {
    y8();
    C8();
    n7();
    Sz();
    $G();
    Q8();
    CI();
    P58();
    bzY = /^data:([^;]+);base64,(.+)$/
})
// @from(Ln 367794, Col 0)
function uzY(q) {
    let K = 0;
    for (let _ of q) {
        if (!_) continue;
        if (K += (_.text?.length ?? 0) + (_.image?.image_data.length ?? 0), K > xzY) return !0
    }
    return !1
}
// @from(Ln 367803, Col 0)
function e47(q) {
    if (!q) return "";
    let K = Array.isArray(q) ? q.join("") : q,
        {
            truncatedContent: _
        } = zWK(K);
    return _
}
// @from(Ln 367812, Col 0)
function mzY(q) {
    if (typeof q["image/png"] === "string") return {
        image_data: q["image/png"].replace(/\s/g, ""),
        media_type: "image/png"
    };
    if (typeof q["image/jpeg"] === "string") return {
        image_data: q["image/jpeg"].replace(/\s/g, ""),
        media_type: "image/jpeg"
    };
    return
}
// @from(Ln 367824, Col 0)
function BzY(q) {
    switch (q.output_type) {
        case "stream":
            return {
                output_type: q.output_type, text: e47(q.text)
            };
        case "execute_result":
        case "display_data":
            return {
                output_type: q.output_type, text: e47(q.data?.["text/plain"]), image: q.data && mzY(q.data)
            };
        case "error":
            return {
                output_type: q.output_type, text: e47(`${q.ename}: ${q.evalue}
${q.traceback.join(`
`)}`)
            }
    }
}
// @from(Ln 367844, Col 0)
function YWK(q, K, _, z) {
    let Y = q.id ?? `cell-${K}`,
        A = {
            cellType: q.cell_type,
            source: Array.isArray(q.source) ? q.source.join("") : q.source,
            execution_count: q.cell_type === "code" ? q.execution_count || void 0 : void 0,
            cell_id: Y
        };
    if (q.cell_type === "code") A.language = _;
    if (q.cell_type === "code" && q.outputs?.length) {
        let O = q.outputs.map(BzY);
        if (!z && uzY(O)) A.outputs = [{
            output_type: "stream",
            text: `Outputs are too large to include. Use ${S7} with: cat <notebook_path> | jq '.cells[${K}].outputs'`
        }];
        else A.outputs = O
    }
    return A
}
// @from(Ln 367864, Col 0)
function pzY(q) {
    let K = [];
    if (q.cellType !== "code") K.push(`<cell_type>${q.cellType}</cell_type>`);
    if (q.language !== "python" && q.cellType === "code") K.push(`<language>${q.language}</language>`);
    return {
        text: `<cell id="${q.cell_id}">${K.join("")}${q.source}</cell id="${q.cell_id}">`,
        type: "text"
    }
}
// @from(Ln 367874, Col 0)
function FzY(q) {
    let K = [];
    if (q.text) K.push({
        text: `
${q.text}`,
        type: "text"
    });
    if (q.image) K.push({
        type: "image",
        source: {
            data: q.image.image_data,
            media_type: q.image.media_type,
            type: "base64"
        }
    });
    return K
}
// @from(Ln 367892, Col 0)
function gzY(q) {
    let K = pzY(q),
        _ = q.outputs?.flatMap(FzY);
    return [K, ..._ ?? []]
}
// @from(Ln 367897, Col 0)
async function AWK(q, K) {
    let _ = Wq(q),
        Y = (await V8().readFileBytes(_)).toString("utf-8"),
        A = n8(Y),
        O = A.metadata.language_info?.name ?? "python";
    if (K) {
        let w = A.cells.find(($) => $.id === K);
        if (!w) throw Error(`Cell with ID "${K}" not found in notebook`);
        return [YWK(w, A.cells.indexOf(w), O, !0)]
    }
    return A.cells.map((w, $) => YWK(w, $, O, !1))
}
// @from(Ln 367910, Col 0)
function OWK(q, K) {
    let _ = q.flatMap(gzY);
    return {
        tool_use_id: K,
        type: "tool_result",
        content: _.reduce((z, Y) => {
            if (z.length === 0) return [Y];
            let A = z[z.length - 1];
            if (A && A.type === "text" && Y.type === "text") return A.text += `
` + Y.text, z;
            return z.push(Y), z
        }, [])
    }
}
// @from(Ln 367925, Col 0)
function Z58(q) {
    let K = q.match(/^cell-(\d+)$/);
    if (K && K[1]) {
        let _ = parseInt(K[1], 10);
        return isNaN(_) ? void 0 : _
    }
    return
}
// @from(Ln 367933, Col 4)
xzY = 1e4
// @from(Ln 367934, Col 4)
qQ8 = L(() => {
    eU8();
    Yq();
    b9();
    e8()
})
// @from(Ln 367940, Col 4)
wWK = "Replace the contents of a specific cell in a Jupyter notebook."
// @from(Ln 367941, Col 4)
$WK = "Completely replaces the contents of a specific cell in a Jupyter notebook (.ipynb file) with new source. Jupyter notebooks are interactive documents that combine code, text, and visualizations, commonly used for data analysis and scientific computing. The notebook_path parameter must be an absolute path, not a relative path. The cell_number is 0-indexed. Use edit_mode=insert to add a new cell at the index specified by cell_number. Use edit_mode=delete to delete the cell at the index specified by cell_number."
// @from(Ln 367946, Col 0)
function jWK(q) {
    let K = s(20),
        {
            notebook_path: _,
            cell_id: z,
            new_source: Y,
            cell_type: A,
            edit_mode: O,
            verbose: w
        } = q,
        $ = O === void 0 ? "replace" : O,
        j = $ === "delete" ? "delete" : `${$} cell in`,
        H;
    if (K[0] !== j) H = jG.createElement(T, {
        color: "subtle"
    }, "User rejected ", j, " "), K[0] = j, K[1] = H;
    else H = K[1];
    let J;
    if (K[2] !== _ || K[3] !== w) J = w ? _ : UzY(b8(), _), K[2] = _, K[3] = w, K[4] = J;
    else J = K[4];
    let X;
    if (K[5] !== J) X = jG.createElement(T, {
        bold: !0,
        color: "subtle"
    }, J), K[5] = J, K[6] = X;
    else X = K[6];
    let M;
    if (K[7] !== z) M = jG.createElement(T, {
        color: "subtle"
    }, " at cell ", z), K[7] = z, K[8] = M;
    else M = K[8];
    let P;
    if (K[9] !== H || K[10] !== X || K[11] !== M) P = jG.createElement(u, {
        flexDirection: "row"
    }, H, X, M), K[9] = H, K[10] = X, K[11] = M, K[12] = P;
    else P = K[12];
    let W;
    if (K[13] !== A || K[14] !== $ || K[15] !== Y) W = $ !== "delete" && jG.createElement(u, {
        marginTop: 1,
        flexDirection: "column"
    }, jG.createElement(ey, {
        code: Y,
        filePath: A === "markdown" ? "file.md" : "file.py",
        dim: !0
    })), K[13] = A, K[14] = $, K[15] = Y, K[16] = W;
    else W = K[16];
    let D;
    if (K[17] !== P || K[18] !== W) D = jG.createElement(_1, null, jG.createElement(u, {
        flexDirection: "column"
    }, P, W)), K[17] = P, K[18] = W, K[19] = D;
    else D = K[19];
    return D
}
// @from(Ln 367999, Col 4)
jG
// @from(Ln 368000, Col 4)
HWK = L(() => {
    o6();
    n7();
    g6();
    MM6();
    GK();
    jG = K6(P6(), 1)
})
// @from(Ln 368009, Col 0)
function qK7(q) {
    if (!q?.notebook_path) return null;
    return S3(q.notebook_path)
}
// @from(Ln 368014, Col 0)
function JWK({
    notebook_path: q,
    cell_id: K,
    new_source: _,
    cell_type: z,
    edit_mode: Y
}, {
    verbose: A
}) {
    if (!q || !_ || !z) return null;
    let O = A ? q : S3(q);
    if (A) return Wz.createElement(Wz.Fragment, null, Wz.createElement(YG, {
        filePath: q
    }, O), `@${K}, content: ${_.slice(0,30)}…, cell_type: ${z}, edit_mode: ${Y??"replace"}`);
    return Wz.createElement(Wz.Fragment, null, Wz.createElement(YG, {
        filePath: q
    }, O), `@${K}`)
}
// @from(Ln 368033, Col 0)
function XWK(q, {
    verbose: K
}) {
    return Wz.createElement(jWK, {
        notebook_path: q.notebook_path,
        cell_id: q.cell_id,
        new_source: q.new_source,
        cell_type: q.cell_type,
        edit_mode: q.edit_mode,
        verbose: K
    })
}
// @from(Ln 368046, Col 0)
function MWK(q, {
    verbose: K
}) {
    if (!K && typeof q === "string" && vK(q, "tool_use_error")) return Wz.createElement(_1, null, Wz.createElement(T, {
        color: "error"
    }, "Error editing notebook"));
    return Wz.createElement(d$, {
        result: q,
        verbose: K
    })
}
// @from(Ln 368058, Col 0)
function PWK({
    cell_id: q,
    new_source: K,
    error: _
}) {
    if (_) return Wz.createElement(_1, null, Wz.createElement(T, {
        color: "error"
    }, _));
    return Wz.createElement(_1, null, Wz.createElement(u, {
        flexDirection: "column"
    }, Wz.createElement(T, null, "Updated cell ", Wz.createElement(T, {
        bold: !0
    }, q), ":"), Wz.createElement(u, {
        marginLeft: 2
    }, Wz.createElement(ey, {
        code: K,
        filePath: "notebook.py"
    }))))
}
// @from(Ln 368077, Col 4)
Wz
// @from(Ln 368078, Col 4)
WWK = L(() => {
    _7();
    ny();
    S96();
    MM6();
    GK();
    HWK();
    g6();
    eK();
    Wz = K6(P6(), 1)
})
// @from(Ln 368095, Col 4)
czY
// @from(Ln 368095, Col 9)
lzY
// @from(Ln 368095, Col 14)
Ou