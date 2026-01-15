
// @from(Ln 400699, Col 0)
function f09(A, Q, {
  getFn: B = t6.getFn,
  fieldNormWeight: G = t6.fieldNormWeight
} = {}) {
  let Z = new eH1({
    getFn: B,
    fieldNormWeight: G
  });
  return Z.setKeys(A.map(b09)), Z.setSources(Q), Z.create(), Z
}
// @from(Ln 400710, Col 0)
function _Z7(A, {
  getFn: Q = t6.getFn,
  fieldNormWeight: B = t6.fieldNormWeight
} = {}) {
  let {
    keys: G,
    records: Z
  } = A, Y = new eH1({
    getFn: Q,
    fieldNormWeight: B
  });
  return Y.setKeys(G), Y.setIndexRecords(Z), Y
}
// @from(Ln 400724, Col 0)
function sH1(A, {
  errors: Q = 0,
  currentLocation: B = 0,
  expectedLocation: G = 0,
  distance: Z = t6.distance,
  ignoreLocation: Y = t6.ignoreLocation
} = {}) {
  let J = Q / A.length;
  if (Y) return J;
  let X = Math.abs(G - B);
  if (!Z) return X ? 1 : J;
  return J + X / Z
}
// @from(Ln 400738, Col 0)
function jZ7(A = [], Q = t6.minMatchCharLength) {
  let B = [],
    G = -1,
    Z = -1,
    Y = 0;
  for (let J = A.length; Y < J; Y += 1) {
    let X = A[Y];
    if (X && G === -1) G = Y;
    else if (!X && G !== -1) {
      if (Z = Y - 1, Z - G + 1 >= Q) B.push([G, Z]);
      G = -1
    }
  }
  if (A[Y - 1] && Y - G >= Q) B.push([G, Y - 1]);
  return B
}
// @from(Ln 400755, Col 0)
function TZ7(A, Q, B, {
  location: G = t6.location,
  distance: Z = t6.distance,
  threshold: Y = t6.threshold,
  findAllMatches: J = t6.findAllMatches,
  minMatchCharLength: X = t6.minMatchCharLength,
  includeMatches: I = t6.includeMatches,
  ignoreLocation: D = t6.ignoreLocation
} = {}) {
  if (Q.length > k3A) throw Error($Z7(k3A));
  let W = Q.length,
    K = A.length,
    V = Math.max(0, Math.min(G, K)),
    F = Y,
    H = V,
    E = X > 1 || I,
    z = E ? Array(K) : [],
    $;
  while (($ = A.indexOf(Q, H)) > -1) {
    let x = sH1(Q, {
      currentLocation: $,
      expectedLocation: V,
      distance: Z,
      ignoreLocation: D
    });
    if (F = Math.min(x, F), H = $ + W, E) {
      let b = 0;
      while (b < W) z[$ + b] = 1, b += 1
    }
  }
  H = -1;
  let O = [],
    L = 1,
    M = W + K,
    _ = 1 << W - 1;
  for (let x = 0; x < W; x += 1) {
    let b = 0,
      S = M;
    while (b < S) {
      if (sH1(Q, {
          errors: x,
          currentLocation: V + S,
          expectedLocation: V,
          distance: Z,
          ignoreLocation: D
        }) <= F) b = S;
      else M = S;
      S = Math.floor((M - b) / 2 + b)
    }
    M = S;
    let u = Math.max(1, V - S + 1),
      f = J ? K : Math.min(V + S, K) + W,
      AA = Array(f + 2);
    AA[f + 1] = (1 << x) - 1;
    for (let y = f; y >= u; y -= 1) {
      let p = y - 1,
        GA = B[A.charAt(p)];
      if (E) z[p] = +!!GA;
      if (AA[y] = (AA[y + 1] << 1 | 1) & GA, x) AA[y] |= (O[y + 1] | O[y]) << 1 | 1 | O[y + 1];
      if (AA[y] & _) {
        if (L = sH1(Q, {
            errors: x,
            currentLocation: p,
            expectedLocation: V,
            distance: Z,
            ignoreLocation: D
          }), L <= F) {
          if (F = L, H = p, H <= V) break;
          u = Math.max(1, 2 * V - H)
        }
      }
    }
    if (sH1(Q, {
        errors: x + 1,
        currentLocation: V,
        expectedLocation: V,
        distance: Z,
        ignoreLocation: D
      }) > F) break;
    O = AA
  }
  let j = {
    isMatch: H >= 0,
    score: Math.max(0.001, L)
  };
  if (E) {
    let x = jZ7(z, X);
    if (!x.length) j.isMatch = !1;
    else if (I) j.indices = x
  }
  return j
}
// @from(Ln 400848, Col 0)
function PZ7(A) {
  let Q = {};
  for (let B = 0, G = A.length; B < G; B += 1) {
    let Z = A.charAt(B);
    Q[Z] = (Q[Z] || 0) | 1 << G - B - 1
  }
  return Q
}
// @from(Ln 400856, Col 0)
class tM0 {
  constructor(A, {
    location: Q = t6.location,
    threshold: B = t6.threshold,
    distance: G = t6.distance,
    includeMatches: Z = t6.includeMatches,
    findAllMatches: Y = t6.findAllMatches,
    minMatchCharLength: J = t6.minMatchCharLength,
    isCaseSensitive: X = t6.isCaseSensitive,
    ignoreLocation: I = t6.ignoreLocation
  } = {}) {
    if (this.options = {
        location: Q,
        threshold: B,
        distance: G,
        includeMatches: Z,
        findAllMatches: Y,
        minMatchCharLength: J,
        isCaseSensitive: X,
        ignoreLocation: I
      }, this.pattern = X ? A : A.toLowerCase(), this.chunks = [], !this.pattern.length) return;
    let D = (K, V) => {
        this.chunks.push({
          pattern: K,
          alphabet: PZ7(K),
          startIndex: V
        })
      },
      W = this.pattern.length;
    if (W > k3A) {
      let K = 0,
        V = W % k3A,
        F = W - V;
      while (K < F) D(this.pattern.substr(K, k3A), K), K += k3A;
      if (V) {
        let H = W - k3A;
        D(this.pattern.substr(H), H)
      }
    } else D(this.pattern, 0)
  }
  searchIn(A) {
    let {
      isCaseSensitive: Q,
      includeMatches: B
    } = this.options;
    if (!Q) A = A.toLowerCase();
    if (this.pattern === A) {
      let F = {
        isMatch: !0,
        score: 0
      };
      if (B) F.indices = [
        [0, A.length - 1]
      ];
      return F
    }
    let {
      location: G,
      distance: Z,
      threshold: Y,
      findAllMatches: J,
      minMatchCharLength: X,
      ignoreLocation: I
    } = this.options, D = [], W = 0, K = !1;
    this.chunks.forEach(({
      pattern: F,
      alphabet: H,
      startIndex: E
    }) => {
      let {
        isMatch: z,
        score: $,
        indices: O
      } = TZ7(A, F, H, {
        location: G + E,
        distance: Z,
        threshold: Y,
        findAllMatches: J,
        minMatchCharLength: X,
        includeMatches: B,
        ignoreLocation: I
      });
      if (z) K = !0;
      if (W += $, z && O) D = [...D, ...O]
    });
    let V = {
      isMatch: K,
      score: K ? W / this.chunks.length : 1
    };
    if (K && B) V.indices = D;
    return V
  }
}
// @from(Ln 400949, Col 0)
class Bp {
  constructor(A) {
    this.pattern = A
  }
  static isMultiMatch(A) {
    return T09(A, this.multiRegex)
  }
  static isSingleMatch(A) {
    return T09(A, this.singleRegex)
  }
  search() {}
}
// @from(Ln 400962, Col 0)
function T09(A, Q) {
  let B = A.match(Q);
  return B ? B[1] : null
}
// @from(Ln 400967, Col 0)
function yZ7(A, Q = {}) {
  return A.split(xZ7).map((B) => {
    let G = B.trim().split(SZ7).filter((Y) => Y && !!Y.trim()),
      Z = [];
    for (let Y = 0, J = G.length; Y < J; Y += 1) {
      let X = G[Y],
        I = !1,
        D = -1;
      while (!I && ++D < P09) {
        let W = nM0[D],
          K = W.isMultiMatch(X);
        if (K) Z.push(new W(K, Q)), I = !0
      }
      if (I) continue;
      D = -1;
      while (++D < P09) {
        let W = nM0[D],
          K = W.isSingleMatch(X);
        if (K) {
          Z.push(new W(K, Q));
          break
        }
      }
    }
    return Z
  })
}
// @from(Ln 400994, Col 0)
class p09 {
  constructor(A, {
    isCaseSensitive: Q = t6.isCaseSensitive,
    includeMatches: B = t6.includeMatches,
    minMatchCharLength: G = t6.minMatchCharLength,
    ignoreLocation: Z = t6.ignoreLocation,
    findAllMatches: Y = t6.findAllMatches,
    location: J = t6.location,
    threshold: X = t6.threshold,
    distance: I = t6.distance
  } = {}) {
    this.query = null, this.options = {
      isCaseSensitive: Q,
      includeMatches: B,
      minMatchCharLength: G,
      findAllMatches: Y,
      ignoreLocation: Z,
      location: J,
      threshold: X,
      distance: I
    }, this.pattern = Q ? A : A.toLowerCase(), this.query = yZ7(this.pattern, this.options)
  }
  static condition(A, Q) {
    return Q.useExtendedSearch
  }
  searchIn(A) {
    let Q = this.query;
    if (!Q) return {
      isMatch: !1,
      score: 1
    };
    let {
      includeMatches: B,
      isCaseSensitive: G
    } = this.options;
    A = G ? A : A.toLowerCase();
    let Z = 0,
      Y = [],
      J = 0;
    for (let X = 0, I = Q.length; X < I; X += 1) {
      let D = Q[X];
      Y.length = 0, Z = 0;
      for (let W = 0, K = D.length; W < K; W += 1) {
        let V = D[W],
          {
            isMatch: F,
            indices: H,
            score: E
          } = V.search(A);
        if (F) {
          if (Z += 1, J += E, B) {
            let z = V.constructor.type;
            if (vZ7.has(z)) Y = [...Y, ...H];
            else Y.push(H)
          }
        } else {
          J = 0, Z = 0, Y.length = 0;
          break
        }
      }
      if (Z) {
        let W = {
          isMatch: !0,
          score: J / Z
        };
        if (B) W.indices = Y;
        return W
      }
    }
    return {
      isMatch: !1,
      score: 1
    }
  }
}
// @from(Ln 401070, Col 0)
function kZ7(...A) {
  aM0.push(...A)
}
// @from(Ln 401074, Col 0)
function oM0(A, Q) {
  for (let B = 0, G = aM0.length; B < G; B += 1) {
    let Z = aM0[B];
    if (Z.condition(A, Q)) return new Z(A, Q)
  }
  return new tM0(A, Q)
}
// @from(Ln 401082, Col 0)
function l09(A, Q, {
  auto: B = !0
} = {}) {
  let G = (Z) => {
    let Y = Object.keys(Z),
      J = bZ7(Z);
    if (!J && Y.length > 1 && !sM0(Z)) return G(S09(Z));
    if (fZ7(Z)) {
      let I = J ? Z[rM0.PATH] : Y[0],
        D = J ? Z[rM0.PATTERN] : Z[I];
      if (!af(D)) throw Error(zZ7(I));
      let W = {
        keyId: iM0(I),
        pattern: D
      };
      if (B) W.searcher = oM0(D, Q);
      return W
    }
    let X = {
      children: [],
      operator: Y[0]
    };
    return Y.forEach((I) => {
      let D = Z[I];
      if (Qp(D)) D.forEach((W) => {
        X.children.push(G(W))
      })
    }), X
  };
  if (!sM0(A)) A = S09(A);
  return G(A)
}
// @from(Ln 401115, Col 0)
function hZ7(A, {
  ignoreFieldNorm: Q = t6.ignoreFieldNorm
}) {
  A.forEach((B) => {
    let G = 1;
    B.matches.forEach(({
      key: Z,
      norm: Y,
      score: J
    }) => {
      let X = Z ? Z.weight : null;
      G *= Math.pow(J === 0 && X ? Number.EPSILON : J, (X || 1) * (Q ? 1 : Y))
    }), B.score = G
  })
}
// @from(Ln 401131, Col 0)
function gZ7(A, Q) {
  let B = A.matches;
  if (Q.matches = [], !lO(B)) return;
  B.forEach((G) => {
    if (!lO(G.indices) || !G.indices.length) return;
    let {
      indices: Z,
      value: Y
    } = G, J = {
      indices: Z,
      value: Y
    };
    if (G.key) J.key = G.key.src;
    if (G.idx > -1) J.refIndex = G.idx;
    Q.matches.push(J)
  })
}
// @from(Ln 401149, Col 0)
function uZ7(A, Q) {
  Q.score = A.score
}
// @from(Ln 401153, Col 0)
function mZ7(A, Q, {
  includeMatches: B = t6.includeMatches,
  includeScore: G = t6.includeScore
} = {}) {
  let Z = [];
  if (B) Z.push(gZ7);
  if (G) Z.push(uZ7);
  return A.map((Y) => {
    let {
      idx: J
    } = Y, X = {
      item: Q[J],
      refIndex: J
    };
    if (Z.length) Z.forEach((I) => {
      I(Y, X)
    });
    return X
  })
}
// @from(Ln 401173, Col 0)
class Vw {
  constructor(A, Q = {}, B) {
    this.options = {
      ...t6,
      ...Q
    }, this.options.useExtendedSearch, this._keyStore = new k09(this.options.keys), this.setCollection(A, B)
  }
  setCollection(A, Q) {
    if (this._docs = A, Q && !(Q instanceof eH1)) throw Error(EZ7);
    this._myIndex = Q || f09(this.options.keys, this._docs, {
      getFn: this.options.getFn,
      fieldNormWeight: this.options.fieldNormWeight
    })
  }
  add(A) {
    if (!lO(A)) return;
    this._docs.push(A), this._myIndex.add(A)
  }
  remove(A = () => !1) {
    let Q = [];
    for (let B = 0, G = this._docs.length; B < G; B += 1) {
      let Z = this._docs[B];
      if (A(Z, B)) this.removeAt(B), B -= 1, G -= 1, Q.push(Z)
    }
    return Q
  }
  removeAt(A) {
    this._docs.splice(A, 1), this._myIndex.removeAt(A)
  }
  getIndex() {
    return this._myIndex
  }
  search(A, {
    limit: Q = -1
  } = {}) {
    let {
      includeMatches: B,
      includeScore: G,
      shouldSort: Z,
      sortFn: Y,
      ignoreFieldNorm: J
    } = this.options, X = af(A) ? af(this._docs[0]) ? this._searchStringList(A) : this._searchObjectList(A) : this._searchLogical(A);
    if (hZ7(X, {
        ignoreFieldNorm: J
      }), Z) X.sort(Y);
    if (x09(Q) && Q > -1) X = X.slice(0, Q);
    return mZ7(X, this._docs, {
      includeMatches: B,
      includeScore: G
    })
  }
  _searchStringList(A) {
    let Q = oM0(A, this.options),
      {
        records: B
      } = this._myIndex,
      G = [];
    return B.forEach(({
      v: Z,
      i: Y,
      n: J
    }) => {
      if (!lO(Z)) return;
      let {
        isMatch: X,
        score: I,
        indices: D
      } = Q.searchIn(Z);
      if (X) G.push({
        item: Z,
        idx: Y,
        matches: [{
          score: I,
          value: Z,
          norm: J,
          indices: D
        }]
      })
    }), G
  }
  _searchLogical(A) {
    let Q = l09(A, this.options),
      B = (J, X, I) => {
        if (!J.children) {
          let {
            keyId: W,
            searcher: K
          } = J, V = this._findMatches({
            key: this._keyStore.get(W),
            value: this._myIndex.getValueForItemAtKeyId(X, W),
            searcher: K
          });
          if (V && V.length) return [{
            idx: I,
            item: X,
            matches: V
          }];
          return []
        }
        let D = [];
        for (let W = 0, K = J.children.length; W < K; W += 1) {
          let V = J.children[W],
            F = B(V, X, I);
          if (F.length) D.push(...F);
          else if (J.operator === tH1.AND) return []
        }
        return D
      },
      G = this._myIndex.records,
      Z = {},
      Y = [];
    return G.forEach(({
      $: J,
      i: X
    }) => {
      if (lO(J)) {
        let I = B(Q, J, X);
        if (I.length) {
          if (!Z[X]) Z[X] = {
            idx: X,
            item: J,
            matches: []
          }, Y.push(Z[X]);
          I.forEach(({
            matches: D
          }) => {
            Z[X].matches.push(...D)
          })
        }
      }
    }), Y
  }
  _searchObjectList(A) {
    let Q = oM0(A, this.options),
      {
        keys: B,
        records: G
      } = this._myIndex,
      Z = [];
    return G.forEach(({
      $: Y,
      i: J
    }) => {
      if (!lO(Y)) return;
      let X = [];
      if (B.forEach((I, D) => {
          X.push(...this._findMatches({
            key: I,
            value: Y[D],
            searcher: Q
          }))
        }), X.length) Z.push({
        idx: J,
        item: Y,
        matches: X
      })
    }), Z
  }
  _findMatches({
    key: A,
    value: Q,
    searcher: B
  }) {
    if (!lO(Q)) return [];
    let G = [];
    if (Qp(Q)) Q.forEach(({
      v: Z,
      i: Y,
      n: J
    }) => {
      if (!lO(Z)) return;
      let {
        isMatch: X,
        score: I,
        indices: D
      } = B.searchIn(Z);
      if (X) G.push({
        score: I,
        key: A,
        value: Z,
        idx: Y,
        norm: J,
        indices: D
      })
    });
    else {
      let {
        v: Z,
        n: Y
      } = Q, {
        isMatch: J,
        score: X,
        indices: I
      } = B.searchIn(Z);
      if (J) G.push({
        score: X,
        key: A,
        value: Z,
        norm: Y,
        indices: I
      })
    }
    return G
  }
}
// @from(Ln 401378, Col 4)
WZ7 = 1 / 0
// @from(Ln 401379, Col 2)
EZ7 = "Incorrect 'index' type"
// @from(Ln 401380, Col 2)
zZ7 = (A) => `Invalid value for key ${A}`
// @from(Ln 401381, Col 2)
$Z7 = (A) => `Pattern length exceeds max of ${A}.`
// @from(Ln 401382, Col 2)
CZ7 = (A) => `Missing ${A} property in key`
// @from(Ln 401383, Col 2)
UZ7 = (A) => `Property 'weight' in key '${A}' must be a positive integer`
// @from(Ln 401384, Col 2)
_09
// @from(Ln 401384, Col 7)
NZ7
// @from(Ln 401384, Col 12)
wZ7
// @from(Ln 401384, Col 17)
LZ7
// @from(Ln 401384, Col 22)
OZ7
// @from(Ln 401384, Col 27)
t6
// @from(Ln 401384, Col 31)
MZ7
// @from(Ln 401384, Col 36)
k3A = 32
// @from(Ln 401385, Col 2)
h09
// @from(Ln 401385, Col 7)
g09
// @from(Ln 401385, Col 12)
u09
// @from(Ln 401385, Col 17)
m09
// @from(Ln 401385, Col 22)
d09
// @from(Ln 401385, Col 27)
c09
// @from(Ln 401385, Col 32)
eM0
// @from(Ln 401385, Col 37)
AR0
// @from(Ln 401385, Col 42)
nM0
// @from(Ln 401385, Col 47)
P09
// @from(Ln 401385, Col 52)
SZ7
// @from(Ln 401385, Col 57)
xZ7 = "|"
// @from(Ln 401386, Col 2)
vZ7
// @from(Ln 401386, Col 7)
aM0
// @from(Ln 401386, Col 12)
tH1
// @from(Ln 401386, Col 17)
rM0
// @from(Ln 401386, Col 22)
sM0 = (A) => !!(A[tH1.AND] || A[tH1.OR])
// @from(Ln 401387, Col 2)
bZ7 = (A) => !!A[rM0.PATH]
// @from(Ln 401388, Col 2)
fZ7 = (A) => !Qp(A) && y09(A) && !sM0(A)
// @from(Ln 401389, Col 2)
S09 = (A) => ({
    [tH1.AND]: Object.keys(A).map((Q) => ({
      [Q]: A[Q]
    }))
  })
