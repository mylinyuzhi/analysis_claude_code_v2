
// @from(Ln 39598, Col 0)
function RjA(A) {
    if (!A.includes("\\")) return A;
    try {
        return JSON.parse(`"${A}"`)
    } catch {
        return A
    }
}
// @from(Ln 39607, Col 0)
function dL6(A, q) {
    let K = [`"${q}":"`, `"${q}": "`];
    for (let Y of K) {
        let z = A.indexOf(Y);
        if (z < 0) continue;
        let _ = z + Y.length,
            w = _;
        while (w < A.length) {
            if (A[w] === "\\") {
                w += 2;
                continue
            }
            if (A[w] === '"') return RjA(A.slice(_, w));
            w++
        }
    }
    return
}
// @from(Ln 39626, Col 0)
function ET(A, q) {
    let K = [`"${q}":"`, `"${q}": "`],
        Y;
    for (let z of K) {
        let _ = 0;
        while (!0) {
            let w = A.indexOf(z, _);
            if (w < 0) break;
            let O = w + z.length,
                $ = O;
            while ($ < A.length) {
                if (A[$] === "\\") {
                    $ += 2;
                    continue
                }
                if (A[$] === '"') {
                    Y = RjA(A.slice(O, $));
                    break
                }
                $++
            }
            _ = $ + 1
        }
    }
    return Y
}
// @from(Ln 39652, Col 0)
async function hjA(A, q, K) {
    try {
        let Y = await LjA(A, "r");
        try {
            let z = await Y.read(K, 0, wr, 0);
            if (z.bytesRead === 0) return {
                head: "",
                tail: ""
            };
            let _ = K.toString("utf8", 0, z.bytesRead),
                w = Math.max(0, q - wr),
                O = w === 0 ? _ : await (async () => {
                    let $ = await Y.read(K, 0, wr, w);
                    return K.toString("utf8", 0, $.bytesRead)
                })();
            return {
                head: _,
                tail: O
            }
        } finally {
            await Y.close()
        }
    } catch {
        return {
            head: "",
            tail: ""
        }
    }
}
// @from(Ln 39682, Col 0)
function xOK(A) {
    let q = 0;
    for (let K = 0; K < A.length; K++) {
        let Y = A.charCodeAt(K);
        q = (q << 5) - q + Y, q |= 0
    }
    return Math.abs(q).toString(36)
}
// @from(Ln 39691, Col 0)
function BD(A) {
    let q = A.replace(/[^a-zA-Z0-9]/g, "-");
    if (q.length <= EjA) return q;
    let K = typeof Bun < "u" ? Bun.hash(A).toString(36) : xOK(A);
    return `${q.slice(0,EjA)}-${K}`
}
// @from(Ln 39698, Col 0)
function SjA() {
    return bOK(c8(), "projects")
}
// @from(Ln 39702, Col 0)
function IjA(A) {
    try {
        let q = JSON.parse(A);
        if (q.type !== "system" || q.subtype !== "compact_boundary") return null;
        return {
            hasPreservedSegment: Boolean(q.compactMetadata?.preservedSegment)
        }
    } catch {
        return null
    }
}
// @from(Ln 39714, Col 0)
function mOK(A) {
    let q = Buffer.from('"compact_boundary"'),
        K = 10,
        Y = A.lastIndexOf(q);
    while (Y >= 0) {
        let z = A.lastIndexOf(10, Y) + 1,
            _ = A.indexOf(10, Y);
        if (_ === -1) _ = A.length;
        let w = IjA(A.toString("utf-8", z, _));
        if (w) return {
            lineStart: z,
            ...w
        };
        Y = Y > 0 ? A.lastIndexOf(q, Y - 1) : -1
    }
    return {
        lineStart: -1,
        hasPreservedSegment: !1
    }
}
// @from(Ln 39734, Col 0)
async function F81(A, q) {
    if (q <= yjA) {
        let J = await IOK(A),
            M = mOK(J);
        if (M.lineStart < 0 || M.hasPreservedSegment) return {
            boundaryStartOffset: 0,
            postBoundaryBuf: J
        };
        return {
            boundaryStartOffset: M.lineStart,
            postBoundaryBuf: Buffer.from(J.subarray(M.lineStart))
        }
    }
    let K = Buffer.from('"compact_boundary"'),
        Y = 10,
        z = 1024,
        _ = yjA,
        w = Buffer.allocUnsafe(_),
        O = _,
        $ = q,
        H = _,
        j = await LjA(A, "r");
    try {
        while (O > 0) {
            let J = Math.min(uOK, O),
                M = O - J,
                D = $ - J,
                X = M,
                P = J,
                W = D;
            while (P > 0) {
                let {
                    bytesRead: N
                } = await j.read(w, X, P, W);
                if (N === 0) break;
                X += N, P -= N, W += N
            }
            O = M, $ = D;
            let Z = w.subarray(O),
                G = Math.min(H + z - O, Z.length),
                f = Z.subarray(0, G);
            H = O;
            let v = f.lastIndexOf(K);
            while (v >= 0) {
                let N = Z.lastIndexOf(Y, v) + 1;
                if (N === 0 && $ > 0) break;
                let V = Z.indexOf(Y, v);
                if (V === -1) V = Z.length;
                let L = IjA(Z.toString("utf-8", N, V));
                if (L) {
                    if (L.hasPreservedSegment) return null;
                    return {
                        boundaryStartOffset: $ + N,
                        postBoundaryBuf: Buffer.from(Z.subarray(N))
                    }
                }
                v = v > 0 ? f.lastIndexOf(K, v - 1) : -1
            }
        }
        return null
    } finally {
        await j.close()
    }
}
// @from(Ln 39798, Col 4)
wr = 65536
// @from(Ln 39799, Col 4)
EjA = 200
// @from(Ln 39800, Col 4)
uOK = 1048576
// @from(Ln 39801, Col 4)
yjA = 67108864
// @from(Ln 39802, Col 4)
CjA = 5242880
// @from(Ln 39803, Col 4)
cL6 = E(() => {
    A8();
    xl1()
})
// @from(Ln 39818, Col 0)
function L4(A, q) {
    let K = q ?? G1() ?? $1().cwd();
    if (typeof A !== "string") throw TypeError(`Path must be a string, received ${typeof A}`);
    if (typeof K !== "string") throw TypeError(`Base directory must be a string, received ${typeof K}`);
    if (A.includes("\x00") || K.includes("\x00")) throw Error("Path contains null bytes");
    let Y = A.trim();
    if (!Y) return ul1(K).normalize("NFC");
    if (Y === "~") return bjA().normalize("NFC");
    if (Y.startsWith("~/")) return gOK(bjA(), Y.slice(2)).normalize("NFC");
    let z = Y;
    if (y8() === "windows" && Y.match(/^\/[a-z]\//i)) try {
        z = tA6(Y)
    } catch {
        z = Y
    }
    if (BOK(z)) return ul1(z).normalize("NFC");
    return FOK(K, z).normalize("NFC")
}
// @from(Ln 39837, Col 0)
function dp(A) {
    let q = L4(A);
    if (q.startsWith("\\\\") || q.startsWith("//")) return xjA(q);
    try {
        if ($1().statSync(q).isDirectory()) return q
    } catch {}
    return xjA(q)
}
// @from(Ln 39846, Col 0)
function Or(A) {
    return /(?:^|[\\/])\.\.(?:[\\/]|$)/.test(A)
}
// @from(Ln 39850, Col 0)
function lL6(A) {
    return ul1(A).replace(/\\/g, "/")
}
// @from(Ln 39853, Col 4)
F9 = E(() => {
    lA();
    SA();
    YK();
    lx();
    cL6()
})
// @from(Ln 39861, Col 0)
function $r(A, q) {
    return A instanceof Error && A.message === q
}
// @from(Ln 39865, Col 0)
function _1(A) {
    return A instanceof Error ? A.message : String(A)
}
// @from(Ln 39868, Col 4)
iL6
// @from(Ln 39868, Col 9)
ix
// @from(Ln 39868, Col 13)
oY
// @from(Ln 39868, Col 17)
MG
// @from(Ln 39868, Col 21)
uS
// @from(Ln 39868, Col 25)
yM
// @from(Ln 39868, Col 29)
EV
// @from(Ln 39869, Col 4)
s8 = E(() => {
    iL6 = class iL6 extends Error {
        constructor(A) {
            super(A);
            this.name = this.constructor.name
        }
    };
    ix = class ix extends Error {};
    oY = class oY extends Error {
        constructor(A) {
            super(A);
            this.name = "AbortError"
        }
    };
    MG = class MG extends Error {
        filePath;
        defaultConfig;
        constructor(A, q, K) {
            super(A);
            this.name = "ConfigParseError", this.filePath = q, this.defaultConfig = K
        }
    };
    uS = class uS extends Error {
        stdout;
        stderr;
        code;
        interrupted;
        constructor(A, q, K, Y) {
            super("Shell command failed");
            this.stdout = A;
            this.stderr = q;
            this.code = K;
            this.interrupted = Y;
            this.name = "ShellError"
        }
    };
    yM = class yM extends Error {
        formattedMessage;
        constructor(A, q) {
            super(A);
            this.formattedMessage = q;
            this.name = "TeleportOperationError"
        }
    };
    EV = class EV extends Error {
        telemetryMessage;
        constructor(A, q) {
            super(A);
            this.name = "TelemetrySafeError", this.telemetryMessage = q ?? A
        }
    }
})
// @from(Ln 39921, Col 4)
mjA = x((Jaz, ujA) => {
    var Hr = x6("constants"),
        pOK = process.cwd,
        p81 = null,
        QOK = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
        if (!p81) p81 = pOK.call(process);
        return p81
    };
    try {
        process.cwd()
    } catch (A) {}
    if (typeof process.chdir === "function") {
        if (Q81 = process.chdir, process.chdir = function(A) {
                p81 = null, Q81.call(process, A)
            }, Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, Q81)
    }
    var Q81;
    ujA.exports = UOK;

    function UOK(A) {
        if (Hr.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) q(A);
        if (!A.lutimes) K(A);
        if (A.chown = _(A.chown), A.fchown = _(A.fchown), A.lchown = _(A.lchown), A.chmod = Y(A.chmod), A.fchmod = Y(A.fchmod), A.lchmod = Y(A.lchmod), A.chownSync = w(A.chownSync), A.fchownSync = w(A.fchownSync), A.lchownSync = w(A.lchownSync), A.chmodSync = z(A.chmodSync), A.fchmodSync = z(A.fchmodSync), A.lchmodSync = z(A.lchmodSync), A.stat = O(A.stat), A.fstat = O(A.fstat), A.lstat = O(A.lstat), A.statSync = $(A.statSync), A.fstatSync = $(A.fstatSync), A.lstatSync = $(A.lstatSync), A.chmod && !A.lchmod) A.lchmod = function(j, J, M) {
            if (M) process.nextTick(M)
        }, A.lchmodSync = function() {};
        if (A.chown && !A.lchown) A.lchown = function(j, J, M, D) {
            if (D) process.nextTick(D)
        }, A.lchownSync = function() {};
        if (QOK === "win32") A.rename = typeof A.rename !== "function" ? A.rename : function(j) {
            function J(M, D, X) {
                var P = Date.now(),
                    W = 0;
                j(M, D, function Z(G) {
                    if (G && (G.code === "EACCES" || G.code === "EPERM" || G.code === "EBUSY") && Date.now() - P < 60000) {
                        if (setTimeout(function() {
                                A.stat(D, function(f, v) {
                                    if (f && f.code === "ENOENT") j(M, D, Z);
                                    else X(G)
                                })
                            }, W), W < 100) W += 10;
                        return
                    }
                    if (X) X(G)
                })
            }
            if (Object.setPrototypeOf) Object.setPrototypeOf(J, j);
            return J
        }(A.rename);
        A.read = typeof A.read !== "function" ? A.read : function(j) {
            function J(M, D, X, P, W, Z) {
                var G;
                if (Z && typeof Z === "function") {
                    var f = 0;
                    G = function(v, N, V) {
                        if (v && v.code === "EAGAIN" && f < 10) return f++, j.call(A, M, D, X, P, W, G);
                        Z.apply(this, arguments)
                    }
                }
                return j.call(A, M, D, X, P, W, G)
            }
            if (Object.setPrototypeOf) Object.setPrototypeOf(J, j);
            return J
        }(A.read), A.readSync = typeof A.readSync !== "function" ? A.readSync : function(j) {
            return function(J, M, D, X, P) {
                var W = 0;
                while (!0) try {
                    return j.call(A, J, M, D, X, P)
                } catch (Z) {
                    if (Z.code === "EAGAIN" && W < 10) {
                        W++;
                        continue
                    }
                    throw Z
                }
            }
        }(A.readSync);

        function q(j) {
            j.lchmod = function(J, M, D) {
                j.open(J, Hr.O_WRONLY | Hr.O_SYMLINK, M, function(X, P) {
                    if (X) {
                        if (D) D(X);
                        return
                    }
                    j.fchmod(P, M, function(W) {
                        j.close(P, function(Z) {
                            if (D) D(W || Z)
                        })
                    })
                })
            }, j.lchmodSync = function(J, M) {
                var D = j.openSync(J, Hr.O_WRONLY | Hr.O_SYMLINK, M),
                    X = !0,
                    P;
                try {
                    P = j.fchmodSync(D, M), X = !1
                } finally {
                    if (X) try {
                        j.closeSync(D)
                    } catch (W) {} else j.closeSync(D)
                }
                return P
            }
        }

        function K(j) {
            if (Hr.hasOwnProperty("O_SYMLINK") && j.futimes) j.lutimes = function(J, M, D, X) {
                j.open(J, Hr.O_SYMLINK, function(P, W) {
                    if (P) {
                        if (X) X(P);
                        return
                    }
                    j.futimes(W, M, D, function(Z) {
                        j.close(W, function(G) {
                            if (X) X(Z || G)
                        })
                    })
                })
            }, j.lutimesSync = function(J, M, D) {
                var X = j.openSync(J, Hr.O_SYMLINK),
                    P, W = !0;
                try {
                    P = j.futimesSync(X, M, D), W = !1
                } finally {
                    if (W) try {
                        j.closeSync(X)
                    } catch (Z) {} else j.closeSync(X)
                }
                return P
            };
            else if (j.futimes) j.lutimes = function(J, M, D, X) {
                if (X) process.nextTick(X)
            }, j.lutimesSync = function() {}
        }

        function Y(j) {
            if (!j) return j;
            return function(J, M, D) {
                return j.call(A, J, M, function(X) {
                    if (H(X)) X = null;
                    if (D) D.apply(this, arguments)
                })
            }
        }

        function z(j) {
            if (!j) return j;
            return function(J, M) {
                try {
                    return j.call(A, J, M)
                } catch (D) {
                    if (!H(D)) throw D
                }
            }
        }

        function _(j) {
            if (!j) return j;
            return function(J, M, D, X) {
                return j.call(A, J, M, D, function(P) {
                    if (H(P)) P = null;
                    if (X) X.apply(this, arguments)
                })
            }
        }

        function w(j) {
            if (!j) return j;
            return function(J, M, D) {
                try {
                    return j.call(A, J, M, D)
                } catch (X) {
                    if (!H(X)) throw X
                }
            }
        }

        function O(j) {
            if (!j) return j;
            return function(J, M, D) {
                if (typeof M === "function") D = M, M = null;

                function X(P, W) {
                    if (W) {
                        if (W.uid < 0) W.uid += 4294967296;
                        if (W.gid < 0) W.gid += 4294967296
                    }
                    if (D) D.apply(this, arguments)
                }
                return M ? j.call(A, J, M, X) : j.call(A, J, X)
            }
        }

        function $(j) {
            if (!j) return j;
            return function(J, M) {
                var D = M ? j.call(A, J, M) : j.call(A, J);
                if (D) {
                    if (D.uid < 0) D.uid += 4294967296;
                    if (D.gid < 0) D.gid += 4294967296
                }
                return D
            }
        }

        function H(j) {
            if (!j) return !0;
            if (j.code === "ENOSYS") return !0;
            var J = !process.getuid || process.getuid() !== 0;
            if (J) {
                if (j.code === "EINVAL" || j.code === "EPERM") return !0
            }
            return !1
        }
    }
})
// @from(Ln 40138, Col 4)
FjA = x((Maz, gjA) => {
    var BjA = x6("stream").Stream;
    gjA.exports = dOK;

    function dOK(A) {
        return {
            ReadStream: q,
            WriteStream: K
        };

        function q(Y, z) {
            if (!(this instanceof q)) return new q(Y, z);
            BjA.call(this);
            var _ = this;
            this.path = Y, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 65536, z = z || {};
            var w = Object.keys(z);
            for (var O = 0, $ = w.length; O < $; O++) {
                var H = w[O];
                this[H] = z[H]
            }
            if (this.encoding) this.setEncoding(this.encoding);
            if (this.start !== void 0) {
                if (typeof this.start !== "number") throw TypeError("start must be a Number");
                if (this.end === void 0) this.end = 1 / 0;
                else if (typeof this.end !== "number") throw TypeError("end must be a Number");
                if (this.start > this.end) throw Error("start must be <= end");
                this.pos = this.start
            }
            if (this.fd !== null) {
                process.nextTick(function() {
                    _._read()
                });
                return
            }
            A.open(this.path, this.flags, this.mode, function(j, J) {
                if (j) {
                    _.emit("error", j), _.readable = !1;
                    return
                }
                _.fd = J, _.emit("open", J), _._read()
            })
        }

        function K(Y, z) {
            if (!(this instanceof K)) return new K(Y, z);
            BjA.call(this), this.path = Y, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, z = z || {};
            var _ = Object.keys(z);
            for (var w = 0, O = _.length; w < O; w++) {
                var $ = _[w];
                this[$] = z[$]
            }
            if (this.start !== void 0) {
                if (typeof this.start !== "number") throw TypeError("start must be a Number");
                if (this.start < 0) throw Error("start must be >= zero");
                this.pos = this.start
            }
            if (this.busy = !1, this._queue = [], this.fd === null) this._open = A.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush()
        }
    }
})
// @from(Ln 40198, Col 4)
QjA = x((Daz, pjA) => {
    pjA.exports = lOK;
    var cOK = Object.getPrototypeOf || function(A) {
        return A.__proto__
    };

    function lOK(A) {
        if (A === null || typeof A !== "object") return A;
        if (A instanceof Object) var q = {
            __proto__: cOK(A)
        };
        else var q = Object.create(null);
        return Object.getOwnPropertyNames(A).forEach(function(K) {
            Object.defineProperty(q, K, Object.getOwnPropertyDescriptor(A, K))
        }), q
    }
})
// @from(Ln 40215, Col 4)
Y_ = x((Xaz, Fl1) => {
    var x$ = x6("fs"),
        iOK = mjA(),
        nOK = FjA(),
        rOK = QjA(),
        U81 = x6("util"),
        fP, c81;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") fP = Symbol.for("graceful-fs.queue"), c81 = Symbol.for("graceful-fs.previous");
    else fP = "___graceful-fs.queue", c81 = "___graceful-fs.previous";

    function oOK() {}

    function djA(A, q) {
        Object.defineProperty(A, fP, {
            get: function() {
                return q
            }
        })
    }
    var eA6 = oOK;
    if (U81.debuglog) eA6 = U81.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) eA6 = function() {
        var A = U81.format.apply(U81, arguments);
        A = "GFS4: " + A.split(/\n/).join(`
GFS4: `), console.error(A)
    };
    if (!x$[fP]) {
        if (ml1 = global[fP] || [], djA(x$, ml1), x$.close = function(A) {
                function q(K, Y) {
                    return A.call(x$, K, function(z) {
                        if (!z) UjA();
                        if (typeof Y === "function") Y.apply(this, arguments)
                    })
                }
                return Object.defineProperty(q, c81, {
                    value: A
                }), q
            }(x$.close), x$.closeSync = function(A) {
                function q(K) {
                    A.apply(x$, arguments), UjA()
                }
                return Object.defineProperty(q, c81, {
                    value: A
                }), q
            }(x$.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) process.on("exit", function() {
            eA6(x$[fP]), x6("assert").equal(x$[fP].length, 0)
        })
    }
    var ml1;
    if (!global[fP]) djA(global, x$[fP]);
    Fl1.exports = Bl1(rOK(x$));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !x$.__patched) Fl1.exports = Bl1(x$), x$.__patched = !0;

    function Bl1(A) {
        iOK(A), A.gracefulify = Bl1, A.createReadStream = N, A.createWriteStream = V;
        var q = A.readFile;
        A.readFile = K;

        function K(R, u, I) {
            if (typeof u === "function") I = u, u = null;
            return g(R, u, I);

            function g(B, b, p, Q) {
                return q(B, b, function(U) {
                    if (U && (U.code === "EMFILE" || U.code === "ENFILE")) m$6([g, [B, b, p], U, Q || Date.now(), Date.now()]);
                    else if (typeof p === "function") p.apply(this, arguments)
                })
            }
        }
        var Y = A.writeFile;
        A.writeFile = z;

        function z(R, u, I, g) {
            if (typeof I === "function") g = I, I = null;
            return B(R, u, I, g);

            function B(b, p, Q, U, r) {
                return Y(b, p, Q, function(e) {
                    if (e && (e.code === "EMFILE" || e.code === "ENFILE")) m$6([B, [b, p, Q, U], e, r || Date.now(), Date.now()]);
                    else if (typeof U === "function") U.apply(this, arguments)
                })
            }
        }
        var _ = A.appendFile;
        if (_) A.appendFile = w;

        function w(R, u, I, g) {
            if (typeof I === "function") g = I, I = null;
            return B(R, u, I, g);

            function B(b, p, Q, U, r) {
                return _(b, p, Q, function(e) {
                    if (e && (e.code === "EMFILE" || e.code === "ENFILE")) m$6([B, [b, p, Q, U], e, r || Date.now(), Date.now()]);
                    else if (typeof U === "function") U.apply(this, arguments)
                })
            }
        }
        var O = A.copyFile;
        if (O) A.copyFile = $;

        function $(R, u, I, g) {
            if (typeof I === "function") g = I, I = 0;
            return B(R, u, I, g);

            function B(b, p, Q, U, r) {
                return O(b, p, Q, function(e) {
                    if (e && (e.code === "EMFILE" || e.code === "ENFILE")) m$6([B, [b, p, Q, U], e, r || Date.now(), Date.now()]);
                    else if (typeof U === "function") U.apply(this, arguments)
                })
            }
        }
        var H = A.readdir;
        A.readdir = J;
        var j = /^v[0-5]\./;

        function J(R, u, I) {
            if (typeof u === "function") I = u, u = null;
            var g = j.test(process.version) ? function(p, Q, U, r) {
                return H(p, B(p, Q, U, r))
            } : function(p, Q, U, r) {
                return H(p, Q, B(p, Q, U, r))
            };
            return g(R, u, I);

            function B(b, p, Q, U) {
                return function(r, e) {
                    if (r && (r.code === "EMFILE" || r.code === "ENFILE")) m$6([g, [b, p, Q], r, U || Date.now(), Date.now()]);
                    else {
                        if (e && e.sort) e.sort();
                        if (typeof Q === "function") Q.call(this, r, e)
                    }
                }
            }
        }
        if (process.version.substr(0, 4) === "v0.8") {
            var M = nOK(A);
            Z = M.ReadStream, f = M.WriteStream
        }
        var D = A.ReadStream;
        if (D) Z.prototype = Object.create(D.prototype), Z.prototype.open = G;
        var X = A.WriteStream;
        if (X) f.prototype = Object.create(X.prototype), f.prototype.open = v;
        Object.defineProperty(A, "ReadStream", {
            get: function() {
                return Z
            },
            set: function(R) {
                Z = R
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(A, "WriteStream", {
            get: function() {
                return f
            },
            set: function(R) {
                f = R
            },
            enumerable: !0,
            configurable: !0
        });
        var P = Z;
        Object.defineProperty(A, "FileReadStream", {
            get: function() {
                return P
            },
            set: function(R) {
                P = R
            },
            enumerable: !0,
            configurable: !0
        });
        var W = f;
        Object.defineProperty(A, "FileWriteStream", {
            get: function() {
                return W
            },
            set: function(R) {
                W = R
            },
            enumerable: !0,
            configurable: !0
        });

        function Z(R, u) {
            if (this instanceof Z) return D.apply(this, arguments), this;
            else return Z.apply(Object.create(Z.prototype), arguments)
        }

        function G() {
            var R = this;
            h(R.path, R.flags, R.mode, function(u, I) {
                if (u) {
                    if (R.autoClose) R.destroy();
                    R.emit("error", u)
                } else R.fd = I, R.emit("open", I), R.read()
            })
        }

        function f(R, u) {
            if (this instanceof f) return X.apply(this, arguments), this;
            else return f.apply(Object.create(f.prototype), arguments)
        }

        function v() {
            var R = this;
            h(R.path, R.flags, R.mode, function(u, I) {
                if (u) R.destroy(), R.emit("error", u);
                else R.fd = I, R.emit("open", I)
            })
        }

        function N(R, u) {
            return new A.ReadStream(R, u)
        }

        function V(R, u) {
            return new A.WriteStream(R, u)
        }
        var L = A.open;
        A.open = h;

        function h(R, u, I, g) {
            if (typeof I === "function") g = I, I = null;
            return B(R, u, I, g);

            function B(b, p, Q, U, r) {
                return L(b, p, Q, function(e, Y6) {
                    if (e && (e.code === "EMFILE" || e.code === "ENFILE")) m$6([B, [b, p, Q, U], e, r || Date.now(), Date.now()]);
                    else if (typeof U === "function") U.apply(this, arguments)
                })
            }
        }
        return A
    }

    function m$6(A) {
        eA6("ENQUEUE", A[0].name, A[1]), x$[fP].push(A), gl1()
    }
    var d81;

    function UjA() {
        var A = Date.now();
        for (var q = 0; q < x$[fP].length; ++q)
            if (x$[fP][q].length > 2) x$[fP][q][3] = A, x$[fP][q][4] = A;
        gl1()
    }

    function gl1() {
        if (clearTimeout(d81), d81 = void 0, x$[fP].length === 0) return;
        var A = x$[fP].shift(),
            q = A[0],
            K = A[1],
            Y = A[2],
            z = A[3],
            _ = A[4];
        if (z === void 0) eA6("RETRY", q.name, K), q.apply(null, K);
        else if (Date.now() - z >= 60000) {
            eA6("TIMEOUT", q.name, K);
            var w = K.pop();
            if (typeof w === "function") w.call(null, Y)
        } else {
            var O = Date.now() - _,
                $ = Math.max(_ - z, 1),
                H = Math.min($ * 1.2, 100);
            if (O >= H) eA6("RETRY", q.name, K), q.apply(null, K.concat([z]));
            else x$[fP].push(A)
        }
        if (d81 === void 0) d81 = setTimeout(gl1, 0)
    }
})
// @from(Ln 40486, Col 4)
ljA = x((Paz, cjA) => {
    function Hy(A, q) {
        if (typeof q === "boolean") q = {
            forever: q
        };
        if (this._originalTimeouts = JSON.parse(JSON.stringify(A)), this._timeouts = A, this._options = q || {}, this._maxRetryTime = q && q.maxRetryTime || 1 / 0, this._fn = null, this._errors = [], this._attempts = 1, this._operationTimeout = null, this._operationTimeoutCb = null, this._timeout = null, this._operationStart = null, this._options.forever) this._cachedTimeouts = this._timeouts.slice(0)
    }
    cjA.exports = Hy;
    Hy.prototype.reset = function() {
        this._attempts = 1, this._timeouts = this._originalTimeouts
    };
    Hy.prototype.stop = function() {
        if (this._timeout) clearTimeout(this._timeout);
        this._timeouts = [], this._cachedTimeouts = null
    };
    Hy.prototype.retry = function(A) {
        if (this._timeout) clearTimeout(this._timeout);
        if (!A) return !1;
        var q = new Date().getTime();
        if (A && q - this._operationStart >= this._maxRetryTime) return this._errors.unshift(Error("RetryOperation timeout occurred")), !1;
        this._errors.push(A);
        var K = this._timeouts.shift();
        if (K === void 0)
            if (this._cachedTimeouts) this._errors.splice(this._errors.length - 1, this._errors.length), this._timeouts = this._cachedTimeouts.slice(0), K = this._timeouts.shift();
            else return !1;
        var Y = this,
            z = setTimeout(function() {
                if (Y._attempts++, Y._operationTimeoutCb) {
                    if (Y._timeout = setTimeout(function() {
                            Y._operationTimeoutCb(Y._attempts)
                        }, Y._operationTimeout), Y._options.unref) Y._timeout.unref()
                }
                Y._fn(Y._attempts)
            }, K);
        if (this._options.unref) z.unref();
        return !0
    };
    Hy.prototype.attempt = function(A, q) {
        if (this._fn = A, q) {
            if (q.timeout) this._operationTimeout = q.timeout;
            if (q.cb) this._operationTimeoutCb = q.cb
        }
        var K = this;
        if (this._operationTimeoutCb) this._timeout = setTimeout(function() {
            K._operationTimeoutCb()
        }, K._operationTimeout);
        this._operationStart = new Date().getTime(), this._fn(this._attempts)
    };
    Hy.prototype.try = function(A) {
        console.log("Using RetryOperation.try() is deprecated"), this.attempt(A)
    };
    Hy.prototype.start = function(A) {
        console.log("Using RetryOperation.start() is deprecated"), this.attempt(A)
    };
    Hy.prototype.start = Hy.prototype.try;
    Hy.prototype.errors = function() {
        return this._errors
    };
    Hy.prototype.attempts = function() {
        return this._attempts
    };
    Hy.prototype.mainError = function() {
        if (this._errors.length === 0) return null;
        var A = {},
            q = null,
            K = 0;
        for (var Y = 0; Y < this._errors.length; Y++) {
            var z = this._errors[Y],
                _ = z.message,
                w = (A[_] || 0) + 1;
            if (A[_] = w, w >= K) q = z, K = w
        }
        return q
    }
})
// @from(Ln 40561, Col 4)
njA = x((sOK) => {
    var aOK = ljA();
    sOK.operation = function(A) {
        var q = sOK.timeouts(A);
        return new aOK(q, {
            forever: A && A.forever,
            unref: A && A.unref,
            maxRetryTime: A && A.maxRetryTime
        })
    };
    sOK.timeouts = function(A) {
        if (A instanceof Array) return [].concat(A);
        var q = {
            retries: 10,
            factor: 2,
            minTimeout: 1000,
            maxTimeout: 1 / 0,
            randomize: !1
        };
        for (var K in A) q[K] = A[K];
        if (q.minTimeout > q.maxTimeout) throw Error("minTimeout is greater than maxTimeout");
        var Y = [];
        for (var z = 0; z < q.retries; z++) Y.push(this.createTimeout(z, q));
        if (A && A.forever && !Y.length) Y.push(this.createTimeout(z, q));
        return Y.sort(function(_, w) {
            return _ - w
        }), Y
    };
    sOK.createTimeout = function(A, q) {
        var K = q.randomize ? Math.random() + 1 : 1,
            Y = Math.round(K * q.minTimeout * Math.pow(q.factor, A));
        return Y = Math.min(Y, q.maxTimeout), Y
    };
    sOK.wrap = function(A, q, K) {
        if (q instanceof Array) K = q, q = null;
        if (!K) {
            K = [];
            for (var Y in A)
                if (typeof A[Y] === "function") K.push(Y)
        }
        for (var z = 0; z < K.length; z++) {
            var _ = K[z],
                w = A[_];
            A[_] = function($) {
                var H = sOK.operation(q),
                    j = Array.prototype.slice.call(arguments, 1),
                    J = j.pop();
                j.push(function(M) {
                    if (H.retry(M)) return;
                    if (M) arguments[0] = H.mainError();
                    J.apply(this, arguments)
                }), H.attempt(function() {
                    $.apply(A, j)
                })
            }.bind(A, w), A[_].options = q
        }
    }
})
// @from(Ln 40619, Col 4)
rjA = x((Zaz, l81) => {
    l81.exports = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
    if (process.platform !== "win32") l81.exports.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
    if (process.platform === "linux") l81.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED")
})
// @from(Ln 40624, Col 4)
ojA = x((Gaz, g$6) => {
    var gO = global.process,
        A76 = function(A) {
            return A && typeof A === "object" && typeof A.removeListener === "function" && typeof A.emit === "function" && typeof A.reallyExit === "function" && typeof A.listeners === "function" && typeof A.kill === "function" && typeof A.pid === "number" && typeof A.on === "function"
        };
    if (!A76(gO)) g$6.exports = function() {
        return function() {}
    };
    else {
        if (pl1 = x6("assert"), q76 = rjA(), Ql1 = /^win/i.test(gO.platform), B$6 = x6("events"), typeof B$6 !== "function") B$6 = B$6.EventEmitter;
        if (gO.__signal_exit_emitter__) LM = gO.__signal_exit_emitter__;
        else LM = gO.__signal_exit_emitter__ = new B$6, LM.count = 0, LM.emitted = {};
        if (!LM.infinite) LM.setMaxListeners(1 / 0), LM.infinite = !0;
        g$6.exports = function(A, q) {
            if (!A76(global.process)) return function() {};
            if (pl1.equal(typeof A, "function", "a callback must be provided for exit handler"), K76 === !1) i81();
            var K = "exit";
            if (q && q.alwaysLast) K = "afterexit";
            var Y = function() {
                if (LM.removeListener(K, A), LM.listeners("exit").length === 0 && LM.listeners("afterexit").length === 0) nL6()
            };
            return LM.on(K, A), Y
        }, nL6 = function() {
            if (!K76 || !A76(global.process)) return;
            K76 = !1, q76.forEach(function(q) {
                try {
                    gO.removeListener(q, rL6[q])
                } catch (K) {}
            }), gO.emit = oL6, gO.reallyExit = n81, LM.count -= 1
        }, g$6.exports.unload = nL6, jr = function(q, K, Y) {
            if (LM.emitted[q]) return;
            LM.emitted[q] = !0, LM.emit(q, K, Y)
        }, rL6 = {}, q76.forEach(function(A) {
            rL6[A] = function() {
                if (!A76(global.process)) return;
                var K = gO.listeners(A);
                if (K.length === LM.count) {
                    if (nL6(), jr("exit", null, A), jr("afterexit", null, A), Ql1 && A === "SIGHUP") A = "SIGINT";
                    gO.kill(gO.pid, A)
                }
            }
        }), g$6.exports.signals = function() {
            return q76
        }, K76 = !1, i81 = function() {
            if (K76 || !A76(global.process)) return;
            K76 = !0, LM.count += 1, q76 = q76.filter(function(q) {
                try {
                    return gO.on(q, rL6[q]), !0
                } catch (K) {
                    return !1
                }
            }), gO.emit = dl1, gO.reallyExit = Ul1
        }, g$6.exports.load = i81, n81 = gO.reallyExit, Ul1 = function(q) {
            if (!A76(global.process)) return;
            gO.exitCode = q || 0, jr("exit", gO.exitCode, null), jr("afterexit", gO.exitCode, null), n81.call(gO, gO.exitCode)
        }, oL6 = gO.emit, dl1 = function(q, K) {
            if (q === "exit" && A76(global.process)) {
                if (K !== void 0) gO.exitCode = K;
                var Y = oL6.apply(this, arguments);
                return jr("exit", gO.exitCode, null), jr("afterexit", gO.exitCode, null), Y
            } else return oL6.apply(this, arguments)
        }
    }
    var pl1, q76, Ql1, B$6, LM, nL6, jr, rL6, K76, i81, n81, Ul1, oL6, dl1
})
// @from(Ln 40689, Col 4)
sjA = x((Y$K, cl1) => {
    var ajA = Symbol();

    function q$K(A, q, K) {
        let Y = q[ajA];
        if (Y) return q.stat(A, (_, w) => {
            if (_) return K(_);
            K(null, w.mtime, Y)
        });
        let z = new Date(Math.ceil(Date.now() / 1000) * 1000 + 5);
        q.utimes(A, z, z, (_) => {
            if (_) return K(_);
            q.stat(A, (w, O) => {
                if (w) return K(w);
                let $ = O.mtime.getTime() % 1000 === 0 ? "s" : "ms";
                Object.defineProperty(q, ajA, {
                    value: $
                }), K(null, O.mtime, $)
            })
        })
    }

    function K$K(A) {
        let q = Date.now();
        if (A === "s") q = Math.ceil(q / 1000) * 1000;
        return new Date(q)
    }
    Y$K.probe = q$K;
    Y$K.getMtime = K$K
})
// @from(Ln 40719, Col 4)
KJA = x((M$K, sL6) => {
    var w$K = x6("path"),
        nl1 = Y_(),
        O$K = njA(),
        $$K = ojA(),
        tjA = sjA(),
        cp = {};

    function aL6(A, q) {
        return q.lockfilePath || `${A}.lock`
    }

    function rl1(A, q, K) {
        if (!q.realpath) return K(null, w$K.resolve(A));
        q.fs.realpath(A, K)
    }

    function il1(A, q, K) {
        let Y = aL6(A, q);
        q.fs.mkdir(Y, (z) => {
            if (!z) return tjA.probe(Y, q.fs, (_, w, O) => {
                if (_) return q.fs.rmdir(Y, () => {}), K(_);
                K(null, w, O)
            });
            if (z.code !== "EEXIST") return K(z);
            if (q.stale <= 0) return K(Object.assign(Error("Lock file is already being held"), {
                code: "ELOCKED",
                file: A
            }));
            q.fs.stat(Y, (_, w) => {
                if (_) {
                    if (_.code === "ENOENT") return il1(A, {
                        ...q,
                        stale: 0
                    }, K);
                    return K(_)
                }
                if (!ejA(w, q)) return K(Object.assign(Error("Lock file is already being held"), {
                    code: "ELOCKED",
                    file: A
                }));
                AJA(A, q, (O) => {
                    if (O) return K(O);
                    il1(A, {
                        ...q,
                        stale: 0
                    }, K)
                })
            })
        })
    }

    function ejA(A, q) {
        return A.mtime.getTime() < Date.now() - q.stale
    }

    function AJA(A, q, K) {
        q.fs.rmdir(aL6(A, q), (Y) => {
            if (Y && Y.code !== "ENOENT") return K(Y);
            K()
        })
    }

    function r81(A, q) {
        let K = cp[A];
        if (K.updateTimeout) return;
        if (K.updateDelay = K.updateDelay || q.update, K.updateTimeout = setTimeout(() => {
                K.updateTimeout = null, q.fs.stat(K.lockfilePath, (Y, z) => {
                    let _ = K.lastUpdate + q.stale < Date.now();
                    if (Y) {
                        if (Y.code === "ENOENT" || _) return ll1(A, K, Object.assign(Y, {
                            code: "ECOMPROMISED"
                        }));
                        return K.updateDelay = 1000, r81(A, q)
                    }
                    if (K.mtime.getTime() !== z.mtime.getTime()) return ll1(A, K, Object.assign(Error("Unable to update lock within the stale threshold"), {
                        code: "ECOMPROMISED"
                    }));
                    let O = tjA.getMtime(K.mtimePrecision);
                    q.fs.utimes(K.lockfilePath, O, O, ($) => {
                        let H = K.lastUpdate + q.stale < Date.now();
                        if (K.released) return;
                        if ($) {
                            if ($.code === "ENOENT" || H) return ll1(A, K, Object.assign($, {
                                code: "ECOMPROMISED"
                            }));
                            return K.updateDelay = 1000, r81(A, q)
                        }
                        K.mtime = O, K.lastUpdate = Date.now(), K.updateDelay = null, r81(A, q)
                    })
                })
            }, K.updateDelay), K.updateTimeout.unref) K.updateTimeout.unref()
    }

    function ll1(A, q, K) {
        if (q.released = !0, q.updateTimeout) clearTimeout(q.updateTimeout);
        if (cp[A] === q) delete cp[A];
        q.options.onCompromised(K)
    }

    function H$K(A, q, K) {
        q = {
            stale: 1e4,
            update: null,
            realpath: !0,
            retries: 0,
            fs: nl1,
            onCompromised: (Y) => {
                throw Y
            },
            ...q
        }, q.retries = q.retries || 0, q.retries = typeof q.retries === "number" ? {
            retries: q.retries
        } : q.retries, q.stale = Math.max(q.stale || 0, 2000), q.update = q.update == null ? q.stale / 2 : q.update || 0, q.update = Math.max(Math.min(q.update, q.stale / 2), 1000), rl1(A, q, (Y, z) => {
            if (Y) return K(Y);
            let _ = O$K.operation(q.retries);
            _.attempt(() => {
                il1(z, q, (w, O, $) => {
                    if (_.retry(w)) return;
                    if (w) return K(_.mainError());
                    let H = cp[z] = {
                        lockfilePath: aL6(z, q),
                        mtime: O,
                        mtimePrecision: $,
                        options: q,
                        lastUpdate: Date.now()
                    };
                    r81(z, q), K(null, (j) => {
                        if (H.released) return j && j(Object.assign(Error("Lock is already released"), {
                            code: "ERELEASED"
                        }));
                        qJA(z, {
                            ...q,
                            realpath: !1
                        }, j)
                    })
                })
            })
        })
    }

    function qJA(A, q, K) {
        q = {
            fs: nl1,
            realpath: !0,
            ...q
        }, rl1(A, q, (Y, z) => {
            if (Y) return K(Y);
            let _ = cp[z];
            if (!_) return K(Object.assign(Error("Lock is not acquired/owned by you"), {
                code: "ENOTACQUIRED"
            }));
            _.updateTimeout && clearTimeout(_.updateTimeout), _.released = !0, delete cp[z], AJA(z, q, K)
        })
    }

    function j$K(A, q, K) {
        q = {
            stale: 1e4,
            realpath: !0,
            fs: nl1,
            ...q
        }, q.stale = Math.max(q.stale || 0, 2000), rl1(A, q, (Y, z) => {
            if (Y) return K(Y);
            q.fs.stat(aL6(z, q), (_, w) => {
                if (_) return _.code === "ENOENT" ? K(null, !1) : K(_);
                return K(null, !ejA(w, q))
            })
        })
    }

    function J$K() {
        return cp
    }
    $$K(() => {
        for (let A in cp) {
            let q = cp[A].options;
            try {
                q.fs.rmdirSync(aL6(A, q))
            } catch (K) {}
        }
    });
    M$K.lock = H$K;
    M$K.unlock = qJA;
    M$K.check = j$K;
    M$K.getLocks = J$K
})
// @from(Ln 40906, Col 4)
zJA = x((faz, YJA) => {
    var Z$K = Y_();

    function G$K(A) {
        let q = ["mkdir", "realpath", "stat", "rmdir", "utimes"],
            K = {
                ...A
            };
        return q.forEach((Y) => {
            K[Y] = (...z) => {
                let _ = z.pop(),
                    w;
                try {
                    w = A[`${Y}Sync`](...z)
                } catch (O) {
                    return _(O)
                }
                _(null, w)
            }
        }), K
    }

    function f$K(A) {
        return (...q) => new Promise((K, Y) => {
            q.push((z, _) => {
                if (z) Y(z);
                else K(_)
            }), A(...q)
        })
    }

    function T$K(A) {
        return (...q) => {
            let K, Y;
            if (q.push((z, _) => {
                    K = z, Y = _
                }), A(...q), K) throw K;
            return Y
        }
    }

    function v$K(A) {
        if (A = {
                ...A
            }, A.fs = G$K(A.fs || Z$K), typeof A.retries === "number" && A.retries > 0 || A.retries && typeof A.retries.retries === "number" && A.retries.retries > 0) throw Object.assign(Error("Cannot use retries with the sync api"), {
            code: "ESYNC"
        });
        return A
    }
    YJA.exports = {
        toPromise: f$K,
        toSync: T$K,
        toSyncOptions: v$K
    }
})
// @from(Ln 40961, Col 4)
nx = x((Taz, Jr) => {
    var F$6 = KJA(),
        {
            toPromise: o81,
            toSync: a81,
            toSyncOptions: ol1
        } = zJA();
    async function _JA(A, q) {
        let K = await o81(F$6.lock)(A, q);
        return o81(K)
    }

    function N$K(A, q) {
        let K = a81(F$6.lock)(A, ol1(q));
        return a81(K)
    }

    function V$K(A, q) {
        return o81(F$6.unlock)(A, q)
    }

    function k$K(A, q) {
        return a81(F$6.unlock)(A, ol1(q))
    }

    function E$K(A, q) {
        return o81(F$6.check)(A, q)
    }

    function y$K(A, q) {
        return a81(F$6.check)(A, ol1(q))
    }
    Jr.exports = _JA;
    Jr.exports.lock = _JA;
    Jr.exports.unlock = V$K;
    Jr.exports.lockSync = N$K;
    Jr.exports.unlockSync = k$K;
    Jr.exports.check = E$K;
    Jr.exports.checkSync = y$K
})
// @from(Ln 41002, Col 0)
function yT(A, q, K = 10 * OJA * wJA) {
    let H = [];
    try {
        let Y;
        if (q === void 0) Y = {};
        else if (q instanceof AbortSignal) Y = {
            abortSignal: q,
            timeout: K
        };
        else Y = q;
        let {
            abortSignal: z,
            timeout: _ = 10 * OJA * wJA,
            input: w,
            stdio: O = ["ignore", "pipe", "pipe"]
        } = Y;
        z?.throwIfAborted();
        const $ = TY(H, E_`exec: ${A.slice(0,200)}`, 0);
        try {
            let D = BA6(A, {
                env: process.env,
                maxBuffer: 1e6,
                timeout: _,
                cwd: G1(),
                stdio: O,
                shell: !0,
                reject: !1,
                input: w
            });
            if (!D.stdout) return null;
            return D.stdout.trim() || null
        } catch {
            return null
        }
    } catch (j) {
        var J = j,
            M = 1
    } finally {
        vY(H, J, M)
    }
}
// @from(Ln 41043, Col 4)
wJA = 1000
// @from(Ln 41044, Col 4)
OJA = 60
// @from(Ln 41045, Col 4)
al1 = E(() => {
    WW();
    lA();
    g1()
})
// @from(Ln 41051, Col 0)
function z8(A, q, K = {
    timeout: 10 * tl1 * sl1,
    preserveOutputOnError: !0,
    useCwd: !0
}) {
    return RA(A, q, {
        abortSignal: K.abortSignal,
        timeout: K.timeout,
        preserveOutputOnError: K.preserveOutputOnError,
        cwd: K.useCwd ? G1() : void 0,
        env: K.env,
        stdin: K.stdin,
        input: K.input
    })
}
// @from(Ln 41067, Col 0)
function L$K(A, q) {
    if (A.shortMessage) return A.shortMessage;
    if (typeof A.signal === "string") return A.signal;
    return String(q)
}
// @from(Ln 41073, Col 0)
function RA(A, q, {
    abortSignal: K,
    timeout: Y = 10 * tl1 * sl1,
    preserveOutputOnError: z = !0,
    cwd: _,
    env: w,
    maxBuffer: O,
    shell: $,
    stdin: H,
    input: j
} = {
    timeout: 10 * tl1 * sl1,
    preserveOutputOnError: !0,
    maxBuffer: 1e6
}) {
    return new Promise((J) => {
        q9(A, q, {
            maxBuffer: O,
            signal: K,
            timeout: Y,
            cwd: _,
            env: w,
            shell: $,
            stdin: H,
            input: j,
            reject: !1
        }).then((M) => {
            if (M.failed)
                if (z) {
                    let D = M.exitCode ?? 1;
                    J({
                        stdout: M.stdout || "",
                        stderr: M.stderr || "",
                        code: D,
                        error: L$K(M, D)
                    })
                } else J({
                    stdout: "",
                    stderr: "",
                    code: M.exitCode ?? 1
                });
            else J({
                stdout: M.stdout,
                stderr: M.stderr,
                code: 0
            })
        }).catch((M) => {
            _6(M), J({
                stdout: "",
                stderr: "",
                code: 1
            })
        })
    })
}
// @from(Ln 41128, Col 4)
sl1 = 1000
// @from(Ln 41129, Col 4)
tl1 = 60
// @from(Ln 41130, Col 4)
Eq = E(() => {
    WW();
    lA();
    k1();
    al1()
})
// @from(Ln 41148, Col 0)
function p$6() {
    let A = t81();
    return {
        rgPath: A.command,
        rgArgs: A.args,
        argv0: A.argv0
    }
}
// @from(Ln 41157, Col 0)
function x$K(A) {
    return A.includes("os error 11") || A.includes("Resource temporarily unavailable")
}
// @from(Ln 41161, Col 0)
function $JA(A, q, K, Y, z = !1) {
    let {
        rgPath: _,
        rgArgs: w,
        argv0: O
    } = p$6(), $ = z ? ["-j", "1"] : [], H = [...w, ...$, ...A, q], j = y8() === "wsl" ? 60000 : 20000, J = parseInt(process.env.CLAUDE_CODE_GLOB_TIMEOUT_SECONDS || "", 10) || 0, M = J > 0 ? J * 1000 : j;
    if (O) {
        let D = C$K(_, H, {
                argv0: O,
                signal: K,
                windowsHide: !0
            }),
            X = "",
            P = "",
            W = !1,
            Z = !1;
        D.stdout?.on("data", (v) => {
            if (!W) {
                if (X += v.toString(), X.length > tL6) X = X.slice(0, tL6), W = !0
            }
        }), D.stderr?.on("data", (v) => {
            if (!Z) {
                if (P += v.toString(), P.length > tL6) P = P.slice(0, tL6), Z = !0
            }
        });
        let G, f = setTimeout(() => {
            if (process.platform === "win32") D.kill();
            else D.kill("SIGTERM"), G = setTimeout((v) => v.kill("SIGKILL"), 5000, D)
        }, M);
        return D.on("close", (v, N) => {
            if (clearTimeout(f), clearTimeout(G), v === 0 || v === 1) Y(null, X, P);
            else {
                let V = Error(`ripgrep exited with code ${v}`);
                V.code = v ?? void 0, V.signal = N ?? void 0, Y(V, X, P)
            }
        }), D.on("error", (v) => {
            clearTimeout(f), clearTimeout(G), Y(v, X, P)
        }), D
    }
    return S$K(_, H, {
        maxBuffer: tL6,
        signal: K,
        timeout: M,
        killSignal: process.platform === "win32" ? void 0 : "SIGKILL"
    }, Y)
}
// @from(Ln 41207, Col 0)
async function yV(A, q, K) {
    return await m$K(), u$K().catch((Y) => {
        _6(Y)
    }), new Promise((Y, z) => {
        let _ = (w, O, $, H) => {
            if (!w) {
                Y(O.trim().split(`
`).map((P) => P.replace(/\r$/, "")).filter(Boolean));
                return
            }
            if (w.code === 1) {
                Y([]);
                return
            }
            if (["ENOENT", "EACCES", "EPERM"].includes(w.code)) {
                z(w);
                return
            }
            if (!H && x$K($)) {
                k("rg EAGAIN error detected, retrying with single-threaded mode (-j 1)"), d("tengu_ripgrep_eagain_retry", {}), $JA(A, q, K, (P, W, Z) => {
                    _(P, W, Z, !0)
                }, !0);
                return
            }
            let J = O && O.trim().length > 0,
                M = w.signal === "SIGTERM" || w.signal === "SIGKILL" || w.code === "ABORT_ERR",
                D = w.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER",
                X = [];
            if (J) {
                if (X = O.trim().split(`
`).map((P) => P.replace(/\r$/, "")).filter(Boolean), X.length > 0 && (M || D)) X = X.slice(0, -1)
            }
            if (k(`rg error (signal=${w.signal}, code=${w.code}, stderr: ${$}), ${X.length} results`), w.code !== 2 && w.code !== "ABORT_ERR") _6(w);
            if (M && X.length === 0) {
                z(new jJA(`Ripgrep search timed out after ${y8()==="wsl"?60:20} seconds. The search may have matched files but did not complete in time. Try searching a more specific path or pattern.`, X));
                return
            }
            Y(X)
        };
        $JA(A, q, K, (w, O, $) => {
            _(w, O, $, !1)
        })
    })
}
// @from(Ln 41251, Col 0)
async function JJA(A, q, K) {
    try {
        return (await yV(["-l", "."], A, q)).slice(0, K)
    } catch {
        return []
    }
}
// @from(Ln 41259, Col 0)
function MJA() {
    let A = t81();
    return {
        mode: A.mode,
        path: A.command,
        working: s81?.working ?? null
    }
}
// @from(Ln 41267, Col 0)
async function m$K() {
    if (process.platform !== "darwin" || HJA) return;
    HJA = !0;
    let A = t81();
    if (A.mode !== "builtin") return;
    let q = A.command;
    if (!(await z8("codesign", ["-vv", "-d", q], {
            preserveOutputOnError: !1
        })).stdout.split(`
`).find((z) => z.includes("linker-signed"))) return;
    try {
        let z = await z8("codesign", ["--sign", "-", "--force", "--preserve-metadata=entitlements,requirements,flags,runtime", q]);
        if (z.code !== 0) _6(Error(`Failed to sign ripgrep: ${z.stdout} ${z.stderr}`));
        let _ = await z8("xattr", ["-d", "com.apple.quarantine", q]);
        if (_.code !== 0) _6(Error(`Failed to remove quarantine: ${_.stdout} ${_.stderr}`))
    } catch (z) {
        _6(z)
    }
}
// @from(Ln 41286, Col 4)
I$K
// @from(Ln 41286, Col 9)
b$K
// @from(Ln 41286, Col 14)
t81
// @from(Ln 41286, Col 19)
tL6 = 20000000
// @from(Ln 41287, Col 4)
jJA
// @from(Ln 41287, Col 9)
e81
// @from(Ln 41287, Col 14)
s81 = null
// @from(Ln 41288, Col 4)
u$K
// @from(Ln 41288, Col 9)
HJA = !1
// @from(Ln 41289, Col 4)
jy = E(() => {
    sd1();
    U4();
    k1();
    Eq();
    H1();
    A8();
    V1();
    YK();
    I$K = R$K(import.meta.url), b$K = Mr.join(I$K, "../"), t81 = e1(() => {
        if (xz(process.env.USE_BUILTIN_RIPGREP)) {
            let {
                cmd: Y
            } = Q11("rg", []);
            if (Y !== "rg") return {
                mode: "system",
                command: "rg",
                args: []
            }
        }
        if (rY()) return {
            mode: "embedded",
            command: process.execPath,
            args: ["--no-config"],
            argv0: "rg"
        };
        let q = Mr.resolve(b$K, "vendor", "ripgrep");
        return {
            mode: "builtin",
            command: process.platform === "win32" ? Mr.resolve(q, `${process.arch}-win32`, "rg.exe") : Mr.resolve(q, `${process.arch}-${process.platform}`, "rg"),
            args: []
        }
    });
    jJA = class jJA extends Error {
        partialResults;
        constructor(A, q) {
            super(A);
            this.partialResults = q;
            this.name = "RipgrepTimeoutError"
        }
    };
    e81 = e1(async (A, q, K = []) => {
        if (Mr.resolve(A) === Mr.resolve(h$K())) return;
        try {
            let Y = ["--files", "--hidden"];
            K.forEach(($) => {
                Y.push("--glob", `!${$}`)
            });
            let _ = (await yV(Y, A, q)).length;
            if (_ === 0) return 0;
            let w = Math.floor(Math.log10(_)),
                O = Math.pow(10, w);
            return Math.round(_ / O) * O
        } catch (Y) {
            _6(Y)
        }
    }, (A, q, K = []) => `${A}|${K.join(",")}`);
    u$K = e1(async () => {
        if (s81 !== null) return;
        let A = t81();
        try {
            let q;
            if (A.argv0) {
                let Y = Bun.spawn([A.command, "--version"], {
                        argv0: A.argv0,
                        stderr: "ignore",
                        stdout: "pipe"
                    }),
                    [z, _] = await Promise.all([Y.stdout.text(), Y.exited]);
                q = {
                    code: _,
                    stdout: z
                }
            } else q = await z8(A.command, [...A.args, "--version"], {
                timeout: 5000
            });
            let K = q.code === 0 && !!q.stdout && q.stdout.startsWith("ripgrep ");
            s81 = {
                working: K,
                lastTested: Date.now(),
                config: A
            }, k(`Ripgrep first use test: ${K?"PASSED":"FAILED"} (mode=${A.mode}, path=${A.command})`), d("tengu_ripgrep_availability", {
                working: K ? 1 : 0,
                using_system: A.mode === "system" ? 1 : 0
            })
        } catch (q) {
            s81 = {
                working: !1,
                lastTested: Date.now(),
                config: A
            }, _6(q)
        }
    })
})
// @from(Ln 41384, Col 0)
function B$K(A, q) {
    return Vw6(A, q)
}
// @from(Ln 41387, Col 4)
TP
// @from(Ln 41388, Col 4)
Q$6 = E(() => {
    _t6();
    TP = B$K
})
// @from(Ln 41392, Col 4)
eL6 = E(() => {
    Q$6();
    U4()
})
// @from(Ln 41396, Col 4)
kJA = x((VJA) => {
    Object.defineProperty(VJA, "__esModule", {
        value: !0
    });
    var WJA = /^[a-zA-Z:_][a-zA-Z0-9:_.-]*$/,
        qi1 = {
            revert: function() {}
        },
        YA1 = new Map,
        Ai1 = new Set;

    function zA1(A) {
        var q = YA1.get(A);
        return q || YA1.set(A, q = {
            element: A,
            attributes: {}
        }), q
    }

    function _A1(A, q, K, Y, z) {
        var _ = K(A),
            w = {
                isDirty: !1,
                originalValue: _,
                virtualValue: _,
                mutations: [],
                el: A,
                _positionTimeout: null,
                observer: new MutationObserver(function() {
                    if (q !== "position" || !w._positionTimeout) {
                        q === "position" && (w._positionTimeout = setTimeout(function() {
                            w._positionTimeout = null
                        }, 1000));
                        var O = K(A);
                        q === "position" && O.parentNode === w.virtualValue.parentNode && O.insertBeforeNode === w.virtualValue.insertBeforeNode || O !== w.virtualValue && (w.originalValue = O, z(w))
                    }
                }),
                mutationRunner: z,
                setValue: Y,
                getCurrentValue: K
            };
        return q === "position" && A.parentNode ? w.observer.observe(A.parentNode, {
            childList: !0,
            subtree: !0,
            attributes: !1,
            characterData: !1
        }) : w.observer.observe(A, function(O) {
            return O === "html" ? {
                childList: !0,
                subtree: !0,
                attributes: !0,
                characterData: !0
            } : {
                childList: !1,
                subtree: !1,
                attributes: !0,
                attributeFilter: [O]
            }
        }(q)), w
    }

    function wA1(A, q) {
        var K = q.getCurrentValue(q.el);
        q.virtualValue = A, A && typeof A != "string" ? K && A.parentNode === K.parentNode && A.insertBeforeNode === K.insertBeforeNode || (q.isDirty = !0, DJA()) : A !== K && (q.isDirty = !0, DJA())
    }

    function g$K(A) {
        var q = A.originalValue;
        A.mutations.forEach(function(K) {
            return q = K.mutate(q)
        }), wA1(function(K) {
            return AA1 || (AA1 = document.createElement("div")), AA1.innerHTML = K, AA1.innerHTML
        }(q), A)
    }

    function F$K(A) {
        var q = new Set(A.originalValue.split(/\s+/).filter(Boolean));
        A.mutations.forEach(function(K) {
            return K.mutate(q)
        }), wA1(Array.from(q).filter(Boolean).join(" "), A)
    }

    function p$K(A) {
        var q = A.originalValue;
        A.mutations.forEach(function(K) {
            return q = K.mutate(q)
        }), wA1(q, A)
    }

    function Q$K(A) {
        var q = A.originalValue;
        A.mutations.forEach(function(K) {
            var Y = function(z) {
                var _ = z.insertBeforeSelector,
                    w = document.querySelector(z.parentSelector);
                if (!w) return null;
                var O = _ ? document.querySelector(_) : null;
                return _ && !O ? null : {
                    parentNode: w,
                    insertBeforeNode: O
                }
            }(K.mutate());
            q = Y || q
        }), wA1(q, A)
    }
    var U$K = function(A) {
            return A.innerHTML
        },
        d$K = function(A, q) {
            return A.innerHTML = q
        };

    function ZJA(A) {
        var q = zA1(A);
        return q.html || (q.html = _A1(A, "html", U$K, d$K, g$K)), q.html
    }
    var c$K = function(A) {
            return {
                parentNode: A.parentElement,
                insertBeforeNode: A.nextElementSibling
            }
        },
        l$K = function(A, q) {
            q.insertBeforeNode && !q.parentNode.contains(q.insertBeforeNode) || q.parentNode.insertBefore(A, q.insertBeforeNode)
        };

    function GJA(A) {
        var q = zA1(A);
        return q.position || (q.position = _A1(A, "position", c$K, l$K, Q$K)), q.position
    }
    var AA1, qR6, i$K = function(A, q) {
            return q ? A.className = q : A.removeAttribute("class")
        },
        n$K = function(A) {
            return A.className
        };

    function fJA(A) {
        var q = zA1(A);
        return q.classes || (q.classes = _A1(A, "class", n$K, i$K, F$K)), q.classes
    }

    function TJA(A, q) {
        var K, Y = zA1(A);
        return Y.attributes[q] || (Y.attributes[q] = _A1(A, q, (K = q, function(z) {
            var _;
            return (_ = z.getAttribute(K)) != null ? _ : null
        }), function(z) {
            return function(_, w) {
                return w !== null ? _.setAttribute(z, w) : _.removeAttribute(z)
            }
        }(q), p$K)), Y.attributes[q]
    }

    function qA1(A, q, K) {
        if (K.isDirty) {
            K.isDirty = !1;
            var Y = K.virtualValue;
            K.mutations.length || function(z, _) {
                var w, O, $ = YA1.get(z);
                if ($)
                    if (_ === "html")(w = $.html) == null || (O = w.observer) == null || O.disconnect(), delete $.html;
                    else if (_ === "class") {
                    var H, j;
                    (H = $.classes) == null || (j = H.observer) == null || j.disconnect(), delete $.classes
                } else if (_ === "position") {
                    var J, M;
                    (J = $.position) == null || (M = J.observer) == null || M.disconnect(), delete $.position
                } else {
                    var D, X, P;
                    (D = $.attributes) == null || (X = D[_]) == null || (P = X.observer) == null || P.disconnect(), delete $.attributes[_]
                }
            }(A, q), K.setValue(A, Y)
        }
    }

    function r$K(A, q) {
        A.html && qA1(q, "html", A.html), A.classes && qA1(q, "class", A.classes), A.position && qA1(q, "position", A.position), Object.keys(A.attributes).forEach(function(K) {
            qA1(q, K, A.attributes[K])
        })
    }

    function DJA() {
        YA1.forEach(r$K)
    }

    function vJA(A) {
        if (A.kind !== "position" || A.elements.size !== 1) {
            var q = new Set(A.elements);
            document.querySelectorAll(A.selector).forEach(function(K) {
                q.has(K) || (A.elements.add(K), function(Y, z) {
                    var _ = null;
                    Y.kind === "html" ? _ = ZJA(z) : Y.kind === "class" ? _ = fJA(z) : Y.kind === "attribute" ? _ = TJA(z, Y.attribute) : Y.kind === "position" && (_ = GJA(z)), _ && (_.mutations.push(Y), _.mutationRunner(_))
                }(A, K))
            })
        }
    }

    function XJA() {
        Ai1.forEach(vJA)
    }

    function NJA() {
        typeof document < "u" && (qR6 || (qR6 = new MutationObserver(function() {
            XJA()
        })), XJA(), qR6.observe(document.documentElement, {
            childList: !0,
            subtree: !0,
            attributes: !1,
            characterData: !1
        }))
    }

    function OA1(A) {
        return typeof document > "u" ? qi1 : (Ai1.add(A), vJA(A), {
            revert: function() {
                var q;
                (q = A).elements.forEach(function(K) {
                    return function(Y, z) {
                        var _ = null;
                        if (Y.kind === "html" ? _ = ZJA(z) : Y.kind === "class" ? _ = fJA(z) : Y.kind === "attribute" ? _ = TJA(z, Y.attribute) : Y.kind === "position" && (_ = GJA(z)), _) {
                            var w = _.mutations.indexOf(Y);
                            w !== -1 && _.mutations.splice(w, 1), _.mutationRunner(_)
                        }
                    }(q, K)
                }), q.elements.clear(), Ai1.delete(q)
            }
        })
    }

    function el1(A, q) {
        return OA1({
            kind: "html",
            elements: new Set,
            mutate: q,
            selector: A
        })
    }

    function PJA(A, q) {
        return OA1({
            kind: "position",
            elements: new Set,
            mutate: q,
            selector: A
        })
    }

    function AR6(A, q) {
        return OA1({
            kind: "class",
            elements: new Set,
            mutate: q,
            selector: A
        })
    }

    function KA1(A, q, K) {
        return WJA.test(q) ? q === "class" || q === "className" ? AR6(A, function(Y) {
            var z = K(Array.from(Y).join(" "));
            Y.clear(), z && z.split(/\s+/g).filter(Boolean).forEach(function(_) {
                return Y.add(_)
            })
        }) : OA1({
            kind: "attribute",
            attribute: q,
            elements: new Set,
            mutate: K,
            selector: A
        }) : qi1
    }
    NJA();
    var o$K = {
        html: el1,
        classes: AR6,
        attribute: KA1,
        position: PJA,
        declarative: function(A) {
            var {
                selector: q,
                action: K,
                value: Y,
                attribute: z,
                parentSelector: _,
                insertBeforeSelector: w
            } = A;
            if (z === "html") {
                if (K === "append") return el1(q, function(O) {
                    return O + (Y != null ? Y : "")
                });
                if (K === "set") return el1(q, function() {
                    return Y != null ? Y : ""
                })
            } else if (z === "class") {
                if (K === "append") return AR6(q, function(O) {
                    Y && O.add(Y)
                });
                if (K === "remove") return AR6(q, function(O) {
                    Y && O.delete(Y)
                });
                if (K === "set") return AR6(q, function(O) {
                    O.clear(), Y && O.add(Y)
                })
            } else if (z === "position") {
                if (K === "set" && _) return PJA(q, function() {
                    return {
                        insertBeforeSelector: w,
                        parentSelector: _
                    }
                })
            } else {
                if (K === "append") return KA1(q, z, function(O) {
                    return O !== null ? O + (Y != null ? Y : "") : Y != null ? Y : ""
                });
                if (K === "set") return KA1(q, z, function() {
                    return Y != null ? Y : ""
                });
                if (K === "remove") return KA1(q, z, function() {
                    return null
                })
            }
            return qi1
        }
    };
    VJA.connectGlobalObserver = NJA, VJA.default = o$K, VJA.disconnectGlobalObserver = function() {
        qR6 && qR6.disconnect()
    }, VJA.validAttributeName = WJA
})
// @from(Ln 41725, Col 0)
function LJA() {
    return yJA
}
// @from(Ln 41729, Col 0)
function Ki1(A) {
    let q = 2166136261,
        K = A.length;
    for (let Y = 0; Y < K; Y++) q ^= A.charCodeAt(Y), q += (q << 1) + (q << 4) + (q << 7) + (q << 8) + (q << 24);
    return q >>> 0
}
// @from(Ln 41736, Col 0)
function KR6(A, q, K) {
    if (K === 2) return Ki1(Ki1(A + q) + "") % 1e4 / 1e4;
    if (K === 1) return Ki1(q + A) % 1000 / 1000;
    return null
}
// @from(Ln 41742, Col 0)
function a$K(A) {
    if (A <= 0) return [];
    return Array(A).fill(1 / A)
}
// @from(Ln 41747, Col 0)
function $A1(A, q) {
    return A >= q[0] && A < q[1]
}
// @from(Ln 41751, Col 0)
function RJA(A, q) {
    let K = KR6("__" + q[0], A, 1);
    if (K === null) return !1;
    return K >= q[1] && K < q[2]
}
// @from(Ln 41757, Col 0)
function hJA(A, q) {
    for (let K = 0; K < q.length; K++)
        if ($A1(A, q[K])) return K;
    return -1
}
// @from(Ln 41763, Col 0)
function zi1(A) {
    try {
        let q = A.replace(/([^\\])\//g, "$1\\/");
        return new RegExp(q)
    } catch (q) {
        console.error(q);
        return
    }
}
// @from(Ln 41773, Col 0)
function HA1(A, q) {
    if (!q.length) return !1;
    let K = !1,
        Y = !1;
    for (let z = 0; z < q.length; z++) {
        let _ = e$K(A, q[z].type, q[z].pattern);
        if (q[z].include === !1) {
            if (_) return !1
        } else if (K = !0, _) Y = !0
    }
    return Y || !K
}
// @from(Ln 41786, Col 0)
function s$K(A, q, K) {
    try {
        let Y = q.replace(/[*.+?^${}()|[\]\\]/g, "\\$&").replace(/_____/g, ".*");
        if (K) Y = "\\/?" + Y.replace(/(^\/|\/$)/g, "") + "\\/?";
        return new RegExp("^" + Y + "$", "i").test(A)
    } catch (Y) {
        return !1
    }
}
// @from(Ln 41796, Col 0)
function t$K(A, q) {
    try {
        let K = new URL(q.replace(/^([^:/?]*)\./i, "https://$1.").replace(/\*/g, "_____"), "https://_____"),
            Y = [
                [A.host, K.host, !1],
                [A.pathname, K.pathname, !0]
            ];
        if (K.hash) Y.push([A.hash, K.hash, !1]);
        return K.searchParams.forEach((z, _) => {
            Y.push([A.searchParams.get(_) || "", z, !1])
        }), !Y.some((z) => !s$K(z[0], z[1], z[2]))
    } catch (K) {
        return !1
    }
}
// @from(Ln 41812, Col 0)
function e$K(A, q, K) {
    try {
        let Y = new URL(A, "https://_");
        if (q === "regex") {
            let z = zi1(K);
            if (!z) return !1;
            return z.test(Y.href) || z.test(Y.href.substring(Y.origin.length))
        } else if (q === "simple") return t$K(Y, K);
        return !1
    } catch (Y) {
        return !1
    }
}
// @from(Ln 41826, Col 0)
function SJA(A, q, K) {
    if (q = q === void 0 ? 1 : q, q < 0) q = 0;
    else if (q > 1) q = 1;
    let Y = a$K(A);
    if (K = K || Y, K.length !== A) K = Y;
    let z = K.reduce((w, O) => O + w, 0);
    if (z < 0.99 || z > 1.01) K = Y;
    let _ = 0;
    return K.map((w) => {
        let O = _;
        return _ += w, [O, O + q * w]
    })
}
// @from(Ln 41840, Col 0)
function CJA(A, q, K) {
    if (!q) return null;
    let Y = q.split("?")[1];
    if (!Y) return null;
    let z = Y.replace(/#.*/, "").split("&").map((_) => _.split("=", 2)).filter((_) => {
        let [w] = _;
        return w === A
    }).map((_) => {
        let [, w] = _;
        return parseInt(w)
    });
    if (z.length > 0 && z[0] >= 0 && z[0] < K) return z[0];
    return null
}
// @from(Ln 41855, Col 0)
function IJA(A) {
    try {
        return A()
    } catch (q) {
        return console.error(q), !1
    }
}
// @from(Ln 41862, Col 0)
async function Y76(A, q, K) {
    if (q = q || "", K = K || globalThis.crypto && globalThis.crypto.subtle || yJA.SubtleCrypto, !K) throw Error("No SubtleCrypto implementation found");
    try {
        let Y = await K.importKey("raw", Yi1(q), {
                name: "AES-CBC",
                length: 128
            }, !0, ["encrypt", "decrypt"]),
            [z, _] = A.split("."),
            w = await K.decrypt({
                name: "AES-CBC",
                iv: Yi1(z)
            }, Y, Yi1(_));
        return new TextDecoder().decode(w)
    } catch (Y) {
        throw Error("Failed to decrypt")
    }
}
// @from(Ln 41880, Col 0)
function YR6(A) {
    if (typeof A === "string") return A;
    return JSON.stringify(A)
}
// @from(Ln 41885, Col 0)
function LV(A) {
    if (typeof A === "number") A = A + "";
    if (!A || typeof A !== "string") A = "0";
    let q = A.replace(/(^v|\+.*$)/g, "").split(/[-.]/);
    if (q.length === 3) q.push("~");
    return q.map((K) => K.match(/^[0-9]+$/) ? K.padStart(5, " ") : K).join("-")
}
// @from(Ln 41893, Col 0)
function bJA() {
    let A;
    try {
        A = "1.6.1"
    } catch (q) {
        A = ""
    }
    return A
}
// @from(Ln 41903, Col 0)
function xJA(A, q) {
    let K, Y;
    try {
        K = new URL(A), Y = new URL(q)
    } catch (z) {
        return console.error(`Unable to merge query strings: ${z}`), q
    }
    return K.searchParams.forEach((z, _) => {
        if (Y.searchParams.has(_)) return;
        Y.searchParams.set(_, z)
    }), Y.toString()
}
// @from(Ln 41916, Col 0)
function EJA(A) {
    return typeof A === "object" && A !== null
}
// @from(Ln 41920, Col 0)
function jA1(A) {
    if (A.urlPatterns && A.variations.some((q) => EJA(q) && ("urlRedirect" in q))) return "redirect";
    else if (A.variations.some((q) => EJA(q) && (q.domMutations || ("js" in q) || ("css" in q)))) return "visual";
    return "unknown"
}
// @from(Ln 41925, Col 0)
async function JA1(A, q) {
    return new Promise((K) => {
        let Y = !1,
            z, _ = (w) => {
                if (Y) return;
                Y = !0, z && clearTimeout(z), K(w || null)
            };
        if (q) z = setTimeout(() => _(), q);
        A.then((w) => _(w)).catch(() => _())
    })
}
// @from(Ln 41936, Col 4)
yJA
// @from(Ln 41936, Col 9)
Yi1 = (A) => Uint8Array.from(atob(A), (q) => q.charCodeAt(0))
// @from(Ln 41937, Col 4)
zR6 = E(() => {
    yJA = {
        fetch: globalThis.fetch ? globalThis.fetch.bind(globalThis) : void 0,
        SubtleCrypto: globalThis.crypto ? globalThis.crypto.subtle : void 0,
        EventSource: globalThis.EventSource
    }
})
// @from(Ln 41945, Col 0)
function BJA(A) {
    if (Object.assign(ZW, A), !ZW.backgroundSync) OHK()
}
// @from(Ln 41948, Col 0)
async function gJA(A) {
    let {
        instance: q,
        timeout: K,
        skipCache: Y,
        allowStale: z,
        backgroundSync: _
    } = A;
    if (!_) ZW.backgroundSync = !1;
    return YHK({
        instance: q,
        allowStale: z,
        timeout: K,
        skipCache: Y
    })
}
// @from(Ln 41965, Col 0)
function AHK(A) {
    let q = _R6(A),
        K = d$6.get(q) || new Set;
    K.add(A), d$6.set(q, K)
}
// @from(Ln 41971, Col 0)
function FJA(A) {
    d$6.forEach((q) => q.delete(A))
}
// @from(Ln 41975, Col 0)
function qHK() {
    c$6.forEach((A) => {
        if (!A) return;
        A.state = "idle", $i1(A)
    })
}
// @from(Ln 41982, Col 0)
function KHK() {
    c$6.forEach((A) => {
        if (!A) return;
        if (A.state !== "idle") return;
        Hi1(A)
    })
}
// @from(Ln 41989, Col 0)
async function mJA() {
    try {
        if (!rx.localStorage) return;
        await rx.localStorage.setItem(ZW.cacheKey, JSON.stringify(Array.from(lp.entries())))
    } catch (A) {}
}
// @from(Ln 41995, Col 0)
async function YHK(A) {
    let {
        instance: q,
        allowStale: K,
        timeout: Y,
        skipCache: z
    } = A, _ = _R6(q), w = wi1(q), O = new Date, $ = new Date(O.getTime() - ZW.maxAge + ZW.staleTTL);
    await zHK();
    let H = !ZW.disableCache && !z ? lp.get(w) : void 0;
    if (H && (K || H.staleAt > O) && H.staleAt > $) {
        if (H.sse) l$6.add(_);
        if (H.staleAt < O) _i1(q);
        else Oi1(q);
        return {
            data: H.data,
            success: !0,
            source: "cache"
        }
    } else return await JA1(_i1(q), Y) || {
        data: null,
        success: !1,
        source: "timeout",
        error: Error("Timeout")
    }
}
// @from(Ln 42021, Col 0)
function _R6(A) {
    let [q, K] = A.getApiInfo();
    return `${q}||${K}`
}
// @from(Ln 42026, Col 0)
function wi1(A) {
    let q = _R6(A);
    if (!("isRemoteEval" in A) || !A.isRemoteEval()) return q;
    let K = A.getAttributes(),
        Y = A.getCacheKeyAttributes() || Object.keys(A.getAttributes()),
        z = {};
    Y.forEach((O) => {
        z[O] = K[O]
    });
    let _ = A.getForcedVariations(),
        w = A.getUrl();
    return `${q}||${JSON.stringify({ca:z,fv:_,url:w})}`
}
// @from(Ln 42039, Col 0)
async function zHK() {
    if (uJA) return;
    uJA = !0;
    try {
        if (rx.localStorage) {
            let A = await rx.localStorage.getItem(ZW.cacheKey);
            if (!ZW.disableCache && A) {
                let q = JSON.parse(A);
                if (q && Array.isArray(q)) q.forEach((K) => {
                    let [Y, z] = K;
                    lp.set(Y, {
                        ...z,
                        staleAt: new Date(z.staleAt)
                    })
                });
                pJA()
            }
        }
    } catch (A) {}
    if (!ZW.disableIdleStreams) {
        let A = U$6.startIdleListener();
        if (A) U$6.stopIdleListener = A
    }
}
// @from(Ln 42064, Col 0)
function pJA() {
    let A = Array.from(lp.entries()).map((K) => {
            let [Y, z] = K;
            return {
                key: Y,
                staleAt: z.staleAt.getTime()
            }
        }).sort((K, Y) => K.staleAt - Y.staleAt),
        q = Math.min(Math.max(0, lp.size - ZW.maxEntries), lp.size);
    for (let K = 0; K < q; K++) lp.delete(A[K].key)
}
// @from(Ln 42076, Col 0)
function QJA(A, q, K) {
    let Y = K.dateUpdated || "",
        z = new Date(Date.now() + ZW.staleTTL),
        _ = !ZW.disableCache ? lp.get(q) : void 0;
    if (_ && Y && _.version === Y) {
        _.staleAt = z, mJA();
        return
    }
    if (!ZW.disableCache) lp.set(q, {
        data: K,
        version: Y,
        staleAt: z,
        sse: l$6.has(A)
    }), pJA();
    mJA();
    let w = d$6.get(A);
    w && w.forEach((O) => _HK(O, K))
}
// @from(Ln 42094, Col 0)
async function _HK(A, q) {
    await A.setPayload(q || A.getPayload())
}
// @from(Ln 42097, Col 0)
async function _i1(A) {
    let {
        apiHost: q,
        apiRequestHeaders: K
    } = A.getApiHosts(), Y = A.getClientKey(), z = "isRemoteEval" in A && A.isRemoteEval(), _ = _R6(A), w = wi1(A), O = MA1.get(w);
    if (!O) O = (z ? U$6.fetchRemoteEvalCall({
        host: q,
        clientKey: Y,
        payload: {
            attributes: A.getAttributes(),
            forcedVariations: A.getForcedVariations(),
            forcedFeatures: Array.from(A.getForcedFeatures().entries()),
            url: A.getUrl()
        },
        headers: K
    }) : U$6.fetchFeaturesCall({
        host: q,
        clientKey: Y,
        headers: K
    })).then((H) => {
        if (!H.ok) throw Error(`HTTP error: ${H.status}`);
        if (H.headers.get("x-sse-support") === "enabled") l$6.add(_);
        return H.json()
    }).then((H) => {
        return QJA(_, w, H), Oi1(A), MA1.delete(w), {
            data: H,
            success: !0,
            source: "network"
        }
    }).catch((H) => {
        return MA1.delete(w), {
            data: null,
            source: "error",
            success: !1,
            error: H
        }
    }), MA1.set(w, O);
    return O
}
// @from(Ln 42137, Col 0)
function Oi1(A) {
    let q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
        K = _R6(A),
        Y = wi1(A),
        {
            streamingHost: z,
            streamingHostRequestHeaders: _
        } = A.getApiHosts(),
        w = A.getClientKey();
    if (q) l$6.add(K);
    if (ZW.backgroundSync && l$6.has(K) && rx.EventSource) {
        if (c$6.has(K)) return;
        let O = {
            src: null,
            host: z,
            clientKey: w,
            headers: _,
            cb: ($) => {
                try {
                    if ($.type === "features-updated") {
                        let H = d$6.get(K);
                        H && H.forEach((j) => {
                            _i1(j)
                        })
                    } else if ($.type === "features") {
                        let H = JSON.parse($.data);
                        QJA(K, Y, H)
                    }
                    O.errors = 0
                } catch (H) {
                    UJA(O)
                }
            },
            errors: 0,
            state: "active"
        };
        c$6.set(K, O), Hi1(O)
    }
}
// @from(Ln 42177, Col 0)
function UJA(A) {
    if (A.state === "idle") return;
    if (A.errors++, A.errors > 3 || A.src && A.src.readyState === 2) {
        let q = Math.pow(3, A.errors - 3) * (1000 + Math.random() * 1000);
        $i1(A), setTimeout(() => {
            if (["idle", "active"].includes(A.state)) return;
            Hi1(A)
        }, Math.min(q, 300000))
    }
}
// @from(Ln 42188, Col 0)
function $i1(A) {
    if (!A.src) return;
    if (A.src.onopen = null, A.src.onerror = null, A.src.close(), A.src = null, A.state === "active") A.state = "disabled"
}
// @from(Ln 42193, Col 0)
function Hi1(A) {
    A.src = U$6.eventSourceCall({
        host: A.host,
        clientKey: A.clientKey,
        headers: A.headers
    }), A.state = "active", A.src.addEventListener("features", A.cb), A.src.addEventListener("features-updated", A.cb), A.src.onerror = () => UJA(A), A.src.onopen = () => {
        A.errors = 0
    }
}
// @from(Ln 42203, Col 0)
function wHK(A, q) {
    $i1(A), c$6.delete(q)
}
// @from(Ln 42207, Col 0)
function OHK() {
    l$6.clear(), c$6.forEach(wHK), d$6.clear(), U$6.stopIdleListener()
}
// @from(Ln 42211, Col 0)
function DA1(A, q) {
    if (q.streaming) {
        if (!A.getClientKey()) throw Error("Must specify clientKey to enable streaming");
        if (q.payload) Oi1(A, !0);
        AHK(A)
    }
}
// @from(Ln 42218, Col 4)
ZW
// @from(Ln 42218, Col 8)
rx
// @from(Ln 42218, Col 12)
U$6
// @from(Ln 42218, Col 17)
d$6
// @from(Ln 42218, Col 22)
uJA = !1
// @from(Ln 42219, Col 4)
lp
// @from(Ln 42219, Col 8)
MA1
// @from(Ln 42219, Col 13)
c$6
// @from(Ln 42219, Col 18)
l$6
// @from(Ln 42220, Col 4)
dJA = E(() => {
    zR6();
    ZW = {
        staleTTL: 60000,
        maxAge: 14400000,
        cacheKey: "gbFeaturesCache",
        backgroundSync: !0,
        maxEntries: 10,
        disableIdleStreams: !1,
        idleStreamInterval: 20000,
        disableCache: !1
    }, rx = LJA(), U$6 = {
        fetchFeaturesCall: (A) => {
            let {
                host: q,
                clientKey: K,
                headers: Y
            } = A;
            return rx.fetch(`${q}/api/features/${K}`, {
                headers: Y
            })
        },
        fetchRemoteEvalCall: (A) => {
            let {
                host: q,
                clientKey: K,
                payload: Y,
                headers: z
            } = A, _ = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...z
                },
                body: JSON.stringify(Y)
            };
            return rx.fetch(`${q}/api/eval/${K}`, _)
        },
        eventSourceCall: (A) => {
            let {
                host: q,
                clientKey: K,
                headers: Y
            } = A;
            if (Y) return new rx.EventSource(`${q}/sub/${K}`, {
                headers: Y
            });
            return new rx.EventSource(`${q}/sub/${K}`)
        },
        startIdleListener: () => {
            let A;
            if (!(typeof window < "u" && typeof document < "u")) return;
            let K = () => {
                if (document.visibilityState === "visible") window.clearTimeout(A), KHK();
                else if (document.visibilityState === "hidden") A = window.setTimeout(qHK, ZW.idleStreamInterval)
            };
            return document.addEventListener("visibilitychange", K), () => document.removeEventListener("visibilitychange", K)
        },
        stopIdleListener: () => {}
    };
    try {
        if (globalThis.localStorage) rx.localStorage = globalThis.localStorage
    } catch (A) {}
    d$6 = new Map, lp = new Map, MA1 = new Map, c$6 = new Map, l$6 = new Set
})
// @from(Ln 42286, Col 0)
function Dr(A, q, K) {
    K = K || {};
    for (let [Y, z] of Object.entries(q)) switch (Y) {
        case "$or":
            if (!cJA(A, z, K)) return !1;
            break;
        case "$nor":
            if (cJA(A, z, K)) return !1;
            break;
        case "$and":
            if (!DHK(A, z, K)) return !1;
            break;
        case "$not":
            if (Dr(A, z, K)) return !1;
            break;
        default:
            if (!wR6(z, $HK(A, Y), K)) return !1
    }
    return !0
}
// @from(Ln 42307, Col 0)
function $HK(A, q) {
    let K = q.split("."),
        Y = A;
    for (let z = 0; z < K.length; z++)
        if (Y && typeof Y === "object" && K[z] in Y) Y = Y[K[z]];
        else return null;
    return Y
}
// @from(Ln 42316, Col 0)
function HHK(A) {
    if (!ji1[A]) ji1[A] = new RegExp(A.replace(/([^\\])\//g, "$1\\/"));
    return ji1[A]
}
// @from(Ln 42321, Col 0)
function wR6(A, q, K) {
    if (typeof A === "string") return q + "" === A;
    if (typeof A === "number") return q * 1 === A;
    if (typeof A === "boolean") return q !== null && !!q === A;
    if (A === null) return q === null;
    if (Array.isArray(A) || !lJA(A)) return JSON.stringify(q) === JSON.stringify(A);
    for (let Y in A)
        if (!MHK(Y, q, A[Y], K)) return !1;
    return !0
}
// @from(Ln 42332, Col 0)
function lJA(A) {
    let q = Object.keys(A);
    return q.length > 0 && q.filter((K) => K[0] === "$").length === q.length
}
// @from(Ln 42337, Col 0)
function jHK(A) {
    if (A === null) return "null";
    if (Array.isArray(A)) return "array";
    let q = typeof A;
    if (["string", "number", "boolean", "object", "undefined"].includes(q)) return q;
    return "unknown"
}
// @from(Ln 42345, Col 0)
function JHK(A, q, K) {
    if (!Array.isArray(A)) return !1;
    let Y = lJA(q) ? (z) => wR6(q, z, K) : (z) => Dr(z, q, K);
    for (let z = 0; z < A.length; z++)
        if (A[z] && Y(A[z])) return !0;
    return !1
}
// @from(Ln 42353, Col 0)
function XA1(A, q) {
    if (Array.isArray(A)) return A.some((K) => q.includes(K));
    return q.includes(A)
}
// @from(Ln 42358, Col 0)
function MHK(A, q, K, Y) {
    switch (A) {
        case "$veq":
            return LV(q) === LV(K);
        case "$vne":
            return LV(q) !== LV(K);
        case "$vgt":
            return LV(q) > LV(K);
        case "$vgte":
            return LV(q) >= LV(K);
        case "$vlt":
            return LV(q) < LV(K);
        case "$vlte":
            return LV(q) <= LV(K);
        case "$eq":
            return q === K;
        case "$ne":
            return q !== K;
        case "$lt":
            return q < K;
        case "$lte":
            return q <= K;
        case "$gt":
            return q > K;
        case "$gte":
            return q >= K;
        case "$exists":
            return K ? q != null : q == null;
        case "$in":
            if (!Array.isArray(K)) return !1;
            return XA1(q, K);
        case "$inGroup":
            return XA1(q, Y[K] || []);
        case "$notInGroup":
            return !XA1(q, Y[K] || []);
        case "$nin":
            if (!Array.isArray(K)) return !1;
            return !XA1(q, K);
        case "$not":
            return !wR6(K, q, Y);
        case "$size":
            if (!Array.isArray(q)) return !1;
            return wR6(K, q.length, Y);
        case "$elemMatch":
            return JHK(q, K, Y);
        case "$all":
            if (!Array.isArray(q)) return !1;
            for (let z = 0; z < K.length; z++) {
                let _ = !1;
                for (let w = 0; w < q.length; w++)
                    if (wR6(K[z], q[w], Y)) {
                        _ = !0;
                        break
                    } if (!_) return !1
            }
            return !0;
        case "$regex":
            try {
                return HHK(K).test(q)
            } catch (z) {
                return !1
            }
        case "$type":
            return jHK(q) === K;
        default:
            return console.error("Unknown operator: " + A), !1
    }
}
// @from(Ln 42427, Col 0)
function cJA(A, q, K) {
    if (!q.length) return !0;
    for (let Y = 0; Y < q.length; Y++)
        if (Dr(A, q[Y], K)) return !0;
    return !1
}
// @from(Ln 42434, Col 0)
function DHK(A, q, K) {
    for (let Y = 0; Y < q.length; Y++)
        if (!Dr(A, q[Y], K)) return !1;
    return !0
}
// @from(Ln 42439, Col 4)
ji1
// @from(Ln 42440, Col 4)
iJA = E(() => {
    zR6();
    ji1 = {}
})
// @from(Ln 42445, Col 0)
function WHK(A) {
    let q = new Map;
    if (A.global.forcedFeatureValues) A.global.forcedFeatureValues.forEach((K, Y) => q.set(Y, K));
    if (A.user.forcedFeatureValues) A.user.forcedFeatureValues.forEach((K, Y) => q.set(Y, K));
    return q
}
// @from(Ln 42452, Col 0)
function ZHK(A) {
    if (A.global.forcedVariations && A.user.forcedVariations) return {
        ...A.global.forcedVariations,
        ...A.user.forcedVariations
    };
    else if (A.global.forcedVariations) return A.global.forcedVariations;
    else if (A.user.forcedVariations) return A.user.forcedVariations;
    else return {}
}
// @from(Ln 42461, Col 0)
async function i$6(A) {
    try {
        await A()
    } catch (q) {}
}
// @from(Ln 42467, Col 0)
function nJA(A, q, K) {
    if (A.user.trackedExperiments) {
        let z = ZA1(q, K);
        if (A.user.trackedExperiments.has(z)) return [];
        A.user.trackedExperiments.add(z)
    }
    if (A.user.enableDevMode && A.user.devLogs) A.user.devLogs.push({
        experiment: q,
        result: K,
        timestamp: Date.now().toString(),
        logType: "experiment"
    });
    let Y = [];
    if (A.global.trackingCallback) {
        let z = A.global.trackingCallback;
        Y.push(i$6(() => z(q, K, A.user)))
    }
    if (A.user.trackingCallback) {
        let z = A.user.trackingCallback;
        Y.push(i$6(() => z(q, K)))
    }
    if (A.global.eventLogger) {
        let z = A.global.eventLogger;
        Y.push(i$6(() => z(PHK, {
            experimentId: q.key,
            variationId: K.key,
            hashAttribute: K.hashAttribute,
            hashValue: K.hashValue
        }, A.user)))
    }
    return Y
}
// @from(Ln 42500, Col 0)
function GHK(A, q, K) {
    if (A.user.trackedFeatureUsage) {
        let Y = JSON.stringify(K.value);
        if (A.user.trackedFeatureUsage[q] === Y) return;
        if (A.user.trackedFeatureUsage[q] = Y, A.user.enableDevMode && A.user.devLogs) A.user.devLogs.push({
            featureKey: q,
            result: K,
            timestamp: Date.now().toString(),
            logType: "feature"
        })
    }
    if (A.global.onFeatureUsage) {
        let Y = A.global.onFeatureUsage;
        i$6(() => Y(q, K, A.user))
    }
    if (A.user.onFeatureUsage) {
        let Y = A.user.onFeatureUsage;
        i$6(() => Y(q, K))
    }
    if (A.global.eventLogger) {
        let Y = A.global.eventLogger;
        i$6(() => Y(XHK, {
            feature: q,
            source: K.source,
            value: K.value,
            ruleId: K.source === "defaultValue" ? "$default" : K.ruleId || "",
            variationId: K.experimentResult ? K.experimentResult.key : ""
        }, A.user))
    }
}
// @from(Ln 42531, Col 0)
function PA1(A, q) {
    if (q.stack.evaluatedFeatures.has(A)) return Xr(q, A, null, "cyclicPrerequisite");
    q.stack.evaluatedFeatures.add(A), q.stack.id = A;
    let K = WHK(q);
    if (K.has(A)) return Xr(q, A, K.get(A), "override");
    if (!q.global.features || !q.global.features[A]) return Xr(q, A, null, "unknownFeature");
    let Y = q.global.features[A];
    if (Y.rules) {
        let z = new Set(q.stack.evaluatedFeatures);
        A: for (let _ of Y.rules) {
            if (_.parentConditions)
                for (let $ of _.parentConditions) {
                    q.stack.evaluatedFeatures = new Set(z);
                    let H = PA1($.id, q);
                    if (H.source === "cyclicPrerequisite") return Xr(q, A, null, "cyclicPrerequisite");
                    let j = {
                        value: H.value
                    };
                    if (!Dr(j, $.condition || {})) {
                        if ($.gate) return Xr(q, A, null, "prerequisite");
                        continue A
                    }
                }
            if (_.filters && aJA(_.filters, q)) continue;
            if ("force" in _) {
                if (_.condition && !oJA(_.condition, q)) continue;
                if (!fHK(q, _.seed || A, _.hashAttribute, q.user.saveStickyBucketAssignmentDoc && !_.disableStickyBucketing ? _.fallbackAttribute : void 0, _.range, _.coverage, _.hashVersion)) continue;
                if (_.tracks) _.tracks.forEach(($) => {
                    if (!nJA(q, $.experiment, $.result).length && q.global.saveDeferredTrack) q.global.saveDeferredTrack({
                        experiment: $.experiment,
                        result: $.result
                    })
                });
                return Xr(q, A, _.force, "force", _.id)
            }
            if (!_.variations) continue;
            let w = {
                variations: _.variations,
                key: _.key || A
            };
            if ("coverage" in _) w.coverage = _.coverage;
            if (_.weights) w.weights = _.weights;
            if (_.hashAttribute) w.hashAttribute = _.hashAttribute;
            if (_.fallbackAttribute) w.fallbackAttribute = _.fallbackAttribute;
            if (_.disableStickyBucketing) w.disableStickyBucketing = _.disableStickyBucketing;
            if (_.bucketVersion !== void 0) w.bucketVersion = _.bucketVersion;
            if (_.minBucketVersion !== void 0) w.minBucketVersion = _.minBucketVersion;
            if (_.namespace) w.namespace = _.namespace;
            if (_.meta) w.meta = _.meta;
            if (_.ranges) w.ranges = _.ranges;
            if (_.name) w.name = _.name;
            if (_.phase) w.phase = _.phase;
            if (_.seed) w.seed = _.seed;
            if (_.hashVersion) w.hashVersion = _.hashVersion;
            if (_.filters) w.filters = _.filters;
            if (_.condition) w.condition = _.condition;
            let {
                result: O
            } = WA1(w, A, q);
            if (q.global.onExperimentEval && q.global.onExperimentEval(w, O), O.inExperiment && !O.passthrough) return Xr(q, A, O.value, "experiment", _.id, w, O)
        }
    }
    return Xr(q, A, Y.defaultValue === void 0 ? null : Y.defaultValue, "defaultValue")
}