
// @from(Ln 390333, Col 4)
Ne2 = U((W87, OO0) => {
  var M3A = AzA(),
    Ve2 = QzA(),
    m37 = bt2(),
    d37 = JH1(),
    Be = Object.prototype.hasOwnProperty,
    XH1 = 1,
    Fe2 = 2,
    He2 = 3,
    IH1 = 4,
    NO0 = 1,
    c37 = 2,
    Je2 = 3,
    p37 = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,
    l37 = /[\x85\u2028\u2029]/,
    i37 = /[,\[\]\{\}]/,
    Ee2 = /^(?:!|!!|![a-z\-]+!)$/i,
    ze2 = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;

  function Xe2(A) {
    return Object.prototype.toString.call(A)
  }

  function df(A) {
    return A === 10 || A === 13
  }

  function R3A(A) {
    return A === 9 || A === 32
  }

  function Ww(A) {
    return A === 9 || A === 32 || A === 10 || A === 13
  }

  function BzA(A) {
    return A === 44 || A === 91 || A === 93 || A === 123 || A === 125
  }

  function n37(A) {
    var Q;
    if (48 <= A && A <= 57) return A - 48;
    if (Q = A | 32, 97 <= Q && Q <= 102) return Q - 97 + 10;
    return -1
  }

  function a37(A) {
    if (A === 120) return 2;
    if (A === 117) return 4;
    if (A === 85) return 8;
    return 0
  }

  function o37(A) {
    if (48 <= A && A <= 57) return A - 48;
    return -1
  }

  function Ie2(A) {
    return A === 48 ? "\x00" : A === 97 ? "\x07" : A === 98 ? "\b" : A === 116 ? "\t" : A === 9 ? "\t" : A === 110 ? `
` : A === 118 ? "\v" : A === 102 ? "\f" : A === 114 ? "\r" : A === 101 ? "\x1B" : A === 32 ? " " : A === 34 ? '"' : A === 47 ? "/" : A === 92 ? "\\" : A === 78 ? "" : A === 95 ? " " : A === 76 ? "\u2028" : A === 80 ? "\u2029" : ""
  }

  function r37(A) {
    if (A <= 65535) return String.fromCharCode(A);
    return String.fromCharCode((A - 65536 >> 10) + 55296, (A - 65536 & 1023) + 56320)
  }
  var $e2 = Array(256),
    Ce2 = Array(256);
  for (Ae = 0; Ae < 256; Ae++) $e2[Ae] = Ie2(Ae) ? 1 : 0, Ce2[Ae] = Ie2(Ae);
  var Ae;

  function s37(A, Q) {
    this.input = A, this.filename = Q.filename || null, this.schema = Q.schema || d37, this.onWarning = Q.onWarning || null, this.legacy = Q.legacy || !1, this.json = Q.json || !1, this.listener = Q.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = A.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = []
  }

  function Ue2(A, Q) {
    var B = {
      name: A.filename,
      buffer: A.input.slice(0, -1),
      position: A.position,
      line: A.line,
      column: A.position - A.lineStart
    };
    return B.snippet = m37(B), new Ve2(Q, B)
  }

  function r9(A, Q) {
    throw Ue2(A, Q)
  }

  function DH1(A, Q) {
    if (A.onWarning) A.onWarning.call(null, Ue2(A, Q))
  }
  var De2 = {
    YAML: function (Q, B, G) {
      var Z, Y, J;
      if (Q.version !== null) r9(Q, "duplication of %YAML directive");
      if (G.length !== 1) r9(Q, "YAML directive accepts exactly one argument");
      if (Z = /^([0-9]+)\.([0-9]+)$/.exec(G[0]), Z === null) r9(Q, "ill-formed argument of the YAML directive");
      if (Y = parseInt(Z[1], 10), J = parseInt(Z[2], 10), Y !== 1) r9(Q, "unacceptable YAML version of the document");
      if (Q.version = G[0], Q.checkLineBreaks = J < 2, J !== 1 && J !== 2) DH1(Q, "unsupported YAML version of the document")
    },
    TAG: function (Q, B, G) {
      var Z, Y;
      if (G.length !== 2) r9(Q, "TAG directive accepts exactly two arguments");
      if (Z = G[0], Y = G[1], !Ee2.test(Z)) r9(Q, "ill-formed tag handle (first argument) of the TAG directive");
      if (Be.call(Q.tagMap, Z)) r9(Q, 'there is a previously declared suffix for "' + Z + '" tag handle');
      if (!ze2.test(Y)) r9(Q, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        Y = decodeURIComponent(Y)
      } catch (J) {
        r9(Q, "tag prefix is malformed: " + Y)
      }
      Q.tagMap[Z] = Y
    }
  };

  function Qe(A, Q, B, G) {
    var Z, Y, J, X;
    if (Q < B) {
      if (X = A.input.slice(Q, B), G) {
        for (Z = 0, Y = X.length; Z < Y; Z += 1)
          if (J = X.charCodeAt(Z), !(J === 9 || 32 <= J && J <= 1114111)) r9(A, "expected valid JSON character")
      } else if (p37.test(X)) r9(A, "the stream contains non-printable characters");
      A.result += X
    }
  }

  function We2(A, Q, B, G) {
    var Z, Y, J, X;
    if (!M3A.isObject(B)) r9(A, "cannot merge mappings; the provided source object is unacceptable");
    Z = Object.keys(B);
    for (J = 0, X = Z.length; J < X; J += 1)
      if (Y = Z[J], !Be.call(Q, Y)) Q[Y] = B[Y], G[Y] = !0
  }

  function GzA(A, Q, B, G, Z, Y, J, X, I) {
    var D, W;
    if (Array.isArray(Z)) {
      Z = Array.prototype.slice.call(Z);
      for (D = 0, W = Z.length; D < W; D += 1) {
        if (Array.isArray(Z[D])) r9(A, "nested arrays are not supported inside keys");
        if (typeof Z === "object" && Xe2(Z[D]) === "[object Object]") Z[D] = "[object Object]"
      }
    }
    if (typeof Z === "object" && Xe2(Z) === "[object Object]") Z = "[object Object]";
    if (Z = String(Z), Q === null) Q = {};
    if (G === "tag:yaml.org,2002:merge")
      if (Array.isArray(Y))
        for (D = 0, W = Y.length; D < W; D += 1) We2(A, Q, Y[D], B);
      else We2(A, Q, Y, B);
    else {
      if (!A.json && !Be.call(B, Z) && Be.call(Q, Z)) A.line = J || A.line, A.lineStart = X || A.lineStart, A.position = I || A.position, r9(A, "duplicated mapping key");
      if (Z === "__proto__") Object.defineProperty(Q, Z, {
        configurable: !0,
        enumerable: !0,
        writable: !0,
        value: Y
      });
      else Q[Z] = Y;
      delete B[Z]
    }
    return Q
  }

  function wO0(A) {
    var Q = A.input.charCodeAt(A.position);
    if (Q === 10) A.position++;
    else if (Q === 13) {
      if (A.position++, A.input.charCodeAt(A.position) === 10) A.position++
    } else r9(A, "a line break is expected");
    A.line += 1, A.lineStart = A.position, A.firstTabInLine = -1
  }

  function $K(A, Q, B) {
    var G = 0,
      Z = A.input.charCodeAt(A.position);
    while (Z !== 0) {
      while (R3A(Z)) {
        if (Z === 9 && A.firstTabInLine === -1) A.firstTabInLine = A.position;
        Z = A.input.charCodeAt(++A.position)
      }
      if (Q && Z === 35)
        do Z = A.input.charCodeAt(++A.position); while (Z !== 10 && Z !== 13 && Z !== 0);
      if (df(Z)) {
        wO0(A), Z = A.input.charCodeAt(A.position), G++, A.lineIndent = 0;
        while (Z === 32) A.lineIndent++, Z = A.input.charCodeAt(++A.position)
      } else break
    }
    if (B !== -1 && G !== 0 && A.lineIndent < B) DH1(A, "deficient indentation");
    return G
  }

  function WH1(A) {
    var Q = A.position,
      B;
    if (B = A.input.charCodeAt(Q), (B === 45 || B === 46) && B === A.input.charCodeAt(Q + 1) && B === A.input.charCodeAt(Q + 2)) {
      if (Q += 3, B = A.input.charCodeAt(Q), B === 0 || Ww(B)) return !0
    }
    return !1
  }

  function LO0(A, Q) {
    if (Q === 1) A.result += " ";
    else if (Q > 1) A.result += M3A.repeat(`
`, Q - 1)
  }

  function t37(A, Q, B) {
    var G, Z, Y, J, X, I, D, W, K = A.kind,
      V = A.result,
      F;
    if (F = A.input.charCodeAt(A.position), Ww(F) || BzA(F) || F === 35 || F === 38 || F === 42 || F === 33 || F === 124 || F === 62 || F === 39 || F === 34 || F === 37 || F === 64 || F === 96) return !1;
    if (F === 63 || F === 45) {
      if (Z = A.input.charCodeAt(A.position + 1), Ww(Z) || B && BzA(Z)) return !1
    }
    A.kind = "scalar", A.result = "", Y = J = A.position, X = !1;
    while (F !== 0) {
      if (F === 58) {
        if (Z = A.input.charCodeAt(A.position + 1), Ww(Z) || B && BzA(Z)) break
      } else if (F === 35) {
        if (G = A.input.charCodeAt(A.position - 1), Ww(G)) break
      } else if (A.position === A.lineStart && WH1(A) || B && BzA(F)) break;
      else if (df(F))
        if (I = A.line, D = A.lineStart, W = A.lineIndent, $K(A, !1, -1), A.lineIndent >= Q) {
          X = !0, F = A.input.charCodeAt(A.position);
          continue
        } else {
          A.position = J, A.line = I, A.lineStart = D, A.lineIndent = W;
          break
        } if (X) Qe(A, Y, J, !1), LO0(A, A.line - I), Y = J = A.position, X = !1;
      if (!R3A(F)) J = A.position + 1;
      F = A.input.charCodeAt(++A.position)
    }
    if (Qe(A, Y, J, !1), A.result) return !0;
    return A.kind = K, A.result = V, !1
  }

  function e37(A, Q) {
    var B, G, Z;
    if (B = A.input.charCodeAt(A.position), B !== 39) return !1;
    A.kind = "scalar", A.result = "", A.position++, G = Z = A.position;
    while ((B = A.input.charCodeAt(A.position)) !== 0)
      if (B === 39)
        if (Qe(A, G, A.position, !0), B = A.input.charCodeAt(++A.position), B === 39) G = A.position, A.position++, Z = A.position;
        else return !0;
    else if (df(B)) Qe(A, G, Z, !0), LO0(A, $K(A, !1, Q)), G = Z = A.position;
    else if (A.position === A.lineStart && WH1(A)) r9(A, "unexpected end of the document within a single quoted scalar");
    else A.position++, Z = A.position;
    r9(A, "unexpected end of the stream within a single quoted scalar")
  }

  function A87(A, Q) {
    var B, G, Z, Y, J, X;
    if (X = A.input.charCodeAt(A.position), X !== 34) return !1;
    A.kind = "scalar", A.result = "", A.position++, B = G = A.position;
    while ((X = A.input.charCodeAt(A.position)) !== 0)
      if (X === 34) return Qe(A, B, A.position, !0), A.position++, !0;
      else if (X === 92) {
      if (Qe(A, B, A.position, !0), X = A.input.charCodeAt(++A.position), df(X)) $K(A, !1, Q);
      else if (X < 256 && $e2[X]) A.result += Ce2[X], A.position++;
      else if ((J = a37(X)) > 0) {
        Z = J, Y = 0;
        for (; Z > 0; Z--)
          if (X = A.input.charCodeAt(++A.position), (J = n37(X)) >= 0) Y = (Y << 4) + J;
          else r9(A, "expected hexadecimal character");
        A.result += r37(Y), A.position++
      } else r9(A, "unknown escape sequence");
      B = G = A.position
    } else if (df(X)) Qe(A, B, G, !0), LO0(A, $K(A, !1, Q)), B = G = A.position;
    else if (A.position === A.lineStart && WH1(A)) r9(A, "unexpected end of the document within a double quoted scalar");
    else A.position++, G = A.position;
    r9(A, "unexpected end of the stream within a double quoted scalar")
  }

  function Q87(A, Q) {
    var B = !0,
      G, Z, Y, J = A.tag,
      X, I = A.anchor,
      D, W, K, V, F, H = Object.create(null),
      E, z, $, O;
    if (O = A.input.charCodeAt(A.position), O === 91) W = 93, F = !1, X = [];
    else if (O === 123) W = 125, F = !0, X = {};
    else return !1;
    if (A.anchor !== null) A.anchorMap[A.anchor] = X;
    O = A.input.charCodeAt(++A.position);
    while (O !== 0) {
      if ($K(A, !0, Q), O = A.input.charCodeAt(A.position), O === W) return A.position++, A.tag = J, A.anchor = I, A.kind = F ? "mapping" : "sequence", A.result = X, !0;
      else if (!B) r9(A, "missed comma between flow collection entries");
      else if (O === 44) r9(A, "expected the node content, but found ','");
      if (z = E = $ = null, K = V = !1, O === 63) {
        if (D = A.input.charCodeAt(A.position + 1), Ww(D)) K = V = !0, A.position++, $K(A, !0, Q)
      }
      if (G = A.line, Z = A.lineStart, Y = A.position, ZzA(A, Q, XH1, !1, !0), z = A.tag, E = A.result, $K(A, !0, Q), O = A.input.charCodeAt(A.position), (V || A.line === G) && O === 58) K = !0, O = A.input.charCodeAt(++A.position), $K(A, !0, Q), ZzA(A, Q, XH1, !1, !0), $ = A.result;
      if (F) GzA(A, X, H, z, E, $, G, Z, Y);
      else if (K) X.push(GzA(A, null, H, z, E, $, G, Z, Y));
      else X.push(E);
      if ($K(A, !0, Q), O = A.input.charCodeAt(A.position), O === 44) B = !0, O = A.input.charCodeAt(++A.position);
      else B = !1
    }
    r9(A, "unexpected end of the stream within a flow collection")
  }

  function B87(A, Q) {
    var B, G, Z = NO0,
      Y = !1,
      J = !1,
      X = Q,
      I = 0,
      D = !1,
      W, K;
    if (K = A.input.charCodeAt(A.position), K === 124) G = !1;
    else if (K === 62) G = !0;
    else return !1;
    A.kind = "scalar", A.result = "";
    while (K !== 0)
      if (K = A.input.charCodeAt(++A.position), K === 43 || K === 45)
        if (NO0 === Z) Z = K === 43 ? Je2 : c37;
        else r9(A, "repeat of a chomping mode identifier");
    else if ((W = o37(K)) >= 0)
      if (W === 0) r9(A, "bad explicit indentation width of a block scalar; it cannot be less than one");
      else if (!J) X = Q + W - 1, J = !0;
    else r9(A, "repeat of an indentation width identifier");
    else break;
    if (R3A(K)) {
      do K = A.input.charCodeAt(++A.position); while (R3A(K));
      if (K === 35)
        do K = A.input.charCodeAt(++A.position); while (!df(K) && K !== 0)
    }
    while (K !== 0) {
      wO0(A), A.lineIndent = 0, K = A.input.charCodeAt(A.position);
      while ((!J || A.lineIndent < X) && K === 32) A.lineIndent++, K = A.input.charCodeAt(++A.position);
      if (!J && A.lineIndent > X) X = A.lineIndent;
      if (df(K)) {
        I++;
        continue
      }
      if (A.lineIndent < X) {
        if (Z === Je2) A.result += M3A.repeat(`
`, Y ? 1 + I : I);
        else if (Z === NO0) {
          if (Y) A.result += `
`
        }
        break
      }
      if (G)
        if (R3A(K)) D = !0, A.result += M3A.repeat(`
`, Y ? 1 + I : I);
        else if (D) D = !1, A.result += M3A.repeat(`
`, I + 1);
      else if (I === 0) {
        if (Y) A.result += " "
      } else A.result += M3A.repeat(`
`, I);
      else A.result += M3A.repeat(`
`, Y ? 1 + I : I);
      Y = !0, J = !0, I = 0, B = A.position;
      while (!df(K) && K !== 0) K = A.input.charCodeAt(++A.position);
      Qe(A, B, A.position, !1)
    }
    return !0
  }

  function Ke2(A, Q) {
    var B, G = A.tag,
      Z = A.anchor,
      Y = [],
      J, X = !1,
      I;
    if (A.firstTabInLine !== -1) return !1;
    if (A.anchor !== null) A.anchorMap[A.anchor] = Y;
    I = A.input.charCodeAt(A.position);
    while (I !== 0) {
      if (A.firstTabInLine !== -1) A.position = A.firstTabInLine, r9(A, "tab characters must not be used in indentation");
      if (I !== 45) break;
      if (J = A.input.charCodeAt(A.position + 1), !Ww(J)) break;
      if (X = !0, A.position++, $K(A, !0, -1)) {
        if (A.lineIndent <= Q) {
          Y.push(null), I = A.input.charCodeAt(A.position);
          continue
        }
      }
      if (B = A.line, ZzA(A, Q, He2, !1, !0), Y.push(A.result), $K(A, !0, -1), I = A.input.charCodeAt(A.position), (A.line === B || A.lineIndent > Q) && I !== 0) r9(A, "bad indentation of a sequence entry");
      else if (A.lineIndent < Q) break
    }
    if (X) return A.tag = G, A.anchor = Z, A.kind = "sequence", A.result = Y, !0;
    return !1
  }

  function G87(A, Q, B) {
    var G, Z, Y, J, X, I, D = A.tag,
      W = A.anchor,
      K = {},
      V = Object.create(null),
      F = null,
      H = null,
      E = null,
      z = !1,
      $ = !1,
      O;
    if (A.firstTabInLine !== -1) return !1;
    if (A.anchor !== null) A.anchorMap[A.anchor] = K;
    O = A.input.charCodeAt(A.position);
    while (O !== 0) {
      if (!z && A.firstTabInLine !== -1) A.position = A.firstTabInLine, r9(A, "tab characters must not be used in indentation");
      if (G = A.input.charCodeAt(A.position + 1), Y = A.line, (O === 63 || O === 58) && Ww(G)) {
        if (O === 63) {
          if (z) GzA(A, K, V, F, H, null, J, X, I), F = H = E = null;
          $ = !0, z = !0, Z = !0
        } else if (z) z = !1, Z = !0;
        else r9(A, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
        A.position += 1, O = G
      } else {
        if (J = A.line, X = A.lineStart, I = A.position, !ZzA(A, B, Fe2, !1, !0)) break;
        if (A.line === Y) {
          O = A.input.charCodeAt(A.position);
          while (R3A(O)) O = A.input.charCodeAt(++A.position);
          if (O === 58) {
            if (O = A.input.charCodeAt(++A.position), !Ww(O)) r9(A, "a whitespace character is expected after the key-value separator within a block mapping");
            if (z) GzA(A, K, V, F, H, null, J, X, I), F = H = E = null;
            $ = !0, z = !1, Z = !1, F = A.tag, H = A.result
          } else if ($) r9(A, "can not read an implicit mapping pair; a colon is missed");
          else return A.tag = D, A.anchor = W, !0
        } else if ($) r9(A, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else return A.tag = D, A.anchor = W, !0
      }
      if (A.line === Y || A.lineIndent > Q) {
        if (z) J = A.line, X = A.lineStart, I = A.position;
        if (ZzA(A, Q, IH1, !0, Z))
          if (z) H = A.result;
          else E = A.result;
        if (!z) GzA(A, K, V, F, H, E, J, X, I), F = H = E = null;
        $K(A, !0, -1), O = A.input.charCodeAt(A.position)
      }
      if ((A.line === Y || A.lineIndent > Q) && O !== 0) r9(A, "bad indentation of a mapping entry");
      else if (A.lineIndent < Q) break
    }
    if (z) GzA(A, K, V, F, H, null, J, X, I);
    if ($) A.tag = D, A.anchor = W, A.kind = "mapping", A.result = K;
    return $
  }

  function Z87(A) {
    var Q, B = !1,
      G = !1,
      Z, Y, J;
    if (J = A.input.charCodeAt(A.position), J !== 33) return !1;
    if (A.tag !== null) r9(A, "duplication of a tag property");
    if (J = A.input.charCodeAt(++A.position), J === 60) B = !0, J = A.input.charCodeAt(++A.position);
    else if (J === 33) G = !0, Z = "!!", J = A.input.charCodeAt(++A.position);
    else Z = "!";
    if (Q = A.position, B) {
      do J = A.input.charCodeAt(++A.position); while (J !== 0 && J !== 62);
      if (A.position < A.length) Y = A.input.slice(Q, A.position), J = A.input.charCodeAt(++A.position);
      else r9(A, "unexpected end of the stream within a verbatim tag")
    } else {
      while (J !== 0 && !Ww(J)) {
        if (J === 33)
          if (!G) {
            if (Z = A.input.slice(Q - 1, A.position + 1), !Ee2.test(Z)) r9(A, "named tag handle cannot contain such characters");
            G = !0, Q = A.position + 1
          } else r9(A, "tag suffix cannot contain exclamation marks");
        J = A.input.charCodeAt(++A.position)
      }
      if (Y = A.input.slice(Q, A.position), i37.test(Y)) r9(A, "tag suffix cannot contain flow indicator characters")
    }
    if (Y && !ze2.test(Y)) r9(A, "tag name cannot contain such characters: " + Y);
    try {
      Y = decodeURIComponent(Y)
    } catch (X) {
      r9(A, "tag name is malformed: " + Y)
    }
    if (B) A.tag = Y;
    else if (Be.call(A.tagMap, Z)) A.tag = A.tagMap[Z] + Y;
    else if (Z === "!") A.tag = "!" + Y;
    else if (Z === "!!") A.tag = "tag:yaml.org,2002:" + Y;
    else r9(A, 'undeclared tag handle "' + Z + '"');
    return !0
  }

  function Y87(A) {
    var Q, B;
    if (B = A.input.charCodeAt(A.position), B !== 38) return !1;
    if (A.anchor !== null) r9(A, "duplication of an anchor property");
    B = A.input.charCodeAt(++A.position), Q = A.position;
    while (B !== 0 && !Ww(B) && !BzA(B)) B = A.input.charCodeAt(++A.position);
    if (A.position === Q) r9(A, "name of an anchor node must contain at least one character");
    return A.anchor = A.input.slice(Q, A.position), !0
  }

  function J87(A) {
    var Q, B, G;
    if (G = A.input.charCodeAt(A.position), G !== 42) return !1;
    G = A.input.charCodeAt(++A.position), Q = A.position;
    while (G !== 0 && !Ww(G) && !BzA(G)) G = A.input.charCodeAt(++A.position);
    if (A.position === Q) r9(A, "name of an alias node must contain at least one character");
    if (B = A.input.slice(Q, A.position), !Be.call(A.anchorMap, B)) r9(A, 'unidentified alias "' + B + '"');
    return A.result = A.anchorMap[B], $K(A, !0, -1), !0
  }

  function ZzA(A, Q, B, G, Z) {
    var Y, J, X, I = 1,
      D = !1,
      W = !1,
      K, V, F, H, E, z;
    if (A.listener !== null) A.listener("open", A);
    if (A.tag = null, A.anchor = null, A.kind = null, A.result = null, Y = J = X = IH1 === B || He2 === B, G) {
      if ($K(A, !0, -1)) {
        if (D = !0, A.lineIndent > Q) I = 1;
        else if (A.lineIndent === Q) I = 0;
        else if (A.lineIndent < Q) I = -1
      }
    }
    if (I === 1)
      while (Z87(A) || Y87(A))
        if ($K(A, !0, -1)) {
          if (D = !0, X = Y, A.lineIndent > Q) I = 1;
          else if (A.lineIndent === Q) I = 0;
          else if (A.lineIndent < Q) I = -1
        } else X = !1;
    if (X) X = D || Z;
    if (I === 1 || IH1 === B) {
      if (XH1 === B || Fe2 === B) E = Q;
      else E = Q + 1;
      if (z = A.position - A.lineStart, I === 1)
        if (X && (Ke2(A, z) || G87(A, z, E)) || Q87(A, E)) W = !0;
        else {
          if (J && B87(A, E) || e37(A, E) || A87(A, E)) W = !0;
          else if (J87(A)) {
            if (W = !0, A.tag !== null || A.anchor !== null) r9(A, "alias node should not have any properties")
          } else if (t37(A, E, XH1 === B)) {
            if (W = !0, A.tag === null) A.tag = "?"
          }
          if (A.anchor !== null) A.anchorMap[A.anchor] = A.result
        }
      else if (I === 0) W = X && Ke2(A, z)
    }
    if (A.tag === null) {
      if (A.anchor !== null) A.anchorMap[A.anchor] = A.result
    } else if (A.tag === "?") {
      if (A.result !== null && A.kind !== "scalar") r9(A, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + A.kind + '"');
      for (K = 0, V = A.implicitTypes.length; K < V; K += 1)
        if (H = A.implicitTypes[K], H.resolve(A.result)) {
          if (A.result = H.construct(A.result), A.tag = H.tag, A.anchor !== null) A.anchorMap[A.anchor] = A.result;
          break
        }
    } else if (A.tag !== "!") {
      if (Be.call(A.typeMap[A.kind || "fallback"], A.tag)) H = A.typeMap[A.kind || "fallback"][A.tag];
      else {
        H = null, F = A.typeMap.multi[A.kind || "fallback"];
        for (K = 0, V = F.length; K < V; K += 1)
          if (A.tag.slice(0, F[K].tag.length) === F[K].tag) {
            H = F[K];
            break
          }
      }
      if (!H) r9(A, "unknown tag !<" + A.tag + ">");
      if (A.result !== null && H.kind !== A.kind) r9(A, "unacceptable node kind for !<" + A.tag + '> tag; it should be "' + H.kind + '", not "' + A.kind + '"');
      if (!H.resolve(A.result, A.tag)) r9(A, "cannot resolve a node with !<" + A.tag + "> explicit tag");
      else if (A.result = H.construct(A.result, A.tag), A.anchor !== null) A.anchorMap[A.anchor] = A.result
    }
    if (A.listener !== null) A.listener("close", A);
    return A.tag !== null || A.anchor !== null || W
  }

  function X87(A) {
    var Q = A.position,
      B, G, Z, Y = !1,
      J;
    A.version = null, A.checkLineBreaks = A.legacy, A.tagMap = Object.create(null), A.anchorMap = Object.create(null);
    while ((J = A.input.charCodeAt(A.position)) !== 0) {
      if ($K(A, !0, -1), J = A.input.charCodeAt(A.position), A.lineIndent > 0 || J !== 37) break;
      Y = !0, J = A.input.charCodeAt(++A.position), B = A.position;
      while (J !== 0 && !Ww(J)) J = A.input.charCodeAt(++A.position);
      if (G = A.input.slice(B, A.position), Z = [], G.length < 1) r9(A, "directive name must not be less than one character in length");
      while (J !== 0) {
        while (R3A(J)) J = A.input.charCodeAt(++A.position);
        if (J === 35) {
          do J = A.input.charCodeAt(++A.position); while (J !== 0 && !df(J));
          break
        }
        if (df(J)) break;
        B = A.position;
        while (J !== 0 && !Ww(J)) J = A.input.charCodeAt(++A.position);
        Z.push(A.input.slice(B, A.position))
      }
      if (J !== 0) wO0(A);
      if (Be.call(De2, G)) De2[G](A, G, Z);
      else DH1(A, 'unknown document directive "' + G + '"')
    }
    if ($K(A, !0, -1), A.lineIndent === 0 && A.input.charCodeAt(A.position) === 45 && A.input.charCodeAt(A.position + 1) === 45 && A.input.charCodeAt(A.position + 2) === 45) A.position += 3, $K(A, !0, -1);
    else if (Y) r9(A, "directives end mark is expected");
    if (ZzA(A, A.lineIndent - 1, IH1, !1, !0), $K(A, !0, -1), A.checkLineBreaks && l37.test(A.input.slice(Q, A.position))) DH1(A, "non-ASCII line breaks are interpreted as content");
    if (A.documents.push(A.result), A.position === A.lineStart && WH1(A)) {
      if (A.input.charCodeAt(A.position) === 46) A.position += 3, $K(A, !0, -1);
      return
    }
    if (A.position < A.length - 1) r9(A, "end of the stream or a document separator is expected");
    else return
  }

  function qe2(A, Q) {
    if (A = String(A), Q = Q || {}, A.length !== 0) {
      if (A.charCodeAt(A.length - 1) !== 10 && A.charCodeAt(A.length - 1) !== 13) A += `
`;
      if (A.charCodeAt(0) === 65279) A = A.slice(1)
    }
    var B = new s37(A, Q),
      G = A.indexOf("\x00");
    if (G !== -1) B.position = G, r9(B, "null byte is not allowed in input");
    B.input += "\x00";
    while (B.input.charCodeAt(B.position) === 32) B.lineIndent += 1, B.position += 1;
    while (B.position < B.length - 1) X87(B);
    return B.documents
  }

  function I87(A, Q, B) {
    if (Q !== null && typeof Q === "object" && typeof B > "u") B = Q, Q = null;
    var G = qe2(A, B);
    if (typeof Q !== "function") return G;
    for (var Z = 0, Y = G.length; Z < Y; Z += 1) Q(G[Z])
  }

  function D87(A, Q) {
    var B = qe2(A, Q);
    if (B.length === 0) return;
    else if (B.length === 1) return B[0];
    throw new Ve2("expected a single document in the stream, but found more")
  }
  W87.loadAll = I87;
  W87.load = D87
})
// @from(Ln 390967, Col 4)
de2 = U((a87, me2) => {
  var FH1 = AzA(),
    whA = QzA(),
    F87 = JH1(),
    Pe2 = Object.prototype.toString,
    Se2 = Object.prototype.hasOwnProperty,
    TO0 = 65279,
    H87 = 9,
    UhA = 10,
    E87 = 13,
    z87 = 32,
    $87 = 33,
    C87 = 34,
    MO0 = 35,
    U87 = 37,
    q87 = 38,
    N87 = 39,
    w87 = 42,
    xe2 = 44,
    L87 = 45,
    KH1 = 58,
    O87 = 61,
    M87 = 62,
    R87 = 63,
    _87 = 64,
    ye2 = 91,
    ve2 = 93,
    j87 = 96,
    ke2 = 123,
    T87 = 124,
    be2 = 125,
    $$ = {};
  $$[0] = "\\0";
  $$[7] = "\\a";
  $$[8] = "\\b";
  $$[9] = "\\t";
  $$[10] = "\\n";
  $$[11] = "\\v";
  $$[12] = "\\f";
  $$[13] = "\\r";
  $$[27] = "\\e";
  $$[34] = "\\\"";
  $$[92] = "\\\\";
  $$[133] = "\\N";
  $$[160] = "\\_";
  $$[8232] = "\\L";
  $$[8233] = "\\P";
  var P87 = ["y", "Y", "yes", "Yes", "YES", "on", "On", "ON", "n", "N", "no", "No", "NO", "off", "Off", "OFF"],
    S87 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;

  function x87(A, Q) {
    var B, G, Z, Y, J, X, I;
    if (Q === null) return {};
    B = {}, G = Object.keys(Q);
    for (Z = 0, Y = G.length; Z < Y; Z += 1) {
      if (J = G[Z], X = String(Q[J]), J.slice(0, 2) === "!!") J = "tag:yaml.org,2002:" + J.slice(2);
      if (I = A.compiledTypeMap.fallback[J], I && Se2.call(I.styleAliases, X)) X = I.styleAliases[X];
      B[J] = X
    }
    return B
  }

  function y87(A) {
    var Q, B, G;
    if (Q = A.toString(16).toUpperCase(), A <= 255) B = "x", G = 2;
    else if (A <= 65535) B = "u", G = 4;
    else if (A <= 4294967295) B = "U", G = 8;
    else throw new whA("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + B + FH1.repeat("0", G - Q.length) + Q
  }
  var v87 = 1,
    qhA = 2;

  function k87(A) {
    this.schema = A.schema || F87, this.indent = Math.max(1, A.indent || 2), this.noArrayIndent = A.noArrayIndent || !1, this.skipInvalid = A.skipInvalid || !1, this.flowLevel = FH1.isNothing(A.flowLevel) ? -1 : A.flowLevel, this.styleMap = x87(this.schema, A.styles || null), this.sortKeys = A.sortKeys || !1, this.lineWidth = A.lineWidth || 80, this.noRefs = A.noRefs || !1, this.noCompatMode = A.noCompatMode || !1, this.condenseFlow = A.condenseFlow || !1, this.quotingType = A.quotingType === '"' ? qhA : v87, this.forceQuotes = A.forceQuotes || !1, this.replacer = typeof A.replacer === "function" ? A.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null
  }

  function we2(A, Q) {
    var B = FH1.repeat(" ", Q),
      G = 0,
      Z = -1,
      Y = "",
      J, X = A.length;
    while (G < X) {
      if (Z = A.indexOf(`
`, G), Z === -1) J = A.slice(G), G = X;
      else J = A.slice(G, Z + 1), G = Z + 1;
      if (J.length && J !== `
`) Y += B;
      Y += J
    }
    return Y
  }

  function RO0(A, Q) {
    return `
` + FH1.repeat(" ", A.indent * Q)
  }

  function b87(A, Q) {
    var B, G, Z;
    for (B = 0, G = A.implicitTypes.length; B < G; B += 1)
      if (Z = A.implicitTypes[B], Z.resolve(Q)) return !0;
    return !1
  }

  function VH1(A) {
    return A === z87 || A === H87
  }

  function NhA(A) {
    return 32 <= A && A <= 126 || 161 <= A && A <= 55295 && A !== 8232 && A !== 8233 || 57344 <= A && A <= 65533 && A !== TO0 || 65536 <= A && A <= 1114111
  }

  function Le2(A) {
    return NhA(A) && A !== TO0 && A !== E87 && A !== UhA
  }

  function Oe2(A, Q, B) {
    var G = Le2(A),
      Z = G && !VH1(A);
    return (B ? G : G && A !== xe2 && A !== ye2 && A !== ve2 && A !== ke2 && A !== be2) && A !== MO0 && !(Q === KH1 && !Z) || Le2(Q) && !VH1(Q) && A === MO0 || Q === KH1 && Z
  }

  function f87(A) {
    return NhA(A) && A !== TO0 && !VH1(A) && A !== L87 && A !== R87 && A !== KH1 && A !== xe2 && A !== ye2 && A !== ve2 && A !== ke2 && A !== be2 && A !== MO0 && A !== q87 && A !== w87 && A !== $87 && A !== T87 && A !== O87 && A !== M87 && A !== N87 && A !== C87 && A !== U87 && A !== _87 && A !== j87
  }

  function h87(A) {
    return !VH1(A) && A !== KH1
  }

  function ChA(A, Q) {
    var B = A.charCodeAt(Q),
      G;
    if (B >= 55296 && B <= 56319 && Q + 1 < A.length) {
      if (G = A.charCodeAt(Q + 1), G >= 56320 && G <= 57343) return (B - 55296) * 1024 + G - 56320 + 65536
    }
    return B
  }

  function fe2(A) {
    var Q = /^\n* /;
    return Q.test(A)
  }
  var he2 = 1,
    _O0 = 2,
    ge2 = 3,
    ue2 = 4,
    YzA = 5;

  function g87(A, Q, B, G, Z, Y, J, X) {
    var I, D = 0,
      W = null,
      K = !1,
      V = !1,
      F = G !== -1,
      H = -1,
      E = f87(ChA(A, 0)) && h87(ChA(A, A.length - 1));
    if (Q || J)
      for (I = 0; I < A.length; D >= 65536 ? I += 2 : I++) {
        if (D = ChA(A, I), !NhA(D)) return YzA;
        E = E && Oe2(D, W, X), W = D
      } else {
        for (I = 0; I < A.length; D >= 65536 ? I += 2 : I++) {
          if (D = ChA(A, I), D === UhA) {
            if (K = !0, F) V = V || I - H - 1 > G && A[H + 1] !== " ", H = I
          } else if (!NhA(D)) return YzA;
          E = E && Oe2(D, W, X), W = D
        }
        V = V || F && (I - H - 1 > G && A[H + 1] !== " ")
      }
    if (!K && !V) {
      if (E && !J && !Z(A)) return he2;
      return Y === qhA ? YzA : _O0
    }
    if (B > 9 && fe2(A)) return YzA;
    if (!J) return V ? ue2 : ge2;
    return Y === qhA ? YzA : _O0
  }

  function u87(A, Q, B, G, Z) {
    A.dump = function () {
      if (Q.length === 0) return A.quotingType === qhA ? '""' : "''";
      if (!A.noCompatMode) {
        if (P87.indexOf(Q) !== -1 || S87.test(Q)) return A.quotingType === qhA ? '"' + Q + '"' : "'" + Q + "'"
      }
      var Y = A.indent * Math.max(1, B),
        J = A.lineWidth === -1 ? -1 : Math.max(Math.min(A.lineWidth, 40), A.lineWidth - Y),
        X = G || A.flowLevel > -1 && B >= A.flowLevel;

      function I(D) {
        return b87(A, D)
      }
      switch (g87(Q, X, A.indent, J, I, A.quotingType, A.forceQuotes && !G, Z)) {
        case he2:
          return Q;
        case _O0:
          return "'" + Q.replace(/'/g, "''") + "'";
        case ge2:
          return "|" + Me2(Q, A.indent) + Re2(we2(Q, Y));
        case ue2:
          return ">" + Me2(Q, A.indent) + Re2(we2(m87(Q, J), Y));
        case YzA:
          return '"' + d87(Q, J) + '"';
        default:
          throw new whA("impossible error: invalid scalar style")
      }
    }()
  }

  function Me2(A, Q) {
    var B = fe2(A) ? String(Q) : "",
      G = A[A.length - 1] === `
`,
      Z = G && (A[A.length - 2] === `
` || A === `
`),
      Y = Z ? "+" : G ? "" : "-";
    return B + Y + `
`
  }

  function Re2(A) {
    return A[A.length - 1] === `
` ? A.slice(0, -1) : A
  }

  function m87(A, Q) {
    var B = /(\n+)([^\n]*)/g,
      G = function () {
        var D = A.indexOf(`
`);
        return D = D !== -1 ? D : A.length, B.lastIndex = D, _e2(A.slice(0, D), Q)
      }(),
      Z = A[0] === `
` || A[0] === " ",
      Y, J;
    while (J = B.exec(A)) {
      var X = J[1],
        I = J[2];
      Y = I[0] === " ", G += X + (!Z && !Y && I !== "" ? `
` : "") + _e2(I, Q), Z = Y
    }
    return G
  }

  function _e2(A, Q) {
    if (A === "" || A[0] === " ") return A;
    var B = / [^ ]/g,
      G, Z = 0,
      Y, J = 0,
      X = 0,
      I = "";
    while (G = B.exec(A)) {
      if (X = G.index, X - Z > Q) Y = J > Z ? J : X, I += `
` + A.slice(Z, Y), Z = Y + 1;
      J = X
    }
    if (I += `
`, A.length - Z > Q && J > Z) I += A.slice(Z, J) + `
` + A.slice(J + 1);
    else I += A.slice(Z);
    return I.slice(1)
  }

  function d87(A) {
    var Q = "",
      B = 0,
      G;
    for (var Z = 0; Z < A.length; B >= 65536 ? Z += 2 : Z++)
      if (B = ChA(A, Z), G = $$[B], !G && NhA(B)) {
        if (Q += A[Z], B >= 65536) Q += A[Z + 1]
      } else Q += G || y87(B);
    return Q
  }

  function c87(A, Q, B) {
    var G = "",
      Z = A.tag,
      Y, J, X;
    for (Y = 0, J = B.length; Y < J; Y += 1) {
      if (X = B[Y], A.replacer) X = A.replacer.call(B, String(Y), X);
      if (ac(A, Q, X, !1, !1) || typeof X > "u" && ac(A, Q, null, !1, !1)) {
        if (G !== "") G += "," + (!A.condenseFlow ? " " : "");
        G += A.dump
      }
    }
    A.tag = Z, A.dump = "[" + G + "]"
  }

  function je2(A, Q, B, G) {
    var Z = "",
      Y = A.tag,
      J, X, I;
    for (J = 0, X = B.length; J < X; J += 1) {
      if (I = B[J], A.replacer) I = A.replacer.call(B, String(J), I);
      if (ac(A, Q + 1, I, !0, !0, !1, !0) || typeof I > "u" && ac(A, Q + 1, null, !0, !0, !1, !0)) {
        if (!G || Z !== "") Z += RO0(A, Q);
        if (A.dump && UhA === A.dump.charCodeAt(0)) Z += "-";
        else Z += "- ";
        Z += A.dump
      }
    }
    A.tag = Y, A.dump = Z || "[]"
  }

  function p87(A, Q, B) {
    var G = "",
      Z = A.tag,
      Y = Object.keys(B),
      J, X, I, D, W;
    for (J = 0, X = Y.length; J < X; J += 1) {
      if (W = "", G !== "") W += ", ";
      if (A.condenseFlow) W += '"';
      if (I = Y[J], D = B[I], A.replacer) D = A.replacer.call(B, I, D);
      if (!ac(A, Q, I, !1, !1)) continue;
      if (A.dump.length > 1024) W += "? ";
      if (W += A.dump + (A.condenseFlow ? '"' : "") + ":" + (A.condenseFlow ? "" : " "), !ac(A, Q, D, !1, !1)) continue;
      W += A.dump, G += W
    }
    A.tag = Z, A.dump = "{" + G + "}"
  }

  function l87(A, Q, B, G) {
    var Z = "",
      Y = A.tag,
      J = Object.keys(B),
      X, I, D, W, K, V;
    if (A.sortKeys === !0) J.sort();
    else if (typeof A.sortKeys === "function") J.sort(A.sortKeys);
    else if (A.sortKeys) throw new whA("sortKeys must be a boolean or a function");
    for (X = 0, I = J.length; X < I; X += 1) {
      if (V = "", !G || Z !== "") V += RO0(A, Q);
      if (D = J[X], W = B[D], A.replacer) W = A.replacer.call(B, D, W);
      if (!ac(A, Q + 1, D, !0, !0, !0)) continue;
      if (K = A.tag !== null && A.tag !== "?" || A.dump && A.dump.length > 1024, K)
        if (A.dump && UhA === A.dump.charCodeAt(0)) V += "?";
        else V += "? ";
      if (V += A.dump, K) V += RO0(A, Q);
      if (!ac(A, Q + 1, W, !0, K)) continue;
      if (A.dump && UhA === A.dump.charCodeAt(0)) V += ":";
      else V += ": ";
      V += A.dump, Z += V
    }
    A.tag = Y, A.dump = Z || "{}"
  }

  function Te2(A, Q, B) {
    var G, Z, Y, J, X, I;
    Z = B ? A.explicitTypes : A.implicitTypes;
    for (Y = 0, J = Z.length; Y < J; Y += 1)
      if (X = Z[Y], (X.instanceOf || X.predicate) && (!X.instanceOf || typeof Q === "object" && Q instanceof X.instanceOf) && (!X.predicate || X.predicate(Q))) {
        if (B)
          if (X.multi && X.representName) A.tag = X.representName(Q);
          else A.tag = X.tag;
        else A.tag = "?";
        if (X.represent) {
          if (I = A.styleMap[X.tag] || X.defaultStyle, Pe2.call(X.represent) === "[object Function]") G = X.represent(Q, I);
          else if (Se2.call(X.represent, I)) G = X.represent[I](Q, I);
          else throw new whA("!<" + X.tag + '> tag resolver accepts not "' + I + '" style');
          A.dump = G
        }
        return !0
      } return !1
  }

  function ac(A, Q, B, G, Z, Y, J) {
    if (A.tag = null, A.dump = B, !Te2(A, B, !1)) Te2(A, B, !0);
    var X = Pe2.call(A.dump),
      I = G,
      D;
    if (G) G = A.flowLevel < 0 || A.flowLevel > Q;
    var W = X === "[object Object]" || X === "[object Array]",
      K, V;
    if (W) K = A.duplicates.indexOf(B), V = K !== -1;
    if (A.tag !== null && A.tag !== "?" || V || A.indent !== 2 && Q > 0) Z = !1;
    if (V && A.usedDuplicates[K]) A.dump = "*ref_" + K;
    else {
      if (W && V && !A.usedDuplicates[K]) A.usedDuplicates[K] = !0;
      if (X === "[object Object]") {
        if (G && Object.keys(A.dump).length !== 0) {
          if (l87(A, Q, A.dump, Z), V) A.dump = "&ref_" + K + A.dump
        } else if (p87(A, Q, A.dump), V) A.dump = "&ref_" + K + " " + A.dump
      } else if (X === "[object Array]") {
        if (G && A.dump.length !== 0) {
          if (A.noArrayIndent && !J && Q > 0) je2(A, Q - 1, A.dump, Z);
          else je2(A, Q, A.dump, Z);
          if (V) A.dump = "&ref_" + K + A.dump
        } else if (c87(A, Q, A.dump), V) A.dump = "&ref_" + K + " " + A.dump
      } else if (X === "[object String]") {
        if (A.tag !== "?") u87(A, A.dump, Q, Y, I)
      } else if (X === "[object Undefined]") return !1;
      else {
        if (A.skipInvalid) return !1;
        throw new whA("unacceptable kind of an object to dump " + X)
      }
      if (A.tag !== null && A.tag !== "?") {
        if (D = encodeURI(A.tag[0] === "!" ? A.tag.slice(1) : A.tag).replace(/!/g, "%21"), A.tag[0] === "!") D = "!" + D;
        else if (D.slice(0, 18) === "tag:yaml.org,2002:") D = "!!" + D.slice(18);
        else D = "!<" + D + ">";
        A.dump = D + " " + A.dump
      }
    }
    return !0
  }

  function i87(A, Q) {
    var B = [],
      G = [],
      Z, Y;
    jO0(A, B, G);
    for (Z = 0, Y = G.length; Z < Y; Z += 1) Q.duplicates.push(B[G[Z]]);
    Q.usedDuplicates = Array(Y)
  }

  function jO0(A, Q, B) {
    var G, Z, Y;
    if (A !== null && typeof A === "object")
      if (Z = Q.indexOf(A), Z !== -1) {
        if (B.indexOf(Z) === -1) B.push(Z)
      } else if (Q.push(A), Array.isArray(A))
      for (Z = 0, Y = A.length; Z < Y; Z += 1) jO0(A[Z], Q, B);
    else {
      G = Object.keys(A);
      for (Z = 0, Y = G.length; Z < Y; Z += 1) jO0(A[G[Z]], Q, B)
    }
  }

  function n87(A, Q) {
    Q = Q || {};
    var B = new k87(Q);
    if (!B.noRefs) i87(A, B);
    var G = A;
    if (B.replacer) G = B.replacer.call({
      "": G
    }, "", G);
    if (ac(B, 0, G, !0, !0)) return B.dump + `
`;
    return ""
  }
  a87.dump = n87
})
// @from(Ln 391410, Col 4)
SO0 = U((s87, NU) => {
  var ce2 = Ne2(),
    r87 = de2();

  function PO0(A, Q) {
    return function () {
      throw Error("Function yaml." + A + " is removed in js-yaml 4. Use yaml." + Q + " instead, which is now safe by default.")
    }
  }
  s87.Type = z$();
  s87.Schema = YO0();
  s87.FAILSAFE_SCHEMA = DO0();
  s87.JSON_SCHEMA = YH1();
  s87.CORE_SCHEMA = YH1();
  s87.DEFAULT_SCHEMA = JH1();
  s87.load = ce2.load;
  s87.loadAll = ce2.loadAll;
  s87.dump = r87.dump;
  s87.YAMLException = QzA();
  s87.types = {
    binary: $O0(),
    float: FO0(),
    map: IO0(),
    null: WO0(),
    pairs: UO0(),
    set: qO0(),
    timestamp: HO0(),
    bool: KO0(),
    int: VO0(),
    merge: EO0(),
    omap: CO0(),
    seq: XO0(),
    str: JO0()
  };
  s87.safeLoad = PO0("safeLoad", "load");
  s87.safeLoadAll = PO0("safeLoadAll", "loadAll");
  s87.safeDump = PO0("safeDump", "dump")
})
// @from(Ln 391448, Col 4)
le2 = U((EzY, pe2) => {
  var {
    ParserError: V57
  } = Tx(), F57 = SO0(), {
    JSON_SCHEMA: H57
  } = SO0();
  pe2.exports = {
    order: 200,
    allowEmpty: !0,
    canParse: [".yaml", ".yml", ".json"],
    async parse(A) {
      let Q = A.data;
      if (Buffer.isBuffer(Q)) Q = Q.toString();
      if (typeof Q === "string") try {
        return F57.load(Q, {
          schema: H57
        })
      } catch (B) {
        throw new V57(B.message, A.url)
      } else return Q
    }
  }
})
// @from(Ln 391471, Col 4)
ne2 = U((zzY, ie2) => {
  var {
    ParserError: E57
  } = Tx(), z57 = /\.(txt|htm|html|md|xml|js|min|map|css|scss|less|svg)$/i;
  ie2.exports = {
    order: 300,
    allowEmpty: !0,
    encoding: "utf8",
    canParse(A) {
      return (typeof A.data === "string" || Buffer.isBuffer(A.data)) && z57.test(A.url)
    },
    parse(A) {
      if (typeof A.data === "string") return A.data;
      else if (Buffer.isBuffer(A.data)) return A.data.toString(this.encoding);
      else throw new E57("data is not text", A.url)
    }
  }
})
// @from(Ln 391489, Col 4)
oe2 = U(($zY, ae2) => {
  var $57 = /\.(jpeg|jpg|gif|png|bmp|ico)$/i;
  ae2.exports = {
    order: 400,
    allowEmpty: !0,
    canParse(A) {
      return Buffer.isBuffer(A.data) && $57.test(A.url)
    },
    parse(A) {
      if (Buffer.isBuffer(A.data)) return A.data;
      else return Buffer.from(A.data)
    }
  }
})
// @from(Ln 391503, Col 4)
te2 = U((CzY, se2) => {
  var C57 = NA("fs"),
    {
      ono: xO0
    } = at(),
    re2 = zj(),
    {
      ResolverError: yO0
    } = Tx();
  se2.exports = {
    order: 100,
    canRead(A) {
      return re2.isFileSystemPath(A.url)
    },
    read(A) {
      return new Promise((Q, B) => {
        let G;
        try {
          G = re2.toFileSystemPath(A.url)
        } catch (Z) {
          B(new yO0(xO0.uri(Z, `Malformed URI: ${A.url}`), A.url))
        }
        try {
          C57.readFile(G, (Z, Y) => {
            if (Z) B(new yO0(xO0(Z, `Error opening file "${G}"`), G));
            else Q(Y)
          })
        } catch (Z) {
          B(new yO0(xO0(Z, `Error opening file "${G}"`), G))
        }
      })
    }
  }
})
// @from(Ln 391537, Col 4)
BA9 = U((UzY, QA9) => {
  var U57 = NA("http"),
    q57 = NA("https"),
    {
      ono: HH1
    } = at(),
    EH1 = zj(),
    {
      ResolverError: ee2
    } = Tx();
  QA9.exports = {
    order: 200,
    headers: null,
    timeout: 5000,
    redirects: 5,
    withCredentials: !1,
    canRead(A) {
      return EH1.isHttp(A.url)
    },
    read(A) {
      let Q = EH1.parse(A.url);
      return AA9(Q, this)
    }
  };

  function AA9(A, Q, B) {
    return new Promise((G, Z) => {
      A = EH1.parse(A), B = B || [], B.push(A.href), N57(A, Q).then((Y) => {
        if (Y.statusCode >= 400) throw HH1({
          status: Y.statusCode
        }, `HTTP ERROR ${Y.statusCode}`);
        else if (Y.statusCode >= 300)
          if (B.length > Q.redirects) Z(new ee2(HH1({
            status: Y.statusCode
          }, `Error downloading ${B[0]}. 
Too many redirects: 
  ${B.join(` 
  `)}`)));
          else if (!Y.headers.location) throw HH1({
          status: Y.statusCode
        }, `HTTP ${Y.statusCode} redirect with no location header`);
        else {
          let J = EH1.resolve(A, Y.headers.location);
          AA9(J, Q, B).then(G, Z)
        } else G(Y.body || Buffer.alloc(0))
      }).catch((Y) => {
        Z(new ee2(HH1(Y, `Error downloading ${A.href}`), A.href))
      })
    })
  }

  function N57(A, Q) {
    return new Promise((B, G) => {
      let Y = (A.protocol === "https:" ? q57 : U57).get({
        hostname: A.hostname,
        port: A.port,
        path: A.path,
        auth: A.auth,
        protocol: A.protocol,
        headers: Q.headers || {},
        withCredentials: Q.withCredentials
      });
      if (typeof Y.setTimeout === "function") Y.setTimeout(Q.timeout);
      Y.on("timeout", () => {
        Y.abort()
      }), Y.on("error", G), Y.once("response", (J) => {
        J.body = Buffer.alloc(0), J.on("data", (X) => {
          J.body = Buffer.concat([J.body, Buffer.from(X)])
        }), J.on("error", G), J.on("end", () => {
          B(J)
        })
      })
    })
  }
})
// @from(Ln 391612, Col 4)
YA9 = U((qzY, ZA9) => {
  var w57 = St2(),
    L57 = le2(),
    O57 = ne2(),
    M57 = oe2(),
    R57 = te2(),
    _57 = BA9();
  ZA9.exports = kO0;

  function kO0(A) {
    vO0(this, kO0.defaults), vO0(this, A)
  }
  kO0.defaults = {
    parse: {
      json: w57,
      yaml: L57,
      text: O57,
      binary: M57
    },
    resolve: {
      file: R57,
      http: _57,
      external: !0
    },
    continueOnError: !1,
    dereference: {
      circular: !0,
      excludedPathMatcher: () => !1
    }
  };

  function vO0(A, Q) {
    if (GA9(Q)) {
      let B = Object.keys(Q);
      for (let G = 0; G < B.length; G++) {
        let Z = B[G],
          Y = Q[Z],
          J = A[Z];
        if (GA9(Y)) A[Z] = vO0(J || {}, Y);
        else if (Y !== void 0) A[Z] = Y
      }
    }
    return A
  }

  function GA9(A) {
    return A && typeof A === "object" && !Array.isArray(A) && !(A instanceof RegExp) && !(A instanceof Date)
  }
})
// @from(Ln 391661, Col 4)
IA9 = U((NzY, XA9) => {
  var JA9 = YA9();
  XA9.exports = j57;

  function j57(A) {
    let Q, B, G, Z;
    if (A = Array.prototype.slice.call(A), typeof A[A.length - 1] === "function") Z = A.pop();
    if (typeof A[0] === "string")
      if (Q = A[0], typeof A[2] === "object") B = A[1], G = A[2];
      else B = void 0, G = A[1];
    else Q = "", B = A[0], G = A[1];
    if (!(G instanceof JA9)) G = new JA9(G);
    return {
      path: Q,
      schema: B,
      options: G,
      callback: Z
    }
  }
})
// @from(Ln 391681, Col 4)
VA9 = U((wzY, KA9) => {
  var DA9 = eEA(),
    T57 = HhA(),
    P57 = AO0(),
    LhA = zj(),
    {
      isHandledError: S57
    } = Tx();
  KA9.exports = x57;

  function x57(A, Q) {
    if (!Q.resolve.external) return Promise.resolve();
    try {
      let B = bO0(A.schema, A.$refs._root$Ref.path + "#", A.$refs, Q);
      return Promise.all(B)
    } catch (B) {
      return Promise.reject(B)
    }
  }

  function bO0(A, Q, B, G, Z) {
    Z = Z || new Set;
    let Y = [];
    if (A && typeof A === "object" && !ArrayBuffer.isView(A) && !Z.has(A))
      if (Z.add(A), DA9.isExternal$Ref(A)) Y.push(WA9(A, Q, B, G));
      else
        for (let J of Object.keys(A)) {
          let X = T57.join(Q, J),
            I = A[J];
          if (DA9.isExternal$Ref(I)) Y.push(WA9(I, X, B, G));
          else Y = Y.concat(bO0(I, X, B, G, Z))
        }
    return Y
  }
  async function WA9(A, Q, B, G) {
    let Z = LhA.resolve(Q, A.$ref),
      Y = LhA.stripHash(Z);
    if (A = B._$refs[Y], A) return Promise.resolve(A.value);
    try {
      let J = await P57(Z, B, G),
        X = bO0(J, Y + "#", B, G);
      return Promise.all(X)
    } catch (J) {
      if (!G.continueOnError || !S57(J)) throw J;
      if (B._$refs[Y]) J.source = decodeURI(LhA.stripHash(Q)), J.path = LhA.safePointerToPath(LhA.getHash(Q));
      return []
    }
  }
})
// @from(Ln 391730, Col 4)
EA9 = U((LzY, HA9) => {
  var zH1 = eEA(),
    OhA = HhA(),
    fO0 = zj();
  HA9.exports = y57;

  function y57(A, Q) {
    let B = [];
    hO0(A, "schema", A.$refs._root$Ref.path + "#", "#", 0, B, A.$refs, Q), v57(B)
  }

  function hO0(A, Q, B, G, Z, Y, J, X) {
    let I = Q === null ? A : A[Q];
    if (I && typeof I === "object" && !ArrayBuffer.isView(I))
      if (zH1.isAllowed$Ref(I)) FA9(A, Q, B, G, Z, Y, J, X);
      else {
        let D = Object.keys(I).sort((W, K) => {
          if (W === "definitions") return -1;
          else if (K === "definitions") return 1;
          else return W.length - K.length
        });
        for (let W of D) {
          let K = OhA.join(B, W),
            V = OhA.join(G, W),
            F = I[W];
          if (zH1.isAllowed$Ref(F)) FA9(I, W, B, V, Z, Y, J, X);
          else hO0(I, W, K, V, Z, Y, J, X)
        }
      }
  }

  function FA9(A, Q, B, G, Z, Y, J, X) {
    let I = Q === null ? A : A[Q],
      D = fO0.resolve(B, I.$ref),
      W = J._resolve(D, G, X);
    if (W === null) return;
    let K = OhA.parse(G).length,
      V = fO0.stripHash(W.path),
      F = fO0.getHash(W.path),
      H = V !== J._root$Ref.path,
      E = zH1.isExtended$Ref(I);
    Z += W.indirections;
    let z = k57(Y, A, Q);
    if (z)
      if (K < z.depth || Z < z.indirections) b57(Y, z);
      else return;
    if (Y.push({
        $ref: I,
        parent: A,
        key: Q,
        pathFromRoot: G,
        depth: K,
        file: V,
        hash: F,
        value: W.value,
        circular: W.circular,
        extended: E,
        external: H,
        indirections: Z
      }), !z) hO0(W.value, null, W.path, G, Z + 1, Y, J, X)
  }

  function v57(A) {
    A.sort((Z, Y) => {
      if (Z.file !== Y.file) return Z.file < Y.file ? -1 : 1;
      else if (Z.hash !== Y.hash) return Z.hash < Y.hash ? -1 : 1;
      else if (Z.circular !== Y.circular) return Z.circular ? -1 : 1;
      else if (Z.extended !== Y.extended) return Z.extended ? 1 : -1;
      else if (Z.indirections !== Y.indirections) return Z.indirections - Y.indirections;
      else if (Z.depth !== Y.depth) return Z.depth - Y.depth;
      else {
        let J = Z.pathFromRoot.lastIndexOf("/definitions"),
          X = Y.pathFromRoot.lastIndexOf("/definitions");
        if (J !== X) return X - J;
        else return Z.pathFromRoot.length - Y.pathFromRoot.length
      }
    });
    let Q, B, G;
    for (let Z of A)
      if (!Z.external) Z.$ref.$ref = Z.hash;
      else if (Z.file === Q && Z.hash === B) Z.$ref.$ref = G;
    else if (Z.file === Q && Z.hash.indexOf(B + "/") === 0) Z.$ref.$ref = OhA.join(G, OhA.parse(Z.hash.replace(B, "#")));
    else if (Q = Z.file, B = Z.hash, G = Z.pathFromRoot, Z.$ref = Z.parent[Z.key] = zH1.dereference(Z.$ref, Z.value), Z.circular) Z.$ref.$ref = Z.pathFromRoot
  }

  function k57(A, Q, B) {
    for (let G = 0; G < A.length; G++) {
      let Z = A[G];
      if (Z.parent === Q && Z.key === B) return Z
    }
  }

  function b57(A, Q) {
    let B = A.indexOf(Q);
    A.splice(B, 1)
  }
})
// @from(Ln 391827, Col 4)
qA9 = U((OzY, UA9) => {
  var gO0 = eEA(),
    zA9 = HhA(),
    {
      ono: f57
    } = at(),
    h57 = zj();
  UA9.exports = g57;

  function g57(A, Q) {
    let B = uO0(A.schema, A.$refs._root$Ref.path, "#", new Set, new Set, new Map, A.$refs, Q);
    A.$refs.circular = B.circular, A.schema = B.value
  }

  function uO0(A, Q, B, G, Z, Y, J, X) {
    let I, D = {
        value: A,
        circular: !1
      },
      W = X.dereference.excludedPathMatcher;
    if (X.dereference.circular === "ignore" || !Z.has(A)) {
      if (A && typeof A === "object" && !ArrayBuffer.isView(A) && !W(B)) {
        if (G.add(A), Z.add(A), gO0.isAllowed$Ref(A, X)) I = $A9(A, Q, B, G, Z, Y, J, X), D.circular = I.circular, D.value = I.value;
        else
          for (let K of Object.keys(A)) {
            let V = zA9.join(Q, K),
              F = zA9.join(B, K);
            if (W(F)) continue;
            let H = A[K],
              E = !1;
            if (gO0.isAllowed$Ref(H, X)) {
              if (I = $A9(H, V, F, G, Z, Y, J, X), E = I.circular, A[K] !== I.value) A[K] = I.value
            } else if (!G.has(H)) {
              if (I = uO0(H, V, F, G, Z, Y, J, X), E = I.circular, A[K] !== I.value) A[K] = I.value
            } else E = CA9(V, J, X);
            D.circular = D.circular || E
          }
        G.delete(A)
      }
    }
    return D
  }

  function $A9(A, Q, B, G, Z, Y, J, X) {
    let I = h57.resolve(Q, A.$ref),
      D = Y.get(I);
    if (D) {
      let E = Object.keys(A);
      if (E.length > 1) {
        let z = {};
        for (let $ of E)
          if ($ !== "$ref" && !($ in D.value)) z[$] = A[$];
        return {
          circular: D.circular,
          value: Object.assign({}, D.value, z)
        }
      }
      return D
    }
    let W = J._resolve(I, Q, X);
    if (W === null) return {
      circular: !1,
      value: null
    };
    let K = W.circular,
      V = K || G.has(W.value);
    V && CA9(Q, J, X);
    let F = gO0.dereference(A, W.value);
    if (!V) {
      let E = uO0(F, W.path, B, G, Z, Y, J, X);
      V = E.circular, F = E.value
    }
    if (V && !K && X.dereference.circular === "ignore") F = A;
    if (K) F.$ref = B;
    let H = {
      circular: V,
      value: F
    };
    if (Object.keys(A).length === 1) Y.set(I, H);
    return H
  }

  function CA9(A, Q, B) {
    if (Q.circular = !0, !B.dereference.circular) throw f57.reference(`Circular $ref pointer found at ${A}`);
    return !0
  }
})
// @from(Ln 391914, Col 4)
wA9 = U((MzY, NA9) => {
  function u57() {
    if (typeof process === "object" && typeof process.nextTick === "function") return process.nextTick;
    else if (typeof setImmediate === "function") return setImmediate;
    else return function (Q) {
      setTimeout(Q, 0)
    }
  }
  NA9.exports = u57()
})
// @from(Ln 391924, Col 4)
MA9 = U((RzY, OA9) => {
  var LA9 = wA9();
  OA9.exports = function (Q, B) {
    if (Q) {
      B.then(function (G) {
        LA9(function () {
          Q(null, G)
        })
      }, function (G) {
        LA9(function () {
          Q(G)
        })
      });
      return
    } else return B
  }
})
// @from(Ln 391941, Col 4)
TA9 = U((_zY, pf) => {
  var jA9 = Lt2(),
    m57 = AO0(),
    $H1 = IA9(),
    d57 = VA9(),
    c57 = EA9(),
    p57 = qA9(),
    JzA = zj(),
    {
      JSONParserError: l57,
      InvalidPointerError: i57,
      MissingPointerError: n57,
      ResolverError: a57,
      ParserError: o57,
      UnmatchedParserError: r57,
      UnmatchedResolverError: s57,
      isHandledError: t57,
      JSONParserErrorGroup: RA9
    } = Tx(),
    Sx = MA9(),
    {
      ono: _A9
    } = at();
  pf.exports = cf;
  pf.exports.default = cf;
  pf.exports.JSONParserError = l57;
  pf.exports.InvalidPointerError = i57;
  pf.exports.MissingPointerError = n57;
  pf.exports.ResolverError = a57;
  pf.exports.ParserError = o57;
  pf.exports.UnmatchedParserError = r57;
  pf.exports.UnmatchedResolverError = s57;

  function cf() {
    this.schema = null, this.$refs = new jA9
  }
  cf.parse = function (Q, B, G, Z) {
    let J = new this;
    return J.parse.apply(J, arguments)
  };
  cf.prototype.parse = async function (Q, B, G, Z) {
    let Y = $H1(arguments),
      J;
    if (!Y.path && !Y.schema) {
      let D = _A9(`Expected a file path, URL, or object. Got ${Y.path||Y.schema}`);
      return Sx(Y.callback, Promise.reject(D))
    }
    this.schema = null, this.$refs = new jA9;
    let X = "http";
    if (JzA.isFileSystemPath(Y.path)) Y.path = JzA.fromFileSystemPath(Y.path), X = "file";
    if (Y.path = JzA.resolve(JzA.cwd(), Y.path), Y.schema && typeof Y.schema === "object") {
      let D = this.$refs._add(Y.path);
      D.value = Y.schema, D.pathType = X, J = Promise.resolve(Y.schema)
    } else J = m57(Y.path, this.$refs, Y.options);
    let I = this;
    try {
      let D = await J;
      if (D !== null && typeof D === "object" && !Buffer.isBuffer(D)) return I.schema = D, Sx(Y.callback, Promise.resolve(I.schema));
      else if (Y.options.continueOnError) return I.schema = null, Sx(Y.callback, Promise.resolve(I.schema));
      else throw _A9.syntax(`"${I.$refs._root$Ref.path||D}" is not a valid JSON Schema`)
    } catch (D) {
      if (!Y.options.continueOnError || !t57(D)) return Sx(Y.callback, Promise.reject(D));
      if (this.$refs._$refs[JzA.stripHash(Y.path)]) this.$refs._$refs[JzA.stripHash(Y.path)].addError(D);
      return Sx(Y.callback, Promise.resolve(null))
    }
  };
  cf.resolve = function (Q, B, G, Z) {
    let J = new this;
    return J.resolve.apply(J, arguments)
  };
  cf.prototype.resolve = async function (Q, B, G, Z) {
    let Y = this,
      J = $H1(arguments);
    try {
      return await this.parse(J.path, J.schema, J.options), await d57(Y, J.options), mO0(Y), Sx(J.callback, Promise.resolve(Y.$refs))
    } catch (X) {
      return Sx(J.callback, Promise.reject(X))
    }
  };
  cf.bundle = function (Q, B, G, Z) {
    let J = new this;
    return J.bundle.apply(J, arguments)
  };
  cf.prototype.bundle = async function (Q, B, G, Z) {
    let Y = this,
      J = $H1(arguments);
    try {
      return await this.resolve(J.path, J.schema, J.options), c57(Y, J.options), mO0(Y), Sx(J.callback, Promise.resolve(Y.schema))
    } catch (X) {
      return Sx(J.callback, Promise.reject(X))
    }
  };
  cf.dereference = function (Q, B, G, Z) {
    let J = new this;
    return J.dereference.apply(J, arguments)
  };
  cf.prototype.dereference = async function (Q, B, G, Z) {
    let Y = this,
      J = $H1(arguments);
    try {
      return await this.resolve(J.path, J.schema, J.options), p57(Y, J.options), mO0(Y), Sx(J.callback, Promise.resolve(Y.schema))
    } catch (X) {
      return Sx(J.callback, Promise.reject(X))
    }
  };

  function mO0(A) {
    if (RA9.getParserErrors(A).length > 0) throw new RA9(A)
  }
})
// @from(Ln 392052, Col 0)
function CH1({
  mainThreadAgentDefinition: A,
  toolUseContext: Q,
  customSystemPrompt: B,
  defaultSystemPrompt: G,
  appendSystemPrompt: Z
}) {
  let Y = A ? p_(A) ? A.getSystemPrompt({
    toolUseContext: {
      options: Q.options
    }
  }) : A.getSystemPrompt() : void 0;
  return [...Y ? [Y] : B ? [B] : G, ...Z ? [Z] : []]
}
// @from(Ln 392066, Col 4)
dO0 = w(() => {
  _S()
})
// @from(Ln 392079, Col 0)
function IzA(A, Q) {
  switch (A) {
    case "policySettings":
      return XzA(xL(), ".claude", Q);
    case "userSettings":
      return XzA(zQ(), Q);
    case "projectSettings":
      return `.claude/${Q}`;
    case "plugin":
      return "plugin";
    default:
      return ""
  }
}
// @from(Ln 392094, Col 0)
function DzA(A) {
  let Q = [A.name, A.description, A.whenToUse].filter(Boolean).join(" ");
  return l7(Q)
}
// @from(Ln 392099, Col 0)
function A77(A) {
  try {
    let Q = e57(A, {
      bigint: !0
    });
    return `${Q.dev}:${Q.ino}`
  } catch {
    return null
  }
}
// @from(Ln 392110, Col 0)
function UH1(A) {
  return A === !0 || A === "true"
}
// @from(Ln 392114, Col 0)
function SA9(A, Q) {
  if (!A.hooks) return;
  let B = jb.safeParse(A.hooks);
  if (!B.success) {
    k(`Invalid hooks in skill '${Q}': ${B.error.message}`);
    return
  }
  return B.data
}
// @from(Ln 392124, Col 0)
function xA9({
  skillName: A,
  displayName: Q,
  description: B,
  hasUserSpecifiedDescription: G,
  markdownContent: Z,
  allowedTools: Y,
  argumentHint: J,
  whenToUse: X,
  version: I,
  model: D,
  disableModelInvocation: W,
  userInvocable: K,
  source: V,
  baseDir: F,
  loadedFrom: H,
  hooks: E,
  executionContext: z,
  agent: $
}) {
  return {
    type: "prompt",
    name: A,
    description: B,
    hasUserSpecifiedDescription: G,
    allowedTools: Y,
    argumentHint: J,
    whenToUse: X,
    version: I,
    model: D,
    disableModelInvocation: W,
    userInvocable: K,
    context: z,
    agent: $,
    contentLength: Z.length,
    isEnabled: () => !0,
    isHidden: !K,
    progressMessage: "running",
    userFacingName() {
      return Q || A
    },
    source: V,
    loadedFrom: H,
    hooks: E,
    async getPromptForCommand(O, L) {
      let M = F ? `Base directory for this skill: ${F}

${Z}` : Z;
      if (O)
        if (M.includes("$ARGUMENTS")) M = M.replaceAll("$ARGUMENTS", O);
        else M = M + `

ARGUMENTS: ${O}`;
      return M = await Ct(M, {
        ...L,
        async getAppState() {
          let _ = await L.getAppState();
          return {
            ..._,
            toolPermissionContext: {
              ..._.toolPermissionContext,
              alwaysAllowRules: {
                ..._.toolPermissionContext.alwaysAllowRules,
                command: Y
              }
            }
          }
        }
      }, `/${A}`), [{
        type: "text",
        text: M
      }]
    }
  }
}
// @from(Ln 392199, Col 0)
async function cO0(A, Q) {
  let B = vA(),
    G = [];
  try {
    if (!B.existsSync(A)) return [];
    let Z = B.readdirSync(A);
    for (let Y of Z) try {
      if (Y.isDirectory() || Y.isSymbolicLink()) {
        let J = XzA(A, Y.name),
          X = XzA(J, "SKILL.md");
        if (B.existsSync(X)) {
          let I = B.readFileSync(X, {
              encoding: "utf-8"
            }),
            {
              frontmatter: D,
              content: W
            } = lK(I),
            K = Y.name,
            V = D.description ?? dc(W, "Skill"),
            F = RS(D["allowed-tools"]),
            H = D["user-invocable"] === void 0 ? !0 : UH1(D["user-invocable"]),
            E = UH1(D["disable-model-invocation"]),
            z = D.model === "inherit" ? void 0 : D.model,
            $ = SA9(D, K),
            O = D.context === "fork" ? "fork" : void 0,
            L = D.agent;
          G.push({
            skill: xA9({
              skillName: K,
              displayName: D.name,
              description: V,
              hasUserSpecifiedDescription: !!D.description,
              markdownContent: W,
              allowedTools: F,
              argumentHint: D["argument-hint"],
              whenToUse: D.when_to_use,
              version: D.version,
              model: z,
              disableModelInvocation: E,
              userInvocable: H,
              source: Q,
              baseDir: J,
              loadedFrom: "skills",
              hooks: $,
              executionContext: O,
              agent: L
            }),
            filePath: X
          })
        }
      }
    } catch (J) {
      e(J instanceof Error ? J : Error(String(J)))
    }
  } catch (Z) {
    e(Z instanceof Error ? Z : Error(String(Z)))
  }
  return G
}
// @from(Ln 392260, Col 0)
function pO0(A) {
  return /^skill\.md$/i.test(qH1(A))
}
// @from(Ln 392264, Col 0)
function Q77(A) {
  let Q = new Map;
  for (let G of A) {
    let Z = MhA(G.filePath),
      Y = Q.get(Z) ?? [];
    Y.push(G), Q.set(Z, Y)
  }
  let B = [];
  for (let [G, Z] of Q) {
    let Y = Z.filter((J) => pO0(J.filePath));
    if (Y.length > 0) {
      let J = Y[0];
      if (Y.length > 1) k(`Multiple skill files found in ${G}, using ${qH1(J.filePath)}`);
      B.push(J)
    } else B.push(...Z)
  }
  return B
}
// @from(Ln 392283, Col 0)
function yA9(A, Q) {
  let B = Q.endsWith(PA9) ? Q.slice(0, -1) : Q;
  if (A === B) return "";
  let G = A.slice(B.length + 1);
  return G ? G.split(PA9).join(":") : ""
}
// @from(Ln 392290, Col 0)
function B77(A, Q) {
  let B = MhA(A),
    G = MhA(B),
    Z = qH1(B),
    Y = yA9(G, Q);
  return Y ? `${Y}:${Z}` : Z
}
// @from(Ln 392298, Col 0)
function G77(A, Q) {
  let B = qH1(A),
    G = MhA(A),
    Z = B.replace(/\.md$/, ""),
    Y = yA9(G, Q);
  return Y ? `${Y}:${Z}` : Z
}
// @from(Ln 392306, Col 0)
function Z77(A) {
  return pO0(A.filePath) ? B77(A.filePath, A.baseDir) : G77(A.filePath, A.baseDir)
}
// @from(Ln 392309, Col 0)
async function Y77(A) {
  try {
    let Q = await bd("commands", A),
      B = Q77(Q),
      G = [];
    for (let {
        baseDir: Z,
        filePath: Y,
        frontmatter: J,
        content: X,
        source: I
      }
      of B) try {
      let D = J.description ?? dc(X, "Custom command"),
        W = RS(J["allowed-tools"]),
        K = J["user-invocable"] === void 0 ? !0 : UH1(J["user-invocable"]),
        V = UH1(J["disable-model-invocation"]),
        F = J.model === "inherit" ? void 0 : J.model ? FX(J.model) : void 0,
        H = J.context === "fork" ? "fork" : void 0,
        E = J.agent,
        $ = pO0(Y) ? MhA(Y) : void 0,
        O = Z77({
          baseDir: Z,
          filePath: Y,
          frontmatter: J,
          content: X,
          source: I
        }),
        L = SA9(J, O);
      G.push({
        skill: xA9({
          skillName: O,
          displayName: void 0,
          description: D,
          hasUserSpecifiedDescription: !!J.description,
          markdownContent: X,
          allowedTools: W,
          argumentHint: J["argument-hint"],
          whenToUse: J.when_to_use,
          version: J.version,
          model: F,
          disableModelInvocation: V,
          userInvocable: K,
          source: I,
          baseDir: $,
          loadedFrom: "commands_DEPRECATED",
          hooks: L,
          executionContext: H,
          agent: E
        }),
        filePath: Y
      })
    } catch (D) {
      e(D instanceof Error ? D : Error(String(D)))
    }
    return G
  } catch (Q) {
    return e(Q instanceof Error ? Q : Error(String(Q))), []
  }
}
// @from(Ln 392370, Col 0)
function NH1() {
  lO0.cache?.clear?.(), bd.cache?.clear?.()
}
// @from(Ln 392373, Col 4)
lO0
// @from(Ln 392374, Col 4)
RhA = w(() => {
  Y9();
  v1();
  T1();
  VEA();
  kd();
  DQ();
  Da();
  fQ();
  GB();
  YI();
  l2();
  wd();
  qN();
  lO0 = W0(async (A) => {
    let Q = XzA(zQ(), "skills"),
      B = XzA(xL(), ".claude", "skills"),
      G = iO0("skills", A);
    k(`Loading skills from: managed=${B}, user=${Q}, project=[${G.join(", ")}]`);
    let [Z, Y, J] = await Promise.all([cO0(B, "policySettings"), iK("userSettings") ? cO0(Q, "userSettings") : Promise.resolve([]), iK("projectSettings") ? Promise.all(G.map((V) => cO0(V, "projectSettings"))) : Promise.resolve([])]), X = await Y77(A), I = [...Z, ...Y, ...J.flat(), ...X], D = new Map, W = [];
    for (let {
        skill: V,
        filePath: F
      }
      of I) {
      if (V.type !== "prompt") continue;
      let H = A77(F);
      if (H === null) {
        W.push(V);
        continue
      }
      let E = D.get(H);
      if (E !== void 0) {
        k(`Skipping duplicate skill '${V.name}' from ${V.source} (same inode already loaded from ${E})`);
        continue
      }
      D.set(H, V.source), W.push(V)
    }
    let K = I.length - W.length;
    if (K > 0) k(`Deduplicated ${K} skills (same inode)`);
    return k(`Loaded ${W.length} unique skills (managed: ${Z.length}, user: ${Y.length}, project: ${J.flat().length}, legacy commands: ${X.length})`), W
  })
})
// @from(Ln 392417, Col 0)
async function _hA(A, Q) {
  try {
    let B = await gSA(A, Q);
    if (B !== null) return B;
    k(`countTokensWithFallback: API returned null, trying haiku fallback (${Q.length} tools)`)
  } catch (B) {
    k(`countTokensWithFallback: API failed: ${B instanceof Error?B.message:String(B)}`), e(B instanceof Error ? B : Error(String(B)))
  }
  try {
    let B = await neB(A, Q);
    if (B === null) k(`countTokensWithFallback: haiku fallback also returned null (${Q.length} tools)`);
    return B
  } catch (B) {
    return k(`countTokensWithFallback: haiku fallback failed: ${B instanceof Error?B.message:String(B)}`), e(B instanceof Error ? B : Error(String(B))), null
  }
}
// @from(Ln 392433, Col 0)
async function jhA(A, Q, B, G) {
  let Z = await Promise.all(A.map((J) => LH1(J, {
      getToolPermissionContext: Q,
      tools: A,
      agents: B?.activeAgents ?? [],
      model: G
    }))),
    Y = await _hA([], Z);
  if (Y === null || Y === 0) {
    let J = A.map((X) => X.name).join(", ");
    k(`countToolDefinitionTokens returned ${Y} for ${A.length} tools: ${J.slice(0,100)}${J.length>100?"...":""}`)
  }
  return Y ?? 0
}
// @from(Ln 392447, Col 0)
async function X77(A) {
  let Q = await OF(),
    B = [...A, ...Object.values(Q)];
  if (B.length < 1) return 0;
  return (await Promise.all(B.filter((Z) => Z.length > 0).map((Z) => _hA([{
    role: "user",
    content: Z
  }], [])))).reduce((Z, Y) => Z + (Y || 0), 0)
}
// @from(Ln 392456, Col 0)
async function I77() {
  let A = GV(),
    Q = [],
    B = 0;
  if (A.length < 1) return {
    memoryFileDetails: [],
    claudeMdTokens: 0
  };
  let G = await Promise.all(A.map(async (Z) => {
    let Y = await _hA([{
      role: "user",
      content: Z.content
    }], []);
    return {
      file: Z,
      tokens: Y || 0
    }
  }));
  for (let {
      file: Z,
      tokens: Y
    }
    of G) B += Y, Q.push({
    path: Z.path,
    type: Z.type,
    tokens: Y
  });
  return {
    claudeMdTokens: B,
    memoryFileDetails: Q
  }
}
// @from(Ln 392488, Col 0)
async function D77(A, Q, B, G) {
  let Z = A.filter((Y) => !Y.isMcp);
  if (Z.length < 1) return 0;
  return await jhA(Z, Q, B, G)
}
// @from(Ln 392494, Col 0)
function vA9(A) {
  return A.find((Q) => Q.name === kF)
}
// @from(Ln 392497, Col 0)
async function W77(A, Q, B) {
  let G = await dP2(o1()),
    Z = vA9(A);
  if (!Z) return {
    slashCommandTokens: 0,
    commandInfo: {
      totalCommands: 0,
      includedCommands: 0
    }
  };
  return {
    slashCommandTokens: await jhA([Z], Q, B),
    commandInfo: {
      totalCommands: G.totalCommands,
      includedCommands: G.includedCommands
    }
  }
}
// @from(Ln 392515, Col 0)
async function K77(A, Q, B) {
  try {
    let G = await cP2(o1()),
      Z = vA9(A);
    if (!Z) return {
      skillTokens: 0,
      skillInfo: {
        totalSkills: 0,
        includedSkills: 0,
        skillFrontmatter: []
      }
    };
    let Y = await jhA([Z], Q, B),
      J = G.map((X) => ({
        name: X.userFacingName(),
        source: X.type === "prompt" ? X.source : "plugin",
        tokens: DzA(X)
      }));
    return {
      skillTokens: Y,
      skillInfo: {
        totalSkills: G.length,
        includedSkills: G.length,
        skillFrontmatter: J
      }
    }
  } catch (G) {
    return e(G instanceof Error ? G : Error("Failed to count skill tokens")), {
      skillTokens: 0,
      skillInfo: {
        totalSkills: 0,
        includedSkills: 0,
        skillFrontmatter: []
      }
    }
  }
}
// @from(Ln 392552, Col 0)
async function ThA(A, Q, B, G, Z) {
  let Y = A.filter((E) => E.isMcp),
    J = [],
    I = (await Promise.all(Y.map((E) => jhA([E], Q, B, G)))).map((E) => Math.max(0, (E || 0) - J77)),
    D = I.reduce((E, z) => E + z, 0),
    {
      isToolSearchEnabled: W
    } = await Promise.resolve().then(() => (Wb(), deB)),
    K = await W(G, A, Q, B?.activeAgents ?? []),
    V = new Set;
  if (K && Z) {
    let E = new Set(Y.map((z) => z.name));
    for (let z of Z)
      if (z.type === "assistant") {
        for (let $ of z.message.content)
          if ("type" in $ && $.type === "tool_use" && "name" in $ && typeof $.name === "string" && E.has($.name)) V.add($.name)
      }
  }
  for (let [E, z] of Y.entries()) J.push({
    name: z.name,
    serverName: z.name.split("__")[1] || "unknown",
    tokens: I[E],
    isLoaded: V.has(z.name)
  });
  let F = 0,
    H = 0;
  for (let E of J)
    if (E.isLoaded) F += E.tokens;
    else if (K) H += E.tokens;
  return {
    mcpToolTokens: K ? F : D,
    mcpToolDetails: J,
    deferredToolTokens: H,
    loadedMcpToolNames: V
  }
}
// @from(Ln 392588, Col 0)
async function kA9(A, Q, B) {
  let G = A.filter((Z) => !Z.isMcp);
  if (G.length === 0) return 0;
  return jhA(G, Q, B)
}
// @from(Ln 392593, Col 0)
async function V77(A) {
  let Q = A.activeAgents.filter((Y) => Y.source !== "built-in"),
    B = [],
    G = 0,
    Z = await Promise.all(Q.map((Y) => _hA([{
      role: "user",
      content: [Y.agentType, Y.whenToUse].join(" ")
    }], [])));
  for (let [Y, J] of Q.entries()) {
    let X = Z[Y] || 0;
    G += X || 0, B.push({
      agentType: J.agentType,
      source: J.source,
      tokens: X || 0
    })
  }
  return {
    agentTokens: G,
    agentDetails: B
  }
}
// @from(Ln 392614, Col 0)
async function F77(A) {
  let Q = await lc(A),
    B = {
      totalTokens: 0,
      toolCallTokens: 0,
      toolResultTokens: 0,
      attachmentTokens: 0,
      assistantMessageTokens: 0,
      userMessageTokens: 0,
      toolCallsByType: new Map,
      toolResultsByType: new Map,
      attachmentsByType: new Map
    },
    G = await _hA(FI(Q.messages).map((Z) => {
      if (Z.type === "assistant") return {
        role: "assistant",
        content: Z.message.content
      };
      return Z.message
    }), []);
  return B.totalTokens = G ?? 0, B
}
// @from(Ln 392636, Col 0)
async function oO0(A, Q, B, G, Z, Y, J, X) {
  let I = HQA({
      permissionMode: (await B()).mode,
      mainLoopModel: Q
    }),
    D = Jq(I, SM()),
    W = await rc(G, I),
    K = CH1({
      mainThreadAgentDefinition: X,
      toolUseContext: J ?? {
        options: {}
      },
      customSystemPrompt: J?.options.customSystemPrompt,
      defaultSystemPrompt: W,
      appendSystemPrompt: J?.options.appendSystemPrompt
    }),
    [V, {
      claudeMdTokens: F,
      memoryFileDetails: H
    }, E, {
      mcpToolTokens: z,
      mcpToolDetails: $,
      deferredToolTokens: O
    }, {
      agentTokens: L,
      agentDetails: M
    }, {
      slashCommandTokens: _,
      commandInfo: j
    }, x] = await Promise.all([X77(K), I77(), D77(G, B, Z, I), ThA(G, B, Z, I, A), V77(Z), W77(G, B, Z), F77(A)]),
    S = (await K77(G, B, Z)).skillInfo,
    u = S.skillFrontmatter.reduce((xA, mA) => xA + mA.tokens, 0),
    f = x.totalTokens,
    AA = nc(),
    n = AA ? q3A() - uL0 : void 0,
    y = [];
  if (V > 0) y.push({
    name: "System prompt",
    tokens: V,
    color: "promptBorder"
  });
  let p = E - u;
  if (p > 0) y.push({
    name: "System tools",
    tokens: p,
    color: "inactive"
  });
  if (z > 0) y.push({
    name: "MCP tools",
    tokens: z,
    color: "cyan_FOR_SUBAGENTS_ONLY"
  });
  if (O > 0) y.push({
    name: "MCP tools (deferred)",
    tokens: O,
    color: "inactive",
    isDeferred: !0
  });
  if (L > 0) y.push({
    name: "Custom agents",
    tokens: L,
    color: "permission"
  });
  if (F > 0) y.push({
    name: "Memory files",
    tokens: F,
    color: "claude"
  });
  if (u > 0) y.push({
    name: "Skills",
    tokens: u,
    color: "warning"
  });
  if (f !== null && f > 0) y.push({
    name: "Messages",
    tokens: f,
    color: "purple_FOR_SUBAGENTS_ONLY"
  });
  let GA = y.reduce((xA, mA) => xA + (mA.isDeferred ? 0 : mA.tokens), 0),
    WA = 0;
  if (AA && n !== void 0) WA = D - n, y.push({
    name: nO0,
    tokens: WA,
    color: "inactive"
  });
  else if (!AA) WA = mL0, y.push({
    name: aO0,
    tokens: WA,
    color: "inactive"
  });
  let MA = Math.max(0, D - GA - WA);
  y.push({
    name: "Free space",
    tokens: MA,
    color: "promptBorder"
  });
  let TA = GA,
    bA = Y && Y < 80,
    jA = D >= 1e6 ? bA ? 5 : 20 : bA ? 5 : 10,
    OA = D >= 1e6 ? 10 : bA ? 5 : 10,
    IA = jA * OA,
    ZA = y.filter((xA) => !xA.isDeferred).map((xA) => ({
      ...xA,
      squares: xA.name === "Free space" ? Math.round(xA.tokens / D * IA) : Math.max(1, Math.round(xA.tokens / D * IA)),
      percentageOfTotal: Math.round(xA.tokens / D * 100)
    }));

  function zA(xA) {
    let mA = [],
      G1 = xA.tokens / D * IA,
      J1 = Math.floor(G1),
      SA = G1 - J1;
    for (let A1 = 0; A1 < xA.squares; A1++) {
      let n1 = 1;
      if (A1 === J1 && SA > 0) n1 = SA;
      mA.push({
        color: xA.color,
        isFilled: !0,
        categoryName: xA.name,
        tokens: xA.tokens,
        percentage: xA.percentageOfTotal,
        squareFullness: n1
      })
    }
    return mA
  }
  let wA = [],
    _A = ZA.find((xA) => xA.name === nO0 || xA.name === aO0),
    s = ZA.filter((xA) => xA.name !== nO0 && xA.name !== aO0 && xA.name !== "Free space");
  for (let xA of s) {
    let mA = zA(xA);
    for (let G1 of mA)
      if (wA.length < IA) wA.push(G1)
  }
  let t = _A ? _A.squares : 0,
    BA = y.find((xA) => xA.name === "Free space"),
    DA = IA - t;
  while (wA.length < DA) wA.push({
    color: "promptBorder",
    isFilled: !0,
    categoryName: "Free space",
    tokens: BA?.tokens || 0,
    percentage: BA ? Math.round(BA.tokens / D * 100) : 0,
    squareFullness: 1
  });
  if (_A) {
    let xA = zA(_A);
    for (let mA of xA)
      if (wA.length < IA) wA.push(mA)
  }
  let CA = [];
  for (let xA = 0; xA < OA; xA++) CA.push(wA.slice(xA * jA, (xA + 1) * jA));
  let FA;
  return {
    categories: y,
    totalTokens: TA,
    maxTokens: D,
    rawMaxTokens: D,
    percentage: Math.round(TA / D * 100),
    gridRows: CA,
    model: I,
    memoryFiles: H,
    mcpTools: $,
    agents: M,
    slashCommands: _ > 0 ? {
      totalCommands: j.totalCommands,
      includedCommands: j.includedCommands,
      tokens: _
    } : void 0,
    skills: u > 0 ? {
      totalSkills: S.totalSkills,
      includedSkills: S.includedSkills,
      tokens: u,
      skillFrontmatter: S.skillFrontmatter
    } : void 0,
    autoCompactThreshold: n,
    isAutoCompactEnabled: AA,
    messageBreakdown: FA
  }
}
// @from(Ln 392816, Col 4)
nO0 = "Autocompact buffer"
// @from(Ln 392817, Col 2)
aO0 = "Compact buffer"
// @from(Ln 392818, Col 2)
J77 = 500
// @from(Ln 392819, Col 4)
wH1 = w(() => {
  FT();
  C0();
  OS();
  qN();
  wc();
  dO0();
  nz();
  N3A();
  tQ();
  oc();
  l2();
  akA();
  V2();
  nt();
  v1();
  T1();
  RhA();
  A0()
})
// @from(Ln 392842, Col 0)
async function LH1(A, Q) {
  let B = f8("tengu_tool_pear"),
    G = {
      name: A.name,
      description: await A.prompt({
        getToolPermissionContext: Q.getToolPermissionContext,
        tools: Q.tools,
        agents: Q.agents
      }),
      input_schema: "inputJSONSchema" in A && A.inputJSONSchema ? A.inputJSONSchema : sEA(A.inputSchema)
    };
  if (B && A.strict === !0 && Q.model && cp1(Q.model)) G.strict = !0;
  if (Q.betas?.includes(UdA) && A.input_examples) G.input_examples = A.input_examples;
  if (Q.deferLoading) G.defer_loading = !0;
  return G
}
// @from(Ln 392859, Col 0)
function bA9(A) {
  let [Q] = rO0(A);
  l("tengu_sysprompt_block", {
    snippet: Q?.slice(0, 20),
    length: Q?.length ?? 0,
    hash: Q ? H77("sha256").update(Q).digest("hex") : ""
  })
}
// @from(Ln 392868, Col 0)
function rO0(A) {
  let Q, B, G = [];
  for (let J of A) {
    if (!J) continue;
    if (J.startsWith("x-anthropic-billing-header")) Q = J;
    else if (DCB.has(J)) B = J;
    else G.push(J)
  }
  let Z = [];
  if (Q) Z.push(Q);
  if (B) Z.push(B);
  let Y = G.join(`
`);
  if (Y) Z.push(Y);
  return Z
}
// @from(Ln 392885, Col 0)
function fA9(A, Q) {
  return [...A, Object.entries(Q).map(([B, G]) => `${B}: ${G}`).join(`
`)].filter(Boolean)
}
// @from(Ln 392890, Col 0)
function _3A(A, Q) {
  if (Object.entries(Q).length === 0) return A;
  return [H0({
    content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(Q).map(([B,G])=>`# ${B}
${G}`).join(`
`)}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
    isMeta: !0
  }), ...A]
}
// @from(Ln 392905, Col 0)
async function hA9(A, Q) {
  if (gW()) return;
  let [{
    tools: B
  }, G, Z, Y] = await Promise.all([PF1(A), F$(Q), ZV(), OF()]), J = Y.gitStatus?.length ?? 0, X = Z.claudeMd?.length ?? 0, I = J + X, D = c9();
  setTimeout(() => D.abort(), 1000);
  let W = o1(),
    K = PHA(Q),
    V = THA(K, W),
    F = await YpA(W, D.signal, V),
    H = 0,
    E = 0,
    z = 0,
    $ = 0,
    O = 0,
    L = G.filter((_) => !_.isMcp);
  H = B.length, $ = L.length;
  let M = new Set;
  for (let _ of B) {
    let j = _.name.split("__");
    if (j.length >= 3 && j[1]) M.add(j[1])
  }
  E = M.size;
  try {
    if (B.length > 0) {
      let _ = B5(),
        {
          mcpToolTokens: j
        } = await ThA(G, async () => Q, null, _);
      z = j
    }
    if (L.length > 0) O = await kA9(G, async () => Q, null)
  } catch {}
  l("tengu_context_size", {
    git_status_size: J,
    claude_md_size: X,
    total_context_size: I,
    project_file_count_rounded: F,
    mcp_tools_count: H,
    mcp_servers_count: E,
    mcp_tools_tokens: z,
    non_mcp_tools_count: $,
    non_mcp_tools_tokens: O
  })
}
// @from(Ln 392951, Col 0)
function gA9(A, Q, B) {
  switch (A.name) {
    case vd: {
      let G = AK(B);
      if (G) return {
        ...Q,
        plan: G
      };
      return Q
    }
    case o2.name: {
      let G = o2.inputSchema.parse(Q),
        {
          command: Z,
          timeout: Y,
          description: J
        } = G,
        X = Z.replace(`cd ${o1()} && `, "");
      if (X = X.replace(/\\\\;/g, "\\;"), /^echo\s+["']?[^|&;><]*["']?$/i.test(X.trim())) l("tengu_bash_tool_simple_echo", {});
      let I = "run_in_background" in G ? G.run_in_background : void 0;
      return {
        command: X,
        description: J,
        ...Y ? {
          timeout: Y
        } : {},
        ...J ? {
          description: J
        } : {},
        ...I ? {
          run_in_background: I
        } : {},
        ..."dangerouslyDisableSandbox" in G && G.dangerouslyDisableSandbox ? {
          dangerouslyDisableSandbox: G.dangerouslyDisableSandbox
        } : {}
      }
    }
    case J$.name: {
      let G = J$.inputSchema.parse(Q),
        {
          file_path: Z,
          edits: Y
        } = zS2({
          file_path: G.file_path,
          edits: [{
            old_string: G.old_string,
            new_string: G.new_string,
            replace_all: G.replace_all
          }]
        });
      return {
        replace_all: Y[0].replace_all,
        file_path: Z,
        old_string: Y[0].old_string,
        new_string: Y[0].new_string
      }
    }
    case X$.name: {
      let G = X$.inputSchema.parse(Q);
      return {
        file_path: G.file_path,
        content: ez0(G.content)
      }
    }
    case aHA: {
      let G = Q,
        Z = G.task_id ?? G.agentId ?? G.bash_id,
        Y = G.timeout ?? (typeof G.wait_up_to === "number" ? G.wait_up_to * 1000 : void 0);
      return {
        task_id: Z ?? "",
        block: G.block ?? !0,
        timeout: Y ?? 30000
      }
    }
    default:
      return Q
  }
}
// @from(Ln 393030, Col 0)
function uA9(A, Q) {
  switch (A.name) {
    case vd: {
      if (Q && typeof Q === "object" && "plan" in Q) {
        let {
          plan: B,
          ...G
        } = Q;
        return G
      }
      return Q
    }
    default:
      return Q
  }
}
// @from(Ln 393046, Col 4)
E77
// @from(Ln 393047, Col 4)
oc = w(() => {
  eF1();
  w6();
  $B1();
  Z0();
  tQ();
  uy();
  V2();
  AY();
  YK();
  is();
  hs();
  jc();
  iZ();
  UF();
  A0();
  T1();
  wH1();
  l2();
  RR();
  a5A();
  jN();
  OS();
  az();
  Mu();
  E77 = c(TA9(), 1)
})
// @from(Ln 393074, Col 4)
mA9 = w(() => {
  Z0();
  tQ();
  nY();
  oc();
  iZ();
  l2();
  A0()
})
// @from(Ln 393083, Col 4)
dA9 = w(() => {
  w6();
  YK();
  jc();
  is();
  u6A();
  v1();
  mA9()
})
// @from(Ln 393093, Col 0)
function cA9(A) {
  let Q = A.toLowerCase();
  return /\b(wtf|wth|ffs|omfg|shit(ty|tiest)?|dumbass|horrible|awful|piss(ed|ing)? off|piece of (shit|crap|junk)|what the (fuck|hell)|fucking? (broken|useless|terrible|awful|horrible)|fuck you|screw (this|you)|so frustrating|this sucks|damn it)\b/.test(Q)
}
// @from(Ln 393098, Col 0)
function pA9(A) {
  let Q = A.toLowerCase().trim();
  if (Q === "continue") return !0;
  return /\b(keep going|go on)\b/.test(Q)
}
// @from(Ln 393104, Col 0)
function lA9(A) {
  let Q = A.toLowerCase();
  return /\b(you'?re absolutely right|you'?re right)\b/.test(Q)
}
// @from(Ln 393109, Col 0)
function MH1() {
  if (!sO0) sO0 = NA("perf_hooks").performance;
  return sO0
}
// @from(Ln 393114, Col 0)
function $77() {
  let A = MH1(),
    Q = A.getEntriesByType("mark");
  for (let B of Q)
    if (B.name.startsWith(ShA)) A.clearMarks(B.name)
}
// @from(Ln 393121, Col 0)
function eO0() {
  if (!p2()) return;
  if (!tO0) return;
  if (PhA++, $77(), MH1().mark(`${ShA}turn_start`), OH1) k(`[headlessProfiler] Started turn ${PhA}`)
}
// @from(Ln 393127, Col 0)
function j3A(A) {
  if (!p2()) return;
  if (!tO0) return;
  let Q = MH1();
  if (Q.mark(`${ShA}${A}`), OH1) k(`[headlessProfiler] Checkpoint: ${A} at ${Q.now().toFixed(1)}ms`)
}
// @from(Ln 393134, Col 0)
function AM0() {
  if (!p2()) return;
  if (!tO0) return;
  let B = MH1().getEntriesByType("mark").filter((W) => W.name.startsWith(ShA));
  if (B.length === 0) return;
  let G = new Map;
  for (let W of B) {
    let K = W.name.slice(ShA.length);
    G.set(K, W.startTime)
  }
  let Z = G.get("turn_start");
  if (Z === void 0) return;
  let Y = {
      turn_number: PhA
    },
    J = G.get("system_message_yielded");
  if (J !== void 0 && PhA === 0) Y.time_to_system_message_ms = Math.round(J);
  let X = G.get("query_started");
  if (X !== void 0) Y.time_to_query_start_ms = Math.round(X - Z);
  let I = G.get("first_chunk");
  if (I !== void 0) Y.time_to_first_response_ms = Math.round(I - Z);
  let D = G.get("api_request_sent");
  if (X !== void 0 && D !== void 0) Y.query_overhead_ms = Math.round(D - X);
  if (Y.checkpoint_count = B.length, process.env.CLAUDE_CODE_ENTRYPOINT) Y.entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
  if (iA9) l("tengu_headless_latency", Y);
  if (OH1) k(`[headlessProfiler] Turn ${PhA} metrics: ${eA(Y)}`)
}
// @from(Ln 393161, Col 4)
OH1
// @from(Ln 393161, Col 9)
z77 = 0.05
// @from(Ln 393162, Col 2)
iA9
// @from(Ln 393162, Col 7)
tO0
// @from(Ln 393162, Col 12)
sO0 = null
// @from(Ln 393163, Col 2)
ShA = "headless_"
// @from(Ln 393164, Col 2)
PhA = -1
// @from(Ln 393165, Col 4)
xhA = w(() => {
  T1();
  Z0();
  C0();
  A0();
  OH1 = process.env.CLAUDE_CODE_PROFILE_STARTUP === "1", iA9 = Math.random() < z77, tO0 = OH1 || iA9
})
// @from(Ln 393173, Col 0)
function RH1(A) {
  nA9.push(A)
}
// @from(Ln 393176, Col 0)
async function aA9(A, Q, B, G, Z, Y) {
  let J = {
    messages: A,
    systemPrompt: Q,
    userContext: B,
    systemContext: G,
    toolUseContext: Z,
    querySource: Y
  };
  for (let X of nA9) try {
    await X(J)
  } catch (I) {
    e(I instanceof Error ? I : Error(`Post-sampling hook failed: ${I}`))
  }
}
// @from(Ln 393191, Col 4)
nA9
// @from(Ln 393192, Col 4)
yhA = w(() => {
  v1();
  nA9 = []
})
// @from(Ln 393196, Col 0)
class _H1 {
  toolDefinitions;
  canUseTool;
  tools = [];
  toolUseContext;
  hasErrored = !1;
  discarded = !1;
  progressAvailableResolve;
  constructor(A, Q, B) {
    this.toolDefinitions = A;
    this.canUseTool = Q;
    this.toolUseContext = B
  }
  discard() {
    this.discarded = !0
  }
  addTool(A, Q) {
    let B = this.toolDefinitions.find((Y) => Y.name === A.name);
    if (!B) {
      this.tools.push({
        id: A.id,
        block: A,
        assistantMessage: Q,
        status: "completed",
        isConcurrencySafe: !0,
        pendingProgress: [],
        results: [H0({
          content: [{
            type: "tool_result",
            content: `<tool_use_error>Error: No such tool available: ${A.name}</tool_use_error>`,
            is_error: !0,
            tool_use_id: A.id
          }],
          toolUseResult: `Error: No such tool available: ${A.name}`,
          sourceToolAssistantUUID: Q.uuid
        })]
      });
      return
    }
    let G = B.inputSchema.safeParse(A.input),
      Z = G?.success ? B.isConcurrencySafe(G.data) : !1;
    this.tools.push({
      id: A.id,
      block: A,
      assistantMessage: Q,
      status: "queued",
      isConcurrencySafe: Z,
      pendingProgress: []
    }), this.processQueue()
  }
  canExecuteTool(A) {
    let Q = this.tools.filter((B) => B.status === "executing");
    return Q.length === 0 || A && Q.every((B) => B.isConcurrencySafe)
  }
  async processQueue() {
    for (let A of this.tools) {
      if (A.status !== "queued") continue;
      if (this.canExecuteTool(A.isConcurrencySafe)) await this.executeTool(A);
      else if (!A.isConcurrencySafe) break
    }
  }
  createSyntheticErrorMessage(A, Q, B) {
    if (Q === "user_interrupted") return H0({
      content: [{
        type: "tool_result",
        content: v4A,
        is_error: !0,
        tool_use_id: A
      }],
      toolUseResult: "User rejected tool use",
      sourceToolAssistantUUID: B.uuid
    });
    if (Q === "streaming_fallback") return H0({
      content: [{
        type: "tool_result",
        content: "<tool_use_error>Error: Streaming fallback - tool execution discarded</tool_use_error>",
        is_error: !0,
        tool_use_id: A
      }],
      toolUseResult: "Streaming fallback - tool execution discarded",
      sourceToolAssistantUUID: B.uuid
    });
    return H0({
      content: [{
        type: "tool_result",
        content: "<tool_use_error>Sibling tool call errored</tool_use_error>",
        is_error: !0,
        tool_use_id: A
      }],
      toolUseResult: "Sibling tool call errored",
      sourceToolAssistantUUID: B.uuid
    })
  }
  getAbortReason() {
    if (this.discarded) return "streaming_fallback";
    if (this.hasErrored) return "sibling_error";
    if (this.toolUseContext.abortController.signal.aborted) return "user_interrupted";
    return null
  }
  async executeTool(A) {
    A.status = "executing", this.toolUseContext.setInProgressToolUseIDs((Y) => new Set([...Y, A.id]));
    let Q = [],
      B = [],
      Z = (async () => {
        let Y = this.getAbortReason();
        if (Y) {
          Q.push(this.createSyntheticErrorMessage(A.id, Y, A.assistantMessage)), A.results = Q, A.contextModifiers = B, A.status = "completed";
          return
        }
        let J = jH1(A.block, A.assistantMessage, this.canUseTool, this.toolUseContext),
          X = !1;
        for await (let I of J) {
          let D = this.getAbortReason();
          if (D && !X) {
            Q.push(this.createSyntheticErrorMessage(A.id, D, A.assistantMessage));
            break
          }
          if (I.message.type === "user" && Array.isArray(I.message.message.content) && I.message.message.content.some((K) => K.type === "tool_result" && K.is_error === !0)) this.hasErrored = !0, X = !0;
          if (I.message)
            if (I.message.type === "progress") {
              if (A.pendingProgress.push(I.message), this.progressAvailableResolve) this.progressAvailableResolve(), this.progressAvailableResolve = void 0
            } else Q.push(I.message);
          if (I.contextModifier) B.push(I.contextModifier.modifyContext)
        }
        if (A.results = Q, A.contextModifiers = B, A.status = "completed", !A.isConcurrencySafe && B.length > 0)
          for (let I of B) this.toolUseContext = I(this.toolUseContext)
      })();
    A.promise = Z, Z.finally(() => {
      this.processQueue()
    })
  }* getCompletedResults() {
    if (this.discarded) return;
    for (let A of this.tools) {
      while (A.pendingProgress.length > 0) yield {
        message: A.pendingProgress.shift()
      };
      if (A.status === "yielded") continue;
      if (A.status === "completed" && A.results) {
        A.status = "yielded";
        for (let Q of A.results) yield {
          message: Q
        };
        C77(this.toolUseContext, A.id)
      } else if (A.status === "executing" && !A.isConcurrencySafe) break
    }
  }
  hasPendingProgress() {
    return this.tools.some((A) => A.pendingProgress.length > 0)
  }
  async * getRemainingResults() {
    if (this.discarded) return;
    while (this.hasUnfinishedTools()) {
      await this.processQueue();
      for (let A of this.getCompletedResults()) yield A;
      if (this.hasExecutingTools() && !this.hasCompletedResults() && !this.hasPendingProgress()) {
        let A = this.tools.filter((B) => B.status === "executing" && B.promise).map((B) => B.promise),
          Q = new Promise((B) => {
            this.progressAvailableResolve = B
          });
        if (A.length > 0) await Promise.race([...A, Q])
      }
    }
    for (let A of this.getCompletedResults()) yield A
  }
  hasCompletedResults() {
    return this.tools.some((A) => A.status === "completed")
  }
  hasExecutingTools() {
    return this.tools.some((A) => A.status === "executing")
  }
  hasUnfinishedTools() {
    return this.tools.some((A) => A.status !== "yielded")
  }
  getUpdatedContext() {
    return this.toolUseContext
  }
}
// @from(Ln 393374, Col 0)
function C77(A, Q) {
  A.setInProgressToolUseIDs((B) => new Set([...B].filter((G) => G !== Q)))
}
// @from(Ln 393377, Col 4)
oA9 = w(() => {
  ks();
  tQ()
})
// @from(Ln 393385, Col 0)
function TH1(A) {
  return async (Q) => {
    try {
      if (!await A.shouldRun(Q)) return;
      let G = U77(),
        Z = A.buildMessages(Q);
      Q.queryMessageCount = Z.length;
      let Y = A.systemPrompt ? [A.systemPrompt] : Q.systemPrompt,
        X = A.useTools ?? !0 ? Q.toolUseContext.options.tools : [],
        I = A.getModel(),
        D = await Pd({
          messages: Z,
          systemPrompt: Y,
          maxThinkingTokens: 0,
          tools: X,
          signal: c9().signal,
          options: {
            getToolPermissionContext: async () => {
              return (await Q.toolUseContext.getAppState()).toolPermissionContext
            },
            model: I,
            toolChoice: void 0,
            isNonInteractiveSession: Q.toolUseContext.options.isNonInteractiveSession,
            hasAppendSystemPrompt: !!Q.toolUseContext.options.appendSystemPrompt,
            temperatureOverride: 0,
            agents: Q.toolUseContext.options.agentDefinitions.activeAgents,
            querySource: A.name,
            mcpTools: [],
            agentId: Q.toolUseContext.agentId
          }
        }),
        W = D.message.content.filter((K) => K.type === "text").map((K) => K.text).join("").trim();
      try {
        let K = A.parseResponse(W, Q);
        A.logResult({
          type: "success",
          queryName: A.name,
          result: K,
          messageId: D.message.id,
          model: I,
          uuid: G
        }, Q)
      } catch (K) {
        A.logResult({
          type: "error",
          queryName: A.name,
          error: K,
          uuid: G
        }, Q)
      }
    } catch (B) {
      e(B instanceof Error ? B : Error(`API query hook ${A.name} failed`))
    }
  }
}
// @from(Ln 393440, Col 4)
QM0 = w(() => {
  nY();
  iZ();
  v1()
})
// @from(Ln 393445, Col 0)
async function rA9() {
  return
}
// @from(Ln 393448, Col 0)
async function sA9(A) {
  if (BM0) await BM0(A)
}
// @from(Ln 393451, Col 4)
BM0 = null
// @from(Ln 393452, Col 4)
GM0 = w(() => {
  QM0();
  tQ();
  Z0();
  w6();
  l2();
  oc()
})
// @from(Ln 393461, Col 0)
function tA9() {
  q77 = []
}
// @from(Ln 393464, Col 4)
q77
// @from(Ln 393465, Col 4)
eA9 = w(() => {
  q77 = []
})
// @from(Ln 393468, Col 0)
async function A19() {
  return
}
// @from(Ln 393472, Col 0)
function L77() {
  tA9(), w77 = "", S0((A) => ({
    ...A,
    coachingTipsThisSession: 0
  }))
}
// @from(Ln 393479, Col 0)
function Q19() {
  return L1().coachingMode ?? "off"
}
// @from(Ln 393482, Col 4)
N77 = !1
// @from(Ln 393483, Col 2)
w77 = ""
// @from(Ln 393484, Col 4)
vhA = w(() => {
  $c();
  tQ();
  C0();
  GQ();
  Z0();
  v1();
  eA9()
})
// @from(Ln 393493, Col 4)
khA
// @from(Ln 393494, Col 4)
ZM0 = w(() => {
  khA = class khA {
    returned;
    queue = [];
    readResolve;
    readReject;
    isDone = !1;
    hasError;
    started = !1;
    constructor(A) {
      this.returned = A
    } [Symbol.asyncIterator]() {
      if (this.started) throw Error("Stream can only be iterated once");
      return this.started = !0, this
    }
    next() {
      if (this.queue.length > 0) return Promise.resolve({
        done: !1,
        value: this.queue.shift()
      });
      if (this.isDone) return Promise.resolve({
        done: !0,
        value: void 0
      });
      if (this.hasError) return Promise.reject(this.hasError);
      return new Promise((A, Q) => {
        this.readResolve = A, this.readReject = Q
      })
    }
    enqueue(A) {
      if (this.readResolve) {
        let Q = this.readResolve;
        this.readResolve = void 0, this.readReject = void 0, Q({
          done: !1,
          value: A
        })
      } else this.queue.push(A)
    }
    done() {
      if (this.isDone = !0, this.readResolve) {
        let A = this.readResolve;
        this.readResolve = void 0, this.readReject = void 0, A({
          done: !0,
          value: void 0
        })
      }
    }
    error(A) {
      if (this.hasError = A, this.readReject) {
        let Q = this.readReject;
        this.readResolve = void 0, this.readReject = void 0, Q(A)
      }
    }
    return () {
      if (this.isDone = !0, this.returned) this.returned();
      return Promise.resolve({
        done: !0,
        value: void 0
      })
    }
  }
})
// @from(Ln 393557, Col 0)
function IM0() {
  if (!YM0) YM0 = NA("perf_hooks").performance;
  return YM0
}
// @from(Ln 393562, Col 0)
function Z19() {
  if (!bhA) return;
  IM0().clearMarks(), XM0.clear(), JM0 = null, G19++, h6("query_user_input_received")
}
// @from(Ln 393567, Col 0)
function h6(A) {
  if (!bhA) return;
  let Q = IM0();
  if (Q.mark(A), XM0.set(A, process.memoryUsage()), A === "query_first_chunk_received" && JM0 === null) {
    let B = Q.getEntriesByType("mark");
    if (B.length > 0) JM0 = B[B.length - 1]?.startTime ?? 0
  }
}
// @from(Ln 393576, Col 0)
function Y19() {
  if (!bhA) return;
  h6("query_profile_end")
}
// @from(Ln 393581, Col 0)
function Ge(A) {
  return A.toFixed(3)
}
// @from(Ln 393585, Col 0)
function B19(A) {
  return (A / 1024 / 1024).toFixed(2)
}
// @from(Ln 393589, Col 0)
function O77(A, Q) {
  if (Q === "query_user_input_received") return "";
  if (A > 1000) return " ⚠️  VERY SLOW";
  if (A > 100) return " ⚠️  SLOW";
  if (Q.includes("git_status") && A > 50) return " ⚠️  git status";
  if (Q.includes("tool_schema") && A > 50) return " ⚠️  tool schemas";
  if (Q.includes("client_creation") && A > 50) return " ⚠️  client creation";
  return ""
}
// @from(Ln 393599, Col 0)
function M77() {
  if (!bhA) return "Query profiling not enabled (set CLAUDE_CODE_PROFILE_QUERY=1)";
  let Q = IM0().getEntriesByType("mark");
  if (Q.length === 0) return "No query profiling checkpoints recorded";
  let B = [];
  B.push("=".repeat(80)), B.push(`QUERY PROFILING REPORT - Query #${G19}`), B.push("=".repeat(80)), B.push("");
  let G = Q[0]?.startTime ?? 0,
    Z = G,
    Y = 0,
    J = 0;
  for (let D of Q) {
    let W = D.startTime - G,
      K = Ge(W),
      V = D.startTime - Z,
      F = Ge(V),
      H = XM0.get(D.name),
      E = O77(V, D.name),
      z = H ? ` | RSS: ${B19(H.rss)}MB, Heap: ${B19(H.heapUsed)}MB` : "";
    if (B.push(`[+${K.padStart(10)}ms] (+${F.padStart(9)}ms) ${D.name}${E}${z}`), D.name === "query_api_request_sent") Y = W;
    if (D.name === "query_first_chunk_received") J = W;
    Z = D.startTime
  }
  let X = Q[Q.length - 1],
    I = X ? X.startTime - G : 0;
  if (B.push(""), B.push("-".repeat(80)), J > 0) {
    let D = Y,
      W = J - Y,
      K = (D / J * 100).toFixed(1),
      V = (W / J * 100).toFixed(1);
    B.push(`Total TTFT: ${Ge(J)}ms`), B.push(`  - Pre-request overhead: ${Ge(D)}ms (${K}%)`), B.push(`  - Network latency: ${Ge(W)}ms (${V}%)`)
  } else B.push(`Total time: ${Ge(I)}ms`);
  return B.push(R77(Q, G)), B.push("=".repeat(80)), B.join(`
`)
}