// @from(Ln 401394, Col 4)
rhA = w(() => {
  _09 = Object.prototype.hasOwnProperty;
  NZ7 = {
    includeMatches: !1,
    findAllMatches: !1,
    minMatchCharLength: 1
  }, wZ7 = {
    isCaseSensitive: !1,
    includeScore: !1,
    keys: [],
    shouldSort: !0,
    sortFn: (A, Q) => A.score === Q.score ? A.idx < Q.idx ? -1 : 1 : A.score < Q.score ? -1 : 1
  }, LZ7 = {
    location: 0,
    threshold: 0.6,
    distance: 100
  }, OZ7 = {
    useExtendedSearch: !1,
    getFn: qZ7,
    ignoreLocation: !1,
    ignoreFieldNorm: !1,
    fieldNormWeight: 1
  }, t6 = {
    ...wZ7,
    ...NZ7,
    ...LZ7,
    ...OZ7
  }, MZ7 = /[^ ]+/g;
  h09 = class h09 extends Bp {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "exact"
    }
    static get multiRegex() {
      return /^="(.*)"$/
    }
    static get singleRegex() {
      return /^=(.*)$/
    }
    search(A) {
      let Q = A === this.pattern;
      return {
        isMatch: Q,
        score: Q ? 0 : 1,
        indices: [0, this.pattern.length - 1]
      }
    }
  };
  g09 = class g09 extends Bp {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "inverse-exact"
    }
    static get multiRegex() {
      return /^!"(.*)"$/
    }
    static get singleRegex() {
      return /^!(.*)$/
    }
    search(A) {
      let B = A.indexOf(this.pattern) === -1;
      return {
        isMatch: B,
        score: B ? 0 : 1,
        indices: [0, A.length - 1]
      }
    }
  };
  u09 = class u09 extends Bp {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "prefix-exact"
    }
    static get multiRegex() {
      return /^\^"(.*)"$/
    }
    static get singleRegex() {
      return /^\^(.*)$/
    }
    search(A) {
      let Q = A.startsWith(this.pattern);
      return {
        isMatch: Q,
        score: Q ? 0 : 1,
        indices: [0, this.pattern.length - 1]
      }
    }
  };
  m09 = class m09 extends Bp {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "inverse-prefix-exact"
    }
    static get multiRegex() {
      return /^!\^"(.*)"$/
    }
    static get singleRegex() {
      return /^!\^(.*)$/
    }
    search(A) {
      let Q = !A.startsWith(this.pattern);
      return {
        isMatch: Q,
        score: Q ? 0 : 1,
        indices: [0, A.length - 1]
      }
    }
  };
  d09 = class d09 extends Bp {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "suffix-exact"
    }
    static get multiRegex() {
      return /^"(.*)"\$$/
    }
    static get singleRegex() {
      return /^(.*)\$$/
    }
    search(A) {
      let Q = A.endsWith(this.pattern);
      return {
        isMatch: Q,
        score: Q ? 0 : 1,
        indices: [A.length - this.pattern.length, A.length - 1]
      }
    }
  };
  c09 = class c09 extends Bp {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "inverse-suffix-exact"
    }
    static get multiRegex() {
      return /^!"(.*)"\$$/
    }
    static get singleRegex() {
      return /^!(.*)\$$/
    }
    search(A) {
      let Q = !A.endsWith(this.pattern);
      return {
        isMatch: Q,
        score: Q ? 0 : 1,
        indices: [0, A.length - 1]
      }
    }
  };
  eM0 = class eM0 extends Bp {
    constructor(A, {
      location: Q = t6.location,
      threshold: B = t6.threshold,
      distance: G = t6.distance,
      includeMatches: Z = t6.includeMatches,
      findAllMatches: Y = t6.findAllMatches,
      minMatchCharLength: J = t6.minMatchCharLength,
      isCaseSensitive: X = t6.isCaseSensitive,
      ignoreLocation: I = t6.ignoreLocation
    } = {}) {
      super(A);
      this._bitapSearch = new tM0(A, {
        location: Q,
        threshold: B,
        distance: G,
        includeMatches: Z,
        findAllMatches: Y,
        minMatchCharLength: J,
        isCaseSensitive: X,
        ignoreLocation: I
      })
    }
    static get type() {
      return "fuzzy"
    }
    static get multiRegex() {
      return /^"(.*)"$/
    }
    static get singleRegex() {
      return /^(.*)$/
    }
    search(A) {
      return this._bitapSearch.searchIn(A)
    }
  };
  AR0 = class AR0 extends Bp {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "include"
    }
    static get multiRegex() {
      return /^'"(.*)"$/
    }
    static get singleRegex() {
      return /^'(.*)$/
    }
    search(A) {
      let Q = 0,
        B, G = [],
        Z = this.pattern.length;
      while ((B = A.indexOf(this.pattern, Q)) > -1) Q = B + Z, G.push([B, Q - 1]);
      let Y = !!G.length;
      return {
        isMatch: Y,
        score: Y ? 0 : 1,
        indices: G
      }
    }
  };
  nM0 = [h09, AR0, u09, m09, c09, d09, g09, eM0], P09 = nM0.length, SZ7 = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
  vZ7 = new Set([eM0.type, AR0.type]);
  aM0 = [];
  tH1 = {
    AND: "$and",
    OR: "$or"
  }, rM0 = {
    PATH: "$path",
    PATTERN: "$val"
  };
  Vw.version = "7.0.0";
  Vw.createIndex = f09;
  Vw.parseIndex = _Z7;
  Vw.config = t6;
  Vw.parseQuery = l09;
  kZ7(p09)
})
// @from(Ln 401634, Col 0)
function b3A(A) {
  let Q = A;
  return Q = Q.replace(/"(sk-ant[^\s"']{24,})"/g, '"[REDACTED_API_KEY]"'), Q = Q.replace(/(?<![A-Za-z0-9"'])(sk-ant-?[A-Za-z0-9_-]{10,})(?![A-Za-z0-9"'])/g, "[REDACTED_API_KEY]"), Q = Q.replace(/AWS key: "(AWS[A-Z0-9]{20,})"/g, 'AWS key: "[REDACTED_AWS_KEY]"'), Q = Q.replace(/(AKIA[A-Z0-9]{16})/g, "[REDACTED_AWS_KEY]"), Q = Q.replace(/(?<![A-Za-z0-9])(AIza[A-Za-z0-9_-]{35})(?![A-Za-z0-9])/g, "[REDACTED_GCP_KEY]"), Q = Q.replace(/(?<![A-Za-z0-9])([a-z0-9-]+@[a-z0-9-]+\.iam\.gserviceaccount\.com)(?![A-Za-z0-9])/g, "[REDACTED_GCP_SERVICE_ACCOUNT]"), Q = Q.replace(/(["']?x-api-key["']?\s*[:=]\s*["']?)[^"',\s)}\]]+/gi, "$1[REDACTED_API_KEY]"), Q = Q.replace(/(["']?authorization["']?\s*[:=]\s*["']?(bearer\s+)?)[^"',\s)}\]]+/gi, "$1[REDACTED_TOKEN]"), Q = Q.replace(/(AWS[_-][A-Za-z0-9_]+\s*[=:]\s*)["']?[^"',\s)}\]]+["']?/gi, "$1[REDACTED_AWS_VALUE]"), Q = Q.replace(/(GOOGLE[_-][A-Za-z0-9_]+\s*[=:]\s*)["']?[^"',\s)}\]]+["']?/gi, "$1[REDACTED_GCP_VALUE]"), Q = Q.replace(/((API[-_]?KEY|TOKEN|SECRET|PASSWORD)\s*[=:]\s*)["']?[^"',\s)}\]]+["']?/gi, "$1[REDACTED]"), Q
}
// @from(Ln 401639, Col 0)
function cZ7(A) {
  let Q = [];
  for (let B of A) {
    if (B.type !== "user") continue;
    let G = B.message.content;
    if (!Array.isArray(G)) continue;
    for (let Z of G) {
      if (Z.type !== "tool_result") continue;
      let Y = Z.content;
      if (typeof Y === "string") try {
        let J = AQ(Y);
        if (J && typeof J.agentId === "string") Q.push(iz(J.agentId))
      } catch {} else if (Array.isArray(Y)) {
        for (let J of Y)
          if (J.type === "text" && typeof J.text === "string") try {
            let X = AQ(J.text);
            if (X && typeof X.agentId === "string") Q.push(iz(X.agentId))
          } catch {}
      }
    }
  }
  return [...new Set(Q)]
}
// @from(Ln 401662, Col 0)
async function pZ7(A) {
  let Q = await Promise.all(A.map(async (G) => {
      try {
        let Z = await bD1(G);
        if (Z && Z.length > 0) return {
          agentId: G,
          transcript: Z
        };
        return null
      } catch {
        return null
      }
    })),
    B = {};
  for (let G of Q)
    if (G) B[G.agentId] = G.transcript;
  return B
}
// @from(Ln 401681, Col 0)
function n09() {
  return E7A().map((A) => {
    let Q = {
      ...A
    };
    if (Q && typeof Q.error === "string") Q.error = b3A(Q.error);
    return Q
  })
}
// @from(Ln 401691, Col 0)
function o09({
  abortSignal: A,
  messages: Q,
  initialDescription: B,
  onDone: G
}) {
  let [Z, Y] = iO.useState("userInput"), [J, X] = iO.useState(0), [I, D] = iO.useState(B ?? ""), [W, K] = iO.useState(null), [V, F] = iO.useState(null), [H, E] = iO.useState({
    isGit: !1,
    gitState: null
  }), [z, $] = iO.useState(null), O = ZB().columns - 4;
  iO.useEffect(() => {
    async function x() {
      let b = await nq(),
        S = null;
      if (b) S = await li1();
      E({
        isGit: b,
        gitState: S
      })
    }
    x()
  }, []);
  let L = MQ(),
    M = J3("confirm:no", "Confirmation", "Esc"),
    _ = iO.useCallback(async () => {
      Y("submitting"), F(null), K(null);
      let x = n09(),
        S = Qx(Q)?.requestId ?? null,
        u = cZ7(Q),
        f = await pZ7(u),
        AA = {
          latestAssistantMessageId: S,
          message_count: Q.length,
          datetime: new Date().toISOString(),
          description: I,
          platform: l0.platform,
          gitRepo: H.isGit,
          terminal: l0.terminal,
          version: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.7",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-01-13T22:55:21Z"
          }.VERSION,
          transcript: FI(Q),
          errors: x,
          lastApiRequest: rb0(),
          ...Object.keys(f).length > 0 && {
            subagentTranscripts: f
          }
        },
        [n, y] = await Promise.all([nZ7(AA, A), iZ7(I, A)]);
      if ($(y), n.success) {
        if (n.feedbackId) K(n.feedbackId), l("tengu_bug_report_submitted", {
          feedback_id: n.feedbackId,
          last_assistant_message_id: S
        });
        Y("done")
      } else {
        if (n.isZdrOrg) F("Feedback collection is not available for organizations with custom data retention policies.");
        else F("Could not submit feedback. Please try again later.");
        Y("userInput")
      }
    }, [I, H.isGit, Q]),
    j = iO.useCallback(() => {
      if (Z === "done") {
        if (V) G("Error submitting feedback / bug report", {
          display: "system"
        });
        else G("Feedback / bug report submitted", {
          display: "system"
        });
        return
      }
      G("Feedback / bug report cancelled", {
        display: "system"
      })
    }, [Z, V, G]);
  return H2("confirm:no", j, {
    context: "Settings"
  }), J0((x, b) => {
    if (Z === "done") {
      if (b.return && z) {
        let S = lZ7(W ?? "", z, I, n09());
        i7(S)
      }
      if (V) G("Error submitting feedback / bug report", {
        display: "system"
      });
      else G("Feedback / bug report submitted", {
        display: "system"
      });
      return
    }
    if (V && Z !== "userInput") {
      G("Error submitting feedback / bug report", {
        display: "system"
      });
      return
    }
    if (Z === "consent" && (b.return || x === " ")) _()
  }), TB.createElement(TB.Fragment, null, TB.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "permission",
    paddingX: 1,
    paddingBottom: 1,
    gap: 1
  }, TB.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Submit Feedback / Bug Report"), Z === "userInput" && TB.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, TB.createElement(C, null, "Describe the issue below:"), TB.createElement(p4, {
    value: I,
    onChange: (x) => {
      if (D(x), V) F(null)
    },
    columns: O,
    onSubmit: () => Y("consent"),
    onExitMessage: () => G("Feedback cancelled", {
      display: "system"
    }),
    cursorOffset: J,
    onChangeCursorOffset: X
  }), V && TB.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, TB.createElement(C, {
    color: "error"
  }, V), TB.createElement(C, {
    dimColor: !0
  }, "Edit and press Enter to retry, or Esc to cancel"))), Z === "consent" && TB.createElement(T, {
    flexDirection: "column"
  }, TB.createElement(C, null, "This report will include:"), TB.createElement(T, {
    marginLeft: 2,
    flexDirection: "column"
  }, TB.createElement(C, null, "- Your feedback / bug description:", " ", TB.createElement(C, {
    dimColor: !0
  }, I)), TB.createElement(C, null, "- Environment info:", " ", TB.createElement(C, {
    dimColor: !0
  }, l0.platform, ", ", l0.terminal, ", v", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.VERSION)), H.gitState && TB.createElement(C, null, "- Git repo metadata:", " ", TB.createElement(C, {
    dimColor: !0
  }, H.gitState.branchName, H.gitState.commitHash ? `, ${H.gitState.commitHash.slice(0,7)}` : "", H.gitState.remoteUrl ? ` @ ${H.gitState.remoteUrl}` : "", !H.gitState.isHeadOnRemote && ", not synced", !H.gitState.isClean && ", has local changes")), TB.createElement(C, null, "- Current session transcript")), TB.createElement(T, {
    marginTop: 1
  }, TB.createElement(C, {
    wrap: "wrap",
    dimColor: !0
  }, "We will use your feedback to debug related issues or to improve", " ", "Claude Code's functionality (eg. to reduce the risk of bugs occurring in the future).")), TB.createElement(T, {
    marginTop: 1
  }, TB.createElement(C, null, "Press ", TB.createElement(C, {
    bold: !0
  }, "Enter"), " to confirm and submit."))), Z === "submitting" && TB.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, TB.createElement(C, null, "Submitting report…")), Z === "done" && TB.createElement(T, {
    flexDirection: "column"
  }, V ? TB.createElement(C, {
    color: "error"
  }, V) : TB.createElement(C, {
    color: "success"
  }, "Thank you for your report!"), W && TB.createElement(C, {
    dimColor: !0
  }, "Feedback ID: ", W), TB.createElement(T, {
    marginTop: 1
  }, TB.createElement(C, null, "Press "), TB.createElement(C, {
    bold: !0
  }, "Enter "), TB.createElement(C, null, "to open your browser and draft a GitHub issue, or any other key to close.")))), TB.createElement(T, {
    marginLeft: 1
  }, TB.createElement(C, {
    dimColor: !0
  }, L.pending ? TB.createElement(TB.Fragment, null, "Press ", L.keyName, " again to exit") : Z === "userInput" ? TB.createElement(TB.Fragment, null, "Enter to continue · ", M, " to cancel") : Z === "consent" ? TB.createElement(TB.Fragment, null, "Enter to submit · ", M, " to cancel") : null)))
}
// @from(Ln 401875, Col 0)
function lZ7(A, Q, B, G) {
  let Z = b3A(Q),
    Y = b3A(B),
    J = encodeURIComponent(`**Bug Description**
${Y}

**Environment Info**
- Platform: ${l0.platform}
- Terminal: ${l0.terminal}
- Version: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION||"unknown"}
- Feedback ID: ${A}

**Errors**
\`\`\`json
`),
    X = encodeURIComponent("\n```\n"),
    I = encodeURIComponent(`
**Note:** Error logs were truncated.
`),
    D = eA(G),
    W = `${i09}/new?title=${encodeURIComponent(Z)}&labels=user-reported,bug&body=`,
    K = dZ7 - W.length - J.length - X.length - I.length,
    V = "",
    F = encodeURIComponent(D);
  if (F.length <= K) V = J + F + X;
  else {
    let H = 0,
      E = D.length,
      z = "";
    while (H < E) {
      let O = Math.floor((H + E + 1) / 2),
        L = D.substring(0, O);
      if (encodeURIComponent(L).length <= K) H = O, z = L;
      else E = O - 1
    }
    let $ = encodeURIComponent(z);
    V = J + $ + X + I
  }
  return `${i09}/new?title=${encodeURIComponent(Z)}&body=${V}&labels=user-reported,bug`
}
// @from(Ln 401915, Col 0)
async function iZ7(A, Q) {
  try {
    let B = await CF({
        systemPrompt: ["Generate a concise, technical issue title (max 80 chars) for a public GitHub issue based on this bug report for Claude Code.", "Claude Code is an agentic coding CLI based on the Anthropic API.", "The title should:", "- Include the type of issue [Bug] or [Feature Request] as the first thing in the title", "- Be concise, specific and descriptive of the actual problem", "- Use technical terminology appropriate for a software issue", '- For error messages, extract the key error (e.g., "Missing Tool Result Block" rather than the full message)', "- Be direct and clear for developers to understand the problem", '- If you cannot determine a clear issue, use "Bug Report: [brief description]"', "- Any LLM API errors are from the Anthropic API, not from any other model provider", "Your response will be directly used as the title of the Github issue, and as such should not contain any other commentary or explaination", 'Examples of good titles include: "[Bug] Auto-Compact triggers to soon", "[Bug] Anthropic API Error: Missing Tool Result Block", "[Bug] Error: Invalid Model Name for Opus"'],
        userPrompt: A,
        signal: Q,
        options: {
          hasAppendSystemPrompt: !1,
          toolChoice: void 0,
          isNonInteractiveSession: !1,
          agents: [],
          querySource: "feedback",
          mcpTools: []
        }
      }),
      G = B.message.content[0]?.type === "text" ? B.message.content[0].text : "Bug Report";
    if (G.startsWith(tW)) return a09(A);
    return G
  } catch (B) {
    return e(B instanceof Error ? B : Error(String(B))), a09(A)
  }
}
// @from(Ln 401938, Col 0)
function a09(A) {
  let Q = A.split(`
`)[0] || "";
  if (Q.length <= 60 && Q.length > 5) return Q;
  let B = Q.slice(0, 60);
  if (Q.length > 60) {
    let G = B.lastIndexOf(" ");
    if (G > 30) B = B.slice(0, G);
    B += "..."
  }
  return B.length < 10 ? "Bug Report" : B
}
// @from(Ln 401951, Col 0)
function AE1(A) {
  if (A instanceof Error) {
    let Q = Error(b3A(A.message));
    if (A.stack) Q.stack = b3A(A.stack);
    e(Q)
  } else {
    let Q = b3A(String(A));
    e(Error(Q))
  }
}
// @from(Ln 401961, Col 0)
async function nZ7(A, Q) {
  try {
    await xR();
    let B = CJ();
    if (B.error) return {
      success: !1
    };
    let G = {
        "Content-Type": "application/json",
        "User-Agent": gn(),
        ...B.headers
      },
      Z = await xQ.post("https://api.anthropic.com/api/claude_cli_feedback", {
        content: eA(A)
      }, {
        headers: G,
        timeout: 30000,
        signal: Q
      });
    if (Z.status === 200) {
      let Y = Z.data;
      if (Y?.feedback_id) return {
        success: !0,
        feedbackId: Y.feedback_id
      };
      return AE1(Error("Failed to submit feedback: request did not return feedback_id")), {
        success: !1
      }
    }
    return AE1(Error("Failed to submit feedback:" + Z.status)), {
      success: !1
    }
  } catch (B) {
    if (xQ.isCancel(B)) return {
      success: !1
    };
    if (xQ.isAxiosError(B) && B.response?.status === 403) {
      let G = B.response.data;
      if (G?.error?.type === "permission_error" && G?.error?.message?.includes("Custom data retention settings")) return AE1(Error("Cannot submit feedback because custom data retention settings are enabled")), {
        success: !1,
        isZdrOrg: !0
      }
    }
    return AE1(B), {
      success: !1
    }
  }
}
// @from(Ln 402009, Col 4)
TB
// @from(Ln 402009, Col 8)
iO
// @from(Ln 402009, Col 12)
dZ7 = 7250
// @from(Ln 402010, Col 2)
i09 = "https://github.com/anthropics/claude-code/issues"
// @from(Ln 402011, Col 4)
QR0 = w(() => {
  fA();
  c6();
  NX();
  IY();
  v1();
  p3();
  ZI();
  P4();
  qz();
  Q2();
  Z0();
  nY();
  XO();
  TN();
  E9();
  j5();
  tQ();
  C0();
  d4();
  A0();
  TB = c(QA(), 1), iO = c(QA(), 1)
})
// @from(Ln 402034, Col 4)
aZ7
// @from(Ln 402034, Col 9)
r09
// @from(Ln 402035, Col 4)
s09 = w(() => {
  fA();
  aZ7 = c(QA(), 1), r09 = c(QA(), 1)
})
// @from(Ln 402039, Col 4)
t09
// @from(Ln 402039, Col 9)
QE1
// @from(Ln 402040, Col 4)
e09 = w(() => {
  fA();
  uH0();
  IY();
  v1();
  tQ();
  CzA();
  p3();
  ZI();
  P4();
  Z0();
  E9();
  QR0();
  lD();
  oN();
  t4();
  tQ();
  x6A();
  C0();
  d4();
  wc();
  az();
  T1();
  eF1();
  nz();
  A0();
  s09();
  HY();
  Q2();
  t09 = c(QA(), 1), QE1 = c(QA(), 1)
})
// @from(Ln 402071, Col 4)
rZ7
// @from(Ln 402072, Col 4)
AQ9 = w(() => {
  e09();
  rZ7 = c(QA(), 1)
})
// @from(Ln 402077, Col 0)
function sZ7(A, Q, B, G = "") {
  return ZR0.createElement(o09, {
    abortSignal: Q,
    messages: B,
    initialDescription: G,
    onDone: A
  })
}
// @from(Ln 402085, Col 4)
ZR0
// @from(Ln 402085, Col 9)
tZ7
// @from(Ln 402085, Col 14)
QQ9
// @from(Ln 402086, Col 4)
BQ9 = w(() => {
  QR0();
  fQ();
  ZR0 = c(QA(), 1);
  tZ7 = {
    aliases: ["bug"],
    type: "local-jsx",
    name: "feedback",
    description: "Submit feedback about Claude Code",
    argumentHint: "[report]",
    isEnabled: () => !(a1(process.env.CLAUDE_CODE_USE_BEDROCK) || a1(process.env.CLAUDE_CODE_USE_VERTEX) || a1(process.env.CLAUDE_CODE_USE_FOUNDRY) || process.env.DISABLE_FEEDBACK_COMMAND || process.env.DISABLE_BUG_COMMAND || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC),
    isHidden: !1,
    async call(A, {
      abortController: Q,
      messages: B
    }, G) {
      let Z = G || "";
      return sZ7(A, Q.signal, B, Z)
    },
    userFacingName() {
      return "feedback"
    }
  }, QQ9 = tZ7
})
// @from(Ln 402110, Col 4)
YR0 = {}
// @from(Ln 402115, Col 4)
BE1
// @from(Ln 402115, Col 9)
eZ7
// @from(Ln 402115, Col 14)
AY7
// @from(Ln 402116, Col 4)
JR0 = w(() => {
  try {
    BE1 = (() => {
      throw new Error("Cannot require module " + "../../file-index.node");
    })()
  } catch (A) {
    BE1 = null
  }
  eZ7 = BE1?.FileIndex, AY7 = BE1?.FileIndex
})
// @from(Ln 402127, Col 0)
async function QY7() {
  if (GE1) return null;
  if (shA) return shA;
  if (LG()) try {
    return shA = new(await Promise.resolve().then(() => (JR0(), YR0))).FileIndex, shA
  } catch (A) {
    return GE1 = !0, k(`[FileIndex] Rust module unavailable, falling back to Fuse.js: ${A instanceof Error?A.message:String(A)}`), e(A), null
  } else return GE1 = !0, k("[FileIndex] Not in bundled mode, using Fuse.js fallback"), null
}
// @from(Ln 402137, Col 0)
function JQ9() {
  shA = null, GE1 = !1, wzA = null, LzA = [], f3A = null, VR0 = 0, thA = null, IR0 = null, ZE1 = null, qzA = [], DR0 = null, WR0 = null
}
// @from(Ln 402140, Col 0)
async function GY7() {
  let A = o1();
  if (IR0 === A && thA !== null) return thA;
  return thA = (await J2("git", ["rev-parse", "--git-dir"], {
    timeout: 2000,
    cwd: A
  })).code === 0, IR0 = A, thA
}
// @from(Ln 402149, Col 0)
function GQ9(A, Q, B) {
  if (B === Q) return A;
  return A.map((G) => {
    let Z = JW.join(Q, G);
    return JW.relative(B, Z)
  })
}
// @from(Ln 402157, Col 0)
function ZY7(A) {
  if (A.length === 0) return;
  let Q = KR0(A);
  if (wzA && qzA.length > 0) {
    let B = KR0(qzA),
      G = [...qzA, ...B, ...A, ...Q];
    try {
      wzA.loadFromFileList(G), k(`[FileIndex] rebuilt Rust index with ${qzA.length} tracked + ${A.length} untracked files`)
    } catch (Z) {
      k(`[FileIndex] failed to rebuild Rust index: ${Z}`)
    }
  } else {
    let B = [...A, ...Q],
      G = new Set(LzA);
    for (let Z of B)
      if (!G.has(Z)) LzA.push(Z);
    k(`[FileIndex] merged ${A.length} untracked files into JS cache`)
  }
}
// @from(Ln 402177, Col 0)
function ZQ9(A, Q) {
  let B = `${A}:${Q}`;
  if (WR0 === B) return DR0;
  let G = vA(),
    Z = [".ignore", ".rgignore"],
    Y = [...new Set([A, Q])],
    J = YQ9.default(),
    X = !1;
  for (let D of Y)
    for (let W of Z) {
      let K = JW.join(D, W);
      if (G.existsSync(K)) try {
        let V = G.readFileSync(K, {
          encoding: "utf8"
        });
        J.add(V), X = !0, k(`[FileIndex] loaded ignore patterns from ${K}`)
      } catch {}
    }
  let I = X ? J : null;
  return DR0 = I, WR0 = B, I
}
// @from(Ln 402198, Col 0)
async function YY7(A, Q) {
  let B = Date.now();
  if (k("[FileIndex] getFilesUsingGit called"), !await GY7()) return k("[FileIndex] not a git repo, returning null"), null;
  try {
    let G = cOA(o1());
    if (!G) return k("[FileIndex] git rev-parse --show-toplevel failed, falling back to ripgrep"), null;
    let Z = o1(),
      Y = Date.now(),
      J = await J2("git", ["ls-files", "--recurse-submodules"], {
        timeout: 5000,
        abortSignal: A,
        cwd: Z
      });
    if (k(`[FileIndex] git ls-files (tracked) took ${Date.now()-Y}ms`), J.code !== 0) return k(`[FileIndex] git ls-files failed (code=${J.code}, stderr=${J.stderr}), falling back to ripgrep`), null;
    let X = J.stdout.trim().split(`
`).filter(Boolean),
      I = EQ(),
      D = GQ9(X, G, I),
      W = ZQ9(G, Z);
    if (W) {
      let V = D.length;
      D = W.filter(D), k(`[FileIndex] applied ignore patterns: ${V} -> ${D.length} files`)
    }
    qzA = D;
    let K = Date.now() - B;
    if (k(`[FileIndex] git ls-files: ${D.length} tracked files in ${K}ms`), l("tengu_file_suggestions_git_ls_files", {
        file_count: D.length,
        tracked_count: D.length,
        untracked_count: 0,
        duration_ms: K
      }), !ZE1) ZE1 = J2("git", Q ? ["ls-files", "--others", "--exclude-standard"] : ["ls-files", "--others"], {
      timeout: 1e4,
      cwd: Z
    }).then((F) => {
      if (F.code === 0) {
        let H = F.stdout.trim().split(`
`).filter(Boolean),
          E = EQ(),
          z = GQ9(H, G, E),
          $ = ZQ9(G, Z);
        if ($ && z.length > 0) {
          let O = z.length;
          z = $.filter(z), k(`[FileIndex] applied ignore patterns to untracked: ${O} -> ${z.length} files`)
        }
        k(`[FileIndex] background untracked fetch: ${z.length} files`), ZY7(z)
      }
    }).catch((F) => {
      k(`[FileIndex] background untracked fetch failed: ${F}`)
    }).finally(() => {
      ZE1 = null
    });
    return D
  } catch (G) {
    return k(`[FileIndex] git ls-files error: ${G instanceof Error?G.message:String(G)}`), null
  }
}
// @from(Ln 402255, Col 0)
function KR0(A) {
  let Q = new Set;
  return A.forEach((B) => {
    let G = JW.parse(B).root,
      Z = JW.dirname(B);
    while (Z !== "." && Z !== G && !Q.has(Z)) Q.add(Z), Z = JW.dirname(Z)
  }), [...Q].map((B) => B + JW.sep)
}
// @from(Ln 402263, Col 0)
async function JY7(A) {
  return (await Promise.all(DQ9.map((B) => bd(B, A)))).flatMap((B) => B.map((G) => G.filePath))
}
// @from(Ln 402266, Col 0)
async function XY7(A, Q) {
  k(`[FileIndex] getProjectFiles called, respectGitignore=${Q}`);
  let B = await YY7(A, Q);
  if (B !== null) return k(`[FileIndex] using git ls-files result (${B.length} files)`), B;
  k("[FileIndex] git ls-files returned null, falling back to ripgrep");
  let G = Date.now(),
    Z = ["--files", "--follow", "--hidden", "--glob", "!.git/"];
  if (!Q) Z.push("--no-ignore-vcs");
  let J = (await gy(Z, ".", A)).map((I) => JW.relative(EQ(), I)),
    X = Date.now() - G;
  return k(`[FileIndex] ripgrep: ${J.length} files in ${X}ms`), l("tengu_file_suggestions_ripgrep", {
    file_count: J.length,
    duration_ms: X
  }), J
}
// @from(Ln 402281, Col 0)
async function IY7() {
  let A = c9(),
    Q = setTimeout(() => {
      A.abort()
    }, 1e4);
  try {
    let B = r3(),
      G = L1(),
      Z = B.respectGitignore ?? G.respectGitignore ?? !0,
      Y = o1(),
      [J, X] = await Promise.all([XY7(A.signal, Z), JY7(Y)]),
      I = [...J, ...X],
      W = [...KR0(I), ...I],
      K = [],
      V = await QY7();
    if (V) try {
      V.loadFromFileList(W)
    } catch (F) {
      k(`[FileIndex] Failed to load Rust index, using Fuse.js fallback: ${F instanceof Error?F.message:String(F)}`), e(F), K = W
    } else K = W;
    return {
      fileIndex: V,
      fileList: K
    }
  } catch (B) {
    return e(B instanceof Error ? B : Error(String(B))), {
      fileIndex: null,
      fileList: []
    }
  } finally {
    clearTimeout(Q)
  }
}
// @from(Ln 402315, Col 0)
function DY7(A, Q) {
  let B = Math.min(A.length, Q.length),
    G = 0;
  while (G < B && A[G] === Q[G]) G++;
  return A.substring(0, G)
}
// @from(Ln 402322, Col 0)
function XQ9(A) {
  if (A.length === 0) return "";
  let Q = A.map((G) => G.displayText),
    B = Q[0];
  for (let G = 1; G < Q.length; G++) {
    let Z = Q[G];
    if (B = DY7(B, Z), B === "") return ""
  }
  return B
}
// @from(Ln 402333, Col 0)
function ehA(A, Q) {
  return {
    id: `file-${A}`,
    displayText: A,
    metadata: Q !== void 0 ? {
      score: Q
    } : void 0
  }
}
// @from(Ln 402342, Col 0)
async function WY7(A, Q, B) {
  if (A) try {
    return A.search(B, NzA).map((D) => ehA(D.path, D.score))
  } catch (I) {
    k(`[FileIndex] Rust search failed, falling back to Fuse.js: ${I instanceof Error?I.message:String(I)}`), e(I)
  }
  k("[FileIndex] Using Fuse.js fallback for search");
  let G = [...new Set(Q)];
  if (!B) {
    let I = new Set;
    for (let D of G) {
      let W = D.split(JW.sep)[0];
      if (W) {
        if (I.add(W), I.size >= NzA) break
      }
    }
    return [...I].sort().map(ehA)
  }
  let Z = G.map((I) => {
      return {
        path: I,
        filename: JW.basename(I),
        testPenalty: I.includes("test") ? 1 : 0
      }
    }),
    Y = B.lastIndexOf(JW.sep);
  if (Y > 2) Z = Z.filter((I) => {
    return I.path.substring(0, Y).startsWith(B.substring(0, Y))
  });
  let X = new Vw(Z, {
    includeScore: !0,
    threshold: 0.5,
    keys: [{
      name: "path",
      weight: 1
    }, {
      name: "filename",
      weight: 2
    }]
  }).search(B, {
    limit: NzA
  });
  return X = X.sort((I, D) => {
    if (I.score === void 0 || D.score === void 0) return 0;
    if (Math.abs(I.score - D.score) > 0.05) return I.score - D.score;
    return I.item.testPenalty - D.item.testPenalty
  }), X.map((I) => I.item.path).slice(0, NzA).map(ehA)
}
// @from(Ln 402391, Col 0)
function XR0() {
  if (!f3A) f3A = IY7().then((A) => {
    return wzA = A.fileIndex, LzA = A.fileList, VR0 = Date.now(), f3A = null, A
  }).catch((A) => {
    return k(`[FileIndex] Cache refresh failed: ${A instanceof Error?A.message:String(A)}`), e(A), f3A = null, {
      fileIndex: null,
      fileList: []
    }
  })
}
// @from(Ln 402401, Col 0)
async function KY7() {
  let A = vA(),
    Q = o1();
  try {
    return A.readdirSync(Q).map((G) => {
      let Z = JW.join(Q, G.name),
        Y = JW.relative(Q, Z);
      return G.isDirectory() ? Y + JW.sep : Y
    })
  } catch (B) {
    return e(B), []
  }
}
// @from(Ln 402414, Col 0)
async function IQ9(A, Q = !1) {
  if (!A && !Q) return [];
  if (r3().fileSuggestion?.type === "command") {
    let B = {
      ...jE(),
      query: A
    };
    return (await Qq0(B)).slice(0, NzA).map(ehA)
  }
  if (A === "" || A === "." || A === "./") {
    let B = await KY7();
    return XR0(), B.slice(0, NzA).map(ehA)
  }
  try {
    let G = Date.now() - VR0 > BY7;
    if (!wzA && LzA.length === 0) {
      if (XR0(), f3A) await f3A
    } else if (G) XR0();
    let Z = A,
      Y = "." + JW.sep;
    if (A.startsWith(Y)) Z = A.substring(2);
    if (Z.startsWith("~")) Z = Y4(Z);
    return await WY7(wzA, LzA, Z)
  } catch (B) {
    return e(B), []
  }
}
// @from(Ln 402442, Col 0)
function YE1(A, Q, B, G, Z, Y) {
  let J = typeof A === "string" ? A : A.displayText,
    X = Q.substring(0, G) + J + Q.substring(G + B.length);
  Z(X);
  let I = G + J.length;
  Y(I)
}
// @from(Ln 402449, Col 4)
YQ9
// @from(Ln 402449, Col 9)
shA = null
// @from(Ln 402450, Col 2)
GE1 = !1
// @from(Ln 402451, Col 2)
wzA = null
// @from(Ln 402452, Col 2)
LzA
// @from(Ln 402452, Col 7)
f3A = null
// @from(Ln 402453, Col 2)
VR0 = 0
// @from(Ln 402454, Col 2)
BY7 = 60000
// @from(Ln 402455, Col 2)
thA = null
// @from(Ln 402456, Col 2)
IR0 = null
// @from(Ln 402457, Col 2)
ZE1 = null
// @from(Ln 402458, Col 2)
qzA
// @from(Ln 402458, Col 7)
DR0 = null
// @from(Ln 402459, Col 2)
WR0 = null
// @from(Ln 402460, Col 2)
NzA = 15
// @from(Ln 402461, Col 4)
JE1 = w(() => {
  rhA();
  C0();
  v1();
  DQ();
  V2();
  kd();
  oZ();
  GQ();
  uy();
  iZ();
  T1();
  ZI();
  zO();
  GB();
  t4();
  Z0();
  YQ9 = c(VyA(), 1);
  LzA = [], qzA = []
})
// @from(Ln 402482, Col 0)
function XE1() {
  ZV.cache.clear?.(), OF.cache.clear?.(), KD0.cache.clear?.(), GV.cache.clear?.(), JQ9(), lt()
}
// @from(Ln 402485, Col 0)
async function IE1({
  setMessages: A,
  readFileState: Q,
  getAppState: B,
  setAppState: G
}) {
  if (await tU0("clear", {
      getAppState: B,
      setAppState: G
    }), !Tz()) await sI();
  if (A(() => []), XE1(), DO(EQ()), Q.clear(), G) G((Y) => ({
    ...Y,
    fileHistory: {
      snapshots: [],
      trackedFiles: new Set
    },
    mcp: {
      clients: [],
      tools: [],
      commands: [],
      resources: {}
    }
  }));
  J12(), wb0(), await wj();
  let Z = await WU("clear");
  if (Z.length > 0) A(() => Z)
}
// @from(Ln 402512, Col 4)
VY7
// @from(Ln 402512, Col 9)
WQ9
// @from(Ln 402513, Col 4)
DE1 = w(() => {
  WV();
  OS();
  nz();
  Xd();
  sBA();
  C0();
  Vb();
  d4();
  Gt();
  zO();
  JZ();
  JE1();
  UF();
  VY7 = {
    type: "local",
    name: "clear",
    description: "Clear conversation history and free up context",
    aliases: ["reset", "new"],
    isEnabled: () => !0,
    isHidden: !1,
    supportsNonInteractive: !1,
    async call(A, Q) {
      return T9("clear"), await IE1(Q), {
        type: "text",
        value: ""
      }
    },
    userFacingName() {
      return "clear"
    }
  }, WQ9 = VY7
})
// @from(Ln 402546, Col 4)
FY7
// @from(Ln 402546, Col 9)
KQ9
// @from(Ln 402547, Col 4)
VQ9 = w(() => {
  d4();
  C0();
  EO();
  FY7 = {
    type: "local",
    name: "color",
    description: "Set the prompt bar color for this session",
    isEnabled: () => !1,
    isHidden: !1,
    supportsNonInteractive: !1,
    argumentHint: "<color>",
    async call(A, Q) {
      if (!A || A.trim() === "") return {
        type: "text",
        value: `Please provide a color. Available colors: ${SN.join(", ")}`
      };
      let B = A.trim().toLowerCase();
      if (!SN.includes(B)) {
        let Y = SN.join(", ");
        return {
          type: "text",
          value: `Invalid color "${B}". Available colors: ${Y}`
        }
      }
      let G = q0(),
        Z = uz();
      return await FQ9(G, B, Z), Q.setAppState((Y) => ({
        ...Y,
        standaloneAgentContext: {
          ...Y.standaloneAgentContext,
          name: Y.standaloneAgentContext?.name ?? "",
          color: B
        }
      })), {
        type: "text",
        value: `Session color set to: ${B}`
      }
    },
    userFacingName() {
      return "color"
    }
  }, KQ9 = FY7
})
// @from(Ln 402591, Col 4)
HQ9 = w(() => {
  VEA();
  i51()
})
// @from(Ln 402595, Col 0)
async function Gp(A) {
  let Q = $Q(),
    B = HY7[Q];
  for (let G of B) try {
    return await e5(G, {
      input: A,
      shell: !0,
      reject: !0
    }), !0
  } catch (Z) {
    e(Error(`Failed to execute clipboard command "${G}": ${Z}`));
    continue
  }
  return e(Error(`Failed to copy to clipboard on ${Q}`)), !1
}
// @from(Ln 402611, Col 0)
function AgA() {
  let A = $Q();
  return {
    macos: "Failed to copy to clipboard. Make sure the `pbcopy` command is available on your system and try again.",
    windows: "Failed to copy to clipboard. Make sure the `clip` command is available on your system and try again.",
    wsl: "Failed to copy to clipboard. Make sure the `clip.exe` command is available in your WSL environment and try again.",
    linux: "Failed to copy to clipboard. Make sure `xclip` or `wl-copy` is installed on your system and try again.",
    unknown: "Failed to copy to clipboard. Make sure `xclip` or `wl-copy` is installed on your system and try again."
  } [A]
}
// @from(Ln 402621, Col 4)
HY7
// @from(Ln 402622, Col 4)
OzA = w(() => {
  Vq();
  v1();
  c3();
  HY7 = {
    macos: ["pbcopy"],
    linux: ["xclip -selection clipboard", "wl-copy"],
    wsl: ["clip.exe"],
    windows: ["clip"],
    unknown: ["xclip -selection clipboard", "wl-copy"]
  }
})
// @from(Ln 402634, Col 4)
EQ9 = w(() => {
  OzA();
  tQ();
  JZ()
})
// @from(Ln 402639, Col 4)
zQ9 = w(() => {
  VEA();
  i51()
})
// @from(Ln 402643, Col 4)
EY7
// @from(Ln 402643, Col 9)
$Q9
// @from(Ln 402644, Col 4)
CQ9 = w(() => {
  OS();
  nz();
  O6A();
  N3A();
  tF1();
  KhA();
  v1();
  Z3();
  tY1();
  fQ();
  JZ();
  NX();
  EY7 = {
    type: "local",
    name: "compact",
    description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
    isEnabled: () => !a1(process.env.DISABLE_COMPACT),
    isHidden: !1,
    supportsNonInteractive: !0,
    argumentHint: "<optional custom summarization instructions>",
    async call(A, Q) {
      T9("compact");
      let {
        abortController: B,
        messages: G
      } = Q;
      if (G.length === 0) throw Error("No messages to compact");
      let Z = A.trim();
      try {
        if (!Z) {
          let K = await sF1(G, Q.agentId);
          if (K) {
            ZV.cache.clear?.(), GV.cache.clear?.();
            let V = f4A("tip"),
              F = BN("app:toggleTranscript", "Global", "ctrl+o"),
              H = [...Q.options.verbose ? [] : [`(${F} to see full summary)`], ...V ? [V] : []];
            return {
              type: "compact",
              compactionResult: K,
              displayText: I1.dim("Compacted " + H.join(`
`))
            }
          }
        }
        let J = (await lc(G, void 0, Q)).messages,
          X = await cF1(J, Q, !1, Z);
        oEA(void 0), ZV.cache.clear?.(), GV.cache.clear?.();
        let I = f4A("tip"),
          D = BN("app:toggleTranscript", "Global", "ctrl+o"),
          W = [...Q.options.verbose ? [] : [`(${D} to see full summary)`], ...X.userDisplayMessage ? [X.userDisplayMessage] : [], ...I ? [I] : []];
        return {
          type: "compact",
          compactionResult: X,
          displayText: I1.dim("Compacted " + W.join(`
`))
        }
      } catch (Y) {
        if (B.signal.aborted) throw Error("Compaction canceled.");
        else if (Y instanceof Error && Y.message === DhA) throw Error(DhA);
        else throw e(Y instanceof Error ? Y : Error(String(Y))), Error(`Error during compaction: ${Y}`)
      }
    },
    userFacingName() {
      return "compact"
    }
  }, $Q9 = EY7
})
// @from(Ln 402713, Col 0)
function UQ9({
  context: A,
  flat: Q
} = {}) {
  let B = GV(),
    G = [];
  if (A?.readFileState) FS(A.readFileState).forEach((J) => {
    let X = A.readFileState.get(J);
    if (X && J.endsWith("/CLAUDE.md") && !B.some((I) => I.path === J)) G.push({
      path: J,
      content: X.content,
      type: "Project",
      isNested: !0
    })
  });
  let Z = [...B, ...G];
  if (Z.length === 0) return null;
  if (Q) return XW.createElement(T, {
    flexDirection: "row",
    columnGap: 1,
    flexWrap: "wrap"
  }, Z.map((J, X) => {
    let I = k6(J.path),
      D = J.isNested ? "nested" : PL0(J.type),
      W = X < Z.length - 1 ? "," : "";
    return XW.createElement(T, {
      key: X,
      flexDirection: "row",
      flexShrink: 0
    }, XW.createElement(C, null, D, " "), XW.createElement(C, {
      dimColor: !0
    }, "(", I, ")"), XW.createElement(C, null, W))
  }));
  let Y = new Map;
  return XW.createElement(T, {
    flexDirection: "column"
  }, Z.map((J, X) => {
    let I = k6(J.path),
      D = J.isNested ? "nested: " : `${PL0(J.type)}: `,
      W = J.parent ? (Y.get(J.parent) ?? 0) + 1 : 0;
    if (Y.set(J.path, W), W === 0) return XW.createElement(C, {
      key: X
    }, XW.createElement(C, {
      dimColor: !0
    }, " L "), `${D}${I}`);
    else {
      let K = "  ".repeat(W - 1);
      return XW.createElement(C, {
        key: X
      }, " ".repeat(D.length + 2), K, XW.createElement(C, {
        dimColor: !0
      }, " L "), I)
    }
  }))
}
// @from(Ln 402768, Col 4)
XW
// @from(Ln 402769, Col 4)
qQ9 = w(() => {
  fA();
  nz();
  y9();
  SL0();
  pC();
  XW = c(QA(), 1)
})
// @from(Ln 402784, Col 0)
function VE1() {
  return process.env.XDG_STATE_HOME ?? KE1(WE1(), ".local", "state")
}
// @from(Ln 402788, Col 0)
function NQ9() {
  return process.env.XDG_CACHE_HOME ?? KE1(WE1(), ".cache")
}
// @from(Ln 402792, Col 0)
function wQ9() {
  return process.env.XDG_DATA_HOME ?? KE1(WE1(), ".local", "share")
}
// @from(Ln 402796, Col 0)
function LQ9() {
  return KE1(WE1(), ".local", "bin")
}
// @from(Ln 402799, Col 4)
FR0 = () => {}
// @from(Ln 402809, Col 0)
async function UY7(A = "latest", Q, B) {
  let G = Date.now();
  try {
    let Z = await xQ.get(`${Q}/${A}`, {
        timeout: 30000,
        responseType: "text",
        ...B
      }),
      Y = Date.now() - G;
    return l("tengu_version_check_success", {
      latency_ms: Y
    }), Z.data.trim()
  } catch (Z) {
    let Y = Date.now() - G,
      J = Z instanceof Error ? Z.message : String(Z),
      X;
    if (xQ.isAxiosError(Z) && Z.response) X = Z.response.status;
    l("tengu_version_check_failure", {
      latency_ms: Y,
      http_status: X,
      is_timeout: J.includes("timeout")
    });
    let I = Error(`Failed to fetch version from ${Q}/${A}: ${J}`);
    throw e(I), OQ9.captureException(I), I
  }
}
// @from(Ln 402835, Col 0)
async function ER0(A) {
  if (/^v?\d+\.\d+\.\d+(-\S+)?$/.test(A)) return A.startsWith("v") ? A.slice(1) : A;
  let Q = A;
  if (Q !== "stable" && Q !== "latest") throw Error(`Invalid channel: ${A}. Use 'stable' or 'latest'`);
  return UY7(Q, MQ9)
}
// @from(Ln 402841, Col 0)
async function NY7(A, Q, B, G = {}) {
  let Z;
  for (let Y = 1; Y <= HR0; Y++) {
    let J = new AbortController,
      X, I = () => {
        if (X) clearTimeout(X), X = void 0
      },
      D = () => {
        I(), X = setTimeout(() => {
          J.abort()
        }, qY7)
      };
    try {
      D();
      let W = await xQ.get(A, {
        timeout: 300000,
        responseType: "arraybuffer",
        signal: J.signal,
        onDownloadProgress: () => {
          D()
        },
        ...G
      });
      I();
      let K = $Y7("sha256");
      K.update(W.data);
      let V = K.digest("hex");
      if (V !== Q) throw Error(`Checksum mismatch: expected ${Q}, got ${V}`);
      (await import("fs")).writeFileSync(B, Buffer.from(W.data)), CY7(B, 493);
      return
    } catch (W) {
      I();
      let K = xQ.isCancel(W);
      if (K) Z = new RQ9;
      else Z = W instanceof Error ? W : Error(String(W));
      if (K && Y < HR0) {
        k(`Download stalled on attempt ${Y}/${HR0}, retrying...`), await new Promise((V) => setTimeout(V, 1000));
        continue
      }
      throw Z
    }
  }
  throw Z ?? Error("Download failed after all retries")
}
// @from(Ln 402885, Col 0)
async function wY7(A, Q, B, G) {
  let Z = vA();
  if (Z.existsSync(Q)) Z.rmSync(Q, {
    recursive: !0,
    force: !0
  });
  let Y = Zp(),
    J = Date.now();
  l("tengu_binary_download_attempt", {});
  let X;
  try {
    X = (await xQ.get(`${B}/${A}/manifest.json`, {
      timeout: 1e4,
      responseType: "json",
      ...G
    })).data
  } catch (F) {
    let H = Date.now() - J,
      E = F instanceof Error ? F.message : String(F),
      z;
    if (xQ.isAxiosError(F) && F.response) z = F.response.status;
    throw l("tengu_binary_manifest_fetch_failure", {
      latency_ms: H,
      http_status: z,
      is_timeout: E.includes("timeout")
    }), e(Error(`Failed to fetch manifest from ${B}/${A}/manifest.json: ${E}`)), F
  }
  let I = X.platforms[Y];
  if (!I) throw l("tengu_binary_platform_not_found", {}), Error(`Platform ${Y} not found in manifest for version ${A}`);
  let D = I.checksum,
    W = FE1(Y),
    K = `${B}/${A}/${Y}/${W}`;
  Z.mkdirSync(Q);
  let V = zY7(Q, W);
  try {
    await NY7(K, D, V, G || {});
    let F = Date.now() - J;
    l("tengu_binary_download_success", {
      latency_ms: F
    })
  } catch (F) {
    let H = Date.now() - J,
      E = F instanceof Error ? F.message : String(F),
      z;
    if (xQ.isAxiosError(F) && F.response) z = F.response.status;
    throw l("tengu_binary_download_failure", {
      latency_ms: H,
      http_status: z,
      is_timeout: E.includes("timeout"),
      is_checksum_mismatch: E.includes("Checksum mismatch")
    }), e(Error(`Failed to download binary from ${K}: ${E}`)), F
  }
}
// @from(Ln 402938, Col 0)
async function _Q9(A, Q) {
  return await wY7(A, Q, MQ9), "binary"
}
// @from(Ln 402941, Col 4)
OQ9
// @from(Ln 402941, Col 9)
MQ9 = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"
// @from(Ln 402942, Col 2)
qY7 = 60000
// @from(Ln 402943, Col 2)
HR0 = 3
// @from(Ln 402944, Col 2)
RQ9
// @from(Ln 402945, Col 4)
jQ9 = w(() => {
  j5();
  DQ();
  t4();
  T1();
  Z0();
  zR0();
  v1();
  A0();
  A0();
  OQ9 = c(Sg(), 1);
  RQ9 = class RQ9 extends Error {
    constructor() {
      super("Download stalled: no data received for 60 seconds");
      this.name = "StallTimeoutError"
    }
  }
})
// @from(Ln 402968, Col 0)
function h3A() {
  if (a1(void 0)) return !0;
  if (iX(void 0)) return !1;
  return ZZ("tengu_pid_based_version_locking", !1)
}
// @from(Ln 402974, Col 0)
function HE1(A) {
  if (A <= 1) return !1;
  try {
    return process.kill(A, 0), !0
  } catch {
    return !1
  }
}
// @from(Ln 402983, Col 0)
function MY7(A, Q) {
  if (!HE1(A)) return !1;
  if (A === process.pid) return !0;
  try {
    let B = jaA(A);
    if (!B) return !0;
    let G = B.toLowerCase(),
      Z = Q.toLowerCase();
    return G.includes("claude") || G.includes(Z)
  } catch {
    return !0
  }
}
// @from(Ln 402997, Col 0)
function QgA(A) {
  let Q = vA();
  try {
    if (!Q.existsSync(A)) return null;
    let B = Q.readFileSync(A, {
      encoding: "utf8"
    });
    if (!B || B.trim() === "") return null;
    let G = AQ(B);
    if (typeof G.pid !== "number" || !G.version || !G.execPath) return null;
    return G
  } catch {
    return null
  }
}
// @from(Ln 403013, Col 0)
function EE1(A) {
  let Q = QgA(A);
  if (!Q) return !1;
  let {
    pid: B,
    execPath: G
  } = Q;
  if (!HE1(B)) return !1;
  if (!MY7(B, G)) return k(`Lock PID ${B} is running but does not appear to be Claude - treating as stale`), !1;
  let Z = vA();
  try {
    let Y = Z.statSync(A);
    if (Date.now() - Y.mtimeMs > OY7) {
      if (!HE1(B)) return !1
    }
  } catch {}
  return !0
}
// @from(Ln 403032, Col 0)
function RY7(A, Q) {
  let B = vA(),
    G = `${A}.tmp.${process.pid}.${Date.now()}`;
  try {
    bB(G, eA(Q, null, 2), {
      encoding: "utf8",
      flush: !0
    }), B.renameSync(G, A)
  } catch (Z) {
    try {
      if (B.existsSync(G)) B.unlinkSync(G)
    } catch {}
    throw Z
  }
}
// @from(Ln 403047, Col 0)
async function PQ9(A, Q) {
  let B = vA(),
    G = LY7(A);
  if (EE1(Q)) {
    let Y = QgA(Q);
    return k(`Cannot acquire lock for ${G} - held by PID ${Y?.pid}`), null
  }
  let Z = {
    pid: process.pid,
    version: G,
    execPath: process.execPath,
    acquiredAt: Date.now()
  };
  try {
    if (RY7(Q, Z), QgA(Q)?.pid !== process.pid) return null;
    return k(`Acquired PID lock for ${G} (PID ${process.pid})`), () => {
      try {
        if (QgA(Q)?.pid === process.pid) B.unlinkSync(Q), k(`Released PID lock for ${G}`)
      } catch (J) {
        k(`Failed to release lock for ${G}: ${J}`)
      }
    }
  } catch (Y) {
    return k(`Failed to acquire lock for ${G}: ${Y}`), null
  }
}
// @from(Ln 403073, Col 0)
async function SQ9(A, Q) {
  let B = await PQ9(A, Q);
  if (!B) return !1;
  let G = () => {
    try {
      B()
    } catch {}
  };
  return process.on("exit", G), process.on("SIGINT", G), process.on("SIGTERM", G), !0
}
// @from(Ln 403083, Col 0)
async function xQ9(A, Q, B) {
  let G = await PQ9(A, Q);
  if (!G) return !1;
  try {
    return await B(), !0
  } finally {
    G()
  }
}
// @from(Ln 403093, Col 0)
function $R0(A) {
  let Q = vA(),
    B = [];
  if (!Q.existsSync(A)) return B;
  try {
    let G = Q.readdirStringSync(A).filter((Z) => Z.endsWith(".lock"));
    for (let Z of G) {
      let Y = TQ9(A, Z),
        J = QgA(Y);
      if (J) B.push({
        version: J.version,
        pid: J.pid,
        isProcessRunning: HE1(J.pid),
        execPath: J.execPath,
        acquiredAt: new Date(J.acquiredAt),
        lockFilePath: Y
      })
    }
  } catch (G) {
    e(G instanceof Error ? G : Error(`Failed to get lock info: ${G}`))
  }
  return B
}
// @from(Ln 403117, Col 0)
function zE1(A) {
  let Q = vA(),
    B = 0;
  if (!Q.existsSync(A)) return 0;
  try {
    let G = Q.readdirStringSync(A).filter((Z) => Z.endsWith(".lock"));
    for (let Z of G) {
      let Y = TQ9(A, Z);
      try {
        if (Q.lstatSync(Y).isDirectory()) Q.rmSync(Y, {
          recursive: !0,
          force: !0
        }), B++, k(`Cleaned up legacy directory lock: ${Z}`);
        else if (!EE1(Y)) Q.unlinkSync(Y), B++, k(`Cleaned up stale lock: ${Z}`)
      } catch {}
    }
  } catch (G) {
    e(G instanceof Error ? G : Error(`Failed to cleanup stale locks: ${G}`))
  }
  return B
}
// @from(Ln 403138, Col 4)
OY7 = 7200000
// @from(Ln 403139, Col 4)
CR0 = w(() => {
  DQ();
  T1();
  v1();
  TaA();
  w6();
  fQ();
  A0();
  A0()
})
// @from(Ln 403181, Col 0)
function Zp() {
  let A = l0.platform,
    Q = process.arch === "x64" ? "x64" : process.arch === "arm64" ? "arm64" : null;
  if (!Q) {
    let B = Error(`Unsupported architecture: ${process.arch}`);
    throw k(`Native installer does not support architecture: ${process.arch}`, {
      level: "error"
    }), B
  }
  if (A === "linux" && wq.isMuslEnvironment()) return `linux-${Q}-musl`;
  return `${A}-${Q}`
}
// @from(Ln 403194, Col 0)
function FE1(A) {
  return A.startsWith("win32") ? "claude.exe" : "claude"
}
// @from(Ln 403198, Col 0)
function Ie() {
  let A = Zp(),
    Q = FE1(A);
  return {
    versions: IW(wQ9(), "claude", "versions"),
    staging: IW(NQ9(), "claude", "staging"),
    locks: IW(VE1(), "claude", "locks"),
    executable: IW(LQ9(), Q)
  }
}
// @from(Ln 403208, Col 0)
async function Xe(A) {
  try {
    let Q = await q$(A);
    if (!Q.isFile() || Q.size === 0) return !1;
    return await PY7(A, TY7.X_OK), !0
  } catch {
    return !1
  }
}
// @from(Ln 403217, Col 0)
async function kQ9(A) {
  let Q = Ie(),
    B = [Q.versions, Q.staging, Q.locks];
  await Promise.all(B.map((Y) => g3A(Y, {
    recursive: !0
  })));
  let G = Yp(Q.executable);
  await g3A(G, {
    recursive: !0
  });
  let Z = IW(Q.versions, A);
  try {
    await q$(Z)
  } catch {
    await bY7(Z, "", {
      encoding: "utf8"
    })
  }
  return {
    stagingPath: IW(Q.staging, A),
    installPath: Z
  }
}
// @from(Ln 403240, Col 0)
async function hY7(A, Q, B = 0) {
  let G = Ie(),
    Z = wR0(G, A);
  if (await g3A(G.locks, {
      recursive: !0
    }), h3A()) {
    let J = 0,
      X = B + 1,
      I = B > 0 ? 1000 : 100,
      D = B > 0 ? 5000 : 500;
    while (J < X) {
      if (await xQ9(A, Z, async () => {
          try {
            await Q()
          } catch (K) {
            throw e(K instanceof Error ? K : Error(String(K))), K
          }
        })) return l("tengu_version_lock_acquired", {
        is_pid_based: !0,
        is_lifetime_lock: !1,
        attempts: J + 1
      }), !0;
      if (J++, J < X) {
        let K = Math.min(I * Math.pow(2, J - 1), D);
        await new Promise((V) => setTimeout(V, K))
      }
    }
    return l("tengu_version_lock_failed", {
      is_pid_based: !0,
      is_lifetime_lock: !1,
      attempts: X
    }), CE1(A, Error("Lock held by another process")), !1
  }
  let Y = null;
  try {
    try {
      Y = await UE1.default.lock(A, {
        stale: NR0,
        retries: {
          retries: B,
          minTimeout: B > 0 ? 1000 : 100,
          maxTimeout: B > 0 ? 5000 : 500
        },
        lockfilePath: Z,
        onCompromised: (J) => {
          k(`NON-FATAL: Version lock was compromised during operation: ${J.message}`, {
            level: "info"
          })
        }
      })
    } catch (J) {
      return l("tengu_version_lock_failed", {
        is_pid_based: !1,
        is_lifetime_lock: !1
      }), CE1(A, J), !1
    }
    try {
      return await Q(), l("tengu_version_lock_acquired", {
        is_pid_based: !1,
        is_lifetime_lock: !1
      }), !0
    } catch (J) {
      throw e(J instanceof Error ? J : Error(String(J))), J
    }
  } finally {
    if (Y) await Y()
  }
}
// @from(Ln 403308, Col 0)
async function bQ9(A, Q) {
  await g3A(Yp(Q), {
    recursive: !0
  });
  let B = `${Q}.tmp.${process.pid}.${Date.now()}`;
  try {
    await UR0(A, B), await SY7(B, 493), await $E1(B, Q), k(`Atomically installed binary to ${Q}`)
  } catch (G) {
    try {
      await Jp(B)
    } catch {}
    throw G
  }
}
// @from(Ln 403322, Col 0)
async function gY7(A, Q) {
  try {
    let B = IW(A, "node_modules", "@anthropic-ai"),
      Z = (await MzA(B)).find((J) => J.startsWith("claude-cli-native-"));
    if (!Z) {
      l("tengu_native_install_package_failure", {
        stage_find_package: !0,
        error_package_not_found: !0
      });
      let J = Error("Could not find platform-specific native package");
      throw RzA.captureException(J), J
    }
    let Y = IW(B, Z, "cli");
    try {
      await q$(Y)
    } catch {
      l("tengu_native_install_package_failure", {
        stage_binary_exists: !0,
        error_binary_not_found: !0
      });
      let J = Error("Native binary not found in staged package");
      throw RzA.captureException(J), J
    }
    await bQ9(Y, Q), await qE1(A, {
      recursive: !0,
      force: !0
    }), l("tengu_native_install_package_success", {})
  } catch (B) {
    let G = B instanceof Error ? B.message : String(B);
    if (!G.includes("Could not find platform-specific") && !G.includes("Native binary not found")) l("tengu_native_install_package_failure", {
      stage_atomic_move: !0,
      error_move_failed: !0
    }), RzA.captureException(B);
    throw e(B instanceof Error ? B : Error(G)), B
  }
}
// @from(Ln 403358, Col 0)
async function uY7(A, Q) {
  try {
    let B = Zp(),
      G = FE1(B),
      Z = IW(A, G);
    try {
      await q$(Z)
    } catch {
      l("tengu_native_install_binary_failure", {
        stage_binary_exists: !0,
        error_binary_not_found: !0
      });
      let Y = Error("Staged binary not found");
      throw RzA.captureException(Y), Y
    }
    await bQ9(Z, Q), await qE1(A, {
      recursive: !0,
      force: !0
    }), l("tengu_native_install_binary_success", {})
  } catch (B) {
    let G = B instanceof Error ? B.message : String(B);
    if (!G.includes("Staged binary not found")) l("tengu_native_install_binary_failure", {
      stage_atomic_move: !0,
      error_move_failed: !0
    }), RzA.captureException(B);
    throw e(B instanceof Error ? B : Error(G)), B
  }
}
// @from(Ln 403386, Col 0)
async function mY7(A, Q, B) {
  if (B === "npm") await gY7(A, Q);
  else await uY7(A, Q)
}
// @from(Ln 403390, Col 0)
async function dY7(A, Q) {
  let {
    stagingPath: B,
    installPath: G
  } = await kQ9(A), {
    executable: Z
  } = Ie(), Y = `${B}.${process.pid}.${Date.now()}`, J = !await fQ9(A) || Q;
  if (J) {
    k(Q ? `Force reinstalling native installer version ${A}` : `Downloading native installer version ${A}`);
    let X = await _Q9(A, Y);
    await mY7(Y, G, X)
  } else k(`Version ${A} already installed, updating symlink`);
  if (await pY7(Z), await lY7(Z, G), !await Xe(Z)) {
    let X = !1;
    try {
      await q$(G), X = !0
    } catch {}
    throw Error(`Failed to create executable at ${Z}. Source file exists: ${X}. Check write permissions to ${Z}.`)
  }
  return J
}
// @from(Ln 403411, Col 0)
async function fQ9(A) {
  let {
    installPath: Q
  } = await kQ9(A);
  return Xe(Q)
}
// @from(Ln 403417, Col 0)
async function cY7(A, Q = !1) {
  let B = Date.now(),
    G = await ER0(A),
    {
      executable: Z
    } = Ie();
  if (k(`Checking for native installer update to version ${G}`), !Q && G === {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION && await fQ9(G) && await Xe(Z)) return k(`Found ${G} at ${Z}, skipping install`), l("tengu_native_update_complete", {
    latency_ms: Date.now() - B,
    was_new_install: !1,
    was_force_reinstall: !1,
    was_already_running: !0
  }), {
    success: !0
  };
  if (!Q && JEA(G)) return l("tengu_native_update_skipped_minimum_version", {
    latency_ms: Date.now() - B,
    target_version: G
  }), {
    success: !0
  };
  let Y = !1,
    J;
  return Y = await dY7(G, Q), J = Date.now() - B, l("tengu_native_update_complete", {
    latency_ms: J,
    was_new_install: Y,
    was_force_reinstall: Q
  }), k(`Successfully updated to version ${G}`), {
    success: !0
  }
}
// @from(Ln 403454, Col 0)
async function pY7(A) {
  try {
    if ((await q$(A)).isDirectory()) {
      if ((await MzA(A)).length === 0) await kY7(A), k(`Removed empty directory at ${A}`)
    }
  } catch (Q) {
    k(`Could not remove empty directory at ${A}: ${Q}`)
  }
}
// @from(Ln 403463, Col 0)
async function lY7(A, Q) {
  if (Zp().startsWith("win32")) try {
    let J = Yp(A);
    await g3A(J, {
      recursive: !0
    });
    let X = !1;
    try {
      await q$(A), X = !0
    } catch {}
    if (X) {
      try {
        let D = await q$(A),
          W = await q$(Q);
        if (D.size === W.size) return !1
      } catch {}
      let I = `${A}.old.${Date.now()}`;
      await $E1(A, I);
      try {
        await UR0(Q, A);
        try {
          await Jp(I)
        } catch {}
      } catch (D) {
        try {
          await $E1(I, A)
        } catch (W) {
          let K = Error(`Failed to restore old executable: ${W}`, {
            cause: D
          });
          throw e(K), K
        }
        throw D
      }
    } else {
      try {
        await q$(Q)
      } catch {
        throw Error(`Source file does not exist: ${Q}`)
      }
      await UR0(Q, A)
    }
    return !0
  } catch (J) {
    return e(Error(`Failed to copy executable from ${Q} to ${A}: ${J}`)), !1
  }
  let Z = Yp(A);
  try {
    await g3A(Z, {
      recursive: !0
    }), k(`Created directory ${Z} for symlink`)
  } catch (J) {
    return e(Error(`Failed to create directory ${Z}: ${J}`)), !1
  }
  try {
    let J = !1;
    try {
      await q$(A), J = !0
    } catch {}
    if (J) {
      try {
        let X = await qR0(A),
          I = of(Yp(A), X),
          D = of(Q);
        if (I === D) return !1
      } catch {}
      await Jp(A)
    }
  } catch (J) {
    e(Error(`Failed to check/remove existing symlink: ${J}`))
  }
  let Y = `${A}.tmp.${process.pid}.${Date.now()}`;
  try {
    return await xY7(Q, Y), await $E1(Y, A), k(`Atomically updated symlink ${A} -> ${Q}`), !0
  } catch (J) {
    try {
      await Jp(Y)
    } catch {}
    return e(Error(`Failed to create symlink from ${A} to ${Q}: ${J}`)), !1
  }
}
// @from(Ln 403544, Col 0)
async function BgA() {
  if (L1().installMethod === "native") return !0;
  return en("tengu_native_installation", !1)
}
// @from(Ln 403548, Col 0)
async function rf(A = !1) {
  if (a1(process.env.DISABLE_INSTALLATION_CHECKS)) return [];
  let Q = await Et();
  if (Q === "development") return [];
  let B = L1();
  if (!(A || Q === "native" || B.installMethod === "native")) return [];
  let Z = Ie(),
    Y = [],
    J = Yp(Z.executable),
    X = of(J),
    D = Zp().startsWith("win32");
  if (!nO(J)) Y.push({
    message: `installMethod is native, but directory ${J} does not exist`,
    userActionRequired: !0,
    type: "error"
  });
  if (!nO(Z.executable)) Y.push({
    message: `installMethod is native, but claude command not found at ${Z.executable}`,
    userActionRequired: !0,
    type: "error"
  });
  else if (!D) try {
    let K = await qR0(Z.executable),
      V = of(Yp(Z.executable), K);
    if (!nO(V)) Y.push({
      message: `Claude symlink points to non-existent file: ${K}`,
      userActionRequired: !0,
      type: "error"
    });
    else if (!await Xe(V)) Y.push({
      message: `Claude symlink points to invalid binary: ${K}`,
      userActionRequired: !0,
      type: "error"
    })
  } catch {
    if (!await Xe(Z.executable)) Y.push({
      message: `${Z.executable} exists but is not a valid Claude binary`,
      userActionRequired: !0,
      type: "error"
    })
  } else if (!await Xe(Z.executable)) Y.push({
    message: `${Z.executable} exists but is not a valid Claude binary`,
    userActionRequired: !0,
    type: "error"
  });
  if (!(process.env.PATH || "").split(_Y7).some((K) => {
      try {
        let V = of(K);
        if (D) return V.toLowerCase() === X.toLowerCase();
        return V === X
      } catch {
        return !1
      }
    }))
    if (D) {
      let K = J.replace(/\//g, "\\");
      Y.push({
        message: `Native installation exists but ${K} is not in your PATH. Add it by opening: System Properties → Environment Variables → Edit User PATH → New → Add the path above. Then restart your terminal.`,
        userActionRequired: !0,
        type: "path"
      })
    } else {
      let K = YEA(),
        F = Ft()[K],
        H = F ? F.replace(vQ9(), "~") : "your shell config file";
      Y.push({
        message: `Native installation exists but ~/.local/bin is not in your PATH. Run:

echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${H} && source ${H}`,
        userActionRequired: !0,
        type: "path"
      })
    } return Y
}
// @from(Ln 403622, Col 0)
async function sf(A, Q = !1, B = !1) {
  if (!Q && !await BgA()) return {
    latestVersion: null,
    wasUpdated: !1
  };
  let G = await ER0(A),
    Z = await cY7(A, B);
  if (!Z.success) return {
    latestVersion: null,
    wasUpdated: !1,
    lockFailed: Z.lockFailed,
    lockHolderPid: Z.lockHolderPid
  };
  if (G || Z.success) {
    if (L1().installMethod !== "native") S0((J) => ({
      ...J,
      installMethod: "native",
      autoUpdates: !1,
      autoUpdatesProtectedForNative: !0
    })), k('Native installer: Set installMethod to "native" and disabled legacy auto-updater for protection')
  }
  return {
    latestVersion: G,
    wasUpdated: Z.success,
    lockFailed: !1
  }
}
// @from(Ln 403649, Col 0)
async function iY7(A) {
  try {
    if (nO(A)) {
      let Q = await qR0(A),
        B = of(Yp(A), Q);
      if (nO(B) && await Xe(B)) return B
    }
  } catch {}
  return null
}
// @from(Ln 403660, Col 0)
function wR0(A, Q) {
  let B = jY7(Q);
  return IW(A.locks, `${B}.lock`)
}
// @from(Ln 403664, Col 0)
async function LR0() {
  let A = Ie();
  if (!process.execPath.includes(A.versions)) return;
  try {
    let Q = of(process.execPath),
      B = wR0(A, Q);
    if (await g3A(A.locks, {
        recursive: !0
      }), !nO(Q)) {
      k(`Cannot lock current version - file does not exist: ${Q}`, {
        level: "info"
      });
      return
    }
    if (h3A()) {
      if (!await SQ9(Q, B)) {
        l("tengu_version_lock_failed", {
          is_pid_based: !0,
          is_lifetime_lock: !0
        }), CE1(Q, Error("Lock already held by another process"));
        return
      }
      l("tengu_version_lock_acquired", {
        is_pid_based: !0,
        is_lifetime_lock: !0
      }), k(`Acquired PID lock on running version: ${Q}`)
    } else {
      let G;
      try {
        G = await UE1.default.lock(Q, {
          stale: NR0,
          retries: 0,
          lockfilePath: B,
          onCompromised: (Z) => {
            k(`NON-FATAL: Lock on running version was compromised: ${Z.message}`, {
              level: "info"
            })
          }
        }), l("tengu_version_lock_acquired", {
          is_pid_based: !1,
          is_lifetime_lock: !0
        }), k(`Acquired mtime-based lock on running version: ${Q}`), C6(async () => {
          try {
            await G?.()
          } catch {}
        })
      } catch (Z) {
        l("tengu_version_lock_failed", {
          is_pid_based: !1,
          is_lifetime_lock: !0
        }), CE1(Q, Z);
        return
      }
    }
  } catch (Q) {
    k(`NON-FATAL: Failed to lock current version during execution ${Q instanceof Error?Q.message:String(Q)}`, {
      level: "info"
    })
  }
}
// @from(Ln 403725, Col 0)
function CE1(A, Q) {
  let B = `NON-FATAL: Lock acquisition failed for ${A} (expected in multi-process scenarios)`,
    G = Q instanceof Error ? Error(B, {
      cause: Q
    }) : Error(`${B}: ${Q}`);
  e(G)
}
// @from(Ln 403732, Col 0)
async function OR0() {
  if (await Promise.resolve(), !await BgA()) return;
  let A = Ie();
  if (Zp().startsWith("win32")) try {
    let B = Yp(A.executable);
    if (nO(B)) {
      let Z = (await MzA(B)).filter((J) => J.startsWith("claude.exe.old.") && J.match(/claude\.exe\.old\.\d+$/)),
        Y = 0;
      for (let J of Z) try {
        let X = IW(B, J);
        await Jp(X), Y++
      } catch {}
      if (Y > 0) k(`Cleaned up ${Y} old Windows executables on startup`)
    }
  } catch (B) {
    k(`Failed to clean up old Windows executables: ${B}`)
  }
  if (nO(A.staging)) try {
    let B = await MzA(A.staging),
      G = Date.now() - 3600000,
      Z = 0;
    for (let Y of B) {
      let J = IW(A.staging, Y);
      try {
        if ((await q$(J)).mtime.getTime() < G) await qE1(J, {
          recursive: !0,
          force: !0
        }), Z++, k(`Cleaned up old staging directory: ${Y}`)
      } catch {}
    }
    if (Z > 0) k(`Cleaned up ${Z} orphaned staging directories`), l("tengu_native_staging_cleanup", {
      cleaned_count: Z
    })
  } catch (B) {
    k(`Failed to clean up staging directories: ${B}`)
  }
  if (nO(A.versions)) try {
    let B = await MzA(A.versions),
      G = Date.now() - 3600000,
      Z = 0;
    for (let Y of B)
      if (Y.match(/\.tmp\.\d+\.\d+$/)) {
        let J = IW(A.versions, Y);
        try {
          if ((await q$(J)).mtime.getTime() < G) await Jp(J), Z++, k(`Cleaned up orphaned temp install file: ${Y}`)
        } catch {}
      } if (Z > 0) k(`Cleaned up ${Z} orphaned temp install files`), l("tengu_native_temp_files_cleanup", {
      cleaned_count: Z
    })
  } catch (B) {
    k(`Failed to clean up temp install files: ${B}`)
  }
  if (h3A() && nO(A.locks)) {
    let B = zE1(A.locks);
    if (B > 0) k(`Cleaned up ${B} stale version locks`), l("tengu_native_stale_locks_cleanup", {
      cleaned_count: B
    })
  }
  if (!nO(A.versions)) return;
  try {
    let B = await MzA(A.versions),
      G = [];
    for (let K of B) {
      let V = IW(A.versions, K);
      try {
        let F = await q$(V);
        if (F.isFile() && (F.size === 0 || await Xe(V))) G.push(K)
      } catch {}
    }
    let Z = process.execPath,
      Y = Z && Z.includes(A.versions) ? of(Z) : null,
      J = new Set([...Y ? [Y] : []]),
      X = await iY7(A.executable);
    if (X) J.add(X);
    for (let K of G) {
      let V = of(A.versions, K);
      if (J.has(V)) continue;
      let F = wR0(A, V),
        H = !1;
      if (h3A()) H = EE1(F);
      else try {
        H = await UE1.default.check(V, {
          stale: NR0,
          lockfilePath: F
        })
      } catch {
        H = !1
      }
      if (H) J.add(V), k(`Protecting locked version from cleanup: ${K}`)
    }
    let I = [];
    for (let K of G) {
      let V = of(A.versions, K);
      if (J.has(V)) continue;
      try {
        let F = await q$(V);
        I.push({
          name: K,
          path: V,
          mtime: F.mtime
        })
      } catch {}
    }
    I.sort((K, V) => V.mtime.getTime() - K.mtime.getTime());
    let D = I.slice(fY7);
    if (D.length === 0) return;
    let W = 0;
    for (let K of D) try {
      if (await hY7(K.path, async () => {
          await Jp(K.path)
        })) W++;
      else k(`Skipping deletion of ${K.name} - locked by another process`)
    } catch (V) {
      e(Error(`Failed to delete version ${K.name}: ${V}`))
    }
    if (W > 0) l("tengu_native_version_cleanup", {
      deleted_count: W,
      protected_count: J.size,
      retained_count: I.length - W
    })
  } catch (B) {
    e(Error(`Version cleanup failed: ${B}`))
  }
}
// @from(Ln 403856, Col 0)
async function nY7(A) {
  let Q = A;
  if ((await yY7(A)).isSymbolicLink()) Q = await vY7(A);
  return Q.endsWith(".js") || Q.includes("node_modules")
}
// @from(Ln 403861, Col 0)
async function GgA() {
  let A = Ie();
  try {
    if (!nO(A.executable)) return;
    if (await nY7(A.executable)) {
      k(`Skipping removal of ${A.executable} - appears to be npm-managed`);
      return
    }
    await Jp(A.executable), k(`Removed claude symlink at ${A.executable}`)
  } catch (Q) {
    e(Error(`Failed to remove claude symlink: ${Q}`))
  }
}
// @from(Ln 403875, Col 0)
function ZgA() {
  let A = [],
    Q = Ft();
  for (let [B, G] of Object.entries(Q)) try {
    let Z = tbA(G);
    if (!Z) continue;
    let {
      filtered: Y,
      hadAlias: J
    } = kK1(Z);
    if (J) bK1(G, Y), A.push({
      message: `Removed claude alias from ${G}. Run: unalias claude`,
      userActionRequired: !0,
      type: "alias"
    }), k(`Cleaned up claude alias from ${B} config`)
  } catch (Z) {
    e(Z instanceof Error ? Z : Error(String(Z))), A.push({
      message: `Failed to clean up ${G}: ${Z}`,
      userActionRequired: !1,
      type: "error"
    })
  }
  return A
}
// @from(Ln 403899, Col 0)
async function aY7(A) {
  try {
    let Q = await J2("npm", ["config", "get", "prefix"]);
    if (Q.code !== 0 || !Q.stdout) return {
      success: !1,
      error: "Failed to get npm global prefix"
    };
    let B = Q.stdout.trim(),
      G = !1;
    async function Z(Y, J) {
      try {
        return await q$(Y), await Jp(Y), k(`Manually removed ${J}: ${Y}`), !0
      } catch {
        return !1
      }
    }
    if (Zp() === "windows") {
      let Y = IW(B, "claude.cmd"),
        J = IW(B, "claude.ps1"),
        X = IW(B, "claude");
      if (await Z(Y, "bin script")) G = !0;
      if (await Z(J, "PowerShell script")) G = !0;
      if (await Z(X, "bin executable")) G = !0
    } else {
      let Y = IW(B, "bin", "claude");
      if (await Z(Y, "bin symlink")) G = !0
    }
    if (G) {
      k(`Successfully removed ${A} manually`);
      let Y = Zp() === "windows" ? IW(B, "node_modules", A) : IW(B, "lib", "node_modules", A);
      return {
        success: !0,
        warning: `${A} executables removed, but node_modules directory was left intact for safety. You may manually delete it later at: ${Y}`
      }
    } else return {
      success: !1
    }
  } catch (Q) {
    return k(`Manual removal failed: ${Q}`, {
      level: "error"
    }), {
      success: !1,
      error: `Manual removal failed: ${Q}`
    }
  }
}
// @from(Ln 403945, Col 0)
async function yQ9(A) {
  let {
    code: Q,
    stderr: B
  } = await J2("npm", ["uninstall", "-g", A], {
    cwd: process.cwd()
  });
  if (Q === 0) return k(`Removed global npm installation of ${A}`), {
    success: !0
  };
  else if (B && !B.includes("npm ERR! code E404")) {
    if (B.includes("npm error code ENOTEMPTY")) {
      k(`Failed to uninstall global npm package ${A}: ${B}`, {
        level: "error"
      }), k("Attempting manual removal due to ENOTEMPTY error");
      let G = await aY7(A);
      if (G.success) return {
        success: !0,
        warning: G.warning
      };
      else if (G.error) return {
        success: !1,
        error: `Failed to remove global npm installation of ${A}: ${B}. Manual removal also failed: ${G.error}`
      }
    }
    return k(`Failed to uninstall global npm package ${A}: ${B}`, {
      level: "error"
    }), {
      success: !1,
      error: `Failed to remove global npm installation of ${A}: ${B}`
    }
  }
  return {
    success: !1
  }
}
// @from(Ln 403981, Col 0)
async function YgA() {
  let A = [],
    Q = [],
    B = 0,
    G = await yQ9("@anthropic-ai/claude-code");
  if (G.success) {
    if (B++, G.warning) Q.push(G.warning)
  } else if (G.error) A.push(G.error);
  if ({
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.PACKAGE_URL && {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.PACKAGE_URL !== "@anthropic-ai/claude-code") {
    let Y = await yQ9({
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.PACKAGE_URL);
    if (Y.success) {
      if (B++, Y.warning) Q.push(Y.warning)
    } else if (Y.error) A.push(Y.error)
  }
  let Z = IW(vQ9(), ".claude", "local");
  if (nO(Z)) try {
    await qE1(Z, {
      recursive: !0,
      force: !0
    }), B++, k(`Removed local installation at ${Z}`)
  } catch (Y) {
    A.push(`Failed to remove ${Z}: ${Y}`), k(`Failed to remove local installation: ${Y}`, {
      level: "error"
    })
  }
  return {
    removed: B,
    errors: A,
    warnings: Q
  }
}
// @from(Ln 404033, Col 4)
UE1
// @from(Ln 404033, Col 9)
RzA
// @from(Ln 404033, Col 14)
fY7 = 2
// @from(Ln 404034, Col 2)
NR0 = 604800000
// @from(Ln 404035, Col 4)
zR0 = w(() => {
  p3();
  G0A();
  t4();
  w6();
  v1();
  nX();
  Z0();
  T1();
  FR0();
  GQ();
  fK1();
  Vt();
  bc();
  jQ9();
  jf();
  fQ();
  CR0();
  UE1 = c(qi(), 1), RzA = c(Sg(), 1)
})
// @from(Ln 404055, Col 4)
xx = w(() => {
  zR0()
})
// @from(Ln 404059, Col 0)
function hQ9() {
  return []
}
// @from(Ln 404063, Col 0)
function gQ9(A, Q = null, B) {
  let G = A?.find((Z) => Z.name === "ide");
  if (Q) {
    let Z = EK(Q.ideType),
      Y = Rx(Q.ideType) ? "plugin" : "extension";
    if (Q.error) return [{
      label: "IDE",
      value: u3A.createElement(C, null, sQ("error", B)(tA.cross), " Error installing ", Z, " ", Y, ": ", Q.error, `
`, "Please restart your IDE and try again.")
    }];
    if (Q.installed)
      if (G && G.type === "connected")
        if (Q.installedVersion !== G.serverInfo?.version) return [{
          label: "IDE",
          value: `Connected to ${Z} ${Y} version ${Q.installedVersion} (server version: ${G.serverInfo?.version})`
        }];
        else return [{
          label: "IDE",
          value: `Connected to ${Z} ${Y} version ${Q.installedVersion}`
        }];
    else return [{
      label: "IDE",
      value: `Installed ${Z} ${Y}`
    }]
  } else if (G) {
    let Z = ML0(G) ?? "IDE";
    if (G.type === "connected") return [{
      label: "IDE",
      value: `Connected to ${Z} extension`
    }];
    else return [{
      label: "IDE",
      value: `${sQ("error",B)(tA.cross)} Not connected to ${Z}`
    }]
  }
  return []
}
// @from(Ln 404101, Col 0)
function uQ9(A = [], Q) {
  let B = A.filter((G) => G.name !== "ide");
  if (!B.length) return [];
  return [{
    label: "MCP servers",
    value: u3A.createElement(T, {
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: 1,
      flexShrink: 99
    }, B.map((G, Z) => {
      let Y = "";
      if (G.type === "connected") Y = sQ("success", Q)(tA.tick);
      else if (G.type === "pending") Y = sQ("inactive", Q)(tA.radioOff);
      else if (G.type === "needs-auth") Y = sQ("warning", Q)(tA.triangleUpOutline);
      else if (G.type === "failed") Y = sQ("error", Q)(tA.cross);
      else Y = sQ("error", Q)(tA.cross);
      let J = Z < B.length - 1 ? "," : "";
      return u3A.createElement(C, {
        key: Z
      }, G.name, " ", Y, J)
    }))
  }]
}
// @from(Ln 404126, Col 0)
function mQ9() {
  let A = N4A(),
    Q = w4A(),
    B = [];
  if (A.forEach((G) => {
      let Z = k6(G.path);
      B.push(`Large ${Z} will impact performance (${X8(G.content.length)} chars > ${X8(xd)})`)
    }), Q && Q.content.length > hVA) B.push(`CLAUDE.md entries marked as IMPORTANT exceed ${X8(hVA)} characters (${X8(Q.content.length)} chars)`);
  return B
}
// @from(Ln 404137, Col 0)
function dQ9() {
  return [{
    label: "Setting sources",
    value: tQA().filter((G) => {
      let Z = dB(G);
      return Z !== null && Object.keys(Z).length > 0
    }).map((G) => {
      if (G === "policySettings") {
        let Z = oQ9();
        if (Z === null) return null;
        return Z === "remote" ? "Enterprise managed settings (remote)" : "Enterprise managed settings (local)"
      }
      return SFB(G)
    }).filter((G) => G !== null)
  }]
}
// @from(Ln 404153, Col 0)
async function cQ9() {
  return (await rf()).map((Q) => Q.message)
}
// @from(Ln 404156, Col 0)
async function pQ9() {
  let A = await zt(),
    Q = [],
    {
      errors: B
    } = kP();
  if (B.length > 0) {
    let Z = Array.from(new Set(B.map((Y) => Y.file))).join(", ");
    Q.push(`Found invalid settings files: ${Z}. They will be ignored.`)
  }
  if (A.multipleInstallations.length > 1) Q.push(`Multiple installations detected (${A.multipleInstallations.length} found)`);
  if (A.warnings.forEach((G) => {
      Q.push(G.issue)
    }), A.hasUpdatePermissions === !1) Q.push("No write permissions for auto-updates (requires sudo)");
  if (A.configInstallMethod !== "not set") {
    let Z = {
      "npm-local": "local",
      "npm-global": "global",
      native: "native",
      development: "development",
      unknown: "unknown"
    } [A.installationType];
    if (Z && Z !== A.configInstallMethod) Q.push(`Installation config mismatch: running ${A.installationType} but config says ${A.configInstallMethod}`)
  }
  return Q
}
// @from(Ln 404183, Col 0)
function lQ9() {
  let A = cA1();
  if (!A) return [];
  let Q = [];
  if (A.subscription) Q.push({
    label: "Login method",
    value: `${A.subscription} Account`
  });
  if (A.tokenSource) Q.push({
    label: "Auth token",
    value: A.tokenSource
  });
  if (A.apiKeySource) Q.push({
    label: "API key",
    value: A.apiKeySource
  });
  if (A.organization && !process.env.IS_DEMO) Q.push({
    label: "Organization",
    value: A.organization
  });
  if (A.email && !process.env.IS_DEMO) Q.push({
    label: "Email",
    value: A.email
  });
  return Q
}
// @from(Ln 404210, Col 0)
function iQ9() {
  let A = R4(),
    Q = [];
  if (A !== "firstParty") {
    let Z = {
      bedrock: "AWS Bedrock",
      vertex: "Google Vertex AI",
      foundry: "Microsoft Foundry"
    } [A];
    Q.push({
      label: "API provider",
      value: Z
    })
  }
  if (A === "firstParty") {
    let Z = process.env.ANTHROPIC_BASE_URL;
    if (Z) Q.push({
      label: "Anthropic base URL",
      value: Z
    })
  } else if (A === "bedrock") {
    let Z = process.env.BEDROCK_BASE_URL;
    if (Z) Q.push({
      label: "Bedrock base URL",
      value: Z
    });
    if (Q.push({
        label: "AWS region",
        value: lAA()
      }), a1(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) Q.push({
      value: "AWS auth skipped"
    })
  } else if (A === "vertex") {
    let Z = process.env.VERTEX_BASE_URL;
    if (Z) Q.push({
      label: "Vertex base URL",
      value: Z
    });
    let Y = process.env.ANTHROPIC_VERTEX_PROJECT_ID;
    if (Y) Q.push({
      label: "GCP project",
      value: Y
    });
    if (Q.push({
        label: "Default region",
        value: HT()
      }), a1(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)) Q.push({
      value: "GCP auth skipped"
    })
  } else if (A === "foundry") {
    let Z = process.env.ANTHROPIC_FOUNDRY_BASE_URL;
    if (Z) Q.push({
      label: "Microsoft Foundry base URL",
      value: Z
    });
    let Y = process.env.ANTHROPIC_FOUNDRY_RESOURCE;
    if (Y) Q.push({
      label: "Microsoft Foundry resource",
      value: Y
    });
    if (a1(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH)) Q.push({
      value: "Microsoft Foundry auth skipped"
    })
  }
  let B = bn();
  if (B) Q.push({
    label: "Proxy",
    value: B
  });
  let G = tT();
  if (process.env.NODE_EXTRA_CA_CERTS) Q.push({
    label: "Additional CA cert(s)",
    value: process.env.NODE_EXTRA_CA_CERTS
  });
  if (G) {
    if (G.cert && process.env.CLAUDE_CODE_CLIENT_CERT) Q.push({
      label: "mTLS client cert",
      value: process.env.CLAUDE_CODE_CLIENT_CERT
    });
    if (G.key && process.env.CLAUDE_CODE_CLIENT_KEY) Q.push({
      label: "mTLS client key",
      value: process.env.CLAUDE_CODE_CLIENT_KEY
    })
  }
  return Q
}
// @from(Ln 404297, Col 0)
function nQ9(A) {
  let Q = eT(A);
  if (A === null && qB()) {
    let B = LOA();
    if (MR()) Q = `${I1.bold("Default")} ${B}`;
    else Q = `${I1.bold("Sonnet")} ${B}`
  }
  return Q
}
// @from(Ln 404306, Col 4)
u3A
// @from(Ln 404307, Col 4)
aQ9 = w(() => {
  fA();
  xx();
  Q2();
  TX();
  nz();
  y9();
  MD();
  l2();
  Z3();
  jf();
  fQ();
  fn();
  cJA();
  GB();
  NJ();
  B2();
  Q2();
  YI();
  u3A = c(QA(), 1)
})
// @from(Ln 404329, Col 0)
function oY7() {
  let A = q0(),
    B = tQ9(A) ?? g3.createElement(C, {
      dimColor: !0
    }, "/rename to add a name");
  return [{
    label: "Version",
    value: {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION
  }, {
    label: "Session name",
    value: B
  }, {
    label: "Session ID",
    value: A
  }, {
    label: "cwd",
    value: o1()
  }, ...lQ9(), ...iQ9()]
}
// @from(Ln 404356, Col 0)
function rY7({
  appState: A,
  theme: Q,
  context: B
}) {
  return [{
    label: "Model",
    value: nQ9(A.mainLoopModel)
  }, ...gQ9(A.mcp.clients, B.options.ideInstallationStatus, Q), ...uQ9(A.mcp.clients, Q), {
    label: "Memory",
    value: g3.createElement(UQ9, {
      context: B,
      flat: !0
    })
  }, ...hQ9(), ...dQ9()]
}
// @from(Ln 404372, Col 0)
async function sY7() {
  return [...await BgA() ? await cQ9() : [], ...await pQ9(), ...mQ9()]
}
// @from(Ln 404376, Col 0)
function tY7({
  value: A
}) {
  if (Array.isArray(A)) return g3.createElement(T, {
    flexWrap: "wrap",
    columnGap: 1,
    flexShrink: 99
  }, A.map((Q, B) => {
    return g3.createElement(C, {
      key: B
    }, Q, B < A.length - 1 ? "," : "")
  }));
  if (typeof A === "string") return g3.createElement(C, null, A);
  return A
}