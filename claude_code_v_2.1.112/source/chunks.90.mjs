
// @from(Ln 239939, Col 0)
async function Qd1(q = process.cwd(), K = !1) {
    let _ = Azz(q),
        z = wT4(_, "manifest.json");
    if (AT4(z)) {
        if (K) return console.log("manifest.json already exists. Use --force to overwrite in non-interactive mode."), !1;
        if (!await Rw({
                message: "manifest.json already exists. Overwrite?",
                default: !1
            })) return console.log("Cancelled"), !1
    }
    if (!K) console.log("This utility will help you create a manifest.json file for your MCPB bundle."), console.log(`Press ^C at any time to quit.
`);
    else console.log("Creating manifest.json with default values...");
    try {
        let Y = $T4(_),
            A = K ? HT4(Y, _) : await PT4(Y, _),
            O = K ? void 0 : await vT4(A.description),
            w = K ? JT4(Y) : await WT4(Y),
            $ = K ? {
                homepage: "",
                documentation: "",
                support: ""
            } : await TT4(),
            j = K ? {
                icon: "",
                screenshots: []
            } : await VT4(),
            H = K ? XT4(Y) : await DT4(Y),
            J = K ? {
                tools: [],
                toolsGenerated: !1
            } : await ZT4(),
            X = K ? {
                prompts: [],
                promptsGenerated: !1
            } : await fT4(),
            M = K ? void 0 : await kT4(H.serverType),
            P = K ? {} : await NT4(),
            W = K ? MT4(Y) : await GT4(Y),
            D = ET4(A, O, w, $, j, H, J.tools, J.toolsGenerated, X.prompts, X.promptsGenerated, M, P, W);
        return Yzz(z, JSON.stringify(D, null, 2) + `
`), console.log(`
Created manifest.json at ${z}`), yT4(), !0
    } catch (Y) {
        if (Y instanceof Error && Y.message.includes("User force closed")) return console.log(`
Cancelled`), !1;
        throw Y
    }
}
// @from(Ln 239988, Col 4)
dd1 = L(() => {
    ud1();
    I68()
})
// @from(Ln 240004, Col 0)
function nd1(q) {
    let K = ld1(q, ".mcpbignore");
    if (!Ozz(K)) return [];
    try {
        return cd1(K, "utf-8").split(/\r?\n/).map((z) => z.trim()).filter((z) => z.length > 0 && !z.startsWith("#"))
    } catch (_) {
        return console.warn(`Warning: Could not read .mcpbignore file: ${_ instanceof Error?_.message:"Unknown error"}`), []
    }
}
// @from(Ln 240014, Col 0)
function id1(q) {
    return RT4.default().add(bT4).add(q)
}
// @from(Ln 240018, Col 0)
function wzz(q, K = []) {
    return id1(K).ignores(q)
}
// @from(Ln 240022, Col 0)
function IT4(q, K = q, _ = {}, z = []) {
    let Y = LT4(q),
        A = id1(z);
    for (let O of Y) {
        let w = ld1(q, O),
            $ = ST4(K, w);
        if (A.ignores($)) continue;
        if (hT4(w).isDirectory()) IT4(w, K, _, z);
        else {
            let H = $.split(CT4).join("/");
            _[H] = cd1(w)
        }
    }
    return _
}
// @from(Ln 240038, Col 0)
function MC8(q, K = q, _ = {}, z = [], Y = 0) {
    let A = LT4(q),
        O = id1(z);
    for (let w of A) {
        let $ = ld1(q, w),
            j = ST4(K, $);
        if (O.ignores(j)) {
            Y++;
            continue
        }
        let H = hT4($);
        if (H.isDirectory()) Y = MC8($, K, _, z, Y).ignoredCount;
        else {
            let J = j.split(CT4).join("/");
            _[J] = {
                data: cd1($),
                mode: H.mode
            }
        }
    }
    return {
        files: _,
        ignoredCount: Y
    }
}
// @from(Ln 240063, Col 4)
RT4
// @from(Ln 240063, Col 9)
bT4
// @from(Ln 240064, Col 4)
rd1 = L(() => {
    RT4 = K6(X$6(), 1), bT4 = [".DS_Store", "Thumbs.db", ".gitignore", ".git", ".mcpbignore", "*.log", ".env*", ".npm", ".npmrc", ".yarnrc", ".yarn", ".eslintrc", ".editorconfig", ".prettierrc", ".prettierignore", ".eslintignore", ".nycrc", ".babelrc", ".pnp.*", "node_modules/.cache", "node_modules/.bin", "*.map", ".env.local", ".env.*.local", "npm-debug.log*", "yarn-debug.log*", "yarn-error.log*", "package-lock.json", "yarn.lock", "*.mcpb", "*.d.ts", "*.tsbuildinfo", "tsconfig.json"]
})
// @from(Ln 240067, Col 4)
B$ = p(($zz) => {
    $zz.fromCallback = function(q) {
        return Object.defineProperty(function(...K) {
            if (typeof K[K.length - 1] === "function") q.apply(this, K);
            else return new Promise((_, z) => {
                K.push((Y, A) => Y != null ? z(Y) : _(A)), q.apply(this, K)
            })
        }, "name", {
            value: q.name
        })
    };
    $zz.fromPromise = function(q) {
        return Object.defineProperty(function(...K) {
            let _ = K[K.length - 1];
            if (typeof _ !== "function") return q.apply(this, K);
            else K.pop(), q.apply(this, K).then((z) => _(null, z), _)
        }, "name", {
            value: q.name
        })
    }
})
// @from(Ln 240088, Col 4)
GH6 = p((od1) => {
    var xT4 = B$().fromCallback,
        Py = lO(),
        Jzz = ["access", "appendFile", "chmod", "chown", "close", "copyFile", "fchmod", "fchown", "fdatasync", "fstat", "fsync", "ftruncate", "futimes", "lchmod", "lchown", "link", "lstat", "mkdir", "mkdtemp", "open", "opendir", "readdir", "readFile", "readlink", "realpath", "rename", "rm", "rmdir", "stat", "symlink", "truncate", "unlink", "utimes", "writeFile"].filter((q) => {
            return typeof Py[q] === "function"
        });
    Object.assign(od1, Py);
    Jzz.forEach((q) => {
        od1[q] = xT4(Py[q])
    });
    od1.exists = function(q, K) {
        if (typeof K === "function") return Py.exists(q, K);
        return new Promise((_) => {
            return Py.exists(q, _)
        })
    };
    od1.read = function(q, K, _, z, Y, A) {
        if (typeof A === "function") return Py.read(q, K, _, z, Y, A);
        return new Promise((O, w) => {
            Py.read(q, K, _, z, Y, ($, j, H) => {
                if ($) return w($);
                O({
                    bytesRead: j,
                    buffer: H
                })
            })
        })
    };
    od1.write = function(q, K, ..._) {
        if (typeof _[_.length - 1] === "function") return Py.write(q, K, ..._);
        return new Promise((z, Y) => {
            Py.write(q, K, ..._, (A, O, w) => {
                if (A) return Y(A);
                z({
                    bytesWritten: O,
                    buffer: w
                })
            })
        })
    };
    if (typeof Py.writev === "function") od1.writev = function(q, K, ..._) {
        if (typeof _[_.length - 1] === "function") return Py.writev(q, K, ..._);
        return new Promise((z, Y) => {
            Py.writev(q, K, ..._, (A, O, w) => {
                if (A) return Y(A);
                z({
                    bytesWritten: O,
                    buffers: w
                })
            })
        })
    };
    if (typeof Py.realpath.native === "function") od1.realpath.native = xT4(Py.realpath.native);
    else process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003")
})
// @from(Ln 240143, Col 4)
mT4 = p((Dzz, uT4) => {
    var Wzz = d6("path");
    Dzz.checkPath = function(K) {
        if (process.platform === "win32") {
            if (/[<>:"|?*]/.test(K.replace(Wzz.parse(K).root, ""))) {
                let z = Error(`Path contains invalid characters: ${K}`);
                throw z.code = "EINVAL", z
            }
        }
    }
})
// @from(Ln 240154, Col 4)
gT4 = p((fzz, ad1) => {
    var BT4 = GH6(),
        {
            checkPath: pT4
        } = mT4(),
        FT4 = (q) => {
            let K = {
                mode: 511
            };
            if (typeof q === "number") return q;
            return {
                ...K,
                ...q
            }.mode
        };
    fzz.makeDir = async (q, K) => {
        return pT4(q), BT4.mkdir(q, {
            mode: FT4(K),
            recursive: !0
        })
    };
    fzz.makeDirSync = (q, K) => {
        return pT4(q), BT4.mkdirSync(q, {
            mode: FT4(K),
            recursive: !0
        })
    }
})
// @from(Ln 240182, Col 4)
Cp = p((Cyw, UT4) => {
    var Tzz = B$().fromPromise,
        {
            makeDir: Vzz,
            makeDirSync: sd1
        } = gT4(),
        td1 = Tzz(Vzz);
    UT4.exports = {
        mkdirs: td1,
        mkdirsSync: sd1,
        mkdirp: td1,
        mkdirpSync: sd1,
        ensureDir: td1,
        ensureDirSync: sd1
    }
})
// @from(Ln 240198, Col 4)
j56 = p((byw, dT4) => {
    var kzz = B$().fromPromise,
        QT4 = GH6();

    function Nzz(q) {
        return QT4.access(q).then(() => !0).catch(() => !1)
    }
    dT4.exports = {
        pathExists: kzz(Nzz),
        pathExistsSync: QT4.existsSync
    }
})
// @from(Ln 240210, Col 4)
ed1 = p((Iyw, cT4) => {
    var FL6 = lO();

    function Ezz(q, K, _, z) {
        FL6.open(q, "r+", (Y, A) => {
            if (Y) return z(Y);
            FL6.futimes(A, K, _, (O) => {
                FL6.close(A, (w) => {
                    if (z) z(O || w)
                })
            })
        })
    }

    function yzz(q, K, _) {
        let z = FL6.openSync(q, "r+");
        return FL6.futimesSync(z, K, _), FL6.closeSync(z)
    }
    cT4.exports = {
        utimesMillis: Ezz,
        utimesMillisSync: yzz
    }
})
// @from(Ln 240233, Col 4)
vH6 = p((xyw, iT4) => {
    var gL6 = GH6(),
        LD = d6("path"),
        Lzz = d6("util");

    function hzz(q, K, _) {
        let z = _.dereference ? (Y) => gL6.stat(Y, {
            bigint: !0
        }) : (Y) => gL6.lstat(Y, {
            bigint: !0
        });
        return Promise.all([z(q), z(K).catch((Y) => {
            if (Y.code === "ENOENT") return null;
            throw Y
        })]).then(([Y, A]) => ({
            srcStat: Y,
            destStat: A
        }))
    }

    function Rzz(q, K, _) {
        let z, Y = _.dereference ? (O) => gL6.statSync(O, {
                bigint: !0
            }) : (O) => gL6.lstatSync(O, {
                bigint: !0
            }),
            A = Y(q);
        try {
            z = Y(K)
        } catch (O) {
            if (O.code === "ENOENT") return {
                srcStat: A,
                destStat: null
            };
            throw O
        }
        return {
            srcStat: A,
            destStat: z
        }
    }

    function Szz(q, K, _, z, Y) {
        Lzz.callbackify(hzz)(q, K, z, (A, O) => {
            if (A) return Y(A);
            let {
                srcStat: w,
                destStat: $
            } = O;
            if ($) {
                if (x68(w, $)) {
                    let j = LD.basename(q),
                        H = LD.basename(K);
                    if (_ === "move" && j !== H && j.toLowerCase() === H.toLowerCase()) return Y(null, {
                        srcStat: w,
                        destStat: $,
                        isChangingCase: !0
                    });
                    return Y(Error("Source and destination must not be the same."))
                }
                if (w.isDirectory() && !$.isDirectory()) return Y(Error(`Cannot overwrite non-directory '${K}' with directory '${q}'.`));
                if (!w.isDirectory() && $.isDirectory()) return Y(Error(`Cannot overwrite directory '${K}' with non-directory '${q}'.`))
            }
            if (w.isDirectory() && qc1(q, K)) return Y(Error(PC8(q, K, _)));
            return Y(null, {
                srcStat: w,
                destStat: $
            })
        })
    }

    function Czz(q, K, _, z) {
        let {
            srcStat: Y,
            destStat: A
        } = Rzz(q, K, z);
        if (A) {
            if (x68(Y, A)) {
                let O = LD.basename(q),
                    w = LD.basename(K);
                if (_ === "move" && O !== w && O.toLowerCase() === w.toLowerCase()) return {
                    srcStat: Y,
                    destStat: A,
                    isChangingCase: !0
                };
                throw Error("Source and destination must not be the same.")
            }
            if (Y.isDirectory() && !A.isDirectory()) throw Error(`Cannot overwrite non-directory '${K}' with directory '${q}'.`);
            if (!Y.isDirectory() && A.isDirectory()) throw Error(`Cannot overwrite directory '${K}' with non-directory '${q}'.`)
        }
        if (Y.isDirectory() && qc1(q, K)) throw Error(PC8(q, K, _));
        return {
            srcStat: Y,
            destStat: A
        }
    }

    function lT4(q, K, _, z, Y) {
        let A = LD.resolve(LD.dirname(q)),
            O = LD.resolve(LD.dirname(_));
        if (O === A || O === LD.parse(O).root) return Y();
        gL6.stat(O, {
            bigint: !0
        }, (w, $) => {
            if (w) {
                if (w.code === "ENOENT") return Y();
                return Y(w)
            }
            if (x68(K, $)) return Y(Error(PC8(q, _, z)));
            return lT4(q, K, O, z, Y)
        })
    }

    function nT4(q, K, _, z) {
        let Y = LD.resolve(LD.dirname(q)),
            A = LD.resolve(LD.dirname(_));
        if (A === Y || A === LD.parse(A).root) return;
        let O;
        try {
            O = gL6.statSync(A, {
                bigint: !0
            })
        } catch (w) {
            if (w.code === "ENOENT") return;
            throw w
        }
        if (x68(K, O)) throw Error(PC8(q, _, z));
        return nT4(q, K, A, z)
    }

    function x68(q, K) {
        return K.ino && K.dev && K.ino === q.ino && K.dev === q.dev
    }

    function qc1(q, K) {
        let _ = LD.resolve(q).split(LD.sep).filter((Y) => Y),
            z = LD.resolve(K).split(LD.sep).filter((Y) => Y);
        return _.reduce((Y, A, O) => Y && z[O] === A, !0)
    }

    function PC8(q, K, _) {
        return `Cannot ${_} '${q}' to a subdirectory of itself, '${K}'.`
    }
    iT4.exports = {
        checkPaths: Szz,
        checkPathsSync: Czz,
        checkParentPaths: lT4,
        checkParentPathsSync: nT4,
        isSrcSubdir: qc1,
        areIdentical: x68
    }
})
// @from(Ln 240385, Col 4)
KV4 = p((uyw, qV4) => {
    var Wy = lO(),
        u68 = d6("path"),
        bzz = Cp().mkdirs,
        Izz = j56().pathExists,
        xzz = ed1().utimesMillis,
        m68 = vH6();

    function uzz(q, K, _, z) {
        if (typeof _ === "function" && !z) z = _, _ = {};
        else if (typeof _ === "function") _ = {
            filter: _
        };
        if (z = z || function() {}, _ = _ || {}, _.clobber = "clobber" in _ ? !!_.clobber : !0, _.overwrite = "overwrite" in _ ? !!_.overwrite : _.clobber, _.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0001");
        m68.checkPaths(q, K, "copy", _, (Y, A) => {
            if (Y) return z(Y);
            let {
                srcStat: O,
                destStat: w
            } = A;
            m68.checkParentPaths(q, O, K, "copy", ($) => {
                if ($) return z($);
                if (_.filter) return aT4(rT4, w, q, K, _, z);
                return rT4(w, q, K, _, z)
            })
        })
    }

    function rT4(q, K, _, z, Y) {
        let A = u68.dirname(_);
        Izz(A, (O, w) => {
            if (O) return Y(O);
            if (w) return WC8(q, K, _, z, Y);
            bzz(A, ($) => {
                if ($) return Y($);
                return WC8(q, K, _, z, Y)
            })
        })
    }

    function aT4(q, K, _, z, Y, A) {
        Promise.resolve(Y.filter(_, z)).then((O) => {
            if (O) return q(K, _, z, Y, A);
            return A()
        }, (O) => A(O))
    }

    function mzz(q, K, _, z, Y) {
        if (z.filter) return aT4(WC8, q, K, _, z, Y);
        return WC8(q, K, _, z, Y)
    }

    function WC8(q, K, _, z, Y) {
        (z.dereference ? Wy.stat : Wy.lstat)(K, (O, w) => {
            if (O) return Y(O);
            if (w.isDirectory()) return dzz(w, q, K, _, z, Y);
            else if (w.isFile() || w.isCharacterDevice() || w.isBlockDevice()) return Bzz(w, q, K, _, z, Y);
            else if (w.isSymbolicLink()) return nzz(q, K, _, z, Y);
            else if (w.isSocket()) return Y(Error(`Cannot copy a socket file: ${K}`));
            else if (w.isFIFO()) return Y(Error(`Cannot copy a FIFO pipe: ${K}`));
            return Y(Error(`Unknown file: ${K}`))
        })
    }

    function Bzz(q, K, _, z, Y, A) {
        if (!K) return sT4(q, _, z, Y, A);
        return pzz(q, _, z, Y, A)
    }

    function pzz(q, K, _, z, Y) {
        if (z.overwrite) Wy.unlink(_, (A) => {
            if (A) return Y(A);
            return sT4(q, K, _, z, Y)
        });
        else if (z.errorOnExist) return Y(Error(`'${_}' already exists`));
        else return Y()
    }

    function sT4(q, K, _, z, Y) {
        Wy.copyFile(K, _, (A) => {
            if (A) return Y(A);
            if (z.preserveTimestamps) return Fzz(q.mode, K, _, Y);
            return DC8(_, q.mode, Y)
        })
    }

    function Fzz(q, K, _, z) {
        if (gzz(q)) return Uzz(_, q, (Y) => {
            if (Y) return z(Y);
            return oT4(q, K, _, z)
        });
        return oT4(q, K, _, z)
    }

    function gzz(q) {
        return (q & 128) === 0
    }

    function Uzz(q, K, _) {
        return DC8(q, K | 128, _)
    }

    function oT4(q, K, _, z) {
        Qzz(K, _, (Y) => {
            if (Y) return z(Y);
            return DC8(_, q, z)
        })
    }

    function DC8(q, K, _) {
        return Wy.chmod(q, K, _)
    }

    function Qzz(q, K, _) {
        Wy.stat(q, (z, Y) => {
            if (z) return _(z);
            return xzz(K, Y.atime, Y.mtime, _)
        })
    }

    function dzz(q, K, _, z, Y, A) {
        if (!K) return czz(q.mode, _, z, Y, A);
        return tT4(_, z, Y, A)
    }

    function czz(q, K, _, z, Y) {
        Wy.mkdir(_, (A) => {
            if (A) return Y(A);
            tT4(K, _, z, (O) => {
                if (O) return Y(O);
                return DC8(_, q, Y)
            })
        })
    }

    function tT4(q, K, _, z) {
        Wy.readdir(q, (Y, A) => {
            if (Y) return z(Y);
            return eT4(A, q, K, _, z)
        })
    }

    function eT4(q, K, _, z, Y) {
        let A = q.pop();
        if (!A) return Y();
        return lzz(q, A, K, _, z, Y)
    }

    function lzz(q, K, _, z, Y, A) {
        let O = u68.join(_, K),
            w = u68.join(z, K);
        m68.checkPaths(O, w, "copy", Y, ($, j) => {
            if ($) return A($);
            let {
                destStat: H
            } = j;
            mzz(H, O, w, Y, (J) => {
                if (J) return A(J);
                return eT4(q, _, z, Y, A)
            })
        })
    }

    function nzz(q, K, _, z, Y) {
        Wy.readlink(K, (A, O) => {
            if (A) return Y(A);
            if (z.dereference) O = u68.resolve(process.cwd(), O);
            if (!q) return Wy.symlink(O, _, Y);
            else Wy.readlink(_, (w, $) => {
                if (w) {
                    if (w.code === "EINVAL" || w.code === "UNKNOWN") return Wy.symlink(O, _, Y);
                    return Y(w)
                }
                if (z.dereference) $ = u68.resolve(process.cwd(), $);
                if (m68.isSrcSubdir(O, $)) return Y(Error(`Cannot copy '${O}' to a subdirectory of itself, '${$}'.`));
                if (q.isDirectory() && m68.isSrcSubdir($, O)) return Y(Error(`Cannot overwrite '${$}' with '${O}'.`));
                return izz(O, _, Y)
            })
        })
    }

    function izz(q, K, _) {
        Wy.unlink(K, (z) => {
            if (z) return _(z);
            return Wy.symlink(q, K, _)
        })
    }
    qV4.exports = uzz
})
// @from(Ln 240576, Col 4)
OV4 = p((myw, AV4) => {
    var KT = lO(),
        B68 = d6("path"),
        rzz = Cp().mkdirsSync,
        ozz = ed1().utimesMillisSync,
        p68 = vH6();

    function azz(q, K, _) {
        if (typeof _ === "function") _ = {
            filter: _
        };
        if (_ = _ || {}, _.clobber = "clobber" in _ ? !!_.clobber : !0, _.overwrite = "overwrite" in _ ? !!_.overwrite : _.clobber, _.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0002");
        let {
            srcStat: z,
            destStat: Y
        } = p68.checkPathsSync(q, K, "copy", _);
        return p68.checkParentPathsSync(q, z, K, "copy"), szz(Y, q, K, _)
    }

    function szz(q, K, _, z) {
        if (z.filter && !z.filter(K, _)) return;
        let Y = B68.dirname(_);
        if (!KT.existsSync(Y)) rzz(Y);
        return _V4(q, K, _, z)
    }

    function tzz(q, K, _, z) {
        if (z.filter && !z.filter(K, _)) return;
        return _V4(q, K, _, z)
    }

    function _V4(q, K, _, z) {
        let A = (z.dereference ? KT.statSync : KT.lstatSync)(K);
        if (A.isDirectory()) return AYz(A, q, K, _, z);
        else if (A.isFile() || A.isCharacterDevice() || A.isBlockDevice()) return ezz(A, q, K, _, z);
        else if (A.isSymbolicLink()) return $Yz(q, K, _, z);
        else if (A.isSocket()) throw Error(`Cannot copy a socket file: ${K}`);
        else if (A.isFIFO()) throw Error(`Cannot copy a FIFO pipe: ${K}`);
        throw Error(`Unknown file: ${K}`)
    }

    function ezz(q, K, _, z, Y) {
        if (!K) return zV4(q, _, z, Y);
        return qYz(q, _, z, Y)
    }

    function qYz(q, K, _, z) {
        if (z.overwrite) return KT.unlinkSync(_), zV4(q, K, _, z);
        else if (z.errorOnExist) throw Error(`'${_}' already exists`)
    }

    function zV4(q, K, _, z) {
        if (KT.copyFileSync(K, _), z.preserveTimestamps) KYz(q.mode, K, _);
        return Kc1(_, q.mode)
    }

    function KYz(q, K, _) {
        if (_Yz(q)) zYz(_, q);
        return YYz(K, _)
    }

    function _Yz(q) {
        return (q & 128) === 0
    }

    function zYz(q, K) {
        return Kc1(q, K | 128)
    }

    function Kc1(q, K) {
        return KT.chmodSync(q, K)
    }

    function YYz(q, K) {
        let _ = KT.statSync(q);
        return ozz(K, _.atime, _.mtime)
    }

    function AYz(q, K, _, z, Y) {
        if (!K) return OYz(q.mode, _, z, Y);
        return YV4(_, z, Y)
    }

    function OYz(q, K, _, z) {
        return KT.mkdirSync(_), YV4(K, _, z), Kc1(_, q)
    }

    function YV4(q, K, _) {
        KT.readdirSync(q).forEach((z) => wYz(z, q, K, _))
    }

    function wYz(q, K, _, z) {
        let Y = B68.join(K, q),
            A = B68.join(_, q),
            {
                destStat: O
            } = p68.checkPathsSync(Y, A, "copy", z);
        return tzz(O, Y, A, z)
    }

    function $Yz(q, K, _, z) {
        let Y = KT.readlinkSync(K);
        if (z.dereference) Y = B68.resolve(process.cwd(), Y);
        if (!q) return KT.symlinkSync(Y, _);
        else {
            let A;
            try {
                A = KT.readlinkSync(_)
            } catch (O) {
                if (O.code === "EINVAL" || O.code === "UNKNOWN") return KT.symlinkSync(Y, _);
                throw O
            }
            if (z.dereference) A = B68.resolve(process.cwd(), A);
            if (p68.isSrcSubdir(Y, A)) throw Error(`Cannot copy '${Y}' to a subdirectory of itself, '${A}'.`);
            if (KT.statSync(_).isDirectory() && p68.isSrcSubdir(A, Y)) throw Error(`Cannot overwrite '${A}' with '${Y}'.`);
            return jYz(Y, _)
        }
    }

    function jYz(q, K) {
        return KT.unlinkSync(K), KT.symlinkSync(q, K)
    }
    AV4.exports = azz
})
// @from(Ln 240702, Col 4)
ZC8 = p((Byw, wV4) => {
    var HYz = B$().fromCallback;
    wV4.exports = {
        copy: HYz(KV4()),
        copySync: OV4()
    }
})
// @from(Ln 240709, Col 4)
DV4 = p((pyw, WV4) => {
    var $V4 = lO(),
        XV4 = d6("path"),
        Q2 = d6("assert"),
        F68 = process.platform === "win32";

    function MV4(q) {
        ["unlink", "chmod", "stat", "lstat", "rmdir", "readdir"].forEach((_) => {
            q[_] = q[_] || $V4[_], _ = _ + "Sync", q[_] = q[_] || $V4[_]
        }), q.maxBusyTries = q.maxBusyTries || 3
    }

    function _c1(q, K, _) {
        let z = 0;
        if (typeof K === "function") _ = K, K = {};
        Q2(q, "rimraf: missing path"), Q2.strictEqual(typeof q, "string", "rimraf: path should be a string"), Q2.strictEqual(typeof _, "function", "rimraf: callback function required"), Q2(K, "rimraf: invalid options argument provided"), Q2.strictEqual(typeof K, "object", "rimraf: options should be object"), MV4(K), jV4(q, K, function Y(A) {
            if (A) {
                if ((A.code === "EBUSY" || A.code === "ENOTEMPTY" || A.code === "EPERM") && z < K.maxBusyTries) {
                    z++;
                    let O = z * 100;
                    return setTimeout(() => jV4(q, K, Y), O)
                }
                if (A.code === "ENOENT") A = null
            }
            _(A)
        })
    }

    function jV4(q, K, _) {
        Q2(q), Q2(K), Q2(typeof _ === "function"), K.lstat(q, (z, Y) => {
            if (z && z.code === "ENOENT") return _(null);
            if (z && z.code === "EPERM" && F68) return HV4(q, K, z, _);
            if (Y && Y.isDirectory()) return fC8(q, K, z, _);
            K.unlink(q, (A) => {
                if (A) {
                    if (A.code === "ENOENT") return _(null);
                    if (A.code === "EPERM") return F68 ? HV4(q, K, A, _) : fC8(q, K, A, _);
                    if (A.code === "EISDIR") return fC8(q, K, A, _)
                }
                return _(A)
            })
        })
    }

    function HV4(q, K, _, z) {
        Q2(q), Q2(K), Q2(typeof z === "function"), K.chmod(q, 438, (Y) => {
            if (Y) z(Y.code === "ENOENT" ? null : _);
            else K.stat(q, (A, O) => {
                if (A) z(A.code === "ENOENT" ? null : _);
                else if (O.isDirectory()) fC8(q, K, _, z);
                else K.unlink(q, z)
            })
        })
    }

    function JV4(q, K, _) {
        let z;
        Q2(q), Q2(K);
        try {
            K.chmodSync(q, 438)
        } catch (Y) {
            if (Y.code === "ENOENT") return;
            else throw _
        }
        try {
            z = K.statSync(q)
        } catch (Y) {
            if (Y.code === "ENOENT") return;
            else throw _
        }
        if (z.isDirectory()) GC8(q, K, _);
        else K.unlinkSync(q)
    }

    function fC8(q, K, _, z) {
        Q2(q), Q2(K), Q2(typeof z === "function"), K.rmdir(q, (Y) => {
            if (Y && (Y.code === "ENOTEMPTY" || Y.code === "EEXIST" || Y.code === "EPERM")) JYz(q, K, z);
            else if (Y && Y.code === "ENOTDIR") z(_);
            else z(Y)
        })
    }

    function JYz(q, K, _) {
        Q2(q), Q2(K), Q2(typeof _ === "function"), K.readdir(q, (z, Y) => {
            if (z) return _(z);
            let A = Y.length,
                O;
            if (A === 0) return K.rmdir(q, _);
            Y.forEach((w) => {
                _c1(XV4.join(q, w), K, ($) => {
                    if (O) return;
                    if ($) return _(O = $);
                    if (--A === 0) K.rmdir(q, _)
                })
            })
        })
    }

    function PV4(q, K) {
        let _;
        K = K || {}, MV4(K), Q2(q, "rimraf: missing path"), Q2.strictEqual(typeof q, "string", "rimraf: path should be a string"), Q2(K, "rimraf: missing options"), Q2.strictEqual(typeof K, "object", "rimraf: options should be object");
        try {
            _ = K.lstatSync(q)
        } catch (z) {
            if (z.code === "ENOENT") return;
            if (z.code === "EPERM" && F68) JV4(q, K, z)
        }
        try {
            if (_ && _.isDirectory()) GC8(q, K, null);
            else K.unlinkSync(q)
        } catch (z) {
            if (z.code === "ENOENT") return;
            else if (z.code === "EPERM") return F68 ? JV4(q, K, z) : GC8(q, K, z);
            else if (z.code !== "EISDIR") throw z;
            GC8(q, K, z)
        }
    }

    function GC8(q, K, _) {
        Q2(q), Q2(K);
        try {
            K.rmdirSync(q)
        } catch (z) {
            if (z.code === "ENOTDIR") throw _;
            else if (z.code === "ENOTEMPTY" || z.code === "EEXIST" || z.code === "EPERM") XYz(q, K);
            else if (z.code !== "ENOENT") throw z
        }
    }

    function XYz(q, K) {
        if (Q2(q), Q2(K), K.readdirSync(q).forEach((_) => PV4(XV4.join(q, _), K)), F68) {
            let _ = Date.now();
            do try {
                return K.rmdirSync(q, K)
            } catch {}
            while (Date.now() - _ < 500)
        } else return K.rmdirSync(q, K)
    }
    WV4.exports = _c1;
    _c1.sync = PV4
})
// @from(Ln 240850, Col 4)
g68 = p((Fyw, fV4) => {
    var vC8 = lO(),
        MYz = B$().fromCallback,
        ZV4 = DV4();

    function PYz(q, K) {
        if (vC8.rm) return vC8.rm(q, {
            recursive: !0,
            force: !0
        }, K);
        ZV4(q, K)
    }

    function WYz(q) {
        if (vC8.rmSync) return vC8.rmSync(q, {
            recursive: !0,
            force: !0
        });
        ZV4.sync(q)
    }
    fV4.exports = {
        remove: MYz(PYz),
        removeSync: WYz
    }
})
// @from(Ln 240875, Col 4)
yV4 = p((gyw, EV4) => {
    var DYz = B$().fromPromise,
        TV4 = GH6(),
        VV4 = d6("path"),
        kV4 = Cp(),
        NV4 = g68(),
        GV4 = DYz(async function(K) {
            let _;
            try {
                _ = await TV4.readdir(K)
            } catch {
                return kV4.mkdirs(K)
            }
            return Promise.all(_.map((z) => NV4.remove(VV4.join(K, z))))
        });

    function vV4(q) {
        let K;
        try {
            K = TV4.readdirSync(q)
        } catch {
            return kV4.mkdirsSync(q)
        }
        K.forEach((_) => {
            _ = VV4.join(q, _), NV4.removeSync(_)
        })
    }
    EV4.exports = {
        emptyDirSync: vV4,
        emptydirSync: vV4,
        emptyDir: GV4,
        emptydir: GV4
    }
})
// @from(Ln 240909, Col 4)
SV4 = p((Uyw, RV4) => {
    var ZYz = B$().fromCallback,
        LV4 = d6("path"),
        H56 = lO(),
        hV4 = Cp();

    function fYz(q, K) {
        function _() {
            H56.writeFile(q, "", (z) => {
                if (z) return K(z);
                K()
            })
        }
        H56.stat(q, (z, Y) => {
            if (!z && Y.isFile()) return K();
            let A = LV4.dirname(q);
            H56.stat(A, (O, w) => {
                if (O) {
                    if (O.code === "ENOENT") return hV4.mkdirs(A, ($) => {
                        if ($) return K($);
                        _()
                    });
                    return K(O)
                }
                if (w.isDirectory()) _();
                else H56.readdir(A, ($) => {
                    if ($) return K($)
                })
            })
        })
    }

    function GYz(q) {
        let K;
        try {
            K = H56.statSync(q)
        } catch {}
        if (K && K.isFile()) return;
        let _ = LV4.dirname(q);
        try {
            if (!H56.statSync(_).isDirectory()) H56.readdirSync(_)
        } catch (z) {
            if (z && z.code === "ENOENT") hV4.mkdirsSync(_);
            else throw z
        }
        H56.writeFileSync(q, "")
    }
    RV4.exports = {
        createFile: ZYz(fYz),
        createFileSync: GYz
    }
})
// @from(Ln 240961, Col 4)
uV4 = p((Qyw, xV4) => {
    var vYz = B$().fromCallback,
        CV4 = d6("path"),
        J56 = lO(),
        bV4 = Cp(),
        TYz = j56().pathExists,
        {
            areIdentical: IV4
        } = vH6();

    function VYz(q, K, _) {
        function z(Y, A) {
            J56.link(Y, A, (O) => {
                if (O) return _(O);
                _(null)
            })
        }
        J56.lstat(K, (Y, A) => {
            J56.lstat(q, (O, w) => {
                if (O) return O.message = O.message.replace("lstat", "ensureLink"), _(O);
                if (A && IV4(w, A)) return _(null);
                let $ = CV4.dirname(K);
                TYz($, (j, H) => {
                    if (j) return _(j);
                    if (H) return z(q, K);
                    bV4.mkdirs($, (J) => {
                        if (J) return _(J);
                        z(q, K)
                    })
                })
            })
        })
    }

    function kYz(q, K) {
        let _;
        try {
            _ = J56.lstatSync(K)
        } catch {}
        try {
            let A = J56.lstatSync(q);
            if (_ && IV4(A, _)) return
        } catch (A) {
            throw A.message = A.message.replace("lstat", "ensureLink"), A
        }
        let z = CV4.dirname(K);
        if (J56.existsSync(z)) return J56.linkSync(q, K);
        return bV4.mkdirsSync(z), J56.linkSync(q, K)
    }
    xV4.exports = {
        createLink: vYz(VYz),
        createLinkSync: kYz
    }
})
// @from(Ln 241015, Col 4)
BV4 = p((dyw, mV4) => {
    var X56 = d6("path"),
        U68 = lO(),
        NYz = j56().pathExists;

    function EYz(q, K, _) {
        if (X56.isAbsolute(q)) return U68.lstat(q, (z) => {
            if (z) return z.message = z.message.replace("lstat", "ensureSymlink"), _(z);
            return _(null, {
                toCwd: q,
                toDst: q
            })
        });
        else {
            let z = X56.dirname(K),
                Y = X56.join(z, q);
            return NYz(Y, (A, O) => {
                if (A) return _(A);
                if (O) return _(null, {
                    toCwd: Y,
                    toDst: q
                });
                else return U68.lstat(q, (w) => {
                    if (w) return w.message = w.message.replace("lstat", "ensureSymlink"), _(w);
                    return _(null, {
                        toCwd: q,
                        toDst: X56.relative(z, q)
                    })
                })
            })
        }
    }

    function yYz(q, K) {
        let _;
        if (X56.isAbsolute(q)) {
            if (_ = U68.existsSync(q), !_) throw Error("absolute srcpath does not exist");
            return {
                toCwd: q,
                toDst: q
            }
        } else {
            let z = X56.dirname(K),
                Y = X56.join(z, q);
            if (_ = U68.existsSync(Y), _) return {
                toCwd: Y,
                toDst: q
            };
            else {
                if (_ = U68.existsSync(q), !_) throw Error("relative srcpath does not exist");
                return {
                    toCwd: q,
                    toDst: X56.relative(z, q)
                }
            }
        }
    }
    mV4.exports = {
        symlinkPaths: EYz,
        symlinkPathsSync: yYz
    }
})
// @from(Ln 241077, Col 4)
gV4 = p((cyw, FV4) => {
    var pV4 = lO();

    function LYz(q, K, _) {
        if (_ = typeof K === "function" ? K : _, K = typeof K === "function" ? !1 : K, K) return _(null, K);
        pV4.lstat(q, (z, Y) => {
            if (z) return _(null, "file");
            K = Y && Y.isDirectory() ? "dir" : "file", _(null, K)
        })
    }

    function hYz(q, K) {
        let _;
        if (K) return K;
        try {
            _ = pV4.lstatSync(q)
        } catch {
            return "file"
        }
        return _ && _.isDirectory() ? "dir" : "file"
    }
    FV4.exports = {
        symlinkType: LYz,
        symlinkTypeSync: hYz
    }
})
// @from(Ln 241103, Col 4)
rV4 = p((lyw, iV4) => {
    var RYz = B$().fromCallback,
        QV4 = d6("path"),
        bp = GH6(),
        dV4 = Cp(),
        SYz = dV4.mkdirs,
        CYz = dV4.mkdirsSync,
        cV4 = BV4(),
        bYz = cV4.symlinkPaths,
        IYz = cV4.symlinkPathsSync,
        lV4 = gV4(),
        xYz = lV4.symlinkType,
        uYz = lV4.symlinkTypeSync,
        mYz = j56().pathExists,
        {
            areIdentical: nV4
        } = vH6();

    function BYz(q, K, _, z) {
        z = typeof _ === "function" ? _ : z, _ = typeof _ === "function" ? !1 : _, bp.lstat(K, (Y, A) => {
            if (!Y && A.isSymbolicLink()) Promise.all([bp.stat(q), bp.stat(K)]).then(([O, w]) => {
                if (nV4(O, w)) return z(null);
                UV4(q, K, _, z)
            });
            else UV4(q, K, _, z)
        })
    }

    function UV4(q, K, _, z) {
        bYz(q, K, (Y, A) => {
            if (Y) return z(Y);
            q = A.toDst, xYz(A.toCwd, _, (O, w) => {
                if (O) return z(O);
                let $ = QV4.dirname(K);
                mYz($, (j, H) => {
                    if (j) return z(j);
                    if (H) return bp.symlink(q, K, w, z);
                    SYz($, (J) => {
                        if (J) return z(J);
                        bp.symlink(q, K, w, z)
                    })
                })
            })
        })
    }

    function pYz(q, K, _) {
        let z;
        try {
            z = bp.lstatSync(K)
        } catch {}
        if (z && z.isSymbolicLink()) {
            let w = bp.statSync(q),
                $ = bp.statSync(K);
            if (nV4(w, $)) return
        }
        let Y = IYz(q, K);
        q = Y.toDst, _ = uYz(Y.toCwd, _);
        let A = QV4.dirname(K);
        if (bp.existsSync(A)) return bp.symlinkSync(q, K, _);
        return CYz(A), bp.symlinkSync(q, K, _)
    }
    iV4.exports = {
        createSymlink: RYz(BYz),
        createSymlinkSync: pYz
    }
})
// @from(Ln 241170, Col 4)
_k4 = p((nyw, Kk4) => {
    var {
        createFile: oV4,
        createFileSync: aV4
    } = SV4(), {
        createLink: sV4,
        createLinkSync: tV4
    } = uV4(), {
        createSymlink: eV4,
        createSymlinkSync: qk4
    } = rV4();
    Kk4.exports = {
        createFile: oV4,
        createFileSync: aV4,
        ensureFile: oV4,
        ensureFileSync: aV4,
        createLink: sV4,
        createLinkSync: tV4,
        ensureLink: sV4,
        ensureLinkSync: tV4,
        createSymlink: eV4,
        createSymlinkSync: qk4,
        ensureSymlink: eV4,
        ensureSymlinkSync: qk4
    }
})
// @from(Ln 241196, Col 4)
UL6 = p((iyw, zk4) => {
    function FYz(q, {
        EOL: K = `
`,
        finalEOL: _ = !0,
        replacer: z = null,
        spaces: Y
    } = {}) {
        let A = _ ? K : "";
        return JSON.stringify(q, z, Y).replace(/\n/g, K) + A
    }

    function gYz(q) {
        if (Buffer.isBuffer(q)) q = q.toString("utf8");
        return q.replace(/^\uFEFF/, "")
    }
    zk4.exports = {
        stringify: FYz,
        stripBom: gYz
    }
})
// @from(Ln 241217, Col 4)
zc1 = p((ryw, Ok4) => {
    var QL6;
    try {
        QL6 = lO()
    } catch (q) {
        QL6 = d6("fs")
    }
    var TC8 = B$(),
        {
            stringify: Yk4,
            stripBom: Ak4
        } = UL6();
    async function UYz(q, K = {}) {
        if (typeof K === "string") K = {
            encoding: K
        };
        let _ = K.fs || QL6,
            z = "throws" in K ? K.throws : !0,
            Y = await TC8.fromCallback(_.readFile)(q, K);
        Y = Ak4(Y);
        let A;
        try {
            A = JSON.parse(Y, K ? K.reviver : null)
        } catch (O) {
            if (z) throw O.message = `${q}: ${O.message}`, O;
            else return null
        }
        return A
    }
    var QYz = TC8.fromPromise(UYz);

    function dYz(q, K = {}) {
        if (typeof K === "string") K = {
            encoding: K
        };
        let _ = K.fs || QL6,
            z = "throws" in K ? K.throws : !0;
        try {
            let Y = _.readFileSync(q, K);
            return Y = Ak4(Y), JSON.parse(Y, K.reviver)
        } catch (Y) {
            if (z) throw Y.message = `${q}: ${Y.message}`, Y;
            else return null
        }
    }
    async function cYz(q, K, _ = {}) {
        let z = _.fs || QL6,
            Y = Yk4(K, _);
        await TC8.fromCallback(z.writeFile)(q, Y, _)
    }
    var lYz = TC8.fromPromise(cYz);

    function nYz(q, K, _ = {}) {
        let z = _.fs || QL6,
            Y = Yk4(K, _);
        return z.writeFileSync(q, Y, _)
    }
    var iYz = {
        readFile: QYz,
        readFileSync: dYz,
        writeFile: lYz,
        writeFileSync: nYz
    };
    Ok4.exports = iYz
})
// @from(Ln 241282, Col 4)
$k4 = p((oyw, wk4) => {
    var VC8 = zc1();
    wk4.exports = {
        readJson: VC8.readFile,
        readJsonSync: VC8.readFileSync,
        writeJson: VC8.writeFile,
        writeJsonSync: VC8.writeFileSync
    }
})
// @from(Ln 241291, Col 4)
kC8 = p((ayw, Jk4) => {
    var rYz = B$().fromCallback,
        Q68 = lO(),
        jk4 = d6("path"),
        Hk4 = Cp(),
        oYz = j56().pathExists;

    function aYz(q, K, _, z) {
        if (typeof _ === "function") z = _, _ = "utf8";
        let Y = jk4.dirname(q);
        oYz(Y, (A, O) => {
            if (A) return z(A);
            if (O) return Q68.writeFile(q, K, _, z);
            Hk4.mkdirs(Y, (w) => {
                if (w) return z(w);
                Q68.writeFile(q, K, _, z)
            })
        })
    }

    function sYz(q, ...K) {
        let _ = jk4.dirname(q);
        if (Q68.existsSync(_)) return Q68.writeFileSync(q, ...K);
        Hk4.mkdirsSync(_), Q68.writeFileSync(q, ...K)
    }
    Jk4.exports = {
        outputFile: rYz(aYz),
        outputFileSync: sYz
    }
})
// @from(Ln 241321, Col 4)
Mk4 = p((syw, Xk4) => {
    var {
        stringify: tYz
    } = UL6(), {
        outputFile: eYz
    } = kC8();
    async function qAz(q, K, _ = {}) {
        let z = tYz(K, _);
        await eYz(q, z, _)
    }
    Xk4.exports = qAz
})
// @from(Ln 241333, Col 4)
Wk4 = p((tyw, Pk4) => {
    var {
        stringify: KAz
    } = UL6(), {
        outputFileSync: _Az
    } = kC8();

    function zAz(q, K, _) {
        let z = KAz(K, _);
        _Az(q, z, _)
    }
    Pk4.exports = zAz
})
// @from(Ln 241346, Col 4)
Zk4 = p((eyw, Dk4) => {
    var YAz = B$().fromPromise,
        Ik = $k4();
    Ik.outputJson = YAz(Mk4());
    Ik.outputJsonSync = Wk4();
    Ik.outputJSON = Ik.outputJson;
    Ik.outputJSONSync = Ik.outputJsonSync;
    Ik.writeJSON = Ik.writeJson;
    Ik.writeJSONSync = Ik.writeJsonSync;
    Ik.readJSON = Ik.readJson;
    Ik.readJSONSync = Ik.readJsonSync;
    Dk4.exports = Ik
})
// @from(Ln 241359, Col 4)
Vk4 = p((qLw, Tk4) => {
    var AAz = lO(),
        Ac1 = d6("path"),
        OAz = ZC8().copy,
        vk4 = g68().remove,
        wAz = Cp().mkdirp,
        $Az = j56().pathExists,
        fk4 = vH6();

    function jAz(q, K, _, z) {
        if (typeof _ === "function") z = _, _ = {};
        _ = _ || {};
        let Y = _.overwrite || _.clobber || !1;
        fk4.checkPaths(q, K, "move", _, (A, O) => {
            if (A) return z(A);
            let {
                srcStat: w,
                isChangingCase: $ = !1
            } = O;
            fk4.checkParentPaths(q, w, K, "move", (j) => {
                if (j) return z(j);
                if (HAz(K)) return Gk4(q, K, Y, $, z);
                wAz(Ac1.dirname(K), (H) => {
                    if (H) return z(H);
                    return Gk4(q, K, Y, $, z)
                })
            })
        })
    }

    function HAz(q) {
        let K = Ac1.dirname(q);
        return Ac1.parse(K).root === K
    }

    function Gk4(q, K, _, z, Y) {
        if (z) return Yc1(q, K, _, Y);
        if (_) return vk4(K, (A) => {
            if (A) return Y(A);
            return Yc1(q, K, _, Y)
        });
        $Az(K, (A, O) => {
            if (A) return Y(A);
            if (O) return Y(Error("dest already exists."));
            return Yc1(q, K, _, Y)
        })
    }

    function Yc1(q, K, _, z) {
        AAz.rename(q, K, (Y) => {
            if (!Y) return z();
            if (Y.code !== "EXDEV") return z(Y);
            return JAz(q, K, _, z)
        })
    }

    function JAz(q, K, _, z) {
        OAz(q, K, {
            overwrite: _,
            errorOnExist: !0
        }, (A) => {
            if (A) return z(A);
            return vk4(q, z)
        })
    }
    Tk4.exports = jAz
})
// @from(Ln 241426, Col 4)
Lk4 = p((KLw, yk4) => {
    var Nk4 = lO(),
        wc1 = d6("path"),
        XAz = ZC8().copySync,
        Ek4 = g68().removeSync,
        MAz = Cp().mkdirpSync,
        kk4 = vH6();

    function PAz(q, K, _) {
        _ = _ || {};
        let z = _.overwrite || _.clobber || !1,
            {
                srcStat: Y,
                isChangingCase: A = !1
            } = kk4.checkPathsSync(q, K, "move", _);
        if (kk4.checkParentPathsSync(q, Y, K, "move"), !WAz(K)) MAz(wc1.dirname(K));
        return DAz(q, K, z, A)
    }

    function WAz(q) {
        let K = wc1.dirname(q);
        return wc1.parse(K).root === K
    }

    function DAz(q, K, _, z) {
        if (z) return Oc1(q, K, _);
        if (_) return Ek4(K), Oc1(q, K, _);
        if (Nk4.existsSync(K)) throw Error("dest already exists.");
        return Oc1(q, K, _)
    }

    function Oc1(q, K, _) {
        try {
            Nk4.renameSync(q, K)
        } catch (z) {
            if (z.code !== "EXDEV") throw z;
            return ZAz(q, K, _)
        }
    }

    function ZAz(q, K, _) {
        return XAz(q, K, {
            overwrite: _,
            errorOnExist: !0
        }), Ek4(q)
    }
    yk4.exports = PAz
})
// @from(Ln 241474, Col 4)
Rk4 = p((_Lw, hk4) => {
    var fAz = B$().fromCallback;
    hk4.exports = {
        move: fAz(Vk4()),
        moveSync: Lk4()
    }
})
// @from(Ln 241481, Col 4)
Ck4 = p((zLw, Sk4) => {
    Sk4.exports = {
        ...GH6(),
        ...ZC8(),
        ...yV4(),
        ..._k4(),
        ...Zk4(),
        ...Cp(),
        ...Rk4(),
        ...kC8(),
        ...j56(),
        ...g68()
    }
})
// @from(Ln 241495, Col 4)
TH6 = p(($c1) => {
    var bk4 = B$().fromCallback,
        Dy = lO(),
        GAz = ["access", "appendFile", "chmod", "chown", "close", "copyFile", "fchmod", "fchown", "fdatasync", "fstat", "fsync", "ftruncate", "futimes", "lchmod", "lchown", "link", "lstat", "mkdir", "mkdtemp", "open", "opendir", "readdir", "readFile", "readlink", "realpath", "rename", "rm", "rmdir", "stat", "symlink", "truncate", "unlink", "utimes", "writeFile"].filter((q) => {
            return typeof Dy[q] === "function"
        });
    Object.assign($c1, Dy);
    GAz.forEach((q) => {
        $c1[q] = bk4(Dy[q])
    });
    $c1.exists = function(q, K) {
        if (typeof K === "function") return Dy.exists(q, K);
        return new Promise((_) => {
            return Dy.exists(q, _)
        })
    };
    $c1.read = function(q, K, _, z, Y, A) {
        if (typeof A === "function") return Dy.read(q, K, _, z, Y, A);
        return new Promise((O, w) => {
            Dy.read(q, K, _, z, Y, ($, j, H) => {
                if ($) return w($);
                O({
                    bytesRead: j,
                    buffer: H
                })
            })
        })
    };
    $c1.write = function(q, K, ..._) {
        if (typeof _[_.length - 1] === "function") return Dy.write(q, K, ..._);
        return new Promise((z, Y) => {
            Dy.write(q, K, ..._, (A, O, w) => {
                if (A) return Y(A);
                z({
                    bytesWritten: O,
                    buffer: w
                })
            })
        })
    };
    if (typeof Dy.writev === "function") $c1.writev = function(q, K, ..._) {
        if (typeof _[_.length - 1] === "function") return Dy.writev(q, K, ..._);
        return new Promise((z, Y) => {
            Dy.writev(q, K, ..._, (A, O, w) => {
                if (A) return Y(A);
                z({
                    bytesWritten: O,
                    buffers: w
                })
            })
        })
    };
    if (typeof Dy.realpath.native === "function") $c1.realpath.native = bk4(Dy.realpath.native);
    else process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003")
})
// @from(Ln 241550, Col 4)
xk4 = p((NAz, Ik4) => {
    var kAz = d6("path");
    NAz.checkPath = function(K) {
        if (process.platform === "win32") {
            if (/[<>:"|?*]/.test(K.replace(kAz.parse(K).root, ""))) {
                let z = Error(`Path contains invalid characters: ${K}`);
                throw z.code = "EINVAL", z
            }
        }
    }
})
// @from(Ln 241561, Col 4)
pk4 = p((yAz, jc1) => {
    var uk4 = TH6(),
        {
            checkPath: mk4
        } = xk4(),
        Bk4 = (q) => {
            let K = {
                mode: 511
            };
            if (typeof q === "number") return q;
            return {
                ...K,
                ...q
            }.mode
        };
    yAz.makeDir = async (q, K) => {
        return mk4(q), uk4.mkdir(q, {
            mode: Bk4(K),
            recursive: !0
        })
    };
    yAz.makeDirSync = (q, K) => {
        return mk4(q), uk4.mkdirSync(q, {
            mode: Bk4(K),
            recursive: !0
        })
    }
})
// @from(Ln 241589, Col 4)
Ip = p((wLw, Fk4) => {
    var RAz = B$().fromPromise,
        {
            makeDir: SAz,
            makeDirSync: Hc1
        } = pk4(),
        Jc1 = RAz(SAz);
    Fk4.exports = {
        mkdirs: Jc1,
        mkdirsSync: Hc1,
        mkdirp: Jc1,
        mkdirpSync: Hc1,
        ensureDir: Jc1,
        ensureDirSync: Hc1
    }
})
// @from(Ln 241605, Col 4)
M56 = p(($Lw, Uk4) => {
    var CAz = B$().fromPromise,
        gk4 = TH6();

    function bAz(q) {
        return gk4.access(q).then(() => !0).catch(() => !1)
    }
    Uk4.exports = {
        pathExists: CAz(bAz),
        pathExistsSync: gk4.existsSync
    }
})
// @from(Ln 241617, Col 4)
Xc1 = p((jLw, Qk4) => {
    var dL6 = lO();

    function IAz(q, K, _, z) {
        dL6.open(q, "r+", (Y, A) => {
            if (Y) return z(Y);
            dL6.futimes(A, K, _, (O) => {
                dL6.close(A, (w) => {
                    if (z) z(O || w)
                })
            })
        })
    }

    function xAz(q, K, _) {
        let z = dL6.openSync(q, "r+");
        return dL6.futimesSync(z, K, _), dL6.closeSync(z)
    }
    Qk4.exports = {
        utimesMillis: IAz,
        utimesMillisSync: xAz
    }
})
// @from(Ln 241640, Col 4)
VH6 = p((HLw, lk4) => {
    var cL6 = TH6(),
        hD = d6("path"),
        uAz = d6("util");

    function mAz(q, K, _) {
        let z = _.dereference ? (Y) => cL6.stat(Y, {
            bigint: !0
        }) : (Y) => cL6.lstat(Y, {
            bigint: !0
        });
        return Promise.all([z(q), z(K).catch((Y) => {
            if (Y.code === "ENOENT") return null;
            throw Y
        })]).then(([Y, A]) => ({
            srcStat: Y,
            destStat: A
        }))
    }

    function BAz(q, K, _) {
        let z, Y = _.dereference ? (O) => cL6.statSync(O, {
                bigint: !0
            }) : (O) => cL6.lstatSync(O, {
                bigint: !0
            }),
            A = Y(q);
        try {
            z = Y(K)
        } catch (O) {
            if (O.code === "ENOENT") return {
                srcStat: A,
                destStat: null
            };
            throw O
        }
        return {
            srcStat: A,
            destStat: z
        }
    }

    function pAz(q, K, _, z, Y) {
        uAz.callbackify(mAz)(q, K, z, (A, O) => {
            if (A) return Y(A);
            let {
                srcStat: w,
                destStat: $
            } = O;
            if ($) {
                if (d68(w, $)) {
                    let j = hD.basename(q),
                        H = hD.basename(K);
                    if (_ === "move" && j !== H && j.toLowerCase() === H.toLowerCase()) return Y(null, {
                        srcStat: w,
                        destStat: $,
                        isChangingCase: !0
                    });
                    return Y(Error("Source and destination must not be the same."))
                }
                if (w.isDirectory() && !$.isDirectory()) return Y(Error(`Cannot overwrite non-directory '${K}' with directory '${q}'.`));
                if (!w.isDirectory() && $.isDirectory()) return Y(Error(`Cannot overwrite directory '${K}' with non-directory '${q}'.`))
            }
            if (w.isDirectory() && Mc1(q, K)) return Y(Error(NC8(q, K, _)));
            return Y(null, {
                srcStat: w,
                destStat: $
            })
        })
    }

    function FAz(q, K, _, z) {
        let {
            srcStat: Y,
            destStat: A
        } = BAz(q, K, z);
        if (A) {
            if (d68(Y, A)) {
                let O = hD.basename(q),
                    w = hD.basename(K);
                if (_ === "move" && O !== w && O.toLowerCase() === w.toLowerCase()) return {
                    srcStat: Y,
                    destStat: A,
                    isChangingCase: !0
                };
                throw Error("Source and destination must not be the same.")
            }
            if (Y.isDirectory() && !A.isDirectory()) throw Error(`Cannot overwrite non-directory '${K}' with directory '${q}'.`);
            if (!Y.isDirectory() && A.isDirectory()) throw Error(`Cannot overwrite directory '${K}' with non-directory '${q}'.`)
        }
        if (Y.isDirectory() && Mc1(q, K)) throw Error(NC8(q, K, _));
        return {
            srcStat: Y,
            destStat: A
        }
    }

    function dk4(q, K, _, z, Y) {
        let A = hD.resolve(hD.dirname(q)),
            O = hD.resolve(hD.dirname(_));
        if (O === A || O === hD.parse(O).root) return Y();
        cL6.stat(O, {
            bigint: !0
        }, (w, $) => {
            if (w) {
                if (w.code === "ENOENT") return Y();
                return Y(w)
            }
            if (d68(K, $)) return Y(Error(NC8(q, _, z)));
            return dk4(q, K, O, z, Y)
        })
    }

    function ck4(q, K, _, z) {
        let Y = hD.resolve(hD.dirname(q)),
            A = hD.resolve(hD.dirname(_));
        if (A === Y || A === hD.parse(A).root) return;
        let O;
        try {
            O = cL6.statSync(A, {
                bigint: !0
            })
        } catch (w) {
            if (w.code === "ENOENT") return;
            throw w
        }
        if (d68(K, O)) throw Error(NC8(q, _, z));
        return ck4(q, K, A, z)
    }

    function d68(q, K) {
        return K.ino && K.dev && K.ino === q.ino && K.dev === q.dev
    }

    function Mc1(q, K) {
        let _ = hD.resolve(q).split(hD.sep).filter((Y) => Y),
            z = hD.resolve(K).split(hD.sep).filter((Y) => Y);
        return _.reduce((Y, A, O) => Y && z[O] === A, !0)
    }

    function NC8(q, K, _) {
        return `Cannot ${_} '${q}' to a subdirectory of itself, '${K}'.`
    }
    lk4.exports = {
        checkPaths: pAz,
        checkPathsSync: FAz,
        checkParentPaths: dk4,
        checkParentPathsSync: ck4,
        isSrcSubdir: Mc1,
        areIdentical: d68
    }
})
// @from(Ln 241792, Col 4)
ek4 = p((JLw, tk4) => {
    var Zy = lO(),
        c68 = d6("path"),
        gAz = Ip().mkdirs,
        UAz = M56().pathExists,
        QAz = Xc1().utimesMillis,
        l68 = VH6();

    function dAz(q, K, _, z) {
        if (typeof _ === "function" && !z) z = _, _ = {};
        else if (typeof _ === "function") _ = {
            filter: _
        };
        if (z = z || function() {}, _ = _ || {}, _.clobber = "clobber" in _ ? !!_.clobber : !0, _.overwrite = "overwrite" in _ ? !!_.overwrite : _.clobber, _.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0001");
        l68.checkPaths(q, K, "copy", _, (Y, A) => {
            if (Y) return z(Y);
            let {
                srcStat: O,
                destStat: w
            } = A;
            l68.checkParentPaths(q, O, K, "copy", ($) => {
                if ($) return z($);
                if (_.filter) return rk4(nk4, w, q, K, _, z);
                return nk4(w, q, K, _, z)
            })
        })
    }

    function nk4(q, K, _, z, Y) {
        let A = c68.dirname(_);
        UAz(A, (O, w) => {
            if (O) return Y(O);
            if (w) return EC8(q, K, _, z, Y);
            gAz(A, ($) => {
                if ($) return Y($);
                return EC8(q, K, _, z, Y)
            })
        })
    }

    function rk4(q, K, _, z, Y, A) {
        Promise.resolve(Y.filter(_, z)).then((O) => {
            if (O) return q(K, _, z, Y, A);
            return A()
        }, (O) => A(O))
    }

    function cAz(q, K, _, z, Y) {
        if (z.filter) return rk4(EC8, q, K, _, z, Y);
        return EC8(q, K, _, z, Y)
    }

    function EC8(q, K, _, z, Y) {
        (z.dereference ? Zy.stat : Zy.lstat)(K, (O, w) => {
            if (O) return Y(O);
            if (w.isDirectory()) return sAz(w, q, K, _, z, Y);
            else if (w.isFile() || w.isCharacterDevice() || w.isBlockDevice()) return lAz(w, q, K, _, z, Y);
            else if (w.isSymbolicLink()) return qOz(q, K, _, z, Y);
            else if (w.isSocket()) return Y(Error(`Cannot copy a socket file: ${K}`));
            else if (w.isFIFO()) return Y(Error(`Cannot copy a FIFO pipe: ${K}`));
            return Y(Error(`Unknown file: ${K}`))
        })
    }

    function lAz(q, K, _, z, Y, A) {
        if (!K) return ok4(q, _, z, Y, A);
        return nAz(q, _, z, Y, A)
    }

    function nAz(q, K, _, z, Y) {
        if (z.overwrite) Zy.unlink(_, (A) => {
            if (A) return Y(A);
            return ok4(q, K, _, z, Y)
        });
        else if (z.errorOnExist) return Y(Error(`'${_}' already exists`));
        else return Y()
    }

    function ok4(q, K, _, z, Y) {
        Zy.copyFile(K, _, (A) => {
            if (A) return Y(A);
            if (z.preserveTimestamps) return iAz(q.mode, K, _, Y);
            return yC8(_, q.mode, Y)
        })
    }

    function iAz(q, K, _, z) {
        if (rAz(q)) return oAz(_, q, (Y) => {
            if (Y) return z(Y);
            return ik4(q, K, _, z)
        });
        return ik4(q, K, _, z)
    }

    function rAz(q) {
        return (q & 128) === 0
    }

    function oAz(q, K, _) {
        return yC8(q, K | 128, _)
    }

    function ik4(q, K, _, z) {
        aAz(K, _, (Y) => {
            if (Y) return z(Y);
            return yC8(_, q, z)
        })
    }

    function yC8(q, K, _) {
        return Zy.chmod(q, K, _)
    }

    function aAz(q, K, _) {
        Zy.stat(q, (z, Y) => {
            if (z) return _(z);
            return QAz(K, Y.atime, Y.mtime, _)
        })
    }

    function sAz(q, K, _, z, Y, A) {
        if (!K) return tAz(q.mode, _, z, Y, A);
        return ak4(_, z, Y, A)
    }

    function tAz(q, K, _, z, Y) {
        Zy.mkdir(_, (A) => {
            if (A) return Y(A);
            ak4(K, _, z, (O) => {
                if (O) return Y(O);
                return yC8(_, q, Y)
            })
        })
    }

    function ak4(q, K, _, z) {
        Zy.readdir(q, (Y, A) => {
            if (Y) return z(Y);
            return sk4(A, q, K, _, z)
        })
    }

    function sk4(q, K, _, z, Y) {
        let A = q.pop();
        if (!A) return Y();
        return eAz(q, A, K, _, z, Y)
    }

    function eAz(q, K, _, z, Y, A) {
        let O = c68.join(_, K),
            w = c68.join(z, K);
        l68.checkPaths(O, w, "copy", Y, ($, j) => {
            if ($) return A($);
            let {
                destStat: H
            } = j;
            cAz(H, O, w, Y, (J) => {
                if (J) return A(J);
                return sk4(q, _, z, Y, A)
            })
        })
    }

    function qOz(q, K, _, z, Y) {
        Zy.readlink(K, (A, O) => {
            if (A) return Y(A);
            if (z.dereference) O = c68.resolve(process.cwd(), O);
            if (!q) return Zy.symlink(O, _, Y);
            else Zy.readlink(_, (w, $) => {
                if (w) {
                    if (w.code === "EINVAL" || w.code === "UNKNOWN") return Zy.symlink(O, _, Y);
                    return Y(w)
                }
                if (z.dereference) $ = c68.resolve(process.cwd(), $);
                if (l68.isSrcSubdir(O, $)) return Y(Error(`Cannot copy '${O}' to a subdirectory of itself, '${$}'.`));
                if (q.isDirectory() && l68.isSrcSubdir($, O)) return Y(Error(`Cannot overwrite '${$}' with '${O}'.`));
                return KOz(O, _, Y)
            })
        })
    }

    function KOz(q, K, _) {
        Zy.unlink(K, (z) => {
            if (z) return _(z);
            return Zy.symlink(q, K, _)
        })
    }
    tk4.exports = dAz
})
// @from(Ln 241983, Col 4)
YN4 = p((XLw, zN4) => {
    var _T = lO(),
        n68 = d6("path"),
        _Oz = Ip().mkdirsSync,
        zOz = Xc1().utimesMillisSync,
        i68 = VH6();

    function YOz(q, K, _) {
        if (typeof _ === "function") _ = {
            filter: _
        };
        if (_ = _ || {}, _.clobber = "clobber" in _ ? !!_.clobber : !0, _.overwrite = "overwrite" in _ ? !!_.overwrite : _.clobber, _.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0002");
        let {
            srcStat: z,
            destStat: Y
        } = i68.checkPathsSync(q, K, "copy", _);
        return i68.checkParentPathsSync(q, z, K, "copy"), AOz(Y, q, K, _)
    }

    function AOz(q, K, _, z) {
        if (z.filter && !z.filter(K, _)) return;
        let Y = n68.dirname(_);
        if (!_T.existsSync(Y)) _Oz(Y);
        return qN4(q, K, _, z)
    }

    function OOz(q, K, _, z) {
        if (z.filter && !z.filter(K, _)) return;
        return qN4(q, K, _, z)
    }

    function qN4(q, K, _, z) {
        let A = (z.dereference ? _T.statSync : _T.lstatSync)(K);
        if (A.isDirectory()) return MOz(A, q, K, _, z);
        else if (A.isFile() || A.isCharacterDevice() || A.isBlockDevice()) return wOz(A, q, K, _, z);
        else if (A.isSymbolicLink()) return DOz(q, K, _, z);
        else if (A.isSocket()) throw Error(`Cannot copy a socket file: ${K}`);
        else if (A.isFIFO()) throw Error(`Cannot copy a FIFO pipe: ${K}`);
        throw Error(`Unknown file: ${K}`)
    }

    function wOz(q, K, _, z, Y) {
        if (!K) return KN4(q, _, z, Y);
        return $Oz(q, _, z, Y)
    }

    function $Oz(q, K, _, z) {
        if (z.overwrite) return _T.unlinkSync(_), KN4(q, K, _, z);
        else if (z.errorOnExist) throw Error(`'${_}' already exists`)
    }

    function KN4(q, K, _, z) {
        if (_T.copyFileSync(K, _), z.preserveTimestamps) jOz(q.mode, K, _);
        return Pc1(_, q.mode)
    }

    function jOz(q, K, _) {
        if (HOz(q)) JOz(_, q);
        return XOz(K, _)
    }

    function HOz(q) {
        return (q & 128) === 0
    }

    function JOz(q, K) {
        return Pc1(q, K | 128)
    }

    function Pc1(q, K) {
        return _T.chmodSync(q, K)
    }

    function XOz(q, K) {
        let _ = _T.statSync(q);
        return zOz(K, _.atime, _.mtime)
    }

    function MOz(q, K, _, z, Y) {
        if (!K) return POz(q.mode, _, z, Y);
        return _N4(_, z, Y)
    }

    function POz(q, K, _, z) {
        return _T.mkdirSync(_), _N4(K, _, z), Pc1(_, q)
    }

    function _N4(q, K, _) {
        _T.readdirSync(q).forEach((z) => WOz(z, q, K, _))
    }

    function WOz(q, K, _, z) {
        let Y = n68.join(K, q),
            A = n68.join(_, q),
            {
                destStat: O
            } = i68.checkPathsSync(Y, A, "copy", z);
        return OOz(O, Y, A, z)
    }

    function DOz(q, K, _, z) {
        let Y = _T.readlinkSync(K);
        if (z.dereference) Y = n68.resolve(process.cwd(), Y);
        if (!q) return _T.symlinkSync(Y, _);
        else {
            let A;
            try {
                A = _T.readlinkSync(_)
            } catch (O) {
                if (O.code === "EINVAL" || O.code === "UNKNOWN") return _T.symlinkSync(Y, _);
                throw O
            }
            if (z.dereference) A = n68.resolve(process.cwd(), A);
            if (i68.isSrcSubdir(Y, A)) throw Error(`Cannot copy '${Y}' to a subdirectory of itself, '${A}'.`);
            if (_T.statSync(_).isDirectory() && i68.isSrcSubdir(A, Y)) throw Error(`Cannot overwrite '${A}' with '${Y}'.`);
            return ZOz(Y, _)
        }
    }

    function ZOz(q, K) {
        return _T.unlinkSync(K), _T.symlinkSync(q, K)
    }
    zN4.exports = YOz
})
// @from(Ln 242109, Col 4)
LC8 = p((MLw, AN4) => {
    var fOz = B$().fromCallback;
    AN4.exports = {
        copy: fOz(ek4()),
        copySync: YN4()
    }
})
// @from(Ln 242116, Col 4)
PN4 = p((PLw, MN4) => {
    var ON4 = lO(),
        HN4 = d6("path"),
        d2 = d6("assert"),
        r68 = process.platform === "win32";

    function JN4(q) {
        ["unlink", "chmod", "stat", "lstat", "rmdir", "readdir"].forEach((_) => {
            q[_] = q[_] || ON4[_], _ = _ + "Sync", q[_] = q[_] || ON4[_]
        }), q.maxBusyTries = q.maxBusyTries || 3
    }

    function Wc1(q, K, _) {
        let z = 0;
        if (typeof K === "function") _ = K, K = {};
        d2(q, "rimraf: missing path"), d2.strictEqual(typeof q, "string", "rimraf: path should be a string"), d2.strictEqual(typeof _, "function", "rimraf: callback function required"), d2(K, "rimraf: invalid options argument provided"), d2.strictEqual(typeof K, "object", "rimraf: options should be object"), JN4(K), wN4(q, K, function Y(A) {
            if (A) {
                if ((A.code === "EBUSY" || A.code === "ENOTEMPTY" || A.code === "EPERM") && z < K.maxBusyTries) {
                    z++;
                    let O = z * 100;
                    return setTimeout(() => wN4(q, K, Y), O)
                }
                if (A.code === "ENOENT") A = null
            }
            _(A)
        })
    }

    function wN4(q, K, _) {
        d2(q), d2(K), d2(typeof _ === "function"), K.lstat(q, (z, Y) => {
            if (z && z.code === "ENOENT") return _(null);
            if (z && z.code === "EPERM" && r68) return $N4(q, K, z, _);
            if (Y && Y.isDirectory()) return hC8(q, K, z, _);
            K.unlink(q, (A) => {
                if (A) {
                    if (A.code === "ENOENT") return _(null);
                    if (A.code === "EPERM") return r68 ? $N4(q, K, A, _) : hC8(q, K, A, _);
                    if (A.code === "EISDIR") return hC8(q, K, A, _)
                }
                return _(A)
            })
        })
    }

    function $N4(q, K, _, z) {
        d2(q), d2(K), d2(typeof z === "function"), K.chmod(q, 438, (Y) => {
            if (Y) z(Y.code === "ENOENT" ? null : _);
            else K.stat(q, (A, O) => {
                if (A) z(A.code === "ENOENT" ? null : _);
                else if (O.isDirectory()) hC8(q, K, _, z);
                else K.unlink(q, z)
            })
        })
    }

    function jN4(q, K, _) {
        let z;
        d2(q), d2(K);
        try {
            K.chmodSync(q, 438)
        } catch (Y) {
            if (Y.code === "ENOENT") return;
            else throw _
        }
        try {
            z = K.statSync(q)
        } catch (Y) {
            if (Y.code === "ENOENT") return;
            else throw _
        }
        if (z.isDirectory()) RC8(q, K, _);
        else K.unlinkSync(q)
    }

    function hC8(q, K, _, z) {
        d2(q), d2(K), d2(typeof z === "function"), K.rmdir(q, (Y) => {
            if (Y && (Y.code === "ENOTEMPTY" || Y.code === "EEXIST" || Y.code === "EPERM")) GOz(q, K, z);
            else if (Y && Y.code === "ENOTDIR") z(_);
            else z(Y)
        })
    }

    function GOz(q, K, _) {
        d2(q), d2(K), d2(typeof _ === "function"), K.readdir(q, (z, Y) => {
            if (z) return _(z);
            let A = Y.length,
                O;
            if (A === 0) return K.rmdir(q, _);
            Y.forEach((w) => {
                Wc1(HN4.join(q, w), K, ($) => {
                    if (O) return;
                    if ($) return _(O = $);
                    if (--A === 0) K.rmdir(q, _)
                })
            })
        })
    }

    function XN4(q, K) {
        let _;
        K = K || {}, JN4(K), d2(q, "rimraf: missing path"), d2.strictEqual(typeof q, "string", "rimraf: path should be a string"), d2(K, "rimraf: missing options"), d2.strictEqual(typeof K, "object", "rimraf: options should be object");
        try {
            _ = K.lstatSync(q)
        } catch (z) {
            if (z.code === "ENOENT") return;
            if (z.code === "EPERM" && r68) jN4(q, K, z)
        }
        try {
            if (_ && _.isDirectory()) RC8(q, K, null);
            else K.unlinkSync(q)
        } catch (z) {
            if (z.code === "ENOENT") return;
            else if (z.code === "EPERM") return r68 ? jN4(q, K, z) : RC8(q, K, z);
            else if (z.code !== "EISDIR") throw z;
            RC8(q, K, z)
        }
    }

    function RC8(q, K, _) {
        d2(q), d2(K);
        try {
            K.rmdirSync(q)
        } catch (z) {
            if (z.code === "ENOTDIR") throw _;
            else if (z.code === "ENOTEMPTY" || z.code === "EEXIST" || z.code === "EPERM") vOz(q, K);
            else if (z.code !== "ENOENT") throw z
        }
    }

    function vOz(q, K) {
        if (d2(q), d2(K), K.readdirSync(q).forEach((_) => XN4(HN4.join(q, _), K)), r68) {
            let _ = Date.now();
            do try {
                return K.rmdirSync(q, K)
            } catch {}
            while (Date.now() - _ < 500)
        } else return K.rmdirSync(q, K)
    }
    MN4.exports = Wc1;
    Wc1.sync = XN4
})
// @from(Ln 242257, Col 4)
o68 = p((WLw, DN4) => {
    var SC8 = lO(),
        TOz = B$().fromCallback,
        WN4 = PN4();

    function VOz(q, K) {
        if (SC8.rm) return SC8.rm(q, {
            recursive: !0,
            force: !0
        }, K);
        WN4(q, K)
    }

    function kOz(q) {
        if (SC8.rmSync) return SC8.rmSync(q, {
            recursive: !0,
            force: !0
        });
        WN4.sync(q)
    }
    DN4.exports = {
        remove: TOz(VOz),
        removeSync: kOz
    }
})
// @from(Ln 242282, Col 4)
NN4 = p((DLw, kN4) => {
    var NOz = B$().fromPromise,
        GN4 = TH6(),
        vN4 = d6("path"),
        TN4 = Ip(),
        VN4 = o68(),
        ZN4 = NOz(async function(K) {
            let _;
            try {
                _ = await GN4.readdir(K)
            } catch {
                return TN4.mkdirs(K)
            }
            return Promise.all(_.map((z) => VN4.remove(vN4.join(K, z))))
        });

    function fN4(q) {
        let K;
        try {
            K = GN4.readdirSync(q)
        } catch {
            return TN4.mkdirsSync(q)
        }
        K.forEach((_) => {
            _ = vN4.join(q, _), VN4.removeSync(_)
        })
    }
    kN4.exports = {
        emptyDirSync: fN4,
        emptydirSync: fN4,
        emptyDir: ZN4,
        emptydir: ZN4
    }
})
// @from(Ln 242316, Col 4)
hN4 = p((ZLw, LN4) => {
    var EOz = B$().fromCallback,
        EN4 = d6("path"),
        P56 = lO(),
        yN4 = Ip();

    function yOz(q, K) {
        function _() {
            P56.writeFile(q, "", (z) => {
                if (z) return K(z);
                K()
            })
        }
        P56.stat(q, (z, Y) => {
            if (!z && Y.isFile()) return K();
            let A = EN4.dirname(q);
            P56.stat(A, (O, w) => {
                if (O) {
                    if (O.code === "ENOENT") return yN4.mkdirs(A, ($) => {
                        if ($) return K($);
                        _()
                    });
                    return K(O)
                }
                if (w.isDirectory()) _();
                else P56.readdir(A, ($) => {
                    if ($) return K($)
                })
            })
        })
    }

    function LOz(q) {
        let K;
        try {
            K = P56.statSync(q)
        } catch {}
        if (K && K.isFile()) return;
        let _ = EN4.dirname(q);
        try {
            if (!P56.statSync(_).isDirectory()) P56.readdirSync(_)
        } catch (z) {
            if (z && z.code === "ENOENT") yN4.mkdirsSync(_);
            else throw z
        }
        P56.writeFileSync(q, "")
    }
    LN4.exports = {
        createFile: EOz(yOz),
        createFileSync: LOz
    }
})
// @from(Ln 242368, Col 4)
IN4 = p((fLw, bN4) => {
    var hOz = B$().fromCallback,
        RN4 = d6("path"),
        W56 = lO(),
        SN4 = Ip(),
        ROz = M56().pathExists,
        {
            areIdentical: CN4
        } = VH6();

    function SOz(q, K, _) {
        function z(Y, A) {
            W56.link(Y, A, (O) => {
                if (O) return _(O);
                _(null)
            })
        }
        W56.lstat(K, (Y, A) => {
            W56.lstat(q, (O, w) => {
                if (O) return O.message = O.message.replace("lstat", "ensureLink"), _(O);
                if (A && CN4(w, A)) return _(null);
                let $ = RN4.dirname(K);
                ROz($, (j, H) => {
                    if (j) return _(j);
                    if (H) return z(q, K);
                    SN4.mkdirs($, (J) => {
                        if (J) return _(J);
                        z(q, K)
                    })
                })
            })
        })
    }

    function COz(q, K) {
        let _;
        try {
            _ = W56.lstatSync(K)
        } catch {}
        try {
            let A = W56.lstatSync(q);
            if (_ && CN4(A, _)) return
        } catch (A) {
            throw A.message = A.message.replace("lstat", "ensureLink"), A
        }
        let z = RN4.dirname(K);
        if (W56.existsSync(z)) return W56.linkSync(q, K);
        return SN4.mkdirsSync(z), W56.linkSync(q, K)
    }
    bN4.exports = {
        createLink: hOz(SOz),
        createLinkSync: COz
    }
})
// @from(Ln 242422, Col 4)
uN4 = p((GLw, xN4) => {
    var D56 = d6("path"),
        a68 = lO(),
        bOz = M56().pathExists;

    function IOz(q, K, _) {
        if (D56.isAbsolute(q)) return a68.lstat(q, (z) => {
            if (z) return z.message = z.message.replace("lstat", "ensureSymlink"), _(z);
            return _(null, {
                toCwd: q,
                toDst: q
            })
        });
        else {
            let z = D56.dirname(K),
                Y = D56.join(z, q);
            return bOz(Y, (A, O) => {
                if (A) return _(A);
                if (O) return _(null, {
                    toCwd: Y,
                    toDst: q
                });
                else return a68.lstat(q, (w) => {
                    if (w) return w.message = w.message.replace("lstat", "ensureSymlink"), _(w);
                    return _(null, {
                        toCwd: q,
                        toDst: D56.relative(z, q)
                    })
                })
            })
        }
    }

    function xOz(q, K) {
        let _;
        if (D56.isAbsolute(q)) {
            if (_ = a68.existsSync(q), !_) throw Error("absolute srcpath does not exist");
            return {
                toCwd: q,
                toDst: q
            }
        } else {
            let z = D56.dirname(K),
                Y = D56.join(z, q);
            if (_ = a68.existsSync(Y), _) return {
                toCwd: Y,
                toDst: q
            };
            else {
                if (_ = a68.existsSync(q), !_) throw Error("relative srcpath does not exist");
                return {
                    toCwd: q,
                    toDst: D56.relative(z, q)
                }
            }
        }
    }
    xN4.exports = {
        symlinkPaths: IOz,
        symlinkPathsSync: xOz
    }
})
// @from(Ln 242484, Col 4)
pN4 = p((vLw, BN4) => {
    var mN4 = lO();

    function uOz(q, K, _) {
        if (_ = typeof K === "function" ? K : _, K = typeof K === "function" ? !1 : K, K) return _(null, K);
        mN4.lstat(q, (z, Y) => {
            if (z) return _(null, "file");
            K = Y && Y.isDirectory() ? "dir" : "file", _(null, K)
        })
    }

    function mOz(q, K) {
        let _;
        if (K) return K;
        try {
            _ = mN4.lstatSync(q)
        } catch {
            return "file"
        }
        return _ && _.isDirectory() ? "dir" : "file"
    }
    BN4.exports = {
        symlinkType: uOz,
        symlinkTypeSync: mOz
    }
})
// @from(Ln 242510, Col 4)
nN4 = p((TLw, lN4) => {
    var BOz = B$().fromCallback,
        gN4 = d6("path"),
        xp = TH6(),
        UN4 = Ip(),
        pOz = UN4.mkdirs,
        FOz = UN4.mkdirsSync,
        QN4 = uN4(),
        gOz = QN4.symlinkPaths,
        UOz = QN4.symlinkPathsSync,
        dN4 = pN4(),
        QOz = dN4.symlinkType,
        dOz = dN4.symlinkTypeSync,
        cOz = M56().pathExists,
        {
            areIdentical: cN4
        } = VH6();

    function lOz(q, K, _, z) {
        z = typeof _ === "function" ? _ : z, _ = typeof _ === "function" ? !1 : _, xp.lstat(K, (Y, A) => {
            if (!Y && A.isSymbolicLink()) Promise.all([xp.stat(q), xp.stat(K)]).then(([O, w]) => {
                if (cN4(O, w)) return z(null);
                FN4(q, K, _, z)
            });
            else FN4(q, K, _, z)
        })
    }

    function FN4(q, K, _, z) {
        gOz(q, K, (Y, A) => {
            if (Y) return z(Y);
            q = A.toDst, QOz(A.toCwd, _, (O, w) => {
                if (O) return z(O);
                let $ = gN4.dirname(K);
                cOz($, (j, H) => {
                    if (j) return z(j);
                    if (H) return xp.symlink(q, K, w, z);
                    pOz($, (J) => {
                        if (J) return z(J);
                        xp.symlink(q, K, w, z)
                    })
                })
            })
        })
    }

    function nOz(q, K, _) {
        let z;
        try {
            z = xp.lstatSync(K)
        } catch {}
        if (z && z.isSymbolicLink()) {
            let w = xp.statSync(q),
                $ = xp.statSync(K);
            if (cN4(w, $)) return
        }
        let Y = UOz(q, K);
        q = Y.toDst, _ = dOz(Y.toCwd, _);
        let A = gN4.dirname(K);
        if (xp.existsSync(A)) return xp.symlinkSync(q, K, _);
        return FOz(A), xp.symlinkSync(q, K, _)
    }
    lN4.exports = {
        createSymlink: BOz(lOz),
        createSymlinkSync: nOz
    }
})
// @from(Ln 242577, Col 4)
qE4 = p((VLw, eN4) => {
    var {
        createFile: iN4,
        createFileSync: rN4
    } = hN4(), {
        createLink: oN4,
        createLinkSync: aN4
    } = IN4(), {
        createSymlink: sN4,
        createSymlinkSync: tN4
    } = nN4();
    eN4.exports = {
        createFile: iN4,
        createFileSync: rN4,
        ensureFile: iN4,
        ensureFileSync: rN4,
        createLink: oN4,
        createLinkSync: aN4,
        ensureLink: oN4,
        ensureLinkSync: aN4,
        createSymlink: sN4,
        createSymlinkSync: tN4,
        ensureSymlink: sN4,
        ensureSymlinkSync: tN4
    }
})
// @from(Ln 242603, Col 4)
_E4 = p((kLw, KE4) => {
    var CC8 = zc1();
    KE4.exports = {
        readJson: CC8.readFile,
        readJsonSync: CC8.readFileSync,
        writeJson: CC8.writeFile,
        writeJsonSync: CC8.writeFileSync
    }
})
// @from(Ln 242612, Col 4)
bC8 = p((NLw, AE4) => {
    var iOz = B$().fromCallback,
        s68 = lO(),
        zE4 = d6("path"),
        YE4 = Ip(),
        rOz = M56().pathExists;

    function oOz(q, K, _, z) {
        if (typeof _ === "function") z = _, _ = "utf8";
        let Y = zE4.dirname(q);
        rOz(Y, (A, O) => {
            if (A) return z(A);
            if (O) return s68.writeFile(q, K, _, z);
            YE4.mkdirs(Y, (w) => {
                if (w) return z(w);
                s68.writeFile(q, K, _, z)
            })
        })
    }

    function aOz(q, ...K) {
        let _ = zE4.dirname(q);
        if (s68.existsSync(_)) return s68.writeFileSync(q, ...K);
        YE4.mkdirsSync(_), s68.writeFileSync(q, ...K)
    }
    AE4.exports = {
        outputFile: iOz(oOz),
        outputFileSync: aOz
    }
})
// @from(Ln 242642, Col 4)
wE4 = p((ELw, OE4) => {
    var {
        stringify: sOz
    } = UL6(), {
        outputFile: tOz
    } = bC8();
    async function eOz(q, K, _ = {}) {
        let z = sOz(K, _);
        await tOz(q, z, _)
    }
    OE4.exports = eOz
})
// @from(Ln 242654, Col 4)
jE4 = p((yLw, $E4) => {
    var {
        stringify: qwz
    } = UL6(), {
        outputFileSync: Kwz
    } = bC8();

    function _wz(q, K, _) {
        let z = qwz(K, _);
        Kwz(q, z, _)
    }
    $E4.exports = _wz
})
// @from(Ln 242667, Col 4)
JE4 = p((LLw, HE4) => {
    var zwz = B$().fromPromise,
        xk = _E4();
    xk.outputJson = zwz(wE4());
    xk.outputJsonSync = jE4();
    xk.outputJSON = xk.outputJson;
    xk.outputJSONSync = xk.outputJsonSync;
    xk.writeJSON = xk.writeJson;
    xk.writeJSONSync = xk.writeJsonSync;
    xk.readJSON = xk.readJson;
    xk.readJSONSync = xk.readJsonSync;
    HE4.exports = xk
})
// @from(Ln 242680, Col 4)
DE4 = p((hLw, WE4) => {
    var Ywz = lO(),
        Zc1 = d6("path"),
        Awz = LC8().copy,
        PE4 = o68().remove,
        Owz = Ip().mkdirp,
        wwz = M56().pathExists,
        XE4 = VH6();

    function $wz(q, K, _, z) {
        if (typeof _ === "function") z = _, _ = {};
        _ = _ || {};
        let Y = _.overwrite || _.clobber || !1;
        XE4.checkPaths(q, K, "move", _, (A, O) => {
            if (A) return z(A);
            let {
                srcStat: w,
                isChangingCase: $ = !1
            } = O;
            XE4.checkParentPaths(q, w, K, "move", (j) => {
                if (j) return z(j);
                if (jwz(K)) return ME4(q, K, Y, $, z);
                Owz(Zc1.dirname(K), (H) => {
                    if (H) return z(H);
                    return ME4(q, K, Y, $, z)
                })
            })
        })
    }

    function jwz(q) {
        let K = Zc1.dirname(q);
        return Zc1.parse(K).root === K
    }

    function ME4(q, K, _, z, Y) {
        if (z) return Dc1(q, K, _, Y);
        if (_) return PE4(K, (A) => {
            if (A) return Y(A);
            return Dc1(q, K, _, Y)
        });
        wwz(K, (A, O) => {
            if (A) return Y(A);
            if (O) return Y(Error("dest already exists."));
            return Dc1(q, K, _, Y)
        })
    }

    function Dc1(q, K, _, z) {
        Ywz.rename(q, K, (Y) => {
            if (!Y) return z();
            if (Y.code !== "EXDEV") return z(Y);
            return Hwz(q, K, _, z)
        })
    }

    function Hwz(q, K, _, z) {
        Awz(q, K, {
            overwrite: _,
            errorOnExist: !0
        }, (A) => {
            if (A) return z(A);
            return PE4(q, z)
        })
    }
    WE4.exports = $wz
})
// @from(Ln 242747, Col 4)
TE4 = p((RLw, vE4) => {
    var fE4 = lO(),
        Gc1 = d6("path"),
        Jwz = LC8().copySync,
        GE4 = o68().removeSync,
        Xwz = Ip().mkdirpSync,
        ZE4 = VH6();

    function Mwz(q, K, _) {
        _ = _ || {};
        let z = _.overwrite || _.clobber || !1,
            {
                srcStat: Y,
                isChangingCase: A = !1
            } = ZE4.checkPathsSync(q, K, "move", _);
        if (ZE4.checkParentPathsSync(q, Y, K, "move"), !Pwz(K)) Xwz(Gc1.dirname(K));
        return Wwz(q, K, z, A)
    }

    function Pwz(q) {
        let K = Gc1.dirname(q);
        return Gc1.parse(K).root === K
    }

    function Wwz(q, K, _, z) {
        if (z) return fc1(q, K, _);
        if (_) return GE4(K), fc1(q, K, _);
        if (fE4.existsSync(K)) throw Error("dest already exists.");
        return fc1(q, K, _)
    }

    function fc1(q, K, _) {
        try {
            fE4.renameSync(q, K)
        } catch (z) {
            if (z.code !== "EXDEV") throw z;
            return Dwz(q, K, _)
        }
    }

    function Dwz(q, K, _) {
        return Jwz(q, K, {
            overwrite: _,
            errorOnExist: !0
        }), GE4(q)
    }
    vE4.exports = Mwz
})
// @from(Ln 242795, Col 4)
kE4 = p((SLw, VE4) => {
    var Zwz = B$().fromCallback;
    VE4.exports = {
        move: Zwz(DE4()),
        moveSync: TE4()
    }
})
// @from(Ln 242802, Col 4)
EE4 = p((CLw, NE4) => {
    NE4.exports = {
        ...TH6(),
        ...LC8(),
        ...NN4(),
        ...qE4(),
        ...JE4(),
        ...Ip(),
        ...kE4(),
        ...bC8(),
        ...M56(),
        ...o68()
    }
})
// @from(Ln 242816, Col 4)
vc1 = p((LE4) => {
    Object.defineProperty(LE4, "__esModule", {
        value: !0
    });
    LE4.childDepType = LE4.depTypeGreater = LE4.DepType = void 0;
    var k9;
    (function(q) {
        q[q.PROD = 0] = "PROD", q[q.DEV = 1] = "DEV", q[q.OPTIONAL = 2] = "OPTIONAL", q[q.DEV_OPTIONAL = 3] = "DEV_OPTIONAL", q[q.ROOT = 4] = "ROOT"
    })(k9 = LE4.DepType || (LE4.DepType = {}));
    var fwz = (q, K) => {
        switch (K) {
            case k9.DEV:
                switch (q) {
                    case k9.OPTIONAL:
                    case k9.PROD:
                    case k9.ROOT:
                        return !0;
                    case k9.DEV:
                    case k9.DEV_OPTIONAL:
                    default:
                        return !1
                }
            case k9.DEV_OPTIONAL:
                switch (q) {
                    case k9.OPTIONAL:
                    case k9.PROD:
                    case k9.ROOT:
                    case k9.DEV:
                        return !0;
                    case k9.DEV_OPTIONAL:
                    default:
                        return !1
                }
            case k9.OPTIONAL:
                switch (q) {
                    case k9.PROD:
                    case k9.ROOT:
                        return !0;
                    case k9.OPTIONAL:
                    case k9.DEV:
                    case k9.DEV_OPTIONAL:
                    default:
                        return !1
                }
            case k9.PROD:
                switch (q) {
                    case k9.ROOT:
                        return !0;
                    case k9.PROD:
                    case k9.OPTIONAL:
                    case k9.DEV:
                    case k9.DEV_OPTIONAL:
                    default:
                        return !1
                }
            case k9.ROOT:
                switch (q) {
                    case k9.ROOT:
                    case k9.PROD:
                    case k9.OPTIONAL:
                    case k9.DEV:
                    case k9.DEV_OPTIONAL:
                    default:
                        return !1
                }
            default:
                return !1
        }
    };
    LE4.depTypeGreater = fwz;
    var Gwz = (q, K) => {
        if (K === k9.ROOT) throw Error("Something went wrong, a child dependency can't be marked as the ROOT");
        switch (q) {
            case k9.ROOT:
                return K;
            case k9.PROD:
                if (K === k9.OPTIONAL) return k9.OPTIONAL;
                return k9.PROD;
            case k9.OPTIONAL:
                return k9.OPTIONAL;
            case k9.DEV_OPTIONAL:
                return k9.DEV_OPTIONAL;
            case k9.DEV:
                if (K === k9.OPTIONAL) return k9.DEV_OPTIONAL;
                return k9.DEV
        }
    };
    LE4.childDepType = Gwz
})
// @from(Ln 242905, Col 4)
SE4 = p((RE4) => {
    Object.defineProperty(RE4, "__esModule", {
        value: !0
    });
    RE4.NativeModuleType = void 0;
    var Twz;
    (function(q) {
        q[q.NONE = 0] = "NONE", q[q.NODE_GYP = 1] = "NODE_GYP", q[q.PREBUILD = 2] = "PREBUILD"
    })(Twz = RE4.NativeModuleType || (RE4.NativeModuleType = {}))
})
// @from(Ln 242915, Col 4)
xE4 = p((bE4) => {
    Object.defineProperty(bE4, "__esModule", {
        value: !0
    });
    bE4.Walker = void 0;
    var Vwz = $f6(),
        IC8 = EE4(),
        Z56 = d6("path"),
        jx = vc1(),
        Vc1 = SE4(),
        ps = Vwz("flora-colossus");
    class CE4 {
        constructor(q) {
            if (this.modules = [], this.walkHistory = new Set, this.cache = null, !q || typeof q !== "string") throw Error("modulePath must be provided as a string");
            ps(`creating walker with rootModule=${q}`), this.rootModule = q
        }
        relativeModule(q, K) {
            return Z56.resolve(q, "node_modules", K)
        }
        async loadPackageJSON(q) {
            let K = Z56.resolve(q, "package.json");
            if (await IC8.pathExists(K)) {
                let _ = await IC8.readJson(K);
                if (!_.dependencies) _.dependencies = {};
                if (!_.devDependencies) _.devDependencies = {};
                if (!_.optionalDependencies) _.optionalDependencies = {};
                return _
            }
            return null
        }
        async walkDependenciesForModuleInModule(q, K, _) {
            let z = K,
                Y = null,
                A = null;
            while (!Y && this.relativeModule(z, q) !== A)
                if (A = this.relativeModule(z, q), await IC8.pathExists(A)) Y = A;
                else {
                    if (Z56.basename(Z56.dirname(z)) !== "node_modules") z = Z56.dirname(z);
                    z = Z56.dirname(Z56.dirname(z))
                } if (!Y && _ !== jx.DepType.OPTIONAL && _ !== jx.DepType.DEV_OPTIONAL) throw Error(`Failed to locate module "${q}" from "${K}"

        This normally means that either you have deleted this package already somehow (check your ignore settings if using electron-packager).  Or your module installation failed.`);
            if (Y) await this.walkDependenciesForModule(Y, _)
        }
        async detectNativeModuleType(q, K) {
            if (K.dependencies["prebuild-install"]) return Vc1.NativeModuleType.PREBUILD;
            else if (await IC8.pathExists(Z56.join(q, "binding.gyp"))) return Vc1.NativeModuleType.NODE_GYP;
            return Vc1.NativeModuleType.NONE
        }
        async walkDependenciesForModule(q, K) {
            if (ps("walk reached:", q, " Type is:", jx.DepType[K]), this.walkHistory.has(q)) {
                ps("already walked this route");
                let z = this.modules.find((Y) => Y.path === q);
                if ((0, jx.depTypeGreater)(K, z.depType)) ps(`existing module has a type of "${z.depType}", new module type would be "${K}" therefore updating`), z.depType = K;
                return
            }
            let _ = await this.loadPackageJSON(q);
            if (!_) {
                ps("walk hit a dead end, this module is incomplete");
                return
            }
            this.walkHistory.add(q), this.modules.push({
                depType: K,
                nativeModuleType: await this.detectNativeModuleType(q, _),
                path: q,
                name: _.name
            });
            for (let z in _.dependencies) {
                if (z in _.optionalDependencies) {
                    ps(`found ${z} in prod deps of ${q} but it is also marked optional`);
                    continue
                }
                await this.walkDependenciesForModuleInModule(z, q, (0, jx.childDepType)(K, jx.DepType.PROD))
            }
            for (let z in _.optionalDependencies) await this.walkDependenciesForModuleInModule(z, q, (0, jx.childDepType)(K, jx.DepType.OPTIONAL));
            if (K === jx.DepType.ROOT) {
                ps("we're still at the beginning, walking down the dev route");
                for (let z in _.devDependencies) await this.walkDependenciesForModuleInModule(z, q, (0, jx.childDepType)(K, jx.DepType.DEV))
            }
        }
        async walkTree() {
            if (ps("starting tree walk"), !this.cache) this.cache = new Promise(async (q, K) => {
                this.modules = [];
                try {
                    await this.walkDependenciesForModule(this.rootModule, jx.DepType.ROOT)
                } catch (_) {
                    K(_);
                    return
                }
                q(this.modules)
            });
            else ps("tree walk in progress / completed already, waiting for existing walk to complete");
            return await this.cache
        }
        getRootModule() {
            return this.rootModule
        }
    }
    bE4.Walker = CE4
})
// @from(Ln 243015, Col 4)
kc1 = p((f56) => {
    var kwz = f56 && f56.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        uE4 = f56 && f56.__exportStar || function(q, K) {
            for (var _ in q)
                if (_ !== "default" && !Object.prototype.hasOwnProperty.call(K, _)) kwz(K, q, _)
        };
    Object.defineProperty(f56, "__esModule", {
        value: !0
    });
    uE4(xE4(), f56);
    uE4(vc1(), f56)
})
// @from(Ln 243040, Col 4)
FE4 = p((BE4) => {
    Object.defineProperty(BE4, "__esModule", {
        value: !0
    });
    BE4.DestroyerOfModules = void 0;
    var xC8 = Ck4(),
        lL6 = d6("path"),
        Nc1 = kc1();
    class mE4 {
        constructor({
            rootDirectory: q,
            walker: K,
            shouldKeepModuleTest: _
        }) {
            if (q) this.walker = new Nc1.Walker(q);
            else if (K) this.walker = K;
            else throw Error("Must either provide rootDirectory or walker argument");
            if (_) this.shouldKeepFn = _
        }
        async destroyModule(q, K) {
            if (K.get(q)) {
                let z = lL6.resolve(q, "node_modules");
                if (!await xC8.pathExists(z)) return;
                for (let Y of await xC8.readdir(z))
                    if (Y.startsWith("@"))
                        for (let A of await xC8.readdir(lL6.resolve(z, Y))) await this.destroyModule(lL6.resolve(z, Y, A), K);
                    else await this.destroyModule(lL6.resolve(z, Y), K)
            } else await xC8.remove(q)
        }
        async collectKeptModules({
            relativePaths: q = !1
        }) {
            let K = await this.walker.walkTree(),
                _ = new Map,
                z = lL6.resolve(this.walker.getRootModule());
            for (let Y of K)
                if (this.shouldKeepModule(Y)) {
                    let A = Y.path;
                    if (q) A = A.replace(`${z}${lL6.sep}`, "");
                    _.set(A, Y)
                } return _
        }
        async destroy() {
            await this.destroyModule(this.walker.getRootModule(), await this.collectKeptModules({
                relativePaths: !1
            }))
        }
        shouldKeepModule(q) {
            let K = q.depType === Nc1.DepType.DEV || q.depType === Nc1.DepType.DEV_OPTIONAL;
            return this.shouldKeepFn ? this.shouldKeepFn(q, K) : !K
        }
    }
    BE4.DestroyerOfModules = mE4
})
// @from(Ln 243094, Col 4)
UE4 = p((G56) => {
    var Nwz = G56 && G56.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        gE4 = G56 && G56.__exportStar || function(q, K) {
            for (var _ in q)
                if (_ !== "default" && !Object.prototype.hasOwnProperty.call(K, _)) Nwz(K, q, _)
        };
    Object.defineProperty(G56, "__esModule", {
        value: !0
    });
    gE4(FE4(), G56);
    gE4(kc1(), G56)
})
// @from(Ln 243119, Col 4)
cE4 = p((pLw, dE4) => {
    var Ewz = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        ywz = ["B", "kiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
        Lwz = ["b", "kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit"],
        hwz = ["b", "kibit", "Mibit", "Gibit", "Tibit", "Pibit", "Eibit", "Zibit", "Yibit"],
        QE4 = (q, K, _) => {
            let z = q;
            if (typeof K === "string" || Array.isArray(K)) z = q.toLocaleString(K, _);
            else if (K === !0 || _ !== void 0) z = q.toLocaleString(void 0, _);
            return z
        };
    dE4.exports = (q, K) => {
        if (!Number.isFinite(q)) throw TypeError(`Expected a finite number, got ${typeof q}: ${q}`);
        K = Object.assign({
            bits: !1,
            binary: !1
        }, K);
        let _ = K.bits ? K.binary ? hwz : Lwz : K.binary ? ywz : Ewz;
        if (K.signed && q === 0) return ` 0 ${_[0]}`;
        let z = q < 0,
            Y = z ? "-" : K.signed ? "+" : "";
        if (z) q = -q;
        let A;
        if (K.minimumFractionDigits !== void 0) A = {
            minimumFractionDigits: K.minimumFractionDigits
        };
        if (K.maximumFractionDigits !== void 0) A = Object.assign({
            maximumFractionDigits: K.maximumFractionDigits
        }, A);
        if (q < 1) {
            let j = QE4(q, K.locale, A);
            return Y + j + " " + _[0]
        }
        let O = Math.min(Math.floor(K.binary ? Math.log(q) / Math.log(1024) : Math.log10(q) / 3), _.length - 1);
        if (q /= Math.pow(K.binary ? 1024 : 1000, O), !A) q = q.toPrecision(3);
        let w = QE4(Number(q), K.locale, A),
            $ = _[O];
        return Y + w + " " + $
    }
})
// @from(Ln 243159, Col 4)
p_ = p((FLw, lE4) => {
    lE4.exports = {
        options: {
            usePureJavaScript: !1
        }
    }
})