
// @from(Ln 235829, Col 4)
P81 = U((O2Z, InB) => {
  var XnB = bz(),
    Bm8 = (A, Q, B) => {
      let G = new XnB(A, B),
        Z = new XnB(Q, B);
      return G.compare(Z) || G.compareBuild(Z)
    };
  InB.exports = Bm8
})
// @from(Ln 235838, Col 4)
WnB = U((M2Z, DnB) => {
  var Gm8 = P81(),
    Zm8 = (A, Q) => A.sort((B, G) => Gm8(B, G, Q));
  DnB.exports = Zm8
})
// @from(Ln 235843, Col 4)
VnB = U((R2Z, KnB) => {
  var Ym8 = P81(),
    Jm8 = (A, Q) => A.sort((B, G) => Ym8(G, B, Q));
  KnB.exports = Jm8
})
// @from(Ln 235848, Col 4)
XSA = U((_2Z, FnB) => {
  var Xm8 = O_(),
    Im8 = (A, Q, B) => Xm8(A, Q, B) > 0;
  FnB.exports = Im8
})
// @from(Ln 235853, Col 4)
S81 = U((j2Z, HnB) => {
  var Dm8 = O_(),
    Wm8 = (A, Q, B) => Dm8(A, Q, B) < 0;
  HnB.exports = Wm8
})
// @from(Ln 235858, Col 4)
j70 = U((T2Z, EnB) => {
  var Km8 = O_(),
    Vm8 = (A, Q, B) => Km8(A, Q, B) === 0;
  EnB.exports = Vm8
})
// @from(Ln 235863, Col 4)
T70 = U((P2Z, znB) => {
  var Fm8 = O_(),
    Hm8 = (A, Q, B) => Fm8(A, Q, B) !== 0;
  znB.exports = Hm8
})
// @from(Ln 235868, Col 4)
x81 = U((S2Z, $nB) => {
  var Em8 = O_(),
    zm8 = (A, Q, B) => Em8(A, Q, B) >= 0;
  $nB.exports = zm8
})
// @from(Ln 235873, Col 4)
y81 = U((x2Z, CnB) => {
  var $m8 = O_(),
    Cm8 = (A, Q, B) => $m8(A, Q, B) <= 0;
  CnB.exports = Cm8
})
// @from(Ln 235878, Col 4)
P70 = U((y2Z, UnB) => {
  var Um8 = j70(),
    qm8 = T70(),
    Nm8 = XSA(),
    wm8 = x81(),
    Lm8 = S81(),
    Om8 = y81(),
    Mm8 = (A, Q, B, G) => {
      switch (Q) {
        case "===":
          if (typeof A === "object") A = A.version;
          if (typeof B === "object") B = B.version;
          return A === B;
        case "!==":
          if (typeof A === "object") A = A.version;
          if (typeof B === "object") B = B.version;
          return A !== B;
        case "":
        case "=":
        case "==":
          return Um8(A, B, G);
        case "!=":
          return qm8(A, B, G);
        case ">":
          return Nm8(A, B, G);
        case ">=":
          return wm8(A, B, G);
        case "<":
          return Lm8(A, B, G);
        case "<=":
          return Om8(A, B, G);
        default:
          throw TypeError(`Invalid operator: ${Q}`)
      }
    };
  UnB.exports = Mm8
})
// @from(Ln 235915, Col 4)
NnB = U((v2Z, qnB) => {
  var Rm8 = bz(),
    _m8 = V9A(),
    {
      safeRe: v81,
      t: k81
    } = pWA(),
    jm8 = (A, Q) => {
      if (A instanceof Rm8) return A;
      if (typeof A === "number") A = String(A);
      if (typeof A !== "string") return null;
      Q = Q || {};
      let B = null;
      if (!Q.rtl) B = A.match(Q.includePrerelease ? v81[k81.COERCEFULL] : v81[k81.COERCE]);
      else {
        let I = Q.includePrerelease ? v81[k81.COERCERTLFULL] : v81[k81.COERCERTL],
          D;
        while ((D = I.exec(A)) && (!B || B.index + B[0].length !== A.length)) {
          if (!B || D.index + D[0].length !== B.index + B[0].length) B = D;
          I.lastIndex = D.index + D[1].length + D[2].length
        }
        I.lastIndex = -1
      }
      if (B === null) return null;
      let G = B[2],
        Z = B[3] || "0",
        Y = B[4] || "0",
        J = Q.includePrerelease && B[5] ? `-${B[5]}` : "",
        X = Q.includePrerelease && B[6] ? `+${B[6]}` : "";
      return _m8(`${G}.${Z}.${Y}${J}${X}`, Q)
    };
  qnB.exports = jm8
})
// @from(Ln 235948, Col 4)
OnB = U((k2Z, LnB) => {
  class wnB {
    constructor() {
      this.max = 1000, this.map = new Map
    }
    get(A) {
      let Q = this.map.get(A);
      if (Q === void 0) return;
      else return this.map.delete(A), this.map.set(A, Q), Q
    }
    delete(A) {
      return this.map.delete(A)
    }
    set(A, Q) {
      if (!this.delete(A) && Q !== void 0) {
        if (this.map.size >= this.max) {
          let G = this.map.keys().next().value;
          this.delete(G)
        }
        this.map.set(A, Q)
      }
      return this
    }
  }
  LnB.exports = wnB
})
// @from(Ln 235974, Col 4)
M_ = U((b2Z, jnB) => {
  var Tm8 = /\s+/g;
  class ISA {
    constructor(A, Q) {
      if (Q = Sm8(Q), A instanceof ISA)
        if (A.loose === !!Q.loose && A.includePrerelease === !!Q.includePrerelease) return A;
        else return new ISA(A.raw, Q);
      if (A instanceof S70) return this.raw = A.value, this.set = [
        [A]
      ], this.formatted = void 0, this;
      if (this.options = Q, this.loose = !!Q.loose, this.includePrerelease = !!Q.includePrerelease, this.raw = A.trim().replace(Tm8, " "), this.set = this.raw.split("||").map((B) => this.parseRange(B.trim())).filter((B) => B.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        let B = this.set[0];
        if (this.set = this.set.filter((G) => !RnB(G[0])), this.set.length === 0) this.set = [B];
        else if (this.set.length > 1) {
          for (let G of this.set)
            if (G.length === 1 && hm8(G[0])) {
              this.set = [G];
              break
            }
        }
      }
      this.formatted = void 0
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let A = 0; A < this.set.length; A++) {
          if (A > 0) this.formatted += "||";
          let Q = this.set[A];
          for (let B = 0; B < Q.length; B++) {
            if (B > 0) this.formatted += " ";
            this.formatted += Q[B].toString().trim()
          }
        }
      }
      return this.formatted
    }
    format() {
      return this.range
    }
    toString() {
      return this.range
    }
    parseRange(A) {
      let B = ((this.options.includePrerelease && bm8) | (this.options.loose && fm8)) + ":" + A,
        G = MnB.get(B);
      if (G) return G;
      let Z = this.options.loose,
        Y = Z ? zN[kC.HYPHENRANGELOOSE] : zN[kC.HYPHENRANGE];
      A = A.replace(Y, am8(this.options.includePrerelease)), RJ("hyphen replace", A), A = A.replace(zN[kC.COMPARATORTRIM], ym8), RJ("comparator trim", A), A = A.replace(zN[kC.TILDETRIM], vm8), RJ("tilde trim", A), A = A.replace(zN[kC.CARETTRIM], km8), RJ("caret trim", A);
      let J = A.split(" ").map((W) => gm8(W, this.options)).join(" ").split(/\s+/).map((W) => nm8(W, this.options));
      if (Z) J = J.filter((W) => {
        return RJ("loose invalid filter", W, this.options), !!W.match(zN[kC.COMPARATORLOOSE])
      });
      RJ("range list", J);
      let X = new Map,
        I = J.map((W) => new S70(W, this.options));
      for (let W of I) {
        if (RnB(W)) return [W];
        X.set(W.value, W)
      }
      if (X.size > 1 && X.has("")) X.delete("");
      let D = [...X.values()];
      return MnB.set(B, D), D
    }
    intersects(A, Q) {
      if (!(A instanceof ISA)) throw TypeError("a Range is required");
      return this.set.some((B) => {
        return _nB(B, Q) && A.set.some((G) => {
          return _nB(G, Q) && B.every((Z) => {
            return G.every((Y) => {
              return Z.intersects(Y, Q)
            })
          })
        })
      })
    }
    test(A) {
      if (!A) return !1;
      if (typeof A === "string") try {
        A = new xm8(A, this.options)
      } catch (Q) {
        return !1
      }
      for (let Q = 0; Q < this.set.length; Q++)
        if (om8(this.set[Q], A, this.options)) return !0;
      return !1
    }
  }
  jnB.exports = ISA;
  var Pm8 = OnB(),
    MnB = new Pm8,
    Sm8 = R81(),
    S70 = DSA(),
    RJ = JSA(),
    xm8 = bz(),
    {
      safeRe: zN,
      t: kC,
      comparatorTrimReplace: ym8,
      tildeTrimReplace: vm8,
      caretTrimReplace: km8
    } = pWA(),
    {
      FLAG_INCLUDE_PRERELEASE: bm8,
      FLAG_LOOSE: fm8
    } = YSA(),
    RnB = (A) => A.value === "<0.0.0-0",
    hm8 = (A) => A.value === "",
    _nB = (A, Q) => {
      let B = !0,
        G = A.slice(),
        Z = G.pop();
      while (B && G.length) B = G.every((Y) => {
        return Z.intersects(Y, Q)
      }), Z = G.pop();
      return B
    },
    gm8 = (A, Q) => {
      return RJ("comp", A, Q), A = dm8(A, Q), RJ("caret", A), A = um8(A, Q), RJ("tildes", A), A = pm8(A, Q), RJ("xrange", A), A = im8(A, Q), RJ("stars", A), A
    },
    bC = (A) => !A || A.toLowerCase() === "x" || A === "*",
    um8 = (A, Q) => {
      return A.trim().split(/\s+/).map((B) => mm8(B, Q)).join(" ")
    },
    mm8 = (A, Q) => {
      let B = Q.loose ? zN[kC.TILDELOOSE] : zN[kC.TILDE];
      return A.replace(B, (G, Z, Y, J, X) => {
        RJ("tilde", A, G, Z, Y, J, X);
        let I;
        if (bC(Z)) I = "";
        else if (bC(Y)) I = `>=${Z}.0.0 <${+Z+1}.0.0-0`;
        else if (bC(J)) I = `>=${Z}.${Y}.0 <${Z}.${+Y+1}.0-0`;
        else if (X) RJ("replaceTilde pr", X), I = `>=${Z}.${Y}.${J}-${X} <${Z}.${+Y+1}.0-0`;
        else I = `>=${Z}.${Y}.${J} <${Z}.${+Y+1}.0-0`;
        return RJ("tilde return", I), I
      })
    },
    dm8 = (A, Q) => {
      return A.trim().split(/\s+/).map((B) => cm8(B, Q)).join(" ")
    },
    cm8 = (A, Q) => {
      RJ("caret", A, Q);
      let B = Q.loose ? zN[kC.CARETLOOSE] : zN[kC.CARET],
        G = Q.includePrerelease ? "-0" : "";
      return A.replace(B, (Z, Y, J, X, I) => {
        RJ("caret", A, Z, Y, J, X, I);
        let D;
        if (bC(Y)) D = "";
        else if (bC(J)) D = `>=${Y}.0.0${G} <${+Y+1}.0.0-0`;
        else if (bC(X))
          if (Y === "0") D = `>=${Y}.${J}.0${G} <${Y}.${+J+1}.0-0`;
          else D = `>=${Y}.${J}.0${G} <${+Y+1}.0.0-0`;
        else if (I)
          if (RJ("replaceCaret pr", I), Y === "0")
            if (J === "0") D = `>=${Y}.${J}.${X}-${I} <${Y}.${J}.${+X+1}-0`;
            else D = `>=${Y}.${J}.${X}-${I} <${Y}.${+J+1}.0-0`;
        else D = `>=${Y}.${J}.${X}-${I} <${+Y+1}.0.0-0`;
        else if (RJ("no pr"), Y === "0")
          if (J === "0") D = `>=${Y}.${J}.${X}${G} <${Y}.${J}.${+X+1}-0`;
          else D = `>=${Y}.${J}.${X}${G} <${Y}.${+J+1}.0-0`;
        else D = `>=${Y}.${J}.${X} <${+Y+1}.0.0-0`;
        return RJ("caret return", D), D
      })
    },
    pm8 = (A, Q) => {
      return RJ("replaceXRanges", A, Q), A.split(/\s+/).map((B) => lm8(B, Q)).join(" ")
    },
    lm8 = (A, Q) => {
      A = A.trim();
      let B = Q.loose ? zN[kC.XRANGELOOSE] : zN[kC.XRANGE];
      return A.replace(B, (G, Z, Y, J, X, I) => {
        RJ("xRange", A, G, Z, Y, J, X, I);
        let D = bC(Y),
          W = D || bC(J),
          K = W || bC(X),
          V = K;
        if (Z === "=" && V) Z = "";
        if (I = Q.includePrerelease ? "-0" : "", D)
          if (Z === ">" || Z === "<") G = "<0.0.0-0";
          else G = "*";
        else if (Z && V) {
          if (W) J = 0;
          if (X = 0, Z === ">")
            if (Z = ">=", W) Y = +Y + 1, J = 0, X = 0;
            else J = +J + 1, X = 0;
          else if (Z === "<=")
            if (Z = "<", W) Y = +Y + 1;
            else J = +J + 1;
          if (Z === "<") I = "-0";
          G = `${Z+Y}.${J}.${X}${I}`
        } else if (W) G = `>=${Y}.0.0${I} <${+Y+1}.0.0-0`;
        else if (K) G = `>=${Y}.${J}.0${I} <${Y}.${+J+1}.0-0`;
        return RJ("xRange return", G), G
      })
    },
    im8 = (A, Q) => {
      return RJ("replaceStars", A, Q), A.trim().replace(zN[kC.STAR], "")
    },
    nm8 = (A, Q) => {
      return RJ("replaceGTE0", A, Q), A.trim().replace(zN[Q.includePrerelease ? kC.GTE0PRE : kC.GTE0], "")
    },
    am8 = (A) => (Q, B, G, Z, Y, J, X, I, D, W, K, V) => {
      if (bC(G)) B = "";
      else if (bC(Z)) B = `>=${G}.0.0${A?"-0":""}`;
      else if (bC(Y)) B = `>=${G}.${Z}.0${A?"-0":""}`;
      else if (J) B = `>=${B}`;
      else B = `>=${B}${A?"-0":""}`;
      if (bC(D)) I = "";
      else if (bC(W)) I = `<${+D+1}.0.0-0`;
      else if (bC(K)) I = `<${D}.${+W+1}.0-0`;
      else if (V) I = `<=${D}.${W}.${K}-${V}`;
      else if (A) I = `<${D}.${W}.${+K+1}-0`;
      else I = `<=${I}`;
      return `${B} ${I}`.trim()
    },
    om8 = (A, Q, B) => {
      for (let G = 0; G < A.length; G++)
        if (!A[G].test(Q)) return !1;
      if (Q.prerelease.length && !B.includePrerelease) {
        for (let G = 0; G < A.length; G++) {
          if (RJ(A[G].semver), A[G].semver === S70.ANY) continue;
          if (A[G].semver.prerelease.length > 0) {
            let Z = A[G].semver;
            if (Z.major === Q.major && Z.minor === Q.minor && Z.patch === Q.patch) return !0
          }
        }
        return !1
      }
      return !0
    }
})
// @from(Ln 236207, Col 4)
DSA = U((f2Z, vnB) => {
  var WSA = Symbol("SemVer ANY");
  class b81 {
    static get ANY() {
      return WSA
    }
    constructor(A, Q) {
      if (Q = TnB(Q), A instanceof b81)
        if (A.loose === !!Q.loose) return A;
        else A = A.value;
      if (A = A.trim().split(/\s+/).join(" "), y70("comparator", A, Q), this.options = Q, this.loose = !!Q.loose, this.parse(A), this.semver === WSA) this.value = "";
      else this.value = this.operator + this.semver.version;
      y70("comp", this)
    }
    parse(A) {
      let Q = this.options.loose ? PnB[SnB.COMPARATORLOOSE] : PnB[SnB.COMPARATOR],
        B = A.match(Q);
      if (!B) throw TypeError(`Invalid comparator: ${A}`);
      if (this.operator = B[1] !== void 0 ? B[1] : "", this.operator === "=") this.operator = "";
      if (!B[2]) this.semver = WSA;
      else this.semver = new xnB(B[2], this.options.loose)
    }
    toString() {
      return this.value
    }
    test(A) {
      if (y70("Comparator.test", A, this.options.loose), this.semver === WSA || A === WSA) return !0;
      if (typeof A === "string") try {
        A = new xnB(A, this.options)
      } catch (Q) {
        return !1
      }
      return x70(A, this.operator, this.semver, this.options)
    }
    intersects(A, Q) {
      if (!(A instanceof b81)) throw TypeError("a Comparator is required");
      if (this.operator === "") {
        if (this.value === "") return !0;
        return new ynB(A.value, Q).test(this.value)
      } else if (A.operator === "") {
        if (A.value === "") return !0;
        return new ynB(this.value, Q).test(A.semver)
      }
      if (Q = TnB(Q), Q.includePrerelease && (this.value === "<0.0.0-0" || A.value === "<0.0.0-0")) return !1;
      if (!Q.includePrerelease && (this.value.startsWith("<0.0.0") || A.value.startsWith("<0.0.0"))) return !1;
      if (this.operator.startsWith(">") && A.operator.startsWith(">")) return !0;
      if (this.operator.startsWith("<") && A.operator.startsWith("<")) return !0;
      if (this.semver.version === A.semver.version && this.operator.includes("=") && A.operator.includes("=")) return !0;
      if (x70(this.semver, "<", A.semver, Q) && this.operator.startsWith(">") && A.operator.startsWith("<")) return !0;
      if (x70(this.semver, ">", A.semver, Q) && this.operator.startsWith("<") && A.operator.startsWith(">")) return !0;
      return !1
    }
  }
  vnB.exports = b81;
  var TnB = R81(),
    {
      safeRe: PnB,
      t: SnB
    } = pWA(),
    x70 = P70(),
    y70 = JSA(),
    xnB = bz(),
    ynB = M_()
})
// @from(Ln 236271, Col 4)
KSA = U((h2Z, knB) => {
  var rm8 = M_(),
    sm8 = (A, Q, B) => {
      try {
        Q = new rm8(Q, B)
      } catch (G) {
        return !1
      }
      return Q.test(A)
    };
  knB.exports = sm8
})
// @from(Ln 236283, Col 4)
fnB = U((g2Z, bnB) => {
  var tm8 = M_(),
    em8 = (A, Q) => new tm8(A, Q).set.map((B) => B.map((G) => G.value).join(" ").trim().split(" "));
  bnB.exports = em8
})
// @from(Ln 236288, Col 4)
gnB = U((u2Z, hnB) => {
  var Ad8 = bz(),
    Qd8 = M_(),
    Bd8 = (A, Q, B) => {
      let G = null,
        Z = null,
        Y = null;
      try {
        Y = new Qd8(Q, B)
      } catch (J) {
        return null
      }
      return A.forEach((J) => {
        if (Y.test(J)) {
          if (!G || Z.compare(J) === -1) G = J, Z = new Ad8(G, B)
        }
      }), G
    };
  hnB.exports = Bd8
})
// @from(Ln 236308, Col 4)
mnB = U((m2Z, unB) => {
  var Gd8 = bz(),
    Zd8 = M_(),
    Yd8 = (A, Q, B) => {
      let G = null,
        Z = null,
        Y = null;
      try {
        Y = new Zd8(Q, B)
      } catch (J) {
        return null
      }
      return A.forEach((J) => {
        if (Y.test(J)) {
          if (!G || Z.compare(J) === 1) G = J, Z = new Gd8(G, B)
        }
      }), G
    };
  unB.exports = Yd8
})
// @from(Ln 236328, Col 4)
pnB = U((d2Z, cnB) => {
  var v70 = bz(),
    Jd8 = M_(),
    dnB = XSA(),
    Xd8 = (A, Q) => {
      A = new Jd8(A, Q);
      let B = new v70("0.0.0");
      if (A.test(B)) return B;
      if (B = new v70("0.0.0-0"), A.test(B)) return B;
      B = null;
      for (let G = 0; G < A.set.length; ++G) {
        let Z = A.set[G],
          Y = null;
        if (Z.forEach((J) => {
            let X = new v70(J.semver.version);
            switch (J.operator) {
              case ">":
                if (X.prerelease.length === 0) X.patch++;
                else X.prerelease.push(0);
                X.raw = X.format();
              case "":
              case ">=":
                if (!Y || dnB(X, Y)) Y = X;
                break;
              case "<":
              case "<=":
                break;
              default:
                throw Error(`Unexpected operation: ${J.operator}`)
            }
          }), Y && (!B || dnB(B, Y))) B = Y
      }
      if (B && A.test(B)) return B;
      return null
    };
  cnB.exports = Xd8
})
// @from(Ln 236365, Col 4)
inB = U((c2Z, lnB) => {
  var Id8 = M_(),
    Dd8 = (A, Q) => {
      try {
        return new Id8(A, Q).range || "*"
      } catch (B) {
        return null
      }
    };
  lnB.exports = Dd8
})
// @from(Ln 236376, Col 4)
f81 = U((p2Z, rnB) => {
  var Wd8 = bz(),
    onB = DSA(),
    {
      ANY: Kd8
    } = onB,
    Vd8 = M_(),
    Fd8 = KSA(),
    nnB = XSA(),
    anB = S81(),
    Hd8 = y81(),
    Ed8 = x81(),
    zd8 = (A, Q, B, G) => {
      A = new Wd8(A, G), Q = new Vd8(Q, G);
      let Z, Y, J, X, I;
      switch (B) {
        case ">":
          Z = nnB, Y = Hd8, J = anB, X = ">", I = ">=";
          break;
        case "<":
          Z = anB, Y = Ed8, J = nnB, X = "<", I = "<=";
          break;
        default:
          throw TypeError('Must provide a hilo val of "<" or ">"')
      }
      if (Fd8(A, Q, G)) return !1;
      for (let D = 0; D < Q.set.length; ++D) {
        let W = Q.set[D],
          K = null,
          V = null;
        if (W.forEach((F) => {
            if (F.semver === Kd8) F = new onB(">=0.0.0");
            if (K = K || F, V = V || F, Z(F.semver, K.semver, G)) K = F;
            else if (J(F.semver, V.semver, G)) V = F
          }), K.operator === X || K.operator === I) return !1;
        if ((!V.operator || V.operator === X) && Y(A, V.semver)) return !1;
        else if (V.operator === I && J(A, V.semver)) return !1
      }
      return !0
    };
  rnB.exports = zd8
})
// @from(Ln 236418, Col 4)
tnB = U((l2Z, snB) => {
  var $d8 = f81(),
    Cd8 = (A, Q, B) => $d8(A, Q, ">", B);
  snB.exports = Cd8
})
// @from(Ln 236423, Col 4)
AaB = U((i2Z, enB) => {
  var Ud8 = f81(),
    qd8 = (A, Q, B) => Ud8(A, Q, "<", B);
  enB.exports = qd8
})
// @from(Ln 236428, Col 4)
GaB = U((n2Z, BaB) => {
  var QaB = M_(),
    Nd8 = (A, Q, B) => {
      return A = new QaB(A, B), Q = new QaB(Q, B), A.intersects(Q, B)
    };
  BaB.exports = Nd8
})
// @from(Ln 236435, Col 4)
YaB = U((a2Z, ZaB) => {
  var wd8 = KSA(),
    Ld8 = O_();
  ZaB.exports = (A, Q, B) => {
    let G = [],
      Z = null,
      Y = null,
      J = A.sort((W, K) => Ld8(W, K, B));
    for (let W of J)
      if (wd8(W, Q, B)) {
        if (Y = W, !Z) Z = W
      } else {
        if (Y) G.push([Z, Y]);
        Y = null, Z = null
      } if (Z) G.push([Z, null]);
    let X = [];
    for (let [W, K] of G)
      if (W === K) X.push(W);
      else if (!K && W === J[0]) X.push("*");
    else if (!K) X.push(`>=${W}`);
    else if (W === J[0]) X.push(`<=${K}`);
    else X.push(`${W} - ${K}`);
    let I = X.join(" || "),
      D = typeof Q.raw === "string" ? Q.raw : String(Q);
    return I.length < D.length ? I : Q
  }
})
// @from(Ln 236462, Col 4)
KaB = U((o2Z, WaB) => {
  var JaB = M_(),
    b70 = DSA(),
    {
      ANY: k70
    } = b70,
    VSA = KSA(),
    f70 = O_(),
    Od8 = (A, Q, B = {}) => {
      if (A === Q) return !0;
      A = new JaB(A, B), Q = new JaB(Q, B);
      let G = !1;
      A: for (let Z of A.set) {
        for (let Y of Q.set) {
          let J = Rd8(Z, Y, B);
          if (G = G || J !== null, J) continue A
        }
        if (G) return !1
      }
      return !0
    },
    Md8 = [new b70(">=0.0.0-0")],
    XaB = [new b70(">=0.0.0")],
    Rd8 = (A, Q, B) => {
      if (A === Q) return !0;
      if (A.length === 1 && A[0].semver === k70)
        if (Q.length === 1 && Q[0].semver === k70) return !0;
        else if (B.includePrerelease) A = Md8;
      else A = XaB;
      if (Q.length === 1 && Q[0].semver === k70)
        if (B.includePrerelease) return !0;
        else Q = XaB;
      let G = new Set,
        Z, Y;
      for (let F of A)
        if (F.operator === ">" || F.operator === ">=") Z = IaB(Z, F, B);
        else if (F.operator === "<" || F.operator === "<=") Y = DaB(Y, F, B);
      else G.add(F.semver);
      if (G.size > 1) return null;
      let J;
      if (Z && Y) {
        if (J = f70(Z.semver, Y.semver, B), J > 0) return null;
        else if (J === 0 && (Z.operator !== ">=" || Y.operator !== "<=")) return null
      }
      for (let F of G) {
        if (Z && !VSA(F, String(Z), B)) return null;
        if (Y && !VSA(F, String(Y), B)) return null;
        for (let H of Q)
          if (!VSA(F, String(H), B)) return !1;
        return !0
      }
      let X, I, D, W, K = Y && !B.includePrerelease && Y.semver.prerelease.length ? Y.semver : !1,
        V = Z && !B.includePrerelease && Z.semver.prerelease.length ? Z.semver : !1;
      if (K && K.prerelease.length === 1 && Y.operator === "<" && K.prerelease[0] === 0) K = !1;
      for (let F of Q) {
        if (W = W || F.operator === ">" || F.operator === ">=", D = D || F.operator === "<" || F.operator === "<=", Z) {
          if (V) {
            if (F.semver.prerelease && F.semver.prerelease.length && F.semver.major === V.major && F.semver.minor === V.minor && F.semver.patch === V.patch) V = !1
          }
          if (F.operator === ">" || F.operator === ">=") {
            if (X = IaB(Z, F, B), X === F && X !== Z) return !1
          } else if (Z.operator === ">=" && !VSA(Z.semver, String(F), B)) return !1
        }
        if (Y) {
          if (K) {
            if (F.semver.prerelease && F.semver.prerelease.length && F.semver.major === K.major && F.semver.minor === K.minor && F.semver.patch === K.patch) K = !1
          }
          if (F.operator === "<" || F.operator === "<=") {
            if (I = DaB(Y, F, B), I === F && I !== Y) return !1
          } else if (Y.operator === "<=" && !VSA(Y.semver, String(F), B)) return !1
        }
        if (!F.operator && (Y || Z) && J !== 0) return !1
      }
      if (Z && D && !Y && J !== 0) return !1;
      if (Y && W && !Z && J !== 0) return !1;
      if (V || K) return !1;
      return !0
    },
    IaB = (A, Q, B) => {
      if (!A) return Q;
      let G = f70(A.semver, Q.semver, B);
      return G > 0 ? A : G < 0 ? Q : Q.operator === ">" && A.operator === ">=" ? Q : A
    },
    DaB = (A, Q, B) => {
      if (!A) return Q;
      let G = f70(A.semver, Q.semver, B);
      return G < 0 ? A : G > 0 ? Q : Q.operator === "<" && A.operator === "<=" ? Q : A
    };
  WaB.exports = Od8
})
// @from(Ln 236552, Col 4)
h81 = U((r2Z, HaB) => {
  var h70 = pWA(),
    VaB = YSA(),
    _d8 = bz(),
    FaB = _70(),
    jd8 = V9A(),
    Td8 = hiB(),
    Pd8 = uiB(),
    Sd8 = ciB(),
    xd8 = iiB(),
    yd8 = aiB(),
    vd8 = riB(),
    kd8 = tiB(),
    bd8 = AnB(),
    fd8 = O_(),
    hd8 = ZnB(),
    gd8 = JnB(),
    ud8 = P81(),
    md8 = WnB(),
    dd8 = VnB(),
    cd8 = XSA(),
    pd8 = S81(),
    ld8 = j70(),
    id8 = T70(),
    nd8 = x81(),
    ad8 = y81(),
    od8 = P70(),
    rd8 = NnB(),
    sd8 = DSA(),
    td8 = M_(),
    ed8 = KSA(),
    Ac8 = fnB(),
    Qc8 = gnB(),
    Bc8 = mnB(),
    Gc8 = pnB(),
    Zc8 = inB(),
    Yc8 = f81(),
    Jc8 = tnB(),
    Xc8 = AaB(),
    Ic8 = GaB(),
    Dc8 = YaB(),
    Wc8 = KaB();
  HaB.exports = {
    parse: jd8,
    valid: Td8,
    clean: Pd8,
    inc: Sd8,
    diff: xd8,
    major: yd8,
    minor: vd8,
    patch: kd8,
    prerelease: bd8,
    compare: fd8,
    rcompare: hd8,
    compareLoose: gd8,
    compareBuild: ud8,
    sort: md8,
    rsort: dd8,
    gt: cd8,
    lt: pd8,
    eq: ld8,
    neq: id8,
    gte: nd8,
    lte: ad8,
    cmp: od8,
    coerce: rd8,
    Comparator: sd8,
    Range: td8,
    satisfies: ed8,
    toComparators: Ac8,
    maxSatisfying: Qc8,
    minSatisfying: Bc8,
    minVersion: Gc8,
    validRange: Zc8,
    outside: Yc8,
    gtr: Jc8,
    ltr: Xc8,
    intersects: Ic8,
    simplifyRange: Dc8,
    subset: Wc8,
    SemVer: _d8,
    re: h70.re,
    src: h70.src,
    tokens: h70.t,
    SEMVER_SPEC_VERSION: VaB.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: VaB.RELEASE_TYPES,
    compareIdentifiers: FaB.compareIdentifiers,
    rcompareIdentifiers: FaB.rcompareIdentifiers
  }
})
// @from(Ln 236642, Col 4)
zaB = U((s2Z, EaB) => {
  var Kc8 = h81();
  EaB.exports = Kc8.satisfies(process.version, ">=15.7.0")
})
// @from(Ln 236646, Col 4)
CaB = U((t2Z, $aB) => {
  var Vc8 = h81();
  $aB.exports = Vc8.satisfies(process.version, ">=16.9.0")
})
// @from(Ln 236650, Col 4)
g70 = U((e2Z, UaB) => {
  var Fc8 = zaB(),
    Hc8 = CaB(),
    Ec8 = {
      ec: ["ES256", "ES384", "ES512"],
      rsa: ["RS256", "PS256", "RS384", "PS384", "RS512", "PS512"],
      "rsa-pss": ["PS256", "PS384", "PS512"]
    },
    zc8 = {
      ES256: "prime256v1",
      ES384: "secp384r1",
      ES512: "secp521r1"
    };
  UaB.exports = function (A, Q) {
    if (!A || !Q) return;
    let B = Q.asymmetricKeyType;
    if (!B) return;
    let G = Ec8[B];
    if (!G) throw Error(`Unknown key type "${B}".`);
    if (!G.includes(A)) throw Error(`"alg" parameter for "${B}" key type must be one of: ${G.join(", ")}.`);
    if (Fc8) switch (B) {
      case "ec":
        let Z = Q.asymmetricKeyDetails.namedCurve,
          Y = zc8[A];
        if (Z !== Y) throw Error(`"alg" parameter "${A}" requires curve "${Y}".`);
        break;
      case "rsa-pss":
        if (Hc8) {
          let J = parseInt(A.slice(-3), 10),
            {
              hashAlgorithm: X,
              mgf1HashAlgorithm: I,
              saltLength: D
            } = Q.asymmetricKeyDetails;
          if (X !== `sha${J}` || I !== X) throw Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${A}.`);
          if (D !== void 0 && D > J >> 3) throw Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${A}.`)
        }
        break
    }
  }
})
// @from(Ln 236691, Col 4)
u70 = U((A9Z, qaB) => {
  var $c8 = h81();
  qaB.exports = $c8.satisfies(process.version, "^6.12.0 || >=8.0.0")
})
// @from(Ln 236695, Col 4)
LaB = U((Q9Z, waB) => {
  var iY = ZSA(),
    Cc8 = w70(),
    NaB = L70(),
    Uc8 = N70(),
    qc8 = O70(),
    Nc8 = g70(),
    wc8 = u70(),
    Lc8 = w81(),
    {
      KeyObject: Oc8,
      createSecretKey: Mc8,
      createPublicKey: Rc8
    } = NA("crypto"),
    m70 = ["RS256", "RS384", "RS512"],
    _c8 = ["ES256", "ES384", "ES512"],
    d70 = ["RS256", "RS384", "RS512"],
    jc8 = ["HS256", "HS384", "HS512"];
  if (wc8) m70.splice(m70.length, 0, "PS256", "PS384", "PS512"), d70.splice(d70.length, 0, "PS256", "PS384", "PS512");
  waB.exports = function (A, Q, B, G) {
    if (typeof B === "function" && !G) G = B, B = {};
    if (!B) B = {};
    B = Object.assign({}, B);
    let Z;
    if (G) Z = G;
    else Z = function (W, K) {
      if (W) throw W;
      return K
    };
    if (B.clockTimestamp && typeof B.clockTimestamp !== "number") return Z(new iY("clockTimestamp must be a number"));
    if (B.nonce !== void 0 && (typeof B.nonce !== "string" || B.nonce.trim() === "")) return Z(new iY("nonce must be a non-empty string"));
    if (B.allowInvalidAsymmetricKeyTypes !== void 0 && typeof B.allowInvalidAsymmetricKeyTypes !== "boolean") return Z(new iY("allowInvalidAsymmetricKeyTypes must be a boolean"));
    let Y = B.clockTimestamp || Math.floor(Date.now() / 1000);
    if (!A) return Z(new iY("jwt must be provided"));
    if (typeof A !== "string") return Z(new iY("jwt must be a string"));
    let J = A.split(".");
    if (J.length !== 3) return Z(new iY("jwt malformed"));
    let X;
    try {
      X = Uc8(A, {
        complete: !0
      })
    } catch (W) {
      return Z(W)
    }
    if (!X) return Z(new iY("invalid token"));
    let I = X.header,
      D;
    if (typeof Q === "function") {
      if (!G) return Z(new iY("verify must be called asynchronous if secret or public key is provided as a callback"));
      D = Q
    } else D = function (W, K) {
      return K(null, Q)
    };
    return D(I, function (W, K) {
      if (W) return Z(new iY("error in secret or public key callback: " + W.message));
      let V = J[2].trim() !== "";
      if (!V && K) return Z(new iY("jwt signature is required"));
      if (V && !K) return Z(new iY("secret or public key must be provided"));
      if (!V && !B.algorithms) return Z(new iY('please specify "none" in "algorithms" to verify unsigned tokens'));
      if (K != null && !(K instanceof Oc8)) try {
        K = Rc8(K)
      } catch (E) {
        try {
          K = Mc8(typeof K === "string" ? Buffer.from(K) : K)
        } catch (z) {
          return Z(new iY("secretOrPublicKey is not valid key material"))
        }
      }
      if (!B.algorithms)
        if (K.type === "secret") B.algorithms = jc8;
        else if (["rsa", "rsa-pss"].includes(K.asymmetricKeyType)) B.algorithms = d70;
      else if (K.asymmetricKeyType === "ec") B.algorithms = _c8;
      else B.algorithms = m70;
      if (B.algorithms.indexOf(X.header.alg) === -1) return Z(new iY("invalid algorithm"));
      if (I.alg.startsWith("HS") && K.type !== "secret") return Z(new iY(`secretOrPublicKey must be a symmetric key when using ${I.alg}`));
      else if (/^(?:RS|PS|ES)/.test(I.alg) && K.type !== "public") return Z(new iY(`secretOrPublicKey must be an asymmetric key when using ${I.alg}`));
      if (!B.allowInvalidAsymmetricKeyTypes) try {
        Nc8(I.alg, K)
      } catch (E) {
        return Z(E)
      }
      let F;
      try {
        F = Lc8.verify(A, X.header.alg, K)
      } catch (E) {
        return Z(E)
      }
      if (!F) return Z(new iY("invalid signature"));
      let H = X.payload;
      if (typeof H.nbf < "u" && !B.ignoreNotBefore) {
        if (typeof H.nbf !== "number") return Z(new iY("invalid nbf value"));
        if (H.nbf > Y + (B.clockTolerance || 0)) return Z(new Cc8("jwt not active", new Date(H.nbf * 1000)))
      }
      if (typeof H.exp < "u" && !B.ignoreExpiration) {
        if (typeof H.exp !== "number") return Z(new iY("invalid exp value"));
        if (Y >= H.exp + (B.clockTolerance || 0)) return Z(new NaB("jwt expired", new Date(H.exp * 1000)))
      }
      if (B.audience) {
        let E = Array.isArray(B.audience) ? B.audience : [B.audience];
        if (!(Array.isArray(H.aud) ? H.aud : [H.aud]).some(function (O) {
            return E.some(function (L) {
              return L instanceof RegExp ? L.test(O) : L === O
            })
          })) return Z(new iY("jwt audience invalid. expected: " + E.join(" or ")))
      }
      if (B.issuer) {
        if (typeof B.issuer === "string" && H.iss !== B.issuer || Array.isArray(B.issuer) && B.issuer.indexOf(H.iss) === -1) return Z(new iY("jwt issuer invalid. expected: " + B.issuer))
      }
      if (B.subject) {
        if (H.sub !== B.subject) return Z(new iY("jwt subject invalid. expected: " + B.subject))
      }
      if (B.jwtid) {
        if (H.jti !== B.jwtid) return Z(new iY("jwt jwtid invalid. expected: " + B.jwtid))
      }
      if (B.nonce) {
        if (H.nonce !== B.nonce) return Z(new iY("jwt nonce invalid. expected: " + B.nonce))
      }
      if (B.maxAge) {
        if (typeof H.iat !== "number") return Z(new iY("iat required when maxAge is specified"));
        let E = qc8(B.maxAge, H.iat);
        if (typeof E > "u") return Z(new iY('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        if (Y >= E + (B.clockTolerance || 0)) return Z(new NaB("maxAge exceeded", new Date(E * 1000)))
      }
      if (B.complete === !0) {
        let E = X.signature;
        return Z(null, {
          header: I,
          payload: H,
          signature: E
        })
      }
      return Z(null, H)
    })
  }
})
// @from(Ln 236831, Col 4)
TaB = U((B9Z, jaB) => {
  var OaB = 1 / 0,
    RaB = 9007199254740991,
    Tc8 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
    MaB = NaN,
    Pc8 = "[object Arguments]",
    Sc8 = "[object Function]",
    xc8 = "[object GeneratorFunction]",
    yc8 = "[object String]",
    vc8 = "[object Symbol]",
    kc8 = /^\s+|\s+$/g,
    bc8 = /^[-+]0x[0-9a-f]+$/i,
    fc8 = /^0b[01]+$/i,
    hc8 = /^0o[0-7]+$/i,
    gc8 = /^(?:0|[1-9]\d*)$/,
    uc8 = parseInt;

  function mc8(A, Q) {
    var B = -1,
      G = A ? A.length : 0,
      Z = Array(G);
    while (++B < G) Z[B] = Q(A[B], B, A);
    return Z
  }

  function dc8(A, Q, B, G) {
    var Z = A.length,
      Y = B + (G ? 1 : -1);
    while (G ? Y-- : ++Y < Z)
      if (Q(A[Y], Y, A)) return Y;
    return -1
  }

  function cc8(A, Q, B) {
    if (Q !== Q) return dc8(A, pc8, B);
    var G = B - 1,
      Z = A.length;
    while (++G < Z)
      if (A[G] === Q) return G;
    return -1
  }

  function pc8(A) {
    return A !== A
  }

  function lc8(A, Q) {
    var B = -1,
      G = Array(A);
    while (++B < A) G[B] = Q(B);
    return G
  }

  function ic8(A, Q) {
    return mc8(Q, function (B) {
      return A[B]
    })
  }

  function nc8(A, Q) {
    return function (B) {
      return A(Q(B))
    }
  }
  var g81 = Object.prototype,
    p70 = g81.hasOwnProperty,
    u81 = g81.toString,
    ac8 = g81.propertyIsEnumerable,
    oc8 = nc8(Object.keys, Object),
    rc8 = Math.max;

  function sc8(A, Q) {
    var B = _aB(A) || Bp8(A) ? lc8(A.length, String) : [],
      G = B.length,
      Z = !!G;
    for (var Y in A)
      if ((Q || p70.call(A, Y)) && !(Z && (Y == "length" || ec8(Y, G)))) B.push(Y);
    return B
  }

  function tc8(A) {
    if (!Ap8(A)) return oc8(A);
    var Q = [];
    for (var B in Object(A))
      if (p70.call(A, B) && B != "constructor") Q.push(B);
    return Q
  }

  function ec8(A, Q) {
    return Q = Q == null ? RaB : Q, !!Q && (typeof A == "number" || gc8.test(A)) && (A > -1 && A % 1 == 0 && A < Q)
  }

  function Ap8(A) {
    var Q = A && A.constructor,
      B = typeof Q == "function" && Q.prototype || g81;
    return A === B
  }

  function Qp8(A, Q, B, G) {
    A = l70(A) ? A : Vp8(A), B = B && !G ? Dp8(B) : 0;
    var Z = A.length;
    if (B < 0) B = rc8(Z + B, 0);
    return Jp8(A) ? B <= Z && A.indexOf(Q, B) > -1 : !!Z && cc8(A, Q, B) > -1
  }

  function Bp8(A) {
    return Gp8(A) && p70.call(A, "callee") && (!ac8.call(A, "callee") || u81.call(A) == Pc8)
  }
  var _aB = Array.isArray;

  function l70(A) {
    return A != null && Yp8(A.length) && !Zp8(A)
  }

  function Gp8(A) {
    return i70(A) && l70(A)
  }

  function Zp8(A) {
    var Q = c70(A) ? u81.call(A) : "";
    return Q == Sc8 || Q == xc8
  }

  function Yp8(A) {
    return typeof A == "number" && A > -1 && A % 1 == 0 && A <= RaB
  }

  function c70(A) {
    var Q = typeof A;
    return !!A && (Q == "object" || Q == "function")
  }

  function i70(A) {
    return !!A && typeof A == "object"
  }

  function Jp8(A) {
    return typeof A == "string" || !_aB(A) && i70(A) && u81.call(A) == yc8
  }

  function Xp8(A) {
    return typeof A == "symbol" || i70(A) && u81.call(A) == vc8
  }

  function Ip8(A) {
    if (!A) return A === 0 ? A : 0;
    if (A = Wp8(A), A === OaB || A === -OaB) {
      var Q = A < 0 ? -1 : 1;
      return Q * Tc8
    }
    return A === A ? A : 0
  }

  function Dp8(A) {
    var Q = Ip8(A),
      B = Q % 1;
    return Q === Q ? B ? Q - B : Q : 0
  }

  function Wp8(A) {
    if (typeof A == "number") return A;
    if (Xp8(A)) return MaB;
    if (c70(A)) {
      var Q = typeof A.valueOf == "function" ? A.valueOf() : A;
      A = c70(Q) ? Q + "" : Q
    }
    if (typeof A != "string") return A === 0 ? A : +A;
    A = A.replace(kc8, "");
    var B = fc8.test(A);
    return B || hc8.test(A) ? uc8(A.slice(2), B ? 2 : 8) : bc8.test(A) ? MaB : +A
  }

  function Kp8(A) {
    return l70(A) ? sc8(A) : tc8(A)
  }

  function Vp8(A) {
    return A ? ic8(A, Kp8(A)) : []
  }
  jaB.exports = Qp8
})
// @from(Ln 237012, Col 4)
SaB = U((G9Z, PaB) => {
  var Fp8 = "[object Boolean]",
    Hp8 = Object.prototype,
    Ep8 = Hp8.toString;

  function zp8(A) {
    return A === !0 || A === !1 || $p8(A) && Ep8.call(A) == Fp8
  }

  function $p8(A) {
    return !!A && typeof A == "object"
  }
  PaB.exports = zp8
})
// @from(Ln 237026, Col 4)
baB = U((Z9Z, kaB) => {
  var xaB = 1 / 0,
    Cp8 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
    yaB = NaN,
    Up8 = "[object Symbol]",
    qp8 = /^\s+|\s+$/g,
    Np8 = /^[-+]0x[0-9a-f]+$/i,
    wp8 = /^0b[01]+$/i,
    Lp8 = /^0o[0-7]+$/i,
    Op8 = parseInt,
    Mp8 = Object.prototype,
    Rp8 = Mp8.toString;

  function _p8(A) {
    return typeof A == "number" && A == Sp8(A)
  }

  function vaB(A) {
    var Q = typeof A;
    return !!A && (Q == "object" || Q == "function")
  }

  function jp8(A) {
    return !!A && typeof A == "object"
  }

  function Tp8(A) {
    return typeof A == "symbol" || jp8(A) && Rp8.call(A) == Up8
  }

  function Pp8(A) {
    if (!A) return A === 0 ? A : 0;
    if (A = xp8(A), A === xaB || A === -xaB) {
      var Q = A < 0 ? -1 : 1;
      return Q * Cp8
    }
    return A === A ? A : 0
  }

  function Sp8(A) {
    var Q = Pp8(A),
      B = Q % 1;
    return Q === Q ? B ? Q - B : Q : 0
  }

  function xp8(A) {
    if (typeof A == "number") return A;
    if (Tp8(A)) return yaB;
    if (vaB(A)) {
      var Q = typeof A.valueOf == "function" ? A.valueOf() : A;
      A = vaB(Q) ? Q + "" : Q
    }
    if (typeof A != "string") return A === 0 ? A : +A;
    A = A.replace(qp8, "");
    var B = wp8.test(A);
    return B || Lp8.test(A) ? Op8(A.slice(2), B ? 2 : 8) : Np8.test(A) ? yaB : +A
  }
  kaB.exports = _p8
})
// @from(Ln 237085, Col 4)
haB = U((Y9Z, faB) => {
  var yp8 = "[object Number]",
    vp8 = Object.prototype,
    kp8 = vp8.toString;

  function bp8(A) {
    return !!A && typeof A == "object"
  }

  function fp8(A) {
    return typeof A == "number" || bp8(A) && kp8.call(A) == yp8
  }
  faB.exports = fp8
})
// @from(Ln 237099, Col 4)
daB = U((J9Z, maB) => {
  var hp8 = "[object Object]";

  function gp8(A) {
    var Q = !1;
    if (A != null && typeof A.toString != "function") try {
      Q = !!(A + "")
    } catch (B) {}
    return Q
  }

  function up8(A, Q) {
    return function (B) {
      return A(Q(B))
    }
  }
  var mp8 = Function.prototype,
    gaB = Object.prototype,
    uaB = mp8.toString,
    dp8 = gaB.hasOwnProperty,
    cp8 = uaB.call(Object),
    pp8 = gaB.toString,
    lp8 = up8(Object.getPrototypeOf, Object);

  function ip8(A) {
    return !!A && typeof A == "object"
  }

  function np8(A) {
    if (!ip8(A) || pp8.call(A) != hp8 || gp8(A)) return !1;
    var Q = lp8(A);
    if (Q === null) return !0;
    var B = dp8.call(Q, "constructor") && Q.constructor;
    return typeof B == "function" && B instanceof B && uaB.call(B) == cp8
  }
  maB.exports = np8
})
// @from(Ln 237136, Col 4)
paB = U((X9Z, caB) => {
  var ap8 = "[object String]",
    op8 = Object.prototype,
    rp8 = op8.toString,
    sp8 = Array.isArray;

  function tp8(A) {
    return !!A && typeof A == "object"
  }

  function ep8(A) {
    return typeof A == "string" || !sp8(A) && tp8(A) && rp8.call(A) == ap8
  }
  caB.exports = ep8
})
// @from(Ln 237151, Col 4)
oaB = U((I9Z, aaB) => {
  var Al8 = "Expected a function",
    laB = 1 / 0,
    Ql8 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
    iaB = NaN,
    Bl8 = "[object Symbol]",
    Gl8 = /^\s+|\s+$/g,
    Zl8 = /^[-+]0x[0-9a-f]+$/i,
    Yl8 = /^0b[01]+$/i,
    Jl8 = /^0o[0-7]+$/i,
    Xl8 = parseInt,
    Il8 = Object.prototype,
    Dl8 = Il8.toString;

  function Wl8(A, Q) {
    var B;
    if (typeof Q != "function") throw TypeError(Al8);
    return A = El8(A),
      function () {
        if (--A > 0) B = Q.apply(this, arguments);
        if (A <= 1) Q = void 0;
        return B
      }
  }

  function Kl8(A) {
    return Wl8(2, A)
  }

  function naB(A) {
    var Q = typeof A;
    return !!A && (Q == "object" || Q == "function")
  }

  function Vl8(A) {
    return !!A && typeof A == "object"
  }

  function Fl8(A) {
    return typeof A == "symbol" || Vl8(A) && Dl8.call(A) == Bl8
  }

  function Hl8(A) {
    if (!A) return A === 0 ? A : 0;
    if (A = zl8(A), A === laB || A === -laB) {
      var Q = A < 0 ? -1 : 1;
      return Q * Ql8
    }
    return A === A ? A : 0
  }

  function El8(A) {
    var Q = Hl8(A),
      B = Q % 1;
    return Q === Q ? B ? Q - B : Q : 0
  }

  function zl8(A) {
    if (typeof A == "number") return A;
    if (Fl8(A)) return iaB;
    if (naB(A)) {
      var Q = typeof A.valueOf == "function" ? A.valueOf() : A;
      A = naB(Q) ? Q + "" : Q
    }
    if (typeof A != "string") return A === 0 ? A : +A;
    A = A.replace(Gl8, "");
    var B = Yl8.test(A);
    return B || Jl8.test(A) ? Xl8(A.slice(2), B ? 2 : 8) : Zl8.test(A) ? iaB : +A
  }
  aaB.exports = Kl8
})
// @from(Ln 237222, Col 4)
ZoB = U((D9Z, GoB) => {
  var raB = O70(),
    $l8 = u70(),
    Cl8 = g70(),
    saB = w81(),
    Ul8 = TaB(),
    m81 = SaB(),
    taB = baB(),
    n70 = haB(),
    AoB = daB(),
    uo = paB(),
    ql8 = oaB(),
    {
      KeyObject: Nl8,
      createSecretKey: wl8,
      createPrivateKey: Ll8
    } = NA("crypto"),
    QoB = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "HS256", "HS384", "HS512", "none"];
  if ($l8) QoB.splice(3, 0, "PS256", "PS384", "PS512");
  var Ol8 = {
      expiresIn: {
        isValid: function (A) {
          return taB(A) || uo(A) && A
        },
        message: '"expiresIn" should be a number of seconds or string representing a timespan'
      },
      notBefore: {
        isValid: function (A) {
          return taB(A) || uo(A) && A
        },
        message: '"notBefore" should be a number of seconds or string representing a timespan'
      },
      audience: {
        isValid: function (A) {
          return uo(A) || Array.isArray(A)
        },
        message: '"audience" must be a string or array'
      },
      algorithm: {
        isValid: Ul8.bind(null, QoB),
        message: '"algorithm" must be a valid string enum value'
      },
      header: {
        isValid: AoB,
        message: '"header" must be an object'
      },
      encoding: {
        isValid: uo,
        message: '"encoding" must be a string'
      },
      issuer: {
        isValid: uo,
        message: '"issuer" must be a string'
      },
      subject: {
        isValid: uo,
        message: '"subject" must be a string'
      },
      jwtid: {
        isValid: uo,
        message: '"jwtid" must be a string'
      },
      noTimestamp: {
        isValid: m81,
        message: '"noTimestamp" must be a boolean'
      },
      keyid: {
        isValid: uo,
        message: '"keyid" must be a string'
      },
      mutatePayload: {
        isValid: m81,
        message: '"mutatePayload" must be a boolean'
      },
      allowInsecureKeySizes: {
        isValid: m81,
        message: '"allowInsecureKeySizes" must be a boolean'
      },
      allowInvalidAsymmetricKeyTypes: {
        isValid: m81,
        message: '"allowInvalidAsymmetricKeyTypes" must be a boolean'
      }
    },
    Ml8 = {
      iat: {
        isValid: n70,
        message: '"iat" should be a number of seconds'
      },
      exp: {
        isValid: n70,
        message: '"exp" should be a number of seconds'
      },
      nbf: {
        isValid: n70,
        message: '"nbf" should be a number of seconds'
      }
    };

  function BoB(A, Q, B, G) {
    if (!AoB(B)) throw Error('Expected "' + G + '" to be a plain object.');
    Object.keys(B).forEach(function (Z) {
      let Y = A[Z];
      if (!Y) {
        if (!Q) throw Error('"' + Z + '" is not allowed in "' + G + '"');
        return
      }
      if (!Y.isValid(B[Z])) throw Error(Y.message)
    })
  }

  function Rl8(A) {
    return BoB(Ol8, !1, A, "options")
  }

  function _l8(A) {
    return BoB(Ml8, !0, A, "payload")
  }
  var eaB = {
      audience: "aud",
      issuer: "iss",
      subject: "sub",
      jwtid: "jti"
    },
    jl8 = ["expiresIn", "notBefore", "noTimestamp", "audience", "issuer", "subject", "jwtid"];
  GoB.exports = function (A, Q, B, G) {
    if (typeof B === "function") G = B, B = {};
    else B = B || {};
    let Z = typeof A === "object" && !Buffer.isBuffer(A),
      Y = Object.assign({
        alg: B.algorithm || "HS256",
        typ: Z ? "JWT" : void 0,
        kid: B.keyid
      }, B.header);

    function J(D) {
      if (G) return G(D);
      throw D
    }
    if (!Q && B.algorithm !== "none") return J(Error("secretOrPrivateKey must have a value"));
    if (Q != null && !(Q instanceof Nl8)) try {
      Q = Ll8(Q)
    } catch (D) {
      try {
        Q = wl8(typeof Q === "string" ? Buffer.from(Q) : Q)
      } catch (W) {
        return J(Error("secretOrPrivateKey is not valid key material"))
      }
    }
    if (Y.alg.startsWith("HS") && Q.type !== "secret") return J(Error(`secretOrPrivateKey must be a symmetric key when using ${Y.alg}`));
    else if (/^(?:RS|PS|ES)/.test(Y.alg)) {
      if (Q.type !== "private") return J(Error(`secretOrPrivateKey must be an asymmetric key when using ${Y.alg}`));
      if (!B.allowInsecureKeySizes && !Y.alg.startsWith("ES") && Q.asymmetricKeyDetails !== void 0 && Q.asymmetricKeyDetails.modulusLength < 2048) return J(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${Y.alg}`))
    }
    if (typeof A > "u") return J(Error("payload is required"));
    else if (Z) {
      try {
        _l8(A)
      } catch (D) {
        return J(D)
      }
      if (!B.mutatePayload) A = Object.assign({}, A)
    } else {
      let D = jl8.filter(function (W) {
        return typeof B[W] < "u"
      });
      if (D.length > 0) return J(Error("invalid " + D.join(",") + " option for " + typeof A + " payload"))
    }
    if (typeof A.exp < "u" && typeof B.expiresIn < "u") return J(Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
    if (typeof A.nbf < "u" && typeof B.notBefore < "u") return J(Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
    try {
      Rl8(B)
    } catch (D) {
      return J(D)
    }
    if (!B.allowInvalidAsymmetricKeyTypes) try {
      Cl8(Y.alg, Q)
    } catch (D) {
      return J(D)
    }
    let X = A.iat || Math.floor(Date.now() / 1000);
    if (B.noTimestamp) delete A.iat;
    else if (Z) A.iat = X;
    if (typeof B.notBefore < "u") {
      try {
        A.nbf = raB(B.notBefore, X)
      } catch (D) {
        return J(D)
      }
      if (typeof A.nbf > "u") return J(Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
    }
    if (typeof B.expiresIn < "u" && typeof A === "object") {
      try {
        A.exp = raB(B.expiresIn, X)
      } catch (D) {
        return J(D)
      }
      if (typeof A.exp > "u") return J(Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
    }
    Object.keys(eaB).forEach(function (D) {
      let W = eaB[D];
      if (typeof B[D] < "u") {
        if (typeof A[W] < "u") return J(Error('Bad "options.' + D + '" option. The payload already has an "' + W + '" property.'));
        A[W] = B[D]
      }
    });
    let I = B.encoding || "utf8";
    if (typeof G === "function") G = G && ql8(G), saB.createSign({
      header: Y,
      privateKey: Q,
      payload: A,
      encoding: I
    }).once("error", G).once("done", function (D) {
      if (!B.allowInsecureKeySizes && /^(?:RS|PS)/.test(Y.alg) && D.length < 256) return G(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${Y.alg}`));
      G(null, D)
    });
    else {
      let D = saB.sign({
        header: Y,
        payload: A,
        secret: Q,
        encoding: I
      });
      if (!B.allowInsecureKeySizes && /^(?:RS|PS)/.test(Y.alg) && D.length < 256) throw Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${Y.alg}`);
      return D
    }
  }
})
// @from(Ln 237449, Col 4)
JoB = U((W9Z, YoB) => {
  YoB.exports = {
    decode: N70(),
    verify: LaB(),
    sign: ZoB(),
    JsonWebTokenError: ZSA(),
    NotBeforeError: w70(),
    TokenExpiredError: L70()
  }
})
// @from(Ln 237459, Col 0)
class YS {
  static fromAssertion(A) {
    let Q = new YS;
    return Q.jwt = A, Q
  }
  static fromCertificate(A, Q, B) {
    let G = new YS;
    if (G.privateKey = Q, G.thumbprint = A, G.useSha256 = !1, B) G.publicCertificate = this.parseCertificate(B);
    return G
  }
  static fromCertificateWithSha256Thumbprint(A, Q, B) {
    let G = new YS;
    if (G.privateKey = Q, G.thumbprint = A, G.useSha256 = !0, B) G.publicCertificate = this.parseCertificate(B);
    return G
  }
  getJwt(A, Q, B) {
    if (this.privateKey && this.thumbprint) {
      if (this.jwt && !this.isExpired() && Q === this.issuer && B === this.jwtAudience) return this.jwt;
      return this.createJwt(A, Q, B)
    }
    if (this.jwt) return this.jwt;
    throw YQ(xZ.invalidAssertion)
  }
  createJwt(A, Q, B) {
    this.issuer = Q, this.jwtAudience = B;
    let G = LJ.nowSeconds();
    this.expirationTime = G + 600;
    let Y = {
        alg: this.useSha256 ? w_.PSS_256 : w_.RSA_256
      },
      J = this.useSha256 ? w_.X5T_256 : w_.X5T;
    if (Object.assign(Y, {
        [J]: EN.base64EncodeUrl(this.thumbprint, aH.HEX)
      }), this.publicCertificate) Object.assign(Y, {
      [w_.X5C]: this.publicCertificate
    });
    let X = {
      [w_.AUDIENCE]: this.jwtAudience,
      [w_.EXPIRATION_TIME]: this.expirationTime,
      [w_.ISSUER]: this.issuer,
      [w_.SUBJECT]: this.issuer,
      [w_.NOT_BEFORE]: G,
      [w_.JWT_ID]: A.createNewGuid()
    };
    return this.jwt = XoB.default.sign(X, this.privateKey, {
      header: Y
    }), this.jwt
  }
  isExpired() {
    return this.expirationTime < LJ.nowSeconds()
  }
  static parseCertificate(A) {
    let Q = /-----BEGIN CERTIFICATE-----\r*\n(.+?)\r*\n-----END CERTIFICATE-----/gs,
      B = [],
      G;
    while ((G = Q.exec(A)) !== null) B.push(G[1].replace(/\r*\n/g, m0.EMPTY_STRING));
    return B
  }
}
// @from(Ln 237518, Col 4)
XoB
// @from(Ln 237519, Col 4)
d81 = w(() => {
  xG();
  tPA();
  MJ();
  XoB = c(JoB(), 1); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 237525, Col 4)
c81 = "@azure/msal-node"
// @from(Ln 237526, Col 2)
JS = "3.8.1"
// @from(Ln 237527, Col 4)
iWA = w(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 237530, Col 4)
FSA
// @from(Ln 237531, Col 4)
a70 = w(() => {
  xG(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  FSA = class FSA extends kz {
    constructor(A) {
      super(A)
    }
    async acquireToken(A) {
      this.logger.info("in acquireToken call in username-password client");
      let Q = LJ.nowSeconds(),
        B = await this.executeTokenRequest(this.authority, A),
        G = new oI(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return G.validateTokenResponse(B.body), G.handleServerTokenResponse(B.body, this.authority, Q, A)
    }
    async executeTokenRequest(A, Q) {
      let B = this.createTokenQueryParameters(Q),
        G = U3.appendQueryString(A.tokenEndpoint, B),
        Z = await this.createTokenRequestBody(Q),
        Y = this.createTokenRequestHeaders({
          credential: Q.username,
          type: PC.UPN
        }),
        J = {
          clientId: this.config.authOptions.clientId,
          authority: A.canonicalAuthority,
          scopes: Q.scopes,
          claims: Q.claims,
          authenticationScheme: Q.authenticationScheme,
          resourceRequestMethod: Q.resourceRequestMethod,
          resourceRequestUri: Q.resourceRequestUri,
          shrClaims: Q.shrClaims,
          sshKid: Q.sshKid
        };
      return this.executePostToTokenEndpoint(G, Z, Y, J, Q.correlationId)
    }
    async createTokenRequestBody(A) {
      let Q = new Map;
      if (E2.addClientId(Q, this.config.authOptions.clientId), E2.addUsername(Q, A.username), E2.addPassword(Q, A.password), E2.addScopes(Q, A.scopes), E2.addResponseType(Q, UWA.IDTOKEN_TOKEN), E2.addGrantType(Q, VN.RESOURCE_OWNER_PASSWORD_GRANT), E2.addClientInfo(Q), E2.addLibraryInfo(Q, this.config.libraryInfo), E2.addApplicationTelemetry(Q, this.config.telemetry.application), E2.addThrottling(Q), this.serverTelemetryManager) E2.addServerTelemetry(Q, this.serverTelemetryManager);
      let B = A.correlationId || this.config.cryptoInterface.createNewGuid();
      if (E2.addCorrelationId(Q, B), this.config.clientCredentials.clientSecret) E2.addClientSecret(Q, this.config.clientCredentials.clientSecret);
      let G = this.config.clientCredentials.clientAssertion;
      if (G) E2.addClientAssertion(Q, await yC(G.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), E2.addClientAssertionType(Q, G.assertionType);
      if (!JY.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) E2.addClaims(Q, A.claims, this.config.authOptions.clientCapabilities);
      if (this.config.systemOptions.preventCorsPreflight && A.username) E2.addCcsUpn(Q, A.username);
      return oH.mapToQueryString(Q)
    }
  }
})
// @from(Ln 237579, Col 0)
function IoB(A, Q, B, G) {
  let Z = pPA.getStandardAuthorizeRequestParameters({
    ...A.auth,
    authority: Q,
    redirectUri: B.redirectUri || ""
  }, B, G);
  if (E2.addLibraryInfo(Z, {
      sku: vC.MSAL_SKU,
      version: JS,
      cpu: process.arch || "",
      os: process.platform || ""
    }), A.auth.protocolMode !== vz.OIDC) E2.addApplicationTelemetry(Z, A.telemetry.application);
  if (E2.addResponseType(Z, UWA.CODE), B.codeChallenge && B.codeChallengeMethod) E2.addCodeChallengeParams(Z, B.codeChallenge, B.codeChallengeMethod);
  return E2.addExtraQueryParameters(Z, B.extraQueryParameters || {}), pPA.getAuthorizeUrl(Q, Z, A.auth.encodeExtraQueryParams, B.extraQueryParameters)
}
// @from(Ln 237594, Col 4)
DoB = w(() => {
  xG();
  MJ();
  iWA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 237599, Col 0)
class F9A {
  constructor(A) {
    this.config = ppB(A), this.cryptoProvider = new om, this.logger = new FN(this.config.system.loggerOptions, c81, JS), this.storage = new K9A(this.logger, this.config.auth.clientId, this.cryptoProvider, c50(this.config.auth)), this.tokenCache = new QSA(this.storage, this.logger, this.config.cache.cachePlugin)
  }
  async getAuthCodeUrl(A) {
    this.logger.info("getAuthCodeUrl called", A.correlationId);
    let Q = {
        ...A,
        ...await this.initializeBaseRequest(A),
        responseMode: A.responseMode || ak.QUERY,
        authenticationScheme: J5.BEARER,
        state: A.state || "",
        nonce: A.nonce || ""
      },
      B = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions);
    return IoB(this.config, B, Q, this.logger)
  }
  async acquireTokenByCode(A, Q) {
    if (this.logger.info("acquireTokenByCode called"), A.state && Q) this.logger.info("acquireTokenByCode - validating state"), this.validateState(A.state, Q.state || ""), Q = {
      ...Q,
      state: ""
    };
    let B = {
        ...A,
        ...await this.initializeBaseRequest(A),
        authenticationScheme: J5.BEARER
      },
      G = this.initializeServerTelemetryManager(nm.acquireTokenByCode, B.correlationId);
    try {
      let Z = await this.createAuthority(B.authority, B.correlationId, void 0, A.azureCloudOptions),
        Y = await this.buildOauthClientConfiguration(Z, B.correlationId, B.redirectUri, G),
        J = new t31(Y);
      return this.logger.verbose("Auth code client created", B.correlationId), await J.acquireToken(B, Q)
    } catch (Z) {
      if (Z instanceof n6) Z.setCorrelationId(B.correlationId);
      throw G.cacheFailedRequest(Z), Z
    }
  }
  async acquireTokenByRefreshToken(A) {
    this.logger.info("acquireTokenByRefreshToken called", A.correlationId);
    let Q = {
        ...A,
        ...await this.initializeBaseRequest(A),
        authenticationScheme: J5.BEARER
      },
      B = this.initializeServerTelemetryManager(nm.acquireTokenByRefreshToken, Q.correlationId);
    try {
      let G = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
        Z = await this.buildOauthClientConfiguration(G, Q.correlationId, Q.redirectUri || "", B),
        Y = new gWA(Z);
      return this.logger.verbose("Refresh token client created", Q.correlationId), await Y.acquireToken(Q)
    } catch (G) {
      if (G instanceof n6) G.setCorrelationId(Q.correlationId);
      throw B.cacheFailedRequest(G), G
    }
  }
  async acquireTokenSilent(A) {
    let Q = {
        ...A,
        ...await this.initializeBaseRequest(A),
        forceRefresh: A.forceRefresh || !1
      },
      B = this.initializeServerTelemetryManager(nm.acquireTokenSilent, Q.correlationId, Q.forceRefresh);
    try {
      let G = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
        Z = await this.buildOauthClientConfiguration(G, Q.correlationId, Q.redirectUri || "", B),
        Y = new e31(Z);
      this.logger.verbose("Silent flow client created", Q.correlationId);
      try {
        return await this.tokenCache.overwriteCache(), await this.acquireCachedTokenSilent(Q, Y, Z)
      } catch (J) {
        if (J instanceof _o && J.errorCode === xZ.tokenRefreshRequired) return new gWA(Z).acquireTokenByRefreshToken(Q);
        throw J
      }
    } catch (G) {
      if (G instanceof n6) G.setCorrelationId(Q.correlationId);
      throw B.cacheFailedRequest(G), G
    }
  }
  async acquireCachedTokenSilent(A, Q, B) {
    let [G, Z] = await Q.acquireCachedToken({
      ...A,
      scopes: A.scopes?.length ? A.scopes : [...yz]
    });
    if (Z === YY.PROACTIVELY_REFRESHED) {
      this.logger.info("ClientApplication:acquireCachedTokenSilent - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
      let Y = new gWA(B);
      try {
        await Y.acquireTokenByRefreshToken(A)
      } catch {}
    }
    return G
  }
  async acquireTokenByUsernamePassword(A) {
    this.logger.info("acquireTokenByUsernamePassword called", A.correlationId);
    let Q = {
        ...A,
        ...await this.initializeBaseRequest(A)
      },
      B = this.initializeServerTelemetryManager(nm.acquireTokenByUsernamePassword, Q.correlationId);
    try {
      let G = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
        Z = await this.buildOauthClientConfiguration(G, Q.correlationId, "", B),
        Y = new FSA(Z);
      return this.logger.verbose("Username password client created", Q.correlationId), await Y.acquireToken(Q)
    } catch (G) {
      if (G instanceof n6) G.setCorrelationId(Q.correlationId);
      throw B.cacheFailedRequest(G), G
    }
  }
  getTokenCache() {
    return this.logger.info("getTokenCache called"), this.tokenCache
  }
  validateState(A, Q) {
    if (!A) throw MX.createStateNotFoundError();
    if (A !== Q) throw YQ(xZ.stateMismatch)
  }
  getLogger() {
    return this.logger
  }
  setLogger(A) {
    this.logger = A
  }
  async buildOauthClientConfiguration(A, Q, B, G) {
    return this.logger.verbose("buildOauthClientConfiguration called", Q), this.logger.info(`Building oauth client configuration with the following authority: ${A.tokenEndpoint}.`, Q), G?.updateRegionDiscoveryMetadata(A.regionDiscoveryMetadata), {
      authOptions: {
        clientId: this.config.auth.clientId,
        authority: A,
        clientCapabilities: this.config.auth.clientCapabilities,
        redirectUri: B
      },
      loggerOptions: {
        logLevel: this.config.system.loggerOptions.logLevel,
        loggerCallback: this.config.system.loggerOptions.loggerCallback,
        piiLoggingEnabled: this.config.system.loggerOptions.piiLoggingEnabled,
        correlationId: Q
      },
      cacheOptions: {
        claimsBasedCachingEnabled: this.config.cache.claimsBasedCachingEnabled
      },
      cryptoInterface: this.cryptoProvider,
      networkInterface: this.config.system.networkClient,
      storageInterface: this.storage,
      serverTelemetryManager: G,
      clientCredentials: {
        clientSecret: this.clientSecret,
        clientAssertion: await this.getClientAssertion(A)
      },
      libraryInfo: {
        sku: vC.MSAL_SKU,
        version: JS,
        cpu: process.arch || m0.EMPTY_STRING,
        os: process.platform || m0.EMPTY_STRING
      },
      telemetry: this.config.telemetry,
      persistencePlugin: this.config.cache.cachePlugin,
      serializableCache: this.tokenCache
    }
  }
  async getClientAssertion(A) {
    if (this.developerProvidedClientAssertion) this.clientAssertion = YS.fromAssertion(await yC(this.developerProvidedClientAssertion, this.config.auth.clientId, A.tokenEndpoint));
    return this.clientAssertion && {
      assertion: this.clientAssertion.getJwt(this.cryptoProvider, this.config.auth.clientId, A.tokenEndpoint),
      assertionType: vC.JWT_BEARER_ASSERTION_TYPE
    }
  }
  async initializeBaseRequest(A) {
    if (this.logger.verbose("initializeRequestScopes called", A.correlationId), A.authenticationScheme && A.authenticationScheme === J5.POP) this.logger.verbose("Authentication Scheme 'pop' is not supported yet, setting Authentication Scheme to 'Bearer' for request", A.correlationId);
    if (A.authenticationScheme = J5.BEARER, this.config.cache.claimsBasedCachingEnabled && A.claims && !JY.isEmptyObj(A.claims)) A.requestedClaimsHash = await this.cryptoProvider.hashString(A.claims);
    return {
      ...A,
      scopes: [...A && A.scopes || [], ...yz],
      correlationId: A && A.correlationId || this.cryptoProvider.createNewGuid(),
      authority: A.authority || this.config.auth.authority
    }
  }
  initializeServerTelemetryManager(A, Q, B) {
    let G = {
      clientId: this.config.auth.clientId,
      correlationId: Q,
      apiId: A,
      forceRefresh: B || !1
    };
    return new fo(G, this.storage)
  }
  async createAuthority(A, Q, B, G) {
    this.logger.verbose("createAuthority called", Q);
    let Z = sK.generateAuthority(A, G || this.config.auth.azureCloudOptions),
      Y = {
        protocolMode: this.config.auth.protocolMode,
        knownAuthorities: this.config.auth.knownAuthorities,
        cloudDiscoveryMetadata: this.config.auth.cloudDiscoveryMetadata,
        authorityMetadata: this.config.auth.authorityMetadata,
        azureRegionConfiguration: B,
        skipAuthorityMetadataCache: this.config.auth.skipAuthorityMetadataCache
      };
    return u31.createDiscoveredInstance(Z, this.config.system.networkClient, this.storage, Y, this.logger, Q)
  }
  clearCache() {
    this.storage.clear()
  }
}
// @from(Ln 237801, Col 4)
p81 = w(() => {
  xG();
  Z70();
  ePA();
  $81();
  MJ();
  F70();
  d81();
  iWA();
  aPA();
  a70();
  DoB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 237815, Col 0)
class o70 {
  async listenForAuthCode(A, Q) {
    if (this.server) throw MX.createLoopbackServerAlreadyExistsError();
    return new Promise((B, G) => {
      this.server = Tl8.createServer((Z, Y) => {
        let J = Z.url;
        if (!J) {
          Y.end(Q || "Error occurred loading redirectUrl"), G(MX.createUnableToLoadRedirectUrlError());
          return
        } else if (J === m0.FORWARD_SLASH) {
          Y.end(A || "Auth code was successfully acquired. You can close this window now.");
          return
        }
        let X = this.getRedirectUri(),
          I = new URL(J, X),
          D = oH.getDeserializedResponse(I.search) || {};
        if (D.code) Y.writeHead(i6.REDIRECT, {
          location: X
        }), Y.end();
        if (D.error) Y.end(Q || `Error occurred: ${D.error}`);
        B(D)
      }), this.server.listen(0, "127.0.0.1")
    })
  }
  getRedirectUri() {
    if (!this.server || !this.server.listening) throw MX.createNoLoopbackServerExistsError();
    let A = this.server.address();
    if (!A || typeof A === "string" || !A.port) throw this.closeServer(), MX.createInvalidLoopbackAddressTypeError();
    let Q = A && A.port;
    return `${vC.HTTP_PROTOCOL}${vC.LOCALHOST}:${Q}`
  }
  closeServer() {
    if (this.server) {
      if (this.server.close(), typeof this.server.closeAllConnections === "function") this.server.closeAllConnections();
      this.server.unref(), this.server = void 0
    }
  }
}
// @from(Ln 237853, Col 4)
WoB = w(() => {
  xG();
  aPA();
  MJ(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 237858, Col 4)
HSA
// @from(Ln 237859, Col 4)
r70 = w(() => {
  xG(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  HSA = class HSA extends kz {
    constructor(A) {
      super(A)
    }
    async acquireToken(A) {
      let Q = await this.getDeviceCode(A);
      A.deviceCodeCallback(Q);
      let B = LJ.nowSeconds(),
        G = await this.acquireTokenWithDeviceCode(A, Q),
        Z = new oI(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return Z.validateTokenResponse(G), Z.handleServerTokenResponse(G, this.authority, B, A)
    }
    async getDeviceCode(A) {
      let Q = this.createExtraQueryParameters(A),
        B = U3.appendQueryString(this.authority.deviceCodeEndpoint, Q),
        G = this.createQueryString(A),
        Z = this.createTokenRequestHeaders(),
        Y = {
          clientId: this.config.authOptions.clientId,
          authority: A.authority,
          scopes: A.scopes,
          claims: A.claims,
          authenticationScheme: A.authenticationScheme,
          resourceRequestMethod: A.resourceRequestMethod,
          resourceRequestUri: A.resourceRequestUri,
          shrClaims: A.shrClaims,
          sshKid: A.sshKid
        };
      return this.executePostRequestToDeviceCodeEndpoint(B, G, Z, Y, A.correlationId)
    }
    createExtraQueryParameters(A) {
      let Q = new Map;
      if (A.extraQueryParameters) E2.addExtraQueryParameters(Q, A.extraQueryParameters);
      return oH.mapToQueryString(Q)
    }
    async executePostRequestToDeviceCodeEndpoint(A, Q, B, G, Z) {
      let {
        body: {
          user_code: Y,
          device_code: J,
          verification_uri: X,
          expires_in: I,
          interval: D,
          message: W
        }
      } = await this.sendPostRequest(G, A, {
        body: Q,
        headers: B
      }, Z);
      return {
        userCode: Y,
        deviceCode: J,
        verificationUri: X,
        expiresIn: I,
        interval: D,
        message: W
      }
    }
    createQueryString(A) {
      let Q = new Map;
      if (E2.addScopes(Q, A.scopes), E2.addClientId(Q, this.config.authOptions.clientId), A.extraQueryParameters) E2.addExtraQueryParameters(Q, A.extraQueryParameters);
      if (A.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) E2.addClaims(Q, A.claims, this.config.authOptions.clientCapabilities);
      return oH.mapToQueryString(Q)
    }
    continuePolling(A, Q, B) {
      if (B) throw this.logger.error("Token request cancelled by setting DeviceCodeRequest.cancel = true"), YQ(xZ.deviceCodePollingCancelled);
      else if (Q && Q < A && LJ.nowSeconds() > Q) throw this.logger.error(`User defined timeout for device code polling reached. The timeout was set for ${Q}`), YQ(xZ.userTimeoutReached);
      else if (LJ.nowSeconds() > A) {
        if (Q) this.logger.verbose(`User specified timeout ignored as the device code has expired before the timeout elapsed. The user specified timeout was set for ${Q}`);
        throw this.logger.error(`Device code expired. Expiration time of device code was ${A}`), YQ(xZ.deviceCodeExpired)
      }
      return !0
    }
    async acquireTokenWithDeviceCode(A, Q) {
      let B = this.createTokenQueryParameters(A),
        G = U3.appendQueryString(this.authority.tokenEndpoint, B),
        Z = this.createTokenRequestBody(A, Q),
        Y = this.createTokenRequestHeaders(),
        J = A.timeout ? LJ.nowSeconds() + A.timeout : void 0,
        X = LJ.nowSeconds() + Q.expiresIn,
        I = Q.interval * 1000;
      while (this.continuePolling(X, J, A.cancel)) {
        let D = {
            clientId: this.config.authOptions.clientId,
            authority: A.authority,
            scopes: A.scopes,
            claims: A.claims,
            authenticationScheme: A.authenticationScheme,
            resourceRequestMethod: A.resourceRequestMethod,
            resourceRequestUri: A.resourceRequestUri,
            shrClaims: A.shrClaims,
            sshKid: A.sshKid
          },
          W = await this.executePostToTokenEndpoint(G, Z, Y, D, A.correlationId);
        if (W.body && W.body.error)
          if (W.body.error === m0.AUTHORIZATION_PENDING) this.logger.info("Authorization pending. Continue polling."), await LJ.delay(I);
          else throw this.logger.info("Unexpected error in polling from the server"), j80(wWA.postRequestFailed, W.body.error);
        else return this.logger.verbose("Authorization completed successfully. Polling stopped."), W.body
      }
      throw this.logger.error("Polling stopped for unknown reasons."), YQ(xZ.deviceCodeUnknownError)
    }
    createTokenRequestBody(A, Q) {
      let B = new Map;
      E2.addScopes(B, A.scopes), E2.addClientId(B, this.config.authOptions.clientId), E2.addGrantType(B, VN.DEVICE_CODE_GRANT), E2.addDeviceCode(B, Q.deviceCode);
      let G = A.correlationId || this.config.cryptoInterface.createNewGuid();
      if (E2.addCorrelationId(B, G), E2.addClientInfo(B), E2.addLibraryInfo(B, this.config.libraryInfo), E2.addApplicationTelemetry(B, this.config.telemetry.application), E2.addThrottling(B), this.serverTelemetryManager) E2.addServerTelemetry(B, this.serverTelemetryManager);
      if (!JY.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) E2.addClaims(B, A.claims, this.config.authOptions.clientCapabilities);
      return oH.mapToQueryString(B)
    }
  }
})
// @from(Ln 237972, Col 4)
ESA
// @from(Ln 237973, Col 4)
KoB = w(() => {
  MJ();
  xG();
  p81();
  aPA();
  WoB();
  r70();
  iWA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  ESA = class ESA extends F9A {
    constructor(A) {
      super(A);
      if (this.config.broker.nativeBrokerPlugin)
        if (this.config.broker.nativeBrokerPlugin.isBrokerAvailable) this.nativeBrokerPlugin = this.config.broker.nativeBrokerPlugin, this.nativeBrokerPlugin.setLogger(this.config.system.loggerOptions);
        else this.logger.warning("NativeBroker implementation was provided but the broker is unavailable.");
      this.skus = fo.makeExtraSkuString({
        libraryName: vC.MSAL_SKU,
        libraryVersion: JS
      })
    }
    async acquireTokenByDeviceCode(A) {
      this.logger.info("acquireTokenByDeviceCode called", A.correlationId);
      let Q = Object.assign(A, await this.initializeBaseRequest(A)),
        B = this.initializeServerTelemetryManager(nm.acquireTokenByDeviceCode, Q.correlationId);
      try {
        let G = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
          Z = await this.buildOauthClientConfiguration(G, Q.correlationId, "", B),
          Y = new HSA(Z);
        return this.logger.verbose("Device code client created", Q.correlationId), await Y.acquireToken(Q)
      } catch (G) {
        if (G instanceof n6) G.setCorrelationId(Q.correlationId);
        throw B.cacheFailedRequest(G), G
      }
    }
    async acquireTokenInteractive(A) {
      let Q = A.correlationId || this.cryptoProvider.createNewGuid();
      this.logger.trace("acquireTokenInteractive called", Q);
      let {
        openBrowser: B,
        successTemplate: G,
        errorTemplate: Z,
        windowHandle: Y,
        loopbackClient: J,
        ...X
      } = A;
      if (this.nativeBrokerPlugin) {
        let F = {
          ...X,
          clientId: this.config.auth.clientId,
          scopes: A.scopes || yz,
          redirectUri: A.redirectUri || "",
          authority: A.authority || this.config.auth.authority,
          correlationId: Q,
          extraParameters: {
            ...X.extraQueryParameters,
            ...X.tokenQueryParameters,
            [e2A.X_CLIENT_EXTRA_SKU]: this.skus
          },
          accountId: X.account?.nativeAccountId
        };
        return this.nativeBrokerPlugin.acquireTokenInteractive(F, Y)
      }
      if (A.redirectUri) {
        if (!this.config.broker.nativeBrokerPlugin) throw MX.createRedirectUriNotSupportedError();
        A.redirectUri = ""
      }
      let {
        verifier: I,
        challenge: D
      } = await this.cryptoProvider.generatePkceCodes(), W = J || new o70, K = {}, V = null;
      try {
        let F = W.listenForAuthCode(G, Z).then((L) => {
            K = L
          }).catch((L) => {
            V = L
          }),
          H = await this.waitForRedirectUri(W),
          E = {
            ...X,
            correlationId: Q,
            scopes: A.scopes || yz,
            redirectUri: H,
            responseMode: ak.QUERY,
            codeChallenge: D,
            codeChallengeMethod: V31.S256
          },
          z = await this.getAuthCodeUrl(E);
        if (await B(z), await F, V) throw V;
        if (K.error) throw new xC(K.error, K.error_description, K.suberror);
        else if (!K.code) throw MX.createNoAuthCodeInResponseError();
        let $ = K.client_info,
          O = {
            code: K.code,
            codeVerifier: I,
            clientInfo: $ || m0.EMPTY_STRING,
            ...E
          };
        return await this.acquireTokenByCode(O)
      } finally {
        W.closeServer()
      }
    }
    async acquireTokenSilent(A) {
      let Q = A.correlationId || this.cryptoProvider.createNewGuid();
      if (this.logger.trace("acquireTokenSilent called", Q), this.nativeBrokerPlugin) {
        let B = {
          ...A,
          clientId: this.config.auth.clientId,
          scopes: A.scopes || yz,
          redirectUri: A.redirectUri || "",
          authority: A.authority || this.config.auth.authority,
          correlationId: Q,
          extraParameters: {
            ...A.tokenQueryParameters,
            [e2A.X_CLIENT_EXTRA_SKU]: this.skus
          },
          accountId: A.account.nativeAccountId,
          forceRefresh: A.forceRefresh || !1
        };
        return this.nativeBrokerPlugin.acquireTokenSilent(B)
      }
      if (A.redirectUri) {
        if (!this.config.broker.nativeBrokerPlugin) throw MX.createRedirectUriNotSupportedError();
        A.redirectUri = ""
      }
      return super.acquireTokenSilent(A)
    }
    async signOut(A) {
      if (this.nativeBrokerPlugin && A.account.nativeAccountId) {
        let Q = {
          clientId: this.config.auth.clientId,
          accountId: A.account.nativeAccountId,
          correlationId: A.correlationId || this.cryptoProvider.createNewGuid()
        };
        await this.nativeBrokerPlugin.signOut(Q)
      }
      await this.getTokenCache().removeAccount(A.account, A.correlationId)
    }
    async getAllAccounts() {
      if (this.nativeBrokerPlugin) {
        let A = this.cryptoProvider.createNewGuid();
        return this.nativeBrokerPlugin.getAllAccounts(this.config.auth.clientId, A)
      }
      return this.getTokenCache().getAllAccounts()
    }
    async waitForRedirectUri(A) {
      return new Promise((Q, B) => {
        let G = 0,
          Z = setInterval(() => {
            if (G81.TIMEOUT_MS / G81.INTERVAL_MS < G) {
              clearInterval(Z), B(MX.createLoopbackServerTimeoutError());
              return
            }
            try {
              let Y = A.getRedirectUri();
              clearInterval(Z), Q(Y);
              return
            } catch (Y) {
              if (Y instanceof n6 && Y.errorCode === sW.noLoopbackServerExists.code) {
                G++;
                return
              }
              clearInterval(Z), B(Y);
              return
            }
          }, G81.INTERVAL_MS)
      })
    }
  }
})
// @from(Ln 238142, Col 4)
H9A
// @from(Ln 238143, Col 4)
l81 = w(() => {
  xG(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  H9A = class H9A extends kz {
    constructor(A, Q) {
      super(A);
      this.appTokenProvider = Q
    }
    async acquireToken(A) {
      if (A.skipCache || A.claims) return this.executeTokenRequest(A, this.authority);
      let [Q, B] = await this.getCachedAuthenticationResult(A, this.config, this.cryptoUtils, this.authority, this.cacheManager, this.serverTelemetryManager);
      if (Q) {
        if (B === YY.PROACTIVELY_REFRESHED) {
          this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
          let G = !0;
          await this.executeTokenRequest(A, this.authority, G)
        }
        return Q
      } else return this.executeTokenRequest(A, this.authority)
    }
    async getCachedAuthenticationResult(A, Q, B, G, Z, Y) {
      let J = Q,
        X = Q,
        I = YY.NOT_APPLICABLE,
        D;
      if (J.serializableCache && J.persistencePlugin) D = new N_(J.serializableCache, !1), await J.persistencePlugin.beforeCacheAccess(D);
      let W = this.readAccessTokenFromCache(G, X.managedIdentityId?.id || J.authOptions.clientId, new aI(A.scopes || []), Z, A.correlationId);
      if (J.serializableCache && J.persistencePlugin && D) await J.persistencePlugin.afterCacheAccess(D);
      if (!W) return Y?.setCacheOutcome(YY.NO_CACHED_ACCESS_TOKEN), [null, YY.NO_CACHED_ACCESS_TOKEN];
      if (LJ.isTokenExpired(W.expiresOn, J.systemOptions?.tokenRenewalOffsetSeconds || NWA)) return Y?.setCacheOutcome(YY.CACHED_ACCESS_TOKEN_EXPIRED), [null, YY.CACHED_ACCESS_TOKEN_EXPIRED];
      if (W.refreshOn && LJ.isTokenExpired(W.refreshOn.toString(), 0)) I = YY.PROACTIVELY_REFRESHED, Y?.setCacheOutcome(YY.PROACTIVELY_REFRESHED);
      return [await oI.generateAuthenticationResult(B, G, {
        account: null,
        idToken: null,
        accessToken: W,
        refreshToken: null,
        appMetadata: null
      }, !0, A), I]
    }
    readAccessTokenFromCache(A, Q, B, G, Z) {
      let Y = {
          homeAccountId: m0.EMPTY_STRING,
          environment: A.canonicalAuthorityUrlComponents.HostNameAndPort,
          credentialType: SG.ACCESS_TOKEN,
          clientId: Q,
          realm: A.tenant,
          target: aI.createSearchScopes(B.asArray())
        },
        J = G.getAccessTokensByFilter(Y, Z);
      if (J.length < 1) return null;
      else if (J.length > 1) throw YQ(xZ.multipleMatchingTokens);
      return J[0]
    }
    async executeTokenRequest(A, Q, B) {
      let G, Z;
      if (this.appTokenProvider) {
        this.logger.info("Using appTokenProvider extensibility.");
        let X = {
          correlationId: A.correlationId,
          tenantId: this.config.authOptions.authority.tenant,
          scopes: A.scopes,
          claims: A.claims
        };
        Z = LJ.nowSeconds();
        let I = await this.appTokenProvider(X);
        G = {
          access_token: I.accessToken,
          expires_in: I.expiresInSeconds,
          refresh_in: I.refreshInSeconds,
          token_type: J5.BEARER
        }
      } else {
        let X = this.createTokenQueryParameters(A),
          I = U3.appendQueryString(Q.tokenEndpoint, X),
          D = await this.createTokenRequestBody(A),
          W = this.createTokenRequestHeaders(),
          K = {
            clientId: this.config.authOptions.clientId,
            authority: A.authority,
            scopes: A.scopes,
            claims: A.claims,
            authenticationScheme: A.authenticationScheme,
            resourceRequestMethod: A.resourceRequestMethod,
            resourceRequestUri: A.resourceRequestUri,
            shrClaims: A.shrClaims,
            sshKid: A.sshKid
          };
        this.logger.info("Sending token request to endpoint: " + Q.tokenEndpoint), Z = LJ.nowSeconds();
        let V = await this.executePostToTokenEndpoint(I, D, W, K, A.correlationId);
        G = V.body, G.status = V.status
      }
      let Y = new oI(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return Y.validateTokenResponse(G, B), await Y.handleServerTokenResponse(G, this.authority, Z, A)
    }
    async createTokenRequestBody(A) {
      let Q = new Map;
      if (E2.addClientId(Q, this.config.authOptions.clientId), E2.addScopes(Q, A.scopes, !1), E2.addGrantType(Q, VN.CLIENT_CREDENTIALS_GRANT), E2.addLibraryInfo(Q, this.config.libraryInfo), E2.addApplicationTelemetry(Q, this.config.telemetry.application), E2.addThrottling(Q), this.serverTelemetryManager) E2.addServerTelemetry(Q, this.serverTelemetryManager);
      let B = A.correlationId || this.config.cryptoInterface.createNewGuid();
      if (E2.addCorrelationId(Q, B), this.config.clientCredentials.clientSecret) E2.addClientSecret(Q, this.config.clientCredentials.clientSecret);
      let G = A.clientAssertion || this.config.clientCredentials.clientAssertion;
      if (G) E2.addClientAssertion(Q, await yC(G.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), E2.addClientAssertionType(Q, G.assertionType);
      if (!JY.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) E2.addClaims(Q, A.claims, this.config.authOptions.clientCapabilities);
      return oH.mapToQueryString(Q)
    }
  }
})
// @from(Ln 238248, Col 4)
zSA
// @from(Ln 238249, Col 4)
s70 = w(() => {
  xG();
  tPA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  zSA = class zSA extends kz {
    constructor(A) {
      super(A)
    }
    async acquireToken(A) {
      if (this.scopeSet = new aI(A.scopes || []), this.userAssertionHash = await this.cryptoUtils.hashString(A.oboAssertion), A.skipCache || A.claims) return this.executeTokenRequest(A, this.authority, this.userAssertionHash);
      try {
        return await this.getCachedAuthenticationResult(A)
      } catch (Q) {
        return await this.executeTokenRequest(A, this.authority, this.userAssertionHash)
      }
    }
    async getCachedAuthenticationResult(A) {
      let Q = this.readAccessTokenFromCacheForOBO(this.config.authOptions.clientId, A);
      if (!Q) throw this.serverTelemetryManager?.setCacheOutcome(YY.NO_CACHED_ACCESS_TOKEN), this.logger.info("SilentFlowClient:acquireCachedToken - No access token found in cache for the given properties."), YQ(xZ.tokenRefreshRequired);
      else if (LJ.isTokenExpired(Q.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds)) throw this.serverTelemetryManager?.setCacheOutcome(YY.CACHED_ACCESS_TOKEN_EXPIRED), this.logger.info(`OnbehalfofFlow:getCachedAuthenticationResult - Cached access token is expired or will expire within ${this.config.systemOptions.tokenRenewalOffsetSeconds} seconds.`), YQ(xZ.tokenRefreshRequired);
      let B = this.readIdTokenFromCacheForOBO(Q.homeAccountId, A.correlationId),
        G, Z = null;
      if (B) {
        G = L31.extractTokenClaims(B.secret, EN.base64Decode);
        let Y = G.oid || G.sub,
          J = {
            homeAccountId: B.homeAccountId,
            environment: B.environment,
            tenantId: B.realm,
            username: m0.EMPTY_STRING,
            localAccountId: Y || m0.EMPTY_STRING
          };
        Z = this.cacheManager.getAccount(this.cacheManager.generateAccountKey(J), A.correlationId)
      }
      if (this.config.serverTelemetryManager) this.config.serverTelemetryManager.incrementCacheHits();
      return oI.generateAuthenticationResult(this.cryptoUtils, this.authority, {
        account: Z,
        accessToken: Q,
        idToken: B,
        refreshToken: null,
        appMetadata: null
      }, !0, A, G)
    }
    readIdTokenFromCacheForOBO(A, Q) {
      let B = {
          homeAccountId: A,
          environment: this.authority.canonicalAuthorityUrlComponents.HostNameAndPort,
          credentialType: SG.ID_TOKEN,
          clientId: this.config.authOptions.clientId,
          realm: this.authority.tenant
        },
        G = this.cacheManager.getIdTokensByFilter(B, Q);
      if (Object.values(G).length < 1) return null;
      return Object.values(G)[0]
    }
    readAccessTokenFromCacheForOBO(A, Q) {
      let B = Q.authenticationScheme || J5.BEARER,
        Z = {
          credentialType: B && B.toLowerCase() !== J5.BEARER.toLowerCase() ? SG.ACCESS_TOKEN_WITH_AUTH_SCHEME : SG.ACCESS_TOKEN,
          clientId: A,
          target: aI.createSearchScopes(this.scopeSet.asArray()),
          tokenType: B,
          keyId: Q.sshKid,
          requestedClaimsHash: Q.requestedClaimsHash,
          userAssertionHash: this.userAssertionHash
        },
        Y = this.cacheManager.getAccessTokensByFilter(Z, Q.correlationId),
        J = Y.length;
      if (J < 1) return null;
      else if (J > 1) throw YQ(xZ.multipleMatchingTokens);
      return Y[0]
    }
    async executeTokenRequest(A, Q, B) {
      let G = this.createTokenQueryParameters(A),
        Z = U3.appendQueryString(Q.tokenEndpoint, G),
        Y = await this.createTokenRequestBody(A),
        J = this.createTokenRequestHeaders(),
        X = {
          clientId: this.config.authOptions.clientId,
          authority: A.authority,
          scopes: A.scopes,
          claims: A.claims,
          authenticationScheme: A.authenticationScheme,
          resourceRequestMethod: A.resourceRequestMethod,
          resourceRequestUri: A.resourceRequestUri,
          shrClaims: A.shrClaims,
          sshKid: A.sshKid
        },
        I = LJ.nowSeconds(),
        D = await this.executePostToTokenEndpoint(Z, Y, J, X, A.correlationId),
        W = new oI(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return W.validateTokenResponse(D.body), await W.handleServerTokenResponse(D.body, this.authority, I, A, void 0, B)
    }
    async createTokenRequestBody(A) {
      let Q = new Map;
      if (E2.addClientId(Q, this.config.authOptions.clientId), E2.addScopes(Q, A.scopes), E2.addGrantType(Q, VN.JWT_BEARER), E2.addClientInfo(Q), E2.addLibraryInfo(Q, this.config.libraryInfo), E2.addApplicationTelemetry(Q, this.config.telemetry.application), E2.addThrottling(Q), this.serverTelemetryManager) E2.addServerTelemetry(Q, this.serverTelemetryManager);
      let B = A.correlationId || this.config.cryptoInterface.createNewGuid();
      if (E2.addCorrelationId(Q, B), E2.addRequestTokenUse(Q, e2A.ON_BEHALF_OF), E2.addOboAssertion(Q, A.oboAssertion), this.config.clientCredentials.clientSecret) E2.addClientSecret(Q, this.config.clientCredentials.clientSecret);
      let G = this.config.clientCredentials.clientAssertion;
      if (G) E2.addClientAssertion(Q, await yC(G.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), E2.addClientAssertionType(Q, G.assertionType);
      if (A.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) E2.addClaims(Q, A.claims, this.config.authOptions.clientCapabilities);
      return oH.mapToQueryString(Q)
    }
  }
})
// @from(Ln 238353, Col 4)
$SA
// @from(Ln 238354, Col 4)
VoB = w(() => {
  p81();
  d81();
  MJ();
  xG();
  l81();
  s70(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  $SA = class $SA extends F9A {
    constructor(A) {
      super(A);
      let Q = !!this.config.auth.clientSecret,
        B = !!this.config.auth.clientAssertion,
        G = (!!this.config.auth.clientCertificate?.thumbprint || !!this.config.auth.clientCertificate?.thumbprintSha256) && !!this.config.auth.clientCertificate?.privateKey;
      if (this.appTokenProvider) return;
      if (Q && B || B && G || Q && G) throw YQ(xZ.invalidClientCredential);
      if (this.config.auth.clientSecret) {
        this.clientSecret = this.config.auth.clientSecret;
        return
      }
      if (this.config.auth.clientAssertion) {
        this.developerProvidedClientAssertion = this.config.auth.clientAssertion;
        return
      }
      if (!G) throw YQ(xZ.invalidClientCredential);
      else this.clientAssertion = this.config.auth.clientCertificate.thumbprintSha256 ? YS.fromCertificateWithSha256Thumbprint(this.config.auth.clientCertificate.thumbprintSha256, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c) : YS.fromCertificate(this.config.auth.clientCertificate.thumbprint, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c);
      this.appTokenProvider = void 0
    }
    SetAppTokenProvider(A) {
      this.appTokenProvider = A
    }
    async acquireTokenByClientCredential(A) {
      this.logger.info("acquireTokenByClientCredential called", A.correlationId);
      let Q;
      if (A.clientAssertion) Q = {
        assertion: await yC(A.clientAssertion, this.config.auth.clientId),
        assertionType: vC.JWT_BEARER_ASSERTION_TYPE
      };
      let B = await this.initializeBaseRequest(A),
        G = {
          ...B,
          scopes: B.scopes.filter((K) => !yz.includes(K))
        },
        Z = {
          ...A,
          ...G,
          clientAssertion: Q
        },
        J = new U3(Z.authority).getUrlComponents().PathSegments[0];
      if (Object.values(KN).includes(J)) throw YQ(xZ.missingTenantIdError);
      let X = process.env[PpB],
        I;
      if (Z.azureRegion !== "DisableMsalForceRegion")
        if (!Z.azureRegion && X) I = X;
        else I = Z.azureRegion;
      let D = {
          azureRegion: I,
          environmentRegion: process.env[TpB]
        },
        W = this.initializeServerTelemetryManager(nm.acquireTokenByClientCredential, Z.correlationId, Z.skipCache);
      try {
        let K = await this.createAuthority(Z.authority, Z.correlationId, D, A.azureCloudOptions),
          V = await this.buildOauthClientConfiguration(K, Z.correlationId, "", W),
          F = new H9A(V, this.appTokenProvider);
        return this.logger.verbose("Client credential client created", Z.correlationId), await F.acquireToken(Z)
      } catch (K) {
        if (K instanceof n6) K.setCorrelationId(Z.correlationId);
        throw W.cacheFailedRequest(K), K
      }
    }
    async acquireTokenOnBehalfOf(A) {
      this.logger.info("acquireTokenOnBehalfOf called", A.correlationId);
      let Q = {
        ...A,
        ...await this.initializeBaseRequest(A)
      };
      try {
        let B = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
          G = await this.buildOauthClientConfiguration(B, Q.correlationId, "", void 0),
          Z = new zSA(G);
        return this.logger.verbose("On behalf of client created", Q.correlationId), await Z.acquireToken(Q)
      } catch (B) {
        if (B instanceof n6) B.setCorrelationId(Q.correlationId);
        throw B
      }
    }
  }
})
// @from(Ln 238442, Col 0)
function FoB(A) {
  if (typeof A !== "string") return !1;
  let Q = new Date(A);
  return !isNaN(Q.getTime()) && Q.toISOString() === A
}
// @from(Ln 238447, Col 4)
HoB = w(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 238450, Col 0)
class t70 {
  constructor(A, Q, B) {
    this.httpClientNoRetries = A, this.retryPolicy = Q, this.logger = B
  }
  async sendNetworkRequestAsyncHelper(A, Q, B) {
    if (A === OJ.GET) return this.httpClientNoRetries.sendGetRequestAsync(Q, B);
    else return this.httpClientNoRetries.sendPostRequestAsync(Q, B)
  }
  async sendNetworkRequestAsync(A, Q, B) {
    let G = await this.sendNetworkRequestAsyncHelper(A, Q, B);
    if ("isNewRequest" in this.retryPolicy) this.retryPolicy.isNewRequest = !0;
    let Z = 0;
    while (await this.retryPolicy.pauseForRetry(G.status, Z, this.logger, G.headers[pY.RETRY_AFTER])) G = await this.sendNetworkRequestAsyncHelper(A, Q, B), Z++;
    return G
  }
  async sendGetRequestAsync(A, Q) {
    return this.sendNetworkRequestAsync(OJ.GET, A, Q)
  }
  async sendPostRequestAsync(A, Q) {
    return this.sendNetworkRequestAsync(OJ.POST, A, Q)
  }
}
// @from(Ln 238472, Col 4)
EoB = w(() => {
  xG();
  MJ(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 238476, Col 0)
class $N {
  constructor(A, Q, B, G, Z) {
    this.logger = A, this.nodeStorage = Q, this.networkClient = B, this.cryptoProvider = G, this.disableInternalRetries = Z
  }
  async getServerTokenResponseAsync(A, Q, B, G) {
    return this.getServerTokenResponse(A)
  }
  getServerTokenResponse(A) {
    let Q, B;
    if (A.body.expires_on) {
      if (FoB(A.body.expires_on)) A.body.expires_on = new Date(A.body.expires_on).getTime() / 1000;
      if (B = A.body.expires_on - LJ.nowSeconds(), B > 7200) Q = B / 2
    }
    return {
      status: A.status,
      access_token: A.body.access_token,
      expires_in: B,
      scope: A.body.resource,
      token_type: A.body.token_type,
      refresh_in: Q,
      correlation_id: A.body.correlation_id || A.body.correlationId,
      error: typeof A.body.error === "string" ? A.body.error : A.body.error?.code,
      error_description: A.body.message || (typeof A.body.error === "string" ? A.body.error_description : A.body.error?.message),
      error_codes: A.body.error_codes,
      timestamp: A.body.timestamp,
      trace_id: A.body.trace_id
    }
  }
  async acquireTokenWithManagedIdentity(A, Q, B, G) {
    let Z = this.createRequest(A.resource, Q);
    if (A.revokedTokenSha256Hash) this.logger.info(`[Managed Identity] The following claims are present in the request: ${A.claims}`), Z.queryParameters[rW.SHA256_TOKEN_TO_REFRESH] = A.revokedTokenSha256Hash;
    if (A.clientCapabilities?.length) {
      let V = A.clientCapabilities.toString();
      this.logger.info(`[Managed Identity] The following client capabilities are present in the request: ${V}`), Z.queryParameters[rW.XMS_CC] = V
    }
    let Y = Z.headers;
    Y[pY.CONTENT_TYPE] = m0.URL_FORM_CONTENT_TYPE;
    let J = {
      headers: Y
    };
    if (Object.keys(Z.bodyParameters).length) J.body = Z.computeParametersBodyString();
    let X = this.disableInternalRetries ? this.networkClient : new t70(this.networkClient, Z.retryPolicy, this.logger),
      I = LJ.nowSeconds(),
      D;
    try {
      if (Z.httpMethod === OJ.POST) D = await X.sendPostRequestAsync(Z.computeUri(), J);
      else D = await X.sendGetRequestAsync(Z.computeUri(), J)
    } catch (V) {
      if (V instanceof n6) throw V;
      else throw YQ(xZ.networkError)
    }
    let W = new oI(Q.id, this.nodeStorage, this.cryptoProvider, this.logger, null, null),
      K = await this.getServerTokenResponseAsync(D, X, Z, J);
    return W.validateTokenResponse(K, G), W.handleServerTokenResponse(K, B, I, A)
  }
  getManagedIdentityUserAssignedIdQueryParameterKey(A, Q, B) {
    switch (A) {
      case VI.USER_ASSIGNED_CLIENT_ID:
        return this.logger.info(`[Managed Identity] [API version ${B?"2017+":"2019+"}] Adding user assigned client id to the request.`), B ? E9A.MANAGED_IDENTITY_CLIENT_ID_2017 : E9A.MANAGED_IDENTITY_CLIENT_ID;
      case VI.USER_ASSIGNED_RESOURCE_ID:
        return this.logger.info("[Managed Identity] Adding user assigned resource id to the request."), Q ? E9A.MANAGED_IDENTITY_RESOURCE_ID_IMDS : E9A.MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS;
      case VI.USER_ASSIGNED_OBJECT_ID:
        return this.logger.info("[Managed Identity] Adding user assigned object id to the request."), E9A.MANAGED_IDENTITY_OBJECT_ID;
      default:
        throw dD(go)
    }
  }
}
// @from(Ln 238544, Col 4)
E9A
// @from(Ln 238545, Col 4)
z9A = w(() => {
  xG();
  MJ();
  uWA();
  HoB();
  EoB();
  D9A(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  E9A = {
    MANAGED_IDENTITY_CLIENT_ID_2017: "clientid",
    MANAGED_IDENTITY_CLIENT_ID: "client_id",
    MANAGED_IDENTITY_OBJECT_ID: "object_id",
    MANAGED_IDENTITY_RESOURCE_ID_IMDS: "msi_res_id",
    MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS: "mi_res_id"
  };
  $N.getValidatedEnvVariableUrlString = (A, Q, B, G) => {
    try {
      return new U3(Q).urlString
    } catch (Z) {
      throw G.info(`[Managed Identity] ${B} managed identity is unavailable because the '${A}' environment variable is malformed.`), dD(I9A[A])
    }
  }
})
// @from(Ln 238567, Col 0)
class e70 {
  calculateDelay(A, Q) {
    if (!A) return Q;
    let B = Math.round(parseFloat(A) * 1000);
    if (isNaN(B)) B = new Date(A).valueOf() - new Date().valueOf();
    return Math.max(Q, B)
  }
}
// @from(Ln 238575, Col 4)
zoB = w(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 238578, Col 0)
class i81 {
  constructor() {
    this.linearRetryStrategy = new e70
  }
  static get DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS() {
    return Sl8
  }
  async pauseForRetry(A, Q, B, G) {
    if (xl8.includes(A) && Q < Pl8) {
      let Z = this.linearRetryStrategy.calculateDelay(G, i81.DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS);
      return B.verbose(`Retrying request in ${Z}ms (retry attempt: ${Q+1})`), await new Promise((Y) => {
        return setTimeout(Y, Z)
      }), !0
    }
    return !1
  }
}
// @from(Ln 238595, Col 4)
Pl8 = 3
// @from(Ln 238596, Col 2)
Sl8 = 1000
// @from(Ln 238597, Col 2)
xl8
// @from(Ln 238598, Col 4)
$oB = w(() => {
  z81();
  zoB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  xl8 = [i6.NOT_FOUND, i6.REQUEST_TIMEOUT, i6.TOO_MANY_REQUESTS, i6.SERVER_ERROR, i6.SERVICE_UNAVAILABLE, i6.GATEWAY_TIMEOUT]
})
// @from(Ln 238603, Col 0)
class QO {
  constructor(A, Q, B) {
    this.httpMethod = A, this._baseEndpoint = Q, this.headers = {}, this.bodyParameters = {}, this.queryParameters = {}, this.retryPolicy = B || new i81
  }
  computeUri() {
    let A = new Map;
    if (this.queryParameters) E2.addExtraQueryParameters(A, this.queryParameters);
    let Q = oH.mapToQueryString(A);
    return U3.appendQueryString(this._baseEndpoint, Q)
  }
  computeParametersBodyString() {
    let A = new Map;
    if (this.bodyParameters) E2.addExtraQueryParameters(A, this.bodyParameters);
    return oH.mapToQueryString(A)
  }
}
// @from(Ln 238619, Col 4)
$9A = w(() => {
  xG();
  $oB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 238623, Col 4)
yl8 = "2019-08-01"
// @from(Ln 238624, Col 2)
C9A