
// @from(Ln 417372, Col 4)
h49 = U((KI7) => {
  var T_0 = b49();
  KI7.mul = function (Q, B) {
    let G = new Uint8Array(Q.length + B.length - 1);
    for (let Z = 0; Z < Q.length; Z++)
      for (let Y = 0; Y < B.length; Y++) G[Z + Y] ^= T_0.mul(Q[Z], B[Y]);
    return G
  };
  KI7.mod = function (Q, B) {
    let G = new Uint8Array(Q);
    while (G.length - B.length >= 0) {
      let Z = G[0];
      for (let J = 0; J < B.length; J++) G[J] ^= T_0.mul(B[J], Z);
      let Y = 0;
      while (Y < G.length && G[Y] === 0) Y++;
      G = G.slice(Y)
    }
    return G
  };
  KI7.generateECPolynomial = function (Q) {
    let B = new Uint8Array([1]);
    for (let G = 0; G < Q; G++) B = KI7.mul(B, new Uint8Array([1, T_0.exp(G)]));
    return B
  }
})
// @from(Ln 417397, Col 4)
m49 = U((flY, u49) => {
  var g49 = h49();

  function P_0(A) {
    if (this.genPoly = void 0, this.degree = A, this.degree) this.initialize(this.degree)
  }
  P_0.prototype.initialize = function (Q) {
    this.degree = Q, this.genPoly = g49.generateECPolynomial(this.degree)
  };
  P_0.prototype.encode = function (Q) {
    if (!this.genPoly) throw Error("Encoder not initialized");
    let B = new Uint8Array(Q.length + this.degree);
    B.set(Q);
    let G = g49.mod(B, this.genPoly),
      Z = this.degree - G.length;
    if (Z > 0) {
      let Y = new Uint8Array(this.degree);
      return Y.set(G, Z), Y
    }
    return G
  };
  u49.exports = P_0
})
// @from(Ln 417420, Col 4)
S_0 = U((HI7) => {
  HI7.isValid = function (Q) {
    return !isNaN(Q) && Q >= 1 && Q <= 40
  }
})
// @from(Ln 417425, Col 4)
x_0 = U((qI7) => {
  var SgA = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
  SgA = SgA.replace(/u/g, "\\u");
  var zI7 = "(?:(?![A-Z0-9 $%*+\\-./:]|" + SgA + `)(?:.|[\r
]))+`;
  qI7.KANJI = new RegExp(SgA, "g");
  qI7.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
  qI7.BYTE = new RegExp(zI7, "g");
  qI7.NUMERIC = new RegExp("[0-9]+", "g");
  qI7.ALPHANUMERIC = new RegExp("[A-Z $%*+\\-./:]+", "g");
  var $I7 = new RegExp("^" + SgA + "$"),
    CI7 = new RegExp("^[0-9]+$"),
    UI7 = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
  qI7.testKanji = function (Q) {
    return $I7.test(Q)
  };
  qI7.testNumeric = function (Q) {
    return CI7.test(Q)
  };
  qI7.testAlphanumeric = function (Q) {
    return UI7.test(Q)
  }
})
// @from(Ln 417448, Col 4)
$e = U((SI7) => {
  var TI7 = S_0(),
    y_0 = x_0();
  SI7.NUMERIC = {
    id: "Numeric",
    bit: 1,
    ccBits: [10, 12, 14]
  };
  SI7.ALPHANUMERIC = {
    id: "Alphanumeric",
    bit: 2,
    ccBits: [9, 11, 13]
  };
  SI7.BYTE = {
    id: "Byte",
    bit: 4,
    ccBits: [8, 16, 16]
  };
  SI7.KANJI = {
    id: "Kanji",
    bit: 8,
    ccBits: [8, 10, 12]
  };
  SI7.MIXED = {
    bit: -1
  };
  SI7.getCharCountIndicator = function (Q, B) {
    if (!Q.ccBits) throw Error("Invalid mode: " + Q);
    if (!TI7.isValid(B)) throw Error("Invalid version: " + B);
    if (B >= 1 && B < 10) return Q.ccBits[0];
    else if (B < 27) return Q.ccBits[1];
    return Q.ccBits[2]
  };
  SI7.getBestModeForData = function (Q) {
    if (y_0.testNumeric(Q)) return SI7.NUMERIC;
    else if (y_0.testAlphanumeric(Q)) return SI7.ALPHANUMERIC;
    else if (y_0.testKanji(Q)) return SI7.KANJI;
    else return SI7.BYTE
  };
  SI7.toString = function (Q) {
    if (Q && Q.id) return Q.id;
    throw Error("Invalid mode")
  };
  SI7.isValid = function (Q) {
    return Q && Q.bit && Q.ccBits
  };

  function PI7(A) {
    if (typeof A !== "string") throw Error("Param is not a string");
    switch (A.toLowerCase()) {
      case "numeric":
        return SI7.NUMERIC;
      case "alphanumeric":
        return SI7.ALPHANUMERIC;
      case "kanji":
        return SI7.KANJI;
      case "byte":
        return SI7.BYTE;
      default:
        throw Error("Unknown mode: " + A)
    }
  }
  SI7.from = function (Q, B) {
    if (SI7.isValid(Q)) return Q;
    try {
      return PI7(Q)
    } catch (G) {
      return B
    }
  }
})
// @from(Ln 417519, Col 4)
n49 = U((mI7) => {
  var Jz1 = Ee(),
    fI7 = j_0(),
    c49 = Bz1(),
    Ce = $e(),
    h_0 = S_0(),
    p49 = Jz1.getBCHDigit(7973);

  function hI7(A, Q, B) {
    for (let G = 1; G <= 40; G++)
      if (Q <= mI7.getCapacity(G, B, A)) return G;
    return
  }

  function l49(A, Q) {
    return Ce.getCharCountIndicator(A, Q) + 4
  }

  function gI7(A, Q) {
    let B = 0;
    return A.forEach(function (G) {
      let Z = l49(G.mode, Q);
      B += Z + G.getBitsLength()
    }), B
  }

  function uI7(A, Q) {
    for (let B = 1; B <= 40; B++)
      if (gI7(A, B) <= mI7.getCapacity(B, Q, Ce.MIXED)) return B;
    return
  }
  mI7.from = function (Q, B) {
    if (h_0.isValid(Q)) return parseInt(Q, 10);
    return B
  };
  mI7.getCapacity = function (Q, B, G) {
    if (!h_0.isValid(Q)) throw Error("Invalid QR Code version");
    if (typeof G > "u") G = Ce.BYTE;
    let Z = Jz1.getSymbolTotalCodewords(Q),
      Y = fI7.getTotalCodewordsCount(Q, B),
      J = (Z - Y) * 8;
    if (G === Ce.MIXED) return J;
    let X = J - l49(G, Q);
    switch (G) {
      case Ce.NUMERIC:
        return Math.floor(X / 10 * 3);
      case Ce.ALPHANUMERIC:
        return Math.floor(X / 11 * 2);
      case Ce.KANJI:
        return Math.floor(X / 13);
      case Ce.BYTE:
      default:
        return Math.floor(X / 8)
    }
  };
  mI7.getBestVersionForData = function (Q, B) {
    let G, Z = c49.from(B, c49.M);
    if (Array.isArray(Q)) {
      if (Q.length > 1) return uI7(Q, Z);
      if (Q.length === 0) return 1;
      G = Q[0]
    } else G = Q;
    return hI7(G.mode, G.getLength(), Z)
  };
  mI7.getEncodedBits = function (Q) {
    if (!h_0.isValid(Q) || Q < 7) throw Error("Invalid QR Code version");
    let B = Q << 12;
    while (Jz1.getBCHDigit(B) - p49 >= 0) B ^= 7973 << Jz1.getBCHDigit(B) - p49;
    return Q << 12 | B
  }
})
// @from(Ln 417590, Col 4)
o49 = U((lI7) => {
  var g_0 = Ee(),
    a49 = g_0.getBCHDigit(1335);
  lI7.getEncodedBits = function (Q, B) {
    let G = Q.bit << 3 | B,
      Z = G << 10;
    while (g_0.getBCHDigit(Z) - a49 >= 0) Z ^= 1335 << g_0.getBCHDigit(Z) - a49;
    return (G << 10 | Z) ^ 21522
  }
})
// @from(Ln 417600, Col 4)
s49 = U((clY, r49) => {
  var nI7 = $e();

  function lzA(A) {
    this.mode = nI7.NUMERIC, this.data = A.toString()
  }
  lzA.getBitsLength = function (Q) {
    return 10 * Math.floor(Q / 3) + (Q % 3 ? Q % 3 * 3 + 1 : 0)
  };
  lzA.prototype.getLength = function () {
    return this.data.length
  };
  lzA.prototype.getBitsLength = function () {
    return lzA.getBitsLength(this.data.length)
  };
  lzA.prototype.write = function (Q) {
    let B, G, Z;
    for (B = 0; B + 3 <= this.data.length; B += 3) G = this.data.substr(B, 3), Z = parseInt(G, 10), Q.put(Z, 10);
    let Y = this.data.length - B;
    if (Y > 0) G = this.data.substr(B), Z = parseInt(G, 10), Q.put(Z, Y * 3 + 1)
  };
  r49.exports = lzA
})
// @from(Ln 417623, Col 4)
e49 = U((plY, t49) => {
  var aI7 = $e(),
    u_0 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":"];

  function izA(A) {
    this.mode = aI7.ALPHANUMERIC, this.data = A
  }
  izA.getBitsLength = function (Q) {
    return 11 * Math.floor(Q / 2) + 6 * (Q % 2)
  };
  izA.prototype.getLength = function () {
    return this.data.length
  };
  izA.prototype.getBitsLength = function () {
    return izA.getBitsLength(this.data.length)
  };
  izA.prototype.write = function (Q) {
    let B;
    for (B = 0; B + 2 <= this.data.length; B += 2) {
      let G = u_0.indexOf(this.data[B]) * 45;
      G += u_0.indexOf(this.data[B + 1]), Q.put(G, 11)
    }
    if (this.data.length % 2) Q.put(u_0.indexOf(this.data[B]), 6)
  };
  t49.exports = izA
})
// @from(Ln 417649, Col 4)
Q69 = U((llY, A69) => {
  var oI7 = $e();

  function nzA(A) {
    if (this.mode = oI7.BYTE, typeof A === "string") this.data = new TextEncoder().encode(A);
    else this.data = new Uint8Array(A)
  }
  nzA.getBitsLength = function (Q) {
    return Q * 8
  };
  nzA.prototype.getLength = function () {
    return this.data.length
  };
  nzA.prototype.getBitsLength = function () {
    return nzA.getBitsLength(this.data.length)
  };
  nzA.prototype.write = function (A) {
    for (let Q = 0, B = this.data.length; Q < B; Q++) A.put(this.data[Q], 8)
  };
  A69.exports = nzA
})
// @from(Ln 417670, Col 4)
G69 = U((ilY, B69) => {
  var rI7 = $e(),
    sI7 = Ee();

  function azA(A) {
    this.mode = rI7.KANJI, this.data = A
  }
  azA.getBitsLength = function (Q) {
    return Q * 13
  };
  azA.prototype.getLength = function () {
    return this.data.length
  };
  azA.prototype.getBitsLength = function () {
    return azA.getBitsLength(this.data.length)
  };
  azA.prototype.write = function (A) {
    let Q;
    for (Q = 0; Q < this.data.length; Q++) {
      let B = sI7.toSJIS(this.data[Q]);
      if (B >= 33088 && B <= 40956) B -= 33088;
      else if (B >= 57408 && B <= 60351) B -= 49472;
      else throw Error("Invalid SJIS character: " + this.data[Q] + `
Make sure your charset is UTF-8`);
      B = (B >>> 8 & 255) * 192 + (B & 255), A.put(B, 13)
    }
  };
  B69.exports = azA
})
// @from(Ln 417699, Col 4)
Z69 = U((nlY, m_0) => {
  var xgA = {
    single_source_shortest_paths: function (A, Q, B) {
      var G = {},
        Z = {};
      Z[Q] = 0;
      var Y = xgA.PriorityQueue.make();
      Y.push(Q, 0);
      var J, X, I, D, W, K, V, F, H;
      while (!Y.empty()) {
        J = Y.pop(), X = J.value, D = J.cost, W = A[X] || {};
        for (I in W)
          if (W.hasOwnProperty(I)) {
            if (K = W[I], V = D + K, F = Z[I], H = typeof Z[I] > "u", H || F > V) Z[I] = V, Y.push(I, V), G[I] = X
          }
      }
      if (typeof B < "u" && typeof Z[B] > "u") {
        var E = ["Could not find a path from ", Q, " to ", B, "."].join("");
        throw Error(E)
      }
      return G
    },
    extract_shortest_path_from_predecessor_list: function (A, Q) {
      var B = [],
        G = Q,
        Z;
      while (G) B.push(G), Z = A[G], G = A[G];
      return B.reverse(), B
    },
    find_path: function (A, Q, B) {
      var G = xgA.single_source_shortest_paths(A, Q, B);
      return xgA.extract_shortest_path_from_predecessor_list(G, B)
    },
    PriorityQueue: {
      make: function (A) {
        var Q = xgA.PriorityQueue,
          B = {},
          G;
        A = A || {};
        for (G in Q)
          if (Q.hasOwnProperty(G)) B[G] = Q[G];
        return B.queue = [], B.sorter = A.sorter || Q.default_sorter, B
      },
      default_sorter: function (A, Q) {
        return A.cost - Q.cost
      },
      push: function (A, Q) {
        var B = {
          value: A,
          cost: Q
        };
        this.queue.push(B), this.queue.sort(this.sorter)
      },
      pop: function () {
        return this.queue.shift()
      },
      empty: function () {
        return this.queue.length === 0
      }
    }
  };
  if (typeof m_0 < "u") m_0.exports = xgA
})
// @from(Ln 417762, Col 4)
V69 = U((BD7) => {
  var hG = $e(),
    X69 = s49(),
    I69 = e49(),
    D69 = Q69(),
    W69 = G69(),
    ygA = x_0(),
    Xz1 = Ee(),
    tI7 = Z69();

  function Y69(A) {
    return unescape(encodeURIComponent(A)).length
  }

  function vgA(A, Q, B) {
    let G = [],
      Z;
    while ((Z = A.exec(B)) !== null) G.push({
      data: Z[0],
      index: Z.index,
      mode: Q,
      length: Z[0].length
    });
    return G
  }

  function K69(A) {
    let Q = vgA(ygA.NUMERIC, hG.NUMERIC, A),
      B = vgA(ygA.ALPHANUMERIC, hG.ALPHANUMERIC, A),
      G, Z;
    if (Xz1.isKanjiModeEnabled()) G = vgA(ygA.BYTE, hG.BYTE, A), Z = vgA(ygA.KANJI, hG.KANJI, A);
    else G = vgA(ygA.BYTE_KANJI, hG.BYTE, A), Z = [];
    return Q.concat(B, G, Z).sort(function (J, X) {
      return J.index - X.index
    }).map(function (J) {
      return {
        data: J.data,
        mode: J.mode,
        length: J.length
      }
    })
  }

  function d_0(A, Q) {
    switch (Q) {
      case hG.NUMERIC:
        return X69.getBitsLength(A);
      case hG.ALPHANUMERIC:
        return I69.getBitsLength(A);
      case hG.KANJI:
        return W69.getBitsLength(A);
      case hG.BYTE:
        return D69.getBitsLength(A)
    }
  }

  function eI7(A) {
    return A.reduce(function (Q, B) {
      let G = Q.length - 1 >= 0 ? Q[Q.length - 1] : null;
      if (G && G.mode === B.mode) return Q[Q.length - 1].data += B.data, Q;
      return Q.push(B), Q
    }, [])
  }

  function AD7(A) {
    let Q = [];
    for (let B = 0; B < A.length; B++) {
      let G = A[B];
      switch (G.mode) {
        case hG.NUMERIC:
          Q.push([G, {
            data: G.data,
            mode: hG.ALPHANUMERIC,
            length: G.length
          }, {
            data: G.data,
            mode: hG.BYTE,
            length: G.length
          }]);
          break;
        case hG.ALPHANUMERIC:
          Q.push([G, {
            data: G.data,
            mode: hG.BYTE,
            length: G.length
          }]);
          break;
        case hG.KANJI:
          Q.push([G, {
            data: G.data,
            mode: hG.BYTE,
            length: Y69(G.data)
          }]);
          break;
        case hG.BYTE:
          Q.push([{
            data: G.data,
            mode: hG.BYTE,
            length: Y69(G.data)
          }])
      }
    }
    return Q
  }

  function QD7(A, Q) {
    let B = {},
      G = {
        start: {}
      },
      Z = ["start"];
    for (let Y = 0; Y < A.length; Y++) {
      let J = A[Y],
        X = [];
      for (let I = 0; I < J.length; I++) {
        let D = J[I],
          W = "" + Y + I;
        X.push(W), B[W] = {
          node: D,
          lastCount: 0
        }, G[W] = {};
        for (let K = 0; K < Z.length; K++) {
          let V = Z[K];
          if (B[V] && B[V].node.mode === D.mode) G[V][W] = d_0(B[V].lastCount + D.length, D.mode) - d_0(B[V].lastCount, D.mode), B[V].lastCount += D.length;
          else {
            if (B[V]) B[V].lastCount = D.length;
            G[V][W] = d_0(D.length, D.mode) + 4 + hG.getCharCountIndicator(D.mode, Q)
          }
        }
      }
      Z = X
    }
    for (let Y = 0; Y < Z.length; Y++) G[Z[Y]].end = 0;
    return {
      map: G,
      table: B
    }
  }

  function J69(A, Q) {
    let B, G = hG.getBestModeForData(A);
    if (B = hG.from(Q, G), B !== hG.BYTE && B.bit < G.bit) throw Error('"' + A + '" cannot be encoded with mode ' + hG.toString(B) + `.
 Suggested mode is: ` + hG.toString(G));
    if (B === hG.KANJI && !Xz1.isKanjiModeEnabled()) B = hG.BYTE;
    switch (B) {
      case hG.NUMERIC:
        return new X69(A);
      case hG.ALPHANUMERIC:
        return new I69(A);
      case hG.KANJI:
        return new W69(A);
      case hG.BYTE:
        return new D69(A)
    }
  }
  BD7.fromArray = function (Q) {
    return Q.reduce(function (B, G) {
      if (typeof G === "string") B.push(J69(G, null));
      else if (G.data) B.push(J69(G.data, G.mode));
      return B
    }, [])
  };
  BD7.fromString = function (Q, B) {
    let G = K69(Q, Xz1.isKanjiModeEnabled()),
      Z = AD7(G),
      Y = QD7(Z, B),
      J = tI7.find_path(Y.map, "start", "end"),
      X = [];
    for (let I = 1; I < J.length - 1; I++) X.push(Y.table[J[I]].node);
    return BD7.fromArray(eI7(X))
  };
  BD7.rawSplit = function (Q) {
    return BD7.fromArray(K69(Q, Xz1.isKanjiModeEnabled()))
  }
})
// @from(Ln 417937, Col 4)
o_0 = U((qD7) => {
  var Dz1 = Ee(),
    p_0 = Bz1(),
    YD7 = O49(),
    JD7 = R49(),
    XD7 = j49(),
    ID7 = T49(),
    n_0 = k49(),
    a_0 = j_0(),
    DD7 = m49(),
    Iz1 = n49(),
    WD7 = o49(),
    KD7 = $e(),
    l_0 = V69();

  function VD7(A, Q) {
    let B = A.size,
      G = ID7.getPositions(Q);
    for (let Z = 0; Z < G.length; Z++) {
      let Y = G[Z][0],
        J = G[Z][1];
      for (let X = -1; X <= 7; X++) {
        if (Y + X <= -1 || B <= Y + X) continue;
        for (let I = -1; I <= 7; I++) {
          if (J + I <= -1 || B <= J + I) continue;
          if (X >= 0 && X <= 6 && (I === 0 || I === 6) || I >= 0 && I <= 6 && (X === 0 || X === 6) || X >= 2 && X <= 4 && I >= 2 && I <= 4) A.set(Y + X, J + I, !0, !0);
          else A.set(Y + X, J + I, !1, !0)
        }
      }
    }
  }

  function FD7(A) {
    let Q = A.size;
    for (let B = 8; B < Q - 8; B++) {
      let G = B % 2 === 0;
      A.set(B, 6, G, !0), A.set(6, B, G, !0)
    }
  }

  function HD7(A, Q) {
    let B = XD7.getPositions(Q);
    for (let G = 0; G < B.length; G++) {
      let Z = B[G][0],
        Y = B[G][1];
      for (let J = -2; J <= 2; J++)
        for (let X = -2; X <= 2; X++)
          if (J === -2 || J === 2 || X === -2 || X === 2 || J === 0 && X === 0) A.set(Z + J, Y + X, !0, !0);
          else A.set(Z + J, Y + X, !1, !0)
    }
  }

  function ED7(A, Q) {
    let B = A.size,
      G = Iz1.getEncodedBits(Q),
      Z, Y, J;
    for (let X = 0; X < 18; X++) Z = Math.floor(X / 3), Y = X % 3 + B - 8 - 3, J = (G >> X & 1) === 1, A.set(Z, Y, J, !0), A.set(Y, Z, J, !0)
  }

  function i_0(A, Q, B) {
    let G = A.size,
      Z = WD7.getEncodedBits(Q, B),
      Y, J;
    for (Y = 0; Y < 15; Y++) {
      if (J = (Z >> Y & 1) === 1, Y < 6) A.set(Y, 8, J, !0);
      else if (Y < 8) A.set(Y + 1, 8, J, !0);
      else A.set(G - 15 + Y, 8, J, !0);
      if (Y < 8) A.set(8, G - Y - 1, J, !0);
      else if (Y < 9) A.set(8, 15 - Y - 1 + 1, J, !0);
      else A.set(8, 15 - Y - 1, J, !0)
    }
    A.set(G - 8, 8, 1, !0)
  }

  function zD7(A, Q) {
    let B = A.size,
      G = -1,
      Z = B - 1,
      Y = 7,
      J = 0;
    for (let X = B - 1; X > 0; X -= 2) {
      if (X === 6) X--;
      while (!0) {
        for (let I = 0; I < 2; I++)
          if (!A.isReserved(Z, X - I)) {
            let D = !1;
            if (J < Q.length) D = (Q[J] >>> Y & 1) === 1;
            if (A.set(Z, X - I, D), Y--, Y === -1) J++, Y = 7
          } if (Z += G, Z < 0 || B <= Z) {
          Z -= G, G = -G;
          break
        }
      }
    }
  }

  function $D7(A, Q, B) {
    let G = new YD7;
    B.forEach(function (I) {
      G.put(I.mode.bit, 4), G.put(I.getLength(), KD7.getCharCountIndicator(I.mode, A)), I.write(G)
    });
    let Z = Dz1.getSymbolTotalCodewords(A),
      Y = a_0.getTotalCodewordsCount(A, Q),
      J = (Z - Y) * 8;
    if (G.getLengthInBits() + 4 <= J) G.put(0, 4);
    while (G.getLengthInBits() % 8 !== 0) G.putBit(0);
    let X = (J - G.getLengthInBits()) / 8;
    for (let I = 0; I < X; I++) G.put(I % 2 ? 17 : 236, 8);
    return CD7(G, A, Q)
  }

  function CD7(A, Q, B) {
    let G = Dz1.getSymbolTotalCodewords(Q),
      Z = a_0.getTotalCodewordsCount(Q, B),
      Y = G - Z,
      J = a_0.getBlocksCount(Q, B),
      X = G % J,
      I = J - X,
      D = Math.floor(G / J),
      W = Math.floor(Y / J),
      K = W + 1,
      V = D - W,
      F = new DD7(V),
      H = 0,
      E = Array(J),
      z = Array(J),
      $ = 0,
      O = new Uint8Array(A.buffer);
    for (let x = 0; x < J; x++) {
      let b = x < I ? W : K;
      E[x] = O.slice(H, H + b), z[x] = F.encode(E[x]), H += b, $ = Math.max($, b)
    }
    let L = new Uint8Array(G),
      M = 0,
      _, j;
    for (_ = 0; _ < $; _++)
      for (j = 0; j < J; j++)
        if (_ < E[j].length) L[M++] = E[j][_];
    for (_ = 0; _ < V; _++)
      for (j = 0; j < J; j++) L[M++] = z[j][_];
    return L
  }

  function UD7(A, Q, B, G) {
    let Z;
    if (Array.isArray(A)) Z = l_0.fromArray(A);
    else if (typeof A === "string") {
      let D = Q;
      if (!D) {
        let W = l_0.rawSplit(A);
        D = Iz1.getBestVersionForData(W, B)
      }
      Z = l_0.fromString(A, D || 40)
    } else throw Error("Invalid data");
    let Y = Iz1.getBestVersionForData(Z, B);
    if (!Y) throw Error("The amount of data is too big to be stored in a QR Code");
    if (!Q) Q = Y;
    else if (Q < Y) throw Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` + Y + `.
`);
    let J = $D7(Q, B, Z),
      X = Dz1.getSymbolSize(Q),
      I = new JD7(X);
    if (VD7(I, Q), FD7(I), HD7(I, Q), i_0(I, B, 0), Q >= 7) ED7(I, Q);
    if (zD7(I, J), isNaN(G)) G = n_0.getBestMask(I, i_0.bind(null, I, B));
    return n_0.applyMask(G, I), i_0(I, B, G), {
      modules: I,
      version: Q,
      errorCorrectionLevel: B,
      maskPattern: G,
      segments: Z
    }
  }
  qD7.create = function (Q, B) {
    if (typeof Q > "u" || Q === "") throw Error("No input text");
    let G = p_0.M,
      Z, Y;
    if (typeof B < "u") {
      if (G = p_0.from(B.errorCorrectionLevel, p_0.M), Z = Iz1.from(B.version), Y = n_0.from(B.maskPattern), B.toSJISFunc) Dz1.setToSJISFunction(B.toSJISFunc)
    }
    return UD7(Q, Z, G, Y)
  }
})
// @from(Ln 418121, Col 4)
r_0 = U((rlY, H69) => {
  var wD7 = NA("util"),
    F69 = NA("stream"),
    vx = H69.exports = function () {
      F69.call(this), this._buffers = [], this._buffered = 0, this._reads = [], this._paused = !1, this._encoding = "utf8", this.writable = !0
    };
  wD7.inherits(vx, F69);
  vx.prototype.read = function (A, Q) {
    this._reads.push({
      length: Math.abs(A),
      allowLess: A < 0,
      func: Q
    }), process.nextTick(function () {
      if (this._process(), this._paused && this._reads && this._reads.length > 0) this._paused = !1, this.emit("drain")
    }.bind(this))
  };
  vx.prototype.write = function (A, Q) {
    if (!this.writable) return this.emit("error", Error("Stream not writable")), !1;
    let B;
    if (Buffer.isBuffer(A)) B = A;
    else B = Buffer.from(A, Q || this._encoding);
    if (this._buffers.push(B), this._buffered += B.length, this._process(), this._reads && this._reads.length === 0) this._paused = !0;
    return this.writable && !this._paused
  };
  vx.prototype.end = function (A, Q) {
    if (A) this.write(A, Q);
    if (this.writable = !1, !this._buffers) return;
    if (this._buffers.length === 0) this._end();
    else this._buffers.push(null), this._process()
  };
  vx.prototype.destroySoon = vx.prototype.end;
  vx.prototype._end = function () {
    if (this._reads.length > 0) this.emit("error", Error("Unexpected end of input"));
    this.destroy()
  };
  vx.prototype.destroy = function () {
    if (!this._buffers) return;
    this.writable = !1, this._reads = null, this._buffers = null, this.emit("close")
  };
  vx.prototype._processReadAllowingLess = function (A) {
    this._reads.shift();
    let Q = this._buffers[0];
    if (Q.length > A.length) this._buffered -= A.length, this._buffers[0] = Q.slice(A.length), A.func.call(this, Q.slice(0, A.length));
    else this._buffered -= Q.length, this._buffers.shift(), A.func.call(this, Q)
  };
  vx.prototype._processRead = function (A) {
    this._reads.shift();
    let Q = 0,
      B = 0,
      G = Buffer.alloc(A.length);
    while (Q < A.length) {
      let Z = this._buffers[B++],
        Y = Math.min(Z.length, A.length - Q);
      if (Z.copy(G, Q, 0, Y), Q += Y, Y !== Z.length) this._buffers[--B] = Z.slice(Y)
    }
    if (B > 0) this._buffers.splice(0, B);
    this._buffered -= A.length, A.func.call(this, G)
  };
  vx.prototype._process = function () {
    try {
      while (this._buffered > 0 && this._reads && this._reads.length > 0) {
        let A = this._reads[0];
        if (A.allowLess) this._processReadAllowingLess(A);
        else if (this._buffered >= A.length) this._processRead(A);
        else break
      }
      if (this._buffers && !this.writable) this._end()
    } catch (A) {
      this.emit("error", A)
    }
  }
})
// @from(Ln 418193, Col 4)
s_0 = U((LD7) => {
  var Ue = [{
    x: [0],
    y: [0]
  }, {
    x: [4],
    y: [0]
  }, {
    x: [0, 4],
    y: [4]
  }, {
    x: [2, 6],
    y: [0, 4]
  }, {
    x: [0, 2, 4, 6],
    y: [2, 6]
  }, {
    x: [1, 3, 5, 7],
    y: [0, 2, 4, 6]
  }, {
    x: [0, 1, 2, 3, 4, 5, 6, 7],
    y: [1, 3, 5, 7]
  }];
  LD7.getImagePasses = function (A, Q) {
    let B = [],
      G = A % 8,
      Z = Q % 8,
      Y = (A - G) / 8,
      J = (Q - Z) / 8;
    for (let X = 0; X < Ue.length; X++) {
      let I = Ue[X],
        D = Y * I.x.length,
        W = J * I.y.length;
      for (let K = 0; K < I.x.length; K++)
        if (I.x[K] < G) D++;
        else break;
      for (let K = 0; K < I.y.length; K++)
        if (I.y[K] < Z) W++;
        else break;
      if (D > 0 && W > 0) B.push({
        width: D,
        height: W,
        index: X
      })
    }
    return B
  };
  LD7.getInterlaceIterator = function (A) {
    return function (Q, B, G) {
      let Z = Q % Ue[G].x.length,
        Y = (Q - Z) / Ue[G].x.length * 8 + Ue[G].x[Z],
        J = B % Ue[G].y.length,
        X = (B - J) / Ue[G].y.length * 8 + Ue[G].y[J];
      return Y * 4 + X * A * 4
    }
  }
})
// @from(Ln 418250, Col 4)
t_0 = U((tlY, E69) => {
  E69.exports = function (Q, B, G) {
    let Z = Q + B - G,
      Y = Math.abs(Z - Q),
      J = Math.abs(Z - B),
      X = Math.abs(Z - G);
    if (Y <= J && Y <= X) return Q;
    if (J <= X) return B;
    return G
  }
})
// @from(Ln 418261, Col 4)
e_0 = U((elY, $69) => {
  var RD7 = s_0(),
    _D7 = t_0();

  function z69(A, Q, B) {
    let G = A * Q;
    if (B !== 8) G = Math.ceil(G / (8 / B));
    return G
  }
  var ozA = $69.exports = function (A, Q) {
    let {
      width: B,
      height: G,
      interlace: Z,
      bpp: Y,
      depth: J
    } = A;
    if (this.read = Q.read, this.write = Q.write, this.complete = Q.complete, this._imageIndex = 0, this._images = [], Z) {
      let X = RD7.getImagePasses(B, G);
      for (let I = 0; I < X.length; I++) this._images.push({
        byteWidth: z69(X[I].width, Y, J),
        height: X[I].height,
        lineIndex: 0
      })
    } else this._images.push({
      byteWidth: z69(B, Y, J),
      height: G,
      lineIndex: 0
    });
    if (J === 8) this._xComparison = Y;
    else if (J === 16) this._xComparison = Y * 2;
    else this._xComparison = 1
  };
  ozA.prototype.start = function () {
    this.read(this._images[this._imageIndex].byteWidth + 1, this._reverseFilterLine.bind(this))
  };
  ozA.prototype._unFilterType1 = function (A, Q, B) {
    let G = this._xComparison,
      Z = G - 1;
    for (let Y = 0; Y < B; Y++) {
      let J = A[1 + Y],
        X = Y > Z ? Q[Y - G] : 0;
      Q[Y] = J + X
    }
  };
  ozA.prototype._unFilterType2 = function (A, Q, B) {
    let G = this._lastLine;
    for (let Z = 0; Z < B; Z++) {
      let Y = A[1 + Z],
        J = G ? G[Z] : 0;
      Q[Z] = Y + J
    }
  };
  ozA.prototype._unFilterType3 = function (A, Q, B) {
    let G = this._xComparison,
      Z = G - 1,
      Y = this._lastLine;
    for (let J = 0; J < B; J++) {
      let X = A[1 + J],
        I = Y ? Y[J] : 0,
        D = J > Z ? Q[J - G] : 0,
        W = Math.floor((D + I) / 2);
      Q[J] = X + W
    }
  };
  ozA.prototype._unFilterType4 = function (A, Q, B) {
    let G = this._xComparison,
      Z = G - 1,
      Y = this._lastLine;
    for (let J = 0; J < B; J++) {
      let X = A[1 + J],
        I = Y ? Y[J] : 0,
        D = J > Z ? Q[J - G] : 0,
        W = J > Z && Y ? Y[J - G] : 0,
        K = _D7(D, I, W);
      Q[J] = X + K
    }
  };
  ozA.prototype._reverseFilterLine = function (A) {
    let Q = A[0],
      B, G = this._images[this._imageIndex],
      Z = G.byteWidth;
    if (Q === 0) B = A.slice(1, Z + 1);
    else switch (B = Buffer.alloc(Z), Q) {
      case 1:
        this._unFilterType1(A, B, Z);
        break;
      case 2:
        this._unFilterType2(A, B, Z);
        break;
      case 3:
        this._unFilterType3(A, B, Z);
        break;
      case 4:
        this._unFilterType4(A, B, Z);
        break;
      default:
        throw Error("Unrecognised filter type - " + Q)
    }
    if (this.write(B), G.lineIndex++, G.lineIndex >= G.height) this._lastLine = null, this._imageIndex++, G = this._images[this._imageIndex];
    else this._lastLine = B;
    if (G) this.read(G.byteWidth + 1, this._reverseFilterLine.bind(this));
    else this._lastLine = null, this.complete()
  }
})
// @from(Ln 418366, Col 4)
q69 = U((AiY, U69) => {
  var jD7 = NA("util"),
    C69 = r_0(),
    TD7 = e_0(),
    PD7 = U69.exports = function (A) {
      C69.call(this);
      let Q = [],
        B = this;
      this._filter = new TD7(A, {
        read: this.read.bind(this),
        write: function (G) {
          Q.push(G)
        },
        complete: function () {
          B.emit("complete", Buffer.concat(Q))
        }
      }), this._filter.start()
    };
  jD7.inherits(PD7, C69)
})
// @from(Ln 418386, Col 4)
rzA = U((QiY, N69) => {
  N69.exports = {
    PNG_SIGNATURE: [137, 80, 78, 71, 13, 10, 26, 10],
    TYPE_IHDR: 1229472850,
    TYPE_IEND: 1229278788,
    TYPE_IDAT: 1229209940,
    TYPE_PLTE: 1347179589,
    TYPE_tRNS: 1951551059,
    TYPE_gAMA: 1732332865,
    COLORTYPE_GRAYSCALE: 0,
    COLORTYPE_PALETTE: 1,
    COLORTYPE_COLOR: 2,
    COLORTYPE_ALPHA: 4,
    COLORTYPE_PALETTE_COLOR: 3,
    COLORTYPE_COLOR_ALPHA: 6,
    COLORTYPE_TO_BPP_MAP: {
      0: 1,
      2: 3,
      3: 1,
      4: 2,
      6: 4
    },
    GAMMA_DIVISION: 1e5
  }
})
// @from(Ln 418411, Col 4)
Bj0 = U((BiY, w69) => {
  var Aj0 = [];
  (function () {
    for (let A = 0; A < 256; A++) {
      let Q = A;
      for (let B = 0; B < 8; B++)
        if (Q & 1) Q = 3988292384 ^ Q >>> 1;
        else Q = Q >>> 1;
      Aj0[A] = Q
    }
  })();
  var Qj0 = w69.exports = function () {
    this._crc = -1
  };
  Qj0.prototype.write = function (A) {
    for (let Q = 0; Q < A.length; Q++) this._crc = Aj0[(this._crc ^ A[Q]) & 255] ^ this._crc >>> 8;
    return !0
  };
  Qj0.prototype.crc32 = function () {
    return this._crc ^ -1
  };
  Qj0.crc32 = function (A) {
    let Q = -1;
    for (let B = 0; B < A.length; B++) Q = Aj0[(Q ^ A[B]) & 255] ^ Q >>> 8;
    return Q ^ -1
  }
})
// @from(Ln 418438, Col 4)
Gj0 = U((GiY, L69) => {
  var EV = rzA(),
    SD7 = Bj0(),
    rF = L69.exports = function (A, Q) {
      this._options = A, A.checkCRC = A.checkCRC !== !1, this._hasIHDR = !1, this._hasIEND = !1, this._emittedHeadersFinished = !1, this._palette = [], this._colorType = 0, this._chunks = {}, this._chunks[EV.TYPE_IHDR] = this._handleIHDR.bind(this), this._chunks[EV.TYPE_IEND] = this._handleIEND.bind(this), this._chunks[EV.TYPE_IDAT] = this._handleIDAT.bind(this), this._chunks[EV.TYPE_PLTE] = this._handlePLTE.bind(this), this._chunks[EV.TYPE_tRNS] = this._handleTRNS.bind(this), this._chunks[EV.TYPE_gAMA] = this._handleGAMA.bind(this), this.read = Q.read, this.error = Q.error, this.metadata = Q.metadata, this.gamma = Q.gamma, this.transColor = Q.transColor, this.palette = Q.palette, this.parsed = Q.parsed, this.inflateData = Q.inflateData, this.finished = Q.finished, this.simpleTransparency = Q.simpleTransparency, this.headersFinished = Q.headersFinished || function () {}
    };
  rF.prototype.start = function () {
    this.read(EV.PNG_SIGNATURE.length, this._parseSignature.bind(this))
  };
  rF.prototype._parseSignature = function (A) {
    let Q = EV.PNG_SIGNATURE;
    for (let B = 0; B < Q.length; B++)
      if (A[B] !== Q[B]) {
        this.error(Error("Invalid file signature"));
        return
      } this.read(8, this._parseChunkBegin.bind(this))
  };
  rF.prototype._parseChunkBegin = function (A) {
    let Q = A.readUInt32BE(0),
      B = A.readUInt32BE(4),
      G = "";
    for (let Y = 4; Y < 8; Y++) G += String.fromCharCode(A[Y]);
    let Z = Boolean(A[4] & 32);
    if (!this._hasIHDR && B !== EV.TYPE_IHDR) {
      this.error(Error("Expected IHDR on beggining"));
      return
    }
    if (this._crc = new SD7, this._crc.write(Buffer.from(G)), this._chunks[B]) return this._chunks[B](Q);
    if (!Z) {
      this.error(Error("Unsupported critical chunk type " + G));
      return
    }
    this.read(Q + 4, this._skipChunk.bind(this))
  };
  rF.prototype._skipChunk = function () {
    this.read(8, this._parseChunkBegin.bind(this))
  };
  rF.prototype._handleChunkEnd = function () {
    this.read(4, this._parseChunkEnd.bind(this))
  };
  rF.prototype._parseChunkEnd = function (A) {
    let Q = A.readInt32BE(0),
      B = this._crc.crc32();
    if (this._options.checkCRC && B !== Q) {
      this.error(Error("Crc error - " + Q + " - " + B));
      return
    }
    if (!this._hasIEND) this.read(8, this._parseChunkBegin.bind(this))
  };
  rF.prototype._handleIHDR = function (A) {
    this.read(A, this._parseIHDR.bind(this))
  };
  rF.prototype._parseIHDR = function (A) {
    this._crc.write(A);
    let Q = A.readUInt32BE(0),
      B = A.readUInt32BE(4),
      G = A[8],
      Z = A[9],
      Y = A[10],
      J = A[11],
      X = A[12];
    if (G !== 8 && G !== 4 && G !== 2 && G !== 1 && G !== 16) {
      this.error(Error("Unsupported bit depth " + G));
      return
    }
    if (!(Z in EV.COLORTYPE_TO_BPP_MAP)) {
      this.error(Error("Unsupported color type"));
      return
    }
    if (Y !== 0) {
      this.error(Error("Unsupported compression method"));
      return
    }
    if (J !== 0) {
      this.error(Error("Unsupported filter method"));
      return
    }
    if (X !== 0 && X !== 1) {
      this.error(Error("Unsupported interlace method"));
      return
    }
    this._colorType = Z;
    let I = EV.COLORTYPE_TO_BPP_MAP[this._colorType];
    this._hasIHDR = !0, this.metadata({
      width: Q,
      height: B,
      depth: G,
      interlace: Boolean(X),
      palette: Boolean(Z & EV.COLORTYPE_PALETTE),
      color: Boolean(Z & EV.COLORTYPE_COLOR),
      alpha: Boolean(Z & EV.COLORTYPE_ALPHA),
      bpp: I,
      colorType: Z
    }), this._handleChunkEnd()
  };
  rF.prototype._handlePLTE = function (A) {
    this.read(A, this._parsePLTE.bind(this))
  };
  rF.prototype._parsePLTE = function (A) {
    this._crc.write(A);
    let Q = Math.floor(A.length / 3);
    for (let B = 0; B < Q; B++) this._palette.push([A[B * 3], A[B * 3 + 1], A[B * 3 + 2], 255]);
    this.palette(this._palette), this._handleChunkEnd()
  };
  rF.prototype._handleTRNS = function (A) {
    this.simpleTransparency(), this.read(A, this._parseTRNS.bind(this))
  };
  rF.prototype._parseTRNS = function (A) {
    if (this._crc.write(A), this._colorType === EV.COLORTYPE_PALETTE_COLOR) {
      if (this._palette.length === 0) {
        this.error(Error("Transparency chunk must be after palette"));
        return
      }
      if (A.length > this._palette.length) {
        this.error(Error("More transparent colors than palette size"));
        return
      }
      for (let Q = 0; Q < A.length; Q++) this._palette[Q][3] = A[Q];
      this.palette(this._palette)
    }
    if (this._colorType === EV.COLORTYPE_GRAYSCALE) this.transColor([A.readUInt16BE(0)]);
    if (this._colorType === EV.COLORTYPE_COLOR) this.transColor([A.readUInt16BE(0), A.readUInt16BE(2), A.readUInt16BE(4)]);
    this._handleChunkEnd()
  };
  rF.prototype._handleGAMA = function (A) {
    this.read(A, this._parseGAMA.bind(this))
  };
  rF.prototype._parseGAMA = function (A) {
    this._crc.write(A), this.gamma(A.readUInt32BE(0) / EV.GAMMA_DIVISION), this._handleChunkEnd()
  };
  rF.prototype._handleIDAT = function (A) {
    if (!this._emittedHeadersFinished) this._emittedHeadersFinished = !0, this.headersFinished();
    this.read(-A, this._parseIDAT.bind(this, A))
  };
  rF.prototype._parseIDAT = function (A, Q) {
    if (this._crc.write(Q), this._colorType === EV.COLORTYPE_PALETTE_COLOR && this._palette.length === 0) throw Error("Expected palette not found");
    this.inflateData(Q);
    let B = A - Q.length;
    if (B > 0) this._handleIDAT(B);
    else this._handleChunkEnd()
  };
  rF.prototype._handleIEND = function (A) {
    this.read(A, this._parseIEND.bind(this))
  };
  rF.prototype._parseIEND = function (A) {
    if (this._crc.write(A), this._hasIEND = !0, this._handleChunkEnd(), this.finished) this.finished()
  }
})
// @from(Ln 418586, Col 4)
Zj0 = U((fD7) => {
  var O69 = s_0(),
    xD7 = [function () {}, function (A, Q, B, G) {
      if (G === Q.length) throw Error("Ran out of data");
      let Z = Q[G];
      A[B] = Z, A[B + 1] = Z, A[B + 2] = Z, A[B + 3] = 255
    }, function (A, Q, B, G) {
      if (G + 1 >= Q.length) throw Error("Ran out of data");
      let Z = Q[G];
      A[B] = Z, A[B + 1] = Z, A[B + 2] = Z, A[B + 3] = Q[G + 1]
    }, function (A, Q, B, G) {
      if (G + 2 >= Q.length) throw Error("Ran out of data");
      A[B] = Q[G], A[B + 1] = Q[G + 1], A[B + 2] = Q[G + 2], A[B + 3] = 255
    }, function (A, Q, B, G) {
      if (G + 3 >= Q.length) throw Error("Ran out of data");
      A[B] = Q[G], A[B + 1] = Q[G + 1], A[B + 2] = Q[G + 2], A[B + 3] = Q[G + 3]
    }],
    yD7 = [function () {}, function (A, Q, B, G) {
      let Z = Q[0];
      A[B] = Z, A[B + 1] = Z, A[B + 2] = Z, A[B + 3] = G
    }, function (A, Q, B) {
      let G = Q[0];
      A[B] = G, A[B + 1] = G, A[B + 2] = G, A[B + 3] = Q[1]
    }, function (A, Q, B, G) {
      A[B] = Q[0], A[B + 1] = Q[1], A[B + 2] = Q[2], A[B + 3] = G
    }, function (A, Q, B) {
      A[B] = Q[0], A[B + 1] = Q[1], A[B + 2] = Q[2], A[B + 3] = Q[3]
    }];

  function vD7(A, Q) {
    let B = [],
      G = 0;

    function Z() {
      if (G === A.length) throw Error("Ran out of data");
      let Y = A[G];
      G++;
      let J, X, I, D, W, K, V, F;
      switch (Q) {
        default:
          throw Error("unrecognised depth");
        case 16:
          V = A[G], G++, B.push((Y << 8) + V);
          break;
        case 4:
          V = Y & 15, F = Y >> 4, B.push(F, V);
          break;
        case 2:
          W = Y & 3, K = Y >> 2 & 3, V = Y >> 4 & 3, F = Y >> 6 & 3, B.push(F, V, K, W);
          break;
        case 1:
          J = Y & 1, X = Y >> 1 & 1, I = Y >> 2 & 1, D = Y >> 3 & 1, W = Y >> 4 & 1, K = Y >> 5 & 1, V = Y >> 6 & 1, F = Y >> 7 & 1, B.push(F, V, K, W, D, I, X, J);
          break
      }
    }
    return {
      get: function (Y) {
        while (B.length < Y) Z();
        let J = B.slice(0, Y);
        return B = B.slice(Y), J
      },
      resetAfterLine: function () {
        B.length = 0
      },
      end: function () {
        if (G !== A.length) throw Error("extra data found")
      }
    }
  }

  function kD7(A, Q, B, G, Z, Y) {
    let {
      width: J,
      height: X,
      index: I
    } = A;
    for (let D = 0; D < X; D++)
      for (let W = 0; W < J; W++) {
        let K = B(W, D, I);
        xD7[G](Q, Z, K, Y), Y += G
      }
    return Y
  }

  function bD7(A, Q, B, G, Z, Y) {
    let {
      width: J,
      height: X,
      index: I
    } = A;
    for (let D = 0; D < X; D++) {
      for (let W = 0; W < J; W++) {
        let K = Z.get(G),
          V = B(W, D, I);
        yD7[G](Q, K, V, Y)
      }
      Z.resetAfterLine()
    }
  }
  fD7.dataToBitMap = function (A, Q) {
    let {
      width: B,
      height: G,
      depth: Z,
      bpp: Y,
      interlace: J
    } = Q, X;
    if (Z !== 8) X = vD7(A, Z);
    let I;
    if (Z <= 8) I = Buffer.alloc(B * G * 4);
    else I = new Uint16Array(B * G * 4);
    let D = Math.pow(2, Z) - 1,
      W = 0,
      K, V;
    if (J) K = O69.getImagePasses(B, G), V = O69.getInterlaceIterator(B, G);
    else {
      let F = 0;
      V = function () {
        let H = F;
        return F += 4, H
      }, K = [{
        width: B,
        height: G
      }]
    }
    for (let F = 0; F < K.length; F++)
      if (Z === 8) W = kD7(K[F], I, V, Y, A, W);
      else bD7(K[F], I, V, Y, X, D);
    if (Z === 8) {
      if (W !== A.length) throw Error("extra data found")
    } else X.end();
    return I
  }
})
// @from(Ln 418720, Col 4)
Yj0 = U((YiY, M69) => {
  function gD7(A, Q, B, G, Z) {
    let Y = 0;
    for (let J = 0; J < G; J++)
      for (let X = 0; X < B; X++) {
        let I = Z[A[Y]];
        if (!I) throw Error("index " + A[Y] + " not in palette");
        for (let D = 0; D < 4; D++) Q[Y + D] = I[D];
        Y += 4
      }
  }

  function uD7(A, Q, B, G, Z) {
    let Y = 0;
    for (let J = 0; J < G; J++)
      for (let X = 0; X < B; X++) {
        let I = !1;
        if (Z.length === 1) {
          if (Z[0] === A[Y]) I = !0
        } else if (Z[0] === A[Y] && Z[1] === A[Y + 1] && Z[2] === A[Y + 2]) I = !0;
        if (I)
          for (let D = 0; D < 4; D++) Q[Y + D] = 0;
        Y += 4
      }
  }

  function mD7(A, Q, B, G, Z) {
    let Y = 255,
      J = Math.pow(2, Z) - 1,
      X = 0;
    for (let I = 0; I < G; I++)
      for (let D = 0; D < B; D++) {
        for (let W = 0; W < 4; W++) Q[X + W] = Math.floor(A[X + W] * Y / J + 0.5);
        X += 4
      }
  }
  M69.exports = function (A, Q) {
    let {
      depth: B,
      width: G,
      height: Z,
      colorType: Y,
      transColor: J,
      palette: X
    } = Q, I = A;
    if (Y === 3) gD7(A, I, G, Z, X);
    else {
      if (J) uD7(A, I, G, Z, J);
      if (B !== 8) {
        if (B === 16) I = Buffer.alloc(G * Z * 4);
        mD7(A, I, G, Z, B)
      }
    }
    return I
  }
})
// @from(Ln 418776, Col 4)
j69 = U((JiY, _69) => {
  var dD7 = NA("util"),
    Jj0 = NA("zlib"),
    R69 = r_0(),
    cD7 = q69(),
    pD7 = Gj0(),
    lD7 = Zj0(),
    iD7 = Yj0(),
    Bh = _69.exports = function (A) {
      R69.call(this), this._parser = new pD7(A, {
        read: this.read.bind(this),
        error: this._handleError.bind(this),
        metadata: this._handleMetaData.bind(this),
        gamma: this.emit.bind(this, "gamma"),
        palette: this._handlePalette.bind(this),
        transColor: this._handleTransColor.bind(this),
        finished: this._finished.bind(this),
        inflateData: this._inflateData.bind(this),
        simpleTransparency: this._simpleTransparency.bind(this),
        headersFinished: this._headersFinished.bind(this)
      }), this._options = A, this.writable = !0, this._parser.start()
    };
  dD7.inherits(Bh, R69);
  Bh.prototype._handleError = function (A) {
    if (this.emit("error", A), this.writable = !1, this.destroy(), this._inflate && this._inflate.destroy) this._inflate.destroy();
    if (this._filter) this._filter.destroy(), this._filter.on("error", function () {});
    this.errord = !0
  };
  Bh.prototype._inflateData = function (A) {
    if (!this._inflate)
      if (this._bitmapInfo.interlace) this._inflate = Jj0.createInflate(), this._inflate.on("error", this.emit.bind(this, "error")), this._filter.on("complete", this._complete.bind(this)), this._inflate.pipe(this._filter);
      else {
        let B = ((this._bitmapInfo.width * this._bitmapInfo.bpp * this._bitmapInfo.depth + 7 >> 3) + 1) * this._bitmapInfo.height,
          G = Math.max(B, Jj0.Z_MIN_CHUNK);
        this._inflate = Jj0.createInflate({
          chunkSize: G
        });
        let Z = B,
          Y = this.emit.bind(this, "error");
        this._inflate.on("error", function (X) {
          if (!Z) return;
          Y(X)
        }), this._filter.on("complete", this._complete.bind(this));
        let J = this._filter.write.bind(this._filter);
        this._inflate.on("data", function (X) {
          if (!Z) return;
          if (X.length > Z) X = X.slice(0, Z);
          Z -= X.length, J(X)
        }), this._inflate.on("end", this._filter.end.bind(this._filter))
      } this._inflate.write(A)
  };
  Bh.prototype._handleMetaData = function (A) {
    this._metaData = A, this._bitmapInfo = Object.create(A), this._filter = new cD7(this._bitmapInfo)
  };
  Bh.prototype._handleTransColor = function (A) {
    this._bitmapInfo.transColor = A
  };
  Bh.prototype._handlePalette = function (A) {
    this._bitmapInfo.palette = A
  };
  Bh.prototype._simpleTransparency = function () {
    this._metaData.alpha = !0
  };
  Bh.prototype._headersFinished = function () {
    this.emit("metadata", this._metaData)
  };
  Bh.prototype._finished = function () {
    if (this.errord) return;
    if (!this._inflate) this.emit("error", "No Inflate block");
    else this._inflate.end()
  };
  Bh.prototype._complete = function (A) {
    if (this.errord) return;
    let Q;
    try {
      let B = lD7.dataToBitMap(A, this._bitmapInfo);
      Q = iD7(B, this._bitmapInfo), B = null
    } catch (B) {
      this._handleError(B);
      return
    }
    this.emit("parsed", Q)
  }
})
// @from(Ln 418860, Col 4)
P69 = U((XiY, T69) => {
  var Rj = rzA();
  T69.exports = function (A, Q, B, G) {
    let Z = [Rj.COLORTYPE_COLOR_ALPHA, Rj.COLORTYPE_ALPHA].indexOf(G.colorType) !== -1;
    if (G.colorType === G.inputColorType) {
      let H = function () {
        let E = new ArrayBuffer(2);
        return new DataView(E).setInt16(0, 256, !0), new Int16Array(E)[0] !== 256
      }();
      if (G.bitDepth === 8 || G.bitDepth === 16 && H) return A
    }
    let Y = G.bitDepth !== 16 ? A : new Uint16Array(A.buffer),
      J = 255,
      X = Rj.COLORTYPE_TO_BPP_MAP[G.inputColorType];
    if (X === 4 && !G.inputHasAlpha) X = 3;
    let I = Rj.COLORTYPE_TO_BPP_MAP[G.colorType];
    if (G.bitDepth === 16) J = 65535, I *= 2;
    let D = Buffer.alloc(Q * B * I),
      W = 0,
      K = 0,
      V = G.bgColor || {};
    if (V.red === void 0) V.red = J;
    if (V.green === void 0) V.green = J;
    if (V.blue === void 0) V.blue = J;

    function F() {
      let H, E, z, $ = J;
      switch (G.inputColorType) {
        case Rj.COLORTYPE_COLOR_ALPHA:
          $ = Y[W + 3], H = Y[W], E = Y[W + 1], z = Y[W + 2];
          break;
        case Rj.COLORTYPE_COLOR:
          H = Y[W], E = Y[W + 1], z = Y[W + 2];
          break;
        case Rj.COLORTYPE_ALPHA:
          $ = Y[W + 1], H = Y[W], E = H, z = H;
          break;
        case Rj.COLORTYPE_GRAYSCALE:
          H = Y[W], E = H, z = H;
          break;
        default:
          throw Error("input color type:" + G.inputColorType + " is not supported at present")
      }
      if (G.inputHasAlpha) {
        if (!Z) $ /= J, H = Math.min(Math.max(Math.round((1 - $) * V.red + $ * H), 0), J), E = Math.min(Math.max(Math.round((1 - $) * V.green + $ * E), 0), J), z = Math.min(Math.max(Math.round((1 - $) * V.blue + $ * z), 0), J)
      }
      return {
        red: H,
        green: E,
        blue: z,
        alpha: $
      }
    }
    for (let H = 0; H < B; H++)
      for (let E = 0; E < Q; E++) {
        let z = F(Y, W);
        switch (G.colorType) {
          case Rj.COLORTYPE_COLOR_ALPHA:
          case Rj.COLORTYPE_COLOR:
            if (G.bitDepth === 8) {
              if (D[K] = z.red, D[K + 1] = z.green, D[K + 2] = z.blue, Z) D[K + 3] = z.alpha
            } else if (D.writeUInt16BE(z.red, K), D.writeUInt16BE(z.green, K + 2), D.writeUInt16BE(z.blue, K + 4), Z) D.writeUInt16BE(z.alpha, K + 6);
            break;
          case Rj.COLORTYPE_ALPHA:
          case Rj.COLORTYPE_GRAYSCALE: {
            let $ = (z.red + z.green + z.blue) / 3;
            if (G.bitDepth === 8) {
              if (D[K] = $, Z) D[K + 1] = z.alpha
            } else if (D.writeUInt16BE($, K), Z) D.writeUInt16BE(z.alpha, K + 2);
            break
          }
          default:
            throw Error("unrecognised color Type " + G.colorType)
        }
        W += X, K += I
      }
    return D
  }
})
// @from(Ln 418939, Col 4)
y69 = U((IiY, x69) => {
  var S69 = t_0();

  function nD7(A, Q, B, G, Z) {
    for (let Y = 0; Y < B; Y++) G[Z + Y] = A[Q + Y]
  }

  function aD7(A, Q, B) {
    let G = 0,
      Z = Q + B;
    for (let Y = Q; Y < Z; Y++) G += Math.abs(A[Y]);
    return G
  }

  function oD7(A, Q, B, G, Z, Y) {
    for (let J = 0; J < B; J++) {
      let X = J >= Y ? A[Q + J - Y] : 0,
        I = A[Q + J] - X;
      G[Z + J] = I
    }
  }

  function rD7(A, Q, B, G) {
    let Z = 0;
    for (let Y = 0; Y < B; Y++) {
      let J = Y >= G ? A[Q + Y - G] : 0,
        X = A[Q + Y] - J;
      Z += Math.abs(X)
    }
    return Z
  }

  function sD7(A, Q, B, G, Z) {
    for (let Y = 0; Y < B; Y++) {
      let J = Q > 0 ? A[Q + Y - B] : 0,
        X = A[Q + Y] - J;
      G[Z + Y] = X
    }
  }

  function tD7(A, Q, B) {
    let G = 0,
      Z = Q + B;
    for (let Y = Q; Y < Z; Y++) {
      let J = Q > 0 ? A[Y - B] : 0,
        X = A[Y] - J;
      G += Math.abs(X)
    }
    return G
  }

  function eD7(A, Q, B, G, Z, Y) {
    for (let J = 0; J < B; J++) {
      let X = J >= Y ? A[Q + J - Y] : 0,
        I = Q > 0 ? A[Q + J - B] : 0,
        D = A[Q + J] - (X + I >> 1);
      G[Z + J] = D
    }
  }

  function AW7(A, Q, B, G) {
    let Z = 0;
    for (let Y = 0; Y < B; Y++) {
      let J = Y >= G ? A[Q + Y - G] : 0,
        X = Q > 0 ? A[Q + Y - B] : 0,
        I = A[Q + Y] - (J + X >> 1);
      Z += Math.abs(I)
    }
    return Z
  }

  function QW7(A, Q, B, G, Z, Y) {
    for (let J = 0; J < B; J++) {
      let X = J >= Y ? A[Q + J - Y] : 0,
        I = Q > 0 ? A[Q + J - B] : 0,
        D = Q > 0 && J >= Y ? A[Q + J - (B + Y)] : 0,
        W = A[Q + J] - S69(X, I, D);
      G[Z + J] = W
    }
  }

  function BW7(A, Q, B, G) {
    let Z = 0;
    for (let Y = 0; Y < B; Y++) {
      let J = Y >= G ? A[Q + Y - G] : 0,
        X = Q > 0 ? A[Q + Y - B] : 0,
        I = Q > 0 && Y >= G ? A[Q + Y - (B + G)] : 0,
        D = A[Q + Y] - S69(J, X, I);
      Z += Math.abs(D)
    }
    return Z
  }
  var GW7 = {
      0: nD7,
      1: oD7,
      2: sD7,
      3: eD7,
      4: QW7
    },
    ZW7 = {
      0: aD7,
      1: rD7,
      2: tD7,
      3: AW7,
      4: BW7
    };
  x69.exports = function (A, Q, B, G, Z) {
    let Y;
    if (!("filterType" in G) || G.filterType === -1) Y = [0, 1, 2, 3, 4];
    else if (typeof G.filterType === "number") Y = [G.filterType];
    else throw Error("unrecognised filter types");
    if (G.bitDepth === 16) Z *= 2;
    let J = Q * Z,
      X = 0,
      I = 0,
      D = Buffer.alloc((J + 1) * B),
      W = Y[0];
    for (let K = 0; K < B; K++) {
      if (Y.length > 1) {
        let V = 1 / 0;
        for (let F = 0; F < Y.length; F++) {
          let H = ZW7[Y[F]](A, I, J, Z);
          if (H < V) W = Y[F], V = H
        }
      }
      D[X] = W, X++, GW7[W](A, I, J, D, X, Z), X += J, I += J
    }
    return D
  }
})
// @from(Ln 419069, Col 4)
Xj0 = U((DiY, v69) => {
  var O$ = rzA(),
    YW7 = Bj0(),
    JW7 = P69(),
    XW7 = y69(),
    IW7 = NA("zlib"),
    qe = v69.exports = function (A) {
      if (this._options = A, A.deflateChunkSize = A.deflateChunkSize || 32768, A.deflateLevel = A.deflateLevel != null ? A.deflateLevel : 9, A.deflateStrategy = A.deflateStrategy != null ? A.deflateStrategy : 3, A.inputHasAlpha = A.inputHasAlpha != null ? A.inputHasAlpha : !0, A.deflateFactory = A.deflateFactory || IW7.createDeflate, A.bitDepth = A.bitDepth || 8, A.colorType = typeof A.colorType === "number" ? A.colorType : O$.COLORTYPE_COLOR_ALPHA, A.inputColorType = typeof A.inputColorType === "number" ? A.inputColorType : O$.COLORTYPE_COLOR_ALPHA, [O$.COLORTYPE_GRAYSCALE, O$.COLORTYPE_COLOR, O$.COLORTYPE_COLOR_ALPHA, O$.COLORTYPE_ALPHA].indexOf(A.colorType) === -1) throw Error("option color type:" + A.colorType + " is not supported at present");
      if ([O$.COLORTYPE_GRAYSCALE, O$.COLORTYPE_COLOR, O$.COLORTYPE_COLOR_ALPHA, O$.COLORTYPE_ALPHA].indexOf(A.inputColorType) === -1) throw Error("option input color type:" + A.inputColorType + " is not supported at present");
      if (A.bitDepth !== 8 && A.bitDepth !== 16) throw Error("option bit depth:" + A.bitDepth + " is not supported at present")
    };
  qe.prototype.getDeflateOptions = function () {
    return {
      chunkSize: this._options.deflateChunkSize,
      level: this._options.deflateLevel,
      strategy: this._options.deflateStrategy
    }
  };
  qe.prototype.createDeflate = function () {
    return this._options.deflateFactory(this.getDeflateOptions())
  };
  qe.prototype.filterData = function (A, Q, B) {
    let G = JW7(A, Q, B, this._options),
      Z = O$.COLORTYPE_TO_BPP_MAP[this._options.colorType];
    return XW7(G, Q, B, this._options, Z)
  };
  qe.prototype._packChunk = function (A, Q) {
    let B = Q ? Q.length : 0,
      G = Buffer.alloc(B + 12);
    if (G.writeUInt32BE(B, 0), G.writeUInt32BE(A, 4), Q) Q.copy(G, 8);
    return G.writeInt32BE(YW7.crc32(G.slice(4, G.length - 4)), G.length - 4), G
  };
  qe.prototype.packGAMA = function (A) {
    let Q = Buffer.alloc(4);
    return Q.writeUInt32BE(Math.floor(A * O$.GAMMA_DIVISION), 0), this._packChunk(O$.TYPE_gAMA, Q)
  };
  qe.prototype.packIHDR = function (A, Q) {
    let B = Buffer.alloc(13);
    return B.writeUInt32BE(A, 0), B.writeUInt32BE(Q, 4), B[8] = this._options.bitDepth, B[9] = this._options.colorType, B[10] = 0, B[11] = 0, B[12] = 0, this._packChunk(O$.TYPE_IHDR, B)
  };
  qe.prototype.packIDAT = function (A) {
    return this._packChunk(O$.TYPE_IDAT, A)
  };
  qe.prototype.packIEND = function () {
    return this._packChunk(O$.TYPE_IEND, null)
  }
})
// @from(Ln 419116, Col 4)
h69 = U((WiY, f69) => {
  var DW7 = NA("util"),
    k69 = NA("stream"),
    WW7 = rzA(),
    KW7 = Xj0(),
    b69 = f69.exports = function (A) {
      k69.call(this);
      let Q = A || {};
      this._packer = new KW7(Q), this._deflate = this._packer.createDeflate(), this.readable = !0
    };
  DW7.inherits(b69, k69);
  b69.prototype.pack = function (A, Q, B, G) {
    if (this.emit("data", Buffer.from(WW7.PNG_SIGNATURE)), this.emit("data", this._packer.packIHDR(Q, B)), G) this.emit("data", this._packer.packGAMA(G));
    let Z = this._packer.filterData(A, Q, B);
    this._deflate.on("error", this.emit.bind(this, "error")), this._deflate.on("data", function (Y) {
      this.emit("data", this._packer.packIDAT(Y))
    }.bind(this)), this._deflate.on("end", function () {
      this.emit("data", this._packer.packIEND()), this.emit("end")
    }.bind(this)), this._deflate.end(Z)
  }
})
// @from(Ln 419137, Col 4)
p69 = U((kgA, c69) => {
  var g69 = NA("assert").ok,
    szA = NA("zlib"),
    VW7 = NA("util"),
    u69 = NA("buffer").kMaxLength;

  function G8A(A) {
    if (!(this instanceof G8A)) return new G8A(A);
    if (A && A.chunkSize < szA.Z_MIN_CHUNK) A.chunkSize = szA.Z_MIN_CHUNK;
    if (szA.Inflate.call(this, A), this._offset = this._offset === void 0 ? this._outOffset : this._offset, this._buffer = this._buffer || this._outBuffer, A && A.maxLength != null) this._maxLength = A.maxLength
  }

  function FW7(A) {
    return new G8A(A)
  }

  function m69(A, Q) {
    if (Q) process.nextTick(Q);
    if (!A._handle) return;
    A._handle.close(), A._handle = null
  }
  G8A.prototype._processChunk = function (A, Q, B) {
    if (typeof B === "function") return szA.Inflate._processChunk.call(this, A, Q, B);
    let G = this,
      Z = A && A.length,
      Y = this._chunkSize - this._offset,
      J = this._maxLength,
      X = 0,
      I = [],
      D = 0,
      W;
    this.on("error", function (H) {
      W = H
    });

    function K(H, E) {
      if (G._hadError) return;
      let z = Y - E;
      if (g69(z >= 0, "have should not go down"), z > 0) {
        let $ = G._buffer.slice(G._offset, G._offset + z);
        if (G._offset += z, $.length > J) $ = $.slice(0, J);
        if (I.push($), D += $.length, J -= $.length, J === 0) return !1
      }
      if (E === 0 || G._offset >= G._chunkSize) Y = G._chunkSize, G._offset = 0, G._buffer = Buffer.allocUnsafe(G._chunkSize);
      if (E === 0) return X += Z - H, Z = H, !0;
      return !1
    }
    g69(this._handle, "zlib binding closed");
    let V;
    do V = this._handle.writeSync(Q, A, X, Z, this._buffer, this._offset, Y), V = V || this._writeState; while (!this._hadError && K(V[0], V[1]));
    if (this._hadError) throw W;
    if (D >= u69) throw m69(this), RangeError("Cannot create final Buffer. It would be larger than 0x" + u69.toString(16) + " bytes");
    let F = Buffer.concat(I, D);
    return m69(this), F
  };
  VW7.inherits(G8A, szA.Inflate);

  function HW7(A, Q) {
    if (typeof Q === "string") Q = Buffer.from(Q);
    if (!(Q instanceof Buffer)) throw TypeError("Not a string or buffer");
    let B = A._finishFlushFlag;
    if (B == null) B = szA.Z_FINISH;
    return A._processChunk(Q, B)
  }

  function d69(A, Q) {
    return HW7(new G8A(Q), A)
  }
  c69.exports = kgA = d69;
  kgA.Inflate = G8A;
  kgA.createInflate = FW7;
  kgA.inflateSync = d69
})
// @from(Ln 419210, Col 4)
Ij0 = U((KiY, i69) => {
  var l69 = i69.exports = function (A) {
    this._buffer = A, this._reads = []
  };
  l69.prototype.read = function (A, Q) {
    this._reads.push({
      length: Math.abs(A),
      allowLess: A < 0,
      func: Q
    })
  };
  l69.prototype.process = function () {
    while (this._reads.length > 0 && this._buffer.length) {
      let A = this._reads[0];
      if (this._buffer.length && (this._buffer.length >= A.length || A.allowLess)) {
        this._reads.shift();
        let Q = this._buffer;
        this._buffer = Q.slice(A.length), A.func.call(this, Q.slice(0, A.length))
      } else break
    }
    if (this._reads.length > 0) return Error("There are some read requests waitng on finished stream");
    if (this._buffer.length > 0) return Error("unrecognised content at end of stream")
  }
})
// @from(Ln 419234, Col 4)
n69 = U(($W7) => {
  var EW7 = Ij0(),
    zW7 = e_0();
  $W7.process = function (A, Q) {
    let B = [],
      G = new EW7(A);
    return new zW7(Q, {
      read: G.read.bind(G),
      write: function (Y) {
        B.push(Y)
      },
      complete: function () {}
    }).start(), G.process(), Buffer.concat(B)
  }
})
// @from(Ln 419249, Col 4)
s69 = U((FiY, r69) => {
  var a69 = !0,
    o69 = NA("zlib"),
    UW7 = p69();
  if (!o69.deflateSync) a69 = !1;
  var qW7 = Ij0(),
    NW7 = n69(),
    wW7 = Gj0(),
    LW7 = Zj0(),
    OW7 = Yj0();
  r69.exports = function (A, Q) {
    if (!a69) throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");
    let B;

    function G(M) {
      B = M
    }
    let Z;

    function Y(M) {
      Z = M
    }

    function J(M) {
      Z.transColor = M
    }

    function X(M) {
      Z.palette = M
    }

    function I() {
      Z.alpha = !0
    }
    let D;

    function W(M) {
      D = M
    }
    let K = [];

    function V(M) {
      K.push(M)
    }
    let F = new qW7(A);
    if (new wW7(Q, {
        read: F.read.bind(F),
        error: G,
        metadata: Y,
        gamma: W,
        palette: X,
        transColor: J,
        inflateData: V,
        simpleTransparency: I
      }).start(), F.process(), B) throw B;
    let E = Buffer.concat(K);
    K.length = 0;
    let z;
    if (Z.interlace) z = o69.inflateSync(E);
    else {
      let _ = ((Z.width * Z.bpp * Z.depth + 7 >> 3) + 1) * Z.height;
      z = UW7(E, {
        chunkSize: _,
        maxLength: _
      })
    }
    if (E = null, !z || !z.length) throw Error("bad png - invalid inflate data response");
    let $ = NW7.process(z, Z);
    E = null;
    let O = LW7.dataToBitMap($, Z);
    $ = null;
    let L = OW7(O, Z);
    return Z.data = L, Z.gamma = D || 0, Z
  }
})
// @from(Ln 419324, Col 4)
Q39 = U((HiY, A39) => {
  var t69 = !0,
    e69 = NA("zlib");
  if (!e69.deflateSync) t69 = !1;
  var MW7 = rzA(),
    RW7 = Xj0();
  A39.exports = function (A, Q) {
    if (!t69) throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");
    let G = new RW7(Q || {}),
      Z = [];
    if (Z.push(Buffer.from(MW7.PNG_SIGNATURE)), Z.push(G.packIHDR(A.width, A.height)), A.gamma) Z.push(G.packGAMA(A.gamma));
    let Y = G.filterData(A.data, A.width, A.height),
      J = e69.deflateSync(Y, G.getDeflateOptions());
    if (Y = null, !J || !J.length) throw Error("bad png - invalid compressed data response");
    return Z.push(G.packIDAT(J)), Z.push(G.packIEND()), Buffer.concat(Z)
  }
})
// @from(Ln 419341, Col 4)
B39 = U((TW7) => {
  var _W7 = s69(),
    jW7 = Q39();
  TW7.read = function (A, Q) {
    return _W7(A, Q || {})
  };
  TW7.write = function (A, Q) {
    return jW7(A, Q)
  }
})
// @from(Ln 419351, Col 4)
Z39 = U((bW7) => {
  var xW7 = NA("util"),
    G39 = NA("stream"),
    yW7 = j69(),
    vW7 = h69(),
    kW7 = B39(),
    PU = bW7.PNG = function (A) {
      if (G39.call(this), A = A || {}, this.width = A.width | 0, this.height = A.height | 0, this.data = this.width > 0 && this.height > 0 ? Buffer.alloc(4 * this.width * this.height) : null, A.fill && this.data) this.data.fill(0);
      this.gamma = 0, this.readable = this.writable = !0, this._parser = new yW7(A), this._parser.on("error", this.emit.bind(this, "error")), this._parser.on("close", this._handleClose.bind(this)), this._parser.on("metadata", this._metadata.bind(this)), this._parser.on("gamma", this._gamma.bind(this)), this._parser.on("parsed", function (Q) {
        this.data = Q, this.emit("parsed", Q)
      }.bind(this)), this._packer = new vW7(A), this._packer.on("data", this.emit.bind(this, "data")), this._packer.on("end", this.emit.bind(this, "end")), this._parser.on("close", this._handleClose.bind(this)), this._packer.on("error", this.emit.bind(this, "error"))
    };
  xW7.inherits(PU, G39);
  PU.sync = kW7;
  PU.prototype.pack = function () {
    if (!this.data || !this.data.length) return this.emit("error", "No data provided"), this;
    return process.nextTick(function () {
      this._packer.pack(this.data, this.width, this.height, this.gamma)
    }.bind(this)), this
  };
  PU.prototype.parse = function (A, Q) {
    if (Q) {
      let B, G;
      B = function (Z) {
        this.removeListener("error", G), this.data = Z, Q(null, this)
      }.bind(this), G = function (Z) {
        this.removeListener("parsed", B), Q(Z, null)
      }.bind(this), this.once("parsed", B), this.once("error", G)
    }
    return this.end(A), this
  };
  PU.prototype.write = function (A) {
    return this._parser.write(A), !0
  };
  PU.prototype.end = function (A) {
    this._parser.end(A)
  };
  PU.prototype._metadata = function (A) {
    this.width = A.width, this.height = A.height, this.emit("metadata", A)
  };
  PU.prototype._gamma = function (A) {
    this.gamma = A
  };
  PU.prototype._handleClose = function () {
    if (!this._parser.writable && !this._packer.readable) this.emit("close")
  };
  PU.bitblt = function (A, Q, B, G, Z, Y, J, X) {
    if (B |= 0, G |= 0, Z |= 0, Y |= 0, J |= 0, X |= 0, B > A.width || G > A.height || B + Z > A.width || G + Y > A.height) throw Error("bitblt reading outside image");
    if (J > Q.width || X > Q.height || J + Z > Q.width || X + Y > Q.height) throw Error("bitblt writing outside image");
    for (let I = 0; I < Y; I++) A.data.copy(Q.data, (X + I) * Q.width + J << 2, (G + I) * A.width + B << 2, (G + I) * A.width + B + Z << 2)
  };
  PU.prototype.bitblt = function (A, Q, B, G, Z, Y, J) {
    return PU.bitblt(this, A, Q, B, G, Z, Y, J), this
  };
  PU.adjustGamma = function (A) {
    if (A.gamma) {
      for (let Q = 0; Q < A.height; Q++)
        for (let B = 0; B < A.width; B++) {
          let G = A.width * Q + B << 2;
          for (let Z = 0; Z < 3; Z++) {
            let Y = A.data[G + Z] / 255;
            Y = Math.pow(Y, 0.45454545454545453 / A.gamma), A.data[G + Z] = Math.round(Y * 255)
          }
        }
      A.gamma = 0
    }
  };
  PU.prototype.adjustGamma = function () {
    PU.adjustGamma(this)
  }
})
// @from(Ln 419422, Col 4)
bgA = U((fW7) => {
  function Y39(A) {
    if (typeof A === "number") A = A.toString();
    if (typeof A !== "string") throw Error("Color should be defined as hex string");
    let Q = A.slice().replace("#", "").split("");
    if (Q.length < 3 || Q.length === 5 || Q.length > 8) throw Error("Invalid hex color: " + A);
    if (Q.length === 3 || Q.length === 4) Q = Array.prototype.concat.apply([], Q.map(function (G) {
      return [G, G]
    }));
    if (Q.length === 6) Q.push("F", "F");
    let B = parseInt(Q.join(""), 16);
    return {
      r: B >> 24 & 255,
      g: B >> 16 & 255,
      b: B >> 8 & 255,
      a: B & 255,
      hex: "#" + Q.slice(0, 6).join("")
    }
  }
  fW7.getOptions = function (Q) {
    if (!Q) Q = {};
    if (!Q.color) Q.color = {};
    let B = typeof Q.margin > "u" || Q.margin === null || Q.margin < 0 ? 4 : Q.margin,
      G = Q.width && Q.width >= 21 ? Q.width : void 0,
      Z = Q.scale || 4;
    return {
      width: G,
      scale: G ? 4 : Z,
      margin: B,
      color: {
        dark: Y39(Q.color.dark || "#000000ff"),
        light: Y39(Q.color.light || "#ffffffff")
      },
      type: Q.type,
      rendererOpts: Q.rendererOpts || {}
    }
  };
  fW7.getScale = function (Q, B) {
    return B.width && B.width >= Q + B.margin * 2 ? B.width / (Q + B.margin * 2) : B.scale
  };
  fW7.getImageWidth = function (Q, B) {
    let G = fW7.getScale(Q, B);
    return Math.floor((Q + B.margin * 2) * G)
  };
  fW7.qrToImageData = function (Q, B, G) {
    let Z = B.modules.size,
      Y = B.modules.data,
      J = fW7.getScale(Z, G),
      X = Math.floor((Z + G.margin * 2) * J),
      I = G.margin * J,
      D = [G.color.light, G.color.dark];
    for (let W = 0; W < X; W++)
      for (let K = 0; K < X; K++) {
        let V = (W * X + K) * 4,
          F = G.color.light;
        if (W >= I && K >= I && W < X - I && K < X - I) {
          let H = Math.floor((W - I) / J),
            E = Math.floor((K - I) / J);
          F = D[Y[H * Z + E] ? 1 : 0]
        }
        Q[V++] = F.r, Q[V++] = F.g, Q[V++] = F.b, Q[V] = F.a
      }
  }
})
// @from(Ln 419486, Col 4)
J39 = U((cW7) => {
  var mW7 = NA("fs"),
    dW7 = Z39().PNG,
    Wj0 = bgA();
  cW7.render = function (Q, B) {
    let G = Wj0.getOptions(B),
      Z = G.rendererOpts,
      Y = Wj0.getImageWidth(Q.modules.size, G);
    Z.width = Y, Z.height = Y;
    let J = new dW7(Z);
    return Wj0.qrToImageData(J.data, Q, G), J
  };
  cW7.renderToDataURL = function (Q, B, G) {
    if (typeof G > "u") G = B, B = void 0;
    cW7.renderToBuffer(Q, B, function (Z, Y) {
      if (Z) G(Z);
      let J = "data:image/png;base64,";
      J += Y.toString("base64"), G(null, J)
    })
  };
  cW7.renderToBuffer = function (Q, B, G) {
    if (typeof G > "u") G = B, B = void 0;
    let Z = cW7.render(Q, B),
      Y = [];
    Z.on("error", G), Z.on("data", function (J) {
      Y.push(J)
    }), Z.on("end", function () {
      G(null, Buffer.concat(Y))
    }), Z.pack()
  };
  cW7.renderToFile = function (Q, B, G, Z) {
    if (typeof Z > "u") Z = G, G = void 0;
    let Y = !1,
      J = (...I) => {
        if (Y) return;
        Y = !0, Z.apply(null, I)
      },
      X = mW7.createWriteStream(Q);
    X.on("error", J), X.on("close", J), cW7.renderToFileStream(X, B, G)
  };
  cW7.renderToFileStream = function (Q, B, G) {
    cW7.render(B, G).pack().pipe(Q)
  }
})
// @from(Ln 419530, Col 4)
I39 = U((tW7) => {
  var aW7 = bgA(),
    oW7 = {
      WW: " ",
      WB: "▄",
      BB: "█",
      BW: "▀"
    },
    rW7 = {
      BB: " ",
      BW: "▄",
      WW: "█",
      WB: "▀"
    };

  function sW7(A, Q, B) {
    if (A && Q) return B.BB;
    if (A && !Q) return B.BW;
    if (!A && Q) return B.WB;
    return B.WW
  }
  tW7.render = function (A, Q, B) {
    let G = aW7.getOptions(Q),
      Z = oW7;
    if (G.color.dark.hex === "#ffffff" || G.color.light.hex === "#000000") Z = rW7;
    let Y = A.modules.size,
      J = A.modules.data,
      X = "",
      I = Array(Y + G.margin * 2 + 1).join(Z.WW);
    I = Array(G.margin / 2 + 1).join(I + `
`);
    let D = Array(G.margin + 1).join(Z.WW);
    X += I;
    for (let W = 0; W < Y; W += 2) {
      X += D;
      for (let K = 0; K < Y; K++) {
        let V = J[W * Y + K],
          F = J[(W + 1) * Y + K];
        X += sW7(V, F, Z)
      }
      X += D + `
`
    }
    if (X += I.slice(0, -1), typeof B === "function") B(null, X);
    return X
  };
  tW7.renderToFile = function (Q, B, G, Z) {
    if (typeof Z > "u") Z = G, G = void 0;
    let Y = NA("fs"),
      J = tW7.render(B, G);
    Y.writeFile(Q, J, Z)
  }
})
// @from(Ln 419583, Col 4)
D39 = U((AK7) => {
  AK7.render = function (A, Q, B) {
    let G = A.modules.size,
      Z = A.modules.data,
      Y = "\x1B[40m  \x1B[0m",
      J = "\x1B[47m  \x1B[0m",
      X = "",
      I = Array(G + 3).join("\x1B[47m  \x1B[0m"),
      D = Array(2).join("\x1B[47m  \x1B[0m");
    X += I + `
`;
    for (let W = 0; W < G; ++W) {
      X += "\x1B[47m  \x1B[0m";
      for (let K = 0; K < G; K++) X += Z[W * G + K] ? "\x1B[40m  \x1B[0m" : "\x1B[47m  \x1B[0m";
      X += D + `
`
    }
    if (X += I + `
`, typeof B === "function") B(null, X);
    return X
  }
})
// @from(Ln 419605, Col 4)
V39 = U((YK7) => {
  var BK7 = "\x1B[47m\x1B[30m",
    GK7 = "\x1B[40m\x1B[37m",
    ZK7 = function (A, Q, B) {
      return {
        "00": "\x1B[0m " + A,
        "01": "\x1B[0m" + Q + "▄" + A,
        "02": "\x1B[0m" + B + "▄" + A,
        10: "\x1B[0m" + Q + "▀" + A,
        11: " ",
        12: "▄",
        20: "\x1B[0m" + B + "▀" + A,
        21: "▀",
        22: "█"
      }
    },
    W39 = function (A, Q, B, G) {
      let Z = Q + 1;
      if (B >= Z || G >= Z || G < -1 || B < -1) return "0";
      if (B >= Q || G >= Q || G < 0 || B < 0) return "1";
      let Y = G * Q + B;
      return A[Y] ? "2" : "1"
    },
    K39 = function (A, Q, B, G) {
      return W39(A, Q, B, G) + W39(A, Q, B, G + 1)
    };
  YK7.render = function (A, Q, B) {
    let G = A.modules.size,
      Z = A.modules.data,
      Y = !!(Q && Q.inverse),
      J = Q && Q.inverse ? GK7 : BK7,
      D = ZK7(J, Y ? "\x1B[30m" : "\x1B[37m", Y ? "\x1B[37m" : "\x1B[30m"),
      W = `\x1B[0m
` + J,
      K = J;
    for (let V = -1; V < G + 1; V += 2) {
      for (let F = -1; F < G; F++) K += D[K39(Z, G, F, V)];
      K += D[K39(Z, G, G, V)] + W
    }
    if (K += "\x1B[0m", typeof B === "function") B(null, K);
    return K
  }
})
// @from(Ln 419648, Col 4)
F39 = U((DK7) => {
  var XK7 = D39(),
    IK7 = V39();
  DK7.render = function (A, Q, B) {
    if (Q && Q.small) return IK7.render(A, Q, B);
    return XK7.render(A, Q, B)
  }
})
// @from(Ln 419656, Col 4)
Fj0 = U((FK7) => {
  var KK7 = bgA();

  function H39(A, Q) {
    let B = A.a / 255,
      G = Q + '="' + A.hex + '"';
    return B < 1 ? G + " " + Q + '-opacity="' + B.toFixed(2).slice(1) + '"' : G
  }

  function Vj0(A, Q, B) {
    let G = A + Q;
    if (typeof B < "u") G += " " + B;
    return G
  }

  function VK7(A, Q, B) {
    let G = "",
      Z = 0,
      Y = !1,
      J = 0;
    for (let X = 0; X < A.length; X++) {
      let I = Math.floor(X % Q),
        D = Math.floor(X / Q);
      if (!I && !Y) Y = !0;
      if (A[X]) {
        if (J++, !(X > 0 && I > 0 && A[X - 1])) G += Y ? Vj0("M", I + B, 0.5 + D + B) : Vj0("m", Z, 0), Z = 0, Y = !1;
        if (!(I + 1 < Q && A[X + 1])) G += Vj0("h", J), J = 0
      } else Z++
    }
    return G
  }
  FK7.render = function (Q, B, G) {
    let Z = KK7.getOptions(B),
      Y = Q.modules.size,
      J = Q.modules.data,
      X = Y + Z.margin * 2,
      I = !Z.color.light.a ? "" : "<path " + H39(Z.color.light, "fill") + ' d="M0 0h' + X + "v" + X + 'H0z"/>',
      D = "<path " + H39(Z.color.dark, "stroke") + ' d="' + VK7(J, Y, Z.margin) + '"/>',
      W = 'viewBox="0 0 ' + X + " " + X + '"',
      V = '<svg xmlns="http://www.w3.org/2000/svg" ' + (!Z.width ? "" : 'width="' + Z.width + '" height="' + Z.width + '" ') + W + ' shape-rendering="crispEdges">' + I + D + `</svg>
`;
    if (typeof G === "function") G(null, V);
    return V
  }
})
// @from(Ln 419701, Col 4)
z39 = U((zK7) => {
  var EK7 = Fj0();
  zK7.render = EK7.render;
  zK7.renderToFile = function (Q, B, G, Z) {
    if (typeof Z > "u") Z = G, G = void 0;
    let Y = NA("fs"),
      X = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + zK7.render(B, G);
    Y.writeFile(Q, X, Z)
  }
})
// @from(Ln 419711, Col 4)
C39 = U((qK7) => {
  var Hj0 = bgA();

  function CK7(A, Q, B) {
    if (A.clearRect(0, 0, Q.width, Q.height), !Q.style) Q.style = {};
    Q.height = B, Q.width = B, Q.style.height = B + "px", Q.style.width = B + "px"
  }

  function UK7() {
    try {
      return document.createElement("canvas")
    } catch (A) {
      throw Error("You need to specify a canvas element")
    }
  }
  qK7.render = function (Q, B, G) {
    let Z = G,
      Y = B;
    if (typeof Z > "u" && (!B || !B.getContext)) Z = B, B = void 0;
    if (!B) Y = UK7();
    Z = Hj0.getOptions(Z);
    let J = Hj0.getImageWidth(Q.modules.size, Z),
      X = Y.getContext("2d"),
      I = X.createImageData(J, J);
    return Hj0.qrToImageData(I.data, Q, Z), CK7(X, Y, J), X.putImageData(I, 0, 0), Y
  };
  qK7.renderToDataURL = function (Q, B, G) {
    let Z = G;
    if (typeof Z > "u" && (!B || !B.getContext)) Z = B, B = void 0;
    if (!Z) Z = {};
    let Y = qK7.render(Q, B, Z),
      J = Z.type || "image/png",
      X = Z.rendererOpts || {};
    return Y.toDataURL(J, X.quality)
  }
})
// @from(Ln 419747, Col 4)
q39 = U((OK7) => {
  var wK7 = M_0(),
    Ej0 = o_0(),
    U39 = C39(),
    LK7 = Fj0();

  function zj0(A, Q, B, G, Z) {
    let Y = [].slice.call(arguments, 1),
      J = Y.length,
      X = typeof Y[J - 1] === "function";
    if (!X && !wK7()) throw Error("Callback required as last argument");
    if (X) {
      if (J < 2) throw Error("Too few arguments provided");
      if (J === 2) Z = B, B = Q, Q = G = void 0;
      else if (J === 3)
        if (Q.getContext && typeof Z > "u") Z = G, G = void 0;
        else Z = G, G = B, B = Q, Q = void 0
    } else {
      if (J < 1) throw Error("Too few arguments provided");
      if (J === 1) B = Q, Q = G = void 0;
      else if (J === 2 && !Q.getContext) G = B, B = Q, Q = void 0;
      return new Promise(function (I, D) {
        try {
          let W = Ej0.create(B, G);
          I(A(W, Q, G))
        } catch (W) {
          D(W)
        }
      })
    }
    try {
      let I = Ej0.create(B, G);
      Z(null, A(I, Q, G))
    } catch (I) {
      Z(I)
    }
  }
  OK7.create = Ej0.create;
  OK7.toCanvas = zj0.bind(null, U39.render);
  OK7.toDataURL = zj0.bind(null, U39.renderToDataURL);
  OK7.toString = zj0.bind(null, function (A, Q, B) {
    return LK7.render(A, B)
  })
})
// @from(Ln 419792, Col 0)
function yK7(A, Q, B) {
  if (typeof A > "u") throw Error("String required as first argument");
  if (typeof B > "u") B = Q, Q = {};
  if (typeof B !== "function")
    if (!TK7()) throw Error("Callback required as last argument");
    else Q = B || {}, B = null;
  return {
    opts: Q,
    cb: B
  }
}
// @from(Ln 419804, Col 0)
function vK7(A) {
  switch (A) {
    case "svg":
      return xK7;
    case "terminal":
      return SK7;
    case "utf8":
    default:
      return PK7
  }
}
// @from(Ln 419816, Col 0)
function kK7(A, Q, B) {
  if (!B.cb) return new Promise(function (G, Z) {
    try {
      let Y = $j0.create(Q, B.opts);
      return A(Y, B.opts, function (J, X) {
        return J ? Z(J) : G(X)
      })
    } catch (Y) {
      Z(Y)
    }
  });
  try {
    let G = $j0.create(Q, B.opts);
    return A(G, B.opts, B.cb)
  } catch (G) {
    B.cb(G)
  }
}
// @from(Ln 419834, Col 4)
TK7
// @from(Ln 419834, Col 9)
$j0
// @from(Ln 419834, Col 14)
jiY
// @from(Ln 419834, Col 19)
PK7
// @from(Ln 419834, Col 24)
SK7
// @from(Ln 419834, Col 29)
xK7
// @from(Ln 419834, Col 34)
bK7
// @from(Ln 419834, Col 39)
fK7
// @from(Ln 419834, Col 44)
Wz1 = function (Q, B, G) {
  let Z = yK7(Q, B, G),
    Y = Z.opts ? Z.opts.type : void 0,
    J = vK7(Y);
  return kK7(J.render, Q, Z)
}
// @from(Ln 419840, Col 4)
N39 = w(() => {
  TK7 = M_0(), $j0 = o_0(), jiY = J39(), PK7 = I39(), SK7 = F39(), xK7 = z39();
  bK7 = $j0.create, fK7 = q39().toCanvas
})
// @from(Ln 419845, Col 0)
function hK7({
  onDone: A
}) {
  let [Q, B] = fgA.useState("ios"), [G, Z] = fgA.useState({
    ios: "",
    android: ""
  }), {
    url: Y
  } = Cj0[Q], J = G[Q];
  fgA.useEffect(() => {
    async function I() {
      let [D, W] = await Promise.all([Wz1(Cj0.ios.url, {
        type: "utf8",
        errorCorrectionLevel: "L"
      }), Wz1(Cj0.android.url, {
        type: "utf8",
        errorCorrectionLevel: "L"
      })]);
      Z({
        ios: D,
        android: W
      })
    }
    I().catch(() => {})
  }, []), J0((I, D) => {
    if (D.escape || I === "q" || D.ctrl && I === "c") {
      A();
      return
    }
    if (D.tab || D.leftArrow || D.rightArrow) B((W) => W === "ios" ? "android" : "ios")
  });
  let X = J.split(`
`).filter((I) => I.length > 0);
  return KW.createElement(T, {
    flexDirection: "column",
    paddingX: 2
  }, X.map((I, D) => KW.createElement(C, {
    key: D
  }, I)), KW.createElement(T, {
    flexDirection: "row",
    gap: 2,
    marginBottom: 1
  }, KW.createElement(C, null, KW.createElement(C, {
    bold: Q === "ios",
    underline: Q === "ios"
  }, "iOS"), KW.createElement(C, {
    dimColor: !0
  }, " / "), KW.createElement(C, {
    bold: Q === "android",
    underline: Q === "android"
  }, "Android")), KW.createElement(C, {
    dimColor: !0
  }, "(tab to switch, esc to close)")), KW.createElement(C, {
    dimColor: !0
  }, Y))
}
// @from(Ln 419901, Col 4)
KW
// @from(Ln 419901, Col 8)
fgA
// @from(Ln 419901, Col 13)
Cj0
// @from(Ln 419901, Col 18)
gK7
// @from(Ln 419901, Col 23)
w39
// @from(Ln 419902, Col 4)
L39 = w(() => {
  fA();
  N39();
  KW = c(QA(), 1), fgA = c(QA(), 1), Cj0 = {
    ios: {
      url: "https://apps.apple.com/app/claude-by-anthropic/id6473753684"
    },
    android: {
      url: "https://play.google.com/store/apps/details?id=com.anthropic.claude"
    }
  };
  gK7 = {
    type: "local-jsx",
    name: "mobile",
    aliases: ["ios", "android"],
    description: "Show QR code to download the Claude mobile app",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A) {
      return KW.createElement(hK7, {
        onDone: A
      })
    },
    userFacingName() {
      return "mobile"
    }
  }, w39 = gK7
})
// @from(Ln 419930, Col 4)
O39 = () => {}
// @from(Ln 419931, Col 4)
M39 = () => {}
// @from(Ln 419933, Col 0)
function tzA({
  name: A,
  description: Q,
  progressMessage: B,
  pluginName: G,
  pluginCommand: Z,
  getPromptWhileMarketplaceIsPrivate: Y
}) {
  return {
    type: "prompt",
    name: A,
    description: Q,
    progressMessage: B,
    contentLength: 0,
    isEnabled: () => !0,
    isHidden: !1,
    userFacingName() {
      return A
    },
    source: "builtin",
    async getPromptForCommand(J, X) {
      return Y(J, X)
    }
  }
}
// @from(Ln 419958, Col 4)
R39
// @from(Ln 419959, Col 4)
_39 = w(() => {
  R39 = tzA({
    name: "pr-comments",
    description: "Get comments from a GitHub pull request",
    progressMessage: "fetching PR comments",
    pluginName: "pr-comments",
    pluginCommand: "pr-comments",
    async getPromptWhileMarketplaceIsPrivate(A) {
      return [{
        type: "text",
        text: `You are an AI assistant integrated into a git-based version control system. Your task is to fetch and display comments from a GitHub pull request.

Follow these steps:

1. Use \`gh pr view --json number,headRepository\` to get the PR number and repository info
2. Use \`gh api /repos/{owner}/{repo}/issues/{number}/comments\` to get PR-level comments
3. Use \`gh api /repos/{owner}/{repo}/pulls/{number}/comments\` to get review comments. Pay particular attention to the following fields: \`body\`, \`diff_hunk\`, \`path\`, \`line\`, etc. If the comment references some code, consider fetching it using eg \`gh api /repos/{owner}/{repo}/contents/{path}?ref={branch} | jq .content -r | base64 -d\`
4. Parse and format all comments in a readable way
5. Return ONLY the formatted comments, with no additional text

Format the comments as:

## Comments

[For each comment thread:]
- @author file.ts#line:
  \`\`\`diff
  [diff_hunk from the API response]
  \`\`\`
  > quoted comment text

  [any replies indented]

If there are no comments, return "No comments found."

Remember:
1. Only show the actual comments, no explanatory text
2. Include both PR-level and code review comments
3. Preserve the threading/nesting of comment replies
4. Show the file and line number context for code review comments
5. Use jq to parse the JSON responses from the GitHub API

${A?"Additional user input: "+A:""}
`
      }]
    }
  })
})
// @from(Ln 420019, Col 0)
function Uj0() {
  return uK7(zQ(), "cache", "changelog.md")
}
// @from(Ln 420022, Col 0)
async function x39() {
  let A = L1();
  if (!A.cachedChangelog) return;
  let Q = Uj0();
  try {
    await P39(j39(Q), {
      recursive: !0
    }), await T39(Q, A.cachedChangelog, {
      encoding: "utf-8",
      flag: "wx"
    })
  } catch {}
  S0(({
    cachedChangelog: B,
    ...G
  }) => G)
}
// @from(Ln 420039, Col 0)
async function qj0() {
  if (p2()) return;
  if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
  let A = await xQ.get(cK7);
  if (A.status === 200) {
    let Q = A.data,
      B = Uj0();
    await P39(j39(B), {
      recursive: !0
    }), await T39(B, Q, {
      encoding: "utf-8"
    });
    let G = Date.now();
    S0((Z) => ({
      ...Z,
      changelogLastFetched: G
    }))
  }
}
// @from(Ln 420059, Col 0)
function Z8A() {
  let A = Uj0();
  try {
    return mK7(A, "utf-8")
  } catch {
    return ""
  }
}
// @from(Ln 420068, Col 0)
function Kz1(A) {
  try {
    if (!A) return {};
    let Q = {},
      B = A.split(/^## /gm).slice(1);
    for (let G of B) {
      let Z = G.trim().split(`
`);
      if (Z.length === 0) continue;
      let Y = Z[0];
      if (!Y) continue;
      let J = Y.split(" - ")[0]?.trim() || "";
      if (!J) continue;
      let X = Z.slice(1).filter((I) => I.trim().startsWith("- ")).map((I) => I.trim().substring(2).trim()).filter(Boolean);
      if (X.length > 0) Q[J] = X
    }
    return Q
  } catch (Q) {
    return e(Q instanceof Error ? Q : Error("Failed to parse changelog")), {}
  }
}
// @from(Ln 420090, Col 0)
function pK7(A, Q, B = Z8A()) {
  try {
    let G = Kz1(B),
      Z = Ne.coerce(A),
      Y = Q ? Ne.coerce(Q) : null;
    if (!Y || Z && Ne.gt(Z, Y, {
        loose: !0
      })) return Object.entries(G).filter(([J]) => !Y || Ne.gt(J, Y, {
      loose: !0
    })).sort(([J], [X]) => Ne.gt(J, X, {
      loose: !0
    }) ? -1 : 1).flatMap(([J, X]) => X).filter(Boolean).slice(0, dK7)
  } catch (G) {
    return e(G instanceof Error ? G : Error("Failed to get release notes")), []
  }
  return []
}
// @from(Ln 420108, Col 0)
function Nj0(A = Z8A()) {
  try {
    let Q = Kz1(A);
    return Object.keys(Q).sort((G, Z) => Ne.gt(G, Z, {
      loose: !0
    }) ? 1 : -1).map((G) => {
      let Z = Q[G];
      if (!Z || Z.length === 0) return null;
      let Y = Z.filter(Boolean);
      if (Y.length === 0) return null;
      return [G, Y]
    }).filter((G) => G !== null)
  } catch (Q) {
    return e(Q instanceof Error ? Q : Error("Failed to get release notes")), []
  }
}
// @from(Ln 420125, Col 0)
function hgA(A, Q = {
  ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
  PACKAGE_URL: "@anthropic-ai/claude-code",
  README_URL: "https://code.claude.com/docs/en/overview",
  VERSION: "2.1.7",
  FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
  BUILD_TIME: "2026-01-13T22:55:21Z"
}.VERSION) {
  if (A !== Q || !Z8A()) qj0().catch((Z) => e(Z instanceof Error ? Z : Error("Failed to fetch changelog")));
  let B = pK7(Q, A);
  return {
    hasReleaseNotes: B.length > 0,
    releaseNotes: B
  }
}
// @from(Ln 420140, Col 4)
Ne
// @from(Ln 420140, Col 8)
dK7 = 5
// @from(Ln 420141, Col 2)
S39 = "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md"
// @from(Ln 420142, Col 2)
cK7 = "https://raw.githubusercontent.com/anthropics/claude-code/refs/heads/main/CHANGELOG.md"
// @from(Ln 420143, Col 4)
Y8A = w(() => {
  v1();
  j5();
  GQ();
  C0();
  fQ();
  Ne = c(xP(), 1)
})
// @from(Ln 420152, Col 0)
function y39(A) {
  return A.map(([Q, B]) => {
    let G = `Version ${Q}:`,
      Z = B.map((Y) => `• ${Y}`).join(`
`);
    return `${G}
${Z}`
  }).join(`

`)
}
// @from(Ln 420163, Col 4)
lK7
// @from(Ln 420163, Col 9)
v39
// @from(Ln 420164, Col 4)
k39 = w(() => {
  Y8A();
  lK7 = {
    description: "View release notes",
    isEnabled: () => !0,
    isHidden: !1,
    name: "release-notes",
    userFacingName() {
      return "release-notes"
    },
    type: "local",
    supportsNonInteractive: !0,
    async call() {
      let A = [];
      try {
        let B = new Promise((G, Z) => {
          setTimeout(() => Z(Error("Timeout")), 500)
        });
        await Promise.race([qj0(), B]), A = Nj0(Z8A())
      } catch {}
      if (A.length > 0) return {
        type: "text",
        value: y39(A)
      };
      let Q = Nj0();
      if (Q.length > 0) return {
        type: "text",
        value: y39(Q)
      };
      return {
        type: "text",
        value: `See the full changelog at: ${S39}`
      }
    }
  }, v39 = lK7
})
// @from(Ln 420200, Col 4)
iK7
// @from(Ln 420200, Col 9)
b39
// @from(Ln 420201, Col 4)
f39 = w(() => {
  d4();
  C0();
  iK7 = {
    type: "local",
    name: "rename",
    description: "Rename the current conversation",
    isEnabled: () => !0,
    isHidden: !1,
    supportsNonInteractive: !1,
    argumentHint: "<name>",
    async call(A, Q) {
      if (!A || A.trim() === "") return {
        type: "text",
        value: "Please provide a name for the session. Usage: /rename <name>"
      };
      let B = q0(),
        G = uz(),
        Z = A.trim();
      return await Vz1(B, Z, G), {
        type: "text",
        value: `Session renamed to: ${Z}`
      }
    },
    userFacingName() {
      return "rename"
    }
  }, b39 = iK7
})
// @from(Ln 420231, Col 0)
function h39({
  nodes: A,
  onSelect: Q,
  onCancel: B,
  onFocus: G,
  focusNodeId: Z,
  visibleOptionCount: Y,
  layout: J = "expanded",
  isDisabled: X = !1,
  hideIndexes: I = !1,
  isNodeExpanded: D,
  onExpand: W,
  onCollapse: K,
  getParentPrefix: V,
  getChildPrefix: F,
  onUpFromFirstItem: H
}) {
  let [E, z] = M$.default.useState(new Set), $ = M$.default.useRef(!1), O = M$.default.useRef(null), L = M$.default.useCallback((GA) => {
    if (D) return D(GA);
    return E.has(GA)
  }, [D, E]), M = M$.default.useMemo(() => {
    let GA = [];

    function WA(MA, TA, bA) {
      let jA = !!MA.children && MA.children.length > 0,
        OA = L(MA.id);
      if (GA.push({
          node: MA,
          depth: TA,
          isExpanded: OA,
          hasChildren: jA,
          parentId: bA
        }), jA && OA && MA.children)
        for (let IA of MA.children) WA(IA, TA + 1, MA.id)
    }
    for (let MA of A) WA(MA, 0);
    return GA
  }, [A, L]), _ = M$.default.useCallback((GA) => GA ? "▼ " : "▶ ", []), j = M$.default.useCallback((GA) => "  ▸ ", []), x = V ?? _, b = F ?? j, S = M$.default.useCallback((GA) => {
    let WA = "";
    if (GA.hasChildren) WA = x(GA.isExpanded);
    else if (GA.depth > 0) WA = b(GA.depth);
    return WA + GA.node.label
  }, [x, b]), u = M$.default.useMemo(() => {
    return M.map((GA) => ({
      label: S(GA),
      description: GA.node.description,
      dimDescription: GA.node.dimDescription ?? !0,
      value: GA.node.id
    }))
  }, [M, S]), f = M$.default.useMemo(() => {
    let GA = new Map;
    return M.forEach((WA) => GA.set(WA.node.id, WA.node)), GA
  }, [M]), AA = M$.default.useCallback((GA) => {
    return M.find((WA) => WA.node.id === GA)
  }, [M]), n = M$.default.useCallback((GA, WA) => {
    let MA = AA(GA);
    if (!MA || !MA.hasChildren) return;
    if (WA)
      if (W) W(GA);
      else z((TA) => new Set([...TA, GA]));
    else if (K) K(GA);
    else z((TA) => {
      let bA = new Set(TA);
      return bA.delete(GA), bA
    })
  }, [AA, W, K]);
  J0((GA, WA) => {
    if (!Z || X) return;
    let MA = AA(Z);
    if (!MA) return;
    if (WA.rightArrow && MA.hasChildren) n(Z, !0);
    else if (WA.leftArrow) {
      if (MA.hasChildren && MA.isExpanded) n(Z, !1);
      else if (MA.parentId !== void 0) {
        if ($.current = !0, n(MA.parentId, !1), G) {
          let TA = f.get(MA.parentId);
          if (TA) G(TA)
        }
      }
    }
  }, {
    isActive: !X
  });
  let y = M$.default.useCallback((GA) => {
      let WA = f.get(GA);
      if (!WA) return;
      Q(WA)
    }, [f, Q]),
    p = M$.default.useCallback((GA) => {
      if ($.current) {
        $.current = !1;
        return
      }
      if (O.current === GA) return;
      if (O.current = GA, G) {
        let WA = f.get(GA);
        if (WA) G(WA)
      }
    }, [G, f]);
  return M$.default.createElement(k0, {
    options: u,
    onChange: y,
    onFocus: p,
    onCancel: B,
    defaultFocusValue: Z,
    visibleOptionCount: Y,
    layout: J,
    isDisabled: X,
    hideIndexes: I,
    onUpFromFirstItem: H
  })
}
// @from(Ln 420343, Col 4)
M$
// @from(Ln 420344, Col 4)
g39 = w(() => {
  W8();
  fA();
  M$ = c(QA(), 1)
})
// @from(Ln 420350, Col 0)
function wj0(A) {
  if (A.type === "assistant" && A.message.content[0]?.type === "tool_use") {
    let Q = A.message.content[0];
    return {
      messageId: A.message.id,
      toolUseId: Q.id,
      toolName: Q.name
    }
  }
  return null
}
// @from(Ln 420362, Col 0)
function u39(A, Q, B = !1) {
  if (B) return {
    messages: A
  };
  let G = new Set(Q.filter((W) => W.renderGroupedToolUse).map((W) => W.name)),
    Z = new Map;
  for (let W of A) {
    let K = wj0(W);
    if (K && G.has(K.toolName)) {
      let V = `${K.messageId}:${K.toolName}`,
        F = Z.get(V) ?? [];
      F.push(W), Z.set(V, F)
    }
  }
  let Y = new Map,
    J = new Set;
  for (let [W, K] of Z)
    if (K.length >= 2) {
      Y.set(W, K);
      for (let V of K) {
        let F = wj0(V);
        if (F) J.add(F.toolUseId)
      }
    } let X = new Map;
  for (let W of A)
    if (W.type === "user") {
      for (let K of W.message.content)
        if (K.type === "tool_result" && J.has(K.tool_use_id)) X.set(K.tool_use_id, W)
    } let I = [],
    D = new Set;
  for (let W of A) {
    let K = wj0(W);
    if (K) {
      let V = `${K.messageId}:${K.toolName}`,
        F = Y.get(V);
      if (F) {
        if (!D.has(V)) {
          D.add(V);
          let H = F[0],
            E = [];
          for (let $ of F) {
            let O = $.message.content[0].id,
              L = X.get(O);
            if (L) E.push(L)
          }
          let z = {
            type: "grouped_tool_use",
            toolName: K.toolName,
            messages: F,
            results: E,
            displayMessage: H,
            uuid: `grouped-${H.uuid}`,
            timestamp: H.timestamp,
            messageId: K.messageId
          };
          I.push(z)
        }
        continue
      }
    }
    if (W.type === "user") {
      let V = W.message.content.filter((F) => F.type === "tool_result");
      if (V.length > 0) {
        if (V.every((H) => J.has(H.tool_use_id))) continue
      }
    }
    I.push(W)
  }
  return {
    messages: I
  }
}
// @from(Ln 420441, Col 0)
function zz1(A) {
  let Q = A.match(/^(\d+)\.(\d+)\.(\d+)(?:-canary\.(\d+))?/);
  if (!Q?.[1] || !Q[2] || !Q[3]) return !1;
  let B = parseInt(Q[1], 10),
    G = parseInt(Q[2], 10),
    Z = parseInt(Q[3], 10),
    Y = Q[4] ? parseInt(Q[4], 10) : null;
  if (B <= 13) return !1;
  if (B === 14) {
    if (Y !== null && G === 3 && Z === 0) return Y >= 77;
    return !1
  }
  if (B === 15 && Y !== null) {
    if (G === 6 && Z === 0) return Y < 58;
    return !0
  }
  if (B === 16 && Y !== null) {
    if (G === 1 && Z === 0) return Y < 12;
    return G === 0
  }
  if (B >= 17) return !1;
  let J = `${B}.${G}`,
    X = m39[J];
  if (X === void 0) {
    let I = Object.keys(m39).filter((W) => W.startsWith(`${B}.`)).map((W) => parseInt(W.split(".")[1], 10)),
      D = Math.max(...I, 0);
    return G <= D
  }
  return Z < X
}
// @from(Ln 420471, Col 0)
async function nK7() {
  let A = o1(),
    Q = Fz1(A, "package-lock.json");
  try {
    let Y = await Hz1(Q, "utf-8"),
      J = c5(Y);
    if (J) {
      let X = aK7(J, Q);
      if (X) return X
    }
  } catch {}
  let B = Fz1(A, "yarn.lock");
  try {
    let Y = await Hz1(B, "utf-8"),
      J = oK7(Y, B);
    if (J) return J
  } catch {}
  let G = Fz1(A, "pnpm-lock.yaml");
  try {
    let Y = await Hz1(G, "utf-8"),
      J = rK7(Y, G);
    if (J) return J
  } catch {}
  let Z = Fz1(A, "bun.lock");
  try {
    let Y = await Hz1(Z, "utf-8"),
      J = c5(Y);
    if (J) {
      let X = sK7(J, Z);
      if (X) return X
    }
  } catch {}
  return {
    detected: !1,
    package: null,
    packageName: null,
    version: null,
    packageManager: null,
    lockFilePath: null
  }
}
// @from(Ln 420513, Col 0)
function aK7(A, Q) {
  let B = A.packages?.["node_modules/next"]?.version,
    G = A.dependencies?.next?.version,
    Z = B || G;
  if (Z) {
    if (zz1(Z)) return {
      detected: !0,
      package: "next",
      packageName: "next",
      version: Z,
      packageManager: "npm",
      lockFilePath: Q
    };
    return null
  }
  for (let Y of Ez1) {
    let J = A.packages?.[`node_modules/${Y}`]?.version;
    if (J && ggA.includes(J)) return {
      detected: !0,
      package: "react-server-dom",
      packageName: Y,
      version: J,
      packageManager: "npm",
      lockFilePath: Q
    };
    let X = A.dependencies?.[Y]?.version;
    if (X && ggA.includes(X)) return {
      detected: !0,
      package: "react-server-dom",
      packageName: Y,
      version: X,
      packageManager: "npm",
      lockFilePath: Q
    }
  }
  return null
}
// @from(Ln 420551, Col 0)
function oK7(A, Q) {
  let B = d39(A, "next");
  if (B) {
    if (zz1(B)) return {
      detected: !0,
      package: "next",
      packageName: "next",
      version: B,
      packageManager: "yarn",
      lockFilePath: Q
    };
    return null
  }
  for (let G of Ez1) {
    let Z = d39(A, G);
    if (Z && ggA.includes(Z)) return {
      detected: !0,
      package: "react-server-dom",
      packageName: G,
      version: Z,
      packageManager: "yarn",
      lockFilePath: Q
    }
  }
  return null
}
// @from(Ln 420578, Col 0)
function rK7(A, Q) {
  let B = c39(A, "next");
  if (B) {
    if (zz1(B)) return {
      detected: !0,
      package: "next",
      packageName: "next",
      version: B,
      packageManager: "pnpm",
      lockFilePath: Q
    };
    return null
  }
  for (let G of Ez1) {
    let Z = c39(A, G);
    if (Z && ggA.includes(Z)) return {
      detected: !0,
      package: "react-server-dom",
      packageName: G,
      version: Z,
      packageManager: "pnpm",
      lockFilePath: Q
    }
  }
  return null
}
// @from(Ln 420605, Col 0)
function sK7(A, Q) {
  if (!A.packages) return null;
  if ("next" in A.packages) {
    let B = A.packages.next;
    if (Array.isArray(B) && B[0]) {
      let G = B[0].match(/^next@(.+)$/);
      if (G?.[1]) {
        if (zz1(G[1])) return {
          detected: !0,
          package: "next",
          packageName: "next",
          version: G[1],
          packageManager: "bun",
          lockFilePath: Q
        };
        return null
      }
    }
  }
  for (let B of Ez1)
    if (B in A.packages) {
      let G = A.packages[B];
      if (Array.isArray(G) && G[0]) {
        let Z = G[0].match(new RegExp(`^${B}@(.+)$`));
        if (Z?.[1] && ggA.includes(Z[1])) return {
          detected: !0,
          package: "react-server-dom",
          packageName: B,
          version: Z[1],
          packageManager: "bun",
          lockFilePath: Q
        }
      }
    } return null
}
// @from(Ln 420641, Col 0)
function d39(A, Q) {
  let B = new RegExp(`^"?${Q}@[^:]+:\\s*\\n\\s+version\\s+"([^"]+)"`, "m");
  return A.match(B)?.[1] ?? null
}
// @from(Ln 420646, Col 0)
function c39(A, Q) {
  let B = new RegExp(`^\\s+${Q}:\\s*\\n\\s+specifier:[^\\n]*\\n\\s+version:\\s*([\\d.]+(?:-[\\w.]+)?)`, "m"),
    G = A.match(B);
  if (G?.[1]) return G[1];
  let Z = new RegExp(`['"]?${Q}@([\\d.]+(?:-[\\w.]+)?)['"]?:`);
  return A.match(Z)?.[1] ?? null
}
// @from(Ln 420654, Col 0)
function p39(A, Q) {
  switch (A) {
    case "npm":
      return `npm update ${Q}`;
    case "yarn":
      return `yarn upgrade ${Q}`;
    case "pnpm":
      return `pnpm update ${Q}`;
    case "bun":
      return `bun update ${Q}`
  }
}
// @from(Ln 420667, Col 0)
function Lj0() {
  let Q = JG().reactVulnerabilityCache;
  if (!Q) return null;
  return {
    detected: Q.detected,
    package: Q.package,
    packageName: Q.packageName,
    version: Q.version,
    packageManager: Q.packageManager,
    lockFilePath: null
  }
}
// @from(Ln 420679, Col 0)
async function l39() {
  let A = await nK7();
  return BZ((Q) => ({
    ...Q,
    reactVulnerabilityCache: {
      detected: A.detected,
      package: A.package,
      packageName: A.packageName,
      version: A.version,
      packageManager: A.packageManager
    }
  })), A
}
// @from(Ln 420692, Col 4)
ggA
// @from(Ln 420692, Col 9)
Ez1
// @from(Ln 420692, Col 14)
m39
// @from(Ln 420693, Col 4)
Oj0 = w(() => {
  V2();
  vI();
  tQ();
  GQ();
  ggA = ["19.0.0", "19.1.0", "19.1.1", "19.2.0"], Ez1 = ["react-server-dom-webpack", "react-server-dom-parcel", "react-server-dom-turbopack"], m39 = {
    "15.0": 5,
    "15.1": 9,
    "15.2": 6,
    "15.3": 6,
    "15.4": 8,
    "15.5": 7,
    "16.0": 7
  }
})
// @from(Ln 420712, Col 0)
function i39(A) {
  return KV7.filter((Q) => Q.isActive(A))
}
// @from(Ln 420715, Col 4)
xB
// @from(Ln 420715, Col 8)
eK7
// @from(Ln 420715, Col 13)
AV7
// @from(Ln 420715, Col 18)
QV7
// @from(Ln 420715, Col 23)
BV7
// @from(Ln 420715, Col 28)
GV7
// @from(Ln 420715, Col 33)
ZV7
// @from(Ln 420715, Col 38)
YV7
// @from(Ln 420715, Col 43)
JV7
// @from(Ln 420715, Col 48)
XV7
// @from(Ln 420715, Col 53)
IV7 = 3
// @from(Ln 420716, Col 2)
DV7 = "tengu_react_vulnerability_warning"
// @from(Ln 420717, Col 2)
WV7
// @from(Ln 420717, Col 7)
KV7