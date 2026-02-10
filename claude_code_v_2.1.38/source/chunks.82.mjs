
// @from(Ln 221363, Col 4)
sB7 = R((HOw, aB7) => {
    var sV = cz(),
        _u1 = h1("path"),
        xP9 = Ph().mkdirs,
        bP9 = fa().pathExists,
        uP9 = $DA().utimesMillis,
        Ju1 = lq1();

    function BP9(A, q, K, Y) {
        if (typeof K === "function" && !Y) Y = K, K = {};
        else if (typeof K === "function") K = {
            filter: K
        };
        if (Y = Y || function() {}, K = K || {}, K.clobber = "clobber" in K ? !!K.clobber : !0, K.overwrite = "overwrite" in K ? !!K.overwrite : K.clobber, K.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0001");
        Ju1.checkPaths(A, q, "copy", K, (z, w) => {
            if (z) return Y(z);
            let {
                srcStat: H,
                destStat: $
            } = w;
            Ju1.checkParentPaths(A, H, q, "copy", (O) => {
                if (O) return Y(O);
                if (K.filter) return iB7(cB7, $, A, q, K, Y);
                return cB7($, A, q, K, Y)
            })
        })
    }

    function cB7(A, q, K, Y, z) {
        let w = _u1.dirname(K);
        bP9(w, (H, $) => {
            if (H) return z(H);
            if ($) return o$6(A, q, K, Y, z);
            xP9(w, (O) => {
                if (O) return z(O);
                return o$6(A, q, K, Y, z)
            })
        })
    }

    function iB7(A, q, K, Y, z, w) {
        Promise.resolve(z.filter(K, Y)).then((H) => {
            if (H) return A(q, K, Y, z, w);
            return w()
        }, (H) => w(H))
    }

    function mP9(A, q, K, Y, z) {
        if (Y.filter) return iB7(o$6, A, q, K, Y, z);
        return o$6(A, q, K, Y, z)
    }

    function o$6(A, q, K, Y, z) {
        (Y.dereference ? sV.stat : sV.lstat)(q, (H, $) => {
            if (H) return z(H);
            if ($.isDirectory()) return cP9($, A, q, K, Y, z);
            else if ($.isFile() || $.isCharacterDevice() || $.isBlockDevice()) return FP9($, A, q, K, Y, z);
            else if ($.isSymbolicLink()) return nP9(A, q, K, Y, z);
            else if ($.isSocket()) return z(Error(`Cannot copy a socket file: ${q}`));
            else if ($.isFIFO()) return z(Error(`Cannot copy a FIFO pipe: ${q}`));
            return z(Error(`Unknown file: ${q}`))
        })
    }

    function FP9(A, q, K, Y, z, w) {
        if (!q) return nB7(A, K, Y, z, w);
        return QP9(A, K, Y, z, w)
    }

    function QP9(A, q, K, Y, z) {
        if (Y.overwrite) sV.unlink(K, (w) => {
            if (w) return z(w);
            return nB7(A, q, K, Y, z)
        });
        else if (Y.errorOnExist) return z(Error(`'${K}' already exists`));
        else return z()
    }

    function nB7(A, q, K, Y, z) {
        sV.copyFile(q, K, (w) => {
            if (w) return z(w);
            if (Y.preserveTimestamps) return gP9(A.mode, q, K, z);
            return a$6(K, A.mode, z)
        })
    }

    function gP9(A, q, K, Y) {
        if (UP9(A)) return pP9(K, A, (z) => {
            if (z) return Y(z);
            return lB7(A, q, K, Y)
        });
        return lB7(A, q, K, Y)
    }

    function UP9(A) {
        return (A & 128) === 0
    }

    function pP9(A, q, K) {
        return a$6(A, q | 128, K)
    }

    function lB7(A, q, K, Y) {
        dP9(q, K, (z) => {
            if (z) return Y(z);
            return a$6(K, A, Y)
        })
    }

    function a$6(A, q, K) {
        return sV.chmod(A, q, K)
    }

    function dP9(A, q, K) {
        sV.stat(A, (Y, z) => {
            if (Y) return K(Y);
            return uP9(q, z.atime, z.mtime, K)
        })
    }

    function cP9(A, q, K, Y, z, w) {
        if (!q) return lP9(A.mode, K, Y, z, w);
        return rB7(K, Y, z, w)
    }

    function lP9(A, q, K, Y, z) {
        sV.mkdir(K, (w) => {
            if (w) return z(w);
            rB7(q, K, Y, (H) => {
                if (H) return z(H);
                return a$6(K, A, z)
            })
        })
    }

    function rB7(A, q, K, Y) {
        sV.readdir(A, (z, w) => {
            if (z) return Y(z);
            return oB7(w, A, q, K, Y)
        })
    }

    function oB7(A, q, K, Y, z) {
        let w = A.pop();
        if (!w) return z();
        return iP9(A, w, q, K, Y, z)
    }

    function iP9(A, q, K, Y, z, w) {
        let H = _u1.join(K, q),
            $ = _u1.join(Y, q);
        Ju1.checkPaths(H, $, "copy", z, (O, _) => {
            if (O) return w(O);
            let {
                destStat: J
            } = _;
            mP9(J, H, $, z, (X) => {
                if (X) return w(X);
                return oB7(A, K, Y, z, w)
            })
        })
    }

    function nP9(A, q, K, Y, z) {
        sV.readlink(q, (w, H) => {
            if (w) return z(w);
            if (Y.dereference) H = _u1.resolve(process.cwd(), H);
            if (!A) return sV.symlink(H, K, z);
            else sV.readlink(K, ($, O) => {
                if ($) {
                    if ($.code === "EINVAL" || $.code === "UNKNOWN") return sV.symlink(H, K, z);
                    return z($)
                }
                if (Y.dereference) O = _u1.resolve(process.cwd(), O);
                if (Ju1.isSrcSubdir(H, O)) return z(Error(`Cannot copy '${H}' to a subdirectory of itself, '${O}'.`));
                if (A.isDirectory() && Ju1.isSrcSubdir(O, H)) return z(Error(`Cannot overwrite '${O}' with '${H}'.`));
                return rP9(H, K, z)
            })
        })
    }

    function rP9(A, q, K) {
        sV.unlink(q, (Y) => {
            if (Y) return K(Y);
            return sV.symlink(A, q, K)
        })
    }
    aB7.exports = BP9
})
// @from(Ln 221554, Col 4)
Km7 = R(($Ow, qm7) => {
    var IW = cz(),
        Xu1 = h1("path"),
        oP9 = Ph().mkdirsSync,
        aP9 = $DA().utimesMillisSync,
        Du1 = lq1();

    function sP9(A, q, K) {
        if (typeof K === "function") K = {
            filter: K
        };
        if (K = K || {}, K.clobber = "clobber" in K ? !!K.clobber : !0, K.overwrite = "overwrite" in K ? !!K.overwrite : K.clobber, K.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0002");
        let {
            srcStat: Y,
            destStat: z
        } = Du1.checkPathsSync(A, q, "copy", K);
        return Du1.checkParentPathsSync(A, Y, q, "copy"), tP9(z, A, q, K)
    }

    function tP9(A, q, K, Y) {
        if (Y.filter && !Y.filter(q, K)) return;
        let z = Xu1.dirname(K);
        if (!IW.existsSync(z)) oP9(z);
        return tB7(A, q, K, Y)
    }

    function eP9(A, q, K, Y) {
        if (Y.filter && !Y.filter(q, K)) return;
        return tB7(A, q, K, Y)
    }

    function tB7(A, q, K, Y) {
        let w = (Y.dereference ? IW.statSync : IW.lstatSync)(q);
        if (w.isDirectory()) return HW9(w, A, q, K, Y);
        else if (w.isFile() || w.isCharacterDevice() || w.isBlockDevice()) return AW9(w, A, q, K, Y);
        else if (w.isSymbolicLink()) return _W9(A, q, K, Y);
        else if (w.isSocket()) throw Error(`Cannot copy a socket file: ${q}`);
        else if (w.isFIFO()) throw Error(`Cannot copy a FIFO pipe: ${q}`);
        throw Error(`Unknown file: ${q}`)
    }

    function AW9(A, q, K, Y, z) {
        if (!q) return eB7(A, K, Y, z);
        return qW9(A, K, Y, z)
    }

    function qW9(A, q, K, Y) {
        if (Y.overwrite) return IW.unlinkSync(K), eB7(A, q, K, Y);
        else if (Y.errorOnExist) throw Error(`'${K}' already exists`)
    }

    function eB7(A, q, K, Y) {
        if (IW.copyFileSync(q, K), Y.preserveTimestamps) KW9(A.mode, q, K);
        return _DA(K, A.mode)
    }

    function KW9(A, q, K) {
        if (YW9(A)) zW9(K, A);
        return wW9(q, K)
    }

    function YW9(A) {
        return (A & 128) === 0
    }

    function zW9(A, q) {
        return _DA(A, q | 128)
    }

    function _DA(A, q) {
        return IW.chmodSync(A, q)
    }

    function wW9(A, q) {
        let K = IW.statSync(A);
        return aP9(q, K.atime, K.mtime)
    }

    function HW9(A, q, K, Y, z) {
        if (!q) return $W9(A.mode, K, Y, z);
        return Am7(K, Y, z)
    }

    function $W9(A, q, K, Y) {
        return IW.mkdirSync(K), Am7(q, K, Y), _DA(K, A)
    }

    function Am7(A, q, K) {
        IW.readdirSync(A).forEach((Y) => OW9(Y, A, q, K))
    }

    function OW9(A, q, K, Y) {
        let z = Xu1.join(q, A),
            w = Xu1.join(K, A),
            {
                destStat: H
            } = Du1.checkPathsSync(z, w, "copy", Y);
        return eP9(H, z, w, Y)
    }

    function _W9(A, q, K, Y) {
        let z = IW.readlinkSync(q);
        if (Y.dereference) z = Xu1.resolve(process.cwd(), z);
        if (!A) return IW.symlinkSync(z, K);
        else {
            let w;
            try {
                w = IW.readlinkSync(K)
            } catch (H) {
                if (H.code === "EINVAL" || H.code === "UNKNOWN") return IW.symlinkSync(z, K);
                throw H
            }
            if (Y.dereference) w = Xu1.resolve(process.cwd(), w);
            if (Du1.isSrcSubdir(z, w)) throw Error(`Cannot copy '${z}' to a subdirectory of itself, '${w}'.`);
            if (IW.statSync(K).isDirectory() && Du1.isSrcSubdir(w, z)) throw Error(`Cannot overwrite '${w}' with '${z}'.`);
            return JW9(z, K)
        }
    }

    function JW9(A, q) {
        return IW.unlinkSync(q), IW.symlinkSync(A, q)
    }
    qm7.exports = sP9
})
// @from(Ln 221680, Col 4)
s$6 = R((OOw, Ym7) => {
    var XW9 = fH().fromCallback;
    Ym7.exports = {
        copy: XW9(sB7()),
        copySync: Km7()
    }
})
// @from(Ln 221687, Col 4)
Dm7 = R((_Ow, Xm7) => {
    var zm7 = cz(),
        Om7 = h1("path"),
        hw = h1("assert"),
        ju1 = process.platform === "win32";

    function _m7(A) {
        ["unlink", "chmod", "stat", "lstat", "rmdir", "readdir"].forEach((K) => {
            A[K] = A[K] || zm7[K], K = K + "Sync", A[K] = A[K] || zm7[K]
        }), A.maxBusyTries = A.maxBusyTries || 3
    }

    function JDA(A, q, K) {
        let Y = 0;
        if (typeof q === "function") K = q, q = {};
        hw(A, "rimraf: missing path"), hw.strictEqual(typeof A, "string", "rimraf: path should be a string"), hw.strictEqual(typeof K, "function", "rimraf: callback function required"), hw(q, "rimraf: invalid options argument provided"), hw.strictEqual(typeof q, "object", "rimraf: options should be object"), _m7(q), wm7(A, q, function z(w) {
            if (w) {
                if ((w.code === "EBUSY" || w.code === "ENOTEMPTY" || w.code === "EPERM") && Y < q.maxBusyTries) {
                    Y++;
                    let H = Y * 100;
                    return setTimeout(() => wm7(A, q, z), H)
                }
                if (w.code === "ENOENT") w = null
            }
            K(w)
        })
    }

    function wm7(A, q, K) {
        hw(A), hw(q), hw(typeof K === "function"), q.lstat(A, (Y, z) => {
            if (Y && Y.code === "ENOENT") return K(null);
            if (Y && Y.code === "EPERM" && ju1) return Hm7(A, q, Y, K);
            if (z && z.isDirectory()) return t$6(A, q, Y, K);
            q.unlink(A, (w) => {
                if (w) {
                    if (w.code === "ENOENT") return K(null);
                    if (w.code === "EPERM") return ju1 ? Hm7(A, q, w, K) : t$6(A, q, w, K);
                    if (w.code === "EISDIR") return t$6(A, q, w, K)
                }
                return K(w)
            })
        })
    }

    function Hm7(A, q, K, Y) {
        hw(A), hw(q), hw(typeof Y === "function"), q.chmod(A, 438, (z) => {
            if (z) Y(z.code === "ENOENT" ? null : K);
            else q.stat(A, (w, H) => {
                if (w) Y(w.code === "ENOENT" ? null : K);
                else if (H.isDirectory()) t$6(A, q, K, Y);
                else q.unlink(A, Y)
            })
        })
    }

    function $m7(A, q, K) {
        let Y;
        hw(A), hw(q);
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
        if (Y.isDirectory()) e$6(A, q, K);
        else q.unlinkSync(A)
    }

    function t$6(A, q, K, Y) {
        hw(A), hw(q), hw(typeof Y === "function"), q.rmdir(A, (z) => {
            if (z && (z.code === "ENOTEMPTY" || z.code === "EEXIST" || z.code === "EPERM")) DW9(A, q, Y);
            else if (z && z.code === "ENOTDIR") Y(K);
            else Y(z)
        })
    }

    function DW9(A, q, K) {
        hw(A), hw(q), hw(typeof K === "function"), q.readdir(A, (Y, z) => {
            if (Y) return K(Y);
            let w = z.length,
                H;
            if (w === 0) return q.rmdir(A, K);
            z.forEach(($) => {
                JDA(Om7.join(A, $), q, (O) => {
                    if (H) return;
                    if (O) return K(H = O);
                    if (--w === 0) q.rmdir(A, K)
                })
            })
        })
    }

    function Jm7(A, q) {
        let K;
        q = q || {}, _m7(q), hw(A, "rimraf: missing path"), hw.strictEqual(typeof A, "string", "rimraf: path should be a string"), hw(q, "rimraf: missing options"), hw.strictEqual(typeof q, "object", "rimraf: options should be object");
        try {
            K = q.lstatSync(A)
        } catch (Y) {
            if (Y.code === "ENOENT") return;
            if (Y.code === "EPERM" && ju1) $m7(A, q, Y)
        }
        try {
            if (K && K.isDirectory()) e$6(A, q, null);
            else q.unlinkSync(A)
        } catch (Y) {
            if (Y.code === "ENOENT") return;
            else if (Y.code === "EPERM") return ju1 ? $m7(A, q, Y) : e$6(A, q, Y);
            else if (Y.code !== "EISDIR") throw Y;
            e$6(A, q, Y)
        }
    }

    function e$6(A, q, K) {
        hw(A), hw(q);
        try {
            q.rmdirSync(A)
        } catch (Y) {
            if (Y.code === "ENOTDIR") throw K;
            else if (Y.code === "ENOTEMPTY" || Y.code === "EEXIST" || Y.code === "EPERM") jW9(A, q);
            else if (Y.code !== "ENOENT") throw Y
        }
    }

    function jW9(A, q) {
        if (hw(A), hw(q), q.readdirSync(A).forEach((K) => Jm7(Om7.join(A, K), q)), ju1) {
            let K = Date.now();
            do try {
                return q.rmdirSync(A, q)
            } catch {}
            while (Date.now() - K < 500)
        } else return q.rmdirSync(A, q)
    }
    Xm7.exports = JDA;
    JDA.sync = Jm7
})
// @from(Ln 221828, Col 4)
Mu1 = R((JOw, Mm7) => {
    var AO6 = cz(),
        MW9 = fH().fromCallback,
        jm7 = Dm7();

    function PW9(A, q) {
        if (AO6.rm) return AO6.rm(A, {
            recursive: !0,
            force: !0
        }, q);
        jm7(A, q)
    }

    function WW9(A) {
        if (AO6.rmSync) return AO6.rmSync(A, {
            recursive: !0,
            force: !0
        });
        jm7.sync(A)
    }
    Mm7.exports = {
        remove: MW9(PW9),
        removeSync: WW9
    }
})
// @from(Ln 221853, Col 4)
Tm7 = R((XOw, Nm7) => {
    var GW9 = fH().fromPromise,
        Gm7 = cq1(),
        Zm7 = h1("path"),
        fm7 = Ph(),
        Vm7 = Mu1(),
        Pm7 = GW9(async function(q) {
            let K;
            try {
                K = await Gm7.readdir(q)
            } catch {
                return fm7.mkdirs(q)
            }
            return Promise.all(K.map((Y) => Vm7.remove(Zm7.join(q, Y))))
        });

    function Wm7(A) {
        let q;
        try {
            q = Gm7.readdirSync(A)
        } catch {
            return fm7.mkdirsSync(A)
        }
        q.forEach((K) => {
            K = Zm7.join(A, K), Vm7.removeSync(K)
        })
    }
    Nm7.exports = {
        emptyDirSync: Wm7,
        emptydirSync: Wm7,
        emptyDir: Pm7,
        emptydir: Pm7
    }
})
// @from(Ln 221887, Col 4)
Lm7 = R((DOw, km7) => {
    var ZW9 = fH().fromCallback,
        vm7 = h1("path"),
        Va = cz(),
        Em7 = Ph();

    function fW9(A, q) {
        function K() {
            Va.writeFile(A, "", (Y) => {
                if (Y) return q(Y);
                q()
            })
        }
        Va.stat(A, (Y, z) => {
            if (!Y && z.isFile()) return q();
            let w = vm7.dirname(A);
            Va.stat(w, (H, $) => {
                if (H) {
                    if (H.code === "ENOENT") return Em7.mkdirs(w, (O) => {
                        if (O) return q(O);
                        K()
                    });
                    return q(H)
                }
                if ($.isDirectory()) K();
                else Va.readdir(w, (O) => {
                    if (O) return q(O)
                })
            })
        })
    }

    function VW9(A) {
        let q;
        try {
            q = Va.statSync(A)
        } catch {}
        if (q && q.isFile()) return;
        let K = vm7.dirname(A);
        try {
            if (!Va.statSync(K).isDirectory()) Va.readdirSync(K)
        } catch (Y) {
            if (Y && Y.code === "ENOENT") Em7.mkdirsSync(K);
            else throw Y
        }
        Va.writeFileSync(A, "")
    }
    km7.exports = {
        createFile: ZW9(fW9),
        createFileSync: VW9
    }
})
// @from(Ln 221939, Col 4)
hm7 = R((jOw, Sm7) => {
    var NW9 = fH().fromCallback,
        Rm7 = h1("path"),
        Na = cz(),
        ym7 = Ph(),
        TW9 = fa().pathExists,
        {
            areIdentical: Cm7
        } = lq1();

    function vW9(A, q, K) {
        function Y(z, w) {
            Na.link(z, w, (H) => {
                if (H) return K(H);
                K(null)
            })
        }
        Na.lstat(q, (z, w) => {
            Na.lstat(A, (H, $) => {
                if (H) return H.message = H.message.replace("lstat", "ensureLink"), K(H);
                if (w && Cm7($, w)) return K(null);
                let O = Rm7.dirname(q);
                TW9(O, (_, J) => {
                    if (_) return K(_);
                    if (J) return Y(A, q);
                    ym7.mkdirs(O, (X) => {
                        if (X) return K(X);
                        Y(A, q)
                    })
                })
            })
        })
    }

    function EW9(A, q) {
        let K;
        try {
            K = Na.lstatSync(q)
        } catch {}
        try {
            let w = Na.lstatSync(A);
            if (K && Cm7(w, K)) return
        } catch (w) {
            throw w.message = w.message.replace("lstat", "ensureLink"), w
        }
        let Y = Rm7.dirname(q);
        if (Na.existsSync(Y)) return Na.linkSync(A, q);
        return ym7.mkdirsSync(Y), Na.linkSync(A, q)
    }
    Sm7.exports = {
        createLink: NW9(vW9),
        createLinkSync: EW9
    }
})
// @from(Ln 221993, Col 4)
xm7 = R((MOw, Im7) => {
    var Ta = h1("path"),
        Pu1 = cz(),
        kW9 = fa().pathExists;

    function LW9(A, q, K) {
        if (Ta.isAbsolute(A)) return Pu1.lstat(A, (Y) => {
            if (Y) return Y.message = Y.message.replace("lstat", "ensureSymlink"), K(Y);
            return K(null, {
                toCwd: A,
                toDst: A
            })
        });
        else {
            let Y = Ta.dirname(q),
                z = Ta.join(Y, A);
            return kW9(z, (w, H) => {
                if (w) return K(w);
                if (H) return K(null, {
                    toCwd: z,
                    toDst: A
                });
                else return Pu1.lstat(A, ($) => {
                    if ($) return $.message = $.message.replace("lstat", "ensureSymlink"), K($);
                    return K(null, {
                        toCwd: A,
                        toDst: Ta.relative(Y, A)
                    })
                })
            })
        }
    }

    function RW9(A, q) {
        let K;
        if (Ta.isAbsolute(A)) {
            if (K = Pu1.existsSync(A), !K) throw Error("absolute srcpath does not exist");
            return {
                toCwd: A,
                toDst: A
            }
        } else {
            let Y = Ta.dirname(q),
                z = Ta.join(Y, A);
            if (K = Pu1.existsSync(z), K) return {
                toCwd: z,
                toDst: A
            };
            else {
                if (K = Pu1.existsSync(A), !K) throw Error("relative srcpath does not exist");
                return {
                    toCwd: A,
                    toDst: Ta.relative(Y, A)
                }
            }
        }
    }
    Im7.exports = {
        symlinkPaths: LW9,
        symlinkPathsSync: RW9
    }
})
// @from(Ln 222055, Col 4)
Bm7 = R((POw, um7) => {
    var bm7 = cz();

    function yW9(A, q, K) {
        if (K = typeof q === "function" ? q : K, q = typeof q === "function" ? !1 : q, q) return K(null, q);
        bm7.lstat(A, (Y, z) => {
            if (Y) return K(null, "file");
            q = z && z.isDirectory() ? "dir" : "file", K(null, q)
        })
    }

    function CW9(A, q) {
        let K;
        if (q) return q;
        try {
            K = bm7.lstatSync(A)
        } catch {
            return "file"
        }
        return K && K.isDirectory() ? "dir" : "file"
    }
    um7.exports = {
        symlinkType: yW9,
        symlinkTypeSync: CW9
    }
})
// @from(Ln 222081, Col 4)
cm7 = R((WOw, dm7) => {
    var SW9 = fH().fromCallback,
        Fm7 = h1("path"),
        Wh = cq1(),
        Qm7 = Ph(),
        hW9 = Qm7.mkdirs,
        IW9 = Qm7.mkdirsSync,
        gm7 = xm7(),
        xW9 = gm7.symlinkPaths,
        bW9 = gm7.symlinkPathsSync,
        Um7 = Bm7(),
        uW9 = Um7.symlinkType,
        BW9 = Um7.symlinkTypeSync,
        mW9 = fa().pathExists,
        {
            areIdentical: pm7
        } = lq1();

    function FW9(A, q, K, Y) {
        Y = typeof K === "function" ? K : Y, K = typeof K === "function" ? !1 : K, Wh.lstat(q, (z, w) => {
            if (!z && w.isSymbolicLink()) Promise.all([Wh.stat(A), Wh.stat(q)]).then(([H, $]) => {
                if (pm7(H, $)) return Y(null);
                mm7(A, q, K, Y)
            });
            else mm7(A, q, K, Y)
        })
    }

    function mm7(A, q, K, Y) {
        xW9(A, q, (z, w) => {
            if (z) return Y(z);
            A = w.toDst, uW9(w.toCwd, K, (H, $) => {
                if (H) return Y(H);
                let O = Fm7.dirname(q);
                mW9(O, (_, J) => {
                    if (_) return Y(_);
                    if (J) return Wh.symlink(A, q, $, Y);
                    hW9(O, (X) => {
                        if (X) return Y(X);
                        Wh.symlink(A, q, $, Y)
                    })
                })
            })
        })
    }

    function QW9(A, q, K) {
        let Y;
        try {
            Y = Wh.lstatSync(q)
        } catch {}
        if (Y && Y.isSymbolicLink()) {
            let $ = Wh.statSync(A),
                O = Wh.statSync(q);
            if (pm7($, O)) return
        }
        let z = bW9(A, q);
        A = z.toDst, K = BW9(z.toCwd, K);
        let w = Fm7.dirname(q);
        if (Wh.existsSync(w)) return Wh.symlinkSync(A, q, K);
        return IW9(w), Wh.symlinkSync(A, q, K)
    }
    dm7.exports = {
        createSymlink: SW9(FW9),
        createSymlinkSync: QW9
    }
})
// @from(Ln 222148, Col 4)
tm7 = R((GOw, sm7) => {
    var {
        createFile: lm7,
        createFileSync: im7
    } = Lm7(), {
        createLink: nm7,
        createLinkSync: rm7
    } = hm7(), {
        createSymlink: om7,
        createSymlinkSync: am7
    } = cm7();
    sm7.exports = {
        createFile: lm7,
        createFileSync: im7,
        ensureFile: lm7,
        ensureFileSync: im7,
        createLink: nm7,
        createLinkSync: rm7,
        ensureLink: nm7,
        ensureLinkSync: rm7,
        createSymlink: om7,
        createSymlinkSync: am7,
        ensureSymlink: om7,
        ensureSymlinkSync: am7
    }
})
// @from(Ln 222174, Col 4)
AF7 = R((ZOw, em7) => {
    var qO6 = tXA();
    em7.exports = {
        readJson: qO6.readFile,
        readJsonSync: qO6.readFileSync,
        writeJson: qO6.writeFile,
        writeJsonSync: qO6.writeFileSync
    }
})
// @from(Ln 222183, Col 4)
KO6 = R((fOw, YF7) => {
    var gW9 = fH().fromCallback,
        Wu1 = cz(),
        qF7 = h1("path"),
        KF7 = Ph(),
        UW9 = fa().pathExists;

    function pW9(A, q, K, Y) {
        if (typeof K === "function") Y = K, K = "utf8";
        let z = qF7.dirname(A);
        UW9(z, (w, H) => {
            if (w) return Y(w);
            if (H) return Wu1.writeFile(A, q, K, Y);
            KF7.mkdirs(z, ($) => {
                if ($) return Y($);
                Wu1.writeFile(A, q, K, Y)
            })
        })
    }

    function dW9(A, ...q) {
        let K = qF7.dirname(A);
        if (Wu1.existsSync(K)) return Wu1.writeFileSync(A, ...q);
        KF7.mkdirsSync(K), Wu1.writeFileSync(A, ...q)
    }
    YF7.exports = {
        outputFile: gW9(pW9),
        outputFileSync: dW9
    }
})
// @from(Ln 222213, Col 4)
wF7 = R((VOw, zF7) => {
    var {
        stringify: cW9
    } = Yj1(), {
        outputFile: lW9
    } = KO6();
    async function iW9(A, q, K = {}) {
        let Y = cW9(q, K);
        await lW9(A, Y, K)
    }
    zF7.exports = iW9
})
// @from(Ln 222225, Col 4)
$F7 = R((NOw, HF7) => {
    var {
        stringify: nW9
    } = Yj1(), {
        outputFileSync: rW9
    } = KO6();

    function oW9(A, q, K) {
        let Y = nW9(q, K);
        rW9(A, Y, K)
    }
    HF7.exports = oW9
})
// @from(Ln 222238, Col 4)
_F7 = R((TOw, OF7) => {
    var aW9 = fH().fromPromise,
        EZ = AF7();
    EZ.outputJson = aW9(wF7());
    EZ.outputJsonSync = $F7();
    EZ.outputJSON = EZ.outputJson;
    EZ.outputJSONSync = EZ.outputJsonSync;
    EZ.writeJSON = EZ.writeJson;
    EZ.writeJSONSync = EZ.writeJsonSync;
    EZ.readJSON = EZ.readJson;
    EZ.readJSONSync = EZ.readJsonSync;
    OF7.exports = EZ
})
// @from(Ln 222251, Col 4)
MF7 = R((vOw, jF7) => {
    var sW9 = cz(),
        DDA = h1("path"),
        tW9 = s$6().copy,
        DF7 = Mu1().remove,
        eW9 = Ph().mkdirp,
        AG9 = fa().pathExists,
        JF7 = lq1();

    function qG9(A, q, K, Y) {
        if (typeof K === "function") Y = K, K = {};
        K = K || {};
        let z = K.overwrite || K.clobber || !1;
        JF7.checkPaths(A, q, "move", K, (w, H) => {
            if (w) return Y(w);
            let {
                srcStat: $,
                isChangingCase: O = !1
            } = H;
            JF7.checkParentPaths(A, $, q, "move", (_) => {
                if (_) return Y(_);
                if (KG9(q)) return XF7(A, q, z, O, Y);
                eW9(DDA.dirname(q), (J) => {
                    if (J) return Y(J);
                    return XF7(A, q, z, O, Y)
                })
            })
        })
    }

    function KG9(A) {
        let q = DDA.dirname(A);
        return DDA.parse(q).root === q
    }

    function XF7(A, q, K, Y, z) {
        if (Y) return XDA(A, q, K, z);
        if (K) return DF7(q, (w) => {
            if (w) return z(w);
            return XDA(A, q, K, z)
        });
        AG9(q, (w, H) => {
            if (w) return z(w);
            if (H) return z(Error("dest already exists."));
            return XDA(A, q, K, z)
        })
    }

    function XDA(A, q, K, Y) {
        sW9.rename(A, q, (z) => {
            if (!z) return Y();
            if (z.code !== "EXDEV") return Y(z);
            return YG9(A, q, K, Y)
        })
    }

    function YG9(A, q, K, Y) {
        tW9(A, q, {
            overwrite: K,
            errorOnExist: !0
        }, (w) => {
            if (w) return Y(w);
            return DF7(A, Y)
        })
    }
    jF7.exports = qG9
})
// @from(Ln 222318, Col 4)
fF7 = R((EOw, ZF7) => {
    var WF7 = cz(),
        MDA = h1("path"),
        zG9 = s$6().copySync,
        GF7 = Mu1().removeSync,
        wG9 = Ph().mkdirpSync,
        PF7 = lq1();

    function HG9(A, q, K) {
        K = K || {};
        let Y = K.overwrite || K.clobber || !1,
            {
                srcStat: z,
                isChangingCase: w = !1
            } = PF7.checkPathsSync(A, q, "move", K);
        if (PF7.checkParentPathsSync(A, z, q, "move"), !$G9(q)) wG9(MDA.dirname(q));
        return OG9(A, q, Y, w)
    }

    function $G9(A) {
        let q = MDA.dirname(A);
        return MDA.parse(q).root === q
    }

    function OG9(A, q, K, Y) {
        if (Y) return jDA(A, q, K);
        if (K) return GF7(q), jDA(A, q, K);
        if (WF7.existsSync(q)) throw Error("dest already exists.");
        return jDA(A, q, K)
    }

    function jDA(A, q, K) {
        try {
            WF7.renameSync(A, q)
        } catch (Y) {
            if (Y.code !== "EXDEV") throw Y;
            return _G9(A, q, K)
        }
    }

    function _G9(A, q, K) {
        return zG9(A, q, {
            overwrite: K,
            errorOnExist: !0
        }), GF7(A)
    }
    ZF7.exports = HG9
})
// @from(Ln 222366, Col 4)
NF7 = R((kOw, VF7) => {
    var JG9 = fH().fromCallback;
    VF7.exports = {
        move: JG9(MF7()),
        moveSync: fF7()
    }
})
// @from(Ln 222373, Col 4)
vF7 = R((LOw, TF7) => {
    TF7.exports = {
        ...cq1(),
        ...s$6(),
        ...Tm7(),
        ...tm7(),
        ..._F7(),
        ...Ph(),
        ...NF7(),
        ...KO6(),
        ...fa(),
        ...Mu1()
    }
})
// @from(Ln 222387, Col 4)
PDA = R((kF7) => {
    Object.defineProperty(kF7, "__esModule", {
        value: !0
    });
    kF7.childDepType = kF7.depTypeGreater = kF7.DepType = void 0;
    var Q3;
    (function(A) {
        A[A.PROD = 0] = "PROD", A[A.DEV = 1] = "DEV", A[A.OPTIONAL = 2] = "OPTIONAL", A[A.DEV_OPTIONAL = 3] = "DEV_OPTIONAL", A[A.ROOT = 4] = "ROOT"
    })(Q3 = kF7.DepType || (kF7.DepType = {}));
    var XG9 = (A, q) => {
        switch (q) {
            case Q3.DEV:
                switch (A) {
                    case Q3.OPTIONAL:
                    case Q3.PROD:
                    case Q3.ROOT:
                        return !0;
                    case Q3.DEV:
                    case Q3.DEV_OPTIONAL:
                    default:
                        return !1
                }
            case Q3.DEV_OPTIONAL:
                switch (A) {
                    case Q3.OPTIONAL:
                    case Q3.PROD:
                    case Q3.ROOT:
                    case Q3.DEV:
                        return !0;
                    case Q3.DEV_OPTIONAL:
                    default:
                        return !1
                }
            case Q3.OPTIONAL:
                switch (A) {
                    case Q3.PROD:
                    case Q3.ROOT:
                        return !0;
                    case Q3.OPTIONAL:
                    case Q3.DEV:
                    case Q3.DEV_OPTIONAL:
                    default:
                        return !1
                }
            case Q3.PROD:
                switch (A) {
                    case Q3.ROOT:
                        return !0;
                    case Q3.PROD:
                    case Q3.OPTIONAL:
                    case Q3.DEV:
                    case Q3.DEV_OPTIONAL:
                    default:
                        return !1
                }
            case Q3.ROOT:
                switch (A) {
                    case Q3.ROOT:
                    case Q3.PROD:
                    case Q3.OPTIONAL:
                    case Q3.DEV:
                    case Q3.DEV_OPTIONAL:
                    default:
                        return !1
                }
            default:
                return !1
        }
    };
    kF7.depTypeGreater = XG9;
    var DG9 = (A, q) => {
        if (q === Q3.ROOT) throw Error("Something went wrong, a child dependency can't be marked as the ROOT");
        switch (A) {
            case Q3.ROOT:
                return q;
            case Q3.PROD:
                if (q === Q3.OPTIONAL) return Q3.OPTIONAL;
                return Q3.PROD;
            case Q3.OPTIONAL:
                return Q3.OPTIONAL;
            case Q3.DEV_OPTIONAL:
                return Q3.DEV_OPTIONAL;
            case Q3.DEV:
                if (q === Q3.OPTIONAL) return Q3.DEV_OPTIONAL;
                return Q3.DEV
        }
    };
    kF7.childDepType = DG9
})
// @from(Ln 222476, Col 4)
yF7 = R((RF7) => {
    Object.defineProperty(RF7, "__esModule", {
        value: !0
    });
    RF7.NativeModuleType = void 0;
    var MG9;
    (function(A) {
        A[A.NONE = 0] = "NONE", A[A.NODE_GYP = 1] = "NODE_GYP", A[A.PREBUILD = 2] = "PREBUILD"
    })(MG9 = RF7.NativeModuleType || (RF7.NativeModuleType = {}))
})
// @from(Ln 222486, Col 4)
IF7 = R((SF7) => {
    Object.defineProperty(SF7, "__esModule", {
        value: !0
    });
    SF7.Walker = void 0;
    var PG9 = L61(),
        YO6 = vF7(),
        va = h1("path"),
        YR = PDA(),
        GDA = yF7(),
        Zp = PG9("flora-colossus");
    class CF7 {
        constructor(A) {
            if (this.modules = [], this.walkHistory = new Set, this.cache = null, !A || typeof A !== "string") throw Error("modulePath must be provided as a string");
            Zp(`creating walker with rootModule=${A}`), this.rootModule = A
        }
        relativeModule(A, q) {
            return va.resolve(A, "node_modules", q)
        }
        async loadPackageJSON(A) {
            let q = va.resolve(A, "package.json");
            if (await YO6.pathExists(q)) {
                let K = await YO6.readJson(q);
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
                w = null;
            while (!z && this.relativeModule(Y, A) !== w)
                if (w = this.relativeModule(Y, A), await YO6.pathExists(w)) z = w;
                else {
                    if (va.basename(va.dirname(Y)) !== "node_modules") Y = va.dirname(Y);
                    Y = va.dirname(va.dirname(Y))
                } if (!z && K !== YR.DepType.OPTIONAL && K !== YR.DepType.DEV_OPTIONAL) throw Error(`Failed to locate module "${A}" from "${q}"

        This normally means that either you have deleted this package already somehow (check your ignore settings if using electron-packager).  Or your module installation failed.`);
            if (z) await this.walkDependenciesForModule(z, K)
        }
        async detectNativeModuleType(A, q) {
            if (q.dependencies["prebuild-install"]) return GDA.NativeModuleType.PREBUILD;
            else if (await YO6.pathExists(va.join(A, "binding.gyp"))) return GDA.NativeModuleType.NODE_GYP;
            return GDA.NativeModuleType.NONE
        }
        async walkDependenciesForModule(A, q) {
            if (Zp("walk reached:", A, " Type is:", YR.DepType[q]), this.walkHistory.has(A)) {
                Zp("already walked this route");
                let Y = this.modules.find((z) => z.path === A);
                if ((0, YR.depTypeGreater)(q, Y.depType)) Zp(`existing module has a type of "${Y.depType}", new module type would be "${q}" therefore updating`), Y.depType = q;
                return
            }
            let K = await this.loadPackageJSON(A);
            if (!K) {
                Zp("walk hit a dead end, this module is incomplete");
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
                    Zp(`found ${Y} in prod deps of ${A} but it is also marked optional`);
                    continue
                }
                await this.walkDependenciesForModuleInModule(Y, A, (0, YR.childDepType)(q, YR.DepType.PROD))
            }
            for (let Y in K.optionalDependencies) await this.walkDependenciesForModuleInModule(Y, A, (0, YR.childDepType)(q, YR.DepType.OPTIONAL));
            if (q === YR.DepType.ROOT) {
                Zp("we're still at the beginning, walking down the dev route");
                for (let Y in K.devDependencies) await this.walkDependenciesForModuleInModule(Y, A, (0, YR.childDepType)(q, YR.DepType.DEV))
            }
        }
        async walkTree() {
            if (Zp("starting tree walk"), !this.cache) this.cache = new Promise(async (A, q) => {
                this.modules = [];
                try {
                    await this.walkDependenciesForModule(this.rootModule, YR.DepType.ROOT)
                } catch (K) {
                    q(K);
                    return
                }
                A(this.modules)
            });
            else Zp("tree walk in progress / completed already, waiting for existing walk to complete");
            return await this.cache
        }
        getRootModule() {
            return this.rootModule
        }
    }
    SF7.Walker = CF7
})
// @from(Ln 222586, Col 4)
ZDA = R((Ea) => {
    var WG9 = Ea && Ea.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        xF7 = Ea && Ea.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) WG9(q, A, K)
        };
    Object.defineProperty(Ea, "__esModule", {
        value: !0
    });
    xF7(IF7(), Ea);
    xF7(PDA(), Ea)
})
// @from(Ln 222611, Col 4)
mF7 = R((uF7) => {
    Object.defineProperty(uF7, "__esModule", {
        value: !0
    });
    uF7.DestroyerOfModules = void 0;
    var zO6 = CB7(),
        $j1 = h1("path"),
        fDA = ZDA();
    class bF7 {
        constructor({
            rootDirectory: A,
            walker: q,
            shouldKeepModuleTest: K
        }) {
            if (A) this.walker = new fDA.Walker(A);
            else if (q) this.walker = q;
            else throw Error("Must either provide rootDirectory or walker argument");
            if (K) this.shouldKeepFn = K
        }
        async destroyModule(A, q) {
            if (q.get(A)) {
                let Y = $j1.resolve(A, "node_modules");
                if (!await zO6.pathExists(Y)) return;
                for (let z of await zO6.readdir(Y))
                    if (z.startsWith("@"))
                        for (let w of await zO6.readdir($j1.resolve(Y, z))) await this.destroyModule($j1.resolve(Y, z, w), q);
                    else await this.destroyModule($j1.resolve(Y, z), q)
            } else await zO6.remove(A)
        }
        async collectKeptModules({
            relativePaths: A = !1
        }) {
            let q = await this.walker.walkTree(),
                K = new Map,
                Y = $j1.resolve(this.walker.getRootModule());
            for (let z of q)
                if (this.shouldKeepModule(z)) {
                    let w = z.path;
                    if (A) w = w.replace(`${Y}${$j1.sep}`, "");
                    K.set(w, z)
                } return K
        }
        async destroy() {
            await this.destroyModule(this.walker.getRootModule(), await this.collectKeptModules({
                relativePaths: !1
            }))
        }
        shouldKeepModule(A) {
            let q = A.depType === fDA.DepType.DEV || A.depType === fDA.DepType.DEV_OPTIONAL;
            return this.shouldKeepFn ? this.shouldKeepFn(A, q) : !q
        }
    }
    uF7.DestroyerOfModules = bF7
})
// @from(Ln 222665, Col 4)
QF7 = R((ka) => {
    var GG9 = ka && ka.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        FF7 = ka && ka.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) GG9(q, A, K)
        };
    Object.defineProperty(ka, "__esModule", {
        value: !0
    });
    FF7(mF7(), ka);
    FF7(ZDA(), ka)
})
// @from(Ln 222690, Col 4)
pF7 = R((xOw, UF7) => {
    var ZG9 = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        fG9 = ["B", "kiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
        VG9 = ["b", "kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit"],
        NG9 = ["b", "kibit", "Mibit", "Gibit", "Tibit", "Pibit", "Eibit", "Zibit", "Yibit"],
        gF7 = (A, q, K) => {
            let Y = A;
            if (typeof q === "string" || Array.isArray(q)) Y = A.toLocaleString(q, K);
            else if (q === !0 || K !== void 0) Y = A.toLocaleString(void 0, K);
            return Y
        };
    UF7.exports = (A, q) => {
        if (!Number.isFinite(A)) throw TypeError(`Expected a finite number, got ${typeof A}: ${A}`);
        q = Object.assign({
            bits: !1,
            binary: !1
        }, q);
        let K = q.bits ? q.binary ? NG9 : VG9 : q.binary ? fG9 : ZG9;
        if (q.signed && A === 0) return ` 0 ${K[0]}`;
        let Y = A < 0,
            z = Y ? "-" : q.signed ? "+" : "";
        if (Y) A = -A;
        let w;
        if (q.minimumFractionDigits !== void 0) w = {
            minimumFractionDigits: q.minimumFractionDigits
        };
        if (q.maximumFractionDigits !== void 0) w = Object.assign({
            maximumFractionDigits: q.maximumFractionDigits
        }, w);
        if (A < 1) {
            let _ = gF7(A, q.locale, w);
            return z + _ + " " + K[0]
        }
        let H = Math.min(Math.floor(q.binary ? Math.log(A) / Math.log(1024) : Math.log10(A) / 3), K.length - 1);
        if (A /= Math.pow(q.binary ? 1024 : 1000, H), !w) A = A.toPrecision(3);
        let $ = gF7(Number(A), q.locale, w),
            O = K[H];
        return z + $ + " " + O
    }
})
// @from(Ln 222730, Col 4)
d5 = R((bOw, dF7) => {
    dF7.exports = {
        options: {
            usePureJavaScript: !1
        }
    }
})
// @from(Ln 222737, Col 4)
iF7 = R((uOw, lF7) => {
    var VDA = {};
    lF7.exports = VDA;
    var cF7 = {};
    VDA.encode = function(A, q, K) {
        if (typeof q !== "string") throw TypeError('"alphabet" must be a string.');
        if (K !== void 0 && typeof K !== "number") throw TypeError('"maxline" must be a number.');
        var Y = "";
        if (!(A instanceof Uint8Array)) Y = TG9(A, q);
        else {
            var z = 0,
                w = q.length,
                H = q.charAt(0),
                $ = [0];
            for (z = 0; z < A.length; ++z) {
                for (var O = 0, _ = A[z]; O < $.length; ++O) _ += $[O] << 8, $[O] = _ % w, _ = _ / w | 0;
                while (_ > 0) $.push(_ % w), _ = _ / w | 0
            }
            for (z = 0; A[z] === 0 && z < A.length - 1; ++z) Y += H;
            for (z = $.length - 1; z >= 0; --z) Y += q[$[z]]
        }
        if (K) {
            var J = new RegExp(".{1," + K + "}", "g");
            Y = Y.match(J).join(`\r
`)
        }
        return Y
    };
    VDA.decode = function(A, q) {
        if (typeof A !== "string") throw TypeError('"input" must be a string.');
        if (typeof q !== "string") throw TypeError('"alphabet" must be a string.');
        var K = cF7[q];
        if (!K) {
            K = cF7[q] = [];
            for (var Y = 0; Y < q.length; ++Y) K[q.charCodeAt(Y)] = Y
        }
        A = A.replace(/\s/g, "");
        var z = q.length,
            w = q.charAt(0),
            H = [0];
        for (var Y = 0; Y < A.length; Y++) {
            var $ = K[A.charCodeAt(Y)];
            if ($ === void 0) return;
            for (var O = 0, _ = $; O < H.length; ++O) _ += H[O] * z, H[O] = _ & 255, _ >>= 8;
            while (_ > 0) H.push(_ & 255), _ >>= 8
        }
        for (var J = 0; A[J] === w && J < A.length - 1; ++J) H.push(0);
        if (typeof Buffer < "u") return Buffer.from(H.reverse());
        return new Uint8Array(H.reverse())
    };

    function TG9(A, q) {
        var K = 0,
            Y = q.length,
            z = q.charAt(0),
            w = [0];
        for (K = 0; K < A.length(); ++K) {
            for (var H = 0, $ = A.at(K); H < w.length; ++H) $ += w[H] << 8, w[H] = $ % Y, $ = $ / Y | 0;
            while ($ > 0) w.push($ % Y), $ = $ / Y | 0
        }
        var O = "";
        for (K = 0; A.at(K) === 0 && K < A.length() - 1; ++K) O += z;
        for (K = w.length - 1; K >= 0; --K) O += q[w[K]];
        return O
    }
})
// @from(Ln 222803, Col 4)
cY = R((BOw, aF7) => {
    var nF7 = d5(),
        rF7 = iF7(),
        n6 = aF7.exports = nF7.util = nF7.util || {};
    (function() {
        if (typeof process < "u" && process.nextTick) {
            if (n6.nextTick = process.nextTick, typeof setImmediate === "function") n6.setImmediate = setImmediate;
            else n6.setImmediate = n6.nextTick;
            return
        }
        if (typeof setImmediate === "function") {
            n6.setImmediate = function() {
                return setImmediate.apply(void 0, arguments)
            }, n6.nextTick = function($) {
                return setImmediate($)
            };
            return
        }
        if (n6.setImmediate = function($) {
                setTimeout($, 0)
            }, typeof window < "u" && typeof window.postMessage === "function") {
            let $ = function(O) {
                if (O.source === window && O.data === A) {
                    O.stopPropagation();
                    var _ = q.slice();
                    q.length = 0, _.forEach(function(J) {
                        J()
                    })
                }
            };
            var H = $,
                A = "forge.setImmediate",
                q = [];
            n6.setImmediate = function(O) {
                if (q.push(O), q.length === 1) window.postMessage(A, "*")
            }, window.addEventListener("message", $, !0)
        }
        if (typeof MutationObserver < "u") {
            var K = Date.now(),
                Y = !0,
                z = document.createElement("div"),
                q = [];
            new MutationObserver(function() {
                var O = q.slice();
                q.length = 0, O.forEach(function(_) {
                    _()
                })
            }).observe(z, {
                attributes: !0
            });
            var w = n6.setImmediate;
            n6.setImmediate = function(O) {
                if (Date.now() - K > 15) K = Date.now(), w(O);
                else if (q.push(O), q.length === 1) z.setAttribute("a", Y = !Y)
            }
        }
        n6.nextTick = n6.setImmediate
    })();
    n6.isNodejs = typeof process < "u" && process.versions && process.versions.node;
    n6.globalScope = function() {
        if (n6.isNodejs) return global;
        return typeof self > "u" ? window : self
    }();
    n6.isArray = Array.isArray || function(A) {
        return Object.prototype.toString.call(A) === "[object Array]"
    };
    n6.isArrayBuffer = function(A) {
        return typeof ArrayBuffer < "u" && A instanceof ArrayBuffer
    };
    n6.isArrayBufferView = function(A) {
        return A && n6.isArrayBuffer(A.buffer) && A.byteLength !== void 0
    };

    function Gu1(A) {
        if (!(A === 8 || A === 16 || A === 24 || A === 32)) throw Error("Only 8, 16, 24, or 32 bits supported: " + A)
    }
    n6.ByteBuffer = NDA;

    function NDA(A) {
        if (this.data = "", this.read = 0, typeof A === "string") this.data = A;
        else if (n6.isArrayBuffer(A) || n6.isArrayBufferView(A))
            if (typeof Buffer < "u" && A instanceof Buffer) this.data = A.toString("binary");
            else {
                var q = new Uint8Array(A);
                try {
                    this.data = String.fromCharCode.apply(null, q)
                } catch (Y) {
                    for (var K = 0; K < q.length; ++K) this.putByte(q[K])
                }
            }
        else if (A instanceof NDA || typeof A === "object" && typeof A.data === "string" && typeof A.read === "number") this.data = A.data, this.read = A.read;
        this._constructedStringLength = 0
    }
    n6.ByteStringBuffer = NDA;
    var vG9 = 4096;
    n6.ByteStringBuffer.prototype._optimizeConstructedString = function(A) {
        if (this._constructedStringLength += A, this._constructedStringLength > vG9) this.data.substr(0, 1), this._constructedStringLength = 0
    };
    n6.ByteStringBuffer.prototype.length = function() {
        return this.data.length - this.read
    };
    n6.ByteStringBuffer.prototype.isEmpty = function() {
        return this.length() <= 0
    };
    n6.ByteStringBuffer.prototype.putByte = function(A) {
        return this.putBytes(String.fromCharCode(A))
    };
    n6.ByteStringBuffer.prototype.fillWithByte = function(A, q) {
        A = String.fromCharCode(A);
        var K = this.data;
        while (q > 0) {
            if (q & 1) K += A;
            if (q >>>= 1, q > 0) A += A
        }
        return this.data = K, this._optimizeConstructedString(q), this
    };
    n6.ByteStringBuffer.prototype.putBytes = function(A) {
        return this.data += A, this._optimizeConstructedString(A.length), this
    };
    n6.ByteStringBuffer.prototype.putString = function(A) {
        return this.putBytes(n6.encodeUtf8(A))
    };
    n6.ByteStringBuffer.prototype.putInt16 = function(A) {
        return this.putBytes(String.fromCharCode(A >> 8 & 255) + String.fromCharCode(A & 255))
    };
    n6.ByteStringBuffer.prototype.putInt24 = function(A) {
        return this.putBytes(String.fromCharCode(A >> 16 & 255) + String.fromCharCode(A >> 8 & 255) + String.fromCharCode(A & 255))
    };
    n6.ByteStringBuffer.prototype.putInt32 = function(A) {
        return this.putBytes(String.fromCharCode(A >> 24 & 255) + String.fromCharCode(A >> 16 & 255) + String.fromCharCode(A >> 8 & 255) + String.fromCharCode(A & 255))
    };
    n6.ByteStringBuffer.prototype.putInt16Le = function(A) {
        return this.putBytes(String.fromCharCode(A & 255) + String.fromCharCode(A >> 8 & 255))
    };
    n6.ByteStringBuffer.prototype.putInt24Le = function(A) {
        return this.putBytes(String.fromCharCode(A & 255) + String.fromCharCode(A >> 8 & 255) + String.fromCharCode(A >> 16 & 255))
    };
    n6.ByteStringBuffer.prototype.putInt32Le = function(A) {
        return this.putBytes(String.fromCharCode(A & 255) + String.fromCharCode(A >> 8 & 255) + String.fromCharCode(A >> 16 & 255) + String.fromCharCode(A >> 24 & 255))
    };
    n6.ByteStringBuffer.prototype.putInt = function(A, q) {
        Gu1(q);
        var K = "";
        do q -= 8, K += String.fromCharCode(A >> q & 255); while (q > 0);
        return this.putBytes(K)
    };
    n6.ByteStringBuffer.prototype.putSignedInt = function(A, q) {
        if (A < 0) A += 2 << q - 1;
        return this.putInt(A, q)
    };
    n6.ByteStringBuffer.prototype.putBuffer = function(A) {
        return this.putBytes(A.getBytes())
    };
    n6.ByteStringBuffer.prototype.getByte = function() {
        return this.data.charCodeAt(this.read++)
    };
    n6.ByteStringBuffer.prototype.getInt16 = function() {
        var A = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1);
        return this.read += 2, A
    };
    n6.ByteStringBuffer.prototype.getInt24 = function() {
        var A = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2);
        return this.read += 3, A
    };
    n6.ByteStringBuffer.prototype.getInt32 = function() {
        var A = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3);
        return this.read += 4, A
    };
    n6.ByteStringBuffer.prototype.getInt16Le = function() {
        var A = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8;
        return this.read += 2, A
    };
    n6.ByteStringBuffer.prototype.getInt24Le = function() {
        var A = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16;
        return this.read += 3, A
    };
    n6.ByteStringBuffer.prototype.getInt32Le = function() {
        var A = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24;
        return this.read += 4, A
    };
    n6.ByteStringBuffer.prototype.getInt = function(A) {
        Gu1(A);
        var q = 0;
        do q = (q << 8) + this.data.charCodeAt(this.read++), A -= 8; while (A > 0);
        return q
    };
    n6.ByteStringBuffer.prototype.getSignedInt = function(A) {
        var q = this.getInt(A),
            K = 2 << A - 2;
        if (q >= K) q -= K << 1;
        return q
    };
    n6.ByteStringBuffer.prototype.getBytes = function(A) {
        var q;
        if (A) A = Math.min(this.length(), A), q = this.data.slice(this.read, this.read + A), this.read += A;
        else if (A === 0) q = "";
        else q = this.read === 0 ? this.data : this.data.slice(this.read), this.clear();
        return q
    };
    n6.ByteStringBuffer.prototype.bytes = function(A) {
        return typeof A > "u" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + A)
    };
    n6.ByteStringBuffer.prototype.at = function(A) {
        return this.data.charCodeAt(this.read + A)
    };
    n6.ByteStringBuffer.prototype.setAt = function(A, q) {
        return this.data = this.data.substr(0, this.read + A) + String.fromCharCode(q) + this.data.substr(this.read + A + 1), this
    };
    n6.ByteStringBuffer.prototype.last = function() {
        return this.data.charCodeAt(this.data.length - 1)
    };
    n6.ByteStringBuffer.prototype.copy = function() {
        var A = n6.createBuffer(this.data);
        return A.read = this.read, A
    };
    n6.ByteStringBuffer.prototype.compact = function() {
        if (this.read > 0) this.data = this.data.slice(this.read), this.read = 0;
        return this
    };
    n6.ByteStringBuffer.prototype.clear = function() {
        return this.data = "", this.read = 0, this
    };
    n6.ByteStringBuffer.prototype.truncate = function(A) {
        var q = Math.max(0, this.length() - A);
        return this.data = this.data.substr(this.read, q), this.read = 0, this
    };
    n6.ByteStringBuffer.prototype.toHex = function() {
        var A = "";
        for (var q = this.read; q < this.data.length; ++q) {
            var K = this.data.charCodeAt(q);
            if (K < 16) A += "0";
            A += K.toString(16)
        }
        return A
    };
    n6.ByteStringBuffer.prototype.toString = function() {
        return n6.decodeUtf8(this.bytes())
    };

    function EG9(A, q) {
        q = q || {}, this.read = q.readOffset || 0, this.growSize = q.growSize || 1024;
        var K = n6.isArrayBuffer(A),
            Y = n6.isArrayBufferView(A);
        if (K || Y) {
            if (K) this.data = new DataView(A);
            else this.data = new DataView(A.buffer, A.byteOffset, A.byteLength);
            this.write = "writeOffset" in q ? q.writeOffset : this.data.byteLength;
            return
        }
        if (this.data = new DataView(new ArrayBuffer(0)), this.write = 0, A !== null && A !== void 0) this.putBytes(A);
        if ("writeOffset" in q) this.write = q.writeOffset
    }
    n6.DataBuffer = EG9;
    n6.DataBuffer.prototype.length = function() {
        return this.write - this.read
    };
    n6.DataBuffer.prototype.isEmpty = function() {
        return this.length() <= 0
    };
    n6.DataBuffer.prototype.accommodate = function(A, q) {
        if (this.length() >= A) return this;
        q = Math.max(q || this.growSize, A);
        var K = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength),
            Y = new Uint8Array(this.length() + q);
        return Y.set(K), this.data = new DataView(Y.buffer), this
    };
    n6.DataBuffer.prototype.putByte = function(A) {
        return this.accommodate(1), this.data.setUint8(this.write++, A), this
    };
    n6.DataBuffer.prototype.fillWithByte = function(A, q) {
        this.accommodate(q);
        for (var K = 0; K < q; ++K) this.data.setUint8(A);
        return this
    };
    n6.DataBuffer.prototype.putBytes = function(A, q) {
        if (n6.isArrayBufferView(A)) {
            var K = new Uint8Array(A.buffer, A.byteOffset, A.byteLength),
                Y = K.byteLength - K.byteOffset;
            this.accommodate(Y);
            var z = new Uint8Array(this.data.buffer, this.write);
            return z.set(K), this.write += Y, this
        }
        if (n6.isArrayBuffer(A)) {
            var K = new Uint8Array(A);
            this.accommodate(K.byteLength);
            var z = new Uint8Array(this.data.buffer);
            return z.set(K, this.write), this.write += K.byteLength, this
        }
        if (A instanceof n6.DataBuffer || typeof A === "object" && typeof A.read === "number" && typeof A.write === "number" && n6.isArrayBufferView(A.data)) {
            var K = new Uint8Array(A.data.byteLength, A.read, A.length());
            this.accommodate(K.byteLength);
            var z = new Uint8Array(A.data.byteLength, this.write);
            return z.set(K), this.write += K.byteLength, this
        }
        if (A instanceof n6.ByteStringBuffer) A = A.data, q = "binary";
        if (q = q || "binary", typeof A === "string") {
            var w;
            if (q === "hex") return this.accommodate(Math.ceil(A.length / 2)), w = new Uint8Array(this.data.buffer, this.write), this.write += n6.binary.hex.decode(A, w, this.write), this;
            if (q === "base64") return this.accommodate(Math.ceil(A.length / 4) * 3), w = new Uint8Array(this.data.buffer, this.write), this.write += n6.binary.base64.decode(A, w, this.write), this;
            if (q === "utf8") A = n6.encodeUtf8(A), q = "binary";
            if (q === "binary" || q === "raw") return this.accommodate(A.length), w = new Uint8Array(this.data.buffer, this.write), this.write += n6.binary.raw.decode(w), this;
            if (q === "utf16") return this.accommodate(A.length * 2), w = new Uint16Array(this.data.buffer, this.write), this.write += n6.text.utf16.encode(w), this;
            throw Error("Invalid encoding: " + q)
        }
        throw Error("Invalid parameter: " + A)
    };
    n6.DataBuffer.prototype.putBuffer = function(A) {
        return this.putBytes(A), A.clear(), this
    };
    n6.DataBuffer.prototype.putString = function(A) {
        return this.putBytes(A, "utf16")
    };
    n6.DataBuffer.prototype.putInt16 = function(A) {
        return this.accommodate(2), this.data.setInt16(this.write, A), this.write += 2, this
    };
    n6.DataBuffer.prototype.putInt24 = function(A) {
        return this.accommodate(3), this.data.setInt16(this.write, A >> 8 & 65535), this.data.setInt8(this.write, A >> 16 & 255), this.write += 3, this
    };
    n6.DataBuffer.prototype.putInt32 = function(A) {
        return this.accommodate(4), this.data.setInt32(this.write, A), this.write += 4, this
    };
    n6.DataBuffer.prototype.putInt16Le = function(A) {
        return this.accommodate(2), this.data.setInt16(this.write, A, !0), this.write += 2, this
    };
    n6.DataBuffer.prototype.putInt24Le = function(A) {
        return this.accommodate(3), this.data.setInt8(this.write, A >> 16 & 255), this.data.setInt16(this.write, A >> 8 & 65535, !0), this.write += 3, this
    };
    n6.DataBuffer.prototype.putInt32Le = function(A) {
        return this.accommodate(4), this.data.setInt32(this.write, A, !0), this.write += 4, this
    };
    n6.DataBuffer.prototype.putInt = function(A, q) {
        Gu1(q), this.accommodate(q / 8);
        do q -= 8, this.data.setInt8(this.write++, A >> q & 255); while (q > 0);
        return this
    };
    n6.DataBuffer.prototype.putSignedInt = function(A, q) {
        if (Gu1(q), this.accommodate(q / 8), A < 0) A += 2 << q - 1;
        return this.putInt(A, q)
    };
    n6.DataBuffer.prototype.getByte = function() {
        return this.data.getInt8(this.read++)
    };
    n6.DataBuffer.prototype.getInt16 = function() {
        var A = this.data.getInt16(this.read);
        return this.read += 2, A
    };
    n6.DataBuffer.prototype.getInt24 = function() {
        var A = this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2);
        return this.read += 3, A
    };
    n6.DataBuffer.prototype.getInt32 = function() {
        var A = this.data.getInt32(this.read);
        return this.read += 4, A
    };
    n6.DataBuffer.prototype.getInt16Le = function() {
        var A = this.data.getInt16(this.read, !0);
        return this.read += 2, A
    };
    n6.DataBuffer.prototype.getInt24Le = function() {
        var A = this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, !0) << 8;
        return this.read += 3, A
    };
    n6.DataBuffer.prototype.getInt32Le = function() {
        var A = this.data.getInt32(this.read, !0);
        return this.read += 4, A
    };
    n6.DataBuffer.prototype.getInt = function(A) {
        Gu1(A);
        var q = 0;
        do q = (q << 8) + this.data.getInt8(this.read++), A -= 8; while (A > 0);
        return q
    };
    n6.DataBuffer.prototype.getSignedInt = function(A) {
        var q = this.getInt(A),
            K = 2 << A - 2;
        if (q >= K) q -= K << 1;
        return q
    };
    n6.DataBuffer.prototype.getBytes = function(A) {
        var q;
        if (A) A = Math.min(this.length(), A), q = this.data.slice(this.read, this.read + A), this.read += A;
        else if (A === 0) q = "";
        else q = this.read === 0 ? this.data : this.data.slice(this.read), this.clear();
        return q
    };
    n6.DataBuffer.prototype.bytes = function(A) {
        return typeof A > "u" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + A)
    };
    n6.DataBuffer.prototype.at = function(A) {
        return this.data.getUint8(this.read + A)
    };
    n6.DataBuffer.prototype.setAt = function(A, q) {
        return this.data.setUint8(A, q), this
    };
    n6.DataBuffer.prototype.last = function() {
        return this.data.getUint8(this.write - 1)
    };
    n6.DataBuffer.prototype.copy = function() {
        return new n6.DataBuffer(this)
    };
    n6.DataBuffer.prototype.compact = function() {
        if (this.read > 0) {
            var A = new Uint8Array(this.data.buffer, this.read),
                q = new Uint8Array(A.byteLength);
            q.set(A), this.data = new DataView(q), this.write -= this.read, this.read = 0
        }
        return this
    };
    n6.DataBuffer.prototype.clear = function() {
        return this.data = new DataView(new ArrayBuffer(0)), this.read = this.write = 0, this
    };
    n6.DataBuffer.prototype.truncate = function(A) {
        return this.write = Math.max(0, this.length() - A), this.read = Math.min(this.read, this.write), this
    };
    n6.DataBuffer.prototype.toHex = function() {
        var A = "";
        for (var q = this.read; q < this.data.byteLength; ++q) {
            var K = this.data.getUint8(q);
            if (K < 16) A += "0";
            A += K.toString(16)
        }
        return A
    };
    n6.DataBuffer.prototype.toString = function(A) {
        var q = new Uint8Array(this.data, this.read, this.length());
        if (A = A || "utf8", A === "binary" || A === "raw") return n6.binary.raw.encode(q);
        if (A === "hex") return n6.binary.hex.encode(q);
        if (A === "base64") return n6.binary.base64.encode(q);
        if (A === "utf8") return n6.text.utf8.decode(q);
        if (A === "utf16") return n6.text.utf16.decode(q);
        throw Error("Invalid encoding: " + A)
    };
    n6.createBuffer = function(A, q) {
        if (q = q || "raw", A !== void 0 && q === "utf8") A = n6.encodeUtf8(A);
        return new n6.ByteBuffer(A)
    };
    n6.fillString = function(A, q) {
        var K = "";
        while (q > 0) {
            if (q & 1) K += A;
            if (q >>>= 1, q > 0) A += A
        }
        return K
    };
    n6.xorBytes = function(A, q, K) {
        var Y = "",
            z = "",
            w = "",
            H = 0,
            $ = 0;
        for (; K > 0; --K, ++H) {
            if (z = A.charCodeAt(H) ^ q.charCodeAt(H), $ >= 10) Y += w, w = "", $ = 0;
            w += String.fromCharCode(z), ++$
        }
        return Y += w, Y
    };
    n6.hexToBytes = function(A) {
        var q = "",
            K = 0;
        if (A.length & !0) K = 1, q += String.fromCharCode(parseInt(A[0], 16));
        for (; K < A.length; K += 2) q += String.fromCharCode(parseInt(A.substr(K, 2), 16));
        return q
    };
    n6.bytesToHex = function(A) {
        return n6.createBuffer(A).toHex()
    };
    n6.int32ToBytes = function(A) {
        return String.fromCharCode(A >> 24 & 255) + String.fromCharCode(A >> 16 & 255) + String.fromCharCode(A >> 8 & 255) + String.fromCharCode(A & 255)
    };
    var La = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        Ra = [62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
        oF7 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    n6.encode64 = function(A, q) {
        var K = "",
            Y = "",
            z, w, H, $ = 0;
        while ($ < A.length) {
            if (z = A.charCodeAt($++), w = A.charCodeAt($++), H = A.charCodeAt($++), K += La.charAt(z >> 2), K += La.charAt((z & 3) << 4 | w >> 4), isNaN(w)) K += "==";
            else K += La.charAt((w & 15) << 2 | H >> 6), K += isNaN(H) ? "=" : La.charAt(H & 63);
            if (q && K.length > q) Y += K.substr(0, q) + `\r
`, K = K.substr(q)
        }
        return Y += K, Y
    };
    n6.decode64 = function(A) {
        A = A.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        var q = "",
            K, Y, z, w, H = 0;
        while (H < A.length)
            if (K = Ra[A.charCodeAt(H++) - 43], Y = Ra[A.charCodeAt(H++) - 43], z = Ra[A.charCodeAt(H++) - 43], w = Ra[A.charCodeAt(H++) - 43], q += String.fromCharCode(K << 2 | Y >> 4), z !== 64) {
                if (q += String.fromCharCode((Y & 15) << 4 | z >> 2), w !== 64) q += String.fromCharCode((z & 3) << 6 | w)
            } return q
    };
    n6.encodeUtf8 = function(A) {
        return unescape(encodeURIComponent(A))
    };
    n6.decodeUtf8 = function(A) {
        return decodeURIComponent(escape(A))
    };
    n6.binary = {
        raw: {},
        hex: {},
        base64: {},
        base58: {},
        baseN: {
            encode: rF7.encode,
            decode: rF7.decode
        }
    };
    n6.binary.raw.encode = function(A) {
        return String.fromCharCode.apply(null, A)
    };
    n6.binary.raw.decode = function(A, q, K) {
        var Y = q;
        if (!Y) Y = new Uint8Array(A.length);
        K = K || 0;
        var z = K;
        for (var w = 0; w < A.length; ++w) Y[z++] = A.charCodeAt(w);
        return q ? z - K : Y
    };
    n6.binary.hex.encode = n6.bytesToHex;
    n6.binary.hex.decode = function(A, q, K) {
        var Y = q;
        if (!Y) Y = new Uint8Array(Math.ceil(A.length / 2));
        K = K || 0;
        var z = 0,
            w = K;
        if (A.length & 1) z = 1, Y[w++] = parseInt(A[0], 16);
        for (; z < A.length; z += 2) Y[w++] = parseInt(A.substr(z, 2), 16);
        return q ? w - K : Y
    };
    n6.binary.base64.encode = function(A, q) {
        var K = "",
            Y = "",
            z, w, H, $ = 0;
        while ($ < A.byteLength) {
            if (z = A[$++], w = A[$++], H = A[$++], K += La.charAt(z >> 2), K += La.charAt((z & 3) << 4 | w >> 4), isNaN(w)) K += "==";
            else K += La.charAt((w & 15) << 2 | H >> 6), K += isNaN(H) ? "=" : La.charAt(H & 63);
            if (q && K.length > q) Y += K.substr(0, q) + `\r
`, K = K.substr(q)
        }
        return Y += K, Y
    };
    n6.binary.base64.decode = function(A, q, K) {
        var Y = q;
        if (!Y) Y = new Uint8Array(Math.ceil(A.length / 4) * 3);
        A = A.replace(/[^A-Za-z0-9\+\/\=]/g, ""), K = K || 0;
        var z, w, H, $, O = 0,
            _ = K;
        while (O < A.length)
            if (z = Ra[A.charCodeAt(O++) - 43], w = Ra[A.charCodeAt(O++) - 43], H = Ra[A.charCodeAt(O++) - 43], $ = Ra[A.charCodeAt(O++) - 43], Y[_++] = z << 2 | w >> 4, H !== 64) {
                if (Y[_++] = (w & 15) << 4 | H >> 2, $ !== 64) Y[_++] = (H & 3) << 6 | $
            } return q ? _ - K : Y.subarray(0, _)
    };
    n6.binary.base58.encode = function(A, q) {
        return n6.binary.baseN.encode(A, oF7, q)
    };
    n6.binary.base58.decode = function(A, q) {
        return n6.binary.baseN.decode(A, oF7, q)
    };
    n6.text = {
        utf8: {},
        utf16: {}
    };
    n6.text.utf8.encode = function(A, q, K) {
        A = n6.encodeUtf8(A);
        var Y = q;
        if (!Y) Y = new Uint8Array(A.length);
        K = K || 0;
        var z = K;
        for (var w = 0; w < A.length; ++w) Y[z++] = A.charCodeAt(w);
        return q ? z - K : Y
    };
    n6.text.utf8.decode = function(A) {
        return n6.decodeUtf8(String.fromCharCode.apply(null, A))
    };
    n6.text.utf16.encode = function(A, q, K) {
        var Y = q;
        if (!Y) Y = new Uint8Array(A.length * 2);
        var z = new Uint16Array(Y.buffer);
        K = K || 0;
        var w = K,
            H = K;
        for (var $ = 0; $ < A.length; ++$) z[H++] = A.charCodeAt($), w += 2;
        return q ? w - K : Y
    };
    n6.text.utf16.decode = function(A) {
        return String.fromCharCode.apply(null, new Uint16Array(A.buffer))
    };
    n6.deflate = function(A, q, K) {
        if (q = n6.decode64(A.deflate(n6.encode64(q)).rval), K) {
            var Y = 2,
                z = q.charCodeAt(1);
            if (z & 32) Y = 6;
            q = q.substring(Y, q.length - 4)
        }
        return q
    };
    n6.inflate = function(A, q, K) {
        var Y = A.inflate(n6.encode64(q)).rval;
        return Y === null ? null : n6.decode64(Y)
    };
    var TDA = function(A, q, K) {
            if (!A) throw Error("WebStorage not available.");
            var Y;
            if (K === null) Y = A.removeItem(q);
            else K = n6.encode64(JSON.stringify(K)), Y = A.setItem(q, K);
            if (typeof Y < "u" && Y.rval !== !0) {
                var z = Error(Y.error.message);
                throw z.id = Y.error.id, z.name = Y.error.name, z
            }
        },
        vDA = function(A, q) {
            if (!A) throw Error("WebStorage not available.");
            var K = A.getItem(q);
            if (A.init)
                if (K.rval === null) {
                    if (K.error) {
                        var Y = Error(K.error.message);
                        throw Y.id = K.error.id, Y.name = K.error.name, Y
                    }
                    K = null
                } else K = K.rval;
            if (K !== null) K = JSON.parse(n6.decode64(K));
            return K
        },
        kG9 = function(A, q, K, Y) {
            var z = vDA(A, q);
            if (z === null) z = {};
            z[K] = Y, TDA(A, q, z)
        },
        LG9 = function(A, q, K) {
            var Y = vDA(A, q);
            if (Y !== null) Y = K in Y ? Y[K] : null;
            return Y
        },
        RG9 = function(A, q, K) {
            var Y = vDA(A, q);
            if (Y !== null && K in Y) {
                delete Y[K];
                var z = !0;
                for (var w in Y) {
                    z = !1;
                    break
                }
                if (z) Y = null;
                TDA(A, q, Y)
            }
        },
        yG9 = function(A, q) {
            TDA(A, q, null)
        },
        wO6 = function(A, q, K) {
            var Y = null;
            if (typeof K > "u") K = ["web", "flash"];
            var z, w = !1,
                H = null;
            for (var $ in K) {
                z = K[$];
                try {
                    if (z === "flash" || z === "both") {
                        if (q[0] === null) throw Error("Flash local storage not available.");
                        Y = A.apply(this, q), w = z === "flash"
                    }
                    if (z === "web" || z === "both") q[0] = localStorage, Y = A.apply(this, q), w = !0
                } catch (O) {
                    H = O
                }
                if (w) break
            }
            if (!w) throw H;
            return Y
        };
    n6.setItem = function(A, q, K, Y, z) {
        wO6(kG9, arguments, z)
    };
    n6.getItem = function(A, q, K, Y) {
        return wO6(LG9, arguments, Y)
    };
    n6.removeItem = function(A, q, K, Y) {
        wO6(RG9, arguments, Y)
    };
    n6.clearItems = function(A, q, K) {
        wO6(yG9, arguments, K)
    };
    n6.isEmpty = function(A) {
        for (var q in A)
            if (A.hasOwnProperty(q)) return !1;
        return !0
    };
    n6.format = function(A) {
        var q = /%./g,
            K, Y, z = 0,
            w = [],
            H = 0;
        while (K = q.exec(A)) {
            if (Y = A.substring(H, q.lastIndex - 2), Y.length > 0) w.push(Y);
            H = q.lastIndex;
            var $ = K[0][1];
            switch ($) {
                case "s":
                case "o":
                    if (z < arguments.length) w.push(arguments[z++ + 1]);
                    else w.push("<?>");
                    break;
                case "%":
                    w.push("%");
                    break;
                default:
                    w.push("<%" + $ + "?>")
            }
        }
        return w.push(A.substring(H)), w.join("")
    };
    n6.formatNumber = function(A, q, K, Y) {
        var z = A,
            w = isNaN(q = Math.abs(q)) ? 2 : q,
            H = K === void 0 ? "," : K,
            $ = Y === void 0 ? "." : Y,
            O = z < 0 ? "-" : "",
            _ = parseInt(z = Math.abs(+z || 0).toFixed(w), 10) + "",
            J = _.length > 3 ? _.length % 3 : 0;
        return O + (J ? _.substr(0, J) + $ : "") + _.substr(J).replace(/(\d{3})(?=\d)/g, "$1" + $) + (w ? H + Math.abs(z - _).toFixed(w).slice(2) : "")
    };
    n6.formatSize = function(A) {
        if (A >= 1073741824) A = n6.formatNumber(A / 1073741824, 2, ".", "") + " GiB";
        else if (A >= 1048576) A = n6.formatNumber(A / 1048576, 2, ".", "") + " MiB";
        else if (A >= 1024) A = n6.formatNumber(A / 1024, 0) + " KiB";
        else A = n6.formatNumber(A, 0) + " bytes";
        return A
    };
    n6.bytesFromIP = function(A) {
        if (A.indexOf(".") !== -1) return n6.bytesFromIPv4(A);
        if (A.indexOf(":") !== -1) return n6.bytesFromIPv6(A);
        return null
    };
    n6.bytesFromIPv4 = function(A) {
        if (A = A.split("."), A.length !== 4) return null;
        var q = n6.createBuffer();
        for (var K = 0; K < A.length; ++K) {
            var Y = parseInt(A[K], 10);
            if (isNaN(Y)) return null;
            q.putByte(Y)
        }
        return q.getBytes()
    };
    n6.bytesFromIPv6 = function(A) {
        var q = 0;
        A = A.split(":").filter(function(H) {
            if (H.length === 0) ++q;
            return !0
        });
        var K = (8 - A.length + q) * 2,
            Y = n6.createBuffer();
        for (var z = 0; z < 8; ++z) {
            if (!A[z] || A[z].length === 0) {
                Y.fillWithByte(0, K), K = 0;
                continue
            }
            var w = n6.hexToBytes(A[z]);
            if (w.length < 2) Y.putByte(0);
            Y.putBytes(w)
        }
        return Y.getBytes()
    };
    n6.bytesToIP = function(A) {
        if (A.length === 4) return n6.bytesToIPv4(A);
        if (A.length === 16) return n6.bytesToIPv6(A);
        return null
    };
    n6.bytesToIPv4 = function(A) {
        if (A.length !== 4) return null;
        var q = [];
        for (var K = 0; K < A.length; ++K) q.push(A.charCodeAt(K));
        return q.join(".")
    };
    n6.bytesToIPv6 = function(A) {
        if (A.length !== 16) return null;
        var q = [],
            K = [],
            Y = 0;
        for (var z = 0; z < A.length; z += 2) {
            var w = n6.bytesToHex(A[z] + A[z + 1]);
            while (w[0] === "0" && w !== "0") w = w.substr(1);
            if (w === "0") {
                var H = K[K.length - 1],
                    $ = q.length;
                if (!H || $ !== H.end + 1) K.push({
                    start: $,
                    end: $
                });
                else if (H.end = $, H.end - H.start > K[Y].end - K[Y].start) Y = K.length - 1
            }
            q.push(w)
        }
        if (K.length > 0) {
            var O = K[Y];
            if (O.end - O.start > 0) {
                if (q.splice(O.start, O.end - O.start + 1, ""), O.start === 0) q.unshift("");
                if (O.end === 7) q.push("")
            }
        }
        return q.join(":")
    };
    n6.estimateCores = function(A, q) {
        if (typeof A === "function") q = A, A = {};
        if (A = A || {}, "cores" in n6 && !A.update) return q(null, n6.cores);
        if (typeof navigator < "u" && "hardwareConcurrency" in navigator && navigator.hardwareConcurrency > 0) return n6.cores = navigator.hardwareConcurrency, q(null, n6.cores);
        if (typeof Worker > "u") return n6.cores = 1, q(null, n6.cores);
        if (typeof Blob > "u") return n6.cores = 2, q(null, n6.cores);
        var K = URL.createObjectURL(new Blob(["(", function() {
            self.addEventListener("message", function(H) {
                var $ = Date.now(),
                    O = $ + 4;
                while (Date.now() < O);
                self.postMessage({
                    st: $,
                    et: O
                })
            })
        }.toString(), ")()"], {
            type: "application/javascript"
        }));
        Y([], 5, 16);

        function Y(H, $, O) {
            if ($ === 0) {
                var _ = Math.floor(H.reduce(function(J, X) {
                    return J + X
                }, 0) / H.length);
                return n6.cores = Math.max(1, _), URL.revokeObjectURL(K), q(null, n6.cores)
            }
            z(O, function(J, X) {
                H.push(w(O, X)), Y(H, $ - 1, O)
            })
        }

        function z(H, $) {
            var O = [],
                _ = [];
            for (var J = 0; J < H; ++J) {
                var X = new Worker(K);
                X.addEventListener("message", function(D) {
                    if (_.push(D.data), _.length === H) {
                        for (var j = 0; j < H; ++j) O[j].terminate();
                        $(null, _)
                    }
                }), O.push(X)
            }
            for (var J = 0; J < H; ++J) O[J].postMessage(J)
        }

        function w(H, $) {
            var O = [];
            for (var _ = 0; _ < H; ++_) {
                var J = $[_],
                    X = O[_] = [];
                for (var D = 0; D < H; ++D) {
                    if (_ === D) continue;
                    var j = $[D];
                    if (J.st > j.st && J.st < j.et || j.st > J.st && j.st < J.et) X.push(D)
                }
            }
            return O.reduce(function(M, P) {
                return Math.max(M, P.length)
            }, 0)
        }
    }
})
// @from(Ln 223672, Col 4)
HO6 = R((mOw, sF7) => {
    var e0 = d5();
    cY();
    sF7.exports = e0.cipher = e0.cipher || {};
    e0.cipher.algorithms = e0.cipher.algorithms || {};
    e0.cipher.createCipher = function(A, q) {
        var K = A;
        if (typeof K === "string") {
            if (K = e0.cipher.getAlgorithm(K), K) K = K()
        }
        if (!K) throw Error("Unsupported algorithm: " + A);
        return new e0.cipher.BlockCipher({
            algorithm: K,
            key: q,
            decrypt: !1
        })
    };
    e0.cipher.createDecipher = function(A, q) {
        var K = A;
        if (typeof K === "string") {
            if (K = e0.cipher.getAlgorithm(K), K) K = K()
        }
        if (!K) throw Error("Unsupported algorithm: " + A);
        return new e0.cipher.BlockCipher({
            algorithm: K,
            key: q,
            decrypt: !0
        })
    };
    e0.cipher.registerAlgorithm = function(A, q) {
        A = A.toUpperCase(), e0.cipher.algorithms[A] = q
    };
    e0.cipher.getAlgorithm = function(A) {
        if (A = A.toUpperCase(), A in e0.cipher.algorithms) return e0.cipher.algorithms[A];
        return null
    };
    var EDA = e0.cipher.BlockCipher = function(A) {
        this.algorithm = A.algorithm, this.mode = this.algorithm.mode, this.blockSize = this.mode.blockSize, this._finish = !1, this._input = null, this.output = null, this._op = A.decrypt ? this.mode.decrypt : this.mode.encrypt, this._decrypt = A.decrypt, this.algorithm.initialize(A)
    };
    EDA.prototype.start = function(A) {
        A = A || {};
        var q = {};
        for (var K in A) q[K] = A[K];
        q.decrypt = this._decrypt, this._finish = !1, this._input = e0.util.createBuffer(), this.output = A.output || e0.util.createBuffer(), this.mode.start(q)
    };
    EDA.prototype.update = function(A) {
        if (A) this._input.putBuffer(A);
        while (!this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish);
        this._input.compact()
    };
    EDA.prototype.finish = function(A) {
        if (A && (this.mode.name === "ECB" || this.mode.name === "CBC")) this.mode.pad = function(K) {
            return A(this.blockSize, K, !1)
        }, this.mode.unpad = function(K) {
            return A(this.blockSize, K, !0)
        };
        var q = {};
        if (q.decrypt = this._decrypt, q.overflow = this._input.length() % this.blockSize, !this._decrypt && this.mode.pad) {
            if (!this.mode.pad(this._input, q)) return !1
        }
        if (this._finish = !0, this.update(), this._decrypt && this.mode.unpad) {
            if (!this.mode.unpad(this.output, q)) return !1
        }
        if (this.mode.afterFinish) {
            if (!this.mode.afterFinish(this.output, q)) return !1
        }
        return !0
    }
})