
// @from(Ln 109456, Col 4)
Ew = x((hj3) => {
    hj3.fromCallback = function(A) {
        return Object.defineProperty(function(...q) {
            if (typeof q[q.length - 1] === "function") A.apply(this, q);
            else return new Promise((K, Y) => {
                q.push((z, _) => z != null ? Y(z) : K(_)), A.apply(this, q)
            })
        }, "name", {
            value: A.name
        })
    };
    hj3.fromPromise = function(A) {
        return Object.defineProperty(function(...q) {
            let K = q[q.length - 1];
            if (typeof K !== "function") return A.apply(this, q);
            else q.pop(), A.apply(this, q).then((Y) => K(null, Y), K)
        }, "name", {
            value: A.name
        })
    }
})
// @from(Ln 109477, Col 4)
Yq6 = x((R98) => {
    var b_7 = Ew().fromCallback,
        sT = Y_(),
        Ij3 = ["access", "appendFile", "chmod", "chown", "close", "copyFile", "fchmod", "fchown", "fdatasync", "fstat", "fsync", "ftruncate", "futimes", "lchmod", "lchown", "link", "lstat", "mkdir", "mkdtemp", "open", "opendir", "readdir", "readFile", "readlink", "realpath", "rename", "rm", "rmdir", "stat", "symlink", "truncate", "unlink", "utimes", "writeFile"].filter((A) => {
            return typeof sT[A] === "function"
        });
    Object.assign(R98, sT);
    Ij3.forEach((A) => {
        R98[A] = b_7(sT[A])
    });
    R98.exists = function(A, q) {
        if (typeof q === "function") return sT.exists(A, q);
        return new Promise((K) => {
            return sT.exists(A, K)
        })
    };
    R98.read = function(A, q, K, Y, z, _) {
        if (typeof _ === "function") return sT.read(A, q, K, Y, z, _);
        return new Promise((w, O) => {
            sT.read(A, q, K, Y, z, ($, H, j) => {
                if ($) return O($);
                w({
                    bytesRead: H,
                    buffer: j
                })
            })
        })
    };
    R98.write = function(A, q, ...K) {
        if (typeof K[K.length - 1] === "function") return sT.write(A, q, ...K);
        return new Promise((Y, z) => {
            sT.write(A, q, ...K, (_, w, O) => {
                if (_) return z(_);
                Y({
                    bytesWritten: w,
                    buffer: O
                })
            })
        })
    };
    if (typeof sT.writev === "function") R98.writev = function(A, q, ...K) {
        if (typeof K[K.length - 1] === "function") return sT.writev(A, q, ...K);
        return new Promise((Y, z) => {
            sT.writev(A, q, ...K, (_, w, O) => {
                if (_) return z(_);
                Y({
                    bytesWritten: w,
                    buffers: O
                })
            })
        })
    };
    if (typeof sT.realpath.native === "function") R98.realpath.native = b_7(sT.realpath.native);
    else process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003")
})
// @from(Ln 109532, Col 4)
u_7 = x((Bj3, x_7) => {
    var mj3 = x6("path");
    Bj3.checkPath = function(q) {
        if (process.platform === "win32") {
            if (/[<>:"|?*]/.test(q.replace(mj3.parse(q).root, ""))) {
                let Y = Error(`Path contains invalid characters: ${q}`);
                throw Y.code = "EINVAL", Y
            }
        }
    }
})
// @from(Ln 109543, Col 4)
F_7 = x((Fj3, h98) => {
    var m_7 = Yq6(),
        {
            checkPath: B_7
        } = u_7(),
        g_7 = (A) => {
            let q = {
                mode: 511
            };
            if (typeof A === "number") return A;
            return {
                ...q,
                ...A
            }.mode
        };
    Fj3.makeDir = async (A, q) => {
        return B_7(A), m_7.mkdir(A, {
            mode: g_7(q),
            recursive: !0
        })
    };
    Fj3.makeDirSync = (A, q) => {
        return B_7(A), m_7.mkdirSync(A, {
            mode: g_7(q),
            recursive: !0
        })
    }
})
// @from(Ln 109571, Col 4)
DC = x((qT_, p_7) => {
    var Uj3 = Ew().fromPromise,
        {
            makeDir: dj3,
            makeDirSync: S98
        } = F_7(),
        C98 = Uj3(dj3);
    p_7.exports = {
        mkdirs: C98,
        mkdirsSync: S98,
        mkdirp: C98,
        mkdirpSync: S98,
        ensureDir: C98,
        ensureDirSync: S98
    }
})
// @from(Ln 109587, Col 4)
po = x((KT_, U_7) => {
    var cj3 = Ew().fromPromise,
        Q_7 = Yq6();

    function lj3(A) {
        return Q_7.access(A).then(() => !0).catch(() => !1)
    }
    U_7.exports = {
        pathExists: cj3(lj3),
        pathExistsSync: Q_7.existsSync
    }
})
// @from(Ln 109599, Col 4)
I98 = x((YT_, d_7) => {
    var AM6 = Y_();

    function ij3(A, q, K, Y) {
        AM6.open(A, "r+", (z, _) => {
            if (z) return Y(z);
            AM6.futimes(_, q, K, (w) => {
                AM6.close(_, (O) => {
                    if (Y) Y(w || O)
                })
            })
        })
    }

    function nj3(A, q, K) {
        let Y = AM6.openSync(A, "r+");
        return AM6.futimesSync(Y, q, K), AM6.closeSync(Y)
    }
    d_7.exports = {
        utimesMillis: ij3,
        utimesMillisSync: nj3
    }
})
// @from(Ln 109622, Col 4)
zq6 = x((zT_, i_7) => {
    var qM6 = Yq6(),
        aD = x6("path"),
        rj3 = x6("util");

    function oj3(A, q, K) {
        let Y = K.dereference ? (z) => qM6.stat(z, {
            bigint: !0
        }) : (z) => qM6.lstat(z, {
            bigint: !0
        });
        return Promise.all([Y(A), Y(q).catch((z) => {
            if (z.code === "ENOENT") return null;
            throw z
        })]).then(([z, _]) => ({
            srcStat: z,
            destStat: _
        }))
    }

    function aj3(A, q, K) {
        let Y, z = K.dereference ? (w) => qM6.statSync(w, {
                bigint: !0
            }) : (w) => qM6.lstatSync(w, {
                bigint: !0
            }),
            _ = z(A);
        try {
            Y = z(q)
        } catch (w) {
            if (w.code === "ENOENT") return {
                srcStat: _,
                destStat: null
            };
            throw w
        }
        return {
            srcStat: _,
            destStat: Y
        }
    }

    function sj3(A, q, K, Y, z) {
        rj3.callbackify(oj3)(A, q, Y, (_, w) => {
            if (_) return z(_);
            let {
                srcStat: O,
                destStat: $
            } = w;
            if ($) {
                if (XI6(O, $)) {
                    let H = aD.basename(A),
                        j = aD.basename(q);
                    if (K === "move" && H !== j && H.toLowerCase() === j.toLowerCase()) return z(null, {
                        srcStat: O,
                        destStat: $,
                        isChangingCase: !0
                    });
                    return z(Error("Source and destination must not be the same."))
                }
                if (O.isDirectory() && !$.isDirectory()) return z(Error(`Cannot overwrite non-directory '${q}' with directory '${A}'.`));
                if (!O.isDirectory() && $.isDirectory()) return z(Error(`Cannot overwrite directory '${q}' with non-directory '${A}'.`))
            }
            if (O.isDirectory() && b98(A, q)) return z(Error(r91(A, q, K)));
            return z(null, {
                srcStat: O,
                destStat: $
            })
        })
    }

    function tj3(A, q, K, Y) {
        let {
            srcStat: z,
            destStat: _
        } = aj3(A, q, Y);
        if (_) {
            if (XI6(z, _)) {
                let w = aD.basename(A),
                    O = aD.basename(q);
                if (K === "move" && w !== O && w.toLowerCase() === O.toLowerCase()) return {
                    srcStat: z,
                    destStat: _,
                    isChangingCase: !0
                };
                throw Error("Source and destination must not be the same.")
            }
            if (z.isDirectory() && !_.isDirectory()) throw Error(`Cannot overwrite non-directory '${q}' with directory '${A}'.`);
            if (!z.isDirectory() && _.isDirectory()) throw Error(`Cannot overwrite directory '${q}' with non-directory '${A}'.`)
        }
        if (z.isDirectory() && b98(A, q)) throw Error(r91(A, q, K));
        return {
            srcStat: z,
            destStat: _
        }
    }

    function c_7(A, q, K, Y, z) {
        let _ = aD.resolve(aD.dirname(A)),
            w = aD.resolve(aD.dirname(K));
        if (w === _ || w === aD.parse(w).root) return z();
        qM6.stat(w, {
            bigint: !0
        }, (O, $) => {
            if (O) {
                if (O.code === "ENOENT") return z();
                return z(O)
            }
            if (XI6(q, $)) return z(Error(r91(A, K, Y)));
            return c_7(A, q, w, Y, z)
        })
    }

    function l_7(A, q, K, Y) {
        let z = aD.resolve(aD.dirname(A)),
            _ = aD.resolve(aD.dirname(K));
        if (_ === z || _ === aD.parse(_).root) return;
        let w;
        try {
            w = qM6.statSync(_, {
                bigint: !0
            })
        } catch (O) {
            if (O.code === "ENOENT") return;
            throw O
        }
        if (XI6(q, w)) throw Error(r91(A, K, Y));
        return l_7(A, q, _, Y)
    }

    function XI6(A, q) {
        return q.ino && q.dev && q.ino === A.ino && q.dev === A.dev
    }

    function b98(A, q) {
        let K = aD.resolve(A).split(aD.sep).filter((z) => z),
            Y = aD.resolve(q).split(aD.sep).filter((z) => z);
        return K.reduce((z, _, w) => z && Y[w] === _, !0)
    }

    function r91(A, q, K) {
        return `Cannot ${K} '${A}' to a subdirectory of itself, '${q}'.`
    }
    i_7.exports = {
        checkPaths: sj3,
        checkPathsSync: tj3,
        checkParentPaths: c_7,
        checkParentPathsSync: l_7,
        isSrcSubdir: b98,
        areIdentical: XI6
    }
})
// @from(Ln 109774, Col 4)
A27 = x((_T_, e_7) => {
    var tT = Y_(),
        PI6 = x6("path"),
        ej3 = DC().mkdirs,
        AJ3 = po().pathExists,
        qJ3 = I98().utimesMillis,
        WI6 = zq6();

    function KJ3(A, q, K, Y) {
        if (typeof K === "function" && !Y) Y = K, K = {};
        else if (typeof K === "function") K = {
            filter: K
        };
        if (Y = Y || function() {}, K = K || {}, K.clobber = "clobber" in K ? !!K.clobber : !0, K.overwrite = "overwrite" in K ? !!K.overwrite : K.clobber, K.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0001");
        WI6.checkPaths(A, q, "copy", K, (z, _) => {
            if (z) return Y(z);
            let {
                srcStat: w,
                destStat: O
            } = _;
            WI6.checkParentPaths(A, w, q, "copy", ($) => {
                if ($) return Y($);
                if (K.filter) return o_7(n_7, O, A, q, K, Y);
                return n_7(O, A, q, K, Y)
            })
        })
    }

    function n_7(A, q, K, Y, z) {
        let _ = PI6.dirname(K);
        AJ3(_, (w, O) => {
            if (w) return z(w);
            if (O) return o91(A, q, K, Y, z);
            ej3(_, ($) => {
                if ($) return z($);
                return o91(A, q, K, Y, z)
            })
        })
    }

    function o_7(A, q, K, Y, z, _) {
        Promise.resolve(z.filter(K, Y)).then((w) => {
            if (w) return A(q, K, Y, z, _);
            return _()
        }, (w) => _(w))
    }

    function YJ3(A, q, K, Y, z) {
        if (Y.filter) return o_7(o91, A, q, K, Y, z);
        return o91(A, q, K, Y, z)
    }

    function o91(A, q, K, Y, z) {
        (Y.dereference ? tT.stat : tT.lstat)(q, (w, O) => {
            if (w) return z(w);
            if (O.isDirectory()) return jJ3(O, A, q, K, Y, z);
            else if (O.isFile() || O.isCharacterDevice() || O.isBlockDevice()) return zJ3(O, A, q, K, Y, z);
            else if (O.isSymbolicLink()) return DJ3(A, q, K, Y, z);
            else if (O.isSocket()) return z(Error(`Cannot copy a socket file: ${q}`));
            else if (O.isFIFO()) return z(Error(`Cannot copy a FIFO pipe: ${q}`));
            return z(Error(`Unknown file: ${q}`))
        })
    }

    function zJ3(A, q, K, Y, z, _) {
        if (!q) return a_7(A, K, Y, z, _);
        return _J3(A, K, Y, z, _)
    }

    function _J3(A, q, K, Y, z) {
        if (Y.overwrite) tT.unlink(K, (_) => {
            if (_) return z(_);
            return a_7(A, q, K, Y, z)
        });
        else if (Y.errorOnExist) return z(Error(`'${K}' already exists`));
        else return z()
    }

    function a_7(A, q, K, Y, z) {
        tT.copyFile(q, K, (_) => {
            if (_) return z(_);
            if (Y.preserveTimestamps) return wJ3(A.mode, q, K, z);
            return a91(K, A.mode, z)
        })
    }

    function wJ3(A, q, K, Y) {
        if (OJ3(A)) return $J3(K, A, (z) => {
            if (z) return Y(z);
            return r_7(A, q, K, Y)
        });
        return r_7(A, q, K, Y)
    }

    function OJ3(A) {
        return (A & 128) === 0
    }

    function $J3(A, q, K) {
        return a91(A, q | 128, K)
    }

    function r_7(A, q, K, Y) {
        HJ3(q, K, (z) => {
            if (z) return Y(z);
            return a91(K, A, Y)
        })
    }

    function a91(A, q, K) {
        return tT.chmod(A, q, K)
    }

    function HJ3(A, q, K) {
        tT.stat(A, (Y, z) => {
            if (Y) return K(Y);
            return qJ3(q, z.atime, z.mtime, K)
        })
    }

    function jJ3(A, q, K, Y, z, _) {
        if (!q) return JJ3(A.mode, K, Y, z, _);
        return s_7(K, Y, z, _)
    }

    function JJ3(A, q, K, Y, z) {
        tT.mkdir(K, (_) => {
            if (_) return z(_);
            s_7(q, K, Y, (w) => {
                if (w) return z(w);
                return a91(K, A, z)
            })
        })
    }

    function s_7(A, q, K, Y) {
        tT.readdir(A, (z, _) => {
            if (z) return Y(z);
            return t_7(_, A, q, K, Y)
        })
    }

    function t_7(A, q, K, Y, z) {
        let _ = A.pop();
        if (!_) return z();
        return MJ3(A, _, q, K, Y, z)
    }

    function MJ3(A, q, K, Y, z, _) {
        let w = PI6.join(K, q),
            O = PI6.join(Y, q);
        WI6.checkPaths(w, O, "copy", z, ($, H) => {
            if ($) return _($);
            let {
                destStat: j
            } = H;
            YJ3(j, w, O, z, (J) => {
                if (J) return _(J);
                return t_7(A, K, Y, z, _)
            })
        })
    }

    function DJ3(A, q, K, Y, z) {
        tT.readlink(q, (_, w) => {
            if (_) return z(_);
            if (Y.dereference) w = PI6.resolve(process.cwd(), w);
            if (!A) return tT.symlink(w, K, z);
            else tT.readlink(K, (O, $) => {
                if (O) {
                    if (O.code === "EINVAL" || O.code === "UNKNOWN") return tT.symlink(w, K, z);
                    return z(O)
                }
                if (Y.dereference) $ = PI6.resolve(process.cwd(), $);
                if (WI6.isSrcSubdir(w, $)) return z(Error(`Cannot copy '${w}' to a subdirectory of itself, '${$}'.`));
                if (A.isDirectory() && WI6.isSrcSubdir($, w)) return z(Error(`Cannot overwrite '${$}' with '${w}'.`));
                return XJ3(w, K, z)
            })
        })
    }

    function XJ3(A, q, K) {
        tT.unlink(q, (Y) => {
            if (Y) return K(Y);
            return tT.symlink(A, q, K)
        })
    }
    e_7.exports = KJ3
})
// @from(Ln 109965, Col 4)
_27 = x((wT_, z27) => {
    var xW = Y_(),
        ZI6 = x6("path"),
        PJ3 = DC().mkdirsSync,
        WJ3 = I98().utimesMillisSync,
        GI6 = zq6();

    function ZJ3(A, q, K) {
        if (typeof K === "function") K = {
            filter: K
        };
        if (K = K || {}, K.clobber = "clobber" in K ? !!K.clobber : !0, K.overwrite = "overwrite" in K ? !!K.overwrite : K.clobber, K.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0002");
        let {
            srcStat: Y,
            destStat: z
        } = GI6.checkPathsSync(A, q, "copy", K);
        return GI6.checkParentPathsSync(A, Y, q, "copy"), GJ3(z, A, q, K)
    }

    function GJ3(A, q, K, Y) {
        if (Y.filter && !Y.filter(q, K)) return;
        let z = ZI6.dirname(K);
        if (!xW.existsSync(z)) PJ3(z);
        return q27(A, q, K, Y)
    }

    function fJ3(A, q, K, Y) {
        if (Y.filter && !Y.filter(q, K)) return;
        return q27(A, q, K, Y)
    }

    function q27(A, q, K, Y) {
        let _ = (Y.dereference ? xW.statSync : xW.lstatSync)(q);
        if (_.isDirectory()) return yJ3(_, A, q, K, Y);
        else if (_.isFile() || _.isCharacterDevice() || _.isBlockDevice()) return TJ3(_, A, q, K, Y);
        else if (_.isSymbolicLink()) return hJ3(A, q, K, Y);
        else if (_.isSocket()) throw Error(`Cannot copy a socket file: ${q}`);
        else if (_.isFIFO()) throw Error(`Cannot copy a FIFO pipe: ${q}`);
        throw Error(`Unknown file: ${q}`)
    }

    function TJ3(A, q, K, Y, z) {
        if (!q) return K27(A, K, Y, z);
        return vJ3(A, K, Y, z)
    }

    function vJ3(A, q, K, Y) {
        if (Y.overwrite) return xW.unlinkSync(K), K27(A, q, K, Y);
        else if (Y.errorOnExist) throw Error(`'${K}' already exists`)
    }

    function K27(A, q, K, Y) {
        if (xW.copyFileSync(q, K), Y.preserveTimestamps) NJ3(A.mode, q, K);
        return x98(K, A.mode)
    }

    function NJ3(A, q, K) {
        if (VJ3(A)) kJ3(K, A);
        return EJ3(q, K)
    }

    function VJ3(A) {
        return (A & 128) === 0
    }

    function kJ3(A, q) {
        return x98(A, q | 128)
    }

    function x98(A, q) {
        return xW.chmodSync(A, q)
    }

    function EJ3(A, q) {
        let K = xW.statSync(A);
        return WJ3(q, K.atime, K.mtime)
    }

    function yJ3(A, q, K, Y, z) {
        if (!q) return LJ3(A.mode, K, Y, z);
        return Y27(K, Y, z)
    }

    function LJ3(A, q, K, Y) {
        return xW.mkdirSync(K), Y27(q, K, Y), x98(K, A)
    }

    function Y27(A, q, K) {
        xW.readdirSync(A).forEach((Y) => RJ3(Y, A, q, K))
    }

    function RJ3(A, q, K, Y) {
        let z = ZI6.join(q, A),
            _ = ZI6.join(K, A),
            {
                destStat: w
            } = GI6.checkPathsSync(z, _, "copy", Y);
        return fJ3(w, z, _, Y)
    }

    function hJ3(A, q, K, Y) {
        let z = xW.readlinkSync(q);
        if (Y.dereference) z = ZI6.resolve(process.cwd(), z);
        if (!A) return xW.symlinkSync(z, K);
        else {
            let _;
            try {
                _ = xW.readlinkSync(K)
            } catch (w) {
                if (w.code === "EINVAL" || w.code === "UNKNOWN") return xW.symlinkSync(z, K);
                throw w
            }
            if (Y.dereference) _ = ZI6.resolve(process.cwd(), _);
            if (GI6.isSrcSubdir(z, _)) throw Error(`Cannot copy '${z}' to a subdirectory of itself, '${_}'.`);
            if (xW.statSync(K).isDirectory() && GI6.isSrcSubdir(_, z)) throw Error(`Cannot overwrite '${_}' with '${z}'.`);
            return SJ3(z, K)
        }
    }

    function SJ3(A, q) {
        return xW.unlinkSync(q), xW.symlinkSync(A, q)
    }
    z27.exports = ZJ3
})
// @from(Ln 110091, Col 4)
s91 = x((OT_, w27) => {
    var CJ3 = Ew().fromCallback;
    w27.exports = {
        copy: CJ3(A27()),
        copySync: _27()
    }
})
// @from(Ln 110098, Col 4)
P27 = x(($T_, X27) => {
    var O27 = Y_(),
        J27 = x6("path"),
        F2 = x6("assert"),
        fI6 = process.platform === "win32";

    function M27(A) {
        ["unlink", "chmod", "stat", "lstat", "rmdir", "readdir"].forEach((K) => {
            A[K] = A[K] || O27[K], K = K + "Sync", A[K] = A[K] || O27[K]
        }), A.maxBusyTries = A.maxBusyTries || 3
    }

    function u98(A, q, K) {
        let Y = 0;
        if (typeof q === "function") K = q, q = {};
        F2(A, "rimraf: missing path"), F2.strictEqual(typeof A, "string", "rimraf: path should be a string"), F2.strictEqual(typeof K, "function", "rimraf: callback function required"), F2(q, "rimraf: invalid options argument provided"), F2.strictEqual(typeof q, "object", "rimraf: options should be object"), M27(q), $27(A, q, function z(_) {
            if (_) {
                if ((_.code === "EBUSY" || _.code === "ENOTEMPTY" || _.code === "EPERM") && Y < q.maxBusyTries) {
                    Y++;
                    let w = Y * 100;
                    return setTimeout(() => $27(A, q, z), w)
                }
                if (_.code === "ENOENT") _ = null
            }
            K(_)
        })
    }

    function $27(A, q, K) {
        F2(A), F2(q), F2(typeof K === "function"), q.lstat(A, (Y, z) => {
            if (Y && Y.code === "ENOENT") return K(null);
            if (Y && Y.code === "EPERM" && fI6) return H27(A, q, Y, K);
            if (z && z.isDirectory()) return t91(A, q, Y, K);
            q.unlink(A, (_) => {
                if (_) {
                    if (_.code === "ENOENT") return K(null);
                    if (_.code === "EPERM") return fI6 ? H27(A, q, _, K) : t91(A, q, _, K);
                    if (_.code === "EISDIR") return t91(A, q, _, K)
                }
                return K(_)
            })
        })
    }

    function H27(A, q, K, Y) {
        F2(A), F2(q), F2(typeof Y === "function"), q.chmod(A, 438, (z) => {
            if (z) Y(z.code === "ENOENT" ? null : K);
            else q.stat(A, (_, w) => {
                if (_) Y(_.code === "ENOENT" ? null : K);
                else if (w.isDirectory()) t91(A, q, K, Y);
                else q.unlink(A, Y)
            })
        })
    }

    function j27(A, q, K) {
        let Y;
        F2(A), F2(q);
        try {
            q.chmodSync(A, 438)
        } catch (z) {
            if (z.code === "ENOENT") return;
            else throw K
        }
        try {
            Y = q.statSync(A)
        } catch (z) {
            if (z.code === "ENOENT") return;
            else throw K
        }
        if (Y.isDirectory()) e91(A, q, K);
        else q.unlinkSync(A)
    }

    function t91(A, q, K, Y) {
        F2(A), F2(q), F2(typeof Y === "function"), q.rmdir(A, (z) => {
            if (z && (z.code === "ENOTEMPTY" || z.code === "EEXIST" || z.code === "EPERM")) IJ3(A, q, Y);
            else if (z && z.code === "ENOTDIR") Y(K);
            else Y(z)
        })
    }

    function IJ3(A, q, K) {
        F2(A), F2(q), F2(typeof K === "function"), q.readdir(A, (Y, z) => {
            if (Y) return K(Y);
            let _ = z.length,
                w;
            if (_ === 0) return q.rmdir(A, K);
            z.forEach((O) => {
                u98(J27.join(A, O), q, ($) => {
                    if (w) return;
                    if ($) return K(w = $);
                    if (--_ === 0) q.rmdir(A, K)
                })
            })
        })
    }

    function D27(A, q) {
        let K;
        q = q || {}, M27(q), F2(A, "rimraf: missing path"), F2.strictEqual(typeof A, "string", "rimraf: path should be a string"), F2(q, "rimraf: missing options"), F2.strictEqual(typeof q, "object", "rimraf: options should be object");
        try {
            K = q.lstatSync(A)
        } catch (Y) {
            if (Y.code === "ENOENT") return;
            if (Y.code === "EPERM" && fI6) j27(A, q, Y)
        }
        try {
            if (K && K.isDirectory()) e91(A, q, null);
            else q.unlinkSync(A)
        } catch (Y) {
            if (Y.code === "ENOENT") return;
            else if (Y.code === "EPERM") return fI6 ? j27(A, q, Y) : e91(A, q, Y);
            else if (Y.code !== "EISDIR") throw Y;
            e91(A, q, Y)
        }
    }

    function e91(A, q, K) {
        F2(A), F2(q);
        try {
            q.rmdirSync(A)
        } catch (Y) {
            if (Y.code === "ENOTDIR") throw K;
            else if (Y.code === "ENOTEMPTY" || Y.code === "EEXIST" || Y.code === "EPERM") bJ3(A, q);
            else if (Y.code !== "ENOENT") throw Y
        }
    }

    function bJ3(A, q) {
        if (F2(A), F2(q), q.readdirSync(A).forEach((K) => D27(J27.join(A, K), q)), fI6) {
            let K = Date.now();
            do try {
                return q.rmdirSync(A, q)
            } catch {}
            while (Date.now() - K < 500)
        } else return q.rmdirSync(A, q)
    }
    X27.exports = u98;
    u98.sync = D27
})
// @from(Ln 110239, Col 4)
TI6 = x((HT_, Z27) => {
    var AY1 = Y_(),
        xJ3 = Ew().fromCallback,
        W27 = P27();

    function uJ3(A, q) {
        if (AY1.rm) return AY1.rm(A, {
            recursive: !0,
            force: !0
        }, q);
        W27(A, q)
    }

    function mJ3(A) {
        if (AY1.rmSync) return AY1.rmSync(A, {
            recursive: !0,
            force: !0
        });
        W27.sync(A)
    }
    Z27.exports = {
        remove: xJ3(uJ3),
        removeSync: mJ3
    }
})
// @from(Ln 110264, Col 4)
E27 = x((jT_, k27) => {
    var BJ3 = Ew().fromPromise,
        T27 = Yq6(),
        v27 = x6("path"),
        N27 = DC(),
        V27 = TI6(),
        G27 = BJ3(async function(q) {
            let K;
            try {
                K = await T27.readdir(q)
            } catch {
                return N27.mkdirs(q)
            }
            return Promise.all(K.map((Y) => V27.remove(v27.join(q, Y))))
        });

    function f27(A) {
        let q;
        try {
            q = T27.readdirSync(A)
        } catch {
            return N27.mkdirsSync(A)
        }
        q.forEach((K) => {
            K = v27.join(A, K), V27.removeSync(K)
        })
    }
    k27.exports = {
        emptyDirSync: f27,
        emptydirSync: f27,
        emptyDir: G27,
        emptydir: G27
    }
})
// @from(Ln 110298, Col 4)
h27 = x((JT_, R27) => {
    var gJ3 = Ew().fromCallback,
        y27 = x6("path"),
        Qo = Y_(),
        L27 = DC();

    function FJ3(A, q) {
        function K() {
            Qo.writeFile(A, "", (Y) => {
                if (Y) return q(Y);
                q()
            })
        }
        Qo.stat(A, (Y, z) => {
            if (!Y && z.isFile()) return q();
            let _ = y27.dirname(A);
            Qo.stat(_, (w, O) => {
                if (w) {
                    if (w.code === "ENOENT") return L27.mkdirs(_, ($) => {
                        if ($) return q($);
                        K()
                    });
                    return q(w)
                }
                if (O.isDirectory()) K();
                else Qo.readdir(_, ($) => {
                    if ($) return q($)
                })
            })
        })
    }

    function pJ3(A) {
        let q;
        try {
            q = Qo.statSync(A)
        } catch {}
        if (q && q.isFile()) return;
        let K = y27.dirname(A);
        try {
            if (!Qo.statSync(K).isDirectory()) Qo.readdirSync(K)
        } catch (Y) {
            if (Y && Y.code === "ENOENT") L27.mkdirsSync(K);
            else throw Y
        }
        Qo.writeFileSync(A, "")
    }
    R27.exports = {
        createFile: gJ3(FJ3),
        createFileSync: pJ3
    }
})
// @from(Ln 110350, Col 4)
x27 = x((MT_, b27) => {
    var QJ3 = Ew().fromCallback,
        S27 = x6("path"),
        Uo = Y_(),
        C27 = DC(),
        UJ3 = po().pathExists,
        {
            areIdentical: I27
        } = zq6();

    function dJ3(A, q, K) {
        function Y(z, _) {
            Uo.link(z, _, (w) => {
                if (w) return K(w);
                K(null)
            })
        }
        Uo.lstat(q, (z, _) => {
            Uo.lstat(A, (w, O) => {
                if (w) return w.message = w.message.replace("lstat", "ensureLink"), K(w);
                if (_ && I27(O, _)) return K(null);
                let $ = S27.dirname(q);
                UJ3($, (H, j) => {
                    if (H) return K(H);
                    if (j) return Y(A, q);
                    C27.mkdirs($, (J) => {
                        if (J) return K(J);
                        Y(A, q)
                    })
                })
            })
        })
    }

    function cJ3(A, q) {
        let K;
        try {
            K = Uo.lstatSync(q)
        } catch {}
        try {
            let _ = Uo.lstatSync(A);
            if (K && I27(_, K)) return
        } catch (_) {
            throw _.message = _.message.replace("lstat", "ensureLink"), _
        }
        let Y = S27.dirname(q);
        if (Uo.existsSync(Y)) return Uo.linkSync(A, q);
        return C27.mkdirsSync(Y), Uo.linkSync(A, q)
    }
    b27.exports = {
        createLink: QJ3(dJ3),
        createLinkSync: cJ3
    }
})
// @from(Ln 110404, Col 4)
m27 = x((DT_, u27) => {
    var co = x6("path"),
        vI6 = Y_(),
        lJ3 = po().pathExists;

    function iJ3(A, q, K) {
        if (co.isAbsolute(A)) return vI6.lstat(A, (Y) => {
            if (Y) return Y.message = Y.message.replace("lstat", "ensureSymlink"), K(Y);
            return K(null, {
                toCwd: A,
                toDst: A
            })
        });
        else {
            let Y = co.dirname(q),
                z = co.join(Y, A);
            return lJ3(z, (_, w) => {
                if (_) return K(_);
                if (w) return K(null, {
                    toCwd: z,
                    toDst: A
                });
                else return vI6.lstat(A, (O) => {
                    if (O) return O.message = O.message.replace("lstat", "ensureSymlink"), K(O);
                    return K(null, {
                        toCwd: A,
                        toDst: co.relative(Y, A)
                    })
                })
            })
        }
    }

    function nJ3(A, q) {
        let K;
        if (co.isAbsolute(A)) {
            if (K = vI6.existsSync(A), !K) throw Error("absolute srcpath does not exist");
            return {
                toCwd: A,
                toDst: A
            }
        } else {
            let Y = co.dirname(q),
                z = co.join(Y, A);
            if (K = vI6.existsSync(z), K) return {
                toCwd: z,
                toDst: A
            };
            else {
                if (K = vI6.existsSync(A), !K) throw Error("relative srcpath does not exist");
                return {
                    toCwd: A,
                    toDst: co.relative(Y, A)
                }
            }
        }
    }
    u27.exports = {
        symlinkPaths: iJ3,
        symlinkPathsSync: nJ3
    }
})
// @from(Ln 110466, Col 4)
F27 = x((XT_, g27) => {
    var B27 = Y_();

    function rJ3(A, q, K) {
        if (K = typeof q === "function" ? q : K, q = typeof q === "function" ? !1 : q, q) return K(null, q);
        B27.lstat(A, (Y, z) => {
            if (Y) return K(null, "file");
            q = z && z.isDirectory() ? "dir" : "file", K(null, q)
        })
    }

    function oJ3(A, q) {
        let K;
        if (q) return q;
        try {
            K = B27.lstatSync(A)
        } catch {
            return "file"
        }
        return K && K.isDirectory() ? "dir" : "file"
    }
    g27.exports = {
        symlinkType: rJ3,
        symlinkTypeSync: oJ3
    }
})
// @from(Ln 110492, Col 4)
n27 = x((PT_, i27) => {
    var aJ3 = Ew().fromCallback,
        Q27 = x6("path"),
        XC = Yq6(),
        U27 = DC(),
        sJ3 = U27.mkdirs,
        tJ3 = U27.mkdirsSync,
        d27 = m27(),
        eJ3 = d27.symlinkPaths,
        AM3 = d27.symlinkPathsSync,
        c27 = F27(),
        qM3 = c27.symlinkType,
        KM3 = c27.symlinkTypeSync,
        YM3 = po().pathExists,
        {
            areIdentical: l27
        } = zq6();

    function zM3(A, q, K, Y) {
        Y = typeof K === "function" ? K : Y, K = typeof K === "function" ? !1 : K, XC.lstat(q, (z, _) => {
            if (!z && _.isSymbolicLink()) Promise.all([XC.stat(A), XC.stat(q)]).then(([w, O]) => {
                if (l27(w, O)) return Y(null);
                p27(A, q, K, Y)
            });
            else p27(A, q, K, Y)
        })
    }

    function p27(A, q, K, Y) {
        eJ3(A, q, (z, _) => {
            if (z) return Y(z);
            A = _.toDst, qM3(_.toCwd, K, (w, O) => {
                if (w) return Y(w);
                let $ = Q27.dirname(q);
                YM3($, (H, j) => {
                    if (H) return Y(H);
                    if (j) return XC.symlink(A, q, O, Y);
                    sJ3($, (J) => {
                        if (J) return Y(J);
                        XC.symlink(A, q, O, Y)
                    })
                })
            })
        })
    }

    function _M3(A, q, K) {
        let Y;
        try {
            Y = XC.lstatSync(q)
        } catch {}
        if (Y && Y.isSymbolicLink()) {
            let O = XC.statSync(A),
                $ = XC.statSync(q);
            if (l27(O, $)) return
        }
        let z = AM3(A, q);
        A = z.toDst, K = KM3(z.toCwd, K);
        let _ = Q27.dirname(q);
        if (XC.existsSync(_)) return XC.symlinkSync(A, q, K);
        return tJ3(_), XC.symlinkSync(A, q, K)
    }
    i27.exports = {
        createSymlink: aJ3(zM3),
        createSymlinkSync: _M3
    }
})
// @from(Ln 110559, Col 4)
qw7 = x((WT_, Aw7) => {
    var {
        createFile: r27,
        createFileSync: o27
    } = h27(), {
        createLink: a27,
        createLinkSync: s27
    } = x27(), {
        createSymlink: t27,
        createSymlinkSync: e27
    } = n27();
    Aw7.exports = {
        createFile: r27,
        createFileSync: o27,
        ensureFile: r27,
        ensureFileSync: o27,
        createLink: a27,
        createLinkSync: s27,
        ensureLink: a27,
        ensureLinkSync: s27,
        createSymlink: t27,
        createSymlinkSync: e27,
        ensureSymlink: t27,
        ensureSymlinkSync: e27
    }
})
// @from(Ln 110585, Col 4)
KM6 = x((ZT_, Kw7) => {
    function wM3(A, {
        EOL: q = `
`,
        finalEOL: K = !0,
        replacer: Y = null,
        spaces: z
    } = {}) {
        let _ = K ? q : "";
        return JSON.stringify(A, Y, z).replace(/\n/g, q) + _
    }

    function OM3(A) {
        if (Buffer.isBuffer(A)) A = A.toString("utf8");
        return A.replace(/^\uFEFF/, "")
    }
    Kw7.exports = {
        stringify: wM3,
        stripBom: OM3
    }
})
// @from(Ln 110606, Col 4)
m98 = x((GT_, _w7) => {
    var YM6;
    try {
        YM6 = Y_()
    } catch (A) {
        YM6 = x6("fs")
    }
    var qY1 = Ew(),
        {
            stringify: Yw7,
            stripBom: zw7
        } = KM6();
    async function $M3(A, q = {}) {
        if (typeof q === "string") q = {
            encoding: q
        };
        let K = q.fs || YM6,
            Y = "throws" in q ? q.throws : !0,
            z = await qY1.fromCallback(K.readFile)(A, q);
        z = zw7(z);
        let _;
        try {
            _ = JSON.parse(z, q ? q.reviver : null)
        } catch (w) {
            if (Y) throw w.message = `${A}: ${w.message}`, w;
            else return null
        }
        return _
    }
    var HM3 = qY1.fromPromise($M3);

    function jM3(A, q = {}) {
        if (typeof q === "string") q = {
            encoding: q
        };
        let K = q.fs || YM6,
            Y = "throws" in q ? q.throws : !0;
        try {
            let z = K.readFileSync(A, q);
            return z = zw7(z), JSON.parse(z, q.reviver)
        } catch (z) {
            if (Y) throw z.message = `${A}: ${z.message}`, z;
            else return null
        }
    }
    async function JM3(A, q, K = {}) {
        let Y = K.fs || YM6,
            z = Yw7(q, K);
        await qY1.fromCallback(Y.writeFile)(A, z, K)
    }
    var MM3 = qY1.fromPromise(JM3);

    function DM3(A, q, K = {}) {
        let Y = K.fs || YM6,
            z = Yw7(q, K);
        return Y.writeFileSync(A, z, K)
    }
    var XM3 = {
        readFile: HM3,
        readFileSync: jM3,
        writeFile: MM3,
        writeFileSync: DM3
    };
    _w7.exports = XM3
})
// @from(Ln 110671, Col 4)
Ow7 = x((fT_, ww7) => {
    var KY1 = m98();
    ww7.exports = {
        readJson: KY1.readFile,
        readJsonSync: KY1.readFileSync,
        writeJson: KY1.writeFile,
        writeJsonSync: KY1.writeFileSync
    }
})
// @from(Ln 110680, Col 4)
YY1 = x((TT_, jw7) => {
    var PM3 = Ew().fromCallback,
        NI6 = Y_(),
        $w7 = x6("path"),
        Hw7 = DC(),
        WM3 = po().pathExists;

    function ZM3(A, q, K, Y) {
        if (typeof K === "function") Y = K, K = "utf8";
        let z = $w7.dirname(A);
        WM3(z, (_, w) => {
            if (_) return Y(_);
            if (w) return NI6.writeFile(A, q, K, Y);
            Hw7.mkdirs(z, (O) => {
                if (O) return Y(O);
                NI6.writeFile(A, q, K, Y)
            })
        })
    }

    function GM3(A, ...q) {
        let K = $w7.dirname(A);
        if (NI6.existsSync(K)) return NI6.writeFileSync(A, ...q);
        Hw7.mkdirsSync(K), NI6.writeFileSync(A, ...q)
    }
    jw7.exports = {
        outputFile: PM3(ZM3),
        outputFileSync: GM3
    }
})
// @from(Ln 110710, Col 4)
Mw7 = x((vT_, Jw7) => {
    var {
        stringify: fM3
    } = KM6(), {
        outputFile: TM3
    } = YY1();
    async function vM3(A, q, K = {}) {
        let Y = fM3(q, K);
        await TM3(A, Y, K)
    }
    Jw7.exports = vM3
})
// @from(Ln 110722, Col 4)
Xw7 = x((NT_, Dw7) => {
    var {
        stringify: NM3
    } = KM6(), {
        outputFileSync: VM3
    } = YY1();

    function kM3(A, q, K) {
        let Y = NM3(q, K);
        VM3(A, Y, K)
    }
    Dw7.exports = kM3
})
// @from(Ln 110735, Col 4)
Ww7 = x((VT_, Pw7) => {
    var EM3 = Ew().fromPromise,
        CG = Ow7();
    CG.outputJson = EM3(Mw7());
    CG.outputJsonSync = Xw7();
    CG.outputJSON = CG.outputJson;
    CG.outputJSONSync = CG.outputJsonSync;
    CG.writeJSON = CG.writeJson;
    CG.writeJSONSync = CG.writeJsonSync;
    CG.readJSON = CG.readJson;
    CG.readJSONSync = CG.readJsonSync;
    Pw7.exports = CG
})
// @from(Ln 110748, Col 4)
vw7 = x((kT_, Tw7) => {
    var yM3 = Y_(),
        g98 = x6("path"),
        LM3 = s91().copy,
        fw7 = TI6().remove,
        RM3 = DC().mkdirp,
        hM3 = po().pathExists,
        Zw7 = zq6();

    function SM3(A, q, K, Y) {
        if (typeof K === "function") Y = K, K = {};
        K = K || {};
        let z = K.overwrite || K.clobber || !1;
        Zw7.checkPaths(A, q, "move", K, (_, w) => {
            if (_) return Y(_);
            let {
                srcStat: O,
                isChangingCase: $ = !1
            } = w;
            Zw7.checkParentPaths(A, O, q, "move", (H) => {
                if (H) return Y(H);
                if (CM3(q)) return Gw7(A, q, z, $, Y);
                RM3(g98.dirname(q), (j) => {
                    if (j) return Y(j);
                    return Gw7(A, q, z, $, Y)
                })
            })
        })
    }

    function CM3(A) {
        let q = g98.dirname(A);
        return g98.parse(q).root === q
    }

    function Gw7(A, q, K, Y, z) {
        if (Y) return B98(A, q, K, z);
        if (K) return fw7(q, (_) => {
            if (_) return z(_);
            return B98(A, q, K, z)
        });
        hM3(q, (_, w) => {
            if (_) return z(_);
            if (w) return z(Error("dest already exists."));
            return B98(A, q, K, z)
        })
    }

    function B98(A, q, K, Y) {
        yM3.rename(A, q, (z) => {
            if (!z) return Y();
            if (z.code !== "EXDEV") return Y(z);
            return IM3(A, q, K, Y)
        })
    }

    function IM3(A, q, K, Y) {
        LM3(A, q, {
            overwrite: K,
            errorOnExist: !0
        }, (_) => {
            if (_) return Y(_);
            return fw7(A, Y)
        })
    }
    Tw7.exports = SM3
})
// @from(Ln 110815, Col 4)
yw7 = x((ET_, Ew7) => {
    var Vw7 = Y_(),
        p98 = x6("path"),
        bM3 = s91().copySync,
        kw7 = TI6().removeSync,
        xM3 = DC().mkdirpSync,
        Nw7 = zq6();

    function uM3(A, q, K) {
        K = K || {};
        let Y = K.overwrite || K.clobber || !1,
            {
                srcStat: z,
                isChangingCase: _ = !1
            } = Nw7.checkPathsSync(A, q, "move", K);
        if (Nw7.checkParentPathsSync(A, z, q, "move"), !mM3(q)) xM3(p98.dirname(q));
        return BM3(A, q, Y, _)
    }

    function mM3(A) {
        let q = p98.dirname(A);
        return p98.parse(q).root === q
    }

    function BM3(A, q, K, Y) {
        if (Y) return F98(A, q, K);
        if (K) return kw7(q), F98(A, q, K);
        if (Vw7.existsSync(q)) throw Error("dest already exists.");
        return F98(A, q, K)
    }

    function F98(A, q, K) {
        try {
            Vw7.renameSync(A, q)
        } catch (Y) {
            if (Y.code !== "EXDEV") throw Y;
            return gM3(A, q, K)
        }
    }

    function gM3(A, q, K) {
        return bM3(A, q, {
            overwrite: K,
            errorOnExist: !0
        }), kw7(A)
    }
    Ew7.exports = uM3
})
// @from(Ln 110863, Col 4)
Rw7 = x((yT_, Lw7) => {
    var FM3 = Ew().fromCallback;
    Lw7.exports = {
        move: FM3(vw7()),
        moveSync: yw7()
    }
})
// @from(Ln 110870, Col 4)
Sw7 = x((LT_, hw7) => {
    hw7.exports = {
        ...Yq6(),
        ...s91(),
        ...E27(),
        ...qw7(),
        ...Ww7(),
        ...DC(),
        ...Rw7(),
        ...YY1(),
        ...po(),
        ...TI6()
    }
})
// @from(Ln 110884, Col 4)
_q6 = x((Q98) => {
    var Cw7 = Ew().fromCallback,
        eT = Y_(),
        pM3 = ["access", "appendFile", "chmod", "chown", "close", "copyFile", "fchmod", "fchown", "fdatasync", "fstat", "fsync", "ftruncate", "futimes", "lchmod", "lchown", "link", "lstat", "mkdir", "mkdtemp", "open", "opendir", "readdir", "readFile", "readlink", "realpath", "rename", "rm", "rmdir", "stat", "symlink", "truncate", "unlink", "utimes", "writeFile"].filter((A) => {
            return typeof eT[A] === "function"
        });
    Object.assign(Q98, eT);
    pM3.forEach((A) => {
        Q98[A] = Cw7(eT[A])
    });
    Q98.exists = function(A, q) {
        if (typeof q === "function") return eT.exists(A, q);
        return new Promise((K) => {
            return eT.exists(A, K)
        })
    };
    Q98.read = function(A, q, K, Y, z, _) {
        if (typeof _ === "function") return eT.read(A, q, K, Y, z, _);
        return new Promise((w, O) => {
            eT.read(A, q, K, Y, z, ($, H, j) => {
                if ($) return O($);
                w({
                    bytesRead: H,
                    buffer: j
                })
            })
        })
    };
    Q98.write = function(A, q, ...K) {
        if (typeof K[K.length - 1] === "function") return eT.write(A, q, ...K);
        return new Promise((Y, z) => {
            eT.write(A, q, ...K, (_, w, O) => {
                if (_) return z(_);
                Y({
                    bytesWritten: w,
                    buffer: O
                })
            })
        })
    };
    if (typeof eT.writev === "function") Q98.writev = function(A, q, ...K) {
        if (typeof K[K.length - 1] === "function") return eT.writev(A, q, ...K);
        return new Promise((Y, z) => {
            eT.writev(A, q, ...K, (_, w, O) => {
                if (_) return z(_);
                Y({
                    bytesWritten: w,
                    buffers: O
                })
            })
        })
    };
    if (typeof eT.realpath.native === "function") Q98.realpath.native = Cw7(eT.realpath.native);
    else process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003")
})
// @from(Ln 110939, Col 4)
bw7 = x((lM3, Iw7) => {
    var cM3 = x6("path");
    lM3.checkPath = function(q) {
        if (process.platform === "win32") {
            if (/[<>:"|?*]/.test(q.replace(cM3.parse(q).root, ""))) {
                let Y = Error(`Path contains invalid characters: ${q}`);
                throw Y.code = "EINVAL", Y
            }
        }
    }
})
// @from(Ln 110950, Col 4)
Bw7 = x((nM3, U98) => {
    var xw7 = _q6(),
        {
            checkPath: uw7
        } = bw7(),
        mw7 = (A) => {
            let q = {
                mode: 511
            };
            if (typeof A === "number") return A;
            return {
                ...q,
                ...A
            }.mode
        };
    nM3.makeDir = async (A, q) => {
        return uw7(A), xw7.mkdir(A, {
            mode: mw7(q),
            recursive: !0
        })
    };
    nM3.makeDirSync = (A, q) => {
        return uw7(A), xw7.mkdirSync(A, {
            mode: mw7(q),
            recursive: !0
        })
    }
})
// @from(Ln 110978, Col 4)
PC = x((CT_, gw7) => {
    var aM3 = Ew().fromPromise,
        {
            makeDir: sM3,
            makeDirSync: d98
        } = Bw7(),
        c98 = aM3(sM3);
    gw7.exports = {
        mkdirs: c98,
        mkdirsSync: d98,
        mkdirp: c98,
        mkdirpSync: d98,
        ensureDir: c98,
        ensureDirSync: d98
    }
})
// @from(Ln 110994, Col 4)
lo = x((IT_, pw7) => {
    var tM3 = Ew().fromPromise,
        Fw7 = _q6();

    function eM3(A) {
        return Fw7.access(A).then(() => !0).catch(() => !1)
    }
    pw7.exports = {
        pathExists: tM3(eM3),
        pathExistsSync: Fw7.existsSync
    }
})
// @from(Ln 111006, Col 4)
l98 = x((bT_, Qw7) => {
    var zM6 = Y_();

    function AD3(A, q, K, Y) {
        zM6.open(A, "r+", (z, _) => {
            if (z) return Y(z);
            zM6.futimes(_, q, K, (w) => {
                zM6.close(_, (O) => {
                    if (Y) Y(w || O)
                })
            })
        })
    }

    function qD3(A, q, K) {
        let Y = zM6.openSync(A, "r+");
        return zM6.futimesSync(Y, q, K), zM6.closeSync(Y)
    }
    Qw7.exports = {
        utimesMillis: AD3,
        utimesMillisSync: qD3
    }
})
// @from(Ln 111029, Col 4)
wq6 = x((xT_, cw7) => {
    var _M6 = _q6(),
        sD = x6("path"),
        KD3 = x6("util");

    function YD3(A, q, K) {
        let Y = K.dereference ? (z) => _M6.stat(z, {
            bigint: !0
        }) : (z) => _M6.lstat(z, {
            bigint: !0
        });
        return Promise.all([Y(A), Y(q).catch((z) => {
            if (z.code === "ENOENT") return null;
            throw z
        })]).then(([z, _]) => ({
            srcStat: z,
            destStat: _
        }))
    }

    function zD3(A, q, K) {
        let Y, z = K.dereference ? (w) => _M6.statSync(w, {
                bigint: !0
            }) : (w) => _M6.lstatSync(w, {
                bigint: !0
            }),
            _ = z(A);
        try {
            Y = z(q)
        } catch (w) {
            if (w.code === "ENOENT") return {
                srcStat: _,
                destStat: null
            };
            throw w
        }
        return {
            srcStat: _,
            destStat: Y
        }
    }

    function _D3(A, q, K, Y, z) {
        KD3.callbackify(YD3)(A, q, Y, (_, w) => {
            if (_) return z(_);
            let {
                srcStat: O,
                destStat: $
            } = w;
            if ($) {
                if (VI6(O, $)) {
                    let H = sD.basename(A),
                        j = sD.basename(q);
                    if (K === "move" && H !== j && H.toLowerCase() === j.toLowerCase()) return z(null, {
                        srcStat: O,
                        destStat: $,
                        isChangingCase: !0
                    });
                    return z(Error("Source and destination must not be the same."))
                }
                if (O.isDirectory() && !$.isDirectory()) return z(Error(`Cannot overwrite non-directory '${q}' with directory '${A}'.`));
                if (!O.isDirectory() && $.isDirectory()) return z(Error(`Cannot overwrite directory '${q}' with non-directory '${A}'.`))
            }
            if (O.isDirectory() && i98(A, q)) return z(Error(zY1(A, q, K)));
            return z(null, {
                srcStat: O,
                destStat: $
            })
        })
    }

    function wD3(A, q, K, Y) {
        let {
            srcStat: z,
            destStat: _
        } = zD3(A, q, Y);
        if (_) {
            if (VI6(z, _)) {
                let w = sD.basename(A),
                    O = sD.basename(q);
                if (K === "move" && w !== O && w.toLowerCase() === O.toLowerCase()) return {
                    srcStat: z,
                    destStat: _,
                    isChangingCase: !0
                };
                throw Error("Source and destination must not be the same.")
            }
            if (z.isDirectory() && !_.isDirectory()) throw Error(`Cannot overwrite non-directory '${q}' with directory '${A}'.`);
            if (!z.isDirectory() && _.isDirectory()) throw Error(`Cannot overwrite directory '${q}' with non-directory '${A}'.`)
        }
        if (z.isDirectory() && i98(A, q)) throw Error(zY1(A, q, K));
        return {
            srcStat: z,
            destStat: _
        }
    }

    function Uw7(A, q, K, Y, z) {
        let _ = sD.resolve(sD.dirname(A)),
            w = sD.resolve(sD.dirname(K));
        if (w === _ || w === sD.parse(w).root) return z();
        _M6.stat(w, {
            bigint: !0
        }, (O, $) => {
            if (O) {
                if (O.code === "ENOENT") return z();
                return z(O)
            }
            if (VI6(q, $)) return z(Error(zY1(A, K, Y)));
            return Uw7(A, q, w, Y, z)
        })
    }

    function dw7(A, q, K, Y) {
        let z = sD.resolve(sD.dirname(A)),
            _ = sD.resolve(sD.dirname(K));
        if (_ === z || _ === sD.parse(_).root) return;
        let w;
        try {
            w = _M6.statSync(_, {
                bigint: !0
            })
        } catch (O) {
            if (O.code === "ENOENT") return;
            throw O
        }
        if (VI6(q, w)) throw Error(zY1(A, K, Y));
        return dw7(A, q, _, Y)
    }

    function VI6(A, q) {
        return q.ino && q.dev && q.ino === A.ino && q.dev === A.dev
    }

    function i98(A, q) {
        let K = sD.resolve(A).split(sD.sep).filter((z) => z),
            Y = sD.resolve(q).split(sD.sep).filter((z) => z);
        return K.reduce((z, _, w) => z && Y[w] === _, !0)
    }

    function zY1(A, q, K) {
        return `Cannot ${K} '${A}' to a subdirectory of itself, '${q}'.`
    }
    cw7.exports = {
        checkPaths: _D3,
        checkPathsSync: wD3,
        checkParentPaths: Uw7,
        checkParentPathsSync: dw7,
        isSrcSubdir: i98,
        areIdentical: VI6
    }
})
// @from(Ln 111181, Col 4)
tw7 = x((uT_, sw7) => {
    var Av = Y_(),
        kI6 = x6("path"),
        OD3 = PC().mkdirs,
        $D3 = lo().pathExists,
        HD3 = l98().utimesMillis,
        EI6 = wq6();

    function jD3(A, q, K, Y) {
        if (typeof K === "function" && !Y) Y = K, K = {};
        else if (typeof K === "function") K = {
            filter: K
        };
        if (Y = Y || function() {}, K = K || {}, K.clobber = "clobber" in K ? !!K.clobber : !0, K.overwrite = "overwrite" in K ? !!K.overwrite : K.clobber, K.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0001");
        EI6.checkPaths(A, q, "copy", K, (z, _) => {
            if (z) return Y(z);
            let {
                srcStat: w,
                destStat: O
            } = _;
            EI6.checkParentPaths(A, w, q, "copy", ($) => {
                if ($) return Y($);
                if (K.filter) return nw7(lw7, O, A, q, K, Y);
                return lw7(O, A, q, K, Y)
            })
        })
    }

    function lw7(A, q, K, Y, z) {
        let _ = kI6.dirname(K);
        $D3(_, (w, O) => {
            if (w) return z(w);
            if (O) return _Y1(A, q, K, Y, z);
            OD3(_, ($) => {
                if ($) return z($);
                return _Y1(A, q, K, Y, z)
            })
        })
    }

    function nw7(A, q, K, Y, z, _) {
        Promise.resolve(z.filter(K, Y)).then((w) => {
            if (w) return A(q, K, Y, z, _);
            return _()
        }, (w) => _(w))
    }

    function JD3(A, q, K, Y, z) {
        if (Y.filter) return nw7(_Y1, A, q, K, Y, z);
        return _Y1(A, q, K, Y, z)
    }

    function _Y1(A, q, K, Y, z) {
        (Y.dereference ? Av.stat : Av.lstat)(q, (w, O) => {
            if (w) return z(w);
            if (O.isDirectory()) return GD3(O, A, q, K, Y, z);
            else if (O.isFile() || O.isCharacterDevice() || O.isBlockDevice()) return MD3(O, A, q, K, Y, z);
            else if (O.isSymbolicLink()) return vD3(A, q, K, Y, z);
            else if (O.isSocket()) return z(Error(`Cannot copy a socket file: ${q}`));
            else if (O.isFIFO()) return z(Error(`Cannot copy a FIFO pipe: ${q}`));
            return z(Error(`Unknown file: ${q}`))
        })
    }

    function MD3(A, q, K, Y, z, _) {
        if (!q) return rw7(A, K, Y, z, _);
        return DD3(A, K, Y, z, _)
    }

    function DD3(A, q, K, Y, z) {
        if (Y.overwrite) Av.unlink(K, (_) => {
            if (_) return z(_);
            return rw7(A, q, K, Y, z)
        });
        else if (Y.errorOnExist) return z(Error(`'${K}' already exists`));
        else return z()
    }

    function rw7(A, q, K, Y, z) {
        Av.copyFile(q, K, (_) => {
            if (_) return z(_);
            if (Y.preserveTimestamps) return XD3(A.mode, q, K, z);
            return wY1(K, A.mode, z)
        })
    }

    function XD3(A, q, K, Y) {
        if (PD3(A)) return WD3(K, A, (z) => {
            if (z) return Y(z);
            return iw7(A, q, K, Y)
        });
        return iw7(A, q, K, Y)
    }

    function PD3(A) {
        return (A & 128) === 0
    }

    function WD3(A, q, K) {
        return wY1(A, q | 128, K)
    }

    function iw7(A, q, K, Y) {
        ZD3(q, K, (z) => {
            if (z) return Y(z);
            return wY1(K, A, Y)
        })
    }

    function wY1(A, q, K) {
        return Av.chmod(A, q, K)
    }

    function ZD3(A, q, K) {
        Av.stat(A, (Y, z) => {
            if (Y) return K(Y);
            return HD3(q, z.atime, z.mtime, K)
        })
    }

    function GD3(A, q, K, Y, z, _) {
        if (!q) return fD3(A.mode, K, Y, z, _);
        return ow7(K, Y, z, _)
    }

    function fD3(A, q, K, Y, z) {
        Av.mkdir(K, (_) => {
            if (_) return z(_);
            ow7(q, K, Y, (w) => {
                if (w) return z(w);
                return wY1(K, A, z)
            })
        })
    }

    function ow7(A, q, K, Y) {
        Av.readdir(A, (z, _) => {
            if (z) return Y(z);
            return aw7(_, A, q, K, Y)
        })
    }

    function aw7(A, q, K, Y, z) {
        let _ = A.pop();
        if (!_) return z();
        return TD3(A, _, q, K, Y, z)
    }

    function TD3(A, q, K, Y, z, _) {
        let w = kI6.join(K, q),
            O = kI6.join(Y, q);
        EI6.checkPaths(w, O, "copy", z, ($, H) => {
            if ($) return _($);
            let {
                destStat: j
            } = H;
            JD3(j, w, O, z, (J) => {
                if (J) return _(J);
                return aw7(A, K, Y, z, _)
            })
        })
    }

    function vD3(A, q, K, Y, z) {
        Av.readlink(q, (_, w) => {
            if (_) return z(_);
            if (Y.dereference) w = kI6.resolve(process.cwd(), w);
            if (!A) return Av.symlink(w, K, z);
            else Av.readlink(K, (O, $) => {
                if (O) {
                    if (O.code === "EINVAL" || O.code === "UNKNOWN") return Av.symlink(w, K, z);
                    return z(O)
                }
                if (Y.dereference) $ = kI6.resolve(process.cwd(), $);
                if (EI6.isSrcSubdir(w, $)) return z(Error(`Cannot copy '${w}' to a subdirectory of itself, '${$}'.`));
                if (A.isDirectory() && EI6.isSrcSubdir($, w)) return z(Error(`Cannot overwrite '${$}' with '${w}'.`));
                return ND3(w, K, z)
            })
        })
    }

    function ND3(A, q, K) {
        Av.unlink(q, (Y) => {
            if (Y) return K(Y);
            return Av.symlink(A, q, K)
        })
    }
    sw7.exports = jD3
})
// @from(Ln 111372, Col 4)
YO7 = x((mT_, KO7) => {
    var uW = Y_(),
        yI6 = x6("path"),
        VD3 = PC().mkdirsSync,
        kD3 = l98().utimesMillisSync,
        LI6 = wq6();

    function ED3(A, q, K) {
        if (typeof K === "function") K = {
            filter: K
        };
        if (K = K || {}, K.clobber = "clobber" in K ? !!K.clobber : !0, K.overwrite = "overwrite" in K ? !!K.overwrite : K.clobber, K.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0002");
        let {
            srcStat: Y,
            destStat: z
        } = LI6.checkPathsSync(A, q, "copy", K);
        return LI6.checkParentPathsSync(A, Y, q, "copy"), yD3(z, A, q, K)
    }

    function yD3(A, q, K, Y) {
        if (Y.filter && !Y.filter(q, K)) return;
        let z = yI6.dirname(K);
        if (!uW.existsSync(z)) VD3(z);
        return ew7(A, q, K, Y)
    }

    function LD3(A, q, K, Y) {
        if (Y.filter && !Y.filter(q, K)) return;
        return ew7(A, q, K, Y)
    }

    function ew7(A, q, K, Y) {
        let _ = (Y.dereference ? uW.statSync : uW.lstatSync)(q);
        if (_.isDirectory()) return xD3(_, A, q, K, Y);
        else if (_.isFile() || _.isCharacterDevice() || _.isBlockDevice()) return RD3(_, A, q, K, Y);
        else if (_.isSymbolicLink()) return BD3(A, q, K, Y);
        else if (_.isSocket()) throw Error(`Cannot copy a socket file: ${q}`);
        else if (_.isFIFO()) throw Error(`Cannot copy a FIFO pipe: ${q}`);
        throw Error(`Unknown file: ${q}`)
    }

    function RD3(A, q, K, Y, z) {
        if (!q) return AO7(A, K, Y, z);
        return hD3(A, K, Y, z)
    }

    function hD3(A, q, K, Y) {
        if (Y.overwrite) return uW.unlinkSync(K), AO7(A, q, K, Y);
        else if (Y.errorOnExist) throw Error(`'${K}' already exists`)
    }

    function AO7(A, q, K, Y) {
        if (uW.copyFileSync(q, K), Y.preserveTimestamps) SD3(A.mode, q, K);
        return n98(K, A.mode)
    }

    function SD3(A, q, K) {
        if (CD3(A)) ID3(K, A);
        return bD3(q, K)
    }

    function CD3(A) {
        return (A & 128) === 0
    }

    function ID3(A, q) {
        return n98(A, q | 128)
    }

    function n98(A, q) {
        return uW.chmodSync(A, q)
    }

    function bD3(A, q) {
        let K = uW.statSync(A);
        return kD3(q, K.atime, K.mtime)
    }

    function xD3(A, q, K, Y, z) {
        if (!q) return uD3(A.mode, K, Y, z);
        return qO7(K, Y, z)
    }

    function uD3(A, q, K, Y) {
        return uW.mkdirSync(K), qO7(q, K, Y), n98(K, A)
    }

    function qO7(A, q, K) {
        uW.readdirSync(A).forEach((Y) => mD3(Y, A, q, K))
    }

    function mD3(A, q, K, Y) {
        let z = yI6.join(q, A),
            _ = yI6.join(K, A),
            {
                destStat: w
            } = LI6.checkPathsSync(z, _, "copy", Y);
        return LD3(w, z, _, Y)
    }

    function BD3(A, q, K, Y) {
        let z = uW.readlinkSync(q);
        if (Y.dereference) z = yI6.resolve(process.cwd(), z);
        if (!A) return uW.symlinkSync(z, K);
        else {
            let _;
            try {
                _ = uW.readlinkSync(K)
            } catch (w) {
                if (w.code === "EINVAL" || w.code === "UNKNOWN") return uW.symlinkSync(z, K);
                throw w
            }
            if (Y.dereference) _ = yI6.resolve(process.cwd(), _);
            if (LI6.isSrcSubdir(z, _)) throw Error(`Cannot copy '${z}' to a subdirectory of itself, '${_}'.`);
            if (uW.statSync(K).isDirectory() && LI6.isSrcSubdir(_, z)) throw Error(`Cannot overwrite '${_}' with '${z}'.`);
            return gD3(z, K)
        }
    }

    function gD3(A, q) {
        return uW.unlinkSync(q), uW.symlinkSync(A, q)
    }
    KO7.exports = ED3
})
// @from(Ln 111498, Col 4)
OY1 = x((BT_, zO7) => {
    var FD3 = Ew().fromCallback;
    zO7.exports = {
        copy: FD3(tw7()),
        copySync: YO7()
    }
})
// @from(Ln 111505, Col 4)
DO7 = x((gT_, MO7) => {
    var _O7 = Y_(),
        HO7 = x6("path"),
        p2 = x6("assert"),
        RI6 = process.platform === "win32";

    function jO7(A) {
        ["unlink", "chmod", "stat", "lstat", "rmdir", "readdir"].forEach((K) => {
            A[K] = A[K] || _O7[K], K = K + "Sync", A[K] = A[K] || _O7[K]
        }), A.maxBusyTries = A.maxBusyTries || 3
    }

    function r98(A, q, K) {
        let Y = 0;
        if (typeof q === "function") K = q, q = {};
        p2(A, "rimraf: missing path"), p2.strictEqual(typeof A, "string", "rimraf: path should be a string"), p2.strictEqual(typeof K, "function", "rimraf: callback function required"), p2(q, "rimraf: invalid options argument provided"), p2.strictEqual(typeof q, "object", "rimraf: options should be object"), jO7(q), wO7(A, q, function z(_) {
            if (_) {
                if ((_.code === "EBUSY" || _.code === "ENOTEMPTY" || _.code === "EPERM") && Y < q.maxBusyTries) {
                    Y++;
                    let w = Y * 100;
                    return setTimeout(() => wO7(A, q, z), w)
                }
                if (_.code === "ENOENT") _ = null
            }
            K(_)
        })
    }

    function wO7(A, q, K) {
        p2(A), p2(q), p2(typeof K === "function"), q.lstat(A, (Y, z) => {
            if (Y && Y.code === "ENOENT") return K(null);
            if (Y && Y.code === "EPERM" && RI6) return OO7(A, q, Y, K);
            if (z && z.isDirectory()) return $Y1(A, q, Y, K);
            q.unlink(A, (_) => {
                if (_) {
                    if (_.code === "ENOENT") return K(null);
                    if (_.code === "EPERM") return RI6 ? OO7(A, q, _, K) : $Y1(A, q, _, K);
                    if (_.code === "EISDIR") return $Y1(A, q, _, K)
                }
                return K(_)
            })
        })
    }

    function OO7(A, q, K, Y) {
        p2(A), p2(q), p2(typeof Y === "function"), q.chmod(A, 438, (z) => {
            if (z) Y(z.code === "ENOENT" ? null : K);
            else q.stat(A, (_, w) => {
                if (_) Y(_.code === "ENOENT" ? null : K);
                else if (w.isDirectory()) $Y1(A, q, K, Y);
                else q.unlink(A, Y)
            })
        })
    }

    function $O7(A, q, K) {
        let Y;
        p2(A), p2(q);
        try {
            q.chmodSync(A, 438)
        } catch (z) {
            if (z.code === "ENOENT") return;
            else throw K
        }
        try {
            Y = q.statSync(A)
        } catch (z) {
            if (z.code === "ENOENT") return;
            else throw K
        }
        if (Y.isDirectory()) HY1(A, q, K);
        else q.unlinkSync(A)
    }

    function $Y1(A, q, K, Y) {
        p2(A), p2(q), p2(typeof Y === "function"), q.rmdir(A, (z) => {
            if (z && (z.code === "ENOTEMPTY" || z.code === "EEXIST" || z.code === "EPERM")) pD3(A, q, Y);
            else if (z && z.code === "ENOTDIR") Y(K);
            else Y(z)
        })
    }

    function pD3(A, q, K) {
        p2(A), p2(q), p2(typeof K === "function"), q.readdir(A, (Y, z) => {
            if (Y) return K(Y);
            let _ = z.length,
                w;
            if (_ === 0) return q.rmdir(A, K);
            z.forEach((O) => {
                r98(HO7.join(A, O), q, ($) => {
                    if (w) return;
                    if ($) return K(w = $);
                    if (--_ === 0) q.rmdir(A, K)
                })
            })
        })
    }

    function JO7(A, q) {
        let K;
        q = q || {}, jO7(q), p2(A, "rimraf: missing path"), p2.strictEqual(typeof A, "string", "rimraf: path should be a string"), p2(q, "rimraf: missing options"), p2.strictEqual(typeof q, "object", "rimraf: options should be object");
        try {
            K = q.lstatSync(A)
        } catch (Y) {
            if (Y.code === "ENOENT") return;
            if (Y.code === "EPERM" && RI6) $O7(A, q, Y)
        }
        try {
            if (K && K.isDirectory()) HY1(A, q, null);
            else q.unlinkSync(A)
        } catch (Y) {
            if (Y.code === "ENOENT") return;
            else if (Y.code === "EPERM") return RI6 ? $O7(A, q, Y) : HY1(A, q, Y);
            else if (Y.code !== "EISDIR") throw Y;
            HY1(A, q, Y)
        }
    }

    function HY1(A, q, K) {
        p2(A), p2(q);
        try {
            q.rmdirSync(A)
        } catch (Y) {
            if (Y.code === "ENOTDIR") throw K;
            else if (Y.code === "ENOTEMPTY" || Y.code === "EEXIST" || Y.code === "EPERM") QD3(A, q);
            else if (Y.code !== "ENOENT") throw Y
        }
    }

    function QD3(A, q) {
        if (p2(A), p2(q), q.readdirSync(A).forEach((K) => JO7(HO7.join(A, K), q)), RI6) {
            let K = Date.now();
            do try {
                return q.rmdirSync(A, q)
            } catch {}
            while (Date.now() - K < 500)
        } else return q.rmdirSync(A, q)
    }
    MO7.exports = r98;
    r98.sync = JO7
})
// @from(Ln 111646, Col 4)
hI6 = x((FT_, PO7) => {
    var jY1 = Y_(),
        UD3 = Ew().fromCallback,
        XO7 = DO7();

    function dD3(A, q) {
        if (jY1.rm) return jY1.rm(A, {
            recursive: !0,
            force: !0
        }, q);
        XO7(A, q)
    }

    function cD3(A) {
        if (jY1.rmSync) return jY1.rmSync(A, {
            recursive: !0,
            force: !0
        });
        XO7.sync(A)
    }
    PO7.exports = {
        remove: UD3(dD3),
        removeSync: cD3
    }
})
// @from(Ln 111671, Col 4)
VO7 = x((pT_, NO7) => {
    var lD3 = Ew().fromPromise,
        GO7 = _q6(),
        fO7 = x6("path"),
        TO7 = PC(),
        vO7 = hI6(),
        WO7 = lD3(async function(q) {
            let K;
            try {
                K = await GO7.readdir(q)
            } catch {
                return TO7.mkdirs(q)
            }
            return Promise.all(K.map((Y) => vO7.remove(fO7.join(q, Y))))
        });

    function ZO7(A) {
        let q;
        try {
            q = GO7.readdirSync(A)
        } catch {
            return TO7.mkdirsSync(A)
        }
        q.forEach((K) => {
            K = fO7.join(A, K), vO7.removeSync(K)
        })
    }
    NO7.exports = {
        emptyDirSync: ZO7,
        emptydirSync: ZO7,
        emptyDir: WO7,
        emptydir: WO7
    }
})
// @from(Ln 111705, Col 4)
LO7 = x((QT_, yO7) => {
    var iD3 = Ew().fromCallback,
        kO7 = x6("path"),
        io = Y_(),
        EO7 = PC();

    function nD3(A, q) {
        function K() {
            io.writeFile(A, "", (Y) => {
                if (Y) return q(Y);
                q()
            })
        }
        io.stat(A, (Y, z) => {
            if (!Y && z.isFile()) return q();
            let _ = kO7.dirname(A);
            io.stat(_, (w, O) => {
                if (w) {
                    if (w.code === "ENOENT") return EO7.mkdirs(_, ($) => {
                        if ($) return q($);
                        K()
                    });
                    return q(w)
                }
                if (O.isDirectory()) K();
                else io.readdir(_, ($) => {
                    if ($) return q($)
                })
            })
        })
    }

    function rD3(A) {
        let q;
        try {
            q = io.statSync(A)
        } catch {}
        if (q && q.isFile()) return;
        let K = kO7.dirname(A);
        try {
            if (!io.statSync(K).isDirectory()) io.readdirSync(K)
        } catch (Y) {
            if (Y && Y.code === "ENOENT") EO7.mkdirsSync(K);
            else throw Y
        }
        io.writeFileSync(A, "")
    }
    yO7.exports = {
        createFile: iD3(nD3),
        createFileSync: rD3
    }
})
// @from(Ln 111757, Col 4)
IO7 = x((UT_, CO7) => {
    var oD3 = Ew().fromCallback,
        RO7 = x6("path"),
        no = Y_(),
        hO7 = PC(),
        aD3 = lo().pathExists,
        {
            areIdentical: SO7
        } = wq6();

    function sD3(A, q, K) {
        function Y(z, _) {
            no.link(z, _, (w) => {
                if (w) return K(w);
                K(null)
            })
        }
        no.lstat(q, (z, _) => {
            no.lstat(A, (w, O) => {
                if (w) return w.message = w.message.replace("lstat", "ensureLink"), K(w);
                if (_ && SO7(O, _)) return K(null);
                let $ = RO7.dirname(q);
                aD3($, (H, j) => {
                    if (H) return K(H);
                    if (j) return Y(A, q);
                    hO7.mkdirs($, (J) => {
                        if (J) return K(J);
                        Y(A, q)
                    })
                })
            })
        })
    }

    function tD3(A, q) {
        let K;
        try {
            K = no.lstatSync(q)
        } catch {}
        try {
            let _ = no.lstatSync(A);
            if (K && SO7(_, K)) return
        } catch (_) {
            throw _.message = _.message.replace("lstat", "ensureLink"), _
        }
        let Y = RO7.dirname(q);
        if (no.existsSync(Y)) return no.linkSync(A, q);
        return hO7.mkdirsSync(Y), no.linkSync(A, q)
    }
    CO7.exports = {
        createLink: oD3(sD3),
        createLinkSync: tD3
    }
})
// @from(Ln 111811, Col 4)
xO7 = x((dT_, bO7) => {
    var ro = x6("path"),
        SI6 = Y_(),
        eD3 = lo().pathExists;

    function AX3(A, q, K) {
        if (ro.isAbsolute(A)) return SI6.lstat(A, (Y) => {
            if (Y) return Y.message = Y.message.replace("lstat", "ensureSymlink"), K(Y);
            return K(null, {
                toCwd: A,
                toDst: A
            })
        });
        else {
            let Y = ro.dirname(q),
                z = ro.join(Y, A);
            return eD3(z, (_, w) => {
                if (_) return K(_);
                if (w) return K(null, {
                    toCwd: z,
                    toDst: A
                });
                else return SI6.lstat(A, (O) => {
                    if (O) return O.message = O.message.replace("lstat", "ensureSymlink"), K(O);
                    return K(null, {
                        toCwd: A,
                        toDst: ro.relative(Y, A)
                    })
                })
            })
        }
    }

    function qX3(A, q) {
        let K;
        if (ro.isAbsolute(A)) {
            if (K = SI6.existsSync(A), !K) throw Error("absolute srcpath does not exist");
            return {
                toCwd: A,
                toDst: A
            }
        } else {
            let Y = ro.dirname(q),
                z = ro.join(Y, A);
            if (K = SI6.existsSync(z), K) return {
                toCwd: z,
                toDst: A
            };
            else {
                if (K = SI6.existsSync(A), !K) throw Error("relative srcpath does not exist");
                return {
                    toCwd: A,
                    toDst: ro.relative(Y, A)
                }
            }
        }
    }
    bO7.exports = {
        symlinkPaths: AX3,
        symlinkPathsSync: qX3
    }
})
// @from(Ln 111873, Col 4)
BO7 = x((cT_, mO7) => {
    var uO7 = Y_();

    function KX3(A, q, K) {
        if (K = typeof q === "function" ? q : K, q = typeof q === "function" ? !1 : q, q) return K(null, q);
        uO7.lstat(A, (Y, z) => {
            if (Y) return K(null, "file");
            q = z && z.isDirectory() ? "dir" : "file", K(null, q)
        })
    }

    function YX3(A, q) {
        let K;
        if (q) return q;
        try {
            K = uO7.lstatSync(A)
        } catch {
            return "file"
        }
        return K && K.isDirectory() ? "dir" : "file"
    }
    mO7.exports = {
        symlinkType: KX3,
        symlinkTypeSync: YX3
    }
})
// @from(Ln 111899, Col 4)
lO7 = x((lT_, cO7) => {
    var zX3 = Ew().fromCallback,
        FO7 = x6("path"),
        WC = _q6(),
        pO7 = PC(),
        _X3 = pO7.mkdirs,
        wX3 = pO7.mkdirsSync,
        QO7 = xO7(),
        OX3 = QO7.symlinkPaths,
        $X3 = QO7.symlinkPathsSync,
        UO7 = BO7(),
        HX3 = UO7.symlinkType,
        jX3 = UO7.symlinkTypeSync,
        JX3 = lo().pathExists,
        {
            areIdentical: dO7
        } = wq6();

    function MX3(A, q, K, Y) {
        Y = typeof K === "function" ? K : Y, K = typeof K === "function" ? !1 : K, WC.lstat(q, (z, _) => {
            if (!z && _.isSymbolicLink()) Promise.all([WC.stat(A), WC.stat(q)]).then(([w, O]) => {
                if (dO7(w, O)) return Y(null);
                gO7(A, q, K, Y)
            });
            else gO7(A, q, K, Y)
        })
    }

    function gO7(A, q, K, Y) {
        OX3(A, q, (z, _) => {
            if (z) return Y(z);
            A = _.toDst, HX3(_.toCwd, K, (w, O) => {
                if (w) return Y(w);
                let $ = FO7.dirname(q);
                JX3($, (H, j) => {
                    if (H) return Y(H);
                    if (j) return WC.symlink(A, q, O, Y);
                    _X3($, (J) => {
                        if (J) return Y(J);
                        WC.symlink(A, q, O, Y)
                    })
                })
            })
        })
    }

    function DX3(A, q, K) {
        let Y;
        try {
            Y = WC.lstatSync(q)
        } catch {}
        if (Y && Y.isSymbolicLink()) {
            let O = WC.statSync(A),
                $ = WC.statSync(q);
            if (dO7(O, $)) return
        }
        let z = $X3(A, q);
        A = z.toDst, K = jX3(z.toCwd, K);
        let _ = FO7.dirname(q);
        if (WC.existsSync(_)) return WC.symlinkSync(A, q, K);
        return wX3(_), WC.symlinkSync(A, q, K)
    }
    cO7.exports = {
        createSymlink: zX3(MX3),
        createSymlinkSync: DX3
    }
})
// @from(Ln 111966, Col 4)
eO7 = x((iT_, tO7) => {
    var {
        createFile: iO7,
        createFileSync: nO7
    } = LO7(), {
        createLink: rO7,
        createLinkSync: oO7
    } = IO7(), {
        createSymlink: aO7,
        createSymlinkSync: sO7
    } = lO7();
    tO7.exports = {
        createFile: iO7,
        createFileSync: nO7,
        ensureFile: iO7,
        ensureFileSync: nO7,
        createLink: rO7,
        createLinkSync: oO7,
        ensureLink: rO7,
        ensureLinkSync: oO7,
        createSymlink: aO7,
        createSymlinkSync: sO7,
        ensureSymlink: aO7,
        ensureSymlinkSync: sO7
    }
})
// @from(Ln 111992, Col 4)
q$7 = x((nT_, A$7) => {
    var JY1 = m98();
    A$7.exports = {
        readJson: JY1.readFile,
        readJsonSync: JY1.readFileSync,
        writeJson: JY1.writeFile,
        writeJsonSync: JY1.writeFileSync
    }
})
// @from(Ln 112001, Col 4)
MY1 = x((rT_, z$7) => {
    var XX3 = Ew().fromCallback,
        CI6 = Y_(),
        K$7 = x6("path"),
        Y$7 = PC(),
        PX3 = lo().pathExists;

    function WX3(A, q, K, Y) {
        if (typeof K === "function") Y = K, K = "utf8";
        let z = K$7.dirname(A);
        PX3(z, (_, w) => {
            if (_) return Y(_);
            if (w) return CI6.writeFile(A, q, K, Y);
            Y$7.mkdirs(z, (O) => {
                if (O) return Y(O);
                CI6.writeFile(A, q, K, Y)
            })
        })
    }

    function ZX3(A, ...q) {
        let K = K$7.dirname(A);
        if (CI6.existsSync(K)) return CI6.writeFileSync(A, ...q);
        Y$7.mkdirsSync(K), CI6.writeFileSync(A, ...q)
    }
    z$7.exports = {
        outputFile: XX3(WX3),
        outputFileSync: ZX3
    }
})
// @from(Ln 112031, Col 4)
w$7 = x((oT_, _$7) => {
    var {
        stringify: GX3
    } = KM6(), {
        outputFile: fX3
    } = MY1();
    async function TX3(A, q, K = {}) {
        let Y = GX3(q, K);
        await fX3(A, Y, K)
    }
    _$7.exports = TX3
})
// @from(Ln 112043, Col 4)
$$7 = x((aT_, O$7) => {
    var {
        stringify: vX3
    } = KM6(), {
        outputFileSync: NX3
    } = MY1();

    function VX3(A, q, K) {
        let Y = vX3(q, K);
        NX3(A, Y, K)
    }
    O$7.exports = VX3
})
// @from(Ln 112056, Col 4)
j$7 = x((sT_, H$7) => {
    var kX3 = Ew().fromPromise,
        IG = q$7();
    IG.outputJson = kX3(w$7());
    IG.outputJsonSync = $$7();
    IG.outputJSON = IG.outputJson;
    IG.outputJSONSync = IG.outputJsonSync;
    IG.writeJSON = IG.writeJson;
    IG.writeJSONSync = IG.writeJsonSync;
    IG.readJSON = IG.readJson;
    IG.readJSONSync = IG.readJsonSync;
    H$7.exports = IG
})
// @from(Ln 112069, Col 4)
P$7 = x((tT_, X$7) => {
    var EX3 = Y_(),
        a98 = x6("path"),
        yX3 = OY1().copy,
        D$7 = hI6().remove,
        LX3 = PC().mkdirp,
        RX3 = lo().pathExists,
        J$7 = wq6();

    function hX3(A, q, K, Y) {
        if (typeof K === "function") Y = K, K = {};
        K = K || {};
        let z = K.overwrite || K.clobber || !1;
        J$7.checkPaths(A, q, "move", K, (_, w) => {
            if (_) return Y(_);
            let {
                srcStat: O,
                isChangingCase: $ = !1
            } = w;
            J$7.checkParentPaths(A, O, q, "move", (H) => {
                if (H) return Y(H);
                if (SX3(q)) return M$7(A, q, z, $, Y);
                LX3(a98.dirname(q), (j) => {
                    if (j) return Y(j);
                    return M$7(A, q, z, $, Y)
                })
            })
        })
    }

    function SX3(A) {
        let q = a98.dirname(A);
        return a98.parse(q).root === q
    }

    function M$7(A, q, K, Y, z) {
        if (Y) return o98(A, q, K, z);
        if (K) return D$7(q, (_) => {
            if (_) return z(_);
            return o98(A, q, K, z)
        });
        RX3(q, (_, w) => {
            if (_) return z(_);
            if (w) return z(Error("dest already exists."));
            return o98(A, q, K, z)
        })
    }

    function o98(A, q, K, Y) {
        EX3.rename(A, q, (z) => {
            if (!z) return Y();
            if (z.code !== "EXDEV") return Y(z);
            return CX3(A, q, K, Y)
        })
    }

    function CX3(A, q, K, Y) {
        yX3(A, q, {
            overwrite: K,
            errorOnExist: !0
        }, (_) => {
            if (_) return Y(_);
            return D$7(A, Y)
        })
    }
    X$7.exports = hX3
})
// @from(Ln 112136, Col 4)
T$7 = x((eT_, f$7) => {
    var Z$7 = Y_(),
        t98 = x6("path"),
        IX3 = OY1().copySync,
        G$7 = hI6().removeSync,
        bX3 = PC().mkdirpSync,
        W$7 = wq6();

    function xX3(A, q, K) {
        K = K || {};
        let Y = K.overwrite || K.clobber || !1,
            {
                srcStat: z,
                isChangingCase: _ = !1
            } = W$7.checkPathsSync(A, q, "move", K);
        if (W$7.checkParentPathsSync(A, z, q, "move"), !uX3(q)) bX3(t98.dirname(q));
        return mX3(A, q, Y, _)
    }

    function uX3(A) {
        let q = t98.dirname(A);
        return t98.parse(q).root === q
    }

    function mX3(A, q, K, Y) {
        if (Y) return s98(A, q, K);
        if (K) return G$7(q), s98(A, q, K);
        if (Z$7.existsSync(q)) throw Error("dest already exists.");
        return s98(A, q, K)
    }

    function s98(A, q, K) {
        try {
            Z$7.renameSync(A, q)
        } catch (Y) {
            if (Y.code !== "EXDEV") throw Y;
            return BX3(A, q, K)
        }
    }

    function BX3(A, q, K) {
        return IX3(A, q, {
            overwrite: K,
            errorOnExist: !0
        }), G$7(A)
    }
    f$7.exports = xX3
})
// @from(Ln 112184, Col 4)
N$7 = x((Av_, v$7) => {
    var gX3 = Ew().fromCallback;
    v$7.exports = {
        move: gX3(P$7()),
        moveSync: T$7()
    }
})
// @from(Ln 112191, Col 4)
k$7 = x((qv_, V$7) => {
    V$7.exports = {
        ..._q6(),
        ...OY1(),
        ...VO7(),
        ...eO7(),
        ...j$7(),
        ...PC(),
        ...N$7(),
        ...MY1(),
        ...lo(),
        ...hI6()
    }
})
// @from(Ln 112205, Col 4)
e98 = x((y$7) => {
    Object.defineProperty(y$7, "__esModule", {
        value: !0
    });
    y$7.childDepType = y$7.depTypeGreater = y$7.DepType = void 0;
    var G5;
    (function(A) {
        A[A.PROD = 0] = "PROD", A[A.DEV = 1] = "DEV", A[A.OPTIONAL = 2] = "OPTIONAL", A[A.DEV_OPTIONAL = 3] = "DEV_OPTIONAL", A[A.ROOT = 4] = "ROOT"
    })(G5 = y$7.DepType || (y$7.DepType = {}));
    var FX3 = (A, q) => {
        switch (q) {
            case G5.DEV:
                switch (A) {
                    case G5.OPTIONAL:
                    case G5.PROD:
                    case G5.ROOT:
                        return !0;
                    case G5.DEV:
                    case G5.DEV_OPTIONAL:
                    default:
                        return !1
                }
            case G5.DEV_OPTIONAL:
                switch (A) {
                    case G5.OPTIONAL:
                    case G5.PROD:
                    case G5.ROOT:
                    case G5.DEV:
                        return !0;
                    case G5.DEV_OPTIONAL:
                    default:
                        return !1
                }
            case G5.OPTIONAL:
                switch (A) {
                    case G5.PROD:
                    case G5.ROOT:
                        return !0;
                    case G5.OPTIONAL:
                    case G5.DEV:
                    case G5.DEV_OPTIONAL:
                    default:
                        return !1
                }
            case G5.PROD:
                switch (A) {
                    case G5.ROOT:
                        return !0;
                    case G5.PROD:
                    case G5.OPTIONAL:
                    case G5.DEV:
                    case G5.DEV_OPTIONAL:
                    default:
                        return !1
                }
            case G5.ROOT:
                switch (A) {
                    case G5.ROOT:
                    case G5.PROD:
                    case G5.OPTIONAL:
                    case G5.DEV:
                    case G5.DEV_OPTIONAL:
                    default:
                        return !1
                }
            default:
                return !1
        }
    };
    y$7.depTypeGreater = FX3;
    var pX3 = (A, q) => {
        if (q === G5.ROOT) throw Error("Something went wrong, a child dependency can't be marked as the ROOT");
        switch (A) {
            case G5.ROOT:
                return q;
            case G5.PROD:
                if (q === G5.OPTIONAL) return G5.OPTIONAL;
                return G5.PROD;
            case G5.OPTIONAL:
                return G5.OPTIONAL;
            case G5.DEV_OPTIONAL:
                return G5.DEV_OPTIONAL;
            case G5.DEV:
                if (q === G5.OPTIONAL) return G5.DEV_OPTIONAL;
                return G5.DEV
        }
    };
    y$7.childDepType = pX3
})
// @from(Ln 112294, Col 4)
h$7 = x((R$7) => {
    Object.defineProperty(R$7, "__esModule", {
        value: !0
    });
    R$7.NativeModuleType = void 0;
    var UX3;
    (function(A) {
        A[A.NONE = 0] = "NONE", A[A.NODE_GYP = 1] = "NODE_GYP", A[A.PREBUILD = 2] = "PREBUILD"
    })(UX3 = R$7.NativeModuleType || (R$7.NativeModuleType = {}))
})
// @from(Ln 112304, Col 4)
b$7 = x((C$7) => {
    Object.defineProperty(C$7, "__esModule", {
        value: !0
    });
    C$7.Walker = void 0;
    var dX3 = X$6(),
        DY1 = k$7(),
        oo = x6("path"),
        $L = e98(),
        qY8 = h$7(),
        oQ = dX3("flora-colossus");
    class S$7 {
        constructor(A) {
            if (this.modules = [], this.walkHistory = new Set, this.cache = null, !A || typeof A !== "string") throw Error("modulePath must be provided as a string");
            oQ(`creating walker with rootModule=${A}`), this.rootModule = A
        }
        relativeModule(A, q) {
            return oo.resolve(A, "node_modules", q)
        }
        async loadPackageJSON(A) {
            let q = oo.resolve(A, "package.json");
            if (await DY1.pathExists(q)) {
                let K = await DY1.readJson(q);
                if (!K.dependencies) K.dependencies = {};
                if (!K.devDependencies) K.devDependencies = {};
                if (!K.optionalDependencies) K.optionalDependencies = {};
                return K
            }
            return null
        }
        async walkDependenciesForModuleInModule(A, q, K) {
            let Y = q,
                z = null,
                _ = null;
            while (!z && this.relativeModule(Y, A) !== _)
                if (_ = this.relativeModule(Y, A), await DY1.pathExists(_)) z = _;
                else {
                    if (oo.basename(oo.dirname(Y)) !== "node_modules") Y = oo.dirname(Y);
                    Y = oo.dirname(oo.dirname(Y))
                } if (!z && K !== $L.DepType.OPTIONAL && K !== $L.DepType.DEV_OPTIONAL) throw Error(`Failed to locate module "${A}" from "${q}"

        This normally means that either you have deleted this package already somehow (check your ignore settings if using electron-packager).  Or your module installation failed.`);
            if (z) await this.walkDependenciesForModule(z, K)
        }
        async detectNativeModuleType(A, q) {
            if (q.dependencies["prebuild-install"]) return qY8.NativeModuleType.PREBUILD;
            else if (await DY1.pathExists(oo.join(A, "binding.gyp"))) return qY8.NativeModuleType.NODE_GYP;
            return qY8.NativeModuleType.NONE
        }
        async walkDependenciesForModule(A, q) {
            if (oQ("walk reached:", A, " Type is:", $L.DepType[q]), this.walkHistory.has(A)) {
                oQ("already walked this route");
                let Y = this.modules.find((z) => z.path === A);
                if ((0, $L.depTypeGreater)(q, Y.depType)) oQ(`existing module has a type of "${Y.depType}", new module type would be "${q}" therefore updating`), Y.depType = q;
                return
            }
            let K = await this.loadPackageJSON(A);
            if (!K) {
                oQ("walk hit a dead end, this module is incomplete");
                return
            }
            this.walkHistory.add(A), this.modules.push({
                depType: q,
                nativeModuleType: await this.detectNativeModuleType(A, K),
                path: A,
                name: K.name
            });
            for (let Y in K.dependencies) {
                if (Y in K.optionalDependencies) {
                    oQ(`found ${Y} in prod deps of ${A} but it is also marked optional`);
                    continue
                }
                await this.walkDependenciesForModuleInModule(Y, A, (0, $L.childDepType)(q, $L.DepType.PROD))
            }
            for (let Y in K.optionalDependencies) await this.walkDependenciesForModuleInModule(Y, A, (0, $L.childDepType)(q, $L.DepType.OPTIONAL));
            if (q === $L.DepType.ROOT) {
                oQ("we're still at the beginning, walking down the dev route");
                for (let Y in K.devDependencies) await this.walkDependenciesForModuleInModule(Y, A, (0, $L.childDepType)(q, $L.DepType.DEV))
            }
        }
        async walkTree() {
            if (oQ("starting tree walk"), !this.cache) this.cache = new Promise(async (A, q) => {
                this.modules = [];
                try {
                    await this.walkDependenciesForModule(this.rootModule, $L.DepType.ROOT)
                } catch (K) {
                    q(K);
                    return
                }
                A(this.modules)
            });
            else oQ("tree walk in progress / completed already, waiting for existing walk to complete");
            return await this.cache
        }
        getRootModule() {
            return this.rootModule
        }
    }
    C$7.Walker = S$7
})
// @from(Ln 112404, Col 4)
KY8 = x((ao) => {
    var cX3 = ao && ao.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        x$7 = ao && ao.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) cX3(q, A, K)
        };
    Object.defineProperty(ao, "__esModule", {
        value: !0
    });
    x$7(b$7(), ao);
    x$7(e98(), ao)
})
// @from(Ln 112429, Col 4)
g$7 = x((m$7) => {
    Object.defineProperty(m$7, "__esModule", {
        value: !0
    });
    m$7.DestroyerOfModules = void 0;
    var XY1 = Sw7(),
        wM6 = x6("path"),
        YY8 = KY8();
    class u$7 {
        constructor({
            rootDirectory: A,
            walker: q,
            shouldKeepModuleTest: K
        }) {
            if (A) this.walker = new YY8.Walker(A);
            else if (q) this.walker = q;
            else throw Error("Must either provide rootDirectory or walker argument");
            if (K) this.shouldKeepFn = K
        }
        async destroyModule(A, q) {
            if (q.get(A)) {
                let Y = wM6.resolve(A, "node_modules");
                if (!await XY1.pathExists(Y)) return;
                for (let z of await XY1.readdir(Y))
                    if (z.startsWith("@"))
                        for (let _ of await XY1.readdir(wM6.resolve(Y, z))) await this.destroyModule(wM6.resolve(Y, z, _), q);
                    else await this.destroyModule(wM6.resolve(Y, z), q)
            } else await XY1.remove(A)
        }
        async collectKeptModules({
            relativePaths: A = !1
        }) {
            let q = await this.walker.walkTree(),
                K = new Map,
                Y = wM6.resolve(this.walker.getRootModule());
            for (let z of q)
                if (this.shouldKeepModule(z)) {
                    let _ = z.path;
                    if (A) _ = _.replace(`${Y}${wM6.sep}`, "");
                    K.set(_, z)
                } return K
        }
        async destroy() {
            await this.destroyModule(this.walker.getRootModule(), await this.collectKeptModules({
                relativePaths: !1
            }))
        }
        shouldKeepModule(A) {
            let q = A.depType === YY8.DepType.DEV || A.depType === YY8.DepType.DEV_OPTIONAL;
            return this.shouldKeepFn ? this.shouldKeepFn(A, q) : !q
        }
    }
    m$7.DestroyerOfModules = u$7
})
// @from(Ln 112483, Col 4)
p$7 = x((so) => {
    var lX3 = so && so.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        F$7 = so && so.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) lX3(q, A, K)
        };
    Object.defineProperty(so, "__esModule", {
        value: !0
    });
    F$7(g$7(), so);
    F$7(KY8(), so)
})
// @from(Ln 112508, Col 4)
d$7 = x(($v_, U$7) => {
    var iX3 = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        nX3 = ["B", "kiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
        rX3 = ["b", "kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit"],
        oX3 = ["b", "kibit", "Mibit", "Gibit", "Tibit", "Pibit", "Eibit", "Zibit", "Yibit"],
        Q$7 = (A, q, K) => {
            let Y = A;
            if (typeof q === "string" || Array.isArray(q)) Y = A.toLocaleString(q, K);
            else if (q === !0 || K !== void 0) Y = A.toLocaleString(void 0, K);
            return Y
        };
    U$7.exports = (A, q) => {
        if (!Number.isFinite(A)) throw TypeError(`Expected a finite number, got ${typeof A}: ${A}`);
        q = Object.assign({
            bits: !1,
            binary: !1
        }, q);
        let K = q.bits ? q.binary ? oX3 : rX3 : q.binary ? nX3 : iX3;
        if (q.signed && A === 0) return ` 0 ${K[0]}`;
        let Y = A < 0,
            z = Y ? "-" : q.signed ? "+" : "";
        if (Y) A = -A;
        let _;
        if (q.minimumFractionDigits !== void 0) _ = {
            minimumFractionDigits: q.minimumFractionDigits
        };
        if (q.maximumFractionDigits !== void 0) _ = Object.assign({
            maximumFractionDigits: q.maximumFractionDigits
        }, _);
        if (A < 1) {
            let H = Q$7(A, q.locale, _);
            return z + H + " " + K[0]
        }
        let w = Math.min(Math.floor(q.binary ? Math.log(A) / Math.log(1024) : Math.log10(A) / 3), K.length - 1);
        if (A /= Math.pow(q.binary ? 1024 : 1000, w), !_) A = A.toPrecision(3);
        let O = Q$7(Number(A), q.locale, _),
            $ = K[w];
        return z + O + " " + $
    }
})
// @from(Ln 112548, Col 4)
h3 = x((Hv_, c$7) => {
    c$7.exports = {
        options: {
            usePureJavaScript: !1
        }
    }
})
// @from(Ln 112555, Col 4)
n$7 = x((jv_, i$7) => {
    var zY8 = {};
    i$7.exports = zY8;
    var l$7 = {};
    zY8.encode = function(A, q, K) {
        if (typeof q !== "string") throw TypeError('"alphabet" must be a string.');
        if (K !== void 0 && typeof K !== "number") throw TypeError('"maxline" must be a number.');
        var Y = "";
        if (!(A instanceof Uint8Array)) Y = aX3(A, q);
        else {
            var z = 0,
                _ = q.length,
                w = q.charAt(0),
                O = [0];
            for (z = 0; z < A.length; ++z) {
                for (var $ = 0, H = A[z]; $ < O.length; ++$) H += O[$] << 8, O[$] = H % _, H = H / _ | 0;
                while (H > 0) O.push(H % _), H = H / _ | 0
            }
            for (z = 0; A[z] === 0 && z < A.length - 1; ++z) Y += w;
            for (z = O.length - 1; z >= 0; --z) Y += q[O[z]]
        }
        if (K) {
            var j = new RegExp(".{1," + K + "}", "g");
            Y = Y.match(j).join(`\r
`)
        }
        return Y
    };
    zY8.decode = function(A, q) {
        if (typeof A !== "string") throw TypeError('"input" must be a string.');
        if (typeof q !== "string") throw TypeError('"alphabet" must be a string.');
        var K = l$7[q];
        if (!K) {
            K = l$7[q] = [];
            for (var Y = 0; Y < q.length; ++Y) K[q.charCodeAt(Y)] = Y
        }
        A = A.replace(/\s/g, "");
        var z = q.length,
            _ = q.charAt(0),
            w = [0];
        for (var Y = 0; Y < A.length; Y++) {
            var O = K[A.charCodeAt(Y)];
            if (O === void 0) return;
            for (var $ = 0, H = O; $ < w.length; ++$) H += w[$] * z, w[$] = H & 255, H >>= 8;
            while (H > 0) w.push(H & 255), H >>= 8
        }
        for (var j = 0; A[j] === _ && j < A.length - 1; ++j) w.push(0);
        if (typeof Buffer < "u") return Buffer.from(w.reverse());
        return new Uint8Array(w.reverse())
    };

    function aX3(A, q) {
        var K = 0,
            Y = q.length,
            z = q.charAt(0),
            _ = [0];
        for (K = 0; K < A.length(); ++K) {
            for (var w = 0, O = A.at(K); w < _.length; ++w) O += _[w] << 8, _[w] = O % Y, O = O / Y | 0;
            while (O > 0) _.push(O % Y), O = O / Y | 0
        }
        var $ = "";
        for (K = 0; A.at(K) === 0 && K < A.length() - 1; ++K) $ += z;
        for (K = _.length - 1; K >= 0; --K) $ += q[_[K]];
        return $
    }
})