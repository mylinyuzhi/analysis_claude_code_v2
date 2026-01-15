
// @from(Ln 334715, Col 4)
Au5 = !1
// @from(Ln 334716, Col 4)
oN = w(() => {
  DQ();
  A0();
  T1();
  C0();
  A0();
  v1();
  d4();
  fQ();
  tkA();
  Z0();
  GQ();
  OHA()
})
// @from(Ln 334731, Col 0)
function rN(A, Q) {
  return A.flatMap((B, G) => G ? [Q(G), B] : [B])
}
// @from(Ln 334735, Col 0)
function ey2({
  patch: A,
  dim: Q,
  width: B
}) {
  let [G] = oB(), Z = ty2.useMemo(() => Ju5(A.lines, A.oldStart, B, Q, G), [A.lines, A.oldStart, B, Q, G]);
  return LE.createElement(T, {
    flexDirection: "column",
    flexGrow: 1
  }, Z.map((Y, J) => LE.createElement(T, {
    key: J
  }, Y)))
}
// @from(Ln 334749, Col 0)
function Bu5(A) {
  return A.map((Q) => {
    if (Q.startsWith("+")) return {
      code: " " + Q.slice(1),
      i: 0,
      type: "add",
      originalCode: Q.slice(1)
    };
    if (Q.startsWith("-")) return {
      code: " " + Q.slice(1),
      i: 0,
      type: "remove",
      originalCode: Q.slice(1)
    };
    return {
      code: Q,
      i: 0,
      type: "nochange",
      originalCode: Q
    }
  })
}
// @from(Ln 334772, Col 0)
function Gu5(A) {
  let Q = [],
    B = 0;
  while (B < A.length) {
    let G = A[B];
    if (!G) {
      B++;
      continue
    }
    if (G.type === "remove") {
      let Z = [G],
        Y = B + 1;
      while (Y < A.length && A[Y]?.type === "remove") {
        let X = A[Y];
        if (X) Z.push(X);
        Y++
      }
      let J = [];
      while (Y < A.length && A[Y]?.type === "add") {
        let X = A[Y];
        if (X) J.push(X);
        Y++
      }
      if (Z.length > 0 && J.length > 0) {
        let X = Math.min(Z.length, J.length);
        for (let I = 0; I < X; I++) {
          let D = Z[I],
            W = J[I];
          if (D && W) D.wordDiff = !0, W.wordDiff = !0, D.matchedLine = W, W.matchedLine = D
        }
        Q.push(...Z.filter(Boolean)), Q.push(...J.filter(Boolean)), B = Y
      } else Q.push(G), B++
    } else Q.push(G), B++
  }
  return Q
}
// @from(Ln 334809, Col 0)
function Zu5(A, Q) {
  return YS2(A, Q, {
    ignoreCase: !1
  })
}
// @from(Ln 334815, Col 0)
function Yu5(A, Q, B, G, Z) {
  let {
    type: Y,
    i: J,
    wordDiff: X,
    matchedLine: I,
    originalCode: D
  } = A;
  if (!X || !I) return null;
  let W = Y === "remove" ? D : I.originalCode,
    K = Y === "remove" ? I.originalCode : D,
    V = Zu5(W, K),
    F = W.length + K.length;
  if (V.filter((j) => j.added || j.removed).reduce((j, x) => j + x.value.length, 0) / F > Qu5 || G) return null;
  let z = Y === "add" ? "+" : "-",
    $ = z.length,
    O = Math.max(1, Q - B - 1 - $),
    L = [],
    M = [],
    _ = 0;
  if (V.forEach((j, x) => {
      let b = !1,
        S;
      if (Y === "add") {
        if (j.added) b = !0, S = "diffAddedWord";
        else if (!j.removed) b = !0
      } else if (Y === "remove") {
        if (j.removed) b = !0, S = "diffRemovedWord";
        else if (!j.added) b = !0
      }
      if (!b) return;
      MP(j.value, O, "wrap").split(`
`).forEach((AA, n) => {
        if (!AA) return;
        if (n > 0 || _ + AA.length > O) {
          if (M.length > 0) L.push({
            content: [...M],
            contentWidth: _
          }), M = [], _ = 0
        }
        M.push(LE.createElement(C, {
          key: `part-${x}-${n}`,
          backgroundColor: S
        }, AA)), _ += AA.length
      })
    }), M.length > 0) L.push({
    content: M,
    contentWidth: _
  });
  return L.map(({
    content: j,
    contentWidth: x
  }, b) => {
    let S = `${Y}-${J}-${b}`,
      u = Y === "add" ? G ? "diffAddedDimmed" : "diffAdded" : G ? "diffRemovedDimmed" : "diffRemoved",
      f = b === 0 ? J : void 0,
      AA = (f !== void 0 ? f.toString().padStart(B) : " ".repeat(B)) + " ",
      n = AA.length + $ + x,
      y = Math.max(0, Q - n);
    return LE.createElement(C, {
      key: S,
      color: Z ? "text" : void 0,
      backgroundColor: u,
      dimColor: G
    }, AA, z, j, " ".repeat(y))
  })
}
// @from(Ln 334883, Col 0)
function Ju5(A, Q, B, G, Z) {
  let Y = Math.max(1, Math.floor(B)),
    J = Bu5(A),
    X = Gu5(J),
    I = Xu5(X, Q),
    D = Math.max(...I.map(({
      i: K
    }) => K), 0),
    W = Math.max(D.toString().length + 1, 0);
  return I.flatMap((K) => {
    let {
      type: V,
      code: F,
      i: H,
      wordDiff: E,
      matchedLine: z
    } = K;
    if (E && z) {
      let _ = Yu5(K, Y, W, G, Z);
      if (_ !== null) return _
    }
    let $ = 2,
      O = Math.max(1, Y - W - 1 - $);
    return MP(F, O, "wrap").split(`
`).map((_, j) => {
      let x = `${V}-${H}-${j}`,
        b = j === 0 ? H : void 0,
        S = (b !== void 0 ? b.toString().padStart(W) : " ".repeat(W)) + " ",
        u = V === "add" ? "+" : V === "remove" ? "-" : " ",
        f = S.length + 1 + _.length,
        AA = Math.max(0, Y - f);
      switch (V) {
        case "add":
          return LE.createElement(C, {
            key: x,
            color: Z ? "text" : void 0,
            backgroundColor: G ? "diffAddedDimmed" : "diffAdded",
            dimColor: G
          }, S, u, _, " ".repeat(AA));
        case "remove":
          return LE.createElement(C, {
            key: x,
            color: Z ? "text" : void 0,
            backgroundColor: G ? "diffRemovedDimmed" : "diffRemoved",
            dimColor: G
          }, S, u, _, " ".repeat(AA));
        case "nochange":
          return LE.createElement(C, {
            key: x,
            color: Z ? "text" : void 0,
            dimColor: G
          }, LE.createElement(C, {
            dimColor: !0
          }, S), u, _, " ".repeat(AA))
      }
    })
  })
}
// @from(Ln 334942, Col 0)
function Xu5(A, Q) {
  let B = Q,
    G = [],
    Z = [...A];
  while (Z.length > 0) {
    let Y = Z.shift(),
      {
        code: J,
        type: X,
        originalCode: I,
        wordDiff: D,
        matchedLine: W
      } = Y,
      K = {
        code: J,
        type: X,
        i: B,
        originalCode: I,
        wordDiff: D,
        matchedLine: W
      };
    switch (X) {
      case "nochange":
        B++, G.push(K);
        break;
      case "add":
        B++, G.push(K);
        break;
      case "remove": {
        G.push(K);
        let V = 0;
        while (Z[0]?.type === "remove") {
          B++;
          let F = Z.shift(),
            {
              code: H,
              type: E,
              originalCode: z,
              wordDiff: $,
              matchedLine: O
            } = F,
            L = {
              code: H,
              type: E,
              i: B,
              originalCode: z,
              wordDiff: $,
              matchedLine: O
            };
          G.push(L), V++
        }
        B -= V;
        break
      }
    }
  }
  return G
}
// @from(Ln 335000, Col 4)
LE
// @from(Ln 335000, Col 8)
ty2
// @from(Ln 335000, Col 13)
Qu5 = 0.4
// @from(Ln 335001, Col 4)
Av2 = w(() => {
  fA();
  tkA();
  LE = c(QA(), 1), ty2 = c(QA(), 1)
})
// @from(Ln 335006, Col 4)
Qv2 = {}
// @from(Ln 335013, Col 4)
_HA
// @from(Ln 335013, Col 9)
Iu5
// @from(Ln 335013, Col 14)
Du5
// @from(Ln 335013, Col 19)
Wu5
// @from(Ln 335013, Col 24)
Ku5
// @from(Ln 335014, Col 4)
Bv2 = w(() => {
  try {
    _HA = (() => {
      throw new Error("Cannot require module " + "../../color-diff.node");
    })()
  } catch (A) {
    _HA = null
  }
  Iu5 = _HA?.ColorDiff, Du5 = _HA?.ColorFile, Wu5 = _HA?.getSyntaxTheme, Ku5 = _HA?.ColorDiff
})
// @from(Ln 335025, Col 0)
function d$0() {
  if (iX(process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT)) return "env";
  if (!LG()) return "build";
  return null
}
// @from(Ln 335030, Col 0)
async function c$0() {
  if (Gv2) return;
  if (Gv2 = !0, d$0() !== null) return;
  try {
    let A = await Promise.resolve().then(() => (Bv2(), Qv2));
    Zv2 = A.ColorDiff, Yv2 = A.ColorFile, Jv2 = A.getSyntaxTheme
  } catch (A) {
    k(`[ColorDiff] Rust module unavailable, falling back to JS: ${A instanceof Error?A.message:String(A)}`)
  }
}
// @from(Ln 335041, Col 0)
function Xv2() {
  return Zv2
}
// @from(Ln 335045, Col 0)
function Iv2() {
  return Yv2
}
// @from(Ln 335049, Col 0)
function Dv2(A) {
  return Jv2?.(A) ?? null
}
// @from(Ln 335052, Col 4)
Zv2 = null
// @from(Ln 335053, Col 2)
Yv2 = null
// @from(Ln 335054, Col 2)
Jv2 = null
// @from(Ln 335055, Col 2)
Gv2 = !1
// @from(Ln 335056, Col 4)
KbA = w(() => {
  T1();
  fQ()
})
// @from(Ln 335060, Col 4)
Jx
// @from(Ln 335060, Col 8)
VbA
// @from(Ln 335060, Col 13)
sN
// @from(Ln 335061, Col 4)
ls = w(() => {
  fA();
  Av2();
  KbA();
  ar();
  Jx = c(QA(), 1), VbA = c(QA(), 1), sN = VbA.memo(function ({
    patch: Q,
    dim: B,
    filePath: G,
    firstLine: Z,
    width: Y,
    skipHighlighting: J = !1
  }) {
    let [X] = oB(), D = YU().syntaxHighlightingDisabled ?? !1, W = VbA.useMemo(() => {
      if (J || D) return null;
      let V = Xv2();
      if (!V) return null;
      return new V(Q, Z, G)
    }, [J, D, Q, Z, G]), K = VbA.useMemo(() => {
      if (W === null) return null;
      let V = Math.max(1, Math.floor(Y));
      return W.render(X, V, B)
    }, [W, X, Y, B]);
    return Jx.createElement(T, null, K ? Jx.createElement(T, {
      flexDirection: "column"
    }, K.map((V, F) => Jx.createElement(C, {
      key: F
    }, Jx.createElement(M8, null, V)))) : Jx.createElement(ey2, {
      patch: Q,
      dim: B,
      width: Y
    }))
  })
})
// @from(Ln 335096, Col 0)
function $W1({
  filePath: A,
  structuredPatch: Q,
  firstLine: B,
  style: G,
  verbose: Z,
  previewHint: Y
}) {
  let {
    columns: J
  } = ZB(), X = Q.reduce((W, K) => W + K.lines.filter((V) => V.startsWith("+")).length, 0), I = Q.reduce((W, K) => W + K.lines.filter((V) => V.startsWith("-")).length, 0), D = o7.createElement(C, null, X > 0 ? o7.createElement(o7.Fragment, null, "Added ", o7.createElement(C, {
    bold: !0
  }, X), " ", X > 1 ? "lines" : "line") : null, X > 0 && I > 0 ? ", " : null, I > 0 ? o7.createElement(o7.Fragment, null, X === 0 ? "R" : "r", "emoved ", o7.createElement(C, {
    bold: !0
  }, I), " ", I > 1 ? "lines" : "line") : null);
  if (G === "condensed" && !Z) return D;
  return o7.createElement(x0, null, o7.createElement(T, {
    flexDirection: "column"
  }, Y ? o7.createElement(C, {
    dimColor: !0
  }, Y) : o7.createElement(C, null, D), rN(Q.map((W) => o7.createElement(T, {
    flexDirection: "column",
    key: W.newStart
  }, o7.createElement(sN, {
    patch: W,
    dim: !1,
    width: J - 12,
    filePath: A,
    firstLine: B
  }))), (W) => o7.createElement(T, {
    key: `ellipsis-${W}`
  }, o7.createElement(C, {
    dimColor: !0
  }, "...")))))
}
// @from(Ln 335131, Col 4)
o7
// @from(Ln 335132, Col 4)
p$0 = w(() => {
  fA();
  ls();
  P4();
  c4();
  o7 = c(QA(), 1)
})
// @from(Ln 335143, Col 0)
function Kv2({
  code: A,
  filePath: Q,
  dim: B = !1,
  skipColoring: G = !1
}) {
  let Z = Vu5(Q).slice(1),
    Y = Wv2.useMemo(() => {
      let J = EHA(A);
      if (G) return J;
      let X = "markdown";
      if (Z)
        if (FbA.supportsLanguage(Z)) X = Z;
        else k(`Language not supported while highlighting code, falling back to markdown: ${Z}`);
      try {
        return FbA.highlight(J, {
          language: X
        })
      } catch (I) {
        if (I instanceof Error && I.message.includes("Unknown language")) return k(`Language not supported while highlighting code, falling back to markdown: ${I}`), FbA.highlight(J, {
          language: "markdown"
        })
      }
    }, [A, Z, G]);
  return l$0.default.createElement(C, {
    dimColor: B
  }, l$0.default.createElement(M8, null, Y ?? ""))
}
// @from(Ln 335171, Col 4)
FbA
// @from(Ln 335171, Col 9)
l$0
// @from(Ln 335171, Col 14)
Wv2
// @from(Ln 335172, Col 4)
Vv2 = w(() => {
  fA();
  T1();
  y9();
  FbA = c(mY1(), 1), l$0 = c(QA(), 1), Wv2 = c(QA(), 1)
})
// @from(Ln 335178, Col 4)
Xx
// @from(Ln 335178, Col 8)
Ix
// @from(Ln 335178, Col 12)
Fu5 = 80
// @from(Ln 335179, Col 2)
tN
// @from(Ln 335180, Col 4)
h6A = w(() => {
  fA();
  Vv2();
  KbA();
  ar();
  Xx = c(QA(), 1), Ix = c(QA(), 1), tN = Ix.memo(function ({
    code: Q,
    filePath: B,
    width: G,
    dim: Z = !1
  }) {
    let Y = Ix.useRef(null),
      [J, X] = Ix.useState(G || Fu5),
      [I] = oB(),
      W = YU().syntaxHighlightingDisabled ?? !1,
      K = Ix.useMemo(() => {
        if (W) return null;
        let F = Iv2();
        if (!F) return null;
        return new F(Q, B)
      }, [Q, B, W]);
    Ix.useEffect(() => {
      if (!G && Y.current) {
        let {
          width: F
        } = _B0(Y.current);
        if (F > 0) X(F - 2)
      }
    }, [G]);
    let V = Ix.useMemo(() => {
      if (K === null) return null;
      return K.render(I, J, Z)
    }, [K, I, J, Z]);
    return Xx.createElement(T, {
      ref: Y
    }, V ? Xx.createElement(T, {
      flexDirection: "column"
    }, V.map((F, H) => Xx.createElement(C, {
      key: H
    }, Xx.createElement(M8, null, F)))) : Xx.createElement(Kv2, {
      code: Q,
      filePath: B,
      dim: Z,
      skipColoring: W
    }))
  })
})
// @from(Ln 335231, Col 0)
function jHA({
  file_path: A,
  operation: Q,
  patch: B,
  firstLine: G,
  content: Z,
  style: Y,
  verbose: J
}) {
  let {
    columns: X
  } = ZB(), I = KG.createElement(T, {
    flexDirection: "row"
  }, KG.createElement(C, {
    color: "subtle"
  }, "User rejected ", Q, " to "), KG.createElement(C, {
    bold: !0,
    color: "subtle"
  }, J ? A : Hu5(o1(), A)));
  if (Y === "condensed" && !J) return KG.createElement(x0, null, I);
  if (Q === "write" && Z !== void 0) {
    let D = Z.split(`
`),
      K = D.length - Fv2,
      V = J ? Z : D.slice(0, Fv2).join(`
`);
    return KG.createElement(x0, null, KG.createElement(T, {
      flexDirection: "column"
    }, I, KG.createElement(tN, {
      code: V || "(No content)",
      filePath: A,
      width: X - 12,
      dim: !0
    }), !J && K > 0 && KG.createElement(C, {
      dimColor: !0
    }, "… +", K, " lines")))
  }
  if (!B || B.length === 0) return KG.createElement(x0, null, I);
  return KG.createElement(x0, null, KG.createElement(T, {
    flexDirection: "column"
  }, I, rN(B.map((D) => KG.createElement(T, {
    flexDirection: "column",
    key: D.newStart
  }, KG.createElement(sN, {
    patch: D,
    dim: !0,
    width: X - 12,
    filePath: A,
    firstLine: G
  }))), (D) => KG.createElement(T, {
    key: `ellipsis-${D}`
  }, KG.createElement(C, {
    dimColor: !0
  }, "...")))))
}
// @from(Ln 335286, Col 4)
KG
// @from(Ln 335286, Col 8)
Fv2 = 10
// @from(Ln 335287, Col 4)
i$0 = w(() => {
  fA();
  V2();
  ls();
  h6A();
  P4();
  c4();
  KG = c(QA(), 1)
})
// @from(Ln 335297, Col 0)
function CW1(A) {
  if (!A) return "Update";
  if (A.file_path?.startsWith(NN())) return "Updated plan";
  if (A.old_string === "") return "Create";
  return "Update"
}
// @from(Ln 335304, Col 0)
function Hv2(A) {
  if (!A?.file_path) return null;
  return k6(A.file_path)
}
// @from(Ln 335309, Col 0)
function Ev2({
  file_path: A
}, {
  verbose: Q
}) {
  if (!A) return null;
  if (A.startsWith(NN())) return "";
  return zI.createElement(zb, {
    filePath: A
  }, Q ? A : k6(A))
}
// @from(Ln 335321, Col 0)
function zv2() {
  return null
}
// @from(Ln 335325, Col 0)
function $v2({
  filePath: A,
  structuredPatch: Q,
  originalFile: B
}, G, {
  style: Z,
  verbose: Y
}) {
  let J = A.startsWith(NN());
  return zI.createElement($W1, {
    filePath: A,
    structuredPatch: Q,
    firstLine: B.split(`
`)[0] ?? null,
    style: Z,
    verbose: Y,
    previewHint: J ? "/plan to preview" : void 0
  })
}
// @from(Ln 335345, Col 0)
function Cv2({
  file_path: A,
  old_string: Q,
  new_string: B,
  replace_all: G = !1
}, Z) {
  let {
    style: Y,
    verbose: J
  } = Z;
  if (Q === "") return zI.createElement(jHA, {
    file_path: A,
    operation: "write",
    content: B,
    firstLine: B.split(`
`)[0] ?? null,
    verbose: J
  });
  try {
    let I = vA().existsSync(A) ? vA().readFileSync(A, {
        encoding: "utf8"
      }) : "",
      D = k6A(I, Q) || Q,
      {
        patch: W
      } = nD1({
        filePath: A,
        fileContents: I,
        oldString: D,
        newString: B,
        replaceAll: G
      });
    return zI.createElement(jHA, {
      file_path: A,
      operation: "update",
      patch: W,
      firstLine: I.split(`
`)[0] ?? null,
      style: Y,
      verbose: J
    })
  } catch (I) {
    return e(I), zI.createElement(x0, {
      height: 1
    }, zI.createElement(C, null, "(No changes)"))
  }
}
// @from(Ln 335393, Col 0)
function Uv2(A, Q) {
  let {
    verbose: B
  } = Q;
  if (!B && typeof A === "string" && Q9(A, "tool_use_error")) {
    if (Q9(A, "tool_use_error")?.includes("File has not been read yet")) return zI.createElement(x0, null, zI.createElement(C, {
      dimColor: !0
    }, "File must be read first"));
    return zI.createElement(x0, null, zI.createElement(C, {
      color: "error"
    }, "Error editing file"))
  }
  return zI.createElement(X5, {
    result: A,
    verbose: B
  })
}
// @from(Ln 335410, Col 4)
zI
// @from(Ln 335411, Col 4)
n$0 = w(() => {
  fA();
  p$0();
  eW();
  i$0();
  sSA();
  c4();
  y9();
  tQ();
  hs();
  DQ();
  v1();
  UF();
  zI = c(QA(), 1)
})
// @from(Ln 335431, Col 4)
J$
// @from(Ln 335432, Col 4)
is = w(() => {
  Z0();
  BI();
  H71();
  y9();
  V2();
  C0();
  Lc();
  VS2();
  hs();
  AY();
  oZ();
  DQ();
  P6A();
  ms();
  DbA();
  v1();
  T1();
  VW1();
  my2();
  oN();
  OHA();
  n$0();
  J$ = {
    name: I8,
    maxResultSizeChars: 1e5,
    strict: !0,
    async description() {
      return "A tool for editing files"
    },
    async prompt() {
      return KS2
    },
    userFacingName: CW1,
    getToolUseSummary: Hv2,
    isEnabled() {
      return !0
    },
    inputSchema: xy2,
    outputSchema: KW1,
    isConcurrencySafe() {
      return !1
    },
    isReadOnly() {
      return !1
    },
    getPath(A) {
      return A.file_path
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return g6A(J$, A, B.toolPermissionContext)
    },
    renderToolUseMessage: Ev2,
    renderToolUseProgressMessage: zv2,
    renderToolResultMessage: $v2,
    renderToolUseRejectedMessage: Cv2,
    renderToolUseErrorMessage: Uv2,
    async validateInput({
      file_path: A,
      old_string: Q,
      new_string: B,
      replace_all: G = !1
    }, Z) {
      if (Q === B) return {
        result: !1,
        behavior: "ask",
        message: "No changes to make: old_string and new_string are exactly the same.",
        errorCode: 1
      };
      let Y = Y4(A),
        J = await Z.getAppState();
      if (AE(Y, J.toolPermissionContext, "edit", "deny") !== null) return {
        result: !1,
        behavior: "ask",
        message: "File is in a directory that is denied by your permission settings.",
        errorCode: 2
      };
      let I = vA();
      if (I.existsSync(Y) && Q === "") {
        if (I.readFileSync(Y, {
            encoding: RW(Y)
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
      if (!I.existsSync(Y) && Q === "") return {
        result: !0
      };
      if (!I.existsSync(Y)) {
        let H = C71(Y),
          E = "File does not exist.",
          z = o1(),
          $ = EQ();
        if (z !== $) E += ` Current working directory: ${z}`;
        if (H) E += ` Did you mean ${H}?`;
        return {
          result: !1,
          behavior: "ask",
          message: E,
          errorCode: 4
        }
      }
      if (Y.endsWith(".ipynb")) return {
        result: !1,
        behavior: "ask",
        message: `File is a Jupyter Notebook. Use the ${tq} to edit this file.`,
        errorCode: 5
      };
      let D = Z.readFileState.get(Y);
      if (!D) return {
        result: !1,
        behavior: "ask",
        message: "File has not been read yet. Read it first before writing to it.",
        meta: {
          isFilePathAbsolute: String(a$0(A))
        },
        errorCode: 6
      };
      if (D) {
        if (mz(Y) > D.timestamp)
          if (D.offset === void 0 && D.limit === void 0)
            if (I.readFileSync(Y, {
                encoding: RW(Y)
              }).replaceAll(`\r
`, `
`) === D.content);
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
      let W = I.readFileSync(Y, {
          encoding: RW(Y)
        }).replaceAll(`\r
`, `
`),
        K = k6A(W, Q);
      if (!K) return {
        result: !1,
        behavior: "ask",
        message: `String to replace not found in file.
String: ${Q}`,
        meta: {
          isFilePathAbsolute: String(a$0(A))
        },
        errorCode: 8
      };
      let V = W.split(K).length - 1;
      if (V > 1 && !G) return {
        result: !1,
        behavior: "ask",
        message: `Found ${V} matches of the string to replace, but replace_all is false. To replace all occurrences, set replace_all to true. To replace only one occurrence, please provide more context to uniquely identify the instance.
String: ${Q}`,
        meta: {
          isFilePathAbsolute: String(a$0(A)),
          actualOldString: K
        },
        errorCode: 9
      };
      let F = uy2(Y, W, () => {
        return G ? W.replaceAll(K, B) : W.replace(K, B)
      });
      if (F !== null) return F;
      return {
        result: !0,
        meta: {
          actualOldString: K
        }
      }
    },
    inputsEquivalent(A, Q) {
      return $S2({
        file_path: A.file_path,
        edits: [{
          old_string: A.old_string,
          new_string: A.new_string,
          replace_all: A.replace_all ?? !1
        }]
      }, {
        file_path: Q.file_path,
        edits: [{
          old_string: Q.old_string,
          new_string: Q.new_string,
          replace_all: Q.replace_all ?? !1
        }]
      })
    },
    async call({
      file_path: A,
      old_string: Q,
      new_string: B,
      replace_all: G = !1
    }, {
      readFileState: Z,
      userModified: Y,
      updateFileHistoryState: J
    }, X, I) {
      let D = vA(),
        W = Y4(A);
      await Ec.beforeFileEdited(W);
      let K = D.existsSync(W) ? nK(W) : "";
      if (D.existsSync(W)) {
        let M = mz(W),
          _ = Z.get(W);
        if (!_ || M > _.timestamp) {
          if (!(_ && _.offset === void 0 && _.limit === void 0 && K === _.content)) throw Error(ZRA)
        }
      }
      if (vG()) await ps(J, W, I.uuid);
      let V = k6A(K, Q) || Q,
        {
          patch: F,
          updatedFile: H
        } = nD1({
          filePath: W,
          fileContents: K,
          oldString: V,
          newString: B,
          replaceAll: G
        }),
        E = Eu5(W);
      D.mkdirSync(E);
      let z = D.existsSync(W) ? _c(W) : "LF",
        $ = D.existsSync(W) ? RW(W) : "utf8";
      ns(W, H, $, z);
      let O = Rc();
      if (O) XW1(`file://${W}`), O.changeFile(W, H).catch((M) => {
        k(`LSP: Failed to notify server of file change for ${W}: ${M.message}`), e(M)
      }), O.saveFile(W).catch((M) => {
        k(`LSP: Failed to notify server of file save for ${W}: ${M.message}`), e(M)
      });
      if (ds(W, K, H), Z.set(W, {
          content: H,
          timestamp: mz(W),
          offset: void 0,
          limit: void 0
        }), W.endsWith(`${zu5}CLAUDE.md`)) l("tengu_write_claudemd", {});
      return AbA(F), $b({
        operation: "edit",
        tool: "FileEditTool",
        filePath: W
      }), {
        data: {
          filePath: A,
          oldString: V,
          newString: B,
          originalFile: K,
          structuredPatch: F,
          userModified: Y ?? !1,
          replaceAll: G
        }
      }
    },
    mapToolResultToToolResultBlockParam({
      filePath: A,
      originalFile: Q,
      oldString: B,
      newString: G,
      userModified: Z,
      replaceAll: Y
    }, J) {
      let X = Z ? ".  The user modified your proposed changes before accepting them. " : "";
      if (Y) return {
        tool_use_id: J,
        type: "tool_result",
        content: `The file ${A} has been updated${X}. All occurrences of '${B}' were successfully replaced with '${G}'.`
      };
      if (HX("tengu_file_edit_optimization", "enabled", !1)) return {
        tool_use_id: J,
        type: "tool_result",
        content: `The file ${A} has been updated successfully${X}.`
      };
      let {
        snippet: D,
        startLine: W
      } = HS2(Q || "", B, G);
      return {
        tool_use_id: J,
        type: "tool_result",
        content: `The file ${A} has been updated${X}. Here's the result of running \`cat -n\` on a snippet of the edited file:
${Xr({content:D,startLine:W})}`
      }
    }
  }
})
// @from(Ln 335743, Col 0)
function Uu5({
  filePath: A,
  content: Q,
  verbose: B
}) {
  let {
    columns: G
  } = ZB(), Z = Q || "(No content)", Y = Q.split(Nv2).length, J = Y - qv2;
  return o6.createElement(x0, null, o6.createElement(T, {
    flexDirection: "column"
  }, o6.createElement(C, null, "Wrote ", o6.createElement(C, {
    bold: !0
  }, Y), " lines to", " ", o6.createElement(C, {
    bold: !0
  }, B ? A : wv2(o1(), A))), o6.createElement(T, {
    flexDirection: "column"
  }, o6.createElement(tN, {
    code: B ? Z : Z.split(`
`).slice(0, qv2).filter((X) => X.trim() !== "").join(`
`),
    filePath: A,
    width: G - 12
  })), !B && J > 0 && o6.createElement(C, {
    dimColor: !0
  }, "… +", J, " ", J === 1 ? "line" : "lines", " ", Y > 0 && o6.createElement(VS, null))))
}
// @from(Ln 335770, Col 0)
function Lv2(A) {
  if (A?.file_path?.startsWith(NN())) return "Updated plan";
  return "Write"
}
// @from(Ln 335775, Col 0)
function Ov2(A) {
  if (!A?.file_path) return null;
  return k6(A.file_path)
}
// @from(Ln 335780, Col 0)
function Mv2(A, {
  verbose: Q
}) {
  if (!A.file_path) return null;
  if (A.file_path.startsWith(NN())) return "";
  return o6.createElement(zb, {
    filePath: A.file_path
  }, Q ? A.file_path : k6(A.file_path))
}
// @from(Ln 335790, Col 0)
function Rv2({
  file_path: A,
  content: Q
}, {
  style: B,
  verbose: G
}) {
  try {
    let Z = vA(),
      Y = $u5(A) ? A : Cu5(o1(), A);
    if (!Z.existsSync(Y)) return o6.createElement(jHA, {
      file_path: A,
      operation: "write",
      content: Q,
      firstLine: Q.split(`
`)[0] ?? null,
      verbose: G
    });
    let X = RW(Y),
      I = Z.readFileSync(Y, {
        encoding: X
      }),
      D = xO({
        filePath: A,
        fileContents: I,
        edits: [{
          old_string: I,
          new_string: Q,
          replace_all: !1
        }]
      }),
      W = Q.split(`
`)[0] ?? null;
    return o6.createElement(jHA, {
      file_path: A,
      operation: "update",
      patch: D,
      firstLine: W,
      style: B,
      verbose: G
    })
  } catch (Z) {
    return e(Z), o6.createElement(x0, null, o6.createElement(C, null, "(No changes)"))
  }
}
// @from(Ln 335836, Col 0)
function _v2(A, {
  verbose: Q
}) {
  if (!Q && typeof A === "string" && Q9(A, "tool_use_error")) return o6.createElement(x0, null, o6.createElement(C, {
    color: "error"
  }, "Error writing file"));
  return o6.createElement(X5, {
    result: A,
    verbose: Q
  })
}
// @from(Ln 335848, Col 0)
function jv2() {
  return null
}
// @from(Ln 335852, Col 0)
function Tv2({
  filePath: A,
  content: Q,
  structuredPatch: B,
  type: G
}, Z, {
  style: Y,
  verbose: J
}) {
  switch (G) {
    case "create": {
      if (Y === "condensed" && !J) {
        let X = Q.split(Nv2).length;
        return o6.createElement(C, null, "Wrote ", o6.createElement(C, {
          bold: !0
        }, X), " lines to", " ", o6.createElement(C, {
          bold: !0
        }, wv2(o1(), A)))
      }
      return o6.createElement(Uu5, {
        filePath: A,
        content: Q,
        verbose: J
      })
    }
    case "update": {
      let X = A.startsWith(NN());
      return o6.createElement($W1, {
        filePath: A,
        structuredPatch: B,
        firstLine: Q.split(`
`)[0] ?? null,
        verbose: J,
        previewHint: X ? "/plan to preview" : void 0
      })
    }
  }
}
// @from(Ln 335890, Col 4)
o6
// @from(Ln 335890, Col 8)
qv2 = 10
// @from(Ln 335891, Col 4)
Pv2 = w(() => {
  fA();
  p$0();
  i$0();
  sSA();
  h6A();
  c4();
  eW();
  Gr();
  y9();
  V2();
  Lc();
  DQ();
  v1();
  tQ();
  UF();
  P4();
  o6 = c(QA(), 1)
})
// @from(Ln 335914, Col 4)
Sv2 = 16000
// @from(Ln 335915, Col 2)
wu5 = "<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with Grep in order to find the line numbers of what you are looking for.</NOTE>"
// @from(Ln 335916, Col 2)
Lu5
// @from(Ln 335916, Col 7)
o$0
// @from(Ln 335916, Col 12)
X$
// @from(Ln 335917, Col 4)
jc = w(() => {
  j9();
  Z0();
  H71();
  y9();
  pL();
  Lc();
  AY();
  oZ();
  DQ();
  P6A();
  ms();
  DbA();
  v1();
  T1();
  VW1();
  oN();
  OHA();
  Pv2();
  Lu5 = m.strictObject({
    file_path: m.string().describe("The absolute path to the file to write (must be absolute, not relative)"),
    content: m.string().describe("The content to write to the file")
  }), o$0 = m.object({
    type: m.enum(["create", "update"]).describe("Whether a new file was created or an existing file was updated"),
    filePath: m.string().describe("The path to the file that was written"),
    content: m.string().describe("The content that was written to the file"),
    structuredPatch: m.array(x$0).describe("Diff patch showing the changes"),
    originalFile: m.string().nullable().describe("The original file content before the write (null for new files)")
  }), X$ = {
    name: BY,
    maxResultSizeChars: 1e5,
    strict: !0,
    input_examples: [{
      file_path: "/Users/username/project/src/newFile.ts",
      content: "Hello, World!"
    }],
    async description() {
      return "Write a file to the local filesystem."
    },
    userFacingName: Lv2,
    getToolUseSummary: Ov2,
    async prompt() {
      return QCB
    },
    isEnabled() {
      return !0
    },
    renderToolUseMessage: Mv2,
    inputSchema: Lu5,
    outputSchema: o$0,
    isConcurrencySafe() {
      return !1
    },
    isReadOnly() {
      return !1
    },
    getPath(A) {
      return A.file_path
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return g6A(X$, A, B.toolPermissionContext)
    },
    renderToolUseRejectedMessage: Rv2,
    renderToolUseErrorMessage: _v2,
    renderToolUseProgressMessage: jv2,
    renderToolResultMessage: Tv2,
    async validateInput({
      file_path: A
    }, Q) {
      let B = Y4(A),
        G = await Q.getAppState();
      if (AE(B, G.toolPermissionContext, "edit", "deny") !== null) return {
        result: !1,
        message: "File is in a directory that is denied by your permission settings.",
        errorCode: 1
      };
      if (!vA().existsSync(B)) return {
        result: !0
      };
      let J = Q.readFileState.get(B);
      if (!J) return {
        result: !1,
        message: "File has not been read yet. Read it first before writing to it.",
        errorCode: 2
      };
      if (J) {
        if (mz(B) > J.timestamp) return {
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
      file_path: A,
      content: Q
    }, {
      readFileState: B,
      updateFileHistoryState: G
    }, Z, Y) {
      let J = Y4(A),
        X = qu5(J),
        I = vA();
      await Ec.beforeFileEdited(J);
      let D = I.existsSync(J);
      if (D) {
        let E = mz(J),
          z = B.get(J);
        if (!z || E > z.timestamp)
          if (z && z.offset === void 0 && z.limit === void 0) {
            let O = RW(J);
            if (I.readFileSync(J, {
                encoding: O
              }).replaceAll(`\r
`, `
`) !== z.content) throw Error(ZRA)
          } else throw Error(ZRA)
      }
      let W = D ? RW(J) : "utf-8",
        K = D ? I.readFileSync(J, {
          encoding: W
        }) : null;
      if (vG()) await ps(G, J, Y.uuid);
      let V = D ? _c(J) : await xv2();
      I.mkdirSync(X), ns(J, Q, W, V);
      let F = Rc();
      if (F) XW1(`file://${J}`), F.changeFile(J, Q).catch((E) => {
        k(`LSP: Failed to notify server of file change for ${J}: ${E.message}`), e(E)
      }), F.saveFile(J).catch((E) => {
        k(`LSP: Failed to notify server of file save for ${J}: ${E.message}`), e(E)
      });
      if (ds(J, K, Q), B.set(J, {
          content: Q,
          timestamp: mz(J),
          offset: void 0,
          limit: void 0
        }), J.endsWith(`${Nu5}CLAUDE.md`)) l("tengu_write_claudemd", {});
      if (K) {
        let E = xO({
            filePath: A,
            fileContents: K,
            edits: [{
              old_string: K,
              new_string: Q,
              replace_all: !1
            }]
          }),
          z = {
            type: "update",
            filePath: A,
            content: Q,
            structuredPatch: E,
            originalFile: K
          };
        return AbA(E), $b({
          operation: "write",
          tool: "FileWriteTool",
          filePath: J,
          type: "update"
        }), {
          data: z
        }
      }
      let H = {
        type: "create",
        filePath: A,
        content: Q,
        structuredPatch: [],
        originalFile: null
      };
      return AbA([], Q), $b({
        operation: "write",
        tool: "FileWriteTool",
        filePath: J,
        type: "create"
      }), {
        data: H
      }
    },
    mapToolResultToToolResultBlockParam({
      filePath: A,
      content: Q,
      type: B
    }, G) {
      switch (B) {
        case "create":
          return {
            tool_use_id: G, type: "tool_result", content: `File created successfully at: ${A}`
          };
        case "update":
          return {
            tool_use_id: G, type: "tool_result", content: `The file ${A} has been updated. Here's the result of running \`cat -n\` on a snippet of the edited file:
${Xr({content:Q.split(/\r?\n/).length>Sv2?Q.split(/\r?\n/).slice(0,Sv2).join(`
`)+wu5:Q,startLine:1})}`
          }
      }
    }
  }
})
// @from(Ln 336121, Col 0)
function r$0({
  count: A,
  countLabel: Q,
  secondaryCount: B,
  secondaryLabel: G,
  content: Z,
  verbose: Y
}) {
  let J = KK.default.createElement(C, null, "Found ", KK.default.createElement(C, {
      bold: !0
    }, A, " "), A === 0 || A > 1 ? Q : Q.slice(0, -1)),
    X = B !== void 0 && G ? KK.default.createElement(C, null, " ", "across ", KK.default.createElement(C, {
      bold: !0
    }, B, " "), B === 0 || B > 1 ? G : G.slice(0, -1)) : null;
  if (Y) return KK.default.createElement(T, {
    flexDirection: "column"
  }, KK.default.createElement(T, {
    flexDirection: "row"
  }, KK.default.createElement(C, null, "  ⎿  ", J, X)), KK.default.createElement(T, {
    marginLeft: 5
  }, KK.default.createElement(C, null, Z)));
  return KK.default.createElement(x0, {
    height: 1
  }, KK.default.createElement(C, null, J, X, " ", A > 0 && KK.default.createElement(VS, null)))
}
// @from(Ln 336147, Col 0)
function yv2({
  pattern: A,
  path: Q,
  glob: B,
  type: G,
  output_mode: Z = "files_with_matches",
  head_limit: Y
}, {
  verbose: J
}) {
  if (!A) return null;
  let X = [`pattern: "${A}"`];
  if (Q) X.push(`path: "${J?Q:k6(Q)}"`);
  if (B) X.push(`glob: "${B}"`);
  if (G) X.push(`type: "${G}"`);
  if (Z !== "files_with_matches") X.push(`output_mode: "${Z}"`);
  if (Y !== void 0) X.push(`head_limit: ${Y}`);
  return X.join(", ")
}
// @from(Ln 336167, Col 0)
function vv2() {
  return KK.default.createElement(w7, null)
}
// @from(Ln 336171, Col 0)
function kv2(A, {
  verbose: Q
}) {
  if (!Q && typeof A === "string" && Q9(A, "tool_use_error")) return KK.default.createElement(x0, null, KK.default.createElement(C, {
    color: "error"
  }, "Error searching files"));
  return KK.default.createElement(X5, {
    result: A,
    verbose: Q
  })
}
// @from(Ln 336183, Col 0)
function bv2() {
  return null
}
// @from(Ln 336187, Col 0)
function fv2({
  mode: A = "files_with_matches",
  filenames: Q,
  numFiles: B,
  content: G,
  numLines: Z,
  numMatches: Y
}, J, {
  verbose: X
}) {
  if (A === "content") return KK.default.createElement(r$0, {
    count: Z ?? 0,
    countLabel: "lines",
    content: G,
    verbose: X
  });
  if (A === "count") return KK.default.createElement(r$0, {
    count: Y ?? 0,
    countLabel: "matches",
    secondaryCount: B,
    secondaryLabel: "files",
    content: G,
    verbose: X
  });
  let I = Q.map((D) => D).join(`
`);
  return KK.default.createElement(r$0, {
    count: B,
    countLabel: "files",
    content: I,
    verbose: X
  })
}
// @from(Ln 336221, Col 0)
function hv2(A) {
  if (!A?.pattern) return null;
  return YG(A.pattern, Mb)
}
// @from(Ln 336225, Col 4)
KK
// @from(Ln 336226, Col 4)
gv2 = w(() => {
  fA();
  tH();
  eW();
  c4();
  Gr();
  y9();
  tQ();
  KK = c(QA(), 1)
})
// @from(Ln 336240, Col 0)
function s$0(A, Q, B = 0) {
  if (Q === void 0) return A.slice(B);
  return A.slice(B, B + Q)
}
// @from(Ln 336245, Col 0)
function t$0(A) {
  let Q = o1(),
    B = Ou5(Q, A);
  return B.startsWith("..") ? A : B
}
// @from(Ln 336251, Col 0)
function e$0(A, Q) {
  if (!A && !Q) return "";
  return `limit: ${A}, offset: ${Q??0}`
}
// @from(Ln 336255, Col 4)
Mu5
// @from(Ln 336255, Col 9)
Ru5
// @from(Ln 336255, Col 14)
_u5
// @from(Ln 336255, Col 19)
Tc
// @from(Ln 336256, Col 4)
HbA = w(() => {
  j9();
  V2();
  oZ();
  uy();
  wP();
  AY();
  DQ();
  gv2();
  Mu5 = m.strictObject({
    pattern: m.string().describe("The regular expression pattern to search for in file contents"),
    path: m.string().optional().describe("File or directory to search in (rg PATH). Defaults to current working directory."),
    glob: m.string().optional().describe('Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}") - maps to rg --glob'),
    output_mode: m.enum(["content", "files_with_matches", "count"]).optional().describe('Output mode: "content" shows matching lines (supports -A/-B/-C context, -n line numbers, head_limit), "files_with_matches" shows file paths (supports head_limit), "count" shows match counts (supports head_limit). Defaults to "files_with_matches".'),
    "-B": m.number().optional().describe('Number of lines to show before each match (rg -B). Requires output_mode: "content", ignored otherwise.'),
    "-A": m.number().optional().describe('Number of lines to show after each match (rg -A). Requires output_mode: "content", ignored otherwise.'),
    "-C": m.number().optional().describe('Number of lines to show before and after each match (rg -C). Requires output_mode: "content", ignored otherwise.'),
    "-n": m.boolean().optional().describe('Show line numbers in output (rg -n). Requires output_mode: "content", ignored otherwise. Defaults to true.'),
    "-i": m.boolean().optional().describe("Case insensitive search (rg -i)"),
    type: m.string().optional().describe("File type to search (rg --type). Common types: js, py, rust, go, java, etc. More efficient than include for standard file types."),
    head_limit: m.number().optional().describe('Limit output to first N lines/entries, equivalent to "| head -N". Works across all output modes: content (limits output lines), files_with_matches (limits file paths), count (limits count entries). Defaults to 0 (unlimited).'),
    offset: m.number().optional().describe('Skip first N lines/entries before applying head_limit, equivalent to "| tail -n +N | head -N". Works across all output modes. Defaults to 0.'),
    multiline: m.boolean().optional().describe("Enable multiline mode where . matches newlines and patterns can span lines (rg -U --multiline-dotall). Default: false.")
  }), Ru5 = [".git", ".svn", ".hg", ".bzr"];
  _u5 = m.object({
    mode: m.enum(["content", "files_with_matches", "count"]).optional(),
    numFiles: m.number(),
    filenames: m.array(m.string()),
    content: m.string().optional(),
    numLines: m.number().optional(),
    numMatches: m.number().optional(),
    appliedLimit: m.number().optional(),
    appliedOffset: m.number().optional()
  }), Tc = {
    name: DI,
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
      return p10()
    },
    userFacingName() {
      return "Search"
    },
    getToolUseSummary: hv2,
    isEnabled() {
      return !0
    },
    inputSchema: Mu5,
    outputSchema: _u5,
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
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
      return A || o1()
    },
    async validateInput({
      path: A
    }) {
      if (A) {
        let Q = vA(),
          B = Y4(A);
        if (!Q.existsSync(B)) return {
          result: !1,
          message: `Path does not exist: ${A}`,
          errorCode: 1
        }
      }
      return {
        result: !0
      }
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return Jr(Tc, A, B.toolPermissionContext)
    },
    async prompt() {
      return p10()
    },
    renderToolUseMessage: yv2,
    renderToolUseRejectedMessage: vv2,
    renderToolUseErrorMessage: kv2,
    renderToolUseProgressMessage: bv2,
    renderToolResultMessage: fv2,
    mapToolResultToToolResultBlockParam({
      mode: A = "files_with_matches",
      numFiles: Q,
      filenames: B,
      content: G,
      numLines: Z,
      numMatches: Y,
      appliedLimit: J,
      appliedOffset: X
    }, I) {
      if (A === "content") {
        let K = e$0(J, X),
          V = G || "No matches found",
          F = K ? `${V}

[Showing results with pagination = ${K}]` : V;
        return {
          tool_use_id: I,
          type: "tool_result",
          content: F
        }
      }
      if (A === "count") {
        let K = e$0(J, X),
          V = G || "No matches found",
          F = Y ?? 0,
          H = Q ?? 0,
          E = `

Found ${F} total ${F===1?"occurrence":"occurrences"} across ${H} ${H===1?"file":"files"}.${K?` with pagination = ${K}`:""}`;
        return {
          tool_use_id: I,
          type: "tool_result",
          content: V + E
        }
      }
      let D = e$0(J, X);
      if (Q === 0) return {
        tool_use_id: I,
        type: "tool_result",
        content: "No files found"
      };
      let W = `Found ${Q} file${Q===1?"":"s"}${D?` ${D}`:""}
${B.join(`
`)}`;
      return {
        tool_use_id: I,
        type: "tool_result",
        content: W
      }
    },
    async call({
      pattern: A,
      path: Q,
      glob: B,
      type: G,
      output_mode: Z = "files_with_matches",
      "-B": Y,
      "-A": J,
      "-C": X,
      "-n": I = !0,
      "-i": D = !1,
      head_limit: W,
      offset: K = 0,
      multiline: V = !1
    }, {
      abortController: F,
      getAppState: H
    }) {
      let E = Q ? Y4(Q) : o1(),
        z = ["--hidden"];
      for (let S of Ru5) z.push("--glob", `!${S}`);
      if (z.push("--max-columns", "500"), V) z.push("-U", "--multiline-dotall");
      if (D) z.push("-i");
      if (Z === "files_with_matches") z.push("-l");
      else if (Z === "count") z.push("-c");
      if (I && Z === "content") z.push("-n");
      if (X !== void 0 && Z === "content") z.push("-C", X.toString());
      else if (Z === "content") {
        if (Y !== void 0) z.push("-B", Y.toString());
        if (J !== void 0) z.push("-A", J.toString())
      }
      if (A.startsWith("-")) z.push("-e", A);
      else z.push(A);
      if (G) z.push("--type", G);
      if (B) {
        let S = [],
          u = B.split(/\s+/);
        for (let f of u)
          if (f.includes("{") && f.includes("}")) S.push(f);
          else S.push(...f.split(",").filter(Boolean));
        for (let f of S.filter(Boolean)) z.push("--glob", f)
      }
      let $ = await H(),
        O = THA(PHA($.toolPermissionContext), o1());
      for (let S of O) {
        let u = S.startsWith("/") ? `!${S}` : `!**/${S}`;
        z.push("--glob", u)
      }
      let L = await gy(z, E, F.signal);
      if (Z === "content") {
        let S = L.map((AA) => {
            let n = AA.indexOf(":");
            if (n > 0) {
              let y = AA.substring(0, n),
                p = AA.substring(n);
              return t$0(y) + p
            }
            return AA
          }),
          u = s$0(S, W, K);
        return {
          data: {
            mode: "content",
            numFiles: 0,
            filenames: [],
            content: u.join(`
`),
            numLines: u.length,
            ...W !== void 0 && {
              appliedLimit: W
            },
            ...K > 0 && {
              appliedOffset: K
            }
          }
        }
      }
      if (Z === "count") {
        let S = L.map((y) => {
            let p = y.lastIndexOf(":");
            if (p > 0) {
              let GA = y.substring(0, p),
                WA = y.substring(p);
              return t$0(GA) + WA
            }
            return y
          }),
          u = s$0(S, W, K),
          f = 0,
          AA = 0;
        for (let y of u) {
          let p = y.lastIndexOf(":");
          if (p > 0) {
            let GA = y.substring(p + 1),
              WA = parseInt(GA, 10);
            if (!isNaN(WA)) f += WA, AA += 1
          }
        }
        return {
          data: {
            mode: "count",
            numFiles: AA,
            filenames: [],
            content: u.join(`
`),
            numMatches: f,
            ...W !== void 0 && {
              appliedLimit: W
            },
            ...K > 0 && {
              appliedOffset: K
            }
          }
        }
      }
      let M = await Promise.all(L.map((S) => vA().stat(S))),
        _ = L.map((S, u) => [S, M[u]]).sort((S, u) => {
          let f = (u[1].mtimeMs ?? 0) - (S[1].mtimeMs ?? 0);
          if (f === 0) return S[0].localeCompare(u[0]);
          return f
        }).map((S) => S[0]),
        x = s$0(_, W, K).map(t$0);
      return {
        data: {
          mode: "files_with_matches",
          filenames: x,
          numFiles: x.length,
          ...W !== void 0 && {
            appliedLimit: W
          },
          ...K > 0 && {
            appliedOffset: K
          }
        }
      }
    }
  }
})
// @from(Ln 336562, Col 0)
function uv2() {
  return "Search"
}
// @from(Ln 336566, Col 0)
function mv2({
  pattern: A,
  path: Q
}, {
  verbose: B
}) {
  if (!A) return null;
  if (!Q) return `pattern: "${A}"`;
  return `pattern: "${A}", path: "${B?Q:k6(Q)}"`
}
// @from(Ln 336577, Col 0)
function dv2() {
  return EbA.default.createElement(w7, null)
}
// @from(Ln 336581, Col 0)
function cv2(A, {
  verbose: Q
}) {
  if (!Q && typeof A === "string" && Q9(A, "tool_use_error")) return EbA.default.createElement(x0, null, EbA.default.createElement(C, {
    color: "error"
  }, "Error searching files"));
  return EbA.default.createElement(X5, {
    result: A,
    verbose: Q
  })
}
// @from(Ln 336593, Col 0)
function pv2() {
  return null
}
// @from(Ln 336597, Col 0)
function iv2(A) {
  if (!A?.pattern) return null;
  return YG(A.pattern, Mb)
}
// @from(Ln 336601, Col 4)
EbA
// @from(Ln 336601, Col 9)
lv2
// @from(Ln 336602, Col 4)
nv2 = w(() => {
  fA();
  tH();
  eW();
  c4();
  tQ();
  y9();
  HbA();
  EbA = c(QA(), 1);
  lv2 = Tc.renderToolResultMessage
})
// @from(Ln 336613, Col 4)
ju5
// @from(Ln 336613, Col 9)
Tu5
// @from(Ln 336613, Col 14)
as
// @from(Ln 336614, Col 4)
UW1 = w(() => {
  j9();
  V2();
  y9();
  AY();
  oZ();
  DQ();
  nv2();
  ju5 = m.strictObject({
    pattern: m.string().describe("The glob pattern to match files against"),
    path: m.string().optional().describe('The directory to search in. If not specified, the current working directory will be used. IMPORTANT: Omit this field to use the default directory. DO NOT enter "undefined" or "null" - simply omit it for the default behavior. Must be a valid directory path if provided.')
  }), Tu5 = m.object({
    durationMs: m.number().describe("Time taken to execute the search in milliseconds"),
    numFiles: m.number().describe("Total number of files found"),
    filenames: m.array(m.string()).describe("Array of file paths that match the pattern"),
    truncated: m.boolean().describe("Whether results were truncated (limited to 100 files)")
  }), as = {
    name: lI,
    maxResultSizeChars: 1e5,
    async description() {
      return c10
    },
    userFacingName: uv2,
    getToolUseSummary: iv2,
    isEnabled() {
      return !0
    },
    inputSchema: ju5,
    outputSchema: Tu5,
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
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
      return A ? Y4(A) : o1()
    },
    async validateInput({
      path: A
    }) {
      if (A) {
        let Q = vA(),
          B = Y4(A);
        if (!Q.existsSync(B)) return {
          result: !1,
          message: `Directory does not exist: ${A}`,
          errorCode: 1
        };
        if (!Q.statSync(B).isDirectory()) return {
          result: !1,
          message: `Path is not a directory: ${A}`,
          errorCode: 2
        }
      }
      return {
        result: !0
      }
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return Jr(as, A, B.toolPermissionContext)
    },
    async prompt() {
      return c10
    },
    renderToolUseMessage: mv2,
    renderToolUseRejectedMessage: dv2,
    renderToolUseErrorMessage: cv2,
    renderToolUseProgressMessage: pv2,
    renderToolResultMessage: lv2,
    async call(A, {
      abortController: Q,
      getAppState: B
    }) {
      let G = Date.now(),
        Z = await B(),
        {
          files: Y,
          truncated: J
        } = await av2(A.pattern, as.getPath(A), {
          limit: 100,
          offset: 0
        }, Q.signal, Z.toolPermissionContext);
      return {
        data: {
          filenames: Y,
          durationMs: Date.now() - G,
          numFiles: Y.length,
          truncated: J
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      if (A.filenames.length === 0) return {
        tool_use_id: Q,
        type: "tool_result",
        content: "No files found"
      };
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: [...A.filenames, ...A.truncated ? ["(Results are truncated. Consider using a more specific path or pattern.)"] : []].join(`
`)
      }
    }
  }
})
// @from(Ln 336730, Col 4)
ov2 = "Replace the contents of a specific cell in a Jupyter notebook."
// @from(Ln 336731, Col 2)
rv2 = "Completely replaces the contents of a specific cell in a Jupyter notebook (.ipynb file) with new source. Jupyter notebooks are interactive documents that combine code, text, and visualizations, commonly used for data analysis and scientific computing. The notebook_path parameter must be an absolute path, not a relative path. The cell_number is 0-indexed. Use edit_mode=insert to add a new cell at the index specified by cell_number. Use edit_mode=delete to delete the cell at the index specified by cell_number."
// @from(Ln 336736, Col 0)
function sv2({
  notebook_path: A,
  cell_id: Q,
  new_source: B,
  cell_type: G,
  edit_mode: Z = "replace",
  verbose: Y
}) {
  let J = Z === "delete" ? "delete" : `${Z} cell in`;
  return OE.createElement(x0, null, OE.createElement(T, {
    flexDirection: "column"
  }, OE.createElement(T, {
    flexDirection: "row"
  }, OE.createElement(C, {
    color: "subtle"
  }, "User rejected ", J, " "), OE.createElement(C, {
    bold: !0,
    color: "subtle"
  }, Y ? A : Pu5(o1(), A)), OE.createElement(C, {
    color: "subtle"
  }, " at cell ", Q)), Z !== "delete" && OE.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, OE.createElement(tN, {
    code: B,
    filePath: G === "markdown" ? "file.md" : "file.py",
    dim: !0
  }))))
}
// @from(Ln 336765, Col 4)
OE
// @from(Ln 336766, Col 4)
tv2 = w(() => {
  fA();
  V2();
  c4();
  h6A();
  OE = c(QA(), 1)
})
// @from(Ln 336774, Col 0)
function ev2(A) {
  if (!A?.notebook_path) return null;
  return k6(A.notebook_path)
}
// @from(Ln 336779, Col 0)
function Ak2({
  notebook_path: A,
  cell_id: Q,
  new_source: B,
  cell_type: G,
  edit_mode: Z
}, {
  verbose: Y
}) {
  if (!A || !B || !G) return null;
  let J = Y ? A : k6(A);
  if (Y) return c8.createElement(c8.Fragment, null, c8.createElement(zb, {
    filePath: A
  }, J), `@${Q}, content: ${B.slice(0,30)}…, cell_type: ${G}, edit_mode: ${Z??"replace"}`);
  return c8.createElement(c8.Fragment, null, c8.createElement(zb, {
    filePath: A
  }, J), `@${Q}`)
}
// @from(Ln 336798, Col 0)
function Qk2(A, {
  verbose: Q
}) {
  return c8.createElement(sv2, {
    notebook_path: A.notebook_path,
    cell_id: A.cell_id,
    new_source: A.new_source,
    cell_type: A.cell_type,
    edit_mode: A.edit_mode,
    verbose: Q
  })
}
// @from(Ln 336811, Col 0)
function Bk2(A, {
  verbose: Q
}) {
  if (!Q && typeof A === "string" && Q9(A, "tool_use_error")) return c8.createElement(x0, null, c8.createElement(C, {
    color: "error"
  }, "Error editing notebook"));
  return c8.createElement(X5, {
    result: A,
    verbose: Q
  })
}
// @from(Ln 336823, Col 0)
function Gk2() {
  return null
}
// @from(Ln 336827, Col 0)
function Zk2({
  cell_id: A,
  new_source: Q,
  error: B
}) {
  if (B) return c8.createElement(x0, null, c8.createElement(C, {
    color: "error"
  }, B));
  return c8.createElement(x0, null, c8.createElement(T, {
    flexDirection: "column"
  }, c8.createElement(C, null, "Updated cell ", c8.createElement(C, {
    bold: !0
  }, A), ":"), c8.createElement(T, {
    marginLeft: 2
  }, c8.createElement(tN, {
    code: Q,
    filePath: "notebook.py"
  }))))
}
// @from(Ln 336846, Col 4)
c8
// @from(Ln 336847, Col 4)
Yk2 = w(() => {
  fA();
  sSA();
  h6A();
  tv2();
  c4();
  eW();
  tQ();
  y9();
  c8 = c(QA(), 1)
})
// @from(Ln 336863, Col 4)
xu5
// @from(Ln 336863, Col 9)
AC0
// @from(Ln 336863, Col 14)
qf
// @from(Ln 336864, Col 4)
u6A = w(() => {
  j9();
  G71();
  y9();
  vI();
  V2();
  AY();
  DQ();
  oN();
  Yk2();
  A0();
  xu5 = m.strictObject({
    notebook_path: m.string().describe("The absolute path to the Jupyter notebook file to edit (must be absolute, not relative)"),
    cell_id: m.string().optional().describe("The ID of the cell to edit. When inserting a new cell, the new cell will be inserted after the cell with this ID, or at the beginning if not specified."),
    new_source: m.string().describe("The new source for the cell"),
    cell_type: m.enum(["code", "markdown"]).optional().describe("The type of the cell (code or markdown). If not specified, it defaults to the current cell type. If using edit_mode=insert, this is required."),
    edit_mode: m.enum(["replace", "insert", "delete"]).optional().describe("The type of edit to make (replace, insert, delete). Defaults to replace.")
  }), AC0 = m.object({
    new_source: m.string().describe("The new source code that was written to the cell"),
    cell_id: m.string().optional().describe("The ID of the cell that was edited"),
    cell_type: m.enum(["code", "markdown"]).describe("The type of the cell"),
    language: m.string().describe("The programming language of the notebook"),
    edit_mode: m.string().describe("The edit mode that was used"),
    error: m.string().optional().describe("Error message if the operation failed"),
    notebook_path: m.string().describe("The path to the notebook file"),
    original_file: m.string().describe("The original notebook content before modification"),
    updated_file: m.string().describe("The updated notebook content after modification")
  }), qf = {
    name: tq,
    maxResultSizeChars: 1e5,
    async description() {
      return ov2
    },
    async prompt() {
      return rv2
    },
    userFacingName() {
      return "Edit Notebook"
    },
    getToolUseSummary: ev2,
    isEnabled() {
      return !0
    },
    inputSchema: xu5,
    outputSchema: AC0,
    isConcurrencySafe() {
      return !1
    },
    isReadOnly() {
      return !1
    },
    getPath(A) {
      return A.notebook_path
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return g6A(qf, A, B.toolPermissionContext)
    },
    mapToolResultToToolResultBlockParam({
      cell_id: A,
      edit_mode: Q,
      new_source: B,
      error: G
    }, Z) {
      if (G) return {
        tool_use_id: Z,
        type: "tool_result",
        content: G,
        is_error: !0
      };
      switch (Q) {
        case "replace":
          return {
            tool_use_id: Z, type: "tool_result", content: `Updated cell ${A} with ${B}`
          };
        case "insert":
          return {
            tool_use_id: Z, type: "tool_result", content: `Inserted cell ${A} with ${B}`
          };
        case "delete":
          return {
            tool_use_id: Z, type: "tool_result", content: `Deleted cell ${A}`
          };
        default:
          return {
            tool_use_id: Z, type: "tool_result", content: "Unknown edit mode"
          }
      }
    },
    renderToolUseMessage: Ak2,
    renderToolUseRejectedMessage: Qk2,
    renderToolUseErrorMessage: Bk2,
    renderToolUseProgressMessage: Gk2,
    renderToolResultMessage: Zk2,
    async validateInput({
      notebook_path: A,
      cell_type: Q,
      cell_id: B,
      edit_mode: G = "replace"
    }) {
      let Z = Jk2(A) ? A : Xk2(o1(), A),
        Y = vA();
      if (!Y.existsSync(Z)) return {
        result: !1,
        message: "Notebook file does not exist.",
        errorCode: 1
      };
      if (Su5(Z) !== ".ipynb") return {
        result: !1,
        message: "File must be a Jupyter notebook (.ipynb file). For editing other file types, use the FileEdit tool.",
        errorCode: 2
      };
      if (G !== "replace" && G !== "insert" && G !== "delete") return {
        result: !1,
        message: "Edit mode must be replace, insert, or delete.",
        errorCode: 4
      };
      if (G === "insert" && !Q) return {
        result: !1,
        message: "Cell type is required when using edit_mode=insert.",
        errorCode: 5
      };
      let J = RW(Z),
        X = Y.readFileSync(Z, {
          encoding: J
        }),
        I = c5(X);
      if (!I) return {
        result: !1,
        message: "Notebook is not valid JSON.",
        errorCode: 6
      };
      if (!B) {
        if (G !== "insert") return {
          result: !1,
          message: "Cell ID must be specified when not inserting a new cell.",
          errorCode: 7
        }
      } else if (I.cells.findIndex((W) => W.id === B) === -1) {
        let W = nSA(B);
        if (W !== void 0) {
          if (!I.cells[W]) return {
            result: !1,
            message: `Cell with index ${W} does not exist in notebook.`,
            errorCode: 7
          }
        } else return {
          result: !1,
          message: `Cell with ID "${B}" not found in notebook.`,
          errorCode: 8
        }
      }
      return {
        result: !0
      }
    },
    async call({
      notebook_path: A,
      new_source: Q,
      cell_id: B,
      cell_type: G,
      edit_mode: Z
    }, {
      updateFileHistoryState: Y
    }, J, X) {
      let I = Jk2(A) ? A : Xk2(o1(), A);
      if (vG()) await ps(Y, I, X.uuid);
      try {
        let D = RW(I),
          W = vA().readFileSync(I, {
            encoding: D
          }),
          K = AQ(W),
          V;
        if (!B) V = 0;
        else {
          if (V = K.cells.findIndex((L) => L.id === B), V === -1) {
            let L = nSA(B);
            if (L !== void 0) V = L
          }
          if (Z === "insert") V += 1
        }
        let F = Z;
        if (F === "replace" && V === K.cells.length) {
          if (F = "insert", !G) G = "code"
        }
        let H = K.metadata.language_info?.name ?? "python",
          E = void 0;
        if (K.nbformat > 4 || K.nbformat === 4 && K.nbformat_minor >= 5) {
          if (F === "insert") E = Math.random().toString(36).substring(2, 15);
          else if (B !== null) E = B
        }
        if (F === "delete") K.cells.splice(V, 1);
        else if (F === "insert") {
          let L;
          if (G === "markdown") L = {
            cell_type: "markdown",
            id: E,
            source: Q,
            metadata: {}
          };
          else L = {
            cell_type: "code",
            id: E,
            source: Q,
            metadata: {},
            execution_count: null,
            outputs: []
          };
          K.cells.splice(V, 0, L)
        } else {
          let L = K.cells[V];
          if (L.source = Q, L.cell_type === "code") L.execution_count = null, L.outputs = [];
          if (G && G !== L.cell_type) L.cell_type = G
        }
        let z = _c(I),
          $ = eA(K, null, 1);
        return ns(I, $, D, z), {
          data: {
            new_source: Q,
            cell_type: G ?? "code",
            language: H,
            edit_mode: F ?? "replace",
            cell_id: E || void 0,
            error: "",
            notebook_path: I,
            original_file: W,
            updated_file: $
          }
        }
      } catch (D) {
        if (D instanceof Error) return {
          data: {
            new_source: Q,
            cell_type: G ?? "code",
            language: "python",
            edit_mode: "replace",
            error: D.message,
            cell_id: B,
            notebook_path: I,
            original_file: "",
            updated_file: ""
          }
        };
        return {
          data: {
            new_source: Q,
            cell_type: G ?? "code",
            language: "python",
            edit_mode: "replace",
            error: "Unknown error occurred while editing notebook",
            cell_id: B,
            notebook_path: I,
            original_file: "",
            updated_file: ""
          }
        }
      }
    }
  }
})
// @from(Ln 337125, Col 4)
SHA = U((G0Y, Ik2) => {
  Ik2.exports = m6A;
  m6A.CAPTURING_PHASE = 1;
  m6A.AT_TARGET = 2;
  m6A.BUBBLING_PHASE = 3;

  function m6A(A, Q) {
    if (this.type = "", this.target = null, this.currentTarget = null, this.eventPhase = m6A.AT_TARGET, this.bubbles = !1, this.cancelable = !1, this.isTrusted = !1, this.defaultPrevented = !1, this.timeStamp = Date.now(), this._propagationStopped = !1, this._immediatePropagationStopped = !1, this._initialized = !0, this._dispatching = !1, A) this.type = A;
    if (Q)
      for (var B in Q) this[B] = Q[B]
  }
  m6A.prototype = Object.create(Object.prototype, {
    constructor: {
      value: m6A
    },
    stopPropagation: {
      value: function () {
        this._propagationStopped = !0
      }
    },
    stopImmediatePropagation: {
      value: function () {
        this._propagationStopped = !0, this._immediatePropagationStopped = !0
      }
    },
    preventDefault: {
      value: function () {
        if (this.cancelable) this.defaultPrevented = !0
      }
    },
    initEvent: {
      value: function (Q, B, G) {
        if (this._initialized = !0, this._dispatching) return;
        this._propagationStopped = !1, this._immediatePropagationStopped = !1, this.defaultPrevented = !1, this.isTrusted = !1, this.target = null, this.type = Q, this.bubbles = B, this.cancelable = G
      }
    }
  })
})
// @from(Ln 337163, Col 4)
BC0 = U((Z0Y, Wk2) => {
  var Dk2 = SHA();
  Wk2.exports = QC0;

  function QC0() {
    Dk2.call(this), this.view = null, this.detail = 0
  }
  QC0.prototype = Object.create(Dk2.prototype, {
    constructor: {
      value: QC0
    },
    initUIEvent: {
      value: function (A, Q, B, G, Z) {
        this.initEvent(A, Q, B), this.view = G, this.detail = Z
      }
    }
  })
})
// @from(Ln 337181, Col 4)
ZC0 = U((Y0Y, Vk2) => {
  var Kk2 = BC0();
  Vk2.exports = GC0;

  function GC0() {
    Kk2.call(this), this.screenX = this.screenY = this.clientX = this.clientY = 0, this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = !1, this.button = 0, this.buttons = 1, this.relatedTarget = null
  }
  GC0.prototype = Object.create(Kk2.prototype, {
    constructor: {
      value: GC0
    },
    initMouseEvent: {
      value: function (A, Q, B, G, Z, Y, J, X, I, D, W, K, V, F, H) {
        switch (this.initEvent(A, Q, B, G, Z), this.screenX = Y, this.screenY = J, this.clientX = X, this.clientY = I, this.ctrlKey = D, this.altKey = W, this.shiftKey = K, this.metaKey = V, this.button = F, F) {
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
        this.relatedTarget = H
      }
    },
    getModifierState: {
      value: function (A) {
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
// @from(Ln 337229, Col 4)
wW1 = U((J0Y, Hk2) => {
  Hk2.exports = NW1;
  var yu5 = 1,
    vu5 = 3,
    ku5 = 4,
    bu5 = 5,
    fu5 = 7,
    hu5 = 8,
    gu5 = 9,
    uu5 = 11,
    mu5 = 12,
    du5 = 13,
    cu5 = 14,
    pu5 = 15,
    lu5 = 17,
    iu5 = 18,
    nu5 = 19,
    au5 = 20,
    ou5 = 21,
    ru5 = 22,
    su5 = 23,
    tu5 = 24,
    eu5 = 25,
    Am5 = [null, "INDEX_SIZE_ERR", null, "HIERARCHY_REQUEST_ERR", "WRONG_DOCUMENT_ERR", "INVALID_CHARACTER_ERR", null, "NO_MODIFICATION_ALLOWED_ERR", "NOT_FOUND_ERR", "NOT_SUPPORTED_ERR", "INUSE_ATTRIBUTE_ERR", "INVALID_STATE_ERR", "SYNTAX_ERR", "INVALID_MODIFICATION_ERR", "NAMESPACE_ERR", "INVALID_ACCESS_ERR", null, "TYPE_MISMATCH_ERR", "SECURITY_ERR", "NETWORK_ERR", "ABORT_ERR", "URL_MISMATCH_ERR", "QUOTA_EXCEEDED_ERR", "TIMEOUT_ERR", "INVALID_NODE_TYPE_ERR", "DATA_CLONE_ERR"],
    Qm5 = [null, "INDEX_SIZE_ERR (1): the index is not in the allowed range", null, "HIERARCHY_REQUEST_ERR (3): the operation would yield an incorrect nodes model", "WRONG_DOCUMENT_ERR (4): the object is in the wrong Document, a call to importNode is required", "INVALID_CHARACTER_ERR (5): the string contains invalid characters", null, "NO_MODIFICATION_ALLOWED_ERR (7): the object can not be modified", "NOT_FOUND_ERR (8): the object can not be found here", "NOT_SUPPORTED_ERR (9): this operation is not supported", "INUSE_ATTRIBUTE_ERR (10): setAttributeNode called on owned Attribute", "INVALID_STATE_ERR (11): the object is in an invalid state", "SYNTAX_ERR (12): the string did not match the expected pattern", "INVALID_MODIFICATION_ERR (13): the object can not be modified in this way", "NAMESPACE_ERR (14): the operation is not allowed by Namespaces in XML", "INVALID_ACCESS_ERR (15): the object does not support the operation or argument", null, "TYPE_MISMATCH_ERR (17): the type of the object does not match the expected type", "SECURITY_ERR (18): the operation is insecure", "NETWORK_ERR (19): a network error occurred", "ABORT_ERR (20): the user aborted an operation", "URL_MISMATCH_ERR (21): the given URL does not match another URL", "QUOTA_EXCEEDED_ERR (22): the quota has been exceeded", "TIMEOUT_ERR (23): a timeout occurred", "INVALID_NODE_TYPE_ERR (24): the supplied node is invalid or has an invalid ancestor for this operation", "DATA_CLONE_ERR (25): the object can not be cloned."],
    Fk2 = {
      INDEX_SIZE_ERR: yu5,
      DOMSTRING_SIZE_ERR: 2,
      HIERARCHY_REQUEST_ERR: vu5,
      WRONG_DOCUMENT_ERR: ku5,
      INVALID_CHARACTER_ERR: bu5,
      NO_DATA_ALLOWED_ERR: 6,
      NO_MODIFICATION_ALLOWED_ERR: fu5,
      NOT_FOUND_ERR: hu5,
      NOT_SUPPORTED_ERR: gu5,
      INUSE_ATTRIBUTE_ERR: 10,
      INVALID_STATE_ERR: uu5,
      SYNTAX_ERR: mu5,
      INVALID_MODIFICATION_ERR: du5,
      NAMESPACE_ERR: cu5,
      INVALID_ACCESS_ERR: pu5,
      VALIDATION_ERR: 16,
      TYPE_MISMATCH_ERR: lu5,
      SECURITY_ERR: iu5,
      NETWORK_ERR: nu5,
      ABORT_ERR: au5,
      URL_MISMATCH_ERR: ou5,
      QUOTA_EXCEEDED_ERR: ru5,
      TIMEOUT_ERR: su5,
      INVALID_NODE_TYPE_ERR: tu5,
      DATA_CLONE_ERR: eu5
    };

  function NW1(A) {
    Error.call(this), Error.captureStackTrace(this, this.constructor), this.code = A, this.message = Qm5[A], this.name = Am5[A]
  }
  NW1.prototype.__proto__ = Error.prototype;
  for (zbA in Fk2) qW1 = {
    value: Fk2[zbA]
  }, Object.defineProperty(NW1, zbA, qW1), Object.defineProperty(NW1.prototype, zbA, qW1);
  var qW1, zbA
})
// @from(Ln 337291, Col 4)
LW1 = U((Bm5) => {
  Bm5.isApiWritable = !globalThis.__domino_frozen__
})
// @from(Ln 337294, Col 4)
BD = U((Ym5) => {
  var QD = wW1(),
    QW = QD,
    Zm5 = LW1().isApiWritable;
  Ym5.NAMESPACE = {
    HTML: "http://www.w3.org/1999/xhtml",
    XML: "http://www.w3.org/XML/1998/namespace",
    XMLNS: "http://www.w3.org/2000/xmlns/",
    MATHML: "http://www.w3.org/1998/Math/MathML",
    SVG: "http://www.w3.org/2000/svg",
    XLINK: "http://www.w3.org/1999/xlink"
  };
  Ym5.IndexSizeError = function () {
    throw new QD(QW.INDEX_SIZE_ERR)
  };
  Ym5.HierarchyRequestError = function () {
    throw new QD(QW.HIERARCHY_REQUEST_ERR)
  };
  Ym5.WrongDocumentError = function () {
    throw new QD(QW.WRONG_DOCUMENT_ERR)
  };
  Ym5.InvalidCharacterError = function () {
    throw new QD(QW.INVALID_CHARACTER_ERR)
  };
  Ym5.NoModificationAllowedError = function () {
    throw new QD(QW.NO_MODIFICATION_ALLOWED_ERR)
  };
  Ym5.NotFoundError = function () {
    throw new QD(QW.NOT_FOUND_ERR)
  };
  Ym5.NotSupportedError = function () {
    throw new QD(QW.NOT_SUPPORTED_ERR)
  };
  Ym5.InvalidStateError = function () {
    throw new QD(QW.INVALID_STATE_ERR)
  };
  Ym5.SyntaxError = function () {
    throw new QD(QW.SYNTAX_ERR)
  };
  Ym5.InvalidModificationError = function () {
    throw new QD(QW.INVALID_MODIFICATION_ERR)
  };
  Ym5.NamespaceError = function () {
    throw new QD(QW.NAMESPACE_ERR)
  };
  Ym5.InvalidAccessError = function () {
    throw new QD(QW.INVALID_ACCESS_ERR)
  };
  Ym5.TypeMismatchError = function () {
    throw new QD(QW.TYPE_MISMATCH_ERR)
  };
  Ym5.SecurityError = function () {
    throw new QD(QW.SECURITY_ERR)
  };
  Ym5.NetworkError = function () {
    throw new QD(QW.NETWORK_ERR)
  };
  Ym5.AbortError = function () {
    throw new QD(QW.ABORT_ERR)
  };
  Ym5.UrlMismatchError = function () {
    throw new QD(QW.URL_MISMATCH_ERR)
  };
  Ym5.QuotaExceededError = function () {
    throw new QD(QW.QUOTA_EXCEEDED_ERR)
  };
  Ym5.TimeoutError = function () {
    throw new QD(QW.TIMEOUT_ERR)
  };
  Ym5.InvalidNodeTypeError = function () {
    throw new QD(QW.INVALID_NODE_TYPE_ERR)
  };
  Ym5.DataCloneError = function () {
    throw new QD(QW.DATA_CLONE_ERR)
  };
  Ym5.nyi = function () {
    throw Error("NotYetImplemented")
  };
  Ym5.shouldOverride = function () {
    throw Error("Abstract function; should be overriding in subclass.")
  };
  Ym5.assert = function (A, Q) {
    if (!A) throw Error("Assertion failed: " + (Q || "") + `
` + Error().stack)
  };
  Ym5.expose = function (A, Q) {
    for (var B in A) Object.defineProperty(Q.prototype, B, {
      value: A[B],
      writable: Zm5
    })
  };
  Ym5.merge = function (A, Q) {
    for (var B in Q) A[B] = Q[B]
  };
  Ym5.documentOrder = function (A, Q) {
    return 3 - (A.compareDocumentPosition(Q) & 6)
  };
  Ym5.toASCIILowerCase = function (A) {
    return A.replace(/[A-Z]+/g, function (Q) {
      return Q.toLowerCase()
    })
  };
  Ym5.toASCIIUpperCase = function (A) {
    return A.replace(/[a-z]+/g, function (Q) {
      return Q.toUpperCase()
    })
  }
})
// @from(Ln 337402, Col 4)
YC0 = U((D0Y, zk2) => {
  var d6A = SHA(),
    bm5 = ZC0(),
    fm5 = BD();
  zk2.exports = Ek2;

  function Ek2() {}
  Ek2.prototype = {
    addEventListener: function (Q, B, G) {
      if (!B) return;
      if (G === void 0) G = !1;
      if (!this._listeners) this._listeners = Object.create(null);
      if (!this._listeners[Q]) this._listeners[Q] = [];
      var Z = this._listeners[Q];
      for (var Y = 0, J = Z.length; Y < J; Y++) {
        var X = Z[Y];
        if (X.listener === B && X.capture === G) return
      }
      var I = {
        listener: B,
        capture: G
      };
      if (typeof B === "function") I.f = B;
      Z.push(I)
    },
    removeEventListener: function (Q, B, G) {
      if (G === void 0) G = !1;
      if (this._listeners) {
        var Z = this._listeners[Q];
        if (Z)
          for (var Y = 0, J = Z.length; Y < J; Y++) {
            var X = Z[Y];
            if (X.listener === B && X.capture === G) {
              if (Z.length === 1) this._listeners[Q] = void 0;
              else Z.splice(Y, 1);
              return
            }
          }
      }
    },
    dispatchEvent: function (Q) {
      return this._dispatchEvent(Q, !1)
    },
    _dispatchEvent: function (Q, B) {
      if (typeof B !== "boolean") B = !1;

      function G(D, W) {
        var {
          type: K,
          eventPhase: V
        } = W;
        if (W.currentTarget = D, V !== d6A.CAPTURING_PHASE && D._handlers && D._handlers[K]) {
          var F = D._handlers[K],
            H;
          if (typeof F === "function") H = F.call(W.currentTarget, W);
          else {
            var E = F.handleEvent;
            if (typeof E !== "function") throw TypeError("handleEvent property of event handler object isnot a function.");
            H = E.call(F, W)
          }
          switch (W.type) {
            case "mouseover":
              if (H === !0) W.preventDefault();
              break;
            case "beforeunload":
            default:
              if (H === !1) W.preventDefault();
              break
          }
        }
        var z = D._listeners && D._listeners[K];
        if (!z) return;
        z = z.slice();
        for (var $ = 0, O = z.length; $ < O; $++) {
          if (W._immediatePropagationStopped) return;
          var L = z[$];
          if (V === d6A.CAPTURING_PHASE && !L.capture || V === d6A.BUBBLING_PHASE && L.capture) continue;
          if (L.f) L.f.call(W.currentTarget, W);
          else {
            var M = L.listener.handleEvent;
            if (typeof M !== "function") throw TypeError("handleEvent property of event listener object is not a function.");
            M.call(L.listener, W)
          }
        }
      }
      if (!Q._initialized || Q._dispatching) fm5.InvalidStateError();
      Q.isTrusted = B, Q._dispatching = !0, Q.target = this;
      var Z = [];
      for (var Y = this.parentNode; Y; Y = Y.parentNode) Z.push(Y);
      Q.eventPhase = d6A.CAPTURING_PHASE;
      for (var J = Z.length - 1; J >= 0; J--)
        if (G(Z[J], Q), Q._propagationStopped) break;
      if (!Q._propagationStopped) Q.eventPhase = d6A.AT_TARGET, G(this, Q);
      if (Q.bubbles && !Q._propagationStopped) {
        Q.eventPhase = d6A.BUBBLING_PHASE;
        for (var X = 0, I = Z.length; X < I; X++)
          if (G(Z[X], Q), Q._propagationStopped) break
      }
      if (Q._dispatching = !1, Q.eventPhase = d6A.AT_TARGET, Q.currentTarget = null, B && !Q.defaultPrevented && Q instanceof bm5) switch (Q.type) {
        case "mousedown":
          this._armed = {
            x: Q.clientX,
            y: Q.clientY,
            t: Q.timeStamp
          };
          break;
        case "mouseout":
        case "mouseover":
          this._armed = null;
          break;
        case "mouseup":
          if (this._isClick(Q)) this._doClick(Q);
          this._armed = null;
          break
      }
      return !Q.defaultPrevented
    },
    _isClick: function (A) {
      return this._armed !== null && A.type === "mouseup" && A.isTrusted && A.button === 0 && A.timeStamp - this._armed.t < 1000 && Math.abs(A.clientX - this._armed.x) < 10 && Math.abs(A.clientY - this._armed.Y) < 10
    },
    _doClick: function (A) {
      if (this._click_in_progress) return;
      this._click_in_progress = !0;
      var Q = this;
      while (Q && !Q._post_click_activation_steps) Q = Q.parentNode;
      if (Q && Q._pre_click_activation_steps) Q._pre_click_activation_steps();
      var B = this.ownerDocument.createEvent("MouseEvent");
      B.initMouseEvent("click", !0, !0, this.ownerDocument.defaultView, 1, A.screenX, A.screenY, A.clientX, A.clientY, A.ctrlKey, A.altKey, A.shiftKey, A.metaKey, A.button, null);
      var G = this._dispatchEvent(B, !0);
      if (Q) {
        if (G) {
          if (Q._post_click_activation_steps) Q._post_click_activation_steps(B)
        } else if (Q._cancelled_activation_steps) Q._cancelled_activation_steps()
      }
    },
    _setEventHandler: function (Q, B) {
      if (!this._handlers) this._handlers = Object.create(null);
      this._handlers[Q] = B
    },
    _getEventHandler: function (Q) {
      return this._handlers && this._handlers[Q] || null
    }
  }
})
// @from(Ln 337546, Col 4)
JC0 = U((W0Y, $k2) => {
  var Pc = BD(),
    Qj = $k2.exports = {
      valid: function (A) {
        return Pc.assert(A, "list falsy"), Pc.assert(A._previousSibling, "previous falsy"), Pc.assert(A._nextSibling, "next falsy"), !0
      },
      insertBefore: function (A, Q) {
        Pc.assert(Qj.valid(A) && Qj.valid(Q));
        var B = A,
          G = A._previousSibling,
          Z = Q,
          Y = Q._previousSibling;
        B._previousSibling = Y, G._nextSibling = Z, Y._nextSibling = B, Z._previousSibling = G, Pc.assert(Qj.valid(A) && Qj.valid(Q))
      },
      replace: function (A, Q) {
        if (Pc.assert(Qj.valid(A) && (Q === null || Qj.valid(Q))), Q !== null) Qj.insertBefore(Q, A);
        Qj.remove(A), Pc.assert(Qj.valid(A) && (Q === null || Qj.valid(Q)))
      },
      remove: function (A) {
        Pc.assert(Qj.valid(A));
        var Q = A._previousSibling;
        if (Q === A) return;
        var B = A._nextSibling;
        Q._nextSibling = B, B._previousSibling = Q, A._previousSibling = A._nextSibling = A, Pc.assert(Qj.valid(A))
      }
    }
})
// @from(Ln 337573, Col 4)
XC0 = U((K0Y, Mk2) => {
  Mk2.exports = {
    serializeOne: pm5,
    ɵescapeMatchingClosingTag: wk2,
    ɵescapeClosingCommentTag: Lk2,
    ɵescapeProcessingInstructionContent: Ok2
  };
  var Nk2 = BD(),
    c6A = Nk2.NAMESPACE,
    Ck2 = {
      STYLE: !0,
      SCRIPT: !0,
      XMP: !0,
      IFRAME: !0,
      NOEMBED: !0,
      NOFRAMES: !0,
      PLAINTEXT: !0
    },
    hm5 = {
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
    gm5 = {},
    Uk2 = /[&<>\u00A0]/g,
    qk2 = /[&"<>\u00A0]/g;

  function um5(A) {
    if (!Uk2.test(A)) return A;
    return A.replace(Uk2, (Q) => {
      switch (Q) {
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

  function mm5(A) {
    if (!qk2.test(A)) return A;
    return A.replace(qk2, (Q) => {
      switch (Q) {
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

  function dm5(A) {
    var Q = A.namespaceURI;
    if (!Q) return A.localName;
    if (Q === c6A.XML) return "xml:" + A.localName;
    if (Q === c6A.XLINK) return "xlink:" + A.localName;
    if (Q === c6A.XMLNS)
      if (A.localName === "xmlns") return "xmlns";
      else return "xmlns:" + A.localName;
    return A.name
  }

  function wk2(A, Q) {
    let B = "</" + Q;
    if (!A.toLowerCase().includes(B)) return A;
    let G = [...A],
      Z = A.matchAll(new RegExp(B, "ig"));
    for (let Y of Z) G[Y.index] = "&lt;";
    return G.join("")
  }
  var cm5 = /--!?>/;

  function Lk2(A) {
    if (!cm5.test(A)) return A;
    return A.replace(/(--\!?)>/g, "$1&gt;")
  }

  function Ok2(A) {
    return A.includes(">") ? A.replaceAll(">", "&gt;") : A
  }

  function pm5(A, Q) {
    var B = "";
    switch (A.nodeType) {
      case 1:
        var G = A.namespaceURI,
          Z = G === c6A.HTML,
          Y = Z || G === c6A.SVG || G === c6A.MATHML ? A.localName : A.tagName;
        B += "<" + Y;
        for (var J = 0, X = A._numattrs; J < X; J++) {
          var I = A._attr(J);
          if (B += " " + dm5(I), I.value !== void 0) B += '="' + mm5(I.value) + '"'
        }
        if (B += ">", !(Z && hm5[Y])) {
          var D = A.serialize();
          if (Ck2[Y.toUpperCase()]) D = wk2(D, Y);
          if (Z && gm5[Y] && D.charAt(0) === `
`) B += `
`;
          B += D, B += "</" + Y + ">"
        }
        break;
      case 3:
      case 4:
        var W;
        if (Q.nodeType === 1 && Q.namespaceURI === c6A.HTML) W = Q.tagName;
        else W = "";
        if (Ck2[W] || W === "NOSCRIPT" && Q.ownerDocument._scripting_enabled) B += A.data;
        else B += um5(A.data);
        break;
      case 8:
        B += "<!--" + Lk2(A.data) + "-->";
        break;
      case 7:
        let K = Ok2(A.data);
        B += "<?" + A.target + " " + K + "?>";
        break;
      case 10:
        B += "<!DOCTYPE " + A.name, B += ">";
        break;
      default:
        Nk2.InvalidStateError()
    }
    return B
  }
})
// @from(Ln 337724, Col 4)
ME = U((V0Y, Sk2) => {
  Sk2.exports = SX;
  var Pk2 = YC0(),
    OW1 = JC0(),
    Rk2 = XC0(),
    VG = BD();

  function SX() {
    Pk2.call(this), this.parentNode = null, this._nextSibling = this._previousSibling = this, this._index = void 0
  }
  var eN = SX.ELEMENT_NODE = 1,
    IC0 = SX.ATTRIBUTE_NODE = 2,
    MW1 = SX.TEXT_NODE = 3,
    lm5 = SX.CDATA_SECTION_NODE = 4,
    im5 = SX.ENTITY_REFERENCE_NODE = 5,
    DC0 = SX.ENTITY_NODE = 6,
    _k2 = SX.PROCESSING_INSTRUCTION_NODE = 7,
    jk2 = SX.COMMENT_NODE = 8,
    $bA = SX.DOCUMENT_NODE = 9,
    Bj = SX.DOCUMENT_TYPE_NODE = 10,
    os = SX.DOCUMENT_FRAGMENT_NODE = 11,
    WC0 = SX.NOTATION_NODE = 12,
    KC0 = SX.DOCUMENT_POSITION_DISCONNECTED = 1,
    VC0 = SX.DOCUMENT_POSITION_PRECEDING = 2,
    FC0 = SX.DOCUMENT_POSITION_FOLLOWING = 4,
    Tk2 = SX.DOCUMENT_POSITION_CONTAINS = 8,
    HC0 = SX.DOCUMENT_POSITION_CONTAINED_BY = 16,
    EC0 = SX.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
  SX.prototype = Object.create(Pk2.prototype, {
    baseURI: {
      get: VG.nyi
    },
    parentElement: {
      get: function () {
        return this.parentNode && this.parentNode.nodeType === eN ? this.parentNode : null
      }
    },
    hasChildNodes: {
      value: VG.shouldOverride
    },
    firstChild: {
      get: VG.shouldOverride
    },
    lastChild: {
      get: VG.shouldOverride
    },
    isConnected: {
      get: function () {
        let A = this;
        while (A != null) {
          if (A.nodeType === SX.DOCUMENT_NODE) return !0;
          if (A = A.parentNode, A != null && A.nodeType === SX.DOCUMENT_FRAGMENT_NODE) A = A.host
        }
        return !1
      }
    },
    previousSibling: {
      get: function () {
        var A = this.parentNode;
        if (!A) return null;
        if (this === A.firstChild) return null;
        return this._previousSibling
      }
    },
    nextSibling: {
      get: function () {
        var A = this.parentNode,
          Q = this._nextSibling;
        if (!A) return null;
        if (Q === A.firstChild) return null;
        return Q
      }
    },
    textContent: {
      get: function () {
        return null
      },
      set: function (A) {}
    },
    innerText: {
      get: function () {
        return null
      },
      set: function (A) {}
    },
    _countChildrenOfType: {
      value: function (A) {
        var Q = 0;
        for (var B = this.firstChild; B !== null; B = B.nextSibling)
          if (B.nodeType === A) Q++;
        return Q
      }
    },
    _ensureInsertValid: {
      value: function (Q, B, G) {
        var Z = this,
          Y, J;
        if (!Q.nodeType) throw TypeError("not a node");
        switch (Z.nodeType) {
          case $bA:
          case os:
          case eN:
            break;
          default:
            VG.HierarchyRequestError()
        }
        if (Q.isAncestor(Z)) VG.HierarchyRequestError();
        if (B !== null || !G) {
          if (B.parentNode !== Z) VG.NotFoundError()
        }
        switch (Q.nodeType) {
          case os:
          case Bj:
          case eN:
          case MW1:
          case _k2:
          case jk2:
            break;
          default:
            VG.HierarchyRequestError()
        }
        if (Z.nodeType === $bA) switch (Q.nodeType) {
          case MW1:
            VG.HierarchyRequestError();
            break;
          case os:
            if (Q._countChildrenOfType(MW1) > 0) VG.HierarchyRequestError();
            switch (Q._countChildrenOfType(eN)) {
              case 0:
                break;
              case 1:
                if (B !== null) {
                  if (G && B.nodeType === Bj) VG.HierarchyRequestError();
                  for (J = B.nextSibling; J !== null; J = J.nextSibling)
                    if (J.nodeType === Bj) VG.HierarchyRequestError()
                }
                if (Y = Z._countChildrenOfType(eN), G) {
                  if (Y > 0) VG.HierarchyRequestError()
                } else if (Y > 1 || Y === 1 && B.nodeType !== eN) VG.HierarchyRequestError();
                break;
              default:
                VG.HierarchyRequestError()
            }
            break;
          case eN:
            if (B !== null) {
              if (G && B.nodeType === Bj) VG.HierarchyRequestError();
              for (J = B.nextSibling; J !== null; J = J.nextSibling)
                if (J.nodeType === Bj) VG.HierarchyRequestError()
            }
            if (Y = Z._countChildrenOfType(eN), G) {
              if (Y > 0) VG.HierarchyRequestError()
            } else if (Y > 1 || Y === 1 && B.nodeType !== eN) VG.HierarchyRequestError();
            break;
          case Bj:
            if (B === null) {
              if (Z._countChildrenOfType(eN)) VG.HierarchyRequestError()
            } else
              for (J = Z.firstChild; J !== null; J = J.nextSibling) {
                if (J === B) break;
                if (J.nodeType === eN) VG.HierarchyRequestError()
              }
            if (Y = Z._countChildrenOfType(Bj), G) {
              if (Y > 0) VG.HierarchyRequestError()
            } else if (Y > 1 || Y === 1 && B.nodeType !== Bj) VG.HierarchyRequestError();
            break
        } else if (Q.nodeType === Bj) VG.HierarchyRequestError()
      }
    },
    insertBefore: {
      value: function (Q, B) {
        var G = this;
        G._ensureInsertValid(Q, B, !0);
        var Z = B;
        if (Z === Q) Z = Q.nextSibling;
        return G.doc.adoptNode(Q), Q._insertOrReplace(G, Z, !1), Q
      }
    },
    appendChild: {
      value: function (A) {
        return this.insertBefore(A, null)
      }
    },
    _appendChild: {
      value: function (A) {
        A._insertOrReplace(this, null, !1)
      }
    },
    removeChild: {
      value: function (Q) {
        var B = this;
        if (!Q.nodeType) throw TypeError("not a node");
        if (Q.parentNode !== B) VG.NotFoundError();
        return Q.remove(), Q
      }
    },
    replaceChild: {
      value: function (Q, B) {
        var G = this;
        if (G._ensureInsertValid(Q, B, !1), Q.doc !== G.doc) G.doc.adoptNode(Q);
        return Q._insertOrReplace(G, B, !0), B
      }
    },
    contains: {
      value: function (Q) {
        if (Q === null) return !1;
        if (this === Q) return !0;
        return (this.compareDocumentPosition(Q) & HC0) !== 0
      }
    },
    compareDocumentPosition: {
      value: function (Q) {
        if (this === Q) return 0;
        if (this.doc !== Q.doc || this.rooted !== Q.rooted) return KC0 + EC0;
        var B = [],
          G = [];
        for (var Z = this; Z !== null; Z = Z.parentNode) B.push(Z);
        for (Z = Q; Z !== null; Z = Z.parentNode) G.push(Z);
        if (B.reverse(), G.reverse(), B[0] !== G[0]) return KC0 + EC0;
        Z = Math.min(B.length, G.length);
        for (var Y = 1; Y < Z; Y++)
          if (B[Y] !== G[Y])
            if (B[Y].index < G[Y].index) return FC0;
            else return VC0;
        if (B.length < G.length) return FC0 + HC0;
        else return VC0 + Tk2
      }
    },
    isSameNode: {
      value: function (Q) {
        return this === Q
      }
    },
    isEqualNode: {
      value: function (Q) {
        if (!Q) return !1;
        if (Q.nodeType !== this.nodeType) return !1;
        if (!this.isEqual(Q)) return !1;
        for (var B = this.firstChild, G = Q.firstChild; B && G; B = B.nextSibling, G = G.nextSibling)
          if (!B.isEqualNode(G)) return !1;
        return B === null && G === null
      }
    },
    cloneNode: {
      value: function (A) {
        var Q = this.clone();
        if (A)
          for (var B = this.firstChild; B !== null; B = B.nextSibling) Q._appendChild(B.cloneNode(!0));
        return Q
      }
    },
    lookupPrefix: {
      value: function (Q) {
        var B;
        if (Q === "" || Q === null || Q === void 0) return null;
        switch (this.nodeType) {
          case eN:
            return this._lookupNamespacePrefix(Q, this);
          case $bA:
            return B = this.documentElement, B ? B.lookupPrefix(Q) : null;
          case DC0:
          case WC0:
          case os:
          case Bj:
            return null;
          case IC0:
            return B = this.ownerElement, B ? B.lookupPrefix(Q) : null;
          default:
            return B = this.parentElement, B ? B.lookupPrefix(Q) : null
        }
      }
    },
    lookupNamespaceURI: {
      value: function (Q) {
        if (Q === "" || Q === void 0) Q = null;
        var B;
        switch (this.nodeType) {
          case eN:
            return VG.shouldOverride();
          case $bA:
            return B = this.documentElement, B ? B.lookupNamespaceURI(Q) : null;
          case DC0:
          case WC0:
          case Bj:
          case os:
            return null;
          case IC0:
            return B = this.ownerElement, B ? B.lookupNamespaceURI(Q) : null;
          default:
            return B = this.parentElement, B ? B.lookupNamespaceURI(Q) : null
        }
      }
    },
    isDefaultNamespace: {
      value: function (Q) {
        if (Q === "" || Q === void 0) Q = null;
        var B = this.lookupNamespaceURI(null);
        return B === Q
      }
    },
    index: {
      get: function () {
        var A = this.parentNode;
        if (this === A.firstChild) return 0;
        var Q = A.childNodes;
        if (this._index === void 0 || Q[this._index] !== this) {
          for (var B = 0; B < Q.length; B++) Q[B]._index = B;
          VG.assert(Q[this._index] === this)
        }
        return this._index
      }
    },
    isAncestor: {
      value: function (A) {
        if (this.doc !== A.doc) return !1;
        if (this.rooted !== A.rooted) return !1;
        for (var Q = A; Q; Q = Q.parentNode)
          if (Q === this) return !0;
        return !1
      }
    },
    ensureSameDoc: {
      value: function (A) {
        if (A.ownerDocument === null) A.ownerDocument = this.doc;
        else if (A.ownerDocument !== this.doc) VG.WrongDocumentError()
      }
    },
    removeChildren: {
      value: VG.shouldOverride
    },
    _insertOrReplace: {
      value: function (Q, B, G) {
        var Z = this,
          Y, J;
        if (Z.nodeType === os && Z.rooted) VG.HierarchyRequestError();
        if (Q._childNodes) {
          if (Y = B === null ? Q._childNodes.length : B.index, Z.parentNode === Q) {
            var X = Z.index;
            if (X < Y) Y--
          }
        }
        if (G) {
          if (B.rooted) B.doc.mutateRemove(B);
          B.parentNode = null
        }
        var I = B;
        if (I === null) I = Q.firstChild;
        var D = Z.rooted && Q.rooted;
        if (Z.nodeType === os) {
          var W = [0, G ? 1 : 0],
            K;
          for (var V = Z.firstChild; V !== null; V = K) K = V.nextSibling, W.push(V), V.parentNode = Q;
          var F = W.length;
          if (G) OW1.replace(I, F > 2 ? W[2] : null);
          else if (F > 2 && I !== null) OW1.insertBefore(W[2], I);
          if (Q._childNodes) {
            W[0] = B === null ? Q._childNodes.length : B._index, Q._childNodes.splice.apply(Q._childNodes, W);
            for (J = 2; J < F; J++) W[J]._index = W[0] + (J - 2)
          } else if (Q._firstChild === B) {
            if (F > 2) Q._firstChild = W[2];
            else if (G) Q._firstChild = null
          }
          if (Z._childNodes) Z._childNodes.length = 0;
          else Z._firstChild = null;
          if (Q.rooted) {
            Q.modify();
            for (J = 2; J < F; J++) Q.doc.mutateInsert(W[J])
          }
        } else {
          if (B === Z) return;
          if (D) Z._remove();
          else if (Z.parentNode) Z.remove();
          if (Z.parentNode = Q, G) {
            if (OW1.replace(I, Z), Q._childNodes) Z._index = Y, Q._childNodes[Y] = Z;
            else if (Q._firstChild === B) Q._firstChild = Z
          } else {
            if (I !== null) OW1.insertBefore(Z, I);
            if (Q._childNodes) Z._index = Y, Q._childNodes.splice(Y, 0, Z);
            else if (Q._firstChild === B) Q._firstChild = Z
          }
          if (D) Q.modify(), Q.doc.mutateMove(Z);
          else if (Q.rooted) Q.modify(), Q.doc.mutateInsert(Z)
        }
      }
    },
    lastModTime: {
      get: function () {
        if (!this._lastModTime) this._lastModTime = this.doc.modclock;
        return this._lastModTime
      }
    },
    modify: {
      value: function () {
        if (this.doc.modclock) {
          var A = ++this.doc.modclock;
          for (var Q = this; Q; Q = Q.parentElement)
            if (Q._lastModTime) Q._lastModTime = A
        }
      }
    },
    doc: {
      get: function () {
        return this.ownerDocument || this
      }
    },
    rooted: {
      get: function () {
        return !!this._nid
      }
    },
    normalize: {
      value: function () {
        var A;
        for (var Q = this.firstChild; Q !== null; Q = A) {
          if (A = Q.nextSibling, Q.normalize) Q.normalize();
          if (Q.nodeType !== SX.TEXT_NODE) continue;
          if (Q.nodeValue === "") {
            this.removeChild(Q);
            continue
          }
          var B = Q.previousSibling;
          if (B === null) continue;
          else if (B.nodeType === SX.TEXT_NODE) B.appendData(Q.nodeValue), this.removeChild(Q)
        }
      }
    },
    serialize: {
      value: function () {
        if (this._innerHTML) return this._innerHTML;
        var A = "";
        for (var Q = this.firstChild; Q !== null; Q = Q.nextSibling) A += Rk2.serializeOne(Q, this);
        return A
      }
    },
    outerHTML: {
      get: function () {
        return Rk2.serializeOne(this, {
          nodeType: 0
        })
      },
      set: VG.nyi
    },
    ELEMENT_NODE: {
      value: eN
    },
    ATTRIBUTE_NODE: {
      value: IC0
    },
    TEXT_NODE: {
      value: MW1
    },
    CDATA_SECTION_NODE: {
      value: lm5
    },
    ENTITY_REFERENCE_NODE: {
      value: im5
    },
    ENTITY_NODE: {
      value: DC0
    },
    PROCESSING_INSTRUCTION_NODE: {
      value: _k2
    },
    COMMENT_NODE: {
      value: jk2
    },
    DOCUMENT_NODE: {
      value: $bA
    },
    DOCUMENT_TYPE_NODE: {
      value: Bj
    },
    DOCUMENT_FRAGMENT_NODE: {
      value: os
    },
    NOTATION_NODE: {
      value: WC0
    },
    DOCUMENT_POSITION_DISCONNECTED: {
      value: KC0
    },
    DOCUMENT_POSITION_PRECEDING: {
      value: VC0
    },
    DOCUMENT_POSITION_FOLLOWING: {
      value: FC0
    },
    DOCUMENT_POSITION_CONTAINS: {
      value: Tk2
    },
    DOCUMENT_POSITION_CONTAINED_BY: {
      value: HC0
    },
    DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: {
      value: EC0
    }
  })
})
// @from(Ln 338222, Col 4)
yk2 = U((F0Y, xk2) => {
  xk2.exports = class extends Array {
    constructor(Q) {
      super(Q && Q.length || 0);
      if (Q)
        for (var B in Q) this[B] = Q[B]
    }
    item(Q) {
      return this[Q] || null
    }
  }
})
// @from(Ln 338234, Col 4)
kk2 = U((H0Y, vk2) => {
  function nm5(A) {
    return this[A] || null
  }

  function am5(A) {
    if (!A) A = [];
    return A.item = nm5, A
  }
  vk2.exports = am5
})
// @from(Ln 338245, Col 4)
p6A = U((E0Y, bk2) => {
  var zC0;
  try {
    zC0 = yk2()
  } catch (A) {
    zC0 = kk2()
  }
  bk2.exports = zC0
})
// @from(Ln 338254, Col 4)
RW1 = U((z0Y, gk2) => {
  gk2.exports = hk2;
  var fk2 = ME(),
    om5 = p6A();

  function hk2() {
    fk2.call(this), this._firstChild = this._childNodes = null
  }
  hk2.prototype = Object.create(fk2.prototype, {
    hasChildNodes: {
      value: function () {
        if (this._childNodes) return this._childNodes.length > 0;
        return this._firstChild !== null
      }
    },
    childNodes: {
      get: function () {
        return this._ensureChildNodes(), this._childNodes
      }
    },
    firstChild: {
      get: function () {
        if (this._childNodes) return this._childNodes.length === 0 ? null : this._childNodes[0];
        return this._firstChild
      }
    },
    lastChild: {
      get: function () {
        var A = this._childNodes,
          Q;
        if (A) return A.length === 0 ? null : A[A.length - 1];
        if (Q = this._firstChild, Q === null) return null;
        return Q._previousSibling
      }
    },
    _ensureChildNodes: {
      value: function () {
        if (this._childNodes) return;
        var A = this._firstChild,
          Q = A,
          B = this._childNodes = new om5;
        if (A)
          do B.push(Q), Q = Q._nextSibling; while (Q !== A);
        this._firstChild = null
      }
    },
    removeChildren: {
      value: function () {
        var Q = this.rooted ? this.ownerDocument : null,
          B = this.firstChild,
          G;
        while (B !== null) {
          if (G = B, B = G.nextSibling, Q) Q.mutateRemove(G);
          G.parentNode = null
        }
        if (this._childNodes) this._childNodes.length = 0;
        else this._firstChild = null;
        this.modify()
      }
    }
  })
})