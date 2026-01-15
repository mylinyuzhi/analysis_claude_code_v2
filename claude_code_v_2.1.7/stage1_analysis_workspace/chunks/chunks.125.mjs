
// @from(Ln 368472, Col 4)
xp2 = U((JJY, Sp2) => {
  var Fs5 = OG(),
    zN0 = NA("path"),
    Hs5 = $V1().copy,
    Pp2 = $fA().remove,
    Es5 = zx().mkdirp,
    zs5 = Ut().pathExists,
    jp2 = B3A();

  function $s5(A, Q, B, G) {
    if (typeof B === "function") G = B, B = {};
    B = B || {};
    let Z = B.overwrite || B.clobber || !1;
    jp2.checkPaths(A, Q, "move", B, (Y, J) => {
      if (Y) return G(Y);
      let {
        srcStat: X,
        isChangingCase: I = !1
      } = J;
      jp2.checkParentPaths(A, X, Q, "move", (D) => {
        if (D) return G(D);
        if (Cs5(Q)) return Tp2(A, Q, Z, I, G);
        Es5(zN0.dirname(Q), (W) => {
          if (W) return G(W);
          return Tp2(A, Q, Z, I, G)
        })
      })
    })
  }

  function Cs5(A) {
    let Q = zN0.dirname(A);
    return zN0.parse(Q).root === Q
  }

  function Tp2(A, Q, B, G, Z) {
    if (G) return EN0(A, Q, B, Z);
    if (B) return Pp2(Q, (Y) => {
      if (Y) return Z(Y);
      return EN0(A, Q, B, Z)
    });
    zs5(Q, (Y, J) => {
      if (Y) return Z(Y);
      if (J) return Z(Error("dest already exists."));
      return EN0(A, Q, B, Z)
    })
  }

  function EN0(A, Q, B, G) {
    Fs5.rename(A, Q, (Z) => {
      if (!Z) return G();
      if (Z.code !== "EXDEV") return G(Z);
      return Us5(A, Q, B, G)
    })
  }

  function Us5(A, Q, B, G) {
    Hs5(A, Q, {
      overwrite: B,
      errorOnExist: !0
    }, (Y) => {
      if (Y) return G(Y);
      return Pp2(A, G)
    })
  }
  Sp2.exports = $s5
})
// @from(Ln 368539, Col 4)
fp2 = U((XJY, bp2) => {
  var vp2 = OG(),
    CN0 = NA("path"),
    qs5 = $V1().copySync,
    kp2 = $fA().removeSync,
    Ns5 = zx().mkdirpSync,
    yp2 = B3A();

  function ws5(A, Q, B) {
    B = B || {};
    let G = B.overwrite || B.clobber || !1,
      {
        srcStat: Z,
        isChangingCase: Y = !1
      } = yp2.checkPathsSync(A, Q, "move", B);
    if (yp2.checkParentPathsSync(A, Z, Q, "move"), !Ls5(Q)) Ns5(CN0.dirname(Q));
    return Os5(A, Q, G, Y)
  }

  function Ls5(A) {
    let Q = CN0.dirname(A);
    return CN0.parse(Q).root === Q
  }

  function Os5(A, Q, B, G) {
    if (G) return $N0(A, Q, B);
    if (B) return kp2(Q), $N0(A, Q, B);
    if (vp2.existsSync(Q)) throw Error("dest already exists.");
    return $N0(A, Q, B)
  }

  function $N0(A, Q, B) {
    try {
      vp2.renameSync(A, Q)
    } catch (G) {
      if (G.code !== "EXDEV") throw G;
      return Ms5(A, Q, B)
    }
  }

  function Ms5(A, Q, B) {
    return qs5(A, Q, {
      overwrite: B,
      errorOnExist: !0
    }), kp2(A)
  }
  bp2.exports = ws5
})
// @from(Ln 368587, Col 4)
gp2 = U((IJY, hp2) => {
  var Rs5 = AJ().fromCallback;
  hp2.exports = {
    move: Rs5(xp2()),
    moveSync: fp2()
  }
})
// @from(Ln 368594, Col 4)
mp2 = U((DJY, up2) => {
  up2.exports = {
    ...Q3A(),
    ...$V1(),
    ...bc2(),
    ...Vp2(),
    ..._p2(),
    ...zx(),
    ...gp2(),
    ...LV1(),
    ...Ut(),
    ...$fA()
  }
})
// @from(Ln 368608, Col 4)
G3A = U((UN0) => {
  var dp2 = AJ().fromCallback,
    Jw = OG(),
    _s5 = ["access", "appendFile", "chmod", "chown", "close", "copyFile", "fchmod", "fchown", "fdatasync", "fstat", "fsync", "ftruncate", "futimes", "lchmod", "lchown", "link", "lstat", "mkdir", "mkdtemp", "open", "opendir", "readdir", "readFile", "readlink", "realpath", "rename", "rm", "rmdir", "stat", "symlink", "truncate", "unlink", "utimes", "writeFile"].filter((A) => {
      return typeof Jw[A] === "function"
    });
  Object.assign(UN0, Jw);
  _s5.forEach((A) => {
    UN0[A] = dp2(Jw[A])
  });
  UN0.exists = function (A, Q) {
    if (typeof Q === "function") return Jw.exists(A, Q);
    return new Promise((B) => {
      return Jw.exists(A, B)
    })
  };
  UN0.read = function (A, Q, B, G, Z, Y) {
    if (typeof Y === "function") return Jw.read(A, Q, B, G, Z, Y);
    return new Promise((J, X) => {
      Jw.read(A, Q, B, G, Z, (I, D, W) => {
        if (I) return X(I);
        J({
          bytesRead: D,
          buffer: W
        })
      })
    })
  };
  UN0.write = function (A, Q, ...B) {
    if (typeof B[B.length - 1] === "function") return Jw.write(A, Q, ...B);
    return new Promise((G, Z) => {
      Jw.write(A, Q, ...B, (Y, J, X) => {
        if (Y) return Z(Y);
        G({
          bytesWritten: J,
          buffer: X
        })
      })
    })
  };
  if (typeof Jw.writev === "function") UN0.writev = function (A, Q, ...B) {
    if (typeof B[B.length - 1] === "function") return Jw.writev(A, Q, ...B);
    return new Promise((G, Z) => {
      Jw.writev(A, Q, ...B, (Y, J, X) => {
        if (Y) return Z(Y);
        G({
          bytesWritten: J,
          buffers: X
        })
      })
    })
  };
  if (typeof Jw.realpath.native === "function") UN0.realpath.native = dp2(Jw.realpath.native);
  else process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003")
})
// @from(Ln 368663, Col 4)
pp2 = U((xs5, cp2) => {
  var Ss5 = NA("path");
  xs5.checkPath = function (Q) {
    if (process.platform === "win32") {
      if (/[<>:"|?*]/.test(Q.replace(Ss5.parse(Q).root, ""))) {
        let G = Error(`Path contains invalid characters: ${Q}`);
        throw G.code = "EINVAL", G
      }
    }
  }
})
// @from(Ln 368674, Col 4)
ap2 = U((vs5, qN0) => {
  var lp2 = G3A(),
    {
      checkPath: ip2
    } = pp2(),
    np2 = (A) => {
      let Q = {
        mode: 511
      };
      if (typeof A === "number") return A;
      return {
        ...Q,
        ...A
      }.mode
    };
  vs5.makeDir = async (A, Q) => {
    return ip2(A), lp2.mkdir(A, {
      mode: np2(Q),
      recursive: !0
    })
  };
  vs5.makeDirSync = (A, Q) => {
    return ip2(A), lp2.mkdirSync(A, {
      mode: np2(Q),
      recursive: !0
    })
  }
})
// @from(Ln 368702, Col 4)
Cx = U((FJY, op2) => {
  var fs5 = AJ().fromPromise,
    {
      makeDir: hs5,
      makeDirSync: NN0
    } = ap2(),
    wN0 = fs5(hs5);
  op2.exports = {
    mkdirs: wN0,
    mkdirsSync: NN0,
    mkdirp: wN0,
    mkdirpSync: NN0,
    ensureDir: wN0,
    ensureDirSync: NN0
  }
})
// @from(Ln 368718, Col 4)
Lt = U((HJY, sp2) => {
  var gs5 = AJ().fromPromise,
    rp2 = G3A();

  function us5(A) {
    return rp2.access(A).then(() => !0).catch(() => !1)
  }
  sp2.exports = {
    pathExists: gs5(us5),
    pathExistsSync: rp2.existsSync
  }
})
// @from(Ln 368730, Col 4)
LN0 = U((EJY, tp2) => {
  var CEA = OG();

  function ms5(A, Q, B, G) {
    CEA.open(A, "r+", (Z, Y) => {
      if (Z) return G(Z);
      CEA.futimes(Y, Q, B, (J) => {
        CEA.close(Y, (X) => {
          if (G) G(J || X)
        })
      })
    })
  }

  function ds5(A, Q, B) {
    let G = CEA.openSync(A, "r+");
    return CEA.futimesSync(G, Q, B), CEA.closeSync(G)
  }
  tp2.exports = {
    utimesMillis: ms5,
    utimesMillisSync: ds5
  }
})
// @from(Ln 368753, Col 4)
Z3A = U((zJY, Ql2) => {
  var UEA = G3A(),
    uF = NA("path"),
    cs5 = NA("util");

  function ps5(A, Q, B) {
    let G = B.dereference ? (Z) => UEA.stat(Z, {
      bigint: !0
    }) : (Z) => UEA.lstat(Z, {
      bigint: !0
    });
    return Promise.all([G(A), G(Q).catch((Z) => {
      if (Z.code === "ENOENT") return null;
      throw Z
    })]).then(([Z, Y]) => ({
      srcStat: Z,
      destStat: Y
    }))
  }

  function ls5(A, Q, B) {
    let G, Z = B.dereference ? (J) => UEA.statSync(J, {
        bigint: !0
      }) : (J) => UEA.lstatSync(J, {
        bigint: !0
      }),
      Y = Z(A);
    try {
      G = Z(Q)
    } catch (J) {
      if (J.code === "ENOENT") return {
        srcStat: Y,
        destStat: null
      };
      throw J
    }
    return {
      srcStat: Y,
      destStat: G
    }
  }

  function is5(A, Q, B, G, Z) {
    cs5.callbackify(ps5)(A, Q, G, (Y, J) => {
      if (Y) return Z(Y);
      let {
        srcStat: X,
        destStat: I
      } = J;
      if (I) {
        if (qfA(X, I)) {
          let D = uF.basename(A),
            W = uF.basename(Q);
          if (B === "move" && D !== W && D.toLowerCase() === W.toLowerCase()) return Z(null, {
            srcStat: X,
            destStat: I,
            isChangingCase: !0
          });
          return Z(Error("Source and destination must not be the same."))
        }
        if (X.isDirectory() && !I.isDirectory()) return Z(Error(`Cannot overwrite non-directory '${Q}' with directory '${A}'.`));
        if (!X.isDirectory() && I.isDirectory()) return Z(Error(`Cannot overwrite directory '${Q}' with non-directory '${A}'.`))
      }
      if (X.isDirectory() && ON0(A, Q)) return Z(Error(OV1(A, Q, B)));
      return Z(null, {
        srcStat: X,
        destStat: I
      })
    })
  }

  function ns5(A, Q, B, G) {
    let {
      srcStat: Z,
      destStat: Y
    } = ls5(A, Q, G);
    if (Y) {
      if (qfA(Z, Y)) {
        let J = uF.basename(A),
          X = uF.basename(Q);
        if (B === "move" && J !== X && J.toLowerCase() === X.toLowerCase()) return {
          srcStat: Z,
          destStat: Y,
          isChangingCase: !0
        };
        throw Error("Source and destination must not be the same.")
      }
      if (Z.isDirectory() && !Y.isDirectory()) throw Error(`Cannot overwrite non-directory '${Q}' with directory '${A}'.`);
      if (!Z.isDirectory() && Y.isDirectory()) throw Error(`Cannot overwrite directory '${Q}' with non-directory '${A}'.`)
    }
    if (Z.isDirectory() && ON0(A, Q)) throw Error(OV1(A, Q, B));
    return {
      srcStat: Z,
      destStat: Y
    }
  }

  function ep2(A, Q, B, G, Z) {
    let Y = uF.resolve(uF.dirname(A)),
      J = uF.resolve(uF.dirname(B));
    if (J === Y || J === uF.parse(J).root) return Z();
    UEA.stat(J, {
      bigint: !0
    }, (X, I) => {
      if (X) {
        if (X.code === "ENOENT") return Z();
        return Z(X)
      }
      if (qfA(Q, I)) return Z(Error(OV1(A, B, G)));
      return ep2(A, Q, J, G, Z)
    })
  }

  function Al2(A, Q, B, G) {
    let Z = uF.resolve(uF.dirname(A)),
      Y = uF.resolve(uF.dirname(B));
    if (Y === Z || Y === uF.parse(Y).root) return;
    let J;
    try {
      J = UEA.statSync(Y, {
        bigint: !0
      })
    } catch (X) {
      if (X.code === "ENOENT") return;
      throw X
    }
    if (qfA(Q, J)) throw Error(OV1(A, B, G));
    return Al2(A, Q, Y, G)
  }

  function qfA(A, Q) {
    return Q.ino && Q.dev && Q.ino === A.ino && Q.dev === A.dev
  }

  function ON0(A, Q) {
    let B = uF.resolve(A).split(uF.sep).filter((Z) => Z),
      G = uF.resolve(Q).split(uF.sep).filter((Z) => Z);
    return B.reduce((Z, Y, J) => Z && G[J] === Y, !0)
  }

  function OV1(A, Q, B) {
    return `Cannot ${B} '${A}' to a subdirectory of itself, '${Q}'.`
  }
  Ql2.exports = {
    checkPaths: is5,
    checkPathsSync: ns5,
    checkParentPaths: ep2,
    checkParentPathsSync: Al2,
    isSrcSubdir: ON0,
    areIdentical: qfA
  }
})
// @from(Ln 368905, Col 4)
Dl2 = U(($JY, Il2) => {
  var Xw = OG(),
    NfA = NA("path"),
    as5 = Cx().mkdirs,
    os5 = Lt().pathExists,
    rs5 = LN0().utimesMillis,
    wfA = Z3A();

  function ss5(A, Q, B, G) {
    if (typeof B === "function" && !G) G = B, B = {};
    else if (typeof B === "function") B = {
      filter: B
    };
    if (G = G || function () {}, B = B || {}, B.clobber = "clobber" in B ? !!B.clobber : !0, B.overwrite = "overwrite" in B ? !!B.overwrite : B.clobber, B.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0001");
    wfA.checkPaths(A, Q, "copy", B, (Z, Y) => {
      if (Z) return G(Z);
      let {
        srcStat: J,
        destStat: X
      } = Y;
      wfA.checkParentPaths(A, J, Q, "copy", (I) => {
        if (I) return G(I);
        if (B.filter) return Zl2(Bl2, X, A, Q, B, G);
        return Bl2(X, A, Q, B, G)
      })
    })
  }

  function Bl2(A, Q, B, G, Z) {
    let Y = NfA.dirname(B);
    os5(Y, (J, X) => {
      if (J) return Z(J);
      if (X) return MV1(A, Q, B, G, Z);
      as5(Y, (I) => {
        if (I) return Z(I);
        return MV1(A, Q, B, G, Z)
      })
    })
  }

  function Zl2(A, Q, B, G, Z, Y) {
    Promise.resolve(Z.filter(B, G)).then((J) => {
      if (J) return A(Q, B, G, Z, Y);
      return Y()
    }, (J) => Y(J))
  }

  function ts5(A, Q, B, G, Z) {
    if (G.filter) return Zl2(MV1, A, Q, B, G, Z);
    return MV1(A, Q, B, G, Z)
  }

  function MV1(A, Q, B, G, Z) {
    (G.dereference ? Xw.stat : Xw.lstat)(Q, (J, X) => {
      if (J) return Z(J);
      if (X.isDirectory()) return Yt5(X, A, Q, B, G, Z);
      else if (X.isFile() || X.isCharacterDevice() || X.isBlockDevice()) return es5(X, A, Q, B, G, Z);
      else if (X.isSymbolicLink()) return It5(A, Q, B, G, Z);
      else if (X.isSocket()) return Z(Error(`Cannot copy a socket file: ${Q}`));
      else if (X.isFIFO()) return Z(Error(`Cannot copy a FIFO pipe: ${Q}`));
      return Z(Error(`Unknown file: ${Q}`))
    })
  }

  function es5(A, Q, B, G, Z, Y) {
    if (!Q) return Yl2(A, B, G, Z, Y);
    return At5(A, B, G, Z, Y)
  }

  function At5(A, Q, B, G, Z) {
    if (G.overwrite) Xw.unlink(B, (Y) => {
      if (Y) return Z(Y);
      return Yl2(A, Q, B, G, Z)
    });
    else if (G.errorOnExist) return Z(Error(`'${B}' already exists`));
    else return Z()
  }

  function Yl2(A, Q, B, G, Z) {
    Xw.copyFile(Q, B, (Y) => {
      if (Y) return Z(Y);
      if (G.preserveTimestamps) return Qt5(A.mode, Q, B, Z);
      return RV1(B, A.mode, Z)
    })
  }

  function Qt5(A, Q, B, G) {
    if (Bt5(A)) return Gt5(B, A, (Z) => {
      if (Z) return G(Z);
      return Gl2(A, Q, B, G)
    });
    return Gl2(A, Q, B, G)
  }

  function Bt5(A) {
    return (A & 128) === 0
  }

  function Gt5(A, Q, B) {
    return RV1(A, Q | 128, B)
  }

  function Gl2(A, Q, B, G) {
    Zt5(Q, B, (Z) => {
      if (Z) return G(Z);
      return RV1(B, A, G)
    })
  }

  function RV1(A, Q, B) {
    return Xw.chmod(A, Q, B)
  }

  function Zt5(A, Q, B) {
    Xw.stat(A, (G, Z) => {
      if (G) return B(G);
      return rs5(Q, Z.atime, Z.mtime, B)
    })
  }

  function Yt5(A, Q, B, G, Z, Y) {
    if (!Q) return Jt5(A.mode, B, G, Z, Y);
    return Jl2(B, G, Z, Y)
  }

  function Jt5(A, Q, B, G, Z) {
    Xw.mkdir(B, (Y) => {
      if (Y) return Z(Y);
      Jl2(Q, B, G, (J) => {
        if (J) return Z(J);
        return RV1(B, A, Z)
      })
    })
  }

  function Jl2(A, Q, B, G) {
    Xw.readdir(A, (Z, Y) => {
      if (Z) return G(Z);
      return Xl2(Y, A, Q, B, G)
    })
  }

  function Xl2(A, Q, B, G, Z) {
    let Y = A.pop();
    if (!Y) return Z();
    return Xt5(A, Y, Q, B, G, Z)
  }

  function Xt5(A, Q, B, G, Z, Y) {
    let J = NfA.join(B, Q),
      X = NfA.join(G, Q);
    wfA.checkPaths(J, X, "copy", Z, (I, D) => {
      if (I) return Y(I);
      let {
        destStat: W
      } = D;
      ts5(W, J, X, Z, (K) => {
        if (K) return Y(K);
        return Xl2(A, B, G, Z, Y)
      })
    })
  }

  function It5(A, Q, B, G, Z) {
    Xw.readlink(Q, (Y, J) => {
      if (Y) return Z(Y);
      if (G.dereference) J = NfA.resolve(process.cwd(), J);
      if (!A) return Xw.symlink(J, B, Z);
      else Xw.readlink(B, (X, I) => {
        if (X) {
          if (X.code === "EINVAL" || X.code === "UNKNOWN") return Xw.symlink(J, B, Z);
          return Z(X)
        }
        if (G.dereference) I = NfA.resolve(process.cwd(), I);
        if (wfA.isSrcSubdir(J, I)) return Z(Error(`Cannot copy '${J}' to a subdirectory of itself, '${I}'.`));
        if (A.isDirectory() && wfA.isSrcSubdir(I, J)) return Z(Error(`Cannot overwrite '${I}' with '${J}'.`));
        return Dt5(J, B, Z)
      })
    })
  }

  function Dt5(A, Q, B) {
    Xw.unlink(Q, (G) => {
      if (G) return B(G);
      return Xw.symlink(A, Q, B)
    })
  }
  Il2.exports = ss5
})
// @from(Ln 369096, Col 4)
Hl2 = U((CJY, Fl2) => {
  var E$ = OG(),
    LfA = NA("path"),
    Wt5 = Cx().mkdirsSync,
    Kt5 = LN0().utimesMillisSync,
    OfA = Z3A();

  function Vt5(A, Q, B) {
    if (typeof B === "function") B = {
      filter: B
    };
    if (B = B || {}, B.clobber = "clobber" in B ? !!B.clobber : !0, B.overwrite = "overwrite" in B ? !!B.overwrite : B.clobber, B.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0002");
    let {
      srcStat: G,
      destStat: Z
    } = OfA.checkPathsSync(A, Q, "copy", B);
    return OfA.checkParentPathsSync(A, G, Q, "copy"), Ft5(Z, A, Q, B)
  }

  function Ft5(A, Q, B, G) {
    if (G.filter && !G.filter(Q, B)) return;
    let Z = LfA.dirname(B);
    if (!E$.existsSync(Z)) Wt5(Z);
    return Wl2(A, Q, B, G)
  }

  function Ht5(A, Q, B, G) {
    if (G.filter && !G.filter(Q, B)) return;
    return Wl2(A, Q, B, G)
  }

  function Wl2(A, Q, B, G) {
    let Y = (G.dereference ? E$.statSync : E$.lstatSync)(Q);
    if (Y.isDirectory()) return Nt5(Y, A, Q, B, G);
    else if (Y.isFile() || Y.isCharacterDevice() || Y.isBlockDevice()) return Et5(Y, A, Q, B, G);
    else if (Y.isSymbolicLink()) return Ot5(A, Q, B, G);
    else if (Y.isSocket()) throw Error(`Cannot copy a socket file: ${Q}`);
    else if (Y.isFIFO()) throw Error(`Cannot copy a FIFO pipe: ${Q}`);
    throw Error(`Unknown file: ${Q}`)
  }

  function Et5(A, Q, B, G, Z) {
    if (!Q) return Kl2(A, B, G, Z);
    return zt5(A, B, G, Z)
  }

  function zt5(A, Q, B, G) {
    if (G.overwrite) return E$.unlinkSync(B), Kl2(A, Q, B, G);
    else if (G.errorOnExist) throw Error(`'${B}' already exists`)
  }

  function Kl2(A, Q, B, G) {
    if (E$.copyFileSync(Q, B), G.preserveTimestamps) $t5(A.mode, Q, B);
    return MN0(B, A.mode)
  }

  function $t5(A, Q, B) {
    if (Ct5(A)) Ut5(B, A);
    return qt5(Q, B)
  }

  function Ct5(A) {
    return (A & 128) === 0
  }

  function Ut5(A, Q) {
    return MN0(A, Q | 128)
  }

  function MN0(A, Q) {
    return E$.chmodSync(A, Q)
  }

  function qt5(A, Q) {
    let B = E$.statSync(A);
    return Kt5(Q, B.atime, B.mtime)
  }

  function Nt5(A, Q, B, G, Z) {
    if (!Q) return wt5(A.mode, B, G, Z);
    return Vl2(B, G, Z)
  }

  function wt5(A, Q, B, G) {
    return E$.mkdirSync(B), Vl2(Q, B, G), MN0(B, A)
  }

  function Vl2(A, Q, B) {
    E$.readdirSync(A).forEach((G) => Lt5(G, A, Q, B))
  }

  function Lt5(A, Q, B, G) {
    let Z = LfA.join(Q, A),
      Y = LfA.join(B, A),
      {
        destStat: J
      } = OfA.checkPathsSync(Z, Y, "copy", G);
    return Ht5(J, Z, Y, G)
  }

  function Ot5(A, Q, B, G) {
    let Z = E$.readlinkSync(Q);
    if (G.dereference) Z = LfA.resolve(process.cwd(), Z);
    if (!A) return E$.symlinkSync(Z, B);
    else {
      let Y;
      try {
        Y = E$.readlinkSync(B)
      } catch (J) {
        if (J.code === "EINVAL" || J.code === "UNKNOWN") return E$.symlinkSync(Z, B);
        throw J
      }
      if (G.dereference) Y = LfA.resolve(process.cwd(), Y);
      if (OfA.isSrcSubdir(Z, Y)) throw Error(`Cannot copy '${Z}' to a subdirectory of itself, '${Y}'.`);
      if (E$.statSync(B).isDirectory() && OfA.isSrcSubdir(Y, Z)) throw Error(`Cannot overwrite '${Y}' with '${Z}'.`);
      return Mt5(Z, B)
    }
  }

  function Mt5(A, Q) {
    return E$.unlinkSync(Q), E$.symlinkSync(A, Q)
  }
  Fl2.exports = Vt5
})
// @from(Ln 369222, Col 4)
_V1 = U((UJY, El2) => {
  var Rt5 = AJ().fromCallback;
  El2.exports = {
    copy: Rt5(Dl2()),
    copySync: Hl2()
  }
})
// @from(Ln 369229, Col 4)
Ol2 = U((qJY, Ll2) => {
  var zl2 = OG(),
    ql2 = NA("path"),
    UY = NA("assert"),
    MfA = process.platform === "win32";

  function Nl2(A) {
    ["unlink", "chmod", "stat", "lstat", "rmdir", "readdir"].forEach((B) => {
      A[B] = A[B] || zl2[B], B = B + "Sync", A[B] = A[B] || zl2[B]
    }), A.maxBusyTries = A.maxBusyTries || 3
  }

  function RN0(A, Q, B) {
    let G = 0;
    if (typeof Q === "function") B = Q, Q = {};
    UY(A, "rimraf: missing path"), UY.strictEqual(typeof A, "string", "rimraf: path should be a string"), UY.strictEqual(typeof B, "function", "rimraf: callback function required"), UY(Q, "rimraf: invalid options argument provided"), UY.strictEqual(typeof Q, "object", "rimraf: options should be object"), Nl2(Q), $l2(A, Q, function Z(Y) {
      if (Y) {
        if ((Y.code === "EBUSY" || Y.code === "ENOTEMPTY" || Y.code === "EPERM") && G < Q.maxBusyTries) {
          G++;
          let J = G * 100;
          return setTimeout(() => $l2(A, Q, Z), J)
        }
        if (Y.code === "ENOENT") Y = null
      }
      B(Y)
    })
  }

  function $l2(A, Q, B) {
    UY(A), UY(Q), UY(typeof B === "function"), Q.lstat(A, (G, Z) => {
      if (G && G.code === "ENOENT") return B(null);
      if (G && G.code === "EPERM" && MfA) return Cl2(A, Q, G, B);
      if (Z && Z.isDirectory()) return jV1(A, Q, G, B);
      Q.unlink(A, (Y) => {
        if (Y) {
          if (Y.code === "ENOENT") return B(null);
          if (Y.code === "EPERM") return MfA ? Cl2(A, Q, Y, B) : jV1(A, Q, Y, B);
          if (Y.code === "EISDIR") return jV1(A, Q, Y, B)
        }
        return B(Y)
      })
    })
  }

  function Cl2(A, Q, B, G) {
    UY(A), UY(Q), UY(typeof G === "function"), Q.chmod(A, 438, (Z) => {
      if (Z) G(Z.code === "ENOENT" ? null : B);
      else Q.stat(A, (Y, J) => {
        if (Y) G(Y.code === "ENOENT" ? null : B);
        else if (J.isDirectory()) jV1(A, Q, B, G);
        else Q.unlink(A, G)
      })
    })
  }

  function Ul2(A, Q, B) {
    let G;
    UY(A), UY(Q);
    try {
      Q.chmodSync(A, 438)
    } catch (Z) {
      if (Z.code === "ENOENT") return;
      else throw B
    }
    try {
      G = Q.statSync(A)
    } catch (Z) {
      if (Z.code === "ENOENT") return;
      else throw B
    }
    if (G.isDirectory()) TV1(A, Q, B);
    else Q.unlinkSync(A)
  }

  function jV1(A, Q, B, G) {
    UY(A), UY(Q), UY(typeof G === "function"), Q.rmdir(A, (Z) => {
      if (Z && (Z.code === "ENOTEMPTY" || Z.code === "EEXIST" || Z.code === "EPERM")) _t5(A, Q, G);
      else if (Z && Z.code === "ENOTDIR") G(B);
      else G(Z)
    })
  }

  function _t5(A, Q, B) {
    UY(A), UY(Q), UY(typeof B === "function"), Q.readdir(A, (G, Z) => {
      if (G) return B(G);
      let Y = Z.length,
        J;
      if (Y === 0) return Q.rmdir(A, B);
      Z.forEach((X) => {
        RN0(ql2.join(A, X), Q, (I) => {
          if (J) return;
          if (I) return B(J = I);
          if (--Y === 0) Q.rmdir(A, B)
        })
      })
    })
  }

  function wl2(A, Q) {
    let B;
    Q = Q || {}, Nl2(Q), UY(A, "rimraf: missing path"), UY.strictEqual(typeof A, "string", "rimraf: path should be a string"), UY(Q, "rimraf: missing options"), UY.strictEqual(typeof Q, "object", "rimraf: options should be object");
    try {
      B = Q.lstatSync(A)
    } catch (G) {
      if (G.code === "ENOENT") return;
      if (G.code === "EPERM" && MfA) Ul2(A, Q, G)
    }
    try {
      if (B && B.isDirectory()) TV1(A, Q, null);
      else Q.unlinkSync(A)
    } catch (G) {
      if (G.code === "ENOENT") return;
      else if (G.code === "EPERM") return MfA ? Ul2(A, Q, G) : TV1(A, Q, G);
      else if (G.code !== "EISDIR") throw G;
      TV1(A, Q, G)
    }
  }

  function TV1(A, Q, B) {
    UY(A), UY(Q);
    try {
      Q.rmdirSync(A)
    } catch (G) {
      if (G.code === "ENOTDIR") throw B;
      else if (G.code === "ENOTEMPTY" || G.code === "EEXIST" || G.code === "EPERM") jt5(A, Q);
      else if (G.code !== "ENOENT") throw G
    }
  }

  function jt5(A, Q) {
    if (UY(A), UY(Q), Q.readdirSync(A).forEach((B) => wl2(ql2.join(A, B), Q)), MfA) {
      let B = Date.now();
      do try {
        return Q.rmdirSync(A, Q)
      } catch {}
      while (Date.now() - B < 500)
    } else return Q.rmdirSync(A, Q)
  }
  Ll2.exports = RN0;
  RN0.sync = wl2
})
// @from(Ln 369370, Col 4)
RfA = U((NJY, Rl2) => {
  var PV1 = OG(),
    Tt5 = AJ().fromCallback,
    Ml2 = Ol2();

  function Pt5(A, Q) {
    if (PV1.rm) return PV1.rm(A, {
      recursive: !0,
      force: !0
    }, Q);
    Ml2(A, Q)
  }

  function St5(A) {
    if (PV1.rmSync) return PV1.rmSync(A, {
      recursive: !0,
      force: !0
    });
    Ml2.sync(A)
  }
  Rl2.exports = {
    remove: Tt5(Pt5),
    removeSync: St5
  }
})
// @from(Ln 369395, Col 4)
vl2 = U((wJY, yl2) => {
  var xt5 = AJ().fromPromise,
    Tl2 = G3A(),
    Pl2 = NA("path"),
    Sl2 = Cx(),
    xl2 = RfA(),
    _l2 = xt5(async function (Q) {
      let B;
      try {
        B = await Tl2.readdir(Q)
      } catch {
        return Sl2.mkdirs(Q)
      }
      return Promise.all(B.map((G) => xl2.remove(Pl2.join(Q, G))))
    });

  function jl2(A) {
    let Q;
    try {
      Q = Tl2.readdirSync(A)
    } catch {
      return Sl2.mkdirsSync(A)
    }
    Q.forEach((B) => {
      B = Pl2.join(A, B), xl2.removeSync(B)
    })
  }
  yl2.exports = {
    emptyDirSync: jl2,
    emptydirSync: jl2,
    emptyDir: _l2,
    emptydir: _l2
  }
})
// @from(Ln 369429, Col 4)
hl2 = U((LJY, fl2) => {
  var yt5 = AJ().fromCallback,
    kl2 = NA("path"),
    Ot = OG(),
    bl2 = Cx();

  function vt5(A, Q) {
    function B() {
      Ot.writeFile(A, "", (G) => {
        if (G) return Q(G);
        Q()
      })
    }
    Ot.stat(A, (G, Z) => {
      if (!G && Z.isFile()) return Q();
      let Y = kl2.dirname(A);
      Ot.stat(Y, (J, X) => {
        if (J) {
          if (J.code === "ENOENT") return bl2.mkdirs(Y, (I) => {
            if (I) return Q(I);
            B()
          });
          return Q(J)
        }
        if (X.isDirectory()) B();
        else Ot.readdir(Y, (I) => {
          if (I) return Q(I)
        })
      })
    })
  }

  function kt5(A) {
    let Q;
    try {
      Q = Ot.statSync(A)
    } catch {}
    if (Q && Q.isFile()) return;
    let B = kl2.dirname(A);
    try {
      if (!Ot.statSync(B).isDirectory()) Ot.readdirSync(B)
    } catch (G) {
      if (G && G.code === "ENOENT") bl2.mkdirsSync(B);
      else throw G
    }
    Ot.writeFileSync(A, "")
  }
  fl2.exports = {
    createFile: yt5(vt5),
    createFileSync: kt5
  }
})
// @from(Ln 369481, Col 4)
cl2 = U((OJY, dl2) => {
  var bt5 = AJ().fromCallback,
    gl2 = NA("path"),
    Mt = OG(),
    ul2 = Cx(),
    ft5 = Lt().pathExists,
    {
      areIdentical: ml2
    } = Z3A();

  function ht5(A, Q, B) {
    function G(Z, Y) {
      Mt.link(Z, Y, (J) => {
        if (J) return B(J);
        B(null)
      })
    }
    Mt.lstat(Q, (Z, Y) => {
      Mt.lstat(A, (J, X) => {
        if (J) return J.message = J.message.replace("lstat", "ensureLink"), B(J);
        if (Y && ml2(X, Y)) return B(null);
        let I = gl2.dirname(Q);
        ft5(I, (D, W) => {
          if (D) return B(D);
          if (W) return G(A, Q);
          ul2.mkdirs(I, (K) => {
            if (K) return B(K);
            G(A, Q)
          })
        })
      })
    })
  }

  function gt5(A, Q) {
    let B;
    try {
      B = Mt.lstatSync(Q)
    } catch {}
    try {
      let Y = Mt.lstatSync(A);
      if (B && ml2(Y, B)) return
    } catch (Y) {
      throw Y.message = Y.message.replace("lstat", "ensureLink"), Y
    }
    let G = gl2.dirname(Q);
    if (Mt.existsSync(G)) return Mt.linkSync(A, Q);
    return ul2.mkdirsSync(G), Mt.linkSync(A, Q)
  }
  dl2.exports = {
    createLink: bt5(ht5),
    createLinkSync: gt5
  }
})
// @from(Ln 369535, Col 4)
ll2 = U((MJY, pl2) => {
  var Rt = NA("path"),
    _fA = OG(),
    ut5 = Lt().pathExists;

  function mt5(A, Q, B) {
    if (Rt.isAbsolute(A)) return _fA.lstat(A, (G) => {
      if (G) return G.message = G.message.replace("lstat", "ensureSymlink"), B(G);
      return B(null, {
        toCwd: A,
        toDst: A
      })
    });
    else {
      let G = Rt.dirname(Q),
        Z = Rt.join(G, A);
      return ut5(Z, (Y, J) => {
        if (Y) return B(Y);
        if (J) return B(null, {
          toCwd: Z,
          toDst: A
        });
        else return _fA.lstat(A, (X) => {
          if (X) return X.message = X.message.replace("lstat", "ensureSymlink"), B(X);
          return B(null, {
            toCwd: A,
            toDst: Rt.relative(G, A)
          })
        })
      })
    }
  }

  function dt5(A, Q) {
    let B;
    if (Rt.isAbsolute(A)) {
      if (B = _fA.existsSync(A), !B) throw Error("absolute srcpath does not exist");
      return {
        toCwd: A,
        toDst: A
      }
    } else {
      let G = Rt.dirname(Q),
        Z = Rt.join(G, A);
      if (B = _fA.existsSync(Z), B) return {
        toCwd: Z,
        toDst: A
      };
      else {
        if (B = _fA.existsSync(A), !B) throw Error("relative srcpath does not exist");
        return {
          toCwd: A,
          toDst: Rt.relative(G, A)
        }
      }
    }
  }
  pl2.exports = {
    symlinkPaths: mt5,
    symlinkPathsSync: dt5
  }
})
// @from(Ln 369597, Col 4)
al2 = U((RJY, nl2) => {
  var il2 = OG();

  function ct5(A, Q, B) {
    if (B = typeof Q === "function" ? Q : B, Q = typeof Q === "function" ? !1 : Q, Q) return B(null, Q);
    il2.lstat(A, (G, Z) => {
      if (G) return B(null, "file");
      Q = Z && Z.isDirectory() ? "dir" : "file", B(null, Q)
    })
  }

  function pt5(A, Q) {
    let B;
    if (Q) return Q;
    try {
      B = il2.lstatSync(A)
    } catch {
      return "file"
    }
    return B && B.isDirectory() ? "dir" : "file"
  }
  nl2.exports = {
    symlinkType: ct5,
    symlinkTypeSync: pt5
  }
})
// @from(Ln 369623, Col 4)
Bi2 = U((_JY, Qi2) => {
  var lt5 = AJ().fromCallback,
    rl2 = NA("path"),
    Ux = G3A(),
    sl2 = Cx(),
    it5 = sl2.mkdirs,
    nt5 = sl2.mkdirsSync,
    tl2 = ll2(),
    at5 = tl2.symlinkPaths,
    ot5 = tl2.symlinkPathsSync,
    el2 = al2(),
    rt5 = el2.symlinkType,
    st5 = el2.symlinkTypeSync,
    tt5 = Lt().pathExists,
    {
      areIdentical: Ai2
    } = Z3A();

  function et5(A, Q, B, G) {
    G = typeof B === "function" ? B : G, B = typeof B === "function" ? !1 : B, Ux.lstat(Q, (Z, Y) => {
      if (!Z && Y.isSymbolicLink()) Promise.all([Ux.stat(A), Ux.stat(Q)]).then(([J, X]) => {
        if (Ai2(J, X)) return G(null);
        ol2(A, Q, B, G)
      });
      else ol2(A, Q, B, G)
    })
  }

  function ol2(A, Q, B, G) {
    at5(A, Q, (Z, Y) => {
      if (Z) return G(Z);
      A = Y.toDst, rt5(Y.toCwd, B, (J, X) => {
        if (J) return G(J);
        let I = rl2.dirname(Q);
        tt5(I, (D, W) => {
          if (D) return G(D);
          if (W) return Ux.symlink(A, Q, X, G);
          it5(I, (K) => {
            if (K) return G(K);
            Ux.symlink(A, Q, X, G)
          })
        })
      })
    })
  }

  function Ae5(A, Q, B) {
    let G;
    try {
      G = Ux.lstatSync(Q)
    } catch {}
    if (G && G.isSymbolicLink()) {
      let X = Ux.statSync(A),
        I = Ux.statSync(Q);
      if (Ai2(X, I)) return
    }
    let Z = ot5(A, Q);
    A = Z.toDst, B = st5(Z.toCwd, B);
    let Y = rl2.dirname(Q);
    if (Ux.existsSync(Y)) return Ux.symlinkSync(A, Q, B);
    return nt5(Y), Ux.symlinkSync(A, Q, B)
  }
  Qi2.exports = {
    createSymlink: lt5(et5),
    createSymlinkSync: Ae5
  }
})
// @from(Ln 369690, Col 4)
Wi2 = U((jJY, Di2) => {
  var {
    createFile: Gi2,
    createFileSync: Zi2
  } = hl2(), {
    createLink: Yi2,
    createLinkSync: Ji2
  } = cl2(), {
    createSymlink: Xi2,
    createSymlinkSync: Ii2
  } = Bi2();
  Di2.exports = {
    createFile: Gi2,
    createFileSync: Zi2,
    ensureFile: Gi2,
    ensureFileSync: Zi2,
    createLink: Yi2,
    createLinkSync: Ji2,
    ensureLink: Yi2,
    ensureLinkSync: Ji2,
    createSymlink: Xi2,
    createSymlinkSync: Ii2,
    ensureSymlink: Xi2,
    ensureSymlinkSync: Ii2
  }
})
// @from(Ln 369716, Col 4)
Vi2 = U((TJY, Ki2) => {
  var SV1 = HN0();
  Ki2.exports = {
    readJson: SV1.readFile,
    readJsonSync: SV1.readFileSync,
    writeJson: SV1.writeFile,
    writeJsonSync: SV1.writeFileSync
  }
})
// @from(Ln 369725, Col 4)
xV1 = U((PJY, Ei2) => {
  var Qe5 = AJ().fromCallback,
    jfA = OG(),
    Fi2 = NA("path"),
    Hi2 = Cx(),
    Be5 = Lt().pathExists;

  function Ge5(A, Q, B, G) {
    if (typeof B === "function") G = B, B = "utf8";
    let Z = Fi2.dirname(A);
    Be5(Z, (Y, J) => {
      if (Y) return G(Y);
      if (J) return jfA.writeFile(A, Q, B, G);
      Hi2.mkdirs(Z, (X) => {
        if (X) return G(X);
        jfA.writeFile(A, Q, B, G)
      })
    })
  }

  function Ze5(A, ...Q) {
    let B = Fi2.dirname(A);
    if (jfA.existsSync(B)) return jfA.writeFileSync(A, ...Q);
    Hi2.mkdirsSync(B), jfA.writeFileSync(A, ...Q)
  }
  Ei2.exports = {
    outputFile: Qe5(Ge5),
    outputFileSync: Ze5
  }
})
// @from(Ln 369755, Col 4)
$i2 = U((SJY, zi2) => {
  var {
    stringify: Ye5
  } = zEA(), {
    outputFile: Je5
  } = xV1();
  async function Xe5(A, Q, B = {}) {
    let G = Ye5(Q, B);
    await Je5(A, G, B)
  }
  zi2.exports = Xe5
})
// @from(Ln 369767, Col 4)
Ui2 = U((xJY, Ci2) => {
  var {
    stringify: Ie5
  } = zEA(), {
    outputFileSync: De5
  } = xV1();

  function We5(A, Q, B) {
    let G = Ie5(Q, B);
    De5(A, G, B)
  }
  Ci2.exports = We5
})
// @from(Ln 369780, Col 4)
Ni2 = U((yJY, qi2) => {
  var Ke5 = AJ().fromPromise,
    EU = Vi2();
  EU.outputJson = Ke5($i2());
  EU.outputJsonSync = Ui2();
  EU.outputJSON = EU.outputJson;
  EU.outputJSONSync = EU.outputJsonSync;
  EU.writeJSON = EU.writeJson;
  EU.writeJSONSync = EU.writeJsonSync;
  EU.readJSON = EU.readJson;
  EU.readJSONSync = EU.readJsonSync;
  qi2.exports = EU
})
// @from(Ln 369793, Col 4)
Ri2 = U((vJY, Mi2) => {
  var Ve5 = OG(),
    jN0 = NA("path"),
    Fe5 = _V1().copy,
    Oi2 = RfA().remove,
    He5 = Cx().mkdirp,
    Ee5 = Lt().pathExists,
    wi2 = Z3A();

  function ze5(A, Q, B, G) {
    if (typeof B === "function") G = B, B = {};
    B = B || {};
    let Z = B.overwrite || B.clobber || !1;
    wi2.checkPaths(A, Q, "move", B, (Y, J) => {
      if (Y) return G(Y);
      let {
        srcStat: X,
        isChangingCase: I = !1
      } = J;
      wi2.checkParentPaths(A, X, Q, "move", (D) => {
        if (D) return G(D);
        if ($e5(Q)) return Li2(A, Q, Z, I, G);
        He5(jN0.dirname(Q), (W) => {
          if (W) return G(W);
          return Li2(A, Q, Z, I, G)
        })
      })
    })
  }

  function $e5(A) {
    let Q = jN0.dirname(A);
    return jN0.parse(Q).root === Q
  }

  function Li2(A, Q, B, G, Z) {
    if (G) return _N0(A, Q, B, Z);
    if (B) return Oi2(Q, (Y) => {
      if (Y) return Z(Y);
      return _N0(A, Q, B, Z)
    });
    Ee5(Q, (Y, J) => {
      if (Y) return Z(Y);
      if (J) return Z(Error("dest already exists."));
      return _N0(A, Q, B, Z)
    })
  }

  function _N0(A, Q, B, G) {
    Ve5.rename(A, Q, (Z) => {
      if (!Z) return G();
      if (Z.code !== "EXDEV") return G(Z);
      return Ce5(A, Q, B, G)
    })
  }

  function Ce5(A, Q, B, G) {
    Fe5(A, Q, {
      overwrite: B,
      errorOnExist: !0
    }, (Y) => {
      if (Y) return G(Y);
      return Oi2(A, G)
    })
  }
  Mi2.exports = ze5
})
// @from(Ln 369860, Col 4)
Si2 = U((kJY, Pi2) => {
  var ji2 = OG(),
    PN0 = NA("path"),
    Ue5 = _V1().copySync,
    Ti2 = RfA().removeSync,
    qe5 = Cx().mkdirpSync,
    _i2 = Z3A();

  function Ne5(A, Q, B) {
    B = B || {};
    let G = B.overwrite || B.clobber || !1,
      {
        srcStat: Z,
        isChangingCase: Y = !1
      } = _i2.checkPathsSync(A, Q, "move", B);
    if (_i2.checkParentPathsSync(A, Z, Q, "move"), !we5(Q)) qe5(PN0.dirname(Q));
    return Le5(A, Q, G, Y)
  }

  function we5(A) {
    let Q = PN0.dirname(A);
    return PN0.parse(Q).root === Q
  }

  function Le5(A, Q, B, G) {
    if (G) return TN0(A, Q, B);
    if (B) return Ti2(Q), TN0(A, Q, B);
    if (ji2.existsSync(Q)) throw Error("dest already exists.");
    return TN0(A, Q, B)
  }

  function TN0(A, Q, B) {
    try {
      ji2.renameSync(A, Q)
    } catch (G) {
      if (G.code !== "EXDEV") throw G;
      return Oe5(A, Q, B)
    }
  }

  function Oe5(A, Q, B) {
    return Ue5(A, Q, {
      overwrite: B,
      errorOnExist: !0
    }), Ti2(A)
  }
  Pi2.exports = Ne5
})
// @from(Ln 369908, Col 4)
yi2 = U((bJY, xi2) => {
  var Me5 = AJ().fromCallback;
  xi2.exports = {
    move: Me5(Ri2()),
    moveSync: Si2()
  }
})
// @from(Ln 369915, Col 4)
ki2 = U((fJY, vi2) => {
  vi2.exports = {
    ...G3A(),
    ..._V1(),
    ...vl2(),
    ...Wi2(),
    ...Ni2(),
    ...Cx(),
    ...yi2(),
    ...xV1(),
    ...Lt(),
    ...RfA()
  }
})
// @from(Ln 369929, Col 4)
SN0 = U((fi2) => {
  Object.defineProperty(fi2, "__esModule", {
    value: !0
  });
  fi2.childDepType = fi2.depTypeGreater = fi2.DepType = void 0;
  var s6;
  (function (A) {
    A[A.PROD = 0] = "PROD", A[A.DEV = 1] = "DEV", A[A.OPTIONAL = 2] = "OPTIONAL", A[A.DEV_OPTIONAL = 3] = "DEV_OPTIONAL", A[A.ROOT = 4] = "ROOT"
  })(s6 = fi2.DepType || (fi2.DepType = {}));
  var Re5 = (A, Q) => {
    switch (Q) {
      case s6.DEV:
        switch (A) {
          case s6.OPTIONAL:
          case s6.PROD:
          case s6.ROOT:
            return !0;
          case s6.DEV:
          case s6.DEV_OPTIONAL:
          default:
            return !1
        }
      case s6.DEV_OPTIONAL:
        switch (A) {
          case s6.OPTIONAL:
          case s6.PROD:
          case s6.ROOT:
          case s6.DEV:
            return !0;
          case s6.DEV_OPTIONAL:
          default:
            return !1
        }
      case s6.OPTIONAL:
        switch (A) {
          case s6.PROD:
          case s6.ROOT:
            return !0;
          case s6.OPTIONAL:
          case s6.DEV:
          case s6.DEV_OPTIONAL:
          default:
            return !1
        }
      case s6.PROD:
        switch (A) {
          case s6.ROOT:
            return !0;
          case s6.PROD:
          case s6.OPTIONAL:
          case s6.DEV:
          case s6.DEV_OPTIONAL:
          default:
            return !1
        }
      case s6.ROOT:
        switch (A) {
          case s6.ROOT:
          case s6.PROD:
          case s6.OPTIONAL:
          case s6.DEV:
          case s6.DEV_OPTIONAL:
          default:
            return !1
        }
      default:
        return !1
    }
  };
  fi2.depTypeGreater = Re5;
  var _e5 = (A, Q) => {
    if (Q === s6.ROOT) throw Error("Something went wrong, a child dependency can't be marked as the ROOT");
    switch (A) {
      case s6.ROOT:
        return Q;
      case s6.PROD:
        if (Q === s6.OPTIONAL) return s6.OPTIONAL;
        return s6.PROD;
      case s6.OPTIONAL:
        return s6.OPTIONAL;
      case s6.DEV_OPTIONAL:
        return s6.DEV_OPTIONAL;
      case s6.DEV:
        if (Q === s6.OPTIONAL) return s6.DEV_OPTIONAL;
        return s6.DEV
    }
  };
  fi2.childDepType = _e5
})
// @from(Ln 370018, Col 4)
ui2 = U((gi2) => {
  Object.defineProperty(gi2, "__esModule", {
    value: !0
  });
  gi2.NativeModuleType = void 0;
  var Te5;
  (function (A) {
    A[A.NONE = 0] = "NONE", A[A.NODE_GYP = 1] = "NODE_GYP", A[A.PREBUILD = 2] = "PREBUILD"
  })(Te5 = gi2.NativeModuleType || (gi2.NativeModuleType = {}))
})
// @from(Ln 370028, Col 4)
pi2 = U((di2) => {
  Object.defineProperty(di2, "__esModule", {
    value: !0
  });
  di2.Walker = void 0;
  var Pe5 = Q1A(),
    yV1 = ki2(),
    _t = NA("path"),
    Jj = SN0(),
    yN0 = ui2(),
    fc = Pe5("flora-colossus");
  class mi2 {
    constructor(A) {
      if (this.modules = [], this.walkHistory = new Set, this.cache = null, !A || typeof A !== "string") throw Error("modulePath must be provided as a string");
      fc(`creating walker with rootModule=${A}`), this.rootModule = A
    }
    relativeModule(A, Q) {
      return _t.resolve(A, "node_modules", Q)
    }
    async loadPackageJSON(A) {
      let Q = _t.resolve(A, "package.json");
      if (await yV1.pathExists(Q)) {
        let B = await yV1.readJson(Q);
        if (!B.dependencies) B.dependencies = {};
        if (!B.devDependencies) B.devDependencies = {};
        if (!B.optionalDependencies) B.optionalDependencies = {};
        return B
      }
      return null
    }
    async walkDependenciesForModuleInModule(A, Q, B) {
      let G = Q,
        Z = null,
        Y = null;
      while (!Z && this.relativeModule(G, A) !== Y)
        if (Y = this.relativeModule(G, A), await yV1.pathExists(Y)) Z = Y;
        else {
          if (_t.basename(_t.dirname(G)) !== "node_modules") G = _t.dirname(G);
          G = _t.dirname(_t.dirname(G))
        } if (!Z && B !== Jj.DepType.OPTIONAL && B !== Jj.DepType.DEV_OPTIONAL) throw Error(`Failed to locate module "${A}" from "${Q}"

        This normally means that either you have deleted this package already somehow (check your ignore settings if using electron-packager).  Or your module installation failed.`);
      if (Z) await this.walkDependenciesForModule(Z, B)
    }
    async detectNativeModuleType(A, Q) {
      if (Q.dependencies["prebuild-install"]) return yN0.NativeModuleType.PREBUILD;
      else if (await yV1.pathExists(_t.join(A, "binding.gyp"))) return yN0.NativeModuleType.NODE_GYP;
      return yN0.NativeModuleType.NONE
    }
    async walkDependenciesForModule(A, Q) {
      if (fc("walk reached:", A, " Type is:", Jj.DepType[Q]), this.walkHistory.has(A)) {
        fc("already walked this route");
        let G = this.modules.find((Z) => Z.path === A);
        if ((0, Jj.depTypeGreater)(Q, G.depType)) fc(`existing module has a type of "${G.depType}", new module type would be "${Q}" therefore updating`), G.depType = Q;
        return
      }
      let B = await this.loadPackageJSON(A);
      if (!B) {
        fc("walk hit a dead end, this module is incomplete");
        return
      }
      this.walkHistory.add(A), this.modules.push({
        depType: Q,
        nativeModuleType: await this.detectNativeModuleType(A, B),
        path: A,
        name: B.name
      });
      for (let G in B.dependencies) {
        if (G in B.optionalDependencies) {
          fc(`found ${G} in prod deps of ${A} but it is also marked optional`);
          continue
        }
        await this.walkDependenciesForModuleInModule(G, A, (0, Jj.childDepType)(Q, Jj.DepType.PROD))
      }
      for (let G in B.optionalDependencies) await this.walkDependenciesForModuleInModule(G, A, (0, Jj.childDepType)(Q, Jj.DepType.OPTIONAL));
      if (Q === Jj.DepType.ROOT) {
        fc("we're still at the beginning, walking down the dev route");
        for (let G in B.devDependencies) await this.walkDependenciesForModuleInModule(G, A, (0, Jj.childDepType)(Q, Jj.DepType.DEV))
      }
    }
    async walkTree() {
      if (fc("starting tree walk"), !this.cache) this.cache = new Promise(async (A, Q) => {
        this.modules = [];
        try {
          await this.walkDependenciesForModule(this.rootModule, Jj.DepType.ROOT)
        } catch (B) {
          Q(B);
          return
        }
        A(this.modules)
      });
      else fc("tree walk in progress / completed already, waiting for existing walk to complete");
      return await this.cache
    }
    getRootModule() {
      return this.rootModule
    }
  }
  di2.Walker = mi2
})
// @from(Ln 370128, Col 4)
vN0 = U((jt) => {
  var Se5 = jt && jt.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    li2 = jt && jt.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) Se5(Q, A, B)
    };
  Object.defineProperty(jt, "__esModule", {
    value: !0
  });
  li2(pi2(), jt);
  li2(SN0(), jt)
})
// @from(Ln 370153, Col 4)
oi2 = U((ni2) => {
  Object.defineProperty(ni2, "__esModule", {
    value: !0
  });
  ni2.DestroyerOfModules = void 0;
  var vV1 = mp2(),
    qEA = NA("path"),
    kN0 = vN0();
  class ii2 {
    constructor({
      rootDirectory: A,
      walker: Q,
      shouldKeepModuleTest: B
    }) {
      if (A) this.walker = new kN0.Walker(A);
      else if (Q) this.walker = Q;
      else throw Error("Must either provide rootDirectory or walker argument");
      if (B) this.shouldKeepFn = B
    }
    async destroyModule(A, Q) {
      if (Q.get(A)) {
        let G = qEA.resolve(A, "node_modules");
        if (!await vV1.pathExists(G)) return;
        for (let Z of await vV1.readdir(G))
          if (Z.startsWith("@"))
            for (let Y of await vV1.readdir(qEA.resolve(G, Z))) await this.destroyModule(qEA.resolve(G, Z, Y), Q);
          else await this.destroyModule(qEA.resolve(G, Z), Q)
      } else await vV1.remove(A)
    }
    async collectKeptModules({
      relativePaths: A = !1
    }) {
      let Q = await this.walker.walkTree(),
        B = new Map,
        G = qEA.resolve(this.walker.getRootModule());
      for (let Z of Q)
        if (this.shouldKeepModule(Z)) {
          let Y = Z.path;
          if (A) Y = Y.replace(`${G}${qEA.sep}`, "");
          B.set(Y, Z)
        } return B
    }
    async destroy() {
      await this.destroyModule(this.walker.getRootModule(), await this.collectKeptModules({
        relativePaths: !1
      }))
    }
    shouldKeepModule(A) {
      let Q = A.depType === kN0.DepType.DEV || A.depType === kN0.DepType.DEV_OPTIONAL;
      return this.shouldKeepFn ? this.shouldKeepFn(A, Q) : !Q
    }
  }
  ni2.DestroyerOfModules = ii2
})
// @from(Ln 370207, Col 4)
si2 = U((Tt) => {
  var xe5 = Tt && Tt.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    ri2 = Tt && Tt.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) xe5(Q, A, B)
    };
  Object.defineProperty(Tt, "__esModule", {
    value: !0
  });
  ri2(oi2(), Tt);
  ri2(vN0(), Tt)
})
// @from(Ln 370232, Col 4)
An2 = U((pJY, ei2) => {
  var ye5 = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    ve5 = ["B", "kiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
    ke5 = ["b", "kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit"],
    be5 = ["b", "kibit", "Mibit", "Gibit", "Tibit", "Pibit", "Eibit", "Zibit", "Yibit"],
    ti2 = (A, Q, B) => {
      let G = A;
      if (typeof Q === "string" || Array.isArray(Q)) G = A.toLocaleString(Q, B);
      else if (Q === !0 || B !== void 0) G = A.toLocaleString(void 0, B);
      return G
    };
  ei2.exports = (A, Q) => {
    if (!Number.isFinite(A)) throw TypeError(`Expected a finite number, got ${typeof A}: ${A}`);
    Q = Object.assign({
      bits: !1,
      binary: !1
    }, Q);
    let B = Q.bits ? Q.binary ? be5 : ke5 : Q.binary ? ve5 : ye5;
    if (Q.signed && A === 0) return ` 0 ${B[0]}`;
    let G = A < 0,
      Z = G ? "-" : Q.signed ? "+" : "";
    if (G) A = -A;
    let Y;
    if (Q.minimumFractionDigits !== void 0) Y = {
      minimumFractionDigits: Q.minimumFractionDigits
    };
    if (Q.maximumFractionDigits !== void 0) Y = Object.assign({
      maximumFractionDigits: Q.maximumFractionDigits
    }, Y);
    if (A < 1) {
      let D = ti2(A, Q.locale, Y);
      return Z + D + " " + B[0]
    }
    let J = Math.min(Math.floor(Q.binary ? Math.log(A) / Math.log(1024) : Math.log10(A) / 3), B.length - 1);
    if (A /= Math.pow(Q.binary ? 1024 : 1000, J), !Y) A = A.toPrecision(3);
    let X = ti2(Number(A), Q.locale, Y),
      I = B[J];
    return Z + X + " " + I
  }
})
// @from(Ln 370272, Col 4)
H8 = U((lJY, Qn2) => {
  Qn2.exports = {
    options: {
      usePureJavaScript: !1
    }
  }
})
// @from(Ln 370279, Col 4)
Zn2 = U((iJY, Gn2) => {
  var bN0 = {};
  Gn2.exports = bN0;
  var Bn2 = {};
  bN0.encode = function (A, Q, B) {
    if (typeof Q !== "string") throw TypeError('"alphabet" must be a string.');
    if (B !== void 0 && typeof B !== "number") throw TypeError('"maxline" must be a number.');
    var G = "";
    if (!(A instanceof Uint8Array)) G = fe5(A, Q);
    else {
      var Z = 0,
        Y = Q.length,
        J = Q.charAt(0),
        X = [0];
      for (Z = 0; Z < A.length; ++Z) {
        for (var I = 0, D = A[Z]; I < X.length; ++I) D += X[I] << 8, X[I] = D % Y, D = D / Y | 0;
        while (D > 0) X.push(D % Y), D = D / Y | 0
      }
      for (Z = 0; A[Z] === 0 && Z < A.length - 1; ++Z) G += J;
      for (Z = X.length - 1; Z >= 0; --Z) G += Q[X[Z]]
    }
    if (B) {
      var W = new RegExp(".{1," + B + "}", "g");
      G = G.match(W).join(`\r
`)
    }
    return G
  };
  bN0.decode = function (A, Q) {
    if (typeof A !== "string") throw TypeError('"input" must be a string.');
    if (typeof Q !== "string") throw TypeError('"alphabet" must be a string.');
    var B = Bn2[Q];
    if (!B) {
      B = Bn2[Q] = [];
      for (var G = 0; G < Q.length; ++G) B[Q.charCodeAt(G)] = G
    }
    A = A.replace(/\s/g, "");
    var Z = Q.length,
      Y = Q.charAt(0),
      J = [0];
    for (var G = 0; G < A.length; G++) {
      var X = B[A.charCodeAt(G)];
      if (X === void 0) return;
      for (var I = 0, D = X; I < J.length; ++I) D += J[I] * Z, J[I] = D & 255, D >>= 8;
      while (D > 0) J.push(D & 255), D >>= 8
    }
    for (var W = 0; A[W] === Y && W < A.length - 1; ++W) J.push(0);
    if (typeof Buffer < "u") return Buffer.from(J.reverse());
    return new Uint8Array(J.reverse())
  };

  function fe5(A, Q) {
    var B = 0,
      G = Q.length,
      Z = Q.charAt(0),
      Y = [0];
    for (B = 0; B < A.length(); ++B) {
      for (var J = 0, X = A.at(B); J < Y.length; ++J) X += Y[J] << 8, Y[J] = X % G, X = X / G | 0;
      while (X > 0) Y.push(X % G), X = X / G | 0
    }
    var I = "";
    for (B = 0; A.at(B) === 0 && B < A.length() - 1; ++B) I += Z;
    for (B = Y.length - 1; B >= 0; --B) I += Q[Y[B]];
    return I
  }
})
// @from(Ln 370345, Col 4)
_7 = U((nJY, In2) => {
  var Yn2 = H8(),
    Jn2 = Zn2(),
    l1 = In2.exports = Yn2.util = Yn2.util || {};
  (function () {
    if (typeof process < "u" && process.nextTick) {
      if (l1.nextTick = process.nextTick, typeof setImmediate === "function") l1.setImmediate = setImmediate;
      else l1.setImmediate = l1.nextTick;
      return
    }
    if (typeof setImmediate === "function") {
      l1.setImmediate = function () {
        return setImmediate.apply(void 0, arguments)
      }, l1.nextTick = function (X) {
        return setImmediate(X)
      };
      return
    }
    if (l1.setImmediate = function (X) {
        setTimeout(X, 0)
      }, typeof window < "u" && typeof window.postMessage === "function") {
      let X = function (I) {
        if (I.source === window && I.data === A) {
          I.stopPropagation();
          var D = Q.slice();
          Q.length = 0, D.forEach(function (W) {
            W()
          })
        }
      };
      var J = X,
        A = "forge.setImmediate",
        Q = [];
      l1.setImmediate = function (I) {
        if (Q.push(I), Q.length === 1) window.postMessage(A, "*")
      }, window.addEventListener("message", X, !0)
    }
    if (typeof MutationObserver < "u") {
      var B = Date.now(),
        G = !0,
        Z = document.createElement("div"),
        Q = [];
      new MutationObserver(function () {
        var I = Q.slice();
        Q.length = 0, I.forEach(function (D) {
          D()
        })
      }).observe(Z, {
        attributes: !0
      });
      var Y = l1.setImmediate;
      l1.setImmediate = function (I) {
        if (Date.now() - B > 15) B = Date.now(), Y(I);
        else if (Q.push(I), Q.length === 1) Z.setAttribute("a", G = !G)
      }
    }
    l1.nextTick = l1.setImmediate
  })();
  l1.isNodejs = typeof process < "u" && process.versions && process.versions.node;
  l1.globalScope = function () {
    if (l1.isNodejs) return global;
    return typeof self > "u" ? window : self
  }();
  l1.isArray = Array.isArray || function (A) {
    return Object.prototype.toString.call(A) === "[object Array]"
  };
  l1.isArrayBuffer = function (A) {
    return typeof ArrayBuffer < "u" && A instanceof ArrayBuffer
  };
  l1.isArrayBufferView = function (A) {
    return A && l1.isArrayBuffer(A.buffer) && A.byteLength !== void 0
  };

  function TfA(A) {
    if (!(A === 8 || A === 16 || A === 24 || A === 32)) throw Error("Only 8, 16, 24, or 32 bits supported: " + A)
  }
  l1.ByteBuffer = fN0;

  function fN0(A) {
    if (this.data = "", this.read = 0, typeof A === "string") this.data = A;
    else if (l1.isArrayBuffer(A) || l1.isArrayBufferView(A))
      if (typeof Buffer < "u" && A instanceof Buffer) this.data = A.toString("binary");
      else {
        var Q = new Uint8Array(A);
        try {
          this.data = String.fromCharCode.apply(null, Q)
        } catch (G) {
          for (var B = 0; B < Q.length; ++B) this.putByte(Q[B])
        }
      }
    else if (A instanceof fN0 || typeof A === "object" && typeof A.data === "string" && typeof A.read === "number") this.data = A.data, this.read = A.read;
    this._constructedStringLength = 0
  }
  l1.ByteStringBuffer = fN0;
  var he5 = 4096;
  l1.ByteStringBuffer.prototype._optimizeConstructedString = function (A) {
    if (this._constructedStringLength += A, this._constructedStringLength > he5) this.data.substr(0, 1), this._constructedStringLength = 0
  };
  l1.ByteStringBuffer.prototype.length = function () {
    return this.data.length - this.read
  };
  l1.ByteStringBuffer.prototype.isEmpty = function () {
    return this.length() <= 0
  };
  l1.ByteStringBuffer.prototype.putByte = function (A) {
    return this.putBytes(String.fromCharCode(A))
  };
  l1.ByteStringBuffer.prototype.fillWithByte = function (A, Q) {
    A = String.fromCharCode(A);
    var B = this.data;
    while (Q > 0) {
      if (Q & 1) B += A;
      if (Q >>>= 1, Q > 0) A += A
    }
    return this.data = B, this._optimizeConstructedString(Q), this
  };
  l1.ByteStringBuffer.prototype.putBytes = function (A) {
    return this.data += A, this._optimizeConstructedString(A.length), this
  };
  l1.ByteStringBuffer.prototype.putString = function (A) {
    return this.putBytes(l1.encodeUtf8(A))
  };
  l1.ByteStringBuffer.prototype.putInt16 = function (A) {
    return this.putBytes(String.fromCharCode(A >> 8 & 255) + String.fromCharCode(A & 255))
  };
  l1.ByteStringBuffer.prototype.putInt24 = function (A) {
    return this.putBytes(String.fromCharCode(A >> 16 & 255) + String.fromCharCode(A >> 8 & 255) + String.fromCharCode(A & 255))
  };
  l1.ByteStringBuffer.prototype.putInt32 = function (A) {
    return this.putBytes(String.fromCharCode(A >> 24 & 255) + String.fromCharCode(A >> 16 & 255) + String.fromCharCode(A >> 8 & 255) + String.fromCharCode(A & 255))
  };
  l1.ByteStringBuffer.prototype.putInt16Le = function (A) {
    return this.putBytes(String.fromCharCode(A & 255) + String.fromCharCode(A >> 8 & 255))
  };
  l1.ByteStringBuffer.prototype.putInt24Le = function (A) {
    return this.putBytes(String.fromCharCode(A & 255) + String.fromCharCode(A >> 8 & 255) + String.fromCharCode(A >> 16 & 255))
  };
  l1.ByteStringBuffer.prototype.putInt32Le = function (A) {
    return this.putBytes(String.fromCharCode(A & 255) + String.fromCharCode(A >> 8 & 255) + String.fromCharCode(A >> 16 & 255) + String.fromCharCode(A >> 24 & 255))
  };
  l1.ByteStringBuffer.prototype.putInt = function (A, Q) {
    TfA(Q);
    var B = "";
    do Q -= 8, B += String.fromCharCode(A >> Q & 255); while (Q > 0);
    return this.putBytes(B)
  };
  l1.ByteStringBuffer.prototype.putSignedInt = function (A, Q) {
    if (A < 0) A += 2 << Q - 1;
    return this.putInt(A, Q)
  };
  l1.ByteStringBuffer.prototype.putBuffer = function (A) {
    return this.putBytes(A.getBytes())
  };
  l1.ByteStringBuffer.prototype.getByte = function () {
    return this.data.charCodeAt(this.read++)
  };
  l1.ByteStringBuffer.prototype.getInt16 = function () {
    var A = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1);
    return this.read += 2, A
  };
  l1.ByteStringBuffer.prototype.getInt24 = function () {
    var A = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2);
    return this.read += 3, A
  };
  l1.ByteStringBuffer.prototype.getInt32 = function () {
    var A = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3);
    return this.read += 4, A
  };
  l1.ByteStringBuffer.prototype.getInt16Le = function () {
    var A = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8;
    return this.read += 2, A
  };
  l1.ByteStringBuffer.prototype.getInt24Le = function () {
    var A = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16;
    return this.read += 3, A
  };
  l1.ByteStringBuffer.prototype.getInt32Le = function () {
    var A = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24;
    return this.read += 4, A
  };
  l1.ByteStringBuffer.prototype.getInt = function (A) {
    TfA(A);
    var Q = 0;
    do Q = (Q << 8) + this.data.charCodeAt(this.read++), A -= 8; while (A > 0);
    return Q
  };
  l1.ByteStringBuffer.prototype.getSignedInt = function (A) {
    var Q = this.getInt(A),
      B = 2 << A - 2;
    if (Q >= B) Q -= B << 1;
    return Q
  };
  l1.ByteStringBuffer.prototype.getBytes = function (A) {
    var Q;
    if (A) A = Math.min(this.length(), A), Q = this.data.slice(this.read, this.read + A), this.read += A;
    else if (A === 0) Q = "";
    else Q = this.read === 0 ? this.data : this.data.slice(this.read), this.clear();
    return Q
  };
  l1.ByteStringBuffer.prototype.bytes = function (A) {
    return typeof A > "u" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + A)
  };
  l1.ByteStringBuffer.prototype.at = function (A) {
    return this.data.charCodeAt(this.read + A)
  };
  l1.ByteStringBuffer.prototype.setAt = function (A, Q) {
    return this.data = this.data.substr(0, this.read + A) + String.fromCharCode(Q) + this.data.substr(this.read + A + 1), this
  };
  l1.ByteStringBuffer.prototype.last = function () {
    return this.data.charCodeAt(this.data.length - 1)
  };
  l1.ByteStringBuffer.prototype.copy = function () {
    var A = l1.createBuffer(this.data);
    return A.read = this.read, A
  };
  l1.ByteStringBuffer.prototype.compact = function () {
    if (this.read > 0) this.data = this.data.slice(this.read), this.read = 0;
    return this
  };
  l1.ByteStringBuffer.prototype.clear = function () {
    return this.data = "", this.read = 0, this
  };
  l1.ByteStringBuffer.prototype.truncate = function (A) {
    var Q = Math.max(0, this.length() - A);
    return this.data = this.data.substr(this.read, Q), this.read = 0, this
  };
  l1.ByteStringBuffer.prototype.toHex = function () {
    var A = "";
    for (var Q = this.read; Q < this.data.length; ++Q) {
      var B = this.data.charCodeAt(Q);
      if (B < 16) A += "0";
      A += B.toString(16)
    }
    return A
  };
  l1.ByteStringBuffer.prototype.toString = function () {
    return l1.decodeUtf8(this.bytes())
  };

  function ge5(A, Q) {
    Q = Q || {}, this.read = Q.readOffset || 0, this.growSize = Q.growSize || 1024;
    var B = l1.isArrayBuffer(A),
      G = l1.isArrayBufferView(A);
    if (B || G) {
      if (B) this.data = new DataView(A);
      else this.data = new DataView(A.buffer, A.byteOffset, A.byteLength);
      this.write = "writeOffset" in Q ? Q.writeOffset : this.data.byteLength;
      return
    }
    if (this.data = new DataView(new ArrayBuffer(0)), this.write = 0, A !== null && A !== void 0) this.putBytes(A);
    if ("writeOffset" in Q) this.write = Q.writeOffset
  }
  l1.DataBuffer = ge5;
  l1.DataBuffer.prototype.length = function () {
    return this.write - this.read
  };
  l1.DataBuffer.prototype.isEmpty = function () {
    return this.length() <= 0
  };
  l1.DataBuffer.prototype.accommodate = function (A, Q) {
    if (this.length() >= A) return this;
    Q = Math.max(Q || this.growSize, A);
    var B = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength),
      G = new Uint8Array(this.length() + Q);
    return G.set(B), this.data = new DataView(G.buffer), this
  };
  l1.DataBuffer.prototype.putByte = function (A) {
    return this.accommodate(1), this.data.setUint8(this.write++, A), this
  };
  l1.DataBuffer.prototype.fillWithByte = function (A, Q) {
    this.accommodate(Q);
    for (var B = 0; B < Q; ++B) this.data.setUint8(A);
    return this
  };
  l1.DataBuffer.prototype.putBytes = function (A, Q) {
    if (l1.isArrayBufferView(A)) {
      var B = new Uint8Array(A.buffer, A.byteOffset, A.byteLength),
        G = B.byteLength - B.byteOffset;
      this.accommodate(G);
      var Z = new Uint8Array(this.data.buffer, this.write);
      return Z.set(B), this.write += G, this
    }
    if (l1.isArrayBuffer(A)) {
      var B = new Uint8Array(A);
      this.accommodate(B.byteLength);
      var Z = new Uint8Array(this.data.buffer);
      return Z.set(B, this.write), this.write += B.byteLength, this
    }
    if (A instanceof l1.DataBuffer || typeof A === "object" && typeof A.read === "number" && typeof A.write === "number" && l1.isArrayBufferView(A.data)) {
      var B = new Uint8Array(A.data.byteLength, A.read, A.length());
      this.accommodate(B.byteLength);
      var Z = new Uint8Array(A.data.byteLength, this.write);
      return Z.set(B), this.write += B.byteLength, this
    }
    if (A instanceof l1.ByteStringBuffer) A = A.data, Q = "binary";
    if (Q = Q || "binary", typeof A === "string") {
      var Y;
      if (Q === "hex") return this.accommodate(Math.ceil(A.length / 2)), Y = new Uint8Array(this.data.buffer, this.write), this.write += l1.binary.hex.decode(A, Y, this.write), this;
      if (Q === "base64") return this.accommodate(Math.ceil(A.length / 4) * 3), Y = new Uint8Array(this.data.buffer, this.write), this.write += l1.binary.base64.decode(A, Y, this.write), this;
      if (Q === "utf8") A = l1.encodeUtf8(A), Q = "binary";
      if (Q === "binary" || Q === "raw") return this.accommodate(A.length), Y = new Uint8Array(this.data.buffer, this.write), this.write += l1.binary.raw.decode(Y), this;
      if (Q === "utf16") return this.accommodate(A.length * 2), Y = new Uint16Array(this.data.buffer, this.write), this.write += l1.text.utf16.encode(Y), this;
      throw Error("Invalid encoding: " + Q)
    }
    throw Error("Invalid parameter: " + A)
  };
  l1.DataBuffer.prototype.putBuffer = function (A) {
    return this.putBytes(A), A.clear(), this
  };
  l1.DataBuffer.prototype.putString = function (A) {
    return this.putBytes(A, "utf16")
  };
  l1.DataBuffer.prototype.putInt16 = function (A) {
    return this.accommodate(2), this.data.setInt16(this.write, A), this.write += 2, this
  };
  l1.DataBuffer.prototype.putInt24 = function (A) {
    return this.accommodate(3), this.data.setInt16(this.write, A >> 8 & 65535), this.data.setInt8(this.write, A >> 16 & 255), this.write += 3, this
  };
  l1.DataBuffer.prototype.putInt32 = function (A) {
    return this.accommodate(4), this.data.setInt32(this.write, A), this.write += 4, this
  };
  l1.DataBuffer.prototype.putInt16Le = function (A) {
    return this.accommodate(2), this.data.setInt16(this.write, A, !0), this.write += 2, this
  };
  l1.DataBuffer.prototype.putInt24Le = function (A) {
    return this.accommodate(3), this.data.setInt8(this.write, A >> 16 & 255), this.data.setInt16(this.write, A >> 8 & 65535, !0), this.write += 3, this
  };
  l1.DataBuffer.prototype.putInt32Le = function (A) {
    return this.accommodate(4), this.data.setInt32(this.write, A, !0), this.write += 4, this
  };
  l1.DataBuffer.prototype.putInt = function (A, Q) {
    TfA(Q), this.accommodate(Q / 8);
    do Q -= 8, this.data.setInt8(this.write++, A >> Q & 255); while (Q > 0);
    return this
  };
  l1.DataBuffer.prototype.putSignedInt = function (A, Q) {
    if (TfA(Q), this.accommodate(Q / 8), A < 0) A += 2 << Q - 1;
    return this.putInt(A, Q)
  };
  l1.DataBuffer.prototype.getByte = function () {
    return this.data.getInt8(this.read++)
  };
  l1.DataBuffer.prototype.getInt16 = function () {
    var A = this.data.getInt16(this.read);
    return this.read += 2, A
  };
  l1.DataBuffer.prototype.getInt24 = function () {
    var A = this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2);
    return this.read += 3, A
  };
  l1.DataBuffer.prototype.getInt32 = function () {
    var A = this.data.getInt32(this.read);
    return this.read += 4, A
  };
  l1.DataBuffer.prototype.getInt16Le = function () {
    var A = this.data.getInt16(this.read, !0);
    return this.read += 2, A
  };
  l1.DataBuffer.prototype.getInt24Le = function () {
    var A = this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, !0) << 8;
    return this.read += 3, A
  };
  l1.DataBuffer.prototype.getInt32Le = function () {
    var A = this.data.getInt32(this.read, !0);
    return this.read += 4, A
  };
  l1.DataBuffer.prototype.getInt = function (A) {
    TfA(A);
    var Q = 0;
    do Q = (Q << 8) + this.data.getInt8(this.read++), A -= 8; while (A > 0);
    return Q
  };
  l1.DataBuffer.prototype.getSignedInt = function (A) {
    var Q = this.getInt(A),
      B = 2 << A - 2;
    if (Q >= B) Q -= B << 1;
    return Q
  };
  l1.DataBuffer.prototype.getBytes = function (A) {
    var Q;
    if (A) A = Math.min(this.length(), A), Q = this.data.slice(this.read, this.read + A), this.read += A;
    else if (A === 0) Q = "";
    else Q = this.read === 0 ? this.data : this.data.slice(this.read), this.clear();
    return Q
  };
  l1.DataBuffer.prototype.bytes = function (A) {
    return typeof A > "u" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + A)
  };
  l1.DataBuffer.prototype.at = function (A) {
    return this.data.getUint8(this.read + A)
  };
  l1.DataBuffer.prototype.setAt = function (A, Q) {
    return this.data.setUint8(A, Q), this
  };
  l1.DataBuffer.prototype.last = function () {
    return this.data.getUint8(this.write - 1)
  };
  l1.DataBuffer.prototype.copy = function () {
    return new l1.DataBuffer(this)
  };
  l1.DataBuffer.prototype.compact = function () {
    if (this.read > 0) {
      var A = new Uint8Array(this.data.buffer, this.read),
        Q = new Uint8Array(A.byteLength);
      Q.set(A), this.data = new DataView(Q), this.write -= this.read, this.read = 0
    }
    return this
  };
  l1.DataBuffer.prototype.clear = function () {
    return this.data = new DataView(new ArrayBuffer(0)), this.read = this.write = 0, this
  };
  l1.DataBuffer.prototype.truncate = function (A) {
    return this.write = Math.max(0, this.length() - A), this.read = Math.min(this.read, this.write), this
  };
  l1.DataBuffer.prototype.toHex = function () {
    var A = "";
    for (var Q = this.read; Q < this.data.byteLength; ++Q) {
      var B = this.data.getUint8(Q);
      if (B < 16) A += "0";
      A += B.toString(16)
    }
    return A
  };
  l1.DataBuffer.prototype.toString = function (A) {
    var Q = new Uint8Array(this.data, this.read, this.length());
    if (A = A || "utf8", A === "binary" || A === "raw") return l1.binary.raw.encode(Q);
    if (A === "hex") return l1.binary.hex.encode(Q);
    if (A === "base64") return l1.binary.base64.encode(Q);
    if (A === "utf8") return l1.text.utf8.decode(Q);
    if (A === "utf16") return l1.text.utf16.decode(Q);
    throw Error("Invalid encoding: " + A)
  };
  l1.createBuffer = function (A, Q) {
    if (Q = Q || "raw", A !== void 0 && Q === "utf8") A = l1.encodeUtf8(A);
    return new l1.ByteBuffer(A)
  };
  l1.fillString = function (A, Q) {
    var B = "";
    while (Q > 0) {
      if (Q & 1) B += A;
      if (Q >>>= 1, Q > 0) A += A
    }
    return B
  };
  l1.xorBytes = function (A, Q, B) {
    var G = "",
      Z = "",
      Y = "",
      J = 0,
      X = 0;
    for (; B > 0; --B, ++J) {
      if (Z = A.charCodeAt(J) ^ Q.charCodeAt(J), X >= 10) G += Y, Y = "", X = 0;
      Y += String.fromCharCode(Z), ++X
    }
    return G += Y, G
  };
  l1.hexToBytes = function (A) {
    var Q = "",
      B = 0;
    if (A.length & !0) B = 1, Q += String.fromCharCode(parseInt(A[0], 16));
    for (; B < A.length; B += 2) Q += String.fromCharCode(parseInt(A.substr(B, 2), 16));
    return Q
  };
  l1.bytesToHex = function (A) {
    return l1.createBuffer(A).toHex()
  };
  l1.int32ToBytes = function (A) {
    return String.fromCharCode(A >> 24 & 255) + String.fromCharCode(A >> 16 & 255) + String.fromCharCode(A >> 8 & 255) + String.fromCharCode(A & 255)
  };
  var Pt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    St = [62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
    Xn2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  l1.encode64 = function (A, Q) {
    var B = "",
      G = "",
      Z, Y, J, X = 0;
    while (X < A.length) {
      if (Z = A.charCodeAt(X++), Y = A.charCodeAt(X++), J = A.charCodeAt(X++), B += Pt.charAt(Z >> 2), B += Pt.charAt((Z & 3) << 4 | Y >> 4), isNaN(Y)) B += "==";
      else B += Pt.charAt((Y & 15) << 2 | J >> 6), B += isNaN(J) ? "=" : Pt.charAt(J & 63);
      if (Q && B.length > Q) G += B.substr(0, Q) + `\r
`, B = B.substr(Q)
    }
    return G += B, G
  };
  l1.decode64 = function (A) {
    A = A.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    var Q = "",
      B, G, Z, Y, J = 0;
    while (J < A.length)
      if (B = St[A.charCodeAt(J++) - 43], G = St[A.charCodeAt(J++) - 43], Z = St[A.charCodeAt(J++) - 43], Y = St[A.charCodeAt(J++) - 43], Q += String.fromCharCode(B << 2 | G >> 4), Z !== 64) {
        if (Q += String.fromCharCode((G & 15) << 4 | Z >> 2), Y !== 64) Q += String.fromCharCode((Z & 3) << 6 | Y)
      } return Q
  };
  l1.encodeUtf8 = function (A) {
    return unescape(encodeURIComponent(A))
  };
  l1.decodeUtf8 = function (A) {
    return decodeURIComponent(escape(A))
  };
  l1.binary = {
    raw: {},
    hex: {},
    base64: {},
    base58: {},
    baseN: {
      encode: Jn2.encode,
      decode: Jn2.decode
    }
  };
  l1.binary.raw.encode = function (A) {
    return String.fromCharCode.apply(null, A)
  };
  l1.binary.raw.decode = function (A, Q, B) {
    var G = Q;
    if (!G) G = new Uint8Array(A.length);
    B = B || 0;
    var Z = B;
    for (var Y = 0; Y < A.length; ++Y) G[Z++] = A.charCodeAt(Y);
    return Q ? Z - B : G
  };
  l1.binary.hex.encode = l1.bytesToHex;
  l1.binary.hex.decode = function (A, Q, B) {
    var G = Q;
    if (!G) G = new Uint8Array(Math.ceil(A.length / 2));
    B = B || 0;
    var Z = 0,
      Y = B;
    if (A.length & 1) Z = 1, G[Y++] = parseInt(A[0], 16);
    for (; Z < A.length; Z += 2) G[Y++] = parseInt(A.substr(Z, 2), 16);
    return Q ? Y - B : G
  };
  l1.binary.base64.encode = function (A, Q) {
    var B = "",
      G = "",
      Z, Y, J, X = 0;
    while (X < A.byteLength) {
      if (Z = A[X++], Y = A[X++], J = A[X++], B += Pt.charAt(Z >> 2), B += Pt.charAt((Z & 3) << 4 | Y >> 4), isNaN(Y)) B += "==";
      else B += Pt.charAt((Y & 15) << 2 | J >> 6), B += isNaN(J) ? "=" : Pt.charAt(J & 63);
      if (Q && B.length > Q) G += B.substr(0, Q) + `\r
`, B = B.substr(Q)
    }
    return G += B, G
  };
  l1.binary.base64.decode = function (A, Q, B) {
    var G = Q;
    if (!G) G = new Uint8Array(Math.ceil(A.length / 4) * 3);
    A = A.replace(/[^A-Za-z0-9\+\/\=]/g, ""), B = B || 0;
    var Z, Y, J, X, I = 0,
      D = B;
    while (I < A.length)
      if (Z = St[A.charCodeAt(I++) - 43], Y = St[A.charCodeAt(I++) - 43], J = St[A.charCodeAt(I++) - 43], X = St[A.charCodeAt(I++) - 43], G[D++] = Z << 2 | Y >> 4, J !== 64) {
        if (G[D++] = (Y & 15) << 4 | J >> 2, X !== 64) G[D++] = (J & 3) << 6 | X
      } return Q ? D - B : G.subarray(0, D)
  };
  l1.binary.base58.encode = function (A, Q) {
    return l1.binary.baseN.encode(A, Xn2, Q)
  };
  l1.binary.base58.decode = function (A, Q) {
    return l1.binary.baseN.decode(A, Xn2, Q)
  };
  l1.text = {
    utf8: {},
    utf16: {}
  };
  l1.text.utf8.encode = function (A, Q, B) {
    A = l1.encodeUtf8(A);
    var G = Q;
    if (!G) G = new Uint8Array(A.length);
    B = B || 0;
    var Z = B;
    for (var Y = 0; Y < A.length; ++Y) G[Z++] = A.charCodeAt(Y);
    return Q ? Z - B : G
  };
  l1.text.utf8.decode = function (A) {
    return l1.decodeUtf8(String.fromCharCode.apply(null, A))
  };
  l1.text.utf16.encode = function (A, Q, B) {
    var G = Q;
    if (!G) G = new Uint8Array(A.length * 2);
    var Z = new Uint16Array(G.buffer);
    B = B || 0;
    var Y = B,
      J = B;
    for (var X = 0; X < A.length; ++X) Z[J++] = A.charCodeAt(X), Y += 2;
    return Q ? Y - B : G
  };
  l1.text.utf16.decode = function (A) {
    return String.fromCharCode.apply(null, new Uint16Array(A.buffer))
  };
  l1.deflate = function (A, Q, B) {
    if (Q = l1.decode64(A.deflate(l1.encode64(Q)).rval), B) {
      var G = 2,
        Z = Q.charCodeAt(1);
      if (Z & 32) G = 6;
      Q = Q.substring(G, Q.length - 4)
    }
    return Q
  };
  l1.inflate = function (A, Q, B) {
    var G = A.inflate(l1.encode64(Q)).rval;
    return G === null ? null : l1.decode64(G)
  };
  var hN0 = function (A, Q, B) {
      if (!A) throw Error("WebStorage not available.");
      var G;
      if (B === null) G = A.removeItem(Q);
      else B = l1.encode64(JSON.stringify(B)), G = A.setItem(Q, B);
      if (typeof G < "u" && G.rval !== !0) {
        var Z = Error(G.error.message);
        throw Z.id = G.error.id, Z.name = G.error.name, Z
      }
    },
    gN0 = function (A, Q) {
      if (!A) throw Error("WebStorage not available.");
      var B = A.getItem(Q);
      if (A.init)
        if (B.rval === null) {
          if (B.error) {
            var G = Error(B.error.message);
            throw G.id = B.error.id, G.name = B.error.name, G
          }
          B = null
        } else B = B.rval;
      if (B !== null) B = JSON.parse(l1.decode64(B));
      return B
    },
    ue5 = function (A, Q, B, G) {
      var Z = gN0(A, Q);
      if (Z === null) Z = {};
      Z[B] = G, hN0(A, Q, Z)
    },
    me5 = function (A, Q, B) {
      var G = gN0(A, Q);
      if (G !== null) G = B in G ? G[B] : null;
      return G
    },
    de5 = function (A, Q, B) {
      var G = gN0(A, Q);
      if (G !== null && B in G) {
        delete G[B];
        var Z = !0;
        for (var Y in G) {
          Z = !1;
          break
        }
        if (Z) G = null;
        hN0(A, Q, G)
      }
    },
    ce5 = function (A, Q) {
      hN0(A, Q, null)
    },
    kV1 = function (A, Q, B) {
      var G = null;
      if (typeof B > "u") B = ["web", "flash"];
      var Z, Y = !1,
        J = null;
      for (var X in B) {
        Z = B[X];
        try {
          if (Z === "flash" || Z === "both") {
            if (Q[0] === null) throw Error("Flash local storage not available.");
            G = A.apply(this, Q), Y = Z === "flash"
          }
          if (Z === "web" || Z === "both") Q[0] = localStorage, G = A.apply(this, Q), Y = !0
        } catch (I) {
          J = I
        }
        if (Y) break
      }
      if (!Y) throw J;
      return G
    };
  l1.setItem = function (A, Q, B, G, Z) {
    kV1(ue5, arguments, Z)
  };
  l1.getItem = function (A, Q, B, G) {
    return kV1(me5, arguments, G)
  };
  l1.removeItem = function (A, Q, B, G) {
    kV1(de5, arguments, G)
  };
  l1.clearItems = function (A, Q, B) {
    kV1(ce5, arguments, B)
  };
  l1.isEmpty = function (A) {
    for (var Q in A)
      if (A.hasOwnProperty(Q)) return !1;
    return !0
  };
  l1.format = function (A) {
    var Q = /%./g,
      B, G, Z = 0,
      Y = [],
      J = 0;
    while (B = Q.exec(A)) {
      if (G = A.substring(J, Q.lastIndex - 2), G.length > 0) Y.push(G);
      J = Q.lastIndex;
      var X = B[0][1];
      switch (X) {
        case "s":
        case "o":
          if (Z < arguments.length) Y.push(arguments[Z++ + 1]);
          else Y.push("<?>");
          break;
        case "%":
          Y.push("%");
          break;
        default:
          Y.push("<%" + X + "?>")
      }
    }
    return Y.push(A.substring(J)), Y.join("")
  };
  l1.formatNumber = function (A, Q, B, G) {
    var Z = A,
      Y = isNaN(Q = Math.abs(Q)) ? 2 : Q,
      J = B === void 0 ? "," : B,
      X = G === void 0 ? "." : G,
      I = Z < 0 ? "-" : "",
      D = parseInt(Z = Math.abs(+Z || 0).toFixed(Y), 10) + "",
      W = D.length > 3 ? D.length % 3 : 0;
    return I + (W ? D.substr(0, W) + X : "") + D.substr(W).replace(/(\d{3})(?=\d)/g, "$1" + X) + (Y ? J + Math.abs(Z - D).toFixed(Y).slice(2) : "")
  };
  l1.formatSize = function (A) {
    if (A >= 1073741824) A = l1.formatNumber(A / 1073741824, 2, ".", "") + " GiB";
    else if (A >= 1048576) A = l1.formatNumber(A / 1048576, 2, ".", "") + " MiB";
    else if (A >= 1024) A = l1.formatNumber(A / 1024, 0) + " KiB";
    else A = l1.formatNumber(A, 0) + " bytes";
    return A
  };
  l1.bytesFromIP = function (A) {
    if (A.indexOf(".") !== -1) return l1.bytesFromIPv4(A);
    if (A.indexOf(":") !== -1) return l1.bytesFromIPv6(A);
    return null
  };
  l1.bytesFromIPv4 = function (A) {
    if (A = A.split("."), A.length !== 4) return null;
    var Q = l1.createBuffer();
    for (var B = 0; B < A.length; ++B) {
      var G = parseInt(A[B], 10);
      if (isNaN(G)) return null;
      Q.putByte(G)
    }
    return Q.getBytes()
  };
  l1.bytesFromIPv6 = function (A) {
    var Q = 0;
    A = A.split(":").filter(function (J) {
      if (J.length === 0) ++Q;
      return !0
    });
    var B = (8 - A.length + Q) * 2,
      G = l1.createBuffer();
    for (var Z = 0; Z < 8; ++Z) {
      if (!A[Z] || A[Z].length === 0) {
        G.fillWithByte(0, B), B = 0;
        continue
      }
      var Y = l1.hexToBytes(A[Z]);
      if (Y.length < 2) G.putByte(0);
      G.putBytes(Y)
    }
    return G.getBytes()
  };
  l1.bytesToIP = function (A) {
    if (A.length === 4) return l1.bytesToIPv4(A);
    if (A.length === 16) return l1.bytesToIPv6(A);
    return null
  };
  l1.bytesToIPv4 = function (A) {
    if (A.length !== 4) return null;
    var Q = [];
    for (var B = 0; B < A.length; ++B) Q.push(A.charCodeAt(B));
    return Q.join(".")
  };
  l1.bytesToIPv6 = function (A) {
    if (A.length !== 16) return null;
    var Q = [],
      B = [],
      G = 0;
    for (var Z = 0; Z < A.length; Z += 2) {
      var Y = l1.bytesToHex(A[Z] + A[Z + 1]);
      while (Y[0] === "0" && Y !== "0") Y = Y.substr(1);
      if (Y === "0") {
        var J = B[B.length - 1],
          X = Q.length;
        if (!J || X !== J.end + 1) B.push({
          start: X,
          end: X
        });
        else if (J.end = X, J.end - J.start > B[G].end - B[G].start) G = B.length - 1
      }
      Q.push(Y)
    }
    if (B.length > 0) {
      var I = B[G];
      if (I.end - I.start > 0) {
        if (Q.splice(I.start, I.end - I.start + 1, ""), I.start === 0) Q.unshift("");
        if (I.end === 7) Q.push("")
      }
    }
    return Q.join(":")
  };
  l1.estimateCores = function (A, Q) {
    if (typeof A === "function") Q = A, A = {};
    if (A = A || {}, "cores" in l1 && !A.update) return Q(null, l1.cores);
    if (typeof navigator < "u" && "hardwareConcurrency" in navigator && navigator.hardwareConcurrency > 0) return l1.cores = navigator.hardwareConcurrency, Q(null, l1.cores);
    if (typeof Worker > "u") return l1.cores = 1, Q(null, l1.cores);
    if (typeof Blob > "u") return l1.cores = 2, Q(null, l1.cores);
    var B = URL.createObjectURL(new Blob(["(", function () {
      self.addEventListener("message", function (J) {
        var X = Date.now(),
          I = X + 4;
        while (Date.now() < I);
        self.postMessage({
          st: X,
          et: I
        })
      })
    }.toString(), ")()"], {
      type: "application/javascript"
    }));
    G([], 5, 16);

    function G(J, X, I) {
      if (X === 0) {
        var D = Math.floor(J.reduce(function (W, K) {
          return W + K
        }, 0) / J.length);
        return l1.cores = Math.max(1, D), URL.revokeObjectURL(B), Q(null, l1.cores)
      }
      Z(I, function (W, K) {
        J.push(Y(I, K)), G(J, X - 1, I)
      })
    }

    function Z(J, X) {
      var I = [],
        D = [];
      for (var W = 0; W < J; ++W) {
        var K = new Worker(B);
        K.addEventListener("message", function (V) {
          if (D.push(V.data), D.length === J) {
            for (var F = 0; F < J; ++F) I[F].terminate();
            X(null, D)
          }
        }), I.push(K)
      }
      for (var W = 0; W < J; ++W) I[W].postMessage(W)
    }

    function Y(J, X) {
      var I = [];
      for (var D = 0; D < J; ++D) {
        var W = X[D],
          K = I[D] = [];
        for (var V = 0; V < J; ++V) {
          if (D === V) continue;
          var F = X[V];
          if (W.st > F.st && W.st < F.et || F.st > W.st && F.st < W.et) K.push(V)
        }
      }
      return I.reduce(function (H, E) {
        return Math.max(H, E.length)
      }, 0)
    }
  }
})
// @from(Ln 371214, Col 4)
bV1 = U((aJY, Dn2) => {
  var mF = H8();
  _7();
  Dn2.exports = mF.cipher = mF.cipher || {};
  mF.cipher.algorithms = mF.cipher.algorithms || {};
  mF.cipher.createCipher = function (A, Q) {
    var B = A;
    if (typeof B === "string") {
      if (B = mF.cipher.getAlgorithm(B), B) B = B()
    }
    if (!B) throw Error("Unsupported algorithm: " + A);
    return new mF.cipher.BlockCipher({
      algorithm: B,
      key: Q,
      decrypt: !1
    })
  };
  mF.cipher.createDecipher = function (A, Q) {
    var B = A;
    if (typeof B === "string") {
      if (B = mF.cipher.getAlgorithm(B), B) B = B()
    }
    if (!B) throw Error("Unsupported algorithm: " + A);
    return new mF.cipher.BlockCipher({
      algorithm: B,
      key: Q,
      decrypt: !0
    })
  };
  mF.cipher.registerAlgorithm = function (A, Q) {
    A = A.toUpperCase(), mF.cipher.algorithms[A] = Q
  };
  mF.cipher.getAlgorithm = function (A) {
    if (A = A.toUpperCase(), A in mF.cipher.algorithms) return mF.cipher.algorithms[A];
    return null
  };
  var uN0 = mF.cipher.BlockCipher = function (A) {
    this.algorithm = A.algorithm, this.mode = this.algorithm.mode, this.blockSize = this.mode.blockSize, this._finish = !1, this._input = null, this.output = null, this._op = A.decrypt ? this.mode.decrypt : this.mode.encrypt, this._decrypt = A.decrypt, this.algorithm.initialize(A)
  };
  uN0.prototype.start = function (A) {
    A = A || {};
    var Q = {};
    for (var B in A) Q[B] = A[B];
    Q.decrypt = this._decrypt, this._finish = !1, this._input = mF.util.createBuffer(), this.output = A.output || mF.util.createBuffer(), this.mode.start(Q)
  };
  uN0.prototype.update = function (A) {
    if (A) this._input.putBuffer(A);
    while (!this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish);
    this._input.compact()
  };
  uN0.prototype.finish = function (A) {
    if (A && (this.mode.name === "ECB" || this.mode.name === "CBC")) this.mode.pad = function (B) {
      return A(this.blockSize, B, !1)
    }, this.mode.unpad = function (B) {
      return A(this.blockSize, B, !0)
    };
    var Q = {};
    if (Q.decrypt = this._decrypt, Q.overflow = this._input.length() % this.blockSize, !this._decrypt && this.mode.pad) {
      if (!this.mode.pad(this._input, Q)) return !1
    }
    if (this._finish = !0, this.update(), this._decrypt && this.mode.unpad) {
      if (!this.mode.unpad(this.output, Q)) return !1
    }
    if (this.mode.afterFinish) {
      if (!this.mode.afterFinish(this.output, Q)) return !1
    }
    return !0
  }
})