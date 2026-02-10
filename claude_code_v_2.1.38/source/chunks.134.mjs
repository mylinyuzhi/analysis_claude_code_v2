
// @from(Ln 334341, Col 0)
async function kP6(A, q) {
    if (!z2()) return;
    let K = null;
    if (A((Y) => {
            let z = Y;
            try {
                let w = Y.snapshots.findLast(($) => $.messageId === q);
                if (!w) return K1(Error(`FileHistory: Snapshot for ${q} not found`)), c("tengu_file_history_rewind_failed", {
                    trackedFilesCount: z.trackedFiles.size,
                    snapshotFound: !1
                }), K = Error("The selected snapshot was not found"), z;
                h(`FileHistory: [Rewind] Rewinding to snapshot for ${q}`);
                let H = DF4(z, w, !1);
                h(`FileHistory: [Rewind] Finished rewinding to ${q}`), c("tengu_file_history_rewind_success", {
                    trackedFilesCount: z.trackedFiles.size,
                    filesChangedCount: H?.filesChanged?.length
                })
            } catch (w) {
                K = w, K1(w), c("tengu_file_history_rewind_failed", {
                    trackedFilesCount: z.trackedFiles.size,
                    snapshotFound: !0
                })
            }
            return z
        }), K) throw K
}
// @from(Ln 334368, Col 0)
function LP6(A, q) {
    if (!z2()) return !1;
    return A.snapshots.some((K) => K.messageId === q)
}
// @from(Ln 334373, Col 0)
function RP6(A, q) {
    if (!z2()) return;
    let K = A.snapshots.findLast((Y) => Y.messageId === q);
    if (!K) return;
    return DF4(A, K, !0)
}
// @from(Ln 334380, Col 0)
function DF4(A, q, K) {
    let Y = b1(),
        z = [],
        w = 0,
        H = 0;
    for (let $ of A.trackedFiles) try {
        let O = EkA($),
            _ = q.trackedFileBackups[$],
            J = _ ? _.backupFileName : EvY($, A);
        if (J === void 0) K1(Error("FileHistory: Error finding the backup file to apply")), c("tengu_file_history_rewind_restore_file_failed", {
            dryRun: K
        });
        else if (J === null) {
            if (Y.existsSync(O)) {
                if (K) {
                    let X = OF4(O, void 0);
                    w += X?.insertions || 0, H += X?.deletions || 0
                } else Y.unlinkSync(O), h(`FileHistory: [Rewind] Deleted ${O}`);
                z.push(O)
            }
        } else if (K) {
            let X = OF4(O, J);
            if (w += X?.insertions || 0, H += X?.deletions || 0, X?.insertions || X?.deletions) z.push(O)
        } else if (jF4(O, J)) vvY(O, J), h(`FileHistory: [Rewind] Restored ${O} from ${J}`), z.push(O)
    } catch (O) {
        K1(O), c("tengu_file_history_rewind_restore_file_failed", {
            dryRun: K
        })
    }
    return {
        filesChanged: z,
        insertions: w,
        deletions: H
    }
}
// @from(Ln 334416, Col 0)
function jF4(A, q) {
    let K = b1(),
        Y = Jt(q);
    try {
        let z = K.existsSync(A),
            w = K.existsSync(Y);
        if (z !== w) return !0;
        else if (!z) return !1;
        let H = K.statSync(A),
            $ = K.statSync(Y);
        if (H.mode !== $.mode || H.size !== $.size) return !0;
        if (H.mtimeMs < $.mtimeMs) return !1;
        let O = K.readFileSync(A, {
                encoding: "utf-8"
            }),
            _ = K.readFileSync(Y, {
                encoding: "utf-8"
            });
        return O !== _
    } catch {
        return !0
    }
}
// @from(Ln 334440, Col 0)
function OF4(A, q) {
    let K = [],
        Y = 0,
        z = 0;
    try {
        let w = b1(),
            H = q && Jt(q),
            $ = w.existsSync(A),
            O = H && w.existsSync(H);
        if (!$ && !O) return {
            filesChanged: K,
            insertions: Y,
            deletions: z
        };
        K.push(A);
        let _ = $ ? w.readFileSync(A, {
                encoding: "utf-8"
            }) : "",
            J = O ? w.readFileSync(H, {
                encoding: "utf-8"
            }) : "";
        lo(_, J).forEach((D) => {
            if (D.added) Y += D.count || 0;
            if (D.removed) z += D.count || 0
        })
    } catch (w) {
        K1(Error(`FileHistory: Error generating diffStats: ${w}`))
    }
    return {
        filesChanged: K,
        insertions: Y,
        deletions: z
    }
}
// @from(Ln 334475, Col 0)
function TvY(A, q) {
    return `${ZvY("sha256").update(A).digest("hex").slice(0,16)}@v${q}`
}
// @from(Ln 334479, Col 0)
function Jt(A, q) {
    let K = O8();
    return _F4(K, "file-history", q || U6(), A)
}
// @from(Ln 334484, Col 0)
function TkA(A, q) {
    let K = A !== null ? TvY(A, q) : null;
    if (A && K) {
        let Y = b1(),
            z = Jt(K),
            w = vkA(z);
        if (!Y.existsSync(w)) Y.mkdirSync(w);
        let H = Y.readFileSync(A, {
            encoding: "utf-8"
        });
        c8(z, H, {
            encoding: "utf-8",
            flush: !0
        });
        let $ = Y.statSync(A),
            O = $.mode;
        XF4(z, O), c("tengu_file_history_backup_file_created", {
            version: q,
            fileSize: $.size
        })
    }
    return {
        backupFileName: K,
        version: q,
        backupTime: new Date
    }
}
// @from(Ln 334512, Col 0)
function vvY(A, q) {
    let K = b1(),
        Y = Jt(q);
    if (!K.existsSync(Y)) {
        c("tengu_file_history_rewind_restore_file_failed", {}), K1(Error(`FileHistory: [Rewind] Backup file not found: ${Y}`));
        return
    }
    let z = K.readFileSync(Y, {
            encoding: "utf-8"
        }),
        w = vkA(A);
    if (!K.existsSync(w)) K.mkdirSync(w);
    c8(A, z, {
        encoding: "utf-8",
        flush: !0
    });
    let H = K.statSync(Y).mode;
    XF4(A, H)
}
// @from(Ln 334532, Col 0)
function EvY(A, q) {
    for (let K of q.snapshots) {
        let Y = K.trackedFileBackups[A];
        if (Y !== void 0 && Y.version === 1) return Y.backupFileName
    }
    return
}
// @from(Ln 334540, Col 0)
function MF4(A) {
    if (!JF4(A)) return A;
    let q = y8();
    if (A.startsWith(q)) return fvY(q, A);
    return A
}
// @from(Ln 334547, Col 0)
function EkA(A) {
    if (JF4(A)) return A;
    return _F4(y8(), A)
}
// @from(Ln 334552, Col 0)
function yP6(A, q) {
    if (!z2()) return;
    let K = [],
        Y = new Set;
    for (let z of A) {
        let w = {};
        for (let [H, $] of Object.entries(z.trackedFileBackups)) {
            let O = MF4(H);
            Y.add(O), w[O] = $
        }
        K.push({
            ...z,
            trackedFileBackups: w
        })
    }
    q({
        snapshots: K,
        trackedFiles: Y
    })
}
// @from(Ln 334572, Col 0)
async function CP6(A) {
    if (!z2()) return;
    let q = A.fileHistorySnapshots;
    if (!q || A.messages.length === 0) return;
    let Y = A.messages[A.messages.length - 1]?.sessionId;
    if (!Y) {
        K1(Error("FileHistory: Failed to copy backups on restore (no previous session id)"));
        return
    }
    let z = U6();
    if (Y === z) {
        h(`FileHistory: No need to copy file history for resuming with same session id: ${z}`);
        return
    }
    try {
        for (let w of q) {
            let H = !1;
            for (let [$, O] of Object.entries(w.trackedFileBackups)) {
                if (!O.backupFileName) continue;
                let _ = b1(),
                    J = Jt(O.backupFileName, Y),
                    X = Jt(O.backupFileName, z);
                if (_.existsSync(X)) continue;
                if (!_.existsSync(J)) {
                    K1(Error(`FileHistory: Failed to copy backup ${O.backupFileName} on restore (backup file does not exist in ${Y})`)), H = !0;
                    break
                }
                let D = vkA(X);
                if (!_.existsSync(D)) _.mkdirSync(D);
                try {
                    _.linkSync(J, X)
                } catch {
                    K1(Error("FileHistory: Error hard linking backup file from previous session"));
                    try {
                        _.copyFileSync(J, X)
                    } catch {
                        H = !0, K1(Error("FileHistory: Error copying over backup from previous session"))
                    }
                }
                h(`FileHistory: Copied backup ${O.backupFileName} from session ${Y} to ${z}`)
            }
            if (!H) iQ1(w.messageId, w, !1).catch(($) => {
                K1(Error("FileHistory: Failed to record copy backup snapshot"))
            });
            else c("tengu_file_history_resume_copy_failed", {
                numSnapshots: q.length
            })
        }
    } catch (w) {
        K1(w)
    }
}
// @from(Ln 334625, Col 0)
function kvY(A, q) {
    let K = A.snapshots.at(-1),
        Y = q.snapshots.at(-1);
    if (!Y) return;
    let z = b1();
    for (let w of q.trackedFiles) {
        let H = EkA(w),
            $ = K?.trackedFileBackups[w],
            O = Y.trackedFileBackups[w];
        if ($?.backupFileName === O?.backupFileName && $?.version === O?.version) continue;
        let _ = null;
        if ($?.backupFileName) try {
            let X = Jt($.backupFileName);
            if (z.existsSync(X)) _ = z.readFileSync(X, {
                encoding: "utf-8"
            })
        } catch {}
        let J = null;
        if (O?.backupFileName) try {
            let X = Jt(O.backupFileName);
            if (z.existsSync(X)) J = z.readFileSync(X, {
                encoding: "utf-8"
            })
        } catch {} else if (O?.backupFileName === null) J = null;
        if (_ !== J) _t(H, _, J)
    }
}
// @from(Ln 334653, Col 0)
function PF4(A) {
    if (LvY) console.error(VvY(A, !1, 5))
}
// @from(Ln 334656, Col 4)
LvY = !1
// @from(Ln 334657, Col 4)
ZN = v(() => {
    _8();
    m6();
    Z6();
    B6();
    m6();
    y6();
    lq();
    hA();
    Pq1();
    u6();
    cA();
    PW1()
})
// @from(Ln 334672, Col 0)
function rR(A, q) {
    return A.flatMap((K, Y) => Y ? [q(Y), K] : [K])
}
// @from(Ln 334676, Col 0)
function WF4(A) {
    let q = e(10),
        {
            patch: K,
            dim: Y,
            width: z
        } = A,
        [w] = T7(),
        H;
    if (q[0] !== Y || q[1] !== K.lines || q[2] !== K.oldStart || q[3] !== w || q[4] !== z) H = xvY(K.lines, K.oldStart, z, Y, w), q[0] = Y, q[1] = K.lines, q[2] = K.oldStart, q[3] = w, q[4] = z, q[5] = H;
    else H = q[5];
    let $ = H,
        O;
    if (q[6] !== $) O = $.map(yvY), q[6] = $, q[7] = O;
    else O = q[7];
    let _;
    if (q[8] !== O) _ = _P.createElement(I, {
        flexDirection: "column",
        flexGrow: 1
    }, O), q[8] = O, q[9] = _;
    else _ = q[9];
    return _
}
// @from(Ln 334700, Col 0)
function yvY(A, q) {
    return _P.createElement(I, {
        key: q
    }, A)
}
// @from(Ln 334706, Col 0)
function CvY(A) {
    return A.map((q) => {
        if (q.startsWith("+")) return {
            code: q.slice(1),
            i: 0,
            type: "add",
            originalCode: q.slice(1)
        };
        if (q.startsWith("-")) return {
            code: q.slice(1),
            i: 0,
            type: "remove",
            originalCode: q.slice(1)
        };
        return {
            code: q.slice(1),
            i: 0,
            type: "nochange",
            originalCode: q.slice(1)
        }
    })
}
// @from(Ln 334729, Col 0)
function SvY(A) {
    let q = [],
        K = 0;
    while (K < A.length) {
        let Y = A[K];
        if (!Y) {
            K++;
            continue
        }
        if (Y.type === "remove") {
            let z = [Y],
                w = K + 1;
            while (w < A.length && A[w]?.type === "remove") {
                let $ = A[w];
                if ($) z.push($);
                w++
            }
            let H = [];
            while (w < A.length && A[w]?.type === "add") {
                let $ = A[w];
                if ($) H.push($);
                w++
            }
            if (z.length > 0 && H.length > 0) {
                let $ = Math.min(z.length, H.length);
                for (let O = 0; O < $; O++) {
                    let _ = z[O],
                        J = H[O];
                    if (_ && J) _.wordDiff = !0, J.wordDiff = !0, _.matchedLine = J, J.matchedLine = _
                }
                q.push(...z.filter(Boolean)), q.push(...H.filter(Boolean)), K = w
            } else q.push(Y), K++
        } else q.push(Y), K++
    }
    return q
}
// @from(Ln 334766, Col 0)
function hvY(A, q) {
    return WOA(A, q, {
        ignoreCase: !1
    })
}
// @from(Ln 334772, Col 0)
function IvY(A, q, K, Y, z) {
    let {
        type: w,
        i: H,
        wordDiff: $,
        matchedLine: O,
        originalCode: _
    } = A;
    if (!$ || !O) return null;
    let J = w === "remove" ? _ : O.originalCode,
        X = w === "remove" ? O.originalCode : _,
        D = hvY(J, X),
        j = J.length + X.length;
    if (D.filter((k) => k.added || k.removed).reduce((k, y) => k + y.value.length, 0) / j > RvY || Y) return null;
    let W = w === "add" ? "+" : "-",
        G = W.length,
        f = Math.max(1, q - K - 1 - G),
        Z = [],
        N = [],
        T = 0;
    if (D.forEach((k, y) => {
            let B = !1,
                S;
            if (w === "add") {
                if (k.added) B = !0, S = "diffAddedWord";
                else if (!k.removed) B = !0
            } else if (w === "remove") {
                if (k.removed) B = !0, S = "diffRemovedWord";
                else if (!k.added) B = !0
            }
            if (!B) return;
            TV(k.value, f, "wrap").split(`
`).forEach((g, U) => {
                if (!g) return;
                if (U > 0 || T + UA(g) > f) {
                    if (N.length > 0) Z.push({
                        content: [...N],
                        contentWidth: T
                    }), N = [], T = 0
                }
                N.push(_P.createElement(V, {
                    key: `part-${y}-${U}`,
                    backgroundColor: S
                }, g)), T += UA(g)
            })
        }), N.length > 0) Z.push({
        content: N,
        contentWidth: T
    });
    return Z.map(({
        content: k,
        contentWidth: y
    }, B) => {
        let S = `${w}-${H}-${B}`,
            m = w === "add" ? Y ? "diffAddedDimmed" : "diffAdded" : Y ? "diffRemovedDimmed" : "diffRemoved",
            b = B === 0 ? H : void 0,
            g = (b !== void 0 ? b.toString().padStart(K) : " ".repeat(K)) + " ",
            U = g.length + G + y,
            x = Math.max(0, q - U);
        return _P.createElement(V, {
            key: S,
            color: z ? "text" : void 0,
            backgroundColor: m,
            dimColor: Y
        }, g, W, k, " ".repeat(x))
    })
}
// @from(Ln 334840, Col 0)
function xvY(A, q, K, Y, z) {
    let w = Math.max(1, Math.floor(K)),
        H = CvY(A),
        $ = SvY(H),
        O = bvY($, q),
        _ = Math.max(...O.map(({
            i: X
        }) => X), 0),
        J = Math.max(_.toString().length + 1, 0);
    return O.flatMap((X) => {
        let {
            type: D,
            code: j,
            i: M,
            wordDiff: P,
            matchedLine: W
        } = X;
        if (P && W) {
            let T = IvY(X, w, J, Y, z);
            if (T !== null) return T
        }
        let G = 2,
            f = Math.max(1, w - J - 1 - G);
        return TV(j, f, "wrap").split(`
`).map((T, k) => {
            let y = `${D}-${M}-${k}`,
                B = k === 0 ? M : void 0,
                S = (B !== void 0 ? B.toString().padStart(J) : " ".repeat(J)) + " ",
                m = D === "add" ? "+" : D === "remove" ? "-" : " ",
                b = S.length + 1 + UA(T),
                g = Math.max(0, w - b);
            switch (D) {
                case "add":
                    return _P.createElement(V, {
                        key: y,
                        color: z ? "text" : void 0,
                        backgroundColor: Y ? "diffAddedDimmed" : "diffAdded",
                        dimColor: Y
                    }, S, m, T, " ".repeat(g));
                case "remove":
                    return _P.createElement(V, {
                        key: y,
                        color: z ? "text" : void 0,
                        backgroundColor: Y ? "diffRemovedDimmed" : "diffRemoved",
                        dimColor: Y
                    }, S, m, T, " ".repeat(g));
                case "nochange":
                    return _P.createElement(V, {
                        key: y,
                        color: z ? "text" : void 0,
                        dimColor: Y
                    }, _P.createElement(V, {
                        dimColor: !0
                    }, S), m, T, " ".repeat(g))
            }
        })
    })
}
// @from(Ln 334899, Col 0)
function bvY(A, q) {
    let K = q,
        Y = [],
        z = [...A];
    while (z.length > 0) {
        let w = z.shift(),
            {
                code: H,
                type: $,
                originalCode: O,
                wordDiff: _,
                matchedLine: J
            } = w,
            X = {
                code: H,
                type: $,
                i: K,
                originalCode: O,
                wordDiff: _,
                matchedLine: J
            };
        switch ($) {
            case "nochange":
                K++, Y.push(X);
                break;
            case "add":
                K++, Y.push(X);
                break;
            case "remove": {
                Y.push(X);
                let D = 0;
                while (z[0]?.type === "remove") {
                    K++;
                    let j = z.shift(),
                        {
                            code: M,
                            type: P,
                            originalCode: W,
                            wordDiff: G,
                            matchedLine: f
                        } = j,
                        Z = {
                            code: M,
                            type: P,
                            i: K,
                            originalCode: W,
                            wordDiff: G,
                            matchedLine: f
                        };
                    Y.push(Z), D++
                }
                K -= D;
                break
            }
        }
    }
    return Y
}
// @from(Ln 334957, Col 4)
_P
// @from(Ln 334957, Col 8)
RvY = 0.4
// @from(Ln 334958, Col 4)
GF4 = v(() => {
    i1();
    m1();
    Pq1();
    LY();
    _P = o(X1(), 1)
})
// @from(Ln 334965, Col 4)
ZF4 = {}
// @from(Ln 334972, Col 4)
GW1
// @from(Ln 334972, Col 9)
uvY
// @from(Ln 334972, Col 14)
BvY
// @from(Ln 334972, Col 19)
mvY
// @from(Ln 334972, Col 24)
FvY
// @from(Ln 334973, Col 4)
fF4 = v(() => {
    try {
        GW1 = (() => {
            throw new Error("Cannot require module " + "../../color-diff.node");
        })()
    } catch (A) {
        GW1 = null
    }
    uvY = GW1?.ColorDiff, BvY = GW1?.ColorFile, mvY = GW1?.getSyntaxTheme, FvY = GW1?.ColorDiff
})
// @from(Ln 334984, Col 0)
function kkA() {
    if (FY(process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT)) return "env";
    if (!D9()) return "build";
    return null
}
// @from(Ln 334989, Col 0)
async function Dt() {
    if (VF4) return;
    if (VF4 = !0, kkA() !== null) return;
    try {
        let A = await Promise.resolve().then(() => (fF4(), ZF4));
        NF4 = A.ColorDiff, TF4 = A.ColorFile, vF4 = A.getSyntaxTheme
    } catch (A) {
        h(`[ColorDiff] Rust module unavailable, falling back to JS: ${A instanceof Error?A.message:String(A)}`)
    }
}
// @from(Ln 335000, Col 0)
function EF4() {
    return NF4
}
// @from(Ln 335004, Col 0)
function kF4() {
    return TF4
}
// @from(Ln 335008, Col 0)
function LF4(A) {
    return vF4?.(A) ?? null
}
// @from(Ln 335012, Col 0)
function LkA(A) {
    return A.some((q) => q.type === "assistant" && q.message.content.some((K) => K.type === "tool_use" && QvY.has(K.name ?? "")))
}
// @from(Ln 335015, Col 4)
NF4 = null
// @from(Ln 335016, Col 4)
TF4 = null
// @from(Ln 335017, Col 4)
vF4 = null
// @from(Ln 335018, Col 4)
VF4 = !1
// @from(Ln 335019, Col 4)
QvY
// @from(Ln 335020, Col 4)
G51 = v(() => {
    Z6();
    hA();
    SD();
    QvY = new Set([bq, f5, jM])
})
// @from(Ln 335027, Col 0)
function gvY(A, q) {
    return MI.createElement(V, {
        key: q
    }, MI.createElement(W3, null, A))
}
// @from(Ln 335032, Col 4)
MI
// @from(Ln 335032, Col 8)
RF4
// @from(Ln 335032, Col 13)
fN
// @from(Ln 335033, Col 4)
jt = v(() => {
    i1();
    m1();
    GF4();
    G51();
    cp();
    MI = o(X1(), 1), RF4 = o(X1(), 1), fN = RF4.memo(function(q) {
        let K = e(16),
            {
                patch: Y,
                dim: z,
                filePath: w,
                firstLine: H,
                fileContent: $,
                width: O,
                skipHighlighting: _
            } = q,
            J = _ === void 0 ? !1 : _,
            [X] = T7(),
            j = $j().syntaxHighlightingDisabled ?? !1,
            M;
        A: {
            if (J || j) {
                M = null;
                break A
            }
            let Z;
            if (K[0] === Symbol.for("react.memo_cache_sentinel")) Z = EF4(),
            K[0] = Z;
            else Z = K[0];
            let N = Z;
            if (!N) {
                M = null;
                break A
            }
            let T = $ ?? null,
                k;
            if (K[1] !== w || K[2] !== H || K[3] !== Y || K[4] !== T) k = new N(Y, H, w, T),
            K[1] = w,
            K[2] = H,
            K[3] = Y,
            K[4] = T,
            K[5] = k;
            else k = K[5];M = k
        }
        let P = M,
            W;
        A: {
            if (P === null) {
                W = null;
                break A
            }
            let Z = Math.max(1, Math.floor(O)),
                N;
            if (K[6] !== P || K[7] !== z || K[8] !== Z || K[9] !== X) N = P.render(X, Z, z),
            K[6] = P,
            K[7] = z,
            K[8] = Z,
            K[9] = X,
            K[10] = N;
            else N = K[10];W = N
        }
        let G = W,
            f;
        if (K[11] !== z || K[12] !== G || K[13] !== Y || K[14] !== O) f = MI.createElement(I, null, G ? MI.createElement(I, {
            flexDirection: "column"
        }, G.map(gvY)) : MI.createElement(WF4, {
            patch: Y,
            dim: z,
            width: O
        })), K[11] = z, K[12] = G, K[13] = Y, K[14] = O, K[15] = f;
        else f = K[15];
        return f
    })
})
// @from(Ln 335109, Col 0)
function SP6(A) {
    let q = e(27),
        {
            filePath: K,
            structuredPatch: Y,
            firstLine: z,
            fileContent: w,
            style: H,
            verbose: $,
            previewHint: O
        } = A,
        {
            columns: _
        } = Z8(),
        J = Y.reduce(cvY, 0),
        X = Y.reduce(pvY, 0),
        D;
    if (q[0] !== J) D = J > 0 ? bY.createElement(bY.Fragment, null, "Added ", bY.createElement(V, {
        bold: !0
    }, J), " ", J > 1 ? "lines" : "line") : null, q[0] = J, q[1] = D;
    else D = q[1];
    let j = J > 0 && X > 0 ? ", " : null,
        M;
    if (q[2] !== J || q[3] !== X) M = X > 0 ? bY.createElement(bY.Fragment, null, J === 0 ? "R" : "r", "emoved ", bY.createElement(V, {
        bold: !0
    }, X), " ", X > 1 ? "lines" : "line") : null, q[2] = J, q[3] = X, q[4] = M;
    else M = q[4];
    let P;
    if (q[5] !== D || q[6] !== j || q[7] !== M) P = bY.createElement(V, null, D, j, M), q[5] = D, q[6] = j, q[7] = M, q[8] = P;
    else P = q[8];
    let W = P;
    if (O) {
        if (H !== "condensed" && !$) {
            let N;
            if (q[9] !== O) N = bY.createElement(HA, null, bY.createElement(V, {
                dimColor: !0
            }, O)), q[9] = O, q[10] = N;
            else N = q[10];
            return N
        }
    } else if (H === "condensed" && !$) return W;
    let G;
    if (q[11] !== W) G = bY.createElement(V, null, W), q[11] = W, q[12] = G;
    else G = q[12];
    let f;
    if (q[13] !== _ || q[14] !== w || q[15] !== K || q[16] !== z || q[17] !== Y) {
        let N;
        if (q[19] !== _ || q[20] !== w || q[21] !== K || q[22] !== z) N = (T) => bY.createElement(I, {
            flexDirection: "column",
            key: T.newStart
        }, bY.createElement(fN, {
            patch: T,
            dim: !1,
            width: _ - 12,
            filePath: K,
            firstLine: z,
            fileContent: w
        })), q[19] = _, q[20] = w, q[21] = K, q[22] = z, q[23] = N;
        else N = q[23];
        f = rR(Y.map(N), UvY), q[13] = _, q[14] = w, q[15] = K, q[16] = z, q[17] = Y, q[18] = f
    } else f = q[18];
    let Z;
    if (q[24] !== G || q[25] !== f) Z = bY.createElement(HA, null, bY.createElement(I, {
        flexDirection: "column"
    }, G, f)), q[24] = G, q[25] = f, q[26] = Z;
    else Z = q[26];
    return Z
}
// @from(Ln 335178, Col 0)
function UvY(A) {
    return bY.createElement(I, {
        key: `ellipsis-${A}`
    }, bY.createElement(V, {
        dimColor: !0
    }, "..."))
}
// @from(Ln 335186, Col 0)
function pvY(A, q) {
    return A + q.lines.filter(dvY).length
}
// @from(Ln 335190, Col 0)
function dvY(A) {
    return A.startsWith("-")
}
// @from(Ln 335194, Col 0)
function cvY(A, q) {
    return A + q.lines.filter(lvY).length
}
// @from(Ln 335198, Col 0)
function lvY(A) {
    return A.startsWith("+")
}
// @from(Ln 335201, Col 4)
bY
// @from(Ln 335202, Col 4)
RkA = v(() => {
    i1();
    m1();
    jt();
    mq();
    eq();
    bY = o(X1(), 1)
})
// @from(Ln 335214, Col 0)
function yF4(A) {
    let q = e(11),
        {
            code: K,
            filePath: Y,
            dim: z,
            skipColoring: w
        } = A,
        H = z === void 0 ? !1 : z,
        $ = w === void 0 ? !1 : w,
        O;
    if (q[0] !== Y) O = ivY(Y).slice(1), q[0] = Y, q[1] = O;
    else O = q[1];
    let _ = O,
        J;
    if (q[2] !== K || q[3] !== _ || q[4] !== $) {
        A: {
            let P = J01(K);
            if ($) {
                J = P;
                break A
            }
            let W = "markdown";
            if (_)
                if (nQ1.supportsLanguage(_)) W = _;
                else h(`Language not supported while highlighting code, falling back to markdown: ${_}`);
            try {
                J = nQ1.highlight(P, {
                    language: W
                });
                break A
            } catch (G) {
                let f = G;
                if (f instanceof Error && f.message.includes("Unknown language")) {
                    h(`Language not supported while highlighting code, falling back to markdown: ${f}`), J = nQ1.highlight(P, {
                        language: "markdown"
                    });
                    break A
                }
            }
            J = void 0
        }
        q[2] = K,
        q[3] = _,
        q[4] = $,
        q[5] = J
    }
    else J = q[5];
    let D = J ?? "",
        j;
    if (q[6] !== D) j = ykA.default.createElement(W3, null, D), q[6] = D, q[7] = j;
    else j = q[7];
    let M;
    if (q[8] !== H || q[9] !== j) M = ykA.default.createElement(V, {
        dimColor: H
    }, j), q[8] = H, q[9] = j, q[10] = M;
    else M = q[10];
    return M
}
// @from(Ln 335273, Col 4)
nQ1
// @from(Ln 335273, Col 9)
ykA
// @from(Ln 335274, Col 4)
CF4 = v(() => {
    i1();
    m1();
    Z6();
    wq();
    nQ1 = o(eJ6(), 1), ykA = o(X1(), 1)
})
// @from(Ln 335282, Col 0)
function rvY(A, q) {
    return PI.createElement(V, {
        key: q
    }, PI.createElement(W3, null, A))
}
// @from(Ln 335287, Col 4)
PI
// @from(Ln 335287, Col 8)
Mt
// @from(Ln 335287, Col 12)
nvY = 80
// @from(Ln 335288, Col 4)
VN
// @from(Ln 335289, Col 4)
Z51 = v(() => {
    i1();
    m1();
    CF4();
    G51();
    cp();
    PI = o(X1(), 1), Mt = o(X1(), 1), VN = Mt.memo(function(q) {
        let K = e(18),
            {
                code: Y,
                filePath: z,
                width: w,
                dim: H
            } = q,
            $ = H === void 0 ? !1 : H,
            O = Mt.useRef(null),
            [_, J] = Mt.useState(w || nvY),
            [X] = T7(),
            j = $j().syntaxHighlightingDisabled ?? !1,
            M;
        A: {
            if (j) {
                M = null;
                break A
            }
            let T;
            if (K[0] === Symbol.for("react.memo_cache_sentinel")) T = kF4(),
            K[0] = T;
            else T = K[0];
            let k = T;
            if (!k) {
                M = null;
                break A
            }
            let y;
            if (K[1] !== Y || K[2] !== z) y = new k(Y, z),
            K[1] = Y,
            K[2] = z,
            K[3] = y;
            else y = K[3];M = y
        }
        let P = M,
            W, G;
        if (K[4] !== w) W = () => {
            if (!w && O.current) {
                let {
                    width: T
                } = ED1(O.current);
                if (T > 0) J(T - 2)
            }
        }, G = [w], K[4] = w, K[5] = W, K[6] = G;
        else W = K[5], G = K[6];
        Mt.useEffect(W, G);
        let f;
        A: {
            if (P === null) {
                f = null;
                break A
            }
            let T;
            if (K[7] !== P || K[8] !== $ || K[9] !== _ || K[10] !== X) T = P.render(X, _, $),
            K[7] = P,
            K[8] = $,
            K[9] = _,
            K[10] = X,
            K[11] = T;
            else T = K[11];f = T
        }
        let Z = f,
            N;
        if (K[12] !== Y || K[13] !== $ || K[14] !== z || K[15] !== Z || K[16] !== j) N = PI.createElement(I, {
            ref: O
        }, Z ? PI.createElement(I, {
            flexDirection: "column"
        }, Z.map(rvY)) : PI.createElement(yF4, {
            code: Y,
            filePath: z,
            dim: $,
            skipColoring: j
        })), K[12] = Y, K[13] = $, K[14] = z, K[15] = Z, K[16] = j, K[17] = N;
        else N = K[17];
        return N
    })
})
// @from(Ln 335377, Col 0)
function ZW1(A) {
    let q = e(43),
        {
            file_path: K,
            operation: Y,
            patch: z,
            firstLine: w,
            fileContent: H,
            content: $,
            style: O,
            verbose: _
        } = A,
        {
            columns: J
        } = Z8(),
        X;
    if (q[0] !== Y) X = Iz.createElement(V, {
        color: "subtle"
    }, "User rejected ", Y, " to "), q[0] = Y, q[1] = X;
    else X = q[1];
    let D;
    if (q[2] !== K || q[3] !== _) D = _ ? K : ovY(h6(), K), q[2] = K, q[3] = _, q[4] = D;
    else D = q[4];
    let j;
    if (q[5] !== D) j = Iz.createElement(V, {
        bold: !0,
        color: "subtle"
    }, D), q[5] = D, q[6] = j;
    else j = q[6];
    let M;
    if (q[7] !== X || q[8] !== j) M = Iz.createElement(I, {
        flexDirection: "row"
    }, X, j), q[7] = X, q[8] = j, q[9] = M;
    else M = q[9];
    let P = M;
    if (O === "condensed" && !_) {
        let f;
        if (q[10] !== P) f = Iz.createElement(HA, null, P), q[10] = P, q[11] = f;
        else f = q[11];
        return f
    }
    if (Y === "write" && $ !== void 0) {
        let f, Z;
        if (q[12] !== $ || q[13] !== _) {
            let m = $.split(`
`);
            f = m.length - SF4, Z = _ ? $ : m.slice(0, SF4).join(`
`), q[12] = $, q[13] = _, q[14] = f, q[15] = Z
        } else f = q[14], Z = q[15];
        let T = Z || "(No content)",
            k = J - 12,
            y;
        if (q[16] !== K || q[17] !== T || q[18] !== k) y = Iz.createElement(VN, {
            code: T,
            filePath: K,
            width: k,
            dim: !0
        }), q[16] = K, q[17] = T, q[18] = k, q[19] = y;
        else y = q[19];
        let B;
        if (q[20] !== f || q[21] !== _) B = !_ && f > 0 && Iz.createElement(V, {
            dimColor: !0
        }, "… +", f, " lines"), q[20] = f, q[21] = _, q[22] = B;
        else B = q[22];
        let S;
        if (q[23] !== y || q[24] !== B || q[25] !== P) S = Iz.createElement(HA, null, Iz.createElement(I, {
            flexDirection: "column"
        }, P, y, B)), q[23] = y, q[24] = B, q[25] = P, q[26] = S;
        else S = q[26];
        return S
    }
    if (!z || z.length === 0) {
        let f;
        if (q[27] !== P) f = Iz.createElement(HA, null, P), q[27] = P, q[28] = f;
        else f = q[28];
        return f
    }
    let W;
    if (q[29] !== J || q[30] !== H || q[31] !== K || q[32] !== w || q[33] !== z) {
        let f;
        if (q[35] !== J || q[36] !== H || q[37] !== K || q[38] !== w) f = (Z) => Iz.createElement(I, {
            flexDirection: "column",
            key: Z.newStart
        }, Iz.createElement(fN, {
            patch: Z,
            dim: !0,
            width: J - 12,
            filePath: K,
            firstLine: w,
            fileContent: H
        })), q[35] = J, q[36] = H, q[37] = K, q[38] = w, q[39] = f;
        else f = q[39];
        W = rR(z.map(f), avY), q[29] = J, q[30] = H, q[31] = K, q[32] = w, q[33] = z, q[34] = W
    } else W = q[34];
    let G;
    if (q[40] !== W || q[41] !== P) G = Iz.createElement(HA, null, Iz.createElement(I, {
        flexDirection: "column"
    }, P, W)), q[40] = W, q[41] = P, q[42] = G;
    else G = q[42];
    return G
}
// @from(Ln 335479, Col 0)
function avY(A) {
    return Iz.createElement(I, {
        key: `ellipsis-${A}`
    }, Iz.createElement(V, {
        dimColor: !0
    }, "..."))
}
// @from(Ln 335486, Col 4)
Iz
// @from(Ln 335486, Col 8)
SF4 = 10
// @from(Ln 335487, Col 4)
CkA = v(() => {
    i1();
    m1();
    N7();
    jt();
    Z51();
    mq();
    eq();
    Iz = o(X1(), 1)
})
// @from(Ln 335501, Col 0)
function AE(A) {
    let q = e(5),
        {
            filePath: K,
            children: Y
        } = A,
        z;
    if (q[0] !== K) z = svY(K), q[0] = K, q[1] = z;
    else z = q[1];
    let w = Y ?? K,
        H;
    if (q[2] !== z.href || q[3] !== w) H = hF4.default.createElement(d7, {
        url: z.href
    }, w), q[2] = z.href, q[3] = w, q[4] = H;
    else H = q[4];
    return H
}
// @from(Ln 335518, Col 4)
hF4
// @from(Ln 335519, Col 4)
fW1 = v(() => {
    i1();
    VD1();
    hF4 = o(X1(), 1)
})
// @from(Ln 335525, Col 0)
function hP6(A) {
    if (!A) return "Update";
    if (A.file_path?.startsWith(UM())) return "Updated plan";
    if (A.old_string === "") return "Create";
    return "Update"
}
// @from(Ln 335532, Col 0)
function SkA(A) {
    if (!A?.file_path) return null;
    return L3(A.file_path)
}
// @from(Ln 335537, Col 0)
function IF4({
    file_path: A
}, {
    verbose: q
}) {
    if (!A) return null;
    if (A.startsWith(UM())) return "";
    return rO.createElement(AE, {
        filePath: A
    }, q ? A : L3(A))
}
// @from(Ln 335549, Col 0)
function xF4() {
    return null
}
// @from(Ln 335553, Col 0)
function bF4({
    filePath: A,
    structuredPatch: q,
    originalFile: K
}, Y, {
    style: z,
    verbose: w
}) {
    let H = A.startsWith(UM());
    return rO.createElement(SP6, {
        filePath: A,
        structuredPatch: q,
        firstLine: K.split(`
`)[0] ?? null,
        fileContent: K,
        style: z,
        verbose: w,
        previewHint: H ? "/plan to preview" : void 0
    })
}
// @from(Ln 335574, Col 0)
function uF4({
    file_path: A,
    old_string: q,
    new_string: K,
    replace_all: Y = !1
}, z) {
    let {
        style: w,
        verbose: H
    } = z;
    if (q === "") return rO.createElement(ZW1, {
        file_path: A,
        operation: "write",
        content: K,
        firstLine: K.split(`
`)[0] ?? null,
        verbose: H
    });
    try {
        let O = b1().existsSync(A) ? b1().readFileSync(A, {
                encoding: "utf8"
            }) : "",
            _ = PK1(O, q) || q,
            {
                patch: J
            } = j_6({
                filePath: A,
                fileContents: O,
                oldString: _,
                newString: K,
                replaceAll: Y
            });
        return rO.createElement(ZW1, {
            file_path: A,
            operation: "update",
            patch: J,
            firstLine: O.split(`
`)[0] ?? null,
            fileContent: O,
            style: w,
            verbose: H
        })
    } catch (O) {
        return K1(O), rO.createElement(HA, {
            height: 1
        }, rO.createElement(V, null, "(No changes)"))
    }
}
// @from(Ln 335623, Col 0)
function BF4(A, q) {
    let {
        verbose: K
    } = q;
    if (!K && typeof A === "string" && C4(A, "tool_use_error")) {
        if (C4(A, "tool_use_error")?.includes("File has not been read yet")) return rO.createElement(HA, null, rO.createElement(V, {
            dimColor: !0
        }, "File must be read first"));
        return rO.createElement(HA, null, rO.createElement(V, {
            color: "error"
        }, "Error editing file"))
    }
    return rO.createElement(z5, {
        result: A,
        verbose: K
    })
}
// @from(Ln 335640, Col 4)
rO
// @from(Ln 335641, Col 4)
hkA = v(() => {
    m1();
    RkA();
    UO();
    CkA();
    fW1();
    eq();
    wq();
    N8();
    WK1();
    _8();
    y6();
    mX();
    rO = o(X1(), 1)
})
// @from(Ln 335668, Col 0)
async function mF4() {
    if (!await aj()) return null;
    if (await QF4()) return null;
    let {
        stdout: q,
        code: K
    } = await IA(pq(), ["diff", "HEAD", "--shortstat"], {
        timeout: IP6,
        preserveOutputOnError: !1
    });
    if (K === 0) {
        let O = JEY(q);
        if (O && O.filesCount > HEY) return {
            stats: O,
            perFileStats: new Map,
            hunks: new Map
        }
    }
    let {
        stdout: Y,
        code: z
    } = await IA(pq(), ["diff", "HEAD", "--numstat"], {
        timeout: IP6,
        preserveOutputOnError: !1
    });
    if (z !== 0) return null;
    let {
        stats: w,
        perFileStats: H
    } = $EY(Y), $ = xkA - H.size;
    if ($ > 0) {
        let O = await _EY($);
        if (O) {
            w.filesCount += O.size;
            for (let [_, J] of O) H.set(_, J)
        }
    }
    return {
        stats: w,
        perFileStats: H,
        hunks: new Map
    }
}
// @from(Ln 335711, Col 0)
async function FF4() {
    if (!await aj()) return new Map;
    if (await QF4()) return new Map;
    let {
        stdout: q,
        code: K
    } = await IA(pq(), ["diff", "HEAD"], {
        timeout: IP6,
        preserveOutputOnError: !1
    });
    if (K !== 0) return new Map;
    return OEY(q)
}
// @from(Ln 335725, Col 0)
function $EY(A) {
    let q = A.trim().split(`
`).filter(Boolean),
        K = 0,
        Y = 0,
        z = 0,
        w = new Map;
    for (let H of q) {
        let $ = H.split("\t");
        if ($.length < 3) continue;
        z++;
        let O = $[0],
            _ = $[1],
            J = $.slice(2).join("\t"),
            X = O === "-" || _ === "-",
            D = X ? 0 : parseInt(O ?? "0", 10) || 0,
            j = X ? 0 : parseInt(_ ?? "0", 10) || 0;
        if (K += D, Y += j, w.size < xkA) w.set(J, {
            added: D,
            removed: j,
            isBinary: X
        })
    }
    return {
        stats: {
            filesCount: z,
            linesAdded: K,
            linesRemoved: Y
        },
        perFileStats: w
    }
}
// @from(Ln 335758, Col 0)
function OEY(A) {
    let q = new Map;
    if (!A.trim()) return q;
    let K = A.split(/^diff --git /m).filter(Boolean);
    for (let Y of K) {
        if (q.size >= xkA) break;
        if (Y.length > zEY) continue;
        let z = Y.split(`
`),
            w = z[0]?.match(/^a\/(.+?) b\/(.+)$/);
        if (!w) continue;
        let H = w[2] ?? w[1] ?? "",
            $ = [],
            O = null,
            _ = 0;
        for (let J = 1; J < z.length; J++) {
            let X = z[J] ?? "",
                D = X.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
            if (D) {
                if (O) $.push(O);
                O = {
                    oldStart: parseInt(D[1] ?? "0", 10),
                    oldLines: parseInt(D[2] ?? "1", 10),
                    newStart: parseInt(D[3] ?? "0", 10),
                    newLines: parseInt(D[4] ?? "1", 10),
                    lines: []
                };
                continue
            }
            if (X.startsWith("index ") || X.startsWith("---") || X.startsWith("+++") || X.startsWith("new file") || X.startsWith("deleted file") || X.startsWith("old mode") || X.startsWith("new mode") || X.startsWith("Binary files")) continue;
            if (O && (X.startsWith("+") || X.startsWith("-") || X.startsWith(" ") || X === "")) {
                if (_ >= wEY) continue;
                O.lines.push("" + X), _++
            }
        }
        if (O) $.push(O);
        if ($.length > 0) q.set(H, $)
    }
    return q
}
// @from(Ln 335798, Col 0)
async function QF4() {
    let A = await HH8(h6());
    if (!A) return !1;
    return (await Promise.all(["MERGE_HEAD", "REBASE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD"].map((Y) => evY(qEY(A, Y)).then(() => !0).catch(() => !1)))).some(Boolean)
}
// @from(Ln 335803, Col 0)
async function _EY(A) {
    let {
        stdout: q,
        code: K
    } = await IA(pq(), ["ls-files", "--others", "--exclude-standard"], {
        timeout: IP6,
        preserveOutputOnError: !1
    });
    if (K !== 0 || !q.trim()) return null;
    let Y = q.trim().split(`
`).filter(Boolean);
    if (Y.length === 0) return null;
    let z = new Map;
    for (let w of Y.slice(0, A)) z.set(w, {
        added: 0,
        removed: 0,
        isBinary: !1,
        isUntracked: !0
    });
    return z
}
// @from(Ln 335825, Col 0)
function JEY(A) {
    let q = A.match(/(\d+)\s+files?\s+changed(?:,\s+(\d+)\s+insertions?\(\+\))?(?:,\s+(\d+)\s+deletions?\(-\))?/);
    if (!q) return null;
    return {
        filesCount: parseInt(q[1] ?? "0", 10),
        linesAdded: parseInt(q[2] ?? "0", 10),
        linesRemoved: parseInt(q[3] ?? "0", 10)
    }
}
// @from(Ln 335834, Col 0)
async function xP6(A) {
    let q = YX(AEY(A));
    if (!q) return null;
    let K = KEY(q, A).split(YEY).join("/"),
        {
            code: Y
        } = await d4(pq(), ["ls-files", "--error-unmatch", K], {
            cwd: q,
            timeout: IkA
        });
    if (Y === 0) {
        let z = await DEY(q),
            {
                stdout: w,
                code: H
            } = await d4(pq(), ["diff", z, "--", K], {
                cwd: q,
                timeout: IkA
            });
        if (H !== 0) return null;
        if (!w) return null;
        return XEY(K, w, "modified")
    }
    return jEY(K, A)
}
// @from(Ln 335860, Col 0)
function XEY(A, q, K) {
    let Y = q.split(`
`),
        z = [],
        w = !1,
        H = 0,
        $ = 0;
    for (let O of Y) {
        if (O.startsWith("@@")) w = !0;
        if (w) {
            if (z.push(O), O.startsWith("+") && !O.startsWith("+++")) H++;
            else if (O.startsWith("-") && !O.startsWith("---")) $++
        }
    }
    return {
        filename: A,
        status: K,
        additions: H,
        deletions: $,
        changes: H + $,
        patch: z.join(`
`)
    }
}
// @from(Ln 335884, Col 0)
async function DEY(A) {
    let q = process.env.CLAUDE_CODE_BASE_REF || await tj(),
        {
            stdout: K,
            code: Y
        } = await d4(pq(), ["merge-base", "HEAD", q], {
            cwd: A,
            timeout: IkA
        });
    if (Y === 0 && K.trim()) return K.trim();
    return "HEAD"
}
// @from(Ln 335897, Col 0)
function jEY(A, q) {
    try {
        let Y = tvY(q, "utf-8").split(`
`);
        if (Y.length > 0 && Y[Y.length - 1] === "") Y.pop();
        let z = Y.length,
            w = Y.map(($) => `+${$}`).join(`
`),
            H = `@@ -0,0 +1,${z} @@
${w}`;
        return {
            filename: A,
            status: "added",
            additions: z,
            deletions: 0,
            changes: z,
            patch: H
        }
    } catch {
        return null
    }
}
// @from(Ln 335919, Col 4)
IP6 = 5000
// @from(Ln 335920, Col 4)
xkA = 50
// @from(Ln 335921, Col 4)
zEY = 1e6
// @from(Ln 335922, Col 4)
wEY = 400
// @from(Ln 335923, Col 4)
HEY = 500
// @from(Ln 335924, Col 4)
IkA = 3000
// @from(Ln 335925, Col 4)
rQ1 = v(() => {
    N7();
    tq();
    h9()
})
// @from(Ln 335942, Col 0)
function Gt(A, q) {
    switch (A) {
        case "policySettings":
            return Wt(df(), ".claude", q);
        case "userSettings":
            return Wt(O8(), q);
        case "projectSettings":
            return `.claude/${q}`;
        case "plugin":
            return "plugin";
        default:
            return ""
    }
}
// @from(Ln 335957, Col 0)
function NW1(A) {
    let q = [A.name, A.description, A.whenToUse].filter(Boolean).join(" ");
    return A2(q)
}
// @from(Ln 335962, Col 0)
function GEY(A) {
    try {
        return MEY(A)
    } catch {
        return null
    }
}
// @from(Ln 335970, Col 0)
function bP6(A) {
    return A === !0 || A === "true"
}
// @from(Ln 335974, Col 0)
function pF4(A, q) {
    if (!A.hooks) return;
    let K = Xk.safeParse(A.hooks);
    if (!K.success) {
        h(`Invalid hooks in skill '${q}': ${K.error.message}`);
        return
    }
    return K.data
}
// @from(Ln 335984, Col 0)
function ZEY(A) {
    if (!A.paths || typeof A.paths !== "string") return;
    let q = F76(A.paths).map((K) => {
        return K.endsWith("/**") ? K.slice(0, -3) : K
    }).filter((K) => K.length > 0);
    if (q.length === 0 || q.every((K) => K === "**")) return;
    return q
}
// @from(Ln 335993, Col 0)
function dF4({
    skillName: A,
    displayName: q,
    description: K,
    hasUserSpecifiedDescription: Y,
    markdownContent: z,
    allowedTools: w,
    argumentHint: H,
    argumentNames: $,
    whenToUse: O,
    version: _,
    model: J,
    disableModelInvocation: X,
    userInvocable: D,
    source: j,
    baseDir: M,
    loadedFrom: P,
    hooks: W,
    executionContext: G,
    agent: f,
    paths: Z
}) {
    return {
        type: "prompt",
        name: A,
        description: K,
        hasUserSpecifiedDescription: Y,
        allowedTools: w,
        argumentHint: H,
        argNames: $.length > 0 ? $ : void 0,
        whenToUse: O,
        version: _,
        model: J,
        disableModelInvocation: X,
        userInvocable: D,
        context: G,
        agent: f,
        paths: Z,
        contentLength: z.length,
        isEnabled: () => !0,
        isHidden: !D,
        progressMessage: "running",
        userFacingName() {
            return q || A
        },
        source: j,
        loadedFrom: P,
        hooks: W,
        skillRoot: M,
        async getPromptForCommand(N, T) {
            let k = M ? `Base directory for this skill: ${M}

${z}` : z;
            return k = Ej1(k, N, !0, $), k = k.replace(/\$\{CLAUDE_SESSION_ID\}/g, U6()), k = await Ma(k, {
                ...T,
                async getAppState() {
                    let y = await T.getAppState();
                    return {
                        ...y,
                        toolPermissionContext: {
                            ...y.toolPermissionContext,
                            alwaysAllowRules: {
                                ...y.toolPermissionContext.alwaysAllowRules,
                                command: w
                            }
                        }
                    }
                }
            }, `/${A}`), [{
                type: "text",
                text: k
            }]
        }
    }
}
// @from(Ln 336068, Col 0)
async function oQ1(A, q) {
    let K = b1(),
        Y = [];
    try {
        let z = K.readdirSync(A);
        for (let w of z) try {
            if (w.isDirectory() || w.isSymbolicLink()) {
                let H = Wt(A, w.name),
                    $ = Wt(H, "SKILL.md");
                try {
                    let O = K.readFileSync($, {
                            encoding: "utf-8"
                        }),
                        {
                            frontmatter: _,
                            content: J
                        } = yD(O, $),
                        X = w.name,
                        D = _.description ?? vp(J, "Skill"),
                        j = Vh(_["allowed-tools"]),
                        M = _["user-invocable"] === void 0 ? !0 : bP6(_["user-invocable"]),
                        P = bP6(_["disable-model-invocation"]),
                        W = _.model === "inherit" ? void 0 : _.model ? t9(_.model) : void 0,
                        G = pF4(_, X),
                        f = _.context === "fork" ? "fork" : void 0,
                        Z = _.agent,
                        N = xu1(_.arguments),
                        T = ZEY(_);
                    Y.push({
                        skill: dF4({
                            skillName: X,
                            displayName: _.name,
                            description: D,
                            hasUserSpecifiedDescription: !!_.description,
                            markdownContent: J,
                            allowedTools: j,
                            argumentHint: _["argument-hint"],
                            argumentNames: N,
                            whenToUse: _.when_to_use,
                            version: _.version,
                            model: W,
                            disableModelInvocation: P,
                            userInvocable: M,
                            source: q,
                            baseDir: H,
                            loadedFrom: "skills",
                            hooks: G,
                            executionContext: f,
                            agent: Z,
                            paths: T
                        }),
                        filePath: $
                    })
                } catch {}
            }
        } catch (H) {
            K1(H instanceof Error ? H : Error(String(H)))
        }
    } catch (z) {
        let w = z.code;
        if (w !== "ENOENT" && w !== "EACCES" && w !== "EPERM") K1(z instanceof Error ? z : Error(String(z)))
    }
    return Y
}
// @from(Ln 336133, Col 0)
function bkA(A) {
    return /^skill\.md$/i.test(uP6(A))
}
// @from(Ln 336137, Col 0)
function fEY(A) {
    let q = new Map;
    for (let Y of A) {
        let z = f51(Y.filePath),
            w = q.get(z) ?? [];
        w.push(Y), q.set(z, w)
    }
    let K = [];
    for (let [Y, z] of q) {
        let w = z.filter((H) => bkA(H.filePath));
        if (w.length > 0) {
            let H = w[0];
            if (w.length > 1) h(`Multiple skill files found in ${Y}, using ${uP6(H.filePath)}`);
            K.push(H)
        } else K.push(...z)
    }
    return K
}
// @from(Ln 336156, Col 0)
function cF4(A, q) {
    let K = q.endsWith(VW1) ? q.slice(0, -1) : q;
    if (A === K) return "";
    let Y = A.slice(K.length + 1);
    return Y ? Y.split(VW1).join(":") : ""
}
// @from(Ln 336163, Col 0)
function VEY(A, q) {
    let K = f51(A),
        Y = f51(K),
        z = uP6(K),
        w = cF4(Y, q);
    return w ? `${w}:${z}` : z
}
// @from(Ln 336171, Col 0)
function NEY(A, q) {
    let K = uP6(A),
        Y = f51(A),
        z = K.replace(/\.md$/, ""),
        w = cF4(Y, q);
    return w ? `${w}:${z}` : z
}
// @from(Ln 336179, Col 0)
function TEY(A) {
    return bkA(A.filePath) ? VEY(A.filePath, A.baseDir) : NEY(A.filePath, A.baseDir)
}
// @from(Ln 336182, Col 0)
async function vEY(A) {
    try {
        let q = await Qp("commands", A),
            K = fEY(q),
            Y = [];
        for (let {
                baseDir: z,
                filePath: w,
                frontmatter: H,
                content: $,
                source: O
            }
            of K) try {
            let _ = H.description ?? vp($, "Custom command"),
                J = Vh(H["allowed-tools"]),
                X = H["user-invocable"] === void 0 ? !0 : bP6(H["user-invocable"]),
                D = bP6(H["disable-model-invocation"]),
                j = H.model === "inherit" ? void 0 : H.model ? t9(H.model) : void 0,
                M = H.context === "fork" ? "fork" : void 0,
                P = H.agent,
                G = bkA(w) ? f51(w) : void 0,
                f = TEY({
                    baseDir: z,
                    filePath: w,
                    frontmatter: H,
                    content: $,
                    source: O
                }),
                Z = pF4(H, f),
                N = xu1(H.arguments);
            Y.push({
                skill: dF4({
                    skillName: f,
                    displayName: void 0,
                    description: _,
                    hasUserSpecifiedDescription: !!H.description,
                    markdownContent: $,
                    allowedTools: J,
                    argumentHint: H["argument-hint"],
                    argumentNames: N,
                    whenToUse: H.when_to_use,
                    version: H.version,
                    model: j,
                    disableModelInvocation: D,
                    userInvocable: X,
                    source: O,
                    baseDir: G,
                    loadedFrom: "commands_DEPRECATED",
                    hooks: Z,
                    executionContext: M,
                    agent: P,
                    paths: void 0
                }),
                filePath: w
            })
        } catch (_) {
            K1(_ instanceof Error ? _ : Error(String(_)))
        }
        return Y
    } catch (q) {
        return K1(q instanceof Error ? q : Error(String(q))), []
    }
}
// @from(Ln 336246, Col 0)
function BP6() {
    ukA.cache?.clear?.(), Qp.cache?.clear?.(), aQ1.clear(), BkA.clear()
}
// @from(Ln 336250, Col 0)
function lF4(A) {
    mkA.push(A)
}
// @from(Ln 336254, Col 0)
function TW1(A, q) {
    let K = b1(),
        Y = q.endsWith(VW1) ? q.slice(0, -1) : q,
        z = [];
    for (let w of A) {
        let H = f51(w);
        while (H.startsWith(Y + VW1)) {
            let $ = Wt(H, ".claude", "skills");
            if (!gF4.has($)) try {
                K.statSync($), z.push($), gF4.add($)
            } catch {}
            let O = f51(H);
            if (O === H) break;
            H = O
        }
    }
    return z.sort((w, H) => H.split(VW1).length - w.split(VW1).length)
}
// @from(Ln 336272, Col 0)
async function vW1(A) {
    if (A.length === 0) return;
    let q = new Set(Pt.keys()),
        K = await Promise.all(A.map((z) => oQ1(z, "projectSettings")));
    for (let z = K.length - 1; z >= 0; z--)
        for (let {
                skill: w
            }
            of K[z] ?? [])
            if (w.type === "prompt") Pt.set(w.name, w);
    let Y = K.flat().length;
    if (Y > 0) {
        let z = [...Pt.keys()].filter((w) => !q.has(w));
        if (h(`[skills] Dynamically discovered ${Y} skills from ${A.length} directories`), z.length > 0) c("tengu_dynamic_skills_changed", {
            source: "file_operation",
            previousCount: q.size,
            newCount: Pt.size,
            addedCount: z.length,
            directoryCount: A.length
        })
    }
    for (let z of mkA) try {
        z()
    } catch (w) {
        K1(w instanceof Error ? w : Error(String(w)))
    }
}
// @from(Ln 336300, Col 0)
function iF4() {
    return Array.from(Pt.values())
}
// @from(Ln 336304, Col 0)
function EW1(A, q) {
    if (aQ1.size === 0) return [];
    let K = [];
    for (let [Y, z] of aQ1) {
        if (z.type !== "prompt" || !z.paths || z.paths.length === 0) continue;
        let w = UF4.default().add(z.paths);
        for (let H of A) {
            let $ = PEY(H) ? WEY(q, H) : H;
            if (w.ignores($)) {
                Pt.set(Y, z), aQ1.delete(Y), BkA.add(Y), K.push(Y), h(`[skills] Activated conditional skill '${Y}' (matched path: ${$})`);
                break
            }
        }
    }
    if (K.length > 0) {
        c("tengu_dynamic_skills_changed", {
            source: "conditional_paths",
            previousCount: Pt.size - K.length,
            newCount: Pt.size,
            addedCount: K.length,
            directoryCount: 0
        });
        for (let Y of mkA) try {
            Y()
        } catch (z) {
            K1(z instanceof Error ? z : Error(String(z)))
        }
    }
    return K
}
// @from(Ln 336334, Col 4)
UF4
// @from(Ln 336334, Col 9)
ukA
// @from(Ln 336334, Col 14)
gF4
// @from(Ln 336334, Col 19)
Pt
// @from(Ln 336334, Col 23)
aQ1
// @from(Ln 336334, Col 28)
BkA
// @from(Ln 336334, Col 33)
mkA
// @from(Ln 336335, Col 4)
Zt = v(() => {
    zq();
    y6();
    Z6();
    u6();
    a01();
    Ep();
    _8();
    Lg();
    hA();
    $A1();
    E$();
    e7();
    hQ();
    vv();
    B6();
    bu1();
    UF4 = o(Aj1(), 1);
    ukA = KA(async (A) => {
        let q = Wt(O8(), "skills"),
            K = Wt(df(), ".claude", "skills"),
            Y = FkA("skills", A);
        h(`Loading skills from: managed=${K}, user=${q}, project=[${Y.join(", ")}]`);
        let [z, w, H] = await Promise.all([oQ1(K, "policySettings"), qX("userSettings") ? oQ1(q, "userSettings") : Promise.resolve([]), qX("projectSettings") ? Promise.all(Y.map((W) => oQ1(W, "projectSettings"))) : Promise.resolve([])]), $ = qC(), O = qX("projectSettings") ? await Promise.all($.map((W) => oQ1(Wt(W, ".claude", "skills"), "projectSettings"))) : [], _ = await vEY(A), J = [...z, ...w, ...H.flat(), ...O.flat(), ..._], X = new Map, D = [];
        for (let {
                skill: W,
                filePath: G
            }
            of J) {
            if (W.type !== "prompt") continue;
            let f = GEY(G);
            if (f === null) {
                D.push(W);
                continue
            }
            let Z = X.get(f);
            if (Z !== void 0) {
                h(`Skipping duplicate skill '${W.name}' from ${W.source} (same file already loaded from ${Z})`);
                continue
            }
            X.set(f, W.source), D.push(W)
        }
        let j = J.length - D.length;
        if (j > 0) h(`Deduplicated ${j} skills (same file)`);
        let M = [],
            P = [];
        for (let W of D)
            if (W.type === "prompt" && W.paths && W.paths.length > 0 && !BkA.has(W.name)) P.push(W);
            else M.push(W);
        for (let W of P) aQ1.set(W.name, W);
        if (P.length > 0) h(`[skills] ${P.length} conditional skills stored (activated when matching files are touched)`);
        return h(`Loaded ${D.length} unique skills (${M.length} unconditional, ${P.length} conditional, managed: ${z.length}, user: ${w.length}, project: ${H.flat().length}, additional: ${O.flat().length}, legacy commands: ${_.length})`), M
    });
    gF4 = new Set, Pt = new Map, aQ1 = new Map, BkA = new Set, mkA = []
})
// @from(Ln 336395, Col 4)
sW
// @from(Ln 336396, Col 4)
V51 = v(() => {
    u6();
    Uw6();
    wq();
    N7();
    B6();
    wp();
    du4();
    WK1();
    E2();
    Ez();
    _8();
    _51();
    Ot();
    lQ1();
    y6();
    Z6();
    gw6();
    wF4();
    ZN();
    PW1();
    hkA();
    U4();
    rQ1();
    Zt();
    sW = {
        name: bq,
        maxResultSizeChars: 1e5,
        strict: !0,
        async description() {
            return "A tool for editing files"
        },
        async prompt() {
            return pu4()
        },
        userFacingName: hP6,
        getToolUseSummary: SkA,
        getActivityDescription(A) {
            let q = SkA(A);
            return q ? `Editing ${q}` : "Editing file"
        },
        isEnabled() {
            return !0
        },
        get inputSchema() {
            return Qw6()
        },
        get outputSchema() {
            return TR7()
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
            return N51(sW, A, K.toolPermissionContext)
        },
        renderToolUseMessage: IF4,
        renderToolUseProgressMessage: xF4,
        renderToolResultMessage: bF4,
        renderToolUseRejectedMessage: uF4,
        renderToolUseErrorMessage: BF4,
        async validateInput({
            file_path: A,
            old_string: q,
            new_string: K,
            replace_all: Y = !1
        }, z) {
            if (q === K) return {
                result: !1,
                behavior: "ask",
                message: "No changes to make: old_string and new_string are exactly the same.",
                errorCode: 1
            };
            let w = g4(A),
                H = await z.getAppState();
            if (Gj(w, H.toolPermissionContext, "edit", "deny") !== null) return {
                result: !1,
                behavior: "ask",
                message: "File is in a directory that is denied by your permission settings.",
                errorCode: 2
            };
            if (w.startsWith("\\\\") || w.startsWith("//")) return {
                result: !0
            };
            let O = b1();
            if (O.existsSync(w) && q === "") {
                if (O.readFileSync(w, {
                        encoding: AX(w)
                    }).replaceAll(`\r
`, `
`).trim() !== "") return {
                    result: !1,
                    behavior: "ask",
                    message: "Cannot create new file - file already exists.",
                    errorCode: 3
                };
                return {
                    result: !0
                }
            }
            if (!O.existsSync(w) && q === "") return {
                result: !0
            };
            if (!O.existsSync(w)) {
                let M = mP6(w),
                    P = "File does not exist.",
                    W = h6(),
                    G = y8();
                if (W !== G) P += ` Current working directory: ${W}`;
                if (M) P += ` Did you mean ${M}?`;
                return {
                    result: !1,
                    behavior: "ask",
                    message: P,
                    errorCode: 4
                }
            }
            if (w.endsWith(".ipynb")) return {
                result: !1,
                behavior: "ask",
                message: `File is a Jupyter Notebook. Use the ${jM} to edit this file.`,
                errorCode: 5
            };
            let _ = z.readFileState.get(w);
            if (!_) return {
                result: !1,
                behavior: "ask",
                message: "File has not been read yet. Read it first before writing to it.",
                meta: {
                    isFilePathAbsolute: String(QkA(A))
                },
                errorCode: 6
            };
            if (_) {
                if (aW(w) > _.timestamp)
                    if (_.offset === void 0 && _.limit === void 0)
                        if (O.readFileSync(w, {
                                encoding: AX(w)
                            }).replaceAll(`\r
`, `
`) === _.content);
                        else return {
                            result: !1,
                            behavior: "ask",
                            message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
                            errorCode: 7
                        };
                else return {
                    result: !1,
                    behavior: "ask",
                    message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
                    errorCode: 7
                }
            }
            let J = O.readFileSync(w, {
                    encoding: AX(w)
                }).replaceAll(`\r
`, `
`),
                X = PK1(J, q);
            if (!X) return {
                result: !1,
                behavior: "ask",
                message: `String to replace not found in file.
String: ${q}`,
                meta: {
                    isFilePathAbsolute: String(QkA(A))
                },
                errorCode: 8
            };
            let D = J.split(X).length - 1;
            if (D > 1 && !Y) return {
                result: !1,
                behavior: "ask",
                message: `Found ${D} matches of the string to replace, but replace_all is false. To replace all occurrences, set replace_all to true. To replace only one occurrence, please provide more context to uniquely identify the instance.
String: ${q}`,
                meta: {
                    isFilePathAbsolute: String(QkA(A)),
                    actualOldString: X
                },
                errorCode: 9
            };
            let j = zF4(w, J, () => {
                return Y ? J.replaceAll(X, K) : J.replace(X, K)
            });
            if (j !== null) return j;
            return {
                result: !0,
                meta: {
                    actualOldString: X
                }
            }
        },
        inputsEquivalent(A, q) {
            return Tp7({
                file_path: A.file_path,
                edits: [{
                    old_string: A.old_string,
                    new_string: A.new_string,
                    replace_all: A.replace_all ?? !1
                }]
            }, {
                file_path: q.file_path,
                edits: [{
                    old_string: q.old_string,
                    new_string: q.new_string,
                    replace_all: q.replace_all ?? !1
                }]
            })
        },
        async call({
            file_path: A,
            old_string: q,
            new_string: K,
            replace_all: Y = !1
        }, {
            readFileState: z,
            userModified: w,
            updateFileHistoryState: H,
            dynamicSkillDirTriggers: $
        }, O, _) {
            let J = b1(),
                X = g4(A),
                D = h6(),
                j = TW1([X], D);
            if (j.length > 0) {
                for (let B of j) $?.add(B);
                vW1(j).catch(() => {})
            }
            EW1([X], D), await Fd.beforeFileEdited(X);
            let M = J.existsSync(X) ? $J(X) : "";
            if (J.existsSync(X)) {
                let B = aW(X),
                    S = z.get(X);
                if (!S || B > S.timestamp) {
                    if (!(S && S.offset === void 0 && S.limit === void 0 && M === S.content)) throw Error(ty1)
                }
            }
            if (z2()) await Xt(H, X, _.uuid);
            let P = PK1(M, q) || q,
                {
                    patch: W,
                    updatedFile: G
                } = j_6({
                    filePath: X,
                    fileContents: M,
                    oldString: P,
                    newString: K,
                    replaceAll: Y
                }),
                f = EEY(X);
            J.mkdirSync(f);
            let Z = J.existsSync(X) ? Qd(X) : "LF",
                N = J.existsSync(X) ? AX(X) : "utf8";
            ft(X, G, N, Z);
            let T = md();
            if (T) NP6(`file://${X}`), T.changeFile(X, G).catch((B) => {
                h(`LSP: Failed to notify server of file change for ${X}: ${B.message}`), K1(B)
            }), T.saveFile(X).catch((B) => {
                h(`LSP: Failed to notify server of file save for ${X}: ${B.message}`), K1(B)
            });
            if (_t(X, M, G), z.set(X, {
                    content: G,
                    timestamp: aW(X),
                    offset: void 0,
                    limit: void 0
                }), X.endsWith(`${kEY}CLAUDE.md`)) c("tengu_write_claudemd", {});
            ix1(W), eS({
                operation: "edit",
                tool: "FileEditTool",
                filePath: X
            });
            let k;
            if (process.env.CLAUDE_CODE_ENTRYPOINT === "remote" && !0 && x8("tengu_quartz_lantern", !1)) {
                let B = Date.now(),
                    S = await xP6(X);
                if (S) k = S;
                c("tengu_tool_use_diff_computed", {
                    isEditTool: !0,
                    durationMs: Date.now() - B,
                    hasDiff: !!S
                })
            }
            return {
                data: {
                    filePath: A,
                    oldString: P,
                    newString: K,
                    originalFile: M,
                    structuredPatch: W,
                    userModified: w ?? !1,
                    replaceAll: Y,
                    ...k && {
                        gitDiff: k
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            filePath: A,
            oldString: q,
            newString: K,
            userModified: Y,
            replaceAll: z
        }, w) {
            let H = Y ? ".  The user modified your proposed changes before accepting them. " : "";
            if (z) return {
                tool_use_id: w,
                type: "tool_result",
                content: `The file ${A} has been updated${H}. All occurrences of '${q}' were successfully replaced with '${K}'.`
            };
            return {
                tool_use_id: w,
                type: "tool_result",
                content: `The file ${A} has been updated successfully${H}.`
            }
        }
    }
})
// @from(Ln 336722, Col 4)
nF4 = "Replace the contents of a specific cell in a Jupyter notebook."
// @from(Ln 336723, Col 4)
rF4 = "Completely replaces the contents of a specific cell in a Jupyter notebook (.ipynb file) with new source. Jupyter notebooks are interactive documents that combine code, text, and visualizations, commonly used for data analysis and scientific computing. The notebook_path parameter must be an absolute path, not a relative path. The cell_number is 0-indexed. Use edit_mode=insert to add a new cell at the index specified by cell_number. Use edit_mode=delete to delete the cell at the index specified by cell_number."
// @from(Ln 336728, Col 0)
function oF4(A) {
    let q = e(20),
        {
            notebook_path: K,
            cell_id: Y,
            new_source: z,
            cell_type: w,
            edit_mode: H,
            verbose: $
        } = A,
        O = H === void 0 ? "replace" : H,
        _ = O === "delete" ? "delete" : `${O} cell in`,
        J;
    if (q[0] !== _) J = JP.createElement(V, {
        color: "subtle"
    }, "User rejected ", _, " "), q[0] = _, q[1] = J;
    else J = q[1];
    let X;
    if (q[2] !== K || q[3] !== $) X = $ ? K : LEY(h6(), K), q[2] = K, q[3] = $, q[4] = X;
    else X = q[4];
    let D;
    if (q[5] !== X) D = JP.createElement(V, {
        bold: !0,
        color: "subtle"
    }, X), q[5] = X, q[6] = D;
    else D = q[6];
    let j;
    if (q[7] !== Y) j = JP.createElement(V, {
        color: "subtle"
    }, " at cell ", Y), q[7] = Y, q[8] = j;
    else j = q[8];
    let M;
    if (q[9] !== J || q[10] !== D || q[11] !== j) M = JP.createElement(I, {
        flexDirection: "row"
    }, J, D, j), q[9] = J, q[10] = D, q[11] = j, q[12] = M;
    else M = q[12];
    let P;
    if (q[13] !== w || q[14] !== O || q[15] !== z) P = O !== "delete" && JP.createElement(I, {
        marginTop: 1,
        flexDirection: "column"
    }, JP.createElement(VN, {
        code: z,
        filePath: w === "markdown" ? "file.md" : "file.py",
        dim: !0
    })), q[13] = w, q[14] = O, q[15] = z, q[16] = P;
    else P = q[16];
    let W;
    if (q[17] !== M || q[18] !== P) W = JP.createElement(HA, null, JP.createElement(I, {
        flexDirection: "column"
    }, M, P)), q[17] = M, q[18] = P, q[19] = W;
    else W = q[19];
    return W
}
// @from(Ln 336781, Col 4)
JP
// @from(Ln 336782, Col 4)
aF4 = v(() => {
    i1();
    m1();
    N7();
    eq();
    Z51();
    JP = o(X1(), 1)
})
// @from(Ln 336791, Col 0)
function gkA(A) {
    if (!A?.notebook_path) return null;
    return L3(A.notebook_path)
}
// @from(Ln 336796, Col 0)
function sF4({
    notebook_path: A,
    cell_id: q,
    new_source: K,
    cell_type: Y,
    edit_mode: z
}, {
    verbose: w
}) {
    if (!A || !K || !Y) return null;
    let H = w ? A : L3(A);
    if (w) return V9.createElement(V9.Fragment, null, V9.createElement(AE, {
        filePath: A
    }, H), `@${q}, content: ${K.slice(0,30)}…, cell_type: ${Y}, edit_mode: ${z??"replace"}`);
    return V9.createElement(V9.Fragment, null, V9.createElement(AE, {
        filePath: A
    }, H), `@${q}`)
}
// @from(Ln 336815, Col 0)
function tF4(A, {
    verbose: q
}) {
    return V9.createElement(oF4, {
        notebook_path: A.notebook_path,
        cell_id: A.cell_id,
        new_source: A.new_source,
        cell_type: A.cell_type,
        edit_mode: A.edit_mode,
        verbose: q
    })
}
// @from(Ln 336828, Col 0)
function eF4(A, {
    verbose: q
}) {
    if (!q && typeof A === "string" && C4(A, "tool_use_error")) return V9.createElement(HA, null, V9.createElement(V, {
        color: "error"
    }, "Error editing notebook"));
    return V9.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 336840, Col 0)
function AQ4() {
    return null
}
// @from(Ln 336844, Col 0)
function qQ4({
    cell_id: A,
    new_source: q,
    error: K
}) {
    if (K) return V9.createElement(HA, null, V9.createElement(V, {
        color: "error"
    }, K));
    return V9.createElement(HA, null, V9.createElement(I, {
        flexDirection: "column"
    }, V9.createElement(V, null, "Updated cell ", V9.createElement(V, {
        bold: !0
    }, A), ":"), V9.createElement(I, {
        marginLeft: 2
    }, V9.createElement(VN, {
        code: q,
        filePath: "notebook.py"
    }))))
}
// @from(Ln 336863, Col 4)
V9
// @from(Ln 336864, Col 4)
KQ4 = v(() => {
    m1();
    fW1();
    Z51();
    aF4();
    eq();
    UO();
    N8();
    wq();
    V9 = o(X1(), 1)
})
// @from(Ln 336880, Col 4)
yEY
// @from(Ln 336880, Col 9)
CEY
// @from(Ln 336880, Col 14)
gd
// @from(Ln 336881, Col 4)
tQ1 = v(() => {
    i7();
    FP6();
    wq();
    AH();
    N7();
    E2();
    _8();
    ZN();
    KQ4();
    m6();
    yEY = z7(() => u.strictObject({
        notebook_path: u.string().describe("The absolute path to the Jupyter notebook file to edit (must be absolute, not relative)"),
        cell_id: u.string().optional().describe("The ID of the cell to edit. When inserting a new cell, the new cell will be inserted after the cell with this ID, or at the beginning if not specified."),
        new_source: u.string().describe("The new source for the cell"),
        cell_type: u.enum(["code", "markdown"]).optional().describe("The type of the cell (code or markdown). If not specified, it defaults to the current cell type. If using edit_mode=insert, this is required."),
        edit_mode: u.enum(["replace", "insert", "delete"]).optional().describe("The type of edit to make (replace, insert, delete). Defaults to replace.")
    })), CEY = z7(() => u.object({
        new_source: u.string().describe("The new source code that was written to the cell"),
        cell_id: u.string().optional().describe("The ID of the cell that was edited"),
        cell_type: u.enum(["code", "markdown"]).describe("The type of the cell"),
        language: u.string().describe("The programming language of the notebook"),
        edit_mode: u.string().describe("The edit mode that was used"),
        error: u.string().optional().describe("Error message if the operation failed"),
        notebook_path: u.string().describe("The path to the notebook file"),
        original_file: u.string().describe("The original notebook content before modification"),
        updated_file: u.string().describe("The updated notebook content after modification")
    })), gd = {
        name: jM,
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        async description() {
            return nF4
        },
        async prompt() {
            return rF4
        },
        userFacingName() {
            return "Edit Notebook"
        },
        getToolUseSummary: gkA,
        getActivityDescription(A) {
            let q = gkA(A);
            return q ? `Editing notebook ${q}` : "Editing notebook"
        },
        isEnabled() {
            return !0
        },
        get inputSchema() {
            return yEY()
        },
        get outputSchema() {
            return CEY()
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        getPath(A) {
            return A.notebook_path
        },
        async checkPermissions(A, q) {
            let K = await q.getAppState();
            return N51(gd, A, K.toolPermissionContext)
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
        renderToolUseMessage: sF4,
        renderToolUseRejectedMessage: tF4,
        renderToolUseErrorMessage: eF4,
        renderToolUseProgressMessage: AQ4,
        renderToolResultMessage: qQ4,
        async validateInput({
            notebook_path: A,
            cell_type: q,
            cell_id: K,
            edit_mode: Y = "replace"
        }) {
            let z = YQ4(A) ? A : zQ4(h6(), A);
            if (z.startsWith("\\\\") || z.startsWith("//")) return {
                result: !0
            };
            let w = b1();
            if (!w.existsSync(z)) return {
                result: !1,
                message: "Notebook file does not exist.",
                errorCode: 1
            };
            if (REY(z) !== ".ipynb") return {
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
            let H = AX(z),
                $ = w.readFileSync(z, {
                    encoding: H
                }),
                O = j9($);
            if (!O) return {
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
            } else if (O.cells.findIndex((J) => J.id === K) === -1) {
                let J = sQ1(K);
                if (J !== void 0) {
                    if (!O.cells[J]) return {
                        result: !1,
                        message: `Cell with index ${J} does not exist in notebook.`,
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
            updateFileHistoryState: w
        }, H, $) {
            let O = YQ4(A) ? A : zQ4(h6(), A);
            if (z2()) await Xt(w, O, $.uuid);
            try {
                let _ = AX(O),
                    J = b1().readFileSync(O, {
                        encoding: _
                    }),
                    X = _A(J),
                    D;
                if (!K) D = 0;
                else {
                    if (D = X.cells.findIndex((Z) => Z.id === K), D === -1) {
                        let Z = sQ1(K);
                        if (Z !== void 0) D = Z
                    }
                    if (z === "insert") D += 1
                }
                let j = z;
                if (j === "replace" && D === X.cells.length) {
                    if (j = "insert", !Y) Y = "code"
                }
                let M = X.metadata.language_info?.name ?? "python",
                    P = void 0;
                if (X.nbformat > 4 || X.nbformat === 4 && X.nbformat_minor >= 5) {
                    if (j === "insert") P = Math.random().toString(36).substring(2, 15);
                    else if (K !== null) P = K
                }
                if (j === "delete") X.cells.splice(D, 1);
                else if (j === "insert") {
                    let Z;
                    if (Y === "markdown") Z = {
                        cell_type: "markdown",
                        id: P,
                        source: q,
                        metadata: {}
                    };
                    else Z = {
                        cell_type: "code",
                        id: P,
                        source: q,
                        metadata: {},
                        execution_count: null,
                        outputs: []
                    };
                    X.cells.splice(D, 0, Z)
                } else {
                    let Z = X.cells[D];
                    if (Z.source = q, Z.cell_type === "code") Z.execution_count = null, Z.outputs = [];
                    if (Y && Y !== Z.cell_type) Z.cell_type = Y
                }
                let W = Qd(O),
                    G = Q1(X, null, 1);
                return ft(O, G, _, W), {
                    data: {
                        new_source: q,
                        cell_type: Y ?? "code",
                        language: M,
                        edit_mode: j ?? "replace",
                        cell_id: P || void 0,
                        error: "",
                        notebook_path: O,
                        original_file: J,
                        updated_file: G
                    }
                }
            } catch (_) {
                if (_ instanceof Error) return {
                    data: {
                        new_source: q,
                        cell_type: Y ?? "code",
                        language: "python",
                        edit_mode: "replace",
                        error: _.message,
                        cell_id: K,
                        notebook_path: O,
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
                        notebook_path: O,
                        original_file: "",
                        updated_file: ""
                    }
                }
            }
        }
    }
})
// @from(Ln 337154, Col 4)
kW1 = R((nYH, wQ4) => {
    wQ4.exports = T51;
    T51.CAPTURING_PHASE = 1;
    T51.AT_TARGET = 2;
    T51.BUBBLING_PHASE = 3;

    function T51(A, q) {
        if (this.type = "", this.target = null, this.currentTarget = null, this.eventPhase = T51.AT_TARGET, this.bubbles = !1, this.cancelable = !1, this.isTrusted = !1, this.defaultPrevented = !1, this.timeStamp = Date.now(), this._propagationStopped = !1, this._immediatePropagationStopped = !1, this._initialized = !0, this._dispatching = !1, A) this.type = A;
        if (q)
            for (var K in q) this[K] = q[K]
    }
    T51.prototype = Object.create(Object.prototype, {
        constructor: {
            value: T51
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
// @from(Ln 337192, Col 4)
pkA = R((rYH, $Q4) => {
    var HQ4 = kW1();
    $Q4.exports = UkA;

    function UkA() {
        HQ4.call(this), this.view = null, this.detail = 0
    }
    UkA.prototype = Object.create(HQ4.prototype, {
        constructor: {
            value: UkA
        },
        initUIEvent: {
            value: function(A, q, K, Y, z) {
                this.initEvent(A, q, K), this.view = Y, this.detail = z
            }
        }
    })
})
// @from(Ln 337210, Col 4)
ckA = R((oYH, _Q4) => {
    var OQ4 = pkA();
    _Q4.exports = dkA;

    function dkA() {
        OQ4.call(this), this.screenX = this.screenY = this.clientX = this.clientY = 0, this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = !1, this.button = 0, this.buttons = 1, this.relatedTarget = null
    }
    dkA.prototype = Object.create(OQ4.prototype, {
        constructor: {
            value: dkA
        },
        initMouseEvent: {
            value: function(A, q, K, Y, z, w, H, $, O, _, J, X, D, j, M) {
                switch (this.initEvent(A, q, K, Y, z), this.screenX = w, this.screenY = H, this.clientX = $, this.clientY = O, this.ctrlKey = _, this.altKey = J, this.shiftKey = X, this.metaKey = D, this.button = j, j) {
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
                this.relatedTarget = M
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
// @from(Ln 337258, Col 4)
UP6 = R((aYH, XQ4) => {
    XQ4.exports = gP6;
    var SEY = 1,
        hEY = 3,
        IEY = 4,
        xEY = 5,
        bEY = 7,
        uEY = 8,
        BEY = 9,
        mEY = 11,
        FEY = 12,
        QEY = 13,
        gEY = 14,
        UEY = 15,
        pEY = 17,
        dEY = 18,
        cEY = 19,
        lEY = 20,
        iEY = 21,
        nEY = 22,
        rEY = 23,
        oEY = 24,
        aEY = 25,
        sEY = [null, "INDEX_SIZE_ERR", null, "HIERARCHY_REQUEST_ERR", "WRONG_DOCUMENT_ERR", "INVALID_CHARACTER_ERR", null, "NO_MODIFICATION_ALLOWED_ERR", "NOT_FOUND_ERR", "NOT_SUPPORTED_ERR", "INUSE_ATTRIBUTE_ERR", "INVALID_STATE_ERR", "SYNTAX_ERR", "INVALID_MODIFICATION_ERR", "NAMESPACE_ERR", "INVALID_ACCESS_ERR", null, "TYPE_MISMATCH_ERR", "SECURITY_ERR", "NETWORK_ERR", "ABORT_ERR", "URL_MISMATCH_ERR", "QUOTA_EXCEEDED_ERR", "TIMEOUT_ERR", "INVALID_NODE_TYPE_ERR", "DATA_CLONE_ERR"],
        tEY = [null, "INDEX_SIZE_ERR (1): the index is not in the allowed range", null, "HIERARCHY_REQUEST_ERR (3): the operation would yield an incorrect nodes model", "WRONG_DOCUMENT_ERR (4): the object is in the wrong Document, a call to importNode is required", "INVALID_CHARACTER_ERR (5): the string contains invalid characters", null, "NO_MODIFICATION_ALLOWED_ERR (7): the object can not be modified", "NOT_FOUND_ERR (8): the object can not be found here", "NOT_SUPPORTED_ERR (9): this operation is not supported", "INUSE_ATTRIBUTE_ERR (10): setAttributeNode called on owned Attribute", "INVALID_STATE_ERR (11): the object is in an invalid state", "SYNTAX_ERR (12): the string did not match the expected pattern", "INVALID_MODIFICATION_ERR (13): the object can not be modified in this way", "NAMESPACE_ERR (14): the operation is not allowed by Namespaces in XML", "INVALID_ACCESS_ERR (15): the object does not support the operation or argument", null, "TYPE_MISMATCH_ERR (17): the type of the object does not match the expected type", "SECURITY_ERR (18): the operation is insecure", "NETWORK_ERR (19): a network error occurred", "ABORT_ERR (20): the user aborted an operation", "URL_MISMATCH_ERR (21): the given URL does not match another URL", "QUOTA_EXCEEDED_ERR (22): the quota has been exceeded", "TIMEOUT_ERR (23): a timeout occurred", "INVALID_NODE_TYPE_ERR (24): the supplied node is invalid or has an invalid ancestor for this operation", "DATA_CLONE_ERR (25): the object can not be cloned."],
        JQ4 = {
            INDEX_SIZE_ERR: SEY,
            DOMSTRING_SIZE_ERR: 2,
            HIERARCHY_REQUEST_ERR: hEY,
            WRONG_DOCUMENT_ERR: IEY,
            INVALID_CHARACTER_ERR: xEY,
            NO_DATA_ALLOWED_ERR: 6,
            NO_MODIFICATION_ALLOWED_ERR: bEY,
            NOT_FOUND_ERR: uEY,
            NOT_SUPPORTED_ERR: BEY,
            INUSE_ATTRIBUTE_ERR: 10,
            INVALID_STATE_ERR: mEY,
            SYNTAX_ERR: FEY,
            INVALID_MODIFICATION_ERR: QEY,
            NAMESPACE_ERR: gEY,
            INVALID_ACCESS_ERR: UEY,
            VALIDATION_ERR: 16,
            TYPE_MISMATCH_ERR: pEY,
            SECURITY_ERR: dEY,
            NETWORK_ERR: cEY,
            ABORT_ERR: lEY,
            URL_MISMATCH_ERR: iEY,
            QUOTA_EXCEEDED_ERR: nEY,
            TIMEOUT_ERR: rEY,
            INVALID_NODE_TYPE_ERR: oEY,
            DATA_CLONE_ERR: aEY
        };

    function gP6(A) {
        Error.call(this), Error.captureStackTrace(this, this.constructor), this.code = A, this.message = tEY[A], this.name = sEY[A]
    }
    gP6.prototype.__proto__ = Error.prototype;
    for (eQ1 in JQ4) QP6 = {
        value: JQ4[eQ1]
    }, Object.defineProperty(gP6, eQ1, QP6), Object.defineProperty(gP6.prototype, eQ1, QP6);
    var QP6, eQ1
})
// @from(Ln 337320, Col 4)
pP6 = R((eEY) => {
    eEY.isApiWritable = !globalThis.__domino_frozen__
})
// @from(Ln 337323, Col 4)
F_ = R((KkY) => {
    var m_ = UP6(),
        hJ = m_,
        qkY = pP6().isApiWritable;
    KkY.NAMESPACE = {
        HTML: "http://www.w3.org/1999/xhtml",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/",
        MATHML: "http://www.w3.org/1998/Math/MathML",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink"
    };
    KkY.IndexSizeError = function() {
        throw new m_(hJ.INDEX_SIZE_ERR)
    };
    KkY.HierarchyRequestError = function() {
        throw new m_(hJ.HIERARCHY_REQUEST_ERR)
    };
    KkY.WrongDocumentError = function() {
        throw new m_(hJ.WRONG_DOCUMENT_ERR)
    };
    KkY.InvalidCharacterError = function() {
        throw new m_(hJ.INVALID_CHARACTER_ERR)
    };
    KkY.NoModificationAllowedError = function() {
        throw new m_(hJ.NO_MODIFICATION_ALLOWED_ERR)
    };
    KkY.NotFoundError = function() {
        throw new m_(hJ.NOT_FOUND_ERR)
    };
    KkY.NotSupportedError = function() {
        throw new m_(hJ.NOT_SUPPORTED_ERR)
    };
    KkY.InvalidStateError = function() {
        throw new m_(hJ.INVALID_STATE_ERR)
    };
    KkY.SyntaxError = function() {
        throw new m_(hJ.SYNTAX_ERR)
    };
    KkY.InvalidModificationError = function() {
        throw new m_(hJ.INVALID_MODIFICATION_ERR)
    };
    KkY.NamespaceError = function() {
        throw new m_(hJ.NAMESPACE_ERR)
    };
    KkY.InvalidAccessError = function() {
        throw new m_(hJ.INVALID_ACCESS_ERR)
    };
    KkY.TypeMismatchError = function() {
        throw new m_(hJ.TYPE_MISMATCH_ERR)
    };
    KkY.SecurityError = function() {
        throw new m_(hJ.SECURITY_ERR)
    };
    KkY.NetworkError = function() {
        throw new m_(hJ.NETWORK_ERR)
    };
    KkY.AbortError = function() {
        throw new m_(hJ.ABORT_ERR)
    };
    KkY.UrlMismatchError = function() {
        throw new m_(hJ.URL_MISMATCH_ERR)
    };
    KkY.QuotaExceededError = function() {
        throw new m_(hJ.QUOTA_EXCEEDED_ERR)
    };
    KkY.TimeoutError = function() {
        throw new m_(hJ.TIMEOUT_ERR)
    };
    KkY.InvalidNodeTypeError = function() {
        throw new m_(hJ.INVALID_NODE_TYPE_ERR)
    };
    KkY.DataCloneError = function() {
        throw new m_(hJ.DATA_CLONE_ERR)
    };
    KkY.nyi = function() {
        throw Error("NotYetImplemented")
    };
    KkY.shouldOverride = function() {
        throw Error("Abstract function; should be overriding in subclass.")
    };
    KkY.assert = function(A, q) {
        if (!A) throw Error("Assertion failed: " + (q || "") + `
` + Error().stack)
    };
    KkY.expose = function(A, q) {
        for (var K in A) Object.defineProperty(q.prototype, K, {
            value: A[K],
            writable: qkY
        })
    };
    KkY.merge = function(A, q) {
        for (var K in q) A[K] = q[K]
    };
    KkY.documentOrder = function(A, q) {
        return 3 - (A.compareDocumentPosition(q) & 6)
    };
    KkY.toASCIILowerCase = function(A) {
        return A.replace(/[A-Z]+/g, function(q) {
            return q.toLowerCase()
        })
    };
    KkY.toASCIIUpperCase = function(A) {
        return A.replace(/[a-z]+/g, function(q) {
            return q.toUpperCase()
        })
    }
})