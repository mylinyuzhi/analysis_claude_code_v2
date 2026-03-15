
// @from(Ln 103504, Col 4)
oC6 = E(() => {
    SM();
    SA();
    $91();
    H1();
    kw = class kw {
        taskId;
        path;
        stdoutToFile;
        #A = "";
        #q = "";
        #K = null;
        #z = new nC6(1000);
        #Y = 0;
        #w = 0;
        #_;
        #$;
        #H = !1;
        #j = 0;
        static #O = new Map;
        static #J = new Map;
        static #M = null;
        constructor(A, q, K = !1, Y = y$3) {
            if (this.taskId = A, this.path = g2(A), this.stdoutToFile = K, this.#_ = Y, this.#$ = q, K && q) kw.#O.set(A, this)
        }
        static startPolling(A) {
            let q = kw.#O.get(A);
            if (!q || !q.#$) return;
            if (kw.#J.set(A, q), !kw.#M) kw.#M = setInterval(kw.#W, L$3), kw.#M.unref()
        }
        static stopPolling(A) {
            if (kw.#J.delete(A), kw.#J.size === 0 && kw.#M) clearInterval(kw.#M), kw.#M = null
        }
        static #W() {
            for (let [, A] of kw.#J) {
                if (!A.#$) continue;
                ow6(A.path, R$3).then(({
                    content: q,
                    bytesRead: K,
                    bytesTotal: Y
                }) => {
                    if (!A.#$) return;
                    if (!q) {
                        A.#$("", "", 0, Y, !1);
                        return
                    }
                    let z = q.length,
                        _ = 0,
                        w = 0;
                    for (let $ = 0; $ < 100 && z > 0; $++)
                        if (z = q.lastIndexOf(`
`, z - 1), w++, $ === 4) _ = z <= 0 ? 0 : z + 1;
                    let O = z <= 0 ? 0 : z + 1;
                    A.#w = Y, A.#$(q.slice(_), q.slice(O), w, Y, K < Y)
                }, () => {})
            }
        }
        writeStdout(A) {
            this.#X(A, !1)
        }
        writeStderr(A) {
            this.#X(A, !0)
        }
        #X(A, q) {
            if (this.#w += A.length, this.#G(A), this.#K) {
                this.#K.append(q ? `[stderr] ${A}` : A);
                return
            }
            if (this.#A.length + this.#q.length + A.length > this.#_) {
                this.#P(q ? A : null, q ? null : A);
                return
            }
            if (q) this.#q += A;
            else this.#A += A
        }
        #G(A) {
            let Y = 0,
                z = [],
                _ = 0,
                w = A.length;
            while (w > 0) {
                let O = A.lastIndexOf(`
`, w - 1);
                if (O === -1) break;
                if (Y++, z.length < 100 && _ < 4096) {
                    let $ = w - O - 1;
                    if ($ > 0 && $ <= 4096 - _) {
                        let H = A.slice(O + 1, w);
                        if (H.trim()) z.push(Buffer.from(H).toString()), _ += $
                    }
                }
                w = O
            }
            this.#Y += Y;
            for (let O = z.length - 1; O >= 0; O--) this.#z.add(z[O]);
            if (this.#$ && z.length > 0) {
                let O = this.#z.getRecent(5);
                this.#$(w91(O, `
`), w91(this.#z.getRecent(100), `
`), this.#Y, this.#w, this.#K !== null)
            }
        }
        #P(A, q) {
            if (this.#K = new Y91(this.taskId), this.#A) this.#K.append(this.#A), this.#A = "";
            if (this.#q) this.#K.append(`[stderr] ${this.#q}`), this.#q = "";
            if (q) this.#K.append(q);
            if (A) this.#K.append(`[stderr] ${A}`)
        }
        async getStdout() {
            if (this.stdoutToFile) return this.#Z();
            if (this.#K) {
                let A = this.#z.getRecent(5),
                    q = w91(A, `
`),
                    Y = `
Output truncated (${Math.round(this.#w/1024)}KB total). Full output saved to: ${this.path}`;
                return q ? q + Y : Y.trimStart()
            }
            return this.#A
        }
        async #Z() {
            let A = O91();
            try {
                let q = await dt6(this.path, 0, A);
                if (!q) return this.#H = !0, "";
                let {
                    content: K,
                    bytesRead: Y,
                    bytesTotal: z
                } = q;
                return this.#j = z, this.#H = z <= Y, K
            } catch (q) {
                let K = q instanceof Error && "code" in q ? String(q.code) : "unknown";
                return k(`TaskOutput.#readStdoutFromFile: failed to read ${this.path} (${K}): ${q}`), `<bash output unavailable: output file ${this.path} could not be read (${K}). This usually means another Claude Code process in the same project deleted it during startup cleanup.>`
            }
        }
        getStderr() {
            if (this.#K) return "";
            return this.#q
        }
        get isOverflowed() {
            return this.#K !== null
        }
        get totalLines() {
            return this.#Y
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
            if (!this.#K) this.#P(null, null)
        }
        async flush() {
            await this.#K?.flush()
        }
        async deleteOutputFile() {
            try {
                await E$3(this.path)
            } catch {}
        }
        clear() {
            this.#A = "", this.#q = "", this.#z.clear(), this.#$ = null, this.#K?.cancel(), kw.stopPolling(this.taskId), kw.#O.delete(this.taskId)
        }
    }
})
// @from(Ln 103675, Col 0)
class H38 {
    #A;
    #q = !1;
    #K;
    #z;
    #Y = this.#w.bind(this);
    constructor(A, q, K) {
        this.#A = A, this.#K = q, this.#z = K, A.setEncoding("utf-8"), A.on("data", this.#Y)
    }
    #w(A) {
        let q = typeof A === "string" ? A : A.toString();
        if (this.#z) this.#K.writeStderr(q);
        else this.#K.writeStdout(q)
    }
    cleanup() {
        if (this.#q) return;
        this.#q = !0, this.#A.removeListener("data", this.#Y), this.#A = null, this.#K = null, this.#Y = () => {}
    }
}
// @from(Ln 103694, Col 0)
class j38 {
    #A = "running";
    #q;
    #K;
    #z;
    #Y;
    #w = null;
    #_;
    #$;
    #H;
    #j;
    #O = null;
    #J = null;
    #M = null;
    taskOutput;
    static #W(A) {
        if (A.#j && A.#$) A.#$(A.background.bind(A));
        else A.#k(N97)
    }
    result;
    onTimeout;
    constructor(A, q, K, Y, z = !1) {
        if (this.#Y = A, this.#_ = q, this.#H = K, this.#j = z, this.taskOutput = Y, this.#z = A.stderr ? new H38(A.stderr, Y, !0) : null, this.#K = A.stdout ? new H38(A.stdout, Y, !1) : null, z) this.onTimeout = (_) => {
            this.#$ = _
        };
        this.result = this.#T()
    }
    get status() {
        return this.#A
    }
    #X() {
        if (this.#_.reason === "interrupt") return;
        this.kill()
    }
    #G(A, q) {
        let K = A !== null && A !== void 0 ? A : q === "SIGTERM" ? 144 : 1;
        this.#Z(K)
    }
    #P() {
        this.#Z(1)
    }
    #Z(A) {
        if (this.#J) this.#J(A), this.#J = null
    }
    #f() {
        let A = this.#w;
        if (A) clearTimeout(A), this.#w = null;
        let q = this.#M;
        if (q) this.#_.removeEventListener("abort", q), this.#M = null
    }
    #T() {
        this.#M = this.#X.bind(this), this.#_.addEventListener("abort", this.#M, {
            once: !0
        }), this.#Y.once("exit", this.#G.bind(this)), this.#Y.once("error", this.#P.bind(this)), this.#w = setTimeout(j38.#W, this.#H, this);
        let A = new Promise((q) => {
            this.#J = q
        });
        return new Promise((q) => {
            this.#O = q, A.then(this.#N.bind(this))
        })
    }
    async #N(A) {
        if (this.#f(), this.#A === "running" || this.#A === "backgrounded") this.#A = "completed";
        let q = await this.taskOutput.getStdout(),
            K = {
                code: A,
                stdout: q,
                stderr: this.taskOutput.getStderr(),
                interrupted: A === v97,
                backgroundTaskId: this.#q
            };
        if (this.taskOutput.stdoutToFile && !this.#q)
            if (this.taskOutput.outputFileRedundant) this.taskOutput.deleteOutputFile();
            else K.outputFilePath = this.taskOutput.path, K.outputFileSize = this.taskOutput.outputFileSize, K.outputTaskId = this.taskOutput.taskId;
        if (A === N97) K.stderr = [`Command timed out after ${UK(this.#H)}`, K.stderr].filter(Boolean).join(" ");
        let Y = this.#O;
        if (Y) this.#O = null, Y(K)
    }
    #k(A) {
        if (this.#A = "killed", this.#Y.pid) V97.default(this.#Y.pid, "SIGKILL");
        this.#Z(A ?? v97)
    }
    kill() {
        this.#k()
    }
    background(A) {
        if (this.#A === "running") {
            if (this.#q = A, this.#A = "backgrounded", this.#f(), !this.taskOutput.stdoutToFile) this.taskOutput.spillToDisk();
            return !0
        }
        return !1
    }
    cleanup() {
        this.#K?.cleanup(), this.#z?.cleanup(), this.taskOutput.clear(), this.#f(), this.#Y = null, this.#_ = null, this.#$ = void 0
    }
}
// @from(Ln 103791, Col 0)
function H91(A, q, K, Y, z = !1) {
    return new j38(A, q, K, Y, z)
}
// @from(Ln 103794, Col 0)
class k97 {
    status = "killed";
    result;
    taskOutput;
    constructor(A) {
        this.taskOutput = new kw(oV("local_bash"), null), this.result = Promise.resolve({
            code: A?.code ?? 145,
            stdout: "",
            stderr: A?.stderr ?? "Command aborted before execution",
            interrupted: !0,
            backgroundTaskId: A?.backgroundTaskId
        })
    }
    background() {
        return !1
    }
    kill() {}
    cleanup() {}
}
// @from(Ln 103814, Col 0)
function J38(A, q) {
    return new k97({
        backgroundTaskId: A,
        ...q
    })
}
// @from(Ln 103821, Col 0)
function E97(A) {
    let q = new kw(oV("local_bash"), null);
    return {
        status: "completed",
        result: Promise.resolve({
            code: 1,
            stdout: "",
            stderr: A,
            interrupted: !1,
            preSpawnError: A
        }),
        taskOutput: q,
        background() {
            return !1
        },
        kill() {},
        cleanup() {}
    }
}
// @from(Ln 103840, Col 4)
V97
// @from(Ln 103840, Col 9)
v97 = 137
// @from(Ln 103841, Col 4)
N97 = 143
// @from(Ln 103842, Col 4)
M38 = E(() => {
    M4();
    qL();
    oC6();
    V97 = t(j97(), 1)
})
// @from(Ln 103848, Col 4)
L97 = x((yZ_, y97) => {
    y97.exports = function(q) {
        return q.map(function(K) {
            if (K === "") return "''";
            if (K && typeof K === "object") return K.op.replace(/(.)/g, "\\$1");
            if (/["\s\\]/.test(K) && !/'/.test(K)) return "'" + K.replace(/(['])/g, "\\$1") + "'";
            if (/["'\s]/.test(K)) return '"' + K.replace(/(["\\$`!])/g, "\\$1") + '"';
            return String(K).replace(/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g, "$1\\$2")
        }).join(" ")
    }
})
// @from(Ln 103859, Col 4)
x97 = x((LZ_, b97) => {
    var I97 = "(?:" + ["\\|\\|", "\\&\\&", ";;", "\\|\\&", "\\<\\(", "\\<\\<\\<", ">>", ">\\&", "<\\&", "[&;()|<>]"].join("|") + ")",
        R97 = new RegExp("^" + I97 + "$"),
        h97 = "|&;()<> \\t",
        h$3 = '"((\\\\"|[^"])*?)"',
        S$3 = "'((\\\\'|[^'])*?)'",
        C$3 = /^#$/,
        S97 = "'",
        C97 = '"',
        D38 = "$",
        d46 = "",
        I$3 = 4294967296;
    for (j91 = 0; j91 < 4; j91++) d46 += (I$3 * Math.random()).toString(16);
    var j91, b$3 = new RegExp("^" + d46);

    function x$3(A, q) {
        var K = q.lastIndex,
            Y = [],
            z;
        while (z = q.exec(A))
            if (Y.push(z), q.lastIndex === z.index) q.lastIndex += 1;
        return q.lastIndex = K, Y
    }

    function u$3(A, q, K) {
        var Y = typeof A === "function" ? A(K) : A[K];
        if (typeof Y > "u" && K != "") Y = "";
        else if (typeof Y > "u") Y = "$";
        if (typeof Y === "object") return q + d46 + JSON.stringify(Y) + d46;
        return q + Y
    }

    function m$3(A, q, K) {
        if (!K) K = {};
        var Y = K.escape || "\\",
            z = "(\\" + Y + `['"` + h97 + `]|[^\\s'"` + h97 + "])+",
            _ = new RegExp(["(" + I97 + ")", "(" + z + "|" + h$3 + "|" + S$3 + ")+"].join("|"), "g"),
            w = x$3(A, _);
        if (w.length === 0) return [];
        if (!q) q = {};
        var O = !1;
        return w.map(function($) {
            var H = $[0];
            if (!H || O) return;
            if (R97.test(H)) return {
                op: H
            };
            var j = !1,
                J = !1,
                M = "",
                D = !1,
                X;

            function P() {
                X += 1;
                var G, f, v = H.charAt(X);
                if (v === "{") {
                    if (X += 1, H.charAt(X) === "}") throw Error("Bad substitution: " + H.slice(X - 2, X + 1));
                    if (G = H.indexOf("}", X), G < 0) throw Error("Bad substitution: " + H.slice(X));
                    f = H.slice(X, G), X = G
                } else if (/[*@#?$!_-]/.test(v)) f = v, X += 1;
                else {
                    var N = H.slice(X);
                    if (G = N.match(/[^\w\d_]/), !G) f = N, X = H.length;
                    else f = N.slice(0, G.index), X += G.index - 1
                }
                return u$3(q, "", f)
            }
            for (X = 0; X < H.length; X++) {
                var W = H.charAt(X);
                if (D = D || !j && (W === "*" || W === "?"), J) M += W, J = !1;
                else if (j)
                    if (W === j) j = !1;
                    else if (j == S97) M += W;
                else if (W === Y)
                    if (X += 1, W = H.charAt(X), W === C97 || W === Y || W === D38) M += W;
                    else M += Y + W;
                else if (W === D38) M += P();
                else M += W;
                else if (W === C97 || W === S97) j = W;
                else if (R97.test(W)) return {
                    op: H
                };
                else if (C$3.test(W)) {
                    O = !0;
                    var Z = {
                        comment: A.slice($.index + X + 1)
                    };
                    if (M.length) return [M, Z];
                    return [Z]
                } else if (W === Y) J = !0;
                else if (W === D38) M += P();
                else M += W
            }
            if (D) return {
                op: "glob",
                pattern: M
            };
            return M
        }).reduce(function($, H) {
            return typeof H > "u" ? $ : $.concat(H)
        }, [])
    }
    b97.exports = function(q, K, Y) {
        var z = m$3(q, K, Y);
        if (typeof K !== "function") return z;
        return z.reduce(function(_, w) {
            if (typeof w === "object") return _.concat(w);
            var O = w.split(RegExp("(" + d46 + ".*?" + d46 + ")", "g"));
            if (O.length === 1) return _.concat(O[0]);
            return _.concat(O.filter(Boolean).map(function($) {
                if (b$3.test($)) return JSON.parse($.split(d46)[1]);
                return $
            }))
        }, [])
    }
})
// @from(Ln 103976, Col 4)
J91 = x((B$3) => {
    B$3.quote = L97();
    B$3.parse = x97()
})
// @from(Ln 103981, Col 0)
function Fz(A, q) {
    try {
        return {
            success: !0,
            tokens: typeof q === "function" ? hJ6.parse(A, q) : hJ6.parse(A, q)
        }
    } catch (K) {
        if (K instanceof Error) _6(K);
        return {
            success: !1,
            error: K instanceof Error ? K.message : "Unknown parse error"
        }
    }
}
// @from(Ln 103996, Col 0)
function p$3(A) {
    try {
        let q = A.map((Y, z) => {
            if (Y === null || Y === void 0) return String(Y);
            let _ = typeof Y;
            if (_ === "string") return Y;
            if (_ === "number" || _ === "boolean") return String(Y);
            if (_ === "object") throw Error(`Cannot quote argument at index ${z}: object values are not supported`);
            if (_ === "symbol") throw Error(`Cannot quote argument at index ${z}: symbol values are not supported`);
            if (_ === "function") throw Error(`Cannot quote argument at index ${z}: function values are not supported`);
            throw Error(`Cannot quote argument at index ${z}: unsupported type ${_}`)
        });
        return {
            success: !0,
            quoted: hJ6.quote(q)
        }
    } catch (q) {
        if (q instanceof Error) _6(q);
        return {
            success: !1,
            error: q instanceof Error ? q.message : "Unknown quote error"
        }
    }
}
// @from(Ln 104021, Col 0)
function X38(A) {
    let q = !1,
        K = !1;
    for (let Y = 0; Y < A.length; Y++) {
        let z = A[Y];
        if (z === "\\" && !q) {
            Y++;
            continue
        }
        if (z === '"' && !q) {
            K = !K;
            continue
        }
        if (z === "'" && !K) {
            if (q = !q, !q) {
                let _ = 0,
                    w = Y - 1;
                while (w >= 0 && A[w] === "\\") _++, w--;
                if (_ > 0 && _ % 2 === 1) return !0;
                if (_ > 0 && _ % 2 === 0 && A.indexOf("'", Y + 1) !== -1) return !0
            }
            continue
        }
    }
    return !1
}
// @from(Ln 104048, Col 0)
function j4(A) {
    let q = p$3([...A]);
    if (q.success) return q.quoted;
    try {
        let K = A.map((Y) => {
            if (Y === null || Y === void 0) return String(Y);
            let z = typeof Y;
            if (z === "string" || z === "number" || z === "boolean") return String(Y);
            return B6(Y)
        });
        return hJ6.quote(K)
    } catch (K) {
        if (K instanceof Error) _6(K);
        throw Error("Failed to quote shell arguments safely")
    }
}
// @from(Ln 104064, Col 4)
hJ6
// @from(Ln 104065, Col 4)
RJ = E(() => {
    k1();
    g1();
    hJ6 = t(J91(), 1)
})
// @from(Ln 104071, Col 0)
function M91(A, q) {
    let K = A.lastIndexOf(" -");
    if (K > 0) {
        let Y = A.substring(0, K),
            z = A.substring(K + 1);
        return `${j4([Y])} ${z} ${j4([q])}`
    } else return `${j4([A])} ${j4([q])}`
}
// @from(Ln 104079, Col 4)
P38 = E(() => {
    RJ()
})
// @from(Ln 104090, Col 0)
async function m97() {
    let A = W38(c8(), "session-env", R1());
    return await Q$3(A, {
        recursive: !0
    }), A
}
// @from(Ln 104096, Col 0)
async function B97(A, q) {
    let K = A.toLowerCase();
    return W38(await m97(), `${K}-hook-${q}.sh`)
}
// @from(Ln 104101, Col 0)
function g97() {
    k("Invalidating session environment cache"), bo = void 0
}
// @from(Ln 104104, Col 0)
async function F97() {
    if (y8() === "windows") return k("Session environment not yet supported on Windows"), null;
    if (bo !== void 0) return bo;
    let A = [],
        q = process.env.CLAUDE_ENV_FILE;
    if (q) try {
        let Y = (await u97(q, "utf8")).trim();
        if (Y) A.push(Y), k(`Session environment loaded from CLAUDE_ENV_FILE: ${q} (${Y.length} chars)`)
    } catch (Y) {
        if (Y.code !== "ENOENT") k(`Failed to read CLAUDE_ENV_FILE: ${_1(Y)}`)
    }
    let K = await m97();
    try {
        let z = (await U$3(K)).filter((_) => _.match(/^(setup|sessionstart)-hook-\d+\.sh$/)).sort((_, w) => {
            let O = _.match(/^(setup|sessionstart)-hook-(\d+)\.sh$/),
                $ = w.match(/^(setup|sessionstart)-hook-(\d+)\.sh$/),
                H = O?.[1] || "",
                j = $?.[1] || "";
            if (H !== j) return H === "setup" ? -1 : 1;
            let J = parseInt(O?.[2] || "0", 10),
                M = parseInt($?.[2] || "0", 10);
            return J - M
        });
        for (let _ of z) {
            let w = W38(K, _);
            try {
                let O = (await u97(w, "utf8")).trim();
                if (O) A.push(O)
            } catch (O) {
                if (O.code !== "ENOENT") k(`Failed to read hook file ${w}: ${_1(O)}`)
            }
        }
        if (z.length > 0) k(`Session environment loaded from ${z.length} hook file(s)`)
    } catch (Y) {
        if (Y.code !== "ENOENT") k(`Failed to load session environment from hooks: ${_1(Y)}`)
    }
    if (A.length === 0) return k("No session environment scripts found"), bo = null, bo;
    return bo = A.join(`
`), k(`Session environment script ready (${bo.length} chars total)`), bo
}
// @from(Ln 104144, Col 4)
bo = void 0
// @from(Ln 104145, Col 4)
D91 = E(() => {
    H1();
    YK();
    A8();
    T1();
    s8()
})
// @from(Ln 104152, Col 4)
X91 = (A) => A.name === "up" || A.name === "k" || A.ctrl && A.name === "p"
// @from(Ln 104153, Col 4)
Z38 = (A) => A.name === "down" || A.name === "j" || A.ctrl && A.name === "n"
// @from(Ln 104154, Col 4)
P91 = (A) => A.name === "backspace"
// @from(Ln 104155, Col 4)
p97 = (A) => "123456789".includes(A.name)
// @from(Ln 104156, Col 4)
SJ6 = (A) => A.name === "enter" || A.name === "return"
// @from(Ln 104157, Col 4)
G38
// @from(Ln 104157, Col 9)
f38
// @from(Ln 104157, Col 14)
T38
// @from(Ln 104157, Col 19)
v38
// @from(Ln 104157, Col 24)
aC6
// @from(Ln 104158, Col 4)
W91 = E(() => {
    G38 = class G38 extends Error {
        name = "AbortPromptError";
        message = "Prompt was aborted";
        constructor(A) {
            super();
            this.cause = A?.cause
        }
    };
    f38 = class f38 extends Error {
        name = "CancelPromptError";
        message = "Prompt was canceled"
    };
    T38 = class T38 extends Error {
        name = "ExitPromptError"
    };
    v38 = class v38 extends Error {
        name = "HookError"
    };
    aC6 = class aC6 extends Error {
        name = "ValidationError"
    }
})
// @from(Ln 104186, Col 0)
function l$3(A) {
    return {
        rl: A,
        hooks: [],
        hooksCleanup: [],
        hooksEffect: [],
        index: 0,
        handleChange() {}
    }
}
// @from(Ln 104197, Col 0)
function U97(A, q) {
    let K = l$3(A);
    return Q97.run(K, () => {
        function Y(z) {
            K.handleChange = () => {
                K.index = 0, z()
            }, K.handleChange()
        }
        return q(Y)
    })
}
// @from(Ln 104209, Col 0)
function c46() {
    let A = Q97.getStore();
    if (!A) throw new v38("[Inquirer] Hook functions can only be called from within a prompt");
    return A
}
// @from(Ln 104215, Col 0)
function N38() {
    return c46().rl
}
// @from(Ln 104219, Col 0)
function V38(A) {
    let q = (...K) => {
        let Y = c46(),
            z = !1,
            _ = Y.handleChange;
        Y.handleChange = () => {
            z = !0
        };
        let w = A(...K);
        if (z) _();
        return Y.handleChange = _, w
    };
    return c$3.bind(q)
}
// @from(Ln 104234, Col 0)
function CJ6(A) {
    let q = c46(),
        {
            index: K
        } = q,
        Y = {
            get() {
                return q.hooks[K]
            },
            set(_) {
                q.hooks[K] = _
            },
            initialized: K in q.hooks
        },
        z = A(Y);
    return q.index++, z
}
// @from(Ln 104252, Col 0)
function d97() {
    c46().handleChange()
}
// @from(Ln 104255, Col 4)
Q97
// @from(Ln 104255, Col 9)
l46
// @from(Ln 104256, Col 4)
i46 = E(() => {
    W91();
    Q97 = new d$3;
    l46 = {
        queue(A) {
            let q = c46(),
                {
                    index: K
                } = q;
            q.hooksEffect.push(() => {
                q.hooksCleanup[K]?.();
                let Y = A(N38());
                if (Y != null && typeof Y !== "function") throw new aC6("useEffect return value must be a cleanup function or nothing.");
                q.hooksCleanup[K] = Y
            })
        },
        run() {
            let A = c46();
            V38(() => {
                A.hooksEffect.forEach((q) => {
                    q()
                }), A.hooksEffect.length = 0
            })()
        },
        clearAll() {
            let A = c46();
            A.hooksCleanup.forEach((q) => {
                q?.()
            }), A.hooksEffect.length = 0, A.hooksCleanup.length = 0
        }
    }
})
// @from(Ln 104289, Col 0)
function CP(A) {
    return CJ6((q) => {
        let K = (z) => {
            if (q.get() !== z) q.set(z), d97()
        };
        if (q.initialized) return [q.get(), K];
        let Y = typeof A === "function" ? A() : A;
        return q.set(Y), [Y, K]
    })
}
// @from(Ln 104299, Col 4)
Z91 = E(() => {
    i46()
})
// @from(Ln 104303, Col 0)
function n46(A, q) {
    CJ6((K) => {
        let Y = K.get();
        if (!Array.isArray(Y) || q.some((_, w) => !Object.is(_, Y[w]))) l46.queue(A);
        K.set(q)
    })
}
// @from(Ln 104310, Col 4)
G91 = E(() => {
    i46()
})
// @from(Ln 104313, Col 4)
f91 = x((sZ_, c97) => {
    var i$3 = x6("node:tty"),
        n$3 = i$3?.WriteStream?.prototype?.hasColors?.() ?? !1,
        P3 = (A, q) => {
            if (!n$3) return (z) => z;
            let K = `\x1B[${A}m`,
                Y = `\x1B[${q}m`;
            return (z) => {
                let _ = z + "",
                    w = _.indexOf(Y);
                if (w === -1) return K + _ + Y;
                let O = K,
                    $ = 0;
                while (w !== -1) O += _.slice($, w) + K, $ = w + Y.length, w = _.indexOf(Y, $);
                return O += _.slice($) + Y, O
            }
        },
        K3 = {};
    K3.reset = P3(0, 0);
    K3.bold = P3(1, 22);
    K3.dim = P3(2, 22);
    K3.italic = P3(3, 23);
    K3.underline = P3(4, 24);
    K3.overline = P3(53, 55);
    K3.inverse = P3(7, 27);
    K3.hidden = P3(8, 28);
    K3.strikethrough = P3(9, 29);
    K3.black = P3(30, 39);
    K3.red = P3(31, 39);
    K3.green = P3(32, 39);
    K3.yellow = P3(33, 39);
    K3.blue = P3(34, 39);
    K3.magenta = P3(35, 39);
    K3.cyan = P3(36, 39);
    K3.white = P3(37, 39);
    K3.gray = P3(90, 39);
    K3.bgBlack = P3(40, 49);
    K3.bgRed = P3(41, 49);
    K3.bgGreen = P3(42, 49);
    K3.bgYellow = P3(43, 49);
    K3.bgBlue = P3(44, 49);
    K3.bgMagenta = P3(45, 49);
    K3.bgCyan = P3(46, 49);
    K3.bgWhite = P3(47, 49);
    K3.bgGray = P3(100, 49);
    K3.redBright = P3(91, 39);
    K3.greenBright = P3(92, 39);
    K3.yellowBright = P3(93, 39);
    K3.blueBright = P3(94, 39);
    K3.magentaBright = P3(95, 39);
    K3.cyanBright = P3(96, 39);
    K3.whiteBright = P3(97, 39);
    K3.bgRedBright = P3(101, 49);
    K3.bgGreenBright = P3(102, 49);
    K3.bgYellowBright = P3(103, 49);
    K3.bgBlueBright = P3(104, 49);
    K3.bgMagentaBright = P3(105, 49);
    K3.bgCyanBright = P3(106, 49);
    K3.bgWhiteBright = P3(107, 49);
    c97.exports = K3
})
// @from(Ln 104376, Col 0)
function r$3() {
    if (Qu.platform !== "win32") return Qu.env.TERM !== "linux";
    return Boolean(Qu.env.WT_SESSION) || Boolean(Qu.env.TERMINUS_SUBLIME) || Qu.env.ConEmuTask === "{cmd::Cmder}" || Qu.env.TERM_PROGRAM === "Terminus-Sublime" || Qu.env.TERM_PROGRAM === "vscode" || Qu.env.TERM === "xterm-256color" || Qu.env.TERM === "alacritty" || Qu.env.TERMINAL_EMULATOR === "JetBrains-JediTerm"
}
// @from(Ln 104380, Col 4)
l97
// @from(Ln 104380, Col 9)
i97
// @from(Ln 104380, Col 14)
o$3
// @from(Ln 104380, Col 19)
a$3
// @from(Ln 104380, Col 24)
s$3
// @from(Ln 104380, Col 29)
t$3
// @from(Ln 104380, Col 34)
e$3
// @from(Ln 104380, Col 39)
IJ6
// @from(Ln 104380, Col 44)
eZ_
// @from(Ln 104381, Col 4)
T91 = E(() => {
    l97 = {
        circleQuestionMark: "(?)",
        questionMarkPrefix: "(?)",
        square: "█",
        squareDarkShade: "▓",
        squareMediumShade: "▒",
        squareLightShade: "░",
        squareTop: "▀",
        squareBottom: "▄",
        squareLeft: "▌",
        squareRight: "▐",
        squareCenter: "■",
        bullet: "●",
        dot: "․",
        ellipsis: "…",
        pointerSmall: "›",
        triangleUp: "▲",
        triangleUpSmall: "▴",
        triangleDown: "▼",
        triangleDownSmall: "▾",
        triangleLeftSmall: "◂",
        triangleRightSmall: "▸",
        home: "⌂",
        heart: "♥",
        musicNote: "♪",
        musicNoteBeamed: "♫",
        arrowUp: "↑",
        arrowDown: "↓",
        arrowLeft: "←",
        arrowRight: "→",
        arrowLeftRight: "↔",
        arrowUpDown: "↕",
        almostEqual: "≈",
        notEqual: "≠",
        lessOrEqual: "≤",
        greaterOrEqual: "≥",
        identical: "≡",
        infinity: "∞",
        subscriptZero: "₀",
        subscriptOne: "₁",
        subscriptTwo: "₂",
        subscriptThree: "₃",
        subscriptFour: "₄",
        subscriptFive: "₅",
        subscriptSix: "₆",
        subscriptSeven: "₇",
        subscriptEight: "₈",
        subscriptNine: "₉",
        oneHalf: "½",
        oneThird: "⅓",
        oneQuarter: "¼",
        oneFifth: "⅕",
        oneSixth: "⅙",
        oneEighth: "⅛",
        twoThirds: "⅔",
        twoFifths: "⅖",
        threeQuarters: "¾",
        threeFifths: "⅗",
        threeEighths: "⅜",
        fourFifths: "⅘",
        fiveSixths: "⅚",
        fiveEighths: "⅝",
        sevenEighths: "⅞",
        line: "─",
        lineBold: "━",
        lineDouble: "═",
        lineDashed0: "┄",
        lineDashed1: "┅",
        lineDashed2: "┈",
        lineDashed3: "┉",
        lineDashed4: "╌",
        lineDashed5: "╍",
        lineDashed6: "╴",
        lineDashed7: "╶",
        lineDashed8: "╸",
        lineDashed9: "╺",
        lineDashed10: "╼",
        lineDashed11: "╾",
        lineDashed12: "−",
        lineDashed13: "–",
        lineDashed14: "‐",
        lineDashed15: "⁃",
        lineVertical: "│",
        lineVerticalBold: "┃",
        lineVerticalDouble: "║",
        lineVerticalDashed0: "┆",
        lineVerticalDashed1: "┇",
        lineVerticalDashed2: "┊",
        lineVerticalDashed3: "┋",
        lineVerticalDashed4: "╎",
        lineVerticalDashed5: "╏",
        lineVerticalDashed6: "╵",
        lineVerticalDashed7: "╷",
        lineVerticalDashed8: "╹",
        lineVerticalDashed9: "╻",
        lineVerticalDashed10: "╽",
        lineVerticalDashed11: "╿",
        lineDownLeft: "┐",
        lineDownLeftArc: "╮",
        lineDownBoldLeftBold: "┓",
        lineDownBoldLeft: "┒",
        lineDownLeftBold: "┑",
        lineDownDoubleLeftDouble: "╗",
        lineDownDoubleLeft: "╖",
        lineDownLeftDouble: "╕",
        lineDownRight: "┌",
        lineDownRightArc: "╭",
        lineDownBoldRightBold: "┏",
        lineDownBoldRight: "┎",
        lineDownRightBold: "┍",
        lineDownDoubleRightDouble: "╔",
        lineDownDoubleRight: "╓",
        lineDownRightDouble: "╒",
        lineUpLeft: "┘",
        lineUpLeftArc: "╯",
        lineUpBoldLeftBold: "┛",
        lineUpBoldLeft: "┚",
        lineUpLeftBold: "┙",
        lineUpDoubleLeftDouble: "╝",
        lineUpDoubleLeft: "╜",
        lineUpLeftDouble: "╛",
        lineUpRight: "└",
        lineUpRightArc: "╰",
        lineUpBoldRightBold: "┗",
        lineUpBoldRight: "┖",
        lineUpRightBold: "┕",
        lineUpDoubleRightDouble: "╚",
        lineUpDoubleRight: "╙",
        lineUpRightDouble: "╘",
        lineUpDownLeft: "┤",
        lineUpBoldDownBoldLeftBold: "┫",
        lineUpBoldDownBoldLeft: "┨",
        lineUpDownLeftBold: "┥",
        lineUpBoldDownLeftBold: "┩",
        lineUpDownBoldLeftBold: "┪",
        lineUpDownBoldLeft: "┧",
        lineUpBoldDownLeft: "┦",
        lineUpDoubleDownDoubleLeftDouble: "╣",
        lineUpDoubleDownDoubleLeft: "╢",
        lineUpDownLeftDouble: "╡",
        lineUpDownRight: "├",
        lineUpBoldDownBoldRightBold: "┣",
        lineUpBoldDownBoldRight: "┠",
        lineUpDownRightBold: "┝",
        lineUpBoldDownRightBold: "┡",
        lineUpDownBoldRightBold: "┢",
        lineUpDownBoldRight: "┟",
        lineUpBoldDownRight: "┞",
        lineUpDoubleDownDoubleRightDouble: "╠",
        lineUpDoubleDownDoubleRight: "╟",
        lineUpDownRightDouble: "╞",
        lineDownLeftRight: "┬",
        lineDownBoldLeftBoldRightBold: "┳",
        lineDownLeftBoldRightBold: "┯",
        lineDownBoldLeftRight: "┰",
        lineDownBoldLeftBoldRight: "┱",
        lineDownBoldLeftRightBold: "┲",
        lineDownLeftRightBold: "┮",
        lineDownLeftBoldRight: "┭",
        lineDownDoubleLeftDoubleRightDouble: "╦",
        lineDownDoubleLeftRight: "╥",
        lineDownLeftDoubleRightDouble: "╤",
        lineUpLeftRight: "┴",
        lineUpBoldLeftBoldRightBold: "┻",
        lineUpLeftBoldRightBold: "┷",
        lineUpBoldLeftRight: "┸",
        lineUpBoldLeftBoldRight: "┹",
        lineUpBoldLeftRightBold: "┺",
        lineUpLeftRightBold: "┶",
        lineUpLeftBoldRight: "┵",
        lineUpDoubleLeftDoubleRightDouble: "╩",
        lineUpDoubleLeftRight: "╨",
        lineUpLeftDoubleRightDouble: "╧",
        lineUpDownLeftRight: "┼",
        lineUpBoldDownBoldLeftBoldRightBold: "╋",
        lineUpDownBoldLeftBoldRightBold: "╈",
        lineUpBoldDownLeftBoldRightBold: "╇",
        lineUpBoldDownBoldLeftRightBold: "╊",
        lineUpBoldDownBoldLeftBoldRight: "╉",
        lineUpBoldDownLeftRight: "╀",
        lineUpDownBoldLeftRight: "╁",
        lineUpDownLeftBoldRight: "┽",
        lineUpDownLeftRightBold: "┾",
        lineUpBoldDownBoldLeftRight: "╂",
        lineUpDownLeftBoldRightBold: "┿",
        lineUpBoldDownLeftBoldRight: "╃",
        lineUpBoldDownLeftRightBold: "╄",
        lineUpDownBoldLeftBoldRight: "╅",
        lineUpDownBoldLeftRightBold: "╆",
        lineUpDoubleDownDoubleLeftDoubleRightDouble: "╬",
        lineUpDoubleDownDoubleLeftRight: "╫",
        lineUpDownLeftDoubleRightDouble: "╪",
        lineCross: "╳",
        lineBackslash: "╲",
        lineSlash: "╱"
    }, i97 = {
        tick: "✔",
        info: "ℹ",
        warning: "⚠",
        cross: "✘",
        squareSmall: "◻",
        squareSmallFilled: "◼",
        circle: "◯",
        circleFilled: "◉",
        circleDotted: "◌",
        circleDouble: "◎",
        circleCircle: "ⓞ",
        circleCross: "ⓧ",
        circlePipe: "Ⓘ",
        radioOn: "◉",
        radioOff: "◯",
        checkboxOn: "☒",
        checkboxOff: "☐",
        checkboxCircleOn: "ⓧ",
        checkboxCircleOff: "Ⓘ",
        pointer: "❯",
        triangleUpOutline: "△",
        triangleLeft: "◀",
        triangleRight: "▶",
        lozenge: "◆",
        lozengeOutline: "◇",
        hamburger: "☰",
        smiley: "㋡",
        mustache: "෴",
        star: "★",
        play: "▶",
        nodejs: "⬢",
        oneSeventh: "⅐",
        oneNinth: "⅑",
        oneTenth: "⅒"
    }, o$3 = {
        tick: "√",
        info: "i",
        warning: "‼",
        cross: "×",
        squareSmall: "□",
        squareSmallFilled: "■",
        circle: "( )",
        circleFilled: "(*)",
        circleDotted: "( )",
        circleDouble: "( )",
        circleCircle: "(○)",
        circleCross: "(×)",
        circlePipe: "(│)",
        radioOn: "(*)",
        radioOff: "( )",
        checkboxOn: "[×]",
        checkboxOff: "[ ]",
        checkboxCircleOn: "(×)",
        checkboxCircleOff: "( )",
        pointer: ">",
        triangleUpOutline: "∆",
        triangleLeft: "◄",
        triangleRight: "►",
        lozenge: "♦",
        lozengeOutline: "◊",
        hamburger: "≡",
        smiley: "☺",
        mustache: "┌─┐",
        star: "✶",
        play: "►",
        nodejs: "♦",
        oneSeventh: "1/7",
        oneNinth: "1/9",
        oneTenth: "1/10"
    }, a$3 = {
        ...l97,
        ...i97
    }, s$3 = {
        ...l97,
        ...o$3
    }, t$3 = r$3(), e$3 = t$3 ? a$3 : s$3, IJ6 = e$3, eZ_ = Object.entries(i97)
})
// @from(Ln 104655, Col 4)
KL
// @from(Ln 104655, Col 8)
n97
// @from(Ln 104656, Col 4)
r97 = E(() => {
    T91();
    KL = t(f91(), 1), n97 = {
        prefix: {
            idle: KL.default.blue("?"),
            done: KL.default.green(IJ6.tick)
        },
        spinner: {
            interval: 80,
            frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((A) => KL.default.yellow(A))
        },
        style: {
            answer: KL.default.cyan,
            message: KL.default.bold,
            error: (A) => KL.default.red(`> ${A}`),
            defaultAnswer: (A) => KL.default.dim(`(${A})`),
            help: KL.default.dim,
            highlight: KL.default.cyan,
            key: (A) => KL.default.cyan(KL.default.bold(`<${A}>`))
        }
    }
})
// @from(Ln 104679, Col 0)
function o97(A) {
    if (typeof A !== "object" || A === null) return !1;
    let q = A;
    while (Object.getPrototypeOf(q) !== null) q = Object.getPrototypeOf(q);
    return Object.getPrototypeOf(A) === q
}
// @from(Ln 104686, Col 0)
function a97(...A) {
    let q = {};
    for (let K of A)
        for (let [Y, z] of Object.entries(K)) {
            let _ = q[Y];
            q[Y] = o97(_) && o97(z) ? a97(_, z) : z
        }
    return q
}
// @from(Ln 104696, Col 0)
function iQ(...A) {
    let q = [n97, ...A.filter((K) => K != null)];
    return a97(...q)
}
// @from(Ln 104700, Col 4)
k38 = E(() => {
    r97()
})
// @from(Ln 104707, Col 0)
function r46({
    status: A = "idle",
    theme: q
}) {
    let [K, Y] = CP(!1), [z, _] = CP(0), {
        prefix: w,
        spinner: O
    } = iQ(q);
    if (n46(() => {
            if (A === "loading") {
                let H, j = -1,
                    J = setTimeout(s97.bind(() => {
                        Y(!0), H = setInterval(s97.bind(() => {
                            j = j + 1, _(j % O.frames.length)
                        }), O.interval)
                    }), 300);
                return () => {
                    clearTimeout(J), clearInterval(H)
                }
            } else Y(!1)
        }, [A]), K) return O.frames[z];
    return typeof w === "string" ? w : w[A === "loading" ? "idle" : A]
}
// @from(Ln 104730, Col 4)
t97 = E(() => {
    Z91();
    G91();
    k38()
})
// @from(Ln 104736, Col 0)
function sC6(A, q) {
    return CJ6((K) => {
        let Y = K.get();
        if (!Y || Y.dependencies.length !== q.length || Y.dependencies.some((z, _) => z !== q[_])) {
            let z = A();
            return K.set({
                value: z,
                dependencies: q
            }), z
        }
        return Y.value
    })
}
// @from(Ln 104749, Col 4)
e97 = E(() => {
    i46()
})
// @from(Ln 104753, Col 0)
function xo(A) {
    return CP({
        current: A
    })[0]
}
// @from(Ln 104758, Col 4)
v91 = E(() => {
    Z91()
})
// @from(Ln 104762, Col 0)
function o46(A) {
    let q = xo(A);
    q.current = A, n46((K) => {
        let Y = !1,
            z = V38((_, w) => {
                if (Y) return;
                q.current(w, K)
            });
        return K.input.on("keypress", z), () => {
            Y = !0, K.input.removeListener("keypress", z)
        }
    }, [])
}
// @from(Ln 104775, Col 4)
AY7 = E(() => {
    v91();
    G91();
    i46()
})
// @from(Ln 104780, Col 4)
KY7 = x((GG_, qY7) => {
    qY7.exports = qH3;

    function AH3(A) {
        let q = {
            defaultWidth: 0,
            output: process.stdout,
            tty: x6("tty")
        };
        if (!A) return q;
        return Object.keys(q).forEach(function(K) {
            if (!A[K]) A[K] = q[K]
        }), A
    }

    function qH3(A) {
        let q = AH3(A);
        if (q.output.getWindowSize) return q.output.getWindowSize()[0] || q.defaultWidth;
        if (q.tty.getWindowSize) return q.tty.getWindowSize()[1] || q.defaultWidth;
        if (q.output.columns) return q.output.columns;
        if (process.env.CLI_WIDTH) {
            let K = parseInt(process.env.CLI_WIDTH, 10);
            if (!isNaN(K) && K !== 0) return K
        }
        return q.defaultWidth
    }
})
// @from(Ln 104807, Col 4)
zY7 = x((fG_, YY7) => {
    YY7.exports = ({
        onlyFirst: A = !1
    } = {}) => {
        let q = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");
        return new RegExp(q, A ? void 0 : "g")
    }
})
// @from(Ln 104815, Col 4)
wY7 = x((TG_, _Y7) => {
    var KH3 = zY7();
    _Y7.exports = (A) => typeof A === "string" ? A.replace(KH3(), "") : A
})
// @from(Ln 104819, Col 4)
$Y7 = x((vG_, E38) => {
    var OY7 = (A) => {
        if (Number.isNaN(A)) return !1;
        if (A >= 4352 && (A <= 4447 || A === 9001 || A === 9002 || 11904 <= A && A <= 12871 && A !== 12351 || 12880 <= A && A <= 19903 || 19968 <= A && A <= 42182 || 43360 <= A && A <= 43388 || 44032 <= A && A <= 55203 || 63744 <= A && A <= 64255 || 65040 <= A && A <= 65049 || 65072 <= A && A <= 65131 || 65281 <= A && A <= 65376 || 65504 <= A && A <= 65510 || 110592 <= A && A <= 110593 || 127488 <= A && A <= 127569 || 131072 <= A && A <= 262141)) return !0;
        return !1
    };
    E38.exports = OY7;
    E38.exports.default = OY7
})
// @from(Ln 104828, Col 4)
jY7 = x((NG_, y38) => {
    var YH3 = wY7(),
        zH3 = $Y7(),
        _H3 = n58(),
        HY7 = (A) => {
            if (typeof A !== "string" || A.length === 0) return 0;
            if (A = YH3(A), A.length === 0) return 0;
            A = A.replace(_H3(), "  ");
            let q = 0;
            for (let K = 0; K < A.length; K++) {
                let Y = A.codePointAt(K);
                if (Y <= 31 || Y >= 127 && Y <= 159) continue;
                if (Y >= 768 && Y <= 879) continue;
                if (Y > 65535) K++;
                q += zH3(Y) ? 2 : 1
            }
            return q
        };
    y38.exports = HY7;
    y38.exports.default = HY7
})
// @from(Ln 104849, Col 4)
MY7 = x((VG_, JY7) => {
    JY7.exports = ({
        onlyFirst: A = !1
    } = {}) => {
        let q = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");
        return new RegExp(q, A ? void 0 : "g")
    }
})
// @from(Ln 104857, Col 4)
L38 = x((kG_, DY7) => {
    var wH3 = MY7();
    DY7.exports = (A) => typeof A === "string" ? A.replace(wH3(), "") : A
})
// @from(Ln 104861, Col 4)
PY7 = x((EG_, XY7) => {
    XY7.exports = {
        aliceblue: [240, 248, 255],
        antiquewhite: [250, 235, 215],
        aqua: [0, 255, 255],
        aquamarine: [127, 255, 212],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        bisque: [255, 228, 196],
        black: [0, 0, 0],
        blanchedalmond: [255, 235, 205],
        blue: [0, 0, 255],
        blueviolet: [138, 43, 226],
        brown: [165, 42, 42],
        burlywood: [222, 184, 135],
        cadetblue: [95, 158, 160],
        chartreuse: [127, 255, 0],
        chocolate: [210, 105, 30],
        coral: [255, 127, 80],
        cornflowerblue: [100, 149, 237],
        cornsilk: [255, 248, 220],
        crimson: [220, 20, 60],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgoldenrod: [184, 134, 11],
        darkgray: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkgrey: [169, 169, 169],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkseagreen: [143, 188, 143],
        darkslateblue: [72, 61, 139],
        darkslategray: [47, 79, 79],
        darkslategrey: [47, 79, 79],
        darkturquoise: [0, 206, 209],
        darkviolet: [148, 0, 211],
        deeppink: [255, 20, 147],
        deepskyblue: [0, 191, 255],
        dimgray: [105, 105, 105],
        dimgrey: [105, 105, 105],
        dodgerblue: [30, 144, 255],
        firebrick: [178, 34, 34],
        floralwhite: [255, 250, 240],
        forestgreen: [34, 139, 34],
        fuchsia: [255, 0, 255],
        gainsboro: [220, 220, 220],
        ghostwhite: [248, 248, 255],
        gold: [255, 215, 0],
        goldenrod: [218, 165, 32],
        gray: [128, 128, 128],
        green: [0, 128, 0],
        greenyellow: [173, 255, 47],
        grey: [128, 128, 128],
        honeydew: [240, 255, 240],
        hotpink: [255, 105, 180],
        indianred: [205, 92, 92],
        indigo: [75, 0, 130],
        ivory: [255, 255, 240],
        khaki: [240, 230, 140],
        lavender: [230, 230, 250],
        lavenderblush: [255, 240, 245],
        lawngreen: [124, 252, 0],
        lemonchiffon: [255, 250, 205],
        lightblue: [173, 216, 230],
        lightcoral: [240, 128, 128],
        lightcyan: [224, 255, 255],
        lightgoldenrodyellow: [250, 250, 210],
        lightgray: [211, 211, 211],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightsalmon: [255, 160, 122],
        lightseagreen: [32, 178, 170],
        lightskyblue: [135, 206, 250],
        lightslategray: [119, 136, 153],
        lightslategrey: [119, 136, 153],
        lightsteelblue: [176, 196, 222],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        limegreen: [50, 205, 50],
        linen: [250, 240, 230],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        mediumaquamarine: [102, 205, 170],
        mediumblue: [0, 0, 205],
        mediumorchid: [186, 85, 211],
        mediumpurple: [147, 112, 219],
        mediumseagreen: [60, 179, 113],
        mediumslateblue: [123, 104, 238],
        mediumspringgreen: [0, 250, 154],
        mediumturquoise: [72, 209, 204],
        mediumvioletred: [199, 21, 133],
        midnightblue: [25, 25, 112],
        mintcream: [245, 255, 250],
        mistyrose: [255, 228, 225],
        moccasin: [255, 228, 181],
        navajowhite: [255, 222, 173],
        navy: [0, 0, 128],
        oldlace: [253, 245, 230],
        olive: [128, 128, 0],
        olivedrab: [107, 142, 35],
        orange: [255, 165, 0],
        orangered: [255, 69, 0],
        orchid: [218, 112, 214],
        palegoldenrod: [238, 232, 170],
        palegreen: [152, 251, 152],
        paleturquoise: [175, 238, 238],
        palevioletred: [219, 112, 147],
        papayawhip: [255, 239, 213],
        peachpuff: [255, 218, 185],
        peru: [205, 133, 63],
        pink: [255, 192, 203],
        plum: [221, 160, 221],
        powderblue: [176, 224, 230],
        purple: [128, 0, 128],
        rebeccapurple: [102, 51, 153],
        red: [255, 0, 0],
        rosybrown: [188, 143, 143],
        royalblue: [65, 105, 225],
        saddlebrown: [139, 69, 19],
        salmon: [250, 128, 114],
        sandybrown: [244, 164, 96],
        seagreen: [46, 139, 87],
        seashell: [255, 245, 238],
        sienna: [160, 82, 45],
        silver: [192, 192, 192],
        skyblue: [135, 206, 235],
        slateblue: [106, 90, 205],
        slategray: [112, 128, 144],
        slategrey: [112, 128, 144],
        snow: [255, 250, 250],
        springgreen: [0, 255, 127],
        steelblue: [70, 130, 180],
        tan: [210, 180, 140],
        teal: [0, 128, 128],
        thistle: [216, 191, 216],
        tomato: [255, 99, 71],
        turquoise: [64, 224, 208],
        violet: [238, 130, 238],
        wheat: [245, 222, 179],
        white: [255, 255, 255],
        whitesmoke: [245, 245, 245],
        yellow: [255, 255, 0],
        yellowgreen: [154, 205, 50]
    }
})
// @from(Ln 105013, Col 4)
R38 = x((yG_, ZY7) => {
    var tC6 = PY7(),
        WY7 = {};
    for (let A of Object.keys(tC6)) WY7[tC6[A]] = A;
    var zq = {
        rgb: {
            channels: 3,
            labels: "rgb"
        },
        hsl: {
            channels: 3,
            labels: "hsl"
        },
        hsv: {
            channels: 3,
            labels: "hsv"
        },
        hwb: {
            channels: 3,
            labels: "hwb"
        },
        cmyk: {
            channels: 4,
            labels: "cmyk"
        },
        xyz: {
            channels: 3,
            labels: "xyz"
        },
        lab: {
            channels: 3,
            labels: "lab"
        },
        lch: {
            channels: 3,
            labels: "lch"
        },
        hex: {
            channels: 1,
            labels: ["hex"]
        },
        keyword: {
            channels: 1,
            labels: ["keyword"]
        },
        ansi16: {
            channels: 1,
            labels: ["ansi16"]
        },
        ansi256: {
            channels: 1,
            labels: ["ansi256"]
        },
        hcg: {
            channels: 3,
            labels: ["h", "c", "g"]
        },
        apple: {
            channels: 3,
            labels: ["r16", "g16", "b16"]
        },
        gray: {
            channels: 1,
            labels: ["gray"]
        }
    };
    ZY7.exports = zq;
    for (let A of Object.keys(zq)) {
        if (!("channels" in zq[A])) throw Error("missing channels property: " + A);
        if (!("labels" in zq[A])) throw Error("missing channel labels property: " + A);
        if (zq[A].labels.length !== zq[A].channels) throw Error("channel and label counts mismatch: " + A);
        let {
            channels: q,
            labels: K
        } = zq[A];
        delete zq[A].channels, delete zq[A].labels, Object.defineProperty(zq[A], "channels", {
            value: q
        }), Object.defineProperty(zq[A], "labels", {
            value: K
        })
    }
    zq.rgb.hsl = function(A) {
        let q = A[0] / 255,
            K = A[1] / 255,
            Y = A[2] / 255,
            z = Math.min(q, K, Y),
            _ = Math.max(q, K, Y),
            w = _ - z,
            O, $;
        if (_ === z) O = 0;
        else if (q === _) O = (K - Y) / w;
        else if (K === _) O = 2 + (Y - q) / w;
        else if (Y === _) O = 4 + (q - K) / w;
        if (O = Math.min(O * 60, 360), O < 0) O += 360;
        let H = (z + _) / 2;
        if (_ === z) $ = 0;
        else if (H <= 0.5) $ = w / (_ + z);
        else $ = w / (2 - _ - z);
        return [O, $ * 100, H * 100]
    };
    zq.rgb.hsv = function(A) {
        let q, K, Y, z, _, w = A[0] / 255,
            O = A[1] / 255,
            $ = A[2] / 255,
            H = Math.max(w, O, $),
            j = H - Math.min(w, O, $),
            J = function(M) {
                return (H - M) / 6 / j + 0.5
            };
        if (j === 0) z = 0, _ = 0;
        else {
            if (_ = j / H, q = J(w), K = J(O), Y = J($), w === H) z = Y - K;
            else if (O === H) z = 0.3333333333333333 + q - Y;
            else if ($ === H) z = 0.6666666666666666 + K - q;
            if (z < 0) z += 1;
            else if (z > 1) z -= 1
        }
        return [z * 360, _ * 100, H * 100]
    };
    zq.rgb.hwb = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2],
            z = zq.rgb.hsl(A)[0],
            _ = 0.00392156862745098 * Math.min(q, Math.min(K, Y));
        return Y = 1 - 0.00392156862745098 * Math.max(q, Math.max(K, Y)), [z, _ * 100, Y * 100]
    };
    zq.rgb.cmyk = function(A) {
        let q = A[0] / 255,
            K = A[1] / 255,
            Y = A[2] / 255,
            z = Math.min(1 - q, 1 - K, 1 - Y),
            _ = (1 - q - z) / (1 - z) || 0,
            w = (1 - K - z) / (1 - z) || 0,
            O = (1 - Y - z) / (1 - z) || 0;
        return [_ * 100, w * 100, O * 100, z * 100]
    };

    function OH3(A, q) {
        return (A[0] - q[0]) ** 2 + (A[1] - q[1]) ** 2 + (A[2] - q[2]) ** 2
    }
    zq.rgb.keyword = function(A) {
        let q = WY7[A];
        if (q) return q;
        let K = 1 / 0,
            Y;
        for (let z of Object.keys(tC6)) {
            let _ = tC6[z],
                w = OH3(A, _);
            if (w < K) K = w, Y = z
        }
        return Y
    };
    zq.keyword.rgb = function(A) {
        return tC6[A]
    };
    zq.rgb.xyz = function(A) {
        let q = A[0] / 255,
            K = A[1] / 255,
            Y = A[2] / 255;
        q = q > 0.04045 ? ((q + 0.055) / 1.055) ** 2.4 : q / 12.92, K = K > 0.04045 ? ((K + 0.055) / 1.055) ** 2.4 : K / 12.92, Y = Y > 0.04045 ? ((Y + 0.055) / 1.055) ** 2.4 : Y / 12.92;
        let z = q * 0.4124 + K * 0.3576 + Y * 0.1805,
            _ = q * 0.2126 + K * 0.7152 + Y * 0.0722,
            w = q * 0.0193 + K * 0.1192 + Y * 0.9505;
        return [z * 100, _ * 100, w * 100]
    };
    zq.rgb.lab = function(A) {
        let q = zq.rgb.xyz(A),
            K = q[0],
            Y = q[1],
            z = q[2];
        K /= 95.047, Y /= 100, z /= 108.883, K = K > 0.008856 ? K ** 0.3333333333333333 : 7.787 * K + 0.13793103448275862, Y = Y > 0.008856 ? Y ** 0.3333333333333333 : 7.787 * Y + 0.13793103448275862, z = z > 0.008856 ? z ** 0.3333333333333333 : 7.787 * z + 0.13793103448275862;
        let _ = 116 * Y - 16,
            w = 500 * (K - Y),
            O = 200 * (Y - z);
        return [_, w, O]
    };
    zq.hsl.rgb = function(A) {
        let q = A[0] / 360,
            K = A[1] / 100,
            Y = A[2] / 100,
            z, _, w;
        if (K === 0) return w = Y * 255, [w, w, w];
        if (Y < 0.5) z = Y * (1 + K);
        else z = Y + K - Y * K;
        let O = 2 * Y - z,
            $ = [0, 0, 0];
        for (let H = 0; H < 3; H++) {
            if (_ = q + 0.3333333333333333 * -(H - 1), _ < 0) _++;
            if (_ > 1) _--;
            if (6 * _ < 1) w = O + (z - O) * 6 * _;
            else if (2 * _ < 1) w = z;
            else if (3 * _ < 2) w = O + (z - O) * (0.6666666666666666 - _) * 6;
            else w = O;
            $[H] = w * 255
        }
        return $
    };
    zq.hsl.hsv = function(A) {
        let q = A[0],
            K = A[1] / 100,
            Y = A[2] / 100,
            z = K,
            _ = Math.max(Y, 0.01);
        Y *= 2, K *= Y <= 1 ? Y : 2 - Y, z *= _ <= 1 ? _ : 2 - _;
        let w = (Y + K) / 2,
            O = Y === 0 ? 2 * z / (_ + z) : 2 * K / (Y + K);
        return [q, O * 100, w * 100]
    };
    zq.hsv.rgb = function(A) {
        let q = A[0] / 60,
            K = A[1] / 100,
            Y = A[2] / 100,
            z = Math.floor(q) % 6,
            _ = q - Math.floor(q),
            w = 255 * Y * (1 - K),
            O = 255 * Y * (1 - K * _),
            $ = 255 * Y * (1 - K * (1 - _));
        switch (Y *= 255, z) {
            case 0:
                return [Y, $, w];
            case 1:
                return [O, Y, w];
            case 2:
                return [w, Y, $];
            case 3:
                return [w, O, Y];
            case 4:
                return [$, w, Y];
            case 5:
                return [Y, w, O]
        }
    };
    zq.hsv.hsl = function(A) {
        let q = A[0],
            K = A[1] / 100,
            Y = A[2] / 100,
            z = Math.max(Y, 0.01),
            _, w;
        w = (2 - K) * Y;
        let O = (2 - K) * z;
        return _ = K * z, _ /= O <= 1 ? O : 2 - O, _ = _ || 0, w /= 2, [q, _ * 100, w * 100]
    };
    zq.hwb.rgb = function(A) {
        let q = A[0] / 360,
            K = A[1] / 100,
            Y = A[2] / 100,
            z = K + Y,
            _;
        if (z > 1) K /= z, Y /= z;
        let w = Math.floor(6 * q),
            O = 1 - Y;
        if (_ = 6 * q - w, (w & 1) !== 0) _ = 1 - _;
        let $ = K + _ * (O - K),
            H, j, J;
        switch (w) {
            default:
            case 6:
            case 0:
                H = O, j = $, J = K;
                break;
            case 1:
                H = $, j = O, J = K;
                break;
            case 2:
                H = K, j = O, J = $;
                break;
            case 3:
                H = K, j = $, J = O;
                break;
            case 4:
                H = $, j = K, J = O;
                break;
            case 5:
                H = O, j = K, J = $;
                break
        }
        return [H * 255, j * 255, J * 255]
    };
    zq.cmyk.rgb = function(A) {
        let q = A[0] / 100,
            K = A[1] / 100,
            Y = A[2] / 100,
            z = A[3] / 100,
            _ = 1 - Math.min(1, q * (1 - z) + z),
            w = 1 - Math.min(1, K * (1 - z) + z),
            O = 1 - Math.min(1, Y * (1 - z) + z);
        return [_ * 255, w * 255, O * 255]
    };
    zq.xyz.rgb = function(A) {
        let q = A[0] / 100,
            K = A[1] / 100,
            Y = A[2] / 100,
            z, _, w;
        return z = q * 3.2406 + K * -1.5372 + Y * -0.4986, _ = q * -0.9689 + K * 1.8758 + Y * 0.0415, w = q * 0.0557 + K * -0.204 + Y * 1.057, z = z > 0.0031308 ? 1.055 * z ** 0.4166666666666667 - 0.055 : z * 12.92, _ = _ > 0.0031308 ? 1.055 * _ ** 0.4166666666666667 - 0.055 : _ * 12.92, w = w > 0.0031308 ? 1.055 * w ** 0.4166666666666667 - 0.055 : w * 12.92, z = Math.min(Math.max(0, z), 1), _ = Math.min(Math.max(0, _), 1), w = Math.min(Math.max(0, w), 1), [z * 255, _ * 255, w * 255]
    };
    zq.xyz.lab = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2];
        q /= 95.047, K /= 100, Y /= 108.883, q = q > 0.008856 ? q ** 0.3333333333333333 : 7.787 * q + 0.13793103448275862, K = K > 0.008856 ? K ** 0.3333333333333333 : 7.787 * K + 0.13793103448275862, Y = Y > 0.008856 ? Y ** 0.3333333333333333 : 7.787 * Y + 0.13793103448275862;
        let z = 116 * K - 16,
            _ = 500 * (q - K),
            w = 200 * (K - Y);
        return [z, _, w]
    };
    zq.lab.xyz = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2],
            z, _, w;
        _ = (q + 16) / 116, z = K / 500 + _, w = _ - Y / 200;
        let O = _ ** 3,
            $ = z ** 3,
            H = w ** 3;
        return _ = O > 0.008856 ? O : (_ - 0.13793103448275862) / 7.787, z = $ > 0.008856 ? $ : (z - 0.13793103448275862) / 7.787, w = H > 0.008856 ? H : (w - 0.13793103448275862) / 7.787, z *= 95.047, _ *= 100, w *= 108.883, [z, _, w]
    };
    zq.lab.lch = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2],
            z;
        if (z = Math.atan2(Y, K) * 360 / 2 / Math.PI, z < 0) z += 360;
        let w = Math.sqrt(K * K + Y * Y);
        return [q, w, z]
    };
    zq.lch.lab = function(A) {
        let q = A[0],
            K = A[1],
            z = A[2] / 360 * 2 * Math.PI,
            _ = K * Math.cos(z),
            w = K * Math.sin(z);
        return [q, _, w]
    };
    zq.rgb.ansi16 = function(A, q = null) {
        let [K, Y, z] = A, _ = q === null ? zq.rgb.hsv(A)[2] : q;
        if (_ = Math.round(_ / 50), _ === 0) return 30;
        let w = 30 + (Math.round(z / 255) << 2 | Math.round(Y / 255) << 1 | Math.round(K / 255));
        if (_ === 2) w += 60;
        return w
    };
    zq.hsv.ansi16 = function(A) {
        return zq.rgb.ansi16(zq.hsv.rgb(A), A[2])
    };
    zq.rgb.ansi256 = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2];
        if (q === K && K === Y) {
            if (q < 8) return 16;
            if (q > 248) return 231;
            return Math.round((q - 8) / 247 * 24) + 232
        }
        return 16 + 36 * Math.round(q / 255 * 5) + 6 * Math.round(K / 255 * 5) + Math.round(Y / 255 * 5)
    };
    zq.ansi16.rgb = function(A) {
        let q = A % 10;
        if (q === 0 || q === 7) {
            if (A > 50) q += 3.5;
            return q = q / 10.5 * 255, [q, q, q]
        }
        let K = (~~(A > 50) + 1) * 0.5,
            Y = (q & 1) * K * 255,
            z = (q >> 1 & 1) * K * 255,
            _ = (q >> 2 & 1) * K * 255;
        return [Y, z, _]
    };
    zq.ansi256.rgb = function(A) {
        if (A >= 232) {
            let _ = (A - 232) * 10 + 8;
            return [_, _, _]
        }
        A -= 16;
        let q, K = Math.floor(A / 36) / 5 * 255,
            Y = Math.floor((q = A % 36) / 6) / 5 * 255,
            z = q % 6 / 5 * 255;
        return [K, Y, z]
    };
    zq.rgb.hex = function(A) {
        let K = (((Math.round(A[0]) & 255) << 16) + ((Math.round(A[1]) & 255) << 8) + (Math.round(A[2]) & 255)).toString(16).toUpperCase();
        return "000000".substring(K.length) + K
    };
    zq.hex.rgb = function(A) {
        let q = A.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
        if (!q) return [0, 0, 0];
        let K = q[0];
        if (q[0].length === 3) K = K.split("").map((O) => {
            return O + O
        }).join("");
        let Y = parseInt(K, 16),
            z = Y >> 16 & 255,
            _ = Y >> 8 & 255,
            w = Y & 255;
        return [z, _, w]
    };
    zq.rgb.hcg = function(A) {
        let q = A[0] / 255,
            K = A[1] / 255,
            Y = A[2] / 255,
            z = Math.max(Math.max(q, K), Y),
            _ = Math.min(Math.min(q, K), Y),
            w = z - _,
            O, $;
        if (w < 1) O = _ / (1 - w);
        else O = 0;
        if (w <= 0) $ = 0;
        else if (z === q) $ = (K - Y) / w % 6;
        else if (z === K) $ = 2 + (Y - q) / w;
        else $ = 4 + (q - K) / w;
        return $ /= 6, $ %= 1, [$ * 360, w * 100, O * 100]
    };
    zq.hsl.hcg = function(A) {
        let q = A[1] / 100,
            K = A[2] / 100,
            Y = K < 0.5 ? 2 * q * K : 2 * q * (1 - K),
            z = 0;
        if (Y < 1) z = (K - 0.5 * Y) / (1 - Y);
        return [A[0], Y * 100, z * 100]
    };
    zq.hsv.hcg = function(A) {
        let q = A[1] / 100,
            K = A[2] / 100,
            Y = q * K,
            z = 0;
        if (Y < 1) z = (K - Y) / (1 - Y);
        return [A[0], Y * 100, z * 100]
    };
    zq.hcg.rgb = function(A) {
        let q = A[0] / 360,
            K = A[1] / 100,
            Y = A[2] / 100;
        if (K === 0) return [Y * 255, Y * 255, Y * 255];
        let z = [0, 0, 0],
            _ = q % 1 * 6,
            w = _ % 1,
            O = 1 - w,
            $ = 0;
        switch (Math.floor(_)) {
            case 0:
                z[0] = 1, z[1] = w, z[2] = 0;
                break;
            case 1:
                z[0] = O, z[1] = 1, z[2] = 0;
                break;
            case 2:
                z[0] = 0, z[1] = 1, z[2] = w;
                break;
            case 3:
                z[0] = 0, z[1] = O, z[2] = 1;
                break;
            case 4:
                z[0] = w, z[1] = 0, z[2] = 1;
                break;
            default:
                z[0] = 1, z[1] = 0, z[2] = O
        }
        return $ = (1 - K) * Y, [(K * z[0] + $) * 255, (K * z[1] + $) * 255, (K * z[2] + $) * 255]
    };
    zq.hcg.hsv = function(A) {
        let q = A[1] / 100,
            K = A[2] / 100,
            Y = q + K * (1 - q),
            z = 0;
        if (Y > 0) z = q / Y;
        return [A[0], z * 100, Y * 100]
    };
    zq.hcg.hsl = function(A) {
        let q = A[1] / 100,
            Y = A[2] / 100 * (1 - q) + 0.5 * q,
            z = 0;
        if (Y > 0 && Y < 0.5) z = q / (2 * Y);
        else if (Y >= 0.5 && Y < 1) z = q / (2 * (1 - Y));
        return [A[0], z * 100, Y * 100]
    };
    zq.hcg.hwb = function(A) {
        let q = A[1] / 100,
            K = A[2] / 100,
            Y = q + K * (1 - q);
        return [A[0], (Y - q) * 100, (1 - Y) * 100]
    };
    zq.hwb.hcg = function(A) {
        let q = A[1] / 100,
            Y = 1 - A[2] / 100,
            z = Y - q,
            _ = 0;
        if (z < 1) _ = (Y - z) / (1 - z);
        return [A[0], z * 100, _ * 100]
    };
    zq.apple.rgb = function(A) {
        return [A[0] / 65535 * 255, A[1] / 65535 * 255, A[2] / 65535 * 255]
    };
    zq.rgb.apple = function(A) {
        return [A[0] / 255 * 65535, A[1] / 255 * 65535, A[2] / 255 * 65535]
    };
    zq.gray.rgb = function(A) {
        return [A[0] / 100 * 255, A[0] / 100 * 255, A[0] / 100 * 255]
    };
    zq.gray.hsl = function(A) {
        return [0, 0, A[0]]
    };
    zq.gray.hsv = zq.gray.hsl;
    zq.gray.hwb = function(A) {
        return [0, 100, A[0]]
    };
    zq.gray.cmyk = function(A) {
        return [0, 0, 0, A[0]]
    };
    zq.gray.lab = function(A) {
        return [A[0], 0, 0]
    };
    zq.gray.hex = function(A) {
        let q = Math.round(A[0] / 100 * 255) & 255,
            Y = ((q << 16) + (q << 8) + q).toString(16).toUpperCase();
        return "000000".substring(Y.length) + Y
    };
    zq.rgb.gray = function(A) {
        return [(A[0] + A[1] + A[2]) / 3 / 255 * 100]
    }
})
// @from(Ln 105532, Col 4)
fY7 = x((LG_, GY7) => {
    var N91 = R38();

    function $H3() {
        let A = {},
            q = Object.keys(N91);
        for (let K = q.length, Y = 0; Y < K; Y++) A[q[Y]] = {
            distance: -1,
            parent: null
        };
        return A
    }

    function HH3(A) {
        let q = $H3(),
            K = [A];
        q[A].distance = 0;
        while (K.length) {
            let Y = K.pop(),
                z = Object.keys(N91[Y]);
            for (let _ = z.length, w = 0; w < _; w++) {
                let O = z[w],
                    $ = q[O];
                if ($.distance === -1) $.distance = q[Y].distance + 1, $.parent = Y, K.unshift(O)
            }
        }
        return q
    }

    function jH3(A, q) {
        return function(K) {
            return q(A(K))
        }
    }

    function JH3(A, q) {
        let K = [q[A].parent, A],
            Y = N91[q[A].parent][A],
            z = q[A].parent;
        while (q[z].parent) K.unshift(q[z].parent), Y = jH3(N91[q[z].parent][z], Y), z = q[z].parent;
        return Y.conversion = K, Y
    }
    GY7.exports = function(A) {
        let q = HH3(A),
            K = {},
            Y = Object.keys(q);
        for (let z = Y.length, _ = 0; _ < z; _++) {
            let w = Y[_];
            if (q[w].parent === null) continue;
            K[w] = JH3(w, q)
        }
        return K
    }
})
// @from(Ln 105586, Col 4)
S38 = x((RG_, TY7) => {
    var h38 = R38(),
        MH3 = fY7(),
        bJ6 = {},
        DH3 = Object.keys(h38);

    function XH3(A) {
        let q = function(...K) {
            let Y = K[0];
            if (Y === void 0 || Y === null) return Y;
            if (Y.length > 1) K = Y;
            return A(K)
        };
        if ("conversion" in A) q.conversion = A.conversion;
        return q
    }

    function PH3(A) {
        let q = function(...K) {
            let Y = K[0];
            if (Y === void 0 || Y === null) return Y;
            if (Y.length > 1) K = Y;
            let z = A(K);
            if (typeof z === "object")
                for (let _ = z.length, w = 0; w < _; w++) z[w] = Math.round(z[w]);
            return z
        };
        if ("conversion" in A) q.conversion = A.conversion;
        return q
    }
    DH3.forEach((A) => {
        bJ6[A] = {}, Object.defineProperty(bJ6[A], "channels", {
            value: h38[A].channels
        }), Object.defineProperty(bJ6[A], "labels", {
            value: h38[A].labels
        });
        let q = MH3(A);
        Object.keys(q).forEach((Y) => {
            let z = q[Y];
            bJ6[A][Y] = PH3(z), bJ6[A][Y].raw = XH3(z)
        })
    });
    TY7.exports = bJ6
})
// @from(Ln 105630, Col 4)
yY7 = x((hG_, EY7) => {
    var vY7 = (A, q) => (...K) => {
            return `\x1B[${A(...K)+q}m`
        },
        NY7 = (A, q) => (...K) => {
            let Y = A(...K);
            return `\x1B[${38+q};5;${Y}m`
        },
        VY7 = (A, q) => (...K) => {
            let Y = A(...K);
            return `\x1B[${38+q};2;${Y[0]};${Y[1]};${Y[2]}m`
        },
        V91 = (A) => A,
        kY7 = (A, q, K) => [A, q, K],
        xJ6 = (A, q, K) => {
            Object.defineProperty(A, q, {
                get: () => {
                    let Y = K();
                    return Object.defineProperty(A, q, {
                        value: Y,
                        enumerable: !0,
                        configurable: !0
                    }), Y
                },
                enumerable: !0,
                configurable: !0
            })
        },
        C38, uJ6 = (A, q, K, Y) => {
            if (C38 === void 0) C38 = S38();
            let z = Y ? 10 : 0,
                _ = {};
            for (let [w, O] of Object.entries(C38)) {
                let $ = w === "ansi16" ? "ansi" : w;
                if (w === q) _[$] = A(K, z);
                else if (typeof O === "object") _[$] = A(O[q], z)
            }
            return _
        };

    function WH3() {
        let A = new Map,
            q = {
                modifier: {
                    reset: [0, 0],
                    bold: [1, 22],
                    dim: [2, 22],
                    italic: [3, 23],
                    underline: [4, 24],
                    inverse: [7, 27],
                    hidden: [8, 28],
                    strikethrough: [9, 29]
                },
                color: {
                    black: [30, 39],
                    red: [31, 39],
                    green: [32, 39],
                    yellow: [33, 39],
                    blue: [34, 39],
                    magenta: [35, 39],
                    cyan: [36, 39],
                    white: [37, 39],
                    blackBright: [90, 39],
                    redBright: [91, 39],
                    greenBright: [92, 39],
                    yellowBright: [93, 39],
                    blueBright: [94, 39],
                    magentaBright: [95, 39],
                    cyanBright: [96, 39],
                    whiteBright: [97, 39]
                },
                bgColor: {
                    bgBlack: [40, 49],
                    bgRed: [41, 49],
                    bgGreen: [42, 49],
                    bgYellow: [43, 49],
                    bgBlue: [44, 49],
                    bgMagenta: [45, 49],
                    bgCyan: [46, 49],
                    bgWhite: [47, 49],
                    bgBlackBright: [100, 49],
                    bgRedBright: [101, 49],
                    bgGreenBright: [102, 49],
                    bgYellowBright: [103, 49],
                    bgBlueBright: [104, 49],
                    bgMagentaBright: [105, 49],
                    bgCyanBright: [106, 49],
                    bgWhiteBright: [107, 49]
                }
            };
        q.color.gray = q.color.blackBright, q.bgColor.bgGray = q.bgColor.bgBlackBright, q.color.grey = q.color.blackBright, q.bgColor.bgGrey = q.bgColor.bgBlackBright;
        for (let [K, Y] of Object.entries(q)) {
            for (let [z, _] of Object.entries(Y)) q[z] = {
                open: `\x1B[${_[0]}m`,
                close: `\x1B[${_[1]}m`
            }, Y[z] = q[z], A.set(_[0], _[1]);
            Object.defineProperty(q, K, {
                value: Y,
                enumerable: !1
            })
        }
        return Object.defineProperty(q, "codes", {
            value: A,
            enumerable: !1
        }), q.color.close = "\x1B[39m", q.bgColor.close = "\x1B[49m", xJ6(q.color, "ansi", () => uJ6(vY7, "ansi16", V91, !1)), xJ6(q.color, "ansi256", () => uJ6(NY7, "ansi256", V91, !1)), xJ6(q.color, "ansi16m", () => uJ6(VY7, "rgb", kY7, !1)), xJ6(q.bgColor, "ansi", () => uJ6(vY7, "ansi16", V91, !0)), xJ6(q.bgColor, "ansi256", () => uJ6(NY7, "ansi256", V91, !0)), xJ6(q.bgColor, "ansi16m", () => uJ6(VY7, "rgb", kY7, !0)), q
    }
    Object.defineProperty(EY7, "exports", {
        enumerable: !0,
        get: WH3
    })
})
// @from(Ln 105741, Col 4)
hY7 = x((SG_, RY7) => {
    var eC6 = jY7(),
        ZH3 = L38(),
        GH3 = yY7(),
        b38 = new Set(["\x1B", ""]),
        LY7 = (A) => `${b38.values().next().value}[${A}m`,
        fH3 = (A) => A.split(" ").map((q) => eC6(q)),
        I38 = (A, q, K) => {
            let Y = [...q],
                z = !1,
                _ = eC6(ZH3(A[A.length - 1]));
            for (let [w, O] of Y.entries()) {
                let $ = eC6(O);
                if (_ + $ <= K) A[A.length - 1] += O;
                else A.push(O), _ = 0;
                if (b38.has(O)) z = !0;
                else if (z && O === "m") {
                    z = !1;
                    continue
                }
                if (z) continue;
                if (_ += $, _ === K && w < Y.length - 1) A.push(""), _ = 0
            }
            if (!_ && A[A.length - 1].length > 0 && A.length > 1) A[A.length - 2] += A.pop()
        },
        TH3 = (A) => {
            let q = A.split(" "),
                K = q.length;
            while (K > 0) {
                if (eC6(q[K - 1]) > 0) break;
                K--
            }
            if (K === q.length) return A;
            return q.slice(0, K).join(" ") + q.slice(K).join("")
        },
        vH3 = (A, q, K = {}) => {
            if (K.trim !== !1 && A.trim() === "") return "";
            let Y = "",
                z = "",
                _, w = fH3(A),
                O = [""];
            for (let [$, H] of A.split(" ").entries()) {
                if (K.trim !== !1) O[O.length - 1] = O[O.length - 1].trimLeft();
                let j = eC6(O[O.length - 1]);
                if ($ !== 0) {
                    if (j >= q && (K.wordWrap === !1 || K.trim === !1)) O.push(""), j = 0;
                    if (j > 0 || K.trim === !1) O[O.length - 1] += " ", j++
                }
                if (K.hard && w[$] > q) {
                    let J = q - j,
                        M = 1 + Math.floor((w[$] - J - 1) / q);
                    if (Math.floor((w[$] - 1) / q) < M) O.push("");
                    I38(O, H, q);
                    continue
                }
                if (j + w[$] > q && j > 0 && w[$] > 0) {
                    if (K.wordWrap === !1 && j < q) {
                        I38(O, H, q);
                        continue
                    }
                    O.push("")
                }
                if (j + w[$] > q && K.wordWrap === !1) {
                    I38(O, H, q);
                    continue
                }
                O[O.length - 1] += H
            }
            if (K.trim !== !1) O = O.map(TH3);
            Y = O.join(`
`);
            for (let [$, H] of [...Y].entries()) {
                if (z += H, b38.has(H)) {
                    let J = parseFloat(/\d[^m]*/.exec(Y.slice($, $ + 4)));
                    _ = J === 39 ? null : J
                }
                let j = GH3.codes.get(Number(_));
                if (_ && j) {
                    if (Y[$ + 1] === `
`) z += LY7(j);
                    else if (H === `
`) z += LY7(_)
                }
            }
            return z
        };
    RY7.exports = (A, q, K) => {
        return String(A).normalize().replace(/\r\n/g, `
`).split(`
`).map((Y) => vH3(Y, q, K)).join(`
`)
    }
})
// @from(Ln 105835, Col 0)
function AI6(A, q) {
    return A.split(`
`).flatMap((K) => CY7.default(K, q, {
        trim: !1,
        hard: !0
    }).split(`
`).map((Y) => Y.trimEnd())).join(`
`)
}
// @from(Ln 105845, Col 0)
function k91() {
    return SY7.default({
        defaultWidth: 80,
        output: N38().output
    })
}
// @from(Ln 105851, Col 4)
SY7
// @from(Ln 105851, Col 9)
CY7
// @from(Ln 105852, Col 4)
E91 = E(() => {
    i46();
    SY7 = t(KY7(), 1), CY7 = t(hY7(), 1)
})
// @from(Ln 105857, Col 0)
function NH3(A, q) {
    return AI6(A, q).split(`
`)
}
// @from(Ln 105862, Col 0)
function VH3(A, q) {
    let K = q.length,
        Y = (A % K + K) % K;
    return [...q.slice(Y), ...q.slice(0, Y)]
}
// @from(Ln 105868, Col 0)
function IY7({
    items: A,
    width: q,
    renderItem: K,
    active: Y,
    position: z,
    pageSize: _
}) {
    let w = A.map((X, P) => ({
            item: X,
            index: P,
            isActive: P === Y
        })),
        O = VH3(Y - z, w).slice(0, _),
        $ = (X) => O[X] == null ? [] : NH3(K(O[X]), q),
        H = Array.from({
            length: _
        }),
        j = $(z).slice(0, _),
        J = z + j.length <= _ ? z : _ - j.length;
    H.splice(J, j.length, ...j);
    let M = J + j.length,
        D = z + 1;
    while (M < _ && D < O.length) {
        for (let X of $(D))
            if (H[M++] = X, M >= _) break;
        D++
    }
    M = J - 1, D = z - 1;
    while (M >= 0 && D >= 0) {
        for (let X of $(D).reverse())
            if (H[M--] = X, M < 0) break;
        D--
    }
    return H.filter((X) => typeof X === "string")
}
// @from(Ln 105904, Col 4)
bY7 = E(() => {
    E91()
})
// @from(Ln 105908, Col 0)
function xY7({
    active: A,
    pageSize: q,
    total: K
}) {
    let Y = Math.floor(q / 2);
    if (K <= q || A < Y) return A;
    if (A >= K - Y) return A + q - K;
    return Y
}
// @from(Ln 105919, Col 0)
function uY7({
    active: A,
    lastActive: q,
    total: K,
    pageSize: Y,
    pointer: z
}) {
    if (K <= Y) return A;
    if (q < A && A - q < Y) return Math.min(Math.floor(Y / 2), z + A - q);
    return z
}
// @from(Ln 105931, Col 0)
function x38({
    items: A,
    active: q,
    renderItem: K,
    pageSize: Y,
    loop: z = !0
}) {
    let _ = xo({
            position: 0,
            lastActive: 0
        }),
        w = z ? uY7({
            active: q,
            lastActive: _.current.lastActive,
            total: A.length,
            pageSize: Y,
            pointer: _.current.position
        }) : xY7({
            active: q,
            total: A.length,
            pageSize: Y
        });
    return _.current.position = w, _.current.lastActive = q, IY7({
        items: A,
        width: k91(),
        renderItem: K,
        active: q,
        position: w,
        pageSize: Y
    }).join(`
`)
}
// @from(Ln 105963, Col 4)
mY7 = E(() => {
    v91();
    E91();
    bY7()
})
// @from(Ln 105968, Col 4)
FY7 = x((QG_, gY7) => {
    var kH3 = x6("stream");
    class BY7 extends kH3 {
        #A = null;
        constructor(A = {}) {
            super(A);
            this.writable = this.readable = !0, this.muted = !1, this.on("pipe", this._onpipe), this.replace = A.replace, this._prompt = A.prompt || null, this._hadControl = !1
        }
        #q(A, q) {
            if (this._dest) return this._dest[A];
            if (this._src) return this._src[A];
            return q
        }
        #K(A, ...q) {
            if (typeof this._dest?.[A] === "function") this._dest[A](...q);
            if (typeof this._src?.[A] === "function") this._src[A](...q)
        }
        get isTTY() {
            if (this.#A !== null) return this.#A;
            return this.#q("isTTY", !1)
        }
        set isTTY(A) {
            this.#A = A
        }
        get rows() {
            return this.#q("rows")
        }
        get columns() {
            return this.#q("columns")
        }
        mute() {
            this.muted = !0
        }
        unmute() {
            this.muted = !1
        }
        _onpipe(A) {
            this._src = A
        }
        pipe(A, q) {
            return this._dest = A, super.pipe(A, q)
        }
        pause() {
            if (this._src) return this._src.pause()
        }
        resume() {
            if (this._src) return this._src.resume()
        }
        write(A) {
            if (this.muted) {
                if (!this.replace) return !0;
                if (A.match(/^\u001b/)) {
                    if (A.indexOf(this._prompt) === 0) A = A.slice(this._prompt.length), A = A.replace(/./g, this.replace), A = this._prompt + A;
                    return this._hadControl = !0, this.emit("data", A)
                } else {
                    if (this._prompt && this._hadControl && A.indexOf(this._prompt) === 0) this._hadControl = !1, this.emit("data", this._prompt), A = A.slice(this._prompt.length);
                    A = A.toString().replace(/./g, this.replace)
                }
            }
            this.emit("data", A)
        }
        end(A) {
            if (this.muted)
                if (A && this.replace) A = A.toString().replace(/./g, this.replace);
                else A = null;
            if (A) this.emit("data", A);
            this.emit("end")
        }
        destroy(...A) {
            return this.#K("destroy", ...A)
        }
        destroySoon(...A) {
            return this.#K("destroySoon", ...A)
        }
        close(...A) {
            return this.#K("close", ...A)
        }
    }
    gY7.exports = BY7
})
// @from(Ln 106048, Col 4)
QY7 = x((EH3, u38) => {
    var zY = EH3;
    EH3.default = zY;
    var m_ = "\x1B[",
        qI6 = "\x1B]",
        mJ6 = "\x07",
        y91 = ";",
        pY7 = process.env.TERM_PROGRAM === "Apple_Terminal";
    zY.cursorTo = (A, q) => {
        if (typeof A !== "number") throw TypeError("The `x` argument is required");
        if (typeof q !== "number") return m_ + (A + 1) + "G";
        return m_ + (q + 1) + ";" + (A + 1) + "H"
    };
    zY.cursorMove = (A, q) => {
        if (typeof A !== "number") throw TypeError("The `x` argument is required");
        let K = "";
        if (A < 0) K += m_ + -A + "D";
        else if (A > 0) K += m_ + A + "C";
        if (q < 0) K += m_ + -q + "A";
        else if (q > 0) K += m_ + q + "B";
        return K
    };
    zY.cursorUp = (A = 1) => m_ + A + "A";
    zY.cursorDown = (A = 1) => m_ + A + "B";
    zY.cursorForward = (A = 1) => m_ + A + "C";
    zY.cursorBackward = (A = 1) => m_ + A + "D";
    zY.cursorLeft = m_ + "G";
    zY.cursorSavePosition = pY7 ? "\x1B7" : m_ + "s";
    zY.cursorRestorePosition = pY7 ? "\x1B8" : m_ + "u";
    zY.cursorGetPosition = m_ + "6n";
    zY.cursorNextLine = m_ + "E";
    zY.cursorPrevLine = m_ + "F";
    zY.cursorHide = m_ + "?25l";
    zY.cursorShow = m_ + "?25h";
    zY.eraseLines = (A) => {
        let q = "";
        for (let K = 0; K < A; K++) q += zY.eraseLine + (K < A - 1 ? zY.cursorUp() : "");
        if (A) q += zY.cursorLeft;
        return q
    };
    zY.eraseEndLine = m_ + "K";
    zY.eraseStartLine = m_ + "1K";
    zY.eraseLine = m_ + "2K";
    zY.eraseDown = m_ + "J";
    zY.eraseUp = m_ + "1J";
    zY.eraseScreen = m_ + "2J";
    zY.scrollUp = m_ + "S";
    zY.scrollDown = m_ + "T";
    zY.clearScreen = "\x1Bc";
    zY.clearTerminal = process.platform === "win32" ? `${zY.eraseScreen}${m_}0f` : `${zY.eraseScreen}${m_}3J${m_}H`;
    zY.beep = mJ6;
    zY.link = (A, q) => {
        return [qI6, "8", y91, y91, q, mJ6, A, qI6, "8", y91, y91, mJ6].join("")
    };
    zY.image = (A, q = {}) => {
        let K = `${qI6}1337;File=inline=1`;
        if (q.width) K += `;width=${q.width}`;
        if (q.height) K += `;height=${q.height}`;
        if (q.preserveAspectRatio === !1) K += ";preserveAspectRatio=0";
        return K + ":" + A.toString("base64") + mJ6
    };
    zY.iTerm = {
        setCwd: (A = process.cwd()) => `${qI6}50;CurrentDir=${A}${mJ6}`,
        annotation: (A, q = {}) => {
            let K = `${qI6}1337;`,
                Y = typeof q.x < "u",
                z = typeof q.y < "u";
            if ((Y || z) && !(Y && z && typeof q.length < "u")) throw Error("`x`, `y` and `length` must be defined when `x` or `y` is defined");
            if (A = A.replace(/\|/g, ""), K += q.isHidden ? "AddHiddenAnnotation=" : "AddAnnotation=", q.length > 0) K += (Y ? [A, q.length, q.x, q.y] : [q.length, A]).join("|");
            else K += A;
            return K + mJ6
        }
    }
})
// @from(Ln 106123, Col 0)
function dY7(A) {
    return A > 0 ? uo.default.cursorDown(A) : ""
}
// @from(Ln 106126, Col 0)
class L91 {
    rl;
    height = 0;
    extraLinesUnderPrompt = 0;
    cursorPos;
    constructor(A) {
        this.rl = A, this.rl = A, this.cursorPos = A.getCursorPos()
    }
    write(A) {
        this.rl.output.unmute(), this.rl.output.write(A), this.rl.output.mute()
    }
    render(A, q = "") {
        let K = LH3(A),
            Y = cY7.default(K),
            z = Y;
        if (this.rl.line.length > 0) z = z.slice(0, -this.rl.line.length);
        this.rl.setPrompt(z), this.cursorPos = this.rl.getCursorPos();
        let _ = k91();
        if (A = AI6(A, _), q = AI6(q, _), Y.length % _ === 0) A += `
`;
        let w = A + (q ? `
` + q : ""),
            $ = Math.floor(Y.length / _) - this.cursorPos.rows + (q ? UY7(q) : 0);
        if ($ > 0) w += uo.default.cursorUp($);
        w += uo.default.cursorTo(this.cursorPos.cols), this.write(dY7(this.extraLinesUnderPrompt) + uo.default.eraseLines(this.height) + w), this.extraLinesUnderPrompt = $, this.height = UY7(w)
    }
    checkCursorPos() {
        let A = this.rl.getCursorPos();
        if (A.cols !== this.cursorPos.cols) this.write(uo.default.cursorTo(A.cols)), this.cursorPos = A
    }
    done({
        clearContent: A
    }) {
        this.rl.setPrompt("");
        let q = dY7(this.extraLinesUnderPrompt);
        q += A ? uo.default.eraseLines(this.height) : `
`, q += uo.default.cursorShow, this.write(q), this.rl.close()
    }
}
// @from(Ln 106165, Col 4)
cY7
// @from(Ln 106165, Col 9)
uo
// @from(Ln 106165, Col 13)
UY7 = (A) => A.split(`
`).length
// @from(Ln 106167, Col 4)
LH3 = (A) => A.split(`
`).pop() ?? ""
// @from(Ln 106169, Col 4)
lY7 = E(() => {
    E91();
    cY7 = t(L38(), 1), uo = t(QY7(), 1)
})
// @from(Ln 106173, Col 4)
m38
// @from(Ln 106174, Col 4)
iY7 = E(() => {
    m38 = class m38 extends Promise {
        static withResolver() {
            let A, q;
            return {
                promise: new Promise((Y, z) => {
                    A = Y, q = z
                }),
                resolve: A,
                reject: q
            }
        }
    }
})
// @from(Ln 106193, Col 0)
function a46(A) {
    return (K, Y = {}) => {
        let {
            input: z = process.stdin,
            signal: _
        } = Y, w = new Set, O = new rY7.default;
        O.pipe(Y.output ?? process.stdout);
        let $ = nY7.createInterface({
                terminal: !0,
                input: z,
                output: O
            }),
            H = new L91($),
            {
                promise: j,
                resolve: J,
                reject: M
            } = m38.withResolver(),
            D = () => M(new f38);
        if (_) {
            let P = () => M(new G38({
                cause: _.reason
            }));
            if (_.aborted) return P(), Object.assign(j, {
                cancel: D
            });
            _.addEventListener("abort", P), w.add(() => _.removeEventListener("abort", P))
        }
        w.add(sn((P, W) => {
            M(new T38(`User force closed the prompt with ${P} ${W}`))
        }));
        let X = () => H.checkCursorPos();
        return $.input.on("keypress", X), w.add(() => $.input.removeListener("keypress", X)), U97($, (P) => {
            let W = RH3.bind(() => l46.clearAll());
            return $.on("close", W), w.add(() => $.removeListener("close", W)), P(() => {
                try {
                    let Z = A(K, (v) => {
                            setImmediate(() => J(v))
                        }),
                        [G, f] = typeof Z === "string" ? [Z] : Z;
                    H.render(G, f), l46.run()
                } catch (Z) {
                    M(Z)
                }
            }), Object.assign(j.then((Z) => {
                return l46.clearAll(), Z
            }, (Z) => {
                throw l46.clearAll(), Z
            }).finally(() => {
                w.forEach((Z) => Z()), H.done({
                    clearContent: Boolean(Y?.clearPromptOnDone)
                }), O.end()
            }).then(() => j), {
                cancel: D
            })
        })
    }
}
// @from(Ln 106251, Col 4)
rY7
// @from(Ln 106252, Col 4)
oY7 = E(() => {
    HL6();
    lY7();
    iY7();
    i46();
    W91();
    rY7 = t(FY7(), 1)
})
// @from(Ln 106260, Col 0)
class s46 {
    separator = aY7.default.dim(Array.from({
        length: 15
    }).join(IJ6.line));
    type = "separator";
    constructor(A) {
        if (A) this.separator = A
    }
    static isSeparator(A) {
        return Boolean(A && typeof A === "object" && "type" in A && A.type === "separator")
    }
}
// @from(Ln 106272, Col 4)
aY7
// @from(Ln 106273, Col 4)
sY7 = E(() => {
    T91();
    aY7 = t(f91(), 1)
})
// @from(Ln 106277, Col 4)
R91 = E(() => {
    t97();
    Z91();
    G91();
    e97();
    v91();
    AY7();
    k38();
    mY7();
    oY7();
    sY7();
    W91()
})
// @from(Ln 106290, Col 4)
B_
// @from(Ln 106291, Col 4)
tY7 = E(() => {
    R91();
    B_ = a46((A, q) => {
        let {
            transformer: K = (M) => M ? "yes" : "no"
        } = A, [Y, z] = CP("idle"), [_, w] = CP(""), O = iQ(A.theme), $ = r46({
            status: Y,
            theme: O
        });
        o46((M, D) => {
            if (SJ6(M)) {
                let X = A.default !== !1;
                if (/^(y|yes)/i.test(_)) X = !0;
                else if (/^(n|no)/i.test(_)) X = !1;
                w(K(X)), z("done"), q(X)
            } else w(D.line)
        });
        let H = _,
            j = "";
        if (Y === "done") H = O.style.answer(_);
        else j = ` ${O.style.defaultAnswer(A.default===!1?"y/N":"Y/n")}`;
        let J = O.style.message(A.message, Y);
        return `${$} ${J}${j} ${H}`
    })
})
// @from(Ln 106316, Col 4)
hY
// @from(Ln 106317, Col 4)
eY7 = E(() => {
    R91();
    hY = a46((A, q) => {
        let {
            required: K,
            validate: Y = () => !0
        } = A, z = iQ(A.theme), [_, w] = CP("idle"), [O = "", $] = CP(A.default), [H, j] = CP(), [J, M] = CP(""), D = r46({
            status: _,
            theme: z
        });
        o46(async (G, f) => {
            if (_ !== "idle") return;
            if (SJ6(G)) {
                let v = J || O;
                w("loading");
                let N = K && !v ? "You must provide a value" : await Y(v);
                if (N === !0) M(v), w("done"), q(v);
                else f.write(J), j(N || "You must provide a valid value"), w("idle")
            } else if (P91(G) && !J) $(void 0);
            else if (G.name === "tab" && !J) $(void 0), f.clearLine(0), f.write(O), M(O);
            else M(f.line), j(void 0)
        });
        let X = z.style.message(A.message, _),
            P = J;
        if (typeof A.transformer === "function") P = A.transformer(J, {
            isFinal: _ === "done"
        });
        else if (_ === "done") P = z.style.answer(J);
        let W;
        if (O && _ !== "done" && !J) W = z.style.defaultAnswer(O);
        let Z = "";
        if (H) Z = z.style.error(H);
        return [
            [D, X, W, P].filter((G) => G !== void 0).join(" "), Z
        ]
    })
})
// @from(Ln 106354, Col 4)
qz7 = x((hH3, B38) => {
    var _Y = hH3;
    hH3.default = _Y;
    var g_ = "\x1B[",
        KI6 = "\x1B]",
        BJ6 = "\x07",
        h91 = ";",
        Az7 = process.env.TERM_PROGRAM === "Apple_Terminal";
    _Y.cursorTo = (A, q) => {
        if (typeof A !== "number") throw TypeError("The `x` argument is required");
        if (typeof q !== "number") return g_ + (A + 1) + "G";
        return g_ + (q + 1) + ";" + (A + 1) + "H"
    };
    _Y.cursorMove = (A, q) => {
        if (typeof A !== "number") throw TypeError("The `x` argument is required");
        let K = "";
        if (A < 0) K += g_ + -A + "D";
        else if (A > 0) K += g_ + A + "C";
        if (q < 0) K += g_ + -q + "A";
        else if (q > 0) K += g_ + q + "B";
        return K
    };
    _Y.cursorUp = (A = 1) => g_ + A + "A";
    _Y.cursorDown = (A = 1) => g_ + A + "B";
    _Y.cursorForward = (A = 1) => g_ + A + "C";
    _Y.cursorBackward = (A = 1) => g_ + A + "D";
    _Y.cursorLeft = g_ + "G";
    _Y.cursorSavePosition = Az7 ? "\x1B7" : g_ + "s";
    _Y.cursorRestorePosition = Az7 ? "\x1B8" : g_ + "u";
    _Y.cursorGetPosition = g_ + "6n";
    _Y.cursorNextLine = g_ + "E";
    _Y.cursorPrevLine = g_ + "F";
    _Y.cursorHide = g_ + "?25l";
    _Y.cursorShow = g_ + "?25h";
    _Y.eraseLines = (A) => {
        let q = "";
        for (let K = 0; K < A; K++) q += _Y.eraseLine + (K < A - 1 ? _Y.cursorUp() : "");
        if (A) q += _Y.cursorLeft;
        return q
    };
    _Y.eraseEndLine = g_ + "K";
    _Y.eraseStartLine = g_ + "1K";
    _Y.eraseLine = g_ + "2K";
    _Y.eraseDown = g_ + "J";
    _Y.eraseUp = g_ + "1J";
    _Y.eraseScreen = g_ + "2J";
    _Y.scrollUp = g_ + "S";
    _Y.scrollDown = g_ + "T";
    _Y.clearScreen = "\x1Bc";
    _Y.clearTerminal = process.platform === "win32" ? `${_Y.eraseScreen}${g_}0f` : `${_Y.eraseScreen}${g_}3J${g_}H`;
    _Y.beep = BJ6;
    _Y.link = (A, q) => {
        return [KI6, "8", h91, h91, q, BJ6, A, KI6, "8", h91, h91, BJ6].join("")
    };
    _Y.image = (A, q = {}) => {
        let K = `${KI6}1337;File=inline=1`;
        if (q.width) K += `;width=${q.width}`;
        if (q.height) K += `;height=${q.height}`;
        if (q.preserveAspectRatio === !1) K += ";preserveAspectRatio=0";
        return K + ":" + A.toString("base64") + BJ6
    };
    _Y.iTerm = {
        setCwd: (A = process.cwd()) => `${KI6}50;CurrentDir=${A}${BJ6}`,
        annotation: (A, q = {}) => {
            let K = `${KI6}1337;`,
                Y = typeof q.x < "u",
                z = typeof q.y < "u";
            if ((Y || z) && !(Y && z && typeof q.length < "u")) throw Error("`x`, `y` and `length` must be defined when `x` or `y` is defined");
            if (A = A.replace(/\|/g, ""), K += q.isHidden ? "AddHiddenAnnotation=" : "AddAnnotation=", q.length > 0) K += (Y ? [A, q.length, q.x, q.y] : [q.length, A]).join("|");
            else K += A;
            return K + BJ6
        }
    }
})
// @from(Ln 106429, Col 0)
function gJ6(A) {
    return !s46.isSeparator(A) && !A.disabled
}
// @from(Ln 106433, Col 0)
function IH3(A) {
    return A.map((q) => {
        if (s46.isSeparator(q)) return q;
        if (typeof q === "string") return {
            value: q,
            name: q,
            short: q,
            disabled: !1
        };
        let K = q.name ?? String(q.value);
        return {
            value: q.value,
            name: K,
            description: q.description,
            short: q.short ?? K,
            disabled: q.disabled ?? !1
        }
    })
}
// @from(Ln 106452, Col 4)
g38
// @from(Ln 106452, Col 9)
Kz7
// @from(Ln 106452, Col 14)
CH3
// @from(Ln 106452, Col 19)
S91
// @from(Ln 106453, Col 4)
Yz7 = E(() => {
    R91();
    T91();
    g38 = t(f91(), 1), Kz7 = t(qz7(), 1), CH3 = {
        icon: {
            cursor: IJ6.pointer
        },
        style: {
            disabled: (A) => g38.default.dim(`- ${A}`),
            description: (A) => g38.default.cyan(A)
        },
        helpMode: "auto"
    };
    S91 = a46((A, q) => {
        let {
            loop: K = !0,
            pageSize: Y = 7
        } = A, z = xo(!0), _ = iQ(CH3, A.theme), [w, O] = CP("idle"), $ = r46({
            status: w,
            theme: _
        }), H = xo(), j = sC6(() => IH3(A.choices), [A.choices]), J = sC6(() => {
            let N = j.findIndex(gJ6),
                V = j.findLastIndex(gJ6);
            if (N < 0) throw new aC6("[select prompt] No selectable choices. All choices are disabled.");
            return {
                first: N,
                last: V
            }
        }, [j]), M = sC6(() => {
            if (!("default" in A)) return -1;
            return j.findIndex((N) => gJ6(N) && N.value === A.default)
        }, [A.default, j]), [D, X] = CP(M === -1 ? J.first : M), P = j[D];
        o46((N, V) => {
            if (clearTimeout(H.current), SJ6(N)) O("done"), q(P.value);
            else if (X91(N) || Z38(N)) {
                if (V.clearLine(0), K || X91(N) && D !== J.first || Z38(N) && D !== J.last) {
                    let L = X91(N) ? -1 : 1,
                        h = D;
                    do h = (h + L + j.length) % j.length; while (!gJ6(j[h]));
                    X(h)
                }
            } else if (p97(N)) {
                V.clearLine(0);
                let L = Number(N.name) - 1,
                    h = j[L];
                if (h != null && gJ6(h)) X(L)
            } else if (P91(N)) V.clearLine(0);
            else {
                let L = V.line.toLowerCase(),
                    h = j.findIndex((R) => {
                        if (s46.isSeparator(R) || !gJ6(R)) return !1;
                        return R.name.toLowerCase().startsWith(L)
                    });
                if (h >= 0) X(h);
                H.current = setTimeout(() => {
                    V.clearLine(0)
                }, 700)
            }
        }), n46(() => () => {
            clearTimeout(H.current)
        }, []);
        let W = _.style.message(A.message, w),
            Z = "",
            G = "";
        if (_.helpMode === "always" || _.helpMode === "auto" && z.current)
            if (z.current = !1, j.length > Y) G = `
${_.style.help("(Use arrow keys to reveal more choices)")}`;
            else Z = _.style.help("(Use arrow keys)");
        let f = x38({
            items: j,
            active: D,
            renderItem({
                item: N,
                isActive: V
            }) {
                if (s46.isSeparator(N)) return ` ${N.separator}`;
                if (N.disabled) {
                    let R = typeof N.disabled === "string" ? N.disabled : "(disabled)";
                    return _.style.disabled(`${N.name} ${R}`)
                }
                let L = V ? _.style.highlight : (R) => R,
                    h = V ? _.icon.cursor : " ";
                return L(`${h} ${N.name}`)
            },
            pageSize: Y,
            loop: K
        });
        if (w === "done") return `${$} ${W} ${_.style.answer(P.short)}`;
        let v = P.description ? `
${_.style.description(P.description)}` : "";
        return `${[$,W,Z].filter(Boolean).join(" ")}
${f}${G}${v}${Kz7.default.cursorHide}`
    })
})
// @from(Ln 106547, Col 4)
F38 = E(() => {
    tY7();
    eY7();
    Yz7()
})
// @from(Ln 106552, Col 4)
t46 = E(() => {
    mQ1();
    mQ1()
})
// @from(Ln 106556, Col 4)
e46 = "0.2"
// @from(Ln 106557, Col 4)
p38
// @from(Ln 106557, Col 9)
_z7
// @from(Ln 106557, Col 14)
wz7
// @from(Ln 106557, Col 19)
Oz7
// @from(Ln 106557, Col 24)
$z7
// @from(Ln 106557, Col 29)
Hz7
// @from(Ln 106557, Col 34)
jz7
// @from(Ln 106557, Col 39)
Jz7
// @from(Ln 106557, Col 44)
Mz7
// @from(Ln 106557, Col 49)
Dz7
// @from(Ln 106557, Col 54)
bH3
// @from(Ln 106557, Col 59)
YI6
// @from(Ln 106557, Col 64)
xH3